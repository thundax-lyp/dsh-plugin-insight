# Cutout Pet · 抠图桌宠

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[98b2d76](https://github.com/AlannerFranklin/dsh-cutout-pet/tree/98b2d7626406230ee9bd01aad029351e693078ed)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：将图片在浏览器本地抠图、描边并显示为 Harness 网页桌宠，附带账户余额气泡。

> **核心亮点**：在 DSH 中串起本地抠图预览、Host持久化、比例拖动锚点和余额气泡，较外部编辑加贴图减少跨工具交接；增量在宿主集成而非新分割算法，尚无效果排名或首创证据。见[Q03](#research-q03)。

> **风险与缺陷**：核心质疑是“任意图片”和“每profile一宠/不离本机”是否被实际边界支持。颜色键会受素材限制，短边约束前后不一致；文件和缓存未显式按profile/账户分区，远端Host部署时PNG会跨机器。以上是源码条件与风险，未声称已复现泄漏。见[Q02](#research-q02)、[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程贡献](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · 哪些用户需要网页桌宠，合格结果与简单替代是什么？](#detail-section-15)
  - [Q02 · 本地抠图与宿主存储如何串联，任意图片主张成立到哪里？](#detail-section-16)
  - [Q03 · 相对外部抠图加静态贴图，具体增量归于何种组合？](#detail-section-17)
  - [Q04 · 账户和数据范围是否支持隐私及每profile一宠承诺？](#detail-section-18)
  - [Q05 · 如何启动、保存、刷新与恢复，依赖何种宿主接口？](#detail-section-19)
  - [Q06 · 首次、持续、失败恢复成本和效果能证明多少？](#detail-section-20)
  - [Q07 · 资源清理、输入校验和状态策略可借鉴处与缺陷是什么？](#detail-section-21)
  - [Q08 · 怎样在不引入分割服务前改善抠图失败和预览可信度？](#detail-section-22)
  - [Q09 · 什么条件下值得试用，何时停止？](#detail-section-23)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望在 Harness 网页展示个人形象并顺手查看余额的用户；只作用于网页，合格结果是可接受图像、持久显示、位置可恢复和正确账户状态。

简单替代包括整图展示、外部编辑器制作透明PNG以及独立账户余额页。比较仅描述流程与实现，未检查指定竞品版本，不宣称效率优胜或首创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 本地抠图与描边 | 简单背景图转透明贴图 | Canvas颜色键，不保证复杂图/细长图可保存 |
| 网页桌宠 | 拖动装饰和窗口缩放相对定位 | Harness网页slot，固定高度估计未适配所有比例 |
| 保存与恢复 | 上传PNG、重载和默认图 | Host可写DSH_HOME，未显式profile分区 |
| 余额气泡 | 常驻显示钱包及刷新 | 可选登录账户服务；缓存60秒、账户切换须核对 |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 依赖 | 必要性与用途 | 条件与失效影响 | 替代或降级 |
|---|---|---|---|
| Node与DSH Host | 启动必需 | Node>=20；精确DSH版本未知 | 未验收前限隔离环境 |
| webServer | Host必需 | 提供图像/状态/上传路由 | 缺失无法持久艺术 |
| 浏览器React/loader/slots | 界面必需 | 注入overlay与settings；兼容未验收 | 外部编辑/整图不替代宿主注册 |
| deepseekAccount | 余额可选 | 登录才能取钱包 | 保留桌宠、显示无余额状态 |
| DSH_HOME及浏览器存储 | 持久化必需/位置可降级 | 艺术按DSH_HOME共享；位置按浏览器origin | 独立DSH_HOME；位置存储失败回默认 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与动作 | 成功判据 | 失败处理 |
|---|---|---|---|
| 准备 | 用户在独立profile/DSH_HOME按README从Git添加 | 设置出现抠图桌宠 | 查宿主加载与版本，不执行未授权安装 |
| 制作 | 用户选非敏感简单图，调阈值或关闭去背 | 主体完整、预览认可 | 重选/整图/外部编辑 |
| 保存 | 用户点击保存 | HTTP成功且重载同图 | 查尺寸、权限、并发保存 |
| 验收 | 用户拖动缩放、恢复默认、核余额 | 位置可找到，恢复正确且账户匹配 | 强刷余额或停止禁用，保留原图 |

<a id="detail-section-6"></a>

### 1.5 成本

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器解码与像素处理、Host存储；金额未知 | 选图、调阈值、审预览、保存；耗时未知 | 长边处理560，图像解码峰值未知 |
| 持续使用 | 动画、指针监听、每页60秒请求；资源与服务费用未知 | 查看状态、必要时点击刷新；频率未知 | Host缓存60秒，点击绕过 |
| 失败恢复 | 重处理、请求重试或外部编辑；成本未知 | 切整图、重选图、核对账户和目录；时间未知 | 细长输出及共享目录须排查 |
| 退出与迁移 | 艺术文件与浏览器位置分属两地 | 备份原图、恢复默认并核查卸载残留 | 未验证卸载自动清理 |

<a id="detail-section-7"></a>

### 1.6 效果

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 图像变透明桌宠 | 源码颜色键流水线，适用简单背景 | 误删、细长图保存合格率待验收 |
| 窗口缩放保留位置 | 比例锚点换算，视口须可容纳 | 极端比例与小窗口未测 |
| 余额信息常驻 | 账户服务代理与缓存，需登录服务 | 账户切换缓存一致性需核对 |
| 减少交接 | 设置与展示在同宿主 | 无耗时或满意度对照 |

> **思考**：核心质疑是“任意图片”和“每profile一宠/不离本机”是否被实际边界支持。颜色键会受素材限制，短边约束前后不一致；文件和缓存未显式按profile/账户分区，远端Host部署时PNG会跨机器。以上是源码条件与风险，未声称已复现泄漏。见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：在 DSH 中串起本地抠图预览、Host持久化、比例拖动锚点和余额气泡，较外部编辑加贴图减少跨工具交接；增量在宿主集成而非新分割算法，尚无效果排名或首创证据。见[Q03](#research-q03)。

在 DSH 中串起本地抠图预览、Host持久化、比例拖动锚点和余额气泡，较外部编辑加贴图减少跨工具交接；增量在宿主集成而非新分割算法，尚无效果排名或首创证据。见[Q03](#research-q03)。

浏览器与Host职责分开、资源清理和比例锚点可借鉴；移植需替换DSH loader/slots/locale/账户接口。PNG校验并非完整解码，固定临时名存在并发风险，read/delete吞错会模糊故障；均未运行复现。见[Q07](#research-q07)。

<a id="detail-section-9"></a>

### 1.8 主要限制

核心质疑是“任意图片”和“每profile一宠/不离本机”是否被实际边界支持。颜色键会受素材限制，短边约束前后不一致；文件和缓存未显式按profile/账户分区，远端Host部署时PNG会跨机器。以上是源码条件与风险，未声称已复现泄漏。见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-10"></a>

### 1.9 使用建议

有试用。用隔离DSH_HOME和非敏感简单图，验证保存、重载、缩放、恢复默认及余额账户一致性；不能接受远端Host接收图片、共享状态或遮挡时停止。缺少真实宿主验收，暂不建议持续安装。见[Q09](#research-q09)。

采用建议：有试用。用隔离DSH_HOME和非敏感简单图，验证保存、重载、缩放、恢复默认及余额账户一致性；不能接受远端Host接收图片、共享状态或遮挡时停止。缺少真实宿主验收，暂不建议持续安装。见[Q09](#research-q09)。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已通过固定源码核查确认集成设计与限制；抠图质量、宿主兼容和用户收益未运行验证。未来共享预检契约属于研究者提出的未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、index.js、client.js、locale/zh.json、locale/en.json、docs/market-listing.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定提交源码级研究，不执行插件/测试/安装；没有宿主兼容、图像效果、权限隔离和独立用户收益证明。
- 下一步：先在授权隔离宿主记录版本，验收加载、图像保存/重载/恢复、两标签并发、极端比例及账户切换，再做Q08固定素材对照；若出现状态串用或不能可靠恢复即停止。以上是后续方案，本次未执行。

**分析版本**

- **仓库**：[AlannerFranklin/dsh-cutout-pet](https://github.com/AlannerFranklin/dsh-cutout-pet)
- **版本号**：1.0.0（[固定提交 98b2d76](https://github.com/AlannerFranklin/dsh-cutout-pet/tree/98b2d7626406230ee9bd01aad029351e693078ed)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是以共享图像资格契约和可解释删除/尺寸警示替代仅靠视觉预览，可减少误删及保存返工；以20张分层素材比较最终合格率、拒绝、调整次数与耗时，警示无收益或误拒增加即否定。该方案未实现，不计为现有贡献。见[Q08](#research-q08)。

先在授权隔离宿主记录版本，验收加载、图像保存/重载/恢复、两标签并发、极端比例及账户切换，再做Q08固定素材对照；若出现状态串用或不能可靠恢复即停止。以上是后续方案，本次未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1440 | 1194 | 147 | — |
| .md | source | 2 | 132 | — | — | 1176 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AlannerFranklin/dsh-cutout-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AlannerFranklin/dsh-cutout-pet/issues?q=is%3Aissue+created%3A2026-09-23T05%3A06%3A15.276Z..2026-10-23T05%3A06%3A15.276Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AlannerFranklin/dsh-cutout-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-23T05%3A06%3A15.276Z..2026-10-23T05%3A06%3A15.276Z)



统计日期：2026-10-23。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本 dsh-cutout-pet 能否以可控成本把用户图片变成 DSH 网页桌宠，并可信呈现账户余额；其增量、限制及可验证改进是什么？

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · 哪些用户需要网页桌宠，合格结果与简单替代是什么？

**研究主题**：场景与需求

#### 完整回答

作者面向使用 Harness 网页、希望用个人图片装饰工作界面并顺手查看账户余额的用户。桌宠实际是网页 overlay，不能据此称为操作系统桌面宠物，也不参与模型任务。合格结果是上传后得到用户认可的形象、重载可恢复、窗口变化可找到位置，且余额能区别正常、未登录及失败状态。简单替代是外部编辑器制作透明 PNG 后展示，或保留整图，账户余额单独查询；本项目把这些步骤放进一个设置页。需求频率、长期留存和减少打断的收益没有独立材料，不能把陪伴感写成生产力提升。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-26](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/README.md#L1-L26)

作者明确网页桌宠、设置上传及余额定位。

<details>
<summary>查看原文（26行）</summary>

```text
# Cutout Pet · 抠图桌宠

Turn **any picture** into a desk pet that floats over the Harness Web UI. The background is
removed right in the page, the figure gets a sticker outline and a little idle life, and a speech
bubble keeps the current DeepSeek account balance in view.

把**任意一张图片**变成浮在 Harness 界面上的桌宠：在页面里直接抠掉背景、加白描边、让她会呼吸会摇摆，
头顶气泡实时显示当前 DeepSeek 账户余额。

---

## Features

- **Upload → cutout → pet.** Pick a JPG/PNG in *Settings → Cutout Pet*. The page's own canvas floods
  the background out from the borders, drops detached specks (sparkles, stray watermark strokes),
  feathers the edge, trims the transparent margin and paints a white sticker outline.
- **Tunable cutout.** Background tolerance slider, plus a switch to keep the whole picture when the
  background is a photo or a gradient.
- **Alive, not animated sprites.** Breathing and swaying anchored at her feet, sparkles drifting
  around her, a few pixels of lean toward the pointer, tilt while dragging.
- **Follows the window.** The position is stored as a fraction of the free space, not pixels, so the
  pet stays in its corner when the window grows or shrinks.
- **Balance bubble.** The Host half asks the signed-in DeepSeek account for its wallet balance
  (CNY/USD, plus bonus wallets). No API key, no token in the page.
- **Local and quiet.** The picture never leaves the machine: it is decoded and cut in the browser; only
  the finished PNG is written to the DSH data directory.
```

</details>

**依据 2 · 源码核查**：[client.js:1097-1108](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L1097-L1108)

注册点是shell.overlay和settings.section，限定用户界面范围。

<details>
<summary>查看原文（12行）</summary>

```text
          ctx.slots.inject('shell.overlay', () =>
            ctx.slots.register(
              { name: 'shell.overlay', id: 'cutout-pet', order: 60, label: () => translate('title') },
              Pet,
            ),
          )

          ctx.slots.inject('settings.section', () =>
            ctx.slots.register(
              { name: 'settings.section', id: 'cutout-pet', order: 35, label: () => translate('settingsLabel') },
              Settings,
            ),
```

</details>

#### 缺口

- 真实用户的反复需求和合格图像标准未知
  **影响**：不能判断装饰价值足以覆盖遮挡和持续资源消耗
  **进一步探讨**：招募实际Harness用户，用任务中断次数和继续使用意愿比较无桌宠、整图和抠图三种设置

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 本地抠图与宿主存储如何串联，任意图片主张成立到哪里？

**研究主题**：功能与机制

#### 完整回答

浏览器把图像最长边缩到560像素，按边缘RGB中位数做颜色距离判断，从四边泛洪删除背景，再按连通域大小过滤、3×3 alpha羽化、透明包围盒裁剪和白色膨胀描边，输出宽不超过480的PNG data URL。设置页预览经POST保存，Host写入临时文件后rename到art.png，overlay读取该文件或默认草莓。算法没有语义分割，衣物与背景同色且边缘连通时会被删；封闭孔洞背景未必与边界连通，较小但合法的分离部件也可能被过滤。“任意图片”适用于可读输入的装饰转换，不等于任意照片都可干净分割；README本身给出整图开关作为降级。客户端可产生短边不足32像素的细长输出，Host却要求两边均至少32，因此预览成功并不保证保存成功。这里只确认约束不一致，未复现具体图片失败。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:220-267](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L220-L267)

固定颜色参考的四邻域边界泛洪，不使用分割模型。

<details>
<summary>查看原文（48行）</summary>

```text
      function removeBackground(data, width, height, tolerance) {
        const [refR, refG, refB] = borderReference(data, width, height)
        const tolerance2 = tolerance * tolerance
        const visited = new Uint8Array(width * height)
        const queue = new Int32Array(width * height)
        let head = 0
        let tail = 0

        const matches = (index) => {
          const p = at(index)
          const dr = data[p] - refR
          const dg = data[p + 1] - refG
          const db = data[p + 2] - refB
          return dr * dr + dg * dg + db * db <= tolerance2
        }
        const seed = (index) => {
          if (visited[index] !== 0) return
          visited[index] = 1
          if (matches(index)) queue[tail++] = index
          else visited[index] = 2
        }

        for (let x = 0; x < width; x += 1) {
          seed(x)
          seed((height - 1) * width + x)
        }
        for (let y = 0; y < height; y += 1) {
          seed(y * width)
          seed(y * width + width - 1)
        }

        while (head < tail) {
          const index = queue[head++]
          data[at(index) + 3] = 0
          const x = index % width
          const neighbours = [index - width, index + width]
          if (x > 0) neighbours.push(index - 1)
          if (x < width - 1) neighbours.push(index + 1)
          for (const next of neighbours) {
            if (next < 0 || next >= width * height || visited[next] !== 0) continue
            if (matches(next)) {
              visited[next] = 1
              queue[tail++] = next
            } else {
              visited[next] = 2
            }
          }
        }
```

</details>

**依据 2 · 源码核查**：[client.js:299-304](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L299-L304)

按最大连通域2%且至少64像素过滤，有误删小部件条件。

```text
        if (sizes.length === 0) return
        const largest = Math.max(...sizes)
        const keepAbove = Math.max(64, largest * 0.02)
        for (let i = 0; i < total; i += 1) {
          if (mask[i] === 1 && sizes[label[i]] < keepAbove) data[at(i) + 3] = 0
        }
```

**依据 3 · 源码核查**：[client.js:417-462](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L417-L462)

输出由裁剪比例决定，未将短边提升到Host下限。

<details>
<summary>查看原文（46行）</summary>

```text
      function cutoutFromImage(image, options) {
        const sourceWidth = image.naturalWidth || image.width
        const sourceHeight = image.naturalHeight || image.height
        const scale = Math.min(1, MAX_PROCESS_PIXELS / Math.max(sourceWidth, sourceHeight))
        const width = Math.max(1, Math.round(sourceWidth * scale))
        const height = Math.max(1, Math.round(sourceHeight * scale))

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const context = canvas.getContext('2d', { willReadFrequently: true })
        context.drawImage(image, 0, 0, width, height)
        const pixels = context.getImageData(0, 0, width, height)

        if (options.removeBackground) {
          removeBackground(pixels.data, width, height, options.tolerance)
          keepMainSilhouette(pixels.data, width, height)
          featherAlpha(pixels.data, width, height)
        }
        context.putImageData(pixels, 0, 0)

        const box = alphaBox(pixels.data, width, height, 8)
        if (box === null) throw new Error('empty-image')

        const pad = 2
        const left = Math.max(0, box.x - pad)
        const top = Math.max(0, box.y - pad)
        const right = Math.min(width, box.x + box.width + pad)
        const bottom = Math.min(height, box.y + box.height + pad)
        const croppedWidth = right - left
        const croppedHeight = bottom - top

        const cropped = document.createElement('canvas')
        cropped.width = croppedWidth
        cropped.height = croppedHeight
        const croppedContext = cropped.getContext('2d')
        croppedContext.drawImage(canvas, left, top, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight)

        const outputWidth = Math.min(OUTPUT_WIDTH, croppedWidth)
        const outputHeight = Math.max(1, Math.round((croppedHeight * outputWidth) / croppedWidth))
        const output = document.createElement('canvas')
        output.width = outputWidth
        output.height = outputHeight
        output.getContext('2d').drawImage(cropped, 0, 0, outputWidth, outputHeight)

        return withOutline(output)
```

</details>

**依据 4 · 源码核查**：[index.js:214-241](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/index.js#L214-L241)

Host限制PNG签名、长度及偏移中的宽高；两边32到2048。

<details>
<summary>查看原文（28行）</summary>

```text
function decodeUpload(input) {
  const dataUrl = typeof input?.png === 'string' ? input.png : ''
  const match = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl)
  if (match === null) {
    const error = new Error('png must be a base64 image/png data URL')
    error.code = 'malformed'
    throw error
  }
  const bytes = Buffer.from(match[1], 'base64')
  if (bytes.length < 64 || bytes.length > MAX_UPLOAD_BYTES) {
    const error = new Error(`png must be between 64 bytes and ${MAX_UPLOAD_BYTES} bytes`)
    error.code = 'size'
    throw error
  }
  if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    const error = new Error('png signature missing')
    error.code = 'malformed'
    throw error
  }
  // IHDR follows the signature: width and height are big-endian 32-bit values.
  const width = bytes.readUInt32BE(16)
  const height = bytes.readUInt32BE(20)
  if (width < MIN_ART_SIDE || height < MIN_ART_SIDE || width > MAX_ART_SIDE || height > MAX_ART_SIDE) {
    const error = new Error(`png sides must be between ${MIN_ART_SIDE} and ${MAX_ART_SIDE} pixels`)
    error.code = 'size'
    throw error
  }
  return bytes
```

</details>

**依据 5 · 源码核查**：[index.js:284-292](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/index.js#L284-L292)

保存采用固定临时名与rename。

```text
    if (route === UPLOAD_PATH) {
      if (req.method === 'POST') {
        const body = await readJsonBody(req, MAX_REQUEST_BYTES)
        const bytes = decodeUpload(body)
        await mkdir(DATA_DIR, { recursive: true })
        const temporary = `${ART_FILE}.tmp`
        await writeFile(temporary, bytes)
        await rename(temporary, ART_FILE)
        return sendJson(res, 200, await artState())
```

#### 缺口

- 不同图像类别的抠图成功率及细长图实际保存表现未测
  **影响**：无法将算法存在等同于满足作者通用图片表述
  **进一步探讨**：构造纯色、同色衣物、封闭孔洞、多主体和细长图，在同版本隔离宿主验收

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 相对外部抠图加静态贴图，具体增量归于何种组合？

**研究主题**：贡献与相对优势

#### 完整回答

可识别贡献是面向DSH的端到端集成：把本地颜色键处理、可调预览、文件持久化、比例锚点拖动和账户余额放进同一网页入口。相对于手工外部编辑加贴图，减少跨工具搬运；相对于整图模式，透明裁剪与描边可能改善装饰效果，但效果取决于素材。边界泛洪、连通域、羽化与CSS呼吸本身是常见技术，本次未建立算法首创证据。比例锚点保存了在可移动空间中的相对位置，值得借鉴为窗口缩放定位；固定人物高度估计仍使任意纵横比的图片不一定完全落在视口内。集成便利可以成立为源码级贡献，不能推出优于专业分割、系统级桌宠或提高工作效率。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:417-462](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L417-L462)

组合既有像素处理流水线形成本地转换。

<details>
<summary>查看原文（46行）</summary>

```text
      function cutoutFromImage(image, options) {
        const sourceWidth = image.naturalWidth || image.width
        const sourceHeight = image.naturalHeight || image.height
        const scale = Math.min(1, MAX_PROCESS_PIXELS / Math.max(sourceWidth, sourceHeight))
        const width = Math.max(1, Math.round(sourceWidth * scale))
        const height = Math.max(1, Math.round(sourceHeight * scale))

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const context = canvas.getContext('2d', { willReadFrequently: true })
        context.drawImage(image, 0, 0, width, height)
        const pixels = context.getImageData(0, 0, width, height)

        if (options.removeBackground) {
          removeBackground(pixels.data, width, height, options.tolerance)
          keepMainSilhouette(pixels.data, width, height)
          featherAlpha(pixels.data, width, height)
        }
        context.putImageData(pixels, 0, 0)

        const box = alphaBox(pixels.data, width, height, 8)
        if (box === null) throw new Error('empty-image')

        const pad = 2
        const left = Math.max(0, box.x - pad)
        const top = Math.max(0, box.y - pad)
        const right = Math.min(width, box.x + box.width + pad)
        const bottom = Math.min(height, box.y + box.height + pad)
        const croppedWidth = right - left
        const croppedHeight = bottom - top

        const cropped = document.createElement('canvas')
        cropped.width = croppedWidth
        cropped.height = croppedHeight
        const croppedContext = cropped.getContext('2d')
        croppedContext.drawImage(canvas, left, top, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight)

        const outputWidth = Math.min(OUTPUT_WIDTH, croppedWidth)
        const outputHeight = Math.max(1, Math.round((croppedHeight * outputWidth) / croppedWidth))
        const output = document.createElement('canvas')
        output.width = outputWidth
        output.height = outputHeight
        output.getContext('2d').drawImage(cropped, 0, 0, outputWidth, outputHeight)

        return withOutline(output)
```

</details>

**依据 2 · 源码核查**：[client.js:483-539](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L483-L539)

持久化比例锚点和像素换算，人物高度依赖固定纵横比。

<details>
<summary>查看原文（57行）</summary>

```text
      function saveAnchor(anchor) {
        try {
          window.localStorage.setItem(ANCHOR_KEY, JSON.stringify(anchor))
        } catch {
          /* the pet simply starts bottom-right next time */
        }
      }

      /** The default resting place: bottom-right corner. */
      const DEFAULT_ANCHOR = { rx: 1, ry: 1 }

      /** Height the artwork occupies at the configured width. */
      function personHeight() {
        return Math.round(PERSON_WIDTH * ART_ASPECT)
      }

      /**
       * Pixel position for one anchor inside one viewport.
       * Storing the fraction between the free edges is what keeps the pet in its
       * corner when the window grows or shrinks.
       */
      function pixelFromAnchor(anchor, viewport) {
        const freeX = Math.max(0, viewport.width - PERSON_WIDTH - 16)
        const freeY = Math.max(0, viewport.height - personHeight() - 8)
        return {
          x: Math.round(8 + anchor.rx * freeX),
          y: Math.round(64 + anchor.ry * Math.max(0, freeY - 64)),
        }
      }

      /** Anchor for one pixel position inside one viewport (inverse of the above). */
      function anchorFromPixel(pixel, viewport) {
        const freeX = Math.max(0, viewport.width - PERSON_WIDTH - 16)
        const freeY = Math.max(0, viewport.height - personHeight() - 8)
        return {
          rx: freeX === 0 ? 0 : Math.min(1, Math.max(0, (pixel.x - 8) / freeX)),
          ry: freeY <= 64 ? 0 : Math.min(1, Math.max(0, (pixel.y - 64) / (freeY - 64))),
        }
      }

      /** Prefer the primary wallet: CNY first, otherwise whatever the account has. */
      function pickWallet(wallets) {
        if (!Array.isArray(wallets) || wallets.length === 0) return null
        return wallets.find((wallet) => wallet.currency === 'CNY') ?? wallets[0]
      }

      /** Render a balance string with two decimals when it is a number. */
      function fixed(balance) {
        const value = Number(balance)
        if (!Number.isFinite(value)) return String(balance)
        return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      }

      /** Money text with the currency symbol the account reports. */
      function money(wallet) {
        const symbol = SYMBOL[wallet.currency]
        return symbol ? `${symbol}${fixed(wallet.balance)}` : `${wallet.currency} ${fixed(wallet.balance)}`
```

</details>

**依据 3 · 源码核查**：[client.js:1094-1108](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L1094-L1108)

两种宿主slot共同提供编辑与展示。

<details>
<summary>查看原文（15行）</summary>

```text
          const Pet = createPet({ t: translate, locale })
          const Settings = createSettings({ t: translate })

          ctx.slots.inject('shell.overlay', () =>
            ctx.slots.register(
              { name: 'shell.overlay', id: 'cutout-pet', order: 60, label: () => translate('title') },
              Pet,
            ),
          )

          ctx.slots.inject('settings.section', () =>
            ctx.slots.register(
              { name: 'settings.section', id: 'cutout-pet', order: 35, label: () => translate('settingsLabel') },
              Settings,
            ),
```

</details>

#### 缺口

- 未核查同类桌宠插件的固定版本实现
  **影响**：贡献比较仅限显式简单替代，不能宣称生态首创或领先
  **进一步探讨**：另行固定同任务替代项目并比较输入限制、宿主耦合和总操作成本

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 账户和数据范围是否支持隐私及每profile一宠承诺？

**研究主题**：缺陷与关键质疑

#### 完整回答

图像解码和像素处理路径没有第三方图像服务调用，保存通过相对URL发往Host。因此能支持“不送第三方抠图服务”，不能无条件支持“图片不离开这台电脑”：若浏览器和DSH Host分离，处理后的PNG会传给远端Host。文件路径只含DSH_HOME/plugin-data/dsh-cutout-pet，没有profile键；只有profile实际分配独立DSH_HOME时才有profile隔离。余额由Host deepseekAccount取回，浏览器只收到普通钱包字段而没有凭据；缓存是模块级60秒值，没有账户或profile键，切换账户后的缓存新鲜度须由宿主隔离和重载保证。路由本身未做身份鉴别，是否受宿主统一鉴权保护未知，不能据此宣称已证实公开漏洞。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:52-62](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/README.md#L52-L62)

作者给出本机隐私和每profile单宠主张，需条件化解释。

<details>
<summary>查看原文（11行）</summary>

```text
| `index.js` | Serves `/.dsh-pet/art.png` (uploaded or bundled default), `/.dsh-pet/state`, `/.dsh-pet/art` (POST/DELETE) and `/.dsh-pet/balance`. Stores the upload at `<DSH_HOME>/plugin-data/dsh-cutout-pet/art.png`. |
| `assets/default.png` | Original strawberry placeholder drawn for this plugin (MIT, same as the code). |

Uploads are validated as real PNG data (signature, IHDR size, 3 MiB cap) before they are written.

## Limitations

- The cutout is a colour-key algorithm, not a segmentation model. Flat or single-colour backgrounds
  cut cleanly; photos, gradients and busy scenes need the switch turned off (whole picture as the pet)
  or an external editor.
- The balance comes from the DeepSeek **account** wallet service. In a profile without a signed-in
```

</details>

**依据 2 · 源码核查**：[index.js:40-51](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/index.js#L40-L51)

存储与缓存均无显式profile/账户分区键。

<details>
<summary>查看原文（12行）</summary>

```text
/** Uploaded art lives beside the session data, not inside the package. */
const DATA_DIR = join(process.env.DSH_HOME || join(homedir(), '.dsh'), 'plugin-data', 'dsh-cutout-pet')
const ART_FILE = join(DATA_DIR, 'art.png')

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

/** Cached bundled fallback: the file never changes while the plugin is loaded. */
let fallbackArtwork

/** Cached account answer shared by every page watching the pet. */
let cachedAt = 0
let cachedValue
```

</details>

**依据 3 · 源码核查**：[index.js:169-205](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/index.js#L169-L205)

读取当前账户服务，但缓存命中早于服务查询且强制刷新可绕过。

<details>
<summary>查看原文（37行）</summary>

```text
async function balanceAnswer(ctx, url, force) {
  const fresh = force || Date.now() - cachedAt > CACHE_MS
  if (!fresh && cachedValue !== undefined) return cachedValue

  const account = ctx.get('deepseekAccount')
  if (account === undefined) {
    cachedValue = { ok: false, reason: 'unavailable', message: 'deepseekAccount service is not composed in this profile' }
    cachedAt = Date.now()
    return cachedValue
  }

  try {
    const balance = await account.getBalance(accountClient(url))
    if (balance === null) {
      const state = await account.getState().catch(() => undefined)
      cachedValue = state?.status === 'signed-out'
        ? { ok: false, reason: 'signed-out' }
        : { ok: false, reason: 'unavailable' }
      cachedAt = Date.now()
      return cachedValue
    }
    if (balance.status === 'failed') {
      cachedValue = { ok: false, reason: 'failed' }
      cachedAt = Date.now()
      return cachedValue
    }
    cachedValue = {
      ok: true,
      wallets: plainWallets(balance.value),
      bonusWallets: plainWallets(balance.bonusWallets),
      updatedAt: Date.now(),
    }
    cachedAt = Date.now()
    return cachedValue
  } catch (error) {
    // Never cache a transport failure: the next poll should try again.
    return { ok: false, reason: 'error', message: error instanceof Error ? error.message : String(error) }
```

</details>

**依据 4 · 源码核查**：[client.js:930-946](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L930-L946)

处理后的PNG以POST提交Host相对路由。

<details>
<summary>查看原文（17行）</summary>

```text
          const save = async () => {
            if (preview === null) return
            setBusy(true)
            setStatus({ kind: 'idle', text: t('saving') })
            try {
              const response = await fetch(UPLOAD_URL, {
                method: 'POST',
                headers: { 'content-type': 'application/json', accept: 'application/json' },
                body: JSON.stringify({ png: preview }),
              })
              const value = await response.json()
              if (!response.ok || !value.ok) throw new Error(value.message || `HTTP ${response.status}`)
              if (!alive.current) return
              setState(value)
              setBusy(false)
              setStatus({ kind: 'ok', text: t('saved') })
              window.dispatchEvent(new CustomEvent(ART_EVENT, { detail: { version: value.version } }))
```

</details>

**依据 5 · 源码核查**：[index.js:317-325](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/index.js#L317-L325)

前缀注册未在插件层新增鉴权逻辑，宿主保护未知。

```text
export function apply(ctx) {
  ctx.effect(() => {
    const remove = ctx.webServer.register({
      kind: 'prefix',
      path: PREFIX,
      handler: (req, res) => handle(ctx, req, res),
    })
    return () => remove()
  })
```

#### 缺口

- 宿主profile进程隔离、DSH_HOME分配和webServer鉴权契约未随仓库提供
  **影响**：不能保证跨profile艺术隔离、账户切换缓存与路由访问边界
  **进一步探讨**：查相同宿主版本接口并在授权环境分别验证独立DSH_HOME、共享DSH_HOME、账户切换和远端浏览器

<a id="research-q05"></a>

<a id="detail-section-19"></a>

### Q05 · 如何启动、保存、刷新与恢复，依赖何种宿主接口？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动依赖Node>=20、能加载Cordis bundle的DSH、Host webServer以及浏览器模块加载器、React和slots；余额另需已登录的deepseekAccount，服务缺失或未登录不应阻断形象显示。包未声明具体宿主版本，因此注册可见不代表兼容已验收。用户按README从Git仓库添加插件，在设置选图、调阈值或关闭去背、审阅预览并保存，成功后Host返回版本，同页事件推动overlay刷新。拖动位置保存在浏览器localStorage，艺术图保存在Host，两者恢复与迁移范围不同。客户端每60秒请求余额，变为可见或点击会刷新；Host普通请求缓存60秒，点击强制绕过。失败先看预览与HTTP错误，素材不适合时切整图；恢复默认通过DELETE移除自定义艺术，不等于卸载清理全部数据。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:20-51](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/package.json#L20-L51)

Node和web客户端、bundle声明；未给宿主精确兼容范围。

<details>
<summary>查看原文（32行）</summary>

```text
    "url": "git+https://github.com/AlannerFranklin/dsh-cutout-pet.git"
  },
  "icon": "icon.svg",
  "type": "module",
  "engines": {
    "node": ">=20"
  },
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg"
  },
  "files": [
    "index.js",
    "client.js",
    "cordis.patch.yml",
    "locale/*.json",
    "icon.svg",
    "assets/default.png",
    "README.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": []
    }
  }
}
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/cordis.patch.yml#L1-L3)

bundle插入插件记录。

```text
- insert:
    - id: cutout-pet
      name: dsh-cutout-pet
```

**依据 3 · 源码核查**：[index.js:19-20](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/index.js#L19-L20)

Host强制注入webServer。

```text
/** Both halves need the HTTP carrier; a missing one keeps this row pending. */
export const inject = ['webServer']
```

**依据 4 · 源码核查**：[client.js:620-655](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L620-L655)

轮询、可见性和同页图像事件监听及清理。

<details>
<summary>查看原文（36行）</summary>

```text
                if (!response.ok) throw new Error(`HTTP ${response.status}`)
                const body = await response.json()
                if (!alive.current) return
                setView(viewOf(body, t, activeLocale))
                if (typeof body.artVersion === 'number' && body.artVersion !== artVersion) {
                  setArtVersion(body.artVersion)
                  setArtMissing(false)
                  setArtAttempt(0)
                }
              } catch {
                if (!alive.current) return
                setView({ phase: 'error', text: t('error'), note: t('retry') })
              }
            },
            [activeLocale, t, artVersion],
          )

          React.useEffect(() => {
            alive.current = true
            void load(false)
            const timer = window.setInterval(() => void load(false), REFRESH_MS)
            const onVisible = () => {
              if (document.visibilityState === 'visible') void load(false)
            }
            const onArt = () => void load(true)
            document.addEventListener('visibilitychange', onVisible)
            window.addEventListener(ART_EVENT, onArt)
            return () => {
              alive.current = false
              window.clearInterval(timer)
              document.removeEventListener('visibilitychange', onVisible)
              window.removeEventListener(ART_EVENT, onArt)
            }
          }, [load])

          React.useEffect(() => {
```

</details>

**依据 5 · 源码核查**：[client.js:957-975](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L957-L975)

恢复默认流程删除Host艺术并更新本页状态。

<details>
<summary>查看原文（19行）</summary>

```text
          const reset = async () => {
            setBusy(true)
            try {
              const response = await fetch(UPLOAD_URL, { method: 'DELETE', headers: { accept: 'application/json' } })
              const value = await response.json()
              if (!alive.current) return
              setState(value)
              setPreview(null)
              const source = sourceRef.current
              if (source && source.url) URL.revokeObjectURL(source.url)
              sourceRef.current = null
              setBusy(false)
              setStatus({ kind: 'ok', text: t('resetDone') })
              window.dispatchEvent(new CustomEvent(ART_EVENT, { detail: { version: value.version } }))
            } catch {
              if (!alive.current) return
              setBusy(false)
              setStatus({ kind: 'error', text: t('error') })
            }
```

</details>

<a id="research-q06"></a>

<a id="detail-section-20"></a>

### Q06 · 首次、持续、失败恢复成本和效果能证明多少？

**研究主题**：效果与总成本

#### 完整回答

以“一张用户认可的图像保存并在重载后可见，余额状态正确”为合格任务单位。首次需要用户挑图、试阈值和审阅；浏览器本地计算不需要抠图模型调用，Host余额服务另有联网，不能因此把总成本写为免费。长边560的预缩放限制像素处理规模，但原始图片仍须先浏览器解码，极大输入的峰值内存未量化。持续运行有CSS动画、pointermove处理、每页60秒请求及Host图像文件读取；未测CPU、内存、电量和多标签负载。失败可能需要重新选图、切整图或外部编辑，细长图还可能遇到服务端尺寸拒绝。无现金价格、人工耗时和合格率数据，无法计算单位成本或宣称效率收益。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:33-36](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L33-L36)

限制处理和输出尺寸，不是对输入文件解码内存的完整限制。

```text
      const MAX_PROCESS_SIDE = 560
      const OUTPUT_WIDTH = 480
      const OUTLINE_RADIUS = 3
      const DEFAULT_TOLERANCE = 56
```

**依据 2 · 源码核查**：[client.js:417-462](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L417-L462)

图片先按比例drawImage再读取像素。

<details>
<summary>查看原文（46行）</summary>

```text
      function cutoutFromImage(image, options) {
        const sourceWidth = image.naturalWidth || image.width
        const sourceHeight = image.naturalHeight || image.height
        const scale = Math.min(1, MAX_PROCESS_PIXELS / Math.max(sourceWidth, sourceHeight))
        const width = Math.max(1, Math.round(sourceWidth * scale))
        const height = Math.max(1, Math.round(sourceHeight * scale))

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const context = canvas.getContext('2d', { willReadFrequently: true })
        context.drawImage(image, 0, 0, width, height)
        const pixels = context.getImageData(0, 0, width, height)

        if (options.removeBackground) {
          removeBackground(pixels.data, width, height, options.tolerance)
          keepMainSilhouette(pixels.data, width, height)
          featherAlpha(pixels.data, width, height)
        }
        context.putImageData(pixels, 0, 0)

        const box = alphaBox(pixels.data, width, height, 8)
        if (box === null) throw new Error('empty-image')

        const pad = 2
        const left = Math.max(0, box.x - pad)
        const top = Math.max(0, box.y - pad)
        const right = Math.min(width, box.x + box.width + pad)
        const bottom = Math.min(height, box.y + box.height + pad)
        const croppedWidth = right - left
        const croppedHeight = bottom - top

        const cropped = document.createElement('canvas')
        cropped.width = croppedWidth
        cropped.height = croppedHeight
        const croppedContext = cropped.getContext('2d')
        croppedContext.drawImage(canvas, left, top, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight)

        const outputWidth = Math.min(OUTPUT_WIDTH, croppedWidth)
        const outputHeight = Math.max(1, Math.round((croppedHeight * outputWidth) / croppedWidth))
        const output = document.createElement('canvas')
        output.width = outputWidth
        output.height = outputHeight
        output.getContext('2d').drawImage(cropped, 0, 0, outputWidth, outputHeight)

        return withOutline(output)
```

</details>

**依据 3 · 源码核查**：[client.js:620-655](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L620-L655)

每挂载页面轮询；没有页面隐藏时停表逻辑。

<details>
<summary>查看原文（36行）</summary>

```text
                if (!response.ok) throw new Error(`HTTP ${response.status}`)
                const body = await response.json()
                if (!alive.current) return
                setView(viewOf(body, t, activeLocale))
                if (typeof body.artVersion === 'number' && body.artVersion !== artVersion) {
                  setArtVersion(body.artVersion)
                  setArtMissing(false)
                  setArtAttempt(0)
                }
              } catch {
                if (!alive.current) return
                setView({ phase: 'error', text: t('error'), note: t('retry') })
              }
            },
            [activeLocale, t, artVersion],
          )

          React.useEffect(() => {
            alive.current = true
            void load(false)
            const timer = window.setInterval(() => void load(false), REFRESH_MS)
            const onVisible = () => {
              if (document.visibilityState === 'visible') void load(false)
            }
            const onArt = () => void load(true)
            document.addEventListener('visibilitychange', onVisible)
            window.addEventListener(ART_EVENT, onArt)
            return () => {
              alive.current = false
              window.clearInterval(timer)
              document.removeEventListener('visibilitychange', onVisible)
              window.removeEventListener(ART_EVENT, onArt)
            }
          }, [load])

          React.useEffect(() => {
```

</details>

**依据 4 · 源码核查**：[index.js:254-258](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/index.js#L254-L258)

每次余额响应附带artState，读取当前艺术文件。

```text
    if (route === BALANCE_PATH) {
      if (req.method !== 'GET' && req.method !== 'HEAD') return sendJson(res, 405, { ok: false, reason: 'method' })
      const answer = await balanceAnswer(ctx, url, url.searchParams.get('refresh') === '1')
      const state = await artState()
      return sendJson(res, 200, { ...answer, artVersion: state.version, hasCustom: state.hasCustom })
```

#### 缺口

- 缺少真实运行资源、合格率、人工时间和服务成本记录
  **影响**：不能给量化成本或收益排序
  **进一步探讨**：记录上述合格任务的首次/日常/失败总时间、进程资源和请求量，并与整图及外部编辑方案同条件比较

<a id="research-q07"></a>

<a id="detail-section-21"></a>

### Q07 · 资源清理、输入校验和状态策略可借鉴处与缺陷是什么？

**研究主题**：工程质量与复用

#### 完整回答

职责分为浏览器像素流水线与Host文件/账户服务，部署不需图像处理依赖；effects清理定时器和监听器、对象URL退出时回收、localStorage失败静默降级、reduced-motion关闭主要动画，都是可借鉴的局部设计。上传长度和尺寸限制加rename降低意外输入与半写文件风险，但不等于完整PNG验证：未检查IHDR类型/CRC及完整解码；并发上传共享art.png.tmp且没有互斥，存在竞争条件，未运行复现。artState把任意读文件错误都作为无自定义图，删除也吞掉错误，可能让权限故障与正常不存在混淆。布局按固定640/480估计高度，图片实际height:auto，对极端比例可产生边界定位偏差。包没有测试脚本或固定宿主兼容测试；client的“smoke test”注释不构成可检查测试交付。移植像素函数相对独立，移植整体还需替换__ModuleLoader__、slots、locale、deepseekAccount和样式token。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:214-241](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/index.js#L214-L241)

校验停止于签名、大小和宽高，不能声称完整解码验证。

<details>
<summary>查看原文（28行）</summary>

```text
function decodeUpload(input) {
  const dataUrl = typeof input?.png === 'string' ? input.png : ''
  const match = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl)
  if (match === null) {
    const error = new Error('png must be a base64 image/png data URL')
    error.code = 'malformed'
    throw error
  }
  const bytes = Buffer.from(match[1], 'base64')
  if (bytes.length < 64 || bytes.length > MAX_UPLOAD_BYTES) {
    const error = new Error(`png must be between 64 bytes and ${MAX_UPLOAD_BYTES} bytes`)
    error.code = 'size'
    throw error
  }
  if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    const error = new Error('png signature missing')
    error.code = 'malformed'
    throw error
  }
  // IHDR follows the signature: width and height are big-endian 32-bit values.
  const width = bytes.readUInt32BE(16)
  const height = bytes.readUInt32BE(20)
  if (width < MIN_ART_SIDE || height < MIN_ART_SIDE || width > MAX_ART_SIDE || height > MAX_ART_SIDE) {
    const error = new Error(`png sides must be between ${MIN_ART_SIDE} and ${MAX_ART_SIDE} pixels`)
    error.code = 'size'
    throw error
  }
  return bytes
```

</details>

**依据 2 · 源码核查**：[index.js:284-296](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/index.js#L284-L296)

固定tmp名；删除错误吞掉。

<details>
<summary>查看原文（13行）</summary>

```text
    if (route === UPLOAD_PATH) {
      if (req.method === 'POST') {
        const body = await readJsonBody(req, MAX_REQUEST_BYTES)
        const bytes = decodeUpload(body)
        await mkdir(DATA_DIR, { recursive: true })
        const temporary = `${ART_FILE}.tmp`
        await writeFile(temporary, bytes)
        await rename(temporary, ART_FILE)
        return sendJson(res, 200, await artState())
      }
      if (req.method === 'DELETE') {
        await unlink(ART_FILE).catch(() => undefined)
        return sendJson(res, 200, await artState())
```

</details>

**依据 3 · 源码核查**：[index.js:114-129](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/index.js#L114-L129)

任意read/stat错误返回null。

<details>
<summary>查看原文（16行）</summary>

```text
async function readCustomArt() {
  try {
    const [bytes, info] = await Promise.all([readFile(ART_FILE), stat(ART_FILE)])
    return { bytes, version: Math.round(info.mtimeMs) }
  } catch {
    return null
  }
}

/**
 * Snapshot of what the pet should draw right now.
 * @returns {Promise<{ ok: true, hasCustom: boolean, version: number }>} state.
 */
async function artState() {
  const custom = await readCustomArt()
  return { ok: true, hasCustom: custom !== null, version: custom === null ? 0 : custom.version }
```

</details>

**依据 4 · 源码核查**：[client.js:132-135](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L132-L135)

支持prefers-reduced-motion但未处理所有指针反馈。

```text
@media (prefers-reduced-motion: reduce) {
  .cp-sway, .cp-breathe, .cp-sparkle { animation: none; }
  .cp-figure { transition: none; }
}
```

**依据 5 · 源码核查**：[client.js:1071-1108](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L1071-L1108)

测试接缝注释和宿主耦合接口可直接定位。

<details>
<summary>查看原文（38行）</summary>

```text
      return {
        inject: ['slots'],
        // Test seams: the package's smoke test drives the pixel pipeline directly.
        __cutout: cutoutFromImage,
        __internals: { removeBackground, keepMainSilhouette, featherAlpha, alphaBox, dilateMask },
        apply(ctx) {
          const locale = ctx.get('locale')

          if (locale && typeof locale.register === 'function') {
            ctx.effect(() => {
              const disposers = [
                locale.register(NAMESPACE, 'zh', DICT.zh),
                locale.register(NAMESPACE, 'en', DICT.en),
              ]
              return () => disposers.forEach((dispose) => dispose())
            })
          }

          const translate =
            locale && typeof locale.bind === 'function'
              ? locale.bind(NAMESPACE)
              : (key) => DICT.zh[key] ?? key

          const Pet = createPet({ t: translate, locale })
          const Settings = createSettings({ t: translate })

          ctx.slots.inject('shell.overlay', () =>
            ctx.slots.register(
              { name: 'shell.overlay', id: 'cutout-pet', order: 60, label: () => translate('title') },
              Pet,
            ),
          )

          ctx.slots.inject('settings.section', () =>
            ctx.slots.register(
              { name: 'settings.section', id: 'cutout-pet', order: 35, label: () => translate('settingsLabel') },
              Settings,
            ),
```

</details>

#### 缺口

- 共享临时文件并发保存、权限错误吞没和极端比例布局的实际影响未实测
  **影响**：不能确定竞争条件、错误归类和布局假设在实际宿主中的触发率与数据恢复后果
  **进一步探讨**：在独立profile用两个标签并发保存并核对响应与最终艺术，注入权限失败检查恢复提示，对极端比例和小视口记录可见范围

<a id="research-q08"></a>

<a id="detail-section-22"></a>

### Q08 · 怎样在不引入分割服务前改善抠图失败和预览可信度？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是让“预览到可保存艺术”的资格检查成为单一共享契约，同时展示背景删除率、被过滤部件比例和尺寸拒绝原因，能比单纯提高容差减少误删与保存返工。推导依据是颜色键与连通域阈值对素材敏感，而且客户端输出短边可能低于Host下限。相对现有单预览，这一方案新增可解释警示及保存前同规则校验，不改变算法为语义分割，不增加外部图像服务。共享契约需明确版本与Host最终裁决，指标计算增加少量本地扫描及UI复杂度；低删除率也可能是正确保留复杂图，不能自动拒绝全部异常指标。最小验证选20张覆盖纯色、同色主体、细长图和多连通部件的授权素材，以现版预览和契约预检版盲序比较，记录主体误删、保存拒绝、人工调整次数及最终满意率。只有保存拒绝减少且误拒绝/操作时间未明显上升才支持；若警告不减少返工或用户无法理解指标，则否定这一改进方向。尚无实验，不计入现有创新或能力。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:299-304](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L299-L304)

固定面积阈值提供可解释误删指标线索。

```text
        if (sizes.length === 0) return
        const largest = Math.max(...sizes)
        const keepAbove = Math.max(64, largest * 0.02)
        for (let i = 0; i < total; i += 1) {
          if (mask[i] === 1 && sizes[label[i]] < keepAbove) data[at(i) + 3] = 0
        }
```

**依据 2 · 源码核查**：[client.js:455-462](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/client.js#L455-L462)

输出短边没有统一Host32像素约束。

```text
        const outputWidth = Math.min(OUTPUT_WIDTH, croppedWidth)
        const outputHeight = Math.max(1, Math.round((croppedHeight * outputWidth) / croppedWidth))
        const output = document.createElement('canvas')
        output.width = outputWidth
        output.height = outputHeight
        output.getContext('2d').drawImage(cropped, 0, 0, outputWidth, outputHeight)

        return withOutline(output)
```

**依据 3 · 源码核查**：[index.js:233-241](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/index.js#L233-L241)

Host尺寸条件可作为预检契约的明确基线。

```text
  // IHDR follows the signature: width and height are big-endian 32-bit values.
  const width = bytes.readUInt32BE(16)
  const height = bytes.readUInt32BE(20)
  if (width < MIN_ART_SIDE || height < MIN_ART_SIDE || width > MAX_ART_SIDE || height > MAX_ART_SIDE) {
    const error = new Error(`png sides must be between ${MIN_ART_SIDE} and ${MAX_ART_SIDE} pixels`)
    error.code = 'size'
    throw error
  }
  return bytes
```

#### 缺口

- 新增诊断是否改善用户决策未知
  **影响**：不能把假设描述成已实现或已验证收益
  **进一步探讨**：执行上述固定素材和共同验收标准的对照实验

<a id="research-q09"></a>

<a id="detail-section-23"></a>

### Q09 · 什么条件下值得试用，何时停止？

**研究主题**：采用判断

#### 完整回答

结论为有条件试用，适合明确想在DSH网页中展示自己的简单背景形象、接受手工审图且能使用隔离数据目录的用户。源代码支持本地处理与设置闭环，Git来源安装有具体路径；不要求账户登录就可试艺术，余额在已有账户服务时追加验证。试用先用非敏感小图，在独立DSH_HOME验证保存、重载、缩放、恢复默认；余额与账户原页面核对，切账号后强制刷新并确认不会沿用旧值。若图片远程上传边界不可接受、不能隔离共享数据目录、遮挡影响任务、图像保存或恢复不一致，就停止并禁用，保留原图后确认删除自定义艺术。没有同版本安装、核心流程和禁用卸载验收，不推荐直接持续安装。采用价值是装饰便利和轻量信息呈现，不是模型质量或工作产出改善。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-46](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/README.md#L28-L46)

作者给出Git来源安装与设置路径，不据此假定市场/npm可用。

<details>
<summary>查看原文（19行）</summary>

````text
## Install

From the plugin market (once listed):

```bash
dsh plugin --profile <profile> add dsh-cutout-pet
```

Straight from this repository:

```bash
dsh plugin --profile <profile> add github:AlannerFranklin/dsh-cutout-pet
```

or install the folder as a bundle from the Plugins page (`Install from folder`).

After installing, open **Settings → Cutout Pet**, choose an image, adjust *Background tolerance* if
needed, and press **Use as pet**.

````

</details>

**依据 2 · 源码核查**：[index.js:169-205](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/index.js#L169-L205)

可选账户服务、缓存和强制刷新形成具体核对条件。

<details>
<summary>查看原文（37行）</summary>

```text
async function balanceAnswer(ctx, url, force) {
  const fresh = force || Date.now() - cachedAt > CACHE_MS
  if (!fresh && cachedValue !== undefined) return cachedValue

  const account = ctx.get('deepseekAccount')
  if (account === undefined) {
    cachedValue = { ok: false, reason: 'unavailable', message: 'deepseekAccount service is not composed in this profile' }
    cachedAt = Date.now()
    return cachedValue
  }

  try {
    const balance = await account.getBalance(accountClient(url))
    if (balance === null) {
      const state = await account.getState().catch(() => undefined)
      cachedValue = state?.status === 'signed-out'
        ? { ok: false, reason: 'signed-out' }
        : { ok: false, reason: 'unavailable' }
      cachedAt = Date.now()
      return cachedValue
    }
    if (balance.status === 'failed') {
      cachedValue = { ok: false, reason: 'failed' }
      cachedAt = Date.now()
      return cachedValue
    }
    cachedValue = {
      ok: true,
      wallets: plainWallets(balance.value),
      bonusWallets: plainWallets(balance.bonusWallets),
      updatedAt: Date.now(),
    }
    cachedAt = Date.now()
    return cachedValue
  } catch (error) {
    // Never cache a transport failure: the next poll should try again.
    return { ok: false, reason: 'error', message: error instanceof Error ? error.message : String(error) }
```

</details>

**依据 3 · 源码核查**：[index.js:284-296](https://github.com/AlannerFranklin/dsh-cutout-pet/blob/98b2d7626406230ee9bd01aad029351e693078ed/index.js#L284-L296)

保存与恢复默认可作为最小试用验收点。

<details>
<summary>查看原文（13行）</summary>

```text
    if (route === UPLOAD_PATH) {
      if (req.method === 'POST') {
        const body = await readJsonBody(req, MAX_REQUEST_BYTES)
        const bytes = decodeUpload(body)
        await mkdir(DATA_DIR, { recursive: true })
        const temporary = `${ART_FILE}.tmp`
        await writeFile(temporary, bytes)
        await rename(temporary, ART_FILE)
        return sendJson(res, 200, await artState())
      }
      if (req.method === 'DELETE') {
        await unlink(ART_FILE).catch(() => undefined)
        return sendJson(res, 200, await artState())
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
