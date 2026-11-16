# dsh-notifier

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[62d5343](https://github.com/wingsky-1/dsh-plugin-hub/tree/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wingsky-1/dsh-plugin-hub) [![npm 30d 2,770](https://img.shields.io/static/v1?label=npm+30d&message=2%2C770&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wingsky-1/dsh-notifier) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wingsky-1/dsh-notifier)
<!-- END META -->

> **功能**：为 DSH 提供跨会话实时通知中心与通知 SDK。

> **亮点**：宿主通知服务把跨会话事件和其他组件的发布接到同一浏览器出口。固定版本给每帧编号，支持按 since 补读保留事件，并在退出 Peer 时注销和销毁对应响应。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

> **主要限制**：非回环通知流依赖宿主提供有效 Peer。浏览器系统通知还要求安全上下文和用户授权；即使 SSE 收到了事件，也需检查前端过滤、来源与实际显示。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 它面向什么通知任务，相对只看当前会话增加什么？](#detail-section-11)
  - [Q02 · 事件如何转成通知并到浏览器？需要哪些宿主服务？](#detail-section-12)
  - [Q03 · 远程访问鉴权、SSE 生命周期和通知噪音边界是什么？](#detail-section-13)
  - [Q04 · 哪些用户适合采用，如何权衡维护与失败成本？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要在 DSH Web 中关注多个 session/agent 事件的用户和兄弟插件开发者。它提供通知服务/SDK、中心与浏览器推送通道，扩展了单会话视图之外的事件汇聚；是否减少漏看取决于通知分类、用户配置和频率，通知数量本身不是有用结果。

分别打开各会话可直接核对任务结果，也可由用户手动轮询。通知中心把已接入事件汇总，比较时以发现已知目标事件的延迟、重复和来源可查性为准。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件与边界 |
| --- | --- | --- |
| 会话事件通知 | 将已接入的任务事件送到通知中心 | 受生产方和已配置订阅约束 |
| SDK 发布入口 | 让宿主内其他组件发布通知 | 调用方必须按契约接线 |
| 浏览器 SSE 与重播 | 接收通知并按序号补读保留帧 | 需可用连接，非回环要取得获准 Peer |
| 浏览器系统通知 | 离开会话时仍能看到提示 | Notification API、安全上下文与用户许可 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH webServer、settings 与事件生产方 | 加载通知设置、事件钩子与浏览器出口 | 只覆盖已接入的生产者与事件 |
| 宿主 Connection 与 Peer | 允许非回环访问通知接口及状态流 | 缺准入能力、抛错或 Peer 绑定失败时拒绝 |
| 支持 Notification 的安全浏览器环境 | 收到系统通知 | 浏览器拒权或不安全上下文时核对站内提示 |

| 阶段 | 操作 | 异常与退出 |
| --- | --- | --- |
| 订阅 | 回环单用户只连接一个测试客户端，发一项带标记会话事件 | 无通知时区分生产方、设置与权限 |
| 补连 | 用时间与序号对照事件，到断线后重连复查是否重复 | 只对已保留的数据帧核对重播 |
| 退出 | 退订并停用组件，确认原连接停止收帧 | 若确认有跨设备用途，再单独验证 HTTPS 和 Peer 撤销 |

**效果与成本**

| 阶段 | 现金与资源 | 人工投入 | 未知 |
| --- | --- | --- | --- |
| 启用 | 依托现有 DSH 与浏览器 | 配置通知权限和必要的事件来源 | 无真实环境配置工时 |
| 持续 | 保持 SSE 及兼容浏览器通知 | 管理事件范围、阈值和噪音 | 没有漏看次数或时间对照 |
| 恢复 | 断线重连可能触发保留帧重播 | 核对重复或遗漏，确认旧订阅解绑 | 真实多设备延迟、重连和后台行为未知 |

| 效果项 | 当前源码可支持 | 未验证项 |
| --- | --- | --- |
| 少切换会话 | 统一发布和浏览器通知中心能承载选定事件 | 是否降低漏看、重复和误报警未测 |
| 断线后核对已收记录 | 命名事件配序号与 since 重播 | 跨浏览器的恢复行为未验收 |

> **思考**：非回环通知流依赖宿主提供有效 Peer。浏览器系统通知还要求安全上下文和用户授权；即使 SSE 收到了事件，也需检查前端过滤、来源与实际显示。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：宿主通知服务把跨会话事件和其他组件的发布接到同一浏览器出口。固定版本给每帧编号，支持按 since 补读保留事件，并在退出 Peer 时注销和销毁对应响应。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

短请求逐次从 Connection 获取准入，事件流另绑 Peer effect。流式模块负责把内部通知翻译成线协议、编号、回放与分发。主动注销从 hub 出表再销毁 HTTP 响应，不能用有连接等同于系统弹出通知。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

非回环通知流依赖宿主提供有效 Peer。浏览器系统通知还要求安全上下文和用户授权；即使 SSE 收到了事件，也需检查前端过滤、来源与实际显示。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在回环单用户环境，只订阅一个带标记的测试会话事件。核对浏览器权限、重连与退订。若来源不明确、重复无法解释或退订后仍接到新事件，就停用并直接查看会话。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码核实了通知发布、序号重播及官方 Connection 准入。系统弹窗、跨设备撤销、重播效果和通知噪音尚未实测。

- 已检查：作者 README、包清单、源码路径 packages/dsh-notifier/README.md、packages/dsh-notifier/src/index.ts、packages/dsh-notifier/src/server/api/impl/route/index.ts、packages/dsh-notifier/src/server/api/impl/stream/index.ts、shared/host-utils.ts、packages/dsh-notifier/src/client/index.tsx、shared/sse-hub.ts 及固定范围 inventory；组件：packages/dsh-notifier。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 wingsky-1/dsh-plugin-hub packages/dsh-notifier 的固定提交、README/manifest、入口和直接调用的关键模块；未安装或执行目标插件、宿主、浏览器、模型/API或第三方服务。
- 下一步：在回环 profile 给两个测试会话分别生成唯一事件，比较生产标记、通知中心和浏览器回执。断开后按序号重连，测试重复率。撤销测试权限或关闭组件后再发布一条，核对旧连接与页面均无新增通知。[Q04](#research-q04)

**分析版本**

- **仓库**：[wingsky-1/dsh-plugin-hub](https://github.com/wingsky-1/dsh-plugin-hub)
- **版本号**：0.2.11（[固定提交 62d5343](https://github.com/wingsky-1/dsh-plugin-hub/tree/62d5343c0021d115e350875157f6b33a23072d28)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

给并行会话只订阅少量可追溯事件，可能减少轮流查会话又避免全局噪音。与逐个查看对照两个已知事件，记录遗漏、重复、到达时长以及重连后可识别性。若误报增加或目标事件仍漏看，缩小订阅或回到逐会话读取。[Q04](#research-q04)

在回环 profile 给两个测试会话分别生成唯一事件，比较生产标记、通知中心和浏览器回执。断开后按序号重连，测试重复率。撤销测试权限或关闭组件后再发布一条，核对旧连接与页面均无新增通知。[Q04](#research-q04)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 1810 | — | — | 32201 |
| .ts | source | 137 | 16792 | 10458 | 5046 | — |
| .tsx | source | 14 | 4379 | 3380 | 862 | — |
| .ts | test | 123 | 30446 | 23585 | 4119 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-16），可前往 [GitHub Issues](https://github.com/wingsky-1/dsh-plugin-hub/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：通知中心如何汇聚跨会话事件并提供安全的 Web/SSE 推送，何时能减少漏看而不引入越权或噪音？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它面向什么通知任务，相对只看当前会话增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要在 DSH Web 中关注多个 session/agent 事件的用户和兄弟插件开发者。它提供通知服务/SDK、中心与浏览器推送通道，扩展了单会话视图之外的事件汇聚；是否减少漏看取决于通知分类、用户配置和频率，通知数量本身不是有用结果。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-notifier/README.md:1-60](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/README.md#L1-L60)

说明通知中心功能和访问形态。

<details>
<summary>查看原文（60行）</summary>

````text
# @wingsky-1/dsh-notifier
[![npm](https://img.shields.io/npm/v/@wingsky-1/dsh-notifier)](https://www.npmjs.com/package/@wingsky-1/dsh-notifier)
[![GitHub Releases](https://img.shields.io/github/v/release/wingsky-1/dsh-plugin-hub)](https://github.com/wingsky-1/dsh-plugin-hub/releases)

审批/完成/错误事件通知：人不在浏览器前也能收到提醒。

**简体中文** | [English](README.en.md)

## 一键安装

```sh
dsh plugin --profile web add @wingsky-1/dsh-notifier
```

> 安装 / 卸载 / 更新后都需**重启一次** `dsh web`（bundle 层只在启动时组合）生效。

## 快速导航

[使用前须知](#使用前须知) · [部署与访问](#部署与访问方式重要) · [最短上手](#最短上手) · [常用配置](#常用配置) · [验证与排障](#验证与排障) · [详细参考](#详细参考) · [开发与架构](#开发与架构)

<a id="使用前须知"></a><a id="user-content-使用前须知"></a>
## 使用前须知

前提：已安装 DeepSeek Harness 且 `dsh web` 可正常启动（未全局安装 dsh 见下方「未全局安装 dsh」）。

<a id="部署与访问方式重要"></a><a id="user-content-部署与访问方式重要"></a>
## 部署与访问方式（重要）

插件接口保留本机 loopback 快路径。从局域网地址直连时，请求还必须通过官方
`dsh-client-connection` 的 Host/Origin/cross-site 围栏以及浏览器或 API 会话认证；
未认证请求返回 401/403，认证失败不会被插件自行放行。HTTP LAN 仍不属于浏览器安全
上下文，系统通知会走降级通道，移动端 PWA 系统通知应使用原生 HTTPS。

请选用下列任一形态访问（均在设置卡片与 README 中给出提示）：

| 形态 | 访问方式 | 说明 |
|---|---|---|
| 本机桌面 | `http://127.0.0.1:3080` | 安全上下文：浏览器通知 + 系统通知均可用 |
| 局域网 HTTPS（推荐） | `dsh web` 绑定具体 LAN 地址并配置 TLS 后的同源地址 | 官方认证 + 安全上下文；移动端「添加到主屏幕」后可获 PWA 级通知 |
| 隧道 | `ssh -L 3080:127.0.0.1:3080 <服务器>` 后访问本机地址 | 回环 + 安全上下文，效果同本机 |

<a id="安全与边界"></a><a id="user-content-安全与边界"></a>
## 安全模型

- **LAN 管理面复用官方会话认证**：loopback 保持原有快路径；非回环请求每次现读
  `ctx.connection` 并调用 `requestRejection`，由官方校验 Host、Origin、cross-site、
  浏览器 cookie 或 live API peer。401/403 保持原状态，认证通过后才进入方法判定；
  connection 缺失、卸载或异常一律拒绝。插件不信任 LAN 私网、TLS、`X-Forwarded-For`
  或客户端自报来源。
- **非回环 SSE 绑定 admitted Peer 生命周期**：普通请求仍走最小
  `requestRejection` seam；`/events` 在写 200 与注册连接表前调用官方
  `connection.admit` 并保留公开 PeerScope。Peer 释放或 connection 卸载时经
  `peer.ctx.effect` 回调和 `SseHub.unregister` 同步出表、停止心跳处理并关闭响应；
  API socket 释放后的下一次请求不能复用旧 admission。loopback SSE 不调用官方
  Peer admission，保持既有插件生命周期。
- 通知文本只含任务标题/工具名/申请理由等元信息，**不含工具参数**（防敏感信息外泄）
- **通知正文与标题不再打码（#733 收敛）**：原 `sanitizeContent` 的规则表（路径 / PEM 私钥 / 连接串凭据 / 令牌 / 邮箱…）已删除——通知、历史落盘（含 suppressed 落史）与投递都是原文；正文不截断，长度由投递频道的展示上限截断。需要「日志里不出现某类文本」的部署，请自行在事件源侧处理
- **仅存的凭据掩码在设置页视图**：`GET /config` 的 `user` + `effective` 与 `PUT` 成功响应中的频道凭据（bark `deviceKey`、webhook `token` / `password` / `headerValue`）一律掩码 `********`，提交整值掩码 = 保持原值（按实例 id 对齐回填，防数组序变化串凭据），**没有原值可还原的掩码（新实例、换型残留的跨 type 掩码）写面 400，dry-run 同一句——占位符不是凭据，绝不落盘**（`CHANNEL_SECRET_FIELDS` 按频道类型单一事实源）
- **出口错误原因不再做凭据字面替换（实测风险，照实登记）**：Bark 4xx 响应体会回显 device key，webhook 的非 2xx 响应体也会回显收到的凭据——失败原因只做长度截断（webhook 响应体 200 字符；状态条目 300 字符），**不保证凭据不出现在错误文本里**。这些文本落在失败理由的 `detail` 字段里（0.2.4 起理由结构化，见「投递可靠性」），会进服务端日志、状态文件（`status.json`）与通知历史（`history.jsonl`），并随 `GET /status` 与 `GET /history` 出到设置页；对错误文本外泄敏感的部署请按上一条自行处置
- **频道身份（`id`）唯一，含跨类型**（#1016）：同一个身份挂两条频道不是「界面显示重复」，而是**凭据销毁**——设置页对 `channels` 是整组提交，合并按裸 `id` 取首条、其余键沿用首条的值，于是第二条的真实凭据（bark `deviceKey`、webhook 凭据）被第一条覆盖，**每次保存毁一条**。跨类型同 `id` 更糟：掩码还原按裸 `id` 查找，一条 bark 写 `id: "browser"` 会命中内置 browser 条目，把它的掩码还原到 bark 的键上。写面因此对重复身份**绝对 400**（提示带 1 起的下标并指明「删掉其中一条」）；升级步**不再**按重复身份静默去重（那会在升级那一刻把第二条连凭据一起从磁盘删掉）；投递投影按身份只取首项，免得一次通知发两遍——**代价是落选的那条从此不再投递**，且占身份的是「数组里排在前面的那条」而非「能用的那条」：投递必需键为空串的半坏条目会先占掉身份，把后面一条健康的同 `id` 条目从投递池里挤掉（半坏条目本身则整条不进投递池）。**没有任何一条路径会隐藏或删除你的数据**：视图原样外发，删掉一张卡再保存即通过
````

</details>

**依据 2 · 源码核查**：[packages/dsh-notifier/src/index.ts:52-68](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/src/index.ts#L52-L68)

声明插件名、必需服务和总开关配置。

<details>
<summary>查看原文（17行）</summary>

```text
/** 稳定的 cordis 插件名。 */
export const name = "notifier";

/**
 * 依赖的宿主服务。`settings` 是**必需**依赖而不是可选探测：0.2.3 把配置存在它那里，装配期要读一次存量。
 * 声明成依赖之后，宿主保证服务就绪才装配本插件——顺序由框架保证，比「先试一次、再监听晚到的」可靠。
 */
export const inject = ["webServer", SETTINGS_SERVICE];

/**
 * 组合层入口配置（插件挂载点传入）。只有总开关：设置项全部住在本插件自己的配置文件里，
 * 这里再开一层默认值只会让人以为某处配过什么，而它永远是空的。
 */
export interface NotifierApplyConfig {
  /** 总开关；`false` 时一律不投递。不落盘、不进设置层。 */
  enabled?: boolean;
}
```

</details>

**依据 3 · 源码核查**：[packages/dsh-notifier/src/index.ts:88-105](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/src/index.ts#L88-L105)

通知订阅须显式 global，以跨 session/agent 接收事件。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * 宿主事件默认按 fiber 作用域过滤，通知插件必须看到所有会话与 agent，故每条订阅都要带它。
 * 漏掉的表现是「有些会话不通知」，且只在多会话下出现——单会话调试永远复现不了。
 */
const GLOBAL_LISTEN = { global: true } as const;

/**
 * 对外名字的声明合并。必须写在包入口：`declare module` 是全局增强，入口声明面不可达时
 * `lib/index.d.ts` 里就没有它（`pack:check` 的「声明合并可达性」判据盯这条）；键引用 sdk 域的
 * 常量，服务名只留一个物理定义——抄一份字面量同样能编译，改名漏改时只会在运行时的另一头暴露。
 */
declare module "@deepseek-ai/cordis" {
  interface Context {
    /** 通知中心服务面：兄弟插件经它登记自己的通知种类、发送通知。 */
    [sdkApi.NOTIFIER_SERVICE]: NotifierService;
  }
}

```

</details>

#### 缺口

- 没有多会话用户场景或漏通知基线。
  **影响**：无法判断提醒的实际价值/噪音
  **进一步探讨**：对真实但脱敏的 session 事件观察遗漏和重复率。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 事件如何转成通知并到浏览器？需要哪些宿主服务？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

插件 apply 依赖 webServer 与 settings，组装通知域、SDK 和帧总线；全局事件监听跨 session 接收，浏览器出口通过 SSE/连接服务发送帧。非回环管理请求走官方 connection 鉴权，Peer 生命周期关闭时注销连接。通知发送/订阅还依赖兄弟插件按服务契约接入。

短请求逐次读取 Connection 服务状态，路由先经过准入再分派方法。流式入口接到获准的 Peer 后把卸载回调登记到 Peer effect，连接断开反向注销。SSE 响应复播指定序号之后的保留帧，使补连客户端能识别已收到的事件。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-notifier/src/index.ts:53-60](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/src/index.ts#L53-L60)

声明名称及 webServer/settings 依赖。

```text
export const name = "notifier";

/**
 * 依赖的宿主服务。`settings` 是**必需**依赖而不是可选探测：0.2.3 把配置存在它那里，装配期要读一次存量。
 * 声明成依赖之后，宿主保证服务就绪才装配本插件——顺序由框架保证，比「先试一次、再监听晚到的」可靠。
 */
export const inject = ["webServer", SETTINGS_SERVICE];

```

**依据 2 · 源码核查**：[packages/dsh-notifier/src/index.ts:74-85](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/src/index.ts#L74-L85)

apply 装配并注册 disposer。

<details>
<summary>查看原文（12行）</summary>

```text
export async function apply(ctx: Context, config: NotifierApplyConfig = {}): Promise<void> {
  const host = bindHost(ctx);
  const stack = createDisposerStack();
  try {
    await assemble(host, config, stack);
  } finally {
    // 登记点留在采集之后：cordis 按 LIFO 释放 effect，提前登记会让整条栈在服务面已撤之后
    // 才释放各域（api 域在别人已放开的入参上继续服务）。用 finally 而不是顺序执行，是为了
    // 装配中途抛错时已采集的 teardown 也有释放点——原先那种「拿返回值去登记」的写法一抛错
    // 就整条链一个都没登记。
    stack.attach(ctx, "dsh-notifier");
  }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-notifier/src/index.ts:88-123](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/src/index.ts#L88-L123)

全局监听和帧总线订阅/退订。

<details>
<summary>查看原文（36行）</summary>

```text
/**
 * 宿主事件默认按 fiber 作用域过滤，通知插件必须看到所有会话与 agent，故每条订阅都要带它。
 * 漏掉的表现是「有些会话不通知」，且只在多会话下出现——单会话调试永远复现不了。
 */
const GLOBAL_LISTEN = { global: true } as const;

/**
 * 对外名字的声明合并。必须写在包入口：`declare module` 是全局增强，入口声明面不可达时
 * `lib/index.d.ts` 里就没有它（`pack:check` 的「声明合并可达性」判据盯这条）；键引用 sdk 域的
 * 常量，服务名只留一个物理定义——抄一份字面量同样能编译，改名漏改时只会在运行时的另一头暴露。
 */
declare module "@deepseek-ai/cordis" {
  interface Context {
    /** 通知中心服务面：兄弟插件经它登记自己的通知种类、发送通知。 */
    [sdkApi.NOTIFIER_SERVICE]: NotifierService;
  }
}

/**
 * 帧总线：生产端只给 `emit`（裁决管线），消费端只给 `onFrame`（浏览器出口），类型就是围栏。
 * 它是组合根的本地设施而不是宿主事件总线上的事件——总线上的名字是公共面，谁都能收发。
 * 遍历前先取快照：帧是 fire-and-forget 的旁路，回调里退订不该打断本轮其余订阅者。
 */
class FrameBus {
  private readonly handlers = new Set<(payload: OutgoingFrame) => void>();

  emit(payload: OutgoingFrame): void {
    for (const handler of [...this.handlers]) handler(payload);
  }

  onFrame(handler: (payload: OutgoingFrame) => void): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }
```

</details>

**依据 4 · 作者声明**：[packages/dsh-notifier/README.md:34-55](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/README.md#L34-L55)

说明 LAN HTTPS/tunnel 访问及安全上下文差异。

<details>
<summary>查看原文（22行）</summary>

```text
请选用下列任一形态访问（均在设置卡片与 README 中给出提示）：

| 形态 | 访问方式 | 说明 |
|---|---|---|
| 本机桌面 | `http://127.0.0.1:3080` | 安全上下文：浏览器通知 + 系统通知均可用 |
| 局域网 HTTPS（推荐） | `dsh web` 绑定具体 LAN 地址并配置 TLS 后的同源地址 | 官方认证 + 安全上下文；移动端「添加到主屏幕」后可获 PWA 级通知 |
| 隧道 | `ssh -L 3080:127.0.0.1:3080 <服务器>` 后访问本机地址 | 回环 + 安全上下文，效果同本机 |

<a id="安全与边界"></a><a id="user-content-安全与边界"></a>
## 安全模型

- **LAN 管理面复用官方会话认证**：loopback 保持原有快路径；非回环请求每次现读
  `ctx.connection` 并调用 `requestRejection`，由官方校验 Host、Origin、cross-site、
  浏览器 cookie 或 live API peer。401/403 保持原状态，认证通过后才进入方法判定；
  connection 缺失、卸载或异常一律拒绝。插件不信任 LAN 私网、TLS、`X-Forwarded-For`
  或客户端自报来源。
- **非回环 SSE 绑定 admitted Peer 生命周期**：普通请求仍走最小
  `requestRejection` seam；`/events` 在写 200 与注册连接表前调用官方
  `connection.admit` 并保留公开 PeerScope。Peer 释放或 connection 卸载时经
  `peer.ctx.effect` 回调和 `SseHub.unregister` 同步出表、停止心跳处理并关闭响应；
  API socket 释放后的下一次请求不能复用旧 admission。loopback SSE 不调用官方
  Peer admission，保持既有插件生命周期。
```

</details>

**依据 5 · 源码核查**：[packages/dsh-notifier/src/index.ts:165-174](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/src/index.ts#L165-L174)

短请求/长连接用不同的宿主接线。

<details>
<summary>查看原文（10行）</summary>

```text
  const remoteAdmission = liveConnectionAdmission(ctx);
  const remotePeerAdmission = liveConnectionPeerAdmission(ctx);

  return {
    logger: ctx.logger,
    remote: {
      fence: (req) => routeFenceRejection(req, { remoteAdmission }),
      admitStream: (req) => admitLongLivedRequest(req, { remotePeerAdmission }),
      bindPeer: bindPeerLifecycle,
    },
```

</details>

**依据 6 · 源码核查**：[packages/dsh-notifier/src/server/api/impl/route/index.ts:129-150](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/src/server/api/impl/route/index.ts#L129-L150)

先查认证，再决定 405。

<details>
<summary>查看原文（22行）</summary>

```text
  for (const endpoint of endpoints) {
    disposers.push(
      register({
        kind: "exact",
        path: endpoint.path,
        handler: (req, res) => {
          const rejection = remote.fence(req);
          if (rejection !== undefined) {
            sendRouteRefusal(res, rejection);
            return;
          }
          const handle = endpoint.methods[(req.method ?? "") as HttpMethod];
          if (handle === undefined) {
            // `allow` 是 405 该带的头，调用方不必回翻文档；状态码与文案仍与旧协议一致，
            // 新增的只是与之并列的机读 code/status。
            sendRefused(
              res,
              405,
              REFUSAL_CODES.METHOD_NOT_ALLOWED,
              `method not allowed: ${req.method}`,
              {
                allow: Object.keys(endpoint.methods).join(", "),
```

</details>

**依据 7 · 源码核查**：[packages/dsh-notifier/src/server/api/impl/stream/index.ts:120-172](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/src/server/api/impl/stream/index.ts#L120-L172)

Peer effect、重播及连接登记的实际实现。

<details>
<summary>查看原文（53行）</summary>

```text
  /** GET /events：接上一条 SSE 连接，并回放 `?since` 之后的帧。 */
  handle(
    req: IncomingMessage,
    res: ServerResponse,
    remote: RemoteAccessPort,
  ): 401 | 403 | undefined {
    if (!this.installed) {
      res.writeHead(503);
      res.end();
      return undefined;
    }
    const admission = remote.admitStream(req);
    if ("rejection" in admission) return admission.rejection;

    let closed = false;
    let peerEnded = false;
    let disposePeer: (() => void) | undefined;
    const closeStream = (): void => {
      if (closed) return;
      closed = true;
      this.hub.unregister(res);
    };
    res.on("close", () => {
      closeStream();
      const dispose = disposePeer;
      disposePeer = undefined;
      if (!peerEnded) dispose?.();
    });
    if (admission.peer !== undefined) {
      try {
        disposePeer = remote.bindPeer(
          admission.peer,
          () => {
            peerEnded = true;
            closeStream();
          },
          "dsh-notifier: raw SSE bound to admitted Peer",
        );
      } catch {
        return 403;
      }
    }
    res.writeHead(200, {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-store",
      connection: "keep-alive",
      // 反代缓冲会把 SSE 攒成一次性大响应，客户端看起来像「连上了但一直没消息」。
      "x-accel-buffering": "no",
    });
    res.write(CONNECTED);
    for (const event of this.since(sinceOf(req))) res.write(encode(event));
    this.hub.register(res);
    return undefined;
```

</details>

#### 缺口

- 未连接实际兄弟插件或跨会话事件源，也未验证 SSE 长连接断开恢复。
  **影响**：真实部署链路和浏览器通知权限未知
  **进一步探讨**：用多个 session 触发可控事件，验证授权、注销和重连。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 远程访问鉴权、SSE 生命周期和通知噪音边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

README 声明 LAN 非回环请求需复用官方 connection 认证，401/403 保持拒绝；SSE 应绑定 admitted Peer 生命周期，connection 卸载时注销订阅。LAN HTTP 不属于浏览器安全上下文，系统通知需本地安全上下文或 HTTPS。代码提供安全机制但本轮未执行网络/浏览器验证；过宽 global 订阅也可能放大噪音。

两类非回环入口在宿主能力缺失或抛错时返回 403，短请求用官方的拒绝检查，流式路径要取得 Peer。Peer 结束调用 hub.unregister，已登记响应先出表再调用 res.destroy()。这会立即请求销毁响应并停止后续心跳和广播，实际客户端感知延迟和浏览器自动重连结果仍需在指定宿主检验。系统侧通知还检查浏览器 isSecureContext 和授权。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-notifier/README.md:25-55](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/README.md#L25-L55)

访问形式与认证模型边界。

<details>
<summary>查看原文（31行）</summary>

```text

<a id="部署与访问方式重要"></a><a id="user-content-部署与访问方式重要"></a>
## 部署与访问方式（重要）

插件接口保留本机 loopback 快路径。从局域网地址直连时，请求还必须通过官方
`dsh-client-connection` 的 Host/Origin/cross-site 围栏以及浏览器或 API 会话认证；
未认证请求返回 401/403，认证失败不会被插件自行放行。HTTP LAN 仍不属于浏览器安全
上下文，系统通知会走降级通道，移动端 PWA 系统通知应使用原生 HTTPS。

请选用下列任一形态访问（均在设置卡片与 README 中给出提示）：

| 形态 | 访问方式 | 说明 |
|---|---|---|
| 本机桌面 | `http://127.0.0.1:3080` | 安全上下文：浏览器通知 + 系统通知均可用 |
| 局域网 HTTPS（推荐） | `dsh web` 绑定具体 LAN 地址并配置 TLS 后的同源地址 | 官方认证 + 安全上下文；移动端「添加到主屏幕」后可获 PWA 级通知 |
| 隧道 | `ssh -L 3080:127.0.0.1:3080 <服务器>` 后访问本机地址 | 回环 + 安全上下文，效果同本机 |

<a id="安全与边界"></a><a id="user-content-安全与边界"></a>
## 安全模型

- **LAN 管理面复用官方会话认证**：loopback 保持原有快路径；非回环请求每次现读
  `ctx.connection` 并调用 `requestRejection`，由官方校验 Host、Origin、cross-site、
  浏览器 cookie 或 live API peer。401/403 保持原状态，认证通过后才进入方法判定；
  connection 缺失、卸载或异常一律拒绝。插件不信任 LAN 私网、TLS、`X-Forwarded-For`
  或客户端自报来源。
- **非回环 SSE 绑定 admitted Peer 生命周期**：普通请求仍走最小
  `requestRejection` seam；`/events` 在写 200 与注册连接表前调用官方
  `connection.admit` 并保留公开 PeerScope。Peer 释放或 connection 卸载时经
  `peer.ctx.effect` 回调和 `SseHub.unregister` 同步出表、停止心跳处理并关闭响应；
  API socket 释放后的下一次请求不能复用旧 admission。loopback SSE 不调用官方
  Peer admission，保持既有插件生命周期。
```

</details>

**依据 2 · 源码核查**：[packages/dsh-notifier/src/index.ts:126-180](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/src/index.ts#L126-L180)

HostPort 绑定远程拒绝与连接注册。

<details>
<summary>查看原文（55行）</summary>

```text
/** 组合根用到的宿主面：域拿到的是能力，不是上下文。 */
interface HostPort {
  readonly logger: LoggerPort;
  /** 官方 connection 的短请求围栏与长连接 Peer 生命周期能力。 */
  readonly remote: Parameters<typeof apiApi.installApi>[0]["remote"];
  /** 帧总线：帧经它从裁决管线走到浏览器出口。 */
  readonly frames: FrameBus;
  /** 宿主路由注册口：只有组合根够得着 `ctx.webServer`。 */
  readonly register: (route: WebRoute) => () => void;
  readonly events: HostEventPort;
  /** 宿主 agent 注册表：子代理归属判定要它。 */
  readonly agents: AgentRegistryPort;
  /**
   * 宿主 settings 服务：0.2.3 把配置存在那里，新架构搬走后仍需用它作低优先级兜底。
   * 只声明本域要用的 `describe`——正式历史来源由 upgrade 域直接读取 DSH_HOME 双文件。
   */
  readonly legacySettings: LegacySettingsFace;
  /** 宿主出口：把服务面挂上上下文。服务名是 sdk 域的 ABI，组合根不参与命名。 */
  readonly expose: ExposePort;
  /** DSH 当前显式语言；每次调用现读，供各域在生成通知时选择产品文案。 */
  readonly readLocale: () => NotificationLocale;
}

function bindHost(ctx: Context): HostPort {
  /**
   * 把本插件的处理收进一个「绝不向宿主抛错」的壳里：本插件在宿主事件链上只是旁观者，
   * 自己出问题不该影响别人的流程。审批与提问这两条是 waterfall，抛出去会让 `next()`
   * 不被调用，症状是「审批框不弹了」，与本插件毫无字面关联。
   */
  const guard = (run: () => void): void => {
    try {
      run();
    } catch (cause) {
      // 不静默：这里是唯一还知道发生了什么的地方，吞掉之后「通知不工作」会变成查不出原因的现象。
      const reason = cause instanceof Error ? cause.message : String(cause);
      ctx.logger.warn(`dsh-notifier: 宿主事件处理失败 —— ${reason}`);
    }
  };

  const remoteAdmission = liveConnectionAdmission(ctx);
  const remotePeerAdmission = liveConnectionPeerAdmission(ctx);

  return {
    logger: ctx.logger,
    remote: {
      fence: (req) => routeFenceRejection(req, { remoteAdmission }),
      admitStream: (req) => admitLongLivedRequest(req, { remotePeerAdmission }),
      bindPeer: bindPeerLifecycle,
    },
    frames: new FrameBus(),
    // 依赖已由 `inject` 声明，服务就绪才轮到本插件装配：这里直接取用，没有探测、也没有迟到分支。
    legacySettings: ctx.settings,
    register: (route) => ctx.webServer.register(route),
    // 名字取自 sdk 域（ABI 的定义处）。显式类型参数是道保险：谁把那里退回硬编码字面量，
    // 少了它就静默失败——`ctx.provide` 的 `(name: string, value?: any)` 重载会兜住任意字符串。
```

</details>

**依据 3 · 源码核查**：[packages/dsh-notifier/src/index.ts:88-123](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/src/index.ts#L88-L123)

全局事件订阅与帧总线。

<details>
<summary>查看原文（36行）</summary>

```text
/**
 * 宿主事件默认按 fiber 作用域过滤，通知插件必须看到所有会话与 agent，故每条订阅都要带它。
 * 漏掉的表现是「有些会话不通知」，且只在多会话下出现——单会话调试永远复现不了。
 */
const GLOBAL_LISTEN = { global: true } as const;

/**
 * 对外名字的声明合并。必须写在包入口：`declare module` 是全局增强，入口声明面不可达时
 * `lib/index.d.ts` 里就没有它（`pack:check` 的「声明合并可达性」判据盯这条）；键引用 sdk 域的
 * 常量，服务名只留一个物理定义——抄一份字面量同样能编译，改名漏改时只会在运行时的另一头暴露。
 */
declare module "@deepseek-ai/cordis" {
  interface Context {
    /** 通知中心服务面：兄弟插件经它登记自己的通知种类、发送通知。 */
    [sdkApi.NOTIFIER_SERVICE]: NotifierService;
  }
}

/**
 * 帧总线：生产端只给 `emit`（裁决管线），消费端只给 `onFrame`（浏览器出口），类型就是围栏。
 * 它是组合根的本地设施而不是宿主事件总线上的事件——总线上的名字是公共面，谁都能收发。
 * 遍历前先取快照：帧是 fire-and-forget 的旁路，回调里退订不该打断本轮其余订阅者。
 */
class FrameBus {
  private readonly handlers = new Set<(payload: OutgoingFrame) => void>();

  emit(payload: OutgoingFrame): void {
    for (const handler of [...this.handlers]) handler(payload);
  }

  onFrame(handler: (payload: OutgoingFrame) => void): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }
```

</details>

**依据 4 · 源码核查**：[shared/host-utils.ts:222-255](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/shared/host-utils.ts#L222-L255)

长请求失败分支和 Peer 生命周期注册。

<details>
<summary>查看原文（34行）</summary>

```text
export function admitLongLivedRequest(
  request: IncomingMessage,
  options: LoopbackOptions = {},
): { readonly peer?: RemotePeerScope } | { readonly rejection: 401 | 403 } {
  if (isLoopbackPeerAddress(request)) {
    return isLoopbackRequest(request, options) ? {} : { rejection: 403 };
  }

  const admission = currentRemoteSource(options.remotePeerAdmission);
  if (typeof admission !== "function") return { rejection: 403 };

  try {
    return normalizePeerAdmissionResult(admission(request));
  } catch {
    return { rejection: 403 };
  }
}

/**
 * 把长连接清理登记到官方 PeerScope 的 ctx.effect；Peer 释放/connection 卸载时自动执行。
 * 返回的 disposer 供客户端先断开时注销 effect，重复调用由 Cordis 保持幂等。
 */
export function bindPeerLifecycle(
  peer: RemotePeerScope,
  cleanup: () => void,
  label: string,
): () => void {
  const dispose = peer.ctx.effect(() => () => cleanup(), label);
  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    if (typeof dispose === "function") void dispose();
  };
```

</details>

**依据 5 · 源码核查**：[shared/host-utils.ts:264-279](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/shared/host-utils.ts#L264-L279)

短请求缺 admission 和异常均 fail closed。

<details>
<summary>查看原文（16行）</summary>

```text
export function routeFenceRejection(
  request: IncomingMessage,
  options: LoopbackOptions = {},
): RemoteAdmissionRejection {
  if (isLoopbackPeerAddress(request)) {
    return isLoopbackRequest(request, options) ? undefined : 403;
  }

  const admission = currentRemoteSource(options.remoteAdmission);
  if (typeof admission !== "function") return 403;

  try {
    return normalizeRemoteRejection(admission(request));
  } catch {
    return 403;
  }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-notifier/src/client/index.tsx:203-213](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/src/client/index.tsx#L203-L213)

检查安全上下文和 Notification.permission。

<details>
<summary>查看原文（11行）</summary>

```text
function isSecureContext() {
  return window.isSecureContext === true;
}

/** 系统级浏览器通知是否可用（安全上下文 + 已授权）。 */
function systemNotificationUsable() {
  if (!("Notification" in window)) return false;
  if (!isSecureContext()) return false;
  return Notification.permission === "granted";
}

```

</details>

**依据 7 · 源码核查**：[shared/sse-hub.ts:149-158](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/shared/sse-hub.ts#L149-L158)

关闭已登记响应时先移除，再调用 res.destroy；close 重入是幂等。

<details>
<summary>查看原文（10行）</summary>

```text
  /** 移除一条连接（幂等）：先出表再 destroy，destroy 触发的 close 回调再次 evict 无害。 */
  function evict(res: ServerResponse, reason: SseEvictReason): void {
    if (conns.delete(res)) {
      evictStats[reason] += 1;
      try {
        res.destroy();
      } catch {
        // 忽略
      }
    }
```

</details>

**依据 8 · 源码核查**：[shared/sse-hub.ts:234-237](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/shared/sse-hub.ts#L234-L237)

unregister 调用 evict，不等待客户端先发 close。

```text
  /** 主动注销一条连接：先出表再关闭，不等 close 事件，停掉该连接的后续心跳/广播。 */
  function unregister(res: ServerResponse): void {
    evict(res, "close");
  }
```

#### 缺口

- 没有实测 LAN 鉴权绕过、SSE 断连或浏览器通知权限。
  **影响**：需在隔离 DSH Web 验证未授权访问拒绝、连接释放和多 session 过滤/降噪。
  **进一步探讨**：需在隔离 DSH Web 验证未授权访问拒绝、连接释放和多 session 过滤/降噪。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些用户适合采用，如何权衡维护与失败成本？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

适合依赖跨会话插件事件通知且能管理 HTTPS/访问权限的 DSH 用户。先在 loopback 单用户环境启用，使用已知事件确认通知呈现、退订与停用；只有确认需要跨设备才配置 LAN HTTPS。收益假设是减少检查多个会话的切换，代价是通知噪音、浏览器权限和长连接运维。若不可见来源、重复过多或未授权连接能触达就停用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-notifier/src/index.ts:59-85](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/src/index.ts#L59-L85)

必需服务、总开关和生命周期挂载。

<details>
<summary>查看原文（27行）</summary>

```text
export const inject = ["webServer", SETTINGS_SERVICE];

/**
 * 组合层入口配置（插件挂载点传入）。只有总开关：设置项全部住在本插件自己的配置文件里，
 * 这里再开一层默认值只会让人以为某处配过什么，而它永远是空的。
 */
export interface NotifierApplyConfig {
  /** 总开关；`false` 时一律不投递。不落盘、不进设置层。 */
  enabled?: boolean;
}

/**
 * 挂载 dsh-notifier。**异步**：升级域的存储迁移是异步链，调用方（宿主或测试）必须 `await`——
 * 不等待就等于让各域在迁移跑完之前去读磁盘，读到的是被搬走一半的旧形态。
 */
export async function apply(ctx: Context, config: NotifierApplyConfig = {}): Promise<void> {
  const host = bindHost(ctx);
  const stack = createDisposerStack();
  try {
    await assemble(host, config, stack);
  } finally {
    // 登记点留在采集之后：cordis 按 LIFO 释放 effect，提前登记会让整条栈在服务面已撤之后
    // 才释放各域（api 域在别人已放开的入参上继续服务）。用 finally 而不是顺序执行，是为了
    // 装配中途抛错时已采集的 teardown 也有释放点——原先那种「拿返回值去登记」的写法一抛错
    // 就整条链一个都没登记。
    stack.attach(ctx, "dsh-notifier");
  }
```

</details>

**依据 2 · 作者声明**：[packages/dsh-notifier/README.md:34-55](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/README.md#L34-L55)

本机、HTTPS 与隧道条件。

<details>
<summary>查看原文（22行）</summary>

```text
请选用下列任一形态访问（均在设置卡片与 README 中给出提示）：

| 形态 | 访问方式 | 说明 |
|---|---|---|
| 本机桌面 | `http://127.0.0.1:3080` | 安全上下文：浏览器通知 + 系统通知均可用 |
| 局域网 HTTPS（推荐） | `dsh web` 绑定具体 LAN 地址并配置 TLS 后的同源地址 | 官方认证 + 安全上下文；移动端「添加到主屏幕」后可获 PWA 级通知 |
| 隧道 | `ssh -L 3080:127.0.0.1:3080 <服务器>` 后访问本机地址 | 回环 + 安全上下文，效果同本机 |

<a id="安全与边界"></a><a id="user-content-安全与边界"></a>
## 安全模型

- **LAN 管理面复用官方会话认证**：loopback 保持原有快路径；非回环请求每次现读
  `ctx.connection` 并调用 `requestRejection`，由官方校验 Host、Origin、cross-site、
  浏览器 cookie 或 live API peer。401/403 保持原状态，认证通过后才进入方法判定；
  connection 缺失、卸载或异常一律拒绝。插件不信任 LAN 私网、TLS、`X-Forwarded-For`
  或客户端自报来源。
- **非回环 SSE 绑定 admitted Peer 生命周期**：普通请求仍走最小
  `requestRejection` seam；`/events` 在写 200 与注册连接表前调用官方
  `connection.admit` 并保留公开 PeerScope。Peer 释放或 connection 卸载时经
  `peer.ctx.effect` 回调和 `SseHub.unregister` 同步出表、停止心跳处理并关闭响应；
  API socket 释放后的下一次请求不能复用旧 admission。loopback SSE 不调用官方
  Peer admission，保持既有插件生命周期。
```

</details>

**依据 3 · 源码核查**：[packages/dsh-notifier/src/index.ts:88-123](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-notifier/src/index.ts#L88-L123)

跨会话订阅设计。

<details>
<summary>查看原文（36行）</summary>

```text
/**
 * 宿主事件默认按 fiber 作用域过滤，通知插件必须看到所有会话与 agent，故每条订阅都要带它。
 * 漏掉的表现是「有些会话不通知」，且只在多会话下出现——单会话调试永远复现不了。
 */
const GLOBAL_LISTEN = { global: true } as const;

/**
 * 对外名字的声明合并。必须写在包入口：`declare module` 是全局增强，入口声明面不可达时
 * `lib/index.d.ts` 里就没有它（`pack:check` 的「声明合并可达性」判据盯这条）；键引用 sdk 域的
 * 常量，服务名只留一个物理定义——抄一份字面量同样能编译，改名漏改时只会在运行时的另一头暴露。
 */
declare module "@deepseek-ai/cordis" {
  interface Context {
    /** 通知中心服务面：兄弟插件经它登记自己的通知种类、发送通知。 */
    [sdkApi.NOTIFIER_SERVICE]: NotifierService;
  }
}

/**
 * 帧总线：生产端只给 `emit`（裁决管线），消费端只给 `onFrame`（浏览器出口），类型就是围栏。
 * 它是组合根的本地设施而不是宿主事件总线上的事件——总线上的名字是公共面，谁都能收发。
 * 遍历前先取快照：帧是 fire-and-forget 的旁路，回调里退订不该打断本轮其余订阅者。
 */
class FrameBus {
  private readonly handlers = new Set<(payload: OutgoingFrame) => void>();

  emit(payload: OutgoingFrame): void {
    for (const handler of [...this.handlers]) handler(payload);
  }

  onFrame(handler: (payload: OutgoingFrame) => void): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }
```

</details>

#### 缺口

- 没有通知减少漏看或噪音的实测，也未测试移动端权限。
  **影响**：小范围记录触达、重复、延迟及误报
  **进一步探讨**：如果净提醒价值不正或无法安全暴露就停用。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
