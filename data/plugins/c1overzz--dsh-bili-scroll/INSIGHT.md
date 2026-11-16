# dsh-bili-scroll

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[6f3ab83](https://github.com/c1overzz/dsh-bili-scroll/tree/6f3ab83993ccc51df9331048a8f9a51bef19bc28)

<!-- BEGIN META -->
[![GitHub ★ 1,416](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C416&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/c1overzz/dsh-bili-scroll) [![npm 30d 78,127](https://img.shields.io/static/v1?label=npm+30d&message=78%2C127&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bili-scroll) [![最新发布 2026-11-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bili-scroll)
<!-- END META -->

> **功能**：在 DSH 中按关键词或推荐筛选 B站视频，可写日报，并按设置提供评论、私信和收藏。

> **亮点**：将 B 站关键词/推荐筛选、视频/字幕整理和日报串成 DSH 值班流程；当前版本值得关注的工程增量是单窗口有限重试：报告未变化时保留重试机会，最多尝试三次。该设计改变失败恢复路径，不证明候选相关性或日报质量提升。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：日窗口判据只观察文件戳或退出码。试用须另行限制实际工具范围，自动评论开关无法约束 force、私信和收藏。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 插件替用户完成哪些 B 站值班任务，比较基线是什么？](#detail-section-11)
  - [Q02 · 轮次失败如何重试，何时消耗日窗口？](#detail-section-12)
  - [Q03 · 权限、账号、模型与外发边界是什么？](#detail-section-13)
  - [Q04 · 成本、效果与安全的采用条件如何验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：插件面向持续关注 B 站主题并需要从候选视频、字幕整理到日报的用户。相较手工搜索复制链接，源码把查询筛选、报告更新和条件式互动接入 DSH；集成不证明推荐质量或节省时间。本次版本改善失败后窗口的重试处理。

基线为手工完成相同任务或旧研究固定版本；没有同条件效果测量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 内容筛选 | 推荐或搜索，读原字幕 | 内容可信仍需核对 |
| 日报 | 按日追加并回看 BV | 关闭报告时没有正文产物 |
| 账号互动 | 条件式评论、私信与收藏 | 确认实际开关、授权和回执 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 0.1.7-rc.1+、Node 22+ | manifest 声明 | bundle 和宿主 | 先核对实际 profile |
| Python 环境、网络、授权 B站账号 | 对相应 MCP 和登录路径必需 | 读取与账务确认 | 环境未就绪先停止轮次 |
| 宿主模型及视觉附件 | 模型必需，图片按需 | 筛选与看图 | 图像路径可能降级 |
| 转写环境与模型 | 可选 | 无字幕转写 | 按报告记下未覆盖 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对环境、来源、凭证与生效设置 | 确认只读工具清单与本地输出位置 |
| 执行 | 用户发起一次小轮，Agent 读字幕并整理 | 有候选与来源，失败看日志或占位报告 |
| 验收 | 用户复核原片、交互及报告 | 无法对账时停止重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Python 环境、网络及账号，金额未知 | 安装、扫码、确认权限和工具 | 自动下载可无摘要，渠道须核对 |
| 持续使用 | 模型 token 与可选 ASR CPU、存储，实际未知 | 对照原视频，核对权限和报告 | 无同条件节时数据 |
| 失败恢复 | 重跑消耗与已发生远程动作，金额未知 | 排查 profile、核对回执和残留 | 超时和未查到无法判定未发生 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 内容筛选 | 有候选、字幕和日报接线 | 入选准确、遗漏与人工节省 |
| 日报维护 | 固定形状原地替换、读回 BV 号 | 并发完整性与最终内容质量 |
| 互动控制 | 配置、名单、PID 锁与回执复核 | 是否出现误投递及重复 |

> **思考**：日窗口判据只观察文件戳或退出码。试用须另行限制实际工具范围，自动评论开关无法约束 force、私信和收藏。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将 B 站关键词/推荐筛选、视频/字幕整理和日报串成 DSH 值班流程；当前版本值得关注的工程增量是单窗口有限重试：报告未变化时保留重试机会，最多尝试三次。该设计改变失败恢复路径，不证明候选相关性或日报质量提升。[Q01](#research-q01) [Q02](#research-q02)

[Q01](#research-q01) 定位段落范围解决特定覆盖问题。[Q02](#research-q02) 配置退让改变实际权限。[Q03](#research-q03) 分开宿主直接工具、值班 MCP 和监听动作。

<a id="detail-section-5"></a>

### 1.4 主要限制

日窗口判据只观察文件戳或退出码。试用须另行限制实际工具范围，自动评论开关无法约束 force、私信和收藏。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合需要持续整理 B 站主题且能管理账号权限的用户。先用授权测试账号做只读、小范围值班，核对视频来源、字幕与日报并观察失败重试；评论/私信/收藏等写操作应单独确认后再启用。若登录态、开关或远端回执不清，出现误发/重复动作，立即停止并人工核查。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交源码支持接线与关键机制；真实宿主、外部服务、用户效果及实际成本均未在本轮验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/state.mjs、package.json、lib/model-select.mjs、prompts/duty.md、lib/login.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取本轮固定组件源码、既有目录统计及上一版本研究；未安装或运行插件，未执行宿主、浏览器、外部服务或真实用户验证。
- 下一步：在目标宿主隔离环境按 [Q04](#research-q04) 逐项执行小规模任务，记录失败、质量、人工时间与资源成本；任一停止条件触发则回滚。

**分析版本**

- **仓库**：[c1overzz/dsh-bili-scroll](https://github.com/c1overzz/dsh-bili-scroll)
- **版本号**：2.5.2（[固定提交 6f3ab83](https://github.com/c1overzz/dsh-bili-scroll/tree/6f3ab83993ccc51df9331048a8f9a51bef19bc28)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：最多三次、以报告变化为成功条件的窗口重试，可降低单次暂时失败造成的漏报，同时其额外模型/网络成本仍低于漏报损失。用授权测试账号和只读值班任务注入一次暂时失败，对比重试前后的合格日报率、重复请求、资源成本及人工核对；若重复或成本增幅超过漏报改善即推翻。[Q02](#research-q02) [Q04](#research-q04)

在目标宿主隔离环境按 [Q04](#research-q04) 逐项执行小规模任务，记录失败、质量、人工时间与资源成本；任一停止条件触发则回滚。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 1728 | — | — | 32313 |
| .js | source | 2 | 4664 | 3640 | 1014 | — |
| .mjs | source | 15 | 1795 | 1271 | 443 | — |
| .mjs | test | 8 | 788 | 665 | 43 | — |

</details>

**活跃度**

[![Issue 未关闭 101](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=101&color=737b86&logo=github)](https://github.com/c1overzz/dsh-bili-scroll/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 127](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=127&color=737b86&logo=github)](https://github.com/c1overzz/dsh-bili-scroll/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z) [![近30天关闭 32](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=32&color=737b86&logo=github)](https://github.com/c1overzz/dsh-bili-scroll/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)



统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定提交如何改进 B 站值班的失败恢复，真实账号和外发边界下何时值得采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件替用户完成哪些 B 站值班任务，比较基线是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件面向持续关注 B 站主题并需要从候选视频、字幕整理到日报的用户。相较手工搜索复制链接，源码把查询筛选、报告更新和条件式互动接入 DSH；集成不证明推荐质量或节省时间。本次版本改善失败后窗口的重试处理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-35](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/README.md#L1-L35)

作者说明 B 站值班插件定位和任务流程。

<details>
<summary>查看原文（35行）</summary>

```text
# dsh-bili-scroll ｜ 刷B站

> **先看三行**
> - 需要 **dsh ≥ `0.1.7-rc.1`**（本机是 `0.1.7-rc.2`）。⚠️ 版本不满足时，**内核会静默跳过这个插件** —— 装了跟没装一样，不会报错。
> - **空间**：不装「本地转写」约 **84 MB**；装了转写约 **1 GB**（其中 Whisper 模型 538 MB，可在设置里换更小的模型）。
> - 装完**必须重启一次** dsh（插件在 bundle 层组装）。
> - ⚠️ **桌面版 DSH（NEXT / 0.2.x）**：**0.1.3 及以前的版本在桌面版上装不起来** —— 插件整条不激活，
>   DSH 只留一句 `warning: 1 entry did not activate … failed to import`（根因是宿主半 import 的两个包
>   在桌面版 profile 里没被安装，详见下面「装不上」那节的第 5 条）。**0.1.4 起已修** ✓。
>   另有用户反馈桌面版上「自动跑那一轮会卡住」—— 卡住就先只用设置页的「**现在跑一轮**」手动跑（那条稳）。
>
> ⚠️ **装的是旧版吗？** 如果设置页里那个按钮写的是「**重装依赖**」（而不是「**重装主依赖**」），说明你装的是 0.1.0 ——
> 跑一次 `dsh plugin --profile web add dsh-bili-scroll` 升级就好（那一版建 Python 环境时缺一个参数，
> 依赖装不上、二维码也画不出来，重装多少次都一样）。

> 🎬 演示视频：**https://www.bilibili.com/video/BV1d8pU6xEZX/**　·　💬 交流群（QQ）：**1128547307**
>
> DSH 插件：**每天替你刷一轮 B站** —— 它自己搜、**读字幕原文**判断、把值得的写成报告，特别值得的会留一条评论 **@ 你**。
> **你收到的每一条 @，都是它先筛过一遍的。**

## 它做什么

- 按你填的关键词（留空则用内置那几组）搜近几天的视频
- **逐条读字幕原文再判断**（不看摘要）；没字幕的**演示类**视频会先从 B站 自带的故事板**抽几帧看画面**；
  实在读不到内容才跳过 —— 或者你开了「本地转写」
- 写一份 Markdown 报告到 `out/<日期>.md`：每条含「为什么值得」+「它自己的一句话」；每条的段首固定写成 `### BV号` —— 插件数今天挑了几条，数的就是这些标题行
- 开着「自动评论」时，每轮发一条评论、**@ 你**一次（默认每轮 1 条，设置页可调到每轮最多 20 条）
- 可以在**峰谷时段自动跑**（DeepSeek 的优惠时段），省 token

## 装之前（一条前提，30 秒）

机器上要有 **`Python 3.10+` 或 `uv`** —— **有一个就够**：

- **有 `uv` 最好**：单个 ~32 MB 的 exe，**解压就能用、不用管理员、不用进 PATH**，而且它还能自己把 Python 拉下来；
- 只有 Python 也行（装官方安装器时记得勾 **`Add to PATH`**）；
```

</details>

**依据 2 · 源码核查**：[index.js:590-620](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L590-L620)

注册 DSH 工具。

<details>
<summary>查看原文（31行）</summary>

```text
   * `value is not lossless JSON`（2026-10-14 第一次挂上就撞了一次）。
   */
  const safe = (v) => {
    if (v === undefined || v === null || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return v
    try { return JSON.parse(JSON.stringify(v)) } catch { return String(v) }
  }

  const tool = (spec) => ctx.tools.register(defineTool({
    ...spec,
    output: spec.output || textOutput,
    async execute(args, exec) { return safe(await spec.execute(args, exec)) },
  }))

  tool({
    name: 'bili_whoami',
    description: '看 B站 那边登录的是谁（凭证是否有效、昵称、mid）。第一次用要先在「刷B站」设置页里扫码登录。',
    parameters: {},
    async execute() {
      if (!hasCredential()) {
        return { ok: false, loggedIn: false, hint: '还没登录：去 dsh 设置页的「刷B站」里点「扫码登录」（凭证会存在插件自己的家目录里）' }
      }
      const r = await call('bili_check_credential', {})
      return { ok: true, ...(typeof r === 'object' ? r : { raw: r }) }
    },
  })

  tool({
    name: 'bili_search',
    description: '搜 B站 视频（可排序）。返回标题 / BV号 / 播放量 / UP / 时长 等。\n'
      + '⚠️ 刷一轮的用法：搜近 7 天的、按播放或最新都行，然后**读字幕原文**再判断（别看摘要下结论）。',
    parameters: {
```

</details>

**依据 3 · 源码核查**：[index.js:3470-3495](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L3470-L3495)

接入 Web 路由。

<details>
<summary>查看原文（26行）</summary>

```text
    ctx.effect(() => ctx.webServer.register({
      kind: 'prefix',
      path: '/api/bili-duty',
      handler: async (req, res) => {
        // ① 先过 DSH 的信任栅栏（真鉴权）
        if (fenceReject(req, res)) return
        // ② 再过本机同源（栅栏拿不到时的兜底，也挡浏览器里别的网页）
        if (!sameOriginOk(req)) {
          try { sendJson(res, 403, { ok: false, error: '只接受本机同源请求' }) } catch { /* 忽略 */ }
          return
        }
        try { await handle(req, res, new URL(req.url, 'http://127.0.0.1')) } catch (err) {
          sendJson(res, 500, { ok: false, error: err?.message ?? String(err) })
        }
      },
    }), 'bili-duty: /api/bili-duty 路由')
  } catch (e) { log(`HTTP 路由没挂上：${e?.message ?? e}`) }

  ctx.effect(() => () => { try { mcp?.stop() } catch { /* 收摊 */ } }, 'bili-duty: 收 MCP 子进程')
  try { ensureDutyProfile() } catch { /* 上面已记日志 */ }
  if (dutyProfileState === 'ok') log('值班轮用最小权限 profile：bili-duty（无文件系统 / 无命令 / 无联网）')
  else log('⚠️ 最小权限 profile 不可用（' + dutyProfileState + '）⇒ 值班轮仍用 headless（这一轮能力偏大）')
  log(`已挂载（家=${stateDir}，python=${cfg.pythonPath}，峰谷=${cfg.peakValley ? '开' : '关'}）`)
  // ⭐ 2026-10-25：历史清理 —— 以前每轮留下的值班会话也归档掉（只碰 bili-duty 桶）。
  //    延迟几秒：workspaceRegistry 服务未必比这个插件先就绪。
  try {
```

</details>

#### 缺口

- 没有真实用户任务或手工基线，覆盖率、误选和节时未知。
  **影响**：下一步用熟悉主题对照原视频，记录候选遗漏及人工耗时。
  **进一步探讨**：下一步用熟悉主题对照原视频，记录候选遗漏及人工耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 轮次失败如何重试，何时消耗日窗口？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

tick 刷新配置并检查时间档和日预算，以日期及档名组成窗口键。启动前记录日报 mtimeMs:size，再写日次数。runDuty 未启动时清除内存占位，但此分支不回退日次数。进程退出时先于占位日报判断；正常报告模式比较前后日报戳，不检查内容或远端回执。关闭报告时用退出码，且另有无报告每天一轮限制。失败计数达到三次才消费窗口，未达还须下次满足时间和日预算。三次是计数上限。

宿主锁先读 JSON 再写 PID 和时间。释放留下 PID 为 0 的空闲哨兵，其他活跃且新鲜的 PID 使本轮让行，不能把这组读写当成事务互斥。设置写入尝试退出 HMR store，之后还检查有效用户层。实际并发与热安装未验证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1942-1977](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L1942-L1977)

定义三次上限，比较报告变化后记录成功或增加失败计数。

<details>
<summary>查看原文（36行）</summary>

```text
  const MAX_WINDOW_TRIES = 3
  let windowInFlight = null
  let windowReportBefore = null
  const windowReportStamp = () => {
    try {
      const f = join(outDir, `${dayKey()}.md`)
      const s = statSync(f)
      return `${s.mtimeMs}:${s.size}`
    } catch { return null }
  }
  const finishWindowRound = (code) => {
    if (!windowInFlight) return
    const key = windowInFlight
    windowInFlight = null
    // reportLevel=off 时压根没有报告可看 ⇒ 只能信退出码
    const produced = String(cfg.reportLevel || 'full') === 'off'
      ? code === 0
      : windowReportStamp() !== windowReportBefore
    try {
      const s = readJson(dutyStateFile, {})
      const tries = { ...(s.windowTries || {}) }
      const kname = key.split(':')[1] || key
      if (produced) {
        delete tries[key]
        bumpState({ windows: { ...(s.windows || {}), [key]: true }, windowTries: tries })
        log(`这一档（${kname}）跑成了 ⇒ 记为今天用过`)
      } else {
        tries[key] = Number(tries[key] || 0) + 1
        if (tries[key] >= MAX_WINDOW_TRIES) {
          bumpState({ windows: { ...(s.windows || {}), [key]: true }, windowTries: tries })
          log(`这一档（${kname}）试了 ${tries[key]} 次都没产出报告 ⇒ 今天不再重试`)
        } else {
          bumpState({ windowTries: tries })
          log(`这一档（${kname}）这一轮没产出报告（第 ${tries[key]} 次）⇒ 下一跳会再试，最多 ${MAX_WINDOW_TRIES} 次`)
        }
      }
```

</details>

**依据 2 · 源码核查**：[index.js:1988-2000](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L1988-L2000)

已达尝试上限时停止当日继续重试。

<details>
<summary>查看原文（13行）</summary>

```text
      if (autoPickedToday(now) >= Number(cfg.perDay || 0)) return
      // ⭐ 「不写日报」那档没有报告可数 ⇒ 数不出条数就保守一点：一天只跑一轮
      if (String(cfg.reportLevel || 'full') === 'off' && roundsToday(now) >= 1) return
      for (const k of ['noon', 'night']) {
        if (!cfg[k]) continue
        if (!inWindow(now, WINDOWS[k])) continue
        const key = `${today}:${k}`
        if (st.windows?.[key]) continue
        if (windowInFlight === key) continue            // 同一档正在跑，等它的 exit 说话
        if (Number(st.windowTries?.[key] || 0) >= MAX_WINDOW_TRIES) {
          bumpState({ windows: { ...(st.windows || {}), [key]: true } })
          log(`这一档（${k}）已经试了 ${MAX_WINDOW_TRIES} 次都没产出报告 ⇒ 今天不再重试`)
          continue
```

</details>

**依据 3 · 源码核查**：[lib/state.mjs:1-35](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/lib/state.mjs#L1-L35)

调度状态持久化模块。

<details>
<summary>查看原文（35行）</summary>

```text
/**
 * lib/state.mjs —— 插件的"家"与配置
 * ============================================================================
 * 规矩（抄 whale_craft）：**配置、凭证、报告、日志都放插件自己的家** ——
 * `$DSH_HOME/bili-duty/`，**绝不写进插件包目录**（装进 node_modules 后可能只读、升级也会被覆盖）。
 *
 * 还有一件小事但很要紧：vendored 的 `mcp_server.py` 里，凭证路径是
 * `Path(__file__).parent / "bili_credential.json"` —— 所以**运行时要把脚本拷到家目录里再跑**，
 * 这样凭证才会落在家的目录，而不是插件包里。
 * ============================================================================
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import { createHash as nodeCreateHash } from 'node:crypto'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { homedir } from 'node:os'

/**
 * 谷时窗口（北京时间）—— 想改就改这一处。
 * ⭐ 官方口径（2026-09-10 起的新定价）：**高峰 = 工作日 9:00–12:00 与 14:00–18:00，其余全是谷时**
 *    ⇒ 12:00–14:00（夹在两个高峰之间）✓、18:00 之后的一整晚 ✓、以及**整个周末** ✓ 都便宜。
 * ⚠️ 我们原来写的 00:30–08:30 是 DeepSeek **早年**的错峰优惠时段，**已经过时** ✗
 *    —— 2026-10-14 使用者在"陌生人验收"里问「晚上峰谷真的是12点半才开始的吗」才查出来 ✓。
 */
export const WINDOWS = {
  noon: { label: '中午谷时', start: '12:00', end: '14:00' },
  night: { label: '晚上/夜间谷时', start: '18:00', end: '09:00' },
}

/**
 * ⭐ 2026-10-14 真机上踩到的坑（dsh 只留一句 `warning: 1 entry did not activate` + 堆栈）：
 *    `ctx.get('dshHomePath')` 返回的是**函数**，不是字符串！
 *    形状：`dshHomePath(...segments) => join(resolveDshHome(), ...segments)`（whale_craft 就是这么用的）。
 *    我一开始当字符串用（`String(p)`），路径就成了「函数源码 + \bili-duty」⇒ mkdir ENOENT ⇒ apply 抛错 ⇒ 插件不激活。
 */
```

</details>

**依据 4 · 源码核查**：[index.js:433-484](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L433-L484)

宿主设置写入与回读。

<details>
<summary>查看原文（52行）</summary>

```text
    return clampPatch(out)
  }
  /**
   * ⭐ 2.5.2（#198）：插件被「在线安装 / 热重载」激活时，apply() 跑在宿主的
   *    `hmr.executing`（AsyncLocalStorage）上下文里；此时再调 ctx.settings.update()
   *    会二次进入 hmr.runExclusive ⇒ 抛 "HMR transactions cannot be nested"，
   *    同步 DSH 原生设置就静默失败。
   *    ⇒ 调用前先退出这个 store（只在它非空时退）；其它路径行为不变。
   */
  const outsideHmr = (fn) => {
    try {
      const ex = ctx.get('hmr')?.executing
      if (ex && typeof ex.exit === 'function' && ex.getStore()) return ex.exit(fn)
    } catch { /* 拿不到 hmr 服务，或者老版本没有这个字段 ⇒ 照常调 */ }
    return fn()
  }
  const cfg = loadCfg()
  // ⭐ 配置是"随时可能被设置页就地改掉"的东西 ⇒ 每个入口用之前重算一遍（cfg 这个对象要一直指向同一份）
  const refreshCfg = () => { Object.assign(cfg, loadCfg()) }
  const saveCfg = (patch) => {
    Object.assign(cfg, normalize(patch, cfg))
    // ⭐ 记下"这些键由插件面板说了算"（0.1.11：loadCfg 拿它决定谁赢）
    for (const k of Object.keys(patch || {})) if (k in DEFAULTS) touchedKeys.add(k)
    writeJson(cfgFile, { ...cfg, _set: [...touchedKeys] })
  }
  /**
   * ⭐ 同时写一份到宿主：不写的话会出现死结 —— 某个键一旦在原生设置页设过就由宿主说了算，
   *    插件页再改那个键就成了"改了没反应" ✗。写失败不算致命（config.json 那份还在），把话带回给用户。
   */
  const saveCfgHost = async (patch) => {
    const attempt = async (fresh) => {
      const row = settingsDesc(fresh)
      if (!row?.ns || typeof ctx.settings?.update !== 'function') {
        throw Object.assign(new Error('DSH 这边没有可写的设置表单（值只落在插件自己的 config.json 里）'), { noForm: true })
      }
      await outsideHmr(() => ctx.settings.update(row.ns, patch, row.revision))
      // ⭐ READBACK（2026-10-18）：update() 不报错 ≠ 值真的生效 ✗
      //   三四位用户装了 0.1.9 后开关照样弹回，而界面**没有**出现"没同步"提示
      //   ⇒ 说明 host.ok 判成了成功、值却没落进生效层 ⇒ 必须**回读用户层**再确认一遍 ✓
      const after = settingsDesc(true)
      const user = after?.user || {}
      const bad = Object.keys(patch).filter((k) => {
        const want = patch[k]
        const got = user[k]
        if (Array.isArray(want)) return JSON.stringify(want) !== JSON.stringify(got)
        if (want !== null && typeof want === "object") return true   // 配置里没有嵌套对象，出现就按没写进去处理
        return String(got) !== String(want)
      })
      if (bad.length) throw Object.assign(new Error("写入没生效（读回来还是旧值）：" + bad.join(", ")), { stale: true })
      return row.ns
    }
    try { return { ok: true, ns: await attempt(false) } }
```

</details>

**依据 5 · 源码核查**：[index.js:1737-1771](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L1737-L1771)

活跃进程锁与释放哨兵。

<details>
<summary>查看原文（35行）</summary>

```text
  const runLockFile = join(stateDir, 'run-lock.json')
  const RUN_LOCK_TTL = 10 * 60_000
  const pidAlive = (pid) => {
    if (!pid) return false
    try { process.kill(pid, 0); return true } catch { return false }
  }
  /** 试着占锁：拿到 ⇒ true；有人正占着（新鲜的、进程还活着、不是我）⇒ false */
  const acquireRunLock = (why) => {
    try {
      let lock = null
      try { lock = JSON.parse(readFileSync(runLockFile, 'utf8')) } catch { lock = null }
      // releaseRunLock 放锁时留下的是 {"pid":0,"ts":0}：pid 不是正数 ⇒ 没人占着，不算「过期的锁」、不记日志
      if (lock && Number(lock.pid) > 0 && Number(lock.pid) !== process.pid) {
        const fresh = Number(lock.ts) > Date.now() - RUN_LOCK_TTL
        if (fresh && pidAlive(Number(lock.pid))) {
          log(`这一轮没跑（${why}）：另一个宿主正在跑（pid=${lock.pid}）⇒ 让给它`)
          return false
        }
        if (!fresh) log('运行锁已过期（' + Math.round((Date.now() - Number(lock.ts)) / 60000) + ' 分钟前那个），这一轮照跑')
      }
      writeFileSync(runLockFile, JSON.stringify({ pid: process.pid, ts: Date.now(), why }), 'utf8')
      return true
    } catch (e) {
      // 锁文件坏了/写不进去 ⇒ 不拦路（fail-open，但留痕）
      log('运行锁读写失败（这一轮照跑）：' + String(e?.message ?? e))
      return true
    }
  }
  /** 放锁：只放自己的那张（别把别人的删了）；放过的锁是 pid 0，acquireRunLock 当它没有 */
  const releaseRunLock = () => {
    try {
      const lock = JSON.parse(readFileSync(runLockFile, 'utf8'))
      if (Number(lock?.pid) === process.pid) writeFileSync(runLockFile, '{"pid":0,"ts":0}', 'utf8')
    } catch { /* 没有锁 / 读不出来 / 写不进去都无所谓，靠 10 分钟过期兜底 */ }
  }
```

</details>

**依据 6 · 源码核查**：[index.js:1884-1897](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L1884-L1897)

窗口判定先于补占位。

<details>
<summary>查看原文（14行）</summary>

```text
        const t = setTimeout(() => { archiveDutyBucket(startedAt - 5000) }, 1200)
        t.unref?.()
      } catch { /* 忽略 */ }
      finishWindowRound(code)     // ⭐ 2.5.2（#195）：必须在补占位报告之前判断"这一轮到底写没写"
      stubReportIfMissing(code)   // ⭐ 没写报告就补一份占位 —— 别让使用者什么都看不到
      try { writeRoundNotesToReport() } catch { /* 写不进去也不能炸 */ }
    // ⭐ 2026-10-20：这一轮跑成了、并且使用者选了收藏夹 ⇒ 把挑中的存进去（后台做，别拖住收尾）
    if (code === 0 && Number(cfg.favFolderId) > 0) {
      favToday('auto').catch((error) => log('自动收藏出错（已兜住）：' + String(error?.message ?? error)))
    }
      rotateLogIfBig()            // ⭐ 日志别无声地长（三天 797KB ⇒ 一年约 100MB）
      // ⭐ 这一轮挑了几条：从今天的报告里数（上一轮挑的还在同一份文件里 ⇒ 数出来就是全天的账）
      try {
        const st = readJson(dutyStateFile, {})
```

</details>

**依据 7 · 源码核查**：[index.js:1984-2009](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L1984-L2009)

日预算和未启动分支。

<details>
<summary>查看原文（26行）</summary>

```text
      const now = new Date()
      const st = readJson(dutyStateFile, {})
      const today = dayKey(now)
      // ⭐ 闸门看的是「今天已经**挑到几条**」（从今天的报告里数出来），不是「跑了几轮」
      if (autoPickedToday(now) >= Number(cfg.perDay || 0)) return
      // ⭐ 「不写日报」那档没有报告可数 ⇒ 数不出条数就保守一点：一天只跑一轮
      if (String(cfg.reportLevel || 'full') === 'off' && roundsToday(now) >= 1) return
      for (const k of ['noon', 'night']) {
        if (!cfg[k]) continue
        if (!inWindow(now, WINDOWS[k])) continue
        const key = `${today}:${k}`
        if (st.windows?.[key]) continue
        if (windowInFlight === key) continue            // 同一档正在跑，等它的 exit 说话
        if (Number(st.windowTries?.[key] || 0) >= MAX_WINDOW_TRIES) {
          bumpState({ windows: { ...(st.windows || {}), [key]: true } })
          log(`这一档（${k}）已经试了 ${MAX_WINDOW_TRIES} 次都没产出报告 ⇒ 今天不再重试`)
          continue
        }
        windowInFlight = key
        windowReportBefore = windowReportStamp()
        bumpState({ count: roundsToday(now) + 1, lastRunAt: now.toISOString(), lastWhy: k })
        const started = runDuty(`window:${k}`)
        // 没起来（上一轮没完 / 跨宿主锁 / 找不到 dsh）⇒ 别让它卡在"进行中"
        if (!started?.started) windowInFlight = null
        return
      }
```

</details>

#### 缺口

- 没有注入连续失败、重启和并发执行。
  **影响**：影响重复成本与窗口准确性
  **进一步探讨**：在测试 profile 覆盖失败、成功、第三次失败和进程重启。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限、账号、模型与外发边界是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

公开评论工具检查自动评论、昵称及私信模式，但 force 能跳过门控。值班进程的工具名单受模式与监听配置影响，私信另有宿主监听入口。成功退出且 favFolderId 大于 0 时宿主可在模型之外收藏。受控试用应独立限制测试 profile 的远端写能力，关闭自动调度、互动监听、收藏，再回读设置。仅关闭自动评论无法保证只读。无法确认权限时用公开材料手工整理。

出厂 profile 对缺适配器的普通固定路线仍用钉选值，likelyNoAdapter 仅提前告警。专属其他 profile 的 provider 可被忽略，回到会话或兜底。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:41-75](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/package.json#L41-L75)

声明宿主、运行时依赖和 bundle 接线。

<details>
<summary>查看原文（35行）</summary>

```text
    "NOTICE.md",
    "CHANGELOG.md",
    "CONTRIBUTORS.md"
  ],
  "engines": {
    "dsh": ">=0.1.7-rc.1",
    "node": ">=22"
  },
  "scripts": {
    "test": "node --test"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": "*",
    "@deepseek-ai/schemastery": "*"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.1"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-tools": {
      "optional": true
    },
    "@deepseek-ai/schemastery": {
      "optional": true
    }
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-settings",
```

</details>

**依据 2 · 源码核查**：[index.js:590-620](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L590-L620)

工具注册路径。

<details>
<summary>查看原文（31行）</summary>

```text
   * `value is not lossless JSON`（2026-10-14 第一次挂上就撞了一次）。
   */
  const safe = (v) => {
    if (v === undefined || v === null || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return v
    try { return JSON.parse(JSON.stringify(v)) } catch { return String(v) }
  }

  const tool = (spec) => ctx.tools.register(defineTool({
    ...spec,
    output: spec.output || textOutput,
    async execute(args, exec) { return safe(await spec.execute(args, exec)) },
  }))

  tool({
    name: 'bili_whoami',
    description: '看 B站 那边登录的是谁（凭证是否有效、昵称、mid）。第一次用要先在「刷B站」设置页里扫码登录。',
    parameters: {},
    async execute() {
      if (!hasCredential()) {
        return { ok: false, loggedIn: false, hint: '还没登录：去 dsh 设置页的「刷B站」里点「扫码登录」（凭证会存在插件自己的家目录里）' }
      }
      const r = await call('bili_check_credential', {})
      return { ok: true, ...(typeof r === 'object' ? r : { raw: r }) }
    },
  })

  tool({
    name: 'bili_search',
    description: '搜 B站 视频（可排序）。返回标题 / BV号 / 播放量 / UP / 时长 等。\n'
      + '⚠️ 刷一轮的用法：搜近 7 天的、按播放或最新都行，然后**读字幕原文**再判断（别看摘要下结论）。',
    parameters: {
```

</details>

**依据 3 · 源码核查**：[index.js:1942-1977](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L1942-L1977)

调度重试受配置和报告产出影响。

<details>
<summary>查看原文（36行）</summary>

```text
  const MAX_WINDOW_TRIES = 3
  let windowInFlight = null
  let windowReportBefore = null
  const windowReportStamp = () => {
    try {
      const f = join(outDir, `${dayKey()}.md`)
      const s = statSync(f)
      return `${s.mtimeMs}:${s.size}`
    } catch { return null }
  }
  const finishWindowRound = (code) => {
    if (!windowInFlight) return
    const key = windowInFlight
    windowInFlight = null
    // reportLevel=off 时压根没有报告可看 ⇒ 只能信退出码
    const produced = String(cfg.reportLevel || 'full') === 'off'
      ? code === 0
      : windowReportStamp() !== windowReportBefore
    try {
      const s = readJson(dutyStateFile, {})
      const tries = { ...(s.windowTries || {}) }
      const kname = key.split(':')[1] || key
      if (produced) {
        delete tries[key]
        bumpState({ windows: { ...(s.windows || {}), [key]: true }, windowTries: tries })
        log(`这一档（${kname}）跑成了 ⇒ 记为今天用过`)
      } else {
        tries[key] = Number(tries[key] || 0) + 1
        if (tries[key] >= MAX_WINDOW_TRIES) {
          bumpState({ windows: { ...(s.windows || {}), [key]: true }, windowTries: tries })
          log(`这一档（${kname}）试了 ${tries[key]} 次都没产出报告 ⇒ 今天不再重试`)
        } else {
          bumpState({ windowTries: tries })
          log(`这一档（${kname}）这一轮没产出报告（第 ${tries[key]} 次）⇒ 下一跳会再试，最多 ${MAX_WINDOW_TRIES} 次`)
        }
      }
```

</details>

**依据 4 · 源码核查**：[lib/model-select.mjs:1-75](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/lib/model-select.mjs#L1-L75)

模型选择和不可用固定模型处理。

<details>
<summary>查看原文（75行）</summary>

```text
/**
 * 这一轮到底用哪个模型 —— 从 index.js 抽出来的纯逻辑，不读配置、不碰宿主，方便直接测选择表。
 *
 * 文件和宿主那两半（当前 profile、铺好的 package.json）由调用方用 `env` 传进来：
 *   env.profile()         这一轮实际跑的 profile 名
 *   env.templateIsStock() 插件铺的 bili-duty 是不是还是出厂的 bundles
 */

export const BASE_PROVIDERS = ['deepseek-account', 'deepseek-official']
/** 这些 provider 只装在某个特定 profile 里：{ provider: profile 名 } */
export const PROFILE_ONLY_PROVIDERS = { 'google-antigravity': 'headless' }
/** ⭐ 连「当前会话的模型」都用不了时兜底的那一对（账号登录的机器上一定能跑） */
export const FALLBACK_MODEL = { provider: 'deepseek-account', model: 'deepseek-flash' }

/** 插件自己铺的模板 profile，和它出厂的 bundles（要和 profile-template/bili-duty/package.json 一致，测试钉着） */
export const TEMPLATE_PROFILE = 'bili-duty'
export const STOCK_BUNDLES = ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-headless']

/** 这份 package.json 的 bundles 还是不是出厂那两项（读不到、格式不对都算「不是」） */
export function isStockTemplate(pkg) {
  const bundles = pkg?.dsh?.profile?.bundles
  if (!Array.isArray(bundles) || bundles.length !== STOCK_BUNDLES.length) return false
  return STOCK_BUNDLES.every((b) => bundles.includes(b))
}

/**
 * ⭐ 2026-11-04（#175 / #130 / #163）：三态判断 —— 设置页的模型下拉需要"能选"和"确定能用"分开。
 *   'yes'   = 白名单里的（值班轮那个 profile 一定有适配器）
 *   'no'    = 绑定了别的 profile，或者这一轮跑的是出厂的 bili-duty（内容已知，只有 DeepSeek 两条路由）
 *   'maybe' = 这一轮 profile 装没装我们看不到（插件跑在 web 进程，值班轮是另一个进程）：
 *             自建 profile，或者 bundles 被改过的模板（#175、#144）
 */
export function providerState(p, env) {
  const id = String(p || '')
  if (!id) return 'no'
  if (BASE_PROVIDERS.includes(id)) return 'yes'
  const needProfile = PROFILE_ONLY_PROVIDERS[id]
  if (needProfile) {
    try { return env.profile() === needProfile ? 'yes' : 'no' } catch { return 'no' }
  }
  try {
    if (env.profile() === TEMPLATE_PROFILE && env.templateIsStock()) return 'no'
  } catch { /* 判断不了 ⇒ 就是看不到 */ }
  return 'maybe'
}

/**
 * 钉的和跟随的走两条路：
 *   · 钉了 = 用户明说要它 ⇒ 照用，不悄悄换（#130 / #163）；真没有驱动时那一轮会失败，由 lib/diagnose.mjs 说清楚。
 *     出厂 bili-duty 上是 'no' 也照用：这是 b8f0b5a 定的（选了不悄悄换）。
 *     只有绑定了别的 profile 的（比如 bili-duty 上的 Antigravity）才不带，并在 `ignored` 里标出来。
 *     出厂 bili-duty 上照用 'no' 的那种，结果里带 `likelyNoAdapter: true`，让设置页和 duty.log 在跑之前就说出来 ——
 *     不然每一轮都是一启动就 code=1，只有 duty.log 和当天的占位报告里看得到。
 *   · 跟随当前会话 = 用户没为这一轮选过 ⇒ 只有 'no' 以外才跟；否则兜底，宁可换模型，也别让这一轮在第一个请求前就死掉。
 *
 * @param {{ pin: {provider: string, model: string}|null, session: {provider: string, model: string}|null }} picks
 */
export function chooseModel({ pin, session }, env) {
  const boundElsewhere = pin && PROFILE_ONLY_PROVIDERS[pin.provider] && providerState(pin.provider, env) === 'no'
  if (pin && !boundElsewhere) {
    // 走到这里还是 'no' 的只有一种：出厂 bili-duty 上钉了白名单以外的（绑定别的 profile 的上面已经排除）
    return providerState(pin.provider, env) === 'no'
      ? { ...pin, source: 'plugin', likelyNoAdapter: true }
      : { ...pin, source: 'plugin' }
  }
  if (session && providerState(session.provider, env) !== 'no') {
    return pin ? { ...session, source: 'session', ignored: pin } : session
  }
  return {
    ...FALLBACK_MODEL,
    source: 'fallback',
    ...(pin ? { ignored: pin } : {}),
    ...(session ? { sessionIgnored: { provider: session.provider, model: session.model } } : {}),
  }
}
```

</details>

**依据 5 · 源码核查**：[index.js:755-786](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L755-L786)

force 分支。

<details>
<summary>查看原文（32行）</summary>

```text
  })

  tool({
    name: 'bili_reply',
    description: '在视频下发评论（或回复某条评论）。这就是"@ 本人"那一下：短、干净、纯文本 @ 写在正文里。\n'
      + '🔴 安全闸：设置页的「自动评论并 @ 你」**默认是关的**；关着的时候这个工具会拒绝 —— '
      + '除非本人当场让你发（那时传 force: true）。',
    parameters: {
      bvid: { type: 'string', description: 'BV号' },
      text: { type: 'string', description: '评论正文（短、干净、纯文本 @；别写敏感词）' },
      rpid: { type: 'number', description: '要回复的评论 id（0/不填 = 发新评论）' },
      force: { type: 'boolean', description: '本人当场让你发的，传 true 越过"自动评论关着"的闸' },
    },
    async execute(args) {
      // dmMode==='only' 时本轮根本不该发公开评论 —— 在工具层也一并挡掉（除非当场 force）
      const commentOn = Boolean(cfg.autoComment && cfg.mentionName && cfg.dmMode !== 'only')
      if (!commentOn && !args.force) {
        return {
          ok: false,
          blocked: true,
          hint: cfg.dmMode === 'only'
            ? '现在是「只私信」模式（dmMode=only）—— 规定不发公开评论，改成用 bili_send_message 私信。确实要发时传 force: true。'
            : '要发评论得同时满足两条：设置里开着「自动评论并 @ 你」、并且填了「要 @ 谁」。或者本人当场让你发时传 force: true。',
        }
      }
      return call('bili_reply', {
        bvid: String(args.bvid ?? ''),
        text: String(args.text ?? ''),
        rpid: Number(args.rpid) || 0,
      })
    },
  })
```

</details>

**依据 6 · 源码核查**：[index.js:1370-1386](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L1370-L1386)

值班工具名单。

<details>
<summary>查看原文（17行）</summary>

```text
    //    写日报 / 判重表 / 归档、以及无字幕转写，全走这几只**固定路径的窄口工具** ✓
    list.push('duty_paths', 'duty_report_append', 'duty_seen_append', 'duty_digest_append', 'duty_seen_recent')
    // ⭐ 2026-10-25：转写改成 job 模型（start / result）—— 慢活不该占住一次工具调用；
    //    老的 bili_transcribe 还留着（仍能用，但它会等到跑完，别在一轮里连用两条）
    if (cfg.asrInstalled !== false) list.push('bili_transcribe', 'bili_transcribe_start', 'bili_transcribe_result')
    // ⭐⭐ 2.0.4（第三方体检第 3 条）：**"只发私信"时评论通道必须硬关** —— 以前只看 autoComment，
    //    用户以前开过自动评论、后来切到"只私信"，那个 true 还在 config 里 ⇒ 评论工具照样下发 ✗
    const dmOnly = String(cfg.dmMode || '').trim() === 'only'
    if (!dmOnly && (cfg.autoComment || cfg.replyToComments)) list.push('bili_reply')
    // ⭐ 2026-10-19（issue #25 / #16 的实证，做法参考社区 PR #37）：私信开着却忘了给 bili_send_message ⇒
    //   模型手里压根没有这只工具 ⇒ 表现成"开关也开了、这一轮也跑了，但从来没发出去过" ✗
    //   ⇒ dmMode 不是 off、且填了收件人 UID 才放进去（关着就不给，白名单别松）
  if (String(cfg.dmMode || 'off') !== 'off' || cfg.dmWatch) list.push('bili_send_message')   // 2026-10-21：UID 可能靠昵称查，别再拿 dmUid>0 当条件
    return list
  }


```

</details>

**依据 7 · 源码核查**：[index.js:2251-2265](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L2251-L2265)

私信监听。

<details>
<summary>查看原文（15行）</summary>

```text
  function startDmWatch() {
    try {
      if (dmTimer) { clearInterval(dmTimer); dmTimer = null }
      const mins = Math.max(1, Number(cfg.dmWatchMinutes) || 1)
      dmTimer = setInterval(() => { dmTick().catch((e) => log('私信定时器异常：' + String(e?.message ?? e))) }, mins * 60_000)
      if (dmTimer.unref) dmTimer.unref()
      log(`私信监听：${cfg.dmWatch ? '已开' : '关着'}（每 ${mins} 分钟查一次）`)
    } catch (e) { log('启私信监听失败：' + String(e?.message ?? e)) }
  }



  try { MIG_200() } catch (e) { log('迁移没跑：' + String(e?.message ?? e)) }

  try { startDmWatch() } catch (e) { log('私信监听没起来：' + String(e?.message ?? e)) }
```

</details>

**依据 8 · 源码核查**：[index.js:1889-1896](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L1889-L1896)

后台收藏。

```text
      try { writeRoundNotesToReport() } catch { /* 写不进去也不能炸 */ }
    // ⭐ 2026-10-20：这一轮跑成了、并且使用者选了收藏夹 ⇒ 把挑中的存进去（后台做，别拖住收尾）
    if (code === 0 && Number(cfg.favFolderId) > 0) {
      favToday('auto').catch((error) => log('自动收藏出错（已兜住）：' + String(error?.message ?? error)))
    }
      rotateLogIfBig()            // ⭐ 日志别无声地长（三天 797KB ⇒ 一年约 100MB）
      // ⭐ 这一轮挑了几条：从今天的报告里数（上一轮挑的还在同一份文件里 ⇒ 数出来就是全天的账）
      try {
```

**依据 9 · 源码核查**：[index.js:870-889](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L870-L889)

设置返回模型预警。

<details>
<summary>查看原文（20行）</summary>

```text
    name: 'bili_config',
    description: '读 / 改「刷B站」的设置。不给 `patch` 就是读；给了就改（只认 schema 里的字段）。\n'
      + '例：`{"perDay":5,"peakValley":true,"noon":true,"night":true,"autoComment":false,"transcribe":false,"keywords":["DeepSeek Harness"]}`；'
      + '私信投递：`{"dmMode":"only","dmUid":12345678}`（dmMode = off / only / both）；'
      + '⭐ 指定这一轮用哪个模型：`{"modelProvider":"deepseek-account","modelName":"deepseek-flash"}`'
      + '（两个都留空 = 跟随你当前会话选的模型；会话的 provider 在自带的 `bili-duty` profile 里没有时，那一轮改用 DeepSeek 兜底，并在 `status.model.sessionIgnored` 里标出来。'
      + '⚠️ `bili-duty` 里确定有的只有 `deepseek-account` / `deepseek-official`。`google-antigravity` 只在 `headless` profile 里有，跑别的 profile 时填它会被忽略，并在 `status.model.ignored` 里标出来；'
      + '填别的就照用、不换模型，那个 profile 里真没有驱动的话那一轮会直接失败（`NO_ADAPTER`），原因写进 `duty.log`；'
      + '出厂 `bili-duty` 上能看出没有的，返回的 `model.likelyNoAdapter` 是 true）。',
    parameters: { patch: { type: 'object', additionalProperties: true, description: '要改的字段（可省）' } },
    async execute(args) {
      let host = null
      if (args?.patch && typeof args.patch === 'object' && !Array.isArray(args.patch)) {
        // ⭐ 设置页显式设过的键以宿主为准 ⇒ 必须跟着写一份，否则"改了没反应"（钳范围也在这里）
        host = (await persistCfg(args.patch)).host
      }
      // 这一轮会用哪个模型：刚钉的那个要是值班 profile 里多半没有，调用方马上能看到 likelyNoAdapter
      return { ok: true, config: cfg, windows: WINDOWS, home: stateDir, venvReady: venvReadyNow(), host, model: chosenModel() }
    },
  })
```

</details>

#### 缺口

- 本轮没有检查目标 profile 的真实工具清单、开关或账号授权。
  **影响**：可能造成非预期外发
  **进一步探讨**：试用前确认只读白名单、关闭互动和自动轮次，并验证登录失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本、效果与安全的采用条件如何验证？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议在授权测试账号上先跑只读小轮，逐条比对候选、字幕与原片，再决定是否启用日报写入。首次成本包括环境和登录，持续成本包括模型与可选转写及人工核对；金额和节时没有本轮实测。若开关、外发状态或远端结果无法确认，停止运行。

#### 证据与依据

**依据 1 · 源码核查**：[prompts/duty.md:1-40](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/prompts/duty.md#L1-L40)

说明值班任务提示和处理流程。

<details>
<summary>查看原文（40行）</summary>

```text
# 刷B站 —— 每天一轮
<!-- duty-charter v3 · 2026-10-17 -->

你是这个账号的助手。使用者不在电脑前的时候，你替他把 B站 上值得的东西挑出来。

## 开场先认识"使用它的人"（2026-10-14 加）

**在动手之前，先看一眼当前工作目录里的 `AGENTS.md`** —— 那是使用者写给他自己的 AI 的**人设与准则**
（叫他什么、什么话不能说、哪些是他的红线）。**按他写的来**，别用你默认那套。

- 别人的 `AGENTS.md` 就是别人的设定 ⇒ **你只是替他看一眼，不是替他做决定**。
- 工作目录里**如果有 `memories.md`**（有些人用文件记日记），可以扫一眼，**只为判断"什么跟他有关"**；
  ⚠️ **不要把日记内容抄进报告或评论** —— 那是他的私事。
- 两份都没有？那就中性一点，别擅自扮演任何人格。

## 你这一轮没有"文件系统"（2026-10-24 起）

为了不让你（在无人看着的时候）读到这台电脑上的别的东西，这一轮跑在**最小权限 profile** 上：
**没有读写文件的工具、没有命令行、不能自己上网抓页面**。
要记东西，用这几只**固定路径**的工具（它们只会写进插件自己的目录）：

| 想干什么 | 用哪个 |
|---|---|
| 写今天的日报 | `duty_report_append(text)` |
| 往判重表记一行 | `duty_seen_append(bvid, title, up, status)`（status = 挑了 / 跳过 / 评论） |
| **先看**判重表最近记了什么 | `duty_seen_recent(limit=40)`（只读；给 `bvid=` 可只查某条） |
| 往本月归档记一段 | `duty_digest_append(text)` |
| 看这三个文件在哪 | `duty_paths()` |
| 没字幕的视频要转写 | `bili_transcribe_start(bvid)` → 拿 job_id；之后 `bili_transcribe_result(job_id)` 取 |

⚠️ **别去找 read / write / bash 那类工具** —— 这一轮根本没有；找不到不是你坏了，是设计如此。

## 先记住三条（省钱，也是纪律）

- ⚠️ **看够了就下结论**：不要反复权衡同一条该不该收 —— 拿不准就按"跳过"处理，别来回改主意。
- ⚠️ **工具失败两次就记为"跳过"**：不要反复重试同一个命令、也不要为了绕过它写一堆临时脚本。
  （这两条省的是使用者的钱：实测里"纠结"那一轮比干净的一轮多花了**近一倍** token。）
- ⭐⭐ **"空"是一种结果，不是坏了** ✓：字幕 / 转写拿回来是**空的、0 字节的、或者只有一行「字幕byXX」这类署名** ⇒
  那是**这条视频没有语音**（纯音乐 / 纯录屏 / 无声演示），**按"跳过（无语音）"记一笔、继续下一条** ✓。
  ⚠️ **不许**因此去写 `debug.py` / 临时脚本、也不许反复重跑 —— 那是"工具坏了"的思路，会把整轮预算烧光 ✗
```

</details>

**依据 2 · 源码核查**：[lib/model-select.mjs:1-75](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/lib/model-select.mjs#L1-L75)

模型固定选择和失配处理逻辑。

<details>
<summary>查看原文（75行）</summary>

```text
/**
 * 这一轮到底用哪个模型 —— 从 index.js 抽出来的纯逻辑，不读配置、不碰宿主，方便直接测选择表。
 *
 * 文件和宿主那两半（当前 profile、铺好的 package.json）由调用方用 `env` 传进来：
 *   env.profile()         这一轮实际跑的 profile 名
 *   env.templateIsStock() 插件铺的 bili-duty 是不是还是出厂的 bundles
 */

export const BASE_PROVIDERS = ['deepseek-account', 'deepseek-official']
/** 这些 provider 只装在某个特定 profile 里：{ provider: profile 名 } */
export const PROFILE_ONLY_PROVIDERS = { 'google-antigravity': 'headless' }
/** ⭐ 连「当前会话的模型」都用不了时兜底的那一对（账号登录的机器上一定能跑） */
export const FALLBACK_MODEL = { provider: 'deepseek-account', model: 'deepseek-flash' }

/** 插件自己铺的模板 profile，和它出厂的 bundles（要和 profile-template/bili-duty/package.json 一致，测试钉着） */
export const TEMPLATE_PROFILE = 'bili-duty'
export const STOCK_BUNDLES = ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-headless']

/** 这份 package.json 的 bundles 还是不是出厂那两项（读不到、格式不对都算「不是」） */
export function isStockTemplate(pkg) {
  const bundles = pkg?.dsh?.profile?.bundles
  if (!Array.isArray(bundles) || bundles.length !== STOCK_BUNDLES.length) return false
  return STOCK_BUNDLES.every((b) => bundles.includes(b))
}

/**
 * ⭐ 2026-11-04（#175 / #130 / #163）：三态判断 —— 设置页的模型下拉需要"能选"和"确定能用"分开。
 *   'yes'   = 白名单里的（值班轮那个 profile 一定有适配器）
 *   'no'    = 绑定了别的 profile，或者这一轮跑的是出厂的 bili-duty（内容已知，只有 DeepSeek 两条路由）
 *   'maybe' = 这一轮 profile 装没装我们看不到（插件跑在 web 进程，值班轮是另一个进程）：
 *             自建 profile，或者 bundles 被改过的模板（#175、#144）
 */
export function providerState(p, env) {
  const id = String(p || '')
  if (!id) return 'no'
  if (BASE_PROVIDERS.includes(id)) return 'yes'
  const needProfile = PROFILE_ONLY_PROVIDERS[id]
  if (needProfile) {
    try { return env.profile() === needProfile ? 'yes' : 'no' } catch { return 'no' }
  }
  try {
    if (env.profile() === TEMPLATE_PROFILE && env.templateIsStock()) return 'no'
  } catch { /* 判断不了 ⇒ 就是看不到 */ }
  return 'maybe'
}

/**
 * 钉的和跟随的走两条路：
 *   · 钉了 = 用户明说要它 ⇒ 照用，不悄悄换（#130 / #163）；真没有驱动时那一轮会失败，由 lib/diagnose.mjs 说清楚。
 *     出厂 bili-duty 上是 'no' 也照用：这是 b8f0b5a 定的（选了不悄悄换）。
 *     只有绑定了别的 profile 的（比如 bili-duty 上的 Antigravity）才不带，并在 `ignored` 里标出来。
 *     出厂 bili-duty 上照用 'no' 的那种，结果里带 `likelyNoAdapter: true`，让设置页和 duty.log 在跑之前就说出来 ——
 *     不然每一轮都是一启动就 code=1，只有 duty.log 和当天的占位报告里看得到。
 *   · 跟随当前会话 = 用户没为这一轮选过 ⇒ 只有 'no' 以外才跟；否则兜底，宁可换模型，也别让这一轮在第一个请求前就死掉。
 *
 * @param {{ pin: {provider: string, model: string}|null, session: {provider: string, model: string}|null }} picks
 */
export function chooseModel({ pin, session }, env) {
  const boundElsewhere = pin && PROFILE_ONLY_PROVIDERS[pin.provider] && providerState(pin.provider, env) === 'no'
  if (pin && !boundElsewhere) {
    // 走到这里还是 'no' 的只有一种：出厂 bili-duty 上钉了白名单以外的（绑定别的 profile 的上面已经排除）
    return providerState(pin.provider, env) === 'no'
      ? { ...pin, source: 'plugin', likelyNoAdapter: true }
      : { ...pin, source: 'plugin' }
  }
  if (session && providerState(session.provider, env) !== 'no') {
    return pin ? { ...session, source: 'session', ignored: pin } : session
  }
  return {
    ...FALLBACK_MODEL,
    source: 'fallback',
    ...(pin ? { ignored: pin } : {}),
    ...(session ? { sessionIgnored: { provider: session.provider, model: session.model } } : {}),
  }
}
```

</details>

**依据 3 · 源码核查**：[index.js:1942-1977](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/index.js#L1942-L1977)

重试次数上限直接限定失败成本。

<details>
<summary>查看原文（36行）</summary>

```text
  const MAX_WINDOW_TRIES = 3
  let windowInFlight = null
  let windowReportBefore = null
  const windowReportStamp = () => {
    try {
      const f = join(outDir, `${dayKey()}.md`)
      const s = statSync(f)
      return `${s.mtimeMs}:${s.size}`
    } catch { return null }
  }
  const finishWindowRound = (code) => {
    if (!windowInFlight) return
    const key = windowInFlight
    windowInFlight = null
    // reportLevel=off 时压根没有报告可看 ⇒ 只能信退出码
    const produced = String(cfg.reportLevel || 'full') === 'off'
      ? code === 0
      : windowReportStamp() !== windowReportBefore
    try {
      const s = readJson(dutyStateFile, {})
      const tries = { ...(s.windowTries || {}) }
      const kname = key.split(':')[1] || key
      if (produced) {
        delete tries[key]
        bumpState({ windows: { ...(s.windows || {}), [key]: true }, windowTries: tries })
        log(`这一档（${kname}）跑成了 ⇒ 记为今天用过`)
      } else {
        tries[key] = Number(tries[key] || 0) + 1
        if (tries[key] >= MAX_WINDOW_TRIES) {
          bumpState({ windows: { ...(s.windows || {}), [key]: true }, windowTries: tries })
          log(`这一档（${kname}）试了 ${tries[key]} 次都没产出报告 ⇒ 今天不再重试`)
        } else {
          bumpState({ windowTries: tries })
          log(`这一档（${kname}）这一轮没产出报告（第 ${tries[key]} 次）⇒ 下一跳会再试，最多 ${MAX_WINDOW_TRIES} 次`)
        }
      }
```

</details>

**依据 4 · 源码核查**：[lib/login.mjs:1-80](https://github.com/c1overzz/dsh-bili-scroll/blob/6f3ab83993ccc51df9331048a8f9a51bef19bc28/lib/login.mjs#L1-L80)

登录与账号授权路径。

<details>
<summary>查看原文（80行）</summary>

```text
/**
 * lib/login.mjs —— 扫码登录（直接在 JS 里走 B站 passport 接口）
 * ============================================================================
 * 为什么不用它自带的 `bili_login`：那个把码存成 PNG 就返回，**字段全是空**（踩过一次，见 lesson）。
 * 我们按实测跑通的那条来：
 *   ① GET  /x/passport-login/web/qrcode/generate?source=main-fe-header  → data.url + data.qrcode_key
 *   ② 手机扫 → 轮询 /x/passport-login/web/qrcode/poll?qrcode_key=…
 *      data.code：86101 未扫 / 86090 已扫待确认 / 0 成功 / 86038 过期
 *   ③ ⭐ **凭证在轮询响应的 `Set-Cookie` 头里**（成功时那条 `data.url` 里没有 SESSDATA，
 *      那是别的域的游戏票 —— 别在 url 里找）
 *   ④ 写成 MCP 认识的四个字段：sessdata / bili_jct / buvid3 / dedeuserid
 *
 * 二维码图片：交给 venv 里的 Python `qrcode` 画（ASCII 的 URL，走 `-c` 安全；
 * 没装就退回"只给 URL"，前端会提示先跑「建 venv 装依赖」）。
 * ============================================================================
 */
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
const GEN = 'https://passport.bilibili.com/x/passport-login/web/qrcode/generate?source=main-fe-header'
const pollUrl = (key) => 'https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key=' + encodeURIComponent(key) + '&source=main-fe-header'
const SPI = 'https://api.bilibili.com/x/frontend/finger/spi'

/** 从 Set-Cookie 数组里抠出我们要的几个 */
function pickCookies(list) {
  const jar = {}
  const want = { SESSDATA: 'sessdata', bili_jct: 'bili_jct', DedeUserID: 'dedeuserid', buvid3: 'buvid3' }
  for (const raw of list ?? []) {
    const first = String(raw).split(';')[0] || ''
    const i = first.indexOf('=')
    if (i <= 0) continue
    const name = first.slice(0, i).trim()
    const value = first.slice(i + 1).trim()
    if (want[name]) jar[want[name]] = value
  }
  return jar
}

/** 拿不到 buvid3 时补一张"指纹"（非致命，失败就当空） */
async function ensureBuvid3(jar) {
  if (jar.buvid3) return jar
  try {
    const r = await fetch(SPI, { headers: { 'User-Agent': UA } })
    const j = await r.json()
    const v = j?.data?.b_3
    if (v) jar.buvid3 = v
  } catch { /* 拿不到就算了 */ }
  return jar
}

export async function loginStart() {
  const r = await fetch(GEN, { headers: { 'User-Agent': UA } })
  const j = await r.json()
  const data = j?.data
  if (!data?.qrcode_key || !data?.url) throw new Error(`生成二维码失败：${j?.message || '返回里没有 qrcode_key'}`)
  return { key: data.qrcode_key, url: data.url }
}

/** 轮询一次。state: waiting / scanned / ok / expired / unknown */
export async function loginPoll(key) {
  const res = await fetch(pollUrl(key), { headers: { 'User-Agent': UA }, redirect: 'manual' })
  const setCookies = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : []
  let body = {}
  try { body = await res.json() } catch { /* poll 有时返回空体 */ }
  const code = body?.data?.code
  if (code === 0) {
    const jar = await ensureBuvid3(pickCookies(setCookies))
    if (!jar.sessdata) return { state: 'unknown', code, message: '登录成功了，但响应里没有 SESSDATA —— 把这次的结果记下来再排查' }
    return { state: 'ok', code, credential: jar }
  }
  const map = { 86101: 'waiting', 86090: 'scanned', 86038: 'expired' }
  return { state: map[code] ?? 'unknown', code, message: body?.message || '' }
}

/** 把凭证写进 MCP 读的那个文件（家目录里的 bili_credential.json） */
/**
 * ⭐ 2026-10-23 安全加固（审计 + issue #67）：凭证文件权限收紧到"只有自己能读" ——
```

</details>

#### 缺口

- API 限额、账号风险、筛选质量及远端动作核账未知。
  **影响**：在测试账号记录请求、回执、重复调用、误选和人工时间
  **进一步探讨**：任何未知外发均停止。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
