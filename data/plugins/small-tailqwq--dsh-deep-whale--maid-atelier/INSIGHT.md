# maid-atelier · 深海女仆工坊

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[7029aaa](https://github.com/Small-tailqwq/dsh-deep-whale/tree/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier)

<!-- BEGIN META -->
[![GitHub ★ 2,989](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C989&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Small-tailqwq/dsh-deep-whale) [![npm 30d 75,280](https://img.shields.io/static/v1?label=npm+30d&message=75%2C280&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-maid-atelier) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@smalltailqwq/dsh-client-ui-skin-maid-atelier)
<!-- END META -->

> **功能**：为 DSH Web 界面提供双女仆主题、亮暗背景、侧栏装饰和表格阅读交互。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 支持的增量是可统一启停的主题组合，包括聊天区场景、图标恢复与按溢出触发展开表格，减少个人逐处拼接样式的接线。宿主加载、共享图片服务和衍生美术各有原归属，不计为本包首创或模型能力。

> **主要限制**：[Q03](#research-q03) 皮肤依赖宿主类名及状态结构，还改变输入框显隐和宽表格交互；版本声明不能保证控件可读可用。源码有具体释放路径，但跨版本适配、并发修改与实际停用结果尚未验证，不能把装饰范围小当作零干扰。

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
  - [Q01 · 谁需要女仆工坊，相对默认界面和手写 CSS 增加什么？](#detail-section-11)
  - [Q02 · 主题与图片如何加载，用户能看到哪些行为？](#detail-section-12)
  - [Q03 · 启用与退出要满足什么条件，哪些兼容与恢复限制会击穿价值？](#detail-section-13)
  - [Q04 · 全周期投入与效果支持怎样的试用判断？](#detail-section-14)
  - [Q05 · 怎样检验可读性与兼容性，是否值得增加基于任务的主题回归？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向喜欢鲸鱼娘女仆风格且符合素材使用条件的个人 DSH Web 用户，提供可切换的主题与阅读交互；合格结果须保留输入、阅读和会话切换。

默认界面已经完成模型任务；手写 CSS 加图片可实现基本装饰。本包把多处视觉与交互接线组合到同一生命周期，未证明相对默认界面提高任务效率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 亮暗主题及双角色装饰 | 定制聊天区与侧栏外观 | 依赖宿主 DOM 与完整美术资源，舒适度未测 |
| 输入展示选项 | 配置空态收起及滚动显隐 | 需核查所用宿主下输入可找回 |
| 溢出宽表格展开 | 在独立叠层阅读克隆内容 | 按实际几何判断，不改变原表格子树 |
| 网页图标与 manifest 替换 | 提供主题图标 | 退出有恢复逻辑，系统固定图标可能需另操作 |
| 启动错误页装饰 | 保留现有错误诊断并加主题 | 仅在皮肤已执行且识别到失败报告时生效 |
| 同源素材服务 | 提供随包图片与缓存 | GET/HEAD、哈希白名单，不提供任意文件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web 布局与包声明版本 | 展示必需 | 提供插件加载与目标 DOM；声明 >=0.2.0-rc.2 <0.3.0-0 | 不承诺其他布局适配，退回默认界面 |
| Cordis ^4.0.1 与 webServer | 声明/图片服务必需 | 生命周期和同源资源路由 | 图片无法按该路径提供，需先排查加载 |
| 完整 lib、assets/runtime、skin.build.json | 必需 | 客户端、服务端和哈希素材一致交付 | 只替换客户端可能缺图 |
| 皮肤管理器 | 推荐切换入口 | 管理选择与个性化选项 | 本报告不保证缺少管理器时全部配置流程 |
| standalone 与 dsh-web 发行互斥 | 必需条件 | 避免不同组件/样式契约叠装 | 已有 dsh-web 应使用适配版 |
| 作者声明的美术使用条件 | 使用前核对 | 非商业等素材条件 | 不能确认时选择默认界面 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对发行、版本与素材条件，保存默认界面退路 | 不叠装不兼容发行 |
| 加载 | 按 README 安装管理器及皮肤，首次重启后选择主题 | 图片、侧栏和聊天区正常出现；缺图先检查完整产物 |
| 使用 | 用户检查输入、阅读、表格与设置弹窗 | 原任务仍可完成，不能只看截图 |
| 退出 | 停用皮肤切回默认，检查原图标和控件 | 有残留则保持停用并重新加载默认界面 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包与图片下载、浏览器缓存；金额和资源量未知 | 核对发行/许可、安装、重启与检查；耗时未知 | 未测实际安装 |
| 持续使用 | DOM/尺寸观察、图片绘制；CPU/内存未知 | 升级宿主后复查控件；频率和耗时未知 | 不能把无模型调用当总成本为零 |
| 失败恢复 | 停用及重新加载的资源开销未知 | 检查输入/图标/样式残留，必要时恢复默认；耗时未知 | 清理源码存在，真实结果未知 |
| 升级与退出 | 完整两端产物和图片需保持一致 | Web App 图标可能另需重新固定 | 不保证替换单文件可升级 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 角色主题与同源素材 | 客户端挂载和包内白名单路由存在 | 舒适度、实际加载和资源开销 |
| 溢出表格阅读 | 实际几何判断、克隆预览及关闭接线 | 真实浏览器可读性与键盘任务表现 |
| 停用恢复 | 观察器、节点、标题和图标有释放/恢复逻辑 | 并发修改及真实宿主残留 |
| 工作效率 | 未取得同条件任务结果 | 不支持节时、成功率或单位成本估算 |

> **思考**：[Q03](#research-q03) 皮肤依赖宿主类名及状态结构，还改变输入框显隐和宽表格交互；版本声明不能保证控件可读可用。源码有具体释放路径，但跨版本适配、并发修改与实际停用结果尚未验证，不能把装饰范围小当作零干扰。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 支持的增量是可统一启停的主题组合，包括聊天区场景、图标恢复与按溢出触发展开表格，减少个人逐处拼接样式的接线。宿主加载、共享图片服务和衍生美术各有原归属，不计为本包首创或模型能力。

[Q02](#research-q02)、[Q03](#research-q03) 可借鉴公开静态素材白名单、DOM 修改归属和释放器，以及不移动原表格子树的克隆预览。移植仍需重核宿主选择器和美术权限；源码注释中的性能数据属于作者说明，不作本次实测。inventory 排除 build 下两项，包含 lib 和 src，统计可能重复打包产物，不从行数推原创或工时。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 皮肤依赖宿主类名及状态结构，还改变输入框显隐和宽表格交互；版本声明不能保证控件可读可用。源码有具体释放路径，但跨版本适配、并发修改与实际停用结果尚未验证，不能把装饰范围小当作零干扰。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 有明确视觉偏好的个人用户可在单主题配置试用。先用含代码、宽表格和设置弹窗的对话确认阅读、输入、会话切换与停用恢复；一旦遮挡、输入难找或滚动明显变差，停用并切回默认界面。需要商业使用素材或要求已验证兼容范围时先保持默认。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持主题、公开图片服务及释放机制存在；视觉舒适度、任务效果和真实宿主退出可靠性没有运行证据。任务回归是假设，尚未验证。

- 已检查：作者 README、包清单、源码路径 maid-atelier/README.md、maid-atelier/package.json、maid-atelier/cordis.patch.yml、maid-atelier/lib/index.js、maid-atelier/lib/client.js、maid-atelier/src/index.ts、shared/skin-assets.ts、maid-atelier/src/client/index.ts、maid-atelier/src/client/boot-error.ts、maid-atelier/src/client/customization.ts、maid-atelier/src/client/page-icons.ts、maid-atelier/src/client/table-card.ts、maid-atelier/tests/table-card.spec.ts 及固定范围 inventory；组件：maid-atelier。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 maid-atelier 子包及直接引用的共享图片服务；读取源文件与固定构建入口，抽查关键失败和释放路径，不是全仓安全审计。未安装或执行目标、未运行作者测试、未验证 npm 包与固定提交对应。
- 下一步：按 [Q05](#research-q05) 在隔离宿主用默认/主题对照检查阅读、输入、宽表格、弹窗和停用；记录漏检、任务结果及维护投入，无额外收益则放弃新增任务回归。

**分析版本**

- **仓库**：[Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale)
- **版本号**：0.1.9（[固定提交 7029aaa](https://github.com/Small-tailqwq/dsh-deep-whale/tree/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 值得检验的未验证假设是把真实宿主上的阅读、输入和停用结果绑定到皮肤发版。已有模块测试覆盖表格展开与清理，新增检查应衡量真实 DOM/排版失配的漏检与维护时间，而非重复节点断言；若没有净改善就停止扩展。

按 [Q05](#research-q05) 在隔离宿主用默认/主题对照检查阅读、输入、宽表格、弹窗和停用；记录漏检、任务结果及维护投入，无额外收益则放弃新增任务回归。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 89 | — | — | 1678 |
| .js | source | 2 | 3464 | 3108 | 417 | — |
| .ts | source | 27 | 3807 | 2993 | 529 | — |
| .ts | test | 12 | 5933 | 4911 | 477 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 22](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=22&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 32](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=32&color=737b86&logo=github)](https://github.com/Small-tailqwq/dsh-deep-whale/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在不损害阅读和输入的前提下，女仆工坊是否值得有明确视觉偏好的个人用户承担主题维护负担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要女仆工坊，相对默认界面和手写 CSS 增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向认可角色美术、在 DSH Web 中长期聊天且符合素材使用条件的个人用户，本包交付的是一套可切换的主题与阅读交互。合格结果应同时满足喜欢视觉风格、文字可读、输入和会话切换仍可完成。源码不能证明这类偏好有多普遍，也不能把美观解释为工作效率提高。默认界面已承担模型任务，继续使用默认界面是不需要额外主题维护的直接替代；手写 CSS 加图片也能完成基本装饰。

本包的具体增量在于把亮暗场景、聊天区内的双角色、图标替换及宽表格展开打包为同一生命周期，而不要求使用者逐项拼接样式。表格模块保留原渲染节点，只给溢出表格加入口，再复制内容到放大层。它超出纯换色，但这仍是交互包装与视觉组合，不是新的模型能力或任务交付流程。README 明确构建预设来源，本次不将插件加载、框架 effect 或既有美术归为本包原创。

反例是只需稳定输入、已有满意默认主题或需要商业使用素材的人群，装饰可能没有足以抵偿兼容维护的价值。因而当前贡献判断限定为明确偏好人群的集成便利，不支持普遍提效或生态首创。

#### 证据与依据

**依据 1 · 作者声明**：[maid-atelier/README.md:3-12](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/README.md#L3-L12)

作者描述主题目标和聊天区装饰；功能目标不是用户收益实测。

<details>
<summary>查看原文（10行）</summary>

```text
DeepSeek Harness Web GUI 的深海女仆工坊皮肤：两位鲸鱼娘女仆、深海蓝蕾丝与 Q 版侧栏，把 DSH 布置成女仆工坊。纯展示层客户端插件——`apply()` 设置 `data-dsh-maid-atelier` 作用域、按亮/暗主题切换宫殿背景、以独立透明层挂载双女仆角色、装饰可折叠侧栏,并为加载/思考/工具运行状态预留稳定动画钩子。effect 销毁器还原全部 CSS/DOM 写入;不注入服务、不发出 Cordis 事件、不触达模型请求。

## 特性

- 双女仆工坊场景对话背景(亮/暗自动切换)
- 深海蓝、陶瓷白、长春花蓝、柔金构成的可热切换 UI 覆盖层
- Q 版侧栏角色与视口装饰、favicon
- 启动插件加载失败时，默认以左右独立的双女仆立绘装饰原生错误报告，支持窄屏重排，遵循现有立绘显示与时段设置。此效果依赖皮肤已成功执行；皮肤自身或内核尚未加载时保留原生页面。
- 双女仆与宫殿背景整层挂在**对话区(centerCol)内部**:随聊天区域尺寸自适应(右/下工作台推开聊天区时背景与女仆同步收缩,不再固定于视口),左女仆贴聊天区左下、右女仆贴右下,均位于聊天记录与输入器之下;聊天态与着陆页按比例切换构图
- 图片素材随包分发，由皮肤自己的同源路由提供(不内嵌进 client bundle),激活不依赖任何远程 URL 或外部资源服务器
```

</details>

**依据 2 · 作者声明**：[maid-atelier/README.md:36-48](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/README.md#L36-L48)

作者列出素材限制、署名链和构建预设来源，不把衍生素材及基础构建归成本包原创。

<details>
<summary>查看原文（13行）</summary>

```text
本皮肤代码采用 **MIT**；全部美术资源（包括 AI 生成及加工的图片）**禁止商业性使用**，保留相应权利人的版权及既有 **CC BY-NC-SA 4.0** 授权（署名、非商业、相同方式共享）。随包分发的图片同样遵守美术许可。

皮肤素材为衍生创作,署名链(详见 `NOTICE`):

1. **一创 上善**（[Pixiv](https://www.pixiv.net/users/62155430) · [Bilibili：上善无形](https://b23.tv/8h5L4xz)）—— 鲸鱼娘角色形象原作者
2. **二创 ZipZipPipe**（[Pixiv](https://www.pixiv.net/users/18604994) · [Bilibili：ZipZipPipe](https://b23.tv/Pnw6nG8)）—— 在其形象上加入 DeepSeek 元素的女仆鲸鱼娘二次设计(生成模型 GPT Image 2)
3. **三创(本皮肤)Small-tailqwq** —— DeepSeek 元素再设计

许可范围与 MIT 正文见 [LICENSE](LICENSE)，美术许可正文见 [LICENSE-ARTWORK](LICENSE-ARTWORK)，署名链见 [NOTICE](NOTICE)。

## 开发与构建

构建预设源自 [zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui)(作者:Solitude)，当前皮肤在本仓库维护。在本皮肤目录执行：
```

</details>

**依据 3 · 源码核查**：[maid-atelier/src/client/table-card.ts:378-389](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/src/client/table-card.ts#L378-L389)

宽表格按实际溢出激活，说明存在具体阅读交互而非只换颜色。

<details>
<summary>查看原文（12行）</summary>

```text
  const reconcile = (wrapper: HTMLElement): void => {
    if (!wrapper.isConnected) {
      untrack(wrapper)
      return
    }
    const candidate = candidates.get(wrapper)
    if (candidate === undefined) return
    if (candidate.availableWidth > 0 && candidate.naturalWidth > candidate.availableWidth + 1) {
      activate(wrapper)
    } else {
      deactivate(wrapper)
    }
```

</details>

#### 缺口

- 缺少独立用户偏好与同任务结果对照
  **影响**：不能判断视觉定制的普遍必要性或节时效果
  **进一步探讨**：对明确偏好用户比较默认界面与主题的阅读正确率、输入完成和主观舒适度，保留不喜欢者的结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 主题与图片如何加载，用户能看到哪些行为？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

这是 DSH 原生插件形态的子包，package 同时声明 bundle patch、客户端入口及 Web 布局依赖，patch 将 ui-skin-maid-atelier 插入插件清单。包根入口也不是空壳，它为图片注册同源资源路由；客户端入口在 apply 中设置 body 作用域并装入装饰、定制、错误页、输入展示和表格处理模块。所查已发布构建文件 lib/index.js 仍能看到注册调用，客户端 lib/client.js 的 apply 也包含对应接线。这里核实的是固定仓库内的产物，不表示 npm 当前包与该提交已建立对应关系。

图片服务只接受 GET 和 HEAD，路径必须属于随包 manifest 的白名单且匹配哈希文件名，缺失文件返回 404，其他磁盘异常继续抛出。响应带长期不可变缓存和 ETag，条件请求可回 304；这能避免向任意磁盘路径取图片，但并非为私密资料设计的权限路由，源码明确资源是公开美术。资源来自本包，不需外部图片服务器持续在线；首次安装和未缓存资源仍有下载与浏览器资源开销。

客户端给聊天区和侧栏挂装饰，并用 DOM/尺寸观察器追踪宿主结构。宽表格只在自然宽度超过可用宽度时激活按钮；点击时创建原表格的克隆用于放大预览，关闭或停用释放叠层与绑定。图标模块保存原 icon/manifest 节点位置，最后一个使用者释放时恢复。启动错误页模块只匹配已经存在的 Failed to load plugins 报告并加属性，它不恢复插件加载；皮肤本身没有执行时也不能装饰错误页。

可借鉴的是清楚划分公开静态图片和客户端装饰的归属，并给 DOM 修改配套释放器。白名单机制继承于仓库共享模块，本包负责调用与素材清单；不能把共享能力重复计算为本子包独创。

#### 证据与依据

**依据 1 · 源码核查**：[maid-atelier/package.json:7-22](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/package.json#L7-L22)

声明双端入口、bundle 和 Web 平台依赖。

<details>
<summary>查看原文（16行）</summary>

```text
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./skin.json": "./skin.json",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": ["@deepseek-ai/dsh-client-ui-layout"],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[maid-atelier/cordis.patch.yml:1-7](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/cordis.patch.yml#L1-L7)

实际将皮肤 ID 插入客户端插件清单。

```text
# maid-atelier skin bundle patch: inserts its public dsh.client entry into the web plugin roster.
# The bundle is the official dsh plugin shape — install it with
# `dsh plugin --profile <name> add <path-or-git-url>`; mutual exclusion between
# skins is managed by scripts/dsh-skin (home-layer disabled rows).
- insert:
    - id: ui-skin-maid-atelier
      name: '@smalltailqwq/dsh-client-ui-skin-maid-atelier'
```

**依据 3 · 源码核查**：[maid-atelier/lib/index.js:4-48](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/lib/index.js#L4-L48)

分发入口内实际包含同源资源处理、方法与路径白名单、缓存及失败分支。

<details>
<summary>查看原文（45行）</summary>

```text
function installSkinAssets(ctx, id, directory, files) {
	const prefix = `/skin-assets/${id}`;
	const allowed = new Set(files);
	ctx.inject(["webServer"], (webCtx) => {
		const server = webCtx.get("webServer");
		webCtx.effect(() => server.register({
			kind: "prefix",
			path: prefix,
			handler: async (req, res) => {
				if (req.method !== "GET" && req.method !== "HEAD") {
					res.writeHead(405, { Allow: "GET, HEAD" }).end();
					return;
				}
				const pathname = new URL(req.url ?? "/", "http://localhost").pathname;
				const file = pathname.slice(prefix.length + 1);
				if (!pathname.startsWith(`${prefix}/`) || !allowed.has(file) || !/^[a-f0-9]{64}\.(png|webp)$/.test(file)) {
					res.writeHead(404).end();
					return;
				}
				let bytes;
				try {
					bytes = await readFile(new URL(file, directory));
				} catch (error) {
					if (error.code !== "ENOENT") throw error;
					res.writeHead(404).end();
					return;
				}
				const etag = `"${file.split(".")[0]}"`;
				const headers = {
					"Content-Type": file.endsWith(".webp") ? "image/webp" : "image/png",
					"Cache-Control": "public, max-age=31536000, immutable",
					"X-Content-Type-Options": "nosniff",
					ETag: etag
				};
				if (req.headers["if-none-match"]?.split(",").some((value) => value.trim().replace(/^W\//, "") === etag || value.trim() === "*")) {
					res.writeHead(304, headers).end();
					return;
				}
				res.writeHead(200, {
					...headers,
					"Content-Length": bytes.length
				});
				res.end(req.method === "HEAD" ? void 0 : bytes);
			}
		}), `${id}: packaged artwork`);
```

</details>

**依据 4 · 源码核查**：[maid-atelier/lib/index.js:85-91](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/lib/index.js#L85-L91)

固定构建文件中 apply 调用了资源安装。

```text
//#region src/index.ts
/** Serve only this package's immutable presentation assets while the skin is enabled. */
function apply(ctx) {
	installSkinAssets(ctx, "maid-atelier", new URL("../assets/runtime/", import.meta.url), manifest_default);
}
//#endregion
export { apply };
```

**依据 5 · 源码核查**：[maid-atelier/src/client/index.ts:508-516](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/src/client/index.ts#L508-L516)

客户端实际安装状态、定制和错误页模块。

```text
export function apply(ctx: PanelContext): void {
  const body = document.body
  installPanelPageState(ctx, body, 'data-maid-panel-page')
  installMaidRelationalMarkers(ctx)
  ctx.effect(() => installMaidCustomization(), 'ui-skin-maid-atelier: customization declaration')
  // The loader claims untagged <style> tags for whichever plugin loads last and
  // sweeps them when it unloads; hand other plugins' tags back before that.
  ctx.effect(() => () => releaseClaimedStyles(), 'ui-skin-maid-atelier: release styles claimed by the loader')
  ctx.effect(() => installMaidBootError(), 'ui-skin-maid-atelier: boot failure presentation')
```

**依据 6 · 源码核查**：[maid-atelier/src/client/index.ts:637-647](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/src/client/index.ts#L637-L647)

作用域启用并装入输入展示、导航、移动端和表格处理。

<details>
<summary>查看原文（11行）</summary>

```text
  body.dataset.dshMaidAtelier = ''
  // Composer presentation modes (skin setting 「输入框显示方式」):
  // capsule collapses the empty unfocused card, scroll fades it on scroll-up.
  ctx.effect(() => installMaidComposerDismiss(body), 'ui-skin-maid-atelier: composer stats dismissal')
  const disposeMaidComposerCapsule = installMaidComposerCapsule(body)
  const disposeMaidComposerScroll = installMaidComposerScroll(body)
  const settingsNavigation = createMaidSettingsNavigation(body)
  ctx.effect(() => settingsNavigation.dispose, 'ui-skin-maid-atelier: settings navigation hint')
  ctx.effect(() => installMaidMobileDrawerAutoClose(body), 'ui-skin-maid-atelier: mobile drawer auto-close')
  ctx.effect(() => installMaidMobileViewport(body), 'ui-skin-maid-atelier: phone viewport')
  disposeMaidTableCards = installMaidTableCards(ctx).dispose
```

</details>

**依据 7 · 源码核查**：[maid-atelier/src/client/table-card.ts:292-321](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/src/client/table-card.ts#L292-L321)

点击后的表格复制和叠层事件接线。

<details>
<summary>查看原文（30行）</summary>

```text
    const clone = wrapper.cloneNode(true) as HTMLElement
    clone.removeAttribute(FRAME_ATTRIBUTE)
    clone.removeAttribute(EXPANDABLE_ATTRIBUTE)
    clone.removeAttribute(OPEN_ATTRIBUTE)
    clone.removeAttribute(SCROLL_SUPPRESSED_ATTRIBUTE)
    clone.removeAttribute('tabindex')
    clone.removeAttribute('aria-label')
    clone.querySelector(`[${CONTROL_ATTRIBUTE}]`)?.remove()
    clone.dataset.maidTableExpanded = ''
    scroller.append(clone)
    panel.append(close, scroller)
    root.append(backdrop, panel)

    const onClick = (event: MouseEvent): void => {
      const target = event.target
      if (target instanceof Element
        && (target.closest('[data-maid-table-close]') !== null || target.hasAttribute('data-maid-table-backdrop'))) {
        closeOverlay()
      }
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') closeOverlay()
    }

    root.addEventListener('click', onClick)
    document.addEventListener('keydown', onKeyDown)
    document.body.append(root)
    setLeasedAttribute(wrapper, OPEN_ATTRIBUTE, owner, true)
    overlay = { root, source: wrapper, onClick, onKeyDown }
    close.focus({ preventScroll: true })
```

</details>

**依据 8 · 源码核查**：[maid-atelier/src/client/table-card.ts:414-425](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/src/client/table-card.ts#L414-L425)

表格模块释放叠层、观察器和候选绑定。

<details>
<summary>查看原文（12行）</summary>

```text
  const runtime: TableCardRuntime = {
    dispose(): void {
      closeOverlay(true)
      removeClosingOverlays()
      observer?.disconnect()
      resizeObserver?.disconnect()
      for (const wrapper of [...candidates.keys()]) untrack(wrapper)
      resizeTargets.clear()
      resizeObserver = undefined
      bindings.clear()
      candidates.clear()
    },
```

</details>

**依据 9 · 源码核查**：[maid-atelier/src/client/page-icons.ts:29-46](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/src/client/page-icons.ts#L29-L46)

保存并暂移除宿主 icon/manifest，退出有原位恢复逻辑。

<details>
<summary>查看原文（18行）</summary>

```text
function mountPageIcons(doc: Document): () => void {
  const replaced: Array<{ node: HTMLLinkElement; anchor: Comment }> = []
  const owned: HTMLLinkElement[] = []
  const restore = (): void => {
    for (const node of owned) node.remove()
    for (const { node, anchor } of replaced) {
      if (anchor.parentNode !== null && !node.isConnected) anchor.replaceWith(node)
      else anchor.remove()
    }
  }

  try {
    // Preserve exact positions and attributes, including adjacent host links.
    for (const node of doc.head.querySelectorAll<HTMLLinkElement>('link[rel~="icon"], link[rel="manifest"]')) {
      const anchor = doc.createComment('maid-atelier: host icon')
      replaced.push({ node, anchor })
      node.before(anchor)
      node.remove()
```

</details>

**依据 10 · 源码核查**：[maid-atelier/src/client/boot-error.ts:27-47](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/src/client/boot-error.ts#L27-L47)

仅识别现有失败报告后装饰，不是故障修复器。

<details>
<summary>查看原文（21行）</summary>

```text
  const synchronize = (): void => {
    const failed = new Set<Element>()
    for (const boot of document.querySelectorAll(BOOT_SELECTOR)) {
      // rc1 exposes a boot owner but no failure-state attribute. Match the
      // kernel's exact report heading; unknown markup keeps the native page.
      const hasReport = [...boot.querySelectorAll('div')].some(element =>
        element.childElementCount === 0 && element.textContent === 'Failed to load plugins',
      )
      if (!hasReport) continue
      failed.add(boot)
      if (owned.has(boot)) continue
      let lease = leases.get(boot)
      if (!lease) {
        lease = { original: boot.getAttribute(ERROR_ATTRIBUTE), owners: new Set() }
        leases.set(boot, lease)
      }
      lease.owners.add(owner)
      owned.add(boot)
      boot.setAttribute(ERROR_ATTRIBUTE, '')
    }
    for (const element of owned) if (!failed.has(element)) release(element)
```

</details>

**依据 11 · 源码核查**：[maid-atelier/lib/client.js:2949-2955](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/lib/client.js#L2949-L2955)

固定构建客户端的 apply 仍调用定制与错误页模块。

```text
		function apply(ctx) {
			const body = document.body;
			installPanelPageState(ctx, body, "data-maid-panel-page");
			installMaidRelationalMarkers(ctx);
			ctx.effect(() => installMaidCustomization(), "ui-skin-maid-atelier: customization declaration");
			ctx.effect(() => () => releaseClaimedStyles(), "ui-skin-maid-atelier: release styles claimed by the loader");
			ctx.effect(() => installMaidBootError(), "ui-skin-maid-atelier: boot failure presentation");
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启用与退出要满足什么条件，哪些兼容与恢复限制会击穿价值？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

安装条件应分为包声明和实际界面条件。peer 声明 Cordis ^4.0.1、DSH >=0.2.0-rc.2 <0.3.0-0，DSH 被标为可选 peer 不等于本插件脱离 DSH Web 布局也有用。README 推荐管理器加皮肤后首次重启，随后通过皮肤管理切换；管理器提供切换面板，客户端布局注入和后端 webServer 才是本包展示及图片路径的关键条件。现有 dsh-web 用户被明确要求安装其适配版，不能在同一 profile 叠装 standalone 发行。

最大的限制是外观层也接管具体交互和宿主 DOM。主入口依赖 sidebarCol、centerCol 等类名片段以及 data-phase、settings portal 标记；可配置的输入框收起和滚动显隐进一步影响找输入框的行为。宿主结构变化时，版本范围并不能证明这些选择器仍找到正确元素。源码已为设置面板的 slot/portal 两种布局分支提供兼容，这是支持而非缺陷；但没有证明所有声明版本和其他主题组合均可用。不能只因皮肤不调用模型就认定它不会影响任务。

停用逻辑明确断开观察器、取消定时器与动画帧、移除自有节点，并还原保存的样式、投影状态和标题。图标模块另有引用计数恢复，定制属性写入器还会检查是否仍是自己写入的值再释放。这些机制使回默认主题成为有源码依据的退路。不过主入口有部分属性直接删除、部分样式按启用前快照恢复；与其他并发修改者的全部交互未被本次证明，不能将 README 的“全部还原”直接当作宿主验收结果。对用户的停止判据应是输入、表格、弹窗或会话入口受遮挡，以及停用后仍有明显残留，而不是等待模型任务报错。

素材方面只记录作者在 README 声明的非商业等使用条件，不作许可效力的独立法律判定。需要商业使用或无法确认素材授权适用时，选择默认界面更明确。

#### 证据与依据

**依据 1 · 源码核查**：[maid-atelier/package.json:42-49](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/package.json#L42-L49)

版本范围与 optional peer 只是声明，不能替代宿主兼容证据。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh": ">=0.2.0-rc.2 <0.3.0-0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh": {
      "optional": true
    }
```

**依据 2 · 作者声明**：[maid-atelier/README.md:16-26](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/README.md#L16-L26)

发行互斥、管理器安装、重启及切换步骤。

<details>
<summary>查看原文（11行）</summary>

````text
> 若已安装 `@linxin666/dsh-web-all`（dsh-web），请从 dsh-web 自带的皮肤中心/安装入口安装其适配版 `maid-atelier` 与 `orca-link`，不要执行下面的 standalone 安装命令。两种发行方式的组件与样式契约不同，不能在同一 profile 中叠装。

推荐连同皮肤管理器一起，从 npm 安装稳定版：

```sh
dsh plugin --profile web add '@smalltailqwq/dsh-client-ui-skin-deep-whale-manager' && dsh plugin --profile web add '@smalltailqwq/dsh-client-ui-skin-maid-atelier'
```

PowerShell 版本见仓库 README。未指定 dist-tag 时 npm 使用 `latest`。首次安装后重启一次 DSH，然后在“设置 → 皮肤管理”中选择“深海女仆工坊”；之后切换走配置热重载。独立子包 link 仅用于本地开发。

加载即生效、卸载即复原(与皮肤中心/dsh-skin 的互斥切换兼容,`wiring.id` 为 `ui-skin-maid-atelier`)。
````

</details>

**依据 3 · 源码核查**：[maid-atelier/src/client/index.ts:63-74](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/src/client/index.ts#L63-L74)

宿主 DOM 类名片段与两种设置面板选择器构成耦合边界。

<details>
<summary>查看原文（12行）</summary>

```text
const SIDEBAR_COLUMN_SELECTOR = "[class*='sidebarCol']"
const CONVERSATION_COLUMN_SELECTOR = "[class*='centerCol']"
const SETTINGS_MASK_SELECTOR = ":scope > [class*='mask']"
// Through DSH 0.1.7-rc.1 the panel mounts inside the settings slot; from rc.2 it
// portals to <body> beside #root and names itself with `data-shortcut-modal`.
const SETTINGS_PORTAL_DIALOG_SELECTOR = "[role='dialog'][aria-modal='true'][data-shortcut-modal='settings']"
const SETTINGS_SLOT_DIALOG_SELECTOR = "[data-slot='sidebar.settings'] [role='dialog'][aria-modal='true']"
const SETTINGS_DIALOG_SELECTOR = `${SETTINGS_SLOT_DIALOG_SELECTOR}, ${SETTINGS_PORTAL_DIALOG_SELECTOR}`
const SETTINGS_OWNER_SELECTOR = `[data-slot='sidebar.settings'], ${SETTINGS_PORTAL_DIALOG_SELECTOR}`
const ACTIVE_CONVERSATION_SELECTOR = "[data-phase='active']"
const WORKSPACE_SELECTOR = "header [role='tablist']"
const CORDIS_PANEL_SELECTOR = '[data-cordis-panel]'
```

</details>

**依据 4 · 源码核查**：[maid-atelier/src/client/index.ts:556-607](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/src/client/index.ts#L556-L607)

停用清理计时器、观察器、自有节点和保存状态，但不能据函数存在宣称实际无残留。

<details>
<summary>查看原文（52行）</summary>

```text
  ctx.effect(() => () => {
    delete body.dataset.dshMaidAtelier
    delete body.dataset.maidComposerMotion
    delete body.dataset.maidSidebarCompact
    delete body.dataset.maidSidebarSize
    for (const [attribute, value] of previousProjectedStates) {
      if (value === null) body.removeAttribute(attribute)
      else body.setAttribute(attribute, value)
    }
    disposeMaidComposerCapsule()
    disposeMaidComposerScroll()
    disposeMaidTableCards()
    if (composerMotionTimer !== undefined) clearTimeout(composerMotionTimer)
    if (viewportResizeTimer !== undefined) clearTimeout(viewportResizeTimer)
    if (handleViewportResize !== undefined) window.removeEventListener('resize', handleViewportResize)
    layoutResizeLease.release()
    lowPowerLease.release()
    foreignShellLease.release()
    if (railSearchFocusFrame !== undefined) cancelAnimationFrame(railSearchFocusFrame)
    if (recoverRailSearchFocus !== undefined) {
      document.removeEventListener('click', recoverRailSearchFocus)
    }
    observer?.disconnect()
    clearSidebarCarriers()
    taggedSettingsOverlay?.removeAttribute(SETTINGS_OVERLAY_ATTRIBUTE)
    taggedSettingsOverlay = null
    themeColorObserver?.disconnect()
    if (titlebarOverlay !== undefined && syncTitlebarHeight !== undefined) {
      titlebarOverlay.removeEventListener('geometrychange', syncTitlebarHeight)
    }
    if (titlebarSyncFrame !== undefined) cancelAnimationFrame(titlebarSyncFrame)
    titlebarSyncFrame = undefined
    resizeObserver?.disconnect()
    for (const [property, value] of previous) {
      body.style.setProperty(property, value)
    }
    ownedNodes.forEach(element => element.remove())
    decoratedElements.forEach((element) => {
      delete element.dataset.maidSidebarFooter
      delete element.dataset.maidWorkspaceGroup
      delete element.dataset.maidWorkspaceRow
      delete element.dataset.maidWorkspaceActive
      delete element.dataset.maidSessionRow
      delete element.dataset.maidSessionFlat
      delete element.dataset.maidSessionFirst
      delete element.dataset.maidSessionLast
    })
    if (themeColorMeta?.isConnected && themeColorMeta.content === SKIN_SYSTEM_CHROME_COLOR) {
      themeColorMeta.content = previousThemeColor ?? ''
    }
    if (document.title === SKIN_TITLE) document.title = originalTitle
  }, 'ui-skin-maid-atelier: layered background and ornament')
```

</details>

**依据 5 · 源码核查**：[maid-atelier/src/client/customization.ts:29-57](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/src/client/customization.ts#L29-L57)

定制样式 projector 只在仍持有写入值时恢复，支持所有权控制的工程判断。

<details>
<summary>查看原文（29行）</summary>

```text
/** Restore the original inline value and priority only while this writer owns it. */
class SkinPropertyProjector {
  private readonly originals = new Map<string, { value: string, priority: string }>()
  private readonly owned = new Map<string, string>()

  constructor(private readonly root: HTMLElement = document.documentElement) {}

  set(name: string, value: string): void {
    if (!this.originals.has(name)) {
      this.originals.set(name, {
        value: this.root.style.getPropertyValue(name),
        priority: this.root.style.getPropertyPriority(name),
      })
    }
    this.root.style.setProperty(name, value)
    this.owned.set(name, value)
  }

  release(): void {
    for (const [name, original] of this.originals) {
      if (this.root.style.getPropertyValue(name) === this.owned.get(name)
        && this.root.style.getPropertyPriority(name) === '') {
        if (original.value === '') this.root.style.removeProperty(name)
        else this.root.style.setProperty(name, original.value, original.priority)
      }
    }
    this.originals.clear()
    this.owned.clear()
  }
```

</details>

**依据 6 · 源码核查**：[maid-atelier/src/client/customization.ts:278-299](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/src/client/customization.ts#L278-L299)

可配置输入框收起/显隐，说明外观也改变具体交互。

<details>
<summary>查看原文（22行）</summary>

```text
      {
        key: 'composerMode',
        type: 'select',
        label: '输入框显示方式',
        labelEn: 'Composer visibility mode',
        description: '始终显示；空态胶囊在输入框为空且未聚焦时收起为简约胶囊；滚动显隐在正文末尾滚出视口后上滚隐去，下滚或末尾回到视口时渐现。',
        descriptionEn: 'Always visible; the idle capsule collapses while empty and unfocused; scroll mode hides on upward scroll after the transcript tail leaves the viewport, and reveals on downward scroll or when the tail returns.',
        defaultValue: 'persistent',
        options: [
          { value: 'persistent', label: '始终显示', labelEn: 'Always visible' },
          { value: 'capsule', label: '空态胶囊（点击展开）', labelEn: 'Idle capsule (click to expand)' },
          { value: 'scroll', label: '上滚隐去 · 下滚渐现', labelEn: 'Hide on scroll up · show on scroll down' },
        ],
      },
      {
        key: 'composerBottomOnly',
        type: 'boolean',
        label: '输入框只在底部显示',
        labelEn: 'Show the composer only at the conversation bottom',
        description: '最新正文末尾仍在视口内时保留输入框，末尾滚出视口后隐去，回到视口内再显现。开启后接管上面的「上滚隐去 · 下滚渐现」。',
        descriptionEn: 'Keep the composer while the transcript tail is within the viewport; hide after it leaves and reveal when it returns. Takes over the scroll mode above.',
        defaultValue: false,
```

</details>

**依据 7 · 作者声明**：[maid-atelier/README.md:34-44](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/README.md#L34-L44)

限定为作者说明的美术使用条件与署名来源。

<details>
<summary>查看原文（11行）</summary>

```text
## 素材来源与许可

本皮肤代码采用 **MIT**；全部美术资源（包括 AI 生成及加工的图片）**禁止商业性使用**，保留相应权利人的版权及既有 **CC BY-NC-SA 4.0** 授权（署名、非商业、相同方式共享）。随包分发的图片同样遵守美术许可。

皮肤素材为衍生创作,署名链(详见 `NOTICE`):

1. **一创 上善**（[Pixiv](https://www.pixiv.net/users/62155430) · [Bilibili：上善无形](https://b23.tv/8h5L4xz)）—— 鲸鱼娘角色形象原作者
2. **二创 ZipZipPipe**（[Pixiv](https://www.pixiv.net/users/18604994) · [Bilibili：ZipZipPipe](https://b23.tv/Pnw6nG8)）—— 在其形象上加入 DeepSeek 元素的女仆鲸鱼娘二次设计(生成模型 GPT Image 2)
3. **三创(本皮肤)Small-tailqwq** —— DeepSeek 元素再设计

许可范围与 MIT 正文见 [LICENSE](LICENSE)，美术许可正文见 [LICENSE-ARTWORK](LICENSE-ARTWORK)，署名链见 [NOTICE](NOTICE)。
```

</details>

#### 缺口

- 真实宿主不同布局与并发皮肤下的交互、退出结果未知
  **影响**：不能承诺所声明范围全兼容或停用绝无残留，限制建议为单主题小范围试用
  **进一步探讨**：在实际使用版本记录发送输入、会话切换、弹窗、表格与停用后默认界面，若失配就停止该版本使用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 全周期投入与效果支持怎样的试用判断？

**研究主题**：效果与总成本、采用判断

#### 完整回答

采用对象是有明确视觉偏好的个人用户，不是寻求模型增强或企业任务提效的人群。可在单皮肤 profile 试用，先确认发行方式、素材条件和现有宿主版本，再用一段含代码及宽表格的对话检查阅读、输入、切换会话、打开设置和关闭皮肤。合格结果是这些原任务仍可完成且本人喜欢视觉呈现；成功不意味着任务生产率提高。没有这些偏好或无法接受界面回归检查时，维持默认界面即可。

首次要取得皮肤与完整图片资源并可能安装管理器，README 说明要重启；源码显示持续使用有图片缓存、DOM 观察和叠层管理。现金支出没有实测记录，浏览器 CPU、内存、网络和人工配置时长也未知。失败后需要停用皮肤、恢复默认并检查残留；若换了宿主版本要再查关键交互，桌面 Web App 图标可能另需系统侧重新固定。不能从无需模型调用推断整个使用周期成本为零。

机制支持有条件试用而非持续安装承诺。若输入框难以找回、内容被遮挡、滚动明显卡顿、错误页无法读取或切回默认仍残留，应立即停用，必要时重新加载默认界面；不要把继续叠装其他主题当恢复办法。当前效果证据只到固定源码，舒适度、性能、退出可靠性和节时均未测，不能输出成功率或单位合格任务成本。

#### 证据与依据

**依据 1 · 作者声明**：[maid-atelier/README.md:16-30](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/README.md#L16-L30)

用户需选择正确发行、安装、重启并承担 Web App 图标更新的可能操作。

<details>
<summary>查看原文（15行）</summary>

````text
> 若已安装 `@linxin666/dsh-web-all`（dsh-web），请从 dsh-web 自带的皮肤中心/安装入口安装其适配版 `maid-atelier` 与 `orca-link`，不要执行下面的 standalone 安装命令。两种发行方式的组件与样式契约不同，不能在同一 profile 中叠装。

推荐连同皮肤管理器一起，从 npm 安装稳定版：

```sh
dsh plugin --profile web add '@smalltailqwq/dsh-client-ui-skin-deep-whale-manager' && dsh plugin --profile web add '@smalltailqwq/dsh-client-ui-skin-maid-atelier'
```

PowerShell 版本见仓库 README。未指定 dist-tag 时 npm 使用 `latest`。首次安装后重启一次 DSH，然后在“设置 → 皮肤管理”中选择“深海女仆工坊”；之后切换走配置热重载。独立子包 link 仅用于本地开发。

加载即生效、卸载即复原(与皮肤中心/dsh-skin 的互斥切换兼容,`wiring.id` 为 `ui-skin-maid-atelier`)。

## 网页与应用图标

标签页在每次加载皮肤模块时从三种表情中随机选择图标，本次加载内保持不变。安装为 Web App 时固定使用托腮图，任务栏图标由浏览器和系统据此生成；已安装或已固定的应用可能需要重新安装或固定才能更新。关闭女仆皮肤时恢复宿主的 favicon 和 manifest 声明。
````

</details>

**依据 2 · 作者声明**：[maid-atelier/README.md:55-55](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/README.md#L55-L55)

升级需同步两端代码、运行素材和构建指纹，不能只换客户端文件。

```text
PNG/WebP 以原字节随包分发，通过宿主同源资源路由加载。升级时需同步 `lib/`、`assets/runtime/` 与 `skin.build.json`；仅替换客户端文件会缺少图片服务。资源路径、缓存与素材更新方式见 [静态图片说明](../docs/asset-delivery.md)。
```

**依据 3 · 源码核查**：[maid-atelier/src/client/index.ts:1138-1157](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/src/client/index.ts#L1138-L1157)

持续观察器和主题启用状态为资源与回归负担提供依据，未量化其耗时。

<details>
<summary>查看原文（20行）</summary>

```text
  observer.observe(body, {
    attributes: true,
    attributeFilter: [
      'aria-expanded',
      'aria-selected',
      'data-cordis-panel',
      'data-ds-dark-theme',
      'data-phase',
      'data-slot',
      'role',
    ],
    childList: true,
    subtree: true,
  })

  syncSidebarCarriers()
  installMaidPageIcons(ctx)
  installMaidPlatformCaption(ctx, body)

  document.title = SKIN_TITLE
```

</details>

**依据 4 · 源码核查**：[maid-atelier/src/client/index.ts:556-607](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/src/client/index.ts#L556-L607)

停用回收路径为退路提供源码依据。

<details>
<summary>查看原文（52行）</summary>

```text
  ctx.effect(() => () => {
    delete body.dataset.dshMaidAtelier
    delete body.dataset.maidComposerMotion
    delete body.dataset.maidSidebarCompact
    delete body.dataset.maidSidebarSize
    for (const [attribute, value] of previousProjectedStates) {
      if (value === null) body.removeAttribute(attribute)
      else body.setAttribute(attribute, value)
    }
    disposeMaidComposerCapsule()
    disposeMaidComposerScroll()
    disposeMaidTableCards()
    if (composerMotionTimer !== undefined) clearTimeout(composerMotionTimer)
    if (viewportResizeTimer !== undefined) clearTimeout(viewportResizeTimer)
    if (handleViewportResize !== undefined) window.removeEventListener('resize', handleViewportResize)
    layoutResizeLease.release()
    lowPowerLease.release()
    foreignShellLease.release()
    if (railSearchFocusFrame !== undefined) cancelAnimationFrame(railSearchFocusFrame)
    if (recoverRailSearchFocus !== undefined) {
      document.removeEventListener('click', recoverRailSearchFocus)
    }
    observer?.disconnect()
    clearSidebarCarriers()
    taggedSettingsOverlay?.removeAttribute(SETTINGS_OVERLAY_ATTRIBUTE)
    taggedSettingsOverlay = null
    themeColorObserver?.disconnect()
    if (titlebarOverlay !== undefined && syncTitlebarHeight !== undefined) {
      titlebarOverlay.removeEventListener('geometrychange', syncTitlebarHeight)
    }
    if (titlebarSyncFrame !== undefined) cancelAnimationFrame(titlebarSyncFrame)
    titlebarSyncFrame = undefined
    resizeObserver?.disconnect()
    for (const [property, value] of previous) {
      body.style.setProperty(property, value)
    }
    ownedNodes.forEach(element => element.remove())
    decoratedElements.forEach((element) => {
      delete element.dataset.maidSidebarFooter
      delete element.dataset.maidWorkspaceGroup
      delete element.dataset.maidWorkspaceRow
      delete element.dataset.maidWorkspaceActive
      delete element.dataset.maidSessionRow
      delete element.dataset.maidSessionFlat
      delete element.dataset.maidSessionFirst
      delete element.dataset.maidSessionLast
    })
    if (themeColorMeta?.isConnected && themeColorMeta.content === SKIN_SYSTEM_CHROME_COLOR) {
      themeColorMeta.content = previousThemeColor ?? ''
    }
    if (document.title === SKIN_TITLE) document.title = originalTitle
  }, 'ui-skin-maid-atelier: layered background and ornament')
```

</details>

#### 缺口

- 没有同条件阅读/输入质量、全周期投入及长会话性能数据
  **影响**：不能估计收益、现金金额、节时或保证低负担
  **进一步探讨**：按同一段对话分别使用默认界面与主题，记录任务正确性、操作时间、资源占用、复核与恢复投入。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样检验可读性与兼容性，是否值得增加基于任务的主题回归？

**研究主题**：新假设与验证

#### 完整回答

有依据但未验证的假设是把主题兼容性检查绑定到具体宿主版本，并用真实阅读和输入任务的结果约束主题发版，而不只检查装饰节点是否存在。推导来自 Q03 中类名/状态耦合，以及 Q02 中宽表格接管与回收。这里不是宣称项目缺少测试。现有 table-card.spec.ts 在 jsdom 中构造几何属性和 ResizeObserver 替身，检查溢出展开、Escape 和 dispose；它已经覆盖模块生命周期，是支持当前工程设计的直接反证。它仍不能替代真实浏览器排版、实际宿主 DOM 和长会话资源状态。

相对继续添加静态选择器断言，新增的实验应以相同宿主版本、同一对话内容，在默认界面与主题间对照；覆盖亮暗、窄屏、长代码、宽表格、设置弹窗和启用后停用。让用户完成查找表格字段、发送输入及切换会话，记录正确率、完成时间、被遮挡控件和停用残留，并记录维护这些检查的时间。可以在隔离副本主动改变一个宿主选择器作为失配样本，比较当前模块测试与任务检查的漏检，不能向日常环境注入破坏。

若任务检查未发现额外可操作失配，或增加的维护投入超过避免的失败，假设不成立；若仅更改截图颜色而没有用户任务受损，不应把视觉差异计为失败。现阶段未执行该实验，也没有用户偏好样本，因此这是验证方向，不计为插件已经实现的贡献。

#### 证据与依据

**依据 1 · 源码核查**：[maid-atelier/tests/table-card.spec.ts:31-50](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/tests/table-card.spec.ts#L31-L50)

现有测试通过 stub 和手写几何构造溢出场景，不能称项目没有测试。

<details>
<summary>查看原文（20行）</summary>

```text
  it('marks overflowing tables as expandable and opens a cloned lightbox', async () => {
    let resize: ResizeObserverCallback | undefined
    vi.stubGlobal('ResizeObserver', class {
      constructor(callback: ResizeObserverCallback) {
        resize = callback
      }

      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    })

    const bubble = document.createElement('div')
    bubble.className = 'fixture_markdown'
    Object.defineProperty(bubble, 'clientWidth', { configurable: true, value: 680 })
    const card = document.createElement('div')
    card.className = 'md-table-wide'
    card.innerHTML = '<table><tbody><tr><td>wide</td></tr></tbody></table>'
    const table = card.querySelector('table')!
    Object.defineProperty(card, 'clientWidth', { configurable: true, value: 680 })
```

</details>

**依据 2 · 源码核查**：[maid-atelier/tests/table-card.spec.ts:108-145](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/tests/table-card.spec.ts#L108-L145)

现有测试明确检查 Escape 和释放后节点、定时器状态；实验增量需超出这些已覆盖行为。

<details>
<summary>查看原文（38行）</summary>

```text
  it('removes injected controls and overlays on dispose', () => {
    vi.useFakeTimers()
    try {
      vi.stubGlobal('ResizeObserver', class {
        constructor() {}
        observe(): void {}
        unobserve(): void {}
        disconnect(): void {}
      })

      const bubble = document.createElement('div')
      bubble.className = 'fixture_markdown'
      Object.defineProperty(bubble, 'clientWidth', { configurable: true, value: 680 })
      const card = document.createElement('div')
      card.className = 'md-table-wide'
      Object.defineProperty(card, 'clientWidth', { configurable: true, value: 680 })
      Object.defineProperty(card, 'scrollWidth', { configurable: true, value: 960 })
      bubble.append(card)
      document.body.append(bubble)

      const runtime = installMaidTableCards({} as never)
      card.querySelector<HTMLButtonElement>('[data-maid-table-expand]')?.click()
      expect(document.querySelector('[data-maid-table-lightbox]')).not.toBeNull()

      const timerBaseline = vi.getTimerCount()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      expect(document.querySelector('[data-maid-table-closing]')).not.toBeNull()
      expect(vi.getTimerCount()).toBe(timerBaseline + 1)

      runtime.dispose()
      expect(vi.getTimerCount()).toBe(timerBaseline)
      vi.runAllTimers()

      expect(card.hasAttribute('data-maid-table-frame')).toBe(false)
      expect(card.querySelector('[data-maid-table-expand]')).toBeNull()
      expect(card.hasAttribute('data-maid-table-expandable')).toBe(false)
      expect(card.hasAttribute('data-maid-table-open')).toBe(false)
      expect(document.querySelector('[data-maid-table-lightbox]')).toBeNull()
```

</details>

**依据 3 · 源码核查**：[maid-atelier/src/client/index.ts:63-74](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/src/client/index.ts#L63-L74)

宿主选择器耦合是绑定真实版本任务回归的推导依据。

<details>
<summary>查看原文（12行）</summary>

```text
const SIDEBAR_COLUMN_SELECTOR = "[class*='sidebarCol']"
const CONVERSATION_COLUMN_SELECTOR = "[class*='centerCol']"
const SETTINGS_MASK_SELECTOR = ":scope > [class*='mask']"
// Through DSH 0.1.7-rc.1 the panel mounts inside the settings slot; from rc.2 it
// portals to <body> beside #root and names itself with `data-shortcut-modal`.
const SETTINGS_PORTAL_DIALOG_SELECTOR = "[role='dialog'][aria-modal='true'][data-shortcut-modal='settings']"
const SETTINGS_SLOT_DIALOG_SELECTOR = "[data-slot='sidebar.settings'] [role='dialog'][aria-modal='true']"
const SETTINGS_DIALOG_SELECTOR = `${SETTINGS_SLOT_DIALOG_SELECTOR}, ${SETTINGS_PORTAL_DIALOG_SELECTOR}`
const SETTINGS_OWNER_SELECTOR = `[data-slot='sidebar.settings'], ${SETTINGS_PORTAL_DIALOG_SELECTOR}`
const ACTIVE_CONVERSATION_SELECTOR = "[data-phase='active']"
const WORKSPACE_SELECTOR = "header [role='tablist']"
const CORDIS_PANEL_SELECTOR = '[data-cordis-panel]'
```

</details>

**依据 4 · 源码核查**：[maid-atelier/src/client/table-card.ts:292-321](https://github.com/Small-tailqwq/dsh-deep-whale/blob/7029aaa25ed1ea35d355ef1d7cefe5e098f92ee1/maid-atelier/src/client/table-card.ts#L292-L321)

表格克隆与键盘关闭是任务验证需要覆盖的具体路径。

<details>
<summary>查看原文（30行）</summary>

```text
    const clone = wrapper.cloneNode(true) as HTMLElement
    clone.removeAttribute(FRAME_ATTRIBUTE)
    clone.removeAttribute(EXPANDABLE_ATTRIBUTE)
    clone.removeAttribute(OPEN_ATTRIBUTE)
    clone.removeAttribute(SCROLL_SUPPRESSED_ATTRIBUTE)
    clone.removeAttribute('tabindex')
    clone.removeAttribute('aria-label')
    clone.querySelector(`[${CONTROL_ATTRIBUTE}]`)?.remove()
    clone.dataset.maidTableExpanded = ''
    scroller.append(clone)
    panel.append(close, scroller)
    root.append(backdrop, panel)

    const onClick = (event: MouseEvent): void => {
      const target = event.target
      if (target instanceof Element
        && (target.closest('[data-maid-table-close]') !== null || target.hasAttribute('data-maid-table-backdrop'))) {
        closeOverlay()
      }
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') closeOverlay()
    }

    root.addEventListener('click', onClick)
    document.addEventListener('keydown', onKeyDown)
    document.body.append(root)
    setLeasedAttribute(wrapper, OPEN_ATTRIBUTE, owner, true)
    overlay = { root, source: wrapper, onClick, onKeyDown }
    close.focus({ preventScroll: true })
```

</details>

#### 缺口

- 尚无真实浏览器任务回归与现有模块测试的同条件比较
  **影响**：不能认定新增检查改善用户结果或值得维护
  **进一步探讨**：先对一个实际宿主版本及隔离失配副本比较漏检、用户任务错误和维护时间，无净改善则放弃。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
