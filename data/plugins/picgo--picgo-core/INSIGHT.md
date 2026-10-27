# PicGo-Core

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[9193ec0](https://github.com/PicGo/PicGo-Core/tree/9193ec072f079d4d463078b8791f4e5c112b9ddb)

<!-- BEGIN META -->
[![GitHub ★ 992](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=992&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PicGo/PicGo-Core) [![npm 30d 3,192](https://img.shields.io/static/v1?label=npm+30d&message=3%2C192&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/picgo) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/picgo)
<!-- END META -->

> **功能**：提供CLI、API和本地服务图片上传流程，支持多图床配置、剪贴板及插件扩展。

> **亮点**：把路径与剪贴板输入、图床目标配置和URL输出组成可嵌入编辑器与脚本的上传管道，贡献在流程集成而非新存储算法。[Q01](#research-q01)

> **主要限制**：GitHub uploader把422直接按重名生成链接，未核对远端内容；普通生命周期捕获后返回也不代表整批全部成功，发布调用方必须逐项核验。[Q02](#research-q02)

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
  - [Q01 · 谁需要CLI和API图片上传，较网页上传增加什么？](#detail-section-11)
  - [Q02 · 批量部分成功和GitHub重名时能否保证结果正确？](#detail-section-12)
  - [Q03 · 接入、持续上传和退出需要什么投入？](#detail-section-13)
  - [Q04 · 如何借鉴生命周期，同时修正重名对账问题？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供持续写文档与Markdown的用户，把本地或剪贴板图片转成可引用URL。

网页上传后复制链接，或使用单图床脚本。统一管道在持续、多目标或编辑器接入时较有价值。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 路径与剪贴板上传 | 图片变为可引用URL | 需图床凭据，逐项确认内容 |
| 多目标配置 | 每次选择上传目的地 | 第三方缓存全局配置可能需适配 |
| 生命周期插件 | 转换及后处理扩展 | 同进程权限，无隔离保证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node与PicGo包 | CLI/API必需 | 转换与上传 | 版本要求按package和实际依赖核对 |
| 图床账户、网络、目标配置 | 上传必需 | 持久存储和URL | 失败需检查凭据和服务 |
| 第三方插件 | 扩展时可选 | 更多图床与处理 | 同进程执行，不能当隔离代码 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户配置单一测试图床与最小凭据 | 明确目标、路径和额度 |
| 2 | 从测试图片上传并检查URL内容 | 核对文件与预期一致 |
| 3 | 用小批次检查部分失败 | 只重试未确认项，记录成功链接 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node和包下载 | 图床凭据及输出格式配置 | 未测设置耗时 |
| 持续使用 | 存储、流量或图床费用 | 检查链接、服务限制和插件更新 | 未估当前价格 |
| 失败恢复 | 可能重复存储 | 逐项核对部分成功和重名内容 | 无全批事务回滚证据 |
| 退出迁移 | 下载和替换URL | 撤销凭据、迁移远端资产 | 禁用本地工具不会删除图床资产 |

适合高频文档图片工作者在非敏感测试图床试用。对必须证明每个链接与原图一致的自动发布，先增加逐项内容检查；普通Promise返回不足以当作整批验收。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自动返回URL | uploader填imgUrl，后处理格式化 | 每URL与输入图片一致性 |
| 批量容错 | 保留已成功结果 | 远端状态补偿和端到端成功率 |
| 编辑器效率 | CLI/API可嵌入 | 实际节时与维护成本 |

> **思考**：GitHub uploader把422直接按重名生成链接，未核对远端内容；普通生命周期捕获后返回也不代表整批全部成功，发布调用方必须逐项核验。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把路径与剪贴板输入、图床目标配置和URL输出组成可嵌入编辑器与脚本的上传管道，贡献在流程集成而非新存储算法。[Q01](#research-q01)

生命周期将转换、上传和后处理分开，并为每上传独立建context，适合嵌入编辑器。PluginLoader按约定包名加载，第三方register拿完整ctx；注销会移除生命周期与命令注册，但不构成安全沙箱。各同阶段插件Promise.all运行，多个插件改同一ctx时需要明确字段所有权，而不能依赖注册顺序。

<a id="detail-section-5"></a>

### 1.4 主要限制

GitHub uploader把422直接按重名生成链接，未核对远端内容；普通生命周期捕获后返回也不代表整批全部成功，发布调用方必须逐项核验。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

高频文档图片用户可在测试图床和小批次试用；先核对目标配置、权限与每项URL内容，发生部分失败先对账；若只偶发上传或不能处理远端重名，就继续图床网页。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

统一上传与部分成功路径有源码支持；远端内容一致性与收益未实测；按摘要对账是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、src/core/Lifecycle.ts、src/plugins/uploader/github.ts、src/lib/PluginLoader.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查生命周期、第三方加载和GitHub上传器；不代表全部图床、Cloud同步及HTTP服务安全审计。
- 下一步：在测试图床核对同名同内容、同名不同内容和中途失败，记录链接正确性与人工处理时间。

**分析版本**

- **仓库**：[PicGo/PicGo-Core](https://github.com/PicGo/PicGo-Core)
- **版本号**：3.2.0（[固定提交 9193ec0](https://github.com/PicGo/PicGo-Core/tree/9193ec072f079d4d463078b8791f4e5c112b9ddb)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

为每资产绑定内容摘要与远端标识，在重复提交前对账，同摘要复用、不同摘要报冲突；用同名差异与中断批次检验误链接和处理成本，尚未验证。[Q04](#research-q04)

在测试图床核对同名同内容、同名不同内容和中途失败，记录链接正确性与人工处理时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1429 | — | — | 6692 |
| .js | source | 2 | 215 | 139 | 84 | — |
| .ts | test | 29 | 8273 | 7107 | 262 | — |
| .ts | source | 101 | 14588 | 11935 | 1307 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/PicGo/PicGo-Core/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：图片上传流水线能否降低发布手工负担，部分失败与远端重名边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要CLI和API图片上传，较网页上传增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合持续写Markdown、文档或发布内容的人，将本地文件或剪贴板图片上传为可引用链接。简单替代是在图床网页上传后手动复制URL；PicGo-Core将路径输入、转换、目标配置和结果输出组成可嵌入编辑器或脚本的流程。

贡献在常规上传协议之上的集成与复用，不是新存储算法；Typeora原生支持是作者兼容声明，本次未验证。一次性上传少量文件者可能直接网页更省事，已有稳定单图床脚本者未必需引入整套插件框架。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:56-64](https://github.com/PicGo/PicGo-Core/blob/9193ec072f079d4d463078b8791f4e5c112b9ddb/README.md#L56-L64)

作者说明CLI/API、插件和Node要求。

```text
A tool for image uploading. Both CLI & api supports. It also supports plugin system, please check [Awesome-PicGo](https://github.com/PicGo/Awesome-PicGo) to find powerful plugins.

More details please see the [Homepage](https://picgo.app/) of PicGo.

**Typora supports PicGo-Core natively**.

## Installation

PicGo requires Node.js >= 20.19.0 or >= 22.12.0. For older PicGo versions (<= v1.5.x), Node.js >= 16 is sufficient. Cause we need the [stability of ES Module support](https://joyeecheung.github.io/blog/2025/12/30/require-esm-in-node-js-from-experiment-to-stability/).
```

**依据 2 · 作者声明**：[README.md:124-153](https://github.com/PicGo/PicGo-Core/blob/9193ec072f079d4d463078b8791f4e5c112b9ddb/README.md#L124-L153)

路径、配置及剪贴板输入方式。

<details>
<summary>查看原文（30行）</summary>

````text
#### Upload a picture from path

```bash
picgo upload /xxx/xx/xx.jpg
```

#### Upload with a saved configuration

Use `--configName` to choose a saved configuration for one upload. Add `--uploader` when the same name exists in multiple uploader types. You can also use `--configId`; a unique ID match takes precedence over the name, and an unresolved ID falls back to the name when provided.

```bash
picgo upload ./photo.png --configName=Work
picgo upload ./photo.png --uploader=github --configName="Work Images"
picgo upload ./photo.png --uploader=github --configId=your-config-id --configName=Work

# Upload from the clipboard with a saved configuration.
picgo upload --configName=Work
```

These options use the same lookup rules as HTTP and SDK uploads and do not change saved defaults. Without these options, `picgo upload` retains its existing default behavior. Existing local input files are retained after upload; only temporary multipart files and clipboard images created by PicGo are cleaned up. Clipboard filenames keep the existing `YYYYMMDDHHmmssSSS.png` format.

#### Upload a picture from clipboard

> picture from clipboard will be converted to `png`

```bash
picgo upload
```

Thanks to [vs-picgo](https://github.com/Spades-S/vs-picgo) && [Spades-S](https://github.com/Spades-S) for providing the method to upload picture from clipboard.
````

</details>

**依据 3 · 源码核查**：[src/core/Lifecycle.ts:25-49](https://github.com/PicGo/PicGo-Core/blob/9193ec072f079d4d463078b8791f4e5c112b9ddb/src/core/Lifecycle.ts#L25-L49)

转换和上传在统一生命周期中顺序执行。

<details>
<summary>查看原文（25行）</summary>

```text
  async start (input: any[], options?: UploadOptions): Promise<IPicGo> {
    const option = resolveUploadOptions(this.ctx, options)
    // ensure every upload process has an unique context
    const ctx = createContext(this.ctx, option)
    let step = LifecycleStep.IDLE
    try {
      // images input
      if (!Array.isArray(input)) {
        throw new Error('Input must be an array.')
      }
      ctx.input = input
      ctx.output = []

      // lifecycle main
      step = LifecycleStep.BEFORE_TRANSFORM
      await this.beforeTransform(ctx)
      step = LifecycleStep.TRANSFORM
      await this.doTransform(ctx)
      step = LifecycleStep.BEFORE_UPLOAD
      await this.beforeUpload(ctx)
      step = LifecycleStep.UPLOAD
      await this.doUpload(ctx)
      step = LifecycleStep.AFTER_UPLOAD
      await this.afterUpload(ctx, options)
      return ctx
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 批量部分成功和GitHub重名时能否保证结果正确？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

生命周期为每次上传创建上下文，顺序执行转换前、转换、上传前、上传和上传后。上传异常而已有imgUrl时仍调用afterUpload，让成功链接可见；普通模式记录错误后返回ctx而非总是抛出，调用方必须检查逐项结果，不能仅凭Promise完成宣布全部成功。

GitHub uploader逐图PUT，遇到状态422会按重名处理并拼出链接，没有在该分支读取远端内容或核对哈希。422不应自动等同本地图片与远端一致；本文只确认这段实现的判断范围，未复现错误链接。多图失败也没有跨图事务回滚，重试应先对账已成功的项。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/Lifecycle.ts:25-69](https://github.com/PicGo/PicGo-Core/blob/9193ec072f079d4d463078b8791f4e5c112b9ddb/src/core/Lifecycle.ts#L25-L69)

上下文隔离和部分结果处理，非debug捕获后返回。

<details>
<summary>查看原文（45行）</summary>

```text
  async start (input: any[], options?: UploadOptions): Promise<IPicGo> {
    const option = resolveUploadOptions(this.ctx, options)
    // ensure every upload process has an unique context
    const ctx = createContext(this.ctx, option)
    let step = LifecycleStep.IDLE
    try {
      // images input
      if (!Array.isArray(input)) {
        throw new Error('Input must be an array.')
      }
      ctx.input = input
      ctx.output = []

      // lifecycle main
      step = LifecycleStep.BEFORE_TRANSFORM
      await this.beforeTransform(ctx)
      step = LifecycleStep.TRANSFORM
      await this.doTransform(ctx)
      step = LifecycleStep.BEFORE_UPLOAD
      await this.beforeUpload(ctx)
      step = LifecycleStep.UPLOAD
      await this.doUpload(ctx)
      step = LifecycleStep.AFTER_UPLOAD
      await this.afterUpload(ctx, options)
      return ctx
    } catch (e: any) {
      // If error came from doUpload and some items already uploaded successfully,
      // still run afterUpload so users see the successful URLs and plugins
      // (like cloud auto-import) can process the partial results.
      if (step === LifecycleStep.UPLOAD && ctx.output.some(item => item.imgUrl !== undefined)) {
        try {
          step = LifecycleStep.AFTER_UPLOAD
          await this.afterUpload(ctx, options)
        } catch {
          // afterUpload failed too — don't mask the original upload error
        }
      }
      ctx.log.warn(IBuildInEvent.FAILED)
      ctx.emit(IBuildInEvent.UPLOAD_PROGRESS, -1)
      ctx.emit(IBuildInEvent.FAILED, e)
      ctx.log.error(e)
      if (ctx.getConfig<Undefinable<string>>('debug')) {
        throw e
      }
      return ctx
```

</details>

**依据 2 · 源码核查**：[src/plugins/uploader/github.ts:23-69](https://github.com/PicGo/PicGo-Core/blob/9193ec072f079d4d463078b8791f4e5c112b9ddb/src/plugins/uploader/github.ts#L23-L69)

逐图上传及422后直接拼链接，无内容核对。

<details>
<summary>查看原文（47行）</summary>

```text
const handle = async (ctx: IPicGo): Promise<IPicGo> => {
  const githubOptions = ctx.getConfig<IGithubConfig>('picBed.github')
  if (!githubOptions) {
    throw new Error('Can\'t find github config')
  }
  try {
    const imgList = ctx.output
    for (const img of imgList) {
      if (img.fileName && img.buffer) {
        const base64Image = img.base64Image || Buffer.from(img.buffer).toString('base64')
        const data = {
          message: 'Upload by PicGo',
          branch: githubOptions.branch,
          content: base64Image,
          path: githubOptions.path + encodeURI(img.fileName)
        }
        const postConfig = postOptions(img.fileName, githubOptions, data)
        try {
          const body: {
            content: {
              download_url: string
            }
          } = await ctx.request(postConfig)
          if (body) {
            delete img.base64Image
            delete img.buffer
            if (githubOptions.customUrl) {
              img.imgUrl = `${githubOptions.customUrl}/${handleUrlPathSafeEncode(githubOptions.path || '', img.fileName)}`
            } else {
              img.imgUrl = body.content.download_url
            }
          } else {
            throw new Error('Server error, please try again')
          }
        } catch (e: any) {
          // handle duplicate images
          if (e.statusCode === 422) {
            delete img.base64Image
            delete img.buffer
            if (githubOptions.customUrl) {
              img.imgUrl = `${githubOptions.customUrl}/${handleUrlPathSafeEncode(githubOptions.path || '', img.fileName)}`
            } else {
              img.imgUrl = `https://raw.githubusercontent.com/${githubOptions.repo}/${githubOptions.branch}/${handleUrlPathSafeEncode(githubOptions.path || '', img.fileName)}`
            }
          } else {
            throw e
          }
```

</details>

#### 缺口

- 422重名分支对不同响应和内容差异的实际行为未运行。
  **影响**：可能不能把生成链接视为对应本地资产的证据。
  **进一步探讨**：用同名同内容、同名不同内容和非重名422响应做隔离对照，核对远端文件哈希和返回链接。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 接入、持续上传和退出需要什么投入？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node与PicGo包 | CLI/API必需 | 转换与上传 | 版本要求按package和实际依赖核对 |
| 图床账户、网络、目标配置 | 上传必需 | 持久存储和URL | 失败需检查凭据和服务 |
| 第三方插件 | 扩展时可选 | 更多图床与处理 | 同进程执行，不能当隔离代码 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户配置单一测试图床与最小凭据 | 明确目标、路径和额度 |
| 2 | 从测试图片上传并检查URL内容 | 核对文件与预期一致 |
| 3 | 用小批次检查部分失败 | 只重试未确认项，记录成功链接 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node和包下载 | 图床凭据及输出格式配置 | 未测设置耗时 |
| 持续使用 | 存储、流量或图床费用 | 检查链接、服务限制和插件更新 | 未估当前价格 |
| 失败恢复 | 可能重复存储 | 逐项核对部分成功和重名内容 | 无全批事务回滚证据 |
| 退出迁移 | 下载和替换URL | 撤销凭据、迁移远端资产 | 禁用本地工具不会删除图床资产 |

适合高频文档图片工作者在非敏感测试图床试用。对必须证明每个链接与原图一致的自动发布，先增加逐项内容检查；普通Promise返回不足以当作整批验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:64-84](https://github.com/PicGo/PicGo-Core/blob/9193ec072f079d4d463078b8791f4e5c112b9ddb/README.md#L64-L84)

运行环境与安装方式。

<details>
<summary>查看原文（21行）</summary>

````text
PicGo requires Node.js >= 20.19.0 or >= 22.12.0. For older PicGo versions (<= v1.5.x), Node.js >= 16 is sufficient. Cause we need the [stability of ES Module support](https://joyeecheung.github.io/blog/2025/12/30/require-esm-in-node-js-from-experiment-to-stability/).

### Global install

```bash
npm install picgo -g

# or

yarn global add picgo
```

### Local install

```bash
npm install picgo -D

# or

yarn add picgo -D
```
````

</details>

**依据 2 · 作者声明**：[README.md:178-193](https://github.com/PicGo/PicGo-Core/blob/9193ec072f079d4d463078b8791f4e5c112b9ddb/README.md#L178-L193)

每请求目标选择与插件缓存配置的兼容限制。

<details>
<summary>查看原文（16行）</summary>

```text
The same query parameters work with an empty body for clipboard uploads, JSON without `list` or with an empty `list`, and multipart uploads using the `files` field. If server authentication is enabled, include your existing `Authorization: Bearer <secret>` header.

| Upload options | Behavior |
| --- | --- |
| No upload options | Existing default upload behavior. |
| `uploader=github` | Use GitHub's currently selected configuration (`defaultId`, falling back to its first configuration). |
| `uploader=github&configName=Work` | Find `Work` within GitHub, ignoring case and surrounding whitespace. |
| `configName=Work` | Search registered uploader types; exactly one configuration must match. |
| `configId=<id>` | Search by exact ID, optionally restricted by `uploader`. IDs remain stable when configurations are renamed. |
| Both `configId` and `configName` | Use a unique ID match first; if it cannot be uniquely resolved, try the name. |

Unknown uploaders, missing or ambiguous configurations, and blank or repeated upload parameters return HTTP `400` with `{ success: false, result: [], items: [], code, message }`. Messages explain the lookup failure or ambiguity; specify `uploader` to disambiguate names shared across types. Invalid upload options never fall back to the global default uploader. Existing authentication failures remain HTTP `401`.

Upload options do not change global defaults or save the requested configuration to disk. Concurrent requests can use different configurations. Plugins that read configuration through the context passed to their lifecycle handler see the request's configuration; plugins that cache global configuration may need adaptation. Explicit plugin persistence and Cloud session maintenance retain their normal behavior. `uploader=picgo-cloud` uses the current Cloud login; these options do not switch Cloud accounts.

Applications providing a custom internal server upload adapter must forward the optional `UploadOptions` argument to `picgo.upload`: `uploadPaths(paths, options)` forwards to `picgo.upload(paths, options)`, and `uploadClipboard(options)` forwards to `picgo.upload(undefined, options)`. Existing adapters can still handle requests without selectors, but ignoring these options will ignore the requested destination.
```

</details>

**依据 3 · 源码核查**：[src/plugins/uploader/github.ts:7-19](https://github.com/PicGo/PicGo-Core/blob/9193ec072f079d4d463078b8791f4e5c112b9ddb/src/plugins/uploader/github.ts#L7-L19)

GitHub账户凭据随请求发送。

<details>
<summary>查看原文（13行）</summary>

```text
const postOptions = (fileName: string, options: IGithubConfig, data: any): IOldReqOptionsWithJSON => {
  const path = options.path || ''
  const { token, repo } = options
  return {
    method: 'PUT',
    url: `https://api.github.com/repos/${repo}/contents/${handleUrlPathSafeEncode(path, fileName)}`,
    headers: {
      Authorization: `token ${token}`,
      'User-Agent': 'PicGo',
      'Content-Type': mime.lookup(fileName)
    },
    body: data,
    json: true
```

</details>

**依据 4 · 源码核查**：[src/core/Lifecycle.ts:50-69](https://github.com/PicGo/PicGo-Core/blob/9193ec072f079d4d463078b8791f4e5c112b9ddb/src/core/Lifecycle.ts#L50-L69)

恢复必须关注部分成功与错误。

<details>
<summary>查看原文（20行）</summary>

```text
    } catch (e: any) {
      // If error came from doUpload and some items already uploaded successfully,
      // still run afterUpload so users see the successful URLs and plugins
      // (like cloud auto-import) can process the partial results.
      if (step === LifecycleStep.UPLOAD && ctx.output.some(item => item.imgUrl !== undefined)) {
        try {
          step = LifecycleStep.AFTER_UPLOAD
          await this.afterUpload(ctx, options)
        } catch {
          // afterUpload failed too — don't mask the original upload error
        }
      }
      ctx.log.warn(IBuildInEvent.FAILED)
      ctx.emit(IBuildInEvent.UPLOAD_PROGRESS, -1)
      ctx.emit(IBuildInEvent.FAILED, e)
      ctx.log.error(e)
      if (ctx.getConfig<Undefinable<string>>('debug')) {
        throw e
      }
      return ctx
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何借鉴生命周期，同时修正重名对账问题？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

生命周期将转换、上传和后处理分开，并为每上传独立建context，适合嵌入编辑器。PluginLoader按约定包名加载，第三方register拿完整ctx；注销会移除生命周期与命令注册，但不构成安全沙箱。各同阶段插件Promise.all运行，多个插件改同一ctx时需要明确字段所有权，而不能依赖注册顺序。

未验证设计假设是对每资产记录目标、内容摘要和远端标识，重试先查询远端内容；只有同摘要才复用URL，不同内容显式冲突或更名。最小比较以同名同内容、同名不同内容、批量中途断连三组，记录误链接、重复对象及人工处理时间；若图床不支持读取或摘要查询，就明确标未知并由用户确认，不能伪装为已成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/Lifecycle.ts:173-193](https://github.com/PicGo/PicGo-Core/blob/9193ec072f079d4d463078b8791f4e5c112b9ddb/src/core/Lifecycle.ts#L173-L193)

同阶段插件并发共享上下文。

<details>
<summary>查看原文（21行）</summary>

```text
  private async handlePlugins (lifeCyclePlugins: ILifecyclePlugins, ctx: IPicGo, options?: { consoleOutput?: boolean }): Promise<IPicGo> {
    const plugins = lifeCyclePlugins.getList()
    const pluginNames = lifeCyclePlugins.getIdList()
    const lifeCycleName = lifeCyclePlugins.getName()
    if (options?.consoleOutput === false) {
      const fileOnlyLogger = ctx.log.createLogger?.({ consoleOutput: false })
      if (fileOnlyLogger) {
        ctx.log = fileOnlyLogger
      }
    }
    await Promise.all(plugins.map(async (plugin: IPlugin, index: number) => {
      try {
        if (!BUILTIN_LIFECYCLE_PLUGINS.has(pluginNames[index])) {
          ctx.log.info(`${lifeCycleName}: ${pluginNames[index]} running`)
        }
        await plugin.handle(ctx)
      } catch (e) {
        ctx.log.error(`${lifeCycleName}: ${pluginNames[index]} error`)
        throw e
      }
    }))
```

</details>

**依据 2 · 源码核查**：[src/lib/PluginLoader.ts:65-103](https://github.com/PicGo/PicGo-Core/blob/9193ec072f079d4d463078b8791f4e5c112b9ddb/src/lib/PluginLoader.ts#L65-L103)

第三方register拿宿主上下文，错误卸除注册状态。

<details>
<summary>查看原文（39行）</summary>

```text
  registerPlugin (name: string, plugin?: IPicGoPlugin): void {
    if (!name || typeof name !== 'string') {
      this.ctx.log.warn('Please provide valid plugin')
      return
    }
    this.fullList.add(name)
    try {
      // register local plugin
      if (!plugin) {
        if (this.ctx.getConfig(`picgoPlugins.${name}`) === true || (this.ctx.getConfig(`picgoPlugins.${name}`) === undefined)) {
          this.list.push(name)
          setCurrentPluginName(name)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.getPlugin(name)!.register(this.ctx)
          const plugin = `picgoPlugins[${name}]`
          this.ctx.saveConfig(
            {
              [plugin]: true
            }
          )
        }
      } else {
        // register provided plugin
        // && won't write config to files
        this.list.push(name)
        setCurrentPluginName(name)
        const pluginInterface = plugin(this.ctx)
        this.pluginMap.set(name, pluginInterface)
        pluginInterface.register(this.ctx)
      }
    } catch (e) {
      this.pluginMap.delete(name)
      this.list = this.list.filter((item: string) => item !== name)
      this.fullList.delete(name)
      this.ctx.log.error(e as Error)
      this.ctx.emit(IBuildInEvent.NOTIFICATION, {
        title: `Plugin ${name} Load Error`,
        body: e
      })
```

</details>

**依据 3 · 源码核查**：[src/lib/PluginLoader.ts:107-130](https://github.com/PicGo/PicGo-Core/blob/9193ec072f079d4d463078b8791f4e5c112b9ddb/src/lib/PluginLoader.ts#L107-L130)

注销责任及require加载方式。

<details>
<summary>查看原文（24行）</summary>

```text
  unregisterPlugin (name: string): void {
    this.list = this.list.filter((item: string) => item !== name)
    this.fullList.delete(name)
    this.pluginMap.delete(name)
    setCurrentPluginName(name)
    this.ctx.helper.uploader.unregister(name)
    this.ctx.helper.transformer.unregister(name)
    this.ctx.helper.beforeTransformPlugins.unregister(name)
    this.ctx.helper.beforeUploadPlugins.unregister(name)
    this.ctx.helper.afterUploadPlugins.unregister(name)
    this.ctx.helper.afterFinishPlugins.unregister(name)
    this.ctx.cmd.unregister(name)
    this.ctx.removeConfig('picgoPlugins', name)
  }

  // get plugin by name
  getPlugin (name: string): IPicGoPluginInterface | undefined {
    if (this.pluginMap.has(name)) {
      return this.pluginMap.get(name)
    }
    const pluginDir = path.join(this.ctx.baseDir, 'node_modules/')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const plugin = require(pluginDir + name)(this.ctx)
    this.pluginMap.set(name, plugin)
```

</details>

**依据 4 · 源码核查**：[src/plugins/uploader/github.ts:57-69](https://github.com/PicGo/PicGo-Core/blob/9193ec072f079d4d463078b8791f4e5c112b9ddb/src/plugins/uploader/github.ts#L57-L69)

422分支为内容核查假设提供具体起点。

<details>
<summary>查看原文（13行）</summary>

```text
        } catch (e: any) {
          // handle duplicate images
          if (e.statusCode === 422) {
            delete img.base64Image
            delete img.buffer
            if (githubOptions.customUrl) {
              img.imgUrl = `${githubOptions.customUrl}/${handleUrlPathSafeEncode(githubOptions.path || '', img.fileName)}`
            } else {
              img.imgUrl = `https://raw.githubusercontent.com/${githubOptions.repo}/${githubOptions.branch}/${handleUrlPathSafeEncode(githubOptions.path || '', img.fileName)}`
            }
          } else {
            throw e
          }
```

</details>

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
