# DSH Integration Settings

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b0f3e0c](https://github.com/2384418321/dsh-integration-settings/tree/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：为本地 DSH 管理员提供 MCP JSON 导入和网关模型、思考档位的设置页，含差异预览、受管配置及文件备份。

> **亮点**：将JSON正规化/差异预览与单文件保护接进设置页，真正收益取决目标profile加载、代表请求与恢复。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：广告不是逐档验证；非空少报可删模型、可选目标digest不绑原文件，MCP/网关/调度分步非共同事务。当前来源身份另有缺口。见[Q01](#research-q01)至[Q04](#research-q04)。

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
  - [Q01 · 固定本地分叉实际入口、范围与手改基线？](#detail-section-11)
  - [Q02 · MCP导入/受管块与网关保存能否共同恢复？](#detail-section-12)
  - [Q03 · 思考解锁/模型同步及定时究竟验证何种能力？](#detail-section-13)
  - [Q04 · 真实请求边界和写队列限制到哪？](#detail-section-14)
  - [Q05 · 启用/退出成本、采用及可证伪修正？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为本地 profile 管理员在设置页导入 MCP、配置网关及模型/思考档位，替代部分手改 YAML。见[Q01](#research-q01)。

备份后手改profile/credentials再重启跑代表任务；未对上游做原创归因，YAML库不计自身创新。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MCP导入 | JSON→权威列表/受管patch | 部分非法可与合法写并存，双文件非事务 |
| 网关/档位 | 广告转换/手动差异审阅 | 声明非真实逐档支持，少报可删除 |
| 预览/保存 | 目标digest重探/备份rename | expected可省，不绑原文件 |
| 调度 | 周期解锁/模型同步 | 两步部分成功，需持久schedule |
| 本地API | 同源/写头/body限制 | 非多用户身份，隐藏后端仍在 |

**流程与依赖**

先补当前来源核实，兼容Host/Node与明确profile/三原件、对应MCP/网关是使用条件；表见[Q05](#research-q05)。

停调度/核目录备三文件、审导入/同步差异、读回重启代表任务与恢复演练；步骤见[Q05](#research-q05)。

**效果与成本**

管理员广告/删除审阅、重启任务和逐文件恢复成本未知，自动编辑不等净省时；表见[Q05](#research-q05)。

配置产物/预览有据，实际服务/推理质量、错误率与净收益另验；效果见[Q05](#research-q05)。

> **思考**：广告不是逐档验证；非空少报可删模型、可选目标digest不绑原文件，MCP/网关/调度分步非共同事务。当前来源身份另有缺口。见[Q01](#research-q01)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将JSON正规化/差异预览与单文件保护接进设置页，真正收益取决目标profile加载、代表请求与恢复。见[Q01](#research-q01)、[Q02](#research-q02)。

正规化/完整YAML校验、备份rename/目标摘要与本实例队列可借鉴；跨文件/外部并发、隐藏API和广告边界不能被自动成功遮盖。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

广告不是逐档验证；非空少报可删模型、可选目标digest不绑原文件，MCP/网关/调度分步非共同事务。当前来源身份另有缺口。见[Q01](#research-q01)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

来源缺口另核，固定实现仅本地可恢复管理员隔离手动小样；错误profile/意外移除/部分成功时停写停调度，逐文件恢复后重启，别盲重放。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

仅复核WORK沿用旧固定版，本轮INPUT无身份/成员确认，不声称最新或当前可分发；固定实现可核，未运行。限可恢复本地管理员的隔离手动小样，非无人自动配置。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、cordis.patch.yml、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：旧六题/全部findings/证据和自身code依赖完整读复核。当前定向读profile路径、原子/备份写、MCP正规化导入/双写、网关保存/probe/解锁/同步、schedule/HTTP/queue及client注册/目标digest。未全审捆绑YAML、Skill路径/全部UI或运行目标；本轮SOURCE四材料可核旧固定不补当前来源缺口。
- 下一步：后续先当前来源/身份核实，再隔离profile对非空少报/同键映射变化/外部编辑/第二写失败、无持久schedule及Host请求边界，最终代表MCP/模型请求与恢复。

**分析版本**

- **仓库**：[2384418321/dsh-integration-settings](https://github.com/2384418321/dsh-integration-settings)
- **版本号**：0.2.10-dsh.5（[固定提交 b0f3e0c](https://github.com/2384418321/dsh-integration-settings/tree/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向为原文件绑定计划、延迟删除/确认与跨文件进度，故障矩阵比误删/丢修改/恢复和负担。见[Q05](#research-q05)。

后续先当前来源/身份核实，再隔离profile对非空少报/同键映射变化/外部编辑/第二写失败、无持久schedule及Host请求边界，最终代表MCP/模型请求与恢复。

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

**插件研究总目标**：旧固定分叉的配置写入/广告同步能否可用可恢复，本轮身份缺口如何限定？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 固定本地分叉实际入口、范围与手改基线？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是固定旧提交b0f3e0c…的原生DSH插件dsh-integration-settings 0.2.10-dsh.5，本地分叉版。本轮INPUT没有此项，WORK沿用旧固定版本；准备材料可与该提交和本地body/digest核对，所以可以复核实现，但不能据此确认当前仓库身份/目录成员、最新远端或仍可分发。

实际Host注入webServer/sessions，client最终只注册MCP与providers两个settings.section。README/包描述称Skill/全局人设已移除，是界面入口范围；Host仍有Skill读写/删除与persona保存API，隐藏栏目不等撤后端能力。真实用途是为本地profile管理员把MCP JSON导入、网关配置/模型和思考档位操作搬到设置页。

基线是备份profile后手改YAML/凭据、重启、用代表任务验收。增量是正规化/差异预览、受管块和备份/单文件rename，不是新MCP协议或推理能力。未固定原上游代码做差异归因，不把捆绑YAML库/全部管理机制算分叉原创。

一次合格变更是正确profile可加载、目标MCP/模型真正完成代表任务且可恢复旧配置。保存HTTP成功、模型数量或更多档位只描述配置产物，不能当服务/推理质量验收；用户仍须理解profile、网关声明和跨文件恢复。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-9](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/package.json#L1-L9)

包身份/分叉描述。

```text
{
  "name": "dsh-integration-settings",
  "version": "0.2.10-dsh.5",
  "type": "module",
  "description": "集成插件（本地分叉版）：设置里保留「MCP 管理 / 思考解锁」两个页面；Skill 管理与全局人设已在本分叉移除。思考解锁会自动识别各网关真正支持的思考档位；模型清单同步与思考档位解锁彻底分开，先预览差异再确认，定时更新同批生效；MCP 管理支持粘贴 mcpServers JSON 先预览再新增；界面路径与 URL 凭据脱敏",
  "license": "MIT",
  "author": "2384418321 (https://github.com/2384418321)",
  "keywords": [
    "dsh",
```

**依据 2 · 源码核查**：[lib/client.js:72-74](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/client.js#L72-L74)

仅两个最终设置栏目。

```text
let xe=async s=>{if(Q){W(!0),g(null),d(null);try{let m=await T("/provider/schedule",{method:"POST",sessionId:t,body:{...Q,...s}});se(m),d(s.enabled===!1?"\u5DF2\u5173\u95ED\u5B9A\u65F6\u66F4\u65B0\uFF1B\u5DF2\u7ECF\u5230\u70B9\u7684\u90A3\u4E00\u6B21\u4E0D\u4F1A\u518D\u5199\u914D\u7F6E\u3002":`\u5B9A\u65F6\u66F4\u65B0\u5DF2\u4FDD\u5B58\uFF1A\u6BCF ${m.intervalMinutes} \u5206\u949F\uFF0C\u4EC5\u5728 DeepSeek Harness \u8FD0\u884C\u671F\u95F4\u751F\u6548\u3002`)}catch(m){g(m.message||String(m))}finally{W(!1)}}},ke=async()=>{W(!0),g(null),d(null);try{let s=await T("/provider/schedule/run",{method:"POST",sessionId:t,body:{}}),y=(s.report&&s.report.providers||[]).filter($=>$.status==="error"),I=[];s.ran?s.report?s.report.unlockedModels?I.push(`\u5DF2\u66F4\u65B0 ${s.report.unlockedModels} \u4E2A\u6A21\u578B\u7684\u601D\u8003\u6863\u4F4D`):I.push("\u5404\u7F51\u5173\u7684\u601D\u8003\u6863\u4F4D\u90FD\u5DF2\u662F\u6700\u65B0\uFF0C\u6CA1\u6709\u6539\u52A8\u6587\u4EF6"):I.push(`\u672A\u80FD\u5B8C\u6210\u89E3\u9501\uFF1A${s.error||"\u672A\u77E5\u539F\u56E0"}`):I.push("\u8FD8\u6CA1\u5230\u70B9\uFF0C\u672A\u6267\u884C\u3002"),y.length&&I.push(`\u63A2\u6D4B\u5931\u8D25\uFF1A${y.map($=>`${$.id}\uFF08${$.error}\uFF09`).join("\uFF1B")}`),s.sync&&I.push(`\u6A21\u578B\u6E05\u5355 +${(s.sync.totals||{}).added||0}/-${(s.sync.totals||{}).removed||0}`),s.report&&s.report.changed&&I.push("\u5DF2\u81EA\u52A8\u5907\u4EFD\uFF0C\u91CD\u542F DSH \u540E\u751F\u6548\u3002"),d(I.join("\u3000")),U.reload(),w.reload(),await L()}catch(s){g(s.message||String(s))}finally{W(!1)}},ee=N.data&&N.data.providers||[],G=s=>ee.find(m=>m.id===s)||null,Ne=(s,m)=>{let y=G(s);return y&&(y.details||[]).find(I=>I.id===m)||null},we=s=>{let m=G(s);if(!m)return null;if(m.verdict==="gateway"){let y=m.kindSource==="model-id-prefix"?"\u6309\u6A21\u578B\u547D\u540D\u7A7A\u95F4":"\u6309 /healthz";return e("span",{className:"dsi-badge dsi-badge-on"},`WorkBuddy${m.service?` \xB7 ${m.service}`:""}\uFF08${y}\uFF09`)}return m.verdict==="other"?e("span",{className:"dsi-badge dsi-badge-off"},"\u975E WorkBuddy \u7F51\u5173"):null},Ce=s=>{let m=G(s);if(!m)return null;if(m.verdict==="skipped")return e("span",{className:"dsi-badge"},"\u4E0D\u5904\u7406");if(m.verdict==="unreachable"||m.status==="error")return e("span",{className:"dsi-badge dsi-badge-off"},"\u63A2\u6D4B\u5931\u8D25");if(m.status==="missing")return e("span",{className:"dsi-badge dsi-badge-off"},"\u914D\u7F6E\u5DF2\u4E0D\u5728\u6587\u4EF6\u91CC");let y=[];return m.unlocked&&y.push(`\u5F85\u89E3\u9501 ${m.unlocked}`),m.already&&y.push(`\u5DF2\u4E00\u81F4 ${m.already}`),m.silent&&y.push(`\u7F51\u5173\u672A\u58F0\u660E ${m.silent}`),m.gone&&y.push(`\u7F51\u5173\u5DF2\u4E0D\u63D0\u4F9B ${m.gone}`),e("span",{className:m.unlocked?"dsi-badge dsi-badge-off":"dsi-badge dsi-badge-on"},y.join(" \xB7 ")||`${m.scanned} \u4E2A\u6A21\u578B`)},ae=N.data&&N.data.unlockedModels||0,B=ee.reduce((s,m)=>s.concat((m.details||[]).filter(y=>y.status==="unlocked")),[]),oe=B.filter(s=>(s.lost||[]).length),ne=ee.filter(s=>s.verdict==="skipped"||s.verdict==="other");return e(q,{title:"\u601D\u8003\u89E3\u9501",desc:"\u8BC6\u522B\u7F51\u5173\u652F\u6301\u7684\u601D\u8003\u6863\u4F4D\u4E0E\u53EF\u7528\u6A21\u578B\u6E05\u5355\u3002\u4E24\u4E2A\u52A8\u4F5C\u4E92\u76F8\u72EC\u7ACB\uFF1A\u300C\u5168\u90E8\u89E3\u9501\u300D\u53EA\u5199\u601D\u8003\u6863\u4F4D\uFF0C\u300C\u540C\u6B65\u6A21\u578B\u6E05\u5355\u300D\u53EA\u6539\u6A21\u578B\u5217\u8868\uFF08\u5148\u9884\u89C8\u518D\u786E\u8BA4\uFF09\u3002\u5199\u524D\u81EA\u52A8\u5907\u4EFD\uFF0C\u91CD\u542F DSH \u540E\u751F\u6548\u3002",actions:e(K.default.Fragment,null,e(v,{variant:"primary",disabled:a||N.loading||!b.length,onClick:ge},ae?`\u5168\u90E8\u89E3\u9501\uFF08${ae} \u4E2A\u6A21\u578B\u5F85\u66F4\u65B0\uFF09`:"\u5168\u90E8\u89E3\u9501"),e(v,{disabled:a,onClick:()=>{w.reload(),L()}},"\u91CD\u65B0\u8BC6\u522B"),e(v,{disabled:a||syncBusy||!b.length,onClick:openSync},"\u540C\u6B65\u6A21\u578B\u6E05\u5355"),e(v,{disabled:a,onClick:fe},"\u65B0\u589E\u7F51\u5173")),footer:l?`\u914D\u7F6E\u6587\u4EF6\uFF1A${dsiMaskPath(l)}${p?`\u3000\u5BC6\u94A5\u6587\u4EF6\uFF1A${dsiMaskPath(p)}`:""}`:null},e(Z),e(P,{kind:"error"},u),e(P,{kind:"ok"},i),e(qe,{schedule:Q,busy:ve||a,loading:U.loading,error:U.error,onChange:xe,onRunNow:ke}),N.loading?e("div",{className:"dsi-hint"},"\u6B63\u5728\u8BC6\u522B\u7F51\u5173\u652F\u6301\u7684\u601D\u8003\u6863\u4F4D\u2026"):null,N.error?e(P,{kind:"error"},`\u81EA\u52A8\u8BC6\u522B\u5931\u8D25\uFF1A${N.error}`):null,N.data&&!N.data.unlockedModels&&b.length?e("div",{className:"dsi-hint"},"\u5DF2\u8BC6\u522B\u7684\u7F51\u5173\uFF0C\u601D\u8003\u6863\u4F4D\u90FD\u5DF2\u662F\u6700\u65B0\u3002"):null,B.length?e("div",{className:"dsi-hint"},`\u68C0\u6D4B\u5230 ${B.length} \u4E2A\u6A21\u578B\u7684\u6863\u4F4D\u4E0E\u7F51\u5173\u4E0D\u4E00\u81F4`+(oe.length?`\uFF08\u5176\u4E2D ${oe.length} \u4E2A\u4F1A\u51CF\u5C11\u6863\u4F4D\uFF09`:"")+"\uFF1A"+B.slice(0,3).map(s=>`${s.id}\uFF08${(s.from&&s.from.length?s.from:["\u672A\u58F0\u660E"]).join("/")} \u2192 ${s.to.join("/")}\uFF09`).join("\uFF1B")+(B.length>3?` \u7B49 ${B.length} \u4E2A`:"")):null,ne.length?e("div",{className:"dsi-hint"},`${ne.length} \u4E2A\u4F9B\u5E94\u5546\u4E0D\u53C2\u4E0E\u89E3\u9501\uFF1A`+ne.map(s=>`${s.id}\uFF08${s.reason||"\u4E0D\u9002\u7528"}\uFF09`).join("\uFF1B")):null,b.length?e("label",{className:"dsi-check",style:{marginTop:"6px"}},e("input",{type:"checkbox",checked:f,onChange:s=>O(s.target.checked)}),e("span",null,"\u53EA\u5904\u7406 WorkBuddy \u7F51\u5173\uFF08\u6309 /healthz \u670D\u52A1\u540D\u6216 cn:/global: \u547D\u540D\u7A7A\u95F4\u5224\u65AD\uFF09")):null,syncPlan?e("div",{className:"dsi-card"},e("div",{className:"dsi-inline"},e("strong",{style:{fontSize:13}},"\u540C\u6B65\u6A21\u578B\u6E05\u5355 \u00B7 \u9884\u89C8"),e("span",{className:"dsi-badge"},`\u5C06\u65B0\u589E ${syncPlan.totals&&syncPlan.totals.added||0} \u4E2A / \u5C06\u79FB\u9664 ${syncPlan.totals&&syncPlan.totals.removed||0} \u4E2A`)),e("div",{className:"dsi-hint"},"\u53EA\u6539\u53EF\u7528\u6A21\u578B\u5217\u8868\uFF0C\u4E0D\u6539\u601D\u8003\u6863\u4F4D\uFF1B\u5199\u5165\u524D\u81EA\u52A8\u5907\u4EFD\u3002"),(syncPlan.providers||[]).map(s=>{const m=s.summary||{};return e("div",{className:"dsi-card",key:s.id,style:{padding:"9px 11px"}},e("div",{className:"dsi-inline"},e("strong",{style:{fontSize:12}},s.id),e("span",{className:s.status==="error"||s.status==="stale"?"dsi-badge dsi-badge-off":"dsi-badge dsi-badge-on"},s.status==="error"?"\u63A2\u6D4B\u5931\u8D25":s.status==="stale"?"\u9700\u91CD\u65B0\u9884\u89C8":s.status==="skipped"?"\u8DF3\u8FC7":`\u65B0\u589E ${m.added||0} / \u79FB\u9664 ${m.removed||0} / \u4E0D\u53D8 ${m.kept||0}`)),s.error?e("div",{className:"dsi-hint"},"\u539F\u56E0\uFF1A"+s.error):null,(m.models&&m.models.added||[]).length?e("div",{className:"dsi-hint"},"\u5C06\u65B0\u589E\uFF1A"+m.models.added.join("\u3001")):null,(m.models&&m.models.removed||[]).length?e("div",{className:"dsi-hint"},"\u5C06\u79FB\u9664\uFF1A"+m.models.removed.join("\u3001")):null,m.levels&&((m.levels.added||[]).length||(m.levels.removed||[]).length)?e("div",{className:"dsi-hint"},`\u601D\u8003\u6863\u4F4D\uFF1A\u65B0\u589E ${(m.levels.added||[]).join("/")||"\u65E0"}\uFF1B\u79FB\u9664 ${(m.levels.removed||[]).join("/")||"\u65E0"}${(m.levelModels||[]).length?`\uFF08\u5F71\u54CD ${m.levelModels.length} \u4E2A\u6A21\u578B\uFF09`:""}`):null)}),e("div",{className:"dsi-inline"},e(v,{variant:"primary",disabled:syncBusy,onClick:applySync},syncBusy?"\u6B63\u5728\u5199\u5165\u2026":`\u786E\u8BA4\u5199\u5165\uFF08\u65B0\u589E ${syncPlan.totals&&syncPlan.totals.added||0} / \u79FB\u9664 ${syncPlan.totals&&syncPlan.totals.removed||0}\uFF09`),e(v,{disabled:syncBusy,onClick:()=>setSyncPlan(null)},"\u53D6\u6D88"))):null,r?e(Je,{draft:r,setDraft:M,saving:a,probing:H,isNew:!b.some(s=>s.id===r.id),onCancel:()=>M(null),onSave:ye,onProbe:he}):null,w.loading&&!x?e(J):null,w.error?e(P,{kind:"error"},`\u8BFB\u53D6\u5931\u8D25\uFF1A${w.error}`):null,!b.length&&!w.loading?e("div",{className:"dsi-empty"},"\u8FD9\u4E2A profile \u7684 llm-pi-ai \u6761\u76EE\u4E0B\u8FD8\u6CA1\u6709\u914D\u7F6E\u4EFB\u4F55\u4F9B\u5E94\u5546\u3002"):null,b.map(s=>{let m=G(s.id),y=c===s.id;return e("div",{className:"dsi-row",key:s.id},e("div",{className:"dsi-row-main"},e("div",{className:"dsi-row-name"},s.id,e("span",{className:"dsi-badge"},`${s.modelCount} \u6A21\u578B`),we(s.id),Ce(s.id),s.apiKeyEnv?e("span",{className:s.hasCredential?"dsi-badge dsi-badge-on":"dsi-badge dsi-badge-off"},s.hasCredential?"\u5BC6\u94A5\u5DF2\u914D\u7F6E":"\u7F3A\u5C11\u5BC6\u94A5"):null),e("div",{className:"dsi-row-meta"},[dsiMaskUrl(s.baseURL)||"(\u672A\u8BBE\u7F6E baseURL)",s.apiKeyEnv||"(\u672A\u8BBE\u7F6E apiKeyEnv)",s.reasoning?`\u9ED8\u8BA4\u601D\u8003 ${s.reasoning}`:null,Ve(s.models)||null].filter(Boolean).join(" \xB7 ")),m&&m.reason?e("div",{className:"dsi-row-meta"},`${m.verdict==="skipped"||m.verdict==="other"?"\u672A\u53C2\u4E0E\u539F\u56E0":"\u63A2\u6D4B\u7ED3\u679C"}\uFF1A${m.reason}`):null),e("div",{className:"dsi-toolbar"},e(v,{disabled:a,onClick:()=>k(y?null:s.id)},y?"\u6536\u8D77\u6A21\u578B":"\u67E5\u770B\u6A21\u578B"),e(v,{disabled:a,onClick:()=>be(s)},"\u7F16\u8F91")),y?e("div",{className:"dsi-card",style:{marginTop:"8px"}},e("div",{className:"dsi-hint"},`${(s.models||[]).length} \u4E2A\u6A21\u578B\uFF08\u5F53\u524D\u5199\u5728\u914D\u7F6E\u91CC\u7684\u601D\u8003\u6863\u4F4D\uFF09`),(s.models||[]).map(I=>{let $=Ne(s.id,I.id),$e=$&&$.status==="unlocked";return e("div",{className:"dsi-row-meta",key:I.id},e("span",{className:"dsi-mono"},I.id),"\u3000",me(I)||"\u672A\u58F0\u660E\u6863\u4F4D",$e?`\u3000\u2192 \u7F51\u5173\u652F\u6301 ${$.to.join("/")}${($.lost||[]).length?`\uFF08\u4F1A\u53BB\u6389 ${$.lost.join("/")}\uFF09`:""}`:null,$&&$.status==="silent"?"\u3000\u7F51\u5173\u672A\u58F0\u660E\uFF0C\u4FDD\u6301\u539F\u6837":null,$&&$.status==="gone"?"\u3000\u7F51\u5173\u5DF2\u4E0D\u63D0\u4F9B\uFF0C\u4FDD\u6301\u539F\u6837":null)})):null)}))}function en(n){let t=Le(n),a=[{id:"integration-mcp",order:61,labelKey:"mcp.title",Component:_e},{id:"integration-providers",order:64,labelKey:"providers.title",Component:Qe}];for(let o of a)n.effect(()=>n.slots.inject("settings.section",()=>n.slots.register({name:"settings.section",id:o.id,order:o.order,label:()=>t(o.labelKey),locale:z},o.Component)))}var nn=["slots","locale"],tn=z;
return module.exports;
} });
```

**依据 3 · 源码核查**：[lib/index.js:8841-8846](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8841-L8846)

Host依赖。

```text
var name = PLUGIN_NAME;
var inject = ["webServer", "sessions"];
var API_PREFIX = "/api/dsh-integration";
var MUTATION_HEADER = "x-dsh-integration";
var BODY_LIMIT = 4 * 1024 * 1024;
function json(res, status, payload) {
```

**依据 4 · 源码核查**：[lib/index.js:9187-9209](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9187-L9209)

实际API入口与隐藏读取。

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/index.js:9220-9235](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9220-L9235)

Skill删写及persona后端仍在。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

#### 缺口

- 本轮INPUT无本项身份/成员，当前来源状态未确认
  **影响**：只复核WORK旧固定版本，不声称最新或当前可分发
  **进一步探讨**：主编排在后续可得来源重新核仓库ID/组件/目录成员/提交，不能用本地旧材料代替。
- 配置管理节时/错误率和持续需求无对照
  **影响**：不量化优势或推无人维护
  **进一步探讨**：隔离profile比手改/预览写入的合格任务、恢复时间与误配置。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · MCP导入/受管块与网关保存能否共同恢复？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

resolveProfileDir依Host当前profile、显式环境、命名/已装插件目录判定；多候选无明确默认则拒，仍有fallback，必须让管理员核实际目录。MCP权威列表位profile/.dsh-integration/mcp.json，启用项生成官方MCP client受管patch块；手改受管块下次可能被权威列表覆盖。

JSON导入逐条normalize，非法项放failed但合法项仍可写；默认overwrite同名、overwrite:false则skip。dryRun仅返回差异，apply重新读当前列表并重算，不携完整原状态绑定的计划。要同时看updated/failed而不只added。

writeMcpServers先校验名字/重复及整个生成YAML，随后writeFileAtomic(mcp.json)，再writeWithBackup(patch)。原子helper临时文件rename+chmod、patch保最多三备份是有用的单文件保护，却不是两文件共同事务；第二步失败可留下权威列表已新、宿主patch旧。恢复只还patch不还mcp.json，下次仍会重生成新块。

saveProvider也是先读patch并校验，若给secret先备份/写credentials，再备份/写patch，途中失败可部分生效。没有跨文件commit record/自动共同回滚，也没写前比外部编辑版本；备份不是自动恢复成功。出现失败先停调度并逐文件比原件/当前/备份，别整体盲重放覆盖人手变动。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:7428-7459](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7428-L7459)

profile选择/拒歧义及路径。

<details>
<summary>查看原文（32行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/index.js:7483-7511](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7483-L7511)

单文件tmp/rename/chmod和备份。

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

**依据 3 · 源码核查**：[lib/index.js:7757-7776](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7757-L7776)

列表校验，mcp.json→patch顺序。

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

**依据 4 · 源码核查**：[lib/index.js:9121-9174](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9121-L9174)

导入逐条failed/overwrite/dryRun及正式写。

<details>
<summary>查看原文（54行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/index.js:8280-8306](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8280-L8306)

credentials先于patch的provider保存。

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

#### 缺口

- 第二文件失败/外部编辑时真实部分状态和恢复未注入
  **影响**：单文件保护不构成跨文件事务、不能承诺无丢更新
  **进一步探讨**：隔离profile模拟第二写失败及外部编辑，核三类原件/备份并重启代表任务。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 思考解锁/模型同步及定时究竟验证何种能力？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

probeGateway取/models，normalize按reasoning_supported_efforts/supports_reasoning/can_disable_thinking等声明生成档位，healthz service或cn:/global:前缀筛WorkBuddy兼容类型。不是逐档生成测试，更不是密码学服务认证或推理质量验证。“真正支持”只能说配置反映网关广告，实际可接受和有效要另跑代表请求。

unlockPlan保原模型集合，匹配ID且有declared efforts才替档位，缺模型/无声明保原值；独立模型sync以网关非空目标列表生成added/kept/removed，拒空集合是保护，但非空截断/临时少报仍能删除原模型。没有退役独立确认或连续观察窗口，不宜默认无人值守。

正常client预览后收各provider digest，apply传confirm:true/expectedDigests；后端重探目标，expected给了且不同则标stale，任何stale拒整次最后写入，这是实在陈旧预览保护。但expected可省、confirm只是调用方字段，digest为目标models的s1摘要，不绑预览时原patch/credentials完整字节。单实例队列不防外部编辑。

plan.summary.changed只据模型增删和档位键增删，单独name/context/maxTokens/input或档位同键映射值变化可能产生不同目标却被current跳过，不是所有模型信息都刷新。定时每分钟同队列先unlock再sync各自写/捕错，最后写schedule，第二项失败不会撤第一项，所谓同批不是共同事务。

缺失/坏schedule时readSchedule每次normalize({},Date.now())，enabled默认true、nextRunAt变当前+interval；真实tick每次重算后not-due是可由源码推出的启动边界，非本轮计时复现。应保存持久schedule并核具体nextRunAt，先完成删除/恢复验收再开。定时结果/变更数不是模型服务可用性结论。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:7966-7984](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7966-L7984)

只读广告字段生成档位。

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/index.js:7984-8010](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7984-L8010)

models探测而非逐档生成。

<details>
<summary>查看原文（27行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:8333-8365](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8333-L8365)

healthz/命名空间兼容判断。

<details>
<summary>查看原文（33行）</summary>

```text
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

**依据 4 · 源码核查**：[lib/index.js:8366-8410](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8366-L8410)

解锁保留模型/无声明。

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

**依据 5 · 源码核查**：[lib/index.js:8520-8604](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8520-L8604)

s1摘要、目标模型及changed只计增删/档位键。

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

**依据 6 · 源码核查**：[lib/index.js:8650-8703](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8650-L8703)

非空保护/可选expected/stale整次拒/最终写。

<details>
<summary>查看原文（54行）</summary>

```text
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
  if (changed) await writeWithBackup(p.patchFile, nextPatch, 384, 3);
  const totals = {
    added: results.reduce((sum, row) => sum + (row.summary?.added || 0), 0),
    removed: results.reduce((sum, row) => sum + (row.summary?.removed || 0), 0),
    kept: results.reduce((sum, row) => sum + (row.summary?.kept || 0), 0),
    levelModels: results.reduce((sum, row) => sum + (row.summary?.levelModels?.length || 0), 0),
```

</details>

**依据 7 · 源码核查**：[lib/client.js:71-71](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/client.js#L71-L71)

客户端预览digest→confirm申请。

```text
function Qe(n){let t=_(n);X("settings.section",n);let[a,o]=h(!1),[i,d]=h(null),[u,g]=h(null),[c,k]=h(null),w=F(()=>T(`/state?session=${encodeURIComponent(t||"")}&root=`,{sessionId:t}),[t]),x=w.data,C=x&&x.providers||{},b=C.providers||[],l=C.patchFile||x&&x.paths&&x.paths.patchFile||"",p=C.credentialsFile||"",E=b.map(s=>s.id).join(","),[N,R]=h({loading:!1,at:null,error:null,data:null}),[f,O]=h(!0),[r,M]=h(null),[H,te]=h(!1),L=async()=>{if(b.length){R({loading:!0,at:null,error:null,data:null});try{let s=await T("/provider/unlock",{method:"POST",sessionId:t,body:{providerIds:b.map(m=>m.id),dryRun:!0,onlyWorkbuddy:f}});R({loading:!1,at:Date.now(),error:null,data:s})}catch(s){R({loading:!1,at:Date.now(),error:s.message||String(s),data:null})}}};D(()=>{L()},[E,t,f]);let ge=async()=>{if(b.length){o(!0),g(null),d(null);try{let s=await T("/provider/unlock",{method:"POST",sessionId:t,body:{providerIds:b.map($=>$.id),onlyWorkbuddy:f}}),y=(s.providers||[]).filter($=>$.status==="error"),I=[s.unlockedModels?`\u5DF2\u89E3\u9501 ${s.unlockedModels} \u4E2A\u6A21\u578B\uFF08${(s.unlockedProviders||[]).join("\u3001")}\uFF09`:"\u6240\u6709\u7F51\u5173\u7684\u601D\u8003\u6863\u4F4D\u90FD\u5DF2\u662F\u6700\u65B0\uFF0C\u6CA1\u6709\u6539\u52A8\u6587\u4EF6"];y.length&&I.push(`\u63A2\u6D4B\u5931\u8D25\uFF1A${y.map($=>`${$.id}\uFF08${$.error}\uFF09`).join("\uFF1B")}`),s.changed&&I.push("\u5199\u914D\u7F6E\u524D\u5DF2\u81EA\u52A8\u5907\u4EFD\uFF0C\u91CD\u542F DeepSeek Harness \u540E\u751F\u6548\u3002"),d(I.join("\u3000")),w.reload(),await L()}catch(s){g(s.message||String(s))}finally{o(!1)}}},fe=()=>{g(null),d(null),M({...Xe})},be=s=>{g(null),d(null),M({id:s.id,apiKeyEnv:s.apiKeyEnv||"",apiKey:"",baseURL:s.baseURL||"",reasoning:s.reasoning||"",models:(s.models||[]).map(m=>({...m,checked:!0}))})},he=async()=>{if(r){te(!0),g(null),d(null);try{let m=((await T("/provider/probe",{method:"POST",sessionId:t,body:{baseURL:r.baseURL,apiKey:r.apiKey}})).models||[]).map(y=>({...y,checked:!0}));M(y=>y&&{...y,models:m}),d(`\u7F51\u5173\u8FD4\u56DE ${m.length} \u4E2A\u6A21\u578B\uFF0C\u5DF2\u5168\u90E8\u52FE\u9009\u3002`)}catch(s){g(s.message||String(s))}finally{te(!1)}}},ye=async()=>{if(r){o(!0),g(null),d(null);try{let s=(r.models||[]).filter(y=>y.checked),m=await T("/provider/save",{method:"POST",sessionId:t,body:{providerId:r.id.trim(),apiKey:r.apiKey,provider:{apiKeyEnv:r.apiKeyEnv,api:"openai-completions",baseURL:r.baseURL,reasoning:r.reasoning,models:s}}});d(`${m.created?"\u5DF2\u65B0\u589E":"\u5DF2\u66F4\u65B0"}\u4F9B\u5E94\u5546 ${m.providerId}\uFF08${m.modelCount} \u4E2A\u6A21\u578B\uFF09${m.credentialsWritten?"\uFF0C\u5BC6\u94A5\u5DF2\u5199\u5165\u51ED\u636E\u6587\u4EF6":""}\u3002\u91CD\u542F DeepSeek Harness \u540E\u751F\u6548\u3002`),M(null),w.reload(),await L()}catch(s){g(s.message||String(s))}finally{o(!1)}}},[Q,se]=h(null),[ve,W]=h(!1),U=F(()=>T(`/provider/schedule?session=${encodeURIComponent(t||"")}`,{sessionId:t}),[t]);D(()=>{se(U.data||null)},[U.data]);const[syncPlan,setSyncPlan]=h(null),[syncBusy,setSyncBusy]=h(!1),openSync=async()=>{if(!b.length)return;setSyncBusy(!0),g(null),d(null);try{const s=await T("/providers/models/sync-preview",{method:"POST",sessionId:t,body:{providerIds:b.map(m=>m.id),onlyWorkbuddy:f}});setSyncPlan(s),s.totals&&!s.totals.changed&&d("\u6A21\u578B\u6E05\u5355\u4E0E\u7F51\u5173\u4E00\u81F4\uFF0C\u65E0\u9700\u540C\u6B65\u3002")}catch(s){g(s.message||String(s))}finally{setSyncBusy(!1)}},applySync=async()=>{if(!syncPlan)return;setSyncBusy(!0),g(null),d(null);try{const expectedDigests={};for(const m of syncPlan.providers||[])m.digest&&(expectedDigests[m.id]=m.digest);const s=await T("/providers/models/sync-apply",{method:"POST",sessionId:t,body:{providerIds:b.map(m=>m.id),onlyWorkbuddy:f,confirm:!0,expectedDigests}}),y=s.totals||{};d(`\u5DF2\u540C\u6B65\u6A21\u578B\u6E05\u5355\uFF1A\u65B0\u589E ${y.added||0} \u4E2A\u3001\u79FB\u9664 ${y.removed||0} \u4E2A\u3001\u4FDD\u7559 ${y.kept||0} \u4E2A${y.levelModels?`\uFF0C\u540C\u65F6\u66F4\u65B0 ${y.levelModels} \u4E2A\u6A21\u578B\u7684\u601D\u8003\u6863\u4F4D`:""}\u3002\u5199\u524D\u5DF2\u5907\u4EFD\uFF0C\u91CD\u542F DSH \u540E\u751F\u6548\u3002`),setSyncPlan(null),w.reload(),U.reload(),await L()}catch(s){g(s.message||String(s)),setSyncPlan(null)}finally{setSyncBusy(!1)}};
```

**依据 8 · 源码核查**：[lib/index.js:9289-9304](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9289-L9304)

confirm门槛与可选expected。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

**依据 9 · 源码核查**：[lib/index.js:8734-8779](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8734-L8779)

缺失schedule默认重新生成。

<details>
<summary>查看原文（46行）</summary>

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
```

</details>

**依据 10 · 源码核查**：[lib/index.js:8781-8840](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8781-L8840)

定时解锁/同步分步与最后记账。

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

#### 缺口

- 网关少报/档位声明正确性、调度启动和实际请求效果未测
  **影响**：配置成功不等能力解锁，自动删除/调度建议受限
  **进一步探讨**：模拟非空少报/同键值变化和无持久schedule，核diff/文件；再对每档代表请求与恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 真实请求边界和写队列限制到哪？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

HTTP先validateOrigin：仅loopback或trustedHosts、拒Sec-Fetch-Site:cross-site、Origin可解析且host不同拒；mutation要求x-dsh-integration:1与application/json，readBody限4MB。应把这些本地同源防护算实际机制，不能误说毫无防护；固定头、Host/Origin和session目标定位不等用户身份/多租户授权，真实部署还依Host监听/认证。

apply里的Promise queue串化所有非GET/HEAD写与每分钟scheduler，错误catch后下一项仍继续，防本实例写相撞；GET/HEAD不入队。另进程或管理员同文件编辑不受锁，无原文件CAS，多挂载的hostContext也非由队列证明隔离。不能因有队列保证全局线性一致。

client栏目只隐藏Skill/persona，后端仍路由到相关保存/删除；本轮不全审其路径/符号链接/所有权限链，因此不对整个插件作安全保证，也不从接口存在直接推远程漏洞。网关probe的timer在fetch headers后finally清除，之后才res.json，完整body耗时不由该timer限定；实际超时/网络预算需按调用链分别核。effect清timer和撤路由是入口回收，不等撤已经写的配置/credentials或已发网络请求。

维护上固定包直接维护lib构建产物且含第三方YAML大段，本轮git清单不见该分叉src/test；这是维护与验证范围，不能用README保留上游测试说明当本分叉测试通过。目标宿主兼容与发布字节均未运行验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:8844-8875](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8844-L8875)

固定头和4MB body。

<details>
<summary>查看原文（32行）</summary>

```text
var MUTATION_HEADER = "x-dsh-integration";
var BODY_LIMIT = 4 * 1024 * 1024;
function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "content-length": Buffer.byteLength(body)
  });
  res.end(body);
}
function fail(res, err) {
  const status = err && err.statusCode ? err.statusCode : 500;
  json(res, status, {
    ok: false,
    code: err && err.code || "error.internal",
    error: err && err.message || String(err)
  });
}
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
```

</details>

**依据 2 · 源码核查**：[lib/index.js:8919-8942](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8919-L8942)

Host/Origin/fetch-site与写校验。

<details>
<summary>查看原文（24行）</summary>

```text
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
function sessionCwd(ctx, req, url) {
  const id = req.headers["x-dsh-integration-session"] || url.searchParams.get("session");
```

</details>

**依据 3 · 源码核查**：[lib/index.js:9187-9195](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9187-L9195)

先校验再路由。

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
```

**依据 4 · 源码核查**：[lib/index.js:9220-9235](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9220-L9235)

隐藏后端仍可写。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[lib/index.js:9321-9355](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9321-L9355)

单实例Promise队列/读绕开/定时与route回收。

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

**依据 6 · 源码核查**：[lib/index.js:7984-8010](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7984-L8010)

headers返回后清timer再读JSON。

<details>
<summary>查看原文（27行）</summary>

```text
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
```

</details>

#### 缺口

- Host认证/多实例隔离、全部Skill路径与目标宿主兼容未核
  **影响**：只供本人可恢复本地profile有限试用，不作共享权限系统背书
  **进一步探讨**：隔离假请求/多进程编辑/慢body与宿主加载测试；隐藏能力按真实入口再专项审。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启用/退出成本、采用及可证伪修正？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

只建议有完整profile备份、能手工核配置与逐文件恢复的本地单用户管理员有限试用固定实现；本轮当前身份/成员缺口须另核后再考虑获取部署。先停自动调度，核profile，保mcp.json、patch和credentials原件，只用无敏感测试MCP/单网关手动导入/同步，审updated/failed/removed；读回后重启并做代表请求，不按档位/模型计数验收。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 当前来源身份/分发复核 | 当前获取前必需 | 本轮只旧固定本地材料 | 不称最新/仍可下载 |
| 兼容DSH webServer/sessions/settings slots与Node | 加载必需 | 双设置页/本地API | 注册不等宿主可用 |
| 明确profile/写权限及三类独立原件 | 写入前必需 | 配置与恢复 | 无法恢复则保留手改路径 |
| MCP程序/远端及网关/models/凭据 | 对应任务必需 | 加载/探测和代表任务 | 保存/广告不等支持 |
| 管理员懂模型/档位/删除含义 | 持续必需 | 审预览与错误 | 不开无人值守调度 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 边界准备 | 管理员核来源/profile、停调度并备三原件 | 目标目录明确、能逐文件回退 |
| MCP手动小样 | 预览JSON的added/updated/failed再写 | 列表+patch一致，重启代表调用 |
| 网关小样 | 预览模型/档位与removed再apply | 检查三文件、实际请求支持 |
| 恢复演练 | 第二文件失败/非空少报用副本演练 | 部分成功可定位与旧配置可用 |
| 调度退出 | 后启/保存schedule；停用先核文件 | 卸插件不撤已有配置和凭据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/MCP/网关/备份资源未知 | 核来源/profile、预览、重启验收 | 本轮未安装，接线耗时未知 |
| 持续使用 | 探测网络/备份与配置写资源未知 | 审少报删除/广告/兼容及调度 | 频率可设但实际维护无对照 |
| 失败恢复 | 重探/副本保留未知 | 停写并比mcp.json/patch/credentials | 单文件保护非共同回滚 |
| 升级退出 | 已写配置与凭据存储未知 | 管理受管块/密钥引用/后端能力 | 卸载不撤配置副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 少手写 | 正规化/预览/受管块 | 实际错误率/净节时 |
| 档位配置 | 广告转换与保留规则 | 每档真实接受/质量 |
| 写前保护 | YAML校验/单文件rename/备份 | 外部并发/跨文件恢复 |
| 自动维护 | 调度/写队列/结果保存 | 少报删除和启动默认真实影响 |

错误profile、意外删除、部分写成功或不能确认恢复时停写/停调度，逐文件核原件与备份后恢复并重启，不盲重放；多人共享/无人值守和不能手改恢复的人不宜扩展。

未验证方向是绑定原文件摘要的配置计划、模型删除的连续独立观察或明确确认、跨文件提交进度及可补偿恢复。相对现可选目标digest+逐文件备份，增量在本地并发与少报/部分成功可识别，不是声称已有事务。最小对照非空截断列表、外部编辑、第二写失败，比较误删/丢修改/恢复时间和额外操作；若只是加确认仍丢数据或延迟删除造成服务问题，否定/收窄。未实现不计评分。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:7451-7467](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7451-L7467)

profile三类文件位置。

<details>
<summary>查看原文（17行）</summary>

```text
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
    personaFile: path.join(home, "AGENTS.md"),
    credentialsFile: path.join(home, ".credentials.yaml")
  };
}
function httpError(status, code, message) {
  const err = new Error(message || code);
  err.statusCode = status;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:7757-7776](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7757-L7776)

MCP两步写基线。

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

**依据 3 · 源码核查**：[lib/index.js:8280-8306](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8280-L8306)

凭据与patch顺序。

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

**依据 4 · 源码核查**：[lib/index.js:8650-8703](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8650-L8703)

非空少报/摘要边界。

<details>
<summary>查看原文（54行）</summary>

```text
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
  if (changed) await writeWithBackup(p.patchFile, nextPatch, 384, 3);
  const totals = {
    added: results.reduce((sum, row) => sum + (row.summary?.added || 0), 0),
    removed: results.reduce((sum, row) => sum + (row.summary?.removed || 0), 0),
    kept: results.reduce((sum, row) => sum + (row.summary?.kept || 0), 0),
    levelModels: results.reduce((sum, row) => sum + (row.summary?.levelModels?.length || 0), 0),
```

</details>

**依据 5 · 源码核查**：[lib/index.js:9321-9355](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9321-L9355)

本实例串化/调度。

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

#### 缺口

- 原文件计划/延迟删除/跨文件恢复未实现、真实总成本未知
  **影响**：限定可恢复小样而非生产自动同步，不计未来收益
  **进一步探讨**：隔离profile故障矩阵对照原方案、手改与候选计划，记录错误和净人工。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
