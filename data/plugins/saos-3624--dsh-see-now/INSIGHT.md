# See Now

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8b8e6c6](https://github.com/SAOS-3624/dsh-see-now/tree/8b8e6c6daff5eea44925de55f565d101cee8f684)

<!-- BEGIN META -->
[![GitHub ★ 532](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=532&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SAOS-3624/dsh-see-now) [![npm 30d 14,055](https://img.shields.io/static/v1?label=npm+30d&message=14%2C055&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-see-now) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-see-now)
<!-- END META -->

> **功能**：在 DSH 中从屏幕、摄像头或视频文件筛选变化帧，拼图后交给视觉模型。

> **亮点**：[Q01](#research-q01) 用少量带时间范围的 PNG 附件保留多个变化时点。[Q02](#research-q02) Linux 采集路径按 RGB 行步长解码后保留稳定的宿主帧协议。

> **主要限制**：[Q03](#research-q03) 关窗后的隐式 watch 会被拦截，显式来源仍可解除挂断。已保存图像另由宿主管理。

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
  - [Q01 · 选帧拼图在什么任务中比手工或定时截图有用？](#detail-section-11)
  - [Q02 · Linux 的斜切修复是否真正进入采集数据路径？](#detail-section-12)
  - [Q03 · 关闭之后能阻止哪些后续动作，已交付画面或音频如何处理？](#detail-section-13)
  - [Q04 · 怎样进行可退出的试用，并验证短暂局部变化是否被遗漏？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：要复核屏幕操作先后顺序的 DSH 用户可将一小段录屏转换成带时序的拼图。

手工单图保留原尺寸细节。定时截图提供固定采样间隔，持续过程中容易积累相似画面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 变化选帧 | 提供多个操作时点 | 小面积或短暂变化可能漏过 |
| 屏幕命令 | 启动或关闭持续采集 | 宿主需提供命令服务 |
| 媒体附件 | 交付时间段和视觉证据 | 留存和删除走宿主流程 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools、attachments 和会话服务 | 必需 | 调用并交付图像 | 无宿主接线 |
| 兼容的采集设备或本地视频与解码 | 必需 | 取得 RGB 帧 | 先用兼容短文件 |
| Linux 桌面 Portal 与 GStreamer | Linux 屏幕必需 | 获取屏幕共享流 | 改用文件 |
| 视觉模型 | 判读时必需 | 解释多个时点 | 手工检查拼图 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选无敏感短视频并指定文件源 | 模型、会话和路径明确 |
| 检查 | 对照时点、内容和完整回答 | 漏关键变化时回原尺寸截图 |
| 退出 | 关闭采集并检查附件 | 清除历史或文件需走宿主流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 解码、模型和图形设备 | 设置权限及检查来源 | 平台配置时间未知 |
| 持续 | 编码和视觉输入 | 对照遗漏或错序 | 实际账单未知 |
| 恢复 | 可能重新获取或回放 | 停进程、查附件、回人工截图 | 未测清理成本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多时点输入 | 筛帧、拼图、时间范围 | 短暂和局部事件识别 |
| Linux 采集 | 固定代码按步长解帧 | 发行物与多平台实测 |
| 退出 | 隐式重开拦截与停循环 | 附件及外部模型留存 |

> **思考**：[Q03](#research-q03) 关窗后的隐式 watch 会被拦截，显式来源仍可解除挂断。已保存图像另由宿主管理。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 用少量带时间范围的 PNG 附件保留多个变化时点。[Q02](#research-q02) Linux 采集路径按 RGB 行步长解码后保留稳定的宿主帧协议。

采集 worker 与宿主使用长度前缀，避免 stdout 分块影响边界。工具区分文件结束、取消和无变化。进程终止与图像留存分别检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 关窗后的隐式 watch 会被拦截，显式来源仍可解除挂断。已保存图像另由宿主管理。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 单独会话先试无敏感短视频。出现关键变化遗漏、字太小或数据归属不明时，结束试用并换用户手工选择的截图。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

工具、选帧、附件、Linux 行对齐及停止路径获源码支持。作者报告的 798 宽度实测未复现，当前包是否包含未发布修复待核实。区域采样为待验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.js、src/pipeline.js、src/portal_stream.py、src/portal-capture.js、CHANGELOG.md、package.json、src/runner.js、src/command.js、src/offload.js、src/listen.js、src/settings-api.mjs、src/settings-trust.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定代码、作者资料和代表性机制。本轮未启动插件、录屏、音频、Portal 或外部模型。
- 下一步：按宽度档位对照实际字节、像素和图像内容。用标注的短视频对照局部变化、合格答案与账单，另在隔离环境检查关停和附件清理。

**分析版本**

- **仓库**：[SAOS-3624/dsh-see-now](https://github.com/SAOS-3624/dsh-see-now)
- **版本号**：0.2.1（[固定提交 8b8e6c6](https://github.com/SAOS-3624/dsh-see-now/tree/8b8e6c6daff5eea44925de55f565d101cee8f684)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 独立给用户指定的小区域保留变化采样额度，可能在同图预算下保留短暂界面事件。

按宽度档位对照实际字节、像素和图像内容。用标注的短视频对照局部变化、合格答案与账单，另在隔离环境检查关停和附件清理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 2500 | — | — | 34634 |
| .mjs | source | 16 | 2004 | 1431 | 389 | — |
| .js | source | 34 | 13800 | 8133 | 5037 | — |
| .mjs | example | 1 | 110 | 61 | 43 | — |
| .mjs | test | 61 | 8631 | 6623 | 1048 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-10），可前往 [GitHub Issues](https://github.com/SAOS-3624/dsh-see-now/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：对需要复核屏幕操作时序的 DSH 用户，这个固定版本能否在保留关键画面和退出边界的同时减少重复视觉输入？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 选帧拼图在什么任务中比手工或定时截图有用？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要向 DSH 说明一段界面操作、又不便逐张截图的开发者，可以给出一段短的本地录屏，例如展示配置前后一个按钮何时由禁用转为可用。合格结果应让模型从图中辨认状态变化并按正确顺序解释，而不能只识别当前画面。单一且已知时点更适合直接截一张原尺寸图；均匀取样提供固定时间覆盖，短暂变化仍会落在间隔中。

插件从宿主工具入口取得采集结果，流水线在硬切判定、累计运动量和长时间静止兜底之间决定是否保留帧。部分疑似切点要等待未来帧再判，能排除部分前景扰动，也会增加延迟。编排器将保留的画面打包，宿主依次保存 PNG 附件并返回时间段、帧数、字节数和附件引用。适配的视觉模型可一次取得多时点上下文。小角标变化可能低于全局门槛，多帧缩放又可能使小字读不清，因此只看输出图数无法判断节省了多少合格输入。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:47-62](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/README.md#L47-L62)

作者解释按变化筛帧与固定采样的对照。

<details>
<summary>查看原文（16行）</summary>

```text
## 它解决什么问题

想让 AI 陪你看屏幕，最直觉的做法是"定时截全屏喂过去"。两个死结：

| 做法 | 问题 |
|---|---|
| 每 2 秒截一张全屏 | 一分钟 30 张图，全是重复画面，token 直接烧穿 |
| 每隔 30 秒截一张 | 中间发生了什么全丢了，AI 只会说"看起来你在用电脑" |

See Now 换了个思路：**先判断这一帧值不值得看，再决定传不传**。

- 每个画面帧先打一个 **0–255 的"变化分"**（HSV 三通道加权差，在 64×36 网格上算，约 0.2ms）
- 只有"**画面突然换了一张**"或"**一直在动、攒够了量**"才留下来
- 留下来的几帧**拼进同一张图**，一张图的固定成本摊到 4~8 帧上

结果：同样一段 30 秒的操作，别人烧 30 张图，这里常常只要 2~3 张。
```

</details>

**依据 2 · 源码核查**：[src/index.js:1556-1566](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/index.js#L1556-L1566)

工具接入宿主注册。

<details>
<summary>查看原文（11行）</summary>

```text
  /**
   * 注册工具。**单独兜住"已经被别人注册过"**：装了两次（profile 的 bundles 里有一份、
   * 又在 patch 里插了一份）时这里会抛 `tool "see_now" is already registered`。
   * 以前这句会一路冒到 `apply()` 的兜底里，把整个插件判死 —— 连窗和循环都不起。
   * 现在只记一行，让已经注册的那一份继续工作。
   */
  try {
    disposers.push(ctx.tools.register(defineTool(toolObj)));
    // 注册成功要留一行：出问题时"加载失败"（有 plugin-error.log）和"装了两份、被去重"
    // 是两回事，没有这行只能靠猜。
    log(`已注册工具 ${TOOL_NAME}（v${VERSION}）`);
```

</details>

**依据 3 · 源码核查**：[src/pipeline.js:973-994](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/pipeline.js#L973-L994)

核对硬切、运动积分与静止兜底。

<details>
<summary>查看原文（22行）</summary>

```text
    if (entry.t - lastCut >= o.cutMinGap
      && !fgMotion
      && !futureFg
      && (mcCut || (s >= o.cutAbs && (spike || step)) || isolated)) {
      lastCut = entry.t;
      acc = 0;                      // 切点之后重新攒（那一帧的分属于跨刀，不算运动）
      keep(entry, 'cut');
      return;
    }

    acc += s;
    if (acc >= integralNeed() && entry.t - lastBound >= o.markMinGap) {
      // 只有**真的录进去**才清零。被去重挡掉时保留累积值 —— 否则这一段的运动量
      // 白攒了，下一个采样点要重新等一整轮（实测会让出帧间隔凭空翻倍）。
      if (keep(entry, 'mark')) acc = 0;
      return;
    }
    let floorSec = o.silentFloorSec;
    if (o.floorGapK > 0 && gapEwma > 0) {
      floorSec = Math.min(o.floorMax, Math.max(o.floorMin, o.floorGapK * gapEwma));
    }
    if (entry.t - lastBound >= floorSec) keep(entry, 'floor');
```

</details>

**依据 4 · 源码核查**：[src/pipeline.js:1013-1029](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/pipeline.js#L1013-L1029)

部分帧需要等待时间上更晚的候选。

<details>
<summary>查看原文（17行）</summary>

```text
      while (q.length >= 2) {
        const front = q[0];
        if (front.score === null) {
          decide(front, q[1].score, q[1].mc, null);
          q.shift();
          continue;
        }
        const needFuture = o.cutFutureDelay > 0
          && ((front.score >= o.cutFutureMinScore && !stillForeground(front))
            || lowAmbiguousFuture(front));
        const future = o.cutFutureDelay > 0
          ? q.find((e) => e !== front && e.t - front.t >= o.cutFutureDelay) ?? null
          : null;
        if (needFuture && !future) break;
        decide(front, q[1].score, q[1].mc, future);
        q.shift();
      }
```

</details>

**依据 5 · 源码核查**：[src/index.js:410-450](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/index.js#L410-L450)

保存 PNG 并给模型附件与图像时间范围。

<details>
<summary>查看原文（41行）</summary>

```text
async function attachAndReturn(ctx, sheets, extra = {}) {
  const svc = serviceOf(ctx, 'attachments');
  const list = (Array.isArray(sheets) ? sheets : [sheets]).filter(Boolean);
  if (!list.length) {
    return { text: '没有可交付的画面。', meta: { ok: false, ...extra, batch: 0 } };
  }
  if (!svc?.saveImage) {
    return { text: '拿到图了，但宿主没有 attachments 服务，交不上去。', meta: { ok: false, ...extra } };
  }
  const refs = [];
  for (const s of list) {
    refs.push(await svc.saveImage.call(svc, {
      data: s.png,
      mediaType: 'image/png',
      name: `see-now-${Date.now()}${list.length > 1 ? `-${refs.length + 1}` : ''}.png`,
    }));
  }
  // `say` 是给清单用的，不进 meta —— 那是整段话，塞进 meta 只会让返回值翻倍
  const { say: said, ...meta } = extra;
  // 图已经交给宿主了，顺手看要不要省略老的（异步、不阻塞、失败只记日志）
  try { afterDelivery?.(); } catch { /* 省略绝不能影响这一张图的交付 */ }
  const first = list[0];
  const last = list[list.length - 1];
  return {
    images: refs,
    text: list
      .map((s, i) => sheetText(s, { ...extra, order: list.length > 1 ? { i: i + 1, n: list.length } : null }))
      .join('\n\n'),
    meta: {
      ...meta,
      said: said ? String(said).slice(0, 200) : null,
      batch: list.length,
      sheets: list.map((s) => ({
        from: +s.from.toFixed(2), to: +s.to.toFixed(2), frames: s.frames.length, bytes: s.png.length,
      })),
      frames: list.reduce((n, s) => n + s.frames.length, 0),
      from: +first.from.toFixed(2),
      to: +last.to.toFixed(2),
      fill: +first.fill.toFixed(3),
      why: first.why,
      bytes: list.reduce((n, s) => n + s.png.length, 0),
```

</details>

#### 缺口

- 没有同片段模型与人工截图对照
  **影响**：无法估计变化覆盖与文字可读性
  **进一步探讨**：给配置切换录屏标注关键帧，比对模型是否能给出正确顺序

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Linux 的斜切修复是否真正进入采集数据路径？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

Linux 实时桌面入口在作者文档中依赖桌面 Portal、PipeWire、Python 绑定及 GStreamer。固定提交把 RGB 紧凑行长定义为 width×3，将 GStreamer 行长向上对齐四字节。以 798×450 为例，实际读每行 2396 字节而紧凑输出 2394 字节，整帧分别是 1,078,200 和 1,077,300 字节。直接按紧凑大小切输入会混入前一行尾填充，还会错切下一帧。

采集 worker 根据当轮宽高确定输入和输出帧长，按对齐后的大小从管道取一帧，逐行剥掉填充后用四字节大端长度头写出。已对齐时函数直接返回原字节。宿主 JavaScript 累积 stdout 字节并按长度头拆帧，而非依赖 stdout 分块边界。源码支持该管线的修复。作者在 Unreleased 记录一次 798 宽度的实机结果，当前 package.json 仍标 0.2.1，不能据此认定 npm 已带上修复，也不能推广到所有 Portal 后端和不同 stride。没有桌面会话或选屏授权时，文件输入仍是检验上层算法的可控办法。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:181-186](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/README.md#L181-L186)

作者列出各平台实时采集和 Linux Portal 依赖。

```text
| 平台 | 屏幕引擎 | 要额外做的 |
|---|---|---|
| Windows | `ddagrab`，不行退 `gdigrab`（自动探测） | 无 |
| macOS | `avfoundation` | 系统设置 → 隐私与安全性 → **屏幕录制**，勾上跑 DSH 的 App |
| Linux | **`portal`**：xdg-desktop-portal ScreenCast → PipeWire → gst | `python-gobject` + `gstreamer` + `gst-plugin-pipewire`；首次弹一次选屏框（之后用 restore_token） |

```

**依据 2 · 源码核查**：[src/portal_stream.py:195-214](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/portal_stream.py#L195-L214)

实际帧布局与剥填充逻辑。

<details>
<summary>查看原文（20行）</summary>

```text
def frame_layout(width: int, height: int):
    """gst RGB 帧的**行布局**：(紧凑行字节, 对齐后步长, 紧凑整帧, gst 实际整帧)。

    GStreamer 的 RGB 行按 4 字节对齐（`gst_video_info_align` 对 RGB 的默认对齐）：
    `width*3` 不是 4 的倍数时，每行尾部多出 1~3 字节 padding。
    798 宽 → 每行 2394 紧凑 / 2396 实际（整帧 1077300 vs 1078200），
    1050 → 3150/3152，1066（region 长边）→ 3198/3200；1260 与 1596 本来就是 4 的倍数。

    按紧凑大小切帧 = 每行错位 2 字节、逐行累积 —— 画面是**斜切**的，不是旋转。
    """
    row_bytes = width * 3
    stride = (row_bytes + 3) & ~3
    return row_bytes, stride, row_bytes * height, stride * height


def strip_padding(raw: bytes, row_bytes: int, stride: int, height: int) -> bytes:
    """把 gst 的 padded 整帧剥成紧凑 RGB（`stride == row_bytes` 时原样返回）。"""
    if stride == row_bytes:
        return raw
    return b"".join(raw[y * stride:y * stride + row_bytes] for y in range(height))
```

</details>

**依据 3 · 源码核查**：[src/portal_stream.py:449-463](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/portal_stream.py#L449-L463)

按当前设置创建对应 gst 进程和尺寸。

<details>
<summary>查看原文（15行）</summary>

```text
            p_now = dict(params)
            CTRL["restart"] = False
        width, height = int(p_now["width"]), int(p_now["height"])
        # gst 的 RGB 行按 4 字节对齐：width*3 不是 4 的倍数时，每行尾部会多出
        # padding（实测 798→每行多 2 字节，整帧 1078200 而不是 1077300）。
        # 按紧凑大小切帧会让每一行错位累积 —— 画面是**斜切**的，不是旋转。
        # 所以：从 gst 按 stride 读，**剥掉 padding** 再按紧凑大小写给宿主。
        row_bytes, stride, frame_bytes, frame_raw = frame_layout(width, height)
        pipeline = build_pipeline(p_now)
        log(f"[gst] {pipeline}")
        gst = subprocess.Popen(
            ["gst-launch-1.0", "-q"] + pipeline.split(),
            stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            **(dict(pass_fds=(pw_fd,)) if pw_fd is not None else {}),
        )
```

</details>

**依据 4 · 源码核查**：[src/portal_stream.py:493-507](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/portal_stream.py#L493-L507)

worker 实际按对齐帧切分并封装紧凑输出。

<details>
<summary>查看原文（15行）</summary>

```text
            chunk = os.read(gst.stdout.fileno(), 1 << 16)
            if not chunk:
                break
            pending += chunk
            # **整帧写出**，并且每帧带 4 字节长度头。
            # 长度头是给"尺寸会变"用的：换清晰度/region 时帧长变了，宿主靠它切帧，
            # 不需要再去追"我上次告诉它多大的"这种状态（异步管道里对齐不可靠）。
            try:
                while len(pending) >= frame_raw:
                    raw = pending[:frame_raw]
                    pending = pending[frame_raw:]
                    frame = strip_padding(raw, row_bytes, stride, height)
                    out.write(struct.pack(">I", frame_bytes))
                    out.write(frame)
                out.flush()
```

</details>

**依据 5 · 源码核查**：[src/portal-capture.js:198-209](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/portal-capture.js#L198-L209)

JavaScript 宿主按大端长度头读取分块流。

<details>
<summary>查看原文（12行）</summary>

```text
      let buf = Buffer.alloc(0);
      c.stdout.on('data', (chunk) => {
        buf = buf.length ? Buffer.concat([buf, chunk]) : chunk;
        let off = 0;
        while (buf.length - off >= 4) {
          const len = buf.readUInt32BE(off);
          if (len <= 0 || buf.length - off - 4 < len) break;
          // 复制一份：subarray 会让整块 chunk 一直活着
          deliver(Buffer.from(buf.subarray(off + 4, off + 4 + len)));
          off += 4 + len;
        }
        if (off) buf = Buffer.from(buf.subarray(off));
```

</details>

**依据 6 · 作者声明**：[CHANGELOG.md:3-18](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/CHANGELOG.md#L3-L18)

斜切修复列为 Unreleased，作者报告 798 复测。

<details>
<summary>查看原文（16行）</summary>

```text
## [Unreleased]

### Fixed — Linux 抓屏在 798 / 1050 这类宽度下画面是「斜切」的

GStreamer 的 RGB 行按 **4 字节对齐**：`width*3` 不是 4 的倍数时，每行尾部会多出 padding。
实测 798 → 每行多 2 字节（整帧 1078200 而不是 1077300）；而 `portal_stream.py` 一直按
`width*height*3` 切帧，于是每行错位 2 字节逐行累积 —— 画面**斜切**（不是旋转，所以按任意角度
都对不齐），看动态游戏截图最明显。

- 改成：从 gst 按 `stride` 读，**逐行剥掉 padding** 再按紧凑大小写给宿主（热点路径不变，
  只有 `stride != width*3` 时才多一次行拼接）；
- 受影响的是 `low 798×450` / `standard 1050×600`（以及 region 的 1066 长边）；
  `high 1260` / `ultra 1596` 的 `width*3` 本来就是 4 的倍数，没出过问题；
- 修完 798 抓帧实测：字节数 = 1077300，画面正了（旧代码同一时刻是斜的）。

## [0.2.1] - 2026-11-08
```

</details>

**依据 7 · 源码核查**：[package.json:1-12](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/package.json#L1-L12)

包清单版本仍为 0.2.1。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "dsh-see-now",
  "version": "0.2.1",
  "description": "Let DSH watch a live screen or camera feed: score every frame by how much the picture changed, keep only the ones that matter, and pack them into one image. · 让 AI 实时看见你的屏幕，只传「画面变了」的那几帧。",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek",
    "screen-capture",
    "vision",
    "llm",
    "ffmpeg",
```

</details>

#### 缺口

- 没有当前 npm 产物及多桌面组合的独立验证
  **影响**：不能确定安装包的实际行为
  **进一步探讨**：比较 npm tarball 中 worker 与固定提交，并对 798、1050、1260 三档测像素和长度

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 关闭之后能阻止哪些后续动作，已交付画面或音频如何处理？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

常驻循环持有一个会话标识，切换会话会停止旧循环。关窗导致挂断后，无显式来源的 watch 会被拒，普通 stop 则只停止采集和循环，后续 watch 可以再次启动。显式来源由工具参数是否有 kind 判断，之后直接清除挂断状态，因此这个分支区分显式和隐式动作，却没有在该分支核对新的用户确认回执。斜杠命令可经宿主启动采集并绑定发命令的会话，缺 invocation.agent 时宿主接线仍有最近会话兜底。不能只凭界面关了推定远程或模型发起的显式调用一律被禁止。

已经保存的图以附件引用返回。停采集不回滚这次保存。插件的 image/offload 路径追加历史事件让较早图片不再进入后续请求，磁盘文件何时清理由宿主附件生命周期决定。音频停止路径合并内存和 pid 文件记录，Windows 检查映像名含 python 后尝试按树终止；这比仅 kill launcher 更贴合子进程布局，但映像名不是身份绑定，终止失败也需要检查。首次投入包括平台权限、源选择和视觉模型；持续成本包括画面编码、可能重复发送上下文和人工确认；失败恢复须检查采集进程、附件引用与真实账单。应按成功解释一次操作的任务核算，而不是用每张图的估算代替费用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:924-953](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/index.js#L924-L953)

按会话切换循环并在关窗时挂断。

<details>
<summary>查看原文（30行）</summary>

```text
    const sid = owner ?? lastSessionId;
    // 模式和节奏都影响唤醒间隔，任一个变了都得重建循环
    const key = sceneMode ? 'scene' : paceMode;
    if (loop && !loop.stopped() && loop.state().session === sid && loopScene === key) return loop;
    if (loop) stopLoop(loop.state().session ? '换会话' : '重建');
    loopScene = key;
    loop = startLoop({
      ctx,
      sessionId: sid,
      getSessionId: () => lastSessionId,
      runner,
      log,
      scene: sceneMode,
      // 逐帧模式出图最密，4 秒是"一句短话念得完"的下限；
      // 常规按节奏走（normal 15 秒 / calm 30 秒）—— 8 秒一次太吵，实报过。
      wakeMinGapSec: sceneMode ? 4 : PACES[paceMode].wakeGapSec,
      // 收工线（叫醒次数上限 / 空闲分钟）可由 ~/.dsh/see-now.json 覆盖
      tuning,
      onStop: (reason) => {
        if (reason === 'window-closed') {
          // 用户关窗 = 不看了。**落进待领说明**，下一次工具结果带走。
          // 不能写 chat.jsonl：窗已经关了，那条流没人看，模型也拿不到 ——
          // 实测会连写两条，而模型还在说"我还在看"。
          try { runner.note(HANGUP_NOTE); } catch { /* 记不住也要停 */ }
          // **必须用 hangUp 而不是 stop**：stop 只是停采集，下一条 watch 会立刻
          // 重启并把窗重新开起来 —— 用户体感是"关掉又弹出来，只能卸载插件"。
          try { runner.hangUp(); } catch { /* 已经停了 */ }
          return;
        }
        try { runner.stop(); } catch { /* 已经停了 */ }
```

</details>

**依据 2 · 源码核查**：[src/runner.js:1048-1057](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/runner.js#L1048-L1057)

隐式 watch 受阻，显式来源会清除挂断。

<details>
<summary>查看原文（10行）</summary>

```text
      const blocked = guardReason({
        hungUp, fileEnded: Boolean(endedSource) && !running, explicitSrc,
      });
      if (blocked === 'hung-up') return { ok: false, reason: 'hung-up', waited: 0 };
      if (blocked === 'file-ended') {
        return { ok: false, reason: 'file-ended', waited: 0, path: endedSource?.path };
      }
      if (explicitSrc) { hungUp = false; endedSource = null; }

      if (busy) return { ok: false, reason: 'busy', waited: 0 };
```

</details>

**依据 3 · 源码核查**：[src/command.js:74-110](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/command.js#L74-L110)

显式用户命令启动、绑定与关闭。

<details>
<summary>查看原文（37行）</summary>

```text
  async function open(onAgent) {
    const win = await deps.openWindow?.({ log });
    if (win && win.ok === false && win.reason !== 'disabled') {
      return { kind: 'error', text: `悬浮窗没开起来：${win.reason ?? '原因未知'}` };
    }
    // 窗可能上次被"最小化到托盘"了（配置里 hidden:true）。开命令的语义是"我要看见它"。
    try { deps.setWindowHidden?.(false); } catch { /* 写不进配置也不影响这一次 */ }

    let started = null;
    try { started = await deps.startCapture?.(); } catch (e) { started = { error: String(e?.message ?? e) }; }
    if (started?.error) {
      return { kind: 'error', text: `采集没起来：${started.error}` };
    }

    const owner = sessionOfAgent(onAgent) ?? caller();
    let loop = null;
    try { loop = deps.ensureLoop?.(owner) ?? null; } catch (e) { loop = null; log(`/seenow 起循环失败：${e?.message ?? e}`); }

    // 让模型知道"眼睛开了"。**必须是 steer**：它可能正在跑别的活，排队要等到这一轮结束。
    const said = deliverToAgent(onAgent, START_NOTE);

    const bits = [
      '悬浮窗已打开，开始看屏幕。',
      started?.already ? '（采集本来就在跑）' : '',
      loop ? '循环已绑到本会话。' : '⚠️ 循环没起来（看 `see_now({action:"status"})` 的诊断）。',
      said?.ok ? '' : `⚠️ 没能叫醒本会话（${said?.reason ?? '未知'}）。`,
    ].filter(Boolean);
    return { kind: 'success', text: bits.join('') };
  }

  function off(onAgent) {
    try { deps.stopLoop?.('/seenow off'); } catch { /* 没在跑 */ }
    try { deps.stopCapture?.(); } catch { /* 没在跑 */ }
    try { deps.closeWindow?.(); } catch { /* 已经关了 */ }
    const said = deliverToAgent(onAgent, STOP_NOTE);
    return {
      kind: 'success',
```

</details>

**依据 4 · 源码核查**：[src/index.js:1590-1605](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/index.js#L1590-L1605)

命令服务接线与缺当前会话时的兜底。

<details>
<summary>查看原文（16行）</summary>

```text
    const disposeCmd = registerSeenowCommand(ctx, {
      log,
      openWindow: (o) => openWindow({ ...o, log }),
      closeWindow: () => closeWindow(),
      setWindowHidden: (hidden) => setWindowHidden(hidden, { log }),
      startCapture: async () => {
        const built = srcOf({});
        if (built.error) return { error: built.error };
        return runner.start({ src: built.src ?? { kind: 'screen' } });
      },
      stopCapture: () => { try { runner.stop(); } catch { /* 没在跑 */ } },
      ensureLoop: (owner) => ensureLoop(owner ?? null),
      // `invocation.agent` 拿不到时的兜底：命令至少还能绑到"最近一次发起调用的会话"
      getCaller: () => lastCallerSessionId ?? lastSessionId,
      getLoop: () => loop,
      stopLoop: (reason) => stopLoop(reason),
```

</details>

**依据 5 · 源码核查**：[src/index.js:1336-1340](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/index.js#L1336-L1340)

普通 stop 的执行边界。

```text
      if (action === 'stop') {
        stopLoop('手动 stop');
        runner.stop();
        return { text: '停了。窗口还开着，想再看得重新调 watch。', meta: { ok: true } };
      }
```

**依据 6 · 源码核查**：[src/index.js:419-435](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/index.js#L419-L435)

先保存附件再返回引用。

<details>
<summary>查看原文（17行）</summary>

```text
  const refs = [];
  for (const s of list) {
    refs.push(await svc.saveImage.call(svc, {
      data: s.png,
      mediaType: 'image/png',
      name: `see-now-${Date.now()}${list.length > 1 ? `-${refs.length + 1}` : ''}.png`,
    }));
  }
  // `say` 是给清单用的，不进 meta —— 那是整段话，塞进 meta 只会让返回值翻倍
  const { say: said, ...meta } = extra;
  // 图已经交给宿主了，顺手看要不要省略老的（异步、不阻塞、失败只记日志）
  try { afterDelivery?.(); } catch { /* 省略绝不能影响这一张图的交付 */ }
  const first = list[0];
  const last = list[list.length - 1];
  return {
    images: refs,
    text: list
```

</details>

**依据 7 · 源码核查**：[src/offload.js:2-12](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/offload.js#L2-L12)

历史卸载只替换后续上下文。

<details>
<summary>查看原文（11行）</summary>

```text
 * offload.js — 把会话历史里较早的图"省略"掉，让它们不再被发出去。
 *
 * ## 为什么需要它
 *
 * 一张图进了会话历史就跟着每一轮请求走，直到会话结束。宿主不会回收它 ——
 * **但宿主有一个正规机制叫 `image/offload`**：往会话日志里追加一条事件，
 * 声明"这几张图以后换成一段占位文本"，之后 `projectOffloadedImages` 会把它们
 * 替换成 `offloadedImageText`，图就不再进请求、也不会被读盘。
 *
 * 于是图文件可以安全删掉（磁盘下来），会话还能继续聊（占位文本顶上）。
 *
```

</details>

**依据 8 · 源码核查**：[src/offload.js:194-204](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/offload.js#L194-L204)

实际追加 image/offload 事件。

<details>
<summary>查看原文（11行）</summary>

```text
 */
export async function applyOffload(session, targets, sessions = null) {
  if (!session?.append) return { ok: false, reason: 'no-session' };
  if (!Array.isArray(targets) || targets.length === 0) return { ok: true, reason: 'nothing-to-do' };
  try {
    session.append('image/offload', { targets });
  } catch (e) {
    return { ok: false, reason: String(e?.message ?? e).slice(0, 200) };
  }
  try {
    if (sessions?.flush) await sessions.flush(session);
```

</details>

**依据 9 · 源码核查**：[src/listen.js:604-617](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/listen.js#L604-L617)

按平台终止进程，Windows 先检查映像名。

<details>
<summary>查看原文（14行）</summary>

```text
export function killListenTree(pid, {
  platform = process.platform, run = defaultRun, kill = process.kill,
} = {}) {
  const id = Number(pid);
  if (!Number.isInteger(id) || id <= 0) return 'gone';
  if (platform !== 'win32') {
    // POSIX：listen.py 是直接子进程，SIGTERM 就够（它自己接了这个信号收尾）
    try { kill(id, 'SIGTERM'); return 'killed'; } catch { return 'gone'; }
  }
  const list = run('tasklist', ['/FI', `PID eq ${id}`, '/FO', 'CSV', '/NH']);
  const image = String(list?.stdout ?? '').toLowerCase();
  if (!image.includes('python')) return 'skipped';
  const out = run('taskkill', ['/PID', String(id), '/T', '/F']);
  return out?.status === 0 ? 'killed' : 'skipped';
```

</details>

**依据 10 · 源码核查**：[src/listen.js:1173-1187](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/listen.js#L1173-L1187)

并合内存和 pid 文件记录，清理本地状态。

<details>
<summary>查看原文（15行）</summary>

```text
    const pidPath = join(audioDir, PID_FILE);
    const pids = new Set();
    if (child?.pid) pids.add(Number(child.pid));
    const fromFile = readListenPid(pidPath);
    if (fromFile) pids.add(fromFile);
    for (const pid of pids) {
      const how = killListenTree(pid);
      if (how === 'killed') log(`[listen] 已结束采集进程 ${pid}`);
      else if (how === 'skipped') log(`[listen] pid ${pid} 看着不是 python，没杀（可能已被复用）`);
    }
    child = null;
    try { unlinkSync(pidPath); } catch { /* 本来就没有 */ }
    enabled = false;
    backendSource = null;
    reason = why || '停了';
```

</details>

#### 缺口

- 没有用户关闭后对异常音频子进程或外部模型存储的验收
  **影响**：无法保证媒体都立即释放或已提交内容失效
  **进一步探讨**：在隔离会话测试显式重开、采集子进程和附件 GC，确认外部模型的数据边界

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样进行可退出的试用，并验证短暂局部变化是否被遗漏？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合试用的是能选用视觉模型、只处理无敏感录屏的开发者。先明确要模型识别的 2 至 3 个时点，用显式文件源在单独会话播放。核对返回附件是否能读到关键文字、解释状态先后，并核对回放结束后隐式 watch 不会循环重播。若附件少了关键时点、文字过小，或源和会话归属不明，就停止，回到用户筛过的原尺寸截图。屏幕和音频直播另需确认选择范围、实际关停和留存。

一种未验证改进是为用户选定的小区域保留独立变化额度，避免全局变化小但关键按钮已改变时被过滤。它与现有直接裁剪整张图的选项不同，目标是在保留全局上下文时多留关键局部变化。用带短暂角标、小字和大面积滚动的录屏，固定输出图数和视觉模型，比较定时采样、当前方法和区域加权。记录关键时点召回、可读性、延迟及实际模型消耗。若区域加权未改善合格解释，或挤掉关键全局转折、增加延迟和费用抵消收益，则假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/pipeline.js:983-994](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/pipeline.js#L983-L994)

现有累计变化及兜底条件是对照基础。

<details>
<summary>查看原文（12行）</summary>

```text
    acc += s;
    if (acc >= integralNeed() && entry.t - lastBound >= o.markMinGap) {
      // 只有**真的录进去**才清零。被去重挡掉时保留累积值 —— 否则这一段的运动量
      // 白攒了，下一个采样点要重新等一整轮（实测会让出帧间隔凭空翻倍）。
      if (keep(entry, 'mark')) acc = 0;
      return;
    }
    let floorSec = o.silentFloorSec;
    if (o.floorGapK > 0 && gapEwma > 0) {
      floorSec = Math.min(o.floorMax, Math.max(o.floorMin, o.floorGapK * gapEwma));
    }
    if (entry.t - lastBound >= floorSec) keep(entry, 'floor');
```

</details>

**依据 2 · 源码核查**：[src/index.js:1112-1139](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/index.js#L1112-L1139)

当前区域路径是采集范围限制。

<details>
<summary>查看原文（28行）</summary>

```text
        const rawRegion = typeof args.region === 'string' ? args.region.trim() : '';
        const regionOff = /^(off|none|clear)$/i.test(rawRegion);
        const built = srcOf(regionOff ? { ...args, region: undefined } : args);
        if (built.error) return { text: built.error, meta: { ok: false, reason: 'bad-region' } };
        const src = built.src;
        const stickyRegion = regionOff ? null : (rawRegion ? undefined : loadRegion());
        if (regionOff) {
          clearRegion();
        } else if (rawRegion) {
          // 显式传的 region 也要落盘，否则下一轮 watch 不带 region 就回到整屏
          const parsed = parseRegion(rawRegion);
          if (parsed) {
            try { saveRegion(parsed); } catch { /* 写不了盘不影响这一次 */ }
          }
        }
        // 变了一次说一次：模型要知道自己现在只看这一块，也得知道已经回到整屏
        const regionKey = regionText(stickyRegion ?? src?.region ?? null);
        if (regionKey !== lastRegionKey) {
          lastRegionKey = regionKey;
          pendingModeNote = [
            regionKey
              ? `现在只抓屏幕上的 **${regionKey}** 这一块`
                + `${process.platform === 'linux' ? '（采集流坐标）' : '（屏幕物理像素）'}`
                + '—— 画面之外的东西你看不到，'
                + '也不要假设整屏发生过什么。'
              : '已经回到**整屏**，不再只抓那一块。',
            pendingModeNote,
          ].filter(Boolean).join('\n\n');
```

</details>

**依据 3 · 源码核查**：[src/index.js:1205-1213](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/index.js#L1205-L1213)

文件结束会要求再次显式传源。

```text
          }
          // 文件回放放完了：不能自动从头重播，必须显式再传一次来源。
          if (r.reason === 'file-ended') {
            return {
              text: `这个文件已经放完了（${r.path ?? ''}）。\n`
                + '**不会自动重播**。要再看一遍就显式传 `source:"file"` + `path`，'
                + '要接着看屏幕就传 `source:"screen"`。',
              meta: { ok: false, reason: 'file-ended', path: r.path ?? null },
            };
```

**依据 4 · 源码核查**：[src/index.js:442-450](https://github.com/SAOS-3624/dsh-see-now/blob/8b8e6c6daff5eea44925de55f565d101cee8f684/src/index.js#L442-L450)

输出可测量帧、时间、字节与质量。

```text
      sheets: list.map((s) => ({
        from: +s.from.toFixed(2), to: +s.to.toFixed(2), frames: s.frames.length, bytes: s.png.length,
      })),
      frames: list.reduce((n, s) => n + s.frames.length, 0),
      from: +first.from.toFixed(2),
      to: +last.to.toFixed(2),
      fill: +first.fill.toFixed(3),
      why: first.why,
      bytes: list.reduce((n, s) => n + s.png.length, 0),
```

#### 缺口

- 没有相同条件下的结果、延迟及模型收费数据
  **影响**：不能量化收益与回退成本
  **进一步探讨**：保留分段标注和不同取样结果，盲评任务是否合格并查实际用量

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
