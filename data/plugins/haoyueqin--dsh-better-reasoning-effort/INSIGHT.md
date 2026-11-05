# DSH Better Reasoning Effort

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2d68b65](https://github.com/HaoyueQin/dsh-better-reasoning-effort/tree/2d68b65cc641cd85e95384c859a2bc3de23d9e08)

<!-- BEGIN META -->
[![GitHub ★ 65](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=65&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HaoyueQin/dsh-better-reasoning-effort) [![npm 30d 3,996](https://img.shields.io/static/v1?label=npm+30d&message=3%2C996&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-reasoning-effort) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-reasoning-effort)
<!-- END META -->

> **功能**：在DSH模型卡编辑第三方模型推理档位、输入模态和请求头，提供自动适配与Composer滑块。

> **亮点**：把已有底层配置能力放进模型编辑和会话选择流程，知识库匹配自动填充与显式低置信度建议分开，保留unset与catalog override以降低手写/误覆盖负担。实际请求由宿主与上游决定，未验证任务收益。[Q01](#research-q01) [Q02](#research-q02) [Q04](#research-q04)

> **主要限制**：声明/UI不等于服务支持，正常Save是先官方后插件两阶段；按钮无法识别时全局signalsUnavailable允许无Save标记的队列在卡片消失等条件下尝试写入，取消/刷新不保证撤销。browser读取autofill开关失败会回默认开启；host域名LAN信任门可能使该读取失败。defaultGuard和origin级UA覆盖扩大请求变化范围，同origin不同route不可分别UA，禁用只撤wrapper/UI不还原已存配置。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 相对原生配置和原滑块，它为谁新增什么？](#detail-section-11)
  - [Q02 · 建议、自动填写与默认调用怎样生效？](#detail-section-12)
  - [Q03 · 探测如何用凭据，请求头覆盖到底有多宽？](#detail-section-13)
  - [Q04 · 保存并非一次原子提交，兼容与退出要做什么？](#detail-section-14)
  - [Q05 · 谁可小范围试用，如何检验有效配置而非只看UI？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：第三方模型用户不想手写settings声明，希望在官方Models卡编辑推理/图片输入、在Composer选择档位，并核对真实wire和上游接受。[Q01](#research-q01)

参照官方字段手写配置和原dsh-reasoning-effort滑块。新增第三方声明/兼容/headers编辑与建议、保存协调和host请求修正，不原创模型推理或上游滑块，不凭声明创造服务能力。[Q01](#research-q01) [Q02](#research-q02)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模型声明编辑 | 可视化reasoning/input/compat | 官方已有字段；按钮失效降级可能无Save写入，服务支持另验 |
| Auto-adapt | 展示知识库/端点/协议建议 | 低置信度需人工审核 |
| 自动填写 | 补未声明匹配模型 | unset保护；开关读取失败browser默认on |
| catalog override | 编辑目录模型而不替换目录 | revision与raw层契约，宿主需支持 |
| Composer滑块 | 会话选档位 | 拒绝回滚，不证明上游真实接受 |
| 默认guard | 部分无档位调用补vendor默认 | 仅显式models/无off等条件 |
| 探测和headers编辑 | 查模型列表并设置UA | 同源Host门；UA按origin非route |
| 关闭与清理 | 撤UI/observer/运行期wrapper | 已写配置需手动恢复 |

**流程与依赖**

#### 启动与依赖

| 条件 | 必需范围 | 作用 | 缺失或边界 |
|---|---|---|---|
| settings/llm-pi-ai配置 | host核心 | 声明与自动补写 | namespace缺失启动重试，未知模型不自动填 |
| web slots/locale/remote.settings | UI | 卡片注入/官方mutation | headless无浏览器编辑，DOM需匹配 |
| webServer及可信Host | 探测/开关读取 | 代理已配置模型列表 | 域名LAN可403，browser开关失败默认开启 |
| 官方directory/select | Composer | 按会话选effort | 选择拒绝回滚，上游仍另验 |
| 已有第三方端点/凭据 | 实际模型任务 | 服务端探测和推理 | 无法由声明新增能力，价格可用性未知 |
| Node/peer兼容与构建lib | 部署 | 包0.5.4 host/client | Node ^22.19或>=24，具体宿主未验收 |

不用官方支持表/作者测试数代替本轮端到端结果。[Q02](#research-q02) [Q03](#research-q03)

#### 使用步骤

| 阶段 | 操作者与动作 | 结果/异常 |
|---|---|---|
| 备份 | 用户记录原profile字段与包版本 | 保留退回手写配置的基线 |
| 核对 | 用户检查config路由和auto开关 | 失败回默认on，不能只看host配置 |
| 编辑 | 用户在卡片审核档位/映射/模态 | 建议非能力实测，意图暂存；降级下关闭卡片仍可能落盘 |
| 保存 | 正常识别按钮时官方Save后插件flush；按钮失效走降级 | 重开卡核对；降级时Cancel/离卡不保证清意图 |
| 选择 | 用户用滑块提交官方select | 拒绝回滚，随后用受控请求查实际wire |
| 退出 | 停用UI/wrapper并恢复原字段 | 自动写入不会随停用撤销，再验请求 |

本轮未执行这些用户操作。[Q04](#research-q04) [Q05](#research-q05)

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工投入 | 未知/风险 |
|---|---|---|---|
| 首次 | 包/配置存储，验证请求可能计费 | 备份、版本/DOM、映射核对 | 未测分钟数，不以UI省事推零成本 |
| 持续 | observer/UI、模型推理与探测网络 | 维护知识库/网关字段、检查实际用量 | 高effort可增加时延/费用，收益未知 |
| 失败 | 重发请求/重配 | 查两阶段Save/按钮失效无Save落盘、开关fallback与UA冲突 | 同origin不能不同UA，版本更新可能停注入 |
| 退出 | 保留配置备份 | 停插件并手动恢复声明/compat/headers | wrapper恢复不撤销已持久设置 |

单位合格任务成本需同任务测量，不假设更多推理更经济。[Q03](#research-q03) [Q04](#research-q04)

#### 效果

| 项目 | 固定源码支持 | 尚不能确认 |
|---|---|---|
| UI配置 | 卡片意图到官方mutation | 真实DOM/Save全程成功；降级下取消/刷新不保证丢弃 |
| 选择档位 | directory.select及拒绝回滚 | 上游接受或模型质量改善 |
| 自动建议 | matched门/置信度/unset保护 | 知识库与具体网关当前一致 |
| 默认调用/UA | guard与origin fetch覆盖 | 多插件并存及同源route正确性 |
| 退出清理 | observer/roots/方法/wrapper释放 | 持久配置自动恢复并不存在 |

只有源码核查，未运行宿主或外部模型。[Q02](#research-q02) [Q04](#research-q04)

> **思考**：声明/UI不等于服务支持，正常Save是先官方后插件两阶段；按钮无法识别时全局signalsUnavailable允许无Save标记的队列在卡片消失等条件下尝试写入，取消/刷新不保证撤销。browser读取autofill开关失败会回默认开启；host域名LAN信任门可能使该读取失败。defaultGuard和origin级UA覆盖扩大请求变化范围，同origin不同route不可分别UA，禁用只撤wrapper/UI不还原已存配置。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把已有底层配置能力放进模型编辑和会话选择流程，知识库匹配自动填充与显式低置信度建议分开，保留unset与catalog override以降低手写/误覆盖负担。实际请求由宿主与上游决定，未验证任务收益。[Q01](#research-q01) [Q02](#research-q02) [Q04](#research-q04)

共享纯patch、raw层/override保护、revision冲突重读和信任探测拒redirect是可检查设计；DOM按钮识别失败无Save落盘降级/两阶段保存、开关fail-open、origin fetch覆盖及直接方法恢复限制保证。可迁移保存/清理纪律，但不作为服务能力验证框架。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

声明/UI不等于服务支持，正常Save是先官方后插件两阶段；按钮无法识别时全局signalsUnavailable允许无Save标记的队列在卡片消失等条件下尝试写入，取消/刷新不保证撤销。browser读取autofill开关失败会回默认开启；host域名LAN信任门可能使该读取失败。defaultGuard和origin级UA覆盖扩大请求变化范围，同origin不同route不可分别UA，禁用只撤wrapper/UI不还原已存配置。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

能核查配置与请求的网页用户可在副本profile对单个已知模型试用，先验证auto开关路由可读、备份原字段、核对按钮信号及降级取消/离卡行为、重开卡确认最终字段并用最小请求验wire。出现误配、UA同源冲突、配置恢复困难或任务成本/质量变差时停止，恢复原配置并撤插件，不批量套列表。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认设置/UI/guard/probe与headers机制；仅支持备份副本、单已知模型、备份可还原的试用（不把取消当可靠回滚），真实宿主/上游、Save恢复和质量/费用未验证。

- 已检查：作者 README、包清单、源码路径 README.zh.md、src/index.ts、src/client/index.ts、src/client/ComposerSlider.tsx、src/knowledge.ts、src/autofill.ts、src/client/injection/autofill-run.ts、src/guard.ts、src/headers-core.ts、src/headers-fetch.ts、src/client/injection/models-page-editor.ts、src/client/ops.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：inventory覆盖固定组件，人工核查host/client接线、建议门、自动填充、guard、probe信任、fetch overlay、保存revision和清理。未逐项验证全部模型知识库、DOM语言/布局和其他wrapper并存；未构建、安装、执行测试/宿主/模型。
- 下一步：在固定DSH副本用一route/model分别在按钮可识别/失效下测试Save/取消/导航/冲突/刷新，检查未Save扩展意图是否落盘、false开关失败回退、同origin不同UA和停用字段恢复，再比较实际请求与任务质量/用量。本轮未执行。

**分析版本**

- **仓库**：[HaoyueQin/dsh-better-reasoning-effort](https://github.com/HaoyueQin/dsh-better-reasoning-effort)
- **版本号**：0.5.4（[固定提交 2d68b65](https://github.com/HaoyueQin/dsh-better-reasoning-effort/tree/2d68b65cc641cd85e95384c859a2bc3de23d9e08)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究显式单请求的声明—配置—wire—上游结果对照诊断，记录建议来源与guard注入而不存凭据/原提示，比较误配、排错、用量和任务质量。无净改善就保留原配置，不将未执行的诊断收益计当前创新。[Q05](#research-q05)

在固定DSH副本用一route/model分别在按钮可识别/失效下测试Save/取消/导航/冲突/刷新，检查未Save扩展意图是否落盘、false开关失败回退、同origin不同UA和停用字段恢复，再比较实际请求与任务质量/用量。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 705 | — | — | 13558 |
| .mjs | source | 5 | 319 | 244 | 44 | — |
| .ts | source | 29 | 9431 | 5357 | 3656 | — |
| .tsx | source | 6 | 2096 | 1534 | 458 | — |
| .ts | test | 18 | 6604 | 5240 | 951 | — |
| .tsx | test | 7 | 3767 | 2919 | 601 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/HaoyueQin/dsh-better-reasoning-effort/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/HaoyueQin/dsh-better-reasoning-effort/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/HaoyueQin/dsh-better-reasoning-effort/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：从声明/建议到持久配置和请求的实际链路，以及自动填写和全局覆盖的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对原生配置和原滑块，它为谁新增什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是DSH的host+web client插件，面向通过第三方供应商/网关使用模型、需要声明推理档位和图片输入的用户。作者说明底层llm-pi-ai已有reasoningEfforts/input能力，但官方Models编辑卡不暴露，原办法是手写settings.yaml；插件把编辑与建议放到卡片，并提供Composer滑块。原滑块明确致谢改编HanaAyane/dsh-reasoning-effort，不能算全新推理技术或原创控件。

实际host注入settings，client要求slots/locale/connection/remote.settings，组装Models编辑器、Composer菜单和空闲自动填充；写配置经官方settings.mutate，滑块通过directory.select提交provider/model/reasoningEffort。增量是配置可视化、档位到线上取值的声明、模态/兼容项与模型卡保存语义的组合，不是提高模型能力，也不会让不支持图片/档位的上游因声明而支持。

合格结果应是用户选择在持久配置、会话选择和实际请求中一致，上游接受且任务质量/成本符合用户预算；界面出现High或Image并不完成验收。建议中的“知识库验证”是插件内匹配/作者维护语义，不是本轮向厂商验证；条目数量和支持列表不代表全部网关版本实际成功。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:18-40](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/README.zh.md#L18-L40)

作者说明原生字段/UI缺口与上游滑块归因，不当实测。

<details>
<summary>查看原文（23行）</summary>

```text
在 DeepSeek Harness 中为**第三方模型**编辑思考强度**与输入模态**——直接在官方「模型」页的编辑卡内完成；另有一个 Composer 官方模型菜单内的思考强度快捷滑块（改编自 [HanaAyane 的 dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort)，见[致谢](#致谢)）。

<p align="center">
  <img src="docs/demo-zh.svg" alt="演示" width="640">
</p>

<p align="center">
  <img src="assets/models-page-effort-editor.png" alt="官方「模型」页模型行展开区内注入的思考强度编辑器" width="720">
</p>

## 为什么需要它

`llm-pi-ai` 适配器原生支持每模型声明 `reasoningEfforts` 与 `input`，但官方「模型」页编辑卡刻意不暴露这两个字段。于是第三方模型在 Composer 里**没有思考档位选择器**，只有官方 DeepSeek API 能设思考强度，手工声明的模型被当作**纯文本**，想配置只能手写 `settings.yaml` 块。本插件把这两份配置能力都搬回 UI：官方模型编辑卡内直接编辑，加一键自动适配。

## 特性

- **官方页内注入** — 官方「模型」页每个模型行的展开区内出现「选项」编辑块（思考强度、输入模态、端点兼容），随卡片自身的**「保存」**统一提交；改动即时进入待写入，「取消」则与卡片字段一起丢弃。
- **自动适配** — 一键填入推荐档位、线上取值与模态，来源是内置模型知识库（15 家厂商 65 个条目，见[支持的模型](docs/supported-models.md)）、线协议推断，以及对供应商原始 `/models` 列表的同源探测；每条建议标注置信度，参考容量以只读提示出现、自行照抄。
- **自动填充** — 只有命中官方知识库的模型才会在启动时或会话中新增时自动补写（`autofill: false` / `modalityAutofill: false` 可关）；未知模型保持原样，需用户明确接受「自动适配」建议。
- **三种意图** — 全不勾 = 取消声明（回到继承）；只勾 off = 禁用推理；勾选档位 = 写入声明。
- **目录安全写入** — 使用 DSH 官方 `modelOverrides` 的路由保留已安装模型目录，只写入当前编辑模型的覆盖项。
- **Composer 思考强度滑块** — 官方模型菜单的弹出体被替换为上游风格的档位滑块（拖动 / 键盘，乐观提交、被拒回滚），附一行模型条目打开官方模型列表；右下角触发钮保持原样。切换模型会通过会话记忆链沿用你的档位（issue #4 的每模型默认档跨会话优先）。
- **每模型默认思考强度** — 模型行上的「默认思考强度」选择器，存在设置文档里，每个新会话打开该模型即用它。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:42-45](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/index.ts#L42-L45)

host要求settings。

```text
export const name = PLUGIN_ID

/** Hard dependencies: the loader waits for these before calling apply. */
export const inject = ['settings']
```

**依据 3 · 源码核查**：[src/client/index.ts:63-66](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/index.ts#L63-L66)

client依赖具体宿主服务。

```text
export const name = PLUGIN_ID

/** Cordis fiber dependencies of the browser half. */
export const inject = ['slots', 'locale', 'connection', 'remote', 'remote.settings']
```

**依据 4 · 源码核查**：[src/client/index.ts:144-164](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/index.ts#L144-L164)

实际菜单、编辑器和空闲填充组装。

<details>
<summary>查看原文（21行）</summary>

```text
  // ---- The five injection seams ----
  // Each owns its own state now; see the module list in this file's header.
  const configuredEfforts = createConfiguredEfforts({ api: settingsApi })
  const sessionDirectory = createSessionDirectoryTracker({
    ctx,
    configuredEffort: configuredEfforts.of,
  })
  const composerMenu = createComposerMenu({
    menuOf: modelMenuOf,
    t,
    refreshed,
    sliderEnabled,
    directory: sessionDirectory.ensure,
  })
  // The running auto-fill complement (issue #7): the host fills once at boot,
  // everything a session adds afterwards is filled on the idle pass.
  const autofill = createIdleAutofill({ api: settingsApi })
  const modelsPage = createModelsPage({
    ctx, api: settingsApi, t, onIdle: autofill.run, refreshed,
  })

```

</details>

**依据 5 · 源码核查**：[src/client/ComposerSlider.tsx:369-397](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/ComposerSlider.tsx#L369-L397)

实际官方选择调用与拒绝回滚。

<details>
<summary>查看原文（29行）</summary>

```text
      const current = state.current
      if (current === null) throw new Error(t('sliderNoCurrent'))
      const outcome = await directory.select({
        provider: current.provider,
        model: current.model,
        reasoningEffort: next,
      })
      // Kernels through 0.1.6-alpha.1 reject by throwing; 0.1.6-alpha.2
      // resolves the refusal result instead. Normalizing it into a throw keeps
      // the optimistic rollback and the in-menu error line identical.
      const refusal = selectRefusalMessage(outcome)
      if (refusal !== undefined) throw new Error(refusal)

      const snapshot = directory.store.getSnapshot()
      const accepted = effortIndex(levels, snapshot.current?.reasoningEffort)
      const settled = accepted >= 0 ? accepted : index
      const settledId = levels[settled]?.id ?? next
      committedRef.current = settledId
      previewRef.current = settled
      setEffort(settledId)
      setPreview(settled)
    } catch (cause) {
      const restore = Math.max(0, effortIndex(levels, previous))
      committedRef.current = previous
      previewRef.current = restore
      setEffort(previous)
      setPreview(restore)
      setLocalError(cause instanceof Error ? cause.message : String(cause))
    } finally {
```

</details>

#### 缺口

- 未在固定DSH、第三方模型/网关实际发送请求，也无质量/成本比较。
  **影响**：不能宣称模型新增能力、全列表兼容或推理越高越好。
  **进一步探讨**：选一个已知route/model核对持久设置、会话选择、wire字段和上游结果，再同任务比较质量/费用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 建议、自动填写与默认调用怎样生效？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

suggestEfforts融合端点声明、内置知识库、名称/协议推断。端点明确不支持reasoning可覆盖知识库，知识库有匹配返回其档位和默认；协议兜底是低置信度骨架，不是成功探测每个值。UI显式Auto-adapt可让用户审核建议；buildAutofillPatch只对matched=true且efforts有结果的条目自动持久化，尊重已有声明与持久unset标记、拒绝包含不可表示行的数组，不把参考容量写入。例外是self-hosted relay已声明梯子可补compat的supportsDeveloperRole=false；不能笼统声称已有配置绝不动。

host启动读取raw user层并以revision乐观锁update，兼容字段拒绝时去新键降级重试；不在每次settings更新后立即补写，避免官方卡冻结revision被后台写失效。浏览器空闲pass作持续补充。重要边界是它首次读host autofill开关失败/旧host/403时回退true,true并缓存，不是fail-closed；域名LAN被host信任门拒绝时，host关闭autofill的配置未必能约束browser这一回退。它仍只填知识库匹配项，但需要用户核对开关确实到达客户端。

defaultGuard默认启用，包装llm.prepareCall和stream。只对无显式reasoningEffort、无profile默认、声明梯子不含off且知识库默认在梯子中的调用注入默认档；guardCall只找显式profile.models行，未在此链查modelOverrides，所以不能泛化覆盖所有目录路由。原函数在dispose恢复。这是实际修改请求选项的局部兼容机制，具体wire转换仍由宿主适配器承担，本轮没有端到端验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/knowledge.ts:1647-1682](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/knowledge.ts#L1647-L1682)

端点false优先与知识库matched返回。

<details>
<summary>查看原文（36行）</summary>

```text

  // L1: an explicit "does not reason" from the endpoint outranks everything.
  if (endpoint?.reasoning === false) {
    return {
      efforts: false,
      matched: false,
      source: 'endpoint:' + (endpoint.source ?? 'listing'),
      confidence: 'high',
      ...endpointPart,
      ...modalityParts,
    }
  }

  if (entry !== undefined) {
    const compat = withRolePin(compatForRoute(entry, route), route, entry.efforts !== false)
    return {
      efforts: entry.efforts,
      // The vendor default rides along only when the suggested ladder
      // actually carries it (a declaration may deliberately drop a level).
      ...(entry.efforts !== false
        && entry.defaultEffort !== undefined
        && entry.efforts[entry.defaultEffort] !== undefined
        ? { defaultEffort: entry.defaultEffort }
        : {}),
      ...(compat === undefined ? {} : { compat }),
      matched: true,
      entryId: entry.id,
      source: entry.id,
      // Knowledge base carries the wire values; an agreeing endpoint signal
      // only reinforces it. A DISAGREEING signal (endpoint says no reasoning)
      // was handled above; unknown changes nothing.
      confidence: 'high',
      ...endpointPart,
      ...modalityParts,
    }
  }
```

</details>

**依据 2 · 源码核查**：[src/knowledge.ts:1684-1718](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/knowledge.ts#L1684-L1718)

协议推断与低/中置信度，不是实测取值。

<details>
<summary>查看原文（35行）</summary>

```text
  // L2 missed: the ladder comes from protocol inference. An explicit endpoint
  // "reasons" upgrades confidence to medium -- support is confirmed, but the
  // level set and spellings are inferred, so the user should double-check.
  const protocol = inferProtocol(route)
  const efforts = PROTOCOL_INFERENCE[protocol] ?? GENERIC_FALLBACK
  const compatBase: CompatSuggestion | undefined = normalize(route.api) === COMPAT_CAPABLE_PROTOCOL
    ? { thinkingFormat: 'openai', supportsReasoningEffort: true }
    : undefined
  const compatWithBudget = compatBase !== undefined && isSelfHostedEndpoint(route.baseURL)
    ? { ...compatBase, thinkingTokenBudgetField: 'thinking_token_budget' as const }
    : compatBase
  const compat = withRolePin(compatWithBudget, route, true)
  if (endpoint?.reasoning === true) {
    return {
      efforts: { ...ENDPOINT_CONFIRMED_LADDER },
      ...(ENDPOINT_CONFIRMED_LADDER['medium'] !== undefined ? { defaultEffort: 'medium' as const } : {}),
      // compat was already gated to the protocol above; no second gate.
      ...(compat === undefined ? {} : { compat }),
      matched: false,
      source: 'endpoint:' + (endpoint.source ?? 'listing'),
      confidence: 'medium',
      ...endpointPart,
      ...modalityParts,
    }
  }
  return {
    efforts,
    // Inferred ladders default to medium (the convention codex/OpenAI set for
    // their own ladders) whenever the inferred set carries it.
    ...(efforts['medium'] !== undefined ? { defaultEffort: 'medium' as const } : {}),
    ...(compat === undefined ? {} : { compat }),
    matched: false,
    source: 'protocol:' + protocol,
    confidence: 'low',
    ...endpointPart,
```

</details>

**依据 3 · 源码核查**：[src/autofill.ts:53-120](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/autofill.ts#L53-L120)

已有声明/unset保护、匹配门和配置填充。

<details>
<summary>查看原文（68行）</summary>

```text
    if (!routeFilter(route)) continue
    // Read the RAW models array: this builder rebuilds the array verbatim,
    // so a route carrying a row it cannot represent (non-record) is left
    // alone — a filtered rebuild would silently DELETE that row.
    const profile = providers[route]
    const rawModels = isRecord(profile) && Array.isArray(profile['models']) ? profile['models'] : undefined
    if (rawModels === undefined || rawModels.length === 0) continue
    if (!rawModels.every(isRecord)) continue
    const models = rawModels as Record<string, unknown>[]
    const nextModels: JsonObject[] = []
    let changed = false
    for (const model of models) {
      // Declared parts are untouched — and so are parts the user
      // deliberately unset: the durable markers record those absences as
      // decisions, so auto-fill never reads them back as gaps (the bug this
      // guards: a refill one event after every user "unset").
      const effortsDeclared = model['reasoningEfforts'] !== undefined || model[UNSET_MARKER] === true
      const inputDeclared = declaresInput(model) || model[INPUT_UNSET_MARKER] === true
      if ((effortsDeclared || !fillEfforts) && (inputDeclared || !fillModalities)) {
        // Versioned exception to never-touch-declared (issue #2): a declared
        // ladder whose compat lacks the role pin on a self-hosted relay gets
        // exactly that field merged in -- the declaration itself is untouched.
        const backfilled = backfillRolePin(model, providers, route)
        if (backfilled !== undefined) {
          changed = true
          nextModels.push(backfilled)
        } else {
          nextModels.push(model)
        }
        continue
      }
      const id = typeof model['id'] === 'string' ? model['id'] : ''
      if (id.length === 0) {
        nextModels.push(model)
        continue
      }
      const routeInfo = routeFactsOf(providers, route)
      const name = typeof model['name'] === 'string' ? model['name'] : undefined
      const suggestion = suggestEfforts(id, { ...routeInfo, displayName: name ?? routeInfo.displayName })
      // Boot/idle autofill is persistent configuration. Only a curated
      // official model mapping is safe to write automatically; protocol and
      // name heuristics remain available through the explicit Auto-adapt UI.
      if (suggestion.efforts === undefined || suggestion.matched !== true) {
        nextModels.push(model)
        continue
      }
      const fill: JsonObject = { ...model }
      let touched = false
      // Capacities are never filled here: contextWindow / maxTokens are
      // display-only reference values in the browser half, and writing them
      // host-side would silently override the route defaults.
      // Reaching this branch means neither part was declared and no durable
      // unset marker stands on the row -- so there is no stale marker inside
      // `fill` to scrub; the guards above already excluded it.
      if (!effortsDeclared && fillEfforts) {
        touched = true
        fill['reasoningEfforts'] = suggestion.efforts as JsonObject
        // Provenance: the browser flush has to be able to tell this knowledge
        // base suggestion apart from a declaration the user made, or a staged
        // intent that differs in one spelling is dropped as a takeover (see
        // AUTOFILL_MARKER). The value is the revision this fill read.
        fill[AUTOFILL_MARKER] = revision
        if (suggestion.compat !== undefined) {
          const stored = isRecord(model['compat']) ? (model['compat'] as JsonObject) : {}
          fill['compat'] = { ...stored, ...(suggestion.compat as JsonObject) }
        }
      }
      if (!inputDeclared && fillModalities && suggestion.input !== undefined) {
```

</details>

**依据 4 · 源码核查**：[src/autofill.ts:175-187](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/autofill.ts#L175-L187)

已声明self-hosted role pin例外。

<details>
<summary>查看原文（13行）</summary>

```text
function backfillRolePin(
  model: Record<string, unknown>,
  providers: unknown,
  route: string,
): JsonObject | undefined {
  if (!isRecord(model['reasoningEfforts'])) return undefined
  if (model[UNSET_MARKER] === true) return undefined
  const compat = model['compat']
  const base: JsonObject = isRecord(compat) ? { ...compat } : {}
  if (base['supportsDeveloperRole'] !== undefined) return undefined
  if (!isSelfHostedRelay(routeFactsOf(providers, route))) return undefined
  return { ...model, compat: { ...base, supportsDeveloperRole: false } }
}
```

</details>

**依据 5 · 源码核查**：[src/index.ts:486-515](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/index.ts#L486-L515)

raw user层/revision/compat降级。

<details>
<summary>查看原文（30行）</summary>

```text
    const autofillOnce = async (): Promise<boolean> => {
      const descriptor = settings.describe().find(entry => entry.ns === PI_NS)
      if (!isRecord(descriptor?.value)) return false
      // Build the patch from the RAW USER layer, never the resolved value:
      // the fill merges into the user document, and building from the
      // resolved view would materialize schema defaults / composition-base
      // models into it wholesale the moment pi-ai grows such layers for its
      // profile. A namespace whose user section holds no providers has
      // nothing this plugin may fill.
      const user = descriptor?.user
      const userProviders = isRecord(user) && isRecord(user['providers']) ? user['providers'] : undefined
      if (userProviders === undefined) return true
      const fullPatch = buildAutofillPatch(userProviders, () => true, { modalities: resolved.modalityAutofill }, descriptor?.revision ?? 0)
      if (fullPatch === undefined) return true
      // Optimistic lock: only write while the namespace has not moved past
      // this read. The fill is a background suggestion -- losing the race to a
      // user edit is fine; a later boot, or the browser half's idle pass,
      // simply fills whatever is still undeclared. Without the lock every fill
      // would bump the revision and invalidate the one the settings page read,
      // surfacing as SettingsConflictError on the next user save.
      try {
        await settings.update(PI_NS, fullPatch, descriptor?.revision)
      } catch (error) {
        const msg = String(error instanceof Error ? error.message : error)
        if (!looksLikeCompatRefusal(msg)) throw error
        const stripped = stripNewCompatKeysDeep(fullPatch)
        if (stripped === undefined) throw error
        await settings.update(PI_NS, stripped, settings.describe().find(entry => entry.ns === PI_NS)?.revision)
      }
      return true
```

</details>

**依据 6 · 源码核查**：[src/client/injection/autofill-run.ts:35-62](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/injection/autofill-run.ts#L35-L62)

读取配置失败回退开启并缓存。

<details>
<summary>查看原文（28行）</summary>

```text

  /**
   * The host's autofill switches, read once. A `dsh.client` declaration carries
   * no plugin config, so a deployment configured `autofill: false` would
   * otherwise still be written to from the page. An unreachable or older host
   * keeps the documented defaults rather than silently disabling the feature.
   */
  const autofillSwitchesOf = (): Promise<{ autofill: boolean; modalityAutofill: boolean }> => {
    autofillSwitches ??= (async () => {
      const fallback = { autofill: true, modalityAutofill: true }
      try {
        const response = await fetch(AUTOFILL_CONFIG_PATH, { method: 'GET' })
        if (!response.ok) return fallback
        const body = (await response.json()) as { ok?: boolean; data?: { autofill?: unknown; modalityAutofill?: unknown } }
        if (body?.ok !== true) return fallback
        return {
          autofill: body.data?.autofill !== false,
          modalityAutofill: body.data?.modalityAutofill !== false,
        }
      } catch {
        return fallback
      }
    })()
    return autofillSwitches
  }

  /**
   * Fill the models this session added, through the very patch builder the
```

</details>

**依据 7 · 源码核查**：[src/client/injection/autofill-run.ts:72-102](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/injection/autofill-run.ts#L72-L102)

空闲写配置的实际调用。

<details>
<summary>查看原文（31行）</summary>

```text
      // manufacture a `settings/conflict` (the same reason a conflict retry
      // re-reads the wire).
      const join = await describeNamespace(deps.api, { fresh: true })
      const namespace = join.namespace
      if (namespace === undefined || join.writable !== true) return
      const userProviders = userProvidersOf(namespace)
      if (userProviders === undefined) return
      const patch = buildAutofillPatch(
        userProviders, () => true, { modalities: switches.modalityAutofill }, namespace.revision,
      )
      if (patch === undefined) return
      const routes = patch['providers'] as Record<string, { models: unknown }>
      const ops = Object.entries(routes).map(([route, profile]) => ({
        op: 'set' as const,
        path: ['providers', route, 'models'],
        value: profile.models,
      })) as unknown as Parameters<typeof deps.api.settings.mutate>[1]
      const response = await deps.api.settings.mutate(PI_AI_NS, ops, namespace.revision)
      // A refusal arrives as a VALUE, not a throw: without this check the whole
      // complement failed silently (the catch below never ran). Whatever is
      // still undeclared is picked up by the next idle pass.
      if (!response.ok) {
        console.error(`[bre] idle autofill refused: ${response.error.message}`)
      }
    } catch (error) {
      console.error(`[bre] idle autofill failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return { run: () => { void runIdleAutofill() } }
}
```

</details>

**依据 8 · 源码核查**：[src/guard.ts:39-48](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/guard.ts#L39-L48)

默认注入条件。

<details>
<summary>查看原文（10行）</summary>

```text
export function resolveGuardEffort(input: GuardInput): string | undefined {
  if (input.requested !== undefined) return undefined
  const declared = input.declared
  if (declared === undefined || declared === false) return undefined
  if ('off' in declared) return undefined
  if (input.profileDefault !== undefined) return undefined
  const fallback = input.vendorDefault
  if (fallback === undefined || !(fallback in declared)) return undefined
  return fallback
}
```

</details>

**依据 9 · 源码核查**：[src/index.ts:387-424](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/index.ts#L387-L424)

只查显式models行并注入reasoningEffort。

<details>
<summary>查看原文（38行）</summary>

```text
function guardCallConfig(cfg: Record<string, unknown>, section: unknown, report: GuardReport): Record<string, unknown> {
  try {
    if (typeof cfg['reasoningEffort'] !== 'undefined') return cfg
    const provider = cfg['provider']
    const modelId = cfg['model']
    if (typeof provider !== 'string' || typeof modelId !== 'string') return cfg
    // Counted from here on: an effort-less call that names what it talks to is
    // exactly the population this guard exists to judge. Every refusal below
    // (an unreadable section, an unlisted model, a ladder that can switch
    // thinking off) raises `inspected` without raising `injected`, so a
    // deployment where the guard never fires is visible instead of silent.
    report.inspected += 1
    if (!isRecord(section)) return cfg
    const providers = section['providers']
    if (!isRecord(providers)) return cfg
    const profile = providers[provider]
    if (!isRecord(profile)) return cfg
    const rawModels = profile['models']
    if (!Array.isArray(rawModels)) return cfg
    const row = rawModels.find((candidate): candidate is Record<string, unknown> =>
      isRecord(candidate) && candidate['id'] === modelId)
    if (row === undefined || !isRecord(row['reasoningEfforts'])) return cfg
    const profileDefault = typeof profile['reasoning'] === 'string' ? profile['reasoning'] : undefined
    const facts = routeFactsOf({ providers: { [provider]: profile } }, provider)
    const suggestion = suggestEfforts(modelId, facts)
    const level = resolveGuardEffort({
      declared: row['reasoningEfforts'] as ReasoningEfforts,
      vendorDefault: suggestion.defaultEffort,
      profileDefault,
      requested: undefined,
    })
    if (level === undefined) return cfg
    report.injected += 1
    report.lastInjection = { provider, model: modelId, level }
    return { ...cfg, reasoningEffort: level }
  } catch {
    return cfg
  }
```

</details>

**依据 10 · 源码核查**：[src/index.ts:561-577](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/index.ts#L561-L577)

包装两个LLM入口与dispose恢复。

<details>
<summary>查看原文（17行）</summary>

```text
  if (resolved.defaultGuard) {
    ctx.inject(['llm'], (llmCtx) => {
      const llm = (llmCtx as unknown as { llm?: unknown }).llm as LlmDispatchLike | undefined
      if (llm === undefined || typeof llm.prepareCall !== 'function' || typeof llm.stream !== 'function') return
      // Unbound originals: restore assigns back the exact references, and
      // dispatch keeps the service as receiver through .call.
      const origPrepare = llm.prepareCall
      const origStream = llm.stream
      llm.prepareCall = (callConfig, signal) => origPrepare.call(llm, guardCallConfig(callConfig, piSection(), guardReport), signal)
      llm.stream = (options) => origStream.call(llm, guardCallConfig(options, piSection(), guardReport))
      guardReport.installed = true
      ctx.effect(() => () => {
        llm.prepareCall = origPrepare
        llm.stream = origStream
        guardReport.installed = false
      }, 'dsh-better-reasoning-effort: default-guard')
    })
```

</details>

#### 缺口

- 知识库可能落后实际供应商/网关，客户端开关失败回退与guard范围未在宿主复现。
  **影响**：自动配置可能与部署意图或上游实际不一致，不能只看开关/置信度就信任。
  **进一步探讨**：验证config路由可读且false实际阻止browser写，分别检查models与modelOverrides的guard效果并抓实际wire。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 探测如何用凭据，请求头覆盖到底有多宽？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

host探测只接受GET与已配置provider route，读取该route的baseURL/API和credentials.resolve得到的key，按协议组装headers访问模型列表；不从query传任意URL。信任门要求合法Host、拒cross-site/不匹配Origin和null，最终只接受loopback或IP literal，域名LAN GUI可能403。这是本地部署信任围栏，不是用户/租户鉴权，非浏览器客户端可构造头，不能描述成多租户边界。

上游probe拒绝redirect，设timeout并有readBounded，凭据不作为响应字段回显；返回的是上游原始模型条目，不能把“代码没回显APIkey字段”推成所有上游内容从不含敏感信息。它不会真实跑一次推理来验证档位或图片。外部服务当前价格/能力未在本轮核实。

user-agent覆盖是进程级globalThis.fetch wrapper，按照scheme://host:port索引，不按route/path/请求类型。只改user-agent，其余headers复制保留；未命中原参数直通。但同origin上其他路径的fetch也会匹配，即使不是本次模型调用；两个route同origin不同UA时第一声明取值并记录conflict，不能实现同origin按route隔离。wrapper多实例共享registry，最后entry退出且仍持有global fetch才恢复base，避免覆盖后装wrapper；这减少生命周期干扰，不等于与任意第三方wrapper完整兼容。guard另是直接restore两个方法，本轮未全审叠加顺序。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:162-180](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/index.ts#L162-L180)

Host/Origin与loopback/IP门，不是租户权限。

<details>
<summary>查看原文（19行）</summary>

```text
function isTrustedRequest(req: IncomingMessage): boolean {
  const host = req.headers.host
  if (typeof host !== 'string' || host.length === 0) return false
  const hostUrl = parseAuthority(host)
  if (hostUrl === undefined) return false
  const secFetchSite = req.headers['sec-fetch-site']
  if (secFetchSite === 'cross-site') return false
  const origin = req.headers.origin
  if (typeof origin === 'string') {
    if (origin === 'null') return false
    try {
      if (new URL(origin).host !== hostUrl.host) return false
    } catch {
      return false
    }
  }
  const hostname = hostUrl.hostname.toLowerCase()
  return isLoopbackHostname(hostname) || isIpLiteralHostname(hostname)
}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:636-683](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/index.ts#L636-L683)

探测仅已配置route及服务端凭据解析。

<details>
<summary>查看原文（48行）</summary>

```text
            const route = url.searchParams.get('route') ?? ''
            const section = piSection()
            const profile = isRecord(section) && isRecord(section['providers'])
              ? section['providers'][route]
              : undefined
            if (!isRecord(profile)) {
              sendJson(res, 400, { ok: false, error: `no llm-pi-ai provider route "${route}"` })
              return
            }
            const baseURL = typeof profile['baseURL'] === 'string' ? profile['baseURL'] : ''
            if (baseURL.length === 0) {
              sendJson(res, 400, { ok: false, error: `provider route "${route}" has no baseURL` })
              return
            }
            // The profile's wire protocol selects the listing route and the
            // credential arm, exactly as the official discovery decides them:
            // only the protocols whose listing this mirror can read are
            // interrogated; everything else reports that it cannot.
            const api = typeof profile['api'] === 'string' ? profile['api'] : ''
            if (api.length === 0) {
              sendJson(res, 400, {
                ok: false,
                error: `provider route "${route}" names no API protocol to interrogate`,
              })
              return
            }
            if (!LISTABLE_PROTOCOLS.has(api)) {
              sendJson(res, 400, {
                ok: false,
                error: `protocol "${api}" cannot be interrogated; enter this provider's models by hand`,
              })
              return
            }
            const apiKeyEnv = typeof profile['apiKeyEnv'] === 'string' ? profile['apiKeyEnv'] : undefined
            const listingURL = probeListingUrl(baseURL, api)
            let apiKey: string | undefined
            if (apiKeyEnv !== undefined) {
              try {
                const credentials = ctx.get('credentials') as CredentialsService | undefined
                const hit = credentials === undefined ? undefined : await credentials.resolve(apiKeyEnv)
                apiKey = hit !== undefined && typeof hit.value === 'string' && hit.value.length > 0
                  ? hit.value
                  : undefined
              } catch {
                // Unresolvable credential: probe unauthenticated rather than fail.
              }
            }
            try {
```

</details>

**依据 3 · 源码核查**：[src/index.ts:684-739](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/index.ts#L684-L739)

headers、redirect:error、timeout与原始listing返回。

<details>
<summary>查看原文（56行）</summary>

```text
              const upstream = await fetch(listingURL, {
                method: 'GET',
                // Header composition mirrors the harness's own model discovery:
                // the profile's configured request headers ride
                // along, so a deployment that authenticates through a custom
                // header probes here exactly as it lists officially — and an
                // Anthropic endpoint answers through x-api-key + a fixed
                // anthropic-version instead of a Bearer.
                headers: composeProbeHeaders(profile['headers'], apiKey, api),
                // A probe carries the user's stored credential, so it must
                // reach exactly the authority the profile names: Fetch's
                // default would FOLLOW a cross-origin redirect, and the
                // headers composed here (`x-api-key`, a profile's own auth
                // header) are not stripped on that hop the way `authorization`
                // is. Official discovery keeps the default; this route is
                // stricter on purpose, and the cost is bounded — a gateway
                // that lists only behind a redirect yields no endpoint
                // evidence, so Auto-adapt falls back to the knowledge base /
                // protocol inference, the path every unanswerable endpoint
                // takes.
                redirect: 'error',
                signal: AbortSignal.timeout(resolved.probeTimeoutMs),
              })
              if (!upstream.ok) {
                const hint = upstream.status === 401 || upstream.status === 403 ? '; check the API key' : ''
                sendJson(res, 502, { ok: false, error: `${displayUrl(listingURL)} answered ${upstream.status}${hint}` })
                return
              }
              const text = await readBounded(upstream, listingURL)
              let body: unknown
              try {
                body = JSON.parse(text) as unknown
              } catch {
                sendJson(res, 502, { ok: false, error: `${displayUrl(listingURL)} answered with a malformed JSON body` })
                return
              }
              // The official parser accepts the standard `data` array and the
              // enriched `models` map; entries are passed through verbatim so
              // the browser half sees the raw capability signals the sanctioned
              // wire call strips.
              const entries = listingEntries(body)
              if (entries === undefined) {
                sendJson(res, 502, {
                  ok: false,
                  error: `${displayUrl(listingURL)} model listing has neither a "data" array nor a "models" object`,
                })
                return
              }
              sendJson(res, 200, { ok: true, url: displayUrl(listingURL), data: entries })
            } catch (error) {
              sendJson(res, 502, {
                ok: false,
                error: `could not reach ${displayUrl(listingURL)}: ${error instanceof Error ? error.message : String(error)}`,
              })
            }
          },
```

</details>

**依据 4 · 源码核查**：[src/index.ts:282-310](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/index.ts#L282-L310)

读取体大小约束和取消reader。

<details>
<summary>查看原文（29行）</summary>

```text
async function readBounded(response: Response, url: string): Promise<string> {
  const declared = Number(response.headers.get('content-length') ?? Number.NaN)
  if (Number.isFinite(declared) && declared > MAX_RESPONSE_BYTES) {
    await response.body?.cancel()
    throw new Error(`${displayUrl(url)} overshoots the ${MAX_RESPONSE_BYTES}-byte listing ceiling`)
  }
  if (response.body === null) return ''
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > MAX_RESPONSE_BYTES) throw new Error(`${displayUrl(url)} overshoots the ${MAX_RESPONSE_BYTES}-byte listing ceiling`)
      chunks.push(value)
    }
  } finally {
    await reader.cancel().catch(() => {
      // Cancel after a drained read, or after this function walked away from
      // an oversized one, is cleanup; the reply is already decided either way.
    })
  }
  const body = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
```

</details>

**依据 5 · 源码核查**：[src/headers-core.ts:125-156](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/headers-core.ts#L125-L156)

origin索引、第一route生效与冲突记录。

<details>
<summary>查看原文（32行）</summary>

```text
 */
export function buildUserAgentIndex(
  providers: Record<string, Record<string, unknown>>,
): UserAgentIndex {
  const index = emptyIndex()
  const claimed = new Map<string, { routes: string[]; values: string[] }>()
  for (const [route, profile] of Object.entries(providers)) {
    const userAgent = declaredUserAgent(profile)
    if (userAgent === undefined) continue
    const origin = originOf(typeof profile['baseURL'] === 'string' ? profile['baseURL'] : undefined)
    if (origin === undefined) continue
    const existing = index.byOrigin.get(origin)
    if (existing === undefined) {
      index.byOrigin.set(origin, { origin, userAgent, route })
      claimed.set(origin, { routes: [route], values: [userAgent] })
      continue
    }
    const group = claimed.get(origin)!
    group.routes.push(route)
    group.values.push(userAgent)
    // Idempotent declaration (two routes, same identity) is not a conflict:
    // nothing is ambiguous about which value to send.
    if (existing.userAgent === userAgent) continue
    const reported = index.conflicts.find(entry => entry.origin === origin)
    if (reported === undefined) index.conflicts.push({ origin, routes: group.routes, values: group.values })
  }
  return index
}

/**
 * The request URL a Fetch call is aimed at, or undefined when it cannot be
 * classified. A `Request` from another realm fails the `instanceof` test and is
```

</details>

**依据 6 · 源码核查**：[src/headers-fetch.ts:83-101](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/headers-fetch.ts#L83-L101)

进程fetch按origin改UA，不按具体route。

<details>
<summary>查看原文（19行）</summary>

```text
    for (const entry of entries.values()) {
      userAgent = overrideFor(entry.index(), url)
      if (userAgent !== undefined) break
    }
    if (userAgent === undefined) return base(input, init)
    const headers = seedHeaders(input, init)
    headers.set('user-agent', userAgent)
    return base(input, { ...init, headers })
  }
}

/** Handle one activation keeps; `dispose` is idempotent. */
export interface HeaderOverlayHandle {
  /** Remove this activation's entry, restoring the original fetch when it was the last. */
  dispose(): void
}

/** Handle for tests and the caller to swap the index a live activation reads. */
export interface HeaderOverlay extends HeaderOverlayHandle {
```

</details>

**依据 7 · 源码核查**：[src/headers-fetch.ts:123-153](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/headers-fetch.ts#L123-L153)

共享注册表与最后实例条件恢复。

<details>
<summary>查看原文（31行）</summary>

```text
    const wrapper = makeWrapper(base, entries)
    registry = { base, wrapper, entries }
    holder[REGISTRY] = registry
    globalThis.fetch = wrapper
  }
  registry.entries.set(token, { index: () => source.current })
  const owned = registry
  return {
    get active(): boolean {
      return owned.entries.has(token)
    },
    dispose(): void {
      owned.entries.delete(token)
      if (owned.entries.size > 0) return
      // Last one out restores the ORIGINAL function, and only when this
      // wrapper still holds the global: a later installer's wrapper must not be
      // clobbered by our teardown.
      if (globalThis.fetch === owned.wrapper) globalThis.fetch = owned.base
      if (holder[REGISTRY] === owned) delete holder[REGISTRY]
    },
  }
}

/** Whether this plugin's wrapper currently owns the global fetch (diagnostics). */
export function headerOverlayInstalled(): boolean {
  const registry = registryOf()
  return registry !== undefined && globalThis.fetch === registry.wrapper
}

/** The empty index, re-exported so callers building one need a single import. */
export { emptyIndex }
```

</details>

#### 缺口

- 真实代理部署、其他fetch/llm wrapper与宿主权限组合没有运行验证。
  **影响**：不能承诺跨租户安全、所有网关正确或插件并存无干扰。
  **进一步探讨**：在固定部署测loopback/IP/域名LAN、跨源拒绝和同origin双route，确认其他请求UA与卸载链。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 保存并非一次原子提交，兼容与退出要做什么？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

编辑器暂存尚未落盘的意图。正常识别到官方按钮时，submit点击给route加committing标记，cancel调用forgetRoute清该route意图，flushQueued只允许committed route进入写入；模型保存与插件扩展仍是分离的两阶段，而非一个原子Save。卡片开启时写入fence会等待，最终字段必须重开核对，不能从官方Save已成功推插件扩展也持久化。

存在明确降级：actionsOf无法识别任何一层按钮锚点时，扫描把全局state.signalsUnavailable设true；遇可识别按钮的行又置false。flushQueued的landable和逐route条件是committing.has(route)或signalsUnavailable，不再要求该route实际Save；它仍要求namespace writable，并把officialCardOpen作为普通写入fence。因而在降级标记为true、队列还保留且卡片已消失/关闭时，即使没有Save记录也可能尝试落盘。按钮未被识别意味着cancel也未挂forgetRoute，用户取消、导航离开卡片并不能保证扩展意图被清；该标记还是跨route共享，不能解释成只影响当前一行。这是实现的条件行为，不是本轮复现。teardown/unload会尝试flush，unload传ignoreFence=true并随后清ledger；故刷新也不能一概写成“丢弃所有未保存修改”，必须区分正常信号与降级/待flush路径。

写行从raw user/base取基线，已安装目录用modelOverrides而非覆写目录models，不能表示的行拒写。mutation带namespace.revision，首次冲突重读wire再试，新compat字段拒绝可降级一次；失败返回错误，卡片开启时最后fence abort保留意图。sessionStorage ledger尽力保存并带document/commit证据，HMR同文档仅按恢复规则取回有commit证据的queued项；新document清旧草稿记录，但teardown/unload仍有前述异步flush窗口，不构成持久事务或统一取消保证。UI依赖DOM锚点/MutationObserver，宿主结构改变可能不再注入，即使包peer范围允许也需实测。

首次需固定支持宿主、web服务/remote.settings、兼容构建包与模型配置，备份用户层，核对自动开关和headers；持续需随模型/网关/DOM升级维护，错误档位可能增加推理时延/费用或被拒。停用会解除UI/observer和wrapper，但已保存的reasoningEfforts/input/compat/defaults/headers仍是官方配置，没有自动撤销记录。要退回原行为须按备份恢复相关字段，再验证请求；不应把禁用等同“零痕迹”。本轮未实际卸载或保存。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/injection/models-page-editor.ts:247-264](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/injection/models-page-editor.ts#L247-L264)

状态声明已显示signalsUnavailable是Save门的降级例外，不能只读取committing注释。

<details>
<summary>查看原文（18行）</summary>

```text
   * Routes whose OFFICIAL card committed in this session (the user pressed its
   * commit button). The held ledgers land per route: only the routes the user
   * actually saved are written, because the official card's Save is now what
   * commits this plugin's edits too (issue #7 / C2). An intent the user
   * dismissed without saving is dropped, exactly like the card's own fields.
   */
  committing: Set<string>
  /**
   * Whether the official action row has failed to yield usable buttons for
   * every card seen so far. When it has, the landing decision degrades to
   * "the card went away, so write it" -- writing too much is recoverable,
   * silently losing the user's declaration is not.
   */
  signalsUnavailable: boolean
  /** Commit buttons already wired, so a re-scan never double-registers. */
  submitWired: WeakSet<Element>
  /** Cancel buttons already wired. */
  cancelWired: WeakSet<Element>
```

</details>

**依据 2 · 源码核查**：[src/client/injection/models-page-editor.ts:336-359](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/injection/models-page-editor.ts#L336-L359)

sessionStorage保存best-effort。

<details>
<summary>查看原文（24行）</summary>

```text
 * Mirror both ledgers into `sessionStorage`. Called after every change and
 * best-effort by nature: an unavailable or full storage keeps the ledgers in
 * memory alone (the behaviour before they were persisted), never an error the
 * user has to see.
 */
function persistLedger(state: ScanState): void {
  const store = ledgerStorage()
  if (store === undefined) return
  try {
    if (state.pending.size === 0 && state.queued.size === 0) {
      store.removeItem(LEDGER_KEY)
      return
    }
    const file: LedgerFile = {
      document: documentId(),
      // Only routes that still hold a write matter: a spent marker is never
      // restored (and flushQueued prunes it).
      committed: [...state.committing].filter(route => state.queued.has(route)),
      pending: [...state.pending].map(([route, models]) => [route, [...models]]),
      queued: [...state.queued].map(([route, models]) => [route, [...models]]),
    }
    store.setItem(LEDGER_KEY, JSON.stringify(file))
  } catch {
    // Quota / disabled storage: the in-memory ledgers remain authoritative.
```

</details>

**依据 3 · 源码核查**：[src/client/injection/models-page-editor.ts:385-426](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/injection/models-page-editor.ts#L385-L426)

document/commit证据与HMR/重载边界。

<details>
<summary>查看原文（42行）</summary>

```text
 * Restore the ledgers from `sessionStorage`.
 *
 * A file written by a PREVIOUS document is a reload: the official card's own
 * draft would have died with it, so both ledgers are discarded outright. A
 * same-document file (HMR / disable-enable) comes back, but a held write is
 * restored ONLY with commit evidence -- an edit the user never saved must not
 * be resurrected behind a later Save. A malformed or foreign file is ignored
 * wholesale rather than partially applied: a half-read intent is worse than a
 * dropped one on a document the user can edit by hand.
 * @param state - the fresh scan state to fill.
 */
function restoreLedger(state: ScanState): void {
  const store = ledgerStorage()
  if (store === undefined) return
  try {
    const raw = store.getItem(LEDGER_KEY)
    if (raw === null) return
    const parsed = JSON.parse(raw) as Partial<LedgerFile>
    if (parsed.document !== documentId()) return
    const pending = ledgerEntry<StagedDeclaration>(parsed.pending)
    const queued = ledgerEntry<HeldWrite>(parsed.queued, isHeldWrite)
    if (pending === undefined || queued === undefined) return
    const committed = Array.isArray(parsed.committed)
      ? parsed.committed.filter((route): route is string => typeof route === 'string')
      : []
    for (const [route, models] of pending) state.pending.set(route, new Map(models))
    for (const [route, models] of queued) {
      // No evidence = the user never saved this route: drop it.
      if (!committed.includes(route)) continue
      state.queued.set(route, new Map(models))
      state.committing.add(route)
    }
  } catch {
    // Unreadable file: start clean.
  }
}

/**
 * Land whatever the session held back, best effort, when the fiber is about to
 * go away (plugin disable / HMR). The ledgers STAY in `sessionStorage` (with
 * their commit evidence), so the next fiber in the same document picks the work
 * up; a flush the runtime cuts short is simply retried by that fiber.
```

</details>

**依据 4 · 源码核查**：[src/client/injection/models-page-editor.ts:430-453](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/injection/models-page-editor.ts#L430-L453)

teardown和unload为异步尽力flush。

<details>
<summary>查看原文（24行）</summary>

```text
export function flushOnTeardown(state: ScanState, deps: InjectorDeps): void {
  void (async () => {
    try {
      await flushQueued(deps, state)
      await flushPending(deps, state)
    } catch (error) {
      console.error(`[bre] teardown flush failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  })()
}

/**
 * The page is going away: land the committed intents best effort, then CLEAR
 * the ledger. Unlike a fiber cycle, a reload discards the official card's own
 * draft, so the plugin's must go too -- anything the cut-short flush could not
 * land must not be resurrected by the next document. (The window sentinel
 * covers the case pagehide never fires: crash / plugin already disabled.)
 * @param state - the scan state whose ledgers to drain.
 * @param deps - the injection dependencies.
 */
export function flushOnUnload(state: ScanState, deps: InjectorDeps): void {
  // The page is going away: an open card's frozen baseline no longer matters,
  // so the in-flight fence must not block this last best-effort landing.
  void (async () => {
```

</details>

**依据 5 · 源码核查**：[src/client/ops.ts:398-499](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/ops.ts#L398-L499)

raw模型/override、revision冲突与兼容降级和fence。

<details>
<summary>查看原文（102行）</summary>

```text
  // Retry once on a revision conflict: a concurrent writer (this plugin's own
  // autofill, or the official page) moved the namespace between our describe
  // and mutate. Re-reading and retrying with the fresh revision is the same
  // recovery the official settings form uses.
  // Downgrade once for older kernels: a `settings/rejected` refusal naming an
  // unknown compat key means the kernel predates the newer compat schema.
  // Stripping the newer-only keys and retrying keeps one artifact writable
  // across kernel lines with no version sniffing.
  let downgraded = false
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      // Attempt 0 reads through the injected seam (the injector seeds it with
      // the scan's join). A conflict retry MUST go to the wire: the scope
      // snapshot behind that seam folds a fresh view in asynchronously, so it
      // would hand back the very revision the write just failed against.
      const join = attempt === 0 ? await describe() : await describeNamespace(api, { fresh: true })
      if (join.namespace === undefined) return rows.map(() => ({ ok: false, error: 'no-namespace' }))
      // The write rebuilds the model storage verbatim from the RAW layers (the
      // user section, else the composition base) -- never the resolved value.
      // Catalog routes use `modelOverrides`; explicit provider catalogs use the
      // `models` array. A row this code cannot represent must refuse the write
      // rather than silently drop it.
      const store = baselineModelStoreOf(join.namespace, route)
      if (store === undefined) return rows.map(() => ({ ok: false, modelNotFound: true }))
      const rawModels = store.kind === 'models' ? store.models : Object.entries(store.overrides).map(([id, value]) => ({
        ...(isRecord(value) ? value : {}),
        id,
      }))
      if (!Array.isArray(rawModels)) return rows.map(() => ({ ok: false, modelNotFound: true }))
      if (!rawModels.every(isRecord)) return rows.map(() => ({ ok: false, error: 'invalid-models' }))
      const models = rawModels as Record<string, unknown>[]
      const nextModels = models.map(model => model)
      const nextOverrides = store.kind === 'modelOverrides'
        ? Object.fromEntries(Object.entries(store.overrides).map(([id, value]) => [id, isRecord(value) ? { ...value } : value]))
        : undefined
      const missing: string[] = []
      for (const row of rows) {
        const index = nextModels.findIndex(model => model['id'] === row.modelId)
        // A catalog route's override dict starts empty, so the FIRST edit of any
        // model the installed catalog serves is a new key: the rows live in the
        // catalog, not in the document, so a missing entry is the normal case
        // rather than a vanished row. Only an explicit `models` list can miss a
        // row it should have held, and there the existing id has to be present
        // -- resurrecting a deleted one would rewrite the catalog around a gap.
        if (index < 0 && nextOverrides === undefined) {
          missing.push(row.modelId)
          continue
        }
        const merged = mergeRowIntent(
          index < 0 ? { id: row.modelId } : nextModels[index]!,
          row,
          downgraded ? undefined : row.compat,
        )
        if (nextOverrides !== undefined) {
          const { id: _id, ...override } = merged
          nextOverrides[row.modelId] = override
        } else {
          nextModels[index] = merged
        }
      }
      if (missing.length > 0) {
        return rows.map(row => (missing.includes(row.modelId)
          ? { ok: false, modelNotFound: true }
          : { ok: false, error: 'model-not-found' }))
      }
      // The card fence, re-checked at the last possible moment: a card that
      // opened during the read must not have this write land behind its frozen
      // baseline. Aborting consumes nothing -- every row stays for a retry.
      if (abort?.() === true) return rows.map(() => ({ ok: false, aborted: true }))
      const response = await api.settings.mutate(
        PI_AI_NS,
        // The rebuilt models array is JSON-shaped by construction (a settings
        // document is JSON); the value is JsonValue on this baseline, so the
        // set op asserts once instead of rebuilding the row's type.
        [{
          op: 'set',
          path: ['providers', route, store.kind === 'models' ? 'models' : 'modelOverrides'],
          value: store.kind === 'models' ? nextModels : nextOverrides,
        } as unknown as SettingsPathOpView],
        join.namespace.revision,
      )
      if (!response.ok) {
        // The stable wire code, not the message prose: 'settings/conflict'
        // (the Typert refusal code) means a concurrent writer moved the
        // namespace between our describe and mutate.
        if (attempt === 0 && response.error.code === 'settings/conflict') continue
        const looksCompat = response.error.code === 'settings/rejected' && looksLikeCompatRefusal(response.error.message)
        if (!downgraded && looksCompat && rows.some(row => row.compat !== undefined)) {
          downgraded = true
          continue
        }
        return rows.map(() => ({ ok: false, error: response.error.message }))
      }
      return rows.map(() => ({ ok: true }))
    } catch (error) {
      return rows.map(() => ({ ok: false, error: error instanceof Error ? error.message : String(error) }))
    }
  }
  return rows.map(() => ({ ok: false, error: 'conflict' }))
}

/**
```

</details>

**依据 6 · 源码核查**：[src/client/index.ts:176-199](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/index.ts#L176-L199)

实际DOM/选择包装清理和pagehide。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.effect(() => {
    modelsPage.start(onComposerMutation)
    return () => {
      // Land what the session held back, unmount the editors, stop observing.
      modelsPage.teardown()
      // Orphaned foreign roots must not outlive the fiber: on plugin disable
      // or HMR they would keep rendering with a stale face.
      composerMenu.dispose()
      // Restore every wrapped directory's original select (the instances
      // outlive the fiber on disable/HMR and must submit officially again).
      sessionDirectory.dispose()
    }
  }, 'dsh-better-reasoning-effort: DOM injector')

  // A page unload is the last moment the committed ledgers can be landed, and
  // the moment the rest must be DISCARDED: a reload drops the official card's
  // own draft, so the plugin's uncommitted edits go with it. (The dispose
  // effect above keeps the ledger for a same-document fiber cycle, where the
  // card survives.)
  ctx.effect(() => {
    const onPageHide = (): void => { modelsPage.flushOnUnload() }
    window.addEventListener('pagehide', onPageHide)
    return () => { window.removeEventListener('pagehide', onPageHide) }
  }, 'dsh-better-reasoning-effort: ledger flush on unload')
```

</details>

**依据 7 · 源码核查**：[src/index.ts:569-575](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/index.ts#L569-L575)

guard恢复方法而非撤回settings文档。

```text
      llm.prepareCall = (callConfig, signal) => origPrepare.call(llm, guardCallConfig(callConfig, piSection(), guardReport), signal)
      llm.stream = (options) => origStream.call(llm, guardCallConfig(options, piSection(), guardReport))
      guardReport.installed = true
      ctx.effect(() => () => {
        llm.prepareCall = origPrepare
        llm.stream = origStream
        guardReport.installed = false
```

**依据 8 · 源码核查**：[package.json:72-80](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/package.json#L72-L80)

运行时和主要peer范围。

```text
  "engines": {
    "node": "^22.19.0 || >=24"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-api-remotes": "^0.1.5-alpha.1 || ^0.1.6-alpha.1 || ^0.1.7-alpha.1 || ^0.1.7-rc.1 || ^0.2.0-rc.1 || ^0.2.0-rc.2 || ^0.2.1-alpha.1",
    "@deepseek-ai/dsh-settings": "^0.1.5-alpha.1 || ^0.1.6-alpha.1 || ^0.1.7-alpha.1 || ^0.1.7-rc.1 || ^0.2.0-rc.1 || ^0.2.0-rc.2 || ^0.2.1-alpha.1",
    "@deepseek-ai/schemastery": "^3.18.0 || ^3.18.5-alpha.1",
    "react": "^18.2.0 || ^19.0.0"
  },
```

**依据 9 · 源码核查**：[src/client/injection/models-page-editor.ts:1208-1216](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/injection/models-page-editor.ts#L1208-L1216)

按钮锚点无法识别返回undefined，触发降级。

```text
 * A row whose buttons no tier can identify returns undefined, which is what
 * makes {@link ScanState.signalsUnavailable} trip and the landing decision
 * degrade to "the card went away, write it" rather than dropping the edit.
 */
function actionsOf(card: HTMLElement, labels: HostLabels): { submit: HTMLElement; cancel: HTMLElement } | undefined {
  const row = card.querySelector<HTMLElement>('[class*="editorActions"]')
  if (row === null) return undefined
  const buttons = Array.from(row.querySelectorAll<HTMLElement>('button'))
  if (buttons.length < 2) return undefined
```

**依据 10 · 源码核查**：[src/client/injection/models-page-editor.ts:1454-1480](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/injection/models-page-editor.ts#L1454-L1480)

识别失败设置全局降级标记；成功绑定Save标记与Cancel清理。

<details>
<summary>查看原文（27行）</summary>

```text
      // The official action row is the signal this row's landing write hangs
      // on (C2): wire its two buttons. A row whose buttons no tier can name
      // flips the global degrade flag, so the landing decision falls back to
      // "the card went away, write it" instead of silently dropping the edit.
      // No guard on the route's current markers: a REOPENED card is a new
      // element whose buttons must be wired again, and `wireOnce`'s WeakSet
      // already collapses every repeat within one element.
      const actions = actionsOf(target.card, labels)
      if (actions === undefined) {
        state.signalsUnavailable = true
      } else {
        // A readable row is positive evidence the signal works: clear the
        // degrade flag so one transient unreadable card does not disable the
        // "commits with the official Save" gate for the rest of the session.
        state.signalsUnavailable = false
        // Resolve the route AT CLICK TIME: a create card's Provider ID can be
        // (re)typed after the buttons were first wired, and React reuses the
        // button element -- a captured route would mark / clear the wrong one.
        wireOnce(actions.submit, state.submitWired, () => {
          const live = routeOfCard(target.card, providers, labels)?.route ?? route
          state.committing.add(live)
          persistLedger(state)
        })
        wireOnce(actions.cancel, state.cancelWired, () => {
          const live = routeOfCard(target.card, providers, labels)?.route ?? route
          forgetRoute(state, live)
        })
```

</details>

**依据 11 · 源码核查**：[src/client/injection/models-page-editor.ts:919-959](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/injection/models-page-editor.ts#L919-L959)

实际flush条件为commit或signalsUnavailable，另受writable和card fence约束。

<details>
<summary>查看原文（41行）</summary>

```text
async function flushQueued(deps: InjectorDeps, state: ScanState, ignoreFence = false): Promise<boolean> {
  // A commit marker with nothing queued is SPENT: the official Save carried no
  // plugin edit (or the route was already landed). Dropping it here keeps it
  // from authorizing a later edit the user never saved.
  for (const route of [...state.committing]) {
    if (!state.queued.has(route)) state.committing.delete(route)
  }
  // Writability is the document's call, not the commit signal's: a memory /
  // non-loopback page refuses writes, and the held ledger obeys the same gate
  // the staged ledger already does. Wait for a landable route before paying
  // for the read, so a page whose intents are all uncommitted costs nothing.
  const landable = [...state.queued.keys()]
    .some(route => state.committing.has(route) || state.signalsUnavailable)
  if (!landable) {
    persistLedger(state)
    return false
  }
  const join = await deps.describeNamespace()
  if (join.writable !== true) {
    persistLedger(state)
    return false
  }
  let failed = false
  for (const [route, models] of [...state.queued]) {
    // The staged ledger has no official row whose Save could commit it; this
    // one does, so an uncommitted route waits instead of landing behind that
    // card's frozen revision baseline.
    const committed = state.committing.has(route)
    if (!committed && !state.signalsUnavailable) continue
    // One read, one mutate for the whole route: the held intents are per model
    // but the document is a single models array, so a per-model write was
    // rebuilding and rewriting that same array N times.
    const intents: RowIntent[] = [...models].map(([modelId, write]) => ({
      modelId,
      efforts: write.efforts,
      ...(write.compat === undefined ? {} : { compat: write.compat }),
      ...(write.input === undefined ? {} : { input: write.input }),
      ...(write.clearCompatKeys === undefined ? {} : { clearCompatKeys: write.clearCompatKeys }),
      ...(write.defaultEffort === undefined ? {} : { defaultEffort: write.defaultEffort }),
    }))
    const results = await writeModelRows(deps.api, route, intents, undefined, ignoreFence ? undefined : officialCardOpen)
```

</details>

**依据 12 · 源码核查**：[src/client/injection/models-page-editor.ts:450-468](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/injection/models-page-editor.ts#L450-L468)

unload忽略card fence尝试flush，再清ledger，不能一概称刷新丢全部草稿。

<details>
<summary>查看原文（19行）</summary>

```text
export function flushOnUnload(state: ScanState, deps: InjectorDeps): void {
  // The page is going away: an open card's frozen baseline no longer matters,
  // so the in-flight fence must not block this last best-effort landing.
  void (async () => {
    try {
      await flushQueued(deps, state, true)
      await flushPending(deps, state, true)
    } catch (error) {
      console.error(`[bre] unload flush failed: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      try {
        ledgerStorage()?.removeItem(LEDGER_KEY)
      } catch {
        // Disabled storage: nothing to clear.
      }
    }
  })()
}

```

</details>

#### 缺口

- 官方UI Save/取消、HMR、刷新和不同peer版本未执行，配置还原与总时间/费用未知。
  **影响**：不能承诺保存无损、即装兼容或停用自动恢复原行为。
  **进一步探讨**：副本profile以已知原文档验证两阶段Save、冲突/取消和刷新，停用后diff并按备份恢复再看wire。
- 按钮锚点失效时signalsUnavailable在多route扫描与取消/导航/卸载中的实际时序未执行。
  **影响**：不能保证未点击Save的扩展草稿不落盘，取消/刷新不能当统一撤销。
  **进一步探讨**：副本profile分别使按钮全部不可识别/仅一route不可识别，编辑后取消、导航、刷新、停用，比较实际settings文档并还原备份。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁可小范围试用，如何检验有效配置而非只看UI？

**研究主题**：采用判断、新假设与验证

#### 完整回答

愿意维护第三方route且能看配置/请求的DSH网页用户，可在备份或副本profile对一个已知模型试用：先确认host config路由可读，核对自动填充开关；记录原reasoning/input/compat/headers，手动审核一条建议和wire映射，保存后重开卡确认，发最小受控请求检查上游接受与实际参数，再试可识别按钮与锚点失效降级下的取消/导航/刷新/冲突/停用恢复，不能把Cancel或卡片消失当一致撤销。避开同origin不同UA混用；不需要自动修改者先确保前后台开关均确实生效。没有请求验收前不批量套知识库或默认升High。

可推导的改进是“声明—有效请求对照”：把建议来源和置信度、保存后的实际配置、guard是否注入、线上请求effort/模态字段合成可核查的诊断记录，对无法确认的模型标未验证，而非用列表数量背书。现有wire-preview和guard诊断不是实际服务接受证据，未来可在用户明确发起的一次小请求后记录接受/拒绝及可选任务结果；不默认遍历付费模型，也不存凭据/原提示。

依据是静态/协议推断与上游实际不等价、defaultGuard及origin UA会改变请求以及保存是两阶段。最小比较固定route/model和任务，对原手写配置、插件建议未确认、诊断确认后三种状态检查UI/配置/wire一致率、上游拒绝、人工排错与任务质量/用量。若只能显示更多档位却不减少不一致，或请求成本/质量恶化，则否定净改进；停止后恢复备份官方字段并移除插件，不把UI显示高档位当推理收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/knowledge.ts:1684-1718](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/knowledge.ts#L1684-L1718)

推断非实际能力证明，支持有效请求对照假设。

<details>
<summary>查看原文（35行）</summary>

```text
  // L2 missed: the ladder comes from protocol inference. An explicit endpoint
  // "reasons" upgrades confidence to medium -- support is confirmed, but the
  // level set and spellings are inferred, so the user should double-check.
  const protocol = inferProtocol(route)
  const efforts = PROTOCOL_INFERENCE[protocol] ?? GENERIC_FALLBACK
  const compatBase: CompatSuggestion | undefined = normalize(route.api) === COMPAT_CAPABLE_PROTOCOL
    ? { thinkingFormat: 'openai', supportsReasoningEffort: true }
    : undefined
  const compatWithBudget = compatBase !== undefined && isSelfHostedEndpoint(route.baseURL)
    ? { ...compatBase, thinkingTokenBudgetField: 'thinking_token_budget' as const }
    : compatBase
  const compat = withRolePin(compatWithBudget, route, true)
  if (endpoint?.reasoning === true) {
    return {
      efforts: { ...ENDPOINT_CONFIRMED_LADDER },
      ...(ENDPOINT_CONFIRMED_LADDER['medium'] !== undefined ? { defaultEffort: 'medium' as const } : {}),
      // compat was already gated to the protocol above; no second gate.
      ...(compat === undefined ? {} : { compat }),
      matched: false,
      source: 'endpoint:' + (endpoint.source ?? 'listing'),
      confidence: 'medium',
      ...endpointPart,
      ...modalityParts,
    }
  }
  return {
    efforts,
    // Inferred ladders default to medium (the convention codex/OpenAI set for
    // their own ladders) whenever the inferred set carries it.
    ...(efforts['medium'] !== undefined ? { defaultEffort: 'medium' as const } : {}),
    ...(compat === undefined ? {} : { compat }),
    matched: false,
    source: 'protocol:' + protocol,
    confidence: 'low',
    ...endpointPart,
```

</details>

**依据 2 · 源码核查**：[src/client/ComposerSlider.tsx:369-397](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/ComposerSlider.tsx#L369-L397)

select成功/拒绝仅会话选择，不代上游验收。

<details>
<summary>查看原文（29行）</summary>

```text
      const current = state.current
      if (current === null) throw new Error(t('sliderNoCurrent'))
      const outcome = await directory.select({
        provider: current.provider,
        model: current.model,
        reasoningEffort: next,
      })
      // Kernels through 0.1.6-alpha.1 reject by throwing; 0.1.6-alpha.2
      // resolves the refusal result instead. Normalizing it into a throw keeps
      // the optimistic rollback and the in-menu error line identical.
      const refusal = selectRefusalMessage(outcome)
      if (refusal !== undefined) throw new Error(refusal)

      const snapshot = directory.store.getSnapshot()
      const accepted = effortIndex(levels, snapshot.current?.reasoningEffort)
      const settled = accepted >= 0 ? accepted : index
      const settledId = levels[settled]?.id ?? next
      committedRef.current = settledId
      previewRef.current = settled
      setEffort(settledId)
      setPreview(settled)
    } catch (cause) {
      const restore = Math.max(0, effortIndex(levels, previous))
      committedRef.current = previous
      previewRef.current = restore
      setEffort(previous)
      setPreview(restore)
      setLocalError(cause instanceof Error ? cause.message : String(cause))
    } finally {
```

</details>

**依据 3 · 源码核查**：[src/index.ts:387-424](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/index.ts#L387-L424)

guard实际注入是需要观察的请求改变。

<details>
<summary>查看原文（38行）</summary>

```text
function guardCallConfig(cfg: Record<string, unknown>, section: unknown, report: GuardReport): Record<string, unknown> {
  try {
    if (typeof cfg['reasoningEffort'] !== 'undefined') return cfg
    const provider = cfg['provider']
    const modelId = cfg['model']
    if (typeof provider !== 'string' || typeof modelId !== 'string') return cfg
    // Counted from here on: an effort-less call that names what it talks to is
    // exactly the population this guard exists to judge. Every refusal below
    // (an unreadable section, an unlisted model, a ladder that can switch
    // thinking off) raises `inspected` without raising `injected`, so a
    // deployment where the guard never fires is visible instead of silent.
    report.inspected += 1
    if (!isRecord(section)) return cfg
    const providers = section['providers']
    if (!isRecord(providers)) return cfg
    const profile = providers[provider]
    if (!isRecord(profile)) return cfg
    const rawModels = profile['models']
    if (!Array.isArray(rawModels)) return cfg
    const row = rawModels.find((candidate): candidate is Record<string, unknown> =>
      isRecord(candidate) && candidate['id'] === modelId)
    if (row === undefined || !isRecord(row['reasoningEfforts'])) return cfg
    const profileDefault = typeof profile['reasoning'] === 'string' ? profile['reasoning'] : undefined
    const facts = routeFactsOf({ providers: { [provider]: profile } }, provider)
    const suggestion = suggestEfforts(modelId, facts)
    const level = resolveGuardEffort({
      declared: row['reasoningEfforts'] as ReasoningEfforts,
      vendorDefault: suggestion.defaultEffort,
      profileDefault,
      requested: undefined,
    })
    if (level === undefined) return cfg
    report.injected += 1
    report.lastInjection = { provider, model: modelId, level }
    return { ...cfg, reasoningEffort: level }
  } catch {
    return cfg
  }
```

</details>

**依据 4 · 源码核查**：[src/headers-fetch.ts:83-101](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/headers-fetch.ts#L83-L101)

origin UA覆盖是请求变化的另一来源。

<details>
<summary>查看原文（19行）</summary>

```text
    for (const entry of entries.values()) {
      userAgent = overrideFor(entry.index(), url)
      if (userAgent !== undefined) break
    }
    if (userAgent === undefined) return base(input, init)
    const headers = seedHeaders(input, init)
    headers.set('user-agent', userAgent)
    return base(input, { ...init, headers })
  }
}

/** Handle one activation keeps; `dispose` is idempotent. */
export interface HeaderOverlayHandle {
  /** Remove this activation's entry, restoring the original fetch when it was the last. */
  dispose(): void
}

/** Handle for tests and the caller to swap the index a live activation reads. */
export interface HeaderOverlay extends HeaderOverlayHandle {
```

</details>

**依据 5 · 源码核查**：[src/client/ops.ts:465-499](https://github.com/HaoyueQin/dsh-better-reasoning-effort/blob/2d68b65cc641cd85e95384c859a2bc3de23d9e08/src/client/ops.ts#L465-L499)

持久写成功/拒绝需独立确认。

<details>
<summary>查看原文（35行）</summary>

```text
      // baseline. Aborting consumes nothing -- every row stays for a retry.
      if (abort?.() === true) return rows.map(() => ({ ok: false, aborted: true }))
      const response = await api.settings.mutate(
        PI_AI_NS,
        // The rebuilt models array is JSON-shaped by construction (a settings
        // document is JSON); the value is JsonValue on this baseline, so the
        // set op asserts once instead of rebuilding the row's type.
        [{
          op: 'set',
          path: ['providers', route, store.kind === 'models' ? 'models' : 'modelOverrides'],
          value: store.kind === 'models' ? nextModels : nextOverrides,
        } as unknown as SettingsPathOpView],
        join.namespace.revision,
      )
      if (!response.ok) {
        // The stable wire code, not the message prose: 'settings/conflict'
        // (the Typert refusal code) means a concurrent writer moved the
        // namespace between our describe and mutate.
        if (attempt === 0 && response.error.code === 'settings/conflict') continue
        const looksCompat = response.error.code === 'settings/rejected' && looksLikeCompatRefusal(response.error.message)
        if (!downgraded && looksCompat && rows.some(row => row.compat !== undefined)) {
          downgraded = true
          continue
        }
        return rows.map(() => ({ ok: false, error: response.error.message }))
      }
      return rows.map(() => ({ ok: true }))
    } catch (error) {
      return rows.map(() => ({ ok: false, error: error instanceof Error ? error.message : String(error) }))
    }
  }
  return rows.map(() => ({ ok: false, error: 'conflict' }))
}

/**
```

</details>

#### 缺口

- 诊断对照能否降低误配、是否增加请求成本/隐私负担未测。
  **影响**：未来方案不能算当前能力或收益，不保证更多思考改善任务。
  **进一步探讨**：先以一模型低成本受控请求做wire一致与质量比较，无净改善就保留原配置。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
