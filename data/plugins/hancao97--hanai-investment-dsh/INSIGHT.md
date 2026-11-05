# Hanai Worth 值见

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[32c74c7](https://github.com/hancao97/hanai-investment-dsh/tree/32c74c741118d7f29217e820810e55fab5bd2a3c)

<!-- BEGIN META -->
[![GitHub ★ 120](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=120&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hancao97/hanai-investment-dsh)
<!-- END META -->

> **功能**：将行情快照、研究会话与可校验报告归档集中在独立 DSH 工作台

> **亮点**：[Q01](#research-q01) 将来源状态和报告归档串到同一研究流程。

> **主要限制**：[Q03](#research-q03) 可校验文件与事实准确是独立指标。

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
  - [Q01 · 可复核交付是什么？](#detail-section-11)
  - [Q02 · 机制如何实现？](#detail-section-12)
  - [Q03 · 有哪些边界？](#detail-section-13)
  - [Q04 · 如何采用和退出？](#detail-section-14)
  - [Q05 · 怎样判断采用价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：研究者希望在同一工作台保留可复核的行情观察和报告。

表格、聊天和文档分别保存。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 表格、聊天和文档分别保存。 | 可直接比较 | 保留人工步骤 |
| Hanai Worth 值见 | 将来源状态和报告归档串到同一研究流程。 | 可校验文件与事实准确是独立指标。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 行情缓存与研判工作区对接 DSH Session，报告按版本封存。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 研究者希望在同一工作台保留可复核的行情观察和报告。 | 保留原流程 |
| 试验 | 行情缓存与研判工作区对接 DSH Session，报告按版本封存。 | 观察固定版本 |
| 复核 | 用虚构历史材料确认缓存、封存与迁移。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 对同一份历史资料保留可复核的研究快照和反证 | 对照任务可减少查找来源和整理报告的时间。 | 用虚构历史材料确认缓存、封存与迁移。 |

> **思考**：[Q03](#research-q03) 可校验文件与事实准确是独立指标。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将来源状态和报告归档串到同一研究流程。

数据目录分离，报告哈希、版本与会话可关联。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 可校验文件与事实准确是独立指标。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用虚构历史材料确认缓存、封存与迁移。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的对同一份历史资料保留可复核的研究快照和反证。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、packages/domain/src/reports.ts、packages/domain/src/providers/cache.ts、packages/domain/src/paths.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的对同一份历史资料保留可复核的研究快照和反证。未执行目标代码或实际宿主验证。
- 下一步：保留原始资料、预期状态和报告校验表。

**分析版本**

- **仓库**：[hancao97/hanai-investment-dsh](https://github.com/hancao97/hanai-investment-dsh)
- **版本号**：0.1.0（[固定提交 32c74c7](https://github.com/hancao97/hanai-investment-dsh/tree/32c74c741118d7f29217e820810e55fab5bd2a3c)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照任务可减少查找来源和整理报告的时间。

保留原始资料、预期状态和报告校验表。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 101 | 16512 | — | — | 350133 |
| .tsx | source | 7 | 4092 | 3775 | 47 | — |
| .ts | source | 47 | 14321 | 13004 | 366 | — |
| .tsx | test | 5 | 2079 | 1849 | 9 | — |
| .ts | test | 26 | 4348 | 3933 | 16 | — |
| .mjs | source | 1 | 219 | 209 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/hancao97/hanai-investment-dsh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/hancao97/hanai-investment-dsh/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hancao97/hanai-investment-dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：对同一份历史资料保留可复核的研究快照和反证

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 可复核交付是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

研究者可为标的整理来源、分析和反证，再把同一 DSH 会话产出的报告封存。相比复制到零散笔记，验收是能同时回到原始资料和会话，并根据 manifest 验证报告哈希。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-18](https://github.com/hancao97/hanai-investment-dsh/blob/32c74c741118d7f29217e820810e55fab5bd2a3c/README.md#L12-L18)

作者说明研究工作台及宿主分工

```text
**Hanai Worth · 值见** 是以 DeepSeek Harness 为 Agent 内核的本地优先 A 股研究工作台。它把市场全景、自选估值、个股行情与 K 线观察、大师方法论研判、专家开放对谈、报告归档和持续追问放进一条完整研究链路，帮助用户从“发现一家公司”走到“形成并持续验证自己的判断”。

DeepSeek Harness（DSH）负责模型、Agent、工具、Session、流式事件和会话持久化；Hanai Worth 负责证券与估值数据、自选分组、研究资料、不可变报告快照和全部产品界面。产品包含“今日市场、自选与发现、大师研判、专家对谈、专家中心、设置与诊断”六个一级页面，以及个股、研判和对谈详情页。

插件包名为 `hanai-investment-dsh`，独立 DSH Profile 名为 `hanai-investment`；安装和启动命令使用这两个名称。当前已验证的 DSH 版本为 `0.2.1-rc.2`。

品牌中的两条趋势线在证据点形成金叉：价格给出市场报价，研究帮助看见价值。每一份研判，都应能回到证据、方法与上下文。
```

**依据 2 · 源码核查**：[packages/domain/src/reports.ts:16-32](https://github.com/hancao97/hanai-investment-dsh/blob/32c74c741118d7f29217e820810e55fab5bd2a3c/packages/domain/src/reports.ts#L16-L32)

清单记录模型、会话和正文摘要

<details>
<summary>查看原文（17行）</summary>

```text
export interface ReportManifest {
  schemaVersion: 1
  judgementId: string
  reportVersion: number
  secId: string
  code: string
  stockName: string
  masterId: string
  masterVersion: string
  dshSessionId: string
  modelProvider: string | null
  model: string | null
  reasoningEffort: string | null
  sealedAt: string
  sizeBytes: number
  sha256: string
  source: 'workspace/REPORT.md'
```

</details>

#### 缺口

- 来源准确性需单独核验。
  **影响**：减少整理和追溯成本。
  **进一步探讨**：以合成历史资料生成两份版本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 机制如何实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

每次研判准备工作目录并保存方法模板和研究上下文。报告长度和标题通过后，程序将 Markdown 与包含模型和哈希的 manifest 写到暂存目录，再重命名到版本目录。行情缓存会合并同键刷新，并在失败时将旧值标为 stale。

#### 证据与依据

**依据 1 · 源码核查**：[packages/domain/src/reports.ts:42-60](https://github.com/hancao97/hanai-investment-dsh/blob/32c74c741118d7f29217e820810e55fab5bd2a3c/packages/domain/src/reports.ts#L42-L60)

研判工作区和研究上下文

<details>
<summary>查看原文（19行）</summary>

```text
  prepareWorkspace(judgementId: string, master: MasterPersona): PreparedWorkspace {
    assertIdentifier(judgementId)
    const workspace = join(this.paths.judgementsDir, judgementId, 'workspace')
    mkdirSync(workspace, { recursive: true, mode: 0o700 })
    chmodSync(workspace, 0o700)
    const installed = installMasterSnapshot(this.assetsRoot, master, workspace)
    return {
      workspace,
      workingReport: join(workspace, 'REPORT.md'),
      skillPath: installed.skillPath,
    }
  }

  writeResearchContext(workspace: string, detail: StockDetail): string {
    this.assertInDataRoot(workspace)
    const target = join(workspace, 'RESEARCH_CONTEXT.md')
    const content = researchContextMarkdown(detail)
    writeFileSync(target, content, { encoding: 'utf8', mode: 0o600 })
    return target
```

</details>

**依据 2 · 源码核查**：[packages/domain/src/reports.ts:64-116](https://github.com/hancao97/hanai-investment-dsh/blob/32c74c741118d7f29217e820810e55fab5bd2a3c/packages/domain/src/reports.ts#L64-L116)

最小校验、哈希及版本封存

<details>
<summary>查看原文（53行）</summary>

```text
    const path = this.workingReportPath(judgementId)
    if (!existsSync(path)) throw new ReportValidationError('report-missing', 'Agent 未生成 REPORT.md')
    const content = readFileSync(path, 'utf8').trim()
    const charCount = [...content].length
    if (charCount < this.minChars) {
      throw new ReportValidationError(
        'report-too-short',
        `REPORT.md 仅 ${charCount} 个字符，至少需要 ${this.minChars} 个字符`,
      )
    }
    if (!/^#\s+.+/m.test(content)) {
      throw new ReportValidationError('report-heading-missing', 'REPORT.md 缺少一级标题')
    }
    const bytes = Buffer.byteLength(content, 'utf8')
    return { content, sizeBytes: bytes, sha256: sha256(content) }
  }

  seal(judgement: Judgement, version: number): ReportVersion & { relativePath: string } {
    if (judgement.dshSessionId === null) throw new Error('无法封存未绑定 DSH Session 的研判')
    if (!Number.isSafeInteger(version) || version < 1) throw new Error('报告版本必须是正整数')
    const validated = this.validateWorkingReport(judgement.id)
    const sealedAt = new Date().toISOString()
    const versionName = String(version).padStart(4, '0')
    const targetDirectory = join(this.paths.judgementsDir, judgement.id, 'reports', versionName)
    const stagingDirectory = `${targetDirectory}.staging`
    if (existsSync(targetDirectory)) return this.readExistingSeal(judgement, version, targetDirectory)
    rmSync(stagingDirectory, { recursive: true, force: true })
    mkdirSync(stagingDirectory, { recursive: true, mode: 0o700 })
    const reportPath = join(stagingDirectory, 'report.md')
    const manifestPath = join(stagingDirectory, 'manifest.json')
    writeFileSync(reportPath, validated.content, { encoding: 'utf8', mode: 0o600 })
    const manifest: ReportManifest = {
      schemaVersion: 1,
      judgementId: judgement.id,
      reportVersion: version,
      secId: judgement.secId,
      code: judgement.code,
      stockName: judgement.stockName,
      masterId: judgement.masterId,
      masterVersion: judgement.masterVersion,
      dshSessionId: judgement.dshSessionId,
      modelProvider: judgement.modelProvider,
      model: judgement.model,
      reasoningEffort: judgement.reasoningEffort,
      sealedAt,
      sizeBytes: validated.sizeBytes,
      sha256: validated.sha256,
      source: 'workspace/REPORT.md',
    }
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 })
    chmodSync(reportPath, 0o600)
    chmodSync(manifestPath, 0o600)
    renameSync(stagingDirectory, targetDirectory)
```

</details>

**依据 3 · 源码核查**：[packages/domain/src/providers/cache.ts:11-31](https://github.com/hancao97/hanai-investment-dsh/blob/32c74c741118d7f29217e820810e55fab5bd2a3c/packages/domain/src/providers/cache.ts#L11-L31)

合并刷新和失败降级

<details>
<summary>查看原文（21行）</summary>

```text
  get(key: string, load: () => Promise<T>): Promise<T | null> {
    const pending = this.pending.get(key)
    if (pending !== undefined) return pending
    const cached = this.entries.get(key)
    if (cached !== undefined && cached.expiresAt > this.clock.now()) {
      return Promise.resolve(cached.value === null ? null : this.cached(cached.value))
    }
    const promise = load().then(value => {
      this.entries.set(key, { value, expiresAt: this.clock.now() + this.ttlMs })
      return value
    }).catch(() => {
      const value = cached?.value === null || cached?.value === undefined ? null
        : { ...cached.value, meta: { ...cached.value.meta, cacheState: 'stale' as const } }
      this.entries.set(key, { value, expiresAt: this.clock.now() + 60_000 })
      return value
    }).finally(() => {
      this.pending.delete(key)
      if (this.entries.size > 500) this.entries.delete(this.entries.keys().next().value!)
    })
    this.pending.set(key, promise)
    return promise
```

</details>

#### 缺口

- 版本封存与模型正确性是两件事。
  **影响**：保留报告当时内容和数据状态。
  **进一步探讨**：分别制造供数失败和无效报告。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 有哪些边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

文件摘要证明封存字节，可查验正文与清单对应。长度和标题校验不保证引用真实或结论正确。作者报告明示研究角色是同源 AI 方法角色，历史频率也不支持未来收益结论。

#### 证据与依据

**依据 1 · 源码核查**：[packages/domain/src/reports.ts:64-78](https://github.com/hancao97/hanai-investment-dsh/blob/32c74c741118d7f29217e820810e55fab5bd2a3c/packages/domain/src/reports.ts#L64-L78)

仅校验长度、一级标题和字节摘要

<details>
<summary>查看原文（15行）</summary>

```text
    const path = this.workingReportPath(judgementId)
    if (!existsSync(path)) throw new ReportValidationError('report-missing', 'Agent 未生成 REPORT.md')
    const content = readFileSync(path, 'utf8').trim()
    const charCount = [...content].length
    if (charCount < this.minChars) {
      throw new ReportValidationError(
        'report-too-short',
        `REPORT.md 仅 ${charCount} 个字符，至少需要 ${this.minChars} 个字符`,
      )
    }
    if (!/^#\s+.+/m.test(content)) {
      throw new ReportValidationError('report-heading-missing', 'REPORT.md 缺少一级标题')
    }
    const bytes = Buffer.byteLength(content, 'utf8')
    return { content, sizeBytes: bytes, sha256: sha256(content) }
```

</details>

**依据 2 · 作者声明**：[README.md:24-30](https://github.com/hancao97/hanai-investment-dsh/blob/32c74c741118d7f29217e820810e55fab5bd2a3c/README.md#L24-L30)

作者区分历史快照、同源角色和独立投票

```text
| 2026-10-18 A 股投资报告 | [五个方向 · 二十家公司](https://hancao97.github.io/hanai-investment-dsh/a-share-investment-report.html) | [a-share-investment-report-2026-10-18.html](docs/a-share-investment-report-2026-10-18.html) | 10 月 16 日收盘快照、宏观与全球局势、GF 摘要、20 家公司买入前提与经营反证、筛选与估值压力演示 |
| 变盘点能力审计 | [在线审计报告](https://hancao97.github.io/hanai-investment-dsh/turning-point-capability-audit-2026-08-23.html) | [turning-point-capability-audit-2026-08-23.html](docs/turning-point-capability-audit-2026-08-23.html) | 当前 10 类生产标记、22 个有效周期格、matched 增量、候选与缠论生命周期 |
| A 股未来一年周期展望 | [完整门禁版在线报告](https://hancao97.github.io/hanai-investment-dsh/a-share-cycle-outlook.html) | [a-share-cycle-outlook-2026-08-25.html](docs/a-share-cycle-outlook-2026-08-25.html) | 点时市场截面、主题A—C证据评分、六股质量/估值/相对强弱、条件历史比例、六门结果与Round 4全状态复核 |

[GitHub Pages 报告目录](https://hancao97.github.io/hanai-investment-dsh/)保留各期入口。10 月投资报告使用软件公开行情与财务链路、官方宏观资料及公司公告；将东泰山、散户乙、段永平、巴菲特、芒格五个内置 Skill 的方法统一应用于研究，**没有独立专家投票**。20 家公司是附条件候选池，不是要求同时买入；GF 参考值、源标签和报告筛选门槛分别展示，数据日期、口径差异与反证均在页面内说明。

周期展望实际调用仓库内五个专家 Skill，但它们是同源的 **AI 方法论角色**。完成版先冻结2026-08-25市场解析快照与官方财报，补齐事实、机制、质量、估值和反证五门，再由 Round 4 的独立 `council_vote` 关闭会商门；[专家实际读取的前置输入](docs/research-data/a-share-cycle-outlook-pre-council-2026-08-25.json)与五份[原始输出、提示词及 Skill 哈希](docs/research-data/a-share-cycle-expert-runs-2026-08-25.json)分别保存并以 SHA 绑定。主题映射核对和股票门禁核对不是独立投票，具体模型与reasoning配置也未在产物中冻结；报告不提供未经校准的概率、目标价或收益承诺。
```

**依据 3 · 作者声明**：[README.md:46-50](https://github.com/hancao97/hanai-investment-dsh/blob/32c74c741118d7f29217e820810e55fab5bd2a3c/README.md#L46-L50)

作者限定历史统计口径

```text
变盘点把可复算的量价条件直接标在日/周/月 K 线上。下图是实际运行界面：中国平安在 2026-07-01 命中 `低位破低反包`，悬浮卡同时展示触发条件、20 日历史方向频率、样本数、同场景对照和研究截止日；工具栏可以一键显示或隐藏全部变盘点。

![Hanai Worth · 值见变盘点——低位破低反包、历史回测证据与显示开关](docs/assets/kline-turning-points.jpg)

> 截图中的百分比是截至 2026-08-20 的历史条件频率，不是对中国平安下一次走势的预测，也不构成投资建议。
```

#### 缺口

- 数据源和样本口径未在本次验证。
  **影响**：不应将输出用于实际投资判断。
  **进一步探讨**：用虚构错误引文试验独立复核。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何采用和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者指定独立 profile 与固定宿主 rc，并分开管理 Hanai 资料及 DSH 会话。首次成本含安装和数据源核对，持续成本含模型和数据供应，退出要备份两套数据并核对报告及会话能分别恢复。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:207-224](https://github.com/hancao97/hanai-investment-dsh/blob/32c74c741118d7f29217e820810e55fab5bd2a3c/README.md#L207-L224)

作者说明隔离 profile 和版本前置

<details>
<summary>查看原文（18行）</summary>

````text
DSH 仍处于 pre-release，rc 之间不承诺兼容。安装器会在修改 Profile 前检查 CLI 是否为已验证的 `0.2.1-rc.2`。包内 `engines.dsh` 也限定同一版本，供 DSH 明确识别已验证的兼容版本。仓库把 Host、Client 和 profile 装配都纳入兼容性检查；升级时需运行完整门禁，并实际启动独立 Profile，不能只检查配置组合。

## 从源码安装

```bash
git clone git@github.com:hancao97/hanai-investment-dsh.git
cd hanai-investment-dsh
npm install -g @deepseek-ai/dsh@0.2.1-rc.2
pnpm install --frozen-lockfile
pnpm run build
pnpm run profile:install -- --package .
pnpm run profile:verify
dsh --profile hanai-investment --port 3080
```

已有源码时，从仓库根目录执行 `npm install -g` 起的命令即可。如果 pnpm 版本不符，可以通过已安装的 Corepack 执行 `corepack enable` 和 `corepack prepare pnpm@11.7.0 --activate`。

安装器会创建或安全迁移独立的 `hanai-investment` Profile。最终 Bundle 顺序固定为 DSH Base、DSH Web App、Hanai；只有 `hanai-investment-dsh` 是 Profile dependency。Base 与 Web App 必须由当前 DSH CLI 的 installation-owned runtime resolution 提供，不能再用 `dsh plugin add @deepseek-ai/dsh-web-app` 安装到 Profile，否则相同版本的 DSH runtime 仍可能被加载成两个模块实例。安装器会拒绝修改 `web`、`headless` 等保留 Profile，也会在目标 Profile 含无关依赖或 Bundle 时停止。
````

</details>

**依据 2 · 源码核查**：[packages/domain/src/paths.ts:18-35](https://github.com/hancao97/hanai-investment-dsh/blob/32c74c741118d7f29217e820810e55fab5bd2a3c/packages/domain/src/paths.ts#L18-L35)

独立数据根路径

<details>
<summary>查看原文（18行）</summary>

```text
/** Resolve only the dedicated DSH-plugin data root; no previous product root is ever probed. */
export function resolveHanaiPaths(configured?: string): HanaiPaths {
  const candidate = configured?.trim() || process.env.HANAI_INVESTMENT_DSH_HOME?.trim()
  const root = candidate === undefined || candidate === ''
    ? join(homedir(), '.hanai-investment-dsh')
    : isAbsolute(candidate) ? resolve(candidate) : resolve(process.cwd(), candidate)
  return {
    root,
    databaseDir: join(root, 'db'),
    databasePath: join(root, 'db', 'hanai.sqlite'),
    cacheDir: join(root, 'cache'),
    marketCacheDir: join(root, 'cache', 'market'),
    valuationCacheDir: join(root, 'cache', 'valuation'),
    judgementsDir: join(root, 'judgements'),
    expertChatsDir: join(root, 'expert-chats'),
    exportsDir: join(root, 'exports'),
    tmpDir: join(root, 'tmp'),
  }
```

</details>

**依据 3 · 作者声明**：[README.md:300-317](https://github.com/hancao97/hanai-investment-dsh/blob/32c74c741118d7f29217e820810e55fab5bd2a3c/README.md#L300-L317)

作者说明双目录迁移

<details>
<summary>查看原文（18行）</summary>

````text
├── db/hanai.sqlite
├── cache/
├── judgements/<id>/workspace/
├── judgements/<id>/reports/<version>/
└── expert-chats/<id>/workspace/
```

首次使用当前隔离数据根时会建立空数据库，不会自动导入旧版独立项目的数据。已有 `~/.hanai-investment-dsh` 时，更新源码、重新构建或重启会继续使用其中的自选、研判和专家对谈索引。

以下内容仍由当前 `$DSH_HOME` 管理：

- DeepSeek Key 与模型设置；
- Session 事件、消息、工具历史；
- 聊天附件、浏览器认证凭据和 Profile 安装状态。

备份或迁移时，应同时保留 Hanai 数据根和当前 DSH 数据目录；只备份 SQLite 无法恢复 DSH 持有的完整对话。自定义了 `DSH_HOME` 时，后续启动请继续使用相同目录。

Hanai 数据根默认权限为 `0700`，普通数据文件为 `0600`。API Key 是 write-only secret：页面提交后清空输入，RPC 不返回明文，日志和报告也不得包含它。
````

</details>

#### 缺口

- 供应商可用性、配额及恢复耗时未知。
  **影响**：备份单一 SQLite 无法覆盖完整会话。
  **进一步探讨**：在虚构 profile 验证两目录恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样判断采用价值？

**研究主题**：新假设与验证

#### 完整回答

用同一份合成资料对比表格加手工笔记和插件归档，记录时间、证据追溯、快照校验和恢复。人为令报价过期或缺失，提交有标题但引用错的报告。若过期被误认新鲜、引用无法核对或无法重开原会话，则目标未达成。

#### 证据与依据

**依据 1 · 源码核查**：[packages/domain/src/providers/cache.ts:18-35](https://github.com/hancao97/hanai-investment-dsh/blob/32c74c741118d7f29217e820810e55fab5bd2a3c/packages/domain/src/providers/cache.ts#L18-L35)

失败时保留并标记 stale

<details>
<summary>查看原文（18行）</summary>

```text
    const promise = load().then(value => {
      this.entries.set(key, { value, expiresAt: this.clock.now() + this.ttlMs })
      return value
    }).catch(() => {
      const value = cached?.value === null || cached?.value === undefined ? null
        : { ...cached.value, meta: { ...cached.value.meta, cacheState: 'stale' as const } }
      this.entries.set(key, { value, expiresAt: this.clock.now() + 60_000 })
      return value
    }).finally(() => {
      this.pending.delete(key)
      if (this.entries.size > 500) this.entries.delete(this.entries.keys().next().value!)
    })
    this.pending.set(key, promise)
    return promise
  }

  private cached(value: T): T {
    return { ...value, meta: { ...value.meta, cacheState: value.meta.cacheState === 'fresh' ? 'cached' : value.meta.cacheState } }
```

</details>

**依据 2 · 源码核查**：[packages/domain/src/reports.ts:64-116](https://github.com/hancao97/hanai-investment-dsh/blob/32c74c741118d7f29217e820810e55fab5bd2a3c/packages/domain/src/reports.ts#L64-L116)

封存条件和哈希可独立验证

<details>
<summary>查看原文（53行）</summary>

```text
    const path = this.workingReportPath(judgementId)
    if (!existsSync(path)) throw new ReportValidationError('report-missing', 'Agent 未生成 REPORT.md')
    const content = readFileSync(path, 'utf8').trim()
    const charCount = [...content].length
    if (charCount < this.minChars) {
      throw new ReportValidationError(
        'report-too-short',
        `REPORT.md 仅 ${charCount} 个字符，至少需要 ${this.minChars} 个字符`,
      )
    }
    if (!/^#\s+.+/m.test(content)) {
      throw new ReportValidationError('report-heading-missing', 'REPORT.md 缺少一级标题')
    }
    const bytes = Buffer.byteLength(content, 'utf8')
    return { content, sizeBytes: bytes, sha256: sha256(content) }
  }

  seal(judgement: Judgement, version: number): ReportVersion & { relativePath: string } {
    if (judgement.dshSessionId === null) throw new Error('无法封存未绑定 DSH Session 的研判')
    if (!Number.isSafeInteger(version) || version < 1) throw new Error('报告版本必须是正整数')
    const validated = this.validateWorkingReport(judgement.id)
    const sealedAt = new Date().toISOString()
    const versionName = String(version).padStart(4, '0')
    const targetDirectory = join(this.paths.judgementsDir, judgement.id, 'reports', versionName)
    const stagingDirectory = `${targetDirectory}.staging`
    if (existsSync(targetDirectory)) return this.readExistingSeal(judgement, version, targetDirectory)
    rmSync(stagingDirectory, { recursive: true, force: true })
    mkdirSync(stagingDirectory, { recursive: true, mode: 0o700 })
    const reportPath = join(stagingDirectory, 'report.md')
    const manifestPath = join(stagingDirectory, 'manifest.json')
    writeFileSync(reportPath, validated.content, { encoding: 'utf8', mode: 0o600 })
    const manifest: ReportManifest = {
      schemaVersion: 1,
      judgementId: judgement.id,
      reportVersion: version,
      secId: judgement.secId,
      code: judgement.code,
      stockName: judgement.stockName,
      masterId: judgement.masterId,
      masterVersion: judgement.masterVersion,
      dshSessionId: judgement.dshSessionId,
      modelProvider: judgement.modelProvider,
      model: judgement.model,
      reasoningEffort: judgement.reasoningEffort,
      sealedAt,
      sizeBytes: validated.sizeBytes,
      sha256: validated.sha256,
      source: 'workspace/REPORT.md',
    }
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 })
    chmodSync(reportPath, 0o600)
    chmodSync(manifestPath, 0o600)
    renameSync(stagingDirectory, targetDirectory)
```

</details>

#### 缺口

- 未运行供数、模型或迁移链路。
  **影响**：验收研究流程而非收益率。
  **进一步探讨**：保留原始资料、预期状态和报告校验表。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
