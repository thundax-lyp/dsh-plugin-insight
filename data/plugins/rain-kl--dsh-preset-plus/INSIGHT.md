# DSH Preset Plus

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[90674c9](https://github.com/Rain-kl/dsh-preset-plus/tree/90674c90ec91a8c60a52d29e92c5218c0edad8e9)

<!-- BEGIN META -->
[![GitHub ★ 222](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=222&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Rain-kl/dsh-preset-plus) [![npm 30d 945](https://img.shields.io/static/v1?label=npm+30d&message=945&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@rain-kl/dsh-preset-plus) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@rain-kl/dsh-preset-plus)
<!-- END META -->

> **功能**：提供可编辑的 system、user、assistant 预设条目、导入导出和请求预填充。

> **亮点**：[Q01](#research-q01) 将条目编辑/共享和请求编排整合，贡献是配置便利而非已验证破限质量。

> **主要限制**：[Q02](#research-q02) fake有scope门但system section无相同门待宿主核；auto逐请求、全局直接写档/坏态重置与轨迹缺输入影响可靠性。

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
  - [Q01 · 预设编辑器实际增加什么？](#detail-section-11)
  - [Q02 · 作用域、自动模式和存档是否符合表面说明？](#detail-section-12)
  - [Q03 · 依赖、长期使用和退出有什么代价？](#detail-section-13)
  - [Q04 · 采用结论和新方向是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH用户反复维护/切换/分享提示编排，需知道实际模型输入。

原生预设和手工提示管理；伪造历史不等真实模型输出或效果证据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 预设编辑 | 管理条目与分享 | 全局存档/同id替换 |
| 合成消息 | 调整请求上下文 | 非真实历史，效果未验 |
| scopedPresets | fake消息按模式门控 | system作用域另需核 |
| 手动/auto | 控请求注入触发 | auto代码每主请求，不只首条 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH/cordis/agents/llm/systemPrompt | 必需 | 模式和请求接线 | 兼容未验 |
| Web客户端服务/webServer | UI需要 | 编辑持久化 | 外层授权另核 |
| DSH_HOME备份/可信提示 | 采用前提 | 全局存档/请求文本 | 同id导入会替换 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 独立profile备份JSON | 无害预设/明确scope |
| 编辑 | 用户改条目/导入 | 核同id替换和active |
| 运行 | Agent主请求带合成条目 | 抓有效输入/日志而非只状态 |
| 异常退出 | 停插件保坏档恢复 | 切原生模式核无注入 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 原宿主/备份 | 兼容/导入审核 | 时间未知 |
| 持续 | 额外消息token/读盘/日志 | 核有效输入 | 质量与价格未知 |
| 失败恢复 | 备份/坏档 | 识别后写覆盖/重置 | 无版本冲突拒绝 |
| 退出 | 预设/日志仍留 | 切模式/停插件 | 轨迹缺输入需另记 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 编辑共享 | UI/JSON/命令 | 并发保存可靠性 |
| 请求编排 | 合成消息/section | 其他模式实际system边界 |
| 模型效果 | 作者服从目标 | 正确性/破限收益 |
| 可追溯 | 状态/日志部分信息 | 完整有效输入回放 |

> **思考**：[Q02](#research-q02) fake有scope门但system section无相同门待宿主核；auto逐请求、全局直接写档/坏态重置与轨迹缺输入影响可靠性。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将条目编辑/共享和请求编排整合，贡献是配置便利而非已验证破限质量。

[Q02](#research-q02) scopedPresets、WeakSet及旧id过滤真实存在；写档注释不等原子保证，坏态应保留。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) fake有scope门但system section无相同门待宿主核；auto逐请求、全局直接写档/坏态重置与轨迹缺输入影响可靠性。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 独立profile无害预设先核有效输入/作用域与备份恢复，异常停用回原生预设。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持编辑/合成注入；未运行模型/宿主、未验证作者效果，建议观察生产/共享采用。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/core.js、lib/index.js、client.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整读core、README/package，定向index/client与bundle前36行；未审全部bundle原生组合/Host权限，未运行目标/模型。
- 下一步：两模式有效请求、双编辑器/损坏文件/运行中切active、日志/退出与原生预设同任务对照。

**分析版本**

- **仓库**：[Rain-kl/dsh-preset-plus](https://github.com/Rain-kl/dsh-preset-plus)
- **版本号**：0.2.0（[固定提交 90674c9](https://github.com/Rain-kl/dsh-preset-plus/tree/90674c90ec91a8c60a52d29e92c5218c0edad8e9)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) expectedVersion快照/原子存档与有效输入收据可探索；若原生等效或泄露/负担加重即否定。

两模式有效请求、双编辑器/损坏文件/运行中切active、日志/退出与原生预设同任务对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 183 | — | — | 1825 |
| .js | source | 3 | 1041 | 804 | 139 | — |
| .mjs | source | 2 | 180 | 127 | 29 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Rain-kl/dsh-preset-plus/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查预设管理与请求注入实际作用域、审计和持久化边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 预设编辑器实际增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它给DSH用户一套system/user/assistant有序条目编辑、启停、导入导出与全局激活的预设管理，原生插件由lib/index、客户端设置页和bundle模式组成。相对手工改系统提示词/消息，省去重复维护与分享配置步骤；可用于比较不同提示编排。作者主张伪造服从输出来提升破限效果，仅是目标，不是源码能证明的效果。合格结果须在相同模型/任务下得到更可靠且可追溯回答，不是模型更愿答就算正确。

system通过section提供，非system条目作为请求前置的合成消息；这不是模型真正生成的历史，也不是新的模型能力。README已提示伪造消息不进轨迹；使用者应知道回放/审计会缺这段有效输入。只需一个角色提示的用户可用原生预设，不一定需要该层。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:21-60](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/README.md#L21-L60)

作者目标/顺序/轨迹边界。

<details>
<summary>查看原文（40行）</summary>

````text
## 它解决什么

- 破限场景下，伪造模型的服从输出从而提升破限效果。
- 可以很方便的调整自定义模式系统提示词, 并且能够支持导入导出分享提示词

## 工作方式

### 作用域
插件只提供一个固定 DSH 模式 **`preset-plus`**。仅当**当前会话挂载的 preset id ∈ `scopedPresets`**时，才向请求注入预设上下文。

你可以在你可以在设置界面新增多种预设，但是只能同时生效一个。

默认内置 `jailbreak` 预设

其他模式**一律不进行任何注入**。

## 预设界面

![preset-settings.png](docs/assets/preset-settings.png)

### 注入顺序
```
[system 主提示词] → [user 触发] → [assistant 伪装输出] → [真实 user 输入] → [真实模型输出]
```
其中 system/user/assistant 来自你编辑的预设条目；真实输入与输出是会话本就有的。

>注意: 伪造输入无法记录到"轨迹"中, 可以通过查看控制台打印判断是否注入成功
> 
![console-log.png](docs/assets/console-log.png)

### AB 双模式
- **自动（auto，可关）**：第一条真实消息到来时自动注入。
- **手动（/preset-plus prefill）**：用户显式触发，注入标记生效于下一条消息。

## 命令 / 工具

- `/preset-plus status | prefill | on | off | save`
- `/preset-plus list`：列出预设
- `/preset-plus activate <id>`：激活预设
- 模型工具：`preset_plus_status`
````

</details>

**依据 2 · 源码核查**：[package.json:1-10](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/package.json#L1-L10)

原生host/client入口。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "@rain-kl/dsh-preset-plus",
  "version": "0.2.0",
  "description": "DeepSeek Harness universal preset enhancement plugin: an editable preset editor (system/user/assistant entries + camouflage model output prepopulation)",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
```

</details>

**依据 3 · 源码核查**：[lib/index.js:49-81](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/lib/index.js#L49-L81)

实际消息与system来源。

<details>
<summary>查看原文（33行）</summary>

```text
/** 把预设条目的 entries 合成为 [role:user/assistant, ...] fake 消息列表。system 段由
 * systemPrompt.section() 负责，此处只提取 text 供日志显示。 */
function buildInjection(entries, makeUserMessage, makeAssistantMessage, provider, model) {
  // 第一条固定为 system 主提示词，不受 enabled 影响（模型层已强制 enabled）。
  // 其余条目按 enabled === false 跳过（与酒馆一致：每条提示词可单独开启/关闭）。
  const head = entries[0];
  const system = head?.role === "system" ? head.text : undefined;
  const inject = [];
  for (let i = 1; i < entries.length; i++) {
    const e = entries[i];
    if (e.enabled === false) continue;
    if (e.role === "user") inject.push(makeUserMessage({ text: e.text }));
    else if (e.role === "assistant") inject.push(makeAssistantMessage({ text: e.text, provider, model }));
  }
  return { system, inject };
}

function installInjector(ctx, cfg) {
  const injected = new Set();
  const force = new Set();
  const injectedMessageIds = new Map();
  const inFlight = new WeakSet();

  // ★ system 用 systemPrompt.section() 注册，在组装阶段（system-prompt/assemble）
  //    就加入 system，轨迹可见。text 用函数每次从预设动态读取，最新文本自动生效。
  ctx.systemPrompt.section({
    name: "preset-plus",
    order: 100,
    text: () => {
      const entries = core.loadActiveEntries();
      return entries.length > 0 && entries[0].role === "system" ? entries[0].text : "";
    },
  });
```

</details>

#### 缺口

- 相同任务的可靠性/可追溯对照未验。
  **影响**：不能支持破限效果或质量提升。
  **进一步探讨**：只用无害固定任务比较有效输入、回答正确性与审计可还原性。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 作用域、自动模式和存档是否符合表面说明？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

fake消息的llm/stream门核enabled、主purpose、agents取当前preset与scopedPresets，WeakSet防自身递归，旧注入id过滤避免重复携带。这是真实作用域/去重防护；但auto条件未检查injected集合，因此每次主请求都可前置新fake消息，不只是README第一条真实消息。手动force消费后删除。

systemPrompt.section text直接读取全局激活条目，没有同样current preset门；assemble移除三个内置section则有scopedPresets门。服务作用域是否使system也仅目标模式可见要核宿主，不能只据README断言其他模式一律零注入，也不声称已复现全局污染。activePresetId和存档是DSH_HOME全局文件，不是每session副本。

save注释称原子，但真实writeFile直接覆盖无临时rename/版本前置条件；两浏览器保存整doc可能后写覆盖。读取损坏/错误会初始化并异步写回且吞错误，可能掩盖原文件坏态。import同id替换/可改active是真实设计，缺少差异预览或冲突拒绝。HTTP方法和512KiB body上限存在，路由handler未显式鉴权，外层DSH授权未审，不把它说成公网任意写漏洞。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:39-46](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/lib/index.js#L39-L46)

fake作用域门。

```text
function enabledForAgent(agentPresets, agents, sessionId, cfg) {
  if (!cfg.enabled) return false;
  const scopes = Array.isArray(cfg.scopedPresets) ? cfg.scopedPresets : [];
  if (scopes.length === 0) return false;
  const agent = agents.get(sessionId);
  if (agent === undefined) return false;
  const current = agentPresets.composedPreset(agent.ctx);
  return scopes.includes(current);
```

**依据 2 · 源码核查**：[lib/index.js:72-146](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/lib/index.js#L72-L146)

system无同门/assemble限定/auto逐请求。

<details>
<summary>查看原文（75行）</summary>

```text
  // ★ system 用 systemPrompt.section() 注册，在组装阶段（system-prompt/assemble）
  //    就加入 system，轨迹可见。text 用函数每次从预设动态读取，最新文本自动生效。
  ctx.systemPrompt.section({
    name: "preset-plus",
    order: 100,
    text: () => {
      const entries = core.loadActiveEntries();
      return entries.length > 0 && entries[0].role === "system" ? entries[0].text : "";
    },
  });

  // 移除 preset-plus 模式下内置 context section（harness:source、app:web-surface 等），
  // 它们由 session-reference、web-server 等插件注入，system 中占大量篇幅且破限模式不需要。
  ctx.on("system-prompt/assemble", (assembly, context, next) => {
    if (context.agent) {
      const agentPresets = ctx.get("agentPresets");
      if (agentPresets) {
        const current = agentPresets.composedPreset(context.agent.ctx);
        if (cfg.scopedPresets.includes(current)) {
          const builtinNames = ["harness:identity", "harness:source", "app:web-surface"];
          assembly.sections = assembly.sections.filter((s) => !builtinNames.includes(s.name));
        }
      }
    }
    return next();
  }, { global: true });

  ctx.on("llm/stream", (options, next) => {
    if (inFlight.has(options)) return next();

    const sessionId = options.sessionId;
    const agentPresets = ctx.get("agentPresets");

    const isMain = options.purpose === undefined;
    const entries = core.loadActiveEntries();
    const autoModeOn = (() => {
      try { return core.loadActivePreset()?.autoMode !== false; } catch { return true; }
    })();
    const wantsForce = force.has(sessionId);

    const shouldInject = (
      isMain
      && enabledForAgent(agentPresets, ctx.agents, sessionId, cfg)
      && (autoModeOn || wantsForce)
    );
    if (!shouldInject) return next();
    if (entries.length === 0) return next();

    // ★ buildInjection 仍返回 system（日志用），但 system 不再放入 options。
    //    只使用 inject（fake 消息）。
    const { system, inject } = buildInjection(
      entries,
      (t) => makeUser(ctx, t.text),
      (t) => makeAssistant(ctx, t.text, t.provider, t.model),
      options.provider,
      options.model,
    );

    injected.add(sessionId);
    force.delete(sessionId);

    const oldIds = injectedMessageIds.get(sessionId) || new Set();
    const sourceMessages = (options.messages || []).filter((message) => !oldIds.has(message?.id));
    injectedMessageIds.set(sessionId, new Set(inject.map((message) => message.id)));

    console.log("[preset-plus] injected → session=" + sessionId +
      ", inject=" + inject.length + ", system=[" + (system ?? "").slice(0, 100).replace(/\n/g, "↵") + (String(system ?? "").length > 100 ? "…]" : "]"));

    // ★ mutableOptions 不再放 system——systemPrompt.section 已在组装时负责。
    const mutableOptions = {
      ...options,
      ...(inject.length > 0 ? { messages: [...inject, ...sourceMessages] } : { messages: sourceMessages }),
    };
    inFlight.add(mutableOptions);
    return ctx.llm.stream(mutableOptions);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:149-161](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/lib/index.js#L149-L161)

手动标记消费/状态。

<details>
<summary>查看原文（13行）</summary>

```text
  return {
    prefill(sessionId) {
      if (!enabledForAgent(ctx.get("agentPresets"), ctx.agents, sessionId, cfg)) {
        return { ok: false, reason: "not-in-scope" };
      }
      force.add(sessionId);
      return { ok: true, sessionId };
    },
    isInjected(sessionId) { return injected.has(sessionId); },
    reset(sessionId) {
      injected.delete(sessionId);
      force.delete(sessionId);
      injectedMessageIds.delete(sessionId);
```

</details>

**依据 4 · 源码核查**：[lib/core.js:178-202](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/lib/core.js#L178-L202)

损坏初始化/直接writeFile。

<details>
<summary>查看原文（25行）</summary>

```text
export function loadMultiPreset() {
  const fp = storePath();
  try {
    if (fs.existsSync(fp)) {
      const parsed = JSON.parse(fs.readFileSync(fp, "utf8"));
      return normalizeMultiPreset(parsed);
    }
  } catch {
    // 读失败/损坏 → 走初始化
  }
  const doc = initMultiPreset();
  // 首次初始化：异步写回（不阻塞读取方）。
  fsp.mkdir(path.dirname(fp), { recursive: true }).then(() =>
    fsp.writeFile(fp, JSON.stringify(doc, null, 2), "utf8"),
  ).catch(() => {});
  return doc;
}

/** 写回多预设文档（原子）。 */
export async function saveMultiPreset(doc) {
  const normalized = normalizeMultiPreset(doc);
  const fp = storePath();
  await fsp.mkdir(path.dirname(fp), { recursive: true });
  await fsp.writeFile(fp, JSON.stringify(normalized, null, 2), "utf8");
  return normalized;
```

</details>

**依据 5 · 源码核查**：[lib/core.js:259-276](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/lib/core.js#L259-L276)

导入替换与active。

<details>
<summary>查看原文（18行）</summary>

```text
export function importPresetJson(doc, parsed) {
  if (isMultiPresetJson(parsed)) {
    const imported = normalizeMultiPreset(parsed);
    const presets = { ...doc.presets };
    for (const [id, p] of Object.entries(imported.presets)) presets[id] = p;
    const result = { ...doc, presets };
    // activePresetId：导入的有效则采用，否则保留原 active
    const requestedActive = typeof parsed.activePresetId === "string"
      ? parsed.activePresetId
      : imported.activePresetId;
    const active = (requestedActive && presets[requestedActive])
      ? requestedActive
      : doc.activePresetId;
    return { ...result, activePresetId: active };
  }
  // 单条
  const single = normalizeSinglePreset(parsed, parsed?.id || parsed?.name);
  return upsertPreset(doc, single);
```

</details>

**依据 6 · 源码核查**：[lib/index.js:198-240](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/lib/index.js#L198-L240)

方法/body上限而授权依宿主。

<details>
<summary>查看原文（43行）</summary>

```text
function installWebServer(ctx, cfg, injector) {
  ctx.inject(["webServer"], (host) => {
    host.effect(() => {
      const json = (res, status, payload) => {
        res.writeHead(status, { "cache-control": "no-store", "content-type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(payload));
      };
      const readBody = async (req) => {
        const chunks = []; let size = 0;
        for await (const chunk of req) {
          const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          size += buf.length;
          if (size > 512 * 1024) throw new Error("body too large");
          chunks.push(buf);
        }
        return JSON.parse(Buffer.concat(chunks).toString("utf8"));
      };

      // GET: 多预设 doc + 作用域状态
      host.webServer.register({
        kind: "exact",
        path: "/dsh-preset-plus/state",
        handler: async (req, res) => {
          if (req.method !== "GET") { res.writeHead(405, { allow: "GET" }); res.end(); return; }
          try {
            const doc = core.loadMultiPreset();
            json(res, 200, { ok: true, doc, scopedPresets: cfg.scopedPresets, dshHome: core.findDshHome() });
          } catch (e) { json(res, 500, { ok: false, error: String(e) }); }
        },
      }, "dsh-preset-plus: state");

      // POST: 保存整份多预设 doc（设置页用它持久化当前编辑态）
      host.webServer.register({
        kind: "exact",
        path: "/dsh-preset-plus/save",
        handler: async (req, res) => {
          if (req.method !== "POST") { res.writeHead(405, { allow: "POST" }); res.end(); return; }
          try {
            const body = await readBody(req);
            const doc = body?.doc && typeof body.doc === "object" ? body.doc : {};
            const saved = await core.saveMultiPreset(doc);
            json(res, 200, { ok: true, doc: saved });
          } catch (e) { json(res, 500, { ok: false, error: String(e) }); }
```

</details>

**依据 7 · 源码核查**：[client.js:54-61](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/client.js#L54-L61)

整份doc保存无版本。

```text
		const persist = useCallback((nextDoc, okText) => {
			setBusy(true);
			setNotice({ kind: "idle", text: "" });
			fetch("/dsh-preset-plus/save", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ doc: nextDoc }) })
				.then((r) => r.json()).then((d) => {
					if (d.ok) { setDoc(d.doc); setNotice({ kind: "ok", text: okText || "已保存。新会话生效。" }); }
					else { setNotice({ kind: "error", text: "保存失败: " + (d.error || "") }); }
				}).catch((e) => setNotice({ kind: "error", text: "保存失败: " + e.message })).finally(() => setBusy(false));
```

#### 缺口

- 宿主section实际scope/路由授权与并发保存未验。
  **影响**：其他模式影响和持久化恢复无法保证。
  **进一步探讨**：两模式抓有效system，双窗口编辑同doc/损坏文件副本核覆盖与恢复。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、长期使用和退出有什么代价？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要匹配DSH/cordis^4.0.1、systemPrompt/llm/agents/tools及可用agentPresets；Web设置另需connection/locale/ui-settings和webServer。bundle声明preset-plus模式及现成原生工具，隔离realm不等文件全局存档隔离；本轮只读bundle前段与host关键接线，不验所有附带工具组合。

首次需备份preset-plus.json并审导入文本，持续每主请求多fake上下文与读盘、日志输出前100字system，verbose默认false并不控制该console.log；敏感提示不应默认放此层。原文模型输入增加token但未测质量/现金。用户以为新会话才生效，而section函数每组装读active、fake也每调用读，实际影响应抓包核，不把保存提示当冻结快照。失败先保坏文件/导出，勿反复加载触发初始化覆盖；退出换回原模式/停插件并保已授权预设备份，既有会话有效输入回放仍需另记。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:46-61](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/package.json#L46-L61)

宿主依赖。

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings"
      ]
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1"
  }
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:10-36](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/cordis.patch.yml#L10-L36)

插件/模式声明。

<details>
<summary>查看原文（27行）</summary>

```text
- insert:
    - id: dsh-preset-plus
      name: '@rain-kl/dsh-preset-plus'
      config:
        enabled: true
        scopedPresets: ["preset-plus"]
        verbose: false

    # PresetPlus — the fixed agent mode supplied by dsh-preset-plus.
    #
    # This is an AGENT-PLANE composition (copied from the shipped `standard`
    # preset). The roster mounts it ONCE under a standing scope; every session
    # naming `preset-plus` joins by scope parentage, so the tools registered here
    # cover each joined agent. The system prompt comes from the plugin at runtime
    # (`systemPrompt.section`), so this list carries no persona row.
    #
    # A service row here MUST sit inside a group carrying an `isolate` realm.
    # `true` means an entry-local realm: this standing mount's own private
    # instance, apart from every other preset's.
    - id: preset-preset-plus
      name: '@deepseek-ai/dsh-agent-preset'
      config:
        id: preset-plus
        name: PresetPlus
        description: PresetPlus模式。可动态应用不同的预设。具备标准模式所有的能力.
        order: 5
        plugins:
```

</details>

**依据 3 · 源码核查**：[lib/index.js:74-79](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/lib/index.js#L74-L79)

system动态读。

```text
  ctx.systemPrompt.section({
    name: "preset-plus",
    order: 100,
    text: () => {
      const entries = core.loadActiveEntries();
      return entries.length > 0 && entries[0].role === "system" ? entries[0].text : "";
```

**依据 4 · 源码核查**：[lib/index.js:106-138](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/lib/index.js#L106-L138)

逐请求读与日志。

<details>
<summary>查看原文（33行）</summary>

```text
    const entries = core.loadActiveEntries();
    const autoModeOn = (() => {
      try { return core.loadActivePreset()?.autoMode !== false; } catch { return true; }
    })();
    const wantsForce = force.has(sessionId);

    const shouldInject = (
      isMain
      && enabledForAgent(agentPresets, ctx.agents, sessionId, cfg)
      && (autoModeOn || wantsForce)
    );
    if (!shouldInject) return next();
    if (entries.length === 0) return next();

    // ★ buildInjection 仍返回 system（日志用），但 system 不再放入 options。
    //    只使用 inject（fake 消息）。
    const { system, inject } = buildInjection(
      entries,
      (t) => makeUser(ctx, t.text),
      (t) => makeAssistant(ctx, t.text, t.provider, t.model),
      options.provider,
      options.model,
    );

    injected.add(sessionId);
    force.delete(sessionId);

    const oldIds = injectedMessageIds.get(sessionId) || new Set();
    const sourceMessages = (options.messages || []).filter((message) => !oldIds.has(message?.id));
    injectedMessageIds.set(sessionId, new Set(inject.map((message) => message.id)));

    console.log("[preset-plus] injected → session=" + sessionId +
      ", inject=" + inject.length + ", system=[" + (system ?? "").slice(0, 100).replace(/\n/g, "↵") + (String(system ?? "").length > 100 ? "…]" : "]"));
```

</details>

**依据 5 · 源码核查**：[client.js:54-61](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/client.js#L54-L61)

新会话提示非冻结证明。

```text
		const persist = useCallback((nextDoc, okText) => {
			setBusy(true);
			setNotice({ kind: "idle", text: "" });
			fetch("/dsh-preset-plus/save", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ doc: nextDoc }) })
				.then((r) => r.json()).then((d) => {
					if (d.ok) { setDoc(d.doc); setNotice({ kind: "ok", text: okText || "已保存。新会话生效。" }); }
					else { setNotice({ kind: "error", text: "保存失败: " + (d.error || "") }); }
				}).catch((e) => setNotice({ kind: "error", text: "保存失败: " + e.message })).finally(() => setBusy(false));
```

#### 缺口

- 实际token/日志保留和host版本兼容未验。
  **影响**：全周期成本与隐私可能高于配置便利。
  **进一步探讨**：独立profile以无害预设核日志/有效请求/切模式及停用行为。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用结论和新方向是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议观察生产或共享宿主采用；只在独立profile与无害提示上核作用域/实际输入、存档和退出，不能因作者破限宣称把它升为质量改进。发现其他模式受影响、并发丢编辑或无法复现有效输入时停插件并从备份恢复，回原生预设。

可探索版本化预设快照与有效输入收据：保存用expectedVersion、原子替换及坏文件保留，每请求绑定active版本并说明哪些合成消息真发给模型。已有scopedPresets、id过滤/手动force是基线，增量是把配置、作用域和轨迹对齐，不是再发更多fake输出。用双编辑器、运行中切active、损坏文件与两模式任务比较覆盖/污染/回放误差、token与维护负担；若原生预设已等价、收据泄露敏感文本或成本更高，否定。未实现不计现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:112-146](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/lib/index.js#L112-L146)

实际请求与id过滤基线。

<details>
<summary>查看原文（35行）</summary>

```text
    const shouldInject = (
      isMain
      && enabledForAgent(agentPresets, ctx.agents, sessionId, cfg)
      && (autoModeOn || wantsForce)
    );
    if (!shouldInject) return next();
    if (entries.length === 0) return next();

    // ★ buildInjection 仍返回 system（日志用），但 system 不再放入 options。
    //    只使用 inject（fake 消息）。
    const { system, inject } = buildInjection(
      entries,
      (t) => makeUser(ctx, t.text),
      (t) => makeAssistant(ctx, t.text, t.provider, t.model),
      options.provider,
      options.model,
    );

    injected.add(sessionId);
    force.delete(sessionId);

    const oldIds = injectedMessageIds.get(sessionId) || new Set();
    const sourceMessages = (options.messages || []).filter((message) => !oldIds.has(message?.id));
    injectedMessageIds.set(sessionId, new Set(inject.map((message) => message.id)));

    console.log("[preset-plus] injected → session=" + sessionId +
      ", inject=" + inject.length + ", system=[" + (system ?? "").slice(0, 100).replace(/\n/g, "↵") + (String(system ?? "").length > 100 ? "…]" : "]"));

    // ★ mutableOptions 不再放 system——systemPrompt.section 已在组装时负责。
    const mutableOptions = {
      ...options,
      ...(inject.length > 0 ? { messages: [...inject, ...sourceMessages] } : { messages: sourceMessages }),
    };
    inFlight.add(mutableOptions);
    return ctx.llm.stream(mutableOptions);
```

</details>

**依据 2 · 源码核查**：[lib/core.js:178-202](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/lib/core.js#L178-L202)

版本/坏态与写入缺口。

<details>
<summary>查看原文（25行）</summary>

```text
export function loadMultiPreset() {
  const fp = storePath();
  try {
    if (fs.existsSync(fp)) {
      const parsed = JSON.parse(fs.readFileSync(fp, "utf8"));
      return normalizeMultiPreset(parsed);
    }
  } catch {
    // 读失败/损坏 → 走初始化
  }
  const doc = initMultiPreset();
  // 首次初始化：异步写回（不阻塞读取方）。
  fsp.mkdir(path.dirname(fp), { recursive: true }).then(() =>
    fsp.writeFile(fp, JSON.stringify(doc, null, 2), "utf8"),
  ).catch(() => {});
  return doc;
}

/** 写回多预设文档（原子）。 */
export async function saveMultiPreset(doc) {
  const normalized = normalizeMultiPreset(doc);
  const fp = storePath();
  await fsp.mkdir(path.dirname(fp), { recursive: true });
  await fsp.writeFile(fp, JSON.stringify(normalized, null, 2), "utf8");
  return normalized;
```

</details>

**依据 3 · 源码核查**：[client.js:54-61](https://github.com/Rain-kl/dsh-preset-plus/blob/90674c90ec91a8c60a52d29e92c5218c0edad8e9/client.js#L54-L61)

整doc保存。

```text
		const persist = useCallback((nextDoc, okText) => {
			setBusy(true);
			setNotice({ kind: "idle", text: "" });
			fetch("/dsh-preset-plus/save", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ doc: nextDoc }) })
				.then((r) => r.json()).then((d) => {
					if (d.ok) { setDoc(d.doc); setNotice({ kind: "ok", text: okText || "已保存。新会话生效。" }); }
					else { setNotice({ kind: "error", text: "保存失败: " + (d.error || "") }); }
				}).catch((e) => setNotice({ kind: "error", text: "保存失败: " + e.message })).finally(() => setBusy(false));
```

#### 缺口

- 快照/收据设计未实现及无对照。
  **影响**：不能承诺追溯/并发可靠性提升。
  **进一步探讨**：先比较原生预设和仅备份/显式日志的简单替代。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
