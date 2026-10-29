# Reasoning Effort

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[7aea9d9](https://github.com/HanaAyane/dsh-reasoning-effort/tree/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16)

<!-- BEGIN META -->
[![GitHub ★ 256](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=256&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HanaAyane/dsh-reasoning-effort) [![npm 30d 904](https://img.shields.io/static/v1?label=npm+30d&message=904&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ayanehana/dsh-reasoning-effort) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ayanehana/dsh-reasoning-effort)
<!-- END META -->

> **功能**：在 DSH 原生模型入口加入随模型目录档位变化的推理滑块，并提供自定义模型配置指引。

> **亮点**：把模型定义档位变成连续拖动但离散提交的界面，并用目录真值和投影确认抵御过期选择；保留原生搜索与退出路径，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

> **主要限制**：原生React树包装存在升级耦合，本地abort不能取消已发送选择；界面回滚不代表服务器撤销。档位声明、选择成功和模型任务质量是三个层次，见 [Q02](#research-q02)。

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
  - [Q01 · 用户获得的是新推理能力，还是原生选择的另一种界面？](#detail-section-11)
  - [Q02 · 滑块何时提交、如何确认和处理切换竞争？](#detail-section-12)
  - [Q03 · 何时值得试用，设置指引和后续方向的边界是什么？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：匹配RC的DSH用户在同一模型多档间频繁切换时，可试用滑块操作；目标是准确选择已有档位，见 [Q01](#research-q01)。

原生模型菜单、推理档位与/model已能完成选择。本组件增量在交互、预览、同步反馈及设置指引，不提供新的模型推理能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 档位滑块 | 快速选择模型目录已有档位 | 不创造模型能力、不保证效果 |
| 投影确认 | 复核select后的当前状态 | 远端RPC不能本地撤销 |
| 配置指引 | 定位用户自定义模型声明 | 不自动落档位值，模板需端点验证 |

**流程与依赖**

| 依赖 | 条件与用途 | 不满足时 |
|---|---|---|
| DSH RC与Web/Desktop profile | 当前声明>=0.2.1-rc.2 <0.3.0，profile独立 | rc.3作者也未实测，不能泛化未来RC |
| 原生modelSelection/session/slot服务 | 会话目录、选择和界面包装 | 不匹配可隐藏或降级，需回原生 |
| 当前目录至少两档 | 决定滑块值、名称和顺序 | 提示配置，不能强造能力 |
| settings/llm与端点文档 | 自定义模型指引 | 模板不是API接受的证据 |

| 步骤 | 动作 | 确认与恢复 |
|---|---|---|
| 准备 | 匹配包/profile并重启 | 检查实际菜单和目录 |
| 调整 | 拖动预览、释放提交档位ID | 刷新路由并验证支持集合 |
| 确认 | 等select成功与目录投影 | 不能仅看动画或RPC回包 |
| 竞争/失败 | 提示不明并同步当前目录 | 查询实际值，本地取消不撤RPC |
| 退出 | 关闭滑块开关 | 恢复自身包装的原生入口 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与时间 |
|---|---|---|
| 首次 | 插件未引入新模型服务，金额未知 | 安装/profile/重启、目录核对耗时未知 |
| 持续 | 实际模型/档位计费未知 | 原生slot与树结构兼容维护 |
| 异常 | 迟到选择的资源影响未知 | 比对目录、请求、竞争插件和配置 |
| 退出 | 不要求模型迁移 | 关闭滑块恢复原生，配置另备份 |

| 效果项 | 支持范围 | 未知 |
|---|---|---|
| 操作便利 | 动态离散滑块和预览 | 是否更快、更少误选 |
| 状态可信度 | 目录投影才确认 | 实际端点参数与迟到请求结果 |
| 推理效果 | 无新推理机制 | 质量、节费、节时均未实测 |

> **思考**：原生React树包装存在升级耦合，本地abort不能取消已发送选择；界面回滚不代表服务器撤销。档位声明、选择成功和模型任务质量是三个层次，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把模型定义档位变成连续拖动但离散提交的界面，并用目录真值和投影确认抵御过期选择；保留原生搜索与退出路径，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

捕获档位ID而非位置、刷新后复核、等目录投影比乐观显示可靠。需保留本地取消与远端撤销的区别，并对React树包装安排升级回归，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

原生React树包装存在升级耦合，本地abort不能取消已发送选择；界面回滚不代表服务器撤销。档位声明、选择成功和模型任务质量是三个层次，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

匹配RC且目录已有多档的个人会话可试用；先比较原生/model最终值，再看端点请求。不支持或入口冲突时关闭恢复原生，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码已确认目录驱动、会话选择和投影确认，建议有试用操作便利；未运行宿主或请求端，不承诺质量、成本和未来RC兼容。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/effort-selection.ts、src/client/index.tsx、src/client/native-selector.tsx、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整根组件统计，抽读发布配置、Host诊断/读取接口、客户端slot接线、原生树包装、档位选择和提交恢复；未完整审计知识库条目和样式，不执行构建或目标。
- 下一步：在固定宿主对原生菜单与滑块比较误选、耗时、键盘操作；覆盖切模型/会话、外部/model、迟到RPC、不支持档位与插件禁用，核对实际端点请求及配置文件变化。本轮仅静态核查。

**分析版本**

- **仓库**：[HanaAyane/dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort)
- **版本号**：0.9.1（[固定提交 7aea9d9](https://github.com/HanaAyane/dsh-reasoning-effort/tree/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

宿主可提供稳定推理页扩展点和确认/提交/不明状态，减少树包装。用误选率、切档耗时与升级回归成本对照原生菜单，无收益则停止，见 [Q03](#research-q03)。

在固定宿主对原生菜单与滑块比较误选、耗时、键盘操作；覆盖切模型/会话、外部/model、迟到RPC、不支持档位与插件禁用，核对实际端点请求及配置文件变化。本轮仅静态核查。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 1501 | — | — | 18620 |
| .js | source | 3 | 2758 | 2620 | 231 | — |
| .mjs | source | 3 | 531 | 484 | 12 | — |
| .ts | source | 6 | 1721 | 1471 | 177 | — |
| .tsx | source | 2 | 1490 | 1328 | 65 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/HanaAyane/dsh-reasoning-effort/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/HanaAyane/dsh-reasoning-effort/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/HanaAyane/dsh-reasoning-effort/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：滑块是否真实提交并确认原生档位，操作收益与宿主耦合如何界定？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户获得的是新推理能力，还是原生选择的另一种界面？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

这是DSH原生插件@ayanehana/dsh-reasoning-effort 0.9.1，声明DSH >=0.2.1-rc.2 <0.3.0和Node>=22.19。面向经常在同一模型的多个推理档之间切换、偏好滑块操作的Web/Desktop用户；目标是更容易准确选择现有档位，不是提高模型智力。README明确rc.3仅基于上游变更更新支持说明，未运行验证；本轮也未运行。桌面与Web有独立安装profile，不可混用。

相对原生菜单和/model，贡献是复用原生模型搜索和菜单，在推理页加入模型定义的离散滑块、键盘操作、可选动画和设置指引。sliderLevels只取当前目录reasoning.efforts，少于两档不给滑块；档位名称和顺序不能任意发明，也不保证不同端点一致。目录元数据只证明适配器声明，缺档位不等于端点不支持，声明档位也不等于端点接受或效果变好。因此不把动画速度、档位高低映射为质量/节费结论。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:32-50](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/package.json#L32-L50)

发布包、宿主、Node及入口。

<details>
<summary>查看原文（19行）</summary>

```text
    "node": ">=22.19",
    "dsh": ">=0.2.1-rc.2 <0.3.0"
  },
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/client/index.d.ts",
      "default": "./lib/client/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./icon": "./assets/icon.png",
    "./locale/*.json": "./locale/*.json",
```

</details>

**依据 2 · 源码核查**：[README.md:41-55](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/README.md#L41-L55)

RC支持声明，rc.3明确未实测。

<details>
<summary>查看原文（15行）</summary>

```text
## 版本支持政策

本插件仅针对相对稳定的 **DSH RC 版本**进行适配、测试和问题修复，**不单独维护 alpha 版本**。alpha 阶段的客户端 API、依赖结构和插件加载机制可能频繁发生破坏性变更；持续兼容多个过渡版本会增加维护成本，也难以保证可靠性。

当前发行版为 **插件 `v0.9.1`**，支持 DSH `0.2.1-rc.2` 和 `0.2.1-rc.3`，最低版本仍为 `0.2.1-rc.2`，适用于 Web 和 Desktop Profile。DSH `0.2.0` RC 用户请继续使用 [v0.8.1](https://github.com/HanaAyane/dsh-reasoning-effort/releases/tag/v0.8.1)。桌面端使用 DSH 的 Web 客户端界面，但有独立的插件安装与激活状态。DSH `0.1.x` 用户请继续使用 [v0.7.3](https://github.com/HanaAyane/dsh-reasoning-effort/releases/tag/v0.7.3)。RC 仍属于候选发布版本，不代表所有历史或未来 RC 都自动兼容。

| 项目 | 当前说明 |
| --- | --- |
| 插件发行版 | [v0.9.1](https://github.com/HanaAyane/dsh-reasoning-effort/releases/tag/v0.9.1) |
| Web | DSH `0.2.1-rc.2`、`0.2.1-rc.3`；使用 `web` Profile |
| 桌面端 | DSH Desktop `0.2.1-rc.2`、`0.2.1-rc.3`；使用 `desktop` Profile |
| 升级说明 | 安装 `v0.9.1` 后重新启动对应的 Web Host 或桌面应用 |
| alpha 版本 | 不单独适配，请自行临时修复或切换至目标 RC |

DSH [`0.2.1-rc.3`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.1-rc.3) 继续使用插件 `v0.9.1`。本次根据上游变更更新支持说明，未进行 `rc.3` 的运行验证。
```

</details>

**依据 3 · 源码核查**：[README.md:127-141](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/README.md#L127-L141)

独立profile及目录能力边界。

<details>
<summary>查看原文（15行）</summary>

```text
桌面端使用独立的 `desktop` Profile；安装在 `web` Profile 的插件不会自动出现在桌面端。若终端提示 `profile "desktop" is managed exclusively by the Electron application`，说明当前 CLI 不允许管理 Desktop Profile，请改用上述应用内入口，不要修改 Profile 名称或绕过限制。参见 [DSH Desktop 官方说明](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.1-rc.2/apps/desktop/README.zh.md#installation-ownership)。

## 档位从哪里来

滑块读取当前模型在 DSH 模型目录中公开的 `reasoning.efforts`。档数、名称和顺序由模型与路由决定，并非固定三档，也不保证不同端点提供相同档位。

模型公开至少两档时显示滑块；不足两档时显示提示。插件提交目录中的档位值，由 DSH 校验和发送，不会绕过模型或部署的能力限制。

## 给任意自定义模型声明档位

这一节与厂商无关，适用于你在 `llm-pi-ai` 里自己声明的任何模型。

**为什么读不到档位**：DSH 的模型目录只报告适配器声明的能力。没有继承内置目录元数据的自定义模型，需要显式声明 `reasoningEfforts` 才能公开档位；目录没有档位并不证明端点不能推理。

**优先使用图形界面**：**设置 → 模型 → 编辑提供商 → 自定义设置 → 模型选项（›）→ 推理等级**，按端点文档填写档位与 API 参数值。
```

</details>

**依据 4 · 源码核查**：[src/client/effort-selection.ts:12-20](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/src/client/effort-selection.ts#L12-L20)

直接读取当前模型目录档位。

```text
export function currentModel(state: ModelDirectoryState) {
  const current = state.current
  return state.groups.find((group) => group.id === current?.provider)
    ?.models.find((model) => model.id === current?.model)
}

export function sliderLevels(state: ModelDirectoryState): readonly EffortLevel[] {
  const efforts = currentModel(state)?.reasoning?.efforts
  return efforts !== undefined && efforts.length >= 2 ? efforts : []
```

**依据 5 · 源码核查**：[src/client/native-selector.tsx:25-57](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/src/client/native-selector.tsx#L25-L57)

在原生菜单树中插入推理面板。

<details>
<summary>查看原文（33行）</summary>

```text
export function wrapNativeSelector(Native: (props: NativeProps) => ReactNode, renderPanel: (props: NativeProps) => ReactNode) {
  return function NativeReasoningSelector(props: NativeProps) {
    const [effort, setEffort] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)
    // Always invoke the same native function, including all its hooks.
    const native = Native(props)
    let menuOpen = false
    const output = mapNativeTree(native, element => {
      if (element.props['aria-label'] !== props.t('menu.aria') || !Array.isArray(element.props.children)) return element
      const panes = element.props.children
      if (panes.length !== 3) return element
      menuOpen = true
      if (effort) return cloneElement(element, { role: 'group' },
        <div className="re-native-pane" ref={panelRef} tabIndex={-1} onBlur={event => {
          // Disabling the focused range during submission produces a blur with
          // no next target. Do not let the host interpret this as leaving the menu.
          // Outside clicks still close through the native document listener.
          if (event.relatedTarget === null) event.stopPropagation()
        }} onKeyDown={event => {
          if (event.key === 'Escape' || (event.key === 'Tab' && event.shiftKey && event.target === event.currentTarget)) {
            event.preventDefault(); event.stopPropagation(); setEffort(false)
          }
        }}>
          {renderPanel(props)}
        </div>)
      const root = panes[0]
      if (!isValidElement<{ children: ReactNode[] }>(root) || !Array.isArray(root.props.children)) return element
      const [modelRow, effortRow] = root.props.children
      if (!isValidElement<ElementProps>(modelRow)) return element
      const row = isValidElement<ElementProps>(effortRow)
        ? cloneElement(effortRow, { onClick: () => setEffort(true) })
        : cloneElement(modelRow, { key: 'reasoning-effort', ref: null, disabled: props.locked, onClick: () => setEffort(true) } as ElementProps,
            <span>{props.t('menu.effort')}</span>, <span aria-hidden="true">›</span>)
```

</details>

#### 缺口

- 未验证固定宿主与实际提供商档位映射。
  **影响**：不据此承诺实际宿主或模型端效果。
  **进一步探讨**：固定rc.2宿主和一条明确支持档位的路由，核对目录及原生/model状态。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 滑块何时提交、如何确认和处理切换竞争？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

客户端按会话拿modelSelection controller，子Agent会话不可选；优先找到原生model slot并包装，未找到时注册低优先级替代入口。包装依赖原生React树的aria-label、三段panes和行结构，这不是稳定推理页扩展API；slot存在但树形变化时包装可能没有实际滑块，而五秒兼容提示只是提示并不自动检测冲突。

拖动预览与提交分开，commit捕获provider/model和档位ID，selectEffort先load刷新目录并复核当前模型、旧档位、pending与支持集合，再调用directory.select。RPC返回ok仍不足成功，等目录ready、无pending、当前档位匹配才确认，五秒不明则报错。切模型或新选择可中止本地等待，finally恢复按当前目录同步；这比把滑块位置直接当保存值更可靠。重要限制是abortable明确不能撤回已发送RPC，所谓失败回滚是界面以目录真值恢复，并不承诺服务器取消或旧档位恢复。源码到此只证实选择API，不能直接证明供应商请求载荷或推理质量。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:601-642](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/src/client/index.tsx#L601-L642)

捕获ID、提交、确认及失败后恢复同步。

<details>
<summary>查看原文（42行）</summary>

```text
  const commit = useCallback(async (raw: number) => {
    if (committingRef.current || busy || directoryState.current === null) return
    const index = clampIndex(raw, levels.length)
    const next = levels[index]?.id
    if (next === undefined) return
    const target = {
      provider: directoryState.current.provider,
      model: directoryState.current.model,
      reasoningEffort: next,
    }
    const operation = new AbortController()
    selectionAbortRef.current = operation
    committingRef.current = true
    setDragging(false)
    setCommitting(true)
    setLocalError(null)
    previewRef.current = index
    setPreview(index)
    setEffort(next)

    try {
      const confirmed = await selectEffort(directory, target, operation.signal, t)
      if (selectionAbortRef.current !== operation) return
      const confirmedIndex = effortIndex(sliderLevels(confirmed), next)
      committedRef.current = next
      previewRef.current = confirmedIndex
      setEffort(next)
      setPreview(confirmedIndex)
    } catch (cause) {
      if (!operation.signal.aborted) {
        setLocalError(cause instanceof Error ? cause.message : String(cause))
      }
    } finally {
      if (selectionAbortRef.current === operation) {
        selectionAbortRef.current = null
        committingRef.current = false
        // Synchronization below resumes with the current directory, including
        // after a failed selection or a route change during the round-trip.
        if (!operation.signal.aborted) setCommitting(false)
      }
    }
  }, [directory, directoryState.current, levels, busy, t])
```

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:1347-1353](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/src/client/index.tsx#L1347-L1353)

会话controller与子Agent限制。

```text
      const canSelect = () => sessions.subagentAddress(sessionId as SessionId) === undefined
      return {
        available: canSelect(), controller, directory: controller.store,
        load: () => canSelect() ? controller.load().then(() => undefined, () => undefined) : undefined,
        select: (selection: ModelSelection) => canSelect()
          ? controller.select(selection).then(result => result.ok, () => false) : Promise.resolve(false),
        adapt,
```

**依据 3 · 源码核查**：[src/client/index.tsx:1377-1403](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/src/client/index.tsx#L1377-L1403)

原生slot包装与fallback入口。

<details>
<summary>查看原文（27行）</summary>

```text
        const entry = ctx.slots.entries?.(SLOT).find(entry => entry.locale === 'model'
          && entry.children?.['conversation.input.model.label'] !== undefined
          && typeof entry.component === 'function')
        if (entry) {
          fallback?.(); fallback = undefined
          nativeEntry = entry
          const original = entry.component
          function BoundNativeEffortPanel(props: Parameters<Parameters<typeof wrapNativeSelector>[0]>[0]) {
            const sessionId = props.sessionId as string
            // Native directory snapshots rerender the wrapper. Keep callback
            // identities stable or the panel's load effect feeds back into it.
            const injected = useMemo(() => inject(sessionId), [sessionId, props.directory])
            return <NativeEffortPanel {...injected}
              available={sessions!.subagentAddress(sessionId as SessionId) === undefined}
              locked={props.locked} t={ctx.locale.bind(NS)} />
          }
          const wrapped = wrapNativeSelector(original as Parameters<typeof wrapNativeSelector>[0], props => (
            <BoundNativeEffortPanel {...props} />
          ))
          entry.component = wrapped
          restore = () => {
            if (entry.component === wrapped) { entry.component = original; notify() }
          }
          notify()
        } else if (!fallback) {
          fallback = ctx.slots.register({ name: SLOT, priority: -100, locale: NS, inject }, AdvancedModelSelect)
        }
```

</details>

**依据 4 · 源码核查**：[src/client/native-selector.tsx:29-57](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/src/client/native-selector.tsx#L29-L57)

依赖原生树特征。

<details>
<summary>查看原文（29行）</summary>

```text
    // Always invoke the same native function, including all its hooks.
    const native = Native(props)
    let menuOpen = false
    const output = mapNativeTree(native, element => {
      if (element.props['aria-label'] !== props.t('menu.aria') || !Array.isArray(element.props.children)) return element
      const panes = element.props.children
      if (panes.length !== 3) return element
      menuOpen = true
      if (effort) return cloneElement(element, { role: 'group' },
        <div className="re-native-pane" ref={panelRef} tabIndex={-1} onBlur={event => {
          // Disabling the focused range during submission produces a blur with
          // no next target. Do not let the host interpret this as leaving the menu.
          // Outside clicks still close through the native document listener.
          if (event.relatedTarget === null) event.stopPropagation()
        }} onKeyDown={event => {
          if (event.key === 'Escape' || (event.key === 'Tab' && event.shiftKey && event.target === event.currentTarget)) {
            event.preventDefault(); event.stopPropagation(); setEffort(false)
          }
        }}>
          {renderPanel(props)}
        </div>)
      const root = panes[0]
      if (!isValidElement<{ children: ReactNode[] }>(root) || !Array.isArray(root.props.children)) return element
      const [modelRow, effortRow] = root.props.children
      if (!isValidElement<ElementProps>(modelRow)) return element
      const row = isValidElement<ElementProps>(effortRow)
        ? cloneElement(effortRow, { onClick: () => setEffort(true) })
        : cloneElement(modelRow, { key: 'reasoning-effort', ref: null, disabled: props.locked, onClick: () => setEffort(true) } as ElementProps,
            <span>{props.t('menu.effort')}</span>, <span aria-hidden="true">›</span>)
```

</details>

**依据 5 · 源码核查**：[src/client/effort-selection.ts:35-48](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/src/client/effort-selection.ts#L35-L48)

本地abort不能取消已发送RPC。

<details>
<summary>查看原文（14行）</summary>

```text
/** Stop waiting locally; the directory API cannot cancel an already-sent RPC. */
function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason)
    signal.addEventListener('abort', abort, { once: true })
    promise.then(
      (value) => { signal.removeEventListener('abort', abort); resolve(value) },
      (error: unknown) => { signal.removeEventListener('abort', abort); reject(error) },
    )
    if (signal.aborted) {
      signal.removeEventListener('abort', abort)
      abort()
    }
  })
```

</details>

**依据 6 · 源码核查**：[src/client/effort-selection.ts:73-95](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/src/client/effort-selection.ts#L73-L95)

目录投影确认和五秒超时。

<details>
<summary>查看原文（23行）</summary>

```text
    const check = () => {
      if (signal.aborted) return abort()
      const state = directory.store.getSnapshot()
      if (state.pending !== null && (
        !sameModel(state.pending, target) || state.pending.reasoningEffort !== target.reasoningEffort
      )) {
        finish(undefined, new Error(t('effort.selectionChanged')))
      } else if (state.current !== null && !sameModel(state.current, target)) {
        finish(undefined, new Error(t('effort.modelChanged')))
      } else if (state.status === 'error') {
        finish(undefined, new Error(state.error ?? t('effort.unconfirmed')))
      } else if (sameModel(state.current, target) && state.status === 'ready' && state.pending === null) {
        if (effortIndex(currentModel(state)?.reasoning?.efforts ?? [], target.reasoningEffort) < 0) {
          finish(undefined, new Error(t('effort.unsupported', { effort: target.reasoningEffort })))
        } else if (state.current?.reasoningEffort === target.reasoningEffort) {
          finish(state)
        }
      }
    }
    unsubscribe = directory.store.subscribe(check)
    signal.addEventListener('abort', abort, { once: true })
    timer = setTimeout(() => finish(undefined, new Error(t('effort.unconfirmed'))), timeoutMs)
    check()
```

</details>

**依据 7 · 源码核查**：[src/client/effort-selection.ts:107-133](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/src/client/effort-selection.ts#L107-L133)

刷新复核后select。

<details>
<summary>查看原文（27行）</summary>

```text
  signal.throwIfAborted()
  const initial = directory.store.getSnapshot()
  const originalEffort = initial.current?.reasoningEffort
  if (!sameModel(initial.current, target)) throw new Error(t('effort.modelChanged'))
  if (initial.status === 'loading' || initial.status === 'selecting' || initial.pending !== null) {
    throw new Error(t('effort.busy'))
  }

  const fresh = await abortable(directory.load(), signal)
  signal.throwIfAborted()
  // load() returns a snapshot; a newer selection can start before this continuation.
  for (const state of [fresh, directory.store.getSnapshot()]) {
    if (!sameModel(state.current, target)) throw new Error(t('effort.modelChanged'))
    if (state.status === 'error') throw new Error(state.error ?? t('effort.unconfirmed'))
    if (state.status !== 'ready' || state.pending !== null) throw new Error(t('effort.busy'))
    if (state.current?.reasoningEffort !== originalEffort) {
      throw new Error(t('effort.selectionChanged'))
    }
    if (effortIndex(currentModel(state)?.reasoning?.efforts ?? [], target.reasoningEffort) < 0) {
      throw new Error(t('effort.unsupported', { effort: target.reasoningEffort }))
    }
  }

  const result = await abortable(directory.select(target), signal)
  signal.throwIfAborted()
  if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`)
  return waitForSelection(directory, target, signal, t, timeoutMs)
```

</details>

**依据 8 · 源码核查**：[src/client/index.tsx:1224-1254](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/src/client/index.tsx#L1224-L1254)

五秒提示没有冲突探测。

<details>
<summary>查看原文（31行）</summary>

```text
function ReasoningEffortSetting({ t }: PropsLocale<typeof NS>) {
  const enabled = useSyncExternalStore(enabledStore.subscribe, enabledStore.getSnapshot)
  const [showCompatibilityHint, setShowCompatibilityHint] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setShowCompatibilityHint(false)
      return
    }
    if (!showCompatibilityHint) return
    const timer = window.setTimeout(() => setShowCompatibilityHint(false), 5000)
    return () => window.clearTimeout(timer)
  }, [enabled, showCompatibilityHint])

  return (
    <div className="re-setting-row">
      <div className="re-setting-copy">
        <div className="re-setting-title">{t('settings.effort.title')}</div>
        <div className="re-setting-description">{t('settings.effort.description')}</div>
        {enabled && showCompatibilityHint && <div className="re-setting-description" role="status">{t('settings.effort.compatibility')}</div>}
      </div>
      <div className="re-setting-control">
        <button
          type="button"
          role="switch"
          aria-label={t('settings.effort.aria')}
          aria-checked={enabled}
          className="re-setting-switch"
          onClick={() => {
            setShowCompatibilityHint(!enabled)
            enabledStore.set(!enabled)
```

</details>

#### 缺口

- 未运行竞争选择、迟到响应和端点发包。
  **影响**：不据此承诺实际宿主或模型端效果。
  **进一步探讨**：切模型/会话、模拟慢响应和外部/model改档，核对最终目录及实际请求参数而非只看滑块。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时值得试用，设置指引和后续方向的边界是什么？

**研究主题**：效果与总成本、采用判断、缺陷与关键质疑、新假设与验证

#### 完整回答

建议在匹配RC、目录已有至少两档、没有竞争模型入口插件的个人会话试用，收益限于操作便利。首次要确认官方作用域包、profile、宿主版本并重启对应Host；持续无需新模型或额外服务，但要承担原生slot与树结构升级适配。模型费仍由实际路由/档位决定，现金与节时收益未知；不支持的自定义配置还要核对端点文档、备份和手动配置，失败需排查目录、插件冲突和请求参数。可关闭滑块开关恢复原生入口，不必以卸载或模型迁移为退出前提。

Host需要settings/llm，诊断读取用户自定义模型配置和resolveModelInfo，并返回设置文档路径、可复制声明；answer只开放diagnose/store读取，不自动写模型配置。prepareDocument服务的内部行为本轮未检查，不宜把“只读指引”说成完全无文件副作用，但没有自动替用户落档位值的接线。知识库或模板不能取代端点实证。

可证伪方向是宿主提供稳定推理页扩展点和“当前已确认/正在提交/结果不明”语义，插件只声明离散档位呈现。以原生菜单为基线，记录误选、完成切档时间、无障碍操作和升级回归成本；若滑块没有降低误选或增加理解/维护负担，就保留原生。该方向来自树包装耦合与异步确认的实际代价，尚不是现成能力或用户需求证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:285-307](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/src/index.ts#L285-L307)

读取设置、准备文档路径和目录信息。

<details>
<summary>查看原文（23行）</summary>

```text
  const usesProfileConfig = typeof settingsService.register !== 'function'

  const store = settingsService.register?.(STORE_NS, StoreSchema)

  const readStore = (): StoreShape => {
    const value = store?.get() ?? config
    return isRecord(value) ? (value as unknown as StoreShape) : {}
  }

  /** The active configuration document path, memoized. */
  let settingsPathPromise: Promise<string | undefined> | undefined
  const settingsPath = (): Promise<string | undefined> => {
    settingsPathPromise ??= settingsService.prepareDocument().catch(() => undefined)
    return settingsPathPromise
  }

  /** Current directory levels for one model; [] when the model offers none. */
  async function currentLevels(provider: string, model: string): Promise<string[]> {
    try {
      const info = await llmService.resolveModelInfo(provider, model)
      return (info.reasoning?.efforts ?? []).map((effort) => effort.id)
    } catch {
      return []
```

</details>

**依据 2 · 源码核查**：[src/index.ts:311-325](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/src/index.ts#L311-L325)

读取用户声明模型条目。

<details>
<summary>查看原文（15行）</summary>

```text
  /** Whether the model appears in the user's own llm-pi-ai models list. */
  function userDeclaredModel(provider: string, model: string): { declared: boolean; entryLine: string; entry: JsonObject | undefined } {
    const descriptor = settingsService.describe().find((row) => row.ns === LLM_NS)
    const providers = isRecord(descriptor?.user) && isRecord((descriptor?.user as JsonObject).providers)
      ? (descriptor?.user as JsonObject).providers as JsonObject
      : {}
    const route = isRecord(providers[provider]) ? providers[provider] as JsonObject : undefined
    const models = route !== undefined && Array.isArray(route.models) ? (route.models as JsonObject[]) : undefined
    const entry = models?.find((candidate) => isRecord(candidate) && candidate.id === model)
    return {
      declared: entry !== undefined,
      entryLine: entry === undefined
        ? `- id: ${model}`
        : `- id: ${model}${typeof entry.name === 'string' && entry.name.length > 0 ? `  # ${entry.name}` : ''}`,
      entry,
```

</details>

**依据 3 · 源码核查**：[src/index.ts:414-433](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/src/index.ts#L414-L433)

只开放diagnose/store答复。

<details>
<summary>查看原文（20行）</summary>

```text
  async function answer(endpoint: string, payload: unknown): Promise<JsonObject> {
    switch (endpoint) {
      case 'diagnose': {
        const request = isRecord(payload) ? payload : {}
        const provider = typeof request.provider === 'string' ? request.provider : ''
        const model = typeof request.model === 'string' ? request.model : ''
        if (provider.length === 0 || model.length === 0) {
          return failResult('invalid-request', 'provider and model are required')
        }
        try {
          return okResult(await diagnose(provider, model))
        } catch (error) {
          return failResult('diagnose-failed', `diagnose failed: ${error instanceof Error ? error.message : String(error)}`)
        }
      }
      case 'store':
        return okResult({ entries: readStore().entries ?? [] })
      default:
        return failResult('not-found', `unknown endpoint ${JSON.stringify(endpoint)}`)
    }
```

</details>

**依据 4 · 源码核查**：[src/client/index.tsx:1369-1372](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/src/client/index.tsx#L1369-L1372)

关闭恢复入口。

```text
        if (!enabledStore.getSnapshot()) {
          restore?.(); restore = undefined
          fallback?.(); fallback = undefined
          return
```

**依据 5 · 源码核查**：[src/client/index.tsx:1396-1412](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/src/client/index.tsx#L1396-L1412)

仅自身包装时恢复及销毁。

<details>
<summary>查看原文（17行）</summary>

```text
          entry.component = wrapped
          restore = () => {
            if (entry.component === wrapped) { entry.component = original; notify() }
          }
          notify()
        } else if (!fallback) {
          fallback = ctx.slots.register({ name: SLOT, priority: -100, locale: NS, inject }, AdvancedModelSelect)
        }
      } finally { syncing = false }
    }
    const stopWatching = ctx.on('slots/changed', key => { if (key === SLOT) sync() })
    const unsubscribe = enabledStore.subscribe(sync)
    sync()
    return () => {
      stopped = true
      unsubscribe(); stopWatching()
      restore?.(); fallback?.()
```

</details>

**依据 6 · 源码核查**：[README.md:139-148](https://github.com/HanaAyane/dsh-reasoning-effort/blob/7aea9d9ddef74dc9823dcc725e7d2bf344e99e16/README.md#L139-L148)

端点文档和配置备份条件。

<details>
<summary>查看原文（10行）</summary>

```text
**为什么读不到档位**：DSH 的模型目录只报告适配器声明的能力。没有继承内置目录元数据的自定义模型，需要显式声明 `reasoningEfforts` 才能公开档位；目录没有档位并不证明端点不能推理。

**优先使用图形界面**：**设置 → 模型 → 编辑提供商 → 自定义设置 → 模型选项（›）→ 推理等级**，按端点文档填写档位与 API 参数值。

<details>
<summary>高级配置：手动填写 YAML</summary>

手动修改前请备份。缩进、键名或参数错误可能导致配置加载失败或请求报错。

**怎么填**：打开指引面板显示的配置文件（目标 Profile 的 `cordis.patch.yml`），在 `llm-pi-ai` 的对应模型条目下加 `reasoningEfforts`，并保持原有缩进。键是 DSH 档位，值是端点接受的写法；没写的档位视为不支持：
```

</details>

#### 缺口

- 未量化操作收益、升级维护成本及prepareDocument内部副作用。
  **影响**：不据此承诺实际宿主或模型端效果。
  **进一步探讨**：在固定宿主比较原生菜单与滑块的误选和耗时，检查文件变化，升级后回归及无障碍退出。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
