# See Now

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d463efa](https://github.com/SAOS-3624/dsh-see-now/tree/d463efaa6eaf5ff69de5f8b2e8453aa2813afd35)

<!-- BEGIN META -->
[![GitHub ★ 334](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=334&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/SAOS-3624/dsh-see-now) [![npm 30d 6,403](https://img.shields.io/static/v1?label=npm+30d&message=6%2C403&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-see-now) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-see-now)
<!-- END META -->

> **功能**：从屏幕、摄像头或视频筛选变化帧并拼图，作为 DSH 视觉工具的输入。

> **亮点**：[Q01](#research-q01) 用一张有时间信息的拼图承载多个操作时点，降低对重复截图的依赖。

> **主要限制**：[Q03](#research-q03) 采集停止只作用于后续流程，已保存附件有自己的生命周期。

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
  - [Q01 · 连续视觉相对重复截屏多了什么？](#detail-section-11)
  - [Q02 · 视觉变化如何触发留帧？](#detail-section-12)
  - [Q03 · 停止采集能撤回已提交画面吗？](#detail-section-13)
  - [Q04 · 哪些前提下值得做短时试用？](#detail-section-14)
  - [Q05 · 低面积变化能否优先送给模型？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要让 DSH 复核界面操作过程的开发者，可以先用短视频给出一段有时间信息的视觉上下文。

手工截图适合单一状态，定时截图保留时间密度但会产生重复画面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 变化采样 | 减少重复时间点 | 阈值无法识别业务重要性 |
| 视觉附件 | 向宿主提交拼图 | 依赖附件服务 |
| 采集控制 | 启停观察 | 已保存附件留在宿主生命周期 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 工具和附件服务 | 必需 | 注册并保存 PNG | 无法交付视觉附件 |
| ffmpeg 和可访问的视频源 | 必需 | 提供画面 | 采集失败 |
| 视觉模型 | 解释画面必需 | 理解拼图 | 可仅核查选帧 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 选无敏感内容的短视频 | 确认视觉模型及附件 |
| 检查 | 对照画面时间和关键状态 | 缺细节时改用人工截图 |
| 退出 | 停止并移除 profile 插件 | 既有附件由宿主处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 采集设备和模型开销未知 | 配置耗时未知 | 平台与权限相关 |
| 持续 | 编码负载及计费未知 | 检查遗漏耗时未知 | 低活动仍有兜底帧 |
| 恢复 | 重新采集开销未知 | 定位权限和缺图耗时未知 | 已提交数据另行核查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多时点视觉 | 源码保存拼图及时间跨度 | 关键状态识别是否改善 |
| 减少重复 | 变化触发与兜底控制取样 | 实际模型费用 |

> **思考**：[Q03](#research-q03) 采集停止只作用于后续流程，已保存附件有自己的生命周期。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 用一张有时间信息的拼图承载多个操作时点，降低对重复截图的依赖。

切点和累计采样分流，去重阻挡普通留帧时不会提前清空累计量。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 采集停止只作用于后续流程，已保存附件有自己的生命周期。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先核查短文件上的画面覆盖、清晰度与退出，再决定是否打开实时源。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持选帧、附件返回及停止分支，实际图像理解、留存和费用未实测。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.js、src/pipeline.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定仓库的选择管线、工具、附件和退出。未运行采集或模型。
- 下一步：对短视频逐帧标注关键界面变化，比较定时采样与变化采样的召回。

**分析版本**

- **仓库**：[SAOS-3624/dsh-see-now](https://github.com/SAOS-3624/dsh-see-now)
- **版本号**：0.1.1（[固定提交 d463efa](https://github.com/SAOS-3624/dsh-see-now/tree/d463efaa6eaf5ff69de5f8b2e8453aa2813afd35)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在同图预算下测试区域加权能否保留小面积关键信号。

对短视频逐帧标注关键界面变化，比较定时采样与变化采样的召回。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 1611 | — | — | 20519 |
| .mjs | source | 11 | 1437 | 1030 | 266 | — |
| .mjs | example | 1 | 110 | 61 | 43 | — |
| .js | source | 25 | 8397 | 4962 | 3048 | — |
| .mjs | test | 33 | 4416 | 3412 | 513 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/SAOS-3624/dsh-see-now/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=12&color=737b86&logo=github)](https://github.com/SAOS-3624/dsh-see-now/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/SAOS-3624/dsh-see-now/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查连续视觉如何在少传画面与保留关键状态之间取舍。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 连续视觉相对重复截屏多了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要让 DSH 辨认一段界面操作的人可以把多个时点的画面交给同一轮视觉理解。作者提出按变化选帧并拼入一张图。宿主工具实际返回附件与文字时间信息，较单张截屏能携带过程线索。但拼图各格的可读尺寸下降，变化少也不等于业务上不重要。对一次性辨认细字，手工截取目标区域依然是直接基线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:43-58](https://github.com/SAOS-3624/dsh-see-now/blob/d463efaa6eaf5ff69de5f8b2e8453aa2813afd35/README.md#L43-L58)

定时截屏参照与选帧主张

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

**依据 2 · 源码核查**：[src/index.js:308-332](https://github.com/SAOS-3624/dsh-see-now/blob/d463efaa6eaf5ff69de5f8b2e8453aa2813afd35/src/index.js#L308-L332)

返回带时间和帧数的图像引用

<details>
<summary>查看原文（25行）</summary>

```text
async function attachAndReturn(ctx, sheet, extra = {}) {
  const svc = serviceOf(ctx, 'attachments');
  if (!svc?.saveImage) {
    return { text: '拿到图了，但宿主没有 attachments 服务，交不上去。', meta: { ok: false, ...extra } };
  }
  const ref = await svc.saveImage.call(svc, {
    data: sheet.png,
    mediaType: 'image/png',
    name: `see-now-${Date.now()}.png`,
  });
  // `say` 是给清单用的，不进 meta —— 那是整段话，塞进 meta 只会让返回值翻倍
  const { say: said, ...meta } = extra;
  return {
    images: [ref],
    text: sheetText(sheet, extra),
    meta: {
      ...meta,
      said: said ? String(said).slice(0, 200) : null,
      frames: sheet.frames.length,
      from: +sheet.from.toFixed(2),
      to: +sheet.to.toFixed(2),
      fill: +sheet.fill.toFixed(3),
      why: sheet.why,
      bytes: sheet.png.length,
    },
```

</details>

#### 缺口

- 没有同任务辨识对照
  **影响**：不能判断过程信息是否抵消格子变小
  **进一步探讨**：比较界面错误定位与截图数量

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 视觉变化如何触发留帧？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

管线对硬切使用最短间隔、前景运动排除与分数门槛。确认切点就清空累计量并尝试留帧。普通运动累积分数，达到阈值和最小间隔才尝试标记；未成功留帧则保留累计量。低活动路径还有按时间触发的兜底。这个组合让取样频率随视觉变化变化，但不解析文本语义，因此一次短暂的低面积弹窗可能与业务重要性脱节。

#### 证据与依据

**依据 1 · 源码核查**：[src/pipeline.js:792-813](https://github.com/SAOS-3624/dsh-see-now/blob/d463efaa6eaf5ff69de5f8b2e8453aa2813afd35/src/pipeline.js#L792-L813)

硬切、累计和最低采样路径

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

**依据 2 · 源码核查**：[src/pipeline.js:370-378](https://github.com/SAOS-3624/dsh-see-now/blob/d463efaa6eaf5ff69de5f8b2e8453aa2813afd35/src/pipeline.js#L370-L378)

积分阈值按采样频率及窗口设定

```text
   *     need = REF_SCORE × fps × integralSeconds
   *
   * REF_SCORE 是「中等强度画面每帧的变化分」（8 是标定出来的中位数，0–255 刻度）。
   * 于是一段中等画面要攒 integralSeconds 秒才够一个采样点；画面比它动得快就更快累够，
   * 比它静就永远累不够 —— 这才是"运动多给几帧"，而不是固定 N 秒一帧。
   */
  function integralNeed() {
    return REF_SCORE * fps * o.integralSeconds;
  }
```

#### 缺口

- 未测目标场景误检和漏检
  **影响**：无法给出选择器的实测覆盖率
  **进一步探讨**：标注低面积弹窗、快速切页和大前景变化后回放比较

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 停止采集能撤回已提交画面吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

工具把拼好的 PNG 保存到宿主附件服务，再把引用交给工具响应。没有附件服务会返回失败。stop 分支停止当前循环与采集，代码没有向宿主发送撤回附件的动作。默认 start 可以选择屏幕，因此试用时应选无敏感内容的素材和场景，区分停止后续采集与清理既有记录。作者关于 DeepSeek-V4 单图开销的算式是具体模型口径，不能用来保证实际账户费用或低延迟。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:308-322](https://github.com/SAOS-3624/dsh-see-now/blob/d463efaa6eaf5ff69de5f8b2e8453aa2813afd35/src/index.js#L308-L322)

附件交给宿主

<details>
<summary>查看原文（15行）</summary>

```text
async function attachAndReturn(ctx, sheet, extra = {}) {
  const svc = serviceOf(ctx, 'attachments');
  if (!svc?.saveImage) {
    return { text: '拿到图了，但宿主没有 attachments 服务，交不上去。', meta: { ok: false, ...extra } };
  }
  const ref = await svc.saveImage.call(svc, {
    data: sheet.png,
    mediaType: 'image/png',
    name: `see-now-${Date.now()}.png`,
  });
  // `say` 是给清单用的，不进 meta —— 那是整段话，塞进 meta 只会让返回值翻倍
  const { say: said, ...meta } = extra;
  return {
    images: [ref],
    text: sheetText(sheet, extra),
```

</details>

**依据 2 · 源码核查**：[src/index.js:857-872](https://github.com/SAOS-3624/dsh-see-now/blob/d463efaa6eaf5ff69de5f8b2e8453aa2813afd35/src/index.js#L857-L872)

启动和停止动作的范围

<details>
<summary>查看原文（16行）</summary>

```text
      if (action === 'start') {
        const built = srcOf(args);
        if (built.error) return { text: built.error, meta: { ok: false, reason: 'bad-region' } };
        const r = await runner.start({ src: built.src ?? { kind: 'screen' } });
        return {
          text: r.already ? '已经在看了。'
            : `开始看 ${r.source.kind}（引擎 ${r.engine}）${r.warning ? `。⚠️ ${r.warning}` : '。'}`,
          meta: r,
        };
      }

      if (action === 'stop') {
        stopLoop('手动 stop');
        runner.stop();
        return { text: '停了。窗口还开着，想再看得重新调 watch。', meta: { ok: true } };
      }
```

</details>

**依据 3 · 作者声明**：[README.md:71-88](https://github.com/SAOS-3624/dsh-see-now/blob/d463efaa6eaf5ff69de5f8b2e8453aa2813afd35/README.md#L71-L88)

作者的模型计量口径

<details>
<summary>查看原文（18行）</summary>

```text
成本口径（按宿主 DeepSeek-V4 的 patch 网格算：14px patch 向上对齐 → 42px 一格 → `rows×(cols+1)+2`）：

| 档位 | 画布（画面 + 音轨条） | 每张 token |
|---|---|---|
| `low`（默认） | 798×450 + 12px = **798×462** | **222** |
| `standard` | 1050×600 + 30px = 1050×630 | 392 |
| `high` | 1260×720 + 36px = 1260×756 | 560 |
| `ultra` | 1596×900 + 24px = 1596×924 | 860 |

一张图里塞 4 帧还是 8 帧，**价格一样** —— 所以"多留一帧"几乎免费，"漏掉一帧"才贵。

**宽度故意不对齐 16:9，而是对齐 42**（800→798、1066→1050、1280→1260、1600→1596）：
800 会被 pad 到 812 = 19.3 格，白算一整列；798 正好 19 列，面积只少 **0.25%**，每张省 11~24 token。
这是整个链路里唯一**零代价**的降本点（storyboard 那边也是这么干的）。

**音轨条不额外花钱**：token 是按 42px 一行算的阶梯函数，450 高的画面占 11 行、上界 462 ——
底下**空着 12px 也照样收 11 行的钱**。条就用这 12px（其余档位同理：600 余 30、720 余 36、900 余 24）。
所以"加条"和"不加条"的 token 完全一样，关掉它只是图干净一点，省不到钱。
```

</details>

#### 缺口

- 宿主附件保留时间和实际供应商使用量未知
  **影响**：无法判断停用后的全部数据留存和费用
  **进一步探讨**：用合成素材核对 profile 的附件生命周期与模型计量

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些前提下值得做短时试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在具备视觉能力的 DSH profile 中，先使用无敏感内容的短视频复核选帧和图像可读性，再决定是否接入屏幕。配置还涉及 ffmpeg 与对应平台采集，macOS 屏幕源需录屏授权，Windows 路径依赖探测及回退。工具挂载后要确认宿主附件可保存。退出先 stop，再按作者说明移除该 profile 的包。初始化耗时、编码负载、阅读效果和模型用量均无本轮测量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:94-108](https://github.com/SAOS-3624/dsh-see-now/blob/d463efaa6eaf5ff69de5f8b2e8453aa2813afd35/README.md#L94-L108)

作者的安装、重启和退出步骤

<details>
<summary>查看原文（15行）</summary>

````text
### 在 DSH 里用

已经发布到 npm，用 DSH 自带的 `dsh plugin` 装（它本质是 profile 维度的 pnpm 包装器 +
插件登记器，会在装前预检 engines/peer、装后自动把 `dsh.bundle` 写进 profile）：

```bash
dsh plugin --profile web add dsh-see-now
```

- **`web`** 是浏览器里用的那个 profile；桌面版换成 `--profile desktop`（那个 profile 需要先开过一次桌面端才会被初始化）。
- 装完**重启 DSH** 生效（插件树在进程启动时组合）。
- 重启之后**不用新开会话**：工具表是每一步重新组装的，旧会话下一轮就能看到 `see_now`
  （宿主还会插一条 `tool-addition` 告诉模型多了这个工具）。所以「工具表在会话开头就定死了」
  不成立 —— 挂不上多半是没重启，或者装的是旧副本。
- 卸载：`dsh plugin --profile web remove dsh-see-now`
````

</details>

**依据 2 · 作者声明**：[README.md:134-143](https://github.com/SAOS-3624/dsh-see-now/blob/d463efaa6eaf5ff69de5f8b2e8453aa2813afd35/README.md#L134-L143)

平台和 ffmpeg 前提

<details>
<summary>查看原文（10行）</summary>

```text
#### 平台

| 平台 | 屏幕引擎 | 要额外做的 |
|---|---|---|
| Windows | `ddagrab`，不行退 `gdigrab`（自动探测） | 无 |
| macOS | `avfoundation` | 系统设置 → 隐私与安全性 → **屏幕录制**，勾上跑 DSH 的 App |
| Linux | — | 还没接（要补 `x11grab` / PipeWire） |

ffmpeg 不用进 PATH：插件会按 `DSH_FFMPEG_PATH` / `FFMPEG_PATH` / `DSH_FFMPEG_DIR` /
`~/.dsh/tools/ffmpeg/bin` / `~/.dsh/bin` 的顺序自己找（DSH 桌面版把 ffmpeg 装在第四个位置）。
```

</details>

**依据 3 · 源码核查**：[src/index.js:1006-1013](https://github.com/SAOS-3624/dsh-see-now/blob/d463efaa6eaf5ff69de5f8b2e8453aa2813afd35/src/index.js#L1006-L1013)

工具在宿主注册

```text
  try {
    disposers.push(ctx.tools.register(defineTool(toolObj)));
    // 注册成功要留一行：出问题时"加载失败"（有 plugin-error.log）和"装了两份、被去重"
    // 是两回事，没有这行只能靠猜。
    log(`已注册工具 ${TOOL_NAME}（v${VERSION}）`);
  } catch (e) {
    const msg = String(e?.message ?? e);
    if (!/already registered/i.test(msg)) throw e;
```

#### 缺口

- 未运行目标宿主或设备
  **影响**：无法确认特定 profile 的安装、权限提示和硬件适配
  **进一步探讨**：先以离线短文件验证产物和退路

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 低面积变化能否优先送给模型？

**研究主题**：新假设与验证

#### 完整回答

可验证一个区域加权策略，在同一图像预算下优先考虑已知状态区域的小变化。现有低活动兜底可弥补长时间静止，但不会基于弹窗语义分配预算。对同一录像按原配置和加权配置选帧，在图张数及画布档位相同下比较低面积提示召回、文字识别和静止误报。若漏检无改善或挤占了同样重要的全局变化，放弃该策略。

#### 证据与依据

**依据 1 · 源码核查**：[src/pipeline.js:792-813](https://github.com/SAOS-3624/dsh-see-now/blob/d463efaa6eaf5ff69de5f8b2e8453aa2813afd35/src/pipeline.js#L792-L813)

现有选择判据与兜底

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

#### 缺口

- 区域加权没有实现或实测
  **影响**：当前价值仅是假设
  **进一步探讨**：用标注录像做预算匹配的离线对照

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
