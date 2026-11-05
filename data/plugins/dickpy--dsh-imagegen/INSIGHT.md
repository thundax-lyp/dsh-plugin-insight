# DSH ImageGen

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[075fb6e](https://github.com/dickpy/dsh-imagegen/tree/075fb6eb99e82dc173806354fcecb81decad2019)

<!-- BEGIN META -->
[![GitHub ★ 168](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=168&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dickpy/dsh-imagegen) [![npm 30d 12,287](https://img.shields.io/static/v1?label=npm+30d&message=12%2C287&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dickpy/dsh-imagegen) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dickpy/dsh-imagegen)
<!-- END META -->

> **功能**：在 DSH 使用多渠道生成和编辑图片，管理画布、历史与画廊。

> **亮点**：[Q01](#research-q01) 把渠道生成和作品记录串起来。

> **主要限制**：[Q03](#research-q03) 指定渠道缺失会回退，对象同步是独立出站路径。

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
  - [Q01 · 画布之外有哪些统一工作？](#detail-section-11)
  - [Q02 · 指定渠道缺失时怎么办？](#detail-section-12)
  - [Q03 · 生成图或参考图会留在哪？](#detail-section-13)
  - [Q04 · 如何评估后退出？](#detail-section-14)
  - [Q05 · 缺渠道时明确拒绝是否更好？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 做图的用户可评估一体化生成和历史。

独立图像工具与手工归档提供另一条工作流。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 渠道生成 | 创建图片 | 依赖网关 |
| 历史和同步 | 保存产物 | 同步非确认 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Web profile | 必需 | 使用界面 | 无法挂载 |
| 模型连接 | 生成必需 | 执行任务 | 不可生成 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 单渠道合成图 | 确认数据出口 |
| 核查 | 生成并查历史 | 区分保存和同步 |
| 退出 | 禁用插件 | 检查已存数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型与存储费未知 | 配置耗时未知 | 渠道需密钥 |
| 持续 | 模型费用未知 | 审核耗时未知 | 请求可能回退 |
| 恢复 | 重试开销未知 | 排查耗时未知 | 外部留存另查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 生成和留档 | 可追踪渠道及历史分支 | 质量与耗时 |

> **思考**：[Q03](#research-q03) 指定渠道缺失会回退，对象同步是独立出站路径。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把渠道生成和作品记录串起来。

生成结果和历史写入分开报告。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 指定渠道缺失会回退，对象同步是独立出站路径。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先只配一条测试渠道并保持同步关闭。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的渠道选择、生图持久化与对象同步。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/generation-runtime.ts、src/engine.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的渠道选择、生图持久化与对象同步。未执行目标代码或实际宿主验证。
- 下一步：用两路模拟服务复现失配

**分析版本**

- **仓库**：[dickpy/dsh-imagegen](https://github.com/dickpy/dsh-imagegen)
- **版本号**：1.15.4（[固定提交 075fb6e](https://github.com/dickpy/dsh-imagegen/tree/075fb6eb99e82dc173806354fcecb81decad2019)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 核查显式渠道缺失提示能否减少错发。

用两路模拟服务复现失配

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 36 | 1543 | — | — | 25878 |
| .mjs | test | 7 | 714 | 585 | 63 | — |
| .mjs | source | 18 | 8373 | 7464 | 729 | — |
| .ts | source | 76 | 25812 | 20522 | 3922 | — |
| .tsx | source | 34 | 16246 | 14509 | 1075 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/dickpy/dsh-imagegen/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：渠道选择、生图持久化与对象同步

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 画布之外有哪些统一工作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

创作者可在宿主设置渠道后发起生成。生成运行时把提示词、模型、尺寸和图像写入历史，省去手工整理。历史失败仍返回图与错误，生成成功和归档成功需分开看。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-35](https://github.com/dickpy/dsh-imagegen/blob/075fb6eb99e82dc173806354fcecb81decad2019/README.md#L18-L35)

作者描述渠道与历史

<details>
<summary>查看原文（18行）</summary>

````text
## 快速开始

需要已安装 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) 和 Node.js 20+。

```bash
dsh plugin --profile web add @dickpy/dsh-imagegen
```

安装后重启 `dsh web`，侧边栏会出现「生图」入口。到「设置 → 生图配置」添加提供方、填写 API 地址与密钥、检测并选择生图模型，保存后即可开始创作。Windows 若遇 PowerShell 脚本策略限制，请使用 `dsh.cmd`。

<details>
<summary><b>其他安装方式、升级与回滚</b></summary>

- **让 Agent 安装：**把上面的安装命令发给 DSH、Codex 或其他 coding agent。
- **指定版本：**使用 `@dickpy/dsh-imagegen@<版本号>`，或从 [GitHub Releases](https://github.com/dickpy/dsh-imagegen/releases) 下载 tgz 后安装。
- **Web / CLI 升级：**重复执行 `add` 命令；插件也会在面板中提示新版本。更新后重启 `dsh web`。
- **桌面端升级：**从插件1.8.2起，检测到宿主插件安装接口时，可直接在插件面板点击「在线更新」，由DSH内置插件管理器安装新版，完成后重启DSH。1.8.0/1.8.1的按钮已被旧逻辑禁用，首次需通过宿主支持的方式安装修复包。宿主未提供安装接口时需先升级DSH。详见 [v1.8.2 更新说明](docs/releases/v1.8.2.md)。
- 渠道配置、历史记录和画廊数据保存在 DSH 宿主侧，正常升级不会清空。
````

</details>

**依据 2 · 源码核查**：[src/generation-runtime.ts:49-86](https://github.com/dickpy/dsh-imagegen/blob/075fb6eb99e82dc173806354fcecb81decad2019/src/generation-runtime.ts#L49-L86)

选择渠道及写历史

<details>
<summary>查看原文（38行）</summary>

```text
  async run(request: GenerateRequest, signal?: AbortSignal): Promise<GenerateResult> {
    const view = this.resolve()
    const channel = view.channels.find(candidate => candidate.id === request.channelId)
      ?? view.channels.find(candidate => candidate.id === view.defaultChannelId)
      ?? view.channels[0]
    if (channel === undefined) {
      throw new ImageGenError('尚未配置任何渠道：请先打开「设置 → 生图配置」添加渠道并填写 API 地址与密钥', 'no-channels')
    }
    const result = channel.auth === 'subscription' && channel.subscription !== undefined
      ? { images: await this.generateSubscription(channel.subscription, request, signal) }
      : await generateImage({ apiUrl: channel.apiUrl, apiKey: channel.apiKey, apiUrlFull: channel.apiUrlFull, protocol: channel.protocol, channelName: channel.name, ...channel.watermark === false ? { watermark: false } : {} } satisfies UpstreamConfig, request, { signal })
    try {
      const history = await this.history.append({
        id: randomUUID(),
        createdAt: Date.now(),
        mode: request.mode,
        model: request.model,
        prompt: request.prompt,
        size: request.size,
        quality: request.quality,
        detail: request.detail,
        n: request.n,
        images: result.images,
        ...request.refName === undefined ? {} : { refName: request.refName },
        ...request.channelId === undefined ? {} : { channelId: request.channelId },
        ...request.channel === undefined ? {} : { channel: request.channel },
        ...request.comparisonId === undefined ? {} : { comparisonId: request.comparisonId },
        ...request.comparisonModels === undefined ? {} : { comparisonModels: request.comparisonModels },
        ...request.workflow === undefined ? {} : { workflow: request.workflow },
        ...request.projectId === undefined ? {} : { projectId: request.projectId },
        ...request.projectName === undefined ? {} : { projectName: request.projectName },
        ...request.slotKey === undefined ? {} : { slotKey: request.slotKey },
        ...request.slotLabel === undefined ? {} : { slotLabel: request.slotLabel },
        ...request.canvas === undefined ? {} : { canvas: request.canvas },
      })
      return { ...result, history }
    } catch (error) {
      return { ...result, historyError: error instanceof Error ? error.message : String(error) }
```

</details>

#### 缺口

- 未实测创作效率
  **影响**：无法量化节省
  **进一步探讨**：比较单张有参考图的产物与记录

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 指定渠道缺失时怎么办？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

按请求 ID、默认渠道、首个渠道选择，全部缺失才报错；因此请求指定一个已删渠道仍可能发给另一渠道。运行时提供并发上限 4；历史写入记录可选请求渠道字段，不能仅用该字段判断实际网关。

#### 证据与依据

**依据 1 · 源码核查**：[src/generation-runtime.ts:39-59](https://github.com/dickpy/dsh-imagegen/blob/075fb6eb99e82dc173806354fcecb81decad2019/src/generation-runtime.ts#L39-L59)

并行队列和回退

<details>
<summary>查看原文（21行）</summary>

```text
  constructor(
    private readonly resolve: () => ChannelsView,
    private readonly history: HistorySink = { append: appendHistory },
    private readonly subscriptions?: SubscriptionManager,
  ) {
    // Every task runs in parallel up to this small host-wide limit; a
    // four-model comparison fits within it in a single wave.
    this.queue = new GenerationTaskQueue((request, signal) => this.run(request, signal), 4)
  }

  async run(request: GenerateRequest, signal?: AbortSignal): Promise<GenerateResult> {
    const view = this.resolve()
    const channel = view.channels.find(candidate => candidate.id === request.channelId)
      ?? view.channels.find(candidate => candidate.id === view.defaultChannelId)
      ?? view.channels[0]
    if (channel === undefined) {
      throw new ImageGenError('尚未配置任何渠道：请先打开「设置 → 生图配置」添加渠道并填写 API 地址与密钥', 'no-channels')
    }
    const result = channel.auth === 'subscription' && channel.subscription !== undefined
      ? { images: await this.generateSubscription(channel.subscription, request, signal) }
      : await generateImage({ apiUrl: channel.apiUrl, apiKey: channel.apiKey, apiUrlFull: channel.apiUrlFull, protocol: channel.protocol, channelName: channel.name, ...channel.watermark === false ? { watermark: false } : {} } satisfies UpstreamConfig, request, { signal })
```

</details>

**依据 2 · 源码核查**：[src/generation-runtime.ts:60-86](https://github.com/dickpy/dsh-imagegen/blob/075fb6eb99e82dc173806354fcecb81decad2019/src/generation-runtime.ts#L60-L86)

历史字段与失败

<details>
<summary>查看原文（27行）</summary>

```text
    try {
      const history = await this.history.append({
        id: randomUUID(),
        createdAt: Date.now(),
        mode: request.mode,
        model: request.model,
        prompt: request.prompt,
        size: request.size,
        quality: request.quality,
        detail: request.detail,
        n: request.n,
        images: result.images,
        ...request.refName === undefined ? {} : { refName: request.refName },
        ...request.channelId === undefined ? {} : { channelId: request.channelId },
        ...request.channel === undefined ? {} : { channel: request.channel },
        ...request.comparisonId === undefined ? {} : { comparisonId: request.comparisonId },
        ...request.comparisonModels === undefined ? {} : { comparisonModels: request.comparisonModels },
        ...request.workflow === undefined ? {} : { workflow: request.workflow },
        ...request.projectId === undefined ? {} : { projectId: request.projectId },
        ...request.projectName === undefined ? {} : { projectName: request.projectName },
        ...request.slotKey === undefined ? {} : { slotKey: request.slotKey },
        ...request.slotLabel === undefined ? {} : { slotLabel: request.slotLabel },
        ...request.canvas === undefined ? {} : { canvas: request.canvas },
      })
      return { ...result, history }
    } catch (error) {
      return { ...result, historyError: error instanceof Error ? error.message : String(error) }
```

</details>

#### 缺口

- 未测试变更渠道的在途请求
  **影响**：不能推定账单去向
  **进一步探讨**：用两路模拟端点核对请求

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 生成图或参考图会留在哪？

**研究主题**：缺陷与关键质疑

#### 完整回答

模型调用向配置网关发请求。结果 URL 仅同源且不是预签名时加网关密钥。开启对象存储同步时，本地历史或画廊写入还会尝试上传，失败不会阻止本地保存。保存成功并非上传确认，敏感图应按明确策略配置渠道和同步。

#### 证据与依据

**依据 1 · 源码核查**：[src/generation-runtime.ts:49-59](https://github.com/dickpy/dsh-imagegen/blob/075fb6eb99e82dc173806354fcecb81decad2019/src/generation-runtime.ts#L49-L59)

生成发到所选渠道

<details>
<summary>查看原文（11行）</summary>

```text
  async run(request: GenerateRequest, signal?: AbortSignal): Promise<GenerateResult> {
    const view = this.resolve()
    const channel = view.channels.find(candidate => candidate.id === request.channelId)
      ?? view.channels.find(candidate => candidate.id === view.defaultChannelId)
      ?? view.channels[0]
    if (channel === undefined) {
      throw new ImageGenError('尚未配置任何渠道：请先打开「设置 → 生图配置」添加渠道并填写 API 地址与密钥', 'no-channels')
    }
    const result = channel.auth === 'subscription' && channel.subscription !== undefined
      ? { images: await this.generateSubscription(channel.subscription, request, signal) }
      : await generateImage({ apiUrl: channel.apiUrl, apiKey: channel.apiKey, apiUrlFull: channel.apiUrlFull, protocol: channel.protocol, channelName: channel.name, ...channel.watermark === false ? { watermark: false } : {} } satisfies UpstreamConfig, request, { signal })
```

</details>

**依据 2 · 源码核查**：[src/engine.ts:483-505](https://github.com/dickpy/dsh-imagegen/blob/075fb6eb99e82dc173806354fcecb81decad2019/src/engine.ts#L483-L505)

结果图取回凭据条件

<details>
<summary>查看原文（23行）</summary>

```text
    let response: Response
    try {
      // Forward the key only to the API's own origin, and never to a
      // presigned object-storage URL (which carries its own credentials).
      const forwardKey = upstream.apiKey !== ''
        && !isPresignedUrl(url)
        && isSameOriginAsApi(url, upstream.apiUrl)
      response = await fetch(url, {
        ...forwardKey
          ? { headers: { authorization: `Bearer ${upstream.apiKey}` } }
          : {},
        signal: budget.signal,
      })
    } catch (error) {
      // A gateway that accepts the job but hands back an unreachable result URL
      // looks like a silent failure unless the URL is on the record.
      const failure = new ImageGenError(`failed to fetch the generated image url: ${error instanceof Error ? error.message : String(error)}`)
      recordFailure(resultContext, failure)
      throw failure
    }
    if (!response.ok) {
      const failure = new ImageGenError(`failed to fetch the generated image url: HTTP ${response.status}`)
      recordFailure(resultContext, failure, { status: response.status, bodyExcerpt: await readResponseExcerpt(response) })
```

</details>

**依据 3 · 源码核查**：[src/index.ts:776-789](https://github.com/dickpy/dsh-imagegen/blob/075fb6eb99e82dc173806354fcecb81decad2019/src/index.ts#L776-L789)

可选外部同步

<details>
<summary>查看原文（14行）</summary>

```text
  // Object-storage sync: the image stores announce every file they write; the
  // handler resolves the live settings and uploads when enabled. Fire and
  // forget — a sync failure never blocks the save path.
  setStorageSyncHandler((kind, filePath) => {
    const storage = resolve().storage
    if (!storage.enabled || !storage.endpoint.trim() || storage.secretKey.trim() === '') return
    if (kind === 'gallery' && !storage.syncGallery) return
    if (kind === 'history' && !storage.syncHistory) return
    const key = `${storage.prefix}/${kind === 'gallery' ? 'gallery' : 'images'}/${path.basename(filePath)}`
    const data = readFileSync(filePath)
    void putObject(storage, key, data, mimeOfPath(filePath)).catch(() => {
      // Best-effort sync: surfaced through the settings test, never fatal here.
    })
  })
```

</details>

#### 缺口

- 未做网络和存储观察
  **影响**：无法保证供应方留存或同步
  **进一步探讨**：用合成参考图记录请求和落盘

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何评估后退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

使用独立 Web profile、一个测试渠道与合成素材，先关闭对象存储并检查结果和历史。若渠道错配或需保密，停止提交并禁用插件；此前网关和对象存储留存须按各自策略处理。模型费用和配置耗时未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-35](https://github.com/dickpy/dsh-imagegen/blob/075fb6eb99e82dc173806354fcecb81decad2019/README.md#L20-L35)

环境、设置和数据范围

<details>
<summary>查看原文（16行）</summary>

````text
需要已安装 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) 和 Node.js 20+。

```bash
dsh plugin --profile web add @dickpy/dsh-imagegen
```

安装后重启 `dsh web`，侧边栏会出现「生图」入口。到「设置 → 生图配置」添加提供方、填写 API 地址与密钥、检测并选择生图模型，保存后即可开始创作。Windows 若遇 PowerShell 脚本策略限制，请使用 `dsh.cmd`。

<details>
<summary><b>其他安装方式、升级与回滚</b></summary>

- **让 Agent 安装：**把上面的安装命令发给 DSH、Codex 或其他 coding agent。
- **指定版本：**使用 `@dickpy/dsh-imagegen@<版本号>`，或从 [GitHub Releases](https://github.com/dickpy/dsh-imagegen/releases) 下载 tgz 后安装。
- **Web / CLI 升级：**重复执行 `add` 命令；插件也会在面板中提示新版本。更新后重启 `dsh web`。
- **桌面端升级：**从插件1.8.2起，检测到宿主插件安装接口时，可直接在插件面板点击「在线更新」，由DSH内置插件管理器安装新版，完成后重启DSH。1.8.0/1.8.1的按钮已被旧逻辑禁用，首次需通过宿主支持的方式安装修复包。宿主未提供安装接口时需先升级DSH。详见 [v1.8.2 更新说明](docs/releases/v1.8.2.md)。
- 渠道配置、历史记录和画廊数据保存在 DSH 宿主侧，正常升级不会清空。
````

</details>

**依据 2 · 源码核查**：[src/index.ts:779-789](https://github.com/dickpy/dsh-imagegen/blob/075fb6eb99e82dc173806354fcecb81decad2019/src/index.ts#L779-L789)

同步受开关控制

<details>
<summary>查看原文（11行）</summary>

```text
  setStorageSyncHandler((kind, filePath) => {
    const storage = resolve().storage
    if (!storage.enabled || !storage.endpoint.trim() || storage.secretKey.trim() === '') return
    if (kind === 'gallery' && !storage.syncGallery) return
    if (kind === 'history' && !storage.syncHistory) return
    const key = `${storage.prefix}/${kind === 'gallery' ? 'gallery' : 'images'}/${path.basename(filePath)}`
    const data = readFileSync(filePath)
    void putObject(storage, key, data, mimeOfPath(filePath)).catch(() => {
      // Best-effort sync: surfaced through the settings test, never fatal here.
    })
  })
```

</details>

#### 缺口

- 未跑真实模型
  **影响**：不能判断质量和成本
  **进一步探讨**：测试结果保存、缺渠道及关闭

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 缺渠道时明确拒绝是否更好？

**研究主题**：新假设与验证

#### 完整回答

对照当前自动回退与显式要求重新选择，模拟渠道删除和切换。测错路由、用户恢复时间与生成完成率。若阻断大量正常无指定请求而没有减少错发，就否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/generation-runtime.ts:49-59](https://github.com/dickpy/dsh-imagegen/blob/075fb6eb99e82dc173806354fcecb81decad2019/src/generation-runtime.ts#L49-L59)

当前回退顺序

<details>
<summary>查看原文（11行）</summary>

```text
  async run(request: GenerateRequest, signal?: AbortSignal): Promise<GenerateResult> {
    const view = this.resolve()
    const channel = view.channels.find(candidate => candidate.id === request.channelId)
      ?? view.channels.find(candidate => candidate.id === view.defaultChannelId)
      ?? view.channels[0]
    if (channel === undefined) {
      throw new ImageGenError('尚未配置任何渠道：请先打开「设置 → 生图配置」添加渠道并填写 API 地址与密钥', 'no-channels')
    }
    const result = channel.auth === 'subscription' && channel.subscription !== undefined
      ? { images: await this.generateSubscription(channel.subscription, request, signal) }
      : await generateImage({ apiUrl: channel.apiUrl, apiKey: channel.apiKey, apiUrlFull: channel.apiUrlFull, protocol: channel.protocol, channelName: channel.name, ...channel.watermark === false ? { watermark: false } : {} } satisfies UpstreamConfig, request, { signal })
```

</details>

#### 缺口

- 无用户或错误率数据
  **影响**：判断未验证
  **进一步探讨**：用两路模拟服务复现失配

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
