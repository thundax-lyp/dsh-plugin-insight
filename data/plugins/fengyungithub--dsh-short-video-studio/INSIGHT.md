# DSH Short Video Studio

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[fcfb607](https://github.com/fengyungithub/dsh-short-video-studio/tree/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3)

<!-- BEGIN META -->
[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/fengyungithub/dsh-short-video-studio) [![npm 30d 4,437](https://img.shields.io/static/v1?label=npm+30d&message=4%2C437&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-short-video-studio) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-short-video-studio)
<!-- END META -->

> **功能**：在 DSH 会话中连接 ComfyUI，生成、整理和后处理短视频素材。

> **亮点**：用能力与档位组织已安装工作流，并关联会话画布及结果文件，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：本地中断不能证明远端已停止。工具批准监听异常放行，HTTP 生成也有独立路径，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 有 ComfyUI 的创作者为何把短镜头带进 DSH 画布？](#detail-section-11)
  - [Q02 · 如何选择图、提交并识别完成或中断？](#detail-section-12)
  - [Q03 · 创作批准门能否作为每条入口的强制审批？](#detail-section-13)
  - [Q04 · 已有本地渲染环境如何试一镜并可回退？](#detail-section-14)
  - [Q05 · 持久绑定后端任务 ID 能否降低中断后的重复出片？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已维护 ComfyUI 并反复整理短镜头的创作者，见 [Q01](#research-q01)。

在 ComfyUI 手工提交同一工作流，再按镜头计划整理产物。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 按能力渲染 | 调用配置的 ComfyUI 图 | 节点及模型要就绪 |
| 会话画布 | 查媒体与分组 | 实际产物由后端生成 |
| 创作批准记录 | 给工具工作流分阶段复核 | 不能覆盖所有入口 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 与 ComfyUI | 必需 | 显示画布并运行图 | 不能生成 |
| 工作流匹配节点和权重 | 渲染所需 | 生成目标产物 | 后端拒绝或缺输出 |
| ffmpeg | 部分后处理所需 | 拼接或重定帧率 | 按功能检查替代路径 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 选已可运行的工作流 | 固定输入及验收 |
| 渲染 | 观察单镜落画布 | 检查文件、时长和可播放性 |
| 退出 | 状态未知先查 ComfyUI | 避免重复派发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 设备与模型存储 | 验证节点和工作流 | 部署工时未知 |
| 持续 | GPU、电力、磁盘和模型 | 复核镜头与返工 | 每镜费用未知 |
| 恢复 | 可能重复渲染 | 回查任务 ID 和画布 | 停止等待不证明任务取消 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 渲染 | 工作流选择与产物保存 | 特定配置下的生成质量 |
| 审批 | 工具监听与批准记录 | 跨入口实际覆盖 |

> **思考**：本地中断不能证明远端已停止。工具批准监听异常放行，HTTP 生成也有独立路径，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：用能力与档位组织已安装工作流，并关联会话画布及结果文件，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

前置参数检查与后端任务 ID 提供故障定位线索。审批与 HTTP 要按各自路径核查，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

本地中断不能证明远端已停止。工具批准监听异常放行，HTTP 生成也有独立路径，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在一次性工作区做一镜，核查文件、规格及后端状态。需要重新生成前先看队列，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认画布和后端接线。生成质量、真实成本与部署行为仍待验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对挂载、代表性渲染、批准和 HTTP 路径；未运行 DSH、ComfyUI 或模型。
- 下一步：固定一镜对比手工与画布，并在收到任务 ID 后模拟失去客户端。

**分析版本**

- **仓库**：[fengyungithub/dsh-short-video-studio](https://github.com/fengyungithub/dsh-short-video-studio)
- **版本号**：1.19.0（[固定提交 fcfb607](https://github.com/fengyungithub/dsh-short-video-studio/tree/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

让任务先绑定后端 ID，重开时核对状态，测试能否避免重派生成，见 [Q05](#research-q05)。

固定一镜对比手工与画布，并在收到任务 ID 后模拟失去客户端。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 121 | 31516 | — | — | 550548 |
| .mjs | source | 111 | 19658 | 15344 | 2791 | — |
| .js | source | 12 | 14217 | 11374 | 2064 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/fengyungithub/dsh-short-video-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对 DSH 画布如何调度一镜，区分任务状态、创作批准与实际产物。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 有 ComfyUI 的创作者为何把短镜头带进 DSH 画布？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合已有 ComfyUI、要反复核对镜头草稿和产物的人。相对自己在 ComfyUI 选工作流、下文件再手工编组，扩展可让 DSH 依据能力和档位选清单，并把产物转成项目会话的媒体节点。宿主真实注册工具和路由，浏览器另挂画布。模型、节点及渲染品质仍由上游组合决定。合格结果应是一条可播放、规格符合要求且能找到工作流和输入的镜头。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:76-93](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/README.md#L76-L93)

作者说明部署与画布。

<details>
<summary>查看原文（18行）</summary>

````text
## 快速开始

前置条件：本机或者远程主机已运行 [ComfyUI](http://localhost:8188)，并已下载你计划使用的模型——内置默认（FLUX 2 / MiniMax H3）或你自己导入的模型（见[配置](#配置个性化)与[导入 workflow](#扩展导入你自己的-comfyui-workflow)）。

```bash
# 安装插件（三种来源任选其一；npm 为正式发布渠道，推荐）

# ① npm（正式发布，随版本自动更新安装源）
dsh plugin --profile web add dsh-short-video-studio
# ② GitHub（最新源码）
# dsh plugin --profile web add github:fengyungithub/dsh-short-video-studio
# ③ 本地源码（开发用）
# dsh plugin --profile web add file:/path/to/dsh-short-video-studio

dsh web   # 重启后会话出现「画布」tab；自带 skill 已自动装到 ~/.dsh/skills/
```

安装后自动完成三件事：`skills/` 下 skill 复制到 `~/.dsh/skills/`（**版本戳刷新**：每个副本的 `.dsh-studio-manifest` 记下插件版本 + 内容哈希，内容被你改过就只提示、绝不覆盖，没改过才随插件升级刷新；`DSH_SVS_SKILL_REFRESH=off` 关掉刷新、`=force` 连改过的也覆盖）；Web 设置页新增 **ComfyUI** 配置菜单；会话多出「画布」视图 tab。
````

</details>

**依据 2 · 源码核查**：[lib/index.js:8069-8092](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/lib/index.js#L8069-L8092)

宿主实际注册工具。

<details>
<summary>查看原文（24行）</summary>

```text
export function apply(hostCtx) {
  ctx = hostCtx
  const runtime = {
    token: randomBytes(32).toString('base64url'),
    studioRoot: resolve(packageRoot, 'studio'),
  }

  // 安装自带 skill（供模型/技能中心发现）
  installBundledSkills()

  // M1：加载并校验内置工作流清单（纯观察，工具/路由仍走旧 builder，M2 再切换到 registry）
  const manifestReport = loadBuiltinManifests(resolve(packageRoot, 'workflows'))
  if (manifestReport.errors.length) {
    console.warn('[dsh-short-video-studio] 内置工作流清单校验失败:', manifestReport.errors)
  }

  // 工具
  const tools = makeTools()
  const disposeTools = ctx.effect(() => {
    const disposers = tools.map((t) => ctx.tools.register(t))
    return () => disposers.forEach((d) => d())
  }, 'dsh-short-video-studio: tools')

  // pre-ask 自动送达：ask_user_question 执行前，把画布中未送达的产物经
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1715-1727](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/lib/client.js#L1715-L1727)

实际注册会话视图。

<details>
<summary>查看原文（13行）</summary>

```text
      return ctx.slots.inject('conversation.view', () => ctx.slots.register({
        name: 'conversation.view',
        id: CANVAS_VIEW_ID,
        order: 20,
        label: CANVAS_LABEL,
      }, CanvasView))
    }

    /**
     * 家 = 右侧栏 tab 类型，走官方两阶段注册（与 ui-sidebar-files 同构）：
     * ① 类型定义进 `ctx.sidebarRightTabs`（含引导页胶囊）② 正文进 keyed 的 `sidebar.right.pane.tab`。
     * 不注册 `sidebar.right.pane.tab.title` —— 该席位可省，省略时 chip 直接用类型定义里的 title。
     * 正文**复用同一个 CanvasView**：session 作用域的席位同样拿到 sessionId / useWorkspaces /
```

</details>

**依据 4 · 源码核查**：[lib/index.js:3296-3333](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/lib/index.js#L3296-L3333)

输出落文件并组装媒体节点。

<details>
<summary>查看原文（38行）</summary>

```text
    const promptId = await comfySubmit(graph)
    const entry = await comfyWait(promptId, opts.signal)
    lastEntry = entry
    const outputs = comfyOutputs(entry)
    if (!outputs.length) throw new Error('generation-error: ComfyUI 无输出')
    for (const f of outputs) {
      const buf = await comfyDownload(f)
      files.push(await persistMedia(root, sessionId, buf, f.filename))
    }
  }
  // B 方案：从 history 的 ui.text 里抓回存盘节点写出的 latent 文件名（「saved output/open_h3_latents/…」）。
  // 找不到就如实记为 null（节点包没装就不会有这一行——但那种情况渲染本身会先失败）。
  const latentFile = (() => {
    const raw = JSON.stringify(lastEntry || {})
    const m = raw.match(/open_h3_latents\/([A-Za-z0-9._-]+\.safetensors)/)
    return m ? m[1] : null
  })()

  const mediaType = manifest.output?.mediaType || (manifest.capability.startsWith('video') ? 'video' : 'image')
  // 交付尺寸如实记账：图片产物落盘后读真实像素（视频沿用 probeMp4 的记录口径）
  let deliverySize = lockSize
  if (!isAudioOutput && mediaType === 'image' && files[0]) {
    const actual = probeImageSize(join(root, ...String(files[0]).split('/')))
    if (actual) {
      if (actual.w !== lockSize.w || actual.h !== lockSize.h) {
        resolved.warnings = [...(resolved.warnings || []), `交付尺寸以产物为准：${actual.w}×${actual.h}（推导/图内尺寸 ${effSize.w}×${effSize.h}）`]
      }
      deliverySize = actual
    }
  }
  const node = {
    id: nodeId,
    kind: mediaType,
    title: opts.title || manifest.displayName || (mediaType === 'video' ? '视频' : mediaType === 'audio' ? '音乐' : '图片'),
    media: files[0] || '',
    group: opts.group || DEFAULT_GROUP,
    params: {
      workflow: manifest.id,
```

</details>

#### 缺口

- 同一工作流经画布和手工完成的交付时间未知
  **影响**：无法证明节省整理和返工
  **进一步探讨**：固定一镜和模型参数比较两条路径

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何选择图、提交并识别完成或中断？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

从会话及工作区取得项目和设置，参数缺省时可由画布配置补入。能力与档位解析工作流，要求续接时限定支持续接的实现；上传前先检查形状与参数，不支持的注入点给警告。图发到 ComfyUI 的 /prompt 获取 ID，再轮询 /history/{id}。无输出报错，有输出才下载和保存。取消信号与超时在轮询循环中使客户端停止等待，该段没有向 ComfyUI 发取消的调用。收到本地取消不能证明远端队列没继续，应先用任务 ID 或服务端队列查状态再重试。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3037-3079](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/lib/index.js#L3037-L3079)

项目设置、清单解析和参数检查。

<details>
<summary>查看原文（43行）</summary>

```text
async function runRender(ctx, opts) {
  const { workspaceId, exec } = opts
  const { root, sessionId } = resolveSessionRoot(ctx, opts.sessionId, workspaceId, exec)
  const project = await loadProject(root, sessionId)
  const aspectRatio = project.settings?.aspectRatio
  const settings = project.settings || {}

  // 配置卡：缺省档位 / 角色卡版本由画布配置注入（显式参数优先；配置门已校验矛盾）。
  // 只在「已建配置卡」的项目生效——旧项目 / 自由模式保持原有默认，避免行为漂移。
  const cap = String(opts.capability || '')
  if (settings.configured === true) {
    if (opts.tier === undefined && opts.mode === undefined && !opts.implementation) {
      if (cap === 'image.text2image' || cap === 'image.image2image') opts = { ...opts, tier: settings.imageTier || undefined }
      else if (cap === 'video.reference2video' || cap === 'video.image2video' || cap === 'video.text2video') opts = { ...opts, tier: settings.mode || undefined }
    }
    if (opts.ref_variant === undefined && cap === 'video.reference2video' && settings.characterCardVariant) {
      opts = { ...opts, ref_variant: settings.characterCardVariant }
    }
  }

  const registry = getRegistry()
  // 档位解析：capability + tier → 实现清单（不静默跨档替换；不可用显式报错）
  const wantTier = tierFromArgs(opts)
  const legacyMode = legacyModeFromArgs(opts)
  const wantContinuity = typeof opts.continuity_from === 'string' && opts.continuity_from.trim() !== ''
  const resolved = await resolveTieredManifest(opts.capability, wantTier, explicitImplementationOf(opts), { registry, chainOnly: wantContinuity })
  const manifest = resolved.manifest
  // 音频能力（如 audio.music）：没有画面尺寸，runner 要跳过分辨率推导与尺寸告警。
  const isAudioOutput = manifest.output?.mediaType === 'audio'
  // 形状 × 参数校验：尽早做，所有入口（工具面 / HTTP 路由 / 脚本）受同一张真值表约束；
  // 放在上传之前，非法请求不产生任何副作用（不上传参考图、不建节点）。
  const shapeCheck = validateVideoArgs(manifest.capability, { ...opts, capability: manifest.capability })
  if (shapeCheck.warnings.length) resolved.warnings = [...(resolved.warnings || []), ...shapeCheck.warnings]
  // 参数支持面检查：调用方传了、但所选实现**没有注入点**的参数 → 明确告警（禁止静默丢弃）。
  // 典型：给 Qwen 清单传 guidance（cfg 固定 1）、给 i2i 传 width/height（尺寸跟随参考图）。
  const supportedParams = isAudioOutput
    ? ['steps', 'seed', 'guidance', 'duration', 'cfg']
    : ['width', 'height', 'length', 'steps', 'seed', 'guidance']
  for (const k of ['width', 'height', 'length', 'steps', 'seed', 'guidance', 'duration', 'cfg']) {
    const v = opts[k]
    if (v === undefined || v === null || v === '') continue
    if (supportedParams.includes(k) && manifest.params && manifest.params[k] !== undefined) continue
    resolved.warnings = [...(resolved.warnings || []), `参数 ${k} 未生效：实现 ${manifest.id} 没有它的注入点（该参数由实现自身固定或由输入决定）`]
```

</details>

**依据 2 · 源码核查**：[lib/index.js:337-376](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/lib/index.js#L337-L376)

提交与带本地取消的轮询。

<details>
<summary>查看原文（40行）</summary>

```text
async function comfySubmit(graph) {
  const res = await comfyFetch('/prompt', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt: graph, client_id: 'dsh-short-video-studio-' + randomUUID() }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok || !body?.prompt_id) {
    let detail = ''
    if (body?.node_errors && Object.keys(body.node_errors).length) detail = JSON.stringify(body.node_errors)
    else if (body?.error) detail = typeof body.error === 'string' ? body.error : JSON.stringify(body.error)
    else if (body?.message) detail = body.message
    else detail = res.status + (typeof res.statusText === 'string' ? ' ' + res.statusText : '')
    throw new Error('workflow-validation: ComfyUI 拒绝工作流：' + (detail || res.status))
  }
  return body.prompt_id
}

/** 轮询 /history/{id} 直到 completed/error，带超时与 signal。 */
async function comfyWait(promptId, signal) {
  const deadline = Date.now() + GENERATION_TIMEOUT_MS
  for (;;) {
    if (signal?.aborted) throw new Error('generation cancelled')
    if (Date.now() > deadline) throw new Error('timeout: ComfyUI 生成超时（>' + GENERATION_TIMEOUT_MS + 'ms）')
    const res = await comfyFetch('/history/' + encodeURIComponent(promptId))
    const body = await res.json().catch(() => ({}))
    const entry = body?.[promptId]
    if (entry) {
      const status = entry.status
      if (status?.completed) return entry
      if (status?.status_str === 'error') {
        const errs = []
        for (const out of Object.values(entry.outputs || {})) {
          for (const e of out?.node_errors || []) errs.push(e?.message || JSON.stringify(e))
        }
        throw new Error('generation-error: ' + (errs.join('; ') || 'ComfyUI 节点报错'))
      }
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3296-3304](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/lib/index.js#L3296-L3304)

下载前需有后端输出。

```text
    const promptId = await comfySubmit(graph)
    const entry = await comfyWait(promptId, opts.signal)
    lastEntry = entry
    const outputs = comfyOutputs(entry)
    if (!outputs.length) throw new Error('generation-error: ComfyUI 无输出')
    for (const f of outputs) {
      const buf = await comfyDownload(f)
      files.push(await persistMedia(root, sessionId, buf, f.filename))
    }
```

#### 缺口

- 网络断开时 ComfyUI 是否仍出片及本地是否已有部分文件未实测
  **影响**：重复提交可能消耗 GPU 且产生冗余输出
  **进一步探讨**：在一次性工作区模拟中断并独立核对队列、输出和画布

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 创作批准门能否作为每条入口的强制审批？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

工具预执行监听读取项目规则，发现缺批准时拒绝相应生成或拼接。监听异常时继续执行，开关关闭也通过。批准通过工具记录，所查生成 HTTP 路径校验配置后直接运行，未经过所查 tools/pre-execute 监听。因此批准账本能帮助编排和审阅，不能视为每条入口强制的人类签名。HTTP 另有 token 检查。部署所需 DSH、ComfyUI 节点及模型需按实际工作流核对，缺依赖时返回工作流拒绝或输出缺失。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:5626-5663](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/lib/index.js#L5626-L5663)

预执行按条件拒绝，异常放行。

<details>
<summary>查看原文（38行）</summary>

```text
function makeApprovalGateListener(ctx) {
  return async function approvalGateListener(exec, next) {
    try {
      if (!APPROVAL_GATE || !exec?.arguments) return next()
      if (String(process.env.DSH_SVS_APPROVAL_GATE || '').toLowerCase() === 'off') return next()
      const name = exec.name
      const args = exec.arguments
      const sid = args.sessionId || exec?.agent?.id
      if (!sid) return next()
      const { root } = resolveSessionRoot(ctx, sid, args.workspaceId, exec)
      const project = await loadProject(root, sid)
      if (!gateOn(project.settings, 'approval')) return next()
      let issues = []
      const capability = String(args.capability || '')
      const isImageGen = name === 'comfy_generate_image'
        || (name === 'comfy_render' && (capability === 'image.text2image' || capability === 'image.image2image'))
      const isVideoGen = name === 'comfy_generate_video'
        || (name === 'comfy_render' && capability.startsWith('video.')
          && capability !== 'video.upscale' && capability !== 'video.interpolate' && capability !== 'video.regenerate')
      if (isImageGen) {
        issues = imageApprovalIssues(project, args)
      } else if (name === 'canvas_write_node' && args.kind === 'table'
        && typeof args.content === 'string' && parseShotTableContent(args.content)) {
        issues = tableApprovalIssues(project)
      } else if (isVideoGen) {
        issues = videoApprovalIssues(project, args)
      } else if (name === 'video_concat') {
        issues = concatApprovalIssues(project, args)
      }
      if (!issues.length) return next()
      return {
        kind: 'deny',
        reason: `创作批准门未通过：${issues.join('；')}。批准账本：canvas_approve(target=assets|shotTable|storyboard|clips)；整体关闭：DSH_SVS_APPROVAL_GATE=off。`,
      }
    } catch {
      return next()
    }
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:6581-6599](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/lib/index.js#L6581-L6599)

批准作为模型工具的写入契约。

<details>
<summary>查看原文（19行）</summary>

```text
  // 这是 approval gate 的放行凭据——没有它，新卡/写表/Sxx 视频/拼接都会被挡。
  const approveTool = {
    name: 'canvas_approve',
    description:
      '记录「用户已人工批准某阶段产物」的凭据（写 project.approvals），是创作批准门的放行凭据。' +
      'target=assets（角色卡/场景卡/道具卡锁定，每张卡/每组卡一次）、shotTable（七列镜头表批准，先跑 STEP 5.5 并打 shot-table self-check: passed 戳）、' +
      'storyboard（分镜批准）、clips（门 3 片段批准：per-shot 每镜一次 / batch 批量一次，要求片段已 canvas_record_check pass）。' +
      '未调用时：生成新卡、写七列镜头表、生成 Sxx 视频、video_concat 都会被 pre-execute 门 deny。' +
      '批准按配置 breakingRev 失效；重出卡 / 改表 / 改分镜 / 重渲片段会让对应批准失效。触发词：用户确认/锁定/批准。',
    parameters: {
      type: 'object',
      properties: {
        target: { type: 'string', enum: APPROVAL_TARGETS, description: '批准对象：assets / shotTable / storyboard / clips。' },
        nodeIds: { type: 'array', items: { type: 'string' }, description: '目标节点 id。assets 缺省=当前全部资产卡；clips 缺省=全部镜头视频节点（params.shot=true）；会与已有 clips 批准合并。' },
        nodeId: { type: 'string', description: 'shotTable / storyboard 的节点 id（缺省自动找镜头表 / 分镜节点）。' },
        note: { type: 'string', description: '用户选择或备注（可选，便于追溯）。' },
        sessionId: { type: 'string', description: '会话 id（缺省取当前 agent 会话）。' },
        workspaceId: { type: 'string', description: '工作区 id（缺省自动解析）。' },
      },
```

</details>

**依据 3 · 源码核查**：[lib/index.js:7693-7704](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/lib/index.js#L7693-L7704)

HTTP 视频生成直接调用 runner。

<details>
<summary>查看原文（12行）</summary>

```text

    // POST /generate/video
    if (req.method === 'POST' && action === '/generate/video') {
      const { root, sessionId, workspaceId } = resolveFromQuery(ctx, url)
      const body = await requestJson(req)
      const capability = body.type ? VIDEO_SHAPES[body.type]?.capability : null
      if (!capability) throw HttpError(400, `type 必须显式声明且合法（${Object.keys(VIDEO_SHAPES).join(' / ')}）`)
      const gateIssues = configIssuesFor(await loadProject(root, sessionId), 'video', body)
      if (gateIssues.length) throw HttpError(403, '配置门未通过：' + gateIssues.join('；'))
      const r = await runRender(ctx, { ...body, capability, sessionId, workspaceId, exec: null })
      sendJson(res, 200, r)
      return
```

</details>

**依据 4 · 源码核查**：[lib/index.js:7758-7763](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/lib/index.js#L7758-L7763)

路由校验 token。

```text
  return { apiPrefix, handleApi, handleMedia, handleStatic }
}

function requireToken(req, runtime) {
  if (req.headers['x-dsh-svs-token'] !== runtime.token) throw HttpError(403, 'unauthorized')
}
```

**依据 5 · 作者声明**：[README.md:76-88](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/README.md#L76-L88)

外部 ComfyUI 与模型依赖。

<details>
<summary>查看原文（13行）</summary>

````text
## 快速开始

前置条件：本机或者远程主机已运行 [ComfyUI](http://localhost:8188)，并已下载你计划使用的模型——内置默认（FLUX 2 / MiniMax H3）或你自己导入的模型（见[配置](#配置个性化)与[导入 workflow](#扩展导入你自己的-comfyui-workflow)）。

```bash
# 安装插件（三种来源任选其一；npm 为正式发布渠道，推荐）

# ① npm（正式发布，随版本自动更新安装源）
dsh plugin --profile web add dsh-short-video-studio
# ② GitHub（最新源码）
# dsh plugin --profile web add github:fengyungithub/dsh-short-video-studio
# ③ 本地源码（开发用）
# dsh plugin --profile web add file:/path/to/dsh-short-video-studio
````

</details>

#### 缺口

- 不同部署的 token 暴露及所有批准入口未审计
  **影响**：不能用于强权限审批或对外承诺
  **进一步探讨**：在隔离服务分别验证 UI 和模型入口的准入与失败

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 已有本地渲染环境如何试一镜并可回退？

**研究主题**：效果与总成本、采用判断

#### 完整回答

有独立工作区和已可用的 ComfyUI 工作流时，可先做一条短镜头。固定输入、种子与目标规格，检查生成路径、时长及画布能否找回产物。用手工提交同一图并整理文件对照。分别记录 GPU 时间、电力存储、模型和人工核对，不能将本地运行概括为无成本。遇到缺节点、没有实际文件或取消后队列状态未知，停止继续派发，回到 ComfyUI 查看已提交任务，再手工归档。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:76-93](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/README.md#L76-L93)

已有本地或远端 ComfyUI 的前置。

<details>
<summary>查看原文（18行）</summary>

````text
## 快速开始

前置条件：本机或者远程主机已运行 [ComfyUI](http://localhost:8188)，并已下载你计划使用的模型——内置默认（FLUX 2 / MiniMax H3）或你自己导入的模型（见[配置](#配置个性化)与[导入 workflow](#扩展导入你自己的-comfyui-workflow)）。

```bash
# 安装插件（三种来源任选其一；npm 为正式发布渠道，推荐）

# ① npm（正式发布，随版本自动更新安装源）
dsh plugin --profile web add dsh-short-video-studio
# ② GitHub（最新源码）
# dsh plugin --profile web add github:fengyungithub/dsh-short-video-studio
# ③ 本地源码（开发用）
# dsh plugin --profile web add file:/path/to/dsh-short-video-studio

dsh web   # 重启后会话出现「画布」tab；自带 skill 已自动装到 ~/.dsh/skills/
```

安装后自动完成三件事：`skills/` 下 skill 复制到 `~/.dsh/skills/`（**版本戳刷新**：每个副本的 `.dsh-studio-manifest` 记下插件版本 + 内容哈希，内容被你改过就只提示、绝不覆盖，没改过才随插件升级刷新；`DSH_SVS_SKILL_REFRESH=off` 关掉刷新、`=force` 连改过的也覆盖）；Web 设置页新增 **ComfyUI** 配置菜单；会话多出「画布」视图 tab。
````

</details>

**依据 2 · 源码核查**：[lib/index.js:337-376](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/lib/index.js#L337-L376)

提交 ID 与历史条件。

<details>
<summary>查看原文（40行）</summary>

```text
async function comfySubmit(graph) {
  const res = await comfyFetch('/prompt', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt: graph, client_id: 'dsh-short-video-studio-' + randomUUID() }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok || !body?.prompt_id) {
    let detail = ''
    if (body?.node_errors && Object.keys(body.node_errors).length) detail = JSON.stringify(body.node_errors)
    else if (body?.error) detail = typeof body.error === 'string' ? body.error : JSON.stringify(body.error)
    else if (body?.message) detail = body.message
    else detail = res.status + (typeof res.statusText === 'string' ? ' ' + res.statusText : '')
    throw new Error('workflow-validation: ComfyUI 拒绝工作流：' + (detail || res.status))
  }
  return body.prompt_id
}

/** 轮询 /history/{id} 直到 completed/error，带超时与 signal。 */
async function comfyWait(promptId, signal) {
  const deadline = Date.now() + GENERATION_TIMEOUT_MS
  for (;;) {
    if (signal?.aborted) throw new Error('generation cancelled')
    if (Date.now() > deadline) throw new Error('timeout: ComfyUI 生成超时（>' + GENERATION_TIMEOUT_MS + 'ms）')
    const res = await comfyFetch('/history/' + encodeURIComponent(promptId))
    const body = await res.json().catch(() => ({}))
    const entry = body?.[promptId]
    if (entry) {
      const status = entry.status
      if (status?.completed) return entry
      if (status?.status_str === 'error') {
        const errs = []
        for (const out of Object.values(entry.outputs || {})) {
          for (const e of out?.node_errors || []) errs.push(e?.message || JSON.stringify(e))
        }
        throw new Error('generation-error: ' + (errs.join('; ') || 'ComfyUI 节点报错'))
      }
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:3296-3333](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/lib/index.js#L3296-L3333)

产物及画布节点边界。

<details>
<summary>查看原文（38行）</summary>

```text
    const promptId = await comfySubmit(graph)
    const entry = await comfyWait(promptId, opts.signal)
    lastEntry = entry
    const outputs = comfyOutputs(entry)
    if (!outputs.length) throw new Error('generation-error: ComfyUI 无输出')
    for (const f of outputs) {
      const buf = await comfyDownload(f)
      files.push(await persistMedia(root, sessionId, buf, f.filename))
    }
  }
  // B 方案：从 history 的 ui.text 里抓回存盘节点写出的 latent 文件名（「saved output/open_h3_latents/…」）。
  // 找不到就如实记为 null（节点包没装就不会有这一行——但那种情况渲染本身会先失败）。
  const latentFile = (() => {
    const raw = JSON.stringify(lastEntry || {})
    const m = raw.match(/open_h3_latents\/([A-Za-z0-9._-]+\.safetensors)/)
    return m ? m[1] : null
  })()

  const mediaType = manifest.output?.mediaType || (manifest.capability.startsWith('video') ? 'video' : 'image')
  // 交付尺寸如实记账：图片产物落盘后读真实像素（视频沿用 probeMp4 的记录口径）
  let deliverySize = lockSize
  if (!isAudioOutput && mediaType === 'image' && files[0]) {
    const actual = probeImageSize(join(root, ...String(files[0]).split('/')))
    if (actual) {
      if (actual.w !== lockSize.w || actual.h !== lockSize.h) {
        resolved.warnings = [...(resolved.warnings || []), `交付尺寸以产物为准：${actual.w}×${actual.h}（推导/图内尺寸 ${effSize.w}×${effSize.h}）`]
      }
      deliverySize = actual
    }
  }
  const node = {
    id: nodeId,
    kind: mediaType,
    title: opts.title || manifest.displayName || (mediaType === 'video' ? '视频' : mediaType === 'audio' ? '音乐' : '图片'),
    media: files[0] || '',
    group: opts.group || DEFAULT_GROUP,
    params: {
      workflow: manifest.id,
```

</details>

#### 缺口

- 合格一镜的算力与人工净投入未测
  **影响**：不能从作者性能档推断本机结果
  **进一步探讨**：同一 GPU、图、模型和种子比较两路径

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 持久绑定后端任务 ID 能否降低中断后的重复出片？

**研究主题**：新假设与验证

#### 完整回答

可在拿到 prompt_id 后将画布任务记为已提交，并让重开时查历史或队列，而非重新发送。与当前等待和取消路径对照，模拟提交前失败、ID 返回后断开、渲染已完未下载。统计重复渲染、无法归属文件及恢复时间。若服务端清理历史后误绑定，或减少的重试无法覆盖状态维护，则只保留人工查询入口。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:337-376](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/lib/index.js#L337-L376)

提交和等待用后端任务 ID 分开。

<details>
<summary>查看原文（40行）</summary>

```text
async function comfySubmit(graph) {
  const res = await comfyFetch('/prompt', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt: graph, client_id: 'dsh-short-video-studio-' + randomUUID() }),
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok || !body?.prompt_id) {
    let detail = ''
    if (body?.node_errors && Object.keys(body.node_errors).length) detail = JSON.stringify(body.node_errors)
    else if (body?.error) detail = typeof body.error === 'string' ? body.error : JSON.stringify(body.error)
    else if (body?.message) detail = body.message
    else detail = res.status + (typeof res.statusText === 'string' ? ' ' + res.statusText : '')
    throw new Error('workflow-validation: ComfyUI 拒绝工作流：' + (detail || res.status))
  }
  return body.prompt_id
}

/** 轮询 /history/{id} 直到 completed/error，带超时与 signal。 */
async function comfyWait(promptId, signal) {
  const deadline = Date.now() + GENERATION_TIMEOUT_MS
  for (;;) {
    if (signal?.aborted) throw new Error('generation cancelled')
    if (Date.now() > deadline) throw new Error('timeout: ComfyUI 生成超时（>' + GENERATION_TIMEOUT_MS + 'ms）')
    const res = await comfyFetch('/history/' + encodeURIComponent(promptId))
    const body = await res.json().catch(() => ({}))
    const entry = body?.[promptId]
    if (entry) {
      const status = entry.status
      if (status?.completed) return entry
      if (status?.status_str === 'error') {
        const errs = []
        for (const out of Object.values(entry.outputs || {})) {
          for (const e of out?.node_errors || []) errs.push(e?.message || JSON.stringify(e))
        }
        throw new Error('generation-error: ' + (errs.join('; ') || 'ComfyUI 节点报错'))
      }
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:3296-3304](https://github.com/fengyungithub/dsh-short-video-studio/blob/fcfb6071d5b0bb2ed6762828ec88e6c9feeceed3/lib/index.js#L3296-L3304)

渲染完成后才读取输出。

```text
    const promptId = await comfySubmit(graph)
    const entry = await comfyWait(promptId, opts.signal)
    lastEntry = entry
    const outputs = comfyOutputs(entry)
    if (!outputs.length) throw new Error('generation-error: ComfyUI 无输出')
    for (const f of outputs) {
      const buf = await comfyDownload(f)
      files.push(await persistMedia(root, sessionId, buf, f.filename))
    }
```

#### 缺口

- 后端历史保留时长和 ID 可查性未知
  **影响**：持久引用可能丢失可用状态
  **进一步探讨**：在一次性 ComfyUI 核不同历史清理条件

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
