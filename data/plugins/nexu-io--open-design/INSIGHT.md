# OpenDesign

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[411162c](https://github.com/nexu-io/open-design/tree/411162cb1b97ada701a498a1f34b4366cc9898f5)

<!-- BEGIN META -->
[![GitHub ★ 103,910](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=103%2C910&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/nexu-io/open-design)
<!-- END META -->

> **功能**：协作AI设计工作区，把设计系统、Agent生成、预览与团队反馈组织在同一项目。

> **亮点**：相对HTML生成后外发截图反馈，把设计资产、Agent、预览及评论放回同项目；具体增量是交接组织，非模型或全球首创证明。[Q01](#research-q01)

> **主要限制**：协议completed、有限占位检测和完整评论回执不等于设计合格或反馈已落地；固定DSH适配版本范围不能外推所有宿主。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · OpenDesign属于什么，如何改变设计交付？](#detail-section-11)
  - [Q02 · DSH连接如何保证会话归属和终态？](#detail-section-12)
  - [Q03 · 发布和评论约束证明到哪里？](#detail-section-13)
  - [Q04 · 怎样采用并检验反馈闭环的业务价值？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向从brief生成可预览原型并收集团队反馈的设计开发团队；独立应用，可连接DSH，非单插件。[Q01](#research-q01)

同Agent生成单页HTML，用编辑器/浏览器预览，截图加聊天收集反馈；需同brief、模型和预算才可比较返工收益。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|设计工作区|brief到原型及反馈|设计质量需人工验收|
|DSH runtime|模型发现、流、取消/恢复|限定兼容profile，未运行|
|评论回执|批状态一致|非修改落实证明|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|本地daemon/前端|本地必需|工作区和预览|先确认启动与端口|
|选定Agent CLI或BYOK|生成必需|执行设计任务|检查连接和预算|
|兼容DSH profile/companion|DSH路径必需|流与会话恢复|核对版本，不外推0.2.x|
|团队云账号及网络|分享时必需|评论/项目协作|先本地非敏感试用|

#### 启动步骤

|步骤|执行者与成功判据|失败处理|
|---|---|---|
|配置设计资产和Agent|用户确认模型与profile|退回本地简单基线|
|生成小原型并预览|用户按brief验收|检查缺终态与制品|
|取消/恢复再反馈修订|用户核对版本和落实|先核对远端状态再重发|

**效果与成本**

#### 成本

|阶段|现金与资源|人工与时间|未知|
|---|---|---|---|
|首次|本地应用/CLI和模型环境|设计系统准备、连接Agent|配置与学习时间|
|持续|模型/API、可能云服务|设计复核、反馈归并与返工|实时价格与合格交付成本|
|失败恢复|重试生成和同步|核对终态、制品版本、重复发布|恢复成功率和工时|

#### 效果

|效果项|抽读支持|未知|
|---|---|---|
|DSH连接|ready/session/result身份校验|实际版本与恢复|
|占位控制|有限模板词检测辅助函数|所有发布入口和设计正确性|
|反馈回执|批完整及错误约束|修订落实及返工减少|

> **思考**：协议completed、有限占位检测和完整评论回执不等于设计合格或反馈已落地；固定DSH适配版本范围不能外推所有宿主。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对HTML生成后外发截图反馈，把设计资产、Agent、预览及评论放回同项目；具体增量是交接组织，非模型或全球首创证明。[Q01](#research-q01)

会话身份/缺终态失败与全批回执验收值得复用；移植须包含制品版本、云端幂等及业务验收，而非只解析成功帧。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

协议completed、有限占位检测和完整评论回执不等于设计合格或反馈已落地；固定DSH适配版本范围不能外推所有宿主。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

熟悉Agent/设计系统者可本地非敏感brief试用，先确认DSH版本和预览/取消，云分享与数据范围另验收。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

抽读支持runtime协议和局部制品/回执检查；真实兼容、设计质量及协作收益未验证；反馈验收假设未验证。

- 已检查：作者 README、包清单、源码路径 apps/daemon/src/runtimes/defs/deepseek-harness.ts、apps/daemon/src/agent-protocol/dsh-profile/session.ts、apps/daemon/src/artifacts/publication-guard.ts、apps/daemon/src/artifacts/create.ts、apps/daemon/src/collab/comment-batch-receipt.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：partial clone固定版本抽读DSH runtime/controller、制品创建及占位辅助门、评论批回执；inventory为文件子集，未审计全部云端/插件/UI与发布调用链，未执行。
- 下一步：隔离本地项目验证DSH连接、模型选择、取消/恢复、占位辅助门实际调用与反馈落实，记录盲评质量、遗漏和总成本。

**分析版本**

- **仓库**：[nexu-io/open-design](https://github.com/nexu-io/open-design)
- **版本号**：0.25.1（[固定提交 411162c](https://github.com/nexu-io/open-design/tree/411162cb1b97ada701a498a1f34b4366cc9898f5)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是评论绑定制品版本和验收项、Agent逐条给修订证据减少遗漏与返工；对照同brief同预算的截图聊天流程，无改善则否定。[Q04](#research-q04)

隔离本地项目验证DSH连接、模型选择、取消/恢复、占位辅助门实际调用与反馈落实，记录盲评质量、遗漏和总成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：根；内容摘要：9db8c148059872cee901c3e46654d7d48e2bbd41f9019f3075862e7f9011b410。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 5 | 645 | 543 | 58 | — |
| .md | source | 1 | 735 | — | — | 7040 |

</details>

**活跃度**

[![Issue 未关闭 544](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=544&color=737b86&logo=github)](https://github.com/nexu-io/open-design/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 165](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=165&color=737b86&logo=github)](https://github.com/nexu-io/open-design/issues?q=is%3Aissue+created%3A2026-09-26T03%3A38%3A09.836Z..2026-10-26T03%3A38%3A09.836Z) [![近30天关闭 140](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=140&color=737b86&logo=github)](https://github.com/nexu-io/open-design/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A38%3A09.836Z..2026-10-26T03%3A38%3A09.836Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：同项目设计生成与反馈是否改善交付，DSH连接和制品约束支持到哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · OpenDesign属于什么，如何改变设计交付？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它是独立协作AI设计工作区/应用，可消费或启动多种Agent，非单个DSH插件。对象是需要从brief到原型并收集团队反馈的产品/设计开发团队，合格交付应满足设计系统、可预览并能继续修订。README描述同项目中的design systems、skills/templates、原型/幻灯片/图片等制品，以及DSH原生runtime接入。相对编辑器生成HTML再外发截图，贡献是把生成、预览、反馈和设计资产集中；Agent能力、模板设计和云端模型仍有各自归属。“first”只是作者营销主张，本轮未作全球首创调查。多种制品和兼容平台列表不证明真实协作采用或返工减少。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-32](https://github.com/nexu-io/open-design/blob/411162cb1b97ada701a498a1f34b4366cc9898f5/README.md#L28-L32)

作者工作区与开源定位

```text
## What is OpenDesign

OpenDesign is **the 1st collaborative AI design agent workspace**. Start with a brief, then use your coding agent or OpenDesign Cloud to create a prototype that follows your design system. Share it with your team for feedback, and let your agent refine it in the same project.

That workflow is open and extensible. OpenDesign is licensed under Apache 2.0 and gives teams skills, design templates, design systems, and plugins they can inspect and adapt to their own process.
```

**依据 2 · 作者声明**：[README.md:64-84](https://github.com/nexu-io/open-design/blob/411162cb1b97ada701a498a1f34b4366cc9898f5/README.md#L64-L84)

作者制品范围

<details>
<summary>查看原文（21行）</summary>

```text
### Studio — create and refine in one project

<table>
<tr>
<td width="50%" valign="top">
<img src="docs/screenshots/product-tour/studio-prototype-2026.webp" alt="Website prototype with live preview and agent conversation in OpenDesign Studio" /><br/>
<sub><b>Prototype</b> — build and refine interactive web experiences with your agent and live preview.</sub>
</td>
<td width="50%" valign="top">
<img src="docs/screenshots/product-tour/studio-slides-2026.png" alt="Swiss Grid presentation in OpenDesign Studio with slide thumbnails and speaker notes" /><br/>
<sub><b>Slides</b> — create decks, review slides and speaker notes, and export when ready.</sub>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<img src="docs/screenshots/product-tour/studio-image-2026.webp" alt="Generated fashion portrait preview in OpenDesign Studio" /><br/>
<sub><b>Image</b> — generate visual assets from the conversation, inspect the result, then download or open it.</sub>
</td>
<td width="50%" valign="top">
<a href="docs/screenshots/product-tour/studio-hyperframes-2026.mp4"><img src="docs/screenshots/product-tour/studio-hyperframes-poster-2026.png" alt="OpenDesign HyperFrames editor showing the One brief, Every deliverable motion graphic" /></a><br/>
<sub><b>HyperFrames</b> — create motion graphics with your agent and export to MP4. <a href="docs/screenshots/product-tour/studio-hyperframes-2026.mp4">Watch the video</a>.</sub>
```

</details>

**依据 3 · 作者声明**：[README.md:91-127](https://github.com/nexu-io/open-design/blob/411162cb1b97ada701a498a1f34b4366cc9898f5/README.md#L91-L127)

连接Agent与runtime声明

<details>
<summary>查看原文（37行）</summary>

```text
## Platform Compatibility

> OpenDesign connects to mainstream coding agents in two ways: **skills, CLI, and MCP** for agents that consume OD, plus **native runtime adapters** for agents that OD launches directly. DeepSeek Harness is a first-class native runtime through the official `dsh` CLI, with structured streaming, model discovery, cancellation, and session resume.

| Coding agent / platform &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Status &nbsp;&nbsp; | Quick setup &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
|---|:---:|---|
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | ✅ Supported | `od mcp install claude` |
| [Claude Desktop](https://claude.ai/download) | ✅ Supported¹ | `od mcp install claude-desktop` |
| [Codex CLI](https://github.com/openai/codex) | ✅ Supported | `od mcp install codex` |
| [DeepSeek Reasonix](https://github.com/esengine/DeepSeek-Reasonix) | ✅ Supported | `od mcp install reasonix` |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | ✅ Native runtime | `od agent setup deepseek-harness` |
| [Raven](https://github.com/EverMind-AI/Raven) | ✅ Supported | `od mcp install raven` |
| [Cursor](https://www.cursor.com/cli) | ✅ Supported | `od mcp install cursor` |
| [VS Code + GitHub Copilot](https://github.com/features/copilot) | ✅ Supported | `od mcp install copilot` |
| [GitHub Copilot CLI](https://github.com/features/copilot/cli) | ✅ Supported | `od mcp install copilot` |
| [OpenCode](https://opencode.ai/) | ✅ Supported | `od mcp install opencode` |
| [OpenClaw](https://github.com/openclaw/openclaw) | ✅ Supported | `od mcp install openclaw` |
| [Antigravity](https://antigravity.google) | ✅ Supported | `od mcp install antigravity` |
| [Cline](https://github.com/cline/cline) | ✅ Supported | `od mcp install cline` |
| [Trae](https://www.trae.ai/) | ✅ Supported | `od mcp install trae` |
| [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) | ✅ Supported | `od mcp install kimi` |
| [Kiro](https://kiro.dev) | ✅ Supported | `od mcp install kiro` |
| [Pi Agent](https://github.com/badlogic/pi-mono) | ✅ Supported | `od mcp install pi` |
| [Mistral Vibe CLI](https://github.com/mistralai/mistral-vibe) | ✅ Supported | `od mcp install vibe` |
| [Hermes Agent](https://github.com/nousresearch/hermes-agent) | ✅ Supported | `od mcp install hermes` |

For DeepSeek Harness, install the official `dsh` CLI first, then select it in OpenDesign or run `od agent setup deepseek-harness` to install/repair OD's connection component. For MCP integrations: `od mcp install <agent> --print` for a dry-run preview · `--uninstall` to remove · full list with `od mcp install --help`.

¹ Automatic MCP configuration for Claude Desktop is currently supported on macOS and Windows only.

<p align="center">
  <img src="https://repo-assets.open-design.ai/resources/images/coding-agents.png" alt="The 26 coding-agent CLIs OpenDesign supports — DeepSeek Harness · Claude Code · Codex · OpenCode · Hermes · Antigravity · Vela · Grok Build · Kimi · Cursor Agent · Qwen · Qoder · GitHub Copilot · Pi · Kiro · Kilo · Mistral Vibe · DeepSeek · Reasonix · Aider · Amp · CodeBuddy · Mimo · AtomCode · Devin · Trae" width="100%" />
</p>

**No CLI installed?** The BYOK proxy at `POST /api/proxy/{anthropic,openai,azure,google,ollama,senseaudio}/stream` gives you the same loop (no process spawn) — paste `baseUrl` + `apiKey` + `model`, with presets for OpenAI, Atlas Cloud, Anthropic, Azure OpenAI, Google Gemini, Ollama, LM Studio, vLLM, or any OpenAI-compatible endpoint. Atlas Cloud uses `https://api.atlascloud.ai/v1` with your own key and OpenAI-compatible model ids such as `qwen/qwen3.5-flash`. Per-target SSRF protection blocks internal IPs / link-local / CGNAT at the daemon edge.

Runtime definitions live in [`apps/daemon/src/runtimes/defs/`](apps/daemon/src/runtimes/defs/), with registration and shared stream handling under [`apps/daemon/src/runtimes/`](apps/daemon/src/runtimes/). See [`docs/agent-adapters.md`](docs/agent-adapters.md) for the adapter contract.
```

</details>

#### 缺口

- 没有真实团队反馈闭环的对照交付结果
  **影响**：不能证明原型质量、兼容或效率收益
  **进一步探讨**：在非敏感设计brief上与文件加聊天反馈基线比较，记录合格交付、返工、总成本和恢复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH连接如何保证会话归属和终态？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

runtime def以dsh --profile open-design --stdio启动，先检查profile存在再probe，支持模型清单及resume会话。session controller要求stdin/stdout，先收到ready才发送execute，校验请求id、session建立和resumeSessionId一致，收到result检查session不变，stdout结束无终态则失败；abort只发送协议cancel，不在本模块证明子进程已经停止。completedSuccessfully只在completed且无fatal时成立，是协议执行成功，不是制品验收。值得借鉴的是会话身份和缺终态显式报错，避免断流冒充完成。但固定版本def的支持范围列0.1.x/rc，不能将README“native runtime”外推任意0.2.x；真实版本安装及companion peer尚需核对。

#### 证据与依据

**依据 1 · 源码核查**：[apps/daemon/src/runtimes/defs/deepseek-harness.ts:50-104](https://github.com/nexu-io/open-design/blob/411162cb1b97ada701a498a1f34b4366cc9898f5/apps/daemon/src/runtimes/defs/deepseek-harness.ts#L50-L104)

CLI/profile、版本范围及会话能力

<details>
<summary>查看原文（55行）</summary>

```text
export const deepseekHarnessAgentDef = {
  id: 'deepseek-harness',
  name: 'DeepSeek Harness',
  bin: 'dsh',
  versionArgs: ['--version'],
  versionPolicy: {
    // `dsh` is published as a stream of release candidates whose sibling
    // packages peer-require each other, so the version our own installer
    // hands the user moves with upstream. Naming one of them made every user
    // who followed our instructions land on an "untested version" warning the
    // week after we bumped the installer. Accept the release line; a version
    // off it still warns.
    supportedVersions: ['0.1.0-rc.8', '0.1.1-rc.2', '0.1.2-rc.1'],
    // The line, not one point on it. Scoping this to `0.1.0-rc.N` was still a
    // pin: upstream shipped `0.1.1-rc.1` two days later and every user on it
    // was told their CLI was untested. `0.1.2-rc.1` then became npm's `latest`,
    // and the same warning came back for everyone who installed without naming
    // a version — the widening has to happen per patch line, every time.
    //
    // Prerelease acceptance may never exceed what `packages/dsh-runtime`'s peer
    // ranges can install, or this suppresses the warning for a version whose
    // companion cannot resolve — a worse failure than the warning, and silent.
    // semver admits a prerelease only against a comparator sharing its exact
    // major.minor.patch AND carrying a prerelease, so the accepted release
    // candidates are precisely the peers' tuples and floors: `0.1.0-rc.6+`, any
    // `0.1.1-rc.N`, any `0.1.2-rc.N`. One alternative per peer comparator, on
    // purpose — a new upstream patch line needs an edit in both files or in
    // neither. Stable releases on the line need no such comparator.
    // `e2e/tests/dsh-installer-version-policy.test.ts` holds the two together.
    supportedVersionPattern:
      /^0\.1\.\d+$|^0\.1\.0-rc\.(?:[6-9]|[1-9]\d+)$|^0\.1\.1-rc\.\d+$|^0\.1\.2-rc\.\d+$/u,
    requireVersion: true,
    parse: parseDeepSeekHarnessVersion,
  },
  compatibilityProbe: {
    args: ['--profile', 'open-design', '--probe'],
    timeoutMs: 10_000,
    // rc.6 auto-initializes a missing profile before booting it, so avoid
    // invoking --probe until the user-installed profile already exists.
    preflight: hasOpenDesignProfile,
    parse: (stdout) => parseDshProfileProbeOutput(stdout).plugin_version,
  },
  listModels: {
    args: ['--profile', 'open-design', '--models'],
    parse: parseModels,
    timeoutMs: 10_000,
  },
  fallbackModels: [DEFAULT_MODEL_OPTION],
  buildArgs: () => ['--profile', 'open-design', '--stdio'],
  promptViaStdin: true,
  streamFormat: 'dsh-profile-jsonl',
  resumesSessionViaProfileStdio: true,
  capturesSessionIdFromStream: true,
  supportsCustomModel: false,
} satisfies RuntimeAgentDef;
```

</details>

**依据 2 · 源码核查**：[apps/daemon/src/agent-protocol/dsh-profile/session.ts:112-147](https://github.com/nexu-io/open-design/blob/411162cb1b97ada701a498a1f34b4366cc9898f5/apps/daemon/src/agent-protocol/dsh-profile/session.ts#L112-L147)

execute和resume身份

<details>
<summary>查看原文（36行）</summary>

```text
      type: 'execute',
      request_id: requestId,
      cwd,
      prompt,
      ...(resumeSessionId ? { resume_session_id: resumeSessionId } : {}),
      ...(selectedModel ? { model: selectedModel } : {}),
      ...(reasoningEffort ? { reasoning_effort: reasoningEffort } : {}),
      mcp_servers: [],
    };
    executeSent = true;
    sendCommand(command);
  };

  const requireSession = (): boolean => {
    if (sessionId) return true;
    fail('DeepSeek Harness profile emitted run content before establishing a session.');
    return false;
  };

  const handleRunFrame = (frame: Exclude<DshProfileRuntimeFrame, { type: 'ready' | 'probe' }>) => {
    if (frame.request_id && frame.request_id !== requestId) {
      ignoredRequestFrames += 1;
      return;
    }
    switch (frame.type) {
      case 'session':
        if (sessionId) {
          fail('DeepSeek Harness profile emitted more than one session frame.');
          return;
        }
        if (resumeSessionId && (!frame.resumed || frame.session_id !== resumeSessionId)) {
          fail('DeepSeek Harness profile resumed a different session.', 'DSH_PROFILE_RESUME_MISMATCH');
          return;
        }
        if (!resumeSessionId && frame.resumed) {
          fail('DeepSeek Harness profile reported an unexpected resumed session.');
```

</details>

**依据 3 · 源码核查**：[apps/daemon/src/agent-protocol/dsh-profile/session.ts:202-228](https://github.com/nexu-io/open-design/blob/411162cb1b97ada701a498a1f34b4366cc9898f5/apps/daemon/src/agent-protocol/dsh-profile/session.ts#L202-L228)

终态及会话验证

<details>
<summary>查看原文（27行）</summary>

```text
      case 'result':
        if (resumeSessionId && frame.resume_rejected) {
          if (frame.session_id !== resumeSessionId) {
            fail('DeepSeek Harness profile rejected a different session.', 'DSH_PROFILE_RESUME_MISMATCH');
            return;
          }
          fail('DeepSeek Harness could not resume the saved session.', frame.error?.code ?? 'DSH_PROFILE_RESUME_REJECTED');
          return;
        }
        if (!sessionId && frame.status === 'failed') {
          fail(frame.error?.message ?? 'DeepSeek Harness profile could not start a session.', frame.error?.code);
          return;
        }
        if (!requireSession()) return;
        if (frame.session_id !== sessionId) {
          fail('DeepSeek Harness profile terminal result changed the session id.', 'DSH_PROFILE_SESSION_MISMATCH');
          return;
        }
        if (frame.status === 'failed') {
          fail(frame.error?.message ?? 'DeepSeek Harness profile run failed.', frame.error?.code);
          return;
        }
        if (frame.status === 'cancelled' && !aborted) {
          fail('DeepSeek Harness profile cancelled a run that OpenDesign did not cancel.');
          return;
        }
        finish(frame.status);
```

</details>

**依据 4 · 源码核查**：[apps/daemon/src/agent-protocol/dsh-profile/session.ts:263-280](https://github.com/nexu-io/open-design/blob/411162cb1b97ada701a498a1f34b4366cc9898f5/apps/daemon/src/agent-protocol/dsh-profile/session.ts#L263-L280)

缺终态失败、取消与成功定义

<details>
<summary>查看原文（18行）</summary>

```text

  stdout.on('data', (chunk: Buffer | string) => parser.feed(chunk));
  stdout.on('end', () => {
    parser.flush();
    if (!finished) fail('DeepSeek Harness profile exited without a terminal result.', 'DSH_PROFILE_MISSING_RESULT');
  });

  return {
    abort() {
      if (finished || aborted) return;
      aborted = true;
      sendCommand({ v: 1, type: 'cancel', request_id: requestId });
    },
    hasFatalError() {
      return fatal;
    },
    completedSuccessfully() {
      return terminalStatus === 'completed' && !fatal;
```

</details>

#### 缺口

- 同版本DSH及取消后进程/制品状态未验证
  **影响**：不能证明原型质量、兼容或效率收益
  **进一步探讨**：在非敏感设计brief上与文件加聊天反馈基线比较，记录合格交付、返工、总成本和恢复

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 发布和评论约束证明到哪里？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

publication-guard针对html/deck检查少量pitch-deck模板占位字符串；它明确不是所有文档、所有语义错误的通用质量门。当前抽读仅证明辅助函数行为，未审计全部调用点，不能宣称每条发布入口都执行该门。comment-batch-receipt在允许逐条确认前核对key、ok/error/status一致性、重复和遗漏，request要求idempotencyKey；这能避免不完整批回执被当全成功，但单凭parser不能证明云端幂等落地或反馈已作用于最终制品。依赖包括本地daemon/前端、所选Agent CLI或BYOK、模型权限、设计资产，以及团队分享时的云端认证和网络。隐私/发布范围应按本地和云端实际路径分别验收，不能由开源或本地Agent推断无上传。

#### 证据与依据

**依据 1 · 源码核查**：[apps/daemon/src/artifacts/publication-guard.ts:1-41](https://github.com/nexu-io/open-design/blob/411162cb1b97ada701a498a1f34b4366cc9898f5/apps/daemon/src/artifacts/publication-guard.ts#L1-L41)

占位检测的狭窄范围

<details>
<summary>查看原文（41行）</summary>

```text
// Blocks an artifact publication when the body still contains template
// placeholders that should have been replaced with real content. Scoped to
// the file-write boundary for HTML-rendered artifact kinds — the moment
// the file would land in the project as a published artifact — not to the
// agent's chat prose, where these strings can legitimately appear when
// the model is asking the user to fill them in.
//
// The placeholder set is intentionally short and pitch-deck-specific:
// these are the exact markers shipped by the official html-ppt-pitch-deck
// example template that signal "an unfilled fundraising slot" rather than
// "regular product copy". Extending the list to more general words risks
// false positives on real artifacts, so the contract is: any future
// example that wants similar enforcement should either declare structured
// `od.inputs` (preferred) or contribute its specific placeholder markers
// here together with a fixture that proves they cannot appear in
// finished output.
//
// Pairs with `od.inputs` on `plugins/_official/examples/html-ppt-pitch-deck/
// open-design.json`. The inputs gate is the primary contract — this guard
// is the defense-in-depth invariant that catches agents that bypassed the
// structured contract (e.g. routed through `od-default`) but still tried
// to publish a placeholder-laden HTML/deck artifact.

import { Buffer } from 'node:buffer';

export const ARTIFACT_PUBLICATION_BLOCKED_CODE = 'ARTIFACT_PUBLICATION_BLOCKED' as const;

// HTML and deck are the artifact kinds whose bodies are user-facing
// rendered documents. Other kinds (markdown drafts, code snippets, raw
// JSON) are not subject to this guard — placeholder strings can be
// legitimate content in those.
export const PUBLICATION_GUARDED_ARTIFACT_KINDS: ReadonlySet<string> = new Set(['html', 'deck']);

// Markers shipped by the html-ppt-pitch-deck example template that
// indicate an unresolved fundraising slot. Each is a substring; matching
// is case-sensitive because the template emits these literally.
export const UNRESOLVED_ARTIFACT_PLACEHOLDERS = [
  'Name to confirm',
  '$X.XM',
  'Replace this panel with',
  'Replace role placeholders',
```

</details>

**依据 2 · 源码核查**：[apps/daemon/src/artifacts/publication-guard.ts:59-82](https://github.com/nexu-io/open-design/blob/411162cb1b97ada701a498a1f34b4366cc9898f5/apps/daemon/src/artifacts/publication-guard.ts#L59-L82)

字符串检测与拒绝辅助函数

<details>
<summary>查看原文（24行）</summary>

```text

export function findUnresolvedArtifactPlaceholders(value: unknown): string[] {
  const text = stringifyArtifactContent(value);
  if (!text) return [];
  return UNRESOLVED_ARTIFACT_PLACEHOLDERS.filter((placeholder) =>
    text.includes(placeholder),
  );
}

export function shouldBlockArtifactPublication(value: unknown): boolean {
  return findUnresolvedArtifactPlaceholders(value).length > 0;
}

export function buildArtifactPublicationBlockedMessage(placeholders: readonly string[]): string {
  const list = placeholders.length > 0 ? placeholders.join(', ') : 'unknown placeholders';
  return `Artifact still contains unresolved pitch-deck placeholders: ${list}. Provide the required pitch facts before publishing.`;
}

export function assertArtifactPublicationAllowed(value: unknown): void {
  const placeholders = findUnresolvedArtifactPlaceholders(value);
  if (placeholders.length > 0) {
    throw new ArtifactPublicationBlockedError(placeholders);
  }
}
```

</details>

**依据 3 · 源码核查**：[apps/daemon/src/collab/comment-batch-receipt.ts:3-35](https://github.com/nexu-io/open-design/blob/411162cb1b97ada701a498a1f34b4366cc9898f5/apps/daemon/src/collab/comment-batch-receipt.ts#L3-L35)

批回执及幂等身份约束

<details>
<summary>查看原文（33行）</summary>

```text
/** Validate the whole receipt before any caller may acknowledge individual rows. */
export function parseCommentBatchReceipt(stdout: string, request: CommentBatchPushRequest): CommentBatchPushResponse {
  let value: unknown;
  try { value = JSON.parse(stdout); } catch { throw new Error('Invalid comment batch receipt'); }
  if (!value || typeof value !== 'object' || !('results' in value) || !Array.isArray(value.results)) throw new Error('Invalid comment batch receipt');
  const remaining = new Set(request.comments.map(item => item.key));
  const results: CommentBatchPushResponse['results'][number][] = [];
  for (const item of value.results) {
    if (!item || typeof item !== 'object' || typeof item.key !== 'string' || !remaining.delete(item.key)
      || typeof item.ok !== 'boolean'
      || (item.error !== undefined && typeof item.error !== 'string')
      || (item.errorCode !== undefined && typeof item.errorCode !== 'string')
      || (item.status !== undefined && (!Number.isInteger(item.status) || item.status < 400 || item.status > 599))
      || (item.ok && (item.error !== undefined || item.errorCode !== undefined || item.status !== undefined))) {
      throw new Error('Invalid comment batch receipt');
    }
    results.push({ key: item.key, ok: item.ok,
      ...(item.error !== undefined ? { error: item.error } : {}),
      ...(item.errorCode !== undefined ? { errorCode: item.errorCode } : {}),
      ...(item.status !== undefined ? { status: item.status } : {}) });
  }
  if (remaining.size) throw new Error('Incomplete comment batch receipt');
  return { results };
}

export function validateCommentBatchRequest(request: CommentBatchPushRequest): void {
  if (!Array.isArray(request.comments) || request.comments.length < 1 || request.comments.length > COMMENT_BATCH_MAX_ITEMS) throw new Error('Invalid comment batch size');
  const keys = new Set<string>();
  for (const item of request.comments) {
    if (!item || typeof item.key !== 'string' || !item.key.trim() || keys.has(item.key)
      || typeof item.idempotencyKey !== 'string' || !item.idempotencyKey.trim()) throw new Error('Invalid comment batch identity');
    keys.add(item.key);
  }
```

</details>

**依据 4 · 作者声明**：[README.md:117-127](https://github.com/nexu-io/open-design/blob/411162cb1b97ada701a498a1f34b4366cc9898f5/README.md#L117-L127)

安装连接与BYOK路径

<details>
<summary>查看原文（11行）</summary>

```text
For DeepSeek Harness, install the official `dsh` CLI first, then select it in OpenDesign or run `od agent setup deepseek-harness` to install/repair OD's connection component. For MCP integrations: `od mcp install <agent> --print` for a dry-run preview · `--uninstall` to remove · full list with `od mcp install --help`.

¹ Automatic MCP configuration for Claude Desktop is currently supported on macOS and Windows only.

<p align="center">
  <img src="https://repo-assets.open-design.ai/resources/images/coding-agents.png" alt="The 26 coding-agent CLIs OpenDesign supports — DeepSeek Harness · Claude Code · Codex · OpenCode · Hermes · Antigravity · Vela · Grok Build · Kimi · Cursor Agent · Qwen · Qoder · GitHub Copilot · Pi · Kiro · Kilo · Mistral Vibe · DeepSeek · Reasonix · Aider · Amp · CodeBuddy · Mimo · AtomCode · Devin · Trae" width="100%" />
</p>

**No CLI installed?** The BYOK proxy at `POST /api/proxy/{anthropic,openai,azure,google,ollama,senseaudio}/stream` gives you the same loop (no process spawn) — paste `baseUrl` + `apiKey` + `model`, with presets for OpenAI, Atlas Cloud, Anthropic, Azure OpenAI, Google Gemini, Ollama, LM Studio, vLLM, or any OpenAI-compatible endpoint. Atlas Cloud uses `https://api.atlascloud.ai/v1` with your own key and OpenAI-compatible model ids such as `qwen/qwen3.5-flash`. Per-target SSRF protection blocks internal IPs / link-local / CGNAT at the daemon edge.

Runtime definitions live in [`apps/daemon/src/runtimes/defs/`](apps/daemon/src/runtimes/defs/), with registration and shared stream handling under [`apps/daemon/src/runtimes/`](apps/daemon/src/runtimes/). See [`docs/agent-adapters.md`](docs/agent-adapters.md) for the adapter contract.
```

</details>

#### 缺口

- 完整发布门调用、云端幂等与数据边界未审计
  **影响**：不能证明原型质量、兼容或效率收益
  **进一步探讨**：在非敏感设计brief上与文件加聊天反馈基线比较，记录合格交付、返工、总成本和恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样采用并检验反馈闭环的业务价值？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议熟悉Agent和设计系统的用户，以本地非敏感brief做单项目试用，先确认DSH runtime版本/companion、预览和取消，再考虑团队云分享。首次是安装daemon/CLI、设计系统准备及模型连接；持续是模型生成、云服务或BYOK调用与人工设计复核，失败恢复还包括断流、缺终态和重复发布核对。本项不引用README时效促销价格作为当前收费事实，金额和真实工时未知。未验证假设是把团队评论映射到制品版本及可验证验收项，并要求Agent输出逐条“已改/未改及证据”，可减少反馈丢失和表面完成。对照同brief、同Agent预算的截图+聊天流程，记录评论遗漏、设计系统偏离、盲评合格率、返工和总成本；若只增加流程步骤而未改善交付，则否定。占位词过滤和协议成功都不能替代这项验证。

#### 证据与依据

**依据 1 · 源码核查**：[apps/daemon/src/collab/comment-batch-receipt.ts:3-35](https://github.com/nexu-io/open-design/blob/411162cb1b97ada701a498a1f34b4366cc9898f5/apps/daemon/src/collab/comment-batch-receipt.ts#L3-L35)

反馈回执提供闭环推导依据

<details>
<summary>查看原文（33行）</summary>

```text
/** Validate the whole receipt before any caller may acknowledge individual rows. */
export function parseCommentBatchReceipt(stdout: string, request: CommentBatchPushRequest): CommentBatchPushResponse {
  let value: unknown;
  try { value = JSON.parse(stdout); } catch { throw new Error('Invalid comment batch receipt'); }
  if (!value || typeof value !== 'object' || !('results' in value) || !Array.isArray(value.results)) throw new Error('Invalid comment batch receipt');
  const remaining = new Set(request.comments.map(item => item.key));
  const results: CommentBatchPushResponse['results'][number][] = [];
  for (const item of value.results) {
    if (!item || typeof item !== 'object' || typeof item.key !== 'string' || !remaining.delete(item.key)
      || typeof item.ok !== 'boolean'
      || (item.error !== undefined && typeof item.error !== 'string')
      || (item.errorCode !== undefined && typeof item.errorCode !== 'string')
      || (item.status !== undefined && (!Number.isInteger(item.status) || item.status < 400 || item.status > 599))
      || (item.ok && (item.error !== undefined || item.errorCode !== undefined || item.status !== undefined))) {
      throw new Error('Invalid comment batch receipt');
    }
    results.push({ key: item.key, ok: item.ok,
      ...(item.error !== undefined ? { error: item.error } : {}),
      ...(item.errorCode !== undefined ? { errorCode: item.errorCode } : {}),
      ...(item.status !== undefined ? { status: item.status } : {}) });
  }
  if (remaining.size) throw new Error('Incomplete comment batch receipt');
  return { results };
}

export function validateCommentBatchRequest(request: CommentBatchPushRequest): void {
  if (!Array.isArray(request.comments) || request.comments.length < 1 || request.comments.length > COMMENT_BATCH_MAX_ITEMS) throw new Error('Invalid comment batch size');
  const keys = new Set<string>();
  for (const item of request.comments) {
    if (!item || typeof item.key !== 'string' || !item.key.trim() || keys.has(item.key)
      || typeof item.idempotencyKey !== 'string' || !item.idempotencyKey.trim()) throw new Error('Invalid comment batch identity');
    keys.add(item.key);
  }
```

</details>

**依据 2 · 源码核查**：[apps/daemon/src/artifacts/publication-guard.ts:1-20](https://github.com/nexu-io/open-design/blob/411162cb1b97ada701a498a1f34b4366cc9898f5/apps/daemon/src/artifacts/publication-guard.ts#L1-L20)

结构化输入与占位门范围

<details>
<summary>查看原文（20行）</summary>

```text
// Blocks an artifact publication when the body still contains template
// placeholders that should have been replaced with real content. Scoped to
// the file-write boundary for HTML-rendered artifact kinds — the moment
// the file would land in the project as a published artifact — not to the
// agent's chat prose, where these strings can legitimately appear when
// the model is asking the user to fill them in.
//
// The placeholder set is intentionally short and pitch-deck-specific:
// these are the exact markers shipped by the official html-ppt-pitch-deck
// example template that signal "an unfilled fundraising slot" rather than
// "regular product copy". Extending the list to more general words risks
// false positives on real artifacts, so the contract is: any future
// example that wants similar enforcement should either declare structured
// `od.inputs` (preferred) or contribute its specific placeholder markers
// here together with a fixture that proves they cannot appear in
// finished output.
//
// Pairs with `od.inputs` on `plugins/_official/examples/html-ppt-pitch-deck/
// open-design.json`. The inputs gate is the primary contract — this guard
// is the defense-in-depth invariant that catches agents that bypassed the
```

</details>

**依据 3 · 源码核查**：[apps/daemon/src/agent-protocol/dsh-profile/session.ts:275-286](https://github.com/nexu-io/open-design/blob/411162cb1b97ada701a498a1f34b4366cc9898f5/apps/daemon/src/agent-protocol/dsh-profile/session.ts#L275-L286)

协议成功与终态可区分业务验收

<details>
<summary>查看原文（12行）</summary>

```text
    },
    hasFatalError() {
      return fatal;
    },
    completedSuccessfully() {
      return terminalStatus === 'completed' && !fatal;
    },
    getDurableSessionId() {
      return sessionId;
    },
    getTerminalStatus() {
      return terminalStatus;
```

</details>

#### 缺口

- 反馈到制品验收的对照实验及成本没有结果
  **影响**：不能证明原型质量、兼容或效率收益
  **进一步探讨**：在非敏感设计brief上与文件加聊天反馈基线比较，记录合格交付、返工、总成本和恢复

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
