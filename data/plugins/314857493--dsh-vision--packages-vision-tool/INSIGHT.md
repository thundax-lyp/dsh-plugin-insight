# dsh-vision-free-eyes

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[1392730](https://github.com/314857493/dsh-vision/tree/139273049905f852f633c7641628212399ac83f5/packages/vision-tool)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/314857493/dsh-vision) [![npm 30d 1,220](https://img.shields.io/static/v1?label=npm+30d&message=1%2C220&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vision-free-eyes) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-vision-free-eyes)
<!-- END META -->

> **实现功能**：通过智谱GLM视觉API分析已知本地单张图片，提供图像问答与OCR工具。

> **核心亮点**：相对手写API脚本，把单图验证、问题参数和结果缓存装进宿主工具；视觉能力仍归属于外部模型。[Q01](#research-q01)、[Q02](#research-q02)

> **风险与缺陷**：所有错误统一回退，包括取消和鉴权；绝对图片路径不等用户授权或项目围栏，视觉文本也没有事实验证。[Q03](#research-q03)

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
  - [Q01 · 单图识别/OCR接入相对手工外部视觉API增加什么？](#detail-section-11)
  - [Q02 · 文件如何校验、编码、缓存并提交给视觉模型？](#detail-section-12)
  - [Q03 · 多模型回退能否区分取消、鉴权与可重试错误？](#detail-section-13)
  - [Q04 · 密钥、文件权限、模型兼容和恢复由谁负责？](#detail-section-14)
  - [Q05 · 一次合格识图的成本与可迁移工程设计有哪些边界？](#detail-section-15)
  - [Q06 · 按错误类型回退与绑定文件摘要的缓存能否改善可靠性，如何试用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合纯文本模型用户对非敏感本地单图提问并人工核对，不负责GUI附件发现。

简单替代是手工调用视觉API或宿主原生多模态；本次没有同条件性能排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| vision图像问答 | 回答指定图片问题 | 已知绝对路径，图片上传智谱 |
| OCR模式 | 逐字转写 | 仍需人工核字，非PDF |
| no_cache | 请求新结果 | 仅绕过本地缓存，仍外传 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22与兼容DSH tools服务 | 必需 | 注册和执行vision | 无法加载或调用 |
| GLM密钥及HTTPS | 必需 | 外部视觉识别 | 返回错误 |
| 已知可读单图与外传许可 | 必需 | 上传图片 | 格式/路径拒绝，权限仍由宿主管理 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户配置密钥并加载组件 | tools中出现vision |
| 调用 | 模型提交已知路径、问题和mode | 返回文字或明确错误 |
| 验收 | 用户对照图片事实 | 错误先排查，不盲目重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | API账号及本地运行资源，金额未知 | 配置密钥、加载、选图，耗时未知 | 需允许智谱处理图片 |
| 持续 | 单次可尝试3模型，缓存占内存 | 人工核对事实/OCR | 单位合格图账单与延迟未知 |
| 失败恢复 | 重复网络/模型请求 | 修正路径、账号或网络 | 取消和鉴权未分类 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工具接入 | 标准vision定义、单图验证 | 实际宿主兼容 |
| 重复请求 | 内容与提示摘要命中缓存 | 真实节省及隐私保留期 |
| 图片事实 | 提示要求不猜测 | 准确率、OCR正确率与人工节时 |

> **思考**：所有错误统一回退，包括取消和鉴权；绝对图片路径不等用户授权或项目围栏，视觉文本也没有事实验证。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手写API脚本，把单图验证、问题参数和结果缓存装进宿主工具；视觉能力仍归属于外部模型。[Q01](#research-q01)、[Q02](#research-q02)

相对手写API脚本，把单图验证、问题参数和结果缓存装进宿主工具；视觉能力仍归属于外部模型。[Q01](#research-q01)、[Q02](#research-q02)

参数及出站端点集中，魔数支持无后缀附件；内容+提示摘要比路径缓存稳健。Map淘汰并非严格LRU，先读文件再限大小，统一catch会放大无效回退。mock测试只支持参数/缓存性质。[Q02](#research-q02)、[Q05](#research-q05)

<a id="detail-section-5"></a>

### 1.4 主要限制

所有错误统一回退，包括取消和鉴权；绝对图片路径不等用户授权或项目围栏，视觉文本也没有事实验证。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用已知答案的非敏感图片核验问答、OCR、缓存和取消；确认外传可接受后限定试用，失败时检查错误再重试。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

工具集成机制由固定源码支持；识图准确性、账号额度和端到端收益未独立验证；设计假设保持未验证。

- 已检查：作者 README、包清单、源码路径 packages/vision-tool/index.js、packages/vision-tool/README.md、packages/vision-tool/package.json、packages/vision-tool/test-behavior.mjs 及固定范围 inventory；组件：packages/vision-tool。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查vision-tool组件及所列测试，不把同仓库附件路由算入能力；未核实外部API的当前价格、额度或真实运行。
- 下一步：可进一步用固定图片和故障矩阵核对取消、401、429、空结果与错字，分别计合格率、请求次数和人工复核时间。

**分析版本**

- **仓库**：[314857493/dsh-vision](https://github.com/314857493/dsh-vision)
- **版本号**：0.1.5（[固定提交 1392730](https://github.com/314857493/dsh-vision/tree/139273049905f852f633c7641628212399ac83f5)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是按错误类别终止/回退并返回模型与摘要收据，减少无效请求及核对歧义；以故障矩阵和人工图像核验支持或推翻。[Q06](#research-q06)

可进一步用固定图片和故障矩阵核对取消、401、429、空结果与错字，分别计合格率、请求次数和人工复核时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 233 | 194 | 30 | — |
| .md | source | 2 | 103 | — | — | 1233 |
| .mjs | source | 4 | 191 | 160 | 11 | — |
| .mjs | test | 1 | 21 | 16 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/314857493/dsh-vision/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对单图视觉工具的集成贡献、数据和故障边界，并判断可控试用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 单图识别/OCR接入相对手工外部视觉API增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它为使用纯文本模型、已持有单张本地图路径的人提供模型可调用的视觉桥接。合格结果是对指定问题给出可核查的图像事实，OCR则要求逐字转写；GUI附件自动发现不在本组件范围。相对手工上传或写HTTP脚本，增量在统一工具参数、无扩展名文件识别和调用内缓存；视觉判断来自智谱模型，不能归为本插件原创识别能力。作者称免费，但本轮未核实账号额度与服务价格，不能当作持续零成本承诺。

#### 证据与依据

**依据 1 · 作者声明**：[packages/vision-tool/README.md:5-9](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/README.md#L5-L9)

作者限定纯文本模型与单图工具的定位。

```text
给 DeepSeek Harness（DSH）的纯文本模型补上免费「眼睛」：一个分析已知本地图片路径的
`vision(image, question)` 工具，
**直连智谱 GLM 免费视觉 API**（glm-4v-flash → glm-4.6v-flash → glm-4.1v-thinking-flash 自动降级链），
不依赖任何额外安装的 CLI。完整说明见仓库根目录的
[README](https://github.com/314857493/dsh-vision#readme)。
```

**依据 2 · 作者声明**：[packages/vision-tool/README.md:48-63](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/README.md#L48-L63)

作者明确问题、OCR和GUI附件边界。

<details>
<summary>查看原文（16行）</summary>

```text
## 使用

告诉模型单个图片文件的已知绝对路径即可，例如："看一下 `D:\xxx\screenshot.png`"。默认 `image` 模式使用
完整 GLM 视觉语言模型理解图片并回答 `question`；只有用户明确要求逐字提取时才用 `mode="ocr"`。
`no_cache=true` 可跳过进程内结果缓存。

工具会在联网前强制检查绝对路径、单文件类型和图片文件魔数；目录、相对路径以及非
png/jpeg/webp/gif/bmp 内容会直接拒绝。模型不应在调用前用 shell 预检路径；目录错误是停止条件，
即使目录里似乎只有一张图片也不会自行遍历，不会把普通本地文件伪装成图片上传。
图片理解会保持用户问题的范围和详细程度，只陈述能够确认的可见事实，并区分总数、当前项与
额外/折叠项等计数语义；简要概述不会逐项转写正文，界面分析也会区分地址栏、搜索框等区域。
单一事实问题只返回所问事实和必要限定，不主动附加未经询问的元素位置或上下文。

该工具不会自动解析 GUI 粘贴/上传附件，也不应遍历 DSH 附件目录猜测图片路径。GUI 贴图请使用
「… + 自动识图」路由；路由已经提供图片描述时，模型应直接使用描述，不要再次调用本工具。
输出为图片内容的纯文字描述，不附加内部耗时标记。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件如何校验、编码、缓存并提交给视觉模型？

**研究主题**：功能与机制

#### 完整回答

execute先拒绝空值、相对路径和未知mode，analyze再stat要求普通文件，读取后验证非空、15MB及魔数，最后获取密钥。图像字节编码成data URL，与问题提示一同POST到固定端点。缓存键由图片内容、mode、最终prompt的摘要组成，因此同一图片不同问题不会共用答案；缓存最多200条且按插入顺序淘汰，命中并不刷新顺序，源码注释所称LRU并非严格访问LRU。整个文件先读入内存才检查大小，大小上限不能阻止大文件读取的短时内存负担。

#### 证据与依据

**依据 1 · 源码核查**：[packages/vision-tool/index.js:129-173](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/index.js#L129-L173)

主链限定读取、网络提交与缓存键。

<details>
<summary>查看原文（45行）</summary>

```text
/** Describe / OCR one image file via the GLM API. */
async function analyze(imagePath, mode, question, signal, config) {
  const imageStat = await stat(imagePath)
  if (imageStat.isDirectory()) {
    throw new Error('image 必须指向单个图片文件，当前路径是目录；请指定具体图片文件')
  }
  if (!imageStat.isFile()) {
    throw new Error('image 必须指向单个普通图片文件')
  }
  const buf = await readFile(imagePath)
  if (buf.byteLength === 0) throw new Error('图片文件为空')
  if (buf.byteLength > MAX_IMAGE_BYTES) {
    throw new Error(`图片 ${(buf.byteLength / 1048576).toFixed(1)}MB 超过 15MB 上限`)
  }
  const mime = sniffMime(buf)
  if (!mime) {
    throw new Error('不支持的图片格式：文件内容不是 png/jpg/jpeg/webp/gif/bmp 图片')
  }
  const key = await resolveGlmKey(config)
  if (!key) {
    throw new Error('未找到 GLM_API_KEY / ZHIPU_API_KEY（请配置智谱 GLM 免费 key，格式 id.secret）')
  }
  const userQuestion = typeof question === 'string' ? question.trim().slice(0, 4000) : ''
  const prompt = mode === 'ocr'
    ? OCR_PROMPT
    : userQuestion ? `${IMAGE_PROMPT_BASE}\n用户问题：${userQuestion}` : IMAGE_PROMPT_BASE
  const imageHash = createHash('sha256').update(buf).digest('hex')
  const promptHash = createHash('sha256').update(prompt).digest('hex')
  const cacheKey = `${imageHash}:${mode}:${promptHash}`
  if (!config?.no_cache) {
    const hit = CACHE.get(cacheKey)
    if (hit !== undefined) return hit
  }
  const imageUrl = `data:${mime};base64,${buf.toString('base64')}`
  let lastError
  for (const model of VISION_MODELS) {
    try {
      const text = (await callGlm(model, imageUrl, prompt, key, signal)).trim()
      if (!config?.no_cache) setCache(cacheKey, text)
      return text
    } catch (error) {
      lastError = error
    }
  }
  throw new Error(`所有 GLM 视觉通道失败: ${lastError?.message ?? ''}`)
```

</details>

**依据 2 · 源码核查**：[packages/vision-tool/index.js:59-68](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/index.js#L59-L68)

Map淘汰不在get时更新顺序。

<details>
<summary>查看原文（10行）</summary>

```text
// In-process result cache keyed by image bytes + mode + prompt, LRU-capped.
const CACHE = new Map()
const CACHE_MAX = 200
function setCache(key, value) {
  if (CACHE.size >= CACHE_MAX) {
    const first = CACHE.keys().next().value
    if (first !== undefined) CACHE.delete(first)
  }
  CACHE.set(key, value)
}
```

</details>

**依据 3 · 源码核查**：[packages/vision-tool/index.js:217-230](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/index.js#L217-L230)

工具入口验证绝对路径和模式。

<details>
<summary>查看原文（14行）</summary>

```text
    async execute(args, exec) {
      if (typeof args.image !== 'string' || !args.image.trim()) {
        throw new Error('missing required parameter: image')
      }
      const imagePath = args.image.trim()
      if (!isAbsolute(imagePath)) {
        throw new Error('image 必须是已知本地图片的绝对路径')
      }
      const mode = args.mode ?? 'image'
      if (mode !== 'image' && mode !== 'ocr') {
        throw new Error(`unknown vision mode "${args.mode}" (expected image|ocr)`)
      }
      const executionConfig = args.no_cache ? { ...config, no_cache: true } : config
      return analyze(imagePath, mode, args.question, exec.signal, executionConfig)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 多模型回退能否区分取消、鉴权与可重试错误？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能。每次调用设置60秒定时器并合并宿主取消signal，但最外层对所有异常统一捕获，再尝试下一个模型。401、429、超时、取消、空内容没有不同策略；三个模型共用账号和端点，因此回退只可能覆盖模型差异，不能自动修复共享鉴权或网络问题。成功响应仍可能视觉误判，提示“不猜测”没有输出验证器。路径仅要求绝对普通图片，stat跟随符号链接且没有项目根约束，因此权限依赖调用者和宿主；魔数检查是格式门槛，不是用户授权或图片完整解码保证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/vision-tool/index.js:93-126](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/index.js#L93-L126)

请求异常、取消与空输出都通过throw进入统一回退。

<details>
<summary>查看原文（34行）</summary>

```text
/** One GLM chat/completions call with the given model; throws on non-2xx. */
async function callGlm(model, imageUrl, prompt, key, signal) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort('glm-timeout'), TIMEOUT_MS)
  const combined = signal === undefined
    ? controller.signal
    : AbortSignal.any([signal, controller.signal])
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: prompt },
          ],
        }],
      }),
      signal: combined,
    })
    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new Error(`GLM ${model} HTTP ${response.status}: ${detail.slice(0, 200)}`)
    }
    const data = await response.json()
    const text = data?.choices?.[0]?.message?.content
    if (!text) throw new Error(`GLM ${model} returned empty content`)
    return text
  } finally {
    clearTimeout(timer)
  }
```

</details>

**依据 2 · 源码核查**：[packages/vision-tool/index.js:131-145](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/index.js#L131-L145)

stat及内容验证没有root或realpath围栏。

<details>
<summary>查看原文（15行）</summary>

```text
  const imageStat = await stat(imagePath)
  if (imageStat.isDirectory()) {
    throw new Error('image 必须指向单个图片文件，当前路径是目录；请指定具体图片文件')
  }
  if (!imageStat.isFile()) {
    throw new Error('image 必须指向单个普通图片文件')
  }
  const buf = await readFile(imagePath)
  if (buf.byteLength === 0) throw new Error('图片文件为空')
  if (buf.byteLength > MAX_IMAGE_BYTES) {
    throw new Error(`图片 ${(buf.byteLength / 1048576).toFixed(1)}MB 超过 15MB 上限`)
  }
  const mime = sniffMime(buf)
  if (!mime) {
    throw new Error('不支持的图片格式：文件内容不是 png/jpg/jpeg/webp/gif/bmp 图片')
```

</details>

**依据 3 · 源码核查**：[packages/vision-tool/index.js:163-173](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/index.js#L163-L173)

全异常回退缺少分类。

<details>
<summary>查看原文（11行）</summary>

```text
  let lastError
  for (const model of VISION_MODELS) {
    try {
      const text = (await callGlm(model, imageUrl, prompt, key, signal)).trim()
      if (!config?.no_cache) setCache(cacheKey, text)
      return text
    } catch (error) {
      lastError = error
    }
  }
  throw new Error(`所有 GLM 视觉通道失败: ${lastError?.message ?? ''}`)
```

</details>

#### 缺口

- 各模型真实错误率、取消后额外请求与视觉准确性未量化
  **影响**：不能确定回退是否改善端到端合格率
  **进一步探讨**：用固定无敏感图片集记录各类故障下请求次数、取消时延和人工事实核对结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 密钥、文件权限、模型兼容和恢复由谁负责？

**研究主题**：依赖、兼容与流程

#### 完整回答

用户需要兼容DSH、Node运行时、可读文件、有效GLM密钥和可达HTTPS端点。注册只依赖宿主tools服务，不额外导入官方运行时；Windows在环境变量未找到后只查询GLM_API_KEY注册表值，虽然默认环境变量列表含ZHIPU_API_KEY，注册表回退没有同等覆盖。失败返回错误而不写文件，用户负责修正路径、凭据或网络后重试。图片始终发送给智谱，no_cache仅停用本地结果缓存，不改变出站数据边界；不适合不允许第三方处理的图片。

#### 证据与依据

**依据 1 · 源码核查**：[packages/vision-tool/index.js:70-90](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/index.js#L70-L90)

密钥来源及Windows回退的具体范围。

<details>
<summary>查看原文（21行）</summary>

```text
async function resolveGlmKey(config) {
  const envNames = Array.isArray(config?.apiKeyEnv) ? config.apiKeyEnv
    : typeof config?.apiKeyEnv === 'string' && config.apiKeyEnv ? [config.apiKeyEnv]
    : ['GLM_API_KEY', 'ZHIPU_API_KEY']
  for (const name of envNames) {
    const v = process.env[name]
    if (v && v.trim()) return v.trim()
  }
  try {
    // Windows user env may postdate the running dsh process; read the registry.
    const { stdout } = await execFileAsync(
      'reg',
      ['query', 'HKCU\\Environment', '/v', 'GLM_API_KEY'],
      { windowsHide: true, timeout: 5000 },
    )
    const m = stdout.match(/GLM_API_KEY\s+REG_SZ\s+(\S+)/)
    if (m && m[1].trim()) return m[1].trim()
  } catch {
    // fall through
  }
  return undefined
```

</details>

**依据 2 · 源码核查**：[packages/vision-tool/index.js:179-185](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/index.js#L179-L185)

宿主注入工具注册。

```text
export function apply(ctx, config = {}) {
  // Register the public ToolDefinition shape directly. Importing
  // @deepseek-ai/dsh-tools from a third-party bundle would either install a
  // second copy of an official runtime component or fail when optional peers
  // are absent from the profile. The injected `tools` service owns validation
  // and execution; this bundle only contributes its definition.
  ctx.tools.register({
```

**依据 3 · 作者声明**：[packages/vision-tool/README.md:27-43](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/README.md#L27-L43)

作者声明运行及数据边界。

<details>
<summary>查看原文（17行）</summary>

```text
## 前提

- DSH `0.1.0-rc.8`、`0.1.1-rc.1`、`0.1.1-rc.2`、`0.1.2-rc.1` 或 `0.2.1-rc.2`。
- **必须**：智谱 GLM 免费 key，环境变量 `GLM_API_KEY` 或 `ZHIPU_API_KEY`
  （[open.bigmodel.cn](https://open.bigmodel.cn) 注册即得，格式 `id.secret`；Windows 也可 `setx`，插件自动读注册表）。
- 出站 HTTPS 到 `open.bigmodel.cn`。

插件通过 DSH 注入的 `tools` 服务注册标准 ToolDefinition，不安装或直接导入
`@deepseek-ai/dsh-tools` 等官方运行时包。

## 权限与证据边界

- 只读取调用者明确给出的一个绝对图片路径，并只向固定的智谱 HTTPS 端点发送图片字节。
- 只读取 GLM 环境变量；Windows 环境变量缺失时使用固定参数执行系统自带的只读 `reg query`，
  不使用 shell 字符串，也不记录或持久化 Key。
- 无 npm 运行依赖和安装期生命周期脚本；只新增 `dsh-vision-free-eyes` Entry ID，不写 DSH Profile
  或替换官方组件。完整边界见 [SECURITY.md](SECURITY.md)。
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 一次合格识图的成本与可迁移工程设计有哪些边界？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

以人工确认事实/转写正确的一张图片为单位，首次需要配置密钥和加载，持续调用可能走三个模型，重复完全相同问题可复用进程缓存。没有真实调用账单、延迟和合格率，不能计算合格图片单位成本或节时。可复用的是固定端点、参数闭合、魔数校验和问题敏感缓存，但缓存可能保留敏感答案至进程退出，且不区分账号/模型版本。测试用mock fetch断言路径、问题和缓存行为，是机制回归材料，不是GLM服务或真实图像识别证据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/vision-tool/index.js:155-173](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/index.js#L155-L173)

缓存减少相同输入请求，但失败可扩大调用次数。

<details>
<summary>查看原文（19行）</summary>

```text
  const imageHash = createHash('sha256').update(buf).digest('hex')
  const promptHash = createHash('sha256').update(prompt).digest('hex')
  const cacheKey = `${imageHash}:${mode}:${promptHash}`
  if (!config?.no_cache) {
    const hit = CACHE.get(cacheKey)
    if (hit !== undefined) return hit
  }
  const imageUrl = `data:${mime};base64,${buf.toString('base64')}`
  let lastError
  for (const model of VISION_MODELS) {
    try {
      const text = (await callGlm(model, imageUrl, prompt, key, signal)).trim()
      if (!config?.no_cache) setCache(cacheKey, text)
      return text
    } catch (error) {
      lastError = error
    }
  }
  throw new Error(`所有 GLM 视觉通道失败: ${lastError?.message ?? ''}`)
```

</details>

**依据 2 · 源码核查**：[packages/vision-tool/test-behavior.mjs:38-55](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/test-behavior.mjs#L38-L55)

测试以简化字节与mock响应运行，不验证视觉效果。

<details>
<summary>查看原文（18行）</summary>

```text
await writeFile(fixturePath, Uint8Array.of(137, 80, 78, 71, 13, 10, 26, 10))
await writeFile(nonImagePath, 'not image bytes')

let calls = 0
const prompts = []
globalThis.fetch = async (_url, options) => {
  calls += 1
  const body = JSON.parse(options.body)
  const prompt = body.messages[0].content[1].text
  prompts.push(prompt)
  return {
    ok: true,
    async json() {
      return { choices: [{ message: { content: `answer:${prompt}` } }] }
    },
  }
}
process.env.GLM_API_KEY = 'test-id.test-secret'
```

</details>

**依据 3 · 源码核查**：[packages/vision-tool/test-behavior.mjs:57-85](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/test-behavior.mjs#L57-L85)

断言路径拒绝和缓存命中。

<details>
<summary>查看原文（29行）</summary>

```text
try {
  await assert.rejects(
    tool.execute({ image: 'relative-image.png', question: '看看' }, { signal: undefined }),
    /绝对路径/,
  )
  await assert.rejects(
    tool.execute({ image: fixtureDir, question: '看看' }, { signal: undefined }),
    /当前路径是目录；请指定具体图片文件/,
  )
  await assert.rejects(
    tool.execute({ image: nonImagePath, question: '看看' }, { signal: undefined }),
    /不支持的图片格式/,
  )
  assert.equal(calls, 0)

  const first = await tool.execute(
    { image: fixturePath, question: '这是什么？' },
    { signal: undefined },
  )
  assert.match(first, /answer:[\s\S]*用户问题：这是什么？$/)
  assert.doesNotMatch(first, /\[glm \|/)
  assert.equal(calls, 1)

  const cached = await tool.execute(
    { image: fixturePath, question: '这是什么？' },
    { signal: undefined },
  )
  assert.equal(cached, first)
  assert.equal(calls, 1)
```

</details>

#### 缺口

- 缺少同条件手工API与工具调用的合格率、账单、人工耗时
  **影响**：无法确认集成便利是否转化为净收益
  **进一步探讨**：以相同图片与问题比较两流程，并计入失败重试和人工校对

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 按错误类型回退与绑定文件摘要的缓存能否改善可靠性，如何试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

图片内容摘要缓存已经实现，新假设应落在故障策略与审计而非重复发明缓存。可把取消与鉴权设为立即终止，仅对模型不支持/临时故障回退，并返回模型、文件摘要和缓存命中收据；预期减少无效请求并便于核对，代价是维护错误分类和暴露更多元数据。可用mock故障矩阵先比较取消后的调用次数，再以非敏感图片做小批量人工核验；若合格率下降或错误分类经常阻断可恢复请求，假设应被否定。建议对已有合法GLM账号、允许图片外传且能人工校验的人限定试用，不替代原生多模态输入，不直接持续安装推荐。

#### 证据与依据

**依据 1 · 源码核查**：[packages/vision-tool/index.js:93-126](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/index.js#L93-L126)

错误统一入口是分类回退的推导依据。

<details>
<summary>查看原文（34行）</summary>

```text
/** One GLM chat/completions call with the given model; throws on non-2xx. */
async function callGlm(model, imageUrl, prompt, key, signal) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort('glm-timeout'), TIMEOUT_MS)
  const combined = signal === undefined
    ? controller.signal
    : AbortSignal.any([signal, controller.signal])
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: prompt },
          ],
        }],
      }),
      signal: combined,
    })
    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new Error(`GLM ${model} HTTP ${response.status}: ${detail.slice(0, 200)}`)
    }
    const data = await response.json()
    const text = data?.choices?.[0]?.message?.content
    if (!text) throw new Error(`GLM ${model} returned empty content`)
    return text
  } finally {
    clearTimeout(timer)
  }
```

</details>

**依据 2 · 源码核查**：[packages/vision-tool/index.js:155-173](https://github.com/314857493/dsh-vision/blob/139273049905f852f633c7641628212399ac83f5/packages/vision-tool/index.js#L155-L173)

内容摘要与结果缓存可提供收据锚点。

<details>
<summary>查看原文（19行）</summary>

```text
  const imageHash = createHash('sha256').update(buf).digest('hex')
  const promptHash = createHash('sha256').update(prompt).digest('hex')
  const cacheKey = `${imageHash}:${mode}:${promptHash}`
  if (!config?.no_cache) {
    const hit = CACHE.get(cacheKey)
    if (hit !== undefined) return hit
  }
  const imageUrl = `data:${mime};base64,${buf.toString('base64')}`
  let lastError
  for (const model of VISION_MODELS) {
    try {
      const text = (await callGlm(model, imageUrl, prompt, key, signal)).trim()
      if (!config?.no_cache) setCache(cacheKey, text)
      return text
    } catch (error) {
      lastError = error
    }
  }
  throw new Error(`所有 GLM 视觉通道失败: ${lastError?.message ?? ''}`)
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
