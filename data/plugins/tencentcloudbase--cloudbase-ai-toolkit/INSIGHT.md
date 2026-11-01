# CloudBase AI Toolkit

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[cc00d1c](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/tree/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8)

<!-- BEGIN META -->
[![GitHub ★ 1,153](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C153&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit)
<!-- END META -->

> **功能**：通过 MCP 和 Skill 将 CloudBase 开发与资源管理接入 Agent。

> **亮点**：[Q02](#research-q02) 将云资源工具与确认逻辑接入 MCP；不等于云资源本身创新或全部动作被保护。

> **主要限制**：[Q03](#research-q03) 客户端缺 form 能力或命中 skip 时 guard 不拦截，默认 auto-approve 策略为 allow；不能当作无条件确认。

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
  - [Q01 · 谁需要云开发工具包，相比控制台和 SDK 有什么变化？](#detail-section-11)
  - [Q02 · 工具如何在处理前接入确认？](#detail-section-12)
  - [Q03 · 客户端没有确认能力时是否阻止删除？](#detail-section-13)
  - [Q04 · 云权限、费用和退出怎么控制？](#detail-section-14)
  - [Q05 · 如何避免能力不足时静默执行删除？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要在云开发工作流中操作 CloudBase 资源的开发者。

控制台、CLI 和 SDK 已能管理资源；Agent 接入统一工具调用，但权限和确认仍需独立判断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 云资源工具 | 操作 CloudBase | 真实资源需授权 |
| 破坏确认 | 检查列举动作 | 无 form 可放行 |
| 凭据 guard | 检查凭据形态输入 | 不替代 IAM |
| Skill | 引导开发流程 | 不证明部署结果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| MCP 客户端与服务 | 必需 | 调用工具 | 不可用 |
| CloudBase 账号环境 | 云操作需要 | 管理资源 | 操作失败 |
| 用户授权与权限 | 写入必需 | 限定资源 | 不执行 |
| form elicitation | guard 弹确认需要 | 提示用户 | 当前实现可放行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户创建隔离环境 | 不具生产权限 |
| 接入 | 用户核对客户端和身份 | 确认目标和能力 |
| 调用 | Agent 先试只读工具 | 核查实际云资源 |
| 写入 | 用户授权并核对动作 | 不依赖缺失确认 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | 云账号与服务 | 配置环境 | 未测 |
| 持续 | 云资源和模型费用 | 核查 IAM 与目标 | 金额未知 |
| 失败 | 云资源副作用 | 独立恢复 | 删除可能不可逆 |
| 退出 | 云资源和凭据 | 撤权并核对资源 | 不自动撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| MCP 接入 | 工具注册与包装 | 真实云任务成功 |
| 确认 | 支持表单时可拦截 | 无能力时不会执行 |
| 管理 | 列举云资源动作 | 成本与恢复 |

> **思考**：[Q03](#research-q03) 客户端缺 form 能力或命中 skip 时 guard 不拦截，默认 auto-approve 策略为 allow；不能当作无条件确认。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将云资源工具与确认逻辑接入 MCP；不等于云资源本身创新或全部动作被保护。

[Q03](#research-q03) unsupported 和 skip 均不拦截；能弹表单时取消或错误可阻止。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 客户端缺 form 能力或命中 skip 时 guard 不拦截，默认 auto-approve 策略为 allow；不能当作无条件确认。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用隔离、最小权限环境核查；生产写入须明确授权。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根 MCP 源码静态核查；未运行云账户、真实删除或宿主。

- 已检查：作者 README、包清单、源码路径 README.md、mcp/src/server.ts、mcp/src/utils/tool-wrapper.ts、mcp/src/utils/confirmation-guard.ts、mcp/src/utils/destructive-actions.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根 MCP 源码静态核查代表注册、破坏动作和 guard；未运行云资源或宿主。
- 下一步：使用模拟 handler 验证无 form、skip、自动应答和拒绝，不触碰真实资源。

**分析版本**

- **仓库**：[TencentCloudBase/CloudBase-AI-Toolkit](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit)
- **版本号**：1.7.3（[固定提交 cc00d1c](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/tree/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 建议无确认能力时返回未执行并提供显式确认路径，须测自动化兼容及用户既有授权。

使用模拟 handler 验证无 form、skip、自动应答和拒绝，不触碰真实资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1449 | 251760 | — | — | 1754377 |
| .tsx | source | 88 | 16288 | 15056 | 809 | — |
| .ts | source | 217 | 70378 | 59055 | 6803 | — |
| .mjs | source | 140 | 29973 | 23233 | 3534 | — |
| .cjs | source | 14 | 2192 | 1720 | 272 | — |
| .ts | example | 2 | 579 | 457 | 55 | — |
| .ts | test | 119 | 43491 | 37587 | 1620 | — |
| .mjs | example | 3 | 363 | 255 | 67 | — |
| .md | example | 1 | 89 | — | — | 853 |
| .js | source | 6 | 643 | 515 | 40 | — |
| .tsx | test | 3 | 487 | 452 | 2 | — |
| .js | test | 62 | 12178 | 9912 | 755 | — |
| .js | example | 1 | 7 | 7 | 0 | — |
| .mjs | test | 13 | 2135 | 1785 | 129 | — |
| .md | test | 1 | 76 | — | — | 480 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根 MCP 工具注册及破坏操作确认的能力降级。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要云开发工具包，相比控制台和 SDK 有什么变化？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向使用 CloudBase 的应用开发者，提供 MCP 工具、Skill 和客户端接入以操作云资源。控制台、SDK 和 CLI 已可完成部署和数据管理；根项目增量是将工具及工作流接到 Agent，不是新云资源或自动证明部署正确。资源环境、账号权限与费用需使用者判断，根平台中各宿主适配不应被当成同一运行证明。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:100-126](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/README.md#L100-L126)

作者描述插件和 MCP 接入方式。

<details>
<summary>查看原文（27行）</summary>

````text
<summary>Pick one default path for your tool (Plugin / MCP)</summary>

| Your tool | Suggested path |
|----------|----------|
| Claude Code / Codex (native marketplace) | Add this repo as marketplace, then install the `cloudbase` plugin ([plugin docs](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ai-agent-plugins)) |
| Open Plugin Spec tools | `npx plugins add TencentCloudBase/cloudbase-plugin` |
| CodeBuddy / WorkBuddy / Doubao / MiniMax Code / DeepSeek Harness / ZCode / Kimi (built-in) | Use the IDE's built-in CloudBase plugin or connector; for CodeBuddy you can also [install via plugin marketplace](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ide-setup/codebuddy) |
| Other MCP-capable IDEs | MCP config only (below) |

> Already using CloudBase CLI? `tcb ai` sets up MCP and Skills too ([docs](https://docs.cloudbase.net/cli-v1/ai/introduce)).

#### Plugin

```bash
npx plugins add TencentCloudBase/cloudbase-plugin
```

Details and IDE differences: [AI plugin docs](https://docs.cloudbase.net/ai/cloudbase-ai-toolkit/ai-agent-plugins).

#### MCP only

```json
{
  "mcpServers": {
    "cloudbase": {
      "command": "npx",
      "args": ["@cloudbase/cloudbase-mcp@latest"]
````

</details>

**依据 2 · 源码核查**：[mcp/src/server.ts:277-310](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/mcp/src/server.ts#L277-L310)

根 MCP server 创建入口。

<details>
<summary>查看原文（34行）</summary>

```text
export async function createCloudBaseMcpServer(options?: {
  name?: string;
  version?: string;
  enableTelemetry?: boolean;
  cloudBaseOptions?: CloudBaseOptions;
  authOptions?: AuthOptions;
  cloudMode?: boolean;
  ide?: string;
  client?: string;
  /**
   * Client name/version to report when the MCP handshake clientInfo is empty.
   * Metadata only. Hosted requests pass the value remembered for this credential.
   */
  clientInfo?: { name: string; version?: string };
  /**
   * 会话标识的取值入口（**调用点注入**，可选）。
   *
   * 有状态 HTTP / 托管路径把当前 transport 的 `sessionId` 传进来（那是公开 getter）；
   * stdio、以及无状态托管（`sessionIdGenerator: undefined`）没有会话概念 ⇒ **不注入**，
   * 会话级上报回落到常量，等价于"这个实例就是一个会话"。
   * 只有会话级遥测用得到它；不注入时行为与"每实例一条"完全一致。
   */
  getSessionId?: () => string | undefined;
  logger?: Logger;
  pluginsEnabled?: string[];
  pluginsDisabled?: string[];
  pluginOptions?: PluginOptions;
  /**
   * 实例输出语言（zh/en）。解析链：本参数 > TCB_LANG 环境变量
   * > `.cloudbase/project.json` 的 lang > 默认 zh。
   * 影响：工具 description / title 里的词典 key 按本语言解析 + 工具输出文案默认语言。
   */
  lang?: Lang | string;
}): Promise<ExtendedMcpServer> {
```

</details>

**依据 3 · 源码核查**：[mcp/src/utils/destructive-actions.ts:235-253](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/mcp/src/utils/destructive-actions.ts#L235-L253)

代表性删除动作。

<details>
<summary>查看原文（19行）</summary>

```text
    "manageFunctions.deleteFunction": {
        messageKey: "confirmation.message.deleteFunction",
        target: (args) => ({ resource: asText(args.functionName) }),
    },
    "writeNoSqlDatabaseStructure.deleteCollection": {
        messageKey: "confirmation.message.deleteCollection",
        target: (args) => ({ resource: asText(args.collectionName) }),
    },
    "writeNoSqlDatabaseContent.delete": {
        messageKey: "confirmation.message.deleteDocumentsOne",
        target: documentDeleteTarget,
    },
    "manageStorage.delete": {
        messageKey: "confirmation.message.deleteStorage",
        target: (args) => ({ resource: asText(args.cloudPath) }),
    },
    "manageCloudRun.delete": {
        messageKey: "confirmation.message.deleteCloudRun",
        target: (args) => ({ resource: asText(args.serverName) }),
```

</details>

#### 缺口

- 未运行云环境或实际任务对照
  **影响**：无法证明上线速度与资源正确性
  **进一步探讨**：使用隔离测试环境对照控制台、SDK 和 MCP 的结果及成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具如何在处理前接入确认？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

MCP server 包装 registerTool；tool wrapper 在处理前先调用凭据形态 guard，再调用破坏操作 guard，若 guard 拦截则返回结果而不进入后续处理。动作列表包括函数、数据库集合与存储删除；确认只覆盖识别到的动作及相应配置，不能据此称所有云写入都有统一确认。服务端确认与宿主权限、云侧 IAM 是不同边界。

#### 证据与依据

**依据 1 · 源码核查**：[mcp/src/server.ts:366-408](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/mcp/src/server.ts#L366-L408)

工具注册包装。

<details>
<summary>查看原文（43行）</summary>

```text
  // 实例语言解析（须在工具注册前完成：registerTool 包装层按 lang 解析词典 key 形式的 description）
  server.lang = instanceLang;
  // 同步到 i18n 模块级 instanceLang：否则 t() 无 langOverride 时会退化成
  // TCB_LANG/project.json/zh，导致 options.lang 只影响工具 description、不影响工具输出文案。
  setInstanceLang(server.lang);

  const originalRegisterTool = server.registerTool.bind(server);
  server.registerTool = ((name: string, meta: any, handler: (args: any) => Promise<any>) => {
    const toolMeta = applyCategoryAnnotationMeta(meta ?? {});
    // 国际化描述支持：description/title 写成词典 key 字符串（如 "storage.queryDescription"）时
    // 按实例 lang 解析为实际文案；普通字符串（存量动态 description）原样透传，工具侧零改动。
    if (typeof toolMeta?.description === "string") {
      toolMeta.description = resolveToolText(toolMeta.description, server.lang);
    }
    if (typeof toolMeta?.title === "string") {
      toolMeta.title = resolveToolText(toolMeta.title, server.lang);
    }
    if (toolMeta?.inputSchema && typeof toolMeta.inputSchema === "object") {
      toolMeta.inputSchema = localizeZodSchemaShape(toolMeta.inputSchema, server.lang);
    }
    if (toolMeta?.outputSchema && typeof toolMeta.outputSchema === "object") {
      toolMeta.outputSchema = localizeZodSchemaShape(toolMeta.outputSchema, server.lang);
    }
    // 同步记录到 toolDefs
    server.toolDefs.push({
      name,
      description: toolMeta?.description ?? toolMeta?.title ?? '',
      inputSchema: toolMeta?.inputSchema ?? {},
      handler,
    });
    return originalRegisterTool(name, toolMeta, async (args: any) => {
      try {
        return await handler(args);
      } catch (error) {
        if (isToolPayloadError(error)) {
          // 在结构化错误返回中注入 MCP 版本号
          const payload = { ...error.payload, mcpVersion: version };
          return buildJsonToolResult(payload);
        }
        throw error;
      }
    });
  }) as typeof server.registerTool;
```

</details>

**依据 2 · 源码核查**：[mcp/src/utils/tool-wrapper.ts:263-294](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/mcp/src/utils/tool-wrapper.ts#L263-L294)

凭据及破坏动作 guard 顺序。

<details>
<summary>查看原文（32行）</summary>

```text
        try {
            debug(`开始执行工具: ${name}`, { args: sanitizeArgs(args) });
            // In test environment, skip logger to avoid potential blocking
            const isTestEnvironment =
              process.env.NODE_ENV === "test" || process.env.VITEST === "true";
            if (!isTestEnvironment) {
                server.logger?.({ type: 'beforeToolCall', toolName: name, args: sanitizeArgs(args) });
            }

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
```

</details>

**依据 3 · 源码核查**：[mcp/src/utils/destructive-actions.ts:235-253](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/mcp/src/utils/destructive-actions.ts#L235-L253)

列出的删除动作。

<details>
<summary>查看原文（19行）</summary>

```text
    "manageFunctions.deleteFunction": {
        messageKey: "confirmation.message.deleteFunction",
        target: (args) => ({ resource: asText(args.functionName) }),
    },
    "writeNoSqlDatabaseStructure.deleteCollection": {
        messageKey: "confirmation.message.deleteCollection",
        target: (args) => ({ resource: asText(args.collectionName) }),
    },
    "writeNoSqlDatabaseContent.delete": {
        messageKey: "confirmation.message.deleteDocumentsOne",
        target: documentDeleteTarget,
    },
    "manageStorage.delete": {
        messageKey: "confirmation.message.deleteStorage",
        target: (args) => ({ resource: asText(args.cloudPath) }),
    },
    "manageCloudRun.delete": {
        messageKey: "confirmation.message.deleteCloudRun",
        target: (args) => ({ resource: asText(args.serverName) }),
```

</details>

#### 缺口

- 未逐一追踪全部云工具和宿主接入
  **影响**：不能保证所有写操作被识别
  **进一步探讨**：静态枚举工具与动作并用模拟客户端验证拦截。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 客户端没有确认能力时是否阻止删除？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

对于命中名单的动作，显式 skip 列表会跳过确认；客户端不声明 form elicitation 或读取能力报错时，guard 返回 intercept=false、status=unsupported，后续处理可继续。源码默认自动应答策略为 allow，另可配置 block；可弹表单时选确认才视为 accepted，取消或错误走拦截结果。这是对旧版“缺能力也阻止”的关键反证：不能把该 guard 当无条件 fail-closed，更不能从其存在推断用户实际授权。

#### 证据与依据

**依据 1 · 源码核查**：[mcp/src/utils/confirmation-guard.ts:100-115](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/mcp/src/utils/confirmation-guard.ts#L100-L115)

skip 和 auto-approve 默认 allow。

<details>
<summary>查看原文（16行）</summary>

```text
/** 本次调用是否需要跳过确认 */
export function isSkipped(actionKey: string): boolean {
    const toolName = actionKey.slice(0, actionKey.indexOf("."));
    return isSkippedByList(readSkipList(), toolName, actionKey);
}

/** 客户端自行应答时是否放行；取值非法时告警并回落默认（放行） */
export function readAutoApprovePolicy(): "allow" | "block" {
    const raw = (process.env[AUTO_APPROVE_ENV_NAME] || "allow").trim().toLowerCase();
    if (raw === "allow" || raw === "block") {
        return raw;
    }
    console.error(
        `[cloudbase-mcp] ${AUTO_APPROVE_ENV_NAME} 只接受 allow / block，收到 "${raw}"，按 allow 处理。`,
    );
    return "allow";
```

</details>

**依据 2 · 源码核查**：[mcp/src/utils/confirmation-guard.ts:147-174](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/mcp/src/utils/confirmation-guard.ts#L147-L174)

未命中、显式跳过及 unsupported 不拦截。

<details>
<summary>查看原文（28行）</summary>

```text
export async function guardDestructiveAction(
    server: ConfirmationServer,
    params: { toolName: string; args: unknown; extra?: { requestId?: RequestId } },
): Promise<GuardDecision> {
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
```

</details>

**依据 3 · 源码核查**：[mcp/src/utils/confirmation-guard.ts:208-231](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/mcp/src/utils/confirmation-guard.ts#L208-L231)

异常拦截和明确确认。

<details>
<summary>查看原文（24行）</summary>

```text
        const reason = error instanceof Error ? error.message : String(error);
        return {
            intercept: true,
            status: "error",
            result: {
                content: [{ type: "text", text: blockedText("error", key, targetInfo, { reason }) }],
                structuredContent: { status: "error", executed: false, tool: params.toolName },
            },
        };
    }

    // 表单里选了"确认"才算同意
    if (outcome.status === "accepted" && outcome.value === confirmLabel) {
        debug("破坏性动作已确认", { tool: params.toolName, action: key, durationMs: outcome.durationMs });
        return { intercept: false, status: "accepted" };
    }

    /** 拦下并给出说明；`durationMs` 只用于把"你点的取消"和"自动审批被拦"区分开 */
    const block = (status: ConfirmationStatus, extraParams: Record<string, string | number> = {}) => ({
        intercept: true as const,
        status,
        result: {
            content: [{ type: "text" as const, text: blockedText(status, key, targetInfo, extraParams) }],
            structuredContent: { status, executed: false, tool: params.toolName },
```

</details>

**依据 4 · 源码核查**：[mcp/src/utils/tool-wrapper.ts:285-294](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/mcp/src/utils/tool-wrapper.ts#L285-L294)

拦截才提前返回。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

#### 缺口

- 未运行真实客户端和云删除
  **影响**：不能断言特定宿主是否提供能力或实际执行
  **进一步探讨**：用模拟 handler 分别测试无能力、skip、自动应答、取消和批准。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 云权限、费用和退出怎么控制？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 MCP 客户端、CloudBase 环境和凭据；模型调用及云资源均可能计费，环境和身份错误可能影响真实资源。首次应选隔离测试环境、最小权限并核对确认能力；持续需复核目标、费用与操作结果。缺确认能力的 guard 可放行，不能把 UI 不弹窗当保护；生产删除前需独立明确授权。退出要分别撤销云凭据与清理客户端配置，已经部署或删除的资源需独立恢复。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:119-126](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/README.md#L119-L126)

作者说明 MCP 接入。

````text
#### MCP only

```json
{
  "mcpServers": {
    "cloudbase": {
      "command": "npx",
      "args": ["@cloudbase/cloudbase-mcp@latest"]
````

**依据 2 · 源码核查**：[mcp/src/utils/confirmation-guard.ts:157-174](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/mcp/src/utils/confirmation-guard.ts#L157-L174)

能力不足可放行。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[mcp/src/utils/destructive-actions.ts:235-253](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/mcp/src/utils/destructive-actions.ts#L235-L253)

涉及云资源删除。

<details>
<summary>查看原文（19行）</summary>

```text
    "manageFunctions.deleteFunction": {
        messageKey: "confirmation.message.deleteFunction",
        target: (args) => ({ resource: asText(args.functionName) }),
    },
    "writeNoSqlDatabaseStructure.deleteCollection": {
        messageKey: "confirmation.message.deleteCollection",
        target: (args) => ({ resource: asText(args.collectionName) }),
    },
    "writeNoSqlDatabaseContent.delete": {
        messageKey: "confirmation.message.deleteDocumentsOne",
        target: documentDeleteTarget,
    },
    "manageStorage.delete": {
        messageKey: "confirmation.message.deleteStorage",
        target: (args) => ({ resource: asText(args.cloudPath) }),
    },
    "manageCloudRun.delete": {
        messageKey: "confirmation.message.deleteCloudRun",
        target: (args) => ({ resource: asText(args.serverName) }),
```

</details>

#### 缺口

- 未测试 IAM、计费、客户端或回滚
  **影响**：无法保证授权与实际成本
  **进一步探讨**：在无生产权限的测试环境记录结果及资源变化。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何避免能力不足时静默执行删除？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有动作名单、skip 机制及支持表单时的确认已存在，单纯增加确认对话框不是新机制。未验证方案是在命中破坏操作但宿主不支持 form 时返回结构化未执行状态，并提供用户可显式调用的独立确认流程；保留明确配置的自动化例外且让操作者知晓。对照现有 unsupported 放行，用模拟资源测试误删、误阻、无交互自动化兼容和耗时；若误阻不可接受或无法表达用户原有授权，则否定或调整。

#### 证据与依据

**依据 1 · 源码核查**：[mcp/src/utils/confirmation-guard.ts:147-174](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/mcp/src/utils/confirmation-guard.ts#L147-L174)

现有 unsupported/skip 行为。

<details>
<summary>查看原文（28行）</summary>

```text
export async function guardDestructiveAction(
    server: ConfirmationServer,
    params: { toolName: string; args: unknown; extra?: { requestId?: RequestId } },
): Promise<GuardDecision> {
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
```

</details>

**依据 2 · 源码核查**：[mcp/src/utils/confirmation-guard.ts:219-231](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/mcp/src/utils/confirmation-guard.ts#L219-L231)

已有确认与未执行返回。

<details>
<summary>查看原文（13行）</summary>

```text
    // 表单里选了"确认"才算同意
    if (outcome.status === "accepted" && outcome.value === confirmLabel) {
        debug("破坏性动作已确认", { tool: params.toolName, action: key, durationMs: outcome.durationMs });
        return { intercept: false, status: "accepted" };
    }

    /** 拦下并给出说明；`durationMs` 只用于把"你点的取消"和"自动审批被拦"区分开 */
    const block = (status: ConfirmationStatus, extraParams: Record<string, string | number> = {}) => ({
        intercept: true as const,
        status,
        result: {
            content: [{ type: "text" as const, text: blockedText(status, key, targetInfo, extraParams) }],
            structuredContent: { status, executed: false, tool: params.toolName },
```

</details>

**依据 3 · 源码核查**：[mcp/src/utils/destructive-actions.ts:235-253](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/cc00d1cea8c143f743beb1b6fdc51ad98befa5d8/mcp/src/utils/destructive-actions.ts#L235-L253)

现有动作名单。

<details>
<summary>查看原文（19行）</summary>

```text
    "manageFunctions.deleteFunction": {
        messageKey: "confirmation.message.deleteFunction",
        target: (args) => ({ resource: asText(args.functionName) }),
    },
    "writeNoSqlDatabaseStructure.deleteCollection": {
        messageKey: "confirmation.message.deleteCollection",
        target: (args) => ({ resource: asText(args.collectionName) }),
    },
    "writeNoSqlDatabaseContent.delete": {
        messageKey: "confirmation.message.deleteDocumentsOne",
        target: documentDeleteTarget,
    },
    "manageStorage.delete": {
        messageKey: "confirmation.message.deleteStorage",
        target: (args) => ({ resource: asText(args.cloudPath) }),
    },
    "manageCloudRun.delete": {
        messageKey: "confirmation.message.deleteCloudRun",
        target: (args) => ({ resource: asText(args.serverName) }),
```

</details>

#### 缺口

- 方案未实现或经用户测试
  **影响**：不能宣称已修复删除风险
  **进一步探讨**：仅用模拟 handler 验证各能力组合和授权语义。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
