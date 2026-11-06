# DeepSeek Harness Skin

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[848c927](https://github.com/HeiGeAi/deepseek-harness-skin/tree/848c92787e4b67b2892c7c15d6f45f1029a94d8d)

<!-- BEGIN META -->
[![GitHub ★ 63](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=63&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HeiGeAi/deepseek-harness-skin)
<!-- END META -->

> **功能**：提供 DSH 源码换肤覆盖包，含预设主题、图片取色配色及持久化外观设置。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持主题资源、图片派生与宿主持久化组合，底层原生主题服务和色彩技术来自既有体系。源码覆盖交付限定了适用人群，皮肤数量不是生产收益依据。

> **主要限制**：[Q03](#research-q03)确认覆盖ui-theme先于补丁预检，补丁失败不会自动回滚已覆盖包；卸载整份恢复旧文件可能覆盖后续修改。对比度只检查限定token组合，不能从宣传100%推出全页可读或无损安装。

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
  - [Q01 · 这是运行时插件还是源码覆盖，适合谁？](#detail-section-11)
  - [Q02 · 图片如何变成持久化主题？](#detail-section-12)
  - [Q03 · 对比度与安装失败的保证到哪里？](#detail-section-13)
  - [Q04 · 哪些投入和退出条件决定是否值得采用？](#detail-section-14)
  - [Q05 · 如何检验图片主题和恢复设计的价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供愿意维护匹配DSH源码基线的换肤用户使用，在常用界面可读的前提下选择预设或自定义图片；普通npx用户不能直接装作运行时插件。

相对手改CSS或单背景图增加语义角色配色、预设和配置持久化；代价是覆盖源码、集成补丁与重建，不是运行时装包便利，见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 源码主题覆盖 | 集成预设皮肤和宿主控件样式 | 需匹配源码并重建，非独立运行时插件 |
| 图片派生配色 | 用自选图片生成语义颜色 | Canvas、Host上传和设置均需成功 |
| 持久主题与原生切换 | 跨刷新采用外观设置 | 切回原生不撤销源码覆盖 |
| 图片存储 | 保存压缩WebP背景 | 上传到DSH Host，卸载不清图片 |
| 对比度契约检查资源 | 检查限定前景背景组合 | 不证明全页面可读，无法解析pair计pass |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配0.1.0-rc.5的DSH源码检出 | 安装必需 | 覆盖ui-theme与八文件补丁 | npx运行不能直接装，补丁可能不兼容 |
| Node>=22.19、pnpm和构建环境 | 重建必需 | 编译宿主前端 | 仅复制文件不等可运行 |
| 浏览器Canvas/图片解码和Host存储 | 自定义图片必需 | 派生配色与WebP保存 | 失败不等主题已生效 |
| 首次备份与自己修改的独立保存 | 恢复必需 | 整份还原源码 | 后续变更不会自动三方合并 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 在副本检查宿主基线及备份 | 不在未知改动的主工作检出直接覆盖 |
| 集成 | 脚本覆盖包并打补丁，用户重建 | 补丁失败仍可能已覆盖包，核对全部差异 |
| 使用 | 选预设或图片并写设置 | 刷新仍正确且关键文本可读 |
| 退出 | 切原生或审阅备份后恢复源码再重建 | 两者不同，图片仍在Host home需独立处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 源码/依赖/编译资源未知 | 备份、补丁审阅与构建耗时未知 | 环境门槛高于运行时插件 |
| 持续 | 主题和图片存储渲染未知 | 上游升级后的token/补丁兼容复核 | 无长期收益记录 |
| 失败恢复 | 恢复副本与重建资源未知 | 补丁失败后核对已覆盖文件 | 非完整事务安装 |
| 退出 | 自定义图片仍留存 | 备份整份恢复可能覆盖后续改动 | 不等仅切回原生外观 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 图片主题 | 采样、派生、上传、配置和CSS链路 | 真实浏览器表现与审美收益 |
| 可读性 | 特定token及渐变端点对比度契约 | 全页面、图片区域、焦点和动态状态 |
| 维护恢复 | 有备份和还原脚本 | 安装失败原子性不成立，无损保留后续修改不保证 |

> **思考**：[Q03](#research-q03)确认覆盖ui-theme先于补丁预检，补丁失败不会自动回滚已覆盖包；卸载整份恢复旧文件可能覆盖后续修改。对比度只检查限定token组合，不能从宣传100%推出全页可读或无损安装。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持主题资源、图片派生与宿主持久化组合，底层原生主题服务和色彩技术来自既有体系。源码覆盖交付限定了适用人群，皮肤数量不是生产收益依据。

图片取色到语义token、配置驱动唯一DOM写入、启动主题注入可借鉴；数值对比度检查不是全页面验收。覆盖先于补丁预检及整份恢复需要额外维护约束，见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)确认覆盖ui-theme先于补丁预检，补丁失败不会自动回滚已覆盖包；卸载整份恢复旧文件可能覆盖后续修改。对比度只检查限定token组合，不能从宣传100%推出全页可读或无损安装。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在匹配基线的可丢弃源码副本评估，先保存自己改动并检查首次备份。先选一套预设再测试图片与关键页面；不要把切回原生当卸载。补丁失败后核对已经覆盖的ui-theme，退出前审阅旧备份与现有差异，避免还原覆盖后续修改。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持换肤与图片派生接线，并发现先覆盖后预检的安装恢复边界；未执行安装/构建或真实页面验收。事务恢复是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、scripts/install.sh、scripts/uninstall.sh、tree/packages/client/ui-theme/src/index.ts、tree/packages/client/ui-theme/src/client/index.ts、tree/packages/client/ui-theme/src/client/custom-skin.ts、tree/packages/client/ui-theme/src/skin-store.ts、tree/packages/client/ui-theme/src/skins/derive.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码检查安装/卸载、主题Host与Client、图片推导上传、存储和限定对比度契约；未审阅所有皮肤素材授权或所有宿主补丁语义。
- 下一步：未运行安装/卸载、依赖、构建、目标测试或真实浏览器；作者测试数量不作本次独立结果。先写后预检为静态条件确认，不声称已执行破坏复现。

**分析版本**

- **仓库**：[HeiGeAi/deepseek-harness-skin](https://github.com/HeiGeAi/deepseek-harness-skin)
- **版本号**：未声明（[固定提交 848c927](https://github.com/HeiGeAi/deepseek-harness-skin/tree/848c92787e4b67b2892c7c15d6f45f1029a94d8d)）
- **版本日期**：2026-09-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的候选树事务安装和保留差异恢复。对照干净、有用户改动、不兼容副本的失败字节不变与恢复工时；不能同时保住一致性和用户改动便否定，不计当前能力。

未运行安装/卸载、依赖、构建、目标测试或真实浏览器；作者测试数量不作本次独立结果。先写后预检为静态条件确认，不声称已执行破坏复现。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 631 | — | — | 10570 |
| .mjs | source | 1 | 271 | 173 | 74 | — |
| .ts | source | 22 | 3579 | 2029 | 1315 | — |
| .tsx | source | 1 | 254 | 186 | 50 | — |
| .tsx | test | 2 | 457 | 373 | 39 | — |
| .ts | test | 14 | 2920 | 2259 | 391 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/HeiGeAi/deepseek-harness-skin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断源码换肤覆盖包的真实能力、安装恢复与可读性边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是运行时插件还是源码覆盖，适合谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是需要DSH源码检出和重建的换肤资源包，不是拿npm命令就能加载的独立运行时插件。install将tree中的ui-theme包覆盖到宿主，再应用八文件集成补丁；README明确npx运行的DSH不能直接安装，目标基线为0.1.0-rc.5。适用者是愿意维护该源码版本、希望内置主题或自选图片配色的用户，合格结果是常用界面可读且能恢复原生外观。

相对只挂一张背景图，它把语义颜色、控件骨架和主题持久化一起处理；相对手改CSS，给出预设及选图推导路径。但代价从一次界面操作转移到源码集成和升级维护，不能称安装门槛低。内部包有Host和Client apply，不改变仓库根是覆盖包的交付方式。原生主题服务和色彩技术是上游基础，本组件的贡献是具体皮肤与集成组合，未证明生产效率或长期审美收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:48-61](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/README.md#L48-L61)

作者直接声明源码前提与重建步骤。

<details>
<summary>查看原文（14行）</summary>

````text
## 快速开始

前置条件：一份 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 源码检出（版本 `0.1.0-rc.5`）、Node.js 22.19 以上、pnpm。从 npm 直接跑的 `npx @deepseek-ai/dsh` 装不了，因为这套皮肤要跟着前端一起构建。

```bash
git clone https://github.com/HeiGeAi/deepseek-harness-skin.git
cd deepseek-harness-skin
bash scripts/install.sh /path/to/deepseek-harness
```

脚本会先把要覆盖的文件整份备份到 `~/.dsh-skin-backups/<时间戳>/`，再写入皮肤包、打宿主集成补丁。然后按提示重建一次：

```bash
cd /path/to/deepseek-harness && pnpm install && pnpm run build && pnpm dsh web
````

</details>

**依据 2 · 源码核查**：[scripts/install.sh:17-21](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/scripts/install.sh#L17-L21)

安装检查宿主根包和源码路径。

```text
grep -q '"@deepseek-ai/dsh-root"' "$TARGET/package.json" 2>/dev/null \
  || die "这不像是 deepseek-harness 源码检出：$TARGET"

[ -d "$TARGET/packages/client/ui-theme" ] \
  || die "找不到 packages/client/ui-theme，仓库结构对不上"
```

**依据 3 · 源码核查**：[scripts/install.sh:43-57](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/scripts/install.sh#L43-L57)

真正覆盖ui-theme并打宿主补丁。

<details>
<summary>查看原文（15行）</summary>

```text
# 2. 覆盖 ui-theme 包
rsync -a --delete --exclude 'node_modules' --exclude 'dist' --exclude 'lib' \
  "$HERE/tree/packages/client/ui-theme/" "$TARGET/packages/client/ui-theme/"
ok "已写入 ui-theme 皮肤包（21 套预设 + 自定义皮肤 + 更新检查）"

# 3. 打宿主集成补丁（背景层、玻璃拟态、消息气泡透明度）
cd "$TARGET"
if git -C "$TARGET" rev-parse --git-dir >/dev/null 2>&1; then
  if git apply --check "$HERE/patches/host-integration.patch" 2>/dev/null; then
    git apply "$HERE/patches/host-integration.patch"
    ok "已打宿主集成补丁"
  elif git apply --check --reverse "$HERE/patches/host-integration.patch" 2>/dev/null; then
    ok "宿主集成补丁已在，跳过"
  else
    die "补丁打不上。你的 deepseek-harness 版本可能和本皮肤包不匹配（本包基于 0.1.0-rc.5），请手工比对 patches/host-integration.patch"
```

</details>

#### 缺口

- 没有明确用户的长期换肤需求或维护成本对照。
  **影响**：不能把21套皮肤数量等同采用价值。
  **进一步探讨**：选择目标源码用户比较手改CSS与覆盖包的配置、升级与可读性负担。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 图片如何变成持久化主题？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端解码用户选图，一份缩小用于取像素和extractPalette，tuneCustomSkin得到颜色种子、外观、chrome和veil，另一份缩放重编码WebP上传Host。Host按内容名称保存到DSH home中的skins目录；客户端将customSkin先写配置再选择CUSTOM_SKIN，订阅配置的唯一DOM写路径设置data-dsh-skin和data-skin-chrome，并生成自定义CSS。启动时Host tapIndex注入已有配置对应主题，避免只有当前页临时配色。

上传检查POST、字节大小及RIFF/WEBP魔数，存储容量不够返回507；读取要求受限文件名并对缺失图返回404。魔数只证明容器类型，不等完整解码或文件安全认证。图片上传和配置写入是分开的步骤，配置失败不能据图片已落盘判定主题已启用。反过来保存配置但图片后来缺失会失去背景而非恢复原图。

这些机制可解释跨刷新与页面同步，但本次没有真实浏览器验证。所谓本机流转应理解为浏览器向配置的DSH Host上传，Host若在远端则图片也去远端，不能仅凭不使用第三方图像API承诺所有部署本机隐私。

#### 证据与依据

**依据 1 · 源码核查**：[tree/packages/client/ui-theme/src/client/custom-skin.ts:88-113](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/tree/packages/client/ui-theme/src/client/custom-skin.ts#L88-L113)

选图采样、推导与WebP上传。

<details>
<summary>查看原文（26行）</summary>

```text
export async function buildCustomSkin(file: File): Promise<BuiltSkin> {
  const bitmap = await createImageBitmap(file)
  try {
    const sample = scaleToCanvas(bitmap, SAMPLE_WIDTH)
    const pixels = sample.context.getImageData(0, 0, sample.canvas.width, sample.canvas.height).data
    const extracted = extractPalette(pixels)
    const report = tuneCustomSkin(extracted, STOCK)

    const stored = scaleToCanvas(bitmap, STORE_EDGE)
    const blob = await stored.canvas.convertToBlob({ type: 'image/webp', quality: STORE_QUALITY })
    const image = await upload(blob)

    return {
      report,
      custom: {
        image,
        appearance: report.theme.appearance,
        chrome: report.theme.chrome,
        veil: report.theme.veil,
        focus: '50% 50%',
        seeds: report.theme.seeds,
      },
    }
  } finally {
    bitmap.close()
  }
```

</details>

**依据 2 · 源码核查**：[tree/packages/client/ui-theme/src/client/index.ts:428-452](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/tree/packages/client/ui-theme/src/client/index.ts#L428-L452)

唯一DOM主题采用路径与配置订阅。

<details>
<summary>查看原文（25行）</summary>

```text
  const applySkin = (skin: SkinId, custom: CustomSkin): void => {
    if (typeof document === 'undefined') return
    // The custom skin's rules are derived, not bundled, so they have to exist
    // in the document before the attribute that selects them means anything.
    applyCustomSkinStyle(custom)
    const chrome = skinChrome(skin, custom)
    if (chrome === null) {
      document.body.removeAttribute('data-dsh-skin')
      document.body.removeAttribute('data-skin-chrome')
      return
    }
    document.body.setAttribute('data-dsh-skin', skin)
    document.body.setAttribute('data-skin-chrome', chrome)
  }
  let lastSkin: SkinId = host.getSnapshot().value?.skin ?? DEFAULT_SKIN
  let lastCustom: CustomSkin = host.getSnapshot().value?.customSkin ?? EMPTY_CUSTOM_SKIN
  applySkin(lastSkin, lastCustom)
  ctx.effect(() => host.subscribe(() => {
    const skin = host.getSnapshot().value?.skin ?? DEFAULT_SKIN
    const custom = host.getSnapshot().value?.customSkin ?? EMPTY_CUSTOM_SKIN
    if (skin === lastSkin && sameCustomSkin(custom, lastCustom)) return
    lastSkin = skin
    lastCustom = custom
    applySkin(skin, custom)
    bound?.syncSkin(skin, custom.image !== '')
```

</details>

**依据 3 · 源码核查**：[tree/packages/client/ui-theme/src/client/index.ts:470-479](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/tree/packages/client/ui-theme/src/client/index.ts#L470-L479)

先写customSkin再写皮肤选择。

<details>
<summary>查看原文（10行）</summary>

```text
    return {
      setTheme: (id) => { theme.setTheme(id) },
      setSkin: (skin) => { void host.set(SKIN_FIELD, skin) },
      // Persisting the derived skin is what activates it: the settings
      // subscription above is the only writer of the DOM, so the picker never
      // paints a skin that a reload would not bring back.
      setCustomImage: async (file) => {
        const built = await buildCustomSkin(file)
        await host.set(CUSTOM_SKIN_FIELD, built.custom)
        await host.set(SKIN_FIELD, CUSTOM_SKIN)
```

</details>

**依据 4 · 源码核查**：[tree/packages/client/ui-theme/src/index.ts:59-79](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/tree/packages/client/ui-theme/src/index.ts#L59-L79)

Host持久配置、启动HTML注入与图片路由。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx: Context): void {
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(THEME_NAMESPACE, ThemeSettingsSchema)
  })
  ctx.inject(['webServer'], (httpCtx) => {
    httpCtx.effect(
      () => httpCtx.webServer.tapIndex(
        html => injectBootTheme(html, readPreference(ctx), readSkin(ctx), readCustomSkin(ctx)),
      ),
      'client-ui-theme: initial theme bootstrap',
    )
    // The custom skin's photograph lives in the harness home rather than in the
    // settings document, so the browser needs one route to put it there and one
    // to read it back.
    httpCtx.effect(
      () => httpCtx.webServer.register({ kind: 'exact', path: SKIN_UPLOAD_ROUTE, handler: handleSkinUpload }),
      'client-ui-theme: skin image upload',
    )
    httpCtx.effect(
      () => httpCtx.webServer.register({ kind: 'prefix', path: SKIN_IMAGE_ROUTE, handler: handleSkinImage }),
      'client-ui-theme: skin image route',
```

</details>

**依据 5 · 源码核查**：[tree/packages/client/ui-theme/src/skin-store.ts:151-175](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/tree/packages/client/ui-theme/src/skin-store.ts#L151-L175)

字节与WebP检查、容量拒绝和写入。

<details>
<summary>查看原文（25行）</summary>

```text
  const bytes = await readBody(req)
  if (bytes === null) {
    res.writeHead(413)
    res.end()
    return
  }
  // Sniff the container rather than trust the content type. This route writes
  // to the user's home directory, so what lands there should be what the route
  // claims to store even when the caller is confused or hostile.
  const isWebp = bytes.length > 12
    && bytes.subarray(0, 4).toString('latin1') === RIFF
    && bytes.subarray(8, 12).toString('latin1') === WEBP
  if (!isWebp) {
    res.writeHead(415, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: 'expected a webp image' }))
    return
  }
  if (!await hasRoom(skinImageName(bytes), bytes.length)) {
    res.writeHead(507, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: 'skin image store is full' }))
    return
  }
  const image = await storeSkinImage(bytes)
  res.writeHead(200, { 'content-type': 'application/json' })
  res.end(JSON.stringify({ image }))
```

</details>

#### 缺口

- 实际浏览器解码、跨页同步及远端Host图片权限未实测。
  **影响**：不能承诺全平台持久显示或所有部署的本机隐私。
  **进一步探讨**：在确定Host位置的授权环境核对上传目的、配置失败、缺图和跨刷新显示。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 对比度与安装失败的保证到哪里？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

颜色契约根据派生token的前景背景计算ratio，并检查特定chrome渐变端点；无法解析的token pair会以ratio=null且pass=true处理。它可用于限定配色角色的数值检查，却不能证明所有页面、任意图片区域、焦点、字形和动态内容都可读。README的全量测试与100%是作者在另一个装好DSH检出上的报告，仓库自己不提供相同CI复现路径，本次也未执行。不能把它等同所有当前宿主验收。

更直接的恢复边界在安装顺序。install.sh第44-45行已rsync --delete覆盖ui-theme，随后才在51行git apply --check。宿主补丁不兼容而返回错误时，ui-theme先前覆盖并不会自动回滚，因此README所说“不会装出一半”不适用于整个安装事务。源码足以确认这种先写后预检的条件，不需要运行安装制造破坏。

uninstall用首次备份整份还原ui-theme和八个宿主文件，不是三方合并；安装之后用户或上游修改同文件可能被旧备份覆盖。仅选回原生主题只改变外观，不撤销源码。维护者应先在可丢弃副本审阅差异并保存自己改动，不能把一键卸载当任意时间的无损退出。

#### 证据与依据

**依据 1 · 源码核查**：[tree/packages/client/ui-theme/src/skins/derive.ts:568-586](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/tree/packages/client/ui-theme/src/skins/derive.ts#L568-L586)

数值检查及不可解析pair放行范围。

<details>
<summary>查看原文（19行）</summary>

```text
export function auditSkin(theme: SkinTheme, derived: DerivedSkin, stock: StockData): AuditEntry[] {
  // The skin's own brand declarations override upstream's for this audit, the
  // same way the cascade will apply them in the browser.
  const layer = { ...stock.aliases[theme.appearance], ...derived.brand }
  const out: AuditEntry[] = []
  for (const pair of CONTRACT) {
    const fg = resolveToken(pair.fg, layer, derived.palette)
    const bg = resolveToken(pair.bg, layer, derived.palette)
    if (fg === null || bg === null) {
      out.push({ label: pair.label, ratio: null, min: pair.min, pass: true })
      continue
    }
    const ratio = contrast(fg, bg)
    out.push({ label: pair.label, ratio, min: pair.min, pass: ratio >= pair.min })
  }
  for (const pair of CHROME_CONTRACT) {
    const fg = required(derived.chrome[pair.fg], pair.fg)
    const ratio = Math.min(...pair.bg.map(b => contrast(fg, required(derived.chrome[b], b))))
    out.push({ label: pair.label, ratio, min: pair.min, pass: ratio >= pair.min })
```

</details>

**依据 2 · 作者声明**：[README.md:163-168](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/README.md#L163-L168)

作者安装、测试和图片声明。

```text
- 这是**源码级改动**，走 `install.sh` 覆盖 `packages/client/ui-theme` 并打一个 8 文件的宿主补丁，需要重新 `pnpm run build`。不是运行时注入，也不劫持任何进程。
- 基线版本是 `0.1.0-rc.5`。DSH 还在 developer preview，上游改动界面结构时补丁可能打不上，脚本会明确报错而不是装出一半。
- 装完之后 DSH 全量测试仍然是绿的：811 个测试文件、13548 个用例通过，覆盖率 100%（语句 / 分支 / 函数 / 行四项全满），逐文件阈值。注意这个口径是**宿主 DSH 全量测试**（在装好的 DSH 检出里跑），本仓库自身没有 CI 复现路径；仓库内可直接跑的是皮肤可读性契约：`node tree/packages/client/ui-theme/scripts/build-skins.mjs --check`。
- 自定义皮肤只在**本机**流转，压缩后的图存 `~/.dsh/skins/`，卸载脚本不动它，不要可以自己删。
- 上传路由只认 WebP 魔数，超过 4MB 的请求会被直接掐断而不是缓存进内存。
- 内置皮肤的背景图来源与再分发状态逐文件登记在 [ASSET_PROVENANCE.md](ASSET_PROVENANCE.md)，发布边界见 [NOTICE.md](NOTICE.md)。
```

**依据 3 · 源码核查**：[scripts/install.sh:43-58](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/scripts/install.sh#L43-L58)

覆盖先于补丁预检，失败没有整轮回滚。

<details>
<summary>查看原文（16行）</summary>

```text
# 2. 覆盖 ui-theme 包
rsync -a --delete --exclude 'node_modules' --exclude 'dist' --exclude 'lib' \
  "$HERE/tree/packages/client/ui-theme/" "$TARGET/packages/client/ui-theme/"
ok "已写入 ui-theme 皮肤包（21 套预设 + 自定义皮肤 + 更新检查）"

# 3. 打宿主集成补丁（背景层、玻璃拟态、消息气泡透明度）
cd "$TARGET"
if git -C "$TARGET" rev-parse --git-dir >/dev/null 2>&1; then
  if git apply --check "$HERE/patches/host-integration.patch" 2>/dev/null; then
    git apply "$HERE/patches/host-integration.patch"
    ok "已打宿主集成补丁"
  elif git apply --check --reverse "$HERE/patches/host-integration.patch" 2>/dev/null; then
    ok "宿主集成补丁已在，跳过"
  else
    die "补丁打不上。你的 deepseek-harness 版本可能和本皮肤包不匹配（本包基于 0.1.0-rc.5），请手工比对 patches/host-integration.patch"
  fi
```

</details>

**依据 4 · 源码核查**：[scripts/uninstall.sh:39-65](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/scripts/uninstall.sh#L39-L65)

备份归属检查后整份还原，图片仍留存。

<details>
<summary>查看原文（27行）</summary>

```text
# 显式传入时间戳同样强制校验归属，防止把别的仓库的备份还原进来
if [ -f "$BACKUP/.target" ] && [ "$(cat "$BACKUP/.target")" != "$TARGET" ]; then
  die "这份备份属于 $(cat "$BACKUP/.target")，与目标 $TARGET 不匹配"
fi

# 备份本身带皮肤就说明它记录的是「装过之后」的状态，还原它等于没卸载
[ -f "$BACKUP/packages/client/ui-theme/src/skin-version.ts" ] \
  && die "这份备份里已经含皮肤（$BACKUP），还原它退不回原生。请指定更早的时间戳：ls $ROOT"

printf '\n\033[1mDeepSeek Harness Skin 卸载\033[0m\n'
say "目标仓库：$TARGET"
say "还原自：$BACKUP"

rm -rf "$TARGET/packages/client/ui-theme"
cp -R "$BACKUP/packages/client/ui-theme" "$TARGET/packages/client/ui-theme"
ok "已还原 ui-theme 包"

while IFS= read -r rel; do
  [ -f "$BACKUP/$rel" ] || continue
  cp "$BACKUP/$rel" "$TARGET/$rel"
done < "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/patched-files.txt"
ok "已还原宿主集成补丁涉及的 8 个文件"

printf '\n\033[1m接下来手动跑这两条\033[0m\n'
say "cd $TARGET"
say "pnpm install && pnpm run build"
printf '\n本机上传过的自定义背景图仍留在 ~/.dsh/skins/，不用可以自行删除。\n\n'
```

</details>

#### 缺口

- 未对真实宿主页面作可读性、补丁兼容和恢复实验。
  **影响**：数值检查和源码条件不能当已运行缺陷或跨版本保证。
  **进一步探讨**：先对副本记录前后字节与补丁失败，再检查关键页面和恢复后用户改动是否完整。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些投入和退出条件决定是否值得采用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

对只想换颜色的普通npm用户，源码检出、重建及升级冲突负担偏高；当前建议观察。首次需要匹配宿主基线、检查备份、安装补丁、装依赖并构建，资源和工时未知。持续维护要跟随上游CSS/token/文件结构变化重新核对，背景图与多主题并不证明收益能抵消这份负担。

切回原生外观只是选择无skin的分支，客户端移除两个body属性；要撤销安装需恢复源码并重建。uninstall不会删除home中的自定义图片，也不合并安装后改动。因此退出前应保存现有源码差异、确认备份属于目标、审阅将被覆盖文件。现金成本没有本次数据，不能用开源许可证或纯本地颜色推导称为零成本。

继续评估可只在匹配基线的可丢弃源码副本比较原生、预设和一张自定义图片，验收可读性、对话任务不中断及退出恢复。遇到补丁不匹配、缺失备份、恢复会覆盖自己的改动或关键文字不可读应停止，返回已确认的原生检出；不要在主工作环境反复运行覆盖脚本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:48-69](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/README.md#L48-L69)

源码/构建前提与恢复入口。

<details>
<summary>查看原文（22行）</summary>

````text
## 快速开始

前置条件：一份 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 源码检出（版本 `0.1.0-rc.5`）、Node.js 22.19 以上、pnpm。从 npm 直接跑的 `npx @deepseek-ai/dsh` 装不了，因为这套皮肤要跟着前端一起构建。

```bash
git clone https://github.com/HeiGeAi/deepseek-harness-skin.git
cd deepseek-harness-skin
bash scripts/install.sh /path/to/deepseek-harness
```

脚本会先把要覆盖的文件整份备份到 `~/.dsh-skin-backups/<时间戳>/`，再写入皮肤包、打宿主集成补丁。然后按提示重建一次：

```bash
cd /path/to/deepseek-harness && pnpm install && pnpm run build && pnpm dsh web
```

浏览器打开 `http://127.0.0.1:3080`，左下角**设置 → 通用设置 → 皮肤**，点一下就换。

想退回原样：

```bash
bash scripts/uninstall.sh /path/to/deepseek-harness
````

</details>

**依据 2 · 源码核查**：[scripts/install.sh:26-45](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/scripts/install.sh#L26-L45)

首次备份和已安装跳过备份的行为。

<details>
<summary>查看原文（20行）</summary>

```text
# 1. 备份要覆盖的文件，装错了能原样退回。
#    已经装过皮肤就跳过，否则备份的是「装过之后」的样子，卸载会退不干净。
if [ -f "$TARGET/packages/client/ui-theme/src/skin-version.ts" ]; then
  ok "目标已装过皮肤，跳过备份（首次安装的备份仍在 $HOME/.dsh-skin-backups/）"
else
  STAMP="$(date +%Y%m%d-%H%M%S)"
  BACKUP="$HOME/.dsh-skin-backups/$STAMP"
  mkdir -p "$BACKUP/packages/client"
  cp -R "$TARGET/packages/client/ui-theme" "$BACKUP/packages/client/ui-theme"
  while IFS= read -r rel; do
    mkdir -p "$BACKUP/$(dirname "$rel")"
    cp "$TARGET/$rel" "$BACKUP/$rel"
  done < "$HERE/scripts/patched-files.txt"
  printf '%s\n' "$TARGET" > "$BACKUP/.target"
  ok "已备份到 $BACKUP"
fi

# 2. 覆盖 ui-theme 包
rsync -a --delete --exclude 'node_modules' --exclude 'dist' --exclude 'lib' \
  "$HERE/tree/packages/client/ui-theme/" "$TARGET/packages/client/ui-theme/"
```

</details>

**依据 3 · 源码核查**：[scripts/uninstall.sh:52-65](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/scripts/uninstall.sh#L52-L65)

整份恢复、重建与图片残留。

<details>
<summary>查看原文（14行）</summary>

```text
rm -rf "$TARGET/packages/client/ui-theme"
cp -R "$BACKUP/packages/client/ui-theme" "$TARGET/packages/client/ui-theme"
ok "已还原 ui-theme 包"

while IFS= read -r rel; do
  [ -f "$BACKUP/$rel" ] || continue
  cp "$BACKUP/$rel" "$TARGET/$rel"
done < "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/patched-files.txt"
ok "已还原宿主集成补丁涉及的 8 个文件"

printf '\n\033[1m接下来手动跑这两条\033[0m\n'
say "cd $TARGET"
say "pnpm install && pnpm run build"
printf '\n本机上传过的自定义背景图仍留在 ~/.dsh/skins/，不用可以自行删除。\n\n'
```

</details>

**依据 4 · 源码核查**：[tree/packages/client/ui-theme/src/client/index.ts:428-440](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/tree/packages/client/ui-theme/src/client/index.ts#L428-L440)

选回原生只移除皮肤DOM属性。

<details>
<summary>查看原文（13行）</summary>

```text
  const applySkin = (skin: SkinId, custom: CustomSkin): void => {
    if (typeof document === 'undefined') return
    // The custom skin's rules are derived, not bundled, so they have to exist
    // in the document before the attribute that selects them means anything.
    applyCustomSkinStyle(custom)
    const chrome = skinChrome(skin, custom)
    if (chrome === null) {
      document.body.removeAttribute('data-dsh-skin')
      document.body.removeAttribute('data-skin-chrome')
      return
    }
    document.body.setAttribute('data-dsh-skin', skin)
    document.body.setAttribute('data-skin-chrome', chrome)
```

</details>

#### 缺口

- 没有安装、编译、升级冲突和退出耗时数据。
  **影响**：不能确认维护成本对换肤需求可接受。
  **进一步探讨**：在副本记录一次安装、上游升级和恢复全流程，再由用户决定是否长期维护。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验图片主题和恢复设计的价值？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可复用设计是从图片提取少量颜色种子，再按语义角色派生与检查，而不是直接把图片主色应用到所有文字；配置驱动唯一DOM写路径也减少即时预览与刷新状态分叉。它们是色彩与状态管理的具体组合，未证明全局无闪烁或所有页面更易读。

未验证假设是先对目标宿主全部补丁做预检、再在临时树组装完整候选并比较受影响文件，全部成功后一次替换；退出保留三方差异而非覆盖回旧备份，可能降低源码换肤的维护风险。相对当前脚本增加临时磁盘与差异处理成本，不改变已实现皮肤能力。

最小验证在干净、已有用户改动和故意不兼容三个副本上比较旧流程与候选事务流程，要求失败后目标所有字节不变、成功后界面与原流程一致、恢复不丢用户改动。若不能保持失败原子性或恢复工时更高且无风险减少，就否定方案。此方案未实现，不计为当前贡献。

#### 证据与依据

**依据 1 · 源码核查**：[tree/packages/client/ui-theme/src/client/custom-skin.ts:88-109](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/tree/packages/client/ui-theme/src/client/custom-skin.ts#L88-L109)

颜色种子与派生报告是可复用依据。

<details>
<summary>查看原文（22行）</summary>

```text
export async function buildCustomSkin(file: File): Promise<BuiltSkin> {
  const bitmap = await createImageBitmap(file)
  try {
    const sample = scaleToCanvas(bitmap, SAMPLE_WIDTH)
    const pixels = sample.context.getImageData(0, 0, sample.canvas.width, sample.canvas.height).data
    const extracted = extractPalette(pixels)
    const report = tuneCustomSkin(extracted, STOCK)

    const stored = scaleToCanvas(bitmap, STORE_EDGE)
    const blob = await stored.canvas.convertToBlob({ type: 'image/webp', quality: STORE_QUALITY })
    const image = await upload(blob)

    return {
      report,
      custom: {
        image,
        appearance: report.theme.appearance,
        chrome: report.theme.chrome,
        veil: report.theme.veil,
        focus: '50% 50%',
        seeds: report.theme.seeds,
      },
```

</details>

**依据 2 · 源码核查**：[tree/packages/client/ui-theme/src/client/index.ts:470-479](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/tree/packages/client/ui-theme/src/client/index.ts#L470-L479)

配置先行且订阅写DOM，避免只改当前页。

<details>
<summary>查看原文（10行）</summary>

```text
    return {
      setTheme: (id) => { theme.setTheme(id) },
      setSkin: (skin) => { void host.set(SKIN_FIELD, skin) },
      // Persisting the derived skin is what activates it: the settings
      // subscription above is the only writer of the DOM, so the picker never
      // paints a skin that a reload would not bring back.
      setCustomImage: async (file) => {
        const built = await buildCustomSkin(file)
        await host.set(CUSTOM_SKIN_FIELD, built.custom)
        await host.set(SKIN_FIELD, CUSTOM_SKIN)
```

</details>

**依据 3 · 源码核查**：[scripts/install.sh:43-58](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/scripts/install.sh#L43-L58)

先覆盖后检查产生事务改进假设。

<details>
<summary>查看原文（16行）</summary>

```text
# 2. 覆盖 ui-theme 包
rsync -a --delete --exclude 'node_modules' --exclude 'dist' --exclude 'lib' \
  "$HERE/tree/packages/client/ui-theme/" "$TARGET/packages/client/ui-theme/"
ok "已写入 ui-theme 皮肤包（21 套预设 + 自定义皮肤 + 更新检查）"

# 3. 打宿主集成补丁（背景层、玻璃拟态、消息气泡透明度）
cd "$TARGET"
if git -C "$TARGET" rev-parse --git-dir >/dev/null 2>&1; then
  if git apply --check "$HERE/patches/host-integration.patch" 2>/dev/null; then
    git apply "$HERE/patches/host-integration.patch"
    ok "已打宿主集成补丁"
  elif git apply --check --reverse "$HERE/patches/host-integration.patch" 2>/dev/null; then
    ok "宿主集成补丁已在，跳过"
  else
    die "补丁打不上。你的 deepseek-harness 版本可能和本皮肤包不匹配（本包基于 0.1.0-rc.5），请手工比对 patches/host-integration.patch"
  fi
```

</details>

**依据 4 · 源码核查**：[scripts/uninstall.sh:52-59](https://github.com/HeiGeAi/deepseek-harness-skin/blob/848c92787e4b67b2892c7c15d6f45f1029a94d8d/scripts/uninstall.sh#L52-L59)

整份恢复产生保留差异需求。

```text
rm -rf "$TARGET/packages/client/ui-theme"
cp -R "$BACKUP/packages/client/ui-theme" "$TARGET/packages/client/ui-theme"
ok "已还原 ui-theme 包"

while IFS= read -r rel; do
  [ -f "$BACKUP/$rel" ] || continue
  cp "$BACKUP/$rel" "$TARGET/$rel"
done < "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/patched-files.txt"
```

#### 缺口

- 事务安装/三方恢复对维护工时的改善未知。
  **影响**：不能声称已经解决覆盖失败。
  **进一步探讨**：在三类副本对照字节不变、成功外观和用户改动保留，无法满足则放弃。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
