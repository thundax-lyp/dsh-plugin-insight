# 刷B站（dsh-bili-scroll）

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[398e472](https://github.com/c1overzz/dsh-bili-scroll/tree/398e4724a481b09b6383a950bcd08723c632da59)

<!-- BEGIN META -->
[![GitHub ★ 1,087](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C087&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/c1overzz/dsh-bili-scroll) [![npm 30d 43,042](https://img.shields.io/static/v1?label=npm+30d&message=43%2C042&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bili-scroll) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bili-scroll)
<!-- END META -->

> **功能**：按兴趣筛选 B站内容并生成日报或提醒。

> **亮点**：把候选、字幕、判重和报告整合到 DSH 任务流程；真实质量和节时尚未对照。[Q01](#research-q01)

> **主要限制**：公开评论默认关闭但 force 可越过守卫；文件锁非原子排他，未查到评论也不等于未发送。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 从候选到日报和提醒增加什么？](#detail-section-11)
  - [Q02 · 评论默认关闭是否等于硬性禁止写入？](#detail-section-12)
  - [Q03 · 跨宿主锁、去重和预算能否保证不重复？](#detail-section-13)
  - [Q04 · 安装、凭据与升级有哪些成本？](#detail-section-14)
  - [Q05 · 怎样让重复和未知投递更容易识别？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：持续关注 B站并愿回看原内容的个人用户；替代为手工搜索和收藏。[Q01](#research-q01)

手工搜索、看原视频、收藏和整理，不自动以账号发表评论。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 内容筛选 | 推荐或搜索后整理 | 需要核对原内容 |
| 日报与提醒 | 汇总结果 | 模型与账号依赖 |
| 评论投递 | 以账号发送 | 默认关，force 可越过 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 Python/uv | 必需 | 执行插件与工具 | 无法运行 |
| B站账号与网络 | 对应功能必需 | 候选与投递 | 调用失败 |
| 公开动作授权 | 发评论/私信必需 | 代表用户发送 | 保持只读 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定工件、配置只读样本 | 核对凭据及预算 |
| 筛选 | 查看候选与字幕 | 回看原内容 |
| 投递 | 用户授权后检查回执 | 未知先对账 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Python、模型与网络资源 | 账号和配置 | 发布渠道须核对 |
| 持续 | 模型及本地转写成本未知 | 审核内容和结果 | 节时未测 |
| 恢复 | 可能重复外发 | 检查回执与去重表 | 未查到不代表未发送 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 内容整理 | 章程组织筛选与报告 | 总结准确和节时 |
| 防重复 | PID/TTL 锁及判重指令 | 原子互斥或恰好一次 |

> **思考**：公开评论默认关闭但 force 可越过守卫；文件锁非原子排他，未查到评论也不等于未发送。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把候选、字幕、判重和报告整合到 DSH 任务流程；真实质量和节时尚未对照。[Q01](#research-q01)

force 可越过自动评论守卫；文件锁读写非原子，判重不可读时停评论属于章程指令。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

公开评论默认关闭但 force 可越过守卫；文件锁非原子排他，未查到评论也不等于未发送。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用只读样本核对结果；外发须单独授权，未知先核账。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持评论守卫、force、文件锁和复核边界；未运行宿主或真实账号。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、prompts/duty.md、lib/state.mjs、lib/verify.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 27 个指定扩展名文件、排除 4、解析错误 0；静态核查代表路径，未运行 DSH、B站或模型。
- 下一步：隔离账号核验只读、force 权限、并发锁、判重缺失与投递未知。

**分析版本**

- **仓库**：[c1overzz/dsh-bili-scroll](https://github.com/c1overzz/dsh-bili-scroll)
- **版本号**：2.4.0（[固定提交 398e472](https://github.com/c1overzz/dsh-bili-scroll/tree/398e4724a481b09b6383a950bcd08723c632da59)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：持久操作标识和确认/未查到/未知分态可减少误重试；须验证平台能力、误报及隐私成本。[Q05](#research-q05)

隔离账号核验只读、force 权限、并发锁、判重缺失与投递未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 1660 | — | — | 30748 |
| .js | source | 2 | 4506 | 3524 | 965 | — |
| .mjs | source | 13 | 1688 | 1215 | 398 | — |
| .mjs | test | 2 | 82 | 70 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 86](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=86&color=737b86&logo=github)](https://github.com/c1overzz/dsh-bili-scroll/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 110](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=110&color=737b86&logo=github)](https://github.com/c1overzz/dsh-bili-scroll/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 24](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=24&color=737b86&logo=github)](https://github.com/c1overzz/dsh-bili-scroll/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：B站内容筛选到报告与投递如何工作，权限和重复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从候选到日报和提醒增加什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

插件面向持续关注 B站内容、希望收集候选和阅读摘要的个人用户；按章程从推荐或关键词搜索，结合字幕、画面和判重表筛选，写日报或提醒。对照为手动搜索、看原视频和收藏；摘要需要回到原内容核对，无法凭代码证明节省时间或推荐质量。公开评论和私信会以用户账号产生外部副作用，不等同只读日报。

#### 证据与依据

**依据 1 · 源码核查**：[prompts/duty.md:92-108](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/prompts/duty.md#L92-L108)

候选、判重及读取字幕的工作流。

<details>
<summary>查看原文（17行）</summary>

```text
## 一轮要做的事

1. **先决定这一轮"看哪儿"**（开场会告诉你设置里的关键词填没填）：

   - ⭐ **没填关键词（默认）** ⇒ 用 **`bili_recommend(ps=30)`** 刷**这个账号的首页推荐流**。
     这是**故意的**：以前留空会用内置那几组词（DeepSeek Harness / DSH 插件 …）⇒ **所有装了插件的人刷的是同一批视频**，
     评论区就会堆成一片"同款插件互相报到"。推荐流按各自的账号画像推，天然散开。
     · 从返回里**随机挑几条**（别固定取前 N —— 画像相近的人还是会撞车）
     · 推荐流里混着娱乐 / 带货 / 直播切片，**不感兴趣的直接跳过**，不用勉强
     · ⚠️ 推荐流里也会出现"讲 DSH 的 up 自己发的视频"—— 那是正常的，别因为"这圈我熟"就一律跳过
   - **填了关键词** ⇒ 用 **`bili_search(keyword=…)`** 搜（近 7 天优先），一个词一轮，别一次搜五遍
2. 从结果里挑出**值得的**，条数看设置页的「定量刷（每天几条）」；**判重** —— 已经看过的跳过。
   ⭐ **判重表用 `duty_seen_append(bvid, title, up, status)` 写**（一行一条；路径由工具自己定，你不用管）。
   ⚠️ **如果那份判重表读不出来（不存在 / 打不开）**：**不要当成"没记录过"** —— 那会让同一批视频反复推送、
   重复打扰一批人。正确做法是：**在报告里明写"判重表读不到"**，而且**这一轮不发评论**（宁可少发）。
3. 每条：
   - **读字幕原文**（⚠️ 别看摘要下判断）
```

</details>

**依据 2 · 源码核查**：[index.js:53-74](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/index.js#L53-L74)

日额度、评论、私信及转写默认。

<details>
<summary>查看原文（22行）</summary>

```text
  /** 定量刷：每天最多挑几条 */
  perDay: z.natural().default(5).extra('volatile', true),
  /** 峰谷自动刷（总开关） */
  peakValley: z.boolean().default(false).extra('volatile', true),
  /** 峰谷子开关：中午 / 晚上 */
  noon: z.boolean().default(true).extra('volatile', true),
  night: z.boolean().default(true).extra('volatile', true),
  /** 自动评论 @ 使用者（默认关 —— 会拿用户的号说话，必须他自己开） */
  autoComment: z.boolean().default(false).extra('volatile', true),
  /** ⭐ 私信投递：off=只发评论（现状）· only=只私信（完全不公开评论）· both=评论 + 私信 */
  dmMode: z.string().default('only').extra('volatile', true),
  /** ⭐ 私信发给谁的 UID（数字）。要在 dmMode 不是 off 时填 */
  dmUid: z.natural().default(0).extra('volatile', true),
  /** 本地转写（没字幕的视频用 Whisper 转；默认关，要下模型） */
  transcribe: z.boolean().default(false).extra('volatile', true),
  /** 本地转写用哪个 Whisper 模型（tiny / base / small / medium） */
  asrModel: z.string().default('small').extra('volatile', true),
  /** ⭐ 每轮最多发几条评论（每条里 @ 一次下面那个人）；**有效范围 0–20，口径见 clampPatch**（0 = 不发评论）
   *  ⚠️ 这里故意**不加 `.max(20)`**：schema 校验不过 ⇒ cordis 拒收这条 entry ⇒ **整条插件不激活** ✗
   *     （跟 schemastery 拿不到时的降级同一个道理）—— 范围一律由 clampPatch 在**写**和**读**两头钳。 */
  commentPerRound: z.natural().default(1).extra('volatile', true),
  /** ⭐ 要 @ 谁（B站 昵称）；**留空 = 不发评论** —— 评论存在的意义就是 @ 那一下 */
```

</details>

**依据 3 · 源码核查**：[package.json:1-5](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/package.json#L1-L5)

包定位和版本。

```text
{
  "name": "dsh-bili-scroll",
  "version": "2.4.0",
  "description": "DSH 插件：每天替你刷一轮 B站 —— 读字幕挑出值得的、写一份日报，值得的就 @ 你",
  "keywords": [
```

#### 缺口

- 未运行 DSH、B站 API、模型或真实账号
  **影响**：不能证明候选质量、实际投递和去重效果
  **进一步探讨**：用隔离账号及只读样本验证结果和失败状态

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 评论默认关闭是否等于硬性禁止写入？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

autoComment 默认 false，常规评论需要开启、填写 mentionName 且不处于 only 私信模式；但 bili_reply 接受 force=true 越过该检查后直接调用上游。force 是否对应用户当场授权依调用上下文，不由该布尔值本身证明；章程中不得乱评论等是模型指令，不能当成不可绕过的强制权限。凭据、API 和账号使用应单独核对。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:60-75](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/index.js#L60-L75)

默认关闭及模式。

<details>
<summary>查看原文（16行）</summary>

```text
  /** 自动评论 @ 使用者（默认关 —— 会拿用户的号说话，必须他自己开） */
  autoComment: z.boolean().default(false).extra('volatile', true),
  /** ⭐ 私信投递：off=只发评论（现状）· only=只私信（完全不公开评论）· both=评论 + 私信 */
  dmMode: z.string().default('only').extra('volatile', true),
  /** ⭐ 私信发给谁的 UID（数字）。要在 dmMode 不是 off 时填 */
  dmUid: z.natural().default(0).extra('volatile', true),
  /** 本地转写（没字幕的视频用 Whisper 转；默认关，要下模型） */
  transcribe: z.boolean().default(false).extra('volatile', true),
  /** 本地转写用哪个 Whisper 模型（tiny / base / small / medium） */
  asrModel: z.string().default('small').extra('volatile', true),
  /** ⭐ 每轮最多发几条评论（每条里 @ 一次下面那个人）；**有效范围 0–20，口径见 clampPatch**（0 = 不发评论）
   *  ⚠️ 这里故意**不加 `.max(20)`**：schema 校验不过 ⇒ cordis 拒收这条 entry ⇒ **整条插件不激活** ✗
   *     （跟 schemastery 拿不到时的降级同一个道理）—— 范围一律由 clampPatch 在**写**和**读**两头钳。 */
  commentPerRound: z.natural().default(1).extra('volatile', true),
  /** ⭐ 要 @ 谁（B站 昵称）；**留空 = 不发评论** —— 评论存在的意义就是 @ 那一下 */
  mentionName: z.string().default('').extra('volatile', true),
```

</details>

**依据 2 · 源码核查**：[index.js:741-768](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/index.js#L741-L768)

force 参数越过常规评论守卫。

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[prompts/duty.md:78-84](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/prompts/duty.md#L78-L84)

章程对评论和用户账号的限制。

```text
- ⭐ **要回评论时，先看判重表的「评论记录」** —— 那里记着它自己在哪几个视频发过评论、发了什么；
  ⚠️ **查的范围别太窄**：把判重表里**最近 7 天内自己发过的评论都过一遍**（漏掉一条，那个人就永远收不到回复 ✗）；
  实在太多就按时间**从新到旧**挑最近 **5～8 条**。找不到就跳过，别硬找、别硬凑。
- ⚠️ 真要回的时候：不承诺功能、不争论、不替使用者做决定，不确定就说不确定。
- ⚠️ **不要参与讨论、不要争辩、不要替使用者答问题**。有人问技术问题，就写进报告里，让使用者自己回。
- ⚠️ **同一个视频下不要留第二条评论**（判重表记着）。
- 理由：它发出去的每个字，都算在**使用者本人的账号**上 —— 越界就是替他惹麻烦。
```

#### 缺口

- 未运行 DSH、B站 API、模型或真实账号
  **影响**：不能证明候选质量、实际投递和去重效果
  **进一步探讨**：用隔离账号及只读样本验证结果和失败状态

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 跨宿主锁、去重和预算能否保证不重复？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

run-lock 保存 pid、时间戳并对其他活进程和十分钟 TTL 作检查，但读取与普通写入不是原子排他操作，同时启动或锁过期的长轮次仍可能重叠；不能承诺 exactly-once。章程要求判重表不可读时停止评论，这是提示而非从此段证明的工具硬门槛；日额度有自动和手动计数口径。复核模块明确看不到评论不等于没发出，未知结果先对账而非盲重试。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1731-1765](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/index.js#L1731-L1765)

PID、TTL 和普通读写锁。

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
      if (lock && Number(lock.pid) !== process.pid) {
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
  /** 放锁：只放自己的那张（别把别人的删了） */
  const releaseRunLock = () => {
    try {
      const lock = JSON.parse(readFileSync(runLockFile, 'utf8'))
      if (Number(lock?.pid) === process.pid) writeFileSync(runLockFile, '{"pid":0,"ts":0}', 'utf8')
    } catch { /* 没有锁 / 读不出来 / 写不进去都无所谓，靠 10 分钟过期兜底 */ }
  }

```

</details>

**依据 2 · 源码核查**：[index.js:1206-1213](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/index.js#L1206-L1213)

自动额度与手动额外计数。

```text
    // ⭐ 「每天最多挑 N 条」是**全天**的账：上一轮已经挑过的要扣掉，这一轮只给剩下的额度
    const quota = Math.max(0, Number(cfg.perDay) || 0)
    const manualExtra = Math.max(0, Number(readJson(dutyStateFile, {}).manualExtra || 0))
    // ⭐ 2.3.0：手动轮是「额外的一次」——自动额度只扣自动轮挑的（manualExtra 是手动轮多挑的那部分）
    const already = Math.max(0, countPickedToday() - manualExtra)
    const left = Math.max(0, quota - already)
    const isManual = why === 'manual'
    const manualMax = Math.max(1, Number(cfg.manualMax) || 3)
```

**依据 3 · 源码核查**：[prompts/duty.md:101-106](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/prompts/duty.md#L101-L106)

判重不可读时不评论的指令。

```text
     · ⚠️ 推荐流里也会出现"讲 DSH 的 up 自己发的视频"—— 那是正常的，别因为"这圈我熟"就一律跳过
   - **填了关键词** ⇒ 用 **`bili_search(keyword=…)`** 搜（近 7 天优先），一个词一轮，别一次搜五遍
2. 从结果里挑出**值得的**，条数看设置页的「定量刷（每天几条）」；**判重** —— 已经看过的跳过。
   ⭐ **判重表用 `duty_seen_append(bvid, title, up, status)` 写**（一行一条；路径由工具自己定，你不用管）。
   ⚠️ **如果那份判重表读不出来（不存在 / 打不开）**：**不要当成"没记录过"** —— 那会让同一批视频反复推送、
   重复打扰一批人。正确做法是：**在报告里明写"判重表读不到"**，而且**这一轮不发评论**（宁可少发）。
```

**依据 4 · 源码核查**：[lib/verify.mjs:1-15](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/lib/verify.mjs#L1-L15)

看不到不等于未发出。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * lib/verify.mjs —— 「评论发出后复核」
 * ============================================================================
 * 为什么要有它（2026-10-16，用户 `你的deepseek` 在评论区反馈 + 我们 10/10 亲踩）：
 *   **接口回「发送成功」≠ 公开可见** —— 新号 / 风控会让评论进审核，你自己看不见，
 *   而插件以为发出去了、还把它记进判重表 ⇒ 下一轮不再发 ⇒ **一条都没到人**。
 *   还有更坏的一层：**不公开时连通知都不会推**，于是"@ 了但没人收到"。
 *
 * 复核靠两条只读接口（2026-10-16 实测可行）：
 *   ① **顶层评论**：`/x/v2/reply/main?type=1&oid=<aid>&mode=2&next=0&ps=20`（按时间）
 *      —— 刚发出来的通常在**第一页**；找得到 ⇒ 公开可见（还能顺便读到赞数）。
 *   ② **楼中楼**：`/x/v2/reply/reply?type=1&oid=<aid>&root=<root>&ps=20`
 *      —— 直接按 root 拉那一串，找我们的 rpid。
 *   ⚠️ **看不到 ≠ 没发出**（翻页 / 热度排序都会漏）⇒ 结论一律用"**没查到**"这种说法，
 *      不写成"没发出去"（这是 2026-10-15 那条教训的同一把尺子）。
```

</details>

#### 缺口

- 未运行 DSH、B站 API、模型或真实账号
  **影响**：不能证明候选质量、实际投递和去重效果
  **进一步探讨**：用隔离账号及只读样本验证结果和失败状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、凭据与升级有哪些成本？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

需要兼容 DSH、Python/uv、网络及 B站认证；本地转写另需模型和计算。作者说明 npm 与新版发行渠道可能不同，应以实际工件为准而非假定包名指向本轮源码。ensureHomeFiles 覆盖运行时代码前尝试备份，但复制备份失败被吞掉后仍覆盖；用户修改可能无法从该次备份恢复。先用非敏感只读样本确认来源、凭据存储及资源，再视需要启用公开动作。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-7](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/README.md#L1-L7)

宿主版本和转写空间的作者说明。

```text
# dsh-bili-scroll ｜ 刷B站

> **先看三行**
> - 需要 **dsh ≥ `0.1.7-rc.1`**（本机是 `0.1.7-rc.2`）。⚠️ 版本不满足时，**内核会静默跳过这个插件** —— 装了跟没装一样，不会报错。
> - **空间**：不装「本地转写」约 **84 MB**；装了转写约 **1 GB**（其中 Whisper 模型 538 MB，可在设置里换更小的模型）。
> - 装完**必须重启一次** dsh（插件在 bundle 层组装）。
> - ⚠️ **桌面版 DSH（NEXT / 0.2.x）**：**0.1.3 及以前的版本在桌面版上装不起来** —— 插件整条不激活，
```

**依据 2 · 源码核查**：[README.md:50-62](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/README.md#L50-L62)

作者描述 npm 和发布渠道差异。

<details>
<summary>查看原文（13行）</summary>

````text
> 🔴 **先看这条：npm 上还是旧版（0.1.7），别用 `add dsh-bili-scroll` 装。**
> 我们的 npm 发布账号还在申诉里（工单 4880295），2026-10-17 之后的新版本**只能**从下面两条装。

```bash
# ⭐ 首选：Release 里的 tgz 直链（不需要 git，也不会被 pnpm 拦构建脚本）
dsh plugin --profile web add https://github.com/c1overzz/dsh-bili-scroll/releases/download/v2.0.2/dsh-bili-scroll-2.0.2.tgz

# 备选：git 方式（需要机器上装了 git；pnpm 10 可能拦它的构建脚本）
dsh plugin --profile web add github:c1overzz/dsh-bili-scroll
```

> 连不上 github 的话，在链接前面加镜像：`https://gh-proxy.com/`（实测可用，返回的是同一个文件）。
> 版本号那一节会变，最新的下载地址在 **Releases** 页（`…/releases/latest`）。
````

</details>

**依据 3 · 源码核查**：[lib/state.mjs:90-102](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/lib/state.mjs#L90-L102)

备份失败仍覆盖运行时代码。

<details>
<summary>查看原文（13行）</summary>

```text
      if (onDisk === incoming) { if (!shipped) writeMark(incoming); continue }   // 本来就是同一份
      // ⭐⭐ 2.1.0（2026-10-24 实证）：剩下两种情况的处理可以并成一条 ——
      //    这几个文件是**我们发的运行时代码**（mcp_server.py / asr.py / favops.py），
      //    用户改过也不该拦着升级：否则"宿主新、Python 侧旧"，新工具根本不出现 ✗
      //    （今天就这么栽的：家目录那份停在 11:50，值班轮里说"没有 bili_cover 这个工具"）
      //    ⇒ **先备份 .bak-<时间戳>，再覆盖**，改了什么都能自己捞回来 ✓
      const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
      const bak = to + ".bak-" + stamp
      try { copyFileSync(to, bak) } catch { /* 备份不了也继续，原件在插件包里 */ }
      copyFileSync(from, to)
      writeMark(incoming)
      log(`已覆盖：${to}（旧的那份备份在 ${bak}）`)
    } catch (e) { log(`铺 ${to} 失败：${e?.message ?? e}`) }
```

</details>

#### 缺口

- 未运行 DSH、B站 API、模型或真实账号
  **影响**：不能证明候选质量、实际投递和去重效果
  **进一步探讨**：用隔离账号及只读样本验证结果和失败状态

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样让重复和未知投递更容易识别？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设：给每个拟发送内容关联持久操作标识与回执，并将已确认、未查到和未知分开提示，可减少超时后误重试；现有判重表、评论复核和锁是反证，但服务端若不支持幂等，客户端 ID 本身不能保证恰好一次。对照现有流程模拟并发启动、超时、评论翻页未找到和备份失败，测重复、误报、恢复时间与账号数据暴露；没有改善或引入过度留存则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/verify.mjs:1-15](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/lib/verify.mjs#L1-L15)

现有可见性复核和未知结果。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * lib/verify.mjs —— 「评论发出后复核」
 * ============================================================================
 * 为什么要有它（2026-10-16，用户 `你的deepseek` 在评论区反馈 + 我们 10/10 亲踩）：
 *   **接口回「发送成功」≠ 公开可见** —— 新号 / 风控会让评论进审核，你自己看不见，
 *   而插件以为发出去了、还把它记进判重表 ⇒ 下一轮不再发 ⇒ **一条都没到人**。
 *   还有更坏的一层：**不公开时连通知都不会推**，于是"@ 了但没人收到"。
 *
 * 复核靠两条只读接口（2026-10-16 实测可行）：
 *   ① **顶层评论**：`/x/v2/reply/main?type=1&oid=<aid>&mode=2&next=0&ps=20`（按时间）
 *      —— 刚发出来的通常在**第一页**；找得到 ⇒ 公开可见（还能顺便读到赞数）。
 *   ② **楼中楼**：`/x/v2/reply/reply?type=1&oid=<aid>&root=<root>&ps=20`
 *      —— 直接按 root 拉那一串，找我们的 rpid。
 *   ⚠️ **看不到 ≠ 没发出**（翻页 / 热度排序都会漏）⇒ 结论一律用"**没查到**"这种说法，
 *      不写成"没发出去"（这是 2026-10-15 那条教训的同一把尺子）。
```

</details>

**依据 2 · 源码核查**：[index.js:1731-1765](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/index.js#L1731-L1765)

现有跨宿主尝试锁。

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
      if (lock && Number(lock.pid) !== process.pid) {
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
  /** 放锁：只放自己的那张（别把别人的删了） */
  const releaseRunLock = () => {
    try {
      const lock = JSON.parse(readFileSync(runLockFile, 'utf8'))
      if (Number(lock?.pid) === process.pid) writeFileSync(runLockFile, '{"pid":0,"ts":0}', 'utf8')
    } catch { /* 没有锁 / 读不出来 / 写不进去都无所谓，靠 10 分钟过期兜底 */ }
  }

```

</details>

**依据 3 · 源码核查**：[prompts/duty.md:101-106](https://github.com/c1overzz/dsh-bili-scroll/blob/398e4724a481b09b6383a950bcd08723c632da59/prompts/duty.md#L101-L106)

已有判重及不可读处理指令。

```text
     · ⚠️ 推荐流里也会出现"讲 DSH 的 up 自己发的视频"—— 那是正常的，别因为"这圈我熟"就一律跳过
   - **填了关键词** ⇒ 用 **`bili_search(keyword=…)`** 搜（近 7 天优先），一个词一轮，别一次搜五遍
2. 从结果里挑出**值得的**，条数看设置页的「定量刷（每天几条）」；**判重** —— 已经看过的跳过。
   ⭐ **判重表用 `duty_seen_append(bvid, title, up, status)` 写**（一行一条；路径由工具自己定，你不用管）。
   ⚠️ **如果那份判重表读不出来（不存在 / 打不开）**：**不要当成"没记录过"** —— 那会让同一批视频反复推送、
   重复打扰一批人。正确做法是：**在报告里明写"判重表读不到"**，而且**这一轮不发评论**（宁可少发）。
```

#### 缺口

- 未运行 DSH、B站 API、模型或真实账号
  **影响**：不能证明候选质量、实际投递和去重效果
  **进一步探讨**：用隔离账号及只读样本验证结果和失败状态

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
