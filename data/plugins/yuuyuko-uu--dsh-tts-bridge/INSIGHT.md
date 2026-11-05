# 朗读桥

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[02060a1](https://github.com/Yuuyuko-uu/dsh-tts-bridge/tree/02060a151ade616cbc69a89a8dd63728417408d8)

<!-- BEGIN META -->
[![GitHub ★ 229](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=229&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yuuyuko-uu/dsh-tts-bridge) [![npm 30d 3,567](https://img.shields.io/static/v1?label=npm+30d&message=3%2C567&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tts-bridge) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tts-bridge)
<!-- END META -->

> **功能**：将选定 DSH 会话的助手回复排队，由浏览器扩展提交给 DeepSeek 网页复述并朗读。

> **亮点**：[Q01](#research-q01) 自动交接完成轮次并跟踪一次浏览器播放，减少逐条复制。

> **主要限制**：[Q03](#research-q03) 文本会发送到网页账号，回环引导令牌也不隔离同机任意进程。

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
  - [Q01 · 等待长回复时，朗读桥省去什么操作？](#detail-section-11)
  - [Q02 · 浏览器怎样从回复文本变成一次播放？](#detail-section-12)
  - [Q03 · 回环令牌可以保护什么，哪些数据仍会出本机？](#detail-section-13)
  - [Q04 · 在哪些条件下才值得观察或试用？](#detail-section-14)
  - [Q05 · 先展示待发送文本是否能减少误发？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在另一个窗口工作时想听到 DSH 回复的人，可以评估浏览器自动朗读。

手动复制文本、使用本地朗读或直接阅读，都可避免网页自动化链路中的部分依赖。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 完成轮次队列 | 减少逐条复制 | 队列满时丢旧项 |
| 网页朗读 | 触发复述并播放 | 依赖网页账号、DOM 和浏览器激活 |
| 回执 | 区分开始、失败和结束 | 有声状态不能验证文本完整性 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 带 Web 的 DSH | 必需 | 扫描完成轮次与提供入口 | 无法入队 |
| Chromium 扩展 | 必需 | 取件和操作页面 | 队列无法变成播放 |
| DeepSeek 网页账号 | 必需 | 复述及网页朗读 | 登录、拒绝或限额可能阻断 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 核对固定版本并关闭自动 | 只用合成文本 |
| 核查 | 观察回环、复述和朗读 | 对照原文与回执 |
| 退出 | 禁用扩展并卸下宿主插件 | 账号侧历史按网页设置处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 账号和资源开销未知 | 安装及激活时间未知 | 两端都要配置 |
| 持续 | 网页消耗与网络开销未知 | 队列复核和等待未知 | 文本可能到外部服务 |
| 恢复 | 重发消耗未知 | 页面适配与诊断耗时未知 | 队列有上限且可能丢旧项 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 自动朗读 | 静态链覆盖会话到页面按钮 | 实际音频与原文一致性 |
| 状态回执 | 播放观察有重试与失败 | 其他声音是否干扰 |

> **思考**：[Q03](#research-q03) 文本会发送到网页账号，回环引导令牌也不隔离同机任意进程。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 自动交接完成轮次并跟踪一次浏览器播放，减少逐条复制。

队列限制、取消检查和播放超时可让部分失效显性化，但标签页音频仍是代理判据。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 文本会发送到网页账号，回环引导令牌也不隔离同机任意进程。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先保持自动关闭，仅对合成内容确认发送目标和回执。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持排队、回环与页面播放步骤。网页兼容、保留策略和听读完整性未实测。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、extension/content.js、extension/playback.js、lib/local-gate.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定宿主插件、扩展及回环接口；未执行 DSH、扩展、网页、音频或模型。
- 下一步：用合成文本检查引导、发送、复述和停止；记录收到的回执及账号侧历史。

**分析版本**

- **仓库**：[Yuuyuko-uu/dsh-tts-bridge](https://github.com/Yuuyuko-uu/dsh-tts-bridge)
- **版本号**：1.3.3（[固定提交 02060a1](https://github.com/Yuuyuko-uu/dsh-tts-bridge/tree/02060a151ade616cbc69a89a8dd63728417408d8)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 测试发送前显示实际文字及账号，观察是否减少错误提交。

用合成文本检查引导、发送、复述和停止；记录收到的回执及账号侧历史。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 399 | — | — | 5205 |
| .js | source | 10 | 4270 | 3576 | 483 | — |
| .mjs | source | 1 | 230 | 189 | 31 | — |
| .mjs | test | 6 | 1325 | 1199 | 70 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Yuuyuko-uu/dsh-tts-bridge/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查两段朗读链如何运作，以及会话文本的接收和发送边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 等待长回复时，朗读桥省去什么操作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

想在切换窗口时听到回复的人，可让宿主扫描完成轮次并把内容加入浏览器播放队列。与手工复制回复去点朗读相比，它减少逐次复制和点击。队列达到六项会移除最旧元素，且文本会经过清洗，所以不宜用作必须逐条无损交付的朗读渠道。网页端复述也不能保证和原文本逐字相同。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-19](https://github.com/Yuuyuko-uu/dsh-tts-bridge/blob/02060a151ade616cbc69a89a8dd63728417408d8/README.md#L5-L19)

作者声明产品与两段职责

<details>
<summary>查看原文（15行）</summary>

```text
**让 DSH 里的会话，用 DeepSeek 网页端的声音念出来。**

大肥鱼说了一句话 → 自动发到 DeepSeek 网页端让它复述 → 用你自己账号的朗读功能出声。
声音从你的电脑里出来，你不用盯着那个页面。

> 名字里的「桥」就是这个意思：**DSH 这边知道说了什么，浏览器那边负责让声音出来**，中间靠它接起来。

---

## 它由两部分组成（缺一不可）

| | 是什么 | 干什么 |
|---|---|---|
| **① DSH 插件** `dsh-tts-bridge` | 住在 DSH 里 | 盯着你选的会话，把「说完一整轮」的话排进队列 |
| **② 浏览器扩展** 「朗读桥」 | 住在 Chrome / Edge 里 | 取走队列里的话，发给 DeepSeek，点它的「朗读」按钮 |
```

</details>

**依据 2 · 源码核查**：[lib/index.js:294-319](https://github.com/Yuuyuko-uu/dsh-tts-bridge/blob/02060a151ade616cbc69a89a8dd63728417408d8/lib/index.js#L294-L319)

完成轮次入队与六项限制

<details>
<summary>查看原文（26行）</summary>

```text
    const enqueue = (text, force, messageId) => {
      // ⚠⚠ 2026-10-12：这里过一道「去颜文字」（念的时候跳过 ✗→✓）
      const clean = 去颜文字(text)
      if (!clean) return false
      if (state.queue.length >= 6) state.queue.shift()
      state.queue.push({
        id: state.nextId++,
        text: clean,
        force: !!force,
        messageId: messageId ? String(messageId) : null,
        at: Date.now(),
        claimedBy: null,
        claimedAt: 0,
      })
      say('排队 ' + state.queue.length + ' 条：' + clean.slice(0, 40).replace(/\s+/g, ' '))
      return true
    }

    // 只认「一整轮说完」的助手文字；工具调用、思考框不念
    const scanTurns = createSessionTurnScanner({
      onCompleted: (text) => {
        remember(text)
        if (state.auto) enqueue(text, false, null)
      },
      onStart: (id, seq) => say('开始盯着 ' + id + '（seq=' + seq + '）'),
      onError: (error, id) => say('读 ' + id + ' 出错：' + (error && error.message)),
```

</details>

#### 缺口

- 没有比较听读理解率或排队遗漏
  **影响**：不知何种回复长度真正有收益
  **进一步探讨**：比较相同回复用手动和自动朗读的等待与遗漏

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 浏览器怎样从回复文本变成一次播放？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

页面脚本找到输入框，拼接复述前缀和内容，模拟回车，未清空时再找发送按钮。之后基于页面消息和拒绝模式识别回复，寻找并点击朗读。播放观察在检测到声响后等待连续安静再宣布结束，未出声会重试并明确报告失败。标签页有声是近似信号，不能校验音频对应的文本与完整性。DOM、按钮文案和浏览器用户激活都可能改变结果。

#### 证据与依据

**依据 1 · 源码核查**：[extension/content.js:524-564](https://github.com/Yuuyuko-uu/dsh-tts-bridge/blob/02060a151ade616cbc69a89a8dd63728417408d8/extension/content.js#L524-L564)

填入内容并触发发送

<details>
<summary>查看原文（41行）</summary>

```text
  async function speak(text, isActive) {
    const check = () => {
      if (!isActive()) throw fail('已取消')
    }
    check()
    const input = findInput()
    if (!input) throw fail('没找到对话框', dump(document, 20).join(' ;; '))
    // 发送前先记住「现在末尾是哪一条」——新回复是一条全新的 markdown 节点，
    // 靠「节点换人了」来认，比靠字数/条数稳得多（秒回的回复会把条数基准冲掉）
    const before = lastMarkdown()
    const beforeText = before ? (before.innerText || '').trim() : ''
    const beforeCount = document.querySelectorAll(MD_SEL).length
    // ⚠⚠ 发之前先数一下页面上「拒绝词」有几个 ——
    //   发完比这个数多，才可能是这次被拦的 ✓（光判「有没有」会被以前的对话误报）
    // ⚠ 2026-10-03：我们自己发过去的那段**也会显示在页面上**（用户消息一条、复述再一条），
    //   所以要把「我方词数」一起交给判据，让它扣掉这一截（见 waitForReply 里那两条）✗
    const beforeRefusal = countRefusal(document.body.innerText || '')
    const payload = PREFIX + text
    const 我方词 = countRefusal(payload)

    input.focus()
    setNativeValue(input, payload)
    await sleep(250)
    check()

    key(input, 'keydown')
    key(input, 'keypress')
    key(input, 'keyup')
    await sleep(900)
    check()
    const clearedByEnter = readInput(input) !== payload
    if (!clearedByEnter) {
      const btn = findSendButton(input)
      if (btn) {
        btn.click()
        await sleep(900)
        check()
      }
    }
    const cleared = readInput(input) !== payload

```

</details>

**依据 2 · 源码核查**：[extension/content.js:587-620](https://github.com/Yuuyuko-uu/dsh-tts-bridge/blob/02060a151ade616cbc69a89a8dd63728417408d8/extension/content.js#L587-L620)

拒绝识别和朗读按钮

<details>
<summary>查看原文（34行）</summary>

```text
    // ⚠⚠⚠ 被拦了 —— 这条要**放在「没发出去」前面**判：
    //   被拦时没有朗读按钮、可能连 markdown 节点都没有 → reply 会是 null，
    //   走下面那条就会误报成「没发出去」，她看到的提示就是错的 ✗
    if (reply === 被拦记号) throw fail('被拦了')
    if (!reply) {
      throw fail(
        '没发出去',
        '清空=' + clearedByEnter + '/' + cleared + ' | 输入框还剩=' + readInput(input).slice(0, 30) + ' | ' + diagnostics(before),
      )
    }

    status = '点朗读…'
    paint()
    // ⚠⚠ 先看看它是不是在拒绝，再点朗读 ✗
    //   复述被拦时它回的是「…暂时无法回答，让我们换个话题再聊聊吧」——
    //   那不是复述，念出来是念了句拒绝给她听，不如**别念、直接告诉她** ✓
    //   ⚠ 判断两头看：**回复里有、发过去的原文里没有** 才算被拦 ——
    //     原文自己就写着「换个话题」（小说对白）的话，复述里出现是对的 ✗
    const 拦的词 = looksLikeRefusal(reply)
    if (拦的词 && !looksLikeRefusal(text)) {
      // ⚠ 话要短 —— 她说的：「太长了，就说被拦了就行」✗
      //   卡片上显示成「没成：被拦了」，一行看完 ✓
      throw fail('被拦了')
    }
    scrollToBottom()
    const btn = await findReadButton(check)
    check()
    btn.click()
    await sleep(800)
    check()
    // 页面上出现「限额」这类提示只当备注，不当结论 ——
    // 它可能是之前留下的、也可能弹一下又好了。真正的结论看有没有出声。
    lastWarning = readWarning()
    return lastWarning ? '页面提示：' + lastWarning : null
```

</details>

**依据 3 · 源码核查**：[extension/playback.js:85-110](https://github.com/Yuuyuko-uu/dsh-tts-bridge/blob/02060a151ade616cbc69a89a8dd63728417408d8/extension/playback.js#L85-L110)

用安静、重试及超时判定播放

<details>
<summary>查看原文（26行）</summary>

```text
      } else {
        quiet++
        if (reported && quiet >= 3) {
          status('念完了')
          await o.onPlaying(false)
          return finish({ ok: true })
        }
        if (!reported && !retried && waited >= 6) {
          retried = true
          status('没出声，重来一次…')
          if (o.retry) await o.retry()
        } else if (!reported && retried && waited >= 18) {
          status('点了朗读但没出声')
          await o.onPlaying(false)
          const w = o.warning ? o.warning() : null
          return finish({ ok: false, why: '点了朗读但没出声', detail: w ? '页面提示：' + w : null })
        }
      }
      if (settled) return
      if (waited >= maxTicks) {
        status('响太久了，不再等')
        await o.onPlaying(false)
        finish({ ok: false, why: '响太久了，不再等' })
        // 放弃之后也要让页面那头收手（点一下停止）—— 不然这边说「没在响」，
        // 页面却还在念，下一句一进来又被打断
        if (o.onGiveUp) quietly(() => o.onGiveUp())
```

</details>

#### 缺口

- 当前 DeepSeek 网页行为未核对
  **影响**：不能确认实际页面结构和浏览器兼容
  **进一步探讨**：用不含敏感信息的短文本核对发送、复述、播放和回执

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 回环令牌可以保护什么，哪些数据仍会出本机？

**研究主题**：缺陷与关键质疑

#### 完整回答

宿主在 127.0.0.1 监听并生成启动令牌。普通网页的 Origin 会被拒绝，非引导路由还要求令牌和路径白名单。不过实现允许没有 Origin 的客户端，并且 /where 会返回令牌，扩展来源按协议形态匹配，未见固定安装实例的身份绑定。能直连回环的本地进程可无 Origin 请求引导，所以这套机制不能用于隔离本机不受信任进程。更重要的是浏览器会把清洗后的会话文本作为网页聊天请求发送给 DeepSeek，回环只保护扩展与宿主之间的一段，不改变网页账号侧的数据去向。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:781-816](https://github.com/Yuuyuko-uu/dsh-tts-bridge/blob/02060a151ade616cbc69a89a8dd63728417408d8/lib/index.js#L781-L816)

监听、令牌和扩展白名单

<details>
<summary>查看原文（36行）</summary>

```text
    const 问路端口 = [19387, 39871, 39872]
    const 本机令牌 = randomBytes(32).toString('base64url')
    // 扩展够得着的接口：只列它真的会用的。界面用的那些（/watch、/favorites、/stop…）
    // 仍然只走 DSH 的门，不上这道口。
    const 扩展接口 = [
      P + '/state',
      P + '/next',
      P + '/ack',
      P + '/playing',
      P + '/auto',
      P + '/say',
      P + '/hello',
    ]
    const 小门 = createLocalGate({
      prefix: P,
      token: 本机令牌,
      routes: ROUTES,
      allow: 扩展接口,
      dshBase: () => ctx.webServer.getOrigin() + P,
    })
    ctx.effect(() => {
      const 开着的 = []
      let 收摊 = false
      let 门牌 = 0
      const 守一个 = (端口) =>
        new Promise((resolve) => {
          const 服务器 = createServer((req, res) => {
            小门.handle(req, res, 门牌).catch(() => {
              try {
                res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' })
                res.end(JSON.stringify({ ok: false, error: '出错了' }))
              } catch (error) {}
            })
          })
          服务器.once('error', () => resolve(null))
          服务器.listen(端口, '127.0.0.1', () => {
```

</details>

**依据 2 · 源码核查**：[lib/local-gate.js:27-43](https://github.com/Yuuyuko-uu/dsh-tts-bridge/blob/02060a151ade616cbc69a89a8dd63728417408d8/lib/local-gate.js#L27-L43)

扩展来源规则允许无 Origin

<details>
<summary>查看原文（17行）</summary>

```text
export function 允许来源(origin) {
  const o = String(origin == null ? '' : origin).trim()
  if (!o) return ''
  if (扩展来源.test(o)) return o
  // 网页能拿到这个口的话，本地会话内容就谁都能读了 —— 一律不认。
  if (网页来源.test(o) || o === 'null') return null
  return null
}

/** 定长比较，别让令牌能被逐位试出来。 */
export function 同令牌(收到, 应有) {
  if (typeof 收到 !== 'string' || typeof 应有 !== 'string') return false
  if (!收到 || !应有 || 收到.length !== 应有.length) return false
  try {
    return timingSafeEqual(Buffer.from(收到), Buffer.from(应有))
  } catch (error) {
    return false
```

</details>

**依据 3 · 源码核查**：[lib/local-gate.js:96-126](https://github.com/Yuuyuko-uu/dsh-tts-bridge/blob/02060a151ade616cbc69a89a8dd63728417408d8/lib/local-gate.js#L96-L126)

引导返回令牌、其他接口校验令牌

<details>
<summary>查看原文（31行）</summary>

```text
    // 问路：这条是引导，不能要令牌（扩展还没令牌）。但它只回给本机 + 扩展来源。
    if (路 === prefix + '/where') {
      let base = ''
      try {
        base = String(dshBase() || '')
      } catch (error) {
        base = ''
      }
      写(
        res,
        200,
        {
          ok: true,
          // base 保持原样：老扩展（1.3.0 及以前）只认这个字段，老宿主上它仍然跑得通。
          base: base,
          // bridge = 只给扩展的本机通道；token = 每次启动新发的令牌。
          bridge: 'http://127.0.0.1:' + Number(端口 || 0) + prefix,
          token: token,
          pid: process.pid,
        },
        跨,
      )
      return
    }

    if (!同令牌(req.headers && req.headers[TOKEN_HEADER], token)) {
      写(res, 403, { ok: false, error: '令牌不对' }, 跨)
      return
    }
    if (!放行.has(路)) {
      写(res, 404, { ok: false, error: '没有这条' }, 跨)
```

</details>

**依据 4 · 源码核查**：[extension/content.js:540-560](https://github.com/Yuuyuko-uu/dsh-tts-bridge/blob/02060a151ade616cbc69a89a8dd63728417408d8/extension/content.js#L540-L560)

文本实际进入网页聊天

<details>
<summary>查看原文（21行）</summary>

```text
    const beforeRefusal = countRefusal(document.body.innerText || '')
    const payload = PREFIX + text
    const 我方词 = countRefusal(payload)

    input.focus()
    setNativeValue(input, payload)
    await sleep(250)
    check()

    key(input, 'keydown')
    key(input, 'keypress')
    key(input, 'keyup')
    await sleep(900)
    check()
    const clearedByEnter = readInput(input) !== payload
    if (!clearedByEnter) {
      const btn = findSendButton(input)
      if (btn) {
        btn.click()
        await sleep(900)
        check()
```

</details>

#### 缺口

- 网页服务保留策略和本机权限未核实
  **影响**：不能保证私有回复仅在本机
  **进一步探讨**：先用合成数据核对两个网络跳点和有效策略

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 在哪些条件下才值得观察或试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

当前链路需要 DSH Web、已加载扩展的 Chromium、已登录的 DeepSeek 页面及首次用户激活。README 同时给出 npm 安装和未发布的冲突说法，不能仅凭文档认定当前安装入口。状态、页面变动和账户限制可能分别影响宿主采集、扩展取件和网页播放。只听合成文本可先关闭自动排队并选择手动播放，出现异常时停用扩展并移除 profile 插件，退出后网页端已发消息仍归网页账号。安装维护和响应耗时未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-39](https://github.com/Yuuyuko-uu/dsh-tts-bridge/blob/02060a151ade616cbc69a89a8dd63728417408d8/README.md#L23-L39)

作者列出的客户端和账号条件

<details>
<summary>查看原文（17行）</summary>

```text
## 需要什么

- **DSH**（DeepSeek Harness），带 Web 界面
- **Chromium 内核的浏览器**：Chrome / Edge / Brave 等（Firefox 不行）
- **一个你自己的 DeepSeek 账号**（朗读是它给每个账号的功能）
- 用的时候，**那个 DeepSeek 页面要开着**（真正出声的是它）

---

## 适配哪个 DSH 版本（不用操心）

这个插件**跟着 DSH 一起更新**：作者这边跑的就是最新版的 DSH，**最新版插件永远是给最新版 DSH 写的**。

所以看到「不适配 / 不支持」之类的提示，基本都是**装到了旧版本** —— 升级到最新版、重启一次 DSH 就好。
真遇到新版对不上（比如 DSH 刚升级、插件还没跟上），提个 issue，作者会跟着改。

当前实测对照：插件 **1.3.0** ↔ DSH **0.2.1-rc.3**（2026-10-26）
```

</details>

**依据 2 · 作者声明**：[README.md:43-65](https://github.com/Yuuyuko-uu/dsh-tts-bridge/blob/02060a151ade616cbc69a89a8dd63728417408d8/README.md#L43-L65)

固定文档包含互相冲突的发布声明

<details>
<summary>查看原文（23行）</summary>

````text
### 第一步：装 DSH 插件

**它已经在 DSH 的插件市场里了** —— 打开市场搜「朗读桥」装上就行。

用命令行装也可以：

```sh
dsh plugin --profile web add dsh-tts-bridge
```

> 也可以在 npm 上直接看到这个包（含历史版本）：<https://www.npmjs.com/package/dsh-tts-bridge>

> 上面那条要是碰到网络问题（npm 抽风、或者想固定某一次的代码快照），可以改用 tarball 直链，不用 git：

```bash
dsh plugin --profile web add https://codeload.github.com/Yuuyuko-uu/dsh-tts-bridge/tar.gz/refs/heads/main
```


> ⚠ 这个插件**没有发到 npm 上**，所以别写成 `add dsh-tts-bridge` —— 那样会找不到包。
> 要写 `github:` 那一种（上面这条），或者干脆用插件市场。

装完**重启一次 DSH**。
````

</details>

**依据 3 · 作者声明**：[README.md:69-96](https://github.com/Yuuyuko-uu/dsh-tts-bridge/blob/02060a151ade616cbc69a89a8dd63728417408d8/README.md#L69-L96)

开发者模式与首次交互步骤

<details>
<summary>查看原文（28行）</summary>

```text
### 第二步：装浏览器扩展

![装扩展](docs/install-extension.png)

1. 打开 `chrome://extensions`（Edge 用 `edge://extensions`）
2. 打开「**开发者模式**」（Chrome 在右上角，Edge 在左下角）
3. 点「**加载已解压的扩展程序**」，选中 `extension/` 这个文件夹
4. 打开 <https://chat.deepseek.com> 并**登录你自己的账号**
5. 这个页面左下角会出现一行状态字 —— 装好了

> Chrome 每次启动可能提醒一句「请停用开发者模式扩展」，点保留或关掉都行，不影响使用。
> **`extension/` 这个文件夹在哪？**
>
> 它就在插件的安装目录里，不用去 GitHub 下：
>
> - **网页版（npx）**：`%USERPROFILE%\.dsh\profiles\web\node_modules\dsh-tts-bridge\extension`
> - **桌面版**：`%APPDATA%\dsh-desktop\harness\profiles\web\node_modules\dsh-tts-bridge\extension`
>
> （把上面那行整个复制到资源管理器的地址栏，回车就跳过去了。**如果朗读桥的卡片提示「还差一步」，说明就是这一步没做。**）

### 第三步：第一次先自己点一下朗读（**必做**）

浏览器不信任「程序点的按钮」，只信任**真人点的**。所以第一次用之前：

1. 在 DeepSeek 那个页面里，**用鼠标点一下它自己的「朗读」按钮**（随便点一下页面也行）
2. 之后就一直能出声了 —— 自动念、点我们的 ▶，都不用再点

（这是浏览器定的规矩，绕不过去。哪天又不出声了，再真点一下就好。）
```

</details>

**依据 4 · 源码核查**：[lib/index.js:312-319](https://github.com/Yuuyuko-uu/dsh-tts-bridge/blob/02060a151ade616cbc69a89a8dd63728417408d8/lib/index.js#L312-L319)

自动开关控制完成轮次入队

```text
    // 只认「一整轮说完」的助手文字；工具调用、思考框不念
    const scanTurns = createSessionTurnScanner({
      onCompleted: (text) => {
        remember(text)
        if (state.auto) enqueue(text, false, null)
      },
      onStart: (id, seq) => say('开始盯着 ' + id + '（seq=' + seq + '）'),
      onError: (error, id) => say('读 ' + id + ' 出错：' + (error && error.message)),
```

#### 缺口

- 本轮未验证包发布、宿主或网页
  **影响**：不能认定安装和朗读可立即使用
  **进一步探讨**：固定可审查材料后在隔离 profile 核对手动路径

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 先展示待发送文本是否能减少误发？

**研究主题**：新假设与验证

#### 完整回答

现有路径把完成轮次转成队列，再把文本注入聊天。可验证发送前预览实际文本及账号目标，提供一次确认，是否能在保留听读价值的同时减少误发。对照自动、手动无预览和手动预览，给测试文本加入看似敏感的假数据，统计误发送、有效朗读比例与等待时间。误发送不降或可接受的听读显著减少即否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:294-319](https://github.com/Yuuyuko-uu/dsh-tts-bridge/blob/02060a151ade616cbc69a89a8dd63728417408d8/lib/index.js#L294-L319)

现有队列与自动分支

<details>
<summary>查看原文（26行）</summary>

```text
    const enqueue = (text, force, messageId) => {
      // ⚠⚠ 2026-10-12：这里过一道「去颜文字」（念的时候跳过 ✗→✓）
      const clean = 去颜文字(text)
      if (!clean) return false
      if (state.queue.length >= 6) state.queue.shift()
      state.queue.push({
        id: state.nextId++,
        text: clean,
        force: !!force,
        messageId: messageId ? String(messageId) : null,
        at: Date.now(),
        claimedBy: null,
        claimedAt: 0,
      })
      say('排队 ' + state.queue.length + ' 条：' + clean.slice(0, 40).replace(/\s+/g, ' '))
      return true
    }

    // 只认「一整轮说完」的助手文字；工具调用、思考框不念
    const scanTurns = createSessionTurnScanner({
      onCompleted: (text) => {
        remember(text)
        if (state.auto) enqueue(text, false, null)
      },
      onStart: (id, seq) => say('开始盯着 ' + id + '（seq=' + seq + '）'),
      onError: (error, id) => say('读 ' + id + ' 出错：' + (error && error.message)),
```

</details>

**依据 2 · 源码核查**：[extension/content.js:541-560](https://github.com/Yuuyuko-uu/dsh-tts-bridge/blob/02060a151ade616cbc69a89a8dd63728417408d8/extension/content.js#L541-L560)

网页提交的具体内容和入口

<details>
<summary>查看原文（20行）</summary>

```text
    const payload = PREFIX + text
    const 我方词 = countRefusal(payload)

    input.focus()
    setNativeValue(input, payload)
    await sleep(250)
    check()

    key(input, 'keydown')
    key(input, 'keypress')
    key(input, 'keyup')
    await sleep(900)
    check()
    const clearedByEnter = readInput(input) !== payload
    if (!clearedByEnter) {
      const btn = findSendButton(input)
      if (btn) {
        btn.click()
        await sleep(900)
        check()
```

</details>

#### 缺口

- 预览未验证
  **影响**：无法确认用户是否能及时发现误发
  **进一步探讨**：用合成敏感标记对照发送与完成率

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
