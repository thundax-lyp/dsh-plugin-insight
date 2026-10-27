# ReMe DSH集成

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[363e497](https://github.com/agentscope-ai/ReMe/tree/363e497ae96733271414ea4224e274e5de5e5253/integrations/dsh)

<!-- BEGIN META -->
[![GitHub ★ 3,683](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C683&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/agentscope-ai/ReMe) [![npm 30d 1,949](https://img.shields.io/static/v1?label=npm+30d&message=1%2C949&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@agentscope-ai/reme-dsh-plugin) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@agentscope-ai/reme-dsh-plugin)
<!-- END META -->

> **功能**：为DSH提供长期记忆检索、会话自动归档、每日整理与状态页面。

> **亮点**：相对每次手工粘贴历史，它把检索入口与完成轮次归档接入会话事件；相对整包记忆注入，只注入指引、按需search减少无关历史进入上下文的机会。durable outbox把暂时服务离线与会话交互分开，是桥接层具体增量；记忆质量主要仍属于ReMe服务和模型，不归功于适配器。 依据[Q03](#research-q03)。

> **主要限制**：关键质疑是自动归档会否把不完整回答长期化，以及未知网络结果会否重复写入。runtime允许max-tokens轮次入队。进一步核查同仓库服务端后确认，auto_memory按session_id与request_id哈希保存输入fingerprint及成功回执，已有同输入回执可重放、不同输入被拒绝；因此不能说服务端幂等全无材料。但执行顺序是先await _execute，再写成功回执，记忆写入与完成回执之间不是一个原子事务，进程在两者之间崩溃时仍需验证是否会再次执行。本轮只指出静态窗口，未复现重复事实。HTTP无API-key鉴权也要求可信网络。 依据[Q04](#research-q04)。

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
  - [Q01 · 谁在什么场景需要它，合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、处理链及状态如何实现？](#detail-section-12)
  - [Q03 · 相对简单替代的实质增量是什么？](#detail-section-13)
  - [Q04 · 什么限制最可能使贡献不成立？](#detail-section-14)
  - [Q05 · 启动、持续与恢复依赖哪些条件？](#detail-section-15)
  - [Q06 · 全周期成本和实际效果支持到哪里？](#detail-section-16)
  - [Q07 · 实现有哪些可借鉴处和维护边界？](#detail-section-17)
  - [Q08 · 什么新假设值得验证，怎样推翻它？](#detail-section-18)
  - [Q09 · 对谁值得采用，何时停止？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向跨会话反复处理同一项目、需要追溯偏好和事实的DSH用户。原办法是手工维护Markdown并粘贴相关片段；合格结果应是能追溯原文的相关记忆，而非把所有旧会话自动当指令。组件路径integrations/dsh是实际DSH桥接，不能把Python根框架直接当同一插件安装。

相对每次手工粘贴历史，它把检索入口与完成轮次归档接入会话事件；相对整包记忆注入，只注入指引、按需search减少无关历史进入上下文的机会。durable outbox把暂时服务离线与会话交互分开，是桥接层具体增量；记忆质量主要仍属于ReMe服务和模型，不归功于适配器。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 记忆搜索 | 检索相关长期材料 | 返回需核对来源 |
| 自动归档 | 把轮次提交ReMe | 含max-tokens需留意 |
| 每日整理 | 将日记整理为知识 | 共享服务只一调度者 |
| 持久队列 | 服务失败后保留批次 | 每Host独立目录 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| ReMe HTTP服务 | 必需 | search与auto_memory | 离线队列积压 |
| 匹配DSH及Node | 必需 | 会话事件接线 | 不声明兼容 |
| 私有outbox目录 | 自动归档必需 | 持久批次 | 锁冲突需停Host核查 |
| 可信网络 | 跨机必需 | 保护无鉴权服务 | 不得公开暴露 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 启动隔离ReMe与一个调度者 | 确认endpoint |
| 2 | 安装桥接并检索虚构记忆 | 能追溯原文 |
| 3 | 核对队列与归档 | 冲突关闭自动写入 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 服务与模型费用未知 | 部署配置 | 需独立队列 |
| 持续使用 | 提炼与dream调用 | 纠错与来源复核 | 相关性收益未测 |
| 失败恢复 | 重试追加费用未知 | 核对积压和重复 | 不删除未ack队列 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 桥接自动化 | 事件到outbox再ack | 长期事实正确率 |
| 按需召回 | 模型显式search | 任务质量与省时 |

> **思考**：关键质疑是自动归档会否把不完整回答长期化，以及未知网络结果会否重复写入。runtime允许max-tokens轮次入队。进一步核查同仓库服务端后确认，auto_memory按session_id与request_id哈希保存输入fingerprint及成功回执，已有同输入回执可重放、不同输入被拒绝；因此不能说服务端幂等全无材料。但执行顺序是先await _execute，再写成功回执，记忆写入与完成回执之间不是一个原子事务，进程在两者之间崩溃时仍需验证是否会再次执行。本轮只指出静态窗口，未复现重复事实。HTTP无API-key鉴权也要求可信网络。 依据[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对每次手工粘贴历史，它把检索入口与完成轮次归档接入会话事件；相对整包记忆注入，只注入指引、按需search减少无关历史进入上下文的机会。durable outbox把暂时服务离线与会话交互分开，是桥接层具体增量；记忆质量主要仍属于ReMe服务和模型，不归功于适配器。 依据[Q03](#research-q03)。

可复用设计是endpoint/session/day分批、fsync后rename、确认后删除及每Host私有锁。失败隔离按endpoint与session区分，能避免一份坏payload堵住所有来源；这仍需服务端配合。锁恢复中断fail-closed并提示停Host检查，可取但增加运维责任，不能称无配置自动恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

关键质疑是自动归档会否把不完整回答长期化，以及未知网络结果会否重复写入。runtime允许max-tokens轮次入队。进一步核查同仓库服务端后确认，auto_memory按session_id与request_id哈希保存输入fingerprint及成功回执，已有同输入回执可重放、不同输入被拒绝；因此不能说服务端幂等全无材料。但执行顺序是先await _execute，再写成功回执，记忆写入与完成回执之间不是一个原子事务，进程在两者之间崩溃时仍需验证是否会再次执行。本轮只指出静态窗口，未复现重复事实。HTTP无API-key鉴权也要求可信网络。 依据[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合愿意维护本地ReMe服务的人在虚构或非敏感项目上试用跨会话检索，先检查来源、队列和单调度者。相比手工粘贴，它增加按需检索与持久归档接线，但正确性仍需用户核对。遇到无来源记忆、冲突事实、队列持续失败或重复写入时关闭自动归档，保留Markdown与队列，退回手工维护检索。 依据[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的机制判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 integrations/dsh/README.md、integrations/dsh/src/index.ts、integrations/dsh/src/runtime.ts、integrations/dsh/src/tools.ts、integrations/dsh/src/outbox.ts、reme/steps/evolve/auto_memory.py、integrations/dsh/src/reme/client.ts 及固定范围 inventory；组件：integrations/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定版本的作者说明、注册入口和下列实际源码；未执行目标代码、安装或真实宿主验收。
- 下一步：- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

**分析版本**

- **仓库**：[agentscope-ai/ReMe](https://github.com/agentscope-ai/ReMe)
- **版本号**：0.1.3（[固定提交 363e497](https://github.com/agentscope-ai/ReMe/tree/363e497ae96733271414ea4224e274e5de5e5253)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是给每条自动记忆保留来源轮次与“未完成回答”标记，并让检索返回时突出冲突，可以减少截断回答污染长期知识。固定含纠正、截断和重复请求的会话集，对比默认归档和带标记归档的错误召回率、用户修正时间及费用；若标记不能阻止后续模型采信错误，不扩大自动写入。 依据[Q08](#research-q08)。

- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 3 | 227 | 217 | 1 | — |
| .md | source | 2 | 602 | — | — | 8204 |
| .ts | source | 17 | 1976 | 1796 | 51 | — |
| .tsx | source | 2 | 2065 | 1985 | 4 | — |
| .mjs | test | 11 | 2327 | 2233 | 69 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/agentscope-ai/ReMe/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：面向跨会话反复处理同一项目、需要追溯偏好和事实的DSH用户，采用价值是否由固定机制与边界支持？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在什么场景需要它，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向跨会话反复处理同一项目、需要追溯偏好和事实的DSH用户。原办法是手工维护Markdown并粘贴相关片段；合格结果应是能追溯原文的相关记忆，而非把所有旧会话自动当指令。组件路径integrations/dsh是实际DSH桥接，不能把Python根框架直接当同一插件安装。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/README.md:10-23](https://github.com/agentscope-ai/ReMe/blob/363e497ae96733271414ea4224e274e5de5e5253/integrations/dsh/README.md#L10-L23)

作者说明指引、搜索与归档。

<details>
<summary>查看原文（14行）</summary>

````text

When a DSH session starts, the plugin injects guidance that tells the root agent when and how to use long-term memory. It also registers the read-only `reme_search` tool. After a turn completes, the plugin can submit user and assistant messages to ReMe `auto_memory`; a daily schedule can run `auto_dream` to consolidate journal entries into durable personal knowledge.

```text
New session
  └─ Inject long-term-memory guidance
       └─ Agent decides whether the request depends on history
            └─ reme_search → ReMe search → daily / digest files

Completed conversation
  └─ Automatic-memory batch → ReMe auto_memory → daily files
       └─ Scheduled consolidation → ReMe auto_dream → digest files
```

````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、处理链及状态如何实现？

**研究主题**：功能与机制

#### 完整回答

index注册reme_search及runtime，在agent创建时注入使用指引而非全量记忆，在session/event捕获轮次。runtime只把含user与assistant的completed/max-tokens轮次写入持久outbox；按endpoint分开排队，向auto_memory传batch.id作为requestId，结果ok后才acknowledge。检索由模型显式调用，日整理auto_dream由单个调度者承担。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/src/index.ts:18-31](https://github.com/agentscope-ai/ReMe/blob/363e497ae96733271414ea4224e274e5de5e5253/integrations/dsh/src/index.ts#L18-L31)

runtime与工具注册。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx: Context, input: ReMeConfigInput = {}): void {
  let config = resolveConfig(input);
  const current = () => config;
  const client = new ReMeClient(current);
  const runtime = new ReMeRuntime(client, current, ctx.logger);
  ctx.effect(() => {
    runtime.start();
    return () => runtime.disposeAll();
  }, "remeMemory.lifecycle()");
  ctx.provide("remeMemory", runtime);
  void ctx.plugin(ReMeStatusGateway);
  ctx.effect(
    () => registerReMeTools(ctx, client, current),
    "remeMemory.tools()",
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/src/runtime.ts:63-76](https://github.com/agentscope-ai/ReMe/blob/363e497ae96733271414ea4224e274e5de5e5253/integrations/dsh/src/runtime.ts#L63-L76)

轮次筛选与持久入队。

<details>
<summary>查看原文（14行）</summary>

```text
    if (event.type !== "turn/end") return;
    const data = isRecord(event.data) ? event.data : undefined;
    const reason = isRecord(data?.reason) ? data.reason.kind : undefined;
    if (
      (reason === "completed" || reason === "max-tokens") &&
      messages.some((item) => item.role === "user") &&
      messages.some((item) => item.role === "assistant")
    ) {
      try {
        this.outbox.append(
          config.endpoint,
          remeSessionId(session.id),
          messagesDay(messages, config.timezone),
          messages,
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/src/runtime.ts:174-204](https://github.com/agentscope-ai/ReMe/blob/363e497ae96733271414ea4224e274e5de5e5253/integrations/dsh/src/runtime.ts#L174-L204)

带requestId发送，ok后ack。

<details>
<summary>查看原文（31行）</summary>

```text
      let retryKey = endpointKey(endpoint);
      try {
        const result = await this.client.autoMemory(messages, batch.sessionId, {
          date: batch.date,
          endpoint,
          requestId: batch.id,
          signal,
        });
        if (signal.aborted) {
          task.phase = "cancelled";
          return;
        }
        if (!result.ok) {
          // Payload/job errors affect this session; network, auth and service errors affect the endpoint.
          if (requestFailure(result.status)) retryKey = sessionKey(batch);
          throw new Error(
            `ReMe automatic-memory request failed (HTTP ${result.status ?? 0})`,
          );
        }
        this.outbox.acknowledge(name);
        task.phase = "completed";
        // Reply text and file names can contain personal information.
        this.failures.delete(endpointKey(endpoint));
        this.failures.delete(sessionKey(batch));
        if (!this.retryTimers.size) this.memoryError = undefined;
      } catch (error) {
        task.phase = signal.aborted ? "cancelled" : "failed";
        task.error = safeError(error);
        this.recordMemoryError(error);
        if (this.stopping || signal.aborted) return;
        this.scheduleRetry(retryKey);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对简单替代的实质增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对每次手工粘贴历史，它把检索入口与完成轮次归档接入会话事件；相对整包记忆注入，只注入指引、按需search减少无关历史进入上下文的机会。durable outbox把暂时服务离线与会话交互分开，是桥接层具体增量；记忆质量主要仍属于ReMe服务和模型，不归功于适配器。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/src/tools.ts:40-48](https://github.com/agentscope-ai/ReMe/blob/363e497ae96733271414ea4224e274e5de5e5253/integrations/dsh/src/tools.ts#L40-L48)

显式搜索与参数边界。

```text
      async execute(args, exec) {
        const query = String(args.query || "").trim();
        if (!query) return "Error: query cannot be empty.";
        const current = typeof config === "function" ? config() : config;
        const result = await client.search(query, {
          limit: clamp(args.limit, 1, 50, current.searchLimit),
          minScore: Math.max(0, Number(args.min_score) || 0),
          signal: exec.signal,
        });
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么限制最可能使贡献不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键质疑是自动归档会否把不完整回答长期化，以及未知网络结果会否重复写入。runtime允许max-tokens轮次入队。进一步核查同仓库服务端后确认，auto_memory按session_id与request_id哈希保存输入fingerprint及成功回执，已有同输入回执可重放、不同输入被拒绝；因此不能说服务端幂等全无材料。但执行顺序是先await _execute，再写成功回执，记忆写入与完成回执之间不是一个原子事务，进程在两者之间崩溃时仍需验证是否会再次执行。本轮只指出静态窗口，未复现重复事实。HTTP无API-key鉴权也要求可信网络。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/src/runtime.ts:63-69](https://github.com/agentscope-ai/ReMe/blob/363e497ae96733271414ea4224e274e5de5e5253/integrations/dsh/src/runtime.ts#L63-L69)

max-tokens也能进入记忆。

```text
    if (event.type !== "turn/end") return;
    const data = isRecord(event.data) ? event.data : undefined;
    const reason = isRecord(data?.reason) ? data.reason.kind : undefined;
    if (
      (reason === "completed" || reason === "max-tokens") &&
      messages.some((item) => item.role === "user") &&
      messages.some((item) => item.role === "assistant")
```

**依据 2 · 作者声明**：[integrations/dsh/README.md:27-35](https://github.com/agentscope-ai/ReMe/blob/363e497ae96733271414ea4224e274e5de5e5253/integrations/dsh/README.md#L27-L35)

服务鉴权边界。

```text

- ReMe is installed and its configuration exposes the `search`, `auto_memory`, and `auto_dream` jobs.
- DeepSeek Harness `0.1.7-rc.2`, `0.2.0-rc.2`, `0.2.1-alpha.2`, `0.2.1-alpha.4`, or `0.2.1-rc.2`.
- Node.js `^22.19.0` or `>=24.0.0`, matching the current DSH engine range.
- The browser running DSH can reach the configured ReMe HTTP endpoint. Cross-machine deployments must also allow the DSH browser origin.

The default ReMe endpoint is `http://127.0.0.1:2333`. ReMe HTTP does not use API-key authentication, so do not expose it directly to an untrusted network.

Peer ranges cover the tested prerelease lines and compatible stable `0.1.x` / `0.2.x` releases. Other prerelease lines require validation before being added; `0.3.x` is excluded.
```

**依据 3 · 源码核查**：[reme/steps/evolve/auto_memory.py:463-525](https://github.com/agentscope-ai/ReMe/blob/363e497ae96733271414ea4224e274e5de5e5253/reme/steps/evolve/auto_memory.py#L463-L525)

已完成请求回放及fingerprint冲突拒绝；_execute先于回执写入，存在需验证的崩溃窗口。

<details>
<summary>查看原文（63行）</summary>

```text

    async def execute(self):
        """Replay completed request IDs without repeating the memory agent."""
        assert self.context is not None
        request_id = self.context.get("request_id")
        if request_id is None:
            return await self._execute()
        if not isinstance(request_id, str) or not 1 <= len(request_id) <= 128:
            self.context.response.success = False
            self.context.response.answer = "Error: request_id must be a string of 1 to 128 characters"
            return

        payload = {
            key: self.context.get(key) for key in ("session_id", "messages", "date", "memory_hint", "include_images")
        }
        if payload["messages"]:
            # Keep caller-provided IDs/timestamps; parsing dictionaries would generate defaults on every retry.
            payload["messages"] = [
                message.model_dump(mode="json") if isinstance(message, Msg) else message
                for message in payload["messages"]
            ]
        fingerprint = hashlib.sha256(
            json.dumps(payload, sort_keys=True, ensure_ascii=False, separators=(",", ":")).encode(),
        ).hexdigest()
        session_key = hashlib.sha256(str(payload["session_id"]).encode()).hexdigest()
        request_key = hashlib.sha256(request_id.encode()).hexdigest()
        directory = f"{self.config_value('metadata_dir')}/auto_memory_requests/{session_key}"
        workspace = self.file_store.workspace_path
        allowed = self.context.get("_allowed_paths")
        lock_path = _checked_write_path(workspace, f"{directory}/.lock", allowed)
        async with await get_path_lock(lock_path):
            path = _checked_write_path(workspace, f"{directory}/{request_key}.json", allowed)
            if path.exists():
                record = json.loads(path.read_text(encoding="utf-8"))
                if record["fingerprint"] != fingerprint:
                    self.context.response.success = False
                    self.context.response.answer = "Error: request_id was already used for different input"
                    return
                response = Response.model_validate(record["response"])
                self.context.response.answer = response.answer
                self.context.response.success = response.success
                self.context.response.metadata.update(response.metadata)
                self.context["changes"] = record["changes"]
                return
            await self._execute()
            if self.context.response.success:
                path = _checked_write_path(workspace, f"{directory}/{request_key}.json", allowed)
                path.parent.mkdir(parents=True, exist_ok=True)
                temporary = _checked_write_path(workspace, f"{directory}/{request_key}.tmp", allowed)
                await write_file_safe(
                    temporary,
                    json.dumps(
                        {
                            "fingerprint": fingerprint,
                            "response": self.context.response.model_dump(mode="json"),
                            "changes": self.context.get("changes") or [],
                        },
                    ),
                )
                temporary.replace(path)

    # pylint: disable=too-many-return-statements
    async def _execute(self):
```

</details>

**依据 4 · 源码核查**：[integrations/dsh/src/reme/client.ts:59-72](https://github.com/agentscope-ai/ReMe/blob/363e497ae96733271414ea4224e274e5de5e5253/integrations/dsh/src/reme/client.ts#L59-L72)

客户端requestId确实映射到request_id。

<details>
<summary>查看原文（14行）</summary>

```text
    return this.request(
      "auto_memory",
      {
        messages,
        session_id: sessionId,
        memory_hint: options.memoryHint || "",
        date: options.date || "",
        ...(options.requestId ? { request_id: options.requestId } : {}),
      },
      config,
      config.backgroundTimeoutMs,
      options.signal,
    );
  }
```

</details>

#### 缺口

- 记忆修改后、成功回执持久前崩溃的重复执行边界未验证。
  **影响**：已完成回执重放不等于全链exactly-once。
  **进一步探讨**：对该两阶段窗口注入中断，核查相同request_id重试是否产生重复知识。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续与恢复依赖哪些条件？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要ReMe服务暴露search/auto_memory/auto_dream、匹配DSH/Node、浏览器可达endpoint及独立queue目录。一个共享服务应只有一个dream调度者，多个Host须独立outbox以避免锁争用。默认loopback；多机必须核对origin与可信网络。退出前保留未ack队列和可读Markdown，不删除队列来假装同步成功。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/README.md:46-54](https://github.com/agentscope-ai/ReMe/blob/363e497ae96733271414ea4224e274e5de5e5253/integrations/dsh/README.md#L46-L54)

单一dream调度者。

````text
  service.host=127.0.0.1 service.port=3457 \
  jobs.dream_cron.enabled=false
```

The plugin owns the daily Dream schedule by default, so this disables ReMe's `dream_cron` while keeping the
`auto_dream` API available. To use ReMe scheduling instead, omit this override and set the plugin's
`autoDreamEnabled` to `false`. Shared services should have only one scheduler.

For development and screenshots, use an isolated directory outside the repository, such as `/tmp/reme-dsh-demo`. Do not write runtime memory into the repository's `.reme/` directory.
````

**依据 2 · 源码核查**：[integrations/dsh/src/outbox.ts:35-60](https://github.com/agentscope-ai/ReMe/blob/363e497ae96733271414ea4224e274e5de5e5253/integrations/dsh/src/outbox.ts#L35-L60)

独立outbox锁与恢复。

<details>
<summary>查看原文（26行）</summary>

```text
  constructor(readonly directory: string) {
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    this.lock = join(directory, ".lock");
    // Serialize inspection, stale-owner removal, and replacement as one operation.
    // An interrupted recovery fails closed; never reclaim this guard automatically.
    const guard = join(directory, ".lock-recovery");
    try {
      mkdirSync(guard, { mode: 0o700 });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      throw new Error(
        "ReMe outbox lock recovery is busy or interrupted; retry, or inspect .lock-recovery after stopping all Hosts",
      );
    }
    try {
      if (existsSync(this.lock)) {
        const pid = Number(readFileSync(this.lock, "utf8").split(":")[0]);
        if (!Number.isSafeInteger(pid) || pid <= 0)
          throw new Error(
            "Invalid ReMe outbox lock; inspect the queue directory",
          );
        try {
          process.kill(pid, 0);
          throw new Error(
            "ReMe outbox is in use; configure a separate autoMemoryQueueDir for each Host",
          );
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 全周期成本和实际效果支持到哪里？

**研究主题**：效果与总成本

#### 完整回答

首次要部署Python服务并配置模型和DSH桥接，持续有自动提炼、检索和整理调用以及用户纠错；服务离线时还需核对积压与失败。没有当前任务级相关性、错误记忆率和完整费用数据，无法证明比人工Markdown更省时。可读文件便于退出，但错误知识被后续使用的纠正成本不能忽略。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/README.md:10-23](https://github.com/agentscope-ai/ReMe/blob/363e497ae96733271414ea4224e274e5de5e5253/integrations/dsh/README.md#L10-L23)

自动化链路不是质量结果。

<details>
<summary>查看原文（14行）</summary>

````text

When a DSH session starts, the plugin injects guidance that tells the root agent when and how to use long-term memory. It also registers the read-only `reme_search` tool. After a turn completes, the plugin can submit user and assistant messages to ReMe `auto_memory`; a daily schedule can run `auto_dream` to consolidate journal entries into durable personal knowledge.

```text
New session
  └─ Inject long-term-memory guidance
       └─ Agent decides whether the request depends on history
            └─ reme_search → ReMe search → daily / digest files

Completed conversation
  └─ Automatic-memory batch → ReMe auto_memory → daily files
       └─ Scheduled consolidation → ReMe auto_dream → digest files
```

````

</details>

#### 缺口

- 长期错误记忆率、纠正时间及总调用费用未知。
  **影响**：只建议非敏感范围试用。
  **进一步探讨**：用含纠正和截断的会话集测来源正确与完整成本。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可借鉴处和维护边界？

**研究主题**：工程质量与复用

#### 完整回答

可复用设计是endpoint/session/day分批、fsync后rename、确认后删除及每Host私有锁。失败隔离按endpoint与session区分，能避免一份坏payload堵住所有来源；这仍需服务端配合。锁恢复中断fail-closed并提示停Host检查，可取但增加运维责任，不能称无配置自动恢复。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/src/outbox.ts:229-242](https://github.com/agentscope-ai/ReMe/blob/363e497ae96733271414ea4224e274e5de5e5253/integrations/dsh/src/outbox.ts#L229-L242)

fsync、原子替换与seal。

<details>
<summary>查看原文（14行）</summary>

```text
    try {
      writeFileSync(fd, JSON.stringify(batch));
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
    renameSync(temporary, join(this.directory, name));
  }

  private seal(name: string, batch: MemoryBatch): void {
    renameSync(
      join(this.directory, name),
      join(this.directory, `ready-${batch.createdAt}-${batch.id}.json`),
    );
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 什么新假设值得验证，怎样推翻它？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是给每条自动记忆保留来源轮次与“未完成回答”标记，并让检索返回时突出冲突，可以减少截断回答污染长期知识。固定含纠正、截断和重复请求的会话集，对比默认归档和带标记归档的错误召回率、用户修正时间及费用；若标记不能阻止后续模型采信错误，不扩大自动写入。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/src/runtime.ts:63-76](https://github.com/agentscope-ai/ReMe/blob/363e497ae96733271414ea4224e274e5de5e5253/integrations/dsh/src/runtime.ts#L63-L76)

截断轮次归档为假设来源。

<details>
<summary>查看原文（14行）</summary>

```text
    if (event.type !== "turn/end") return;
    const data = isRecord(event.data) ? event.data : undefined;
    const reason = isRecord(data?.reason) ? data.reason.kind : undefined;
    if (
      (reason === "completed" || reason === "max-tokens") &&
      messages.some((item) => item.role === "user") &&
      messages.some((item) => item.role === "assistant")
    ) {
      try {
        this.outbox.append(
          config.endpoint,
          remeSessionId(session.id),
          messagesDay(messages, config.timezone),
          messages,
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得采用，何时停止？

**研究主题**：采用判断

#### 完整回答

适合愿意维护本地ReMe服务的人在虚构或非敏感项目上试用跨会话检索，先检查来源、队列和单调度者。相比手工粘贴，它增加按需检索与持久归档接线，但正确性仍需用户核对。遇到无来源记忆、冲突事实、队列持续失败或重复写入时关闭自动归档，保留Markdown与队列，退回手工维护检索。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/src/runtime.ts:186-204](https://github.com/agentscope-ai/ReMe/blob/363e497ae96733271414ea4224e274e5de5e5253/integrations/dsh/src/runtime.ts#L186-L204)

失败保留并重试而非丢弃。

<details>
<summary>查看原文（19行）</summary>

```text
        if (!result.ok) {
          // Payload/job errors affect this session; network, auth and service errors affect the endpoint.
          if (requestFailure(result.status)) retryKey = sessionKey(batch);
          throw new Error(
            `ReMe automatic-memory request failed (HTTP ${result.status ?? 0})`,
          );
        }
        this.outbox.acknowledge(name);
        task.phase = "completed";
        // Reply text and file names can contain personal information.
        this.failures.delete(endpointKey(endpoint));
        this.failures.delete(sessionKey(batch));
        if (!this.retryTimers.size) this.memoryError = undefined;
      } catch (error) {
        task.phase = signal.aborted ? "cancelled" : "failed";
        task.error = safeError(error);
        this.recordMemoryError(error);
        if (this.stopping || signal.aborted) return;
        this.scheduleRetry(retryKey);
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
