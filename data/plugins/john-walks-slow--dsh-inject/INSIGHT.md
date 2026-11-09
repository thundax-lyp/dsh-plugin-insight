# dsh-inject

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[31947fe](https://github.com/john-walks-slow/dsh-inject/tree/31947fed401d07b4e15f1c2e82a7aae7421ea39a)

<!-- BEGIN META -->
[![GitHub ★ 54](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/john-walks-slow/dsh-inject) [![npm 30d 1,477](https://img.shields.io/static/v1?label=npm+30d&message=1%2C477&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-inject) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-inject)
<!-- END META -->

> **功能**：为 DSH 提供按会话和模型范围选择的上下文整形、消息前缀和规则替换。

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 相比反复输入提示，插件提供会话覆盖、单次队列与角色限定替换，在请求副本中重用。

> **主要限制**：[Q03](#research-q03) 真实请求和会话摘要不同，队列在 provider 确认前已删除，clear 只清预设。远程代理的目的地限制还需核验。

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
  - [Q01 · 哪类请求对照需要这个 DSH 接入？](#detail-section-11)
  - [Q02 · 注入命令怎样改变下一次模型请求？](#detail-section-12)
  - [Q03 · 请求副本、会话日志与失败分别能证明什么？](#detail-section-13)
  - [Q04 · 启动、Web 设置、请求和清理有哪些成本？](#detail-section-14)
  - [Q05 · 如何验证无害对照的作用域和可复盘性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：比较不同请求格式对模型影响的 DSH 开发者需要查看真实下游请求、原始会话及作用范围，适合用非敏感标记做对照。[Q01](#research-q01)

使用手工前置文本可在聊天日志直接检查并重发。跨模型重用和原文与请求分离需要额外记录。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话预设 | 启用与关闭整形 | 重启恢复默认，clear 不清队列 |
| 单次构造回合 | 请求加入无害对照内容 | 取走早于发送确认 |
| Web 配置与入口 | 编辑预设、触发投递 | 依宿主 admit，远程访问范围需查 |
| 命令记录 | 显示预设或队列摘要 | 没有逐请求确认 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 和相容 DSH services | 基本插件需要 | 挂命令与流处理 | 用原生会话 |
| systemPrompt 或 agentPresets | 对应功能需要 | 系统段或动态模式 | 仅核对基本命令 |
| webServer、connection 和 Web UI | 窗口和远程路由需要 | 会话投递和配置 | 用本机受控命令 |
| 隔离会话与模拟提供商 | 验证需要 | 观察完整请求 | 保持观察 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者准备两个隔离会话、无害标记与假端点 | 确定捕获范围 |
| 比较 | 发手工前置文本、预设或单次队列 | 查实际请求、角色、顺序和原日志 |
| 故障 | 模拟 clear、模型切换和网络失败 | 分别记录排队、转发和失败 |
| 退出 | 停用插件并重开测试会话 | 核对日志、配置和队列清理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | DSH 环境和假端点 | 建隔离会话和无害配置 | 版本兼容未测 |
| 持续 | 额外上下文及日志存储 | 比较实际请求和预设 | 真实用量未知 |
| 失败恢复 | 重新试验及日志 | 确认一次性队列是否已发 | 上游失败时消费状态可能未知 |
| 退出 | 保留必要取证副本 | 停用、核对配置和会话日志 | 删除范围由宿主决定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话整形 | 命令、系统段与请求侧改写 | 实际 provider 解释和效果 |
| 一次性队列 | 按会话取出及销毁 | 上游未收或已处理的差别 |
| 留痕 | 命令与部分激活有摘要 | 逐请求完整记录 |

> **思考**：[Q03](#research-q03) 真实请求和会话摘要不同，队列在 provider 确认前已删除，clear 只清预设。远程代理的目的地限制还需核验。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 相比反复输入提示，插件提供会话覆盖、单次队列与角色限定替换，在请求副本中重用。

[Q02](#research-q02) 系统段和流副本分开，形状判定及 WeakSet 避免再次改写。[Q03](#research-q03) 队列消费和上游确认没有事务关联。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 真实请求和会话摘要不同，队列在 provider 确认前已删除，clear 只清预设。远程代理的目的地限制还需核验。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 保持观察，只用两个隔离会话和模拟端点验证无害标记、模型范围及失败。任何实际发出内容不可核对时停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持实际钩子、队列、消息复制和日志差异。真实 provider 的序列化、访问控制和误判改善未验收。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、README.md、src/index.js、src/client/index.jsx、src/schema.js、src/session-state.js、src/transform.js、src/command-input.js、src/client/config-store.js、src/agent-presets.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：首次固定根 DSH 插件源码，只看无害请求整形、Web 入站、队列与日志。未运行宿主或 provider，未验证内置提示用途。
- 下一步：[Q05](#research-q05) 模拟 endpoint 捕获两会话，检查显式与默认、clear、失败、规则无匹配及系统段存在时的日志差异。

**分析版本**

- **仓库**：[john-walks-slow/dsh-inject](https://github.com/john-walks-slow/dsh-inject)
- **版本号**：0.3.3（[固定提交 31947fe](https://github.com/john-walks-slow/dsh-inject/tree/31947fed401d07b4e15f1c2e82a7aae7421ea39a)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 把排队、已转发和结果未知分别标记，并以无敏感摘要核对，可能减少重复输入和对发送状态的误判。

[Q05](#research-q05) 模拟 endpoint 捕获两会话，检查显式与默认、clear、失败、规则无匹配及系统段存在时的日志差异。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 1285 | — | — | 18767 |
| .mjs | source | 11 | 804 | 634 | 105 | — |
| .js | source | 12 | 2293 | 1828 | 279 | — |
| .jsx | source | 3 | 1460 | 1312 | 25 | — |
| .mjs | test | 11 | 1000 | 875 | 29 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/john-walks-slow/dsh-inject/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/john-walks-slow/dsh-inject/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/john-walks-slow/dsh-inject/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：开发者如何在隔离 DSH 会话用无害文本对照请求整形，哪些匹配、状态、日志和消息顺序会影响可核对结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类请求对照需要这个 DSH 接入？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要比较模型对短格式提示或标记的响应，同时保持原始会话表面可查看的 DSH 开发者，可用手工启用预设或单次构造回合来做隔离对照。合格结果包含宿主真实请求、当前会话和模型以及原始日志与请求差异。手工前置消息更透明且可随会话保存，但在不同模型和会话重复复用的成本更高。根包是实际 DSH 插件，额外提供 Web 设置与窗口。作者也将内置稿定位于越狱用途，本轮只评估无害请求整形和可复盘性，不用这些稿。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-13](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/package.json#L2-L13)

固定包名称、版本、服务端和 Web 导出。

<details>
<summary>查看原文（12行）</summary>

```text
  "name": "dsh-inject",
  "version": "0.3.3",
  "description": "Advanced model-context injection and request-only rewriting for DeepSeek Harness with Keysmith rules compatibility. dsh-inject：为 DeepSeek Harness 提供高级上下文注入与请求侧消息重写，兼容 Keysmith 规则集。",
  "license": "MIT",
  "author": "johnnren",
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:3-8](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/cordis.patch.yml#L3-L8)

实际加载根插件。

```text
- insert:
    - id: inject
      name: dsh-inject
      config:
        presets: []
        templates: []
```

**依据 3 · 作者声明**：[README.md:41-48](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/README.md#L41-L48)

作者说明按会话、模型和预设整形。

```text
## 核心语义

- **只改请求，不改会话**：自动替换发生在发给模型的请求副本上；会话记录和界面显示的原始消息保持不变。
- **默认关闭**：预设一律不默认启用；需要常驻时在设置页勾选「默认启用」，或在本会话用 `/inject <预设 id>` 临时启用。
- **会话级覆盖**：`/inject <预设 id>` / `/inject off` 只作用于当前会话，且总是优先于预设的「默认启用」。
- **agent preset 级默认启用**：勾选「默认启用」后可在展开区填「限定 agent preset」（逗号分隔，留空=全部）；填了之后只在该会话当前 agent preset 命中时默认启用。当前 preset 由 DSH 的 `agentPreset` 投影读取，运行中切换即刻按新 preset 重算。
- **模型级默认启用**：展开区还可填「限定模型」（模型 id 或 `provider/model`，逗号分隔，留空=全部）；只有当前请求的模型命中时该预设才自动启用。显式 `/inject on` 不受模型限制。
- **两条注入通道**：系统段进入宿主的 system prompt（受 complete 模式影响）；构造回合进入请求的消息列表。两者可同时启用，最终顺序是：宿主系统消息 → 构造回合（**按你排的顺序**）→ 原会话消息。排在最前的 system 回合由 provider 连同系统提示一起提升，排在对话之后的则成为对话中的 system 更新——位置不做搬运。
```

**依据 4 · 源码核查**：[src/index.js:172-198](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L172-L198)

用户可查看、开关及 clear 预设。

<details>
<summary>查看原文（27行）</summary>

```text
function registerCommands(ctx, rawConfig) {
  const injectDispose = ctx.commands.register({
    definitionId: "dsh-inject/inject",
    name: "inject",
    description: "启用或禁用本会话的 inject 预设；不传参数可查看状态",
    input: { hint: "on|off <预设 id...> | status | clear" },
    handler: ({ rawInput, agent }) => {
      const config = readConfig(rawConfig);
      const id = sessionKey(agent);
      const parsed = parseInjectInput(rawInput);
      if (parsed.action === "invalid") return { kind: "error", text: INJECT_USAGE };
      if (parsed.action === "status") {
        return { kind: "success", text: activePresetSummary(activePresets(ctx, config, id, currentRouteOf(ctx, id))) };
      }
      if (parsed.action === "clear") {
        sessions.clear(id);
        return { kind: "success", text: "已关闭本会话全部 inject 预设；替换规则不再改写请求，构造回合不再注入" };
      }
      const presets = matchPresets(config, parsed.ids);
      if (presets.length === 0) return { kind: "error", text: `未找到预设 id：${parsed.ids.join("、")}（/inject status 查看当前 id）` };
      const on = parsed.action === "on";
      for (const preset of presets) sessions.toggle(id, preset.id, on);
      // 手动启用已经留下了记录行，自动启用记录不再重复写同一预设。
      if (on) sessions.markAnnounced(id, presets.map(preset => preset.id));
      const head = `${on ? "已启用" : "已禁用"}：${presets.map(p => p.id).join("、")}`;
      if (!on) return { kind: "success", text: head };
      const detail = presets.flatMap(preset => [`${preset.id} 注入：`, ...presetInjectionSummary(preset)]);
```

</details>

**依据 5 · 源码核查**：[src/client/index.jsx:22-50](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/client/index.jsx#L22-L50)

设置和对话窗口挂载。

<details>
<summary>查看原文（29行）</summary>

```text
export const inject = ["slots", "configForms", "commandUi"];

export function apply(ctx) {
  injectStyles();
  const scope = ctx.configForms.get(ENTRY_ID);
  const dialogs = createDialogStore();

  ctx.effect(() => ctx.configForms.whileServed([ENTRY_ID], () => ctx.slots.inject(
    "settings.section",
    () => ctx.slots.register(
      { name: "settings.section", id: "dsh-inject", order: 130, label: () => "Inject", inject: () => ({ scope }) },
      SettingsPanel
    )
  )));

  ctx.effect(() => ctx.slots.inject(
    "conversation.input.overlay",
    () => ctx.slots.register(
      {
        name: "conversation.input.overlay",
        id: "dsh-inject",
        order: 30,
        inject: sessionId => ({
          sessionId,
          scope,
          isOpen: () => dialogs.isOpen(sessionId),
          subscribe: dialogs.subscribe,
          dismiss: () => dialogs.close(sessionId)
        })
```

</details>

#### 缺口

- 没有真实的对照工作流和使用收益。
  **影响**：较简单任务可能适合只用手工前置消息。
  **进一步探讨**：固定两会话和同一模型，记录错误状态与复现工时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 注入命令怎样改变下一次模型请求？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主 apply 注册可选系统段和两个用户命令。`/inject-turn` 从预设模板或 JSON 得到非空消息，按 session id 放入进程队列并回命令摘要；Web 窗口经 Connection admit，再找到活动 Agent 并走同一个命令。流处理只对形状符合冻结、sessionId 和 messages 的原始请求候选启动，按请求 model/provider 与当前 Agent preset 计算默认项，随后叠加显式会话状态。符合角色的历史文本规则在保留非文本数据的情况下复制修改，再把常驻和一次性构造回合插到首个系统项之后或数组首部。工具角色的模板转成标注的用户文本，不是实际工具结果。只有需要新消息数组才构造普通对象，记 WeakSet 后经 ctx.llm.stream 重派发。系统段另走系统提示装配，不共享这条消息前缀链。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:303-333](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L303-L333)

系统段和命令在 apply 接线。

<details>
<summary>查看原文（31行）</summary>

```text
export function apply(ctx, rawConfig = {}) {
  // 真正的 system prompt 段：比「伪造 system 消息」更贴近宿主组装顺序，且每轮按
  // 当前 session / agent preset / model 重新计算，不落盘、不污染会话。
  ctx.inject(["systemPrompt"], child => {
    child.effect(() => child.systemPrompt.section({
      name: "dsh-inject",
      order: 5100,
      interpolate: false,
      text: context => systemSectionForAgent(ctx, readConfig(rawConfig), context?.agent)
    }));
  });
  ctx.inject(["settings"], child => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
  });
  // 动态注册开启了「创建为模式」的 agent preset (inject-{id})。没有 agentPresets 服务的 profile 自动跳过。
  ctx.inject(["agentPresets"], child => {
    const manager = createAgentPresetManager(child.agentPresets, child.logger, child.loader);
    child.effect(() => {
      void manager.sync(readConfig(rawConfig).presets);
      const onUpdate = () => {
        void manager.sync(readConfig(rawConfig).presets);
      };
      child.on?.("loader/volatile-update", onUpdate);
      child.on?.("settings/document-updated", onUpdate);
      return () => {
        manager.dispose();
      };
    });
  });
  ctx.effect(() => registerCommands(ctx, rawConfig));
  ctx.on("agent/disposed", ({ agent }) => sessions.drop(sessionKey(agent)));
```

</details>

**依据 2 · 源码核查**：[src/index.js:202-225](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L202-L225)

参数解析、拒绝空值及队列回执。

<details>
<summary>查看原文（24行）</summary>

```text
  const turnDispose = ctx.commands.register({
    definitionId: "dsh-inject/inject-turn",
    name: "inject-turn",
    description: "把构造回合放入下一次模型请求，不写入 transcript",
    input: { hint: "模板名或 JSON" },
    handler: ({ rawInput, agent }) => {
      const config = readConfig(rawConfig);
      const input = rawInput.trim();
      const template = config.templates.find(item => item.id === input || item.name === input);
      let turns = template?.messages;
      if (!turns) {
        try {
          const parsed = JSON.parse(input);
          turns = Array.isArray(parsed) ? parsed : parsed?.messages;
        } catch {
          return { kind: "error", text: "用法：/inject-turn 打开注入窗口，或 /inject-turn <模板名>｜<JSON 数组>" };
        }
      }
      const normalized = Array.isArray(turns) ? turns.map(normalizeTurnMessage).filter(turn => turn.text.trim()) : [];
      if (!normalized.length) return { kind: "error", text: "构造回合不能为空" };
      const id = sessionKey(agent);
      if (sessions.queue(id, normalized) === null) return { kind: "error", text: `待注入消息过多（上限 ${MAX_PENDING_TURNS} 条），请先发送一次消息消费队列` };
      const lines = normalized.map((turn, index) => `${index + 1}. [${turn.role}] ${previewText(turn.text)}`);
      return { kind: "success", text: [`已排队 ${normalized.length} 条构造消息，将在下一次模型请求注入：`, ...lines].join("\n") };
```

</details>

**依据 3 · 源码核查**：[src/index.js:337-354](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L337-L354)

Web 通过 admit 与活 Agent 后走同一宿主命令。

<details>
<summary>查看原文（18行）</summary>

```text
    child.effect(() => child.webServer.register({
      kind: "exact",
      path: "/dsh-inject/turns",
      handler: (req, res) => {
        if (req.method !== "POST") return writeJson(res, 405, { ok: false, message: "method not allowed" });
        const admission = admitRequest(child.connection, req);
        if (admission.rejection) return writeJson(res, admission.rejection, { ok: false, message: "request rejected" });
        void readJsonBody(req).then(async body => {
          const id = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
          if (!id) return writeJson(res, 400, { ok: false, message: "sessionId is required" });
          const agent = ctx.agents.get(id);
          if (!agent) return writeJson(res, 404, { ok: false, message: "session is not live" });
          const turns = Array.isArray(body?.turns) ? body.turns.map(normalizeTurnMessage).filter(turn => turn.text.trim()) : [];
          if (!turns.length) return writeJson(res, 400, { ok: false, message: "turns must contain at least one non-empty message" });
          const execution = await ctx.commands.execute(agent, `/inject-turn ${JSON.stringify(turns)}`, [], new AbortController().signal);
          if (execution === undefined) return writeJson(res, 500, { ok: false, message: "inject-turn command is not registered" });
          if (execution.result.kind === "error") return writeJson(res, 400, { ok: false, message: execution.result.text });
          writeJson(res, 200, { ok: true, count: turns.length });
```

</details>

**依据 4 · 源码核查**：[src/index.js:297-301](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L297-L301)

原请求使用形状判定。

```text
export function isLoopRequest(options) {
  return Object.isFrozen(options)
    && typeof options.sessionId === "string"
    && Array.isArray(options.messages);
}
```

**依据 5 · 源码核查**：[src/index.js:115-119](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L115-L119)

默认项与会话显式设置合并。

```text
/** 该会话当前生效的预设：默认启用项叠加会话内显式开关。 */
function activePresets(ctx, config, id, route = {}) {
  const defaults = defaultPresetIds(config.presets, currentAgentPresetId(ctx, id), route.model, route.provider);
  const active = new Set(sessions.activeIds(id, defaults));
  return config.presets.filter(preset => active.has(preset.id));
```

**依据 6 · 源码核查**：[src/schema.js:257-278](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/schema.js#L257-L278)

模式匹配和默认的模型及预设条件。

<details>
<summary>查看原文（22行）</summary>

```text
export function defaultPresetIds(presets, agentPresetId = null, modelId = null, providerId = null) {
  const knownAgent = typeof agentPresetId === "string" && agentPresetId.length > 0;
  const model = typeof modelId === "string" ? modelId.trim() : "";
  const provider = typeof providerId === "string" ? providerId.trim() : "";
  const modelKeys = new Set();
  if (model) {
    modelKeys.add(model);
    if (provider) modelKeys.add(`${provider}/${model}`);
  }
  return (presets ?? [])
    .filter(preset => {
      if (preset.createMode === true && knownAgent && agentPresetId === `inject-${preset.id}`) {
        return true;
      }
      if (preset.defaultEnabled !== true) return false;
      const agentScope = Array.isArray(preset.agentPresets) ? preset.agentPresets : [];
      if (agentScope.length > 0 && !(knownAgent && agentScope.includes(agentPresetId))) return false;
      const modelScope = Array.isArray(preset.models) ? preset.models : [];
      if (modelScope.length > 0 && !modelScope.some(value => modelKeys.has(value))) return false;
      return true;
    })
    .map(preset => preset.id);
```

</details>

**依据 7 · 源码核查**：[src/session-state.js:25-38](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/session-state.js#L25-L38)

显式状态能否覆盖默认。

<details>
<summary>查看原文（14行）</summary>

```text
    activeIds(id, defaultIds = []) {
      const explicit = overrides.get(id);
      const active = cleared.has(id) ? [] : defaultIds.filter(presetId => explicit?.get(presetId) !== false);
      for (const [presetId, on] of explicit ?? []) {
        if (on && !active.includes(presetId)) active.push(presetId);
      }
      return active;
    },

    /** 显式启用/关闭某预设；关闭会覆盖该预设的「默认启用」。 */
    toggle(id, presetId, on) {
      const map = overrides.get(id) ?? new Map();
      map.set(presetId, on);
      overrides.set(id, map);
```

</details>

**依据 8 · 源码核查**：[src/transform.js:45-70](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/transform.js#L45-L70)

仅按范围复制文本，编译失败被排除。

<details>
<summary>查看原文（26行）</summary>

```text
function mapContent(content, change) {
  if (typeof content === "string") return change(content);
  if (!Array.isArray(content)) return content;
  return content.map(block => block?.type === "text" && typeof block.text === "string" ? { ...block, text: change(block.text) } : block);
}

/** 复制消息并只改文本块，保持原始 surface 与 UI 投影不变。 */
export function transformMessages(messages, presets) {
  const rules = presets.flatMap(p => p.rules).filter(r => {
    if (!r.enabled || !r.pattern || !r.targets.length) return false;
    try { compileRule(r); return true; } catch { return false; }
  });
  const compiled = rules.map(rule => ({ rule, compiled: compileRule(rule) }));
  if (!compiled.length) return messages;
  return messages.map(message => {
    const role = roleOf(message);
    const applicable = role === null ? [] : compiled.filter(({ rule }) => rule.targets.includes(role));
    if (!applicable.length) return message;
    let changed = false;
    const content = mapContent(message.content, text => {
      const next = applyRulesToText(text, applicable, role);
      changed ||= next !== text;
      return next;
    });
    return changed ? { ...message, content } : message;
  });
```

</details>

**依据 9 · 源码核查**：[src/transform.js:73-80](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/transform.js#L73-L80)

构造角色映射。

```text
export function templateToMessages(turns) {
  return turns.map((turn, index) => {
    const content = [{ type: "text", text: turn.text }];
    if (turn.role === "system") return createSystemMessage(turn.text);
    if (turn.role === "assistant") return createAssistantMessage({ content, source: { kind: "model", provider: "dsh-inject", model: "template" } });
    if (turn.role === "tool") return createUserMessage({ content: [{ type: "text", text: `[工具返回] ${turn.text}` }], source: { kind: "dsh-inject", form: "notice", summary: `注入工具上下文 ${index + 1}` } });
    return createUserMessage({ content, source: { kind: "dsh-inject", form: "notice", summary: `注入回合 ${index + 1}` } });
  });
```

**依据 10 · 源码核查**：[src/index.js:241-245](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L241-L245)

插入位置保留首系统项。

```text
export function insertPrefix(messages, prefix) {
  if (!prefix.length) return messages;
  const head = messages[0]?.role === "system" ? 1 : 0;
  return [...messages.slice(0, head), ...prefix, ...messages.slice(head)];
}
```

**依据 11 · 源码核查**：[src/index.js:398-415](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L398-L415)

实际取队列、改消息并再次调用 llm.stream。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.on("llm/stream", (options, next) => {
    if (!isLoopRequest(options) || transformedRequests.has(options)) return next();
    const id = sessionKey(options.sessionId);
    const config = readConfig(rawConfig);
    const presets = activePresets(ctx, config, id, routeOf(options));
    const hasRule = presets.some(preset => preset.rules.some(rule => rule.enabled && rule.pattern));
    const hasSection = presets.some(preset => typeof preset.systemPrompt === "string" && preset.systemPrompt.trim().length > 0);
    const pending = sessions.take(id);
    const prefix = [...presets.flatMap(preset => preset.turns), ...pending];
    if (!prefix.length && !hasRule && !hasSection) return next();
    const rewritten = transformMessages(options.messages, presets);
    const messages = insertPrefix(rewritten, templateToMessages(prefix));
    if (messages === options.messages) return next();
    announceAutoPresets(ctx, id, presets, currentAgentPresetId(ctx, id));
    const request = { ...options, messages };
    transformedRequests.add(request);
    return ctx.llm.stream(request);
  });
```

</details>

#### 缺口

- 没有 DSH 或 provider 实际序列化结果。
  **影响**：不同模型对同一角色的解释可能不同。
  **进一步探讨**：用假端点记录请求，验证模板顺序和作用域。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 请求副本、会话日志与失败分别能证明什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

原消息数组不是覆写目标，但命令结果可留下截短预览，自动启用也会追加 command/run 和 command/done。记录是启用或排队证据，不能证明请求收到。仅系统段时流路径可能沿用同一数组而跳过自动记录，反过来有合法但无命中规则时也会创建新数组。一次性队列先取出并删除，再发给 provider，当前回调未见失败复位。clear 只清预设覆盖与默认资格，不清待注入构造回合，Agent dispose 才同时清状态。冻结形状是兼容判断，无法证明所有 provider 接收角色一致。默认模型范围只约束默认自动项，显式开启及模式匹配可走其他分支。Web 路由使用宿主 admit，但远程导入代理的本地代码仅检查 HTTP(S) 前缀后 fetch 文本，未见网络目标和响应字节的同级限制；宿主外层和部署网络策略未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:145-169](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L145-L169)

自动启用的会话日志与记录失败。

<details>
<summary>查看原文（25行）</summary>

```text
function announceAutoPresets(ctx, id, presets, agentPresetId) {
  const announced = sessions.announcedIds(id);
  const fresh = presets.filter(preset =>
    !announced.has(preset.id)
    && (preset.turns.length > 0
      || preset.rules.some(rule => rule.enabled && rule.pattern)
      || (typeof preset.systemPrompt === "string" && preset.systemPrompt.trim().length > 0))
  );
  if (!fresh.length) return;
  const session = ctx.agents.get(id)?.session;
  if (session === undefined) return;
  const commandId = "cmd-inject-auto-" + crypto.randomUUID();
  try {
    session.append("command/run", {
      commandId,
      name: "inject",
      args: "on " + fresh.map(preset => preset.id).join(" "),
      source: { kind: "user" }
    });
    session.append("command/done", { commandId, kind: "success", text: autoActivationText(fresh, agentPresetId) });
  } catch (error) {
    ctx.logger?.warn?.("dsh-inject: auto activation record failed: " + (error?.message ?? error));
    return;
  }
  sessions.markAnnounced(id, fresh.map(preset => preset.id));
```

</details>

**依据 2 · 源码核查**：[src/index.js:220-225](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L220-L225)

排队回执含预览。

```text
      const normalized = Array.isArray(turns) ? turns.map(normalizeTurnMessage).filter(turn => turn.text.trim()) : [];
      if (!normalized.length) return { kind: "error", text: "构造回合不能为空" };
      const id = sessionKey(agent);
      if (sessions.queue(id, normalized) === null) return { kind: "error", text: `待注入消息过多（上限 ${MAX_PENDING_TURNS} 条），请先发送一次消息消费队列` };
      const lines = normalized.map((turn, index) => `${index + 1}. [${turn.role}] ${previewText(turn.text)}`);
      return { kind: "success", text: [`已排队 ${normalized.length} 条构造消息，将在下一次模型请求注入：`, ...lines].join("\n") };
```

**依据 3 · 源码核查**：[src/command-input.js:27-43](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/command-input.js#L27-L43)

预览裁剪与规则数量摘要。

<details>
<summary>查看原文（17行）</summary>

```text
export function previewText(text, max = 60) {
  const line = String(text ?? "").replace(/\s+/g, " ").trim();
  return line.length > max ? `${line.slice(0, max)}…` : line;
}

export function countLabel(count, label) {
  return `${label} ${count} 条`;
}

/** 一个预设的注入内容摘要（构造回合 + 替换规则），命令结果与状态展示共用。 */
export function presetInjectionSummary(preset, indent = "  ") {
  const lines = [];
  if (typeof preset.systemPrompt === "string" && preset.systemPrompt.trim()) lines.push("系统段 1 段");
  if (preset.turns.length) {
    lines.push(countLabel(preset.turns.length, "构造回合"));
    preset.turns.forEach((turn, index) => lines.push(`${indent}${index + 1}. [${turn.role}] ${previewText(turn.text)}`));
  }
```

</details>

**依据 4 · 源码核查**：[src/transform.js:53-70](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/transform.js#L53-L70)

无匹配也可能返回新数组。

<details>
<summary>查看原文（18行）</summary>

```text
  const rules = presets.flatMap(p => p.rules).filter(r => {
    if (!r.enabled || !r.pattern || !r.targets.length) return false;
    try { compileRule(r); return true; } catch { return false; }
  });
  const compiled = rules.map(rule => ({ rule, compiled: compileRule(rule) }));
  if (!compiled.length) return messages;
  return messages.map(message => {
    const role = roleOf(message);
    const applicable = role === null ? [] : compiled.filter(({ rule }) => rule.targets.includes(role));
    if (!applicable.length) return message;
    let changed = false;
    const content = mapContent(message.content, text => {
      const next = applyRulesToText(text, applicable, role);
      changed ||= next !== text;
      return next;
    });
    return changed ? { ...message, content } : message;
  });
```

</details>

**依据 5 · 源码核查**：[src/index.js:398-415](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L398-L415)

队列先取出、对象身份和记录的顺序。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.on("llm/stream", (options, next) => {
    if (!isLoopRequest(options) || transformedRequests.has(options)) return next();
    const id = sessionKey(options.sessionId);
    const config = readConfig(rawConfig);
    const presets = activePresets(ctx, config, id, routeOf(options));
    const hasRule = presets.some(preset => preset.rules.some(rule => rule.enabled && rule.pattern));
    const hasSection = presets.some(preset => typeof preset.systemPrompt === "string" && preset.systemPrompt.trim().length > 0);
    const pending = sessions.take(id);
    const prefix = [...presets.flatMap(preset => preset.turns), ...pending];
    if (!prefix.length && !hasRule && !hasSection) return next();
    const rewritten = transformMessages(options.messages, presets);
    const messages = insertPrefix(rewritten, templateToMessages(prefix));
    if (messages === options.messages) return next();
    announceAutoPresets(ctx, id, presets, currentAgentPresetId(ctx, id));
    const request = { ...options, messages };
    transformedRequests.add(request);
    return ctx.llm.stream(request);
  });
```

</details>

**依据 6 · 源码核查**：[src/session-state.js:41-45](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/session-state.js#L41-L45)

clear 只改预设状态。

```text
    /** 关闭该会话全部预设，并让本会话不再自动吃「默认启用」。 */
    clear(id) {
      overrides.delete(id);
      cleared.add(id);
    },
```

**依据 7 · 源码核查**：[src/session-state.js:64-85](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/session-state.js#L64-L85)

取走即删除，dispose 清队列和覆盖。

<details>
<summary>查看原文（22行）</summary>

```text
    queue(id, turns) {
      if (!turns.length) return pending.get(id)?.length ?? 0;
      const next = [...(pending.get(id) ?? []), ...turns];
      if (next.length > MAX_PENDING_TURNS) return null;
      pending.set(id, next);
      return next.length;
    },

    /** 取出并清空待注入回合：同一批只在一次请求里生效。 */
    take(id) {
      const turns = pending.get(id) ?? [];
      pending.delete(id);
      return turns;
    },

    /** 会话结束时丢弃全部会话级状态。 */
    drop(id) {
      overrides.delete(id);
      cleared.delete(id);
      pending.delete(id);
      announced.delete(id);
    }
```

</details>

**依据 8 · 源码核查**：[src/schema.js:266-278](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/schema.js#L266-L278)

模式与默认范围不同。

<details>
<summary>查看原文（13行）</summary>

```text
  return (presets ?? [])
    .filter(preset => {
      if (preset.createMode === true && knownAgent && agentPresetId === `inject-${preset.id}`) {
        return true;
      }
      if (preset.defaultEnabled !== true) return false;
      const agentScope = Array.isArray(preset.agentPresets) ? preset.agentPresets : [];
      if (agentScope.length > 0 && !(knownAgent && agentScope.includes(agentPresetId))) return false;
      const modelScope = Array.isArray(preset.models) ? preset.models : [];
      if (modelScope.length > 0 && !modelScope.some(value => modelKeys.has(value))) return false;
      return true;
    })
    .map(preset => preset.id);
```

</details>

**依据 9 · 源码核查**：[src/index.js:283-285](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L283-L285)

宿主 admit 是外部入口前置。

```text
function admitRequest(connection, req) {
  const admission = connection.admit({ headers: req.headers });
  return admission.rejection ? { rejection: admission.rejection } : {};
```

**依据 10 · 源码核查**：[src/index.js:366-389](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L366-L389)

远程下载入口只检查协议前缀及依次尝试。

<details>
<summary>查看原文（24行）</summary>

```text
        if (req.method !== "POST") return writeJson(res, 405, { ok: false, message: "method not allowed" });
        const admission = admitRequest(child.connection, req);
        if (admission.rejection) return writeJson(res, admission.rejection, { ok: false, message: "request rejected" });
        void readJsonBody(req).then(async body => {
          const url = typeof body?.url === "string" ? body.url.trim() : "";
          if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
            return writeJson(res, 400, { ok: false, message: "valid http(s) url is required" });
          }
          const mirror = mirrorUrl(url);
          const candidates = [{ label: "raw", url, timeout: REMOTE_TIMEOUT_MS }];
          if (mirror) candidates.push({ label: "jsDelivr", url: mirror, timeout: MIRROR_TIMEOUT_MS });

          const failures = [];
          for (const candidate of candidates) {
            try {
              const text = await fetchRemoteText(candidate.url, candidate.timeout);
              return writeJson(res, 200, { ok: true, text });
            } catch (err) {
              failures.push(`${candidate.label}: ${err.message}`);
            }
          }
          writeJson(res, 502, {
            ok: false,
            message: `Failed to fetch remote URL (${failures.join("; ")})`
```

</details>

**依据 11 · 源码核查**：[src/index.js:38-52](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L38-L52)

实际 fetch 与文本读取有时间但未设大小上限。

<details>
<summary>查看原文（15行）</summary>

```text
async function fetchRemoteText(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "dsh-inject (DeepSeek Harness plugin)" }
    });
    if (!resp.ok) throw new Error(`remote server returned HTTP ${resp.status}`);
    return await resp.text();
  } catch (err) {
    if (err?.name === "AbortError") throw new Error(`timed out after ${timeoutMs / 1000}s`);
    throw err;
  } finally {
    clearTimeout(timer);
```

</details>

#### 缺口

- 未测 Host 与提供商、在途失败或代理网络隔离。
  **影响**：禁用和成功记录若被误读，可能外发未预期数据。
  **进一步探讨**：用非敏感本地替身测排队、清理、失败及实际入站。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、Web 设置、请求和清理有哪些成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

固定根包 0.3.3，Node >=22.5，依赖相容宿主 llm、agents、commands、settings、sessionProjections、loader；可选系统段、模式和 Web 路由需要额外服务。客户端可通过 configForms 修改两类数组，是宿主管理的设置，而会话级状态在进程内。空数组会回退作者内置配置，不能仅以删除数组内容证明无预设。请求每次添加常驻内容可能增加模型上下文。退出要区分停用预设、清临时队列、持久配置及留存的命令摘要，按测试会话和提供商数据分别核对。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:63-89](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/package.json#L63-L89)

宿主 Web 声明与 Node 及 peer 约束。

<details>
<summary>查看原文（27行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    }
  },
  "devDependencies": {
    "@deepseek-ai/dsh-client-ui-settings": "0.2.1-rc.2",
    "@deepseek-ai/dsh-llm": "0.2.1-rc.2",
    "@deepseek-ai/schemastery": "3.18.5",
    "@types/react": "~18.3.1",
    "esbuild": "^0.28.2",
    "react": "^18.3.1"
  },
  "engines": {
    "node": ">=22.5"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-llm": "^0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-settings": "^0.2.1-rc.2",
    "@deepseek-ai/schemastery": "~3.18.5"
  }
```

</details>

**依据 2 · 源码核查**：[src/index.js:9-17](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L9-L17)

必需服务和进程状态。

```text
export const name = "dsh-inject";
export const inject = ["agents", "llm", "commands", "settings", "sessionProjections", "loader"];
export const Config = z.object({
  presets: z.array(z.any()).default([]).volatile(),
  templates: z.array(z.any()).default([]).volatile()
});

const sessions = createSessionState();
const transformedRequests = new WeakSet();
```

**依据 3 · 源码核查**：[src/index.js:303-333](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L303-L333)

可选服务和会话清理事件。

<details>
<summary>查看原文（31行）</summary>

```text
export function apply(ctx, rawConfig = {}) {
  // 真正的 system prompt 段：比「伪造 system 消息」更贴近宿主组装顺序，且每轮按
  // 当前 session / agent preset / model 重新计算，不落盘、不污染会话。
  ctx.inject(["systemPrompt"], child => {
    child.effect(() => child.systemPrompt.section({
      name: "dsh-inject",
      order: 5100,
      interpolate: false,
      text: context => systemSectionForAgent(ctx, readConfig(rawConfig), context?.agent)
    }));
  });
  ctx.inject(["settings"], child => {
    child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
  });
  // 动态注册开启了「创建为模式」的 agent preset (inject-{id})。没有 agentPresets 服务的 profile 自动跳过。
  ctx.inject(["agentPresets"], child => {
    const manager = createAgentPresetManager(child.agentPresets, child.logger, child.loader);
    child.effect(() => {
      void manager.sync(readConfig(rawConfig).presets);
      const onUpdate = () => {
        void manager.sync(readConfig(rawConfig).presets);
      };
      child.on?.("loader/volatile-update", onUpdate);
      child.on?.("settings/document-updated", onUpdate);
      return () => {
        manager.dispose();
      };
    });
  });
  ctx.effect(() => registerCommands(ctx, rawConfig));
  ctx.on("agent/disposed", ({ agent }) => sessions.drop(sessionKey(agent)));
```

</details>

**依据 4 · 源码核查**：[src/index.js:335-343](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L335-L343)

Web 提交需 webServer 与 connection。

```text
  // 现场 dialog 的投递通道：走宿主命令生命周期，让注入在会话里留下一条可折叠记录。
  ctx.inject(["webServer", "connection"], child => {
    child.effect(() => child.webServer.register({
      kind: "exact",
      path: "/dsh-inject/turns",
      handler: (req, res) => {
        if (req.method !== "POST") return writeJson(res, 405, { ok: false, message: "method not allowed" });
        const admission = admitRequest(child.connection, req);
        if (admission.rejection) return writeJson(res, admission.rejection, { ok: false, message: "request rejected" });
```

**依据 5 · 源码核查**：[src/client/config-store.js:11-23](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/client/config-store.js#L11-L23)

配置通过宿主服务持久提交。

<details>
<summary>查看原文（13行）</summary>

```text
export function readConfig(scope) {
  const value = scope.getSnapshot().value;
  return normalizeConfig({
    presets: Array.isArray(value?.presets) && value.presets.length ? value.presets : undefined,
    templates: Array.isArray(value?.templates) && value.templates.length ? value.templates : undefined
  });
}

export function writeConfig(scope, config) {
  return scope.mutate([
    { op: "set", path: ["presets"], value: config.presets },
    { op: "set", path: ["templates"], value: config.templates }
  ]);
```

</details>

**依据 6 · 源码核查**：[src/schema.js:281-291](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/schema.js#L281-L291)

空配置回退至内置。

<details>
<summary>查看原文（11行）</summary>

```text
export function normalizeConfig(config) {
  const source = config ?? {};
  const rawPresets = Array.isArray(source.presets) ? source.presets : null;
  const rawTemplates = Array.isArray(source.templates) ? source.templates : null;
  const presets = (rawPresets && rawPresets.length > 0)
    ? rawPresets.map(normalizePreset)
    : defaultPresets();
  const templates = (rawTemplates && rawTemplates.length > 0)
    ? rawTemplates.map(normalizeTemplate)
    : defaultTemplates();
  return { presets, templates };
```

</details>

**依据 7 · 作者声明**：[README.md:136-144](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/README.md#L136-L144)

作者区分状态、日志和宿主系统段限制。

```text
- 未在界面上标记被替换的片段（原文照旧显示）。
- `tool` 角色的构造消息会转成带「工具返回」标记的用户上下文，避免出现没有对应工具调用的悬空 tool result。
- 现场 dialog 依赖 `webServer` 与 `connection` 服务；缺失时命令的参数形式仍可用，但窗口内插入会失败。
- 注入记录行渲染在会话聊天区：从未跑过回合的空白会话页显示的是首屏，此时注入记录要等第一次对话后才可见。
- 未对「每次请求实际注入了哪几条」逐请求留痕：常驻预设的注入内容由启用（含自动启用）时的那条记录行说明。
- 会话级启用状态是进程内的：重启后回到只剩「默认启用」预设的状态。
- 系统段依赖宿主的 `systemPrompt` 服务；缺失时该段不注入，其余规则与构造回合不受影响。
- 系统段遵循宿主的系统提示组装规则：如果当前 agent preset 使用 complete 系统提示（例如 minimal），宿主只保留 complete 段，系统段不会进入请求；这类模式请用「开头构造回合」承载系统文字。
- 「创建为模式」的能力行取自宿主声明的 `standard` preset，身份行清空但**不**标 complete：标准模式那句 persona 被换掉，宿主其余系统段（含工具说明、plan 政策）照常进入请求。profile 没有 `standard` preset 时不注册模式（进程日志里会说明）。
```

#### 缺口

- 实际版本、请求费用和日志留存周期未知。
  **影响**：测试材料也可能被命令或供应商保留。
  **进一步探讨**：只用无敏感标记，记录前后 token 与可清理记录。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证无害对照的作用域和可复盘性？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先保持观察。用两个隔离会话、同一假端点和无害标记，对比手工前置文本、常驻预设和单次队列。分别检查禁用默认、模型切换、clear 后仍有队列和上游失败，核对宿主日志、下游真实请求和第二会话。假设将预设状态、排队、实际转发和请求结果分别标识且只记录非敏感摘要，可降低把激活当作已送达的误判。遇到未预期文本、日志与发送不符或代理范围不可确认时停用，并从干净会话回到手工提示。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:398-415](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L398-L415)

能观察取队列、实际转发与原日志差异。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.on("llm/stream", (options, next) => {
    if (!isLoopRequest(options) || transformedRequests.has(options)) return next();
    const id = sessionKey(options.sessionId);
    const config = readConfig(rawConfig);
    const presets = activePresets(ctx, config, id, routeOf(options));
    const hasRule = presets.some(preset => preset.rules.some(rule => rule.enabled && rule.pattern));
    const hasSection = presets.some(preset => typeof preset.systemPrompt === "string" && preset.systemPrompt.trim().length > 0);
    const pending = sessions.take(id);
    const prefix = [...presets.flatMap(preset => preset.turns), ...pending];
    if (!prefix.length && !hasRule && !hasSection) return next();
    const rewritten = transformMessages(options.messages, presets);
    const messages = insertPrefix(rewritten, templateToMessages(prefix));
    if (messages === options.messages) return next();
    announceAutoPresets(ctx, id, presets, currentAgentPresetId(ctx, id));
    const request = { ...options, messages };
    transformedRequests.add(request);
    return ctx.llm.stream(request);
  });
```

</details>

**依据 2 · 源码核查**：[src/session-state.js:41-45](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/session-state.js#L41-L45)

clear 与队列分开。

```text
    /** 关闭该会话全部预设，并让本会话不再自动吃「默认启用」。 */
    clear(id) {
      overrides.delete(id);
      cleared.add(id);
    },
```

**依据 3 · 源码核查**：[src/session-state.js:72-85](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/session-state.js#L72-L85)

队列消费和 Agent 清理。

<details>
<summary>查看原文（14行）</summary>

```text
    /** 取出并清空待注入回合：同一批只在一次请求里生效。 */
    take(id) {
      const turns = pending.get(id) ?? [];
      pending.delete(id);
      return turns;
    },

    /** 会话结束时丢弃全部会话级状态。 */
    drop(id) {
      overrides.delete(id);
      cleared.delete(id);
      pending.delete(id);
      announced.delete(id);
    }
```

</details>

**依据 4 · 源码核查**：[src/index.js:145-169](https://github.com/john-walks-slow/dsh-inject/blob/31947fed401d07b4e15f1c2e82a7aae7421ea39a/src/index.js#L145-L169)

启用事件与请求结果分开。

<details>
<summary>查看原文（25行）</summary>

```text
function announceAutoPresets(ctx, id, presets, agentPresetId) {
  const announced = sessions.announcedIds(id);
  const fresh = presets.filter(preset =>
    !announced.has(preset.id)
    && (preset.turns.length > 0
      || preset.rules.some(rule => rule.enabled && rule.pattern)
      || (typeof preset.systemPrompt === "string" && preset.systemPrompt.trim().length > 0))
  );
  if (!fresh.length) return;
  const session = ctx.agents.get(id)?.session;
  if (session === undefined) return;
  const commandId = "cmd-inject-auto-" + crypto.randomUUID();
  try {
    session.append("command/run", {
      commandId,
      name: "inject",
      args: "on " + fresh.map(preset => preset.id).join(" "),
      source: { kind: "user" }
    });
    session.append("command/done", { commandId, kind: "success", text: autoActivationText(fresh, agentPresetId) });
  } catch (error) {
    ctx.logger?.warn?.("dsh-inject: auto activation record failed: " + (error?.message ?? error));
    return;
  }
  sessions.markAnnounced(id, fresh.map(preset => preset.id));
```

</details>

#### 缺口

- 对照和状态显示的收益未验证。
  **影响**：会话日志并非完整请求轨迹。
  **进一步探讨**：使用无害标记和模拟失败比较误判、token 和回退。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
