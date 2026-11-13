# dsh-qq-link

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4ad27f4](https://github.com/Yuuyuko-uu/dsh-qq-link/tree/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64)

<!-- BEGIN META -->
[![GitHub ★ 180](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=180&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yuuyuko-uu/dsh-qq-link) [![npm 30d 6,515](https://img.shields.io/static/v1?label=npm+30d&message=6%2C515&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-qq-link) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-qq-link)
<!-- END META -->

> **功能**：经 OneBot 11 HTTP 将 QQ 私聊或群聊与 DeepSeek Harness 会话双向连通。

> **亮点**：[Q01](#research-q01) 双向桥串联聊天水位和宿主受理，并对普通读取与不可撤回转入采用不同重试范围。非点名消息还能经可选的本地问号规则合批。

> **主要限制**：[Q01](#research-q01) 群缓冲在宿主受理前推进，失败可能丢消息。[Q02](#research-q02) 普通试运行也不能覆盖手动测试和空间工具，媒体根路径没有构成硬边界。

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
  - [Q01 · 轮询、群缓冲和宿主受理怎样影响消息是否可重试？](#detail-section-11)
  - [Q02 · 哪些转发能越过试运行，媒体和部分成功如何处理？](#detail-section-12)
  - [Q03 · 怎样以一个最小私聊任务对照手工交接并检验缓冲？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 OneBot 后端并需要从 QQ 延续 DSH 会话的用户，希望减少复制消息和手工回填。

人工把 QQ 文本复制到 DSH，再检查收件人后手工发回。QQ 登录和协议由 OneBot 实现。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| QQ 入站 | 从手机延续原会话 | 依赖正确绑定和 OneBot |
| 轮次回发 | 将完成回复发回 QQ | 试运行和来源设置控制普通分支 |
| 群缓冲 | 合并未点名的群消息 | 默认关闭，缓冲在内存 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 和 Node | 必需 | 宿主事件、会话及工具 | 不开桥 |
| 已登录 OneBot 11 HTTP 后端 | 必需 | 收发 QQ | 手工转述 |
| 明确测试绑定和隔离监听 | 建议前提 | 限定收件及入站 | 保持关闭 |

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 准备 | 用户 | 绑定非敏感独立聊天，关闭媒体和空间 | 无法隔离则停止 |
| 核对 | 用户 | 只触发普通试运行，不点手动发送 | 比对宿主受理和日志 |
| 退出 | 用户 | 禁用桥并核对外部已发内容 | 回到人工聊天 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | OneBot 后端与宿主 | 配置账号、监听及绑定 | 真实兼容未知 |
| 持续 | 轮询与模型开销 | 核对聊天和发信范围 | 单位合格交接成本未知 |
| 恢复 | 重复调用或部分外发 | 对账并人工处理 | 不能从日志推断收件 |
| 退出 | 本地状态可能残留 | 禁用并核外部消息 | 已发不能依赖插件撤回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 双向转发 | 绑定、followup 和轮次回发 | 真实送达和重复率 |
| 群缓冲 | 按问号规则合批 | 关键信息是否丢失 |
| 媒体 | 图片路径搜索与发送 | 工作区隔离和接收端行为 |

> **思考**：[Q01](#research-q01) 群缓冲在宿主受理前推进，失败可能丢消息。[Q02](#research-q02) 普通试运行也不能覆盖手动测试和空间工具，媒体根路径没有构成硬边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 双向桥串联聊天水位和宿主受理，并对普通读取与不可撤回转入采用不同重试范围。非点名消息还能经可选的本地问号规则合批。

[Q01](#research-q01) 普通分支在受理后写水位，非点名缓冲却在受理前消费，两个分支应分别核对。[Q02](#research-q02) 按轮号去重缺少分段重试状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 群缓冲在宿主受理前推进，失败可能丢消息。[Q02](#research-q02) 普通试运行也不能覆盖手动测试和空间工具，媒体根路径没有构成硬边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先用测试私聊和自动预览核对绑定及受理。保持媒体、空间与群缓冲关闭，核不清公开路由时维持人工转述。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认双向接线和各分支；真实 QQ、模型及外部权限未测。耐久缓冲为待验证方案。

- 已检查：作者 README、包清单、源码路径 README.md、lib/host.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态抽读入口、普通及群缓冲收消息、部分出站、媒体路径和公开入口。未执行宿主、OneBot、ASR、发帖或全部设置。
- 下一步：替身后端复现普通和群缓冲的失败和重启，再在独立真实聊天检查一次收件，不携带真实业务资料。

**分析版本**

- **仓库**：[Yuuyuko-uu/dsh-qq-link](https://github.com/Yuuyuko-uu/dsh-qq-link)
- **版本号**：1.5.9（[固定提交 4ad27f4](https://github.com/Yuuyuko-uu/dsh-qq-link/tree/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 用可恢复的消息记录区分缓冲、宿主受理和放弃，比较丢失、重复和等待，尚未验证。

替身后端复现普通和群缓冲的失败和重启，再在独立真实聊天检查一次收件，不携带真实业务资料。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1544 | — | — | 25514 |
| .js | source | 4 | 4849 | 3871 | 891 | — |
| .mjs | source | 2 | 525 | 437 | 67 | — |
| .mjs | test | 8 | 2844 | 2424 | 326 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-qq-link/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 29](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=29&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-qq-link/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 29](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=29&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-qq-link/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：QQ 用户如何在测试聊天和 DSH 会话间双向收发，哪些已接受、缓存或已发送状态会掩盖丢失与误发？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 轮询、群缓冲和宿主受理怎样影响消息是否可重试？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

用户把 QQ 聊天绑定到 DSH 会话后，普通轮询和补跑复用一条在途任务，避免给不可撤回 followup 设置超时解锁。普通合批按聊天水位和 ID 过滤，群路径还可按配置点名、概率和节流；followup 成功先回调写入水位，再尝试会话 flush。因此成功表示宿主接受，不能推出模型已完成或 QQ 已收到。另有默认关闭的非点名缓冲，只处理先通过前置过滤的群消息，达到条数或时间时按问号规则判断。它先把 ID 记成已转并推进水位，放行前删除内存池且直接调用转入，未传普通受理回调；转入返回 ok:false 时调用点不读结果。它也不经过后续普通落袋的概率和节流。重启、失败或没有后续新消息时，不能把该池当可靠队列。点名分支可将先前缓冲的部分文字带入。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:3469-3492](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L3469-L3492)

普通轮询与补跑复用 single-flight。

<details>
<summary>查看原文（24行）</summary>

```text
  // 普通轮询与攒条补跑共用这个入口；不要给不可撤回的 followup 超时解锁。
  const 开始收消息 = () => {
    if (已停止) return
    if (!读配置().总开关) {
      清补跑()
      当前控制?.abort()
    }
    闸门心跳()
    空间工具心跳()
    void 人设心跳()
    if (收消息任务) return 收消息任务
    当前控制 = new AbortController()
    // 1.0.7 的慢轮询诊断跟着实际任务；忙着的普通/补跑 tick 不重复计时。
    const 起 = Date.now()
    收消息任务 = 轮询收消息(当前控制).catch((error) => {
      try { ctx.logger?.info(`qq-bridge: 轮询出错：${String((error && error.message) || error)}`) } catch (e2) {}
    }).finally(() => {
      收消息任务 = null; 当前控制 = null
      const 用了 = Date.now() - 起
      if (用了 > 3000) {
        try { 记账('这一次收消息花了 ' + (用了 / 1000).toFixed(1) + ' 秒（QQ 端回得慢，超过 8 秒的请求会被掐掉重试）') } catch (e2) {}
      }
    })
    return 收消息任务
```

</details>

**依据 2 · 源码核查**：[lib/host.js:2571-2593](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L2571-L2593)

宿主 followup、受理回调和可失败的 flush。

<details>
<summary>查看原文（23行）</summary>

```text
    try {
      // ⚠⚠ 必须 await：followup 返回 Promise。不接住的话，它 reject 时（会话半死 / agent 已释放）
      //   catch 根本看不到（try 早就退出了）⇒ 未处理的 rejection ⇒ **整个 DSH 宿主退出**
      //   （2026-10-21：speak-up 同一个坑已经被用户报成"装了鱼就死了"，这里一并修）
      if (收消息信号?.aborted || !读配置().总开关) return { ok: false, 说: '收消息已停止' }
      await agent.followup({ id: 新id(), role: 'user', content, source: { kind: 'qq' } })
      已受理?.() // 先记宿主受理，不让后面的 flush 或卸载延迟去重落盘
      if (收消息信号?.aborted) return { ok: true, 说: '转入后收消息已停止' }
      // ⭐ 0.9.9：记「哪个聊天、什么类型、有没有点名」—— 门槛和外发都要用
      唤醒时间.set(会话键(这间), {
        时: Date.now(),
        类型: String((这条 && 这条.类型) || '私聊'),
        点名: Boolean(点名),
      })
      try {
        if (ctx.sessions && typeof ctx.sessions.flush === 'function') await ctx.sessions.flush(agent.session)
      } catch (error) {}
      const 图话 = 收下.length ? `（含 ${收下.length} 张图）` : ''
      记账(`收到 QQ 里的${收下.length ? '图片' : '话'}${图话} → 转进 DSH：「${(原话 || '（没配字）').slice(0, 50)}${原话.length > 50 ? '…' : ''}」`)
      return { ok: true, 说: '转进去了，它会照常开一轮' }
    } catch (error) {
      return { ok: false, 说: `followup 失败：${String((error && error.message) || error)}` }
    }
```

</details>

**依据 3 · 源码核查**：[lib/host.js:3662-3689](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L3662-L3689)

普通落袋按概率及冷却筛选。

<details>
<summary>查看原文（28行）</summary>

```text
        // ⭐ 1.0.9：先掷骰子 —— **没掷中就不送了**（这批根本不进 DSH，不占上下文、不花 token）
        // ⭐ 1.1.3：以前 @ / 引用 的批次**永远不掷骰子** —— 而默认「群里只听 @ 的」，
        //   于是概率这个数在实际使用里从来没生效过（填 50 也照回）。现在由「点名必回」决定。
        const 掷骰子 = 是群行 && !(攒.点名 && 配置.点名必回 !== false)
        if (掷骰子) {
          if (!攒.掷过) {
            攒.掷过 = true
            const 概率 = Math.max(0, Math.min(100, Number(配置.回复概率 == null ? 100 : 配置.回复概率)))
            攒.中 = Math.random() * 100 < 概率
          }
          if (!攒.中) {
            const 丢 = 攒
            攒 = null
            for (const id of 丢.ids) 已转消息.add(id)
            上次 = Math.max(上次, 丢.末时 || 丢.末 || 上次)
            记账('群里这 ' + 丢.条目.length + ' 条没掷中（回复概率 ' + Number(配置.回复概率) + '%），这次不接')
            return true
          }
        }
        // ⭐ 1.0.9：群聊的节奏。
        // ⭐ 1.1.7：**@ 它的也照样排队** —— 以前点名直接穿过去，群里一有人 @ 它，冷却和
        //   「一分钟最多几条」就等于没有，看起来就是「没有冷却、刷屏」。现在只是晚几秒回，不会漏。
        if (是群行) {
          const 闸 = 群闸(键2, 配置)
          if (闸.等毫秒 > 0) {
            快跑一次(Math.min(3000, Math.max(300, Math.round(闸.等毫秒) + 200)))
            return false    // 还没到点 —— 这一批留着，别丢
          }
```

</details>

**依据 4 · 源码核查**：[lib/host.js:3691-3718](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L3691-L3718)

普通合批只在受理回调推进水位，失败返回。

<details>
<summary>查看原文（28行）</summary>

```text
        const 一批 = 攒
        攒 = null
        // ⭐ 1.0.9：群里可能好几个人在说话 —— 名字写到每一行前面（这样合起来也不会认错人）
        const 文字 = 一批.条目.map((x) => {
          const 名 = (是群行 && x.发送者)
            ? String(x.发送者.昵称 || '某人') + '（' + String(x.发送者.号码 || '?') + '）：'
            : ''
          return 名 + String(x.文字 || '')
        }).filter((s) => s.trim()).join(String.fromCharCode(10))
        if (一批.ids.length > 1) 记账('连着发的 ' + 一批.ids.length + ' 条攒成一条转进去')
        const 结果 = await 转入一条(文字, 一批.图们, 一批.ids[0], 行, 是群行 ? null : 一批.发送者, 一批.点名, 信号, () => {
          for (const id of 一批.ids) 已转消息.add(id)
          上次 = Math.max(上次, 一批.末时 || 一批.末 || 上次)
          存水位({ 键: 键2, 时间: 上次, ids: 一批.ids })
          if (是群行) 记一发(键2)
        })
        if (信号.aborted) return false
        if (结果 && 结果.ok) return true
        记账('这条先没转进去（' + 短id(行.会话) + '：' + String((结果 && 结果.说) || '原因不明') + '），下一跳再试')
        return false
      }
      for (const 条 of 列表.sort((a, b) => (a.time || 0) - (b.time || 0))) {
        if (信号.aborted) return
        if (!条) continue
        // ⚠️ 这两条要放在「点名 / 接听」那道过滤**前面**（都不用等、也不解析正文）：
        //   拉回来的历史里一直躺着已经转过的旧消息，先滤掉它们，接听的条数才不会被旧消息吃掉。
        if ((条.time || 0) < 上次) continue           // 旧的，跳过
        if (已转消息.has(条.message_id) || 攒?.ids.includes(条.message_id)) continue // 转过了或已在本批里
```

</details>

**依据 5 · 源码核查**：[lib/host.js:817-829](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L817-L829)

按问号数量和条数判断是否放行。

<details>
<summary>查看原文（13行）</summary>

```text
export function 该放行缓冲(条目们 = []) {
  const 列 = Array.isArray(条目们) ? 条目们.filter(Boolean) : []
  if (!列.length) return { 放行: false, 说: '空的' }
  let 问句 = 0
  let 字数 = 0
  for (const x of 列) {
    const 文 = String((x && x.文字) || '')
    字数 += 文.length
    if (/[？?]/.test(文)) 问句 += 1
  }
  if (问句 >= 2) return { 放行: true, 说: '有 ' + 问句 + ' 条在问话' }
  if (问句 >= 1 && 列.length >= 3) return { 放行: true, 说: '有人在问话，而且聊了几句' }
  return { 放行: false, 说: '没人问话，只是闲聊（' + 列.length + ' 条 / ' + 字数 + ' 字）' }
```

</details>

**依据 6 · 源码核查**：[lib/host.js:3766-3808](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L3766-L3808)

缓冲先消费 ID，删除池后直接转入，点名可带前情。

<details>
<summary>查看原文（43行）</summary>

```text
        // ⭐ 1.5.9（issue #39）：群里**没点名**的消息先攒着，不叫醒模型。
        //   攒够条数 / 时长再判一次「值不值得」，值得才把这一批一次性送进去。
        //   关着（默认）时这一段整个跳过，行为跟以前一模一样。
        if (是群行 && 配置.缓冲开 && !点名) {
          const 池 = 缓冲池.get(键2) || { 条目: [], 起: Date.now() }
          池.条目.push({ 文字, 图们, 发送者: {
            昵称: String((条.sender && (条.sender.card || 条.sender.nickname)) || 条.nickname || ''),
            号码: Number(条.user_id) || 0,
          } })
          已转消息.add(条.message_id)
          上次 = 条.time || 上次
          const 够条数 = 池.条目.length >= 配置.缓冲条数
          const 够时间 = Date.now() - 池.起 >= 配置.缓冲分钟 * 60000
          if (!够条数 && !够时间) { 缓冲池.set(键2, 池); continue }
          const 判 = 该放行缓冲(池.条目)
          if (!判.放行) {
            池.条目 = 池.条目.slice(-Math.max(0, 配置.缓冲前情))
            池.起 = Date.now()
            if (池.条目.length) 缓冲池.set(键2, 池)
            else 缓冲池.delete(键2)
            记账('攒着听：' + 判.说 + '，先不叫它')
            continue
          }
          const 合 = 池.条目.map((x) => (x.发送者 && x.发送者.昵称 ? x.发送者.昵称 + '：' : '') + String(x.文字 || '')).join(String.fromCharCode(10))
          const 图全 = 池.条目.flatMap((x) => x.图们 || [])
          缓冲池.delete(键2)
          记账('攒着听：' + 判.说 + '，' + 池.条目.length + ' 条一起送进去')
          try {
            await 转入一条(合, 图全, '', 行, 池.条目[0].发送者, false, 信号, null)
          } catch (error) {
            记账('攒着听：送进去失败 ' + String((error && error.message) || error))
          }
          continue
        }
        // 点名进来、而池子里攒着东西 → 把最近那几条当「前情」一起带进去，省得接不上话
        if (是群行 && 点名 && 配置.缓冲开 && 缓冲池.has(键2)) {
          const 池 = 缓冲池.get(键2)
          const 前 = (池.条目 || []).slice(-Math.max(0, 配置.缓冲前情))
          缓冲池.delete(键2)
          if (前.length) {
            const 前文 = 前.map((x) => (x.发送者 && x.发送者.昵称 ? x.发送者.昵称 + '：' : '') + String(x.文字 || '')).join(String.fromCharCode(10))
            文字 = '（刚才群里在聊：' + String.fromCharCode(10) + 前文 + String.fromCharCode(10) + '）' + String.fromCharCode(10) + String(文字 || '')
          }
```

</details>

**依据 7 · 源码核查**：[lib/host.js:3894-3902](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L3894-L3902)

轮询结束存水位并限制已转 ID 数。

```text
      上次时间.set(键2, 上次)
    }

    if (已转消息.size > 300) {
      // 别 clear（clear 会让下一跳把旧的又当新的）—— 只留最近 300 个
      const 全 = [...已转消息]
      for (const id of 全.slice(0, Math.max(0, 全.length - 300))) 已转消息.delete(id)
    }
    存水位()
```

#### 缺口

- 真实 QQ 群中的补投、时延及重启行为未验证
  **影响**：不能承诺关键消息可靠交付
  **进一步探讨**：用替身 OneBot 输入同组消息，暂停会话、重启并比对水位和回复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 哪些转发能越过试运行，媒体和部分成功如何处理？

**研究主题**：缺陷与关键质疑、功能与机制、依赖、兼容与流程

#### 完整回答

完成轮次按会话与轮号先记已发，随后检查总开关、文本标记、来源、试运行并发出一个或多个 OneBot 请求。日志有各段错误，缺少对失败段的持久补偿；不能因日志报错整轮重发。手动测试路由直接调用发到QQ，绕过普通轮次试运行，会向选中绑定或默认第一条发送固定测试句。QQ 空间模型工具另看允许发空间动态，并检查部分可见名单，不能假定普通聊天试运行覆盖该工具。图片解析允许绝对路径，配置图片根只是搜索优先级，仍会扩至多个工作区、进程目录和用户目录；固定版表情占位符在发图开启后接入原图管道。公开 receive 入口明确跳过插件管理校验，实际可达范围取决宿主暴露，不能用 QQ 账号口令替代监听隔离。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:1662-1669](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L1662-L1669)

完整轮次先记会话和轮号。

```text
      const 这轮静默 = 静默轮.has(键)
      if (这轮静默) 静默轮.delete(键)
      const 有东西 = 上一轮.文本 || (上一轮.图们 && 上一轮.图们.length)
      // ⚠ 去重的键必须是「会话 + 轮号」：只按轮号的话，换过目标会话就会静默漏发
      const 轮标 = 键 + ':' + String(d.turn)
      if (完成 && 上一轮.轮号 === d.turn && 有东西 && !已发轮.has(轮标)) {
        已发轮.add(轮标)
        // ⚠️ 「这轮是不是 QQ 叫的」在**这里**算一次就消费掉 —— 不然 10 分钟的窗口会把
```

**依据 2 · 源码核查**：[lib/host.js:1534-1589](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L1534-L1589)

轮次转发的开关、来源限制、试运行和错误记账。

<details>
<summary>查看原文（56行）</summary>

```text
  /** 一轮真正落地：总开关 / 试运行 在这儿把关。 */
  async function 落地一发(配置, 文字, 图们, 方向 = '', 是QQ唤醒 = false, 是本地手打 = false) {
    if (已发轮.size > 300) 已发轮.clear() // 防 Set 无限长
    // ⭐ 0.6.0：方向就是「哪一间会话」—— 下面按它去绑定里反查该发到哪个聊天
    const 这份会话 = String(方向 || '')
    if (!这份会话) return 记账('这一轮认不出是哪间会话，这轮不转')
    配置 = { ...配置, 目标会话: 这份会话 }   // 下游（图片根目录、归档检查）都看这一个
    // ⭐ 盯的会话已经归档了：别转（人已经不在这儿说话了）
    try {
      const 登记 = ctx.workspaceRegistry || ctx.get('workspaceRegistry')
      const 归档 = new Set((((登记 && 登记.archivedSessionIds) || [])).map(String))
      if (归档.has(会话键(这份会话))) return 记账('这间会话已经归档了，这轮不转（去绑定里换一间）')
    } catch (error) {}
    if (!配置.总开关) return 记账('总开关关着，这轮该转但没转')
    // ⭐ 0.7.0 出站闸一：只发 [QQ]…[/QQ] 里的那一段（块外的解释/路径/思考留在本地）
    // ⭐ 1.5.2：标记本身永远不往 QQ 里发；**块没闭合就整轮不发**（分不清边界，宁可不发）
    const 标记 = 抠QQ标记(文字, 配置.只发标记内)
    if (!标记.发) {
      记账(标记.原因 || '这一轮没写 [QQ]…[/QQ] 块（「只发标记内」开着）—— 这轮不往 QQ 发')
      return
    }
    if (标记.原因) 记账(标记.原因)
    let 待发文字 = 标记.文字
    // ⭐ 0.7.0 出站闸二：只发「被 QQ 消息叫醒的那一轮」（你坐在 DSH 里自己聊的不推到手机）
    if (配置.只回QQ唤醒) {
      // ⭐ 1.4.4：这一刀以前切得太大 —— 判据是「最近有没有 QQ 消息进来」，
      //   于是**自动触发**的轮次（主动搭话、到点刷 B 站）也一起被挡了；
      //   它们根本不是「你在窗口里自己聊」。现在按 source.kind 分开看：
      //   · 你自己在 DSH 里打的字（source 为空 / 'user'）→ 一律留本地，这就是「只回 QQ 唤醒」的字面意思
      //   · 自动触发的（'speak-up'、定时任务等）→ 想让它们也推到手机，把「自动触发也发」打开
      //   · QQ 转进来的（'qq'）→ 照常发
      if (是本地手打) {
        记账('这一轮是你在 DSH 窗口里自己打的（「只回 QQ 唤醒」开着）—— 只留本地，不推 QQ')
        return
      }
      if (!是QQ唤醒 && 配置.自动触发也发 !== true) {
        记账('这一轮不是 QQ 消息叫醒的（「只回 QQ 唤醒」开着）—— 只在 DSH 里说，不推 QQ')
        return
      }
    }
    const 抠过 = 配置.发图 ? 抠正文图(待发文字) : { 净文字: 待发文字, 图: [] }
    const 几张 = (Array.isArray(图们) ? 图们.length : 0) + 抠过.图.length
    const 图标 = 几张 ? `（还有 ${几张} 张图）` : ''
    const 净文 = String(抠过.净文字 || '')
    if (配置.试运行) {
      return 记账(`试运行：本来要发到 QQ →「${净文.slice(0, 40)}${净文.length > 40 ? '…' : ''}」${图标}`)
    }
    const 结果 = await 发到QQ(配置, 待发文字, 图们, 方向)
    const 全过 = 结果.length > 0 && 结果.every((r) => r.ok)
    if (结果.length === 0) {
      记账('这一边（' + (方向 || '私聊+群') + '）没开或没填号，或者这轮既没有文字也没有图（而且图都没转成）：没地方发')
      return
    }
    记账(`${全过 ? '✅ 已发到 QQ：' : '⚠ 发 QQ 有问题：'}「${净文.slice(0, 50)}${净文.length > 50 ? '…' : ''}」${图标}`)
    for (const r of 结果) {
      if (!r.ok) 记账(`   ${r.action} 失败：${JSON.stringify(r.数据).slice(0, 140)}`)
```

</details>

**依据 3 · 源码核查**：[lib/host.js:3965-3985](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L3965-L3985)

手动发送不经过轮次试运行。

<details>
<summary>查看原文（21行）</summary>

```text
  // 手动试一发：**真发**（绕过试运行），只发一条固定测试句，动不了已发轮
  路线(`${路由前缀}/test-send`, async (req, res) => {
    const 来 = await 读体(req)
    const 配置 = 读配置()
    const 绑定 = 配置.绑定 || []
    if (!绑定.length) {
      return 回(res, { ok: false, 说: '还没绑定任何聊天 —— 去「绑定」页加一条（一行 = 一个聊天 → 一间会话）' })
    }
    // 0.9.7：体里指定了哪条就发哪条，没指定就发第一条；一律按绑定发（不再看老字段 私聊QQ/群号）
    const 选 = 绑定.find((b) => 会话键(b.会话) === 会话键(来.会话)) || 绑定[0]
    const 谁 = (选.类型 === '群' ? '群 ' : '私聊 ') + 选.号码
    const 文字 = '（这是一条测试消息：DSH → QQ 通了）'
    const 结果 = await 发到QQ(配置, 文字, [], 选.会话)
    const 全过 = 结果.length > 0 && 结果.every((r) => r.ok)
    记账(`手动测试（发给 ${谁}）：${全过 ? '✅ 已发' : '⚠ 有问题'}「${文字}」`)
    for (const r of 结果) if (!r.ok) 记账(`   ${r.action} 失败：${JSON.stringify(r.数据).slice(0, 140)}`)
    回(res, {
      ok: 全过,
      说: 全过 ? ('测试句已经发到 ' + 谁 + ' 了') : ('发给 ' + 谁 + ' 时没发出去（看下面的记录）'),
      记录: 日志,
    })
```

</details>

**依据 4 · 源码核查**：[lib/host.js:1294-1323](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L1294-L1323)

绝对路径及多个根目录搜索。

<details>
<summary>查看原文（30行）</summary>

```text
  function 找本地图(p, 配置) {
    const 原 = String(p || '').trim()
    if (!原) return ''
    const 试 = []
    if (/^[a-zA-Z]:[\\/]/.test(原) || 原.startsWith('\\\\') || 原.startsWith('/')) 试.push(原)
    else {
      const 根们 = []
      const 设 = String(配置.图片根目录 || '').trim()
      if (设) 根们.push(设)
      try {
        const 登记 = ctx.workspaceRegistry || ctx.get('workspaceRegistry')
        const 列表 = (登记 && typeof 登记.list === 'function' ? 登记.list() : []) || []
        const 目标 = String(配置.目标会话 || '')
        // ⭐ 先把「目标会话所在的工作区」排到前面 —— 这个才是它平时待的地方
        const 排 = 列表.slice().sort((a, b) => {
          const A = a && Array.isArray(a.sessionIds) && a.sessionIds.map(String).indexOf(目标) >= 0 ? 0 : 1
          const B = b && Array.isArray(b.sessionIds) && b.sessionIds.map(String).indexOf(目标) >= 0 ? 0 : 1
          return A - B
        })
        for (const w of 排) {
          const d = w && (typeof w.path === 'string' ? w.path : (w.directory || w.dir || w.root))
          if (typeof d === 'string' && d) 根们.push(d)
        }
      } catch (error) {}
      根们.push(process.cwd(), join(目录, 'workspace'), homedir())
      for (const r of 根们) 试.push(join(String(r), 原))
    }
    for (const 全 of 试) {
      try { if (existsSync(全)) return 全 } catch (error) {}
    }
```

</details>

**依据 5 · 源码核查**：[lib/host.js:3187-3205](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L3187-L3205)

空间发送有独立总闸及可见名单校验。

<details>
<summary>查看原文（19行）</summary>

```text
      async execute(args = {}) {
        const 配置 = 读配置()
        if (配置.允许发空间动态 !== true) {
          return { ok: false, 说: '「允许发 QQ 空间动态」还关着，这条没发出去。要发说说，得先去设置页把那个开关打开。' }
        }
        const 正文 = String(args.content == null ? '' : args.content).trim()
        const 图们 = (Array.isArray(args.images) ? args.images : [args.images])
          .map((x) => String(x == null ? '' : x).trim())
          .filter(Boolean)
          .slice(0, 9)
        if (!正文 && !图们.length) return { ok: false, 说: '正文和图片都是空的，没东西可发。' }
        const 权利 = [1, 4, 16, 64, 128].includes(Number(args.ugc_right)) ? Number(args.ugc_right) : 1
        const 名单 = (Array.isArray(args.target_uins) ? args.target_uins : [args.target_uins])
          .map((x) => String(x == null ? '' : x).trim())
          .filter(Boolean)
          .map((x) => (/^[0-9]{4,12}$/.test(x) ? Number(x) : x))
        if ((权利 === 16 || 权利 === 128) && !名单.length) {
          return { ok: false, 说: '「部分可见 / 部分不可见」得给名单（target_uins），这次没给，所以没发。' }
        }
```

</details>

**依据 6 · 源码核查**：[lib/host.js:3905-3912](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L3905-L3912)

receive 明确作为公开入站路由。

```text
  // ⚠ `公开: true` —— 这是「外面往插件里推消息」的数据口（脚本 / 转发器调它），
  //   不是设置页的管理接口，别拿登录校验去拦它。
  路线(`${路由前缀}/receive`, async (req, res) => {
    const 来 = await 读体(req)
    const 文字 = typeof 来.text === 'string' ? 来.text.trim() : ''
    if (!文字) return 回(res, { ok: false, 说: '没有文字（body 里给 text）' })
    回(res, await 转入文字(文字))
  }, { 公开: true })
```

#### 缺口

- 真实宿主对公开及管理路由的外部可达性未知
  **影响**：涉及消息注入和测试路由误发
  **进一步探讨**：仅用隔离监听及替身后端核对路由调用身份、路径越界和分段错误

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样以一个最小私聊任务对照手工交接并检验缓冲？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

同一个非敏感问题由用户分别手工粘贴和经测试私聊发送，合格结果是正确绑定会话中恰好出现一次转入且目标聊天只收到预期文本。在自动试运行先核日志，不点手动真发按钮；仅在获准的独立聊天中再核外部收件。OneBot 登录、绑定、日志审核和失败后对账带来新负担，模型 token、桥资源与人工耗时分开计。缓冲若要处理关键信息，可以试持久记入待交付后按宿主受理标记，并区分放弃和未知；对照普通受理回调和现有内存池，若丢失不降或重复、延迟上升抵消收益，则保持默认关闭。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:329-335](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/README.md#L329-L335)

作者列出 OneBot 后端及媒体下载边界。

```text
| **网络** | 连你本机的 QQ 后端（默认 `127.0.0.1:3000`，NapCat / SnowLuma 的 OneBot 11 HTTP） | 只连你填的那个地址；不往别处发。收图时会去图床地址下载（QQ 消息里带的 url） |
| **文件** | 收进来的图存在 `~/.dsh/qq-bridge-inbox/`；配置和状态在 `~/.dsh/`（`qq-bridge-config.json` / `qq-bridge-state.json`） | 只碰这两个地方；不扫别的目录 |
| **命令** | 只有你**自己填了**「语音转写命令」才会跑一条本地命令（比如 `python tools/asr_cli.py {file}`） | 不填就完全不跑；不装额外依赖 |
| **凭据** | 「令牌」那一栏（QQ 后端的 access token），存在配置文件里 | 只用来连你自己填的那个后端；不要把它贴进公开 issue |
| **公开发东西** | `qq_space_post` 能往你这个 QQ 号的空间里发说说 | 默认关（「允许发 QQ 空间动态」）；关着时一个请求都不发。开着就是**公开可见**，发出去得自己去删 |

**外部依赖**：一个 OneBot 11 的 QQ 后端（NapCat / SnowLuma 等）—— 插件本身不带 QQ 协议实现。
```

**依据 2 · 源码核查**：[lib/host.js:1574-1589](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L1574-L1589)

普通试运行只记预览及真发结果。

<details>
<summary>查看原文（16行）</summary>

```text
    const 抠过 = 配置.发图 ? 抠正文图(待发文字) : { 净文字: 待发文字, 图: [] }
    const 几张 = (Array.isArray(图们) ? 图们.length : 0) + 抠过.图.length
    const 图标 = 几张 ? `（还有 ${几张} 张图）` : ''
    const 净文 = String(抠过.净文字 || '')
    if (配置.试运行) {
      return 记账(`试运行：本来要发到 QQ →「${净文.slice(0, 40)}${净文.length > 40 ? '…' : ''}」${图标}`)
    }
    const 结果 = await 发到QQ(配置, 待发文字, 图们, 方向)
    const 全过 = 结果.length > 0 && 结果.every((r) => r.ok)
    if (结果.length === 0) {
      记账('这一边（' + (方向 || '私聊+群') + '）没开或没填号，或者这轮既没有文字也没有图（而且图都没转成）：没地方发')
      return
    }
    记账(`${全过 ? '✅ 已发到 QQ：' : '⚠ 发 QQ 有问题：'}「${净文.slice(0, 50)}${净文.length > 50 ? '…' : ''}」${图标}`)
    for (const r of 结果) {
      if (!r.ok) 记账(`   ${r.action} 失败：${JSON.stringify(r.数据).slice(0, 140)}`)
```

</details>

**依据 3 · 源码核查**：[lib/host.js:3701-3710](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L3701-L3710)

普通受理回调可作已有设计参照。

<details>
<summary>查看原文（10行）</summary>

```text
        const 结果 = await 转入一条(文字, 一批.图们, 一批.ids[0], 行, 是群行 ? null : 一批.发送者, 一批.点名, 信号, () => {
          for (const id of 一批.ids) 已转消息.add(id)
          上次 = Math.max(上次, 一批.末时 || 一批.末 || 上次)
          存水位({ 键: 键2, 时间: 上次, ids: 一批.ids })
          if (是群行) 记一发(键2)
        })
        if (信号.aborted) return false
        if (结果 && 结果.ok) return true
        记账('这条先没转进去（' + 短id(行.会话) + '：' + String((结果 && 结果.说) || '原因不明') + '），下一跳再试')
        return false
```

</details>

**依据 4 · 源码核查**：[lib/host.js:3769-3798](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/4ad27f4ca8177ca409aae30dd5ba25f0ef9aaa64/lib/host.js#L3769-L3798)

群缓冲可对照重启和转入失败。

<details>
<summary>查看原文（30行）</summary>

```text
        if (是群行 && 配置.缓冲开 && !点名) {
          const 池 = 缓冲池.get(键2) || { 条目: [], 起: Date.now() }
          池.条目.push({ 文字, 图们, 发送者: {
            昵称: String((条.sender && (条.sender.card || 条.sender.nickname)) || 条.nickname || ''),
            号码: Number(条.user_id) || 0,
          } })
          已转消息.add(条.message_id)
          上次 = 条.time || 上次
          const 够条数 = 池.条目.length >= 配置.缓冲条数
          const 够时间 = Date.now() - 池.起 >= 配置.缓冲分钟 * 60000
          if (!够条数 && !够时间) { 缓冲池.set(键2, 池); continue }
          const 判 = 该放行缓冲(池.条目)
          if (!判.放行) {
            池.条目 = 池.条目.slice(-Math.max(0, 配置.缓冲前情))
            池.起 = Date.now()
            if (池.条目.length) 缓冲池.set(键2, 池)
            else 缓冲池.delete(键2)
            记账('攒着听：' + 判.说 + '，先不叫它')
            continue
          }
          const 合 = 池.条目.map((x) => (x.发送者 && x.发送者.昵称 ? x.发送者.昵称 + '：' : '') + String(x.文字 || '')).join(String.fromCharCode(10))
          const 图全 = 池.条目.flatMap((x) => x.图们 || [])
          缓冲池.delete(键2)
          记账('攒着听：' + 判.说 + '，' + 池.条目.length + ' 条一起送进去')
          try {
            await 转入一条(合, 图全, '', 行, 池.条目[0].发送者, false, 信号, null)
          } catch (error) {
            记账('攒着听：送进去失败 ' + String((error && error.message) || error))
          }
          continue
```

</details>

#### 缺口

- 真实消息送达率、处理耗时与开销未测
  **影响**：不能判断长期桥接是否优于手工
  **进一步探讨**：先用非敏感的隔离消息量化漏发、重复和人工对账

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
