# 滑动变祖

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[dcd348e](https://github.com/kingOfSoySauce/dsh-liang-skin/tree/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef)

<!-- BEGIN META -->
[![GitHub ★ 335](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=335&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kingOfSoySauce/dsh-liang-skin) [![npm 30d 8,257](https://img.shields.io/static/v1?label=npm+30d&message=8%2C257&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@leon___/dsh-client-liang-intensity-skin) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@leon___/dsh-client-liang-intensity-skin)
<!-- END META -->

> **功能**：在 DSH 中用人物与配色滑块预览外观，并按当前模型的真实推理档位提交选择。

> **亮点**：把模型声明档位接入视觉轴，并将拖动预览与正式提交分开，提供可取消和纯视觉模式；上游人物素材不计作本插件原创。见[Q01](#research-q01)与[Q02](#research-q02)。

> **主要限制**：31停点只是外观细分，未知档位也会显示最大视觉，人物等级不能表示模型真实能力或已确认状态；关闭皮肤也不撤销已提交档位。见[Q02](#research-q02)与[Q03](#research-q03)。

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
  - [Q01 · 皮肤适合谁，相比原生档位菜单增加什么？](#detail-section-11)
  - [Q02 · 拖动、提交、同步和失败怎样对应真实档位？](#detail-section-12)
  - [Q03 · 加载、退出、更新和全周期成本有哪些条件？](#detail-section-13)
  - [Q04 · 什么人可试用，如何验证状态表达假设？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：喜欢人物风格并经常调档的人可把原生推理菜单换成视觉滑块，仍须核对真实档位且保持输入可读。见[Q01](#research-q01)。

原生模型档位菜单无需主题适配即可选真实ID。视觉概念与素材有作者明确上游归属，本插件增量是DSH交互和状态接线，不是模型能力提升。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 真实档位滑块 | 拖动预览并在结束提交原始ID | 至少两档，addressed subagent不提交 |
| 31视觉停点 | 提供外观细分 | 不增加服务端推理等级，多停点可同一ID |
| 纯视觉与总开关 | 分开控制外观和模型绑定 | 关闭皮肤不撤销已提交档位 |
| 设置与可选效果 | 人物、遮罩及粒子等偏好 | 本地浏览器保存，宿主可读性需核查 |
| 官方接口更新 | 明确版本安装及未知结果回读 | 依赖宿主pluginManager，不自动强制绕过拒绝 |

**流程与依赖**

依赖与启动步骤随完整成本/效果表集中在[Q03](#research-q03)，其中区分ModelDirectory、素材路由、本地偏好和仅更新才需的官方接口。视觉出现不能代替选择接口验收。

使用时先记录原生档位，再分开检验绑定与纯视觉模式；退出后另核实际档位。完整执行者与成功/失败步骤见[Q03](#research-q03)，不把关闭外观当参数回滚。

**效果与成本**

要比较的是一次正确选档的总负担，视觉复杂度、设备资源与实际模型档位成本分别记录。阶段成本表和缺失数据见[Q03](#research-q03)。

当前支持的是交互与状态处理机制，未确认更快选档或更好模型答案；效果表见[Q03](#research-q03)。

> **思考**：31停点只是外观细分，未知档位也会显示最大视觉，人物等级不能表示模型真实能力或已确认状态；关闭皮肤也不撤销已提交档位。见[Q02](#research-q02)与[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把模型声明档位接入视觉轴，并将拖动预览与正式提交分开，提供可取消和纯视觉模式；上游人物素材不计作本插件原创。见[Q01](#research-q01)与[Q02](#research-q02)。

预览与提交分离、完整模型身份同步、拒绝恢复及更新requestId回读可借鉴；未知状态映到最大视觉是需要明确解释的外观取舍。核对了src关键链与lib实际提交片段，未重建或运行测试。

<a id="detail-section-5"></a>

### 1.4 主要限制

31停点只是外观细分，未知档位也会显示最大视觉，人物等级不能表示模型真实能力或已确认状态；关闭皮肤也不撤销已提交档位。见[Q02](#research-q02)与[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在一个非关键会话先核原生ID，再检验拖动、31停点和纯视觉模式；误选、遮挡或不适时关闭并回原生菜单。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持真实ID映射、延迟提交、拒绝恢复和视觉开关；真实宿主时序、可读性与效率未验证。双状态可见为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.js、src/client/index.tsx、src/client/logic.ts、src/client/effort-sync.ts、src/client/preferences.ts、src/client/updater.ts、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向读取模型映射、交互提交、偏好、视觉dispose、更新结果处理、素材服务与对应lib片段；不全审所有CSS、粒子、图片来源授权链或宿主实现。
- 下一步：在目标宿主以两档、多档、未知选择、拒绝和子agent寻址检验实际ID，对比原生菜单的理解与操作时间；本轮未执行。

**分析版本**

- **仓库**：[kingOfSoySauce/dsh-liang-skin](https://github.com/kingOfSoySauce/dsh-liang-skin)
- **版本号**：0.1.15-settings.4（[固定提交 dcd348e](https://github.com/kingOfSoySauce/dsh-liang-skin/tree/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可检验显式区分视觉级别、宿主已确认档位和等待状态是否减少误选；该双状态设计尚未验证。见[Q04](#research-q04)。

在目标宿主以两档、多档、未知选择、拒绝和子agent寻址检验实际ID，对比原生菜单的理解与操作时间；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 248 | — | — | 4242 |
| .js | source | 4 | 2986 | 2837 | 93 | — |
| .mjs | source | 3 | 933 | 885 | 18 | — |
| .ts | test | 8 | 1338 | 1244 | 11 | — |
| .ts | source | 7 | 1449 | 1326 | 43 | — |
| .tsx | source | 3 | 1032 | 951 | 15 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/kingOfSoySauce/dsh-liang-skin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：视觉滑块怎样与真实模型推理档位保持一致，装饰性细分和皮肤开关会不会让用户误解模型状态？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 皮肤适合谁，相比原生档位菜单增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是一项把人物和配色与DSH推理档位选择结合的原生皮肤插件，适合喜欢这种视觉风格、需要频繁调整当前模型档位的人。合格结果是滑块提交正确原始档位ID，外观不误导实际状态，聊天输入、设置与弹窗仍可用，关闭后能回到原界面。它不增加模型推理能力，也不证明更高档位就有更好任务效果。

原生替代是模型选择器自己的思考档位菜单。插件把档位均匀映到视觉轴，拖动时预览人物和配色，交互完成才提交，减少在菜单中寻找选项的一处摩擦。31档细分只增加视觉停点，不制造31个服务端推理等级；不绑定时滑块只控制外观。对只需要准确调参、不喜欢人物或不想增加主题耦合的人，原生菜单更直接。

作者明确说明视觉概念与人物素材源自liang-intensity-calibrator，本插件的可确认增量是DSH接线、状态同步和开关，不把上游素材当原创。实际偏好、调档时间与误选率没有独立数据，不能把趣味界面等同于生产力改善。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:51-78](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/README.md#L51-L78)

作者明确原始档位与31视觉停点、绑定开关。

<details>
<summary>查看原文（28行）</summary>

```text
- 档位直接读取当前模型的 `reasoning.efforts`，不写死数量或名称。
- 任意 N 个档位均匀落在 0–30：两档为 `0 / 30`，三档为 `0 / 15 / 30`，五档为 `0 / 7.5 / 15 / 22.5 / 30`。
- 拖动期间只做连续视觉预览；指针松开、键盘操作完成或控件失焦时，才通过官方 ModelDirectory 提交最近档位的原始 ID。默认停在模型真实档位；开启「31 档细分」后，可停在 0–30 的任一级外观，实际提交值仍来自模型。
- 不支持推理或只有一个可选档位的模型不显示滑块。
- addressed subagent 不显示也不提交滑块。

## 外观开关

打开 **设置 → 滑动变祖** 的「启用滑动变祖」。关闭后移除人物、配色、滑块和特效，设置入口仍可打开；开关会自动记住，刷新后不会自行开启。

通用设置的外观恢复 DSH 原生的「浅色／深色／跟随系统」三个选项。皮肤不再写入宿主主题偏好；关闭时保留用户当前选择的原生主题。

### 插件设置

打开 **设置 → 滑动变祖**，或侧栏 **插件 → 滑动变祖**（包名 `@leon___/dsh-client-liang-intensity-skin`）。两个入口通过官方 `settings.section` 和 `plugins.bundle.config` 复用同一套设置，点击开关后立即生效，并自动保存在当前浏览器，不需要保存按钮。

| 设置 | 默认 | 行为 |
| --- | --- | --- |
| 启用滑动变祖 | 开 | 控制整体外观，不停用插件本身；关闭后仍可打开设置。 |
| 绑定思考等级 | 开 | 滑块同时修改模型思考档位；关闭后只调外观。 |
| 31 档细分 | 关 | 绑定模式下增加 31 个视觉停点；不增加模型推理档位。 |
| 隐藏滑块 | 关 | 隐藏输入框旁的滑块；绑定开启时，人物和配色仍跟随模型档位。 |
| 背景遮罩 | 开 | 仅柔化会话列人物，不覆盖文字或原生弹窗。 |
| 仙侠风 | 关 | 单独切换人物素材，不联动粒子或其它功能。 |
| 粒子效果 | 关 | 显示装饰粒子；关闭后释放动画和 GPU 资源。 |
| 空闲时淡化 | 关 | 空闲时淡化人物，生成或拖动时突出人物。 |

四项可选效果和隐藏滑块默认关闭，保留原有外观。只加载选中的一套人物；原 PR 的开发调参浮窗和聊天框齿轮不进入此版本。隐藏控件不会提交或取消模型选择；未绑定时保留当前外观。控件复用 DSH 原生 Switch，点击标题不触发切换。
```

</details>

**依据 2 · 作者声明**：[README.md:177-182](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/README.md#L177-L182)

作者说明上游概念与素材归属。

```text
## 灵感与素材来源

本插件的“滑动变祖”视觉概念与人物图片素材源自
[Lichtspektrum/liang-intensity-calibrator](https://github.com/Lichtspektrum/liang-intensity-calibrator)。插件在原项目 0–30 强度轴的基础上，将视觉变化接入 DeepSeek Harness 的推理等级选择。

运行时素材已包含在插件中，安装后不需要额外下载。当前接入 24 张经过审核的人像锚点，滑动时直接切换最近锚点，不做图片交叉渐变。
```

**依据 3 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/cordis.patch.yml#L1-L3)

bundle挂载原生插件。

```text
- insert:
    - id: liang-intensity-skin
      name: '@leon___/dsh-client-liang-intensity-skin'
```

#### 缺口

- 缺同任务原生菜单对照。
  **影响**：无法确认调档便利是否值得主题适配。
  **进一步探讨**：比较用户调档耗时、误选和保留意愿，不以截图替代。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 拖动、提交、同步和失败怎样对应真实档位？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

组件读取当前ModelDirectory的provider/model及reasoning.efforts，按列表次序映射视觉坐标，以最近位置选原始ID。onInput仅改本地预览；指针松开、键盘完成或交互失焦才commit。绑定关闭直接返回视觉状态，不调select；绑定开启则传原provider、model和target.id给官方directory.select。无推理或少于两个档位时隐藏绑定滑块，addressed subagent通过available=false不加载也不提交。

提交期间pending禁用控件，返回不接受时重置同步并回到最新已提交视觉值。createEffortSync把provider、model、完整有序ID与模式作为身份，防止模型切换后只按索引复用旧视觉；31停点模式保留一次本地外观以等待宿主确认。这些处理比把每次拖动直接写模型更可控，但宿主返回ok只说明选择操作被接受，不证明后续模型真实执行该档位。

关键限制是视觉轴并不表示推理能力的等距尺度。未知或不匹配的已提交档位会把effortFrame设到最大，以避免浅色闪烁；这是一项外观取舍，不能解释成当前真实选择最高档。细分模式也可能多个外观对应同一实际ID。用户必须依据原始档位名确认，不能从人物等级或深色界面推断模型变强。本轮未复现真实宿主异步竞态；只确认了源码中的防护与这些边界，未声称无错选。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/logic.ts:78-107](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/src/client/logic.ts#L78-L107)

等距映射、最近档位与selected ID解析。

<details>
<summary>查看原文（30行）</summary>

```text

export function frameForEffort(index: number, count: number): number {
  if (count <= 1 || !Number.isFinite(index)) return 0;
  const safe = Math.min(count - 1, Math.max(0, Math.round(index)));
  return Math.round((safe / (count - 1)) * PREVIEW_MAX_FRAME);
}

export function nearestEffortIndex(frame: number, efforts: readonly EffortLike[]): number {
  if (efforts.length === 0) return -1;
  const safe = clampFrame(frame);
  let best = 0;
  let distance = Math.abs(safe - frameForEffort(0, efforts.length));
  for (let index = 1; index < efforts.length; index += 1) {
    const next = Math.abs(safe - frameForEffort(index, efforts.length));
    if (next < distance) {
      best = index;
      distance = next;
    }
  }
  return best;
}

export function selectedEffortIndex(
  efforts: readonly EffortLike[],
  selectedId?: string,
  defaultId?: string,
): number {
  const id = selectedId ?? defaultId;
  return id === undefined ? -1 : efforts.findIndex((effort) => effort.id === id);
}
```

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:431-475](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/src/client/index.tsx#L431-L475)

未知档位最大视觉、完整身份与取消恢复。

<details>
<summary>查看原文（45行）</summary>

```text
  const reasoning = useMemo(() => modelReasoning(state), [state]);
  const efforts = reasoning?.efforts ?? [];
  const committedIndex = selectedEffortIndex(
    efforts,
    reasoning?.selection.reasoningEffort,
    reasoning?.defaultEffort,
  );
  // An unknown committed effort defaults to the max frame: a fresh
  // conversation paints the dark shell immediately instead of flashing the
  // light palette until the directory load resolves the real effort.
  const effortFrame = committedIndex < 0
    ? PREVIEW_MAX_FRAME
    : frameForEffort(committedIndex, efforts.length);
  const bindEffort = skin.bindEffort;
  const fine = bindEffort && skin.fineStopsEnabled;
  const committedFrame = fine ? snapFrame(effortFrame) : effortFrame;
  const modelKey = JSON.stringify([reasoning?.selection.provider, reasoning?.selection.model, efforts.map((effort) => effort.id)]);
  const selectionKey = JSON.stringify([modelKey, efforts[committedIndex]?.id ?? null]);
  const modeKey = JSON.stringify([modelKey, bindEffort, fine]);
  const sync = useRef(createEffortSync());
  const latest = useRef({ modelKey, committedFrame });
  latest.current = { modelKey, committedFrame };
  const running = useSessionRunning(session);
  const [frame, setFrame] = useState(() => bindEffort ? committedFrame : presenter.getFrame());
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const dragging = useRef(false);
  const dragStartFrame = useRef(frame);
  const dragStartSelection = useRef(selectionKey);
  const enabled = skin.enabled && available;

  const cancelInteraction = useCallback(() => {
    setInteracting(false);
    presenter.setPreviewing(false);
    dragging.current = false;
    const externalChange = bindEffort && dragStartSelection.current !== selectionKey;
    if (externalChange) {
      sync.current.reset();
      sync.current.observe({ key: selectionKey, mode: modeKey, frame: committedFrame, fine });
    }
    const restored = externalChange ? committedFrame : dragStartFrame.current;
    setFrame(restored);
    presenter.setFrame(restored);
  }, [bindEffort, selectionKey, modeKey, committedFrame, fine, presenter]);
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:507-547](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/src/client/index.tsx#L507-L547)

隐藏条件、绑定/纯视觉分支、原始ID提交及失败恢复。

<details>
<summary>查看原文（41行）</summary>

```text
  if (!enabled || skin.hideSlider) return null;
  if (bindEffort && (reasoning === null || efforts.length < 2)) return null;

  const previewIndex = nearestEffortIndex(frame, efforts);
  const previewEffort = efforts[previewIndex];
  const progressRatio = frame / PREVIEW_MAX_FRAME;
  const tooltipLabel = indicatorLabel(frame, bindEffort ? efforts : [], { withLevel: fine });



  const commit = async (rawFrame: number) => {
    if (!bindEffort) {
      dragging.current = false;
      setFrame(rawFrame);
      presenter.setFrame(rawFrame);
      return;
    }
    const fineFrame = fine ? snapFrame(rawFrame) : rawFrame;
    const targetIndex = nearestEffortIndex(fineFrame, efforts);
    const target = efforts[targetIndex];
    if (target === undefined) return;
    const targetFrame = fine ? fineFrame : frameForEffort(targetIndex, efforts.length);
    dragging.current = false;
    setFrame(targetFrame);
    presenter.setFrame(targetFrame);
    if (targetIndex === committedIndex || pending) return;
    if (fine) sync.current.submit(JSON.stringify([modelKey, target.id]), selectionKey, modeKey);
    setPending(true);
    setFailed(false);
    const accepted = await select({
      provider: reasoning.selection.provider,
      model: reasoning.selection.model,
      reasoningEffort: target.id,
    });
    setPending(false);
    if (!accepted) {
      sync.current.reset();
      setFailed(true);
      setFrame(latest.current.committedFrame);
      presenter.setFrame(latest.current.committedFrame);
    }
```

</details>

**依据 4 · 源码核查**：[src/client/index.tsx:588-627](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/src/client/index.tsx#L588-L627)

输入预览与结束提交。

<details>
<summary>查看原文（40行）</summary>

```text
        onPointerDown={() => {
          dragging.current = true;
          dragStartFrame.current = frame;
          dragStartSelection.current = selectionKey;
          setInteracting(true);
          presenter.setPreviewing(true);
        }}
        onInput={(event) => {
          dragging.current = true;
          const next = Number(event.currentTarget.value);
          setFrame(next);
          presenter.setFrame(next);
        }}
        onPointerUp={(event) => {
          setInteracting(false);
          presenter.setPreviewing(false);
          void commit(Number(event.currentTarget.value));
        }}
        onPointerCancel={cancelInteraction}
        onKeyUp={(event) => {
          setInteracting(false);
          presenter.setPreviewing(false);
          if (event.key !== "Escape") void commit(Number(event.currentTarget.value));
        }}
        onBlur={(event) => {
          setInteracting(false);
          presenter.setPreviewing(false);
          if (dragging.current) void commit(Number(event.currentTarget.value));
        }}
        onKeyDown={(event) => {
          if (!dragging.current) {
            dragStartFrame.current = frame;
            dragStartSelection.current = selectionKey;
          }
          setInteracting(true);
          presenter.setPreviewing(true);
          if (event.key === "Escape" && !pending) {
            event.preventDefault();
            cancelInteraction();
          }
```

</details>

**依据 5 · 源码核查**：[src/client/index.tsx:697-721](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/src/client/index.tsx#L697-L721)

addressed subagent隔离及官方directory.select。

<details>
<summary>查看原文（25行）</summary>

```text
  ctx.slots.inject("conversation.input.right", () => ctx.slots.register({
    name: "conversation.input.right",
    id: "liang-intensity-control",
    order: 10,
    inject: (sessionId: string) => {
      const available = ctx.sessions.subagentAddress(sessionId) === undefined;
      const directory = ctx.modelDirectories.directoryFor(sessionId) as ModelDirectory;
      const sessions = ctx.sessions as unknown as {
        scope?: (id: string) => unknown;
        sessionOf?: (scope: unknown) => SessionLike;
      };
      const sessionScope = sessions.scope?.(sessionId);
      const session = sessionScope === undefined ? undefined : sessions.sessionOf?.(sessionScope);
      return {
        available,
        session,
        directory: directory.store,
        presenter,
        scope,
        load: () => {
          if (available) void directory.load().catch(() => undefined);
        },
        select: (selection: ModelSelection) => available
          ? directory.select(selection).then((result) => result.ok, () => false)
          : Promise.resolve(false),
```

</details>

**依据 6 · 源码核查**：[src/client/effort-sync.ts:8-37](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/src/client/effort-sync.ts#L8-L37)

一次确认与宿主变化同步规则。

<details>
<summary>查看原文（30行）</summary>

```text
/** Preserve a local fine stop for one acknowledgement, then follow the host.
 * Keys include provider, model and the ordered effort IDs, never just an index.
 */
export function createEffortSync() {
  let observed: Selection | null = null;
  let submitted: { key: string; from: string; mode: string } | null = null;
  return {
    submit(key: string, from: string, mode: string) {
      submitted = { key, from, mode };
    },
    reset() { submitted = null; },
    observe(next: Selection): number | null {
      const changedMode = observed?.mode !== next.mode;
      if (changedMode) submitted = null;
      if (next.fine && submitted?.mode === next.mode) {
        if (submitted.key === next.key) {
          submitted = null;
          observed = next;
          return null;
        }
        // select() can finish before its observable catches up. Only keep the
        // old selection while it is exactly the one this submission replaced.
        if (submitted.from === next.key && observed?.key === next.key) return null;
        submitted = null;
      }
      const changed = changedMode || observed?.key !== next.key;
      observed = next;
      return !next.fine || changed ? next.frame : null;
    },
  };
```

</details>

**依据 7 · 源码核查**：[lib/client.js:2490-2522](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/lib/client.js#L2490-L2522)

构建运行文件确有目标ID提交与失败复位。

<details>
<summary>查看原文（33行）</summary>

```text
      presenter.setFrame(rawFrame);
      return;
    }
    const fineFrame = fine ? snapFrame(rawFrame) : rawFrame;
    const targetIndex = nearestEffortIndex(fineFrame, efforts);
    const target = efforts[targetIndex];
    if (target === void 0) return;
    const targetFrame = fine ? fineFrame : frameForEffort(targetIndex, efforts.length);
    dragging.current = false;
    setFrame(targetFrame);
    presenter.setFrame(targetFrame);
    if (targetIndex === committedIndex || pending) return;
    if (fine) sync.current.submit(JSON.stringify([modelKey, target.id]), selectionKey, modeKey);
    setPending(true);
    setFailed(false);
    const accepted = await select({
      provider: reasoning.selection.provider,
      model: reasoning.selection.model,
      reasoningEffort: target.id
    });
    setPending(false);
    if (!accepted) {
      sync.current.reset();
      setFailed(true);
      setFrame(latest.current.committedFrame);
      presenter.setFrame(latest.current.committedFrame);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      className: "liang-effort-control",
      "data-plugin": PACKAGE_ID,
```

</details>

#### 缺口

- 真实宿主模型切换、拒绝与异步确认未执行。
  **影响**：不能保证所有版本的视觉与实际选择时序一致。
  **进一步探讨**：固定宿主覆盖拖动中换模型、提交拒绝、隐藏控件及子agent寻址。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 加载、退出、更新和全周期成本有哪些条件？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

宿主端从白名单人物素材建立精确资源路由，仅GET/HEAD，支持ETag及Range，卸载时销毁活动流。浏览器需要会话、ModelDirectory、设置插槽和主题相关组件；源码与package均给出入口，但本轮未安装验收。总开关和外观偏好保存在浏览器localStorage，与宿主bundle启用状态分开；关闭视觉层不应被理解为恢复先前已经提交的模型档位。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web客户端插槽与ModelDirectory | 绑定调档必需 | 读当前模型并提交ID | 不兼容时不能凭皮肤出现推定调档有效 |
| 当前模型有至少两个reasoning.efforts | 绑定滑块必需 | 提供真实档位集合 | 不满足则隐藏绑定控件 |
| webServer与包内人物资源 | 皮肤显示必需 | 白名单精确路由 | 资源缺失走显示降级，实际可读需验收 |
| localStorage | 偏好持久化 | 保存开关及选项 | 受限时持久行为需核对 |
| 官方pluginManager | 内置更新才需 | 检查并安装明确版本 | 不可用则手动按宿主更新 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户按Web或Desktop选择独立profile并关冲突皮肤 | 不把Web安装视为Desktop已安装 |
| 加载 | 安装启用，按宿主要求完全重启 | 设置和人物资源出现，本轮未执行 |
| 核对 | 用户先核原生档位，再拖动并读回 | 真实ID符合意图，31停点不增加真实等级 |
| 退出 | 关闭总开关，核原生界面和实际模型档位 | 关闭皮肤不会撤销已选档位，必要时原生菜单恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 图像下载、宿主安装；金额未知 | 核profile、冲突与控件映射 | 原生Desktop兼容要实机检查 |
| 持续使用 | 图像与可选粒子/动态资源，调高实际档位可能影响模型费用 | 确认实际档位与文本对比度 | 视觉等级不代表token或计费尺度，费用未知 |
| 失败恢复 | 重载、重新选档或插件更新 | 区分选择拒绝、资源与样式问题 | 不应把视觉回退当模型结果回滚 |
| 退出 | 浏览器偏好可能保留 | 停用并复核宿主主题与实际档位 | 已发生模型调用不能撤回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可视化选档 | 原始ID映射及交互结束提交 | 用户是否更快或更少误选 |
| 外观与参数解耦 | 绑定开关、独立偏好和可选效果 | 用户是否理解纯视觉与真实状态 |
| 退出和更新 | 清理CSS/动画；更新按requestId核回结果 | 所有宿主下的完整恢复与更新兼容 |

更新器在安装前重读bundle身份、保留原enabled，异常后只用同requestId等待结果而不重复安装，最后再读已安装版本；这是可借鉴的结果未知处理。它仍依赖宿主官方接口，源码不应被写成已成功更新。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:32-51](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/src/index.js#L32-L51)

素材白名单生成，缺资源不入路由。

<details>
<summary>查看原文（20行）</summary>

```text
  const assetDirectory = fileURLToPath(new URL("../assets/", import.meta.url));
  const assets = new Map();
  for (const [name, type] of ASSET_SPECS) {
    const path = fileURLToPath(new URL(`../assets/${name}`, import.meta.url));
    try {
      const info = statSync(path);
      if (!info.isFile()) continue;
      assets.set(`${ASSET_PREFIX}${name}`, {
        path,
        type,
        size: info.size,
        etag: `W/\"${info.size.toString(16)}-${Math.trunc(info.mtimeMs).toString(16)}\"`,
      });
    } catch {
      // A missing optional medium is handled by the browser fallback chain.
    }
  }
  return { assetDirectory, assets };
}

```

</details>

**依据 2 · 源码核查**：[src/index.js:128-144](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/src/index.js#L128-L144)

宿主资源注册与活动流清理。

<details>
<summary>查看原文（17行）</summary>

```text
export function apply(ctx) {
  const { assets } = buildAssets();
  const activeStreams = new Set();
  ctx.effect(() => {
    const handler = createAssetHandler(assets, activeStreams);
    const unregister = [...assets.keys()].map((path) => ctx.webServer.register({
      kind: "exact",
      path,
      handler,
    }));
    return () => {
      for (const dispose of unregister) dispose();
      for (const stream of activeStreams) stream.destroy();
      activeStreams.clear();
    };
  }, "liang-intensity-skin: static media route");
}
```

</details>

**依据 3 · 源码核查**：[src/client/preferences.ts:25-44](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/src/client/preferences.ts#L25-L44)

开关独立键、绑定及可选效果默认值。

<details>
<summary>查看原文（20行）</summary>

```text

export const PREFERENCE_STORAGE_KEY = "dsh-liang-intensity-skin.settings.v1";
// Keep activation separate so older clients writing the option record cannot
// accidentally re-enable a skin that the user has switched off.
export const ENABLED_STORAGE_KEY = "dsh-liang-intensity-skin.enabled.v1";
const BIND_EFFORT_KEY = "dsh-liang-intensity-skin.bind-effort";
const MASK_KEY = "dsh-liang-intensity-skin.mask";

export const DEFAULT_SKIN_SETTINGS: Readonly<SkinSettings> = Object.freeze({
  enabled: true,
  bindEffort: true,
  maskEnabled: true,
  // Optional visual effects never enable one another or change reasoning.
  xianxiaPortraits: false,
  particlesEnabled: false,
  motionEnabled: false,
  fineStopsEnabled: false,
  hideSlider: false,
});

```

</details>

**依据 4 · 源码核查**：[src/client/index.tsx:382-399](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/src/client/index.tsx#L382-L399)

释放视觉资源与CSS变量。

<details>
<summary>查看原文（18行）</summary>

```text
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.unsubscribe();
    this.placementObserver.disconnect();
    if (this.raf !== 0) cancelAnimationFrame(this.raf);
    this.portraits.dispose();
    this.motion?.dispose();
    this.ambient?.dispose();
    window.removeEventListener("resize", this.syncParticleAnchors);
    this.particleCanvas?.remove();
    this.motion = null;
    this.ambient = null;
    this.root.remove();
    document.body.removeAttribute("data-liang-skin");
    delete document.body.dataset.liangStage;
    for (const name of cssVariables) document.body.style.removeProperty(name);
  }
```

</details>

**依据 5 · 源码核查**：[src/client/updater.ts:229-286](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/src/client/updater.ts#L229-L286)

更新身份复核、同requestId恢复、结果回读。

<details>
<summary>查看原文（58行）</summary>

```text
    if (disposed || busy || uncertain !== null || target === null || !snapshot.canInstall) return;
    busy = true;
    const checked = target;
    target = null;
    const manager = getManager();
    publish({ phase: "installing", busy: true, canInstall: false, error: null, managerAvailable: manager !== undefined });
    let dispatched = false;
    try {
      if (manager === undefined) { publish({ phase: "failed", busy: false, error: MANAGER_MISSING }); return; }
      const before = await readBundle(manager);
      if (disposed) return;
      if (before === null || !before.installable || before.identity !== checked.before.identity) {
        publish({ phase: "failed", busy: false, installedVersion: before?.version ?? null, error: "皮肤安装状态已变化，请重新检查更新。" });
        return;
      }
      if (compareSkinVersions(checked.version, newest(before)) <= 0) {
        publish({ phase: "current", busy: false, installedVersion: before.version, targetVersion: null, spec: null });
        return;
      }
      const requestId = crypto.randomUUID();
      let outcome: unknown;
      dispatched = true;
      try {
        outcome = unwrap(await manager.installBundle(checked.spec, { enabled: before.enabled, requestId }));
      } catch {
        if (disposed) return;
        // Read recovery once, using the same id. Never repeat installBundle.
        if (typeof manager.waitForInstall !== "function") { markUnknown(checked); return; }
        try {
          outcome = unwrap(await bounded(manager.waitForInstall(requestId)));
          if (outcome === null) { markUnknown(checked); return; }
        } catch { markUnknown(checked); return; }
      }
      if (disposed) return;
      const result = object(outcome);
      const application = result?.application;
      if (typeof result?.changed !== "boolean" || !["install", "enable"].includes(String(result.stage))
        || (result.target !== SKIN_PACKAGE && result.target !== checked.spec)
        || !["applied", "restart-required", "overridden", "failed", "cancelled"].includes(String(application))) {
        markUnknown(checked); return;
      }
      if (application === "failed") {
        publish({ phase: "failed", busy: false, error: refusal(object(result.error)?.code) });
        return;
      }
      if (application === "cancelled") {
        publish({ phase: "cancelled", busy: false, error: "更新已取消。" });
        return;
      }
      if (result.bundle !== SKIN_PACKAGE || (result.version !== undefined && result.version !== checked.version)) {
        markUnknown(checked); return;
      }
      let installed: Bundle | null;
      try { installed = await readBundle(manager); } catch { markUnknown(checked); return; }
      if (disposed) return;
      if (installed?.version !== checked.version) { markUnknown(checked); return; }
      publish({ phase: application as SkinUpdatePhase, busy: false, installedVersion: installed.version, canInstall: false,
        error: application === "overridden" ? "更新包已安装，但启用状态被其他配置覆盖，请在插件管理器核对。" : null });
```

</details>

#### 缺口

- 缺固定版本真机的资源、可读性与模型费用记录。
  **影响**：无法量化代价或承诺Desktop兼容。
  **进一步探讨**：在目标设备核对开关、原始ID及相同模型任务成本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么人可试用，如何验证状态表达假设？

**研究主题**：采用判断、新假设与验证

#### 完整回答

喜欢人物风格且经常切换推理档位、能够在原生选择器核对ID的DSH用户，可在一个非关键会话试用。先用原生菜单记录当前档位，分别试绑定与纯视觉模式，核对两档和多档模型；拖动中不应持续提交，完成交互才应改变实际值。再试31视觉停点、取消、隐藏滑块和addressed subagent，确认外观与真实值的区别。以上是建议，本轮没有操作真实宿主。

若人物遮挡、控件对比度不清、视效被误认为模型能力，或实际ID与预期不符，就关闭皮肤并回原生菜单确认档位。若宿主拒绝更新或结果未知，应按界面状态核对，不重复安装。对只需准确参数、不在意视觉的人，原生菜单已足够，不应为趣味强行加层。

可提出未验证的“双状态可见”假设：在滑块旁显式分开展示视觉级别、宿主已确认的原始档位和等待确认状态，未知时显示未确认而非借最大视觉暗示最高档。它相对当前标签和pending机制增加状态解释，可能减少31停点误解，但也可能造成界面冗余。

最小验证以固定模型列表安排未知选择、多外观同ID、拒绝及切换场景，对照当前界面和双状态界面，记录用户能否正确说出实际档位、误提交及操作时间。若正确理解没有改善或操作显著变慢，就否定或只在细分模式显示该设计；不能把它算成本插件已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:438-448](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/src/client/index.tsx#L438-L448)

未知选择采用最大视觉的具体来源。

<details>
<summary>查看原文（11行）</summary>

```text
  // An unknown committed effort defaults to the max frame: a fresh
  // conversation paints the dark shell immediately instead of flashing the
  // light palette until the directory load resolves the real effort.
  const effortFrame = committedIndex < 0
    ? PREVIEW_MAX_FRAME
    : frameForEffort(committedIndex, efforts.length);
  const bindEffort = skin.bindEffort;
  const fine = bindEffort && skin.fineStopsEnabled;
  const committedFrame = fine ? snapFrame(effortFrame) : effortFrame;
  const modelKey = JSON.stringify([reasoning?.selection.provider, reasoning?.selection.model, efforts.map((effort) => effort.id)]);
  const selectionKey = JSON.stringify([modelKey, efforts[committedIndex]?.id ?? null]);
```

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:517-547](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/src/client/index.tsx#L517-L547)

视觉与真实ID不一一对应，pending与拒绝。

<details>
<summary>查看原文（31行）</summary>

```text
  const commit = async (rawFrame: number) => {
    if (!bindEffort) {
      dragging.current = false;
      setFrame(rawFrame);
      presenter.setFrame(rawFrame);
      return;
    }
    const fineFrame = fine ? snapFrame(rawFrame) : rawFrame;
    const targetIndex = nearestEffortIndex(fineFrame, efforts);
    const target = efforts[targetIndex];
    if (target === undefined) return;
    const targetFrame = fine ? fineFrame : frameForEffort(targetIndex, efforts.length);
    dragging.current = false;
    setFrame(targetFrame);
    presenter.setFrame(targetFrame);
    if (targetIndex === committedIndex || pending) return;
    if (fine) sync.current.submit(JSON.stringify([modelKey, target.id]), selectionKey, modeKey);
    setPending(true);
    setFailed(false);
    const accepted = await select({
      provider: reasoning.selection.provider,
      model: reasoning.selection.model,
      reasoningEffort: target.id,
    });
    setPending(false);
    if (!accepted) {
      sync.current.reset();
      setFailed(true);
      setFrame(latest.current.committedFrame);
      presenter.setFrame(latest.current.committedFrame);
    }
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:697-721](https://github.com/kingOfSoySauce/dsh-liang-skin/blob/dcd348e0bec148af45bc0b1a8f33ef82c44aeeef/src/client/index.tsx#L697-L721)

子agent限制与实际选择接口。

<details>
<summary>查看原文（25行）</summary>

```text
  ctx.slots.inject("conversation.input.right", () => ctx.slots.register({
    name: "conversation.input.right",
    id: "liang-intensity-control",
    order: 10,
    inject: (sessionId: string) => {
      const available = ctx.sessions.subagentAddress(sessionId) === undefined;
      const directory = ctx.modelDirectories.directoryFor(sessionId) as ModelDirectory;
      const sessions = ctx.sessions as unknown as {
        scope?: (id: string) => unknown;
        sessionOf?: (scope: unknown) => SessionLike;
      };
      const sessionScope = sessions.scope?.(sessionId);
      const session = sessionScope === undefined ? undefined : sessions.sessionOf?.(sessionScope);
      return {
        available,
        session,
        directory: directory.store,
        presenter,
        scope,
        load: () => {
          if (available) void directory.load().catch(() => undefined);
        },
        select: (selection: ModelSelection) => available
          ? directory.select(selection).then((result) => result.ok, () => false)
          : Promise.resolve(false),
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
