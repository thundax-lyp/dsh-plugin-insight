# dsh-fund-research

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[9f0344d](https://github.com/PerryLink/dsh-fund-research/tree/9f0344d25f99020cddf8563fc4eb6ebba748c624)

<!-- BEGIN META -->
[![GitHub ★ 66](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=66&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-fund-research) [![npm 30d 3,990](https://img.shields.io/static/v1?label=npm+30d&message=3%2C990&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fund-research) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fund-research)
<!-- END META -->

> **功能**：采集中国公募基金公开数据，确定性计算指标并封存带数字回溯附录的版本化研究报告。

> **亮点**：把公开基金数据提取、确定性指标和逐数字路径附录变为宿主工具，输出可独立保留的版本化资料包，并为缺失字段显式留gaps。其价值是可检查的资料组织，不是自动验证市场事实或预测正确。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

> **主要限制**：asOf只截净值却保留其他当前字段，不能作为全资料历史可得性；verified仅与同快照一致，且核查异常仍封存。review重建snapshot数字而未解析实际报告或校验其hash，恢复和tracking尽力写，不能据封存/完成推完整、无泄漏或不可篡改。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 谁用它，相对模型直接写基金报告新增什么？](#detail-section-11)
  - [Q02 · 数据、离线与asOf日期能保证历史可得性吗？](#detail-section-12)
  - [Q03 · 数字核查、哈希封存与只读复核各保证什么？](#detail-section-13)
  - [Q04 · 恢复、多基金和后台运行有什么实际负担？](#detail-section-14)
  - [Q05 · 谁可试用，哪种新假设有可证伪依据？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要反复整理基金公开资料且能复核口径的研究者，把版本化Markdown/JSON作为可复算底稿，不把它当交易或预测系统。[Q01](#research-q01)

参照模型直接查资料/心算写报告或人工表格拼底稿。增量是统一确定性计算、快照路径和版本交付；公式和基金研究范式为已有方法，不将哈希等同来源真实。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 快照卡与研究工具 | 获取资料/版本化底稿 | 核心来源必需，离线需已存快照 |
| 纯函数指标 | 净值、重仓、经理和简化风格 | 重仓/报价覆盖有限，需独立复算 |
| 数字附录 | 找到快照路径和核查结果 | 一致不是真实，异常也可能封存 |
| 版本文件/hash | 保存可独立阅读和比对的资料 | 逐文件写，非原子/签名 |
| asOf | 截断净值并记录口径 | 非净值字段不受此过滤 |
| resume/追踪 | 复用阶段、与上次资料比较 | 进度/账本尽力写，非强事务 |
| 多基金/后台 | 顺序隔离失败、通过job取结果 | summary含gaps仍可completed |
| 可选Skill/review | 方法论提示和代码复核note | review不解析报告所有数字 |

**流程与依赖**

#### 启动与依赖

| 条件 | 需要程度 | 用途 | 缺失时 |
|---|---|---|---|
| DSH tools/storageDomain | 必需 | 注册工具并保存快照域 | 无注入不能正常激活 |
| 可写工作区reportRoot | 必需 | 写snapshot/report/manifest | 写盘失败可留下部分文件 |
| 公开端点与解析适配 | 在线必需 | 净值核心及可降级持仓/报价 | 核心失败终止，其他列gaps |
| 已存快照 | offline必需 | domain或磁盘重用 | 无匹配截点显式失败 |
| jobs与agent owner | 后台必需 | 主任务job和可选review | 后台拒绝，review可跳过 |
| dataQuality/skills | 可选 | 外部核查/方法论提示 | 内置核查fallback/跳过Skill |

包0.5.3，Node ^22.19.0或>=24.0.0；宿主peer具体组合未运行验收。[Q01](#research-q01) [Q04](#research-q04)

#### 使用步骤

| 阶段 | 动作与责任人 | 结果与异常 |
|---|---|---|
| 准备 | 用户固定宿主、单基金与副本工作区 | 保留原始资料和独立计算基线 |
| 输入 | Agent调用fund_snapshot或fund_research | 指定code/章节/offline/asOf等，不把截点当全部历史可得 |
| 采集 | 插件先缓存再核心/可选来源 | 核心失败终止，缺持仓/报价列gaps |
| 计算封存 | 插件写快照、算指标、核查并写报告 | mismatch仍可封存，需用户检查计数 |
| 后台/恢复 | 可选jobs或resume | summary可含失败，阶段/账本为尽力写 |
| 验收与退出 | 用户独立复算、查日期/hash和覆盖 | 无法解释就停用并保留文件回原资料 |

本轮只读源码，流程是后续验证建议。[Q02](#research-q02) [Q03](#research-q03) [Q05](#research-q05)

**效果与成本**

#### 成本

| 阶段 | 现金与资源 | 人工投入 | 条件/未知 |
|---|---|---|---|
| 首次 | 下载/存储，模型调用可能收费 | 核对宿主、来源和指标基准 | 免key不等于整体零成本，耗时未知 |
| 持续 | 多来源网络/报价及版本磁盘 | 复核gaps、日期、字段和口径 | 顺序多基金不承诺提速；实际请求时延未知 |
| 失败恢复 | 重采集/重写和旧文件保留 | 查部分封存、进度/追踪缺失 | 尽力写不保证resume存在，传signal替代默认请求timeout |
| 退出 | 留Markdown/JSON的存储 | 停用/移除并回独立计算 | 不依赖专有阅读器，仍需保存来源语义 |

没有测准确率/节时/ROI，不填未知为零。[Q04](#research-q04)

#### 效果

| 项目 | 当前源码支持 | 不能推出 |
|---|---|---|
| 确定性数字 | 快照raw到computed纯函数 | 公式/解析在真实数据全正确 |
| 可追溯附录 | 数值路径/核查状态与版本hash | 来源真实、第三方认证或不可篡改 |
| asOf | 净值截点和匹配快照 | 全字段历史无前视 |
| review | 免责声明/缺口文字与重算路径核查 | 检出实际报告所有篡改数字 |
| resume/多基金 | 指纹恢复与单项失败隔离 | 持久exactly-once、并行或全部成功 |

合格底稿仍需用户核对日期、覆盖和独立复算。[Q01](#research-q01) [Q03](#research-q03)

> **思考**：asOf只截净值却保留其他当前字段，不能作为全资料历史可得性；verified仅与同快照一致，且核查异常仍封存。review重建snapshot数字而未解析实际报告或校验其hash，恢复和tracking尽力写，不能据封存/完成推完整、无泄漏或不可篡改。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把公开基金数据提取、确定性指标和逐数字路径附录变为宿主工具，输出可独立保留的版本化资料包，并为缺失字段显式留gaps。其价值是可检查的资料组织，不是自动验证市场事实或预测正确。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

纯函数指标与可选服务降级、带类型工具值利于审计；但asOf范围、report复核覆盖、best-effort状态/账本和逐文件封存均需明确契约，不能照搬为金融审计账本。请求signal与timeout没有合并，取消不回滚文件。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

asOf只截净值却保留其他当前字段，不能作为全资料历史可得性；verified仅与同快照一致，且核查异常仍封存。review重建snapshot数字而未解析实际报告或校验其hash，恢复和tracking尽力写，不能据封存/完成推完整、无泄漏或不可篡改。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

懂基金数据口径者可仅在副本工作区对一支固定离线样本试用，核对来源、日期/覆盖、关键指标和hash，停止于字段漂移、无法复算或状态异常。历史无泄漏回测、交易和报告篡改审计不属于本轮可支持用途；停用后保留Markdown/JSON回原始资料和表格。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认资料底稿和追溯机制，适合懂口径者固定离线样本试用；真实端点、宿主、复算正确率及业务收益未运行验证，历史无泄漏与篡改审计不成立为现有保证。

- 已检查：作者 README、包清单、源码路径 README-zh.md、src/index.ts、src/sources/snapshot.ts、src/metrics/style.ts、src/sources/eastmoney.ts、src/tools/research.ts、src/verify-bridge.ts、src/tools/shared.ts、src/report.ts、src/review.ts、src/run-state.ts、src/tracking.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：inventory覆盖固定组件，人工检查入口、核心采集、快照缓存/cutoff、指标范围、引用核查、封存、恢复/追踪及review。未全面复算所有公式/端点字段或审计所有并发路径；未安装运行目标、测试或外部数据。
- 下一步：下一步用人工复算离线样本检验指标/日期/覆盖，再注入报告数字修改、慢网络、坏进度和部分写入，分别核对hash、review、工具及job状态；双时间方案另做披露日对照。本轮未执行。

**分析版本**

- **仓库**：[PerryLink/dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)
- **版本号**：0.5.3（[固定提交 9f0344d](https://github.com/PerryLink/dsh-fund-research/tree/9f0344d25f99020cddf8563fc4eb6ebba748c624)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

给每来源/字段附观测和可得时间，并区分历史可用与当前补充章节，可研究是否减少旧截点报告的前视混入；固定披露日样本比较泄漏、覆盖和维护成本。无法提供证据就拒用历史字段，收益未验证，不计当前创新。[Q05](#research-q05)

下一步用人工复算离线样本检验指标/日期/覆盖，再注入报告数字修改、慢网络、坏进度和部分写入，分别核对hash、review、工具及job状态；双时间方案另做披露日对照。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 2457 | — | — | 30678 |
| .js | example | 1 | 1 | 1 | 1 | — |
| .mjs | source | 10 | 591 | 403 | 143 | — |
| .ts | source | 25 | 5301 | 3785 | 1170 | — |
| .ts | test | 28 | 3688 | 2985 | 390 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/PerryLink/dsh-fund-research/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/PerryLink/dsh-fund-research/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/PerryLink/dsh-fund-research/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：可追溯基金资料交付链实际证明什么，日期、复核和恢复边界如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁用它，相对模型直接写基金报告新增什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是供DSH加载的公募基金研究插件，真正交付是工作区版本化Markdown、snapshot和manifest，另有轻量快照卡，不是交易接口。需要反复整理中国公募基金公开资料、复算指标和保留数字出处的研究者，可把它作为资料底稿；合格结果应是口径清楚、数字能从对应快照复算、缺失和日期能被读者看见。不能把有一份格式完整报告等同预测有效或投资决策可靠。

入口要求tools和storageDomain，启用后打开存储域，构造fetcher，确实注册fund_snapshot与fund_research两个工具；systemPrompt、jobs、skills和dataQuality均可选，方法论Skill通过filesystem provider挂载且可降级缺省。相对让模型心算并拼引用，computeMetrics集中调用业绩、重仓、风格、经理与基准纯函数，报告正文由代码组装，再逐值映射快照路径。增量是把采集、确定性计算和带出处的资料交付组合成宿主工具，不是发明收益/Sharpe公式。

范围也必须收窄：风格只对有报价的披露重仓做固定市值/PE分档，内部五分位是在这些重仓中排名，并非全市场风格模型；当前持仓不能代表全部资产，统计收益不等同预测能力。作者自述测试数和徽章不作为本轮运行证据。

#### 证据与依据

**依据 1 · 作者声明**：[README-zh.md:82-104](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/README-zh.md#L82-L104)

作者描述报告、快照卡和辅助能力，限定研究用途。

<details>
<summary>查看原文（23行）</summary>

````text
- **asOf 截点** —— `asOfDate`（ISO `YYYY-MM-DD`）把净值序列截断到该日期（含）之前，并在快照与报告中标注截点；非法或未来日期响亮失败。
- **断点续跑** —— `<reportRoot>/.run-state.json` 记录各阶段（快照/报告）进度、时间戳与输入指纹；`resume: true` 从首个未完成阶段继续，复用封存产物，指纹不匹配则拒绝。
- **数据源发现记录** —— 每次采集封存代码生成的 `sources-discovery.json`（端点清单、主/回退源、逐源覆盖与缺口、降级原因），并作为"数据源与缺口声明"并入报告附录。
- **多基金 fan-out** —— `codes` 接受基金代码数组：逐基金独立跑管线、失败隔离（失败项进入汇总缺口），输出汇总卡（code / asOf / seal 哈希 / verdicts / 失败原因）。
- **追踪账本** —— 每次成功封存向 `<reportRoot>/.tracking.jsonl` 确定性追加一行；`includeComparison: true` 时渲染确定性的"与上次对比"章节（净值区间 / 规模 / 前 N 重仓），无上一期记录则声明缺口。
- **只读复核** —— 封存后派生 `fund-review` 只读复核 job（缺口声明完整性、数字回溯表一致性、免责声明）并写回 `review-note.md`；无 jobs 服务时优雅跳过（记录于状态文件）。
- **逐源质量信号** —— 每源携带确定性质量元数据（`requested`/`succeeded`/`fieldsPresent`/`parseWarnings`/`degraded`），呈现在附录并进入工具值，供下游降权（而非硬过滤）低质量源。
- **样本外稳定性摘要** —— `includeWalkForward: true` 追加"样本外稳定性摘要"章节：确定性滚动窗口的收益/夏普符号持续率与均值/标准差，显式标注仅为统计描述、不构成预测。
- **会话审计事件（取决于宿主）** —— 宿主允许仓外事件类型时，`fund-research/snapshot` 与 `fund-research/report` 仅日志事件携带代码、版本目录、manifest 哈希与缺口清单（模型可见 ⟺ 已记录）；在 `0.1.2-alpha.1`–`0.1.5-alpha.1` 宿主上，已知类型目录是构建期生成的仓内清单，门控不追加任何事件，工具结果与封存产物即审计轨迹。
- **方法论 skill** —— 内置 `fund-research` skill 教模型指标口径、缺口处理与合规话术；计算始终在代码里。

## Quick start

```sh
dsh plugin --profile web add github:PerryLink/dsh-fund-research
```

```text
> 用 fund_research 出一份 161725 的研究报告
```

agent 调用 `fund_research({ code: "161725" })`；片刻后工作区内出现：

````

</details>

**依据 2 · 源码核查**：[src/index.ts:119-155](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/index.ts#L119-L155)

启用、存储及两个工具确实接线。

<details>
<summary>查看原文（37行）</summary>

```text
  if (!resolved.enabled) {
    logger.info('disabled: enabled is false — no fund-research capabilities are mounted')
    return
  }

  const domain = await ctx.storageDomain.open(fundResearchDomainSpec)
  ctx.effect(() => () => domain.close(), 'dsh-fund-research: storage domain')

  const fetcher = new PoliteFetcher({
    requestIntervalMs: resolved.requestIntervalMs,
    timeoutMs: resolved.timeoutMs,
    retries: resolved.retries,
  })
  const deps: ToolDeps = {
    ctx,
    config: resolved,
    store: { domain, config: resolved, fetcher },
    logger,
    generator: `dsh-fund-research@${VERSION}`,
  }

  // Service Provider — registers the fund_snapshot / fund_research tools on
  // ctx.tools and the bundled methodology skill on ctx.skills below; every
  // registration is an effect on this fiber.
  ctx.effect(() => ctx.tools.register(buildSnapshotTool(deps)), 'dsh-fund-research: fund_snapshot tool')
  ctx.effect(() => ctx.tools.register(buildResearchTool(deps)), 'dsh-fund-research: fund_research tool')

  // Short role-statement prompt section: the compliance stance and when to use
  // the tools. The assembled prompt is logged via request/header events.
  // Consumer — reads the optional systemPrompt (and skills below) through
  // ctx.get so the plugin still activates when those services are not mounted.
  if (resolved.promptSection) {
    const systemPrompt = ctx.get('systemPrompt') as unknown as SystemPromptLike | undefined
    if (systemPrompt !== undefined && typeof systemPrompt.section === 'function') {
      const tools = ctx.tools as unknown as ToolsLike
      ctx.effect(() => systemPrompt.section({
        name: 'fund-research',
```

</details>

**依据 3 · 源码核查**：[src/index.ts:177-195](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/index.ts#L177-L195)

可选Skill注册并检查fiber是否已释放。

<details>
<summary>查看原文（19行）</summary>

```text
      // A02: the dynamic import opens an await window inside `apply`. If the
      // fiber was disposed while the module resolved, registering now would
      // throw INACTIVE_EFFECT and lose the provider silently; skip instead —
      // the unmounted plugin must not register anything, and a remount runs
      // this whole path again (G-9 roundtrip keeps exactly one provider).
      if (ctx.fiber.uid === null) return
      ctx.effect(() => skills.registerProvider(control => new filesystem.FileSystemSkillProvider(ctx, control as never, {
        providerName: 'dsh-fund-research',
        includeDefaultRoots: false,
        customSkillDirs: [skillsRoot],
        watch: false,
      })), 'dsh-fund-research: skill provider')
    } catch (error) {
      logger.warn(`skill provider unavailable: ${error instanceof Error ? error.message : String(error)}`)
    }
  } else {
    logger.info('skills service or bundled skill not present; skipping the methodology skill')
  }
}
```

</details>

**依据 4 · 源码核查**：[src/sources/snapshot.ts:51-69](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/sources/snapshot.ts#L51-L69)

确定性计算统一入口。

<details>
<summary>查看原文（19行）</summary>

```text
export function computeMetrics(raw: FundSnapshot['raw'], riskFreeRate: number): FundSnapshot['computed'] {
  const windows = decomposePerformance(raw.navTrend, riskFreeRate)
  const latest = raw.navTrend[raw.navTrend.length - 1]
  if (latest === undefined) throw new SourceParseError('snapshot', 'navTrend', 'empty NAV series')
  const manager = managerMetrics(raw.manager, raw.managerHistory)
  return {
    performance: {
      latestNav: latest.nav,
      latestDate: dateOf(latest.t),
      windows,
    },
    holdings: raw.holdings === null ? null : holdingsMetrics(raw.holdings.rows, raw.holdings.previousRows),
    style: raw.holdings === null || raw.quotes === null
      ? null
      : styleMetrics(raw.holdings.rows, raw.quotes, secidOf),
    manager,
    benchmark: benchmarkMetrics(raw.managerHistory, manager),
  }
}
```

</details>

**依据 5 · 源码核查**：[src/metrics/style.ts:1-29](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/metrics/style.ts#L1-L29)

固定阈值和top holdings范围，非全市场模型。

<details>
<summary>查看原文（29行）</summary>

```text
/**
 * Simplified size-value style attribution over the top-10 holdings. Size uses
 * total market capitalization against fixed bands plus a within-holdings
 * quintile rank (1 = largest); valuation uses the dynamic PE against fixed
 * bands. Both band systems are fixed estimation口径 (no full-market
 * distribution is consulted) and the report labels them as such. Pure
 * functions.
 * @module dsh-fund-research/metrics/style
 */

import type { HoldingRow, QuoteMap, StyleMetrics, StyleRow } from '../model.ts'
import { round4 } from './performance.ts'

/** Absolute size bands on total market cap (亿元): 大盘 ≥ 1000, 中盘 300-1000, 小盘 < 300. */
export const SIZE_BANDS = [
  { label: '大盘', minYi: 1000 },
  { label: '中盘', minYi: 300 },
  { label: '小盘', minYi: 0 },
] as const

/** Valuation bands on dynamic PE: 深度价值 < 15, 价值 15-25, 均衡 25-40, 成长 ≥ 40. */
export const VALUE_BANDS = [
  { label: '深度价值', maxPe: 15 },
  { label: '价值', maxPe: 25 },
  { label: '均衡', maxPe: 40 },
  { label: '成长', maxPe: Number.POSITIVE_INFINITY },
] as const

/** One hundred million yuan — the market-cap display unit (亿元). */
```

</details>

**依据 6 · 源码核查**：[src/metrics/style.ts:55-102](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/metrics/style.ts#L55-L102)

报价缺失排除和内部排名规则。

<details>
<summary>查看原文（48行）</summary>

```text
 * @returns the style metrics.
 */
export function styleMetrics(
  holdings: readonly HoldingRow[],
  quotes: QuoteMap,
  secidOf: (code: string) => string,
): StyleMetrics {
  const quoted: { holding: HoldingRow, quote: QuoteMap['rows'][string] }[] = []
  for (const holding of holdings) {
    const quote = quotes.rows[secidOf(holding.code)]
    if (quote !== undefined) quoted.push({ holding, quote })
  }

  // Within-holdings size quintiles: rank by market cap descending, then bucket
  // the ranking into five slices (ties share the lower quintile by rank).
  const byCapDesc = [...quoted].sort((a, b) => b.quote.totalMarketCap - a.quote.totalMarketCap)
  const quintileOf = new Map<string, number>()
  byCapDesc.forEach((entry, index) => {
    const quintile = Math.min(5, Math.floor((index * 5) / Math.max(1, byCapDesc.length)) + 1)
    quintileOf.set(entry.holding.code, quintile)
  })

  const rows: StyleRow[] = quoted.map(({ holding, quote }) => ({
    code: holding.code,
    name: holding.name,
    navPct: holding.navPct,
    marketCapYi: round4(quote.totalMarketCap / YI_YUAN),
    sizeBand: sizeBandOf(quote.totalMarketCap),
    sizeQuintile: quintileOf.get(holding.code) ?? 5,
    valueBand: valueBandOf(quote.peDynamic),
    peDynamic: round4(quote.peDynamic),
    pb: round4(quote.pb),
  }))

  const sizeDistribution: Record<string, number> = {}
  const valueDistribution: Record<string, number> = {}
  for (const row of rows) {
    sizeDistribution[row.sizeBand] = round4((sizeDistribution[row.sizeBand] ?? 0) + row.navPct)
    valueDistribution[row.valueBand] = round4((valueDistribution[row.valueBand] ?? 0) + row.navPct)
  }

  return {
    rows,
    sizeDistribution,
    valueDistribution,
    coverage: `${rows.length}/${holdings.length}`,
  }
}
```

</details>

#### 缺口

- 真实研究者是否愿意用此底稿、指标公式和解析是否在实际样本正确未验证。
  **影响**：不能宣称节时、研究质量提高或业务需求已验证。
  **进一步探讨**：先用已人工复算的一份固定样本对比底稿完整性、差错和复核耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 数据、离线与asOf日期能保证历史可得性吗？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

采集核心pingzhongdata是必需项，失败终止；持仓和经理历史失败记录来源失败并列gaps，报价按股票降级。远程数据按解析函数提取，不应把网页主张的每个字段都当始终可用。在线模式先看domain快照TTL和asOf匹配，满足则复用，否则抓取并计算保存；offline先domain再最新磁盘快照，无可用数据显式OfflineGapError，不会暗中联网。

asOf验证日期格式、真实日期和非未来；真正cutoff只过滤raw.navTrend并要求至少两点，然后返回{...raw, navTrend}。持仓、经理、报价、规模等其他raw字段仍来自此次采集/旧快照的原样内容，computed的风格和经理等也照样计算。故asOf代表净值序列截点，不构成“所有资料在该日已公开”的point-in-time快照；用它做历史无前视回测会有混入后期资料的条件风险，这由代码推断，未运行复现。报告工具的“仅采用不晚于该日期的数据”文案比实际非净值过滤更宽，采用时必须显式解释这个边界。

此外未传asOf时matchesAsOf直接true，可能复用此前带截点的domain快照，只要TTL内；指定日期时才要求相等。offline不限制新鲜度，不能把live=false当作当前最新数据。来源哈希记录的是采集字节标识与提取数据，既不证明来源无错，也不替代独立原始资料核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/sources/eastmoney.ts:564-601](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/sources/eastmoney.ts#L564-L601)

必需核心与可降级来源的实际失败分支。

<details>
<summary>查看原文（38行）</summary>

```text
export async function collectFund(
  fetcher: PoliteFetcher,
  urls: SourceUrls,
  code: string,
  options: { styleQuotes: boolean, signal?: AbortSignal },
): Promise<CollectedSources> {
  const fetchedAt = Date.now()
  const gaps: string[] = []

  // Core block: required. A failure here aborts the acquisition.
  const coreText = await fetcher.fetchText(urls.pingzhongdata, 'https://fund.eastmoney.com/', options.signal)
  const core = parsePingzhongdata(coreText, code)
  const coreProv = provenanceOk(urls.pingzhongdata, coreText, fetchedAt)

  // Holdings detail (F10 jjcc): degradable.
  let holdings: FundRawData['holdings'] = null
  let holdingsProv: SourceProvenance
  try {
    const text = await fetcher.fetchText(urls.holdings, 'https://fundf10.eastmoney.com/', options.signal)
    holdings = parseHoldingsPage(text, code)
    holdingsProv = provenanceOk(urls.holdings, text, fetchedAt)
  } catch (error) {
    holdingsProv = provenanceFail(urls.holdings, error, fetchedAt)
    gaps.push('holdings')
  }

  // Manager history (F10 jjjl): degradable.
  let managerHistory: FundRawData['managerHistory'] = null
  let managerProv: SourceProvenance
  try {
    const text = await fetcher.fetchText(urls.managerHistory, 'https://fundf10.eastmoney.com/', options.signal)
    managerHistory = parseManagerPage(text, code)
    managerProv = provenanceOk(urls.managerHistory, text, fetchedAt)
  } catch (error) {
    managerProv = provenanceFail(urls.managerHistory, error, fetchedAt)
    gaps.push('managerHistory')
  }

```

</details>

**依据 2 · 源码核查**：[src/sources/snapshot.ts:158-190](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/sources/snapshot.ts#L158-L190)

日期检查及只过滤navTrend的实际实现。

<details>
<summary>查看原文（33行）</summary>

```text
export function parseAsOfDate(input: string | undefined, now: number = Date.now()): string | undefined {
  if (input === undefined || input.trim() === '') return undefined
  const value = input.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    throw new TypeError(`asOfDate must be an ISO 8601 date (YYYY-MM-DD), got ${JSON.stringify(input)}`)
  }
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year ?? 0, (month ?? 0) - 1, day ?? 0))
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== (month ?? 0) - 1 || date.getUTCDate() !== day) {
    throw new TypeError(`asOfDate must be a real calendar date, got ${JSON.stringify(input)}`)
  }
  const today = new Date(now).toISOString().slice(0, 10)
  if (value > today) {
    throw new TypeError(`asOfDate must not be in the future, got ${JSON.stringify(input)} (today is ${today})`)
  }
  return value
}

/**
 * Truncate the NAV series to points on or before the asOf cutoff. The sealed
 * snapshot then only carries data the report is allowed to use, and every
 * computed number traces to it.
 * @param raw - the collected raw sections.
 * @param asOfDate - normalized YYYY-MM-DD cutoff.
 * @returns the raw sections with the NAV series truncated.
 */
export function applyAsOfCutoff(raw: FundSnapshot['raw'], asOfDate: string): FundSnapshot['raw'] {
  const navTrend = raw.navTrend.filter(point => dateOf(point.t) <= asOfDate)
  if (navTrend.length < 2) {
    throw new Error(`asOfDate ${asOfDate} leaves fewer than 2 NAV points (${navTrend.length}); cannot compute performance`)
  }
  return { ...raw, navTrend }
}
```

</details>

**依据 3 · 源码核查**：[src/sources/snapshot.ts:225-280](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/sources/snapshot.ts#L225-L280)

离线/TTL/asOf匹配及计算保存全链。

<details>
<summary>查看原文（56行）</summary>

```text
export async function acquireSnapshot(
  store: SnapshotStore,
  code: string,
  options: AcquireOptions = {},
): Promise<AcquireResult> {
  const offline = options.offline ?? store.config.offline
  const asOfDate = parseAsOfDate(options.asOfDate)
  const record = readDomainSnapshot(store, code)

  /** Build a reuse result for one already-stored snapshot. */
  const reuse = (snapshot: FundSnapshot): AcquireResult => ({
    snapshot,
    live: false,
    discovery: buildSourcesDiscovery(snapshot, quoteFactsOfReuse(store, snapshot), Date.now(), false),
  })

  /** A stored snapshot satisfies the asOf cutoff only when it was produced under the same one. */
  const matchesAsOf = (snapshot: FundSnapshot): boolean => asOfDate === undefined || snapshot.asOf === asOfDate

  if (offline) {
    if (record !== null && matchesAsOf(record.snapshot)) return reuse(record.snapshot)
    if (options.reportRootAbs !== undefined) {
      const disk = await readDiskSnapshot(options.reportRootAbs, code, asOfDate)
      if (disk !== null) return reuse(disk)
    }
    throw new OfflineGapError(code, asOfDate)
  }

  const ttlMs = store.config.cacheTtlHours * 3_600_000
  if (record !== null && Date.now() - record.storedAt < ttlMs && matchesAsOf(record.snapshot)) {
    return reuse(record.snapshot)
  }

  const urls = sourceUrls(store.config, code)
  const collected = await collectFund(store.fetcher, urls, code, {
    styleQuotes: store.config.styleQuotes,
    ...(options.signal === undefined ? {} : { signal: options.signal }),
  })
  const raw = asOfDate === undefined ? collected.raw : applyAsOfCutoff(collected.raw, asOfDate)
  const snapshot: FundSnapshot = {
    schema: SNAPSHOT_SCHEMA,
    code,
    name: collected.name,
    fetchedAt: collected.fetchedAt,
    sources: collected.sources,
    raw,
    computed: computeMetrics(raw, store.config.riskFreeRate),
    parameters: computationParameters(store.config.riskFreeRate),
    gaps: collected.gaps,
    ...(asOfDate === undefined ? {} : { asOf: asOfDate }),
  }
  await storeSnapshot(store, snapshot)
  return {
    snapshot,
    live: true,
    discovery: buildSourcesDiscovery(snapshot, quoteFactsOfLive(urls, collected), Date.now(), true),
```

</details>

**依据 4 · 源码核查**：[src/tools/research.ts:118-134](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/tools/research.ts#L118-L134)

asOf展示文案宽于仅净值过滤。

<details>
<summary>查看原文（17行）</summary>

```text
    return `fund_research 后台任务已启动：${value.jobId}（用 job_read 查看进度与结果）`
  }
  if (value.kind === 'summary') return renderSummary(value)
  const v = value.verdicts
  const lines = [
    `${value.name}（${value.code}）研究报告已封存 — 仅供研究参考，不构成投资建议`,
    `版本目录 ${value.version}；报告 ${value.reportPath}`,
    `manifest ${value.manifestPath}（报告 sha256 ${value.reportSha256.slice(0, 12)}…）`,
    `数字回溯表核查（${value.verifyEngine}）：verified ${v.verified} / mismatch ${v.mismatch} / not-found ${v.notFound} / unverifiable ${v.unverifiable}`,
  ]
  if (value.gaps.length > 0) lines.push(`数据缺口（报告对应章节已声明）：${value.gaps.join('、')}`)
  if (value.asOfDate !== null) lines.push(`asOf 截点：${value.asOfDate}（仅采用不晚于该日期的数据）`)
  lines.push(`采集方式：${value.live ? '实时采集' : '快照复用'}${value.offline ? '（offline）' : ''}；章节：${value.sections.join('、')}`)
  return lines.join('\n')
}

/** Project one run into the canonical value. */
```

</details>

#### 缺口

- 实际公开端点可用性、数据许可、历史修订和披露时间未核实。
  **影响**：不得依此报告承诺历史无泄漏研究或当前完整数据。
  **进一步探讨**：固定原始样本与发布日期，逐字段标observedAt/availableAt，核对净值以外章节是否晚于asOf。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 数字核查、哈希封存与只读复核各保证什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

buildBody把报告需要的数值组织为citations；先写snapshot.json，再verifyCitations读取文件按path比较数值/字符串，缺路径、非标量和不可读分别记录not-found或unverifiable。可选dataQuality失败转内置fallback；比较的是报告数与同一个快照，不是查第二个独立数据源，也不独立证明公式正确。请求有容差时按相对差比较，不等于误差估计。

核查不作为封存闸门：runResearch无论mismatch/not-found数量都组附录并seal，结果计数返回工具值。snapshot、report和manifest依次直接writeFile，manifest保存来源、参数和哈希，能帮助读者比对内容版本，不能视作不可篡改签名、原子提交或第三方真实性认证。写到一半失败可能已有部分文件；同秒版本/并发隔离也不应凭日期目录推保证。

只读复核不改这三份文件，但会新写review-note。它检查报告是否含免责声明/缺口文字，然后重新buildBody(snapshot)产生citation再与snapshot比较；没有解析实际report.md的数字，也未在该函数比对manifest中reportSha256与当前report内容。因此一份被改动了数值但保留免责声明/缺口文字的报告，不能指望这个复核发现所有数字篡改。这是源码覆盖边界而非已复现攻击。引用核查、内容哈希与复核应分别解释，不能统一叫“验证正确”。

#### 证据与依据

**依据 1 · 源码核查**：[src/verify-bridge.ts:84-134](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/verify-bridge.ts#L84-L134)

path比较及读取失败的具体结果。

<details>
<summary>查看原文（51行）</summary>

```text
    if (cited === 0) return actual === 0 ? 'verified' : 'mismatch'
    return Math.abs(actual - cited) / Math.abs(cited) <= tolerance ? 'verified' : 'mismatch'
  }
  if (typeof actual !== 'string') return 'unverifiable'
  return actual === cited ? 'verified' : 'mismatch'
}

/**
 * The built-in fallback checker: reads the dataset JSON, resolves each
 * citation path, and compares values within tolerance. A citation whose path
 * resolves to a non-scalar (object/array) or an incomparable type is
 * `unverifiable`, never silently verified.
 * @param request - the check request; `dataset` stays workspace-relative per the frozen contract.
 * @param resolveDataset - maps the workspace-relative dataset path to a readable absolute path.
 * @returns the verdict set, in request order.
 */
export async function builtinVerifyCitations(
  request: CitationCheckRequest,
  resolveDataset: (dataset: string) => string = dataset => path.resolve(dataset),
): Promise<CitationCheckResult> {
  let root: unknown
  try {
    root = JSON.parse(await readFile(resolveDataset(request.dataset), 'utf8'))
  } catch (error) {
    return {
      results: request.citations.map(citation => ({
        id: citation.id,
        status: 'unverifiable' as const,
        note: `dataset unreadable: ${error instanceof Error ? error.message : String(error)}`,
      })),
    }
  }
  return {
    results: request.citations.map((citation) => {
      const actual = resolvePath(root, citation.path)
      if (actual === undefined) return { id: citation.id, status: 'not-found' as const, note: `no value at ${citation.path}` }
      if (actual !== null && typeof actual === 'object') {
        return { id: citation.id, status: 'unverifiable' as const, note: `path ${citation.path} resolves to a non-scalar` }
      }
      const status = compareValues(citation.value, actual, citation.tolerance ?? 0)
      return {
        id: citation.id,
        status,
        actual: actual as number | string,
        note: status === 'verified' ? `matches ${citation.path}` : `cited ${String(citation.value)} vs actual ${String(actual)} at ${citation.path}`,
      }
    }),
  }
}

/** The verification outcome handed back to the report assembler. */
```

</details>

**依据 2 · 源码核查**：[src/verify-bridge.ts:148-174](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/verify-bridge.ts#L148-L174)

可选服务失败回退，不阻止seal。

<details>
<summary>查看原文（27行）</summary>

```text
 * to an absolute path for the built-in reader only.
 * @param ctx - the lookup surface (plugin context).
 * @param request - the check request.
 * @param options - optional dataset-path resolver for the built-in reader.
 * @returns the engine tag plus the verdict set.
 */
export async function verifyCitations(
  ctx: DataQualityLookup,
  request: CitationCheckRequest,
  options: { resolveDataset?: (dataset: string) => string } = {},
): Promise<VerifyOutcome> {
  const service = ctx.get('dataQuality') as unknown as DataQualityLike | undefined
  if (service !== undefined && typeof service.verifyCitations === 'function') {
    try {
      const result = await service.verifyCitations(request)
      if (result !== null && typeof result === 'object' && Array.isArray(result.results)) {
        return { engine: 'dsh-data-quality', result }
      }
    } catch {
      // Fall through to the built-in checker; a broken optional service never blocks a seal.
    }
  }
  return {
    engine: 'builtin-fallback',
    result: await builtinVerifyCitations(request, options.resolveDataset ?? (dataset => path.resolve(dataset))),
  }
}
```

</details>

**依据 3 · 源码核查**：[src/tools/shared.ts:238-315](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/tools/shared.ts#L238-L315)

核查结果仅计数，仍执行seal和后续步骤。

<details>
<summary>查看原文（78行）</summary>

```text
  // ---- report stage ----
  let outcome: VerifyOutcome
  let seal: SealResult
  let verdicts: ResearchRun['verdicts']

  const manifestText = state.stages.report.status === 'done' ? await readTextIfExists(manifestPath) : null
  const reportText = state.stages.report.status === 'done' ? await readTextIfExists(reportPath) : null
  if (state.stages.report.status === 'done' && state.report !== undefined && manifestText !== null && reportText !== null) {
    // Idempotent resume: reuse the sealed report and manifest, no re-verification.
    const manifest = JSON.parse(manifestText) as ReportManifest
    verdicts = { ...state.report.verdicts }
    outcome = {
      engine: manifest.verifyEngine === 'dsh-data-quality' ? 'dsh-data-quality' : 'builtin-fallback',
      result: await builtinVerifyCitations({
        dataset: rel(snapshotPath),
        citations,
      }, () => snapshotPath),
    }
    seal = {
      version,
      versionDir,
      reportPathRel: rel(reportPath),
      manifestPathRel: rel(manifestPath),
      snapshotPathRel: rel(snapshotPath),
      reportPathAbs: reportPath,
      manifestPathAbs: manifestPath,
      manifestSha256: sha256Of(manifestText),
      manifest,
      markdown: reportText,
    }
  } else {
    // Deterministic comparison against the previous tracking record.
    const comparisonMarkdown = includeComparison
      ? renderComparisonSection(
          (await readTracking(reportRootAbs)).filter(record => record.code === code).at(-1)?.comparison ?? null,
          comparisonFactsOf(snapshot),
          code,
        )
      : ''
    // Minimal walk-forward stability summary over the NAV series.
    const walkForwardMarkdown = includeWalkForward
      ? renderWalkForwardSection(walkForwardSummary(snapshot.raw.navTrend, deps.config.riskFreeRate))
      : ''

    outcome = await verifyCitations(deps.ctx, {
      dataset: rel(sealedSnapshot.path),
      citations,
    }, { resolveDataset: () => sealedSnapshot.path })

    const appendix = assembleAppendix(body.citations, outcome, snapshot, discovery)
    const extras = [comparisonMarkdown, walkForwardMarkdown].filter(section => section !== '').join('\n\n')
    const markdown = `${body.markdown}${extras === '' ? '' : `\n\n${extras}`}\n\n${appendix}\n`

    seal = await sealReport(snapshot, markdown, {
      reportRootAbs,
      workspaceRoot: workspace,
      outcome,
      snapshotSha256: sealedSnapshot.sha256,
      now: sealNow,
      generator: deps.generator,
    })

    verdicts = { verified: 0, mismatch: 0, notFound: 0, unverifiable: 0 }
    for (const result of outcome.result.results) {
      if (result.status === 'verified') verdicts.verified++
      else if (result.status === 'mismatch') verdicts.mismatch++
      else if (result.status === 'not-found') verdicts.notFound++
      else verdicts.unverifiable++
    }
    await appendTrackingRecord(reportRootAbs, buildTrackingRecord(snapshot, seal, Date.now()))
    await scheduleReview(deps, agent, versionDir, state)
    await markStageDone(reportRootAbs, state, 'report', now, {
      engine: outcome.engine,
      verdicts,
      reportSha256: seal.manifest.reportSha256,
      manifestSha256: seal.manifestSha256,
      snapshotSha256: sealedSnapshot.sha256,
    })
```

</details>

**依据 4 · 源码核查**：[src/report.ts:455-500](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/report.ts#L455-L500)

逐文件写和manifest哈希字段，不是原子签名。

<details>
<summary>查看原文（46行）</summary>

```text
export async function sealSnapshot(snapshot: FundSnapshot, versionDir: string): Promise<{ path: string, sha256: string }> {
  await mkdir(versionDir, { recursive: true })
  const json = JSON.stringify(snapshot, null, 2)
  const target = path.join(versionDir, 'snapshot.json')
  await writeFile(target, json, 'utf8')
  return { path: target, sha256: sha256Of(json) }
}

/**
 * Seal one report version: write report.md and manifest.json into the version
 * directory that {@link sealSnapshot} already holds.
 * @param snapshot - the fund snapshot.
 * @param markdown - the full report markdown (body + appendix).
 * @param options - seal options.
 * @returns the sealed-report facts.
 */
export async function sealReport(
  snapshot: FundSnapshot,
  markdown: string,
  options: SealOptions,
): Promise<SealResult> {
  const now = options.now ?? Date.now()
  const version = versionStamp(now)
  const versionDir = path.join(options.reportRootAbs, snapshot.code, version)

  const reportPathAbs = path.join(versionDir, 'report.md')
  await writeFile(reportPathAbs, markdown, 'utf8')

  const manifest: ReportManifest = {
    schema: 'dsh-fund-research/manifest@v1',
    code: snapshot.code,
    name: snapshot.name,
    version,
    sealedAt: now,
    sources: snapshot.sources,
    snapshotSha256: options.snapshotSha256,
    parameters: snapshot.parameters,
    reportSha256: sha256Of(markdown),
    verifyEngine: options.outcome.engine,
    gaps: snapshot.gaps,
    ...(snapshot.asOf === undefined ? {} : { asOf: snapshot.asOf }),
    generator: options.generator,
  }
  const manifestPathAbs = path.join(versionDir, 'manifest.json')
  const manifestJson = JSON.stringify(manifest, null, 2)
  await writeFile(manifestPathAbs, manifestJson, 'utf8')
```

</details>

**依据 5 · 源码核查**：[src/review.ts:42-82](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/review.ts#L42-L82)

review重建body citations而非解析实际报告数字。

<details>
<summary>查看原文（41行）</summary>

```text
  const snapshotText = await readFile(path.join(versionDir, 'snapshot.json'), 'utf8')
  const snapshot = fundSnapshotSchema.parse(JSON.parse(snapshotText)) as FundSnapshot
  const manifest = JSON.parse(await readFile(path.join(versionDir, 'manifest.json'), 'utf8')) as ReportManifest
  const reportText = await readFile(path.join(versionDir, 'report.md'), 'utf8')

  const disclaimerPresent = reportText.includes(DISCLAIMER)
  const gapDeclared = { declared: [] as string[], missing: [] as string[] }
  for (const gap of manifest.gaps) {
    if (reportText.includes(`缺口：${gap}`)) gapDeclared.declared.push(gap)
    else gapDeclared.missing.push(gap)
  }

  const body = buildBody(snapshot)
  const result = await builtinVerifyCitations({
    dataset: path.join(versionDir, 'snapshot.json'),
    citations: body.citations.map(citation => ({
      id: citation.id,
      path: citation.path,
      value: citation.value,
      tolerance: citation.tolerance,
    })),
  })
  const traceTally = { verified: 0, mismatch: 0, notFound: 0, unverifiable: 0 }
  for (const entry of result.results) {
    if (entry.status === 'verified') traceTally.verified++
    else if (entry.status === 'mismatch') traceTally.mismatch++
    else if (entry.status === 'not-found') traceTally.notFound++
    else traceTally.unverifiable++
  }

  const checks: ReviewChecks = { disclaimerPresent, gapDeclared, traceTally }
  const markdown = renderReviewNote(manifest, checks)
  await writeFile(path.join(versionDir, 'review-note.md'), markdown, 'utf8')
  return { markdown, checks }
}

/** Render the review-note markdown from the manifest and the check results. */
export function renderReviewNote(manifest: ReportManifest, checks: ReviewChecks): string {
  const declared = checks.gapDeclared.declared.length === 0 ? '无' : checks.gapDeclared.declared.join('、')
  const missing = checks.gapDeclared.missing.length === 0 ? '无' : checks.gapDeclared.missing.join('、')
  return [
```

</details>

#### 缺口

- 同版本宿主/真实样本未执行，原文、提取、指标和报告的一致性未独立验证。
  **影响**：封存/verified不可当研究事实或业务正确证明。
  **进一步探讨**：离线副本分别注入源错误、指标错误、报告数字篡改和文件中断，核对哪层发现并显式标出盲区。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 恢复、多基金和后台运行有什么实际负担？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

resume以code和输入指纹找状态，指纹包含sections、asOf、offline、riskFreeRate、styleQuotes及附加章节开关，不同输入拒绝。snapshot阶段done且文件存在便复用并重算当前文件哈希；report阶段done且两文件存在则复用，verdicts沿state旧值，outcome虽重新做内置比较，但不等于重新封存或检查已存hash绑定。阶段状态与tracking写入都是best-effort，写失败不改变报告结果，状态损坏读成空再新跑。不能把成功工具响应理解成持久进度/账本全有，也不能声称跨崩溃exactly-once或抗篡改恢复。

多基金fan-out实际上for循环顺序跑，每项catch写错误并继续，不是并行提速；汇总有gaps仍可以返回summary，后台pipeline正常返回则job标completed，所以completed不等于每支基金成功。background要求jobs与agent owner，cancel触发AbortController，但本地计算/写盘阶段没有统一回滚。可选review缺jobs或owner便跳过，不能默认报告都复核过。

fetchText有请求间隔与重试；实际signal使用signal ?? AbortSignal.timeout(timeoutMs)，而工具前台/后台都会传signal，因此正常工具路径不叠加该15秒默认timeout，不能宣称每个网络请求均有此超时上限；等待和backoff也非立即可取消。首次依赖兼容宿主、存储栈、构建包和可写reportRoot，持续要维护端点解析与指标口径、复核gaps/日期和保留版本，失败要检查部分写入、状态与账本，不以免key/无登录推零总成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/shared.ts:146-174](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/tools/shared.ts#L146-L174)

输入指纹与resume拒绝条件。

<details>
<summary>查看原文（29行）</summary>

```text
  const resume = options.resume ?? false
  const offline = options.offline ?? deps.config.offline
  const includeComparison = options.includeComparison ?? false
  const includeWalkForward = options.includeWalkForward ?? false
  const fingerprint = runFingerprint({
    code,
    sections: options.sections,
    asOfDate: asOfDate ?? null,
    offline,
    riskFreeRate: deps.config.riskFreeRate,
    styleQuotes: deps.config.styleQuotes,
    includeComparison,
    includeWalkForward,
  })

  // Load any recorded run; resume rejects a changed input loudly.
  let recorded: RunState | undefined
  if (resume) {
    const map = await readRunStateMap(reportRootAbs)
    const candidate = map[code]
    if (candidate !== undefined) {
      if (candidate.fingerprint !== fingerprint) throw new ResumeFingerprintMismatchError(code)
      recorded = candidate
    }
  }

  const now = Date.now()
  const version = recorded?.version ?? versionStamp(now)
  const versionDir = path.join(reportRootAbs, code, version)
```

</details>

**依据 2 · 源码核查**：[src/tools/shared.ts:185-207](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/tools/shared.ts#L185-L207)

复用当前snapshot字节，不校验旧hash。

<details>
<summary>查看原文（23行）</summary>

```text
  // ---- snapshot stage ----
  let snapshot: FundSnapshot
  let live: boolean
  let discovery: SourcesDiscovery
  let sealedSnapshot: { path: string, sha256: string }

  const snapshotText = state.stages.snapshot.status === 'done' ? await readTextIfExists(snapshotPath) : null
  if (snapshotText !== null) {
    // Reuse the sealed snapshot — no re-collection.
    snapshot = fundSnapshotSchema.parse(JSON.parse(snapshotText)) as FundSnapshot
    sealedSnapshot = { path: snapshotPath, sha256: sha256Of(snapshotText) }
    live = false
    discovery = JSON.parse((await readTextIfExists(discoveryPath)) ?? 'null') as SourcesDiscovery
    if (discovery === null || typeof discovery !== 'object') {
      discovery = buildSourcesDiscovery(snapshot, {
        primaryUrl: deps.config.quoteBaseUrl,
        fallbackUrl: deps.config.quoteFallbackBaseUrl === '' ? null : deps.config.quoteFallbackBaseUrl,
        fallbackUsed: false,
        requested: snapshot.raw.holdings?.rows.length ?? 0,
        succeeded: Object.keys(snapshot.raw.quotes?.rows ?? {}).length,
      }, now, false)
    }
  } else {
```

</details>

**依据 3 · 源码核查**：[src/tools/shared.ts:243-268](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/tools/shared.ts#L243-L268)

report复用与旧计数的实际语义。

<details>
<summary>查看原文（26行）</summary>

```text
  const manifestText = state.stages.report.status === 'done' ? await readTextIfExists(manifestPath) : null
  const reportText = state.stages.report.status === 'done' ? await readTextIfExists(reportPath) : null
  if (state.stages.report.status === 'done' && state.report !== undefined && manifestText !== null && reportText !== null) {
    // Idempotent resume: reuse the sealed report and manifest, no re-verification.
    const manifest = JSON.parse(manifestText) as ReportManifest
    verdicts = { ...state.report.verdicts }
    outcome = {
      engine: manifest.verifyEngine === 'dsh-data-quality' ? 'dsh-data-quality' : 'builtin-fallback',
      result: await builtinVerifyCitations({
        dataset: rel(snapshotPath),
        citations,
      }, () => snapshotPath),
    }
    seal = {
      version,
      versionDir,
      reportPathRel: rel(reportPath),
      manifestPathRel: rel(manifestPath),
      snapshotPathRel: rel(snapshotPath),
      reportPathAbs: reportPath,
      manifestPathAbs: manifestPath,
      manifestSha256: sha256Of(manifestText),
      manifest,
      markdown: reportText,
    }
  } else {
```

</details>

**依据 4 · 源码核查**：[src/run-state.ts:99-118](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/run-state.ts#L99-L118)

状态坏/缺失当空，非强故障恢复。

<details>
<summary>查看原文（20行）</summary>

```text
 * (nothing recorded yet); resume then runs fresh and overwrites the file.
 * @param reportRootAbs - absolute report root.
 * @returns the per-code map.
 */
export async function readRunStateMap(reportRootAbs: string): Promise<RunStateMap> {
  try {
    const text = await readFile(runStatePath(reportRootAbs), 'utf8')
    const parsed: unknown = JSON.parse(text)
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const map: RunStateMap = {}
    for (const [code, state] of Object.entries(parsed as Record<string, unknown>)) {
      if (state === null || typeof state !== 'object') continue
      const candidate = state as Partial<RunState>
      if (typeof candidate.fingerprint !== 'string' || candidate.stages === null || typeof candidate.stages !== 'object') continue
      map[code] = state as RunState
    }
    return map
  } catch {
    return {}
  }
```

</details>

**依据 5 · 源码核查**：[src/run-state.ts:139-164](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/run-state.ts#L139-L164)

进度写best-effort。

<details>
<summary>查看原文（26行）</summary>

```text
  reportRootAbs: string,
  state: RunState,
  stage: PipelineStage,
  now: number,
  report?: ReportStageFacts,
): Promise<void> {
  state.stages[stage] = { status: 'done', at: now }
  state.updatedAt = now
  if (report !== undefined) state.report = report
  const map = await readRunStateMap(reportRootAbs)
  map[state.code] = state
  await writeRunStateMap(reportRootAbs, map)
}

/** Write the full run-state map (best-effort; never fails the pipeline). */
export async function writeRunStateMap(reportRootAbs: string, map: RunStateMap): Promise<void> {
  try {
    await mkdir(reportRootAbs, { recursive: true })
    await writeFile(runStatePath(reportRootAbs), JSON.stringify(map, null, 2), 'utf8')
  } catch {
    // A failed state write must not change the pipeline outcome; resume simply
    // has nothing to reuse next time.
  }
}

/** Error raised when a resume targets a recorded run with a different input. */
```

</details>

**依据 6 · 源码核查**：[src/tracking.ts:88-101](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/tracking.ts#L88-L101)

tracking写失败不改变结果。

<details>
<summary>查看原文（14行）</summary>

```text

/** Append one tracking line (deterministic field order; best-effort). */
export async function appendTrackingRecord(reportRootAbs: string, record: TrackingRecord): Promise<void> {
  try {
    await mkdir(reportRootAbs, { recursive: true })
    await appendFile(trackingPath(reportRootAbs), `${JSON.stringify(record)}\n`, 'utf8')
  } catch {
    // A failed tracking append never changes the report outcome.
  }
}

/** Read every valid tracking line in append order; corrupt lines are skipped. */
export async function readTracking(reportRootAbs: string): Promise<TrackingRecord[]> {
  try {
```

</details>

**依据 7 · 源码核查**：[src/tools/shared.ts:439-465](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/tools/shared.ts#L439-L465)

多项顺序执行与单项错误隔离。

<details>
<summary>查看原文（27行）</summary>

```text
): Promise<FundRunSummaryEntry[]> {
  const entries: FundRunSummaryEntry[] = []
  for (const code of codes) {
    try {
      const run = await runResearch(deps, code, agent, options)
      entries.push({
        code,
        name: run.snapshot.name,
        version: run.seal.version,
        asOfDate: run.snapshot.asOf ?? null,
        snapshotSha256: run.seal.manifest.snapshotSha256,
        reportSha256: run.seal.manifest.reportSha256,
        verdicts: run.verdicts,
        reportPath: run.seal.reportPathRel,
        error: null,
      })
    } catch (error) {
      entries.push({
        code,
        name: null,
        version: null,
        asOfDate: null,
        snapshotSha256: null,
        reportSha256: null,
        verdicts: null,
        reportPath: null,
        error: error instanceof Error ? error.message : String(error),
```

</details>

**依据 8 · 源码核查**：[src/tools/research.ts:353-419](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/tools/research.ts#L353-L419)

前后台传signal、background owner及completed条件。

<details>
<summary>查看原文（67行）</summary>

```text

      /** One pipeline execution: a single sealed report, or a fan-out summary. */
      const pipeline = async (agent: Agent | undefined, signal: AbortSignal): Promise<ResearchToolValue> => {
        if (multi || codes.length > 1) {
          const entries = await runResearchFanOut(deps, codes, agent, { ...runOptions, signal })
          return summaryValueOf(entries)
        }
        const run = await runResearch(deps, codes[0]!, agent, { ...runOptions, signal })
        return researchValueOf(run, offline)
      }

      if (args.background === true) {
        const jobs = deps.ctx.get('jobs') as unknown as JobsLike | undefined
        if (jobs === undefined) {
          throw new Error('background mode requires the ctx.jobs service (shipped in dsh-base); rerun without background: true')
        }
        if (exec.agent === undefined) {
          throw new Error('background mode requires an agent-owned execution; rerun without background: true')
        }
        const owner = exec.agent
        const jobId = jobs.start({
          kind: FUND_REPORT_JOB_KIND,
          label: `fund_research ${codes.join(',')}`,
          // The 0.1.7 jobs line fences a job by the owner's SESSION ID
          // (`JobSpec.owner`), where the pre-0.1.7 line took the live Agent itself.
          owner: owner.id,
          run: (handle?: JobOutputAppendLike): JobHooks => {
            const abort = new AbortController()
            const progress: string[] = []
            // Feed both producer faces with one call: the 0.1.7 output ring (the
            // handle) and the pre-0.1.7 progress cursor (`readOutput`).
            const emit = (line: string): void => {
              progress.push(line)
              handle?.append(line)
            }
            emit(`fund_research ${codes.join(',')}: started`)
            const done = (async (): Promise<JobOutcome> => {
              try {
                const value = await pipeline(owner, abort.signal)
                emit(renderResearch(value))
                const detail = value.kind === 'sealed' ? `sealed ${value.version}` : value.kind === 'summary' ? `summary ${value.funds.length} funds` : 'background'
                return { status: 'completed', detail, result: renderResearch(value), output: renderResearch(value) } as JobOutcome
              } catch (error) {
                const message = error instanceof Error ? error.message : String(error)
                emit(`failed: ${message}`)
                return { status: abort.signal.aborted ? 'killed' : 'failed', detail: message }
              }
            })()
            // `readOutput` is the pre-0.1.7 progress cursor and `output` is the
            // pre-0.1.7 final-text field: the 0.1.7 line removed both from the
            // published types (JobHooks lost `readOutput`, JobOutcome renamed
            // `output` to `result`) in favour of the ring plus the one-shot
            // `result`. Emitting both shapes structurally keeps the older declared
            // lines streaming and is inert on 0.1.7.
            return {
              cancel: () => { abort.abort() },
              done,
              readOutput: () => progress.splice(0).join('\n'),
            } as JobHooks
          },
        })
        return { kind: 'background', jobId: String(jobId) } satisfies BackgroundValue
      }
      return await pipeline(exec.agent, exec.signal)
    },
  })
}
```

</details>

**依据 9 · 源码核查**：[src/sources/eastmoney.ts:99-124](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/sources/eastmoney.ts#L99-L124)

传入signal替代timeout，等待重试范围明确。

<details>
<summary>查看原文（26行）</summary>

```text
   * @returns the response text.
   */
  async fetchText(url: string, referer: string, signal?: AbortSignal): Promise<string> {
    const wait = this.nextSlotAt - Date.now()
    if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait))
    this.nextSlotAt = Date.now() + this.policy.requestIntervalMs

    let lastError: unknown
    for (let attempt = 0; attempt <= this.policy.retries; attempt++) {
      if (signal?.aborted === true) throw new SourceFetchError(url, 'cancelled by caller')
      if (attempt > 0) await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** (attempt - 1)))
      try {
        const response = await this.fetchImpl(url, {
          headers: { ...COLLECTOR_HEADERS, Referer: referer },
          signal: signal ?? AbortSignal.timeout(this.policy.timeoutMs),
        })
        if (!response.ok) throw new SourceFetchError(url, `HTTP ${response.status}`)
        const buffer = Buffer.from(await response.arrayBuffer())
        return buffer.toString('utf8')
      } catch (error) {
        lastError = error
        if (error instanceof SourceFetchError && /cancelled/u.test(error.message)) throw error
      }
    }
    const detail = lastError instanceof Error ? lastError.message : String(lastError)
    throw new SourceFetchError(url, `exhausted ${this.policy.retries + 1} attempt(s): ${detail}`)
```

</details>

**依据 10 · 源码核查**：[src/tools/shared.ts:362-390](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/tools/shared.ts#L362-L390)

review可跳过，写note不是主报告事务。

<details>
<summary>查看原文（29行）</summary>

```text
  const jobs = deps.ctx.get('jobs') as unknown as ReviewJobsLike | undefined
  if (jobs === undefined) {
    state.review = 'skipped(jobs unavailable)'
    return
  }
  if (agent === undefined) {
    state.review = 'skipped(no agent owner)'
    return
  }
  const jobId = jobs.start({
    kind: FUND_REVIEW_JOB_KIND,
    label: `fund review ${state.code}`,
    // The 0.1.7 jobs line fences a job by the owner's SESSION ID (`JobSpec.owner`),
    // where the pre-0.1.7 line took the live Agent instance itself.
    owner: agent.id,
    run: (handle?: JobOutputAppendLike): JobHooks => {
      const progress: string[] = []
      // Feed both producer faces with one call: the 0.1.7 output ring (the handle)
      // and the pre-0.1.7 progress cursor (`readOutput`) the older lines read.
      const emit = (line: string): void => {
        progress.push(line)
        handle?.append(line)
      }
      const done = (async (): Promise<JobOutcome> => {
        try {
          const { markdown } = await reviewSealedReport(versionDir)
          emit(markdown)
          return { status: 'completed', detail: 'review-note.md written', result: markdown, output: markdown } as JobOutcome
        } catch (error) {
```

</details>

#### 缺口

- 宿主peer组合、网络延迟、中断写入和多调用并发未验证，缓存/状态文件未全面并发审计。
  **影响**：不保证实时数据、定时完成、持久去重或并发隔离，需小范围副本验证。
  **进一步探讨**：用固定宿主、只一支基金与离线样本验证恢复；另模拟慢响应、状态不可写、部分文件和多项失败，查看工具与job各状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁可试用，哪种新假设有可证伪依据？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

可供懂基金数据口径、愿意逐值复核的研究者试用固定离线样本底稿，暂不用于历史无前视回测或买卖决策。先在副本工作区固定一支基金、缓存日期/版本和riskFreeRate，运行后对照原始公开材料独立复算净值窗口与重仓覆盖，检查gaps、附录和hash；在线端点和宿主能力需另做实际验收。本轮没有执行这些步骤。停止条件是必需源漂移、日期口径混淆、数字无法复算、出现无法解释文件/状态，退路是禁用/移除插件并保留已导出的Markdown/JSON，在原资料和计算表中复核，不依赖内置review做篡改审计。

可推导的新增方向是双时间约束的研究快照：除净值日期外，给持仓、经理、报价和来源记录observedAt/availableAt、各字段截至口径，报告把可历史使用与仅供当前补充的章节分开。依据是cutoff只截navTrend而其余raw复用，不能把这个未实现方向计入当前贡献。最小验证使用有明确披露日期的固定资料，对旧实现与双时间原型做同日截点报告，检查任何晚披露字段是否被用入历史结论，并独立比较覆盖率和维护成本。若无法提供可审计披露时间，或降低泄漏同时使报告覆盖不足应明确拒用相应章节，而不捏造日期；若无误用改善或成本不可承受则否定推广收益。

另一个直接验证是修改report数字而不改snapshot，比较hash检查与当前review的检出率；这用于确认机制边界，不假定已经修复。采用价值来自可复算资料包，而非“verified意味着市场事实真实”。

#### 证据与依据

**依据 1 · 源码核查**：[src/sources/snapshot.ts:184-190](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/sources/snapshot.ts#L184-L190)

仅净值过滤支撑双时间字段假设。

```text
export function applyAsOfCutoff(raw: FundSnapshot['raw'], asOfDate: string): FundSnapshot['raw'] {
  const navTrend = raw.navTrend.filter(point => dateOf(point.t) <= asOfDate)
  if (navTrend.length < 2) {
    throw new Error(`asOfDate ${asOfDate} leaves fewer than 2 NAV points (${navTrend.length}); cannot compute performance`)
  }
  return { ...raw, navTrend }
}
```

**依据 2 · 源码核查**：[src/sources/snapshot.ts:263-277](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/sources/snapshot.ts#L263-L277)

其余raw与计算仍源于当前采集。

<details>
<summary>查看原文（15行）</summary>

```text
  const raw = asOfDate === undefined ? collected.raw : applyAsOfCutoff(collected.raw, asOfDate)
  const snapshot: FundSnapshot = {
    schema: SNAPSHOT_SCHEMA,
    code,
    name: collected.name,
    fetchedAt: collected.fetchedAt,
    sources: collected.sources,
    raw,
    computed: computeMetrics(raw, store.config.riskFreeRate),
    parameters: computationParameters(store.config.riskFreeRate),
    gaps: collected.gaps,
    ...(asOfDate === undefined ? {} : { asOf: asOfDate }),
  }
  await storeSnapshot(store, snapshot)
  return {
```

</details>

**依据 3 · 源码核查**：[src/review.ts:42-82](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/review.ts#L42-L82)

实际报告数字未解析，支持独立篡改验证。

<details>
<summary>查看原文（41行）</summary>

```text
  const snapshotText = await readFile(path.join(versionDir, 'snapshot.json'), 'utf8')
  const snapshot = fundSnapshotSchema.parse(JSON.parse(snapshotText)) as FundSnapshot
  const manifest = JSON.parse(await readFile(path.join(versionDir, 'manifest.json'), 'utf8')) as ReportManifest
  const reportText = await readFile(path.join(versionDir, 'report.md'), 'utf8')

  const disclaimerPresent = reportText.includes(DISCLAIMER)
  const gapDeclared = { declared: [] as string[], missing: [] as string[] }
  for (const gap of manifest.gaps) {
    if (reportText.includes(`缺口：${gap}`)) gapDeclared.declared.push(gap)
    else gapDeclared.missing.push(gap)
  }

  const body = buildBody(snapshot)
  const result = await builtinVerifyCitations({
    dataset: path.join(versionDir, 'snapshot.json'),
    citations: body.citations.map(citation => ({
      id: citation.id,
      path: citation.path,
      value: citation.value,
      tolerance: citation.tolerance,
    })),
  })
  const traceTally = { verified: 0, mismatch: 0, notFound: 0, unverifiable: 0 }
  for (const entry of result.results) {
    if (entry.status === 'verified') traceTally.verified++
    else if (entry.status === 'mismatch') traceTally.mismatch++
    else if (entry.status === 'not-found') traceTally.notFound++
    else traceTally.unverifiable++
  }

  const checks: ReviewChecks = { disclaimerPresent, gapDeclared, traceTally }
  const markdown = renderReviewNote(manifest, checks)
  await writeFile(path.join(versionDir, 'review-note.md'), markdown, 'utf8')
  return { markdown, checks }
}

/** Render the review-note markdown from the manifest and the check results. */
export function renderReviewNote(manifest: ReportManifest, checks: ReviewChecks): string {
  const declared = checks.gapDeclared.declared.length === 0 ? '无' : checks.gapDeclared.declared.join('、')
  const missing = checks.gapDeclared.missing.length === 0 ? '无' : checks.gapDeclared.missing.join('、')
  return [
```

</details>

**依据 4 · 源码核查**：[src/index.ts:119-129](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/index.ts#L119-L129)

enabled=false无能力挂载，支持明确退出。

<details>
<summary>查看原文（11行）</summary>

```text
  if (!resolved.enabled) {
    logger.info('disabled: enabled is false — no fund-research capabilities are mounted')
    return
  }

  const domain = await ctx.storageDomain.open(fundResearchDomainSpec)
  ctx.effect(() => () => domain.close(), 'dsh-fund-research: storage domain')

  const fetcher = new PoliteFetcher({
    requestIntervalMs: resolved.requestIntervalMs,
    timeoutMs: resolved.timeoutMs,
```

</details>

**依据 5 · 源码核查**：[src/report.ts:484-500](https://github.com/PerryLink/dsh-fund-research/blob/9f0344d25f99020cddf8563fc4eb6ebba748c624/src/report.ts#L484-L500)

已导出文件可保留作独立资料底稿。

<details>
<summary>查看原文（17行）</summary>

```text
    schema: 'dsh-fund-research/manifest@v1',
    code: snapshot.code,
    name: snapshot.name,
    version,
    sealedAt: now,
    sources: snapshot.sources,
    snapshotSha256: options.snapshotSha256,
    parameters: snapshot.parameters,
    reportSha256: sha256Of(markdown),
    verifyEngine: options.outcome.engine,
    gaps: snapshot.gaps,
    ...(snapshot.asOf === undefined ? {} : { asOf: snapshot.asOf }),
    generator: options.generator,
  }
  const manifestPathAbs = path.join(versionDir, 'manifest.json')
  const manifestJson = JSON.stringify(manifest, null, 2)
  await writeFile(manifestPathAbs, manifestJson, 'utf8')
```

</details>

#### 缺口

- 双时间数据能否获得、带来多少覆盖损失和用户是否愿意承担标注成本未知。
  **影响**：不能把研究设想称已实现或净收益。
  **进一步探讨**：固定披露日样本比较泄漏、覆盖与维护投入，无法证明可得性就禁止历史章节使用。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
