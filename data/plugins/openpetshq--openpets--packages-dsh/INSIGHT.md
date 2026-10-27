# OpenPets DSH adapter

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[bc00ee4](https://github.com/OpenPetsHQ/openpets/tree/bc00ee4bfa47f4215c8a538862d0f8ab00174d89/packages/dsh)

<!-- BEGIN META -->
[![GitHub ★ 1,333](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C333&color=yellow&logo=github&style=flat)](https://github.com/OpenPetsHQ/openpets) [![npm 30d 556](https://img.shields.io/static/v1?label=npm+30d&message=556&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@open-pets/dsh) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@open-pets/dsh)
<!-- END META -->

> **实现功能**：把 DSH 状态、错误、审批和工具活动转为 OpenPets 桌面伴侣的反应与气泡。

> **核心亮点**：把DSH活动移到桌面伴侣并以尽力异步通知避免阻塞工作，增量在注意力提示而非执行能力。见[Q01](#research-q01)。

> **风险与缺陷**：idle被写成success/Done且状态未按session隔离；规则过滤不能覆盖任意敏感正文，不能用宠物话术验收工作。见[Q03](#research-q03)。

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
  - [Q01 · 桌宠状态为谁提供什么增量？](#detail-section-11)
  - [Q02 · 事件怎样分类、清理文字并通过IPC发送？](#detail-section-12)
  - [Q03 · 隐私和生命周期成本限制了什么用途？](#detail-section-13)
  - [Q04 · 怎样试用，什么状态设计值得检验？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有OpenPets的个人用户可在切出DSH时接收可选工作/审批提示。

DSH原生状态或普通桌面通知为基线；拟人表达不替代验收或权限判断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 状态/审批反应 | 桌面提醒返回DSH | idle非验收；审批不代批准 |
| 自定义状态文字 | 气泡显示stream/工具摘要 | 可关；过滤不保证任意秘密 |
| 本地IPC投递 | 尽力发送而不阻塞Agent | app需运行，丢通知不一定可见 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| OpenPets桌面app及本地IPC | 必需 | 显示反应 | 通知失败被捕获，Agent继续 |
| Cordis/DSH事件契约 | 必需 | 获取状态和工具 | 无事件或payload不符无反应 |
| 非敏感单会话 | 本次试用条件 | 限文字/状态误导 | 多会话不据气泡判断成功 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户运行OpenPets并装adapter | 本地事件可见 |
| 配置 | 用户关闭tool/stream文字 | 只见精选类别话术 |
| 试用 | 单会话观察工作/审批 | 回DSH确认真实状态 |
| 退出 | 停adapter/关闭app | DSH任务仍独立继续 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | OpenPets应用和adapter资源；金额未知 | 核本地IPC、关闭敏感文字 | app不随adapter提供 |
| 持续使用 | 桌面渲染、事件和IPC；量未知 | 区分话术和真实状态 | 净关注时间未测 |
| 失败恢复 | 重连/重启资源 | 停adapter回DSH核状态 | 吞异常可能丢通知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 桌面反应 | 事件分类到say IPC | 通知送达/注意力改善 |
| 内容收窄 | URL/路径/标签秘密规则 | 任意敏感文字过滤 |
| 完成表达 | idle映射success | 任务是否合格不由它证明 |

> **思考**：idle被写成success/Done且状态未按session隔离；规则过滤不能覆盖任意敏感正文，不能用宠物话术验收工作。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把DSH活动移到桌面伴侣并以尽力异步通知避免阻塞工作，增量在注意力提示而非执行能力。见[Q01](#research-q01)。

把DSH活动移到桌面伴侣并以尽力异步通知避免阻塞工作，增量在注意力提示而非执行能力。见[Q01](#research-q01)。

异步尽力IPC、短超时、审批next透传值得复用；全局流缓冲和状态抑制不适合直接解释多会话成功，见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

idle被写成success/Done且状态未按session隔离；规则过滤不能覆盖任意敏感正文，不能用宠物话术验收工作。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

非敏感单会话、已有桌宠用户受控试用；保留宿主真实终态与审批流程。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

事件到反应链可核查；idle不是合格完成，过滤非秘密保证，多会话聚合改进未验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh/README.md、packages/dsh/package.json、packages/dsh/src/index.ts、packages/dsh/src/runtime.ts、packages/agent-events/src/index.ts 及固定范围 inventory；组件：packages/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查packages/dsh adapter与必要共享话术校验，不评桌宠应用全部渲染/远程功能；未执行目标代码/宿主。
- 下一步：以非敏感两会话交错事件比较状态误认、通知延迟及打扰，另审文字过滤样本；未安排的常规宿主加载不列研究缺口。

**分析版本**

- **仓库**：[OpenPetsHQ/openpets](https://github.com/OpenPetsHQ/openpets)
- **版本号**：4.1.0（[固定提交 bc00ee4](https://github.com/OpenPetsHQ/openpets/tree/bc00ee4bfa47f4215c8a538862d0f8ab00174d89)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是idle只表达等待，为成功绑定真实终态和会话，并聚合需人工动作；两会话理解测试无改善则不加复杂度。见[Q04](#research-q04)。

以非敏感两会话交错事件比较状态误认、通知延迟及打扰，另审文字过滤样本；未安排的常规宿主加载不列研究缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 55 | — | — | 273 |
| .ts | source | 3 | 332 | 276 | 18 | — |
| .ts | test | 1 | 215 | 185 | 7 | — |

</details>

**活跃度**

[![Issue 未关闭 28](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=28&color=grey&logo=github&style=flat)](https://github.com/OpenPetsHQ/openpets/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 18](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=18&color=grey&logo=github&style=flat)](https://github.com/OpenPetsHQ/openpets/issues?q=is%3Aissue+created%3A2026-09-27T02%3A08%3A38.413Z..2026-10-27T02%3A08%3A38.413Z) [![近30天关闭 15](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=15&color=grey&logo=github&style=flat)](https://github.com/OpenPetsHQ/openpets/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A08%3A38.413Z..2026-10-27T02%3A08%3A38.413Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查DSH事件到桌宠的状态表达、隐私和注意力提示边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌宠状态为谁提供什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已经运行OpenPets、会切出DSH等待任务或审批的个人用户，可让桌面伴侣用动画/气泡表达工作、错误和待批准。合格结果是用户能识别需要返回DSH的时机，不能以宠物说Done替代真实任务验收。相对DSH原生状态，它将提示搬到桌面伴侣；相对通用桌面通知，额外是拟人反应和状态流/工具文字。源码把idle映射success，成功话池包含Done/All set，而idle只代表Agent空闲，不证明任务合格。增量是可选注意力提示，不是更可靠的工作完成判定或新Agent能力。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh/README.md:3-10](https://github.com/OpenPetsHQ/openpets/blob/bc00ee4bfa47f4215c8a538862d0f8ab00174d89/packages/dsh/README.md#L3-L10)

作者定位桌面伴侣状态/工具反应

```text
Cordis plugin connecting the [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) agent runtime directly to the [OpenPets](https://openpets.dev) desktop companion.

## Features

- **Lifecycle Reactions**: Synchronizes DSH agent status (`running` ⇄ `idle`), errors, and approval requests with companion emotions.
- **Status Stream Awareness**: Extracts `⏵` status lines from assistant stream chunks and displays them in companion speech bubbles.
- **Tool Operation Reactions**: Maps `bash` executions (`running`), `edit`/`write` operations (`editing`), and `read` operations (`working`).
- **Toggleable Configuration**: Enable or disable per profile or dynamically via Cordis plugin configuration.
```

**依据 2 · 源码核查**：[packages/dsh/src/runtime.ts:65-74](https://github.com/OpenPetsHQ/openpets/blob/bc00ee4bfa47f4215c8a538862d0f8ab00174d89/packages/dsh/src/runtime.ts#L65-L74)

idle直接映射success

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

**依据 3 · 源码核查**：[packages/agent-events/src/index.ts:3-8](https://github.com/OpenPetsHQ/openpets/blob/bc00ee4bfa47f4215c8a538862d0f8ab00174d89/packages/agent-events/src/index.ts#L3-L8)

success话池的完成表达

```text
export const hookSpeechPools: Record<HookSpeechCategory, readonly string[]> = {
  thinking: ["Thinking it through", "Let me check", "On it", "Working it out"],
  success: ["Done", "That worked", "All set", "Nice, finished"],
  error: ["Something failed", "Needs another look", "Hit a snag", "Not quite there"],
  permission: ["Approval needed"],
  question: ["Question for you", "Quick question", "Need your input"],
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 事件怎样分类、清理文字并通过IPC发送？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

插件enabled=false时不注册监听，否则一个runtime接收agent/status、error、approval/request、assistant-stream及tools/result。状态类别使用精选短语；工具从bash description或文件basename生成文字，流式输出只截首条箭头状态行。sanitize删除URL、部分路径和代码符号、限100字符，再调用共享validateHookSpeech拒绝路径/URL及带标签的secret赋值。发送用OpenPets client，remote=false，连接和响应各500毫秒，异步微任务调度并捕获异常；审批监听继续调用next，不替用户批准。运行状态、错误抑制和streamBuffer是runtime全局变量，不按session隔离，多Agent交错可能影响提示归属；IPC失败被吞只保Agent循环，不能据无报错确认桌宠收到。可借鉴异步尽力通知与内容收窄，移植需真实事件payload和客户端协议。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh/src/index.ts:26-30](https://github.com/OpenPetsHQ/openpets/blob/bc00ee4bfa47f4215c8a538862d0f8ab00174d89/packages/dsh/src/index.ts#L26-L30)

enabled开关控制监听注册

```text
/** Install the OpenPets listeners into the DSH Cordis context. */
export function apply(ctx: Context, config: Config = {}): void {
  if (config.enabled === false) return;
  registerDshListeners(ctx, config);
}
```

**依据 2 · 源码核查**：[packages/dsh/src/runtime.ts:44-56](https://github.com/OpenPetsHQ/openpets/blob/bc00ee4bfa47f4215c8a538862d0f8ab00174d89/packages/dsh/src/runtime.ts#L44-L56)

文字清理和校验

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 3 · 源码核查**：[packages/dsh/src/runtime.ts:77-108](https://github.com/OpenPetsHQ/openpets/blob/bc00ee4bfa47f4215c8a538862d0f8ab00174d89/packages/dsh/src/runtime.ts#L77-L108)

单runtime共享状态与发送

<details>
<summary>查看原文（32行）</summary>

```text
export function createOpenPetsDshRuntime(options: OpenPetsDshOptions = {}): OpenPetsDshRuntime {
  const clientFactory = options.clientFactory ?? createOpenPetsDshClient;
  const schedule = options.schedule ?? defaultSchedule;
  const minSpeech = options.minSpeechIntervalMs ?? minSpeechIntervalMs;
  const enableStatusLineStream = options.enableStatusLineStream !== false;
  const enableToolEvents = options.enableToolEvents !== false;
  const enableApprovalEvents = options.enableApprovalEvents !== false;
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

    const work = async (): Promise<void> => {
      try {
        const speech = validateHookSpeech(pickHookSpeech(decision.speechCategory, options.random));
        await getClient().say(speech, { reaction: decision.reaction });
```

</details>

**依据 4 · 源码核查**：[packages/dsh/src/runtime.ts:222-243](https://github.com/OpenPetsHQ/openpets/blob/bc00ee4bfa47f4215c8a538862d0f8ab00174d89/packages/dsh/src/runtime.ts#L222-L243)

本地client超时、事件注册与审批next

<details>
<summary>查看原文（22行）</summary>

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
```

</details>

#### 缺口

- 多会话事件交错时的状态归属和丢提示未知
  **影响**：可能误以为另一会话已完成或待审批
  **进一步探讨**：用带会话标记的合成事件交错测试，比较桌宠状态与DSH真实各会话状态

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 隐私和生命周期成本限制了什么用途？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

文字过滤是规则式收窄，不是任意秘密检测：没有api_key/token标签的敏感正文可能不匹配；文件basename也可能敏感。README“strips secrets”只能按实际规则理解，敏感工程宜关status/tool文字，仅用精选类别通知。首次需OpenPets桌面应用运行并能被本地client发现、匹配Cordis和DSH事件；安装adapter本身不会提供宠物应用。持续有桌面渲染和事件/IPC资源，频繁custom speech被节流但类别提示不都走该节流。失败被捕获可以防通知故障拖住Agent，却缺直接可见确认；退出可停用adapter或关闭桌宠，任务仍在DSH中核。现金、CPU/内存及节省关注时间未知。低风险单会话试用有明确退路，多会话与敏感内容不能从fail-safe声明直接放行。

#### 证据与依据

**依据 1 · 源码核查**：[packages/agent-events/src/index.ts:16-24](https://github.com/OpenPetsHQ/openpets/blob/bc00ee4bfa47f4215c8a538862d0f8ab00174d89/packages/agent-events/src/index.ts#L16-L24)

校验只匹配明确文本形状

````text
export function validateHookSpeech(message: string): string {
  if (message.length < 1 || message.length > 140) throw new Error("Hook speech length is invalid.");
  if (/\r|\n/.test(message)) throw new Error("Hook speech must be single line.");
  if (/```|\b(function|const|let|var|class|import|export)\b|[{};]/.test(message)) throw new Error("Hook speech looks code-like.");
  if (/https?:\/\/|www\./i.test(message)) throw new Error("Hook speech must not contain URLs.");
  if (/(^|\s)(?:~|\.{1,2}|[A-Za-z]:)?[\\/][^\s]+/.test(message)) throw new Error("Hook speech must not contain paths.");
  if (/\b(api[_-]?key|secret|password|token)\s*[:=]/i.test(message)) throw new Error("Hook speech must not contain secrets.");
  return message;
}
````

**依据 2 · 源码核查**：[packages/dsh/src/runtime.ts:95-120](https://github.com/OpenPetsHQ/openpets/blob/bc00ee4bfa47f4215c8a538862d0f8ab00174d89/packages/dsh/src/runtime.ts#L95-L120)

类别发送异常捕获但未共用custom节流

<details>
<summary>查看原文（26行）</summary>

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
  };
```

</details>

**依据 3 · 源码核查**：[packages/dsh/src/runtime.ts:122-144](https://github.com/OpenPetsHQ/openpets/blob/bc00ee4bfa47f4215c8a538862d0f8ab00174d89/packages/dsh/src/runtime.ts#L122-L144)

custom speech单独节流

<details>
<summary>查看原文（23行）</summary>

```text
  const dispatchCustom = (message: string, reaction: OpenPetsReaction): void => {
    const now = options.now?.() ?? Date.now();
    if (now - lastCustomSpeechAt < minSpeech) return;
    lastCustomSpeechAt = now;

    const work = async (): Promise<void> => {
      try {
        const validated = validateHookSpeech(message);
        await getClient().say(validated, { reaction });
      } catch {
        // Automatic agent listeners must never affect the DSH operation.
      }
    };

    try {
      const scheduled = schedule(work);
      if (isPromiseLike(scheduled)) void scheduled.catch(() => undefined);
    } catch {
      // Ignored
    }
  };

  return {
```

</details>

**依据 4 · 作者声明**：[packages/dsh/README.md:31-38](https://github.com/OpenPetsHQ/openpets/blob/bc00ee4bfa47f4215c8a538862d0f8ab00174d89/packages/dsh/README.md#L31-L38)

用户可分别关闭stream/tool/approval

```text

| Option | Type | Default | Description |
|---|---|---|---|
| `enabled` | `boolean` | `true` | Master switch to enable or disable listener registration. |
| `minSpeechIntervalMs` | `number` | `1200` | Minimum interval (in ms) between speech bubble notifications. |
| `enableStatusLineStream` | `boolean` | `true` | Forward `⏵` status lines from assistant stream chunks. |
| `enableToolEvents` | `boolean` | `true` | React to tool executions (`bash`, `edit`, `write`, `read`). |
| `enableApprovalEvents` | `boolean` | `true` | Announce when an approval request is waiting for human permission. |
```

#### 缺口

- 未标记敏感正文与高频事件的真实展示范围未知
  **影响**：隐私不能靠正则保证，资源成本也无法认低
  **进一步探讨**：先禁用自定义文字，审一批非敏感样本，再按需要逐项开启并核实际显示

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用，什么状态设计值得检验？

**研究主题**：采用判断、新假设与验证

#### 完整回答

已有OpenPets的个人用户可在非敏感单会话开启精选状态/审批提示，先关工具和stream文字。它比一直盯DSH提供桌面提示，但不证明节时或任务成功；看到Done仍回宿主核完成结果。若宠物状态与会话不符、敏感名称出现在气泡或故障无提示，应停adapter并用DSH原生状态。由idle→success与全局状态可推导未验证方向：只把idle表述为“等待/已停”，为成功另要求明确终态和会话身份，多个会话用最近需用户动作优先聚合。最小验证交错两个会话，其中一个错误一个idle，比较误信完成和错认审批；若更复杂聚合无法降低误判或用户只想娱乐，则不增加默认状态语义。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh/src/runtime.ts:65-88](https://github.com/OpenPetsHQ/openpets/blob/bc00ee4bfa47f4215c8a538862d0f8ab00174d89/packages/dsh/src/runtime.ts#L65-L88)

idle映射及全局状态的推导起点

<details>
<summary>查看原文（24行）</summary>

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
}

export function createOpenPetsDshRuntime(options: OpenPetsDshOptions = {}): OpenPetsDshRuntime {
  const clientFactory = options.clientFactory ?? createOpenPetsDshClient;
  const schedule = options.schedule ?? defaultSchedule;
  const minSpeech = options.minSpeechIntervalMs ?? minSpeechIntervalMs;
  const enableStatusLineStream = options.enableStatusLineStream !== false;
  const enableToolEvents = options.enableToolEvents !== false;
  const enableApprovalEvents = options.enableApprovalEvents !== false;
  let client: OpenPetsClient | undefined;
  let recentErrorAt = Number.NEGATIVE_INFINITY;
  let lastCustomSpeechAt = Number.NEGATIVE_INFINITY;
  let streamBuffer = "";
  let statusExtractedForTurn = false;
```

</details>

**依据 2 · 源码核查**：[packages/agent-events/src/index.ts:3-8](https://github.com/OpenPetsHQ/openpets/blob/bc00ee4bfa47f4215c8a538862d0f8ab00174d89/packages/agent-events/src/index.ts#L3-L8)

完成话术需要收窄

```text
export const hookSpeechPools: Record<HookSpeechCategory, readonly string[]> = {
  thinking: ["Thinking it through", "Let me check", "On it", "Working it out"],
  success: ["Done", "That worked", "All set", "Nice, finished"],
  error: ["Something failed", "Needs another look", "Hit a snag", "Not quite there"],
  permission: ["Approval needed"],
  question: ["Question for you", "Quick question", "Need your input"],
```

**依据 3 · 源码核查**：[packages/dsh/src/runtime.ts:232-243](https://github.com/OpenPetsHQ/openpets/blob/bc00ee4bfa47f4215c8a538862d0f8ab00174d89/packages/dsh/src/runtime.ts#L232-L243)

审批只通知而非决定

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

#### 缺口

- 完成话术与会话聚合改变能否降低误判未测
  **影响**：未验证设计不算当前能力
  **进一步探讨**：用两会话状态理解测试比较误判和提示打扰，再决定改默认

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
