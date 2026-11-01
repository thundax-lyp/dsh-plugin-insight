# NocoBase

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[af4889f](https://github.com/nocobase/nocobase/tree/af4889f67b619d0dd1a039e45bbc5dd871d225f8)

<!-- BEGIN META -->
[![GitHub ★ 24,798](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=24%2C798&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/nocobase/nocobase)
<!-- END META -->

> **功能**：以无代码配置数据、页面、权限和工作流，并可接入 AI 员工与外部工具。

> **亮点**：相对逐项手写业务 CRUD 与模型接口，平台将数据与角色权限、可视化配置和 AI 工作流工具纳入同一业务底座；模型和底层数据库并非本项目原创。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

> **主要限制**：ACL 入口和调用状态不能证明所有 AI 路径同权限，也不能保证外部动作可撤销；同用户缓存和以 get 命名推断自动调用需在真实配置下核验。[Q02](#research-q02) [Q04](#research-q04)

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
  - [Q01 · 谁需要该平台，与简单 CRUD、表格及自建服务相比交付什么？](#detail-section-11)
  - [Q02 · 请求授权如何从入口连接角色和数据范围？](#detail-section-12)
  - [Q03 · AI 如何调用工作流，审批和结果如何关联？](#detail-section-13)
  - [Q04 · MCP 用户连接缓存、工具权限及工作流失败有哪些边界？](#detail-section-14)
  - [Q05 · 运行、配置和恢复有哪些依赖与成本，何时试用或退出？](#detail-section-15)
  - [Q06 · 能否以权限版本及副作用收据改善不确定性？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要反复建设内部数据录入和审批系统的业务及技术团队可用平台组合数据、页面和流程；它是独立平台，不是 DSH 插件。[Q01](#research-q01)

简单表格、人工审批或自建 CRUD 可以处理部分场景；平台提供可组合的配置和业务工具接线，未实测整体效果或节时。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 资源授权 | 基于角色及资源动作解析权限参数 | 不证明所有 AI 入口自动经过相同路径 |
| AI 工作流 | 将启用的 AI 员工流程注册为工具 | 中断取决于调用策略，输出不等同业务验收 |
| 用户 MCP | 按用户上下文建立并缓存外部工具 | 用户 ID 缓存和远端授权需要核查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 及受支持的数据源 | 平台部署需要 | 运行服务与持久化 | 先核对目标发行物和环境 |
| 用户、角色与数据模型 | 实际业务需要 | 定义行列与动作授权 | 不接入真实业务数据 |
| 模型服务或 MCP 凭据 | 对应 AI／外部工具路径需要 | 推理和工具调用 | 回退人工业务流程 |
| 备份和恢复方案 | 业务试点需要 | 恢复数据并对账外部动作 | 暂缓有副作用操作 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 管理员创建隔离实例和匿名数据 | 验证备份、角色与可用环境 |
| 建模 | 管理员配置数据模型、页面和两个角色 | 按动作与字段检查授权 |
| 验证 | 在人工、AI、MCP 和 workflow 入口测试允许、拒绝及撤权 | 任一入口不一致则停止自动化 |
| 恢复 | 模拟远端成功后本地失败并核对记录 | 状态不明先对账，不盲目重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 数据库、部署及适用许可费用未知 | 建模、角色配置和隔离 | 版本与许可需核验 |
| 持续 | 模型、MCP、计算与存储费用未知 | 审批、复核和规则维护 | 效果与工时未对照 |
| 恢复 | 备份、重放及服务资源未知 | 状态、外部结果和权限对账 | 未知能否回滚或幂等 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 业务工作流调用 | 启用流程可被注册并触发 | 任务成功率和节时 |
| 权限与用户连接 | 资源 ACL、工具权限及上下文缓存存在 | 所有入口一致性与撤权时效 |

> **思考**：ACL 入口和调用状态不能证明所有 AI 路径同权限，也不能保证外部动作可撤销；同用户缓存和以 get 命名推断自动调用需在真实配置下核验。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对逐项手写业务 CRUD 与模型接口，平台将数据与角色权限、可视化配置和 AI 工作流工具纳入同一业务底座；模型和底层数据库并非本项目原创。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

启用时 ACL 将资源权限与参数解析接入认证后路径；AI 将工具审批决策和持久状态拆开，但动态 MCP 连接按用户 ID 缓存、工具默认权限部分依名称，需验证真实授权边界。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

ACL 入口和调用状态不能证明所有 AI 路径同权限，也不能保证外部动作可撤销；同用户缓存和以 get 命名推断自动调用需在真实配置下核验。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用匿名隔离实例和两个角色验证人工、AI、MCP 及 workflow 入口；对远端成功后本地失败进行对账，异常时停用相关工具并回退人工。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持资源 ACL、AI 工作流调用及部分 MCP 缓存路径；未运行目标、数据库、模型、外部服务或权限撤销实验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/core/server/src/main-data-source.ts、packages/core/acl/src/acl.ts、packages/core/ai/src/mcp-manager/user-context-client-manager.ts、packages/core/ai/src/mcp-manager/options-renderer.ts、packages/core/ai/src/mcp-manager/index.ts、packages/plugins/@nocobase/plugin-ai/src/server/plugin.ts、packages/plugins/@nocobase/plugin-ai/src/server/tools/workflow-caller.ts、packages/plugins/@nocobase/plugin-ai/src/server/ai-employees/ai-employee.ts、packages/plugins/@nocobase/plugin-ai/src/server/ai-employees/middleware/tools.ts、packages/plugins/@nocobase/plugin-workflow/src/server/Processor.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根仓库的 22686 个入选文件按指定 Markdown 与 JS/TS 口径统计；492 项由路径启发式排除，其中包括 packages/core/build/src 下的真实源码，故不代表全语言或全部源码规模。源码定向抽读 ACL、AI 工作流和 MCP 用户上下文代表链，未审计全部插件、模型或部署；未执行目标。
- 下一步：在隔离宿主按角色和字段覆盖人工、AI、MCP 和 workflow，模拟权限撤销、换 token、远端成功后中断，记录对账结果和成本。

**分析版本**

- **仓库**：[nocobase/nocobase](https://github.com/nocobase/nocobase)
- **版本号**：未声明（[固定提交 af4889f](https://github.com/nocobase/nocobase/tree/af4889f67b619d0dd1a039e45bbc5dd871d225f8)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：可信权限上下文版本驱动用户连接失效，并将业务操作 ID 与远端收据用于恢复对账；以现有 TTL、配置清理和调用状态为对照，测授权、重复写、误拒及恢复成本。[Q06](#research-q06)

在隔离宿主按角色和字段覆盖人工、AI、MCP 和 workflow，模拟权限撤销、换 token、远端成功后中断，记录对账结果和成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11375 | 1064927 | — | — | 6400815 |
| .ts | source | 4182 | 606029 | 510181 | 50699 | — |
| .js | source | 458 | 12266 | 10057 | 1300 | — |
| .md | example | 163 | 19673 | — | — | 98455 |
| .tsx | source | 3848 | 491597 | 415792 | 38299 | — |
| .mjs | source | 14 | 1791 | 1419 | 177 | — |
| .ts | example | 52 | 9075 | 8340 | 505 | — |
| .ts | test | 1848 | 532686 | 456898 | 26680 | — |
| .md | test | 10 | 181 | — | — | 1167 |
| .js | test | 20 | 759 | 550 | 116 | — |
| .tsx | test | 569 | 118394 | 98430 | 6083 | — |
| .tsx | example | 142 | 14198 | 12399 | 788 | — |
| .mts | source | 2 | 6 | 4 | 0 | — |
| .js | example | 1 | 13 | 4 | 8 | — |
| .mjs | test | 2 | 879 | 674 | 161 | — |

</details>

**活跃度**

[![Issue 未关闭 121](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=121&color=737b86&logo=github)](https://github.com/nocobase/nocobase/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=23&color=737b86&logo=github)](https://github.com/nocobase/nocobase/issues?q=is%3Aissue+created%3A2026-10-02T07%3A48%3A06.617Z..2026-11-01T07%3A48%3A06.617Z) [![近30天关闭 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=17&color=737b86&logo=github)](https://github.com/nocobase/nocobase/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T07%3A48%3A06.617Z..2026-11-01T07%3A48%3A06.617Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：数据模型、AI 工具及工作流能否组成可控业务交付，权限、恢复与采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要该平台，与简单 CRUD、表格及自建服务相比交付什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

NocoBase 仓库根是独立的 AI 与无代码业务应用平台，并非 DSH 原生插件。需要重复构建内部数据录入、角色权限和审批的业务与技术团队，可通过可视化配置数据、页面和流程，并在需要时接入 AI；合格成果应包括经角色验证的业务数据和可追踪流程，而不只是生成界面。README 是作者对协作及效果的主张；相对表格和手工 CRUD，它提供可组合的模型、权限与流程基础，但数据库、模型和底层技术来自依赖。任务正确率、迁移和总工时没有同条件对照，不能以功能数量证明经济收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-20](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/README.md#L17-L20)

作者描述 AI 与无代码业务平台。

```text
## What is NocoBase

NocoBase is an open-source AI + no-code platform for building business systems fast. Instead of generating everything from scratch, AI works on top of production-proven infrastructure and a WYSIWYG no-code interface, so you get both speed and reliability.

```

**依据 2 · 作者声明**：[README.md:61-79](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/README.md#L61-L79)

作者说明 AI、可视化配置和业务建模。

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[package.json:1-11](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/package.json#L1-L11)

根包、工作区和运行环境。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

#### 缺口

- 实际使用者、重复业务需求及对照结果未核验
  **影响**：不能证明节时或相对现有系统更合适
  **进一步探讨**：以同一匿名审批流程比较合格率、人工和资源成本

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求授权如何从入口连接角色和数据范围？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

main-data-source 在 useACL 未设为 false 时，为资源管理器在 auth 之后挂载 ACL 中间件；ACL 从请求上下文读取角色，按资源和动作得到权限并交给核心中间件解析参数。缺少权限导致 NoPermissionError 时返回 403，允许的参数可合并到资源动作；多角色按源码合并授权参数，root 有特殊分支。这个链条说明受该数据源资源入口约束的请求怎样进入权限解析，不证明任意 AI、MCP 或 workflow 内部调用都自动走该入口，也不证明业务配置正确。需要独立测试每种入口、字段、行过滤及角色组合。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/server/src/main-data-source.ts:22-38](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/core/server/src/main-data-source.ts#L22-L38)

useACL 未禁用时在认证后挂载资源 ACL。

<details>
<summary>查看原文（17行）</summary>

```text
    this.acl = acl;
    this.resourceManager = resourceManager;

    this.collectionManager = this.createCollectionManager({
      collectionManager: {
        database,
        collectionsFilter: (collection) => {
          return collection.options.loadedFromCollectionManager;
        },
      },
    });

    if (options.useACL !== false) {
      this.resourceManager.use(this.acl.middleware(), { group: 'acl', after: 'auth' });
    }
  }

```

</details>

**依据 2 · 源码核查**：[packages/core/acl/src/acl.ts:237-267](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/core/acl/src/acl.ts#L237-L267)

多角色授权结果合并。

<details>
<summary>查看原文（31行）</summary>

```text
  can(options: CanArgs): CanResult | null {
    if (options.role) {
      return lodash.cloneDeep(this.getCanByRole(options));
    }
    if (options.roles?.length) {
      if (options.roles.includes('root')) {
        options.roles = ['root'];
      }
      return lodash.cloneDeep(this.getCanByRoles(options));
    }

    return null;
  }

  private getCanByRoles(options: CanArgs) {
    let canResult: CanResult | null = null;

    for (const role of options.roles) {
      const result = this.getCanByRole({
        role,
        ...options,
      });
      if (!canResult) {
        canResult = result;
        canResult && removeEmptyParams(canResult.params);
      } else if (canResult && result) {
        canResult.params = mergeAclActionParams(canResult.params, result.params);
      }
    }

    return canResult;
```

</details>

**依据 3 · 源码核查**：[packages/core/acl/src/acl.ts:387-412](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/core/acl/src/acl.ts#L387-L412)

按当前角色、资源和动作计算权限。

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

**依据 4 · 源码核查**：[packages/core/acl/src/acl.ts:474-516](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/core/acl/src/acl.ts#L474-L516)

核心处理中权限参数和 403 分支。

<details>
<summary>查看原文（43行）</summary>

```text
  protected addCoreMiddleware() {
    const acl = this;

    this.middlewares.add(
      async (ctx, next) => {
        const resourcerAction: Action = ctx.action;
        const { resourceName, actionName } = ctx.permission;
        const permission = ctx.permission;

        ctx.log?.debug && ctx.log.debug('ctx permission', permission);

        if (['firstOrCreate', 'updateOrCreate'].includes(actionName)) {
          permission.deferred = true;
          await next();
          return;
        }

        try {
          const result = await acl.resolvePermissionParams(ctx, {
            actionName,
            can: permission.can,
            params: resourcerAction.params,
            rawResourceName: ctx.action.resourceName,
            resourceName,
            skip: permission.skip,
          });

          if (result.parsedParams && resourcerAction.mergeParams) {
            ctx.permission.parsedParams = result.parsedParams;
            ctx.log?.debug && ctx.log.debug('acl parsedParams', result.parsedParams);
            ctx.permission.rawParams = result.rawParams;
            resourcerAction.params = result.mergedParams;
            ctx.permission.mergedParams = lodash.cloneDeep(resourcerAction.params);
          }
        } catch (e) {
          if (e instanceof NoPermissionError) {
            ctx.throw(403, 'No permissions');
            return;
          }

          throw e;
        }

```

</details>

#### 缺口

- 所有数据源和 AI 工作流入口没有逐一贯通或运行
  **影响**：不能推广为所有路径均具有一致的行列授权
  **进一步探讨**：隔离环境按角色逐入口测试允许和拒绝及结果字段

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · AI 如何调用工作流，审批和结果如何关联？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

AI 插件注册动态 workflowCaller；提供器从已启用缓存选择 ai-employee 类型流程，按配置构造 Zod 参数，注册后调用 workflow.trigger，仅将工具参数作为流程上下文传给 trigger（并未直接把调用时的 ctx 作为该参数），并从 execution.output 或最后 job 的 result 取输出；空内容和负状态返回错误，其余输出截断后返回。工具调用中间件会根据执行位置或自动调用权限决定是否进入人机中断，状态中间件先标 pending，执行 handler 后写 done 与结果，异常记录 error，GraphInterrupt 不走正常完成。批准是条件性的，不是所有工具都必须人工批准；这一链把模型请求接到既有业务流程，不能据此证明成功结果满足业务验收或任意权限自动继承。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/@nocobase/plugin-ai/src/server/plugin.ts:194-203](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/plugins/%40nocobase/plugin-ai/src/server/plugin.ts#L194-L203)

AI 插件注册动态工作流及 MCP 工具。

<details>
<summary>查看原文（10行）</summary>

```text
  registerTools() {
    const toolsManager = this.ai.toolsManager;

    toolsManager.registerTools([createDocsSearchTool(this)]);

    toolsManager.registerDynamicTools(getWorkflowCallers(this, 'workflowCaller'));
    toolsManager.registerDynamicTools(getWorkflowTasks(this));

    // Register MCP tools dynamically
    toolsManager.registerDynamicTools(this.ai.mcpManager.getMCPToolsProvider());
```

</details>

**依据 2 · 源码核查**：[packages/plugins/@nocobase/plugin-ai/src/server/tools/workflow-caller.ts:40-84](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/plugins/%40nocobase/plugin-ai/src/server/tools/workflow-caller.ts#L40-L84)

配置转为参数 Schema。

<details>
<summary>查看原文（45行）</summary>

```text
const buildSchema = (config: ToolConfig): z.ZodObject<any> => {
  const schemaProperties: Record<string, z.ZodTypeAny> = {};
  if (config.parameters?.length) {
    config.parameters.forEach((item) => {
      let fieldSchema: z.ZodTypeAny;

      switch (item.type) {
        case 'string':
          fieldSchema = z.string();
          break;
        case 'number':
          fieldSchema = z.number();
          break;
        case 'boolean':
          fieldSchema = z.boolean();
          break;
        case 'enum':
          if (item.options && item.options.length > 0) {
            const enumValues = item.options.map((option) => option.value);
            if (typeof enumValues[0] === 'number') {
              const values = enumValues.map(String) as [string, ...string[]];
              fieldSchema = z.enum(values).transform((v) => Number(v));
            } else {
              fieldSchema = z.enum(enumValues as [string, ...string[]]);
            }
          } else {
            fieldSchema = z.string();
          }
          break;
        default:
          fieldSchema = z.any();
      }

      if (item.description) {
        fieldSchema = fieldSchema.describe(item.description);
      }
      if (!item.required) {
        fieldSchema = fieldSchema.optional();
      }
      schemaProperties[item.name] = fieldSchema;
    });
  }

  const schema = z.object(schemaProperties);
  return schema.describe(config.description || '');
```

</details>

**依据 3 · 源码核查**：[packages/plugins/@nocobase/plugin-ai/src/server/tools/workflow-caller.ts:87-127](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/plugins/%40nocobase/plugin-ai/src/server/tools/workflow-caller.ts#L87-L127)

注册启用流程并触发和处理输出。

<details>
<summary>查看原文（41行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[packages/plugins/@nocobase/plugin-ai/src/server/ai-employees/ai-employee.ts:1604-1619](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/plugins/%40nocobase/plugin-ai/src/server/ai-employees/ai-employee.ts#L1604-L1619)

前端与自动调用策略决定是否中断。

<details>
<summary>查看原文（16行）</summary>

```text
  shouldInterruptToolCall(tools: ToolsEntry): boolean {
    return tools?.execution === 'frontend' || !this.isAutoCall(tools);
  }

  isAutoCall(tools: ToolsEntry): boolean {
    if (!tools) {
      return false;
    }
    const isAutoCall = tools.defaultPermission === 'ALLOW';
    if (tools.scope !== 'CUSTOM') {
      return isAutoCall;
    }
    const employeeTools = this.employee.skillSettings?.tools ?? [];
    const presetTools = employeeTools.find((s) => s.name === tools.definition.name);
    return presetTools ? presetTools.autoCall : isAutoCall;
  }
```

</details>

**依据 5 · 源码核查**：[packages/plugins/@nocobase/plugin-ai/src/server/ai-employees/middleware/tools.ts:16-35](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/plugins/%40nocobase/plugin-ai/src/server/ai-employees/middleware/tools.ts#L16-L35)

中断时允许 approve、reject、edit。

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

**依据 6 · 源码核查**：[packages/plugins/@nocobase/plugin-ai/src/server/ai-employees/middleware/tools.ts:55-75](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/plugins/%40nocobase/plugin-ai/src/server/ai-employees/middleware/tools.ts#L55-L75)

读取结果并置 pending。

<details>
<summary>查看原文（21行）</summary>

```text
      const tm = await aiEmployee.getToolCallResult(messageId, request.toolCall.id);
      if (!tm) {
        throw new Error(`Tool call result not found for messageId=${messageId}, toolCallId=${request.toolCall.id}`);
      }
      if (tm.status === 'error') {
        runtime.writer?.({
          action: 'afterToolCall',
          body: { toolCall, toolCallResult: tm },
          currentConversation,
        });
        return new ToolMessage({
          tool_call_id: request.toolCall.id,
          status: 'error',
          content: tm.content,
          metadata: {
            messageId,
          },
        });
      }

      await aiEmployee.updateToolCallPending(messageId, request.toolCall.id);
```

</details>

**依据 7 · 源码核查**：[packages/plugins/@nocobase/plugin-ai/src/server/ai-employees/middleware/tools.ts:98-128](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/plugins/%40nocobase/plugin-ai/src/server/ai-employees/middleware/tools.ts#L98-L128)

异常及非中断完成分支。

<details>
<summary>查看原文（31行）</summary>

```text
        return toolMessage;
      } catch (e) {
        if (e.name === 'GraphInterrupt') {
          interrupted = true;
          throw e;
        }
        aiEmployee.logger.error(e);
        result = { status: 'error', content: e.message };
        runtime.writer?.({
          action: 'afterToolCallError',
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
```

</details>

#### 缺口

- 真实模型、流程类型和宿主上下文尚未运行
  **影响**：不能断言端到端审批、授权或业务结果
  **进一步探讨**：以隔离假数据测试不同自动调用配置、拒绝与流程结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · MCP 用户连接缓存、工具权限及工作流失败有哪些边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

用户上下文 MCP 仅选择启用、非 stdio 且 useUserContext 的连接，以当前用户 ID 为缓存键；默认 TTL 五分钟、最大 100 条，失效或超量会关闭连接，初始化失败则记录警告并返回空工具。选项渲染可使用当前用户、请求头和 bearer token，但命中缓存直接返回旧 toolsMap；源码也在 MCP 客户端配置增删改提交后清空缓存，这是重要反证。所检查的缓存键没有角色或 token 版本，因此相同用户的上下文变动能否即时生效取决于缓存失效、服务端再次鉴权和实际配置；不能仅凭此断言已发生越权。MCP 默认权限按工具名是否以 get 开头分 ALLOW/ASK，名称前缀并不能证明远端动作只读。workflow 的数据库 scope 清理可提交或回滚已有事务，但不能由此推断外部 MCP 或流程动作已撤销。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/ai/src/mcp-manager/user-context-client-manager.ts:33-76](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/core/ai/src/mcp-manager/user-context-client-manager.ts#L33-L76)

用户 ID 键、TTL 和上下文渲染。

<details>
<summary>查看原文（44行）</summary>

```text
export class UserContextMCPClientManager {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly ttlMs: number;
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
```

</details>

**依据 2 · 源码核查**：[packages/core/ai/src/mcp-manager/user-context-client-manager.ts:79-108](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/core/ai/src/mcp-manager/user-context-client-manager.ts#L79-L108)

缓存工具及初始化失败返回空。

<details>
<summary>查看原文（30行）</summary>

```text
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
    } catch (error) {
      if (client) {
        await this.closeEntry({
          client,
          toolsMap: {},
          expiresAt: 0,
          lastAccessedAt: 0,
        });
      }
      this.options.app?.log?.warn?.('fail to get user-bound mcp tools', error);
      return {};
```

</details>

**依据 3 · 源码核查**：[packages/core/ai/src/mcp-manager/user-context-client-manager.ts:112-147](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/core/ai/src/mcp-manager/user-context-client-manager.ts#L112-L147)

清理过期与容量及关闭连接。

<details>
<summary>查看原文（36行）</summary>

```text
  async clear() {
    const entries = [...this.cache.values()];
    this.cache.clear();
    await Promise.all(entries.map((entry) => this.closeEntry(entry)));
  }

  private evictExpired() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key);
        this.closeEntry(entry).catch((error) => {
          this.options.app?.log?.warn?.('fail to close expired user-bound mcp client', error);
        });
      }
    }
  }

  private async evictOversized() {
    while (this.cache.size > this.maxSize) {
      const oldest = [...this.cache.entries()].sort(
        ([, left], [, right]) => left.lastAccessedAt - right.lastAccessedAt,
      )[0];
      if (!oldest) {
        return;
      }
      this.cache.delete(oldest[0]);
      await this.closeEntry(oldest[1]);
    }
  }

  private async closeEntry(entry: CacheEntry) {
    try {
      await entry.client.close();
    } catch (error) {
      this.options.app?.log?.warn?.('fail to close user-bound mcp client', error);
```

</details>

**依据 4 · 源码核查**：[packages/core/ai/src/mcp-manager/options-renderer.ts:87-90](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/core/ai/src/mcp-manager/options-renderer.ts#L87-L90)

请求头和 token 可作为变量。

```text
const getRequestVariables = (ctx?: Context) => ({
  headers: ctx?.request?.headers ?? {},
  token: ctx?.getBearerToken?.() ?? '',
});
```

**依据 5 · 源码核查**：[packages/core/ai/src/mcp-manager/index.ts:157-197](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/core/ai/src/mcp-manager/index.ts#L157-L197)

注册工具、转发调用和基于名称的默认权限。

<details>
<summary>查看原文（41行）</summary>

```text
  private registerToolsFromMap(
    register: ToolsRegistration,
    serverName: string,
    tools: StructuredToolInterface[],
  ): void {
    for (const tool of tools) {
      const toolName = `mcp-${serverName}-${tool.name}`;
      this.ensureToolPermission(toolName, tool.name);
      const toolOptions: ToolsOptions = {
        scope: 'GENERAL',
        from: 'mcp',
        defaultPermission: this.toolsPermissionMap[toolName],
        introduction: {
          title: tool.name,
          about: tool.description,
        },
        definition: {
          name: toolName,
          description: tool.description || `MCP tool: ${tool.name} from ${serverName}`,
          schema: tool.schema,
        },
        invoke: async (_ctx: Context, args: any) => {
          try {
            const result = await tool.invoke(args);
            return result;
          } catch (error: any) {
            return {
              status: 'error' as const,
              content: error?.message || 'Tool invocation failed',
            };
          }
        },
      };
      register.registerTools(toolOptions);
    }
  }

  private ensureToolPermission(toolName: string, rawToolName: string) {
    if (!(toolName in this.toolsPermissionMap)) {
      this.toolsPermissionMap[toolName] = rawToolName.startsWith('get') ? 'ALLOW' : 'ASK';
    }
```

</details>

**依据 6 · 源码核查**：[packages/plugins/@nocobase/plugin-ai/src/server/plugin.ts:251-283](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/plugins/%40nocobase/plugin-ai/src/server/plugin.ts#L251-L283)

客户端配置变更后清缓存的反证。

<details>
<summary>查看原文（33行）</summary>

```text
  registerMcpClientEvents() {
    this.db.on('aiMcpClients.afterCreate', (model: MCPClientModel, { transaction }: TransactionOptions = {}) => {
      if (model.get('useUserContext') === true) {
        this.clearMcpUserContextCacheAfterCommit(transaction);
      }
    });

    this.db.on('aiMcpClients.afterUpdate', (model: MCPClientModel, { transaction }: TransactionOptions = {}) => {
      if (model.get('useUserContext') === true || model.previous('useUserContext') === true) {
        this.clearMcpUserContextCacheAfterCommit(transaction);
      }
    });

    this.db.on('aiMcpClients.afterDestroy', (model: MCPClientModel, { transaction }: TransactionOptions = {}) => {
      if (model.get('useUserContext') === true) {
        this.clearMcpUserContextCacheAfterCommit(transaction);
      }
    });
  }

  private clearMcpUserContextCacheAfterCommit(transaction?: Transaction) {
    const clearCache = () => {
      this.ai.mcpManager.clearUserContextCache().catch((error) => {
        this.app.log.warn('fail to clear user-bound mcp client cache', error);
      });
    };

    if (transaction) {
      transaction.afterCommit(clearCache);
      return;
    }

    clearCache();
```

</details>

**依据 7 · 源码核查**：[packages/plugins/@nocobase/plugin-workflow/src/server/Processor.ts:721-747](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/plugins/%40nocobase/plugin-workflow/src/server/Processor.ts#L721-L747)

未关闭的数据库事务清理。

<details>
<summary>查看原文（27行）</summary>

```text
  private async cleanupScopeTransactions({ allowCommit = false } = {}) {
    if (!this.scopeTransactions.size) {
      return;
    }
    for (const [key, { transaction, dataSource, closing }] of Array.from(this.scopeTransactions.entries()).reverse()) {
      const tx = transaction as TransactionWithFinished;
      if (tx.finished) {
        this.scopeTransactions.delete(key);
        continue;
      }
      const action = closing === 'commit' && allowCommit ? 'commit' : 'rollback';
      const actionText = action === 'commit' ? 'committing' : 'rolling back';
      this.logger.warn(
        `scope transaction (${key}) on data source "${dataSource}" was not closed before exit, ${actionText}`,
        {
          workflowId: this.execution.workflowId,
        },
      );
      try {
        await tx[action]();
      } catch (error) {
        this.logger.error(`scope transaction (${key}) fallback ${action} failed`, {
          error,
          workflowId: this.execution.workflowId,
        });
      } finally {
        this.scopeTransactions.delete(key);
```

</details>

#### 缺口

- 角色撤销、换 token、远端授权及恢复未做对抗或真实执行
  **影响**：不能确定缓存造成实际权限失效窗口或副作用重复
  **进一步探讨**：固定版本隔离服务记录权限变更、客户端配置变更和远端成功后本地失败

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 运行、配置和恢复有哪些依赖与成本，何时试用或退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

根工程声明 Node >=22 和工作区，作者提供 CLI 安装说明；业务应用还需实际配置兼容的数据源、用户和角色，AI 或 MCP 路径分别依赖模型服务或远端服务及凭据。源码头部和根包存在不同许可声明，具体目录、分发及商业使用应分别核对，不能从根包许可证概括所有插件。首次成本包括部署、建模和权限配置；持续成本包括服务、模型或外部调用、规则维护和人工审核；失败恢复需要备份、状态及外部副作用对账，金额与耗时未测。具备治理能力的团队可用匿名数据、小规模角色和只读或可撤销操作试用；若授权不一致、恢复状态不明或总成本不可接受，停止相关 AI/自动化入口并回到受控人工流程。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-11](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/package.json#L1-L11)

根工程和 Node 要求。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 2 · 作者声明**：[README.md:36-53](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/README.md#L36-L53)

作者安装和接入说明。

<details>
<summary>查看原文（18行）</summary>

````text
## Quick Start

```bash
# Install NocoBase CLI
npm install -g @nocobase/cli
nb --version

# Install a NocoBase app
nb init --ui

# Optional: build together with an AI Agent
codex # claude, opencode
```

Detailed steps:

- <a target="_blank" href="https://docs.nocobase.com/ai/install-nocobase-app">Install a NocoBase app</a>
- <a target="_blank" href="https://docs.nocobase.com/ai/quick-start">AI Agent Integration Guide</a>
````

</details>

**依据 3 · 源码核查**：[packages/plugins/@nocobase/plugin-ai/src/server/tools/workflow-caller.ts:1-7](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/plugins/%40nocobase/plugin-ai/src/server/tools/workflow-caller.ts#L1-L7)

该子目录源码声明双许可证，不能以根包代表。

```text
/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
```

**依据 4 · 源码核查**：[packages/core/ai/src/mcp-manager/user-context-client-manager.ts:43-76](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/core/ai/src/mcp-manager/user-context-client-manager.ts#L43-L76)

特定 MCP 连接配置与用户上下文。

<details>
<summary>查看原文（34行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[packages/plugins/@nocobase/plugin-workflow/src/server/Processor.ts:721-747](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/plugins/%40nocobase/plugin-workflow/src/server/Processor.ts#L721-L747)

范围事务的恢复边界。

<details>
<summary>查看原文（27行）</summary>

```text
  private async cleanupScopeTransactions({ allowCommit = false } = {}) {
    if (!this.scopeTransactions.size) {
      return;
    }
    for (const [key, { transaction, dataSource, closing }] of Array.from(this.scopeTransactions.entries()).reverse()) {
      const tx = transaction as TransactionWithFinished;
      if (tx.finished) {
        this.scopeTransactions.delete(key);
        continue;
      }
      const action = closing === 'commit' && allowCommit ? 'commit' : 'rollback';
      const actionText = action === 'commit' ? 'committing' : 'rolling back';
      this.logger.warn(
        `scope transaction (${key}) on data source "${dataSource}" was not closed before exit, ${actionText}`,
        {
          workflowId: this.execution.workflowId,
        },
      );
      try {
        await tx[action]();
      } catch (error) {
        this.logger.error(`scope transaction (${key}) fallback ${action} failed`, {
          error,
          workflowId: this.execution.workflowId,
        });
      } finally {
        this.scopeTransactions.delete(key);
```

</details>

#### 缺口

- 目标配置兼容性、授权许可、账单和人工时间未验证
  **影响**：无法估算部署可行性与单位合格任务成本
  **进一步探讨**：确认实际发行物与许可，在隔离副本计量全流程并测试备份恢复

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否以权限版本及副作用收据改善不确定性？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

基于 Q04 的用户 ID 缓存、配置变更清理和事务边界，提出未验证假设：由可信身份提供者向连接缓存传递可验证的权限上下文版本，在令牌/角色变化时只失效相关用户连接；对外部写动作关联业务操作 ID、远端收据及可重试状态，恢复时先对账再决定是否重放。现有 TTL、MCP 配置修改后全量清缓存、调用状态和数据库事务分别解决部分问题，提议不能被描述为当前已有的端到端方案，也不保证外部系统支持幂等。隔离环境以角色撤销、同用户换 token、连接配置更改、远端成功后进程中断为固定样本，对照现状，记录错误授权、重复写、误拒、延迟与人工恢复成本；若无改善、来源版本不可信或远端无查询/幂等能力使成本过高，则否定或收窄。

#### 证据与依据

**依据 1 · 源码核查**：[packages/core/ai/src/mcp-manager/user-context-client-manager.ts:38-76](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/core/ai/src/mcp-manager/user-context-client-manager.ts#L38-L76)

现有 TTL、用户键和上下文渲染。

<details>
<summary>查看原文（39行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[packages/plugins/@nocobase/plugin-ai/src/server/plugin.ts:251-283](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/plugins/%40nocobase/plugin-ai/src/server/plugin.ts#L251-L283)

现有配置变更后的清理。

<details>
<summary>查看原文（33行）</summary>

```text
  registerMcpClientEvents() {
    this.db.on('aiMcpClients.afterCreate', (model: MCPClientModel, { transaction }: TransactionOptions = {}) => {
      if (model.get('useUserContext') === true) {
        this.clearMcpUserContextCacheAfterCommit(transaction);
      }
    });

    this.db.on('aiMcpClients.afterUpdate', (model: MCPClientModel, { transaction }: TransactionOptions = {}) => {
      if (model.get('useUserContext') === true || model.previous('useUserContext') === true) {
        this.clearMcpUserContextCacheAfterCommit(transaction);
      }
    });

    this.db.on('aiMcpClients.afterDestroy', (model: MCPClientModel, { transaction }: TransactionOptions = {}) => {
      if (model.get('useUserContext') === true) {
        this.clearMcpUserContextCacheAfterCommit(transaction);
      }
    });
  }

  private clearMcpUserContextCacheAfterCommit(transaction?: Transaction) {
    const clearCache = () => {
      this.ai.mcpManager.clearUserContextCache().catch((error) => {
        this.app.log.warn('fail to clear user-bound mcp client cache', error);
      });
    };

    if (transaction) {
      transaction.afterCommit(clearCache);
      return;
    }

    clearCache();
```

</details>

**依据 3 · 源码核查**：[packages/plugins/@nocobase/plugin-ai/src/server/ai-employees/ai-employee.ts:1377-1414](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/plugins/%40nocobase/plugin-ai/src/server/ai-employees/ai-employee.ts#L1377-L1414)

现有调用 pending/done 状态。

<details>
<summary>查看原文（38行）</summary>

```text
  async updateToolCallPending(messageId: string, toolCallId: string) {
    const [updated] = await this.aiToolMessagesModel.update(
      {
        invokeStatus: 'pending',
        invokeStartTime: new Date(),
      },
      {
        where: {
          sessionId: this.sessionId,
          messageId,
          toolCallId,
          invokeStatus: {
            [Op.in]: ['init', 'waiting'],
          },
        },
      },
    );
    return updated;
  }

  async updateToolCallDone(messageId: string, toolCallId: string, result: any) {
    const [updated] = await this.aiToolMessagesModel.update(
      {
        invokeStatus: 'done',
        invokeEndTime: new Date(),
        status: result?.status ?? 'success',
        content: result?.content ?? result,
      },
      {
        where: {
          sessionId: this.sessionId,
          messageId,
          toolCallId,
          invokeStatus: 'pending',
        },
      },
    );
    return updated;
```

</details>

**依据 4 · 源码核查**：[packages/plugins/@nocobase/plugin-workflow/src/server/Processor.ts:721-747](https://github.com/nocobase/nocobase/blob/af4889f67b619d0dd1a039e45bbc5dd871d225f8/packages/plugins/%40nocobase/plugin-workflow/src/server/Processor.ts#L721-L747)

现有数据库事务清理。

<details>
<summary>查看原文（27行）</summary>

```text
  private async cleanupScopeTransactions({ allowCommit = false } = {}) {
    if (!this.scopeTransactions.size) {
      return;
    }
    for (const [key, { transaction, dataSource, closing }] of Array.from(this.scopeTransactions.entries()).reverse()) {
      const tx = transaction as TransactionWithFinished;
      if (tx.finished) {
        this.scopeTransactions.delete(key);
        continue;
      }
      const action = closing === 'commit' && allowCommit ? 'commit' : 'rollback';
      const actionText = action === 'commit' ? 'committing' : 'rolling back';
      this.logger.warn(
        `scope transaction (${key}) on data source "${dataSource}" was not closed before exit, ${actionText}`,
        {
          workflowId: this.execution.workflowId,
        },
      );
      try {
        await tx[action]();
      } catch (error) {
        this.logger.error(`scope transaction (${key}) fallback ${action} failed`, {
          error,
          workflowId: this.execution.workflowId,
        });
      } finally {
        this.scopeTransactions.delete(key);
```

</details>

#### 缺口

- 没有原型、可信版本来源或外部服务对账实验
  **影响**：无法证明方案有效、兼容或具备净收益
  **进一步探讨**：固定模拟身份和远端接口后对照现状测错误、延迟和恢复成本

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
