# dsh-purge Community

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[27919a3](https://github.com/kingcharleslzy-ai/dsh-purge/tree/27919a326b6615b1968661a3e749760cec3a2e07)

<!-- BEGIN META -->
[![GitHub ★ 2,938](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C938&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kingcharleslzy-ai/dsh-purge)
<!-- END META -->

> **功能**：集中管理 DSH 提示注入、宿主补丁、状态自检与备份回滚的社区插件

> **亮点**：将宿主定位、补丁/提示状态、备份与迁移集中，降低手动多文件维护的分散；社区维护和原始作者归属明确，不能把更多连续执行等同更好任务质量。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：核心增益涉及改写原审批/沙箱语义，不仅减少点击；profile快照失败仍继续逐文件应用，工具“完成”文字不等全成功，禁插件也不自动撤已写Host字节。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 社区版实际改变什么，贡献在哪里？](#detail-section-11)
  - [Q02 · 减少确认是更好决策还是移除约束？](#detail-section-12)
  - [Q03 · 快照、应用与回滚是否形成全事务？](#detail-section-13)
  - [Q04 · 分发、平台和操作负担是什么？](#detail-section-14)
  - [Q05 · 日常采用与隔离研究分别如何决策？](#detail-section-15)
  - [Q06 · 更可信状态放行应如何检验？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：自有或获授权隔离环境中研究宿主行为、提示与恢复机制的人；日常工程需另审控制改变。

原生权限/审批配置和明确授予可逆工具，手动保留官方Host副本；手动多文件修改是工程便利参照，不是默认移除约束依据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 状态与维护 | 查看Host、补丁和备份 | 不以绿灯替代字节/运行核验 |
| Host补丁 | 改变提示与执行控制行为 | 全局字节改变，不是预设排除即撤回 |
| 备份/回滚 | 保存与恢复安装状态 | profile快照非硬门，允许部分错误 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 精确DSH安装/Host/profile身份 | 任何变更必需 | 找到真实运行字节 | 错host不能当应用成功 |
| systemPrompt/tools及平台文件权限 | 插件/对应操作必需 | 注入、状态与写入 | 只读/asar/占用可部分失败 |
| 可核原件和独立恢复副本 | 可靠实验必需 | 避免回滚不可得 | profile快照失败代码仍继续，不能自行假定备份足够 |
| 可信社区Release与命令所有者 | 安装必需 | 固定身份 | 裸npm名/另一Host命令不可替代 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 维护者只读核Host/profile与变更范围 | 不能说明控制变化则不进入实验 |
| 2 | 维护者核独立官方副本/备份 | 不用warning后的继续当恢复保证 |
| 3 | 隔离实验逐项回读完整report和字节 | partial/read/write错误不算完成 |
| 4 | 独立核重启后状态与恢复 | 任意rollback error停实验，恢复可信官方副本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本机/备份空间资源未知 | 核安装身份、全部控制变化与恢复副本 | patch数不等采用价值 |
| 持续使用 | 额外模型重试和存储资源未知 | 升级后重验锚点/权限与任务正确 | 少确认不等总节时 |
| 失败恢复 | 停机/复制/重启资源未知 | 部分应用与回滚逐字节核对 | snapshot失败仍继续，恢复可部分失败 |
| 退出 | Host重建/数据迁移未知 | 禁插件之外另恢复已写字节 | 原生权限要独立确认 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中维护 | 状态/补丁/备份/迁移接口 | 全平台和全部patch可靠 |
| 连续执行 | 会改变部分原控制语义 | 授权、正确率和净收益 |
| 可恢复 | 逐文件bak、profile快照与回滚路径 | 部分失败后的实际完整恢复 |

> **思考**：核心增益涉及改写原审批/沙箱语义，不仅减少点击；profile快照失败仍继续逐文件应用，工具“完成”文字不等全成功，禁插件也不自动撤已写Host字节。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将宿主定位、补丁/提示状态、备份与迁移集中，降低手动多文件维护的分散；社区维护和原始作者归属明确，不能把更多连续执行等同更好任务质量。[Q01](#research-q01) [Q03](#research-q03)

集中状态和维护、取消转发、迁移身份/并发核对有借鉴价值；但逐文件patch并非全事务、恢复文字与细report不等价，控制语义改变增加长期审计成本。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

核心增益涉及改写原审批/沙箱语义，不仅减少点击；profile快照失败仍继续逐文件应用，工具“完成”文字不等全成功，禁插件也不自动撤已写Host字节。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

一般工程任务不推荐默认应用全套Host补丁；保留原生权限。只读研究或获授权隔离实验需先核Host/原件/完整结果，任何备份不可核或回滚error即停止并恢复可信官方副本。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

主入口、逐文件应用、旁路语义和快照非硬门为固定源码事实；全80patch/平台与运行效果未验。状态收据为未来假设，日常默认采用不推荐。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、lib/index.js、lib/core.js、lib/hooks-deny.js、lib/refusal-retry.js、lib/community.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根337个tracked文件统计；深审main/defaults/apply/revert、core applyPatches、hooks-deny与拒绝stream，未审全80补丁/全部redteam/ASAR/更新链。未运行目标、安装、修改Host或发模型请求。
- 下一步：仅在授权隔离官方Host副本注入快照失败、单文件只读、锚点漂移和回滚失败；核状态解释与字节恢复，再对同授权任务与原生策略比较正确、误执行和全成本。

**分析版本**

- **仓库**：[kingcharleslzy-ai/dsh-purge](https://github.com/kingcharleslzy-ai/dsh-purge)
- **版本号**：1.6.60（[固定提交 27919a3](https://github.com/kingcharleslzy-ai/dsh-purge/tree/27919a326b6615b1968661a3e749760cec3a2e07)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证操作收据分开backup_failed/partial/restart_pending/rollback_partial，绑定精确Host、原字节和独立备份；故障注入盲评误判与恢复，任何部分状态被误认完成即否定，不把收据等同约束改变的收益证明。[Q06](#research-q06)

仅在授权隔离官方Host副本注入快照失败、单文件只读、锚点漂移和回滚失败；核状态解释与字节恢复，再对同授权任务与原生策略比较正确、误执行和全成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 97 | 8893 | — | — | 148386 |
| .js | source | 123 | 80660 | 73959 | 4847 | — |
| .mjs | source | 38 | 3381 | 3101 | 216 | — |
| .mjs | test | 70 | 7415 | 6972 | 271 | — |
| .cjs | test | 9 | 1910 | 1896 | 14 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/kingcharleslzy-ai/dsh-purge/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：减少打断来自什么控制变化，宿主字节应用/回滚状态是否足以支撑可恢复实验？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 社区版实际改变什么，贡献在哪里？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

真实DSH插件包dsh-purge-community1.6.60，源自YuJunZhiXue项目的社区维护版；不是原作者官方发行。目标用户是自有本机做学习/实验、希望集中查看/修改提示和宿主状态的人。主入口依赖systemPrompt/tools，提供status/apply/revert及面板，core实际修改宿主JS/YAML/启动shim等字节；不是单纯提示词Skill，也不改变模型训练。相对手动修改多个安装文件，集中定位、补丁状态、备份和迁移有工程便利。作者80patch/25层自检是范围声明而非质量或实验成功证明；合格结果应含明确改变的约束、当前宿主字节、可恢复状态和实际任务结果。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:12-16](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/README.md#L12-L16)

社区身份和作者平台声明。

```text
当前版本 **1.6.60** · 适配 **DSH Desktop 0.2.1-rc.3**（rc.1 / rc.2 同样通过） · [English](docs/README.en.md)

1.6.56 改善状态页卡顿，避免缓存旧宿主证据；读取失败不再误报未安装，并修复深色主题按钮对比度。[发行说明](docs/releases/1.6.56.md) · [市场安装与迁移指南](docs/MARKET-MIGRATION.md)。

**原项目与作者**：基于 [小杨 / YuJunZhiXue 的 dsh-purge](https://github.com/YuJunZhiXue/dsh-purge) 独立维护。原仓库已恢复；保留原作者署名、版权与 MIT 许可证。社区版由本仓库维护，并非原作者官方发行。
```

**依据 2 · 源码核查**：[README.md:37-48](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/README.md#L37-L48)

减少确认与状态/回滚的目标。

<details>
<summary>查看原文（12行）</summary>

```text
## 它是什么

dsh-purge Community 是一个跑在你自己机器上的 Harness 附加组件。它把日常使用里最消耗注意力的几件事收敛到一处：

- **看清楚状态**：安装、补丁、注入到底有没有就绪，一条命令或一屏面板给结论；
- **少一些往返**：把反复出现的确认与打断，收敛成一次设置；
- **随时能回去**：应用、回滚、开关都留记录，操作前自动快照；
- **方便做实验**：提示词、规则、预设集中管理，改坏了能撤。

目标很简单：**让助手更连贯地配合你的学习与动手实验**，而不是每做一步都先停下来问一句。

社区里通常把它叫作「破甲」或「无限制模式」插件——指的是它降低了交互层面的摩擦，让 agent 能连续执行任务；它不改模型本身，也不改变你要做的事。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:52-78](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/index.js#L52-L78)

真实入口服务与默认配置。

<details>
<summary>查看原文（27行）</summary>

```text
export const name = "dsh-purge-community";

// 不要把 pluginPackages 写进 inject：Cordis 会对 map 里每一个 key 空等。
// 便携拷贝 / Hub 残装经常没有这项服务，一写进去就是 pending → 宿主退出码 1。
export const inject = ["systemPrompt", "tools"];

let bootFullQuit = false;

const DEFAULTS = {
  enabled: true,
  excludePresets: [],
  autoApplyOnStart: false,
  autoUpdateOnStart: false,
  autoRevertOnMissing: false,
  injectOnce: false,
  stripMnemon: true,
  postPrompt: "",
  postPromptOrder: 5100,
  verbose: false,
  autoRetry: true,
  retryMax: 3,
  autoContinue: false,
  continueMax: 3,
  continueText: "继续",
  // Codex 风格：教模型主动发现 skill / MCP；不改官方注册与工具面。
  capabilityProtocol: true,
  hooksDenyBypass: true,
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1739-1772](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/index.js#L1739-L1772)

apply工具实际触发多host/ shim变更。

<details>
<summary>查看原文（34行）</summary>

```text
    ctx.tools.register({
      name: "purge_apply",
      description: `应用 dsh 指令权威性清洗：${core.ALL_PATCHES.length} patch（提示词层+代码默认+引擎级审批/沙箱绕过）+ shim 注入 + override 文件。需重启 dsh 完全生效。`,
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {},
      },
      output: {
        schema: {
          type: "object",
          additionalProperties: false,
          properties: { text: { type: "string" } },
        },
        render: (_args, value) => [{ type: "text", text: String(value?.text ?? "") }],
      },
      async execute() {
        core.applyRuntimeEnv();
        const scrubbed = core.sanitizeDesktopCommandRuntimes();
        const state = await core.gatherState();
        if (!state.ai_base) return { text: "ERROR: " + core.missingAiBaseMessage() };
        const blocked = rejectIfNeedPrompt(state.dsh_home);
        if (blocked) return { text: "ERROR: " + blocked.error };
        const toolMulti = await core.applyPatchesAllHosts(core.ALL_PATCHES, {
          preserveClientBundles: false,
          forApply: true,
        });
        await core.patchAllShims();
        const flash = core.silenceCmdFlash(toolMulti.hosts[0]?.aiBase || state.ai_base);
        const report = toolMulti.report;
        const applied = report.filter((r) => r.status === "applied").length;
        const already = report.filter((r) => r.status === "already").length;
        const scrubNote = scrubbed.length ? ` desktop_scrub=${scrubbed.length}` : "";
        return { text: `清洗完成 / applied=${applied}, already=${already}.${scrubNote} phase-1=${flash.phase1} 重启 dsh 生效.` };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 减少确认是更好决策还是移除约束？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

所查hooks-deny模块明确管理四条hook deny/ask旁路及反向恢复，默认hooksDenyBypass=true；这改变原宿主控制语义，不是证明原审批多余。excludePresets只排提示注入，README明说不撤全局宿主补丁，所以排除某预设不意味着它回到原权限边界。可选refusalRetry默认关，真实llm/stream挂点只有tuning启用且注入范围允许才接管；它以短文本模式猜拒绝，取消首流后重新请求，不能保证区分合理限制、技术讨论与无效拒绝。减少拒绝/确认次数本身既不证明任务正确，也不证明操作授权；原生权限配置/明确授予可逆工具更容易审定边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/hooks-deny.js:1-16](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/hooks-deny.js#L1-L16)

四补丁共同开关与默认旁路。

<details>
<summary>查看原文（16行）</summary>

```text
// #80：hooks deny / ask 旁路的开关、反向写回官方形态、状态标注。
// 本模块不 import core.js（core 在需要时回调本模块，避免循环依赖）。
import fs from "node:fs";
import path from "node:path";

/** #80 产品语义：这四条永远同开关，不拆开。 */
export const HOOK_DENY_PATCH_IDS = Object.freeze([30, 31, 64, 65]);

const DEFAULT_SETTINGS = Object.freeze({ hooksDenyBypass: true });
const SETTINGS_FILE = "hooks-deny.json";

/** 补丁 30/31 写出的死字符串；它出现即代表「旁路还开着」。 */
const DISABLED_SENTINEL = "__dsh_purge_deny_disabled__";

const MARKER_STOP = "[dsh-purge] Stop hook steer disabled";
const MARKER_SUBMIT = "[dsh-purge] UserPromptSubmit deny→allow";
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1529-1540](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/index.js#L1529-L1540)

拒绝重试真实opt-in挂载。

<details>
<summary>查看原文（12行）</summary>

```text
export function apply(ctx, config) {
  const cfg = { ...DEFAULTS, ...(config || {}) };
  // 拒绝检测 + 单次重试：默认关闭，只有 tuning.refusalRetry === true 才接管。
  ctx.on("llm/stream", (options, next) => {
    let on = false;
    try {
      on = readTuning().refusalRetry === true;
    } catch {
      on = false;
    }
    if (!on || !injectAllowedNow(cfg, requestInjectionContext(ctx, options))) return next();
    return streamWithRefusalRetry((opts) => next(opts), options);
```

</details>

**依据 3 · 源码核查**：[lib/refusal-retry.js:28-38](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/refusal-retry.js#L28-L38)

文本启发式判断，并非授权判断。

<details>
<summary>查看原文（11行）</summary>

```text
/** 返回命中的规则下标（-1 = 不命中），用于审计定位误判。 */
export function refusalMatchIndex(text = "") {
  const raw = String(text);
  const head = raw.slice(0, 600);
  const meta = /提示词注入|越狱|指令注入|prompt[ _-]?injection|jailbreak/i.test(head);
  if (meta && raw.trim().length > 280) return -1;
  return REFUSAL_PATTERNS.findIndex((re) => re.test(head));
}

export function looksLikeRefusal(text = "") {
  return refusalMatchIndex(text) >= 0;
```

</details>

**依据 4 · 源码核查**：[lib/refusal-retry.js:96-120](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/refusal-retry.js#L96-L120)

首流取消和重试/审计，取消转发。

<details>
<summary>查看原文（25行）</summary>

```text
    const refused = looksLikeRefusal(text);
    if (refused) {
      await close();
      try {
        onRetry?.({ chars: text.length });
        // 记下命中的规则下标，事后能定位误判（例如"讨论拒绝"被当成拒绝）。
        logAudit("refusal_retry", { chars: text.length, head: text.slice(0, 80), match: refusalMatchIndex(text) });
      } catch {
        /* 审计失败不影响主流程 */
      }
      yield* observeStream(() => streamFactory(withNudge(options, nudge)), {
        report: (data) => logAudit("refusal_retry_outcome", data),
      });
      return;
    }

    for (const chunk of buffered) yield chunk;
    while (true) {
      const step = await iterator.next();
      if (step.done) return;
      yield step.value;
    }
  } finally {
    // Forward cancellation to the upstream iterator; do not leave a request running.
    await close();
```

</details>

**依据 5 · 源码核查**：[README.md:54-56](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/README.md#L54-L56)

预设排除不撤全局补丁。

```text
### 让不同预设保留自己的提示词

1.6.40 新增 `excludePresets`：默认空列表，保持原有行为；可将 `roleplay`、`minimal` 等预设排除在 Purge 提示词注入之外，保留命令、面板与工具。切换预设、并行会话和子 Agent 各自判断，宿主兜底也遵守排除。配置示例、升级步骤与边界见 [按预设排除说明](docs/maintenance-issue-53.md)。这不会撤销全局宿主补丁。
```

#### 缺口

- 80条补丁对精确Host所有审批/沙箱/工具路径的影响和合格任务收益未全面验证。
  **影响**：不能把“少问”当安全可靠或默认日常采用价值。
  **进一步探讨**：只在获授权隔离副本逐项比较原生策略，记录真实越界/误执行/正确率，日常任务先保留原生权限。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 快照、应用与回滚是否形成全事务？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

applyPatches先尝试profile快照，但失败只记录warning继续，理由是逐文件bak仍在。随后按patch/target逐个读取、替换、save，单文件写失败记lastError并继续；最终有rollup状态与audit failed_ids。这能暴露部分结果，但不是全批原子应用。purge_apply工具返回主要统计applied/already并称完成，未在文本列出failed数；revert返回reverted/errors但仍称回滚完成且要重启。因此UI一句完成不能代替完整report、快照/逐文件备份及运行验收。Maintenance具备独立lock、包身份和并发配置核对，说明安装/迁移路径比逐文件patch有更多事务保护，不能把一种路径的保证套到另一种。可借鉴状态/备份与读失败不冒充未装，需区分本轮未审全selfcheck。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core.js:7061-7080](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/core.js#L7061-L7080)

snapshot失败不阻断，进入逐patch应用。

<details>
<summary>查看原文（20行）</summary>

```text
export async function applyPatches(aiBase, patches = ALL_PATCHES, options = {}) {
  // 每次整份写入前先做一次 profile 级快照。快照失败不阻断：逐文件 .dshpurge.bak 仍在，
  // 但要在日志里留痕，方便事后确认"这次没有 profile 快照"。
  let snapshot = "skipped";
  try {
    const home = findDshHome();
    if (home) {
      snapshot = (await new Maintenance({ home, aiBase }).backup("before-host-patches"))?.id || "done";
    }
  } catch (e) {
    snapshot = `error:${e && e.message ? e.message : e}`;
    console.warn("[dsh-purge] profile snapshot before apply failed:", snapshot);
  }
  restoreMissingOriginalsFromBak(aiBase);
  refreshStaleBaksForUpgrade(aiBase);
  const files = targetFiles(aiBase);
  const report = [];
  const preserveClientBundles = options.preserveClientBundles === true;
  await repairPluginCordisYaml();
  for (const p of patches) {
```

</details>

**依据 2 · 源码核查**：[lib/core.js:7131-7158](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/core.js#L7131-L7158)

逐文件失败记录与汇总，不自动全回滚。

<details>
<summary>查看原文（28行）</summary>

```text
        if (changed) {
          try {
            const wrote = await saveText(fp, textOut);
            if (wrote) applied += 1;
            else already += 1;
          } catch (e) {
            lastError = `write_error:${e}`;
          }
          continue;
        }
        if (filePatchSettled(text, p, fp)) {
          already += 1;
        } else if (patchHasRemainingWork(text, p, fp) || p.strictFiles) {
          notFound += 1;
        }
      }
    }
    const status = rollupPatchStatus({
      applied, already, missing, notFound, lastError, keyCount: keys.length,
      layoutSoft: isLayoutSoftPatch(p),
      strictFiles: !!p.strictFiles,
    });
    report.push({
      patch_id: p.id,
      name: p.name,
      status,
      path: paths[0] || files[keys[0]],
      applied,
```

</details>

**依据 3 · 源码核查**：[lib/core.js:7163-7181](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/core.js#L7163-L7181)

audit含failed与snapshot，report返回。

<details>
<summary>查看原文（19行）</summary>

```text
  {
    const summary = summarizeApplyReport(report);
    logAudit("apply", {
      host: aiBase,
      host_version: (() => {
        try {
          return JSON.parse(fs.readFileSync(path.join(aiBase, "dsh-agent-loop", "package.json"), "utf8")).version;
        } catch {
          return "unknown";
        }
      })(),
      applied: summary.applied,
      already: summary.already,
      failed: summary.failed.length,
      failed_ids: summary.failed.map((r) => r.patch_id),
      snapshot,
    });
  }
  return report;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1762-1772](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/index.js#L1762-L1772)

工具完成文字只突出applied/already。

<details>
<summary>查看原文（11行）</summary>

```text
        const toolMulti = await core.applyPatchesAllHosts(core.ALL_PATCHES, {
          preserveClientBundles: false,
          forApply: true,
        });
        await core.patchAllShims();
        const flash = core.silenceCmdFlash(toolMulti.hosts[0]?.aiBase || state.ai_base);
        const report = toolMulti.report;
        const applied = report.filter((r) => r.status === "applied").length;
        const already = report.filter((r) => r.status === "already").length;
        const scrubNote = scrubbed.length ? ` desktop_scrub=${scrubbed.length}` : "";
        return { text: `清洗完成 / applied=${applied}, already=${already}.${scrubNote} phase-1=${flash.phase1} 重启 dsh 生效.` };
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1791-1800](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/index.js#L1791-L1800)

回滚errors与完成文字并存。

<details>
<summary>查看原文（10行）</summary>

```text
      async execute() {
        const state = await core.gatherState();
        const lines = [];
        if (state.ai_base) {
          const { reverted, errors } = await core.revertAll(state.ai_base);
          lines.push(`reverted=${reverted.length}${errors.length ? ` errors=${errors.length}` : ""}`);
        }
        const shimRevert = await core.revertAllShims();
        lines.push(`shim_dirs=${Object.keys(shimRevert).length}`);
        return { text: `回滚完成 / ${lines.join(", ")}. 重启 dsh 恢复.` };
```

</details>

#### 缺口

- 目标FS上部分应用、备份缺失、版本升级与重启后的实际恢复未执行。
  **影响**：不能承诺随时一键回原，当前完成提示不足以验收。
  **进一步探讨**：隔离副本注入快照失败/一文件只读/旧锚点/回滚失败，核完整状态与字节，失败不进入日常Host。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 分发、平台和操作负担是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

作者声明适配Desktop0.2.1-rc.3并报告rc.1/rc.2，固定源码不能证明所有平台。CLI/Web与Desktop命令所有者、DSH_HOME/profile、包版本和安装字节需要分别确认；README区分安装插件、应用补丁、手动重启三个动作。官方CLI安装固定GitHub tarball不额外做社区安装器的Release SHA/迁移快照；同名裸npm不能替代可信源。成本含停任务/备份/重启、定位多host和asar/启动shim、升级后重验锚点及回滚；模型重试还增加请求量，不能把本机逻辑当全部任务零费用。禁插件也不自动恢复已写宿主字节，需单独验证撤回路径。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:75-95](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/README.md#L75-L95)

安装所有者、固定release与三动作分离。

<details>
<summary>查看原文（21行）</summary>

````text
## 安装

**DSH 官方入口负责安装插件；下面的社区安装器由本仓库维护，不是 DeepSeek 官方脚本。** 首次安装可用官方界面或 CLI；已经装过 `dsh-purge` / 旧独立面板时，用社区安装器原地迁移，不要先卸载。安装、应用宿主补丁、手动重启是独立动作。

### 方式一：DSH 官方界面（首次安装）

1. 先打开 DSH 完成初始化。按当前官方文档，进入「插件」，点击「实验性插件」旁的「更多」，启用「自定义插件市场」；然后进入「发现 → 添加索引源」。
2. 本项目的**社区索引**：`https://kingcharleslzy-ai.github.io/dsh-purge/index.json`。
3. 选择 dsh-purge Community，核对来源为 `kingcharleslzy-ai/dsh-purge`、包名为 `dsh-purge-community`，确认后安装。

界面和安装协议由 DSH 提供，索引与插件由社区维护。不同 DSH 版本的入口文字可能不同；第三方 `dsh-market` 也可能有额外的筛选与迁移限制。已有旧包时请使用方式三。[官方市场说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/guide/plugin-market.zh.md)

### 方式二：DSH 官方 CLI（首次安装）

下面命令适用于**已经安装 `dsh` 命令、且使用 `web` profile 的 CLI/Web 用户**，在 macOS/Linux 终端或 Windows PowerShell 中运行。桌面版用户优先用上面的界面；不要为了安装插件再用 `npx` 下载另一套宿主。

```sh
dsh plugin --profile web add "https://github.com/kingcharleslzy-ai/dsh-purge/releases/download/v1.6.60/dsh-purge-community-1.6.60.tgz"
```

`web` 必须与实际启动的 profile 一致；自定义数据目录需要沿用该实例的 `DSH_HOME`。命令使用本次发行的固定版本 URL；不是 `npm install -g`，也不是安装裸 npm 包名。本项目通过 GitHub 发行，**不要替换成 `add dsh-purge` 或 `add dsh-purge-community`**。官方 CLI 的安装不会额外运行我们安装器的 Release SHA256 比对及迁移快照；需要这些功能时选方式三。[官方 CLI 安装说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.zh.md)
````

</details>

**依据 2 · 源码核查**：[lib/core.js:7061-7079](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/core.js#L7061-L7079)

快照与修配置的实际副作用。

<details>
<summary>查看原文（19行）</summary>

```text
export async function applyPatches(aiBase, patches = ALL_PATCHES, options = {}) {
  // 每次整份写入前先做一次 profile 级快照。快照失败不阻断：逐文件 .dshpurge.bak 仍在，
  // 但要在日志里留痕，方便事后确认"这次没有 profile 快照"。
  let snapshot = "skipped";
  try {
    const home = findDshHome();
    if (home) {
      snapshot = (await new Maintenance({ home, aiBase }).backup("before-host-patches"))?.id || "done";
    }
  } catch (e) {
    snapshot = `error:${e && e.message ? e.message : e}`;
    console.warn("[dsh-purge] profile snapshot before apply failed:", snapshot);
  }
  restoreMissingOriginalsFromBak(aiBase);
  refreshStaleBaksForUpgrade(aiBase);
  const files = targetFiles(aiBase);
  const report = [];
  const preserveClientBundles = options.preserveClientBundles === true;
  await repairPluginCordisYaml();
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1740-1772](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/index.js#L1740-L1772)

应用包含多host/shim且需重启。

<details>
<summary>查看原文（33行）</summary>

```text
      name: "purge_apply",
      description: `应用 dsh 指令权威性清洗：${core.ALL_PATCHES.length} patch（提示词层+代码默认+引擎级审批/沙箱绕过）+ shim 注入 + override 文件。需重启 dsh 完全生效。`,
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {},
      },
      output: {
        schema: {
          type: "object",
          additionalProperties: false,
          properties: { text: { type: "string" } },
        },
        render: (_args, value) => [{ type: "text", text: String(value?.text ?? "") }],
      },
      async execute() {
        core.applyRuntimeEnv();
        const scrubbed = core.sanitizeDesktopCommandRuntimes();
        const state = await core.gatherState();
        if (!state.ai_base) return { text: "ERROR: " + core.missingAiBaseMessage() };
        const blocked = rejectIfNeedPrompt(state.dsh_home);
        if (blocked) return { text: "ERROR: " + blocked.error };
        const toolMulti = await core.applyPatchesAllHosts(core.ALL_PATCHES, {
          preserveClientBundles: false,
          forApply: true,
        });
        await core.patchAllShims();
        const flash = core.silenceCmdFlash(toolMulti.hosts[0]?.aiBase || state.ai_base);
        const report = toolMulti.report;
        const applied = report.filter((r) => r.status === "applied").length;
        const already = report.filter((r) => r.status === "already").length;
        const scrubNote = scrubbed.length ? ` desktop_scrub=${scrubbed.length}` : "";
        return { text: `清洗完成 / applied=${applied}, already=${already}.${scrubNote} phase-1=${flash.phase1} 重启 dsh 生效.` };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1791-1800](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/index.js#L1791-L1800)

回滚仍需重启且可能errors。

<details>
<summary>查看原文（10行）</summary>

```text
      async execute() {
        const state = await core.gatherState();
        const lines = [];
        if (state.ai_base) {
          const { reverted, errors } = await core.revertAll(state.ai_base);
          lines.push(`reverted=${reverted.length}${errors.length ? ` errors=${errors.length}` : ""}`);
        }
        const shimRevert = await core.revertAllShims();
        lines.push(`shim_dirs=${Object.keys(shimRevert).length}`);
        return { text: `回滚完成 / ${lines.join(", ")}. 重启 dsh 恢复.` };
```

</details>

#### 缺口

- 首次/持续/失败全人工时间、停机成本、模型重试费用未知。
  **影响**：不能用确认减少次数或patch数估算净效率/ROI。
  **进一步探讨**：对同一授权低风险任务对照原生权限，计所有重试、停机、恢复与正确交付，不优则停。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 日常采用与隔离研究分别如何决策？

**研究主题**：采用判断

#### 完整回答

对一般个人工程任务当前不推荐默认应用全套宿主补丁：主要承诺通过改变约束取得更连续执行，而审批/沙箱边界更难审定，且profile快照失败仍继续、部分状态文字可能误导恢复。此判断针对常规采用，不否认它作为隔离副本研究样本的价值。需要学习实现的人可只读status/源和快照机制，不等于建议调用apply；实际实验应逐项有界、留原始宿主副本与独立字节清单。若无法说明改了哪些执行边界、完整备份不可核或任何回滚error，停止实验，恢复可信官方Host副本及原生权限配置；不要以重试更多来替代授权与验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1740-1772](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/index.js#L1740-L1772)

全套apply的范围而非精细任务授权。

<details>
<summary>查看原文（33行）</summary>

```text
      name: "purge_apply",
      description: `应用 dsh 指令权威性清洗：${core.ALL_PATCHES.length} patch（提示词层+代码默认+引擎级审批/沙箱绕过）+ shim 注入 + override 文件。需重启 dsh 完全生效。`,
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {},
      },
      output: {
        schema: {
          type: "object",
          additionalProperties: false,
          properties: { text: { type: "string" } },
        },
        render: (_args, value) => [{ type: "text", text: String(value?.text ?? "") }],
      },
      async execute() {
        core.applyRuntimeEnv();
        const scrubbed = core.sanitizeDesktopCommandRuntimes();
        const state = await core.gatherState();
        if (!state.ai_base) return { text: "ERROR: " + core.missingAiBaseMessage() };
        const blocked = rejectIfNeedPrompt(state.dsh_home);
        if (blocked) return { text: "ERROR: " + blocked.error };
        const toolMulti = await core.applyPatchesAllHosts(core.ALL_PATCHES, {
          preserveClientBundles: false,
          forApply: true,
        });
        await core.patchAllShims();
        const flash = core.silenceCmdFlash(toolMulti.hosts[0]?.aiBase || state.ai_base);
        const report = toolMulti.report;
        const applied = report.filter((r) => r.status === "applied").length;
        const already = report.filter((r) => r.status === "already").length;
        const scrubNote = scrubbed.length ? ` desktop_scrub=${scrubbed.length}` : "";
        return { text: `清洗完成 / applied=${applied}, already=${already}.${scrubNote} phase-1=${flash.phase1} 重启 dsh 生效.` };
```

</details>

**依据 2 · 源码核查**：[lib/core.js:7061-7073](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/core.js#L7061-L7073)

快照非硬前提影响恢复成本。

<details>
<summary>查看原文（13行）</summary>

```text
export async function applyPatches(aiBase, patches = ALL_PATCHES, options = {}) {
  // 每次整份写入前先做一次 profile 级快照。快照失败不阻断：逐文件 .dshpurge.bak 仍在，
  // 但要在日志里留痕，方便事后确认"这次没有 profile 快照"。
  let snapshot = "skipped";
  try {
    const home = findDshHome();
    if (home) {
      snapshot = (await new Maintenance({ home, aiBase }).backup("before-host-patches"))?.id || "done";
    }
  } catch (e) {
    snapshot = `error:${e && e.message ? e.message : e}`;
    console.warn("[dsh-purge] profile snapshot before apply failed:", snapshot);
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1791-1800](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/index.js#L1791-L1800)

回滚error必须作为停止条件。

<details>
<summary>查看原文（10行）</summary>

```text
      async execute() {
        const state = await core.gatherState();
        const lines = [];
        if (state.ai_base) {
          const { reverted, errors } = await core.revertAll(state.ai_base);
          lines.push(`reverted=${reverted.length}${errors.length ? ` errors=${errors.length}` : ""}`);
        }
        const shimRevert = await core.revertAllShims();
        lines.push(`shim_dirs=${Object.keys(shimRevert).length}`);
        return { text: `回滚完成 / ${lines.join(", ")}. 重启 dsh 恢复.` };
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 更可信状态放行应如何检验？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设是将精确Host身份、原字节、独立备份核验、逐patch结果和重启后探针写入同一操作收据，并把backup_failed、partially_applied、restart_pending、rollback_partial分别呈现；只有所有必要条件满足才显示已完成。它改善状态诚实性而不证明移除原控制有价值。最小验证注入快照失败、部分写失败、锚点漂移、错误host与回滚失败，让不看源码的维护者判断是否能继续；任何部分状态被读成可放心使用或备份不可恢复即否定实现。同时比较记录维护成本，不以更多字段当更安全。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core.js:7061-7073](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/core.js#L7061-L7073)

profile快照非硬前提需要独立状态。

<details>
<summary>查看原文（13行）</summary>

```text
export async function applyPatches(aiBase, patches = ALL_PATCHES, options = {}) {
  // 每次整份写入前先做一次 profile 级快照。快照失败不阻断：逐文件 .dshpurge.bak 仍在，
  // 但要在日志里留痕，方便事后确认"这次没有 profile 快照"。
  let snapshot = "skipped";
  try {
    const home = findDshHome();
    if (home) {
      snapshot = (await new Maintenance({ home, aiBase }).backup("before-host-patches"))?.id || "done";
    }
  } catch (e) {
    snapshot = `error:${e && e.message ? e.message : e}`;
    console.warn("[dsh-purge] profile snapshot before apply failed:", snapshot);
  }
```

</details>

**依据 2 · 源码核查**：[lib/core.js:7163-7181](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/core.js#L7163-L7181)

已有细report/audit可作为收据来源。

<details>
<summary>查看原文（19行）</summary>

```text
  {
    const summary = summarizeApplyReport(report);
    logAudit("apply", {
      host: aiBase,
      host_version: (() => {
        try {
          return JSON.parse(fs.readFileSync(path.join(aiBase, "dsh-agent-loop", "package.json"), "utf8")).version;
        } catch {
          return "unknown";
        }
      })(),
      applied: summary.applied,
      already: summary.already,
      failed: summary.failed.length,
      failed_ids: summary.failed.map((r) => r.patch_id),
      snapshot,
    });
  }
  return report;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1768-1772](https://github.com/kingcharleslzy-ai/dsh-purge/blob/27919a326b6615b1968661a3e749760cec3a2e07/lib/index.js#L1768-L1772)

当前完成文字丢失失败细节为反例。

```text
        const report = toolMulti.report;
        const applied = report.filter((r) => r.status === "applied").length;
        const already = report.filter((r) => r.status === "already").length;
        const scrubNote = scrubbed.length ? ` desktop_scrub=${scrubbed.length}` : "";
        return { text: `清洗完成 / applied=${applied}, already=${already}.${scrubNote} phase-1=${flash.phase1} 重启 dsh 生效.` };
```

#### 缺口

- 收据对误判/恢复和维护负担的改善未知。
  **影响**：是假设，不是已确认安全或产品机会。
  **进一步探讨**：故障矩阵盲评状态判断与字节恢复，误判不降就不用新收据替代人工验收。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
