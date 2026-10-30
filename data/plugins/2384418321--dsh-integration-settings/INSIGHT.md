# DSH Integration Settings

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b0f3e0c](https://github.com/2384418321/dsh-integration-settings/tree/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：为 DSH 设置增加 MCP JSON 导入、网关配置及模型清单和思考档位的预览同步。

> **亮点**：它把 MCP JSON 正规化与逐条容错、网关广告到模型配置的转换、差异确认及单文件备份组合成可视设置流程，适合已有多项配置维护任务的本地管理员。相对手改，实际新增的是可审阅的中间结果与集中入口；单文件 rename、YAML 库和宿主槽位是已有机制，不能算分叉原创。收益成立仍需正确 profile、可信广告和重启后任务验收，偶发维护可能用手改更省事。[Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)。

> **主要限制**：最强支持是模型同步会重探、拒绝空清单，并让客户端把目标摘要带到确认；但这仍不能证明“网关真正支持”或预览后原配置未变。摘要可省略且不绑定原文件，非空少报可触发删除，同 ID 元数据或档位值更新又可能被 changed 判据跳过；MCP、凭据及调度也没有跨文件共同恢复点。因而应把它当作有人工验收的配置助手，不能当无监督的能力真相源；当前来源与分发状态另有缺口。[Q02](#research-q02) 至 [Q05](#research-q05)。

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
  - [Q01 · 谁会使用这两个设置页，实际插件身份与相对手改的贡献是什么？](#detail-section-11)
  - [Q02 · MCP 与网关配置怎样从界面落盘，失败后有没有共同恢复保证？](#detail-section-12)
  - [Q03 · 网关广告怎样成为模型和档位，预览确认保护了什么又遗漏什么？](#detail-section-13)
  - [Q04 · HTTP、队列和定时任务的保护边界在哪里？](#detail-section-14)
  - [Q05 · 什么条件下值得试用，管理员怎样完成一次合格配置任务并承担全周期成本？](#detail-section-15)
  - [Q06 · 原文件绑定、延迟删除和恢复进度能否形成比当前备份更好的设计？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本地 DSH 管理员可在设置页导入 MCP 定义并维护网关模型与思考档位；合格结果是正确 profile 的配置经审阅、重启及代表任务验收。[Q01](#research-q01) 说明它是设置插件，不提供推理服务。

参照是管理员手改 YAML、凭据引用或使用简单配置生成脚本：插件减少逐条拼写，并把差异与失败清单搬到设置页，但没有减少正确 profile、广告可信、重启及任务验收的责任。上游归因限于作者分叉说明，未以未检查的宿主或竞品为劣势基线。[Q01](#research-q01) 保留对照缺口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MCP 增删改与启停 | 管理受管服务器列表并生成 patch | 需目标 MCP client/服务；保存后重启，不验证工具任务 |
| 粘贴 MCP JSON | 预览新增、覆盖、失败，再写有效项 | 支持指定形状与字段；默认覆盖，可能部分成功，不绑定预览版本 |
| 新增或编辑网关 | 管理连接地址、模型及凭据引用 | credentials与patch分步写；UI不提供删除/改ID |
| 识别并解锁思考档位 | 将网关广告映射到已配置模型 | 默认筛WorkBuddy；广告不等真实推理支持，可收窄旧档位 |
| 同步模型清单 | 预览增删并同时写模型和档位 | 拒绝空表；非空少报可删，同ID更新存在changed盲点 |
| 定时更新与立即执行 | 宿主运行时重复解锁和同步 | 自动确认、分阶段写；实例队列不防外部编辑，需重启生效 |

**流程与依赖**

[Q05](#research-q05) 集中列启动与依赖表，区分宿主服务、正确 profile、MCP/网关任务条件和仅定时所需的持续运行；package 的 optional peer 标记不证明这些服务可缺。共享 credentials 与 profile 文件的不同作用域使恢复需逐文件核对。

管理员应先核来源和原件，再做一个隔离手动任务、审阅实际差异、重启并验收代表请求；步骤与停止处理集中在 [Q05](#research-q05)。后台调度共用实例队列，但会先解锁、再同步、再写调度状态，不能替代当次人工删除验收。

**效果与成本**

首次、持续、失败及退出的现金与资源、人工时间分别见 [Q05](#research-q05) 成本表。没有费用或耗时数据，均保留未知；备份只能降低单文件恢复门槛，无法证明整体负担低于手改。

当前效果证据是可生成、预览和写入配置，未证明真实服务、逐档推理、合格率、节时或单位成本；对照方法及效果表集中在 [Q05](#research-q05)。保存成功与重启后的实际任务办结分别验收。

> **思考**：最强支持是模型同步会重探、拒绝空清单，并让客户端把目标摘要带到确认；但这仍不能证明“网关真正支持”或预览后原配置未变。摘要可省略且不绑定原文件，非空少报可触发删除，同 ID 元数据或档位值更新又可能被 changed 判据跳过；MCP、凭据及调度也没有跨文件共同恢复点。因而应把它当作有人工验收的配置助手，不能当无监督的能力真相源；当前来源与分发状态另有缺口。[Q02](#research-q02) 至 [Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把 MCP JSON 正规化与逐条容错、网关广告到模型配置的转换、差异确认及单文件备份组合成可视设置流程，适合已有多项配置维护任务的本地管理员。相对手改，实际新增的是可审阅的中间结果与集中入口；单文件 rename、YAML 库和宿主槽位是已有机制，不能算分叉原创。收益成立仍需正确 profile、可信广告和重启后任务验收，偶发维护可能用手改更省事。[Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)。

受管区块与 !!js 标签往返处理避免部分手写工作，provider range 拼接在条件满足时减少无关重排，备份/rename 与实例队列也值得复用；移植需要 YAML 节点范围、同目录写权限和明确状态所有权。[Q02](#research-q02) 说明序列化回退与跨文件失败，[Q03](#research-q03) 说明摘要/changed盲点，[Q04](#research-q04) 说明隐藏写接口、超时和队列范围。该分叉直接维护构建产物，压缩客户端与捆绑 YAML 增加读改成本；文档保留上游测试清单不是当前可执行测试证据。inventory的9435行JS包含上述代码，七个统计文件不含JSON/YAML清单，不是全工程或原创量。 缺失或损坏调度文件时，相对到期时间每次重建可能永远not-due，须保存有效状态后核下次时间；详见 [Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

最强支持是模型同步会重探、拒绝空清单，并让客户端把目标摘要带到确认；但这仍不能证明“网关真正支持”或预览后原配置未变。摘要可省略且不绑定原文件，非空少报可触发删除，同 ID 元数据或档位值更新又可能被 changed 判据跳过；MCP、凭据及调度也没有跨文件共同恢复点。因而应把它当作有人工验收的配置助手，不能当无监督的能力真相源；当前来源与分发状态另有缺口。[Q02](#research-q02) 至 [Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有可信固定产物、熟悉 profile 且能逐文件恢复的管理员，可以先在隔离副本手动试一组 MCP 或单网关配置，保持定时关闭。按 [Q05](#research-q05) 的步骤核对预览、实际文件差异、重启后模型选择与代表请求；发现错误 profile、意外删除、部分成功或共享凭据受影响就停写，先核状态再恢复原件并退回手改。本轮支持这个窄范围试用路径，当前来源未核清时先补核，不支持直接持续部署。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定源码，可确认设置入口、配置转换与单文件保护；当前没有安装、真实宿主或模型任务结果，不能认定净收益与持续采用成立。两个新设计方向均未验证，当前来源成员和分发状态也未确认。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、README.md、LOCAL-PATCH.md、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：独立核对四准备材料，SOURCE所含七文件与固定Git blob相符；定向检查package/bundle、profile路径、MCP正规化与双写、provider保存、probe/解锁/同步、定时/HTTP/queue、client注册与确认调用。未全审捆绑YAML内部、Skill路径、全部UI或宿主外围权限。当前旧12个finding逐ID及自身code依赖均已重新核查；只更新本组件独占目录，不执行目标、安装、测试或宿主。统计是指定扩展名及材料范围，不是完整工程审计。
- 下一步：[Q06](#research-q06) 的验证应以同一匿名配置任务对照当前实现、手改加清单和最小补丁，记录误删、覆盖、误拒绝、合格率与恢复分钟。来源核清后，[Q05](#research-q05) 的隔离小样先验证正确profile、重启加载及代表请求；广告与实际档位不符、恢复成本高于手改或简单替代同样有效都会收窄或取消建议。本轮未安排这些执行。

**分析版本**

- **仓库**：[2384418321/dsh-integration-settings](https://github.com/2384418321/dsh-integration-settings)
- **版本号**：0.2.10-dsh.5（[固定提交 b0f3e0c](https://github.com/2384418321/dsh-integration-settings/tree/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向一是在预览中绑定原文件摘要、目标 profile 与差异，应用前拒绝外部修改，比较它是否比手改加清单或小补丁减少覆盖。方向二是把非空少报的删除改成待验收，并显示跨文件完成阶段和恢复点，比较它是否比现有三份备份减少误删与恢复时间。它们来自当前目标摘要、删除集合和分步写入的边界，不计入插件已有创新；若简单清单同样有效，或确认和账本增加的负担更大，就应放弃。[Q06](#research-q06) 完整说明推导、对照与否定条件。

[Q06](#research-q06) 的验证应以同一匿名配置任务对照当前实现、手改加清单和最小补丁，记录误删、覆盖、误拒绝、合格率与恢复分钟。来源核清后，[Q05](#research-q05) 的隔离小样先验证正确profile、重启加载及代表请求；广告与实际档位不符、恢复成本高于手改或简单替代同样有效都会收窄或取消建议。本轮未安排这些执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1405 | — | — | 19231 |
| .js | source | 2 | 9435 | 9024 | 356 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/2384418321/dsh-integration-settings/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定版本中，Integration Settings 能否帮助本地管理员可恢复地完成 MCP 与网关配置任务，相比手改增加什么且何时应停止？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁会使用这两个设置页，实际插件身份与相对手改的贡献是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它是仓库根的原生 DSH 设置插件，不是独立 Agent、模型服务或内嵌 Skill。固定 package 0.2.10-dsh.5 将根导出指向 lib/index.js，客户端导出指向 lib/client.js，bundle 指向 cordis.patch.yml；后者插入插件包，服务端导出 apply/inject/name。apply 注册 API，客户端 en 注册 integration-mcp 与 integration-providers 两个 settings.section 项。因此目标是管理本地 DSH profile 的管理员：当他需要反复导入 MCP 定义或更新 OpenAI 兼容网关模型、思考档位时，得到可审阅的配置变更，再由宿主重启读取。不是仅凭目录收录认定类型。

原办法是手工维护 cordis.patch.yml 的 MCP 条目、llm-pi-ai providers 和凭据引用，或用小脚本生成 YAML。这里可核查的增量是把 JSON 正规化、逐条错误及覆盖预览、网关广告转换、差异确认和备份写入串到设置页；不会替代 MCP 服务、模型推理或宿主 loader。包文档把自身称为本地分叉，指出上游管理页面被删以及同步模型与解锁档位分开。该归因来自作者分叉说明；没有取得独立上游固定版本，不将共用 YAML 库、DSH 槽位与文件原子替换说成分叉原创，也不宣称优于全部宿主原生功能。

client 注册数组只保留两栏，Skill 与人设组件残留不能算可见正向能力；对应后端路由仍可调用，另见 Q04。合格结果必须同时满足正确 profile、预期文件差异、重启后可选配置和代表任务可用；只显示成功提示不够。偶发单模型维护、已经有可靠配置生成器、不能允许本地文件写入的人群，手改或小脚本可能更直接。

本轮 INPUT 缺该条目，WORK 沿用旧固定提交且 changes=unknown；META 的 GitHub 仓库 API 和 npm 查询均为 404。它们留下当前来源成员、可获取身份与分发状态的具体缺口，不能推断仓库根代码不存在：固定缓存与 Git blob 可独立读取。统计包只列七个被统计文件而不含 manifest/bundle，统计中的 .js 两文件包含压缩客户端和捆绑 YAML；这不是原创代码规模或全工程审计。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:25-31](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/package.json#L25-L31)

根与客户端导出把包接到两端。

```text
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
```

**依据 2 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/cordis.patch.yml#L1-L3)

bundle实际插入插件包。

```text
- insert:
    - id: dsh-integration-settings
      name: 'dsh-integration-settings'
```

**依据 3 · 源码核查**：[lib/index.js:8840-8845](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8840-L8845)

服务端注入webServer与sessions。

```text
// src/index.js
var name = PLUGIN_NAME;
var inject = ["webServer", "sessions"];
var API_PREFIX = "/api/dsh-integration";
var MUTATION_HEADER = "x-dsh-integration";
var BODY_LIMIT = 4 * 1024 * 1024;
```

**依据 4 · 源码核查**：[lib/index.js:9343-9361](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9343-L9361)

API前缀注册及真实导出。

<details>
<summary>查看原文（19行）</summary>

```text
  );
  ctx.effect(
    () => ctx.webServer.register({
      kind: "prefix",
      path: API_PREFIX,
      handler: (req, res) => {
        const method = req.method || "GET";
        const run = method === "GET" || method === "HEAD" ? handle(ctx, req, res) : serialize(() => handle(ctx, req, res));
        Promise.resolve(run).catch((err) => fail(res, err));
      }
    }),
    `${PLUGIN_NAME}: API route`
  );
}
export {
  apply,
  inject,
  name
};
```

</details>

**依据 5 · 源码核查**：[lib/client.js:72-72](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/client.js#L72-L72)

同一压缩行尾en注册数组仅含MCP与providers；保留原始整行。

```text
let xe=async s=>{if(Q){W(!0),g(null),d(null);try{let m=await T("/provider/schedule",{method:"POST",sessionId:t,body:{...Q,...s}});se(m),d(s.enabled===!1?"\u5DF2\u5173\u95ED\u5B9A\u65F6\u66F4\u65B0\uFF1B\u5DF2\u7ECF\u5230\u70B9\u7684\u90A3\u4E00\u6B21\u4E0D\u4F1A\u518D\u5199\u914D\u7F6E\u3002":`\u5B9A\u65F6\u66F4\u65B0\u5DF2\u4FDD\u5B58\uFF1A\u6BCF ${m.intervalMinutes} \u5206\u949F\uFF0C\u4EC5\u5728 DeepSeek Harness \u8FD0\u884C\u671F\u95F4\u751F\u6548\u3002`)}catch(m){g(m.message||String(m))}finally{W(!1)}}},ke=async()=>{W(!0),g(null),d(null);try{let s=await T("/provider/schedule/run",{method:"POST",sessionId:t,body:{}}),y=(s.report&&s.report.providers||[]).filter($=>$.status==="error"),I=[];s.ran?s.report?s.report.unlockedModels?I.push(`\u5DF2\u66F4\u65B0 ${s.report.unlockedModels} \u4E2A\u6A21\u578B\u7684\u601D\u8003\u6863\u4F4D`):I.push("\u5404\u7F51\u5173\u7684\u601D\u8003\u6863\u4F4D\u90FD\u5DF2\u662F\u6700\u65B0\uFF0C\u6CA1\u6709\u6539\u52A8\u6587\u4EF6"):I.push(`\u672A\u80FD\u5B8C\u6210\u89E3\u9501\uFF1A${s.error||"\u672A\u77E5\u539F\u56E0"}`):I.push("\u8FD8\u6CA1\u5230\u70B9\uFF0C\u672A\u6267\u884C\u3002"),y.length&&I.push(`\u63A2\u6D4B\u5931\u8D25\uFF1A${y.map($=>`${$.id}\uFF08${$.error}\uFF09`).join("\uFF1B")}`),s.sync&&I.push(`\u6A21\u578B\u6E05\u5355 +${(s.sync.totals||{}).added||0}/-${(s.sync.totals||{}).removed||0}`),s.report&&s.report.changed&&I.push("\u5DF2\u81EA\u52A8\u5907\u4EFD\uFF0C\u91CD\u542F DSH \u540E\u751F\u6548\u3002"),d(I.join("\u3000")),U.reload(),w.reload(),await L()}catch(s){g(s.message||String(s))}finally{W(!1)}},ee=N.data&&N.data.providers||[],G=s=>ee.find(m=>m.id===s)||null,Ne=(s,m)=>{let y=G(s);return y&&(y.details||[]).find(I=>I.id===m)||null},we=s=>{let m=G(s);if(!m)return null;if(m.verdict==="gateway"){let y=m.kindSource==="model-id-prefix"?"\u6309\u6A21\u578B\u547D\u540D\u7A7A\u95F4":"\u6309 /healthz";return e("span",{className:"dsi-badge dsi-badge-on"},`WorkBuddy${m.service?` \xB7 ${m.service}`:""}\uFF08${y}\uFF09`)}return m.verdict==="other"?e("span",{className:"dsi-badge dsi-badge-off"},"\u975E WorkBuddy \u7F51\u5173"):null},Ce=s=>{let m=G(s);if(!m)return null;if(m.verdict==="skipped")return e("span",{className:"dsi-badge"},"\u4E0D\u5904\u7406");if(m.verdict==="unreachable"||m.status==="error")return e("span",{className:"dsi-badge dsi-badge-off"},"\u63A2\u6D4B\u5931\u8D25");if(m.status==="missing")return e("span",{className:"dsi-badge dsi-badge-off"},"\u914D\u7F6E\u5DF2\u4E0D\u5728\u6587\u4EF6\u91CC");let y=[];return m.unlocked&&y.push(`\u5F85\u89E3\u9501 ${m.unlocked}`),m.already&&y.push(`\u5DF2\u4E00\u81F4 ${m.already}`),m.silent&&y.push(`\u7F51\u5173\u672A\u58F0\u660E ${m.silent}`),m.gone&&y.push(`\u7F51\u5173\u5DF2\u4E0D\u63D0\u4F9B ${m.gone}`),e("span",{className:m.unlocked?"dsi-badge dsi-badge-off":"dsi-badge dsi-badge-on"},y.join(" \xB7 ")||`${m.scanned} \u4E2A\u6A21\u578B`)},ae=N.data&&N.data.unlockedModels||0,B=ee.reduce((s,m)=>s.concat((m.details||[]).filter(y=>y.status==="unlocked")),[]),oe=B.filter(s=>(s.lost||[]).length),ne=ee.filter(s=>s.verdict==="skipped"||s.verdict==="other");return e(q,{title:"\u601D\u8003\u89E3\u9501",desc:"\u8BC6\u522B\u7F51\u5173\u652F\u6301\u7684\u601D\u8003\u6863\u4F4D\u4E0E\u53EF\u7528\u6A21\u578B\u6E05\u5355\u3002\u4E24\u4E2A\u52A8\u4F5C\u4E92\u76F8\u72EC\u7ACB\uFF1A\u300C\u5168\u90E8\u89E3\u9501\u300D\u53EA\u5199\u601D\u8003\u6863\u4F4D\uFF0C\u300C\u540C\u6B65\u6A21\u578B\u6E05\u5355\u300D\u53EA\u6539\u6A21\u578B\u5217\u8868\uFF08\u5148\u9884\u89C8\u518D\u786E\u8BA4\uFF09\u3002\u5199\u524D\u81EA\u52A8\u5907\u4EFD\uFF0C\u91CD\u542F DSH \u540E\u751F\u6548\u3002",actions:e(K.default.Fragment,null,e(v,{variant:"primary",disabled:a||N.loading||!b.length,onClick:ge},ae?`\u5168\u90E8\u89E3\u9501\uFF08${ae} \u4E2A\u6A21\u578B\u5F85\u66F4\u65B0\uFF09`:"\u5168\u90E8\u89E3\u9501"),e(v,{disabled:a,onClick:()=>{w.reload(),L()}},"\u91CD\u65B0\u8BC6\u522B"),e(v,{disabled:a||syncBusy||!b.length,onClick:openSync},"\u540C\u6B65\u6A21\u578B\u6E05\u5355"),e(v,{disabled:a,onClick:fe},"\u65B0\u589E\u7F51\u5173")),footer:l?`\u914D\u7F6E\u6587\u4EF6\uFF1A${dsiMaskPath(l)}${p?`\u3000\u5BC6\u94A5\u6587\u4EF6\uFF1A${dsiMaskPath(p)}`:""}`:null},e(Z),e(P,{kind:"error"},u),e(P,{kind:"ok"},i),e(qe,{schedule:Q,busy:ve||a,loading:U.loading,error:U.error,onChange:xe,onRunNow:ke}),N.loading?e("div",{className:"dsi-hint"},"\u6B63\u5728\u8BC6\u522B\u7F51\u5173\u652F\u6301\u7684\u601D\u8003\u6863\u4F4D\u2026"):null,N.error?e(P,{kind:"error"},`\u81EA\u52A8\u8BC6\u522B\u5931\u8D25\uFF1A${N.error}`):null,N.data&&!N.data.unlockedModels&&b.length?e("div",{className:"dsi-hint"},"\u5DF2\u8BC6\u522B\u7684\u7F51\u5173\uFF0C\u601D\u8003\u6863\u4F4D\u90FD\u5DF2\u662F\u6700\u65B0\u3002"):null,B.length?e("div",{className:"dsi-hint"},`\u68C0\u6D4B\u5230 ${B.length} \u4E2A\u6A21\u578B\u7684\u6863\u4F4D\u4E0E\u7F51\u5173\u4E0D\u4E00\u81F4`+(oe.length?`\uFF08\u5176\u4E2D ${oe.length} \u4E2A\u4F1A\u51CF\u5C11\u6863\u4F4D\uFF09`:"")+"\uFF1A"+B.slice(0,3).map(s=>`${s.id}\uFF08${(s.from&&s.from.length?s.from:["\u672A\u58F0\u660E"]).join("/")} \u2192 ${s.to.join("/")}\uFF09`).join("\uFF1B")+(B.length>3?` \u7B49 ${B.length} \u4E2A`:"")):null,ne.length?e("div",{className:"dsi-hint"},`${ne.length} \u4E2A\u4F9B\u5E94\u5546\u4E0D\u53C2\u4E0E\u89E3\u9501\uFF1A`+ne.map(s=>`${s.id}\uFF08${s.reason||"\u4E0D\u9002\u7528"}\uFF09`).join("\uFF1B")):null,b.length?e("label",{className:"dsi-check",style:{marginTop:"6px"}},e("input",{type:"checkbox",checked:f,onChange:s=>O(s.target.checked)}),e("span",null,"\u53EA\u5904\u7406 WorkBuddy \u7F51\u5173\uFF08\u6309 /healthz \u670D\u52A1\u540D\u6216 cn:/global: \u547D\u540D\u7A7A\u95F4\u5224\u65AD\uFF09")):null,syncPlan?e("div",{className:"dsi-card"},e("div",{className:"dsi-inline"},e("strong",{style:{fontSize:13}},"\u540C\u6B65\u6A21\u578B\u6E05\u5355 \u00B7 \u9884\u89C8"),e("span",{className:"dsi-badge"},`\u5C06\u65B0\u589E ${syncPlan.totals&&syncPlan.totals.added||0} \u4E2A / \u5C06\u79FB\u9664 ${syncPlan.totals&&syncPlan.totals.removed||0} \u4E2A`)),e("div",{className:"dsi-hint"},"\u53EA\u6539\u53EF\u7528\u6A21\u578B\u5217\u8868\uFF0C\u4E0D\u6539\u601D\u8003\u6863\u4F4D\uFF1B\u5199\u5165\u524D\u81EA\u52A8\u5907\u4EFD\u3002"),(syncPlan.providers||[]).map(s=>{const m=s.summary||{};return e("div",{className:"dsi-card",key:s.id,style:{padding:"9px 11px"}},e("div",{className:"dsi-inline"},e("strong",{style:{fontSize:12}},s.id),e("span",{className:s.status==="error"||s.status==="stale"?"dsi-badge dsi-badge-off":"dsi-badge dsi-badge-on"},s.status==="error"?"\u63A2\u6D4B\u5931\u8D25":s.status==="stale"?"\u9700\u91CD\u65B0\u9884\u89C8":s.status==="skipped"?"\u8DF3\u8FC7":`\u65B0\u589E ${m.added||0} / \u79FB\u9664 ${m.removed||0} / \u4E0D\u53D8 ${m.kept||0}`)),s.error?e("div",{className:"dsi-hint"},"\u539F\u56E0\uFF1A"+s.error):null,(m.models&&m.models.added||[]).length?e("div",{className:"dsi-hint"},"\u5C06\u65B0\u589E\uFF1A"+m.models.added.join("\u3001")):null,(m.models&&m.models.removed||[]).length?e("div",{className:"dsi-hint"},"\u5C06\u79FB\u9664\uFF1A"+m.models.removed.join("\u3001")):null,m.levels&&((m.levels.added||[]).length||(m.levels.removed||[]).length)?e("div",{className:"dsi-hint"},`\u601D\u8003\u6863\u4F4D\uFF1A\u65B0\u589E ${(m.levels.added||[]).join("/")||"\u65E0"}\uFF1B\u79FB\u9664 ${(m.levels.removed||[]).join("/")||"\u65E0"}${(m.levelModels||[]).length?`\uFF08\u5F71\u54CD ${m.levelModels.length} \u4E2A\u6A21\u578B\uFF09`:""}`):null)}),e("div",{className:"dsi-inline"},e(v,{variant:"primary",disabled:syncBusy,onClick:applySync},syncBusy?"\u6B63\u5728\u5199\u5165\u2026":`\u786E\u8BA4\u5199\u5165\uFF08\u65B0\u589E ${syncPlan.totals&&syncPlan.totals.added||0} / \u79FB\u9664 ${syncPlan.totals&&syncPlan.totals.removed||0}\uFF09`),e(v,{disabled:syncBusy,onClick:()=>setSyncPlan(null)},"\u53D6\u6D88"))):null,r?e(Je,{draft:r,setDraft:M,saving:a,probing:H,isNew:!b.some(s=>s.id===r.id),onCancel:()=>M(null),onSave:ye,onProbe:he}):null,w.loading&&!x?e(J):null,w.error?e(P,{kind:"error"},`\u8BFB\u53D6\u5931\u8D25\uFF1A${w.error}`):null,!b.length&&!w.loading?e("div",{className:"dsi-empty"},"\u8FD9\u4E2A profile \u7684 llm-pi-ai \u6761\u76EE\u4E0B\u8FD8\u6CA1\u6709\u914D\u7F6E\u4EFB\u4F55\u4F9B\u5E94\u5546\u3002"):null,b.map(s=>{let m=G(s.id),y=c===s.id;return e("div",{className:"dsi-row",key:s.id},e("div",{className:"dsi-row-main"},e("div",{className:"dsi-row-name"},s.id,e("span",{className:"dsi-badge"},`${s.modelCount} \u6A21\u578B`),we(s.id),Ce(s.id),s.apiKeyEnv?e("span",{className:s.hasCredential?"dsi-badge dsi-badge-on":"dsi-badge dsi-badge-off"},s.hasCredential?"\u5BC6\u94A5\u5DF2\u914D\u7F6E":"\u7F3A\u5C11\u5BC6\u94A5"):null),e("div",{className:"dsi-row-meta"},[dsiMaskUrl(s.baseURL)||"(\u672A\u8BBE\u7F6E baseURL)",s.apiKeyEnv||"(\u672A\u8BBE\u7F6E apiKeyEnv)",s.reasoning?`\u9ED8\u8BA4\u601D\u8003 ${s.reasoning}`:null,Ve(s.models)||null].filter(Boolean).join(" \xB7 ")),m&&m.reason?e("div",{className:"dsi-row-meta"},`${m.verdict==="skipped"||m.verdict==="other"?"\u672A\u53C2\u4E0E\u539F\u56E0":"\u63A2\u6D4B\u7ED3\u679C"}\uFF1A${m.reason}`):null),e("div",{className:"dsi-toolbar"},e(v,{disabled:a,onClick:()=>k(y?null:s.id)},y?"\u6536\u8D77\u6A21\u578B":"\u67E5\u770B\u6A21\u578B"),e(v,{disabled:a,onClick:()=>be(s)},"\u7F16\u8F91")),y?e("div",{className:"dsi-card",style:{marginTop:"8px"}},e("div",{className:"dsi-hint"},`${(s.models||[]).length} \u4E2A\u6A21\u578B\uFF08\u5F53\u524D\u5199\u5728\u914D\u7F6E\u91CC\u7684\u601D\u8003\u6863\u4F4D\uFF09`),(s.models||[]).map(I=>{let $=Ne(s.id,I.id),$e=$&&$.status==="unlocked";return e("div",{className:"dsi-row-meta",key:I.id},e("span",{className:"dsi-mono"},I.id),"\u3000",me(I)||"\u672A\u58F0\u660E\u6863\u4F4D",$e?`\u3000\u2192 \u7F51\u5173\u652F\u6301 ${$.to.join("/")}${($.lost||[]).length?`\uFF08\u4F1A\u53BB\u6389 ${$.lost.join("/")}\uFF09`:""}`:null,$&&$.status==="silent"?"\u3000\u7F51\u5173\u672A\u58F0\u660E\uFF0C\u4FDD\u6301\u539F\u6837":null,$&&$.status==="gone"?"\u3000\u7F51\u5173\u5DF2\u4E0D\u63D0\u4F9B\uFF0C\u4FDD\u6301\u539F\u6837":null)})):null)}))}function en(n){let t=Le(n),a=[{id:"integration-mcp",order:61,labelKey:"mcp.title",Component:_e},{id:"integration-providers",order:64,labelKey:"providers.title",Component:Qe}];for(let o of a)n.effect(()=>n.slots.inject("settings.section",()=>n.slots.register({name:"settings.section",id:o.id,order:o.order,label:()=>t(o.labelKey),locale:z},o.Component)))}var nn=["slots","locale"],tn=z;
```

**依据 6 · 作者声明**：[LOCAL-PATCH.md:1-33](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/LOCAL-PATCH.md#L1-L33)

作者对分叉归属与本地修改的说明，非独立上游对照。

<details>
<summary>查看原文（33行）</summary>

````text
# 本地补丁说明

本目录是 `dsh-integration-settings` 的本地副本。当前版本 `0.2.10-dsh.5`。

## 改动一：移除两个设置页（0.2.9-dsh.1）

`lib/client.js` 的 `apply()` 里注册数组只保留：

- `integration-mcp`（MCP 管理）
- `integration-providers`（思考解锁）

被移除的两个条目原本是：

```js
{id:"integration-skills",order:62,labelKey:"skills.title",Component:We},
{id:"integration-persona",order:63,labelKey:"persona.title",Component:Ge},
```

组件函数 `We` / `Ge` 仍在 bundle 内（未注册即不渲染）。`/api/dsh-integration/skill/*`、`/persona/*` 接口仍存在但不再有 UI 入口。

## 改动二：模型清单同步与思考档位解锁分开（0.2.10-dsh.2，2026-10-21）

**这次改到了 `lib/index.js`（服务端），不只是客户端 bundle。** 原先「全部解锁」一个开关同时表达
"网关支持哪些思考档位"和"这个网关有哪些可用模型"两件事，语义混淆；现在拆开：

- 服务端新增 `syncDigest()` / `planModelSync(raw, gatewayModels)` / `syncProviderModels(env, {...})`
  （`lib/index.js`，"模型清单同步"那一段），以及两个路由：
  - `POST /providers/models/sync-preview` → 只读预览，返回
    `{added,removed,kept,levels:{added,removed,kept},models:{added,removed,kept},levelModels,details,digest}`
  - `POST /providers/models/sync-apply` → 写盘，需 `confirm:true` + `expectedDigests`（或单个 `digest` 字符串）
- 写盘复用原有 `writeWithBackup()`（`.bak-<时间戳>` + 原子替换，保留 3 份）；写前 `validatePatchText()` 校验。
- 抓取失败（`/models` 空数组 / 非 2xx / 全部网关探测失败）→ apply 返回 **502 `error.provider.sync.probe`**，
  配置文件不动；`planModelSync` 另外拒绝生成空模型表。**绝不把模型清单写空。**
````

</details>

#### 缺口

- 当前来源成员、仓库身份可获取状态与可分发产物未证实。
  **影响**：不能给当前可安装性或市场供给下结论。
  **进一步探讨**：在来源完整快照与可信仓库/发布产物上核对稳定身份和字节，不以缓存替代当前分发。
- 未取得独立上游及宿主原生管理能力的同版本对照。
  **影响**：归因限于作者说明和手改配置基线，创新不能升为全生态首创。
  **进一步探讨**：取得对应上游与宿主源码后比较同一配置任务。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · MCP 与网关配置怎样从界面落盘，失败后有没有共同恢复保证？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

MCP 客户端 importJsonPreview 调 T('/mcp/import-json', dryRun:true)，确认时重传 JSON 而不传预览摘要；handle 将该 POST 转给 importMcpJsonServers。后者调用 parseMcpJsonDocument 接受 mcpServers 映射、servers 数组或直接映射，normalizeMcpJsonServer 归一 transport 和允许字段，逐条捕获错误。默认覆盖同名项，按大小写无关的名称匹配，dryRun 返回 added/updated/skipped/failed/warnings 而不写文件；确认会按当时存储重新计算，故预览不是锁定事务，部分条目成功时仍可写其余有效项。warnings 提醒 URL/headers 中的明文凭据会落盘，界面掩码不是存储加密。

writeMcpServers 校验所有名称和重复项，从列表生成受管 MCP 区块，applyManagedBlock 替换标记内文本，validatePatchText 核查 YAML 顶层和条目结构，再先 writeFileAtomic 写 .dsh-integration/mcp.json，后 writeWithBackup 写 cordis.patch.yml。writeFileAtomic 用同目录临时文件再 rename，并尝试 chmod；备份在内容变化时保存旧文本、保留三份。rename 保护单文件替换，不是两文件提交；第二步失败会出现存储已新、patch 仍旧，函数没有撤销第一步。原受管区块手改会在后续保存覆盖，用户须确认真相源是 mcp.json。!!js 表达式通过 encodeJsDeep 和 sentinel 还原为 YAML 标签，避免当普通字符串丢掉表达式；这不验证表达式执行安全或服务可启动。

网关新增/编辑由 /provider/save → saveProvider → renderProviderConfig → mergeProviderIntoPatch；先完整校验 nextPatch。若提交新密钥，mergeCredentialRef 写 $DSH_HOME/.credentials.yaml 的 refs 并备份，再写 profile patch。故第二写失败时凭据已变，旧配置甚至其他引用同一凭据名的使用者可能受影响；没有跨文件回滚。mergeProviderIntoPatch 优先按 YAML 节点 range 拼接目标 provider，stableShape 相同返回原文本；不满足 range 条件时回退序列化文档，不能将常见字节保留路径扩成所有格式永远不重排。

路径解析优先宿主 desktopProfiles.current.dir，再 DSH_PROFILE_DIR、命名 profile、含插件的候选和 desktop，多个未消歧候选会报错；没有候选时仍可回退命名或 desktop 路径。因此徽标和实际目录必须由操作者确认，不能将路径策略说成绝不猜测。管理员应在写前保全 mcp.json、patch、credentials 原件，失败后先核对哪些文件已改变，逐文件恢复并重启；不能盲点重试假定未发生副作用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:57-57](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/client.js#L57-L57)

实际MCP预览和确认调用，确认重传JSON。

```text
@modelcontextprotocol/server-github`})),e(S,{label:"env",hint:"\u6BCF\u884C KEY=VALUE\uFF1B\u503C\u5199 !!js process.env.XXX \u53EF\u907F\u514D\u628A\u5BC6\u94A5\u5199\u8FDB\u914D\u7F6E\u6587\u4EF6"},e(A,{value:n.envText,onChange:c=>u({envText:c}),rows:3,mono:!0,placeholder:"GITHUB_TOKEN=!!js process.env.GITHUB_TOKEN"})),e(S,{label:"cwd\uFF08\u53EF\u9009\uFF09"},e(j,{value:n.cwd,onChange:c=>u({cwd:c}),mono:!0}))):e(K.default.Fragment,null,e(S,{label:"url"},e(j,{value:n.url,onChange:c=>u({url:c}),placeholder:"http://localhost:3000/mcp",mono:!0})),e(S,{label:"headers",hint:"\u6BCF\u884C KEY=VALUE"},e(A,{value:n.headersText,onChange:c=>u({headersText:c}),rows:3,mono:!0,placeholder:"Authorization=Bearer xxx"}))),e("div",{className:"dsi-grid2"},e(S,{label:"toolCallTimeoutMs\uFF08\u53EF\u9009\uFF0C\u9ED8\u8BA4 60000\uFF09"},e(j,{value:n.toolCallTimeoutMs,onChange:c=>u({toolCallTimeoutMs:c}),mono:!0})),e(S,{label:"maxInstructionBytes\uFF08\u53EF\u9009\uFF0C\u9ED8\u8BA4 32768\uFF09"},e(j,{value:n.maxInstructionBytes,onChange:c=>u({maxInstructionBytes:c}),mono:!0}))),e("div",{className:"dsi-inline"},e("label",{className:"dsi-check"},e("input",{type:"checkbox",checked:!!n.enabled,onChange:c=>u({enabled:c.target.checked})}),"\u542F\u7528\uFF08\u53D6\u6D88\u52FE\u9009\u53EA\u4ECE\u914D\u7F6E\u4E2D\u79FB\u9664\uFF0C\u914D\u7F6E\u4ECD\u4FDD\u7559\uFF09"),e("label",{className:"dsi-check"},e("input",{type:"checkbox",checked:!!n.failOnStartupError,onChange:c=>u({failOnStartupError:c.target.checked})}),"\u542F\u52A8\u5931\u8D25\u65F6\u89C6\u4E3A\u81F4\u547D")),e("div",{className:"dsi-toolbar"},e(v,{variant:"primary",onClick:()=>o(De(n)),disabled:i},i?"\u4FDD\u5B58\u4E2D\u2026":"\u4FDD\u5B58"),e(v,{onClick:a,disabled:i},"\u53D6\u6D88")))}function _e(n){let t=_(n);X("settings.section",n);let[a,o]=h(null),[i,d]=h(!1),[u,g]=h(!1),[c,k]=h(null),[w,x]=h(null),[C,b]=h(!1),[jsonOpen,setJsonOpen]=h(!1),[jsonText,setJsonText]=h(""),[jsonPlan,setJsonPlan]=h(null),l=F(()=>T(`/state?session=${encodeURIComponent(t||"")}&root=`,{sessionId:t}),[t]),p=l.data,E=async(r,M)=>{g(!0),x(null),k(null);try{await r(),k(M),l.reload()}catch(H){x(H.message||String(H))}finally{g(!1)}},importJsonPreview=async()=>{g(!0),x(null),k(null);try{const r=await T("/mcp/import-json",{method:"POST",sessionId:t,body:{json:jsonText,dryRun:!0}});setJsonPlan(r)}catch(H){x(H.message||String(H))}finally{g(!1)}},importJsonConfirm=async()=>{g(!0),x(null),k(null);try{const r=await T("/mcp/import-json",{method:"POST",sessionId:t,body:{json:jsonText}});k(`\u5DF2\u5199\u5165\uFF1A\u65B0\u589E ${(r.added||[]).length} \u4E2A${(r.updated||[]).length?`\u3001\u8986\u76D6 ${r.updated.length} \u4E2A`:""}${(r.failed||[]).length?`\uFF1B${r.failed.length} \u6761\u6709\u95EE\u9898\u672A\u5199\u5165`:""}\u3002\u91CD\u542F DSH \u540E\u751F\u6548\u3002`),setJsonPlan(null),setJsonOpen(!1),setJsonText(""),l.reload()}catch(H){x(H.message||String(H))}finally{g(!1)}},N=p&&p.mcp&&p.mcp.servers||[],R=p&&p.mcp&&p.mcp.importable||[],f=p&&p.paths?p.paths.patchFile:"",O=e(K.default.Fragment,null,e(v,{variant:"primary",onClick:()=>{d(!0),o({...pe})},disabled:!!a},"\u65B0\u589E\u670D\u52A1\u5668"),e(v,{onClick:l.reload,disabled:u},"\u5237\u65B0"),e(v,{onClick:()=>setJsonOpen(m=>!m),disabled:u},"\u7C98\u8D34 JSON \u65B0\u589E"));return e(q,{title:"MCP \u7BA1\u7406",desc:e("span",null,"\u589E\u5220\u6539 MCP \u670D\u52A1\u5668\uFF0C\u5199\u5165 ",e("code",null,dsiMaskPath(f)||"profile/cordis.patch.yml"),"\u3000\uFF08\u4FDD\u5B58\u540E\u9700\u91CD\u542F DSH \u751F\u6548\uFF09"),actions:O,footer:f?`\u914D\u7F6E\u6587\u4EF6\uFF1A${dsiMaskPath(f)}`:null},jsonOpen?e("div",{className:"dsi-card"},e("div",{className:"dsi-inline"},e("strong",{style:{fontSize:13}},"\u7C98\u8D34 JSON \u65B0\u589E"),e("span",{className:"dsi-badge"},jsonPlan?"\u786E\u8BA4\u5199\u5165":"\u5148\u9884\u89C8")),e(A,{value:jsonText,onChange:setJsonText,rows:6,mono:!0,placeholder:'{"mcpServers":{"tushareMcp":{"url":"https://api.tushare.pro/mcp/?token=..."}}}',disabled:u}),e("div",{className:"dsi-hint"},"\u652F\u6301 {\"mcpServers\":{...}}\u3001\u540D\u79F0\u5230\u914D\u7F6E\u7684\u6620\u5C04\u6216 {\"servers\":[...]}\uFF1Bstdio \u7528 command/args/env\uFF0C\u8FDC\u7A0B\u7528 url/headers\u3002URL \u91CC\u7684 token \u4F1A\u660E\u6587\u5199\u8FDB cordis.patch.yml\uFF0C\u5EFA\u8BAE\u6539\u6210\u73AF\u5883\u53D8\u91CF\u5F15\u7528\u3002"),jsonPlan?e("div",null,(jsonPlan.added||[]).length?e("div",{className:"dsi-hint"},"\u5C06\u65B0\u589E\uFF1A"+(jsonPlan.added||[]).join("\u3001")):null,(jsonPlan.updated||[]).length?e("div",{className:"dsi-hint"},"\u5C06\u8986\u76D6\uFF1A"+(jsonPlan.updated||[]).join("\u3001")):null,(jsonPlan.skipped||[]).length?e("div",{className:"dsi-hint"},"\u5C06\u8DF3\u8FC7\uFF1A"+(jsonPlan.skipped||[]).join("\u3001")):null,(jsonPlan.failed||[]).length?e("div",{className:"dsi-hint"},"\u6709\u95EE\u9898\uFF1A"+(jsonPlan.failed||[]).map(s=>`${s.name}\uFF08${s.error}\uFF09`).join("\uFF1B")):null,(jsonPlan.warnings||[]).map(s=>e("div",{className:"dsi-hint"},s))):null,e("div",{className:"dsi-inline"},jsonPlan?e(v,{variant:"primary",disabled:u,onClick:importJsonConfirm},u?"\u5199\u5165\u4E2D\u2026":"\u786E\u8BA4\u5199\u5165"):e(v,{variant:"primary",disabled:u||!jsonText.trim(),onClick:importJsonPreview},u?"\u89E3\u6790\u4E2D\u2026":"\u9884\u89C8"),e(v,{disabled:u,onClick:()=>{setJsonOpen(!1),setJsonPlan(null)}},"\u53D6\u6D88"))):null,e(Z),e(P,{kind:"error"},w),e(P,{kind:"ok"},c),l.loading&&!p?e(J):null,l.error?e(P,{kind:"error"},`\u8BFB\u53D6\u5931\u8D25\uFF1A${l.error}`):null,R.length?e("div",{className:"dsi-note",style:{background:"color-mix(in srgb, #f5a524 18%, transparent)"}},e("div",{style:{marginBottom:8}},`\u68C0\u6D4B\u5230 ${R.length} \u4E2A\u672A\u7EB3\u7BA1\u7684 MCP \u914D\u7F6E\uFF08\u624B\u5DE5\u5199\u5728 patch \u91CC\uFF09\uFF1A${R.map(r=>r.serverName).join("\u3001")}`),e(v,{disabled:u,onClick:()=>E(()=>T("/mcp/import",{method:"POST",sessionId:t,body:{serverNames:R.map(r=>r.serverName)}}),"\u5DF2\u5BFC\u5165\u672A\u7EB3\u7BA1\u914D\u7F6E")},"\u5168\u90E8\u5BFC\u5165\u4EE5\u4FBF\u53EF\u89C6\u5316\u7F16\u8F91")):null,a?e(Fe,{draft:a,setDraft:o,saving:u,isNew:i,onCancel:()=>{o(null),d(!1)},onSave:r=>E(async()=>{await T("/mcp/save",{method:"POST",sessionId:t,body:{server:r,previousName:i?null:a.serverName}}),o(null),d(!1)},`\u5DF2\u4FDD\u5B58 ${r.serverName}`)}):null,!N.length&&!l.loading?e("div",{className:"dsi-empty"},"\u8FD8\u6CA1\u6709 MCP \u670D\u52A1\u5668\uFF0C\u70B9\u53F3\u4E0A\u89D2\u300C\u65B0\u589E\u670D\u52A1\u5668\u300D\u5F00\u59CB\u3002"):null,N.map(r=>e("div",{className:"dsi-row",key:r.serverName},e("div",{className:"dsi-row-main"},e("div",{className:"dsi-row-name"},r.serverName,e("span",{className:"dsi-badge"},r.transport),r.enabled===!1?e("span",{className:"dsi-badge dsi-badge-off"},"\u5DF2\u505C\u7528"):e("span",{className:"dsi-badge dsi-badge-on"},"\u542F\u7528")),e("div",{className:"dsi-row-meta"},r.transport==="streamable-http"?r.url:[r.command,...r.args||[]].join(" "))),e("div",{className:"dsi-toolbar"},e(v,{onClick:()=>{d(!1),o(Ae(r))},disabled:u||!!a},"\u7F16\u8F91"),e(v,{disabled:u,onClick:()=>E(()=>T("/mcp/toggle",{method:"POST",sessionId:t,body:{serverName:r.serverName,enabled:r.enabled===!1}}),r.enabled===!1?"\u5DF2\u542F\u7528":"\u5DF2\u505C\u7528")},r.enabled===!1?"\u542F\u7528":"\u505C\u7528"),e(v,{variant:"danger",disabled:u,onClick:()=>{window.confirm(`\u786E\u5B9A\u5220\u9664 MCP \u670D\u52A1\u5668\u300C${r.serverName}\u300D\uFF1F`)&&E(()=>T("/mcp/delete",{method:"POST",sessionId:t,body:{serverName:r.serverName}}),`\u5DF2\u5220\u9664 ${r.serverName}`)}},"\u5220\u9664")))),p&&p.mcp?e("div",null,e(v,{onClick:()=>b(r=>!r)},C?"\u9690\u85CF\u751F\u6210\u7684\u914D\u7F6E":"\u67E5\u770B\u751F\u6210\u7684\u914D\u7F6E"),C?e("pre",{className:"dsi-pre",style:{marginTop:8}},p.mcp.managedPreview):null):null)}function He({rootId:n,skill:t,onDone:a,onError:o,sessionId:i}){let d=!t||t.isNew,[u,g]=h(t&&t.dir?t.dir:""),[c,k]=h(t&&t.frontmatter&&t.frontmatter.name?t.frontmatter.name:""),[w,x]=h(t&&t.frontmatter&&t.frontmatter.description?t.frontmatter.description:""),[C,b]=h(t&&t.body?t.body:""),[l,p]=h(!1),[E,N]=h(null),R=async()=>{p(!0),N(null);try{let f=u||c;await T("/skill/save",{method:"POST",sessionId:i,body:{root:n,dir:f,name:c||f,description:w,body:C}}),a(d?"\u5DF2\u65B0\u5EFA\u6280\u80FD":"\u5DF2\u4FDD\u5B58\u6280\u80FD")}catch(f){N(f.message||String(f)),o&&o(f)}finally{p(!1)}};return e("div",{className:"dsi-card"},e("strong",{style:{fontSize:13}},d?"\u65B0\u5EFA\u6280\u80FD":`\u7F16\u8F91\uFF1A${u}`),e(P,null,E),e(S,{label:"\u76EE\u5F55\u540D / name",hint:"kebab-case\uFF0C\u51B3\u5B9A\u6280\u80FD\u76EE\u5F55\u540D"},e(j,{value:u,onChange:f=>{g(f),d&&k(f)},placeholder:"my-skill",mono:!0,disabled:!d})),e(S,{label:"description",hint:"\u5FC5\u586B\uFF1A\u4E00\u53E5\u8BDD\u8BF4\u660E\u4F55\u65F6\u4F7F\u7528\u8BE5\u6280\u80FD"},e(j,{value:w,onChange:x,placeholder:"Use when \u2026"})),e(S,{label:"\u6B63\u6587\uFF08Markdown\uFF09"},e(A,{value:C,onChange:b,rows:16,mono:!0,placeholder:`## \u6982\u89C8
```

**依据 2 · 源码核查**：[lib/index.js:9052-9107](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9052-L9107)

JSON形状与允许字段正规化。

<details>
<summary>查看原文（56行）</summary>

```text
function parseMcpJsonDocument(input) {
  var doc = input;
  if (typeof input === "string") {
    var text = input.trim();
    if (!text) throw httpError(400, "error.mcp.json", "\u7C98\u8D34\u5185\u5BB9\u4E3A\u7A7A");
    try {
      doc = JSON.parse(text);
    } catch (err) {
      throw httpError(400, "error.mcp.json", "JSON \u89E3\u6790\u5931\u8D25\uFF1A" + (err && err.message ? err.message : String(err)));
    }
  }
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) {
    throw httpError(400, "error.mcp.json", '\u9700\u8981\u4E00\u4E2A JSON \u5BF9\u8C61\uFF1A{"mcpServers":{...}}\u3001\u540D\u79F0\u5230\u914D\u7F6E\u7684\u6620\u5C04\uFF0C\u6216 {"servers":[...]}');
  }
  var map = null;
  if (doc.mcpServers && typeof doc.mcpServers === "object" && !Array.isArray(doc.mcpServers)) {
    map = doc.mcpServers;
  } else if (Array.isArray(doc.servers)) {
    map = {};
    for (const row of doc.servers) {
      if (!row || typeof row !== "object") continue;
      const key = String(row.serverName || row.name || "").trim();
      if (key) map[key] = row;
    }
  } else {
    map = doc;
  }
  const names = Object.keys(map || {});
  if (!names.length) throw httpError(400, "error.mcp.json", "\u6CA1\u6709\u8BC6\u522B\u5230\u4EFB\u4F55 MCP \u670D\u52A1\u5668\u5B9A\u4E49");
  return { map, names };
}
function normalizeMcpJsonServer(name, spec) {
  if (!spec || typeof spec !== "object" || Array.isArray(spec)) {
    throw httpError(400, "error.mcp.json", String(name) + " \u7684\u914D\u7F6E\u5FC5\u987B\u662F\u5BF9\u8C61");
  }
  const rawTransport = spec.transport || spec.type || "";
  let transport = rawTransport ? MCP_JSON_TRANSPORTS[String(rawTransport).toLowerCase()] : void 0;
  if (!transport) transport = spec.url ? "streamable-http" : "stdio";
  const record = { serverName: String(spec.serverName || name).trim(), transport };
  if (transport === "stdio") {
    record.command = spec.command ? String(spec.command) : "";
    if (Array.isArray(spec.args)) record.args = spec.args.map(String);
    if (spec.env && typeof spec.env === "object" && !Array.isArray(spec.env)) record.env = { ...spec.env };
    if (spec.cwd) record.cwd = String(spec.cwd);
  } else {
    record.url = String(spec.url || "");
    if (spec.headers && typeof spec.headers === "object" && !Array.isArray(spec.headers)) record.headers = { ...spec.headers };
  }
  for (const key of ["toolCallTimeoutMs", "maxInstructionBytes"]) {
    if (spec[key] === void 0 || spec[key] === null || String(spec[key]).trim() === "") continue;
    record[key] = Number(spec[key]);
  }
  if (spec.enabled === false) record.enabled = false;
  if (spec.failOnStartupError === true) record.failOnStartupError = true;
  return validateServer(record);
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:9121-9178](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9121-L9178)

逐条容错、dryRun及真实writeMcpServers调用。

<details>
<summary>查看原文（58行）</summary>

```text
async function importMcpJsonServers(body, env = process.env) {
  const parsed = parseMcpJsonDocument(body && (body.json !== void 0 ? body.json : body.text));
  const dryRun = !!(body && body.dryRun);
  const overwrite = !(body && body.overwrite === false);
  const current = await readMcpState(env);
  const list = current.servers.slice();
  const byName = /* @__PURE__ */ new Map(list.map((s) => [String(s.serverName).toLowerCase(), s]));
  const added = [];
  const updated = [];
  const skipped = [];
  const failed = [];
  const warnings = [];
  for (const name of parsed.names) {
    let server;
    try {
      server = normalizeMcpJsonServer(name, parsed.map[name]);
    } catch (err) {
      failed.push({ name: String(name), error: err && err.message ? err.message : String(err) });
      continue;
    }
    const key = server.serverName.toLowerCase();
    const existing = byName.get(key);
    if (existing) {
      if (!overwrite) {
        skipped.push(server.serverName);
        continue;
      }
      list[list.indexOf(existing)] = server;
      updated.push(server.serverName);
    } else {
      list.push(server);
      added.push(server.serverName);
    }
    byName.set(key, server);
    warnings.push(...mcpJsonWarnings(server));
  }
  if (!added.length && !updated.length) {
    if (!failed.length && !skipped.length) throw httpError(400, "error.mcp.json", "\u6CA1\u6709\u4EFB\u4F55\u670D\u52A1\u5668\u9700\u8981\u5199\u5165");
    return { dryRun, wrote: false, added, updated, skipped, failed, warnings, serverCount: list.length, patchFile: current.patchFile };
  }
  list.sort((a, b) => String(a.serverName).localeCompare(String(b.serverName)));
  if (dryRun) {
    return { dryRun: true, wrote: false, added, updated, skipped, failed, warnings, serverCount: list.length, patchFile: current.patchFile };
  }
  const written = await writeMcpServers(list, env);
  return {
    dryRun: false,
    wrote: true,
    added,
    updated,
    skipped,
    failed,
    warnings,
    serverCount: written.servers.length,
    patchFile: written.patchFile,
    mcpFile: written.mcpFile
  };
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:7757-7776](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7757-L7776)

校验后mcp.json先、patch后。

<details>
<summary>查看原文（20行）</summary>

```text
async function writeMcpServers(servers, env = process.env) {
  const p = paths(env);
  const list = (Array.isArray(servers) ? servers : []).map(validateServer);
  const seen = /* @__PURE__ */ new Set();
  for (const server of list) {
    const key = server.serverName.toLowerCase();
    if (seen.has(key)) throw httpError(400, "error.mcp.duplicate", `serverName \u91CD\u590D\uFF1A${server.serverName}`);
    seen.add(key);
  }
  const patchText = await readTextFile(p.patchFile, "");
  const nextPatch = applyManagedBlock(patchText, renderManagedBlock(list));
  validatePatchText(nextPatch);
  validatePatchText(patchText === nextPatch ? patchText : nextPatch);
  await writeFileAtomic(p.mcpFile, JSON.stringify({ version: 1, servers: list }, null, 2) + "\n", 384);
  await writeWithBackup(p.patchFile, nextPatch, 384, 3);
  return { servers: list, patchFile: p.patchFile, mcpFile: p.mcpFile };
}
var SKILL_ROOTS = [
  { id: "dsh-global", label: "DSH \u5168\u5C40", dir: (c) => path.join(c.home, "skills"), writable: true },
  { id: "agents-global", label: "\u5171\u4EAB\u5168\u5C40 .agents", dir: (c) => path.join(c.homeDir, ".agents", "skills"), writable: true },
```

</details>

**依据 5 · 源码核查**：[lib/index.js:7483-7511](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7483-L7511)

单文件tmp/rename、备份与保留策略。

<details>
<summary>查看原文（29行）</summary>

```text
async function writeFileAtomic(file, text, mode = 384) {
  await ensureDir(path.dirname(file));
  const tmp = `${file}.tmp-${process.pid}-${Date.now()}`;
  await fsp.writeFile(tmp, text, { mode });
  await fsp.rename(tmp, file);
  try {
    await fsp.chmod(file, mode);
  } catch {
  }
}
async function writeWithBackup(file, text, mode = 384, keep = 3) {
  const previous = await readTextFile(file, null);
  if (previous !== null && previous !== text) {
    const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[-:.]/g, "").slice(0, 17);
    const base = `${file}.bak-${stamp}`;
    let candidate = base;
    for (let index = 1; await fsp.stat(candidate).catch(() => null); index += 1) {
      candidate = `${base}-${index}`;
    }
    await writeFileAtomic(candidate, previous, mode);
    await pruneBackups(file, keep);
  }
  await writeFileAtomic(file, text, mode);
}
async function listBackups(file) {
  const dir = path.dirname(file);
  const base = `${path.basename(file)}.bak-`;
  try {
    const names = (await fsp.readdir(dir)).filter((n) => n.startsWith(base));
```

</details>

**依据 6 · 源码核查**：[lib/index.js:8280-8306](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8280-L8306)

provider保存先credentials后patch，无联合回滚。

<details>
<summary>查看原文（27行）</summary>

```text
async function saveProvider(env = process.env, { providerId, provider, apiKey } = {}) {
  const id = validateProviderId(providerId);
  const p = paths(env);
  const patchText = await readTextFile(p.patchFile, "");
  const config = renderProviderConfig(provider);
  const created = !Object.prototype.hasOwnProperty.call(readProvidersFromPatch(patchText).providers, id);
  const nextPatch = mergeProviderIntoPatch(patchText, id, config);
  validatePatchText(nextPatch);
  let credentialsWritten = false;
  const secret = String(apiKey ?? "").trim();
  if (secret) {
    const credentialsText = await readTextFile(p.credentialsFile, "version: 1\n");
    const nextCredentials = mergeCredentialRef(credentialsText, config.apiKeyEnv, secret);
    await writeWithBackup(p.credentialsFile, nextCredentials, 384, 3);
    credentialsWritten = true;
  }
  await writeWithBackup(p.patchFile, nextPatch, 384, 3);
  return {
    providerId: id,
    created,
    modelCount: config.models.length,
    apiKeyEnv: config.apiKeyEnv,
    credentialsWritten,
    patchFile: p.patchFile,
    credentialsFile: p.credentialsFile
  };
}
```

</details>

**依据 7 · 源码核查**：[lib/index.js:8163-8211](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8163-L8211)

range拼接和序列化回退。

<details>
<summary>查看原文（49行）</summary>

```text
function mergeProviderIntoPatch(patchText, providerId, providerConfig) {
  const id = validateProviderId(providerId);
  const doc = parseYamlDocument(patchText, "\u914D\u7F6E\u6587\u4EF6");
  const entry = findEntry(doc, PROVIDERS_ENTRY_ID);
  if (!entry) {
    const next = newEntryDocument(id, providerConfig);
    quoteAmbiguousKeys(next.contents);
    return stringifyPatch(next);
  }
  const providers = providerMapFor(doc, entry);
  const indentUnit = 2;
  const spliced = spliceProviderEntry(patchText, providers, id, providerConfig, indentUnit);
  if (spliced !== null) return spliced;
  const node = doc.createNode(providerConfig);
  quoteAmbiguousKeys(node);
  providers.set(id, node);
  return stringifyPatch(doc);
}
function stableShape(value) {
  if (Array.isArray(value)) return `[${value.map(stableShape).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableShape(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value ?? null);
}
function spliceProviderEntry(patchText, providers, id, providerConfig, indentUnit) {
  if (!providerConfig || typeof providerConfig !== "object") return null;
  const pair = providers.items.find((item) => String(nodeToJs(item.key) ?? "") === id);
  const snippet = renderProviderEntry(id, providerConfig, indentUnit);
  if (pair) {
    const value = pair.value;
    if (stableShape(nodeToJs(value)) === stableShape(providerConfig)) return patchText;
    if (!snippet || !import_yaml.default.isMap(value) || !Array.isArray(value.range) || !Array.isArray(pair.key?.range)) return null;
    const pad2 = indentAt(patchText, pair.key.range[0]);
    const [start, end2] = value.range;
    const trailing = /\n+$/.exec(patchText.slice(start, end2))?.[0] ?? "";
    const body = [snippet.body[0].slice(indentUnit), ...snippet.body.slice(1).map((line) => pad2 + line)];
    return patchText.slice(0, start) + body.join("\n") + trailing + patchText.slice(end2);
  }
  if (!snippet || !Array.isArray(providers.range) || !providers.items.length) return null;
  const pad = indentAt(patchText, providers.items[0].key.range[0]);
  const end = providers.range[1];
  const at = patchText[end - 1] === "\n" ? end : patchText.indexOf("\n", end);
  const insertAt = at === -1 ? patchText.length : at;
  const block = `${pad}${snippet.keyLine}
${snippet.body.map((line) => pad + line).join("\n")}
`;
  return patchText.slice(0, insertAt) + block + patchText.slice(insertAt);
}
```

</details>

**依据 8 · 源码核查**：[lib/index.js:7419-7460](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7419-L7460)

profile优先级与无候选fallback。

<details>
<summary>查看原文（42行）</summary>

```text
      const pkg = JSON.parse(fs.readFileSync(path.join(profiles, entry.name, "package.json"), "utf8"));
      const bundles = pkg?.dsh?.profile?.bundles || [];
      const deps = Object.keys(pkg?.dependencies || {});
      if (bundles.includes(PLUGIN_NAME) || deps.includes(PLUGIN_NAME)) found.push(entry.name);
    } catch {
    }
  }
  return found;
}
function resolveProfileDir(env = process.env, ctx = hostContext) {
  const fromHost = currentHostProfileDir(ctx);
  if (fromHost) return fromHost;
  if (env.DSH_PROFILE_DIR) return path.resolve(env.DSH_PROFILE_DIR);
  const profiles = path.join(resolveHome(env), "profiles");
  const named = profileNameFromArgv() || env.DSH_PROFILE;
  if (typeof named === "string" && PROFILE_NAME_RE.test(named)) {
    const dir = path.join(profiles, named);
    if (fs.existsSync(dir)) return dir;
  }
  const found = profilesWithPlugin(profiles);
  if (found.length === 1) return path.join(profiles, found[0]);
  if (found.includes(DEFAULT_PROFILE_NAME)) return path.join(profiles, DEFAULT_PROFILE_NAME);
  if (found.length > 1) {
    throw httpError(
      500,
      "ambiguous_profile",
      `\u5DF2\u5B89\u88C5\u672C\u63D2\u4EF6\u7684 profile \u6709\u591A\u4E2A\uFF08${found.join("\u3001")}\uFF09\uFF0C\u65E0\u6CD5\u786E\u5B9A\u8BE5\u6539\u54EA\u4E2A\u914D\u7F6E\uFF1B\u8BF7\u8BBE\u7F6E DSH_PROFILE_DIR \u540E\u91CD\u8BD5\u3002`
    );
  }
  const fallback = typeof named === "string" && PROFILE_NAME_RE.test(named) ? named : DEFAULT_PROFILE_NAME;
  return path.join(profiles, fallback);
}
function paths(env = process.env, ctx = hostContext) {
  const home = resolveHome(env);
  const profileDir = resolveProfileDir(env, ctx);
  return {
    home,
    profileDir,
    patchFile: path.join(profileDir, "cordis.patch.yml"),
    stateDir: path.join(profileDir, ".dsh-integration"),
    mcpFile: path.join(profileDir, ".dsh-integration", "mcp.json"),
    scheduleFile: path.join(profileDir, ".dsh-integration", "unlock-schedule.json"),
```

</details>

**依据 9 · 源码核查**：[lib/index.js:7538-7568](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7538-L7568)

JS表达式sentinel编码及恢复机制。

<details>
<summary>查看原文（31行）</summary>

```text
    await fsp.rm(old.path, { force: true }).catch(() => {
    });
  }
}
var JS_PREFIX = "!!js ";
var JS_SENTINEL = "__DSHINT_JS_";
function encodeJsValue(value) {
  if (typeof value === "string" && value.startsWith(JS_PREFIX)) {
    const expr = value.slice(JS_PREFIX.length).trim();
    return JS_SENTINEL + Buffer.from(expr, "utf8").toString("base64url") + "__";
  }
  return value;
}
function decodeJsSentinels(text) {
  return text.replace(/['"]?__DSHINT_JS_([A-Za-z0-9_-]+)__['"]?/g, (_m, b64) => {
    let expr = "";
    try {
      expr = Buffer.from(b64, "base64url").toString("utf8");
    } catch {
      expr = "";
    }
    return `${JS_PREFIX}${expr}`;
  });
}
function encodeJsDeep(value) {
  if (typeof value === "string") return encodeJsValue(value);
  if (Array.isArray(value)) return value.map(encodeJsDeep);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = encodeJsDeep(v);
    return out;
```

</details>

#### 缺口

- 跨文件中断后的恢复耗时与误操作概率未知。
  **影响**：备份不等于管理员能可靠恢复一致状态，净成本可能高于手改。
  **进一步探讨**：用隔离配置故障注入第二次写失败，逐文件核对并记录恢复时间；本轮不执行。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 网关广告怎样成为模型和档位，预览确认保护了什么又遗漏什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

思考解锁只改变已配置模型的档位：客户端读取 provider/list 并调用 provider/unlock 的 dryRun，服务端 unlockProviderThinking 调 judgeProvider 判断 api、http(s) 地址和凭据条件，读取 refs 或同名环境变量后 probeGateway GET base/models，再 detectGatewayKind 请求 origin/healthz。默认 onlyWorkbuddy 要求 healthz 的 service/x-service 含 workbuddy，或全部模型 ID 带 cn:/global: 前缀。它是广告与形态识别，不是认证身份，也没有对每个档位发起真实推理。unlockPlan 保留网关不再列出的模型与没声明档位的模型；若广告有档位，直接用它替换原 reasoningEfforts，可能减少旧档位。整体组装 nextPatch 后一次备份写入，单网关错误进入结果数组不阻止其他网关。

同步清单是另一链：客户端 openSync 调 /providers/models/sync-preview，保存 syncPlan；applySync 从每个 provider 的 digest 建 expectedDigests，带 confirm:true 调 sync-apply。handle 预览传 dryRun:true，应用传 dryRun:false；syncProviderModels 每次都重新读 patch、凭据并重新探测，planModelSync 建 models、summary、details 和目标 models 的摘要。手动同步将模型列表和推理档位组合成一个 provider 配置，在同一 patch 写入；此性质不覆盖定时路径的两阶段操作。

空响应由 probeGateway 拒绝，plan.models 也有空保护；若全部不属于可探测网关则应用报502，若任一 expected 与新目标 digest 不同则整体409并不写累积 patch。这是有效的误写保护，但后端只强制 truthy confirm，expectedDigests/digest 可以省略；expected 为空时跳过比较。摘要仅为 JSON.stringify(models) 的32位FNV式摘要，既不是原 patch 版本，也不包含凭据、baseURL 或其它 provider 配置。原文件被改但目标模型列表相同就不能保证409；README“别人刚改过patch”必然失效的表述过强。

非空少报依然是删除源：planModelSync 从 configuredById 中减去网关键，所有缺失 ID 进入 removedIds，不校验分页、完整性、比例或连续多次稳定。网络成功却少报时可删除有效模型；定时自动确认使管理员没有当次预览窗口。另一方面 summary.changed 只计新增、删除 ID 和档位键集合变化。相同 ID 的名称、上下文、输出上限、input、默认档位或同键档位值发生变化，即使目标摘要变化，也可能 status=current 而跳过 merge。若恰有其它 ID 变化触发写入，重建模型表还会舍弃未列入模板的自定义字段。以上是源码分支可推导的行为，不是已在宿主复现的故障。

因此“能读模型清单”与“网关真正支持每一档”应分开验收。建议先单网关手动审阅新增、移除及档位收窄，在原件可恢复时才应用；意外删除、同 ID 更新未生效或响应不完整时停止同步并退回手改。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:7962-8015](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7962-L8015)

广告字段正规化、GET /models、空结果拒绝；不是推理请求。

<details>
<summary>查看原文（54行）</summary>

```text
function normalizeGatewayModel(raw) {
  const id = String(raw?.id ?? "").trim();
  if (!id) return null;
  const model = { id, name: String(raw?.name ?? raw?.display_name ?? "").trim() || id };
  const contextWindow = Number(raw?.context_length ?? raw?.context_window);
  if (Number.isFinite(contextWindow) && contextWindow > 0) model.contextWindow = Math.trunc(contextWindow);
  const maxTokens = Number(raw?.max_output_tokens ?? raw?.max_tokens);
  if (Number.isFinite(maxTokens) && maxTokens > 0) model.maxTokens = Math.trunc(maxTokens);
  const input = ["text"];
  if (raw?.supports_images === true || raw?.supports_vision === true) input.push("image");
  model.input = input;
  const levels = Array.isArray(raw?.reasoning_supported_efforts) ? raw.reasoning_supported_efforts.map((v) => String(v ?? "").trim()).filter(Boolean) : [];
  if (raw?.can_disable_thinking === true) levels.unshift("off");
  const efforts = raw?.supports_reasoning === true || levels.length ? buildEffortMap(levels) : null;
  if (efforts) model.reasoningEfforts = efforts;
  const fallback = String(raw?.reasoning_default_effort ?? "").trim();
  if (efforts && fallback && Object.prototype.hasOwnProperty.call(efforts, fallback)) {
    model.reasoning = fallback;
  }
  return model;
}
async function probeGateway({ baseURL, apiKey } = {}, fetchImpl) {
  const doFetch = fetchImpl ?? globalThis.fetch;
  if (typeof doFetch !== "function") throw httpError(500, "error.provider.fetch", "\u5F53\u524D\u8FD0\u884C\u65F6\u4E0D\u652F\u6301 fetch");
  const base = normalizeBaseURL(baseURL);
  const headers = { accept: "application/json" };
  const key = String(apiKey ?? "").trim();
  if (key) headers.authorization = `Bearer ${key}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  let res;
  try {
    res = await doFetch(`${base}/models`, { headers, signal: controller.signal, redirect: "follow" });
  } catch (err) {
    const reason = err?.name === "AbortError" ? `\u8D85\u8FC7 ${PROBE_TIMEOUT_MS / 1e3} \u79D2\u672A\u54CD\u5E94` : String(err?.message ?? err);
    throw httpError(502, "error.provider.probe", `\u8FDE\u63A5\u7F51\u5173\u5931\u8D25\uFF1A${reason}`);
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    const hint = res.status === 401 || res.status === 403 ? "\uFF08API Key \u53EF\u80FD\u4E0D\u6B63\u786E\uFF09" : "";
    throw httpError(502, "error.provider.probe", `\u7F51\u5173 /models \u8FD4\u56DE HTTP ${res.status}${hint}`);
  }
  let payload;
  try {
    payload = await res.json();
  } catch {
    throw httpError(502, "error.provider.probe", "\u7F51\u5173 /models \u8FD4\u56DE\u7684\u4E0D\u662F JSON");
  }
  const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  const models = rows.map(normalizeGatewayModel).filter(Boolean);
  if (!models.length) throw httpError(502, "error.provider.probe", "\u7F51\u5173\u6CA1\u6709\u8FD4\u56DE\u4EFB\u4F55\u53EF\u7528\u6A21\u578B");
  return { baseURL: base, models };
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:8307-8365](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8307-L8365)

网关条件、healthz和命名空间身份启发式。

<details>
<summary>查看原文（59行）</summary>

```text
function judgeProvider(config, { credentialNames = [], env = {} } = {}) {
  const api = String(config?.api ?? "").trim();
  const baseURL = String(config?.baseURL ?? "").trim();
  const apiKeyEnv = String(config?.apiKeyEnv ?? "").trim();
  let parsed = null;
  try {
    parsed = new URL(baseURL);
  } catch {
    parsed = null;
  }
  if (api && api !== "openai-completions") {
    return { verdict: "skipped", reason: `api \u662F ${api}\uFF0C\u4E0D\u662F OpenAI \u517C\u5BB9\u7F51\u5173` };
  }
  if (!parsed || !/^https?:$/.test(parsed.protocol)) {
    return { verdict: "skipped", reason: "baseURL \u4E0D\u662F\u53EF\u63A2\u6D4B\u7684 http(s) \u5730\u5740" };
  }
  if (apiKeyEnv && !credentialNames.includes(apiKeyEnv) && !env?.[apiKeyEnv]) {
    return { verdict: "skipped", reason: `\u51ED\u636E ${apiKeyEnv} \u4E0D\u5728\u51ED\u636E\u6587\u4EF6\u91CC` };
  }
  return { verdict: "gateway", reason: `OpenAI \u517C\u5BB9\u7F51\u5173 ${baseURL}` };
}
function declaredEfforts(model) {
  const raw = model?.reasoningEfforts;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) return raw;
  return null;
}
async function detectGatewayKind({ baseURL } = {}, fetchImpl) {
  const doFetch = fetchImpl || globalThis.fetch;
  let origin = "";
  try {
    origin = new URL(normalizeBaseURL(baseURL)).origin;
  } catch {
    return { kind: "unknown", reason: "baseURL \u65E0\u6CD5\u89E3\u6790\uFF0C\u8DF3\u8FC7\u8EAB\u4EFD\u63A2\u6D4B" };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), KIND_TIMEOUT_MS);
  try {
    const response = await doFetch(`${origin}/healthz`, { headers: { accept: "application/json" }, signal: controller.signal });
    if (!response || !response.ok) {
      return { kind: "unknown", reason: `/healthz \u8FD4\u56DE HTTP ${response ? response.status : "\u65E0\u54CD\u5E94"}` };
    }
    const header = typeof response.headers?.get === "function" ? String(response.headers.get("x-service") || "") : "";
    const body = await response.json().catch(() => null);
    const service = String(body && body.service || "").trim();
    if (/workbuddy/i.test(service) || /workbuddy/i.test(header)) {
      return { kind: "workbuddy", service: service || header, source: "healthz" };
    }
    return { kind: "unknown", reason: `/healthz \u672A\u8868\u660E\u8EAB\u4EFD${service ? `\uFF08service=${service}\uFF09` : ""}` };
  } catch (err) {
    return { kind: "unknown", reason: `/healthz \u63A2\u6D4B\u5931\u8D25\uFF1A${err?.message || String(err)}` };
  } finally {
    clearTimeout(timer);
  }
}
function realmNamespaced(models) {
  const ids = (Array.isArray(models) ? models : []).map((m) => String(m?.id ?? "")).filter(Boolean);
  if (!ids.length) return false;
  return ids.every((id) => /^(cn|global):/.test(id));
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:8366-8410](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8366-L8410)

解锁保留gone/silent并可收窄档位。

<details>
<summary>查看原文（45行）</summary>

```text
function unlockPlan(configuredModels, gatewayModels) {
  const byId = /* @__PURE__ */ new Map();
  for (const row of Array.isArray(gatewayModels) ? gatewayModels : []) {
    byId.set(String(row?.id ?? ""), row);
  }
  const report = { scanned: 0, unlocked: 0, already: 0, silent: 0, gone: 0, narrowed: 0, details: [] };
  const models = [];
  for (const row of Array.isArray(configuredModels) ? configuredModels : []) {
    const model = { ...row };
    const id = String(model.id ?? "");
    report.scanned += 1;
    const gateway = byId.get(id);
    if (!gateway) {
      report.gone += 1;
      report.details.push({ id, status: "gone" });
      models.push(model);
      continue;
    }
    const advertised = declaredEfforts(gateway);
    if (!advertised) {
      report.silent += 1;
      report.details.push({ id, status: "silent" });
      models.push(model);
      continue;
    }
    const current = declaredEfforts(model);
    if (current && stableShape(current) === stableShape(advertised)) {
      report.already += 1;
      report.details.push({ id, status: "current", levels: Object.keys(advertised) });
      models.push(model);
      continue;
    }
    model.reasoningEfforts = advertised;
    const fallback = String(gateway?.reasoning ?? "").trim();
    if (fallback && Object.prototype.hasOwnProperty.call(advertised, fallback)) model.reasoning = fallback;
    const from = current ? Object.keys(current) : [];
    const to = Object.keys(advertised);
    const lost = from.filter((level) => !to.includes(level));
    if (lost.length) report.narrowed += 1;
    report.unlocked += 1;
    report.details.push({ id, status: "unlocked", levels: to, from, to, lost });
    models.push(model);
  }
  return { models, report };
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:8447-8482](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8447-L8482)

实际probe→identity→unlockPlan→merge与错误隔离。

<details>
<summary>查看原文（36行）</summary>

```text
    try {
      const envName = String(raw.apiKeyEnv ?? "");
      const secret = envName ? readCredentialValue(credentialsText, envName) || String(env?.[envName] ?? "") : "";
      const probed = await probeGateway({ baseURL: raw.baseURL, apiKey: secret }, fetchImpl);
      const identity = await detectGatewayKind({ baseURL: raw.baseURL }, fetchImpl);
      const kindSource = identity.kind === "workbuddy" ? "healthz" : realmNamespaced(probed.models) ? "model-id-prefix" : null;
      if (onlyWorkbuddy && !kindSource) {
        results.push({
          id,
          verdict: "other",
          status: "skipped",
          reason: `${identity.reason || "\u4E0D\u662F WorkBuddy \u7F51\u5173"}\uFF1B\u6A21\u578B id \u4E5F\u4E0D\u5E26 cn:/global: \u547D\u540D\u7A7A\u95F4`,
          service: identity.service || "",
          modelCount: Array.isArray(raw.models) ? raw.models.length : 0,
          scanned: probed.models.length
        });
        continue;
      }
      const { models, report } = unlockPlan(raw.models, probed.models);
      if (dryRun) {
        results.push({ id, verdict: "gateway", reason: judged.reason, status: report.unlocked ? "pending" : "current", service: identity.service || "", kindSource, modelCount: models.length, ...report });
        continue;
      }
      if (!report.unlocked) {
        results.push({ id, verdict: "gateway", reason: judged.reason, status: "current", service: identity.service || "", kindSource, modelCount: models.length, ...report });
        continue;
      }
      const merged = mergeProviderIntoPatch(nextPatch, id, { ...raw, models });
      validatePatchText(merged);
      nextPatch = merged;
      results.push({ id, verdict: "gateway", reason: judged.reason, status: "unlocked", service: identity.service || "", kindSource, modelCount: models.length, ...report });
    } catch (err) {
      const message = err?.message || String(err);
      results.push({ id, verdict: "unreachable", status: "error", reason: `\u63A2\u6D4B\u5931\u8D25\uFF1A${message}`, error: message });
    }
  }
```

</details>

**依据 5 · 源码核查**：[lib/client.js:71-71](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/client.js#L71-L71)

openSync及applySync真实携带预览digest并确认。

```text
function Qe(n){let t=_(n);X("settings.section",n);let[a,o]=h(!1),[i,d]=h(null),[u,g]=h(null),[c,k]=h(null),w=F(()=>T(`/state?session=${encodeURIComponent(t||"")}&root=`,{sessionId:t}),[t]),x=w.data,C=x&&x.providers||{},b=C.providers||[],l=C.patchFile||x&&x.paths&&x.paths.patchFile||"",p=C.credentialsFile||"",E=b.map(s=>s.id).join(","),[N,R]=h({loading:!1,at:null,error:null,data:null}),[f,O]=h(!0),[r,M]=h(null),[H,te]=h(!1),L=async()=>{if(b.length){R({loading:!0,at:null,error:null,data:null});try{let s=await T("/provider/unlock",{method:"POST",sessionId:t,body:{providerIds:b.map(m=>m.id),dryRun:!0,onlyWorkbuddy:f}});R({loading:!1,at:Date.now(),error:null,data:s})}catch(s){R({loading:!1,at:Date.now(),error:s.message||String(s),data:null})}}};D(()=>{L()},[E,t,f]);let ge=async()=>{if(b.length){o(!0),g(null),d(null);try{let s=await T("/provider/unlock",{method:"POST",sessionId:t,body:{providerIds:b.map($=>$.id),onlyWorkbuddy:f}}),y=(s.providers||[]).filter($=>$.status==="error"),I=[s.unlockedModels?`\u5DF2\u89E3\u9501 ${s.unlockedModels} \u4E2A\u6A21\u578B\uFF08${(s.unlockedProviders||[]).join("\u3001")}\uFF09`:"\u6240\u6709\u7F51\u5173\u7684\u601D\u8003\u6863\u4F4D\u90FD\u5DF2\u662F\u6700\u65B0\uFF0C\u6CA1\u6709\u6539\u52A8\u6587\u4EF6"];y.length&&I.push(`\u63A2\u6D4B\u5931\u8D25\uFF1A${y.map($=>`${$.id}\uFF08${$.error}\uFF09`).join("\uFF1B")}`),s.changed&&I.push("\u5199\u914D\u7F6E\u524D\u5DF2\u81EA\u52A8\u5907\u4EFD\uFF0C\u91CD\u542F DeepSeek Harness \u540E\u751F\u6548\u3002"),d(I.join("\u3000")),w.reload(),await L()}catch(s){g(s.message||String(s))}finally{o(!1)}}},fe=()=>{g(null),d(null),M({...Xe})},be=s=>{g(null),d(null),M({id:s.id,apiKeyEnv:s.apiKeyEnv||"",apiKey:"",baseURL:s.baseURL||"",reasoning:s.reasoning||"",models:(s.models||[]).map(m=>({...m,checked:!0}))})},he=async()=>{if(r){te(!0),g(null),d(null);try{let m=((await T("/provider/probe",{method:"POST",sessionId:t,body:{baseURL:r.baseURL,apiKey:r.apiKey}})).models||[]).map(y=>({...y,checked:!0}));M(y=>y&&{...y,models:m}),d(`\u7F51\u5173\u8FD4\u56DE ${m.length} \u4E2A\u6A21\u578B\uFF0C\u5DF2\u5168\u90E8\u52FE\u9009\u3002`)}catch(s){g(s.message||String(s))}finally{te(!1)}}},ye=async()=>{if(r){o(!0),g(null),d(null);try{let s=(r.models||[]).filter(y=>y.checked),m=await T("/provider/save",{method:"POST",sessionId:t,body:{providerId:r.id.trim(),apiKey:r.apiKey,provider:{apiKeyEnv:r.apiKeyEnv,api:"openai-completions",baseURL:r.baseURL,reasoning:r.reasoning,models:s}}});d(`${m.created?"\u5DF2\u65B0\u589E":"\u5DF2\u66F4\u65B0"}\u4F9B\u5E94\u5546 ${m.providerId}\uFF08${m.modelCount} \u4E2A\u6A21\u578B\uFF09${m.credentialsWritten?"\uFF0C\u5BC6\u94A5\u5DF2\u5199\u5165\u51ED\u636E\u6587\u4EF6":""}\u3002\u91CD\u542F DeepSeek Harness \u540E\u751F\u6548\u3002`),M(null),w.reload(),await L()}catch(s){g(s.message||String(s))}finally{o(!1)}}},[Q,se]=h(null),[ve,W]=h(!1),U=F(()=>T(`/provider/schedule?session=${encodeURIComponent(t||"")}`,{sessionId:t}),[t]);D(()=>{se(U.data||null)},[U.data]);const[syncPlan,setSyncPlan]=h(null),[syncBusy,setSyncBusy]=h(!1),openSync=async()=>{if(!b.length)return;setSyncBusy(!0),g(null),d(null);try{const s=await T("/providers/models/sync-preview",{method:"POST",sessionId:t,body:{providerIds:b.map(m=>m.id),onlyWorkbuddy:f}});setSyncPlan(s),s.totals&&!s.totals.changed&&d("\u6A21\u578B\u6E05\u5355\u4E0E\u7F51\u5173\u4E00\u81F4\uFF0C\u65E0\u9700\u540C\u6B65\u3002")}catch(s){g(s.message||String(s))}finally{setSyncBusy(!1)}},applySync=async()=>{if(!syncPlan)return;setSyncBusy(!0),g(null),d(null);try{const expectedDigests={};for(const m of syncPlan.providers||[])m.digest&&(expectedDigests[m.id]=m.digest);const s=await T("/providers/models/sync-apply",{method:"POST",sessionId:t,body:{providerIds:b.map(m=>m.id),onlyWorkbuddy:f,confirm:!0,expectedDigests}}),y=s.totals||{};d(`\u5DF2\u540C\u6B65\u6A21\u578B\u6E05\u5355\uFF1A\u65B0\u589E ${y.added||0} \u4E2A\u3001\u79FB\u9664 ${y.removed||0} \u4E2A\u3001\u4FDD\u7559 ${y.kept||0} \u4E2A${y.levelModels?`\uFF0C\u540C\u65F6\u66F4\u65B0 ${y.levelModels} \u4E2A\u6A21\u578B\u7684\u601D\u8003\u6863\u4F4D`:""}\u3002\u5199\u524D\u5DF2\u5907\u4EFD\uFF0C\u91CD\u542F DSH \u540E\u751F\u6548\u3002`),setSyncPlan(null),w.reload(),U.reload(),await L()}catch(s){g(s.message||String(s)),setSyncPlan(null)}finally{setSyncBusy(!1)}};
```

**依据 6 · 源码核查**：[lib/index.js:8520-8604](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8520-L8604)

目标摘要、删除集合、模型重建与changed判据。

<details>
<summary>查看原文（85行）</summary>

```text
function syncDigest(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `s1-${(h >>> 0).toString(16).padStart(8, "0")}`;
}
function planModelSync(raw, gatewayModels) {
  const configured = Array.isArray(raw?.models) ? raw.models : [];
  const gateway = /* @__PURE__ */ new Map();
  for (const row of Array.isArray(gatewayModels) ? gatewayModels : []) {
    const id = String(row?.id ?? "").trim();
    if (id) gateway.set(id, row);
  }
  const configuredById = /* @__PURE__ */ new Map();
  for (const row of configured) {
    const id = String(row?.id ?? "").trim();
    if (id) configuredById.set(id, row);
  }
  const addedIds = [];
  const keptIds = [];
  for (const id of gateway.keys()) {
    if (configuredById.has(id)) keptIds.push(id);
    else addedIds.push(id);
  }
  const removedIds = [...configuredById.keys()].filter((id) => !gateway.has(id));
  const models = [];
  const details = [];
  const levelAdded = /* @__PURE__ */ new Set();
  const levelRemoved = /* @__PURE__ */ new Set();
  const levelKept = /* @__PURE__ */ new Set();
  const levelModels = [];
  for (const id of [...keptIds, ...addedIds]) {
    const gw = gateway.get(id) || {};
    const prev = configuredById.get(id) || null;
    const model = { id, name: String(gw?.name ?? prev?.name ?? "").trim() || id };
    const contextWindow = Number(gw?.contextWindow ?? prev?.contextWindow);
    if (Number.isFinite(contextWindow) && contextWindow > 0) model.contextWindow = Math.trunc(contextWindow);
    const maxTokens = Number(gw?.maxTokens ?? prev?.maxTokens);
    if (Number.isFinite(maxTokens) && maxTokens > 0) model.maxTokens = Math.trunc(maxTokens);
    const kinds = (Array.isArray(gw?.input) ? gw.input : Array.isArray(prev?.input) ? prev.input : ["text"]).map((v) => String(v));
    model.input = kinds.filter((v) => v === "text" || v === "image");
    if (!model.input.length) model.input = ["text"];
    const before = levelKeySet(prev);
    const advertised = levelKeySet(gw);
    const after = advertised || before;
    const efforts = advertised ? declaredEfforts(gw) : prev ? declaredEfforts(prev) : null;
    if (efforts) model.reasoningEfforts = efforts;
    const fallback = String(gw?.reasoning ?? prev?.reasoning ?? "").trim();
    if (efforts && fallback && THINKING_LEVELS.includes(fallback) && Object.prototype.hasOwnProperty.call(efforts, fallback)) {
      model.reasoning = fallback;
    }
    const delta = diffLevelSets(before, after);
    delta.added.forEach((key) => levelAdded.add(key));
    delta.removed.forEach((key) => levelRemoved.add(key));
    delta.kept.forEach((key) => levelKept.add(key));
    const levelsChanged = advertised ? !before || delta.added.length > 0 || delta.removed.length > 0 : false;
    if (levelsChanged) levelModels.push(id);
    details.push({
      id,
      status: prev ? "kept" : "added",
      from: before || [],
      to: after || [],
      levelsAdded: sortLevels(delta.added),
      levelsRemoved: sortLevels(delta.removed)
    });
    models.push(model);
  }
  for (const id of removedIds) details.push({ id, status: "removed" });
  const summary = {
    added: addedIds.length,
    removed: removedIds.length,
    kept: keptIds.length,
    changed: addedIds.length + removedIds.length + levelModels.length > 0,
    models: { added: addedIds, removed: removedIds, kept: keptIds },
    levels: {
      added: sortLevels(levelAdded),
      removed: sortLevels(levelRemoved),
      kept: sortLevels(levelKept)
    },
    levelModels
  };
  return { models, summary, details, digest: syncDigest(JSON.stringify(models)) };
}
```

</details>

**依据 7 · 源码核查**：[lib/index.js:8638-8697](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8638-L8697)

重探、可选摘要门禁、changed跳过、stale与最终写。

<details>
<summary>查看原文（60行）</summary>

```text
      if (onlyWorkbuddy && !kindSource) {
        results.push({
          id,
          verdict: "other",
          status: "skipped",
          reason: `${identity.reason || "不是 WorkBuddy 网关"}；模型 id 也不带 cn:/global: 命名空间`,
          service: identity.service || "",
          modelCount: (raw.models || []).length,
          scanned: probed.models.length
        });
        continue;
      }
      const plan = planModelSync(raw, probed.models);
      if (!plan.models.length) {
        throw httpError(502, "error.provider.sync.empty", "网关没有返回可用模型，已拒绝写入（不会把模型清单清空）");
      }
      const base = {
        id,
        verdict: "gateway",
        reason: judged.reason,
        service: identity.service || "",
        kindSource,
        scanned: probed.models.length,
        modelCount: plan.models.length,
        digest: plan.digest,
        summary: plan.summary,
        details: plan.details
      };
      if (dryRun) {
        results.push({ ...base, status: plan.summary.changed ? "pending" : "current" });
        continue;
      }
      const expected = expectedDigests && typeof expectedDigests === "object" && expectedDigests[id] || (typeof defaultDigest === "string" && defaultDigest.trim() ? defaultDigest.trim() : null);
      if (expected && String(expected) !== plan.digest) {
        results.push({ ...base, status: "stale", error: "预览之后模型清单已变化，请重新预览再确认" });
        continue;
      }
      if (!plan.summary.changed) {
        results.push({ ...base, status: "current" });
        continue;
      }
      const merged = mergeProviderIntoPatch(nextPatch, id, { ...raw, models: plan.models });
      validatePatchText(merged);
      nextPatch = merged;
      results.push({ ...base, status: "synced" });
    } catch (err) {
      const message = err?.message || String(err);
      results.push({ id, verdict: "unreachable", status: "error", reason: `探测失败：${message}`, error: message });
    }
  }
  const probed = results.filter((row) => row.verdict === "gateway").length;
  if (!dryRun && !probed) {
    const detail = results.map((row) => `${row.id}: ${row.error || row.reason || row.status}`).join("；");
    throw httpError(502, "error.provider.sync.probe", `网关探测失败，未写入任何内容（${detail}）`);
  }
  const stale = results.filter((row) => row.status === "stale");
  if (!dryRun && stale.length) {
    throw httpError(409, "error.provider.sync.stale", `模型清单在预览之后发生变化（${stale.map((row) => row.id).join("、")}），请重新预览再确认`);
  }
  const changed = !dryRun && nextPatch !== patchText;
```

</details>

**依据 8 · 源码核查**：[lib/index.js:9277-9306](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9277-L9306)

路由只强制confirm并将可空digest传入。

<details>
<summary>查看原文（30行）</summary>

```text
    case "POST /providers/models/sync-preview": {
      const input = body || {};
      return json(res, 200, {
        ok: true,
        data: await syncProviderModels(process.env, {
          providerIds: input.providerIds,
          onlyWorkbuddy: input.onlyWorkbuddy !== false,
          dryRun: true
        })
      });
    }
    case "POST /providers/models/sync-apply": {
      const input = body || {};
      if (!input.confirm) {
        throw httpError(400, "error.provider.sync.confirm", "写入门禁：先预览，再用 confirm=true 二次确认");
      }
      return json(res, 200, {
        ok: true,
        data: await syncProviderModels(process.env, {
          providerIds: input.providerIds,
          onlyWorkbuddy: input.onlyWorkbuddy !== false,
          dryRun: false,
          expectedDigests: input.expectedDigests && typeof input.expectedDigests === "object" ? input.expectedDigests : null,
          defaultDigest: typeof input.digest === "string" ? input.digest : null,
          source: input.source === "schedule" ? "schedule" : "manual"
        })
      });
    }
    case "POST /provider/unlock": {
      const input = body || {};
```

</details>

#### 缺口

- 网关广告完整性及逐档真实推理支持未知。
  **影响**：不能把配置可选当成实际模型任务成功；少报删除也可能使净收益为负。
  **进一步探讨**：在同一网关保存完整响应并做分页/截断对照，再用代表模型逐档请求验证，记录失败而非只看选择器。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · HTTP、队列和定时任务的保护边界在哪里？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

入口 handle 先 validateOrigin，再对非 GET/HEAD 调 validateMutation，之后读取有4 MiB上限的 JSON body 并路由。Host 必须为 loopback 或宿主公布/旧 trustedHosts 中的主机；明确 cross-site 被拒绝，有可解析 Origin 时比较 Host。写请求必须有 x-dsh-integration:1 和含 application/json 的类型。它们限制网页跨站写本地服务，固定头不是用户身份凭据，没有在本插件中形成租户或逐操作权限模型；宿主可能另有认证，本轮没有核查，不能断言全宿主无授权或安全已完整。

隐藏 UI 不等于删除接口：handle 仍将 skill/save、skill/delete 和 persona/save 调到真实文件写函数；所以两个可见栏目不是服务端所有可写范围。此事实改变权限评估，不代表已发现路径逃逸，本轮没有完整审计 Skill 路径和全部宿主权限。

apply 内的 serialize 建单条 Promise 链，所有非 GET/HEAD 请求与 sweep 共用它，错误 catch 后后续任务仍可执行。它只串行化此插件实例，不锁其它进程、编辑器、其它实例，也不提供跨文件事务。定时器每分钟检查，启动立即 sweep，effect 清理 clearInterval；没有系统级后台调度。readSchedule 默认 enabled=true、360分钟、onlyWorkbuddy=true，损坏 JSON 返回默认而非向用户保留错误，因此不应把缺省调度当作管理员明确开启的授权记录。

runScheduledUnlock 先 await unlockProviderThinking，独立捕获错误，再 await syncProviderModels(dryRun:false, source:schedule)，最后 writeSchedule；两个阶段之间会重新读和探测。每阶段可各自写 patch，后一阶段失败没有回滚前一阶段；schedule 记录失败更不会撤销已写配置。总体changed汇总表示至少一路改变，不等于整轮全成功。过期只执行一次并用当前时间推下次，不追赶历史批次；关闭后force运行不把开关重新打开。退出时清理定时器不等于取消正在执行的网关请求或正在写盘的操作。

probeGateway 的 AbortController 定时器在 fetch 返回 headers 后的 finally 立即清除，随后才 res.json。因此该8秒类超时只覆盖拿到响应之前，不能保证完整 body 读取有同样时限。healthz 的 await response.json 在 try 内，计时范围与 /models 不同。遇到慢 body 时可占住实例写队列，后续自动与人工写操作等待；这是可检查的活性风险，不是已测阻塞时长。可复用的是将人工与调度归同一串行入口、分网关结果与单文件备份；移植时仍需补外部并发和事务语义。

还有一个与启用方式直接相关的源码边界：schedule 文件缺失或损坏时，readSchedule 每次都调用 normalizeSchedule({}, Date.now())，生成“现在加间隔”的 nextRunAt；sweep 随即调用 scheduleDue，仍未到期就返回，且不持久化默认状态。因此只靠每分钟 sweep 可能始终推迟到期，不能保证默认调度最终运行。通过调度设置保存或 force 执行写出有效 schedule 后才有持久到期时间。这里是固定代码的时序推导，不是计时复现；操作者须核文件及界面下次时间，不能仅看 enabled。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:8863-8880](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8863-L8880)

body字节上限与JSON解析。

<details>
<summary>查看原文（18行）</summary>

```text
async function readBody(req, limit = BODY_LIMIT) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw httpError(413, "error.proto.bodyTooLarge", "\u8BF7\u6C42\u4F53\u8FC7\u5927");
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw httpError(400, "error.proto.invalidJson", "\u8BF7\u6C42\u4F53\u4E0D\u662F\u5408\u6CD5 JSON");
  }
}
function hostOf(value) {
```

</details>

**依据 2 · 源码核查**：[lib/index.js:8892-8940](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8892-L8940)

可信Host、Origin和固定头门禁。

<details>
<summary>查看原文（49行）</summary>

```text
function trustedHosts(ctx) {
  const trusted = [];
  const push = (value) => {
    const host = hostOf(value) || String(value || "").trim().toLowerCase();
    if (host) trusted.push(host, host.replace(/:\d+$/, ""));
  };
  const read = (name2) => {
    try {
      return typeof ctx.get === "function" ? ctx.get(name2) : ctx[name2];
    } catch {
      return void 0;
    }
  };
  try {
    const legacy = read("webRuntime");
    if (legacy && Array.isArray(legacy.trustedHosts)) legacy.trustedHosts.forEach(push);
  } catch {
  }
  for (const [name2, method] of [["webApp", "getAdvertisedUrl"], ["webServer", "getOrigin"]]) {
    try {
      const service = read(name2);
      if (service && typeof service[method] === "function") push(service[method]());
    } catch {
    }
  }
  return trusted;
}
function validateOrigin(ctx, req) {
  const host = String(req.headers.host || "");
  const trusted = trustedHosts(ctx);
  const allowed = isLoopbackHost(host) || trusted.includes(host.toLowerCase()) || trusted.includes(host.toLowerCase().replace(/:\d+$/, ""));
  if (!allowed) throw httpError(403, "error.proto.untrustedHost", "Host \u4E0D\u5728\u53D7\u4FE1\u8303\u56F4\u5185");
  if (String(req.headers["sec-fetch-site"] || "").toLowerCase() === "cross-site") {
    throw httpError(403, "error.proto.crossSite", "\u62D2\u7EDD\u8DE8\u7AD9\u8BF7\u6C42");
  }
  const origin = req.headers.origin;
  if (origin && hostOf(origin) && hostOf(origin) !== host.toLowerCase()) {
    throw httpError(403, "error.proto.badOrigin", "Origin \u4E0E Host \u4E0D\u4E00\u81F4");
  }
}
function validateMutation(req) {
  if (String(req.headers[MUTATION_HEADER] || "") !== "1") {
    throw httpError(403, "error.proto.missingHeader", `\u5199\u64CD\u4F5C\u5FC5\u987B\u643A\u5E26 ${MUTATION_HEADER}: 1`);
  }
  const type = String(req.headers["content-type"] || "");
  if (!type.toLowerCase().includes("application/json")) {
    throw httpError(415, "error.proto.contentType", "\u5199\u64CD\u4F5C\u5FC5\u987B\u4F7F\u7528 application/json");
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:9187-9244](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9187-L9244)

真实handle及隐藏Skill/persona写路由。

<details>
<summary>查看原文（58行）</summary>

```text
async function handle(ctx, req, res) {
  const url = new URL(req.url || "/", "http://localhost");
  const route = url.pathname.replace(/\/+$/, "").slice(API_PREFIX.length) || "/";
  validateOrigin(ctx, req);
  const mutation = req.method !== "GET" && req.method !== "HEAD";
  if (mutation) validateMutation(req);
  const body = mutation ? await readBody(req) : {};
  switch (`${req.method} ${route}`) {
    case "GET /state":
      return json(res, 200, { ok: true, data: await stateResponse(ctx, req, url) });
    case "GET /skill/list":
      return json(res, 200, { ok: true, data: await skillListResponse(ctx, req, url) });
    case "GET /skill/read": {
      const env = process.env;
      const cwd = sessionCwd(ctx, req, url);
      const rootPath = skillRootPath(url.searchParams.get("root"), env, cwd);
      return json(res, 200, {
        ok: true,
        data: await readSkill(rootPath, String(url.searchParams.get("dir") || ""))
      });
    }
    case "GET /persona/backup":
      return json(res, 200, {
        ok: true,
        data: await readPersonaBackup(process.env, String(url.searchParams.get("name") || ""))
      });
    case "POST /mcp/save":
      return json(res, 200, { ok: true, data: await saveMcpServer(body) });
    case "POST /mcp/delete":
      return json(res, 200, { ok: true, data: await deleteMcpServer(body) });
    case "POST /mcp/toggle":
      return json(res, 200, { ok: true, data: await toggleMcpServer(body) });
    case "POST /mcp/import":
      return json(res, 200, { ok: true, data: await importMcpServers(body) });
    case "POST /mcp/import-json":
      return json(res, 200, { ok: true, data: await importMcpJsonServers(body) });
    case "POST /skill/save": {
      const env = process.env;
      const cwd = sessionCwd(ctx, req, url);
      const rootPath = skillRootPath(body.root, env, cwd);
      const saved = await writeSkill(rootPath, body);
      return json(res, 200, { ok: true, data: saved });
    }
    case "POST /skill/delete": {
      const env = process.env;
      const cwd = sessionCwd(ctx, req, url);
      const rootPath = skillRootPath(body.root, env, cwd);
      return json(res, 200, { ok: true, data: await deleteSkill(rootPath, String(body.dir || "")) });
    }
    case "POST /persona/save": {
      const cwd = body.cwd || sessionCwd(ctx, req, url);
      return json(res, 200, { ok: true, data: await savePersona(process.env, { ...body, cwd }) });
    }
    case "GET /provider/list":
      return json(res, 200, { ok: true, data: await readProviderState(process.env) });
    case "GET /provider/schedule":
      return json(res, 200, { ok: true, data: await readSchedule(process.env) });
    // Read-only list, the unlock pass, and gateway add/edit. There is deliberately
```

</details>

**依据 4 · 源码核查**：[lib/index.js:8734-8787](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8734-L8787)

默认开启、坏状态回退、每次重建相对nextRunAt与not-due不持久化边界。

<details>
<summary>查看原文（54行）</summary>

```text
function normalizeSchedule(raw = {}, now = Date.now()) {
  const source = raw && typeof raw === "object" ? raw : {};
  const intervalMinutes = normalizeIntervalMinutes(source.intervalMinutes);
  const enabled = flag(source.enabled, true);
  const onlyWorkbuddy = flag(source.onlyWorkbuddy, true);
  const lastRunAt = positiveNumber(source.lastRunAt);
  const lastResult = source.lastResult && typeof source.lastResult === "object" ? source.lastResult : null;
  const lastError = typeof source.lastError === "string" ? source.lastError : "";
  let nextRunAt = positiveNumber(source.nextRunAt);
  if (enabled && nextRunAt === null) nextRunAt = (lastRunAt === null ? now : lastRunAt) + intervalMinutes * 6e4;
  if (!enabled) nextRunAt = null;
  return {
    enabled,
    intervalMinutes,
    onlyWorkbuddy,
    lastRunAt,
    nextRunAt,
    lastResult,
    lastError,
    updatedAt: positiveNumber(source.updatedAt)
  };
}
function positiveNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}
function scheduleDue(schedule, now = Date.now()) {
  if (!schedule || !schedule.enabled) return false;
  if (!schedule.nextRunAt) return false;
  return now >= schedule.nextRunAt;
}
async function readSchedule(env = process.env) {
  const p = paths(env);
  const raw = await readTextFile(p.scheduleFile, "");
  if (!raw.trim()) return normalizeSchedule({}, Date.now());
  try {
    return normalizeSchedule(JSON.parse(raw), Date.now());
  } catch {
    return normalizeSchedule({}, Date.now());
  }
}
async function writeSchedule(env, schedule) {
  const p = paths(env);
  await writeFileAtomic(p.scheduleFile, `${JSON.stringify(normalizeSchedule(schedule), null, 2)}
`, 384);
  return normalizeSchedule(schedule);
}
async function runScheduledUnlock(env = process.env, { now = Date.now(), fetchImpl, force = false } = {}) {
  const schedule = await readSchedule(env);
  if (!force && !scheduleDue(schedule, now)) {
    return { ran: false, reason: schedule.enabled ? "not-due" : "disabled", schedule };
  }
  let report = null;
  let sync = null;
```

</details>

**依据 5 · 源码核查**：[lib/index.js:8781-8840](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8781-L8840)

定时先unlock后sync再记录，无联合回滚。

<details>
<summary>查看原文（60行）</summary>

```text
async function runScheduledUnlock(env = process.env, { now = Date.now(), fetchImpl, force = false } = {}) {
  const schedule = await readSchedule(env);
  if (!force && !scheduleDue(schedule, now)) {
    return { ran: false, reason: schedule.enabled ? "not-due" : "disabled", schedule };
  }
  let report = null;
  let sync = null;
  let lastError = "";
  try {
    report = await unlockProviderThinking(env, { onlyWorkbuddy: schedule.onlyWorkbuddy, fetchImpl });
  } catch (err) {
    lastError = err?.message || String(err);
  }
  try {
    sync = await syncProviderModels(env, {
      onlyWorkbuddy: schedule.onlyWorkbuddy,
      dryRun: false,
      source: "schedule",
      fetchImpl
    });
  } catch (err) {
    const message = err?.message || String(err);
    lastError = lastError ? `${lastError}；${message}` : message;
  }
  const syncSummary = sync ? {
    changed: !!sync.changed,
    addedModels: sync.totals.added,
    removedModels: sync.totals.removed,
    keptModels: sync.totals.kept,
    levelModels: sync.totals.levelModels,
    syncedProviders: sync.syncedProviders,
    addedIds: (sync.providers || []).flatMap((row) => (row.summary?.models?.added || [])).slice(0, 40),
    removedIds: (sync.providers || []).flatMap((row) => (row.summary?.models?.removed || [])).slice(0, 40),
    addedLevels: [...new Set((sync.providers || []).flatMap((row) => (row.summary?.levels?.added || [])))],
    removedLevels: [...new Set((sync.providers || []).flatMap((row) => (row.summary?.levels?.removed || [])))],
    failedProviders: sync.failedProviders
  } : null;
  const failed = [...new Set([
    ...((report?.providers || []).filter((row) => row.status === "error").map((row) => row.id)),
    ...((sync?.providers || []).filter((row) => row.status === "error").map((row) => row.id))
  ])];
  const next = normalizeSchedule({
    ...schedule,
    lastRunAt: now,
    nextRunAt: now + schedule.intervalMinutes * 6e4,
    lastError,
    lastResult: report || sync ? {
      changed: !!report?.changed || !!(sync && sync.changed),
      unlockedModels: report?.unlockedModels || 0,
      unlockedProviders: report?.unlockedProviders || [],
      failedProviders: failed,
      sync: syncSummary
    } : null,
    updatedAt: now
  }, now);
  await writeSchedule(env, next);
  return { ran: true, report, sync, error: lastError || null, schedule: next };
}

// src/index.js
```

</details>

**依据 6 · 源码核查**：[lib/index.js:9321-9355](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9321-L9355)

实例队列、每分钟检查、启动sweep及清理。

<details>
<summary>查看原文（35行）</summary>

```text
var SCHEDULER_TICK_MS = 6e4;
function apply(ctx) {
  setHostContext(ctx);
  let queue = Promise.resolve();
  const serialize = (task) => {
    const next = queue.then(task, task);
    queue = next.catch(() => {
    });
    return next;
  };
  const sweep = () => serialize(() => runScheduledUnlock(process.env)).catch(() => {
  });
  ctx.effect(
    () => {
      const timer = setInterval(() => {
        sweep();
      }, SCHEDULER_TICK_MS);
      if (typeof timer.unref === "function") timer.unref();
      sweep();
      return () => clearInterval(timer);
    },
    `${PLUGIN_NAME}: scheduled thinking unlock`
  );
  ctx.effect(
    () => ctx.webServer.register({
      kind: "prefix",
      path: API_PREFIX,
      handler: (req, res) => {
        const method = req.method || "GET";
        const run = method === "GET" || method === "HEAD" ? handle(ctx, req, res) : serialize(() => handle(ctx, req, res));
        Promise.resolve(run).catch((err) => fail(res, err));
      }
    }),
    `${PLUGIN_NAME}: API route`
  );
```

</details>

**依据 7 · 源码核查**：[lib/index.js:7983-8012](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7983-L8012)

fetch后的finally先清timer，再读取body。

<details>
<summary>查看原文（30行）</summary>

```text
async function probeGateway({ baseURL, apiKey } = {}, fetchImpl) {
  const doFetch = fetchImpl ?? globalThis.fetch;
  if (typeof doFetch !== "function") throw httpError(500, "error.provider.fetch", "\u5F53\u524D\u8FD0\u884C\u65F6\u4E0D\u652F\u6301 fetch");
  const base = normalizeBaseURL(baseURL);
  const headers = { accept: "application/json" };
  const key = String(apiKey ?? "").trim();
  if (key) headers.authorization = `Bearer ${key}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  let res;
  try {
    res = await doFetch(`${base}/models`, { headers, signal: controller.signal, redirect: "follow" });
  } catch (err) {
    const reason = err?.name === "AbortError" ? `\u8D85\u8FC7 ${PROBE_TIMEOUT_MS / 1e3} \u79D2\u672A\u54CD\u5E94` : String(err?.message ?? err);
    throw httpError(502, "error.provider.probe", `\u8FDE\u63A5\u7F51\u5173\u5931\u8D25\uFF1A${reason}`);
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    const hint = res.status === 401 || res.status === 403 ? "\uFF08API Key \u53EF\u80FD\u4E0D\u6B63\u786E\uFF09" : "";
    throw httpError(502, "error.provider.probe", `\u7F51\u5173 /models \u8FD4\u56DE HTTP ${res.status}${hint}`);
  }
  let payload;
  try {
    payload = await res.json();
  } catch {
    throw httpError(502, "error.provider.probe", "\u7F51\u5173 /models \u8FD4\u56DE\u7684\u4E0D\u662F JSON");
  }
  const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  const models = rows.map(normalizeGatewayModel).filter(Boolean);
```

</details>

#### 缺口

- 宿主外围认证及其它进程同时写同一profile时的行为未完整核查。
  **影响**：不能将同源和实例队列升级为完整权限/并发安全保证。
  **进一步探讨**：取得实际宿主路由与文件写入者清单，再在隔离副本设计并发和权限验收。
- 慢body引起的队列延迟及实际失败恢复过程未测。
  **影响**：自动更新可能拖延管理员操作，超时上限不能推算全流程耗时。
  **进一步探讨**：对照立即headers/延迟body输入测队列释放时间与取消行为，先保持自动更新关闭。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件下值得试用，管理员怎样完成一次合格配置任务并承担全周期成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

仅建议已有可信固定源码、能确认 profile 且能逐文件恢复的本地 DSH 管理员，在隔离副本上试用一次手动配置任务；不建议当前来源与分发不清时直接部署到日常工作环境。一次合格任务的计量单位是“一组预先确定的配置变更完成审阅、落盘、重启加载及代表任务验证”，不是一次 HTTP 200 或配置条目数。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 可信固定源码及对应安装产物 | 安装前必需 | 核对本地分叉身份与字节 | 当前 GitHub/npm 404、来源成员未知；先核身份，不把缓存当可分发包 |
| 兼容 DSH 与宿主服务 | 启动必需 | 作者按桌面0.2.0-rc.2开发；Host注入webServer/sessions，client依赖slots/locale与React | peer optional是包管理标记，不能免除宿主服务；不匹配时先退出，不替换生产配置 |
| Node运行时 | 执行宿主代码必需；独立构建工具非直接安装必需 | package声明^22.19.0或>=24，直接使用已提交lib | 作者称直接安装不需另装Node，不代表运行时不存在；本轮未验证宿主捆绑版本 |
| 正确profile与文件写权限、原件副本 | 写配置必需 | patch/mcp.json/schedule在profile下，credentials在DSH_HOME共享 | 目录不符或不能恢复即停写；不要依赖默认desktop推断 |
| MCP client包与目标服务/命令 | MCP实际任务必需 | 插件生成@deepseek-ai/dsh-mcp-client配置，宿主启动加载服务 | 这里只写配置，不保证命令存在、服务在线或工具成功 |
| llm-pi-ai、兼容网关与必要凭据 | 模型功能必需 | providers落盘，GET /models提供广告，refs或环境变量供认证 | api不兼容、地址无效或声明的凭据缺失则跳过；不把“跳过”写成成功 |
| 网关广告完整且准确 | 同步效果必需 | 判断模型、推理档位及删除集合 | 空表保护无法识别非空少报；需人工审阅移除并验证真实请求 |
| WorkBuddy识别 | 默认范围条件，可手动放宽 | healthz或cn:/global:前缀筛选 | 不满足默认跳过；取消范围限制增加操作者审阅负担 |
| 持续运行DSH | 定时操作才必需 | 每分钟检查到期并更新 | 退出后不继续检查；手动维护无需开启调度 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 管理员先核可信版本、目标profile，保存patch、mcp.json、credentials及调度状态副本 | 可以逐文件恢复且来源清楚才继续；保持调度关闭 |
| 加载 | 管理员在隔离profile按作者方式装载bundle并重启 | 设置中出现两栏且profile徽标正确；缺栏先查加载，不重复写配置 |
| 手动任务 | 管理员只选一组MCP导入或一个网关，先预览覆盖、失败、移除和收窄 | 预览与预定清单一致；少报、意外删除或明文密钥告警先处理 |
| 确认与验收 | 管理员确认一次，核对实际文件差异，重启后检查选择器及代表MCP/模型请求 | 原配置保留、变更恰好符合预期才算合格；不以成功提示代替验收 |
| 异常及退出 | 管理员停止写入并关闭调度，先核部分成功文件，再恢复原件、禁用bundle并重启 | 旧配置与代表任务恢复；不盲重放保存，不只还原patch而遗漏mcp.json/credentials |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地存储、宿主及网络；实际费用未知 | 管理员核来源、版本、profile和备份，配置后重启与验收；耗时未知 | MIT不证明宿主/服务免费；没有安装计时或计费记录 |
| 持续使用 | 探测网络、备份空间及实际MCP/模型服务费用；金额未知 | 复核新增、删除、档位收窄及广告完整性；频率和时间未知 | 定时默认6小时不是业务更新频率证据；每次探测不等推理任务 |
| 失败恢复 | 重试网络与备份存储，服务中断损失未知 | 核对分步成功文件、选正确备份、恢复并重启；时间未知 | 仅保留三份文件备份，不能保证一组同批次恢复点 |
| 升级与退出 | 迁移存储及服务费用变化未知 | 直接lib分叉维护、宿主兼容重核、禁用bundle和清理残留配置；时间未知 | 禁用插件不自动撤销生成的MCP/providers或共享refs，需人工核对 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 从JSON形成MCP配置 | 源码有正规化、逐条错误、dryRun与受管写入 | 服务启动成功率、输入转换是否适合全部第三方格式 |
| 同步模型与档位 | 源码有重探、目标摘要及空表拒绝，手动同次patch写两者 | 广告真实性、非空少报频率、逐档真实推理支持 |
| 减少手改与恢复负担 | 分析上可省逐条拼YAML；有单文件备份 | 同条件总耗时、合格率、返工及恢复负担是否小于手改 |
| 定时更新 | 源码有到期检查、分阶段结果及下次时间 | 自动变化是否符合实际需求，误删损失和净收益 |

小样应与手改同一组变更比较：记录每次新增/移除、意外差异、重启后成功的代表任务、人工分钟与失败恢复分钟，以及实际现金支出；同时计入失败尝试。没有这些记录就不能给单位合格任务成本、节时率或ROI。当前选择试用来自可恢复的窄范围和具体预览增量，不来自真实用户需求或已测收益。正确profile无法确认、出现未预期移除、共享凭据影响他人、文件出现部分成功或恢复无法确认时立即停止，退回原件与手改流程。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:40-91](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/package.json#L40-L91)

Node/peer范围与optional标记不是实际服务可缺省保证。

<details>
<summary>查看原文（52行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24"
  },
  "devDependencies": {
    "esbuild": "^0.25.0",
    "react-dom": "18.3.1",
    "yaml": "^2.6.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.1 <4.1.0-0 || >=4.1.0-rc.1 <5",
    "@deepseek-ai/dsh-client-locale": ">=0.1.2-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.1.2-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-host-webserver": ">=0.1.2-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-web-app": ">=0.1.2-rc.1 <0.2.0-0 || >=0.2.0-rc.1 <0.3.0-0",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis": {
      "optional": true
    },
    "@deepseek-ai/dsh-client-locale": {
      "optional": true
    },
    "@deepseek-ai/dsh-client-ui-slots": {
      "optional": true
    },
    "@deepseek-ai/dsh-host-webserver": {
      "optional": true
    },
    "@deepseek-ai/dsh-web-app": {
      "optional": true
    },
    "react": {
      "optional": true
    }
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    }
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "esbuild"
    ]
```

</details>

**依据 2 · 作者声明**：[README.md:23-32](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/README.md#L23-L32)

作者宿主版本与重启要求。

<details>
<summary>查看原文（10行）</summary>

```text
## 环境要求

- **DSH 桌面版 0.2.0-rc.2**（本插件按该版本的 `settings.section` 槽位与 loader patch 机制开发；
  宿主包名从此版本起为 `@deepseek-ai/*`）。
- **Node.js `^22.19.0 || >=24`**：仅在本地构建 / 跑测试时需要；**直接安装不需要 Node**，
  因为仓库里已提交构建产物 `lib/`。
- 安装完成后**必须重启 DSH**：MCP 改动由 loader 在启动时读取（技能、人设改动即时生效）。

## 安装

```

</details>

**依据 3 · 源码核查**：[lib/index.js:7457-7469](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7457-L7469)

profile与全局共享凭据分别定位。

<details>
<summary>查看原文（13行）</summary>

```text
    patchFile: path.join(profileDir, "cordis.patch.yml"),
    stateDir: path.join(profileDir, ".dsh-integration"),
    mcpFile: path.join(profileDir, ".dsh-integration", "mcp.json"),
    scheduleFile: path.join(profileDir, ".dsh-integration", "unlock-schedule.json"),
    personaFile: path.join(home, "AGENTS.md"),
    credentialsFile: path.join(home, ".credentials.yaml")
  };
}
function httpError(status, code, message) {
  const err = new Error(message || code);
  err.statusCode = status;
  err.code = code;
  return err;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:7595-7628](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7595-L7628)

受管MCP配置及依赖的包名由renderManagedBlock生成。

<details>
<summary>查看原文（34行）</summary>

```text
    if (!Number.isFinite(num) || num < 0) problems.push(`${key} \u5FC5\u987B\u662F\u975E\u8D1F\u6570\u5B57`);
  }
  if (problems.length) throw httpError(400, "error.mcp.invalid", problems.join("\uFF1B"));
  return { ...server, serverName: name2, transport };
}
function renderManagedBlock(servers) {
  const list = Array.isArray(servers) ? servers : [];
  const rows = [];
  for (const server of list) {
    if (!server || !server.serverName || server.enabled === false) continue;
    rows.push({ id: rowId(server.serverName), name: MCP_PACKAGE, config: encodeJsDeep(mcpConfig(server)) });
  }
  const head = [
    START_MARK,
    `# \u7531 ${PLUGIN_NAME} \u7EF4\u62A4\uFF1A${rows.length} \u4E2A\u542F\u7528\u7684 MCP \u670D\u52A1\u5668\u3002`,
    "# \u76F4\u63A5\u5728\u8BBE\u7F6E\u9875\u91CC\u589E\u5220\u6539\uFF0C\u624B\u5DE5\u6539\u52A8\u672C\u533A\u5757\u4F1A\u5728\u4E0B\u6B21\u4FDD\u5B58\u65F6\u88AB\u8986\u76D6\u3002"
  ];
  if (rows.length) {
    const yamlText = import_yaml.default.stringify([{ insert: rows }], { lineWidth: 0, singleQuote: true }).trimEnd();
    head.push(decodeJsSentinels(yamlText));
  }
  head.push(END_MARK);
  return head.join("\n") + "\n";
}
function mcpConfig(server) {
  const config = {
    serverName: server.serverName,
    transport: server.transport === "streamable-http" ? "streamable-http" : "stdio"
  };
  if (config.transport === "stdio") {
    if (server.command) config.command = server.command;
    if (Array.isArray(server.args) && server.args.length) config.args = server.args.map(String);
    if (server.env && typeof server.env === "object" && Object.keys(server.env).length) config.env = { ...server.env };
    if (server.cwd) config.cwd = server.cwd;
```

</details>

**依据 5 · 源码核查**：[lib/index.js:8307-8327](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8307-L8327)

按网关形态和凭据判定可参与条件。

<details>
<summary>查看原文（21行）</summary>

```text
function judgeProvider(config, { credentialNames = [], env = {} } = {}) {
  const api = String(config?.api ?? "").trim();
  const baseURL = String(config?.baseURL ?? "").trim();
  const apiKeyEnv = String(config?.apiKeyEnv ?? "").trim();
  let parsed = null;
  try {
    parsed = new URL(baseURL);
  } catch {
    parsed = null;
  }
  if (api && api !== "openai-completions") {
    return { verdict: "skipped", reason: `api \u662F ${api}\uFF0C\u4E0D\u662F OpenAI \u517C\u5BB9\u7F51\u5173` };
  }
  if (!parsed || !/^https?:$/.test(parsed.protocol)) {
    return { verdict: "skipped", reason: "baseURL \u4E0D\u662F\u53EF\u63A2\u6D4B\u7684 http(s) \u5730\u5740" };
  }
  if (apiKeyEnv && !credentialNames.includes(apiKeyEnv) && !env?.[apiKeyEnv]) {
    return { verdict: "skipped", reason: `\u51ED\u636E ${apiKeyEnv} \u4E0D\u5728\u51ED\u636E\u6587\u4EF6\u91CC` };
  }
  return { verdict: "gateway", reason: `OpenAI \u517C\u5BB9\u7F51\u5173 ${baseURL}` };
}
```

</details>

**依据 6 · 源码核查**：[lib/index.js:8781-8840](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8781-L8840)

定时两阶段、失败记录与时间推进决定持续和恢复负担。

<details>
<summary>查看原文（60行）</summary>

```text
async function runScheduledUnlock(env = process.env, { now = Date.now(), fetchImpl, force = false } = {}) {
  const schedule = await readSchedule(env);
  if (!force && !scheduleDue(schedule, now)) {
    return { ran: false, reason: schedule.enabled ? "not-due" : "disabled", schedule };
  }
  let report = null;
  let sync = null;
  let lastError = "";
  try {
    report = await unlockProviderThinking(env, { onlyWorkbuddy: schedule.onlyWorkbuddy, fetchImpl });
  } catch (err) {
    lastError = err?.message || String(err);
  }
  try {
    sync = await syncProviderModels(env, {
      onlyWorkbuddy: schedule.onlyWorkbuddy,
      dryRun: false,
      source: "schedule",
      fetchImpl
    });
  } catch (err) {
    const message = err?.message || String(err);
    lastError = lastError ? `${lastError}；${message}` : message;
  }
  const syncSummary = sync ? {
    changed: !!sync.changed,
    addedModels: sync.totals.added,
    removedModels: sync.totals.removed,
    keptModels: sync.totals.kept,
    levelModels: sync.totals.levelModels,
    syncedProviders: sync.syncedProviders,
    addedIds: (sync.providers || []).flatMap((row) => (row.summary?.models?.added || [])).slice(0, 40),
    removedIds: (sync.providers || []).flatMap((row) => (row.summary?.models?.removed || [])).slice(0, 40),
    addedLevels: [...new Set((sync.providers || []).flatMap((row) => (row.summary?.levels?.added || [])))],
    removedLevels: [...new Set((sync.providers || []).flatMap((row) => (row.summary?.levels?.removed || [])))],
    failedProviders: sync.failedProviders
  } : null;
  const failed = [...new Set([
    ...((report?.providers || []).filter((row) => row.status === "error").map((row) => row.id)),
    ...((sync?.providers || []).filter((row) => row.status === "error").map((row) => row.id))
  ])];
  const next = normalizeSchedule({
    ...schedule,
    lastRunAt: now,
    nextRunAt: now + schedule.intervalMinutes * 6e4,
    lastError,
    lastResult: report || sync ? {
      changed: !!report?.changed || !!(sync && sync.changed),
      unlockedModels: report?.unlockedModels || 0,
      unlockedProviders: report?.unlockedProviders || [],
      failedProviders: failed,
      sync: syncSummary
    } : null,
    updatedAt: now
  }, now);
  await writeSchedule(env, next);
  return { ran: true, report, sync, error: lastError || null, schedule: next };
}

// src/index.js
```

</details>

**依据 7 · 作者声明**：[README.md:309-331](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/README.md#L309-L331)

作者说明本分叉直接维护构建产物，测试清单不能冒充当前已有测试。

<details>
<summary>查看原文（23行）</summary>

````text
> 上游把源码放在 `src/`，用 esbuild 构建到 `lib/`，并带一套 `test/` 测试；**本分叉只保留构建产物**，
> 没有 `src/` / `scripts/` / `test/`。改代码 = 直接改 `lib/`。下面仍保留上游的测试清单供参考。

```bash
# 本分叉的"构建"就是编辑这三样：
#   lib/index.js    服务端 ESM（路由、patch 读写、providers/思考解锁逻辑）
#   lib/client.js   React 客户端 bundle（压缩；中文是 \uXXXX 转义，grep 前先解码）
node --check lib/index.js       # 语法校验（package.json type=module，按 ESM 解析）
node --check lib/client.js
```

- `test/core.test.js`：patch 区块生成/替换/幂等、`!!js` 标签往返、`[]` 空占位、服务器校验、
  技能 CRUD（含 `../` 逃逸拒绝）、人设备份轮转与读取。
- `test/host.test.js`：**对着构建产物**起真 HTTP 服务，覆盖 11 条路由 + 404 分支 + 三道安全栅栏。
- `test/client.test.js`：按 `window.__ModuleLoader__.load` 的真实加载方式加载客户端包，
  断言 `settings.section` 注册（含无 locale 服务、locale 抛异常两种降级路径）。
- `test/client-render.test.js`：用真 React + `react-dom/server` 按 shell 的 `as()` 语义复刻
  React 种子，断言页面都能渲染出非空 DOM。
- `test/client-hooks.test.js`：hook 顺序与 seat hook 的白盒回归（见上一节）。
- `test/providers.test.js`：网关判定（`judgeProvider`）与 `/models` 探测、`unlockPlan` 纯函数、
  解锁写入与备份、`dryRun` 不落盘、跳过非网关与凭据缺失、`"off"` 引号与 `false` 声明往返。

调试小工具：浏览器控制台里 `localStorage.dsiDebug = '1'` 后重载，会**打印一次** seat 分享的
````

</details>

#### 缺口

- 真实管理员重复需求、同条件合格率与全周期时间/费用未知。
  **影响**：不能认定持续采用比手改划算，也不能推断付费意愿。
  **进一步探讨**：取得有重复维护任务的管理员匿名案例，在同一变更清单与相同宿主下记录手改和插件的全部成功/失败成本。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 原文件绑定、延迟删除和恢复进度能否形成比当前备份更好的设计？

**研究主题**：新假设与验证

#### 完整回答

这里提出两条相关但尚未验证的设计假设，不是插件已有贡献，也不是已确认独立产品需求。

第一条是配置变更计划绑定原文件版本。Q03 的 digest 只描述目标模型，Q02 的单文件rename不防外部进程修改；可在预览时保存原 patch、mcp.json及相关凭据引用的内容摘要、目标差异和选定profile，应用前比较原摘要，在文件变了时明确拒绝，而不是仅重算目标模型。与当前target digest相比，它增加对“用户确认的原状态”约束；与简单手改前复制文件或小补丁相比，它可能减少误覆盖，但会增加误拒绝、复核与状态保存负担。最小验证是同一套变更分别用当前实现、手改加清单以及仅加原文件比较的小补丁，注入预览后他人改patch/凭据、重复确认和中途失败，观察未授权覆盖数、误拒绝数、恢复分钟。若简单清单已同样避免错误且新增计划只增加操作，或无法可靠确定状态所有权，则否定额外机制必要性。

第二条是删除验收加跨文件恢复进度。Q03 的非空少报直接删模型，Q04 的解锁、同步和调度记录分步完成。可以先把缺失模型列成待删除状态，要求再次完整响应或管理员显式批准，再记录每一文件写前版本、已完成阶段和恢复指引；目标是让管理员能辨别未开始、部分完成与已验收，而不是提供模糊的整体成功。与已有三份bak和实例队列相比，增量是跨文件过程可见与删除门槛；与“关闭调度、人工审阅删除清单”相比，可能只是把相同劳动搬进界面，不能先认定省事。

最小验证用同一批匿名维护案例和故障矩阵比较当前手动预览、清单加人工确认及候选设计，包含合法删除、短暂非空少报、第二写失败和重启前中断。记录误删、滞留失效模型、人工确认次数与完整恢复时间；若少报在真实任务中不构成反复痛点，延迟删除造成更大混乱，或恢复账本比原件恢复更难理解，则停止该方向。外部网关完整性、宿主加载和多进程锁都不是账本能自动解决的，需要明确状态归属与串行边界。需求、效果和商业意愿仍分开未知。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:8520-8527](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8520-L8527)

当前摘要只有目标models文本。

```text
function syncDigest(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `s1-${(h >>> 0).toString(16).padStart(8, "0")}`;
}
```

**依据 2 · 源码核查**：[lib/index.js:8546-8554](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8546-L8554)

缺失ID立即成为removedIds。

```text
  const removedIds = [...configuredById.keys()].filter((id) => !gateway.has(id));
  const models = [];
  const details = [];
  const levelAdded = /* @__PURE__ */ new Set();
  const levelRemoved = /* @__PURE__ */ new Set();
  const levelKept = /* @__PURE__ */ new Set();
  const levelModels = [];
  for (const id of [...keptIds, ...addedIds]) {
    const gw = gateway.get(id) || {};
```

**依据 3 · 源码核查**：[lib/index.js:8670-8685](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8670-L8685)

摘要可选且目标无变化时跳过写。

<details>
<summary>查看原文（16行）</summary>

```text
      const expected = expectedDigests && typeof expectedDigests === "object" && expectedDigests[id] || (typeof defaultDigest === "string" && defaultDigest.trim() ? defaultDigest.trim() : null);
      if (expected && String(expected) !== plan.digest) {
        results.push({ ...base, status: "stale", error: "预览之后模型清单已变化，请重新预览再确认" });
        continue;
      }
      if (!plan.summary.changed) {
        results.push({ ...base, status: "current" });
        continue;
      }
      const merged = mergeProviderIntoPatch(nextPatch, id, { ...raw, models: plan.models });
      validatePatchText(merged);
      nextPatch = merged;
      results.push({ ...base, status: "synced" });
    } catch (err) {
      const message = err?.message || String(err);
      results.push({ id, verdict: "unreachable", status: "error", reason: `探测失败：${message}`, error: message });
```

</details>

**依据 4 · 源码核查**：[lib/index.js:7757-7776](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7757-L7776)

MCP双写与单文件保护之间的缺口是设计推导依据。

<details>
<summary>查看原文（20行）</summary>

```text
async function writeMcpServers(servers, env = process.env) {
  const p = paths(env);
  const list = (Array.isArray(servers) ? servers : []).map(validateServer);
  const seen = /* @__PURE__ */ new Set();
  for (const server of list) {
    const key = server.serverName.toLowerCase();
    if (seen.has(key)) throw httpError(400, "error.mcp.duplicate", `serverName \u91CD\u590D\uFF1A${server.serverName}`);
    seen.add(key);
  }
  const patchText = await readTextFile(p.patchFile, "");
  const nextPatch = applyManagedBlock(patchText, renderManagedBlock(list));
  validatePatchText(nextPatch);
  validatePatchText(patchText === nextPatch ? patchText : nextPatch);
  await writeFileAtomic(p.mcpFile, JSON.stringify({ version: 1, servers: list }, null, 2) + "\n", 384);
  await writeWithBackup(p.patchFile, nextPatch, 384, 3);
  return { servers: list, patchFile: p.patchFile, mcpFile: p.mcpFile };
}
var SKILL_ROOTS = [
  { id: "dsh-global", label: "DSH \u5168\u5C40", dir: (c) => path.join(c.home, "skills"), writable: true },
  { id: "agents-global", label: "\u5171\u4EAB\u5168\u5C40 .agents", dir: (c) => path.join(c.homeDir, ".agents", "skills"), writable: true },
```

</details>

**依据 5 · 源码核查**：[lib/index.js:8781-8804](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8781-L8804)

定时解锁与同步两阶段分别catch，未形成共同恢复点。

<details>
<summary>查看原文（24行）</summary>

```text
async function runScheduledUnlock(env = process.env, { now = Date.now(), fetchImpl, force = false } = {}) {
  const schedule = await readSchedule(env);
  if (!force && !scheduleDue(schedule, now)) {
    return { ran: false, reason: schedule.enabled ? "not-due" : "disabled", schedule };
  }
  let report = null;
  let sync = null;
  let lastError = "";
  try {
    report = await unlockProviderThinking(env, { onlyWorkbuddy: schedule.onlyWorkbuddy, fetchImpl });
  } catch (err) {
    lastError = err?.message || String(err);
  }
  try {
    sync = await syncProviderModels(env, {
      onlyWorkbuddy: schedule.onlyWorkbuddy,
      dryRun: false,
      source: "schedule",
      fetchImpl
    });
  } catch (err) {
    const message = err?.message || String(err);
    lastError = lastError ? `${lastError}；${message}` : message;
  }
```

</details>

#### 缺口

- 候选设计是否减少实际误删、覆盖与恢复负担未知。
  **影响**：不能将工程设想计入当前创新或称为已验证插件机会。
  **进一步探讨**：先找真实重复案例并执行同任务当前实现/简单替代/最小补丁比较；上述否定条件成立即放弃。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
