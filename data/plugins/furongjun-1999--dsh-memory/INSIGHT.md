# 灵枢 dsh-memory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[39517d1](https://github.com/FuRongJun-1999/dsh-memory/tree/39517d18deee020a2f36b40172e652a4269e1d75)

<!-- BEGIN META -->
[![GitHub ★ 502](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=502&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FuRongJun-1999/dsh-memory) [![npm 30d 27,192](https://img.shields.io/static/v1?label=npm+30d&message=27%2C192&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@furongjun1999/dsh-memory) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@furongjun1999/dsh-memory)
<!-- END META -->

> **功能**：将 Markdown 认知图、长期记忆工具与自动召回接入 DSH 和 MCP 宿主

> **亮点**：[Q02](#research-q02) 将请求成功、待审、冲突和已提交分开，并以可读文本真源接入自动召回，是状态可解释性与宿主集成贡献。

> **主要限制**：[Q03](#research-q03) committed不等于语义正确，有sid才加会话过滤、无sid退回无过滤；多智能体可用不能当严格会话隔离验收。

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
  - [Q01 · 它为谁解决什么，当前对象类型是什么？](#detail-section-11)
  - [Q02 · DSH入口怎样连接提交和召回？](#detail-section-12)
  - [Q03 · 提交可审计是否意味着记忆正确和会话隔离成立？](#detail-section-13)
  - [Q04 · 怎样采用并验证不把状态当事实？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需跨会话保留项目事实和偏好的DSH用户，保存Markdown认知图并把相关记忆带回上下文。

AGENTS.md或人工维护Markdown与显式检索；现有工具增加结构化回执和宿主召回，不证明事实永远正确。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 长期记忆工具 | 保存与回查Markdown节点 | 看committed及去向，不能只看ok |
| 自动召回 | 把记忆加入模型上下文 | 需稳定sid；无sid有无过滤回退 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python与可导入md_cg | 必需 | 认知图服务 | 报未就绪/后台重试，先排环境 |
| 匹配DSH接口与稳定sid | 自动召回必需 | 工具和会话过滤 | 不扩大多会话使用 |
| 数据根与写入凭据 | 写操作必需 | 保存/权限 | 无授权不写，核实际token |
| 备份与人工纠错 | 持续采用必需 | 恢复错误记忆 | 先非敏感隔离库 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户配置隔离数据根与凭据 | 服务就绪且实际权限可解释 |
| 2 | 用户写非敏感标记并读回 | committed为真且内容存在 |
| 3 | 用户切会话核注入并禁用 | sid稳定、无误注入；异常停止自动召回 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Python、磁盘和备份 | 配置路径/授权与迁移 | 时间未测 |
| 持续 | 服务进程和注入token | 维护事实、纠错和权限 | 单任务费用未测 |
| 失败恢复 | 重试/审核与备份 | 区分待审、冲突和提交 | 跨进程可见性未验收 |
| 退出 | 保留Markdown真源 | 停用hook/插件并导出 | 加密与派生结构迁移需复核 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可解释提交 | committed与去向分开 | 跨进程读回及语义正确性 |
| 自动召回 | timeline过滤及脱敏注入 | sid缺失时隔离与任务增益 |

> **思考**：[Q03](#research-q03) committed不等于语义正确，有sid才加会话过滤、无sid退回无过滤；多智能体可用不能当严格会话隔离验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将请求成功、待审、冲突和已提交分开，并以可读文本真源接入自动召回，是状态可解释性与宿主集成贡献。

[Q02](#research-q02) 状态回执和统一写入收口可借鉴；[Q03](#research-q03) 无sid回退及权限路径需要显式验收，不能靠宣传的确定性替代。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) committed不等于语义正确，有sid才加会话过滤、无sid退回无过滤；多智能体可用不能当严格会话隔离验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在独立非敏感数据根试验写入、读回和会话过滤；若sid缺失或发生跨会话误注入，停止自动召回并回AGENTS.md/人工查阅。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

提交/召回接线有源码支持；无幻觉、跨会话效果、隔离稳定性与新策略尚未独立验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、md_cg/mcp_server.py、md_cg/mdcg.py、src/hooks.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：重点检查DSH启动/注册、Python写入回执、统一节点写盘和自动召回；未全面审计全部认知工具、密码学、Rust检索或作者基准。
- 下一步：用同模型和事实集比较人工Markdown、现有自动召回与缺sid暂停方案，注入冲突/断线/sid缺失，测错误注入、错误完成、人工纠错及全部token。

**分析版本**

- **仓库**：[FuRongJun-1999/dsh-memory](https://github.com/FuRongJun-1999/dsh-memory)
- **版本号**：0.9.15（[固定提交 39517d1](https://github.com/FuRongJun-1999/dsh-memory/tree/39517d18deee020a2f36b40172e652a4269e1d75)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 推导缺sid暂停自动召回并展示提交/审核/冲突状态的未验证方案；同任务比较错误注入和修复成本，若损失正常召回而不减错则推翻。

用同模型和事实集比较人工Markdown、现有自动召回与缺sid暂停方案，注入冲突/断线/sid缺失，测错误注入、错误完成、人工纠错及全部token。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1460 | 188445 | — | — | 3522310 |
| .mjs | source | 4 | 302 | 270 | 27 | — |
| .ts | source | 16 | 6799 | 4169 | 2355 | — |
| .ts | test | 56 | 9202 | 6920 | 1548 | — |
| .md | test | 1 | 73 | — | — | 1065 |
| .js | source | 4 | 187 | 184 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/FuRongJun-1999/dsh-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 278](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=278&color=737b86&logo=github)](https://github.com/FuRongJun-1999/dsh-memory/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 274](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=274&color=737b86&logo=github)](https://github.com/FuRongJun-1999/dsh-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：长期记忆的提交回执和自动召回能否在多会话下保持可解释边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它为谁解决什么，当前对象类型是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根包既导出Cordis插件又携带Python认知图、CLI及其他宿主接入；本轮按真实DSH插件核查其记忆主线。目标是需跨会话保存项目事实/偏好并回查来源的人，合格交付是明确已写入的节点以及后续正确召回，而不是模型口头说“记住了”。相较AGENTS.md或人工维护Markdown，本组件增加结构层、写入回执和自动注入。README的“不失忆/无幻觉”和评测数字属于作者声明，不能把确定性存取等同语义事实正确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-22](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/README.md#L19-L22)

作者定位与已知问题入口

```text
**灵枢是一套可运行的长期记忆基础设施**——对话自动沉淀为纯文本 md 认知图，记什么、取什么、能不能写入全部由确定性规则裁决，全程可审计、结果可复现。它不训练模型，做的是**模型之外的那一整套**：记忆怎么存、取的时候依据什么、写错了怎么被发现、改过怎么留痕。任何支持 MCP 的 AI Agent 可直接挂载，不与任何单一 Agent 框架绑定。

> **装不起来 / 看到奇怪的告警？** 先看 [环境与已知问题](https://github.com/FuRongJun-1999/dsh-memory/blob/main/docs/ops/%E7%8E%AF%E5%A2%83%E4%B8%8E%E5%B7%B2%E7%9F%A5%E9%97%AE%E9%A2%98.md)——
> DSH Desktop 的启动告警、体积与整目录耦合、异步落盘、以及五条「看起来像 bug 其实是契约」的设计取舍都在那里。
```

**依据 2 · 作者声明**：[README.md:69-83](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/README.md#L69-L83)

显式写入和跨会话召回场景

<details>
<summary>查看原文（15行）</summary>

````text
## ⚡ 三条命令上手

```bash
git clone https://github.com/FuRongJun-1999/dsh-memory.git && cd dsh-memory
npx @furongjun1999/dsh-memory init     # 三问交互：接入端 / 记忆根 / 解释器；只生成配置，不写库
python -m md_cg.mcp_server             # 直连自检：收到 initialize 应答即通
```

> 上面三条**不需要模型凭据、不需要联网**；默认以只读 `guest` 运行（**读得到、写不进**）。写入凭据、完整前置、30+ 配置项与排障 → **[安装与运维](docs/ops/README.md)**

| 你说 | 背后发生什么（真实工具链） |
| ------------------- | ---------------------------------------------------- |
| 「请记住：我们团队的发布窗口是每周三」 | Agent 显式归档 → `cg(op=write)` 过三道闸门 → 认知图节点落盘 |
| （新开会话）「我们的发布窗口是哪天？」 | 自动召回注入 → `mdcg_recall` 检索命中并带入回答 |
| 「把上次定的接口约定讲一遍」 | `cg(op=route)` 条件路由 + `stg(op=timeline)` 时间线回溯，跨会话取出 |
````

</details>

**依据 3 · 作者声明**：[README.md:99-105](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/README.md#L99-L105)

无幻觉及基准为作者主张

```text
## ✨ 核心亮点

- **🧠 不失忆**——落盘即长期留存，遗忘只能显式发起、不做静默淘汰；检索索引只是派生物，**原文即真源**
- **⚡ 高性能**——Rust 检索内核（零第三方依赖）＋ `--serve` 进程实例支撑多智能体并发。公开基准 [hive-memory-bench](https://github.com/FuRongJun-1999/hive-memory-bench) 六家同口径：**逐字保真 100% · 保地基 68.4%/65.0% · 证据链 97–100% · 写入 0.013–0.020 秒（零 LLM，同表其余 75.7–658.5 秒）**
- **🛡️ 无幻觉**——记什么、取什么、能不能写入全部由确定性规则裁决，不依赖 LLM 黑箱；写没写成功只看 `committed`，绝不假装通过
- **🔌 多智能体适用**——同一份大脑 + 同一份纪律，接入 DSH · CodeBuddy · ZCode · Codex CLI · Claude Code，任何 MCP 宿主可直接挂载
- **📊 可复现评测**——权威对照在独立公开基准 hive-memory-bench；另公开两个自建题池；**已有两份第三方独立验证**（七轮复评 + LoCoMo 独立复现，自报数字逐位一致）
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH入口怎样连接提交和召回？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply解析数据根和token，创建共享MdcgClient，bridge就绪后从服务拉工具并注册裸名及兼容别名，再安装hooks。写入MCP分支区分审核排队committed=false、冲突defer不落盘/不入队，以及cg.add返回后的committed=true；底层统一_write_node封装内容、校验密级，再atomic_write。召回在system-prompt/assemble中调用timeline，取会话过滤结果，脱敏并以不可信记忆边界渲染后注入。贡献在把提交状态与“成功请求”分开、将文本真源连接到宿主上下文，而非训练一个更真实的模型。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:271-305](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/src/index.ts#L271-L305)

数据根、凭据和客户端配置

<details>
<summary>查看原文（35行）</summary>

```text
  /** 记忆真源解析结果（「新写入去哪」）——用户可改：env > paths.json > 配置 > 默认自身仓 data/。 */
  const resolvedRoot = mdcgRoot(config.mdcg.root)
  if (config.mdcg.enabled) {
    // ── 写入凭据解析（首启引导）：显式配置 → 密钥环 → 首启自动签发 ──
    // 为什么需要：md_cg 无令牌即降级只读 guest，自动记忆 / 转录 / 角色落图
    // **静默不落盘**——「装好了插件，但记忆永远是空的」是最难定位的失效形态。
    // 解析顺序与「自动签发不降低实际安全强度」的论证见 lib/token_store.ts 文件头。
    // legacy env 认证本就等价于「已显式授权」→ 不再签发，避免多签一枚无用令牌。
    const legacyAuth = config.env.MDCG_LEGACY_ENV_AUTH ?? process.env.MDCG_LEGACY_ENV_AUTH
    const resolution = resolveToken({
      python: config.python,
      configured: config.env.MDCG_TOKEN,
      actor: config.mdcg.actor,
      clearance: config.mdcg.clearance,
      autoIssue: !legacyAuth,
      // #224：签发/复核必须看见与 MCP 子进程**同一套** env 与租户——
      // 否则令牌记录写到 ~/.mdcg、子进程去 aux 下找（或租户不一致）⇒ rc=3 拒启。
      tenant: config.mdcg.tenant,
      env: config.env,
    })
    cred = resolution
    // 注入子进程 env：显式配置与密钥环都在此汇合成**唯一**的 MDCG_TOKEN。
    const mdcgEnv: Record<string, string> = { ...config.env }
    if (resolution.token) mdcgEnv.MDCG_TOKEN = resolution.token
    mdcg = new MdcgClient({
      python: config.python,
      args: config.moduleArgs,
      root: resolvedRoot,
      actor: config.mdcg.actor,
      tenant: config.mdcg.tenant,
      clearance: config.mdcg.clearance,
      identity: config.identity,
      env: mdcgEnv,
      timeoutMs: config.toolCallTimeoutMs,
      maxRetryDelayMs: config.maxRetryDelayMs,
```

</details>

**依据 2 · 源码核查**：[src/index.ts:434-449](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/src/index.ts#L434-L449)

就绪后动态工具注册

<details>
<summary>查看原文（16行）</summary>

```text
    // 工具注册：初始就绪立即注册；若启动时未就绪（python 暂不可用等
    // 竞态），桥重连成功后自动补注册——修复"工具永久缺失"问题。
    let toolsRegistered = false
    const tryRegister = async () => {
      if (toolsRegistered || !bridge?.isReady()) return
      try {
        const dispose = await registerLingshuTools(ctx, bridge, {
          selection: config.tools,
          // 工具名口径（2026-10-19 设计者裁定 A）：**不加任何前缀**——全端与 MCP 服务同名为
      // `cg` / `stg` / `mdcg_*`。此前按 `${config.serverName}_` 拼成 `cg`，造成「同一个
      // MCP 服务、不同端看到不同工具名」的初次识别错误。serverName 仍用于内部 provider/日志标识。
      toolPrefix: '',
      // issue #634：默认补注册 lingshu_* 兼容别名（旧会话/旧脚本硬编码旧名时不至于 unknown tool）。
      // 需要「只要裸名」的部署可设 tools.legacyAliases=false。
      legacyAliases: config.toolAliases !== false,
        })
```

</details>

**依据 3 · 源码核查**：[src/index.ts:469-469](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/src/index.ts#L469-L469)

hooks实际安装

```text
    disposers.push(installMemoryHooks(ctx, mdcg, config.memory))
```

**依据 4 · 源码核查**：[md_cg/mcp_server.py:4240-4284](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/md_cg/mcp_server.py#L4240-L4284)

排队/冲突/实际提交回执

<details>
<summary>查看原文（45行）</summary>

```text
            return _am.apply_dedup(
                {"ok": True, "id": nid, "committed": False,
                 "moved_to": "review_queue", "verdict": None,
                 "pid": _pr["pid"],
                 "mutation": _pay, "autonomy": _aut,
                 "hint": "%s 本次未落盘：变更单已入审核队列（pid=%s，目标 %s）。"
                         % (_dec["hint"], _pr["pid"], nid)}, _pr)
        written = cg.add(nid, _content, layer=_layer,
                         # B2：同上——落盘面丢字段＝上游声明静默失效。
                         sensitivity=a.get("sensitivity"),
                         role=a.get("role"), tags=a.get("tags"),
                         condition_space=a.get("condition_space"),
                         importance=float(a.get("importance", 0.5)),
                         verification_basis=a.get("verification_basis"),
                         # A1 补接（2026-10-05）：检验强度透传（同 B2）。
                         check_strength=a.get("check_strength"),
                         # 0.8.0 对接：spatial 直存透传（同 B2）；缺省不传（零落键）。
                         **_spatial_kw(a),
                         non_applicable_conditions=a.get("non_applicable_conditions"),
                         override=bool(a.get("override")),
                         consistency=bool(a.get("consistency", True)),
                         on_conflict=a.get("on_conflict") or "reject",
                         derived_from=_split_ids(a.get("derived_from")),
                         relation=a.get("relation"))
        if written is None:
            # 冲突 DEFER 同属 protocol.gate_short_circuit 形态：WRITE_TRIO +
            # moved_to + verdict + hint。此前只有 ok/id/verdict/reason ⇒ 判 committed
            # 的调用方读不到「未提交」，也读不到去向与下一步。
            # 语义（mdcg.py:2192 生效条件 + :2319-2321）：on_conflict=defer 时
            # REJECT/BLINDSPOT **既不落盘也不入队**——故去向**不可**写 review_queue，
            # 用 conflict_deferred 表达「被冲突闸挡下、未进任何队列」。
            # （去向词：2026-10-12 设计者裁定为 conflict_deferred。）
            return {"ok": False, "id": nid, "committed": False,
                    "moved_to": "conflict_deferred",
                    "verdict": "DEFER",
                    "reason": "节点间冲突检测未通过（on_conflict=defer）",
                    "hint": "本次未落盘、未入队（defer 语义）：如需落盘请显式处置冲突——"
                            "修正正文后重写 / on_conflict=reject 取明确拒绝 / "
                            "override=true 覆写（需相应权限）"}
        # issue #109 相邻面：工具面**同一返回体**在闸门短路分支给 committed=False，
        # 成功分支此前却不给 committed ⇒ 判 committed 的调用方会把「成功」读成
        # 「未提交」（与 #109 报的「把待审读成已提交」是同一处的两面）。
        # 三键铁律（protocol.WRITE_TRIO / 协议文档 :28「任一形态必含 ok/id/committed」）
        # 在此补齐：不改写入语义，只补判据键。
        out = {"ok": True, "id": nid, "committed": True}
```

</details>

**依据 5 · 源码核查**：[md_cg/mdcg.py:4310-4322](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/md_cg/mdcg.py#L4310-L4322)

统一封装和原子写入

<details>
<summary>查看原文（13行）</summary>

```text
    def _write_node(self, node_id: str, path: str, fm: dict, content: str,
                    durable: bool = False, declared_sensitivity: str = None):
        """统一节点写盘口：先封装再原子写。**所有写盘点都应走这里**，
        否则 `get()` 解密后的明文会被直接回写（破坏加密）。"""
        sealed = self._seal_content(node_id, content, fm.get("sensitivity"))
        # B2 密级一致性闸：位置在 atomic_write **之前**——判据单点在此，
        # 全部写盘点（add / backfill / rewrite / move_layer）自动覆盖。
        # `has_sealer`＝本实例是否覆写了密封钩子（鸭子判据，不 import 子类，
        # 免循环依赖）：无密封能力的实例落 private 明文是既有语义，判据② 不适用。
        _check_sensitivity_landing(
            node_id, fm.get("sensitivity"), declared_sensitivity, sealed,
            has_sealer=(type(self)._seal_content is not MdCG._seal_content))
        atomic_write(path, nodefile.dumps(fm, sealed), durable=durable)
```

</details>

**依据 6 · 源码核查**：[src/hooks.ts:814-834](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/src/hooks.ts#L814-L834)

timeline与会话参数

<details>
<summary>查看原文（21行）</summary>

```text
        if (opts.autoRecall && graph.isReady()) {
          // 会话隔离（P45）：自动召回只注入**本会话**的记忆，防多会话串台；
          // 取不到会话标识则退回旧行为（不加过滤），不做半吊子猜测。
          // ⚠️ 取值必须**每步稳定**：本块按 v0.4.8 契约每步都 push，内容一旦与上
          // 一步不同宿主就 append 一份新快照——会话标识若中途才出现，会让「无过滤
          // → 有过滤」翻转一次，白付两份快照。故优先取 ctx 上的会话（首步即在），
          // 退回「最近一次 session/event 的会话」。
          // 想读**所有**会话做了什么：别走自动召回（它会串台），显式调
          // `stg(op=timeline, session="*")`，返回项带 session 归属。
          // sid 已在门控外解析（提醒消费与召回共用同一份，避免两次口径漂移）。
          // 逢十轮提醒（纪律第 16 条；issue #645 修正）：计数挪到 session/event 的真实
          // 用户回合上，这里只消费一次待推文本。旧实现把 assemble 当轮次 + 段内永久重推
          // ⇒ 提醒几乎常驻、agent 反复空转归档；sid 缺失时还回落共用键 __no_sid__，
          // 并行会话互相污染频率。现改为：无 sid 不提醒；提醒只在本回合第一次 assemble 出现。
          // （提醒消费已在门控外做掉，见上；此处不再重复——重复块是 #657 修复的残留。）
          // 非永久层 → 既有「最近记忆」块；self/anchor → 独立「身份锚点」块（独立预算）。
          const identityOn = opts.autoRecallIdentity === true
          const timelinePayload = await graph.timeline(
            identityOn ? recallLimit + IDENTITY_MAX_ITEMS : recallLimit,
            sid ? { session: sid } : {})
          const text = formatTimelineDecayed(timelinePayload)
```

</details>

**依据 7 · 源码核查**：[src/hooks.ts:858-864](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/src/hooks.ts#L858-L864)

脱敏、不可信边界和实际注入

```text
            const recallBody = desensitize(text.slice(0, RECALL_MAX_CHARS))
            if (recallBody) {
              assembly.contexts.push({
                name: 'lingshu:auto-recall',
                text: escapePromptBraces(renderUntrustedMemoryBlock(
                  `【灵枢最近记忆】\n${recallBody}`)),
              })
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 提交可审计是否意味着记忆正确和会话隔离成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

committed只说明该分支完成写入，不能证明内容是真事实、未来检索命中或回答无幻觉。排队与冲突有不同去向，调用方若只看ok就会把未提交当完成。更直接的隔离边界是自动召回：有sid时传session过滤，无sid时传空对象，注释明确退回无过滤行为。多会话场景必须确认sid稳定，不能由“支持多智能体”直接推导每次注入都隔离。默认无token为只读guest，但插件会解析/可能自动签发凭据，直接MCP默认权限与DSH启动后的实际权限也不能混同。

#### 证据与依据

**依据 1 · 源码核查**：[md_cg/mcp_server.py:4240-4284](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/md_cg/mcp_server.py#L4240-L4284)

ok与committed、去向明确区分

<details>
<summary>查看原文（45行）</summary>

```text
            return _am.apply_dedup(
                {"ok": True, "id": nid, "committed": False,
                 "moved_to": "review_queue", "verdict": None,
                 "pid": _pr["pid"],
                 "mutation": _pay, "autonomy": _aut,
                 "hint": "%s 本次未落盘：变更单已入审核队列（pid=%s，目标 %s）。"
                         % (_dec["hint"], _pr["pid"], nid)}, _pr)
        written = cg.add(nid, _content, layer=_layer,
                         # B2：同上——落盘面丢字段＝上游声明静默失效。
                         sensitivity=a.get("sensitivity"),
                         role=a.get("role"), tags=a.get("tags"),
                         condition_space=a.get("condition_space"),
                         importance=float(a.get("importance", 0.5)),
                         verification_basis=a.get("verification_basis"),
                         # A1 补接（2026-10-05）：检验强度透传（同 B2）。
                         check_strength=a.get("check_strength"),
                         # 0.8.0 对接：spatial 直存透传（同 B2）；缺省不传（零落键）。
                         **_spatial_kw(a),
                         non_applicable_conditions=a.get("non_applicable_conditions"),
                         override=bool(a.get("override")),
                         consistency=bool(a.get("consistency", True)),
                         on_conflict=a.get("on_conflict") or "reject",
                         derived_from=_split_ids(a.get("derived_from")),
                         relation=a.get("relation"))
        if written is None:
            # 冲突 DEFER 同属 protocol.gate_short_circuit 形态：WRITE_TRIO +
            # moved_to + verdict + hint。此前只有 ok/id/verdict/reason ⇒ 判 committed
            # 的调用方读不到「未提交」，也读不到去向与下一步。
            # 语义（mdcg.py:2192 生效条件 + :2319-2321）：on_conflict=defer 时
            # REJECT/BLINDSPOT **既不落盘也不入队**——故去向**不可**写 review_queue，
            # 用 conflict_deferred 表达「被冲突闸挡下、未进任何队列」。
            # （去向词：2026-10-12 设计者裁定为 conflict_deferred。）
            return {"ok": False, "id": nid, "committed": False,
                    "moved_to": "conflict_deferred",
                    "verdict": "DEFER",
                    "reason": "节点间冲突检测未通过（on_conflict=defer）",
                    "hint": "本次未落盘、未入队（defer 语义）：如需落盘请显式处置冲突——"
                            "修正正文后重写 / on_conflict=reject 取明确拒绝 / "
                            "override=true 覆写（需相应权限）"}
        # issue #109 相邻面：工具面**同一返回体**在闸门短路分支给 committed=False，
        # 成功分支此前却不给 committed ⇒ 判 committed 的调用方会把「成功」读成
        # 「未提交」（与 #109 报的「把待审读成已提交」是同一处的两面）。
        # 三键铁律（protocol.WRITE_TRIO / 协议文档 :28「任一形态必含 ok/id/committed」）
        # 在此补齐：不改写入语义，只补判据键。
        out = {"ok": True, "id": nid, "committed": True}
```

</details>

**依据 2 · 源码核查**：[src/hooks.ts:814-833](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/src/hooks.ts#L814-L833)

无sid时未传session过滤

<details>
<summary>查看原文（20行）</summary>

```text
        if (opts.autoRecall && graph.isReady()) {
          // 会话隔离（P45）：自动召回只注入**本会话**的记忆，防多会话串台；
          // 取不到会话标识则退回旧行为（不加过滤），不做半吊子猜测。
          // ⚠️ 取值必须**每步稳定**：本块按 v0.4.8 契约每步都 push，内容一旦与上
          // 一步不同宿主就 append 一份新快照——会话标识若中途才出现，会让「无过滤
          // → 有过滤」翻转一次，白付两份快照。故优先取 ctx 上的会话（首步即在），
          // 退回「最近一次 session/event 的会话」。
          // 想读**所有**会话做了什么：别走自动召回（它会串台），显式调
          // `stg(op=timeline, session="*")`，返回项带 session 归属。
          // sid 已在门控外解析（提醒消费与召回共用同一份，避免两次口径漂移）。
          // 逢十轮提醒（纪律第 16 条；issue #645 修正）：计数挪到 session/event 的真实
          // 用户回合上，这里只消费一次待推文本。旧实现把 assemble 当轮次 + 段内永久重推
          // ⇒ 提醒几乎常驻、agent 反复空转归档；sid 缺失时还回落共用键 __no_sid__，
          // 并行会话互相污染频率。现改为：无 sid 不提醒；提醒只在本回合第一次 assemble 出现。
          // （提醒消费已在门控外做掉，见上；此处不再重复——重复块是 #657 修复的残留。）
          // 非永久层 → 既有「最近记忆」块；self/anchor → 独立「身份锚点」块（独立预算）。
          const identityOn = opts.autoRecallIdentity === true
          const timelinePayload = await graph.timeline(
            identityOn ? recallLimit + IDENTITY_MAX_ITEMS : recallLimit,
            sid ? { session: sid } : {})
```

</details>

**依据 3 · 源码核查**：[md_cg/mcp_server.py:4952-4958](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/md_cg/mcp_server.py#L4952-L4958)

直接MCP匿名guest只读

```text
    spec = role_spec("guest")               # 无令牌：只读访客
    p = Principal(
        tenant=os.environ.get("MDCG_TENANT", "default"),
        actor=os.environ.get("MDCG_ACTOR", "mcp-client"),
        clearance="internal", can_write=False, can_admin=False, role="guest",
        layers_allow=spec["layers_allow"], ops_allow=spec["ops_allow"],
        auth_mode="anonymous")
```

**依据 4 · 源码核查**：[src/index.ts:274-294](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/src/index.ts#L274-L294)

DSH启动解析及自动签发路径

<details>
<summary>查看原文（21行）</summary>

```text
    // ── 写入凭据解析（首启引导）：显式配置 → 密钥环 → 首启自动签发 ──
    // 为什么需要：md_cg 无令牌即降级只读 guest，自动记忆 / 转录 / 角色落图
    // **静默不落盘**——「装好了插件，但记忆永远是空的」是最难定位的失效形态。
    // 解析顺序与「自动签发不降低实际安全强度」的论证见 lib/token_store.ts 文件头。
    // legacy env 认证本就等价于「已显式授权」→ 不再签发，避免多签一枚无用令牌。
    const legacyAuth = config.env.MDCG_LEGACY_ENV_AUTH ?? process.env.MDCG_LEGACY_ENV_AUTH
    const resolution = resolveToken({
      python: config.python,
      configured: config.env.MDCG_TOKEN,
      actor: config.mdcg.actor,
      clearance: config.mdcg.clearance,
      autoIssue: !legacyAuth,
      // #224：签发/复核必须看见与 MCP 子进程**同一套** env 与租户——
      // 否则令牌记录写到 ~/.mdcg、子进程去 aux 下找（或租户不一致）⇒ rc=3 拒启。
      tenant: config.mdcg.tenant,
      env: config.env,
    })
    cred = resolution
    // 注入子进程 env：显式配置与密钥环都在此汇合成**唯一**的 MDCG_TOKEN。
    const mdcgEnv: Record<string, string> = { ...config.env }
    if (resolution.token) mdcgEnv.MDCG_TOKEN = resolution.token
```

</details>

#### 缺口

- 多会话sid稳定性、跨进程可见性及语义召回质量缺少同任务验收
  **影响**：无法保证不串上下文或正确使用记忆
  **进一步探讨**：用非敏感标记隔离会话并注入sid缺失、断线与冲突，记录实际注入和读取结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样采用并验证不把状态当事实？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

需要Python可导入md_cg、匹配DSH接口、明确数据根与授权。已有跨会话资料维护需求者可先用隔离数据根和非敏感事实试用，验收写入回执、读回、sid过滤和禁用。首次是配置和备份，持续增加注入上下文与人工纠错，失败涉及审核队列、冲突及迁移；未测总人工或模型成本。由无sid退回无过滤和多种提交状态推导未验证假设：缺sid时暂停自动召回、并展示提交/审核/冲突状态，可减少跨会话误注入及错误确认。与当前策略对照相同会话和冲突任务，测错误注入、错误完成及人工修复；若减少正常召回却未降低错误，或修复成本升高，则推翻。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:390-400](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/src/index.ts#L390-L400)

Python/启动失败处理

<details>
<summary>查看原文（11行）</summary>

```text
  if (!brainReady) {
    // issue #19：自检命令按当前解释器给出（Windows python / 其它 python3），
    // 照抄报错里的命令在用户平台上必须真的可执行。
    const message = `灵枢大脑（md_cg）未就绪（检查 ${config.python} 是否可用、md_cg 是否可导入：${selfCheckCommand(config.python)}）`
    if (config.failOnStartupError && config.mdcg.enabled) {
      // P1 修复（GPT 审查）：启动失败抛错前必须 dispose——此前 throw 在 try 之前，
      // 桥接对象泄漏 + 后台重试计时器继续跑
      mdcg?.dispose()
      throw new Error(message)
    }
    ctx.logger.warn(`dsh-memory: ${message}，继续后台重试`)
```

</details>

**依据 2 · 源码核查**：[src/hooks.ts:814-833](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/src/hooks.ts#L814-L833)

会话过滤为假设依据

<details>
<summary>查看原文（20行）</summary>

```text
        if (opts.autoRecall && graph.isReady()) {
          // 会话隔离（P45）：自动召回只注入**本会话**的记忆，防多会话串台；
          // 取不到会话标识则退回旧行为（不加过滤），不做半吊子猜测。
          // ⚠️ 取值必须**每步稳定**：本块按 v0.4.8 契约每步都 push，内容一旦与上
          // 一步不同宿主就 append 一份新快照——会话标识若中途才出现，会让「无过滤
          // → 有过滤」翻转一次，白付两份快照。故优先取 ctx 上的会话（首步即在），
          // 退回「最近一次 session/event 的会话」。
          // 想读**所有**会话做了什么：别走自动召回（它会串台），显式调
          // `stg(op=timeline, session="*")`，返回项带 session 归属。
          // sid 已在门控外解析（提醒消费与召回共用同一份，避免两次口径漂移）。
          // 逢十轮提醒（纪律第 16 条；issue #645 修正）：计数挪到 session/event 的真实
          // 用户回合上，这里只消费一次待推文本。旧实现把 assemble 当轮次 + 段内永久重推
          // ⇒ 提醒几乎常驻、agent 反复空转归档；sid 缺失时还回落共用键 __no_sid__，
          // 并行会话互相污染频率。现改为：无 sid 不提醒；提醒只在本回合第一次 assemble 出现。
          // （提醒消费已在门控外做掉，见上；此处不再重复——重复块是 #657 修复的残留。）
          // 非永久层 → 既有「最近记忆」块；self/anchor → 独立「身份锚点」块（独立预算）。
          const identityOn = opts.autoRecallIdentity === true
          const timelinePayload = await graph.timeline(
            identityOn ? recallLimit + IDENTITY_MAX_ITEMS : recallLimit,
            sid ? { session: sid } : {})
```

</details>

**依据 3 · 源码核查**：[md_cg/mcp_server.py:4240-4284](https://github.com/FuRongJun-1999/dsh-memory/blob/39517d18deee020a2f36b40172e652a4269e1d75/md_cg/mcp_server.py#L4240-L4284)

多种回执状态为假设依据

<details>
<summary>查看原文（45行）</summary>

```text
            return _am.apply_dedup(
                {"ok": True, "id": nid, "committed": False,
                 "moved_to": "review_queue", "verdict": None,
                 "pid": _pr["pid"],
                 "mutation": _pay, "autonomy": _aut,
                 "hint": "%s 本次未落盘：变更单已入审核队列（pid=%s，目标 %s）。"
                         % (_dec["hint"], _pr["pid"], nid)}, _pr)
        written = cg.add(nid, _content, layer=_layer,
                         # B2：同上——落盘面丢字段＝上游声明静默失效。
                         sensitivity=a.get("sensitivity"),
                         role=a.get("role"), tags=a.get("tags"),
                         condition_space=a.get("condition_space"),
                         importance=float(a.get("importance", 0.5)),
                         verification_basis=a.get("verification_basis"),
                         # A1 补接（2026-10-05）：检验强度透传（同 B2）。
                         check_strength=a.get("check_strength"),
                         # 0.8.0 对接：spatial 直存透传（同 B2）；缺省不传（零落键）。
                         **_spatial_kw(a),
                         non_applicable_conditions=a.get("non_applicable_conditions"),
                         override=bool(a.get("override")),
                         consistency=bool(a.get("consistency", True)),
                         on_conflict=a.get("on_conflict") or "reject",
                         derived_from=_split_ids(a.get("derived_from")),
                         relation=a.get("relation"))
        if written is None:
            # 冲突 DEFER 同属 protocol.gate_short_circuit 形态：WRITE_TRIO +
            # moved_to + verdict + hint。此前只有 ok/id/verdict/reason ⇒ 判 committed
            # 的调用方读不到「未提交」，也读不到去向与下一步。
            # 语义（mdcg.py:2192 生效条件 + :2319-2321）：on_conflict=defer 时
            # REJECT/BLINDSPOT **既不落盘也不入队**——故去向**不可**写 review_queue，
            # 用 conflict_deferred 表达「被冲突闸挡下、未进任何队列」。
            # （去向词：2026-10-12 设计者裁定为 conflict_deferred。）
            return {"ok": False, "id": nid, "committed": False,
                    "moved_to": "conflict_deferred",
                    "verdict": "DEFER",
                    "reason": "节点间冲突检测未通过（on_conflict=defer）",
                    "hint": "本次未落盘、未入队（defer 语义）：如需落盘请显式处置冲突——"
                            "修正正文后重写 / on_conflict=reject 取明确拒绝 / "
                            "override=true 覆写（需相应权限）"}
        # issue #109 相邻面：工具面**同一返回体**在闸门短路分支给 committed=False，
        # 成功分支此前却不给 committed ⇒ 判 committed 的调用方会把「成功」读成
        # 「未提交」（与 #109 报的「把待审读成已提交」是同一处的两面）。
        # 三键铁律（protocol.WRITE_TRIO / 协议文档 :28「任一形态必含 ok/id/committed」）
        # 在此补齐：不改写入语义，只补判据键。
        out = {"ok": True, "id": nid, "committed": True}
```

</details>

#### 缺口

- 全周期成本和缺sid暂停策略的任务效果未测
  **影响**：不能据文本可审计推断采用经济性或新策略收益
  **进一步探讨**：同模型/事实集对比有无自动召回，计入错误纠正和失败恢复

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
