# DeepBlend Studio Bundle

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[5ddf999](https://github.com/pearjelly/deep-blend/tree/5ddf9992406e6a6df86c98ef95f51e028391c091/packages/deepblend/bundle)

<!-- BEGIN META -->
[![GitHub ★ 101](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=101&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/pearjelly/deep-blend) [![npm 30d 6,813](https://img.shields.io/static/v1?label=npm+30d&message=6%2C813&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepblend/dsh-blender-bundle) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@deepblend/dsh-blender-bundle)
<!-- END META -->

> **功能**：组合 DSH 中的 Blender runtime、业务 host 与工作台。

> **亮点**：[Q01](#research-q01) 想在 DSH 进行场景编辑与渲染的用户通过 bundle 一次挂载 runtime、host 和 UI。lib 入口转出 UI，patch 明确将模型工具留给 agent preset，避免进程级组合给所有会话注册。相比手配多个插件，bundle 提供统一分发与配置。

> **主要限制**：[Q02](#research-q02) bundle 组合的是直接依赖，审批与任务恢复需核查 host 及实际工具调用。host 渲染门说明批准属于 harness 层，由调用方重发带 grant；patch 的配置覆盖按作者说明为整体替换，因此运营配置遗漏可能改变默认。不能只因配置里有阈值就认定所有入口强制审批。

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
  - [Q01 · Bundle 怎样组成 Blender 工作台？](#detail-section-11)
  - [Q02 · 审批和长渲染的边界在哪里？](#detail-section-12)
  - [Q03 · 如何试用与退出？](#detail-section-13)
  - [Q04 · 怎样减少渲染取消后的错误完成提示？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要 Agent 辅助三维创作的 DSH 用户。

逐个配置 Blender 及工作台插件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工作台 | 场景与交付 | 需 Blender |
| 组合 | 一次分发 | 配置整体覆盖 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 固定 DSH Node Blender | 必需 | 执行场景 | 暂停试用 |
| FFmpeg | 视频需要 | 编码 | 只输出图片 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 独立小场景 | 记录版本 |
| 验证 | 预览与短渲染 | 检查审批 |
| 退出 | 停任务并禁用 | 保留项目 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 安装资源未知 | 准备平台制品 | 未测 |
| 持续 | CPU磁盘未知 | 核对任务 | 按场景 |
| 退出 | 迁移时间未知 | 保留版本 | 查进程 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一组合 | patch 三平面 | 实际兼容 |
| 交付 | 作者说明图片视频 | 需渲染验证 |

> **思考**：[Q02](#research-q02) bundle 组合的是直接依赖，审批与任务恢复需核查 host 及实际工具调用。host 渲染门说明批准属于 harness 层，由调用方重发带 grant；patch 的配置覆盖按作者说明为整体替换，因此运营配置遗漏可能改变默认。不能只因配置里有阈值就认定所有入口强制审批。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 想在 DSH 进行场景编辑与渲染的用户通过 bundle 一次挂载 runtime、host 和 UI。lib 入口转出 UI，patch 明确将模型工具留给 agent preset，避免进程级组合给所有会话注册。相比手配多个插件，bundle 提供统一分发与配置。

[Q02](#research-q02) bundle 组合的是直接依赖，审批与任务恢复需核查 host 及实际工具调用。host 渲染门说明批准属于 harness 层，由调用方重发带 grant；patch 的配置覆盖按作者说明为整体替换，因此运营配置遗漏可能改变默认。不能只因配置里有阈值就认定所有入口强制审批。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) bundle 组合的是直接依赖，审批与任务恢复需核查 host 及实际工具调用。host 渲染门说明批准属于 harness 层，由调用方重发带 grant；patch 的配置覆盖按作者说明为整体替换，因此运营配置遗漏可能改变默认。不能只因配置里有阈值就认定所有入口强制审批。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 固定 DSH、Node、Blender 和视频工具版本，使用独立工作目录与最小场景。先验证预览，再核对明确授权的短渲染，计 CPU、磁盘与等待。退出时停任务、禁用 bundle，保留项目版本及交付文件。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码及作者说明，未执行目标。

- 已检查：作者 README、包清单、源码路径 packages/deepblend/bundle/README.md、packages/deepblend/bundle/cordis.patch.yml、packages/deepblend/bundle/lib/index.js、packages/deepblend/host/lib/index.js 及固定范围 inventory；组件：packages/deepblend/bundle。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定身份及其直接依赖的代表实现。
- 下一步：验证 preset、审批和取消。

**分析版本**

- **仓库**：[pearjelly/deep-blend](https://github.com/pearjelly/deep-blend)
- **版本号**：0.23.0（[固定提交 5ddf999](https://github.com/pearjelly/deep-blend/tree/5ddf9992406e6a6df86c98ef95f51e028391c091)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 对照当前 host 审批和任务流程，试验用任务 ID、执行代和落盘帧读回确认取消。延迟结果及取消后恢复对照重复帧和误完成，若没有改善则撤回。

验证 preset、审批和取消。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | example | 1 | 54 | — | — | 1489 |
| .mjs | example | 1 | 33 | 30 | 3 | — |
| .js | source | 9 | 8695 | 7979 | 495 | — |
| .md | source | 2 | 302 | — | — | 4249 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/pearjelly/deep-blend/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话地图如何组织和传递上下文？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Bundle 怎样组成 Blender 工作台？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

想在 DSH 进行场景编辑与渲染的用户通过 bundle 一次挂载 runtime、host 和 UI。lib 入口转出 UI，patch 明确将模型工具留给 agent preset，避免进程级组合给所有会话注册。相比手配多个插件，bundle 提供统一分发与配置。

#### 证据与依据

**依据 1 · 源码核查**：[packages/deepblend/bundle/lib/index.js:1-22](https://github.com/pearjelly/deep-blend/blob/5ddf9992406e6a6df86c98ef95f51e028391c091/packages/deepblend/bundle/lib/index.js#L1-L22)

固定分发入口

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * Installable composition and UI entry for DeepBlend.
 * Profile discovery reads dsh.bundle.patch without mounting this module.
 * The patch mounts this package root once as the UI plane, giving the client
 * scanner an exact package identity. Other planes use exported wrappers whose
 * imports resolve from this package's own dependencies in every install route.
 * The optional doctor executable runs only when explicitly invoked.
 */

/** The bundle's patch file, relative to the package root. */
export const PATCH_FILE = 'cordis.patch.yml'

/** Row ids this bundle inserts, in composition order. */
export const ROW_IDS = Object.freeze([
  'deepblend-blender-runtime',
  'deepblend-blender-host',
  'deepblend-blender-ui',
])

// This entry is mounted only by the UI row; bundle discovery still reads dsh.bundle.patch.
export * from '@deepblend/dsh-blender-ui'
export { default } from '@deepblend/dsh-blender-ui'
```

</details>

**依据 2 · 源码核查**：[packages/deepblend/bundle/cordis.patch.yml:1-13](https://github.com/pearjelly/deep-blend/blob/5ddf9992406e6a6df86c98ef95f51e028391c091/packages/deepblend/bundle/cordis.patch.yml#L1-L13)

进程与会话组合

<details>
<summary>查看原文（13行）</summary>

```text
# DeepBlend Studio Host Bundle — the HOST COMPOSITION layer (SPEC §4.1, §18).
#
# This patch adds one `insert` over the profile tree. It carries only
# process-level, cross-session capability:
#
#   deepblend-blender-runtime  → publishes `blenderRuntime`  (Blender execution seam)
#   deepblend-blender-host     → publishes `blenderStudio`   (business facade)
#   deepblend-blender-ui       → publishes `blenderUi`       (browser-facing host half)
#
# The model-visible tool (`blender_capabilities`) deliberately does NOT live
# here. It belongs to the AGENT PRESET, because a preset decides what one
# session's model may see (SPEC §4.2, §4.3). Registering it here would expose
# the tool to every session in the process.
```

</details>

**依据 3 · 源码核查**：[packages/deepblend/bundle/README.md:55-73](https://github.com/pearjelly/deep-blend/blob/5ddf9992406e6a6df86c98ef95f51e028391c091/packages/deepblend/bundle/README.md#L55-L73)

作者列出创作流程

<details>
<summary>查看原文（19行）</summary>

```text
## From a starting point to a saved result

- **Continue a creation draft.** Reload or reopen the workbench, explicitly restore inputs saved in this browser, then create or retry the captured request. Restoring never submits automatically. [Draft guide](https://github.com/pearjelly/deep-blend/blob/main/deepblend/docs/creation-drafts.md).
- **Compare starting points.** Switch recipes and keep each set of edits; resetting affects only the selected recipe. Comparison settings also stay with your browser draft. [Comparison guide](https://github.com/pearjelly/deep-blend/blob/main/deepblend/docs/recipe-comparison.md).
- **Review saved versions.** Open a saved/current comparison from history, keep unsaved edits, and read differences for the displayed pair. Viewing does not restore or render. [Version guide](https://github.com/pearjelly/deep-blend/blob/main/deepblend/docs/version-comparison.md).
- **Start with something concrete.** Choose a lamp, glass-and-ceramic scene, speaker or handled
  cup from the recipe gallery; adjust its exposed parameters and create a project with a real preview.
- **Bring your own assets.** Preview and insert GLB, glTF or OBJ models. Select multiple files or
  a directory to keep external textures and buffers together; add image textures and HDR/EXR lighting.
- **Shape the scene.** Edit dimensions, profiles, bevels, arrays and local materials. Adjust
  existing cameras and lights, or add an area fill light, directly in the workbench. Reuse camera settings and the light rig from a saved work and version, check the draft, then explicitly save.
- **Judge the actual change.** Compare saved revisions, inspect a fixed camera and frame in
  beauty or clay mode, and save reference images with your design goal.
- **Finish or pick up later.** Render PNG frames and an MP4, inspect job progress, cancel work
  or resume missing frames. Completed frames can continue straight to encoding; delivery records
  retain frame sources and actual render settings.

The agent preset exposes **20 tools** for scene editing, complete fitted views, previews, visual review and delivery.
Immutable revisions keep earlier scene states available, and expensive operations use an approval gate.
```

</details>

#### 缺口

- 未启动 Blender
  **影响**：场景和工具组合结果未知
  **进一步探讨**：合成小场景核对 preset 与预览

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 审批和长渲染的边界在哪里？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

bundle 组合的是直接依赖，审批与任务恢复需核查 host 及实际工具调用。host 渲染门说明批准属于 harness 层，由调用方重发带 grant；patch 的配置覆盖按作者说明为整体替换，因此运营配置遗漏可能改变默认。不能只因配置里有阈值就认定所有入口强制审批。

#### 证据与依据

**依据 1 · 源码核查**：[packages/deepblend/bundle/cordis.patch.yml:40-74](https://github.com/pearjelly/deep-blend/blob/5ddf9992406e6a6df86c98ef95f51e028391c091/packages/deepblend/bundle/cordis.patch.yml#L40-L74)

配置覆盖与审批阈值

<details>
<summary>查看原文（35行）</summary>

```text
# OVERRIDING THESE VALUES: a row's `config` is replaced wholesale, not merged
# (measured — architecture-decisions D74), so the operator layer
# ($DSH_HOME/profiles/<name>/cordis.patch.yml) must restate every key it wants to
# keep. To pin storage to a directory of your own:
#
#     - id: deepblend-blender-runtime
#       config:
#         timeoutMs: 180000
#         maxOutputBytes: 1048576
#         maxSpillBytes: 67108864
#         executableAllowlist: []
#         capabilitiesCacheMs: 60000
#         keepWorkingDirectory: false
#         workspaceRoot: /path/to/workspace
#
#     - id: deepblend-blender-host
#       config:
#         maxPreviewSamples: 512
#         maxVisualIterations: 5
#         minVisualConfidenceForAutoFix: 0.8
#         stopOnRepeatedIssueCount: 2
#         visualReviewProvider: deepseek-official
#         visualReviewModel: deepseek-flash
#         visualReviewMaxTokens: 24000
#         visualReviewViews: [active-camera, three-quarter, top, detail]
#         finalRenderProfile: final
#         maxFinalSamples: 4096
#         ffmpegPath: ffmpeg
#         ffprobePath: ffprobe
#         encodeCrf: 18
#         encodePreset: medium
#         requireApprovalAboveFrames: 900
#         progressPollMs: 1000
#         reconcileOnStart: true
#         workspaceRoot: /path/to/workspace
```

</details>

**依据 2 · 源码核查**：[packages/deepblend/host/lib/index.js:4024-4052](https://github.com/pearjelly/deep-blend/blob/5ddf9992406e6a6df86c98ef95f51e028391c091/packages/deepblend/host/lib/index.js#L4024-L4052)

host 审批门与调用方重发

<details>
<summary>查看原文（29行）</summary>

```text
    // comes before everything below for the same reason as the approval gate: a
    // refusal must not have allocated anything.
    this._assertNoActiveRender(projectId)

    // ── the approval gate (SPEC §15.1, architecture-decisions Q7) ────────────
    //
    // Above the configured threshold, a delivery render is REFUSED unless the
    // caller presents a grant. Until M5 this was only a warning attached after the
    // job had started, which is a description of the cost rather than a control on
    // it — and the panel said so out loud ("display-only") because saying nothing
    // would have implied a guarantee that did not exist.
    //
    // The refusal is where the enforcement belongs rather than in the tool: the
    // tool plane is not the only caller (the workbench starts renders too), and a
    // control that only one of two callers respects is not a control. What the tool
    // plane adds is the means to ANSWER it — it holds the agent and the open turn
    // that `ctx.approval.request` needs — so it asks and re-issues with the grant.
    //
    // `approved` is the caller's assertion that a person said yes. The host cannot
    // verify it, and the honest reading is that it is a deliberate act either way:
    // the model may only set it after `approval.request` returned `'allowed-once'`,
    // and a human clicking "render" in the panel has approved it by clicking.
    const approvalRequired = frames.length > this.config.requireApprovalAboveFrames
    if (approvalRequired && request?.approved !== true) {
      throw new BlenderError(
        BlenderErrorCode.RENDER_APPROVAL_REQUIRED,
        `This delivery renders ${frames.length} frames, above the configured approval threshold of ` +
          `${this.config.requireApprovalAboveFrames} (SPEC §15.1). Nothing has been started. ` +
          'Ask the operator (the approval prompt in the workbench), then re-issue with approved:true — ' +
```

</details>

#### 缺口

- 未验证 UI 与 Agent 各入口的授权与取消
  **影响**：不能保证重任务审批和停止
  **进一步探讨**：模拟拒绝、过期 grant 与取消并读回任务

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

固定 DSH、Node、Blender 和视频工具版本，使用独立工作目录与最小场景。先验证预览，再核对明确授权的短渲染，计 CPU、磁盘与等待。退出时停任务、禁用 bundle，保留项目版本及交付文件。

#### 证据与依据

**依据 1 · 源码核查**：[packages/deepblend/bundle/README.md:75-105](https://github.com/pearjelly/deep-blend/blob/5ddf9992406e6a6df86c98ef95f51e028391c091/packages/deepblend/bundle/README.md#L75-L105)

安装与版本

<details>
<summary>查看原文（31行）</summary>

````text
## Install

Recommended — the published npm package:

```sh
dsh plugin --profile web add @deepblend/dsh-blender-bundle
```

Or install the prebuilt release bundle:

```sh
dsh plugin --profile web add https://github.com/pearjelly/deep-blend/releases/latest/download/deepblend-bundle.tgz
```

For the current source tree:

```sh
dsh plugin --profile web add 'github:pearjelly/deep-blend#path:/packages/deepblend/bundle'
```

Restart `dsh web`, select the **DeepBlend Studio** preset in a new session, and open the
Blender workbench in the sidebar. Installation adds both the workbench and agent presets.

**Requirements:** DSH **0.1.5-rc.2** on Node.js **22.23.3 or newer**, Blender **5.2.1**, and FFmpeg/ffprobe for MP4 delivery.
The managed Blender installer supports macOS arm64; on other platforms install Blender yourself
and configure `blenderPath`. See the installation guide for setup and platform details.
Source installs may require the build approval that DSH reports.

Version 0.3.4 adds **Save preview PNG** above previews, comparisons and inspection images. It checks the displayed source and saves the original bytes without a video encoder or another render.

Version 0.3.5 keeps creation inputs after failures, adds repair guidance and explicit retry, and recovers a saved project when its reply was lost. Newer drafts and later revisions are preserved. Drafts and retry keys remain in the current page; see the [creation recovery guide](https://github.com/pearjelly/deep-blend/blob/main/deepblend/docs/creation-recovery.md).
````

</details>

**依据 2 · 源码核查**：[packages/deepblend/bundle/cordis.patch.yml:94-103](https://github.com/pearjelly/deep-blend/blob/5ddf9992406e6a6df86c98ef95f51e028391c091/packages/deepblend/bundle/cordis.patch.yml#L94-L103)

默认工作目录及覆盖

<details>
<summary>查看原文（10行）</summary>

```text
    #   blenderPath   'auto'  -> the managed install if present, else PATH
    #   bootstrapPath ''      -> the copy shipped inside the provider package
    #   workspaceRoot ''      -> <DSH_HOME>/deepblend            (SPEC §17)
    #   projectsRoot  ''      -> <workspaceRoot>/projects        (SPEC §13)
    #
    # An operator who wants a different location sets it in the operator layer
    # ($DSH_HOME/profiles/<name>/cordis.patch.yml). Note that a layer's `config`
    # REPLACES this one wholesale rather than merging into it — measured, see
    # architecture-decisions D74 — so such a layer must restate every key it wants
    # to keep.
```

</details>

#### 缺口

- 平台制品、渲染与退出未实测
  **影响**：资源、兼容与残留未知
  **进一步探讨**：记录小场景输入输出和进程

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少渲染取消后的错误完成提示？

**研究主题**：新假设与验证

#### 完整回答

对照当前 host 审批和任务流程，试验用任务 ID、执行代和落盘帧读回确认取消。延迟结果及取消后恢复对照重复帧和误完成，若没有改善则撤回。

#### 证据与依据

**依据 1 · 源码核查**：[packages/deepblend/host/lib/index.js:4024-4052](https://github.com/pearjelly/deep-blend/blob/5ddf9992406e6a6df86c98ef95f51e028391c091/packages/deepblend/host/lib/index.js#L4024-L4052)

任务进入审批前后边界

<details>
<summary>查看原文（29行）</summary>

```text
    // comes before everything below for the same reason as the approval gate: a
    // refusal must not have allocated anything.
    this._assertNoActiveRender(projectId)

    // ── the approval gate (SPEC §15.1, architecture-decisions Q7) ────────────
    //
    // Above the configured threshold, a delivery render is REFUSED unless the
    // caller presents a grant. Until M5 this was only a warning attached after the
    // job had started, which is a description of the cost rather than a control on
    // it — and the panel said so out loud ("display-only") because saying nothing
    // would have implied a guarantee that did not exist.
    //
    // The refusal is where the enforcement belongs rather than in the tool: the
    // tool plane is not the only caller (the workbench starts renders too), and a
    // control that only one of two callers respects is not a control. What the tool
    // plane adds is the means to ANSWER it — it holds the agent and the open turn
    // that `ctx.approval.request` needs — so it asks and re-issues with the grant.
    //
    // `approved` is the caller's assertion that a person said yes. The host cannot
    // verify it, and the honest reading is that it is a deliberate act either way:
    // the model may only set it after `approval.request` returned `'allowed-once'`,
    // and a human clicking "render" in the panel has approved it by clicking.
    const approvalRequired = frames.length > this.config.requireApprovalAboveFrames
    if (approvalRequired && request?.approved !== true) {
      throw new BlenderError(
        BlenderErrorCode.RENDER_APPROVAL_REQUIRED,
        `This delivery renders ${frames.length} frames, above the configured approval threshold of ` +
          `${this.config.requireApprovalAboveFrames} (SPEC §15.1). Nothing has been started. ` +
          'Ask the operator (the approval prompt in the workbench), then re-issue with approved:true — ' +
```

</details>

**依据 2 · 源码核查**：[packages/deepblend/bundle/README.md:68-70](https://github.com/pearjelly/deep-blend/blob/5ddf9992406e6a6df86c98ef95f51e028391c091/packages/deepblend/bundle/README.md#L68-L70)

作者说明进度与恢复

```text
- **Finish or pick up later.** Render PNG frames and an MP4, inspect job progress, cancel work
  or resume missing frames. Completed frames can continue straight to encoding; delivery records
  retain frame sources and actual render settings.
```

#### 缺口

- 底层任务 fencing 和状态未知
  **影响**：可能已有等价实现
  **进一步探讨**：先查实际任务存储再故障注入

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
