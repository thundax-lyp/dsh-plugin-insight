# See Now

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[0b4bd11](https://github.com/SAOS-3624/dsh-see-now/tree/0b4bd110074b3e2cd043da8b078f7272589d50b0)

<!-- BEGIN META -->
[![GitHub ★ 663](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=663&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SAOS-3624/dsh-see-now) [![npm 30d 25,075](https://img.shields.io/static/v1?label=npm+30d&message=25%2C075&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-see-now) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-see-now)
<!-- END META -->

> **功能**：在 DSH 中从屏幕、摄像头或视频文件筛选变化帧，拼图后交给视觉模型。

> **亮点**：[Q01](#research-q01) 用少量带时间范围的 PNG 附件保留多个变化时点。[Q02](#research-q02) Linux 采集路径按 RGB 行步长解码后保留稳定的宿主帧协议。

> **主要限制**：零裁切预算不阻止降采样、队列淘汰或选帧漏检；本地回放的路径门槛也不是文件系统访问域。须按已知事件核对结果。[Q01](#research-q01) [Q02](#research-q02)

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

> **思考**：零裁切预算不阻止降采样、队列淘汰或选帧漏检；本地回放的路径门槛也不是文件系统访问域。须按已知事件核对结果。[Q01](#research-q01) [Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 用少量带时间范围的 PNG 附件保留多个变化时点。[Q02](#research-q02) Linux 采集路径按 RGB 行步长解码后保留稳定的宿主帧协议。

采集 worker 与宿主使用长度前缀，避免 stdout 分块影响边界。工具区分文件结束、取消和无变化。进程终止与图像留存分别检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

零裁切预算不阻止降采样、队列淘汰或选帧漏检；本地回放的路径门槛也不是文件系统访问域。须按已知事件核对结果。[Q01](#research-q01) [Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 单独会话先试无敏感短视频。出现关键变化遗漏、字太小或数据归属不明时，结束试用并换用户手工选择的截图。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

工具、选帧、附件、Linux 行对齐及停止路径获源码支持。作者报告的 798 宽度实测未复现，当前包是否包含未发布修复待核实。区域采样为待验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.js、src/pipeline.js、src/portal-capture.js、CHANGELOG.md、package.json、src/runner.js、src/command.js、src/offload.js、src/listen.js、src/settings-api.mjs、src/settings-trust.js、src/sheet.js、src/pack.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定代码、作者资料和代表性机制。本轮未启动插件、录屏、音频、Portal 或外部模型。 本轮当前版本复核：8b8e6c6d..0b4bd110（固定提交 0b4bd110074b3e2cd043da8b078f7272589d50b0）；比较目标组件差异并补充其影响。
- 下一步：按宽度档位对照实际字节、像素和图像内容。用标注的短视频对照局部变化、合格答案与账单，另在隔离环境检查关停和附件清理。 当前源码固定于 0b4bd110074b3e2cd043da8b078f7272589d50b0；未运行插件或做生产验证。

**分析版本**

- **仓库**：[SAOS-3624/dsh-see-now](https://github.com/SAOS-3624/dsh-see-now)
- **版本号**：0.2.3（[固定提交 0b4bd11](https://github.com/SAOS-3624/dsh-see-now/tree/0b4bd110074b3e2cd043da8b078f7272589d50b0)）
- **版本日期**：2026-11-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 独立给用户指定的小区域保留变化采样额度，可能在同图预算下保留短暂界面事件。

按宽度档位对照实际字节、像素和图像内容。用标注的短视频对照局部变化、合格答案与账单，另在隔离环境检查关停和附件清理。 当前源码固定于 0b4bd110074b3e2cd043da8b078f7272589d50b0；未运行插件或做生产验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 2948 | — | — | 41522 |
| .mjs | source | 16 | 2004 | 1431 | 389 | — |
| .js | source | 34 | 14162 | 8258 | 5266 | — |
| .mjs | example | 1 | 110 | 61 | 43 | — |
| .mjs | test | 65 | 9108 | 6965 | 1136 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/SAOS-3624/dsh-see-now/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 36](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=36&color=737b86&logo=github)](https://github.com/SAOS-3624/dsh-see-now/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z) [![近30天关闭 35](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=35&color=737b86&logo=github)](https://github.com/SAOS-3624/dsh-see-now/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)



统计日期：2026-11-16。

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

拼图将选中帧按档位打包。默认裁切预算为零；候选与重建几何均将 stretch 限制为 c/(1-c) 计算出的预算。缩去底部整条空白画布只平移格坐标，不改变格宽高；随后按格 cover 缩放。输出同时保存相对秒、墙钟窗、帧来源与格坐标供回查。队列满会丢最旧拼图。因此默认不裁格内图像不代表完整保留每个画面，也不能从输出格子数推断检测覆盖。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:47-62](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/README.md#L47-L62)

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

**依据 2 · 源码核查**：[src/index.js:1556-1566](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/index.js#L1556-L1566)

工具接入宿主注册。

<details>
<summary>查看原文（11行）</summary>

```text
              : '')
            // 预留：**"叫醒了却没图"这两个数一起看** —— `pending 空 + 预留有` 是正常的
            // （图已经叫醒、等人来 peek）；两个都空而模型说没图，才是真的空手
            + `${s.reserved ? ` · 预留 1 张（${s.reserved.ageSec}s 前叫醒的，等 peek 取）` : ''}`
            + `${s.takes?.peekEmpty ? ` · peek 空过 ${s.takes.peekEmpty}/${s.takes.peek} 次` : ''}`
            // 窗口：**"它在看但我什么都没看到"时第一个要看的就是这一行**
            + `\n${windowLine()}`
            + (s.window?.ok === false && s.window?.reason ? `\n  ↳ 开窗失败：${s.window.reason}` : '')
            // 指示框：用户屏幕上的"有人在看"。采集时被裁掉，所以模型看到的结果里没有它
            + (s.indicator?.running
              ? `\n指示框：在（逻辑 ${s.indicator.logicalWidth}×${s.indicator.logicalHeight}；`
```

</details>

**依据 3 · 源码核查**：[src/pipeline.js:973-994](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/pipeline.js#L973-L994)

核对硬切、运动积分与静止兜底。

<details>
<summary>查看原文（22行）</summary>

```text
    const px = entry.prev ?? 0;
    const nx = nextScore ?? 0;
    const base = Math.max(1, px, nx);
    const mcOkForSpike = o.cutMcAbs <= 0 || o.cutSpikeMcAbs <= 0
      || (entry.mc ?? 0) >= o.cutSpikeMcAbs;
    const spike = nextScore === null
      || (s > o.cutSpike * base && s >= o.cutSpikeAbs && mcOkForSpike);
    // 运动中的切机位：前后都在动时 spike 的 2.5 倍凑不出来，改用“台阶”
    const jump = s - base;
    const step = o.cutJumpAbs > 0
      && s >= o.cutAbs
      && s >= o.cutJumpAbs
      && jump >= o.cutJumpMargin
      && s >= o.cutJumpRatio * base;
    // 运动补偿：整屏在动但邻域里找得到对应 → 运镜；找不到对应 → 换镜头。
    // 半径 4 的 mc 比“绝对台阶”更直接：真实运动切机位 abs 只有 23 也能过。
    const mc = entry.mc ?? 0;
    const mcBox = entry.mcBox ?? 0;
    const mcFill = entry.mcFill ?? 0;
    const mcCut = o.cutMcAbs > 0
      && s >= o.cutMcMinScore
      && mc >= o.cutMcAbs;
```

</details>

**依据 4 · 源码核查**：[src/pipeline.js:1013-1029](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/pipeline.js#L1013-L1029)

部分帧需要等待时间上更晚的候选。

<details>
<summary>查看原文（17行）</summary>

```text
      && bg !== null
      && bg > 0
      && bg < o.cutBgAbs
      && (o.cutBgMaxChanged <= 0 || (entry.bgChanged ?? 0) <= o.cutBgMaxChanged)
      && guardY >= 0.25
      && (o.cutBgMaxSpanY <= 0
        || (guardY > 0
          ? (entry.mcSpanY ?? 1) / guardY
          : (entry.mcSpanY ?? 1)) < o.cutBgMaxSpanY);
    // 高分候选不能只靠当前帧：等 0.5 秒，看候选帧改掉的稳定背景有没有回来。
    // 大面积前景运动离开/移开 -> keep 低；真正换镜头 -> 新场景还在，keep 高。
    let futureFg = false;
    const lowFuture = lowAmbiguousFuture(entry);
    if (o.cutFutureDelay > 0
      && entry.futureModel
      && (s >= o.cutFutureMinScore || lowFuture)) {
      const fk = future && future.hsv
```

</details>

**依据 5 · 源码核查**：[src/index.js:410-450](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/index.js#L410-L450)

保存 PNG 并给模型附件与图像时间范围。

<details>
<summary>查看原文（41行）</summary>

```text
    : why === 'timeout' ? '等满了先给你'
      : why === 'time' ? '攒到这个点先给你'
        : why === 'full' ? '这张装满了'
          : why === 'first' ? '刚打开，先给你此刻'
            : why === 'oneshot' ? '换了清晰度，先给你此刻'
              : '流结束';
  const ask = userText
    ? `\n${interjectNote(userText, { at: Date.now() })}`
    : '';
  // 常驻模式要**明说**，否则模型会以为"还得我自己再调一次"，或者以为"看一眼就完事了"
  const loopNote = looping
    ? '\n**已经进入常驻模式**：下一张攒够我会再叫你，不用你现在就调下一次。'
      + '你现在只要做一件事 —— 值得说就用 `say` 说一句，不值得说就别出声。'
      + '用户关掉悬浮窗我就停。'
    : '';
  return `${head}\n${lines.join('\n')}${linesText(sheet)}${changeText(sheet.changes)}${ask}${lastSaidNote()}${loopNote}\n（${whyText}；想看下一段就再调一次 \`see_now({action:"watch"})\`。）${replyReminder({ answered: Boolean(say) })}`;
}

/**
 * 提交成宿主附件，并组装工具返回值。
 *
 * **`saveImage` 必须 `.call(svc, …)`**：它内部读 `this.compression`，方法取下来裸调会丢 this，
 * 报 `Cannot read properties of undefined (reading 'compression')` —— 所有出图工具一起挂。
 */
/**
 * 把一张**或多张**图交给宿主，拼成一次工具结果。
 *
 * 超省模式（`wakeBatch > 1`）下一次要交好几张 —— 分成几次交就等于没攒：
 * 模型每轮都要把整个上下文重过一遍，省下来的钱全在这条上。
 *
 * `meta` 里单张的字段（`frames` / `from` / `to` / `fill` / `why` / `bytes`）保持不变，
 * 单张时语义完全一样；多张时 `frames` / `bytes` 是合计，`from` / `to` 是首尾，
 * 逐张的区间放进 `sheets[]`。`batch` 说明这次交了几张。
 *
 * `sessionId` 是这批图交给的会话，只用来告诉自动省略该看哪一份历史；
 * 不放进 `extra` —— `extra` 会原样进 `meta`。
 */
async function attachAndReturn(ctx, sheets, extra = {}, { sessionId = null } = {}) {
  const svc = serviceOf(ctx, 'attachments');
  const list = (Array.isArray(sheets) ? sheets : [sheets]).filter(Boolean);
  if (!list.length) {
```

</details>

**依据 6 · 源码核查**：[src/pack.js:60-75](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/pack.js#L60-L75)

硬裁切预算与伸缩比例。

<details>
<summary>查看原文（16行）</summary>

```text
 *
 * 一格的裁剪比例和拉伸系数是一一对应的：格子被拉高 `s` 倍，cover 就裁掉 `1 − 1/(1+s)`。
 * 所以"最多裁 c"⇔"最多拉 c/(1−c)"。0.1 → 0.111，0.3 → 0.429。
 */
export function stretchForCrop(crop) {
  const c = Math.max(0, Math.min(0.9, Math.max(Number(crop?.cropX) || 0, Number(crop?.cropY) || 0)));
  return c / (1 - c);
}

/**
 * **crop 是硬上限**：不管调用方传多大的 stretch，实际拉伸都不许超过预算。
 * 反过来 `crop = 0` 时结果恒为 0（一格不裁），这就是默认行为。
 */
export function effectiveStretch(stretch, crop = DEFAULT_CROP) {
  return Math.max(0, Math.min(Number(stretch) || 0, stretchForCrop(crop)));
}
```

</details>

**依据 7 · 源码核查**：[src/pack.js:187-199](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/pack.js#L187-L199)

重建几何使用同一预算。

<details>
<summary>查看原文（13行）</summary>

```text
 *            cells:Array<{x:number,y:number,w:number,h:number,t:number,f:number,bin:number}>}}
 *          x/y/w/h 是归一化坐标（0..1，y 相对本张），t=档位，f=实际缩放系数
 */
export function solve(tiers, {
  grow = DEFAULT_GROW, mu = 1, stretch = DEFAULT_STRETCH, binCost = 1.02, fillRows = true,
  crop = DEFAULT_CROP,
} = {}) {
  const n = tiers.length;
  if (!n) return { bins: 0, fill: 0, cells: [], area: 0 };
  // **重建几何必须和生成候选用同一个 stretch**：候选按预算夹过，这里没夹就会
  // 造出"DP 以为是 10%、实际裁了 30%"的图（真踩过）。
  const st = effectiveStretch(stretch, crop);
  const ropt = precompute(tiers, grow, st, fillRows, crop);
```

</details>

**依据 8 · 源码核查**：[src/pipeline.js:817-865](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/pipeline.js#L817-L865)

缩画布、渲染格子、队列淘汰及帧和格坐标。

<details>
<summary>查看原文（49行）</summary>

```text
    const kept = p.cells.filter((c) => c.bin === 0);
    const used = batch.slice(0, kept.length);
    if (used.length < batch.length) stats.overflow += 1;
    // **整条空着的带子不发**：排布是按档位走的，帧少时下面会空出半幅灰条，
    // 而灰条照样算进 token（图按画布尺寸计费）。这里只缩画布 + 平移坐标，
    // 格子的 `pw/ph` 一个都不动 —— 裁的是画布，不是画面。
    const crop = lay(toRects(kept, { width, height, gutter: 0 }), width, height);
    const rects = crop.rects;
    /**
     * 帧直接以 `{src, sw, sh}` 交给 `composePacked`：它内部用 `coverIntoAt`
     * 把每一帧缩进画布的对应格子。
     *
     * 旧链路是「每格 alloc 中间缓冲 → coverInto → blit 到画布」，等于每格多做
     * 一次 267KB 的分配和一次同样大小的拷贝；4 格图纯搬运就是 1MB。现在零中间缓冲。
     */
    const cells = used.map((f) => ({ src: f.buf, sw: width, sh: height }));
    const stripH = stripHeightFor();
    const img = composePacked({
      frames: cells, rects, width: crop.width, height: crop.height, burn: 'index', stripH,
    });
    // 音轨条：响度 + 切点刻度。**画布已经预留好高度**，这里是就地填底部，
    // 不再额外分配 + 拷贝一整张图（省 1.1MB/张）。
    if (stripH) drawAudioStrip(img.buffer, img.width, img.height, crop.height, audioOf(used[0], used[used.length - 1]));
    const png = encodePng(img.buffer, img.width, img.height, { level: 3 });
    // 占用率按**这张图上真有的格子**算：单箱时与 `p.area / p.bins` 完全等价
    const area = kept.reduce((acc, c) => acc + c.w * c.h, 0);

    // 队列深度：模型没跟上时丢最旧的 —— 宁可丢老画面，不给模型看十几秒前的事
    if (o.queueDepth > 0 && sheets.length >= o.queueDepth) sheets.shift();
    sheets.push({
      at: t,
      from: used[0].t,
      to: used[used.length - 1].t,
      png,
      w: img.width,
      h: img.height,
      fill: area,
      area,
      bins: 1,
      why,
      strip: img.stripH ?? 0,
      // 台词对齐用的墙上时间窗（epoch ms）。`from/to` 是相对秒，掉帧会漂；这两个不会。
      wallFrom: used[0].wall ?? null,
      wallTo: used[used.length - 1].wall ?? null,
      frames: used.map((f, i) => ({
        t: +f.t.toFixed(2), tier: seq[i], level: f.level, via: f.via, wall: f.wall ?? null,
      })),
      cells: rects.map((r) => ({ px: r.px, py: r.py, pw: r.pw, ph: r.ph, tier: r.t })),
    });
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

当前版本另有本地视频与错误分类处理。watch/start 共用文件入口检查，要求绝对路径、可访问普通文件；Windows 双分隔符开头先拒绝再 stat，避免检查本身按 UNC 联网。stat 跟随目标而路径原样传给 ffmpeg，这不是根目录或更广的读取沙箱。指定区域错误会在调用侧返回 bad-region，校验文件失败返回 bad-path。Linux 无图形会话特征优先于通用退出码分类，给出切桌面、回放本地文件或用手机的路径。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:181-186](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/README.md#L181-L186)

作者列出各平台实时采集和 Linux Portal 依赖。

```text

| 命令 | 行为 |
|---|---|
| `/seenow` | 开窗（幂等）→ 起采集 → 把常驻循环绑到**发命令的这个会话** → 通知模型「眼睛开了，从此刻起是 peek 模式」 |
| `/seenow off` | 停循环 → 停采集 → 关窗 → 告诉模型别再看 |
| `/seenow status` | 三行短状态：采集 / 窗口 / 循环绑在哪个会话 |
```

**依据 2 · 源码核查**：[src/portal-capture.js:198-209](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/portal-capture.js#L198-L209)

JavaScript 宿主按大端长度头读取分块流。

<details>
<summary>查看原文（12行）</summary>

```text

    const launch = () => {
      attempt += 1;
      const c = spawn(pythonPath, [
        workerPath,
        '--fps', String(fps),
        '--width', String(width),
        '--height', String(height),
        ...(crop ? ['--logical-width', String(crop.logicalWidth ?? 0),
          '--logical-height', String(crop.logicalHeight ?? 0),
          '--edge', String(crop.edge ?? 0),
          '--top-band', String(crop.top ?? 0)] : []),
```

</details>

**依据 3 · 作者声明**：[CHANGELOG.md:3-18](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/CHANGELOG.md#L3-L18)

斜切修复列为 Unreleased，作者报告 798 复测。

<details>
<summary>查看原文（16行）</summary>

```text
## [Unreleased]

### Fixed — portal 采集失败要分清「没装包」和「这台机器没有图形会话」（#68）

proot / 容器 / SSH 无图形环境里，`gi` 抛 `Cannot autolaunch D-Bus without X11 $DISPLAY`
时 python 退 1，而 `classify()` 把 `code === 1` **无条件**归成 `dependency-missing` ——
提示永远是「去 sudo apt install python3-gi ...」，人家那些包全装齐了。

- 新增分类 `no-desktop-session`，特征串**排在 `code === 1` 之前**判（`autolaunch D-Bus` /
  `without X11 $DISPLAY` / `cannot open display` / `Unable to init server` /
  `XDG_RUNTIME_DIR ... not set`）。
- 提示直说「装包解决不了，该装的你已经装了」，并给三条真能走的路：换有桌面的会话、
  `source:"file"` 看本地视频、手机端 see-on-phone。
- `test/portal-error.test.mjs` 5 条，其中两条是防回归的：真缺依赖时仍是 `dependency-missing`、
  `code 1 + 空 stderr` 保持老行为（没证据就不改口）。

```

</details>

**依据 4 · 源码核查**：[package.json:1-12](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/package.json#L1-L12)

包清单版本仍为 0.2.1。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "dsh-see-now",
  "version": "0.2.3",
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

**依据 5 · 源码核查**：[src/index.js:35-89](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/index.js#L35-L89)

本地文件和区域入口、边界及错误类型。

<details>
<summary>查看原文（55行）</summary>

```text
/**
 * `source:"file"` 的 path 会原样交给 `ffmpeg -i`。ffmpeg 把 `http:` / `tcp:` / `concat:`
 * 这类前缀当协议 —— 不先拦，模型给一个 URL，它就真的去连。
 * 工具说明写的是「本地视频的绝对路径」，那就只收这个：绝对路径、存在、是普通文件。
 *
 * Windows 上 `\\server\share\…` 也算绝对路径，但光是 stat 它就已经在连网络了，所以
 * 两个分隔符开头的一律不收（`\\?\`、`\\.\` 这类设备路径也在里面），而且要在 stat 之前判。
 *
 * @returns {string|null} 错误说明；没问题返回 null
 */
function filePathError(path) {
  if (typeof path !== 'string' || !path) return 'source:"file" 要带 path（本机视频文件的绝对路径）。';
  const shown = path.slice(0, 200);
  if (!isAbsolute(path) || (process.platform === 'win32' && /^[\\/]{2}/.test(path))) {
    return `path 要是本机视频文件的绝对路径，现在是「${shown}」。`;
  }
  // stat 失败（不存在 / 没权限 / …）和「存在但不是普通文件」分开说，前者带上错误码
  let st;
  try { st = statSync(path); } catch (e) {
    return `path 不存在或无法访问（${e?.code ?? 'stat 失败'}）：「${shown}」。`;
  }
  if (!st.isFile()) return `path 指向的不是普通文件（比如是个目录）：「${shown}」。`;
  return null;
}

/**
 * 从工具参数构造 source 描述。`watch` 和 `start` 两个入口共用。
 *
 * `region` 是 `source:"screen"` 的**修饰参数**，不是独立 kind：
 *   - 它同时把 engine 钉死在 `gdigrab` —— `ddagrab` 是 filter source，没有
 *     `-offset_x`/`-video_size`，带 region 给它会把偏移**静默丢掉**（抓到整屏，
 *     用户和模型都以为生效了，这是最坏的一种失败）；
 *   - 格式不对时**明确返回错误**，同样不静默退化成全屏。
 *
 * `source:"file"` 的 path 由 `filePathError` 把关，不合格同样明确报错。
 *
 * @returns {{src: object|null, error?: string, reason?: string}}
 *   `reason` 只有 path 不合格时才带（`bad-path`）；region 的错误不带，调用方按 `bad-region` 报。
 */
function srcOf(args) {
  const kind = args.source ? String(args.source).toLowerCase() : null;
  // `source:"portal"` 是 Linux 采集的调试别名（不写进工具说明，省常驻 token）：
  // 语义和 `source:"screen"` 完全一样，只是把引擎钉死在 portal、不再自动探测。
  if (kind === 'portal') return { src: { kind: 'screen', engine: 'portal' } };
  const src = kind ? { kind } : null;
  if (src && kind === 'file') {
    const bad = filePathError(args.path);
    if (bad) return { src: null, error: bad, reason: 'bad-path' };
    src.path = args.path;
    src.realtime = args.realtime === true;
  }
  const rawRegion = args.region;
  if (rawRegion === undefined || rawRegion === null || rawRegion === '') return { src };
  if (src && kind !== 'screen') {
    return { src: null, error: `region 只能配 source:"screen"，现在是 "${kind}"。` };
```

</details>

**依据 6 · 源码核查**：[src/index.js:1169-1185](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/index.js#L1169-L1185)

watch 入口返回错误元数据并处理区域持久化。

<details>
<summary>查看原文（17行）</summary>

```text
        const rawRegion = typeof args.region === 'string' ? args.region.trim() : '';
        const regionOff = /^(off|none|clear)$/i.test(rawRegion);
        const built = srcOf(regionOff ? { ...args, region: undefined } : args);
        if (built.error) return { text: built.error, meta: { ok: false, reason: built.reason ?? 'bad-region' } };
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
```

</details>

**依据 7 · 源码核查**：[src/portal-capture.js:95-116](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/portal-capture.js#L95-L116)

无桌面特征先于退出码处理。

<details>
<summary>查看原文（22行）</summary>

```text
export function classify(code, stderrTail) {
  const tail = String(stderrTail ?? '');
  /**
   * **先判"没有图形会话"**（#68）。worker 里 `gi` 抛未捕获异常时 python 也是退 1，
   * 跟"缺依赖"撞在同一个码上，但两句提示完全相反：一个是"去装包"，一个是"装了也没用"。
   *
   * 特征都是实测到的原文：
   *   `gi.repository.GLib.GError: Cannot autolaunch D-Bus without X11 $DISPLAY (0)`
   *   （proot / 容器 / SSH 无图形环境）
   * 这条要排在 `code === 1` 前面，否则永远进不来。
   */
  if (/autolaunch D-Bus|without X11 \$DISPLAY|cannot open display|Unable to init server|XDG_RUNTIME_DIR.{0,24}not set/i
    .test(tail)) {
    return 'no-desktop-session';
  }
  if (code === 1 || /python3-gi|gst-inspect|pipewiresrc|module named 'gi'/i.test(tail)) {
    return 'dependency-missing';
  }
  if (code === 2 || /被拒绝|取消|cancelled|denied/i.test(tail)) return 'permission-denied';
  return 'capture-failed';
}

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

**依据 1 · 源码核查**：[src/index.js:924-953](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/index.js#L924-L953)

按会话切换循环并在关窗时挂断。

<details>
<summary>查看原文（30行）</summary>

```text

  /**
   * 一行状态（给 `/seenow status` 用）。
   *
   * 工具的 `status` 是**诊断用**的十几行；命令只是"看一眼"，倒那么多反而看不清。
   * 三行：采集、窗口、循环（含绑在哪个会话 —— 这正是"话投错人"时第一眼要看的）。
   */
  const statusSummary = () => {
    const st = runner.status();
    const lp = loop?.state() ?? null;
    const cap = st.running
      ? `在跑（收到 ${st.frames ?? 0} 帧，出图 ${st.stats?.sheets ?? 0}）`
      : (st.pending ? `停了，队列里还有 ${st.pending} 张` : '没在跑');
    return [
      `看屏幕：${cap}`,
      windowLine(),
      `循环：${lp
        ? (lp.stopped
          ? `已停（${lp.reason ?? '未知'}）`
          : `在跑 · 叫醒 ${lp.wakes} 次 · 绑定 ${lp.session ?? '未知会话'}`)
        : '没起'}`,
      `命令：/${COMMAND_NAME}${commandRegistered ? ' 已注册' : ' 未注册'}`,
    ].join('\n');
  };

  /**
   * 起循环（幂等，按会话）。
   *
   * **这是"看完一张就停"和"一直看下去"的分界线**：以前 `watch` 返回一张图就结束了，
   * 模型回完话自然收工。现在 watch 返回第一张图之后，插件自己接着跑，
```

</details>

**依据 2 · 源码核查**：[src/runner.js:1048-1057](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/runner.js#L1048-L1057)

隐式 watch 受阻，显式来源会清除挂断。

<details>
<summary>查看原文（10行）</summary>

```text
      })) {
        hungUp = false;
        log('悬浮窗被重新打开过 —— 解除挂断，继续看。');
      }

      /**
       * `fileEnded` 只在**采集已经停了**的时候才算数。
       *
       * 为什么：文件还在播（`running` 为真）时，`watch` 走的是"接着等下一张"，
       * 根本不是重播；这时候拦下来就是"看个视频，第二次 `watch` 就说文件放完了"。
```

</details>

**依据 3 · 源码核查**：[src/command.js:74-110](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/command.js#L74-L110)

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

**依据 4 · 源码核查**：[src/index.js:1590-1605](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/index.js#L1590-L1605)

命令服务接线与缺当前会话时的兜底。

<details>
<summary>查看原文（16行）</summary>

```text
            + `\n命令：/${COMMAND_NAME}${commandRegistered ? ' 已注册（`/` 菜单里能看到）' : ' 未注册（宿主没有 commands 服务）'}`
            // 区域：只看一小块时，模型得知道自己看到的不是整屏
            + `\n区域：${regionText(s.lastSource?.region ?? loadRegion()) ?? '整屏'}`
            // 采集流的坐标系：Linux 上 region 的 x,y,w,h 就是按这个尺寸量的
            + (s.stream?.width ? `（采集流 ${s.stream.width}×${s.stream.height}，region 坐标用这个空间）` : '')
            // 声音单独一行：听不到声音时第一个要看的就是这里
            + `\n声音：${voice.speakers > 0
              ? `已接上 ${voice.adapters.join(', ') || '适配器'}（${voice.speakers} 个会出声的订阅者）`
              : voice.configured
                ? `配了 ${voice.configured} 但没挂上（${voice.reason ?? '原因未知'}）`
                : '没配 —— 写 ~/.dsh/voice.json 的 {"adapter":"…"} 才有声音'}`
            // 听声音（视频里的台词）：**"它不知道台词"时第一个要看的就是这一行**
            + `\n听声音：${listenLine(s.listen)}`
            // 宿主 cookie 拥挤度：只快满了才出现（满了之后插件根本起不来，提醒不到）
            + cookieWarnLine(),
          meta: { ...s, voice, loop: lp, window: windowReport() },
```

</details>

**依据 5 · 源码核查**：[src/index.js:1336-1340](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/index.js#L1336-L1340)

普通 stop 的执行边界。

```text
        };
      }

      if (action === 'peek') {
        const s = runner.peek();
```

**依据 6 · 源码核查**：[src/index.js:419-435](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/index.js#L419-L435)

先保存附件再返回引用。

<details>
<summary>查看原文（17行）</summary>

```text
  // 常驻模式要**明说**，否则模型会以为"还得我自己再调一次"，或者以为"看一眼就完事了"
  const loopNote = looping
    ? '\n**已经进入常驻模式**：下一张攒够我会再叫你，不用你现在就调下一次。'
      + '你现在只要做一件事 —— 值得说就用 `say` 说一句，不值得说就别出声。'
      + '用户关掉悬浮窗我就停。'
    : '';
  return `${head}\n${lines.join('\n')}${linesText(sheet)}${changeText(sheet.changes)}${ask}${lastSaidNote()}${loopNote}\n（${whyText}；想看下一段就再调一次 \`see_now({action:"watch"})\`。）${replyReminder({ answered: Boolean(say) })}`;
}

/**
 * 提交成宿主附件，并组装工具返回值。
 *
 * **`saveImage` 必须 `.call(svc, …)`**：它内部读 `this.compression`，方法取下来裸调会丢 this，
 * 报 `Cannot read properties of undefined (reading 'compression')` —— 所有出图工具一起挂。
 */
/**
 * 把一张**或多张**图交给宿主，拼成一次工具结果。
```

</details>

**依据 7 · 源码核查**：[src/offload.js:2-12](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/offload.js#L2-L12)

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

**依据 8 · 源码核查**：[src/offload.js:194-204](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/offload.js#L194-L204)

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

**依据 9 · 源码核查**：[src/listen.js:604-617](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/listen.js#L604-L617)

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

**依据 10 · 源码核查**：[src/listen.js:1173-1187](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/listen.js#L1173-L1187)

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

**依据 1 · 源码核查**：[src/pipeline.js:983-994](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/pipeline.js#L983-L994)

现有累计变化及兜底条件是对照基础。

<details>
<summary>查看原文（12行）</summary>

```text
      && s >= o.cutAbs
      && s >= o.cutJumpAbs
      && jump >= o.cutJumpMargin
      && s >= o.cutJumpRatio * base;
    // 运动补偿：整屏在动但邻域里找得到对应 → 运镜；找不到对应 → 换镜头。
    // 半径 4 的 mc 比“绝对台阶”更直接：真实运动切机位 abs 只有 23 也能过。
    const mc = entry.mc ?? 0;
    const mcBox = entry.mcBox ?? 0;
    const mcFill = entry.mcFill ?? 0;
    const mcCut = o.cutMcAbs > 0
      && s >= o.cutMcMinScore
      && mc >= o.cutMcAbs;
```

</details>

**依据 2 · 源码核查**：[src/index.js:1112-1139](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/index.js#L1112-L1139)

当前区域路径是采集范围限制。

<details>
<summary>查看原文（28行）</summary>

```text
       * 光靠模型在 `say` 里答应没用 —— 出图频率和唤醒间隔都是插件参数，
       * 不改参数就是不改行为。所以听到"慢一点 / 省点钱"就传 `pace:"calm"`。
       */
      let wantPace = args.pace ? String(args.pace).toLowerCase() : null;
      // 旧名兼容：`action` 曾短暂用过，收到就走新档
      if (wantPace === 'action') wantPace = 'game-economic';
      /**
       * 档位：模型传 `tier` 才会走到这里，没传就保持当前值。
       * 不在 schema 里教它什么时候用 —— 见 `tool-spec.js` 那段注释。
       */
      const wantTier = args.tier ? String(args.tier).toLowerCase() : null;
      /**
       * 模型只能选这四档。**`custom` 故意不给它** —— 那是一张八项的表，
       * 模型填不准（它看不到当前档位分布），传了 `custom` 却没有表等于什么都不改。
       */
      if (wantTier && TIER_MODES.includes(wantTier) && wantTier !== tierMode) {
        tierMode = wantTier;
        log(`档位改成 ${wantTier}`);
      }

      if (wantPace && PACES[wantPace] && wantPace !== paceMode) {
        paceMode = wantPace;
        try { runner.stop(); } catch { /* 没在跑 */ }
        stopLoop('换节奏');
        loopScene = null;
        const t = {
          calm: '已切到**省电节奏**：20 分以上才算换画面，最多 30 秒叫你一次。',
          normal: '已切回**默认节奏**：12 分算换画面，最多 15 秒叫一次。',
```

</details>

**依据 3 · 源码核查**：[src/index.js:1205-1213](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/index.js#L1205-L1213)

文件结束会要求再次显式传源。

```text
        // **逐帧模式和 minFrames 互斥**：逐帧一张图就 1 帧，`minFrames > 1` 永远等不满，
        // 会一路等到超时再报"画面没变"——那是假故障。让 minFrames 让路（它只是
        // "别给我太碎的图"，而逐帧本来就要碎），并把这句说出去，别让人以为设了 5 就真有 5。
        const minFrames = sceneMode ? 1 : requestedMinFrames;
        if (sceneMode && requestedMinFrames > 1) {
          pendingModeNote = [
            `逐帧模式下每张图只有 1 帧，\`minFrames: ${requestedMinFrames}\` 这条路上不生效（已按 1 处理）。`
            + '要按帧数攒图，先 `see_now({scene:false})`。',
            pendingModeNote,
```

**依据 4 · 源码核查**：[src/index.js:442-450](https://github.com/SAOS-3624/dsh-see-now/blob/0b4bd110074b3e2cd043da8b078f7272589d50b0/src/index.js#L442-L450)

输出可测量帧、时间、字节与质量。

```text
 * 逐张的区间放进 `sheets[]`。`batch` 说明这次交了几张。
 *
 * `sessionId` 是这批图交给的会话，只用来告诉自动省略该看哪一份历史；
 * 不放进 `extra` —— `extra` 会原样进 `meta`。
 */
async function attachAndReturn(ctx, sheets, extra = {}, { sessionId = null } = {}) {
  const svc = serviceOf(ctx, 'attachments');
  const list = (Array.isArray(sheets) ? sheets : [sheets]).filter(Boolean);
  if (!list.length) {
```

#### 缺口

- 没有相同条件下的结果、延迟及模型收费数据
  **影响**：不能量化收益与回退成本
  **进一步探讨**：保留分段标注和不同取样结果，盲评任务是否合格并查实际用量

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
