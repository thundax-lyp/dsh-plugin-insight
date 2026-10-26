# Petdex

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[31c0aee](https://github.com/crafter-station/petdex/tree/31c0aee7f4fb387774b87d40e8047dc0f9cea94b)

<!-- BEGIN META -->
[![GitHub ★ 4,283](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C283&color=yellow&logo=github&style=flat)](https://github.com/crafter-station/petdex)
<!-- END META -->

> **实现功能**：提供动画宠物画廊、安装CLI与响应编码Agent活动的独立桌面应用。

> **核心亮点**：[Q02](#research-q02)DSH桥把会话事件映射为宠物状态并隔离UI发送失败；事件归一化可借鉴，根项目是跨Agent宠物平台而非直接DSH插件。

> **风险与缺陷**：[Q03](#research-q03)尽力队列与吞掉发送失败使动画不能作为可靠完成记录；状态提示价值应与娱乐陪伴分开。

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
  - [Q01 · 桌宠对编码用户交付什么，能否当任务监控器？](#detail-section-11)
  - [Q02 · DSH事件如何变为宠物状态而非发送会话正文？](#detail-section-12)
  - [Q03 · 关键事件是否会丢失，能否据此判断业务办结？](#detail-section-13)
  - [Q04 · 陪伴便利是否覆盖独立app和桥接维护？](#detail-section-14)
  - [Q05 · 如何以很小增量防止桌宠误报可靠状态？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Petdex根项目包含宠物画廊、CLI和独立桌面应用，不是根包即可加载的DSH插件。目标是喜欢动画陪伴、希望离开聊天窗口时看到Agent活动的用户；合格结果是宠物显示工作或等待状态，不能用动画证明代码任务完成。原办法是原生状态栏或桌面通知，若用户只需要可靠完成提醒，新增桌宠未必必要。DSH桥位于独立integration子路径，本次根项目研究仅抽查该连通机制和作者分发结构。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 宠物选择 | 画廊与CLI安装动画资源 | 需要独立桌面app或兼容客户端 |
| DSH状态投影 | 将活动转成状态和气泡 | bridge子组件、非可靠完成账本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Petdex桌面应用与宠物资源 | 显示必需 | 动画 | 无桌宠 |
| DSH integration和sessions | DSH反馈必需 | 事件投影 | 仅有静态宠物 |
| 7777端口与update-token | 桥接必需 | 本地认证投递 | 事件静默失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户装宠物和独立app | 动画可见 |
| 2 | 连接DSH integration | 小任务状态对应 |
| 3 | 停止接收端检查退路 | 主任务照常、查看原UI |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 应用与动画文件 | 安装并接桥 | 时间未知 |
| 持续 | 常驻进程、动画和HTTP | 维护版本连接 | 电量CPU内存未知 |
| 失败恢复 | 重连与重新加载 | 回原UI核对任务 | 无持久事件重放依据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 活动动画投影 | 事件映射和HTTP | 注意力收益 |
| 主任务隔离 | 投递错误被隔离 | 丢事件时显示准确性 |

> **思考**：[Q03](#research-q03)尽力队列与吞掉发送失败使动画不能作为可靠完成记录；状态提示价值应与娱乐陪伴分开。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)DSH桥把会话事件映射为宠物状态并隔离UI发送失败；事件归一化可借鉴，根项目是跨Agent宠物平台而非直接DSH插件。

[Q02](#research-q02)DSH桥把会话事件映射为宠物状态并隔离UI发送失败；事件归一化可借鉴，根项目是跨Agent宠物平台而非直接DSH插件。

normalizer把事件类型、会话层级和序号去重集中管理，适合其他可选显示端借鉴；有损队列只适合容忍丢失的UI，不应移作审计或业务通知。Zig桌面实现未纳入JS/TS总LOC统计。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)尽力队列与吞掉发送失败使动画不能作为可靠完成记录；状态提示价值应与娱乐陪伴分开。

<a id="detail-section-6"></a>

### 1.5 使用建议

喜欢动画陪伴的编码用户可小范围试用桌面宠物与DSH桥。相比原生状态栏它增加可见动画反馈，减少漏看或提升效率尚未验证。需要可靠任务完成提醒或不接受常驻资源时，就停用桌宠并查看宿主原始状态。 依据 [Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有实现为固定源码检查支持；用户收益未实测；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、packages/petdex-desktop-native/integrations/dsh/src/index.js、packages/petdex-desktop-native/integrations/dsh/src/normalize.js、packages/petdex-desktop-native/src/hook_server.zig、packages/petdex-desktop-native/src/main.zig 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根项目研究只抽读DSH发送桥、Zig接收认证/状态更新及分发说明；未完整审计画廊、CLI、所有桌面渲染或运行验收。
- 下一步：以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

**分析版本**

- **仓库**：[crafter-station/petdex](https://github.com/crafter-station/petdex)
- **版本号**：0.1.0（[固定提交 31c0aee](https://github.com/crafter-station/petdex/tree/31c0aee7f4fb387774b87d40e8047dc0f9cea94b)）
- **版本日期**：2026-10-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出事件新鲜度与失联未知状态的未验证假设，用离线、溢出和重启对照误判。

以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 94 | 10764 | — | — | 56523 |
| .ts | source | 311 | 49649 | 41513 | 3874 | — |
| .ts | test | 93 | 12017 | 10247 | 758 | — |
| .mjs | source | 3 | 211 | 181 | 5 | — |
| .js | source | 3 | 624 | 554 | 29 | — |
| .mjs | test | 1 | 102 | 94 | 0 | — |
| .tsx | source | 167 | 29878 | 26616 | 1196 | — |
| .tsx | test | 1 | 30 | 26 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/crafter-station/petdex/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查Petdex的具体任务增量、关键失败条件与可控采用路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌宠对编码用户交付什么，能否当任务监控器？

**研究主题**：场景与需求、采用判断

#### 完整回答

Petdex根项目包含宠物画廊、CLI和独立桌面应用，不是根包即可加载的DSH插件。目标是喜欢动画陪伴、希望离开聊天窗口时看到Agent活动的用户；合格结果是宠物显示工作或等待状态，不能用动画证明代码任务完成。原办法是原生状态栏或桌面通知，若用户只需要可靠完成提醒，新增桌宠未必必要。DSH桥位于独立integration子路径，本次根项目研究仅抽查该连通机制和作者分发结构。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:34-42](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/README.md#L34-L42)

作者列明三种产品形态

```text
## What is Petdex

Petdex is three things working together:

1. **A web gallery** at [petdex.dev](https://petdex.dev) where the community submits, reviews, and showcases animated pets in the Codex sprite format.
2. **A CLI** that installs any pet on your machine with one command and ships them straight into Codex.
3. **A desktop app** that floats a pet on your screen and reacts to your coding agent's activity in real time.

Every pet is a folder. Every folder is a Pokédex entry. Every entry is one `npx petdex install` away.
```

**依据 2 · 作者声明**：[README.md:48-64](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/README.md#L48-L64)

安装宠物和桌面app路径

<details>
<summary>查看原文（17行）</summary>

````text
1. Install a known pet:

```sh
npx petdex install boba
```

You should see `~/.petdex/pets/boba/` with `pet.json` and a spritesheet.

2. Get the desktop app from [petdex.dev/download](https://petdex.dev/download). It
   runs on macOS, Linux and Windows.

3. Open it, then hit <kbd>Cmd</kbd>+<kbd>,</kbd> over the pet to open Settings.
   Pick your pet under **Pets**, and connect your coding agents under **Agents**
   with one click each. No terminal involved.

The pet floats above your workspace and animates on every tool call your agent
makes.
````

</details>

#### 缺口

- 桌宠是否改善注意分配、持续需求和真实用户结果没有独立证据。
  **影响**：陪伴偏好不能外推为工作效率需求，限制人群范围。
  **进一步探讨**：向实际桌宠用户确认其陪伴偏好与通知用途，分别观察是否继续使用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH事件如何变为宠物状态而非发送会话正文？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

integration监听sessions事件，通过normalizer将turn/tool/workflow事件映射到running/waiting等状态；用sourceSeq高水位去重并将子会话归到根会话。projectionToRequests向loopback7777的/state和/bubble发固定状态文字、会话ID及事件类型，请求使用本地update-token，300ms期限。可复用贡献是事件归一化与独立UI适配，而非宠物动画算法的新颖性。这里抽查的投影未读取工具参数或完整聊天正文，但不能据此断言全仓库无隐私数据流。 接收端hook_server先绑定127.0.0.1:7777再写0600 token，/state认证和限流后验证状态枚举并入mailbox；主循环pop事件后applyState更新模型，构成发送到显示状态的直接链。/bubble同样认证，限制UTF-8长度，再按会话键更新气泡。

#### 证据与依据

**依据 1 · 源码核查**：[packages/petdex-desktop-native/integrations/dsh/src/normalize.js:3-30](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/packages/petdex-desktop-native/integrations/dsh/src/normalize.js#L3-L30)

固定事件映射

<details>
<summary>查看原文（28行）</summary>

```text
const FIXED_EVENTS = new Map([
  ["turn/start", ["turn.started", "jumping", "Starting", true]],
  ["step/start", ["step.started", "running", "Working", true]],
  ["step/end", ["step.completed", "running", "Working", true]],
  ["tool/call", ["tool.started", "running", "Using a tool", true]],
  ["tool/result", ["tool.completed", "running", "Working", true]],
  [
    "tool-workflow/run-start",
    ["workflow.started", "running", "Workflow running", true],
  ],
  [
    "tool-workflow/agent-start",
    ["workflow.updated", "running", "Subagent working", true],
  ],
  [
    "tool-workflow/agent-end",
    ["workflow.updated", "running", "Workflow running", true],
  ],
  [
    "tool-workflow/run-end",
    ["workflow.completed", "running", "Workflow finished", true],
  ],
  ["goal/change", ["goal.changed", "running", "Goal updated", true]],
  [
    "compaction/start",
    ["compaction.started", "running", "Optimizing context", true],
  ],
  ["compaction/end", ["compaction.completed", "running", "Working", true]],
```

</details>

**依据 2 · 源码核查**：[packages/petdex-desktop-native/integrations/dsh/src/normalize.js:63-90](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/packages/petdex-desktop-native/integrations/dsh/src/normalize.js#L63-L90)

根会话与序号去重

<details>
<summary>查看原文（28行）</summary>

```text
  function rootFor(sourceSessionId) {
    let current = sourceSessionId;
    const seen = new Set([current]);
    for (let depth = 0; depth < MAX_PARENT_DEPTH; depth += 1) {
      const info = sessions.get(current);
      if (info?.origin !== "subagent" || !info.parentSession) return current;
      if (seen.has(info.parentSession)) return null;
      current = info.parentSession;
      seen.add(current);
    }
    return null;
  }

  function baseProjection(session, event) {
    rememberSession(session);
    const sourceSessionId = safeId(session?.id);
    if (!sourceSessionId || !Number.isSafeInteger(event?.seq)) return null;
    const previousSeq = highWater.get(sourceSessionId);
    if (previousSeq !== undefined && event.seq <= previousSeq) return null;
    highWater.set(sourceSessionId, event.seq);

    const rootSessionId = rootFor(sourceSessionId);
    if (!rootSessionId) return null;
    return {
      rootSessionId,
      sourceSessionId,
      sourceSeq: event.seq,
      occurredAt: Number.isFinite(event.time) ? event.time : Date.now(),
```

</details>

**依据 3 · 源码核查**：[packages/petdex-desktop-native/integrations/dsh/src/index.js:24-48](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/packages/petdex-desktop-native/integrations/dsh/src/index.js#L24-L48)

状态与bubble载荷

<details>
<summary>查看原文（25行）</summary>

```text
export function projectionToRequests(projection, token) {
  const headers = { "x-petdex-update-token": token };
  return [
    {
      path: "/state",
      headers,
      body: { state: projection.state, agent_source: "dsh" },
    },
    {
      path: "/bubble",
      headers,
      body: {
        text: projection.text,
        title: "DeepSeek Harness",
        busy: projection.busy,
        agent_source: "dsh",
        session_id: projection.rootSessionId,
        source_app: "default_browser",
        integration_version: INTEGRATION_VERSION,
        source_session_id: projection.sourceSessionId,
        source_seq: projection.sourceSeq,
        event_kind: projection.kind,
      },
    },
  ];
```

</details>

**依据 4 · 源码核查**：[packages/petdex-desktop-native/integrations/dsh/src/index.js:51-79](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/packages/petdex-desktop-native/integrations/dsh/src/index.js#L51-L79)

loopback请求、token和超时

<details>
<summary>查看原文（29行）</summary>

```text
async function postRequest(request) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${HOOK_SERVER}${request.path}`, {
      method: "POST",
      headers: {
        ...request.headers,
        "content-type": "application/json",
      },
      body: JSON.stringify(request.body),
      signal: controller.signal,
    });
    if (!response.ok)
      throw new Error(`Petdex hook returned ${response.status}`);
  } finally {
    clearTimeout(timeout);
  }
}

async function deliverToPetdex(projection) {
  const tokenPath = join(homedir(), ".petdex", "runtime", "update-token");
  const token = (await readFile(tokenPath, "utf8")).trim();
  if (!token) return;
  await Promise.all(
    projectionToRequests(projection, token).map((request) =>
      postRequest(request),
    ),
  );
```

</details>

**依据 5 · 源码核查**：[packages/petdex-desktop-native/src/hook_server.zig:1558-1585](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/packages/petdex-desktop-native/src/hook_server.zig#L1558-L1585)

绑定后写token避免第二实例破坏已有认证

<details>
<summary>查看原文（28行）</summary>

```text
    defer scope.deinit();
    const io = scope.io();

    const addr: std.Io.net.IpAddress = .{ .ip4 = .loopback(7777) };
    var listener = addr.listen(io, .{
        .kernel_backlog = 16,
        // This endpoint is a single-owner service. Zig maps true to
        // SO_REUSEPORT on POSIX, which would let a second desktop bind the
        // same port and replace the first instance's token file.
        .reuse_address = false,
        .mode = .stream,
        .protocol = .tcp,
    }) catch {
        handshake.publish(io, .unavailable);
        std.debug.print("petdex: :7777 bind failed; is another petdex running?\n", .{});
        return;
    };
    defer listener.deinit(io);

    // Bind before replacing the token file. A second desktop instance may
    // fail to bind; it must not invalidate the token of the listener that is
    // already serving hooks.
    writeRuntimeFile(server, "update-token", &server.token, 0o600) catch |err| {
        handshake.publish(io, .unavailable);
        std.debug.print("petdex: token write failed ({s})\n", .{@errorName(err)});
        return;
    };
    mirrorState(server, "idle", 0) catch {};
```

</details>

**依据 6 · 源码核查**：[packages/petdex-desktop-native/src/hook_server.zig:1854-1884](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/packages/petdex-desktop-native/src/hook_server.zig#L1854-L1884)

认证、限流、枚举校验与状态入队

<details>
<summary>查看原文（31行）</summary>

```text
    if (post and std.mem.eql(u8, path, "/state")) {
        const auth = authenticate(server, head) orelse return respond(conn, 401, "{\"ok\":false,\"error\":\"unauthorized\"}");
        if (!server.rateLimitOk(auth)) return respond(conn, 429, "{\"ok\":false,\"error\":\"rate_limited\"}");
        var request: RequestObject = .{ .root = parsed_root orelse return respond(conn, 400, "{\"ok\":false,\"error\":\"invalid_json\"}") };
        const state_raw = request.string("state") orelse
            return respond(conn, 400, "{\"ok\":false,\"error\":\"invalid_state\"}");
        if (!isValidState(state_raw) or state_raw.len > 15) {
            return respond(conn, 400, "{\"ok\":false,\"error\":\"invalid_state\"}");
        }
        // Keep the deployed hook contract: both the packaged TypeScript CLI
        // and the native/remote runners send `duration`, and the legacy
        // parser accepts JSON numbers before capping them to 30 seconds.
        var duration: u32 = 0;
        switch (parseDuration(body)) {
            .missing => {},
            .invalid => return respond(conn, 400, "{\"ok\":false,\"error\":\"invalid_duration\"}"),
            .value => |value| duration = value,
        }

        // A bare `running` is a stable semantic state.  Alternating it into
        // left/right variants on every hook heartbeat made equivalent work
        // look like a fresh state transition and continuously restarted the
        // pet's frame timer.  Directional values are still accepted for
        // direct gesture callers; provider hooks stay on the neutral row.
        const applied = state_raw;

        var event = StateEvent{ .duration_ms = duration };
        event.state_len = applied.len;
        @memcpy(event.state[0..applied.len], applied);
        const enqueue_result = mailbox.enqueueWithCounter(event);
        mirrorQueuedState(server, applied, enqueue_result) catch {};
```

</details>

**依据 7 · 源码核查**：[packages/petdex-desktop-native/src/hook_server.zig:2046-2048](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/packages/petdex-desktop-native/src/hook_server.zig#L2046-L2048)

本地token常量时间比较

```text
fn authenticate(server: *Server, head: []const u8) ?AuthContext {
    const provided = headerValue(head, "x-petdex-update-token") orelse return null;
    if (constantTimeEqual(provided, &server.token)) return .{};
```

**依据 8 · 源码核查**：[packages/petdex-desktop-native/src/main.zig:3268-3279](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/packages/petdex-desktop-native/src/main.zig#L3268-L3279)

队列状态应用到桌宠模型

<details>
<summary>查看原文（12行）</summary>

```text
            const dwell_over = now - model.shown_at_ms >= model.shown_dwell_ms;
            if (!dwell_over) return;
            if (hook_server.mailbox.pop()) |event| {
                const next_state = std.meta.stringToEnum(State, event.slice()) orelse return;
                if (next_state != model.state or isDurationState(next_state)) {
                    applyState(model, next_state, event.duration_ms, fx);
                } else {
                    model.shown_at_ms = now;
                    model.shown_dwell_ms = dwellFor(next_state, event.duration_ms);
                }
            } else if (isDurationState(model.state)) {
                applyState(model, .idle, 0, fx);
```

</details>

**依据 9 · 源码核查**：[packages/petdex-desktop-native/src/hook_server.zig:1934-1944](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/packages/petdex-desktop-native/src/hook_server.zig#L1934-L1944)

bubble认证与内容边界

<details>
<summary>查看原文（11行）</summary>

```text
    if (post and std.mem.eql(u8, path, "/bubble")) {
        const auth = authenticate(server, head) orelse return respond(conn, 401, "{\"ok\":false,\"error\":\"unauthorized\"}");
        if (!server.rateLimitOk(auth)) return respond(conn, 429, "{\"ok\":false,\"error\":\"rate_limited\"}");
        var request: RequestObject = .{ .root = parsed_root orelse return respond(conn, 400, "{\"ok\":false,\"error\":\"invalid_json\"}") };
        const text_raw = request.string("text") orelse
            return respond(conn, 400, "{\"ok\":false,\"error\":\"missing_text\"}");
        const capped = boundedUtf8(text_raw, bubble_text_capacity) orelse
            return respond(conn, 400, "{\"ok\":false,\"error\":\"invalid_text\"}");
        const agent = request.string("agent_source") orelse "";
        const title = request.string("title") orelse "";
        const origin_app = plat.OriginApplication.fromTermProgram(request.string("source_app"));
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 关键事件是否会丢失，能否据此判断业务办结？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

bridge为可选UI，发送失败被吞掉以不影响DSH主任务；队列最多64项，常规事件按根会话合并，满队列先丢可替代项，全部关键事件时仍会shift最旧项。因此它是尽力显示而不是可靠通知账本，关键完成或等待也可能未达。两条HTTP请求并发，部分成功会形成状态与气泡不同步。没有持久重放与端到端确认的证据，不能以“桌宠不动/完成动画”确认任务结果。 定向补查确认接收端/state、/bubble做token与限流，主循环确实应用状态；这补足显示链，但仍不提供丢事件恢复或可靠业务完成保证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/petdex-desktop-native/integrations/dsh/src/index.js:71-95](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/packages/petdex-desktop-native/integrations/dsh/src/index.js#L71-L95)

并发投递和失败不影响主任务

<details>
<summary>查看原文（25行）</summary>

```text
async function deliverToPetdex(projection) {
  const tokenPath = join(homedir(), ".petdex", "runtime", "update-token");
  const token = (await readFile(tokenPath, "utf8")).trim();
  if (!token) return;
  await Promise.all(
    projectionToRequests(projection, token).map((request) =>
      postRequest(request),
    ),
  );
}

export function createBridge(options = {}) {
  const normalizer = createNormalizer();
  const deliver = options.deliver ?? deliverToPetdex;
  const pending = [];
  let draining = null;

  async function drain() {
    while (pending.length > 0) {
      const projection = pending.shift();
      try {
        await deliver(projection);
      } catch {
        // Petdex is optional UI. Its absence must never affect DSH.
      }
```

</details>

**依据 2 · 源码核查**：[packages/petdex-desktop-native/integrations/dsh/src/index.js:107-129](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/packages/petdex-desktop-native/integrations/dsh/src/index.js#L107-L129)

队列上限与关键事件也可淘汰

<details>
<summary>查看原文（23行）</summary>

```text
  function enqueue(projection) {
    if (!isCritical(projection)) {
      for (let index = pending.length - 1; index >= 0; index -= 1) {
        const queued = pending[index];
        if (
          queued.rootSessionId === projection.rootSessionId &&
          !isCritical(queued)
        ) {
          pending[index] = projection;
          ensureDrain();
          return;
        }
      }
    }

    if (pending.length >= MAX_PENDING) {
      const replaceable = pending.findIndex((event) => !isCritical(event));
      if (replaceable >= 0) pending.splice(replaceable, 1);
      else if (!isCritical(projection)) return;
      else pending.shift();
    }
    pending.push(projection);
    ensureDrain();
```

</details>

#### 缺口

- 断联、两次HTTP部分成功及应用重启后的端到端状态一致性尚未实测。
  **影响**：动画可能陈旧或与气泡不一致，不能当任务监控账本。
  **进一步探讨**：在可丢弃任务中关闭接收端、溢出发送队列并重启，核对UI新鲜度和宿主原始事件。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 陪伴便利是否覆盖独立app和桥接维护？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次用户下载桌面app、选宠物并连接Agent，DSH路径另需对应integration及本地端口/token。持续资源为常驻动画和HTTP事件，CPU、内存和电量未测；没有模型推理在所读桥接路径中发生，不能外推整个创作平台免费。失败可停用bridge并回到原生状态栏，不影响DSH执行，但也不自动补发丢失提醒。针对明确想要动画陪伴的用户可做可逆试用；把它当可靠作业监控则不适合。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:48-64](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/README.md#L48-L64)

多段安装及连接

<details>
<summary>查看原文（17行）</summary>

````text
1. Install a known pet:

```sh
npx petdex install boba
```

You should see `~/.petdex/pets/boba/` with `pet.json` and a spritesheet.

2. Get the desktop app from [petdex.dev/download](https://petdex.dev/download). It
   runs on macOS, Linux and Windows.

3. Open it, then hit <kbd>Cmd</kbd>+<kbd>,</kbd> over the pet to open Settings.
   Pick your pet under **Pets**, and connect your coding agents under **Agents**
   with one click each. No terminal involved.

The pet floats above your workspace and animates on every tool call your agent
makes.
````

</details>

**依据 2 · 源码核查**：[packages/petdex-desktop-native/integrations/dsh/src/index.js:71-95](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/packages/petdex-desktop-native/integrations/dsh/src/index.js#L71-L95)

可选UI故障隔离

<details>
<summary>查看原文（25行）</summary>

```text
async function deliverToPetdex(projection) {
  const tokenPath = join(homedir(), ".petdex", "runtime", "update-token");
  const token = (await readFile(tokenPath, "utf8")).trim();
  if (!token) return;
  await Promise.all(
    projectionToRequests(projection, token).map((request) =>
      postRequest(request),
    ),
  );
}

export function createBridge(options = {}) {
  const normalizer = createNormalizer();
  const deliver = options.deliver ?? deliverToPetdex;
  const pending = [];
  let draining = null;

  async function drain() {
    while (pending.length > 0) {
      const projection = pending.shift();
      try {
        await deliver(projection);
      } catch {
        // Petdex is optional UI. Its absence must never affect DSH.
      }
```

</details>

#### 缺口

- 常驻资源与安装卸载时间未知，不能声称零成本。
  **影响**：常驻资源可能大于局部提示收益，影响是否持续采用。
  **进一步探讨**：在目标系统记录空闲/活跃CPU内存电量，并检查安装和移除时profile及token残留。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何以很小增量防止桌宠误报可靠状态？

**研究主题**：新假设与验证

#### 完整回答

由内存队列和尽力投递推导未验证假设：接收端显示“最后事件时间”和断联未知状态，并对完成事件做单独确认，可能降低把旧动画误当当前状态的风险。增量是新鲜度契约而非更多宠物皮肤。对照当前投递与带新鲜度提示的版本，注入端口离线、队列溢出和重启，记录过期状态误判与主任务额外延迟；若提示增加干扰却不能降低误判，就保留纯娱乐定位。

#### 证据与依据

**依据 1 · 源码核查**：[packages/petdex-desktop-native/integrations/dsh/src/index.js:107-129](https://github.com/crafter-station/petdex/blob/31c0aee7f4fb387774b87d40e8047dc0f9cea94b/packages/petdex-desktop-native/integrations/dsh/src/index.js#L107-L129)

队列淘汰提供失联/陈旧问题依据

<details>
<summary>查看原文（23行）</summary>

```text
  function enqueue(projection) {
    if (!isCritical(projection)) {
      for (let index = pending.length - 1; index >= 0; index -= 1) {
        const queued = pending[index];
        if (
          queued.rootSessionId === projection.rootSessionId &&
          !isCritical(queued)
        ) {
          pending[index] = projection;
          ensureDrain();
          return;
        }
      }
    }

    if (pending.length >= MAX_PENDING) {
      const replaceable = pending.findIndex((event) => !isCritical(event));
      if (replaceable >= 0) pending.splice(replaceable, 1);
      else if (!isCritical(projection)) return;
      else pending.shift();
    }
    pending.push(projection);
    ensureDrain();
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
