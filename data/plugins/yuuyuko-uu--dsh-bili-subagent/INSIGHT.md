# dsh-bili-subagent

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[efae852](https://github.com/Yuuyuko-uu/dsh-bili-subagent/tree/efae852a276b7b120ca9d8ef6cd5080da3023005)

<!-- BEGIN META -->
[![GitHub ★ 99](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=99&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yuuyuko-uu/dsh-bili-subagent) [![npm 30d 6,568](https://img.shields.io/static/v1?label=npm+30d&message=6%2C568&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bili-subagent) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bili-subagent)
<!-- END META -->

> **功能**：让 DSH 伙伴派子代理检索和阅读 B站内容，再依据设置整理报告及评论或私信。

> **亮点**：把看视频形成内部报告与父伙伴组织表达分开，并在固定会话中触发；这是工作分工增量，不证明推荐价值或无额外模型成本。[Q01](#research-q01)

> **主要限制**：自动日额度只确认触发已接受，评论调用返回结果后，无论返回成功或失败即放行私信；若调用抛错则不会走到清空语句；回复可绕过新评论门槛，MCP超时也不取消远端发送，不能把配置名当端到端交付保证。[Q02](#research-q02)

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
  - [Q01 · bili_scan如何派活并把结果交回伙伴？](#detail-section-11)
  - [Q02 · 调度、评论与私信的门槛和失败状态是什么？](#detail-section-12)
  - [Q03 · 采用成本及未来验证应怎样限制？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望伙伴筛选B站内容的用户可研究阅读与投递分工，合格推荐应可核对视频且消息状态清楚。[Q01](#research-q01)

人工检索分享或独立日报脚本更直接；本组件从上游fork出父子Agent分工，底层API与MCP仍有继承归属。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| bili_scan | 派子代理读视频并返回报告 | 子代理模型与宿主，completed不证明内容有效 |
| bili_search | 按配置过滤播放量与发布时间 | 依赖Python MCP和B站响应 |
| bili_reply | 发表或回复评论 | 新评论与回复guard不同，回执需核对 |
| bili_send_message | 发私信 | UID及配置门槛，评论尝试非成功保证 |
| 自动时钟 | 在目标会话触发伙伴 | 配额控制触发，不控制全部后续成本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22与匹配DSH子代理/agents/llm/web服务 | 必需，声明/源码 | 派活、目标会话和设置 | 派活或加载失败 |
| Python或uv和MCP依赖 | 内容操作必需 | 本地Python服务 | 子进程启动失败/请求超时 |
| B站登录凭据与网络 | 对应操作必需 | 字幕、评论及发送 | 服务错误或风控，当前未验证 |
| 主伙伴和子代理模型 | 阅读/表达必需 | 筛选和组织内容 | 花费与质量依所选模型 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对依赖、登录与目标会话 | whoami状态及会话可用，不能推导推荐效果 |
| 阅读 | 父伙伴调bili_scan | 子代理completed返回报告，失败可能含partial |
| 投递 | 父伙伴按配置调用评论/私信 | 分清尝试、回执与接收方已读 |
| 恢复 | 用户核对超时实际结果 | 不盲重发，分别关闭自动刷和独立输出设置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Python/uv和依赖下载，本地存储 | 登录、模型及会话配置，时间未知 | 不执行本次安装 |
| 持续 | 父子模型、API轮询及笔记 | 复核有用性和发送状态 | 金额和每条合格推荐耗时未知 |
| 失败恢复 | 额外请求和重复风险 | 核实超时和部分报告 | 超时不取消Python操作 |
| 退出 | 凭据与笔记保留 | 逐项关闭自动功能再停用 | manual仅约束自动刷一条链 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 阅读交接 | 子代理报告返回父伙伴 | 推荐价值和准确率 |
| 日额度 | 控制自动触发次数 | 总模型预算或后续成功 |
| 投递 | 有工具和部分回执检查 | 超时实际结果及端到端可靠性 |

> **思考**：自动日额度只确认触发已接受，评论调用返回结果后，无论返回成功或失败即放行私信；若调用抛错则不会走到清空语句；回复可绕过新评论门槛，MCP超时也不取消远端发送，不能把配置名当端到端交付保证。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把看视频形成内部报告与父伙伴组织表达分开，并在固定会话中触发；这是工作分工增量，不证明推荐价值或无额外模型成本。[Q01](#research-q01)

主派活明确区分completed和partial、目标投递失败退额度并加冷却有助排障；发送链仍混合尝试和成功，MCP超时没有取消协议，需要持久待核实状态而非直接重试。

<a id="detail-section-5"></a>

### 1.4 主要限制

自动日额度只确认触发已接受，评论调用返回结果后，无论返回成功或失败即放行私信；若调用抛错则不会走到清空语句；回复可绕过新评论门槛，MCP超时也不取消远端发送，不能把配置名当端到端交付保证。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

保持观察；如果后续试验，先只阅读报告且关闭全部发送相关功能，人工核对内容价值与费用，再单独安排投递验证。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

派活、调度、发送guard与MCP失败机制已查源码；推荐效果及外部投递未验证，持久状态方案是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/mcp.mjs、vendor/bilibili-mcp/mcp_server.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查主派活路径、自动时钟、评论/私信guard、本地MCP及Python发送回执；未完整审计旧宿主兜底、动态、自动安装、扫码登录或所有字幕接口。
- 下一步：后续用固定视频和可控失败回执验证内容及状态；真实发送须另有明确任务，不在本研究执行。

**分析版本**

- **仓库**：[Yuuyuko-uu/dsh-bili-subagent](https://github.com/Yuuyuko-uu/dsh-bili-subagent)
- **版本号**：0.9.8（[固定提交 efae852](https://github.com/Yuuyuko-uu/dsh-bili-subagent/tree/efae852a276b7b120ca9d8ef6cd5080da3023005)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是持久区分阅读、发送尝试和回执确认，并为超时保留待核实状态；失败/超时对照若不减少错报或重复，就否定这种状态设计。[Q03](#research-q03)

后续用固定视频和可控失败回执验证内容及状态；真实发送须另有明确任务，不在本研究执行。

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

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-bili-subagent/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-bili-subagent/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-bili-subagent/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：伙伴派子代理看B站再投递的流程是否把阅读与发送分清，调度和外部依赖有哪些限制？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · bili_scan如何派活并把结果交回伙伴？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

它面向希望DSH伙伴持续筛选B站内容、再自行组织回复的用户。简单替代是人工关注/检索并分享链接，或由独立脚本直接生成日报。本组件是上游dsh-bili-scroll的fork，贡献归于把阅读交给spawn子代理并把文本报告返回父会话；底层B站API与Python MCP不是新实现。bili_scan进入scanWith，选择配置的provider/model或继承当前会话，等待run.result，非completed返回部分结果和错误，completed后生成父伙伴投递提示并可追加本地报告。旧宿主缺startActivation另走新会话兜底，这条返回report而hint为空，不能认为所有路径具有相同后处理。合格结果是发现与用户相关、可核对原视频的内容，并正确处理发送状态；仅子代理完成不证明内容有价值或消息已投递。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-10](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/README.md#L5-L10)

作者明确分工和fork归属。

```text
> 插件不再自己"跑一轮然后写一份日报给你看"——它只负责**派一个子代理去看**，
> 子代理读字幕、翻评论、挑出值得的，写一份**给伙伴看的内部报告**；
> 再由你的伙伴（你自己的 AI）**用自己的口吻**决定怎么告诉你：公开评论只写一两句勾人，私信可以详细。

> **本仓库是 [c1overzz/dsh-bili-scroll](https://github.com/c1overzz/dsh-bili-scroll) 的改版（fork）**，
> 基于它的 `0.1.10`，沿用 MIT 许可并保留原作者署名与 LICENSE。感谢原作者把底子打好。
```

**依据 2 · 源码核查**：[index.js:905-978](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/index.js#L905-L978)

主派活、模型选择、旧接口兜底和completed判定。

<details>
<summary>查看原文（74行）</summary>

```text
  const scanWith = async (parent, direction, exec, bvid = '') => {
    const dir = String(direction || '').trim()
      || (Array.isArray(cfg.keywords) ? cfg.keywords.filter(Boolean).join(' ') : '')
      || '最近有什么值得看的'
    if (!parent) return { ok: false, error: '没有可用的会话' }
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
      return { ok: false, error: '子代理没正常跑完（' + (result?.stopReason || '未知') + '）' + (result?.diagnostic ? '：' + result.diagnostic : ''), partial: output }
```

</details>

**依据 3 · 源码核查**：[index.js:985-1020](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/index.js#L985-L1020)

父伙伴投递提示与本地报告追加。

<details>
<summary>查看原文（36行）</summary>

```text
    //    但下面拼「评论块」和 {commentQuota} 占位符时还在用它 ⇒ 必须定义，否则整条 bili_scan 直接抛
    //    ReferenceError（2026-10-21 用户实测：自动评论关着时刷不起来，就是这个）
    const commentQuota = Math.max(0, Number(cfg.commentPerRound ?? 1))
    if (commentOn) pendingComment = { at: Date.now() }   // 记账：这轮欠一条评论
    const dmOn = Boolean(cfg.dmMode !== 'off' && Number(cfg.dmUid) > 0)
    // ⭐ 2026-10-24：评论「怎么写」交给可改的 commentPrompt；这里只保留**机制性**的话
    //    （用哪个工具、楼中楼别手打 @）—— 那些是必须照做的，不该被改坏
    const 口吻 = COMMENT_STYLES[Math.floor(Math.random() * COMMENT_STYLES.length)]
    const 评论内容 = (String(cfg.commentPrompt || '').trim() || COMMENT_TMPL)
      .split('{owner}').join(owner)
      .split('{mention}').join(String(cfg.mentionName || ''))
      .split('{quota}').join(String(commentQuota))
      .split('{style}').join(口吻)
    const 评论块 = '· **评论区 @（公开！除了 ' + owner + '，别人也看得到）**：这是**发**评论——必须用 `bili_reply` 工具真发一条，**不是**用 `bili_comment` 去读评论（读评论是子代理已经干过的事，跟这一步无关）。**设置里已经开着，直接调 bili_reply 就行，不用传 force**。'
      + String.fromCharCode(10) + 评论内容
      + String.fromCharCode(10) + '  · 回别人的评论（楼中楼）就别手打 @ 了，B站 会自己加「回复 @某某」。'
    const 私信块 = '· **私信（只 ' + owner + ' 一个人看）**：用 bili_send_message 发**详细版**——开头先叫一声「' + owner + '，」再往下说；标题、BV号、视频讲了啥都可以细说，给 UID ' + Number(cfg.dmUid) + '。'
    const 都要块 = '⚠️ **这两件都要做，别只做一件**：先调 `bili_reply` 把评论 @ 发了，再调 `bili_send_message` 发私信（没发评论之前，私信会被拒）。'
    const 都不要块 = '报告拿给你了，你自己看着跟' + owner + '聊。'
    // ⭐ 2026-10-21：投递提示改成「模板常驻」（设置页里显示的就是默认文案，不是留空）
    const hintTpl = String(cfg.hintPrompt || '').trim() || HINT_TMPL
    // ⭐ 私信转进来的那条：回法另写一套（只私信、不评论、不带 BV），不走上面那套模板
    const hint = (私信回话 ? dmReplyHint(owner) : hintTpl)
      .split('{owner}').join(owner)
      .split('{mention}').join(String(cfg.mentionName || ''))
      .split('{commentQuota}').join(String(commentQuota))
      .split('{uid}').join(String(Number(cfg.dmUid) || 0))
      .split('{commentBlock}').join(commentOn ? 评论块 : '')
      .split('{dmBlock}').join(dmOn ? 私信块 : '')
      .split('{bothBlock}').join(commentOn && dmOn ? 都要块 : '')
      .split('{noneBlock}').join(!commentOn && !dmOn ? 都不要块 : '')
      // 占位符留空后会剩下空行，收一下
      .replace(/\n{3,}/g, '\n\n')
      .split('\n').filter((x) => x.trim() !== '').join('\n')
    // ⭐ 每一轮的报告都写回报告文件（设置页「看报告」能回看）；「日报写多细=不写」时跳过
    if (level !== 'off') { try { appendFileSync(reportFileOf(), '\n\n---\n\n' + output + '\n', 'utf8') } catch {} }
```

</details>

**依据 4 · 源码核查**：[index.js:1128-1139](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/index.js#L1128-L1139)

工具入口实际调用doScan。

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 调度、评论与私信的门槛和失败状态是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

自动时钟每60秒检查模式、日额度、谷时/全天、最短间隔与retryAfter，先记账再向目标会话agent.followup投递；投递false才回退额度并冷却10分钟。它计的是触发被接受，不是子代理、阅读或社会化投递全部成功，不能把额度退回解释成所有后续失败都会退。工具通过本地Python MCP发请求，超时仅删除pending并reject，没有向Python发送取消，因此发送超时后结果可能未知，直接重发可能重复。评论guard对新评论要求autoComment/mention或force，但带rpid的回复绕过这套门槛；“只私信”不是所有公开回复的硬禁令。pendingComment在调用评论后无论返回成功失败都清空，15分钟后也不再挡私信，所以“先评论再私信”是尝试顺序，不是评论已成功保证。Python私信检查回执msg_key/seqno，仍不能证明接收方已读。依赖DSH子代理/agents/llm/web与Python环境、登录凭据和B站网络，外部资格与风控未验证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:2093-2148](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/index.js#L2093-L2148)

先记额度、跟随投递结果回退与冷却。

<details>
<summary>查看原文（56行）</summary>

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
            }
          })
          .catch((e) => { log('自动刷：投递异常（已兜住）' + (e?.message ?? e)) })
```

</details>

**依据 2 · 源码核查**：[index.js:2037-2074](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/index.js#L2037-L2074)

触发成功判据为agent.followup完成。

<details>
<summary>查看原文（38行）</summary>

```text
  const triggerFeiyuScan = async (why, extra, box) => {
    const 递 = await 取目标会话('自动刷')
    if (!递) return false
    const { target, agent } = 递
    const msg = {
      id: randomUUID(),
      role: 'user',
      // ⭐ 这段是设置页「自动刷触发语」，可改；留空回落到内置默认
      content: [{ type: 'text', text: (() => {
        const ownerN = String(cfg.ownerName || '你')
        const t = String(cfg.triggerPrompt || '').trim() || TRIGGER_TMPL
        const base = t.split('{owner}').join(ownerN)
        // ⭐ 2026-10-22「门对门」：这一轮如果只有私信，就别叫她去刷一整轮、也别叫她去评论 ——
        //    原来的触发语里有「该发评论发评论」，对私信那条是错的。
        const 全私信 = Array.isArray(box) && box.length > 0 && box.every((it) => it && it.kind === 'dm')
        const 有视频 = Array.isArray(box) && box.some((it) => it && it.kind === 'dm' && it.bvid)
        const 例外 = 全私信
          ? (有视频
            ? '⚠️ 这一轮只有' + ownerN + '私信转来的一条视频：**只看那一条**（`bili_scan` 传 bvid），别刷整轮；'
              + '看完**私信回她**，不要发评论、不要 @、也不要去评论区。' + String.fromCharCode(10) + String.fromCharCode(10)
            : '⚠️ 这一轮只是' + ownerN + '在 **B站 私信**里跟你说了一句话（没带视频）：'
              + '**不用刷、不用看视频、也不用去评论区**；看完**用 `bili_send_message` 私信回**她，'
              + '话里不用带 BV 号。' + String.fromCharCode(10) + String.fromCharCode(10))
          : ''
        // ⭐ 有 @ / 回复就一起递过去：一条消息里说完，别连着弹两下
        return 例外 + (extra ? base + String.fromCharCode(10) + String.fromCharCode(10) + extra : base)
      })() }],
      source: { kind: 'bili-duty-scan' },
    }
    try {
      await agent.followup(msg)
      // ⭐ 递出去了才记「这条是从私信来的」—— 没递进去就别乱关评论块
      if (Array.isArray(box) && box.some((it) => it && it.kind === 'dm')) markDmShares(box)
      log('自动刷：已触发伙伴自己刷一轮（' + why + '，会话 ' + target.slice(0, 20) + '…）')
      return true
    } catch (e) {
      log('自动刷：触发失败 ' + (e?.message ?? e))
      return false
```

</details>

**依据 3 · 源码核查**：[index.js:1254-1281](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/index.js#L1254-L1281)

回复绕过新评论门槛，调用后清pending。

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[index.js:1327-1342](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/index.js#L1327-L1342)

私信条件与15分钟pending窗口。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 5 · 源码核查**：[lib/mcp.mjs:69-75](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/lib/mcp.mjs#L69-L75)

MCP工具调用边界。

```text
  /** 调一个 MCP 工具：能解析成 JSON 就返回对象，否则返回字符串 */
  async call(name, args = {}, { timeoutMs = 180000 } = {}) {
    await this.start()
    const result = await this.#request('tools/call', { name, arguments: args }, timeoutMs)
    const text = (result?.content ?? []).map((c) => c?.text ?? '').join('\n').trim()
    if (result?.isError) throw new Error(text || `MCP 工具 ${name} 报错`)
    try { return text ? JSON.parse(text) : {} } catch { return text }
```

**依据 6 · 源码核查**：[lib/mcp.mjs:103-118](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/lib/mcp.mjs#L103-L118)

超时仅本地reject，无取消消息。

<details>
<summary>查看原文（16行）</summary>

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
    })
  }
```

</details>

**依据 7 · 源码核查**：[vendor/bilibili-mcp/mcp_server.py:1348-1374](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/vendor/bilibili-mcp/mcp_server.py#L1348-L1374)

私信回执检查。

<details>
<summary>查看原文（27行）</summary>

```text
    cred = get_cred()

    if not text or not text.strip():
        return json.dumps({"success": False, "error": "text 不能为空"}, ensure_ascii=False)

    try:
        result = await session.send_msg(
            credential=cred,
            receiver_id=receiver_uid,
            msg_type=session.EventType.TEXT,
            content=text.strip(),
        )
        # ⭐ 校验「真的投递了」：只凭"没抛异常"就报成功是假的
        #    （上游 0.1.18 的实测：接口 code=0 但没有 msg_key ⇒ 那条私信根本没出去，
        #      调用方却显示"已发送"。见 issues #35 / #25）
        data = result if isinstance(result, dict) else {}
        msg_key = data.get("msg_key") or data.get("msg_seqno")
        if isinstance(result, dict) and not msg_key:
            return json.dumps({
                "success": False,
                "error": "接口没报错，但回执里没有 msg_key —— 这条私信大概率没真投递出去",
                "receiver_uid": receiver_uid,
                "data": data,
            }, ensure_ascii=False)
        return json.dumps({
            "success": True,
            "message": f"私信已发送给UID:{receiver_uid}",
```

</details>

**依据 8 · 源码核查**：[index.js:43-43](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/index.js#L43-L43)

宿主服务依赖。

```text
export const inject = ['webServer', 'tools', 'settings', 'subagents', 'agents', 'llm']
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 采用成本及未来验证应怎样限制？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

当前适合熟悉B站账号与DSH工具的维护者观察，不宜把自动阅读和自动发送直接当可靠日报服务。首次需安装Python/uv及MCP依赖、登录并选择目标会话与模型；持续有父子模型token、字幕/评论请求、轮询和本地笔记存储，所谓便宜中转只是作者选择，未有当前金额或单位合格推荐成本。手动刷不占自动日额度，所以额度不是全局预算。退出应先关自动刷，同时单独检查动态和消息监听设置；tick在manual早退前仍执行独立动态逻辑，不能以“只手动”假定所有后台输出都停了。由评论尝试与成功状态混用可提出未验证假设：把阅读完成、评论尝试、评论确认、私信确认分别记为持久状态，并对发送超时提供待核实状态，可减少重复发送和误报。对照含失败回执/超时的流程，若错报和重复不降或人工负担明显增加，就否定它。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:90-98](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/README.md#L90-L98)

Python/uv前提与安装动作。

```text
## 装之前（一条前提，30 秒）

机器上要有 **`Python 3.10+`** 或 **`uv`** —— 有一个就够：

- 有 `uv` 最好：单文件、解压就能用、不用管理员、不用进 PATH；
- 都没有也没关系：点「装主依赖」时插件会**自己下一份 `uv`** 到自己的家目录（免管理员），
  先直连 GitHub，不通走国内加速，下载完核对官方 `sha256`；
- ⚠️ 杀软报这个下载：把 `%USERPROFILE%\.dsh\bili-duty\bin\` 加白；
  不想加白就自己装一份 `uv` 或 Python 3.10+。
```

**依据 2 · 源码核查**：[index.js:912-913](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/index.js#L912-L913)

手动刷不占自动额度。

```text
    // 手动刷不占「每天几条」的额度（那是自动刷的账）；每次最多挑这么几条
    const perRound = Math.max(1, Number(cfg.perScan || 1))
```

**依据 3 · 源码核查**：[index.js:2093-2099](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/index.js#L2093-L2099)

manual早退前仍执行独立动态逻辑。

```text
  const tick = () => {
    try {
      refreshCfg()                    // ⭐ 定时器活得比设置页久：每一跳都重新读一遍配置
      // ⭐ 到点发动态跟刷站那条路完全独立（不看谷时、不看 autoMode），所以放在下面「只手动」早退之前
      Promise.resolve(动态那一跳()).catch((e) => log('到点发动态那一跳出错（已兜住）：' + (e?.message ?? e)))
      const 模式 = 自动模式()
      if (模式 === 'manual') return
```

**依据 4 · 源码核查**：[index.js:1270-1281](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/index.js#L1270-L1281)

发送尝试和成功计账分开程度。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[lib/mcp.mjs:103-118](https://github.com/Yuuyuko-uu/dsh-bili-subagent/blob/efae852a276b7b120ca9d8ef6cd5080da3023005/lib/mcp.mjs#L103-L118)

超时结果未知的推导依据。

<details>
<summary>查看原文（16行）</summary>

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
    })
  }
```

</details>

#### 缺口

- 无同任务推荐价值、父子模型总账单和人工复核记录。
  **影响**：不能确认自动筛选比人工关注/检索更值得，也不能把中转称为免费。
  **进一步探讨**：固定视频集与同预算对比人工筛选，记录有用推荐、误读、总token和人工核对。
- 持久投递状态假设尚未实现验证。
  **影响**：不能保证当前发送幂等或待核实恢复。
  **进一步探讨**：用可控回执失败及超时模拟验证状态机和重复投递情况；真实发送另需用户明确安排。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
