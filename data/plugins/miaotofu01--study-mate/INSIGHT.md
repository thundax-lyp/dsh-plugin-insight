# StudyMate

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[d8114f3](https://github.com/Miaotofu01/Study-Mate/tree/d8114f38363272852b339d6788b2f8f007243b43)

<!-- BEGIN META -->
[![GitHub ★ 1,220](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C220&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Miaotofu01/Study-Mate) [![npm 30d 6,194](https://img.shields.io/static/v1?label=npm+30d&message=6%2C194&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yunmiao/studymate) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@yunmiao/studymate)
<!-- END META -->

> **功能**：在 DSH 中组织课程大纲、课件、练习和项目，持久保存学习进度并提供阅读端。

> **亮点**：把自由聊天改为文件化课程、阅读作答和跨会话进度，工具分域约束支撑协作；并不证明教学正确或比教材更有效。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：格式通过与进程退出不能代替学习掌握；实验路径guard非OS沙箱，不可信代码仍以宿主身份执行；现版不承诺旧平台支持。[Q03](#research-q03)

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
  - [Q01 · 数学计算机自学相对普通AI聊天多了什么交付？](#detail-section-11)
  - [Q02 · 预设、工具与学习数据怎样划分职责？](#detail-section-12)
  - [Q03 · 课件通过检查和实验退出成功是否代表学会且安全？](#detail-section-13)
  - [Q04 · 什么学习者可试用，首次和失败恢复投入是什么？](#detail-section-14)
  - [Q05 · 什么验证比课程路线图更能检验教育增量？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：数学计算机自学者按前置知识推进课程并保存练习；最终标准是独立迁移任务，不是课件生成量。[Q01](#research-q01)

普通AI聊天加教材/人工计划；新增课程文件与工具接线，但教育收益需延迟迁移任务对照。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 学习/答疑预设 | 课程与就地提问 | 匹配DSH及模型 |
| 阅读与工作区 | 保存课件作答进度 | 内容需教材复核 |
| 实验执行 | 获取真实进程输出 | 非OS沙箱，不运行不可信代码 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH声明0.1.7-alpha.1+与Node | 启动必需 | 原生预设和工具 | 核兼容，不承诺旧平台 |
| 可写学习工作区 | 必需 | 课件、进度和作答 | 备份再处理冲突 |
| 模型与资料来源 | 课程必需 | 生成和核查内容 | 保留原教材 |
| 隔离执行环境 | 不可信实验必需 | 限制任意代码副作用 | 本插件path guard不替代 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份工作区、选小科目 | 版本与目录明确 |
| 学习 | Agent出大纲课件，用户核教材 | 内容正确并能阅读 |
| 验收 | 用户独立做迁移题 | 不以进度色块代替掌握 |
| 退出 | 用户保留文件回手工计划 | 不可信实验不执行 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH、Node和工作区；金额未知 | 配置预设并核教材 | 配置耗时未知 |
| 持续使用 | 模型、资料与图片调用 | 查课件和评作答 | 学习收益未测 |
| 失败恢复 | 工作区备份与重生成 | 核冲突、恢复课件/进度 | 不运行不可信实验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨会话课程 | 独立文件和预设 | 学习掌握与留存 |
| 工具约束 | 预设作用域和域guard | 所有路径安全性 |
| 实验记录 | 无shell进程与事实结果 | OS隔离、教学效果 |

> **思考**：格式通过与进程退出不能代替学习掌握；实验路径guard非OS沙箱，不可信代码仍以宿主身份执行；现版不承诺旧平台支持。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把自由聊天改为文件化课程、阅读作答和跨会话进度，工具分域约束支撑协作；并不证明教学正确或比教材更有效。[Q01](#research-q01) [Q02](#research-q02)

host和预设作用域分离、访问写回调约束、资料版本与幂等设计可借鉴；移植要承担宿主API、格式和恢复验证，不把path guard当沙箱。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

格式通过与进程退出不能代替学习掌握；实验路径guard非OS沙箱，不可信代码仍以宿主身份执行；现版不承诺旧平台支持。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议已有DSH且能核教材的自学者限定一门小课试用，备份工作区并保留人工学习计划；发现内容错误或进度虚高则停自动推进，不跑不可信实验。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

预设接线、文件工作区及工具约束有源码支持；教学效果与宿主运行未验证。延迟迁移复测为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、bin/dsh-plugin.ts、lib/tools/index.ts、lib/host/access.ts、lib/reference.ts、lib/lab/runner.ts、lib/lab/sandbox.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定README、包、host与工具注册、域guard、reference及实验runner/sandbox；未审全部格式器和工具、执行模型/实验/测试或真实宿主。
- 下一步：同教材和预算比较普通聊天、当前流程及延迟复测原型，盲评迁移题并计全成本；本轮未执行。[Q05](#research-q05)

**分析版本**

- **仓库**：[Miaotofu01/Study-Mate](https://github.com/Miaotofu01/Study-Mate)
- **版本号**：2.0.3（[固定提交 d8114f3](https://github.com/Miaotofu01/Study-Mate/tree/d8114f38363272852b339d6788b2f8f007243b43)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是以延迟复测及未见迁移题推进学习进度，在同教材预算下比最终学习质量及全成本。[Q05](#research-q05)

同教材和预算比较普通聊天、当前流程及延迟复测原型，盲评迁移题并计全成本；本轮未执行。[Q05](#research-q05)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 69 | 13832 | — | — | 273797 |
| .mjs | source | 20 | 3606 | 2653 | 738 | — |
| .ts | source | 79 | 21927 | 15142 | 5094 | — |
| .js | source | 1 | 5365 | 3649 | 1393 | — |
| .mjs | test | 95 | 32902 | 25705 | 4741 | — |
| .js | example | 2 | 529 | 371 | 124 | — |
| .mjs | example | 13 | 1952 | 1393 | 437 | — |
| .md | test | 1 | 220 | — | — | 9765 |

</details>

**活跃度**

[![Issue 未关闭 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=17&color=737b86&logo=github)](https://github.com/Miaotofu01/Study-Mate/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 132](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=132&color=737b86&logo=github)](https://github.com/Miaotofu01/Study-Mate/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)

暂未获取：近30天关闭。

统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：文件化课程与原生学习工具相比普通AI聊天增加什么，学习效果和实验隔离的界限在哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 数学计算机自学相对普通AI聊天多了什么交付？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是需要按前置知识推进数学或计算机科目、反复练习的自学者。StudyMate把学习从聊天回答组织为科目大纲、课件、练习/项目和持久进度，阅读端实时呈现工作区文件；合格结果应是学习者能独立完成预定任务并保留可复查作答，而不是课件数量增加。相对普通AI对话，它增加文件化课程结构、跨会话进度和阅读/作答入口；相对成熟教材，个性化内容的正确性与系统性仍需核对。作者的开源与定制讲解不能证明学得更快或课程质量高于网课。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:99-118](https://github.com/Miaotofu01/Study-Mate/blob/d8114f38363272852b339d6788b2f8f007243b43/README.md#L99-L118)

作者定义课程工作流和普通聊天比较。

<details>
<summary>查看原文（20行）</summary>

```text
| 看视频课 / 网课  | 质量参差不齐；付费；无法跟随前沿发展的节奏       | 讲解方式定制化；收集最新的资料与标准；完全开源                                       |


## 核心功能

**课程总览与大纲路线图**：总览页列全部科目与当前节点，点进去是那门课的知识点路线图，按依赖分层排开、按状态着色，点节点原地展开课件子卡片。

<img src="docs/images/preview-index.png" width="640" alt="路线图示例">

**课件是学习的主载体**：经典教材的讲解风格，丰富的配图，定制化的题目与项目目标。

<img src="docs/images/preview-lesson.png" width="640" alt="课件示例">

阅读端就是产出本身：课件页由阅读端实时渲染，公式、配图、题目都在里面；需要一份能离线打开的副本时走导出（`npx -y @yunmiao/studymate export`，产物在 `<工作区>/export/`）。仓库里**不再入库示例工作区**——测试用的科目现造现弃（[ADR-0009](docs/adr/0009-示例与生成产物不再入库.md)），示例截图见上面的预览图。


## 用法示例

- **「我不知道学什么，帮我选方向」** → 一次聊一个问题，可跳过或先看建议；选定方向后补齐开课信息，确认后接回建课与首课流程（见 [可选方向探索](docs/使用/使用说明.md#可选先探索学习方向)）。
- **「我想学 C++ 打竞赛」** → 先盘问目的/程度/项目/实验方式，再产出大纲路线图与科目主页，开第一课。
```

</details>

**依据 2 · 作者声明**：[README.md:122-146](https://github.com/Miaotofu01/Study-Mate/blob/d8114f38363272852b339d6788b2f8f007243b43/README.md#L122-L146)

实时阅读与学习示例属于作者说明。

<details>
<summary>查看原文（25行）</summary>

````text
- **「太简单了 / 没听懂」** → 换讲法（加边界与反例，或降一层抽象），并把这条偏好记进共享记忆。
  
<img src="docs/images/preview-chat.png" width="640" alt="对话示例">

## 配置与维护

日常要跑的命令只有一条，就是你装完之后自检的那条：

```bash
npm test
```

它不需要真实 DSH、浏览器或模型服务；测试自己造临时科目，不碰你的学习工作区。引擎脚本已经没有了（Python 随 #83 退役），**原生工具的清单与参数**只有两个出处：代码是 [`lib/tools/index.ts`](lib/tools/index.ts)，人读的那份是[原生工具契约](preset/skills/learning-system/references/tools.md)；各命令的前置、按需入口（真实浏览器、真实 DSH）与退出码语义见[测试说明](scripts/tests/README.md)——几处各是唯一出处，本文不重抄。

独立 Web 运行时（`study-mate-web/`，FastAPI + Next.js）曾落在主线，现已移出到分支 [`web/0.7.0-beta`](https://github.com/Miaotofu01/Study-Mate/tree/web/0.7.0-beta)——它自带一套引擎，与插件端读写同一份学习工作区，等有人把它适配到新引擎后合回。为什么移出、合回前必须满足什么，见 [ADR-0013](docs/adr/0013-Web运行时移出主线.md)。

## 项目结构

目录树、每个目录干什么、哪个文件归谁维护，见[工程约束](docs/规范/工程约束.md) §二 目录与规则归属
与[文件归属](docs/规范/文件归属.md)——两处各有唯一出处，这里不再抄一份。

DSH 侧就是**一个插件包**（`@yunmiao/studymate`）：Host 半注册原生工具与阅读端数据路由，Client 半是阅读端本体；预设与工作区配置由安装器写。学习数据默认位于独立的 `~/StudyMate`，无需保留源码仓库；详见 [安装说明](docs/使用/安装.md)。

学习工作区里面长什么样（科目文件夹、课件、lab、档案、课型与题型），见 [使用说明 §六](docs/使用/使用说明.md#六学习数据存在哪)。

````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 预设、工具与学习数据怎样划分职责？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

根host从profileContext取得归属，注册学习和答疑预设，工具只在学习预设作用域中注册；host保留进程级任务类型、监听和阅读数据路由。这避免其他预设意外看到学习工具，服务缺失时分层降级。工具统一注册点将工作区摘要、校验器、改写与导出分域，createAccess在调用mutate前核域和字段模式；这属于工具内部访问约束，不是操作系统沙箱。学习数据写独立工作区，参考资料有版本与operationId设计。可借鉴的是副作用归属与预设作用域分离，移植需DSH的profile/connection/tool API以及相同文件格式；仅注册成功不代表课程正确。

#### 证据与依据

**依据 1 · 源码核查**：[bin/dsh-plugin.ts:72-110](https://github.com/Miaotofu01/Study-Mate/blob/d8114f38363272852b339d6788b2f8f007243b43/bin/dsh-plugin.ts#L72-L110)

宿主profile注册预设和host模块。

<details>
<summary>查看原文（39行）</summary>

```text
export async function apply(ctx: PluginContext): Promise<void> {
  const profile = ctx.get?.('profileContext');
  if (!profile || !ctx.agentPresets?.register) {
    console.warn('StudyMate：当前 DSH 不支持原生插件接口（需要 0.1.7-alpha.1+）；已跳过原生加载。旧版请使用 npx -y @yunmiao/studymate@latest install。');
  } else {
    try {
      // installPayload 在 bin/studymate.mjs（本次不迁）：TS 从 JS 里推断出「四个必填参数」，
      // 而 native 启动本来就只传这三个（其余由它自己探测/默认）。断言只影响类型，运行期一字未改。
      const { registration } = installPayload({
        native: true, profile: profile.name, dshHome: profile.home,
      } as Parameters<typeof installPayload>[0]);
      // `!`：ctx.effect 缺失时的 TypeError 由下面的 catch 兜住（与迁移前同一条路径）
      await ctx.effect!(() => ctx.agentPresets!.register(registration.config));
      // 「答疑模式」是第二条预设，自己的 effect、自己的 disposer。`installPayload` 一次产出
      // 两条（学习 + 答疑），这里各注册各的——缺了它（老包）只少一条预设，学习的照常。
      if (registration.qaConfig !== undefined) {
        await ctx.effect!(() => ctx.agentPresets!.register(registration.qaConfig));
      }
    } catch (error) {
      // Startup may report a problem, but must not migrate profile ownership.
      console.warn(`StudyMate：已跳过原生加载。${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // ── 宿主层（#138）──────────────────────────────────────────────────────
  // 导出的任务类型、任务域那条阅读端路由与销毁回执、实验域的任务类型与台账收尾、文件监听
  // ——这些是进程级的东西，注册在**插件所在的 profile 根**上。具体注册什么在
  // `lib/tools/index.ts` 的 `registerStudyMateHost` 里，这个文件不认识任何工具。
  //
  // **原生工具不在这里**：九个学习工具 + 五个 `studymate_task_*` + 一个 `studymate_lab_run`
  // 由「学习模式」预设那条插件行（`@yunmiao/studymate/learning-preset`）注册进**预设作用域**
  // ——落在 profile 根会让同一个 profile 里每个预设的会话都看见它们（#87 那条已知偏离）。
  //
  // 模块在这里 await 加载（不是丢一个浮动 Promise）：apply 返回时这些已经挂好；这个文件也可能
  // 被单独拷出去跑（那时 ctx 没有 inject），所以加载放在 inject 判断之后。
  if (typeof ctx.inject !== 'function') return;
  try {
    const { registerStudyMateHost } = await import('../lib/tools/index.ts');
    registerStudyMateHost(ctx as unknown as Parameters<typeof registerStudyMateHost>[0]);
```

</details>

**依据 2 · 源码核查**：[lib/tools/index.ts:4-25](https://github.com/Miaotofu01/Study-Mate/blob/d8114f38363272852b339d6788b2f8f007243b43/lib/tools/index.ts#L4-L25)

host与预设工具职责分离。

<details>
<summary>查看原文（22行）</summary>

```text
   **两个入口，按层分**（#138）：

     · `registerStudyMateHost(ctx)`   —— **宿主层**，`bin/dsh-plugin.ts` 在 profile 根调它：
       导出的任务类型、任务域那条阅读端路由与销毁回执、实验域的任务类型与台账收尾、文件监听。
       这些是进程级的东西，跟着预设走会随卸载消失或被重复注册。
     · `registerStudyMateTools(ctx)`  —— **agent 层**，由「学习模式」预设那条插件行
       （`lib/tools/learning-preset.ts`）在**预设作用域**里调它：九个学习工具 + 五个任务工具
       + 一个实验工具。落在预设作用域里，别的预设看不见（#87 那条已知偏离的工具面部分）。

   `registerStudyMate(ctx)` 保留成「两层都挂」的兼容入口，既有测试与旧调用点不用改。

   各子系统各导出自己的 `registerXxx(ctx)`，往下面的清单里加一行就是加一个子系统——注册顺序、
   effect 归属、能力探测、域 guard 全在这条路径上，不用每个子系统自己记一遍。

   #69 / #70 / #73 / #74 会各往这里加一行（架构边界测试、数据模型、界面、导出正式落地）：
     1. 在自己的目录里（`lib/<域>/`）导出 `registerXxx(ctx)`；
     2. 把 `import` 与那一行加进下面的清单；
     3. **不要**改 `bin/dsh-plugin.ts`。那个文件里的 `ctx.inject(['tools'], …)` 已经
        把「没有 tools 的组合」处理干净了（缺服务就不注册，插件其余部分照常 apply）。

   为什么每个 registerXxx 自己开 `ctx.effect`（而不是在这里统一包一层）：注册是**有主的**
   副作用（`dsh-plugin-api.md` §2.10），子系统卸载时各自拆自己的；包一层会让「谁注册的」
```

</details>

**依据 3 · 源码核查**：[lib/host/access.ts:178-192](https://github.com/Miaotofu01/Study-Mate/blob/d8114f38363272852b339d6788b2f8f007243b43/lib/host/access.ts#L178-L192)

实际检查声明域和字段后执行写回调。

<details>
<summary>查看原文（15行）</summary>

```text
    write<T>(domain: Domain, path: string, mutate: () => T): T {
      const patterns = writes[domain];
      if (!patterns || patterns.length === 0) {
        throw new DomainViolationError({
          tool, action: 'write', domain, target: path, declared: Object.keys(writes),
          why: '这个域不在工具声明的写域里',
        });
      }
      if (!patterns.some((pattern) => matchesPattern(pattern, path))) {
        throw new DomainViolationError({
          tool, action: 'write', domain, target: path, declared: patterns,
          why: '这个字段不在工具声明允许写的字段模式里',
        });
      }
      return mutate();
```

</details>

**依据 4 · 源码核查**：[lib/reference.ts:4-15](https://github.com/Miaotofu01/Study-Mate/blob/d8114f38363272852b339d6788b2f8f007243b43/lib/reference.ts#L4-L15)

人机共写、版本和幂等设计。

<details>
<summary>查看原文（12行）</summary>

```text
   `reference/` 是**人机共写**的目录（ADR-0010）：资料收集角色把本地教材、速查页转进来，
   学生也可以从阅读端直接放自己手上的讲义。两边同放一处，所以：

     · 来源标记：带 `source: learner` front matter 的 Markdown 算学生放的，其余一律算
       agent 收的——日后要能分清哪份是模型产物、哪份是人放的；
     · 并发保护：客户端写之前先报它看到的版本号（payload 里的 reference_version），
       对不上就 409 拒绝并重读当前清单，绝不覆盖别人的改动（目标态规格 §4.3）；
     · 幂等：同一个 operationId 重放只回放上次的响应，不写第二遍（双击与超时重试）。

   清单、版本号、读取、写入四件事必须共用同一套「什么算一条资料」的规则——版本号是写入
   时的栅栏，清单与它不同源就会出现「明明没人动过却报冲突」。所以规则都收在本模块里，
   `lib/library.ts` 只负责把清单与版本号挂进 payload（它 import 本模块；反过来会成环）。
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 课件通过检查和实验退出成功是否代表学会且安全？

**研究主题**：缺陷与关键质疑

#### 完整回答

不代表。格式/交接校验能发现结构问题，实验runner记录进程事实，但不能证明知识讲解正确、题目测到理解或迁移能力。尤其lib/lab/sandbox明说不是OS沙箱，进程以宿主身份运行，cwd/固定参数限制挡不住运行时自行构造外部路径；HOME/TMPDIR重定向只是缓释，不应用于不可信代码。README对Codex/ChatGPT和Antigravity只保证v1.0.0，当前2.0.3不能继承那些平台的可用性；DSH用户也需实际加载检查。最关键质疑是“结构合格/脚本成功”被误读为“学习掌握/代码隔离”，二者验收单位不同。

#### 证据与依据

**依据 1 · 源码核查**：[lib/lab/sandbox.ts:146-156](https://github.com/Miaotofu01/Study-Mate/blob/d8114f38363272852b339d6788b2f8f007243b43/lib/lab/sandbox.ts#L146-L156)

明确不是OS沙箱及运行期路径限制。

<details>
<summary>查看原文（11行）</summary>

```text
/* ── 残留风险（写在代码里，免得只有报告知道）────────────────────────────

   这一层**不是**操作系统级沙箱，命令仍然以本进程的身份跑，能力与本进程相同。能挡的是
   「命令的**固定部分**（cwd、参数、程序）指着外面」这一种；挡不住的是进程在运行期自己算出来
   的路径（`open(os.environ['HOME'] + '/x')` 这类）。两条缓释：

     · `HOME` / `TMPDIR` 被指到本次运行专用的临时目录（`runner.ts`），孩子的 `~` 不是学生的 `~`；
     · 跑完把**真实退出码与真实输出原样**记进作答数据——越界的痕迹留在那里面，人看得见。

   真要做强隔离得靠 OS 机制（bubblewrap / sandbox-exec / Job Object），那是另一张票的事，
   不在这张的范围里。 */
```

</details>

**依据 2 · 源码核查**：[lib/lab/runner.ts:224-240](https://github.com/Miaotofu01/Study-Mate/blob/d8114f38363272852b339d6788b2f8f007243b43/lib/lab/runner.ts#L224-L240)

实际spawn使用shell:false但仍运行本机进程。

<details>
<summary>查看原文（17行）</summary>

```text
  const env = buildEnv(options.workspace, sandboxHome);
  let done = false;

  try {
    const finished = await new Promise<{ code: number | null; signal: NodeJS.Signals | null; error: string }>((resolve) => {
      let child;
      try {
        child = spawn(options.argv[0] as string, options.argv.slice(1), {
          cwd: options.cwd,
          env,
          shell: false,
          // POSIX 上自成进程组：杀的时候连孩子一起杀（见文件头第 4 条）
          detached: process.platform !== 'win32',
          stdio: ['ignore', 'pipe', 'pipe'],
        });
      } catch (error) {
        resolve({ code: null, signal: null, error: error instanceof Error ? error.message : String(error) });
```

</details>

**依据 3 · 作者声明**：[README.md:75-95](https://github.com/Miaotofu01/Study-Mate/blob/d8114f38363272852b339d6788b2f8f007243b43/README.md#L75-L95)

非DSH平台只保证v1.0.0。

<details>
<summary>查看原文（21行）</summary>

````text

> **支持范围：只有 `v1.0.0`。** 1.1.0 起的版本不再保证在这一侧可用。

用 `v1.0.0` 那棵树构建并安装（不要用 `main`）：

```bash
git checkout v1.0.0
node bin/studymate.mjs build-antigravity --install
```

或者通过 `npm run build:antigravity` 构建 ZIP 包手动导入（详见 [Antigravity 说明](docs/使用/Antigravity.md)）。

## 它是什么

StudyMate 是一套**数学/计算机学习工作流、SKILL 与 DSH 插件**，支持 DSH（DeepSeek Harness）的「学习模式」预设、Google Antigravity 原生多智能体插件，也可打包为 Codex 和 ChatGPT Work 插件。它按需组织收集资料、采图、课程设计、讲解、练习评估五个角色；宿主支持时可委派给子代理，否则依次完成各角色工作。

- **课程组成：讲解|练习|项目实操**：每门课一份大纲——知识点按前置依赖排成路线图，每个知识点标课的类型「概念课 | 实操课 | 实验课」（大纲里写 `概念`／`实操`／`实验`）。学习进度落在文件里，每次新对话可继承已有进度。
- **跨科目共享记忆**：记住你的现有水平、哪种讲法有效、常见卡点，下一门课不用重新自我介绍。

## 为什么用它

````

</details>

#### 缺口

- 课件正确率、延迟复测和独立迁移任务没有本轮数据。
  **影响**：不能宣称实际学习效果或长期掌握。
  **进一步探讨**：固定教材真值与不见过的新题，比较普通聊天和StudyMate并记录教师复核。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么学习者可试用，首次和失败恢复投入是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

已有DSH、愿意核对教材与保存学习工作区的自学者可先试一门小课，保留独立教材和每次作答。首次需匹配Node和DSH、安装bundle并确认工作区；持续生成课程、检索和多角色会消耗模型/资料访问及人工审阅，金额与耗时未知。失败恢复需要备份课件、进度和作答，处理格式/写入冲突；工作区文件可读提供退回手工学习的路径，但不等完整迁移已验收。先不执行不可信实验，课程错误或进度与真实掌握不一致时停止自动推进并回原教材和人工计划。不要为现版本安装旧平台产物作功能保证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:72-79](https://github.com/Miaotofu01/Study-Mate/blob/d8114f38363272852b339d6788b2f8f007243b43/package.json#L72-L79)

Node声明范围与许可。

```text
  },
  "license": "MIT",
  "author": "Cattofu",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Miaotofu01/Study-Mate.git"
  },
  "homepage": "https://github.com/Miaotofu01/Study-Mate#readme",
```

**依据 2 · 作者声明**：[README.md:35-71](https://github.com/Miaotofu01/Study-Mate/blob/d8114f38363272852b339d6788b2f8f007243b43/README.md#L35-L71)

DSH安装条件及独立工作区。

<details>
<summary>查看原文（37行）</summary>

````text
#### 安装

- web端

```bash
dsh plugin --profile web add @yunmiao/studymate
```

- 桌面端
  
```bash
dsh plugin --profile desktop add @yunmiao/studymate
```
#### 更新

- web端

```bash
dsh plugin --profile web update @yunmiao/studymate@latest
```

- 桌面端
  
```bash
dsh plugin --profile desktop update @yunmiao/studymate@latest
```
- **第一次学习**：新建会话时选「学习模式」，说一句「我想学 [某个科目]」。学习数据直接写进配置好的学习工作区（暂存模式已删，没有"收尾问落点再搬一次"这一步）。
- **还没想好学什么**：在学习对话里说「我不知道学什么，帮我选方向」，可选探索后再决定是否开课；已有明确科目或恢复学习直接走原流程。
- **学习工作区默认在 `~/StudyMate`，所有课件与记忆均存放在工作区**；已有配置会沿用。
- **阅读在 DSH 的阅读端**：装好后新建会话时选「学习模式」，从侧边栏切到阅读端就能读课件、作答、搜资料——页面由阅读端实时渲染，不再预生成 HTML。

工作区、更新、桌面端与换机器续学、以及老版本 DSH 的替代装法见 [安装说明](docs/使用/安装.md)。

### Codex 和 ChatGPT Work

> **支持范围：只有 `v1.0.0`。** 1.1.0 起的版本不再保证在这一侧可用。

````

</details>

**依据 3 · 源码核查**：[lib/reference.ts:7-15](https://github.com/Miaotofu01/Study-Mate/blob/d8114f38363272852b339d6788b2f8f007243b43/lib/reference.ts#L7-L15)

来源与并发写入影响维护。

```text
     · 来源标记：带 `source: learner` front matter 的 Markdown 算学生放的，其余一律算
       agent 收的——日后要能分清哪份是模型产物、哪份是人放的；
     · 并发保护：客户端写之前先报它看到的版本号（payload 里的 reference_version），
       对不上就 409 拒绝并重读当前清单，绝不覆盖别人的改动（目标态规格 §4.3）；
     · 幂等：同一个 operationId 重放只回放上次的响应，不写第二遍（双击与超时重试）。

   清单、版本号、读取、写入四件事必须共用同一套「什么算一条资料」的规则——版本号是写入
   时的栅栏，清单与它不同源就会出现「明明没人动过却报冲突」。所以规则都收在本模块里，
   `lib/library.ts` 只负责把清单与版本号挂进 payload（它 import 本模块；反过来会成环）。
```

#### 缺口

- 首次配置、模型总调用和工作区恢复时间未测。
  **影响**：不能量化总学习成本。
  **进一步探讨**：在备份工作区记录一次课程生成、纠错、作答和恢复的全周期投入。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么验证比课程路线图更能检验教育增量？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把进度推进绑定到延迟复测和未见过的迁移题，而不是只以课件/作答记录完成推进。由Q01合格学习任务和Q03结构检查不能证明掌握推导，可能把个性化讲解转为可复核学习路径。最小实验同一教材、相近基础学习者与模型预算，对比普通AI聊天、当前StudyMate和加入复测原型；隔天盲测新题，记录正确率、解释质量、资料/模型成本及人工复核时间。若延迟迁移成绩无改善或投入显著更高，则不支持该原型；不是本项目已证明的教学成效。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:103-118](https://github.com/Miaotofu01/Study-Mate/blob/d8114f38363272852b339d6788b2f8f007243b43/README.md#L103-L118)

文件化进度和个性化是主张基础。

<details>
<summary>查看原文（16行）</summary>

```text

**课程总览与大纲路线图**：总览页列全部科目与当前节点，点进去是那门课的知识点路线图，按依赖分层排开、按状态着色，点节点原地展开课件子卡片。

<img src="docs/images/preview-index.png" width="640" alt="路线图示例">

**课件是学习的主载体**：经典教材的讲解风格，丰富的配图，定制化的题目与项目目标。

<img src="docs/images/preview-lesson.png" width="640" alt="课件示例">

阅读端就是产出本身：课件页由阅读端实时渲染，公式、配图、题目都在里面；需要一份能离线打开的副本时走导出（`npx -y @yunmiao/studymate export`，产物在 `<工作区>/export/`）。仓库里**不再入库示例工作区**——测试用的科目现造现弃（[ADR-0009](docs/adr/0009-示例与生成产物不再入库.md)），示例截图见上面的预览图。


## 用法示例

- **「我不知道学什么，帮我选方向」** → 一次聊一个问题，可跳过或先看建议；选定方向后补齐开课信息，确认后接回建课与首课流程（见 [可选方向探索](docs/使用/使用说明.md#可选先探索学习方向)）。
- **「我想学 C++ 打竞赛」** → 先盘问目的/程度/项目/实验方式，再产出大纲路线图与科目主页，开第一课。
```

</details>

**依据 2 · 源码核查**：[lib/tools/index.ts:68-79](https://github.com/Miaotofu01/Study-Mate/blob/d8114f38363272852b339d6788b2f8f007243b43/lib/tools/index.ts#L68-L79)

源码校验和改写关注结构而非学习掌握。

<details>
<summary>查看原文（12行）</summary>

```text
/** 四个校验器：数据层、内容层、图片库、交接门禁。 */
export function registerValidatorTools(ctx: StudyPluginContext): void {
  registerStudyTool(ctx, validateCurriculumTool());
  registerStudyTool(ctx, validateLessonTool());
  registerStudyTool(ctx, validatePoolTool());
  registerStudyTool(ctx, validateHandoffTool());
}

/** 两个改写工具：位次重排、无题理由。 */
export function registerRewriteTools(ctx: StudyPluginContext): void {
  registerStudyTool(ctx, renumberLessonsTool());
  registerStudyTool(ctx, applyEmptyReasonsTool());
```

</details>

#### 缺口

- 延迟复测是否改善真实学习和留存尚无对照。
  **影响**：创新仅为设计假设。
  **进一步探讨**：按固定教材和预算设计盲评迁移题并记录全成本。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
