# NocoBase

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[9d752bb](https://github.com/nocobase/nocobase/tree/9d752bb60d8eca5883e4357eefbff46d56c941d1)

<!-- BEGIN META -->
[![GitHub ★ 24,708](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=24%2C708&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/nocobase/nocobase)
<!-- END META -->

> **功能**：AI与可视化无代码业务平台，将数据模型、页面、权限、工作流及Agent工具组合。

> **亮点**：相对任意LLM脚本写库或手工CRUD，把Agent接到已有数据、动作权限和业务工作流中，与人共同配置同一底座；核心增量是业务集成，非新模型算法。[Q02](#research-q02)

> **主要限制**：有ACL和user-context连接不等每个AI路径已验证同权限；仅用户ID的MCP缓存、done状态和数据库事务不能独立保证角色撤销及时生效或外部动作exactly-once。[Q03](#research-q03)

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
  - [Q01 · 谁需要数据建模与无代码业务交付，既有办法和合格产物是什么？](#detail-section-11)
  - [Q02 · AI、数据权限与操作流怎样接线，具体增量来自哪里？](#detail-section-12)
  - [Q03 · 可配置是否转化为可控业务流程？](#detail-section-13)
  - [Q04 · 启动、持续使用和失败恢复分别依赖什么，由谁承担成本？](#detail-section-14)
  - [Q05 · 由机制与限制可提出什么改进，什么人值得试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向反复构建内部CRUD/审批系统的业务团队；完整平台基础设施，非DSH插件。[Q01](#research-q01)

简单CRUD或现有表格/人工审批流程；同业务数据、角色与任务比较办结率、错误、恢复与总人工，不以页面生成速度替代。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|业务平台|模型/页面/角色组织|需治理和部署，未全审计|
|AI工作流工具|从模型调用既有流程|权限/副作用逐入口验收|
|用户MCP|按用户渲染连接|仅ID缓存需核撤销失效|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|Node>=22/部署环境及数据库|必需|应用、模型和持久|先隔离部署验证|
|清楚的数据模型/角色|业务必需|字段动作边界|不接真实数据|
|模型及MCP服务/凭据|AI路径必需|推理和外部工具|先人工无代码基线|
|备份、权限验收及许可核对|试用必需|恢复与部署约束|暂缓真实上线|

#### 启动步骤

|步骤|执行者与成功判据|失败处理|
|---|---|---|
|建立匿名模型和两角色|管理员核准读写字段|修正规则|
|人工与AI/MCP/workflow同任务|管理员核对拒绝/审计一致|停相关工具|
|模拟撤销/中断/恢复|管理员对账作业和外部动作|恢复备份，先核远端状态|

**效果与成本**

#### 成本

|阶段|现金与资源|人工与时间|未知|
|---|---|---|---|
|首次|部署、数据库及适用插件许可|建模、角色和最小流程配置|许可范围与工时|
|持续|模型/MCP、存储及运维|人工审批、复核和规则维护|每办结任务总成本|
|失败恢复|备份、作业和外部接口重试|权限对账、状态/副作用核对|恢复率和人工时间|

#### 效果

|效果项|抽读支持|未知|
|---|---|---|
|业务工具化|workflow结构schema与AI调用|真实办结/节时|
|权限基础|角色动作ACL与用户MCP上下文|全AI路径及撤销新鲜度|
|恢复结构|中断、状态及事务scope|远端副作用补偿和总成本|

> **思考**：有ACL和user-context连接不等每个AI路径已验证同权限；仅用户ID的MCP缓存、done状态和数据库事务不能独立保证角色撤销及时生效或外部动作exactly-once。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对任意LLM脚本写库或手工CRUD，把Agent接到已有数据、动作权限和业务工作流中，与人共同配置同一底座；核心增量是业务集成，非新模型算法。[Q02](#research-q02)

分离AI管理器、审批/状态middleware与工作流工具桥，并对用户MCP连接设TTL/容量值得借鉴；复用必须补具体ACL链、撤销失效和外部副作用收据。[Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

有ACL和user-context连接不等每个AI路径已验证同权限；仅用户ID的MCP缓存、done状态和数据库事务不能独立保证角色撤销及时生效或外部动作exactly-once。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

有明确内部数据/审批场景及数据库治理能力的团队可在匿名隔离应用试用最小流程；先验两个角色所有入口权限及恢复，再接真实数据和外部写动作。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

抽读支持工具/工作流与角色基础接线；全部AI权限、异步恢复和业务收益未验证；权限上下文/收据假设未验证。

- 已检查：作者 README、包清单、源码路径 packages/core/ai/src/ai-manager.ts、packages/core/ai/src/mcp-manager/user-context-client-manager.ts、packages/core/ai/src/mcp-manager/options-renderer.ts、packages/core/acl/src/acl.ts、packages/plugins/@nocobase/plugin-ai/src/server/ai-employees/middleware/tools.ts、packages/plugins/@nocobase/plugin-ai/src/server/tools/workflow-caller.ts、packages/plugins/@nocobase/plugin-workflow/src/server/Processor.ts、packages/plugins/@nocobase/plugin-ai/src/server/ai-employees/ai-employee.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：partial clone固定版本抽读AI管理、用户MCP模板/缓存、ACL动作、工具审批/状态、workflow caller/Processor；inventory仅9个MD/TS文件子集，未审计全部插件/模型/ACL路径/部署或商用许可，未运行。
- 下一步：匿名隔离应用按角色/字段跨人工、AI、MCP和workflow验证，注入权限撤销、换token、超时和远端成功本地失败，对账并记录总成本。

**分析版本**

- **仓库**：[nocobase/nocobase](https://github.com/nocobase/nocobase)
- **版本号**：未声明（[固定提交 9d752bb](https://github.com/nocobase/nocobase/tree/9d752bb60d8eca5883e4357eefbff46d56c941d1)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是绑定权限上下文版本、流程ID和外部收据并按权限变更失效缓存，减少陈旧授权和重复动作；跨角色/撤销/中断对照，无错误与恢复改善则否定。[Q05](#research-q05)

匿名隔离应用按角色/字段跨人工、AI、MCP和workflow验证，注入权限撤销、换token、超时和远端成功本地失败，对账并记录总成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：根；内容摘要：c4d20cd10f1b083dc611f916724998e21cfb1b8ddbdad200f5fd22903def5388。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 8 | 4656 | 4003 | 182 | — |
| .md | source | 1 | 161 | — | — | 933 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/nocobase/nocobase/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：数据模型与AI工具/工作流组合能否形成可控业务交付，权限与恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要数据建模与无代码业务交付，既有办法和合格产物是什么？

**研究主题**：场景与需求

#### 完整回答

对象是要把业务数据、表单、页面、角色和审批/自动化做成可维护系统的团队，尤其是规则重复而需求持续变化的内部运营任务。根项目是完整AI+no-code平台/基础设施，不是装入DSH的第三方插件；外部Agent可通过CLI/接口协作是另一接入面。合格产物必须按角色正确读写数据、按业务条件推进并能恢复，不是生成了页面或AI返回一段解释。README提出人可视化配置、Agent用CLI/skills共同修改同一数据模型；相对纯手写CRUD，潜在增量是复用数据/权限/工作流底座；相对表格加人工交接，代价是部署、建模和治理。生产可靠、几分钟交付是作者主张，本项没有真实客户系统或同条件时间证据，不外推“任何业务都更便宜”。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-19](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/README.md#L17-L19)

作者平台定位

```text
## What is NocoBase

NocoBase is an open-source AI + no-code platform for building business systems fast. Instead of generating everything from scratch, AI works on top of production-proven infrastructure and a WYSIWYG no-code interface, so you get both speed and reliability.
```

**依据 2 · 作者声明**：[README.md:61-90](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/README.md#L61-L90)

人和Agent协作流程

<details>
<summary>查看原文（30行）</summary>

```text
### 1. Collaborative: AI and people build together

Coding agents get a full CLI and skills, while people get a WYSIWYG no-code interface, so both can collaborate efficiently.

#### Build with the AI coding agents you already know

Go from deployment to a working system in minutes with mainstream coding agents.

- Works with mainstream agents like Claude Code, Cursor, Codex, OpenCode, and TRAE
- Agents can handle setup, development, migration, and release end to end

![coding-agent](https://static-docs.nocobase.com/coding-agent.png)

#### Build manually in a WYSIWYG no-code interface

People can build and modify visually in a WYSIWYG interface, even without AI.

- Switch between usage mode and configuration mode with one click
- Review and configure data models, pages, workflows, and permissions visually
- Designed for regular users, not just developers

![wysiwyg](https://static-docs.nocobase.com/wysiwyg.gif)

#### Mix AI development and manual building however you need

Split the work as needed: people can refine what AI builds, and AI can continue from human configuration.

- AI can quickly create data models, pages, and workflows
- People can quickly refine the UI and interactions
- Collaborate as needed and keep iterating
```

</details>

**依据 3 · 作者声明**：[README.md:128-149](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/README.md#L128-L149)

作者基础设施与数据模型主张

<details>
<summary>查看原文（22行）</summary>

```text
### 3. Reliable: ready infrastructure for real business

Data models, permissions, and workflows are complex and error-sensitive.  
NocoBase provides them as built-in infrastructure, tested and proven in production.

#### Complete infrastructure, without starting from scratch

Dozens of built-in modules cover the most common business needs.

- Data models, permissions, workflows, and audit logs work out of the box
- Proven in production, instead of regenerated as black-box code each time
- Built-in guardrails keep AI output aligned with the system architecture

![core](https://static-docs.nocobase.com/f-core.png)

#### Data-model driven, with data decoupled from UI

Business data stays in standard relational structures, separate from the UI.

- Use the main database, external databases, and third-party APIs as data sources
- AI and people work on the same data model, so results stay transparent
- Your data always stays in your own database, without platform lock-in
```

</details>

#### 缺口

- 没有真实匿名业务任务、交付验收和手工/CRUD基线数据
  **影响**：不能确认业务办结、全路径权限或净交付收益
  **进一步探讨**：以匿名业务数据的隔离应用，对照简单CRUD/人工流程，记录权限拒绝、重复执行、正确率和总人工时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · AI、数据权限与操作流怎样接线，具体增量来自哪里？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

core AIManager将document、tools、skills、employee、MCP manager组合到app。AI middleware根据工具和employee配置决定human-in-loop中断，允许approve/reject/edit；执行状态写pending/done并向前端流出，GraphInterrupt保留中断而不是写done。workflow-caller把启用且type=ai-employee的工作流转换成Zod参数schema工具，invoke触发workflow并返回output或最后job结果，形成自然语言工具调用到既有业务自动化的桥。core ACL middleware从currentRoles/currentRole建立ctx.can并解析操作权限，缺权限在resolvePermissionParams拒绝，说明平台有统一动作授权基础。相对LLM生成任意脚本直接写库，贡献是把Agent接入既有工具/工作流和角色基础，复用LangChain、MCP adapter及Sequelize等上游，非新推理算法。当前只证明这些接缝存在，未逐个审计每个AI工具都强制经过ACL，不能把“每个动作同等细粒度权限”当独立验证完成。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/ai/src/ai-manager.ts:17-33](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/core/ai/src/ai-manager.ts#L17-L33)

AI基础管理器组合

<details>
<summary>查看原文（17行）</summary>

```text
export class AIManager {
  documentManager: DocumentManager;
  toolsManager: ToolsManager;
  skillsManager: SkillsManager;
  employeeManager: AIEmployeeManager;
  mcpManager: MCPManager;
  mcpToolsManager: McpToolsManager;

  constructor(protected readonly app: any) {
    this.documentManager = new DocumentManager();
    this.toolsManager = new DefaultToolsManager();
    this.skillsManager = new DefaultSkillsManager(app);
    this.employeeManager = new DefaultAIEmployeeManager(app);
    this.mcpManager = new DefaultMCPManager(app);
    this.mcpToolsManager = new McpToolsManager();
  }
}
```

</details>

**依据 2 · 源码核查**：[packages/plugins/@nocobase/plugin-ai/src/server/ai-employees/middleware/tools.ts:16-35](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/plugins/%40nocobase/plugin-ai/src/server/ai-employees/middleware/tools.ts#L16-L35)

工具交互审批

<details>
<summary>查看原文（20行）</summary>

```text
export const toolInteractionMiddleware = (aiEmployee: AIEmployee, tools: ToolsEntry[]) => {
  const interruptOn = {};
  for (const tool of tools) {
    interruptOn[tool.definition.name] = aiEmployee.shouldInterruptToolCall(tool)
      ? {
          allowedDecisions: ['approve', 'reject', 'edit'],
          description: (toolCall) =>
            JSON.stringify({
              sessionId: aiEmployee.sessionId,
              from: aiEmployee.from,
              username: aiEmployee.employee.username,
              toolCallId: toolCall.id,
              toolCallName: toolCall.name,
            }),
        }
      : false;
  }
  return humanInTheLoopMiddleware({
    interruptOn,
  });
```

</details>

**依据 3 · 源码核查**：[packages/plugins/@nocobase/plugin-ai/src/server/tools/workflow-caller.ts:87-129](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/plugins/%40nocobase/plugin-ai/src/server/tools/workflow-caller.ts#L87-L129)

工具与工作流调用桥

<details>
<summary>查看原文（43行）</summary>

```text
const invoke = async (ctx: Context, workflow: Workflow, args: Record<string, any>) => {
  const workflowPlugin = ctx.app.pm.get('workflow') as PluginWorkflowServer;
  const processor = (await workflowPlugin.trigger(workflow as any, {
    ...args,
  })) as Processor;
  const output = processor.execution.output ?? processor.lastSavedJob?.result;
  if (output == null || output === '') {
    return { status: 'error' as const, content: 'No content' };
  }
  if (processor.execution.status < 0) {
    return { status: 'error' as const, content: 'Workflow execution exceptions' };
  }
  const result = truncateLongStrings(output);
  return {
    status: 'success' as const,
    content: JSON.stringify(result),
  };
};

export const getWorkflowCallers = (plugin: Plugin, prefix?: string) => async (register: ToolsRegistration) => {
  const workflowPlugin = plugin.app.pm.get('workflow') as PluginWorkflowServer;
  const aiSupporterWorkflows = Array.from(workflowPlugin.enabledCache.values()).filter(
    (item) => item.type === 'ai-employee',
  );

  for (const workflow of aiSupporterWorkflows) {
    const config = workflow.config;
    register.registerTools({
      scope: 'CUSTOM',
      from: 'workflow',
      introduction: {
        title: workflow.title,
        about: workflow.description,
      },
      definition: {
        name: !_.isEmpty(prefix) ? `${prefix}-${workflow.key}` : workflow.key,
        description: workflow.description,
        schema: buildSchema(config),
      },
      invoke: async (ctx: Context, args: Record<string, any>) => invoke(ctx, workflow, args),
    });
  }
};
```

</details>

**依据 4 · 源码核查**：[packages/core/acl/src/acl.ts:387-412](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/core/acl/src/acl.ts#L387-L412)

按当前角色建立动作权限

<details>
<summary>查看原文（26行）</summary>

```text
  middleware() {
    const acl = this;

    return async function ACLMiddleware(ctx, next) {
      ctx.acl = acl;

      const roleName = ctx.state.currentRole || 'anonymous';
      const { resourceName: rawResourceName, actionName } = ctx.action;
      const resourceName = resolveResourceName(ctx, rawResourceName, true);

      ctx.can = (options: Omit<CanArgs, 'role'>) => {
        const roles = ctx.state.currentRoles || [roleName];
        const can = acl.can({ roles, ...options });
        if (!can) {
          return null;
        }
        return can;
      };

      ctx.permission = {
        can: ctx.can({ resource: resourceName, action: actionName, rawResourceName }),
        resourceName,
        actionName,
      };

      return await compose(acl.middlewares.nodes)(ctx, next);
```

</details>

**依据 5 · 源码核查**：[packages/core/acl/src/acl.ts:524-545](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/core/acl/src/acl.ts#L524-L545)

缺操作权限拒绝

<details>
<summary>查看原文（22行）</summary>

```text
  }

  private async resolvePermissionParams(
    ctx,
    options: {
      actionName: string;
      can: CanResult | null;
      params?: any;
      rawResourceName: string;
      resourceName: string;
      skip?: boolean;
    },
  ): Promise<ResolvedActionParams> {
    const { actionName, can, rawResourceName, resourceName } = options;
    const rawParams = lodash.cloneDeep(options.params || {});

    if ((!can || typeof can !== 'object') && !options.skip) {
      throw new NoPermissionError('No permissions');
    }

    const params = can?.params || this.fixedParamsManager.getParams(resourceName, actionName);
    ctx.log?.debug && ctx.log.debug('acl params', params);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 可配置是否转化为可控业务流程？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

有积极支持，但不能等同全链保证。user-context MCP manager要求当前用户ID、只对useUserContext且非stdio条目渲染连接，按用户ID缓存5分钟/最多100并关闭过期客户端；renderer把currentUser与请求token/headers作为模板变量，减少所有人共用单一连接的风险。关键缺口是缓存key只有用户ID，角色/当前token等请求上下文变化不直接进入key，是否有外部清cache和远端实时授权需再核；不能称已复现越权。tool status finally对非GraphInterrupt写done，done只代表本次handler返回，不证明业务正确或外部副作用exactly-once。workflow Processor显式区分pending/resolved/error/aborted等，并维护事务scope和超时取消，开放事务中pending会标错；这些是恢复设计，不是所有外部接口可回滚。workflow caller直接trigger的权限主体与每个节点的数据过滤未在本项全追踪，因此权限撤销、跨角色缓存、异步挂起与重试是最影响核心价值的验证，而非以“有ACL模块”作安全结论。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/ai/src/mcp-manager/user-context-client-manager.ts:36-97](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/core/ai/src/mcp-manager/user-context-client-manager.ts#L36-L97)

用户绑定MCP与仅ID缓存/TTL

<details>
<summary>查看原文（62行）</summary>

```text
  private readonly maxSize: number;

  constructor(private readonly options: UserContextMCPClientManagerOptions) {
    this.ttlMs = options.ttlMs ?? 5 * 60 * 1000;
    this.maxSize = options.maxSize ?? 100;
  }

  async getToolsMap(ctx: Context): Promise<Record<string, StructuredToolInterface[]>> {
    const currentUser = ctx?.state?.currentUser ?? ctx?.auth?.user;
    if (!currentUser?.id) {
      return {};
    }

    let client: MultiServerMCPClient | null = null;
    try {
      this.evictExpired();

      const entries = (await this.options.listEntries())
        .filter((entry) => entry.enabled !== false && entry.useUserContext === true && entry.transport !== 'stdio')
        .sort((left, right) => left.name.localeCompare(right.name));
      if (!entries.length) {
        return {};
      }

      const cacheKey = String(currentUser.id);
      const cached = this.cache.get(cacheKey);
      const now = Date.now();
      if (cached && cached.expiresAt > now) {
        cached.lastAccessedAt = now;
        return cached.toolsMap;
      }

      if (cached) {
        await this.closeEntry(cached);
        this.cache.delete(cacheKey);
      }

      const connections: Record<string, MCPConnection> = {};
      for (const entry of entries) {
        const rendered = await renderMCPOptions(entry, this.options.app, ctx);
        connections[entry.name] = this.options.buildConnection(rendered);
      }

      client = new MultiServerMCPClient(connections);
      const initializedToolsMap = await client.initializeConnections();
      const toolsMap = Object.fromEntries(
        Object.entries(initializedToolsMap).map(([serverName, tools]) => [
          serverName,
          tools as StructuredToolInterface[],
        ]),
      );

      this.cache.set(cacheKey, {
        client,
        toolsMap,
        expiresAt: now + this.ttlMs,
        lastAccessedAt: now,
      });
      client = null;
      await this.evictOversized();

      return toolsMap;
```

</details>

**依据 2 · 源码核查**：[packages/core/ai/src/mcp-manager/options-renderer.ts:88-132](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/core/ai/src/mcp-manager/options-renderer.ts#L88-L132)

请求token和用户模板

<details>
<summary>查看原文（45行）</summary>

```text
  headers: ctx?.request?.headers ?? {},
  token: ctx?.getBearerToken?.() ?? '',
});

const emptyRequestVariables = {
  headers: {},
  token: '',
};

export const normalizeMCPOptions = (options: MCPOptions): MCPOptions => {
  const normalized: MCPOptions = {
    ...options,
    args: stringifyArray(options.args),
    env: stringifyRecord(options.env),
    headers: stringifyRecord(options.headers),
    useUserContext: options.transport === 'stdio' ? false : options.useUserContext === true,
  };

  if (normalized.transport === 'stdio') {
    normalized.url = undefined;
    normalized.headers = {};
  }
  return normalized;
};

export async function renderMCPOptions(
  options: MCPOptions,
  app: { environment?: { getVariables?: () => Record<string, unknown> } },
  ctx?: Context,
): Promise<MCPOptions> {
  const currentUser = options.useUserContext ? await getCurrentUser(ctx, options) : undefined;
  const request = options.useUserContext ? getRequestVariables(ctx) : emptyRequestVariables;
  const variables = {
    $env: app.environment?.getVariables?.() ?? {},
    currentUser,
    $user: currentUser,
    request,
    ctx: {
      currentUser,
      request,
    },
  };

  return normalizeMCPOptions(parse(options)(variables) as MCPOptions);
}
```

</details>

**依据 3 · 源码核查**：[packages/plugins/@nocobase/plugin-ai/src/server/ai-employees/middleware/tools.ts:108-132](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/plugins/%40nocobase/plugin-ai/src/server/ai-employees/middleware/tools.ts#L108-L132)

中断和完成状态处理

<details>
<summary>查看原文（25行）</summary>

```text
          body: { toolCall, error: e },
          currentConversation,
        });
        return new ToolMessage({
          tool_call_id: request.toolCall.id,
          status: 'error',
          content: e.message,
          metadata: {
            messageId,
          },
        });
      } finally {
        if (!interrupted) {
          await aiEmployee.updateToolCallDone(messageId, request.toolCall.id, result);
          const toolCallResult = await aiEmployee.getToolCallResult(messageId, request.toolCall.id);
          runtime.writer?.({
            action: 'afterToolCall',
            body: { toolCall, toolCallResult },
            currentConversation,
          });
        }
      }
    },
  });
};
```

</details>

**依据 4 · 源码核查**：[packages/plugins/@nocobase/plugin-workflow/src/server/Processor.ts:66-101](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/plugins/%40nocobase/plugin-workflow/src/server/Processor.ts#L66-L101)

状态和事务scope

<details>
<summary>查看原文（36行）</summary>

```text
    [JOB_STATUS.PENDING]: EXECUTION_STATUS.STARTED,
    [JOB_STATUS.RESOLVED]: EXECUTION_STATUS.RESOLVED,
    [JOB_STATUS.FAILED]: EXECUTION_STATUS.FAILED,
    [JOB_STATUS.ERROR]: EXECUTION_STATUS.ERROR,
    [JOB_STATUS.ABORTED]: EXECUTION_STATUS.ABORTED,
    [JOB_STATUS.CANCELED]: EXECUTION_STATUS.CANCELED,
    [JOB_STATUS.REJECTED]: EXECUTION_STATUS.REJECTED,
    [JOB_STATUS.RETRY_NEEDED]: EXECUTION_STATUS.RETRY_NEEDED,
  };

  logger: Logger;

  /**
   * @experimental
   */
  transaction?: Transaction | null = null;

  /**
   * @experimental
   */
  nodes: FlowNodeModel[] = [];

  /**
   * @experimental
   */
  nodesMap = new Map<number | string, FlowNodeModel>();

  private jobsMapByNodeKey: { [key: string]: JobModel } = {};
  private jobResultsMapByNodeKey: { [key: string]: any } = {};
  private jobsToSave: Map<string, JobModel> = new Map();
  private scopeTransactions = new Map<string, ScopeTransaction>();
  private rerunContext: RerunContext | null = null;

  /**
   * @experimental
   */
```

</details>

**依据 5 · 源码核查**：[packages/plugins/@nocobase/plugin-workflow/src/server/Processor.ts:683-718](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/plugins/%40nocobase/plugin-workflow/src/server/Processor.ts#L683-L718)

开放事务与pending作业处理

<details>
<summary>查看原文（36行）</summary>

```text
  private hasOpenScopeTransactions() {
    for (const { transaction } of this.scopeTransactions.values()) {
      if (!(transaction as TransactionWithFinished).finished) {
        return true;
      }
    }
    return false;
  }

  private markOpenScopePendingJobsAsError(message: string) {
    const pendingJobs = new Set<JobModel>();
    for (const job of this.jobsToSave.values()) {
      if (job.status === JOB_STATUS.PENDING) {
        pendingJobs.add(job);
      }
    }
    for (const job of Object.values(this.jobsMapByNodeKey)) {
      if (job.status === JOB_STATUS.PENDING) {
        pendingJobs.add(job);
      }
    }
    for (const key of this.scopeTransactions.keys()) {
      const job = this.jobsMapByNodeKey[key];
      if (job?.status === JOB_STATUS.PENDING) {
        pendingJobs.add(job);
      }
    }
    for (const job of pendingJobs) {
      job.set({
        status: JOB_STATUS.ERROR,
        result: {
          message,
        },
      });
      this.saveJob(job);
    }
```

</details>

#### 缺口

- 未追踪全部AI工具ACL、缓存失效、权限撤销与外部副作用恢复
  **影响**：不能确认业务办结、全路径权限或净交付收益
  **进一步探讨**：以匿名业务数据的隔离应用，对照简单CRUD/人工流程，记录权限拒绝、重复执行、正确率和总人工时间

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、持续使用和失败恢复分别依赖什么，由谁承担成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

首次需Node>=22或对应部署环境、数据库和应用配置，以及管理员完成数据模型/角色/页面/工作流；AI还需provider凭据和合适模型，MCP需要服务端、网络/stdio依赖及用户上下文授权。持续成本不仅模型token，还有数据库/文件存储、插件升级、流程规则维护、人工审批和输出复核。失败恢复包括备份还原、事务/作业状态核对、MCP缓存关闭和外部动作对账；不能把数据库事务误当邮件、支付或远端API补偿。根package写Apache-2.0，而抽读core/AI/workflow文件头明确AGPL-3.0与商业双许可，部署与扩展前须逐包核对许可范围；本项只报告固定文件内容，不推断商业条款或当前价格。无真实业务量、人工单价与失败样本，不能填0或承诺ROI。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-18](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/package.json#L1-L18)

根包身份和Node声明

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "nocobase",
  "private": true,
  "workspaces": [
    "packages/*/*",
    "packages/*/*/*"
  ],
  "license": "Apache-2.0",
  "engines": {
    "node": ">=22"
  },
  "licenses": [
    {
      "type": "Apache-2.0",
      "url": "https://www.apache.org/licenses/LICENSE-2.0"
    }
  ],
  "scripts": {
```

</details>

**依据 2 · 源码核查**：[packages/core/ai/src/ai-manager.ts:1-8](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/core/ai/src/ai-manager.ts#L1-L8)

所读源码许可声明

```text
/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */
```

**依据 3 · 源码核查**：[packages/core/ai/src/mcp-manager/user-context-client-manager.ts:36-40](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/core/ai/src/mcp-manager/user-context-client-manager.ts#L36-L40)

连接资源配置

```text
  private readonly maxSize: number;

  constructor(private readonly options: UserContextMCPClientManagerOptions) {
    this.ttlMs = options.ttlMs ?? 5 * 60 * 1000;
    this.maxSize = options.maxSize ?? 100;
```

**依据 4 · 源码核查**：[packages/plugins/@nocobase/plugin-workflow/src/server/Processor.ts:91-135](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/plugins/%40nocobase/plugin-workflow/src/server/Processor.ts#L91-L135)

状态、事务和超时恢复资源

<details>
<summary>查看原文（45行）</summary>

```text
  nodesMap = new Map<number | string, FlowNodeModel>();

  private jobsMapByNodeKey: { [key: string]: JobModel } = {};
  private jobResultsMapByNodeKey: { [key: string]: any } = {};
  private jobsToSave: Map<string, JobModel> = new Map();
  private scopeTransactions = new Map<string, ScopeTransaction>();
  private rerunContext: RerunContext | null = null;

  /**
   * @experimental
   */
  lastSavedJob: JobModel | null = null;
  abortController = new AbortController();
  timeoutGuard: NodeJS.Timeout | null = null;
  private runningRegistered = false;
  private unregisterRunningExecution?: () => void;
  private abortReason: string | null = null;
  private aborted = false;

  constructor(
    public execution: ExecutionModel,
    public options: ProcessorOptions,
  ) {
    this.logger = options.plugin.getLogger(execution.workflowId);
    this.transaction = options.transaction;
  }

  get abortSignal() {
    return this.abortController.signal;
  }

  setTimeoutGuard(ms: number) {
    if (this.timeoutGuard) {
      clearTimeout(this.timeoutGuard);
    }
    this.timeoutGuard = setTimeout(() => {
      this.abortExecution(EXECUTION_REASON.TIMEOUT);
    }, ms);
  }

  abortExecution(reason?: string) {
    this.aborted = true;
    this.abortReason = reason ?? null;
    if (!this.abortController.signal.aborted) {
      this.abortController.abort(
```

</details>

#### 缺口

- 部署/商业插件条件、业务量及总拥有/恢复成本未逐项核实
  **影响**：不能确认业务办结、全路径权限或净交付收益
  **进一步探讨**：以匿名业务数据的隔离应用，对照简单CRUD/人工流程，记录权限拒绝、重复执行、正确率和总人工时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 由机制与限制可提出什么改进，什么人值得试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议有明确内部CRUD/审批场景且能维护数据库、权限和备份的团队，在隔离应用用匿名记录试用最小流程，先不开真实外部写动作。以两个角色和字段级权限验收人工、内置AI工具、MCP、workflow入口的同一任务，确认拒绝与审计一致，再考虑真实数据。未验证假设是把权限上下文版本、流程执行ID和外部副作用收据绑定到AI调用，权限变更时使用户MCP缓存失效，可减少“配置看似同权限但执行上下文已陈旧”的错误。依据是用户ID缓存和请求变量、状态/事务边界；新增负担是上下文版本维护、远端幂等和收据存储。最小验证含同用户角色撤销/换token、跨角色读写、工具中断、workflow超时及远端成功后本地失败，对照现有配置和简单人工流程，记录越权/漏拒、重复动作、办结率、人工恢复及模型/运维费用。若只增复杂度而无错误/恢复改善，否定。没有实际团队与案例前，不将其升级为新的商业插件机会。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/ai/src/mcp-manager/user-context-client-manager.ts:60-97](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/core/ai/src/mcp-manager/user-context-client-manager.ts#L60-L97)

缓存身份与新鲜度

<details>
<summary>查看原文（38行）</summary>

```text
      const cacheKey = String(currentUser.id);
      const cached = this.cache.get(cacheKey);
      const now = Date.now();
      if (cached && cached.expiresAt > now) {
        cached.lastAccessedAt = now;
        return cached.toolsMap;
      }

      if (cached) {
        await this.closeEntry(cached);
        this.cache.delete(cacheKey);
      }

      const connections: Record<string, MCPConnection> = {};
      for (const entry of entries) {
        const rendered = await renderMCPOptions(entry, this.options.app, ctx);
        connections[entry.name] = this.options.buildConnection(rendered);
      }

      client = new MultiServerMCPClient(connections);
      const initializedToolsMap = await client.initializeConnections();
      const toolsMap = Object.fromEntries(
        Object.entries(initializedToolsMap).map(([serverName, tools]) => [
          serverName,
          tools as StructuredToolInterface[],
        ]),
      );

      this.cache.set(cacheKey, {
        client,
        toolsMap,
        expiresAt: now + this.ttlMs,
        lastAccessedAt: now,
      });
      client = null;
      await this.evictOversized();

      return toolsMap;
```

</details>

**依据 2 · 源码核查**：[packages/core/ai/src/mcp-manager/options-renderer.ts:88-132](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/core/ai/src/mcp-manager/options-renderer.ts#L88-L132)

动态请求授权变量

<details>
<summary>查看原文（45行）</summary>

```text
  headers: ctx?.request?.headers ?? {},
  token: ctx?.getBearerToken?.() ?? '',
});

const emptyRequestVariables = {
  headers: {},
  token: '',
};

export const normalizeMCPOptions = (options: MCPOptions): MCPOptions => {
  const normalized: MCPOptions = {
    ...options,
    args: stringifyArray(options.args),
    env: stringifyRecord(options.env),
    headers: stringifyRecord(options.headers),
    useUserContext: options.transport === 'stdio' ? false : options.useUserContext === true,
  };

  if (normalized.transport === 'stdio') {
    normalized.url = undefined;
    normalized.headers = {};
  }
  return normalized;
};

export async function renderMCPOptions(
  options: MCPOptions,
  app: { environment?: { getVariables?: () => Record<string, unknown> } },
  ctx?: Context,
): Promise<MCPOptions> {
  const currentUser = options.useUserContext ? await getCurrentUser(ctx, options) : undefined;
  const request = options.useUserContext ? getRequestVariables(ctx) : emptyRequestVariables;
  const variables = {
    $env: app.environment?.getVariables?.() ?? {},
    currentUser,
    $user: currentUser,
    request,
    ctx: {
      currentUser,
      request,
    },
  };

  return normalizeMCPOptions(parse(options)(variables) as MCPOptions);
}
```

</details>

**依据 3 · 源码核查**：[packages/plugins/@nocobase/plugin-ai/src/server/ai-employees/middleware/tools.ts:108-132](https://github.com/nocobase/nocobase/blob/9d752bb60d8eca5883e4357eefbff46d56c941d1/packages/plugins/%40nocobase/plugin-ai/src/server/ai-employees/middleware/tools.ts#L108-L132)

中断与done边界

<details>
<summary>查看原文（25行）</summary>

```text
          body: { toolCall, error: e },
          currentConversation,
        });
        return new ToolMessage({
          tool_call_id: request.toolCall.id,
          status: 'error',
          content: e.message,
          metadata: {
            messageId,
          },
        });
      } finally {
        if (!interrupted) {
          await aiEmployee.updateToolCallDone(messageId, request.toolCall.id, result);
          const toolCallResult = await aiEmployee.getToolCallResult(messageId, request.toolCall.id);
          runtime.writer?.({
            action: 'afterToolCall',
            body: { toolCall, toolCallResult },
            currentConversation,
          });
        }
      }
    },
  });
};
```

</details>

#### 缺口

- 权限上下文版本/收据改进没有同任务对照或真实需求证据
  **影响**：不能确认业务办结、全路径权限或净交付收益
  **进一步探讨**：以匿名业务数据的隔离应用，对照简单CRUD/人工流程，记录权限拒绝、重复执行、正确率和总人工时间

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
