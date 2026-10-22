# dsh-pet-live2d

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[2b48355](https://github.com/A8Chann/dsh-pet-live2d/tree/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet)

<!-- BEGIN META -->
[![GitHub ★ 49](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=49&color=yellow&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d)
<!-- END META -->

> **实现功能**：为 DSH Web/可选桌面层提供随会话状态变化的 Live2D 宠物、装扮、提示音和共享设置。

> **核心亮点**：把 Agent 状态映射到可配置的 Live2D 动作与声画提醒，降低查看状态的切换成本假设。详见[Q01](#research-q01)。

> **风险与缺陷**：升级只看 pet.json 是否改动，对自改纹理/动作但未改 manifest 的同名文件仍可能 cpSync 覆盖；作者的“任何自改不覆盖”表述过宽。详见[Q02](#research-q02)。

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
  - [Q01 · 桌宠为 DSH Web 提供哪些交互？](#detail-section-11)
  - [Q02 · 随包宠物和用户改动如何共存？](#detail-section-12)
  - [Q03 · 专有运行时和本地 API 的安全/可靠性边界？](#detail-section-13)
  - [Q04 · 采用前怎样验证和保护用户宠物？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望通过可视宠物感知 Agent 运行/等待/完成状态，并自定义模型动作与外观。

使用 DSH 默认状态文本或静态头像；插件以 Live2D 声画提示和可选桌面层替代部分查看动作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 资源/渲染 | 自带模型展示 | Core 需外取 |
| 相位提醒 | 可视状态 | 效果未实测 |
| 升级同步 | 更新默认宠物 | 非 manifest 自改可覆写 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH Web/事件 | 渲染/相位 | 功能降级 |
| Cubism Core | 模型渲染 | CDN 不可达需手动 |
| GPU/浏览器 | Live2D 动画 | 性能未知 |
| 资源备份 | 升级恢复 | 自改文件可能被覆盖 |

#### 受控试用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 备份 | 复制自定义 pets/设置 | 可恢复 |
| 装载 | 核模型与 Core 来源 | 正常渲染 |
| 相位 | 触发 tool/wait/done | 提示符合实际 |
| 升级 | 改纹理/动作再升级副本 | 用户文件不丢 |

**效果与成本**

#### 成本

| 阶段 | 资源与人工 | 边界 |
| --- | --- | --- |
| 初次 | DSH Web/桌面、模型资源、Core CDN | 首次需要网络或手动 Core |
| 使用 | GPU/内存和视觉注意力 | 帧率与干扰未验 |
| 升级 | 备份自定义纹理/动作 | 仅 pet.json 指纹保护 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 事件宠物 | 相位/动作/音频通道 | 提醒是否有用 |
| 自带模型 | 安装/升级复制 | 自改资源覆盖率 |
| Core 运行时 | CDN 兜底缓存 | 版本与完整性稳定性 |

> **思考**：升级只看 pet.json 是否改动，对自改纹理/动作但未改 manifest 的同名文件仍可能 cpSync 覆盖；作者的“任何自改不覆盖”表述过宽。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把 Agent 状态映射到可配置的 Live2D 动作与声画提醒，降低查看状态的切换成本假设。详见[Q01](#research-q01)。

把 Agent 状态映射到可配置的 Live2D 动作与声画提醒，降低查看状态的切换成本假设。详见[Q01](#research-q01)。

Host 扫描模型资源闭包，回环 API 服务目录/资产/事件/设置，依赖 Live2D Core 与可选桌面子包。升级复制只比较 pet.json，Core CDN 无固定哈希。

<a id="detail-section-5"></a>

### 1.4 主要限制

升级只看 pet.json 是否改动，对自改纹理/动作但未改 manifest 的同名文件仍可能 cpSync 覆盖；作者的“任何自改不覆盖”表述过宽。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人隔离安装可试用；先备份 pets 和设置，用改资源不改 manifest 的升级副本测覆盖。需要稳定环境时固定 Core 与限制写路由。详见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可核资源与事件路径；仅 pet.json 指纹保护升级可能覆盖同名自改资源，Core CDN 无固定哈希，写路由防护不一致。

- 已检查：作者 README、包清单、源码路径 dsh-live2d-pet/README.md、dsh-live2d-pet/package.json、dsh-live2d-pet/lib/index.js、dsh-live2d-pet/lib/display.js、dsh-live2d-pet/lib/settings.js、dsh-live2d-pet/lib/sound-files.js 及固定范围 inventory；组件：dsh-live2d-pet。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定组件 README、Host、显示层/设置/音频关键路径；未运行目标插件、下载 Core 或渲染模型。
- 下一步：目标 Web/桌面运行相位与双窗口压力测试；修改非 pet.json 文件后升级副本；Core 版本/哈希和跨站本地 POST 边界验证。

**分析版本**

- **仓库**：[A8Chann/dsh-pet-live2d](https://github.com/A8Chann/dsh-pet-live2d)
- **版本号**：3.3.3（[固定提交 2b48355](https://github.com/A8Chann/dsh-pet-live2d/tree/2b48355bc9fb0c99cd5d32df64675b1900629e88)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按完整目录资源指纹保护用户文件，固定 Core 版本/哈希并统一写路由校验，可提升可靠性；现版未实现。详见[Q03](#research-q03)、[Q04](#research-q04)。

目标 Web/桌面运行相位与双窗口压力测试；修改非 pet.json 文件后升级副本；Core 版本/哈希和跨站本地 POST 边界验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1328 | — | — | 20751 |
| .js | source | 7 | 12674 | 8169 | 3975 | — |
| .ts | source | 1 | 28 | 17 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=grey&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d/issues?q=is%3Aissue+created%3A2026-09-22T05%3A59%3A38.535Z..2026-10-22T05%3A59%3A38.535Z) [![近30天关闭 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/A8Chann/dsh-pet-live2d/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A59%3A38.535Z..2026-10-22T05%3A59%3A38.535Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 Live2D 桌宠模型/运行时装载、会话相位和用户资源升级保护，明确源码与视觉/授权证据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌宠为 DSH Web 提供哪些交互？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

组件在 DSH Web 展示可拖动的 Live2D 宠物，按 Agent/工具/批准等事件切换相位、动作与提示，提供装扮、气泡、音频和可选桌面显示层。Host 扫描 pets/<id> 的模型及资源闭包，Web 客户端渲染，设置页/插件页维护共享配置。与静态头像相比，它把长任务和需要用户处理的状态转为可见反馈，并提供大量外观自定义；但能否减少漏看批准或提升体验属于作者宣传，未在本轮实测。包附一只模型，真实视觉、帧率和宿主兼容未验证。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-live2d-pet/README.md:1-38](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/README.md#L1-L38)

作者描述交互、相位与默认宠物。

<details>
<summary>查看原文（38行）</summary>

```text
# dsh-pet-live2d

给 **DSH**（DeepSeek Harness）Web GUI 用的 **Live2D 桌宠插件**：一只可以拖动、跟着鼠标看、
点她会害羞、还会跟着会话状态换动作的桌宠。

自带 **DS鲸鱼娘**（8 组动作 + 44 个表情/道具），开箱即用。

> **宠物会跟着插件一起更新**：随包的那只（以及它的默认设置：台词、互动反应、
> 会话相位、摸鱼槽位）在插件升级时**自动同步**到 `%DSH_HOME%\pets\ds-whale-girl\`。
> 你自己改过的那份**不会被覆盖**（判定是内容指纹，改过就一个字都不碰），
> 想拿回随包版本就把目录删掉、重启 `dsh web`，它会重新装一份。更新日志见 [CHANGELOG.md](CHANGELOG.md)。

![界面预览：DS鲸鱼娘桌宠（大肥鱼 pet-live2d）](docs/banner.png)

## 功能

- **拖动 / 缩放**：位置和大小记在 localStorage，重启还在
- **跟随鼠标**：视线和头部跟着指针，移开（或窗口失焦）自动回正
- **点击反应**：点**头部**才挥锤撒娇，点身上其它地方只出气泡
- **事件穿透**：只有角色剪影吃鼠标事件，方形画布的透明处**穿透**到底下的页面，不挡 DSH 的 UI
- **跟着会话走**：订阅 DSH 的真实事件（`tools/*` 等），思考/工具/等待/完成/出错换动作与表情，
  长任务持续播放对应动画
- **待机摸鱼**：静置一会儿自己演一段（不会演「点击」「出错」这类专属动作）
- **都会自己收尾**：动作、定格、表情到点全部回到初始待机，不会卡住
- **全都可配**：20 个互斥槽位（装扮 + 表情），每个槽位一张可增删、带权重的条目表，
  条目之间还能配「同时 / 前提」关系；会话相位是同一套池子机制

## 安装

### 在 DSH 的「插件」页里装（不用命令行，推荐）

1. 侧栏点「**插件**」；
2. 点「**添加插件**」，在包名框里输入 `dsh-pet-live2d`，回车或点「安装」
   （输入框下面可展开「插件安装引导和示例」；没手动指定安装源时，Host 会先探测官方源与
   国内镜像哪个快，再从那一个装）；
3. 装完点「**立即启用**」—— 只关掉对话框的话，它会是"已安装但关闭"，插件不会被加载；
4. **重启一次 `dsh web`**：插件在启动时加载，客户端 bundle 也不做热重载
   （启用了 HMR 的 profile 会自己重组，重启最稳妥）。
```

</details>

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/index.js:391-570](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/lib/index.js#L391-L570)

扫描 pet.json、模型资源和动作/表情元数据。

<details>
<summary>查看原文（180行）</summary>

```text
export function scanPet(dir, id) {
  const manifestFile = join(dir, 'pet.json')
  if (!existsSync(manifestFile)) return undefined
  const manifest = readJson(manifestFile)
  if (manifest === undefined || typeof manifest !== 'object' || manifest === null) return undefined
  if (manifest.renderer !== 'live2d') return undefined
  const block = manifest.live2d
  if (typeof block !== 'object' || block === null) return undefined
  const modelPath = safeRel(block.model)
  if (modelPath === undefined || !modelPath.endsWith('.model3.json')) return undefined
  const modelFile = join(dir, modelPath)
  if (!existsSync(modelFile)) return undefined
  const model3 = readJson(modelFile)
  if (model3 === undefined) return undefined
  const closure = modelClosure(model3)
  if (closure.size === 0) return undefined
  // The model descriptor itself rides the same route: the browser fetches it
  // first, then every file it names, so it belongs in the servable set.
  closure.add(modelPath)

  // Labels/categories are optional host-only metadata shipped beside the
  // manifest ('catalog.json'); the authoritative motion/expression lists
  // always come from the model itself, so a pet without one still lists
  // everything, just with the model's own names.
  const labels = readJson(join(dir, 'catalog.json')) ?? {}
  const labelFor = (kind, key) => {
    const list = labels[kind]
    if (!Array.isArray(list)) return undefined
    const hit = list.find((entry) => entry !== null && typeof entry === 'object' && entry.key === key)
    return hit === undefined ? undefined : hit
  }

  // Every motion entry carries its own duration and loop flag, read from the
  // motion3.json the model references. The browser half needs both: the
  // engine refuses to restart a still-active group+index, and a motion
  // flagged Loop never emits motionFinish — so playback has to be driven by
  // the model's own timing instead of by that event alone.
  const motions = []
  const motionGroups = model3.FileReferences?.Motions
  if (typeof motionGroups === 'object' && motionGroups !== null) {
    for (const [group, list] of Object.entries(motionGroups)) {
      if (!Array.isArray(list) || list.length === 0) continue
      const meta = labelFor('motions', group)
      const items = list.map((entry, index) => {
        const file = typeof entry === 'object' && entry !== null ? safeRel(entry.File) : undefined
        const motionMeta = file === undefined ? undefined : readJson(join(dir, file))
        const rawDuration = motionMeta?.Meta?.Duration
        // Every parameter the motion writes. The browser half needs this to
        // clean up after a one-shot action: a motion such as 吹泡泡糖 drives
        // its own mouth/pose parameters that the idle loop does NOT drive, so
        // once the motion stops its last written value stays on the model
        // forever unless something puts it back ("泡泡吹完嘴没还原").
        const params = []
        const curves = motionMeta?.Curves
        if (Array.isArray(curves)) {
          for (const curve of curves) {
            if (curve?.Target === 'Parameter' && typeof curve.Id === 'string' && curve.Id !== '') {
              params.push(curve.Id)
            }
          }
        }
        return {
          index,
          duration: typeof rawDuration === 'number' && rawDuration > 0 ? Math.round(rawDuration * 1000) : 0,
          loop: motionMeta?.Meta?.Loop === true,
          params,
        }
      })
      motions.push({
        group,
        count: items.length,
        label: meta?.label ?? group,
        category: meta?.category ?? 'action',
        items,
      })
    }
  }

  const expressions = []
  const expressionRefs = model3.FileReferences?.Expressions
  if (Array.isArray(expressionRefs)) {
    for (const reference of expressionRefs) {
      if (typeof reference !== 'object' || reference === null) continue
      const expressionName = typeof reference.Name === 'string' && reference.Name !== '' ? reference.Name : reference.File
      if (typeof expressionName !== 'string') continue
      const meta = labelFor('expressions', expressionName)
      // Ship each expression's own parameter writes.
      //
      // The engine's expression pipeline loads the file correctly (44
      // definitions, the right parameter count, weight 1) but never actually
      // moves a parameter, so nothing it plays is visible. The browser half
      // therefore applies these values itself through the same parameter
      // machinery it already uses for motions — which also gives the UI the
      // per-expression data it needs to work out which effects conflict.
      const file = safeRel(reference.File)
      const params = []
      if (file !== undefined) {
        let parsed
        try {
          parsed = readJson(join(dir, file))
        } catch {
          parsed = undefined
        }
        if (Array.isArray(parsed?.Parameters)) {
          for (const parameter of parsed.Parameters) {
            if (typeof parameter?.Id !== 'string' || parameter.Id === '') continue
            const value = Number(parameter.Value)
            if (!Number.isFinite(value)) continue
            const blend = parameter.Blend === 'Multiply' ? 'Multiply'
              : parameter.Blend === 'Overwrite' ? 'Overwrite' : 'Add'
            params.push({ id: parameter.Id, value, blend })
          }
        }
      }
      expressions.push({
        name: expressionName,
        label: meta?.label ?? expressionName,
        category: meta?.category ?? 'other',
        file: file ?? '',
        params,
      })
    }
  }

  return {
    id,
    displayName: typeof manifest.displayName === 'string' && manifest.displayName !== '' ? manifest.displayName : id,
    description: typeof manifest.description === 'string' ? manifest.description : '',
    scale: typeof block.scale === 'number' && block.scale > 0 && block.scale <= 10 ? block.scale : 1,
    // The manifest's phase -> motion-group / expression maps (same keys the
    // catalog uses), so the browser half can retarget session phases per pet.
    motionsByPhase: typeof block.motions === 'object' && block.motions !== null ? block.motions : {},
    // Per-motion playback policy (hold / reset / prepend) declared by the pet.
    // See the browser half's motion controller: a model whose motion3.json all
    // say "Loop": true cannot express "play once and hold the pose" or "clean
    // up the mouth afterwards" on its own, so the pet says it here.
    motionOptions: typeof block.motionOptions === 'object' && block.motionOptions !== null ? block.motionOptions : {},
    expressionsByPhase: typeof block.expressions === 'object' && block.expressions !== null ? block.expressions : {},
    // Mutually exclusive dress-up slots. Several of the model's expressions are
    // switches for the same thing (three pairs of glasses, three stickers), so
    // the pet declares which may not be worn together; the browser half turns
    // that into a one-choice-per-slot panel.
    expressionSlots: normaliseSlots(block.expressionSlots),
    // Session phase -> a whole LOOK expressed in slot vocabulary
    // ({ whale: "头顶鲸", lhand: "画笔" }), so a phase drives several slots at
    // once instead of a single expression.
    looksByPhase: typeof block.looksByPhase === 'object' && block.looksByPhase !== null ? block.looksByPhase : {},
    // motion group -> { slotId: [acceptable option labels] }. A motion whose
    // premise is missing (a selfie with no phone out, a spray with no whale)
    // must not play at all, from ANY path: the panel, a fidget or a phase.
    motionGuards: typeof block.motionGuards === 'object' && block.motionGuards !== null ? block.motionGuards : {},
    // 头部 / 尾巴部件（部件 id）：摸头、摸尾巴按这些部件的**真实几何**判定。
    // 空数组 = 没 cdi3 或没挑到，浏览器半区退回旧行为。
    headParts: readPartsMatching(dir, modelPath, HEAD_PART_NAME_HINTS),
    tailParts: readPartsMatching(dir, modelPath, TAIL_PART_NAME_HINTS),
    // 部件 id → 中文名（诊断用，见客户端 drawableTable()）。
    partNames: readPartNames(dir, modelPath),
    // 台词：宠物自己的声音（问候 / 点击 / 摸头 / 摸尾巴 / 转晕 / 归位 / 每个相位）。
    // 用户能在设置里逐条改，改过的存浏览器；这里是**默认值**。
    lines: typeof block.lines === 'object' && block.lines !== null ? block.lines : {},
    // null 表示旧宠物没有声明提示音，浏览器半区才使用内置兜底。
    sounds: typeof block.sounds === 'object' && block.sounds !== null && !Array.isArray(block.sounds) ? block.sounds : null,
    // 互动反应候选（标签：动作的中文名或表情名）。摸头 / 摸尾巴 / 转晕各一组。
    patReactions: readReactionList(block.patReactions),
    tailReactions: readReactionList(block.tailReactions),
    spinReactions: readReactionList(block.spinReactions),
    // 摸鱼默认盯哪几个槽位。以前这六个是**写死在浏览器半区**的（"宠物自己的身子"），
    // 但宠物作者（和用户）会想改：这只宠物把「自拍」也放进了摸鱼池。写在这里之后，
    // "默认集合"也成了宠物自己声明的东西，用户加的槽位照样覆盖在上面。
    fidgetSlots: Array.isArray(block.fidgetSlots) ? block.fidgetSlots.filter((id) => typeof id === 'string') : [],
    // Motion groups that belong to the SLOT menu rather than the 动作 tab.
    // 掏出手机 and 吹泡泡糖 are slot choices now; listing them twice made the
    // same thing reachable two ways, and the tab copy could not hold a pose.
    hiddenMotions: Array.isArray(block.hiddenMotions) ? block.hiddenMotions.filter((m) => typeof m === 'string') : [],
    translate: {
      x: typeof block.translate?.x === 'number' ? block.translate.x : 0,
      y: typeof block.translate?.y === 'number' ? block.translate.y : 0,
    },
    dir,
    modelPath,
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:1195-1279](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/lib/index.js#L1195-L1279)

订阅 Agent/工具/批准等事件映射相位。

<details>
<summary>查看原文（85行）</summary>

```text
 * at runtime: an older host that lacks one simply keeps mirroring the others.
 */
export function attachActivityEvents(ctx, hub) {
  const on = (event, handler) => {
    try {
      ctx.on(event, handler)
    } catch {
      /* host without this event */
    }
  }
  // Waterfall events only continue if the handler resumes the chain, so a
  // throw here would silently break tool execution for the whole session.
  const onWaterfall = (event, handler) => {
    try {
      ctx.on(event, (...args) => {
        try {
          return handler(...args)
        } catch {
          // Never swallow the chain: hand control straight on.
          const next = args[args.length - 1]
          return typeof next === 'function' ? next() : undefined
        }
      })
    } catch {
      /* host without this event */
    }
  }
  on('agent/status', (payload) => {
    const status = payload?.status
    if (status === 'running') hub.set('thinking', '')
    else if (status === 'idle' && hub.phase !== 'done') hub.set('idle', '')
  })
  on('agent/turn-stopping', () => hub.celebrate())
  on('agent/error', () => hub.set('failed', ''))
  // approval/request is a waterfall event: it MUST resume the chain.
  on('approval/request', (_request, next) => {
    hub.set('waiting', '')
    return typeof next === 'function' ? next() : undefined
  })

  // Tool activity refines the generic 'thinking' phase while a turn runs.
  //
  // The obvious-looking event name for this is 'tool/call', but that is a
  // SESSION LOG event (a record appended to the transcript), not a cordis
  // lifecycle event — subscribing to it never fires, which is why the pet
  // appeared to ignore tool activity entirely. The live hooks are the
  // 'tools/*' waterfall events, which carry the ToolExecution itself.
  //
  // A turn usually runs MANY tools back to back, so reverting the instant one
  // returns would flap tool -> thinking -> tool several times a second, and each
  // transition restarts the pet's animation. The revert is therefore debounced:
  // it only happens once the tools actually stop arriving.
  let toolIdleTimer
  onWaterfall('tools/pre-execute', (exec, next) => {
    if (toolIdleTimer !== undefined) {
      clearTimeout(toolIdleTimer)
      toolIdleTimer = undefined
    }
    const name = exec?.name
    hub.set('tool', typeof name === 'string' ? name : '')
    return next()
  })
  onWaterfall('tools/post-execute', (_exec, _result, next) => {
    if (toolIdleTimer !== undefined) clearTimeout(toolIdleTimer)
    toolIdleTimer = setTimeout(() => {
      toolIdleTimer = undefined
      // Only step down if nothing else has taken over in the meantime.
      if (hub.phase === 'tool') hub.set('thinking', '')
    }, TOOL_IDLE_MS)
    return next()
  })

  // ---- DSH 0.1.7 里另外三个值得接的状态 --------------------------------------
  //
  // 事件词汇表在 0.1.7 里已经不小（`*.d.ts` 里声明了 100 个可订阅事件），但只有一部分
  // 能翻译成"宠物该演什么"。挑的标准是**它填的是不是一个真实的空档**：
  //
  //   asking  ← user-questions/request：以前"在等你回答问题"这段时间宠物还在演"干活"，
  //             看着像它没停过 ✗ —— 这是最大的一个空档；
  //   helper  ← subagent/start|end：子代理是**长活**（几分钟），和一次普通工具调用
  //             混在一起看不出区别；
  //   queued  ← agent/inbox/inserted：你发的话在它忙的时候插进来，现在至少给个"收到"。
  //
  // 没接的（评估过，不值得）：`fs/write-intent` / `edit-intent` —— 宠物在 tool 相位已经
  // 演「写本本」了，再拆一个 editing 和它重复；`workflow/*` —— 工作流本身是工具调用，
```

</details>

#### 缺口

- 未在目标 DSH Web 或桌面层渲染模型。
  **影响**：不能确认动画、交互区域、性能或提示实际效果。
  **进一步探讨**：在目标桌面/Web 平台用真实会话事件及低配硬件做视觉与性能复核。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 随包宠物和用户改动如何共存？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

启动时 Host 将随包 pets 复制到 DSH_HOME/pets；若已有同名目标，它只对 pet.json 内容哈希与记录/历史指纹比较，判为“原版”就对整个目录 cpSync 递归覆盖。若用户修改的是 pet.json，通常会跳过；但若只修改纹理、动作、表达、音频或其他随包文件而不改 pet.json，哈希仍匹配，升级时同名资源可能被覆盖。因此 README 中“你自己改过的那份不会被覆盖/改过就一个字都不碰”的范围超出了代码保护边界。源码注释也明确 cpSync 对随包同名文件逐文件覆盖，额外文件才留存。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/lib/index.js:653-760](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/lib/index.js#L653-L760)

只哈希 manifest 并在通过后递归 cpSync 整目录。

<details>
<summary>查看原文（108行）</summary>

```text
function isPristineBundledManifest(petId, manifestPath, fingerprints) {
  let hash
  try {
    hash = sha256(readFileSync(manifestPath))
  } catch {
    return false
  }
  return (fingerprints[petId] ?? []).includes(hash)
}

/**
 * 把随包宠物装进用户的宠物目录，并在**确实是我们装的那份**过期时更新它。
 *
 * 以前宠物是仓库里单独一份，装插件的人还得自己再拷一次 —— 从插件市场装完
 * 「看不见宠物」就是这么来的（插件包里有代码，没有模型）。
 *
 * 为什么模型能随包、Cubism Core 不能：模型是 CC BY-NC-SA 4.0，且 Live2D 作者
 * 已明确授权本项目转载与开源（见 pets/ds-whale-girl/LICENSE）；Core 是 Live2D Inc.
 * 的专有软件，只允许从官方渠道取，所以它走 CDN 兜底那条路。
 *
 * **升级这一半是补上的**（原来只有"目标不存在才拷"）：插件目录会随
 * `dsh plugin add` / npm 更新，用户的宠物目录不会 —— 于是宠物**自己的默认值
 * 永远停在装它的那一天**。25c4d285 往 pet.json 里加的那批（台词 / 互动反应候选 /
 * 摸鱼槽位 / 新增的三个相位）就这么一直没到过老用户的桌面，症状是"互动只有台词
 * 不演反应、相位不弹台词、装扮少三个槽位"，而且**看起来完全像插件的 bug**。
 *
 * 三条判定，缺一条都会变成"静默覆盖用户数据"：
 *   1. 目标不存在 → 装一份（并把版本与内容指纹记进 `pets/.synced.json`）；
 *   2. 目标就是我们上次装下去的那一份（**内容指纹**对得上）→ 整份更新；
 *   3. 用户动过（指纹对不上）→ **一个字都不碰**。
 *
 * 第 2 条在冷启动时（记录出现之前装的副本）靠 `BUNDLED_PET_HASHES` 认人：
 * 内容与历史上任何一次随包分发**逐字节相同**才升级。改过名字/槽位/任何东西的副本
 * 哈希必然不同，所以"用户自己改过的宠物永远优先，绝不覆盖"这条没有被削弱。
 */
export function installBundledPets(options = {}) {
  const bundled = join(pluginRoot(), 'pets')
  if (!existsSync(bundled)) return
  // 冷启动指纹表可以被注入：测试要造一份"我们以前发过的旧副本"，但测试**不能**
  // 依赖生产表里的具体哈希（那样改一次表就得改测试，而且改错了也没人发现）。
  const fingerprints = options.fingerprints ?? BUNDLED_PET_HASHES
  let names = []
  try {
    names = readdirSync(bundled).filter((entry) => !entry.startsWith('.'))
  } catch {
    return
  }
  const record = readSyncRecord()
  const notes = []
  let dirty = false
  for (const name of names) {
    const source = join(bundled, name)
    const target = join(petsRoot(), name)
    try {
      if (!statSync(source).isDirectory()) continue
      const manifestPath = join(source, 'pet.json')
      if (!existsSync(manifestPath)) continue
      const version = String(readJson(manifestPath)?.version ?? '')
      const targetManifest = join(target, 'pet.json')

      if (!existsSync(target)) {
        mkdirSync(dirname(target), { recursive: true })
        cpSync(source, target, { recursive: true })
        record[name] = { version, hash: sha256(readFileSync(targetManifest)) }
        dirty = true
        continue
      }

      const synced = record[name]
      const same = existsSync(targetManifest) ? sha256(readFileSync(targetManifest)) : undefined
      const ours = (synced !== undefined && synced.hash === same)
        || isPristineBundledManifest(name, targetManifest, fingerprints)
      if (!ours) {
        // 用户自己改过：不动它。**要说出来** —— 沉默地不升级，用户看到的是
        // "插件更新了但没有任何变化"，比报错更难查。
        if (compareVersions(version, readJson(targetManifest)?.version) > 0) {
          notes.push(name + '：宠物目录里这份被改过，跳过更新（随包版本 ' + version
            + '，本地 ' + String(readJson(targetManifest)?.version ?? '?') + '）')
        }
        continue
      }
      // **升级与否只看内容**，不看版本号：版本号是宠物自己声明的，随包那份在同一个
      // 版本号下改过（补默认值就是这么发生的），只比版本号会让这次修订永远发不出去。
      // 反过来，"版本相同 + 内容相同"在这里就短路了，不会做无谓的整份重写。
      const bundledHash = sha256(readFileSync(manifestPath))
      if (same === bundledHash) continue

      // cpSync 是逐文件覆盖 —— 用户额外放进去的文件（自己的贴图、备注）不在随包
      // 那份里，所以留得住。
      // 「原先」那个版本号要**在覆盖之前**读：覆盖之后再读只会读到新的，日志就成了
      // "更新到 1.1.0（原先 1.1.0）"（第一次跑就写成了这样）。
      const was = String(readJson(targetManifest)?.version ?? '?')
      cpSync(source, target, { recursive: true })
      record[name] = { version, hash: bundledHash }
      dirty = true
      notes.push(name + '：宠物默认值更新到 ' + version + '（原先 ' + was + '）')
    } catch {
      /* 只读文件系统之类：让用户自己拷，别让整个目录扫描失败 */
    }
  }
  if (dirty) {
    try {
      writeSyncRecord(record)
    } catch {
      /* 记录写不进去只影响"下次少一次判定"，不影响这次已经装好的宠物 */
    }
  }
  if (notes.length > 0 && options.quiet !== true) {
```

</details>

**依据 2 · 作者声明**：[dsh-live2d-pet/README.md:4-11](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/README.md#L4-L11)

作者称自改宠物不会被覆盖。

```text
点她会害羞、还会跟着会话状态换动作的桌宠。

自带 **DS鲸鱼娘**（8 组动作 + 44 个表情/道具），开箱即用。

> **宠物会跟着插件一起更新**：随包的那只（以及它的默认设置：台词、互动反应、
> 会话相位、摸鱼槽位）在插件升级时**自动同步**到 `%DSH_HOME%\pets\ds-whale-girl\`。
> 你自己改过的那份**不会被覆盖**（判定是内容指纹，改过就一个字都不碰），
> 想拿回随包版本就把目录删掉、重启 `dsh web`，它会重新装一份。更新日志见 [CHANGELOG.md](CHANGELOG.md)。
```

#### 缺口

- 未用改纹理不改 pet.json 的目录做升级演练。
  **影响**：真实覆盖范围取决于更新包中同名文件及安装时机。
  **进一步探讨**：在副本中仅改 texture/motion 文件，升级并逐字节对照与回滚。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 专有运行时和本地 API 的安全/可靠性边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Cubism Core 没随包提供；缺本地缓存时 runtime 路由从 Live2D 官方 CDN fetch，检查长度和包含 Live2DCubismCore 字串后缓存并发给浏览器，没有版本或密码学哈希固定，返回的版本变化或传输中内容差异无法从源码锁定。模型资产路由按声明闭包和 realpath containment 控制路径。目录/设置/显示层等路由限制回环，但 layer/settings 的 POST 没有 Origin、Host 或 Content-Type 检查，也没有 body 大小上限；sound POST 才有本机 Host、Origin、JSON 和大小限制。跨站网页能否触发取决于浏览器与本地网络政策，不能在本轮确认；保护层不一致是可核的。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/lib/index.js:994-1074](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/lib/index.js#L994-L1074)

Core 缺失时 CDN 取回与弱内容检查/缓存。

<details>
<summary>查看原文（81行）</summary>

```text
async function fetchCoreFromCdn(response, cachePath) {
  try {
    const upstream = await fetch(CORE_CDN, { redirect: 'follow' })
    if (!upstream.ok) throw new Error('HTTP ' + upstream.status)
    const bytes = Buffer.from(await upstream.arrayBuffer())
    // 拿回来的必须真是一份 JS：否则多半是被网关/登录页替换了。
    if (bytes.length < 10000 || !bytes.includes('Live2DCubismCore')) {
      throw new Error('unexpected payload: ' + bytes.length + ' bytes')
    }
    try {
      mkdirSync(dirname(cachePath), { recursive: true })
      writeFileSync(cachePath, bytes)
    } catch {
      /* 缓存写不进去不影响这一次：直接把它发出去 */
    }
    response.writeHead(200, {
      'content-type': 'text/javascript; charset=utf-8',
      'content-length': String(bytes.length),
      'cache-control': 'public, max-age=86400',
      'x-live2d-core-source': 'cdn',
    })
    response.end(bytes)
  } catch (error) {
    sendJson(response, 502, {
      ok: false,
      error: 'cubism-core-unavailable',
      detail: String(error?.message ?? error),
      hint: 'Cubism Core 是 Live2D 的专有运行时，本插件不内置。可以让这台机器能访问 '
        + CORE_CDN + '，或自行下载后放到 ' + join(runtimeDir(), 'live2dcubismcore.min.js'),
    })
  }
}

/** The runtime route (user-supplied Cubism Core + plugin vendor bundle). */
function runtimeRoute() {
  const vendorBase = join(pluginRoot(), 'lib')
  const coreBase = runtimeDir()
  return {
    kind: 'prefix',
    path: API + '/runtime',
    handler: (request, response) => {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405)
        response.end()
        return
      }
      let pathname
      try {
        pathname = new URL(request.url ?? '/', 'http://pet.local').pathname
      } catch {
        response.writeHead(400)
        response.end()
        return
      }
      const segments = segmentsAfter(pathname, API + '/runtime')
      if (segments === undefined || segments.length !== 1) {
        response.writeHead(404)
        response.end()
        return
      }
      // An exact-name allow-list: a segment carrying a separator never matches.
      const runtimeName = segments[0]
      let base
      if (runtimeName === 'live2dcubismcore.min.js') base = coreBase
      else if (runtimeName === 'live2d-vendor.js') base = vendorBase
      else {
        response.writeHead(404)
        response.end()
        return
      }
      const file = join(base, runtimeName)
      if (!existsSync(file)) {
        // Cubism Core 走官方 CDN 兜底：用户不用再自己找文件。
        if (runtimeName === 'live2dcubismcore.min.js') {
          void fetchCoreFromCdn(response, file)
          return
        }
        sendJson(response, 404, { ok: false, error: 'runtime-file-missing', file: runtimeName })
        return
      }
      serveFile(request, response, base, file, CAP_RUNTIME)
```

</details>

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/index.js:1371-1402](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/lib/index.js#L1371-L1402)

layer POST 仅回环、JSON parse，可触发下载桌面端。

<details>
<summary>查看原文（32行）</summary>

```text
function layerRoute(display) {
  return {
    kind: 'exact',
    path: API + '/layer',
    handler: async (request, response) => {
      if (!loopbackOnly(request)) {
        response.writeHead(403)
        response.end()
        return
      }
      if (request.method === 'POST') {
        let body = ''
        try {
          for await (const chunk of request) body += chunk
          const parsed = JSON.parse(body === '' ? '{}' : body)
          // `{action:"download-desktop"}`：把平台子包拉下来。**先回话、后台下** ——
          // 让这个请求等 5MB 下完的话，页面每秒的轮询会被堵住，观感是"卡住了"。
          if (parsed.action === 'download-desktop') {
            const started = display.startDownload()
            sendJson(response, 200, { ok: true, download: started, ...display.reconcile(), binary: display.binaryInfo() })
            return
          }
          display.setMode(parsed.mode)
        } catch {
          sendJson(response, 400, { ok: false, error: 'bad-body' })
          return
        }
      } else if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { allow: 'GET, HEAD, POST' })
        response.end()
        return
      }
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:1439-1474](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/lib/index.js#L1439-L1474)

settings POST 仅回环并直接写设置。

<details>
<summary>查看原文（36行）</summary>

```text
function settingsRoute(home) {
  return {
    kind: 'exact',
    path: API + '/settings',
    handler: async (request, response) => {
      if (!loopbackOnly(request)) {
        response.writeHead(403)
        response.end()
        return
      }
      if (request.method === 'POST') {
        let body = ''
        try {
          for await (const chunk of request) body += chunk
          const parsed = JSON.parse(body === '' ? '{}' : body)
          const written = writeSettings(home, parsed)
          if (written === null) {
            sendJson(response, 500, { ok: false, error: 'write-failed' })
            return
          }
          sendJson(response, 200, { ok: true, ...written })
          return
        } catch {
          sendJson(response, 400, { ok: false, error: 'bad-body' })
          return
        }
      }
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { allow: 'GET, HEAD, POST' })
        response.end()
        return
      }
      sendJson(response, 200, { ok: true, ...readSettings(home) })
    },
  }
}
```

</details>

**依据 4 · 源码核查**：[dsh-live2d-pet/lib/index.js:1477-1528](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/lib/index.js#L1477-L1528)

sound POST 附加 Host/Origin/Content-Type/尺寸校验。

<details>
<summary>查看原文（52行）</summary>

```text
function trustedSoundHost(request) {
  const port = request.socket?.localPort
  const host = request.headers.host?.toLowerCase()
  return Number.isInteger(port) && [
    `127.0.0.1:${port}`, `localhost:${port}`, `[::1]:${port}`,
  ].includes(host)
}

// 音频接口的 pet id 必须来自当前目录；音频文件本身永不进入宠物目录。
function soundRoute(home) {
  return {
    kind: 'prefix',
    path: API + '/sound',
    handler: async (request, response) => {
      const fail = (status, error) => sendJson(response, status, { ok: false, error })
      if (!loopbackOnly(request)) return fail(403, 'forbidden')
      let parts
      try {
        parts = segmentsAfter(new URL(request.url ?? '/', 'http://pet.local').pathname, API + '/sound')?.map(decodeURIComponent)
      } catch { return fail(400, 'invalid-path') }
      if (!parts || (parts.length !== 1 && parts.length !== 2)
        || !/^[A-Za-z0-9_-]+$/.test(parts[0])
        || (parts.length === 2 && !SOUND_PHASES.includes(parts[1]))) return fail(404, 'not-found')
      const [id, phase] = parts
      if (!buildCatalog().some((pet) => pet.id === id)) return fail(404, 'not-found')
      if (request.method === 'POST') {
        if (phase === undefined) return fail(405, 'method-not-allowed')
        if (!trustedSoundHost(request)) return fail(403, 'untrusted-host')
        // 浏览器的跨站请求不能更改本地文件；代理端用自己的 Host 转发。
        const origin = request.headers.origin
        if (typeof origin === 'string' && origin !== `http://${request.headers.host}` && origin !== `https://${request.headers.host}`) return fail(403, 'cross-origin')
        if (!/^application\/json(?:\s*;|$)/i.test(request.headers['content-type'] ?? '')) return fail(415, 'json-required')
        let size = 0
        const chunks = []
        try {
          for await (const chunk of request) {
            size += chunk.length
            if (size > MAX_SOUND_BODY) return fail(413, 'body-too-large')
            chunks.push(chunk)
          }
        } catch { return fail(400, 'bad-body') }
        let parsed
        try { parsed = JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { return fail(400, 'bad-body') }
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return fail(400, 'bad-body')
        try {
          if (parsed.action === 'reset' && Object.keys(parsed).length === 1) resetSound(home, id, phase)
          else if (Object.keys(parsed).length === 1 && Object.hasOwn(parsed, 'base64')) {
            const bytes = decodeSound(parsed.base64)
            if (!bytes) return fail(400, 'invalid-audio')
            writeSound(home, id, phase, bytes)
          } else return fail(400, 'bad-body')
        } catch { return fail(500, 'write-failed') }
```

</details>

#### 缺口

- 未验证实际 Core CDN 内容/版本和浏览器跨站对 loopback 的访问策略。
  **影响**：无法断言现实中的供应链或 CSRF 事件。
  **进一步探讨**：固定 Core 版本/校验哈希，隔离浏览器验证跨站 POST，核大 body 的资源耗用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用前怎样验证和保护用户宠物？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

适合愿意安装 Live2D 模型与外部 Core 的个人 Web/桌面用户，先备份 DSH_HOME/pets 中自定义资源，再用非生产副本测试升级、外观和多窗口显示。模型与 Core 许可需分别核查：随包模型的 CC BY-NC-SA 声明来自包内 LICENSE，Core 是专有运行时；本轮未做法律结论。建议升级按整目录资源清单而非单 pet.json 判自改，Core 固定版本/校验值，所有本地写路由统一来源与 body 上限。对用户价值应测提醒命中、性能与误干扰；桌宠视觉偏好本身主观。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-live2d-pet/README.md:55-101](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/README.md#L55-L101)

作者说明 Core、包内模型和安装前置。

<details>
<summary>查看原文（47行）</summary>

```text

> **装到哪个 profile？** 取决于你在哪里用它：
>
> - 浏览器里跑的 `dsh web` ⇒ **`--profile web`**（上面几条都是这个）；
> - **DeepSeek Harness 官方桌面客户端** ⇒ 它用的是 **`--profile desktop`**，例如
>   `dsh plugin --profile desktop add dsh-pet-live2d`。
>
> 装完**重启一次**（插件在启动时加载，客户端 bundle 也不做热重载）。

### Cubism Core：不用手动装

`live2dcubismcore.min.js` 是 Live2D 株式会社的**专有运行时**，不能随插件分发 —— 但**你也不
用自己去找**：插件第一次用到它时，宿主半区会去
[Live2D 官方 CDN](https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js) 取一份
（校验过再发出去），并缓存到 `%DSH_HOME%\pets\.runtime\live2dcubismcore.min.js`，之后离线也能用。

只有当这台机器**访问不了外网**时，才需要手动下载
[Cubism SDK for Web](https://www.live2d.com/sdk/cubism/)、把 `Core/live2dcubismcore.min.js`
放到上面那个路径。

### 宠物：随包自带

插件包里就带着一只可用的宠物（`pets/ds-whale-girl/`，CC BY-NC-SA 4.0）。**第一次运行时
宿主半区会把它复制进 `%DSH_HOME%\pets\`**，所以装完插件、重启 `dsh web` 就能看见。
升级时原封不动的随包宠物会同步新版默认值（包括提示音）；你自己改过的宠物目录优先，不会被覆盖。

## 怎么用

- **右键点宠物** 呼出面板：「动作」「装扮」两个页签，底部是大小滑杆和「归位」。
  平时画面上没有常驻 UI。
- **改配置** 两个入口：**DSH 设置页 → 桌宠**（完整设置），或**侧栏「插件」→ 本插件**（常用开关）。

## 设置说明

### 官方「插件」页上的那一节

侧栏点「插件」，「已安装」里那张带图标的卡片就是本插件。点进详情，描述与插件行之间是它
自己的配置区：

- **常用开关**：气泡、会话提示音、摸头 / 摸尾巴 / 转圈、跨启动记住装扮；
- **四根滑杆**：注视满偏、收回倍数、静置多久开始摸鱼、提示音音量；
- **显示位置**：自动 / 页面内 / 桌面。

改的是与设置页**同一份**配置（`%DSH_HOME%\pet-settings.json`），两边随时一致。相位台词、
池子编辑器、装扮与台词文案仍在 **设置 → 桌宠** 里改 —— 那里才是完整设置。

### 摸鱼：每个槽位一张条目表
```

</details>

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/index.js:688-760](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/lib/index.js#L688-L760)

升级依据和递归拷贝。

<details>
<summary>查看原文（73行）</summary>

```text
export function installBundledPets(options = {}) {
  const bundled = join(pluginRoot(), 'pets')
  if (!existsSync(bundled)) return
  // 冷启动指纹表可以被注入：测试要造一份"我们以前发过的旧副本"，但测试**不能**
  // 依赖生产表里的具体哈希（那样改一次表就得改测试，而且改错了也没人发现）。
  const fingerprints = options.fingerprints ?? BUNDLED_PET_HASHES
  let names = []
  try {
    names = readdirSync(bundled).filter((entry) => !entry.startsWith('.'))
  } catch {
    return
  }
  const record = readSyncRecord()
  const notes = []
  let dirty = false
  for (const name of names) {
    const source = join(bundled, name)
    const target = join(petsRoot(), name)
    try {
      if (!statSync(source).isDirectory()) continue
      const manifestPath = join(source, 'pet.json')
      if (!existsSync(manifestPath)) continue
      const version = String(readJson(manifestPath)?.version ?? '')
      const targetManifest = join(target, 'pet.json')

      if (!existsSync(target)) {
        mkdirSync(dirname(target), { recursive: true })
        cpSync(source, target, { recursive: true })
        record[name] = { version, hash: sha256(readFileSync(targetManifest)) }
        dirty = true
        continue
      }

      const synced = record[name]
      const same = existsSync(targetManifest) ? sha256(readFileSync(targetManifest)) : undefined
      const ours = (synced !== undefined && synced.hash === same)
        || isPristineBundledManifest(name, targetManifest, fingerprints)
      if (!ours) {
        // 用户自己改过：不动它。**要说出来** —— 沉默地不升级，用户看到的是
        // "插件更新了但没有任何变化"，比报错更难查。
        if (compareVersions(version, readJson(targetManifest)?.version) > 0) {
          notes.push(name + '：宠物目录里这份被改过，跳过更新（随包版本 ' + version
            + '，本地 ' + String(readJson(targetManifest)?.version ?? '?') + '）')
        }
        continue
      }
      // **升级与否只看内容**，不看版本号：版本号是宠物自己声明的，随包那份在同一个
      // 版本号下改过（补默认值就是这么发生的），只比版本号会让这次修订永远发不出去。
      // 反过来，"版本相同 + 内容相同"在这里就短路了，不会做无谓的整份重写。
      const bundledHash = sha256(readFileSync(manifestPath))
      if (same === bundledHash) continue

      // cpSync 是逐文件覆盖 —— 用户额外放进去的文件（自己的贴图、备注）不在随包
      // 那份里，所以留得住。
      // 「原先」那个版本号要**在覆盖之前**读：覆盖之后再读只会读到新的，日志就成了
      // "更新到 1.1.0（原先 1.1.0）"（第一次跑就写成了这样）。
      const was = String(readJson(targetManifest)?.version ?? '?')
      cpSync(source, target, { recursive: true })
      record[name] = { version, hash: bundledHash }
      dirty = true
      notes.push(name + '：宠物默认值更新到 ' + version + '（原先 ' + was + '）')
    } catch {
      /* 只读文件系统之类：让用户自己拷，别让整个目录扫描失败 */
    }
  }
  if (dirty) {
    try {
      writeSyncRecord(record)
    } catch {
      /* 记录写不进去只影响"下次少一次判定"，不影响这次已经装好的宠物 */
    }
  }
  if (notes.length > 0 && options.quiet !== true) {
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:994-1074](https://github.com/A8Chann/dsh-pet-live2d/blob/2b48355bc9fb0c99cd5d32df64675b1900629e88/dsh-live2d-pet/lib/index.js#L994-L1074)

运行时 CDN 与缓存路径。

<details>
<summary>查看原文（81行）</summary>

```text
async function fetchCoreFromCdn(response, cachePath) {
  try {
    const upstream = await fetch(CORE_CDN, { redirect: 'follow' })
    if (!upstream.ok) throw new Error('HTTP ' + upstream.status)
    const bytes = Buffer.from(await upstream.arrayBuffer())
    // 拿回来的必须真是一份 JS：否则多半是被网关/登录页替换了。
    if (bytes.length < 10000 || !bytes.includes('Live2DCubismCore')) {
      throw new Error('unexpected payload: ' + bytes.length + ' bytes')
    }
    try {
      mkdirSync(dirname(cachePath), { recursive: true })
      writeFileSync(cachePath, bytes)
    } catch {
      /* 缓存写不进去不影响这一次：直接把它发出去 */
    }
    response.writeHead(200, {
      'content-type': 'text/javascript; charset=utf-8',
      'content-length': String(bytes.length),
      'cache-control': 'public, max-age=86400',
      'x-live2d-core-source': 'cdn',
    })
    response.end(bytes)
  } catch (error) {
    sendJson(response, 502, {
      ok: false,
      error: 'cubism-core-unavailable',
      detail: String(error?.message ?? error),
      hint: 'Cubism Core 是 Live2D 的专有运行时，本插件不内置。可以让这台机器能访问 '
        + CORE_CDN + '，或自行下载后放到 ' + join(runtimeDir(), 'live2dcubismcore.min.js'),
    })
  }
}

/** The runtime route (user-supplied Cubism Core + plugin vendor bundle). */
function runtimeRoute() {
  const vendorBase = join(pluginRoot(), 'lib')
  const coreBase = runtimeDir()
  return {
    kind: 'prefix',
    path: API + '/runtime',
    handler: (request, response) => {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405)
        response.end()
        return
      }
      let pathname
      try {
        pathname = new URL(request.url ?? '/', 'http://pet.local').pathname
      } catch {
        response.writeHead(400)
        response.end()
        return
      }
      const segments = segmentsAfter(pathname, API + '/runtime')
      if (segments === undefined || segments.length !== 1) {
        response.writeHead(404)
        response.end()
        return
      }
      // An exact-name allow-list: a segment carrying a separator never matches.
      const runtimeName = segments[0]
      let base
      if (runtimeName === 'live2dcubismcore.min.js') base = coreBase
      else if (runtimeName === 'live2d-vendor.js') base = vendorBase
      else {
        response.writeHead(404)
        response.end()
        return
      }
      const file = join(base, runtimeName)
      if (!existsSync(file)) {
        // Cubism Core 走官方 CDN 兜底：用户不用再自己找文件。
        if (runtimeName === 'live2dcubismcore.min.js') {
          void fetchCoreFromCdn(response, file)
          return
        }
        sendJson(response, 404, { ok: false, error: 'runtime-file-missing', file: runtimeName })
        return
      }
      serveFile(request, response, base, file, CAP_RUNTIME)
```

</details>

#### 缺口

- 缺少目标宿主/桌面平台视觉、性能与提醒收益测试。
  **影响**：无法判断不同设备上净价值。
  **进一步探讨**：在真实会话与双窗口情形测帧率、事件准确率、升级恢复和无障碍。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
