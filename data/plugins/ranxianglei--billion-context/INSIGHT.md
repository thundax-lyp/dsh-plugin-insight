# Billion Context 原生上下文压缩

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[08783ee](https://github.com/ranxianglei/billion-context/tree/08783eed1c0f242dc646f656cb5cccf5c91f1a34)

<!-- BEGIN META -->
[![GitHub ★ 8,162](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8%2C162&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ranxianglei/billion-context) [![npm 30d 3,935,946](https://img.shields.io/static/v1?label=npm+30d&message=3%2C935%2C946&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context) [![最新发布 2026-11-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context)
<!-- END META -->

> **功能**：为 DSH 等助手提供上下文分块压缩、按需回读与压缩状态查看。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将分块压缩和回读工具接入DSH会话及调用身份；[Q03](#research-q03) 覆盖加载与运行时preset的压缩接管，[Q06](#research-q06) 对断连后的重复预压缩设置状态门控。新增机制能解释所解决的路径，不证明任务质量或净节费。

> **主要限制**：[Q04](#research-q04) 的统一回读标题仍可能包住部分历史或摘要；[Q03](#research-q03) 接管涉及进程全局状态和宿主内部钩子，[Q05](#research-q05) 的解析过滤也不能保证所有旁路出站剥离。这些条件限制可逆与透明集成主张。

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
  - [Q01 · 长会话何时需要分块压缩而非简短交接文件？](#detail-section-11)
  - [Q02 · 工具与模型请求如何带上会话及调用身份？](#detail-section-12)
  - [Q03 · 自动压缩接管覆盖加载和运行时preset了吗，如何退出？](#detail-section-13)
  - [Q04 · decompress回读原文、部分历史或摘要如何区分？](#detail-section-14)
  - [Q05 · 顶层DSH扩展过滤会保留或移除什么？](#detail-section-15)
  - [Q06 · 断连后的preflight为何不再反复压缩，代价是什么？](#detail-section-16)
  - [Q07 · 人类状态页能解释哪些不可压缩和覆盖信息？](#detail-section-17)
  - [Q08 · 如何评估采用与原文来源标签假设？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适用对象是长编码会话中反复回查早期接口约束、失败输入或验收条件的 DSH 使用者。可代表为迁移一条 API，完成一段检查后折成摘要，发生回归时按块回读确切约束，再重做原验收。合格结果同时要求任务满足原测试标准和回读约束与原记录一致；压缩比高或会话继续响应本身都不足以验收。若旧事实只有几条、容易维护，原生压缩加人工决策文件通常更简单。

DSH原生压缩配合简短人工决策文件；少量可维护原事实时不一定需要代理与复杂回读。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 原生压缩工具 | 按会话范围折叠历史 | 代理与内核执行，需正确归属 |
| 回读与搜索 | 查折叠材料或按引用取原文 | 缓存/历史缺失可能回落摘要，归档可拒绝 |
| /acp和/acp-cache | 查看状态、计量与缓存信息 | 诊断/估计不等于实际账单和质量 |
| 压缩接管gate | 修改加载及运行时preset压缩配置 | 宿主内部钩子敏感，退出需重启核对 |
| Web Context与设置入口 | 人工查看压缩信息和配置 | 需宿主Web依赖，不等于运行验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node >=20且含dist的固定包 | 必需 | 解析宿主、gate和客户端 | 固定源码不等于发布成品能直接加载 |
| DSH tools、commands、agents | 原生入口必需 | 工具与命令、会话归属 | 注册或归属失败，不能继续压缩任务 |
| internal/config及服务提供、可选preset registry | 接管相应压缩所需 | 加载/动态preset覆盖 | 覆盖缺口需查日志，不能假定已关闭原生压缩 |
| 代理、上游模型与可写目录 | 执行必需 | 转发、摘要和原文留存 | 可能降级直连或回读/保存失败 |
| 同文件系统读取能力 | 长原文回读需要 | 读取代理写出文件 | 返回路径不等于宿主能访问 |
| Web slots与locale | Web界面所需 | 配置与Context页 | 命令与Web面板需分别核对 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户保留原profile与任务原件，固定宿主/包/模型 | 能恢复原生压缩与原验收任务 |
| 加载 | 宿主挂主入口和独立gate，连接或启动代理 | 工具就绪，会话归属与覆盖日志可核对 |
| 压缩 | 模型申请范围并通过代理执行 | 折叠结果与任务约束不矛盾 |
| 回读 | 模型选块、原文或文件，用户检查来源 | 逐字约束正确，摘要不冒充原文 |
| 失败 | 用户核对断连、过滤、门控与状态保存 | 不把超时/计量估计当成功 |
| 退出 | 用户移除bundle并重启，核对preset和压缩 | 原任务能在基线profile重新验收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包/代理运行与本地材料空间 | 核对宿主、端口、配置及压缩冲突 | 安装和配置耗时未知 |
| 持续使用 | 摘要/转发/回读请求、存储与缓存变化 | 复核原文、会话和诊断 | token估计不是账单，净费用未知 |
| 失败恢复 | 断连重试、重复任务与额外回读 | 查丢失原件、状态与门控 | 一次性preflight不保证请求合窗口 |
| 退出 | 代理/临时文件与历史留存 | 移除bundle、重启并恢复原profile | 完整恢复时间及数据清理范围待测 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 原生接入 | 会话/callId转发和工具注册 | 宿主真实身份、重载与并发结果 |
| 原文回读 | 缓存、历史、摘要和文件分支明确 | 全量原文可达与长期耐久恢复 |
| 压缩互斥 | 加载/动态preset改写与日志 | 实际所有会话覆盖及退出效果 |
| 重试处理 | 断连后抑制重复preflight | 成功率、端到端耗时与净节费 |
| 诊断 | protectedMass与覆盖信息可查询 | 人工排障改善和诊断成本 |

> **思考**：[Q04](#research-q04) 的统一回读标题仍可能包住部分历史或摘要；[Q03](#research-q03) 接管涉及进程全局状态和宿主内部钩子，[Q05](#research-q05) 的解析过滤也不能保证所有旁路出站剥离。这些条件限制可逆与透明集成主张。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将分块压缩和回读工具接入DSH会话及调用身份；[Q03](#research-q03) 覆盖加载与运行时preset的压缩接管，[Q06](#research-q06) 对断连后的重复预压缩设置状态门控。新增机制能解释所解决的路径，不证明任务质量或净节费。

[Q02](#research-q02) 将工具注册owner与代理存活分开，session锁保护材料快照；[Q03](#research-q03) 加载和runtime注册双入口覆盖揭示宿主适配成本；[Q06](#research-q06) 将断连后的重试预算放进会话状态，但状态保存和最终合格结果仍需实测。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04) 的统一回读标题仍可能包住部分历史或摘要；[Q03](#research-q03) 接管涉及进程全局状态和宿主内部钩子，[Q05](#research-q05) 的解析过滤也不能保证所有旁路出站剥离。这些条件限制可逆与透明集成主张。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q08](#research-q08) 保持观察，先准备脱敏副本与原始约束，再固定宿主、代理和模型做同任务比较。核对callId/会话、回读来源和所有压缩门控；出现冲突就移除bundle并重启，用原profile重做验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持原生身份转发、压缩门控与回读路径；恢复来源、旁路字段及退出有明确范围；当前DSH效果未测，标签设计未验证。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、dsh.bundle.patch.yml、tsup.config.ts、src/agent/dsh-native.ts、src/agent/shared.ts、src/agent/dsh-compaction-disable.ts、src/agent/dsh-compaction-gate.ts、src/agent/dsh-native-client.ts、src/plugin.ts、src/server/handle.ts、src/server/side-request.ts、src/server/relay.ts、src/decompress-shared.ts、src/session.ts、src/server.ts、src/rollout.ts、src/uncovered.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根包的DSH原生入口/客户端构建、代理工具与会话、加载及runtime压缩gate、原文回读与状态保存、DSH顶层扩展和旁路、preflight断连预算及状态面板；其他宿主协议更新不套用DSH效果。
- 下一步：只读取固定源码、旧正式研究和API原件并装配。未运行目标、构建、测试、DSH、模型、代理或基准；源码推导不是复现，作者不同版本/宿主结果不作本次验收。

**分析版本**

- **仓库**：[ranxianglei/billion-context](https://github.com/ranxianglei/billion-context)
- **版本号**：0.1.216（[固定提交 08783ee](https://github.com/ranxianglei/billion-context/tree/08783eed1c0f242dc646f656cb5cccf5c91f1a34)）
- **版本日期**：2026-11-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q08](#research-q08) 从 [Q04](#research-q04) 推导显式回读来源/覆盖标签的未验证设计。固定缓存全文、部分历史和摘要三组，只改变标签，比较误引、正确验收、回读次数与总成本；无改善或负担上升即否定。

只读取固定源码、旧正式研究和API原件并装配。未运行目标、构建、测试、DSH、模型、代理或基准；源码推导不是复现，作者不同版本/宿主结果不作本次验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 215 | 29351 | — | — | 620782 |
| .ts | source | 463 | 216114 | 144300 | 62589 | — |
| .mjs | source | 45 | 8651 | 6136 | 2062 | — |
| .ts | test | 1617 | 432164 | 359731 | 49474 | — |
| .mjs | test | 5 | 863 | 644 | 205 | — |
| .md | test | 1 | 359 | — | — | 2707 |
| .mts | example | 2 | 85 | 71 | 16 | — |
| .mjs | example | 1 | 21 | 16 | 4 | — |
| .ts | example | 1 | 67 | 48 | 16 | — |
| .md | example | 1 | 34 | — | — | 545 |
| .js | source | 1 | 618 | 602 | 26 | — |

</details>

**活跃度**

[![Issue 未关闭 870](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=870&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1,615](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1%2C615&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+created%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z) [![近30天关闭 1,009](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1%2C009&color=737b86&logo=github)](https://github.com/ranxianglei/billion-context/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z)



统计日期：2026-11-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：长编码会话能否在保持原验收与可核对原文的前提下，进行有界压缩和按需恢复，并在冲突时退出？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 长会话何时需要分块压缩而非简短交接文件？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适用对象是长编码会话中反复回查早期接口约束、失败输入或验收条件的 DSH 使用者。可代表为迁移一条 API，完成一段检查后折成摘要，发生回归时按块回读确切约束，再重做原验收。合格结果同时要求任务满足原测试标准和回读约束与原记录一致；压缩比高或会话继续响应本身都不足以验收。若旧事实只有几条、容易维护，原生压缩加人工决策文件通常更简单。

根包通过bundle挂载原生入口与独立压缩gate，工具从代理manifest注册到宿主，用户可在同一会话申请压缩、回读和查看状态。相对独立代理手工接线，DSH层增加会话归属、工具/命令及Web入口；实际折叠、重组和原文材料管理在代理与acp-kernel，不把宿主适配算作全部压缩算法原创。作者README的Pi及v0.1.202基准是作者报告，不能证明当前0.1.216在DSH上的净成本或安装效果。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:7-15](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/package.json#L7-L15)

根导出映射原生DSH和客户端。

```text
  "exports": {
    ".": "./dist/agent/dsh-native.js",
    "./server": "./dist/agent/opencode-native.js",
    "./dsh": "./dist/agent/dsh-native.js",
    "./dsh-compaction-gate": "./dist/agent/dsh-compaction-gate.js",
    "./package.json": "./package.json",
    "./dsh/package.json": "./package.json",
    "./client": "./dist/agent/dsh-native-client.js"
  },
```

**依据 2 · 源码核查**：[dsh.bundle.patch.yml:21-38](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/dsh.bundle.patch.yml#L21-L38)

原生入口、独立gate与preset依赖。

<details>
<summary>查看原文（18行）</summary>

```text
- insert:
    - id: bili-native
      name: billion-context
    - id: bili-compaction-gate
      name: billion-context/dsh-compaction-gate
- id: compaction-basic
  config:
    auto: false
# #3354: keep in sync with writeDshAcpPatch in src/launcher.ts — entry inject
# lists are REPLACED by patches, not concatenated; if a future dsh ships its
# own inject list on these entries, merge manually in BOTH layers.
- id: preset-standard
  inject: [biliBasicCompactionPolicy]
- id: preset-ptc
  inject: [biliBasicCompactionPolicy]
- id: preset-minimal
  inject: [biliBasicCompactionPolicy]
- id: preset-cordis
```

</details>

**依据 3 · 源码核查**：[src/agent/dsh-native.ts:998-1020](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/agent/dsh-native.ts#L998-L1020)

manifest定义实际注册到宿主工具服务。

<details>
<summary>查看原文（23行）</summary>

```text
        for (const [name, definition] of owner.definitions) {
            if (owner.ctx.tools.get?.(name) !== undefined) {
                adopted++;
                continue;
            }
            try {
                // The HOST owns the registration's lifetime: DSH's ToolsService
                // attaches it to the calling fiber via layers.effect(ctx, …), so
                // a restart or dispose removes it and tools/change lets the next
                // activation restore (#6702). Proxy death runs no effect — the
                // registration survives it (#3380).
                owner.ctx.tools.register(definition);
            } catch (err) {
                if (!errMessage(err).includes("already registered")) throw err;
                adopted++;
            }
        }
        if (adopted > 0 && !regAdoptLogged) {
            regAdoptLogged = true;
            persistClientEvent(`tool registration adopted ${adopted} pre-existing registration(s) from this process — continuing`);
        }
        register.toolsReady = owner.definitions.size > 0;
        if (!toolsAreReady()) throw new Error("bili: tool registrations did not become visible");
```

</details>

**依据 4 · 源码核查**：[src/agent/dsh-native.ts:2940-2949](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/agent/dsh-native.ts#L2940-L2949)

状态与缓存命令。

<details>
<summary>查看原文（10行）</summary>

```text
    ctx.commands.register({
        name: "acp",
        description: "Show bili context-compression status",
        handler: (invocation) => statusOutcome(ctx, invocation),
    });
    ctx.commands.register({
        name: "acp-cache",
        description: "Prompt-cache reconciliation (same report as the acp_cache tool)",
        handler: (invocation) => cacheOutcome(ctx, invocation),
    });
```

</details>

#### 缺口

- 缺少当前DSH版本与原生压缩加交接文件的同任务对照
  **影响**：只能限定适用任务，不能证明收益足以抵偿代理维护
  **进一步探讨**：固定模型、两条必须回读的原始约束和验收任务，对照最终正确性、回读准确性及全周期资源

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具与模型请求如何带上会话及调用身份？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

工具闭包在每次执行时取当前代理地址和exec.agent的会话，缺地址或归属即抛错；现在也把exec.callId传入shared.forwardTool，再作为toolCallId随JSON发给代理。代理校验非空字符串与长度，解析会话、读取记忆快照并在session锁内执行工具，采用该callId或兼容生成的ID交给执行器。这样能把宿主调用身份带到折叠执行层，不能只因ID相同就承诺所有重试都幂等或内核绝不重复折叠。工具注册由当前activation owner持有，旧owner/迟到应答不应复活新状态；已有同名工具可采纳，但名称存在不证明定义等价。

模型请求侧通过宿主dispatch作用域传会话和purpose。实际辅助purpose分流，DSH的conversation哨兵则等同“没有声明辅助目的”，仍允许启发式判断；不能套用Pi的强main语义。进入side lane后跳过压缩状态处理，但保留体积门槛，超限返回413。副请求不推进主压缩是本包的控制流依据，真实宿主是否正确传purpose、callId与会话仍是关键依赖；错误归属会影响压缩和回读同一任务的前提。

#### 证据与依据

**依据 1 · 源码核查**：[src/agent/dsh-native.ts:918-938](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/agent/dsh-native.ts#L918-L938)

实际tool转发携带exec.callId并处理业务失败。

<details>
<summary>查看原文（21行）</summary>

```text
        },
        execute: async (args, exec) => {
            // #983: read the LIVE base — a respawn after a proxy death moves
            // the origin, and a captured base would keep firing at a dead port.
            const base = register.base;
            if (base === undefined) {
                throw new Error("bili: proxy is down — recovery in progress, retry shortly");
            }
            const sid = exec.agent?.session?.id;
            if (typeof sid !== "string" || sid.length === 0) {
                throw new Error(`bili tool ${tool.name} requires an owning agent session`);
            }
            const out = await forwardTool(base, sid, tool.name, args, exec.signal, true, exec.callId);
            // #2204: dsh tool results are plain strings — a business failure
            // throws so the host renders an error, not success text.
            if (out.failed) throw new Error(out.text);
            return out.text;
        },
    };
}

```

</details>

**依据 2 · 源码核查**：[src/agent/shared.ts:379-404](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/agent/shared.ts#L379-L404)

HTTP请求体、超时与outcome映射。

<details>
<summary>查看原文（26行）</summary>

```text
export async function forwardTool(proxyBase: string, conversationId: string, tool: string, args: unknown, signal?: AbortSignal, nativeCaller: boolean = false, toolCallId?: string): Promise<ForwardedToolResult> {
    const body: { conversationId: string; tool: string; args: unknown; nativeCaller?: boolean; toolCallId?: string } = { conversationId, tool, args: args ?? {} };
    if (toolCallId !== undefined) body.toolCallId = toolCallId;
    // #2072: host-native agents (pi / dsh / opencode) stamp a per-call id minted
    // by the host's own session manager — declare it so a stale sibling witness
    // can neither redirect nor fail-closed the call (ladder rung 0, #2024/#2016).
    // Truthiness guard (not .length): a host passing a non-string id degrades to
    // the legacy id-less wire instead of throwing (same shape as src/mcp.ts).
    if (nativeCaller && conversationId) body.nativeCaller = true;
    const { ok, status, json } = await fetchJson(`${proxyBase}/__bili/plugin/tool`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
    }, effectiveToolTimeoutMs(proxyBase, tool), signal);
    const data = json as { ok?: boolean; result?: string; error?: string; outcome?: unknown; blocksCreated?: unknown } | undefined;
    if (!ok || !data?.ok) {
        throw new Error(`bili proxy tool ${tool} failed (${status}): ${data?.error ?? "unknown error"}`);
    }
    const outcome = parseToolOutcome(data.outcome);
    const blocksCreated = parseBlocksCreated(data.blocksCreated);
    let text = data.result ?? "";
    // #2752: a partial fold must stay distinguishable on lanes whose host shape
    // carries no structured state — the note rides the text. Applied/refused/
    // failure envelopes keep their exact historical bytes (no note).
    if (outcome === "partial") text += `\n${partialOutcomeNote(blocksCreated)}`;
    const out: ForwardedToolResult = { text, failed: outcome === "failure" || outcome === "refused" };
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:2302-2315](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/plugin.ts#L2302-L2315)

toolCallId与revision校验。

<details>
<summary>查看原文（14行）</summary>

```text
    let parsed: { conversationId?: unknown; tool?: unknown; args?: unknown; expectedRevision?: unknown; nativeCaller?: unknown; toolCallId?: unknown };
    try {
        parsed = JSON.parse(payload) as { conversationId?: unknown; tool?: unknown; args?: unknown; expectedRevision?: unknown; nativeCaller?: unknown; toolCallId?: unknown };
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("expected tool object");
    } catch {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "invalid JSON body" }));
        return;
    }
    const conversationId = typeof parsed.conversationId === "string" ? parsed.conversationId.trim() : "";
    const tool = typeof parsed.tool === "string" ? parsed.tool : "";
    if (parsed.toolCallId !== undefined && (typeof parsed.toolCallId !== "string" || !parsed.toolCallId.trim() || parsed.toolCallId.length > 512)) return forkReply(res, 400, { ok: false, code: "INVALID_REQUEST", error: "toolCallId must be a non-empty string of at most 512 characters" });
    if (parsed.expectedRevision !== undefined && (typeof parsed.expectedRevision !== "string" || !/^[a-f0-9]{64}$/.test(parsed.expectedRevision))) return forkReply(res, 400, { ok: false, code: "INVALID_REQUEST", error: "expectedRevision must be a snapshot revision" });
    if (parsed.expectedRevision !== undefined && !conversationId) return forkReply(res, 400, { ok: false, code: "INVALID_REQUEST", error: "expectedRevision requires conversationId" });
```

</details>

**依据 4 · 源码核查**：[src/plugin.ts:2522-2564](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/plugin.ts#L2522-L2564)

在session锁内取快照并传callId执行。

<details>
<summary>查看原文（43行）</summary>

```text
    const callId = typeof parsed.toolCallId === "string" ? parsed.toolCallId : `${PLUGIN_FOLD_CALLID_PREFIX}${Date.now().toString(36)}`;
    acquireInFlight(session);
    let result: ProxyToolResult | undefined;
    let retrievalExport: RetrievalExport | undefined;
    try {
        result = await withSessionLock(session, async () => {
            if (parsed.expectedRevision !== undefined) {
                try {
                    if (sessionRevisionOf(session) !== parsed.expectedRevision) {
                        forkReply(res, 409, { ok: false, code: "PARENT_REVISION_CONFLICT", error: "session revision changed" });
                        return undefined;
                    }
                } catch (err) {
                    forkReply(res, 409, { ok: false, status: "unavailable", code: "SNAPSHOT_UNAVAILABLE", error: String(err) });
                    return undefined;
                }
            }
            // Read the remembered snapshot UNDER the session lock: the model
            // request rewrites remembered atomically under this same lock
            // (rememberPluginMessages), so a racing tool call sees a consistent
            // state instead of a stale/empty window.
            const mem = session.transient?.pluginMessages;
            const messages = mem ? (mem.processed.length > 0 ? mem.processed : mem.original) : (session.pluginSnapshot ?? []);
            const before = currentContextObservation(session);
            const creditBefore = session.stats.compressCreditTokens ?? 0;
            const compressBefore = session.lastCompress;
            const pendingBefore = new Set(session.pendingRetrievals.map((p) => p.ref));
            const toolResult = await executeProxyToolAsync(tool, args, {
                core: deps.core,
                // #833: run proxy tools under the session's last resolved Config
                // (same values the wire path used), not the base kernelConfig.
                config: effectiveConfig(session, deps.config),
                messages,
                // #2627: compress against the RAW history, not the processed
                // outbound view — on the Responses wire that view carries the
                // synthetic acp_turn_sep_* ordering separators, which would be
                // registered into new blocks' coverage and read back as
                // permanent drift against the client's unchanged history
                // (same split as the relay loop ctx).
                compressMessages: mem && mem.original.length > 0 ? mem.original : undefined,
                session,
                log: (m) => deps.log("info", `[${session.id}] [plugin] ${m}`),
            }, callId, undefined, deps.signal);
```

</details>

**依据 5 · 源码核查**：[src/agent/dsh-native.ts:1026-1043](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/agent/dsh-native.ts#L1026-L1043)

注册owner生命周期。

<details>
<summary>查看原文（18行）</summary>

```text
function beginToolsOwner(ctx: PluginContext): ToolsOwner {
    if (ctx.effect === undefined && toolsOwner?.ctx === ctx && !toolsOwner.closed) return toolsOwner;
    if (toolsOwner !== undefined) toolsOwner.closed = true;
    const owner: ToolsOwner = { ctx, closed: false, restoring: false, definitions: new Map() };
    toolsOwner = owner;
    register.toolsReady = false;
    register.pending = undefined;
    register.retryAt = 0;
    ctx.effect?.(() => () => {
        owner.closed = true;
        if (toolsOwner === owner) {
            register.toolsReady = false;
            register.pending = undefined;
        }
    }, "bili: tool registration lifetime");
    ctx.on?.("tools/change", () => {
        if (owner !== toolsOwner || owner.closed || owner.restoring || owner.definitions.size === 0) return;
        // A real Cordis teardown fires tools/change from the tool disposers
```

</details>

**依据 6 · 源码核查**：[src/server/handle.ts:1382-1408](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/server/handle.ts#L1382-L1408)

DSH与Pi的purpose哨兵语义区别。

<details>
<summary>查看原文（27行）</summary>

```text
        // #6880: normalize the declared purpose for the SIDE classification
        // (and the lane log below) — one parse, marker-gated. The
        // "conversation" sentinel the post-#6883 plugin stamps on MAIN turns
        // means "no declared auxiliary purpose", so it is indistinguishable
        // from the absent header here (an aux dispatch never carries the
        // sentinel: dsh leaves purpose unset for ordinary conversation and
        // the plugin only stamps the real value).
        const rawDeclaredPurpose = pluginPurposeHeader(req.headers);
        const declaredPurpose = rawDeclaredPurpose === PLUGIN_PURPOSE_CONVERSATION ? undefined : rawDeclaredPurpose;
        // #6884 (pi's leg of the #6880 declaration; cross-agent session-id
        // audit in discussions/6884): the "conversation" sentinel means
        // DIFFERENT things per client. dsh derives it ("dsh left
        // GenerateOptions.purpose unset on this dispatch" — possibly a brand-
        // new aux feature the KNOWN_AUXILIARY_PURPOSES documentation set does
        // not know yet), so for dsh it stays ≡ absent: the body heuristics
        // classify, byte-for-byte as before #6884. pi has NO auxiliary-call
        // concept at all (no title-gen, no compaction summarizer, no
        // auto-review; subagents/forks mint FRESH session ids, so their turns
        // ride their own ids) — its sentinel is a FACT about the dispatch:
        // "this is the session's main conversation turn". A declared pi main
        // turn therefore rides the #1699 explicit-"main" intent rung inside
        // isSideRequest: it outranks every body heuristic (the budget <= 200
        // demotion, the single-shot shapes) instead of being demoted to the
        // #388 side passthrough by a shape guess — a `pi -p` one-shot with a
        // small maxTokens and no tools must enter the kernel pipeline.
        const declaredPiMainTurn = rawDeclaredPurpose === PLUGIN_PURPOSE_CONVERSATION
            && pluginAgentHeader(req.headers) === "pi";
```

</details>

**依据 7 · 源码核查**：[src/server/handle.ts:2957-2990](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/server/handle.ts#L2957-L2990)

side路由、体积拒绝与状态旁路。

<details>
<summary>查看原文（34行）</summary>

```text
        const sideLane = resolveSideLane({ countTokens, responsesCompact, protocol, stripApplied: demotedSide, sideIntent, requestAgent, sideLabel: declaredPurpose !== undefined ? `declared purpose=${declaredPurpose} (#6880)` : serverToolUtility ? "server-tool utility call (#2500)" : structuredOutputUtility ? "structured-output utility call (#5073)" : audioOutputUtility ? "audio-output utility call (#6636)" : dshTitleSidecar ? "dsh title-gen sidecar (#2503)" : dshReviewSidecar ? "dsh auto-review sidecar (#4438)" : dshSingleShotSidecar ? "dsh single-shot sidecar (#5656)" : ccTitleSidecar ? "claude-code title-gen sidecar (#5135)" : grokAuxSidecar ? "grok auxiliary sidecar (#6884)" : mcodeTitleSidecar ? "mcode title sidecar (#6884)" : mcodeOneShotSidecar ? "mcode one-shot aux sidecar (#6884)" : gooseSingleShotSidecar ? "goose single-shot sidecar (#6884)" : codebuddyCompactionSidecar ? "codebuddy compaction sidecar (#6884)" : opencodeTitleSidecar ? "opencode title-gen sidecar (#6884)" : undefined });
        if (sideLane.lane === "side") {
            // #554: the passthrough below skips EVERY input-side guard by design
            // (#388) — a full-history side request over the window is a
            // guaranteed upstream 400 (and title-gen/probe clients re-issue it,
            // hammering the upstream). Gate on the raw body estimate and fail
            // fast locally instead of forwarding (#301 precedent).
            const reqModel = requestModel;
            // #1110: only a genuine overflow arm bounds the guard — never the
            // nudge baseline (lastInputTokens). A healthy compressed host turn
            // keeps that baseline low, which permanently 413'd an unrelated
            // in-process caller's fixed-size request even though it fit the
            // model's real window. overflowArmTokens is set ONLY by an upstream
            // context-overflow 400 and cleared by the next real usage report.
            const armedForGuard = typeof session.stats.overflowArmTokens === "number" && session.stats.overflowArmTokens > 0 ? session.stats.overflowArmTokens : 0;
            const guard = sideRequestGuard(parsed, protocol, reqConfig.modelContextLimit, imageBillingFor(opts, route?.rewrittenUrl ?? upstreamOrigin), imageTokenCapFor(opts, route?.rewrittenUrl ?? upstreamOrigin), headroomCap, armedForGuard, imageReserveFor(session, protocol, parsed, opts, route?.rewrittenUrl ?? upstreamOrigin), shouldReserveOutputHeadroom(protocol, normalizeUpstreamOrigin(route?.rewrittenUrl ?? upstreamOrigin), requestModel));
            if (guard.blocked) {
                log("warn", `[${session.id}] side request (~${guard.estimate} tokens) ≥ effective window ${guard.limit} (model=${reqModel ?? "?"}) — NOT forwarded: guaranteed upstream 400 (side requests bypass preflight by design, #388)`);
                if (!res.headersSent && !res.writableEnded && !res.destroyed) {
                    res.writeHead(413, { "content-type": "application/json" });
                    res.end(JSON.stringify({
                        error: {
                            type: "server_error",
                            code: "side_request_payload_too_large",
                            message: `side request payload ~${guard.estimate} tokens reaches the effective context window ${guard.limit} (model=${reqModel ?? "unknown"}); NOT forwarded — side requests bypass compression by design (#388). Shrink the conversation or raise the model's context window.`,
                            retryable: false,
                        },
                    }));
                }
                logRequestCost(log, session.id, inboundMsgs, inboundBytes, reqT0);
                return;
            }
            const sideReason = sideLane.reason;
            log("info", `[${session.id}] side request (${sideReason}) → passthrough + tag strip only, kernel state untouched`);
```

</details>

#### 缺口

- 未独立取得当前宿主callId/purpose传递及并发重载的执行轨迹
  **影响**：不能把源码转发字段当作跨版本身份或幂等保证
  **进一步探讨**：固定DSH宿主，在两会话/辅助请求/重载/相同调用重试下核对线上的身份、代理session与block结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动压缩接管覆盖加载和运行时preset了吗，如何退出？

**研究主题**：依赖、兼容与流程、功能与机制、工程质量与复用

#### 完整回答

补丁不仅插入主入口，还单独插入bili-compaction-gate，让preset等待其提供的服务；主入口按plan决定是否接管，并写process-global active标志。gate在internal/config中间件就位后提供服务，只在active时禁用嵌套原生压缩，缺内部钩子或服务能力时出现覆盖缺口。补丁还改顶层compaction-basic、四个preset注入和两条DeepSeek重试配置，这些替换会影响宿主配置，不能视为仅增加几个工具。

运行时调用agentPresets.register的定义不会经过加载配置中间件，本包另外包装registry.register，在active且定义有plugins时重写压缩行，并用Symbol.for避免同一registry二次包装；没有registry就跳过。覆盖日志区分加载重写与运行时注册，零次记录不证明以后没有懒加载。包装直接替换方法，所检查函数没有恢复原方法的卸载effect；active只有声明和测试重置，故已在此进程激活后，仅禁用主入口不能据此保证原生压缩立刻恢复。完整退出应移除bundle并重启，再核对原profile压缩和preset；不单独关闭gate，以免仍等待其服务的preset停滞。

#### 证据与依据

**依据 1 · 源码核查**：[dsh.bundle.patch.yml:21-55](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/dsh.bundle.patch.yml#L21-L55)

独立gate、preset依赖及重试替换范围。

<details>
<summary>查看原文（35行）</summary>

```text
- insert:
    - id: bili-native
      name: billion-context
    - id: bili-compaction-gate
      name: billion-context/dsh-compaction-gate
- id: compaction-basic
  config:
    auto: false
# #3354: keep in sync with writeDshAcpPatch in src/launcher.ts — entry inject
# lists are REPLACED by patches, not concatenated; if a future dsh ships its
# own inject list on these entries, merge manually in BOTH layers.
- id: preset-standard
  inject: [biliBasicCompactionPolicy]
- id: preset-ptc
  inject: [biliBasicCompactionPolicy]
- id: preset-minimal
  inject: [biliBasicCompactionPolicy]
- id: preset-cordis
  inject: [biliBasicCompactionPolicy]
# #2605: DSH's default retry whitelist omits MALFORMED_RESPONSE, so one
# sampling flake that breaks a tool-call argument JSON kills the whole turn
# unretried. A patch replaces the targeted row's WHOLE config (no deep
# merge), so each row restates every default code plus MALFORMED_RESPONSE —
# dropping any default code silently removes its retries. Rows absent on a
# given DSH version are skipped with a warning, never a boot failure.
- id: llm-deepseek
  config:
    retryPolicy:
      mode: normal
      retryableCodes: [EMPTY_RESPONSE, RATE_LIMIT, SERVER, TIMEOUT, TRANSPORT, MALFORMED_RESPONSE]
- id: llm-deepseek-account
  config:
    retryPolicy:
      mode: normal
      retryableCodes: [EMPTY_RESPONSE, RATE_LIMIT, SERVER, TIMEOUT, TRANSPORT, MALFORMED_RESPONSE]
```

</details>

**依据 2 · 源码核查**：[src/agent/dsh-native.ts:1972-1988](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/agent/dsh-native.ts#L1972-L1988)

主入口接管声明。

<details>
<summary>查看原文（17行）</summary>

```text
export async function apply(ctx: PluginContext): Promise<void> {
    const plan = planNativeDsh(process.env);
    if (plan.mode === "off") return;
    // #3616: a fresh activation is a fresh origin world — in-flight recoveries
    // from the previous world are superseded here (their late landings must not
    // write this world's register/state). Off-mode arms nothing and bumps
    // nothing: invalidating recoveries on a kill-switch could strand the lane.
    originGen += 1;

    // #3354/#3662: declare that THIS process owns compression so the always-on
    // gate entry's load-time overlay (#3354) actually disables the web-profile
    // preset instances no patch layer can address by id (#1772/#2360). The
    // declaration — not the registration — is what's gated on plan.mode: a
    // kill-switched or disabled bili-native never declares, and the gate then
    // leaves every row stock while its service still lets the presets boot
    // (disabling the plugin must not brick session creation, #3662).
    declareDshCompactionActive();
```

</details>

**依据 3 · 源码核查**：[src/agent/dsh-compaction-disable.ts:80-103](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/agent/dsh-compaction-disable.ts#L80-L103)

process-global active与仅测试重置。

<details>
<summary>查看原文（24行）</summary>

```text
// #3662: process-level verdict between the two entries. They are SEPARATE
// bundles in the dsh host (separate module instances — module state cannot
// cross them), and globalThis is the only surface both share. bili-native's
// apply() declares active once its plan says bili owns the lane; an ABSENT
// declaration means bili-native never ran in this process (entry disabled,
// kill-switched before the declaration, or its module failed to load) and the
// transform leaves every row stock. Availability over fail-safe-brick: a dead
// bili-native hands the lane back to stock dsh compaction, with the wire-level
// refusal guard (#1729) as backstop.
const DSH_COMPACTION_VERDICT_KEY = "__BILI_DSH_COMPACTION_VERDICT__";

/** bili-native calls this from apply() when its plan keeps the lane owned. */
export function declareDshCompactionActive(): void {
    (globalThis as Record<string, unknown>)[DSH_COMPACTION_VERDICT_KEY] = "active";
}

export function isDshCompactionActive(): boolean {
    return (globalThis as Record<string, unknown>)[DSH_COMPACTION_VERDICT_KEY] === "active";
}

/** Test hook: forget any declaration (back to "bili-native never ran"). */
export function _resetDshCompactionVerdictForTest(): void {
    delete (globalThis as Record<string, unknown>)[DSH_COMPACTION_VERDICT_KEY];
}
```

</details>

**依据 4 · 源码核查**：[src/agent/dsh-compaction-disable.ts:254-279](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/agent/dsh-compaction-disable.ts#L254-L279)

runtime定义改写、直接register包装和幂等标记。

<details>
<summary>查看原文（26行）</summary>

```text
export function disableRuntimePresetCompaction(definition: unknown): unknown {
    if (definition === null || typeof definition !== "object") return definition;
    const def = definition as { id?: unknown; plugins?: unknown };
    if (typeof def.id !== "string" || !Array.isArray(def.plugins)) return definition;
    if (!isDshCompactionActive()) return definition;
    const rows = countCompactionRows(def.plugins as readonly unknown[]);
    if (rows === 0) return definition;
    noteRuntimePresetCoverage(def.id.slice(0, 120), rows);
    return { ...def, plugins: disableBasicCompaction(def.plugins as readonly unknown[]) };
}

/**
 * #7190: wrap agentPresets.register() so a preset definition born AFTER boot
 * (the only path a runtime preset takes) carries the same disabled compaction
 * rows the load-time overlay writes for stock presets. Idempotent per instance
 * (Symbol-for mark); degrades silently when the host exposes no registry —
 * a host without it cannot runtime-register presets, so nothing is uncovered.
 */
export function installRuntimePresetCoverage(ctx: CompactionDisableHost): void {
    const registry = presetRegistryOf(ctx);
    if (registry === undefined || typeof registry.register !== "function") return;
    if ((registry as Record<PropertyKey, unknown>)[PRESET_REGISTER_WRAP_MARK] === true) return;
    const original = registry.register;
    registry.register = (definition: unknown) => original.call(registry, disableRuntimePresetCompaction(definition));
    (registry as Record<PropertyKey, unknown>)[PRESET_REGISTER_WRAP_MARK] = true;
    noteRuntimeWrapped();
```

</details>

**依据 5 · 源码核查**：[src/agent/dsh-compaction-disable.ts:302-332](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/agent/dsh-compaction-disable.ts#L302-L332)

加载中间件、服务提供及运行时包装接线。

<details>
<summary>查看原文（31行）</summary>

```text
export function registerCompactionDisable(ctx: CompactionDisableHost): void {
    if (typeof ctx.on === "function") {
        // Preset entries must carry the gate: sibling imports may finish out of order.
        ctx.on("internal/config", function (this: MiddlewareSelf, _raw: unknown, next: () => unknown): unknown {
            const resolved = next();
            // #3662: honor the process verdict — without an active declaration
            // from bili-native every row passes through stock.
            if (!isDshCompactionActive()) return resolved;
            // #4147: match STRUCTURALLY, not by entry name — custom presets run
            // their compaction inside nested rows under their own entry, and a
            // name filter leaves exactly those armed. Rewrite only when the
            // tree actually nests a compaction row, so unrelated entries keep
            // their resolved config object identity.
            const config = (resolved ?? {}) as { plugins?: unknown };
            if (!Array.isArray(config.plugins)) return resolved;
            const compactionRows = countCompactionRows(config.plugins);
            if (compactionRows === 0) return resolved;
            const rawName = this?.entry?.options?.name;
            const entryName = typeof rawName === "string" ? rawName : "unnamed-entry";
            noteGateCoverage(entryName.slice(0, 120), compactionRows, entryName === DSH_AGENT_PRESET_PACKAGE);
            return { ...config, plugins: disableBasicCompaction(config.plugins) };
        }, { global: true });
    }
    // Publish only after the middleware is registered; the host owns both lifetimes.
    ctx.reflect?.provide?.(BILI_COMPACTION_DISABLE_SERVICE, Object.freeze({ owner: "billion-context", issue: "#3354" }));
    // #7190: the register() wrap covers the one row population no config layer
    // can reach — runtime preset definitions. Bundles apply in composition
    // order (this entry is inserted before profile plugins), so the wrap is in
    // place before a plugin's register() runs; the verdict is honored per call,
    // and the wrap is idempotent across re-apply.
    installRuntimePresetCoverage(ctx);
```

</details>

#### 缺口

- 宿主内部钩子、动态preset和卸载后的组合状态没有本轮真实记录
  **影响**：覆盖日志不能证明所有当前会话都只用一种压缩机制
  **进一步探讨**：固定宿主分别加载静态/动态preset，再禁主入口、移除bundle并重启，对照实际压缩配置、服务等待与会话可用性

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · decompress回读原文、部分历史或摘要如何区分？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

回读先认块与归档。原始内容被宿主原生压缩替换并归档时明确失败；有效块有缓存则按one/full选择原文视图，没有缓存便从当前原始历史收集，收集不到文本才退回block.summary。结果标题都形如Block content、条数和full，未显式标注取自缓存、部分历史或摘要；full是选择参数，不足以独立证明返回完整原文。派生会话可回读祖先只读内容，但同样有摘要回落边界，搜索无命中不能证明旧讨论没有事实。

长于10000字符的正文自动用随机名、wx独占和0600权限写临时文件，返回路径仍需要宿主读取工具能访问代理所在文件系统。写出失败有失败回执；它不是把全文送回当前上下文，不能把路径成功当模型已读。短正文内联回读可标记restoredInline以便后续重折，状态变化进入markDirty/scheduleSave，工具回执不能证明异常退出后一定持久恢复。由此“可逆压缩”应限定原文缓存仍在、未被宿主归档且读文件边界可达的范围。

#### 证据与依据

**依据 1 · 源码核查**：[src/decompress-shared.ts:192-237](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/decompress-shared.ts#L192-L237)

归档拒绝、缓存与历史/摘要回落。

<details>
<summary>查看原文（46行）</summary>

```text
    const rawBlockId = args.blockId;
    if (typeof rawBlockId !== "string" || rawBlockId.length === 0) {
        return toolFail("[decompress FAILED: blockId is required]");
    }
    const blockId = rawBlockId.trim();
    const block = ctx.core.decompress(blockId, ctx.session.state);
    if (!block) {
        // Removed-from-state blocks (the #2695 reap path, or a future archive
        // that drops blocks) still carry their preCompactionArchive entry: fail
        // with the real reason instead of the misleading "not found" — the
        // model got here by citing a ref from a summary it legitimately saw.
        const selfArchived = preCompactionArchiveOf(ctx.session)[blockId];
        if (selfArchived !== undefined) {
            return toolFail(`[decompress FAILED: block ${blockId} is an archived block (${selfArchived.reason}) — it was removed from live state along with its covered substrate and cannot be restored.]`);
        }
        return resolveDerivedDecompress(args, ctx, blockId);
    }
    const archived = preCompactionArchiveOf(ctx.session);
    if (archived[blockId] !== undefined) {
        return toolFail(`[decompress FAILED: block ${blockId} is a pre-compaction archive — its content was in the history BEFORE the client's native compaction and is no longer reachable (replaced by the client's compaction summary). decompress is unavailable for archived blocks.]`);
    }
    // #1712: blank/whitespace range fields mean "unspecified" — hosts and models
    // emit "" for optional fields, and treating that as a range request produced
    // an unsatisfiable retry loop (fill in a real range → refused in plugin mode).
    if (hasRangeArgs(args)) {
        return resolveDecompressRange(args, ctx, block);
    }

    const full = args.full === true || args.full === "true";
    const cached = ctx.session.blockContents.get(blockId);
    let body: string;
    let count: number;
    if (cached) {
        // Honor the full flag: `one` = direct msgs + nested child summaries,
        // `full` = all original messages. Returning the cached full text
        // unconditionally would break the default one-level semantics.
        // `one === null` means the two views were byte-identical at cache
        // time and deduped to one copy (#401).
        const view = full ? cached.full : (cached.one ?? cached.full);
        body = view.text;
        count = view.count;
    } else {
        const collected = collectBlockContent(ctx.session.state, block, ctx.compressMessages ?? ctx.messages, { full });
        body = collected.text || block.summary;
        count = collected.count;
    }
```

</details>

**依据 2 · 源码核查**：[src/decompress-shared.ts:247-284](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/decompress-shared.ts#L247-L284)

统一标题、独占文件写出、内联标记与状态保存。

<details>
<summary>查看原文（38行）</summary>

```text
    const header = `[Block ${blockId} content — ${count} item(s)${full ? ", full" : ""}]`;
    const toFileOut = toFilePointer(args, ctx, header, body);
    if (toFileOut !== null) return toFileOut;
    const safeBlockId = blockId.replace(/[^a-zA-Z0-9_-]/g, "-");
    const outPath = body.length > 10000 ? join(tmpdir(), `acp-decompress-${safeBlockId}-${randomUUID()}.txt`) : null;
    if (outPath) {
        try {
            mkdirSync(dirname(outPath), { recursive: true });
            writeFileSync(outPath, body, { encoding: "utf8", mode: 0o600, flag: "wx" });
            trackedTempFiles.push({ path: outPath, mtimeMs: Date.now() });
            reapTempFiles();
            return toolOk(`${header}\nContent (${body.length} chars) written to: ${outPath}\nUse the read tool to access it.`);
        } catch (e) {
            return exportFailureReceipt(outPath, e, body);
        }
    }
    // #398/#403 + #1294 P2 wiring (dedup of #1316 × #1298): a successful INLINE
    // whole-block restore hands the block's re-summarization material back to
    // the model via this tool result, and the client keeps tool results in its
    // re-sent history — flag restoredInline so a later compress refolds the
    // block in place (kernel K2) instead of bouncing off "already
    // compressed". The toFile path above returns BEFORE this point and stays
    // byte-identical to pre-refold behavior (no flag, no hint — the material
    // lives in a temp file, not the conversation). Range restores
    // (startId/endId) return partial content and never reach here; inactive
    // blocks can never refold.
    if (!block.active) return toolOk(`${header}\n${body}`);
    // The kernel result is idempotent — a repeat restore recomputes the same
    // span, so the hint stays byte-identical across repeats (old contract:
    // repeat decompress returns identical content). Only the FIRST restore
    // pays the state write + persist.
    const marked = markBlockRestoredInline(ctx.session.state, blockId);
    if (block.restoredInline !== true) {
        ctx.session.state = marked.state;
        markDirty(ctx.session);
        ctx.log(`[acp-decompress-inline] ${blockId}: flagged restoredInline${marked.result?.restoredStartRef ? ` (${marked.result.restoredStartRef}–${marked.result.restoredEndRef})` : ""}`);
    }
    return toolOk(`${header}\n${body}\n\n${refoldHint(blockId, marked.result)}`);
```

</details>

**依据 3 · 源码核查**：[src/session.ts:1793-1799](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/session.ts#L1793-L1799)

dirty只调度保存。

```text
/** Mark a session's state as changed so it is persisted on the next debounce.
 *  Call this after any mutation (processTurn, compress, decompress, orphan GC). */
export function markDirty(session: Session): void {
    session.revisionEpoch = (session.revisionEpoch ?? 0) + 1;
    getStore().scheduleSave(session);
}

```

#### 缺口

- 缺少原文缓存丢失、宿主归档和代理崩溃后的逐字回读对照
  **影响**：不能保证所有块都可完整恢复或回执后立刻耐久保存
  **进一步探讨**：以同一约束制作完整缓存、部分历史、仅摘要、已归档四组，核对回读字节、来源和重启后状态

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 顶层DSH扩展过滤会保留或移除什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

新helper withoutDshClientExtensions对已解析的对象移除所有顶层键名以dsh_开头的字段，嵌套键保持；passDshExtensions rollout默认percent=0，默认路径会调用该helper。注释举dsh_session_log和dsh_plugin_packages并说明避免把额外日志送到不支持字段的上游，但实际匹配范围比这两个字段更广，将来新增顶层dsh_*也会落入过滤。是否影响官方端诊断或其他扩展语义需宿主与上游证据，不能从“模型不读它”推出无影响。

解析层过滤也不能泛称所有出站都已剥离。side lane在demotedSide为false时优先使用原bodyBuffer，再做协议清理；只有某些需要重写的分支才JSON序列化parsed，最后直接forward sideBody。源码可推导普通旁路仍可能保留原顶层扩展，这与helper存在是不同层，尚未用网络抓包复现。本次因此不把这项默认过滤作为完整隐私保证，也不把注释称节省8MiB当作实际本次测量。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/handle.ts:116-133](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/server/handle.ts#L116-L133)

helper删除所有顶层dsh_*而不改嵌套。

<details>
<summary>查看原文（18行）</summary>

```text
// #7168/#7439: DSH rides top-level `dsh_*` client extensions on every request —
// `dsh_session_log` (the 8 MiB lossless session-log upload for the official
// DeepSeek API; the model never reads it) plus the sibling `dsh_plugin_packages`.
// During the transition bili INTERCEPTS them: this drops every TOP-LEVEL `dsh_*`
// key so the 8 MiB is never forwarded upstream (no bandwidth waste, no unknown-
// field risk on a non-DeepSeek upstream). Nested `dsh_*` (inside messages, etc.)
// is untouched — only top-level keys go. Returns the same reference when there is
// nothing to drop (fast path). Gated by the `passDshExtensions` rollout flag
// (default OFF = strip). RELEASE the intercept by flipping the flag to 100% once
// the client-extension sideband ships (#6785 / discussion #7439). Exported for tests.
export function withoutDshClientExtensions(parsed: unknown): unknown {
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return parsed;
    const rec = parsed as Record<string, unknown>;
    if (!Object.keys(rec).some((k) => k.startsWith("dsh_"))) return parsed;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rec)) if (!k.startsWith("dsh_")) out[k] = v;
    return out;
}
```

</details>

**依据 2 · 源码核查**：[src/rollout.ts:120-128](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/rollout.ts#L120-L128)

默认rollout关闭passDshExtensions。

```text
    // upload watermark only advances on a 2xx (llm-deepseek/adapter.ts), which bili
    // still returns; the window meter is separately exempt (#7168 dsh_* skip).
    // RELEASE once the server-authoritative egress work (#6785 / discussion #7439)
    // ships the client-extension sideband — flip this to 100% (or remove the strip)
    // and DSH's official-DeepSeek session-log upload resumes. Force pass-through
    // now with `rollout.features.passDshExtensions: true` /
    // `BILI_ROLLOUT_PASS_DSH_EXTENSIONS=1`.
    passDshExtensions: { percent: 0 },
    // #7439 — stamped session-id identity: the server trusts the client's stamped
```

**依据 3 · 源码核查**：[src/server/handle.ts:770-778](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/server/handle.ts#L770-L778)

实际parsed过滤调用。

```text
        }
    }
    // #7168/#7439: intercept DSH client extensions (default) — strip top-level
    // `dsh_*` so the 8 MiB `dsh_session_log` is never forwarded upstream. Gated by
    // the `passDshExtensions` rollout flag (default OFF = strip); release it once
    // the client-extension sideband ships (#6785 / #7439). See
    // withoutDshClientExtensions + src/rollout.ts.
    if (!featureEnabled("passDshExtensions")) parsed = withoutDshClientExtensions(parsed);
    // Capture the raw-wire verdict before unwrapping or preparing can mutate
```

**依据 4 · 源码核查**：[src/server/handle.ts:2990-3023](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/server/handle.ts#L2990-L3023)

普通side使用原bodyBuffer并直接转发。

<details>
<summary>查看原文（34行）</summary>

```text
            log("info", `[${session.id}] side request (${sideReason}) → passthrough + tag strip only, kernel state untouched`);
            // #1897: a demoted request was mutated (tools stripped) — re-serialize
            // the parsed body so the leak is actually gone from the wire.
            let sideBody = scrubAnthropicPck(protocol, demotedSide ? Buffer.from(JSON.stringify(parsed)) : bodyBuffer, log);
            const sideInput = (parsed as ResponsesRequestBody).input;
            if (protocol === "responses" && Array.isArray(sideInput)) {
                const { items, replaced, dropped } = replaceBiliCompactionItems(sideInput);
                if (replaced + dropped > 0) {
                    sideBody = Buffer.from(JSON.stringify({ ...parsed, input: items }));
                    log("info", `[${session.id}] side request normalized bili compaction handoffs (replaced=${replaced}, dropped=${dropped})`);
                }
            }
            sideBody = scrubCompatDrop(sideBody, compatDropPaths, log);
            // Gemini and Vertex encode stream mode in the path rather than the body.
            const requestStream = parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
                && "stream" in parsed && parsed.stream === true;
            const sidePrepared: Prepared = {
                body: sideBody,
                session,
                processedMessages: [],
                originalMessages: [],
                protocol,
                model: throttleModel,
                stream: protocol === "google"
                    ? googlePathKind(urlPath) === "stream-generate"
                    : protocol === "anthropic" && vertexModel !== undefined
                      ? urlPath.includes(":streamRawPredict")
                      : requestStream,
                compressInjected: false,
                sidePassthrough: true,
            };
            logRequestCost(log, session.id, inboundMsgs, inboundBytes, reqT0, bodyBuffer);
            await forward(req, res, opts, sideBody, sidePrepared, core, reqConfig, log, route, instanceId, affinity);
            return;
```

</details>

#### 缺口

- 缺少带dsh_*的主/旁路请求实际出站字节与上游需求记录
  **影响**：不能保证默认剥离覆盖所有链或不影响日志诊断
  **进一步探讨**：在隔离透明上游记录主请求、普通side、demoted side和开关切换的字节差异，并核对宿主诊断功能

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 断连后的preflight为何不再反复压缩，代价是什么？

**研究主题**：功能与机制、缺陷与关键质疑、效果与总成本

#### 完整回答

当预转发压缩遇clientAbort或aborted失败，本轮不再转发，并增加持久字段preflightRuns、markDirty；后续同会话若已有已提交折叠或preflightRuns>0，preflight门控直接返回prepared，避免每次重试都先花数分钟压同一份内容。快速429、400或空摘要失败没有进入这个aborted计次分支，不能说所有失败都只试一次。session压缩重置清除此字段，epoch替换还有例外，恢复语义依赖对应状态保存。

代价是“停止重复慢压缩”不等于“保证请求合窗口”。后续可能原样送上游，再依赖请求内refold或egress检查；若压缩不是当前瓶颈，门控本身没有收益。会话用量新增请求model归属，说明同origin另一模型的用量不能直接证明当前模型窗口；状态面板还有本地估计，不应当账单。合理比较需把客户端断连、重复摘要、再次转发、缓存与额外回读一起计入同一合格任务，而不能仅看输入token变少。

#### 证据与依据

**依据 1 · 源码核查**：[src/server.ts:4178-4186](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/server.ts#L4178-L4186)

已提交压缩/已花preflight机会时原样返回。

```text
    const epochReplaced = epochConfirmPending(session);
    const compressionCommitted = !epochReplaced && (session.state.stats?.compressionCount ?? 0) > 0;
    const preflightSpent = (session.stats.preflightRuns ?? 0) > 0;
    if (compressionCommitted || preflightSpent) {
        if (!preflightGateBlockedLogged.has(session.id)) {
            preflightGateBlockedLogged.add(session.id);
            log("warn", `[${session.id}] preflight trigger fired but the session's one-shot fold is already spent (${compressionCommitted ? `session compression-managed (${session.state.stats?.compressionCount} committed fold(s))` : "an earlier fold attempt was aborted by a client disconnect"}) — forwarding as-is; overflow recovery stays with #1195 in-request refold and the egress fuse`);
        }
        return prepared;
```

**依据 2 · 源码核查**：[src/server.ts:4641-4656](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/server.ts#L4641-L4656)

仅断连/aborted花机会且本轮不转发。

<details>
<summary>查看原文（16行）</summary>

```text
    const f = result.failure;
    // 重建过程也会让出执行权；所有转发许可都必须在此重新检查取消。
    if (clientAbort.signal.aborted || f?.kind === "aborted") {
        // One-shot fold gate: a client-disconnected abort is the livelock
        // shape (2026-11-22 log-32: nine 3.5-4 min self-summaries of the
        // same payload, each cut at exactly +300.0s, payload never
        // shrinking). The aborted attempt spent the session's one preflight
        // shot: the next trigger forwards as-is (overflow recovery stays
        // with #1195 in-request refold). A FAST failure (summary 429/400/
        // empty) does NOT spend the shot — the #726/#4079 retry contract
        // must keep re-running the walk on transient summary outages.
        session.stats.preflightRuns = (session.stats.preflightRuns ?? 0) + 1;
        markDirty(session);
        const detail = f?.kind === "aborted" ? f.detail : "the client disconnected during preflight compression";
        log("warn", `[${session.id}] preflight aborted (${detail}); not forwarding`);
        return { failFast: true, status: 0, message: detail, retryable: false, respond: false };
```

</details>

**依据 3 · 源码核查**：[src/session.ts:570-581](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/session.ts#L570-L581)

用量模型绑定的状态说明。

<details>
<summary>查看原文（12行）</summary>

```text
         *  Absent on legacy session files → baseline keeps legacy behavior. */
        lastInputTokensOrigin?: string;
         /** Identity-fast-path: the REQUEST MODEL that measured lastInputTokens
          *  — stamped at usage settlement (settleUsageReport / applyUsageSample)
          *  and at overflow arming, alongside lastInputTokensOrigin. Acceptance
          *  evidence on one model says nothing about another model's wall on
          *  the same origin (#2189: 300k billed on claude-big does not bind
          *  claude-small). Absent on legacy session files → the gate demotes
          *  conservatively and the protection chain judges. */
        lastInputTokensModel?: string;
         /** #1933 F1: calibrated scale factor k̂ = mean of up to 3 recent
          *  consistent same-route samples of (upstream-billed input ÷ local
```

</details>

**依据 4 · 源码核查**：[src/session.ts:1825-1834](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/session.ts#L1825-L1834)

压缩重置清理preflight机会。

<details>
<summary>查看原文（10行）</summary>

```text
    // #1110: the conversation was rebuilt — a pre-compaction overflow arm no
    // longer bounds this session; drop it so the guard falls back to the
    // declared window instead of clamping to a stale ceiling.
    delete session.stats.overflowArmTokens;
    // One-shot fold gate: the rebuilt conversation is a fresh lifecycle —
    // it gets its own first preflight attempt (matches the reset semantics
    // of the arm and baseline it rides alongside).
    delete session.stats.preflightRuns;
    // #3450: same boundary — the proven completion reservation described the
    // pre-compaction payload lineage, and the rebuilt conversation re-arms the
```

</details>

#### 缺口

- 没有同客户端超时预算下的重试、费用和最终任务结果
  **影响**：只能说明阻止特定重复路径，不能证明吞吐或净成本改善
  **进一步探讨**：固定长历史、客户端断连时点和上游响应，对照重复摘要次数、成功转发、合格验收及总token/人工时间

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 人类状态页能解释哪些不可压缩和覆盖信息？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

/acp与结构化Context视图在同一messages和有效config上做额外uncoveredAudit，将protected mass解释加入面板；异常只省略诊断行。这是按人类查询触发的辅助解释，不更改压缩结论，不是执行过的任务质量检查。状态面板同时含系统工具开销与使用量/估计来源，应将“为什么当前没有可压范围”与“已经节省多少真实费用”分开理解。

compactionCoverageText聚合本进程加载时重写与runtime register包装/重写记录，主入口首个已路由请求输出一次覆盖行，让profileContext不可读时仍有观察出口。当前零重写可能是preset尚未解析，runtimeWrapped缺失也只能视为未知；日志可辅助发现压缩冲突，不能证明所有会话都免于宿主压缩。工程上值得借鉴的是以同一快照与同一配置产生机器/人类说明，迁移仍要承担一次额外审计及宿主钩子耦合。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:2142-2173](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/plugin.ts#L2142-L2173)

protectedMass诊断与Context共享输入。

<details>
<summary>查看原文（32行）</summary>

```text
    // #7463: protected-mass attribution on the HUMAN-only /acp panel + the
    // structured context view (dsh Context tab). acp_status keeps the same
    // ledger opt-in (protectedMass param); this panel is on-demand, so the
    // one extra relaxed offer pass is paid only when a human asks for /acp.
    // Advisory: any failure just omits the line.
    let protectedMass: ProtectedMassLedger | undefined;
    let protectedMassLine: string | undefined;
    if (messages.length > 0) {
        try {
            const audit = uncoveredAudit({
                core: deps.core,
                messages,
                state: session.state,
                config: ccrLoopConfig(session, pluginCfg),
                tokenCount: statusInputBaseline(session),
                contentStore: contentStoreOf(session),
                applyView: mem && mem.original.length > 0 ? mem.original : undefined,
                normalRanges: nudge?.compressibleRanges,
            });
            const pmLine = formatProtectedMass(audit.mass);
            if (pmLine !== null) {
                protectedMass = audit.mass;
                protectedMassLine = pmLine;
            }
        } catch {}
    }
    // #532/#3862: host-measured system+tools overhead (prepare-time, same
    // source as estimateInputTokens) — shared by the panel text below AND the
    // structured context view, so both surfaces classify identically.
    const sysTokRaw = session.metadata.systemPromptTokens;
    const systemPromptTokens = typeof sysTokRaw === "number" && Number.isFinite(sysTokRaw) && sysTokRaw > 0 ? sysTokRaw : 0;
    const contextView = buildContextView({ nudge, systemPromptTokens, limit: modelContextLimit, session, protectedMass });
```

</details>

**依据 2 · 源码核查**：[src/agent/dsh-native.ts:1346-1361](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/agent/dsh-native.ts#L1346-L1361)

首条路由请求只输出一次覆盖记录。

<details>
<summary>查看原文（16行）</summary>

```text
    // not (agentless compaction/title lanes, disposed scopes, retried
    // re-sends whose initiator scope went away between attempts).
    // #6770: first routed request is the earliest point where the overlay's
    // structural rewrites can have happened (preset configs resolve lazily),
    // so the coverage reading goes out here — the durable profile note that
    // used to carry it never fires when profileContext.startedBundles cannot
    // be read, which is the observed state on every host we checked.
    if (!compactionCoverageNoted) {
        compactionCoverageNoted = true;
        persistClientEvent(`bili-native-dsh: compaction overlay coverage — ${compactionCoverageText()} (#6770)`);
    }
    const scoped = dispatchScope.getStore();
    if (scoped !== undefined && scoped.sid.length > 0) {
        if (!noticedScopedAttribution) {
            noticedScopedAttribution = true;
            persistClientEvent("bili-native-dsh: llm/stream attribution active — session id rides the request object (#4082)");
```

</details>

**依据 3 · 源码核查**：[src/agent/dsh-compaction-disable.ts:176-197](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/agent/dsh-compaction-disable.ts#L176-L197)

加载和运行时覆盖的诚实零/未知表达。

<details>
<summary>查看原文（22行）</summary>

```text
/** #6770: one-line coverage summary shared by the durable profile notes (#3962)
 *  and bili-native's first-request log line. Pure over the record; "no entry
 *  rewritten" is the honest frame because preset configs resolve lazily. */
export function compactionCoverageText(telemetry: DshCompactionGateTelemetry | null = dshCompactionGateTelemetry()): string {
    let base: string;
    if (telemetry === null || telemetry.covered.length === 0) {
        base = "no preset entry rewritten in this process (preset configs resolve lazily — zero at this point does not mean zero later)";
    } else {
        const entries = telemetry.covered.map((c) => `${c.entry}\u00d7${c.rows}`).join(", ");
        base = `${telemetry.covered.length} preset ${telemetry.covered.length === 1 ? "entry" : "entries"} rewritten (${entries})`;
    }
    // #7190: the runtime dimension is stated only once the wrap is known to be
    // installed — an absent runtimeWrapped key (older gate, or a host without
    // the registry) means "unknown", never "gap".
    if (telemetry?.runtimeWrapped) {
        const runtime = telemetry.runtime ?? [];
        const fragment = runtime.length === 0
            ? "register() covered — no runtime preset registrations so far"
            : `${runtime.length} runtime preset ${runtime.length === 1 ? "registration" : "registrations"} rewritten (${runtime.map((r) => `${r.entry}\u00d7${r.rows}`).join(", ")})`;
        base = `${base}; ${fragment}`;
    }
    return base;
```

</details>

#### 缺口

- 没有人类据诊断纠正压缩配置的实际任务记录
  **影响**：可确认可观察性入口，不能量化减少排障或额外审计成本
  **进一步探讨**：在已知未覆盖preset/大量保护内容案例中检查说明是否准确定位原因，并记录人工诊断时间与误判

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 如何评估采用与原文来源标签假设？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

当前建议观察，面向能维护隔离DSH profile与代理、又确有长任务原文回查需求的开发者。先固定宿主/包/模型和两条原约束，对照原生压缩加人工交接文件；两边都须通过同一任务验收，并核对回读字节、会话归属和退出后的原生压缩。无归属、跨会话、原文不符、预设停滞或总投入增加时停止，保留原始任务记录，移除bundle并重启恢复基线。仅看/acp或估计token不足以继续采用。

首次成本包括构建成品、代理端口/可写目录、宿主内部耦合和配置核对；持续成本包括模型摘要、代理存储、请求转发、回读与人工复核；失败恢复包括断连重试、原文不可达及恢复原profile。现金、CPU、存储和人分钟无当前测量，不引用别的版本Pi基准填值。

未验证假设仍是给每次回读明确来源与覆盖，例如缓存全文、当前历史部分或摘要回落。由Q04统一标题易混淆推导，较增加压缩比更直接约束逐字引用。三组固定历史盲测只改变来源标签，比较原文精确匹配、把摘要误作原文的断言、回读次数和总合格任务成本；若误引不降或总成本明显上升则否定。它不修复已丢失原件，也不算插件已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/decompress-shared.ts:220-247](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/decompress-shared.ts#L220-L247)

来源回落与统一标题是假设基础。

<details>
<summary>查看原文（28行）</summary>

```text
    const full = args.full === true || args.full === "true";
    const cached = ctx.session.blockContents.get(blockId);
    let body: string;
    let count: number;
    if (cached) {
        // Honor the full flag: `one` = direct msgs + nested child summaries,
        // `full` = all original messages. Returning the cached full text
        // unconditionally would break the default one-level semantics.
        // `one === null` means the two views were byte-identical at cache
        // time and deduped to one copy (#401).
        const view = full ? cached.full : (cached.one ?? cached.full);
        body = view.text;
        count = view.count;
    } else {
        const collected = collectBlockContent(ctx.session.state, block, ctx.compressMessages ?? ctx.messages, { full });
        body = collected.text || block.summary;
        count = collected.count;
    }
    // #1336: retrieve-quality proxy — a whole-block restore where a precise
    // path existed (per-message coverage recorded AND CCR armed ⇒ range-restore
    // or targeted acp_retrieve would have sufficed) is the failure shape plan-
    // aware search steering exists to prevent.
    ctx.session.stats.wholeBlockRestores = (ctx.session.stats.wholeBlockRestores ?? 0) + 1;
    if (coveredRefSpan(ctx.session.state, block) !== null && ccrEnabled(ctx.session)) {
        ctx.session.stats.wholeBlockRestoresPreciseAvailable = (ctx.session.stats.wholeBlockRestoresPreciseAvailable ?? 0) + 1;
    }

    const header = `[Block ${blockId} content — ${count} item(s)${full ? ", full" : ""}]`;
```

</details>

**依据 2 · 源码核查**：[src/agent/dsh-compaction-disable.ts:80-103](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/agent/dsh-compaction-disable.ts#L80-L103)

退出须考虑进程全局接管。

<details>
<summary>查看原文（24行）</summary>

```text
// #3662: process-level verdict between the two entries. They are SEPARATE
// bundles in the dsh host (separate module instances — module state cannot
// cross them), and globalThis is the only surface both share. bili-native's
// apply() declares active once its plan says bili owns the lane; an ABSENT
// declaration means bili-native never ran in this process (entry disabled,
// kill-switched before the declaration, or its module failed to load) and the
// transform leaves every row stock. Availability over fail-safe-brick: a dead
// bili-native hands the lane back to stock dsh compaction, with the wire-level
// refusal guard (#1729) as backstop.
const DSH_COMPACTION_VERDICT_KEY = "__BILI_DSH_COMPACTION_VERDICT__";

/** bili-native calls this from apply() when its plan keeps the lane owned. */
export function declareDshCompactionActive(): void {
    (globalThis as Record<string, unknown>)[DSH_COMPACTION_VERDICT_KEY] = "active";
}

export function isDshCompactionActive(): boolean {
    return (globalThis as Record<string, unknown>)[DSH_COMPACTION_VERDICT_KEY] === "active";
}

/** Test hook: forget any declaration (back to "bili-native never ran"). */
export function _resetDshCompactionVerdictForTest(): void {
    delete (globalThis as Record<string, unknown>)[DSH_COMPACTION_VERDICT_KEY];
}
```

</details>

**依据 3 · 源码核查**：[src/server.ts:4178-4186](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/src/server.ts#L4178-L4186)

重试后的转发不保证任务成功。

```text
    const epochReplaced = epochConfirmPending(session);
    const compressionCommitted = !epochReplaced && (session.state.stats?.compressionCount ?? 0) > 0;
    const preflightSpent = (session.stats.preflightRuns ?? 0) > 0;
    if (compressionCommitted || preflightSpent) {
        if (!preflightGateBlockedLogged.has(session.id)) {
            preflightGateBlockedLogged.add(session.id);
            log("warn", `[${session.id}] preflight trigger fired but the session's one-shot fold is already spent (${compressionCommitted ? `session compression-managed (${session.state.stats?.compressionCount} committed fold(s))` : "an earlier fold attempt was aborted by a client disconnect"}) — forwarding as-is; overflow recovery stays with #1195 in-request refold and the egress fuse`);
        }
        return prepared;
```

**依据 4 · 源码核查**：[package.json:2-4](https://github.com/ranxianglei/billion-context/blob/08783eed1c0f242dc646f656cb5cccf5c91f1a34/package.json#L2-L4)

当前版本与作者基准版本不能混同。

```text
  "name": "billion-context",
  "version": "0.1.216",
  "description": "A context-compression plugin \u2014 small context windows (a 100K context is enough), 5x fewer tokens, month-long single sessions (billions of tokens), and compression quality \u2014 for all agents: pi, OpenCode, Codex, Claude Code, and more. billion-context is all you need.",
```

#### 缺口

- 缺当前DSH端到端质量、总费用和退出验收
  **影响**：不能形成持续安装或通用节费推荐
  **进一步探讨**：用同宿主/模型/任务做完整对照，计入重试、回读与恢复后决定是否继续

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
