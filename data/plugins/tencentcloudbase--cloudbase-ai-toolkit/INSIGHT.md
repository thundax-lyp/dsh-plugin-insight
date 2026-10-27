# CloudBase AI Toolkit

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c4ab728](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/tree/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92)

<!-- BEGIN META -->
[![GitHub ★ 1,150](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C150&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit)
<!-- END META -->

> **功能**：以 MCP、场景 Skill 和 IDE 插件把 CloudBase 数据库、存储、函数与部署接入 AI 编码工具。

> **亮点**：把场景知识、MCP真实云操作及宿主接线组织为统一开发入口，减少只写代码后手工切控制台；云后端不属该集成原创。[Q01](#research-q01)

> **主要限制**：确认是兼容性软护栏，unsupported/skip可放行，快速无内容decline默认也可放行；凭证形态检查不认证真实授权，不能当生产删除边界。[Q03](#research-q03)

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
  - [Q01 · Toolkit根项目相对云控制台和单独Skill增加什么？](#detail-section-11)
  - [Q02 · 敏感操作确认实际接在执行链哪一层？](#detail-section-12)
  - [Q03 · “删除会暂停确认”是否是不可绕过的安全边界？](#detail-section-13)
  - [Q04 · 谁可在什么条件下试用，不应先做什么？](#detail-section-14)
  - [Q05 · 怎样验证能力不足时也不会静默执行删除？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：CloudBase应用开发者需要从代码继续管理后端；目标是正确环境中真实资源可验收。[Q01](#research-q01)

CloudBase控制台、直接SDK或独立Skill；根整合真实工具及方法，不能取代使用者判断。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| MCP云工具 | 数据和应用后端操作 | 实际账号环境/IAM |
| 场景Skill/插件 | 工作方法与IDE接线 | 不同宿主独立版本 |
| 软确认 | 敏感参数/删除提醒 | 不支持表单可能放行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| MCP客户端与Node | 本地执行必需 | 运行工具包 | 固定实际发行物 |
| CloudBase账号/环境/IAM | 云操作必需 | 目标与权限 | 先只读核控制台 |
| form elicitation | 弹确认才需 | 用户选择 | unsupported会放行需策略 |
| 备份与资源预算 | 写前必需 | 恢复与费用 | 不可只靠软护栏 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 用户固定MCP和测试环境 | IAM范围清楚 |
| 查询 | Agent只读环境/结构 | 对照控制台一致 |
| 检查 | 用户核form与取消 | unsupported不当严格审批 |
| 决策 | 需敏感操作先备份和审IAM | 状态未知回控制台 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 客户端/Node和云测试环境 | 登录、IAM、环境和MCP接线 | 版本与权限需固定 |
| 持续使用 | 云资源、模型和网络 | 审敏感参数、升级和结果 | 金额/耗时未知 |
| 失败恢复 | 重试、备份和云回滚 | 对照控制台真实资源 | 软确认不是恢复机制 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 云能力接入 | MCP工具组和统一wrapper | 应用真正可用 |
| 敏感提醒 | 能力相关soft guard | 真人授权与全部覆盖 |
| 托管请求 | 独立server/transport生命周期 | 外层身份全链安全 |

> **思考**：确认是兼容性软护栏，unsupported/skip可放行，快速无内容decline默认也可放行；凭证形态检查不认证真实授权，不能当生产删除边界。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把场景知识、MCP真实云操作及宿主接线组织为统一开发入口，减少只写代码后手工切控制台；云后端不属该集成原创。[Q01](#research-q01)

统一handler护栏、明确未执行回执和逐请求transport值得借鉴；需同步清楚兼容放行取舍，不拿UI确认代IAM。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

确认是兼容性软护栏，unsupported/skip可放行，快速无内容decline默认也可放行；凭证形态检查不认证真实授权，不能当生产删除边界。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议已有测试环境的开发者固定MCP后限定只读查询试用；未核客户端确认/IAM/环境前不生产删除，状态不明退控制台。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

MCP注册、统一guard与请求生命周期有源码支持；全部动作/IAM/客户端确认真实性和云恢复未执行验证。严格模式为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、mcp/package.json、mcp/src/server.ts、mcp/src/utils/tool-wrapper.ts、mcp/src/utils/confirmation-guard.ts、mcp/src/utils/credential-guard.ts、mcp/src/hosted/handle-hosted-mcp-request.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根README/manifest、MCP子包注册、wrapper/两个guard和hosted请求；未审全部工具/SDK/IAM或实际云部署，未跑测试/目标代码。
- 下一步：五类客户端确认情形与隔离云环境，记录handler次数、授权绑定、资源恢复和全成本；本轮未执行。[Q05](#research-q05)

**分析版本**

- **仓库**：[TencentCloudBase/CloudBase-AI-Toolkit](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit)
- **版本号**：1.7.3（[固定提交 c4ab728](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/tree/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是严格模式将环境/资源摘要与一次授权绑定，能力不足拒绝敏感动作，并衡量CI误阻及人工成本。[Q05](#research-q05)

五类客户端确认情形与隔离云环境，记录handler次数、授权绑定、资源恢复和全成本；本轮未执行。[Q05](#research-q05)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1014 | 174294 | — | — | 1214994 |
| .tsx | source | 88 | 16316 | 15091 | 804 | — |
| .ts | source | 214 | 69457 | 58405 | 6613 | — |
| .mjs | source | 106 | 24134 | 18607 | 2958 | — |
| .cjs | source | 14 | 2192 | 1720 | 272 | — |
| .ts | example | 10 | 1337 | 1033 | 153 | — |
| .ts | test | 112 | 41434 | 35973 | 1425 | — |
| .md | example | 2 | 397 | — | — | 2502 |
| .js | source | 6 | 643 | 515 | 40 | — |
| .tsx | test | 3 | 487 | 452 | 2 | — |
| .js | test | 62 | 12142 | 9887 | 747 | — |
| .js | example | 1 | 7 | 7 | 0 | — |
| .mjs | test | 13 | 2135 | 1785 | 129 | — |
| .md | test | 1 | 76 | — | — | 480 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：CloudBase工具接入层怎样组织真实云操作，软确认与托管请求隔离的证据边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Toolkit根项目相对云控制台和单独Skill增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是用AI编码工具开发CloudBase应用的开发者，需要生成代码后继续处理数据库、权限、存储、函数与部署。根项目将MCP源码、场景Skill和各IDE插件源组织成工具接入层；Skill给工作方法，MCP真正调云能力，插件减少接线。相对只给提示词，它提供真实操作入口；相对控制台，减少切换但必须仍由用户判断环境、权限与敏感动作。合格结果是目标环境中应用/数据行为被验收，不是工具返回success或部署URL。云后端由CloudBase提供，根清单1.7.3、MCP子包2.36.1、DSH子包0.2.3是不同组件版本，不能混称同版。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:65-83](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/README.md#L65-L83)

作者分Plugin/Skill/MCP职责与用户判断边界。

<details>
<summary>查看原文（19行）</summary>

```text

This repository ships the npm package `@cloudbase/cloudbase-mcp`, Skills, and AI plugins.

You still need your own CloudBase environment, and you should confirm sensitive actions the AI proposes. The Toolkit provides capability and path—not judgment.

### Related repositories

Publishing and sync repos live under [TencentCloudBase](https://github.com/TencentCloudBase). Directly related to this Toolkit:

| Repository | Contents | Typical entry |
|------|------|----------|
| [CloudBase-AI-Toolkit](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit) (this repo) | MCP Server source; marketplace source for Claude Code / Codex | `npx @cloudbase/cloudbase-mcp@latest` |
| [dsh-plugin](./dsh-plugin) | DeepSeek Harness plugin (`@cloudbase/dsh-plugin`): MCP bridge + DB/Storage/Auth panel | `dsh plugin add @cloudbase/dsh-plugin` |
| [cloudbase-plugin](https://github.com/TencentCloudBase/cloudbase-plugin) | Open Plugin Spec publish repo (CI-synced): MCP + Skills + Hooks | `npx plugins add TencentCloudBase/cloudbase-plugin` · CNB fallback: `npx plugins add https://cnb.cool/tencent/cloud/cloudbase/cloudbase-plugin.git` |
| [cloudbase-sites-plugin](https://github.com/TencentCloudBase/cloudbase-sites-plugin) | Sites plugin: Vite Web create & deploy | `npx plugins add TencentCloudBase/cloudbase-sites-plugin` · CNB: `https://cnb.cool/tencent/cloud/cloudbase/cloudbase-sites-plugin.git` |
| [cloudbase-skills](https://github.com/TencentCloudBase/cloudbase-skills) | Agent Skills collection | `npx skills add TencentCloudBase/cloudbase-skills` · CNB: `https://cnb.cool/tencent/cloud/cloudbase/cloudbase-skills.git` |
| [skills](https://github.com/TencentCloudBase/skills) | Per-skill install catalog (also on [skills.sh](https://skills.sh)) | `npx skills add tencentcloudbase/skills --skill <name>` |
| [awesome-cloudbase-examples](https://github.com/TencentCloudBase/awesome-cloudbase-examples) | CloudBase examples and case studies | Browse / clone examples |
| [OpenVibeCoding](https://github.com/TencentCloudBase/OpenVibeCoding) | Vibecoding template on CloudBase | Use as a project starter |
```

</details>

**依据 2 · 作者声明**：[README.md:88-99](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/README.md#L88-L99)

相关仓库和DSH子组件区分。

<details>
<summary>查看原文（12行）</summary>

````text

### Fastest way to get started

Copy this AI prompt into your AI IDE. The agent reads `skill.md` and completes the setup:

```
Set up CloudBase for me:
1. Open https://docs.cloudbase.net/skill.md and complete the setup following its instructions.
2. Tell me when you're done, and suggest the most relevant next step.
```

<details>
````

</details>

**依据 3 · 源码核查**：[mcp/package.json:1-12](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/mcp/package.json#L1-L12)

实际MCP包版本与入口。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "@cloudbase/cloudbase-mcp",
  "version": "2.36.1",
  "mcpName": "io.github.TencentCloudBase/cloudbase-mcp",
  "packageManager": "pnpm@10.8.0",
  "description": "CloudBase MCP Server — operate Tencent CloudBase (database, auth, functions, storage, hosting) from AI coding tools via the Model Context Protocol. Part of CloudBase AI Toolkit.",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "type": "module",
  "bin": {
    "cloudbase-mcp": "dist/cli.cjs"
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 敏感操作确认实际接在执行链哪一层？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

MCP server按插件组注册数据库、环境、函数、存储和部署工具，tool-wrapper是统一handler包装点；它先做凭证形态软确认，再做破坏性动作确认，intercept时直接返回，只有放行才执行handler。破坏性识别由动作表决定，因此不是全部工具任意写入都二次确认。托管handle每请求新建server/transport并在结束关闭，无状态MCP传输避免混用同一transport；身份和环境仍由传入serverOptions及外层认证负责，不能只凭request scoped就认定全租户安全。可借鉴统一包装与正常“未执行”结果减少模型重试，但需明确success统计与资源副作用不是一回事。

#### 证据与依据

**依据 1 · 源码核查**：[mcp/src/server.ts:1-25](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/mcp/src/server.ts#L1-L25)

具体注册工具域。

<details>
<summary>查看原文（25行）</summary>

```text
import { McpServer, type RegisteredTool } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerDatabaseTools } from "./tools/databaseNoSQL.js";
import { registerPGDatabaseTools } from "./tools/databasePG.js";
import { registerSQLDatabaseTools } from "./tools/databaseSQL.js";
import { registerEnvTools } from "./tools/env.js";
import { registerFunctionTools } from "./tools/functions.js";
import { registerHostingTools } from "./tools/hosting.js";
import { registerRagTools } from "./tools/rag.js";
import { registerSetupTools } from "./tools/setup.js";
import { registerPGStorageTools } from "./tools/storagePG.js";
import { registerStorageTools } from "./tools/storage.js";
// import { registerMiniprogramTools } from "./tools/miniprogram.js";
import { SetLevelRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { registerCapiTools } from "./tools/capi.js";
import { registerCloudRunTools } from "./tools/cloudrun.js";
import { registerDeployTools } from "./tools/deploy.js";
import { registerDataModelTools } from "./tools/dataModel.js";
import { registerGatewayTools } from "./tools/gateway.js";
import { registerAgentTools } from "./tools/agents.js";
import { registerAppAuthTools } from "./tools/app-auth.js";
import { registerAppTools } from "./tools/apps.js";
import { registerLogTools } from "./tools/logs.js";
import { registerPermissionTools } from "./tools/permissions.js";
import { registerMsgPushTools } from "./tools/msg-push.js";
import { registerFeedbackTools } from "./tools/feedback.js";
```

</details>

**依据 2 · 源码核查**：[mcp/src/utils/tool-wrapper.ts:220-246](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/mcp/src/utils/tool-wrapper.ts#L220-L246)

两个guard先于handler执行。

<details>
<summary>查看原文（27行）</summary>

```text
            // 凭证形态入参的执行前**软确认**（先于破坏性确认）。参数里扫到凭证形态字符串时，
            // 要求客户端拿这串与它自己那份原始来源比对确认；未通过则不执行，直接返回说明文本。
            // 与破坏性确认同一取舍：这是"正常返回"而不是错误（详见 credential-guard.ts）。
            const credentialDecision = await guardCredentialWrite(server as unknown as CredentialGuardServer, {
                toolName: name,
                args,
                extra: extra as { requestId?: any },
            });
            if (credentialDecision.intercept) {
                success = true;
                return credentialDecision.result;
            }

            // 破坏性动作的执行前确认（护栏）。命中且未确认时不执行，直接返回说明文本：
            // 这是"正常返回"而不是错误（详见 confirmation-guard.ts 的取舍说明）。
            const guardDecision = await guardDestructiveAction(server as unknown as ConfirmationServer, {
                toolName: name,
                args,
                extra: extra as { requestId?: any },
            });
            if (guardDecision.intercept) {
                success = true;
                return guardDecision.result;
            }

            // 执行原始处理函数（extra 一并透传，工具可据此拿到在途请求 id）
            const result = await handler(args, extra);
```

</details>

**依据 3 · 源码核查**：[mcp/src/hosted/handle-hosted-mcp-request.ts:133-174](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/mcp/src/hosted/handle-hosted-mcp-request.ts#L133-L174)

逐请求实例和关闭生命周期。

<details>
<summary>查看原文（42行）</summary>

```text
  let server: Awaited<ReturnType<typeof createCloudBaseMcpServer>> | undefined;
  let transport: StreamableHTTPServerTransport | undefined;
  const startedAt = Date.now();

  const closeBoth = () => {
    void Promise.allSettled([transport?.close(), server?.close()]);
  };

  try {
    server = await createCloudBaseMcpServer({
      name: input.serverOptions.name,
      version: input.serverOptions.version,
      enableTelemetry: input.serverOptions.enableTelemetry,
      cloudBaseOptions: input.serverOptions.cloudBaseOptions,
      cloudMode: input.serverOptions.cloudMode ?? true,
      ide: input.serverOptions.ide,
      client: input.serverOptions.client,
      clientInfo,
      // 会话级遥测的身份来源：把**当前** transport 的 sessionId 交给 server（公开 getter）。
      // 这里是无状态传输（本文件 `:165` `sessionIdGenerator: undefined`）⇒ 今天它恒为 undefined、
      // 上报按"一个实例一个会话"计；将来若有状态化，sessionId 会自动出现在这里。
      getSessionId: () => transport?.sessionId,
      lang: input.serverOptions.lang,
      pluginsEnabled: input.serverOptions.pluginsEnabled,
      pluginsDisabled: input.serverOptions.pluginsDisabled,
    });
    input.logger?.({
      type: "cloudbase-mcp-server-create",
      timeCost: Date.now() - startedAt,
    });

    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    input.res.on("close", closeBoth);
    input.req.on("aborted", closeBoth);

    await server.connect(transport);
    await transport.handleRequest(input.req, input.res, input.body);
  } catch (error) {
    await Promise.allSettled([transport?.close(), server?.close()]);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “删除会暂停确认”是否是不可绕过的安全边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

不是。confirmation-guard明确定位护栏，客户端未声明form时返回intercept:false/unsupported，命中skip清单也放行；快速无内容decline且默认allow也可视为自动批准，但真正表单取消仍拦截，不能误写成所有快速取消都被忽略。凭证guard只识别JWT/cb密钥形态、有限深度与数组，且不支持form也放行，不验证凭证是否真实或最小权限。因此README“敏感动作需确认”必须带客户端能力和配置条件，不能作为生产删除防线；真正云IAM、备份和审批责任还在使用者。未发现所有写工具覆盖证据，不能把本轮抽读变为全面安全审计。

#### 证据与依据

**依据 1 · 源码核查**：[mcp/src/utils/confirmation-guard.ts:159-183](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/mcp/src/utils/confirmation-guard.ts#L159-L183)

skip/不支持form放行。

<details>
<summary>查看原文（25行）</summary>

```text
    const resolved = resolveDestructiveAction(params.toolName, params.args);
    if (!resolved) {
        return { intercept: false, status: "not_applicable" };
    }
    const { key, spec } = resolved;

    if (isSkipped(key)) {
        debug("破坏性动作命中跳过清单，按不确认执行", { tool: params.toolName, action: key });
        return { intercept: false, status: "skipped" };
    }

    // 客户端没声明 form 能力 ⇒ 不弹、照常执行（绝不阻塞）。
    // 能力读取本身异常时同样按"不支持"处理：这时候也没法弹，但绝不能因此让工具调用失败。
    let formCapable = false;
    try {
        formCapable = isFormElicitationSupported(server);
    } catch (error) {
        debug("读取 elicitation 能力失败，按不支持处理", {
            tool: params.toolName,
            error: error instanceof Error ? error.message : String(error),
        });
    }
    if (!formCapable) {
        return { intercept: false, status: "unsupported" };
    }
```

</details>

**依据 2 · 源码核查**：[mcp/src/utils/confirmation-guard.ts:243-269](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/mcp/src/utils/confirmation-guard.ts#L243-L269)

真正取消拦截与快速decline策略。

<details>
<summary>查看原文（27行）</summary>

```text
    // 客户端**填了表单**却选了取消 ⇒ 按取消处理。回得再快也不改变"它明确回了取消"这件事。
    if (outcome.status === "accepted") {
        return block("cancelled", { durationMs: outcome.durationMs, reason: "form_returned_cancel_option" });
    }

    // 只有"没带内容的 decline/cancel"才适用"即时应答＝客户端处于不询问模式"这条规则
    if (outcome.status === "declined") {
        const instant = outcome.durationMs < AUTO_ANSWER_THRESHOLD_MS;
        if (instant && readAutoApprovePolicy() === "allow") {
            debug("客户端自行应答，按未询问放行", {
                tool: params.toolName,
                action: key,
                durationMs: outcome.durationMs,
            });
            return { intercept: false, status: "auto_approved" };
        }
        return instant
            ? block("auto_approved_blocked", { durationMs: outcome.durationMs })
            : block("cancelled", { durationMs: outcome.durationMs, reason: outcome.reason });
    }

    if (outcome.status === "timeout") {
        return block("timeout", { seconds: Math.round(CONFIRMATION_TIMEOUT_MS / 1000) });
    }

    // 其余（error / 回值不在选项内 / elicitInput 不可用）一律不放行
    return block("error", { reason: outcome.reason ?? "unknown" });
```

</details>

**依据 3 · 源码核查**：[mcp/src/utils/credential-guard.ts:17-39](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/mcp/src/utils/credential-guard.ts#L17-L39)

软确认、unsupported与模式扫描限制。

<details>
<summary>查看原文（23行）</summary>

```text
 * 三条设计取舍：
 *   1. **零网络**：本模块不发任何网络请求，只做本地浅扫描 + 走既有 elicitation 通道。
 *   2. **消息里不放明文**：只给长度、分段长度、指纹（sha256 前 12 位）。这三样同样是凭证派生数据，
 *      **不得进日志/遥测**。
 *   3. **秒回一律不算"人的核对"**：`< AUTO_ANSWER_THRESHOLD_MS` 的应答 ⇒ 不写。⚠️ 这与 #1153
 *      的默认语义相反（那边把秒回当"客户端替你放行"）——凭证场景里秒回在物理上不可能包含任何
 *      人工比对动作，所以必须翻过来。
 *   4. **客户端不支持表单 elicitation ⇒ 放行**（软设计不许把普通用户整个封死；#1153 的 P0 就是
 *      栽在"拦死"这一类上）。
 */

/** 跳过清单的环境变量名（与 #1153 的清单同形：逗号分隔、`工具名` 或 `工具名.action`、区分大小写、无通配） */
export const CREDENTIAL_GUARD_SKIP_ENV_NAME = "CLOUDBASE_MCP_SKIP_CREDENTIAL_GUARD";

/** 扫描上限：只扫字符串值，避免大参数树拖慢 */
const MAX_DEPTH = 8;
const MAX_ARRAY_ITEMS = 500;

/** 三段式凭证（JWT）：`header.payload.signature`，三段均为 base64url */
const JWT_PATTERN = /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

/** 不透明密钥形态：`cb_secret_…` / `cb_publishable_…` */
const OPAQUE_KEY_PATTERN = /^cb_(secret|publishable)_[A-Za-z0-9_-]+$/;
```

</details>

#### 缺口

- 动作识别覆盖、客户端elicitation真实性和外层托管权限全链未验收。
  **影响**：不能承诺所有破坏性调用都获得真人确认。
  **进一步探讨**：固定支持/不支持表单客户端与skip/auto策略，模拟无副作用动作并检查handler次数。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁可在什么条件下试用，不应先做什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

已有CloudBase测试环境和可审IAM权限的开发者，可先固定MCP发行物做环境/日志/表结构只读查询，再手动核对云控制台。首次需AI客户端、Node/包运行时、账号/环境与OAuth或适用凭据，Skill/插件接线由具体宿主决定；不能把根仓库直接当DSH bundle安装。持续成本是云资源、模型/网络、权限和工具升级，失败恢复要核真实资源状态、重试与备份，当前金额/时间未知。确认链不支持或环境/权限不明时停止写入并回控制台，敏感生产删除不能只靠软确认。限定只读trial而非install，未实际部署、删除或宿主验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:74-83](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/README.md#L74-L83)

上游资源与用户敏感判断。

<details>
<summary>查看原文（10行）</summary>

```text
| Repository | Contents | Typical entry |
|------|------|----------|
| [CloudBase-AI-Toolkit](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit) (this repo) | MCP Server source; marketplace source for Claude Code / Codex | `npx @cloudbase/cloudbase-mcp@latest` |
| [dsh-plugin](./dsh-plugin) | DeepSeek Harness plugin (`@cloudbase/dsh-plugin`): MCP bridge + DB/Storage/Auth panel | `dsh plugin add @cloudbase/dsh-plugin` |
| [cloudbase-plugin](https://github.com/TencentCloudBase/cloudbase-plugin) | Open Plugin Spec publish repo (CI-synced): MCP + Skills + Hooks | `npx plugins add TencentCloudBase/cloudbase-plugin` · CNB fallback: `npx plugins add https://cnb.cool/tencent/cloud/cloudbase/cloudbase-plugin.git` |
| [cloudbase-sites-plugin](https://github.com/TencentCloudBase/cloudbase-sites-plugin) | Sites plugin: Vite Web create & deploy | `npx plugins add TencentCloudBase/cloudbase-sites-plugin` · CNB: `https://cnb.cool/tencent/cloud/cloudbase/cloudbase-sites-plugin.git` |
| [cloudbase-skills](https://github.com/TencentCloudBase/cloudbase-skills) | Agent Skills collection | `npx skills add TencentCloudBase/cloudbase-skills` · CNB: `https://cnb.cool/tencent/cloud/cloudbase/cloudbase-skills.git` |
| [skills](https://github.com/TencentCloudBase/skills) | Per-skill install catalog (also on [skills.sh](https://skills.sh)) | `npx skills add tencentcloudbase/skills --skill <name>` |
| [awesome-cloudbase-examples](https://github.com/TencentCloudBase/awesome-cloudbase-examples) | CloudBase examples and case studies | Browse / clone examples |
| [OpenVibeCoding](https://github.com/TencentCloudBase/OpenVibeCoding) | Vibecoding template on CloudBase | Use as a project starter |
```

</details>

**依据 2 · 源码核查**：[mcp/package.json:1-12](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/mcp/package.json#L1-L12)

MCP是实际执行入口，不是根manifest。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "@cloudbase/cloudbase-mcp",
  "version": "2.36.1",
  "mcpName": "io.github.TencentCloudBase/cloudbase-mcp",
  "packageManager": "pnpm@10.8.0",
  "description": "CloudBase MCP Server — operate Tencent CloudBase (database, auth, functions, storage, hosting) from AI coding tools via the Model Context Protocol. Part of CloudBase AI Toolkit.",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "type": "module",
  "bin": {
    "cloudbase-mcp": "dist/cli.cjs"
```

</details>

**依据 3 · 源码核查**：[mcp/src/utils/confirmation-guard.ts:170-183](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/mcp/src/utils/confirmation-guard.ts#L170-L183)

客户端能力直接影响采用边界。

<details>
<summary>查看原文（14行）</summary>

```text
    // 客户端没声明 form 能力 ⇒ 不弹、照常执行（绝不阻塞）。
    // 能力读取本身异常时同样按"不支持"处理：这时候也没法弹，但绝不能因此让工具调用失败。
    let formCapable = false;
    try {
        formCapable = isFormElicitationSupported(server);
    } catch (error) {
        debug("读取 elicitation 能力失败，按不支持处理", {
            tool: params.toolName,
            error: error instanceof Error ? error.message : String(error),
        });
    }
    if (!formCapable) {
        return { intercept: false, status: "unsupported" };
    }
```

</details>

#### 缺口

- 当前云费用、账号权限、安装/退出与回滚没有实际记录。
  **影响**：无法给全周期成本或持续采用保证。
  **进一步探讨**：隔离环境记录实际版本、读写恢复、全部调用与资源费用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证能力不足时也不会静默执行删除？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是提供明确严格模式：无表单能力或自动应答时默认拒绝敏感动作，并把env、资源、参数摘要和一次授权绑定后再执行。由Q03为兼容而放行的取舍推导，相对当前软护栏增加了安全部署可选择的执行前提，同时可能阻塞无交互CI，必须留显式可审替代授权。最小验证对支持form、unsupported、快速decline、真正cancel和重发五情形，比较默认与严格原型的未授权handler次数、误阻和人工操作。若缺授权仍执行或重发复用到不同资源，否定保证；尚无真实用户成本/采用结果，不把原型记成当前功能。

#### 证据与依据

**依据 1 · 源码核查**：[mcp/src/utils/confirmation-guard.ts:170-183](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/mcp/src/utils/confirmation-guard.ts#L170-L183)

不支持表单放行是严格模式动因。

<details>
<summary>查看原文（14行）</summary>

```text
    // 客户端没声明 form 能力 ⇒ 不弹、照常执行（绝不阻塞）。
    // 能力读取本身异常时同样按"不支持"处理：这时候也没法弹，但绝不能因此让工具调用失败。
    let formCapable = false;
    try {
        formCapable = isFormElicitationSupported(server);
    } catch (error) {
        debug("读取 elicitation 能力失败，按不支持处理", {
            tool: params.toolName,
            error: error instanceof Error ? error.message : String(error),
        });
    }
    if (!formCapable) {
        return { intercept: false, status: "unsupported" };
    }
```

</details>

**依据 2 · 源码核查**：[mcp/src/utils/tool-wrapper.ts:233-246](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/mcp/src/utils/tool-wrapper.ts#L233-L246)

guard是可约束handler的具体接线点。

<details>
<summary>查看原文（14行）</summary>

```text
            // 破坏性动作的执行前确认（护栏）。命中且未确认时不执行，直接返回说明文本：
            // 这是"正常返回"而不是错误（详见 confirmation-guard.ts 的取舍说明）。
            const guardDecision = await guardDestructiveAction(server as unknown as ConfirmationServer, {
                toolName: name,
                args,
                extra: extra as { requestId?: any },
            });
            if (guardDecision.intercept) {
                success = true;
                return guardDecision.result;
            }

            // 执行原始处理函数（extra 一并透传，工具可据此拿到在途请求 id）
            const result = await handler(args, extra);
```

</details>

#### 缺口

- 严格模式对CI兼容和误阻成本未知。
  **影响**：需要验证而非直接产品化结论。
  **进一步探讨**：固定五种客户端情形和资源摘要，检查handler和授权复用。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
