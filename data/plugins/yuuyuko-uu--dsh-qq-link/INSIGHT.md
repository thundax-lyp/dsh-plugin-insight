# dsh-qq-link / 通到 QQ

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[fba7e3e](https://github.com/Yuuyuko-uu/dsh-qq-link/tree/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb)

<!-- BEGIN META -->
[![GitHub ★ 167](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=167&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yuuyuko-uu/dsh-qq-link) [![npm 30d 2,122](https://img.shields.io/static/v1?label=npm+30d&message=2%2C122&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-qq-link) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-qq-link)
<!-- END META -->

> **功能**：通过 OneBot HTTP 后端让 QQ 私聊或群与指定 DSH 会话双向转发文字及支持的媒体。

> **亮点**：它把按聊天水位的入站、会话绑定和完整轮次末尾回发连起来，并显式区分可重试读取与不可撤销followup。[Q01](#research-q01)、[Q02](#research-q02)

> **主要限制**：出站先记本轮已发，部分失败无整体补偿；媒体路径不是硬沙箱，默认也不只回QQ来源，不能仅凭试运行推定无误发。[Q03](#research-q03)、[Q04](#research-q04)

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
  - [Q01 · 双向QQ桥解决什么交接，边界不是“无后端”？](#detail-section-11)
  - [Q02 · QQ消息怎样合并、去重并被DSH受理？](#detail-section-12)
  - [Q03 · DSH回复何时回发，失败是否会自动补发？](#detail-section-13)
  - [Q04 · 管理口、媒体路径和模型门槛保护到哪里？](#detail-section-14)
  - [Q05 · 基础桥、语音和空间工具有哪些独立负担？](#detail-section-15)
  - [Q06 · 现在更适合观察什么，下一步如何验证可靠交接？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有QQ后端、希望从私聊或群延续DSH会话的用户，可配置聊天绑定和转发。

参照手工复制聊天与媒体，本组件自动路由和批量转入；QQ登录、接口与生成能力归外部后端和DSH。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| QQ到DSH转入 | 历史合批送指定会话 | 有限历史窗口，受理不等于回复 |
| DSH到QQ回发 | 完整轮末发送文字及媒体 | 部分成功无整体回滚，默认不只QQ唤醒 |
| qq_reply_gate | 群会话选择不回复 | 模型可选调用、唤醒窗口限制，非认证 |
| qq_space_list | 查QQ说说列表 | 后端扩展接口可用 |
| qq_space_detail | 查单条说说和评论 | 需合法tid和后端权限 |
| qq_space_feeds | 查好友动态 | 后续页可能重复或缺 |
| qq_space_post | 发说说及配图 | 独立开关，默认所有人可见 |
| 可选语音转写 | 将QQ语音交外部命令 | shell执行模板，模型与依赖另备 |
| 通知接入 | 接收戳一戳事件 | 默认关，可选口令，非历史轮询 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22、DSH>=0.2.1-rc.2与服务 | 必需 | 会话、附件、工具和轮询 | 兼容声明不等于本轮验收 |
| 已登录OneBot HTTP QQ后端 | 必需 | 历史、发送与媒体接口 | 不用BOT不等于无后端 |
| 正确绑定会话与QQ号/群号 | 必需 | 双向路由 | 错绑定可能误发 |
| attachments及可视模型 | 图片理解条件 | 图片准入与识别 | 降级文字不代表模型看图 |
| 外部ASR命令、模型和转码工具 | 可选语音条件 | 语音转文字 | 失败或超时，需用户排障 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选测试聊天、独立会话并备份 | 总关、试运行开 |
| 配置 | 用户核后端令牌、绑定和出站门 | 私聊/群方向与媒体开关清楚 |
| 验证 | 用户明确真发少量无敏感消息 | 分别核QQ入站、DSH受理、回复和送达 |
| 恢复 | 用户关总开关并停用 | 核已发内容，部分成功不盲重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | QQ后端、包及可选ASR资源未知 | 账号、绑定、令牌与媒体边界配置 | 非原生无后端直连 |
| 持续 | 轮询、模型回复和媒体存储未知 | 群噪声、权限与收发状态复核 | 无节时与费用对照 |
| 失败恢复 | 部分发送/重试及模型费用未知 | 对照消息id和人工检查已发 | 超时可能已受理，发送账本不完整 |
| 退出 | 本地图片/状态仍保留 | 停用并核QQ已发内容 | 不撤回消息或文件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 双向消息交接 | 历史合批、followup与末尾回发 | 实际送达与正确路由 |
| 入站避免重复 | 受理后存水位和300条id | 崩溃/写盘失败端到端恰好一次 |
| 媒体便利 | 图片、文件路径与附件接线 | 内容是否适合外发及权限边界 |

> **思考**：出站先记本轮已发，部分失败无整体补偿；媒体路径不是硬沙箱，默认也不只回QQ来源，不能仅凭试运行推定无误发。[Q03](#research-q03)、[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把按聊天水位的入站、会话绑定和完整轮次末尾回发连起来，并显式区分可重试读取与不可撤销followup。[Q01](#research-q01)、[Q02](#research-q02)

[Q02](#research-q02) 不给followup超时解锁与受理后立即存水位值得借鉴；[Q03](#research-q03) 外发需更细状态而非只按轮去重。[Q04](#research-q04) 模型门槛不是权限边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

出站先记本轮已发，部分失败无整体补偿；媒体路径不是硬沙箱，默认也不只回QQ来源，不能仅凭试运行推定无误发。[Q03](#research-q03)、[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先保持关闭与试运行，真实验证用独立会话和测试聊天、关闭非必要媒体与空间发布；重要收发仍以人工核对为准。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持双向桥及部分去重恢复；真实后端送达和安全边界未验收，发送账本方向仍是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/host.js、lib/client.js、lib/selfupdate.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定双向桥、群过滤、媒体、管理门和空间工具接线；未执行QQ、ASR、外部安装或发帖，不作安全审计。
- 下一步：测试聊天中按消息id记录读取、受理、回复、送达和部分成功；复核重启、断网与媒体路径边界。

**分析版本**

- **仓库**：[Yuuyuko-uu/dsh-qq-link](https://github.com/Yuuyuko-uu/dsh-qq-link)
- **版本号**：1.5.1（[固定提交 fba7e3e](https://github.com/Yuuyuko-uu/dsh-qq-link/tree/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索分段媒体的持久发送账本与允许根目录，区分后端受理、超时未知及部分成功；以断网、重启和越界路径对照验证，尚未实现。[Q06](#research-q06)

测试聊天中按消息id记录读取、受理、回复、送达和部分成功；复核重启、断网与媒体路径边界。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1457 | — | — | 24126 |
| .js | source | 4 | 4611 | 3700 | 820 | — |
| .mjs | source | 2 | 525 | 437 | 67 | — |
| .mjs | test | 6 | 2679 | 2295 | 309 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Yuuyuko-uu/dsh-qq-link/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：QQ与DSH的双向转发能否正确归属并区分受理、回复和送达，媒体及失败边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 双向QQ桥解决什么交接，边界不是“无后端”？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有QQ账号后端、希望从私聊或群继续DSH角色会话的用户。相对手工复制聊天，本组件按绑定将QQ消息送到指定会话，并在完整轮次结束后把最后正文和支持媒体回发。默认总开关关、试运行开，用户明确启用后才外发。README不用BOT是指不另接机器人事件框架，仍必需OneBot HTTP兼容的QQ后端及其账号在线，不能理解为原生直连QQ。合格结果是正确聊天/会话路由、可辨交付状态且不把不该发的内容送出；模型能力与QQ可用性分别由DSH和后端提供。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-28](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/README.md#L3-L28)

作者双向流程、媒体与默认开关。

<details>
<summary>查看原文（26行）</summary>

```text
让 DSH 里的 **AI 伙伴**和 QQ 连起来：它在 DSH 里说完话，自动发到 QQ。

> 现在两半都做出来了，而且**都不用 BOT**：
> - `DSH → QQ`：伙伴说话 → 发到 QQ。
> - `QQ → DSH`：你在 QQ 里发话，插件自己轮询那个 QQ 后端收进来 → 转进 DSH。只要一个后端就够。

## 现在的行为

- 盯**两间屋**（都可以选，也可以只选一间）：**私聊会话** 和 **群会话**。
  QQ 私聊进来的话进私聊那间，群里的话进群那间；**哪间屋说的话就只回那一边**（私聊的话不会跑到群里）。
  两行选了同一间屋也能用，但那就等于「两边都发」——设置页会当场提示。
- `DSH → QQ`：它在某**一整轮的最后一句**说完，就把这句原文发到 QQ（走 QQ 后端的 `3000`）。
- `QQ → DSH`：插件每 4 秒轮询 QQ 后端（`get_friend_msg_history` / `get_group_msg_history`），
  发现你在 QQ 里新发的消息 → 转进目标会话，让它照常开一轮。
- 发/收都只走这个 QQ 后端的 HTTP 接口（默认 `127.0.0.1:3000`）。
- **语音条也能变成字**（可选）：设置里填一条「读 `{file}` 打一行字」的命令，QQ 语音就会被转写成文字；插件本身不带模型，仓库里附了 `tools/asr_cli.py`（SenseVoice）。
- **收进来的东西不只有文字**：图片、表情包、`@某人`、**分享卡片**（B站 视频卡片会把标题和 BV 号写出来）、
  **合并转发的聊天记录**（会去取内容压成「谁：说了什么」几行；**里面还套着转发也会展开**，最多 2 层）都会变成文字转给它。
  转发里的图跟着「收图」开关走：开着就收**第一层**那几张（跟顶层图共用张数上限），关着只记 `[图片]`；第二层起一律只记 `[图片]`。
- **图片两个方向都能传**：你在 QQ 里发的图会转给它看；它这一轮里发的图也会发到 QQ。
  收进来的图会在 `~/.dsh/qq-bridge-inbox/` 存一份，文字里带上路径。
  回发同一张图时用的是这份**原图** —— DSH 自己那份副本会被重新编码，GIF 动图会变静态 webp。
- **正文里写的 markdown 图也算**：它写 `![小肥鱼](_stickers/feiyu-test.webp)`（贴纸就是这么发的），
  会被读成本地图片发到 QQ，那串 markdown 不会露出来。相对路径按「图片根目录」找 —— **留空就行**，会自动用目标会话所在的那个工作区。
  ⚠️ 它到底能不能**看见**图，取决于那个会话用的模型：能看图的模型直接看，纯文本模型只会收到一句占位文字。
- 安全默认：**总开关 = 关、试运行 = 开** —— 不手动打开，一句都不会真的发到 QQ。
```

</details>

**依据 2 · 源码核查**：[lib/host.js:31-68](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L31-L68)

实际默认配置及出站限制。

<details>
<summary>查看原文（38行）</summary>

```text
const 默认配置 = {
  总开关: false, // 关着 = 一句都不发（安全默认）
  试运行: true, // 开着 = 只记账、不真发到 QQ
  目标会话: '', // ⚠️ 老字段（= 私聊会话）。还认，读的时候会搬进「私聊会话」
  私聊会话: '', // ⭐ QQ 私聊那一路进哪一间（2026-10-25 拆开）
  群会话: '', //   ⭐ QQ 群里那一路进哪一间（可以留空 = 不看群）
  私聊QQ: '', // 发到哪个私聊（QQ 号，字符串）
  群号: '', // 发到哪个群（可空）
  转私聊: true,
  转群: false,
  NapCat: 'http://127.0.0.1:3000', // OneBot HTTP 接口
  令牌: '', // ⭐ access_token（2026-10-25）：NapCat / SnowLuma 开了鉴权就填这里，留空 = 不鉴权
  // ⭐ 2026-10-22：图片两个方向
  收图: true, // QQ → DSH：她发的图片也转进来
  收图最多: 4, // 一条消息最多转几张
  发图: true, // DSH → QQ：伙伴发的图片也发过去
  // ⭐ 1.4.5：正文里的 `[名字](路径)` 当文件发（走 OneBot 的 upload_*_file）。
  //   跟「发图」一样默认开 —— 不开的话模型写了路径也传不出去，很难想到是这个开关。
  发文件: true,
  文件上限MB: 50, // 单个文件最大多少 MB；超了只发一句说明，不硬发
  // ⭐ 1.4.5：文件**只往私聊发**，群里不发。默认开 —— 大群里发文件容易出幺蛾子
  //   （群文件权限、刷屏、审核），私聊最稳。想在群里也发，把这个改成 false。
  文件仅私聊: true,
  图上限MB: 5, // 单张最大多少 MB（两个方向共用）
  图片根目录: '', // 正文里 `![名字](相对路径)` 按哪个目录去找（留空 = 自动猜）
  称呼: '对方', // ⭐ 私聊时怎么称呼跟它说话的那个人（写进转给它的文案里，比如「小明发来了图片」）
  // ⭐ 1.4.4：群里除了 @ 和引用，**正文里直接叫名字**也算点名（逗号/空格分隔；留空 = 不启用）。
  //   为什么要有：有人会直接说「让它帮我干活」「去问问它」，既没 @ 也没引用 ——
  //   那种以前只能靠「回复概率」掷骰子，大概率被丢掉，而用户看到的是「名字被叫了却没回应」。
  点名关键词: '',
  回复门槛: false, // ⚠ 已废弃（2026-10-25）：门槛改成「按绑定行走」——老配置里是 true 的会在迁移时变成那一行的门槛
  // ⭐ 0.7.0（用户 GAME-66 的建议，issue #2）出站两个闸，默认都关
  只发标记内: false, // 开着 = 只发正文里 [QQ]…[/QQ] 那一段（块外的解释/路径/思考留在本地）
  只回QQ唤醒: false, // 开着 = 只有「这一轮是被 QQ 消息叫醒的」才发（你在 DSH 里自己聊的不推到手机）
  // ⭐ 1.4.4：「只回 QQ 唤醒」开着时，自动触发的轮次（主动搭话、到点刷 B 站）要不要也推到手机。
  //   关着（默认）= 跟以前一样，只有落在 QQ 唤醒窗口里的才发；开着 = 那几种自动触发一律发。
  //   ⚠ 你自己在 DSH 窗口里打的字**永远**不发 —— 那才是「只回 QQ 唤醒」本来要挡的东西。
  自动触发也发: false,
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · QQ消息怎样合并、去重并被DSH受理？

**研究主题**：功能与机制

#### 完整回答

轮询入口用单个收消息任务互斥，历史等可重试读取设5/8秒含body截止；不对不可撤销followup超时解锁。按聊天类型和号码分别拉私聊10条/群30条，首次水位取当前时间，过滤旧时间、已转id、自己发言；群按点名/接听尾窗/例外和全听配置收，不能沿旧注释说只收主人。短时间同人消息合批，群有概率和节流，受理后立即更新id与水位并合并保存。content可经attachments准入，失败退文字；followup使用qq来源并await，成功回调在flush之前记账，避免迟到flush导致重复。这个保证到宿主受理，不等于模型已经答复或最终QQ送达。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:3320-3347](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L3320-L3347)

收消息任务互斥。

<details>
<summary>查看原文（28行）</summary>

```text
  let 收消息任务 = null
  let 已停止 = false
  let 当前控制 = null
  const 清补跑 = () => { if (补跑定时) clearTimeout(补跑定时); 补跑定时 = null }
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

**依据 2 · 源码核查**：[lib/host.js:3376-3411](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L3376-L3411)

可重试读取截止。

<details>
<summary>查看原文（36行）</summary>

```text
    // 1.0.7：历史/转发等读取 8 秒，登录号 5 秒；下一跳（默认 2 秒）可重试。
    // 截止时间包含 fetch 和 JSON body；即使适配器忽略 abort，也不能锁住后续轮询。
    // 只取消可重试的读取，绝不给不可撤回的 followup 设置超时解锁。
    const 拉JSON = async (action, 体) => {
      if (信号.aborted) throw 信号.reason || new Error('收消息已停止')
      let 停止
      const 中止 = new Promise((resolve, reject) => {
        停止 = () => reject(信号.reason || new Error('收消息已停止'))
        信号.addEventListener('abort', 停止, { once: true })
      })
      const 超时毫秒 = action === 'get_login_info' ? 5000 : 8000
      const 定时 = setTimeout(() => 控制.abort(new Error(`QQ 收消息请求超时（${超时毫秒 / 1000} 秒）`)), 超时毫秒)
      try {
        return await Promise.race([(async () => {
          const r = await fetch(配置.NapCat + '/' + action, {
            signal: 信号, method: 'POST', headers: 请求头(配置), body: JSON.stringify(体 || {}),
          })
          return await r.json()
        })(), 中止])
      } finally {
        clearTimeout(定时)
        信号.removeEventListener('abort', 停止)
      }
    }
    const 拉 = async (action, 体) => {
      try {
        const j = await 拉JSON(action, 体)
        return j && j.status === 'ok' && Array.isArray(j.data && j.data.messages) ? j.data.messages : []
      } catch (error) { return [] }
    }
    // 合并转发 / get_record 返回 data，和历史接口的 data.messages 不同。
    const 拉任意 = async (action, 体) => {
      try {
        const j = await 拉JSON(action, 体)
        return (j && j.status === 'ok' && j.data) || null
      } catch (error) { return null }
```

</details>

**依据 3 · 源码核查**：[lib/host.js:3483-3498](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L3483-L3498)

有限历史与首次水位。

<details>
<summary>查看原文（16行）</summary>

```text
    // ⭐ 0.6.0：一行一行地拉 —— 一个聊天 → 一间会话，各自记各自的「看到哪儿了」
    for (const 行 of 配置.绑定) {
      if (信号.aborted) return
      // ⭐ 1.1.8：这一行被关掉了 —— 不收也不发，配置留着
      if (行.开 === false) continue
      const 是群 = 行.类型 === '群'
      const 动作 = 是群 ? 'get_group_msg_history' : 'get_friend_msg_history'
      const 体 = 是群
        ? { group_id: Number(行.号码), count: 30 }
        : { user_id: Number(行.号码), count: 10 }
      const 列表 = await 拉(动作, 体)
      if (信号.aborted) return
      const 键2 = 行.类型 + ':' + 行.号码
      // ⚠️ 没记录过这个聊天（比如刚加绑定 / 第一次跑）时，从**此刻**开始算 ——
      //   否则历史消息会全被当成新的补投一遍。
      let 上次 = 上次时间.has(键2) ? (上次时间.get(键2) || 0) : Math.floor(Date.now() / 1000)
```

</details>

**依据 4 · 源码核查**：[lib/host.js:3536-3565](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L3536-L3565)

群节流、合批和受理回调。

<details>
<summary>查看原文（30行）</summary>

```text
        // ⭐ 1.0.9：群聊的节奏。
        // ⭐ 1.1.7：**@ 它的也照样排队** —— 以前点名直接穿过去，群里一有人 @ 它，冷却和
        //   「一分钟最多几条」就等于没有，看起来就是「没有冷却、刷屏」。现在只是晚几秒回，不会漏。
        if (是群行) {
          const 闸 = 群闸(键2, 配置)
          if (闸.等毫秒 > 0) {
            快跑一次(Math.min(3000, Math.max(300, Math.round(闸.等毫秒) + 200)))
            return false    // 还没到点 —— 这一批留着，别丢
          }
        }
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
```

</details>

**依据 5 · 源码核查**：[lib/host.js:3570-3615](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L3570-L3615)

实际入站过滤与群点名后续。

<details>
<summary>查看原文（46行）</summary>

```text
        // ⚠️ 这两条要放在「点名 / 接听」那道过滤**前面**（都不用等、也不解析正文）：
        //   拉回来的历史里一直躺着已经转过的旧消息，先滤掉它们，接听的条数才不会被旧消息吃掉。
        if ((条.time || 0) < 上次) continue           // 旧的，跳过
        if (已转消息.has(条.message_id) || 攒?.ids.includes(条.message_id)) continue // 转过了或已在本批里
        // 私聊：只认对面那个号；群：只认你自己—— 别人的话不转（防噪音，也防被别人的话牵着走）
        if (!是群) {
          // 私聊：只认对面那个号
          if (!本人号 || Number(条.user_id) !== Number(行.号码)) continue
        } else {
          // ⭐ 0.9.9（别处报的「群里 @ 大肥鱼 不理人」）：群里以前**只收她自己发的**，
          //    别人 @ 它、引用它的消息**根本没转进来**（连门槛都没机会判）。
          //    现在：别人的消息**只要点了名（@ 我 / 引用我）就收**；想收全群的话把
          //    「群里也听别人的话」打开。
          // ⭐ 1.1.6（issue #14）：**机器人自己发出去的话绝不能再收回来** ——
          //   开了「听所有人」之后，它的回话会被当成群友的话再转进来，一句话能无限套娃。
          try {
            const 机器人号 = await 拿自己QQ(拉JSON)
            if (机器人号 && String(条.user_id) === String(机器人号)) continue
          } catch (error) {}
          // ⭐ 1.1.8：这一行自己说了算（只听点名 / 全听），没说才跟全局走
          const 全听 = 行.只听点名 == null ? Boolean(配置.群里听所有人) : !行.只听点名
          if (!全听) {
            // ⭐ 1.4.3：「只听点名」对**群里所有人**生效 —— 以前自己发的会跳过这道过滤
            //   （`自己的` 那个短路），于是在群里随手发的东西也会被当成对着它说话收进来。
            //   例外只写在每行的「点名例外」名单里；名单里的人直接收，但**不算点名**
            //   （不触发「点名必回」，也不消耗接听条数）。
            const 在例外 = 在点名例外名单(行.点名例外, 条.user_id)
            if (!在例外) {
              const 试 = await 条转片段(条)
              if (信号.aborted) return
              // ⭐ 1.4.1：点了名 → 收，并且把这个群开成「接着听」；接听中进来的普通消息也收，
              //    每收一条减一条，条数用光 / 超时自己就退回「只听点名」（规则在 该收这条 里）。
              //    ⚠ 接听中进来的话**不算点名**：点名只看 @ / 引用，它不会把条数又重置一遍。
              const 判 = 该收这条({
                全听: false,
                点名: 试.点名,
                接听: 接听中.get(键2) || null,
                条: 配置.点名后接听条,
                秒: 配置.点名后接听秒,
                现在: Date.now(),
              })
              if (判.接听) 接听中.set(键2, 判.接听)
              else 接听中.delete(键2)
              if (!判.收) continue
            }
          }
```

</details>

**依据 6 · 源码核查**：[lib/host.js:2450-2496](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L2450-L2496)

附件降级与真实followup。

<details>
<summary>查看原文（47行）</summary>

```text
    let content = [{ type: 'text', text: 文案 }]
    if (收下.length) {
      const 附件 = ctx.attachments || ctx.get('attachments')
      if (附件 && typeof 附件.admitPromptContent === 'function') {
        try {
          const 待 = content.concat(收下.map((x, i) => ({
            type: 'image', data: x.b64, mediaType: x.类, name: `qq-${消息id || 'x'}-${i + 1}.${扩展(x.类)}`,
          })))
          content = await 附件.admitPromptContent(待)
          // ⭐ 记下「附件 id / DSH 那份只读副本 → 我们存的原图」，回发时换回原图（GIF 不会变静态 webp）
          const 图块 = content.filter((x) => x && x.type === 'image' && x.attachment)
          for (let i = 0; i < 图块.length && i < 收下.length; i++) {
            let 副本 = ''
            try { 副本 = typeof 附件.imageHostPath === 'function' ? String(附件.imageHostPath(图块[i].attachment) || '') : '' } catch (error) {}
            记收图(图块[i].attachment && 图块[i].attachment.attachmentId, 副本, 收下[i].存)
          }
        } catch (error) {
          记账('图交给 DSH 没成功（这轮只转文字）：' + String((error && error.message) || error))
          content = [{ type: 'text', text: 文案 }]
        }
      } else {
        记账('宿主没有 attachments 服务，图只能存本地（文字里已经给了路径）')
      }
    }

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · DSH回复何时回发，失败是否会自动补发？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

assistant/message只缓存本轮最后非空正文或图片，turn/end需completed、轮号匹配且未发过才回发；先把会话:轮号加入已发集合，再执行出站门和异步发送。出站按绑定匹配聊天，可选只发QQ标记块与只回QQ唤醒；默认两项都关，所以本地会话的普通最终回答也可能外发，不能把双向桥当仅QQ来源回信。试运行只记录拟发内容，不能证明真实发送。OneBot发送有60秒超时和返回状态检查，但部分分段/图片/文件成功后其他失败没有整体回滚，且本轮已标记不会由turn/end自动重投；超时也可能后端已受理，不能无脑重试。入站水位直接写盘且异常静默，崩溃或写盘失败不构成端到端恰好一次协议。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:1530-1540](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L1530-L1540)

最后正文/图片缓存。

<details>
<summary>查看原文（11行）</summary>

```text
    if (event && event.type === 'assistant/message') {
      const d = event.data || {}
      if (d.interrupted) {
        记上一轮(空轮())
        return
      }
      const 文 = String(提取正文(d.message) || '').trim()
      const 图们 = 提取图块(d.message)
      if (文) 记上一轮({ 轮号: d.turn, 文本: 文, 图们 })
      // ⭐ 有的回合是先出图、后出字（或只出图）：别把图丢了
      else if (图们.length) 记上一轮({ 轮号: d.turn, 文本: 上一轮.轮号 === d.turn ? 上一轮.文本 : '', 图们: (上一轮.轮号 === d.turn ? 上一轮.图们 : []).concat(图们).slice(0, 10) })
```

</details>

**依据 2 · 源码核查**：[lib/host.js:1569-1614](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L1569-L1614)

先记已发再异步执行。

<details>
<summary>查看原文（46行）</summary>

```text
    if (event && event.type === 'turn/end') {
      const d = event.data || {}
      const 完成 = !!(d.reason && d.reason.kind === 'completed')
      // ⭐ 1.4.8（issue #27）：静默标记只对**触发它的那一轮**有效，这一轮一结束就作废。
      //   以前只在「这一轮真的说完了话」那条路上清，下面两种情况都清不掉：
      //     · 门槛判了不接 → 这一轮是被 cancel 停的，turn/end 是 aborted（完成 = false）
      //     · 这一轮一个字都没说出来（没有内容）
      //   标记于是漏到下一轮，下一轮 completed 时被当成「判定过的不接」整轮跳过。
      const 这轮静默 = 静默轮.has(键)
      if (这轮静默) 静默轮.delete(键)
      const 有东西 = 上一轮.文本 || (上一轮.图们 && 上一轮.图们.length)
      // ⚠ 去重的键必须是「会话 + 轮号」：只按轮号的话，换过目标会话就会静默漏发
      const 轮标 = 键 + ':' + String(d.turn)
      if (完成 && 上一轮.轮号 === d.turn && 有东西 && !已发轮.has(轮标)) {
        已发轮.add(轮标)
        // ⚠️ 「这轮是不是 QQ 叫的」在**这里**算一次就消费掉 —— 不然 10 分钟的窗口会把
        //    后面别的轮次也当成 QQ 叫的（实测踩过：群里一条旧消息叫醒之后，之后几轮都往外发）。
        const 醒 = 唤醒时间.get(键) || null
        const 醒着 = Boolean(醒 && 醒.时 && Date.now() - 醒.时 < QqWalake窗口)
        // ⭐ 1.0.1（issue #6）：这次真被 QQ 唤醒 → 给它留一条尾巴，
        //    「这次触发」下面紧接着的几轮也照样往外发（以前只有第一轮能出去）。
        if (醒着) {
          const 尾巴毫秒 = Math.max(0, Number(读配置().唤醒尾巴秒) || 0) * 1000
          if (尾巴毫秒 > 0) 尾巴.set(键, Date.now() + 尾巴毫秒)
        }
        唤醒时间.delete(键)
        const 尾到 = 尾巴.get(键) || 0
        const 是QQ唤醒 = 醒着 || 尾到 > Date.now()
        if (尾到 && 尾到 <= Date.now()) 尾巴.delete(键)
        // ⭐ 1.4.4：这一轮是谁起的头（'qq' / 'speak-up' / 'user' / 别的）
        //   ⚠ 只有**真的收到过 user/message 事件**才下结论；没记录就按老逻辑走（不能误挡）。
        const 有来源 = 轮来源.has(键)
        const 来源 = 轮来源.get(键) || ''
        // ⭐ 1.4.7：这一轮里只要**出现过** qq 来源，后面来的注入就盖不掉它
        const 这轮来过QQ = 本轮有QQ.get(键) === true
        轮来源.delete(键)
        本轮有QQ.delete(键)
        const 是本地手打 = !这轮来过QQ && 有来源 && (来源 === 'user' || 来源 === '')
        // 门槛判了「不接」→ 这一轮一个字都不往外发（但会话里照常留着）
        if (这轮静默) {
          记账('回复门槛：这一轮按判定跳过发送（' + 短id(键) + '）')
        } else {
          void 落地一发(配置, 上一轮.文本, 上一轮.图们, 方向, 是QQ唤醒, 是本地手打)
        }
      }
      记上一轮(空轮())
```

</details>

**依据 3 · 源码核查**：[lib/host.js:1462-1505](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L1462-L1505)

出站门、试运行和结果记录。

<details>
<summary>查看原文（44行）</summary>

```text
    if (!配置.总开关) return 记账('总开关关着，这轮该转但没转')
    // ⭐ 0.7.0 出站闸一：只发 [QQ]…[/QQ] 里的那一段（块外的解释/路径/思考留在本地）
    // ⭐ 1.0.4：标记本身永远不往 QQ 里发；只写了开头没写结尾也照发（见 抠QQ标记）
    const 标记 = 抠QQ标记(文字, 配置.只发标记内)
    if (!标记.发) {
      记账('这一轮没写 [QQ]…[/QQ] 块（「只发标记内」开着）—— 这轮不往 QQ 发')
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
    }
```

</details>

**依据 4 · 源码核查**：[lib/host.js:1171-1190](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L1171-L1190)

OneBot发送超时与返回检查。

<details>
<summary>查看原文（20行）</summary>

```text
  const 发送超时毫秒 = 60000

  async function 发一个(base, action, 体, 配置) {
    try {
      const r = await fetch(`${base}/${action}`, {
        method: 'POST',
        headers: 请求头(配置),
        body: JSON.stringify(体),
        // ⭐ 1.5.0：NapCat 收了请求却不回时，别让这一轮永远挂着（以前没有超时）
        signal: AbortSignal.timeout(发送超时毫秒),
      })
      const j = await r.json()
      const 好 = !!(j && j.status === 'ok' && j.retcode === 0)
      try {
        const 新id = j && j.data ? (j.data.message_id != null ? j.data.message_id : j.data.messageId) : null
        if (好 && 新id != null) 记己方消息(新id)
      } catch (error) {}
      return { action, ok: 好, 数据: j }
    } catch (error) {
      return { action, ok: false, 数据: { 错: String((error && error.message) || error) } }
```

</details>

**依据 5 · 源码核查**：[lib/host.js:1129-1144](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L1129-L1144)

水位合并写与静默失败。

<details>
<summary>查看原文（16行）</summary>

```text
  const 存水位 = (成功) => {
    try {
      // 卸载中的旧实例也可能刚被宿主受理；只合并成功这批，不能覆盖新实例的进度。
      let 盘 = {}
      try { 盘 = JSON.parse(readFileSync(状态文件, 'utf8')) || {} } catch (error) {}
      const 上次 = { ...(盘.上次 || {}) }
      const 合并时间 = (键, 值) => { 上次[键] = Math.max(Number(上次[键]) || 0, Number(值) || 0) }
      if (成功) 合并时间(成功.键, 成功.时间)
      else for (const [键, 值] of 上次时间) 合并时间(键, 值)
      const 盘已转 = Array.isArray(盘.已转) ? 盘.已转 : []
      // 正常收尾以磁盘最近的成功记录为准；迟到成功只追加自己的这批消息 id。
      const 全已转 = 成功 ? [...盘已转, ...成功.ids] : [...已转消息, ...盘已转]
      writeFileSync(状态文件, JSON.stringify({
        上次, 已转: [...new Set(全已转)].slice(-300),
      }, null, 2), 'utf8')
    } catch (error) { /* 存不下不影响转消息 */ }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 管理口、媒体路径和模型门槛保护到哪里？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

管理门仅在connection明确401/403才拒，服务缺失或异常放行；/receive公开绕过该门，/notice也以可选口令处理通知，实际访问仍依赖Host前置网络策略，源码不足以断言已被外站调用，也不能称都已鉴权。本地图可使用绝对路径，相对路径会找多个工作区、cwd和home，不是以图片根目录为硬沙箱；文件同样可读真实绝对路径后按大小限制发送。模型若生成不当Markdown路径，开启外发后可能把本机内容发出，需独立会话和明确媒体边界。qq_reply_gate只在绑定群和唤醒窗口起效，点名直接放行，模型判断不回时可仅静默或下一tick cancel，不能替代身份/工具权限或保证不消耗前面Token。可借鉴对不可撤销投递保持互斥与先受理记账，但不要把概率/门槛当安全认证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:1078-1090](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L1078-L1090)

管理门失败放行。

<details>
<summary>查看原文（13行）</summary>

```text
  const 只认本人 = (handler) => async (req, res) => {
    try {
      const 连接 = ctx.get('connection')
      const 拒 = 连接 && typeof 连接.requestRejection === 'function' ? 连接.requestRejection(req) : undefined
      if (拒 === 401 || 拒 === 403) {
        记账('管理接口拒了一次外来请求（' + 拒 + '）：' + String((req && req.url) || ''))
        回(res, { ok: false, 说: 拒 === 401 ? 'authentication_required' : 'management_forbidden' })
        return
      }
    } catch (error) {
      // 鉴权这条路自己坏了 → 放行，绝不让设置页打不开
    }
    return handler(req, res)
```

</details>

**依据 2 · 源码核查**：[lib/host.js:2000-2014](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L2000-L2014)

公开路由绕过主人门。

<details>
<summary>查看原文（15行）</summary>

```text
  const 路线 = (路径, handler, 选项 = {}) =>
    ctx.effect(() =>
      ctx.webServer.register({
        kind: 'exact',
        path: 路径,
        handler: async (req, res) => {
          try {
            // ⭐ 1.5.0：管理类接口默认只认本人；
            //   `/receive` 是「外面往插件里推消息」的数据口，不走这道门（不然接不进来）
            const 跑 = 选项.公开 ? handler : 只认本人(handler)
            await 跑(req, res)
          } catch (error) {
            回(res, { ok: false, 说: String((error && error.message) || error) })
          }
        },
```

</details>

**依据 3 · 源码核查**：[lib/host.js:3718-3745](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L3718-L3745)

receive与通知可选口令。

<details>
<summary>查看原文（28行）</summary>

```text
  路线(`${路由前缀}/receive`, async (req, res) => {
    const 来 = await 读体(req)
    const 文字 = typeof 来.text === 'string' ? 来.text.trim() : ''
    if (!文字) return 回(res, { ok: false, 说: '没有文字（body 里给 text）' })
    回(res, await 转入文字(文字))
  }, { 公开: true })

  /**
   * ⭐ 1.5.0（issue #29）：收**通知类事件**（戳一戳这种）。
   *
   * 为什么以前收不到：插件的收消息是**轮询历史消息**，而「戳一戳」不是消息，
   *   OneBot 那边只通过 **HTTP 上报（POST）** 推出来 —— 拉历史永远拉不到。
   *
   * 用法：把 NapCat / SnowLuma 的「HTTP 上报」地址指到
   *   `http://127.0.0.1:<DSH 端口>/dsh-qq-bridge/notice`（口令非空时再加 `?token=xxx`）。
   *   ⚠ 上报会把**所有**事件都推过来，我们**只认 notice**，其它一律忽略 ——
   *     不然消息会跟轮询重复，一条话进来两次。
   */
  const 通知去重 = new Map()   // 事件指纹 -> 时间（只留最近 200 条）
  路线(`${路由前缀}/notice`, async (req, res) => {
    const 配置 = 读配置()
    if (!配置.收通知) return 回(res, { ok: false, 说: '「收通知」关着，先在设置里打开' })
    const 口令 = String(配置.通知口令 || '').trim()
    if (口令) {
      let 给 = String(((req && req.url) || '').match(/[?&]token=([^&]*)/)?.[1] || (req && req.headers && req.headers['x-token']) || '')
      try { 给 = decodeURIComponent(给) } catch (error) {}
      if (给 !== 口令) return 回(res, { ok: false, 说: '口令不对' })
    }
```

</details>

**依据 4 · 源码核查**：[lib/host.js:1211-1240](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L1211-L1240)

图片多根与绝对路径。

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

**依据 5 · 源码核查**：[lib/host.js:1344-1366](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L1344-L1366)

文件真实路径和大小限制。

<details>
<summary>查看原文（23行）</summary>

```text
    // ⭐ 1.5.0：文件先验一遍 —— 得真存在、不能超过上限。
    //   找不到 / 太大都记一笔（不然人以为发了，其实什么都没出去）。
    const 文件上限 = Math.max(1, Math.min(Number(配置.文件上限MB) || 50, 2048)) * 1024 * 1024
    const 要发的文件 = []
    for (const f of 抠文件.文件) {
      try {
        const 候选路 = isAbsolute(f.value) ? [f.value] : [f.value, join(process.cwd(), f.value)]
        let 真 = null
        for (const p of 候选路) {
          try {
            if (existsSync(p) && statSync(p).isFile()) { 真 = realpathSync(p); break }
          } catch (error) { /* 试下一个 */ }
        }
        if (!真) { 记账('文件「' + (f.label || f.value) + '」在本机找不到，跳过（这条不会发出去）'); continue }
        const 大小 = statSync(真).size
        if (大小 > 文件上限) {
          记账('文件「' + basename(真) + '」有 ' + Math.round(大小 / 1048576) + 'MB，超过上限 ' + 配置.文件上限MB + 'MB，跳过')
          continue
        }
        if (要发的文件.some((x) => x.path === 真)) continue
        // 名字：标签带后缀就用标签（人是照着标签认的），否则用真实文件名
        const 名 = f.label && /\.[A-Za-z0-9]{1,8}$/.test(f.label) ? f.label : basename(真)
        要发的文件.push({ path: 真, name: 名 })
```

</details>

**依据 6 · 源码核查**：[lib/host.js:2709-2760](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L2709-L2760)

群门槛的窗口、点名和cancel条件。

<details>
<summary>查看原文（52行）</summary>

```text
    async execute(args) {
      const 配置 = 读配置()
      const 这行 = (配置.绑定 || []).find((b) => 会话键(b.会话) === sid) || null
      // ⭐ 0.9.9：门槛**只对群有效**。私聊一行根本没有门槛开关，调了也一律放行。
      if (!这行 || !这行.门槛 || 这行.类型 !== '群') {
        唤醒时间.delete(sid)
        return { ok: true, 说: '这个聊天没开门槛（门槛只对群有效），正常回就行。' }
      }
      const 醒 = 唤醒时间.get(sid) || null
      if (!(醒 && 醒.时 && Date.now() - 醒.时 < QqWalake窗口)) {
        return { ok: true, 说: '这一轮不是 QQ 消息叫起来的，正常回就行。' }
      }
      // ⭐ 0.9.9（别处报的「群里 @ 大肥鱼 不理人」）：**点了名的直接放行**，不让模型犹豫。
      if (醒.点名) {
        唤醒时间.delete(sid)
        记账('回复门槛：这轮点了名（@ 我 / 引用我），直接放行（' + 短id(sid) + '）')
        return { ok: true, 说: '这条点了你的名（或引用了你的话），就是冲你来的，直接正常回。' }
      }
      // 唤醒类型不是群（极少见：同一间会话既绑私聊又绑群）→ 也放行
      if (醒.类型 && 醒.类型 !== '群') {
        唤醒时间.delete(sid)
        return { ok: true, 说: '这一轮是私聊叫的，不用判，正常回。' }
      }
      // ⚠️ 2026-10-25：模型有时把布尔传成字符串 "false"，严格 !== false 会判成"要正常回"。
      //    现在两种写法都认（false / "false" / 0 / "0" 都算"不接"）。
      const 值 = args ? args.reply : undefined
      const 不接 = 值 === false || 值 === 0 || String(值).toLowerCase() === 'false' || String(值) === '0'
      if (!不接) {
        唤醒时间.delete(sid)
        return { ok: true, 说: '好，这条是冲我来的，正常回' }
      }
      唤醒时间.delete(sid)
      静默轮.add(sid)
      const 理由 = String((args && args.reason) || '').trim()
      记账('回复门槛：判定这条不是在跟我说话 → 这轮不回 QQ（' + 短id(sid) + '）' + (理由 ? '，理由：' + 理由 : ''))
      // ⭐ 2026-10-25 第二版（她指出的）：**「停轮」本来就是靠 cancel 实现的** ——
      //    不 cancel 只是掐掉出站，模型还会继续想、继续调工具，白烧 token。
      //    所以要真停，但别让界面显示成 `Error: tool call aborted`：
      //    **先让这个工具正常返回，再在下一个 tick 去 cancel** —— 工具结果已经落地，
      //    就不会被标成 aborted；随后这一轮才被停下。
      静默轮.add(sid)
      const 真停 = Boolean(读配置().门槛真停轮)
      if (!真停) {
        记账('回复门槛：这轮不接（只掐出站；「真停轮」关着）')
        return { ok: true, 说: '好，这轮不接 —— 到此为止，不用再说任何话。' }
      }
      setTimeout(() => {
        try {
          if (typeof agent.cancel === 'function') {
            Promise.resolve(agent.cancel({ kind: 'user' })).catch((error) => {
              记账('   cancel 报错：' + String((error && error.message) || error))
            })
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 基础桥、语音和空间工具有哪些独立负担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

package要求Node>=22、DSH>=0.2.1-rc.2，作者另声明rc.3兼容；需要agents、sessions、timer、webServer等和已登录OneBot后端，令牌由用户配置，真实后端API差异需核对。语音转写可选外部命令模板，经shell:true执行并有超时，不自带模型，Python/模型/ffmpeg等按实际方案安装和维护；不把源码中的安装辅助等同本轮已安装。空间四工具分别列说说、看详情评论、好友动态、发说说，动态分页有重复/缺失提示，发帖需单独允许开关且默认可见范围为所有人，属于额外外部发布能力。更新入口可调用宿主管理器，配置和本地图片/状态需备份。持续成本为轮询、模型回复、可选ASR和媒体存储；没有金额/耗时对照，群噪声及失败恢复会增加人工核对，停用不能撤回已发消息和文件。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:6-10](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/package.json#L6-L10)

版本条件。

```text
  "engines": {
    "node": ">=22",
    "dsh": ">=0.2.1-rc.2"
  },
  "type": "module",
```

**依据 2 · 源码核查**：[lib/host.js:19-22](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L19-L22)

Host实际服务依赖。

```text
export const name = 'qq-bridge'

/** 需要宿主提供：webServer（路由）+ sessions/sessionTitle（目标会话清单 + 标题）+ agents（followup）+ timer（轮询收消息）+ attachments（图片）。 */
export const inject = ['agents', 'sessions', 'sessionTitle', 'webServer', 'timer', 'workspaceRegistry', 'attachments', 'tools']
```

**依据 3 · 源码核查**：[lib/host.js:198-224](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L198-L224)

转写命令shell执行和超时。

<details>
<summary>查看原文（27行）</summary>

```text
function 跑命令(模板, 文件, 超时秒) {
  return new Promise((resolve) => {
    const 命令 = String(模板 || '').replace(/\{file\}/g, 文件)
    let 出 = ''
    let 错 = ''
    let 收过 = false
    const 收 = (v) => { if (收过) return; 收过 = true; resolve(v) }
    let 子 = null
    try {
      子 = spawn(命令, {
        shell: true, windowsHide: true,
        env: { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' },
      })
    } catch (error) {
      return 收({ ok: false, 错: String((error && error.message) || error) })
    }
    const 定时 = setTimeout(() => {
      try { 子.kill() } catch (error) {}
      收({ ok: false, 错: '超时（' + 超时秒 + ' 秒）' })
    }, Math.max(5, Number(超时秒) || 60) * 1000)
    子.stdout.on('data', (c) => { 出 += c })
    子.stderr.on('data', (c) => { 错 += c })
    子.on('error', (error) => { clearTimeout(定时); 收({ ok: false, 错: String((error && error.message) || error) }) })
    子.on('close', (码) => {
      clearTimeout(定时)
      收({ ok: 码 === 0, 文字: 出.trim(), 错: (错.trim() || ('退出码 ' + 码)) })
    })
```

</details>

**依据 4 · 源码核查**：[lib/host.js:2910-2937](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L2910-L2937)

空间列表真实调用。

<details>
<summary>查看原文（28行）</summary>

```text
      name: 'qq_space_list',
      description: '看 QQ 空间里的说说：时间、正文（长文会截断）、评论数、是不是私密、带几张图，每条前面有 tid。',
      parameters: {
        type: 'object',
        properties: {
          qq: { type: 'string', description: '看谁的 QQ 空间（QQ 号）。不填 = 机器人自己的' },
          num: { type: 'integer', minimum: 1, maximum: 50, description: '最多看几条，默认 10' },
          pos: { type: 'integer', minimum: 0, description: '从第几条开始（0 = 最新那条），默认 0' },
        },
        additionalProperties: false,
      },
      output: 空间输出(),
      async execute(args = {}) {
        const 配置 = 读配置()
        const 条数 = Math.max(1, Math.min(Math.round(Number(args.num) || 10), 50))
        const 起 = Math.max(0, Math.round(Number(args.pos) || 0))
        const 体 = { pos: 起, num: 条数 }
        const 号 = 取QQ号(args.qq)
        if (号) 体.target_uin = 号
        const 回 = await 空间调用(配置, 'get_qzone_msg_list', 体)
        if (!回.ok) {
          if (回.空) return { ok: true, 说: 回.说 }
          return { ok: false, 说: 回.说 }
        }
        const 数据 = 回.数据 || {}
        const 列表 = Array.isArray(数据.msglist) ? 数据.msglist : []
        const 共 = Number(数据.total)
        if (!列表.length) return { ok: true, 说: '这个号的空间里还没有说说' }
```

</details>

**依据 5 · 源码核查**：[lib/host.js:2957-2981](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L2957-L2981)

详情和评论调用。

<details>
<summary>查看原文（25行）</summary>

```text
      name: 'qq_space_detail',
      description: '看一条 QQ 说说的正文和评论。tid 从 qq_space_list 里拿。',
      parameters: {
        type: 'object',
        properties: {
          tid: { type: 'integer', description: '说说的 tid（qq_space_list 里每条前面那个）' },
          qq: { type: 'string', description: '这条说说属于谁的 QQ 号。不填 = 机器人自己的' },
          num: { type: 'integer', minimum: 1, maximum: 50, description: '评论最多看几条，默认 20' },
          pos: { type: 'integer', minimum: 0, description: '评论从第几条开始，默认 0' },
        },
        required: ['tid'],
        additionalProperties: false,
      },
      output: 空间输出(),
      async execute(args = {}) {
        const 配置 = 读配置()
        const tid = Math.round(Number(args.tid))
        if (!Number.isFinite(tid) || tid <= 0) return { ok: false, 说: '要给一个说说的 tid（数字，从 qq_space_list 里拿）' }
        const 条数 = Math.max(1, Math.min(Math.round(Number(args.num) || 20), 50))
        const 起 = Math.max(0, Math.round(Number(args.pos) || 0))
        const 体 = { tid, pos: 起, num: 条数 }
        const 号 = 取QQ号(args.qq)
        if (号) 体.target_uin = 号
        const 回 = await 空间调用(配置, 'get_qzone_msg_detail', 体)
        if (!回.ok) return { ok: false, 说: 回.说 }
```

</details>

**依据 6 · 源码核查**：[lib/host.js:3002-3028](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L3002-L3028)

好友动态和分页边界。

<details>
<summary>查看原文（27行）</summary>

```text
      name: 'qq_space_feeds',
      description: '看 QQ 空间的好友动态流：谁发的、什么时候、说了什么（正文已经去掉 HTML）。',
      parameters: {
        type: 'object',
        properties: {
          count: { type: 'integer', minimum: 1, maximum: 50, description: '看几条，默认 10' },
          page: { type: 'integer', minimum: 1, description: '第几页（从 1 开始）。只有第一页可靠，后面的可能重复或缺' },
        },
        additionalProperties: false,
      },
      output: 空间输出(),
      async execute(args = {}) {
        const 配置 = 读配置()
        const 条数 = Math.max(1, Math.min(Math.round(Number(args.count) || 10), 50))
        const 页 = Math.max(1, Math.round(Number(args.page) || 1))
        const 回 = await 空间调用(配置, 'get_qzone_feeds', { page_num: 页, count: 条数 })
        if (!回.ok) return { ok: false, 说: 回.说 }
        const 数据 = 回.数据 || {}
        const 动态们 = Array.isArray(数据.feeds) ? 数据.feeds : []
        if (!动态们.length) return { ok: true, 说: '这一页没有好友动态' }
        const 行们 = []
        for (const f of 动态们) {
          if (!f) continue
          const 谁 = String(f.nickname || (f.uin != null ? 'QQ ' + f.uin : '某人'))
          const 文 = 空间去标签(f.html, 300) || '（这条没有文字，可能只有图或视频）'
          行们.push('· ' + 空间时间(f.time) + '　' + 谁 + 换行 + '   ' + 文)
        }
```

</details>

**依据 7 · 源码核查**：[lib/host.js:3036-3083](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L3036-L3083)

发帖独立开关与默认可见性。

<details>
<summary>查看原文（48行）</summary>

```text
      name: 'qq_space_post',
      description: '往机器人自己的 QQ 空间发一条说说，可以带图。「允许发 QQ 空间动态」关着的时候不会发出去，'
        + '只会说明没开 —— 那不是故障，别重试。',
      parameters: {
        type: 'object',
        properties: {
          content: { type: 'string', description: '说说的正文' },
          images: {
            type: 'array', items: { type: 'string' },
            description: '配图，最多 9 张。本地路径、http(s) 网址、base64:// 都行，QQ 那边会自己上传',
          },
          ugc_right: {
            type: 'integer', enum: [1, 4, 16, 64, 128],
            description: '谁看得见：1 所有人（默认）、4 好友、16 部分可见、64 仅自己、128 部分不可见',
          },
          target_uins: {
            type: 'array', items: { type: 'string' },
            description: '16 / 128 时要用的 QQ 号名单：16 = 这几个人能看见，128 = 这几个人看不见',
          },
        },
        required: ['content'],
        additionalProperties: false,
      },
      output: 空间输出(),
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
        const 体 = { content: 正文, ugc_right: 权利 }
        if (图们.length) 体.images = 图们
        if (名单.length && (权利 === 16 || 权利 === 128)) 体.target_uins = 名单
        const 回 = await 空间调用(配置, 'send_qzone_msg', 体)
        if (!回.ok) return { ok: false, 说: '没发出去：' + 回.说 }
```

</details>

**依据 8 · 源码核查**：[lib/host.js:3095-3120](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L3095-L3120)

空间工具按绑定会话挂载。

<details>
<summary>查看原文（26行）</summary>

```text
  // 空间工具挂在「绑了 QQ 的那几间会话」上：跟门槛工具一样按会话记，挂过一次就不重复挂。
  const 空间挂着 = new Map() // 会话键 -> 卸下的函数
  function 空间工具心跳() {
    try {
      const 配置 = 读配置()
      const 该挂 = new Set()
      for (const 行 of 配置.绑定 || []) {
        const id = String((行 && 行.会话) || '').trim()
        if (id) 该挂.add(id)
      }
      for (const id of 该挂) {
        const agent = 找agent(id)
        // 宿主没给 tools 服务（或者那间会话没开）就跳过 —— 下一跳再看
        if (!agent || !agent.ctx || !agent.ctx.tools || typeof agent.ctx.tools.register !== 'function') continue
        const sid = 会话键((agent.session && agent.session.id) || id)
        if (空间挂着.has(sid)) continue
        const 卸们 = []
        for (const 工具 of 做空间工具()) {
          try {
            const off = agent.ctx.tools.register(工具)
            if (typeof off === 'function') 卸们.push(off)
          } catch (error) {
            记账('QQ 空间的工具挂不上（' + 短id(sid) + '，' + 工具.name + '）：' + String((error && error.message) || error))
          }
        }
        if (!卸们.length) continue
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 现在更适合观察什么，下一步如何验证可靠交接？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议先观察并保留总开关关、试运行开，理解各绑定、出站门和媒体路径；实际验证应由用户用无敏感数据、无敏感工具的独立会话和测试QQ聊天完成，不能拿演练日志替代送达。先关图片/文件/空间发布等非必要操作，限定只QQ唤醒和标记输出，核对私聊群路由、部分失败与重启。目标不符、非QQ内容外发或失败状态不清时停总开关并停用，回到手工复制，人工检查已发内容。可推导一个未实现方向，为分段媒体出站建持久发送账本，分别记录未投递、后端受理、未知超时和部分成功，并以允许根目录限制本地媒体。对照断网、超时、写盘失败和路径越界，只有重复/漏发减少且恢复负担可接受才支持，否则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:1569-1614](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L1569-L1614)

出站先记已发支持账本假设。

<details>
<summary>查看原文（46行）</summary>

```text
    if (event && event.type === 'turn/end') {
      const d = event.data || {}
      const 完成 = !!(d.reason && d.reason.kind === 'completed')
      // ⭐ 1.4.8（issue #27）：静默标记只对**触发它的那一轮**有效，这一轮一结束就作废。
      //   以前只在「这一轮真的说完了话」那条路上清，下面两种情况都清不掉：
      //     · 门槛判了不接 → 这一轮是被 cancel 停的，turn/end 是 aborted（完成 = false）
      //     · 这一轮一个字都没说出来（没有内容）
      //   标记于是漏到下一轮，下一轮 completed 时被当成「判定过的不接」整轮跳过。
      const 这轮静默 = 静默轮.has(键)
      if (这轮静默) 静默轮.delete(键)
      const 有东西 = 上一轮.文本 || (上一轮.图们 && 上一轮.图们.length)
      // ⚠ 去重的键必须是「会话 + 轮号」：只按轮号的话，换过目标会话就会静默漏发
      const 轮标 = 键 + ':' + String(d.turn)
      if (完成 && 上一轮.轮号 === d.turn && 有东西 && !已发轮.has(轮标)) {
        已发轮.add(轮标)
        // ⚠️ 「这轮是不是 QQ 叫的」在**这里**算一次就消费掉 —— 不然 10 分钟的窗口会把
        //    后面别的轮次也当成 QQ 叫的（实测踩过：群里一条旧消息叫醒之后，之后几轮都往外发）。
        const 醒 = 唤醒时间.get(键) || null
        const 醒着 = Boolean(醒 && 醒.时 && Date.now() - 醒.时 < QqWalake窗口)
        // ⭐ 1.0.1（issue #6）：这次真被 QQ 唤醒 → 给它留一条尾巴，
        //    「这次触发」下面紧接着的几轮也照样往外发（以前只有第一轮能出去）。
        if (醒着) {
          const 尾巴毫秒 = Math.max(0, Number(读配置().唤醒尾巴秒) || 0) * 1000
          if (尾巴毫秒 > 0) 尾巴.set(键, Date.now() + 尾巴毫秒)
        }
        唤醒时间.delete(键)
        const 尾到 = 尾巴.get(键) || 0
        const 是QQ唤醒 = 醒着 || 尾到 > Date.now()
        if (尾到 && 尾到 <= Date.now()) 尾巴.delete(键)
        // ⭐ 1.4.4：这一轮是谁起的头（'qq' / 'speak-up' / 'user' / 别的）
        //   ⚠ 只有**真的收到过 user/message 事件**才下结论；没记录就按老逻辑走（不能误挡）。
        const 有来源 = 轮来源.has(键)
        const 来源 = 轮来源.get(键) || ''
        // ⭐ 1.4.7：这一轮里只要**出现过** qq 来源，后面来的注入就盖不掉它
        const 这轮来过QQ = 本轮有QQ.get(键) === true
        轮来源.delete(键)
        本轮有QQ.delete(键)
        const 是本地手打 = !这轮来过QQ && 有来源 && (来源 === 'user' || 来源 === '')
        // 门槛判了「不接」→ 这一轮一个字都不往外发（但会话里照常留着）
        if (这轮静默) {
          记账('回复门槛：这一轮按判定跳过发送（' + 短id(键) + '）')
        } else {
          void 落地一发(配置, 上一轮.文本, 上一轮.图们, 方向, 是QQ唤醒, 是本地手打)
        }
      }
      记上一轮(空轮())
```

</details>

**依据 2 · 源码核查**：[lib/host.js:1171-1190](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L1171-L1190)

受理不明超时边界。

<details>
<summary>查看原文（20行）</summary>

```text
  const 发送超时毫秒 = 60000

  async function 发一个(base, action, 体, 配置) {
    try {
      const r = await fetch(`${base}/${action}`, {
        method: 'POST',
        headers: 请求头(配置),
        body: JSON.stringify(体),
        // ⭐ 1.5.0：NapCat 收了请求却不回时，别让这一轮永远挂着（以前没有超时）
        signal: AbortSignal.timeout(发送超时毫秒),
      })
      const j = await r.json()
      const 好 = !!(j && j.status === 'ok' && j.retcode === 0)
      try {
        const 新id = j && j.data ? (j.data.message_id != null ? j.data.message_id : j.data.messageId) : null
        if (好 && 新id != null) 记己方消息(新id)
      } catch (error) {}
      return { action, ok: 好, 数据: j }
    } catch (error) {
      return { action, ok: false, 数据: { 错: String((error && error.message) || error) } }
```

</details>

**依据 3 · 源码核查**：[lib/host.js:1211-1240](https://github.com/Yuuyuko-uu/dsh-qq-link/blob/fba7e3ee8ffb3a8f819a7823eb05186cfb782ecb/lib/host.js#L1211-L1240)

当前路径非硬边界。

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

#### 缺口

- 没有真实QQ后端、群/私聊路由、部分失败与媒体边界的同版本验收。
  **影响**：无法证明双向稳定、无误发或恢复无重复，采用结论暂为观察。
  **进一步探讨**：固定Host、后端和测试聊天，记录收件id、受理、回复、送达、部分失败及重启后的人工恢复。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
