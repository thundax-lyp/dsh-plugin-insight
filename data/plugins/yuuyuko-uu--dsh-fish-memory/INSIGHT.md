# 鱼的记忆

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9b49f20](https://github.com/Yuuyuko-uu/dsh-fish-memory/tree/9b49f20279835c1fce3e2f924a48ef0da2fd5a75)

<!-- BEGIN META -->
[![GitHub ★ 507](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=507&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yuuyuko-uu/dsh-fish-memory) [![npm 30d 16,396](https://img.shields.io/static/v1?label=npm+30d&message=16%2C396&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fish-memory) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fish-memory)
<!-- END META -->

> **功能**：为 DSH 会话保存带时间的长期记忆，并按查询相关性和鲜活度选择上下文。

> **亮点**：把模型选记、文件库和可解释的召回轨迹接入 DSH。中文查询以词证据控制是否进入候选，再用鲜活度决定顺序。文件写回用清理代际拒绝旧结果。见 [Q01](#research-q01)、[Q02](#research-q02) 与 [Q03](#research-q03)。

> **主要限制**：长期事实分类在实际选择处被排除，短问可能直接不召回。后台扩词会将记忆文本送给宿主模型，清空回收区还可能留下一份恢复副本。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 会话怎么开始记忆，哪些内容实际进入库？](#detail-section-11)
  - [Q02 · 中文单字、短问和既有事实怎样影响召回？](#detail-section-12)
  - [Q03 · 删除、停用和后台扩词相遇时，什么会留下？](#detail-section-13)
  - [Q04 · 管理接口的拒绝条件怎样改变试用边界？](#detail-section-14)
  - [Q05 · 怎样判断减少无关注入的收益是否覆盖漏召回和成本？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：持续使用中文 DSH 会话的个人用户，可以保存后续会问到的事件并查看其召回轨迹。固定约束仍由用户掌握。

手工短档案在重要事实发生变化时需维护和重新带入，但用户可精确确认要带的内容。插件把选记、检索与轨迹接到 DSH 会话，召回效果取决于文本、分词与阈值。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 记忆工具 | 记录可复用事件 | 受会话开关、模型选择与配额约束 |
| 事件召回 | 选择与查询相关的记忆 | 低信息查询可直接跳过 |
| 管理与诊断 | 检查记忆和轨迹，恢复已删条目 | 依赖 Web 与宿主准入服务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 22+、DSH 0.2.1-rc.2+ | 包声明 | 提供插件宿主 | 实际兼容需单独检查 |
| 宿主 Agent、提示、工具与定时服务 | 核心 | 发现会话、写入并注入 | 对应功能无法完成 |
| 可写本地库 | 保存必需 | 写记忆、轨迹和备份 | 检查磁盘或配置 |
| 宿主模型服务 | 扩词等模型操作需用 | 生成检索词 | 可关闭自动扩词 |
| webServer 与 connection | 管理操作需用 | 注册路由和准入 | 无管理页或接口拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 1 | 用户准备隔离 profile、样本和备份 | 核对匿名请求被拒并关闭自动扩词 |
| 2 | 用户打开指定会话，记录一条样本事件 | 库中出现内容和日期，回看工具回执 |
| 3 | 用户用相关句和无关短问触发检索 | 对照实际注入、轨迹和回答 |
| 4 | 用户删除样本并停用该会话 | 复查历史和备份范围，必要时退回人工短档案 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地存储与已有宿主，金额未知 | 配置隔离环境、准入和样本 | 耗时未知 |
| 持续 | 注入输入和可选额外模型请求，费用未知 | 查漏、核对召回与错条目 | 每合格任务用量未知 |
| 退出 | 备份、日志和历史占用未知 | 停用并确认旧副本 | 清空当前库只能核对该库 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 自动选记 | 模型调用工具后写本地库 | 应记内容的覆盖与准确性 |
| 选择事件 | 相关证据、鲜活度和预算共同作用 | 实际漏项、无关注入及用量 |
| 管理恢复 | 可复原软删除并拒绝部分旧写回 | 宿主鉴权和并发组合的结果 |

> **思考**：长期事实分类在实际选择处被排除，短问可能直接不召回。后台扩词会将记忆文本送给宿主模型，清空回收区还可能留下一份恢复副本。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把模型选记、文件库和可解释的召回轨迹接入 DSH。中文查询以词证据控制是否进入候选，再用鲜活度决定顺序。文件写回用清理代际拒绝旧结果。见 [Q01](#research-q01)、[Q02](#research-q02) 与 [Q03](#research-q03)。

管理路由、原子文件写入和候选打分有独立接口。运行时入口集中在 lib/index.js。注入缓存按会话和查询复用，写回检查文件代际，分别控制重复工作与过期写回，详见 [Q02](#research-q02) 和 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

长期事实分类在实际选择处被排除，短问可能直接不召回。后台扩词会将记忆文本送给宿主模型，清空回收区还可能留下一份恢复副本。见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在单独的本机测试会话关闭自动扩词，验证无关账号无法访问管理路由。放入无敏感样本，比较库中的事实、轨迹和模型实际回答。如果出现越权或反复错召回，停用并恢复手工短档案。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持事件记忆的选择、管理与诊断机制。长期约束实验属于未验证假设，真实采用收益及宿主边界待验。

- 已检查：作者 README、包清单、源码路径 CHANGELOG.md、README.md、cordis.patch.yml、lib/index.js、lib/selfupdate.mjs、lib/准入.mjs、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查本地写入、普通事件选择、删除、后台扩词、宿主管理与更新入口。导入、迁移、客户端和宿主实现未逐项审计。
- 下一步：用隔离样本验证短问、同字异义、旧条目、清空与后台请求交错。管理验收先在匿名与本机登录状态下检查读取路由，避免触发真实更新。

**分析版本**

- **仓库**：[Yuuyuko-uu/dsh-fish-memory](https://github.com/Yuuyuko-uu/dsh-fish-memory)
- **版本号**：1.6.0（[固定提交 9b49f20](https://github.com/Yuuyuko-uu/dsh-fish-memory/tree/9b49f20279835c1fce3e2f924a48ef0da2fd5a75)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可单独比较少量由用户确认且会到期的约束是否减少短问漏召回。按每份合格任务检查无关注入、过期污染、额外 token 和维护分钟。见 [Q05](#research-q05)。

用隔离样本验证短问、同字异义、旧条目、清空与后台请求交错。管理验收先在匿名与本机登录状态下检查读取路由，避免触发真实更新。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 1744 | — | — | 24778 |
| .mjs | source | 5 | 529 | 412 | 96 | — |
| .js | source | 3 | 12322 | 9529 | 2517 | — |
| .mjs | test | 14 | 1812 | 1581 | 77 | — |
| .md | test | 1 | 25 | — | — | 240 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-fish-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=21&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-fish-memory/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=20&color=737b86&logo=github)](https://github.com/Yuuyuko-uu/dsh-fish-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：把中文会话里反复要用的事件和约定交给插件保存时，怎样检查其写入、召回、管理权限和退出边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 会话怎么开始记忆，哪些内容实际进入库？

**研究主题**：场景与需求、功能与机制、依赖、兼容与流程

#### 完整回答

想在后续对话重用具体事件和约定的 DSH 中文用户，可以让会话中的模型在识别到重要信息时调用 remember。相比自己每轮粘贴一份档案，插件把候选写入持久库并在以后按查询筛选。包声明 bundle，挂载插件后通过定时扫描和 agent/created 发现 Agent，提示层要求模型挑长期信息并调用工具。工具执行时解析当前会话、确认开关和非空内容，再查当日仍在活动库中的创建记录是否达配额。归一化后相同或足够长且相互包含的文本可以强化旧记录，新条目可按事实键标记被取代的旧条。此路径没有用户逐条确认或独立事实核查，因此关键约定仍应由用户检查记录内容。默认会话开关开启。默认会话库用会话标识，工作区模式则可让同工作区使用同一个库。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:7-10](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/package.json#L7-L10)

声明 Node 与 DSH 版本范围。

```text
  "engines": {
    "node": ">=22",
    "dsh": ">=0.2.1-rc.2"
  },
```

**依据 2 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/cordis.patch.yml#L1-L3)

宿主 patch 插入插件。

```text
- insert:
    - id: memory
      name: dsh-fish-memory
```

**依据 3 · 源码核查**：[lib/index.js:796-805](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L796-L805)

总开关、会话覆盖与默认启用。

<details>
<summary>查看原文（10行）</summary>

```text
function isEnabled(sid) {
  if (!globalOn()) return false
  const c = loadCfg()
  const s = String(sid)
  const m = c.sessions
  if (m && typeof m === 'object' && Object.prototype.hasOwnProperty.call(m, s)) return !!m[s]
  // 兼容旧版：以前是「没配 = 全开」，那份白名单里的人继续开着
  if (Array.isArray(c.enabled) && c.enabled.indexOf(s) >= 0) return true
  return true
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:432-439](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L432-L439)

库键随会话或工作区模式选择。

```text
export function 库名(sid, 配置) {
  // ⚠ 不在这里读全局配置 —— 调用方把「模式」传进来。
  //   自己读配置会让这个函数没法单测（而且 storePath 在模块加载早期就会被调用）。
  const 模式 = String((配置 && 配置.模式) || 'session')
  if (模式 !== 'workspace') return String(sid)
  const ws = 会话的工作区(sid)
  return ws ? 'ws_' + ws : String(sid)
}
```

**依据 5 · 源码核查**：[lib/index.js:4396-4407](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L4396-L4407)

由提示引导模型选择内容并调用 remember。

<details>
<summary>查看原文（12行）</summary>

```text
        interpolate: false,
        text: () => {
          const p = ownerNameOf(sid) || pronounOf(sid)
          const self = selfNameOf(sid)
          return (
            '【记忆】这一轮如果有值得长期记住的事（' + p + '重要的话、约定、' + p + '的喜好、' + p + '的状态），' +
            '直接调用 remember 工具记下来 —— **不用等' + p + '提醒**。' +
            '日常琐事（吃了什么、今天天气）不用记。' +
            '**人称**：你自己是「' + selfPronounOf(sid) + '」，用户是「' + p + '」，别人和别的 AI 直接写名字' +
            (self ? '（你写成「' + self + '」也会自动换成「我」）' : '') +
            '；也不要写「今天/昨天」，时间交给系统。'
          )
```

</details>

**依据 6 · 源码核查**：[lib/index.js:4799-4814](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L4799-L4814)

轮询与事件双入口。

<details>
<summary>查看原文（16行）</summary>

```text
    //   tick 本身很便宜（`agents.list()` 读内存 + 归档名单优先走服务），0.5 秒完全扛得住。
    ctx.effect(() => ctx.interval(tick, 500))
  } catch (error) {
    console.error('[记忆] 定时器不可用（不影响对话）：' + (error && error.message))
  }

  // ⭐ 1.6.5（issue #27）：光靠轮询不够 —— 事件来了就当场挂，不看 list()
  try {
    ctx.on('agent/created', (payload) => {
      try {
        const a = payload && payload.agent
        if (a) 挂一个(a)
      } catch (error) {}
    })
  } catch (error) {
    diag('agent/created 挂不上（不影响对话）：' + (error && error.message))
```

</details>

**依据 7 · 源码核查**：[lib/index.js:3740-3778](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L3740-L3778)

执行时的身份、开关、规范化、配额和近重复条件。

<details>
<summary>查看原文（39行）</summary>

```text
    async execute(args, exec) {
      const sid = sessionIdFromExec(exec)
      if (!sid) {
        diag('remember：拿不到会话 id（exec 的字段：' + (exec ? Object.keys(exec).join(',') : 'null') + '）')
        return { ok: false, message: '没记住（拿不到会话）' }
      }
      // 这个会话没开记忆 → 不记（关掉就是真的不想用）✓
      if (!isEnabled(sid)) {
        diag('remember：' + sid + ' 没开记忆，跳过')
        return { ok: false, message: '这个会话的记忆是关着的，先到设置里打开' }
      }
      const 原始 = String((args && args.text) || '').trim()
      // ⭐ 机械保证：她自己写成「小明」也换成「我」✓
      const text = normalizeOwner(normalizePerson(原始, selfNameOf(sid)), sid)
      if (!text) return { ok: false, message: '没记住（内容是空的）' }
      if (text !== 原始) diag('remember：人称换过了 →「' + text + '」')

      const data = loadStore(sid)
      const policy = data.policy
      const now = Date.now()

      // 配额（每天最多几条，先宽松）
      const today = dayKey(now)
      const todayCount = data.memories.filter((m) => m.createdAt && dayKey(Date.parse(m.createdAt)) === today).length
      if (todayCount >= policy.dailyQuota) {
        return { ok: false, message: '今天记满了（' + policy.dailyQuota + ' 条），明天再说。' }
      }

      // 去重：内容太像的不重复记 —— 但**强化**它（照 AAAAGENT）
      // 「她又提到这件事了」说明这件事还在她心里，该记得更牢一点 ✓
      // （注意：只有她真的又提一次才强化；光是召回想起来**不**强化 ——
      //   「仅浏览、搜索不会把记忆越看越重要」✓）
      const norm = (s) => String(s || '').replace(/[\s，。、！？,.!?]/g, '')
      const nt = norm(text)
      for (const m of data.memories) {
        const a = norm(m.text)
        if (a && (a === nt || (a.length > 8 && nt.length > 8 && (a.includes(nt) || nt.includes(a))))) {
          const I0 = typeof m.importance === 'number' ? m.importance : 0
          const H0 = policy.baseHalfLifeDays * (1 + 2 * I0)
```

</details>

**依据 8 · 源码核查**：[lib/index.js:3872-3896](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L3872-L3896)

新条目收敛、写盘与扩词排队。

<details>
<summary>查看原文（25行）</summary>

```text
        // ⭐ 事实键只在真给了的时候才写字段（没给就不留空字段，老数据长什么样它长什么样）✓
        ...(键 ? { 事实键: 键 } : {}),
      })
      // ⭐⭐ 同一个键只留最新那条 —— 新条**已经进库了**再收敛，
      //   这样「最新」的比较里包含它自己，一定留的是它 ✓
      //   （顺序很要紧：先 push 再收敛，反过来会把新条自己也算成旧的 ✗）
      if (键) {
        try {
          for (const id of 按键收敛(data, 新id)) if (作废的.indexOf(id) < 0) 作废的.push(id)
        } catch (error) {}
      }
      saveStore(sid, data)
      diag('remember：' + sid + ' 记了「' + text.slice(0, 40) + '」' + (键 ? '（事实键 ' + 键 + '）' : '') + '（今天第 ' + (todayCount + 1) + ' 条）')
      // ⭐ 自动补「检索词」：以前得她去设置页点「开始扩词」，现在记完就顺手补上
      //    ⚠️ 不 await（模型调用要几秒，不能卡住记账）；但**必须 .catch** ——
      //      裸的 rejected promise 会被 Node 当致命错误，整个宿主退出（今天早上刚踩过）
      try {
        后台排队(sid, () => 自动扩词(ctx, sid, 2))
      } catch (error) {}
      if (作废的.length) diag('remember：顺手把 ' + 作废的.length + ' 条旧的标成「已被取代」：' + 作废的.join(','))
      return {
        ok: true,
        message:
          '记下了（' + relTime(now, now) + '）。' +
          (作废的.length ? '顺手把 ' + 作废的.length + ' 条被这条取代的旧记忆标成「已被取代」（不再想起来，东西还留着）。' : ''),
```

</details>

#### 缺口

- 模型在真实任务中如何选记、是否漏记尚无对照。
  **影响**：用户不能预期每条关键约定都会被保留。
  **进一步探讨**：用有意夹杂闲谈和相互矛盾的样本，核对最终库中的记录和实际工具调用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 中文单字、短问和既有事实怎样影响召回？

**研究主题**：功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

宿主装配提示时，插件优先从刚收到的输入选查询，极短时尝试借最近会话内容补词。有效会话的查询信息量门槛可以直接返回空。通过后，检索词有多字项时丢弃单字，即使单字来自词典。全是单字时保留原词，但仍要过前面的问句门。候选筛选尝试同时用库内稀有性和通用词频，回退先用通过通用门的词，实在没有才用剩余原始词。记录按相关证据 C 判断资格、按含鲜活度的 P 排序，全未达标时另允许一条达到门槛四分之三的近阈值候选。去重后实际选取仅走普通事件列表，明确排除 stable_profile。已有长期事实即使参与前面评分，在这条注入路径也不会入选。普通事件再受条数及字数预算。用户若需要固定身份和约束，应把它们放在自己可控的宿主指令或短档案里。检索结果按文本写入上下文，关闭模板插值只避免变量解释，记忆内容仍会被模型看到。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4432-4453](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L4432-L4453)

上下文接入、关闭插值与短问补词。

<details>
<summary>查看原文（22行）</summary>

```text
    const 注入off = agent.ctx.systemPrompt.context({
      name: 'memory',
      order: 900, // 排在沙箱/审批/子代理那几条（110/115/120）后面
      // ⭐ 1.3.5：**这段是纯文本，不许被当提示词模板解析**。
      //   宿主的 context / section 默认会做变量替换：`{{time}}` 这种会被当成变量名，
      //   查不到就抛 `unknown prompt variable` —— 记忆里只要存了一句带双花括号的话
      //   （代码片段、模板、日志都可能有），整间会话每一轮都直接失败，用户只能关插件。
      //   `interpolate: false` 是宿主自己给的开关（dsh-tools / working-directory 都在用）。
      interpolate: false,
      text: () => {
        try {
          const now = Date.now()
          // ⚠ 2026-11-04 修：**监听那句（这一轮刚收到的）优先**。
          //   原来的注释假设「会话里最后一条 user 消息就是这一轮」，在 DSH 这个时序下不成立：
          //   systemPrompt.context 在请求装配时求值，而 user 消息要等装配完才落进 session，
          //   于是永远拿到上一轮 —— 实测问「莱拉是谁」，拿去检索的是前几轮那句 49 字的闲聊。
          //   会话那句只在监听为空时兜底（插件中途挂上、重启后第一轮还没收到消息）。
          let query = 清掉注入上下文(选查询词(lastUserTextOf(agent.session), lastText))
          // ⭐ 1.4.2：一两个字的句子（「推」「在吗」）单独去搜什么都搜不到 —— 借上文一起搜
          try {
            if (query.trim().length < 6) query = 补线索(query, 最近几句(agent.session, 3))
          } catch (error) {}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:3396-3409](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L3396-L3409)

问句信息不足即整体早退。

<details>
<summary>查看原文（14行）</summary>

```text
  // ⭐⭐ 第一道门开在**问句**上，不在记忆上（2026-09-21 加）
  //   「在吗」「嗯」「哈哈」这种话本身没内容，就不该去翻几百条记忆 ——
  //   实测过：只换打分公式，它们照样六条，因为**总能比出六条来**。
  //   尺子是「她自己怎么说话」：天天说的词不算信息，偶尔说的才算 ✓
  const 门槛 = typeof policy.queryGate === 'number' ? policy.queryGate : 0.8
  let gate = null
  if (门槛 > 0 && sid) {
    const v = 问句信息量(sid, query, df)
    if (v < 门槛) {
      // 这道门挡下来的时候**不做 851 次打分**，省一趟；理由照样记进 trace 给她看 ✓
      // 门挡住了就什么都不带（长期事实那层已经删掉了）
      return { selected: [], scored: [], 字数: 0, gate: { 信息量: Number(v.toFixed(2)), 门槛, 挡了: true } }
    }
    gate = { 信息量: Number(v.toFixed(2)), 门槛 }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3430-3448](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L3430-L3448)

多字存在时过滤全部单字，再做稀有性与通用筛选。

<details>
<summary>查看原文（19行）</summary>

```text
  const 稀有门 = Math.max(3, memories.length * 0.01)
  // ⭐ 1.5.10：**单字一律不当线索**。
  //   词表里收单字是为了切分时能找到最长匹配的边界（「小源」切成「小」+「源」），
  //   不代表这个字本身能当证据 —— 单字在库里 df 往往只有 1~2，稀有度直接满 1.0，
  //   比正经实词还值钱，一句无关的话就能把别的记忆拽进来。
  //   整句只剩单字时（「猫」「累」这种短句）还是留着，别让短句一个词都不剩。
  const q原始 = [...切词(query)]
  const q多字 = q原始.filter((k) => String(k).length > 1)
  const q全部 = q多字.length ? q多字 : q原始
  // ⭐⭐ 2026-09-24：**再拿通用中文过一道** —— 最常用的那些词不当线索 ✓
  //   治「正式演出…我也该表示了」捞到「从没正式去医院确诊…明确表示不会轻生」：
  //   那两个词在**她的库里**罕见（df 4 和 2），可它们在**通用中文**里极常见
  //   （表示排 376、正式排 887）→ 按「库里稀不稀有」算，它俩成了最值钱的证据 ✗
  //   ⚠ 这里只**筛掉线索**，不改打分尺度 —— 门槛（threshold）才不用跟着重调 ✓
  const q过稀有 = q全部.filter((k) => {
    const d = df.get(k) || 0
    return d > 0 && d <= 稀有门
  })
  const q过通用 = q过稀有.filter(算线索)
```

</details>

**依据 4 · 源码核查**：[lib/index.js:3458-3474](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L3458-L3474)

三级回退及评分入口。

<details>
<summary>查看原文（17行）</summary>

```text
  const 剩的能用 = q过通用.length >= 2 && q过通用.some((k) => 稀有度(df, k) > 0)
  // ⚠ 退回 **q全部**（原来那道安全垫的写法），**不要**退回 q过稀有：
  //   实测「我们那天办婚礼的时候，你还记得吗」——「婚礼」在库里 11 条 → 被库里那道门挡了，
  //   通用门也没剩下什么 → 若退回 q过稀有 就只剩一个「办」，婚礼那条**想不起来** ✗
  //   退回 q全部 才对：那句话里的词全还给它，该想起来的照样想起来 ✓
  // ⭐ 1.5.9：安全垫分三级 ——
  //   ① 过两道门的（最干净）
  //   ② 只过**通用词频门**的：把「库里太常见」被挡掉、但本身是正经实词的捞回来
  //      （「婚礼」这种：库里 11 条 → 被稀有门挡，可它确实是这句话的要点）
  //   ③ 全都没有才退回全部
  //   ⚠ 以前第 ② 级直接退回 q全部，于是**通用门已经判死的常用词**（对/是/在）也跟着回来，
  //     两个假证据一凑就把不相干的记忆顶过门槛。
  const 非通用 = q全部.filter(算线索)
  const q留 = 剩的能用 ? q过通用 : (非通用.length ? 非通用 : q全部)
  尺.问句词 = q留.length ? q留 : q全部

  const scored = memories.map((m) => ({ m, s: evaluate(m, query, now, policy, 尺) }))
```

</details>

**依据 5 · 源码核查**：[lib/index.js:3474-3507](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L3474-L3507)

证据门槛、排序和近阈值候选。

<details>
<summary>查看原文（34行）</summary>

```text
  const scored = memories.map((m) => ({ m, s: evaluate(m, query, now, policy, 尺) }))

  const picked = []
  for (const row of scored) {
    if (row.s.C <= 0) row.omission = 'hard_gate'
    // ⭐⭐ 2026-09-21 改：门槛卡的是 **C（证据）**，不再是 P（总分）✓
    //   为什么必须分开：P = C × 乘数，而乘数里有鲜活度 A。
    //   以前门槛卡 P，于是「鲜活度」一动，**门槛跟着动** ——
    //   851 条里 833 条没时间戳，把它们的鲜活度一起压低 = 整个库的分数整体下移
    //   → 连着「该想起的」一起被挡掉（实测：0.75 就掉到 8/11，0 掉到 5/11）✗
    //   而且它们本来就拿同一个值，压低**不改变它们之间的排序**，纯粹白损失。
    //   分开之后：门槛只管「这条记忆跟这句话到底有没有真关系」（C），
    //   鲜活度/重要度/情绪**只参与排序**（下面的 sort 用 P）→
    //   那个「没写时间的算多鲜活」的旋钮就能安全地调了 ✓
    else if (row.s.C < policy.threshold) row.omission = 'below_threshold'
    else picked.push(row)
  }
  picked.sort((a, b) => b.s.P - a.s.P)
  // ⭐ 1.4.3：「差一点够上」的别直接扔 —— 门槛 0.30 时 C=0.288 这种只差 0.012，
  //   扔掉就变成「一条都没挑中」。现在整轮一条都没挑中时，从「够到门槛 75%」的里面补一条分最高的。
  //   （只补一条，而且标记成「差一点」，设置页能看出它是被放宽拿进来的。）
  if (!picked.length) {
    let 差点 = null
    for (const row of scored) {
      if (row.omission !== 'below_threshold') continue
      if (!(row.s.C >= policy.threshold * 0.75)) continue
      if (!差点 || row.s.P > 差点.s.P) 差点 = row
    }
    if (差点) {
      差点.omission = ''
      差点.差一点 = true
      picked.push(差点)
    }
  }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:3567-3581](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L3567-L3581)

最终仅选事件，排除 stable_profile 并施加预算。

<details>
<summary>查看原文（15行）</summary>

```text
  // ⭐ 1.5.7：**长期事实（每轮无条件带几条）已整个删除**。
  //   理由：闲聊时把跟当下无关的记忆塞进去，会把话带跑；身份/称呼这类由星汐每轮开头带。
  //   现在只有「这句话检索命中」的记忆才会进上下文。
  // 普通事件：从去重后的候选里按分数拿，受 maxItems 和「这趟上限」两条约束
  const 事件们 = 去重后.map((x) => x.row).filter((row) => !row.m || row.m.category !== 'stable_profile')
  const 最高事件分 = 事件们.length && 事件们[0].s ? 事件们[0].s.C : 0
  const 事件本趟上限 = 事件们.length ? 分档.find(([线]) => 最高事件分 >= 线)[1] : 0
  const 事件名额 = Math.min(事件本趟上限, policy.maxItems)
  const 条数内 = 事件们.slice(0, 事件名额)
  for (const row of 事件们.slice(事件名额)) {
    if (!row.omission) row.omission = 'weak' // 设置页上会写「这趟给的条数到顶了」
  }

  const { selected, 字数: 已用 } = 按字数收(条数内, policy)
  const ids = new Set(selected.map((r) => r.m.id))
```

</details>

**依据 7 · 源码核查**：[lib/index.js:4530-4547](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L4530-L4547)

渲染文本并返回宿主。

<details>
<summary>查看原文（18行）</summary>

```text
          // Trace persistence is auxiliary: an I/O failure must not hide a valid
          // snapshot already read from disk. saveStore records the failure.
          try { saveStore(sid, data) } catch (error) {}
          const 注入文本 = render(selected, now, selfNameOf(sid))
          // ⭐ 2026-10-22 她要能看见「这一轮到底注入了什么」：
          //    搬到官方桌面端之后界面上看不到了，那就写进 diag.log，一眼能翻。
          //    只记一行、截断 400 字，不占空间。
          try {
            diag('注入 ' + selected.length + ' 条：' + (注入文本 || '（空）').split(String.fromCharCode(10)).join(' ⏎ ').slice(0, 400))
          } catch (error) {}
          // ⭐ 1.5.2：记下这次的答案，同一次请求后面那几遍直接用
          注入缓存.键 = 缓存键
          注入缓存.时 = now
          注入缓存.文 = 注入文本
          return 注入文本
        } catch (error) {
          return '' // 记忆坏了也不能影响对话
        }
```

</details>

#### 缺口

- 同字异义与真正需要单字的人名、短问在目标语料中的影响未知。
  **影响**：不能把降低碎片影响等同于对真实任务准确率的提升。
  **进一步探讨**：标注含罕见单字、短指代及过期约定的正反样本并检查选中项和漏项。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 删除、停用和后台扩词相遇时，什么会留下？

**研究主题**：工程质量与复用、缺陷与关键质疑、效果与总成本

#### 完整回答

普通删除把条目移进回收区并标记旧召回轨迹失效，可再找回。清空回收区会先尝试保留一份销毁前副本，随后按新代际原子替换当前文件。写盘前比较代际，普通保存合并磁盘现状，减少异步任务把已删内容重新写回的机会。扩词先把选中记忆文本发给宿主模型，返回后重读库，代际不同或 ID 已不在活动区就跳过。但这些措施拦的是晚到写回，发出的模型请求已经携带文本。同 ID 编辑后代码仍可能接受基于旧文本算出的词，因为这里只核对代际和 ID。提示上下文缓存按会话和查询保留约 1.5 秒，也没有在读取前把删除代际纳入键。停用卸载提示，清理当前库不会追溯已进入宿主会话的文本、备份、诊断或分支副本。扩词既可在新增后排队，也可在未被问句门拦下的空召回里节流触发。设置 autoExpand 为 false 后，新进入扩词函数的任务会提前返回，不发起新的扩词请求。已经交给宿主模型的请求没有撤回路径。只有实际发出的模型请求才可能产生额外用量或费用，取决于宿主和模型账户。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:5768-5789](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L5768-L5789)

软删除移入回收区，显式恢复再放回活动区。

<details>
<summary>查看原文（22行）</summary>

```text
        const data = loadStore(sid)
        if (!Array.isArray(data.deleted)) data.deleted = []
        if (action === 'delete') {
          const i = data.memories.findIndex((m) => String(m.id) === id)
          if (i >= 0) {
            const m = data.memories.splice(i, 1)[0]
            m.deletedAt = new Date().toISOString()
            data.deleted.push(m)
            markTraceStatus(data, id, 'invalidated') // 以前的召回记录里它失效了 ✓
            saveStore(sid, data)
            diag('删了一条（收起来）：' + sid + ' / ' + id + ' 「' + String(m.text).slice(0, 30) + '」')
            out = { ok: true, message: '收起来了，还能找回来' }
          }
        } else if (action === 'restore') {
          const i = data.deleted.findIndex((m) => String(m.id) === id)
          if (i >= 0) {
            const m = data.deleted.splice(i, 1)[0]
            delete m.deletedAt
            data.memories.push(m)
            saveStore(sid, data, { restoreIds: [id] })
            diag('找回来一条：' + sid + ' / ' + id)
            out = { ok: true, message: '找回来了' }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:5845-5862](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L5845-L5862)

永久移出当前回收区的动作与清空前备份。

<details>
<summary>查看原文（18行）</summary>

```text
        } else if (action === 'purge') {
          const n = data.deleted.length
          data.deleted = data.deleted.filter((m) => String(m.id) !== id)
          if (data.deleted.length !== n) {
            saveStore(sid, data, { raw: true }) // 真销毁：不许合并把盘上的捡回来
            diag('彻底清掉一条：' + sid + ' / ' + id)
            out = { ok: true, message: '彻底清掉了' }
          }
        } else if (action === 'purgeall') {
          const n = data.deleted.length
          // ⚠⚠ 2026-09-23：**真销毁** —— 动之前另存一份带时间戳的（见 销毁前另存 的说明）✓
          if (n > 0) {
            销毁前另存(sid)
            data.deleted = []
            saveStore(sid, data, { raw: true }) // 真销毁：不许合并把盘上的捡回来
          }
          diag('清空已删掉的：' + sid + '（' + n + ' 条）')
          out = { ok: true, message: n ? '清掉了 ' + n + ' 条（清空前的整份另存在「销毁前」里）' : '没有要清掉的' }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:560-578](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L560-L578)

复制销毁前文件并限制副本数量。

<details>
<summary>查看原文（19行）</summary>

```text
function 销毁前另存(sid) {
  try {
    const src = storePath(sid)
    if (!existsSync(src)) return
    const dir = join(STORE_DIR, '销毁前')
    mkdirSync(dir, { recursive: true })
    // ⚠⚠ 时间戳要**到毫秒** —— 第一版只到秒，自检里连着清 25 次
    //   全落在同一秒 → **文件名一样、互相覆盖**，最后只剩 1 份 ✗
    //   （自检逮到的。真出事的时候正好是连着点几下，就会踩这个）
    const ts = new Date(Date.now() + TZ_OFFSET).toISOString().replace(/[:.]/g, '-').slice(0, 23)
    const 头 = basename(src).replace(/\.json$/, '') + '·' + ts
    let 名 = 头 + '.json'
    for (let i = 2; existsSync(join(dir, 名)); i++) 名 = 头 + '·' + i + '.json' // 撞了就加序号，绝不覆盖 ✓
    copyFileSync(src, join(dir, 名))
    const 们 = readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
    for (const f of 们.slice(0, Math.max(0, 们.length - 20))) {
      try {
        rmSync(join(dir, f), { force: true })
      } catch (error) {}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:649-683](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L649-L683)

校验代际、读盘合并和原子写入。

<details>
<summary>查看原文（35行）</summary>

```text
    const epoch = recoveryEpoch ?? purgeEpochOf(盘)
    // 清掉墓碑后，按 id 合并无法分辨新增与旧快照；先拒绝整批过期写入。
    if (purgeEpochOf(data) !== epoch) {
      const error = new Error('记忆库已彻底清理，本次旧任务未写入，请重新运行')
      error.code = 'MEMORY_PURGED'
      throw error
    }
    mkdirSync(STORE_DIR, { recursive: true })
    if (!Array.isArray(data.deleted)) data.deleted = []
    if (!Array.isArray(data.traces)) data.traces = []
    // ⭐ 2026-10-24：**写之前先把盘上的读回来合并**，不许拿旧快照整份盖
    //   （详见 合并库 上面那段：自动扩词等模型那几秒里新记的记忆，就是这么丢的）
    //   raw = 真销毁（清空已删 / 彻底删一条），那时**不许**把盘上的捡回来
    if (!(选项 && 选项.raw)) {
      if (盘 && Array.isArray(盘.memories)) data = 合并库(盘, data, 选项)
    }
    // ⭐ 1.4.4：合并会把盘上的旧 trace 捡回来，所以**这里也得清一遍**
    //   （只在加载时清没用：下一次保存又原样回来了）。
    if (Array.isArray(data.traces) && data.traces.length) {
      data.traces = data.traces.filter((t) => {
        const q = typeof (t && t.query) === 'string' ? t.query : ''
        if (!q) return true
        return !明显是机器写的(清掉注入上下文(q))
      })
    }
    // 与内容一起原子发布；其他实例后续读取时也能识别旧代际（并非跨进程事务）。
    // 先构造待写副本；写失败时保留恢复候选的原代际，允许同对象安全重试。
    data = { ...data, purgeEpoch: 选项 && 选项.raw ? randomUUID() : epoch }
    if (data.traces.length > 100) data.traces = data.traces.slice(-100)
    // 记忆变了才备份（只写 trace 的时候不备，不然一天几百份）
    const sig = memSig(data.memories)
    if (lastSig.get(String(sid)) !== sig) {
      backupStore(sid)
    }
    writeFileAtomicSync(storePath(sid), JSON.stringify(data, null, 2))
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1765-1802](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L1765-L1802)

扩词执行顺序、文本输入及返回后的代际和 ID 核查。

<details>
<summary>查看原文（38行）</summary>

```text
async function 自动扩词(ctx, sid, 上限 = 2) {
  try {
    if (!sid) return 0
    const data = loadStore(sid)
    if (!data || !Array.isArray(data.memories)) return 0
    if (data.policy && data.policy.autoExpand === false) return 0
    const 要扩 = data.memories.filter((m) => !Array.isArray(m.related) || !m.related.length).slice(0, Math.max(1, 上限))
    if (!要扩.length) return 0
    const agent = (ctx.agents && typeof ctx.agents.get === 'function' ? ctx.agents.get(sid) : null)
      || ((ctx.agents && typeof ctx.agents.list === 'function' ? ctx.agents.list() : []) || [])[0]
    if (!agent) { diag('自动扩词：' + sid + ' 这会儿没有活着的 agent，跳过'); return 0 }
    const 输入 = 要扩.map((m, k) => k + 1 + '|' + String(m.text || '')).join('\n')
    const t0 = Date.now()
    const r = await 问模型(ctx, agent, 换自称成(换称呼(扩词系统_v2, pronounOf(sid)), selfPronounOf(sid)), 输入, 6000)
    if (!r || !r.ok) { diag('自动扩词：模型没回（' + ((r && r.message) || '?') + '）'); return 0 }
    const 表 = 解析扩词(r.text, 要扩.length)
    // ⚠⚠ 2026-10-24 修（用户报「记忆静默丢失」的**真凶**就在这几行）：
    //   原来是拿 await **之前**的快照 `data` 整份写回 —— 等模型那几秒里
    //   别人新记的记忆会被这一句直接盖掉（时间线证据：记完第 2 条 9 秒后被吞）。
    //   → 现在等完**重新读一遍**，按 id 找到那几条再改。
    const 目标ids = 要扩.map((m) => String(m.id))
    const 新库 = loadStore(sid)
    if (purgeEpochOf(data) !== purgeEpochOf(新库)) {
      diag('自动扩词：记忆库已彻底清理，丢弃旧结果')
      return 0
    }
    let 改了 = 0
    for (const k of Object.keys(表)) {
      const id = 目标ids[Number(k)]
      if (!id || !Array.isArray(表[Number(k)])) continue
      const m = (新库.memories || []).find((x) => String(x.id) === id)
      if (!m) continue // 这中间它被删了 / 被合了 → 跳过，别硬写
      m.related = 表[Number(k)]
      m.relatedAt = new Date().toISOString()
      改了++
    }
    if (改了) saveStore(sid, 新库)
    diag('自动扩词：' + sid + ' 补了 ' + 改了 + '/' + 要扩.length + ' 条（' + (Date.now() - t0) + 'ms，' + (r.provider || '?') + '/' + (r.model || '?') + '）')
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1491-1518](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L1491-L1518)

确实以宿主 llm.stream 发出文本请求。

<details>
<summary>查看原文（28行）</summary>

```text
  let messages
  try {
    messages = [
      createUserMessage({
        content: [{ type: 'text', text: 用户 }],
        source: { kind: 'plugin', plugin: 'dsh-fish-memory' },
      }),
    ]
  } catch (error) {
    return { ok: false, message: '构造消息失败：' + ((error && error.message) || error) }
  }
  let out = ''
  // ⭐ 1.4.8：**带上会话号** —— opencode 的网关（opencode.ai/zen/go）要求请求头里有
  //   `x-opencode-session`，不带就一律 `400 MissingSessionID`（记忆就静默不生成）。
  //   宿主靠这个头把请求路由到「持有这段对话缓存」的节点上；插件自己发起的调用以前没带，
  //   所以只有普通会话能用。这里把本会话的 id 交出去，和心情插件 0.7.9 的做法一致。
  let 会话号 = ''
  try { 会话号 = sessionIdOf(agent && agent.session) } catch { 会话号 = '' }
  try {
    for await (const chunk of ctx.llm.stream({
      provider: t.provider,
      model: t.model,
      system: 系统,
      messages: messages,
      ...(会话号 ? { sessionId: 会话号 } : {}),
      maxTokens: 最多 || 600,
      temperature: 0.1,
    })) {
```

</details>

**依据 7 · 源码核查**：[lib/index.js:4472-4496](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L4472-L4496)

缓存键与未选中时扩词触发条件。

<details>
<summary>查看原文（25行）</summary>

```text
          if (!query) return ''
          // ⭐ 1.5.2：同一次请求里的第 2~4 遍直接复用（键 = sid + query，1.5 秒有效）
          const 缓存键 = sid + '|' + query
          if (缓存键 === 注入缓存.键 && now - 注入缓存.时 < 1500) {
            return 注入缓存.文
          }
          const data = loadStore(sid)
          if (!data.memories.length) return ''
          补历史尺(sid, agent.session) // ⭐ 第一次用到时把她的会话历史补成尺子（只做一次）✓
          const { selected, scored, gate } = recall(data, query, now, sid)
          // ⭐ 1.4.3：「一条都没挑中」多半是那条记忆**还没扩过检索词**（related 是空的），
          //   所以只有原词能命中、分数卡在门槛下。搜空的时候顺手补一条 —— 下次它就有词可命中了。
          //   节流 60 秒、一次只补一条，免得一搜不到就一连串模型调用。
          try {
            // ⚠ 原来写的是 `!gate` —— 可门放行时 gate 也是个对象（记着信息量），
            //   所以说过 20 句以后这里就再没进来过。要判的是「是不是被门挡了」。
            //   常驻层那几条每轮都在，不算「挑中了」—— 看的是事件有没有挑中。
            if (!selected.some((r) => !r.常驻) && !(gate && gate.挡了)) {
              const 现 = Date.now()
              const 待补 = scored.find((r) => r.omission === 'below_threshold')
              if (待补 && 现 - 上次补词 > 60000) {
                上次补词 = 现
                后台排队(sid, () => 自动扩词(ctx, sid, 1))
              }
            }
```

</details>

**依据 8 · 源码核查**：[lib/index.js:4578-4581](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L4578-L4581)

卸载两种提示效果。

```text
    return function off() {
      卸掉效果(注入off)
      卸掉效果(提示off)
    }
```

**依据 9 · 源码核查**：[lib/index.js:4609-4624](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L4609-L4624)

分支复制独立库，清掉复制出来的轨迹。

<details>
<summary>查看原文（16行）</summary>

```text
  function 继承分支记忆(agent, sid) {
    const 来处 = 分支来处(agent)
    if (!来处) return false
    const 我的 = loadStore(sid)
    if ((我的.memories || []).length) return false // 自己已经有记忆了，别盖
    const 母的 = loadStore(来处)
    if (!(母的.memories || []).length) return false // 来处也没有，没什么可继承
    const 副本 = JSON.parse(JSON.stringify(母的))
    adoptTargetEpoch(副本, 我的) // 明确的跨会话复制使用目标库代际
    for (const m of 副本.memories || []) {
      m.source = m.source ? m.source + '｜分支继承' : '分支继承'
    }
    副本.traces = [] // 召回历史不跟着走，分支是新的开始
    saveStore(sid, 副本)
    if (isEnabled(来处)) setEnabled(sid, true) // 开关也跟着来处
    diag('分支继承：' + sid + ' ← ' + 来处 + '（' + (副本.memories || []).length + ' 条）')
```

</details>

#### 缺口

- 真实宿主历史保留、分支和备份的全部副本未枚举。
  **影响**：不能以设置页清空作为敏感信息已经消失的验收。
  **进一步探讨**：在空库加入无敏感标记，模拟扩词时编辑、删除和清空，检查缓存、日志、文件及已持久化的会话。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 管理接口的拒绝条件怎样改变试用边界？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、采用判断

#### 完整回答

设置页和管理路由需要宿主 webServer，更新路由也通过该服务接入。实际路由套住同一准入函数，拿不到 connection 或 requestRejection 抛错返回 503，宿主明确返回 401 或 403 时拒绝。浏览器标为 cross-site 或带非本机 Origin 时再拒绝，但不带 Origin 的请求仍依赖宿主判断。代码只识别宿主同步返回的两个拒绝状态，不提供独立身份验证。安装路由限定 POST，放行后可调用宿主 pluginManager.installBundle，因此远程代理或共享环境不能仅按 Origin 认为已有权限保障。推荐先在隔离本机、明确只开的测试会话关闭后台扩词，用样本验证召回和权限。若鉴权缺失或允许未授权请求，或旧内容在错误会话出现，停用并改回手工短档案。新版本修掉了旧版缺服务时默认放行的分支，实际宿主如何解析来源与会话还须核对。

#### 证据与依据

**依据 1 · 源码核查**：[lib/准入.mjs:9-37](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/%E5%87%86%E5%85%A5.mjs#L9-L37)

缺服务与异常拒绝、只比较两个宿主返回状态、浏览器头附加过滤。

<details>
<summary>查看原文（29行）</summary>

```text
const 本地来源 = /^(?:dsh-app:|https?:\/\/(?:127\.0\.0\.1|localhost|\[::1\])(?::\d+)?\/?$)/i

/**
 * 建一个准入函数。返回 null = 放行；返回 { 码, 说 } = 拒绝。
 */
export function 建准入(ctx, 记账 = () => {}) {
  return function 准入(req) {
    let 拒
    try {
      const 连接 = ctx.get('connection')
      if (!连接 || typeof 连接.requestRejection !== 'function') {
        // ⚠ 失败即拒绝：拿不到宿主的准入服务，就当这个请求不可信
        return { 码: 503, 说: '拿不到宿主的 connection 服务' }
      }
      拒 = 连接.requestRejection(req)
    } catch (error) {
      return { 码: 503, 说: '准入服务自己抛错：' + ((error && error.message) || error) }
    }
    if (拒 === 401 || 拒 === 403) return { 码: 拒, 说: '宿主判了外来请求' }

    // 再兜一层：浏览器带的「跨站」标记 / 不是本机来的 Origin
    const 头 = (req && req.headers) || {}
    if (String(头['sec-fetch-site'] || '').toLowerCase() === 'cross-site') {
      return { 码: 403, 说: '跨站请求' }
    }
    const 源 = String(头.origin || '')
    if (源 && !本地来源.test(源)) return { 码: 403, 说: '来源不是本机：' + 源.slice(0, 80) }
    return null
  }
```

</details>

**依据 2 · 源码核查**：[lib/准入.mjs:43-62](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/%E5%87%86%E5%85%A5.mjs#L43-L62)

拒绝结果提前返回给客户端。

<details>
<summary>查看原文（20行）</summary>

```text
export function 包准入(准入, handler, 记账 = () => {}) {
  return async function 带准入的(req, res) {
    const 结果 = 准入(req)
    if (结果) {
      try {
        记账('管理接口拒了一次（' + 结果.码 + '，' + 结果.说 + '）：' + String((req && req.url) || ''))
      } catch (error) {}
      try {
        res.writeHead(结果.码, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
        res.end(JSON.stringify({
          ok: false,
          error: 结果.码 === 401 ? 'authentication_required'
            : 结果.码 === 503 ? 'management_unavailable' : 'management_forbidden',
          说: 结果.说,
        }))
      } catch (error) {}
      return
    }
    return handler(req, res)
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:4860-4888](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L4860-L4888)

设置页管理路由使用准入并按 webServer 有无注册。

<details>
<summary>查看原文（29行）</summary>

```text
    // ⭐ 1.5.7（issue #35）：准入改成**失败即拒绝**。
    //   以前这里在拿不到 connection、或者 requestRejection 自己抛错时放行 ——
    //   于是本机任意网页都能打到管理接口（包括一键安装）。现在判不了就拒。
    const 准入 = 建准入(ctx, diag)
    const 只认本人 = (handler) => 包准入(准入, handler, diag)

    // ⭐ 网页服务是可选的：有 webServer 才挂设置页（跟 DSH 自己的写法一样，ctx.inject 按服务在不在挂/卸）。
    //   没有网页服务时（无界面 profile）记忆照常记、照常想起来，只是没有设置页 —— 而不是整个插件起不来。
    //   宿主没有 ctx.inject（老宿主 / 测试替身）就照旧直接挂。
    const mroute = (path, handler) =>
      typeof ctx.inject === 'function'
        ? ctx.inject(['webServer'], (c) => 挂路由(c, path, handler))
        : 挂路由(ctx, path, handler)
    const 挂路由 = (ctx, path, handler) =>
      ctx.effect(() =>
        ctx.webServer.register({
          kind: 'exact',
          path: path,
          handler: async (req, res) => {
            try {
              await 只认本人(handler)(req, res)
            } catch (error) {
              try {
                res.writeHead(500, { 'content-type': 'application/json' })
                res.end(JSON.stringify({ ok: false, error: String(error && error.message) }))
              } catch (e2) {}
            }
          },
        }),
```

</details>

**依据 4 · 源码核查**：[lib/index.js:4904-4908](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L4904-L4908)

更新模块注册传入相同准入。

```text
    if (typeof ctx.inject === 'function') {
      ctx.inject(['webServer'], (c) => 自查更新.register(c, '/dsh-fish-memory', 准入))
    } else {
      自查更新.register(ctx, '/dsh-fish-memory', 准入)
    }
```

**依据 5 · 源码核查**：[lib/selfupdate.mjs:168-182](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/selfupdate.mjs#L168-L182)

成功后实际调用宿主 installBundle。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[lib/selfupdate.mjs:189-214](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/selfupdate.mjs#L189-L214)

自更新路由包装同一道准入。

<details>
<summary>查看原文（26行）</summary>

```text
  function register(ctx, route, 准入) {
    const send = (res, code, obj) => {
      res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
      res.end(JSON.stringify(obj))
    }
    // ⭐ 1.5.7（issue #35）：这两个路由以前**没有准入** —— 本机任意网页都能触发安装。
    //   现在一律先过准入（失败即拒绝）。
    const 过 = (handler) => async (req, res) => {
      if (typeof 准入 === 'function') {
        const 结果 = 准入(req)
        if (结果) {
          try { log('管理接口拒了一次（' + 结果.码 + '，' + 结果.说 + '）：' + String((req && req.url) || '')) } catch (e) {}
          return send(res, 结果.码, {
            ok: false,
            error: 结果.码 === 401 ? 'authentication_required'
              : 结果.码 === 503 ? 'management_unavailable' : 'management_forbidden',
          })
        }
      }
      return handler(req, res)
    }
    try {
      ctx.effect(() => ctx.webServer.register({
        kind: 'exact',
        path: route + '/update',
        handler: 过(async (req, res) => {
```

</details>

**依据 7 · 源码核查**：[lib/selfupdate.mjs:225-238](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/selfupdate.mjs#L225-L238)

安装路由检查 POST 再启动安装。

<details>
<summary>查看原文（14行）</summary>

```text
      // ⭐ 一键更新：POST。装完的结果原样带回去（可能要重启才生效）
      ctx.effect(() => ctx.webServer.register({
        kind: 'exact',
        path: route + '/install',
        handler: 过(async (req, res) => {
          if (req.method !== 'POST') { send(res, 405, { ok: false, error: '只接受 POST' }); return }
          try {
            const r = await install(ctx)
            send(res, 200, r)
          } catch (e) {
            log('一键更新路由失败：' + (e && e.message))
            send(res, 200, { ok: false, error: String((e && e.message) || e) })
          }
        }),
```

</details>

#### 缺口

- 宿主 connection 对匿名请求及代理来源的实际判定未验证。
  **影响**：隔离试用可先验证；共享部署所需的安全条件仍未确立。
  **进一步探讨**：在授权的隔离实例分别使用匿名、本机登录及带跨站标记的请求观察管理端点，不调用真实安装。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样判断减少无关注入的收益是否覆盖漏召回和成本？

**研究主题**：新假设与验证、效果与总成本

#### 完整回答

可以比较三种同任务的做法：维护手工短档案、启用当前事件检索、为少数用户确认且有截止日的约定另设固定预算。第三种是未验证方案，目的是让关键约束跨过短问门，同时限制固定文本挤占预算。给每种做法同一组重复问候、带歧义的中文短问、变更后的约定和普通事件。插件轨迹记录候选、门槛和所选条目，配合任务验收可以区分应记而没写、该找而没找以及找对但模型回答错误。每个合格任务分别记录漏掉约定、带出无关或过期内容的次数，另统计注入 token、扩词请求与人工维护分钟。若新增固定条目导致无关注入增加，或带来的少量遗漏改善抵不过人工维护和额外输入，就保留事件检索配人工约束。当前只有源码机制和作者说明，没有可比较的结果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:4480-4496](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L4480-L4496)

能观察到召回、空结果和额外调用触发的不同阶段。

<details>
<summary>查看原文（17行）</summary>

```text
          补历史尺(sid, agent.session) // ⭐ 第一次用到时把她的会话历史补成尺子（只做一次）✓
          const { selected, scored, gate } = recall(data, query, now, sid)
          // ⭐ 1.4.3：「一条都没挑中」多半是那条记忆**还没扩过检索词**（related 是空的），
          //   所以只有原词能命中、分数卡在门槛下。搜空的时候顺手补一条 —— 下次它就有词可命中了。
          //   节流 60 秒、一次只补一条，免得一搜不到就一连串模型调用。
          try {
            // ⚠ 原来写的是 `!gate` —— 可门放行时 gate 也是个对象（记着信息量），
            //   所以说过 20 句以后这里就再没进来过。要判的是「是不是被门挡了」。
            //   常驻层那几条每轮都在，不算「挑中了」—— 看的是事件有没有挑中。
            if (!selected.some((r) => !r.常驻) && !(gate && gate.挡了)) {
              const 现 = Date.now()
              const 待补 = scored.find((r) => r.omission === 'below_threshold')
              if (待补 && 现 - 上次补词 > 60000) {
                上次补词 = 现
                后台排队(sid, () => 自动扩词(ctx, sid, 1))
              }
            }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4507-4520](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L4507-L4520)

轨迹保存查询、门槛、入选 ID 和部分评分。

<details>
<summary>查看原文（14行）</summary>

```text
          const 上一条 = data.traces[data.traces.length - 1]
          const 同一次 = 上一条 && 上一条.query === query.slice(0, 200) &&
            Math.abs(now - Number(上一条.at || 0)) < 3000
          const 这条 = {
            at: now,
            session: sid,
            query: query.slice(0, 200),
            // 这道门挡下来的时候记一笔，设置页上就能看见「为什么这次没翻记忆」✓
            gate: gate ? gate.信息量 : null,
            gateLimit: gate ? gate.门槛 : null,
            picked: selected.map((r) => r.m.id),
            rows: scored.slice(0, 24).map((r) => ({
              id: r.m.id,
              C: Number(r.s.C.toFixed(3)),
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3567-3581](https://github.com/Yuuyuko-uu/dsh-fish-memory/blob/9b49f20279835c1fce3e2f924a48ef0da2fd5a75/lib/index.js#L3567-L3581)

现有选择规则没有常驻层，可作为实验基线。

<details>
<summary>查看原文（15行）</summary>

```text
  // ⭐ 1.5.7：**长期事实（每轮无条件带几条）已整个删除**。
  //   理由：闲聊时把跟当下无关的记忆塞进去，会把话带跑；身份/称呼这类由星汐每轮开头带。
  //   现在只有「这句话检索命中」的记忆才会进上下文。
  // 普通事件：从去重后的候选里按分数拿，受 maxItems 和「这趟上限」两条约束
  const 事件们 = 去重后.map((x) => x.row).filter((row) => !row.m || row.m.category !== 'stable_profile')
  const 最高事件分 = 事件们.length && 事件们[0].s ? 事件们[0].s.C : 0
  const 事件本趟上限 = 事件们.length ? 分档.find(([线]) => 最高事件分 >= 线)[1] : 0
  const 事件名额 = Math.min(事件本趟上限, policy.maxItems)
  const 条数内 = 事件们.slice(0, 事件名额)
  for (const row of 事件们.slice(事件名额)) {
    if (!row.omission) row.omission = 'weak' // 设置页上会写「这趟给的条数到顶了」
  }

  const { selected, 字数: 已用 } = 按字数收(条数内, policy)
  const ids = new Set(selected.map((r) => r.m.id))
```

</details>

#### 缺口

- 缺少配对任务的收益和成本记录。
  **影响**：无法判断值得承担的每任务成本。
  **进一步探讨**：固定宿主版本、模型、题集和判据，独立记录输入、输出、轨迹及每轮额外请求。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
