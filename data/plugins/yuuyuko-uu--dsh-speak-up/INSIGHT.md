# dsh-speak-up

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[e3bc636](https://github.com/Yuuyuko-uu/dsh-speak-up/tree/e3bc6362208c693bb833ecf463ec6a20df4b6419)

<!-- BEGIN META -->
[![GitHub ★ 223](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=223&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yuuyuko-uu/dsh-speak-up) [![npm 30d 10,914](https://img.shields.io/static/v1?label=npm+30d&message=10%2C914&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-speak-up) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-speak-up)
<!-- END META -->

> **功能**：按本地随机规则和空闲条件向选定 DSH 会话投递搭话消息，并提供演练与记录。

> **亮点**：把本地随机、空闲过滤与演练接到原Agent followup，用户能检查触发原因再决定是否真发。[Q01](#research-q01)、[Q02](#research-q02)

> **主要限制**：安静时段和峰谷可用不同时区，内存冷却与日志不能当持久额度，投递成功也不代表有实际回复或节费。[Q03](#research-q03)

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
  - [Q01 · 谁需要主动搭话，增量是否来自新的Agent能力？](#detail-section-11)
  - [Q02 · 定时到点后如何选会话、掷骰和确认开口？](#detail-section-12)
  - [Q03 · 调度规则能保证节费、安静和一次性投递吗？](#detail-section-13)
  - [Q04 · 首次、持续、故障和退出有什么负担？](#detail-section-14)
  - [Q05 · 如何控制试用，什么设计假设值得继续？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望空闲角色会话偶尔先开口的DSH用户，可配置本地触发规则并先演练。

手动发话或固定提醒不需随机调度；本组件增加何时触发的控制，不创造新Agent生成能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自动随机触发 | 空闲时偶尔开启会话轮次 | 目标必须活着且可用；规则不是费用上限 |
| 演练与手动真发 | 检查规则或明确测试一轮 | 真发绕过自动限制并产生费用 |
| 设置与日志 | 配置频率、时区和查看原因 | 日志与冷却只在内存 |
| 可选新建会话 | 创建专用目标 | 依赖sessionController，建成未必绑定成功 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22、DSH>=0.2.1-rc.2与web界面 | 必需 | 加载与设置 | 包声明不等于实际兼容 |
| agents、sessions、timer等Host服务 | 调度必需 | 活会话、投递和定时 | 不自动唤醒失活目标 |
| sessionController | 历史/建会话条件 | 最近发话与可选新会话 | 历史未知按因子1；不能建则选已有会话 |
| 模型及会话工具权限和预算 | 真发必需 | 执行普通Agent轮次 | 费用与副作用取决原会话 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选独立会话并保留试运行 | 日志显示正确目标与规则 |
| 演练 | 用户检查时区、忙和归档情况 | 只记账无followup |
| 真发 | 用户明确触发一次并核对回复 | 投递、实际正文及费用分别可查 |
| 恢复 | 用户关总开关并停用 | 后续自动不触发，已有副作用另核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 包和配置资源未测 | 选目标、文案、时区与演练 | 无当前宿主执行验证 |
| 持续 | 随机本地；真发为普通Agent费用 | 检查打扰、记录和预算 | 固定峰谷不代表真实价格 |
| 失败恢复 | 失败轮次及工具副作用未知 | 停自动、核对回复和落盘 | 冷却和日志重启丢失 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 规则化主动触发 | 过滤、随机与followup已接线 | 实际回复与体验 |
| 先演练再真发 | 默认只记账与手动模式分离 | 演练不能证明模型或工具成功 |
| 冷却控制 | 目标assistant正文更新时间 | 不关联主动run，非独立目标额度 |

> **思考**：安静时段和峰谷可用不同时区，内存冷却与日志不能当持久额度，投递成功也不代表有实际回复或节费。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把本地随机、空闲过滤与演练接到原Agent followup，用户能检查触发原因再决定是否真发。[Q01](#research-q01)、[Q02](#research-q02)

[Q02](#research-q02) 共享自动/演练/真发入口及await捕错有复用价值；[Q03](#research-q03) 内存状态和异步状态窗口不能当持久调度保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

安静时段和峰谷可用不同时区，内存冷却与日志不能当持久额度，投递成功也不代表有实际回复或节费。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先保持试运行并使用无敏感工具的独立会话，手动真发前核对预算；发生打扰、重复或目标不符即关自动并停用。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持可控本地触发和普通Agent投递；节费与体验未测，持久回执方向仍是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/host.js、lib/client.js、lib/selfupdate.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定Host调度、消息、回执、配置与来源检查、client注册和更新安装调用；未执行目标或模型。
- 下一步：用固定会话和模型分别核对演练与真发，模拟跨时区、重启和并发，记录投递、正文、费用及退出。

**分析版本**

- **仓库**：[Yuuyuko-uu/dsh-speak-up](https://github.com/Yuuyuko-uu/dsh-speak-up)
- **版本号**：0.3.0（[固定提交 e3bc636](https://github.com/Yuuyuko-uu/dsh-speak-up/tree/e3bc6362208c693bb833ecf463ec6a20df4b6419)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究统一时区、持久决策与带run关联的投递回复回执，以重启和并发tick对照验证重复、漏发及费用归因；尚未实现。[Q05](#research-q05)

用固定会话和模型分别核对演练与真发，模拟跨时区、重启和并发，记录投递、正文、费用及退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 500 | — | — | 7182 |
| .js | source | 2 | 2079 | 1439 | 529 | — |
| .mjs | source | 1 | 234 | 192 | 32 | — |
| .mjs | test | 2 | 1024 | 807 | 139 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-speak-up/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：主动搭话能否在明确目标与可控频率下启动普通Agent轮次，其时区、费用与恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要主动搭话，增量是否来自新的Agent能力？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向希望空闲角色会话偶尔自行开口、愿意明确设置频率和费用边界的DSH个人用户。相对用户手动发一句话或固定闹钟，本组件增加本地随机触发、安静时段、冷却与近期交流因子；命中后仍由原Agent的followup开启普通轮次，角色、记忆、工具和生成能力不是本组件创造。合格结果是只在选定可用会话、符合规则时投递，用户能看见为什么发或不发。无人回应是否更有陪伴感没有对照证据，主动触发也可能打扰或消耗工具资源。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-13](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/README.md#L1-L13)

作者清楚区分本地随机与普通模型轮次。

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

**依据 2 · 源码核查**：[lib/host.js:99-137](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L99-L137)

默认试运行、目标为空和调度控制。

<details>
<summary>查看原文（39行）</summary>

```text
const 默认配置 = {
  总开关: true, // 关掉就完全不动
  试运行: true, // **默认开着**：掷中了也只记账、不真发（先看几轮再关掉它）
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
  峰谷时区: '',
  // ⚠ 老配置里那个单独的「概率」**不再读了**（被上面两格替换）。她的旧值会被丢掉，这是预期的。
  // ⚠ 更早一版这两格叫「峰时概率 / 谷时概率」，归一化里还认旧键名（改名兼容）。
  // ---- 没掷中就攒加成，掷中就归零（她原话：「上次没投中，下一次就要加概率；下次如果投中了，
  //      概率又回到一开始」）----
  //   最终命中线 = min(100, 档位命中线 × 时机因子 + min(加成上限, 连没中 × 没中加成))
  //   ⚠ 是**先乘因子、再加攒下来的加成**，最后夹 0~100%（顺序别写反）
  //   ⚠ 没中加成 = 0 就等于关掉这个功能（一分不加）
  没中加成: 10, // 每没掷中一次，下一次命中线加这么多（百分点）
  加成上限: 40, // 加成最多加到这么多（百分点）
  安静起: 1, // 安静时段（小时，含起不含止）；起 === 止 表示不启用
  安静止: 8,
  近阈值分钟: 20, // 距她上次说话 < 这么多分钟 → 命中线乘「近因子」
  近因子: 0.15,
  远阈值分钟: 360, // 距她上次说话 > 这么多分钟 → 命中线乘「远因子」
  远因子: 1.5,
  // ⚠ 这一格是**她自己开口之后的冷却**（跟上面那两个时机因子阈值是两回事：
  //   那是"她多久没说话"，这是"我们自己多久前开过口"）。
  //   以前这里偷偷借用了「近阈值分钟」，设置页里看不到这一格 —— 现在单独拎出来了。
  搭话冷却分钟: 20, // 0 = 不冷却
  触发文案: '好久没人跟我说话了，我该主动去打个招呼',
  角色: 'user', // 'user' = 现在唯一能跑通的；'developer' = 本插件会拒绝（详见文件头注释）
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 定时到点后如何选会话、掷骰和确认开口？

**研究主题**：功能与机制

#### 完整回答

interval调用同一个掷一次入口；自动模式检查总开关、本机安静小时、目标存在、归档、idle与全局冷却，再从可用目标随机挑一个。近期用户消息时间先从内存取，初次可查sessionController历史；峰谷基础线乘时机因子，再加没中补偿并夹到0..100，与Math.random*100比较。命中后连没中清零，默认试运行只留日志；真发构造source.kind=speak-up的user消息并await followup，然后尽力flush。冷却不是投递回执：选定目标出现任意非空assistant/message就更新时间，包括由普通用户触发的回答，并未用run关联只认主动轮次。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:682-743](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L682-L743)

自动过滤与随机选目标。

<details>
<summary>查看原文（62行）</summary>

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
    }

    if (配置.目标会话.length === 0) return 记账('还没勾「目标会话」，什么都不做（去设置里勾一个）')

    // 勾了好几个时：**这次只在其中一个里开口**（随机挑一个活着又不忙的）。
    // 为什么不全都发：一次掷中就往每个会话里说一句，等于同时开好几轮、同时烧好几份 token，
    // 而且「她」听起来像分身。挑一个最像真人（她只在一个地方说话）。
    const 可用 = []
    const 不可用 = []
    // ⭐ 已归档的会话不参与（归档只是藏起来，agent 可能还在；往里塞话等于往废纸篓里说）
    const 归档名单 = new Set()
    try {
      const 登记 = ctx.workspaceRegistry || ctx.get('workspaceRegistry')
      for (const x of (登记 && 登记.archivedSessionIds) || []) 归档名单.add(String(x))
    } catch (error) {}
    for (const id of 配置.目标会话) {
      if (归档名单.has(String(id))) {
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
    const 目标id = 挑中.id
    const agent = 挑中.agent
    const 挑的说法 = 可用.length > 1 ? `（勾了 ${可用.length} 个可用，这次挑 ${短id(目标id)}）` : ''

    // 「主动搭话」之后的冷却（单独一格配置；跟"她多久没说话"那两个阈值是两回事）。
    // ⚠ 0 = 不冷却：刚开口过也照投。
    if (模式 === '自动' && 配置.搭话冷却分钟 > 0 && 自己上次开口 !== 0) {
      const 冷却 = (Date.now() - 自己上次开口) / 60000
      if (冷却 < 配置.搭话冷却分钟) {
        return 记账(`自己刚开过口（${冷却.toFixed(1)} 分钟前，冷却 ${配置.搭话冷却分钟} 分钟），这轮不重复`)
      }
```

</details>

**依据 2 · 源码核查**：[lib/host.js:748-816](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L748-L816)

掷骰、演练、followup和flush。

<details>
<summary>查看原文（69行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/host.js:886-901](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L886-L901)

任意目标assistant正文更新全局冷却。

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 调度规则能保证节费、安静和一次性投递吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

峰谷线使用可选IANA时区，而安静时段在自动入口用本机getHours；海外机器设Asia/Shanghai并不会同步改变安静时段。所谓峰时贵谷时便宜是固定时段策略，未查询实际供应商价格，不能保证节费。冷却、连没中及最近60条日志放内存，重启会丢失，不能当持久额度或审计；多目标共享全局冷却也不等于各自独立频率。定时回调没有本组件串行锁，选idle后还会await历史检查和消息工厂，期间Agent状态可能变化；followup失败能捕获，但源码不是恰好一次投递协议。优点是await捕错与flush失败留痕，不能因此说已成功生成或送达用户。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:574-606](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L574-L606)

内存计数、冷却及日志。

<details>
<summary>查看原文（33行）</summary>

```text
function 造执行体(ctx) {
  /** 最近几次掷骰的记录（给设置页看，也顺便写进 ctx.logger）。 */
  const 日志 = []

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
```

</details>

**依据 2 · 源码核查**：[lib/host.js:658-671](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L658-L671)

时区峰谷线计算。

<details>
<summary>查看原文（14行）</summary>

```text
  async function 算这次命中线(配置, sid, 现在 = new Date()) {
    const 分钟 = await 距上次说话分钟(sid)
    let 因子 = 1
    if (分钟 !== undefined) {
      if (分钟 < 配置.近阈值分钟) 因子 = 配置.近因子
      else if (分钟 > 配置.远阈值分钟) 因子 = 配置.远因子
    }

    // 峰时还是谷时 → 挑哪一格命中线（时段写死，见 判峰时()）
    const 基础 = 算基础命中线(配置, 现在)

    // 攒下来的没中加成（先乘因子，再加这个）
    const { 加成, 线 } = 算命中线(基础.基础命中线, 因子, 连没中, 配置.没中加成, 配置.加成上限)
    return { 分钟, 因子, 峰: 基础.峰, 短语: 基础.短语, 基础命中线: 基础.基础命中线, 加成, 线 }
```

</details>

**依据 3 · 源码核查**：[lib/host.js:689-694](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L689-L694)

安静时段取本机小时。

```text
    if (模式 === '自动' && !配置.总开关) return 记账('总开关是关着的，这轮不动')
    if (模式 === '自动') {
      const 小时 = 现在.getHours()
      if (在安静时段(小时, 配置.安静起, 配置.安静止)) {
        return 记账(`现在 ${小时} 点在安静时段（${配置.安静起}~${配置.安静止}）里，这轮不掷`)
      }
```

**依据 4 · 源码核查**：[lib/host.js:797-818](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L797-L818)

投递与flush结果分别处理。

<details>
<summary>查看原文（22行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/host.js:839-853](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L839-L853)

interval不等待上一轮结束。

<details>
<summary>查看原文（15行）</summary>

```text
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

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续、故障和退出有什么负担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

package要求Node>=22、DSH>=0.2.1-rc.2的web界面，Host依赖agents/sessions/sessionTitle/webServer/timer/workspaceRegistry；历史查询和新建会话另需sessionController。默认目标为空、试运行开启，用户先选择会话、文案、时区、安静与冷却；developer角色会主动拒发，当前真发只能走user消息。随机判断本地执行，但命中后完整Agent轮次可能调用模型和工具，真实费用、数量及打扰程度未知。配置写入失败有API错误提示，日志与冷却不持久；停用或关总开关只约束后续自动轮次，手动真发明确绕过总开关、安静、随机与试运行，已有followup副作用不自动撤销。管理路由有宿主requestRejection及本地来源检查，变更接口限POST，更新接口仍可能调用installBundle。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:6-10](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/package.json#L6-L10)

版本要求。

```text
  "type": "module",
  "engines": {
    "node": ">=22",
    "dsh": ">=0.2.1-rc.2"
  },
```

**依据 2 · 源码核查**：[lib/host.js:50-57](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L50-L57)

Host服务依赖。

```text
export const name = 'speak-up'

/**
 * 需要宿主提供的服务。缺任何一个，install 时会直接报错（这是好事，早炸早发现）。
 * ⚠ 'sessionTitle' 是为了「活着的会话」能显示名字（朗读桥 dsh-tts-bridge 和小说插件都是这么 inject 的）。
 *   实测这台机器上它一定在。真要装到没有它的部署上：删掉这一项即可（标题会走投影缓存那条路）。
 */
export const inject = ['agents', 'sessions', 'sessionTitle', 'webServer', 'timer', 'workspaceRegistry']
```

**依据 3 · 源码核查**：[lib/host.js:787-816](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L787-L816)

developer拒绝与普通轮次。

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/host.js:1076-1128](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L1076-L1128)

来源门与POST包装。

<details>
<summary>查看原文（53行）</summary>

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
    )

  // ⭐ 设置页那个「检查更新」：查这个插件自己的仓库
  //    ⚠ 这里的 diag 不能用下面的「记账」—— 它是在 apply 里才定义的，这会儿还没有
  //    ⚠ 这条路由也要过那道门（`/install` 会真的去装东西，能被跨站点到就麻烦了）
  createSelfUpdate({
    packageRoot: join(dirname(fileURLToPath(import.meta.url)), '..'),
    diag: (m) => { try { ctx.logger.info('speak-up 查更新: ' + m) } catch (e) { /* logger 不在就算了 */ } },
  }).register(ctx, 路由前缀, 拦住)
```

</details>

**依据 5 · 源码核查**：[lib/host.js:1289-1324](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L1289-L1324)

配置失败和手动真发语义。

<details>
<summary>查看原文（36行）</summary>

```text
  // 存：只覆盖传上来的字段，其余保持原样
  路线(`${路由前缀}/save`, async (req, res) => {
    const 来 = await 读体(req)
    const 现在 = 体.配置()
    const 新 = { ...现在, ...(来 && typeof 来 === 'object' ? 来 : {}) }
    const 洗好 = 归一化(新)
    if (!写配置(洗好)) {
      return 回(res, { ok: false, 说: `写不进配置文件：${配置文件}` })
    }
    // ⚠ 间隔一改就要**立刻换表**：定时器还是按上一次的间隔挂着的，
    //   不重新挂的话，把 15 分钟改成 1 分钟也得先干等满那 15 分钟才有第一次滴答
    //   （踩过：她改成 1 分钟，几分钟过去一条记录都没有，看着就像坏了）。
    {
      const 旧间隔 = 体.当前间隔()
      if (洗好.间隔分钟 !== 旧间隔) {
        体.换表(洗好.间隔分钟)
        体.记账(
          `间隔从 ${旧间隔 === null ? '（没挂表）' : 旧间隔 + ' 分钟'} 改成 ${洗好.间隔分钟} 分钟，表已经重新挂好`,
        )
      }
    }
    体.记账(
      `设置已保存（间隔 ${洗好.间隔分钟} 分钟、峰时命中线 ${洗好.峰时命中线}% / 谷时命中线 ${洗好.谷时命中线}%、` +
        `没中加成 +${洗好.没中加成}/次 最多 +${洗好.加成上限}、搭话冷却 ${洗好.搭话冷却分钟} 分钟、` +
        `安静 ${洗好.安静起}~${洗好.安静止} 点、${洗好.试运行 ? '试运行' : '真发'}）`,
    )
    回(res, { ...(await 概况()), 说: '保存好了' })
  }, { 只收POST: true })

  // 掷一次：演练 / 真发。**这里和定时器走的是同一段逻辑**，不是另写一份。
  路线(`${路由前缀}/roll`, async (req, res) => {
    const 来 = await 读体(req)
    const 模式 = 来 && 来.模式 === '真发' ? '真发' : '演练'
    await 体.掷一次('手动', 模式)
    回(res, { ok: true, 说: 模式 === '真发' ? '已按真发跑了一次（结果看下面的记录）' : '已演练一次（没有真发）', 日志: 体.日志 })
  }, { 只收POST: true })
```

</details>

**依据 6 · 源码核查**：[lib/selfupdate.mjs:168-185](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/selfupdate.mjs#L168-L185)

更新安装的真实副作用。

<details>
<summary>查看原文（18行）</summary>

```text
  async function install(ctx) {
    if (是开发副本) {
      return { ok: false, error: '这是本地开发副本（link: 进来的），一键更新会把你正在改的目录换成仓库里的版本 —— 要更新请在仓库里 git pull' }
    }
    const pm = ctx && ctx.pluginManager
    if (!pm || typeof pm.installBundle !== 'function') {
      return { ok: false, error: '这版 DSH 没有插件管理接口，装不了；请手动更新' }
    }
    const spec = 取安装来源() || (meta.name ? String(meta.name) : '')
    if (!spec) return { ok: false, error: '不知道该从哪儿装（既没有仓库地址，也没记录安装来源）' }
    try {
      log('一键更新：开始装 ' + spec)
      const r = await pm.installBundle(spec)
      log('一键更新：' + JSON.stringify(r && (r.applied ?? r.application ?? r.reason ?? r)))
      return { ok: true, spec, result: r || null }
    } catch (e) {
      log('一键更新失败：' + String((e && e.message) || e))
      return { ok: false, spec, error: String((e && e.message) || e) }
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何控制试用，什么设计假设值得继续？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可在无敏感工具的独立角色会话先保持试运行，检查不同本机时间/峰谷时区、归档、忙状态和冷却日志，再由用户决定是否手动真发一次；不能用演练成功冒充生成效果。重复投递、目标不符、打扰或费用不合预期时关闭总开关并停用，回到用户手动发话。可推导一个未实现方向，将调度决策、投递和带run关联的实际回复做持久回执，并使用统一的调度时区。它增加存储和迁移成本，需在重启、并发tick和迟到回执条件下与当前实现对照；只有重复/漏发减少、费用可归因且打扰不增才支持，否则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/host.js:99-137](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L99-L137)

默认演练与明确控制项。

<details>
<summary>查看原文（39行）</summary>

```text
const 默认配置 = {
  总开关: true, // 关掉就完全不动
  试运行: true, // **默认开着**：掷中了也只记账、不真发（先看几轮再关掉它）
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
  峰谷时区: '',
  // ⚠ 老配置里那个单独的「概率」**不再读了**（被上面两格替换）。她的旧值会被丢掉，这是预期的。
  // ⚠ 更早一版这两格叫「峰时概率 / 谷时概率」，归一化里还认旧键名（改名兼容）。
  // ---- 没掷中就攒加成，掷中就归零（她原话：「上次没投中，下一次就要加概率；下次如果投中了，
  //      概率又回到一开始」）----
  //   最终命中线 = min(100, 档位命中线 × 时机因子 + min(加成上限, 连没中 × 没中加成))
  //   ⚠ 是**先乘因子、再加攒下来的加成**，最后夹 0~100%（顺序别写反）
  //   ⚠ 没中加成 = 0 就等于关掉这个功能（一分不加）
  没中加成: 10, // 每没掷中一次，下一次命中线加这么多（百分点）
  加成上限: 40, // 加成最多加到这么多（百分点）
  安静起: 1, // 安静时段（小时，含起不含止）；起 === 止 表示不启用
  安静止: 8,
  近阈值分钟: 20, // 距她上次说话 < 这么多分钟 → 命中线乘「近因子」
  近因子: 0.15,
  远阈值分钟: 360, // 距她上次说话 > 这么多分钟 → 命中线乘「远因子」
  远因子: 1.5,
  // ⚠ 这一格是**她自己开口之后的冷却**（跟上面那两个时机因子阈值是两回事：
  //   那是"她多久没说话"，这是"我们自己多久前开过口"）。
  //   以前这里偷偷借用了「近阈值分钟」，设置页里看不到这一格 —— 现在单独拎出来了。
  搭话冷却分钟: 20, // 0 = 不冷却
  触发文案: '好久没人跟我说话了，我该主动去打个招呼',
  角色: 'user', // 'user' = 现在唯一能跑通的；'developer' = 本插件会拒绝（详见文件头注释）
}
```

</details>

**依据 2 · 源码核查**：[lib/host.js:574-606](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L574-L606)

持久回执方向来自内存状态。

<details>
<summary>查看原文（33行）</summary>

```text
function 造执行体(ctx) {
  /** 最近几次掷骰的记录（给设置页看，也顺便写进 ctx.logger）。 */
  const 日志 = []

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
```

</details>

**依据 3 · 源码核查**：[lib/host.js:886-901](https://github.com/Yuuyuko-uu/dsh-speak-up/blob/e3bc6362208c693bb833ecf463ec6a20df4b6419/lib/host.js#L886-L901)

回复归因当前缺少run关联。

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

- 没有主动触发与手动发话的费用、打扰和体验对照。
  **影响**：不能声称主动策略更有陪伴感或更节费，建议仅可控试用。
  **进一步探讨**：固定会话、模型和工具权限，记录投递、实际回复、Token费用及用户是否继续保留。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
