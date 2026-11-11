# 刷 B 站（子代理版）

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[1297336](https://github.com/Yuuyuko-uu/dsh-bili-subagent/tree/129733635f1cc04da27c6e0700c853c81637afd5)

<!-- BEGIN META -->
[![GitHub ★ 108](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=108&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yuuyuko-uu/dsh-bili-subagent) [![npm 30d 9,155](https://img.shields.io/static/v1?label=npm+30d&message=9%2C155&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bili-subagent) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bili-subagent)
<!-- END META -->

> **功能**：让 DSH 伙伴派子代理搜索 B 站、阅读字幕与评论，形成内部报告并按配置传递给用户。

> **亮点**：把内容阅读和伙伴表达分开，并把自动触发与通知接进已有会话。合格报告仍要人工抽核字幕与出处。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：force 和 rpid 可绕过部分发布开关，手动扫描也不关闭独立动态调度。评论业务失败仍可清除私信挂账，开关、授权和送达必须分别核对。[Q03](#research-q03)

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
  - [Q01 · 子代理看、伙伴说，比手工收藏和转述多什么？](#detail-section-11)
  - [Q02 · 触发、子任务和通知如何记账？](#detail-section-12)
  - [Q03 · 对外写操作开关是否等同授权和成功？](#detail-section-13)
  - [Q04 · 怎样采用和验证逐次确认？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长期与 DSH 伙伴聊天、希望定期获得有来源的视频线索的人，可把内容筛选接入同一会话。

手工收藏和转述能逐条确认，日报聚合也能筛选信息。本组件沿用上游 fork，组合差异是伙伴派活和会话内报告，原创范围未知。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 子代理阅读 | 搜索字幕并返回报告 | 需模型和平台读取成功 |
| 提醒与调度 | 把任务和通知递给伙伴 | 成功投递不等于报告完成 |
| 对外发送 | 评论与私信 | 开关例外和未知结果需核实 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH 及 subagents | 派活与伙伴会话 | Node ≥ 22、DSH ≥ 0.2.1-rc.2 是包声明 |
| Python／uv 与 MCP | B 站读取和写操作 | 环境、登录和接口需另测 |
| 模型提供商 | 伙伴及子代理调用 | 可单独配置，价格和可用性未知 |

| 阶段 | 操作 | 异常处理 |
| --- | --- | --- |
| 首次 | 假 MCP 核对目标会话和报告；真实账号须先验证独立拒绝全部外部写入 | 无结果则分开查触发、派活和材料 |
| 持续 | 抽查报告原文和通知 checkpoint | 不要把投递提示当成功报告 |
| 退出 | 停调度与提醒，禁用写操作并备份必要状态 | 核对外部登录撤销、在飞任务及报告文件 |

**效果与成本**

| 成本 | 单位 | 边界 |
| --- | --- | --- |
| 模型 | 每个合格报告的伙伴轮次与子代理 token | 未实测，路由更便宜不等于免费 |
| 人工 | 登录维护、字幕抽查、错误恢复 | 未知结果需平台核查 |
| 退出 | 停提醒、收敛账户与备份状态 | 耗时未测 |

| 效果 | 口径 | 边界 |
| --- | --- | --- |
| 获得线索 | 可回查字幕的有效报告数 | 搜索派活成功不等于材料真实 |
| 少搬运 | 每份报告人工往返次数 | 未对照测量 |

> **思考**：force 和 rpid 可绕过部分发布开关，手动扫描也不关闭独立动态调度。评论业务失败仍可清除私信挂账，开关、授权和送达必须分别核对。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把内容阅读和伙伴表达分开，并把自动触发与通知接进已有会话。合格报告仍要人工抽核字幕与出处。[Q01](#research-q01) [Q02](#research-q02)

提醒批次交付后才确认，busy 和失败退避减少读提醒重叠。自动配额、子代理完成和对外送达仍是不同状态，应分别观察。

<a id="detail-section-5"></a>

### 1.4 主要限制

force 和 rpid 可绕过部分发布开关，手动扫描也不关闭独立动态调度。评论业务失败仍可清除私信挂账，开关、授权和送达必须分别核对。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

保留观察。用假 MCP 核查一次报告和原材料；若连接真实账号，先验证工具层或独立代理拒绝全部外部写入，再做读取实验。扫描手动模式不能代替这层拒绝。报告失真或权限不可解释时停用。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持派子代理、回传报告和提醒去重。写入权限、业务回执、真实宿主及平台可用性未验，逐次确认是假设。

- 已检查：作者 README、包清单、源码路径 index.js、lib/watch.mjs、lib/mcp.mjs、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查固定宿主、派活、MCP、调度和提醒实现；未运行目标、登录 B 站或调用模型。
- 下一步：用假 MCP 和宿主重放发布业务失败、已受理超时、独立动态调度、通知中断与子代理缺服务。只有独立拒绝全部对外写入已经验证时，才接真实账号核查读取。

**分析版本**

- **仓库**：[Yuuyuko-uu/dsh-bili-subagent](https://github.com/Yuuyuko-uu/dsh-bili-subagent)
- **版本号**：0.9.8（[固定提交 1297336](https://github.com/Yuuyuko-uu/dsh-bili-subagent/tree/129733635f1cc04da27c6e0700c853c81637afd5)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可将发布改为目标与正文绑定的一次确认动作，响应超时先查发布结果，比较撤销和重复回调的写入数。控制未改善或阻断正常只读流程时撤回。[Q04](#research-q04)

用假 MCP 和宿主重放发布业务失败、已受理超时、独立动态调度、通知中断与子代理缺服务。只有独立拒绝全部对外写入已经验证时，才接真实账号核查读取。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1767 | — | — | 30248 |
| .mjs | source | 13 | 1779 | 1334 | 352 | — |
| .js | source | 2 | 4093 | 3303 | 710 | — |
| .mjs | test | 5 | 559 | 503 | 14 | — |
| .md | test | 1 | 22 | — | — | 205 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-bili-subagent/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-bili-subagent/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)

暂未获取：近30天关闭。

统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：让伙伴派子代理阅读视频，再决定如何说给用户听，有什么增量与授权边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 子代理看、伙伴说，比手工收藏和转述多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

想让 DSH 伙伴定期代为筛 B 站内容、再以已有角色语气讨论的人，可把搜索和读字幕交给子代理，再由伙伴处理内部报告及后续对话。手工收藏可由本人逐条确认，独立摘要日报也能聚合信息，但不会自然进入指定伙伴会话。作者明确注明 fork 自 dsh-bili-scroll；这里按当前派活与报告接线描述组合增量，未核对上游固定提交，不能接受整个差异表为原创证明。合格结果须能回到被筛视频和原字幕，而非仅派活成功。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-28](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/README.md#L3-L28)

作者说明来源、分工和报告去向。

<details>
<summary>查看原文（26行）</summary>

````text
> **让你的 AI 伙伴自己去刷 B站，然后回来跟你说话。**
>
> 插件不再自己"跑一轮然后写一份日报给你看"——它只负责**派一个子代理去看**，
> 子代理读字幕、翻评论、挑出值得的，写一份**给伙伴看的内部报告**；
> 再由你的伙伴（你自己的 AI）**用自己的口吻**决定怎么告诉你：公开评论只写一两句勾人，私信可以详细。

> **本仓库是 [c1overzz/dsh-bili-scroll](https://github.com/c1overzz/dsh-bili-scroll) 的改版（fork）**，
> 基于它的 `0.1.10`，沿用 MIT 许可并保留原作者署名与 LICENSE。感谢原作者把底子打好。

---

## 它现在怎么干活

```
到点（或你点「现在跑一轮」）
   ↓
插件往「你指定的那个会话」里塞一句（文案可在设置页改）：到谷时啦，去 B 站刷一轮吧～
   ↓
你的伙伴看到这句 → 调 bili_scan → 插件派出一个子代理
   ↓
子代理只负责「看」：搜视频 → 扫标题 → 看简介 → 读整段字幕 → 翻评论区
   ↓
交回一份内部报告（标题 / BV号 / 讲了什么 / 为什么值得 / 评论区反响）
   ↓
伙伴按设置决定怎么告诉你：评论 @ 你 ／ 私信你 ／ 两个都发
```
````

</details>

**依据 2 · 源码核查**：[index.js:910-961](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/index.js#L910-L961)

主入口拼接任务并通过 startActivation 将结果交给调用者。

<details>
<summary>查看原文（52行）</summary>

```text
    if (!ctx.subagents) return { ok: false, error: '这台 DSH 没有子代理能力（缺少 subagents 服务）' }

    // 手动刷不占「每天几条」的额度（那是自动刷的账）；每次最多挑这么几条
    const perRound = Math.max(1, Number(cfg.perScan || 1))

    const owner = String(cfg.ownerName || '你')
    const level = String(cfg.reportLevel || 'full')
    const levelLine = level === 'brief'
      ? '\n\n⚠️ 报告形态：**薄** —— 每条只写一两行（标题 + BV号 + 一句值不值得），不要展开细讲。'
      : (level === 'off'
        ? '\n\n⚠️ 报告形态：**不写详细报告** —— 直接给大肥鱼一段简短的口头总结（挑中哪几条、各自一句），不用逐条展开。'
        : '')
    const 定点 = String(bvid || '').trim()
    // ⭐ 2026-10-22「门对门」：这条 BV 要是从私信转进来的，这一轮就**只私信回** ——
    //    不塞评论块、不欠评论（连带 bili_send_message 那道「先发评论」的闸也不会挡）。
    //    从哪条路进来，就从哪条路回去；两个都做才是多此一举。
    const 私信回话 = Boolean(定点) && isDmShare(定点)
    const prompt = (定点
      ? String(cfg.watchPrompt || WATCH_TMPL).split('{bvid}').join(定点)
      : String(cfg.scanPrompt || SCAN_PROMPT_TMPL))
      .split('{owner}').join(owner)
      .split('{direction}').join(dir)
      .split('{n}').join(String(perRound)) + levelLine

    let run
    扫描中 += 1
    try {
      // ⭐ 2026-10-22：原来这里写死 provider 'apii' —— 别人机器上没这个 provider，
      //    自动刷一派子代理就失败。现在**两个都填了才指定**，留空就跟当前会话用一样的。
      const 子provider = String(cfg.subProvider || '').trim()
      const 子model = String(cfg.subModel || '').trim()
      // ⭐ 这台 DSH 有没有新接口？没有就走兜底（新建会话 + 递提示词 + 读日志）
      if (!ctx.subagents || typeof ctx.subagents.startActivation !== 'function') {
        log('这台 DSH 没有 subagents.startActivation，改用兜底：新建会话派活')
        const 兜 = await 兜底派活(prompt, 子provider, 子model)
        if (!兜.ok) {
          扫描中 = Math.max(0, 扫描中 - 1)
          return { ok: false, error: 兜.error }
        }
        return { ok: true, report: 兜.output, hint: '' }
      }
      run = await ctx.subagents.startActivation({
        provider: 'spawn',
        label: '刷B站：' + dir.slice(0, 20),
        request: {
          prompt: [{ type: 'text', text: prompt }],
          parent,
          ...(子provider && 子model ? { agentOptions: { provider: 子provider, model: 子model } } : {}),
        },
        signal: exec?.signal || new AbortController().signal,
        delivery: 'caller',
      })
```

</details>

**依据 3 · 源码核查**：[index.js:1128-1139](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/index.js#L1128-L1139)

实际注册 bili_scan 工具。

<details>
<summary>查看原文（12行）</summary>

```text
  tool({
    name: 'bili_scan',
    description: '派一个子代理去刷 B 站：按你想看的方向搜视频、读字幕原文、把值得的挑出来，看完把内容汇报给你。\n'
      + '大肥鱼（或你）说「帮我刷下 XX 方向」就能触发；子代理模型可在设置页选。'
      + '如果只想看**某一条**（比如她 @ 你的、或私信转给你的），传 bvid —— 那就只读那一条，不搜不挑。',
    parameters: {
      direction: { type: 'string', description: '想刷什么方向 / 主题 / 关键词，一句话或几个词' },
      bvid: { type: 'string', description: '可选。给了 BV号就是「定点看这一条」（@ 我的、或私信转给我的那条）：只看它、不搜不挑' },
    },
    async execute(args, exec) {
      return doScan(args?.direction, exec, String(args?.bvid ?? '').trim())
    },
```

</details>

#### 缺口

- 未核对上游相同时间基线和实际阅读质量
  **影响**：不能确定净优势或原创范围
  **进一步探讨**：固定上游对应版本后逐项比较任务组织，并人工抽核报告与原字幕

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 触发、子任务和通知如何记账？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

自动轮按配置、时段、间隔与每日次数判断，先预占额度，再把触发递到伙伴会话；投递明确失败时恢复额度并加十分钟冷却。触发成功只证明提示进入会话，伙伴是否调用 bili_scan、子代理能否读到材料仍另有状态。新宿主走 startActivation 并等待 result，失败返回错误；subagents 服务存在但缺少 startActivation 时，才兜底创建会话、等轮末或十五分钟，再读日志末句，无法仅凭这一句证明整轮成功。若整个 subagents 服务缺失，入口在派活前直接报错。通知批次最多六项，投递返回 false 时不提交 checkpoint，单进程 busy 和失败退避避免读提醒重叠。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:942-977](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/index.js#L942-L977)

新旧子代理路径和等待完成结果。

<details>
<summary>查看原文（36行）</summary>

```text
      if (!ctx.subagents || typeof ctx.subagents.startActivation !== 'function') {
        log('这台 DSH 没有 subagents.startActivation，改用兜底：新建会话派活')
        const 兜 = await 兜底派活(prompt, 子provider, 子model)
        if (!兜.ok) {
          扫描中 = Math.max(0, 扫描中 - 1)
          return { ok: false, error: 兜.error }
        }
        return { ok: true, report: 兜.output, hint: '' }
      }
      run = await ctx.subagents.startActivation({
        provider: 'spawn',
        label: '刷B站：' + dir.slice(0, 20),
        request: {
          prompt: [{ type: 'text', text: prompt }],
          parent,
          ...(子provider && 子model ? { agentOptions: { provider: 子provider, model: 子model } } : {}),
        },
        signal: exec?.signal || new AbortController().signal,
        delivery: 'caller',
      })
    } catch (e) {
      扫描中 = Math.max(0, 扫描中 - 1)
      return { ok: false, error: '派子代理失败：' + (e?.message ?? e) }
    }
    let result
    try {
      result = await run.result
    } catch (e) {
      try { await run.dispose() } catch {}
      扫描中 = Math.max(0, 扫描中 - 1)
      return { ok: false, error: '子代理跑失败：' + (e?.message ?? e) }
    }
    扫描中 = Math.max(0, 扫描中 - 1)
    const output = (result?.output || []).filter((b) => b && b.type === 'text').map((b) => b.text).join('')
    try { await run.dispose() } catch {}
    if (result?.stopReason !== 'completed') {
```

</details>

**依据 2 · 源码核查**：[index.js:851-902](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/index.js#L851-L902)

旧路径按轮末或超时等候，最终读日志文本。

<details>
<summary>查看原文（52行）</summary>

```text
  const 兜底派活 = async (prompt, 子provider, 子model) => {
    if (typeof ctx.agents?.create !== 'function') {
      return { ok: false, error: '这台 DSH 既没有 startActivation，也不能新建会话 —— 派不了' }
    }
    const sid = 'session-' + randomUUID()
    let handle = null
    try {
      handle = await ctx.agents.create({
        sessionId: sid,
        meta: { cwd: stateDir },
        ...(子provider && 子model ? { agentOptions: { provider: 子provider, model: 子model } } : {}),
      })
    } catch (e) {
      return { ok: false, error: '新建会话失败：' + (e?.message ?? e) }
    }
    const agent = handle && handle.agent
    if (!agent || typeof agent.followup !== 'function') {
      try { handle?.dispose?.() } catch (e) {}
      return { ok: false, error: '新会话没起来' }
    }
    let 完了 = false
    const 等 = new Promise((res) => {
      try {
        agent.ctx.on('agent/turn-stopping', () => {
          if (完了) return
          完了 = true
          setTimeout(res, 1200)
        })
      } catch (e) {}
      setTimeout(() => {
        if (!完了) {
          完了 = true
          res()
        }
      }, 15 * 60_000)
    })
    try {
      await agent.followup({
        id: randomUUID(),
        role: 'user',
        content: [{ type: 'text', text: prompt }],
        source: { kind: 'plugin:bili-scan' },
      })
    } catch (e) {
      try { handle?.dispose?.() } catch (err) {}
      return { ok: false, error: '派活失败：' + (e?.message ?? e) }
    }
    await 等
    const 出 = 读会话日志最后一句话(sid)
    try { handle?.dispose?.() } catch (e) {}
    if (!出) return { ok: false, error: '派出去的会话没交出结果（日志里没找到回复）' }
    return { ok: true, output: 出 }
```

</details>

**依据 3 · 源码核查**：[index.js:2093-2145](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/index.js#L2093-L2145)

自动配额预占、投递及失败退款。

<details>
<summary>查看原文（53行）</summary>

```text
  const tick = () => {
    try {
      refreshCfg()                    // ⭐ 定时器活得比设置页久：每一跳都重新读一遍配置
      // ⭐ 到点发动态跟刷站那条路完全独立（不看谷时、不看 autoMode），所以放在下面「只手动」早退之前
      Promise.resolve(动态那一跳()).catch((e) => log('到点发动态那一跳出错（已兜住）：' + (e?.message ?? e)))
      const 模式 = 自动模式()
      if (模式 === 'manual') return
      const now = new Date()
      const st = readJson(dutyStateFile, {})
      // ⭐ 0.9.1：上一轮**没投出去**（目标会话没醒着之类）时给个冷却 ——
      //   以前失败会把 lastRunAt 退回去，于是下一分钟又撞一次，日志一分钟一条刷十几分钟。
      if (Number(st.retryAfter || 0) > now.getTime()) return
      const today = dayKey(now)
      const used = countPickedToday(now)
      if (used >= Number(cfg.perDay || 0)) return
      // ⭐ 两轮之间至少隔这么久（手动跑不受这个限制）
      const gapMs = Math.max(5, Number(cfg.gapMin) || 180) * 60_000
      const lastAt = Date.parse(String(st.lastRunAt || '')) || 0
      if (lastAt && now.getTime() - lastAt < gapMs) return
      // 全天模式 = 一个「永远开着」的窗口；谷时模式 = 勾了的那几个窗口
      const 候选 = 模式 === 'always'
        ? [{ k: 'always', w: null }]
        : ['noon', 'night'].filter((k) => cfg[k]).map((k) => ({ k, w: WINDOWS[k] }))
      for (const { k, w } of 候选) {
        if (w && !inValley(now, w)) continue
        const key = `${today}:${k}`
        const rounds = used + 1
        const before = { windows: st.windows || {}, count: st.count || 0, picked: st.picked || 0, lastRunAt: st.lastRunAt || null, lastWhy: st.lastWhy || null }
        bumpState({ windows: { ...(st.windows || {}), [key]: true }, count: rounds, picked: rounds, lastRunAt: now.toISOString(), lastWhy: k, retryAfter: 0 })
        Promise.resolve((async () => {
          let extra = ''
          let box = []
          try {
            const 收件 = await pickInbox()
            box = 收件.items
            if (box.length) {
              extra = renderInbox(box)
              log('收件箱：这一轮递过去 ' + box.length + ' 条（@ / 回复）')
            }
          } catch (e) { log('收件箱：这一轮拉取失败 ' + (e?.message ?? e)) }
          let sent = false
          try {
            sent = await triggerFeiyuScan(`window:${k}`, extra, box)
            if (sent && box.length) commitInbox(box)   // 真递出去了才记账
          } catch (e) { log('收件箱：投递异常 ' + (e?.message ?? e)) }
          return sent
        })())
          .then((ok) => {
            // ⭐ 没投出去（目标会话没醒着之类）⇒ 把额度和间隔都退回去，下个周期还能重试
            if (ok === false) {
              // ⭐ 0.9.1：额度和间隔都退回，但**加 10 分钟冷却** —— 不然会话一直没醒着就每分钟撞一次
              bumpState({ ...before, retryAfter: Date.now() + 10 * 60_000 })
              log('自动刷：这一轮没投出去，额度已退回，10 分钟后再说（多半是目标会话没开着：去那儿说句话它就醒了）')
```

</details>

**依据 4 · 源码核查**：[lib/watch.mjs:59-81](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/lib/watch.mjs#L59-L81)

通知投递后再确认，读取与退避单进程互斥。

<details>
<summary>查看原文（23行）</summary>

```text
export async function deliverWatchBatch({ privateMessages, mentions, deliver, acknowledge }) {
  const batch = [...privateMessages, ...mentions].slice(0, 6)
  if (!batch.length || await deliver(batch) === false) return
  const sent = new Set(batch)
  await acknowledge(privateMessages.filter((x) => sent.has(x)), mentions.filter((x) => sent.has(x)))
}

export function createWatchTick({ refresh, enabled, intervalMs, run, onError, now = Date.now }) {
  let busy = false
  let nextAt = 0
  return async () => {
    try {
      refresh()
      if (!enabled() || busy || now() < nextAt) return
      nextAt = now() + intervalMs()
      busy = true
      try {
        await run()
      } catch (error) {
        nextAt = now() + intervalMs() * 3
        onError(error)
      } finally {
        busy = false
```

</details>

**依据 5 · 源码核查**：[index.js:910-913](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/index.js#L910-L913)

整个 subagents 服务缺失时在兜底分支之前退出。

```text
    if (!ctx.subagents) return { ok: false, error: '这台 DSH 没有子代理能力（缺少 subagents 服务）' }

    // 手动刷不占「每天几条」的额度（那是自动刷的账）；每次最多挑这么几条
    const perRound = Math.max(1, Number(cfg.perScan || 1))
```

#### 缺口

- 宿主取消、进程重启和同时手动触发未演练
  **影响**：不能断言端到端恰好一次或自动额度等于成功报告
  **进一步探讨**：用无对外发送的假宿主重放每阶段中断，分别核对预占、投递、报告和 checkpoint

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 对外写操作开关是否等同授权和成功？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

评论默认可由设置限制，但已有评论回复带 rpid 时绕过自动评论开关，force 也是由模型提供的布尔值；私信收件人可由参数覆盖，并可 force 越过投递关闭，只缺 UID 才继续拒绝。两种都发时还有先评论再私信的挂账，不过评论调用返回后无论业务是否成功都会清 pendingComment；MCP 超时则是抛错而非远端失败证明。因此这些开关不能当逐次人类授权和送达回执。工具实际通过本地 MCP 发出，由 B 站登录态及外部 API 决定结果，Python／uv、依赖准备和凭据保管归用户承担。 手动刷站只关闭自动扫描。定时器先调用独立动态调度，开启 dynamicAutoOn 和 dynamicOn 时会在时间窗内派活；动态工具还支持 force 越过 dynamicOn，日限额和间隔仍会检查。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1240-1282](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/index.js#L1240-L1282)

回复与 force 的例外，评论业务结果未作为清挂账条件。

<details>
<summary>查看原文（43行）</summary>

```text
    name: 'bili_reply',
    description: '在视频下发一条评论，或回复某条评论（楼中楼）。短、干净、像人说的话。\n'
      + '⚠️ 回复别人的评论时**正文里不要手打 @** —— B站会自己加「回复 @某某」，你再加一遍就重复了。\n'
      + '🔴 **自己发新评论**（不带 rpid）：正文末尾**必须亲手带上「@要 @ 谁」** —— B站 新评论**不会**自动加 @，不写就没有。\n'
      + '⚠️ 而**回别人的评论 / 楼中楼**（带 rpid）时，正文里**不要手打 @** —— B站 会自己加「回复 @某某」。\n'
      + '✅ 设置里开着「自动评论并 @ 你」、并且填了「要 @ 谁」时，**直接调就行，不用传 force**。\n'
      + '🔴 只有设置没开时才会拒绝；那种情况下要发才传 force: true。',
    parameters: {
      bvid: { type: 'string', description: 'BV号' },
      text: { type: 'string', description: '评论正文（短、干净、纯文本 @；别写敏感词）' },
      rpid: { type: 'number', description: '要回复的评论 id（0/不填 = 发新评论）。带了 rpid 就是"回别人"，**不受自动评论那套闸限制**' },
      root: { type: 'number', description: '楼中楼才填：楼层根评论 id（回复一级评论不用填）。正文里**不要**手打 @，B站会自己加「回复 @某某」' },
      force: { type: 'boolean', description: '本人当场让你发的，传 true 越过"自动评论关着"的闸' },
    },
    async execute(args) {
      // dmMode==='only' 时本轮根本不该发公开评论；「每轮最多发几条评论」填 0 也一条都不发 —— 工具层一并挡掉（除非当场 force）
      // ⭐ 但**带 rpid 的回复（楼中楼）不走这套闸**：那是在回别人说的话，不是「自动发评论去 @ 谁」。
      //    （2026-10-21：不加这条的话，dmMode=only 的人永远回不了别人的评论，只能每次手带 force）
      refreshCfg()
      const 是回复 = Math.max(0, Number(args.rpid) || 0) > 0
      const commentOn = Boolean(cfg.autoComment && cfg.mentionName && cfg.dmMode !== 'only')
      if (!commentOn && !args.force && !是回复) {
        return {
          ok: false,
          blocked: true,
          hint: cfg.dmMode === 'only'
            ? '现在是「只私信」模式（dmMode=only）—— 规定不发公开评论，改成用 bili_send_message 私信。确实要发时传 force: true。'
            : '要发评论得满足：开着「自动评论并 @ 你」、并填了「要 @ 谁」。或者本人当场让你发时传 force: true。',
        }
      }
      const r = await call('bili_reply', {
        bvid: String(args.bvid ?? ''),
        text: String(args.text ?? ''),
        rpid: Number(args.rpid) || 0,
        root: Math.max(0, Number(args.root) || 0),
      })
      pendingComment = null   // 发过（无论成败）就不再卡私信
      // ⭐ 回完了就把那条 @ / 回复标成已处理 —— 「同一条只提醒一次」靠这里生效
      try {
        const j = typeof r === 'string' ? JSON.parse(r) : r
        if (j && j.success) markInboxReplied(String(args.bvid ?? ''), Number(args.rpid) || 0)
      } catch (e) { /* 记账失败不影响回复本身 */ }
      return r
```

</details>

**依据 2 · 源码核查**：[index.js:1318-1342](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/index.js#L1318-L1342)

私信 UID、force 与先评论后私信检查。

<details>
<summary>查看原文（25行）</summary>

```text
    name: 'bili_send_message',
    description: '给某人发 B 站私信（把这一轮刷到的好东西私信给他）。用于「只私信 / 评论+私信」模式，让大肥鱼亲自把结果私下递过去。\n'
      + '🔴 安全闸：设置里「投递方式」得不是 off、且填了私信 UID，否则拒绝（本人当场让你发时传 force: true）。\n'
      + '⚠️ 私信是写给「人」看的：干净的人话，别出现设置名/内部术语；实测 500 字符就顶，别太长。',
    parameters: {
      text: { type: 'string', description: '私信正文（干净的人话、不含内部术语，控制 500 字内）' },
      uid: { type: 'number', description: '发给谁（B站 UID 数字；不填用设置里的 dmUid）' },
      force: { type: 'boolean', description: '本人当场让你发的，传 true 越过安全闸' },
    },
    async execute(args) {
      refreshCfg()
      const dmOn = Boolean(cfg.dmMode !== 'off' && Number(cfg.dmUid) > 0)
      const uid = Number(args.uid) || Number(cfg.dmUid) || 0
      if (!dmOn && !args.force) {
        return { ok: false, blocked: true, hint: '私信要发得先满足：设置里「投递方式」设成只私信/都发、并填了私信 UID。或者本人当场让你发时传 force: true。' }
      }
      if (!uid) return { ok: false, blocked: true, hint: '没有收件人 UID：在设置里填「私信发给谁」，或调用时传 uid。' }
      // ⭐ 硬约束：这一轮还欠着评论就先别发私信 —— 先调 bili_reply 把评论发了
      const commentOnNow = Boolean(cfg.autoComment && cfg.mentionName && cfg.dmMode !== 'only')
      // ⭐ 这道闸**故意不看 args.force**：模型会习惯性带 force: true 把它绕过去（2026-10-19 实测 7/7 轮全带）。
      //    评论"调过就算"（成败都清 pendingComment），所以不会把它锁死。
      if (commentOnNow && pendingComment && Date.now() - pendingComment.at < 15 * 60 * 1000) {
        return { ok: false, blocked: true, hint: '这一轮还没发评论：先调 bili_reply 在视频下留一条简短评论 @ 一下（设置里已经开着，直接发、不用 force），发完再回来发私信。' }
      }
      return call('bili_send_message', { receiver_uid: uid, text: String(args.text || '') })
```

</details>

**依据 3 · 源码核查**：[lib/mcp.mjs:70-75](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/lib/mcp.mjs#L70-L75)

桥读取 JSON 与 isError。

```text
  async call(name, args = {}, { timeoutMs = 180000 } = {}) {
    await this.start()
    const result = await this.#request('tools/call', { name, arguments: args }, timeoutMs)
    const text = (result?.content ?? []).map((c) => c?.text ?? '').join('\n').trim()
    if (result?.isError) throw new Error(text || `MCP 工具 ${name} 报错`)
    try { return text ? JSON.parse(text) : {} } catch { return text }
```

**依据 4 · 源码核查**：[lib/mcp.mjs:103-116](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/lib/mcp.mjs#L103-L116)

超时只删除本地 pending，返回未知远端结果。

<details>
<summary>查看原文（14行）</summary>

```text
  #request(method, params, timeoutMs = 60000) {
    const id = this.nextId++
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id)
        reject(new Error(`MCP ${method} 超时（${timeoutMs}ms）${this.stderr ? '：' + this.stderr.slice(-200) : ''}`))
      }, timeoutMs)
      this.pending.set(id, {
        resolve: (v) => { clearTimeout(timer); resolve(v) },
        reject: (e) => { clearTimeout(timer); reject(e) },
      })
      try { this.#send({ jsonrpc: '2.0', id, method, params }) } catch (e) {
        clearTimeout(timer); this.pending.delete(id); reject(e)
      }
```

</details>

**依据 5 · 源码核查**：[package.json:54-83](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/package.json#L54-L83)

宿主、Node 和 Web 依赖声明。

<details>
<summary>查看原文（30行）</summary>

```text
  "engines": {
    "dsh": ">=0.2.1-rc.2",
    "node": ">=22"
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
        "@deepseek-ai/dsh-client-ui-settings-plugins"
      ]
```

</details>

**依据 6 · 源码核查**：[index.js:1977-2007](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/index.js#L1977-L2007)

动态有独立时间窗并向选定会话投递发布提示。

<details>
<summary>查看原文（31行）</summary>

```text
  const 动态时间窗 = (now) => {
    const t = String(cfg.dynamicTime || '').trim()
    const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(t)
    if (!m) return false
    const target = new Date(now)
    target.setHours(Number(m[1]), Number(m[2]), 0, 0)
    const diff = now.getTime() - target.getTime()
    return diff >= 0 && diff <= 3 * 60 * 60 * 1000
  }

  const triggerDynamicPost = async (why = 'auto') => {
    const 递 = await 取目标会话('到点发动态', String(cfg.dynamicSession || '').trim())
    if (!递) return false
    const { target, agent } = 递
    const ownerN = String(cfg.ownerName || '你')
    const 文案 = (String(cfg.dynamicPrompt || '').trim() || DYNAMIC_TMPL)
      .split('{owner}').join(ownerN)
      .split('{home}').join(stateDir)
    const msg = {
      id: randomUUID(),
      role: 'user',
      content: [{ type: 'text', text: 文案 }],
      source: { kind: 'bili-duty-dynamic' },
    }
    try {
      await agent.followup(msg)
      log('到点发动态：已派给会话 ' + target.slice(0, 20) + '…（' + why + '）')
      return true
    } catch (e) {
      log('到点发动态：派活失败 ' + (e?.message ?? e))
      return false
```

</details>

**依据 7 · 源码核查**：[index.js:2013-2034](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/index.js#L2013-L2034)

独立动态派活开关和当天去重。

<details>
<summary>查看原文（22行）</summary>

```text
  const 动态那一跳 = async () => {
    if (动态派活中) return
    if (!cfg.dynamicAutoOn || !cfg.dynamicOn) return
    const now = new Date()
    const today = dayKey(now)
    const st = readJson(dutyStateFile, {})
    if (st.dynTickDay === today) return
    if (!动态时间窗(now)) return
    动态派活中 = true
    try {
      writeJson(dutyStateFile, { ...st, dynTickDay: today })
      const ok = await triggerDynamicPost('auto')
      if (!ok) {
        const cur = readJson(dutyStateFile, {})
        if (cur.dynTickDay === today) {
          delete cur.dynTickDay
          writeJson(dutyStateFile, cur)
        }
      }
    } finally {
      动态派活中 = false
    }
```

</details>

**依据 8 · 源码核查**：[index.js:2093-2100](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/index.js#L2093-L2100)

动态调度先于扫描 manual 早退。

```text
  const tick = () => {
    try {
      refreshCfg()                    // ⭐ 定时器活得比设置页久：每一跳都重新读一遍配置
      // ⭐ 到点发动态跟刷站那条路完全独立（不看谷时、不看 autoMode），所以放在下面「只手动」早退之前
      Promise.resolve(动态那一跳()).catch((e) => log('到点发动态那一跳出错（已兜住）：' + (e?.message ?? e)))
      const 模式 = 自动模式()
      if (模式 === 'manual') return
      const now = new Date()
```

**依据 9 · 源码核查**：[index.js:1364-1389](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/index.js#L1364-L1389)

force 可越过 dynamicOn，但不跳过日限额或间隔。

<details>
<summary>查看原文（26行）</summary>

```text
    async execute(args) {
      refreshCfg()
      if (!cfg.dynamicOn && !args.force) {
        return {
          ok: false,
          blocked: true,
          hint: '发公开动态得先开「允许发公开动态」（bili_config 传 {"dynamicOn":true}，或在 DSH 的插件设置里打开）。或者本人当场让你发时传 force: true。',
        }
      }
      const text = String(args.text ?? '').trim()
      if (!text) return { ok: false, blocked: true, hint: '正文不能空 —— 动态至少得有一句话。' }

      // 硬闸：每天几条 + 两条间隔几分钟，都按设置来（记在 state.json，跨轮次/跨会话都算数）
      const 每日上限 = Math.max(1, Math.min(Number(cfg.dynamicPerDay) || 3, 10))
      const 间隔分钟 = Math.max(1, Math.min(Number(cfg.dynamicGapMin) || 10, 720))
      const st = readJson(dutyStateFile, {})
      const today = dayKey()
      const 今天几条 = st.dynDay === today ? Number(st.dynCount || 0) : 0
      const 上一条在 = Number(st.dynAt || 0)
      if (今天几条 >= 每日上限)
        return { ok: false, blocked: true, hint: `今天已经发过 ${今天几条} 条动态了（上限 ${每日上限} 条）—— 够了，明天再说。额度可在设置里改。` }
      const 刚发过 = 上一条在 && Date.now() - 上一条在 < 间隔分钟 * 60 * 1000
      if (刚发过) {
        const 还差 = Math.ceil((间隔分钟 * 60 * 1000 - (Date.now() - 上一条在)) / 60000)
        return { ok: false, blocked: true, hint: `刚发过一条，还要等约 ${还差} 分钟（间隔 ${间隔分钟} 分钟）—— 别连着刷屏。` }
      }
```

</details>

#### 缺口

- 真实 B 站发布和权限流程未验证
  **影响**：无法给写操作授权或重复发送保证
  **进一步探讨**：用记录远端受理的替身检验业务失败、响应丢失、force/rpid 和独立动态触发；确保外部写入接口被独立拒绝。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样采用和验证逐次确认？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

先观察。已有 DSH 伙伴且想获取视频线索的人，可先在假 MCP 中核对一次字幕报告和预期目标会话；如需接真实账号，只有宿主工具层或独立代理验证会拒绝评论、私信、动态等全部外部写入时才做读取实验。手动扫描模式和面板开关本身不构成写入隔离。模型成本包括伙伴轮次与子代理，不可由更便宜的 provider 名称推断免费，阅读失败、登录维护和报告抽查也计入每个合格报告的成本。可以把读报告与写评论分离成具有明确目标、正文摘要和一次批准凭证的动作，收到超时先查发布结果；对照当前 force/rpid，在假服务重放撤销批准、重复回调与已受理超时。若写入控制未改善却显著阻断正常报告，就撤回方案。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:951-961](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/index.js#L951-L961)

子代理模型可配置但价格没有被此函数验证。

<details>
<summary>查看原文（11行）</summary>

```text
      run = await ctx.subagents.startActivation({
        provider: 'spawn',
        label: '刷B站：' + dir.slice(0, 20),
        request: {
          prompt: [{ type: 'text', text: prompt }],
          parent,
          ...(子provider && 子model ? { agentOptions: { provider: 子provider, model: 子model } } : {}),
        },
        signal: exec?.signal || new AbortController().signal,
        delivery: 'caller',
      })
```

</details>

**依据 2 · 源码核查**：[index.js:1240-1282](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/index.js#L1240-L1282)

现行发布接口提供要收紧的对照。

<details>
<summary>查看原文（43行）</summary>

```text
    name: 'bili_reply',
    description: '在视频下发一条评论，或回复某条评论（楼中楼）。短、干净、像人说的话。\n'
      + '⚠️ 回复别人的评论时**正文里不要手打 @** —— B站会自己加「回复 @某某」，你再加一遍就重复了。\n'
      + '🔴 **自己发新评论**（不带 rpid）：正文末尾**必须亲手带上「@要 @ 谁」** —— B站 新评论**不会**自动加 @，不写就没有。\n'
      + '⚠️ 而**回别人的评论 / 楼中楼**（带 rpid）时，正文里**不要手打 @** —— B站 会自己加「回复 @某某」。\n'
      + '✅ 设置里开着「自动评论并 @ 你」、并且填了「要 @ 谁」时，**直接调就行，不用传 force**。\n'
      + '🔴 只有设置没开时才会拒绝；那种情况下要发才传 force: true。',
    parameters: {
      bvid: { type: 'string', description: 'BV号' },
      text: { type: 'string', description: '评论正文（短、干净、纯文本 @；别写敏感词）' },
      rpid: { type: 'number', description: '要回复的评论 id（0/不填 = 发新评论）。带了 rpid 就是"回别人"，**不受自动评论那套闸限制**' },
      root: { type: 'number', description: '楼中楼才填：楼层根评论 id（回复一级评论不用填）。正文里**不要**手打 @，B站会自己加「回复 @某某」' },
      force: { type: 'boolean', description: '本人当场让你发的，传 true 越过"自动评论关着"的闸' },
    },
    async execute(args) {
      // dmMode==='only' 时本轮根本不该发公开评论；「每轮最多发几条评论」填 0 也一条都不发 —— 工具层一并挡掉（除非当场 force）
      // ⭐ 但**带 rpid 的回复（楼中楼）不走这套闸**：那是在回别人说的话，不是「自动发评论去 @ 谁」。
      //    （2026-10-21：不加这条的话，dmMode=only 的人永远回不了别人的评论，只能每次手带 force）
      refreshCfg()
      const 是回复 = Math.max(0, Number(args.rpid) || 0) > 0
      const commentOn = Boolean(cfg.autoComment && cfg.mentionName && cfg.dmMode !== 'only')
      if (!commentOn && !args.force && !是回复) {
        return {
          ok: false,
          blocked: true,
          hint: cfg.dmMode === 'only'
            ? '现在是「只私信」模式（dmMode=only）—— 规定不发公开评论，改成用 bili_send_message 私信。确实要发时传 force: true。'
            : '要发评论得满足：开着「自动评论并 @ 你」、并填了「要 @ 谁」。或者本人当场让你发时传 force: true。',
        }
      }
      const r = await call('bili_reply', {
        bvid: String(args.bvid ?? ''),
        text: String(args.text ?? ''),
        rpid: Number(args.rpid) || 0,
        root: Math.max(0, Number(args.root) || 0),
      })
      pendingComment = null   // 发过（无论成败）就不再卡私信
      // ⭐ 回完了就把那条 @ / 回复标成已处理 —— 「同一条只提醒一次」靠这里生效
      try {
        const j = typeof r === 'string' ? JSON.parse(r) : r
        if (j && j.success) markInboxReplied(String(args.bvid ?? ''), Number(args.rpid) || 0)
      } catch (e) { /* 记账失败不影响回复本身 */ }
      return r
```

</details>

**依据 3 · 源码核查**：[lib/watch.mjs:59-63](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/129733635f1cc04da27c6e0700c853c81637afd5/lib/watch.mjs#L59-L63)

提醒 checkpoint 与批次投递分离，可借鉴到写入确认。

```text
export async function deliverWatchBatch({ privateMessages, mentions, deliver, acknowledge }) {
  const batch = [...privateMessages, ...mentions].slice(0, 6)
  if (!batch.length || await deliver(batch) === false) return
  const sent = new Set(batch)
  await acknowledge(privateMessages.filter((x) => sent.has(x)), mentions.filter((x) => sent.has(x)))
```

#### 缺口

- 单份报告实际 token、时间和质量未知
  **影响**：无法评估持续采用收益
  **进一步探讨**：在假 MCP 或独立拒绝全部外部写入的环境中，采集报告的调用量、人工纠错和可追溯引用。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
