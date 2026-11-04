# DSH DeepSeek Web Login

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[817a1a2](https://github.com/cv-superding/dsh-deepseek-web-login/tree/817a1a2d3eca187f9254795d52ffe4d131498828)

<!-- BEGIN META -->
[![GitHub ★ 353](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=353&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cv-superding/dsh-deepseek-web-login) [![npm 30d 7,080](https://img.shields.io/static/v1?label=npm+30d&message=7%2C080&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deepseek-web-login) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deepseek-web-login)
<!-- END META -->

> **功能**：把 DeepSeek 网页登录态接为 DSH 模型供应商，支持流式回复、图片输入和提示词工具调用桥接。

> **亮点**：[Q02](#research-q02)把提示词工具协议接到真实宿主工具事件，[Q04](#research-q04)按请求起始账号归属记录并在删除确认前保留清理责任。这些机制为有条件适配提供可查设计，不证明运行闭环或全局幂等。

> **主要限制**：[Q03](#research-q03)确认两次图片引用拒绝后的无图重发仍可能保留附图标记且无本分支告知；当前默认链式上下文也依赖远端早期约束保留。[Q04](#research-q04)表明凭据明文、导出及卸载/登出/远端删除是不同生命周期，正文恢复不能直接算任务完成。

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
  - [Q01 · 谁用它完成什么任务，登录、provider与网页服务如何接通？](#detail-section-11)
  - [Q02 · 文本协议怎样变成宿主工具事件，重试和取消保证到哪里？](#detail-section-12)
  - [Q03 · 图片与上下文恢复会改变原任务输入吗？](#detail-section-13)
  - [Q04 · 凭据、账号轮换与远端会话删除由谁负责？](#detail-section-14)
  - [Q05 · 是否值得采用，怎样衡量完整成本并验证新恢复契约？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有网页账号、希望研究非官方供应商适配的个人DSH操作者；合格结果须核对必需输入、真实工具执行和最终产物，见[Q01](#research-q01)。

对照已验证的正式供应商API与人工网页操作；本组件增加另一通道的Agent接线，不能据网页额度宣传推算真实节费或账号风险。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 网页模型provider | 将网页接口接到DSH模型流 | 非官方私有接口，需要账号、浏览器及服务资格 |
| 工具事件桥 | 把模型文本协议交给宿主工具执行器 | 解析不等执行、权限或幂等，串行是提示要求 |
| 图片上传 | 读取附件并带入网页请求 | 正常失败有告知，特殊无图重发仍有标记不一致 |
| 链式上下文 | 绑定账号与会话，按增量或链尾replay | 默认chained，远端保留约束未验证 |
| 账号与导出 | 登录、切换、探活和备份凭据 | JSON含完整凭据，需受信本地环境 |
| 会话清理journal | 保留待删责任并启动补删 | keep主动保留，卸载尽力不等远端已清 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配Node与DSH llm/webServer | 启动必需 | 加载provider和管理入口 | 声明范围非实际兼容验收 |
| 用户网页账号及服务资格 | 模型请求必需 | 私有网页接口认证 | 凭据失效应明确停止或人工重登 |
| 可用Edge/Chrome及profile | PoW路径必需 | 页面求解和浏览器传输 | 缺浏览器抛TRANSPORT |
| 宿主attachments | 图片任务必需 | 读取原始附件并上传 | 缺图不能按原任务成功放行 |
| 受信本地目录和管理API保护 | 凭据使用必须核实 | 账号、导出、台账及设置 | 未核宿主保护不能扩到共享公网环境 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认资格与隔离账号环境 | 不以真实敏感任务试协议 |
| 接入 | 加载bundle、浏览器登录并选择provider | 当前账号与路由可核对 |
| 请求 | 适配器过闸门、构造prompt并解析流 | 缺输入和未知工具必须显式处理 |
| 验收 | 用户对照真实工具结果和产物 | 正文或finish不等于任务完成 |
| 退出 | 分别核账号、导出、profile及远端会话 | 卸载不等于登出或已删远端 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器、网络和本机资源，金额未知 | 登录、版本、鉴权和隔离目录核对 | 不把网页额度当全周期免费 |
| 持续使用 | 请求、上传、重试与回退资源未知 | 核对输入、工具和链约束，维护私有协议 | 用量有估算分支，净节费未知 |
| 失败恢复与退出 | 重传与残留状态占用未知 | 重登、核实际副作用、清profile及导出 | 取消不证明远端停止，卸载不清凭据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工具桥接 | 文本解析到宿主工具事件 | 真实执行、权限和任务正确性 |
| 图片处理 | 常规成功key与notice路径 | 特殊无图重发的真实影响和频率 |
| 上下文续接 | 账号会话绑定与链尾replay | 远端压缩后约束保留 |
| 清理 | 按账号journal和响应销账 | 远端列表完整删除及全周期负担 |

> **思考**：[Q03](#research-q03)确认两次图片引用拒绝后的无图重发仍可能保留附图标记且无本分支告知；当前默认链式上下文也依赖远端早期约束保留。[Q04](#research-q04)表明凭据明文、导出及卸载/登出/远端删除是不同生命周期，正文恢复不能直接算任务完成。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)把提示词工具协议接到真实宿主工具事件，[Q04](#research-q04)按请求起始账号归属记录并在删除确认前保留清理责任。这些机制为有条件适配提供可查设计，不证明运行闭环或全局幂等。

[Q02](#research-q02)的工具事件桥、generator内部许可及finally释放、yield前重试守卫，[Q04](#research-q04)的账号稳定归属和待删journal值得借鉴。串行仅提示、解析不授权、删除协议接受不等于逐项远端回读，移植要保留这些边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)确认两次图片引用拒绝后的无图重发仍可能保留附图标记且无本分支告知；当前默认链式上下文也依赖远端早期约束保留。[Q04](#research-q04)表明凭据明文、导出及卸载/登出/远端删除是不同生命周期，正文恢复不能直接算任务完成。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)先观察；后续仅以非敏感只读任务核输入齐备、工具实执行和产物，任何缺图、协议代执行或清理不明都停止并回已验证供应商。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

适配、协议桥及局部恢复路径有固定源码支持；网页可用性、当前宿主、真实工具任务及账号风险未验证。采用结论为观察，任务级契约为研究者未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/adapter.ts、src/protocol.ts、src/context-feed.ts、src/auth.ts、src/accounts.ts、src/login.ts、src/browser-transport.ts、src/webapi.ts、src/session-journal.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根插件，定向检查provider注册、工具协议解析与事件、图片正常/拒绝降级、当前上下文feed、浏览器PoW、账号写入/探活/轮换、导出/登出及journal清理。旧12 findings逐项重核；未全审所有UI、所有私有接口解析、网页条款或目标宿主鉴权实现，未读取真实凭据。
- 下一步：后续隔离核对双次图片拒绝、未知工具、链约束、取消、导出/登出和删除超时，以真实任务结果及完整成本对照；本轮未执行。

**分析版本**

- **仓库**：[cv-superding/dsh-deepseek-web-login](https://github.com/cv-superding/dsh-deepseek-web-login)
- **版本号**：2.0.4（[固定提交 817a1a2](https://github.com/cv-superding/dsh-deepseek-web-login/tree/817a1a2d3eca187f9254795d52ffe4d131498828)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的任务级恢复契约，把输入齐备、工具实执行、结果核对和远端清理状态分开。用图片拒绝、未知工具、约束丢失和删除超时对照，错误放行不降或维护负担高于正式替代就否定。

后续隔离核对双次图片拒绝、未知工具、链约束、取消、导出/登出和删除超时，以真实任务结果及完整成本对照；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 7687 | — | — | 120817 |
| .mjs | source | 41 | 3927 | 3034 | 626 | — |
| .js | source | 2 | 17088 | 12994 | 4187 | — |
| .ts | source | 32 | 23129 | 14626 | 7358 | — |
| .mjs | test | 82 | 23002 | 17622 | 3452 | — |

</details>

**活跃度**

[![Issue 未关闭 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=16&color=737b86&logo=github)](https://github.com/cv-superding/dsh-deepseek-web-login/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=10&color=737b86&logo=github)](https://github.com/cv-superding/dsh-deepseek-web-login/issues?q=is%3Aissue+created%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/cv-superding/dsh-deepseek-web-login/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：网页登录态接入DSH时，输入、工具事件与远端会话能否保持可解释，何时回退正式供应商？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁用它完成什么任务，登录、provider与网页服务如何接通？

**研究主题**：场景与需求、依赖、兼容与流程、贡献与相对优势

#### 完整回答

它是原生DSH供应商适配插件，为已有网页账号的个人操作者把chat.deepseek.com网页登录态接到ctx.llm的deepseek-web路由，目标是在DSH工具任务中使用网页模型。它不是官方API客户端，也不是把DSH请求转给独立反向代理服务；请求构造、私有接口、流解析和提示词工具协议在本项目中实现。合格任务必须同时保留必需输入、得到正确工具结果并核对最终产物，仅有正文和结束事件不足以证明完成。

入口apply注入llm和webServer，createAdapter接收账号读取、附件读取、请求闸门、切号和会话清理依赖，再registerAdapter到provider。浏览器传输通过独立profile和CDP页面fetch把响应分块回传Node，PoW求解入口要求可用系统浏览器，没有时抛TRANSPORT而不回退Node计算。这是账号、浏览器、宿主和私有服务共同成立的接线条件，不能由源码推出网页额度、当前服务可用性或封禁风险降低。README的免费额度、指纹和稳定性说法作为作者声明保留，本轮没有登录、实际调用或核实访问条款。

相对已验证的正式供应商API，增量是将另一个网页通道接入同一Agent接口，代价是自行承担凭据、浏览器进程、私有协议和远端状态维护；不应按“少配一个API key”就直接推导全周期便宜。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-38](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/README.md#L24-L38)

作者说明provider、私有接口和提示词工具协议。

<details>
<summary>查看原文（15行）</summary>

````text
## 这是什么

DSH（DeepSeek Harness）通过 `ctx.llm` 的 **provider 适配器**接入模型。本项目实现了 `deepseek-web`
这个 provider —— 它不调用官方 API，而是复用你**已登录的网页版**：PoW 挑战、会话、SSE 流式、
文件上传，全部走网页端私有接口。

于是：**在模型选择器里选 `DeepSeek 网页 · 快速模式`，就能用网页版免费额度跑 DSH 的 agent**。

```text
DSH agent loop ──▶ ctx.llm ──▶ [deepseek-web 适配器] ──▶ chat.deepseek.com
                                     │  ├─ PoW（SHA3 WASM，**在浏览器页面里**求解）
                                     │  ├─ chat_session（**按 DSH 会话复用，跨重启续上**）
                                     │  ├─ chat/completion（SSE patch 流，链式只发增量）
                                     │  └─ file/upload_file（图片输入）
                                     └─ 提示词工具协议 ⇄ tool-call 块
````

</details>

**依据 2 · 源码核查**：[src/index.ts:902-928](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/index.ts#L902-L928)

真实适配器依赖与provider注册。

<details>
<summary>查看原文（27行）</summary>

```text
  const adapter = createAdapter({
    getAuth,
    noteCall: recordCallOutcome,
    currentAccountId: activeAccountId,
    gate,
    // 自动轮换账号的检查点：adapter 在闸门放行之前 await 一下（见 maybeAutoSwitch 的注释）。
    maybeAutoSwitch,
    // 账号被限时"还能不能换号接着干" —— 决定那次失败给长退避还是短退避（见 canFailover）。
    canFailover,
    sessionCleaner,
    config: adapterConfig,
    readImage: async (ref: any, signal?: AbortSignal) => {
      const attachments = ctx.get?.('attachments')
      if (!attachments || typeof attachments.readImage !== 'function') {
        throw new Error('attachment service unavailable (ctx.attachments)')
      }
      const stored = await attachments.readImage(ref, signal)
      return {
        data: stored.data,
        ...(stored.ref?.mediaType ? { mediaType: String(stored.ref.mediaType) } : {}),
        ...(stored.ref?.name ? { name: String(stored.ref.name) } : {}),
      }
    },
  })

  // 1) LLM 适配器：registerAdapter 内部走 ctx.effect（traceable 代理把副作用绑到本 fiber）
  ctx.llm.registerAdapter([PROVIDER], adapter)
```

</details>

**依据 3 · 源码核查**：[src/browser-transport.ts:1-7](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/browser-transport.ts#L1-L7)

独立浏览器页面fetch和分块回传机制。

```text
/**
 * 浏览器代理传输层 —— 当官方 DSH 桌面端拿不到 `electron.net.fetch` 时，
 * 用系统里的 Edge/Chrome 进程当请求出口，让 TLS/HTTP2 指纹与真实浏览器一致。
 *
 * 机制：启动一个 headless 浏览器（独立 profile），通过 CDP 在页面上下文里调用 `fetch()`，
 * 请求实际从浏览器网络栈发出。响应通过 `Runtime.addBinding` 建立的回调分块传回 Node，
 * 再包装成标准 `Response`（含 ReadableStream）交给插件。
```

**依据 4 · 源码核查**：[src/webapi.ts:595-608](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/webapi.ts#L595-L608)

PoW实际入口检查浏览器并在缺失时抛错。

<details>
<summary>查看原文（14行）</summary>

```text
async function solvePow(challenge: PoWChallenge, wasmUrl: string): Promise<number> {
  if (systemBrowserAvailable()) {
    return await solvePowInPage({
      wasmUrl,
      challenge: challenge.challenge,
      salt: challenge.salt,
      difficulty: challenge.difficulty,
      expireAt: challenge.expire_at,
    })
  }
  throw new AdapterLlmError(
    'PoW 必须在浏览器页面内求解（未找到 Edge/Chrome）—— 不再退回 Node 侧计算，因为那是主要的封号特征',
    'TRANSPORT',
  )
```

</details>

**依据 5 · 源码核查**：[package.json:60-73](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/package.json#L60-L73)

bundle、客户端和Node版本范围声明。

<details>
<summary>查看原文（14行）</summary>

```text
    }
  },
  "scripts": {
    "build": "node scripts/build.mjs",
    "test": "node scripts/test-offline.mjs",
    "prepare": "node scripts/prepare.mjs"
  },
  "engines": {
    "node": "^22.18.0 || >=24.11.0"
  },
  "devDependencies": {
    "@types/node": "24.13.3",
    "@types/react": "19.3.0",
    "tsdown": "0.22.14",
```

</details>

#### 缺口

- 当前网页服务可用性、额度和目标宿主兼容没有验证。
  **影响**：不能认定可稳定替代正式供应商或降低账号风险。
  **进一步探讨**：由有资格用户在隔离环境核实服务条件并测试非敏感只读任务；保留正式供应商退路。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文本协议怎样变成宿主工具事件，重试和取消保证到哪里？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

适配器将system、历史和宿主tools序列化为网页prompt；工具目录先扣固定头和协议预算，再在不足时显式列出未描述工具，而非把半份schema当完整定义。流过滤器识别JSON/XML调用形状并解析参数，adapter把每个解析结果转换为block-start、tool-call-delta和block-end，再以finish.kind=tool-calls交回宿主。这证明调用桥真实接到DSH事件接口，不代表工具已经执行；实际执行、参数校验、权限审批与结果写回仍属于宿主。

knownTools参数被明确保留但不用于过滤未知调用，未知名字也透出以便执行器报错；串行开关只是选择提示词中的“一次一个”要求，emitCalls仍遍历整批调用。故不能把serialToolCalls当独立并发或副作用隔离保证，也不能用解析成功证明参数符合工具schema。宽容解析修复数组或字符串形状是互操作设计，需将错误交给执行器明确处理，不能静默当已完成。

请求闸门在generator开始迭代时获取许可，传入取消signal，finally释放；起飞前固定accountId避免切号后把结果记错账号。图片拒绝只有在尚未yield任何事件且尝试次数有限时才会内部重试，防止已经交给宿主的输出被重复播放。这是局部流守卫，不是跨宿主重试的全局幂等或远端副作用取消证明。取消、断连或timeout之后，网页端生成、已交出的工具块和真实工具副作用必须分别核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/protocol.ts:887-900](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/protocol.ts#L887-L900)

固定头预算扣除后再生成工具目录。

<details>
<summary>查看原文（14行）</summary>

```text
  // 旧做法是先把工具目录渲染到 5.6 万字符，再发现 head 超过 `maxChars * 比例`，
  // 于是 `truncateMiddle` 从**中间**挖掉一块 —— 留下的是**残缺的 JSON Schema**：
  // 模型会照着半截定义猜参数，比"干脆不列这个工具"更糟；而且 maxChars 越小时越容易触发。
  // 现在反过来：先把 system 与协议指令的固定开销扣掉，剩下的才是工具目录能用的额度。
  // 装不下就走 buildToolSection 自己的兜底（列出被省略的工具名），head 永远完整。
  // ⚠️ 预算必须按**本次实际要发的那份**协议文本算（两份长度不同：串行版少了 rule 10 的一句、
  // rule 1/9 也更短）—— 拿错一份，工具目录的额度就会算偏，head 可能超出 HEAD_RATIO。
  const protocolText = toolProtocolInstructions(options.serialToolCalls)
  const toolBudget = Math.max(
    0,
    Math.floor(maxChars * HEAD_RATIO) - system.length - protocolText.length - PROTOCOL_SLACK_CHARS,
  )
  const toolSection = buildToolSection(options.tools, toolBudget)
  const protocol = toolSection ? `\n\n${protocolText}${toolSection}` : ''
```

</details>

**依据 2 · 源码核查**：[src/protocol.ts:1930-1963](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/protocol.ts#L1930-L1963)

宽容参数解析与调用ID生成。

<details>
<summary>查看原文（34行）</summary>

```text
export function parseToolCallJson(json: string): ToolCallRequest[] | null {
  const parsed: any = parseJsonLenient(json)
  if (!parsed || typeof parsed !== 'object') return null
  const raw = Array.isArray(parsed.tool_calls)
    ? parsed.tool_calls
    : parsed.tool_call && typeof parsed.tool_call === 'object'
      ? [parsed.tool_call]
      : null
  if (!raw) return null
  const calls: ToolCallRequest[] = []
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue
    const name = typeof entry.name === 'string' ? entry.name : typeof entry.tool === 'string' ? entry.tool : ''
    if (!name) continue
    let args = entry.arguments ?? entry.parameters ?? entry.args ?? {}
    // 模型偶尔把 arguments 写成**数组**（实测 2026-09-11：arguments:[{…}]，规范是对象）。
    // 只有一个对象元素时取该元素 —— 否则参数会被序列化成 "[{…}]"，工具拿到的是垃圾。
    if (Array.isArray(args) && args.length === 1 && args[0] && typeof args[0] === 'object' && !Array.isArray(args[0])) {
      args = args[0]
    }
    if (typeof args === 'string') {
      // 已经是字符串：能解析就原样透出（DSH 的 arguments 语义是原始 JSON 串），否则包装
      const reparsed = parseJsonLenient(args)
      if (reparsed === undefined) args = JSON.stringify({ _raw: args })
    } else {
      try {
        args = JSON.stringify(args ?? {})
      } catch {
        args = '{}'
      }
    }
    calls.push({ id: `call_${randomUUID().replace(/-/g, '').slice(0, 20)}`, name, arguments: String(args) })
  }
  return calls.length > 0 ? calls : null
```

</details>

**依据 3 · 源码核查**：[src/protocol.ts:2256-2278](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/protocol.ts#L2256-L2278)

knownTools不做授权过滤的明确实现。

<details>
<summary>查看原文（23行）</summary>

```text
export class ToolCallStreamFilter {
  private pending = ''
  private capture: { mode: 'json' | 'xml'; buffer: string } | null = null
  private abandoned: { raw: string; mode: 'json' | 'xml'; reason?: 'unbalanced' | 'unparsable' | 'oversize' | 'echo' } | null = null
  /**
   * ⚠️ **只存不用**（故意的）：历史参数，保留签名以免调用点大改。
   *
   * 不拿它过滤解析出的调用 —— 模型调一个没声明过的工具时，把调用丢掉会让**整轮输出变空**
   * （客户端只看到"模型未返回正文或工具调用"），比让客户端报「未知工具」糟糕得多。
   * 真要收紧工具集，应该在执行器那一层报错，不是在这里静默丢弃。
   */
  private readonly knownTools?: ReadonlySet<string>
  /**
   * 本次流里**我们剥掉过一个调用围栏的开栏**（0.6.38）。
   *
   * ⇒ 之后出现的闭栏必定是同一个调用块的收尾，可以安全剥掉。
   * ⚠️ 有了这个标记才敢剥闭栏：否则"正文里正常的代码块"会被误伤
   * （`check-auto-continue` N03 / `check-tools-section` 各有用例守着）。
   */
  private sawCallFence = false

  constructor(knownTools?: ReadonlySet<string>) {
    this.knownTools = knownTools
```

</details>

**依据 4 · 源码核查**：[src/adapter.ts:1332-1345](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/adapter.ts#L1332-L1345)

每个调用真正转为宿主工具事件。

<details>
<summary>查看原文（14行）</summary>

```text
    const emitCalls = function* (calls: readonly { id: string; name: string; arguments: string }[], fenced?: boolean): Generator<any> {
      // 🔴 0.6.39：记下这批调用是不是围栏包裹的（`undefined` = 本次没发出调用，不覆盖已有值）。
      if (calls.length > 0) callShape = fenced ? 'fenced' : 'bare'
      for (const call of calls) {
        const index = nextIndex++
        toolCallCount += 1
        yield { type: 'block-start', index, blockType: 'tool-call' }
        yield { type: 'tool-call-delta', index, id: call.id, name: call.name, argumentsDelta: call.arguments }
        yield {
          type: 'block-end',
          index,
          block: { type: 'tool-call', id: call.id, name: call.name, arguments: call.arguments },
        }
      }
```

</details>

**依据 5 · 源码核查**：[src/adapter.ts:1740-1745](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/adapter.ts#L1740-L1745)

存在调用则finish为tool-calls，不表示宿主执行完成。

```text
    if (toolCallCount > 0) {
      // 🔴 0.6.39：留痕"这批调用是不是围栏包裹的"（`callShape` 由 `emitCalls` 累加得出）。
      // ⚠️ `undefined` = 本轮没有调用（区别于 'bare'：那是"没听话但执行了"）。
      noteCallShape(callShape ?? 'none', logger)
      yield { type: 'finish', reason: { kind: 'tool-calls' }, callShape }
      return
```

**依据 6 · 源码核查**：[src/adapter.ts:1116-1132](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/adapter.ts#L1116-L1132)

取消信号传入闸门且账号归属在请求开始固定。

<details>
<summary>查看原文（17行）</summary>

```text
  async function* gatedStream(options: any): AsyncGenerator<any> {
    const purpose = typeof options?.purpose === 'string' && options.purpose ? options.purpose : 'chat'
    // 自动轮换账号的检查点（宿主注入；不注入即无操作）。
    // ⚠️ 刻意放在 acquire **之前**：换号要落在"两个请求之间"，不能插进已经起飞的请求里。
    // 宿主侧已自己吞异常，这里再兜一层 —— 换号这种"顺带做的事"绝不该让请求失败。
    try {
      await deps.maybeAutoSwitch?.()
    } catch {}
    // F11：把调用方的取消信号交给闸门 —— 否则「点停止」之后，请求仍会在排队/
    // 等间隔里干等（间隔 2~4s、长休可达 180s），界面停了、闸门还在倒计时。
    const release = await gate.acquire(purpose, options?.signal)
    const startedAt = Date.now()
    // ⚠️ F05（2026-09-12 审计）：在**起飞前**就把账号 id 定下来。
    // 旧实现由宿主在上报时现取 `activeAccountId()`，而这次调用可能飞几十秒 ——
    // 期间用户若切了号，失败/限制就会被记到**切换后的账号**上：
    // 被限制的号反而清白，正在用的号却背了别人的处罚。
    const accountIdAtStart = deps.currentAccountId?.()
```

</details>

**依据 7 · 源码核查**：[src/adapter.ts:1177-1192](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/adapter.ts#L1177-L1192)

报告结果及finally释放许可。

<details>
<summary>查看原文（16行）</summary>

```text
        yield event
      }
      // 跑完没抛错 = 这次调用成功。宿主会用这个信号清理"已经过期的受限标记"。
      report({ ok: true })
    } catch (error: any) {
      report({
        ok: false,
        ...(typeof error?.code === 'string' ? { code: error.code } : {}),
        ...(typeof error?.message === 'string' ? { message: error.message.slice(0, 300) } : {}),
        ...(Number.isFinite(error?.mutedUntilMs) ? { mutedUntilMs: error.mutedUntilMs } : {}),
        ...(error?.failure?.rateLimitKind === 'throttled' || error?.rateLimitKind === 'throttled' ? { throttled: true } : {}),
      })
      throw error
    } finally {
      release()
    }
```

</details>

**依据 8 · 源码核查**：[src/adapter.ts:1084-1100](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/adapter.ts#L1084-L1100)

yield前且有限次的图片内部重试。

<details>
<summary>查看原文（17行）</summary>

```text
  async function* streamWithImageFallback(options: any): AsyncGenerator<any> {
    let attempt = 0
    let current = options
    while (true) {
      let yielded = false
      const inner = streamImpl(current)
      try {
        while (true) {
          const step = await inner.next()
          if (step.done === true) return
          yielded = true
          yield step.value
        }
      } catch (error: any) {
        if (!canRetryImageReject(error, yielded, attempt)) throw error
        attempt += 1
        current = attempt === 1 ? { ...options, __retryImages: true } : { ...options, __skipImages: true }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 图片与上下文恢复会改变原任务输入吗？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

会改变，而且应按实际路径区分。正常上传路径按附件ID去重、限制最近图片，并仅把成功上传或缓存命中的key加入sentKeys；缺附件服务或上传失败会给用户可见notice，序列化时可将未实发图片标为omitted。因此不能把所有上传失败都说成悄悄假装有图。

仍有明确的特殊缺口：两次INVALID_REF_FILE且无输出后，streamWithImageFallback第二级设置__skipImages；streamImpl在该分支返回ids=[]、keptKeys=undefined、notice=undefined，再把这个undefined传给serializePromptParts。protocol.blockImageMarks在!kept时仍写[image attached]。于是该无图重发分支可存在“请求没ref ID，文本标记仍说附图，也没有本分支告知”的输入不一致。这里是固定源码路径推导，未复现服务端触发或最终模型错误；对必须看图的任务，它足以阻止把文本恢复当任务成功。

上下文当前源码DEFAULT_CONTEXT_MODE是chained，不能照README仍称默认full的段落下结论。链与账号/会话绑定；新会话或链缺失发根消息，已有链在头变化、历史不再追加等情形可能沿链尾replay。头不变时优先发送分歧点之后的非助手回声条目、再退到无回声历史或transcript，最后才full；头变化会重发新头。它减少重复文本但依赖远端父链保留早期协议和约束，不能从本地head相同推出服务端仍记住。后台压缩和图片引用生命周期也必须在任务层验收，不能只看用户气泡较短。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.ts:940-969](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/adapter.ts#L940-L969)

图片裁剪和成功key集合的设计。

<details>
<summary>查看原文（30行）</summary>

```text
    const maxRefImages = deps.config.maxRefImages ?? DEFAULT_MAX_REF_IMAGES
    const overLimit = maxRefImages > 0 && unique.length > maxRefImages
    const kept = overLimit ? unique.slice(-maxRefImages) : unique
    // ⚠️ 0.1.82：keptKeys **不再**预先按裁剪结果算 —— 它会被当成"本轮真的带上的图"
    // 传给 `serializePromptParts`（后者据此写 `[image attached]` / `[earlier image omitted]`），
    // 而**上传失败**的图并没有进 `ref_file_ids` ⇒ 模型以为收到了，转而对着没送出去的图瞎猜。
    // 改成在上传循环里按"成功（含缓存命中）"累计，见下面的 sentKeys。
    // 提示按**阶梯**上屏（见 nextTrimNoticeThreshold）：首次必说明，之后只有被略过的份数
    // 翻倍（且至少再多 TRIM_NOTICE_FLOOR 份）才再说一次。日志照记不误，每轮的截断都能查。
    const dropped = unique.length - kept.length
    const trimNotice =
      overLimit && dropped >= nextTrimNoticeThreshold(lastTrimNotice, kept.length)
        ? imageTrimNotice(unique.length, dropped, kept.length)
        : undefined
    if (trimNotice) lastTrimNotice = { kept: kept.length, dropped }
    if (overLimit) {
      logger?.info?.(
        `deepseek-web: 本请求的图片共 ${unique.length} 张，超过上限 ${maxRefImages} ⇒ 只发最近的 ` +
          `${kept.length} 张（较早的 ${unique.length - kept.length} 张本轮略过）`,
      )
    }
    uploadCache.prune()
    const ids: string[] = []
    const failures: string[] = []
    // 0.1.80：`attempted` 数"真的发起过上传的张数"，`skippedByAuth` 记"因授权失效而放弃的张数"。
    // 只在授权失败时才有值 —— 那个数字要进用户可见的告知语（否则只报 1 张，看着像小事）。
    let attempted = 0
    let skippedByAuth = 0
    /** 真的进了 `ref_file_ids` 的那些 key —— 提示里的 `[image attached]` 只能写在这些图上。 */
    const sentKeys = new Set<string>()
```

</details>

**依据 2 · 源码核查**：[src/adapter.ts:997-1024](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/adapter.ts#L997-L1024)

上传失败和AUTH停止、用户notice及实际sentKeys回传。

<details>
<summary>查看原文（28行）</summary>

```text
        uploadCache.set(key, uploadedFile.fileId, Date.now(), scope)
        ids.push(uploadedFile.fileId)
        sentKeys.add(key)
        sentKeyList.push(key)
      } catch (error: any) {
        if (signal?.aborted) throw error
        const message = String(error?.message ?? error)
        failures.push(message)
        logger?.warn?.(`deepseek-web: 图片上传失败（已降级为纯文本）：${message}`)
        // 0.1.80：授权失效是**全局**的 —— 同一个 token 上传剩下的图必然同样被拒。
        // 继续往下试纯粹是白跑请求：每张图都要先求一次 POW、再发一次上传。
        // 实测（2026-09-21）：14 张图 ⇒ 28 次注定失败的请求，而且这些无效请求
        // 同样暴露在风控下。第一张撞 AUTH 就停，把结论交给接下来的 completion ——
        // 它才是判断"这次凭证到底能不能用"的地方（万一只是单张图的问题，
        // 剩下的图不该被无辜牺牲，所以是 break 而不是 throw）。
        if (error?.code === 'AUTH') {
          skippedByAuth = kept.length - attempted
          logger?.warn?.(`deepseek-web: 图片上传遭遇授权失败，剩余 ${skippedByAuth} 张不再尝试`)
          break
        }
      }
    }
    // 图丢了必须让**用户**看见，不能只写日志（见 imageNotice 的说明）
    const notices: string[] = []
    if (trimNotice) notices.push(trimNotice)
    if (failures.length > 0) notices.push(imageNotice(failures.length, failures[0], skippedByAuth))
    // 这里回传的是**真的带上了**的集合（不是"打算带"的），调用方据此写提示标记
    return { ids, keys: sentKeyList, keptKeys: sentKeys, ...(notices.length > 0 ? { notice: notices.join('') } : {}) }
```

</details>

**依据 3 · 源码核查**：[src/adapter.ts:1249-1274](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/adapter.ts#L1249-L1274)

无图重发分支keptKeys/notice为undefined，并实际传给序列化器。

<details>
<summary>查看原文（26行）</summary>

```text
    // `__skipImages`（降级重试的第二级）：连着两次都不被认，就**不带图**再发一次。
    // 宁可这一轮没有图，也不能让会话卡在"每轮都失败"上 —— 那等于整个会话作废。
    const uploaded =
      options?.__skipImages === true
        ? { ids: [], keys: undefined, keptKeys: undefined, notice: undefined }
        : await uploadRequestImages(auth, options?.messages, options?.signal)
    // ⚠️ 0.1.82：`__skipImages`（不带图重发）**绝不能**更新 lastImageKeys ——
    // 它记的是"上一轮那批 key 的 file_id 被服务端拒过"，抹成空集就等于下一轮
    // 又从中毒缓存出发，重演"2 次注定被拒 + 1 次无图"。
    if (uploaded.keptKeys) lastImageKeys = uploaded.keptKeys
    const refFileIds = uploaded.ids

    // 链式投喂需要 prompt 的**结构**（固定头 + 未截断的历史条目）才能算增量，
    // 所以这里取 parts、下面的 params 一起把 entries 传下去（见 context-feed.ts）。
    let promptParts = serializePromptParts({
      system: options?.system,
      messages: options?.messages ?? [],
      tools: (options?.tools ?? []) as ToolSchemaLike[],
      maxChars: deps.config.maxPromptChars ?? DEFAULT_MAX_PROMPT_CHARS,
      // 「一次一个工具」开关：只换协议指令那一段，其余 prompt 结构不变（**缺省＝串行**）。
      serialToolCalls: deps.config.serialToolCalls !== false,
      // 只对**首轮**传：它才是真正带 ref_file_ids 的那一次（续写轮 refFileIds 传空）。
      // 传了之后，被长度控制略过的图会写成 `[earlier image omitted]` 而不是 `[image attached]`
      // —— 标记与实发必须一致，否则模型会对着没送出去的图瞎猜。
      keptImageKeys: uploaded.keptKeys,
    })
```

</details>

**依据 4 · 源码核查**：[src/protocol.ts:653-663](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/protocol.ts#L653-L663)

!kept时图片仍标为attached，与无图重发形成不一致。

<details>
<summary>查看原文（11行）</summary>

```text
  kept: ReadonlySet<string> | undefined,
): string[] {
  const marks: string[] = []
  const walk = (list: readonly any[] | undefined): void => {
    for (const block of list ?? []) {
      if (!block || typeof block !== 'object') continue
      if (block.type === 'image') {
        const key = String(block.attachment?.attachmentId ?? '')
        marks.push(!kept || !key || kept.has(key) ? '[image attached]' : '[earlier image omitted]')
      } else if (block.type === 'tool-result' && Array.isArray(block.content)) walk(block.content)
    }
```

</details>

**依据 5 · 源码核查**：[src/context-feed.ts:35-48](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/context-feed.ts#L35-L48)

当前默认chained，与README旧段不同。

<details>
<summary>查看原文（14行）</summary>

```text
/** 默认每轮重发全量 —— 与 0.1.61 及以前的行为一致，不改动既有用户。 */
/**
 * 默认投喂模式：**链式**（2026-11-03 改）。
 *
 * 为什么从 `full` 改过来：全量模式每轮都发 `parent_message_id: null` 的**根消息**；
 * 一旦它落进一个**已经有内容**的网页端会话里，网页端会把它渲染成「同一条消息的多个版本」
 * —— 界面上就是「修改 / 重新生成」+ `n / n` 翻页（用户实测截图：`4 / 7`）。
 * 而且 DSH 每轮都会替换式改写运行时快照 ⇒ 链经常要重开 ⇒ 全量模式下几乎**每轮**都长这样。
 * 链式模式只发增量 + 指向上一条 assistant，网页端看到的就是正常的一问一答。
 *
 * ⚠️ 全量仍然保留（面板可切）：它换来的是"服务端不留上下文"，代价就是上面那个分叉外观；
 * 现在 `needsFreshSession` 会把"根消息落进复用会话"这条也拦下来，见那里的注释。
 */
export const DEFAULT_CONTEXT_MODE: ContextMode = 'chained'
```

</details>

**依据 6 · 源码核查**：[src/context-feed.ts:360-418](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/context-feed.ts#L360-L418)

链尾replay、按分歧省略旧头和账号会话一致性判断。

<details>
<summary>查看原文（59行）</summary>

```text
  const replay = (reason: FeedReason, options: { headUnchanged?: boolean; from?: number } = {}): FeedDecision => {
    const prompt = replayPrompt(options)
    return {
      prompt,
      parentMessageId: chain.parentId,
      next: { head, entries: entries.slice(), sessionId: input.sessionId, accountKey: input.accountKey },
      reason,
    }
  }

  /**
   * 重发时到底发哪一段。**按代价从小到大试，第一个可用的就用**，全都不行才退回整份。
   *
   * 🔴 2026-10-02 第二轮的现场（用户报"我只说了『哇哦帅气』，发出去的提示词怎么这么长"）：
   *    `not-appended` 走这条路时发的是**整份历史**，而历史里全是 `Assistant: …` 条目 ——
   *    也就是**模型自己刚说过的那段回答**。于是：① 5 个字的输入发出去 40193 字符；
   *    ② 网页端的用户气泡里赫然是"上一句回答 + 我的新消息"，看着就像"我把答案喂给它让它复述"。
   *    增量路径**早就有**"剔掉模型回声"这条规则（0.6.17 为同样的投诉加的），**这条路没走它** ——
   *    当时注释还写着"只在增量里剔"，理由站在"全量是从零重述"那边；但 replay 根本不是从零重述：
   *    链还在（同会话、同账号），该会话里什么都有。所以这里必须按**同一套网**来。
   *
   * 四档（每档都要求"非空且不超预算"）：
   *   ① 从**第一个分歧点**起的条目（剔回声）—— 最小，通常就是这一句新消息；
   *   ② 整份条目（剔回声）—— 分歧点算不出来时退一步，至少不再把模型的话喂回去；
   *   ③ `transcript`（0.6.32：省掉固定头）；
   *   ④ 整份 `full` —— 什么都算不出来时的兜底。
   * ⚠️ 头**变了**时只有 ④ 合法（新头从没发过）。
   */
  const replayPrompt = ({ headUnchanged = false, from }: { headUnchanged?: boolean; from?: number }): string => {
    if (headUnchanged) {
      const budget = Number.isFinite(input.maxChars) ? (input.maxChars as number) : Number.POSITIVE_INFINITY
      const usable = (text: string): boolean => text.trim().length > 0 && text.length <= budget
      if (from !== undefined && from < entries.length) {
        const tail = entries.slice(from)
        const withoutEcho = tail.filter((line) => !isAssistantTranscriptEntry(line))
        const tailText = (withoutEcho.length > 0 ? withoutEcho : tail).join('\n\n')
        if (usable(tailText)) return tailText
      }
      const noEcho = entries.filter((line) => !isAssistantTranscriptEntry(line)).join('\n\n')
      if (usable(noEcho)) return noEcho
      if (typeof input.transcript === 'string' && usable(input.transcript)) return input.transcript
    }
    return full
  }

  if (!input.reused) return detach('new-session')
  const chain = input.chain
  if (!chain) return detach('no-chain')
  // 换了会话 / 换了账号 ⇒ 旧链的 message_id 在新会话里没有意义，只能当新会话的第一条。
  if (chain.sessionId !== input.sessionId) return detach('session-changed')
  if (chain.accountKey !== input.accountKey) return detach('account-changed')
  // 头变了 ⇒ 新头从没发过，必须整份重发（这条**不能**省头）
  if (chain.head !== head) return replay('head-changed')
  // ⚠️ 这里曾经是 `isStrictPrefix`。它会被**每条**被改写的运行时注入打穿（DSH 每轮都改），
  // 于是链式投喂在真机上"每轮都重开"—— 见 canExtendChain 的注释。
  // 头这一行已经确认两者相同 ⇒ 下面这条只可能是"历史没按预期追加"。
  // 既然链还在，就只发**从分歧点起**那些服务端没见过的条目（见 replayPrompt 的说明）。
  if (!canExtendChain(chain.entries, entries)) {
    return replay('not-appended', { headUnchanged: true, from: firstDifference(chain.entries, entries) })
```

</details>

#### 缺口

- 无图重发的服务端触发频率与模型误答影响未复现。
  **影响**：不能给出错误率，但必需图片任务不能在此降级后按成功放行。
  **进一步探讨**：隔离环境注入两次图片引用拒绝，核对最终ref_file_ids、标记、用户notice和任务验收结果。
- 远端链压缩后是否仍保留关键约束和协议未知。
  **影响**：本地增量正确不等于最终模型上下文齐备。
  **进一步探讨**：同一组约束与长会话比较full和chained，核对必要事实、工具实执行及总请求成本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 凭据、账号轮换与远端会话删除由谁负责？

**研究主题**：工程质量与复用、依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

账号库用稳定本地ID与服务端校验身份归并；写Auth会把该账号设为当前，迟到探活只更新仍存在且token匹配的记录，避免把删除账号复活或切回旧号。自动切号在请求闸门之前检查候选、限流窗口和冷却，并探活失败候选；这只管理本插件调度，不保证账号可用，也不能约束其他客户端同账号并发。

凭据以JSON原文保存，临时文件创建为0600并rename，非Windows再chmod；这是文件权限和替换保护，不是密钥加密或操作系统凭据保险库。导出包含完整token和cookie，既可写到插件目录只回路径，也可通过export-json响应交给渲染进程。prefix API handler本身未见逐路由鉴权，作者注释依赖DSH同源守卫，本轮没有核实宿主webServer部署保护，故只适用于受信本地单用户研究条件，不能据“localhost”描述宣称远程或多租户安全。

logout删除当前账号并清当前指针，不自动切到其他账号，同时清独立浏览器profile和Electron分区，返回清理结果；库中其他账号和既有导出文件不是退出当前账号就全删。卸载关闭窗口并尽力清理浏览器、排队flush，但明确保留凭据，不等于登出。

远端会话按账号记录journal，删除响应接受才发deleted销账；切keep则发abandoned，表示主动不删，不能与确认远端不存在混同。批量删除以同token且无业务错误响应视为整批成功，不逐个回读；网络失败返回false，journal保留供后续。卸载flush不await，进程退出时不能声称远端已删干净。日志中“已清理N”也不能覆盖逐项真实响应。凭据导出、浏览器profile、远端会话和本地台账是不同生命周期，退出需要分别核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/auth.ts:120-123](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/auth.ts#L120-L123)

写Auth选择当前账号的语义。

```text
export function writeAuth(auth: WebAuth): void {
  const record = upsertAccount(auth)
  setActiveAccount(record.id)
}
```

**依据 2 · 源码核查**：[src/auth.ts:160-178](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/auth.ts#L160-L178)

迟到探活仅更新仍存在且token匹配记录。

<details>
<summary>查看原文（19行）</summary>

```text
export function refreshVerifiedIdentity(
  id: string,
  token: string,
  user: { id?: string; display?: string } | undefined,
): boolean {
  const record = readAccount(id)
  if (!record || record.token !== token) return false
  const display = typeof user?.display === 'string' && user.display ? user.display : undefined
  const serverId = typeof user?.id === 'string' && user.id ? user.id : undefined
  updateAccount(id, {
    ...(display || serverId
      ? { user: { ...record.user, ...(display ? { display } : {}), ...(serverId ? { id: serverId } : {}) } }
      : {}),
    ...(serverId ? { serverId } : {}),
    unverified: undefined,
    lastVerifiedAt: new Date().toISOString(),
    lastVerifyError: undefined,
  })
  return true
```

</details>

**依据 3 · 源码核查**：[src/index.ts:438-473](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/index.ts#L438-L473)

自动切号时机、候选与探活处理。

<details>
<summary>查看原文（36行）</summary>

```text
  async function maybeAutoSwitch(): Promise<void> {
    if (autoSwitching) return // 上一次还在探活，别叠加
    const minutes = gate.settings().autoSwitchMinutes ?? DEFAULT_AUTO_SWITCH_MINUTES
    if (!Number.isFinite(minutes) || minutes <= 0) return
    const accounts = listAccounts().filter((account) => !autoSwitchSkip.has(account.id))
    const decision = decideAutoSwitch({
      minutes,
      lastSwitchAt: lastAutoSwitchAt,
      now: Date.now(),
      accounts: accounts as SwitchableAccount[],
      currentId: activeAccountId(),
      // 内存里的限流时刻：既决定"当前账号该不该提前切走"，也用来排除同样刚被限流的号。
      throttledAt: throttleAt,
      // 限流那条的冷却用"上次**真的换过号**"的时刻 —— 不能传 lastAutoSwitchAt（它在启动时
      // 就等于启动时刻，会让每次重启后的一段时间里"限流也不换号"）。见 lastSwitchedAt 的注释。
      lastSwitchedAt,
    })
    if (decision.action !== 'switch') return
    autoSwitching = true
    try {
      const target = readAccount(decision.nextId)
      if (!target) return
      // 切之前先探活（照 /accounts/switch 的既有做法）：切到一个已失效的号，
      // 下一个请求必然 AUTH 失败 —— 等于白折腾一轮全量重发。
      const probed = await probeOnce(target, {
        info: (message) => logger.info?.(message),
        warn: (message) => logger.warn?.(message),
      })
      if (probed && !probed.ok) {
        autoSwitchSkip.add(decision.nextId)
        // 计时要推进：否则每个请求都会重挑一次，探活成了高频动作。
        lastAutoSwitchAt = Date.now()
        logger.warn?.(
          `deepseek-web: 自动切号跳过 ${decision.nextId}（探活未通过：${probed.error ?? '未知原因'}）`,
        )
        return
```

</details>

**依据 4 · 源码核查**：[src/accounts.ts:189-214](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/accounts.ts#L189-L214)

JSON原子替换和文件权限，不含加密。

<details>
<summary>查看原文（26行）</summary>

```text
/** 原子写（临时文件 + 替换），非 Windows 下收紧权限到 0600。 */
export function writeJsonAtomic(file: string, value: unknown): void {
  mkdirSync(join(file, '..'), { recursive: true })
  const tmp = `${file}.tmp-${process.pid}`
  // 临时文件从创建起就是 0600：它装的是**可完整登录的凭证**，
  // 旧写法先按默认权限（受 umask 影响，常见 0644）落地、事后再 chmod，中间有暴露窗口。
  writeFileSync(tmp, JSON.stringify(value, null, 2), { encoding: 'utf8', mode: 0o600 })
  // ⚠️ F02（2026-09-12 审计）：旧写法是「先 rmSync 目标文件，再 rename 过去」——
  // 一旦 rename 失败（磁盘满 / 占用 / 权限），**原文件已经没了**，凭证直接丢失。
  // 而在 Windows 上 `fs.renameSync` 本来就能直接覆盖已存在的目标文件
  // （实测 win32 + Node 22：renameSync 成功覆盖，目标变新内容，临时文件消失），
  // 所以那句 rmSync 既没必要、也是唯一的丢数据风险点。去掉之后：
  // rename 失败 → 清掉临时文件 → 原文件完好无损。
  try {
    renameSync(tmp, file)
  } catch (error) {
    try {
      rmSync(tmp, { force: true })
    } catch {}
    throw error
  }
  if (process.platform !== 'win32') {
    try {
      chmodSync(file, 0o600)
    } catch {}
  }
```

</details>

**依据 5 · 源码核查**：[src/accounts.ts:466-485](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/accounts.ts#L466-L485)

导出包含全账号凭据并可写本地文件。

<details>
<summary>查看原文（20行）</summary>

```text
export function exportAccounts(): { version: number; exportedAt: string; warning: string; accounts: AccountRecord[] } {
  return {
    version: INDEX_VERSION,
    exportedAt: new Date().toISOString(),
    warning: '此文件含可完整登录的凭证（token + cookie），等同于账号本身，请勿分享或提交到仓库',
    accounts: listAccounts(),
  }
}

/**
 * 导出到**插件目录下的文件**并返回路径（`<web-login>/exports/accounts-<时间戳>.json`）。
 *
 * 这是回退路径：界面拿不到系统「另存为」（宿主未注入 File System Access、
 * 或弹框被平台拒绝）时用它，保证导出功能永不失效。
 * 优点是明文凭证不进 HTTP 响应体，只把**路径**回给界面。
 */
export function exportAccountsToFile(): { path: string; count: number } {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const file = join(webLoginDir(), 'exports', `accounts-${stamp}.json`)
  writeJsonAtomic(file, exportAccounts())
```

</details>

**依据 6 · 源码核查**：[src/index.ts:934-941](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/index.ts#L934-L941)

prefix API直接分派，未在此段建立独立鉴权。

```text
      ctx.webServer.register({
        kind: 'prefix',
        path: API_PREFIX,
        handler: async (req: any, res: any) => {
          const url = new URL(String(req.url ?? '/'), 'http://127.0.0.1')
          const route = url.pathname.slice(API_PREFIX.length) || '/'

          try {
```

**依据 7 · 源码核查**：[src/index.ts:1388-1403](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/index.ts#L1388-L1403)

export-json把明文交渲染层，注释中的守卫属于依赖。

<details>
<summary>查看原文（16行）</summary>

```text
            // 首选路径：界面弹系统「另存为」让用户自己选位置与文件名，然后把内容写进去。
            //
            // ⚠️ 这一条会把**明文凭证**交给渲染进程（本机回环 + DSH 同源守卫）。
            // 为什么躲不开：要"让用户选保存位置"，只有渲染进程能弹系统对话框；
            // 而写盘必须由拿到那份数据的一方做。反过来"宿主只收一个路径"做不到 ——
            // File System Access 只给 FileSystemFileHandle、不暴露路径，宿主无从代写。
            // 权衡后接受：能读到这个响应的，本来就以本机同用户进程为主，
            // 而插件宿主自身有完整 fs 权限、直接读账号文件更省事，边际风险接近于零。
            // 不接受的场景也有出口：/accounts/export（上面那条）始终保留，凭证不出宿主。
            if (req.method === 'POST' && route === '/accounts/export-json') {
              try {
                sendJson(res, 200, { ok: true, ...exportAccounts() })
              } catch (error: any) {
                sendJson(res, 500, { ok: false, error: `导出失败：${error?.message ?? error}` })
              }
              return
```

</details>

**依据 8 · 源码核查**：[src/login.ts:919-942](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/login.ts#L919-L942)

登出同时清浏览器状态并返回实际清理结果。

<details>
<summary>查看原文（24行）</summary>

```text
export async function logout(): Promise<boolean> {
  closeLoginWindow()
  clearAuth()
  // 浏览器登录用的独立 profile 也是一个「登录态存放处」，退出要一起清 ——
  // 否则再点登录会直接复用里面的登录态，等于没退出。
  const browserProfileCleared = clearBrowserLoginProfile()
  // ⚠️ 必须 await：调用方（面板的「退出并登录其它账号」）紧接着就会打开登录窗口，
  // 分区没清完的话新窗口会带着旧账号的 cookie 打开 → 又登录回同一个账号。
  const partitionCleared = await clearLoginPartition().catch(() => false)
  // 0.1.84（R7）：不能用 || 掩盖 —— profile 没清 = 浏览器里还留着登录态，下次「浏览器窗口登录」
  // 会直接复用旧登录态（等于没退出，上面注释自己写了这个后果）。
  // 分区维度只在「环境真有 Electron」时才考核：桌面外环境没有分区可清，不该拖后腿。
  const partitionOK = partitionCleared || !electronAvailable()
  const cleared = browserProfileCleared && partitionOK
  lastResult = {
    ok: true,
    message: cleared
      ? '已退出登录：本地凭证与浏览器登录态都已清除'
      : !browserProfileCleared
        ? '已退出登录：本地凭证已清除，但**浏览器登录态未清掉**（浏览器窗口还开着或进程残留）——下次「浏览器窗口登录」会直接复用旧登录态，相当于没退出；请关掉浏览器后重试'
        : '已退出登录：本地凭证已清除（浏览器分区清理失败，登录窗口可能仍是旧账号，请手动退出网页端）',
    at: new Date().toISOString(),
  }
  return cleared
```

</details>

**依据 9 · 源码核查**：[src/auth.ts:181-191](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/auth.ts#L181-L191)

只移除当前账号，不自动用其他账号。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * 退出登录：把当前账号从库里**移除**（并清掉当前指针）。
 *
 * 库里还有其它账号时**刻意不自动切换**：自动换号会让人以为"我只是登出了，
 * 怎么又用上另一个号了"。界面会提示"账号库里还有 N 个，点「切换」即可使用"，
 * 由人明确选择。
 */
export function clearAuth(): void {
  const active = activeAccount()
  if (active) removeAccount(active.id)
  clearActiveAccount()
```

</details>

**依据 10 · 源码核查**：[src/index.ts:728-758](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/index.ts#L728-L758)

deleted/abandoned销账及按账号补删。

<details>
<summary>查看原文（31行）</summary>

```text
  setSessionLifecycleHook((event) => {
    // ⚠️ 销账（deleted / abandoned）必须放在 journalEnabled 判断**之前**：
    // keep 模式下 journalEnabled 为 false（不再记新账），但用户切成「不删」时
    // 要把**既有**的欠账摘掉 —— 否则下次启动在别的模式下补扫，又会删掉这些会话。
    if (event.kind === 'deleted' || event.kind === 'abandoned') {
      removeJournalEntry(event.sessionId)
      return
    }
    if (!journalEnabled) return
    const accountId = accountIdOfAuth(event.auth)
    if (!accountId) return
    upsertJournalEntry({
      accountId,
      sessionId: event.sessionId,
      state: event.kind === 'queued' ? 'queued' : 'slot',
    })
  })

  // 启动补删：上次退出遗留的（含被强杀的）会话，按账号排进清理器。
  if (journalEnabled) {
    try {
      runStartupSweep({
        ownPid: process.pid,
        accountExists: (id) => readAccount(id) !== undefined,
        deleteEnabled: adapterConfig.deleteWebSessions !== false,
        mode: cleanupMode,
        onSweep: (entry) => {
          const account = readAccount(entry.accountId)
          if (!account) throw new Error('账号已不在账号库里')
          sessionCleaner.schedule(account, entry.sessionId)
        },
```

</details>

**依据 11 · 源码核查**：[src/webapi.ts:1096-1112](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/webapi.ts#L1096-L1112)

同账号批量删除按服务响应确认，不逐个回读。

<details>
<summary>查看原文（17行）</summary>

```text
    const firstToken = batch[0].auth?.token
    const sameAccount = batch.every((item) => item.auth?.token === firstToken)
    if (batch.length > 1 && !batchUnsupported && sameAccount) {
      try {
        const resp = await doFetch(`${DS_BASE}/api/v0/chat_session/delete`, {
          method: 'POST',
          headers: buildDsHeaders(batch[0].auth),
          body: JSON.stringify({ chat_session_ids: batch.map((b) => b.sessionId) }),
          signal: AbortSignal.timeout(15_000),
        })
        const verdict = await classifyDeleteResp(resp)
        if (verdict === 'ok') {
          // 批量删只发一个请求，服务端接受即认为这一批都删掉了（它不逐个回报）。
          // 所以只对"同账号 + 无业务错误"的批次这样处理 —— 见上面的 F07 说明。
          for (const item of batch) emitSessionLifecycle({ kind: 'deleted', sessionId: item.sessionId })
          logger?.debug?.(`deepseek-web: 已批量清理 ${batch.length} 个临时会话（只用了 1 个请求）`)
          return
```

</details>

**依据 12 · 源码核查**：[src/index.ts:2011-2033](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/index.ts#L2011-L2033)

卸载不清凭据、flush尽力且不等网络。

<details>
<summary>查看原文（23行）</summary>

```text
  // 3) 卸载即净：关登录窗口与定时器；**退出时把欠删的会话交出去**。不清理凭证 ——
  //    卸载/热重载插件不等于登出。
  ctx.effect(() => () => {
    try {
      if (isLoginWindowOpen()) closeLoginWindow()
    } catch {}
    // 2026-09-14：退出收尾。顺序很重要 ——
    //   ① `disposeSessionReuse()` 把复用槽里的会话**交回它自己的清理回调**（排队待删）。
    //      只清槽不排队 = 每次退出白丢一个会话（实测就是这么堆起来的）。
    //   ② `flush()` 尽力把队列里的删掉（同步返回，不等网络完成 —— 宿主的卸载流程
    //      不会为一个网络请求停留）。
    // 于是删不掉的仍会留在 `session-journal` 的记录里（记录只在**确认删掉**时摘除），
    // 下次启动的补删会接上。被强杀时同理。
    try {
      disposeSessionReuse()
    } catch {}
    try {
      void sessionCleaner.flush()
    } catch {}
    try {
      void shutdownBrowserTransport()
    } catch {}
  }, 'dsh-deepseek-web-login: teardown')
```

</details>

#### 缺口

- 目标宿主对prefix管理API的实际鉴权和跨来源约束未核实。
  **影响**：不能用于共享或公网接入时的安全保证。
  **进一步探讨**：先定向检查目标宿主请求拒绝机制，并在隔离环境验证未登录、跨来源及鉴权故障；勿用真实凭据测试。
- 删除响应与远端实际会话列表的一致性未验证。
  **影响**：销账只证明协议判据接受，不能保证所有远端副本消失。
  **进一步探讨**：用非敏感测试会话核对失败、keep、卸载重启后远端列表及本地journal。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 是否值得采用，怎样衡量完整成本并验证新恢复契约？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

当前建议观察。已有网页账号且愿意承担非官方协议维护的个人操作者可以研究其适配设计，但图片必需任务的降级不一致、远端链与凭据/删除边界使本轮不建议据源码直接替换已验证供应商。后续应以非敏感只读任务为起点，逐项核输入齐备、工具实际执行及结果正确，而非使用会发消息、交易或改正式文件的任务测试协议可靠性。遇图片未送达、未知工具、协议文字代替执行、链首约束遗漏、账号或清理不明，停止当前任务并回正式供应商或人工处理。

现金成本含网页服务实际访问条件、浏览器计算和网络、可能回退供应商；人工成本含登录重登、私有接口适配、权限检查、错误输入复核和清理。具体额度、金额、请求量和耗时无本次实测，网页“免费”不等于总成本为0；usage也含估算逻辑，不能把它直接当官方计费或真实节费证明。成本对照应计算同批任务全部尝试、失败重试、上传、人工修正与最终合格数，不只记录一次成功正文。

未验证设计假设是把“输入齐备、工具已执行、结果已核对、远端清理确认/保留/未知”作为独立任务状态，图片缺失时由任务策略显式选择停止或转纯文本，而非适配器替用户决定后仍发附图标记。相对现有notice、调用台账和journal，增量是跨层验收契约，不是再加日志。最小对照使用相同只读任务注入两次图片拒绝、未知工具、链约束被丢和删除超时；比较当前机制与契约原型的假完成率、合格交付、人工复核和请求量。若状态层不能减少错误放行，或维护成本长期高于正式替代，就应否定。此方案未实现、不算已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.ts:1249-1274](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/adapter.ts#L1249-L1274)

恢复分支会改变图片输入，是任务级契约的直接依据。

<details>
<summary>查看原文（26行）</summary>

```text
    // `__skipImages`（降级重试的第二级）：连着两次都不被认，就**不带图**再发一次。
    // 宁可这一轮没有图，也不能让会话卡在"每轮都失败"上 —— 那等于整个会话作废。
    const uploaded =
      options?.__skipImages === true
        ? { ids: [], keys: undefined, keptKeys: undefined, notice: undefined }
        : await uploadRequestImages(auth, options?.messages, options?.signal)
    // ⚠️ 0.1.82：`__skipImages`（不带图重发）**绝不能**更新 lastImageKeys ——
    // 它记的是"上一轮那批 key 的 file_id 被服务端拒过"，抹成空集就等于下一轮
    // 又从中毒缓存出发，重演"2 次注定被拒 + 1 次无图"。
    if (uploaded.keptKeys) lastImageKeys = uploaded.keptKeys
    const refFileIds = uploaded.ids

    // 链式投喂需要 prompt 的**结构**（固定头 + 未截断的历史条目）才能算增量，
    // 所以这里取 parts、下面的 params 一起把 entries 传下去（见 context-feed.ts）。
    let promptParts = serializePromptParts({
      system: options?.system,
      messages: options?.messages ?? [],
      tools: (options?.tools ?? []) as ToolSchemaLike[],
      maxChars: deps.config.maxPromptChars ?? DEFAULT_MAX_PROMPT_CHARS,
      // 「一次一个工具」开关：只换协议指令那一段，其余 prompt 结构不变（**缺省＝串行**）。
      serialToolCalls: deps.config.serialToolCalls !== false,
      // 只对**首轮**传：它才是真正带 ref_file_ids 的那一次（续写轮 refFileIds 传空）。
      // 传了之后，被长度控制略过的图会写成 `[earlier image omitted]` 而不是 `[image attached]`
      // —— 标记与实发必须一致，否则模型会对着没送出去的图瞎猜。
      keptImageKeys: uploaded.keptKeys,
    })
```

</details>

**依据 2 · 源码核查**：[src/adapter.ts:1730-1744](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/adapter.ts#L1730-L1744)

用量含估算分支、工具finish只代表交出调用。

<details>
<summary>查看原文（15行）</summary>

```text
        inputTokens += round.total - output
      } else {
        serverTotal = false
        outputTokens += estimateOutput
        inputTokens += estimateTokens(round.prompt)
      }
    }
    yield { type: 'usage', usage: { inputTokens, outputTokens, serverTotal,
      ...(reasoningBlock ? { reasoningTokens: Math.min(outputTokens, estimateTokens(reasoningBlock.text)) } : {}) } }

    if (toolCallCount > 0) {
      // 🔴 0.6.39：留痕"这批调用是不是围栏包裹的"（`callShape` 由 `emitCalls` 累加得出）。
      // ⚠️ `undefined` = 本轮没有调用（区别于 'bare'：那是"没听话但执行了"）。
      noteCallShape(callShape ?? 'none', logger)
      yield { type: 'finish', reason: { kind: 'tool-calls' }, callShape }
```

</details>

**依据 3 · 源码核查**：[src/protocol.ts:2256-2265](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/protocol.ts#L2256-L2265)

未知工具需执行器报错，解析不等权限与成功。

<details>
<summary>查看原文（10行）</summary>

```text
export class ToolCallStreamFilter {
  private pending = ''
  private capture: { mode: 'json' | 'xml'; buffer: string } | null = null
  private abandoned: { raw: string; mode: 'json' | 'xml'; reason?: 'unbalanced' | 'unparsable' | 'oversize' | 'echo' } | null = null
  /**
   * ⚠️ **只存不用**（故意的）：历史参数，保留签名以免调用点大改。
   *
   * 不拿它过滤解析出的调用 —— 模型调一个没声明过的工具时，把调用丢掉会让**整轮输出变空**
   * （客户端只看到"模型未返回正文或工具调用"），比让客户端报「未知工具」糟糕得多。
   * 真要收紧工具集，应该在执行器那一层报错，不是在这里静默丢弃。
```

</details>

**依据 4 · 源码核查**：[src/index.ts:2011-2028](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/index.ts#L2011-L2028)

卸载清理尽力而非确认完成。

<details>
<summary>查看原文（18行）</summary>

```text
  // 3) 卸载即净：关登录窗口与定时器；**退出时把欠删的会话交出去**。不清理凭证 ——
  //    卸载/热重载插件不等于登出。
  ctx.effect(() => () => {
    try {
      if (isLoginWindowOpen()) closeLoginWindow()
    } catch {}
    // 2026-09-14：退出收尾。顺序很重要 ——
    //   ① `disposeSessionReuse()` 把复用槽里的会话**交回它自己的清理回调**（排队待删）。
    //      只清槽不排队 = 每次退出白丢一个会话（实测就是这么堆起来的）。
    //   ② `flush()` 尽力把队列里的删掉（同步返回，不等网络完成 —— 宿主的卸载流程
    //      不会为一个网络请求停留）。
    // 于是删不掉的仍会留在 `session-journal` 的记录里（记录只在**确认删掉**时摘除），
    // 下次启动的补删会接上。被强杀时同理。
    try {
      disposeSessionReuse()
    } catch {}
    try {
      void sessionCleaner.flush()
```

</details>

**依据 5 · 源码核查**：[src/accounts.ts:466-471](https://github.com/cv-superding/dsh-deepseek-web-login/blob/817a1a2d3eca187f9254795d52ffe4d131498828/src/accounts.ts#L466-L471)

全凭据导出说明真实退出负担。

```text
export function exportAccounts(): { version: number; exportedAt: string; warning: string; accounts: AccountRecord[] } {
  return {
    version: INDEX_VERSION,
    exportedAt: new Date().toISOString(),
    warning: '此文件含可完整登录的凭证（token + cookie），等同于账号本身，请勿分享或提交到仓库',
    accounts: listAccounts(),
```

#### 缺口

- 任务级恢复契约是否减少假完成、是否值得维护未知。
  **影响**：不能把研究者设计当当前插件已支持的可靠性。
  **进一步探讨**：用本题预置失败对照，事前定义正确放行、人工分钟数及总请求停止线。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
