# 无限五代 IG5

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[8738b0e](https://github.com/Minglink/dsh-infinite-gen-5/tree/8738b0e6a125046d1b8388aa901bbc0a2680afcd)

<!-- BEGIN META -->
[![GitHub ★ 3,759](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C759&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Minglink/dsh-infinite-gen-5)
<!-- END META -->

> **功能**：在 DSH 工作台中集成二进制静态分析、调试、流量与证据管理。

> **亮点**：[Q02](#research-q02) 将会话、目标证据和审批接入宿主工作流；原生反编译、仿真和调试仍依赖各引擎。

> **主要限制**：[Q03](#research-q03) 事后审计写入可能失败而操作仍保留，审批和有限 Undo 不保证隔离或完全撤销；[Q04](#research-q04) 非审批静态入口也可能写文件。

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
  - [Q01 · 面向谁，和独立逆向工具相比改变什么？](#detail-section-11)
  - [Q02 · 宿主工具调用如何连接会话与证据？](#detail-section-12)
  - [Q03 · 审批和 Undo 能否保证操作安全且完全可撤销？](#detail-section-13)
  - [Q04 · 静态入口是否等同不写文件或没有后端？](#detail-section-14)
  - [Q05 · 安装和使用有什么约束及退出策略？](#detail-section-15)
  - [Q06 · 能否降低执行后审计缺口？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向分析自有或获授权二进制、需要跨工具整理证据的逆向工程人员。

可独立使用 Ghidra、调试器与流量工具并人工汇总；本项目整合工作台与证据上下文，不继承底层工具的原创性或正确性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 静态分析 | 调查函数、代码与数据 | 依赖后端，推断不等于运行事实 |
| 调试与仿真 | 对授权目标做受控观察 | 明确审批，环境不完整 |
| 证据与会话 | 标识目标和分析结果 | 证据归属不保证结论正确 |
| 修改和控制 | 按请求实施操作 | 审计可能失败，Undo 范围有限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与插件 | 必需 | 工具、投影、宿主调用 | 无法使用宿主入口 |
| 对应引擎和运行资产 | 对应后端必需 | 静态分析与调试 | 该功能不可用 |
| 宿主审批 | 列出的修改/执行入口必需 | 用户批准 | 未批准拒绝派发 |
| 授权样本和隔离环境 | 调查必需 | 安全分析 | 停止相关操作 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对授权和运行资产 | 配置隔离环境 |
| 静态调查 | Agent 打开样本并检查证据 | 标注后端、目标和覆盖范围 |
| 修改或调试 | 用户审阅具体授权请求 | 不批准则不派发 |
| 验收 | 分析人员核对独立证据和审计 | 不明状态停止并人工确认 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | 后端、下载和磁盘 | 配置、校验版本与资产 | 兼容性未测 |
| 持续 | 模型、引擎和数据库 | 专业分析与证据复核 | 净收益未知 |
| 失败 | 进程和审计资源 | 核对外部副作用 | 记录可能缺失 |
| 退出 | 保留报告与数据库 | 切换独立工具 | Undo 非通用撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话归属 | 调用可关联目标证据 | 结论正确性 |
| 审批 | 指定入口缺审批拒绝 | 沙箱与完全回滚 |
| 工具整合 | 注册多个工具 | 整体提效或恢复质量 |

> **思考**：[Q03](#research-q03) 事后审计写入可能失败而操作仍保留，审批和有限 Undo 不保证隔离或完全撤销；[Q04](#research-q04) 非审批静态入口也可能写文件。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将会话、目标证据和审批接入宿主工作流；原生反编译、仿真和调试仍依赖各引擎。

[Q02](#research-q02) 代表性调用绑定会话并检查修订；[Q03](#research-q03) 将审批和事后审计分层，但写日志失败不撤销操作。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 事后审计写入可能失败而操作仍保留，审批和有限 Undo 不保证隔离或完全撤销；[Q04](#research-q04) 非审批静态入口也可能写文件。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 用隔离 profile 和授权副本先验证代表性路径，不明副作用时暂停并人工核查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

仅静态核查固定源码的代表性注册、会话和审批路径；未安装运行目标、引擎或宿主。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、index.js、source/approval_gate.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态核查根入口、decompile 代表路径与审批门，未穷举所有 43 入口及其后端，也未运行目标或调试器；inventory 的 JS/TS 统计不代表 Python 引擎全量代码。
- 下一步：使用授权可丢弃样本，在隔离 profile 对照后端输出，分别注入拒绝审批、日志失败和会话修订变化。

**分析版本**

- **仓库**：[Minglink/dsh-infinite-gen-5](https://github.com/Minglink/dsh-infinite-gen-5)
- **版本号**：1.3.0（[固定提交 8738b0e](https://github.com/Minglink/dsh-infinite-gen-5/tree/8738b0e6a125046d1b8388aa901bbc0a2680afcd)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出操作前预留持久请求记录，故障时保留未知状态并人工对照；不可假定跨外部动作原子性，收益需故障注入验证。

使用授权可丢弃样本，在隔离 profile 对照后端输出，分别注入拒绝审批、日志失败和会话修订变化。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 131 | 7377 | — | — | 253367 |
| .js | source | 174 | 25996 | 24589 | 775 | — |
| .mjs | source | 290 | 31743 | 30154 | 742 | — |
| .mjs | example | 31 | 1409 | 1274 | 104 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/Minglink/dsh-infinite-gen-5/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查逆向工作台代表路径、审批与审计边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，和独立逆向工具相比改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

IG5 面向在 DSH 中调查自有或获授权二进制的分析人员，目标把静态函数检视、调试、流量和证据组织在同一工作台。原办法是独立使用 Ghidra、调试器、流量工具并手工汇总；IG5 的主要贡献是宿主工具、目标会话、报告和工作流的集成，不应把底层引擎的反编译和仿真能力计为其原创。样本身份证据和数据库修订有助于定位上下文，但不证明推断正确或完成整个业务恢复；一次字符串检索通常不足以承担全部集成成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-24](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/README.md#L15-L24)

项目身份、主要功能和授权范围。

<details>
<summary>查看原文（10行）</summary>

```text
**无限五代（dsh-infinite-gen-5 / IG5）** 是面向 DeepSeek Harness（DSH）的逆向分析插件与可视化工作台，将静态分析、原生调试、流量采集、数据分析和智能体协作接入同一套工作流。

默认 **Core 8** 提供日常分析入口，按需展开 **Full 43**；13 个修改或执行入口经过宿主审批。分析围绕样本身份、数据库修订和证据报告展开，不把模型推测当作已验证结论。

[下载完整安装包](https://github.com/Minglink/dsh-infinite-gen-5/releases/tag/v1.3.0) · [快速安装](#local-install) · [常用指令](#commands) · [使用文档](#documentation) · [版本更新](#updates) · [交流社区](#community)




> 仅限自有或合法授权目标的逆向工程、安全审计与教学研究。项目独立维护，与 DeepSeek 官方无隶属或官方背书关系；自有代码及文档的非商用要求见文末许可声明。
```

</details>

**依据 2 · 作者声明**：[README.md:29-37](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/README.md#L29-L37)

作者列出引擎、调试、代理和恢复边界。

```text
| 方向 | 主要能力 | 使用边界 |
| :--- | :--- | :--- |
| 静态分析 | 函数、字符串、交叉引用、反编译、CFG、类型、结构体、虚表与跳转表检视 | 支持情况依赖具体后端；部分分析与未决结果保留标记 |
| 可视化工作台 | SVG CFG 平移/缩放、双击查看汇编、局部变量焦点高亮、结构体草稿与审计时间线 | 焦点行过滤不等于完整污点分析；编辑草稿仍需发送并审批 |
| 调试与仿真 | x64dbg 原生调试、断点、寄存器/内存、受限轨迹；Unicorn 单函数仿真 | 执行需要授权和审批；仿真不提供完整 OS、import 或 TLS 环境 |
| HTTP/HTTPS 采集 | 本机代理、显式 TLS 解密、流量历史、证据导出、请求重放与下发载荷提取 | 仅批准 origin；不自动修改系统代理或证书信任，不等同完整 Burp 功能 |
| 解密与协议 | 编码/压缩检查、XOR/AES、有界候选检索、PCAP/PCAPNG 解析、分帧与观察状态模型 | 不保证未知密钥恢复或隐藏服务器语义；缺口、冲突与外推假设保留 |
| IR 与去混淆研究 | 真实 p-code/SSA、单函数只读去混淆覆盖层、路径投影、状态组合与离线轨迹恢复 | 局部模型或数学证明不等于通用去壳、完整 VM 或业务恢复 |
| 调查与子代理协作 | 单函数 dossier、持久调查任务、受控 handoff、证据回交与根会话共享调用预算 | DSH 负责派工；插件核验身份/证据/生命周期，不认证模型理解或结论正确性 |
```

**依据 3 · 源码核查**：[package.json:1-10](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/package.json#L1-L10)

包与入口。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "dsh-infinite-gen-5",
  "version": "1.3.0",
  "description": "无限五代（IG5）：DeepSeek Harness 统一 Reverse / Ghidra 静态分析与 x64dbg 无头调试工作台。独立 HTTP/HTTPS 流量采集与分析。",
  "type": "module",
  "main": "./index.js",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
```

</details>

#### 缺口

- 未比较同任务的独立工具和集成流程
  **影响**：不能证明准确率或完成时间改善
  **进一步探讨**：在同一授权样本对比人工工具链与 IG5 的可复核发现、耗时和错误。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主工具调用如何连接会话与证据？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

package.json 指定 index.js、bundle patch 和 web client，patch 插入插件；apply 创建 WorkerManager、安装审批门并构造工具，之后可注册会话投影。调用包装把 engine、执行 agent 身份及 signal 带入 scope；选择目标会话并在执行前检查排队期间附件是否变化、可选 expected_revision 是否一致，结果可附带该会话证据。以 decompile 为例，execute 要求 target 并通过 manager 查询会话，真正分析依赖对应后端。静态检查证实这一代表路径，不代表每种引擎、所有工具或实际宿主均已运行。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-10](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/package.json#L1-L10)

宿主入口及 client 导出。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "dsh-infinite-gen-5",
  "version": "1.3.0",
  "description": "无限五代（IG5）：DeepSeek Harness 统一 Reverse / Ghidra 静态分析与 x64dbg 无头调试工作台。独立 HTTP/HTTPS 流量采集与分析。",
  "type": "module",
  "main": "./index.js",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[package.json:196-211](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/package.json#L196-L211)

DSH bundle、client 与宿主版本声明。

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "id": "dsh-infinite-gen-5",
    "name": "无限五代",
    "version": "1.3.0",
    "repo": "Minglink/dsh-infinite-gen-5",
    "permissions": "子进程(python worker)、文件写(artifacts)、会话投影、客户端侧栏 tab、显式范围的本地代理与网络请求（审批）",
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true
    }
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.0-rc.1 <0.3.0-0"
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-8](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/cordis.patch.yml#L1-L8)

安装时插入宿主插件。

```text
# Bundle patch layer: the row loads the package's main entry as the host half
# (a plain Cordis plugin: ig5 tools + ig5dash projection); the `dsh.client`
# declaration makes the web app load its ./client bundle as the browser half
# (badge + IG5 逆向工作台 right-sidebar tab). No system-prompt overlay: IG5
# injects nothing into the harness persona.
- insert:
    - id: dsh-infinite-gen-5
      name: dsh-infinite-gen-5
```

**依据 4 · 源码核查**：[index.js:1217-1239](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/index.js#L1217-L1239)

apply 创建管理器、安装审批门与工具。

<details>
<summary>查看原文（23行）</summary>

```text
export const name = PLUGIN_ID;
export const inject = ['tools', 'sessionProjections'];

export function apply(ctx, config = {}) {
  const cfg = resolveConfig(config);
  diagAppend(cfg, `host: implementation=${IMPLEMENTATION_REVISION} module=${fileURLToPath(import.meta.url)}`);
  const mgr = new WorkerManager(cfg);
  // AnalysisArtifacts is installed by defineAnalysisTools later in registration.
  let failureRecords, capabilityAcceptance;
  Object.defineProperties(mgr, {
    failures: { get: () => failureRecords ||= new FailureRecords({ root: cfg.projectRoot, artifacts: mgr.analysis.artifacts }) },
    capabilityAcceptance: { get: () => capabilityAcceptance ||= new CapabilityAcceptance({ root: cfg.projectRoot, artifacts: mgr.analysis.artifacts, cfg }) },
  });
  mgr.coordination = installDelegationControl(ctx, cfg);
  mgr.memory = installLcmBridge(ctx, cfg);
  ctx.effect(() => () => mgr.memory.dispose());
  installDiagRoute(ctx, cfg);
  installJobsRoute(ctx, mgr, cfg);
  installDataRoute(ctx, mgr, cfg);
  installApprovalGate(ctx, cfg);

  ctx.effect(() => {
    const definitions = defineIg5Tools(ctx, mgr, cfg).map((definition) => {
```

</details>

**依据 5 · 源码核查**：[index.js:1264-1278](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/index.js#L1264-L1278)

预期修订与 agent/signal 作用域。

<details>
<summary>查看原文（15行）</summary>

```text
      if (!isCapture && IG5_WRITE_TOOLS.has(definition.name) && definition.name !== 'ig5_sync') definition.parameters.properties.expected_revision = {
        type: 'number', description: 'Reject this operation if the selected database revision has changed since planning' };
      definition.execute = (args = {}, execution) => mgr.scope.run({ engine: args.engine || (definition.name === 'ig5_ir' && cfg.reverseProvider !== 'bundled' ? 'ghidra' : cfg.defaultEngine), agentId: execution?.agent?.id || execution?.agent?.sessionId, signal: execution?.signal }, async () => {
        try {
        if (execution?.signal?.aborted) throw new Error('IG5 operation cancelled');
        if (definition.name === 'ig5_doctor' && args.operation === 'session')
          return jsonToolOutput(mgr.coordination.diagnose(execution?.agent, args));
        mgr.coordination.charge(execution?.agent, definition.name, args);
        await mgr.memory.activate(execution?.agent);
        if (args.engine) engineId(args.engine);
        const selected = !args.target && !isGlobal && !['ig5_open', 'ig5_doctor', 'ig5_bindiff', 'ig5_sync'].includes(definition.name)
          && !definition.parameters.required?.includes('target') ? mgr.selectedTarget() : args.target;
        if (selected) args = { ...args, target: selected };
        const standaloneKernel = definition.name === 'ig5_ir' && ['kernel', 'trace', 'lift', 'project'].includes(args.level);
        const session = selected && !isData && !standaloneKernel ? mgr.get(selected) : null;
```

</details>

**依据 6 · 源码核查**：[index.js:1285-1297](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/index.js#L1285-L1297)

陈旧会话和修订检查。

<details>
<summary>查看原文（13行）</summary>

```text
        // A failed predecessor can recycle its worker while this operation is
        // queued. execute() resolves target again; never let old planning and
        // expected_revision checks transfer to a newly opened attachment.
        if (session && (mgr.get(session.target, session.engine) !== session
          || selectedAttachment !== undefined && session.attachmentId !== selectedAttachment)) {
          throw Object.assign(new Error('Target session changed while this operation was queued; reopen its context and review the operation again'), { code: 'STALE_SESSION_CONTEXT' });
        }
        mgr.checkCancelled();
        if (session?.closing) throw new Error('Target is closing; wait for it to finish');
        if (args.expected_revision !== undefined && (!session || session.dbRevision !== args.expected_revision)) {
          throw new Error('Database revision changed; read current evidence and review the operation again');
        }
        let result = await execute(args, execution);
```

</details>

**依据 7 · 源码核查**：[index.js:1312-1318](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/index.js#L1312-L1318)

结果附证据及会话序列化。

```text
        return jsonToolOutput(result && typeof result === 'object' && !Array.isArray(result) && session && !isGlobal
          ? { ...result, _ig5: result._ig5 || mgr.evidence(session) } : result);
        };
        const batchControl = definition.name === 'ig5_decompile' && args.operation === 'batch' && ['cancel','status'].includes(args.batch?.action);
        const queuedRead = definition.name === 'ig5_decompile' && !batchControl || definition.name === 'ig5_workspace' || definition.name === 'ig5_profile' && args.address !== undefined;
        if (!session || !(IG5_WRITE_TOOLS.has(definition.name) || definition.name === 'ig5_export_diff' || queuedRead) || ['ig5_sync', 'ig5_dbg'].includes(definition.name)) return await perform();
        return await mgr.withSessions([session], perform);
```

**依据 8 · 源码核查**：[index.js:561-588](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/index.js#L561-L588)

decompile 的 target 和会话接线。

<details>
<summary>查看原文（28行）</summary>

```text
      name: 'ig5_decompile',
      description:
        'Decompile one function by EA or exact name. style=dossier aggregates pseudocode, CFG, callers, callees and stack under one database revision, with explicit section status, response limits and provenance. Optional task_id records a system observation in an existing investigation task. style=llm returns provider-specific supporting metadata when available. Plain results over ~12KB spill to an artifact file with a preview. Read-only; does not execute the sample or verify hypotheses.',
      parameters: {
        type: 'object',
        properties: {
          target: { type: 'string', description: 'Target path previously opened with ig5_open' },
          ea: { type: 'string', description: 'Function address, hex string like 0x140001070' },
          name: { type: 'string', description: 'Exact function name (used when ea is absent)' },
          style: { type: 'string', enum: ['', 'llm', 'dossier'], description: 'Omit for plain pseudocode; llm metadata depends on the provider; dossier aggregates real function context' },
          operation: { type: 'string', enum: ['collect', 'read', 'batch'], description: 'Default collect. read retrieves a committed section. batch creates/runs/status/cancels a durable explicit function list, up to 8 sequential items per run with normal per-item charging.' },
          batch: { type: 'object', properties: { action: { type: 'string', enum: ['create','status','run','cancel'] }, id: { type: 'string' }, functions: { type: 'array', minItems: 1, maxItems: 72, items: { type: 'string' } }, max_items: { type: 'integer', minimum: 1, maximum: 8 } }, required: ['action'], additionalProperties: false },
          result_ref: { type: 'object', properties: { id: { type: 'string' }, sha256: { type: 'string' }, expiresAt: { type: 'string' } }, required: ['id', 'sha256'], additionalProperties: false },
          section: { type: 'string', enum: ['decompile', 'cfg', 'callers', 'callees', 'stack'] },
          format: { type: 'string', enum: ['text', 'records', 'json-text'], description: 'Default code text for decompile, stable records for other sections. json-text retrieves all saved section fields including oversized records.' },
          cursor: { type: 'string', description: 'Authenticated continuation returned by a previous page of this result/section/format.' },
          page_max_bytes: { type: 'integer', minimum: 4000, maximum: 64000, description: 'Whole serialized page UTF-8 bytes including provenance and cursor; default 8000.' },
          dossier_max_bytes: { type: 'number', description: 'Dossier body UTF-8 response budget, 4000..64000 bytes, default 16000; not a total backend computation budget' },
          dossier_max_rows: { type: 'number', description: 'Dossier per-array row cap, 1..128, default 32' },
          refresh: { type: 'boolean', description: 'Dossier only: bypass response cache for this normally charged collection; does not force whole-program reanalysis.' },
          task_id: { type: 'string', description: 'Existing workspace task UUID; requires style=dossier and records only system-produced observations' },
        },
        required: ['target'],
      },
      output: { schema: { type: 'object', additionalProperties: true }, render: textRender },
      async execute(args, execution) {
        const target = requireString(args, 'target');
        const session = mgr.get(target);
```

</details>

**依据 9 · 源码核查**：[index.js:1351-1354](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/index.js#L1351-L1354)

有 projection 服务时注册仪表投影。

```text
  const projections = ctx.get('sessionProjections');
  if (projections !== undefined && typeof projections.register === 'function') {
    ctx.effect(() => projections.register(ig5DashDefinition(), `${PLUGIN_ID}: ig5dash projection`));
  }
```

#### 缺口

- 未启动 DSH、后端或执行任何目标
  **影响**：不能证明引擎分析准确、兼容或仪表行为
  **进一步探讨**：使用获授权且可丢弃样本在隔离 profile 比对独立工具输出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 审批和 Undo 能否保证操作安全且完全可撤销？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

审批门只对 IG5_WRITE_TOOLS 中列出的 13 个入口执行：展示待执行参数摘要及哈希，过长无法完整展示则拒绝；没有活跃 agent 或审批服务、审批报错、拒绝或取消均不派发。捕获控制的请求内容有意脱敏，所以不能称所有审批载荷均原样展示。post-execute 再向 approvals.jsonl 追加记录，写失败不会撤销已完成操作，仅尝试写诊断，而诊断也 best effort。Undo 的描述只覆盖列出的工作进程内操作日志，不能推断网络、原生执行或任意外部副作用可恢复。审批控制授权入口而非运行沙箱。

#### 证据与依据

**依据 1 · 源码核查**：[source/approval_gate.js:7-17](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/source/approval_gate.js#L7-L17)

写工具集合及展示上限。

<details>
<summary>查看原文（11行）</summary>

```text
export const IG5_WRITE_TOOLS = new Set([
  'ig5_rename', 'ig5_patch_bytes', 'ig5_comment', 'ig5_analyze', 'ig5_set_type',
  'ig5_undo', 'ig5_run_idapython', 'ig5_dbg', 'ig5_struct',
  'ig5_switch_repair', 'ig5_emulate',
  'ig5_sync',
  'ig5_capture_control',
]);

// 审批人必须能看到全部载荷。展示内容不截断；超过此上限的操作直接拒绝（失败即关闭），要求拆分后重试。
// ig5_run_idapython 的 code 最长 64 KiB，上限留有余量。
export const APPROVAL_DISPLAY_LIMIT = 131072;
```

</details>

**依据 2 · 源码核查**：[source/approval_gate.js:22-41](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/source/approval_gate.js#L22-L41)

捕获请求摘要脱敏并计算参数哈希。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * 审批人必须看到将要执行的真实载荷（脚本源码、补丁字节、命令参数），而不只是目标路径。
 * 不截断：complete=false 表示内容超过 APPROVAL_DISPLAY_LIMIT，调用方必须拒绝而不是只展示一部分。
 * ig5_capture_control 的请求体可能含凭据，只展示与审计一致的脱敏摘要。
 */
export function describeOperation(name, args) {
  const shown = name === 'ig5_capture_control'
    ? { action: args?.action, id: args?.id, session_id: args?.session_id, scope: args?.scope, port: args?.port, tls: args?.tls,
      ...(args?.request ? { request: { redacted: true, method: args.request.method,
        headerNames: Object.keys(args.request.headers || {}), bodyProvided: args.request.body !== undefined } } : {}) }
    : (args ?? {});
  const sha256 = createHash('sha256').update(canonical(args ?? {})).digest('hex');
  const blocks = [];
  for (const [key, value] of Object.entries(shown)) {
    if (value === undefined) continue;
    if (typeof value === 'string' && (value.length > 80 || value.includes('\n'))) blocks.push(`${key}（${value.length} 字符）:\n${value}`);
    else blocks.push(`${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`);
  }
  const detail = blocks.join('\n');
  return { detail, sha256, complete: detail.length <= APPROVAL_DISPLAY_LIMIT };
```

</details>

**依据 3 · 源码核查**：[source/approval_gate.js:44-52](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/source/approval_gate.js#L44-L52)

超出展示上限拒绝派发。

```text
export function installApprovalGate(ctx, cfg) {
  ctx.on('tools/pre-execute', async (exec, next) => {
    if (!IG5_WRITE_TOOLS.has(exec?.name)) return next();
    const args = exec?.arguments ?? {};
    const destination = args.guest_profile !== undefined ? ` guest=${args.guest_profile} binding=${args.guest_binding_sha256 || '[missing]'}` : '';
    const what = (args?.plan_id ?? args?.ea ?? args?.name ?? args?.target ?? '') + destination;
    const { detail, sha256, complete } = describeOperation(exec.name, args);
    if (!complete)
      return { kind: 'deny', reason: `IG5 ${exec.name} payload exceeds the ${APPROVAL_DISPLAY_LIMIT}-character approval display limit and cannot be reviewed in full; split the operation. Nothing was dispatched.` };
```

**依据 4 · 源码核查**：[source/approval_gate.js:60-79](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/source/approval_gate.js#L60-L79)

审批服务缺失、异常、取消和拒绝的处理。

<details>
<summary>查看原文（20行）</summary>

```text
    };
    // Resolve the public approval seam here. Some host builds turn a rejected
    // `ask` into an allow; a plugin-owned deny must remain a deny.
    if (exec?.signal?.aborted) return { kind: 'cancel' };
    let approval;
    try { approval = ctx.get('approval'); } catch { /* uncomposed host */ }
    if (!exec?.agent || typeof approval?.request !== 'function')
      return { kind: 'deny', reason: `IG5 ${exec.name} requires an active agent and an available approval service.` };
    let outcome;
    try {
      outcome = await approval.request({ agent: exec.agent, toolName: exec.name,
        callId: exec.callId, ...request, signal: exec.signal });
    } catch {
      if (exec?.signal?.aborted) return { kind: 'cancel' };
      return { kind: 'deny', reason: `IG5 ${exec.name} approval could not be confirmed; operation was not dispatched.` };
    }
    if (exec?.signal?.aborted || outcome === 'cancelled') return { kind: 'cancel' };
    if (outcome !== 'allowed-once')
      return { kind: 'deny', reason: `IG5 ${exec.name} approval was ${outcome === 'rejected' ? 'rejected' : 'unavailable'}; operation was not dispatched.` };
    return next();
```

</details>

**依据 5 · 源码核查**：[source/approval_gate.js:81-102](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/source/approval_gate.js#L81-L102)

执行后审计写失败和尽力诊断。

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.on('tools/post-execute', async (exec, result, next) => {
    if (!IG5_WRITE_TOOLS.has(exec?.name)) return next();
    try {
      fs.mkdirSync(cfg.artifactDir, { recursive: true });
      const rec = {
        ts: new Date().toISOString(),
        tool: exec.name,
        args: exec.name === 'ig5_capture_control' ? {
          action: exec.arguments?.action, id: exec.arguments?.id, session_id: exec.arguments?.session_id,
          scope: exec.arguments?.scope, port: exec.arguments?.port, tls: exec.arguments?.tls,
          ...(exec.arguments?.request ? { request: { redacted: true, method: exec.arguments.request.method,
            headerNames: Object.keys(exec.arguments.request.headers || {}), bodyProvided: exec.arguments.request.body !== undefined } } : {}),
        } : exec.arguments,
        isError: result?.isError === true,
        detail: result?.isError ? result?.error?.message : result?.value,
      };
      fs.appendFileSync(path.join(cfg.artifactDir, 'approvals.jsonl'), JSON.stringify(rec) + '\n', 'utf8');
    } catch (error) {
      // 审计失败不能破坏结果路径，但必须留下痕迹：该操作已执行而审计行没有落盘。
      try { diagAppend(cfg, `audit: 审计行写入失败，操作已执行但无记录 tool=${exec.name} callId=${exec.callId ?? ''} code=${error?.code ?? 'unknown'}`); } catch { /* diagnostics are best-effort */ }
    }
    return next();
```

</details>

**依据 6 · 源码核查**：[index.js:916-925](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/index.js#L916-L925)

Undo 只描述列出的工作进程日志操作。

<details>
<summary>查看原文（10行）</summary>

```text
    },
    {
      name: 'ig5_undo',
      description:
        'Roll back the most recent IG5 write operation via the in-worker operation journal (bytes/rename/comment/set_type/create_function/delete_function). action=list lists the journal without undoing. WRITE OPERATION: approval-gated.',
      parameters: {
        type: 'object',
        properties: {
          target: { type: 'string', description: 'Target path previously opened with ig5_open' },
          action: { type: 'string', description: '"list" to inspect the journal (default: undo one step)' },
```

</details>

#### 缺口

- 未对审计写失败和各后端副作用做运行验证
  **影响**：不能保证每次均有审计或任意动作可逆
  **进一步探讨**：在可丢弃环境注入只读/满盘故障并人工核对实际操作与记录。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 静态入口是否等同不写文件或没有后端？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

作者将 Full 43 分成 28 个非审批静态入口、13 个审批入口和 2 个生命周期/配置入口，但同一说明明确指出 workspace、recovery 和 package unpack 会写任务存储、报告或解包文件；统计是工具暴露面，不等于业务收益，也不等于所有工具的每个参数行为相同。另须区分独立的数据操作与需要运行分析引擎的工具：decompile 代码会取得已打开目标会话，不应把 README 对某类静态操作的描述扩写成所有静态分析无需后端。静态结果、截断或扫描候选不等于目标实际执行或完整行为。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:133-145](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/README.md#L133-L145)

Core/Full 及明确的非审批写文件例外。

<details>
<summary>查看原文（13行）</summary>

```text
斜杠命令直接走宿主命令入口，无需模型先生成工具调用。`state-validate` 默认验证保存的前缀树；验证合并假设需用 `ig5_protocol` 显式指定模型。

### Core 8 / Full 43

默认 Core 8：`ig5_doctor`、`ig5_open`、`ig5_status`、`ig5_funcs`、`ig5_strings`、`ig5_decompile`、`ig5_close`、`ig5_profile`。

Full 43 分为 **28 个非审批静态入口(含 `ig5_package`、`ig5_workspace`、`ig5_recovery`)+ 13 个审批入口 + 2 个生命周期/配置入口**。静态指不执行目标、不开引擎、不发网络,但不等于不写文件:`ig5_workspace` 会更新本会话任务存储并写不可变报告,`ig5_recovery` 会写不可变报告,`ig5_package unpack` 会写解包文件。支持 scoped API 的 DSH 只向当前 agent 展开 Full；旧宿主明确返回 `toolsetScope=plugin-instance`。切换不持久化，也不授予执行或写入权限。

<details>
<summary>展开完整工具清单</summary>

- **静态、无目标执行（28）**：`ig5_doctor`、`ig5_open`、`ig5_status`、`ig5_funcs`、`ig5_strings`、`ig5_decompile`、`ig5_xrefs`、`ig5_calls`、`ig5_bytes`、`ig5_search`、`ig5_listing`、`ig5_scan`、`ig5_export_diff`、`ig5_cfg`、`ig5_slice`、`ig5_fingerprint`、`ig5_stack`、`ig5_switches`、`ig5_vtables`、`ig5_microcode`、`ig5_bindiff`、`ig5_ir`、`ig5_crypto`、`ig5_protocol`、`ig5_capture`、`ig5_package`、`ig5_workspace`、`ig5_recovery`。其中 `ig5_open` 管理会话与驱动库，`ig5_workspace`/`ig5_recovery`/`ig5_package unpack` 会写任务存储或文件；它们都不执行样本、不开调试会话、不发网络请求。
- **审批入口（13）**：`ig5_rename`、`ig5_patch_bytes`、`ig5_comment`、`ig5_analyze`、`ig5_set_type`、`ig5_undo`、`ig5_run_idapython`、`ig5_dbg`、`ig5_struct`、`ig5_switch_repair`、`ig5_emulate`、`ig5_sync`、`ig5_capture_control`。
```

</details>

**依据 2 · 源码核查**：[index.js:561-588](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/index.js#L561-L588)

decompile 要求目标并从管理器取会话。

<details>
<summary>查看原文（28行）</summary>

```text
      name: 'ig5_decompile',
      description:
        'Decompile one function by EA or exact name. style=dossier aggregates pseudocode, CFG, callers, callees and stack under one database revision, with explicit section status, response limits and provenance. Optional task_id records a system observation in an existing investigation task. style=llm returns provider-specific supporting metadata when available. Plain results over ~12KB spill to an artifact file with a preview. Read-only; does not execute the sample or verify hypotheses.',
      parameters: {
        type: 'object',
        properties: {
          target: { type: 'string', description: 'Target path previously opened with ig5_open' },
          ea: { type: 'string', description: 'Function address, hex string like 0x140001070' },
          name: { type: 'string', description: 'Exact function name (used when ea is absent)' },
          style: { type: 'string', enum: ['', 'llm', 'dossier'], description: 'Omit for plain pseudocode; llm metadata depends on the provider; dossier aggregates real function context' },
          operation: { type: 'string', enum: ['collect', 'read', 'batch'], description: 'Default collect. read retrieves a committed section. batch creates/runs/status/cancels a durable explicit function list, up to 8 sequential items per run with normal per-item charging.' },
          batch: { type: 'object', properties: { action: { type: 'string', enum: ['create','status','run','cancel'] }, id: { type: 'string' }, functions: { type: 'array', minItems: 1, maxItems: 72, items: { type: 'string' } }, max_items: { type: 'integer', minimum: 1, maximum: 8 } }, required: ['action'], additionalProperties: false },
          result_ref: { type: 'object', properties: { id: { type: 'string' }, sha256: { type: 'string' }, expiresAt: { type: 'string' } }, required: ['id', 'sha256'], additionalProperties: false },
          section: { type: 'string', enum: ['decompile', 'cfg', 'callers', 'callees', 'stack'] },
          format: { type: 'string', enum: ['text', 'records', 'json-text'], description: 'Default code text for decompile, stable records for other sections. json-text retrieves all saved section fields including oversized records.' },
          cursor: { type: 'string', description: 'Authenticated continuation returned by a previous page of this result/section/format.' },
          page_max_bytes: { type: 'integer', minimum: 4000, maximum: 64000, description: 'Whole serialized page UTF-8 bytes including provenance and cursor; default 8000.' },
          dossier_max_bytes: { type: 'number', description: 'Dossier body UTF-8 response budget, 4000..64000 bytes, default 16000; not a total backend computation budget' },
          dossier_max_rows: { type: 'number', description: 'Dossier per-array row cap, 1..128, default 32' },
          refresh: { type: 'boolean', description: 'Dossier only: bypass response cache for this normally charged collection; does not force whole-program reanalysis.' },
          task_id: { type: 'string', description: 'Existing workspace task UUID; requires style=dossier and records only system-produced observations' },
        },
        required: ['target'],
      },
      output: { schema: { type: 'object', additionalProperties: true }, render: textRender },
      async execute(args, execution) {
        const target = requireString(args, 'target');
        const session = mgr.get(target);
```

</details>

**依据 3 · 源码核查**：[index.js:1297-1306](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/index.js#L1297-L1306)

部分查询明确携带截断、覆盖及未知间接调用。

<details>
<summary>查看原文（10行）</summary>

```text
        let result = await execute(args, execution);
        if (['ig5_xrefs','ig5_calls','ig5_cfg'].includes(definition.name) && result && typeof result === 'object') {
          const rows = result.hits || result.calls || result.blocks || [];
          const total = result.total ?? result.total_blocks;
          const truncated = result.truncated === true || Number.isSafeInteger(total) && total > rows.length;
          const incomplete = session?.info?.analysisComplete === false || session?.info?.partial === true;
          result = { ...result, queryState: { status: result.error ? 'error' : truncated ? 'truncated' : incomplete ? 'analysis_incomplete' : rows.length ? 'observed' : 'empty',
            empty: rows.length === 0, returned: rows.length, total: Number.isSafeInteger(total) ? total : null,
            analysisComplete: typeof session?.info?.analysisComplete === 'boolean' ? session.info.analysisComplete : null,
            coverage: 'provider-observations-only', unresolvedIndirectCalls: 'unknown' } };
```

</details>

**依据 4 · 作者声明**：[README.md:29-37](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/README.md#L29-L37)

静态、仿真和业务恢复的能力限制。

```text
| 方向 | 主要能力 | 使用边界 |
| :--- | :--- | :--- |
| 静态分析 | 函数、字符串、交叉引用、反编译、CFG、类型、结构体、虚表与跳转表检视 | 支持情况依赖具体后端；部分分析与未决结果保留标记 |
| 可视化工作台 | SVG CFG 平移/缩放、双击查看汇编、局部变量焦点高亮、结构体草稿与审计时间线 | 焦点行过滤不等于完整污点分析；编辑草稿仍需发送并审批 |
| 调试与仿真 | x64dbg 原生调试、断点、寄存器/内存、受限轨迹；Unicorn 单函数仿真 | 执行需要授权和审批；仿真不提供完整 OS、import 或 TLS 环境 |
| HTTP/HTTPS 采集 | 本机代理、显式 TLS 解密、流量历史、证据导出、请求重放与下发载荷提取 | 仅批准 origin；不自动修改系统代理或证书信任，不等同完整 Burp 功能 |
| 解密与协议 | 编码/压缩检查、XOR/AES、有界候选检索、PCAP/PCAPNG 解析、分帧与观察状态模型 | 不保证未知密钥恢复或隐藏服务器语义；缺口、冲突与外推假设保留 |
| IR 与去混淆研究 | 真实 p-code/SSA、单函数只读去混淆覆盖层、路径投影、状态组合与离线轨迹恢复 | 局部模型或数学证明不等于通用去壳、完整 VM 或业务恢复 |
| 调查与子代理协作 | 单函数 dossier、持久调查任务、受控 handoff、证据回交与根会话共享调用预算 | DSH 负责派工；插件核验身份/证据/生命周期，不认证模型理解或结论正确性 |
```

#### 缺口

- 未覆盖 43 个工具的全部模式
  **影响**：不能保证完整清单行为或写入范围
  **进一步探讨**：逐工具按参数检查目标、引擎、文件和审批条件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装和使用有什么约束及退出策略？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH 版本与批准服务；Ghidra、Reverse、调试或其他特定路径还需相应运行资产。源码维护树不包含完整运行资产，README 称源码安装器首次联网补齐固定供体；版本、平台、磁盘空间、配置和资产校验均需用户负责。持续成本包括模型调用、分析数据库和人工验证，动态执行还需受控环境及显式审批。应先在隔离 profile、可丢弃且获授权样本试只读观察，先核对输出与副作用；遇到后端、审批或审计状态不明时停止有副作用操作并用独立工具核查，不能以工具注册成功证明端到端可用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:196-211](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/package.json#L196-L211)

宿主能力、权限和版本范围声明。

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "id": "dsh-infinite-gen-5",
    "name": "无限五代",
    "version": "1.3.0",
    "repo": "Minglink/dsh-infinite-gen-5",
    "permissions": "子进程(python worker)、文件写(artifacts)、会话投影、客户端侧栏 tab、显式范围的本地代理与网络请求（审批）",
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true
    }
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.0-rc.1 <0.3.0-0"
```

</details>

**依据 2 · 作者声明**：[README.md:39-47](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/README.md#L39-L47)

Windows 完整包和摘要校验。

```text
<a id="local-install"></a>

## 快速安装

### Windows x64（推荐）

需要已安装的 DeepSeek Harness profile。完整包内置 Ghidra/JDK/Python、x64dbg/Python/bridge 和上游源码、许可及哈希清单；**不需要商业 IDA 安装**，DSH 本身不随包提供。

1. 从 [v1.3.0 Release](https://github.com/Minglink/dsh-infinite-gen-5/releases/tag/v1.3.0) 下载 `IG5-1.3.0-Windows-x64-portable-full.zip` 和同名 `.sha256`，核对 SHA-256：`04273147dde23976a625c582773c33ca1df7b851da0bd5a6e52e2a7c6530b815`。
```

**依据 3 · 作者声明**：[README.md:65-71](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/README.md#L65-L71)

源码安装器供体说明。

````text
在最新源码根目录执行：

```powershell
& .\install.ps1
```

源码安装器首次联网获取固定供体，仅补齐 `runtimes/` 和 `third_party/sources/`，不覆盖当前插件代码。`scripts/distribution.json` 仍固定到 [1.0.0 资产基线](https://github.com/Minglink/dsh-infinite-gen-5/releases/tag/v1.0.0-dsh021-20261010)，这只是原生依赖供体，不表示当前源码回退到 1.0.0。
````

**依据 4 · 作者声明**：[README.md:210-215](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/README.md#L210-L215)

维护源码与真实运行资产、验证层次区别。

````text
├── assets/                   # 海报与社区图片
├── install.ps1               # Windows 安装
└── uninstall.ps1             # 卸载
```

维护源码不包含完整运行资产。测试应区分语法、SDK/renderer fixture、真实后端执行和实际 DSH 模型调用；不能用工具注册或旧报告代替本轮功能验证。维护命令与范围见 [BUILD](docs/BUILD.md) 和 [维护约定](AGENTS.md)。
````

**依据 5 · 源码核查**：[source/approval_gate.js:63-78](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/source/approval_gate.js#L63-L78)

审批不可用或拒绝不派发。

<details>
<summary>查看原文（16行）</summary>

```text
    if (exec?.signal?.aborted) return { kind: 'cancel' };
    let approval;
    try { approval = ctx.get('approval'); } catch { /* uncomposed host */ }
    if (!exec?.agent || typeof approval?.request !== 'function')
      return { kind: 'deny', reason: `IG5 ${exec.name} requires an active agent and an available approval service.` };
    let outcome;
    try {
      outcome = await approval.request({ agent: exec.agent, toolName: exec.name,
        callId: exec.callId, ...request, signal: exec.signal });
    } catch {
      if (exec?.signal?.aborted) return { kind: 'cancel' };
      return { kind: 'deny', reason: `IG5 ${exec.name} approval could not be confirmed; operation was not dispatched.` };
    }
    if (exec?.signal?.aborted || outcome === 'cancelled') return { kind: 'cancel' };
    if (outcome !== 'allowed-once')
      return { kind: 'deny', reason: `IG5 ${exec.name} approval was ${outcome === 'rejected' ? 'rejected' : 'unavailable'}; operation was not dispatched.` };
```

</details>

#### 缺口

- 未安装宿主或测量包、费用、恢复耗时
  **影响**：无法给出真实运行环境和净成本
  **进一步探讨**：在授权隔离环境核对资产、空间和各引擎可用性，记录人工时。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否降低执行后审计缺口？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有执行前审批、参数摘要哈希、执行后审计和 best-effort 诊断，简单增加审批或一条日志并非新贡献。未验证方案是在不可逆操作前持久预留带请求哈希和待执行状态的记录，落盘失败则拒绝派发；执行后补充结果，若崩溃留“结果未知”并要求人工对照，而不是推断失败或自动重试。该方案不能与外部进程、网络或文件系统形成一般性的原子事务，也不能保证审计存储本身无损。以模拟磁盘满、断电窗口、目标超时和重复请求对照现有实现，测未记录已执行数、错误阻断、恢复人工时间；如果无法减少不明执行且误拒或恢复成本过高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[source/approval_gate.js:27-41](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/source/approval_gate.js#L27-L41)

已有载荷哈希和展示摘要。

<details>
<summary>查看原文（15行）</summary>

```text
export function describeOperation(name, args) {
  const shown = name === 'ig5_capture_control'
    ? { action: args?.action, id: args?.id, session_id: args?.session_id, scope: args?.scope, port: args?.port, tls: args?.tls,
      ...(args?.request ? { request: { redacted: true, method: args.request.method,
        headerNames: Object.keys(args.request.headers || {}), bodyProvided: args.request.body !== undefined } } : {}) }
    : (args ?? {});
  const sha256 = createHash('sha256').update(canonical(args ?? {})).digest('hex');
  const blocks = [];
  for (const [key, value] of Object.entries(shown)) {
    if (value === undefined) continue;
    if (typeof value === 'string' && (value.length > 80 || value.includes('\n'))) blocks.push(`${key}（${value.length} 字符）:\n${value}`);
    else blocks.push(`${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`);
  }
  const detail = blocks.join('\n');
  return { detail, sha256, complete: detail.length <= APPROVAL_DISPLAY_LIMIT };
```

</details>

**依据 2 · 源码核查**：[source/approval_gate.js:44-52](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/source/approval_gate.js#L44-L52)

已有派发前审批门。

```text
export function installApprovalGate(ctx, cfg) {
  ctx.on('tools/pre-execute', async (exec, next) => {
    if (!IG5_WRITE_TOOLS.has(exec?.name)) return next();
    const args = exec?.arguments ?? {};
    const destination = args.guest_profile !== undefined ? ` guest=${args.guest_profile} binding=${args.guest_binding_sha256 || '[missing]'}` : '';
    const what = (args?.plan_id ?? args?.ea ?? args?.name ?? args?.target ?? '') + destination;
    const { detail, sha256, complete } = describeOperation(exec.name, args);
    if (!complete)
      return { kind: 'deny', reason: `IG5 ${exec.name} payload exceeds the ${APPROVAL_DISPLAY_LIMIT}-character approval display limit and cannot be reviewed in full; split the operation. Nothing was dispatched.` };
```

**依据 3 · 源码核查**：[source/approval_gate.js:81-102](https://github.com/Minglink/dsh-infinite-gen-5/blob/8738b0e6a125046d1b8388aa901bbc0a2680afcd/source/approval_gate.js#L81-L102)

已有执行后审计和 best-effort 诊断。

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.on('tools/post-execute', async (exec, result, next) => {
    if (!IG5_WRITE_TOOLS.has(exec?.name)) return next();
    try {
      fs.mkdirSync(cfg.artifactDir, { recursive: true });
      const rec = {
        ts: new Date().toISOString(),
        tool: exec.name,
        args: exec.name === 'ig5_capture_control' ? {
          action: exec.arguments?.action, id: exec.arguments?.id, session_id: exec.arguments?.session_id,
          scope: exec.arguments?.scope, port: exec.arguments?.port, tls: exec.arguments?.tls,
          ...(exec.arguments?.request ? { request: { redacted: true, method: exec.arguments.request.method,
            headerNames: Object.keys(exec.arguments.request.headers || {}), bodyProvided: exec.arguments.request.body !== undefined } } : {}),
        } : exec.arguments,
        isError: result?.isError === true,
        detail: result?.isError ? result?.error?.message : result?.value,
      };
      fs.appendFileSync(path.join(cfg.artifactDir, 'approvals.jsonl'), JSON.stringify(rec) + '\n', 'utf8');
    } catch (error) {
      // 审计失败不能破坏结果路径，但必须留下痕迹：该操作已执行而审计行没有落盘。
      try { diagAppend(cfg, `audit: 审计行写入失败，操作已执行但无记录 tool=${exec.name} callId=${exec.callId ?? ''} code=${error?.code ?? 'unknown'}`); } catch { /* diagnostics are best-effort */ }
    }
    return next();
```

</details>

#### 缺口

- 预留记录方案未实现，无法保证外部动作原子性
  **影响**：不能声称已修复审计风险或可安全重试
  **进一步探讨**：在模拟环境以故障注入对照审计缺口与误拒。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
