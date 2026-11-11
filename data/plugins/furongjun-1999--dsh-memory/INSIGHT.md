# 灵枢（Lingshu）

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[a3b47e5](https://github.com/FuRongJun-1999/dsh-memory/tree/a3b47e5ca30800798fa394011739c7599b1ff1ee)

<!-- BEGIN META -->
[![GitHub ★ 648](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=648&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FuRongJun-1999/dsh-memory) [![npm 30d 31,697](https://img.shields.io/static/v1?label=npm+30d&message=31%2C697&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@furongjun1999/dsh-memory) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@furongjun1999/dsh-memory)
<!-- END META -->

> **功能**：把 DSH 会话接入 Markdown 认知图，支持长期记忆、检索与反思。

> **亮点**：将结构化记录、操作白名单和宿主回注接到一条长期记忆链，提供按来源复核的入口。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：默认首启可自动签发令牌，没配置不能直接当只读。记忆边界标记也不能证明模型不会误用历史内容。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 长期记忆相对手工项目笔记多做什么？](#detail-section-11)
  - [Q02 · 宿主与记忆服务怎样接线，回注如何处理不可信文字？](#detail-section-12)
  - [Q03 · 没配置令牌是否一定只读，数据迁移要备份哪里？](#detail-section-13)
  - [Q04 · 怎样验证有效回忆，降低自动记录的治理成本？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：跨会话反复处理同一项目的人，可把已有信息存进可查的记忆库再取用。

手工项目笔记能逐项确认，自动归档减少每次搬运但要承担错误与访问边界。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 会话记忆 | 记录符合规则的文本 | 源与角色必须核对 |
| 召回 | 读取相关旧资料 | 提示标记不等于模型隔离 |
| 权限与迁移 | 约束写入及数据位置 | 凭据根独立 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| Node 与 DSH | 注册宿主工具与钩子 | 按包声明复核目标宿主 |
| Python 与 md_cg | 本地记忆服务 | 启动、状态和实际存储根要核对 |
| 令牌与角色 | 决定写入能力 | 显式确认 guest 拒绝写入 |

| 阶段 | 操作 | 异常 |
| --- | --- | --- |
| 首次 | 隔离数据根，使用合成会话 | 确认不触发真实记忆修改 |
| 持续 | 核对来源、错误回忆和用量 | 误回注即停自动 |
| 退出 | 停服务并检查两个根 | 备份后核对迁移结果 |

**效果与成本**

| 成本 | 单位 | 限制 |
| --- | --- | --- |
| 模型 | 每个合格回忆增加的上下文和推理成本 | 未量化 |
| 人工 | 凭据、纠错、归档与恢复时间 | 不能省略验证 |

| 效果 | 判据 | 边界 |
| --- | --- | --- |
| 减少重复交代 | 找回可核验项目事实 | 不保证无幻觉 |
| 权限可审计 | 实际角色拒绝越权写 | 未验证全部路径 |

> **思考**：默认首启可自动签发令牌，没配置不能直接当只读。记忆边界标记也不能证明模型不会误用历史内容。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将结构化记录、操作白名单和宿主回注接到一条长期记忆链，提供按来源复核的入口。[Q01](#research-q01) [Q02](#research-q02)

工具注册随桥就绪，提示侧只变换副本，服务端按操作及部分参数独立校验。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认首启可自动签发令牌，没配置不能直接当只读。记忆边界标记也不能证明模型不会误用历史内容。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用合成会话与临时根，核对 guest 拒写和可追溯召回。权限或注入影响不清楚就停用自动记录。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码级观察；插件、模型、恢复和真实权限没有实测。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/hooks.ts、md_cg/mcp_server.py、src/lib/token_store.ts、src/lib/prompt_safety.ts、package.json、dsh/cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 DSH、事件钩子和 MCP 分派定向核查，未运行目标和真实模型。
- 下一步：用假会话核对写入、错误事实召回、权限拒绝和两个数据根恢复。

**分析版本**

- **仓库**：[FuRongJun-1999/dsh-memory](https://github.com/FuRongJun-1999/dsh-memory)
- **版本号**：0.10.2（[固定提交 a3b47e5](https://github.com/FuRongJun-1999/dsh-memory/tree/a3b47e5ca30800798fa394011739c7599b1ff1ee)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

让有冲突或授权风险的记忆先经人复核再自动回注，比较错误复用与合格召回；无改善则保留手工记录。[Q04](#research-q04)

用假会话核对写入、错误事实召回、权限拒绝和两个数据根恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1512 | 195422 | — | — | 3609641 |
| .mjs | source | 4 | 411 | 347 | 59 | — |
| .ts | source | 16 | 7169 | 4365 | 2535 | — |
| .ts | test | 63 | 10090 | 7591 | 1688 | — |
| .md | test | 1 | 73 | — | — | 1065 |
| .js | source | 4 | 242 | 230 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=15&color=737b86&logo=github)](https://github.com/FuRongJun-1999/dsh-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 273](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=273&color=737b86&logo=github)](https://github.com/FuRongJun-1999/dsh-memory/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 267](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=267&color=737b86&logo=github)](https://github.com/FuRongJun-1999/dsh-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断灵枢将会话事件存入认知图并回注的可追溯性、权限和长期使用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 长期记忆相对手工项目笔记多做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

反复跨会话处理同一项目的人，可以将符合条件的用户、助手和工具文本按角色写入记忆库，再将近期命中的内容纳入后续上下文。手工笔记更容易逐条人工确认，但模型需要额外查找或重复交代。这里的增量在事件来源、会话标记、受规则约束的写入和回注共用认知图接口，能支持追查来源。README 的无幻觉表述不能由机制推出，记下原输入也可能保留原输入中的错误。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-24](https://github.com/FuRongJun-1999/dsh-memory/blob/a3b47e5ca30800798fa394011739c7599b1ff1ee/README.md#L15-L24)

作者描述可审计长期记忆及其宣传边界。

<details>
<summary>查看原文（10行）</summary>

```text
**高性能 · 无幻觉 · 多智能体适用的长期记忆系统（v0.10.2）**

> **当前版本 `0.10.2`**（npm `latest`）· 已在 **DSH `0.2.1-rc.5`** 上验证可用（维护者实测）。
> **路线**：后续开发专注 **灵枢 1.0 架构**；存量 issue 的修复会**延后**处理（不停止受理，但优先级低于 1.0）。

📖 **[官方使用教程](docs/灵枢使用教程.md)** —— 分层怎么选 / 六要素怎么写 / 读三面怎么用 / 七个必踩的坑（10 分钟上手）。

</div>

**灵枢是一套可运行的长期记忆基础设施**——对话自动沉淀为纯文本 md 认知图，记什么、取什么、能不能写入全部由确定性规则裁决，全程可审计、结果可复现。它不训练模型，做的是**模型之外的那一整套**：记忆怎么存、取的时候依据什么、写错了怎么被发现、改过怎么留痕。任何支持 MCP 的 AI Agent 可直接挂载，不与任何单一 Agent 框架绑定。
```

</details>

**依据 2 · 源码核查**：[src/hooks.ts:1212-1241](https://github.com/FuRongJun-1999/dsh-memory/blob/a3b47e5ca30800798fa394011739c7599b1ff1ee/src/hooks.ts#L1212-L1241)

真实用户事件提取文本、处理、写入和预热读。

<details>
<summary>查看原文（30行）</summary>

```text
      // 只记真实用户输入（kind='user'），跳过插件注入/系统上下文
      if (event.data.source?.kind !== 'user') {
        // T4 诊断（2026-08-30）：dsh 端对话零写入排查——记录被滤事件的实际
        // source.kind（若 dsh 新版改了 kind 值，此处日志可定位）
        ctx.logger.info(`dsh-memory: user/message 事件被滤（source.kind=${event.data.source?.kind ?? 'undefined'}）`)
        audit.filtered('kind', kindOf(event.data.source))
        return
      }
      const text = extractText(event.data.content)
      if (!text) return
      const safe = sanitize(text)  // 脱敏：纯凭据消息 → null → 跳过写入
      if (safe === null) { audit.skipped('sanitized', 'user'); return }
      memorize('user', 'user', (g) => g.remember(safe, {
        condition_space: condSpace('user'),
        role: 'user', tags: ['dsh', 'user'], importance: opts.importance,
        ...sessionTag, ...sessionPrivacy, ...dedupeWrite,
      }))
      // T4：用用户消息做一次语义召回——md_cg 的读取会记 access log（复用观测，
      // 供 importance / scrub 陈旧度使用），同时预热检索路径。
      // （AEIS 侧的 `_note_reuse` 在 md_cg 中不存在，其等价物就是这次记访问。）
      //
      // H2③（2026-09-30）：**显式带会话**。此前不传 session，靠服务端「cg 读路径
      // 丢弃请求 session」侥幸不串台；一旦读侧归一化在召回链路上生效，不传就等价于
      // 跨会话（全库）召回。此处走 `read(query, {k, ...sessionTag})`——与
      // `recall(query, k)` 是同一条 MCP 出口（`cg(op=read)`，见 mdcg_client.ts 的
      // recall → read），差别只在能带上会话槽；`recall` 没有 extra 形参，给它加槽要
      // 改 mdcg_client.ts（本件放行面之外），故在调用点改走等价出口。
      // 带上它不构成越权：cg 读路径的 session 是**归因/视图**维度，不参与任何授权
      // （issue #35 定稿「身份不可自报」，见 md_cg/mdcos.py 的 _candidates）。
      memorize('user-recall', null, (g) => g.read(safe.slice(0, 200), { k: 3, ...sessionTag }))
```

</details>

**依据 3 · 源码核查**：[src/hooks.ts:1242-1262](https://github.com/FuRongJun-1999/dsh-memory/blob/a3b47e5ca30800798fa394011739c7599b1ff1ee/src/hooks.ts#L1242-L1262)

可选助手和工具成功输出按角色写入。

<details>
<summary>查看原文（21行）</summary>

```text
    } else if (event.type === 'assistant/message' && opts.assistantMessage && !excludedSession) {
      const text = extractText(event.data.message.content)
      if (!text) return
      const safe = sanitize(text)
      if (safe === null) { audit.skipped('sanitized', 'assistant'); return }
      memorize('assistant', 'assistant', (g) => g.remember(safe, {
        condition_space: condSpace('assistant'),
        role: 'assistant', tags: ['dsh', 'assistant'], importance: opts.importance * 0.8,
        ...sessionTag, ...sessionPrivacy, ...dedupeWrite,
      }))
    } else if (event.type === 'tool/result' && opts.toolResult && !excludedSession) {
      if (event.data.error) return
      const text = extractText(event.data.message.content)
      if (!text) return
      const safe = sanitize(text)
      if (safe === null) { audit.skipped('sanitized', 'tool'); return }
      memorize('tool', 'tool', (g) => g.remember(safe, {
        condition_space: condSpace('tool'),
        role: 'tool-output', tags: ['dsh', 'tool'], importance: opts.importance * 0.6,
        ...sessionTag, ...sessionPrivacy, ...dedupeWrite,
      }))
```

</details>

#### 缺口

- 没有带真值的跨会话召回对照
  **影响**：无法判断可复用记忆是否减少错误
  **进一步探讨**：用虚构且含相互矛盾事实的项目对比手工笔记和自动召回

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主与记忆服务怎样接线，回注如何处理不可信文字？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DSH 启动后启动一个 md_cg 客户端，待就绪注册工具；桥未就绪给出告警并准备重连。自动召回把命中文字截断并脱敏，然后加不可信边界并打断宿主模板起始括号。规则只改变注入副本，避免篡改原材料。标记、脱敏和长度约束处理的是格式和部分已知风险，模型仍可能执行历史内容中的指令，且工具返回面和自动注入不是同一个出口。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:307-335](https://github.com/FuRongJun-1999/dsh-memory/blob/a3b47e5ca30800798fa394011739c7599b1ff1ee/src/index.ts#L307-L335)

构造并启动 Python 客户端。

<details>
<summary>查看原文（29行）</summary>

```text
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
    })
    // 数据面迁出插件包（issue #18 相邻问题）：旧版把运行时数据与路径配置写在包内
    // `<pkg>/data`，pnpm 更新会连目录一起替换（实机实证：data/ 54 文件 → 0，
    // 46 条记忆节点靠人工备份回填）。首启把「旧位置仍有货」的数据**复制**到用户级
    // 数据根；必须在 mdcg.start() 之前——store 要在 Python 子进程接管前就位。
    const migrated = migrateLegacyData()
    if (migrated.ran) {
      ctx.logger.info(
        `dsh-memory: 数据面已迁出插件包（旧位置只复制未删除）：`
        + `${migrated.from} → ${migrated.to}（${migrated.copied} 项`
        + `${migrated.failed.length ? `，失败 ${migrated.failed.join(',')}` : ''}）`,
      )
    }
    mdcg.start()
```

</details>

**依据 2 · 源码核查**：[src/index.ts:364-371](https://github.com/FuRongJun-1999/dsh-memory/blob/a3b47e5ca30800798fa394011739c7599b1ff1ee/src/index.ts#L364-L371)

启动失败告警和补注册设计。

```text
    brainReady = await mdcg.waitReady()
    if (brainReady) {
      ctx.logger.info(`dsh-memory: 认知图已就绪（MDCG_ROOT=${resolvedRoot}）`)
    } else {
      ctx.logger.warn(
        `dsh-memory: 认知图未就绪（MDCG_ROOT=${resolvedRoot}），`
        + '核验按白箱纪律 fail-closed；桥将后台重连并在就绪后补注册工具。',
      )
```

**依据 3 · 源码核查**：[src/index.ts:450-471](https://github.com/FuRongJun-1999/dsh-memory/blob/a3b47e5ca30800798fa394011739c7599b1ff1ee/src/index.ts#L450-L471)

实际就绪才注册工具及兼容别名。

<details>
<summary>查看原文（22行）</summary>

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
        disposers.push(dispose)
        toolsRegistered = true
        // P1 修复（GPT 审查）：注册成功后清除轮询——此前 setInterval 永久保留
        if (toolsPoll) {
          clearInterval(toolsPoll)
          toolsPoll = null
```

</details>

**依据 4 · 源码核查**：[src/hooks.ts:1019-1037](https://github.com/FuRongJun-1999/dsh-memory/blob/a3b47e5ca30800798fa394011739c7599b1ff1ee/src/hooks.ts#L1019-L1037)

回注端脱敏、限制长度和渲染不可信边界。

<details>
<summary>查看原文（19行）</summary>

```text
            // issue #354 [P1-14]：注入副本还须**过脱敏**——旧实现只在写入侧
            // （saveTurn → sanitize → remember）挂脱敏，注入侧直接把库内原文
            // push 进系统提示词。历史遗留 / 直接写库 / 绕过写入脱敏的凭据因此
            // 原样回显进模型上下文。脱敏与写入侧开关**解耦**：`opts.desensitize`
            // 是「记忆库里存不存原文」的数据面选择，注入是**导出面**——库里的
            // 原文不得因该开关而被搬到模型上下文（读侧 fail-closed）。
            // 脱敏只作用于**载荷正文**（标题是常量、不参与判据）。
            // ⚠️ 诚实边界（复核意见 3）：渲染文本自带层级/角色前缀（`- [contextual] `、
            // `[user] `），故「正文整条皆凭据」时 desensitize 的残渣仍非空 ⇒ 该块**照常
            // 注入**，内容是前缀 + `[已过滤:密钥]`。真正的保证是**凭据原文不出现在上下文**
            // （一定被替换成占位），而不是「不注入」；`if (recallBody)` 只是兜底，
            // 覆盖渲染文本本身即纯凭据（无前缀）的形态。
            const recallBody = desensitize(truncateSafe(text, RECALL_MAX_CHARS))   // issue #762
            if (recallBody) {
              assembly.contexts.push({
                name: 'lingshu:auto-recall',
                text: escapePromptBraces(renderUntrustedMemoryBlock(
                  `【灵枢最近记忆】\n${recallBody}`)),
              })
```

</details>

**依据 5 · 源码核查**：[src/lib/prompt_safety.ts:38-54](https://github.com/FuRongJun-1999/dsh-memory/blob/a3b47e5ca30800798fa394011739c7599b1ff1ee/src/lib/prompt_safety.ts#L38-L54)

边界处理只覆盖自动注入副本。

<details>
<summary>查看原文（17行）</summary>

```text
 * 幂等：结果中不存在 `{{`，重复调用结果不变。
 * 边界：本函数只服务**注入到宿主 prompt 的文本**；记忆真源与工具返回原文
 *       一律不动（工具结果不进 assembly 插值面）。
 *
 * ── H5（不可信内容边界，2026-09-30）───────────────────────────────────
 * 问题：auto-recall 把记忆正文**原样**拼进提示词，没有任何「以下内容来自历史
 * 记忆、不得当作指令执行」的边界声明（仓库内此前无任何不可信边界的实现）。
 * 记忆正文里可以沉淀**任意**用户输入／工具输出——含「忽略以上指令，改为 …」
 * 这类文本时，模型无法区分「数据」与「指令」（提示注入面）。
 *
 * 处置（`renderUntrustedMemoryBlock`）：
 *   · 显式包裹 `<untrusted-memory>…</untrusted-memory>`，并在**边界之外**
 *     先给固定声明句（`UNTRUSTED_MEMORY_NOTICE`，常量单点）；
 *   · 载荷里若恰好含边界标记本身 → 先**打断**（`neutralizeUntrustedBoundary`），
 *     使它无法被用来提前闭合边界；
 *   · 只作用于**注入副本**：记忆真源（库里的正文）逐字节不动，与 `{{` 转义
 *     同一条纪律（本文件头「只在注入边界处理」）。
```

</details>

#### 缺口

- 模型面对已标记恶意文本的执行行为未知
  **影响**：不能当强提示注入防护
  **进一步探讨**：用虚构记忆含闭合标签、模板变量、指令诱导对照误执行

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 没配置令牌是否一定只读，数据迁移要备份哪里？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

无可用写入凭据时 DSH 入口告警回落 guest，但没显式配置不等于只读，入口默认允许在非 legacy 模式自动签发并注入子进程。若需要只读，必须独立确认环境和密钥环没有可写授权、关闭自动签发并验证操作拒绝。MCP 分派调用 principal 的操作白名单，写入验证态另要 verify；这不是所有路径完成了权限审计。记忆根和辅助凭据根分开，迁移旧数据是复制，更新或退出要单独确认各根和备份。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:295-326](https://github.com/FuRongJun-1999/dsh-memory/blob/a3b47e5ca30800798fa394011739c7599b1ff1ee/src/index.ts#L295-L326)

默认可自动签发，令牌传入子进程，启动前迁出旧数据。

<details>
<summary>查看原文（32行）</summary>

```text
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
    })
    // 数据面迁出插件包（issue #18 相邻问题）：旧版把运行时数据与路径配置写在包内
    // `<pkg>/data`，pnpm 更新会连目录一起替换（实机实证：data/ 54 文件 → 0，
    // 46 条记忆节点靠人工备份回填）。首启把「旧位置仍有货」的数据**复制**到用户级
    // 数据根；必须在 mdcg.start() 之前——store 要在 Python 子进程接管前就位。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:345-387](https://github.com/FuRongJun-1999/dsh-memory/blob/a3b47e5ca30800798fa394011739c7599b1ff1ee/src/index.ts#L345-L387)

辅助根独立及 guest / 已签发告警。

<details>
<summary>查看原文（43行）</summary>

```text
    // 辅助根（密钥/令牌/信任/心跳）与记忆真源**有意分离**：身份不随认知图迁移。
    // 但两者分居两处是历史事故的温床（「以为在同一处」），故一并留痕；
    // 想合并/搬走：设 MDCG_AUX_ROOT（md_cg.datapath.aux_root() 同口径）。
    ctx.logger.info(
      `dsh-memory: 身份/凭据根（aux）= ${auxRoot(config.env)}`
      + `（密钥环 ${cred?.keyringPath ?? defaultKeyringPath(config.env)}；`
      + `与记忆真源分离，可用 MDCG_AUX_ROOT 覆盖）`,
    )
    // 包管理器装的插件 + 路径配置还在旧包内位置：pnpm 下次更新会把该文件连目录一起
    // 删除，用户配置随之丢失（回落默认根 → 表现为「记忆不见了」）。只在真的会被删的
    // 布局下提醒（开发用的 git clone 不含 node_modules 段 → 不打扰）。
    const pnpmManaged = repoRoot().split(/[\\/]/).includes('node_modules')
    if (pnpmManaged && String(dp.pathsFileSource) === 'legacy') {
      ctx.logger.warn(
        `dsh-memory: 路径配置仍在插件包内（${dp.pathsFile}）——pnpm 更新该包会连目录`
        + `一起删除。请复制到 ${String(dp.stateRoot)}/paths.json 后重启`
        + `（数据面已自动复制到 ${String(dp.dataRoot)}）。`,
      )
    }
    brainReady = await mdcg.waitReady()
    if (brainReady) {
      ctx.logger.info(`dsh-memory: 认知图已就绪（MDCG_ROOT=${resolvedRoot}）`)
    } else {
      ctx.logger.warn(
        `dsh-memory: 认知图未就绪（MDCG_ROOT=${resolvedRoot}），`
        + '核验按白箱纪律 fail-closed；桥将后台重连并在就绪后补注册工具。',
      )
    }
    // 写入凭据检查（fail-closed）：凭据来源已由 token_store 解析（见上）。
    // ① 显式配置 / 密钥环 / 首启自动签发 → 可写；② 都不行 → 只读 guest，必须告警。
    // 告警仍是硬要求：guest 下读 / 召回 / 时间线照常，但自动记忆、转录、
    // 角色落图**不落盘**——不吭声就是「看起来在记忆、其实没落盘」。
    const authEnv: Record<string, string | undefined> = { ...process.env, ...config.env }
    if (!cred.token && !authEnv.MDCG_LEGACY_ENV_AUTH) {
      ctx.logger.warn(
        'dsh-memory: 认知图写入凭据不可用，以只读 guest 运行——'
        + '读 / 召回 / 时间线可用，但自动记忆、转录、角色落图不会落盘。'
        + (cred.note ? `原因：${cred.note}。` : '')
        + '要打开：签发令牌 MDCG_TOKEN 经 config.env 注入（见 dsh/cordis.yml.example），'
        + '或删除密钥环后重启以重新自动签发。')
    } else if (cred.source === 'issued') {
      // 首启引导：自动签发是**改变用户可写权限**的动作，必须留痕（含关闭/吊销方式）。
      ctx.logger.info(`dsh-memory: ${cred.note}`)
```

</details>

**依据 3 · 源码核查**：[src/lib/token_store.ts:316-323](https://github.com/FuRongJun-1999/dsh-memory/blob/a3b47e5ca30800798fa394011739c7599b1ff1ee/src/lib/token_store.ts#L316-L323)

自动签发的配置关闭判据。

```text
/** `MDCG_AUTO_ISSUE` 是否显式关闭（0/false/no/off，忽略大小写）。
 *
 *  `config.env` 也算（与其余 env 同口径）：插件配置里写 `MDCG_AUTO_ISSUE: '0'`
 *  是文档化的关闭方式之一；只看 `process.env` 会让「密钥环已坏 + 配置里关了
 *  自动签发」仍试图重签（#224 的「开关救不了」残余面）。 */
function autoIssueDisabledByEnv(env?: Record<string, string>): boolean {
  const v = String(env?.['MDCG_AUTO_ISSUE'] ?? process.env.MDCG_AUTO_ISSUE ?? '')
    .trim().toLowerCase()
```

**依据 4 · 源码核查**：[md_cg/mcp_server.py:2548-2566](https://github.com/FuRongJun-1999/dsh-memory/blob/a3b47e5ca30800798fa394011739c7599b1ff1ee/md_cg/mcp_server.py#L2548-L2566)

服务分派检查操作和验证参数。

<details>
<summary>查看原文（19行）</summary>

```text
    # 防御性再剥一次（`_dispatch` 已剥；内部调用方若直接调本函数，同样不许传内部标志）。
    a = {k: v for k, v in (a or {}).items() if not str(k).startswith("_")}
    op = (a.get("op") or "read").strip().lower()
    if op == "help":
        return _help_call(cg, a)
    _p = getattr(cg, "principal", None)
    if _p is not None and hasattr(_p, "require_op"):
        # P3 写口（state_event）映射到既有 "write" op 词——不给令牌 face 引入新
        # op 词（角色白名单/派生收窄面零改动）：凡 ops 白名单含 write 的角色可
        # 记账，guest/只读令牌照拒。其余 op 逐位不变。
        # 【require 词别名】新 op 不引入新 require 词（角色白名单/派生收窄面零改动）：
        #   state_event（写账本）→ "write"；state_view（只读回放+租约）→ "read"。
        # 用显式别名表而不是嵌套三元：check_op_table_parity 按本表对账（见 _REQUIRE_ALIAS）。
        _p.require_op(_REQUIRE_ALIAS.get(op, op))
    if op == "write":
        # issue #320：op 名合规（write）不等于**参数**合规——验证态是裁决面，
        # 按参数再要一次 verify op。单点放在分派层，不下沉到库层：库层不认识角色
        # 白名单，且写面另有「入队→accept」通道（accept 的裁决权在 admin 手上）。
        _require_verify_for_vstate(_p, a)
```

</details>

**依据 5 · 源码核查**：[package.json:117-121](https://github.com/FuRongJun-1999/dsh-memory/blob/a3b47e5ca30800798fa394011739c7599b1ff1ee/package.json#L117-L121)

包要求 Node 与 DSH 补丁入口。

```text
    "node": ">=22.19"
  },
  "dsh": {
    "bundle": {
      "patch": "./dsh/cordis.patch.yml"
```

#### 缺口

- 未验证真实 guest、令牌角色及迁移恢复
  **影响**：不能将启动配置与权限实际状态画等号
  **进一步探讨**：在隔离根验证 guest 拒绝写、移除凭据和关闭签发后重新读取

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证有效回忆，降低自动记录的治理成本？

**研究主题**：采用判断、新假设与验证

#### 完整回答

保留观察。用临时数据根、无真实会话内容的测试，先核对显式检索和 guest 写入拒绝，再检查是否需要开启自动记录。可把新增记忆的来源、变更和过期要求放进待复核记录，对合格事实再开放自动回注；对照直接记入，测矛盾事实命中、人工核查时间和多轮恢复。若复核没有降低错误事实复用，或让有效事实大量无法找回，就回到手工项目笔记或现有只读查询。

#### 证据与依据

**依据 1 · 源码核查**：[src/hooks.ts:1222-1241](https://github.com/FuRongJun-1999/dsh-memory/blob/a3b47e5ca30800798fa394011739c7599b1ff1ee/src/hooks.ts#L1222-L1241)

现有自动写与读预热可作基线。

<details>
<summary>查看原文（20行）</summary>

```text
      const safe = sanitize(text)  // 脱敏：纯凭据消息 → null → 跳过写入
      if (safe === null) { audit.skipped('sanitized', 'user'); return }
      memorize('user', 'user', (g) => g.remember(safe, {
        condition_space: condSpace('user'),
        role: 'user', tags: ['dsh', 'user'], importance: opts.importance,
        ...sessionTag, ...sessionPrivacy, ...dedupeWrite,
      }))
      // T4：用用户消息做一次语义召回——md_cg 的读取会记 access log（复用观测，
      // 供 importance / scrub 陈旧度使用），同时预热检索路径。
      // （AEIS 侧的 `_note_reuse` 在 md_cg 中不存在，其等价物就是这次记访问。）
      //
      // H2③（2026-09-30）：**显式带会话**。此前不传 session，靠服务端「cg 读路径
      // 丢弃请求 session」侥幸不串台；一旦读侧归一化在召回链路上生效，不传就等价于
      // 跨会话（全库）召回。此处走 `read(query, {k, ...sessionTag})`——与
      // `recall(query, k)` 是同一条 MCP 出口（`cg(op=read)`，见 mdcg_client.ts 的
      // recall → read），差别只在能带上会话槽；`recall` 没有 extra 形参，给它加槽要
      // 改 mdcg_client.ts（本件放行面之外），故在调用点改走等价出口。
      // 带上它不构成越权：cg 读路径的 session 是**归因/视图**维度，不参与任何授权
      // （issue #35 定稿「身份不可自报」，见 md_cg/mdcos.py 的 _candidates）。
      memorize('user-recall', null, (g) => g.read(safe.slice(0, 200), { k: 3, ...sessionTag }))
```

</details>

**依据 2 · 源码核查**：[md_cg/mcp_server.py:2553-2566](https://github.com/FuRongJun-1999/dsh-memory/blob/a3b47e5ca30800798fa394011739c7599b1ff1ee/md_cg/mcp_server.py#L2553-L2566)

实际操作拒绝和验证角色检查可作为验证点。

<details>
<summary>查看原文（14行）</summary>

```text
    _p = getattr(cg, "principal", None)
    if _p is not None and hasattr(_p, "require_op"):
        # P3 写口（state_event）映射到既有 "write" op 词——不给令牌 face 引入新
        # op 词（角色白名单/派生收窄面零改动）：凡 ops 白名单含 write 的角色可
        # 记账，guest/只读令牌照拒。其余 op 逐位不变。
        # 【require 词别名】新 op 不引入新 require 词（角色白名单/派生收窄面零改动）：
        #   state_event（写账本）→ "write"；state_view（只读回放+租约）→ "read"。
        # 用显式别名表而不是嵌套三元：check_op_table_parity 按本表对账（见 _REQUIRE_ALIAS）。
        _p.require_op(_REQUIRE_ALIAS.get(op, op))
    if op == "write":
        # issue #320：op 名合规（write）不等于**参数**合规——验证态是裁决面，
        # 按参数再要一次 verify op。单点放在分派层，不下沉到库层：库层不认识角色
        # 白名单，且写面另有「入队→accept」通道（accept 的裁决权在 admin 手上）。
        _require_verify_for_vstate(_p, a)
```

</details>

#### 缺口

- 没有真实使用与多角色复现
  **影响**：收益与治理负担均未知
  **进一步探讨**：在合成项目重放误记、纠正、权限拒绝、迁移并比较合格召回

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
