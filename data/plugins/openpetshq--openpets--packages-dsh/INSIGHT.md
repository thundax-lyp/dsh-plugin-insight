# OpenPets DSH adapter

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[5235d56](https://github.com/OpenPetsHQ/openpets/tree/5235d5677f01a941c4479c8c74d084364a7dd1a4/packages/dsh)

<!-- BEGIN META -->
[![GitHub ★ 1,366](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C366&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/OpenPetsHQ/openpets) [![npm 30d 650](https://img.shields.io/static/v1?label=npm+30d&message=650&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@open-pets/dsh) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@open-pets/dsh)
<!-- END META -->

> **功能**：把 DSH 事件转成 OpenPets 桌面伴侣反应和提示。

> **亮点**：[Q02](#research-q02) 将事件映射为非阻塞提示，不接管工具或审批。

> **主要限制**：[Q03](#research-q03) idle 并不证明任务成功，过滤与会话隔离也有边界。

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
  - [Q01 · 桌面伴侣相对宿主状态有什么价值？](#detail-section-11)
  - [Q02 · 监听怎样工作，失败是否影响主循环？](#detail-section-12)
  - [Q03 · 消息过滤和状态提示有哪些边界？](#detail-section-13)
  - [Q04 · 什么情况下适合使用，失效如何处理？](#detail-section-14)
  - [Q05 · 如何减少多会话的误导提示？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望通过桌面伴侣关注 DSH 执行及审批的用户。

DSH 宿主已有状态与审批入口，用户可直接查看。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 状态映射 | 展示伴侣反应 | idle 不等于成功 |
| 错误抑制 | 降低矛盾提示 | 实例级非按会话 |
| 状态文本 | 提示进度 | 过滤不能证明无敏感信息 |
| 异步发送 | 尽力通知 | 失败可能静默 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH/Cordis 事件 | 运行必需 | 触发监听 | 不能产生对应提示 |
| OpenPets 客户端和桌面服务 | 展示必需 | 接收并显示反应 | 发送失败被忽略 |
| 用户允许提示 | 使用必需 | 呈现辅助信息 | 可停用并回宿主 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对兼容版本并启用插件 | 确认宿主和桌面服务可用 |
| 运行 | 宿主发事件，插件尽力发送提示 | 未看到提示时检查连接 |
| 核实 | 用户回宿主查看具体状态和审批 | 不把 idle 气泡当验收结果 |
| 失败恢复 | 用户停用插件或排查服务 | 继续使用宿主原有状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 软件与设备费用未知 | 安装和配置时间未知 | 需兼容 DSH 与桌面服务 |
| 持续使用 | 资源消耗未知 | 查看提示与可能打断耗时未知 | 敏感文本过滤与效果未实测 |
| 失败恢复 | 额外资源费用未知 | 排查或停用时间未知 | 消息失败可能静默 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 状态提示 | 源码将事件映射为伴侣反应 | 提示送达率及节省时间 |
| 错误抑制 | 5 秒内压制 idle 成功提示 | 多会话交错的误判率 |
| 隐私 | 源码执行部分过滤和外部校验 | 所有敏感文本是否被拦截 |

> **思考**：[Q03](#research-q03) idle 并不证明任务成功，过滤与会话隔离也有边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将事件映射为非阻塞提示，不接管工具或审批。

[Q02](#research-q02) 调度和发送失败均捕获；[Q03](#research-q03) 全局实例状态可能跨会话影响。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) idle 并不证明任务成功，过滤与会话隔离也有边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅作辅助提醒，以宿主为准并先验证过滤。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子组件静态检查；未运行 DSH、IPC 或宠物桌面。

- 已检查：作者 README、包清单、源码路径 packages/dsh/src/runtime.ts、packages/dsh/src/index.ts、packages/dsh/README.md、packages/dsh/package.json 及固定范围 inventory；组件：packages/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 packages/dsh 源码；未推断依赖内部行为或运行。
- 下一步：在兼容宿主试验事件、断连、敏感文本和多会话交错。

**分析版本**

- **仓库**：[OpenPetsHQ/openpets](https://github.com/OpenPetsHQ/openpets)
- **版本号**：4.1.0（[固定提交 5235d56](https://github.com/OpenPetsHQ/openpets/tree/5235d5677f01a941c4479c8c74d084364a7dd1a4)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在可信 session 标识可用时按会话隔离提示，须对照现有抑制和漏报验证。

在兼容宿主试验事件、断连、敏感文本和多会话交错。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 55 | — | — | 273 |
| .ts | source | 3 | 332 | 276 | 18 | — |
| .ts | test | 1 | 215 | 185 | 7 | — |

</details>

**活跃度**

[![Issue 未关闭 28](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=28&color=737b86&logo=github)](https://github.com/OpenPetsHQ/openpets/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=17&color=737b86&logo=github)](https://github.com/OpenPetsHQ/openpets/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/OpenPetsHQ/openpets/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对 DSH 子组件事件映射、状态隔离和通知边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面伴侣相对宿主状态有什么价值？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DSH 用户可把运行、错误、等待审批映射为伴侣反馈，而不必持续盯着宿主窗口；宿主已有状态与审批入口，提示不替代操作或任务验收，实际注意力收益未测。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh/src/runtime.ts:60-74](https://github.com/OpenPetsHQ/openpets/blob/5235d5677f01a941c4479c8c74d084364a7dd1a4/packages/dsh/src/runtime.ts#L60-L74)

类别映射：idle 映射 success。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Map only the categorical values defined by DSH. Event payloads are
 * deliberately not inspected or forwarded. For agent/status, only the
 * categorical `status` property is read from the event envelope.
 */
export function classifyDshEvent(eventName: DshEventName | string, event?: unknown): DshEventDecision | undefined {
  if (eventName === "agent/status") {
    const status = typeof event === "string" ? event : getStatusCategory(event);
    if (status === "running") return { reaction: "thinking", speechCategory: "thinking" };
    if (status === "idle") return { reaction: "success", speechCategory: "success" };
    return undefined;
  }
  if (eventName === "agent/error") return { reaction: "error", speechCategory: "error" };
  if (eventName === "approval/request") return { reaction: "waiting", speechCategory: "permission" };
  return undefined;
```

</details>

#### 缺口

- 未测真实用户注意与漏看
  **影响**：不能断定效率提升
  **进一步探讨**：对照宿主状态，统计正确响应及打断。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 监听怎样工作，失败是否影响主循环？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 启用后注册监听；runtime 按事件选择反应，调度异步工作并捕获调度和客户端异常；默认 client 设置连接和响应 500ms。它只消费事件与发消息，不控制审批或工具执行；吞掉异常意味着宠物不可用也可能没有提示，不能认定所有自定义宿主调度都可用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh/src/runtime.ts:95-119](https://github.com/OpenPetsHQ/openpets/blob/5235d5677f01a941c4479c8c74d084364a7dd1a4/packages/dsh/src/runtime.ts#L95-L119)

调度与发送异常被捕获。

<details>
<summary>查看原文（25行）</summary>

```text
  const dispatch = (decision: DshEventDecision | undefined): void => {
    if (!decision) return;

    const now = options.now?.() ?? Date.now();
    if (decision.reaction === "error") {
      recentErrorAt = now;
    } else if (decision.reaction === "success" && now - recentErrorAt < errorSuccessSuppressionMs) {
      return;
    }

    const work = async (): Promise<void> => {
      try {
        const speech = validateHookSpeech(pickHookSpeech(decision.speechCategory, options.random));
        await getClient().say(speech, { reaction: decision.reaction });
      } catch {
        // Automatic agent listeners must never affect the DSH operation.
      }
    };

    try {
      const scheduled = schedule(work);
      if (isPromiseLike(scheduled)) void scheduled.catch(() => undefined);
    } catch {
      // A scheduler supplied by the host is optional infrastructure.
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh/src/runtime.ts:222-247](https://github.com/OpenPetsHQ/openpets/blob/5235d5677f01a941c4479c8c74d084364a7dd1a4/packages/dsh/src/runtime.ts#L222-L247)

client 超时及注册和默认异步调度。

<details>
<summary>查看原文（26行）</summary>

```text
export function createOpenPetsDshClient(): OpenPetsClient {
  return createOpenPetsClient({
    remote: false,
    connectTimeoutMs: automaticTimeoutMs,
    responseTimeoutMs: automaticTimeoutMs,
  });
}

/** Register the DSH listeners without taking ownership of their flow. */
export function registerDshListeners(cordis: DshCordisApi, options: OpenPetsDshOptions = {}): OpenPetsDshRuntime {
  const runtime = createOpenPetsDshRuntime(options);
  if (options.enabled === false) return runtime;
  const on = cordis.on as unknown as (eventName: string, listener: (...args: readonly unknown[]) => unknown) => unknown;
  on("agent/status", (event: unknown) => runtime.handleStatus(event));
  on("agent/error", () => runtime.handleEvent("agent/error"));
  on("approval/request", (_request: unknown, next: unknown) => {
    runtime.handleApproval();
    return typeof next === "function" ? next() : undefined;
  });
  on("agent/assistant-stream", (payload: unknown) => runtime.handleStream(payload));
  on("tools/result", (exec: unknown, result: unknown) => runtime.handleToolResult(exec, result));
  return runtime;
}

function defaultSchedule(work: () => Promise<void>): void {
  void Promise.resolve().then(work).catch(() => undefined);
```

</details>

#### 缺口

- 未启动 DSH 或 IPC
  **影响**：实际事件兼容和非阻塞未运行验证
  **进一步探讨**：模拟失联、延迟、同步抛错和不同事件版本。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 消息过滤和状态提示有哪些边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

状态字符串清理换行、URL、部分路径和长度并交给外部 validator；不是任意敏感信息完全清除的证明。idle 映射 success，五秒内错误抑制 success；runtime 的 error 时间、消息节流和 streamBuffer 是实例级而非按 session 分区，多会话复用时可能互相影响，具体事件关联需宿主验证。tools/result 针对名称构造提示，并非校验任务成功。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh/src/runtime.ts:40-56](https://github.com/OpenPetsHQ/openpets/blob/5235d5677f01a941c4479c8c74d084364a7dd1a4/packages/dsh/src/runtime.ts#L40-L56)

过滤仅按可见规则及外部校验。

<details>
<summary>查看原文（17行）</summary>

```text
const automaticTimeoutMs = 500;
const errorSuccessSuppressionMs = 5_000;
const minSpeechIntervalMs = 1_200;

export function sanitizeStatusLine(text: string): string | null {
  if (!text || typeof text !== "string") return null;
  let s = text.replace(/[\r\n]+/g, " ").trim();
  s = s.replace(/https?:\/\/\S+/gi, "");
  s = s.replace(/[`{};]/g, "");
  s = s.replace(/(?:^|\s)(?:~|\.{1,2}|[A-Za-z]:)?[\\/]\S+\/([^\s/]+)/g, " $1");
  if (s.length > 100) s = s.slice(0, 97) + "...";
  s = s.trim();
  if (s.length === 0) return null;
  try {
    return validateHookSpeech(s);
  } catch {
    return null;
```

</details>

**依据 2 · 源码核查**：[packages/dsh/src/runtime.ts:65-74](https://github.com/OpenPetsHQ/openpets/blob/5235d5677f01a941c4479c8c74d084364a7dd1a4/packages/dsh/src/runtime.ts#L65-L74)

idle 直接映射 success。

<details>
<summary>查看原文（10行）</summary>

```text
export function classifyDshEvent(eventName: DshEventName | string, event?: unknown): DshEventDecision | undefined {
  if (eventName === "agent/status") {
    const status = typeof event === "string" ? event : getStatusCategory(event);
    if (status === "running") return { reaction: "thinking", speechCategory: "thinking" };
    if (status === "idle") return { reaction: "success", speechCategory: "success" };
    return undefined;
  }
  if (eventName === "agent/error") return { reaction: "error", speechCategory: "error" };
  if (eventName === "approval/request") return { reaction: "waiting", speechCategory: "permission" };
  return undefined;
```

</details>

**依据 3 · 源码核查**：[packages/dsh/src/runtime.ts:84-103](https://github.com/OpenPetsHQ/openpets/blob/5235d5677f01a941c4479c8c74d084364a7dd1a4/packages/dsh/src/runtime.ts#L84-L103)

状态保存在 runtime 实例。

<details>
<summary>查看原文（20行）</summary>

```text
  let client: OpenPetsClient | undefined;
  let recentErrorAt = Number.NEGATIVE_INFINITY;
  let lastCustomSpeechAt = Number.NEGATIVE_INFINITY;
  let streamBuffer = "";
  let statusExtractedForTurn = false;

  const getClient = (): OpenPetsClient => {
    client ??= clientFactory();
    return client;
  };

  const dispatch = (decision: DshEventDecision | undefined): void => {
    if (!decision) return;

    const now = options.now?.() ?? Date.now();
    if (decision.reaction === "error") {
      recentErrorAt = now;
    } else if (decision.reaction === "success" && now - recentErrorAt < errorSuccessSuppressionMs) {
      return;
    }
```

</details>

**依据 4 · 源码核查**：[packages/dsh/src/runtime.ts:198-216](https://github.com/OpenPetsHQ/openpets/blob/5235d5677f01a941c4479c8c74d084364a7dd1a4/packages/dsh/src/runtime.ts#L198-L216)

工具名称和参数构造消息。

<details>
<summary>查看原文（19行）</summary>

```text
    handleToolResult(exec) {
      if (!enableToolEvents) return;
      if (!exec || typeof exec !== "object") return;
      const e = exec as { readonly name?: string; readonly arguments?: Record<string, unknown>; readonly params?: Record<string, unknown> };
      if (!e.name) return;
      const args = e.arguments ?? e.params;

      if (e.name === "bash" && args?.description) {
        const clean = sanitizeStatusLine(String(args.description));
        if (clean) dispatchCustom(clean, "running");
      } else if (e.name === "edit" || e.name === "write") {
        const filePath = args?.file_path ? String(args.file_path).split(/[\\/]/).pop() : "";
        const action = e.name === "edit" ? "Chỉnh sửa" : "Ghi file";
        const clean = sanitizeStatusLine(filePath ? `${action} ${filePath}` : action);
        if (clean) dispatchCustom(clean, "editing");
      } else if (e.name === "read") {
        const filePath = args?.file_path ? String(args.file_path).split(/[\\/]/).pop() : "";
        const clean = sanitizeStatusLine(filePath ? `Đọc ${filePath}` : "Đang đọc file");
        if (clean) dispatchCustom(clean, "working");
```

</details>

#### 缺口

- 无多会话和敏感数据实机验证
  **影响**：无法推断准确性和隐私保证
  **进一步探讨**：隔离测试交错会话、非标准凭据及错误后 idle。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么情况下适合使用，失效如何处理？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 Cordis/DSH 事件、OpenPets 客户端和桌面服务，开关可禁用监听；实时气泡可能打扰或含过滤未识别文本，消息送达和性能未验证。适合作辅助提醒，审批及完成情况仍回宿主核实，不适用时关闭或使用宿主状态。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh/src/runtime.ts:77-83](https://github.com/OpenPetsHQ/openpets/blob/5235d5677f01a941c4479c8c74d084364a7dd1a4/packages/dsh/src/runtime.ts#L77-L83)

配置独立启用事件类别。

```text
export function createOpenPetsDshRuntime(options: OpenPetsDshOptions = {}): OpenPetsDshRuntime {
  const clientFactory = options.clientFactory ?? createOpenPetsDshClient;
  const schedule = options.schedule ?? defaultSchedule;
  const minSpeech = options.minSpeechIntervalMs ?? minSpeechIntervalMs;
  const enableStatusLineStream = options.enableStatusLineStream !== false;
  const enableToolEvents = options.enableToolEvents !== false;
  const enableApprovalEvents = options.enableApprovalEvents !== false;
```

**依据 2 · 源码核查**：[packages/dsh/src/runtime.ts:95-119](https://github.com/OpenPetsHQ/openpets/blob/5235d5677f01a941c4479c8c74d084364a7dd1a4/packages/dsh/src/runtime.ts#L95-L119)

发送失败被忽略。

<details>
<summary>查看原文（25行）</summary>

```text
  const dispatch = (decision: DshEventDecision | undefined): void => {
    if (!decision) return;

    const now = options.now?.() ?? Date.now();
    if (decision.reaction === "error") {
      recentErrorAt = now;
    } else if (decision.reaction === "success" && now - recentErrorAt < errorSuccessSuppressionMs) {
      return;
    }

    const work = async (): Promise<void> => {
      try {
        const speech = validateHookSpeech(pickHookSpeech(decision.speechCategory, options.random));
        await getClient().say(speech, { reaction: decision.reaction });
      } catch {
        // Automatic agent listeners must never affect the DSH operation.
      }
    };

    try {
      const scheduled = schedule(work);
      if (isPromiseLike(scheduled)) void scheduled.catch(() => undefined);
    } catch {
      // A scheduler supplied by the host is optional infrastructure.
    }
```

</details>

**依据 3 · 源码核查**：[packages/dsh/src/runtime.ts:222-237](https://github.com/OpenPetsHQ/openpets/blob/5235d5677f01a941c4479c8c74d084364a7dd1a4/packages/dsh/src/runtime.ts#L222-L237)

客户端依赖及注册。

<details>
<summary>查看原文（16行）</summary>

```text
export function createOpenPetsDshClient(): OpenPetsClient {
  return createOpenPetsClient({
    remote: false,
    connectTimeoutMs: automaticTimeoutMs,
    responseTimeoutMs: automaticTimeoutMs,
  });
}

/** Register the DSH listeners without taking ownership of their flow. */
export function registerDshListeners(cordis: DshCordisApi, options: OpenPetsDshOptions = {}): OpenPetsDshRuntime {
  const runtime = createOpenPetsDshRuntime(options);
  if (options.enabled === false) return runtime;
  const on = cordis.on as unknown as (eventName: string, listener: (...args: readonly unknown[]) => unknown) => unknown;
  on("agent/status", (event: unknown) => runtime.handleStatus(event));
  on("agent/error", () => runtime.handleEvent("agent/error"));
  on("approval/request", (_request: unknown, next: unknown) => {
```

</details>

#### 缺口

- 没有兼容版本或桌面实测
  **影响**：无法量化维护和噪声成本
  **进一步探讨**：试用前校验版本，以无敏感测试数据验证并比较通知打扰。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何减少多会话的误导提示？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有实例级五秒错误抑制和自定义语音节流已经减少噪声，是等价反证；不能说缺少抑制。假设若宿主提供可信 session 标识，将抑制与流缓冲按 session 隔离并标明提示来源，可帮助用户决定回哪个会话处理审批或核查结果。对照现有实例级策略，在双会话交错错误、idle、审批及 stream 的输入下，记录会话归属误判、漏提示、重复提示、响应时长和状态开销；标识缺失时不猜测归属。若误判不降、漏报增加或性能成本抵消收益，则否定假设。尚未确认所有事件均含稳定 session 标识。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh/src/runtime.ts:84-103](https://github.com/OpenPetsHQ/openpets/blob/5235d5677f01a941c4479c8c74d084364a7dd1a4/packages/dsh/src/runtime.ts#L84-L103)

现有实例级错误抑制。

<details>
<summary>查看原文（20行）</summary>

```text
  let client: OpenPetsClient | undefined;
  let recentErrorAt = Number.NEGATIVE_INFINITY;
  let lastCustomSpeechAt = Number.NEGATIVE_INFINITY;
  let streamBuffer = "";
  let statusExtractedForTurn = false;

  const getClient = (): OpenPetsClient => {
    client ??= clientFactory();
    return client;
  };

  const dispatch = (decision: DshEventDecision | undefined): void => {
    if (!decision) return;

    const now = options.now?.() ?? Date.now();
    if (decision.reaction === "error") {
      recentErrorAt = now;
    } else if (decision.reaction === "success" && now - recentErrorAt < errorSuccessSuppressionMs) {
      return;
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh/src/runtime.ts:122-125](https://github.com/OpenPetsHQ/openpets/blob/5235d5677f01a941c4479c8c74d084364a7dd1a4/packages/dsh/src/runtime.ts#L122-L125)

已有自定义消息节流。

```text
  const dispatchCustom = (message: string, reaction: OpenPetsReaction): void => {
    const now = options.now?.() ?? Date.now();
    if (now - lastCustomSpeechAt < minSpeech) return;
    lastCustomSpeechAt = now;
```

**依据 3 · 源码核查**：[packages/dsh/src/runtime.ts:160-194](https://github.com/OpenPetsHQ/openpets/blob/5235d5677f01a941c4479c8c74d084364a7dd1a4/packages/dsh/src/runtime.ts#L160-L194)

流缓冲和每轮提取。

<details>
<summary>查看原文（35行）</summary>

```text
    handleStream(payload) {
      if (!enableStatusLineStream) return;
      if (!payload || typeof payload !== "object") return;
      const frame = (payload as { readonly frame?: unknown }).frame as {
        readonly type?: string;
        readonly chunk?: { readonly type?: string; readonly text?: string };
      } | undefined;
      if (!frame) return;

      if (frame.type === "start") {
        streamBuffer = "";
        statusExtractedForTurn = false;
        return;
      }

      if (frame.type === "end") {
        streamBuffer = "";
        return;
      }

      if (frame.type === "chunk" && frame.chunk?.type === "text-delta" && typeof frame.chunk.text === "string") {
        if (statusExtractedForTurn) return;
        streamBuffer += frame.chunk.text;

        const arrowIndex = streamBuffer.search(/[⏵▶]/);
        if (arrowIndex !== -1) {
          const newlineIndex = streamBuffer.indexOf("\n", arrowIndex);
          if (newlineIndex !== -1) {
            statusExtractedForTurn = true;
            const rawStatus = streamBuffer.slice(arrowIndex + 1, newlineIndex).trim();
            const clean = sanitizeStatusLine(rawStatus);
            if (clean) {
              dispatchCustom(clean, "working");
            }
          }
```

</details>

#### 缺口

- 事件标识及多会话复用行为未验证
  **影响**：不能直接承诺可实现或收益
  **进一步探讨**：先核对宿主事件契约再做交错回放对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
