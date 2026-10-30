# 模型接力

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[75b1b7e](https://github.com/Airisey/dsh-model-failover/tree/75b1b7e9784eec172b542eec03420a4dc9c010d7)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Airisey/dsh-model-failover)
<!-- END META -->

> **功能**：把候选队列包装成模型，提交前切换并按会话/模板隔离，另有全局自动继续；停止与终态需核。

> **亮点**：以可见输出提交点约束一次调用内的静默混流，把候选选择、真实调用和会话×模板隔离组织为恢复机制；可借鉴的是边界与接线，不是已证明任务正确率或工具事务恢复。见[Q02](#research-q02)。

> **主要限制**：已提交内容后的抛错/idle可能没有补错误finish却记good；enabled只缩候选仍可重试首模型，全局继续默认独立开启且等待后不重读开关。可见提交、停止与业务办结不能互相替代，源码条件未作运行复现，见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 模型接力改变哪种任务，包装路由与Agent循环怎样区分？](#detail-section-11)
  - [Q02 · 候选、缓存提交和失败终态如何真实接线？](#detail-section-12)
  - [Q03 · 全局自动继续、关闭/等待和会话隔离的真实边界是什么？](#detail-section-13)
  - [Q04 · 管理、持久化、依赖与四阶段成本/效果怎样界定？](#detail-section-14)
  - [Q05 · 既有提交边界之外还有什么增量，怎样避免把修bug包装成新方向？](#detail-section-15)
  - [Q06 · 当前采用等级和停止退路应该怎样落地？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有多个provider的DSH用户在额度/短时故障下推进可回滚任务，以正确产物和总成本验收，不以吐字/绿数/继续次数当完成。见[Q01](#research-q01)。

相对手动换provider，集中重试、会话模板隔离和轮级补发；若稳定单provider或人工查询足够，恢复自动化未必更省。wrapper、模型协议、工具执行及Agent循环归宿主/原provider，见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 模型包装/接力 | 模板作为模型，nested候选恢复 | 原provider/宿主执行；提交后不换不等完整错误终态 |
| 分桶健康/目录 | 会话×模板隔离、逻辑日重置/已知窗口 | good是可见内容，冷目录/全部隔离有fallback，不是账户/任务健康 |
| 全局自动继续 | turn/end后真实用户followup | 默认独立开启，次数/epoch不是工具幂等或硬停止 |
| Web管理/诊断 | 配队列、probe、重置和模型标签 | 有准入条件；空probe可ok，设置/flush非事务或账单 |

**流程与依赖**

每个候选先独立可用并核数据/账户范围；默认可把已连接模型填入模板，窗口和模态仍需实机验。全局继续另依赖agents，管理依赖webServer/connection与文件目录；条件表见[Q04](#research-q04)。

先缩队列并分别限定两层恢复，再以同任务/同预算对照；关闭enabled不能当全停，退出先查待补和上游，再换稳定provider/清理数据。步骤与失败判据见[Q04](#research-q04)。

**效果与成本**

总负担按所有候选/同模型/轮级调用、丢弃思考、未决工具与人工纠错结算；次数、idle和绿数都不是现金上限。四阶段明细集中[Q04](#research-q04)，没有可报告净节省。

可确认的是提交前恢复的可检查性；提交内容、完整终态、工具结果和任务正确需分层评，probe成功也可能只是未见失败。效果表见[Q04](#research-q04)，对照及否定条件见[Q05](#research-q05)。

> **思考**：已提交内容后的抛错/idle可能没有补错误finish却记good；enabled只缩候选仍可重试首模型，全局继续默认独立开启且等待后不重读开关。可见提交、停止与业务办结不能互相替代，源码条件未作运行复现，见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以可见输出提交点约束一次调用内的静默混流，把候选选择、真实调用和会话×模板隔离组织为恢复机制；可借鉴的是边界与接线，不是已证明任务正确率或工具事务恢复。见[Q02](#research-q02)。

可借鉴可见提交与会话模板分桶、outer retry声明和epoch过期检查；移植必须同时核下游终态/取消、宿主工具执行回执与真实开关语义，不能只复制错误码/注释。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

已提交内容后的抛错/idle可能没有补错误finish却记good；enabled只缩候选仍可重试首模型，全局继续默认独立开启且等待后不重读开关。可见提交、停止与业务办结不能互相替代，源码条件未作运行复现，见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察：先修/验失败终态和关闭/等待语义，限定可回滚任务与候选，再对照正确产物、人工和全成本；发生越过停止/重复/账实不符即查未决后回退，见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持提交前接力和分桶恢复；默认全局继续、停止开关及提交后终态存在具体条件边界。未运行宿主/模型/任务，建议观察而非用吐字率代替业务验收。

- 已检查：作者 README、包清单、源码路径 README.md、client.js、cordis.patch.yml、index.js、lib/adapter.js、lib/autocontinue.js、lib/catalog.js、lib/constants.js、lib/health.js、lib/network.js、lib/notes.js、lib/store.js、lib/trust.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核根manifest/补丁/注册、候选目录与最窄已知上下文、实际nested模型流/提交/终态/idle/重试、健康分桶/逻辑日、全局AutoContinue到followup及UI开关真实caller、模型便签、API准入/probe/reset/forget和JSON持久/退出。未全审全部UI、宿主admission/Agent与原provider内部、跨进程存储或真实账户/工具事务；未执行目标/作者测试或模型。
- 下一步：只读固定源码/原件及研究装配校验，未安装、跑目标/作者测试、模型、HTTP管理或真实工具。后续核首内容后抛错/idle、可见max-tokens、enabled关后次数、待补关开关/插话/卸载、工具后失败和全尝试费用；见[Q06](#research-q06)。

**分析版本**

- **仓库**：[Airisey/dsh-model-failover](https://github.com/Airisey/dsh-model-failover)
- **版本号**：1.0.0（[固定提交 75b1b7e](https://github.com/Airisey/dsh-model-failover/tree/75b1b7e9784eec172b542eec03420a4dc9c010d7)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先修终态/开关/待补与空probe等具体语义，再用宿主工具回执/未决摘要约束恢复，比较小修补、关继续和人工查询；若无重复动作/纠错成本净改善就否定独立方向。尚未实现/验证，见[Q05](#research-q05)。

只读固定源码/原件及研究装配校验，未安装、跑目标/作者测试、模型、HTTP管理或真实工具。后续核首内容后抛错/idle、可见max-tokens、enabled关后次数、待补关开关/插话/卸载、工具后失败和全尝试费用；见[Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 11 | 5974 | 3829 | 1805 | — |
| .md | source | 1 | 398 | — | — | 9260 |
| .mjs | test | 4 | 5893 | 4748 | 526 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Airisey/dsh-model-failover/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Airisey/dsh-model-failover/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Airisey/dsh-model-failover/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核多模型恢复的真实提交/终态、全局继续/停止与工具未决边界，比较正确任务和全成本，形成可否定方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模型接力改变哪种任务，包装路由与Agent循环怎样区分？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

根组件是private Git源码插件dsh-model-failover1.0.0、MIT，Node声明^22.19.0或>=24，peer为Cordis^4.0.2，index.js/client.js及lib都在固定Git中。补丁挂Host插件，入口只强依赖llm，分别可选注入webServer和agents；没有后两者不等接力路由一定不加载，但分别缺Web管理和轮级自动继续。运行接口/客户端slots仍须同实际宿主核验，不采作者“版本无关”作兼容保证。

面向已接多个provider、经常遭遇额度或短时上游故障的DSH用户，优先评可回滚文本/开发任务。合格单位是正确办结的一项任务，而不是队列里终于有人吐字。入口真实构造Catalog/DailyHealth/FailoverAdapter并registerAdapter；一条模板是一个模型，首次扫描会把当前已接入模型灌入默认模板，之后用户控制队列。没有免费价格过滤或逐任务账户许可锁，需先检查候选的真实账号、费用和数据范围；重发同provider/model也不证明实际已换账户。

相比手动切provider，增量是提交前缓存、候选重试、会话×模板隔离和轮级补发的组合。模型、凭据、流协议与工具执行由原provider/DSH承担；本插件不新增业务工具或独立实现通用工具决策循环。轮级AutoContinue实际发一条用户“继续”，由宿主Agent重新决策，不能把继续消息、健康绿数和作者“直到任务跑完”当业务完成证明。已有单provider能稳定完成时，手动重试/现有错误提示是更简单的对照。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-26](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/package.json#L1-L26)

根版本/private/入口/Node与分发范围。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-model-failover",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "模型接力 — 把已接入 dsh 的全部模型排成一条优先级队列，用它当模型跑任务：额度耗尽或模型无法输出时自动重试「继续」，再不行就切到下一个模型，直到任务跑完；当天出过问题的模型会被隔离，次日设定时间后自动复活。",
  "main": "./index.js",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "files": [
    "index.js",
    "client.js",
    "lib",
    "locale",
    "cordis.patch.yml",
    "README.md"
  ],
  "keywords": [
    "dsh",
```

</details>

**依据 2 · 作者声明**：[package.json:42-46](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/package.json#L42-L46)

Cordis依赖和许可声明。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2"
  },
  "license": "MIT"
}
```

**依据 3 · 源码核查**：[cordis.patch.yml:1-8](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/cordis.patch.yml#L1-L8)

实际挂载入口。

```text
# dsh-model-failover bundle patch.
#
# 一行 insert 即挂载 Host 半身；浏览器半身由 package.json 的 dsh.client 声明，
# 并绑定在 name 为裸包名的这一行上（子路径行不会携带半身）。
- insert:
    - id: model-failover
      name: 'dsh-model-failover'
      config: {}
```

**依据 4 · 源码核查**：[index.js:352-367](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/index.js#L352-L367)

实际构造及adapter注册。

<details>
<summary>查看原文（16行）</summary>

```text

  const adapter = new FailoverAdapter({
    llm: ctx.llm,
    settings: settingsFile,
    health,
    catalog,
    notes,
    log: {
      warn: (message) => logger.warn?.(`model-failover: ${message}`),
      push: (event) => pushEvent(event),
    },
  })

  // ── 注册路由：这就是用户在模型选择器里看到的那个「模型」 ──────────────────
  const registration = ctx.llm.registerAdapter([ROUTE], adapter)
  logger.info?.(`model-failover: 路由 ${ROUTE} 已注册（模型选择器里的「${ROUTE_LABEL}」）`)
```

</details>

**依据 5 · 源码核查**：[index.js:380-405](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/index.js#L380-L405)

默认模板首次填入已连接模型。

<details>
<summary>查看原文（26行）</summary>

```text
  // ── 首次运行把「当前已接入 dsh 的所有模型」灌进队列 ───────────────────────
  // 只填一次：之后顺序由用户在设置页掌握，再自动追加只会覆盖用户的意图。
  const bootstrap = async () => {
    const current = settingsFile.get()
    if (current.bootstrapped) return
    const entries = await catalog.refresh()
    if (entries.length === 0) {
      // 一条路由都没扫到（llm 还没挂完、或全部读取失败）：不写 bootstrapped，
      // 留给下一次进程启动再试，免得用户看到一个永远空着的队列。
      logger.warn?.('model-failover: 扫描不到任何已接入的模型，队列暂时为空，稍后重启会再试一次')
      return
    }
    const latest = settingsFile.get()
    if (latest.bootstrapped) return
    const template = latest.templates[0]
    const seen = new Set(template.order.map((item) => routeKey(item.provider, item.model)))
    const order = [...template.order]
    for (const entry of entries) {
      const key = routeKey(entry.provider, entry.model)
      if (seen.has(key)) continue
      seen.add(key)
      order.push({ provider: entry.provider, model: entry.model })
    }
    settingsFile.update({ bootstrapped: true, templates: [{ ...template, order }, ...latest.templates.slice(1)] })
    settingsFile.flush()
    logger.info?.(`model-failover: 已把 ${order.length} 个已接入的模型排进「${template.name}」，可在设置页调整顺序`)
```

</details>

**依据 6 · 源码核查**：[index.js:793-816](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/index.js#L793-L816)

Web与agents分开按需挂载。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.inject(['webServer'], (scoped) => {
    const server = scoped.webServer
    scoped.effect(
      () => server.register({ kind: 'prefix', path: API_PREFIX, handler: api }),
      'model-failover: settings API',
    )
    logger.info?.(`model-failover: 设置接口已挂载到 ${API_PREFIX}`)
  })

  // ── 本轮失败 / 输出撞上限时，自动补一句「继续」 ────────────────────────────
  // `agents` 和 `webServer` 一样**故意不写进 inject**：headless 组合（TUI、
  // 离线测试）里没有它，写进去会让整个插件静默不加载，连接力一起丢掉。
  ctx.inject(['agents'], (scoped) => {
    const autoContinue = new AutoContinue({
      agents: scoped.agents,
      settings: settingsFile,
      notes,
      log: {
        info: (message) => logger.info?.(`model-failover: ${message}`),
        warn: (message) => logger.warn?.(`model-failover: ${message}`),
        push: (event) => pushEvent(event),
      },
    })
    scoped.effect(() => autoContinue.attach(scoped), 'model-failover: auto continue')
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 候选、缓存提交和失败终态如何真实接线？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

stream按sessionId/模板取当日健康快照，再按模板顺序过滤隐藏、自身路由与已知目录；目录冷时允许交真实宿主判定，全部被隔离默认也能再按原序试。每候选默认原样请求共3次，最多配置6次，切模型才按候选序号追加最多3条“继续”；同模型不是额外再补一条继续。外层providerRetryPolicy声明maxRetries=0及不匹配真实错误的哨兵，避免宿主把整队重跑，但候选自身provider/宿主重试仍独立，不能当统一请求/金额上限。

#attempt真正调用this.llm.stream({...options,provider,model,messages})，保留宿主signal等参数，思考档位先删除再只在候选自己声明支持时补入。包装resolveModel声明text/image并取已知候选的最窄contextWindow；未知窗口会被跳过，因此不是所有候选兼容/最小窗口的完整证明，更不是图像或工具质量保证。底层maxTokens和其他能力仍需逐候选验。

提交前held缓存所有收到的chunk，非空文本、tool-call-delta及非reasoning的block-end才提交；reasoning不算答案。第一次提交会冲出held，之后原样转发，不再换模型，从而避免在一次调用里把两份可见回答静默混合。这个边界不等工具事务：tool delta并不证明工具已经执行或正确，而后续轮级继续可能再决策。held没有显式字节/总时间上限，思考持续来chunk会重置idle，失败丢弃的思考、请求和等待也有成本。

终态须分提交前后。未提交且无finish/异常会被failureOf归NO_VISIBLE_OUTPUT，最终队列可合成error finish；用户取消/不可切换错误等有退出支路。已提交时却有更窄保证：若下游先给文本后next抛错或idle，catch记录failure，但返回对象在committed时把failure清为undefined，外层直接markGood并return，没有补错误finish。因此不再换模型不等正确失败终态，宿主最终怎么处理缺finish未运行；不能把markGood/成功计数当任务成功。已有明确error finish会被原样转发，不应反向说所有提交后错误都丢失。

idle用race与iterator.return控制消费，idle分支不等待挂起return，也没有自己创建AbortController取消下游；它不证明远端计算/计费停止。可见文字后的max-tokens同样先走committed清ceiling，而truncated只在!committed时成立，所以“两次上限后轮换”只覆盖未提交内容的截断，不能按注释许所有半句截断都会换模型。以上是源码条件推导，未作为运行故障复现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/adapter.js:51-55](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L51-L55)

同模型尝试数。

```text
function sameModelTries(settings) {
  const raw = settings?.sameModelRetries
  if (Number.isInteger(raw) && raw >= 0) return Math.min(raw, MAX_SAME_MODEL_RETRIES) + 1
  return (settings?.retrySameModelOnce === false ? 0 : 2) + 1
}
```

**依据 2 · 源码核查**：[lib/adapter.js:238-240](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L238-L240)

外层retry声明。

```text
  providerRetryPolicy(_provider) {
    return { mode: 'normal', maxRetries: 0, retryableCodes: [NEVER_RETRY], ...DEFAULT_BACKOFF }
  }
```

**依据 3 · 源码核查**：[lib/adapter.js:333-397](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L333-L397)

实际候选/隔离/关闭分支及plan展开。

<details>
<summary>查看原文（65行）</summary>

```text
  chain(settings, template, snapshot, skip = 0) {
    const hidden = new Set(settings.hiddenProviders ?? [])
    const known = this.catalog.cached()
    const knownKeys = known.length === 0 ? undefined : new Set(known.map((item) => routeKey(item.provider, item.model)))
    const ordered = []
    for (const item of Array.isArray(template?.order) ? template.order : []) {
      if (ordered.length >= MAX_TEMPLATE_CANDIDATES) break
      if (item === null || typeof item !== 'object') continue
      const provider = String(item.provider ?? '')
      const model = String(item.model ?? '')
      if (provider === '' || model === '') continue
      if (provider === ROUTE || hidden.has(provider)) continue
      // 清单是冷的就不筛（fail-open）：宁可让宿主回一个 NO_ADAPTER 被跳过，
      // 也不要在目录还没扫完时把用户整条队列清空。
      if (knownKeys !== undefined && !knownKeys.has(routeKey(provider, model))) continue
      // 每个候选自带的思考强度跟着它一起走：换到下一个模型时，用的是**那个**
      // 模型自己的档位，不是上一个的。
      const reasoningEffort =
        typeof item.reasoningEffort === 'string' && item.reasoningEffort.trim() !== ''
          ? item.reasoningEffort.trim()
          : undefined
      ordered.push(reasoningEffort === undefined ? { provider, model } : { provider, model, reasoningEffort })
    }
    // 总开关关掉时这条路由仍然能跑，只是退化成「永远用优先级最高的那一个」，
    // 不再重试、不再切换、也不再隔离 —— 排查问题时这样最干净。
    let candidates
    if (settings.enabled === false) {
      candidates = ordered.slice(0, 1)
    } else {
      const usable = ordered.filter((item) => !snapshot.quarantined.has(routeKey(item.provider, item.model)))
      if (usable.length > 0) candidates = usable
      else candidates = settings.retryWhenAllQuarantined === false ? [] : ordered
    }
    if (!Number.isInteger(skip) || skip <= 0 || candidates.length < 2) return candidates
    // 取模是为了让队列真的转起来：跳过头了就从头接上，而不是原地不动。
    const at = ((skip % candidates.length) + candidates.length) % candidates.length
    if (at === 0) return candidates
    return [...candidates.slice(at), ...candidates.slice(0, at)]
  }

  /**
   * 把候选序列展开成执行步骤。
   *
   * 「继续」的条数 = 已经失败过的轮数：第 0 个模型第一次就是原始请求，之后
   * 每退让一步就多带一条「继续」—— 用户要求的「重试这个模型发继续」「切换到
   * 下一个模型发继续」都落在这一步上。
   */
  plan(settings, template, snapshot, skip) {
    const chain = this.chain(settings, template, snapshot, skip)
    const tries = sameModelTries(settings)
    const steps = []
    for (let index = 0; index < chain.length; index += 1) {
      // 退到队列里第 index 个模型时带几条「继续」：第 0 个是原始请求，每多换
      // 一次模型就多带一条 —— 用户要的「换下一个模型时发继续」落在这里。
      const continues = Math.min(index, MAX_CONTINUES)
      // 同一个模型的每次尝试发**完全相同的请求**。
      //
      // 一是为了换账号：只有重发原请求，`dsh-our-free-model` 这类多账号反代
      // 才会重新进一次账号池，把刚才那个坏账号换掉。二是新账号压根没写过东西，
      // 收到「继续」只会莫名其妙。
      for (let attempt = 0; attempt < tries; attempt += 1) {
        steps.push({ candidate: chain[index], continues })
      }
    }
    return steps
```

</details>

**依据 4 · 源码核查**：[lib/adapter.js:697-715](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L697-L715)

实际nested llm.stream caller和参数。

<details>
<summary>查看原文（19行）</summary>

```text
  async * #attempt(candidate, options, messages, effort, idleMs = 0) {
    const nested = { ...options, provider: candidate.provider, model: candidate.model, messages }
    // 调用方给「模型接力」这条路由选的档位不能原样透给候选：它是在队列的并集上
    // 校验过的，候选未必认识。这一轮该不该带档位由 `#effortFor` 决定，所以这里
    // 显式删掉，避免它顺着 `...options` 漏下去。
    if (effort === undefined) delete nested.reasoningEffort
    else nested.reasoningEffort = effort
    let iterator
    try {
      iterator = this.llm.stream(nested)[Symbol.asyncIterator]()
    } catch (error) {
      return { committed: false, finish: undefined, failure: failureOf(undefined, error), held: [] }
    }

    const held = []
    let committed = false
    let finish
    let failure
    let drained = false
```

</details>

**依据 5 · 源码核查**：[lib/adapter.js:101-108](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L101-L108)

真正提交判据。

```text
export function commitsAnswer(chunk) {
  if (chunk === null || typeof chunk !== 'object') return false
  if (chunk.type === 'text-delta') return typeof chunk.text === 'string' && chunk.text.trim() !== ''
  if (chunk.type === 'tool-call-delta') return true
  if (chunk.type !== 'block-end') return false
  if (chunk.block?.type === 'reasoning') return false
  if (chunk.block?.type === 'text') return typeof chunk.block.text === 'string' && chunk.block.text.trim() !== ''
  return true
```

**依据 6 · 源码核查**：[lib/adapter.js:760-812](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L760-L812)

next异常/idle、缓存和交付。

<details>
<summary>查看原文（53行）</summary>

```text
    try {
      for (;;) {
        let row
        try {
          const step = await nextChunk()
          if (step.idle === true) idled = true
          else row = step.row
        } catch (error) {
          drained = true
          failure = failureOf(undefined, error)
          break
        }
        if (idled) {
          // 超时这一跳不算「下游出错」：把结局写成一次正常失败，让上面那套
          // 隔离/换人逻辑照常处理 —— 卡住的模型和报错的模型，对用户是一回事。
          failure = {
            code: CODE_IDLE_TIMEOUT,
            message: `${candidate.provider}/${candidate.model} 超过 ${Math.round(idleMs / 1000)} 秒没有任何输出，判定为卡住。`,
          }
          break
        }
        lastAt = this.now()
        if (row.done === true) {
          drained = true
          break
        }
        const chunk = row.value
        if (chunk !== null && typeof chunk === 'object') {
          if (chunk.type === 'finish') {
            finish = chunk
            finishedAt = this.now()
          } else if (chunk.type === 'usage') {
            if (Number.isFinite(chunk.usage?.outputTokens)) outputTokens = chunk.usage.outputTokens
          } else if (
            firstDeltaAt === undefined &&
            (chunk.type === 'text-delta' || chunk.type === 'reasoning-delta' || chunk.type === 'tool-call-delta')
          ) {
            firstDeltaAt = this.now()
          }
        }
        if (committed) {
          yield chunk
          continue
        }
        held.push(chunk)
        if (commitsAnswer(chunk)) {
          committed = true
          for (const pending of held) yield pending
          held.length = 0
        }
      }
    } finally {
      // 消费方提前中断（用户按停止）时必须显式向下游传播 return()，否则上游
```

</details>

**依据 7 · 源码核查**：[lib/adapter.js:813-834](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L813-L834)

真正return清理，idle不等收尾。

<details>
<summary>查看原文（22行）</summary>

```text
      // HTTP 流会继续跑完 —— 供应商照常计满 token，chunk 却没人接。
      if (!drained) {
        const closing = (() => {
          try {
            return iterator.return?.()
          } catch {
            return undefined
          }
        })()
        if (idled) {
          // 超时这一跳**不能等** return() 落地：下游正挂在一次没完没了的读上，
          // return() 要等那个 await 自己回来才轮得到，等于把超时又变回「等到
          // 天荒地老」。发了就当收工，它的结果（或异常）没人要。
          void Promise.resolve(closing).catch(() => {})
        } else {
          try {
            await closing
          } catch {
            /* 关闭失败无关紧要 */
          }
        }
      }
```

</details>

**依据 8 · 源码核查**：[lib/adapter.js:846-865](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L846-L865)

truncated只未提交、提交后清failure。

<details>
<summary>查看原文（20行）</summary>

```text
    const truncated = !committed && finish?.reason?.kind === 'max-tokens'
    if (!committed && failure === undefined && !truncated) failure = failureOf(finish, undefined)
    // 速度只在「这一趟真的收到了 finish，并且吐过 token」时才算数：中途报错、
    // 一个 token 都没吐、或者根本没有 usage 的供应商，都不该在界面上留下一个
    // 假的数字。
    const speed =
      firstDeltaAt !== undefined &&
      finishedAt !== undefined &&
      finishedAt > firstDeltaAt &&
      Number.isFinite(outputTokens) &&
      outputTokens > 0
        ? { tokens: outputTokens, ms: finishedAt - firstDeltaAt }
        : undefined
    return {
      committed,
      truncated,
      finish,
      failure: committed || truncated ? undefined : failure,
      held: committed ? [] : held,
      speed,
```

</details>

**依据 9 · 源码核查**：[lib/adapter.js:534-545](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L534-L545)

committed直接markGood/清ceiling并返回。

<details>
<summary>查看原文（12行）</summary>

```text
      if (result.committed) {
        // 这一轮正常写完了：撞上限的旧账一笔勾销，下一个任务还从队首开始。
        if (userFacing && sessionId !== undefined) this.ceiling.delete(sessionId)
        // 这个模型今天被验证过能用了；下一个任务从它开始。
        const recorded = this.health.markGood(key, this.now(), sessionId, templateId)
        this.health.file.flush()
        if (recorded) this.log.push({ at: this.now(), kind: 'good', provider, model, attempts: index + 1 })
        return
      }

      // 撞到输出上限：**不是**「这个模型坏了」，是「它还没写完」。
      //
```

</details>

**依据 10 · 源码核查**：[lib/adapter.js:637-645](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L637-L645)

未有finish时最终补error。

```text
    // 队列走完了。把最后一轮扣住的东西交出去，让用户看见真实报错。
    for (const chunk of held) yield chunk
    if (finish === undefined) {
      yield errorFinish(
        failure?.code ?? CODE_NO_VISIBLE_OUTPUT,
        failure?.message ?? '队列里的模型都没能产出内容。',
        attempted,
      )
    }
```

**依据 11 · 源码核查**：[lib/catalog.js:332-341](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/catalog.js#L332-L341)

只在已知窗口中求最小。

<details>
<summary>查看原文（10行）</summary>

```text
  narrowestContextWindow(order) {
    let narrowest
    for (const item of order) {
      const window = this.contextWindow(item.provider, item.model)
      if (!Number.isFinite(window) || window <= 0) continue
      if (narrowest === undefined || window < narrowest) narrowest = window
    }
    return narrowest
  }

```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 全局自动继续、关闭/等待和会话隔离的真实边界是什么？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

AutoContinue不是仅接力路由的附属功能：默认autoContinue=true，监听全局session/event，turn/end的error或max-tokens均可触发；relayed判断只用于轮尾标签，未把触发限定为接力模型。失败默认1次、截断默认10次，各自连续计数；completed或用户新turn会清计数/推进epoch，取消、上下文/凭据等特定错误及网络启发式被排除。网络判定来自错误码/消息，不是主动网络诊断；次数也在内存，不是跨重启现金预算。

实际调用链是turn/end→trigger/limit→counts→#deliver→get原agent→whenIdle→延迟→disposed/agent身份/epoch/status/inbox检查→pending标记→followup(user继续)。这些检查能降低用户已插话/会话变更后的过期补发，卸载也置disposed阻止睡醒后补发。但等待持有旧settings，醒来没有再读开关；等待间改autoContinue=false仍可能补已安排的一句，未运行复现。消息source为user，宿主Agent将重新决策工具，插件不知道业务副作用是否已经发生，故不能充当发布/支付/消息等事务补偿。

关闭“接力”还需核真实UI caller：client只PATCH {enabled:value}，normalize独立保留sameModelRetries/autoContinue。chain在enabled=false时只取首候选，plan仍按sameModelTries展开，失败后也没有停重试/隔离的总开关检查。因此它可不切候选，却仍对首候选做普通失败重发/记隔离；默认全局继续更不会随enabled关闭。不能照注释把这个开关当“无重试/无隔离/停止所有恢复”，应分别控制并核当前待补任务。

DailyHealth真实按逻辑日、sessionId×templateId分桶，无sessionId用共享空串桶；同会话内部压缩/标题调用也进入桶，只在便签/ceiling记账排除。重置时间按本机本地时钟，调用时懒清当天状态；全部隔离默认仍可试，good只表示出现提交内容，不是账号健康或业务成功。隔离也不是多租户/凭据隔离，管理API可以汇总会话。未看到工具幂等/执行确认记录；安全恢复仍须对照真实动作，不用新消息替代查未决。

#### 证据与依据

**依据 1 · 源码核查**：[lib/constants.js:106-128](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/constants.js#L106-L128)

全局继续默认与分开次数。

<details>
<summary>查看原文（23行）</summary>

```text
  /**
   * 一轮结束时是否自动再补一句「继续」（见 lib/autocontinue.js）。
   *
   * 这是**整个 DSH** 的行为，不限于「模型接力」这条路由：监听器挂在
   * `session/event` 上，任何模型跑出来的轮都会经过它。设置页里那一节叫
   * 「DSH 异常」，就是为了不让人以为只有接力模型才管用。
   */
  autoContinue: true,
  /** 触发条件之一：dsh 报了「本轮运行失败」。 */
  autoContinueOnFailure: true,
  /** 触发条件之一：输出撞到 token 上限被截断。 */
  autoContinueOnMaxTokens: true,
  /**
   * 运行失败时最多自动补发几次。
   *
   * 默认只补一次：失败往往意味着"这个任务现在做不下去"（模型不肯、工具报错、
   * 上下文被拒），再问一遍得到的常是同一个结局，补十次只是把同一段错误刷十遍。
   * 撞 token 上限完全不同 —— 那是**没写完**，接着写就好，所以那边给到 10。
   */
  autoContinueFailureLimit: 1,
  /** 输出撞到 token 上限时最多自动补发几次。截断是"没写完"，多补几次是常态。 */
  autoContinueMaxTokensLimit: 10,
  /**
```

</details>

**依据 2 · 源码核查**：[lib/autocontinue.js:95-130](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/autocontinue.js#L95-L130)

触发/排除及独立上限。

<details>
<summary>查看原文（36行）</summary>

```text
export function autoContinueTrigger(reason, settings) {
  if (reason === null || typeof reason !== 'object') return undefined
  if (settings?.autoContinue !== true) return undefined

  if (reason.kind === 'max-tokens') {
    return settings.autoContinueOnMaxTokens === false ? undefined : 'max-tokens'
  }

  if (reason.kind === 'error') {
    if (settings.autoContinueOnFailure === false) return undefined
    const code = typeof reason.error?.code === 'string' ? reason.error.code : ''
    if (AUTO_CONTINUE_SKIP_CODES.has(code)) return undefined
    // 本机网络没通：重发救不回来，只会白烧一次上限。
    if (isLocalNetworkFailure(reason.error)) return undefined
    return 'error'
  }

  return undefined
}

/**
 * 这种触发原因下，最多自动补几次。
 *
 * 两个数各管一边：撞上限是「没写完」，运行失败是「这一轮办不成」。分开计数
 * 是用户的要求 —— 一段长文档连着撞几次上限，不该占掉失败那份额度；而一次
 * 真正的失败，也不该掐掉本该继续的长文档。
 *
 * @param {any} settings - 已归一的设置。
 * @param {'max-tokens' | 'error'} trigger - 触发原因。
 * @returns {number} 上限；设置坏掉时回落到 1，宁可少补也不要飞。
 */
export function autoContinueLimitFor(settings, trigger) {
  const raw = trigger === 'max-tokens' ? settings?.autoContinueMaxTokensLimit : settings?.autoContinueFailureLimit
  return Number.isInteger(raw) && raw > 0 ? raw : 1
}

```

</details>

**依据 3 · 源码核查**：[lib/autocontinue.js:244-292](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/autocontinue.js#L244-L292)

全局事件监听和用户世代。

<details>
<summary>查看原文（49行）</summary>

```text
   */
  attach(ctx) {
    // 重新挂载时清掉上一次卸载留下的标记（cordis 的 effect 可能重跑）。
    this.#disposed = false
    const off = ctx.on('session/event', (session, event) => {
      this.observe(session, event)
    })
    return () => {
      // 卸载之后已经睡着的等待醒过来时不该再发消息。
      this.#disposed = true
      off()
    }
  }

  /**
   * 观察一条会话事件。**同步**返回 —— `session.append()` 的调用方不该等我们。
   *
   * @param {any} session - 事件主体（会话）。
   * @param {any} event - `{ type, data, seq }`。
   */
  observe(session, event) {
    const sessionId = typeof session?.id === 'string' ? session.id : undefined
    if (sessionId === undefined) return
    const type = event?.type

    if (type === 'turn/start') {
      const queuedAt = this.#pending.get(sessionId)
      this.#pending.delete(sessionId)
      // 未过期 → 这就是我们刚排进去的那一轮，计数接着累加。
      // 其余情况（用户自己敲的，或标记已烂尾）→ 从头计数。
      const ours = queuedAt !== undefined && this.#now() - queuedAt <= this.#pendingTtlMs
      if (!ours) {
        this.#counts.delete(sessionId)
        // 用户自己开了新的一轮：正在等的那个「继续」已经过期了。
        this.#epoch.set(sessionId, (this.#epoch.get(sessionId) ?? 0) + 1)
      }
      // 记下这一轮的归属，`turn/end` 时按它决定要不要写轮尾小字。
      if (ours) this.#ourTurns.set(sessionId, event?.data?.turn)
      else this.#ourTurns.delete(sessionId)
      // 记下这一轮**开始之前**的便签。`turn/end` 时拿它比对：只要对象变了，
      // 就说明这一轮确实是接力跑的（适配器 remember 过），该显示小字。
      //
      // 不能只看「便签里有没有模型」—— 上一轮用接力跑过一次之后，那个模型会一直
      // 挂在那里；用户下一轮手动挑了个具体模型，便签还是旧的，照它显示就会指错人。
      if (this.#notes === undefined) this.#turnMarks.delete(sessionId)
      else this.#turnMarks.set(sessionId, this.#notes.latest(sessionId))
      return
    }

```

</details>

**依据 4 · 源码核查**：[lib/autocontinue.js:318-373](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/autocontinue.js#L318-L373)

触发未被relayed限制，计数后调用deliver。

<details>
<summary>查看原文（56行）</summary>

```text
    }

    const reason = event?.data?.reason
    if (reason?.kind === 'completed') {
      note()
      this.#counts.delete(sessionId)
      this.#epoch.set(sessionId, (this.#epoch.get(sessionId) ?? 0) + 1)
      return
    }

    const settings = this.#settings.get()
    const trigger = autoContinueTrigger(reason, settings)
    if (trigger === undefined) {
      note()
      // 本机网络没通时刻意不补发 —— 但要让用户在事件日志里看见「为什么没继续」，
      // 否则他会以为插件坏了，然后手敲十遍「继续」。
      //
      // 只在「本来会补发、仅仅因为网络才没补」时记录：总开关或失败开关被用户
      // 关掉时沉默是应该的，不该刷日志。
      const wouldContinue = settings?.autoContinue === true && settings.autoContinueOnFailure !== false
      if (wouldContinue && reason?.kind === 'error' && isLocalNetworkFailure(reason.error)) {
        this.#log?.warn?.(
          `本轮是本机网络问题（${reason.error?.code ?? 'UNKNOWN'}），不补发「继续」：先把网络接通再重试`,
        )
        this.#log?.push?.({
          at: Date.now(),
          kind: 'auto-continue-skipped',
          trigger: 'network',
          sessionId,
          turn: event?.data?.turn,
          code: reason.error?.code ?? 'UNKNOWN',
          message: String(reason.error?.message ?? ''),
        })
      }
      return
    }

    const limit = autoContinueLimitFor(settings, trigger)
    const bucket = this.#counts.get(sessionId) ?? {}
    const used = bucket[trigger] ?? 0
    if (used >= limit) {
      note()
      // 用满了：不清零，等一个 completed 或用户自己发话的 turn/start 再放行。
      // 另一种结局的计数不受影响 —— 撞上限补了 10 次之后，这一轮真失败了，
      // 失败那 1 次仍然该给。
      this.#log?.warn?.(
        `自动继续已达上限（${trigger === 'max-tokens' ? '撞上限' : '运行失败'} ${limit} 次），这一轮不再补发`,
      )
      return
    }
    bucket[trigger] = used + 1
    this.#counts.set(sessionId, bucket)

    // 把「谁在跑」和「第几轮」配成一条便签，浏览器半身拿它在那一轮下面显示小字。
    note(trigger)

```

</details>

**依据 5 · 源码核查**：[lib/autocontinue.js:388-438](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/autocontinue.js#L388-L438)

真正等待/检查/用户followup，没有重读settings。

<details>
<summary>查看原文（51行）</summary>

```text
    const text = typeof settings.continueText === 'string' && settings.continueText.trim() !== ''
      ? settings.continueText
      : '继续'

    try {
      const agent = this.#agents?.get?.(sessionId)
      if (agent === undefined || agent === null) return

      // 事件是在 runTurn 的 finally 里落的，此时这一轮还在收尾（驱动还没把
      // 阶段放回 idle）。等它真的闲下来再排下一轮，否则 followup 只会把消息
      // 挂在收件箱里、没有任何人去叫醒驱动。
      await agent.whenIdle?.()

      // 刚撞完墙就贴上去再敲一遍，等来的几乎总是同一个错：限流还没松、上游抖动
      // 还没过去。本机实测里最难看的一段是 9 秒内落了 12 条隔离、相邻两条只隔
      // 0.0～1.3 秒。第一次失败也一样等 —— 这一等正是「刚失败完、正要补继续」
      // 的那个瞬间，没有漏掉第一次。
      const delayMs = Number.isInteger(settings.continueDelaySec) && settings.continueDelaySec > 0
        ? settings.continueDelaySec * 1000
        : 0
      if (delayMs > 0) {
        this.#log?.info?.(`等 ${settings.continueDelaySec} 秒再补发「${text}」`)
        await this.#sleep(delayMs)
      }
      if (this.#disposed) return

      // 等的时候用户可能把会话关了、自己已经发了下一句、或者干脆跑完了完整的一轮。
      if (this.#agents.get(sessionId) !== agent) return
      if ((this.#epoch.get(sessionId) ?? 0) !== epoch) return
      if (typeof agent.status === 'string' && agent.status !== 'idle') return
      if (agent.inbox?.hasPending === true) return

      this.#pending.set(sessionId, this.#now())
      agent.followup(continueUserMessage(text))
      this.#log?.info?.(
        `本轮${trigger === 'max-tokens' ? '输出撞到上限' : '运行失败'}，已自动补发「${text}」（第 ${this.#counts.get(sessionId)?.[trigger] ?? 1} 次）`,
      )
      this.#log?.push?.({
        at: Date.now(),
        kind: 'auto-continue',
        trigger,
        sessionId,
        turn,
        text,
      })
    } catch (error) {
      this.#pending.delete(sessionId)
      this.#log?.warn?.(`自动补发「继续」失败 — ${String(error?.message ?? error)}`)
    }
  }
}
```

</details>

**依据 6 · 源码核查**：[client.js:1450-1458](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/client.js#L1450-L1458)

UI接力开关只写enabled。

```text
        Card({ title: t('relay') },
            div({ className: 'mf-note' }, t('relayHint')),
            h(ToggleRow, {
              label: t('optEnabled'),
              hint: t('optEnabledHint'),
              checked: settings.enabled !== false,
              disabled: busy,
              onChange: (value) => void run('/settings', { enabled: value }),
            }),
```

**依据 7 · 源码核查**：[client.js:772-785](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/client.js#L772-L785)

run真实将该body POST到设置接口。

<details>
<summary>查看原文（14行）</summary>

```text
      const run = useCallback(async (path, body) => {
        setBusy(true)
        setNotice('')
        try {
          const next = await post(path, body)
          if (alive.current) {
            setState(next)
            setError('')
            setNotice(t('saved'))
          }
        } catch (failure) {
          if (alive.current) setError(t('actionFailed', { message: String(failure?.message ?? failure) }))
        } finally {
          if (alive.current) setBusy(false)
```

</details>

**依据 8 · 源码核查**：[index.js:592-621](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/index.js#L592-L621)

patch保留其他设置并normalize/持久化。

<details>
<summary>查看原文（30行）</summary>

```text
  /** 只接受设置里真实存在的键；其余一律忽略。 */
  const patchSettings = (patch) => {
    const current = settingsFile.get()
    const next = { ...current }
    if ('enabled' in patch) next.enabled = patch.enabled !== false
    if ('bootstrapped' in patch) next.bootstrapped = patch.bootstrapped === true
    if ('templates' in patch) next.templates = patch.templates
    if ('editedTemplate' in patch) next.editedTemplate = patch.editedTemplate
    if ('resetHour' in patch) next.resetHour = patch.resetHour
    if ('retrySameModelOnce' in patch) next.retrySameModelOnce = patch.retrySameModelOnce !== false
    if ('sameModelRetries' in patch) next.sameModelRetries = patch.sameModelRetries
    if ('continueText' in patch) next.continueText = patch.continueText
    if ('hiddenProviders' in patch) next.hiddenProviders = patch.hiddenProviders
    if ('retryWhenAllQuarantined' in patch) next.retryWhenAllQuarantined = patch.retryWhenAllQuarantined !== false
    if ('autoContinue' in patch) next.autoContinue = patch.autoContinue !== false
    if ('autoContinueOnFailure' in patch) next.autoContinueOnFailure = patch.autoContinueOnFailure !== false
    if ('autoContinueOnMaxTokens' in patch) next.autoContinueOnMaxTokens = patch.autoContinueOnMaxTokens !== false
    if ('autoContinueFailureLimit' in patch) next.autoContinueFailureLimit = patch.autoContinueFailureLimit
    if ('autoContinueMaxTokensLimit' in patch) next.autoContinueMaxTokensLimit = patch.autoContinueMaxTokensLimit
    if ('continueDelaySec' in patch) next.continueDelaySec = patch.continueDelaySec
    if ('idleTimeoutSec' in patch) next.idleTimeoutSec = patch.idleTimeoutSec
    if ('keepEventLog' in patch) next.keepEventLog = patch.keepEventLog !== false
    if ('eventLogLimit' in patch) next.eventLogLimit = patch.eventLogLimit
    if ('showSubagentSessions' in patch) next.showSubagentSessions = patch.showSubagentSessions === true
    if ('showForeignSessions' in patch) next.showForeignSessions = patch.showForeignSessions !== false
    // replace 会过一遍 normalizeSettings，所以非法值在这里被就地修好，
    // 而不是留给执行路径去踩。
    settingsFile.replace(next)
    settingsFile.flush()
    return settingsFile.get()
```

</details>

**依据 9 · 源码核查**：[index.js:235-253](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/index.js#L235-L253)

开关/重试/AutoContinue分别保留。

<details>
<summary>查看原文（19行）</summary>

```text
    enabled: source.enabled !== false,
    bootstrapped: source.bootstrapped === true,
    templates,
    editedTemplate,
    resetHour,
    retrySameModelOnce: source.retrySameModelOnce !== false,
    sameModelRetries,
    continueText:
      typeof source.continueText === 'string' && source.continueText.trim() !== ''
        ? source.continueText.slice(0, 200)
        : DEFAULT_SETTINGS.continueText,
    hiddenProviders,
    retryWhenAllQuarantined: source.retryWhenAllQuarantined !== false,
    autoContinue: source.autoContinue !== false,
    autoContinueOnFailure: source.autoContinueOnFailure !== false,
    autoContinueOnMaxTokens: source.autoContinueOnMaxTokens !== false,
    autoContinueFailureLimit,
    autoContinueMaxTokensLimit,
    continueDelaySec,
```

</details>

**依据 10 · 源码核查**：[lib/adapter.js:353-397](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L353-L397)

enabled仅缩候选，不清同模型tries。

<details>
<summary>查看原文（45行）</summary>

```text
          : undefined
      ordered.push(reasoningEffort === undefined ? { provider, model } : { provider, model, reasoningEffort })
    }
    // 总开关关掉时这条路由仍然能跑，只是退化成「永远用优先级最高的那一个」，
    // 不再重试、不再切换、也不再隔离 —— 排查问题时这样最干净。
    let candidates
    if (settings.enabled === false) {
      candidates = ordered.slice(0, 1)
    } else {
      const usable = ordered.filter((item) => !snapshot.quarantined.has(routeKey(item.provider, item.model)))
      if (usable.length > 0) candidates = usable
      else candidates = settings.retryWhenAllQuarantined === false ? [] : ordered
    }
    if (!Number.isInteger(skip) || skip <= 0 || candidates.length < 2) return candidates
    // 取模是为了让队列真的转起来：跳过头了就从头接上，而不是原地不动。
    const at = ((skip % candidates.length) + candidates.length) % candidates.length
    if (at === 0) return candidates
    return [...candidates.slice(at), ...candidates.slice(0, at)]
  }

  /**
   * 把候选序列展开成执行步骤。
   *
   * 「继续」的条数 = 已经失败过的轮数：第 0 个模型第一次就是原始请求，之后
   * 每退让一步就多带一条「继续」—— 用户要求的「重试这个模型发继续」「切换到
   * 下一个模型发继续」都落在这一步上。
   */
  plan(settings, template, snapshot, skip) {
    const chain = this.chain(settings, template, snapshot, skip)
    const tries = sameModelTries(settings)
    const steps = []
    for (let index = 0; index < chain.length; index += 1) {
      // 退到队列里第 index 个模型时带几条「继续」：第 0 个是原始请求，每多换
      // 一次模型就多带一条 —— 用户要的「换下一个模型时发继续」落在这里。
      const continues = Math.min(index, MAX_CONTINUES)
      // 同一个模型的每次尝试发**完全相同的请求**。
      //
      // 一是为了换账号：只有重发原请求，`dsh-our-free-model` 这类多账号反代
      // 才会重新进一次账号池，把刚才那个坏账号换掉。二是新账号压根没写过东西，
      // 收到「继续」只会莫名其妙。
      for (let attempt = 0; attempt < tries; attempt += 1) {
        steps.push({ candidate: chain[index], continues })
      }
    }
    return steps
```

</details>

**依据 11 · 源码核查**：[lib/adapter.js:588-624](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L588-L624)

失败重试和隔离支路无enabled保护。

<details>
<summary>查看原文（37行）</summary>

```text
        for (const chunk of held) yield chunk
        return
      }

      // 请求本身的问题（上下文超长之类）：换模型只会再撞一次墙。
      if (failure !== undefined && NON_FAILOVER_CODES.has(failure.code)) {
        for (const chunk of held) yield chunk
        this.log.warn(`model-failover: ${provider}/${model} 以不可切换的错误结束 (${failure.code})`)
        return
      }

      // 这个候选还有一次「继续」没用完：先别判它今天不行。
      //
      // 隔离的语义是「今天它出不了东西」，而这要等它的重试都用完才能下结论：
      // 失败一次、被一句「继续」叫起来接着写完的模型是**能用**的，把它隔离掉
      // 反而会让今天的任务从这里绕开一个明明好好的模型。只有队列里的下一个
      // 步骤换人了（或者没有下一步了），才说明这个候选这次真的交不出东西。
      const next = steps[index + 1]
      if (next !== undefined && next.candidate.provider === provider && next.candidate.model === model) continue

      // 这个候选今天出了问题 —— 隔离到下一个逻辑日，后面的任务不会再从它开始。
      this.health.markBroken(key, {
        code: failure?.code,
        message: failure?.message,
        at: this.now(),
        sessionId,
        templateId,
      })
      this.health.file.flush()
      this.log.push({
        at: this.now(),
        kind: 'quarantine',
        provider,
        model,
        // 事件日志里也带上会话：隔离是按会话算的，没有这个字段就分不清某一行
        // 是哪个会话撞的墙。模板同理 —— 一个模板一条队列。
        sessionId,
```

</details>

**依据 12 · 源码核查**：[lib/health.js:262-293](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/health.js#L262-L293)

会话/模板快照及隔离记录。

<details>
<summary>查看原文（32行）</summary>

```text
   * @param {number} resetHour
   * @param {string} [sessionId] - 这次调用属于哪个会话；缺省落在「不分会话」桶。
   * @param {string} [templateId] - 这次调用用的是哪个模板；缺省是默认模板。
   * @returns {{day: string, quarantined: Set<string>, good: Set<string>}}
   */
  snapshot(now, resetHour, sessionId, templateId) {
    const state = this.#aligned(now, resetHour)
    const bucket = bucketOf(state, sessionId, templateId)
    return {
      day: state.day,
      quarantined: new Set(Object.keys(bucket.quarantine)),
      good: new Set(Object.keys(bucket.good)),
    }
  }

  /** 今天在这个会话、这个模板里，这个模型失败过 —— 把它隔离到下一个逻辑日。 */
  markBroken(key, { code, message, at, sessionId, templateId }) {
    const scope = sessionScope(sessionId)
    const template = templateScope(templateId)
    const state = this.file.get()
    const session = state.sessions[scope] ?? { templates: {} }
    const bucket = session.templates[template] ?? emptyBucket()
    const previous = bucket.quarantine[key]
    const { provider, model } = splitKey(key)
    this.file.update({
      sessions: {
        ...state.sessions,
        [scope]: {
          templates: {
            ...session.templates,
            [template]: {
              quarantine: {
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 管理、持久化、依赖与四阶段成本/效果怎样界定？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

Web接口在更长前缀上单独挂载，真实api caller先rejectionFor(req,按请求取connection)。已知admit/requestRejection委托宿主，方法抛错归503；没有可用方法则按Host/Origin/Referer/Sec-Fetch-Site结构围栏。这个fallback不核socket、cookie或账户，不可称等同身份认证；未知宿主返回形状/部署和反代仍需独立核，不凭注释保证与当前内核完全等价，也不宣称本轮发现匿名公网攻击。

设置、重扫、probe、reset/forget都有真实状态/网络副作用。probe实际用llm发hi、maxTokens=8、15秒AbortSignal定时；它只记录错误终态/异常，不要求收到可见内容或finish，空流可回ok，signal不合作也不是硬15秒race。设置保存、会话隔离和目录/日志分别写DSH_HOME下JSON，200ms防抖后tmp+rename，读损坏回默认，写失败警告且dirty已清，不是事务/持久回执。卸载flush并释放路由/监听，不删除JSON目录，也不能替代上游取消；forget只重置state，不是清全部日志/设置。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配DSH llm/Cordis/Node | 必需 | adapter和nested模型流 | 包只声明Cordis/Node，不等全部当前宿主API已验 |
| 每个候选provider/账户/额度 | 必需独立可用 | 真正模型与工具任务 | 模板、目录、probe都不证明质量/费用/兼容 |
| 完整队列与候选数据范围 | 使用前必核 | 默认可自动填全部已连接模型 | 删/隐藏不允许的provider，不凭工具入口锁账户 |
| agents服务及宿主Agent | 仅轮级继续 | 用户继续消息后的工具循环 | 无agents无此功能；有服务默认全局开启需控制 |
| webServer/connection/客户端slots | 可选管理界面 | 设置、探测、隔离与展示 | 准入/反代/版本需核；无connection仅结构围栏 |
| DSH_HOME文件目录 | 持久状态必需 | settings/state/catalog/log | 同路径共用；写盘/损坏/多进程责任另验 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 固定候选 | 操作者核账号/费用/模态/上下文，缩小自动填充队列 | 单候选文本/工具任务先过，目录/probe不是验收 |
| 限定恢复 | 分别设同模型次数、idle和全局继续开关/上限 | 关enabled不冒充全停，记录全部尝试/继续 |
| 可回滚对照 | 同一任务对照手动切换，核结果/错误终态 | 不只比吐字/绿数；首内容后失败必须可见 |
| 故障/停止验收 | 测待补时关开关/用户插话/卸载、内部调用隔离及工具后失败 | 无越权补发/重复动作，取消查在途结果 |
| 回退/退出 | 停新接力，核待补/嵌套请求，回稳定provider并备份清理 | flush非上游停算/数据全删；未决先对账再重试 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次接入 | 多provider账号、目录/模型probe资源 | 队列/兼容/权限、准入和恢复策略配置 | 未有安装/工时/费用验收；候选需各自可用 |
| 持续使用 | 原样重发、切候选/全局继续、保留/丢弃思考和上下文 | 查终态/隔离、独立产物验收与日志 | 默认3次/候选、最多6次；候选自身重试另计，无全账单 |
| 失败恢复 | 首内容前多调用、idle仍在途、工具重复/纠错资源 | 查真实动作、关待补、恢复上下文和账户 | idle/计数/可见提交均非现金/事务上限，重启计数会重建 |
| 停用/迁移 | 未决上游计算、JSON/备份/隐私清理 | 核停止、换稳定provider、导出/删除记录 | dispose有flush/释放代码，未证完整停算或数据全删 |

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 模型接力 | nested真实调用、提交前候选切换及外层retry声明 | 正确任务率、下游自带重试和总成本 |
| 输出边界 | reasoning不提交、首次可见后不换模型 | 提交后异常/idle的失败终态和工具业务幂等 |
| 继续/隔离 | 全局followup、次数/epoch与会话×模板桶 | 开关/停止窗口、重启预算和用户实际验收 |
| 管理/诊断 | 有准入、目录/状态、实际probe和JSON持久化 | 空probe可能ok、真实宿主身份/持久性与净维护收益 |

本轮只读固定源码/材料，不运行作者测试、安装、模型、HTTP动作或真实工具；作者实测/注释均未冒充本轮独立验证，所有金额与工时未知。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:629-642](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/index.js#L629-L642)

真实API先取connection做准入。

<details>
<summary>查看原文（14行）</summary>

```text
  const optional = (service) => (typeof ctx.get === 'function' ? ctx.get(service) : undefined)

  const api = async (req, res) => {
    // 最长前缀胜出：本路由比内核的 `/api` 长，所以内核那条里的鉴权不会跑，
    // 必须在这里自己补上（见 lib/trust.js 的说明）。
    const rejected = rejectionFor(req, optional('connection'), (decision) => {
      logger.warn?.(
        `model-failover: 拒绝了一个设置接口请求（${decision.source}/${decision.reason} → HTTP ${decision.status}）`,
      )
    })
    if (rejected !== undefined) {
      sendJson(res, rejected, { ok: false, error: `请求未被信任（HTTP ${rejected}）` })
      return
    }
```

</details>

**依据 2 · 源码核查**：[lib/trust.js:56-122](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/trust.js#L56-L122)

委托、异常拒绝及结构fallback。

<details>
<summary>查看原文（67行）</summary>

```text
 * @param {(decision: {status: number, source: string, reason: string}) => void} [onRejection]
 *   只允许固定字段，绝不把请求头或错误正文传出去
 * @returns {number|undefined}
 */
export function rejectionFor(req, connection, onRejection) {
  let decision

  try {
    const admit = connection?.admit
    if (typeof admit === 'function') {
      const admission = admit.call(connection, req)
      const status = admission !== null && typeof admission === 'object' ? admission.rejection : undefined
      if (status === undefined) return undefined
      decision = { status, source: 'connection', reason: 'host-rejected' }
    } else {
      const reject = connection?.requestRejection
      if (typeof reject === 'function') {
        const status = reject.call(connection, req)
        if (status === undefined) return undefined
        decision = { status, source: 'connection', reason: 'host-rejected' }
      }
    }
  } catch {
    // 挂掉的 Host 服务绝不能变成放行。
    decision = { status: 503, source: 'connection', reason: 'admission-error' }
  }

  if (decision === undefined) {
    const reason = structuralReason(req)
    if (reason === undefined) return undefined
    decision = { status: 403, source: 'structural', reason }
  }

  try {
    onRejection?.(decision)
  } catch {
    /* 诊断是旁观的，日志写不出去也不能改 HTTP 判定 */
  }
  return decision.status
}

/** 复刻围栏：与内核 `isTrustedApiRequest` 同形（DNS rebinding + 跨站 fetch）。 */
export function structuralReason(req) {
  const host = authorityOf(req.headers?.host, 'http')
  if (host === null || !LOOPBACK_NAMES.has(host.hostname)) return 'host-not-loopback'

  const site = String(req.headers?.['sec-fetch-site'] ?? '').toLowerCase()
  if (site === 'cross-site') return 'cross-site'

  for (const header of ['origin', 'referer']) {
    const raw = req.headers?.[header]
    if (typeof raw !== 'string' || raw.trim() === '') continue
    if (header === 'referer' && isDesktopRelayReferer(raw)) {
      // 桌面壳转发的请求会保留这个 Referer；它不是 Origin 授权，也不能覆盖
      // 上面 connection 的判定 —— 只允许它单独出现。
      if (req.headers.origin !== undefined || req.headers['sec-fetch-site'] !== undefined) return 'desktop-relay-markers'
      continue
    }
    const authority = authorityOf(raw.trim())
    if (authority === null) return `${header}-invalid`
    if (authority.scheme !== host.scheme || authority.hostname !== host.hostname || authority.port !== host.port) {
      return `${header}-mismatch`
    }
  }

  return undefined
}
```

</details>

**依据 3 · 源码核查**：[index.js:448-490](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/index.js#L448-L490)

真实probe、signal与成功条件。

<details>
<summary>查看原文（43行）</summary>

```text
  const probe = async (target) => {
    const started = Date.now()
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)
    let failure
    try {
      const stream = ctx.llm.stream({
        provider: target.provider,
        model: target.model,
        messages: [{ role: 'user', content: [{ type: 'text', text: 'hi' }] }],
        maxTokens: PROBE_MAX_TOKENS,
        signal: controller.signal,
      })
      for await (const chunk of stream) {
        if (chunk?.type !== 'finish') continue
        const reason = chunk.reason ?? {}
        if (reason.kind === 'error') {
          failure = reason.failure ?? { code: 'UNKNOWN', message: '' }
        } else if (reason.kind === 'aborted' && controller.signal.aborted) {
          failure = { code: 'TIMEOUT', message: `超过 ${PROBE_TIMEOUT_MS / 1000} 秒没有回应` }
        }
        break
      }
    } catch (error) {
      // LlmError 把结构化的东西放在 `failure` 上；别的一律按普通错误读。
      const inner = error?.failure
      failure = inner !== undefined && typeof inner === 'object'
        ? { code: inner.code, message: inner.message }
        : {
            code: typeof error?.code === 'string' && error.code !== '' ? error.code : 'UNKNOWN',
            message: error?.message,
          }
    } finally {
      clearTimeout(timer)
    }
    const ms = Date.now() - started
    if (failure === undefined) return { ok: true, ms }
    return {
      ok: false,
      ms,
      code: typeof failure.code === 'string' && failure.code !== '' ? failure.code : 'UNKNOWN',
      message: String(failure.message ?? '').slice(0, 200),
    }
```

</details>

**依据 4 · 源码核查**：[lib/store.js:38-56](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/store.js#L38-L56)

读失败回默认。

<details>
<summary>查看原文（19行）</summary>

```text
   * @param {(raw: unknown) => T} normalize - 把读到的任意 JSON 收敛成 T。
   */
  constructor(file, fallback, normalize) {
    this.file = file
    this.normalize = normalize
    this.fallback = fallback
    this.value = this.#read()
    this.timer = undefined
    this.dirty = false
  }

  #read() {
    try {
      const text = readFileSync(this.file, 'utf8')
      return this.normalize(JSON.parse(text))
    } catch {
      // 文件不存在、被截断、或 JSON 语法坏了：全部当作「还没有状态」。
      // 隔离名单丢失的最坏后果是多试一次模型，比启动失败好得多。
      return this.normalize(undefined)
```

</details>

**依据 5 · 源码核查**：[lib/store.js:93-112](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/store.js#L93-L112)

写失败/dirty与dispose。

<details>
<summary>查看原文（20行）</summary>

```text
    this.dirty = false
    try {
      mkdirSync(dirname(this.file), { recursive: true })
      const tmp = `${this.file}.tmp`
      writeFileSync(tmp, `${JSON.stringify(this.value, null, 2)}\n`, 'utf8')
      renameSync(tmp, this.file)
    } catch (error) {
      // 写盘失败不能把一次模型调用打断。
      console.warn(`[${'dsh-model-failover'}] 状态落盘失败 ${this.file}: ${String(error?.message ?? error)}`)
    }
  }

  dispose() {
    if (this.timer !== undefined) {
      clearTimeout(this.timer)
      this.timer = undefined
    }
    this.flush()
  }
}
```

</details>

**依据 6 · 源码核查**：[index.js:777-786](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/index.js#L777-L786)

forget仅state。

<details>
<summary>查看原文（10行）</summary>

```text
      if (method === 'POST' && path === '/forget') {
        // 「恢复出厂」：删掉状态文件，下一次调用重新从第一个模型开始。
        removeFile(join(dir, 'state.json'))
        stateFile.replace(undefined)
        pushEvent({ at: now, kind: 'forget' })
        sendJson(res, 200, snapshot(now))
        return
      }

      sendJson(res, 404, { ok: false, error: `未知的模型接力接口：${method} ${path}` })
```

</details>

**依据 7 · 源码核查**：[index.js:821-836](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/index.js#L821-L836)

卸载flush与释放。

<details>
<summary>查看原文（16行）</summary>

```text
  ctx.effect(
    () => () => {
      // 落盘是防抖的，不显式 flush 会把最后 200ms 的隔离记录丢掉。
      settingsFile.dispose()
      stateFile.dispose()
      logFile.dispose()
      cacheFile.dispose()
      try {
        registration?.()
      } catch {
        /* 已经随 fiber 卸载过了 */
      }
    },
    'model-failover: flush state and release route',
  )
}
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 既有提交边界之外还有什么增量，怎样避免把修bug包装成新方向？

**研究主题**：新假设与验证、贡献与相对优势、工程质量与复用

#### 完整回答

提交前不混流、会话×模板隔离、轮尾模型便签、epoch/待补检查和界面状态都已实现，不能再提作新增“智能恢复”。应先修明确现有边界：提交后失败终态传播、enabled对应重试/隔离、等待后重读开关、probe空流成功及idle收尾。它们是当前正确性工作，不自动构成独立插件机会。

待验证方向仍是把流提交与工具动作确认/未决状态联动：已出现tool delta只说明模型在提出动作，自动继续却没有业务幂等/执行结果证明。候选协议可向已有宿主读取最小工具回执/未决摘要，在不重发原动作的前提下请求模型决定继续、查询权威结果或请人接管；不得由本插件凭错误码/文字猜交易完成，也不收全量敏感payload来补“证据”。当前未实现/未验证，便签和markGood不能代替。

先取得授权的可回滚文件任务和模拟非幂等计数任务，在reasoning、首tool delta、执行后与finish前注入失败。对照修正后的现机制、单纯关全局继续/人工查询、最小只读未决摘要，统计重复动作、误办结、正确产物、人工纠错及全部模型费用。如果收益依赖全面禁止工具、恢复正确率下降，或简单查询/小修补已足够，就否定独立产品化；没有真实案件不先扩为通用事务平台。

#### 证据与依据

**依据 1 · 源码核查**：[lib/adapter.js:101-108](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L101-L108)

既有可见输出/工具提交点。

```text
export function commitsAnswer(chunk) {
  if (chunk === null || typeof chunk !== 'object') return false
  if (chunk.type === 'text-delta') return typeof chunk.text === 'string' && chunk.text.trim() !== ''
  if (chunk.type === 'tool-call-delta') return true
  if (chunk.type !== 'block-end') return false
  if (chunk.block?.type === 'reasoning') return false
  if (chunk.block?.type === 'text') return typeof chunk.block.text === 'string' && chunk.block.text.trim() !== ''
  return true
```

**依据 2 · 源码核查**：[lib/adapter.js:846-865](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L846-L865)

现有终态/失败边界先修而非新产品。

<details>
<summary>查看原文（20行）</summary>

```text
    const truncated = !committed && finish?.reason?.kind === 'max-tokens'
    if (!committed && failure === undefined && !truncated) failure = failureOf(finish, undefined)
    // 速度只在「这一趟真的收到了 finish，并且吐过 token」时才算数：中途报错、
    // 一个 token 都没吐、或者根本没有 usage 的供应商，都不该在界面上留下一个
    // 假的数字。
    const speed =
      firstDeltaAt !== undefined &&
      finishedAt !== undefined &&
      finishedAt > firstDeltaAt &&
      Number.isFinite(outputTokens) &&
      outputTokens > 0
        ? { tokens: outputTokens, ms: finishedAt - firstDeltaAt }
        : undefined
    return {
      committed,
      truncated,
      finish,
      failure: committed || truncated ? undefined : failure,
      held: committed ? [] : held,
      speed,
```

</details>

**依据 3 · 源码核查**：[lib/autocontinue.js:388-423](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/autocontinue.js#L388-L423)

现有待补与followup不含工具业务确认。

<details>
<summary>查看原文（36行）</summary>

```text
    const text = typeof settings.continueText === 'string' && settings.continueText.trim() !== ''
      ? settings.continueText
      : '继续'

    try {
      const agent = this.#agents?.get?.(sessionId)
      if (agent === undefined || agent === null) return

      // 事件是在 runTurn 的 finally 里落的，此时这一轮还在收尾（驱动还没把
      // 阶段放回 idle）。等它真的闲下来再排下一轮，否则 followup 只会把消息
      // 挂在收件箱里、没有任何人去叫醒驱动。
      await agent.whenIdle?.()

      // 刚撞完墙就贴上去再敲一遍，等来的几乎总是同一个错：限流还没松、上游抖动
      // 还没过去。本机实测里最难看的一段是 9 秒内落了 12 条隔离、相邻两条只隔
      // 0.0～1.3 秒。第一次失败也一样等 —— 这一等正是「刚失败完、正要补继续」
      // 的那个瞬间，没有漏掉第一次。
      const delayMs = Number.isInteger(settings.continueDelaySec) && settings.continueDelaySec > 0
        ? settings.continueDelaySec * 1000
        : 0
      if (delayMs > 0) {
        this.#log?.info?.(`等 ${settings.continueDelaySec} 秒再补发「${text}」`)
        await this.#sleep(delayMs)
      }
      if (this.#disposed) return

      // 等的时候用户可能把会话关了、自己已经发了下一句、或者干脆跑完了完整的一轮。
      if (this.#agents.get(sessionId) !== agent) return
      if ((this.#epoch.get(sessionId) ?? 0) !== epoch) return
      if (typeof agent.status === 'string' && agent.status !== 'idle') return
      if (agent.inbox?.hasPending === true) return

      this.#pending.set(sessionId, this.#now())
      agent.followup(continueUserMessage(text))
      this.#log?.info?.(
        `本轮${trigger === 'max-tokens' ? '输出撞到上限' : '运行失败'}，已自动补发「${text}」（第 ${this.#counts.get(sessionId)?.[trigger] ?? 1} 次）`,
```

</details>

**依据 4 · 源码核查**：[lib/notes.js:46-64](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/notes.js#L46-L64)

模型便签非业务执行回执。

<details>
<summary>查看原文（19行）</summary>

```text

  /**
   * @param {{limit?: number}} [options]
   */
  constructor({ limit = TURN_NOTE_LIMIT } = {}) {
    this.#limit = Number.isInteger(limit) && limit > 0 ? limit : TURN_NOTE_LIMIT
  }

  /**
   * 适配器每试完一个候选就调一次。
   *
   * 每次都覆盖是有意的：一轮里可能连着换好几个候选，最后写进来的那个就是真正
   * 产出内容（或者被截断在半句话上）的模型。反过来，某个候选一旦提交内容，
   * 适配器立刻 `return`，后面不会再有人覆盖它。
   *
   * @param {unknown} sessionId - `GenerateOptions.sessionId`；缺席时整条丢弃。
   * @param {{provider: string, model: string, template?: string, at?: number}} hit
   */
  remember(sessionId, { provider, model, template, at }) {
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前采用等级和停止退路应该怎样落地？

**研究主题**：采用判断、效果与总成本

#### 完整回答

建议观察，先修/验关键恢复与停止语义，再考虑可回滚任务的小样。适合有多个独立可用provider、知道真实账号/费用/数据边界并能核验产物的DSH用户；不要把默认全局继续放到不可逆工具任务。先缩队列、分别配置重试/idle/AutoContinue，用一项同预算任务比较稳定provider或手工切换，不以吐字率替代正确率。

最低验收包括提交前reasoning失败可切换、首文本/工具后异常能给正确终态、可见max-tokens的实际轮换规则、enabled=false尝试数、待补期间关闭/用户插话/卸载、跨会话模板与内部调用隔离、取消后在途及真实工具动作。任何出现停止后续跑、状态/终态与结果对不上、重复动作或费用超过允许，应停新接力，核待补/上游和权威结果后退回稳定provider/人工查询；不能再发继续来掩盖未决。

独立评分应奖励真实包装/提交/隔离机制，并保留具体反证；未来工具回执假设和作者运行样本不计现有成果。当前没有用户正确任务率、净节省、安装/卸载或下游停止实测，因此不把源码可检查自动升为试用/持续安装。

#### 证据与依据

**依据 1 · 源码核查**：[lib/adapter.js:534-545](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L534-L545)

已有输出与good不等完整任务成功。

<details>
<summary>查看原文（12行）</summary>

```text
      if (result.committed) {
        // 这一轮正常写完了：撞上限的旧账一笔勾销，下一个任务还从队首开始。
        if (userFacing && sessionId !== undefined) this.ceiling.delete(sessionId)
        // 这个模型今天被验证过能用了；下一个任务从它开始。
        const recorded = this.health.markGood(key, this.now(), sessionId, templateId)
        this.health.file.flush()
        if (recorded) this.log.push({ at: this.now(), kind: 'good', provider, model, attempts: index + 1 })
        return
      }

      // 撞到输出上限：**不是**「这个模型坏了」，是「它还没写完」。
      //
```

</details>

**依据 2 · 源码核查**：[lib/adapter.js:353-397](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/adapter.js#L353-L397)

关闭开关与重试展开的实际差异。

<details>
<summary>查看原文（45行）</summary>

```text
          : undefined
      ordered.push(reasoningEffort === undefined ? { provider, model } : { provider, model, reasoningEffort })
    }
    // 总开关关掉时这条路由仍然能跑，只是退化成「永远用优先级最高的那一个」，
    // 不再重试、不再切换、也不再隔离 —— 排查问题时这样最干净。
    let candidates
    if (settings.enabled === false) {
      candidates = ordered.slice(0, 1)
    } else {
      const usable = ordered.filter((item) => !snapshot.quarantined.has(routeKey(item.provider, item.model)))
      if (usable.length > 0) candidates = usable
      else candidates = settings.retryWhenAllQuarantined === false ? [] : ordered
    }
    if (!Number.isInteger(skip) || skip <= 0 || candidates.length < 2) return candidates
    // 取模是为了让队列真的转起来：跳过头了就从头接上，而不是原地不动。
    const at = ((skip % candidates.length) + candidates.length) % candidates.length
    if (at === 0) return candidates
    return [...candidates.slice(at), ...candidates.slice(0, at)]
  }

  /**
   * 把候选序列展开成执行步骤。
   *
   * 「继续」的条数 = 已经失败过的轮数：第 0 个模型第一次就是原始请求，之后
   * 每退让一步就多带一条「继续」—— 用户要求的「重试这个模型发继续」「切换到
   * 下一个模型发继续」都落在这一步上。
   */
  plan(settings, template, snapshot, skip) {
    const chain = this.chain(settings, template, snapshot, skip)
    const tries = sameModelTries(settings)
    const steps = []
    for (let index = 0; index < chain.length; index += 1) {
      // 退到队列里第 index 个模型时带几条「继续」：第 0 个是原始请求，每多换
      // 一次模型就多带一条 —— 用户要的「换下一个模型时发继续」落在这里。
      const continues = Math.min(index, MAX_CONTINUES)
      // 同一个模型的每次尝试发**完全相同的请求**。
      //
      // 一是为了换账号：只有重发原请求，`dsh-our-free-model` 这类多账号反代
      // 才会重新进一次账号池，把刚才那个坏账号换掉。二是新账号压根没写过东西，
      // 收到「继续」只会莫名其妙。
      for (let attempt = 0; attempt < tries; attempt += 1) {
        steps.push({ candidate: chain[index], continues })
      }
    }
    return steps
```

</details>

**依据 3 · 源码核查**：[lib/autocontinue.js:388-423](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/autocontinue.js#L388-L423)

停止/待补需要实际验收。

<details>
<summary>查看原文（36行）</summary>

```text
    const text = typeof settings.continueText === 'string' && settings.continueText.trim() !== ''
      ? settings.continueText
      : '继续'

    try {
      const agent = this.#agents?.get?.(sessionId)
      if (agent === undefined || agent === null) return

      // 事件是在 runTurn 的 finally 里落的，此时这一轮还在收尾（驱动还没把
      // 阶段放回 idle）。等它真的闲下来再排下一轮，否则 followup 只会把消息
      // 挂在收件箱里、没有任何人去叫醒驱动。
      await agent.whenIdle?.()

      // 刚撞完墙就贴上去再敲一遍，等来的几乎总是同一个错：限流还没松、上游抖动
      // 还没过去。本机实测里最难看的一段是 9 秒内落了 12 条隔离、相邻两条只隔
      // 0.0～1.3 秒。第一次失败也一样等 —— 这一等正是「刚失败完、正要补继续」
      // 的那个瞬间，没有漏掉第一次。
      const delayMs = Number.isInteger(settings.continueDelaySec) && settings.continueDelaySec > 0
        ? settings.continueDelaySec * 1000
        : 0
      if (delayMs > 0) {
        this.#log?.info?.(`等 ${settings.continueDelaySec} 秒再补发「${text}」`)
        await this.#sleep(delayMs)
      }
      if (this.#disposed) return

      // 等的时候用户可能把会话关了、自己已经发了下一句、或者干脆跑完了完整的一轮。
      if (this.#agents.get(sessionId) !== agent) return
      if ((this.#epoch.get(sessionId) ?? 0) !== epoch) return
      if (typeof agent.status === 'string' && agent.status !== 'idle') return
      if (agent.inbox?.hasPending === true) return

      this.#pending.set(sessionId, this.#now())
      agent.followup(continueUserMessage(text))
      this.#log?.info?.(
        `本轮${trigger === 'max-tokens' ? '输出撞到上限' : '运行失败'}，已自动补发「${text}」（第 ${this.#counts.get(sessionId)?.[trigger] ?? 1} 次）`,
```

</details>

**依据 4 · 源码核查**：[lib/constants.js:106-128](https://github.com/Airisey/dsh-model-failover/blob/75b1b7e9784eec172b542eec03420a4dc9c010d7/lib/constants.js#L106-L128)

默认全局范围与两类次数。

<details>
<summary>查看原文（23行）</summary>

```text
  /**
   * 一轮结束时是否自动再补一句「继续」（见 lib/autocontinue.js）。
   *
   * 这是**整个 DSH** 的行为，不限于「模型接力」这条路由：监听器挂在
   * `session/event` 上，任何模型跑出来的轮都会经过它。设置页里那一节叫
   * 「DSH 异常」，就是为了不让人以为只有接力模型才管用。
   */
  autoContinue: true,
  /** 触发条件之一：dsh 报了「本轮运行失败」。 */
  autoContinueOnFailure: true,
  /** 触发条件之一：输出撞到 token 上限被截断。 */
  autoContinueOnMaxTokens: true,
  /**
   * 运行失败时最多自动补发几次。
   *
   * 默认只补一次：失败往往意味着"这个任务现在做不下去"（模型不肯、工具报错、
   * 上下文被拒），再问一遍得到的常是同一个结局，补十次只是把同一段错误刷十遍。
   * 撞 token 上限完全不同 —— 那是**没写完**，接着写就好，所以那边给到 10。
   */
  autoContinueFailureLimit: 1,
  /** 输出撞到 token 上限时最多自动补发几次。截断是"没写完"，多补几次是常态。 */
  autoContinueMaxTokensLimit: 10,
  /**
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
