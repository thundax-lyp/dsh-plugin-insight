# dsh-blender

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[1441134](https://github.com/CheshireJCat/blender/tree/1441134b2281bc7c473e95af41fcc5cc6f0757b6)

<!-- BEGIN META -->
[![GitHub ★ 70](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=70&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/CheshireJCat/blender) [![npm 30d 5,667](https://img.shields.io/static/v1?label=npm+30d&message=5%2C667&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-blender) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-blender)
<!-- END META -->

> **功能**：在 DSH 中调用本地 Blender 建模、检查场景、渲染、导出模型并回读验证。

> **亮点**：插件把Blender操作、结构报告、导出回读和上游领域知识接到DSH，提供可调用的制作与诊断入口，这是宿主集成增量。回读虽独立启动进程，却没有显式清场或默认绑定新增对象，不能将其描述为空场景资产验收；建模算法和知识配方也不归为本插件原创。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：最影响当前采用的是报告验证的对象是否真来自目标资产。导入没有清场，回读默认验证整个场景，初始网格在特定条件下可能掩盖资产未增加网格；该后果是源码推断，未复现。passed又仅表示profile没有硬错误，导出不依赖该报告；加上任意Python本机权限，当前不足以凭报告信任完整交付。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 它为谁提供什么交付流程，相对手写 Blender 脚本新增什么？](#detail-section-11)
  - [Q02 · 文件和 Python 调用如何执行，限制 workspace 是否等于隔离？](#detail-section-12)
  - [Q03 · 场景与导出验证检查到哪里，能否替代视觉验收？](#detail-section-13)
  - [Q04 · 首次、持续、失败恢复与退出依赖谁，成本是否已证明更低？](#detail-section-14)
  - [Q05 · 从验证结果未强制约束导出能推导什么可证伪改进，当前应如何试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有 Blender 环境的 DSH 用户，将小型三维资产制作、场景检查和模型交接放进对话工具流程，保留可编辑 .blend、便携模型及预览证据。具体流程与合格结果见 [Q01](#research-q01)。

比较基线为自己编写 bpy 脚本、启动 Blender 后台进程并人工整理导出和检查结果，以及直接使用 Blender 界面。前者具备相同底层建模能力，本插件增加 DSH 接线和交接流程；偶发编辑用 GUI 可能更省接入投入。没有运行对照，不声称总体更快。上游知识模块的归属与增量见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 状态检查 | 查看 Blender 与分析解释器可用性 | 可用标记不等于模型任务已完成 |
| 场景与对象检查 | 获取结构、世界包围盒及求值网格信息 | 需要可读 .blend；结构信息不代替外观判断 |
| 模型导入 | 把支持格式转换为可编辑 .blend | 导入当前启动场景后保存，可能混有初始对象；新路径拒绝覆盖 |
| Python 建模 | 执行 bpy/bmesh 小段代码并保存 | 默认开启，仅可信代码；保留本地Python权限 |
| 无相机预览 | 自动临时相机和灯光生成观察图 | 不保存源场景；生成图仍须查看 |
| 单帧与代表帧渲染 | 留存静态/动画视觉证据 | 需要相机/帧等条件，耗时未测 |
| 模型导出 | 输出 GLB/glTF、FBX、OBJ、STL、USD、PLY | 需另行质检，不依赖历史检查结果 |
| 场景结构检查 | 输出目标 profile 的错误与警告 | passed 只表示没有规定硬错误 |
| 导出回读检查 | 在独立工厂启动进程导入并检查 | 默认验证全场景而非新增对象；不能据passed证明资产来源/质量 |
| Helper 发现与运行 | 按白名单和结构参数执行分析脚本 | 依赖按目录要求准备，维护类默认禁止 |
| 总编排和领域 Skill | 按任务加载配方与交接流程 | 继承上游知识，执行指引不是强制放行门 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH、Node >=22.12.0 及宿主工具/Schema包 | 启动必需 | 加载组合包、注册工具和 Skill | 按声明版本核对；本轮未验证其他宿主版本 |
| 本地 Blender 可执行文件、可写副本工作区 | 生产操作必需 | 启动后台进程并保存模型/图像 | 状态检查失败即停止，不声称产物已完成 |
| Python 3.10+、OpenCV、NumPy、Pillow、SciPy | 相应分析 Helper 必需 | 参考图、轮廓等分析 | 显式 setup 配置 .venv 或指定现成解释器；基础 Blender 工具不以此为统一前提 |
| 可信且审查过的 bpy 代码 | Python 建模必需 | 使用本地 Python 权限修改场景 | 不可信脚本不交给该入口；关闭 enablePython 缩小暴露能力 |
| 模型理解能力及能观察图片的人 | 交付质量条件 | 转换需求、识别结构报告之外的外观问题 | 不把结构通过当视觉合格，必要时回 Blender 手动修正 |

声明与作者兼容报告的版本边界见 [Q04](#research-q04)，路径防护范围见 [Q02](#research-q02)。

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户加载组合包、配置 Blender，需分析时另建 Python 环境 | blender_status 返回后端可用，否则先修依赖 |
| 小步制作 | Agent 检查源场景，在新 save_path 执行可信片段 | 新 .blend 和结构响应可读取；失败先核对部分产物 |
| 复查 | 用户/Agent 检查结构报告并观察预览 | 先核对新增对象与预期一致，不能以全场景passed证明目标资产合格 |
| 交接 | Agent 导出并调用导出回读，用户核对目标软件结果 | 当前建议暂缓正式交付，先独立确认导入对象归属和回读范围 |

每次新进程不保留 Python 内存状态，恢复依赖已保存 .blend。超时不是输出已撤销，具体分支见 [Q02](#research-q02)。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地软件、分析依赖下载和存储；金额未知 | 配置可执行路径、Python环境和审查小段代码；时长未知 | 只需基础工具可不配分析环境；没有安装实测 |
| 持续 | 每次 Blender 启动、渲染算力、模型调用及版本化产物存储；用量未知 | 确定目标、看图、解释报告及修正；工时未知 | 独立进程和版本化保存是机制，不等于总成本低 |
| 失败恢复 | 失败计算及重试占用继续计入；金额未知 | 查日志、核对部分输出、从保存文件局部继续 | 没有输出回滚，不能盲目重放整段建模 |
| 退出/迁移 | 保留模型与 .blend 的存储 | 转用 Blender GUI或原脚本并核对交付 | 便携格式保留可行退路，格式质量仍须验证 |

没有同任务全尝试支出及合格模型数，不计算单位成本。[Q04](#research-q04)

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 对话操作入口 | 注册、JSON驱动与后台进程接线可见 | 当前环境任务完成率 |
| 导出回读诊断 | 独立工厂启动进程导入并返回profile报告 | 默认全场景检查是否借用初始网格；未复现 |
| 导入保存 | 格式导入后保存整个场景并返回新增对象名单 | 初始对象混入对各格式真实资产的影响 |
| 交付流程指引 | Skill要求模型、源文件、预览和报告 | 报告来源正确性、用户遵循和总体收益 |

当前先观察来源范围问题，不把作者旧版报告升级为本轮验收。[Q03](#research-q03) [Q04](#research-q04)

> **思考**：最影响当前采用的是报告验证的对象是否真来自目标资产。导入没有清场，回读默认验证整个场景，初始网格在特定条件下可能掩盖资产未增加网格；该后果是源码推断，未复现。passed又仅表示profile没有硬错误，导出不依赖该报告；加上任意Python本机权限，当前不足以凭报告信任完整交付。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：插件把Blender操作、结构报告、导出回读和上游领域知识接到DSH，提供可调用的制作与诊断入口，这是宿主集成增量。回读虽独立启动进程，却没有显式清场或默认绑定新增对象，不能将其描述为空场景资产验收；建模算法和知识配方也不归为本插件原创。[Q01](#research-q01) [Q03](#research-q03)

路径与工具参数校验、独立进程结果协议、临时材料清理和Helper白名单值得定向借鉴；移植需定义执行权限与真实副作用。工程限制在于对象来源未形成验证契约：_import_asset只计算新增名单，_validate_scene却默认全场景；新进程重置用户配置不等同空对象集合。应先约束验证集合再考虑报告摘要绑定，不能把进程边界当资产语义隔离。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

最影响当前采用的是报告验证的对象是否真来自目标资产。导入没有清场，回读默认验证整个场景，初始网格在特定条件下可能掩盖资产未增加网格；该后果是源码推断，未复现。passed又仅表示profile没有硬错误，导出不依赖该报告；加上任意Python本机权限，当前不足以凭报告信任完整交付。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议先观察。已有DSH/Blender用户应先核对目标版本导入对象和启动对象的区分，在未证实验证针对实际目标资产前，不依赖passed承接正式交付或唯一模型；保留源.blend和便携模型，使用Blender GUI或已审查脚本独立检查。后续任何小范围实验仍只用副本、可信代码和新输出名；超时先核对产物，不盲目重放。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持工具/Skill接线、独立后台进程和局部结构诊断；已确认导入与验证未显式建立目标对象范围，污染及误通过后果为条件性推断、未复现。当前建议观察，先核查来源范围；改进假设不计入已有贡献。

- 已检查：作者 README、包清单、源码路径 index.js、README.zh-CN.md、package.json、cordis.patch.yml、scripts/dsh_blender_driver.py、scripts/dsh_blender_helper_driver.py、scripts/setup-analysis.js、lib/helper-catalog.js、docs/compatibility-v0.2.3.md、skills/create-3d-model/SKILL.md、skills/create-3d-model/references/upstream.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整 inventory 覆盖固定提交组件树；人工定向核查注册、路径、进程、Python驱动、校验、导出、Helper入口、总 Skill和依赖。未逐一审计全部领域配方和26个Helper算法，不把所有视觉度量视为已验证；Python等语言不进入JS/Markdown规模统计。
- 下一步：后续若安排副本实验，应先记录工厂启动对象，再测试无新增网格、仅非网格和正常网格导入；分别检查保存文件、imported_objects和validation.objects的归属。来源限定流程需降低借用初始网格的误通过且不造成更大误拒；无净改善则否定假设。本轮没有执行或复现。

**分析版本**

- **仓库**：[CheshireJCat/blender](https://github.com/CheshireJCat/blender)
- **版本号**：0.2.4（[固定提交 1441134](https://github.com/CheshireJCat/blender/tree/1441134b2281bc7c473e95af41fcc5cc6f0757b6)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

优先研究导入来源范围：记录并核对新增对象，验证只作用目标集合，拒绝空集合并绑定输入摘要/profile，避免把启动场景对象当目标资产。用无新增网格、仅非网格、正常网格对照误通过、误拒和人工核对量；若仍借用启动网格或正常资产损失抵消改善，应否定该方向。模型摘要和人工视觉交接应在来源范围明确后再研究，均未验证或实现。[Q05](#research-q05)

后续若安排副本实验，应先记录工厂启动对象，再测试无新增网格、仅非网格和正常网格导入；分别检查保存文件、imported_objects和validation.objects的归属。来源限定流程需降低借用初始网格的误通过且不造成更大误拒；无净改善则否定假设。本轮没有执行或复现。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 58 | 10562 | — | — | 61444 |
| .js | source | 6 | 1906 | 1824 | 3 | — |
| .js | test | 4 | 439 | 385 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/CheshireJCat/blender/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/CheshireJCat/blender/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/CheshireJCat/blender/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本的 dsh-blender 能否让已有 Blender 环境的 DSH 用户形成可复查的模型交付链，哪些权限、验证和失败状态会限制采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它为谁提供什么交付流程，相对手写 Blender 脚本新增什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向已有 Blender 环境、需要在 DSH 对话中反复制作或修改小型三维资产的人。合格交付不是一张漂亮截图，而是按目标用途导出的可移交模型、可编辑的版本化 .blend、可复看的预览和检查记录。总 Skill 将输入识别、检查既有场景、分阶段建模、结构与视觉核查、导出和交接写成一个流程；在原来手写 bpy 脚本、自己启动 Blender 和整理结果的办法上，插件承担工具注册、路径检查、进程调用及结构化结果回传，用户仍负责说明尺寸和用途并认可外观。

贡献归属必须分开。Blender 提供建模、渲染、格式转换能力；上游 cc-blender-skill 提供模块化建模知识和 Helper，不能把这些都归为本插件原创。本插件的可见增量是将这些材料注册到 DSH，给领域 Skill 加宿主工具映射，并把直接后台进程及检查结果装成可调用工具。这里的比较基线是同样使用 Blender 的脚本流程，不是声称已审计所有 DSH 原生功能或其他三维插件。

持续制作资产者可能值得评估这种交接集中化；偶尔导出已有模型的人用 Blender 界面就能完成任务，未必能摊薄宿主和分析环境配置负担。README 的示例和数量是作者说明，注册循环及工具接线支持存在这些机制，均不证明真实用户需求频率、专业模型质量或端到端节时。

#### 证据与依据

**依据 1 · 作者声明**：[skills/create-3d-model/SKILL.md:30-48](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/skills/create-3d-model/SKILL.md#L30-L48)

总流程先确定目标并检查既有场景，明确版本化保存和用户对象所有权。

<details>
<summary>查看原文（19行）</summary>

```text
## Follow the production workflow

### 1. Establish the target

- Classify the input as text-only, single-image, multiview or orthographic, wireframe or technical drawing, texture or template pack, or an existing 3D asset. Combine modalities when the user supplies more than one.
- Extract the subject, intended use, style, dimensions, reference priority, primary delivery format, target runtime, animation requirements, and quality bar.
- Inspect every provided image before modeling. Record views, landmarks, silhouettes, part counts, material regions, uncertainties, and contradictions.
- For a single image, state depth, scale, occlusion, and unseen-surface assumptions. For multiple images, register their view relationship before adding depth.
- Use reversible defaults when missing information does not materially change the result. Ask one focused question only when a choice changes geometry, topology, animation, source-of-truth policy, or delivery.
- Read [references/core/common-object-dimensions.md](references/core/common-object-dimensions.md) for common subjects; prefer user-provided or authoritative dimensions.

### 2. Inspect before mutating

- Inspect the scene before the first write. Inspect each object in scope with `blender_object_info` and obtain a camera-free `blender_preview` when image capture is needed.
- If the input is GLB/glTF, FBX, OBJ, STL, USD, PLY, or DAE, call `blender_import` and continue from its versioned `.blend` output.
- Treat existing objects, collections, materials, lights, cameras, worlds, actions, and files as user-owned.
- Do not clear the scene, reset the world, delete the default cube, or replace the camera merely because a recipe starts from a blank scene.
- Delete startup content only when the user requested a fresh scene and inspection proves it is unchanged startup content. Otherwise create a task-specific collection and leave unrelated data alone.
- Save a versioned checkpoint before broad or destructive work. Never overwrite the user's original `.blend` without explicit authorization.
```

</details>

**依据 2 · 作者声明**：[skills/create-3d-model/SKILL.md:68-86](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/skills/create-3d-model/SKILL.md#L68-L86)

交付契约要求结构检查、视觉证据、可移交模型与可编辑源文件，不能把预览替代模型。

<details>
<summary>查看原文（19行）</summary>

```text
### 5. Validate structure and appearance

- After each significant phase, verify names, transforms, dimensions, origins, hierarchy, modifiers, topology counts, normals, UVs, materials, actions, accidental duplicates, and file paths relevant to the task.
- Create and inspect a `blender_preview` image after blockout and final refinement. For look development, camera, lighting, render, texture, or animation work, inspect purposeful camera renders as well.
- After `blender_render`, call `read_image` on the saved PNG/JPEG and inspect the returned image. A successful tool call or non-empty image file is not visual validation.
- For animation, use `blender_render_frames`, generate a contact sheet with the `animation-contact-sheet` helper, inspect it, and load `animation-quality-gate`.
- For reference-locked work, use measurable masks, landmarks, overlays, bboxes, centroids, IoU/SSIM where appropriate, and multiview gates. A front-view match alone does not prove a 3D match.
- If no image can be inspected, report `structurally verified, visually unverified`.
- Identify the largest visible mismatch, change the smallest upstream cause, re-capture the same view, and compare before and after. Do not hide geometry errors with camera, lighting, or crop tricks.

### 6. Save and hand off

- Treat the transferable 3D model as the primary artifact. Use the user's requested format; when none is specified, export a single-file `.glb` and save a versioned `.blend` engineering source.
- Treat `.blend` as the editable project file, not the only proof that a 3D model was delivered. A preview is visual QA, not a substitute for the exported model.
- Let explicit 3D-printing, engine, CAD-interchange, render-only, animation-only, or existing-project targets override the default `.glb` contract.
- Write final artifacts to absolute paths in the active dsh workspace or another explicitly configured durable directory, never `/tmp` or an internal driver path.
- Verify every deliverable exists, is non-empty, and matches its requested format. Re-import or inspect the export when practical to catch missing geometry, textures, materials, axes, scale, or animation.
- Report created or changed objects, important dimensions and topology, modules used, validation evidence, and remaining limitations.
- End with an `Artifacts` section. Link each verified output with a descriptive Markdown label and its absolute local path. List the primary model first, the versioned `.blend` source second, and previews or additional exports after them. List each path once and never fabricate an artifact link.
```

</details>

**依据 3 · 源码核查**：[index.js:94-117](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/index.js#L94-L117)

总 Skill 与模块目录逐项注册到 ctx.skills，并追加 DSH 运行映射，说明集成增量有实际注册路径。

<details>
<summary>查看原文（24行）</summary>

```text
function registerSkills(ctx, config) {
  const top = readSkillDefinition(SKILL_PATH)
  ctx.skills.register({
    ...top,
    source: 'bundled',
    provider: 'dsh-blender',
    resourceBase: { kind: 'directory', path: SKILL_ROOT },
  })
  if (!config.registerModuleSkills) return
  const moduleDirectories = readdirSync(MODULE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
  for (const moduleName of moduleDirectories) {
    const moduleDirectory = join(MODULE_ROOT, moduleName)
    const definition = readSkillDefinition(join(moduleDirectory, 'SKILL.md'))
    ctx.skills.register({
      ...definition,
      content: `${MODULE_RUNTIME_PREAMBLE.replace('<this skill name>', definition.name)}\n\n${definition.content}`,
      source: 'bundled',
      provider: 'dsh-blender',
      resourceBase: { kind: 'directory', path: moduleDirectory },
    })
  }
```

</details>

**依据 4 · 作者声明**：[skills/create-3d-model/references/upstream.md:3-24](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/skills/create-3d-model/references/upstream.md#L3-L24)

作者明确上游来源及本次适配，支持贡献归属限定，不作为对上游全部实现的独立比较。

<details>
<summary>查看原文（22行）</summary>

```text
## Primary skill source

- Repository: https://github.com/RobLe3/cc-blender-skill
- Reviewed commit: `11016c9a5847897491dde935c346571bd7548e3d`
- Release: `1.3.0`
- Commit date: `2026-05-01`
- License: MIT; see `../UPSTREAM_LICENSE` from the skill root.

The upstream release contains 30 chain-loadable Claude Code skills led by `text-to-blender`. The intermediate Codex adaptation exposed the output-oriented `create-3d-model` orchestrator. This DeepSeek Harness adaptation registers that orchestrator and all 29 domain modules as independently loadable runtime skills, and exposes all 26 Python/Blender helpers through a workspace-scoped catalog and runner.

Validation render assets, trigger-eval datasets, development journals, changelogs, and repository-only documentation were not copied because they do not provide runtime capability. Module recipes, domain references, and executable helpers were retained.

## DeepSeek Harness adaptations

- Replace Claude/Codex-specific tool assumptions and the external BlenderMCP transport with 13 packaged tools for status, scene/object inspection, import, Python modeling, preview, still/frame rendering, export, scene/export validation, and helper discovery/execution.
- Register the complete 30-skill stack while preserving progressive loading and module-local resources.
- Rename the entry point around the normal deliverable rather than one input modality or the Blender implementation detail; support text, image, wireframe, multiview, texture/template, and existing-asset inputs.
- Treat a portable 3D model as the default primary artifact and `.blend` as its editable engineering source.
- Add explicit existing-scene protections, workspace-scoped paths, overwrite denial, versioned saves, durable artifacts, and `read_image` visual-evidence gates.
- Keep external asset and AI generation services disabled unless explicitly authorized.
- Prevent the quality-refinement module from editing skills, documentation, Git state, or remotes during ordinary Blender work.
- Preserve upstream English recipes and helper scripts instead of translating or condensing away domain behavior.
```

</details>

#### 缺口

- 没有同任务脚本流程与对话流程的交付率、人工时间及用户反馈对照。
  **影响**：无法确认集成步骤减少是否抵消模型调用和复核负担，因此不宣称增效。
  **进一步探讨**：以同一简单资产和同一 Blender/模型预算记录全尝试与人工复核，再比较合格交付。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件和 Python 调用如何执行，限制 workspace 是否等于隔离？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

workspace 限制是工具参数的路径防护，不是进程沙箱。Node 先从会话 cwd 确定工作区，检查词法路径，并对已有输入或最近存在的祖先解析真实路径，拒绝指向工作区外的符号链接。输出默认拒绝覆盖已有文件，之后才创建目录。blender_python 把通过检查的输入、save_path 和原始脚本写入临时 JSON，以独立 Blender 后台进程和禁用自动执行参数运行驱动，再读取结构化 JSON、检查退出码和输出文件；临时目录在 finally 中清理。版本化名称由调用者提供，并没有自动分配版本号。

驱动直接 compile/exec 所给 Python，且没有剥离内置模块能力。传入的 save_path 检查不能约束脚本自己打开别的文件、联网或启动进程；禁用 .blend 自动脚本也不能限制这段显式执行的代码。README 已把该权限解释为本地 Python 权限，因而这属于明确使用条件，而非从源码推断已发生越界。应只处理已审查、可信的脚本；关掉 enablePython 可以缩小入口，不能据此声称所有 Helper 都进入了沙箱。

取消或超时触发对直接子进程的 SIGTERM，二秒后仍未退出则尝试 SIGKILL，最终在 close 后拒绝调用。它没有文件事务、撤销或进程组终止逻辑，不能推断脚本自己派生的进程和已写文件一起回滚。脚本在保存前也可能产生副作用；失败后先核查输出并从保留的 .blend 继续，而不是把重试等同于第一次未执行。临时清理只针对内部 JSON 目录，不删除用户输出。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:120-169](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/index.js#L120-L169)

会话 cwd、词法边界和 realpath 检查约束工具暴露的输入输出路径，不实现 OS 权限隔离。

<details>
<summary>查看原文（50行）</summary>

```text
function sessionWorkspace(exec) {
  const cwd = exec?.agent?.session?.header?.cwd
  return resolve(typeof cwd === 'string' && cwd.trim() !== '' ? cwd : process.cwd())
}

function isWithin(root, target) {
  const rel = relative(root, target)
  return rel === '' || (!rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) && rel !== '..' && !isAbsolute(rel))
}

async function nearestExistingAncestor(target) {
  let candidate = target
  while (true) {
    try {
      await stat(candidate)
      return candidate
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
      const parent = dirname(candidate)
      if (parent === candidate) return candidate
      candidate = parent
    }
  }
}

async function resolveWorkspacePath(rawPath, exec, config, { mustExist = false, kind = 'path' } = {}) {
  if (typeof rawPath !== 'string' || rawPath.trim() === '') throw new Error(`${kind} must be a non-empty string`)
  const workspace = sessionWorkspace(exec)
  const target = resolve(isAbsolute(rawPath) ? rawPath : join(workspace, rawPath))
  if (!config.restrictToWorkspace) return target

  if (!isWithin(workspace, target)) {
    throw new Error(`${kind} must stay inside the dsh session workspace: ${workspace}`)
  }

  const workspaceReal = await realpath(workspace)
  if (mustExist) {
    const targetReal = await realpath(target).catch((error) => {
      if (error?.code === 'ENOENT') throw new Error(`${kind} does not exist: ${target}`)
      throw error
    })
    if (!isWithin(workspaceReal, targetReal)) throw new Error(`${kind} resolves outside the dsh session workspace`)
    return target
  }

  const ancestor = await nearestExistingAncestor(target)
  const ancestorReal = await realpath(ancestor)
  if (!isWithin(workspaceReal, ancestorReal)) throw new Error(`${kind} resolves through a path outside the dsh session workspace`)
  return target
}
```

</details>

**依据 2 · 源码核查**：[index.js:189-198](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/index.js#L189-L198)

默认拒绝覆盖，允许覆盖由参数显式控制，且目录在执行前可能已创建。

<details>
<summary>查看原文（10行）</summary>

```text
async function assertWritableTarget(path, allowOverwrite, label) {
  try {
    const info = await stat(path)
    if (!info.isFile()) throw new Error(`${label} exists and is not a regular file: ${path}`)
    if (!allowOverwrite) throw new Error(`${label} already exists; choose a versioned path or set allow_overwrite=true`)
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
  await mkdir(dirname(path), { recursive: true })
}
```

</details>

**依据 3 · 源码核查**：[index.js:421-484](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/index.js#L421-L484)

终止信号作用于 spawn 返回的直接 child，等待 close 后处理超时/取消，没有进程组及输出回滚。

<details>
<summary>查看原文（64行）</summary>

```text
function runProcess(command, args, { signal, timeoutMs, maxOutputChars, env }) {
  if (signal?.aborted) return Promise.reject(signal.reason ?? new Error('Blender call aborted'))
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true, env })
    let stdout = ''
    let stderr = ''
    let settled = false
    let timedOut = false
    let aborted = false
    let hardKillTimer

    const terminate = () => {
      if (child.exitCode !== null || child.killed) return
      child.kill('SIGTERM')
      hardKillTimer = setTimeout(() => {
        if (child.exitCode === null) child.kill('SIGKILL')
      }, 2000)
      hardKillTimer.unref()
    }

    const timer = setTimeout(() => {
      timedOut = true
      terminate()
    }, timeoutMs)
    timer.unref()

    const onAbort = () => {
      aborted = true
      terminate()
    }
    signal?.addEventListener('abort', onAbort, { once: true })

    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk) => {
      stdout = clip(stdout + chunk, maxOutputChars)
    })
    child.stderr.on('data', (chunk) => {
      stderr = clip(stderr + chunk, maxOutputChars)
    })
    child.once('error', (error) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      if (hardKillTimer !== undefined) clearTimeout(hardKillTimer)
      signal?.removeEventListener('abort', onAbort)
      rejectPromise(error)
    })
    child.once('close', (code, closeSignal) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      if (hardKillTimer !== undefined) clearTimeout(hardKillTimer)
      signal?.removeEventListener('abort', onAbort)
      if (aborted) {
        rejectPromise(signal?.reason ?? new Error('Blender call aborted'))
        return
      }
      if (timedOut) {
        rejectPromise(new Error(`Blender timed out after ${timeoutMs} ms`))
        return
      }
      resolvePromise({ code: code ?? 1, signal: closeSignal, stdout, stderr })
    })
```

</details>

**依据 4 · 源码核查**：[index.js:488-529](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/index.js#L488-L529)

每次准备临时载荷，启动后台 Blender、读取 driver result，finally 删除临时目录。

<details>
<summary>查看原文（42行）</summary>

```text
async function runBlender(config, exec, operation, payload, inputBlend) {
  const tempDir = await mkdtemp(join(tmpdir(), 'dsh-blender-'))
  try {
    const payloadPath = join(tempDir, 'payload.json')
    const resultPath = join(tempDir, 'result.json')
    await writeFile(payloadPath, JSON.stringify(payload), 'utf8')
    const args = inputBlend === undefined
      ? ['--background', '--factory-startup']
      : [inputBlend, '--background']
    args.push(
      '--disable-autoexec',
      '--python-exit-code', '1',
      '--python', DRIVER_PATH,
      '--',
      '--operation', operation,
      '--payload', payloadPath,
      '--result', resultPath,
    )

    const processResult = await runProcess(config.blenderExecutable, args, {
      signal: exec?.signal,
      timeoutMs: config.timeoutMs,
      maxOutputChars: config.maxOutputChars,
    })
    let driverResult
    try {
      driverResult = normalizeLosslessJson(JSON.parse(await readFile(resultPath, 'utf8')))
    } catch (error) {
      const diagnostics = clip(`${processResult.stdout}\n${processResult.stderr}`.trim(), config.maxOutputChars)
      throw new Error(`Blender produced no valid driver result (exit ${processResult.code}).\n${diagnostics}`, { cause: error })
    }
    if (processResult.code !== 0 || driverResult.ok !== true) {
      const message = driverResult.error ?? `Blender exited with code ${processResult.code}`
      const diagnostics = clip(`${driverResult.traceback ?? ''}\n${processResult.stdout}\n${processResult.stderr}`.trim(), config.maxOutputChars)
      throw new Error(`${message}${diagnostics === '' ? '' : `\n${diagnostics}`}`)
    }
    return {
      ...driverResult,
      log: clip(`${processResult.stdout}\n${processResult.stderr}`.trim(), config.maxOutputChars),
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true })
```

</details>

**依据 5 · 源码核查**：[scripts/dsh_blender_driver.py:195-214](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/scripts/dsh_blender_driver.py#L195-L214)

原始脚本被 compile/exec 后保存 .blend；参数检查不限制任意 Python 内部副作用。

<details>
<summary>查看原文（20行）</summary>

```text
def _execute(payload: dict[str, Any]) -> dict[str, Any]:
    namespace: dict[str, Any] = {
        "__name__": "__dsh_blender_script__",
        "bpy": bpy,
        "bmesh": bmesh,
        "mathutils": mathutils,
        "workspace": payload["workspace"],
        "input_path": payload.get("input_path", ""),
        "output_path": payload["output_path"],
        "dsh_result": {},
    }
    code = compile(payload["script"], "<dsh-blender-python>", "exec")
    exec(code, namespace, namespace)
    output = Path(payload["output_path"])
    output.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(output), check_existing=False)
    return {
        "scene": _scene_summary(),
        "script_result": _json_safe(namespace.get("dsh_result", {})),
    }
```

</details>

**依据 6 · 作者声明**：[README.zh-CN.md:123-131](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/README.zh-CN.md#L123-L131)

作者明确本地 Python 权限与可信代码条件，不能将路径检查包装为沙箱。

```text
## 安全边界

`blender_python` 与在 Blender 内运行本地 Python 具有相同权限。它仅应处理可信的建模代码；不要用它下载资源、访问凭据、安装包、启动无关进程或修改 Blender 全局偏好。插件默认：

- 禁用 `.blend` 内嵌脚本自动执行；
- 限制模型文件、渲染和导出路径到会话 workspace；
- 默认拒绝覆盖已有文件；
- 每次调用使用独立 Blender 后台进程；
- 完成后清理内部临时脚本和 JSON 文件。
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 场景与导出验证检查到哪里，能否替代视觉验收？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

结构验证可以提供局部结构诊断，不能替代视觉验收，也不是强制交付门。驱动按 general、web、3d-print、animation 四种目标检查。缺少请求对象、没有网格进入errors；3d-print把非流形边计为错误；animation检查action或NLA轨道。负缩放、游离顶点、web缺UV、general/web缺材质只是warnings。passed只等于没有errors，不保证比例、贴图、动画或外观正确。

导出回读会在独立的工厂启动进程中导入模型，但新进程不等于空场景。index.js只传--background --factory-startup；驱动_import_asset先记录现有对象名，再调用格式导入，计算新增名称，没有清场。validate_asset随后调用_validate_scene；未给object_names时检查场景全部对象，而不是只检查imported_objects。若启动场景中已有网格，导入器没有报错但本次资产未增加网格，已有网格就可能满足“有网格”条件；general/web的材质和UV缺失也只是警告，因此passed可能无法证明导入资产本身满足这些条件。这是源码控制流支持的条件性误通过风险，本轮未执行或复现；不能断言每种格式或当前环境必定触发。

同一导入函数在save=true时直接保存整个场景，所以初始对象若仍在，也可能进入导入后保存的.blend。imported_objects能帮助调用者识别新增对象，但函数本身没有拒绝新增列表为空，默认校验也未用这份名单限定范围。用户不应把返回的场景对象总数、存在网格或passed单独当作导入产物正确性的证明；要核对新增对象和输入预期，必要时在目标软件独立检查。显式object_names可以收窄检查范围，却需要正确列出真实导入对象，不自动建立来源证明。

此外，blender_export只调用格式导出并stat输出文件，不读取既往校验结果；检查失败仍可作为正常结构化结果返回。Skill要求导出前后校验，是流程指引而非代码强制放行。预览可临时增加相机/灯光并渲染且不保存源.blend；Helper调用受白名单参数约束，但本轮没有逐一验证全部算法。应把执行成功、局部结构诊断和最终资产验收分别看待。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:488-510](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/index.js#L488-L510)

无输入时只选择工厂启动参数，没有清空场景指令；独立进程不能等同空场景。

<details>
<summary>查看原文（23行）</summary>

```text
async function runBlender(config, exec, operation, payload, inputBlend) {
  const tempDir = await mkdtemp(join(tmpdir(), 'dsh-blender-'))
  try {
    const payloadPath = join(tempDir, 'payload.json')
    const resultPath = join(tempDir, 'result.json')
    await writeFile(payloadPath, JSON.stringify(payload), 'utf8')
    const args = inputBlend === undefined
      ? ['--background', '--factory-startup']
      : [inputBlend, '--background']
    args.push(
      '--disable-autoexec',
      '--python-exit-code', '1',
      '--python', DRIVER_PATH,
      '--',
      '--operation', operation,
      '--payload', payloadPath,
      '--result', resultPath,
    )

    const processResult = await runProcess(config.blenderExecutable, args, {
      signal: exec?.signal,
      timeoutMs: config.timeoutMs,
      maxOutputChars: config.maxOutputChars,
```

</details>

**依据 2 · 源码核查**：[scripts/dsh_blender_driver.py:364-396](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/scripts/dsh_blender_driver.py#L364-L396)

导入前记录现有对象，再调用格式导入并计算新增对象；没有清场或拒绝空新增名单，save分支保存整个场景。

<details>
<summary>查看原文（33行）</summary>

```text
def _import_asset_file(path: Path) -> None:
    suffix = path.suffix.lower()
    if suffix in {".glb", ".gltf"}:
        bpy.ops.import_scene.gltf(filepath=str(path))
    elif suffix == ".fbx":
        if hasattr(bpy.ops.wm, "fbx_import"):
            bpy.ops.wm.fbx_import(filepath=str(path))
        else:
            bpy.ops.import_scene.fbx(filepath=str(path))
    elif suffix == ".obj":
        bpy.ops.wm.obj_import(filepath=str(path))
    elif suffix == ".stl":
        bpy.ops.wm.stl_import(filepath=str(path))
    elif suffix in {".usd", ".usda", ".usdc"}:
        bpy.ops.wm.usd_import(filepath=str(path))
    elif suffix == ".ply":
        bpy.ops.wm.ply_import(filepath=str(path))
    elif suffix == ".dae":
        bpy.ops.wm.collada_import(filepath=str(path))
    else:
        raise ValueError(f"Unsupported import extension: {suffix}")


def _import_asset(payload: dict[str, Any], save: bool) -> dict[str, Any]:
    source = Path(payload["source_path"])
    before = set(bpy.data.objects.keys())
    _import_asset_file(source)
    imported = sorted(name for name in bpy.data.objects.keys() if name not in before)
    if save:
        output = Path(payload["output_path"])
        output.parent.mkdir(parents=True, exist_ok=True)
        bpy.ops.wm.save_as_mainfile(filepath=str(output), check_existing=False)
    return {"source_path": str(source), "imported_objects": imported, "scene": _scene_summary()}
```

</details>

**依据 3 · 源码核查**：[scripts/dsh_blender_driver.py:422-464](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/scripts/dsh_blender_driver.py#L422-L464)

未指定object_names时验证全部场景对象，有任意网格即可避免no-mesh错误，UV/材质可仅警告。

<details>
<summary>查看原文（43行）</summary>

```text
def _validate_scene(payload: dict[str, Any]) -> dict[str, Any]:
    profile = payload.get("profile", "general")
    requested = set(payload.get("object_names") or [])
    objects = [obj for obj in bpy.context.scene.objects if not requested or obj.name in requested]
    missing = sorted(requested - {obj.name for obj in objects})
    warnings: list[dict[str, Any]] = []
    errors: list[dict[str, Any]] = []
    rows = []
    for obj in sorted(objects, key=lambda item: item.name):
        row = _object_summary(obj)
        if any(component < 0 for component in obj.scale):
            warnings.append({"object": obj.name, "code": "negative-scale"})
        if obj.type == "MESH" and obj.data is not None:
            mesh = _mesh_validation(obj)
            row["validation"] = mesh
            if mesh["looseVertices"]:
                warnings.append({"object": obj.name, "code": "loose-vertices", "count": mesh["looseVertices"]})
            if profile == "3d-print" and mesh["nonManifoldEdges"]:
                errors.append({"object": obj.name, "code": "non-manifold", "count": mesh["nonManifoldEdges"]})
            if profile == "web" and not mesh["uvLayers"]:
                warnings.append({"object": obj.name, "code": "missing-uv"})
            if profile in {"general", "web"} and mesh["materialSlots"] == 0:
                warnings.append({"object": obj.name, "code": "missing-material"})
        rows.append(row)
    if missing:
        errors.append({"code": "missing-objects", "objects": missing})
    if not any(obj.type == "MESH" for obj in objects):
        errors.append({"code": "no-mesh-objects"})
    if profile == "animation":
        animated = any(
            obj.animation_data and (obj.animation_data.action or obj.animation_data.nla_tracks)
            for obj in objects
        )
        if not animated:
            errors.append({"code": "no-object-animation"})
    return {
        "profile": profile,
        "passed": not errors,
        "errors": errors,
        "warnings": warnings,
        "objects": rows,
        "scene": _scene_summary(),
    }
```

</details>

**依据 4 · 源码核查**：[scripts/dsh_blender_driver.py:516-535](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/scripts/dsh_blender_driver.py#L516-L535)

validate_asset导入后直接调用同一_validate_scene；没有用imported_objects自动限定验证范围。

<details>
<summary>查看原文（20行）</summary>

```text
        elif args.operation == "import":
            data = _import_asset(payload, True)
        elif args.operation == "export":
            data = _export(payload)
        elif args.operation == "validate_scene":
            data = _validate_scene(payload)
        else:
            imported = _import_asset(payload, False)
            data = {**imported, "validation": _validate_scene(payload)}
        result = {"ok": True, **data}
    except Exception as error:  # Blender must return diagnostics across the process boundary.
        result = {
            "ok": False,
            "error": f"{type(error).__name__}: {error}",
            "traceback": traceback.format_exc(),
        }
    result_path.parent.mkdir(parents=True, exist_ok=True)
    with open(result_path, "w", encoding="utf-8") as handle:
        json.dump(result, handle, ensure_ascii=False)
    return 0 if result.get("ok") else 1
```

</details>

**依据 5 · 源码核查**：[index.js:996-1009](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/index.js#L996-L1009)

导出不依赖先前校验结果，只导出并取得文件大小。

<details>
<summary>查看原文（14行）</summary>

```text
    async execute(args, exec) {
      const blendPath = await resolveWorkspacePath(args.blend_path, exec, config, { mustExist: true, kind: 'blend_path' })
      await assertRegularFile(blendPath, 'blend_path')
      if (extname(blendPath).toLowerCase() !== '.blend') throw new Error('blend_path must end in .blend')
      const outputPath = await resolveWorkspacePath(args.output_path, exec, config, { kind: 'output_path' })
      const format = extname(outputPath).toLowerCase()
      if (!SUPPORTED_EXPORTS.has(format)) throw new Error(`Unsupported export extension: ${format || '(none)'}`)
      await assertWritableTarget(outputPath, args.allow_overwrite === true, 'output_path')
      const result = await runBlender(config, exec, 'export', {
        output_path: outputPath,
        selection_only: args.selection_only === true,
      }, blendPath)
      const info = await assertRegularFile(outputPath, 'export output')
      return { modelPath: outputPath, format: format.slice(1), bytes: info.size, log: result.log }
```

</details>

**依据 6 · 源码核查**：[index.js:1086-1105](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/index.js#L1086-L1105)

导出回读允许调用者指定object_names，默认没有新增对象绑定。

<details>
<summary>查看原文（20行）</summary>

```text
    async execute(args, exec) {
      const modelPath = await resolveWorkspacePath(args.model_path, exec, config, { mustExist: true, kind: 'model_path' })
      await assertRegularFile(modelPath, 'model_path')
      const format = extname(modelPath).toLowerCase()
      if (!SUPPORTED_IMPORTS.has(format)) throw new Error(`Unsupported validation extension: ${format || '(none)'}`)
      const profile = args.profile ?? (format === '.stl' ? '3d-print' : 'web')
      if (!['general', 'web', '3d-print', 'animation'].includes(profile)) throw new Error('profile must be general, web, 3d-print, or animation')
      const result = await runBlender(config, exec, 'validate_asset', {
        source_path: modelPath,
        profile,
        object_names: args.object_names ?? [],
      })
      return {
        modelPath,
        format: format.slice(1),
        importedObjects: result.imported_objects,
        scene: result.scene,
        validation: result.validation,
        log: result.log,
      }
```

</details>

**依据 7 · 源码核查**：[scripts/dsh_blender_driver.py:273-337](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/scripts/dsh_blender_driver.py#L273-L337)

预览创建临时相机灯光并渲染，不保存源.blend，属于观察入口。

<details>
<summary>查看原文（65行）</summary>

```text
def _preview(payload: dict[str, Any]) -> dict[str, Any]:
    scene = bpy.context.scene
    minimum, maximum = _scene_bounds(payload.get("object_names"))
    center = (minimum + maximum) * 0.5
    size = maximum - minimum
    radius = max(size.length * 0.5, 0.5)
    view = payload.get("view", "isometric")
    directions = {
        "front": mathutils.Vector((0.0, -1.0, 0.0)),
        "back": mathutils.Vector((0.0, 1.0, 0.0)),
        "left": mathutils.Vector((-1.0, 0.0, 0.0)),
        "right": mathutils.Vector((1.0, 0.0, 0.0)),
        "top": mathutils.Vector((0.0, 0.0, 1.0)),
        "bottom": mathutils.Vector((0.0, 0.0, -1.0)),
        "isometric": mathutils.Vector((1.0, -1.0, 0.8)),
    }
    direction = directions.get(view)
    if direction is None:
        raise ValueError(f"Unsupported preview view: {view}")
    direction.normalize()

    camera_data = bpy.data.cameras.new("DSH_PREVIEW_CAMERA_DATA")
    camera = bpy.data.objects.new("DSH_PREVIEW_CAMERA", camera_data)
    scene.collection.objects.link(camera)
    camera.location = center + direction * radius * 3.2
    _look_at(camera, center)
    if bool(payload.get("orthographic", view != "isometric")):
        camera_data.type = "ORTHO"
        camera_data.ortho_scale = max(size.x, size.y, size.z, 0.5) * 1.35
    else:
        camera_data.type = "PERSP"
        camera_data.lens = float(payload.get("focal_length", 50.0))
    scene.camera = camera

    for name, offset, energy, area_size in (
        ("DSH_PREVIEW_KEY", (1.5, -2.0, 2.5), 1200.0, 4.0),
        ("DSH_PREVIEW_FILL", (-2.0, -0.5, 1.0), 600.0, 3.0),
        ("DSH_PREVIEW_RIM", (0.5, 2.0, 2.0), 900.0, 3.0),
    ):
        light_data = bpy.data.lights.new(f"{name}_DATA", "AREA")
        light_data.energy = energy * max(radius, 0.5)
        light_data.shape = "DISK"
        light_data.size = area_size * max(radius, 0.5)
        light = bpy.data.objects.new(name, light_data)
        scene.collection.objects.link(light)
        light.location = center + mathutils.Vector(offset) * radius
        _look_at(light, center)

    if scene.world is None:
        scene.world = bpy.data.worlds.new("DSH_PREVIEW_WORLD")
    scene.world.use_nodes = True
    background = scene.world.node_tree.nodes.get("Background")
    if background is not None:
        background.inputs["Color"].default_value = (0.025, 0.025, 0.035, 1.0)
        background.inputs["Strength"].default_value = 0.35

    output = Path(payload["output_path"])
    _configure_render(scene, payload, output)
    bpy.ops.render.render(write_still=True)
    return {
        "image_path": str(output),
        "view": view,
        "bounds": {"min": _vector(minimum), "max": _vector(maximum), "center": _vector(center)},
    }

```

</details>

**依据 8 · 源码核查**：[index.js:281-316](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/index.js#L281-L316)

Helper目录参数经白名单、类型和路径校验，不代表度量质量已经验证。

<details>
<summary>查看原文（36行）</summary>

```text
async function buildHelperInvocation(helper, rawArguments, exec, config, allowOverwrite) {
  const argumentsObject = rawArguments ?? {}
  if (argumentsObject === null || typeof argumentsObject !== 'object' || Array.isArray(argumentsObject)) {
    throw new Error('arguments must be an object')
  }
  const known = new Set(helper.arguments.map((spec) => spec.name))
  const unknown = Object.keys(argumentsObject).filter((key) => !known.has(key))
  if (unknown.length) throw new Error(`Unknown helper arguments: ${unknown.join(', ')}`)

  const commandArguments = []
  const outputs = []
  for (const spec of helper.arguments) {
    let candidate = argumentsObject[spec.name]
    if (candidate === undefined) {
      if (spec.required) throw new Error(`arguments.${spec.name} is required`)
      continue
    }
    assertHelperValue(spec, candidate)
    if (spec.type === 'path') {
      candidate = await resolveHelperPath(candidate, spec, exec, config, allowOverwrite)
      if (spec.pathKind?.startsWith('output-')) outputs.push(candidate)
    } else if (spec.type === 'path-array') {
      const resolved = []
      for (const item of candidate) resolved.push(await resolveHelperPath(item, spec, exec, config, allowOverwrite))
      candidate = resolved
    }

    if (spec.type === 'boolean') {
      if (candidate) commandArguments.push(spec.flag)
      continue
    }
    const values = Array.isArray(candidate) ? candidate : [candidate]
    if (!spec.positional) commandArguments.push(spec.flag)
    commandArguments.push(...values.map(String))
  }
  return { commandArguments, outputs }
```

</details>

**依据 9 · 作者声明**：[skills/create-3d-model/SKILL.md:68-76](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/skills/create-3d-model/SKILL.md#L68-L76)

作者要求观察渲染图，不能把结构检查当视觉确认。

```text
### 5. Validate structure and appearance

- After each significant phase, verify names, transforms, dimensions, origins, hierarchy, modifiers, topology counts, normals, UVs, materials, actions, accidental duplicates, and file paths relevant to the task.
- Create and inspect a `blender_preview` image after blockout and final refinement. For look development, camera, lighting, render, texture, or animation work, inspect purposeful camera renders as well.
- After `blender_render`, call `read_image` on the saved PNG/JPEG and inspect the returned image. A successful tool call or non-empty image file is not visual validation.
- For animation, use `blender_render_frames`, generate a contact sheet with the `animation-contact-sheet` helper, inspect it, and load `animation-quality-gate`.
- For reference-locked work, use measurable masks, landmarks, overlays, bboxes, centroids, IoU/SSIM where appropriate, and multiview gates. A front-view match alone does not prove a 3D match.
- If no image can be inspected, report `structurally verified, visually unverified`.
- Identify the largest visible mismatch, change the smallest upstream cause, re-capture the same view, and compare before and after. Do not hide geometry errors with camera, lighting, or crop tricks.
```

#### 缺口

- 不同Blender工厂启动场景、导入器和资产下，初始对象污染与误通过是否实际触发未知。
  **影响**：导入.blend和导出回读报告不能仅凭passed作为资产验收依据，当前采用需暂缓。
  **进一步探讨**：在另行安排的副本实验中，逐项记录启动对象、本次imported_objects和验证对象；用无新增网格、带网格和仅非网格的样本检查报告归属。
- 各目标资产的结构/视觉检查漏检率未知。
  **影响**：四种profile不能作为最终用途质量保证。
  **进一步探讨**：比较目标软件回读、人工观察与结构报告，记录误报漏报。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续、失败恢复与退出依赖谁，成本是否已证明更低？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

接入不是只安装一个 npm 包。包声明 Node >=22.12.0，并声明 DSH 0.2.0-rc.2、0.2.1-alpha.1、0.2.1-alpha.2 兼容；这些是固定版本声明，不外推当前其他版本。Blender 4.3+ 和 5.x 适配是 README 声明。普通工具需要本地 Blender 命令和可写工作区；图像分析 Helper 另依赖 Python 3.10+ 及 OpenCV、NumPy、Pillow、SciPy。setup 在包目录创建 .venv 并通过 pip 安装清单，不是安装插件时必然自动发生。analysis 探测一次导入四个库，某一个缺失会让整体 analysis 标为不可用，用户需要核对自己需要的 Helper。

作者兼容报告标题为 0.2.3，而当前包为 0.2.4，报告描述特定 macOS/Node/Python/Blender 环境及旧版本 DSH 的安装、工具分发、卸载结果。这是作者报告，不能改写成我们对当前提交的真实宿主验收。它明确回滚、Linux/Windows 等未覆盖。源码可确认 bundle 只插入本插件 entry，但本轮没有执行安装/卸载。

首次投入包括准备软件和分析环境、确认执行路径以及审查脚本；持续投入包括每次独立 Blender 启动、渲染计算、模型调用、输出存储及人工看图；失败投入包括核对部分输出、查日志、选择保留源文件、局部重试。没有耗时、调用量和合格资产数，不计算现金总额或单位资产成本，也不说免费、低成本。退出可保留已生成的便携模型与 .blend，用 Blender 手工继续；未保存的进程状态不持久，插件没有自动重建它的承诺。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-35](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/package.json#L1-L35)

包身份为 dsh-blender 0.2.4，主入口与 bundle 文件作为分发依据。

<details>
<summary>查看原文（35行）</summary>

```text
{
  "name": "dsh-blender",
  "version": "0.2.4",
  "description": "DeepSeek Harness Blender production, reconstruction, validation, and export plugin",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/CheshireJCat/blender.git"
  },
  "homepage": "https://github.com/CheshireJCat/blender#readme",
  "bugs": {
    "url": "https://github.com/CheshireJCat/blender/issues"
  },
  "type": "module",
  "main": "index.js",
  "bin": {
    "dsh-blender-setup": "scripts/setup-analysis.js"
  },
  "exports": {
    ".": "./index.js"
  },
  "files": [
    "index.js",
    "cordis.patch.yml",
    "lib",
    "scripts",
    "skills",
    "requirements-analysis.txt",
    "LICENSE",
    "NOTICE",
    "README.md",
    "README.zh-CN.md",
    "CHANGELOG.md",
    "docs/compatibility-v0.2.3.md"
  ],
  "scripts": {
```

</details>

**依据 2 · 作者声明**：[README.zh-CN.md:30-47](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/README.zh-CN.md#L30-L47)

作者列出 Blender、Node、Python 和依赖，并把兼容报告限制在其验证范围。

<details>
<summary>查看原文（18行）</summary>

````text
## 环境要求

- DeepSeek Harness `0.2.0-rc.2`、`0.2.1-alpha.1` 或 `0.2.1-alpha.2`
- Node.js 22.12+
- Blender 4.3+；当前实现已面向 Blender 5.x API 适配
- `blender` 在 `PATH` 中，或在 `cordis.patch.yml` 中配置绝对路径

参考图、线框和视觉度量 Helper 还需要 Python 3.10+。本仓库提供一次性安装命令：

```bash
pnpm setup:analysis
```

它只会在插件目录创建被 Git 忽略的 `.venv`，并安装 OpenCV、NumPy、Pillow 和 SciPy。也可以把 `analysisPythonExecutable` 指向已有环境。

## 兼容性验证

逐版本 DSH 兼容矩阵与一次性 Profile 安装、启动、卸载结果见 [v0.2.3 验证报告](docs/compatibility-v0.2.3.md)。报告区分作者验证与 DSH STORE 上架状态；回滚及 macOS 以外的平台尚未验证。
````

</details>

**依据 3 · 源码核查**：[scripts/setup-analysis.js:8-32](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/scripts/setup-analysis.js#L8-L32)

包内 .venv 与 pip 依赖安装由显式 setup 完成，具有网络和安装时间投入。

<details>
<summary>查看原文（25行）</summary>

```text
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const environment = join(root, '.venv')
const configuredPython = process.env.DSH_BLENDER_ANALYSIS_PYTHON?.trim()
const bootstrapPython = configuredPython || (process.platform === 'win32' ? 'python' : 'python3')
const environmentPython = process.platform === 'win32'
  ? join(environment, 'Scripts', 'python.exe')
  : join(environment, 'bin', 'python')

function run(command, args) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit', windowsHide: true })
    child.once('error', rejectPromise)
    child.once('close', (code) => {
      if (code === 0) resolvePromise()
      else rejectPromise(new Error(`${command} exited with code ${code ?? 1}`))
    })
  })
}

if (!existsSync(environmentPython)) await run(bootstrapPython, ['-m', 'venv', environment])
await run(environmentPython, ['-m', 'pip', 'install', '--disable-pip-version-check', '-r', join(root, 'requirements-analysis.txt')])
await run(environmentPython, [
  '-c',
  'import cv2,numpy,PIL,scipy; print(f"analysis runtime ready: opencv={cv2.__version__} numpy={numpy.__version__} pillow={PIL.__version__} scipy={scipy.__version__}")',
])
```

</details>

**依据 4 · 源码核查**：[index.js:219-242](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/index.js#L219-L242)

分析运行时整体探测四个 Python 库，错误作为 available=false 返回。

<details>
<summary>查看原文（24行）</summary>

```text
async function probeAnalysisRuntime(config, signal) {
  const executable = analysisPythonExecutable(config)
  try {
    const result = await runProcess(executable, [
      '-c',
      'import json,cv2,numpy,PIL,scipy; print(json.dumps({"opencv":cv2.__version__,"numpy":numpy.__version__,"pillow":PIL.__version__,"scipy":scipy.__version__}))',
    ], {
      signal,
      timeoutMs: Math.min(config.helperTimeoutMs, 15000),
      maxOutputChars: config.maxOutputChars,
    })
    if (result.code !== 0) {
      return { available: false, executable, version: '', dependencies: {}, error: clip(result.stderr || result.stdout, config.maxOutputChars) }
    }
    const dependencies = JSON.parse(result.stdout.trim())
    const versionResult = await runProcess(executable, ['--version'], {
      signal,
      timeoutMs: Math.min(config.helperTimeoutMs, 15000),
      maxOutputChars: config.maxOutputChars,
    })
    return { available: true, executable, version: (versionResult.stdout || versionResult.stderr).trim(), dependencies, error: '' }
  } catch (error) {
    if (signal?.aborted) throw error
    return { available: false, executable, version: '', dependencies: {}, error: error instanceof Error ? error.message : String(error) }
```

</details>

**依据 5 · 作者声明**：[docs/compatibility-v0.2.3.md:1-19](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/docs/compatibility-v0.2.3.md#L1-L19)

作者报告版本为0.2.3且环境特定，不能转为当前0.2.4独立验收。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-blender 0.2.3 compatibility verification

Verification date: 2026-10-12 (Asia/Shanghai).

## Results

| Exact DSH release | Compatibility | Install | Start and tool dispatch | Uninstall | Rollback |
| --- | --- | --- | --- | --- | --- |
| 0.2.0-rc.2 | compatible | passed | passed | passed | unknown |
| 0.2.1-alpha.1 | compatible | passed | passed | passed | unknown |
| 0.2.1-alpha.2 | compatible | passed | passed | passed | unknown |

All three Profiles register 13 Blender tools, 30 skills, and 23 enabled helpers. The separately invoked package checks also pass: package validation, 8 unit/regression tests, the analysis-helper integration test, and the real Blender integration test. The default unit-test command skips the two opt-in integration tests; both are executed explicitly in this acceptance run.

## Scope

Author-run acceptance on macOS arm64, Node.js 25.1.0, Python 3.12, and Blender 5.2.0 LTS. Each DSH version is installed separately at its exact npm version. Each run creates a fresh `DSH_HOME` and `DSH_AGENTS_HOME`, installs the packed plugin through the public DSH CLI, and uses the real base-backed Profile launcher and tool execution pipeline. No existing user Profile is modified.

Node.js 22.12+ is required by the current DSH CLI's Commander dependency. This run uses Node.js 25.1.0; it is not a separate acceptance run for each supported Node.js version.
```

</details>

**依据 6 · 作者声明**：[docs/compatibility-v0.2.3.md:40-54](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/docs/compatibility-v0.2.3.md#L40-L54)

作者说明安装/分发/卸载检查及回滚、跨平台、LLM建模范围限制。

<details>
<summary>查看原文（15行）</summary>

```text
`test:dsh` writes command logs, a runtime summary, and `report.json` into a uniquely named evidence directory. It checks:

- `dsh plugin --profile blender-smoke add <tarball>` succeeds and activates only the plugin-owned `blender-modeling` entry.
- `--dump-config` includes the Blender Bundle Patch.
- `dsh plugin --profile blender-smoke exec dsh-blender-setup` initializes the installed package's private analysis environment.
- The actual `runProfile` launcher starts, registers 13 Blender tools and 30 skills, and loads `create-3d-model`.
- A real DSH agent with an isolated workspace executes tools through `ctx.tools.execute`: Blender status, cube creation, scene/object inspection, scene validation, camera-free preview, GLB export, clean-process export re-import validation, helper discovery, and OpenCV wireframe analysis.
- The DSH tool pipeline rejects an output path outside that agent's workspace.
- The Profile shuts down cleanly before `dsh plugin ... remove dsh-blender` runs. The dependency, bundle activation, installed package, and composed entry are all absent after removal.

## Evidence limits

These are author-run install/start/uninstall and targeted tool acceptance results. They do not constitute an independent security audit, full acceptance of every Blender operation, a live LLM-driven modeling conversation, acceptance of every UI Profile, or testing on Linux/Windows. Rollback is not exercised and remains `unknown`. DSH STORE approval and automatic re-listing are separate downstream results.

The Bundle Patch only inserts `blender-modeling`; it does not replace or disable official components. Host DSH packages remain optional peer dependencies. No plugin install/prepare lifecycle script is introduced.
```

</details>

**依据 7 · 源码核查**：[cordis.patch.yml:1-15](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/cordis.patch.yml#L1-L15)

组合包默认开启工具和领域 Skill，维护 Helper 默认关闭，影响实际可用与权限范围。

<details>
<summary>查看原文（15行）</summary>

```text
- insert:
    - id: blender-modeling
      name: dsh-blender
      config:
        blenderExecutable: blender
        analysisPythonExecutable: ''
        timeoutMs: 180000
        helperTimeoutMs: 120000
        maxOutputChars: 20000
        restrictToWorkspace: true
        enablePython: true
        enableHelpers: true
        enableMaintenanceHelpers: false
        registerSkill: true
        registerModuleSkills: true
```

</details>

#### 缺口

- 没有同任务的全尝试耗时、模型支出、渲染资源和人工修正记录。
  **影响**：不能比较与手写脚本或 GUI 的单位合格资产成本，也不能承诺投入容易摊薄。
  **进一步探讨**：对固定资产目标记录配置、每次失败和复核成本，并按最终合格数分母计算。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 从验证结果未强制约束导出能推导什么可证伪改进，当前应如何试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前建议观察，先查明导入对象范围，再决定是否试用完整制作交付流程。已有DSH和Blender用户可以静态核对目标版本的导入与验证规则；在未确认新增对象和启动对象分离前，不把唯一资产或正式交付押在导入保存及passed上。原有可行退路是用Blender界面或已审查脚本检查源模型，保留原始.blend和便携模型。任意Python权限及输出无回滚仍要求可信代码和副本条件。

首要改进假设是将资产来源范围显式化：空场景或明确排除启动对象后导入，记录新增对象；验证只针对经确认的导入集合，拒绝空集合，并把输入文件摘要、集合和profile写入报告。这由_import_asset未清场、_validate_scene默认全场景及validate_asset未传新增集合三个事实推导。它不是现有功能，也不保证视觉正确；对需要保留环境/灯光的合法资产还需允许清晰配置，不能一律删除用户输入场景。

最小验证用同一Blender版本的工厂启动对象快照，分别导入无新增网格、仅非网格和正常网格样本，对照现流程与来源限定流程。观察初始对象是否进入保存文件、空新增集合是否被拒绝、验证对象是否只来自目标资产，以及正常资产误拒率和人工核对量。若仍把启动网格当目标网格或漏掉目标对象，机制目标不成立；若来源限定对合法资产产生更大损失而无漏检改善，则否定采用收益。此前提出的模型摘要与人工视觉交接记录可作为后续方向，必须先解决报告究竟验证谁，再讨论报告是否过期。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/dsh_blender_driver.py:387-396](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/scripts/dsh_blender_driver.py#L387-L396)

导入新增名单与整场景保存并存，是来源范围改进的起点。

<details>
<summary>查看原文（10行）</summary>

```text
def _import_asset(payload: dict[str, Any], save: bool) -> dict[str, Any]:
    source = Path(payload["source_path"])
    before = set(bpy.data.objects.keys())
    _import_asset_file(source)
    imported = sorted(name for name in bpy.data.objects.keys() if name not in before)
    if save:
        output = Path(payload["output_path"])
        output.parent.mkdir(parents=True, exist_ok=True)
        bpy.ops.wm.save_as_mainfile(filepath=str(output), check_existing=False)
    return {"source_path": str(source), "imported_objects": imported, "scene": _scene_summary()}
```

</details>

**依据 2 · 源码核查**：[scripts/dsh_blender_driver.py:422-449](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/scripts/dsh_blender_driver.py#L422-L449)

默认全场景检查可能借用已有网格，来源限定需直接约束这一集合。

<details>
<summary>查看原文（28行）</summary>

```text
def _validate_scene(payload: dict[str, Any]) -> dict[str, Any]:
    profile = payload.get("profile", "general")
    requested = set(payload.get("object_names") or [])
    objects = [obj for obj in bpy.context.scene.objects if not requested or obj.name in requested]
    missing = sorted(requested - {obj.name for obj in objects})
    warnings: list[dict[str, Any]] = []
    errors: list[dict[str, Any]] = []
    rows = []
    for obj in sorted(objects, key=lambda item: item.name):
        row = _object_summary(obj)
        if any(component < 0 for component in obj.scale):
            warnings.append({"object": obj.name, "code": "negative-scale"})
        if obj.type == "MESH" and obj.data is not None:
            mesh = _mesh_validation(obj)
            row["validation"] = mesh
            if mesh["looseVertices"]:
                warnings.append({"object": obj.name, "code": "loose-vertices", "count": mesh["looseVertices"]})
            if profile == "3d-print" and mesh["nonManifoldEdges"]:
                errors.append({"object": obj.name, "code": "non-manifold", "count": mesh["nonManifoldEdges"]})
            if profile == "web" and not mesh["uvLayers"]:
                warnings.append({"object": obj.name, "code": "missing-uv"})
            if profile in {"general", "web"} and mesh["materialSlots"] == 0:
                warnings.append({"object": obj.name, "code": "missing-material"})
        rows.append(row)
    if missing:
        errors.append({"code": "missing-objects", "objects": missing})
    if not any(obj.type == "MESH" for obj in objects):
        errors.append({"code": "no-mesh-objects"})
```

</details>

**依据 3 · 源码核查**：[scripts/dsh_blender_driver.py:516-525](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/scripts/dsh_blender_driver.py#L516-L525)

回读验证没有把新增名单绑定给验证器。

<details>
<summary>查看原文（10行）</summary>

```text
        elif args.operation == "import":
            data = _import_asset(payload, True)
        elif args.operation == "export":
            data = _export(payload)
        elif args.operation == "validate_scene":
            data = _validate_scene(payload)
        else:
            imported = _import_asset(payload, False)
            data = {**imported, "validation": _validate_scene(payload)}
        result = {"ok": True, **data}
```

</details>

**依据 4 · 源码核查**：[index.js:996-1009](https://github.com/CheshireJCat/blender/blob/1441134b2281bc7c473e95af41fcc5cc6f0757b6/index.js#L996-L1009)

独立导出没有报告绑定，属于解决对象范围之后的交接议题。

<details>
<summary>查看原文（14行）</summary>

```text
    async execute(args, exec) {
      const blendPath = await resolveWorkspacePath(args.blend_path, exec, config, { mustExist: true, kind: 'blend_path' })
      await assertRegularFile(blendPath, 'blend_path')
      if (extname(blendPath).toLowerCase() !== '.blend') throw new Error('blend_path must end in .blend')
      const outputPath = await resolveWorkspacePath(args.output_path, exec, config, { kind: 'output_path' })
      const format = extname(outputPath).toLowerCase()
      if (!SUPPORTED_EXPORTS.has(format)) throw new Error(`Unsupported export extension: ${format || '(none)'}`)
      await assertWritableTarget(outputPath, args.allow_overwrite === true, 'output_path')
      const result = await runBlender(config, exec, 'export', {
        output_path: outputPath,
        selection_only: args.selection_only === true,
      }, blendPath)
      const info = await assertRegularFile(outputPath, 'export output')
      return { modelPath: outputPath, format: format.slice(1), bytes: info.size, log: result.log }
```

</details>

#### 缺口

- 来源限定能否在真实资产中降低漏检且不增加不可接受的误拒，尚无对照。
  **影响**：改进是待验证假设，不能作为当前价值或恢复试用的证据。
  **进一步探讨**：对照无新增网格、仅非网格和正常网格样本的对象归属、误通过、误拒及人工时间。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
