# dsh-integration-settings

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[b0f3e0c](https://github.com/2384418321/dsh-integration-settings/tree/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：在 DSH 设置页管理 MCP 服务器、配置网关，并同步模型清单与声明的思考档位。

> **亮点**：把MCP JSON导入和网关模型差异审阅接入设置页，提供明确的手改配置替代路径；收益取决于最终加载和恢复验收。见[Q01](#research-q01)至[Q03](#research-q03)。

> **主要限制**：网关广告不是逐档能力验证，非空少报仍会删模型，MCP和定时任务的分步写入也不是共同事务；因此自动配置成功不能代替实际可用与可恢复。见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 两个设置页服务谁，相比手改配置增加什么？](#detail-section-11)
  - [Q02 · MCP导入怎样从JSON写成宿主配置，失败如何恢复？](#detail-section-12)
  - [Q03 · 思考解锁与模型同步真正在验证什么？](#detail-section-13)
  - [Q04 · 定时任务与本地接口边界能否保障配置意图？](#detail-section-14)
  - [Q05 · 完成可用配置的全周期成本和效果怎样？](#detail-section-15)
  - [Q06 · 谁适合试用，什么新假设可检验？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本地DSH管理员可在设置页处理MCP与网关配置，最终仍须以正确profile可加载且代表任务成功验收。见[Q01](#research-q01)。

简单替代是备份后手改YAML并重启验收。本分叉明确保留两个界面，未固定上游差异，不把继承的整个配置管理实现归为原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| MCP管理与JSON导入 | 管理服务并生成受管patch | 预览覆盖与失败项，重启后需实际调用验收 |
| 网关新增及编辑 | 保存地址、模型与凭据引用 | 凭据和patch分步写，需备份；不提供删除按钮 |
| 思考档位解锁 | 同步网关声明的reasoningEfforts | 仅读/models，不验证每档真实请求 |
| 模型清单同步 | 审阅新增移除并更新配置 | 非空少报可能删除模型；正常UI携带目标digest |
| 定时更新 | 重复解锁和同步 | 宿主运行且保存调度；分步写入非共同事务 |
| 保留的Skill与人设后端 | 兼容原读写接口 | 无页面入口但接口仍存在，未完整审计这些分支 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH宿主webServer、sessions与设置插槽 | 加载必需 | 挂载本地API及两个配置页面 | 加载或界面不可用，兼容需实机核对 |
| 正确profile及文件写权限 | 写入必需 | 保存patch与受管状态 | 不可写会失败，多文件可能部分完成 |
| MCP程序或远端服务 | 具体MCP任务必需 | 宿主重启后加载并调用 | 保存配置不证明程序可用 |
| 网关/models、凭据与支持声明 | 同步必需 | 提供模型和档位数据 | 缺失跳过或失败，少报不等于正式退役 |
| profile备份与恢复能力 | 试用前提 | 处理分步写入与误配置 | 不具备时保留手改流程，不启自动模式 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 管理员备份并确认目标profile，关闭调度 | 能明确恢复各文件 |
| 加载 | 用户按README安装启用并重启 | 两页出现且目标路径正确，本轮未实测 |
| 预览 | 用户审阅MCP覆盖、模型新增移除与档位变动 | 任何非预期删除先停止 |
| 保存 | 插件串行处理本实例写请求 | 读回patch、状态与凭据，不只看HTTP成功 |
| 验收 | 用户重启并调用代表MCP/模型 | 失败先恢复一致配置，定时另行验收 |

**效果与成本**

配置管理把编辑步骤自动化，也把多文件一致恢复和网关声明审阅留给管理员。对采用决策，应先评估一次误配置能否恢复，再评估日常少点几次；完整成本分阶段表见[Q05](#research-q05)。

本项的直接产物是配置与差异预览，服务可用性和推理效果属于后续验收。不能用同步模型数量或新增档位数量替代任务成功；效果与证据表见[Q05](#research-q05)。

> **思考**：网关广告不是逐档能力验证，非空少报仍会删模型，MCP和定时任务的分步写入也不是共同事务；因此自动配置成功不能代替实际可用与可恢复。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把MCP JSON导入和网关模型差异审阅接入设置页，提供明确的手改配置替代路径；收益取决于最终加载和恢复验收。见[Q01](#research-q01)至[Q03](#research-q03)。

受管块生成、YAML结构校验、备份与rename、客户端目标digest重探和同实例写队列值得借鉴；移植时要补外部并发基线及跨文件恢复。第三方YAML打包体积不代表原创，直接维护构建产物且没有本分叉测试源码增加维护负担。见[Q02](#research-q02)至[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

网关广告不是逐档能力验证，非空少报仍会删模型，MCP和定时任务的分步写入也不是共同事务；因此自动配置成功不能代替实际可用与可恢复。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只在可恢复的本地单用户profile先试手动导入与同步，先停调度并保留三类文件原件。读回后重启，验收代表任务；意外删除、错误profile或分步写入不一致时停止并逐文件恢复。见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持配置转换、预览与备份机制；真实宿主加载、网关能力和恢复效果未验证。跨文件计划与延迟删除是未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向读取lib中的profile解析、MCP受管块/导入/写入、网关探测/解锁/同步、调度与请求校验及客户端注册和调用；未审计全部捆绑YAML实现、Skill路径和完整UI，不作全库安全保证。
- 下一步：在隔离profile验证一次MCP、代表网关档位、非空截断列表、外部并发与第二文件写失败，记录无关修改、部分成功及恢复时间；未执行这些建议。

**分析版本**

- **仓库**：[2384418321/dsh-integration-settings](https://github.com/2384418321/dsh-integration-settings)
- **版本号**：0.2.10-dsh.5（[固定提交 b0f3e0c](https://github.com/2384418321/dsh-integration-settings/tree/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可检验绑定原文件摘要、延迟模型删除与跨文件提交进度的配置计划，观察它是否降低误删和恢复成本；尚未实现或验证。见[Q06](#research-q06)。

在隔离profile验证一次MCP、代表网关档位、非空截断列表、外部并发与第二文件写失败，记录无关修改、部分成功及恢复时间；未执行这些建议。

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

**插件研究总目标**：本地分叉把MCP与模型配置可视化后，能否可靠交付可加载的profile配置，哪些写入及能力声明边界会改变采用建议？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 两个设置页服务谁，相比手改配置增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本地 DSH profile 管理者需要添加 MCP 服务、维护网关模型及思考档位时，可以通过两个设置页代替直接编辑 YAML。本包是真实 DSH 插件，bundle 插入宿主行，客户端最终只注册 MCP 与 providers 两个设置栏目。Skill 与全局人设的界面入口被移除，但后端读写接口仍在；不能把隐藏菜单解释为相关后端能力或权限已删除。

合格交付应是正确 profile 的配置可被宿主加载，目标 MCP 或模型能完成代表任务，原有配置可恢复。保存文件、看到模型名称或出现档位不构成最终验收。源码可确认 MCP JSON 预览、供应商模型差异预览与写前备份，把手改文件中的若干转换和检查交给插件。简单替代是管理员备份配置、手动改受管条目并重启，插件降低编辑门槛的路径具体，但节省工时和错误率未测。

README 自述这是本地分叉，强调思考解锁与模型清单同步分开。当前客户端确有独立按钮和接口，但本轮未固定上游提交做逐项差异归因，不能把所有配置管理机制算作分叉原创。适用人群仍须理解 profile、网关声明与回滚；它没有把这些责任完全自动化。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-29](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/README.md#L9-L29)

作者说明分叉目标、两个页面和重启条件。

<details>
<summary>查看原文（21行）</summary>

```text
给 DeepSeek Harness（DSH）**设置**里补上两个可视化菜单：**MCP 管理** 与 **思考解锁**。后者把平时只能手改文件的事变成点选操作——自动识别每个 OpenAI 兼容网关真正支持的思考档位并写回模型选择器，也能设成定时自动更新。

> **本仓库是本地分叉版**（版本号带 `-dsh.N` 后缀）。与上游的差别见 [LOCAL-PATCH.md](LOCAL-PATCH.md)：
> 上游的 **Skill 管理** 与 **全局人设** 两个菜单已在本分叉移除（相关后端接口仍在，只是没有 UI 入口）；
> **思考档位解锁** 与 **可用模型清单** 已彻底拆成两件事，分别由「思考解锁」开关和独立的「同步模型清单」按钮负责。

| 设置菜单 | 管什么 | 背后落盘位置 |
| --- | --- | --- |
| **MCP 管理** | 增 / 删 / 改 / 启停 MCP 服务器；支持粘贴 `mcpServers` JSON 先预览再新增 | 当前 profile 的 `cordis.patch.yml`（受管区块）+ `.dsh-integration/mcp.json`（真理源） |
| **思考解锁** | 打开即自动识别每个网关真正支持的思考档位，一键解锁写回配置；可新增/编辑网关（不提供删除） | 当前 profile 的 `cordis.patch.yml`（`llm-pi-ai` 条目的 `config.providers`）+ `$DSH_HOME/.credentials.yaml`（`refs`，只存密钥） |
| **同步模型清单** | 独立按钮，与「思考解锁」开关语义分离：先预览「将新增 N 个 / 将移除 M 个」再确认；一次同步同时刷新思考强度等级与可用模型列表，两者同批生效；可与页面「定时更新」绑定同一调度（定时触发自动确认，并在 UI 提示上次差异摘要） | 同上（`config.providers` 的 `levels` 与 `models`）+ `$DSH_HOME/.dsh-integration/unlock-schedule.json`（定时状态与上次同步摘要） |

> 这是社区插件，不是 DeepSeek 官方产品。安装前请自行评估，建议先备份 profile 目录。

## 环境要求

- **DSH 桌面版 0.2.0-rc.2**（本插件按该版本的 `settings.section` 槽位与 loader patch 机制开发；
  宿主包名从此版本起为 `@deepseek-ai/*`）。
- **Node.js `^22.19.0 || >=24`**：仅在本地构建 / 跑测试时需要；**直接安装不需要 Node**，
  因为仓库里已提交构建产物 `lib/`。
- 安装完成后**必须重启 DSH**：MCP 改动由 loader 在启动时读取（技能、人设改动即时生效）。
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/cordis.patch.yml#L1-L3)

显式bundle插入宿主插件行。

```text
- insert:
    - id: dsh-integration-settings
      name: 'dsh-integration-settings'
```

**依据 3 · 源码核查**：[lib/client.js:72-72](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/client.js#L72-L72)

客户端en函数最终注册integration-mcp和integration-providers两个settings.section；原文为构建压缩行。

```text
let xe=async s=>{if(Q){W(!0),g(null),d(null);try{let m=await T("/provider/schedule",{method:"POST",sessionId:t,body:{...Q,...s}});se(m),d(s.enabled===!1?"\u5DF2\u5173\u95ED\u5B9A\u65F6\u66F4\u65B0\uFF1B\u5DF2\u7ECF\u5230\u70B9\u7684\u90A3\u4E00\u6B21\u4E0D\u4F1A\u518D\u5199\u914D\u7F6E\u3002":`\u5B9A\u65F6\u66F4\u65B0\u5DF2\u4FDD\u5B58\uFF1A\u6BCF ${m.intervalMinutes} \u5206\u949F\uFF0C\u4EC5\u5728 DeepSeek Harness \u8FD0\u884C\u671F\u95F4\u751F\u6548\u3002`)}catch(m){g(m.message||String(m))}finally{W(!1)}}},ke=async()=>{W(!0),g(null),d(null);try{let s=await T("/provider/schedule/run",{method:"POST",sessionId:t,body:{}}),y=(s.report&&s.report.providers||[]).filter($=>$.status==="error"),I=[];s.ran?s.report?s.report.unlockedModels?I.push(`\u5DF2\u66F4\u65B0 ${s.report.unlockedModels} \u4E2A\u6A21\u578B\u7684\u601D\u8003\u6863\u4F4D`):I.push("\u5404\u7F51\u5173\u7684\u601D\u8003\u6863\u4F4D\u90FD\u5DF2\u662F\u6700\u65B0\uFF0C\u6CA1\u6709\u6539\u52A8\u6587\u4EF6"):I.push(`\u672A\u80FD\u5B8C\u6210\u89E3\u9501\uFF1A${s.error||"\u672A\u77E5\u539F\u56E0"}`):I.push("\u8FD8\u6CA1\u5230\u70B9\uFF0C\u672A\u6267\u884C\u3002"),y.length&&I.push(`\u63A2\u6D4B\u5931\u8D25\uFF1A${y.map($=>`${$.id}\uFF08${$.error}\uFF09`).join("\uFF1B")}`),s.sync&&I.push(`\u6A21\u578B\u6E05\u5355 +${(s.sync.totals||{}).added||0}/-${(s.sync.totals||{}).removed||0}`),s.report&&s.report.changed&&I.push("\u5DF2\u81EA\u52A8\u5907\u4EFD\uFF0C\u91CD\u542F DSH \u540E\u751F\u6548\u3002"),d(I.join("\u3000")),U.reload(),w.reload(),await L()}catch(s){g(s.message||String(s))}finally{W(!1)}},ee=N.data&&N.data.providers||[],G=s=>ee.find(m=>m.id===s)||null,Ne=(s,m)=>{let y=G(s);return y&&(y.details||[]).find(I=>I.id===m)||null},we=s=>{let m=G(s);if(!m)return null;if(m.verdict==="gateway"){let y=m.kindSource==="model-id-prefix"?"\u6309\u6A21\u578B\u547D\u540D\u7A7A\u95F4":"\u6309 /healthz";return e("span",{className:"dsi-badge dsi-badge-on"},`WorkBuddy${m.service?` \xB7 ${m.service}`:""}\uFF08${y}\uFF09`)}return m.verdict==="other"?e("span",{className:"dsi-badge dsi-badge-off"},"\u975E WorkBuddy \u7F51\u5173"):null},Ce=s=>{let m=G(s);if(!m)return null;if(m.verdict==="skipped")return e("span",{className:"dsi-badge"},"\u4E0D\u5904\u7406");if(m.verdict==="unreachable"||m.status==="error")return e("span",{className:"dsi-badge dsi-badge-off"},"\u63A2\u6D4B\u5931\u8D25");if(m.status==="missing")return e("span",{className:"dsi-badge dsi-badge-off"},"\u914D\u7F6E\u5DF2\u4E0D\u5728\u6587\u4EF6\u91CC");let y=[];return m.unlocked&&y.push(`\u5F85\u89E3\u9501 ${m.unlocked}`),m.already&&y.push(`\u5DF2\u4E00\u81F4 ${m.already}`),m.silent&&y.push(`\u7F51\u5173\u672A\u58F0\u660E ${m.silent}`),m.gone&&y.push(`\u7F51\u5173\u5DF2\u4E0D\u63D0\u4F9B ${m.gone}`),e("span",{className:m.unlocked?"dsi-badge dsi-badge-off":"dsi-badge dsi-badge-on"},y.join(" \xB7 ")||`${m.scanned} \u4E2A\u6A21\u578B`)},ae=N.data&&N.data.unlockedModels||0,B=ee.reduce((s,m)=>s.concat((m.details||[]).filter(y=>y.status==="unlocked")),[]),oe=B.filter(s=>(s.lost||[]).length),ne=ee.filter(s=>s.verdict==="skipped"||s.verdict==="other");return e(q,{title:"\u601D\u8003\u89E3\u9501",desc:"\u8BC6\u522B\u7F51\u5173\u652F\u6301\u7684\u601D\u8003\u6863\u4F4D\u4E0E\u53EF\u7528\u6A21\u578B\u6E05\u5355\u3002\u4E24\u4E2A\u52A8\u4F5C\u4E92\u76F8\u72EC\u7ACB\uFF1A\u300C\u5168\u90E8\u89E3\u9501\u300D\u53EA\u5199\u601D\u8003\u6863\u4F4D\uFF0C\u300C\u540C\u6B65\u6A21\u578B\u6E05\u5355\u300D\u53EA\u6539\u6A21\u578B\u5217\u8868\uFF08\u5148\u9884\u89C8\u518D\u786E\u8BA4\uFF09\u3002\u5199\u524D\u81EA\u52A8\u5907\u4EFD\uFF0C\u91CD\u542F DSH \u540E\u751F\u6548\u3002",actions:e(K.default.Fragment,null,e(v,{variant:"primary",disabled:a||N.loading||!b.length,onClick:ge},ae?`\u5168\u90E8\u89E3\u9501\uFF08${ae} \u4E2A\u6A21\u578B\u5F85\u66F4\u65B0\uFF09`:"\u5168\u90E8\u89E3\u9501"),e(v,{disabled:a,onClick:()=>{w.reload(),L()}},"\u91CD\u65B0\u8BC6\u522B"),e(v,{disabled:a||syncBusy||!b.length,onClick:openSync},"\u540C\u6B65\u6A21\u578B\u6E05\u5355"),e(v,{disabled:a,onClick:fe},"\u65B0\u589E\u7F51\u5173")),footer:l?`\u914D\u7F6E\u6587\u4EF6\uFF1A${dsiMaskPath(l)}${p?`\u3000\u5BC6\u94A5\u6587\u4EF6\uFF1A${dsiMaskPath(p)}`:""}`:null},e(Z),e(P,{kind:"error"},u),e(P,{kind:"ok"},i),e(qe,{schedule:Q,busy:ve||a,loading:U.loading,error:U.error,onChange:xe,onRunNow:ke}),N.loading?e("div",{className:"dsi-hint"},"\u6B63\u5728\u8BC6\u522B\u7F51\u5173\u652F\u6301\u7684\u601D\u8003\u6863\u4F4D\u2026"):null,N.error?e(P,{kind:"error"},`\u81EA\u52A8\u8BC6\u522B\u5931\u8D25\uFF1A${N.error}`):null,N.data&&!N.data.unlockedModels&&b.length?e("div",{className:"dsi-hint"},"\u5DF2\u8BC6\u522B\u7684\u7F51\u5173\uFF0C\u601D\u8003\u6863\u4F4D\u90FD\u5DF2\u662F\u6700\u65B0\u3002"):null,B.length?e("div",{className:"dsi-hint"},`\u68C0\u6D4B\u5230 ${B.length} \u4E2A\u6A21\u578B\u7684\u6863\u4F4D\u4E0E\u7F51\u5173\u4E0D\u4E00\u81F4`+(oe.length?`\uFF08\u5176\u4E2D ${oe.length} \u4E2A\u4F1A\u51CF\u5C11\u6863\u4F4D\uFF09`:"")+"\uFF1A"+B.slice(0,3).map(s=>`${s.id}\uFF08${(s.from&&s.from.length?s.from:["\u672A\u58F0\u660E"]).join("/")} \u2192 ${s.to.join("/")}\uFF09`).join("\uFF1B")+(B.length>3?` \u7B49 ${B.length} \u4E2A`:"")):null,ne.length?e("div",{className:"dsi-hint"},`${ne.length} \u4E2A\u4F9B\u5E94\u5546\u4E0D\u53C2\u4E0E\u89E3\u9501\uFF1A`+ne.map(s=>`${s.id}\uFF08${s.reason||"\u4E0D\u9002\u7528"}\uFF09`).join("\uFF1B")):null,b.length?e("label",{className:"dsi-check",style:{marginTop:"6px"}},e("input",{type:"checkbox",checked:f,onChange:s=>O(s.target.checked)}),e("span",null,"\u53EA\u5904\u7406 WorkBuddy \u7F51\u5173\uFF08\u6309 /healthz \u670D\u52A1\u540D\u6216 cn:/global: \u547D\u540D\u7A7A\u95F4\u5224\u65AD\uFF09")):null,syncPlan?e("div",{className:"dsi-card"},e("div",{className:"dsi-inline"},e("strong",{style:{fontSize:13}},"\u540C\u6B65\u6A21\u578B\u6E05\u5355 \u00B7 \u9884\u89C8"),e("span",{className:"dsi-badge"},`\u5C06\u65B0\u589E ${syncPlan.totals&&syncPlan.totals.added||0} \u4E2A / \u5C06\u79FB\u9664 ${syncPlan.totals&&syncPlan.totals.removed||0} \u4E2A`)),e("div",{className:"dsi-hint"},"\u53EA\u6539\u53EF\u7528\u6A21\u578B\u5217\u8868\uFF0C\u4E0D\u6539\u601D\u8003\u6863\u4F4D\uFF1B\u5199\u5165\u524D\u81EA\u52A8\u5907\u4EFD\u3002"),(syncPlan.providers||[]).map(s=>{const m=s.summary||{};return e("div",{className:"dsi-card",key:s.id,style:{padding:"9px 11px"}},e("div",{className:"dsi-inline"},e("strong",{style:{fontSize:12}},s.id),e("span",{className:s.status==="error"||s.status==="stale"?"dsi-badge dsi-badge-off":"dsi-badge dsi-badge-on"},s.status==="error"?"\u63A2\u6D4B\u5931\u8D25":s.status==="stale"?"\u9700\u91CD\u65B0\u9884\u89C8":s.status==="skipped"?"\u8DF3\u8FC7":`\u65B0\u589E ${m.added||0} / \u79FB\u9664 ${m.removed||0} / \u4E0D\u53D8 ${m.kept||0}`)),s.error?e("div",{className:"dsi-hint"},"\u539F\u56E0\uFF1A"+s.error):null,(m.models&&m.models.added||[]).length?e("div",{className:"dsi-hint"},"\u5C06\u65B0\u589E\uFF1A"+m.models.added.join("\u3001")):null,(m.models&&m.models.removed||[]).length?e("div",{className:"dsi-hint"},"\u5C06\u79FB\u9664\uFF1A"+m.models.removed.join("\u3001")):null,m.levels&&((m.levels.added||[]).length||(m.levels.removed||[]).length)?e("div",{className:"dsi-hint"},`\u601D\u8003\u6863\u4F4D\uFF1A\u65B0\u589E ${(m.levels.added||[]).join("/")||"\u65E0"}\uFF1B\u79FB\u9664 ${(m.levels.removed||[]).join("/")||"\u65E0"}${(m.levelModels||[]).length?`\uFF08\u5F71\u54CD ${m.levelModels.length} \u4E2A\u6A21\u578B\uFF09`:""}`):null)}),e("div",{className:"dsi-inline"},e(v,{variant:"primary",disabled:syncBusy,onClick:applySync},syncBusy?"\u6B63\u5728\u5199\u5165\u2026":`\u786E\u8BA4\u5199\u5165\uFF08\u65B0\u589E ${syncPlan.totals&&syncPlan.totals.added||0} / \u79FB\u9664 ${syncPlan.totals&&syncPlan.totals.removed||0}\uFF09`),e(v,{disabled:syncBusy,onClick:()=>setSyncPlan(null)},"\u53D6\u6D88"))):null,r?e(Je,{draft:r,setDraft:M,saving:a,probing:H,isNew:!b.some(s=>s.id===r.id),onCancel:()=>M(null),onSave:ye,onProbe:he}):null,w.loading&&!x?e(J):null,w.error?e(P,{kind:"error"},`\u8BFB\u53D6\u5931\u8D25\uFF1A${w.error}`):null,!b.length&&!w.loading?e("div",{className:"dsi-empty"},"\u8FD9\u4E2A profile \u7684 llm-pi-ai \u6761\u76EE\u4E0B\u8FD8\u6CA1\u6709\u914D\u7F6E\u4EFB\u4F55\u4F9B\u5E94\u5546\u3002"):null,b.map(s=>{let m=G(s.id),y=c===s.id;return e("div",{className:"dsi-row",key:s.id},e("div",{className:"dsi-row-main"},e("div",{className:"dsi-row-name"},s.id,e("span",{className:"dsi-badge"},`${s.modelCount} \u6A21\u578B`),we(s.id),Ce(s.id),s.apiKeyEnv?e("span",{className:s.hasCredential?"dsi-badge dsi-badge-on":"dsi-badge dsi-badge-off"},s.hasCredential?"\u5BC6\u94A5\u5DF2\u914D\u7F6E":"\u7F3A\u5C11\u5BC6\u94A5"):null),e("div",{className:"dsi-row-meta"},[dsiMaskUrl(s.baseURL)||"(\u672A\u8BBE\u7F6E baseURL)",s.apiKeyEnv||"(\u672A\u8BBE\u7F6E apiKeyEnv)",s.reasoning?`\u9ED8\u8BA4\u601D\u8003 ${s.reasoning}`:null,Ve(s.models)||null].filter(Boolean).join(" \xB7 ")),m&&m.reason?e("div",{className:"dsi-row-meta"},`${m.verdict==="skipped"||m.verdict==="other"?"\u672A\u53C2\u4E0E\u539F\u56E0":"\u63A2\u6D4B\u7ED3\u679C"}\uFF1A${m.reason}`):null),e("div",{className:"dsi-toolbar"},e(v,{disabled:a,onClick:()=>k(y?null:s.id)},y?"\u6536\u8D77\u6A21\u578B":"\u67E5\u770B\u6A21\u578B"),e(v,{disabled:a,onClick:()=>be(s)},"\u7F16\u8F91")),y?e("div",{className:"dsi-card",style:{marginTop:"8px"}},e("div",{className:"dsi-hint"},`${(s.models||[]).length} \u4E2A\u6A21\u578B\uFF08\u5F53\u524D\u5199\u5728\u914D\u7F6E\u91CC\u7684\u601D\u8003\u6863\u4F4D\uFF09`),(s.models||[]).map(I=>{let $=Ne(s.id,I.id),$e=$&&$.status==="unlocked";return e("div",{className:"dsi-row-meta",key:I.id},e("span",{className:"dsi-mono"},I.id),"\u3000",me(I)||"\u672A\u58F0\u660E\u6863\u4F4D",$e?`\u3000\u2192 \u7F51\u5173\u652F\u6301 ${$.to.join("/")}${($.lost||[]).length?`\uFF08\u4F1A\u53BB\u6389 ${$.lost.join("/")}\uFF09`:""}`:null,$&&$.status==="silent"?"\u3000\u7F51\u5173\u672A\u58F0\u660E\uFF0C\u4FDD\u6301\u539F\u6837":null,$&&$.status==="gone"?"\u3000\u7F51\u5173\u5DF2\u4E0D\u63D0\u4F9B\uFF0C\u4FDD\u6301\u539F\u6837":null)})):null)}))}function en(n){let t=Le(n),a=[{id:"integration-mcp",order:61,labelKey:"mcp.title",Component:_e},{id:"integration-providers",order:64,labelKey:"providers.title",Component:Qe}];for(let o of a)n.effect(()=>n.slots.inject("settings.section",()=>n.slots.register({name:"settings.section",id:o.id,order:o.order,label:()=>t(o.labelKey),locale:z},o.Component)))}var nn=["slots","locale"],tn=z;
```

#### 缺口

- 未固定上游版本核对分叉增量。
  **影响**：不能把继承功能归为本分叉原创。
  **进一步探讨**：固定上游提交对照配置、预览和调度变化。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · MCP导入怎样从JSON写成宿主配置，失败如何恢复？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

MCP 的权威列表存于当前 profile 的 .dsh-integration/mcp.json，启用项生成 @deepseek-ai/dsh-mcp-client 的受管 patch 区块。导入函数逐条正规化，非法项列入 failed，其余新增或覆盖同名项；dryRun 返回增删和警告但不落盘，正式导入会重新读取当前列表再计算，因此它是预览操作而不是绑定完整原始状态的事务计划。

写入前校验服务器名、传输方式、必要 command/url、数字字段及重复名称，生成并校验整个 YAML。单文件写通过临时文件与 rename，patch 写入前另保留备份。这些措施降低语法和半个文件的风险，却不使两份文件共同原子提交。writeMcpServers 先写 mcp.json，再备份及写 patch；若后者失败，权威列表与宿主启动输入可能不一致。源码没有该两文件事务的提交标记或自动补偿，此处是明确失败窗口，未在本轮实际注入磁盘故障。

恢复时不能只恢复 patch 后假定列表也回滚，因为下次保存会按 mcp.json 再生成受管区块。用户应同时核对两份文件与备份，避免手工修改受管块被覆盖。导入默认允许覆盖同名服务器，批内部分非法项不阻止合法项落盘；预览时必须确认 updated 和 failed，而非只看新增数量。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:7575-7617](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7575-L7617)

服务器校验和启用项到受管patch的映射。

<details>
<summary>查看原文（43行）</summary>

```text
function validateServer(server) {
  const problems = [];
  if (!server || typeof server !== "object") throw httpError(400, "error.mcp.invalid", "\u7F3A\u5C11\u670D\u52A1\u5668\u5B9A\u4E49");
  const name2 = String(server.serverName || "").trim();
  if (!SERVER_NAME_RE.test(name2)) {
    problems.push("serverName \u5FC5\u987B\u662F 1-32 \u4F4D\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u4E0B\u5212\u7EBF\u6216\u8FDE\u5B57\u7B26");
  }
  const rawTransport = server.transport;
  const transport = rawTransport === void 0 || rawTransport === null || rawTransport === "" ? "stdio" : String(rawTransport);
  if (transport !== "stdio" && transport !== "streamable-http") {
    problems.push("transport \u5FC5\u987B\u662F stdio \u6216 streamable-http");
  } else if (transport === "stdio") {
    if (!String(server.command || "").trim()) problems.push("stdio \u6A21\u5F0F\u5FC5\u987B\u586B\u5199 command");
  } else if (!String(server.url || "").trim()) {
    problems.push("streamable-http \u6A21\u5F0F\u5FC5\u987B\u586B\u5199 url");
  }
  for (const key of ["toolCallTimeoutMs", "maxInstructionBytes"]) {
    const raw = server[key];
    if (raw === void 0 || raw === null || String(raw).trim() === "") continue;
    const num = Number(raw);
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
```

</details>

**依据 2 · 源码核查**：[lib/index.js:7483-7506](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7483-L7506)

单文件临时写rename与备份。

<details>
<summary>查看原文（24行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:7757-7772](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7757-L7772)

MCP列表先写，patch后写，不是共同事务。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/index.js:9121-9177](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9121-L9177)

逐条导入、默认覆盖、部分失败及dryRun分支。

<details>
<summary>查看原文（57行）</summary>

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 思考解锁与模型同步真正在验证什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

所谓“自动识别真正支持的档位”，在本包中实际是读取网关 /models 的 reasoning_supported_efforts 等声明字段，再写成 DSH 模型配置；它不逐档发生成请求验证服务是否接受，更不测推理质量。网关身份由 /healthz 或 cn:/global: 模型名前缀判断，属于兼容筛选，不是对服务真实性的密码学认证。

思考解锁保留原模型集合，只对匹配ID且有声明的模型替换 reasoningEfforts；模型缺失或档位未声明时保留原值。独立模型同步则以网关返回的非空集合为目标，生成 added、kept、removed，连同档位变动预览。它拒绝空模型集合，但一个非空却不完整的列表仍可删除本地已有模型。对“网关暂时少报”和“模型正式下线”没有独立确认，定时同步因此可能把短期供给故障变为持久配置变化。

正常客户端先请求预览，再把各供应商 digest 带入 confirm=true 的应用请求；后端重新探测并在摘要不符时拒绝整次同步，这是有用的陈旧预览检测。但后端仅在提供 expected 时比较，接口不是不可绕过的“必须先有预览”门禁。digest来自目标models，不绑定预览时本地patch完整字节，单实例队列也不阻止外部编辑。summary.changed 只计模型增删及档位键集合变化，单独窗口、名称或档位映射值变化不一定触发写入，故“刷新模型信息”亦有具体范围。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:7962-7981](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7962-L7981)

模型归一仅读取广告字段，不做生成能力探测。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/index.js:8333-8409](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8333-L8409)

网关识别与unlock保留缺失、静默模型。

<details>
<summary>查看原文（77行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:8528-8603](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8528-L8603)

模型同步集合、摘要及changed计算范围。

<details>
<summary>查看原文（76行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/index.js:8650-8698](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8650-L8698)

非空检查、可选expected摘要比较及写入。

<details>
<summary>查看原文（49行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[lib/index.js:9288-9302](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9288-L9302)

confirm是强制字段，expectedDigests不是强制。

<details>
<summary>查看原文（15行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[lib/client.js:71-72](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/client.js#L71-L72)

客户端确实先预览并传入每项digest，压缩行保留原文。

```text
function Qe(n){let t=_(n);X("settings.section",n);let[a,o]=h(!1),[i,d]=h(null),[u,g]=h(null),[c,k]=h(null),w=F(()=>T(`/state?session=${encodeURIComponent(t||"")}&root=`,{sessionId:t}),[t]),x=w.data,C=x&&x.providers||{},b=C.providers||[],l=C.patchFile||x&&x.paths&&x.paths.patchFile||"",p=C.credentialsFile||"",E=b.map(s=>s.id).join(","),[N,R]=h({loading:!1,at:null,error:null,data:null}),[f,O]=h(!0),[r,M]=h(null),[H,te]=h(!1),L=async()=>{if(b.length){R({loading:!0,at:null,error:null,data:null});try{let s=await T("/provider/unlock",{method:"POST",sessionId:t,body:{providerIds:b.map(m=>m.id),dryRun:!0,onlyWorkbuddy:f}});R({loading:!1,at:Date.now(),error:null,data:s})}catch(s){R({loading:!1,at:Date.now(),error:s.message||String(s),data:null})}}};D(()=>{L()},[E,t,f]);let ge=async()=>{if(b.length){o(!0),g(null),d(null);try{let s=await T("/provider/unlock",{method:"POST",sessionId:t,body:{providerIds:b.map($=>$.id),onlyWorkbuddy:f}}),y=(s.providers||[]).filter($=>$.status==="error"),I=[s.unlockedModels?`\u5DF2\u89E3\u9501 ${s.unlockedModels} \u4E2A\u6A21\u578B\uFF08${(s.unlockedProviders||[]).join("\u3001")}\uFF09`:"\u6240\u6709\u7F51\u5173\u7684\u601D\u8003\u6863\u4F4D\u90FD\u5DF2\u662F\u6700\u65B0\uFF0C\u6CA1\u6709\u6539\u52A8\u6587\u4EF6"];y.length&&I.push(`\u63A2\u6D4B\u5931\u8D25\uFF1A${y.map($=>`${$.id}\uFF08${$.error}\uFF09`).join("\uFF1B")}`),s.changed&&I.push("\u5199\u914D\u7F6E\u524D\u5DF2\u81EA\u52A8\u5907\u4EFD\uFF0C\u91CD\u542F DeepSeek Harness \u540E\u751F\u6548\u3002"),d(I.join("\u3000")),w.reload(),await L()}catch(s){g(s.message||String(s))}finally{o(!1)}}},fe=()=>{g(null),d(null),M({...Xe})},be=s=>{g(null),d(null),M({id:s.id,apiKeyEnv:s.apiKeyEnv||"",apiKey:"",baseURL:s.baseURL||"",reasoning:s.reasoning||"",models:(s.models||[]).map(m=>({...m,checked:!0}))})},he=async()=>{if(r){te(!0),g(null),d(null);try{let m=((await T("/provider/probe",{method:"POST",sessionId:t,body:{baseURL:r.baseURL,apiKey:r.apiKey}})).models||[]).map(y=>({...y,checked:!0}));M(y=>y&&{...y,models:m}),d(`\u7F51\u5173\u8FD4\u56DE ${m.length} \u4E2A\u6A21\u578B\uFF0C\u5DF2\u5168\u90E8\u52FE\u9009\u3002`)}catch(s){g(s.message||String(s))}finally{te(!1)}}},ye=async()=>{if(r){o(!0),g(null),d(null);try{let s=(r.models||[]).filter(y=>y.checked),m=await T("/provider/save",{method:"POST",sessionId:t,body:{providerId:r.id.trim(),apiKey:r.apiKey,provider:{apiKeyEnv:r.apiKeyEnv,api:"openai-completions",baseURL:r.baseURL,reasoning:r.reasoning,models:s}}});d(`${m.created?"\u5DF2\u65B0\u589E":"\u5DF2\u66F4\u65B0"}\u4F9B\u5E94\u5546 ${m.providerId}\uFF08${m.modelCount} \u4E2A\u6A21\u578B\uFF09${m.credentialsWritten?"\uFF0C\u5BC6\u94A5\u5DF2\u5199\u5165\u51ED\u636E\u6587\u4EF6":""}\u3002\u91CD\u542F DeepSeek Harness \u540E\u751F\u6548\u3002`),M(null),w.reload(),await L()}catch(s){g(s.message||String(s))}finally{o(!1)}}},[Q,se]=h(null),[ve,W]=h(!1),U=F(()=>T(`/provider/schedule?session=${encodeURIComponent(t||"")}`,{sessionId:t}),[t]);D(()=>{se(U.data||null)},[U.data]);const[syncPlan,setSyncPlan]=h(null),[syncBusy,setSyncBusy]=h(!1),openSync=async()=>{if(!b.length)return;setSyncBusy(!0),g(null),d(null);try{const s=await T("/providers/models/sync-preview",{method:"POST",sessionId:t,body:{providerIds:b.map(m=>m.id),onlyWorkbuddy:f}});setSyncPlan(s),s.totals&&!s.totals.changed&&d("\u6A21\u578B\u6E05\u5355\u4E0E\u7F51\u5173\u4E00\u81F4\uFF0C\u65E0\u9700\u540C\u6B65\u3002")}catch(s){g(s.message||String(s))}finally{setSyncBusy(!1)}},applySync=async()=>{if(!syncPlan)return;setSyncBusy(!0),g(null),d(null);try{const expectedDigests={};for(const m of syncPlan.providers||[])m.digest&&(expectedDigests[m.id]=m.digest);const s=await T("/providers/models/sync-apply",{method:"POST",sessionId:t,body:{providerIds:b.map(m=>m.id),onlyWorkbuddy:f,confirm:!0,expectedDigests}}),y=s.totals||{};d(`\u5DF2\u540C\u6B65\u6A21\u578B\u6E05\u5355\uFF1A\u65B0\u589E ${y.added||0} \u4E2A\u3001\u79FB\u9664 ${y.removed||0} \u4E2A\u3001\u4FDD\u7559 ${y.kept||0} \u4E2A${y.levelModels?`\uFF0C\u540C\u65F6\u66F4\u65B0 ${y.levelModels} \u4E2A\u6A21\u578B\u7684\u601D\u8003\u6863\u4F4D`:""}\u3002\u5199\u524D\u5DF2\u5907\u4EFD\uFF0C\u91CD\u542F DSH \u540E\u751F\u6548\u3002`),setSyncPlan(null),w.reload(),U.reload(),await L()}catch(s){g(s.message||String(s)),setSyncPlan(null)}finally{setSyncBusy(!1)}};
let xe=async s=>{if(Q){W(!0),g(null),d(null);try{let m=await T("/provider/schedule",{method:"POST",sessionId:t,body:{...Q,...s}});se(m),d(s.enabled===!1?"\u5DF2\u5173\u95ED\u5B9A\u65F6\u66F4\u65B0\uFF1B\u5DF2\u7ECF\u5230\u70B9\u7684\u90A3\u4E00\u6B21\u4E0D\u4F1A\u518D\u5199\u914D\u7F6E\u3002":`\u5B9A\u65F6\u66F4\u65B0\u5DF2\u4FDD\u5B58\uFF1A\u6BCF ${m.intervalMinutes} \u5206\u949F\uFF0C\u4EC5\u5728 DeepSeek Harness \u8FD0\u884C\u671F\u95F4\u751F\u6548\u3002`)}catch(m){g(m.message||String(m))}finally{W(!1)}}},ke=async()=>{W(!0),g(null),d(null);try{let s=await T("/provider/schedule/run",{method:"POST",sessionId:t,body:{}}),y=(s.report&&s.report.providers||[]).filter($=>$.status==="error"),I=[];s.ran?s.report?s.report.unlockedModels?I.push(`\u5DF2\u66F4\u65B0 ${s.report.unlockedModels} \u4E2A\u6A21\u578B\u7684\u601D\u8003\u6863\u4F4D`):I.push("\u5404\u7F51\u5173\u7684\u601D\u8003\u6863\u4F4D\u90FD\u5DF2\u662F\u6700\u65B0\uFF0C\u6CA1\u6709\u6539\u52A8\u6587\u4EF6"):I.push(`\u672A\u80FD\u5B8C\u6210\u89E3\u9501\uFF1A${s.error||"\u672A\u77E5\u539F\u56E0"}`):I.push("\u8FD8\u6CA1\u5230\u70B9\uFF0C\u672A\u6267\u884C\u3002"),y.length&&I.push(`\u63A2\u6D4B\u5931\u8D25\uFF1A${y.map($=>`${$.id}\uFF08${$.error}\uFF09`).join("\uFF1B")}`),s.sync&&I.push(`\u6A21\u578B\u6E05\u5355 +${(s.sync.totals||{}).added||0}/-${(s.sync.totals||{}).removed||0}`),s.report&&s.report.changed&&I.push("\u5DF2\u81EA\u52A8\u5907\u4EFD\uFF0C\u91CD\u542F DSH \u540E\u751F\u6548\u3002"),d(I.join("\u3000")),U.reload(),w.reload(),await L()}catch(s){g(s.message||String(s))}finally{W(!1)}},ee=N.data&&N.data.providers||[],G=s=>ee.find(m=>m.id===s)||null,Ne=(s,m)=>{let y=G(s);return y&&(y.details||[]).find(I=>I.id===m)||null},we=s=>{let m=G(s);if(!m)return null;if(m.verdict==="gateway"){let y=m.kindSource==="model-id-prefix"?"\u6309\u6A21\u578B\u547D\u540D\u7A7A\u95F4":"\u6309 /healthz";return e("span",{className:"dsi-badge dsi-badge-on"},`WorkBuddy${m.service?` \xB7 ${m.service}`:""}\uFF08${y}\uFF09`)}return m.verdict==="other"?e("span",{className:"dsi-badge dsi-badge-off"},"\u975E WorkBuddy \u7F51\u5173"):null},Ce=s=>{let m=G(s);if(!m)return null;if(m.verdict==="skipped")return e("span",{className:"dsi-badge"},"\u4E0D\u5904\u7406");if(m.verdict==="unreachable"||m.status==="error")return e("span",{className:"dsi-badge dsi-badge-off"},"\u63A2\u6D4B\u5931\u8D25");if(m.status==="missing")return e("span",{className:"dsi-badge dsi-badge-off"},"\u914D\u7F6E\u5DF2\u4E0D\u5728\u6587\u4EF6\u91CC");let y=[];return m.unlocked&&y.push(`\u5F85\u89E3\u9501 ${m.unlocked}`),m.already&&y.push(`\u5DF2\u4E00\u81F4 ${m.already}`),m.silent&&y.push(`\u7F51\u5173\u672A\u58F0\u660E ${m.silent}`),m.gone&&y.push(`\u7F51\u5173\u5DF2\u4E0D\u63D0\u4F9B ${m.gone}`),e("span",{className:m.unlocked?"dsi-badge dsi-badge-off":"dsi-badge dsi-badge-on"},y.join(" \xB7 ")||`${m.scanned} \u4E2A\u6A21\u578B`)},ae=N.data&&N.data.unlockedModels||0,B=ee.reduce((s,m)=>s.concat((m.details||[]).filter(y=>y.status==="unlocked")),[]),oe=B.filter(s=>(s.lost||[]).length),ne=ee.filter(s=>s.verdict==="skipped"||s.verdict==="other");return e(q,{title:"\u601D\u8003\u89E3\u9501",desc:"\u8BC6\u522B\u7F51\u5173\u652F\u6301\u7684\u601D\u8003\u6863\u4F4D\u4E0E\u53EF\u7528\u6A21\u578B\u6E05\u5355\u3002\u4E24\u4E2A\u52A8\u4F5C\u4E92\u76F8\u72EC\u7ACB\uFF1A\u300C\u5168\u90E8\u89E3\u9501\u300D\u53EA\u5199\u601D\u8003\u6863\u4F4D\uFF0C\u300C\u540C\u6B65\u6A21\u578B\u6E05\u5355\u300D\u53EA\u6539\u6A21\u578B\u5217\u8868\uFF08\u5148\u9884\u89C8\u518D\u786E\u8BA4\uFF09\u3002\u5199\u524D\u81EA\u52A8\u5907\u4EFD\uFF0C\u91CD\u542F DSH \u540E\u751F\u6548\u3002",actions:e(K.default.Fragment,null,e(v,{variant:"primary",disabled:a||N.loading||!b.length,onClick:ge},ae?`\u5168\u90E8\u89E3\u9501\uFF08${ae} \u4E2A\u6A21\u578B\u5F85\u66F4\u65B0\uFF09`:"\u5168\u90E8\u89E3\u9501"),e(v,{disabled:a,onClick:()=>{w.reload(),L()}},"\u91CD\u65B0\u8BC6\u522B"),e(v,{disabled:a||syncBusy||!b.length,onClick:openSync},"\u540C\u6B65\u6A21\u578B\u6E05\u5355"),e(v,{disabled:a,onClick:fe},"\u65B0\u589E\u7F51\u5173")),footer:l?`\u914D\u7F6E\u6587\u4EF6\uFF1A${dsiMaskPath(l)}${p?`\u3000\u5BC6\u94A5\u6587\u4EF6\uFF1A${dsiMaskPath(p)}`:""}`:null},e(Z),e(P,{kind:"error"},u),e(P,{kind:"ok"},i),e(qe,{schedule:Q,busy:ve||a,loading:U.loading,error:U.error,onChange:xe,onRunNow:ke}),N.loading?e("div",{className:"dsi-hint"},"\u6B63\u5728\u8BC6\u522B\u7F51\u5173\u652F\u6301\u7684\u601D\u8003\u6863\u4F4D\u2026"):null,N.error?e(P,{kind:"error"},`\u81EA\u52A8\u8BC6\u522B\u5931\u8D25\uFF1A${N.error}`):null,N.data&&!N.data.unlockedModels&&b.length?e("div",{className:"dsi-hint"},"\u5DF2\u8BC6\u522B\u7684\u7F51\u5173\uFF0C\u601D\u8003\u6863\u4F4D\u90FD\u5DF2\u662F\u6700\u65B0\u3002"):null,B.length?e("div",{className:"dsi-hint"},`\u68C0\u6D4B\u5230 ${B.length} \u4E2A\u6A21\u578B\u7684\u6863\u4F4D\u4E0E\u7F51\u5173\u4E0D\u4E00\u81F4`+(oe.length?`\uFF08\u5176\u4E2D ${oe.length} \u4E2A\u4F1A\u51CF\u5C11\u6863\u4F4D\uFF09`:"")+"\uFF1A"+B.slice(0,3).map(s=>`${s.id}\uFF08${(s.from&&s.from.length?s.from:["\u672A\u58F0\u660E"]).join("/")} \u2192 ${s.to.join("/")}\uFF09`).join("\uFF1B")+(B.length>3?` \u7B49 ${B.length} \u4E2A`:"")):null,ne.length?e("div",{className:"dsi-hint"},`${ne.length} \u4E2A\u4F9B\u5E94\u5546\u4E0D\u53C2\u4E0E\u89E3\u9501\uFF1A`+ne.map(s=>`${s.id}\uFF08${s.reason||"\u4E0D\u9002\u7528"}\uFF09`).join("\uFF1B")):null,b.length?e("label",{className:"dsi-check",style:{marginTop:"6px"}},e("input",{type:"checkbox",checked:f,onChange:s=>O(s.target.checked)}),e("span",null,"\u53EA\u5904\u7406 WorkBuddy \u7F51\u5173\uFF08\u6309 /healthz \u670D\u52A1\u540D\u6216 cn:/global: \u547D\u540D\u7A7A\u95F4\u5224\u65AD\uFF09")):null,syncPlan?e("div",{className:"dsi-card"},e("div",{className:"dsi-inline"},e("strong",{style:{fontSize:13}},"\u540C\u6B65\u6A21\u578B\u6E05\u5355 \u00B7 \u9884\u89C8"),e("span",{className:"dsi-badge"},`\u5C06\u65B0\u589E ${syncPlan.totals&&syncPlan.totals.added||0} \u4E2A / \u5C06\u79FB\u9664 ${syncPlan.totals&&syncPlan.totals.removed||0} \u4E2A`)),e("div",{className:"dsi-hint"},"\u53EA\u6539\u53EF\u7528\u6A21\u578B\u5217\u8868\uFF0C\u4E0D\u6539\u601D\u8003\u6863\u4F4D\uFF1B\u5199\u5165\u524D\u81EA\u52A8\u5907\u4EFD\u3002"),(syncPlan.providers||[]).map(s=>{const m=s.summary||{};return e("div",{className:"dsi-card",key:s.id,style:{padding:"9px 11px"}},e("div",{className:"dsi-inline"},e("strong",{style:{fontSize:12}},s.id),e("span",{className:s.status==="error"||s.status==="stale"?"dsi-badge dsi-badge-off":"dsi-badge dsi-badge-on"},s.status==="error"?"\u63A2\u6D4B\u5931\u8D25":s.status==="stale"?"\u9700\u91CD\u65B0\u9884\u89C8":s.status==="skipped"?"\u8DF3\u8FC7":`\u65B0\u589E ${m.added||0} / \u79FB\u9664 ${m.removed||0} / \u4E0D\u53D8 ${m.kept||0}`)),s.error?e("div",{className:"dsi-hint"},"\u539F\u56E0\uFF1A"+s.error):null,(m.models&&m.models.added||[]).length?e("div",{className:"dsi-hint"},"\u5C06\u65B0\u589E\uFF1A"+m.models.added.join("\u3001")):null,(m.models&&m.models.removed||[]).length?e("div",{className:"dsi-hint"},"\u5C06\u79FB\u9664\uFF1A"+m.models.removed.join("\u3001")):null,m.levels&&((m.levels.added||[]).length||(m.levels.removed||[]).length)?e("div",{className:"dsi-hint"},`\u601D\u8003\u6863\u4F4D\uFF1A\u65B0\u589E ${(m.levels.added||[]).join("/")||"\u65E0"}\uFF1B\u79FB\u9664 ${(m.levels.removed||[]).join("/")||"\u65E0"}${(m.levelModels||[]).length?`\uFF08\u5F71\u54CD ${m.levelModels.length} \u4E2A\u6A21\u578B\uFF09`:""}`):null)}),e("div",{className:"dsi-inline"},e(v,{variant:"primary",disabled:syncBusy,onClick:applySync},syncBusy?"\u6B63\u5728\u5199\u5165\u2026":`\u786E\u8BA4\u5199\u5165\uFF08\u65B0\u589E ${syncPlan.totals&&syncPlan.totals.added||0} / \u79FB\u9664 ${syncPlan.totals&&syncPlan.totals.removed||0}\uFF09`),e(v,{disabled:syncBusy,onClick:()=>setSyncPlan(null)},"\u53D6\u6D88"))):null,r?e(Je,{draft:r,setDraft:M,saving:a,probing:H,isNew:!b.some(s=>s.id===r.id),onCancel:()=>M(null),onSave:ye,onProbe:he}):null,w.loading&&!x?e(J):null,w.error?e(P,{kind:"error"},`\u8BFB\u53D6\u5931\u8D25\uFF1A${w.error}`):null,!b.length&&!w.loading?e("div",{className:"dsi-empty"},"\u8FD9\u4E2A profile \u7684 llm-pi-ai \u6761\u76EE\u4E0B\u8FD8\u6CA1\u6709\u914D\u7F6E\u4EFB\u4F55\u4F9B\u5E94\u5546\u3002"):null,b.map(s=>{let m=G(s.id),y=c===s.id;return e("div",{className:"dsi-row",key:s.id},e("div",{className:"dsi-row-main"},e("div",{className:"dsi-row-name"},s.id,e("span",{className:"dsi-badge"},`${s.modelCount} \u6A21\u578B`),we(s.id),Ce(s.id),s.apiKeyEnv?e("span",{className:s.hasCredential?"dsi-badge dsi-badge-on":"dsi-badge dsi-badge-off"},s.hasCredential?"\u5BC6\u94A5\u5DF2\u914D\u7F6E":"\u7F3A\u5C11\u5BC6\u94A5"):null),e("div",{className:"dsi-row-meta"},[dsiMaskUrl(s.baseURL)||"(\u672A\u8BBE\u7F6E baseURL)",s.apiKeyEnv||"(\u672A\u8BBE\u7F6E apiKeyEnv)",s.reasoning?`\u9ED8\u8BA4\u601D\u8003 ${s.reasoning}`:null,Ve(s.models)||null].filter(Boolean).join(" \xB7 ")),m&&m.reason?e("div",{className:"dsi-row-meta"},`${m.verdict==="skipped"||m.verdict==="other"?"\u672A\u53C2\u4E0E\u539F\u56E0":"\u63A2\u6D4B\u7ED3\u679C"}\uFF1A${m.reason}`):null),e("div",{className:"dsi-toolbar"},e(v,{disabled:a,onClick:()=>k(y?null:s.id)},y?"\u6536\u8D77\u6A21\u578B":"\u67E5\u770B\u6A21\u578B"),e(v,{disabled:a,onClick:()=>be(s)},"\u7F16\u8F91")),y?e("div",{className:"dsi-card",style:{marginTop:"8px"}},e("div",{className:"dsi-hint"},`${(s.models||[]).length} \u4E2A\u6A21\u578B\uFF08\u5F53\u524D\u5199\u5728\u914D\u7F6E\u91CC\u7684\u601D\u8003\u6863\u4F4D\uFF09`),(s.models||[]).map(I=>{let $=Ne(s.id,I.id),$e=$&&$.status==="unlocked";return e("div",{className:"dsi-row-meta",key:I.id},e("span",{className:"dsi-mono"},I.id),"\u3000",me(I)||"\u672A\u58F0\u660E\u6863\u4F4D",$e?`\u3000\u2192 \u7F51\u5173\u652F\u6301 ${$.to.join("/")}${($.lost||[]).length?`\uFF08\u4F1A\u53BB\u6389 ${$.lost.join("/")}\uFF09`:""}`:null,$&&$.status==="silent"?"\u3000\u7F51\u5173\u672A\u58F0\u660E\uFF0C\u4FDD\u6301\u539F\u6837":null,$&&$.status==="gone"?"\u3000\u7F51\u5173\u5DF2\u4E0D\u63D0\u4F9B\uFF0C\u4FDD\u6301\u539F\u6837":null)})):null)}))}function en(n){let t=Le(n),a=[{id:"integration-mcp",order:61,labelKey:"mcp.title",Component:_e},{id:"integration-providers",order:64,labelKey:"providers.title",Component:Qe}];for(let o of a)n.effect(()=>n.slots.inject("settings.section",()=>n.slots.register({name:"settings.section",id:o.id,order:o.order,label:()=>t(o.labelKey),locale:z},o.Component)))}var nn=["slots","locale"],tn=z;
```

#### 缺口

- 没有代表模型各档位实际请求及结果记录。
  **影响**：声明同步不能当作真实服务能力验收。
  **进一步探讨**：在经许可的隔离profile对代表模型分别请求声明档位并记录接受、拒绝和实际参数。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 定时任务与本地接口边界能否保障配置意图？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

启动依赖 webServer、sessions 与 Web 设置插槽。宿主每分钟通过同一 Promise 队列检查调度，HTTP 写请求也进入该队列；读请求不排队。这防止同实例写请求彼此同时改 patch，但不能防另一宿主进程或人工编辑相同文件。读取到写入之间未见基线文件摘要比较，因此外部并发仍可能丢失修改。

定时执行先调用解锁并可能写盘，再调用模型同步并可能再次写盘，分别捕获失败，最后写调度结果。因此“同一批次”不等于共同原子提交。若第二步失败，第一步可能已生效，后续应读回而不是整体重放。未持久保存调度文件时，readSchedule每次以当前时间归一默认调度，nextRunAt重新设为当前时间加间隔，定时检查会一直判为not-due；要使首次定时可追踪，应通过界面保存调度，确认持久文件中的具体下一次时间。这是静态推导的启动边界，未运行计时复现。

HTTP层检查Host、Origin和Sec-Fetch-Site，写操作要求固定头与JSON，限制请求体；这是本地同源防护，固定头不是用户身份认证。路由仍包含Skill删除与人设写入，页面移除不等于后端禁用。是否能被非授权客户端触达还受宿主绑定与访问控制影响，本轮不据源码宣称已存在远程漏洞。只应在本人控制的本地单用户profile评估，不把它当多用户权限系统。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:8734-8784](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8734-L8784)

缺调度文件时以当前时间生成nextRunAt。

<details>
<summary>查看原文（51行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/index.js:8786-8837](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8786-L8837)

解锁、同步、调度状态是分步写入。

<details>
<summary>查看原文（52行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:8919-8940](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8919-L8940)

Host、Origin及固定写头边界。

<details>
<summary>查看原文（22行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/index.js:9223-9239](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9223-L9239)

Skill与persona写API仍存在。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[lib/index.js:9321-9355](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9321-L9355)

实例内串行队列、分钟调度及HTTP注册。

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

- 宿主绑定地址与额外认证配置未验收。
  **影响**：本地请求头检查不能证明多用户授权隔离。
  **进一步探讨**：固定宿主环境核对监听地址与请求身份范围。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 完成可用配置的全周期成本和效果怎样？

**研究主题**：效果与总成本

#### 完整回答

计量单位是“一次配置变更在正确profile中加载成功，代表任务可完成且旧配置可恢复”，不能用成功HTTP响应代替。主要投入是管理员理解配置、核对网关声明、重启、验证和故障回滚。网关/models与healthz探测可能涉及请求、网络和凭据管理，但包内没有金额、实际耗时或采用反馈，不能称零成本或量化节省。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、MCP进程或远端服务与网关资源，金额未知 | 备份profile、确认目标路径、导入预览、重启及代表任务验收 | README建议备份；本轮未安装 |
| 持续使用 | 定时网络探测、备份文件与可能的配置写入 | 核查模型移除与档位声明，维持宿主兼容 | 频率可配置，实际流量与维护工时未知 |
| 失败恢复 | 重新探测和备份保留 | 停调度、分别比对mcp.json、patch与凭据，恢复后重启 | 多文件状态不保证共同回滚 |
| 退出或迁移 | 已写配置和凭据继续存在 | 停调度并决定保留或手工移除受管块、网关与密钥引用 | 卸载插件不等于撤销其配置副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 减少手写YAML | JSON正规化、差异预览、受管块生成 | 配置错误率及节时 |
| 思考档位展示 | 按网关广告字段写入模型配置 | 每档实际请求支持及输出效果 |
| 失败前保护 | YAML校验、单文件rename和备份 | 外部并发、两文件中断的一致恢复 |

网关保存先可能写credentials再写patch，备份有助恢复却需要逐文件核对。本地分叉直接维护构建产物，lib还含大段第三方YAML实现；inventory数量不是原创量。README保留的上游测试清单不能算本分叉已通过测试，本轮只读材料，没有运行目标代码。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-29](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/README.md#L25-L29)

作者说明环境与重启条件。

```text
- **DSH 桌面版 0.2.0-rc.2**（本插件按该版本的 `settings.section` 槽位与 loader patch 机制开发；
  宿主包名从此版本起为 `@deepseek-ai/*`）。
- **Node.js `^22.19.0 || >=24`**：仅在本地构建 / 跑测试时需要；**直接安装不需要 Node**，
  因为仓库里已提交构建产物 `lib/`。
- 安装完成后**必须重启 DSH**：MCP 改动由 loader 在启动时读取（技能、人设改动即时生效）。
```

**依据 2 · 源码核查**：[lib/index.js:8280-8305](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8280-L8305)

credentials与patch先后写入。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:7483-7506](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7483-L7506)

备份与单文件原子写。

<details>
<summary>查看原文（24行）</summary>

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
```

</details>

**依据 4 · 作者声明**：[README.md:307-329](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/README.md#L307-L329)

分叉没有src/test，保留上游测试清单不是本轮证据。

<details>
<summary>查看原文（23行）</summary>

````text
## 开发

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
````

</details>

#### 缺口

- 缺同任务手改配置的对照和真实恢复记录。
  **影响**：不能判断全周期节时、可靠性与单位成功变更成本。
  **进一步探讨**：比较同批配置任务，记录错误、恢复耗时及代表调用结果。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁适合试用，什么新假设可检验？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有完整profile备份、能手动核对与恢复配置的本地单用户管理员，可以在隔离profile试用手动MCP导入和模型同步。先关闭自动调度，确认实际目标目录，分别保留mcp.json、patch与credentials的原件；只从一个无敏感凭据的测试MCP和一个网关开始，审阅覆盖和移除项。保存后比对文件，再重启宿主，执行代表MCP操作与模型请求；出现部分成功、错误profile、意外模型删除或不可恢复配置，就停止写入并恢复各文件。此处是建议，不是本轮已执行。

对于需要无人值守维护、多人共享配置、无法恢复凭据或以为“解锁”就是模型能力已验证的人，当前不宜扩大使用。插件的便利在于转换与预览，不能替代管理员对声明、权限和最终配置效果负责。定时模式尤其不能先于删除与恢复验收启用。

由非空少报仍可删除、本地文件未绑定、分步写盘可部分成功，可提出未验证假设：把变更变成绑定原文件摘要的计划，并对模型删除要求连续两次独立观察或明确确认，同时保存跨文件提交进度。它相对当前可选目标digest与逐文件备份，可能降低误删和外部覆盖；代价是状态、回滚逻辑和人工确认增加。

最小验证先固定一个隔离profile，注入非空截断模型清单、外部同时编辑及第二文件写失败，比较现有方案与新计划的误删、丢修改、恢复时间和人工操作。新方案必须保留无关修改、可识别部分成功，且正常单次配置负担可接受；若只是增加确认而不能降低这些错误，或延迟删除造成可观察服务问题，就推翻或收窄假设。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:7757-7772](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7757-L7772)

MCP双文件失败窗口支持逐文件备份与恢复要求。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[lib/index.js:8650-8698](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8650-L8698)

非空集合及目标digest边界支持延迟删除与基线绑定假设。

<details>
<summary>查看原文（49行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:8781-8837](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8781-L8837)

定时两步写支持先停调度及部分成功判据。

<details>
<summary>查看原文（57行）</summary>

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
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
