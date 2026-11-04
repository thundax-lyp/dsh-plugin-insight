# Atlas Cloud Skills

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[b203244](https://github.com/AtlasCloudAI/atlas-cloud-skills/tree/b20324427604dc876a08e594218ca3f1b32cfef7)

<!-- BEGIN META -->
[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AtlasCloudAI/atlas-cloud-skills)
<!-- END META -->

> **功能**：提供 Atlas Cloud 多媒体生成指南、视频提示技能和示例工作流。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示项目组合多份技能和可恢复视频任务脚本；模型生成能力来自外部服务，不归因于本集合。

> **主要限制**：[Q03](#research-q03) 的素材和凭据会进入外部路径；[Q02](#research-q02) 直接脚本的音轨重试可能产生额外生成，不应将托管连接器报价机制假定适用。

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
  - [Q01 · 谁用它做什么，和直接调用服务相比有什么增量？](#detail-section-11)
  - [Q02 · 视频执行器如何选择提供方、提交并恢复任务？](#detail-section-12)
  - [Q03 · 输入、密钥和生成结果有哪些边界？](#detail-section-13)
  - [Q04 · 使用需要哪些条件、成本和停止标准？](#detail-section-14)
  - [Q05 · 可证伪的后续改进是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用云端生成模型的创作者或开发者可参考多媒体 API、视频规划和提示规范。

直接阅读服务 API 或手写提示与请求也能完成部分工作；项目把指南、模型路线和脚本组织为可复用资源。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Atlas API 指南 | 组织多媒体服务调用 | 模型和价格需实际核实 |
| Seedance 视频脚本 | 提交、轮询和下载视频 | 需服务、媒体工具与预算 |
| 跨模型提示规范 | 表达全局条件、锁定项和阶段 | 跨模型效果未实测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容技能宿主 | 使用技能说明需要 | 加载指南与资源 | 未验证 DSH 发现或加载 |
| Atlas 服务身份和网络 | 云生成需要 | 提交并获取任务 | 密钥或网络缺失时脚本报错 |
| Node、ffmpeg、ffprobe | 视频脚本需要 | 执行与检查音视频 | 运行环境未实测 |
| CLI 及登录 | CLI 适配器需要 | 发起请求 | 可按配置选择 REST |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认素材许可、服务与预算 | 不明确时不提交 |
| 规划 | 创作者选择镜头及模型能力 | 证据不足先核可用性 |
| 执行 | 脚本提交或恢复已有任务 ID | 轮询结束未知时不盲目新建 |
| 验收 | 用户检查视频、音频及账单 | 质量不符或成本超预期时停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 服务与环境成本未知 | 配置认证和准备素材 | 服务与宿主未实测 |
| 持续 | 生成、上传与本地计算成本未知 | 检查镜头及输出 | 音轨失败可能自动重试 |
| 失败恢复 | 轮询、重试和存储成本未知 | 回查任务 ID 和账单 | 窗口超时不代表远端终止 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 视频流程 | 有规划文档和 REST/CLI 脚本 | 成片质量与兼容性 |
| 恢复 | 已提交 ID 可用于恢复 | 远端任务的实际状态与费用 |
| 提示规范 | 规定范围、锁定项与阶段 | 跨模型实际一致性 |

> **思考**：[Q03](#research-q03) 的素材和凭据会进入外部路径；[Q02](#research-q02) 直接脚本的音轨重试可能产生额外生成，不应将托管连接器报价机制假定适用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示项目组合多份技能和可恢复视频任务脚本；模型生成能力来自外部服务，不归因于本集合。

[Q02](#research-q02) 的适配器与预测 ID 恢复区分请求和轮询；自动音频重试与 [Q03](#research-q03) 的托管报价路径需要分别理解。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的素材和凭据会进入外部路径；[Q02](#research-q02) 直接脚本的音轨重试可能产生额外生成，不应将托管连接器报价机制假定适用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先核素材许可、服务政策和预算，使用非敏感小样；任务状态未知时保留 ID 回查，不盲目新提交。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已定向检查固定技能与脚本；云端能力、价格、质量和新假设均未验证。

- 已检查：作者 README、包清单、源码路径 README.md、install.sh、atlas-cloud/SKILL.md、skills/seedance-2-5-skill/SKILL.md、skills/universal-video-prompt-skill/SKILL.md、skills/seedance-2-5-skill/scripts/generate.mjs、skills/seedance-2-5-skill/scripts/providers/index.mjs、skills/seedance-2-5-skill/scripts/providers/atlas-rest.mjs、skills/seedance-2-5-skill/scripts/providers/atlas-cli.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根目录为多技能和素材集合，定向检查 Atlas 指南、Seedance 规划与 REST/CLI 执行器、通用提示规范及安装脚本；未运行代码、服务、模型或收费生成，未逐项审计其他参考与示例。
- 下一步：使用隔离测试服务和授权素材检查模型发现、请求、轮询中断、音轨重试、输出写入和账单。

**分析版本**

- **仓库**：[AtlasCloudAI/atlas-cloud-skills](https://github.com/AtlasCloudAI/atlas-cloud-skills)
- **版本号**：未声明（[固定提交 b203244](https://github.com/AtlasCloudAI/atlas-cloud-skills/tree/b20324427604dc876a08e594218ca3f1b32cfef7)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出覆盖直接脚本提交与重试的预算和恢复状态提示；若不能改善决策或代价过高则否定。

使用隔离测试服务和授权素材检查模型发现、请求、轮询中断、音轨重试、输出写入和账单。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 77 | 9379 | — | — | 79237 |
| .mjs | source | 4 | 726 | 650 | 35 | — |
| .md | example | 1 | 210 | — | — | 1479 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/AtlasCloudAI/atlas-cloud-skills/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AtlasCloudAI/atlas-cloud-skills/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AtlasCloudAI/atlas-cloud-skills/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查技能集合及视频脚本的真实执行、付费、恢复和数据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁用它做什么，和直接调用服务相比有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要制作图像或视频、并使用 Atlas Cloud 的创作者或开发者，可以使用仓库中的服务指南、Seedance 制作流程、跨模型提示规范与示例素材。直接阅读服务文档或手工构造请求也能完成部分工作；本仓库的增量是组织多份技能与制作模板，并附一个执行脚本，而非实现生成模型本身。根目录是技能和素材集合，没有看到 DSH bundle 或单一插件入口；目录收录不证明它是原生 DSH 插件。没有同任务效果、质量或时间对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:60-92](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/README.md#L60-L92)

作者区分服务指南、模型技能与通用提示规范。

<details>
<summary>查看原文（33行）</summary>

```text
### atlas-cloud

Quickly integrate Atlas Cloud API into your projects. This skill provides:

- Complete API reference for image generation, video generation, LLM chat, media upload, and quick generation
- All 9 MCP tools documented: `atlas_list_models`, `atlas_search_docs`, `atlas_get_model_info`, `atlas_generate_image`, `atlas_generate_video`, `atlas_quick_generate`, `atlas_chat`, `atlas_get_prediction`, `atlas_upload_media`
- Ready-to-use code templates in Python, Node.js/TypeScript, and cURL
- Popular model IDs with pricing info
- OpenAI SDK compatibility guide for LLM models
- Error handling, retry strategy, and best practices

### seedance-2-5-skill

A model-specific sub-skill for controllable Seedance video, layered on top of `atlas-cloud`. Use it when a job needs shot planning rather than a single prompt:

- **Route selection first** — text-to-video, storyboard-image-to-video, asset-reference-to-video, first-and-last-frame, or extending an existing clip
- **Reference discipline** — how to assign people / product / scene / style / audio references so identity holds across shots
- **Shot craft** — camera, lighting and composition vocabulary, transition patterns, long-video continuity, real-person handling
- **Editing and extension** — rewriting part of an existing video, changing lighting or style, extending a short clip
- **Execution** — submits through Atlas Cloud (MCP, CLI or REST) and verifies model availability before a billable run
- Every reference ships in English and Simplified Chinese; Chinese requests follow a dedicated Chinese workflow

Works with [`universal-video-prompt-skill`](#universal-video-prompt-skill) when the same brief needs to run on more than one model. Prompt library for this model: [awesome-seedance-2.5-prompts-skills](https://github.com/AtlasCloudAI/awesome-seedance-2.5-prompts-skills)

### universal-video-prompt-skill

Model-agnostic companion to `seedance-2-5-skill`. It writes one prompt **spec** — scope, locks, staging, end states — separately from the dialect that expresses it, then compiles that spec for whichever video model you can actually call. Use it when:

- The same brief has to run on several models, or the target model is not available yet and the work must proceed elsewhere
- You are building a model-comparison matrix and need the prompts to differ only by dialect
- A prompt must survive a model swap instead of being rewritten

Each model carries a measured profile (reference syntax, limits, timing adherence, default-bias behaviour); the skill probes what it does not know, degrades the spec to what the model supports, and reports every degrade. English + Simplified Chinese references throughout.
```

</details>

**依据 2 · 作者声明**：[README.md:94-110](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/README.md#L94-L110)

作者说明以技能方式安装。

<details>
<summary>查看原文（17行）</summary>

````text
## Installation

### One-Line Install

```bash
npx skills add AtlasCloudAI/atlas-cloud-skills
```

### Shell Script

```bash
curl -fsSL https://raw.githubusercontent.com/AtlasCloudAI/atlas-cloud-skills/main/install.sh | sh
```

### Manual

Copy `atlas-cloud/` to `~/.claude/skills/atlas-cloud/`, and any sub-skill under `skills/` to `~/.claude/skills/<name>/`.
````

</details>

**依据 3 · 源码核查**：[install.sh:22-43](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/install.sh#L22-L43)

安装器将多个技能目录复制到技能目录。

<details>
<summary>查看原文（22行）</summary>

```text
install_one() {
  name="$1"; src="$2"
  dest="$SKILLS_ROOT/$name"
  mkdir -p "$dest"
  cp -r "$src/." "$dest/"
  echo "  installed $name -> $dest"
}

echo "Installing Atlas Cloud skills for Claude Code..."

if [ "$WANT" = "all" ] || [ "$WANT" = "atlas-cloud" ]; then
  install_one "atlas-cloud" "$TMP_DIR/atlas-cloud"
fi

if [ -d "$TMP_DIR/skills" ]; then
  for dir in "$TMP_DIR"/skills/*/; do
    [ -d "$dir" ] || continue
    name=$(basename "$dir")
    if [ "$WANT" = "all" ] || [ "$WANT" = "$name" ]; then
      install_one "$name" "$dir"
    fi
  done
```

</details>

#### 缺口

- 没有同任务的人类创作对照
  **影响**：不能量化视频质量、节时或模型一致性
  **进一步探讨**：同一素材比较直接调用与技能流程，记录成片和迭代成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 视频执行器如何选择提供方、提交并恢复任务？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Seedance 脚本读取配置和工作目录，选择 REST 或 CLI 适配器，按配置提交图片或视频并轮询 prediction ID，再下载结果。REST 默认使用 Atlas 地址与环境密钥，请求有 45 秒默认超时；本地轮询窗口到期会报告任务 ID 并建议恢复，不能当成远端已经失败。脚本对可恢复任务保留 ID；但启用音频时，输出缺音轨会按配置再次提交生成，默认可重试两次，可能产生额外服务成本。MCP 路径在技能文档中描述，但执行器明确拒绝直接以 atlas-mcp 或 atlas-skill 作为脚本适配器，不能将它们当作本脚本已接线。

#### 证据与依据

**依据 1 · 源码核查**：[skills/seedance-2-5-skill/scripts/generate.mjs:18-32](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/skills/seedance-2-5-skill/scripts/generate.mjs#L18-L32)

读取配置、选择执行器及默认重试设置。

<details>
<summary>查看原文（15行）</summary>

```text
const CFG_PATH = resolve(process.argv[2] || "./config.json");
const CFG = JSON.parse(readFileSync(CFG_PATH, "utf8"));
const ROOT = dirname(CFG_PATH);
const DIR = resolve(ROOT, CFG.outDir || "build");
const FFMPEG = process.env.FFMPEG_PATH || CFG.ffmpeg || "ffmpeg";
const FFPROBE = process.env.FFPROBE_PATH || CFG.ffprobe || "ffprobe";
const MODE = CFG.mode || "grid";
const PROFILE = resolveModelProfile(CFG.modelProfile);
const EXECUTOR = createExecutor({ config: CFG, root: ROOT, log: console.log });
const IMG_MODEL = CFG.grid?.model || PROFILE.image;
const VID_MODEL = CFG.video?.model || PROFILE.video.i2v;
const V = { resolution: "1080p", ratio: "9:16", duration: 5, generate_audio: true, watermark: false, ...CFG.video };
const AUDIO = CFG.audio || {};
const AUDIO_OUTPUT_RETRIES = Number.isInteger(AUDIO.outputRetries) ? Math.max(0, AUDIO.outputRetries) : 2;
const MAX_POLL_SECONDS = CFG.maxPollSeconds ?? 900;
```

</details>

**依据 2 · 源码核查**：[skills/seedance-2-5-skill/scripts/providers/index.mjs:21-30](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/skills/seedance-2-5-skill/scripts/providers/index.mjs#L21-L30)

执行器选择及不支持的直接适配器。

<details>
<summary>查看原文（10行）</summary>

```text
export function createExecutor({ config, root, log }) {
  const adapter = config.execution?.adapter || "atlas-rest";
  if (adapter === "atlas-cli") return createAtlasCliExecutor({ config, root, log });
  if (adapter === "atlas-rest") return createAtlasRestExecutor({ config, root, log });
  if (adapter === "auto") {
    log?.("[executor] execution.adapter=auto is retained for compatibility and now resolves to atlas-rest; set atlas-cli explicitly for CLI execution.");
    return createAtlasRestExecutor({ config, root, log });
  }
  if (adapter === "atlas-skill" || adapter === "atlas-mcp") {
    throw new Error(`runner cannot call ${adapter} directly. Use that route from the agent conversation, or set execution.adapter to atlas-rest or atlas-cli.`);
```

</details>

**依据 3 · 源码核查**：[skills/seedance-2-5-skill/scripts/providers/atlas-rest.mjs:34-75](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/skills/seedance-2-5-skill/scripts/providers/atlas-rest.mjs#L34-L75)

REST 凭据、超时与请求。

<details>
<summary>查看原文（42行）</summary>

```text
export function createAtlasRestExecutor({ config, root, log = console.log }) {
  const execution = config.execution || {};
  const base = execution.base || config.base || "https://api.atlascloud.ai";
  const apiKeyEnv = execution.apiKeyEnv || config.apiKeyEnv || "ATLASCLOUD_API_KEY";
  const requestTimeoutMs = execution.requestTimeoutMs ?? 45_000;
  const key = process.env[apiKeyEnv]
    || process.env.ATLASCLOUD_API_KEY
    || process.env.ATLAS_CLOUD_API_KEY;

  if (!key) {
    throw new Error(
      `no Atlas Cloud API key is visible in this process. Get one at https://www.atlascloud.ai/console/api-keys?utm_source=github&utm_campaign=awesome-seedance-2.5-prompts-skills and set ${apiKeyEnv}. `
      + "If it is already configured in a parent process or host application, refresh or restart the execution session so this process inherits it. Do not paste the key into chat.",
    );
  }

  async function request(path, body, { auth = true } = {}) {
    const headers = body ? { "Content-Type": "application/json" } : {};
    if (auth) headers.Authorization = `Bearer ${key}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), requestTimeoutMs);
    let response;
    try {
      response = await fetch(base + path, {
        method: body ? "POST" : "GET",
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch (error) {
      const message = error.name === "AbortError"
        ? `${path} fetch failed: timed out after ${requestTimeoutMs}ms`
        : `${path} fetch failed: ${error.message}`;
      throw new Error(message);
    } finally {
      clearTimeout(timer);
    }
    const text = await response.text();
    let json;
    try { json = JSON.parse(text); } catch { throw new Error(`${path} HTTP ${response.status}: ${text.slice(0, 200)}`); }
    if (!response.ok) throw new Error(`${path} HTTP ${response.status}: ${text.slice(0, 200)}`);
    return unwrap(json);
```

</details>

**依据 4 · 源码核查**：[skills/seedance-2-5-skill/scripts/providers/atlas-rest.mjs:78-103](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/skills/seedance-2-5-skill/scripts/providers/atlas-rest.mjs#L78-L103)

轮询及窗口结束后的结果未知。

<details>
<summary>查看原文（26行）</summary>

```text
  async function poll(id, label, maxPollSeconds = 900) {
    for (let elapsed = 0; ; elapsed += POLL_INTERVAL_SECONDS) {
      if (elapsed > maxPollSeconds) {
        throw new Error(`[${label}] local polling window ended after ${maxPollSeconds}s for task ${id}; task status is not a terminal failure, so resume this ID instead of resubmitting`);
      }
      let prediction;
      let error;
      try { prediction = await request(`/api/v1/model/prediction/${id}`); }
      catch (firstError) {
        try { prediction = await request(`/api/v1/model/result/${id}`); }
        catch (secondError) { error = `${firstError.message} | ${secondError.message}`; }
      }
      if (!prediction) {
        if (/HTTP 50[234]|fetch failed|HTTP 404/.test(error)) {
          await new Promise(resolveDelay => setTimeout(resolveDelay, POLL_INTERVAL_MS));
          continue;
        }
        throw new Error(error);
      }
      const status = String(prediction.status || "unknown").toLowerCase();
      if (elapsed % 32 === 0) log(`[${label}] ${status} … ${elapsed}s`);
      if (status === "completed" || status === "succeeded") return prediction;
      if (status === "failed" || status === "timeout" || status === "canceled") {
        throw new Error(`[${label}] ${status}: ${JSON.stringify(prediction.error ?? prediction.meta_info ?? "").slice(0, 300)}`);
      }
      await new Promise(resolveDelay => setTimeout(resolveDelay, POLL_INTERVAL_MS));
```

</details>

**依据 5 · 源码核查**：[skills/seedance-2-5-skill/scripts/generate.mjs:106-133](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/skills/seedance-2-5-skill/scripts/generate.mjs#L106-L133)

保留 ID 并可恢复图像任务。

<details>
<summary>查看原文（28行）</summary>

```text
function resumePredictionIdFor(label, explicitId) {
  const id = explicitId || CFG.execution?.resumePredictionIds?.[label];
  if (id !== undefined && (typeof id !== "string" || !id.trim())) {
    throw new Error(`execution.resumePredictionIds.${label} must be a non-empty prediction ID`);
  }
  return id;
}

function taskRecoveryError(label, id, error) {
  const message = error instanceof Error ? error.message : String(error);
  return new Error(
    `${message} Preserve prediction ${id}; resume it with execution.resumePredictionIds.${label}. `
    + "Do not submit a replacement unless the task reaches a terminal failure and an explicit retry decision is made.",
  );
}

async function generateImage(body, label, explicitResumeId) {
  const resumeId = resumePredictionIdFor(label, explicitResumeId);
  let id;
  try {
    id = resumeId || (await EXECUTOR.submitImage(body)).id;
    console.log(resumeId ? `[${label}] resuming ${id}` : `[${label}] submitted ${id}`);
    const result = await EXECUTOR.poll(id, label, MAX_POLL_SECONDS);
    if (!result.outputs?.[0]) throw new Error(`[${label}] completed without an image output`);
    return result;
  } catch (error) {
    if (!id) throw error;
    throw taskRecoveryError(label, id, error);
```

</details>

**依据 6 · 源码核查**：[skills/seedance-2-5-skill/scripts/generate.mjs:137-169](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/skills/seedance-2-5-skill/scripts/generate.mjs#L137-L169)

视频音轨缺失时的重试分支。

<details>
<summary>查看原文（33行）</summary>

```text
async function generateVideo(body, label, out, last, resumePredictionId) {
  const tries = V.generate_audio ? AUDIO_OUTPUT_RETRIES + 1 : 1;
  const hasReferenceAudio = Array.isArray(body.reference_audios) && body.reference_audios.length > 0;
  const configuredResumeId = resumePredictionIdFor(label, resumePredictionId);
  for (let attempt = 1; attempt <= tries; attempt++) {
    let id;
    try {
      id = configuredResumeId && attempt === 1
        ? configuredResumeId
        : (await EXECUTOR.submitVideo(body)).id;
      console.log(configuredResumeId && attempt === 1
        ? `[${label}] resuming ${id}`
        : `[${label}] submitted ${id}${attempt > 1 ? ` (native-audio retry ${attempt - 1}/${AUDIO_OUTPUT_RETRIES})` : ""}`);
      const d = await EXECUTOR.poll(id, label, MAX_POLL_SECONDS);
      if (!d.outputs?.[0]) throw new Error(`[${label}] model returned no video output`);
      await EXECUTOR.download(d.outputs[0], out);
      if (V.generate_audio && !hasAudio(out)) throw new Error(`[audio-output] ${label} video has no native audio track`);
      if (last && d.outputs[1]) await EXECUTOR.download(d.outputs[1], last);
      return d;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (hasReferenceAudio && isInputAudioFailure(message)) {
        throw new Error(`[${label}] input audio reference failed; check audio.references file, format, accessibility, or segment audioRefs. Original error: ${message}`);
      }
      if (V.generate_audio && isOutputAudioFailure(message) && attempt < tries) {
        console.warn(`[${label}] native audio output failed; regenerating with generate_audio:true (${attempt}/${AUDIO_OUTPUT_RETRIES})`);
        continue;
      }
      if (V.generate_audio && isOutputAudioFailure(message)) {
        throw new Error(`[${label}] native audio output failed after ${AUDIO_OUTPUT_RETRIES} retries; it was not downgraded to silent video. Original error: ${message}`);
      }
      if (!id) throw error;
      throw taskRecoveryError(label, id, error);
```

</details>

#### 缺口

- 未运行生成、恢复或 CLI
  **影响**：不能确认服务状态、结果和实际收费
  **进一步探讨**：隔离测试任务验证提交、超时恢复、音轨重试及账单。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 输入、密钥和生成结果有哪些边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

REST 适配器从环境读取 API key，上传本地媒体时读取文件并发送到服务，输出下载直接写入目标路径；具体文件可见范围、远端保留期限和输出质量取决于服务与配置，本次没有独立核查。CLI 适配器在尚未登录时默认拒绝将 key 放入进程参数，只有显式设置环境开关才执行；这一保护不代表所有凭据或生成数据不会泄露。技能文档另描述托管连接器的两次报价确认，但 REST/CLI 脚本直接提交的代码没有同一确认令牌链，不能将文档中的付费确认机制泛化到所有路径。

#### 证据与依据

**依据 1 · 源码核查**：[skills/seedance-2-5-skill/scripts/providers/atlas-rest.mjs:34-47](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/skills/seedance-2-5-skill/scripts/providers/atlas-rest.mjs#L34-L47)

从环境读取密钥并拒绝缺失。

<details>
<summary>查看原文（14行）</summary>

```text
export function createAtlasRestExecutor({ config, root, log = console.log }) {
  const execution = config.execution || {};
  const base = execution.base || config.base || "https://api.atlascloud.ai";
  const apiKeyEnv = execution.apiKeyEnv || config.apiKeyEnv || "ATLASCLOUD_API_KEY";
  const requestTimeoutMs = execution.requestTimeoutMs ?? 45_000;
  const key = process.env[apiKeyEnv]
    || process.env.ATLASCLOUD_API_KEY
    || process.env.ATLAS_CLOUD_API_KEY;

  if (!key) {
    throw new Error(
      `no Atlas Cloud API key is visible in this process. Get one at https://www.atlascloud.ai/console/api-keys?utm_source=github&utm_campaign=awesome-seedance-2.5-prompts-skills and set ${apiKeyEnv}. `
      + "If it is already configured in a parent process or host application, refresh or restart the execution session so this process inherits it. Do not paste the key into chat.",
    );
```

</details>

**依据 2 · 源码核查**：[skills/seedance-2-5-skill/scripts/providers/atlas-rest.mjs:107-132](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/skills/seedance-2-5-skill/scripts/providers/atlas-rest.mjs#L107-L132)

下载写文件及本地媒体上传。

<details>
<summary>查看原文（26行）</summary>

```text
  async function download(url, destination) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`download HTTP ${response.status}`);
    const { writeFileSync } = await import("node:fs");
    writeFileSync(destination, Buffer.from(await response.arrayBuffer()));
  }

  async function uploadMedia(source) {
    if (/^https?:\/\//.test(source)) return source;
    const path = resolve(root, source);
    const buffer = readFileSync(path);
    const mime = /\.(png|jpe?g|webp)$/i.test(path) ? imageMime(buffer, path) : audioMime(path);
    const form = new FormData();
    form.append("file", new Blob([buffer], { type: mime }), basename(path));
    const response = await fetch(`${base}/api/v1/model/uploadMedia`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: form,
    });
    const text = await response.text();
    let json;
    try { json = JSON.parse(text); } catch { throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`); }
    const data = unwrap(json);
    const url = data?.download_url || data?.url;
    if (!response.ok || !url) throw new Error(text.slice(0, 300));
    return url;
```

</details>

**依据 3 · 源码核查**：[skills/seedance-2-5-skill/scripts/providers/atlas-cli.mjs:68-87](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/skills/seedance-2-5-skill/scripts/providers/atlas-cli.mjs#L68-L87)

CLI 令牌参数暴露需要明确开关。

<details>
<summary>查看原文（20行）</summary>

```text
export function createAtlasCliExecutor({ config, root, log = console.log }) {
  const command = resolveAtlasCliCommand(config);

  if (!atlasCliIsAvailable(command)) {
    throw new Error(`atlas-cli is unavailable (${command}). Install it, then run \`${command} auth login\`, or use execution.adapter: \"atlas-rest\".`);
  }
  if (!atlasCliIsAuthenticated(command)) {
    const key = atlasApiKey(config);
    if (!key) throw new Error(`atlas-cli is not logged in and no Atlas API key is available. Run \`${command} auth login\`, or use execution.adapter: \"atlas-rest\".`);
    // A key passed as a command-line argument is visible to every other process
    // on the host (ps / procfs), so non-interactive login is opt-in only.
    if (process.env.ATLAS_CLI_ALLOW_ARGV_TOKEN !== "1") {
      throw new Error(
        `atlas-cli is not logged in. Non-interactive login would pass the Atlas API key as a command-line argument, which other processes on this host can read. `
        + `Pick one: (1) run \`${command} auth login\` once interactively, (2) set execution.adapter: \"atlas-rest\" to call the HTTPS API directly, `
        + `or (3) set ATLAS_CLI_ALLOW_ARGV_TOKEN=1 to accept that exposure on a single-user machine.`
      );
    }
    log("[executor] WARNING: ATLAS_CLI_ALLOW_ARGV_TOKEN=1 - the Atlas API key is passed via argv and is readable by other processes on this host");
    const login = spawnSync(command, ["auth", "login", "--token", key, "--json"], { encoding: "utf8", env: process.env });
```

</details>

**依据 4 · 作者声明**：[atlas-cloud/SKILL.md:92-101](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/atlas-cloud/SKILL.md#L92-L101)

文档对托管连接器的两步报价确认。

<details>
<summary>查看原文（10行）</summary>

```text
### Generation Tools

**Two-call billing flow (hosted connector and plugin).** A generation tool called without
`confirmed` only quotes: it is free, prices this exact request, and returns the model, the
estimated cost, the billing account, an `idempotency_key` and a `confirmation_token`, and nothing
starts. Show the user that quote and wait for a yes; then call again with the same arguments,
`confirmed: true`, the same `idempotency_key` and the `confirmation_token`. To tell the user what a
request will cost, always make that quote call, even when they only ask about the price: prices
from `atlas_get_model_info`, `atlas_list_models` or the tables on this page are for choosing a
model, not a quote.
```

</details>

**依据 5 · 源码核查**：[skills/seedance-2-5-skill/scripts/generate.mjs:122-128](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/skills/seedance-2-5-skill/scripts/generate.mjs#L122-L128)

脚本经适配器直接提交或恢复。

```text
async function generateImage(body, label, explicitResumeId) {
  const resumeId = resumePredictionIdFor(label, explicitResumeId);
  let id;
  try {
    id = resumeId || (await EXECUTOR.submitImage(body)).id;
    console.log(resumeId ? `[${label}] resuming ${id}` : `[${label}] submitted ${id}`);
    const result = await EXECUTOR.poll(id, label, MAX_POLL_SECONDS);
```

#### 缺口

- 服务方数据政策、费用与安全实现未核实
  **影响**：不能判断隐私、授权范围或实际支出
  **进一步探讨**：在有授权的测试账户核对数据处理、账单和目的地。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用需要哪些条件、成本和停止标准？

**研究主题**：效果与总成本、采用判断

#### 完整回答

具体生成需要兼容的执行环境、服务身份、所需模型和网络；视频脚本注释要求 Node 18、ffmpeg、ffprobe，CLI 路径还需已安装并登录 CLI。首次需要选择模型、配置密钥和检查素材授权，持续可能产生云端生成、上传、下载及本地计算成本，失败恢复需保留 ID、检查已有任务与输出；金额和耗时取决于服务与任务，本次未知。可以先观察并用非敏感素材在确认预算和数据政策后运行小样；模型不可用、实际费用或上传范围不明、任务状态未知时停止新提交，先按已有 ID 回查。

#### 证据与依据

**依据 1 · 作者声明**：[skills/seedance-2-5-skill/scripts/generate.mjs:1-12](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/skills/seedance-2-5-skill/scripts/generate.mjs#L1-L12)

作者声明运行时和媒体工具依赖。

<details>
<summary>查看原文（12行）</summary>

```text
// Seedance video workflow — provider-adapted Atlas executor + ffmpeg draft stitcher.
// Modes:
//   "grid"       (default): crop a storyboard; one independent I2V clip per panel.
//   "shot-pairs": independent I2V clips from start/end keyframe pairs; ideal for planned cuts.
//   "reference": role-specific R2V reference images (generated or local files).
//   "chain": one continuous action, with the previous generated tail as the next start image.
//
// Usage:
//   node generate.mjs <config.json>
//   GRID_ONLY=1 node generate.mjs <config.json>   # Generate grid and crop frames only; display grid.png and inspect it before video work.
//   CLIPS_MAX=1 node generate.mjs <config.json>   # In grid mode, run only the first N clips as a quality gate.
// Requires Node 18+, ffmpeg, and ffprobe. Execution adapters live in scripts/providers/.
```

</details>

**依据 2 · 源码核查**：[skills/seedance-2-5-skill/scripts/providers/atlas-cli.mjs:68-84](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/skills/seedance-2-5-skill/scripts/providers/atlas-cli.mjs#L68-L84)

CLI 可用与认证条件。

<details>
<summary>查看原文（17行）</summary>

```text
export function createAtlasCliExecutor({ config, root, log = console.log }) {
  const command = resolveAtlasCliCommand(config);

  if (!atlasCliIsAvailable(command)) {
    throw new Error(`atlas-cli is unavailable (${command}). Install it, then run \`${command} auth login\`, or use execution.adapter: \"atlas-rest\".`);
  }
  if (!atlasCliIsAuthenticated(command)) {
    const key = atlasApiKey(config);
    if (!key) throw new Error(`atlas-cli is not logged in and no Atlas API key is available. Run \`${command} auth login\`, or use execution.adapter: \"atlas-rest\".`);
    // A key passed as a command-line argument is visible to every other process
    // on the host (ps / procfs), so non-interactive login is opt-in only.
    if (process.env.ATLAS_CLI_ALLOW_ARGV_TOKEN !== "1") {
      throw new Error(
        `atlas-cli is not logged in. Non-interactive login would pass the Atlas API key as a command-line argument, which other processes on this host can read. `
        + `Pick one: (1) run \`${command} auth login\` once interactively, (2) set execution.adapter: \"atlas-rest\" to call the HTTPS API directly, `
        + `or (3) set ATLAS_CLI_ALLOW_ARGV_TOKEN=1 to accept that exposure on a single-user machine.`
      );
```

</details>

**依据 3 · 源码核查**：[skills/seedance-2-5-skill/scripts/providers/atlas-rest.mjs:78-82](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/skills/seedance-2-5-skill/scripts/providers/atlas-rest.mjs#L78-L82)

轮询期结束保留 ID。

```text
  async function poll(id, label, maxPollSeconds = 900) {
    for (let elapsed = 0; ; elapsed += POLL_INTERVAL_SECONDS) {
      if (elapsed > maxPollSeconds) {
        throw new Error(`[${label}] local polling window ended after ${maxPollSeconds}s for task ${id}; task status is not a terminal failure, so resume this ID instead of resubmitting`);
      }
```

**依据 4 · 源码核查**：[skills/seedance-2-5-skill/scripts/generate.mjs:137-163](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/skills/seedance-2-5-skill/scripts/generate.mjs#L137-L163)

音轨缺失可能再次生成。

<details>
<summary>查看原文（27行）</summary>

```text
async function generateVideo(body, label, out, last, resumePredictionId) {
  const tries = V.generate_audio ? AUDIO_OUTPUT_RETRIES + 1 : 1;
  const hasReferenceAudio = Array.isArray(body.reference_audios) && body.reference_audios.length > 0;
  const configuredResumeId = resumePredictionIdFor(label, resumePredictionId);
  for (let attempt = 1; attempt <= tries; attempt++) {
    let id;
    try {
      id = configuredResumeId && attempt === 1
        ? configuredResumeId
        : (await EXECUTOR.submitVideo(body)).id;
      console.log(configuredResumeId && attempt === 1
        ? `[${label}] resuming ${id}`
        : `[${label}] submitted ${id}${attempt > 1 ? ` (native-audio retry ${attempt - 1}/${AUDIO_OUTPUT_RETRIES})` : ""}`);
      const d = await EXECUTOR.poll(id, label, MAX_POLL_SECONDS);
      if (!d.outputs?.[0]) throw new Error(`[${label}] model returned no video output`);
      await EXECUTOR.download(d.outputs[0], out);
      if (V.generate_audio && !hasAudio(out)) throw new Error(`[audio-output] ${label} video has no native audio track`);
      if (last && d.outputs[1]) await EXECUTOR.download(d.outputs[1], last);
      return d;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (hasReferenceAudio && isInputAudioFailure(message)) {
        throw new Error(`[${label}] input audio reference failed; check audio.references file, format, accessibility, or segment audioRefs. Original error: ${message}`);
      }
      if (V.generate_audio && isOutputAudioFailure(message) && attempt < tries) {
        console.warn(`[${label}] native audio output failed; regenerating with generate_audio:true (${attempt}/${AUDIO_OUTPUT_RETRIES})`);
        continue;
```

</details>

#### 缺口

- 未核实服务实时价格、可用模型或实际账单
  **影响**：不能估算任务总价及时间
  **进一步探讨**：实际提交前取得对应路径的价格并核对任务和账单。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可证伪的后续改进是什么？

**研究主题**：新假设与验证

#### 完整回答

可以探索为脚本的每次直接提交和自动音频重试显示累计预算、素材来源及可恢复任务状态，让用户能在产生下一次费用前作决定。现有托管连接器文档已有报价确认，脚本也能保留 prediction ID；增量是把预算和重试决策覆盖到直接 REST/CLI 脚本，而非将已有的提示或恢复机制说成新发明。以音轨缺失和结果延迟的隔离任务比较重复提交、费用和恢复时间；若服务无法报价、不会改善用户决策或增加明显负担，则否定。当前没有实现或实验。

#### 证据与依据

**依据 1 · 作者声明**：[atlas-cloud/SKILL.md:92-101](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/atlas-cloud/SKILL.md#L92-L101)

托管连接器已有报价确认的作者描述。

<details>
<summary>查看原文（10行）</summary>

```text
### Generation Tools

**Two-call billing flow (hosted connector and plugin).** A generation tool called without
`confirmed` only quotes: it is free, prices this exact request, and returns the model, the
estimated cost, the billing account, an `idempotency_key` and a `confirmation_token`, and nothing
starts. Show the user that quote and wait for a yes; then call again with the same arguments,
`confirmed: true`, the same `idempotency_key` and the `confirmation_token`. To tell the user what a
request will cost, always make that quote call, even when they only ask about the price: prices
from `atlas_get_model_info`, `atlas_list_models` or the tables on this page are for choosing a
model, not a quote.
```

</details>

**依据 2 · 源码核查**：[skills/seedance-2-5-skill/scripts/generate.mjs:137-169](https://github.com/AtlasCloudAI/atlas-cloud-skills/blob/b20324427604dc876a08e594218ca3f1b32cfef7/skills/seedance-2-5-skill/scripts/generate.mjs#L137-L169)

直接脚本在音轨失败时可自动重试。

<details>
<summary>查看原文（33行）</summary>

```text
async function generateVideo(body, label, out, last, resumePredictionId) {
  const tries = V.generate_audio ? AUDIO_OUTPUT_RETRIES + 1 : 1;
  const hasReferenceAudio = Array.isArray(body.reference_audios) && body.reference_audios.length > 0;
  const configuredResumeId = resumePredictionIdFor(label, resumePredictionId);
  for (let attempt = 1; attempt <= tries; attempt++) {
    let id;
    try {
      id = configuredResumeId && attempt === 1
        ? configuredResumeId
        : (await EXECUTOR.submitVideo(body)).id;
      console.log(configuredResumeId && attempt === 1
        ? `[${label}] resuming ${id}`
        : `[${label}] submitted ${id}${attempt > 1 ? ` (native-audio retry ${attempt - 1}/${AUDIO_OUTPUT_RETRIES})` : ""}`);
      const d = await EXECUTOR.poll(id, label, MAX_POLL_SECONDS);
      if (!d.outputs?.[0]) throw new Error(`[${label}] model returned no video output`);
      await EXECUTOR.download(d.outputs[0], out);
      if (V.generate_audio && !hasAudio(out)) throw new Error(`[audio-output] ${label} video has no native audio track`);
      if (last && d.outputs[1]) await EXECUTOR.download(d.outputs[1], last);
      return d;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (hasReferenceAudio && isInputAudioFailure(message)) {
        throw new Error(`[${label}] input audio reference failed; check audio.references file, format, accessibility, or segment audioRefs. Original error: ${message}`);
      }
      if (V.generate_audio && isOutputAudioFailure(message) && attempt < tries) {
        console.warn(`[${label}] native audio output failed; regenerating with generate_audio:true (${attempt}/${AUDIO_OUTPUT_RETRIES})`);
        continue;
      }
      if (V.generate_audio && isOutputAudioFailure(message)) {
        throw new Error(`[${label}] native audio output failed after ${AUDIO_OUTPUT_RETRIES} retries; it was not downgraded to silent video. Original error: ${message}`);
      }
      if (!id) throw error;
      throw taskRecoveryError(label, id, error);
```

</details>

#### 缺口

- 未有脚本预算提示实现或对照
  **影响**：不能断言能降低成本
  **进一步探讨**：用可模拟账单的测试服务对比提交次数与人工决策。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
