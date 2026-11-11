# 主动搭话（Speak Up）

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[541f6c7](https://github.com/Yuuyuko-uu/dsh-speak-up/tree/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c)

<!-- BEGIN META -->
[![GitHub ★ 232](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=232&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yuuyuko-uu/dsh-speak-up) [![npm 30d 17,987](https://img.shields.io/static/v1?label=npm+30d&message=17%2C987&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-speak-up) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-speak-up)
<!-- END META -->

> **功能**：按本地时间和概率选择 DSH 会话，在空闲时触发伙伴主动搭话，并提供试运行日志。

> **亮点**：把本地择时和可审查的演练接到原 agent 的收件链路，让用户能先观察触发理由，再开放普通会话轮次。跟随模式降低换会话时重新勾选的负担。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：跟随目标可以不在手选列表内，事件回调却只用手选列表推进全局冷却；一般用户轮次也可推进它。真正收到回复的会话与冷却账本不能保证对应。[Q03](#research-q03)

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
  - [Q01 · 相比自己发消息或固定提醒，原会话开轮有什么增量？](#detail-section-11)
  - [Q02 · 目标如何选，何时才真正调用宿主？](#detail-section-12)
  - [Q03 · 新的跟随模式是否遵守冷却，后台怎样处理失败？](#detail-section-13)
  - [Q04 · 权限、成本和退出条件如何？](#detail-section-14)
  - [Q05 · 怎样验证同时限制打扰、保留主动对话机会？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常与同一 DSH 伙伴对话、愿意让它在空闲时偶尔先开口的用户，可在设置中选择会话和时间，先看演练记录。

用户可以手工发一句开场，或用日历提醒自己打开对话。提醒不直接在既有会话投递，手工触发则保留每次发起的控制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 定时择时 | 按时段、活跃与随机规则安排搭话 | 默认演练且目标为空，归档或忙碌会话跳过 |
| 原会话投递 | 复用现有 agent 创建普通轮次 | 真发继承该会话的工具和模型环境 |
| 可见日志 | 观察候选、命中和投递异常 | 进程重启后内存日志不保留 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| Node 与 DSH | 加载 Cordis 补丁和 Web 槽位 | Node ≥ 22，DSH ≥ 0.2.1-rc.2 是包声明 |
| 活动会话与宿主服务 | 选择目标、定时、投递、尝试落盘 | 无活 agent 跳过；跟随排序取决于宿主时间戳 |
| 目标会话预算与权限 | 真发开普通轮次 | 应核对工具权限；峰谷规则只改变命中线 |

| 阶段 | 操作 | 异常处理 |
| --- | --- | --- |
| 首次 | 重启隔离宿主，只勾选一个无敏感工具的会话，保持试运行 | 查日志里的归档、忙碌和目标缺失 |
| 持续 | 观察安静时段、候选与命中，真发前核对预算与目标 | 出现普通回复耗冷却或跟随漏冷却则保持观察 |
| 退出 | 关总开关，停用，重启并核查在飞会话和本地配置 | 卸载与配置清理分别验证，保留必要备份 |

**效果与成本**

| 成本 | 单位或责任 | 边界 |
| --- | --- | --- |
| 现金和模型 | 按得到合格搭话的真实轮次计普通会话 token | 演练只做本地规则；真实工具和模型费用未测 |
| 人工时间 | 设置目标、查看日志、核查误投和修复配置 | 用户承担；跟随省勾选可能换来额外核查 |
| 退出 | 停止自动，核对已投递会话和配置 | 用时未测，停计时器不能撤回已经送达的消息 |

| 效果 | 观察口径 | 边界 |
| --- | --- | --- |
| 少做手动开场 | 每个合格搭话所需用户操作次数 | 需要出现预期会话的可见回复 |
| 减少打扰 | 禁止时段、错误目标、重复或漏掉的投递数 | 跟随冷却已见结构性缺口 |

> **思考**：跟随目标可以不在手选列表内，事件回调却只用手选列表推进全局冷却；一般用户轮次也可推进它。真正收到回复的会话与冷却账本不能保证对应。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把本地择时和可审查的演练接到原 agent 的收件链路，让用户能先观察触发理由，再开放普通会话轮次。跟随模式降低换会话时重新勾选的负担。[Q01](#research-q01) [Q02](#research-q02)

自动、手动演练与真发共用候选逻辑，await followup 并捕获拒绝，区分了投递错误与落盘未确认。内存状态和缺少在飞占用意味着重启及并发不具去重保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

跟随目标可以不在手选列表内，事件回调却只用手选列表推进全局冷却；一般用户轮次也可推进它。真正收到回复的会话与冷却账本不能保证对应。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

当前先观察。在独立会话保持演练并查目标日志，关闭跟随，验明宿主访问控制后再决定是否做一次可控真发。若出现冷却漏记、错投或无法限制工具权限，停自动并沿用手工开场。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持定时择时、演练和宿主投递。跟随模式与冷却列表不一致可直接从分支推出；真实投递频率、工具副作用和用户打扰尚未测试。按目标确认回复是假设。

- 已检查：作者 README、包清单、源码路径 lib/host.js、package.json、cordis.patch.yml、lib/selfupdate.mjs、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：覆盖包入口、关键调度、会话筛选、事件、路由和更新模块源码；没有执行宿主、插件或目标测试。
- 下一步：隔离宿主先测浏览器跨站和本地非管理者拒绝，再使用记录消息的假 agent 回放空手选列表的跟随、普通回答和重叠触发，对比合格回复、重复及误耗冷却。

**分析版本**

- **仓库**：[Yuuyuko-uu/dsh-speak-up](https://github.com/Yuuyuko-uu/dsh-speak-up)
- **版本号**：0.3.1（[固定提交 541f6c7](https://github.com/Yuuyuko-uu/dsh-speak-up/tree/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按目标占用并关联触发消息与实际回复，可能同时降低重复投递和被普通回复误耗的冷却机会。若模拟重叠滴答、切换目标与重启后，两类错误未减少或漏掉同样多的合格机会，就保留原规则。[Q05](#research-q05)

隔离宿主先测浏览器跨站和本地非管理者拒绝，再使用记录消息的假 agent 回放空手选列表的跟随、普通回答和重叠触发，对比合格回复、重复及误耗冷却。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 511 | — | — | 7362 |
| .js | source | 2 | 2137 | 1485 | 540 | — |
| .mjs | source | 1 | 234 | 192 | 32 | — |
| .mjs | test | 2 | 1024 | 807 | 139 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-speak-up/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-speak-up/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-speak-up/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地择时后在原 DSH 伙伴会话开轮，能否减少手工触发，又能否控制误投、打扰和工具副作用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比自己发消息或固定提醒，原会话开轮有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

长期保留 DSH 伙伴会话、希望它偶尔自行起话头的用户，可以预先设定会话与时间条件，并让助手在已有会话中回应一段标记为 speak-up 的触发文本。手工发消息总能让用户决定何时开始，固定通知能在同一时刻提醒，但都没有本插件的按目标状态择时及干跑日志。合格的一次搭话应落在预期会话、避开禁止时段，并产生用户可见且符合语境的回复。定时器命中或 followup 返回不足以满足这个定义。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-13](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/README.md#L1-L13)

作者定义空闲主动搭话与本地骰子的使用场景。

<details>
<summary>查看原文（13行）</summary>

````text
# dsh-speak-up（主动搭话）· 让它自己先开口

给 DSH 里某个会话装一颗「会自己起话头」的心：**没人在跟它说话的时候，它也有可能先开口。**

```
定时器到点
  └─ 掷一次本地骰子（Math.random，一个 token 都不花）
       ├─ 没掷中 → 什么都不做，只留一条记录
       └─ 掷中   → 往「目标会话」送一句话 → agent.followup(message)
                    → DSH 自己开一轮：它的人格、历史、工具、记忆全都照旧
```

一句话：**只有掷中之后的那一步才花模型**，掷骰子本身是纯本地随机。
````

</details>

**依据 2 · 源码核查**：[lib/host.js:99-115](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L99-L115)

默认演练，默认无目标且不跟随。

<details>
<summary>查看原文（17行）</summary>

```text
const 默认配置 = {
  总开关: true, // 关掉就完全不动
  试运行: true, // **默认开着**：掷中了也只记账、不真发（先看几轮再关掉它）
  跟随模式: false, // ⭐ 1.3.3（issue #9）：true = 不勾了，自己找她最近在说话的那一间
  目标会话: [], // 勾了哪些会话（**数组**，可以勾多个）；掷中一次只在其中一个里开口
  间隔分钟: 30, // 多久掷一次骰子
  // ---- 峰谷分时：贵的时候少开口，便宜的时候多开口 ----
  // ⚠⚠ 峰谷**时段是固定的，不给她填**（周一到周五 9:00~12:00、14:00~18:00 是峰时，
  //    其余全是谷时）。她要填的只有下面这两个数。
  // ⚠ 这两个数**不是"概率"**（她纠正过：叫概率就不对了）—— 它们是**基础命中线**：
  //    每轮掷一个 0~100 的数，**掷到命中线以下才开口**，掷在上面就不开。
  //    最终命中线 = 这一格 × 时机因子 + 攒下来的没中加成（最后夹 0~100）。
  //    判断在 判峰时() 里写死，见那个函数的注释。
  峰时命中线: 20, // 峰时（贵）→ 命中线低一点、少开口
  谷时命中线: 60, // 谷时（便宜）→ 命中线高一点、多开口
  // ⭐ 2026-10-26（issue #4）：峰谷是**北京时间**算的。海外机器的本地时间对不上，
  //   填个 IANA 时区名（例如 Asia/Shanghai）就按那个时区判；留空 = 跟本机时区。
```

</details>

**依据 3 · 源码核查**：[lib/host.js:843-875](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L843-L875)

自动或手动可以演练，真发调用原 agent 并尝试落盘。

<details>
<summary>查看原文（33行）</summary>

```text
    if (配置.角色 === 'developer') {
      // 不是「没实现」，是**当前 DSH 版本上做不到**（见文件头注释的三条证据）。
      // 在这里主动拦下来，是为了不去污染她的会话日志（真发出去会让那一轮 turn 直接 error）。
      return 记账(`${前缀}角色填的是 developer，但当前 DSH 送不了 developer 角色（详见 README「做不到的地方」），这轮**主动不发**`)
    }

    if (演练) {
      return 记账(`${前缀}演练：本来要往「${目标id}」送一句「${框住内心话(配置.触发文案, 现在).split(String.fromCharCode(10)).join(' ')}」`)
    }

    const 文案 = 框住内心话(配置.触发文案, 现在)
    try {
      const 工厂 = await 拿造消息工厂()
      const 消息 = 工厂
        ? 工厂.createUserMessage({ content: [{ type: 'text', text: 文案 }], source: { kind: 源标记 } })
        : 手搓用户消息(文案)
      // ⚠⚠ 必须 await：followup 返回的是 Promise，不接住的话——
      //   它一旦 reject（会话正忙 / agent 已释放 / 流出错），就是**未处理的 rejection**，
      //   Node 22+ 默认当致命错误处理 ⇒ **整个 DSH 宿主进程退出**（2026-10-21 有用户报"装了鱼就死了"）
      await agent.followup(消息)
      // ⭐ 0.2.9（issue #8 前半段）：这里**不再**记「自己上次开口」。
      //   投递只是把一句念头塞进她的会话，她完全可以看完选择不说
      //   （真机上就发生过：投递成功、这一轮 1 秒结束、一个字没发，却照样吃掉了整个冷却）。
      //   现在改成「真的出现一条有正文的 assistant 消息」才算开口 —— 见 记她说话()。
      记账(`${前缀}已送出一句，DSH 会照常开一轮：「${文案}」`)
      // 让这一条先落到磁盘上，掉电也不会丢（拿不到 sessions 服务就算了）
      try {
        if (ctx.sessions && typeof ctx.sessions.flush === 'function') await ctx.sessions.flush(agent.session)
      } catch (error) {
        记账(`（提示：落盘没确认：${String((error && error.message) || error)}）`)
      }
    } catch (error) {
      记账(`followup 失败：${String((error && error.message) || error)}`)
```

</details>

#### 缺口

- 没有用户对打扰和自然度的同条件反馈
  **影响**：只能确定动作与人工触发的差异
  **进一步探讨**：用同一非敏感会话对照人工发起、固定提醒和演练规则

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目标如何选，何时才真正调用宿主？

**研究主题**：功能与机制

#### 完整回答

Cordis 包接线启动宿主后，以配置间隔挂定时器。自动先查总开关和机器本地安静时段，默认从手选目标中剔除已归档、无活 agent 和忙碌项，只挑一个。跟随模式改用 agents.list，筛归档与状态后按会话时间戳降序，取首项再走可用性筛选。时间戳取可用字段，否则为 0，源码函数没有注释所说的文件 mtime 兜底，所以最近活跃依赖宿主数据。过冷却后，命中线由峰谷基线、最近发话时机因子和连续未中补偿组成。未中不调用模型，演练命中只记账；真发把经文字包装的内心话放进 role=user 消息，await agent.followup，再尽力 flush。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:5-7](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/cordis.patch.yml#L5-L7)

确认 Host 实际加载入口。

```text
- insert:
    - id: speak-up
      name: 'dsh-speak-up'
```

**依据 2 · 源码核查**：[lib/host.js:486-515](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L486-L515)

归档列表有磁盘兜底，最近活跃取时间戳字段，无 mtime 回退。

<details>
<summary>查看原文（30行）</summary>

```text
function 归档名单(ctx) {
  const 出 = new Set()
  try {
    const 登记 = ctx.workspaceRegistry || ctx.get('workspaceRegistry')
    const ids = 登记 && 登记.archivedSessionIds
    if (Array.isArray(ids)) {
      for (const x of ids) 出.add(会话键(x))
      return 出
    }
  } catch (error) {}
  try {
    const j = JSON.parse(readFileSync(join(目录, 'storages', 'workspace.json'), 'utf8'))
    const ids = j && j.global && j.global.archivedSessionIds
    if (Array.isArray(ids)) for (const x of ids) 出.add(会话键(x))
  } catch (error) {}
  return 出
}

/** 最近活跃：会话服务上的时间戳优先，拿不到就看会话文件 mtime。 */
function 最近活跃(ctx, id) {
  try {
    const 服务 = ctx.get('sessions')
    const 会话 = 服务 && typeof 服务.get === 'function' ? 服务.get(id) : undefined
    for (const 键 of ['updatedAt', 'lastActiveAt', 'lastMessageAt', 'createdAt']) {
      const 值 = 会话 && 会话[键]
      const 数 = typeof 值 === 'number' ? 值 : Date.parse(String(值 || ''))
      if (Number.isFinite(数) && 数 > 0) return 数
    }
  } catch (error) {}
  return 0
```

</details>

**依据 3 · 源码核查**：[lib/host.js:730-788](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L730-L788)

目标在骰子前选择并筛选；空目标不唤醒。

<details>
<summary>查看原文（59行）</summary>

```text
    if (模式 === '自动' && !配置.总开关) return 记账('总开关是关着的，这轮不动')
    if (模式 === '自动') {
      const 小时 = 现在.getHours()
      if (在安静时段(小时, 配置.安静起, 配置.安静止)) {
        return 记账(`现在 ${小时} 点在安静时段（${配置.安静起}~${配置.安静止}）里，这轮不掷`)
      }
    }

    // ⭐ 1.3.3（issue #9）：「跟随最近活跃」模式 —— 不用勾，自己找她最近在说话的那一间
    let 候选ids = Array.isArray(配置.目标会话) ? 配置.目标会话.slice() : []
    if (配置.跟随模式) {
      const 归档的0 = 归档名单(ctx)
      const 活的 = []
      try {
        for (const a of ctx.agents.list() || []) {
          const id = a && (a.id || (a.session && a.session.id))
          if (!id) continue
          if (归档的0.has(会话键(id))) continue
          if (a.status !== undefined && a.status !== 'idle') continue
          活的.push({ id: String(id), 时: 最近活跃(ctx, String(id)) })
        }
      } catch (error) {}
      if (!活的.length) return 记账('跟随最近活跃：现在没有活着的会话，这轮什么都不做')
      活的.sort((x, y) => y.时 - x.时)
      候选ids = [活的[0].id]
      记账('跟随最近活跃：这次选 ' + 短id(活的[0].id))
    }
    if (候选ids.length === 0) return 记账('还没勾「目标会话」，什么都不做（去设置里勾一个，或者打开「跟随最近活跃」）')

    // 勾了好几个时：**这次只在其中一个里开口**（随机挑一个活着又不忙的）。
    // 为什么不全都发：一次掷中就往每个会话里说一句，等于同时开好几轮、同时烧好几份 token，
    // 而且「她」听起来像分身。挑一个最像真人（她只在一个地方说话）。
    const 可用 = []
    const 不可用 = []
    // ⭐ 已归档的会话不参与（归档只是藏起来，agent 可能还在；往里塞话等于往废纸篓里说）
    const 归档的 = 归档名单(ctx)
    for (const id of 候选ids) {
      if (归档的.has(会话键(id))) {
        不可用.push(`${短id(id)}(已归档)`)
        continue
      }
      const a = 找agent(ctx, id)
      if (a === undefined) {
        不可用.push(`${短id(id)}(没活着)`)
        continue
      }
      const 状态 = a.status
      if (状态 !== undefined && 状态 !== 'idle') {
        不可用.push(`${短id(id)}(忙)`)
        continue
      }
      可用.push({ id, agent: a })
    }
    if (可用.length === 0) {
      return 记账(
        `勾的目标会话现在都不能说话（${不可用.join('、') || '（空）'}）—— 按设计**不自动唤醒**，这轮什么都不做`,
      )
    }
    const 挑中 = 可用[Math.floor(Math.random() * 可用.length)]
```

</details>

**依据 4 · 源码核查**：[lib/host.js:793-850](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L793-L850)

自动冷却、随机、演练与手动模式分叉。

<details>
<summary>查看原文（58行）</summary>

```text
    // 「主动搭话」之后的冷却（单独一格配置；跟"她多久没说话"那两个阈值是两回事）。
    // ⚠ 0 = 不冷却：刚开口过也照投。
    if (模式 === '自动' && 配置.搭话冷却分钟 > 0 && 自己上次开口 !== 0) {
      const 冷却 = (Date.now() - 自己上次开口) / 60000
      if (冷却 < 配置.搭话冷却分钟) {
        return 记账(`自己刚开过口（${冷却.toFixed(1)} 分钟前，冷却 ${配置.搭话冷却分钟} 分钟），这轮不重复`)
      }
    }

    // ⚠ 下面这段只给**自动**那一轮用（手动按钮不掷骰子，也不许动「连没中」计数器）。
    //   口径是她定的：**先说最终答案（命中线），再说怎么来的**，最后说副作用（清零 / 下次变多少）。
    let 前缀 = ''
    if (模式 === '自动') {
      // ⚠ 一次掷骰**只取一次"现在"**，然后一路传下去：安静时段、峰谷判档、记账都用它，
      //   免得刚好在边界上（比如 12:00:00）时，判档和记账说的不是同一档。
      const 现在 = new Date()
      const 算 = await 算这次命中线(配置, 目标id, 现在)
      const 线 = 算.线
      const 线文 = 线.toFixed(1)
      const 距离 = 算.分钟 === undefined ? '距上次说话时间不明' : `距上次说话 ${算.分钟.toFixed(1)} 分钟`
      const 等式 = 命中线等式(线, 算.短语, 算.因子, 距离, 算.加成)
      const 掷值 = Math.random() * 100

      if (掷值 >= 线) {
        // —— 没掷中：攒一次加成 ——
        连没中 += 1
        // 「下次」是同一条公式、喂进新的 连没中（跟算这一轮用的是同一个函数，免得两处写法漂移）
        const 下次线 = 算命中线(算.基础命中线, 算.因子, 连没中, 配置.没中加成, 配置.加成上限).线.toFixed(1)
        const 下次语 =
          配置.没中加成 === 0
            ? `下次命中线还是 ${下次线}（没中加成关着）`
            : `下次命中线变 ${下次线}（没中加成 +${配置.没中加成}）`
        return 记账(
          `没掷中 ✗ 掷出 ${掷值.toFixed(1)}（命中线 ${线文} —— 要掷到 ${线文} 以下才开口）｜${等式}｜${下次语}`,
        )
      }

      // —— 掷中（含试运行掷中）：清零，回到一开始 ——
      const 之前连没中 = 连没中
      连没中 = 0
      const 清零语 =
        之前连没中 > 0
          ? `没中加成清零（之前连着 ${之前连没中} 次没中）`
          : '没中加成本来就是 0（还没攒过）'
      前缀 = `掷中 ✓ 掷出 ${掷值.toFixed(1)}（命中线 ${线文} —— 掷到 ${线文} 以下就开口）｜${等式}｜${清零语}｜${挑的说法}`
    } else {
      // 手动按钮：不掷骰子、不动「连没中」计数器（她只让自动那一轮动它）
      前缀 = `【${来源}/${模式}】手动触发（不掷骰子、不动没中加成）｜${挑的说法}`
    }

    if (配置.角色 === 'developer') {
      // 不是「没实现」，是**当前 DSH 版本上做不到**（见文件头注释的三条证据）。
      // 在这里主动拦下来，是为了不去污染她的会话日志（真发出去会让那一轮 turn 直接 error）。
      return 记账(`${前缀}角色填的是 developer，但当前 DSH 送不了 developer 角色（详见 README「做不到的地方」），这轮**主动不发**`)
    }

    if (演练) {
      return 记账(`${前缀}演练：本来要往「${目标id}」送一句「${框住内心话(配置.触发文案, 现在).split(String.fromCharCode(10)).join(' ')}」`)
```

</details>

**依据 5 · 源码核查**：[lib/host.js:853-875](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L853-L875)

按宿主用户消息工厂或本地构造，再等待 followup 并尽力落盘。

<details>
<summary>查看原文（23行）</summary>

```text
    const 文案 = 框住内心话(配置.触发文案, 现在)
    try {
      const 工厂 = await 拿造消息工厂()
      const 消息 = 工厂
        ? 工厂.createUserMessage({ content: [{ type: 'text', text: 文案 }], source: { kind: 源标记 } })
        : 手搓用户消息(文案)
      // ⚠⚠ 必须 await：followup 返回的是 Promise，不接住的话——
      //   它一旦 reject（会话正忙 / agent 已释放 / 流出错），就是**未处理的 rejection**，
      //   Node 22+ 默认当致命错误处理 ⇒ **整个 DSH 宿主进程退出**（2026-10-21 有用户报"装了鱼就死了"）
      await agent.followup(消息)
      // ⭐ 0.2.9（issue #8 前半段）：这里**不再**记「自己上次开口」。
      //   投递只是把一句念头塞进她的会话，她完全可以看完选择不说
      //   （真机上就发生过：投递成功、这一轮 1 秒结束、一个字没发，却照样吃掉了整个冷却）。
      //   现在改成「真的出现一条有正文的 assistant 消息」才算开口 —— 见 记她说话()。
      记账(`${前缀}已送出一句，DSH 会照常开一轮：「${文案}」`)
      // 让这一条先落到磁盘上，掉电也不会丢（拿不到 sessions 服务就算了）
      try {
        if (ctx.sessions && typeof ctx.sessions.flush === 'function') await ctx.sessions.flush(agent.session)
      } catch (error) {
        记账(`（提示：落盘没确认：${String((error && error.message) || error)}）`)
      }
    } catch (error) {
      记账(`followup 失败：${String((error && error.message) || error)}`)
```

</details>

#### 缺口

- 不同宿主的会话时间字段、状态和历史 API 返回未核验
  **影响**：跟随排序可能大量并列，也不能确定最近用户发言就是所选目标
  **进一步探讨**：在可控宿主对照两个会话的真实事件时间、列表状态和最终目标

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 新的跟随模式是否遵守冷却，后台怎样处理失败？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

自动冷却用一个全局最近开口时间。事件回调只要见到有正文的 assistant/message 且会话在配置的手选目标里，就更新时间；这里既没有关联触发消息，也没有检查跟随模式实际选了谁。只打开跟随且手选列表为空时，即使所选会话真实回复也不会更新冷却；反过来，手选目标因用户普通提问而回答也能消耗全局冷却。这能从两个条件直接推出，尚未测量真实打扰。定时器以 void 启动异步任务，下一次滴答和手动按钮可在前一轮尚未结束时进入同一逻辑；有 catch 保住宿主，但源码没有每目标预占或去重。连续未中、日志和冷却时间存在进程内存，重启后重置。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:619-648](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L619-L648)

时机和连没中、日志为执行体内存状态。

<details>
<summary>查看原文（30行）</summary>

```text
  /** sid -> 她上次说话的时间（ms）。只看 user/message 且来源不是我们自己。 */
  const 她上次说话 = new Map()
  /** 已经翻过历史日志的 sid（翻一次就够了，别每轮都翻）。 */
  const 翻过历史 = new Set()
  /**
   * 我们自己上次开口的时间（ms），用来做冷却，避免自己跟自己聊起来。
   * ⭐ 0.2.9（issue #8）：这个时间点从「**投递成功**」改成「**她真的说出话**」——
   *   设置页那格写的是「她刚自己开过口之后」，投递只是把一句念头塞进会话，她可以看完不说。
   *   见 记她说话() 里 assistant/message 那段。
   */
  let 自己上次开口 = 0

  /**
   * 连着几次没掷中（攒加成的计数器）。
   * ⚠ 只放在内存里：DSH 一重启就回到 0（设置页上写了这一点）。
   * ⚠ 只有**自动**那一轮会动它：没中 +1、中了（含试运行掷中）归零。
   *   手动按钮（演练/真发）不掷骰子，**不许碰它**。
   */
  let 连没中 = 0

  /** 当前表上的间隔（分钟）；配置改了要在下一次滴答后换表。 */
  let 表上的间隔 = null
  /** 停表的把手。 */
  let 停表 = null

  function 记账(文本) {
    const 条 = { 时间: 现在显示(), 文本: String(文本) }
    日志.push(条)
    if (日志.length > 日志上限) 日志.shift()
    try {
```

</details>

**依据 2 · 源码核查**：[lib/host.js:738-756](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L738-L756)

跟随目标直接替换候选列表。

<details>
<summary>查看原文（19行）</summary>

```text
    // ⭐ 1.3.3（issue #9）：「跟随最近活跃」模式 —— 不用勾，自己找她最近在说话的那一间
    let 候选ids = Array.isArray(配置.目标会话) ? 配置.目标会话.slice() : []
    if (配置.跟随模式) {
      const 归档的0 = 归档名单(ctx)
      const 活的 = []
      try {
        for (const a of ctx.agents.list() || []) {
          const id = a && (a.id || (a.session && a.session.id))
          if (!id) continue
          if (归档的0.has(会话键(id))) continue
          if (a.status !== undefined && a.status !== 'idle') continue
          活的.push({ id: String(id), 时: 最近活跃(ctx, String(id)) })
        }
      } catch (error) {}
      if (!活的.length) return 记账('跟随最近活跃：现在没有活着的会话，这轮什么都不做')
      活的.sort((x, y) => y.时 - x.时)
      候选ids = [活的[0].id]
      记账('跟随最近活跃：这次选 ' + 短id(活的[0].id))
    }
```

</details>

**依据 3 · 源码核查**：[lib/host.js:793-800](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L793-L800)

自动分支用执行体全局的冷却时间。

```text
    // 「主动搭话」之后的冷却（单独一格配置；跟"她多久没说话"那两个阈值是两回事）。
    // ⚠ 0 = 不冷却：刚开口过也照投。
    if (模式 === '自动' && 配置.搭话冷却分钟 > 0 && 自己上次开口 !== 0) {
      const 冷却 = (Date.now() - 自己上次开口) / 60000
      if (冷却 < 配置.搭话冷却分钟) {
        return 记账(`自己刚开过口（${冷却.toFixed(1)} 分钟前，冷却 ${配置.搭话冷却分钟} 分钟），这轮不重复`)
      }
    }
```

**依据 4 · 源码核查**：[lib/host.js:942-957](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L942-L957)

任何在手选目标中的非空助理消息都可更新该时间。

<details>
<summary>查看原文（16行）</summary>

```text
    记她说话(session, event) {
      if (!event) return
      if (event.type === 'user/message') {
        const 来源 = event.data && event.data.source
        if (来源 && 来源.kind === 源标记) return
        她上次说话.set(String(session.id), event.time)
        return
      }
      // ⭐ 0.2.9（issue #8 前半段）：冷却只认「她**真的说了话**」。
      //   · assistant/message 里没有非空 text 块（只想了、只调了工具）→ 不算
      //   · 不是勾着的目标会话（别的会话、子代理）→ 也不算
      if (event.type !== 'assistant/message') return
      if (!说了话(event.data && event.data.message)) return
      const sid = String(session.id)
      if (!读配置().目标会话.some((id) => 会话键(id) === 会话键(sid))) return
      自己上次开口 = event.time
```

</details>

**依据 5 · 源码核查**：[lib/host.js:879-909](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L879-L909)

定时异步链捕获失败，但没有等待上一轮的并发门。

<details>
<summary>查看原文（31行）</summary>

```text
  /** 换表：先把旧表停掉，再按新的间隔上一块。间隔为 null 表示不上表。 */
  function 换表(间隔分钟) {
    if (停表 !== null) {
      try {
        停表()
      } catch (error) {
        // 停表失败也无所谓：表本身会在插件卸载时被 Cordis 收走
      }
      停表 = null
    }
    if (间隔分钟 === null) return
    if (typeof ctx.interval !== 'function') {
      记账('拿不到 timer 服务（ctx.interval 不在），定时掷骰不会跑 —— 但设置页和手动手动按钮还能用')
      return
    }
    表上的间隔 = 间隔分钟
    停表 = ctx.interval(() => {
      void 掷一次('定时', '自动')
        .catch((error) => 记账(`这一轮出错：${String((error && error.message) || error)}`))
        .finally(() => {
          // 设置里改了间隔 → 下一轮按新间隔走（这样从设置页改完不用重启插件）
          try {
            const 现在间隔 = 读配置().间隔分钟
            if (现在间隔 !== 表上的间隔) 换表(现在间隔)
          } catch (error) {
            // ⚠ finally 里再抛出会变成"未处理的 rejection"，等于把宿主带走 —— 这里必须吞掉
            记账(`换间隔时出错（已忽略）：${String((error && error.message) || error)}`)
          }
        })
        .catch(() => {})   // 最后一道兜底：这条链绝不许漏出未处理的 rejection
    }, 间隔分钟 * 60 * 1000)
```

</details>

#### 缺口

- 尚无重启、重叠滴答或用户回合交错的同版本实测
  **影响**：无法给重复投递和错过时机的频率
  **进一步探讨**：以假的 followup 延迟和两种来源的助理事件检查冷却、重复与跳过日志

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 权限、成本和退出条件如何？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包声明 Node 22、DSH 0.2.1-rc.2 及 Web 设置槽位。已运行的目标 agent 才能收到消息；真发继承目标会话能力，应先使用不配置敏感工具的独立会话。默认演练和未命中为本地日志，没有独立模型请求；真发可能消耗普通轮次 token 并触发工具，固定峰谷规则不能推断供应商费率。动作路由要求 POST，连接拒绝会终止，浏览器跨站与非本机 Origin 另有拦截；没有来源的调用能过这层判断，实际网络暴露依赖宿主。先观察，尤其在跟随模式修正或限定前保留默认演练。退出时关总开关、停用并核对在飞回合，备份配置文件；手动真发并不受总开关和演练设置保护。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:5-49](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/package.json#L5-L49)

声明最低版本、宿主导出和 Web 槽位。

<details>
<summary>查看原文（45行）</summary>

```text
  "license": "SEE LICENSE IN LICENSE",
  "type": "module",
  "engines": {
    "node": ">=22",
    "dsh": ">=0.2.1-rc.2"
  },
  "keywords": [
    "deepseek-harness",
    "dsh-plugin",
    "initiative",
    "proactive",
    "ai-companion"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Yuuyuko-uu/dsh-speak-up.git"
  },
  "main": "lib/host.js",
  "exports": {
    ".": "./lib/host.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "tests",
    "cordis.patch.yml",
    "README.md",
    "CHANGELOG.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "slots"
      ],
      "external": [
        "react"
      ]
    }
```

</details>

**依据 2 · 源码核查**：[lib/host.js:245-276](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L245-L276)

配置读取回退及直接写文件。

<details>
<summary>查看原文（32行）</summary>

```text
function 读配置() {
  // 新文件优先；没有就退回旧文件（改名搬家）；都没有才回默认值。
  // 一律不抛错 —— 设置页要能打开才有救。
  for (const 路径 of [配置文件, 旧配置文件]) {
    try {
      // Windows 编辑器可能在 UTF-8 JSON 开头写 BOM；只去掉文件头，保留正文里的同字符。
      const 原始 = JSON.parse(readFileSync(路径, 'utf8').replace(/^\uFEFF/, ''))
      const 净 = 归一化(原始)
      // ⭐ 2026-10-23：磁盘上要是存着「同一会话两种写法」，顺手把它洗干净写回去，
      //   不用用户自己去改 JSON（用户报的就是这个：勾不掉、只能手改文件）。
      try {
        const 旧 = Array.isArray(原始 && 原始.目标会话) ? 原始.目标会话 : null
        if (路径 === 配置文件 && 旧 && JSON.stringify(旧) !== JSON.stringify(净.目标会话)) {
          写配置(净)
        }
      } catch (error) {}
      return 净
    } catch (error) {
      /* 读不到 / 读坏了 → 试下一个 */
    }
  }
  return 归一化(null)
}

function 写配置(配置) {
  try {
    mkdirSync(目录, { recursive: true })
    writeFileSync(配置文件, JSON.stringify(配置, null, 2), 'utf8')
    return true
  } catch (error) {
    return false
  }
```

</details>

**依据 3 · 源码核查**：[lib/host.js:1132-1175](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L1132-L1175)

守卫与动作 POST 限制，缺来源头可能继续。

<details>
<summary>查看原文（44行）</summary>

```text
  const 本机来源 = /^(?:dsh-app:|https?:\/\/(?:127\.0\.0\.1|localhost|\[::1\])(?::\d+)?\/?$)/i
  const 拦住 = (req, res) => {
    let 拒
    try {
      const 连接 = ctx.get && ctx.get('connection')
      拒 = 连接 && typeof 连接.requestRejection === 'function' ? 连接.requestRejection(req) : undefined
    } catch (error) {
      拒 = undefined
    }
    if (拒 !== undefined) {
      res.writeHead(拒 || 403, { 'content-type': 'text/plain; charset=utf-8' })
      res.end(拒 === 401 ? 'unauthorized' : 'forbidden')
      return true
    }
    const 头 = req.headers || {}
    const 站 = String(头['sec-fetch-site'] || '').toLowerCase()
    const 源 = String(头.origin || '').trim()
    if (站 === 'cross-site' || (源 && !本机来源.test(源))) {
      res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('forbidden')
      return true
    }
    return false
  }

  const 路线 = (路径, handler, 选项) =>
    ctx.effect(() =>
      ctx.webServer.register({
        kind: 'exact',
        path: 路径,
        handler: async (req, res) => {
          try {
            if (拦住(req, res)) return
            if (选项 && 选项.只收POST && req.method !== 'POST') {
              res.writeHead(405, { 'content-type': 'application/json; charset=utf-8', allow: 'POST' })
              res.end(JSON.stringify({ ok: false, 说: '这条只接受 POST' }))
              return
            }
            await handler(req, res)
          } catch (error) {
            回(res, { ok: false, 说: String((error && error.message) || error) })
          }
        },
      }),
```

</details>

**依据 4 · 源码核查**：[lib/host.js:1181-1184](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L1181-L1184)

安装与检查更新也传入同一道守卫。

```text
  createSelfUpdate({
    packageRoot: join(dirname(fileURLToPath(import.meta.url)), '..'),
    diag: (m) => { try { ctx.logger.info('speak-up 查更新: ' + m) } catch (e) { /* logger 不在就算了 */ } },
  }).register(ctx, 路由前缀, 拦住)
```

**依据 5 · 源码核查**：[lib/host.js:1370-1376](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L1370-L1376)

手动真发显式入口，调用完成不证明助理发话。

```text
  // 掷一次：演练 / 真发。**这里和定时器走的是同一段逻辑**，不是另写一份。
  路线(`${路由前缀}/roll`, async (req, res) => {
    const 来 = await 读体(req)
    const 模式 = 来 && 来.模式 === '真发' ? '真发' : '演练'
    await 体.掷一次('手动', 模式)
    回(res, { ok: true, 说: 模式 === '真发' ? '已按真发跑了一次（结果看下面的记录）' : '已演练一次（没有真发）', 日志: 体.日志 })
  }, { 只收POST: true })
```

**依据 6 · 源码核查**：[lib/host.js:723-735](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L723-L735)

仅自动路径受总开关和安静时段约束。

<details>
<summary>查看原文（13行）</summary>

```text
  async function 掷一次(来源, 模式) {
    const 配置 = 读配置()
    const 演练 = 模式 === '演练' || (模式 === '自动' && 配置.试运行)
    // ⚠ 整轮**只取一次"现在"**（安静时段、峰谷判档、记账都用它）——
    //   免得刚好压在边界上（比如 12:00:00）时，判档和记账说的不是同一档。
    const 现在 = new Date()

    if (模式 === '自动' && !配置.总开关) return 记账('总开关是关着的，这轮不动')
    if (模式 === '自动') {
      const 小时 = 现在.getHours()
      if (在安静时段(小时, 配置.安静起, 配置.安静止)) {
        return 记账(`现在 ${小时} 点在安静时段（${配置.安静起}~${配置.安静止}）里，这轮不掷`)
      }
```

</details>

#### 缺口

- 宿主连接拒绝、工具可用范围和实际预算未核验
  **影响**：不能判断隔离之外的运行风险
  **进一步探讨**：先在夹具确认未授权 POST 拒绝，并核对目标工具权限，采集一轮预算与会话事件

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证同时限制打扰、保留主动对话机会？

**研究主题**：新假设与验证

#### 完整回答

可把候选会话及触发消息 ID 写入投递记录，等待匹配的宿主回复后只推进该目标的冷却，并为在飞轮次设置每目标占用。相对目前全局且靠手选列表更新的冷却，假设可以减少跟随误重复，也避免普通答复无故消耗主动预算。先用固定事件序列对照原规则与新规则，覆盖空手选列表、切换最近目标、用户普通对话、无正文和重启。若误重复没有降低，或未投递本应保留的合格机会同步升高，就不能认为方案更好。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:853-872](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L853-L872)

当前可确认投递与落盘尝试，未从这里关联实际回复。

<details>
<summary>查看原文（20行）</summary>

```text
    const 文案 = 框住内心话(配置.触发文案, 现在)
    try {
      const 工厂 = await 拿造消息工厂()
      const 消息 = 工厂
        ? 工厂.createUserMessage({ content: [{ type: 'text', text: 文案 }], source: { kind: 源标记 } })
        : 手搓用户消息(文案)
      // ⚠⚠ 必须 await：followup 返回的是 Promise，不接住的话——
      //   它一旦 reject（会话正忙 / agent 已释放 / 流出错），就是**未处理的 rejection**，
      //   Node 22+ 默认当致命错误处理 ⇒ **整个 DSH 宿主进程退出**（2026-10-21 有用户报"装了鱼就死了"）
      await agent.followup(消息)
      // ⭐ 0.2.9（issue #8 前半段）：这里**不再**记「自己上次开口」。
      //   投递只是把一句念头塞进她的会话，她完全可以看完选择不说
      //   （真机上就发生过：投递成功、这一轮 1 秒结束、一个字没发，却照样吃掉了整个冷却）。
      //   现在改成「真的出现一条有正文的 assistant 消息」才算开口 —— 见 记她说话()。
      记账(`${前缀}已送出一句，DSH 会照常开一轮：「${文案}」`)
      // 让这一条先落到磁盘上，掉电也不会丢（拿不到 sessions 服务就算了）
      try {
        if (ctx.sessions && typeof ctx.sessions.flush === 'function') await ctx.sessions.flush(agent.session)
      } catch (error) {
        记账(`（提示：落盘没确认：${String((error && error.message) || error)}）`)
```

</details>

**依据 2 · 源码核查**：[lib/host.js:942-957](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/541f6c70df51c82d63e5cb69f1c5aa4e66997f7c/lib/host.js#L942-L957)

冷却当前按会话条件而非触发 ID 推进。

<details>
<summary>查看原文（16行）</summary>

```text
    记她说话(session, event) {
      if (!event) return
      if (event.type === 'user/message') {
        const 来源 = event.data && event.data.source
        if (来源 && 来源.kind === 源标记) return
        她上次说话.set(String(session.id), event.time)
        return
      }
      // ⭐ 0.2.9（issue #8 前半段）：冷却只认「她**真的说了话**」。
      //   · assistant/message 里没有非空 text 块（只想了、只调了工具）→ 不算
      //   · 不是勾着的目标会话（别的会话、子代理）→ 也不算
      if (event.type !== 'assistant/message') return
      if (!说了话(event.data && event.data.message)) return
      const sid = String(session.id)
      if (!读配置().目标会话.some((id) => 会话键(id) === 会话键(sid))) return
      自己上次开口 = event.time
```

</details>

#### 缺口

- 宿主是否提供足够的端到端关联字段未核验
  **影响**：无法断定能低成本地映射输出到触发
  **进一步探讨**：在隔离宿主采集投递前后的消息 ID、turn 标识与非空助理事件，检查并发事件能否唯一匹配

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
