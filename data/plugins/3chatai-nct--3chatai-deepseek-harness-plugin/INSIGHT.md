# 3chat-customer-growth

[返回分类](../../views/categories/CUSTOMER-SERVICE.md) · [返回首页](../../../README.md)

分析版本：[d741956](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/tree/d741956969f0adcd523c13d682e9ca8d7b313cb0)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin)
<!-- END META -->

> **实现功能**：连接3Chat组织的客户、会话和群数据，在DSH中拟稿并经确认上传/发送消息，查询批次结果，国内外连接器按语言分流。

> **核心亮点**：将OAuth组织授权、动态十二工具契约和明确触达礼仪接到DSH，保留unknown受理与单执行不重放，减少裸工具误用。详见[Q02](#research-q02)、[Q04](#research-q04)。

> **风险与缺陷**：宿主ask与Skill礼仪不等于插件内容hash确认；单次防重放不保证跨调用只发一次。地区选择/凭据按服务共享，批次归属仅内存；送达和成交仍需平台/业务记录。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 客户运营任务具体到哪里结束？](#detail-section-11)
  - [Q02 · 固定插件如何桥接远端能力与模型？](#detail-section-12)
  - [Q03 · OAuth、凭据持久化和地区切换怎样约束风险？](#detail-section-13)
  - [Q04 · “确认发送”和“不重复”能保证到什么程度？](#detail-section-14)
  - [Q05 · 依赖与启动/运营流程是什么？](#detail-section-15)
  - [Q06 · 失败恢复与生命周期有哪些具体设计取舍？](#detail-section-16)
  - [Q07 · 成本效果、推荐与继续探讨的方向是什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有3Chat组织、渠道和客户权限的运营人员。通过DSH查询客户/会话/群上下文，模型生成个性化跟进草稿，经确认上传附件/向单个或批量目标发送，再查批次结果。国内与海外渠道不同，服务跟随DSH语言选择，不能把插件当直接登录任意社交账号的机器人。

合格结果须明确canonical客户/群ID、发送账号/渠道、最终正文附件与范围，区分平台受理、发送、渠道送达/已读和成交。客户回复后24小时接待依赖3Chat里事先配置的Agent，插件没有配置这些Agent或证明购买转化。

基线是人手在3Chat查客户上下文、撰稿发送。增量在模型辅助理解与同对话工具编排，不能把拟稿/分析等同获准触达，也不能将客户记忆和模型推断混为事实。

人工在3Chat搜索客户上下文、拟稿和发送/跟踪；插件增量是模型辅助与DSH编排，不替代组织权限、内容批准和渠道结果核验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 客户/会话/群查询 | 搜索、上下文与分组分析 | 组织权限和数据口径依平台 |
| 拟稿与确认 | 模型结合上下文生成内容 | 草稿不授权发送，须核完整参数 |
| 附件/单发/批发 | 远端实际触达 | 宿主ask，单次防重放非全局幂等 |
| 批次查询 | 原job逐项跟踪 | 受理不等于送达/成交，归属映射内存 |
| OAuth/动态契约 | 最小声明scope与当前schema | 客户端设计不替代上游安全审计 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22和DSH授权/凭据/Typert/工具/Skill服务 | 必需 | OAuth、接口和模型工具 | 插件UI可见不代表授权完成 |
| 3Chat组织/空间和渠道查询/发送权限 | 业务必需 | 远端数据与执行 | 动态目录仅暴露可用工具 |
| 浏览器与本机loopback回调 | 首次交互授权 | state/code/PKCE流程 | 端口/超时可取消重连 |
| MCP client/Ajv等打包运行资产 | 必需 | 协议和schema验证 | 固定包版本需保留 |
| 当前模型和客户数据披露许可 | 模型分析前提 | 生成洞察/草稿 | 客户上下文进入模型 |
| 3Chat Agent知识/渠道转人工规则 | 仅自动接待 | 后续回复服务 | 插件不自动完成配置 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用测试组织配置最小渠道权限 | 数据/账号与地区清楚 |
| 连接 | 选语言/地区，浏览器审阅scope | 回到DSH查连接与目录 |
| 查询 | 已知客户ID和少量上下文 | 区分事实/推断及分页遗漏 |
| 拟稿 | 用户校对正文/附件/目标 | 分析不授权发送 |
| 触达 | 对完整目标与内容明确确认及宿主ask | 只明确本次操作，保留幂等键 |
| 跟踪 | 批次只查原job，未知不自动重发 | 区分受理/发送/送达/成交 |
| 维护 | 权限变更重授权，切区重核目标 | disconnect不等于撤回已发消息 |

本轮未登录、调用客户工具、上传或发送，只研究实现与随包Skill。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 3Chat组织/渠道/授权与平台订阅 | 必要时配置Agent/知识与接待 | 订阅/渠道资费和配置时间未核，不填价格 |
| 持续使用 | 客户上下文/模型分析、MCP发现/发送/上传网络 | 维护业务目标与渠道配置 | 网络/模型/平台费用依业务规模，不据源码估金额 |
| 失败恢复 | 查询原job/重新授权网络，费用未知 | 受理未知时查job、保参数/幂等键和组织区域目标记录 | 无本地持久发送账本，恢复时间未量化 |



#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 同对话运营 | 查询→草稿→确认→发送/批次跟踪接线 | 不能证明转化率或节省人工 |
| 少误重发 | 单执行写dispatch护栏与unknown | 不等于跨调用exactly-once |
| 少错区域/参数 | 捕获generation与最新schema校验 | 组织数据质量/权限仍由远端承担 |
| 后续接待 | 可接已有3Chat Agent | 非插件自动创建，效果未核 |

> **思考**：宿主ask与Skill礼仪不等于插件内容hash确认；单次防重放不保证跨调用只发一次。地区选择/凭据按服务共享，批次归属仅内存；送达和成交仍需平台/业务记录。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将OAuth组织授权、动态十二工具契约和明确触达礼仪接到DSH，保留unknown受理与单执行不重放，减少裸工具误用。详见[Q02](#research-q02)、[Q04](#research-q04)。

将OAuth组织授权、动态十二工具契约和明确触达礼仪接到DSH，保留unknown受理与单执行不重放，减少裸工具误用。详见[Q02](#research-q02)、[Q04](#research-q04)。

每connection serial队列把操作/刷新授权按序执行，withSession用AbortController合并调用signal与每request timeout，结束close transport并移除signal监听。dispose使generation失效、abort所有请求、关闭授权listener并等清理，这些是可核的资源退出路径。

工具目录更新先验证新catalog再清旧注册；新注册失败回滚旧definitions，每代注册也局部清理已成功项。但回滚本身失败仍会抛，外部服务突然变更时不能保证总有可用目录。远端工具description和客户内容是模型输入，Skill引导和schema不自动消除提示注入；写门禁/完整确认仍要有效。

readNames在宿主标isConcurrencySafe，实际connection serial将同连接读也排队，稳定性换吞吐；每次调用discover及新MCP transport增加网络与授权lease持有时间。队列中取消会在执行时检查，但是否立即释放所有等待交互需实际量测。断连受理未知记录只返回调用者，没有本地持久活动/组织/幂等账本，恢复须保留原上下文。

<a id="detail-section-5"></a>

### 1.4 主要限制

宿主ask与Skill礼仪不等于插件内容hash确认；单次防重放不保证跨调用只发一次。地区选择/凭据按服务共享，批次归属仅内存；送达和成交仍需平台/业务记录。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有试用。已有3Chat组织团队先测试组织只读，再经完整内容/目标确认核极小授权发送、unknown与批次恢复。详见[Q07](#research-q07)。

合格结果须明确canonical客户/群ID、发送账号/渠道、最终正文附件与范围，区分平台受理、发送、渠道送达/已读和成交。客户回复后24小时接待依赖3Chat里事先配置的Agent，插件没有配置这些Agent或证明购买转化。

基线是人手在3Chat查客户上下文、撰稿发送。增量在模型辅助理解与同对话工具编排，不能把拟稿/分析等同获准触达，也不能将客户记忆和模型推断混为事实。

采用建议：有试用。已有3Chat组织团队先测试组织只读，再经完整内容/目标确认核极小授权发送、unknown与批次恢复。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。动态契约/地区代际和单次防重放明确，组织权限/完整参数确认与跨调用幂等仍依宿主/平台和读者流程。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.js、src/connection.js、src/tools.js、src/regions.js、src/tool-schema.js、src/oauth/flow.js、src/oauth/provider.js、src/oauth/credentials.js、src/oauth/callback.js、references/3chat-customer-growth-1.0.4/skills/3chat-customer-growth/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定src OAuth/connection/tools/region/schema和Host选择链、随包Skill，dist关键拒绝/unknown/ask标记核对；不平台登录或客户调用、不运行作者测试。
- 下一步：可继续用模拟MCP/测试组织的401、丢响应、双会话/重启重试、切区与撤权，核单dispatch、unknown收敛、目标/内容确认及资源清理。

**分析版本**

- **仓库**：[3ChatAI-NCT/3chatai-deepseek-harness-plugin](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin)
- **版本号**：2.1.4（[固定提交 d741956](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/tree/d741956969f0adcd523c13d682e9ca8d7b313cb0)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索绑定区域/组织/目标/正文附件hash和幂等键的持久确认/操作收据，unknown只追原记录，比较重复与留存成本；未实现。详见[Q07](#research-q07)。

可继续用模拟MCP/测试组织的401、丢响应、双会话/重启重试、切区与撤权，核单dispatch、unknown收敛、目标/内容确认及资源清理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 785 | — | — | 12047 |
| .mjs | source | 6 | 205 | 195 | 6 | — |
| .js | source | 10 | 1470 | 1247 | 142 | — |
| .jsx | source | 1 | 228 | 213 | 3 | — |
| .mjs | test | 4 | 263 | 248 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/issues?q=is%3Aissue+created%3A2026-09-22T06%3A27%3A09.093Z..2026-10-22T06%3A27%3A09.093Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A27%3A09.093Z..2026-10-22T06%3A27%3A09.093Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核固定3Chat插件的洞察到触达链，重点OAuth/动态schema、完整确认、单次防重放与受理未知恢复。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 客户运营任务具体到哪里结束？

**研究主题**：场景与需求

#### 完整回答

面向已有3Chat组织、渠道和客户权限的运营人员。通过DSH查询客户/会话/群上下文，模型生成个性化跟进草稿，经确认上传附件/向单个或批量目标发送，再查批次结果。国内与海外渠道不同，服务跟随DSH语言选择，不能把插件当直接登录任意社交账号的机器人。

合格结果须明确canonical客户/群ID、发送账号/渠道、最终正文附件与范围，区分平台受理、发送、渠道送达/已读和成交。客户回复后24小时接待依赖3Chat里事先配置的Agent，插件没有配置这些Agent或证明购买转化。

基线是人手在3Chat查客户上下文、撰稿发送。增量在模型辅助理解与同对话工具编排，不能把拟稿/分析等同获准触达，也不能将客户记忆和模型推断混为事实。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-26](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/README.md#L9-L26)

业务流程和三方职责。

<details>
<summary>查看原文（18行）</summary>

```text
例如，你想重新联系最近咨询过的客户：

1. **找到客户**：描述时间范围和筛选条件，查看客户名单及最近沟通上下文。
2. **准备跟进**：让 DeepSeek Harness 总结客户关心的问题，结合你提供的产品资料和活动素材拟定消息。
3. **确认触达**：核对收件人、发送账号、渠道、正文和附件后发送；批量发送可继续查询任务进度及逐项结果。
4. **接待回复**：客户回到已连接渠道后，由该渠道已配置的 3Chat Agent 按知识和业务规则接待，必要时转交人工。

你得到的是可继续行动的客户分析、消息草稿和发送结果。成交、预约等业务结果仍需结合实际业务记录判断。

## 三方如何配合

| 角色 | 负责什么 |
|---|---|
| DeepSeek Harness | 理解目标、读取客户上下文、分析问题、生成草稿，并编排插件工具。 |
| 本插件 | 将 3Chat 的客户、会话、群、附件和消息能力接入 DSH，处理授权与调用。 |
| 3Chat 平台与 Agent | 提供客户数据和渠道执行；在 3Chat 中预先配置的 Agent 负责回复接待。 |

**接通插件前，先在 3Chat 中准备好组织／空间、渠道及 Agent 回复能力。** 插件授权与客户回复接待是两个步骤，详细准备方法见[使用指南](docs/usage.md)。
```

</details>

**依据 2 · 源码核查**：[references/3chat-customer-growth-1.0.4/skills/3chat-customer-growth/SKILL.md:34-43](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/references/3chat-customer-growth-1.0.4/skills/3chat-customer-growth/SKILL.md#L34-L43)

canonical ID、明确确认与受理/送达区分。

<details>
<summary>查看原文（10行）</summary>

```text
## Core Rules

1. Classify the request as customer search, conversation search, full-context retrieval, analysis, drafting, sending, or job-status tracking before selecting a tool.
2. Use canonical 3Chat IDs returned by search tools. Never substitute display names, external group IDs, `imRoomId`, or `im_bot_id` where a canonical ID is required.
3. Preserve multiple valid results for lists, statistics, comparisons, and analysis. Ask the user to select only when the next action requires one target and intent is ambiguous.
4. Drafting, analysis, and audience selection do not authorize sending. Before any send, show the exact recipients, sender account or channel, final content, attachments, and scope, then obtain explicit confirmation.
5. Use an existing final HTTP/HTTPS download URL only when it needs no authentication or custom headers and is neither a preview page nor redirect-only link. Otherwise call `upload_3chat_attachment` and prefer reusing the complete `data.attachment` object.
6. After a batch returns `job_id`, call only `get_3chat_batch_send_status` for that job; never recreate the batch.
7. Follow structured error fields and `aiAction`. Retry a send with identical business parameters and the original idempotency key only for `RETRY_SAME_REQUEST`.
8. Do not expose raw JSON by default. Separate 3Chat facts from model inference, and never equate `accepted`, `sent`, or `COMPLETED` with channel delivery or read status.
```

</details>

**依据 3 · 源码核查**：[references/3chat-customer-growth-1.0.4/skills/3chat-customer-growth/SKILL.md:54-56](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/references/3chat-customer-growth-1.0.4/skills/3chat-customer-growth/SKILL.md#L54-L56)

十二工具现有范围。

```text
## Current Boundary

Use only the twelve public tools listed above. Do not call internal channel lookup tools or claim support for customer-record updates, campaign or scheduling objects, 3Chat Agent configuration, or server-side aggregate analytics that the current tools do not expose.
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 固定插件如何桥接远端能力与模型？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

bundle拆为threeChat服务、tools消费者和Skill filesystem。Host建立国内/海外两个固定MCP端点与独立credentialKey，通过OAuth连接组织授权；UI语言激活某端点，切换增加selectionGeneration并清工具。工具注册时捕获region/generation，调用再校验，避免旧注册静默发到新区域。

远端listTools最多20页，prepareCatalog只接受十二公开业务名、可编译object schema，重复名剔除；保留服务端真实参数而非自造租户字段。Ajv按tool对象缓存且去$id以免跨租户同$id重用；调用前再次discover并按最新schema验证。能力缺失返回tool-unavailable，不捏造结果。

贡献是把组织客户数据、消息/附件执行、OAuth和动态契约接入DSH，并提供明确触达礼仪和受理未知收据。不是新客户模型，也不是3Chat Agent自身的能力实现；运营效果依赖实际数据、渠道和模型。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-17](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/cordis.patch.yml#L1-L17)

服务/tools/Skill三部分。

<details>
<summary>查看原文（17行）</summary>

```text
# One provider, independent consumers. No Agent preset or DSH core is replaced.
- insert:
    - id: 3chat-mcp
      name: '3chat-customer-growth'
      config:
        requestTimeoutMs: 30000
        callbackTimeoutMs: 600000
        loopbackPort: 43110
    - id: threechat-tools
      name: '3chat-customer-growth/tools'
    - id: threechat-skills
      name: '@deepseek-ai/dsh-skill-filesystem'
      inject: [threeChat]
      config:
        providerName: 3chat-customer-growth
        includeDefaultRoots: false
        customSkillDirs: !!js '[ctx.threeChat.skillRoot]'
```

</details>

**依据 2 · 源码核查**：[src/regions.js:1-34](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/regions.js#L1-L34)

固定区域与凭据key。

<details>
<summary>查看原文（34行）</summary>

```text
export const REGIONS = {
  "cn": {
    "id": "cn",
    "locale": "zh",
    "title": "3Chat 私域客户运营",
    "description": "通过微信、企业微信、小红书、抖音等已连接渠道查询、筛选客户。向单个或批量客户定向发送个性化消息。客户产生回复后，已配置的 3Chat Agent 可接续上下文，提供 7×24 小时自主接待，持续完成需求沟通、产品答疑、异议处理和购买引导，帮助商家将客户洞察转化为真实触达和成交机会",
    "serverUrl": "https://app.3chatai.cn/mcp",
    "website": "https://www.3chatai.cn/",
    "credentialKey": "threechat-mcp/oauth",
    "examples": [
      "我昨天有哪些新客户？",
      "给林女士拟一条跟进信息",
      "把这张活动图片和介绍，发给张先生"
    ]
  },
  "global": {
    "id": "global",
    "locale": "en",
    "title": "3Chat Customer Growth",
    "description": "Run customer outreach across Instagram, Facebook Messenger, and WhatsApp from DeepSeek Harness. Review customer context, prepare personalized messages, and send through connected 3Chat channels after your confirmation. When customers reply, your configured 3Chat Agent can continue the conversation 24/7, answer questions, handle objections, and guide the next step or hand off to a person. Access and actions follow your organization’s 3Chat permissions.",
    "serverUrl": "https://app.3chat.ai/mcp",
    "website": "https://3chat.ai",
    "credentialKey": "threechat-global/oauth",
    "examples": [
      "What new clients did I get yesterday?",
      "Draft a follow-up message for Ms. Lin.",
      "Send this event photo and introduction to Mr. Zhang."
    ]
  }
};

export function regionForLocale(locale) {
  return /^zh(?:[-_]|$)/i.test(String(locale ?? "")) ? REGIONS.cn : REGIONS.global;
}
```

</details>

**依据 3 · 源码核查**：[src/index.js:90-103](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/index.js#L90-L103)

切region增generation并清目录。

<details>
<summary>查看原文（14行）</summary>

```text
  async activateLocale(locale) {
    if (this.closed) throw new Error('Plugin unloaded');
    const region = regionForLocale(locale);
    const changed = region.id !== this.activeRegion;
    if (changed) {
      this.activeRegion = region.id;
      this.selectionGeneration++;
      this.publish([]);
    }
    const generation = this.selectionGeneration;
    const connection = this.connections[region.id];
    if (changed || !connection.catalog) await connection.refreshTools();
    if (!this.closed && generation === this.selectionGeneration) this.publish(connection.getToolDefinitions());
    return { ...await connection.status(), region: region.id, locale: region.locale };
```

</details>

**依据 4 · 源码核查**：[src/index.js:125-139](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/index.js#L125-L139)

捕获generation与调用检查。

<details>
<summary>查看原文（15行）</summary>

```text
  capturedConnector() {
    const region = this.activeRegion;
    const generation = this.selectionGeneration;
    return { region, generation, locale: region ? REGIONS[region].locale : 'en',
      title: region ? REGIONS[region].title : '',
      call: (tool, args, signal) => this.call(tool, args, signal, region, generation) };
  }
  async call(tool, args, signal, expectedRegion = this.activeRegion, expectedGeneration = this.selectionGeneration) {
    const isCurrent = () => !this.closed && expectedRegion === this.activeRegion && expectedGeneration === this.selectionGeneration;
    if (!expectedRegion || !isCurrent()) return { status: 'connection-required', code: 'REGION_CHANGED',
      message: 'The active connector changed. Restart this request in the selected connector.' };
    const owners = tool === 'get_3chat_batch_send_status' ? this.jobs.get(args?.job_id) : undefined;
    if (owners && !owners.has(expectedRegion)) return { status: 'invalid-arguments', code: 'JOB_REGION_MISMATCH',
      message: 'This batch belongs to the other connector. Switch back to its language to track it.' };
    const result = await this.connections[expectedRegion].call(tool, args, signal, isCurrent);
```

</details>

**依据 5 · 源码核查**：[src/connection.js:363-377](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/connection.js#L363-L377)

分页发现和契约准备。

<details>
<summary>查看原文（15行）</summary>

```text
  async discover(client) {
    const generation = this.generation;
    let cursor;
    const definitions = [];
    for (let page = 0; page < 20; page++) {
      const result = await client.listTools(cursor ? { cursor } : undefined);
      definitions.push(...result.tools);
      cursor = result.nextCursor;
      if (!cursor) break;
      if (page === 19) throw new ToolContractError('CAPABILITY_CHANGED', '3Chat 工具列表过长，请联系维护者。');
    }
    const tools = prepareCatalog(definitions);
    if (this.closed || generation !== this.generation) throw new ConnectionError('CANCELLED', 'Cancelled');
    this.publishTools([...tools.values()]);
    this.catalog = { tools };
```

</details>

**依据 6 · 源码核查**：[src/tool-schema.js:21-58](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/tool-schema.js#L21-L58)

Ajv编译/去ID/白名单和重复剔除。

<details>
<summary>查看原文（38行）</summary>

```text
const compilers = [new Ajv({ strict: false }), new Ajv2020({ strict: false })];
for (const compiler of compilers) {
  addFormats(compiler);
  compiler.addFormat('int32', { type: 'number', validate: n => Number.isInteger(n) && n >= -2147483648 && n <= 2147483647 });
  compiler.addFormat('int64', { type: 'number', validate: Number.isSafeInteger });
}
function validatorFor(tool) {
  let validator = validators.get(tool);
  if (!validator) {
    const compiler = tool.inputSchema.$schema?.includes('2020-12') ? compilers[1] : compilers[0];
    // Remote schemas commonly share an $id. Compile anonymously so tenants
    // cannot accidentally reuse another tenant's cached schema by that ID.
    const schema = { ...tool.inputSchema }; delete schema.$id;
    validator = compiler.compile(schema);
    validators.set(tool, validator);
  }
  return validator;
}

export function prepareCatalog(tools) {
  const catalog = new Map();
  const duplicates = new Set();
  for (const tool of tools) {
    if (!tool || !TOOL_NAMES.includes(tool.name) || duplicates.has(tool.name)) continue;
    if (catalog.has(tool.name)) {
      catalog.delete(tool.name);
      duplicates.add(tool.name);
      continue;
    }
    if (tool.inputSchema?.type !== 'object') continue;
    // Omit unusable capabilities individually. Keep server schemas unchanged;
    // never invent arguments or retain a tool removed from the live catalog.
    const copy = structuredClone(tool);
    try { validatorFor(copy); }
    catch { continue; }
    catalog.set(tool.name, copy);
  }
  return new Map(TOOL_NAMES.filter(name => catalog.has(name)).map(name => [name, catalog.get(name)]));
```

</details>

**依据 7 · 源码核查**：[src/connection.js:416-434](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/connection.js#L416-L434)

新目录验证再调用。

<details>
<summary>查看原文（19行）</summary>

```text
        const result = await this.withSession(async (client, requestSignal) => {
          await this.discover(client);
          const tool = this.catalog.tools.get(toolName);
          if (!tool) return {
            status: 'tool-unavailable', code: 'TOOL_UNAVAILABLE', isError: true, tool: toolName,
            message: this.locale === 'en' ? 'This tool is not currently available for this account. Other available tools can still be used.' : '当前账号暂不可用此工具，其余可用工具仍可继续使用。',
            availableTools: [...this.catalog.tools.keys()],
            nextAction: this.locale === 'en' ? 'Use an available tool, or explain that this operation is unavailable. Do not invent a result or retry automatically.' : '使用当前可用工具，或说明此操作暂不可用；不要编造结果或自动重试。',
          };
          if (write && typeof grant.tokens?.scope === 'string' && !scopesOf(grant).includes('messages:write')) {
            this.needsAuthorization = true;
            return { status: 'connection-required', message: this.locale === 'en' ? 'The grant lacks messages:write. Reconnect and review permissions.' : '当前授权缺少 messages:write，请在插件页重新连接并审阅权限。' };
          }
          const request = validateArguments(tool, args);
          dispatched = true;
          // A single explicit call. Never replay a write after a timeout or
          // business error; preserve the server's aiAction and idempotency facts.
          return client.callTool({ name: toolName, arguments: request },
            { timeout: this.requestTimeoutMs, signal: requestSignal, toolDefinition: tool });
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · OAuth、凭据持久化和地区切换怎样约束风险？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

scope固定customers:read messages:write，授权URL若多出未声明scope拒绝；provider保存codeVerifier与随机state，回调先核state再读code/error，iss交SDK后续验证。临时HTTP listener只绑定127.0.0.1，固定端口被占可用临时端口，close有socket宽限清理。这里可证的是客户端流程，不能替代上游授权服务器安全审计。

credentials.modifyRecord包一个读/刷新/写lease，SDK操作在staged状态，closed/generation改变不写回过时grant；复杂URL/Headers等显式转JSON，不可表示类型抛字段/原型错误而非静默丢字段。令牌存储保密、文件权限和远程管理权限由宿主credentials/authorization实现承担，插件不额外加密。

region选择是ThreeChatService单实例activeRegion，客户端切语言会改变该实例共享选择；captured generation让旧工具失败而非跨区误发，但多客户端语言不同会有相互切换/重试成本。凭据按区域而非每session保存，不能宣称多组织多用户隔离。批次job区域映射仅内存，重启后不知旧job归属，仍须人保留地区/组织/原job。

#### 证据与依据

**依据 1 · 源码核查**：[src/oauth/flow.js:4-5](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/oauth/flow.js#L4-L5)

固定scope。

```text
/** Scope required by Skill 1.0.4; the SDK must never default to all advertised scopes. */
export const OAUTH_SCOPE = 'customers:read messages:write';
```

**依据 2 · 源码核查**：[src/oauth/flow.js:45-71](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/oauth/flow.js#L45-L71)

scope校验与iss/clearState。

<details>
<summary>查看原文（27行）</summary>

```text
/** Refuse an authorization URL asking for permissions outside the declared scope. */
export function assertRequestedScope(authorizationUrl, requestedScope = OAUTH_SCOPE) {
  const requested = new URL(String(authorizationUrl)).searchParams.get('scope') ?? '';
  const asked = requested.split(/\s+/).filter(Boolean);
  const expected = new Set(requestedScope.split(/\s+/).filter(Boolean));
  const disallowed = asked.filter(scope => !expected.has(scope));
  if (disallowed.length) {
    throw new FlowError('SCOPE_ESCALATION', `Authorization requested undeclared scopes: ${disallowed.join(', ')}`);
  }
  return asked;
}

/** Exchange the validated loopback code through the SDK, then discard the nonce and verifier. */
export async function completeAuthorization({ serverUrl, redirectUrl, persistFor, seed,
  authorizationCode, iss, scope = OAUTH_SCOPE, fetchFn, clientName = OAUTH_CLIENT_NAME }) {
  // The listener already extracted the decoded code. OAuth codes are opaque, including punctuation.
  if (typeof authorizationCode !== 'string' || authorizationCode.length === 0) {
    throw new FlowError('NO_CODE', 'Expected a nonempty authorization code from the loopback listener');
  }
  const provider = createProvider({ redirectUrl, persistFor, seed, scope, clientName, onRedirect: () => {} });
  const result = await auth(provider, {
    serverUrl: new URL(serverUrl), authorizationCode, iss, scope, fetchFn,
  });
  if (result !== 'AUTHORIZED') {
    throw new FlowError('AUTHORIZATION_FAILED', `Token exchange did not return AUTHORIZED (got ${String(result)})`);
  }
  await provider.clearState();
```

</details>

**依据 3 · 源码核查**：[src/oauth/provider.js:47-69](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/oauth/provider.js#L47-L69)

verifier/state生命周期。

<details>
<summary>查看原文（23行）</summary>

```text
    async saveCodeVerifier(codeVerifier) {
      await put('codeVerifier', codeVerifier);
    },
    async codeVerifier() {
      return state.codeVerifier;
    },
    /**
     * CSRF nonce echoed back on the callback; the SDK omits `state` when this is
     * absent. A nonce is minted once per authorization attempt and cleared when
     * the callback leg consumes the provider, so a stale nonce can never be
     * replayed against a later attempt.
     */
    async state() {
      const next = state.oauthState ?? randomUUID();
      if (state.oauthState !== next) await put('oauthState', next);
      return next;
    },
    /** Consume the nonce after a successful exchange. */
    async clearState() {
      if (state.oauthState !== undefined || state.codeVerifier !== undefined) {
        delete state.oauthState;
        delete state.codeVerifier;
        await persist({ ...state });
```

</details>

**依据 4 · 源码核查**：[src/oauth/callback.js:148-168](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/oauth/callback.js#L148-L168)

state优先拒绝。

<details>
<summary>查看原文（21行）</summary>

```text
    // CSRF first: refuse a response that does not echo the state this attempt issued,
    // before reading anything else out of it.
    let expected;
    try {
      expected = await expectedState();
    } catch (cause) {
      reply(res, 500, 'Cannot verify this callback', 'The pending authorization state could not be read.');
      settleOnce(settle.reject, new CallbackError('STATE_UNAVAILABLE', `cannot read the pending state: ${String(cause)}`));
      return;
    }
    const state = params.get('state') ?? undefined;
    if (expected === undefined || state !== expected) {
      settleOnce(
        settle.reject,
        new CallbackError(
          'STATE_MISMATCH',
          'the callback did not echo the state issued for this attempt; refused without reading the code',
        ),
      );
      reply(res, 400, 'Callback refused', 'The state parameter did not match this authorization attempt.');
      return;
```

</details>

**依据 5 · 源码核查**：[src/oauth/callback.js:209-254](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/oauth/callback.js#L209-L254)

loopback绑定和清理。

<details>
<summary>查看原文（46行）</summary>

```text
  /** Bind, retrying once on an ephemeral port when the preferred one is taken. */
  const listen = (bindPort) =>
    new Promise((resolve, reject) => {
      const onError = (error) => {
        server.removeListener('listening', onListening);
        reject(error);
      };
      const onListening = () => {
        server.removeListener('error', onError);
        resolve(server.address());
      };
      server.once('error', onError);
      server.once('listening', onListening);
      server.listen(bindPort, '127.0.0.1');
    });

  let address;
  try {
    address = await listen(port);
  } catch (error) {
    if (error?.code !== 'EADDRINUSE') throw error;
    // A dynamic registration binds one port into its redirect_uri, so a taken port
    // means a fresh registration on the ephemeral port instead.
    address = await listen(0);
  }

  const boundPort = typeof address === 'object' && address !== null ? address.port : port;


  /**
   * Release the port. A waiter that is still pending is failed with CLOSED rather than
   * left unresolved: unloading the plugin must end the in-flight tool call, not hang it
   * until its timeout.
   */
  const close = (reason) => {
    if (closePromise) return closePromise;
    closed = true;
    if (timer !== undefined) clearTimeout(timer);
    settleOnce(settle.reject, new CallbackError('CLOSED', reason ?? 'the callback listener was closed before a callback arrived'));
    closePromise = new Promise((resolve) => {
      // Chrome may open an extra TCP socket without sending a request. Node's
      // server.close() leaves that socket alive, blocking the token exchange.
      // Let active callback responses flush, but bound teardown of every socket.
      const force = setTimeout(() => { for (const socket of sockets) socket.destroy(); }, CALLBACK_CLEANUP_GRACE_MS);
      server.close(() => {
        clearTimeout(force);
```

</details>

**依据 6 · 源码核查**：[src/connection.js:111-125](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/connection.js#L111-L125)

credential lease和代际写入。

<details>
<summary>查看原文（15行）</summary>

```text
  // The SDK operates on an in-memory snapshot while the credential provider owns
  // one atomic read/refresh/write lease. No nested record locks or stale snapshot merges.
  async transaction(operation, generation = this.generation) {
    let value, failure;
    await this.credentials.modifyRecord(this.credentialKey, async (record) => {
      let staged = { ...readGrant(record) };
      let dirty = false;
      const persistFor = () => async (next) => { staged = { ...next }; dirty = true; };
      try { value = await operation(staged, persistFor, (next) => { staged = next; dirty = true; }); }
      catch (error) { failure = error; }
      if (this.closed || generation !== this.generation) return undefined;
      return dirty ? toStorableGrant({ ...staged, updatedAt: new Date(this.clock()).toISOString() }) : undefined;
    });
    if (failure) throw failure;
    return value;
```

</details>

**依据 7 · 源码核查**：[src/oauth/credentials.js:48-88](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/oauth/credentials.js#L48-L88)

显式JSON序列化。

<details>
<summary>查看原文（41行）</summary>

```text
function toCredentialJson(value, path = '') {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const type = typeof value;
  if (type === 'string' || type === 'boolean') return value;
  if (type === 'number') {
    if (Number.isFinite(value)) return value;
    throw new UnserializableCredentialValue(path, 'non-finite number');
  }
  if (type === 'bigint' || type === 'symbol' || type === 'function') {
    throw new UnserializableCredentialValue(path, type);
  }

  if (Array.isArray(value)) return value.map((item, index) => toCredentialJson(item, `${path}[${index}]`));
  if (value instanceof Date) return value.toISOString();
  if (value instanceof URL) return value.toString();
  if (value instanceof Error) return { name: value.name, message: value.message };
  if (value instanceof Headers) return Object.fromEntries(value.entries());
  if (value instanceof Map) return toCredentialJson(Object.fromEntries(value), path);
  if (value instanceof Set) return toCredentialJson([...value], path);
  if (value instanceof ArrayBuffer) return Buffer.from(value).toString('base64');
  if (ArrayBuffer.isView(value)) {
    return Buffer.from(value.buffer, value.byteOffset, value.byteLength).toString('base64');
  }

  if (isPlainObject(value)) {
    const out = {};
    for (const [key, nested] of Object.entries(value)) {
      const converted = toCredentialJson(nested, path ? `${path}.${key}` : key);
      if (converted !== undefined) out[key] = converted;
    }
    return out;
  }

  const proto = Object.getPrototypeOf(value);
  throw new UnserializableCredentialValue(path, proto === null ? 'null' : proto.constructor?.name ?? '<anonymous>');
}

/** Tag a credential record's payload so nothing unrepresentable can be stored. */
export function toStorableGrant(payload) {
  return { kind: 'grant', payload: toCredentialJson(payload, 'payload') };
```

</details>

**依据 8 · 源码核查**：[src/index.js:22-31](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/index.js#L22-L31)

共享region/jobs与两个凭据槽。

<details>
<summary>查看原文（10行）</summary>

```text
    this.activeRegion = undefined;
    this.selectionGeneration = 0;
    this.clientManaged = false;
    this.closed = false;
    this.listeners = new Set();
    this.jobs = new Map();
    this.connections = Object.fromEntries(Object.values(REGIONS).map(region => [region.id,
      new ThreeChatConnection({ ...config, credentials: ctx.credentials, logger: ctx.logger,
        serverUrl: region.serverUrl, credentialKey: region.credentialKey,
        locale: region.locale, productTitle: region.title })]));
```

</details>

#### 缺口

- 宿主credentials/remote授权、实际租户权限及多客户端共享行为没有同版本部署证据。
  **影响**：不提供组织/会话隔离或令牌保密验收。
  **进一步探讨**：可继续核宿主秘密存储与远程权限链，受控双语言/双组织分别验证拒绝点和切换提示。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · “确认发送”和“不重复”能保证到什么程度？

**研究主题**：缺陷与关键质疑

#### 完整回答

所有upload/send工具标写且串行队列，pre-execute先尊重上游非allow决定；若allow则返回ask，上传也要求本次确认。Skill要求提前展示准确收件人/账号/内容/附件/范围。审批reason主要列目标并提醒检查，最终正文绑定依赖宿主完整参数展示与用户核对；插件没有自己记录一个草稿hash确认token，不能宣称两层确认均程序强制。

连接器对每显式工具执行的HTTP tools/call维护sentWrites集合，同工具名第二次dispatch拒绝，即使SDK401/头不匹配重试也不自动重放。调用后错误若write&&dispatched返回acceptance unknown并要求保原参数/幂等键、已有job只查询原任务。这比“失败即重发”保守，但dispatched在client.callTool前设置，所以可能把尚未远端收到的失败也保守记未知，而不是证明远端受理。

单次不重放不是跨显式调用的全局exactly-once。用户/模型再次调用、另一会话/重启或远端自身重试仍依靠平台幂等键/批次状态，插件没有本地持久发送账本。取消本地请求不撤回已受理消息，平台accepted/COMPLETED不证明渠道送达/已读，客户运营不能用这些代替业务成效。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.js:88-99](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/tools.js#L88-L99)

写串行与signal检查。

<details>
<summary>查看原文（12行）</summary>

```text
      isConcurrencySafe: () => readNames.has(tool.name),
      execute(args, execution) {
        const call = () => {
          execution?.signal?.throwIfAborted();
          return connector ? connector.call(tool.name, args, execution?.signal) : ctx.threeChat.call(tool.name, args, execution?.signal);
        };
        if (!writeNames.has(tool.name)) return call();
        // The host scheduler treats writes as exclusive; this queue also covers
        // callers using tools.execute directly instead of that scheduler.
        const pending = writeTail.then(call);
        writeTail = pending.catch(() => {});
        return pending;
```

</details>

**依据 2 · 源码核查**：[src/tools.js:112-115](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/tools.js#L112-L115)

先尊重next再ask。

```text
  ctx.on('tools/pre-execute', async (execution, next) => {
    const decision = await next();
    if (decision.kind !== 'allow' || !writeNames.has(execution.name)) return decision;
    return { kind: 'ask', reason: approvalReason(execution.name, execution.arguments, ctx.threeChat.capturedConnector?.().locale ?? 'zh') };
```

**依据 3 · 源码核查**：[references/3chat-customer-growth-1.0.4/skills/3chat-customer-growth/SKILL.md:39-43](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/references/3chat-customer-growth-1.0.4/skills/3chat-customer-growth/SKILL.md#L39-L43)

明确内容确认与状态/重试规则。

```text
4. Drafting, analysis, and audience selection do not authorize sending. Before any send, show the exact recipients, sender account or channel, final content, attachments, and scope, then obtain explicit confirmation.
5. Use an existing final HTTP/HTTPS download URL only when it needs no authentication or custom headers and is neither a preview page nor redirect-only link. Otherwise call `upload_3chat_attachment` and prefer reusing the complete `data.attachment` object.
6. After a batch returns `job_id`, call only `get_3chat_batch_send_status` for that job; never recreate the batch.
7. Follow structured error fields and `aiAction`. Retry a send with identical business parameters and the original idempotency key only for `RETRY_SAME_REQUEST`.
8. Do not expose raw JSON by default. Separate 3Chat facts from model inference, and never equate `accepted`, `sent`, or `COMPLETED` with channel delivery or read status.
```

**依据 4 · 源码核查**：[src/connection.js:128-143](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/connection.js#L128-L143)

一次执行内防SDK重放。

<details>
<summary>查看原文（16行）</summary>

```text
  boundedFetch(controller) {
    const sentWrites = new Set();
    return (url, init = {}) => {
      let rpc;
      try { if (typeof init.body === 'string') rpc = JSON.parse(init.body); } catch { /* OAuth forms are not RPC. */ }
      if (rpc?.method === 'tools/call' && WRITE_TOOLS.has(rpc.params?.name)) {
        // The SDK may retry after 401 or HEADER_MISMATCH. A write gets at most
        // one HTTP dispatch per explicit tool execution, even on those paths.
        if (sentWrites.has(rpc.params.name)) throw new ConnectionError('WRITE_REPLAY_BLOCKED', 'Automatic write replay blocked');
        sentWrites.add(rpc.params.name);
      }
      const request = {
        ...init,
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(this.requestTimeoutMs), ...(init.signal ? [init.signal] : [])]),
      };
      return this.fetchFn(url, request);
```

</details>

**依据 5 · 源码核查**：[src/connection.js:425-449](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/connection.js#L425-L449)

scope、dispatched与受理未知。

<details>
<summary>查看原文（25行）</summary>

```text
          if (write && typeof grant.tokens?.scope === 'string' && !scopesOf(grant).includes('messages:write')) {
            this.needsAuthorization = true;
            return { status: 'connection-required', message: this.locale === 'en' ? 'The grant lacks messages:write. Reconnect and review permissions.' : '当前授权缺少 messages:write，请在插件页重新连接并审阅权限。' };
          }
          const request = validateArguments(tool, args);
          dispatched = true;
          // A single explicit call. Never replay a write after a timeout or
          // business error; preserve the server's aiAction and idempotency facts.
          return client.callTool({ name: toolName, arguments: request },
            { timeout: this.requestTimeoutMs, signal: requestSignal, toolDefinition: tool });
        }, signal);
        this.fault = undefined;
        this.lastCheckedAt = new Date(this.clock()).toISOString();
        return result;
      } catch (error) {
        const fault = publicError(error, this.locale);
        if (error instanceof ToolContractError) return {
          status: error.code === 'INVALID_ARGUMENTS' ? 'invalid-arguments' : 'query-failed',
          code: fault.code, field: error.field, message: fault.message, nextAction: fault.message,
        };
        this.recordFailure(error);
        return { status: fault.code === 'AUTH_REQUIRED' || fault.code === 'RESOURCE_MISMATCH'
            ? 'connection-required' : 'unavailable', code: fault.code, message: fault.message,
          ...(write && dispatched ? { acceptance: 'unknown',
            nextAction: this.locale === 'en' ? 'Acceptance is unknown. Keep the original parameters and idempotency key; query the original job if available.' : '未确认远端是否已受理；保留原参数与幂等键，不自动重发；若已有 job_id，只查询原任务。' }
```

</details>

#### 缺口

- 宿主ask展示是否包含最终全部参数及平台幂等/批次送达语义没有实际受控证据。
  **影响**：不能保证同意绑定内容hash或端到端只发送一次。
  **进一步探讨**：用测试组织的模拟/沙箱消息与故障代理记录确认参数、dispatch次数、幂等键与查询状态，不能接触真实客户。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖与启动/运营流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22和DSH授权/凭据/Typert/工具/Skill服务 | 必需 | OAuth、接口和模型工具 | 插件UI可见不代表授权完成 |
| 3Chat组织/空间和渠道查询/发送权限 | 业务必需 | 远端数据与执行 | 动态目录仅暴露可用工具 |
| 浏览器与本机loopback回调 | 首次交互授权 | state/code/PKCE流程 | 端口/超时可取消重连 |
| MCP client/Ajv等打包运行资产 | 必需 | 协议和schema验证 | 固定包版本需保留 |
| 当前模型和客户数据披露许可 | 模型分析前提 | 生成洞察/草稿 | 客户上下文进入模型 |
| 3Chat Agent知识/渠道转人工规则 | 仅自动接待 | 后续回复服务 | 插件不自动完成配置 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用测试组织配置最小渠道权限 | 数据/账号与地区清楚 |
| 连接 | 选语言/地区，浏览器审阅scope | 回到DSH查连接与目录 |
| 查询 | 已知客户ID和少量上下文 | 区分事实/推断及分页遗漏 |
| 拟稿 | 用户校对正文/附件/目标 | 分析不授权发送 |
| 触达 | 对完整目标与内容明确确认及宿主ask | 只明确本次操作，保留幂等键 |
| 跟踪 | 批次只查原job，未知不自动重发 | 区分受理/发送/送达/成交 |
| 维护 | 权限变更重授权，切区重核目标 | disconnect不等于撤回已发消息 |

本轮未登录、调用客户工具、上传或发送，只研究实现与随包Skill。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:70-98](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/package.json#L70-L98)

主要依赖/作者脚本与Node。

<details>
<summary>查看原文（29行）</summary>

```text
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-typert-protocol": "0.2.0-rc.2",
    "@deepseek-ai/schemastery": "3.18.4",
    "@modelcontextprotocol/client": "2.3.1",
    "ajv": "^8.20.0",
    "ajv-formats": "^3.0.1",
    "esbuild": "^0.25.12",
    "react": "19.1.1",
    "zod": "^4.6.5",
    "js-yaml": "^5.4.3"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin.git"
  },
  "homepage": "https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin",
  "bugs": {
    "url": "https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/issues"
  },
  "scripts": {
    "build": "node scripts/build.mjs",
    "pack": "npm run build && node scripts/pack.mjs",
    "test": "node --test test/*.test.mjs",
    "check:git-install": "node scripts/check-git-install.mjs"
  },
  "engines": {
    "node": ">=22"
  },
  "license": "Apache-2.0"
```

</details>

**依据 2 · 作者声明**：[README.md:40-56](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/README.md#L40-L56)

作者宿主/账号准备与语言分流。

<details>
<summary>查看原文（17行）</summary>

````text
需要官方 0.2.1-rc.2 或更新版本 [**DeepSeek Harness**](https://www.deepseek.com/harness/) 和具有客户查询、渠道发送权限的 **3Chat 组织账号**。

1. 在 [3Chat 国内站](https://www.3chatai.cn/) 准备业务空间、连接渠道；需要自主接待时，配置该渠道的 Agent、知识和转人工规则。
2. 打开 DSH「插件 → 添加插件」，粘贴[仓库完整地址](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin)，安装后启用：

   ```text
   https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin
   ```
3. 打开“3Chat 私域客户运营”，点击“连接 3Chat”，在浏览器登录目标组织账号并授权。
4. 返回对话，先查询一个已知客户，再准备一条跟进草稿。

在「插件 → 添加插件」中输入上述仓库地址，即可安装 3Chat 插件。启用并完成账号授权后，即可在 DeepSeek Harness 对话中使用客户运营功能。升级时先卸载，再粘贴同一地址安装。也可使用 [Release 安装包](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/releases/latest/download/3chat-customer-growth.tgz)。自行构建见[开发说明](docs/development.md)。

插件随 DSH 界面语言选择服务：中文连接国内服务，其他语言连接海外服务；两端分别授权。上传和发送还需通过 DSH 的本次执行确认。客户与渠道可见范围遵循组织授权。

## 进一步使用

````

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-17](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/cordis.patch.yml#L1-L17)

授权/工具/Skill装配。

<details>
<summary>查看原文（17行）</summary>

```text
# One provider, independent consumers. No Agent preset or DSH core is replaced.
- insert:
    - id: 3chat-mcp
      name: '3chat-customer-growth'
      config:
        requestTimeoutMs: 30000
        callbackTimeoutMs: 600000
        loopbackPort: 43110
    - id: threechat-tools
      name: '3chat-customer-growth/tools'
    - id: threechat-skills
      name: '@deepseek-ai/dsh-skill-filesystem'
      inject: [threeChat]
      config:
        providerName: 3chat-customer-growth
        includeDefaultRoots: false
        customSkillDirs: !!js '[ctx.threeChat.skillRoot]'
```

</details>

**依据 4 · 源码核查**：[src/oauth/callback.js:209-232](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/oauth/callback.js#L209-L232)

loopback端口条件。

<details>
<summary>查看原文（24行）</summary>

```text
  /** Bind, retrying once on an ephemeral port when the preferred one is taken. */
  const listen = (bindPort) =>
    new Promise((resolve, reject) => {
      const onError = (error) => {
        server.removeListener('listening', onListening);
        reject(error);
      };
      const onListening = () => {
        server.removeListener('error', onError);
        resolve(server.address());
      };
      server.once('error', onError);
      server.once('listening', onListening);
      server.listen(bindPort, '127.0.0.1');
    });

  let address;
  try {
    address = await listen(port);
  } catch (error) {
    if (error?.code !== 'EADDRINUSE') throw error;
    // A dynamic registration binds one port into its redirect_uri, so a taken port
    // means a fresh registration on the ephemeral port instead.
    address = await listen(0);
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 失败恢复与生命周期有哪些具体设计取舍？

**研究主题**：工程质量与复用

#### 完整回答

每connection serial队列把操作/刷新授权按序执行，withSession用AbortController合并调用signal与每request timeout，结束close transport并移除signal监听。dispose使generation失效、abort所有请求、关闭授权listener并等清理，这些是可核的资源退出路径。

工具目录更新先验证新catalog再清旧注册；新注册失败回滚旧definitions，每代注册也局部清理已成功项。但回滚本身失败仍会抛，外部服务突然变更时不能保证总有可用目录。远端工具description和客户内容是模型输入，Skill引导和schema不自动消除提示注入；写门禁/完整确认仍要有效。

readNames在宿主标isConcurrencySafe，实际connection serial将同连接读也排队，稳定性换吞吐；每次调用discover及新MCP transport增加网络与授权lease持有时间。队列中取消会在执行时检查，但是否立即释放所有等待交互需实际量测。断连受理未知记录只返回调用者，没有本地持久活动/组织/幂等账本，恢复须保留原上下文。

#### 证据与依据

**依据 1 · 源码核查**：[src/connection.js:77-83](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/connection.js#L77-L83)

connection串行。

```text
  serial(operation) {
    const task = this.queue.then(() => {
      if (this.closed) throw new ConnectionError('CLOSED', 'Plugin unloaded');
      return operation();
    });
    this.queue = task.catch(() => {});
    return task;
```

**依据 2 · 源码核查**：[src/connection.js:329-360](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/connection.js#L329-L360)

请求signal/lease/transport清理。

<details>
<summary>查看原文（32行）</summary>

```text
  async withSession(operation, signal) {
    const generation = this.generation;
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) abort();
    signal?.addEventListener('abort', abort, { once: true });
    this.requests.add(controller);
    try {
      return await this.transaction(async (seed, persistFor) => {
        if (!hasToken(seed)) throw new ConnectionError('AUTH_REQUIRED', 'No credential');
        if (!this.matchesResource(seed)) throw new ConnectionError('RESOURCE_MISMATCH', 'Different resource');
        const redirectUrl = seed.clientInformation?.redirect_uris?.[0] ?? `http://127.0.0.1:${this.loopbackPort}/oauth/3chat-mcp-callback`;
        const provider = createOAuthClientProvider({
          redirectUrl, seed, persist: persistFor(seed),
          clientMetadata: { client_name: OAUTH_CLIENT_NAME, redirect_uris: [redirectUrl],
            grant_types: ['authorization_code', 'refresh_token'], response_types: ['code'],
            token_endpoint_auth_method: 'none', scope: OAUTH_SCOPE },
          onRedirect: () => { throw new ConnectionError('INTERACTIVE_AUTH_REQUIRED', 'Sign in again'); },
        });
        const transport = new StreamableHTTPClientTransport(new URL(this.serverUrl), {
          authProvider: provider, fetch: this.boundedFetch(controller), onInsufficientScope: 'throw',
        });
        const client = new Client({ name: PACKAGE_NAME, version: VERSION });
        try {
          await client.connect(transport, { timeout: this.requestTimeoutMs });
          return await operation(client, controller.signal);
        } finally { await transport.close().catch(() => {}); }
      }, generation);
    } finally {
      signal?.removeEventListener('abort', abort);
      this.requests.delete(controller);
    }
```

</details>

**依据 3 · 源码核查**：[src/connection.js:456-465](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/connection.js#L456-L465)

dispose终止/等待。

<details>
<summary>查看原文（10行）</summary>

```text
  async dispose() {
    this.closed = true; this.generation++;
    this.toolListeners.clear();
    for (const controller of this.requests) controller.abort();
    const attempt = this.attempt;
    this.attempt = undefined;
    if (attempt) { attempt.controller.abort(); await attempt.listener.close(); }
    await this.queue.catch(() => {});
    await Promise.allSettled([...this.cleanups]);
    this.catalog = undefined;
```

</details>

**依据 4 · 源码核查**：[src/tools.js:63-111](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/tools.js#L63-L111)

目录验证/注册局部清理/回滚。

<details>
<summary>查看原文（49行）</summary>

```text
  const register = next => {
    const disposers = [];
    try {
      for (const definition of next) disposers.push(ctx.tools.register(definition));
      return disposers;
    } catch (error) {
      clear(disposers);
      throw error;
    }
  };
  const replace = catalog => {
    if (disposed) return;
    if (!Array.isArray(catalog) || (
        new Set(catalog.map(tool => tool.name)).size !== catalog.length ||
        catalog.some(tool => !businessNames.has(tool.name) || !tool.inputSchema || typeof tool.inputSchema !== 'object'))) {
      throw new Error('Invalid 3Chat tool definitions.');
    }
    refreshControls();
    // Build the complete generation before changing the host registry.
    const connector = ctx.threeChat.capturedConnector?.();
    const next = catalog.map(tool => ({
      name: tool.name,
      description: connector ? `${connector.locale === 'en' ? 'Read skill(3chat-customer-growth) first.' : '先读取 skill(3chat-customer-growth)。'} [${connector.title}] ${tool.description ?? ''}` : `先读取 skill(3chat-customer-growth)。${tool.description ?? ''}`,
      parameters: tool.inputSchema,
      output,
      isConcurrencySafe: () => readNames.has(tool.name),
      execute(args, execution) {
        const call = () => {
          execution?.signal?.throwIfAborted();
          return connector ? connector.call(tool.name, args, execution?.signal) : ctx.threeChat.call(tool.name, args, execution?.signal);
        };
        if (!writeNames.has(tool.name)) return call();
        // The host scheduler treats writes as exclusive; this queue also covers
        // callers using tools.execute directly instead of that scheduler.
        const pending = writeTail.then(call);
        writeTail = pending.catch(() => {});
        return pending;
      },
    }));
    clear(generation);
    generation = [];
    try {
      generation = register(next);
      definitions = next;
    } catch (error) {
      generation = register(definitions);
      throw error;
    }
  };
```

</details>

**依据 5 · 源码核查**：[src/connection.js:416-434](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/connection.js#L416-L434)

每次发现再call。

<details>
<summary>查看原文（19行）</summary>

```text
        const result = await this.withSession(async (client, requestSignal) => {
          await this.discover(client);
          const tool = this.catalog.tools.get(toolName);
          if (!tool) return {
            status: 'tool-unavailable', code: 'TOOL_UNAVAILABLE', isError: true, tool: toolName,
            message: this.locale === 'en' ? 'This tool is not currently available for this account. Other available tools can still be used.' : '当前账号暂不可用此工具，其余可用工具仍可继续使用。',
            availableTools: [...this.catalog.tools.keys()],
            nextAction: this.locale === 'en' ? 'Use an available tool, or explain that this operation is unavailable. Do not invent a result or retry automatically.' : '使用当前可用工具，或说明此操作暂不可用；不要编造结果或自动重试。',
          };
          if (write && typeof grant.tokens?.scope === 'string' && !scopesOf(grant).includes('messages:write')) {
            this.needsAuthorization = true;
            return { status: 'connection-required', message: this.locale === 'en' ? 'The grant lacks messages:write. Reconnect and review permissions.' : '当前授权缺少 messages:write，请在插件页重新连接并审阅权限。' };
          }
          const request = validateArguments(tool, args);
          dispatched = true;
          // A single explicit call. Never replay a write after a timeout or
          // business error; preserve the server's aiAction and idempotency facts.
          return client.callTool({ name: toolName, arguments: request },
            { timeout: this.requestTimeoutMs, signal: requestSignal, toolDefinition: tool });
```

</details>

#### 缺口

- 真实平台断网/过期/撤权、队列取消及注册回滚故障没有本轮事件记录。
  **影响**：不声称高可用或实际取消时延。
  **进一步探讨**：受控MCP替身覆盖401、慢响应、未知受理与回滚故障，核单dispatch、清理和可恢复状态。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 成本效果、推荐与继续探讨的方向是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 3Chat组织/渠道/授权与平台订阅 | 必要时配置Agent/知识与接待 | 订阅/渠道资费和配置时间未核，不填价格 |
| 持续使用 | 客户上下文/模型分析、MCP发现/发送/上传网络 | 维护业务目标与渠道配置 | 网络/模型/平台费用依业务规模，不据源码估金额 |
| 失败恢复 | 查询原job/重新授权网络，费用未知 | 受理未知时查job、保参数/幂等键和组织区域目标记录 | 无本地持久发送账本，恢复时间未量化 |

#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 同对话运营 | 查询→草稿→确认→发送/批次跟踪接线 | 不能证明转化率或节省人工 |
| 少误重发 | 单执行写dispatch护栏与unknown | 不等于跨调用exactly-once |
| 少错区域/参数 | 捕获generation与最新schema校验 | 组织数据质量/权限仍由远端承担 |
| 后续接待 | 可接已有3Chat Agent | 非插件自动创建，效果未核 |

有条件试用。适合已有3Chat权限且能用测试组织逐项核完整确认、权限/区域、受理未知和批次跟踪的团队。先只读再经授权测试极小发送，不能当全自动触达/成交承诺。源码中的不重放和动态schema设计提供比裸远程工具更明确的操作边界，仍不足以直接给安装级推荐。

可探讨“持久确认与操作收据”。将region/组织/目标/正文附件hash/幂等键绑定确认后记录持久操作ID，未知受理只查询原记录，区分草稿授权、宿主批准、远端受理、渠道送达。相较当前仅单次调用护栏，目标减少重启/多会话重复和错内容；同时必须控制客户数据留存与敏感hash元数据披露。

未实现。最小对照用模拟MCP和测试组织的丢响应/重启/双会话重试/切区，比较重复dispatch、错误目标、未知状态收敛、人工恢复与额外存储；如果新增账本不能更好收敛unknown或增加不必要数据留存，应缩减记录。

#### 证据与依据

**依据 1 · 源码核查**：[src/connection.js:128-143](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/connection.js#L128-L143)

现有单执行重放护栏。

<details>
<summary>查看原文（16行）</summary>

```text
  boundedFetch(controller) {
    const sentWrites = new Set();
    return (url, init = {}) => {
      let rpc;
      try { if (typeof init.body === 'string') rpc = JSON.parse(init.body); } catch { /* OAuth forms are not RPC. */ }
      if (rpc?.method === 'tools/call' && WRITE_TOOLS.has(rpc.params?.name)) {
        // The SDK may retry after 401 or HEADER_MISMATCH. A write gets at most
        // one HTTP dispatch per explicit tool execution, even on those paths.
        if (sentWrites.has(rpc.params.name)) throw new ConnectionError('WRITE_REPLAY_BLOCKED', 'Automatic write replay blocked');
        sentWrites.add(rpc.params.name);
      }
      const request = {
        ...init,
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(this.requestTimeoutMs), ...(init.signal ? [init.signal] : [])]),
      };
      return this.fetchFn(url, request);
```

</details>

**依据 2 · 源码核查**：[src/connection.js:439-449](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/connection.js#L439-L449)

unknown恢复建议。

<details>
<summary>查看原文（11行）</summary>

```text
      } catch (error) {
        const fault = publicError(error, this.locale);
        if (error instanceof ToolContractError) return {
          status: error.code === 'INVALID_ARGUMENTS' ? 'invalid-arguments' : 'query-failed',
          code: fault.code, field: error.field, message: fault.message, nextAction: fault.message,
        };
        this.recordFailure(error);
        return { status: fault.code === 'AUTH_REQUIRED' || fault.code === 'RESOURCE_MISMATCH'
            ? 'connection-required' : 'unavailable', code: fault.code, message: fault.message,
          ...(write && dispatched ? { acceptance: 'unknown',
            nextAction: this.locale === 'en' ? 'Acceptance is unknown. Keep the original parameters and idempotency key; query the original job if available.' : '未确认远端是否已受理；保留原参数与幂等键，不自动重发；若已有 job_id，只查询原任务。' }
```

</details>

**依据 3 · 源码核查**：[src/index.js:136-149](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/index.js#L136-L149)

批次region映射仅内存。

<details>
<summary>查看原文（14行）</summary>

```text
    const owners = tool === 'get_3chat_batch_send_status' ? this.jobs.get(args?.job_id) : undefined;
    if (owners && !owners.has(expectedRegion)) return { status: 'invalid-arguments', code: 'JOB_REGION_MISMATCH',
      message: 'This batch belongs to the other connector. Switch back to its language to track it.' };
    const result = await this.connections[expectedRegion].call(tool, args, signal, isCurrent);
    if (tool === 'send_3chat_customer_messages' || tool === 'send_3chat_group_messages') {
      const bodies = [result?.structuredContent];
      for (const block of result?.content ?? []) {
        if (block.type === 'text') { try { bodies.push(JSON.parse(block.text)); } catch { /* Plain prose has no job identity. */ } }
      }
      for (const body of bodies) {
        const id = body?.job_id ?? body?.data?.job_id;
        if (typeof id === 'string') {
          const jobs = this.jobs.get(id) ?? new Set(); jobs.add(expectedRegion); this.jobs.set(id, jobs);
        }
```

</details>

**依据 4 · 源码核查**：[references/3chat-customer-growth-1.0.4/skills/3chat-customer-growth/SKILL.md:39-43](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/references/3chat-customer-growth-1.0.4/skills/3chat-customer-growth/SKILL.md#L39-L43)

确认/幂等与送达状态边界。

```text
4. Drafting, analysis, and audience selection do not authorize sending. Before any send, show the exact recipients, sender account or channel, final content, attachments, and scope, then obtain explicit confirmation.
5. Use an existing final HTTP/HTTPS download URL only when it needs no authentication or custom headers and is neither a preview page nor redirect-only link. Otherwise call `upload_3chat_attachment` and prefer reusing the complete `data.attachment` object.
6. After a batch returns `job_id`, call only `get_3chat_batch_send_status` for that job; never recreate the batch.
7. Follow structured error fields and `aiAction`. Retry a send with identical business parameters and the original idempotency key only for `RETRY_SAME_REQUEST`.
8. Do not expose raw JSON by default. Separate 3Chat facts from model inference, and never equate `accepted`, `sent`, or `COMPLETED` with channel delivery or read status.
```

#### 缺口

- 没有人工3Chat门户与DSH同客户任务的耗时、误发、转化与费用对照。
  **影响**：不能量化收益或保证商业效果。
  **进一步探讨**：用授权匿名测试业务集比较目标/内容正确、操作数、请求量和状态恢复，不触达真实客户。
- 持久内容确认和跨会话操作收据未实现。
  **影响**：不作为当前exactly-once或提高评分。
  **进一步探讨**：模拟丢响应/重启对照重复dispatch与unknown收敛。

[返回分类](../../views/categories/CUSTOMER-SERVICE.md) · [返回首页](../../../README.md)
