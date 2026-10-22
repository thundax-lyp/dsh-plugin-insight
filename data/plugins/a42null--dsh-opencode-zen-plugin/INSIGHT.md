# dsh-opencode-zen-plugin

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[e1d0054](https://github.com/A42Null/dsh-opencode-zen-plugin/tree/e1d0054333d5f8185f3d6e55f563e5fe91e19b29)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/A42Null/dsh-opencode-zen-plugin) [![npm 30d 400](https://img.shields.io/static/v1?label=npm+30d&message=400&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a42null/dsh-opencode-zen-plugin)
<!-- END META -->

> **实现功能**：把 OpenCode Console 对话模型接入 DSH 的四协议 LLM adapter，附设置卡与模型目录刷新。

> **核心亮点**：一个插件承接四类网关协议及 Web 配置入口，降低 DSH 多模型手工配置量。详见[Q01](#research-q01)。

> **风险与缺陷**：模型选择器的静态并集不代表可用性；本地 plugin-load.json 保存密钥前10字符且错误响应片段入日志。详见[Q02](#research-q02)及[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 该插件给 DSH 带来什么能力，适用什么边界？](#detail-section-11)
  - [Q02 · 目录、元数据和离线回退怎样组合？](#detail-section-12)
  - [Q03 · 密钥与错误诊断保存了哪些敏感材料？](#detail-section-13)
  - [Q04 · 四协议流与错误分类有哪些已知边界？](#detail-section-14)
  - [Q05 · 怎样小范围接入并判断是否值得采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 Console 账户的 DSH 用户调用付费模型；需确认当前账号权限和模型端点。详见[Q01](#research-q01)。

逐模型手动接网关可以精确维护协议与授权；插件提高便利但需要持续维护路由表。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 四协议适配 | 模型推理/工具流 | 命名规则可能漂移 |
| 目录 | 自动列模型 | 静态并集不保可用 |
| 诊断 | 分类错误 | 本地记录密钥前缀 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH llm/客户端 | 必需 | adapter/设置卡 | 无模型或卡片 |
| Console Key/余额 | 调用必需 | 网关鉴权 | AUTH/QUOTA |
| models.dev | 可选 | 元数据 | 回退静态值 |
| 网络访问 | 必需 | 目录/推理 | 列表回退/调用失败 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | npm/发行包 | adapter 注册 |
| 配置 | 保存 Console Key | 无 AUTH |
| 核验 | 单模型及四协议调用 | 与账单/目录对照 |
| 维护 | 监测目录/错误日志 | 排除不可用静态项 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 安装 | DSH 与 npm/tarball | 设置 Key | 安装兼容未测 |
| 调用 | Console 账户计费、网络 | 维护模型权限 | 金额/时延未知 |
| 运维 | 目录/元数据请求与本地日志 | 路由与机密复核 | 实时目录不保证可用 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 多模型目录 | live+static 并集 | 每项可调用 |
| 四协议 | 请求/流适配 | 目标兼容 |
| 错误说明 | 正则分类/建议 | 准确率 |

> **思考**：模型选择器的静态并集不代表可用性；本地 plugin-load.json 保存密钥前10字符且错误响应片段入日志。详见[Q02](#research-q02)及[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：一个插件承接四类网关协议及 Web 配置入口，降低 DSH 多模型手工配置量。详见[Q01](#research-q01)。

一个插件承接四类网关协议及 Web 配置入口，降低 DSH 多模型手工配置量。详见[Q01](#research-q01)。

协议桥和客户端设置拆分清晰；静态列表与密钥前缀诊断需要收紧。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

模型选择器的静态并集不代表可用性；本地 plugin-load.json 保存密钥前10字符且错误响应片段入日志。详见[Q02](#research-q02)及[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先隔离试用单个获授权模型，再做四协议/工具/图片/错误矩阵；保护本地诊断文件。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持适配机制；静态并集会使过期模型持续展示，加载标记写 key 前缀；目标 Console/DSH 未验证。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、lib/index.js、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.zh-CN.md、lib/index.js、lib/client.js、package.json；未调用 Console/DSH 或运行插件。旧 META 仅复用。
- 下一步：目标 DSH/Console 账户测试 live/静态目录、四协议/图片/工具、无权限/欠费/超时和文件权限。

**分析版本**

- **仓库**：[A42Null/dsh-opencode-zen-plugin](https://github.com/A42Null/dsh-opencode-zen-plugin)
- **版本号**：0.3.6（[固定提交 e1d0054](https://github.com/A42Null/dsh-opencode-zen-plugin/tree/e1d0054333d5f8185f3d6e55f563e5fe91e19b29)）
- **版本日期**：2026-10-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进是仅失败时启用静态目录、移除密钥前缀、用结构化错误与持续测试路由表。详见[Q05](#research-q05)。

目标 DSH/Console 账户测试 live/静态目录、四协议/图片/工具、无权限/欠费/超时和文件权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1716 | 1513 | 95 | — |
| .md | source | 2 | 370 | — | — | 4465 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/A42Null/dsh-opencode-zen-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/A42Null/dsh-opencode-zen-plugin/issues?q=is%3Aissue+created%3A2026-09-21T04%3A11%3A32.944Z..2026-10-21T04%3A11%3A32.944Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/A42Null/dsh-opencode-zen-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T04%3A11%3A32.944Z..2026-10-21T04%3A11%3A32.944Z)



统计日期：2026-10-21。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**OpenCode Console 对话模型适配是否在目录、协议和密钥诊断上提供可信边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 该插件给 DSH 带来什么能力，适用什么边界？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

它注册 opencode-zen LLM adapter，读 OpenCode Console API Key，将 Console 对话模型按模型名路由到 Responses、Anthropic、Google 或 Chat Completions 端点，并以客户端配置卡管理 key、网关、免费模型开关及刷新间隔。作者称免费模型只供 OpenCode 客户端用，jev 系列不可对话；源码默认隐藏 free、排除 jev。这是外部付费网关适配，适合已有 Console 账户的 DSH 用户；不能推断所有静态列名均可用或有访问权限。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:5-29](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/README.zh-CN.md#L5-L29)

作者场景/能力/限制

<details>
<summary>查看原文（25行）</summary>

```text
DeepSeek Harness 插件：自动适配 [OpenCode Console (Zen) 模型目录](https://opencode.ai/v2/docs/console/models)。

- GitHub：<https://github.com/A42Null/dsh-opencode-zen-plugin>
- CNB 制品库：<https://cnb.cool/A42Null/dsh-opencode-zen-plugin>
- npm 包名：`@a42null/dsh-opencode-zen-plugin`（已发布到 npmjs；安装方式见下文）

**只需在「设置 → 插件」粘贴 OpenCode Console 的 API Key，即可在 DSH 中选用 Console 提供的对话模型** —— 模型列表、上下文窗口、端点路由、推理参数自动完成。

它不做的事：不能让 `*-free` 免费模型可用（只能在 OpenCode 客户端内运行）；会跳过 `jev-*` SystemOne 模型（不支持对话）；付费模型仍需 Console 账户有余额。

## 功能特性

- **零配置模型目录**：启动时及定时（默认 300 秒）拉取 `https://opencode.ai/zen/v1/models`（该接口无需鉴权），自动出现在 DSH 模型选择器中
- **四协议自动路由**（依官方文档端点表）：
  - `gpt-*` / `grok-*` / `muse-spark*` → OpenAI Responses API（`/zen/v1/responses`）
  - `claude-*` 及 `qwen3.8-flash` / `qwen3.7-max` / `qwen3.7-plus` / `qwen3.6-plus` / `qwen3.5-plus` → Anthropic Messages（`/zen/v1/messages`）
  - `gemini-*` → Google GenerateContent（`/zen/v1/models/<id>:streamGenerateContent?alt=sse`）
  - `deepseek` / `glm` / `minimax` / `kimi` / `qwen3.8-max` / `big-pickle` / `*-free` → OpenAI 兼容（`/zen/v1/chat/completions`）
- **元数据自动同步**：上下文窗口、输出预算、推理档位优先取 [models.dev](https://models.dev/api.json)（7 天磁盘缓存 `~/.opencode-zen/models.dev.json`），离线时回退插件内置静态目录，永远可用
- **免费模型默认隐藏**：`*-free` 属于 OpenCode 客户端内部的免费层，经 Console API 调用会返回 `403 FreeTierError`（"free tier can only be used from within OpenCode"），因此默认不列入模型列表；需要时可在设置中开启
- **账务/权限错误可读**：余额不足（402）、模型无访问权限（403 Model access is disabled）、免费层受限（403 FreeTierError）各自映射为独立错误码并附带处理建议，不再笼统显示为"密钥无效"
- **推理参数透传**：`off` / `minimal` / `low` / `medium` / `high` / `xhigh` / `max` 阶梯，自动映射各协议原生字段（`reasoning_effort`、`thinking.budget_tokens`、`thinkingConfig.thinkingBudget`、`reasoning.effort`）
- **完整 Harness 流协议**：文本 / 推理 / 工具调用分块流式输出、usage 计费、停止原因映射与错误分类（AUTH、QUOTA、FREE_TIER_BLOCKED、MODEL_ACCESS_DISABLED、RATE_LIMIT、INVALID_REQUEST、SERVER、TIMEOUT、TRANSPORT、CONTEXT_WINDOW_EXCEEDED、EMPTY_RESPONSE）
- **工具调用与图片输入**：vision 模型（claude- / gemini- / deepseek-v4-flash-vision 等）支持图片附件
- **流看门狗**：120 秒首包 / 300 秒空闲超时自动中止，避免挂死
```

</details>

**依据 2 · 源码核查**：[lib/index.js:127-139](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L127-L139)

路由和排除规则

<details>
<summary>查看原文（13行）</summary>

```text
function apiForModel(id) {
  const m = String(id ?? "").toLowerCase();
  if (m.startsWith("jev")) return "excluded";
  if (m.startsWith("gemini")) return "google";
  if (m.startsWith("claude")) return "anthropic";
  if (RESPONSES_PREFIXES.some((p) => m.startsWith(p))) return "responses";
  if (ANTHROPIC_EXACT.has(m)) return "anthropic";
  return "chat";
}

function isFreeModel(id) {
  return String(id ?? "").toLowerCase().includes("free");
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1290-1334](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L1290-L1334)

注册 adapter

<details>
<summary>查看原文（45行）</summary>

```text
const name = PROVIDER_ID;
const inject = ["llm"];

function apply(ctx, config = {}) {
  const log = ctx.logger ?? { info: (...a) => console.info("[opencode-zen]", ...a), warn: (...a) => console.warn("[opencode-zen]", ...a), error: (...a) => console.error("[opencode-zen]", ...a) };
  if (!ctx.llm || typeof ctx.llm.registerAdapter !== "function") {
    log.warn("opencode-zen: llm service unavailable; adapter not registered");
    return { ready: false };
  }
  const providerId = typeof config.providerId === "string" && config.providerId.length > 0 ? config.providerId : PROVIDER_ID;
  const readSettings = () => {
    const raw = readVolatile(config.console) ?? {};
    return {
      apiKey: typeof raw.apiKey === "string" ? raw.apiKey.trim() : "",
      baseUrl: typeof raw.baseUrl === "string" && raw.baseUrl.length > 0 ? raw.baseUrl : ZEN_BASE_URL,
      includeFreeModels: raw.includeFreeModels === true,
      refreshSeconds: typeof raw.refreshSeconds === "number" ? raw.refreshSeconds : 300,
    };
  };
  const dataDir = join(homedir(), ".opencode-zen");
  const errorsLog = join(dataDir, "errors.log");
  /** 诊断通道：把每次失败的原始码/响应体追加到 ~/.opencode-zen/errors.log（上限 128 KB）。 */
  const report = (line) => {
    const text = `${new Date().toISOString()} ${line}`;
    void mkdir(dataDir, { recursive: true })
      .then(async () => {
        const info = await stat(errorsLog).catch(() => null);
        if (info && info.size > 128 * 1024) await writeFile(errorsLog, "", "utf8");
        await appendFile(errorsLog, `${text}\n`, "utf8");
      })
      .catch(() => {});
  };
  const catalog = new ModelCatalog({
    readSettings,
    cachePath: join(dataDir, "models.dev.json"),
    onRefresh: (status) => {
      log.info(`opencode-zen: catalog ${status.status}, ${status.total} models${status.lastError ? ` (${status.lastError})` : ""}`);
      void mkdir(dataDir, { recursive: true })
        .then(() => writeFile(join(dataDir, "adapter-status.json"), JSON.stringify({ ...status, writtenAt: Date.now() }, null, 2), "utf8"))
        .catch(() => {});
    },
  });
  const adapter = new ZenAdapter(catalog, readSettings, report);
  const registration = ctx.llm.registerAdapter([providerId], adapter);
  catalog.start();
```

</details>

**依据 4 · 源码核查**：[lib/client.js:20-34](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/client.js#L20-L34)

客户端模块与配置默认

<details>
<summary>查看原文（15行）</summary>

```text
window.__ModuleLoader__.load({
  // 必须等于本包在 package.json 里的 name：DSH 以「行名」为工厂注册键，
  // 声明成别的名字会导致 duplicate factory registration / import failed（曾因改名漏改而挂掉整个页面）。
  id: "@a42null/dsh-opencode-zen-plugin",
  factory: (require) => {
    const React = require("react");
    const primitives = require("@deepseek-ai/dsh-client-ui-primitives");

    const NS = "opencode-zen";
    const NODE = "console";
    const DEFAULTS = {
      baseUrl: "https://opencode.ai/zen",
      includeFreeModels: false,
      refreshSeconds: 300,
    };
```

</details>

#### 缺口

- Console 当前模型、地区及账户授权未核
  **影响：**模型在选择器可见不等于可调用
  **进一步探讨：**目标账户逐协议试用并对照 Console 官方目录

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录、元数据和离线回退怎样组合？

**研究主题：**功能与机制、工程质量与复用

#### 完整回答

ModelCatalog 启动及定时刷新 baseUrl/v1/models，默认300秒；models.dev 元数据最多缓存7天，主要用于上下文、输出和推理档位。list() 取 liveIds 与内置 STATIC_MODELS 的并集，随后按 jev/free 规则过滤；所以即使直播列表成功，静态清单中的过期或未获授权模型仍可展示，不只是离线回退。请求流随后按名称前缀/精确名决定四协议，并进行 SSE 转换。可以作便利目录，但须区分“列出”和“可用”。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:945-984](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L945-L984)

定时拉列表与状态

<details>
<summary>查看原文（40行）</summary>

```text
  start() {
    const tick = () => {
      if (this.stopped) return;
      const seconds = Number(this.readSettings().refreshSeconds);
      const ms = (Number.isFinite(seconds) && seconds >= 30 ? seconds : 300) * 1000;
      this.timer = setTimeout(() => { this.refreshOnce().finally(tick); }, ms);
      this.timer.unref?.();
    };
    this.refreshOnce().finally(tick);
  }

  stop() {
    this.stopped = true;
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
  }

  async refreshOnce() {
    const errors = [];
    try {
      const baseUrl = (this.readSettings().baseUrl ?? ZEN_BASE_URL).replace(/\/+$/, "");
      const response = await fetch(`${baseUrl}/v1/models`, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(30_000) });
      if (response.ok) {
        const payload = await response.json();
        const ids = Array.isArray(payload?.data) ? payload.data.map((m) => m?.id).filter((id) => typeof id === "string" && id.length > 0) : [];
        this.liveIds = ids;
      } else {
        errors.push(`models list HTTP ${response.status}`);
      }
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
    await this.loadMetadata();
    const list = this.list();
    this.status = {
      status: errors.length > 0 && list.length === 0 ? "error" : "ok",
      total: list.length,
      updatedAt: Date.now(),
      lastError: errors.join("; "),
    };
    this.onRefresh?.(this.status);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:987-1055](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L987-L1055)

元数据缓存及静态+实时并集

<details>
<summary>查看原文（69行）</summary>

```text
  async loadMetadata() {
    const fresh = await this.readCache();
    if (fresh) { this.metadata = fresh; return; }
    try {
      const response = await fetch(METADATA_URL, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(30_000) });
      if (!response.ok) return;
      const data = await response.json();
      const decoded = decodeModelsDev(data);
      if (decoded.size > 0) {
        this.metadata = decoded;
        await this.writeCache(data);
      }
    } catch { /* metadata is optional */ }
  }

  async readCache() {
    if (!this.cachePath) return null;
    try {
      const raw = await readFile(this.cachePath, "utf8");
      const parsed = JSON.parse(raw);
      if (!parsed?.savedAt || typeof parsed.savedAt !== "number") return null;
      if (Date.now() - parsed.savedAt > METADATA_MAX_AGE_MS) return null;
      return decodeModelsDev(parsed.data);
    } catch { return null; }
  }

  async writeCache(data) {
    if (!this.cachePath) return;
    try {
      await mkdir(join(this.cachePath, ".."), { recursive: true });
      const tmp = `${this.cachePath}.tmp`;
      await writeFile(tmp, JSON.stringify({ savedAt: Date.now(), data }), "utf8");
      await rename(tmp, this.cachePath);
    } catch { /* cache write is best-effort */ }
  }

  list() {
    const ids = new Set(this.liveIds);
    for (const id of STATIC_MODELS) ids.add(id);
    const result = [];
    for (const id of ids) {
      const entry = entryFor(id);
      if (!entry) continue;
      if (this.readSettings().includeFreeModels === false && entry.free) continue;
      result.push(this.decorate(entry));
    }
    result.sort((a, b) => a.id.localeCompare(b.id));
    return result;
  }

  resolve(id) {
    const entry = entryFor(id);
    if (!entry) return null;
    return this.decorate(entry);
  }

  decorate(entry) {
    const meta = this.metadata.get(entry.id);
    const contextWindow = meta?.contextWindow ?? entry.contextWindow;
    const maxTokens = meta?.maxTokens ?? entry.maxTokens;
    const reasoning = meta?.reasoning ?? entry.reasoning;
    return {
      ...entry,
      contextWindow: typeof contextWindow === "number" ? contextWindow : undefined,
      maxTokens: typeof maxTokens === "number" ? maxTokens : undefined,
      reasoning,
      effortValues: meta?.effortValues ?? [],
    };
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:127-139](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L127-L139)

模型名路由

<details>
<summary>查看原文（13行）</summary>

```text
function apiForModel(id) {
  const m = String(id ?? "").toLowerCase();
  if (m.startsWith("jev")) return "excluded";
  if (m.startsWith("gemini")) return "google";
  if (m.startsWith("claude")) return "anthropic";
  if (RESPONSES_PREFIXES.some((p) => m.startsWith(p))) return "responses";
  if (ANTHROPIC_EXACT.has(m)) return "anthropic";
  return "chat";
}

function isFreeModel(id) {
  return String(id ?? "").toLowerCase().includes("free");
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1263-1266](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L1263-L1266)

协议流分派

```text
      if (api === "responses") yield* streamResponses(response, options, contextWindow, watchdog);
      else if (api === "anthropic") yield* streamAnthropic(response, options, contextWindow, watchdog);
      else if (api === "google") yield* streamGoogle(response, options, contextWindow, watchdog);
      else yield* streamChatCompletions(response, options, contextWindow, watchdog);
```

#### 缺口

- 当前 Console 目录/路由表变化未知
  **影响：**静态虚假可见模型可能导致失败
  **进一步探讨：**与当日官方 Console 模型端点表逐项比对

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 密钥与错误诊断保存了哪些敏感材料？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

配置 Schema 把 apiKey 标作 secret，客户端用 password 输入，保存时通过 form.mutate 写入。宿主加载时另写 ~/.opencode-zen/plugin-load.json，包含 apiKeyLength 和 apiKeyPrefix 前10字符；因此本地诊断文件持有可识别密钥片段，需作为敏感文件保护或取消前缀。HTTP 失败时 errors.log 还追加响应体前200字符，返回 Agent 的错误信息可含前500字符；上游若回显机密可能泄露，需评估日志权限/脱敏。源码未见明文全 key 写日志。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1278-1283](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L1278-L1283)

secret 配置

```text
const ConsoleConfigSchema = Schema.object({
  apiKey: Schema.string().role("secret").default("").description("OpenCode Console API Key（https://opencode.ai/console 获取）"),
  baseUrl: Schema.string().default(ZEN_BASE_URL).description("OpenCode Zen 网关地址"),
  includeFreeModels: Schema.boolean().default(false).description("是否在模型列表中包含免费模型（*-free 只能在 OpenCode 客户端内使用，经 Console API 调用会返回 FreeTierError）"),
  refreshSeconds: Schema.number().step(1).min(30).max(86400).default(300).description("模型目录自动刷新间隔（秒）"),
});
```

**依据 2 · 源码核查**：[lib/client.js:179-205](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/client.js#L179-L205)

表单写入

<details>
<summary>查看原文（27行）</summary>

```text
      const handleSave = async () => {
        if (!writable || invalid) {
          setSaved(false);
          setFailed(true);
          return;
        }
        const writes = key.length > 0 ? ops.concat([{ op: "set", path: [NODE, "apiKey"], value: key }]) : ops;
        if (writes.length === 0) {
          setSaved(true);
          setFailed(false);
          return;
        }
        setSaving(true);
        setSaved(false);
        setFailed(false);
        try {
          const ok = await form.mutate(writes, snapshot.revision);
          if (ok) {
            setSaved(true);
            setApiKey("");
            setBaseUrl(null);
            setIncludeFree(null);
            setRefreshSeconds(null);
          } else {
            setFailed(true);
          }
        } catch {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1311-1321](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L1311-L1321)

错误日志追加

<details>
<summary>查看原文（11行）</summary>

```text
  /** 诊断通道：把每次失败的原始码/响应体追加到 ~/.opencode-zen/errors.log（上限 128 KB）。 */
  const report = (line) => {
    const text = `${new Date().toISOString()} ${line}`;
    void mkdir(dataDir, { recursive: true })
      .then(async () => {
        const info = await stat(errorsLog).catch(() => null);
        if (info && info.size > 128 * 1024) await writeFile(errorsLog, "", "utf8");
        await appendFile(errorsLog, `${text}\n`, "utf8");
      })
      .catch(() => {});
  };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1246-1254](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L1246-L1254)

上游响应片段

```text
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        const snippet = text.length > 0 ? text.slice(0, 500) : "";
        const code = classifyError(`${response.status} ${snippet}`);
        const hint = errorHint(code);
        this.report(`http-${response.status} api=${api} model=${modelId} code=${code} body=${snippet.slice(0, 200)}`);
        yield { type: "usage", usage: { inputTokens: 0, outputTokens: 0 } };
        yield errorChunk(`opencode-zen: HTTP ${response.status} ${response.statusText}${snippet ? ` — ${snippet}` : ""}${hint ? ` — ${hint}` : ""}`, code);
        return;
```

**依据 5 · 源码核查**：[lib/index.js:1341-1363](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L1341-L1363)

加载标记保存 key 前缀

<details>
<summary>查看原文（23行）</summary>

```text
  // 加载标记：用于确认运行中的 DSH 载入的是哪一版代码、以及配置是否真的读到。
  const initial = readSettings();
  void mkdir(dataDir, { recursive: true })
    .then(() =>
      writeFile(
        join(dataDir, "plugin-load.json"),
        JSON.stringify(
          {
            loadedAt: new Date().toISOString(),
            pid: typeof process !== "undefined" ? process.pid : null,
            providerId,
            build: BUILD_TAG,
            consoleIsVolatileRef: isVolatileRef(config.console),
            apiKeyLength: initial.apiKey.length,
            apiKeyPrefix: initial.apiKey.slice(0, 10),
            baseUrl: initial.baseUrl,
            includeFreeModels: initial.includeFreeModels,
            refreshSeconds: initial.refreshSeconds,
          },
          null,
          2,
        ),
        "utf8",
```

</details>

#### 缺口

- 目标宿主目录权限及网关响应内容未核
  **影响：**密钥片段或敏感响应可能被本地其他读取者获取
  **进一步探讨：**检查文件权限与模拟含机密错误响应并删前缀

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 四协议流与错误分类有哪些已知边界？

**研究主题：**缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

插件按前缀选择协议并把响应 SSE 转为 Harness 文本、推理、工具及 usage 块；处理 402/403/429 等错误，调用前检查 key。映射依赖模型命名表和上游事件格式；未知模型默认 chat，若 Console 新模型实际走另一协议会错路由。stream 在请求/响应上依赖 fetch、AbortController 与 watchdog；分类是按文本正则，不能当成精确网关错误类型。目标协议实际兼容、vision/工具调用与停止原因未独立跑通。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:26-39](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L26-L39)

文本正则错误分类

<details>
<summary>查看原文（14行）</summary>

```text
function classifyError(text) {
  if (/\bRegionError\b|not available in your country/i.test(text)) return "REGION_BLOCKED";
  if (/free.?tier|FreeTierError|only be used from within OpenCode/i.test(text)) return FREE_TIER_BLOCKED;
  if (/model access is disabled|access is disabled/i.test(text)) return MODEL_ACCESS_DISABLED;
  if (/insufficient|quota|billing|account funds/i.test(text)) return QUOTA_EXCEEDED;
  if (/\b(?:401|403)\b/.test(text)) return "AUTH";
  if (/\b429\b|rate.?limit/i.test(text)) return "RATE_LIMIT";
  if (/\b413\b|payload too large|request body too large/i.test(text)) return "INVALID_REQUEST";
  if (/\b400\b|invalid.?request/i.test(text)) return "INVALID_REQUEST";
  if (/\b5\d\d\b/.test(text)) return "SERVER";
  if (/\btime(?:d)?\s*out\b|timeout/i.test(text)) return "TIMEOUT";
  if (/\b(?:network|connection|socket|fetch)\b|\bECONN[A-Z]+\b|terminated|premature close/i.test(text)) return "TRANSPORT";
  return "UPSTREAM";
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:127-135](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L127-L135)

未知模型默认 chat

```text
function apiForModel(id) {
  const m = String(id ?? "").toLowerCase();
  if (m.startsWith("jev")) return "excluded";
  if (m.startsWith("gemini")) return "google";
  if (m.startsWith("claude")) return "anthropic";
  if (RESPONSES_PREFIXES.some((p) => m.startsWith(p))) return "responses";
  if (ANTHROPIC_EXACT.has(m)) return "anthropic";
  return "chat";
}
```

**依据 3 · 源码核查**：[lib/index.js:1131-1167](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L1131-L1167)

密钥与取消

<details>
<summary>查看原文（37行）</summary>

```text
  async *stream(options) {
    const settings = this.readSettings() ?? {};
    const configured = typeof settings.apiKey === "string" ? settings.apiKey.trim() : "";
    const envKey = typeof process !== "undefined" && process.env ? String(process.env.OPENCODE_ZEN_API_KEY ?? "").trim() : "";
    const apiKey = configured.length > 0 ? configured : envKey;
    if (!apiKey) {
      this.report(`no-api-key configured=${configured.length > 0} env=${envKey.length > 0}`);
      yield { type: "usage", usage: { inputTokens: 0, outputTokens: 0 } };
      yield errorChunk("opencode-zen: OpenCode Console API Key not configured. Paste it in 设置 → 插件 → OpenCode Zen → 配置 (or provide OPENCODE_ZEN_API_KEY).", "AUTH");
      return;
    }
    const modelId = typeof options.model === "string" ? options.model : options.model?.id;
    const entry = this.catalog.resolve(modelId) ?? entryFor(modelId);
    const api = entry?.api ?? apiForModel(modelId);
    if (api === "excluded") {
      yield { type: "usage", usage: { inputTokens: 0, outputTokens: 0 } };
      yield errorChunk(`opencode-zen: model ${modelId} uses the SystemOne endpoint and is not chat-capable`, "INVALID_REQUEST");
      return;
    }
    const baseUrl = (typeof settings.baseUrl === "string" && settings.baseUrl.length > 0 ? settings.baseUrl : ZEN_BASE_URL).replace(/\/+$/, "");
    const contextWindow = contextWindowFor(entry);
    const effort = typeof options.reasoningEffort === "string"
      ? options.reasoningEffort
      : (typeof options.reasoning === "string" ? options.reasoning : undefined);
    const controller = new AbortController();
    const watchdog = createWatchdog(controller);
    const onAbort = () => controller.abort(options.signal?.reason ?? new Error("aborted"));
    if (options.signal) {
      if (options.signal.aborted) controller.abort(options.signal.reason ?? new Error("aborted"));
      else options.signal.addEventListener("abort", onAbort, { once: true });
    }
    try {
      const headers = {
        accept: "application/json",
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
        "user-agent": `@a42null/dsh-opencode-zen-plugin/${BUILD_TAG}`,
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1171-1225](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L1171-L1225)

各协议请求

<details>
<summary>查看原文（55行）</summary>

```text
      if (api === "responses") {
        url = `${baseUrl}/v1/responses`;
        body = {
          model: modelId,
          stream: true,
          input: await buildResponsesInput(options),
          ...(toolsPayload(options).length > 0 ? { tools: toolsPayload(options).map((t) => ({ type: "function", ...t })) } : {}),
          ...(reasoningEffortWire(effort) ? { reasoning: { effort: reasoningEffortWire(effort) } } : {}),
          ...(options.maxTokens ? { max_output_tokens: options.maxTokens } : {}),
        };
      } else if (api === "anthropic") {
        url = `${baseUrl}/v1/messages`;
        headers["anthropic-version"] = "2023-06-01";
        headers["x-api-key"] = apiKey;
        const budget = effort === "off" ? undefined : reasoningBudgetFor(effort);
        const systemText = typeof options.system === "string" && options.system.length > 0
          ? options.system
          : (options.messages ?? []).filter((m) => m?.role === "system").map((m) => flattenText(m.content)).join("\n");
        body = {
          model: modelId,
          stream: true,
          max_tokens: Math.max(options.maxTokens ?? defaultMaxTokensFor(entry), budget ? budget + 1024 : 0),
          ...(systemText.length > 0 ? { system: systemText } : {}),
          messages: await buildAnthropicMessages(options),
          ...(toolsPayload(options).length > 0 ? { tools: toolsPayload(options) } : {}),
          ...budget ? { thinking: { type: "enabled", budget_tokens: budget } } : {},
        };
      } else if (api === "google") {
        url = `${baseUrl}/v1/models/${encodeURIComponent(modelId)}:streamGenerateContent?alt=sse`;
        headers["x-goog-api-key"] = apiKey;
        const budget = effort === "off" ? 0 : reasoningBudgetFor(effort);
        const googleSystem = typeof options.system === "string" && options.system.length > 0
          ? options.system
          : (options.messages ?? []).filter((m) => m?.role === "system").map((m) => flattenText(m.content)).join("\n");
        body = {
          contents: await buildGoogleContents(options),
          ...(googleSystem.length > 0 ? { systemInstruction: { parts: [{ text: googleSystem }] } } : {}),
          ...(toolsPayload(options).length > 0 ? { tools: [{ functionDeclarations: toolsPayload(options) }] } : {}),
          generationConfig: {
            ...(options.maxTokens ? { maxOutputTokens: options.maxTokens } : {}),
            ...budget !== undefined ? { thinkingConfig: { thinkingBudget: budget } } : {},
          },
        };
      } else {
        url = `${baseUrl}/v1/chat/completions`;
        body = {
          model: modelId,
          stream: true,
          stream_options: { include_usage: true },
          messages: await buildChatMessages(options),
          ...(toolsPayload(options).length > 0 ? { tools: toolsPayload(options).map((t) => ({ type: "function", function: t })) } : {}),
          ...(reasoningEffortWire(effort) ? { reasoning_effort: reasoningEffortWire(effort) } : {}),
          ...(options.maxTokens ? { max_tokens: options.maxTokens } : {}),
          ...(options.temperature !== undefined ? { temperature: options.temperature } : {}),
        };
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1263-1266](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L1263-L1266)

SSE 流分派

```text
      if (api === "responses") yield* streamResponses(response, options, contextWindow, watchdog);
      else if (api === "anthropic") yield* streamAnthropic(response, options, contextWindow, watchdog);
      else if (api === "google") yield* streamGoogle(response, options, contextWindow, watchdog);
      else yield* streamChatCompletions(response, options, contextWindow, watchdog);
```

#### 缺口

- 不同模型/端点真实错误结构与流事件未知
  **影响：**新模型或网关变更时可能请求失败/误分类
  **进一步探讨：**四协议目标模型做文本/工具/图片/取消/错误矩阵

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样小范围接入并判断是否值得采用？

**研究主题：**采用判断、新假设与验证、效果与总成本

#### 完整回答

已有付费 Console 账号时可按作者说明从 npm 安装，在 DSH 设置保存 Key，先只验证单个可用付费模型的文本、工具、图片/推理和 usage，再扩到各协议；记录计费、速率/地域错误以及静态目录误报。部署成本含账户余额、网关请求、每5分钟目录刷新及 models.dev 外部请求；金额/时延未在此证实。改进方向是使静态目录只在 live 失败时回退、别存 key 前缀、按网关结构化错误判别并维护可测试路由表，这些均未实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:32-57](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/README.zh-CN.md#L32-L57)

作者安装路径

<details>
<summary>查看原文（26行）</summary>

````text
## 安装

**方式一推荐：零配置，既不需要 git，也不需要改任何 registry。** 只有方式三（GitHub 源码）需要本机已安装 git。

### 方式一：从 npmjs 安装（推荐）

```bash
dsh plugin add @a42null/dsh-opencode-zen-plugin
```

包页面：<https://www.npmjs.com/package/@a42null/dsh-opencode-zen-plugin>

### 方式二：预构建 tarball（无需 git）

在 DSH「设置 → 插件 → 添加插件」里粘贴，或命令行执行：

```bash
dsh plugin add https://github.com/A42Null/dsh-opencode-zen-plugin/releases/latest/download/dsh-opencode-zen-plugin.tgz
```

该地址始终指向最新版本（Release 资产名不含版本号，因此不会随发版失效）。

### 方式三：GitHub 源码（⚠️ 需要本机已安装 git 且在 PATH 中）

```bash
dsh plugin add github:A42Null/dsh-opencode-zen-plugin
````

</details>

**依据 2 · 作者声明**：[README.zh-CN.md:97-123](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/README.zh-CN.md#L97-L123)

设置/鉴权/状态

<details>
<summary>查看原文（27行）</summary>

```text
## 配置（设置 → 插件 → OpenCode Zen → 配置）

> DSH 的设置界面由插件的**客户端半部**（`lib/client.js`）贡献：本插件注册到 `plugins.row.config` 插槽（key = `<包名>#<行 id>`），因此在「设置 → 插件」里 opencode-zen 一行会出现「配置」入口。仅安装 host 半部（`lib/index.js`）时模型可用，但**不会**有任何设置界面。

| 字段 | 说明 | 默认值 |
| --- | --- | --- |
| `apiKey` | OpenCode Console API Key，**必填**。在 https://opencode.ai/console 登录后获取 | 空 |
| `baseUrl` | OpenCode Zen 网关地址 | `https://opencode.ai/zen` |
| `includeFreeModels` | 是否包含免费（`*-free`）模型；**默认关闭**，因为它们只能在 OpenCode 客户端内使用 | `false` |
| `refreshSeconds` | 模型目录自动刷新间隔（秒，30–86400） | `300` |

保存后立即生效，无需重启 DSH。作为兜底，也可用环境变量 `OPENCODE_ZEN_API_KEY` 提供 Key（配置项优先）。

## 鉴权

所有端点使用 `Authorization: Bearer <apiKey>`；Anthropic 端点同时附加 `x-api-key` 与 `anthropic-version: 2023-06-01`，Google 端点同时附加 `x-goog-api-key`。模型列表接口无需鉴权，未填 Key 时也能看到模型，但实际调用会返回 AUTH 错误提示。

## 运行状态与缓存

| 路径 | 内容 |
| --- | --- |
| `~/.opencode-zen/adapter-status.json` | 目录健康快照：`status` / `total` / `updatedAt` / `lastError` |
| `~/.opencode-zen/models.dev.json` | models.dev 元数据缓存（7 天有效，tmp+rename 原子写入） |
| `~/.opencode-zen/plugin-load.json` | 最近一次插件加载标记（`build` / `loadedAt` / `pid`），用于确认运行中的是哪一版代码 |
| `~/.opencode-zen/errors.log` | 适配器失败原始记录：时间、HTTP 状态、协议、模型、错误码、响应体片段（上限 128 KB，超出自动清空） |

> 错误码命名对齐 DSH 规范：余额不足用 `QUOTA`（命中客户端"当前请求的额度已用尽"文案与全局欠费提示），密钥问题用 `AUTH`，免费层门禁用 `FREE_TIER_BLOCKED`，模型无权限用 `MODEL_ACCESS_DISABLED`（后两者在界面直接展示插件给出的中文说明）。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:945-999](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L945-L999)

刷新/元数据访问

<details>
<summary>查看原文（55行）</summary>

```text
  start() {
    const tick = () => {
      if (this.stopped) return;
      const seconds = Number(this.readSettings().refreshSeconds);
      const ms = (Number.isFinite(seconds) && seconds >= 30 ? seconds : 300) * 1000;
      this.timer = setTimeout(() => { this.refreshOnce().finally(tick); }, ms);
      this.timer.unref?.();
    };
    this.refreshOnce().finally(tick);
  }

  stop() {
    this.stopped = true;
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
  }

  async refreshOnce() {
    const errors = [];
    try {
      const baseUrl = (this.readSettings().baseUrl ?? ZEN_BASE_URL).replace(/\/+$/, "");
      const response = await fetch(`${baseUrl}/v1/models`, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(30_000) });
      if (response.ok) {
        const payload = await response.json();
        const ids = Array.isArray(payload?.data) ? payload.data.map((m) => m?.id).filter((id) => typeof id === "string" && id.length > 0) : [];
        this.liveIds = ids;
      } else {
        errors.push(`models list HTTP ${response.status}`);
      }
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
    await this.loadMetadata();
    const list = this.list();
    this.status = {
      status: errors.length > 0 && list.length === 0 ? "error" : "ok",
      total: list.length,
      updatedAt: Date.now(),
      lastError: errors.join("; "),
    };
    this.onRefresh?.(this.status);
  }

  async loadMetadata() {
    const fresh = await this.readCache();
    if (fresh) { this.metadata = fresh; return; }
    try {
      const response = await fetch(METADATA_URL, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(30_000) });
      if (!response.ok) return;
      const data = await response.json();
      const decoded = decodeModelsDev(data);
      if (decoded.size > 0) {
        this.metadata = decoded;
        await this.writeCache(data);
      }
    } catch { /* metadata is optional */ }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1023-1055](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L1023-L1055)

可见目录边界

<details>
<summary>查看原文（33行）</summary>

```text
  list() {
    const ids = new Set(this.liveIds);
    for (const id of STATIC_MODELS) ids.add(id);
    const result = [];
    for (const id of ids) {
      const entry = entryFor(id);
      if (!entry) continue;
      if (this.readSettings().includeFreeModels === false && entry.free) continue;
      result.push(this.decorate(entry));
    }
    result.sort((a, b) => a.id.localeCompare(b.id));
    return result;
  }

  resolve(id) {
    const entry = entryFor(id);
    if (!entry) return null;
    return this.decorate(entry);
  }

  decorate(entry) {
    const meta = this.metadata.get(entry.id);
    const contextWindow = meta?.contextWindow ?? entry.contextWindow;
    const maxTokens = meta?.maxTokens ?? entry.maxTokens;
    const reasoning = meta?.reasoning ?? entry.reasoning;
    return {
      ...entry,
      contextWindow: typeof contextWindow === "number" ? contextWindow : undefined,
      maxTokens: typeof maxTokens === "number" ? maxTokens : undefined,
      reasoning,
      effortValues: meta?.effortValues ?? [],
    };
  }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1341-1363](https://github.com/A42Null/dsh-opencode-zen-plugin/blob/e1d0054333d5f8185f3d6e55f563e5fe91e19b29/lib/index.js#L1341-L1363)

密钥片段日志

<details>
<summary>查看原文（23行）</summary>

```text
  // 加载标记：用于确认运行中的 DSH 载入的是哪一版代码、以及配置是否真的读到。
  const initial = readSettings();
  void mkdir(dataDir, { recursive: true })
    .then(() =>
      writeFile(
        join(dataDir, "plugin-load.json"),
        JSON.stringify(
          {
            loadedAt: new Date().toISOString(),
            pid: typeof process !== "undefined" ? process.pid : null,
            providerId,
            build: BUILD_TAG,
            consoleIsVolatileRef: isVolatileRef(config.console),
            apiKeyLength: initial.apiKey.length,
            apiKeyPrefix: initial.apiKey.slice(0, 10),
            baseUrl: initial.baseUrl,
            includeFreeModels: initial.includeFreeModels,
            refreshSeconds: initial.refreshSeconds,
          },
          null,
          2,
        ),
        "utf8",
```

</details>

#### 缺口

- 目标费用、安装与多协议成功率未知
  **影响：**无法给出生产采用或收益断言
  **进一步探讨：**隔离配置分协议试用并对账账单/日志

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
