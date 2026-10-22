# dsh-douyin-publish

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[3413d53](https://github.com/7gzgn/dsh-douyin-publish/tree/3413d538e2b4a3384092c456c56f97862f787fed)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：把本地视频交给抖音或B站投稿页并填字段，默认草稿停手，可选配乐和显式发布分支。

> **核心亮点**：把文件递交、页面推进和字段准备接成步骤回执，减少桌面对话框依赖；非新上传/浏览器技术。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：cfg可默认publish，字段warning仍继续；published只证明点击，不核平台受理，固定browser键和取消传播也需明确。详见[Q02](#research-q02)。

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
  - [Q01 · 面向谁，文件到投稿页的主链是什么？](#detail-section-11)
  - [Q02 · 贡献和关键发布/回读边界是什么？](#detail-section-12)
  - [Q03 · 启动依赖、外发权限和读者步骤有哪些？](#detail-section-13)
  - [Q04 · 首次、持续与恢复成本和效果怎么评估？](#detail-section-14)
  - [Q05 · 工程可复用点和发布收据假设如何研究？](#detail-section-15)
  - [Q06 · 现在推荐什么，继续探讨从哪里开始？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有本地视频的创作者减少上传填表劳动，需人工核账号/素材/字段和平台受理。

人工上传/填表可替代，插件集中接线也引入页面适配、共享会话和未知状态恢复负担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 视频交接 | HTTP token注入/对话框 | 素材外发，推进非完整受理 |
| 投稿准备 | 标题/话题/可见性/封面 | 字段warn可能仍继续 |
| 配乐 | ffmpeg或平台面板 | 音轨未知不能当无声 |
| 发布分支 | 点投稿按钮 | cfg可继承，缺帖子收据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18、DSH tools/systemPrompt | Host必需 | douyin_upload工具与公告 | enabledfalse关闭注册 |
| 匹配browser服务/登录账号/当前页面选择器 | 实际操作必需 | DOM执行/键鼠/共享登录 | 无browser明确失败，verified仅作者版本记录 |
| 本地视频读取与平台上传授权 | 必需 | 临时HTTP交文件/网络上传 | draft也上传素材，不是无副作用预览 |
| ffprobe | 元数据可选 | 时长/编码与音轨判断 | BGM音轨探测失败会当无声 |
| ffmpeg/音频和足够临时空间 | 本地混音可选 | 新MP4混音 | 失败停止，副本需清理 |
| Windows PowerShell/桌面UI | 对话框fallback必需 | 大文件/注入失败时交文件 | 非跨平台保证，回读不明就失败 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定插件/宿主/browser和受控账号/视频 | 核cfg.mode/visibility、账号与授权，不共享并发任务 |
| 预检 | dryRun检查文件/参数 | 只预检不代表页面/上传验证 |
| 草稿 | 显式draft/private，检查页面与回执 | 核真实视频、标题/标签/可见范围，不自动发布 |
| 交付/恢复 | 用户看平台状态后决定 | 点过发布/上传未知时先查平台，避免重复调用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | browser/账号/可选ffmpeg与平台环境 | 固定页面版本、cfg和受控素材 | 当前适配需另核 |
| 持续使用 | 视频网络上传、页面Blob/File内存、可选混音/临时磁盘 | 审核字幕/标签/封面/可见性 | 512MiB注入阈值不是峰值内存上限 |
| 失败恢复 | 重传/混音副本、平台未提交稿处理 | 核实际平台受理/素材状态 | 无帖子ID/幂等键，未知不盲重发 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自动交文件 | token服务+DataTransfer与编辑页探测 | 服务端素材完整/上传最终成功 |
| 表单准备 | 部分回读、private/draft默认 | 所有字段一致及真实账号范围 |
| 发布 | 显式分支点击按钮 | 平台受理、帖子ID和最终可见性 |
| 可选配乐 | ffmpeg新副本/平台面板 | 音轨探测失败时原声保持及版权授权 |

> **思考**：cfg可默认publish，字段warning仍继续；published只证明点击，不核平台受理，固定browser键和取消传播也需明确。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把文件递交、页面推进和字段准备接成步骤回执，减少桌面对话框依赖；非新上传/浏览器技术。详见[Q01](#research-q01)与[Q02](#research-q02)。

把文件递交、页面推进和字段准备接成步骤回执，减少桌面对话框依赖；非新上传/浏览器技术。详见[Q01](#research-q01)与[Q02](#research-q02)。

声明式平台档案、纯参数校验、可见性unsupported拒绝、single-file token服务、DataTransfer交文件、界面推进后才判交接、对话框回读与步骤回执值得复用。作者把曲库搜索实验性和真机历史说清楚是证据分级价值，但作者verified不能永久覆盖网站改版。

<a id="detail-section-5"></a>

### 1.4 主要限制

cfg可默认publish，字段warning仍继续；published只证明点击，不核平台受理，固定browser键和取消传播也需明确。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，仅受控草稿核有效配置/账号与字段，补授权和受理收据后再评估采用。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持视频交接、页面推进和投稿字段准备的流程贡献；配置可继承发布、字段warning仍继续，点击即published未证明平台受理。账号/素材/字段绑定和受理状态收据尚未验证。

- 已检查：作者 README、包清单、源码路径 lib/plan.js、lib/pipeline.js、lib/attach.js、lib/platforms.js、lib/index.js、lib/serve.js、README.md、lib/bgm.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定参数/Host注册、主pipeline、文件服务/注入/对话框桥接和BGM边界；未全面审PowerShell UI细节或当前平台/上游browser实现。
- 下一步：进一步探讨可先核cfg/字段/账号与并发取消，再用平台可回读帖子证明受理，未知不重复点击。

**分析版本**

- **仓库**：[7gzgn/dsh-douyin-publish](https://github.com/7gzgn/dsh-douyin-publish)
- **版本号**：0.6.4（[固定提交 3413d53](https://github.com/7gzgn/dsh-douyin-publish/tree/3413d538e2b4a3384092c456c56f97862f787fed)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨账号/素材/字段绑定和发布受理收据，逐次授权、页锁及unknown查询恢复，平台维护成本未验证。详见[Q05](#research-q05)。

进一步探讨可先核cfg/字段/账号与并发取消，再用平台可回读帖子证明受理，未知不重复点击。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 99 | 70 | 14 | — |
| .js | source | 10 | 2267 | 1653 | 496 | — |
| .md | source | 1 | 177 | — | — | 2675 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-douyin-publish/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-douyin-publish/issues?q=is%3Aissue+created%3A2026-09-22T06%3A35%3A38.976Z..2026-10-22T06%3A35%3A38.976Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-douyin-publish/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A35%3A38.976Z..2026-10-22T06%3A35%3A38.976Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核文件交接/填表/草稿与发布状态，区分默认约束、逐次授权和平台受理证据。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，文件到投稿页的主链是什么？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向已有本地视频、希望减少抖音/B站上传与填表重复操作的创作者。输入绝对视频路径、标题/文案/标签、可见性和模式；输出步骤回执及投稿页状态，可选本地混音或打开平台曲库。合格草稿应是正确账号/素材/字段且没有投稿；发布合格则需平台真实受理和可核帖子，不能用click成功替代。

先校验路径/平台支持，读视频，dryRun在开页前返回；可选ffmpeg生成新视频。借browser固定键开会话并打开投稿页，等控件/处理恢复草稿提示。默认启动127.0.0.1随机token单文件服务，页面fetch blob造File/DataTransfer并派发input/change；探测编辑页推进并可换候选。大文件/注入失败改系统对话框并回读。随后填字段/可见性/封面，draft停手，publish分支点击，finally关文件服务。作者记录平台verified及真机经历应归作者证据，而非本轮/当前网站保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/plan.js:53-70](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/plan.js#L53-L70)

路径与模式参数。

<details>
<summary>查看原文（18行）</summary>

```text
export function validateInput(input = {}) {
  const errors = [];
  const videoPath = input.videoPath;
  if (typeof videoPath !== 'string' || videoPath.trim() === '') {
    errors.push('videoPath 必填：要发布的视频**绝对路径**');
  } else if (!isAbsolute(videoPath)) {
    errors.push(`videoPath 必须是绝对路径（不许靠当前目录猜）：${videoPath}`);
  } else {
    const lower = videoPath.toLowerCase();
    if (!VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
      errors.push(`videoPath 的后缀不在投稿页接受的格式里（${VIDEO_EXTENSIONS.join(' ')}）：${videoPath}`);
    }
  }
  if (input.visibility !== undefined && !Object.hasOwn(VISIBILITY, String(input.visibility))) {
    errors.push(`visibility 只能是 ${Object.keys(VISIBILITY).join(' / ')}（默认 private）`);
  }
  if (input.mode !== undefined && !MODES.includes(String(input.mode))) {
    errors.push(`mode 只能是 ${MODES.join(' / ')}（默认 draft）`);
```

</details>

**依据 2 · 源码核查**：[lib/pipeline.js:495-550](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L495-L550)

支持/预检边界。

<details>
<summary>查看原文（56行）</summary>

```text
  if (platform.verified !== true) {
    push('平台', 'error', `${platform.label} 尚未真机核对`);
    return {
      ok: false,
      steps,
      error: `platform-unsupported: ${platform.label} 的投稿页还没真机核对过选择器，不敢硬发。现在可用：${Object.values(PLATFORMS).filter((p) => p.verified).map((p) => p.label).join('、')}。`,
    };
  }
  // 可见性：平台没有这个选项时**当场拒绝**，绝不"默认当你没说过"（更不能偷偷按公开发出去）
  if (platform.supports?.visibility !== true || platform.visibility?.[options.visibility] === undefined) {
    const wanted = VISIBILITY[options.visibility]?.label ?? options.visibility;
    const available = Object.keys(platform.visibility ?? {});
    return {
      ok: false,
      steps,
      error: `visibility-unsupported: ${platform.label} 的投稿页没有「${wanted}」这个选项（它只有 ${available.length > 0 ? available.join(' / ') : '无'}）；要发到 ${platform.label} 请显式给一个它有的可见性。`,
    };
  }

  // ① 先看清手里的是什么视频
  const video = await inspectVideo(input.videoPath, deps);
  if (video.ok !== true) {
    push('检查视频', 'error', video.error ?? '读不到');
    return { ok: false, video, error: `video: ${video.error ?? '读不到'}`, steps };
  }
  const shape = [
    `${video.size} 字节`,
    video.width && video.height ? `${video.width}x${video.height}` : null,
    Number.isFinite(video.durationSec) ? `${video.durationSec.toFixed(1)} 秒` : null,
    video.codec ?? null,
  ].filter(Boolean).join('，');
  push('检查视频', 'ok', shape);

  const maxInjectBytes = Number.isFinite(options.maxInjectBytes) ? options.maxInjectBytes : DEFAULT_MAX_INJECT_BYTES;

  let bgmSource = options.bgmPath;

  if (input.dryRun === true) {
    push('开页面/交文件', 'skipped', '只检查模式：都没做');
    return {
      ok: true,
      dryRun: true,
      video,
      steps,
      platform: platform.key,
      title: options.title,
      visibility: options.visibility,
      mode: options.mode,
      plan: {
        platform: platform.label,
        url: platform.uploadUrl,
        visibility: platform.visibility?.[options.visibility] ?? VISIBILITY[options.visibility]?.label,
        willPublish: options.mode === 'publish',
        topics: options.topics,
        description: options.description,
        bgm: bgmSource === null ? null : { path: bgmSource, volume: options.bgmVolume },
```

</details>

**依据 3 · 源码核查**：[lib/pipeline.js:584-610](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L584-L610)

浏览器及恢复稿。

<details>
<summary>查看原文（27行）</summary>

```text
  // ② 借一个浏览器会话（每个插件用自己的键，不会和别的任务串台）
  let session;
  try {
    session = await browser.open(BROWSER_KEY);
  } catch (err) {
    push('浏览器', 'error', err instanceof Error ? err.message : String(err));
    return { ok: false, video, steps, error: `no-browser: ${err instanceof Error ? err.message : String(err)}` };
  }
  const localDeps = { ...deps, session };

  let server = null;
  try {
    // ③ 打开投稿页
    await browser.openUrl(session, { url: platform.uploadUrl }, deps.signal);
    push('打开投稿页', 'ok', `${platform.label}：${platform.uploadUrl}`);

    // ④ 等上传控件出现
    const ready = await waitFor(browser, localDeps, "!!document.querySelector('input[type=file]')", 30000);
    if (!ready.ok) {
      push('等页面就绪', 'error', `等了 ${Math.round(ready.waitedMs / 1000)} 秒，上传控件没出现`);
      return { ok: false, video, steps, pageUrl: await readUrl(browser, localDeps), error: 'upload-page-timeout: 投稿页没就绪（上传控件没出现）' };
    }
    push('等页面就绪', 'ok', `上传控件已出现（等了 ${Math.round(ready.waitedMs / 1000)} 秒）`);

    // ④'' 还有个"上次没提交的稿"提示时，选「不用了」——不接管别人的旧草稿
    const prompt = await dismissResumePrompt(browser, localDeps, platform);
    if (prompt.found) push('上次未提交的稿', prompt.clicked ? 'warn' : 'warn', prompt.detail);
```

</details>

**依据 4 · 源码核查**：[lib/pipeline.js:658-695](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L658-L695)

文件服务/候选/推进。

<details>
<summary>查看原文（38行）</summary>

```text
    // ⑤ 交文件：优先"注入"（不弹系统对话框、不挡人），大文件或注入失败再退回对话框
    let attachMode = 'inject';
    let inject = { ok: false, reason: 'skipped' };
    /** 交完文件后**页面有没有真的往前走**（出现编辑表单）。 */
    let advanced = false;
    const probeMs = Number.isFinite(deps.injectProbeMs) ? deps.injectProbeMs : 20000;
    if (video.size > maxInjectBytes) {
      push('选交文件方式', 'warn', `文件 ${video.size} 字节超过注入上限 ${maxInjectBytes}，改走系统对话框`);
    } else {
      try {
        server = await startFileServer({ filePath: uploadPath });
      } catch (err) {
        inject = { ok: false, reason: 'server-failed', error: err instanceof Error ? err.message : String(err) };
      }
      if (server !== null) {
        // 页面上可能有不止一个 input（B站藏着的是真上传口、看得见的反而没用）：
        // 逐个试，**只要页面往前走了就停**；每个候选给一段有限的等待。
        const candidates = Number.isFinite(deps.injectCandidates) ? deps.injectCandidates : 3;
        for (let index = 0; index < candidates; index += 1) {
          const attempt = await injectFile(browser, {
            session,
            url: server.url,
            fileName: fileNameOf(uploadPath),
            mime: mimeOf(uploadPath),
            inputSelector: platform.attach.inputSelector,
            candidateIndex: index,
            signal: deps.signal,
          });
          inject = attempt;
          if (attempt.ok !== true) break;
          push('交文件', 'ok', `注入方式：页面取回 ${attempt.bytes} 字节，塞进第 ${index + 1} 个上传控件（不弹系统对话框）`);
          const moved = await waitFor(browser, localDeps, platform.editReady, probeMs);
          if (moved.ok) { advanced = true; break; }
          if (index + 1 >= (attempt.candidates || 1)) {
            push('交文件', 'warn', `第 ${index + 1} 个上传控件塞进去后页面没往前走（共 ${attempt.candidates} 个候选）`);
            break;
          }
          push('换上传控件', 'warn', `第 ${index + 1} 个控件没反应，换下一个试`);
```

</details>

**依据 5 · 源码核查**：[lib/attach.js:40-71](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/attach.js#L40-L71)

Blob到File/input事件。

<details>
<summary>查看原文（32行）</summary>

```text
export async function injectFile(browser, opts = {}) {
  const inputSelector = opts.inputSelector ?? 'input[type=file]';
  const script = `return fetch(${JSON.stringify(String(opts.url))}).then(function(res){
    if (!res.ok) { throw new Error('http-' + res.status); }
    return res.blob();
  }).then(function(blob){
    var file = new File([blob], ${JSON.stringify(String(opts.fileName ?? 'video.mp4'))}, { type: ${JSON.stringify(String(opts.mime ?? 'video/mp4'))} });
    var dt = new DataTransfer();
    dt.items.add(file);
    var inputs = Array.prototype.slice.call(document.querySelectorAll(${JSON.stringify(inputSelector)}));
    var video = inputs.filter(function(el){
      var a = String(el.accept || '');
      return a === '' || /video|mp4|m4v|flv/i.test(a);
    });
    if (video.length === 0) {
      return { attached: 0, bytes: blob.size, inputs: inputs.length, candidates: 0, reason: 'no-video-input' };
    }
    // 候选顺序 = **DOM 里的先后**，不是"谁看得见"。
    // 实测（2026-10-17 真机，B站投稿页）：真正驱动上传的是那个**隐藏**的 input
    // （外面包着 .bcc-upload-wrapper），而页面上看得见的那个按钮里的 input 塞了没用 ——
    // 按"可见优先"选，页面会一直停在上传页，最后误报 edit-page-timeout。
    var want = ${JSON.stringify(Number.isInteger(opts.candidateIndex) ? opts.candidateIndex : 0)};
    var index = want >= 0 && want < video.length ? want : 0;
    var el = video[index];
    var visible = (function(){ var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })();
    try { el.files = dt.files; } catch (e) {
      return { attached: 0, bytes: blob.size, inputs: inputs.length, candidates: video.length, index: index, reason: 'assign-failed', error: String(e) };
    }
    var count = el.files ? el.files.length : -1;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return { attached: count, bytes: blob.size, inputs: inputs.length, candidates: video.length, index: index, visible: visible };
```

</details>

**依据 6 · 源码核查**：[lib/attach.js:111-129](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/attach.js#L111-L129)

fallback回读。

<details>
<summary>查看原文（19行）</summary>

```text
export async function attachViaDialog(browser, deps, opts = {}) {
  try {
    await browser.click(opts.session, { target: { by: 'text', value: String(opts.dialogText ?? '上传视频') } }, opts.signal);
  } catch (err) {
    return { ok: false, result: null, error: `click-failed: ${err instanceof Error ? err.message : String(err)}` };
  }
  await sleep(600);
  const hs = await runHandover({ path: opts.filePath, timeoutSec: opts.timeoutSec ?? 30 }, deps);
  // 关键：**没能回读校验**的填充不算成功 —— 否则就是"看到像成功的痕迹就当成功"。
  const verified = hs.result?.fillVerified === true;
  if (hs.ok !== true || verified !== true) {
    return {
      ok: false,
      result: hs.result ?? null,
      error: hs.result?.error ?? (hs.ok === true ? 'fill-unverified: 路径填进去了但回读不到，不能确认对话框收到了文件' : 'handover 失败'),
      stderr: hs.stderr,
    };
  }
  return { ok: true, result: hs.result };
```

</details>

**依据 7 · 源码核查**：[lib/pipeline.js:902-945](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L902-L945)

模式分支与服务关闭。

<details>
<summary>查看原文（44行）</summary>

```text
    // ⑨ 发布，或者**故意停在发布前**
    let published = false;
    if (options.mode === 'publish') {
      await browser.click(session, { target: { by: 'text', value: platform.selectors.submitText } }, deps.signal);
      published = true;
      push('点发布', 'ok', `已点「${platform.selectors.submitText}」（mode=publish 是显式要求的）`);
    } else {
      push('发布', 'skipped', `mode=draft：**故意没点「${platform.selectors.submitText}」**`);
    }

    return {
      ok: true,
      published,
      platform: platform.key,
      platformLabel: platform.label,
      attachMode,
      video,
      steps,
      pageUrl: await readUrl(browser, localDeps),
      title: options.title,
      titleFill,
      description: options.description,
      topics: options.topics,
      topicFill,
      bgm: bgm === null ? null : { path: bgmSource, volume: options.bgmVolume, videoHadAudio: bgm.videoHadAudio === true },
      coverTime: options.coverTime,
      coverSet: cover.applied === true,
      musicPicker,
      visibility: options.visibility,
      mode: options.mode,
      finishedAt: new Date().toISOString(),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    push('异常', 'error', message);
    return { ok: false, video, steps, error: message };
  } finally {
    if (server !== null) {
      try {
        await server.close();
      } catch {
        /* 关不掉也不影响结果 */
      }
    }
```

</details>

**依据 8 · 作者声明**：[lib/platforms.js:8-9](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/platforms.js#L8-L9)

verified为作者核对。

```text
 * **verified 的含义**：`true` = 作者在真机（真登录态）上把整条链路跑通并核对过选择器。
 * 没核对过的一律 `false`，调用即明确拒绝 —— 不拿别的平台的选择器去瞎点。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 贡献和关键发布/回读边界是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

价值在把单文件交接、页面结构检查、候选上传口、字段填写及默认草稿停手接成可解释步骤；避免默认依赖桌面文件对话框有实际接线增量，非新浏览器或上传协议。默认private/draft、unsupported拒绝、可见性失败中止是正向约束。

但是Host参数a.mode??cfg.mode、visibility同样继承配置，cfg可把省略mode的调用变成publish/公开；“每次必须显式要求”没有代码逐次授权令牌。发布分支click后立即publishedtrue并oktrue，没有等待受理/帖子ID或核最终可见性。失败/网络未知也缺幂等与收据。标题回读不符、文案/话题失败仅warning仍可进入发布，B站tag aligned直接true，全文子串出现也不等真实标签。布局探测unknown可继续，不能概括成所有控件缺失必停。

browser键是固定插件常量，不是每次调用独有，代码未见同键串行锁；同插件并发任务或用户手动改页可能串扰。工具execute没接执行上下文signal传pipeline，库虽支持deps.signal不能证明Host取消能中止整个链。单文件服务token/loopback是主调用默认，并非所有export使用都强制只回环，startFileServer公开options.host可覆盖；CORS开放意味着持有token的页面可读，token不可泄露。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:120-142](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/index.js#L120-L142)

cfg继承及未传signal。

<details>
<summary>查看原文（23行）</summary>

```text
      async execute(args) {
        const a = args ?? {};
        try {
          const data = await uploadVideo({
            videoPath: a.videoPath,
            title: a.title ?? cfg.title,
            description: a.description,
            topics: a.topics,
            bgmPath: a.bgmPath,
            bgmVolume: a.bgmVolume,
            pickMusic: a.pickMusic === true,
            musicSearch: a.musicSearch,
            platform: a.platform ?? cfg.platform,
            coverTime: a.coverTime ?? cfg.coverTime,
            visibility: a.visibility ?? cfg.visibility,
            mode: a.mode ?? cfg.mode,
            dryRun: a.dryRun === true,
            timeoutSec: a.timeoutSec ?? cfg.timeoutSec,
            maxInjectBytes: a.maxInjectBytes ?? cfg.maxInjectBytes,
          }, {
            browser: browserOf(ctx),
            ffprobe: cfg.ffprobe,
          });
```

</details>

**依据 2 · 源码核查**：[lib/pipeline.js:902-932](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L902-L932)

点击即标发布。

<details>
<summary>查看原文（31行）</summary>

```text
    // ⑨ 发布，或者**故意停在发布前**
    let published = false;
    if (options.mode === 'publish') {
      await browser.click(session, { target: { by: 'text', value: platform.selectors.submitText } }, deps.signal);
      published = true;
      push('点发布', 'ok', `已点「${platform.selectors.submitText}」（mode=publish 是显式要求的）`);
    } else {
      push('发布', 'skipped', `mode=draft：**故意没点「${platform.selectors.submitText}」**`);
    }

    return {
      ok: true,
      published,
      platform: platform.key,
      platformLabel: platform.label,
      attachMode,
      video,
      steps,
      pageUrl: await readUrl(browser, localDeps),
      title: options.title,
      titleFill,
      description: options.description,
      topics: options.topics,
      topicFill,
      bgm: bgm === null ? null : { path: bgmSource, volume: options.bgmVolume, videoHadAudio: bgm.videoHadAudio === true },
      coverTime: options.coverTime,
      coverSet: cover.applied === true,
      musicPicker,
      visibility: options.visibility,
      mode: options.mode,
      finishedAt: new Date().toISOString(),
```

</details>

**依据 3 · 源码核查**：[lib/pipeline.js:753-782](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L753-L782)

字段warn不中止/可见性失败中止。

<details>
<summary>查看原文（30行）</summary>

```text
    // ⑦ 填标题（B站会预填文件名，所以要整段覆盖再回读）
    let titleFill = null;
    if (options.title !== '') {
      titleFill = await fillTitle(browser, localDeps, platform, options.title);
      push('填标题', titleFill.ok ? 'ok' : 'warn', titleFill.ok
        ? options.title
        : `写进去了但回读是「${titleFill.readback}」`);
    } else {
      push('填标题', 'skipped', '没给标题');
    }

    // ⑦' 文案 + 话题（代填 + 回读）
    const topicFill = await fillCaptionAndTopics(browser, localDeps, platform, {
      description: options.description,
      topics: options.topics,
    });
    if (options.topics.length === 0 && options.description === '') {
      push('填文案/话题', 'skipped', '没给文案也没给话题');
    } else if (topicFill.ok) {
      const aligned = topicFill.aligned === true && (options.description === '' || topicFill.descriptionFilled);
      push('填文案/话题', aligned ? 'ok' : 'warn', topicFill.detail);
    } else {
      push('填文案/话题', 'warn', topicFill.detail);
    }

    // ⑧ 设可见性（默认仅自己可见）
    const vis = await setVisibility(browser, localDeps, platform, options.visibility);
    if (vis.ok !== true) {
      push('设可见性', 'error', vis.detail);
      return { ok: false, video, steps, pageUrl: await readUrl(browser, localDeps), error: `visibility: ${vis.detail}` };
```

</details>

**依据 4 · 源码核查**：[lib/pipeline.js:270-299](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L270-L299)

全文话题回读及tags对齐。

<details>
<summary>查看原文（30行）</summary>

```text
  let verified = 0;
  try {
    const res = await browser.execute(deps.session, {
      script: `return (()=>{ const el = document.querySelector(${JSON.stringify(platform.selectors.caption)}); return String((el && el.textContent) || ''); })()`,
    }, deps.signal);
    const body = typeof res?.value === 'string' ? res.value : '';
    verified = topics.filter((t) => body.includes(String(t).replace(/^#/, ''))).length;
  } catch {
    verified = 0;
  }

  const parts = [];
  if (description !== '') parts.push(descriptionFilled ? '文案已填' : '文案没填进去');
  if (topics.length > 0) {
    if (platform.topicMode === 'tags') {
      parts.push(`已代填 ${filled} 个标签（回车确认）`);
      if (tagLimited) parts.push('有话题超过 20 字，B站的标签会截断');
    } else if (verified >= filled) {
      parts.push(`已代填 ${filled} 个话题`);
    } else {
      parts.push(`已代填 ${filled} 个、回读到 ${verified} 个 —— 没读到的可能还没成标签，请在页面上看一眼`);
    }
  }
  // B站的话题落在标签框里，简介里读不到，所以 tags 模式下不拿简介回读去判成败
  const aligned = platform.topicMode === 'tags' ? true : verified >= filled;
  return {
    ok: filled > 0 || descriptionFilled,
    filled,
    verified,
    descriptionFilled,
```

</details>

**依据 5 · 源码核查**：[lib/pipeline.js:645-656](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L645-L656)

unknown布局继续。

<details>
<summary>查看原文（12行）</summary>

```text
    if (upCheck.known && upCheck.missing.length > 0) {
      push('版式自检', 'error', `缺：${upCheck.missing.join('、')}`);
      return {
        ok: false,
        platform: platform.key,
        video,
        steps,
        pageUrl: await readUrl(browser, localDeps),
        error: `layout-changed: ${platform.label} 投稿页版式变了（缺 ${upCheck.missing.join('、')}）—— 需要更新选择器`,
      };
    }
    push('版式自检', 'ok', upCheck.known ? '上传控件与「上传视频」区域都在' : '探不到（当作未知，继续）');
```

</details>

**依据 6 · 源码核查**：[lib/pipeline.js:584-592](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L584-L592)

固定key使用。

```text
  // ② 借一个浏览器会话（每个插件用自己的键，不会和别的任务串台）
  let session;
  try {
    session = await browser.open(BROWSER_KEY);
  } catch (err) {
    push('浏览器', 'error', err instanceof Error ? err.message : String(err));
    return { ok: false, video, steps, error: `no-browser: ${err instanceof Error ? err.message : String(err)}` };
  }
  const localDeps = { ...deps, session };
```

**依据 7 · 源码核查**：[lib/serve.js:60-68](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/serve.js#L60-L68)

host可覆盖/随机token。

```text
export async function startFileServer(options = {}) {
  const filePath = String(options.filePath ?? '');
  if (filePath === '') throw new Error('startFileServer: filePath 必填');
  const stat = statSync(filePath);
  if (!stat.isFile()) throw new Error(`startFileServer: 不是文件：${filePath}`);
  const host = options.host ?? '127.0.0.1';
  const ttlMs = Number.isFinite(options.ttlMs) ? options.ttlMs : DEFAULT_TTL_MS;
  const token = randomBytes(9).toString('hex');
  const route = `/f/${token}/${encodeURIComponent(basename(filePath))}`;
```

**依据 8 · 源码核查**：[lib/serve.js:100-112](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/serve.js#L100-L112)

开放CORS。

<details>
<summary>查看原文（13行）</summary>

```text
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
      res.end('method not allowed');
      return;
    }
    const headers = {
      'Content-Type': type,
      'Content-Length': String(stat.size),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Private-Network': 'true',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Type',
      'Cache-Control': 'no-store',
```

</details>

#### 缺口

- 平台受理、帖子ID、最终字段与可见范围未由published状态证明。
  **影响**：已发布回执可能实际仅点过按钮，重试可能重复。
  **进一步探讨**：可先定义clicked/accepted/unknown及可回读帖子收据，查平台现状再决定恢复。
- 真实browser固定键复用/并发及取消语义需宿主实现补充。
  **影响**：同插件调用可能互相改页，取消后不能保证停手。
  **进一步探讨**：可先固定browser版本核会话归属/锁与signal传播，再研究受控并发和取消迟到。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动依赖、外发权限和读者步骤有哪些？

**研究主题**：依赖、兼容与流程

#### 完整回答

Node/DSH是工具入口，browser登录态与其他会话共享，调用会把素材上传到第三方。draft只是“不点投稿”，素材已出本机；dryRun才在开页/交文件前返回。任意被进程可读的绝对视频路径可传，扩展名/绝对路径检查不构成工作区授权。FFmpeg本地配乐与平台曲库是不同链，后者默认开面板后用户操作，不应把实验搜索当可靠填词。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=18、DSH tools/systemPrompt | Host必需 | douyin_upload工具与公告 | enabledfalse关闭注册 |
| 匹配browser服务/登录账号/当前页面选择器 | 实际操作必需 | DOM执行/键鼠/共享登录 | 无browser明确失败，verified仅作者版本记录 |
| 本地视频读取与平台上传授权 | 必需 | 临时HTTP交文件/网络上传 | draft也上传素材，不是无副作用预览 |
| ffprobe | 元数据可选 | 时长/编码与音轨判断 | BGM音轨探测失败会当无声 |
| ffmpeg/音频和足够临时空间 | 本地混音可选 | 新MP4混音 | 失败停止，副本需清理 |
| Windows PowerShell/桌面UI | 对话框fallback必需 | 大文件/注入失败时交文件 | 非跨平台保证，回读不明就失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定插件/宿主/browser和受控账号/视频 | 核cfg.mode/visibility、账号与授权，不共享并发任务 |
| 预检 | dryRun检查文件/参数 | 只预检不代表页面/上传验证 |
| 草稿 | 显式draft/private，检查页面与回执 | 核真实视频、标题/标签/可见范围，不自动发布 |
| 交付/恢复 | 用户看平台状态后决定 | 点过发布/上传未知时先查平台，避免重复调用 |

工具注册提供结构参数，但cfg可能改变默认，必须看实际有效值。目标源码没有强制用户逐次确认的独立授权状态机；本轮只研究，不操作账号或调用发布。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-5](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/README.md#L3-L5)

作者目标待发布。

```text
**把一段本地视频，一路送到投稿页的"待发布"状态。**

打开投稿页 → 版式自检 → **把文件直接塞进页面自己的上传控件** → 填标题 → 填文案/话题 → 设可见性 → **默认停手**。
```

**依据 2 · 作者声明**：[lib/index.js:29-39](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/index.js#L29-L39)

共享登录/曲库/指导声明。

<details>
<summary>查看原文（11行）</summary>

```text
export const DOUYIN_GUIDANCE = [
  '本机已安装 **dsh-douyin-publish（视频发布器 · 抖音 / B站）**：`douyin_upload` 把一段本地视频送到投稿页 —— 打开投稿页 → 版式自检 → **把文件塞进页面自己的上传控件**（本机临时小服务 + DataTransfer，不弹系统对话框；大文件或注入被拦时才退回对话框）→ 填标题 → 代填文案/话题 → 设可见性 → **默认停在投稿前**。',
  `**两条默认值是刻意的**：可见性默认 \`private\`（${VISIBILITY.private.label}）、模式默认 \`draft\`（**不点投稿**）。要真发必须显式 `+"`mode: 'publish'`"+`，要公开必须显式 `+"`visibility: 'public'`"+`。`,
  '**平台**：`platform` 可给 `douyin`（默认）或 `bilibili` —— 这两个都在真机上核对过。B站的**话题会进"标签"**（回车确认），可见范围在「更多设置 → 可见范围」里；`coverTime` 只对抖音生效。小红书 / X 还没核对，传了会明确拒绝。',
  '**封面默认取第 1 秒**（第 0 帧常是黑场）；`coverTime: 0` 不动封面。',
  '**配乐**：`bgmPath` 给一段本地音频就会先用 ffmpeg 混好再上传（原视频不动），`bgmVolume` 默认 0.35；**文案**：`description` 填进简介。',
  '**版式自检**：投稿页/编辑页的关键控件缺一个就直接报 `layout-changed`（并点名缺什么），不会跑到一半停住。',
  '**它需要浏览器插件**（借 `ctx.browser` 服务）；没有时会给明确错误，不会假装能用。',
  `投稿页：抖音 ${PLATFORMS.douyin.uploadUrl}；B站 ${PLATFORMS.bilibili.uploadUrl}。它自己开一个浏览器会话，登录态与其它会话共享。`,
  '典型用法：`douyin_upload videoPath=<绝对路径> platform="bilibili" title=…` → 看一眼回执与页面 → 确认无误后再 `mode: "publish"` 投出去。',
  '遇到验证码/风控：它不会硬试 —— 请你到浏览器窗口里点一下，再让它继续。',
```

</details>

**依据 3 · 源码核查**：[lib/plan.js:53-65](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/plan.js#L53-L65)

绝对路径检查。

<details>
<summary>查看原文（13行）</summary>

```text
export function validateInput(input = {}) {
  const errors = [];
  const videoPath = input.videoPath;
  if (typeof videoPath !== 'string' || videoPath.trim() === '') {
    errors.push('videoPath 必填：要发布的视频**绝对路径**');
  } else if (!isAbsolute(videoPath)) {
    errors.push(`videoPath 必须是绝对路径（不许靠当前目录猜）：${videoPath}`);
  } else {
    const lower = videoPath.toLowerCase();
    if (!VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
      errors.push(`videoPath 的后缀不在投稿页接受的格式里（${VIDEO_EXTENSIONS.join(' ')}）：${videoPath}`);
    }
  }
```

</details>

**依据 4 · 源码核查**：[lib/pipeline.js:532-550](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L532-L550)

dryRun无浏览器动作。

<details>
<summary>查看原文（19行）</summary>

```text
  if (input.dryRun === true) {
    push('开页面/交文件', 'skipped', '只检查模式：都没做');
    return {
      ok: true,
      dryRun: true,
      video,
      steps,
      platform: platform.key,
      title: options.title,
      visibility: options.visibility,
      mode: options.mode,
      plan: {
        platform: platform.label,
        url: platform.uploadUrl,
        visibility: platform.visibility?.[options.visibility] ?? VISIBILITY[options.visibility]?.label,
        willPublish: options.mode === 'publish',
        topics: options.topics,
        description: options.description,
        bgm: bgmSource === null ? null : { path: bgmSource, volume: options.bgmVolume },
```

</details>

**依据 5 · 源码核查**：[lib/index.js:120-142](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/index.js#L120-L142)

实际参数/依赖。

<details>
<summary>查看原文（23行）</summary>

```text
      async execute(args) {
        const a = args ?? {};
        try {
          const data = await uploadVideo({
            videoPath: a.videoPath,
            title: a.title ?? cfg.title,
            description: a.description,
            topics: a.topics,
            bgmPath: a.bgmPath,
            bgmVolume: a.bgmVolume,
            pickMusic: a.pickMusic === true,
            musicSearch: a.musicSearch,
            platform: a.platform ?? cfg.platform,
            coverTime: a.coverTime ?? cfg.coverTime,
            visibility: a.visibility ?? cfg.visibility,
            mode: a.mode ?? cfg.mode,
            dryRun: a.dryRun === true,
            timeoutSec: a.timeoutSec ?? cfg.timeoutSec,
            maxInjectBytes: a.maxInjectBytes ?? cfg.maxInjectBytes,
          }, {
            browser: browserOf(ctx),
            ffprobe: cfg.ffprobe,
          });
```

</details>

**依据 6 · 源码核查**：[lib/bgm.js:112-130](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/bgm.js#L112-L130)

可选混音。

<details>
<summary>查看原文（19行）</summary>

```text
export async function mixBgm(input) {
  const spawnImpl = input.spawnImpl ?? nodeSpawn;
  const ffmpeg = resolveFfmpeg(input.ffmpeg);
  const ffprobe = input.ffprobe ?? 'ffprobe';
  const volume = Number.isFinite(input.volume) ? Number(input.volume) : DEFAULT_BGM_VOLUME;
  const outPath = join(input.tmpDir ?? tmpdir(), `dsh-douyin-bgm-${Date.now()}.mp4`);

  const videoHasAudio = await hasAudioTrack(spawnImpl, ffprobe, input.videoPath);
  const args = buildMixArgs({ videoPath: input.videoPath, bgmPath: input.bgmPath, outPath, volume, videoHasAudio });
  const res = await collect(spawnImpl, ffmpeg, args, 300000);
  if (res.code !== 0) {
    return {
      ok: false,
      error: `ffmpeg 混音失败（exit ${res.code}）`,
      stderrTail: res.stderr.split('\n').slice(-4).join(' | ').slice(0, 400),
      videoHadAudio: videoHasAudio,
    };
  }
  return { ok: true, outputPath: outPath, volume, videoHadAudio: videoHasAudio };
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续与恢复成本和效果怎么评估？

**研究主题**：效果与总成本

#### 完整回答

主要成本是平台/浏览器适配、上传带宽/等待、页面内存、可选混音磁盘CPU以及用户最终审稿。注入fetch blob再造File和DataTransfer，512MiB阈值只是输入选择，非峰值内存保证；每个候选最多等一段时间，实际总链还有多步等待。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | browser/账号/可选ffmpeg与平台环境 | 固定页面版本、cfg和受控素材 | 当前适配需另核 |
| 持续使用 | 视频网络上传、页面Blob/File内存、可选混音/临时磁盘 | 审核字幕/标签/封面/可见性 | 512MiB注入阈值不是峰值内存上限 |
| 失败恢复 | 重传/混音副本、平台未提交稿处理 | 核实际平台受理/素材状态 | 无帖子ID/幂等键，未知不盲重发 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自动交文件 | token服务+DataTransfer与编辑页探测 | 服务端素材完整/上传最终成功 |
| 表单准备 | 部分回读、private/draft默认 | 所有字段一致及真实账号范围 |
| 发布 | 显式分支点击按钮 | 平台受理、帖子ID和最终可见性 |
| 可选配乐 | ffmpeg新副本/平台面板 | 音轨探测失败时原声保持及版权授权 |

BGM音轨探测失败或解析异常返回false，混音走无原声映射分支，可能把探测未知当无声；不能承诺任何成功混音都保原声。输出按毫秒时间命名临时MP4，pipeline只关闭HTTP服务未删除混音副本，资源/敏感素材保留需核。未知上传/发布时从平台查状态比重新跑全链更必要。

#### 证据与依据

**依据 1 · 源码核查**：[lib/attach.js:42-71](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/attach.js#L42-L71)

页面Blob/File。

<details>
<summary>查看原文（30行）</summary>

```text
  const script = `return fetch(${JSON.stringify(String(opts.url))}).then(function(res){
    if (!res.ok) { throw new Error('http-' + res.status); }
    return res.blob();
  }).then(function(blob){
    var file = new File([blob], ${JSON.stringify(String(opts.fileName ?? 'video.mp4'))}, { type: ${JSON.stringify(String(opts.mime ?? 'video/mp4'))} });
    var dt = new DataTransfer();
    dt.items.add(file);
    var inputs = Array.prototype.slice.call(document.querySelectorAll(${JSON.stringify(inputSelector)}));
    var video = inputs.filter(function(el){
      var a = String(el.accept || '');
      return a === '' || /video|mp4|m4v|flv/i.test(a);
    });
    if (video.length === 0) {
      return { attached: 0, bytes: blob.size, inputs: inputs.length, candidates: 0, reason: 'no-video-input' };
    }
    // 候选顺序 = **DOM 里的先后**，不是"谁看得见"。
    // 实测（2026-10-17 真机，B站投稿页）：真正驱动上传的是那个**隐藏**的 input
    // （外面包着 .bcc-upload-wrapper），而页面上看得见的那个按钮里的 input 塞了没用 ——
    // 按"可见优先"选，页面会一直停在上传页，最后误报 edit-page-timeout。
    var want = ${JSON.stringify(Number.isInteger(opts.candidateIndex) ? opts.candidateIndex : 0)};
    var index = want >= 0 && want < video.length ? want : 0;
    var el = video[index];
    var visible = (function(){ var r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })();
    try { el.files = dt.files; } catch (e) {
      return { attached: 0, bytes: blob.size, inputs: inputs.length, candidates: video.length, index: index, reason: 'assign-failed', error: String(e) };
    }
    var count = el.files ? el.files.length : -1;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return { attached: count, bytes: blob.size, inputs: inputs.length, candidates: video.length, index: index, visible: visible };
```

</details>

**依据 2 · 源码核查**：[lib/pipeline.js:663-695](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L663-L695)

候选等待。

<details>
<summary>查看原文（33行）</summary>

```text
    const probeMs = Number.isFinite(deps.injectProbeMs) ? deps.injectProbeMs : 20000;
    if (video.size > maxInjectBytes) {
      push('选交文件方式', 'warn', `文件 ${video.size} 字节超过注入上限 ${maxInjectBytes}，改走系统对话框`);
    } else {
      try {
        server = await startFileServer({ filePath: uploadPath });
      } catch (err) {
        inject = { ok: false, reason: 'server-failed', error: err instanceof Error ? err.message : String(err) };
      }
      if (server !== null) {
        // 页面上可能有不止一个 input（B站藏着的是真上传口、看得见的反而没用）：
        // 逐个试，**只要页面往前走了就停**；每个候选给一段有限的等待。
        const candidates = Number.isFinite(deps.injectCandidates) ? deps.injectCandidates : 3;
        for (let index = 0; index < candidates; index += 1) {
          const attempt = await injectFile(browser, {
            session,
            url: server.url,
            fileName: fileNameOf(uploadPath),
            mime: mimeOf(uploadPath),
            inputSelector: platform.attach.inputSelector,
            candidateIndex: index,
            signal: deps.signal,
          });
          inject = attempt;
          if (attempt.ok !== true) break;
          push('交文件', 'ok', `注入方式：页面取回 ${attempt.bytes} 字节，塞进第 ${index + 1} 个上传控件（不弹系统对话框）`);
          const moved = await waitFor(browser, localDeps, platform.editReady, probeMs);
          if (moved.ok) { advanced = true; break; }
          if (index + 1 >= (attempt.candidates || 1)) {
            push('交文件', 'warn', `第 ${index + 1} 个上传控件塞进去后页面没往前走（共 ${attempt.candidates} 个候选）`);
            break;
          }
          push('换上传控件', 'warn', `第 ${index + 1} 个控件没反应，换下一个试`);
```

</details>

**依据 3 · 源码核查**：[lib/bgm.js:69-79](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/bgm.js#L69-L79)

音轨失败返回false。

<details>
<summary>查看原文（11行）</summary>

```text
export async function hasAudioTrack(spawnImpl, ffprobe, path) {
  const res = await collect(spawnImpl, ffprobe, [
    '-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=codec_name', '-of', 'json', path,
  ], 20000);
  if (res.code !== 0) return false;
  try {
    const parsed = JSON.parse(res.stdout);
    return Array.isArray(parsed?.streams) && parsed.streams.length > 0;
  } catch {
    return false;
  }
```

</details>

**依据 4 · 源码核查**：[lib/bgm.js:87-104](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/bgm.js#L87-L104)

两种映射。

<details>
<summary>查看原文（18行）</summary>

```text
export function buildMixArgs({ videoPath, bgmPath, outPath, volume, videoHasAudio }) {
  const gain = Math.max(0, Math.min(2, Number(volume)));
  const base = ['-y', '-i', videoPath, '-stream_loop', '-1', '-i', bgmPath];
  if (videoHasAudio) {
    return [
      ...base,
      '-filter_complex',
      `[1:a]volume=${gain}[bg];[0:a][bg]amix=inputs=2:duration=first:dropout_transition=0[aout]`,
      '-map', '0:v:0', '-map', '[aout]',
      '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', outPath,
    ];
  }
  return [
    ...base,
    '-filter_complex', `[1:a]volume=${gain}[aout]`,
    '-map', '0:v:0', '-map', '[aout]',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', outPath,
  ];
```

</details>

**依据 5 · 源码核查**：[lib/bgm.js:112-130](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/bgm.js#L112-L130)

临时新视频。

<details>
<summary>查看原文（19行）</summary>

```text
export async function mixBgm(input) {
  const spawnImpl = input.spawnImpl ?? nodeSpawn;
  const ffmpeg = resolveFfmpeg(input.ffmpeg);
  const ffprobe = input.ffprobe ?? 'ffprobe';
  const volume = Number.isFinite(input.volume) ? Number(input.volume) : DEFAULT_BGM_VOLUME;
  const outPath = join(input.tmpDir ?? tmpdir(), `dsh-douyin-bgm-${Date.now()}.mp4`);

  const videoHasAudio = await hasAudioTrack(spawnImpl, ffprobe, input.videoPath);
  const args = buildMixArgs({ videoPath: input.videoPath, bgmPath: input.bgmPath, outPath, volume, videoHasAudio });
  const res = await collect(spawnImpl, ffmpeg, args, 300000);
  if (res.code !== 0) {
    return {
      ok: false,
      error: `ffmpeg 混音失败（exit ${res.code}）`,
      stderrTail: res.stderr.split('\n').slice(-4).join(' | ').slice(0, 400),
      videoHadAudio: videoHasAudio,
    };
  }
  return { ok: true, outputPath: outPath, volume, videoHadAudio: videoHasAudio };
```

</details>

**依据 6 · 源码核查**：[lib/pipeline.js:938-945](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L938-L945)

仅服务关闭。

```text
  } finally {
    if (server !== null) {
      try {
        await server.close();
      } catch {
        /* 关不掉也不影响结果 */
      }
    }
```

#### 缺口

- 无同素材/字段的总耗时、内存、完整受理正确率和人工介入对照。
  **影响**：不能承诺全自动发布成功、节省固定时间或低资源。
  **进一步探讨**：可用授权受控账号先比较draft字段保真/总资源，再以平台收据定义真实受理，记录所有恢复成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程可复用点和发布收据假设如何研究？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

声明式平台档案、纯参数校验、可见性unsupported拒绝、single-file token服务、DataTransfer交文件、界面推进后才判交接、对话框回读与步骤回执值得复用。作者把曲库搜索实验性和真机历史说清楚是证据分级价值，但作者verified不能永久覆盖网站改版。

可探讨未验证的“账号/素材/字段绑定与受理收据”。每次草稿生成绑定账号、视频hash、字段hash和页面版本；字段缺失/回读不符阻止publish，逐次授权只对该草稿有效且不由cfg默认继承。固定浏览器页加锁，明确draft/上传中/clicked/accepted/unknown，受理以帖子ID及回读字段作证；未知只查询不自动重传。源视频可先固定句柄/快照，临时副本有期限与清理收据。代价是页面/平台协议维护、hash成本与恢复状态存储。可用用户改页、并发、字段warn、点击后丢响应、平台拒绝、超时取消和混音音轨未知夹具研究；若仍把click等同accepted，应保留unknown。

#### 证据与依据

**依据 1 · 源码核查**：[lib/platforms.js:22-58](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/platforms.js#L22-L58)

平台档案。

<details>
<summary>查看原文（37行）</summary>

```text
export const PLATFORMS = Object.freeze({
  douyin: {
    key: 'douyin',
    label: '抖音',
    verified: true,
    uploadUrl: 'https://creator.douyin.com/creator-micro/content/upload',
    /** 进入编辑页后 URL 会带这个片段（B站不换 URL，所以它是可选的旁证）。 */
    editUrlMark: '/content/post/video',
    attach: {
      inputSelector: 'input[type=file]',
      /** 注入失败或文件太大时的退路：真点这个按钮，等系统对话框。 */
      dialogText: '上传视频',
    },
    selectors: {
      title: 'input[placeholder*="作品标题"]',
      caption: '[contenteditable="true"]',
      coverEntry: '选择封面',
      submitText: '发布',
      draftText: '暂存离开',
      /** 平台曲库入口：点开之后由人自己在里面搜歌/试听/使用。 */
      musicEntry: ['添加音乐', '选择音乐'],
      /**
       * 曲库面板（2026-10-18 真机核对）：入口其实是右侧那颗「添加音乐」标签
       * （class 里有 preview-button），点开是一个 "选择音乐" 侧边面板，里面有「搜索音乐」框。
       */
      musicPanel: {
        entrySelector: 'div[class*=preview-button]',
        searchInput: 'input[placeholder*="搜索音乐"]',
      },
    },
    /** 编辑页"就绪"的判据（页面里执行）。 */
    editReady: '!!document.querySelector(\'input[placeholder*="作品标题"]\')',
    /** 可见性：页面上真实存在的中文文案 → 值。 */
    visibility: { public: '公开', friends: '好友可见', private: '仅自己可见' },
    /** 话题怎么落地：inline = 写进简介（"#话题 "）。 */
    topicMode: 'inline',
    supports: { visibility: true, cover: true },
```

</details>

**依据 2 · 源码核查**：[lib/serve.js:60-68](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/serve.js#L60-L68)

token单文件。

```text
export async function startFileServer(options = {}) {
  const filePath = String(options.filePath ?? '');
  if (filePath === '') throw new Error('startFileServer: filePath 必填');
  const stat = statSync(filePath);
  if (!stat.isFile()) throw new Error(`startFileServer: 不是文件：${filePath}`);
  const host = options.host ?? '127.0.0.1';
  const ttlMs = Number.isFinite(options.ttlMs) ? options.ttlMs : DEFAULT_TTL_MS;
  const token = randomBytes(9).toString('hex');
  const route = `/f/${token}/${encodeURIComponent(basename(filePath))}`;
```

**依据 3 · 源码核查**：[lib/pipeline.js:677-690](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L677-L690)

推进探测。

<details>
<summary>查看原文（14行）</summary>

```text
          const attempt = await injectFile(browser, {
            session,
            url: server.url,
            fileName: fileNameOf(uploadPath),
            mime: mimeOf(uploadPath),
            inputSelector: platform.attach.inputSelector,
            candidateIndex: index,
            signal: deps.signal,
          });
          inject = attempt;
          if (attempt.ok !== true) break;
          push('交文件', 'ok', `注入方式：页面取回 ${attempt.bytes} 字节，塞进第 ${index + 1} 个上传控件（不弹系统对话框）`);
          const moved = await waitFor(browser, localDeps, platform.editReady, probeMs);
          if (moved.ok) { advanced = true; break; }
```

</details>

**依据 4 · 源码核查**：[lib/attach.js:118-129](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/attach.js#L118-L129)

对话框回读。

<details>
<summary>查看原文（12行）</summary>

```text
  const hs = await runHandover({ path: opts.filePath, timeoutSec: opts.timeoutSec ?? 30 }, deps);
  // 关键：**没能回读校验**的填充不算成功 —— 否则就是"看到像成功的痕迹就当成功"。
  const verified = hs.result?.fillVerified === true;
  if (hs.ok !== true || verified !== true) {
    return {
      ok: false,
      result: hs.result ?? null,
      error: hs.result?.error ?? (hs.ok === true ? 'fill-unverified: 路径填进去了但回读不到，不能确认对话框收到了文件' : 'handover 失败'),
      stderr: hs.stderr,
    };
  }
  return { ok: true, result: hs.result };
```

</details>

**依据 5 · 源码核查**：[lib/pipeline.js:902-932](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L902-L932)

收据假设起点。

<details>
<summary>查看原文（31行）</summary>

```text
    // ⑨ 发布，或者**故意停在发布前**
    let published = false;
    if (options.mode === 'publish') {
      await browser.click(session, { target: { by: 'text', value: platform.selectors.submitText } }, deps.signal);
      published = true;
      push('点发布', 'ok', `已点「${platform.selectors.submitText}」（mode=publish 是显式要求的）`);
    } else {
      push('发布', 'skipped', `mode=draft：**故意没点「${platform.selectors.submitText}」**`);
    }

    return {
      ok: true,
      published,
      platform: platform.key,
      platformLabel: platform.label,
      attachMode,
      video,
      steps,
      pageUrl: await readUrl(browser, localDeps),
      title: options.title,
      titleFill,
      description: options.description,
      topics: options.topics,
      topicFill,
      bgm: bgm === null ? null : { path: bgmSource, volume: options.bgmVolume, videoHadAudio: bgm.videoHadAudio === true },
      coverTime: options.coverTime,
      coverSet: cover.applied === true,
      musicPicker,
      visibility: options.visibility,
      mode: options.mode,
      finishedAt: new Date().toISOString(),
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 现在推荐什么，继续探讨从哪里开始？

**研究主题**：采用判断

#### 完整回答

推荐observe，已有草稿自动接线价值，但发布授权/受理状态和字段失败不中止需先澄清；不建议直接依赖当前published作为业务成功。继续研究可从显式draft/private及核cfg、正确账号/素材、只读字段回读开始，补同键锁/取消和受理收据，再评估是否可有限试用。

可先用无敏感自有素材与受控账号，不调用publish，人工确认平台实际状态；发布点击结果未知、账号不符、字段回读不符、可见性不明、旧稿/并发串扰、音轨探测不明或取消不生效时，应停止并先查平台/本地副本，不盲重复整条链。本轮不把未做冒烟作为缺陷，也不声称作者历史适配等于当前可用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:130-142](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/index.js#L130-L142)

有效参数依赖。

<details>
<summary>查看原文（13行）</summary>

```text
            pickMusic: a.pickMusic === true,
            musicSearch: a.musicSearch,
            platform: a.platform ?? cfg.platform,
            coverTime: a.coverTime ?? cfg.coverTime,
            visibility: a.visibility ?? cfg.visibility,
            mode: a.mode ?? cfg.mode,
            dryRun: a.dryRun === true,
            timeoutSec: a.timeoutSec ?? cfg.timeoutSec,
            maxInjectBytes: a.maxInjectBytes ?? cfg.maxInjectBytes,
          }, {
            browser: browserOf(ctx),
            ffprobe: cfg.ffprobe,
          });
```

</details>

**依据 2 · 源码核查**：[lib/pipeline.js:753-782](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L753-L782)

字段/可见性。

<details>
<summary>查看原文（30行）</summary>

```text
    // ⑦ 填标题（B站会预填文件名，所以要整段覆盖再回读）
    let titleFill = null;
    if (options.title !== '') {
      titleFill = await fillTitle(browser, localDeps, platform, options.title);
      push('填标题', titleFill.ok ? 'ok' : 'warn', titleFill.ok
        ? options.title
        : `写进去了但回读是「${titleFill.readback}」`);
    } else {
      push('填标题', 'skipped', '没给标题');
    }

    // ⑦' 文案 + 话题（代填 + 回读）
    const topicFill = await fillCaptionAndTopics(browser, localDeps, platform, {
      description: options.description,
      topics: options.topics,
    });
    if (options.topics.length === 0 && options.description === '') {
      push('填文案/话题', 'skipped', '没给文案也没给话题');
    } else if (topicFill.ok) {
      const aligned = topicFill.aligned === true && (options.description === '' || topicFill.descriptionFilled);
      push('填文案/话题', aligned ? 'ok' : 'warn', topicFill.detail);
    } else {
      push('填文案/话题', 'warn', topicFill.detail);
    }

    // ⑧ 设可见性（默认仅自己可见）
    const vis = await setVisibility(browser, localDeps, platform, options.visibility);
    if (vis.ok !== true) {
      push('设可见性', 'error', vis.detail);
      return { ok: false, video, steps, pageUrl: await readUrl(browser, localDeps), error: `visibility: ${vis.detail}` };
```

</details>

**依据 3 · 源码核查**：[lib/pipeline.js:902-932](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js#L902-L932)

click与结果。

<details>
<summary>查看原文（31行）</summary>

```text
    // ⑨ 发布，或者**故意停在发布前**
    let published = false;
    if (options.mode === 'publish') {
      await browser.click(session, { target: { by: 'text', value: platform.selectors.submitText } }, deps.signal);
      published = true;
      push('点发布', 'ok', `已点「${platform.selectors.submitText}」（mode=publish 是显式要求的）`);
    } else {
      push('发布', 'skipped', `mode=draft：**故意没点「${platform.selectors.submitText}」**`);
    }

    return {
      ok: true,
      published,
      platform: platform.key,
      platformLabel: platform.label,
      attachMode,
      video,
      steps,
      pageUrl: await readUrl(browser, localDeps),
      title: options.title,
      titleFill,
      description: options.description,
      topics: options.topics,
      topicFill,
      bgm: bgm === null ? null : { path: bgmSource, volume: options.bgmVolume, videoHadAudio: bgm.videoHadAudio === true },
      coverTime: options.coverTime,
      coverSet: cover.applied === true,
      musicPicker,
      visibility: options.visibility,
      mode: options.mode,
      finishedAt: new Date().toISOString(),
```

</details>

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
