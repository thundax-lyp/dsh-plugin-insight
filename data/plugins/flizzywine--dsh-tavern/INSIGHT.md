# dsh-tavern

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[ac0e298](https://github.com/flizzywine/dsh-tavern/tree/ac0e298ac29f76fd45f09fa7c28af12916832a55)

<!-- BEGIN META -->
[![GitHub ★ 1,314](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C314&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/flizzywine/dsh-tavern) [![npm 30d 1,273](https://img.shields.io/static/v1?label=npm+30d&message=1%2C273&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-profile-tavern) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-profile-tavern)
<!-- END META -->

> **实现功能**：高度定制的DSH酒馆Profile，以前台叙事、后台状态结算和角色卡资源支持连续剧情互动。

> **核心亮点**：[Q01](#research-q01)、[Q02](#research-q02)识别的具体贡献是把正文成功与派生结算成功解耦：后台失败保留正文，旧revision结果被拒绝。[Q05](#research-q05)的隔离effect与身份守卫降低直接旧草稿覆盖当前状态的风险。角色卡、脚本和酒馆基本形态有既有基线，不将全部生态包装成原创；正文可用性收益尚需实际任务度量。

> **风险与缺陷**：[Q03](#research-q03)指出正文先提交且下一轮不阻塞会让变量落后剧情。版本守卫拒绝旧结果，却不证明新变量语义正确，也不能回滚脚本外部动作；外部副作用后的禁重试正说明边界。若状态密集任务持续用旧值决策，保住正文不足以认定合格交付。

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
  - [Q01 · 它给角色卡长篇互动增加什么，交付是什么？](#detail-section-11)
  - [Q02 · 为什么后台失败不再把已经生成的正文撤掉？](#detail-section-12)
  - [Q03 · 正文不中断是否保证下一轮状态一致，重试是否安全？](#detail-section-13)
  - [Q04 · 以什么方式试用，钱和人工花在哪里？](#detail-section-14)
  - [Q05 · 可以借鉴的提交模式到哪里为止？](#detail-section-15)
  - [Q06 · 怎样缓解状态滞后而保留正文先到的价值？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向用角色卡、世界书和变量设定进行连续剧情的人，合格结果同时包括可读正文、可回溯分支以及与剧情一致的角色/变量状态。普通提示词加手工记账或既有酒馆中的脚本是直接基线，不因界面或功能表更长就认定替代品不能完成任务。

本项目把前台叙事和后台状态职责拆开：前台正文提交后继续交互，后台单独提取姿态、变量或插件结算。已读实现支持这条分工；README更丰富文笔、约10秒和95%缓存属于作者报告，不能当本轮模型对照结果。角色卡/SillyTavern兼容也需具体格式和脚本逐项检查，非全生态兼容认证。

根仓库是高度定制的酒馆Profile和独立应用通道，包含内部tavern-plugin，不是一个适合继续npm装入任意DSH的普通插件。将其研究价值归为“长篇互动的正文与派生状态提交取舍”，比把整个酒馆生态都记为新原创更准确。

固定卡片、模型、预算，对比提示词加手工状态、既有酒馆脚本和整轮等待；分别度量正文可用、变量正确、纠错时间和全调用费用，不重复作者竞品概括。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件与边界 |
|---|---|---|
| 角色卡/世界书 | 剧情设定 | 作者兼容声明非全卡验收 |
| 前台叙事 | 先交付正文 | 成功正文不等变量已更新 |
| 后台姿态/MVU | 补派生状态 | 浏览器可用、operation及版本匹配 |
| 再生成/分支 | 替换正文并使旧结算失效 | 需要正确timeline身份 |
| 手动设计/账本 | 独立派生任务 | 与每轮自动结算区分 |
| 调试/备份迁移 | 维护资源与恢复 | 需人工核对，不混读新旧目录 |

**流程与依赖**

#### 启动与依赖

| 条件 | 必需范围 | 用途与缺失后果 |
|---|---|---|
| 官方DSH 0.2.x rc2+ | 桌面 | 社区Desktop/NEXT不作为支持通道 |
| Node22.19+与pnpm | 独立CLI | launcher与独立DSH运行 |
| Android11+/ARM64 | APK | 独立应用，不与桌面同安装方式 |
| 模型provider/密钥 | 生成与结算 | 额外后台调用与格式能力需验证 |
| 浏览器脚本执行器 | MVU | 不可用则deferred，并非状态已完成 |
| 可用备份/档案副本 | 试用迁移 | 无备份难以核对与退出 |

#### 启动步骤

| 步骤 | 执行者动作 | 验收/异常处理 |
|---|---|---|
| 1 | 用户备份旧档并固定通道/版本 | 不让旧host混读新目录 |
| 2 | 按官方桌面或独立CLI/APK安装 | 不用弃用npm路径 |
| 3 | 配模型并导入一张受控卡片 | 核对脚本与变量而非只看页面 |
| 4 | 生成正文并检查后台receipt | pending不当已更新，失败保正文复核 |
| 5 | 试故障/回退后决定继续 | 状态错位停止，保备份切回原host |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | host/独立应用、模型额度、档案磁盘 | 备份、固定通道、导入卡片 | 脚本兼容需逐卡核对 |
| 持续 | 前台+后台结算、重写调用 | 复核剧情与变量、维护卡片 | 金额和净缓存收益未知 |
| 失败恢复 | 重试调用、备份空间 | 检查pending、旧值、外部动作 | 外部动作不能据草稿回滚 |
| 迁移退出 | 保留旧档与备份 | 禁旧host混读，切回并重启 | 迁移完整性本轮未实测 |

#### 效果

| 效果项 | 当前支持 | 未确定 |
|---|---|---|
| 保正文 | 前台成功先提交，结算失败不撤回 | 真实首显和连续体验净收益 |
| 迟到保护 | branch/revision/lifecycle/swipe守卫 | 全进程恰好一次、外部动作安全 |
| 变量结算 | 隔离草稿/验证/operation effect | 模型语义与下一轮旧值错误率 |
| 性能文笔 | 作者速度/缓存/质量报告 | 同模型卡片独立对照 |

> **思考**：[Q03](#research-q03)指出正文先提交且下一轮不阻塞会让变量落后剧情。版本守卫拒绝旧结果，却不证明新变量语义正确，也不能回滚脚本外部动作；外部副作用后的禁重试正说明边界。若状态密集任务持续用旧值决策，保住正文不足以认定合格交付。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)识别的具体贡献是把正文成功与派生结算成功解耦：后台失败保留正文，旧revision结果被拒绝。[Q05](#research-q05)的隔离effect与身份守卫降低直接旧草稿覆盖当前状态的风险。角色卡、脚本和酒馆基本形态有既有基线，不将全部生态包装成原创；正文可用性收益尚需实际任务度量。

[Q01](#research-q01)、[Q02](#research-q02)识别的具体贡献是把正文成功与派生结算成功解耦：后台失败保留正文，旧revision结果被拒绝。[Q05](#research-q05)的隔离effect与身份守卫降低直接旧草稿覆盖当前状态的风险。角色卡、脚本和酒馆基本形态有既有基线，不将全部生态包装成原创；正文可用性收益尚需实际任务度量。

值得复用的是把模型生成的派生修改先制成可序列化、operation-scoped effect，再用当前版本的守卫发布。effect只允许messages/variables/mvu/tavernScriptPrompts，带chat/session与分支版本；expected value防止覆盖自草稿创建后已变的值。对于有范围的消息修改，先准备所有行再发布，避免校验到一半时已经部分写入。

这优于直接保存整份旧聊天对象，但原子范围是当前effect的发布步骤；ADR明确不是正文和后台状态的同一存储事务。transaction隔离还禁止真实跨chat global差异，只允许特定runtime标记；不代表任意用户脚本都被安全沙箱隔离。移植需宿主具有稳定分支/revision、swipe/lifecycle身份和明确的副作用接口，否则照搬操作ID字段不会自动获得这些保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)指出正文先提交且下一轮不阻塞会让变量落后剧情。版本守卫拒绝旧结果，却不证明新变量语义正确，也不能回滚脚本外部动作；外部副作用后的禁重试正说明边界。若状态密集任务持续用旧值决策，保住正文不足以认定合格交付。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)仅建议能管理备份和变量的角色卡用户用独立档案试用，固定卡片与模型先验收状态再看速度。状态反复错位、丢档或脚本外部动作异常即停；保留日志与备份，按原通道退出，不混读迁移后目录。

本项目把前台叙事和后台状态职责拆开：前台正文提交后继续交互，后台单独提取姿态、变量或插件结算。已读实现支持这条分工；README更丰富文笔、约10秒和95%缓存属于作者报告，不能当本轮模型对照结果。角色卡/SillyTavern兼容也需具体格式和脚本逐项检查，非全生态兼容认证。

根仓库是高度定制的酒馆Profile和独立应用通道，包含内部tavern-plugin，不是一个适合继续npm装入任意DSH的普通插件。将其研究价值归为“长篇互动的正文与派生状态提交取舍”，比把整个酒馆生态都记为新原创更准确。

最低验证应把同一脚本化卡片、模型和后台延迟分到当前先提交、整轮等待、选择性状态门控三组，注入一次结算失败与一次过期回包，比较正文首显、状态相关错误、纠错时间和总调用费。若门控无法识别状态依赖、误拦截多或正确率没有提高，就放弃，不以多一个状态徽章算成功。 见[Q06](#research-q06)，该方案不计入现有创新贡献。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持正文先提交、后台版本绑定和隔离effect发布；文笔、速度、缓存及变量语义正确性未独立验证。选择性状态门控为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、bin/dsh-tavern.mjs、docs/adr/0006-foreground-commits-before-derived-settlement.md、tavern-plugin/lib/domain/settlement-jobs.js、tavern-plugin/lib/domain/background-pipeline.js、tavern-plugin/lib/domain/settlement-turn.js、tavern-plugin/lib/domain/mvu-settlement-transactions.js、tavern-plugin/lib/domain/mvu-settlement-effect.js、tavern-plugin/lib/domain/round-history.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交源码研究，深入正文/结算提交边界、jobs、MVU草稿和effect守卫；不执行host、模型、安装或目标测试，不审计全部卡片/用户脚本、第三方插件、Android/桌面打包或上游data目录。作者速度缓存/文笔报告不是本轮结果。
- 下一步：以独立档案注入后台延迟/失败、过期回包、脚本忙和浏览器断线，记录正文保留、变量水位、重复外部动作和回退；普通未执行host属于本轮源码研究边界，不据此虚造故障。

**分析版本**

- **仓库**：[flizzywine/dsh-tavern](https://github.com/flizzywine/dsh-tavern)
- **版本号**：3.1.0（[固定提交 ac0e298](https://github.com/flizzywine/dsh-tavern/tree/ac0e298ac29f76fd45f09fa7c28af12916832a55)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是为正文和派生状态分别显示revision水位，仅当用户下一步显式依赖未结算变量时暂停该动作或先确认旧状态；普通阅读/无状态对话继续。它来自Q03中“不阻塞下一轮”与旧值风险的张力，不是现有已实现能力。

最低验证应把同一脚本化卡片、模型和后台延迟分到当前先提交、整轮等待、选择性状态门控三组，注入一次结算失败与一次过期回包，比较正文首显、状态相关错误、纠错时间和总调用费。若门控无法识别状态依赖、误拦截多或正确率没有提高，就放弃，不以多一个状态徽章算成功。 见[Q06](#research-q06)，该方案不计入现有创新贡献。

以独立档案注入后台延迟/失败、过期回包、脚本忙和浏览器断线，记录正文保留、变量水位、重复外部动作和回退；普通未执行host属于本轮源码研究边界，不据此虚造故障。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 96 | 10390 | 8955 | 850 | — |
| .md | source | 229 | 26977 | — | — | 526563 |
| .js | source | 648 | 159309 | 139039 | 15342 | — |
| .cjs | source | 3 | 913 | 782 | 85 | — |
| .md | example | 13 | 575 | — | — | 10220 |
| .mjs | example | 67 | 3679 | 3342 | 236 | — |
| .js | example | 3 | 169 | 145 | 17 | — |
| .ts | source | 4 | 274 | 248 | 6 | — |
| .mjs | test | 755 | 72693 | 66499 | 2468 | — |
| .md | test | 3 | 267 | — | — | 6643 |
| .cjs | example | 1 | 118 | 109 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/flizzywine/dsh-tavern/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 100](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=100&color=737b86&logo=github)](https://github.com/flizzywine/dsh-tavern/issues?q=is%3Aissue+created%3A2026-09-27T02%3A10%3A23.554Z..2026-10-27T02%3A10%3A23.554Z) [![近30天关闭 99](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=99&color=737b86&logo=github)](https://github.com/flizzywine/dsh-tavern/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A10%3A23.554Z..2026-10-27T02%3A10%3A23.554Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：正文先提交与派生状态后结算的收益和一致性边界能否支撑角色卡试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它给角色卡长篇互动增加什么，交付是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向用角色卡、世界书和变量设定进行连续剧情的人，合格结果同时包括可读正文、可回溯分支以及与剧情一致的角色/变量状态。普通提示词加手工记账或既有酒馆中的脚本是直接基线，不因界面或功能表更长就认定替代品不能完成任务。

本项目把前台叙事和后台状态职责拆开：前台正文提交后继续交互，后台单独提取姿态、变量或插件结算。已读实现支持这条分工；README更丰富文笔、约10秒和95%缓存属于作者报告，不能当本轮模型对照结果。角色卡/SillyTavern兼容也需具体格式和脚本逐项检查，非全生态兼容认证。

根仓库是高度定制的酒馆Profile和独立应用通道，包含内部tavern-plugin，不是一个适合继续npm装入任意DSH的普通插件。将其研究价值归为“长篇互动的正文与派生状态提交取舍”，比把整个酒馆生态都记为新原创更准确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-24](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/README.md#L12-L24)

用途、兼容和性能均保留作者主张边界。

<details>
<summary>查看原文（13行）</summary>

```text
**基于 DSH（DeepSeek Harness）的 Agent 酒馆。兼容 SillyTavern 生态，人物卡导入就能玩。**

更快 · 更稳 · 更鲜活 · 所有模型都能用 · 手机也能玩

[![观看 3 分钟实机演示：兼容酒馆生态，更快、更稳、更鲜活](docs/images/readme/promo-video.jpg)](https://www.bilibili.com/video/BV1MHaU6NE7S/)

[下载安装](#快速开始) · [使用文档](https://flizzywine.github.io/dsh-tavern/) · [宣传视频](https://www.bilibili.com/video/BV1MHaU6NE7S/) · [Discord 交流群](https://discord.gg/hYAEjKnpra)

- **兼容 SillyTavern 生态**：人物卡、世界书、预设、正则美化、MVU、酒馆助手脚本，导入就能用。
- **更快**：一轮约 10 秒，缓存命中率 95% 以上。
- **更稳**：状态栏不再掉格式。变量由后台按规则结算，每轮附更新结果，失败可单独重试；更新与重装都保留数据。
- **更鲜活**：同样的模型、同样的预设，比原版酒馆更有活人感。因为前台模型只管写正文，变量结算等任务性工作交给后台模型。
- **手机也能玩**：Android 手机直接安装；电脑上运行的酒馆，手机扫码就能远程游玩。
```

</details>

**依据 2 · 作者声明**：[README.md:51-85](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/README.md#L51-L85)

原文、姿态/变量与手动辅助任务分工。

<details>
<summary>查看原文（35行）</summary>

```text
### 长期记忆

每轮正文完整保存，Agent 需要时自己回查原文，不靠摘要硬记；配合上下文压缩，玩到几百层仍能记起开局的细节。[了解更多 →](https://flizzywine.github.io/dsh-tavern/#d06)

### 对话式修改人物卡

不用懂卡片字段，告诉 Agent 哪里不喜欢、想改成什么样，它先给方案，你确认后才写入。也能从小说里提取人物做新卡，或用同样方式修改世界书和预设。[了解更多 →](https://flizzywine.github.io/dsh-tavern/#h04)

![卡片模式：与 Agent 对话修改人物卡，右侧为人物卡字段](docs/images/readme/card-editor.png)

### 人物卡转 MVU 版，状态栏不再掉格式

正文里的状态栏老是掉格式？让 Agent 把人物卡转成 MVU 版：前台只写正文，变量由后台按规则结算，状态栏常驻右侧，原卡图片和设定都保留。[了解更多 →](https://flizzywine.github.io/dsh-tavern/#h07)

### 自助调试 Agent

正则没生效、美化显示不对、状态栏没更新？在右侧展开「遇到显示或生成问题？」，点「交给卡片 Agent 调试」，Agent 会读取这局的实际游玩记录和日志，分析原因并修改相关资源，不用自己翻配置猜问题。[了解更多 →](https://flizzywine.github.io/dsh-tavern/#h08)

### Guide：给这一局注入上下文指引

想要的写法、节奏或剧情走向写成一条 Guide，比如“多写心理活动，对白不超过三句”“好感度涨得慢一点”。它会注入上下文，之后每轮正文、候选和变量结算都会参考，不用每次重复。[了解更多 →](https://flizzywine.github.io/dsh-tavern/#b09)

### 带意见重写

不满意这轮回复，写上哪里要改，比如“保留事件，但减少旁白解释”，只重写这一轮，比反复抽卡更可控。[了解更多 →](https://flizzywine.github.io/dsh-tavern/#b07)

![带意见重写当前正文，右侧为本局 Guide](docs/images/readme/rewrite-body.png)

### 后台人物设计

重要人物登场时，后台为其设计完整档案：动机、性格、外貌、说话方式、与主角的关系，之后反复出场都按同一套设定来，不会前后走样。已有设定直接复用，不重复造人。[了解更多 →](https://flizzywine.github.io/dsh-tavern/#d10)

### 写作 Skill

把写作教程或喜欢的样文交给 Agent，提炼成场景写作 Skill，比如打斗、悬疑、感情戏各有一套写法；游玩时模型按场景自动选用。[了解更多 →](https://flizzywine.github.io/dsh-tavern/#m04)
```

</details>

**依据 3 · 作者声明**：[README.md:113-119](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/README.md#L113-L119)

弃用npm及高度定制Profile的明确安装边界。

```text
## 快速开始

> **请不要从 npm 下载或安装本项目。** 由于对 DSH 的定制改动较多，DSH Tavern 无法作为常规 DSH 插件安装使用。npm 上的 `dsh-profile-tavern` 已标记弃用，不再维护；请按下方对应平台的方式安装。

**桌面版仅支持官方 DeepSeek Harness，不再支持社区 DSH Desktop 或 DSH NEXT。** 从社区版迁移前请备份数据，再按[数据导入说明](docs/data-import.md)导入；Android 和独立命令行版继续支持。

当前版本适配 **DSH 0.2.x**（0.2.0-rc.2 起）。还在用 DSH 0.1.5（DSH Desktop 2.0.13、旧一键安装包）的，请用[稳定版](#稳定版dsh-015)。安装前建议备份 `.dsh` 目录。
```

#### 缺口

- 相同卡片、模型和预算下正文质量与变量正确率未知
  **影响**：不能以宣传速度缓存或功能广度证明收益
  **进一步探讨**：固定角色卡任务对比手工状态与现有酒馆流程，分别验收正文和变量

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 为什么后台失败不再把已经生成的正文撤掉？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

ADR0006明确采用前台先提交：成功正文、checkpoint与Story Timeline revision先形成；后台operation绑定branch/revision，成功补派生状态和receipt，失败保留正文并呈现可重试错误。它替代原子整轮中因后台缺少提交而撤掉好正文的设计，这是作者对设计动机的说明，不是本轮复现过往故障。

settlement-jobs用chatId映射持有单个执行promise，同chat重复start复用已有任务；每项有abort controller，dispose终止生命周期。它负责进程内执行所有权，持久资格仍归timeline，不能由Map推导崩溃后全局恰好一次。background-pipeline把当前需要的姿态和插件工具合并，提示允许的结算；角色设计和账本另有手工任务，不应混称所有前台工具自动全部后台执行。

再生成成功也先替换正文；旧分支/旧revision结算失效。这里解开的是正文可用性和结算完成的耦合，不是消除后台工作或模型费用。

#### 证据与依据

**依据 1 · 源码核查**：[docs/adr/0006-foreground-commits-before-derived-settlement.md:8-23](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/docs/adr/0006-foreground-commits-before-derived-settlement.md#L8-L23)

已接受的先提交、滞后与版本约束。

<details>
<summary>查看原文（16行）</summary>

```text
ADR 0004 把前台正文与后台结算设计成原子 Round。实践中，后台 Agent 偶发未调用提交工具时，系统会撤销已经成功且来之不易的正文；失败状态还会阻塞下一轮。后台派生工作的可靠性因此错误地成为正文可用性的前置条件。

## 决定

Foreground Turn 成功后立即提交正文、checkpoint 与新的 Story Timeline revision。状态结算是绑定该正文 branch/revision 的派生 Background Operation：成功时只提交姿势、变量和回执；失败时保留正文、记录错误并提供手动重试，但不阻塞下一次 Foreground Turn。

正文重新生成采用同一边界：新正文一旦生成和提交成功，就替换旧正文与模型 Surface；随后的结算失败不得触发 `replacement.abort`。只有前台生成、正文校验或正文提交失败时才恢复旧正文。

任何结算结果在应用前必须同时匹配其绑定的 branch 与 revision。若用户已回退、重新生成或提交了下一轮正文，旧结算结果成为 stale，不得覆盖当前派生状态。旧版停留在 `foreground-completed` 的存档在读取时惰性迁移为已提交正文，使既有失败会话也能继续。

## 结果

- 后台失败不会让成功正文消失，也不会锁死下一轮。
- 每轮正文都有独立 checkpoint，显式回退仍按正文逐轮工作。
- 后台状态允许暂时落后于正文；最新轮次可重试结算，过期结果直接丢弃。
- 前台与后台不再是一个存储事务，但版本校验阻止迟到写入污染新剧情。
```

</details>

**依据 2 · 源码核查**：[tavern-plugin/lib/domain/settlement-jobs.js:1-48](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/tavern-plugin/lib/domain/settlement-jobs.js#L1-L48)

进程内单chat所有权、abort和dispose。

<details>
<summary>查看原文（48行）</summary>

```text
/** Own in-memory settlement executions; durable eligibility remains in the timeline. */
export function createSettlementJobs({ run, onSettled }) {
  const jobs = new Map()
  const lifetime = new AbortController()
  let disposed = false

  function start(chatId) {
    if (disposed) return Promise.resolve()
    const existing = jobs.get(chatId)
    if (existing) return existing.promise
    const job = { controller: new AbortController(), promise: null }
    const signal = AbortSignal.any([job.controller.signal, lifetime.signal])
    job.promise = Promise.resolve().then(() => {
      signal.throwIfAborted()
      return run(chatId, signal)
    }).finally(async () => {
      if (jobs.get(chatId) === job) jobs.delete(chatId)
      // Cancellation/deletion must not publish a new wake before their durable
      // stop is saved. Shutdown likewise cannot restart work from finally.
      if (!disposed && !signal.aborted) await onSettled(chatId, signal)
    })
    jobs.set(chatId, job)
    return job.promise
  }

  /** The running job of a chat (settled either way), or null. */
  function pending(chatId) {
    const job = jobs.get(chatId)
    return job ? job.promise.catch(() => {}) : null
  }

  async function cancel(chatId, { wait = true } = {}) {
    const job = jobs.get(chatId)
    if (!job) return false
    job.controller.abort()
    if (!wait) jobs.delete(chatId)
    else await job.promise.catch(() => {})
    return true
  }

  function dispose() {
    disposed = true
    lifetime.abort()
    for (const job of jobs.values()) job.controller.abort()
    jobs.clear()
  }

  return Object.freeze({ start, pending, cancel, dispose })
```

</details>

**依据 3 · 源码核查**：[tavern-plugin/lib/domain/background-pipeline.js:23-55](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/tavern-plugin/lib/domain/background-pipeline.js#L23-L55)

组合结算工具与本轮约束。

<details>
<summary>查看原文（33行）</summary>

```text
export function createSettlementItems({ items = () => [], plugins = () => null } = {}) {
  const own = () => (items() || []).filter(Boolean)

  return Object.freeze({
    /** Every item's tools, in the fixed order of the cached prefix. */
    tools() { return [...own().flatMap(item => item.tools()), ...(plugins()?.tools() || [])] },
    has(name) { return own().some(item => item.has(name)) || Boolean(plugins()?.has(name)) },
    /** Whether an item needs the settlement to run although posture and variables are off. */
    async wanted(context = {}) {
      for (const item of own()) if (typeof item.wanted === 'function' && await item.wanted(context)) return true
      return false
    },
    /** One settlement run's dispatcher; plugin tools are refused once the run has submitted. */
    calls(context, { stopped = () => false } = {}) {
      const group = plugins()
      const pluginCall = group ? group.calls(context) : null
      return async function call(name, args) {
        const item = own().find(entry => entry.has(name))
        if (item) return item.call(name, args, context)
        if (!pluginCall || !group.has(name)) return undefined
        if (stopped()) return JSON.stringify({ ok: false, retryable: false, message: '当前任务已经提交完成，请结束本轮。插件工具请在提交结算之前调用。' })
        return pluginCall(name, args)
      }
    },
    /** This turn's notes: each Tavern item, then the plugins' tools and notes. */
    async text(context) {
      const group = plugins()
      const notes = group ? await group.sections(context) : []
      const parts = []
      for (const item of own()) parts.push(await item.section(context).catch(() => ''))
      const names = group ? await group.toolNames(context) : { available: [], unavailable: [] }
      parts.push(pluginText(names, notes))
      return parts.filter(Boolean).join('\n\n')
```

</details>

**依据 4 · 源码核查**：[tavern-plugin/lib/domain/background-pipeline.js:82-110](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/tavern-plugin/lib/domain/background-pipeline.js#L82-L110)

有序结算与独立手工任务。

<details>
<summary>查看原文（29行）</summary>

```text
/**
 * One turn's pipeline: stages run in order, each only when its condition holds.
 * The settlement job runs the closing stage (onSettled) once these are done and not stopped.
 */
export async function runPipelineStages(stages) {
  for (const stage of stages) {
    if (typeof stage.when === 'function' && !await stage.when()) continue
    await stage.run()
  }
}

// Manual settlement items: the player starts them; each runs as its own background task in the
// shared background session (the 'character-design' and 'ledger' roles), not inside a turn's settlement.
export const CHARACTER_DESIGN_ITEM = Object.freeze({
  id: 'tavern.character-design',
  trigger: 'manual',
  requirement: '本次执行用户手动发起的人物设计。设计意见留空时，根据当前剧情和已有档案，自行选择需要建立或补充设计的重要人物；有意见时优先遵循意见。',
  protocol: '先调用 skill 加载 character-design，再用 character_design_read 按姓名或别名检查本局世界书与已有档案。世界书已有该人物设定时调用 character_design_reuse 复用即可完成，不另建档案；只有缺少设定的新人物或已有设计档案的修订才调用 character_design_save。不得执行变量或姿势结算，不得改写正文。',
  system() { return this.requirement + this.protocol }
})

export function createLedgerItem({ rules }) {
  return Object.freeze({
    id: 'tavern.ledger',
    trigger: 'manual',
    requirement: '本次执行玩家手动发起的台账整理。台账是给玩家查阅的备忘录，整理后下一轮正文会参考一次。',
    rules,
    protocol: ({ from, through }) => '阅读给出的剧情（第 ' + from + '–' + through + ' 轮），对照当前台账，调用一次 ledger_submit 提交这些剧情带来的增量；没有变化也提交 {}。不得改写正文、变量或姿势。',
    system(range) { return this.requirement + this.protocol(range) + '\n\n' + this.rules }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 正文不中断是否保证下一轮状态一致，重试是否安全？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不能。ADR明确承认派生状态可落后正文，后台失败也不阻塞下一次前台。这意味着下一轮涉及装备、关系或位置时可能看到旧值；保住阅读连续性不等游戏状态始终正确。结构化提交能拒绝旧结果，却不能证明模型推导的新变量语义正确。

MVU事务使用隔离working copy，要求operationId、lifecycle及message/swipe匹配，脚本忙或浏览器执行器未ready时deferred；浏览器等待后重新读取最新聊天再次检查。随后恢复目标原文字段，只留下变量/派生修改，返回prepared effect，不直接把工作草稿整份覆盖当前聊天。外部副作用被观察到时某些错误标记retryable=false，说明“重试一次”不是对任意外部动作的撤销与重放保证。

effect应用限制根字段，核对chat/session、branch/revision、生命周期和swipe；expected values不符拒绝。这保护晚到提交，却不能追回脚本已发出的外部请求。也不能仅据同chat单flight宣称跨进程无重复或所有存储与脚本为同一事务。最影响采用的是用户如何看见pending和何时允许依赖新状态的下一步。

#### 证据与依据

**依据 1 · 源码核查**：[docs/adr/0006-foreground-commits-before-derived-settlement.md:12-23](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/docs/adr/0006-foreground-commits-before-derived-settlement.md#L12-L23)

下一轮不阻塞与状态滞后是显式取舍。

<details>
<summary>查看原文（12行）</summary>

```text
Foreground Turn 成功后立即提交正文、checkpoint 与新的 Story Timeline revision。状态结算是绑定该正文 branch/revision 的派生 Background Operation：成功时只提交姿势、变量和回执；失败时保留正文、记录错误并提供手动重试，但不阻塞下一次 Foreground Turn。

正文重新生成采用同一边界：新正文一旦生成和提交成功，就替换旧正文与模型 Surface；随后的结算失败不得触发 `replacement.abort`。只有前台生成、正文校验或正文提交失败时才恢复旧正文。

任何结算结果在应用前必须同时匹配其绑定的 branch 与 revision。若用户已回退、重新生成或提交了下一轮正文，旧结算结果成为 stale，不得覆盖当前派生状态。旧版停留在 `foreground-completed` 的存档在读取时惰性迁移为已提交正文，使既有失败会话也能继续。

## 结果

- 后台失败不会让成功正文消失，也不会锁死下一轮。
- 每轮正文都有独立 checkpoint，显式回退仍按正文逐轮工作。
- 后台状态允许暂时落后于正文；最新轮次可重试结算，过期结果直接丢弃。
- 前台与后台不再是一个存储事务，但版本校验阻止迟到写入污染新剧情。
```

</details>

**依据 2 · 源码核查**：[tavern-plugin/lib/domain/mvu-settlement-transactions.js:118-170](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/tavern-plugin/lib/domain/mvu-settlement-transactions.js#L118-L170)

操作ID、生命周期、swipe、忙碌与隔离草稿。

<details>
<summary>查看原文（53行）</summary>

```text
  async function settleMvuUpdate(input = {}) {
    const sessionId = str(input.sessionId)
    async function record(stage, details = {}) {
      try { await diagnostics?.record(sessionId, { diagnosticId: input.diagnosticId, messageId: input.messageId, swipeId: input.swipeId, stage, ...details }) } catch {}
    }
    if (settlementTransactions.has(sessionId)) throw new Error('当前对话已有 MVU 变量结算正在执行')
    const current = await readSettlementChat(sessionId)
    assertMvuEnabled(current)
    const operationId = str(input.operationId).trim()
    if (operationId === '') throw new Error('MVU 变量结算缺少 operationId')
    const expectedLifecycleRevision = Math.max(0, Number(input.expectedLifecycleRevision) || 0)
    if (!mutationIsCurrent(current, expectedLifecycleRevision)) return { updated: false, stale: true, context: await fullContext(current) }
    const messageId = Number(input.messageId)
    if (!Number.isInteger(messageId) || messageId < 0 || messageId >= current.messages.length) throw new Error('MVU 变量结算楼层不存在')
    await ensureRows(current, [messageId])
    const message = current.messages[messageId]
    const swipeId = Number(input.swipeId)
    if (!Number.isInteger(swipeId) || swipeId < 0 || swipeId !== Math.max(0, Number(message.swipeId) || 0)) {
      return { updated: false, stale: true, context: await fullContext(current) }
    }
    const command = str(input.command).trim()
    if (command === '') throw new Error('MVU 变量结算命令为空')
    // resolveChat awaited above: another attempt may have reserved this session
    // in the meantime. Never overwrite its draft or release its ownership.
    if (settlementTransactions.has(sessionId)) throw new Error('当前对话已有 MVU 变量结算正在执行')
    // An earlier lifecycle event still owns the executor. Installing an MVU
    // transaction now would reject its legitimate writes during context loading,
    // even though dispatch would eventually return busy and defer this attempt.
    const beforeDispatch = scriptDispatch.status?.(sessionId)
    if (beforeDispatch?.busy) {
      await record('runtime-deferred', { availability: beforeDispatch })
      return { updated: false, deferred: true, deferredReason: 'runtime-busy', context: await fullContext(current) }
    }
    const originalText = str((message.swipes && message.swipes[swipeId]) ?? message.sourceText ?? message.text)
    const eventId = 'mvu-work:' + randomUUID()
    const work = createMvuWorkingCopy(current, eventId, {ensure: indices => ensureRows(current, indices)})
    const reader = settlementReaders.get(current)
    if (reader) settlementReaders.set(work.chat, reader)
    work.touch(messageId)
    const transaction = {
      work, compact: input.compactContext === true,
      draft: work.chat,
      eventId,
      messageId,
      swipeId,
      mutations: 0
    }
    if (input.baselineVariables) {
      const target = transaction.draft.messages[messageId]
      if (!Array.isArray(target.variables)) target.variables = []
      target.variables[swipeId] = structuredClone(input.baselineVariables)
    }
    settlementTransactions.set(sessionId, transaction)
```

</details>

**依据 3 · 源码核查**：[tavern-plugin/lib/domain/mvu-settlement-transactions.js:235-307](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/tavern-plugin/lib/domain/mvu-settlement-transactions.js#L235-L307)

浏览器deferred、外部副作用重试限制、保原文与二次校验。

<details>
<summary>查看原文（73行）</summary>

```text
      // MVU is a local capability of the chat. A temporarily absent browser
      // executor is scheduling state, not a failed settlement. Return the
      // prepared transaction immediately so the caller can persist and resume
      // it when the executor registers again.
      if (availability && availability.ready !== true) {
        await record('runtime-deferred', { availability })
        return { updated: false, deferred: true, deferredReason: 'runtime-not-ready', context: await fullContext(current) }
      }
      const dispatched = await scriptDispatch.dispatch(sessionId, 'MESSAGE_RECEIVED', [messageId], eventContext, { eventId: transaction.eventId, signal: input.signal, ...(lazy ? { contextForBaseline: executionContext } : {}) })
      await record('runtime-completed', { handled: dispatched.handled === true, timedOut: dispatched.timedOut === true, executionLost: dispatched.executionLost === true, claimTimedOut: dispatched.claimTimedOut === true, phase: dispatched.phase, disposed: dispatched.disposed === true, error: dispatched.error, diagnostics: dispatched.diagnostics || [] })
      if (dispatched.handled !== true) {
        if (dispatched.initializationFailed === true) return await initializationRejected(str(dispatched.error))
        if (dispatched.unavailable === true || (input.durable === true && (dispatched.disposed === true || dispatched.timedOut === true || /超时|timed?\s*out|timeout/i.test(str(dispatched.error))))) {
          await record('runtime-deferred', { availability: scriptDispatch.status?.(sessionId) })
          return { updated: false, deferred: true, deferredReason: dispatched.claimTimedOut === true ? 'claim-timeout' : 'delivery-interrupted', context: await fullContext(current) }
        }
        if (str(dispatched.error).trim() !== '' && !dispatched.timedOut && !dispatched.disposed
          && !/超时|timed?\s*out|timeout/i.test(str(dispatched.error))) {
          const validation = { changes: [], sideEffects: [], failures: [{ message: str(dispatched.error) }] }
          await record('validation-rejected', { failures: validation.failures, externalEffects: transaction.externalEffects === true })
          return { updated: false, rejected: true, retryable: transaction.externalEffects !== true, retryAfterMs: MVU_RETRY_AFTER_MS,
            validation, diagnostics: dispatched.diagnostics || [], context: await fullContext(current) }
        }
        if (dispatched.timedOut === true) throw new Error('MVU 脚本执行回执超时，本轮结算未确认完成，请重试结算')
        if (dispatched.disposed === true) throw new Error('MVU 浏览器执行器已断开，本轮结算中断，请重试结算')
        throw new Error(str(dispatched.error).trim() || '官方 MVU 浏览器运行时尚未就绪，本轮未执行变量结算')
      }
      const settled = transaction.draft.messages[messageId]
      if (!settled || Math.max(0, Number(settled.swipeId) || 0) !== swipeId) {
        return { updated: false, stale: true, context: await fullContext(current) }
      }
      // Settlement writes variables only. The prose stays as the round saved it: text is
      // the prompt-regex projection the native surface holds, not the raw reply; turning it
      // back into the raw reply made every later reconcile see drift and repair (#306).
      for (const key of [...REPLY_PROSE_FIELDS, 'sessionText']) {
        if (Object.hasOwn(message, key)) settled[key] = structuredClone(message[key])
        else delete settled[key]
      }
      if (!Array.isArray(settled.swipes)) settled.swipes = [originalText]
      const beforeVariables = input.baselineVariables || current.messages[messageId].variables?.[swipeId] || {}
      const afterVariables = transaction.draft.messages[messageId].variables?.[swipeId] || {}
      const validation = typeof input.validate === 'function'
        ? await input.validate({ before: beforeVariables, after: afterVariables })
        : null
      if (validation && validation.failures.length > 0) {
        await record('validation-rejected', { failures: validation.failures, externalEffects: transaction.externalEffects === true })
        return {
          updated: false, rejected: true, retryable: transaction.externalEffects !== true, retryAfterMs: MVU_RETRY_AFTER_MS,
          validation, diagnostics: dispatched.diagnostics || [], context: await fullContext(current)
        }
      }
      // The browser event can take time; recheck the target before committing its draft.
      const selected = await resolveChatSlice?.(sessionId, [messageId], 'settlement')
      const latest = selected ? { ...selected.chat, messages: Object.assign([], { [messageId]: selected.chat.messages[0] }) } : await resolveChat(sessionId)
      if (!mutationIsCurrent(latest, expectedLifecycleRevision)
        || Number(latest.messages[messageId]?.swipeId || 0) !== swipeId) return { updated:false, stale:true }
      const effect = createMvuSettlementEffect({
        operationId, chatId: current.id, sessionId,
        branchId: input.branchId, basedOnRevision: input.basedOnRevision,
        expectedLifecycleRevision, messageId, swipeId,
        before: current, after: transaction.draft, messageIndices: work.dirty, guardChanges: Boolean(reader?.ensure)
      })
      await record('prepared', { mutations: transaction.mutations })
      return {
        updated: true,
        validation,
        diagnostics: dispatched.diagnostics || [],
        mutations: transaction.mutations,
        messageId,
        swipeId,
        effect,
        variables: structuredClone(afterVariables),
        ...(input.compactResult === true ? {} : { context: await fullContext(transaction.draft) })
```

</details>

**依据 4 · 源码核查**：[tavern-plugin/lib/domain/mvu-settlement-effect.js:8-38](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/tavern-plugin/lib/domain/mvu-settlement-effect.js#L8-L38)

允许根和身份版本约束。

<details>
<summary>查看原文（31行）</summary>

```text
const ALLOWED_ROOTS = new Set(['messages', 'variables', 'mvu', 'tavernScriptPrompts'])

function assertIdentity(chat, effect) {
  if (!effect || effect.version !== 1 || str(effect.operationId) === '') throw new Error('MVU Settlement Effect 不合法')
  if (str(chat && chat.id) !== str(effect.chatId) || str(chat && chat.sessionId) !== str(effect.sessionId)) throw new Error('MVU Settlement Effect 对话目标已变化')
  const timeline = chat && chat.timeline
  if (timeline && (str(timeline.branchId) !== str(effect.branchId) || Number(timeline.revision) !== Number(effect.basedOnRevision))) {
    const error = new Error('MVU Settlement Effect 剧情版本已变化')
    error.code = 'STALE_SETTLEMENT_EFFECT'
    throw error
  }
  if (Math.max(0, Number(chat && chat.tavernHelperLifecycleRevision) || 0) !== Number(effect.expectedLifecycleRevision)) {
    const error = new Error('MVU Settlement Effect 脚本生命周期已变化')
    error.code = 'STALE_SETTLEMENT_EFFECT'
    throw error
  }
  const message = Array.isArray(chat && chat.messages) ? chat.messages[Number(effect.messageId)] : null
  if (!message || Math.max(0, Number(message.swipeId) || 0) !== Number(effect.swipeId)) {
    const error = new Error('MVU Settlement Effect Swipe 已变化')
    error.code = 'STALE_SETTLEMENT_EFFECT'
    throw error
  }
}

function valueAt(chat,path) {
  let value=chat
  for(const key of path){
    if(value===null||typeof value!=='object'||!(Array.isArray(value) ? key in value : Object.prototype.hasOwnProperty.call(value,key)))return {present:false}
    value=value[key]
  }
  return {present:true,value}
```

</details>

#### 缺口

- 后台pending/失败期间下一轮引用旧状态的实际频率和损失
  **影响**：决定先提交在状态密集剧情中是否可用
  **进一步探讨**：故意延迟/失败结算，检查下一轮依赖变量的决策并测用户纠错
- 外部脚本动作在重试/断线时是否重复
  **影响**：隔离变量草稿不能回滚外部动作
  **进一步探讨**：用受控假执行器记录operationId与副作用次数，核对禁重试提示

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 以什么方式试用，钱和人工花在哪里？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

README已弃用npm插件安装。桌面通道限定官方DSH 0.2.x rc2及以上同代版本，不能直接套社区Desktop/NEXT；独立CLI有独立DSH和默认~/.dsh-tavern目录，需Node22.19+与pnpm；Android11+/ARM64为独立APK。根launcher实际分派install/start/stop/status/update并委托安装和服务生命周期模块，因此这些是不同部署通道，不是一个npm命令都适用。

还需要模型provider和密钥、前后台额外调用预算、可持久保存角色卡/聊天的目录；MVU事务需要浏览器脚本执行器可用。首用成本是备份、固定宿主/渠道和导入验证，持续成本包括前台生成、后台结算、候选/重写及脚本调试，失败还要人工核对变量与剧情。金额、延迟和净缓存收益未知，不能套约10秒/95%缓存计算ROI。

升级保数据是作者承诺，非本轮迁移实测。README提醒迁移后别让旧host读取同目录；桌面退回原DSH需切换并重启且保留备份。适合能自己备份并检查状态的人用独立档案小规模试角色卡，不宜把唯一长篇档案直接当试验。发现丢档、反复状态错位或外部脚本异常就停，保留日志和备份，切回原宿主/档案而非反复混读新旧目录。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:113-163](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/README.md#L113-L163)

宿主、发行、Android及CLI要求。

<details>
<summary>查看原文（51行）</summary>

````text
## 快速开始

> **请不要从 npm 下载或安装本项目。** 由于对 DSH 的定制改动较多，DSH Tavern 无法作为常规 DSH 插件安装使用。npm 上的 `dsh-profile-tavern` 已标记弃用，不再维护；请按下方对应平台的方式安装。

**桌面版仅支持官方 DeepSeek Harness，不再支持社区 DSH Desktop 或 DSH NEXT。** 从社区版迁移前请备份数据，再按[数据导入说明](docs/data-import.md)导入；Android 和独立命令行版继续支持。

当前版本适配 **DSH 0.2.x**（0.2.0-rc.2 起）。还在用 DSH 0.1.5（DSH Desktop 2.0.13、旧一键安装包）的，请用[稳定版](#稳定版dsh-015)。安装前建议备份 `.dsh` 目录。

### Windows

1. 安装 [DeepSeek Harness](https://deepseek.com/harness/) 0.2.1-rc.2 或更新的 0.2.x，打开一次后从托盘退出。
2. 打开 PowerShell，粘贴下面这行并按回车执行：

   ```powershell
   $env:DSH_TAVERN_HOST='desktop'; $tavernInstaller=[Text.Encoding]::UTF8.GetString((New-Object Net.WebClient).DownloadData('https://raw.githubusercontent.com/flizzywine/dsh-tavern/main/install.ps1')); Invoke-Expression $tavernInstaller
   ```

3. 重新打开 DeepSeek Harness，即进入酒馆。

### Android

Android 仅提供 **独立 APK**（Android 11+ / ARM64）：[下载 DSH Tavern Android APK](https://github.com/flizzywine/dsh-tavern/releases/latest/download/dsh-tavern-android-release.apk)。它内置 DSHA v0.2.0-rc2 与 DSH 0.2.0-rc.2，只运行酒馆自己的 `tavern` Profile，手机上只有一个 DSH 服务，内存和电量开销最低。首次按引导完成环境部署后自动安装并进入；酒馆更新在应用内完成。包名独立，可与旧版 v2.1 APK、原版 DSHA 并存，旧包数据需先导出再导入。详见 [Android 安装说明](docs/android-install.md)。

### macOS

1. 安装 [DeepSeek Harness](https://deepseek.com/harness/) 0.2.1-rc.2 或更新的 0.2.x，打开一次后退出（⌘Q）。
2. 打开「终端」，粘贴下面这行并按回车执行：

   ```sh
   curl -fsSL 'https://raw.githubusercontent.com/flizzywine/dsh-tavern/main/install.sh' -o /tmp/dsh-tavern-install.sh && DSH_TAVERN_HOST=desktop sh /tmp/dsh-tavern-install.sh
   ```

3. 重新打开 DeepSeek Harness，即进入酒馆。

### 命令行版（Windows / macOS / Linux，用浏览器玩）

不需要桌面版。命令行版自带一套独立的 DSH，和程序、游戏数据一起装在自己的目录里（默认 `~/.dsh-tavern`），**不会改动、也不会和你已经装好的 DSH 冲突**：桌面版、全局的 `dsh` 命令照常使用，两边互不影响，可以同时运行。需要 [Node.js 22.19+](https://nodejs.org/) 和 pnpm。

Windows（PowerShell）：

```powershell
$env:DSH_TAVERN_HOST='cli'; $tavernInstaller=[Text.Encoding]::UTF8.GetString((New-Object Net.WebClient).DownloadData('https://raw.githubusercontent.com/flizzywine/dsh-tavern/main/install.ps1')); Invoke-Expression $tavernInstaller
```

macOS / Linux：

```sh
curl -fsSL 'https://raw.githubusercontent.com/flizzywine/dsh-tavern/main/install.sh' -o /tmp/dsh-tavern-install.sh && DSH_TAVERN_HOST=cli sh /tmp/dsh-tavern-install.sh
```

装好后用 `dsh-tavern start` 启动，按显示的地址在浏览器打开；`dsh-tavern stop` / `status` / `update` 停止、查看、更新。
````

</details>

**依据 2 · 作者声明**：[README.md:172-181](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/README.md#L172-L181)

模型、更新和迁移/退出边界。

<details>
<summary>查看原文（10行）</summary>

```text
### 开始游玩

在 **设置 → 模型** 填入模型服务和 API 密钥（任意模型都可以，本地模型也行），导入人物卡就能开局。[图文教程 →](https://flizzywine.github.io/dsh-tavern/#a02--section-5)

### 更新、旧存档与切回原版

- 在酒馆里点「检查更新」即可更新，也可以重新运行上面的安装命令；只替换程序，人物卡、聊天和设置都会保留。
- 旧版本的存档：打开后在「酒馆状态」里点「迁移存档」。正文、变量、分支和历史版本都会保留。迁移后的数据目录不要再让旧宿主直接读取。
- 桌面版切回原版 DSH：设置 → 原版DSH → 切到原版 DSH 并重启。之后在原版 DSH 的设置 → DSH酒馆，就能切回酒馆。不要删除 `.dsh/backups` 和 `profiles/desktop.fresh-*`。细节见[桥接插件说明](tavern-plugin/packages/dsh-profile-bridge/README.md)。
- 旧酒馆在自定义目录、需要继承数据时，见[数据继承说明](docs/data-import.md)。
```

</details>

**依据 3 · 源码核查**：[bin/dsh-tavern.mjs:3-28](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/bin/dsh-tavern.mjs#L3-L28)

真实launcher分派依赖与命令入口。

<details>
<summary>查看原文（26行）</summary>

```text
import { realpathSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import officialDesktop from './official-desktop-runtime.cjs'
import { fileURLToPath } from 'node:url'
import { SCRIPT_PATH, RUNTIME_HOST, DSH_ROOT } from './launcher-environment.mjs'
import { installProfile, parseInstallHost } from './profile-installation.mjs'
import { startService, stopService, statusService, openService, bootstrapFrontendOnce } from './service-lifecycle.mjs'
import { updateApplication, parseUpdateOptions } from './application-update.mjs'
import { openTavernWindow } from './tavern-window.mjs'
import { recordUpdateDiagnostic } from './update-diagnostics.mjs'

// Keep the existing import surface while the executable only dispatches commands.
export { resolveServicePort, resolveDshInvocation } from './launcher-environment.mjs'
export { applySidebarDefaults, ensureSidebarDefaults } from './launcher-settings.mjs'
export { extractDshVersion, parseInstallHost, renderWindowsLauncher, recordInstalledRelease } from './profile-installation.mjs'
export { webUrlFromLogChunk, resolveServiceWebUrl, restartBrowserTarget, browserOpenCommand, needsFrontendBootstrap, isPortOpen, isServiceReady } from './service-lifecycle.mjs'
export { encodeWindowsPowerShellScript, decodeUpdateOutput, parseUpdateOptions, updateApplication, resolveUpdateProgram } from './application-update.mjs'

function fail(message) {
  console.error(message)
  process.exitCode = 1
}

function usage() {
  console.log('用法：dsh-tavern install [--host cli|desktop|android] | {update|start|open|window|stop|restart|status}')
```

</details>

**依据 4 · 源码核查**：[tavern-plugin/lib/domain/mvu-settlement-transactions.js:235-250](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/tavern-plugin/lib/domain/mvu-settlement-transactions.js#L235-L250)

浏览器执行器缺失导致延迟。

<details>
<summary>查看原文（16行）</summary>

```text
      // MVU is a local capability of the chat. A temporarily absent browser
      // executor is scheduling state, not a failed settlement. Return the
      // prepared transaction immediately so the caller can persist and resume
      // it when the executor registers again.
      if (availability && availability.ready !== true) {
        await record('runtime-deferred', { availability })
        return { updated: false, deferred: true, deferredReason: 'runtime-not-ready', context: await fullContext(current) }
      }
      const dispatched = await scriptDispatch.dispatch(sessionId, 'MESSAGE_RECEIVED', [messageId], eventContext, { eventId: transaction.eventId, signal: input.signal, ...(lazy ? { contextForBaseline: executionContext } : {}) })
      await record('runtime-completed', { handled: dispatched.handled === true, timedOut: dispatched.timedOut === true, executionLost: dispatched.executionLost === true, claimTimedOut: dispatched.claimTimedOut === true, phase: dispatched.phase, disposed: dispatched.disposed === true, error: dispatched.error, diagnostics: dispatched.diagnostics || [] })
      if (dispatched.handled !== true) {
        if (dispatched.initializationFailed === true) return await initializationRejected(str(dispatched.error))
        if (dispatched.unavailable === true || (input.durable === true && (dispatched.disposed === true || dispatched.timedOut === true || /超时|timed?\s*out|timeout/i.test(str(dispatched.error))))) {
          await record('runtime-deferred', { availability: scriptDispatch.status?.(sessionId) })
          return { updated: false, deferred: true, deferredReason: dispatched.claimTimedOut === true ? 'claim-timeout' : 'delivery-interrupted', context: await fullContext(current) }
        }
```

</details>

#### 缺口

- 目标角色卡脚本和历史迁移的完整兼容性未知
  **影响**：决定首用/迁移人工成本和资料保留
  **进一步探讨**：在备份副本导入固定卡片和历史，核对脚本能力、分支和旧档回退

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可以借鉴的提交模式到哪里为止？

**研究主题**：工程质量与复用

#### 完整回答

值得复用的是把模型生成的派生修改先制成可序列化、operation-scoped effect，再用当前版本的守卫发布。effect只允许messages/variables/mvu/tavernScriptPrompts，带chat/session与分支版本；expected value防止覆盖自草稿创建后已变的值。对于有范围的消息修改，先准备所有行再发布，避免校验到一半时已经部分写入。

这优于直接保存整份旧聊天对象，但原子范围是当前effect的发布步骤；ADR明确不是正文和后台状态的同一存储事务。transaction隔离还禁止真实跨chat global差异，只允许特定runtime标记；不代表任意用户脚本都被安全沙箱隔离。移植需宿主具有稳定分支/revision、swipe/lifecycle身份和明确的副作用接口，否则照搬操作ID字段不会自动获得这些保证。

#### 证据与依据

**依据 1 · 源码核查**：[tavern-plugin/lib/domain/mvu-settlement-effect.js:41-101](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/tavern-plugin/lib/domain/mvu-settlement-effect.js#L41-L101)

序列化effect、expected checks和先准备所有行再发布。

<details>
<summary>查看原文（61行）</summary>

```text
/** Create a serializable, operation-scoped effect without persisting Chat state. */
export function createMvuSettlementEffect(input = {}) {
  // The caller owns the draft and declares every touched floor. Do not scan
  // shared history to rediscover a write set that is already known.
  const rawChanges = input.messageIndices ? diffMvuChanges(input.before, input.after, input.messageIndices)
    : diffJson(input.before, input.after)
  const changes = rawChanges.filter(function (change) {
    return Array.isArray(change.path) && ALLOWED_ROOTS.has(String(change.path[0] || ''))
  })
  return {
    version: 1,
    operationId: str(input.operationId),
    chatId: str(input.chatId),
    sessionId: str(input.sessionId),
    branchId: str(input.branchId),
    basedOnRevision: Number(input.basedOnRevision),
    expectedLifecycleRevision: Math.max(0, Number(input.expectedLifecycleRevision) || 0),
    messageId: Number(input.messageId),
    swipeId: Number(input.swipeId),
    ...(input.guardChanges ? {expected:changes.map(change=>structuredClone(valueAt(input.before,change.path)))} : {}),
    changes: structuredClone(changes)
  }
}

/** Apply one effect at the Story Timeline commit seam while preserving unrelated projections. */
export function applyMvuSettlementEffect(chat, effect, scope) {
  assertIdentity(chat, effect)
  if(effect.expected){
    if(!Array.isArray(effect.expected)||effect.expected.length!==effect.changes.length)throw new Error('Invalid MVU conflict guards')
    for(let i=0;i<effect.changes.length;i++)if(!isDeepStrictEqual(valueAt(chat,effect.changes[i].path),effect.expected[i])){
      const error=new Error('MVU 结算期间目标字段已变化，拒绝覆盖并发修改')
      error.code='STALE_SETTLEMENT_EFFECT'
      throw error
    }
  }
  const changes = effect.changes.filter(change => ALLOWED_ROOTS.has(String(change.path?.[0])))
  if (Array.isArray(scope?.messageIndices)) {
    const allowed = new Set(scope.messageIndices)
    const byFloor = new Map(), head = []
    for (const change of changes) {
      if (change.path[0] !== 'messages') { head.push(change); continue }
      const id = change.path[1]
      if (!allowed.has(id)) throw new Error('MVU effect wrote an undeclared floor')
      if (!byFloor.has(id)) byFloor.set(id, [])
      byFloor.get(id).push({...change,path:change.path.slice(2)})
    }
    // Prepare all changed rows before publishing any, preserving failure isolation.
    const rows = [...byFloor].map(([id, edits]) => [id, applyJsonChangesShared(chat.messages[id], edits)])
    const applied = applyJsonChangesShared({...chat, messages: undefined}, head)
    for (const root of new Set(head.map(change => change.path[0]))) {
      if (Object.hasOwn(applied, root)) chat[root] = applied[root]
      else delete chat[root]
    }
    for (const [id, row] of rows) chat.messages[id] = row
    return chat
  }
  const applied = applyJsonChangesShared(chat, changes)
  for (const root of new Set(changes.map(change => change.path[0]))) {
    if (Object.hasOwn(applied, root)) chat[root] = applied[root]
    else delete chat[root]
  }
```

</details>

**依据 2 · 源码核查**：[tavern-plugin/lib/domain/mvu-settlement-effect.js:105-115](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/tavern-plugin/lib/domain/mvu-settlement-effect.js#L105-L115)

范围diff和长度/index约束。

<details>
<summary>查看原文（11行）</summary>

```text
/** Compare detached metadata and explicitly owned floors, never array length. */
export function diffMvuChanges(before, after, indices) {
  const {messages: beforeMessages, ...beforeHead} = before
  const {messages: afterMessages, ...afterHead} = after
  if (beforeMessages.length !== afterMessages.length) throw new Error('Scoped MVU cannot change history membership')
  const changes = diffJson(beforeHead, afterHead)
  for (const id of indices) {
    if (!Number.isSafeInteger(id) || id < 0 || id >= beforeMessages.length) throw new Error('Invalid scoped MVU floor')
    for (const change of diffJson(beforeMessages[id], afterMessages[id])) changes.push({...change,path:['messages',id,...change.path]})
  }
  return changes
```

</details>

**依据 3 · 源码核查**：[tavern-plugin/lib/domain/mvu-settlement-transactions.js:317-356](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/tavern-plugin/lib/domain/mvu-settlement-transactions.js#L317-L356)

目标原文保护与事务内跨chat globals限制。

<details>
<summary>查看原文（40行）</summary>

```text
  function assertEvent(sessionId, eventId) {
    assertTransactionEvent(settlementTransactions.get(str(sessionId)), eventId)
  }
  async function touchMessage(sessionId, messageId, eventId) {
    const transaction = settlementTransactions.get(str(sessionId))
    assertTransactionEvent(transaction, eventId)
    if (!transaction) return
    await transaction.work.touchAsync(messageId)
    assertEvent(sessionId, eventId)
  }
  async function prepareMessages(sessionId, messages, eventId) {
    const transaction = settlementTransactions.get(str(sessionId))
    assertTransactionEvent(transaction, eventId)
    const chat = transaction?.draft
    const patches = transaction === undefined ? messages : (Array.isArray(messages) ? messages : []).map(function (raw) {
      const patch = raw && typeof raw === 'object' ? structuredClone(raw) : raw
      if (!patch || Number(patch.message_id) !== transaction.messageId) return patch
      const swipeId = Object.prototype.hasOwnProperty.call(patch, 'swipe_id') ? Number(patch.swipe_id) : transaction.swipeId
      if (swipeId !== transaction.swipeId) return patch
      delete patch.message
      return patch
    })
    if (transaction) {
      for (const patch of patches) if (patch && typeof patch === 'object') await transaction.work.touchAsync(patch.message_id)
      if (chat.messages.length) await transaction.work.ensure([0])
      assertEvent(sessionId, eventId)
    }
    return patches
  }
  async function updateGlobals(sessionId, variables) {
    const transaction = settlementTransactions.get(str(sessionId))
    if (transaction) {
      const previous = transaction.globalVariables || await readGlobalVariables()
      const next = variables && typeof variables === 'object' && !Array.isArray(variables) ? variables : {}
      // Official MVU uses this global as an execution flag, not shared game
      // state. Keep it local to the settlement and retain cross-chat guards.
      const withoutRuntimeFlag = value => { const copy = { ...value }; delete copy.extra_analysis; return copy }
      if (!isDeepStrictEqual(withoutRuntimeFlag(previous), withoutRuntimeFlag(next))) throw new Error('MVU 结算事务不能修改跨对话的全局变量')
      transaction.globalVariables = structuredClone(next)
      return { updated: true, transactional: true, target: { type: 'global' }, globalVariables: structuredClone(next) }
```

</details>

**依据 4 · 源码核查**：[docs/adr/0006-foreground-commits-before-derived-settlement.md:20-23](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/docs/adr/0006-foreground-commits-before-derived-settlement.md#L20-L23)

非同一存储事务。

```text
- 后台失败不会让成功正文消失，也不会锁死下一轮。
- 每轮正文都有独立 checkpoint，显式回退仍按正文逐轮工作。
- 后台状态允许暂时落后于正文；最新轮次可重试结算，过期结果直接丢弃。
- 前台与后台不再是一个存储事务，但版本校验阻止迟到写入污染新剧情。
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样缓解状态滞后而保留正文先到的价值？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是为正文和派生状态分别显示revision水位，仅当用户下一步显式依赖未结算变量时暂停该动作或先确认旧状态；普通阅读/无状态对话继续。它来自Q03中“不阻塞下一轮”与旧值风险的张力，不是现有已实现能力。

最低验证应把同一脚本化卡片、模型和后台延迟分到当前先提交、整轮等待、选择性状态门控三组，注入一次结算失败与一次过期回包，比较正文首显、状态相关错误、纠错时间和总调用费。若门控无法识别状态依赖、误拦截多或正确率没有提高，就放弃，不以多一个状态徽章算成功。

#### 证据与依据

**依据 1 · 源码核查**：[docs/adr/0006-foreground-commits-before-derived-settlement.md:12-23](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/docs/adr/0006-foreground-commits-before-derived-settlement.md#L12-L23)

推演来自状态可滞后的已知取舍。

<details>
<summary>查看原文（12行）</summary>

```text
Foreground Turn 成功后立即提交正文、checkpoint 与新的 Story Timeline revision。状态结算是绑定该正文 branch/revision 的派生 Background Operation：成功时只提交姿势、变量和回执；失败时保留正文、记录错误并提供手动重试，但不阻塞下一次 Foreground Turn。

正文重新生成采用同一边界：新正文一旦生成和提交成功，就替换旧正文与模型 Surface；随后的结算失败不得触发 `replacement.abort`。只有前台生成、正文校验或正文提交失败时才恢复旧正文。

任何结算结果在应用前必须同时匹配其绑定的 branch 与 revision。若用户已回退、重新生成或提交了下一轮正文，旧结算结果成为 stale，不得覆盖当前派生状态。旧版停留在 `foreground-completed` 的存档在读取时惰性迁移为已提交正文，使既有失败会话也能继续。

## 结果

- 后台失败不会让成功正文消失，也不会锁死下一轮。
- 每轮正文都有独立 checkpoint，显式回退仍按正文逐轮工作。
- 后台状态允许暂时落后于正文；最新轮次可重试结算，过期结果直接丢弃。
- 前台与后台不再是一个存储事务，但版本校验阻止迟到写入污染新剧情。
```

</details>

**依据 2 · 源码核查**：[tavern-plugin/lib/domain/mvu-settlement-effect.js:10-29](https://github.com/flizzywine/dsh-tavern/blob/ac0e298ac29f76fd45f09fa7c28af12916832a55/tavern-plugin/lib/domain/mvu-settlement-effect.js#L10-L29)

现有版本信息提供水位候选而非门控实现。

<details>
<summary>查看原文（20行）</summary>

```text
function assertIdentity(chat, effect) {
  if (!effect || effect.version !== 1 || str(effect.operationId) === '') throw new Error('MVU Settlement Effect 不合法')
  if (str(chat && chat.id) !== str(effect.chatId) || str(chat && chat.sessionId) !== str(effect.sessionId)) throw new Error('MVU Settlement Effect 对话目标已变化')
  const timeline = chat && chat.timeline
  if (timeline && (str(timeline.branchId) !== str(effect.branchId) || Number(timeline.revision) !== Number(effect.basedOnRevision))) {
    const error = new Error('MVU Settlement Effect 剧情版本已变化')
    error.code = 'STALE_SETTLEMENT_EFFECT'
    throw error
  }
  if (Math.max(0, Number(chat && chat.tavernHelperLifecycleRevision) || 0) !== Number(effect.expectedLifecycleRevision)) {
    const error = new Error('MVU Settlement Effect 脚本生命周期已变化')
    error.code = 'STALE_SETTLEMENT_EFFECT'
    throw error
  }
  const message = Array.isArray(chat && chat.messages) ? chat.messages[Number(effect.messageId)] : null
  if (!message || Math.max(0, Number(message.swipeId) || 0) !== Number(effect.swipeId)) {
    const error = new Error('MVU Settlement Effect Swipe 已变化')
    error.code = 'STALE_SETTLEMENT_EFFECT'
    throw error
  }
```

</details>

#### 缺口

- 选择性状态门控能否识别依赖并减少错误
  **影响**：决定新假设而非现有能力的成立
  **进一步探讨**：固定延迟和故障，对比三组任务错误、等待和误拦截

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
