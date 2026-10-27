# dsh-pet 插件

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[dfc0396](https://github.com/PC2005-cloud/dsh-pet/tree/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet)

<!-- BEGIN META -->
[![GitHub ★ 4,043](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C043&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PC2005-cloud/dsh-pet) [![npm 30d 83,202](https://img.shields.io/static/v1?label=npm+30d&message=83%2C202&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet)
<!-- END META -->

> **实现功能**：在DSH浏览器及可选桌面窗口中显示动画宠物，并联动会话状态、通知、余额与聊天。

> **核心亮点**：[Q03](#research-q03)识别出动画池、共享双端交互和DSH事件结合的表现层贡献。相比静态桌宠多出会话联动，原生通知仍可替代任务提示，不能把娱乐偏好当生产力改善或把成功动画当验收。

> **风险与缺陷**：[Q04](#research-q04)核实默认both显示与周期碎碎念会带来Electron下载、Helper及模型调用；限制到浏览器也需加载前确认配置，而不是安装后再关窗口。路由准入、资源负担和许可还需按具体环境核对。

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
  - [Q01 · 桌宠真正服务什么需求，哪些能力不能当生产验收？](#detail-section-11)
  - [Q02 · 宿主、浏览器与桌面Helper怎样共享状态？](#detail-section-12)
  - [Q03 · 相对静态桌宠或原生状态提示，有什么有限增量？](#detail-section-13)
  - [Q04 · 默认启用的下载和模型调用会怎样改变采用负担？](#detail-section-14)
  - [Q05 · 如何收窄到不需要桌面下载和自动AI的路径？](#detail-section-15)
  - [Q06 · 首次、持续、失败恢复和卸载分别保留什么？](#detail-section-16)
  - [Q07 · 哪些共享逻辑和生命周期设计可借鉴？](#detail-section-17)
  - [Q08 · 能否让娱乐模式的资源与任务语义更可预测？](#detail-section-18)
  - [Q09 · 什么人可先试，何时应停止？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向明确喜欢动画陪伴、希望在等Agent时看到状态提示的DSH个人用户。合格结果是动画正常播放、状态/通知与对应会话一致且不干扰操作；不是代码交付效率或任务质量提高。简单办法是静态桌宠、原生状态和通知，若只关心任务完成提示，原生功能可能已足够。该子目录是实际npm插件包，根仓库还含素材制作链，不能把它们算成同一安装入口。

主要贡献是将动画素材池、双端共享的交互/物理逻辑及DSH会话事件结合，扩展成可自定义pet pack的表现层。相比静态桌宠，能显示任务状态和聊天；相比原生状态，是个性化常驻载体而非新增验收机制。统一路由/共享核心减少双端实现偏差，但“行为严格一致”仍是设计目标，未实际比对。装饰偏好真实存在于目标人群假设中，不等于能提升生产力或普遍值得安装。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 动画与交互 | 显示陪伴动画、拖拽和漫游 | 需兼容透明视频，非任务验收 |
| 会话联动 | 表现状态和通知 | 事件提示不证明业务成功 |
| 桌面模式 | 透明Helper常驻窗口 | 可自动下载Electron |
| 可选AI聊天 | 碎碎念和对话 | 产生模型调用与记忆状态 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH和Node22.12+ | 必需 | Host/UI及注入服务 | 按兼容矩阵核对 |
| 透明视频素材 | 动画必需 | 显示宠物 | Safari需另备mov |
| Electron/图形桌面 | 桌面模式必需 | Helper | 无显示跳过，缺可自动下载 |
| 模型/凭据 | AI及余额操作必需 | 远端调用 | 关闭功能不等移除模块依赖 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 独立profile预写web/关闭自动AI | 启动无额外下载和调用 |
| 2 | 加载插件核对动画/事件 | 不遮挡且会话对应 |
| 3 | 停用并核对helper | 无未预期后台，保留配置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 可自动下载Electron和素材 | 配置profile与自动能力 | 下载/安装时间未知 |
| 持续 | 动画解码、Helper与模型 | 核对通知和周期调用 | CPU/金额未测 |
| 失败恢复 | 浏览器可作退路 | 查配置/素材/进程 | 多端一致性未验收 |
| 退出 | 配置/缓存/记忆可能保留 | 停插件查Helper并按需清理 | 不等同自动全删 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 动画状态 | 共享路由与事件处理存在 | 多端实际一致性 |
| 陪伴体验 | 提供个性化载体 | 满意度与注意力干扰 |
| 任务提示 | 绑定会话事件 | 不证明办结或效率提升 |

> **思考**：[Q04](#research-q04)核实默认both显示与周期碎碎念会带来Electron下载、Helper及模型调用；限制到浏览器也需加载前确认配置，而不是安装后再关窗口。路由准入、资源负担和许可还需按具体环境核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q03](#research-q03)识别出动画池、共享双端交互和DSH事件结合的表现层贡献。相比静态桌宠多出会话联动，原生通知仍可替代任务提示，不能把娱乐偏好当生产力改善或把成功动画当验收。

[Q03](#research-q03)识别出动画池、共享双端交互和DSH事件结合的表现层贡献。相比静态桌宠多出会话联动，原生通知仍可替代任务提示，不能把娱乐偏好当生产力改善或把成功动画当验收。

可借鉴将状态reducer、物理动画与业务路由从渲染端分离，桌面和浏览器复用，以及配置变更时等旧Helper退出再串行启动新进程。这样针对“双窗口重叠”有明确因果处理，而不是凭测试数量保证一致。维护代价是Host与shared配置部分因单文件约束存在副本，字段同步和多平台素材仍需人工；路径词法检查不能未经symlink核对即宣称完全沙箱。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04)核实默认both显示与周期碎碎念会带来Electron下载、Helper及模型调用；限制到浏览器也需加载前确认配置，而不是安装后再关窗口。路由准入、资源负担和许可还需按具体环境核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

明确想要动画陪伴且会配置DSH的个人用户，可在独立profile加载前设仅web、关闭whisper和不需的余额/通知，先核对一只宠物的状态与操作不遮挡。若配置未生效、仍下载Electron、出现额外模型调用或动画干扰，应停插件、核对Helper进程并保留/清理相应配置，回到原生状态通知或静态桌宠。商业交付先核对素材范围，不把代码MIT外推至动画与形象。 依据 [Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前贡献由固定源码支持并含解释判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、dsh-pet/package.json、dsh-pet/cordis.patch.yml、dsh-pet/src/host/index.ts、dsh-pet/src/host/helper-process.ts、dsh-pet/assets/config.jsonc、CONFIG.md、dsh-pet/scripts/ensure-electron.mjs、dsh-pet/src/host/config.ts 及固定范围 inventory；组件：dsh-pet。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定提交源码、README、配置与相关测试定义；未安装或执行目标代码，未进行真实宿主验收。
- 下一步：未验证假设是首次加载提供纯动画/状态伴随/AI聊天三种明确能力预算，并显示自动下载、联网和模型周期；成功动画另标“本轮结束”而非任务办结。由默认both+whisper与任务状态映射推导，可让想看宠物的人不意外承担AI或桌面成本。对照默认和显式预算模式，测用户是否正确预计后台进程/调用以及停用是否符合预期；若选择负担增加而资源误判不减少则否定。

**分析版本**

- **仓库**：[PC2005-cloud/dsh-pet](https://github.com/PC2005-cloud/dsh-pet)
- **版本号**：0.3.8（[固定提交 dfc0396](https://github.com/PC2005-cloud/dsh-pet/tree/dfc03961bdb4d26898838cb72c9c2ac09699b1e2)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q08](#research-q08)提出未验证的三种能力预算与“本轮结束”语义，将动画、状态、AI分开显式选择；以用户预测后台开销和退出行为的正确率对照，误判不下降则否定。

未验证假设是首次加载提供纯动画/状态伴随/AI聊天三种明确能力预算，并显示自动下载、联网和模型周期；成功动画另标“本轮结束”而非任务办结。由默认both+whisper与任务状态映射推导，可让想看宠物的人不意外承担AI或桌面成本。对照默认和显式预算模式，测用户是否正确预计后台进程/调用以及停用是否符合预期；若选择负担增加而资源误判不减少则否定。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 16 | 4902 | 3626 | 1186 | — |
| .md | source | 1 | 7 | — | — | 65 |
| .mjs | source | 11 | 724 | 489 | 195 | — |
| .mjs | test | 3 | 604 | 560 | 32 | — |
| .md | test | 1 | 15 | — | — | 183 |
| .js | test | 1 | 17 | 16 | 0 | — |
| .ts | test | 62 | 14944 | 12366 | 1369 | — |
| .ts | source | 96 | 20318 | 14365 | 4878 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 82](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=82&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+created%3A2026-09-26T09%3A41%3A27.462Z..2026-10-26T09%3A41%3A27.462Z) [![近30天关闭 76](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=76&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A41%3A27.462Z..2026-10-26T09%3A41%3A27.462Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定版本判断dsh-pet 插件的贡献、关键质疑与可控采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌宠真正服务什么需求，哪些能力不能当生产验收？

**研究主题**：场景与需求

#### 完整回答

面向明确喜欢动画陪伴、希望在等Agent时看到状态提示的DSH个人用户。合格结果是动画正常播放、状态/通知与对应会话一致且不干扰操作；不是代码交付效率或任务质量提高。简单办法是静态桌宠、原生状态和通知，若只关心任务完成提示，原生功能可能已足够。该子目录是实际npm插件包，根仓库还含素材制作链，不能把它们算成同一安装入口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-23](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/README.md#L16-L23)

桌宠与三件套边界

````text
一只住在 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 里的桌面宠物：待机呼吸、随机动作（打瞌睡、玩魔方、吃火锅……）、左右转向、屏幕漫游、点击 Q 弹、拖拽甩抛反弹、右键菜单点播——一百余个透明动画随时无缝衔接；还能跟随 DSH 会话事件切换工作状态动画、按档位播放余额动画 + 头顶气泡、碎碎念与对话聊天、窗口失焦时弹系统通知。可多开同屏，能脱离浏览器住上**桌面**（透明置顶小窗），也能自己添加**全新宠物种类**（pet pack）。

这不是一个普通插件，而是**完整的三件套项目**：

```
① 提示词（配方）    →  ② 素材生成链（引擎）  →  ③ 插件（成品）
AI 生成动画的配方     源视频 → 透明动画的管线    运行在 DSH 里的宠物
```
````

**依据 2 · 源码核查**：[dsh-pet/package.json:1-5](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/package.json#L1-L5)

实际插件包身份

```text
{
  "name": "dsh-pet",
  "version": "0.3.8",
  "description": "吃白饭的蓝色大肥鱼，赖在 DeepSeek Harness 里不走了。平时爱玩魔方、爱吃各种零食、偶尔打个盹，闲不住就在桌面上溜达两圈，被你拖来甩去也照旧赖着；你忙起来它跟着忙前忙后，也会帮你打理余额钱包，闲下来爱碎碎念，还乐意陪你唠两句。",
  "icon": "assets/logo.png",
```

**依据 3 · 作者声明**：[README.md:104-121](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/README.md#L104-L121)

娱乐与会话状态等能力声明

<details>
<summary>查看原文（18行）</summary>

```text
- **纯粹的桌宠**：不做天气、监控等无关功能，不碰 DSH 内核；可选能力只有下面这些（余额 / 碎碎念 / 对话 / 工作状态 / 系统通知）
- **动画链**：每个动画（含待机）播完即按权重选下一个（默认 idle 10 / turn 5 / move 5 + 分类权重，`config.jsonc` 可调），首尾相接
- **事件动画**：余额 / 碎碎念 / 工作状态按档位触发专属动画；档位支持候选数组——触发时档内随机、循环播放自动轮换，避免连播同一段
- **多开**：同时显示多个宠物，各自独立大小与位置（设置页「桌宠配置」添加/删除）
- **屏幕漫游**：朝朝向方向行走，先探测空间、不走出屏幕（多屏按各屏边界判定；设置页「锁定在当前屏幕」开启后只在当前所在那块屏内走）
- **点击 / 拖拽 / 甩抛**：点击有回应动画并 Q 弹挤压；拖拽过阻尼弹簧跟手，甩出即抛物线飞行、屏幕边缘反弹、落地摩擦停稳并 Q 弹一下；温柔放下原地停住；两端同一套纯函数物理与挤压曲线（`dsh-pet/src/shared/physics.ts`）
- **右键菜单**：「动作 → 分类 → 具体动画」任意点播（移动类动画点播会真实行走一段）；工具项——浏览器端：碎碎念 / 对话 / 回到初始位置；桌面端：+ 打开网站、查看余额（余额启用时显示）、重载配置（改完配置文件直接右键重载全部桌面宠物，不必回设置页点保存）
- **「打开网站」按宿主自动分派**：宠物宿主是 **DSH 桌面应用**时，该项自动变成「打开 DeepSeek Harness」——用应用自注册的 `dsh://open` 协议把桌面应用主窗口唤到前台（已运行则前置、未运行则拉起）；宿主是 `dsh web` / 独立模式时，仍是系统默认浏览器打开站点
- **朝向与落地**：全部动画可镜像（可朝左 / 朝右）；脚底线统一，宠物始终站在地面上
- **流畅切换**：双缓冲交叉淡入，切换无空白帧
- **余额展示**：按已用百分比分档播余额动画 + 头顶联想气泡（10 秒自动消失）；DeepSeek 显示账户余额，OpenCode Zen Go 与 Command Code 显示最紧迫的一个额度窗口；**未登记余额接口的服务商改为弹文字说明**（不静默）；按宠物独立开关
- **碎碎念与对话**：碎碎念按周期自动生成一句（说话动画 + 气泡，也可手动触发）；对话在右键弹输入框与宠物聊天，记忆持久化（浏览器 / 桌面共享同一份）
- **工作状态联动**：监听 DSH 会话事件，切「思考 / 工作 / 整理 / 等待 / 成功 / 出错」档位动画 + 常驻气泡；目标多轮任务只在真正收尾轮庆祝
- **系统通知**：窗口失焦时弹系统 toast（对话完成 / 生成失败 / 输出截断 / 权限申请 / 用户选择）
- **桌面模式（可选）**：每只宠物开一个独立透明置顶局部小窗，与浏览器严格同行为、共用同一份素材与纯逻辑（见下节）
- **pet pack（额外宠物种类）**：`pet/` 下建 `种类名-config.json` + `种类名-animation/` 即新增独立动画池与素材的全新种类，多实例共享素材（见 [CONFIG.md](CONFIG.md) 的「方式四」）
- **自定义动画**：往 `main-animation/webm/` 放 VP9-Alpha 的 `.webm` 即为新动画，优先于包内素材
- **无障碍**：支持 `prefers-reduced-motion`（减少动效时跳过 Q 弹挤压与淡入切换）
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主、浏览器与桌面Helper怎样共享状态？

**研究主题**：功能与机制

#### 完整回答

bundle挂dsh-pet模块，Host注入webServer、模型、credentials、commands和connection，统一handlePetRoute供HTTP与桌面协议使用；session/event经reducer形成工作状态与通知，浏览器和Helper消费相同逻辑。素材经过根目录路径解析，桌面Helper通过管道请求、绝对文件路径读取而非裸HTTP绕认证。默认display both在无现成Electron且有桌面宠物时异步下载并启动，只有明确web/none且无保留托盘才短路。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/cordis.patch.yml:23-25](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/cordis.patch.yml#L23-L25)

插件挂载

```text
- insert:
    - id: dsh-pet
      name: 'dsh-pet'             # 模块名：解析到 lib/index.js
```

**依据 2 · 源码核查**：[dsh-pet/src/host/index.ts:92-107](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/src/host/index.ts#L92-L107)

必需服务及路由

<details>
<summary>查看原文（16行）</summary>

```text
/** 插件行 id（与 cordis.patch.yml 一致） */
export const name = 'pet';
/** 需要注入的服务：webServer（路由）+ agentDefaultModel（当前服务商）+ credentials（凭证）+ llm（对话模型调用）+ commands（/balance 斜杠命令）+ connection（桌面 Helper「打开网站」用的已鉴权站点 URL） */
export const inject = ['webServer', 'agentDefaultModel', 'credentials', 'llm', 'commands', 'connection'];

/** 本包目录：宿主构建产物位于 lib/，其上一级即包根。 */
const PACKAGE_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

/** 包内 assets 根 */
const PACKAGE_ROOT_ASSETS = join(PACKAGE_ROOT, 'assets');

/** 包内表情包目录（表情包池的最后一环：assets/memes/<名称>.png） */
const PACKAGE_MEMES_DIR = join(PACKAGE_ROOT_ASSETS, 'memes');

/** 路由前缀 */
const ROUTE_PREFIX = '/dsh-pet-7340';
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/host/index.ts:2239-2251](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/src/host/index.ts#L2239-L2251)

session事件入口

<details>
<summary>查看原文（13行）</summary>

```text
    const dispose = ctx.on('session/event', (session: unknown, event: unknown) => {
      const type = (event as { type?: string } | null)?.type;
      if (!type) return;
      const sessionId = String(
        (session as { id?: unknown; header?: { id?: unknown } } | null)?.header?.id ??
          (session as { id?: unknown } | null)?.id ??
          'unknown',
      );
      if (type === 'todo/write') {
        // 任务详情文案只写该会话的条目（state/task 同源，不可能串会话）。会话没有活动条目
        // （已空闲/已清理）→ 不动：不会被展示，写进去只会成为一条幽灵文案。
        // 清单里再无 in_progress/pending 时返回 null，气泡回落到档位文案。
        const text = currentTaskFromTodo(event as { data?: { todos?: Array<{ status?: string; content?: string }> } });
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/host/helper-process.ts:1-9](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/src/host/helper-process.ts#L1-L9)

Helper与宿主同路由协议

```text
/**
 * 桌面 Helper 进程管理：解析 Electron 可执行文件、拉起 electron-helper/main.js、守护协议通道、
 * 异常退出时按指数退避重启。不负责窗口内的渲染与业务判定（请求交给 bridgeHandler）。
 *
 * 与 Helper 之间除了日志还有一条 stdin/stdout 的 JSON 行协议：渲染端不直接访问 DSH WebServer
 * （桌面版的浏览器访问闸门会给插件自拉的独立进程裸 HTTP 请求回 403），改走自定义 scheme → Electron
 * 主进程 → 本模块 → 宿主路由（与 HTTP 路由同一份逻辑）。协议行带统一前缀，与普通日志行区分；素材
 * 不过管道，只传绝对路径由 main.js 自行读盘。必须始终成立：同一时刻只有一个子进程，主动停止必须
 * 走 stopAndWait，不能让新旧窗口重叠。
```

**依据 5 · 源码核查**：[dsh-pet/src/host/index.ts:1017-1075](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/src/host/index.ts#L1017-L1075)

桌面探测、下载与短路

<details>
<summary>查看原文（59行）</summary>

```text
  /** 拉起桌面 Helper：先探测本机 Electron；缺失时进程内异步下载
   *  （不 spawn 子进程，CLI node 与 DSH Desktop 均适用），下载完成后自动拉起。 */
  const startHelper = (): void => {
    if (inProcessHost) return; // 应用模式：不探测、不下载 Electron
    if (helper || electronEnsure || disposed) return;
    if (!hasDesktopPet && !(desktopModeEverActive && trayOn)) {
      // 诊断日志（issue #168）：这条短路不打日志，就是「桌面模式凭空消失：无进程、无目录、无提示」
      // 的直接成因。用 info 而非 warn——纯网页用户这是正常状态；只打一次避免刷屏。
      // 托盘关掉后这里也会命中：没人需要那个图标，空常驻没有意义。
      if (!noDesktopSkipped) {
        noDesktopSkipped = true;
        log.info(
          `[dsh-pet] 无桌面宠物（display 均为 web/none）且无需保留托盘（tray=${trayOn}），已跳过桌面 Helper 启动`,
        );
      }
      return;
    }
    // 无图形显示环境（Linux 服务器 / 容器）：直接放弃，不探测、不下载、不拉起。
    // 否则 Electron 会「拉起即崩」，被守护循环反复重启并刷满 core dump。
    if (!hasGraphicalDisplay()) {
      if (!displayWarned) {
        displayWarned = true;
        log.warn(
          '[dsh-pet] 未检测到图形显示环境（DISPLAY/WAYLAND_DISPLAY 均为空），已跳过桌面宠物。' +
            '浏览器内宠物不受影响；如需在服务器上启用桌面模式，请配置 Xvfb 后设置 DSH_PET_DESKTOP_FORCE=1。',
        );
      }
      return;
    }
    const found = resolveElectronPath();
    if (found) {
      launchHelper(found);
      return;
    }
    // 诊断日志（issue #168）：只报「没找到」不够用——最常见的情形是「文件明明存在」，
    // 但不在实际查询的路径上（DSH_HOME 不一致）。把真正查的路径一起打出来。
    log.warn(
      `[dsh-pet] 未找到 Electron 可执行文件：DSH_HOME=${dshHomeDir()}，查找路径=${defaultElectronExe()}` +
        `，DSH_PET_ELECTRON_PATH=${process.env.DSH_PET_ELECTRON_PATH ?? '(未设置)'}`,
    );
    log.warn(`[dsh-pet] 开始下载 Electron 到 ${defaultElectronExe()} ...`);
    electronEnsure = ensureElectronDownload({
      // 下载全过程写进工作状态气泡（用户没有控制台，只能靠它看进度与失败原因）
      onLog: ({ text, level, done }) =>
        reportDownload(text, level === 'warn' ? 'error' : done ? 'success' : 'working', done),
      // 同一份进度也落盘：气泡只在有宠物显示时可见，桌面版 Helper 起不来时它就没有载体
      logger: log,
    })
      .then((path) => {
        if (path) {
          launchHelper(path);
        } else {
          log.warn(
            '[dsh-pet] Electron download failed; desktop pet unavailable. Set DSH_PET_ELECTRON_PATH and restart, or retry later.',
          );
        }
      })
      .finally(() => {
        electronEnsure = undefined;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对静态桌宠或原生状态提示，有什么有限增量？

**研究主题**：贡献与相对优势

#### 完整回答

主要贡献是将动画素材池、双端共享的交互/物理逻辑及DSH会话事件结合，扩展成可自定义pet pack的表现层。相比静态桌宠，能显示任务状态和聊天；相比原生状态，是个性化常驻载体而非新增验收机制。统一路由/共享核心减少双端实现偏差，但“行为严格一致”仍是设计目标，未实际比对。装饰偏好真实存在于目标人群假设中，不等于能提升生产力或普遍值得安装。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:104-130](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/README.md#L104-L130)

物理、事件、扩展API声明

<details>
<summary>查看原文（27行）</summary>

```text
- **纯粹的桌宠**：不做天气、监控等无关功能，不碰 DSH 内核；可选能力只有下面这些（余额 / 碎碎念 / 对话 / 工作状态 / 系统通知）
- **动画链**：每个动画（含待机）播完即按权重选下一个（默认 idle 10 / turn 5 / move 5 + 分类权重，`config.jsonc` 可调），首尾相接
- **事件动画**：余额 / 碎碎念 / 工作状态按档位触发专属动画；档位支持候选数组——触发时档内随机、循环播放自动轮换，避免连播同一段
- **多开**：同时显示多个宠物，各自独立大小与位置（设置页「桌宠配置」添加/删除）
- **屏幕漫游**：朝朝向方向行走，先探测空间、不走出屏幕（多屏按各屏边界判定；设置页「锁定在当前屏幕」开启后只在当前所在那块屏内走）
- **点击 / 拖拽 / 甩抛**：点击有回应动画并 Q 弹挤压；拖拽过阻尼弹簧跟手，甩出即抛物线飞行、屏幕边缘反弹、落地摩擦停稳并 Q 弹一下；温柔放下原地停住；两端同一套纯函数物理与挤压曲线（`dsh-pet/src/shared/physics.ts`）
- **右键菜单**：「动作 → 分类 → 具体动画」任意点播（移动类动画点播会真实行走一段）；工具项——浏览器端：碎碎念 / 对话 / 回到初始位置；桌面端：+ 打开网站、查看余额（余额启用时显示）、重载配置（改完配置文件直接右键重载全部桌面宠物，不必回设置页点保存）
- **「打开网站」按宿主自动分派**：宠物宿主是 **DSH 桌面应用**时，该项自动变成「打开 DeepSeek Harness」——用应用自注册的 `dsh://open` 协议把桌面应用主窗口唤到前台（已运行则前置、未运行则拉起）；宿主是 `dsh web` / 独立模式时，仍是系统默认浏览器打开站点
- **朝向与落地**：全部动画可镜像（可朝左 / 朝右）；脚底线统一，宠物始终站在地面上
- **流畅切换**：双缓冲交叉淡入，切换无空白帧
- **余额展示**：按已用百分比分档播余额动画 + 头顶联想气泡（10 秒自动消失）；DeepSeek 显示账户余额，OpenCode Zen Go 与 Command Code 显示最紧迫的一个额度窗口；**未登记余额接口的服务商改为弹文字说明**（不静默）；按宠物独立开关
- **碎碎念与对话**：碎碎念按周期自动生成一句（说话动画 + 气泡，也可手动触发）；对话在右键弹输入框与宠物聊天，记忆持久化（浏览器 / 桌面共享同一份）
- **工作状态联动**：监听 DSH 会话事件，切「思考 / 工作 / 整理 / 等待 / 成功 / 出错」档位动画 + 常驻气泡；目标多轮任务只在真正收尾轮庆祝
- **系统通知**：窗口失焦时弹系统 toast（对话完成 / 生成失败 / 输出截断 / 权限申请 / 用户选择）
- **桌面模式（可选）**：每只宠物开一个独立透明置顶局部小窗，与浏览器严格同行为、共用同一份素材与纯逻辑（见下节）
- **pet pack（额外宠物种类）**：`pet/` 下建 `种类名-config.json` + `种类名-animation/` 即新增独立动画池与素材的全新种类，多实例共享素材（见 [CONFIG.md](CONFIG.md) 的「方式四」）
- **自定义动画**：往 `main-animation/webm/` 放 VP9-Alpha 的 `.webm` 即为新动画，优先于包内素材
- **无障碍**：支持 `prefers-reduced-motion`（减少动效时跳过 Q 弹挤压与淡入切换）

## 🔌 对外接口（供其他插件调用）

桌宠不只自己玩，也**对外开放两条调用通道**，让别的插件或脚本能驱动它、读它的状态。

- **能做什么**：让它说一句指定的话、播一段指定动画、与它对话；读它当前说的话、工作状态、系统通知与余额
- **为什么开放**：桌宠不该只是个摆设——比如一个「女仆」插件巡检验完想说句话，就能让桌宠当它的「实体」开口；也方便任何人基于它做二次开发
- **通道一 · HTTP**：挂在 DSH 自己的 Web 服务上（前缀 `/dsh-pet-7340`，只监听本机、无鉴权），跨进程、脚本可直接调。动作类接口只回 `{ok}`，数据统一从 `GET /state` 读
- **通道二 · Cordis 服务**：客户端半侧在 DSH web 页面内注册，同页客户端插件用 `ctx.get('petApi7340')` 直接取，零网络、零端口；只在该页面实例内有效，方法与返回见 [`CORDIS.md`](CORDIS.md)
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/helper-process.ts:1-9](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/src/host/helper-process.ts#L1-L9)

共享路由而非双端重复业务

```text
/**
 * 桌面 Helper 进程管理：解析 Electron 可执行文件、拉起 electron-helper/main.js、守护协议通道、
 * 异常退出时按指数退避重启。不负责窗口内的渲染与业务判定（请求交给 bridgeHandler）。
 *
 * 与 Helper 之间除了日志还有一条 stdin/stdout 的 JSON 行协议：渲染端不直接访问 DSH WebServer
 * （桌面版的浏览器访问闸门会给插件自拉的独立进程裸 HTTP 请求回 403），改走自定义 scheme → Electron
 * 主进程 → 本模块 → 宿主路由（与 HTTP 路由同一份逻辑）。协议行带统一前缀，与普通日志行区分；素材
 * 不过管道，只传绝对路径由 main.js 自行读盘。必须始终成立：同一时刻只有一个子进程，主动停止必须
 * 走 stopAndWait，不能让新旧窗口重叠。
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 默认启用的下载和模型调用会怎样改变采用负担？

**研究主题**：缺陷与关键质疑

#### 完整回答

默认配置同时web/desktop且whisperEnabled=true，不是安装后只有静态动画：会触发Electron获取、常驻Helper与周期模型碎碎念，模型失败还可能按配置回退。README HTTP“本机无鉴权”与当前Helper注释的宿主访问闸门语义不能直接互相替代，应按部署实际核验，不能据文案断言对外暴露。Safari需要另取mov，素材也有非商业限制；任务成功动画只是事件映射，不是业务已成功的验证。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/assets/config.jsonc:198-216](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/assets/config.jsonc#L198-L216)

默认碎碎念与both显示

<details>
<summary>查看原文（19行）</summary>

```text
      "id": "main",
      "size": 462,
      "balanceEnabled": true,
      // 碎碎念默认开启：每次生成都会调用当前对话的模型。本地 LLM 单并发时，
      // 后台碎碎念会顶掉正在跑的任务的 KV cache（与 DSH 多子代理同因）。
      // 不需要碎碎念的宠物改为 false（设置页也可开关）。
      "whisperEnabled": true,
      // 工作状态联动默认开启：监听 DSH 会话事件（工具调用等），按
      // animations.events.workStatus 数组切档位动画 + 气泡（仅监听，不调用模型）。
      "workStatusEnabled": true,
      // 宠物固定：true = 随机动画链不再抽「转向 / 移动」两档——宠物不自己翻朝向、也不自己
      // 走开，只播原地待机与随机小动作（两档原本的权重自然并入随机小动作，见文件末尾
      // animationWeights 的说明）。默认 false = 保持原行为（会自己走、会自己翻）。
      // **只影响随机链**：右键菜单点播（含「转向 / 移动」两项）、/anim 接口与命令、
      // 余额/碎碎念/工作状态事件动画、点击回应与拖拽一律照常——用户主动触发的不受此限制。
      // 设置页有同名勾选框。改动后刷新或重启生效。
      "fixedEnabled": false,
      "display": "both",
      "position": {
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/index.ts:1017-1075](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/src/host/index.ts#L1017-L1075)

自动下载路径

<details>
<summary>查看原文（59行）</summary>

```text
  /** 拉起桌面 Helper：先探测本机 Electron；缺失时进程内异步下载
   *  （不 spawn 子进程，CLI node 与 DSH Desktop 均适用），下载完成后自动拉起。 */
  const startHelper = (): void => {
    if (inProcessHost) return; // 应用模式：不探测、不下载 Electron
    if (helper || electronEnsure || disposed) return;
    if (!hasDesktopPet && !(desktopModeEverActive && trayOn)) {
      // 诊断日志（issue #168）：这条短路不打日志，就是「桌面模式凭空消失：无进程、无目录、无提示」
      // 的直接成因。用 info 而非 warn——纯网页用户这是正常状态；只打一次避免刷屏。
      // 托盘关掉后这里也会命中：没人需要那个图标，空常驻没有意义。
      if (!noDesktopSkipped) {
        noDesktopSkipped = true;
        log.info(
          `[dsh-pet] 无桌面宠物（display 均为 web/none）且无需保留托盘（tray=${trayOn}），已跳过桌面 Helper 启动`,
        );
      }
      return;
    }
    // 无图形显示环境（Linux 服务器 / 容器）：直接放弃，不探测、不下载、不拉起。
    // 否则 Electron 会「拉起即崩」，被守护循环反复重启并刷满 core dump。
    if (!hasGraphicalDisplay()) {
      if (!displayWarned) {
        displayWarned = true;
        log.warn(
          '[dsh-pet] 未检测到图形显示环境（DISPLAY/WAYLAND_DISPLAY 均为空），已跳过桌面宠物。' +
            '浏览器内宠物不受影响；如需在服务器上启用桌面模式，请配置 Xvfb 后设置 DSH_PET_DESKTOP_FORCE=1。',
        );
      }
      return;
    }
    const found = resolveElectronPath();
    if (found) {
      launchHelper(found);
      return;
    }
    // 诊断日志（issue #168）：只报「没找到」不够用——最常见的情形是「文件明明存在」，
    // 但不在实际查询的路径上（DSH_HOME 不一致）。把真正查的路径一起打出来。
    log.warn(
      `[dsh-pet] 未找到 Electron 可执行文件：DSH_HOME=${dshHomeDir()}，查找路径=${defaultElectronExe()}` +
        `，DSH_PET_ELECTRON_PATH=${process.env.DSH_PET_ELECTRON_PATH ?? '(未设置)'}`,
    );
    log.warn(`[dsh-pet] 开始下载 Electron 到 ${defaultElectronExe()} ...`);
    electronEnsure = ensureElectronDownload({
      // 下载全过程写进工作状态气泡（用户没有控制台，只能靠它看进度与失败原因）
      onLog: ({ text, level, done }) =>
        reportDownload(text, level === 'warn' ? 'error' : done ? 'success' : 'working', done),
      // 同一份进度也落盘：气泡只在有宠物显示时可见，桌面版 Helper 起不来时它就没有载体
      logger: log,
    })
      .then((path) => {
        if (path) {
          launchHelper(path);
        } else {
          log.warn(
            '[dsh-pet] Electron download failed; desktop pet unavailable. Set DSH_PET_ELECTRON_PATH and restart, or retry later.',
          );
        }
      })
      .finally(() => {
        electronEnsure = undefined;
```

</details>

**依据 3 · 作者声明**：[README.md:129-130](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/README.md#L129-L130)

HTTP访问说明

```text
- **通道一 · HTTP**：挂在 DSH 自己的 Web 服务上（前缀 `/dsh-pet-7340`，只监听本机、无鉴权），跨进程、脚本可直接调。动作类接口只回 `{ok}`，数据统一从 `GET /state` 读
- **通道二 · Cordis 服务**：客户端半侧在 DSH web 页面内注册，同页客户端插件用 `ctx.get('petApi7340')` 直接取，零网络、零端口；只在该页面实例内有效，方法与返回见 [`CORDIS.md`](CORDIS.md)
```

**依据 4 · 源码核查**：[dsh-pet/src/host/helper-process.ts:1-9](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/src/host/helper-process.ts#L1-L9)

当前Helper因宿主闸门走协议

```text
/**
 * 桌面 Helper 进程管理：解析 Electron 可执行文件、拉起 electron-helper/main.js、守护协议通道、
 * 异常退出时按指数退避重启。不负责窗口内的渲染与业务判定（请求交给 bridgeHandler）。
 *
 * 与 Helper 之间除了日志还有一条 stdin/stdout 的 JSON 行协议：渲染端不直接访问 DSH WebServer
 * （桌面版的浏览器访问闸门会给插件自拉的独立进程裸 HTTP 请求回 403），改走自定义 scheme → Electron
 * 主进程 → 本模块 → 宿主路由（与 HTTP 路由同一份逻辑）。协议行带统一前缀，与普通日志行区分；素材
 * 不过管道，只传绝对路径由 main.js 自行读盘。必须始终成立：同一时刻只有一个子进程，主动停止必须
 * 走 stopAndWait，不能让新旧窗口重叠。
```

**依据 5 · 作者声明**：[README.md:432-438](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/README.md#L432-L438)

素材与形象授权声明

```text
## 许可

- 代码：MIT
- 素材（动画/提示词/源视频）：允许开源使用，**禁止商用**
- **二次创作（二创）约定**：基于本项目的衍生 / 改版 / 换皮作品，在 **GitHub 仓库、产品官网等公开渠道**上须附上原作者 GitHub 地址：<https://github.com/PC2005-cloud/dsh-pet>
- **形象出处**：宠物形象为社区二创的 DeepSeek「大肥鱼」（鲸鱼娘），**非 DeepSeek 官方形象**；原型「溟月」出自 B 站 [@上善无形](https://space.bilibili.com/4456176)，DeepSeek 版（女仆鲸鱼娘）设计出自 B 站 [@ZipZipPipe](https://space.bilibili.com/4168597)
- **形象授权**：[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)（署名 · 非商业 · 相同方式共享），[声明原文](https://www.bilibili.com/opus/1247156596114456581)：「大肥鱼是遵守CC BY-NC-SA 4.0协议的形象，不可以以任何形式商业化。若您非常喜爱该形象，希望其拥有实体，您可以自行定制。」
```

#### 缺口

- 不同宿主部署的HTTP访问准入、动画事件归属与模型调用费用未验证
  **影响**：不能保证默认启用无额外资源和权限负担
  **进一步探讨**：在隔离profile核对实际路由准入、调用日志、任务状态和配置停用结果

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何收窄到不需要桌面下载和自动AI的路径？

**研究主题**：依赖、兼容与流程

#### 完整回答

Node要求22.12+并需匹配宿主peer及兼容矩阵。基础插件仍注入模型和凭据服务，关闭自动AI不代表完全移除模块依赖；要避免桌面下载，应在加载前在DSH_HOME/dsh-pet/main-config.jsonc明确web显示、关闭自动碎碎念和不需的余额/通知，并确认无保留托盘配置。配置格式应按当前完整实例字段而非过时简例核对；格式缺项会回默认或报错，不能只隐藏窗口就假设停止后台。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/package.json:114-139](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/package.json#L114-L139)

Node与依赖/兼容要求

<details>
<summary>查看原文（26行）</summary>

```text
        "0.2.0-rc.1": "compatible",
        "0.2.0-rc.2": "compatible",
        "0.2.1-rc.2": "compatible"
      }
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection"
      ],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-agent-default-model": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-connection": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-commands": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-credentials": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-home-paths": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-host-webserver": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "^0.2.0-rc.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/index.ts:94-95](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/src/host/index.ts#L94-L95)

必需注入服务

```text
/** 需要注入的服务：webServer（路由）+ agentDefaultModel（当前服务商）+ credentials（凭证）+ llm（对话模型调用）+ commands（/balance 斜杠命令）+ connection（桌面 Helper「打开网站」用的已鉴权站点 URL） */
export const inject = ['webServer', 'agentDefaultModel', 'credentials', 'llm', 'commands', 'connection'];
```

**依据 3 · 作者声明**：[CONFIG.md:24-48](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/CONFIG.md#L24-L48)

用户配置路径与覆盖规则

<details>
<summary>查看原文（25行）</summary>

````text
插件包内 `dsh-pet/assets/config.jsonc` 的 `pets` 数组定义**默认宠物**：

```jsonc
"pets": [
  { "id": "main", "size": 462, "balanceEnabled": true, "display": "both", "position": { "corner": "top-right", "marginX": 24, "marginY": 100 } }
]
```

- 每只宠物：`id`（标识）／`size`（宽度 px）／`balanceEnabled`（是否启用余额功能，必填布尔）／`display`（web/desktop/both/none，必填，见上）／`position`（corner 四角之一 + marginX/marginY 边距）
- 余额刷新周期：`eventsRefreshSec.balance`（秒）——余额数据刷新与余额动画触发的间隔，启动时立即触发一次，之后按此周期循环（默认 1800）
- 设置页的修改保存到用户层 `$DSH_HOME/dsh-pet/main-config.jsonc`（**完整宠物列表**，覆盖包内默认）；「同步」把包内 `config.jsonc` 原文整份写入该文件（等价于回落默认，但文件保留下来、可直接编辑）

## 方式三：手动编辑配置文件（高级，任意自由配置）

用户层配置文件位于 `$DSH_HOME/dsh-pet/main-config.jsonc`。**它和包内默认配置是同一套格式**——想改什么直接照着 `assets/config.jsonc` 的结构写即可，写错的字段/缺失的字段回落默认，无需（也无法）写完整份。设置页「同步」可直接生成这份完整文件（原文复制包内 `config.jsonc`，注释齐全）：

| 字段                   | 作用                                                                                    | 格式与默认一致即可         |
| ---------------------- | --------------------------------------------------------------------------------------- | -------------------------- |
| `pets`                 | 宠物列表（大小/位置/多开/余额开关）                                                     | 数组，每项同 `pets[]` 结构 |
| `animations`           | **动画池**：idle / turn / drag / clicks / moves / categories / events（余额等事件动画） | 同 `animations` 结构       |
| `animationWeights`     | 动画链播放权重（idle / turn / move）                                                    | 同 `animationWeights` 结构 |
| `eventsRefreshSec`     | 事件刷新周期（秒）                                                                      | 同 `eventsRefreshSec` 结构 |
| `notificationsEnabled` | 系统通知总开关（布尔）                                                                  | 同 `notificationsEnabled`  |

> 覆盖语义：用户层给出即**整体替换**该字段（如写了 `animations` 就用你的整份动画池，替代默认），没写的字段回落包内默认。校验在插件加载时执行——格式错误会在 DSH 控制台显式报错，不会静默运行残缺配置。
````

</details>

**依据 4 · 源码核查**：[dsh-pet/src/host/index.ts:1020-1032](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/src/host/index.ts#L1020-L1032)

无桌面宠物/托盘时不下载

<details>
<summary>查看原文（13行）</summary>

```text
    if (inProcessHost) return; // 应用模式：不探测、不下载 Electron
    if (helper || electronEnsure || disposed) return;
    if (!hasDesktopPet && !(desktopModeEverActive && trayOn)) {
      // 诊断日志（issue #168）：这条短路不打日志，就是「桌面模式凭空消失：无进程、无目录、无提示」
      // 的直接成因。用 info 而非 warn——纯网页用户这是正常状态；只打一次避免刷屏。
      // 托盘关掉后这里也会命中：没人需要那个图标，空常驻没有意义。
      if (!noDesktopSkipped) {
        noDesktopSkipped = true;
        log.info(
          `[dsh-pet] 无桌面宠物（display 均为 web/none）且无需保留托盘（tray=${trayOn}），已跳过桌面 Helper 启动`,
        );
      }
      return;
```

</details>

**依据 5 · 源码核查**：[dsh-pet/package.json:94-106](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/package.json#L94-L106)

Node22.12+引擎要求与Electron/模型包依赖

<details>
<summary>查看原文（13行）</summary>

```text
    "test:ui": "node --test scripts/tests/*.test.mjs"
  },
  "license": "MIT",
  "engines": {
    "node": ">=22.12.0"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "0.135.0",
    "@electron-internal/extract-zip": "^1.0.5",
    "@electron/get": "^5.1.0",
    "openai": "7.39.0",
    "zod": "4.6.7"
  },
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续、失败恢复和卸载分别保留什么？

**研究主题**：效果与总成本

#### 完整回答

首次要核对profile/宿主与配置，默认还可能下载Electron并建缓存；持续有动画解码、Helper资源、余额联网和碎碎念模型调用，金额/CPU/内存未知。桌面失败可保留浏览器模式，Helper重启和stopAndWait处理窗口重叠；关闭/卸载不意味着Electron缓存、用户配置和聊天记忆全删。试用需先关不需要的自动功能，退出核对进程与数据，不把“无关功能少”当低总成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:80-100](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/README.md#L80-L100)

默认双端和下载行为

<details>
<summary>查看原文（21行）</summary>

````text
### 安装后你会看到什么

默认配置是 `display: "both"`（浏览器与桌面都显示），所以重开 DSH 之后会依次出现两处，不必手动开：

1. **浏览器端先出现。** 宠物落在界面右上角（默认角落，设置页可改），此时桌面上还是空的。
2. **宿主自动补桌面运行时。** 本机没有 Electron 时，插件会自己下载一份（落在 `~/.dsh/electron`，同一版本只下一次；默认走 npmmirror 镜像）。进度直接打在 DSH 的控制台里，形如：

   ```
   [dsh-pet] Electron not found, downloading to <用户目录>/.dsh/electron/electron.exe ...
   [dsh-pet] Electron not found, downloading v43.3.0 (win32-x64) ...
   [dsh-pet] downloading 42.3MB / 104.1MB
   [dsh-pet] download complete (37.5s), extracting to <用户目录>/.dsh/electron ...
   ```

   这一步在**后台**进行，浏览器里的宠物照常可用；要等多久取决于网速（几十秒到几分钟），期间不用管它。
3. **桌面端随后出现。** 解压完自动拉起桌面 Helper，同一只宠物以透明窗形式落到桌面上——**此时屏幕上一共两只**：浏览器里一只、桌面上那只，共用同一份配置与同一套动画。
4. **想只留一只。** 两条路都行，改完即时生效：
   - **设置页**：选中该宠物 →「显示位置」下拉框 → 仅浏览器 / 仅桌面 / 两者都显示 / 都不显示；
   - **宠物右键**：菜单里的「显示位置」子菜单 → 仅网页 / 仅桌面 / 两者 / 都不（不用回设置页）。

> 已经装过 Electron（或设了 `DSH_PET_ELECTRON_PATH` 指向现成可执行文件）时，第 2 步会跳过，桌面端几乎立刻出现。下载失败**只影响桌面模式**：控制台会给出提示，浏览器里的宠物不受影响；网络受限时可以设 `DSH_PET_ELECTRON_MIRROR` 换镜像、`DSH_PET_ELECTRON_VERSION` 指定版本，重启后再试。
````

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/index.ts:1079-1105](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/src/host/index.ts#L1079-L1105)

停旧helper与排队同步

<details>
<summary>查看原文（27行）</summary>

```text
  /** 停止桌面 Helper（保留配置，可再次拉起）。宿主退出/插件卸载路径：不等它退干净（见 stopAndWait）。 */
  const stopHelper = (reason = 'settings-change'): void => {
    if (startRetryTimer) {
      clearTimeout(startRetryTimer);
      startRetryTimer = undefined;
    }
    helper?.stop(reason);
    helper = undefined;
  };

  /** 停止并等旧 helper 真正退出：配置变更触发的「停旧起新」专用。 */
  const stopHelperAndWait = async (reason: string): Promise<void> => {
    if (startRetryTimer) {
      clearTimeout(startRetryTimer);
      startRetryTimer = undefined;
    }
    const old = helper;
    helper = undefined;
    await old?.stopAndWait(reason);
  };

  /**
   * 宠物配置（display / size 等）变更后：重解析桌面宠物，等旧 helper 退出再拉起新的。
   *
   * Electron 收到 SIGTERM 后关窗是异步的（几百 ms 起），发完 kill 就 spawn 新进程会让旧窗口与
   * 新窗口短暂共存（用户看到「改完大小冒出来第二只宠物」）；连续保存也会交错拉起两个 helper，
   * 所以用队列串行，且队列自身绝不留下 rejected 状态。
```

</details>

**依据 3 · 源码核查**：[dsh-pet/scripts/ensure-electron.mjs:3-9](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/scripts/ensure-electron.mjs#L3-L9)

不清理旧版本/现有二进制复用

```text
 * 把 Electron 下载并解压到 $DSH_HOME/electron（默认 ~/.dsh/electron），供桌面 Helper 使用。
 *
 * 下载交给 @electron/get（URL 拼装、镜像、SHA256 校验、缓存复用），解压交给
 * @electron-internal/extract-zip（纯 Node + native，跨平台处理 symlink 与权限，不依赖系统 unzip/tar）。
 * 不做版本管理、不清理旧版本，也不拉起 Helper：可执行文件已存在就原样复用并直接返回。
 * 版本与镜像可由环境变量覆盖，落盘主目录由 DSH_HOME 决定，具体见 README。
 * 必须始终：解压后确认可执行文件真的存在，否则视为失败退出。
```

#### 缺口

- 目标设备动画资源开销、周期模型费用及退出残留未知
  **影响**：无法证明娱乐价值覆盖后台负担
  **进一步探讨**：记录浏览器模式与默认双端的资源/调用差异并核对停用后进程和用户目录

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些共享逻辑和生命周期设计可借鉴？

**研究主题**：工程质量与复用

#### 完整回答

可借鉴将状态reducer、物理动画与业务路由从渲染端分离，桌面和浏览器复用，以及配置变更时等旧Helper退出再串行启动新进程。这样针对“双窗口重叠”有明确因果处理，而不是凭测试数量保证一致。维护代价是Host与shared配置部分因单文件约束存在副本，字段同步和多平台素材仍需人工；路径词法检查不能未经symlink核对即宣称完全沙箱。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/index.ts:1079-1105](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/src/host/index.ts#L1079-L1105)

Helper停止顺序和同步队列

<details>
<summary>查看原文（27行）</summary>

```text
  /** 停止桌面 Helper（保留配置，可再次拉起）。宿主退出/插件卸载路径：不等它退干净（见 stopAndWait）。 */
  const stopHelper = (reason = 'settings-change'): void => {
    if (startRetryTimer) {
      clearTimeout(startRetryTimer);
      startRetryTimer = undefined;
    }
    helper?.stop(reason);
    helper = undefined;
  };

  /** 停止并等旧 helper 真正退出：配置变更触发的「停旧起新」专用。 */
  const stopHelperAndWait = async (reason: string): Promise<void> => {
    if (startRetryTimer) {
      clearTimeout(startRetryTimer);
      startRetryTimer = undefined;
    }
    const old = helper;
    helper = undefined;
    await old?.stopAndWait(reason);
  };

  /**
   * 宠物配置（display / size 等）变更后：重解析桌面宠物，等旧 helper 退出再拉起新的。
   *
   * Electron 收到 SIGTERM 后关窗是异步的（几百 ms 起），发完 kill 就 spawn 新进程会让旧窗口与
   * 新窗口短暂共存（用户看到「改完大小冒出来第二只宠物」）；连续保存也会交错拉起两个 helper，
   * 所以用队列串行，且队列自身绝不留下 rejected 状态。
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/config.ts:1-7](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/src/host/config.ts#L1-L7)

Host不import shared，存在实现副本

```text
/**
 * host 侧配置模块：插件唯一的配置读取入口与写盘出口。
 *
 * 不负责渲染与运行时状态；浏览器半侧的拍平逻辑在 src/shared/config.ts（本模块是 host 自包含实现，
 * 不 import src/shared —— DSH 单文件加载约束）。
 * 依赖内置默认 assets/config.jsonc、用户主配置 main-config.jsonc 与文件宠物目录 pet/。
 * 必须始终成立：readAllConfig 的返回值绝对正确（字段填满、绝不残缺/非法），消费端零校验。
```

**依据 3 · 源码核查**：[dsh-pet/src/host/index.ts:130-145](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/src/host/index.ts#L130-L145)

素材路径解析的实际范围

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * 规范化并校验请求路径，确保它在 assets 根目录内（防路径穿越）。
 * @returns 规范化后的绝对文件路径；非法（穿越）时返回 undefined。
 */
function resolveAsset(root: string, rel: string): string | undefined {
  if (rel.length === 0) return undefined;
  const candidate = normalize(join(root, rel));
  const rootWithSep = root.endsWith(sep) ? root : root + sep;
  if (candidate !== root && !candidate.startsWith(rootWithSep)) return undefined;
  return candidate;
}

/** 在 root 下解析并确认实体存在；非法（穿越）或不存在时返回 undefined */
function resolveExisting(root: string, rel: string): string | undefined {
  const candidate = resolveAsset(root, rel);
  return candidate && existsSync(candidate) ? candidate : undefined;
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 能否让娱乐模式的资源与任务语义更可预测？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是首次加载提供纯动画/状态伴随/AI聊天三种明确能力预算，并显示自动下载、联网和模型周期；成功动画另标“本轮结束”而非任务办结。由默认both+whisper与任务状态映射推导，可让想看宠物的人不意外承担AI或桌面成本。对照默认和显式预算模式，测用户是否正确预计后台进程/调用以及停用是否符合预期；若选择负担增加而资源误判不减少则否定。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/assets/config.jsonc:198-216](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/assets/config.jsonc#L198-L216)

默认自动能力

<details>
<summary>查看原文（19行）</summary>

```text
      "id": "main",
      "size": 462,
      "balanceEnabled": true,
      // 碎碎念默认开启：每次生成都会调用当前对话的模型。本地 LLM 单并发时，
      // 后台碎碎念会顶掉正在跑的任务的 KV cache（与 DSH 多子代理同因）。
      // 不需要碎碎念的宠物改为 false（设置页也可开关）。
      "whisperEnabled": true,
      // 工作状态联动默认开启：监听 DSH 会话事件（工具调用等），按
      // animations.events.workStatus 数组切档位动画 + 气泡（仅监听，不调用模型）。
      "workStatusEnabled": true,
      // 宠物固定：true = 随机动画链不再抽「转向 / 移动」两档——宠物不自己翻朝向、也不自己
      // 走开，只播原地待机与随机小动作（两档原本的权重自然并入随机小动作，见文件末尾
      // animationWeights 的说明）。默认 false = 保持原行为（会自己走、会自己翻）。
      // **只影响随机链**：右键菜单点播（含「转向 / 移动」两项）、/anim 接口与命令、
      // 余额/碎碎念/工作状态事件动画、点击回应与拖拽一律照常——用户主动触发的不受此限制。
      // 设置页有同名勾选框。改动后刷新或重启生效。
      "fixedEnabled": false,
      "display": "both",
      "position": {
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/index.ts:1017-1075](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/src/host/index.ts#L1017-L1075)

桌面资源自动获取

<details>
<summary>查看原文（59行）</summary>

```text
  /** 拉起桌面 Helper：先探测本机 Electron；缺失时进程内异步下载
   *  （不 spawn 子进程，CLI node 与 DSH Desktop 均适用），下载完成后自动拉起。 */
  const startHelper = (): void => {
    if (inProcessHost) return; // 应用模式：不探测、不下载 Electron
    if (helper || electronEnsure || disposed) return;
    if (!hasDesktopPet && !(desktopModeEverActive && trayOn)) {
      // 诊断日志（issue #168）：这条短路不打日志，就是「桌面模式凭空消失：无进程、无目录、无提示」
      // 的直接成因。用 info 而非 warn——纯网页用户这是正常状态；只打一次避免刷屏。
      // 托盘关掉后这里也会命中：没人需要那个图标，空常驻没有意义。
      if (!noDesktopSkipped) {
        noDesktopSkipped = true;
        log.info(
          `[dsh-pet] 无桌面宠物（display 均为 web/none）且无需保留托盘（tray=${trayOn}），已跳过桌面 Helper 启动`,
        );
      }
      return;
    }
    // 无图形显示环境（Linux 服务器 / 容器）：直接放弃，不探测、不下载、不拉起。
    // 否则 Electron 会「拉起即崩」，被守护循环反复重启并刷满 core dump。
    if (!hasGraphicalDisplay()) {
      if (!displayWarned) {
        displayWarned = true;
        log.warn(
          '[dsh-pet] 未检测到图形显示环境（DISPLAY/WAYLAND_DISPLAY 均为空），已跳过桌面宠物。' +
            '浏览器内宠物不受影响；如需在服务器上启用桌面模式，请配置 Xvfb 后设置 DSH_PET_DESKTOP_FORCE=1。',
        );
      }
      return;
    }
    const found = resolveElectronPath();
    if (found) {
      launchHelper(found);
      return;
    }
    // 诊断日志（issue #168）：只报「没找到」不够用——最常见的情形是「文件明明存在」，
    // 但不在实际查询的路径上（DSH_HOME 不一致）。把真正查的路径一起打出来。
    log.warn(
      `[dsh-pet] 未找到 Electron 可执行文件：DSH_HOME=${dshHomeDir()}，查找路径=${defaultElectronExe()}` +
        `，DSH_PET_ELECTRON_PATH=${process.env.DSH_PET_ELECTRON_PATH ?? '(未设置)'}`,
    );
    log.warn(`[dsh-pet] 开始下载 Electron 到 ${defaultElectronExe()} ...`);
    electronEnsure = ensureElectronDownload({
      // 下载全过程写进工作状态气泡（用户没有控制台，只能靠它看进度与失败原因）
      onLog: ({ text, level, done }) =>
        reportDownload(text, level === 'warn' ? 'error' : done ? 'success' : 'working', done),
      // 同一份进度也落盘：气泡只在有宠物显示时可见，桌面版 Helper 起不来时它就没有载体
      logger: log,
    })
      .then((path) => {
        if (path) {
          launchHelper(path);
        } else {
          log.warn(
            '[dsh-pet] Electron download failed; desktop pet unavailable. Set DSH_PET_ELECTRON_PATH and restart, or retry later.',
          );
        }
      })
      .finally(() => {
        electronEnsure = undefined;
```

</details>

**依据 3 · 作者声明**：[README.md:114-117](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/README.md#L114-L117)

状态和通知语义

```text
- **余额展示**：按已用百分比分档播余额动画 + 头顶联想气泡（10 秒自动消失）；DeepSeek 显示账户余额，OpenCode Zen Go 与 Command Code 显示最紧迫的一个额度窗口；**未登记余额接口的服务商改为弹文字说明**（不静默）；按宠物独立开关
- **碎碎念与对话**：碎碎念按周期自动生成一句（说话动画 + 气泡，也可手动触发）；对话在右键弹输入框与宠物聊天，记忆持久化（浏览器 / 桌面共享同一份）
- **工作状态联动**：监听 DSH 会话事件，切「思考 / 工作 / 整理 / 等待 / 成功 / 出错」档位动画 + 常驻气泡；目标多轮任务只在真正收尾轮庆祝
- **系统通知**：窗口失焦时弹系统 toast（对话完成 / 生成失败 / 输出截断 / 权限申请 / 用户选择）
```

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 什么人可先试，何时应停止？

**研究主题**：采用判断

#### 完整回答

明确想要动画陪伴且会配置DSH的个人用户，可在独立profile加载前设仅web、关闭whisper和不需的余额/通知，先核对一只宠物的状态与操作不遮挡。若配置未生效、仍下载Electron、出现额外模型调用或动画干扰，应停插件、核对Helper进程并保留/清理相应配置，回到原生状态通知或静态桌宠。商业交付先核对素材范围，不把代码MIT外推至动画与形象。

#### 证据与依据

**依据 1 · 作者声明**：[CONFIG.md:24-48](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/CONFIG.md#L24-L48)

可预写配置路径

<details>
<summary>查看原文（25行）</summary>

````text
插件包内 `dsh-pet/assets/config.jsonc` 的 `pets` 数组定义**默认宠物**：

```jsonc
"pets": [
  { "id": "main", "size": 462, "balanceEnabled": true, "display": "both", "position": { "corner": "top-right", "marginX": 24, "marginY": 100 } }
]
```

- 每只宠物：`id`（标识）／`size`（宽度 px）／`balanceEnabled`（是否启用余额功能，必填布尔）／`display`（web/desktop/both/none，必填，见上）／`position`（corner 四角之一 + marginX/marginY 边距）
- 余额刷新周期：`eventsRefreshSec.balance`（秒）——余额数据刷新与余额动画触发的间隔，启动时立即触发一次，之后按此周期循环（默认 1800）
- 设置页的修改保存到用户层 `$DSH_HOME/dsh-pet/main-config.jsonc`（**完整宠物列表**，覆盖包内默认）；「同步」把包内 `config.jsonc` 原文整份写入该文件（等价于回落默认，但文件保留下来、可直接编辑）

## 方式三：手动编辑配置文件（高级，任意自由配置）

用户层配置文件位于 `$DSH_HOME/dsh-pet/main-config.jsonc`。**它和包内默认配置是同一套格式**——想改什么直接照着 `assets/config.jsonc` 的结构写即可，写错的字段/缺失的字段回落默认，无需（也无法）写完整份。设置页「同步」可直接生成这份完整文件（原文复制包内 `config.jsonc`，注释齐全）：

| 字段                   | 作用                                                                                    | 格式与默认一致即可         |
| ---------------------- | --------------------------------------------------------------------------------------- | -------------------------- |
| `pets`                 | 宠物列表（大小/位置/多开/余额开关）                                                     | 数组，每项同 `pets[]` 结构 |
| `animations`           | **动画池**：idle / turn / drag / clicks / moves / categories / events（余额等事件动画） | 同 `animations` 结构       |
| `animationWeights`     | 动画链播放权重（idle / turn / move）                                                    | 同 `animationWeights` 结构 |
| `eventsRefreshSec`     | 事件刷新周期（秒）                                                                      | 同 `eventsRefreshSec` 结构 |
| `notificationsEnabled` | 系统通知总开关（布尔）                                                                  | 同 `notificationsEnabled`  |

> 覆盖语义：用户层给出即**整体替换**该字段（如写了 `animations` 就用你的整份动画池，替代默认），没写的字段回落包内默认。校验在插件加载时执行——格式错误会在 DSH 控制台显式报错，不会静默运行残缺配置。
````

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/index.ts:1020-1032](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/dsh-pet/src/host/index.ts#L1020-L1032)

web模式短路

<details>
<summary>查看原文（13行）</summary>

```text
    if (inProcessHost) return; // 应用模式：不探测、不下载 Electron
    if (helper || electronEnsure || disposed) return;
    if (!hasDesktopPet && !(desktopModeEverActive && trayOn)) {
      // 诊断日志（issue #168）：这条短路不打日志，就是「桌面模式凭空消失：无进程、无目录、无提示」
      // 的直接成因。用 info 而非 warn——纯网页用户这是正常状态；只打一次避免刷屏。
      // 托盘关掉后这里也会命中：没人需要那个图标，空常驻没有意义。
      if (!noDesktopSkipped) {
        noDesktopSkipped = true;
        log.info(
          `[dsh-pet] 无桌面宠物（display 均为 web/none）且无需保留托盘（tray=${trayOn}），已跳过桌面 Helper 启动`,
        );
      }
      return;
```

</details>

**依据 3 · 作者声明**：[README.md:432-438](https://github.com/PC2005-cloud/dsh-pet/blob/dfc03961bdb4d26898838cb72c9c2ac09699b1e2/README.md#L432-L438)

代码与素材许可不同

```text
## 许可

- 代码：MIT
- 素材（动画/提示词/源视频）：允许开源使用，**禁止商用**
- **二次创作（二创）约定**：基于本项目的衍生 / 改版 / 换皮作品，在 **GitHub 仓库、产品官网等公开渠道**上须附上原作者 GitHub 地址：<https://github.com/PC2005-cloud/dsh-pet>
- **形象出处**：宠物形象为社区二创的 DeepSeek「大肥鱼」（鲸鱼娘），**非 DeepSeek 官方形象**；原型「溟月」出自 B 站 [@上善无形](https://space.bilibili.com/4456176)，DeepSeek 版（女仆鲸鱼娘）设计出自 B 站 [@ZipZipPipe](https://space.bilibili.com/4168597)
- **形象授权**：[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)（署名 · 非商业 · 相同方式共享），[声明原文](https://www.bilibili.com/opus/1247156596114456581)：「大肥鱼是遵守CC BY-NC-SA 4.0协议的形象，不可以以任何形式商业化。若您非常喜爱该形象，希望其拥有实体，您可以自行定制。」
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
