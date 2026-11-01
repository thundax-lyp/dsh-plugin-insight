# 灵枢 dsh-memory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9a9594a](https://github.com/FuRongJun-1999/dsh-memory/tree/9a9594a29f544f19efe93269a9f9262ce1ab2812)

<!-- BEGIN META -->
[![GitHub ★ 560](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=560&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FuRongJun-1999/dsh-memory) [![npm 30d 26,517](https://img.shields.io/static/v1?label=npm+30d&message=26%2C517&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@furongjun1999/dsh-memory) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@furongjun1999/dsh-memory)
<!-- END META -->

> **功能**：将 Markdown 认知图和自动召回接入 DSH 长期记忆。

> **亮点**：把本地认知图、写入回执和宿主召回接线组合为长期记忆流程。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：committed 不证明事实正确；session ID 缺失可能退回全局窗口，启用 identity 的跨会话视图也需理解。[Q03](#research-q03)

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
  - [Q01 · 它为谁解决什么，如何比较人工记忆？](#detail-section-11)
  - [Q02 · DSH 入口怎样连接召回与提交？](#detail-section-12)
  - [Q03 · 可审计回执是否意味着正确和会话隔离？](#detail-section-13)
  - [Q04 · 怎样采用并验证不把状态当事实？](#detail-section-14)
  - [Q05 · 怎样检验记忆来源与隔离提示的价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要跨会话保留项目事实和偏好的 DSH 用户；基线是人工维护 Markdown 并显式检索。[Q01](#research-q01)

手工维护 AGENTS.md 或 Markdown，按需检索并核对。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 图记忆 | 保存事实与偏好 | 写入需凭据及回执 |
| 自动召回 | 注入相关背景 | 会话缺失或身份块有不同范围 |
| 只读降级 | 保留查询能力 | 自动记忆不落盘 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容 DSH 宿主 | 必需 | 事件与注入 | 无宿主自动召回 |
| 认知图与桥 | 记忆必需 | 存储与检索 | 工具不可用 |
| 写入凭据 | 自动记忆必需 | 落盘 | 只读 guest |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 隔离项目及权限 | 核对只读/写入 |
| 写入 | 使用非敏感事实 | 查看回执与文件 |
| 召回 | 对照会话与原始事实 | 错归属时停止注入 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 后端及磁盘资源 | 凭据和路径配置 | 宿主兼容未测 |
| 持续 | 存储及模型上下文 | 复核过期事实 | 节时未测 |
| 恢复 | 备份与清理资源 | 核查会话与读回 | 删除完整性未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 长期记忆 | 工具与自动召回接线 | 内容事实正确 |
| 会话区分 | 有 session ID 时限定普通召回 | 所有注入严格隔离 |

> **思考**：committed 不证明事实正确；session ID 缺失可能退回全局窗口，启用 identity 的跨会话视图也需理解。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把本地认知图、写入回执和宿主召回接线组合为长期记忆流程。[Q01](#research-q01) [Q02](#research-q02)

缺写凭据降级只读；普通召回取会话 ID，缺失时警告，identity 可选择跨会话注入。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

committed 不证明事实正确；session ID 缺失可能退回全局窗口，启用 identity 的跨会话视图也需理解。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离项目验证凭据、回执、文件和会话召回；错误或串扰时停止自动注入。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持工具注册、召回、只读降级和会话警告；未运行 DSH 或记忆后端。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/hooks.ts、md_cg/mcp_server.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 1548 个指定扩展名文件、无排除与解析错误；静态核查代表注册、写回执及召回，不运行宿主。
- 下一步：固定宿主及后端，验证只读、回执、读回、session 缺失和跨会话注入。

**分析版本**

- **仓库**：[FuRongJun-1999/dsh-memory](https://github.com/FuRongJun-1999/dsh-memory)
- **版本号**：0.9.21（[固定提交 9a9594a](https://github.com/FuRongJun-1999/dsh-memory/tree/9a9594a29f544f19efe93269a9f9262ce1ab2812)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：展示来源、确认时间、会话范围与读回状态可减少错误记忆使用；须测误报和隐私。[Q05](#research-q05)

固定宿主及后端，验证只读、回执、读回、session 缺失和跨会话注入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1465 | 189205 | — | — | 3532438 |
| .mjs | source | 4 | 318 | 274 | 39 | — |
| .ts | source | 16 | 6914 | 4231 | 2405 | — |
| .ts | test | 58 | 9439 | 7083 | 1600 | — |
| .md | test | 1 | 73 | — | — | 1065 |
| .js | source | 4 | 187 | 184 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/FuRongJun-1999/dsh-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 284](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=284&color=737b86&logo=github)](https://github.com/FuRongJun-1999/dsh-memory/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 277](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=277&color=737b86&logo=github)](https://github.com/FuRongJun-1999/dsh-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 长期记忆如何注册、提交和召回，事实与会话边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它为谁解决什么，如何比较人工记忆？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

灵枢是面向跨会话保留项目事实与偏好的长期记忆基础设施，DSH 插件将认知图工具及召回接入宿主；作者称可通过 MCP 接入其他 Agent。基线是人工维护 AGENTS.md/Markdown 并显式检索。存储和可审计回执帮助组织记忆，但不能证明事实长期正确、自动提取质量或节省时间。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:19-22](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/README.md#L19-L22)

作者对长期记忆和异步落盘的描述。

```text
**灵枢是一套可运行的长期记忆基础设施**——对话自动沉淀为纯文本 md 认知图，记什么、取什么、能不能写入全部由确定性规则裁决，全程可审计、结果可复现。它不训练模型，做的是**模型之外的那一整套**：记忆怎么存、取的时候依据什么、写错了怎么被发现、改过怎么留痕。任何支持 MCP 的 AI Agent 可直接挂载，不与任何单一 Agent 框架绑定。

> **装不起来 / 看到奇怪的告警？** 先看 [环境与已知问题](https://github.com/FuRongJun-1999/dsh-memory/blob/main/docs/ops/%E7%8E%AF%E5%A2%83%E4%B8%8E%E5%B7%B2%E7%9F%A5%E9%97%AE%E9%A2%98.md)——
> DSH Desktop 的启动告警、体积与整目录耦合、异步落盘、以及五条「看起来像 bug 其实是契约」的设计取舍都在那里。
```

**依据 2 · 源码核查**：[package.json:1-5](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/package.json#L1-L5)

DSH 包身份及版本。

```text
{
  "name": "@furongjun1999/dsh-memory",
  "version": "0.9.21",
  "description": "灵枢（Lingshu·líng shū）DeepSeek Harness 插件：完整大脑——长期记忆/知识飞轮/自我认知/递归反思接入 DSH，对话自动沉淀进 md_cg 认知图（md 文档）",
  "type": "module",
```

**依据 3 · 源码核查**：[src/index.ts:435-469](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/src/index.ts#L435-L469)

就绪后工具注册和记忆 hooks。

<details>
<summary>查看原文（35行）</summary>

```text
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
        }
        ctx.logger.info('dsh-memory: 灵枢工具已注册（就绪后补注册）')
      }
      catch (err) {
        ctx.logger.warn(`dsh-memory: 工具注册失败，稍后重试: ${String(err)}`)
      }
    }
    if (brainReady) await tryRegister()
    if (!toolsRegistered) {
      toolsPoll = setInterval(() => { void tryRegister() }, 2000)
      disposers.push(() => { if (toolsPoll) clearInterval(toolsPoll) })
    }
    // 自动记忆：沉淀进 md_cg 认知图（记忆唯一真源）。mdcg=null 时整体停用。
    disposers.push(installMemoryHooks(ctx, mdcg, config.memory))
```

</details>

#### 缺口

- 未运行 DSH、认知图或真实会话
  **影响**：不能证明落盘、会话隔离、事实正确和召回效果
  **进一步探讨**：隔离项目验证回执、磁盘读回与不同会话召回

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 入口怎样连接召回与提交？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

插件默认 autoRecall 开启、identity 关闭，桥就绪后注册 cg/stg 等工具并安装 memory hooks；无写入凭据时以只读 guest 运行，读与召回可用而自动记忆不落盘。system prompt 装配从当前 host session 取 ID 并限定普通召回，格式化内容做脱敏；可选 identity 另用跨会话视图。代码支持这些路径，并不证明目标宿主确实调用或写入。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:170-183](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/src/index.ts#L170-L183)

默认召回与身份配置。

<details>
<summary>查看原文（14行）</summary>

```text
  charter: z.string().default('v2.0-published'),
  memory: z
    .object({
      userMessage: z.boolean().default(true),
      assistantMessage: z.boolean().default(false),
      toolResult: z.boolean().default(false),
      importance: z.number().default(0.6),
      autoRecall: z.boolean().default(true),
      autoRecallLimit: z.number().default(4),
      /** issue #635：self/anchor 层单列「身份锚点」块（默认 false = 维持既有行为）。 */
      autoRecallIdentity: z.boolean().default(false),
      /** 逢十轮提醒（纪律第 16 条；issue #645）：缺省 10 = 每 10 个真实用户回合；
       *  false = 关闭；数字 = 自定义间隔（1~100）。 */
      turnReminder: z.union([z.boolean(), z.number()]).default(10),
```

</details>

**依据 2 · 源码核查**：[src/index.ts:355-368](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/src/index.ts#L355-L368)

缺写凭据的只读降级。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/index.ts:435-469](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/src/index.ts#L435-L469)

桥注册和 hooks。

<details>
<summary>查看原文（35行）</summary>

```text
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
        }
        ctx.logger.info('dsh-memory: 灵枢工具已注册（就绪后补注册）')
      }
      catch (err) {
        ctx.logger.warn(`dsh-memory: 工具注册失败，稍后重试: ${String(err)}`)
      }
    }
    if (brainReady) await tryRegister()
    if (!toolsRegistered) {
      toolsPoll = setInterval(() => { void tryRegister() }, 2000)
      disposers.push(() => { if (toolsPoll) clearInterval(toolsPoll) })
    }
    // 自动记忆：沉淀进 md_cg 认知图（记忆唯一真源）。mdcg=null 时整体停用。
    disposers.push(installMemoryHooks(ctx, mdcg, config.memory))
```

</details>

**依据 4 · 源码核查**：[src/hooks.ts:839-884](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/src/hooks.ts#L839-L884)

会话 ID 和普通召回。

<details>
<summary>查看原文（46行）</summary>

```text
    // 关掉自动召回不该让它只写不读；召回部分在内部按 opts.autoRecall 门控。
    const recallLimit = Math.max(1, Math.min(10, opts.autoRecallLimit || 4))
    ctx.on('system-prompt/assemble', async (assembly, _ctx, next) => {
      try {
        // 异步取最近记忆节点（失败静默——不阻塞模型请求）
        // 会话标识：门控内外都要用（提醒消费 + 自动召回），故先解析。
        const hostCtx = (_ctx as unknown) as { agent?: { session?: unknown } } | undefined
        const sid = sessionIdOf(hostCtx?.agent?.session)
          || (observedSession ? currentSession() : '')
        // 会话 id 为空时后端会退回全局滚动窗口（跨会话串台）。只告警一次，
        // 避免每个 assemble step 刷日志；不改注入内容或数据路径。
        if (!sid && !warnedEmptySid) {
          warnedEmptySid = true
          ctx.logger.warn('dsh-memory: 会话 id 为空，短期窗口可能退回全局滚动窗口（跨会话串台）；请检查 host.agent.session 或会话观测是否可用')
        }
        // 逢十轮提醒的消费面（#657）：不受 autoRecall 门控。
        if (sid) {
          const pending = pendingReminder.get(sid)
          if (pending) {
            pendingReminder.delete(sid)
            assembly.contexts.push({ name: 'lingshu:turn-reminder', text: pending })
            // issue #659 F26-24：消费点留一条日志（旧实现完全静默——「提醒到底有没有
            // 注入过」只能靠翻上下文猜）。
            ctx.logger.info('dsh-memory: 逢十轮提醒已注入（消费一次，不重推）')
          }
        }
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
            recallLimit,
            sid ? { session: sid } : {})
```

</details>

**依据 5 · 源码核查**：[src/hooks.ts:920-933](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/src/hooks.ts#L920-L933)

脱敏与注入。

<details>
<summary>查看原文（14行）</summary>

```text
            // 脱敏只作用于**载荷正文**（标题是常量、不参与判据）。
            // ⚠️ 诚实边界（复核意见 3）：渲染文本自带层级/角色前缀（`- [contextual] `、
            // `[user] `），故「正文整条皆凭据」时 desensitize 的残渣仍非空 ⇒ 该块**照常
            // 注入**，内容是前缀 + `[已过滤:密钥]`。真正的保证是**凭据原文不出现在上下文**
            // （一定被替换成占位），而不是「不注入」；`if (recallBody)` 只是兜底，
            // 覆盖渲染文本本身即纯凭据（无前缀）的形态。
            const recallBody = desensitize(text.slice(0, RECALL_MAX_CHARS))
            if (recallBody) {
              assembly.contexts.push({
                name: 'lingshu:auto-recall',
                text: escapePromptBraces(renderUntrustedMemoryBlock(
                  `【灵枢最近记忆】\n${recallBody}`)),
              })
            }
```

</details>

#### 缺口

- 未运行 DSH、认知图或真实会话
  **影响**：不能证明落盘、会话隔离、事实正确和召回效果
  **进一步探讨**：隔离项目验证回执、磁盘读回与不同会话召回

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 可审计回执是否意味着正确和会话隔离？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

写入返回 committed 等字段可区分成功与拒绝，但落盘不证明事实正确、用户授权或后续可召回。hooks 在宿主 session ID 为空时记录可能退回全局滚动窗口的警告；可选 identity 设计上不传会话过滤，因此不应假设所有注入严格按会话隔离。召回和会话窗口异常可跳过并记录，不能将缺失注入解释成不存在记忆。

#### 证据与依据

**依据 1 · 源码核查**：[md_cg/mcp_server.py:4285-4297](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/md_cg/mcp_server.py#L4285-L4297)

写入回执包含 committed。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 2 · 源码核查**：[src/hooks.ts:845-853](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/src/hooks.ts#L845-L853)

会话 ID 缺失及警告。

```text
        const hostCtx = (_ctx as unknown) as { agent?: { session?: unknown } } | undefined
        const sid = sessionIdOf(hostCtx?.agent?.session)
          || (observedSession ? currentSession() : '')
        // 会话 id 为空时后端会退回全局滚动窗口（跨会话串台）。只告警一次，
        // 避免每个 assemble step 刷日志；不改注入内容或数据路径。
        if (!sid && !warnedEmptySid) {
          warnedEmptySid = true
          ctx.logger.warn('dsh-memory: 会话 id 为空，短期窗口可能退回全局滚动窗口（跨会话串台）；请检查 host.agent.session 或会话观测是否可用')
        }
```

**依据 3 · 源码核查**：[src/hooks.ts:881-898](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/src/hooks.ts#L881-L898)

身份锚点的跨会话视图。

<details>
<summary>查看原文（18行）</summary>

```text
          const identityOn = opts.autoRecallIdentity === true
          const timelinePayload = await graph.timeline(
            recallLimit,
            sid ? { session: sid } : {})
          // issue #715（2026-10-30 外部报告，逐行复现）：**身份块必须单独取数**。
          //
          // 病灶：此前身份块复用上面这份**带会话过滤**的 payload（还把 limit 加 3 试图
          // 「多取 3 条」），但 `self`/`anchor` 节点的 `session` **恒为 `unattributed`**
          // ——身份锚点在语义上就注定跨会话（`identity` 写入不带 session_id 时即如此，
          // 状态卡与关系节点同理）。两者叠加 ⇒ 永久层被会话过滤全部滤掉 ⇒
          // `renderIdentityAnchors` 拿到空集 ⇒ **块从不出现且无任何报错**（静默失效）。
          //
          // 这正是《身份与人格》理论的 R3：**人格的可见性不该由会话决定**。
          // 用会话过滤去筛人格节点是**类别错误**，不是参数没调好。
          //
          // 故身份块改为**不带会话过滤**取数（不传 session ⇒ 跨会话视图），
          // 再由 `renderIdentityAnchors` 只挑 self/anchor（其余层照样被它跳过）。
          // 「最近记忆」块保持会话隔离不变——那是工作记忆，本就该跟会话走。
```

</details>

**依据 4 · 源码核查**：[src/hooks.ts:966-994](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/src/hooks.ts#L966-L994)

会话窗口与失败跳过。

<details>
<summary>查看原文（29行）</summary>

```text
          // 门控 = 注入面总开关 autoRecall（本 handler 的注册条件）× 本机制开关
          // contextWindow.enabled。
          if (cwEnabled) {
            try {
              const win = await graph.sessionRecall(sid, cwTurns, WINDOW_BUDGET_TOKENS)
              // issue #712：传 sid 用于**标注**（本会话/其他会话），不用于过滤。
              const winText = formatSessionWindow(win, cwTurns, { session: sid })
              if (winText) {
                // 注入边界同规（文件头硬约束）：不可信内容边界 + `{{` 转义，
                // 都只改注入副本——窗口原文在库内保真。
                // issue #354 [P1-14] 同族：窗口块也是注入面，同样过脱敏（理由与
                // 诚实边界见上方 auto-recall 块）——渲染文本自带 `[role] ` 前缀，
                // 故「整条皆凭据」时该块仍会注入，但凭据原文一定被替换成占位。
                const winSafe = desensitize(winText)
                if (winSafe) {
                  assembly.contexts.push({
                    name: 'lingshu:session-window',
                    text: escapePromptBraces(renderUntrustedMemoryBlock(
                      `【本会话近期对话】\n${winSafe}`)),
                  })
                }
              }
            } catch (err) {
              // issue #128（2026-10-12）：**空 catch 改为显式回报**。此前这里是
              // 一个静默空 catch——窗口取数失败（含桥未实现该方法、
              // session_recall 报错）在盘面与日志面**双双无痕**，与「本会话确实
              // 没有近期对话」不可分辨（自动召回块「从未注入成功」正是靠这个
              // 静默吞掉的）。失败仍不得越过会话流边界（不抛），但必须留痕。
              ctx.logger.warn(`dsh-memory: 本会话窗口注入失败（已跳过该块）: ${redactForLog(err)}`)
```

</details>

#### 缺口

- 未运行 DSH、认知图或真实会话
  **影响**：不能证明落盘、会话隔离、事实正确和召回效果
  **进一步探讨**：隔离项目验证回执、磁盘读回与不同会话召回

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样采用并验证不把状态当事实？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

需要兼容 DSH、认知图后端及适当读写凭据；本地 Markdown、会话和日志仍有隐私与清理成本。先用隔离项目和非敏感事实，核对 token 权限、提交回执、文件读回和跨会话检索；发现写入失败、串会话或过期事实时停止自动注入并修正。self/anchor 默认不自动召回，升级兼容别名与客户端硬编码也需核对。真实成本、正确率及删除完整性未测。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:355-368](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/src/index.ts#L355-L368)

只读 guest 降级。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[README.md:24-36](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/README.md#L24-L36)

工具重命名与兼容别名的作者说明。

<details>
<summary>查看原文（13行）</summary>

```text
## ⚠️ 升级须知：工具名去掉 lingshu_ 前缀（0.9.9 起）

| 版本 | 工具名 |
|---|---|
| ≤ 0.9.8 | lingshu_cg / lingshu_stg / lingshu_mdcg_reflect |
| ≥ 0.9.9 | cg / stg / mdcg_reflect（与 MCP 服务同名） |

**BREAKING**：升级瞬间**已存在**的会话/Agent 编排里，按旧名硬编码的调用会变成 unknown tool，
而宿主与插件日志都显示「注册成功」——报错只在调用方出现。

**迁移**：把调用里的 lingshu_ 前缀删掉即可（lingshu_cg → cg）。
**兼容**：0.9.12 起默认**同时注册** lingshu_* 兼容别名（指向同一实现，描述标「已弃用别名」）；
需要「只要裸名」的部署可设 toolAliases: false；别名计划在一个 minor 周期后移除。
```

</details>

**依据 3 · 源码核查**：[README.md:40-50](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/README.md#L40-L50)

身份层默认与显式召回。

<details>
<summary>查看原文（11行）</summary>

```text
## 🧭 身份事实写在哪（issue #635）

**self / anchor 层默认不参与自动召回**——它们是永久层，按需用 mdcg_recall / stg 显式取。
如果你希望模型「一开口就知道自己是谁」，有四种落地方式：

| 方式 | 做法 | 适用 |
|---|---|---|
| ① 开身份块 | memory.autoRecallIdentity: true（0.9.12 起） | 想留在记忆层、又要自动注入 |
| ② 换层 | 把身份事实写进 structural / knowledge 层 | 不需要改配置 |
| ③ 宿主兜底 | 写进 AGENTS.md / persona 配置 | 升级不会丢，但不属于记忆层 |
| ④ 显式召回 | 需要时调 mdcg_recall / stg(op=timeline) | 完全可控，不占系统提示词预算 |
```

</details>

#### 缺口

- 未运行 DSH、认知图或真实会话
  **影响**：不能证明落盘、会话隔离、事实正确和召回效果
  **进一步探讨**：隔离项目验证回执、磁盘读回与不同会话召回

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样检验记忆来源与隔离提示的价值？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设：将记忆来源、最后确认时间、会话范围和提交/读回状态随召回展示，可降低过期事实与错归属误用。已有 committed 回执、脱敏和 session 缺失警告是反证；额外展示仍不能证明事实真伪，并可能泄露身份元数据。对照现有 hooks 和人工笔记，用失效事实、缺 session ID、只读凭据及召回失败样本测误用、识别率、时间和隐私成本；效果不足则否定。

#### 证据与依据

**依据 1 · 源码核查**：[md_cg/mcp_server.py:4285-4297](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/md_cg/mcp_server.py#L4285-L4297)

已有 committed 回执。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 2 · 源码核查**：[src/hooks.ts:845-853](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/src/hooks.ts#L845-L853)

已有会话缺失警告。

```text
        const hostCtx = (_ctx as unknown) as { agent?: { session?: unknown } } | undefined
        const sid = sessionIdOf(hostCtx?.agent?.session)
          || (observedSession ? currentSession() : '')
        // 会话 id 为空时后端会退回全局滚动窗口（跨会话串台）。只告警一次，
        // 避免每个 assemble step 刷日志；不改注入内容或数据路径。
        if (!sid && !warnedEmptySid) {
          warnedEmptySid = true
          ctx.logger.warn('dsh-memory: 会话 id 为空，短期窗口可能退回全局滚动窗口（跨会话串台）；请检查 host.agent.session 或会话观测是否可用')
        }
```

**依据 3 · 源码核查**：[src/hooks.ts:920-933](https://github.com/FuRongJun-1999/dsh-memory/blob/9a9594a29f544f19efe93269a9f9262ce1ab2812/src/hooks.ts#L920-L933)

已有脱敏注入。

<details>
<summary>查看原文（14行）</summary>

```text
            // 脱敏只作用于**载荷正文**（标题是常量、不参与判据）。
            // ⚠️ 诚实边界（复核意见 3）：渲染文本自带层级/角色前缀（`- [contextual] `、
            // `[user] `），故「正文整条皆凭据」时 desensitize 的残渣仍非空 ⇒ 该块**照常
            // 注入**，内容是前缀 + `[已过滤:密钥]`。真正的保证是**凭据原文不出现在上下文**
            // （一定被替换成占位），而不是「不注入」；`if (recallBody)` 只是兜底，
            // 覆盖渲染文本本身即纯凭据（无前缀）的形态。
            const recallBody = desensitize(text.slice(0, RECALL_MAX_CHARS))
            if (recallBody) {
              assembly.contexts.push({
                name: 'lingshu:auto-recall',
                text: escapePromptBraces(renderUntrustedMemoryBlock(
                  `【灵枢最近记忆】\n${recallBody}`)),
              })
            }
```

</details>

#### 缺口

- 未运行 DSH、认知图或真实会话
  **影响**：不能证明落盘、会话隔离、事实正确和召回效果
  **进一步探讨**：隔离项目验证回执、磁盘读回与不同会话召回

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
