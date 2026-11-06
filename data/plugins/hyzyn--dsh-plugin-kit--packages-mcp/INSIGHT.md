# @hyzyn/dsh-mcp

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp)

<!-- BEGIN META -->
[![GitHub ★ 62](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=62&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyzyn/dsh-plugin-kit) [![npm 30d 3,978](https://img.shields.io/static/v1?label=npm+30d&message=3%2C978&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-mcp) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-mcp)
<!-- END META -->

> **功能**：在 DSH 中维护 MCP 服务配置、测试连接并查看工具状态，可按会话选择托管工具的可见范围。

> **亮点**：增量是把配置、探测与工具数量集中，并给模型提供选择当前会话托管server的入口。按需模式减少的是模型视图中的部分常驻schema，不是按需启停进程；默认仍为eager，效果与费用未知，见 [Q01](#research-q01)至[Q03](#research-q03)。

> **主要限制**：可见性限制缺少宿主scope服务或下发失败时保持原工具表，台账和返回投影不等于实际生效；外部工具也不在按需层的托管白名单内。测试还会求值js并执行命令，而共享补丁写入非严格事务，见 [Q03](#research-q03)和[Q04](#research-q04)。

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
  - [Q01 · 相对手改MCP配置，卡片和按需模式增加什么？](#detail-section-11)
  - [Q02 · 保存和测试分别做什么，是否已有实际工具可用？](#detail-section-12)
  - [Q03 · 按需可见性和档位限制覆盖哪些工具，失败怎样退化？](#detail-section-13)
  - [Q04 · 权限、表达式和并发写入有哪些采用边界？](#detail-section-14)
  - [Q05 · 全周期成本和采用条件是什么？](#detail-section-15)
  - [Q06 · 从三种状态错位可推导什么验证假设？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有可信MCP服务的DSH配置者可通过卡片维护连接与工具面，合格结果分别核对落盘、宿主连接和真实Agent工具表，见 [Q01](#research-q01)。

手改MCP补丁并查日志，或让所有工具常驻模型视图。本组件提供配置与可见性组织，不实现各server的业务能力，也不停止按需隐藏的server进程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| MCP配置维护 | 编辑stdio/HTTP托管行 | 写共享补丁，需可信配置与备份 |
| 连接探测 | initialize和tools/list握手 | 真实执行命令/请求，不替代宿主调用验收 |
| 状态与工具数 | 查看loader与注册表 | 零工具/未知不等于通用协议健康证明 |
| 按需可见性 | 模型选择当前会话托管server | 默认eager，外部工具不在此白名单，失败可能保留原表 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容DSH、共享kit与Web客户端 | 启动必需 | 卡片、路由与工具限制 | 缺scope/restrict可退回原工具表，不能当限制成功 |
| 宿主dsh-mcp-client与可信server | 实际工具使用必需 | 真正连接并注册业务工具 | 本包测试成功不替代宿主连接 |
| 可写home补丁及预先备份 | 保存必需 | 托管块更新 | 有限复核非事务，避免并发编辑 |
| 可信命令、表达式和凭据环境 | 探测必需 | stdio或HTTP测试 | js会求值、stdio会执行，不是沙箱 |
| Agent scoped tools与档位服务 | 可见性限制必需 | 按需及档位投影 | 缺少或失败可能保持原表，须真实回读 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份共享补丁，选一条已知可信server | 不试运行未知表达式或命令 |
| 保存 | 卡片校验并写托管块 | 回读只改预期区域，保存不是连接成功 |
| 测试 | 用户显式启动独立握手探测 | 另核对宿主工具实际注册与调用 |
| 选择 | on-demand下模型用mcp_load选择托管server | 比较真实Agent请求工具表，不只看台账 |
| 退出 | 停用托管行并恢复备份 | 核对进程与工具撤销，实际释放未测 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包、server启动和测试网络，费用未知 | 配命令/cwd/凭据、备份并核对三状态 | 探测本身有执行副作用 |
| 持续使用 | server进程、连接和模型schema资源，量未知 | 维护服务、命名与宿主版本 | on-demand不停止进程，可能增加选服回合 |
| 失败恢复 | 重连、测试与配置还原资源未知 | 对比探测、热加载和工具面，恢复备份 | 共享文件可能并发覆盖 |
| 退出 | 外部server资源依部署保留 | 停用托管行并查实际进程/工具 | 不把模型看不见等同进程已停 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 配置便利 | 卡片校验并写托管块 | 热加载最终成功与并发保全 |
| 连接诊断 | 独立initialize/tools-list探测 | 与宿主真实连接/业务调用一致 |
| 按需工具表 | scoped restrict与managed白名单 | 实际生效、权限完整性及任务净费用 |

> **思考**：可见性限制缺少宿主scope服务或下发失败时保持原工具表，台账和返回投影不等于实际生效；外部工具也不在按需层的托管白名单内。测试还会求值js并执行命令，而共享补丁写入非严格事务，见 [Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：增量是把配置、探测与工具数量集中，并给模型提供选择当前会话托管server的入口。按需模式减少的是模型视图中的部分常驻schema，不是按需启停进程；默认仍为eager，效果与费用未知，见 [Q01](#research-q01)至[Q03](#research-q03)。

可借鉴的是共享DTO、托管白名单和工具生命周期清理，避免无差别隐藏外部server。限制下发失败与预期台账仍可错位，有限文件复核与js求值也要求可信配置，见 [Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

可见性限制缺少宿主scope服务或下发失败时保持原工具表，台账和返回投影不等于实际生效；外部工具也不在按需层的托管白名单内。测试还会求值js并执行命令，而共享补丁写入非严格事务，见 [Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先备份共享补丁，仅在非关键profile用已知可信server核对保存、宿主连接和真实Agent工具表三种状态。未知命令与js不为连接测试而执行；出现无关行变化或状态矛盾时停用托管并恢复备份，回原配置与日志。具体判据见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

配置写入、探测和按需限制的接线为源码事实；热加载、真实工具调用、隔离及节省未在本轮运行验证。三状态回读为未验证设计。

- 已检查：作者 README、包清单、源码路径 packages/mcp/README.md、packages/mcp/package.json、packages/mcp/src/index.ts、packages/mcp/src/agent-surface.ts、packages/mcp/client.js、packages/kit/src/tier-restrict.ts 及固定范围 inventory；组件：packages/mcp。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：INVENTORY覆盖子包；定向核对Host配置/写入/DTO/探测/路由/工具注册，agent-surface及客户端连接状态判据，并保存直接kit tier-restrict说明退化。未全面审计HTTP/SSE所有协议分支、各server语义或宿主MCP内部。
- 下一步：- 已检查固定版本源码与作者说明。
- 未运行连接测试、server、目标测试或宿主验收。
- 作者请求字节测量未当本轮收益，工具可见性不称完整权限沙箱。
- 共享kit与宿主实际投影、热加载和资源清理未运行验证。

**分析版本**

- **仓库**：[hyzyn/dsh-plugin-kit](https://github.com/hyzyn/dsh-plugin-kit)
- **版本号**：0.3.13（[固定提交 44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是把配置版本、宿主连接和实际Agent工具表分别回读，明确预期与生效的差异，避免保存或探测成功掩盖运行失败。验证与否定条件见 [Q06](#research-q06)。

- 已检查固定版本源码与作者说明。
- 未运行连接测试、server、目标测试或宿主验收。
- 作者请求字节测量未当本轮收益，工具可见性不称完整权限沙箱。
- 共享kit与宿主实际投影、热加载和资源清理未运行验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 3497 | 2616 | 804 | — |
| .md | source | 2 | 471 | — | — | 7544 |
| .mjs | source | 1 | 81 | 64 | 9 | — |
| .ts | source | 2 | 2301 | 1557 | 609 | — |
| .ts | test | 8 | 1995 | 1434 | 319 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hyzyn/dsh-plugin-kit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/hyzyn/dsh-plugin-kit/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/hyzyn/dsh-plugin-kit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：MCP配置与按需工具可见性能减少什么负担，保存、测试和模型可调用是否被正确区分？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对手改MCP配置，卡片和按需模式增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向已经明确需要哪些可信MCP服务、希望在DSH中维护连接配置与工具表的人。原办法是手改补丁后查看宿主日志，或让全部已注册工具常驻模型视图。卡片把行校验、连接探测和宿主状态集中显示；可选on-demand模式通过mcp_servers和mcp_load让模型为当前会话选择托管server。默认仍是eager，不应将按需模式描述成所有用户自动生效。

本组件不是MCP服务实现，也不替代宿主dsh-mcp-client完成真实工具连接与调用。它改变的是配置与可见性组织：实际工具仍由宿主注册，按需只在Agent视图层隐藏未选择的托管工具，不会自动停掉server进程。合格结果要分别核对配置落盘、宿主连接与当前Agent真正工具表，不能只用“已保存”或“已加载”替代这三步。是否减少净token费用和任务错误没有本轮测量。

#### 证据与依据

**依据 1 · 作者声明**：[packages/mcp/README.md:5-13](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/README.md#L5-L13)

作者区分配置、测试与宿主真实连接。

```text
> DSH 的「MCP 服务器配置」卡片：图形化维护 MCP 服务器，**保存即热加载**，不用重启宿主。

## 特性

- **保存即热加载**：改写 `~/.dsh/cordis.patch.yml` 的托管区块，DSH 的 HMR 监听自动重载，工具以 `mcp__<server>__<tool>` 注册给模型。
- **stdio 与 streamable-http 双传输**：stdio（command / args / env / cwd）与 streamable-http（url / headers，含 SSE 与 session 头）；值可写 `js:` 表达式，密钥不落补丁文件。
- **连接测试不经 MCP SDK**：宿主直接说 JSON-RPC（initialize → tools/list），返回协议版本 / serverInfo / 工具清单 / 耗时。启动子进程与读 stderr 走 `@hyzyn/dsh-kit` 的 `spawnPortable` / 容错解码器（Windows `.cmd` shim 与代码页那两个坑见 [kit README](../kit/README.md)），所以探测不会永久报 `EINVAL` 并被误读成「CLI 没装好」，卡片上也不会出现 `���`。这只影响本插件的探测：**真正的工具加载**走 DSH 核心的 `@deepseek-ai/dsh-mcp-client`（官方 SDK + cross-spawn），本来就没这个问题。探测对**错误**也有判据：POST / GET 收到 401/403 当场报 `认证失败(HTTP 401)`（带 `WWW-Authenticate`），其它 4xx/5xx 报状态码——认证失败不会再被兜底成「SSE 流已结束」；`js:` 头或 stdio `env` 的值求值出 `undefined` 时（含被 base64 藏进 `Basic …` 的形态）在发请求 / 起进程前点名缺哪几个环境变量。
- **存活状态与命名冲突可见**：从 loader fiber 读存活状态（运行中 / 已停用 / 错误 / 加载中）。命名冲突分两档、**不混为一谈**（issue #5）：`conflicts` 只放**真正重名**的托管行——同名两个实例抢同一套 `mcp__<serverName>__*` 工具名，横幅只在这种情况下出现；本卡之外的实例清单走 `externalServers`，以中性信息条表达「这些名字已被本卡之外的实例占用，在本卡内别重名」。服务器可启用 / 停用（`disabled: true`）/ 编辑 / 删除。**「已挂载」不等于「连上了」**：fiber 存活状态由 loader 给出，而连不上时 `mcp-client` 的 apply 照常 resolve（`failOnStartupError` 默认 `false`，不抛错）——于是不可达的地址会一直显示成绿色「运行中」。现在 DTO 的每个托管行多带一个 `toolCount`（工具注册表里 `mcp__<serverName>__*` 的条数）：`active` 且 `toolCount === 0` 时徽标改显**「未连接」**（顶掉绿色的「运行中」），行下另给一条说明点明代价（每次启动都要为它等一次连接尝试）并配一个手边的「停用」按钮。读不到工具注册表时 `toolCount` **字段缺失**（不是 0），界面据此**不下结论**——绝不能把「读不到」渲染成「未连接」。
- **能力公告注入 systemPrompt**：注入能力公告（systemPrompt section），提到「MCP 配置 / MCP 服务器」时模型知道指本插件。
```

**依据 2 · 源码核查**：[packages/mcp/src/index.ts:1534-1574](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L1534-L1574)

默认eager，on-demand才挂可见性层。

<details>
<summary>查看原文（41行）</summary>

```text
  ctx.inject(['tools'], (toolsCtx: Context) => {
    toolsCtx.effect(() => {
      const mode: 'eager' | 'on-demand' = config.agentToolLoading === 'on-demand' ? 'on-demand' : 'eager'
      const disposers: Array<() => void> = []
      let surface: AgentSurfaceControl | undefined

      /**
       * 托管行（`buildServersDto` 是唯一读取逻辑：卡片、路由、两个工具与装载白名单共用它）。
       *
       * 传 `toolsCtx` 而不是插件 `ctx`：它读得到工具注册表，`toolCount`（真实连接态的证据）才
       * 有意义；插件 ctx 上读不到就只会一路 `null`。
       */
      const serverRows = (): Array<Record<string, unknown>> => {
        try {
          return buildServersDto(toolsCtx).servers
        } catch {
          return []
        }
      }
      /** 可装载的 server 名（顺序 = 托管行顺序）。 */
      const serverNames = (): string[] => {
        const names: string[] = []
        for (const row of serverRows()) {
          const name = row.serverName
          if (typeof name === 'string' && name !== '') names.push(name)
        }
        return names
      }

      /*
       * 先挂按需加载、再注册两个工具：限制层要在「第一个 agent 出现」之前就在监听
       * （`agent/created` 不会补发），而工具注册只是让模型有入口。
       */
      disposers.push(attachAgentSurface(toolsCtx, {
        enabled: mode === 'on-demand',
        log: (message: string) => console.log('[dsh-mcp-config] ' + message),
        listServers: serverNames,
        onReady: (control: AgentSurfaceControl) => {
          surface = control
        },
      }))
```

</details>

**依据 3 · 源码核查**：[packages/mcp/src/index.ts:1649-1705](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L1649-L1705)

mcp_load有实际执行并修改当前Agent工具面。

<details>
<summary>查看原文（57行）</summary>

```text
          defineTool({
            name: 'mcp_load',
            // 会改变当前会话的工具面（写操作）：不适合同轮并发，保持默认的独占调度。
            description: '装载（或卸载）MCP server 的工具到当前会话：参数是该 server 的 serverName 列表（来自 mcp_servers），传空数组 = 全部卸掉。只装载认识的 server，未知名字会被忽略并回报；返回装载后当前会话真正能调用的 MCP 工具名。',
            parameters: {
              servers: {
                type: 'array',
                required: true,
                items: { type: 'string' },
                description: '要装载的 serverName 列表；传空数组 = 全部卸掉',
              },
            },
            output: {
              schema: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  loaded: { type: 'array', required: true, items: { type: 'string' } },
                  tools: { type: 'array', required: true, items: { type: 'string' } },
                  unknown: { type: 'array', required: true, items: { type: 'string' } },
                  note: { type: 'string' },
                },
              },
              render: (_args: unknown, value: unknown): Array<{ type: 'text'; text: string }> => {
                const result = value as LoadToolResult
                const lines: string[] = []
                if (result.loaded.length === 0) {
                  lines.push('当前会话没有装载任何 MCP server：工具表里没有任何 MCP 工具。')
                } else {
                  lines.push(`已装载：${result.loaded.join(', ')}（当前会话可见 ${String(result.tools.length)} 个 MCP 工具）`)
                }
                if (result.tools.length > 0) lines.push('可调用：' + result.tools.join(', '))
                if (result.note !== undefined) lines.push(result.note)
                return [{ type: 'text', text: lines.join('\n') }]
              },
            },
            async execute(args: unknown, exec: { agent?: unknown }): Promise<LoadToolResult> {
              const input = (args ?? {}) as { servers?: unknown }
              const requested = Array.isArray(input.servers)
                ? input.servers.filter((name): name is string => typeof name === 'string')
                : []
              const agent = exec?.agent
              if (agent === undefined || agent === null) {
                return { loaded: [], tools: [], unknown: [], note: '这个工具需要会话上下文' }
              }
              if (surface === undefined) {
                return { loaded: [], tools: [], unknown: [], note: '按需加载没有挂载（宿主缺少 tools 服务），MCP 工具保持原样' }
              }
              const result = surface.load(agent, requested)
              const note = result.unknown.length === 0
                ? undefined
                : `未知 server：${result.unknown.join(', ')}；可用：${serverNames().join(', ') || '(无)'}`
              return {
                loaded: result.loaded,
                tools: result.tools,
                unknown: result.unknown,
                ...(note === undefined ? {} : { note }),
```

</details>

#### 缺口

- 缺少同任务模型请求大小、调用成功率和成本对照。
  **影响**：不能将作者单次测量推广为本部署固定节省。
  **进一步探讨**：在同一可信server集合与任务上比较eager/on-demand完整请求字节、回合数和合格结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 保存和测试分别做什么，是否已有实际工具可用？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

保存端点验证行ID、serverName、传输与外部重名，再将托管块写入用户home补丁文件；宿主热加载才是实际连接和工具注册的下一环。返回applied:true表示补丁已写，不证明该server握手成功。DTO同时取loader存活状态与工具注册数；“active且零工具”被UI显示为未连接，读不到注册表则保留未知。但合法server也可能只提供resource或prompt而没有工具，零工具是本组件针对工具使用目标的状态判据，不是通用协议连接证明。

测试按钮则会真实执行另一条链：stdio测试启动配置命令并发送initialize/tools/list，HTTP测试发JSON-RPC请求。它不经宿主的MCP客户端，因此探测成功不能证明真实宿主版本、凭据注入、重连和工具调用均通过；也不能把“测试”当作无副作用校验字符串。测试结束会安排清理子进程，最终资源释放仍未实测。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mcp/src/index.ts:1400-1438](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L1400-L1438)

保存后DTO与单独test端点。

<details>
<summary>查看原文（39行）</summary>

```text
          rows.map((row) => ({ id: row.id, serverName: row.config.serverName })),
          managed.rows.map((row) => ({ id: row.id, serverName: row.config.serverName })),
          externalMcpEntries(ctx, new Set(managed.rows.map((row) => row.id))),
        )
        if (clash !== undefined) {
          writeJson(res, 400, { error: clash })
          return
        }
        // 空列表 = 清空全部：没有显式 clearAll 就拒绝，避免竞态 / 陈旧卡片静默抹掉配置。
        const rejection = emptyServersRejection(rows.length, managed.rows.length, body.clearAll)
        if (rejection !== undefined) {
          writeJson(res, 400, { error: rejection })
          return
        }
        try {
          writeManagedRows(rows)
        } catch (error) {
          writeJson(res, 500, { error: '写入补丁文件失败: ' + (error instanceof Error ? error.message : String(error)) })
          return
        }
        // DTO 必须在**保存之后**读：它要反映刚落地的行集与工具数。
        const dto = buildServersDto(ctx)
        writeJson(res, 200, { ok: true, applied: true, ...dto })
      },
    },
    {
      kind: 'exact',
      path: '/api/dsh-mcp/test',
      handler: async (req, res) => {
        if (!(await guard(req, res, 'POST'))) return
        const body = await readJsonBody(req)
        if (body === undefined) {
          writeJson(res, 400, { error: 'invalid JSON body' })
          return
        }
        const result = await testServer(body.config)
        writeJson(res, 200, { ok: true, result: { ...result, ...(result.tools !== undefined ? { tools: result.tools.slice(0, MAX_TOOLS_REPORTED) } : {}) } })
      },
    },
```

</details>

**依据 2 · 源码核查**：[packages/mcp/src/index.ts:896-950](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L896-L950)

测试求值env并实际spawnPortable进程，结束安排清理。

<details>
<summary>查看原文（55行）</summary>

```text
function probeStdio(config: McpServerConfig, timeoutMs: number): Promise<ProbeResult> {
  const startedAt = Date.now()
  const env: Record<string, string> = {}
  for (const [key, value] of Object.entries(config.env ?? {})) env[key] = evalValue(value)
  // 求值自检必须放在**创建 Promise 之前**：`finish()` 会 `clearTimeout(timer)`，而 `timer`
  // 要到 spawn 之后才声明（`const`）。在 executor 里提前调 finish 会踩 TDZ——
  // 复核实测：`ReferenceError: Cannot access 'timer' before initialization`，
  // Promise 变成 reject（而不是 `{ ok: false }`），最后冒泡成路由 500。
  for (const [key, value] of Object.entries(env)) {
    const raw = config.env?.[key]
    const rejection = unresolvedCredentialRejection('env', 'env.' + key, value, isJsExpr(raw) ? raw.__jsExpr : undefined)
    if (rejection !== undefined) {
      return Promise.resolve({ ok: false, transport: 'stdio', durationMs: Date.now() - startedAt, toolsCount: 0, error: rejection })
    }
  }
  return new Promise((resolve) => {
    let settled = false
    let buffer = ''
    let stderrTail = ''
    // stderr 是给人看的诊断信息（Windows 上常来自 cmd.exe，按控制台代码页写），
    // 硬编码 UTF-8 会让「连接测试失败」的原因变成 `���`——而那是用户唯一的线索。
    // stdout 不走它：那边是 MCP 的 JSON-RPC 协议，被"容错"成别的编码就解析不了。
    const stderrDecoder = createOutputDecoder()
    let stderrFlushed = false
    /** 取 stderr 尾巴：先把解码器里残留的不完整字节吐出来，再截断。 */
    const readStderrTail = (): string => {
      if (!stderrFlushed) {
        stderrFlushed = true
        stderrTail = (stderrTail + stderrDecoder.flush()).slice(-2000)
      }
      return stderrTail
    }
    let retried = false
    let serverInfo: { name?: string; version?: string } | undefined
    let protocolVersion: string | undefined
    let child: ReturnType<typeof spawnPortable>
    const finish = (result: Omit<ProbeResult, 'transport' | 'durationMs'>) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      // 经 kit 收进程树：Windows 上直接子进程是 cmd.exe，真正的 MCP 服务器是它的孙进程，
      // 只 kill 直接子进程会把服务器留成孤儿（连接测试反复点就会攒一堆）。
      void terminateChild(child).catch(() => {})
      resolve({ ...result, transport: 'stdio', durationMs: Date.now() - startedAt })
    }
    // 不能裸 spawn：Windows 上 MCP 服务器常是 `.cmd` shim（codegraph 就是），裸 spawn 会
    // 直接 `spawn … EINVAL`（Node 对 .cmd 的加固），连接测试于是永远失败并误导用户。
    // 注意与**真正的**工具加载路径的区别：那条走 DSH 核心的
    // `@deepseek-ai/dsh-mcp-client` → 官方 SDK 的 StdioClientTransport（内部用 cross-spawn），
    // 本来就不受影响；这里修的只是本插件手写的这次探测。
    child = spawnPortable(config.command as string, config.args ?? [], {
      env: { ...process.env, ...env },
      cwd: config.cwd || undefined,
      stdio: ['pipe', 'pipe', 'pipe'],
    })
```

</details>

**依据 3 · 源码核查**：[packages/mcp/src/index.ts:1065-1090](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L1065-L1090)

HTTP测试准备求值头。

<details>
<summary>查看原文（26行）</summary>

```text
async function probeHttp(config: McpServerConfig, timeoutMs: number): Promise<ProbeResult> {
  const startedAt = Date.now()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const finish = (result: Omit<ProbeResult, 'transport' | 'durationMs'>): ProbeResult => {
    clearTimeout(timer)
    return { ...result, transport: 'streamable-http', durationMs: Date.now() - startedAt }
  }
  let sessionId: string | undefined
  const sseBuffer = { value: '' }
  let sseReader: ReadableStreamDefaultReader<Uint8Array> | undefined
  try {
    const baseHeaders: Record<string, string> = {
      accept: 'application/json, text/event-stream',
      'content-type': 'application/json',
    }
    for (const [key, value] of Object.entries(config.headers ?? {})) {
      const evaluated = evalValue(value)
      // 与 probeStdio 的 env 同一道防呆：拼接出的 `Basic base64("undefined:undefined")`
      // 是**合法**字符串，服务器只会回 401，用户看不出是自己这边没注入。
      const undefinedInValue = unresolvedCredentialRejection('header', 'headers.' + key, evaluated, isJsExpr(value) ? value.__jsExpr : undefined)
      if (undefinedInValue !== undefined) return finish({ ok: false, toolsCount: 0, error: undefinedInValue })
      baseHeaders[key] = evaluated
    }
    const withSession = (extra: Record<string, string>) => ({
      ...extra,
```

</details>

**依据 4 · 源码核查**：[packages/mcp/src/index.ts:656-697](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L656-L697)

DTO结合托管行、loader与工具数。

<details>
<summary>查看原文（42行）</summary>

```text
export function buildServersDto(ctx: Context): {
  servers: Array<Record<string, unknown>>
  fileError?: string
  patchFile: string
  /** 托管行里**真正**与外部实例重名的那些行（横幅只该渲染这份）。 */
  conflicts: Array<{ id: string; serverName: string }>
  /** 本插件之外的 mcp-client 实例清单（保存护栏与「外部占用」信息条用；与 conflicts 不是一回事）。 */
  externalServers: Array<{ id: string; serverName: string }>
  /** 成本可见性的阈值（见 `AGENT_TOOL_BUDGET`）：卡片拿它跟已知工具数合计比较，自己不留第二份。 */
  toolBudget: number
} {
  const managed = readManagedRows()
  const managedIds = new Set(managed.rows.map((row) => row.id))
  const externalServers = externalMcpEntries(ctx, managedIds)
  const usedExternalNames = new Set(externalServers.map((entry) => entry.serverName))
  // 真实连接态的证据（见 registeredToolCounts）：某行一个工具都没注册 = 它没连上。
  // 「读不到注册表」时这里是 undefined，逐行也就没有 toolCount —— 卡片据此不报警。
  const toolCounts = registeredToolCounts(ctx, managed.rows.map((row) => row.config.serverName))
  const servers = managed.rows.map((row) => {
    const config = row.config
    return {
      id: row.id,
      serverName: config.serverName,
      transport: config.transport,
      disabled: row.disabled === true,
      status: liveStatus(ctx, row.id),
      conflict: usedExternalNames.has(config.serverName),
      ...(toolCounts?.has(config.serverName) === true ? { toolCount: toolCounts.get(config.serverName) } : {}),
      config: {
        serverName: config.serverName,
        transport: config.transport,
        ...(config.command !== undefined ? { command: config.command } : {}),
        ...(config.args !== undefined ? { args: config.args } : {}),
        ...(config.env !== undefined ? { env: dtoMap(config.env) } : {}),
        ...(config.cwd !== undefined ? { cwd: config.cwd } : {}),
        ...(config.url !== undefined ? { url: config.url } : {}),
        ...(config.headers !== undefined ? { headers: dtoMap(config.headers) } : {}),
        ...(config.toolCallTimeoutMs !== undefined ? { toolCallTimeoutMs: config.toolCallTimeoutMs } : {}),
        ...(config.failOnStartupError !== undefined ? { failOnStartupError: config.failOnStartupError } : {}),
        ...(config.reconnect !== undefined ? { reconnect: config.reconnect } : {}),
      },
    }
```

</details>

**依据 5 · 源码核查**：[packages/mcp/client.js:547-556](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/client.js#L547-L556)

active与toolCount=0的UI判据，未知不补零。

<details>
<summary>查看原文（10行）</summary>

```text
     * 「运行中但一个工具都没有」按**未连接**显示。
     *
     * 为什么不只看 `status`：mcp-client 连不上时 apply 照样 resolve（`failOnStartupError` 默认
     * false），fiber 还是 active——只看它就会显示「运行中」，可服务器一个工具都没有。工具是
     * 「连接成功 + tools/list」之后唯一会留下的产物，所以 active 且 0 个工具就是没连上。
     * `toolCount === undefined`（宿主读不到注册表）**不猜**；停用的行也不叠加。
     */
    function notConnected(server) {
      return server.status === 'active' && server.disabled !== true && server.toolCount === 0
    }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 按需可见性和档位限制覆盖哪些工具，失败怎样退化？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

on-demand的deny名单只针对本卡托管且尚未选择的server；外部手工行、其他组件托管和无法归属的工具不被这层隐藏，不能称为卸载了所有MCP。load采用替换语义，传空数组卸掉当前托管选择，不是增量追加。每个Agent从自己的context取tools.restrict，tools变化和Agent生命周期触发重算。

它不是强制安全沙箱。缺少scope tools/restrict会跳过，restrict抛错则保持原工具表；台账先更新再下发，返回tools是按注册集和台账计算的投影，不证明限制已被宿主实际应用。另有档位层按最坏exec类处理mcp前缀与mcp_load，mcp_servers归read；但该层依赖宿主档位与scope服务，缺服务、解析失败或下发失败会退化。按需减少常驻模式工具面与权限限制是不同机制，不能把可见性台账当作调用批准，更不能推广到Agent自身局部挂载或部署中的其他命令面。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mcp/src/agent-surface.ts:151-166](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/agent-surface.ts#L151-L166)

deny仅命中managed且未loaded。

<details>
<summary>查看原文（16行）</summary>

```text
export function planSurfaceDeny(
  registered: readonly string[],
  loaded: readonly string[],
  managed: readonly string[],
): string[] {
  const managedServers = new Set(managed)
  const loadedServers = new Set(loaded)
  const deny: string[] = []
  for (const name of registered) {
    if (name === '' || !name.startsWith(MCP_TOOL_PREFIX)) continue
    const server = serverNameOf(name)
    // 解析不出 / 不在托管行 = **不是我们的**：不点名，保持可见（见上面的理由）。
    if (server === undefined || !managedServers.has(server)) continue
    if (loadedServers.has(server)) continue
    deny.push(name)
  }
```

</details>

**依据 2 · 源码核查**：[packages/mcp/src/agent-surface.ts:338-390](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/agent-surface.ts#L338-L390)

缺scope跳过、restrict失败保留原表、台账先写。

<details>
<summary>查看原文（53行）</summary>

```text
      return
    }
    // **必须**从 agent 自己的 ctx 取（见文件头与 `toolsOf`）：插件 ctx 上没有 scope，restrict 会直接抛。
    const target = toolsOf(agent.ctx)
    if (target === undefined || typeof target.restrict !== 'function') {
      log(`agent-surface: agent ${id} 没有可用的 scoped tools（宿主太旧或缺 restrict），跳过按需加载`)
      return
    }
    lift(agent)
    const record = { deny, dispose: () => {} }
    // 先登记再下发（restrict 会同步触发 tools/change）。
    applied.set(agent, record)
    try {
      record.dispose = target.restrict({ deny })
      log(
        `agent-surface: agent ${id} → 隐藏 ${String(deny.length)} 个 mcp__* 工具` +
        `（已装载：${loadedOf(agent).join(', ') || '无'}）`,
      )
    } catch (error) {
      applied.delete(agent)
      log(`agent-surface: agent ${id} 下发按需加载限制失败（${messageOf(error)}），保持原工具表`)
    }
  }

  /**
   * 装载（**替换**语义）：`servers: []` = 全部卸掉。只装认识的，未知名字进 `unknown` 不抛。
   *
   * 台账**先**写、再下发：即使下发失败（宿主太旧），`mcp_servers` 报的装载状态与
   * `mcp_load` 的返回也仍然自洽（模型不会看到一个「装了一半」的状态）。
   */
  const load = (agentLike: unknown, servers: readonly string[]): SurfaceLoadResult => {
    // 白名单与裁名单**同一份**来源：只装托管行里的 server（外部行没有装载入口，见 planSurfaceDeny）。
    const known = new Set<string>(managedServers())
    const unknown: string[] = []
    const loaded: string[] = []
    for (const raw of servers) {
      const name = typeof raw === 'string' ? raw.trim() : ''
      if (name === '') continue
      if (!known.has(name)) {
        if (!unknown.includes(name)) unknown.push(name)
        continue
      }
      if (!loaded.includes(name)) loaded.push(name)
    }
    const agent = agentLike !== null && typeof agentLike === 'object' ? agentLike : undefined
    if (agent === undefined) return { loaded: [], unknown, tools: [] }
    loadedBy.set(agent, loaded)
    try {
      applyTo(agent as AgentLike)
    } catch (error) {
      log(`agent-surface: 装载后下发失败（${messageOf(error)}），台账已更新、限制保持原样`)
    }
    return { loaded, unknown, tools: visibleTools(agent) }
```

</details>

**依据 3 · 源码核查**：[packages/mcp/src/index.ts:1735-1747](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L1735-L1747)

档位层分别分类read和exec。

<details>
<summary>查看原文（13行）</summary>

```text
     * 档位层：与上面同一个 effect 体，但**独立**于按需加载（eager 档也照旧生效）。
     *
     * 两处分工见函数头 `①`：档位裁的是「按当前档位不可能成功」的 write / exec 与全部 `mcp__*`；
     * 按需加载裁的是「这个会话还没说要」的 `mcp__*`。交集语义由宿主的 scope 层保证。
     */
    toolsCtx.effect(() => attachTierRestrict(toolsCtx, {
      pkg: 'mcp',
      // 「mcp__*」是宿主族（一律按最坏类 exec）；两个自有工具单独列名，`mcp_servers` 只读、
      // `mcp_load` 改工具面（exec）。前缀外的工具一个都不裁。
      prefixes: [...MCP_TIER_PREFIXES, ...MCP_OWN_TOOL_NAMES],
      classify: (tool: string) => (tool === 'mcp_servers' ? 'read' : 'exec'),
    }), 'dsh-mcp-config: agent tool visibility (tier)')
  })
```

</details>

**依据 4 · 源码核查**：[packages/kit/src/tier-restrict.ts:337-367](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/kit/src/tier-restrict.ts#L337-L367)

缺服务/解析失败/无restrict的退化边界。

<details>
<summary>查看原文（31行）</summary>

```text
        log('tier-restrict: tools 服务不可用，跳过工具裁剪')
      }
      return
    }
    let tier: TierContext
    try {
      tier = resolveSessionTier(snapshot, agent.session)
    } catch (error) {
      log(`tier-restrict: 档位解析失败（${messageOf(error)}），跳过工具裁剪`)
      return
    }
    const restrictedByTier = shouldRestrictForTier(tier)
    if (!restrictedByTier && !tier.services.sandboxPolicy && !serviceMissingLogged) {
      serviceMissingLogged = true
      log('tier-restrict: sandboxPolicy 未组合，按现状不裁剪')
    }
    const id = agentIdOf(agent)
    const names = globalToolNames(host)
    const relevant = options.prefixes.length === 0 ? names : names.filter((name) => options.prefixes.some((prefix) => name.startsWith(prefix)))
    const deny = restrictedByTier ? tierRestrictedNames(names, options.classify, options.prefixes) : []
    // 名单为空才 `lift`：这一支承担「档位放开了，把之前那层撤掉」的语义——`lift` 撤的是上一次
    // 下发的限制，为空时正好回到宿主全局集。
    if (deny.length === 0) {
      lift(agent)
      return
    }
    // **必须**从 agent 自己的 ctx 调（见文件头）：插件 ctx 上没有 scope，restrict 会直接抛。
    const target = toolsOf(agent.ctx)
    if (target === undefined || typeof target.restrict !== 'function') {
      log(`tier-restrict: agent ${id} 没有可用的 scoped tools（宿主太旧或缺 restrict），跳过工具裁剪`)
      return
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 权限、表达式和并发写入有哪些采用边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

HTTP管理端点要求环回与POST同源证明，但本机访问围栏不是执行不可信MCP配置的沙箱。stdio命令会在宿主环境启动；js表达式被new Function求值并得到process，不能把它当成只读取环境变量的专用语言。它可用来避免把某些密钥值直接写在补丁里，却仍要信任表达式与server命令，测试时也会求值。不能从“密钥不落配置”推导无执行或无泄漏风险。

补丁写入是mtime/size复核后同目录临时文件rename，未建立跨进程事务。原文件不存在时，重读条件stat!==undefined为false，另一写者刚创建文件也不会触发重读；已有文件冲突重试达到三次后仍继续写。即使单次替换避免半文件，也可能覆盖并发配置。初次配置和多插件同时维护home patch时应先备份并避免并发编辑，不将保存成功视作无冲突合并。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mcp/src/index.ts:1305-1319](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L1305-L1319)

管理端点本机与同源门。

<details>
<summary>查看原文（15行）</summary>

```text
export async function routeGate(req: ReqLike, res: ResLike, method: string, logger?: RouteLogger): Promise<boolean> {
  if (!(await isLoopbackRequestStrict(req))) {
    writeJson(res, 403, { error: 'forbidden: loopback-only' })
    return false
  }
  if (req.method !== method) {
    writeJson(res, 405, { error: 'method not allowed: ' + String(req.method) })
    return false
  }
  if (method === 'POST' && !hasSameOriginProof(req)) {
    logger?.warn(`dsh-mcp-config: 拒绝无同源证明的变更请求 ${req.url ?? ''}（${originProofHint(req)}）`)
    writeJson(res, 403, { error: '缺少同源证明（需要 Origin 或 Sec-Fetch-Site: same-origin）：变更端点拒绝无来源请求' })
    return false
  }
  return true
```

</details>

**依据 2 · 源码核查**：[packages/mcp/src/index.ts:762-767](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L762-L767)

js表达式通过new Function与process求值。

```text
function evalValue(value: string | JsExpr): string {
  if (!isJsExpr(value)) return value
  const fn = new Function('process', 'return (' + value.__jsExpr + ')')
  const result = fn(process)
  return typeof result === 'string' ? result : String(result ?? '')
}
```

**依据 3 · 源码核查**：[packages/mcp/src/index.ts:338-358](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L338-L358)

写前复核不存在分支及重试上限。

<details>
<summary>查看原文（21行）</summary>

```text
function writeManagedRows(rows: McpRow[]): void {
  const patchFile = homePatchPath()
  for (let attempt = 0; ; attempt++) {
    const existed = existsSync(patchFile)
    const stat = existed ? statSync(patchFile) : undefined
    const mode = stat ? (stat.mode & 0o777) : 0o600
    // 写前复核：dsh-codegraph 等插件也会写这个文件。盖章（mtime+size）→ 读 →
    // 渲染 → 复核，期间被别人写过就重读重做，避免用旧快照覆盖掉它的改动。
    const stamp = stat ? stat.mtimeMs + ':' + stat.size : 'absent'
    const text = stat ? readFileSync(patchFile, 'utf8') : '# dsh home patch layer\n'
    const next = spliceManagedBlock(text, rows)
    const statNow = existsSync(patchFile) ? statSync(patchFile) : undefined
    const stampNow = statNow ? statNow.mtimeMs + ':' + statNow.size : 'absent'
    if (stat !== undefined && stampNow !== stamp && attempt < 3) continue
    const tmp = join(dirname(patchFile), '.cordis.patch.yml.' + process.pid + '.tmp')
    writeFileSync(tmp, next, { mode })
    renameSync(tmp, patchFile)
    if (stat === undefined || (mode & 0o077) !== 0) chmodSync(patchFile, mode)
    return
  }
}
```

</details>

**依据 4 · 源码核查**：[packages/mcp/src/index.ts:946-950](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L946-L950)

stdio继承宿主环境并起配置命令。

```text
    child = spawnPortable(config.command as string, config.args ?? [], {
      env: { ...process.env, ...env },
      cwd: config.cwd || undefined,
      stdio: ['pipe', 'pipe', 'pipe'],
    })
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 全周期成本和采用条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

已有可信MCP服务与备份能力的DSH用户可在非关键profile里试维护一条已知server，先保存并回读目标补丁，再核对宿主工具表和一个无业务副作用查询；如果要试on-demand，还须分别比较真实Agent请求中的工具名，不能只信mcp_load返回。未知server、表达式与命令不应为了“测试连接”直接运行。

首次投入是配置传输、凭据与cwd、备份共享文件及核对宿主客户端；持续投入是server进程、HTTP连接和模型工具schema占用。按需模式不停止进程，可能增加先选server的模型回合，故字节减少不自动等于总费用下降。失败恢复需要区分探测、热加载和可见性失败，恢复备份并关闭不需要的托管行；金额和时间均未知。若出现无关补丁行变化、真实工具表不符合模式、测试与宿主状态矛盾或凭据未注入，应停止使用本卡写入并回到原配置与日志核对。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mcp/src/index.ts:1400-1438](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L1400-L1438)

保存、回读与测试分离。

<details>
<summary>查看原文（39行）</summary>

```text
          rows.map((row) => ({ id: row.id, serverName: row.config.serverName })),
          managed.rows.map((row) => ({ id: row.id, serverName: row.config.serverName })),
          externalMcpEntries(ctx, new Set(managed.rows.map((row) => row.id))),
        )
        if (clash !== undefined) {
          writeJson(res, 400, { error: clash })
          return
        }
        // 空列表 = 清空全部：没有显式 clearAll 就拒绝，避免竞态 / 陈旧卡片静默抹掉配置。
        const rejection = emptyServersRejection(rows.length, managed.rows.length, body.clearAll)
        if (rejection !== undefined) {
          writeJson(res, 400, { error: rejection })
          return
        }
        try {
          writeManagedRows(rows)
        } catch (error) {
          writeJson(res, 500, { error: '写入补丁文件失败: ' + (error instanceof Error ? error.message : String(error)) })
          return
        }
        // DTO 必须在**保存之后**读：它要反映刚落地的行集与工具数。
        const dto = buildServersDto(ctx)
        writeJson(res, 200, { ok: true, applied: true, ...dto })
      },
    },
    {
      kind: 'exact',
      path: '/api/dsh-mcp/test',
      handler: async (req, res) => {
        if (!(await guard(req, res, 'POST'))) return
        const body = await readJsonBody(req)
        if (body === undefined) {
          writeJson(res, 400, { error: 'invalid JSON body' })
          return
        }
        const result = await testServer(body.config)
        writeJson(res, 200, { ok: true, result: { ...result, ...(result.tools !== undefined ? { tools: result.tools.slice(0, MAX_TOOLS_REPORTED) } : {}) } })
      },
    },
```

</details>

**依据 2 · 源码核查**：[packages/mcp/src/agent-surface.ts:338-390](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/agent-surface.ts#L338-L390)

可见性不能只看台账。

<details>
<summary>查看原文（53行）</summary>

```text
      return
    }
    // **必须**从 agent 自己的 ctx 取（见文件头与 `toolsOf`）：插件 ctx 上没有 scope，restrict 会直接抛。
    const target = toolsOf(agent.ctx)
    if (target === undefined || typeof target.restrict !== 'function') {
      log(`agent-surface: agent ${id} 没有可用的 scoped tools（宿主太旧或缺 restrict），跳过按需加载`)
      return
    }
    lift(agent)
    const record = { deny, dispose: () => {} }
    // 先登记再下发（restrict 会同步触发 tools/change）。
    applied.set(agent, record)
    try {
      record.dispose = target.restrict({ deny })
      log(
        `agent-surface: agent ${id} → 隐藏 ${String(deny.length)} 个 mcp__* 工具` +
        `（已装载：${loadedOf(agent).join(', ') || '无'}）`,
      )
    } catch (error) {
      applied.delete(agent)
      log(`agent-surface: agent ${id} 下发按需加载限制失败（${messageOf(error)}），保持原工具表`)
    }
  }

  /**
   * 装载（**替换**语义）：`servers: []` = 全部卸掉。只装认识的，未知名字进 `unknown` 不抛。
   *
   * 台账**先**写、再下发：即使下发失败（宿主太旧），`mcp_servers` 报的装载状态与
   * `mcp_load` 的返回也仍然自洽（模型不会看到一个「装了一半」的状态）。
   */
  const load = (agentLike: unknown, servers: readonly string[]): SurfaceLoadResult => {
    // 白名单与裁名单**同一份**来源：只装托管行里的 server（外部行没有装载入口，见 planSurfaceDeny）。
    const known = new Set<string>(managedServers())
    const unknown: string[] = []
    const loaded: string[] = []
    for (const raw of servers) {
      const name = typeof raw === 'string' ? raw.trim() : ''
      if (name === '') continue
      if (!known.has(name)) {
        if (!unknown.includes(name)) unknown.push(name)
        continue
      }
      if (!loaded.includes(name)) loaded.push(name)
    }
    const agent = agentLike !== null && typeof agentLike === 'object' ? agentLike : undefined
    if (agent === undefined) return { loaded: [], unknown, tools: [] }
    loadedBy.set(agent, loaded)
    try {
      applyTo(agent as AgentLike)
    } catch (error) {
      log(`agent-surface: 装载后下发失败（${messageOf(error)}），台账已更新、限制保持原样`)
    }
    return { loaded, unknown, tools: visibleTools(agent) }
```

</details>

**依据 3 · 源码核查**：[packages/mcp/src/index.ts:896-950](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L896-L950)

探测真实资源与命令执行。

<details>
<summary>查看原文（55行）</summary>

```text
function probeStdio(config: McpServerConfig, timeoutMs: number): Promise<ProbeResult> {
  const startedAt = Date.now()
  const env: Record<string, string> = {}
  for (const [key, value] of Object.entries(config.env ?? {})) env[key] = evalValue(value)
  // 求值自检必须放在**创建 Promise 之前**：`finish()` 会 `clearTimeout(timer)`，而 `timer`
  // 要到 spawn 之后才声明（`const`）。在 executor 里提前调 finish 会踩 TDZ——
  // 复核实测：`ReferenceError: Cannot access 'timer' before initialization`，
  // Promise 变成 reject（而不是 `{ ok: false }`），最后冒泡成路由 500。
  for (const [key, value] of Object.entries(env)) {
    const raw = config.env?.[key]
    const rejection = unresolvedCredentialRejection('env', 'env.' + key, value, isJsExpr(raw) ? raw.__jsExpr : undefined)
    if (rejection !== undefined) {
      return Promise.resolve({ ok: false, transport: 'stdio', durationMs: Date.now() - startedAt, toolsCount: 0, error: rejection })
    }
  }
  return new Promise((resolve) => {
    let settled = false
    let buffer = ''
    let stderrTail = ''
    // stderr 是给人看的诊断信息（Windows 上常来自 cmd.exe，按控制台代码页写），
    // 硬编码 UTF-8 会让「连接测试失败」的原因变成 `���`——而那是用户唯一的线索。
    // stdout 不走它：那边是 MCP 的 JSON-RPC 协议，被"容错"成别的编码就解析不了。
    const stderrDecoder = createOutputDecoder()
    let stderrFlushed = false
    /** 取 stderr 尾巴：先把解码器里残留的不完整字节吐出来，再截断。 */
    const readStderrTail = (): string => {
      if (!stderrFlushed) {
        stderrFlushed = true
        stderrTail = (stderrTail + stderrDecoder.flush()).slice(-2000)
      }
      return stderrTail
    }
    let retried = false
    let serverInfo: { name?: string; version?: string } | undefined
    let protocolVersion: string | undefined
    let child: ReturnType<typeof spawnPortable>
    const finish = (result: Omit<ProbeResult, 'transport' | 'durationMs'>) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      // 经 kit 收进程树：Windows 上直接子进程是 cmd.exe，真正的 MCP 服务器是它的孙进程，
      // 只 kill 直接子进程会把服务器留成孤儿（连接测试反复点就会攒一堆）。
      void terminateChild(child).catch(() => {})
      resolve({ ...result, transport: 'stdio', durationMs: Date.now() - startedAt })
    }
    // 不能裸 spawn：Windows 上 MCP 服务器常是 `.cmd` shim（codegraph 就是），裸 spawn 会
    // 直接 `spawn … EINVAL`（Node 对 .cmd 的加固），连接测试于是永远失败并误导用户。
    // 注意与**真正的**工具加载路径的区别：那条走 DSH 核心的
    // `@deepseek-ai/dsh-mcp-client` → 官方 SDK 的 StdioClientTransport（内部用 cross-spawn），
    // 本来就不受影响；这里修的只是本插件手写的这次探测。
    child = spawnPortable(config.command as string, config.args ?? [], {
      env: { ...process.env, ...env },
      cwd: config.cwd || undefined,
      stdio: ['pipe', 'pipe', 'pipe'],
    })
```

</details>

**依据 4 · 源码核查**：[packages/mcp/src/index.ts:338-358](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L338-L358)

备份和并发编辑成本来源。

<details>
<summary>查看原文（21行）</summary>

```text
function writeManagedRows(rows: McpRow[]): void {
  const patchFile = homePatchPath()
  for (let attempt = 0; ; attempt++) {
    const existed = existsSync(patchFile)
    const stat = existed ? statSync(patchFile) : undefined
    const mode = stat ? (stat.mode & 0o777) : 0o600
    // 写前复核：dsh-codegraph 等插件也会写这个文件。盖章（mtime+size）→ 读 →
    // 渲染 → 复核，期间被别人写过就重读重做，避免用旧快照覆盖掉它的改动。
    const stamp = stat ? stat.mtimeMs + ':' + stat.size : 'absent'
    const text = stat ? readFileSync(patchFile, 'utf8') : '# dsh home patch layer\n'
    const next = spliceManagedBlock(text, rows)
    const statNow = existsSync(patchFile) ? statSync(patchFile) : undefined
    const stampNow = statNow ? statNow.mtimeMs + ':' + statNow.size : 'absent'
    if (stat !== undefined && stampNow !== stamp && attempt < 3) continue
    const tmp = join(dirname(patchFile), '.cordis.patch.yml.' + process.pid + '.tmp')
    writeFileSync(tmp, next, { mode })
    renameSync(tmp, patchFile)
    if (stat === undefined || (mode & 0o077) !== 0) chmodSync(patchFile, mode)
    return
  }
}
```

</details>

#### 缺口

- 未验证宿主热加载、真实工具表、进程释放及任务总费用。
  **影响**：只支持已知server的受控配置试用，不保证权限或节省效果。
  **进一步探讨**：在非关键profile用同一server集合核对三个状态并记录请求大小、总回合和人工恢复时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 从三种状态错位可推导什么验证假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是将配置提交、宿主连接、Agent工具可见性分别记录独立状态与同一配置版本，让探测结果不能覆盖宿主连接结论、台账计算也不能冒充实际工具表。当前已有loader和toolCount组合，但可见性下发失败仍保留乐观台账；对配置者而言，最难排查的是“保存过、测通过、模型仍拿不到”。

候选增量是以配置摘要绑定每次探测和热加载结果，再从宿主实际Agent视图回读生效工具集合；缺少观察面时明确未知，而非预期状态。代价是更多宿主依赖和诊断数据。最小对照覆盖探测成功但宿主连接失败、无restrict服务、并发配置变化及有合法零工具server，用实际请求工具表作为判据；若状态仍混淆或诊断工作量不降，该方向就不成立。没有用户样本与需求验证，不作为确定产品方向。

#### 证据与依据

**依据 1 · 源码核查**：[packages/mcp/src/index.ts:656-697](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L656-L697)

现状DTO组合不同观察面。

<details>
<summary>查看原文（42行）</summary>

```text
export function buildServersDto(ctx: Context): {
  servers: Array<Record<string, unknown>>
  fileError?: string
  patchFile: string
  /** 托管行里**真正**与外部实例重名的那些行（横幅只该渲染这份）。 */
  conflicts: Array<{ id: string; serverName: string }>
  /** 本插件之外的 mcp-client 实例清单（保存护栏与「外部占用」信息条用；与 conflicts 不是一回事）。 */
  externalServers: Array<{ id: string; serverName: string }>
  /** 成本可见性的阈值（见 `AGENT_TOOL_BUDGET`）：卡片拿它跟已知工具数合计比较，自己不留第二份。 */
  toolBudget: number
} {
  const managed = readManagedRows()
  const managedIds = new Set(managed.rows.map((row) => row.id))
  const externalServers = externalMcpEntries(ctx, managedIds)
  const usedExternalNames = new Set(externalServers.map((entry) => entry.serverName))
  // 真实连接态的证据（见 registeredToolCounts）：某行一个工具都没注册 = 它没连上。
  // 「读不到注册表」时这里是 undefined，逐行也就没有 toolCount —— 卡片据此不报警。
  const toolCounts = registeredToolCounts(ctx, managed.rows.map((row) => row.config.serverName))
  const servers = managed.rows.map((row) => {
    const config = row.config
    return {
      id: row.id,
      serverName: config.serverName,
      transport: config.transport,
      disabled: row.disabled === true,
      status: liveStatus(ctx, row.id),
      conflict: usedExternalNames.has(config.serverName),
      ...(toolCounts?.has(config.serverName) === true ? { toolCount: toolCounts.get(config.serverName) } : {}),
      config: {
        serverName: config.serverName,
        transport: config.transport,
        ...(config.command !== undefined ? { command: config.command } : {}),
        ...(config.args !== undefined ? { args: config.args } : {}),
        ...(config.env !== undefined ? { env: dtoMap(config.env) } : {}),
        ...(config.cwd !== undefined ? { cwd: config.cwd } : {}),
        ...(config.url !== undefined ? { url: config.url } : {}),
        ...(config.headers !== undefined ? { headers: dtoMap(config.headers) } : {}),
        ...(config.toolCallTimeoutMs !== undefined ? { toolCallTimeoutMs: config.toolCallTimeoutMs } : {}),
        ...(config.failOnStartupError !== undefined ? { failOnStartupError: config.failOnStartupError } : {}),
        ...(config.reconnect !== undefined ? { reconnect: config.reconnect } : {}),
      },
    }
```

</details>

**依据 2 · 源码核查**：[packages/mcp/src/agent-surface.ts:338-390](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/agent-surface.ts#L338-L390)

预期台账与实际下发可以不同。

<details>
<summary>查看原文（53行）</summary>

```text
      return
    }
    // **必须**从 agent 自己的 ctx 取（见文件头与 `toolsOf`）：插件 ctx 上没有 scope，restrict 会直接抛。
    const target = toolsOf(agent.ctx)
    if (target === undefined || typeof target.restrict !== 'function') {
      log(`agent-surface: agent ${id} 没有可用的 scoped tools（宿主太旧或缺 restrict），跳过按需加载`)
      return
    }
    lift(agent)
    const record = { deny, dispose: () => {} }
    // 先登记再下发（restrict 会同步触发 tools/change）。
    applied.set(agent, record)
    try {
      record.dispose = target.restrict({ deny })
      log(
        `agent-surface: agent ${id} → 隐藏 ${String(deny.length)} 个 mcp__* 工具` +
        `（已装载：${loadedOf(agent).join(', ') || '无'}）`,
      )
    } catch (error) {
      applied.delete(agent)
      log(`agent-surface: agent ${id} 下发按需加载限制失败（${messageOf(error)}），保持原工具表`)
    }
  }

  /**
   * 装载（**替换**语义）：`servers: []` = 全部卸掉。只装认识的，未知名字进 `unknown` 不抛。
   *
   * 台账**先**写、再下发：即使下发失败（宿主太旧），`mcp_servers` 报的装载状态与
   * `mcp_load` 的返回也仍然自洽（模型不会看到一个「装了一半」的状态）。
   */
  const load = (agentLike: unknown, servers: readonly string[]): SurfaceLoadResult => {
    // 白名单与裁名单**同一份**来源：只装托管行里的 server（外部行没有装载入口，见 planSurfaceDeny）。
    const known = new Set<string>(managedServers())
    const unknown: string[] = []
    const loaded: string[] = []
    for (const raw of servers) {
      const name = typeof raw === 'string' ? raw.trim() : ''
      if (name === '') continue
      if (!known.has(name)) {
        if (!unknown.includes(name)) unknown.push(name)
        continue
      }
      if (!loaded.includes(name)) loaded.push(name)
    }
    const agent = agentLike !== null && typeof agentLike === 'object' ? agentLike : undefined
    if (agent === undefined) return { loaded: [], unknown, tools: [] }
    loadedBy.set(agent, loaded)
    try {
      applyTo(agent as AgentLike)
    } catch (error) {
      log(`agent-surface: 装载后下发失败（${messageOf(error)}），台账已更新、限制保持原样`)
    }
    return { loaded, unknown, tools: visibleTools(agent) }
```

</details>

**依据 3 · 源码核查**：[packages/mcp/src/index.ts:1400-1438](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/mcp/src/index.ts#L1400-L1438)

保存与探测各有状态，尚非统一运行证据。

<details>
<summary>查看原文（39行）</summary>

```text
          rows.map((row) => ({ id: row.id, serverName: row.config.serverName })),
          managed.rows.map((row) => ({ id: row.id, serverName: row.config.serverName })),
          externalMcpEntries(ctx, new Set(managed.rows.map((row) => row.id))),
        )
        if (clash !== undefined) {
          writeJson(res, 400, { error: clash })
          return
        }
        // 空列表 = 清空全部：没有显式 clearAll 就拒绝，避免竞态 / 陈旧卡片静默抹掉配置。
        const rejection = emptyServersRejection(rows.length, managed.rows.length, body.clearAll)
        if (rejection !== undefined) {
          writeJson(res, 400, { error: rejection })
          return
        }
        try {
          writeManagedRows(rows)
        } catch (error) {
          writeJson(res, 500, { error: '写入补丁文件失败: ' + (error instanceof Error ? error.message : String(error)) })
          return
        }
        // DTO 必须在**保存之后**读：它要反映刚落地的行集与工具数。
        const dto = buildServersDto(ctx)
        writeJson(res, 200, { ok: true, applied: true, ...dto })
      },
    },
    {
      kind: 'exact',
      path: '/api/dsh-mcp/test',
      handler: async (req, res) => {
        if (!(await guard(req, res, 'POST'))) return
        const body = await readJsonBody(req)
        if (body === undefined) {
          writeJson(res, 400, { error: 'invalid JSON body' })
          return
        }
        const result = await testServer(body.config)
        writeJson(res, 200, { ok: true, result: { ...result, ...(result.tools !== undefined ? { tools: result.tools.slice(0, MAX_TOOLS_REPORTED) } : {}) } })
      },
    },
```

</details>

#### 缺口

- 实际宿主Agent视图的稳定回读接口尚未核实。
  **影响**：候选状态核对可能需要额外宿主改动。
  **进一步探讨**：先核对宿主工具schemas(scope)和模型请求快照接口，再验证状态一致性。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
