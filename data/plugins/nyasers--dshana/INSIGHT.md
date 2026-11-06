# DSHana

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[16ce827](https://github.com/Nyasers/DSHana/tree/16ce8274454233c9d0233e26457985a65688640d)

<!-- BEGIN META -->
[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nyasers/DSHana)
<!-- END META -->

> **功能**：将 DSH 嵌入 HanaAgent App，以受管 Node runtime、任务句柄、审批和模型桥接提供子代理执行。

> **亮点**：把受管启动、来源句柄、后台回投、审批与宿主模型接成委派链，不只是内嵌网页；真实兼容/效果未验，见 [Q01](#research-q01)至 [Q04](#research-q04)。

> **主要限制**：local-machine无文件系统隔离，ready不保证两桥成功，DSH回合完成非业务验收；终态回投/stop失败可能只日志，句柄归属有显式ID/无context退路，见 [Q02](#research-q02)至 [Q04](#research-q04)。

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
  - [Q01 · DSHana是什么，给谁多做成什么？](#detail-section-11)
  - [Q02 · App如何启动、就绪与恢复，权限范围怎样？](#detail-section-12)
  - [Q03 · 任务接受、完成、取消分别落到哪？](#detail-section-13)
  - [Q04 · 审批、句柄归属和模型凭据实际怎样接？](#detail-section-14)
  - [Q05 · 谁可怎样试，完整成本与退出是什么？](#detail-section-15)
  - [Q06 · 什么改进值得证伪？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已在Hana工作且需委派DSH编码任务的人，可少拷贝任务/结果；runtime、接受、终态和业务验收分别核实，见 [Q01](#research-q01)。

单独打开DSH网页并手工带回结果；Agent/工具能力来自DSH/Hana，本组件承担跨宿主接线和状态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| Hana App/DSH卡 | 嵌入工作面 | 不是原生DSH插件 |
| open/reply/get | 委派和查询任务 | 接受/终态非业务验收 |
| 审批桥 | 本次操作裁决 | 绑定与上游授权/超时 |
| 取消/stop | 请求并核收尾 | 可能unresolved/只日志 |
| 模型桥 | 复用Hana目录/推理 | 凭据归宿主非零费 |

**流程与依赖**

#### 依赖

| 条件 | 是否必需 | 用途 | 不满足时 |
| --- | --- | --- | --- |
| Hana>=1.5.70-beta与能力授权 | 必需 | App/runtime/tasks/models | 本轮未跑宿主 |
| 随包DSH0.2.1-rc.5依赖 | 必需 | 子Agent/Web | zip完整性另验 |
| local-machine/external权限 | 实际启动 | 当前用户文件/网络 | 非FS隔离 |
| task/approval桥 | 委派回投与审批 | 跨宿主状态 | runtime ready不证明挂好 |
| 模型目录/凭据由Hana管理 | 推理条件 | hana.models | 不等于零费用 |

#### 步骤

| 步骤 | 动作 | 判据与退路 |
| --- | --- | --- |
| 专用环境 | 审11权限/zip/数据目录 | 主目录不当沙箱 |
| 启动 | 看runtime与两桥健康 | ready和集成健康分开 |
| 小任务 | 自造项目只读文字任务 | open接受不是完成 |
| 终态 | 对DSH/Hana/文件核验 | 未知不重开重复任务 |
| 退出 | 取消/stop核实际进程 | 不可核就回独立DSH |

**效果与成本**

#### 成本

| 阶段 | 资源/现金 | 人工时间 | 边界 |
| --- | --- | --- | --- |
| 首次 | App/随包依赖/独立环境 | 权限/桥/版本核查 | 未测耗时 |
| 持续 | Hana/DSH/模型/工具/存储 | 双层会话与原现场复核 | 集中模型不免费 |
| 故障 | 自动启动重试/重复模型 | 分接受/回投/收尾 | 未知不当失败重跑 |
| 退出 | 私有DSH与项目产物 | 停进程撤权限清留存 | 不回滚外部副作用 |

#### 效果

| 效果 | 当前支持 | 未确认 |
| --- | --- | --- |
| 委派链 | 真实runtime/task/prompt | 当前Hana加载 |
| 结果回投 | 事件终态到宿主定位 | 业务正确/可靠重投 |
| 审批 | 宿主record到DSH等待 | 上游超时/认证全契约 |
| 取消 | RPC/确认/升级 | 所有资源实际停下 |

> **思考**：local-machine无文件系统隔离，ready不保证两桥成功，DSH回合完成非业务验收；终态回投/stop失败可能只日志，句柄归属有显式ID/无context退路，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把受管启动、来源句柄、后台回投、审批与宿主模型接成委派链，不只是内嵌网页；真实兼容/效果未验，见 [Q01](#research-q01)至 [Q04](#research-q04)。

single-flight、取消确认/升级与审批绑定/未知拒绝有复用价值；但ready与桥健康、终态标签与可靠回投、受管与隔离需分开，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

local-machine无文件系统隔离，ready不保证两桥成功，DSH回合完成非业务验收；终态回投/stop失败可能只日志，句柄归属有显式ID/无context退路，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察：专用Hana/OS环境先核权限与两桥，再用自造小项目文字任务分别核接受、DSH结束、宿主终态和进程收尾。未知不重开任务，桥/收尾不可核就停用回独立DSH网页，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

Hana App真实装配、runtime/start/stop、任务接受/终态/取消、审批/归属与模型身份流已查；未运行Hana/zip/宿主权限。观察，跨宿主对账为候选。

- 已检查：作者 README、包清单、源码路径 package.json、packages/app/src/app.ts、packages/app/src/manifest.json、packages/dsh/provider/index.ts、packages/dsh/provider/lib/identity.ts、packages/host/src/approval-bridge.ts、packages/host/src/bridge.ts、packages/host/src/main.ts、packages/host/src/model-requests.ts、packages/host/src/task-bridge.ts、packages/runtime/src/data-source.ts、packages/runtime/src/managed-runtime.ts、packages/session/src/approve-respond.ts、packages/session/src/cancel-chain.ts、packages/session/src/session-run.ts、packages/session/src/task-ownership.ts、packages/shared/src/watch-sse.ts、packages/tools/src/actions/open.ts、packages/tools/src/shared/target.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核App/manifest、受管启动停止关键路径、数据源默认/验证、open与session提交/等待、task桥终态、取消结算、approval创建/应答/映射、目标归属、模型身份/流、中继key与头替换。未全审UI/WS/host SDK/OS权限或安装运行。
- 下一步：- 固定源码，不装App/zip、不起runtime或调用模型。
- ready/accepted/completed分别界定，不作业务正确证明。
- 根是Hana App适配客户端，非DSH原生插件。

**分析版本**

- **仓库**：[Nyasers/DSHana](https://github.com/Nyasers/DSHana)
- **版本号**：1.2.7+dsh-0.2.1-rc.5（[固定提交 16ce827](https://github.com/Nyasers/DSHana/tree/16ce8274454233c9d0233e26457985a65688640d)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是独立桥健康与结算待确认/收尾证据，以四故障样本比较未知误判、重复提交与维护负担，见 [Q06](#research-q06)。

- 固定源码，不装App/zip、不起runtime或调用模型。
- ready/accepted/completed分别界定，不作业务正确证明。
- 根是Hana App适配客户端，非DSH原生插件。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 28 | 2443 | — | — | 49653 |
| .ts | source | 108 | 22569 | 15303 | 6183 | — |
| .tsx | source | 6 | 3877 | 3214 | 535 | — |
| .mts | source | 52 | 8125 | 5248 | 2432 | — |
| .mjs | source | 3 | 29 | 3 | 26 | — |
| .js | source | 1 | 399 | 244 | 170 | — |
| .cjs | source | 1 | 148 | 116 | 13 | — |
| .mjs | test | 62 | 10018 | 8057 | 1207 | — |
| .js | example | 1 | 41 | 23 | 17 | — |
| .md | test | 1 | 33 | — | — | 534 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Nyasers/DSHana/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/Nyasers/DSHana/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Nyasers/DSHana/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨Hana/DSH任务如何接受、审批、回投与收尾，受管运行究竟隔离什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSHana是什么，给谁多做成什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根项目是 HanaAgent App/客户端适配器，不是装进DSH的单个原生Host插件。manifest入口bin/app.mjs，注册Hana模型工具、卡片/设置/路由，受管Node内嵌DSH与其Web；模型/文件工具/Agent执行能力继承DSH与Hana。适合已在Hana工作、想把一项编码任务交给DSH并回到原对话收结果的人；替代是单独开DSH网页手工拷任务和结果。

贡献是把启动、调用方模型、任务句柄/来源、审批和后台回投连成跨宿主执行链，而非单iframe。合格结果需四步分别验：runtime可用、DSH接受任务、Hana得到终态、业务产物验收；面板能打开或子回合正常结束都不能证明代码正确。源码/打包声明依赖随包，不能据它证明发行zip实际完整或当前宿主可加载。无Hana工作流需求的人会多一层进程/状态成本。

#### 证据与依据

**依据 1 · 源码核查**：[packages/app/src/manifest.json:1-34](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/app/src/manifest.json#L1-L34)

Hana App入口与权限声明。

<details>
<summary>查看原文（34行）</summary>

```text
{
  "manifestVersion": 2,
  "id": "dshana",
  "name": "DSHana",
  "version": "1.2.7+dsh-0.2.1-rc.5",
  "description": "把 DeepSeek Harness 变成 HanaAgent 的子代理",
  "entry": "bin/app.mjs",
  "icon": "icon.png",
  "minAppVersion": "1.5.70-beta",
  "capabilities": [
    "app/tools.expose-to-model",
    "app/tasks.manage",
    "app/session.start-turn",
    "app/models.infer",
    "app/sessions.read",
    "app/resources.read",
    "app/process.spawn",
    "app/runtime.execute",
    "app/runtime.local-machine",
    "app/runtime.network",
    "app/ui.open-external"
  ],
  "network": {
    "allowedHosts": [
      "127.0.0.1"
    ],
    "methods": [
      "GET",
      "POST"
    ],
    "allowLocalhost": true,
    "defaultTimeoutMs": 60000,
    "maxResponseBytes": 8388608
  },
```

</details>

**依据 2 · 源码核查**：[packages/app/src/manifest.json:35-69](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/app/src/manifest.json#L35-L69)

卡片/设置贡献。

<details>
<summary>查看原文（35行）</summary>

```text
  "contributes": {
    "cards": [
      {
        "id": "dshana",
        "title": "DSHana",
        "description": "DSHana bootstrap and workspace",
        "route": "/main.html",
        "realization": "page",
        "functionPanel": {
          "id": "sidebar",
          "label": "DSHana",
          "route": "/sidebar.html"
        },
        "siteNavEntry": true,
        "fpFullPanel": true,
        "closable": false,
        "detached": {
          "route": "/default.html"
        },
        "cardForm": "flush",
        "titlebar": "solid",
        "face": {
          "image": "face.png"
        },
        "pageIcon": "page-icon.svg"
      }
    ],
    "settings": {
      "title": "DSHana",
      "ui": {
        "route": "/settings.html"
      }
    }
  }
}
```

</details>

**依据 3 · 源码核查**：[packages/app/src/app.ts:85-106](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/app/src/app.ts#L85-L106)

工具与App路由真实注册。

<details>
<summary>查看原文（22行）</summary>

```text
  const unregisterTool = ctx.tools.register({
    name: dshanaTool.name,
    description: dshanaTool.description,
    parameters: dshanaTool.parameters,
    execute: (input, callCtx) => dshanaTool.execute(input, toolCtxFrom(ctx, toolLog)),
  });
  log("info", `工具注册:${dshanaTool.name}（ctx.tools.register，v2 全局唯一名，无自动前缀）`);

  // ---- ctx.routes.register：壳页/诊断面 ----
  // 契约（@hana/app-sdk）：单 bundle App 只能 register 一次，
  // registrar 收到宿主创建的 Hono sub-app（public URL /api/apps/dshana/routes/dshana/*，
  // app_route 鉴权；registrar 可返回 Promise，宿主 await 后发布）。到受管 runtime 服务的
  // 浏览器通道由宿主自动暴露在 /api/apps/dshana/routes/_runtime/<runtimeId>/（服务
  // readyMarker 后成立，自动代理 HTTP/SSE/WS + 重定向重写 + HttpOnly cookie）——本 registrar
  // 不需要转发受管服务，只提供壳页消费的 boot 状态与启动/停止面。
  // ui/ 壳页（dist/ui/*.html）以相对同源 fetch 本组端点轮询（页面经 App surface
  // 授权加载）。
  let unregisterRoutes: (() => void) | null = null;
  if (ctx.routes && typeof ctx.routes.register === "function") {
    try {
      unregisterRoutes = ctx.routes.register((app) => registerDshanaRoutes(app, defaultDshanaRouteDeps(ctx)));
      log("info", "路由注册:ctx.routes.register（/dshana/boot-state|health|start|stop——ui/ 壳页消费面）");
```

</details>

**依据 4 · 源码核查**：[packages/tools/src/actions/open.ts:52-81](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/tools/src/actions/open.ts#L52-L81)

后台任务与卡片回执。

<details>
<summary>查看原文（30行）</summary>

```text
export async function run(input: OpenInput, ctx: ToolCtx, deps?: SubmitDeps): Promise<ToolResult> {
  const callToken = (input && input.context && input.context.callToken) || "";
  // 提交面（deps 可注入以单测 open 分支；缺省用真实 submitDshTask）返回 { promise, ready }：
  // ready 在 prompt 被 DSH 接受后 resolve 定位键（sessionId/rpcId/taskId），提交阶段失败则
  // reject（错误上抛给工具面）；promise 是后台生命周期（等 task 终态、释放串行锁），本处不 await。
  const submit = deps && typeof deps.submitDshTask === "function" ? deps.submitDshTask : submitDshTask;
  const { ready } = submit({ action: "create", input, callToken, log: ctx && ctx.log });
  const loc = await ready;
  const sid = String(loc.sessionId || "");
  const rpc = String(loc.rpcId || "");
  const text =
    "已开启 DSH 子代理（open）：taskId " + loc.taskId + "（后续续/关优先用它），sessionId " + sid + "，rpcId " + rpc +
    (loc.cwd ? "，cwd " + loc.cwd : "") +
    "。任务在后台执行，完成/失败按 " + loc.delivery + " 档投递回本会话（下一个输入点自动贴回，不必为等结果结束回合）；要看执行过程或最终结论用 dshana action=get（taskId " +
    loc.taskId + "）。";
  // 会话卡：一个会话一张把手（reply 不挂，避免叠）。聊天流里只画一行坐标，不注入 iframe；
  // 用户把这张卡取出到黑板 / 拆窗后，同一页才装配 DSH 现场（见 packages/ui/src/app.ts）。
  return {
    content: [{ type: "text", text }],
    details: {
      dsh: {
        action: "open",
        sessionId: sid,
        rpcId: rpc,
        taskId: loc.taskId,
        status: "running",
        delivery: loc.delivery,
        cwd: loc.cwd || undefined,
      },
      card: sessionCard({ action: "open", sessionId: sid, taskId: loc.taskId, delivery: loc.delivery, cwd: loc.cwd }),
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · App如何启动、就绪与恢复，权限范围怎样？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

App apply注册后微任务自动ensure runtime，不必工具首调；ensure对starting共享promise，ready缓存先探活，失败清旧key/身份并安排退避重试，端口busy最多换端口3次。真正调用ctx.runtime.start，profile=local-machine、network=external，数据目录作为cwd；这不是文件系统隔离，DSH可及文件取决于当前用户与DSH自身权限/审批，不因“受管”变沙箱。manifest回环allowedHosts不能当子runtime外网/文件访问边界。

启动生成随机bridge/control key和配置，收到runtimeId后仍轮询ready/失败，启动拒绝/失败有诊断、配置清理；数据源默认private到App数据目录，但源码保留shared设置/解析，不能从README“独立目录”推出所有存量设置一定私有。关键退化是main挂task/approval桥分别catch只记日志，然后仍发readyMarker；因此runtime ready不证明后台结果或审批桥已装好，试用要独立核这两链。

手动stop先清身份并冻结自动重试，调用宿主stop失败只记日志；下一次显式ensure会重新武装。App disposer异步发停而不等待全部收尾，看到stopped状态不等于进程树已被实际核停。需要宿主runtime/get/stop、App能力授权、匹配SDK和随包DSH依赖，本轮不审Hana上游隔离/回收实现。

#### 证据与依据

**依据 1 · 源码核查**：[packages/app/src/app.ts:117-160](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/app/src/app.ts#L117-L160)

加载后自动启动及异步清理。

<details>
<summary>查看原文（44行）</summary>

```text
  // ---- apply 级自动链：注册完成即后台拉起受管 DSH runtime（不 await，不阻塞 apply 返回）----
  // apply 即宿主加载本 App 的时机：注册完工具/路由后触发一次
  // ensureManagedRuntime（single-flight 幂等：已 starting/ready 时 no-op 共享同一启动）。
  // 依赖随包物化（安装目录 node_modules），启动只做 runtime boot（秒级）——fire-and-forget，
  // 状态经 boot-state 由壳页轮询展示（starting 日志滚动）；失败不 crash apply，落在 runtime
  // 状态机（phase=error + userText），壳页展示重试指引，dshana 首调仍可再触发。
  {
    // 宿主 bootstrap 窗口实证（0.930.1 plugin-loader-v2）：App 加载对 apply 有 60s RPC
    // bootstrap 超时（beta.3 在 apply 同步栈内 fire ensure 两次均 60s 整被杀）。规避 =
    // 自动链不占 apply 同步栈：Promise.resolve().then 微任务链移出栈（启动的首个
    // await 即让出事件循环，宿主 bootstrap 应答可正常处理；无需 setTimeout 宏任务延迟）。
    try {
      Promise.resolve()
        .then(() => ensureManagedRuntime({}))
        .catch((e) => {
          log("warn", "apply 自动链启动 DSH runtime 失败（状态经 boot-state 展示，可手动重试）：" + ((e as any)?.message || e));
        });
      log("info", "apply 自动链：Promise 微任务触发 ensureManagedRuntime（不占 apply 同步栈，single-flight）");
    } catch (e) {
      log("warn", "apply 自动链触发异常（忽略，继续返回 disposer）：" + ((e as any)?.message || e));
    }
  }

  // ---- 宿主模型/提供商变更订阅：变更时经控制面通知 runtime 重拉目录（不重启 runtime）----
  let uninstallModelSync: () => void = () => {};
  try {
    uninstallModelSync = installHostModelSync(ctx, log);
  } catch (e) {
    log("warn", "模型变更订阅安装异常（忽略，改宿主提供商需重启 runtime 生效）：" + ((e as any)?.message || e));
  }

  // 返回 disposer：卸载/重载清理（停止受管 DSH runtime——若已启动；幂等）
  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    try { if (typeof uninstallModelSync === "function") uninstallModelSync(); } catch { /* 忽略 */ }
    try { if (typeof unregisterTool === "function") unregisterTool(); } catch { /* 忽略 */ }
    try { if (typeof unregisterRoutes === "function") unregisterRoutes(); } catch { /* 忽略 */ }
    // 受管 runtime 收尾：停 runtime + 清单例（Windows 依赖更新/App 卸载前须先停，见
    // managed-runtime.js 与依赖部署纪律）。disposer 可异步不等待宿主。
    try {
      disposeManagedRuntime().catch((e) => {
        log("warn", "disposer 停止 DSH runtime 失败：" + ((e as any)?.message || e));
```

</details>

**依据 2 · 源码核查**：[packages/runtime/src/managed-runtime.ts:526-575](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/runtime/src/managed-runtime.ts#L526-L575)

single-flight/探活/失败重试/端口重试。

<details>
<summary>查看原文（50行）</summary>

```text
export async function ensureManagedRuntime(opts = {}) {
  // 显式启动请求 = 重新武装自动重试（用户手动停止过、随后又有会话或 /dshana/start 触发）
  autoRetryFrozen = false;
  if (managed.phase === "ready" && managed.runtimeId) {
    const live = await probeLiveRuntime();
    if (live) return { runtimeId: managed.runtimeId, info: live };
    logApp("warn", "[managed-runtime] 缓存 ready 但 runtime 已不在就绪态（子进程退出/宿主回收），重新启动");
    const app = getAppRuntime();
    await reapFailedRuntime(app && app.ctx);
    managed.phase = "idle";
    managed.lastInfo = null;
  }
  if (managed.phase === "starting" && managed.promise) {
    return managed.promise; // 并发首启共享同一 promise
  }
  const promise = startWithPortRetry(opts);
  managed.phase = "starting";
  managed.promise = promise;
  try {
    const result = await promise;
    managed.phase = "ready";
    managed.lastInfo = result.info;
    managed.lastError = null; // ready 态不残留历史失败（boot-state 快照 error 字段同步清空）
    return result;
  } catch (e) {
    managed.phase = "error";
    managed.lastError = e;
    clearRuntimeIdentity(); // 失败不留死端口/死 key（bridgeAccess 不得再发出去）
    // 失败不等于等人来救：按退避自动重试（首次安装「权限尚未授予」这类必失败就靠它自愈）
    scheduleRuntimeAutoRetry(errText(e));
    throw e;
  } finally {
    managed.promise = null;
  }
}

/** 端口占用（本机随机撞车）自动换随机端口重试；其他失败直接上抛。 */
async function startWithPortRetry(opts) {
  let lastError: unknown = null;
  for (let attempt = 1; attempt <= MAX_START_ATTEMPTS; attempt++) {
    try {
      return await doStartManaged(opts, attempt);
    } catch (e) {
      lastError = e;
      await reapFailedRuntime(getAppRuntime()?.ctx);
      if ((e as any)?.code !== "port-busy" || attempt >= MAX_START_ATTEMPTS) throw e;
      logApp("warn", "[managed-runtime] 端口占用（第 " + attempt + " 次尝试）——换随机端口重试");
    }
  }
  throw lastError || new Error(START_ERROR_HINTS.unknown);
```

</details>

**依据 3 · 源码核查**：[packages/runtime/src/managed-runtime.ts:649-710](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/runtime/src/managed-runtime.ts#L649-L710)

数据源、随机key、真实local-machine/external启动与拒绝。

<details>
<summary>查看原文（62行）</summary>

```text
  if (!app || !app.ctx || typeof app.ctx.runtime?.start !== "function") {
    throw new Error("managed-runtime: App runtime not initialized (apply did not inject ctx.runtime)");
  }
  const ctx = app.ctx;
  const dataDir = appDataDir();
  if (!dataDir) throw new Error("managed-runtime: ctx.dataDir missing");
  // 数据源：DSH_HOME 由当前源决定（private = <dataDir>/.dsh；shared = 外部目录）。
  // 读设置失败即抛错（不得默认切错源）；设置文件不存在时回落 private 默认。
  // 源默认取当前自持设置；带 dshHome 覆盖时用它（切换链要能在落盘之前先按新源启动）
  const base = await currentSource();
  const source = typeof opts.dshHome === "string" && opts.dshHome ? { ...base, home: opts.dshHome } : base;
  // 中继端口：先让探针子进程向系统要一个「此刻确实可绑」的号（它有 --allow-net）；
  // 探针不成再回落区间盲抽，由 MAX_START_ATTEMPTS 兼底。
  const bridgePort = probeBridgePort(appInstallRoot()) ?? chooseBridgePort(randomInt, FALLBACK_PORT_RANGE);
  const dshPort = 0;
  const bridgeKey = randomBytes(24).toString("base64url");
  const controlKey = randomBytes(24).toString("base64url");
  const readyMarker = makeReadyMarker();
  // 启动失败报告文件：子进程在任一致命路径退出前写下 { ok:false, kind, message, causes }，
  // 本侧失败时读回并把真实成因（含嵌套层）折叠进用户可见诊断（见 packages/shared/src/runtime-error.ts）。
  // 每次启动一份随机名，失败后即删；成功路径不起作用（子进程只在致命时写）。
  const fatalPath = join(dataDir, "runtime-fatal-" + randomBytes(9).toString("hex") + ".json");
  const config = buildRuntimeConfig({
    dataDir,
    dshHome: source.home,
    dshPort,
    bridgePort,
    bridgeKey,
    controlKey,
    readyMarker,
    fatalPath,
    cordisSrc: typeof opts.cordisSrc === "string" && opts.cordisSrc ? opts.cordisSrc : undefined,
    depsRoot: typeof opts.depsRoot === "string" && opts.depsRoot ? opts.depsRoot : undefined,
  });
  const configPath = writeRuntimeConfigFile(dataDir, config);
  logApp("info", "[managed-runtime] 启动 DSH 受管 runtime（attempt " + attempt + "/" + MAX_START_ATTEMPTS + " source=" + source.sourceId + " dshHome=" + source.home + " dshPort=" + dshPort + " bridgePort=" + bridgePort + "）");
  // 权限档 = local-machine：
  // 明确不是沙箱——受管程序自持工作区与命令策略，可读写当前用户可及的一切文件（含其他应用
  // 数据与磁盘凭据），仅保留 stop / 撤销 / 进程树回收的托管语义。宿主契约**禁止**传
  // readRoots / writeRoots / callToken / taskId，故本调用一律不带（文件边界归零，换来 DSH 能
  // 写进用户项目工作区）。护栏 = DSH 自身权限模式与审批策略 + 已接上的 Hana 审批面。
  const input: RuntimeStartInput = {
    runtime: "node",
    entry: RUNTIME_ENTRY,
    profile: "local-machine",
    network: "external",
    cwd: dataDir,
    args: [configPath],
    service: { port: bridgePort, readyMarker },
  };
  let info: RuntimeRecord;
  try {
    info = await ctx.runtime.start(input);
  } catch (e) {
    // 启动失败：配置文件中含 bridgeKey，立即删除（不残留凭据）
    try { rmSync(configPath, { force: true }); } catch { /* 忽略 */ }
    try { rmSync(fatalPath, { force: true }); } catch { /* 子进程未写也无妨 */ }
    // 宿主侧 start 拒绝（能力/授权/校验失败）：归类上报
    const text = errText(e);
    logApp("error", "[managed-runtime] ctx.runtime.start 被宿主拒绝：" + text);
    const kind = /not authorized|authoriz|DENIED|declined/i.test(text) ? "not-authorized" : "unknown";
    throw codedError((START_ERROR_HINTS[kind] || START_ERROR_HINTS.unknown) + " (host: " + text + ")", kind);
```

</details>

**依据 4 · 源码核查**：[packages/runtime/src/managed-runtime.ts:712-746](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/runtime/src/managed-runtime.ts#L712-L746)

runtimeId后等ready与终态异常。

<details>
<summary>查看原文（35行）</summary>

```text
  // 子进程已启动：配置已读入（首件事），延迟清理文件；同时记录中继访问面供 App 侧 RPC。
  managed.bridgePort = bridgePort;
  managed.bridgeKey = bridgeKey;
  managed.controlKey = controlKey;
  setTimeout(() => { try { rmSync(configPath, { force: true }); } catch { /* 忽略 */ } }, 10000);
  const runtimeId = info && info.runtimeId;
  if (!runtimeId) {
    throw new Error("ctx.runtime.start did not return runtimeId (host contract violation): " + JSON.stringify(info || null));
  }
  managed.runtimeId = runtimeId;
  logApp("info", "[managed-runtime] runtimeId=" + runtimeId + " state=" + (info.state || "starting"));
  // 轮询等到 ready / failed / exited / stopped（起始 starting；不能把 runtimeId 当就绪）
  const deadline = Date.now() + READY_TIMEOUT_MS;
  for (;;) {
    let cur: RuntimeRecord | null = null;
    try {
      cur = await ctx.runtime.get(runtimeId);
    } catch (e) {
      logApp("warn", "[managed-runtime] runtime.get 查询失败：" + errText(e));
    }
    const state = cur && cur.state;
    const service = cur && cur.service;
    if (state === "ready" || (service && service.state === "ready")) {
      logApp("info", "[managed-runtime] DSH 就绪（state=ready service=" + JSON.stringify(service) + "）");
      managed.lastInfo = cur;
      return { runtimeId, info: cur };
    }
    if (state === "failed" || state === "exited" || state === "stopped") {
      const cls = classifyRuntimeFailure(cur);
      managed.lastInfo = cur;
      // 读回子进程的结构化失败报告（若有）：把真实成因折叠进用户可见诊断，而不是只报归类提示。
      const fatal = readFatalReport(fatalPath);
      logApp("error", "[managed-runtime] DSH runtime 终态异常：" + state + " exit=" + (cur && cur.exitCode));
      const detail = fatal ? "（" + fatalReportText(fatal) + "）" : "";
      throw codedError(
```

</details>

**依据 5 · 源码核查**：[packages/runtime/src/managed-runtime.ts:773-795](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/runtime/src/managed-runtime.ts#L773-L795)

停止先改状态，宿主失败只日志。

<details>
<summary>查看原文（23行）</summary>

```text
export async function stopManagedRuntime() {
  // 手动停止同时冻结自动重试（否则刚停就被重试拉回来）；下一次显式 ensure 会重新武装
  cancelRuntimeAutoRetry();
  const app = getAppRuntime();
  const runtimeId = managed.runtimeId;
  managed.phase = "stopped";
  clearRuntimeIdentity();
  managed.lastInfo = null;
  if (!runtimeId) return;
  if (app && app.ctx && typeof app.ctx.runtime?.stop === "function") {
    try {
      await app.ctx.runtime.stop(runtimeId);
      logApp("info", "[managed-runtime] runtime 已停止：" + runtimeId);
    } catch (e) {
      logApp("warn", "[managed-runtime] runtime.stop 失败（宿主可能已回收）：" + errText(e));
    }
  }
}

/** apply disposer 收尾（幂等）：停 runtime、清单例。 */
export async function disposeManagedRuntime() {
  await stopManagedRuntime();
  resetManagedRuntime();
```

</details>

**依据 6 · 源码核查**：[packages/host/src/main.ts:601-623](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/host/src/main.ts#L601-L623)

桥挂载失败仍写readyMarker。

<details>
<summary>查看原文（23行）</summary>

```text
  try {
    state.stopBridge = startTaskBridge({
      ctx: boot.ctx,
      hana,
      bindings,
      serviceBaseUrl, // 宿主任务取消反向触发 → 本进程 DSH session.cancel（只本会话，经中继）
      bridgeKey: opts.bridgeKey,
      log: (s) => info("bridge", s),
    });
  } catch (e) {
    err("bridge", "task-bridge 挂载失败（任务终态将无回投）：" + errText(e));
  }
  try {
    state.stopApproval = startApprovalBridge({
      ctx: boot.ctx,
      hana,
      bindings,
      log: (s) => info("approval", s),
    });
  } catch (e) {
    err("approval", "approval-bridge 挂载失败（DSH 越界审批将 fail-closed）：" + errText(e));
  }
  process.stdout.write(opts.readyMarker + "\n");
```

</details>

**依据 7 · 源码核查**：[packages/runtime/src/data-source.ts:53-66](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/runtime/src/data-source.ts#L53-L66)

默认private设置。

<details>
<summary>查看原文（14行）</summary>

```text
  mode: "private",
  path: null,
  profile: PRIVATE_PROFILE,
  approvalTimeoutSec: APP_SETTING_DEFAULTS.approvalTimeoutSec,
  defaultTimeoutSec: APP_SETTING_DEFAULTS.defaultTimeoutSec,
  sessionModelMode: APP_SETTING_DEFAULTS.sessionModelMode,
  sessionModelProvider: APP_SETTING_DEFAULTS.sessionModelProvider,
  sessionModelModel: APP_SETTING_DEFAULTS.sessionModelModel,
  sessionModelReasoningEffort: APP_SETTING_DEFAULTS.sessionModelReasoningEffort,
  // 强制跟随宿主主题的面：声明与缺省都住在 shared（见该模块头注），这里只引不复制。
  // 之所以不落进 config.ts 的 APP_SETTING_DEFAULTS：那份缺省是给**不经过本存储**的消费者用的
  // （cancel-chain 直读 config.json 的 global.*），这张表没有那样的消费者——设置页与壳页都走
  // GET /dshana/settings。本表的完整缺省单点就是这里。
  forceFollowFaces: [...FORCE_FOLLOW_FACES],
```

</details>

**依据 8 · 源码核查**：[packages/runtime/src/data-source.ts:157-190](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/runtime/src/data-source.ts#L157-L190)

仍支持shared配置验证。

<details>
<summary>查看原文（34行）</summary>

```text
 * 设置校验（纯函数）：未知键拒绝、mode 限定、shared 必须是绝对路径、profile 简单名、
 * 两个超时必须是非负整数秒、会话模型模式与自定义选择、强制跟随宿主主题的面必须是候选面
 * （词表外的值/重复项一律拒，见 shared/face-theme.ts）。
 * private 的 profile 被强制为 PRIVATE_PROFILE（内置目录只跑这一个 profile）。
 */
export function validateSettings(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("DSH 数据来源设置必须是对象");
  }
  const unknown = Object.keys(input).filter((k) => !SETTINGS_KEYS.includes(k));
  if (unknown.length) throw new Error("DSH 数据来源设置含未知键：" + unknown.join("、"));
  if (!SOURCE_MODES.includes(input.mode)) {
    throw new Error("数据来源模式只能是 private 或 shared（收到 " + JSON.stringify(input.mode) + "）");
  }
  const profile = input.mode === "private" ? PRIVATE_PROFILE : input.profile;
  if (typeof profile !== "string" || !PROFILE_RE.test(profile) || profile.includes("..")) {
    throw new Error("profile 必须是简单名（字母或数字开头，只含字母/数字/._-，≤64 字符）；收到 " + JSON.stringify(profile));
  }
  if (input.mode === "shared") {
    if (typeof input.path !== "string" || !input.path || input.path.includes("\0")) {
      throw new Error("shared 模式必须给出 DSH 数据目录（非空字符串，不含 NUL）");
    }
    if (!isAbsolute(input.path)) throw new Error("shared 目录必须是绝对路径（收到 " + input.path + "）");
    return {
      mode: "shared",
      path: normalize(input.path),
      profile,
      ...normalizeTimeouts(input),
      ...normalizeSessionModel(input),
      ...normalizeForceFollowFaces(input),
    };
  }
  return {
    mode: "private",
```

</details>

#### 缺口

- 未检查Hana宿主实际能力授权/回收、zip完整性或启动运行。
  **影响**：不能承诺受管权限隔离、部署即用和完整桥就绪。
  **进一步探讨**：在专用Hana配置验App/runtime/task/approval四状态，确认实际进程和数据位置。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 任务接受、完成、取消分别落到哪？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

open要求绝对cwd和宿主callToken，先ctx.tasks.create绑定来源/next-step投递，起runtime/建立DSH会话，再写task metadata中的sessionId/rpcId，发session/prompt。ready仅在prompt接受后返回定位键，工具立刻说后台执行；之后promise轮询宿主终态并释放同会话串行槽，不等业务产物。metadata更新抛错会失败，但返回无taskId只warn继续，所以不要把“调用返回”当绑定已确认的强保证。

task bridge把DSH running=false或正常turn-end判ok，pendingFailure/error/取消另判；最终Hana complete只带定位结果，不带业务证明。settle先设this.settled，再调用宿主complete/fail/cancel；回投失败仅日志，当前tracker不再逐帧重试，存在DSH已停但Hana终态未确认的条件性风险，未复现。App轮询无最终退出界限，超时触发一次cancel后仍等宿主终态，不能保证配置任务超时后立即返回。

close取消工具只发请求，后台确认窗后升级tasks.cancel；升级失败为unresolved。超时也走同链，模型流按会话requestId取消。宿主cancel成功/任务canceled仍不等外部命令已无副作用，local-machine操作不能回滚；runtime.stop失败状态也需回看实际进程。结果未知时先get/查宿主与DSH，避免重复open造成两次工作。

#### 证据与依据

**依据 1 · 源码核查**：[packages/tools/src/actions/open.ts:52-81](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/tools/src/actions/open.ts#L52-L81)

只等ready即返回running。

<details>
<summary>查看原文（30行）</summary>

```text
export async function run(input: OpenInput, ctx: ToolCtx, deps?: SubmitDeps): Promise<ToolResult> {
  const callToken = (input && input.context && input.context.callToken) || "";
  // 提交面（deps 可注入以单测 open 分支；缺省用真实 submitDshTask）返回 { promise, ready }：
  // ready 在 prompt 被 DSH 接受后 resolve 定位键（sessionId/rpcId/taskId），提交阶段失败则
  // reject（错误上抛给工具面）；promise 是后台生命周期（等 task 终态、释放串行锁），本处不 await。
  const submit = deps && typeof deps.submitDshTask === "function" ? deps.submitDshTask : submitDshTask;
  const { ready } = submit({ action: "create", input, callToken, log: ctx && ctx.log });
  const loc = await ready;
  const sid = String(loc.sessionId || "");
  const rpc = String(loc.rpcId || "");
  const text =
    "已开启 DSH 子代理（open）：taskId " + loc.taskId + "（后续续/关优先用它），sessionId " + sid + "，rpcId " + rpc +
    (loc.cwd ? "，cwd " + loc.cwd : "") +
    "。任务在后台执行，完成/失败按 " + loc.delivery + " 档投递回本会话（下一个输入点自动贴回，不必为等结果结束回合）；要看执行过程或最终结论用 dshana action=get（taskId " +
    loc.taskId + "）。";
  // 会话卡：一个会话一张把手（reply 不挂，避免叠）。聊天流里只画一行坐标，不注入 iframe；
  // 用户把这张卡取出到黑板 / 拆窗后，同一页才装配 DSH 现场（见 packages/ui/src/app.ts）。
  return {
    content: [{ type: "text", text }],
    details: {
      dsh: {
        action: "open",
        sessionId: sid,
        rpcId: rpc,
        taskId: loc.taskId,
        status: "running",
        delivery: loc.delivery,
        cwd: loc.cwd || undefined,
      },
      card: sessionCard({ action: "open", sessionId: sid, taskId: loc.taskId, delivery: loc.delivery, cwd: loc.cwd }),
```

</details>

**依据 2 · 源码核查**：[packages/session/src/session-run.ts:389-405](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/session/src/session-run.ts#L389-L405)

创建cwd与callToken门禁。

<details>
<summary>查看原文（17行）</summary>

```text
export function submitDshTask({ action, input, callToken, log }: DshSubmitInput): DshSubmitHandle {
  const parsed = normalizeCreateSend({ action, input });
  // 只验 create：send 的 cwd 沿用会话已有值，而那一刻的目录在建立会话时已经验过
  if (parsed.action === "create") assertAbsoluteSessionCwd(parsed.cwd);
  const ctx = appCtx();
  const dataDir = appDataDir();
  if (!ctx || !dataDir) {
    throw new Error("App runtime not initialized (apply did not inject host ctx/dataDir)");
  }
  if (!ctx.tasks || typeof ctx.tasks.create !== "function") {
    throw new Error("host ctx.tasks unavailable (missing the app/tasks.manage capability grant)");
  }
  const token = String(callToken || "").trim();
  if (!token) {
    throw new Error(
      "create/send requires the host tool-call callToken (it binds the task to its source session); run this tool from the model tool-call path (context.callToken is missing)",
    );
```

</details>

**依据 3 · 源码核查**：[packages/session/src/session-run.ts:444-474](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/session/src/session-run.ts#L444-L474)

宿主任务来源与next-step。

<details>
<summary>查看原文（31行）</summary>

```text
      // ① Hana task 创建（callToken 专用一次；taskId 是稳定句柄）
      let task;
      try {
        task = await ctx.tasks.create({
          callToken: token,
          label: taskLabel,
          // 档位显式声明：宿主默认就是这两个（有令牌 ⇒ session；delivery 默认 next-turn），
          // 写出来是为了不吃隐式默认——改默认值不会静默改变本 App 的形状（APPS.md
          // “后台任务与审批”节：档位只在创建时确定，update 改不了）。
          // 我们要 next-step：结果贴回下一个输入点，不必让模型为等结果结束回合。
          // create 时 DSH 会话尚未诞生，sessionId 由建会话后的 update 回写。
          scope: "session",
          delivery: TASK_DELIVERY,
          // 工具面不挂流内卡，对话底部的任务 chip 是这道会话唯一的常驻可见入口；
          // 显式 show 与上面两档同理，不吃隐式默认。
          chipVisibility: "show",
          metadata: {
            dsh: {
              action: parsed.action,
              cwd: parsed.cwd || undefined,
              sessionId: parsed.sessionId || undefined,
              // 提示词摘要**不进**宿主记录：那是用户内容，宿主任务记录是共享面。
              timeoutSec: parsed.timeoutSec || undefined,
            },
          },
        });
      } catch (e) {
        throw new Error("failed to create the Hana task: " + errText(e));
      }
      taskId = task && task.taskId;
      if (!taskId) throw new Error("ctx.tasks.create did not return taskId (host contract violation)");
```

</details>

**依据 4 · 源码核查**：[packages/session/src/session-run.ts:571-640](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/session/src/session-run.ts#L571-L640)

绑定、prompt、ready和后台终态。

<details>
<summary>查看原文（70行）</summary>

```text
      // ⑤ 绑定回写宿主任务记录（先于 prompt；rpcId = prompt requestId = jsonl
      //    data.source.rpcId 关联键）。这份 metadata.dsh 就是全部下游的绑定事实源：
      //      · 受管 runtime 的 task-bridge / approval-bridge 按 sessionId 找 taskId；
      //      · provider 身份判定按 sessionId 决定带不带 taskId；
      //      · 句柄路径（taskId/approvalId）按它解析会话。
      //    执行超时与审批超时也随它下传（受管 runtime 读不到 App settings；0 = 宿主不自动拒绝）。
      //    写全量 dsh 对象：tasks.update 的 metadata 是整体替换还是浅合并，宿主契约没写死，
      //    给全量在两种语义下都正确。写失败抛错——绑定没落地 = 任务拿不到结果，不能当没事。
      const rpcId = nextRpcId();
      const timeoutSec = resolveTaskTimeoutSec(parsed.timeoutSec);
      const approvalTimeoutMs = resolveApprovalTimeoutMs();
      const back = await ctx.tasks.update(taskId, {
        metadata: dshMetadataFor(task || {}, {
          action: parsed.action,
          cwd: parsed.cwd || undefined,
          sessionId,
          rpcId,
          timeoutSec,
          approvalTimeoutMs,
        }),
      });
      if (!back || !back.taskId) {
        logLine(log, "[dsh-session][warn] 宿主任务绑定回写未确认（task=" + taskId + "）");
      }
      // ⑥ prompt（fire：{ accepted:true } 立即返回）：模型选择随这次 prompt 下传（send 路径）
      await rpcCall(ctx, base, {
        method: "session/prompt",
        rpcId,
        payload: {
          sessionId,
          mode: "queue",
          content: [{ type: "text", text: parsed.taskText }],
          ...(modelSelection ? { model: modelSelection } : {}),
        },
      });
      logLine(log, "[dsh-session] prompt 已提交（" + parsed.action + "）session=" + sessionId + " rpcId=" + rpcId);
      // ready 后 execute 可返回；本后台继续等 task 终态（释放串行化锁）
      const loc = {
        action: parsed.action,
        sessionId,
        rpcId,
        taskId,
        delivery: TASK_DELIVERY,
        cwd: established.effectiveCwd || parsed.cwd || null,
      };
      resolveReady(loc);
      // 后台等到终态（child task-bridge complete/fail/canceled → 宿主投递来源会话）。
      // 执行超时：超时走 cancel 链（不是只 fail task——超时/撤销不默认
      // 批准、不给假成功）；超时确认也复用取消确认窗口（DSH 未确认时升级宿主 cancel）。
      const rec = await waitTaskTerminalWithTimeout(ctx, taskId, sessionId, timeoutSec, log);
      logLine(log, "[dsh-session] task 终态 " + ((rec && rec.status) || "?") + "（session=" + sessionId + "）");
      return loc;
    } catch (e) {
      // 提交阶段失败：任务 fail（已建时）+ ready reject。绑定记录的终态由宿主状态承担
      // （fail 之后宿主记录 status=failed，读侧即按“已终结”处理），不另写一份结束标记。
      if (taskId) {
        const msg = "DSH task submission failed (" + parsed.action + "): " + errText(e);
        await failTask(ctx, taskId, msg);
        const err = new Error(msg) as Error & { sessionId?: string };
        if (sessionId) err.sessionId = sessionId;
        rejectReady(err);
      } else {
        rejectReady(e);
      }
      throw e;
    } finally {
      if (releaseNewSessionTurn) {
        try { releaseNewSessionTurn(); } catch { /* 忽略 */ }
        releaseNewSessionTurn = null;
      }
```

</details>

**依据 5 · 源码核查**：[packages/host/src/task-bridge.ts:189-218](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/host/src/task-bridge.ts#L189-L218)

回合/排空与错误归类。

<details>
<summary>查看原文（30行）</summary>

```text
  async onFrame(frame) {
    if (this.settled) return;
    if (!(await this.load())) return; // 非本 App 发起会话：忽略
    this.ensureHostWatch(); // 绑定就绪即开始宿主任务 watch（宿主取消反向触发覆盖整个任务期）
    if (frame.kind === "status") {
      if (frame.running) {
        await this.markRunning();
        return;
      }
      // running=false：整轮排空终态（v1 finishFromProjection 语义）
      await this.settle(this.pendingFailure ? { ok: false, message: this.pendingFailure } : { ok: true });
      return;
    }
    if (frame.kind === "error") {
      if (frame.message) this.pendingFailure = frame.message;
      return;
    }
    if (frame.kind === "turn-end") {
      if (frame.errorKind) {
        await this.settle({
          ok: false,
          aborted: frame.errorKind === "aborted",
          message: frame.errorKind === "aborted" ? "DSH 回合被中止（aborted）" : frame.message || "DSH 回合失败（reason.kind=error）",
        });
      } else {
        // 正常回合结束 = 成功终态（v1 turn/end completed 语义；pendingFailure 兜底）
        await this.settle(this.pendingFailure ? { ok: false, message: this.pendingFailure } : { ok: true });
      }
      return;
    }
```

</details>

**依据 6 · 源码核查**：[packages/host/src/task-bridge.ts:357-397](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/host/src/task-bridge.ts#L357-L397)

终态定位结果、先settled后回投、失败日志。

<details>
<summary>查看原文（41行）</summary>

```text
  async settle(decision) {
    if (this.settled || !this.taskId) return;
    this.settled = true;
    this.stopHostWatch();
    const { ok, message } = decision || {};
    // 本进程亲手请求过取消（hostCancelDone）也算：那是我们发出的动作，不依赖记录回读是否及时。
    let cancel = this.hostCancelDone || (decision && decision.cancelOverride === true);
    // 取消标记的权威格是宿主任务记录：终态判定前 fresh 读一次（App 侧先写标记再发 RPC）。
    // 读不出（宿主一跳抖动/畸形）时重试，仍读不出则按“已请求取消”结算——取消状态未知时
    // 宁可结算成 canceled，也不把不确定当成成功（否则用户请求的取消会被记成 completed）。
    if (!cancel) cancel = await this.cancelMarkedRetry();
    try {
      if (this.hana && this.hana.tasks) {
        if (cancel && typeof this.hana.tasks.cancel === "function") {
          const msg = String(message || (ok ? "已请求取消" : "DSH 任务取消")).slice(0, 2000);
          await this.hana.tasks.cancel(this.taskId, msg);
        } else if (ok) {
          const result = {
            dsh: {
              action: (this.binding && this.binding.action) || null,
              sessionId: this.sessionId,
              rpcId: (this.binding && this.binding.rpcId) || "",
              status: "completed",
              ok: true,
            },
          };
          await this.hana.tasks.complete(this.taskId, result);
        } else {
          const msg = String(message || "dsh 任务失败").slice(0, 2000);
          await this.hana.tasks.fail(this.taskId, msg);
        }
      }
    } catch (e) {
      // 终态回投失败：任务可能已被他方终态（App 卸载/取消/宿主已终态）——幂等语义，忽略
      this.note("任务终态回投失败（task=" + this.taskId + "）：" + ((e as any)?.message || e));
    } finally {
      // 终态回投改了宿主任务记录（status），让本进程的绑定索引下次重建，别把活动态读成陈旧值。
      try {
        if (this.bindings && typeof this.bindings.invalidate === "function") this.bindings.invalidate();
      } catch { /* 忽略 */ }
    }
```

</details>

**依据 7 · 源码核查**：[packages/session/src/session-run.ts:176-220](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/session/src/session-run.ts#L176-L220)

无界轮询与超时只触发取消。

<details>
<summary>查看原文（45行）</summary>

```text
/** 后台等到 Hana task 终态（complete/failed/canceled/aborted；轮询 get，无 SSE 复杂度）。 */
async function waitTaskTerminal(ctx, taskId, log, pollMs = 1200) {
  for (;;) {
    let rec: any = null;
    try {
      rec = await ctx.tasks.get(taskId);
    } catch (e) {
      log?.warn?.("[dsh-session] tasks.get 查询失败：" + errText(e));
    }
    const st = rec && rec.status;
    if (st && ["completed", "failed", "canceled", "aborted"].includes(String(st))) {
      return rec;
    }
    await sleep(pollMs);
  }
}

/**
 * 带执行超时的终态等待：timeoutSec（秒）内未终态 → 走 cancel 链（
 * 执行超时 = 取消，不是只标失败）；超时后仍继续等到任务终态（cancel 已确认/升级后宿主
 * 终态到达）。timeoutSec <= 0 时等价 waitTaskTerminal（无限等）。超时计时 unref（不阻断
 * App 进程退出）。
 */
async function waitTaskTerminalWithTimeout(ctx, taskId, sessionId, timeoutSec, log, pollMs = 1200) {
  const ms = Number(timeoutSec) > 0 ? Math.round(Number(timeoutSec)) * 1000 : 0;
  let fired = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const fire = async () => {
    if (fired) return;
    fired = true;
    logLine(log, "[dsh-session] 任务执行超时（" + Math.round(ms / 1000) + "s）——走 cancel 链（session=" + sessionId + "）");
    try {
      await cancelSessionWork({ sessionId, reason: "timeout", log });
    } catch (e) {
      log?.warn?.("[dsh-session] 超时 cancel 链失败：" + errText(e));
    }
  };
  if (ms > 0) {
    timer = setTimeout(() => { void fire(); }, ms);
    if (typeof timer.unref === "function") timer.unref();
  }
  try {
    return await waitTaskTerminal(ctx, taskId, log, pollMs);
  } finally {
    if (timer) clearTimeout(timer);
```

</details>

**依据 8 · 源码核查**：[packages/session/src/cancel-chain.ts:200-223](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/session/src/cancel-chain.ts#L200-L223)

确认/升级/未解决。

<details>
<summary>查看原文（24行）</summary>

```text
export async function settleCancelTerminal({ taskId, sessionId, reason, confirmMs = CANCEL_CONFIRM_MS, log, deps = {} }: SettleInput): Promise<CancelSettlement> {
  if (!taskId) return { settled: "unresolved" };
  const waitTerminal =
    deps.awaitTerminal || ((a: { taskId: string; timeoutMs: number; log?: any }) => awaitCancelTerminal(a));
  const terminal = await waitTerminal({ taskId, timeoutMs: confirmMs, log });
  if (terminal) return { settled: "terminal", terminal };
  // 升级兜底：宿主任务先 cancel（真实取消状态仍要保证；DSH 若真未停，日志/边界记录）
  const escalate = deps.cancelHostTask || defaultCancelHostTask;
  try {
    await escalate(taskId, String(reason || CANCEL_ESCALATE_REASON));
    logWarn(log, "[dsh-session] 取消超窗未获 DSH 确认，升级宿主 cancel（session=" + String(sessionId || "") + " task=" + taskId + "）");
    return { settled: "escalated" };
  } catch (e) {
    logWarn(log, "[dsh-session] 取消升级 ctx.tasks.cancel 失败：" + errText(e));
  }
  return { settled: "unresolved" };
}

/** 缺省升级实现：宿主 ctx.tasks.cancel（无宿主/无该 API 时报错，由调用方落成 unresolved）。 */
async function defaultCancelHostTask(taskId: string, reason: string): Promise<void> {
  const ctx = appCtx();
  if (!ctx || typeof ctx.tasks?.cancel !== "function") throw new Error("host does not support ctx.tasks.cancel");
  await ctx.tasks.cancel(taskId, reason);
}
```

</details>

**依据 9 · 源码核查**：[packages/session/src/cancel-chain.ts:235-251](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/session/src/cancel-chain.ts#L235-L251)

工具请求不等后台收尾。

<details>
<summary>查看原文（17行）</summary>

```text
export async function requestCancel({ sessionId, reason, log, confirmMs = CANCEL_CONFIRM_MS, deps = {} }: {
  sessionId: string;
  reason?: string;
  log?: any;
  confirmMs?: number;
  deps?: CancelDeps;
}): Promise<CancelWorkResult> {
  const runCancel =
    deps.executeCancel || ((a: { sessionId: string; reason?: string; log?: any }) => executeCancel(a));
  const settle = deps.settle || settleCancelTerminal;
  const res = await runCancel({ sessionId, reason, log });
  if ((res.status !== "cancelling" && res.status !== "dsh-rpc-failed") || !res.taskId) return res;
  const taskId = String(res.taskId);
  void Promise.resolve()
    .then(() => settle({ taskId, sessionId: res.sessionId, reason, confirmMs, log }))
    .catch((e) => logWarn(log, "[dsh-session] 取消结算异常：" + errText(e)));
  return res;
```

</details>

**依据 10 · 源码核查**：[packages/host/src/model-requests.ts:32-44](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/host/src/model-requests.ts#L32-L44)

按会话定向取消模型流。

<details>
<summary>查看原文（13行）</summary>

```text
/** 定向取消一个会话的全部活动模型流（只停该会话的 requestId；幂等）。 */
export async function cancelSessionModelRequests(hana, sessionId) {
  const map = activeModelRequestMap();
  const set = map && typeof map.get === "function" ? map.get(sessionId) : null;
  if (!set || !hana || !hana.models || typeof hana.models.cancel !== "function") return;
  for (const requestId of [...set]) {
    try {
      await hana.models.cancel(requestId);
    } catch {
      /* 单请求取消失败继续（宿主流已断等场景） */
    }
  }
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 审批、句柄归属和模型凭据实际怎样接？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

审批桥对有效且活跃task绑定认领DSH approval/request；绑定读取异常直接rejected，无绑定/已终态委托其他应答者，不隐式放行。以宿主taskId创建approval并带操作摘要，默认30秒策略传timeoutMs，0显式禁自动拒绝；计时/应答权威是Hana实现，不是本桥独立计时器。parentTaskId不符拒绝，watch/get终态allowed-once或rejected再结算DSH等待者，终态无outcome拒绝；DSH abort尝试拒绝宿主审批并让本地等待cancelled，watch异常拒绝。批准只是本次等待者决定，不证明工具完成。

工具approve先解析目标，再核approval父task绑定确属session，拒重复；调用respondApproval成功才返回，但默认outcome未写即allowed-once，故使用者应明确拒/准。句柄taskId/approvalId路径会比来源sessionPath，缺父来源拒绝；显式sessionId则只校形态并跳来源归属，没sessionPath也放行，意图是用户卡片/跨对话凭证。不能把不易猜的ID当严格租户隔离，真正来电身份/ID保护还依Hana。

模型adapter实际调用hana.models.stream，携provider/model/messages/tools和task身份；活绑定必带taskId，无绑定或task终态走App身份，索引缺/读取失败报错而不静默降级。流缺done报错，abort发cancel并按requestId登记清理。这支持provider凭据由宿主处理的架构，但不宣称全进程不会接触用户文件中的凭据：runtime是local-machine。未审完整bridge/UI原型注入/宿主鉴权；随机key中继是真实机制而非公网安全保证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/host/src/approval-bridge.ts:343-386](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/host/src/approval-bridge.ts#L343-L386)

绑定认领与timeout策略。

<details>
<summary>查看原文（44行）</summary>

```text
  async function answerer(req: DshApprovalRequestLike, next: () => unknown) {
    const sessionId = approvalSessionIdOf(req);
    if (!sessionId || !isValidSessionId(sessionId)) {
      // 未知/畸形会话：不认领（next 委托其他应答者；无应答者 DSH fail-closed）
      return next();
    }
    // 绑定读取失败（宿主不可达/记录畸形）与"没有绑定"必须分开：前者不能委托给别的应答者
    // 假装无事发生（那会把"状态丢了"变成 DSH 的 fail-closed 拒绝，掩盖真因），显式拒绝并记日志。
    let binding;
    try {
      binding = await index.bySession(sessionId, { fresh: true });
    } catch (e) {
      note("审批会话绑定读取失败（fail-closed 拒绝，不委托）：" + errText(e));
      return "rejected";
    }
    if (!binding) {
      // 非 dshana 工具发起的会话（如 DSH Web UI 直开）：没有宿主 task scope，
      // 无法 requestApproval——委托（DSH 无应答者时 fail-closed，不隐式放行）
      note("审批无任务绑定（session=" + sessionId.slice(0, 12) + "）——委托，不认领");
      return next();
    }
    // 绑定指向的任务已终结：会话是 dshana 建的，但用户收尾后在同一会话里接着跑（WebUI 直开，
    // 绑定按 createdAt 取到的最新一条仍是那条旧任务）。审批挂到已终结的父任务上不会被任何一层
    // 拦住——宿主归属校验只比 parentTaskId → 父任务 sessionId，会话确实一致。按"无绑定"处理：
    // 这条审批没有属于它的活动父任务，交给别的应答者（同为 fail-closed，不隐式放行）。
    if (isTerminalTaskStatus(binding.status)) {
      note(
        "审批绑定的宿主任务已终结（session=" + sessionId.slice(0, 12) + " task=" + String(binding.taskId) +
          " status=" + String(binding.status) + "）——按无绑定委托，不认领",
      );
      return next();
    }
    const callId = (req && req.callId) || null;
    const cached = callId ? cache.get(sessionId, callId) : null;
    const toolName = (req && req.toolName) || (cached && cached.name) || "tool";
    const args = previewArgs((cached && cached.args) || null);
    const reason = (req && req.reason) || null;
    const rpcId = binding.rpcId || "";
    // 缺省（null / 非有限数）落回 DEFAULT；显式 0 是“宿主不自动拒绝”的既定语义，原样保留。
    const configuredTimeoutMs = binding.approvalTimeoutMs;
    const timeoutMs =
      typeof configuredTimeoutMs === "number" && Number.isFinite(configuredTimeoutMs) && configuredTimeoutMs >= 0
        ? configuredTimeoutMs
        : DEFAULT_APPROVAL_TIMEOUT_MS;
```

</details>

**依据 2 · 源码核查**：[packages/host/src/approval-bridge.ts:395-450](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/host/src/approval-bridge.ts#L395-L450)

本地一次结算/abort与宿主审批创建。

<details>
<summary>查看原文（56行）</summary>

```text
    const pending = new Promise<DshApprovalVerdict>((resolve) => {
      settleOutcome = (outcome) => {
        if (settled) return;
        settled = true;
        if (cancelWatch) { try { cancelWatch(); } catch { /* 忽略 */ } cancelWatch = null; }
        if (entry.approvalId) { try { pendings.delete(entry); } catch { /* 忽略 */ } }
        resolve(outcome);
      };
    });
    // req.signal 中止 = DSH 回合取消/中止：宿主审批收尾为 rejected（不留孤儿），
    // DSH 等待者 resolve 'cancelled'（不是 allowed-once——取消绝不当授权，v1 教训）。
    // approvalId 到手前 doRespond 还不存在，这时只记下"已中止"：拿到 approvalId 之后按它收尾
    // （此刻默默什么都不做，宿主就留下一条永不结算的挂起审批，而 DSH 侧已认为回合取消）。
    const signal = req && req.signal;
    const rejectHostApproval = () => {
      if (!doRespond) return;
      try { doRespond("rejected").catch(() => {}); } catch { /* 忽略 */ }
    };
    let abortRequested = false;
    const onAbort = () => {
      if (settled) return;
      abortRequested = true;
      rejectHostApproval();
      settleOutcome("cancelled");
    };
    if (signal) {
      if (signal.aborted) onAbort();
      else signal.addEventListener("abort", onAbort, { once: true });
    }
    // 宿主审批创建
    // 具体操作一句（label 的实义部分）+ 申请的权限档：审批方要判的第一件事
    const operation = summarizeOperation(toolName, args);
    const escalation = describeEscalation(args);
    let approval: AppTaskApprovalRecordV2 | null = null;
    try {
      const request: AppTaskApprovalRequestV2 = {
        taskId: binding.taskId,
        label: buildApprovalLabel(toolName, operation, escalation),
        details: {
          dshSessionId: sessionId,
          rpcId,
          toolName,
          operation,
          ...(escalation ? { escalationMode: escalation.mode, escalationNote: escalation.note } : {}),
          ...(callId ? { callId } : {}),
          ...(reason ? { reason } : {}),
          ...(args ? { args } : {}),
          approvalTimeoutMs: timeoutMs,
          kind: "dsh-approval",
        },
        timeoutMs,
      };
      approval = await hana.tasks.requestApproval(request);
    } catch (e) {
      note("requestApproval 失败（fail-closed）：" + errText(e));
      settleOutcome("rejected"); // 创建失败 = 无法等待 = fail closed（绝不放行）
```

</details>

**依据 3 · 源码核查**：[packages/host/src/approval-bridge.ts:475-528](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/host/src/approval-bridge.ts#L475-L528)

父task比较、watch与错误拒绝。

<details>
<summary>查看原文（54行）</summary>

```text
    // 与宿主审批记录已经漂移——这种情况把审批结算成 rejected（fail-closed，绝不放行），
    // 不继续等一个可能属于别人的结果。
    if (!approvalOwnsTask(approval, binding.taskId)) {
      note(
        "审批 parentTaskId 与绑定不一致（宿主 " + String((approval && approval.parentTaskId) || "缺失") +
          " / 绑定 " + String(binding.taskId) + "）：fail-closed 拒绝",
      );
      try { await doRespond?.("rejected"); } catch { /* 尽力：宿主侧拒绝失败也仍投 rejected */ }
      settleOutcome("rejected");
      return pending;
    }
    // 立即按请求创建结果结算一次（宿主可能已即时终态——如父任务刚结束）
    const immediate = approvalOutcomeOf(approval);
    if (immediate) {
      note("审批 " + approvalId.slice(0, 12) + " 已即时终态：" + immediate);
      settleOutcome(immediate);
      return pending;
    }
    entry.approvalId = approvalId;
    pendings.add(entry);
    // watch(approvalId) 等宿主终态（SSE snapshot + app-task；断线 get() 对账）
    const stopFlag = { value: false };
    const watcher = (async () => {
      try {
        await runWatchReconcile({
          watch: () => hana.tasks.watch(approvalId),
          get: () => hana.tasks.get(approvalId),
          onFrame: async (rec, kind) => {
            if (settled || stopFlag.value) return false;
            if (kind === "snapshot" || kind === "app-task") {
              const outcome = approvalOutcomeOf(rec);
              if (outcome) {
                note("审批 " + approvalId.slice(0, 12) + " 终态 outcome=" + outcome + " → 投递 DSH 等待者");
                settleOutcome(outcome);
                return false; // 结算完成，结束 watch
              }
            }
            return true;
          },
          shouldStop: () => settled || stopFlag.value,
          retryBaseMs: 1000,
          maxRetryMs: 15000,
          log: (m) => note(m),
        });
      } catch (e) {
        note("审批 watch 异常（fail-closed）：" + errText(e));
        if (!settled) settleOutcome("rejected");
      } finally {
        try { pendings.delete(entry); } catch { /* 忽略 */ }
      }
    })();
    cancelWatch = () => { stopFlag.value = true; };
    void watcher;
    return pending;
```

</details>

**依据 4 · 源码核查**：[packages/shared/src/watch-sse.ts:27-42](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/shared/src/watch-sse.ts#L27-L42)

approval outcome真实映射。

<details>
<summary>查看原文（16行）</summary>

```text
export const TERMINAL_STATUSES = ["completed", "failed", "canceled", "aborted"];

/** 终态判定（纯函数）：宿主记录 status 是否已达终态。 */
export function recordIsTerminal(rec) {
  return !!(rec && TERMINAL_STATUSES.includes(String(rec.status)));
}

/** 审批终态 → ApprovalOutcome 投递判定（纯函数，防隐式放行）：
 *   allowed-once/rejected 按宿主 outcome 原样投给 DSH 等待者；
 *   终态无 outcome（被宿主在父任务结束/撤销时关闭）→ 'rejected'（fail closed）；
 *   未终态/无 approvalId → null（继续等）。 */
export function approvalOutcomeOf(rec) {
  if (!rec || !rec.approvalId) return null;
  if (rec.outcome === "allowed-once" || rec.outcome === "rejected") return rec.outcome;
  if (recordIsTerminal(rec)) return "rejected";
  return null;
```

</details>

**依据 5 · 源码核查**：[packages/session/src/approve-respond.ts:38-98](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/session/src/approve-respond.ts#L38-L98)

approve默认准许、父绑定/重复检查与实际respond。

<details>
<summary>查看原文（61行）</summary>

```text
export async function respondApprovalAction({ input, log }): Promise<ToolResult> {
  const sessionId = String((input && input.sessionId) || "").trim();
  const approvalId = String((input && input.approvalId) || "").trim();
  const outcome = input && input.outcome === "rejected" ? "rejected" : "allowed-once";
  if (!sessionId) throw new Error("approve requires sessionId (the DSH session the approval belongs to)");
  if (!approvalId) throw new Error("approve requires approvalId (carried in the approval notice; one task can have several pending approvals, answer them one by one)");

  const ctx = appCtx();
  if (!ctx) throw new Error("App runtime not initialized (apply did not inject host ctx/dataDir)");
  if (!ctx.tasks || typeof ctx.tasks.respondApproval !== "function") {
    throw new Error("host ctx.tasks.respondApproval unavailable (missing the app/tasks.manage capability grant)");
  }

  // 归属校验的事实源是宿主记录：审批记录自带 parentTaskId，父任务的 metadata.dsh.sessionId
  // 必须等于调用方给的会话。不一致/缺失一律拒绝（宁可拒绝一次，不拿来源不明的审批去结算）。
  const approval = await readRecord(ctx, approvalId);
  if (!approval) throw new Error("approval " + approvalId + " not found (it may have been reclaimed or the host record cleared)");
  const parentTaskId = typeof (approval as any).parentTaskId === "string" ? String((approval as any).parentTaskId) : "";
  if (!parentTaskId) {
    throw new Error("the host record of approval " + approvalId + " lacks parentTaskId (invalid state); rejected fail-closed");
  }
  const parent = await readRecord(ctx, parentTaskId);
  const binding = taskBindingOf(parent);
  if (!binding || binding.dshSessionId !== sessionId) {
    throw new Error(
      "approval " + approvalId + " does not belong to session " + sessionId + " (host record points to " +
        (binding ? binding.dshSessionId : "no binding") + "); rejected fail-closed",
    );
  }
  const already = (approval as any).outcome;
  if (already === "allowed-once" || already === "rejected") {
    throw new Error("approval " + approvalId + " was already answered (" + already + "); do not answer again");
  }

  // 结算宿主审批（权威决策源）；失败（已超时/他方已应答/宿主已终态）直接抛给 Agent
  let settled: SettledApproval | null = null;
  try {
    settled = await ctx.tasks.respondApproval({ approvalId, outcome });
  } catch (e) {
    const msg = errText(e);
    throw new Error("approval answer not accepted (" + msg.slice(0, 300) + "): it may have timed out or been handled by another party; the task side observes the terminal state on its own");
  }

  const verb = outcome === "allowed-once" ? "已放行" : "已拒绝";
  return {
    content: [
      {
        type: "text",
        text:
          verb + "审批 " + approvalId +
          "。决策只投给该审批对应的 DSH 等待者（allowed-once 仅放行本次操作）；DSH 侧继续/收尾结果随后续任务通知送达。",
      },
    ],
    details: {
      dsh: {
        action: "approve",
        sessionId,
        approvalId,
        taskId: parentTaskId,
        outcome,
        accepted: !!(settled && ((settled as any).outcome || (settled as any).status)),
```

</details>

**依据 6 · 源码核查**：[packages/tools/src/shared/target.ts:45-81](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/tools/src/shared/target.ts#L45-L81)

显式ID退路与句柄归属真实调用。

<details>
<summary>查看原文（37行）</summary>

```text
  if (explicit) {
    if (!isValidSessionId(explicit)) {
      throw new Error("malformed sessionId (expected session-<uuid>): " + explicit);
    }
    return { sessionId: explicit, explicit: true, taskId: null, ownership: "explicit-session-id" };
  }
  const taskIdIn = String((input && input.taskId) || "").trim();
  const approvalIdIn = String((input && input.approvalId) || "").trim();
  if (!taskIdIn && !approvalIdIn) {
    throw new Error("a target is required: pass taskId (default, handle path) or sessionId (explicit credential path)");
  }
  // 句柄 → 宿主任务记录：taskId 直接是任务；approvalId 经宿主审批记录的 parentTaskId 取父任务。
  let taskId = taskIdIn;
  if (!taskId) {
    const approval = await readTaskRecord(ctx, approvalIdIn);
    const parent = approval && typeof (approval as any).parentTaskId === "string" ? String((approval as any).parentTaskId) : "";
    if (!parent) {
      throw new Error(
        "no host task found for this approval (the approval may have been reclaimed, or the host record lacks parentTaskId): " + approvalIdIn +
          ". To operate across conversations, pass sessionId explicitly.",
      );
    }
    taskId = parent;
  }
  const record = await readTaskRecord(ctx, taskId);
  const binding = taskBindingOf(record);
  const sessionId = binding ? binding.dshSessionId : "";
  if (!sessionId) {
    throw new Error(
      "no DSH session found for this handle (the task may have been reclaimed, or the host record's metadata.dsh.sessionId is missing/invalid): " +
        (taskIdIn || approvalIdIn) + ". To operate across conversations, pass sessionId explicitly.",
    );
  }
  const sessionPath = input && input.context ? input.context.sessionPath : null;
  const verdict = taskOwnership({ taskRecord: record, sessionPath, explicitSessionId: false });
  if (!verdict.ok) throw new Error(ownershipRefusalText(verdict.reason));
  return { sessionId, explicit: false, taskId, ownership: verdict.reason };
```

</details>

**依据 7 · 源码核查**：[packages/session/src/task-ownership.ts:45-60](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/session/src/task-ownership.ts#L45-L60)

无context放行与来源比较。

<details>
<summary>查看原文（16行）</summary>

```text
export function taskOwnership(
  { taskRecord, sessionPath, explicitSessionId }: OwnershipInput = {},
): OwnershipVerdict {
  if (explicitSessionId) return { ok: true, reason: "explicit-session-id" };
  const path = typeof sessionPath === "string" && sessionPath ? sessionPath : "";
  if (!path) return { ok: true, reason: "no-session-context" };
  const parent =
    taskRecord && typeof taskRecord.parentSessionPath === "string" ? taskRecord.parentSessionPath : "";
  if (!parent) return { ok: false, reason: "record-missing-parent-session" };
  if (parent !== path) return { ok: false, reason: "session-mismatch" };
  return { ok: true, reason: "session-match" };
}

/** 归属拒绝时的可读原因（工具面直接给用户/模型看）。 */
export function ownershipRefusalText(reason) {
  switch (reason) {
```

</details>

**依据 8 · 源码核查**：[packages/dsh/provider/lib/identity.ts:70-113](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/dsh/provider/lib/identity.ts#L70-L113)

模型身份条件与读取失败。

<details>
<summary>查看原文（44行）</summary>

```text
export function resolveModelIdentity(binding: TaskBindingView | null | undefined): ModelIdentity {
  // ① 无绑定 ⇒ 不是我们创建的会话（用户在 WebUI 自建）⇒ App 身份。
  if (!binding) return { identity: {}, source: "app", reason: "unowned-session" };
  // ② 我们建的，但任务已终结（用户接着在 WebUI 里跑）⇒ App 身份。
  if (TERMINAL_TASK_STATUSES.includes(String(binding.status))) {
    return { identity: {}, source: "app", reason: "task-ended" };
  }
  // ③ 我们建的、任务活动 ⇒ 必须带 taskId（失效由宿主报错，不降级）。
  if (typeof binding.taskId !== "string" || !binding.taskId) {
    throw identityError(TASK_MAP_BROKEN, "task-binding: 绑定记录缺 taskId");
  }
  return { identity: { taskId: binding.taskId }, source: "task" };
}

/**
 * 运行期：经 globalThis 上的绑定索引解析会话身份。
 * 索引缺席（能力未挂载）⇒ 抛 BINDING_UNAVAILABLE；索引读取失败 ⇒ 原样上抛
 * （索引自己抛 TASK_MAP_BROKEN）。两者都不降级成 App 身份。
 */
export async function resolveSessionIdentity(sessionId: unknown, index?: unknown): Promise<ModelIdentity> {
  let handle = index;
  if (handle === undefined) {
    try {
      handle = (globalThis as any)[TASK_BINDING_GLOBAL_KEY] || null;
    } catch {
      handle = null;
    }
  }
  if (!handle || typeof (handle as any).bySession !== "function") {
    throw identityError(
      BINDING_UNAVAILABLE,
      "会话绑定不可读：受管 runtime 未暴露任务绑定索引（" + TASK_BINDING_GLOBAL_KEY + " 缺席）",
    );
  }
  let binding: TaskBindingView | null = null;
  try {
    binding = await (handle as any).bySession(String(sessionId ?? ""));
  } catch (e) {
    throw identityError(
      (e as any)?.code === TASK_MAP_BROKEN ? TASK_MAP_BROKEN : "TASK_IDENTITY_UNRESOLVED",
      "会话绑定读取失败：" + errText(e),
    );
  }
  return resolveModelIdentity(binding);
```

</details>

**依据 9 · 源码核查**：[packages/dsh/provider/index.ts:304-314](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/dsh/provider/index.ts#L304-L314)

模型真实请求参数不传provider key。

<details>
<summary>查看原文（11行）</summary>

```text
      }
      const request = {
        requestId,
        ...identity, // taskId（Hana 委派）或 无身份字段（App 身份，DSH Web UI 独立会话）
        provider: options.provider,
        model: options.model,
        messages: hanaMessages,
      };
      if (systemPrompt) request.systemPrompt = systemPrompt;
      if (Array.isArray(options.tools) && options.tools.length) request.tools = options.tools;
      if (options.reasoningEffort) request.reasoningEffort = String(options.reasoningEffort);
```

</details>

**依据 10 · 源码核查**：[packages/dsh/provider/index.ts:354-407](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/dsh/provider/index.ts#L354-L407)

真实models.stream/done要求与清理。

<details>
<summary>查看原文（54行）</summary>

```text
      // 活动模型流注册（task-bridge 的取消/审批链按会话定向 models.cancel，
      // 只停本工作不误停他人会话；键契约见 packages/host/src/model-requests.ts MODEL_REQUEST_GLOBAL_KEY）
      registerActiveModelRequest(sessionId, requestId);
      try {
        const response = await deps.hana.models.stream(request);
        let done = false;
        // 增量状态机：text-delta/reasoning-delta 立刻转成
        // block-start + delta 产出，Web UI 才能逐字长出来；done 时仍由 buildDoneChunks 产出
        // 权威 block-end（签名只在 done.assistant 里）+ usage + finish。
        const streamState = createHanaStreamState();
        try {
          for await (const ev of readNdjsonEvents(response)) {
            if (!ev || typeof ev.type !== "string") continue;
            if (ev.type === "done") {
              const chunks = buildDoneChunks({
                doneEvent: ev,
                provider: options.provider,
                model: options.model,
                requestId,
                startedIndexes: streamState.startedIndexes,
              });
              for (const c of chunks) yield c;
              done = true;
              break;
            }
            if (ev.type === "error") {
              throw new LlmError(
                String(ev.message || "模型错误"),
                String(ev.code || "MODEL_ERROR"),
                { requestId },
              );
            }
            // start 忽略；text-delta/reasoning-delta 实时产出；tool-call 只从 done 取
            // （同一个 tool call 不能重复执行）。
            const live = streamState.push(ev);
            for (const c of live) yield c;
          }
        } finally {
          if (signal) signal.removeEventListener("abort", onAbort);
          try {
            ac.abort();
          } catch { /* 忽略 */ }
        }
        if (!done) {
          if (options && options.signal && options.signal.aborted) {
            throw new LlmError("模型流已中止", "ABORTED", { requestId });
          }
          throw new LlmError("模型流未以 done 事件结束（宿主连接中断）", "STREAM_CLOSED", { requestId });
        }
      } catch (e) {
        if (e instanceof LlmError) throw e;
        throw toLlmError(LlmError, e, requestId);
      } finally {
        unregisterActiveModelRequest(sessionId, requestId);
```

</details>

**依据 11 · 源码核查**：[packages/host/src/bridge.ts:51-93](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/host/src/bridge.ts#L51-L93)

中继key校验与凭据头替换。

<details>
<summary>查看原文（43行）</summary>

```text
  const right = Buffer.from(expected, "utf8");
  return left.byteLength === right.byteLength && timingSafeEqual(left, right);
}

/**
 * 请求鉴权与路径归一（纯函数，便于单测）。
 * 接受两种凭据形态：header key，或路径 `/_hana/<key>/<rest>`（剥前缀）。
 * @returns 归一后的上游相对路径；null = 未通过
 */
export function authorizeBridgeRequest(
  requestUrl: string | undefined,
  headerKey: any,
  bridgeKey: string,
): { path: string; search: string } | null {
  const requested = new URL(requestUrl || "/", "http://bridge.invalid");
  if (matchesKey(headerKey, bridgeKey)) return { path: requested.pathname, search: requested.search };
  const parts = requested.pathname.split("/");
  if (parts[1] !== "_hana") return null;
  let decoded;
  try { decoded = decodeURIComponent(parts[2]); } catch { return null; }
  if (!matchesKey(decoded, bridgeKey)) return null;
  return { path: "/" + parts.slice(3).join("/"), search: requested.search };
}

/** 上游请求头构造：剥跳头/凭据/宿主头，补上游 host/origin 与 DSH cookie。 */
export function upstreamRequestHeaders(headers: IncomingHttpHeaders, upstream, cookie) {
  const result: Record<string, string> = {};
  for (const [name, value] of Object.entries(headers)) {
    if (value === undefined) continue;
    const lower = name.toLowerCase();
    if (HOP_BY_HOP.has(lower)) continue;
    if (lower.startsWith("sec-websocket-")) continue;
    if (lower === "authorization" || lower === "cookie" || lower === "host" || lower === "origin") continue;
    if (lower === "x-hana-dsh-bridge") continue;
    // 请求头值 node 已把同名头合并为单个字符串（数组形态只出现在响应头 set-cookie）；
    // 这里按字符串取；fetch（undici）本身也接受数组，断言不改变运行时行为。
    result[name] = value as string;
  }
  result.host = upstream.host;
  result.origin = upstream.origin;
  if (cookie) result.cookie = cookie;
  return result;
}
```

</details>

**依据 12 · 源码核查**：[packages/host/src/approval-bridge.ts:61-61](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/host/src/approval-bridge.ts#L61-L61)

默认审批超时常量30秒，下传由宿主处理。

```text
export const DEFAULT_APPROVAL_TIMEOUT_MS = 30000; // 显式下传的 App 侧策略（manifest approvalTimeoutSec 默认 30s）
```

#### 缺口

- 未审Hana身份/approval超时实现、所有UI/WS/auth面与OS权限。
  **影响**：不支持全面隔离或全网络部署安全承诺。
  **进一步探讨**：固定宿主版本验证错句柄、显式跨会话、缺上下文、超时拒绝与取消后实际资源。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁可怎样试，完整成本与退出是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

观察：只有已用Hana且确需DSH委派的人，先在专用Hana配置核安装审阅的local-machine/network/process权限，不把主用户目录当隔离边界；如能用独立OS用户/测试机，先读一个自造小项目并只产出文字。独立看runtime就绪、open接受、宿主终态、原DSH结果和文件差异，再试拒绝审批与取消，先不接生产任务。manifest要求Hana1.5.70-beta，根构建Node有精确范围，不以本仓工具Node24.19能跑就说目标可构建。

首次有zip完整性/宿主授权、随包DSH/原生依赖、后台进程和数据位置；持续有Hana/DSH双层会话与模型/工具/存储/端口资源，provider集中不等免费。失败可自动重试启动，任务状态/回投失败需人工核原现场；重复请求和模型取消前已计费未知，不测净收益。退出停任务和runtime，核真实进程停止、撤App能力，留存/清理App私有DSH数据与原项目产物，云模型历史按服务方处理；卸App不逆转外部命令。桥缺失、终态未知、收尾不可核时停用并回独立DSH网页。

#### 证据与依据

**依据 1 · 源码核查**：[packages/app/src/manifest.json:1-34](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/app/src/manifest.json#L1-L34)

版本与11能力。

<details>
<summary>查看原文（34行）</summary>

```text
{
  "manifestVersion": 2,
  "id": "dshana",
  "name": "DSHana",
  "version": "1.2.7+dsh-0.2.1-rc.5",
  "description": "把 DeepSeek Harness 变成 HanaAgent 的子代理",
  "entry": "bin/app.mjs",
  "icon": "icon.png",
  "minAppVersion": "1.5.70-beta",
  "capabilities": [
    "app/tools.expose-to-model",
    "app/tasks.manage",
    "app/session.start-turn",
    "app/models.infer",
    "app/sessions.read",
    "app/resources.read",
    "app/process.spawn",
    "app/runtime.execute",
    "app/runtime.local-machine",
    "app/runtime.network",
    "app/ui.open-external"
  ],
  "network": {
    "allowedHosts": [
      "127.0.0.1"
    ],
    "methods": [
      "GET",
      "POST"
    ],
    "allowLocalhost": true,
    "defaultTimeoutMs": 60000,
    "maxResponseBytes": 8388608
  },
```

</details>

**依据 2 · 源码核查**：[package.json:1-8](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/package.json#L1-L8)

目标Node范围。

```text
{
  "name": "dshana",
  "version": "1.2.7+dsh-0.2.1-rc.5",
  "private": true,
  "packageManager": "pnpm@11.28.5+sha512.484563d30b4c2ad27cb48aa94ff2b302dbcebc8ff6bf28816c2589886e146ce7f76f354f3bc1a438e6f5e9768c302aa0a6f7add8232903cd4cf81426cbc14d9e",
  "engines": {
    "node": "^22.23.4 || ^24.22.1 || ^26.12.1"
  },
```

**依据 3 · 源码核查**：[packages/runtime/src/managed-runtime.ts:773-795](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/runtime/src/managed-runtime.ts#L773-L795)

停状态与真实stop需分开。

<details>
<summary>查看原文（23行）</summary>

```text
export async function stopManagedRuntime() {
  // 手动停止同时冻结自动重试（否则刚停就被重试拉回来）；下一次显式 ensure 会重新武装
  cancelRuntimeAutoRetry();
  const app = getAppRuntime();
  const runtimeId = managed.runtimeId;
  managed.phase = "stopped";
  clearRuntimeIdentity();
  managed.lastInfo = null;
  if (!runtimeId) return;
  if (app && app.ctx && typeof app.ctx.runtime?.stop === "function") {
    try {
      await app.ctx.runtime.stop(runtimeId);
      logApp("info", "[managed-runtime] runtime 已停止：" + runtimeId);
    } catch (e) {
      logApp("warn", "[managed-runtime] runtime.stop 失败（宿主可能已回收）：" + errText(e));
    }
  }
}

/** apply disposer 收尾（幂等）：停 runtime、清单例。 */
export async function disposeManagedRuntime() {
  await stopManagedRuntime();
  resetManagedRuntime();
```

</details>

**依据 4 · 源码核查**：[packages/session/src/session-run.ts:607-640](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/session/src/session-run.ts#L607-L640)

工具接受/终态分阶段。

<details>
<summary>查看原文（34行）</summary>

```text
      // ready 后 execute 可返回；本后台继续等 task 终态（释放串行化锁）
      const loc = {
        action: parsed.action,
        sessionId,
        rpcId,
        taskId,
        delivery: TASK_DELIVERY,
        cwd: established.effectiveCwd || parsed.cwd || null,
      };
      resolveReady(loc);
      // 后台等到终态（child task-bridge complete/fail/canceled → 宿主投递来源会话）。
      // 执行超时：超时走 cancel 链（不是只 fail task——超时/撤销不默认
      // 批准、不给假成功）；超时确认也复用取消确认窗口（DSH 未确认时升级宿主 cancel）。
      const rec = await waitTaskTerminalWithTimeout(ctx, taskId, sessionId, timeoutSec, log);
      logLine(log, "[dsh-session] task 终态 " + ((rec && rec.status) || "?") + "（session=" + sessionId + "）");
      return loc;
    } catch (e) {
      // 提交阶段失败：任务 fail（已建时）+ ready reject。绑定记录的终态由宿主状态承担
      // （fail 之后宿主记录 status=failed，读侧即按“已终结”处理），不另写一份结束标记。
      if (taskId) {
        const msg = "DSH task submission failed (" + parsed.action + "): " + errText(e);
        await failTask(ctx, taskId, msg);
        const err = new Error(msg) as Error & { sessionId?: string };
        if (sessionId) err.sessionId = sessionId;
        rejectReady(err);
      } else {
        rejectReady(e);
      }
      throw e;
    } finally {
      if (releaseNewSessionTurn) {
        try { releaseNewSessionTurn(); } catch { /* 忽略 */ }
        releaseNewSessionTurn = null;
      }
```

</details>

#### 缺口

- 未安装zip或运行Hana/DSH/模型，未量化任务效果/费用。
  **影响**：只能观察隔离低风险流程，不能称生产就绪。
  **进一步探讨**：记录接受/DSH结束/Hana终态/实际进程四证据与耗时费用、文件差异。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么改进值得证伪？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是把runtime ready与task/approval桥健康分开对用户呈现，同时保留任务结算待确认状态及重对账，使“已接受/DSH已停/Hana已结算/实际收尾”不被一格completed吞掉。当前代码已有ID、原始错误与取消unresolved，增量是跨进程失败后的可核对账，不再造工作流执行器。

最小对照在离线桩中模拟桥注册失败、complete写失败、stop拒绝与审批watch断线，比较用户能否识别未知、避免重复提交并找到原现场。代价是额外状态/重试幂等与宿主版本兼容，错误重试可能重复通知；若不减少误判却增加误报和排障时间应否定。本轮没有实现/运行，不推断需求或商业成立。

#### 证据与依据

**依据 1 · 源码核查**：[packages/host/src/main.ts:601-623](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/host/src/main.ts#L601-L623)

ready独立于桥挂载成败。

<details>
<summary>查看原文（23行）</summary>

```text
  try {
    state.stopBridge = startTaskBridge({
      ctx: boot.ctx,
      hana,
      bindings,
      serviceBaseUrl, // 宿主任务取消反向触发 → 本进程 DSH session.cancel（只本会话，经中继）
      bridgeKey: opts.bridgeKey,
      log: (s) => info("bridge", s),
    });
  } catch (e) {
    err("bridge", "task-bridge 挂载失败（任务终态将无回投）：" + errText(e));
  }
  try {
    state.stopApproval = startApprovalBridge({
      ctx: boot.ctx,
      hana,
      bindings,
      log: (s) => info("approval", s),
    });
  } catch (e) {
    err("approval", "approval-bridge 挂载失败（DSH 越界审批将 fail-closed）：" + errText(e));
  }
  process.stdout.write(opts.readyMarker + "\n");
```

</details>

**依据 2 · 源码核查**：[packages/host/src/task-bridge.ts:357-397](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/host/src/task-bridge.ts#L357-L397)

终态回投失败只日志。

<details>
<summary>查看原文（41行）</summary>

```text
  async settle(decision) {
    if (this.settled || !this.taskId) return;
    this.settled = true;
    this.stopHostWatch();
    const { ok, message } = decision || {};
    // 本进程亲手请求过取消（hostCancelDone）也算：那是我们发出的动作，不依赖记录回读是否及时。
    let cancel = this.hostCancelDone || (decision && decision.cancelOverride === true);
    // 取消标记的权威格是宿主任务记录：终态判定前 fresh 读一次（App 侧先写标记再发 RPC）。
    // 读不出（宿主一跳抖动/畸形）时重试，仍读不出则按“已请求取消”结算——取消状态未知时
    // 宁可结算成 canceled，也不把不确定当成成功（否则用户请求的取消会被记成 completed）。
    if (!cancel) cancel = await this.cancelMarkedRetry();
    try {
      if (this.hana && this.hana.tasks) {
        if (cancel && typeof this.hana.tasks.cancel === "function") {
          const msg = String(message || (ok ? "已请求取消" : "DSH 任务取消")).slice(0, 2000);
          await this.hana.tasks.cancel(this.taskId, msg);
        } else if (ok) {
          const result = {
            dsh: {
              action: (this.binding && this.binding.action) || null,
              sessionId: this.sessionId,
              rpcId: (this.binding && this.binding.rpcId) || "",
              status: "completed",
              ok: true,
            },
          };
          await this.hana.tasks.complete(this.taskId, result);
        } else {
          const msg = String(message || "dsh 任务失败").slice(0, 2000);
          await this.hana.tasks.fail(this.taskId, msg);
        }
      }
    } catch (e) {
      // 终态回投失败：任务可能已被他方终态（App 卸载/取消/宿主已终态）——幂等语义，忽略
      this.note("任务终态回投失败（task=" + this.taskId + "）：" + ((e as any)?.message || e));
    } finally {
      // 终态回投改了宿主任务记录（status），让本进程的绑定索引下次重建，别把活动态读成陈旧值。
      try {
        if (this.bindings && typeof this.bindings.invalidate === "function") this.bindings.invalidate();
      } catch { /* 忽略 */ }
    }
```

</details>

**依据 3 · 源码核查**：[packages/session/src/cancel-chain.ts:200-215](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/session/src/cancel-chain.ts#L200-L215)

取消已分unresolved。

<details>
<summary>查看原文（16行）</summary>

```text
export async function settleCancelTerminal({ taskId, sessionId, reason, confirmMs = CANCEL_CONFIRM_MS, log, deps = {} }: SettleInput): Promise<CancelSettlement> {
  if (!taskId) return { settled: "unresolved" };
  const waitTerminal =
    deps.awaitTerminal || ((a: { taskId: string; timeoutMs: number; log?: any }) => awaitCancelTerminal(a));
  const terminal = await waitTerminal({ taskId, timeoutMs: confirmMs, log });
  if (terminal) return { settled: "terminal", terminal };
  // 升级兜底：宿主任务先 cancel（真实取消状态仍要保证；DSH 若真未停，日志/边界记录）
  const escalate = deps.cancelHostTask || defaultCancelHostTask;
  try {
    await escalate(taskId, String(reason || CANCEL_ESCALATE_REASON));
    logWarn(log, "[dsh-session] 取消超窗未获 DSH 确认，升级宿主 cancel（session=" + String(sessionId || "") + " task=" + taskId + "）");
    return { settled: "escalated" };
  } catch (e) {
    logWarn(log, "[dsh-session] 取消升级 ctx.tasks.cancel 失败：" + errText(e));
  }
  return { settled: "unresolved" };
```

</details>

**依据 4 · 源码核查**：[packages/runtime/src/managed-runtime.ts:773-788](https://github.com/Nyasers/DSHana/blob/16ce8274454233c9d0233e26457985a65688640d/packages/runtime/src/managed-runtime.ts#L773-L788)

stop失败仍本地stopped。

<details>
<summary>查看原文（16行）</summary>

```text
export async function stopManagedRuntime() {
  // 手动停止同时冻结自动重试（否则刚停就被重试拉回来）；下一次显式 ensure 会重新武装
  cancelRuntimeAutoRetry();
  const app = getAppRuntime();
  const runtimeId = managed.runtimeId;
  managed.phase = "stopped";
  clearRuntimeIdentity();
  managed.lastInfo = null;
  if (!runtimeId) return;
  if (app && app.ctx && typeof app.ctx.runtime?.stop === "function") {
    try {
      await app.ctx.runtime.stop(runtimeId);
      logApp("info", "[managed-runtime] runtime 已停止：" + runtimeId);
    } catch (e) {
      logApp("warn", "[managed-runtime] runtime.stop 失败（宿主可能已回收）：" + errText(e));
    }
```

</details>

#### 缺口

- 没有真实跨宿主未知状态频率与改进对照。
  **影响**：仅候选，不能当现有可靠投递能力。
  **进一步探讨**：用四故障样本测误判/重复提交和维护负担后决定。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
