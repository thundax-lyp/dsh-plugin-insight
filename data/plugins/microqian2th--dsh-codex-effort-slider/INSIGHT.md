# dsh-codex-effort-slider

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[fc5a994](https://github.com/Microqian2th/dsh-codex-effort-slider/tree/fc5a994e34d3329bef748135e2c2ed219b9e30ce)

<!-- BEGIN META -->
[![GitHub ★ 243](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=243&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Microqian2th/dsh-codex-effort-slider) [![npm 30d 7,350](https://img.shields.io/static/v1?label=npm+30d&message=7%2C350&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-effort-slider) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-effort-slider)
<!-- END META -->

> **功能**：为 DSH 官方模型菜单加入可拖动的推理等级滑条、档位配色和动画设置。

> **亮点**：它把官方模型目录的既有档位接到原菜单中的滑条，增加拖动和键盘交互，贡献限于呈现与输入便利。[Q01](#research-q01)、[Q02](#research-q02) 展开接线与参照。

> **主要限制**：菜单两行条件和第二行回退仍依赖宿主结构；虽有10秒乐观显示回滚，在途select和等待队列并未因此取消，显示恢复不能代替最终状态核对。[Q03](#research-q03)

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
  - [Q01 · 滑条为谁增加了什么，是否改变模型能力？](#detail-section-11)
  - [Q02 · 从输入插槽到官方档位写回，链路如何闭合？](#detail-section-12)
  - [Q03 · DOM 适配和失败恢复的主要边界是什么？](#detail-section-13)
  - [Q04 · 接入、日常和恢复负担由谁承担？](#detail-section-14)
  - [Q05 · 什么范围值得试用，可推导什么未验证改进？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：频繁切换 DSH 模型推理等级的用户，可在原模型菜单中拖动选择现有档位。

参照官方菜单直接选档，本组件增加连续拖动和视觉反馈，不增加模型能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 拖动与键盘选档 | 选择模型既有推理等级 | 依赖有效模型目录与菜单结构 |
| 档位颜色与粒子动画 | 呈现当前交互位置 | 不代表推理性能或写入已成功 |
| 右键设置与诊断 | 调整视觉偏好并导出诊断 | 设置持久化依赖浏览器存储 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node >=22 与 DSH web 客户端 | 启动必需 | 加载宿主入口及客户端产物 | 支持状态未知，不能据包声明认定兼容 |
| slots、sessions、modelDirectories、remote、remote.session | 必需 | 会话插槽与官方档位访问 | 控件或目录不能就绪 |
| 当前模型提供 reasoning.efforts | 切档必需 | 提供真实档位 | 没有可用滑条档位 |
| localStorage | 设置持久化条件 | 保存动画和刻度偏好 | 读取失败使用默认值 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户通过对应 profile 管理安装并重启 | 原菜单可用且滑条出现在推理行 |
| 选档 | 用户拖动或按方向键 | 官方有效档位与意图一致 |
| 排障 | 用户核对错误与复制诊断 | 10秒超时会回滚显示；核对官方档位，不一致时停止并回原菜单 |
| 退出 | 用户停用插件并重启 | 原菜单结构与档位可用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 下载与本地资源，金额未知 | profile安装、重启与状态核对，耗时未知 | 包无运行时依赖不代表无需宿主 |
| 持续 | 动画与观察器资源未测；模型费用另计 | 切档并核对有效状态 | 无单任务节时依据 |
| 失败恢复 | 重试与恢复资源未测 | 停用、检查原菜单、反馈诊断 | 10秒后回滚显示；在途请求未取消，最终状态仍需核对 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 切换既有档位 | 源码调用官方select、处理返回错误并在10秒后回滚乐观显示 | 目标宿主实际兼容与写入效果 |
| 更直观的选择 | 拖动、颜色和键盘入口已接线 | 误选率、节时和可访问性净收益 |

> **思考**：菜单两行条件和第二行回退仍依赖宿主结构；虽有10秒乐观显示回滚，在途select和等待队列并未因此取消，显示恢复不能代替最终状态核对。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把官方模型目录的既有档位接到原菜单中的滑条，增加拖动和键盘交互，贡献限于呈现与输入便利。[Q01](#research-q01)、[Q02](#research-q02) 展开接线与参照。

[Q03](#research-q03) 的局部样式快照、dispose清理和10秒乐观显示回滚值得借鉴；后者不取消在途select或清除inFlight，不能把显示超时与请求终止混同。迁移时还必须重新定义菜单锚点。

<a id="detail-section-5"></a>

### 1.4 主要限制

菜单两行条件和第二行回退仍依赖宿主结构；虽有10秒乐观显示回滚，在途select和等待队列并未因此取消，显示恢复不能代替最终状态核对。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在不承载重要任务的会话检查原菜单与滑条是否一致；不一致、无法提交或菜单受影响时立即停用并恢复原菜单。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的交互适配；效率收益没有对照数据，未来改进仍是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/client.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定客户端入口、菜单桥、状态与提交失败路径；未覆盖所有动画数学，也未执行宿主或目标测试。
- 下一步：以同模型同会话对照官方菜单，检查菜单重排、失败和悬挂提交，记录最终有效档位及恢复操作。

**分析版本**

- **仓库**：[Microqian2th/dsh-codex-effort-slider](https://github.com/Microqian2th/dsh-codex-effort-slider)
- **版本号**：1.1.4（[固定提交 fc5a994](https://github.com/Microqian2th/dsh-codex-effort-slider/tree/fc5a994e34d3329bef748135e2c2ed219b9e30ce)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在已有10秒显示回滚之外探索显式宿主挂载位、可取消的写入超时与队列释放，以菜单重排及悬挂提交对照检验误挂和迟到结果；这是未实现、未验证的设计假设。[Q05](#research-q05)

以同模型同会话对照官方菜单，检查菜单重排、失败和悬挂提交，记录最终有效档位及恢复操作。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2768 | 1895 | 761 | — |
| .mjs | source | 1 | 553 | 452 | 73 | — |
| .md | source | 1 | 333 | — | — | 5378 |
| .mjs | test | 2 | 2513 | 2021 | 311 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Microqian2th/dsh-codex-effort-slider/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：交互滑条能否在保持官方档位语义的条件下提供可控的切换便利？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 滑条为谁增加了什么，是否改变模型能力？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在 DSH 网页或桌面客户端反复切换推理档位、偏好拖动操作的用户。原办法仍是官方模型菜单，本组件把同一行改为可拖动条并随档位着色；它没有新增推理档位、改变模型或证明回答质量提高。合格结果是拖动或键盘选择后，官方目录中的有效档位与用户意图一致。README 的“提效”和真机截图属于作者描述，当前源码支持的增量是交互呈现及写回路径，而非模型能力。对很少切档或依赖系统减少动态效果的用户，这份交互改造未必值得。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-23](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/README.md#L10-L23)

作者说明操作与动画设置。

<details>
<summary>查看原文（14行）</summary>

```text
## 怎么用

1. **拖**：在模型菜单里那条滑条上按住拖动 —— 跟手连续运动，**拖到哪一档就即时变成哪一档**
   （滑过档位边界就把官方档位切过去，不用等松手）。
2. **右键**：在**滑条上点右键**打开设置面板 
3. 设置**即时生效并记住**；出问题时点一下「复制诊断」把逐帧记录导出。

<img src="https://raw.githubusercontent.com/Microqian2th/dsh-codex-effort-slider/main/preview/screenshots/context-menu.png" width="330" alt="右键滑条打开设置面板：动画效果（快速/简洁/完整，三档都不受系统减少动态影响）、已到达档位的刻度点（亮白/同色/隐藏）、复制诊断 / 恢复默认 / 关闭">

| 设置项 | 可选 | 说明 |
|---|---|---|
| **动画效果** | **快速动画** / 简洁动画 / 完整动画 | 三种**都不受系统「减少动态效果」影响**（否则系统一开就退化成"瞬跳"）。**快速**复刻 Codex 桌面版手感 —— 旋钮**不跟手**、停在档位格上，指针越过 1/3 档距才切下一格（后退要退回 2/3，带滞回），**约 70~85ms 吸附到位且无回弹**；**简洁**更干脆；**完整**最跟手、惯性更长 |
| **已到达档位的刻度点** | 亮白显示 / 与未到达同色 / 隐藏 | 控制轨道上那些定位小点的可见性 |
| | | **复制诊断**（逐帧记录，反馈问题时用）/ **恢复默认** / **关闭** |
```

</details>

**依据 2 · 源码核查**：[lib/client.js:691-704](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L691-L704)

档位来自当前模型公开目录，不创建新档位。

<details>
<summary>查看原文（14行）</summary>

```text
    function levelsOf(state) {
      var model = modelOf(state);
      var efforts = model && model.reasoning && Array.isArray(model.reasoning.efforts) ? model.reasoning.efforts : [];
      var out = [];
      for (var i = 0; i < efforts.length; i += 1) {
        var effort = efforts[i];
        if (!effort || typeof effort.id !== "string" || effort.id.length === 0) continue;
        out.push({
          id: effort.id,
          name: typeof effort.name === "string" && effort.name.length > 0 ? effort.name : effort.id,
        });
      }
      return out;
    }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1994-2000](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L1994-L2000)

写入官方 directory.select。

```text
        var result;
        try {
          result = directory.select({
            provider: current.provider,
            model: current.model,
            reasoningEffort: levelId,
          });
```

#### 缺口

- 没有同任务的切档耗时、误操作率与可访问性对照。
  **影响**：不能把视觉便利解释为效率或正确率提升，也不能据此建议所有用户替换原菜单。
  **进一步探讨**：用相同模型和任务比较原菜单与滑条，记录有效档位、误选和恢复操作。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从输入插槽到官方档位写回，链路如何闭合？

**研究主题**：功能与机制

#### 完整回答

客户端注册 conversation.input.right 的隐藏锚点，使用 sessionId 获取模型目录，订阅读取有效档位。DOM 桥从锚点寻找所属 composer，再通过已展开菜单的 aria-controls 定位根菜单，把容器插入推理行；React portal 在其中渲染滑条。拖动请求按档位去重，在途时只保留最新待写值，完成后补发；select 传递当前 provider/model 与 reasoningEffort，失败则清除乐观显示并呈现错误。由此能确认真实写入口，而不能仅从动画位置断言宿主已生效。 源码另设10秒乐观显示期限，宿主迟迟未回报会撤乐观态并显示超时错误；这个期限约束显示，不等于取消在途 select。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:2587-2605](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L2587-L2605)

服务依赖和插槽注册接线。

<details>
<summary>查看原文（19行）</summary>

```text
    var inject = ["slots", "sessions", "modelDirectories", "remote", "remote.session"];

    function apply(ctx) {
      installStyles();
      try {
        ctx.slots.inject(SLOT_NAME, function () {
          return ctx.slots.register(
            {
              name: SLOT_NAME,
              id: ENTRY_ID,
              order: ENTRY_ORDER,
              label: function () { return "Reasoning effort"; },
              // 会话 id 的第二条来路（标准 props 一般已经带了；两条都走 props.sessionId）。
              inject: function (sessionId) { return { sessionId: sessionId }; },
            },
            function SlotComponent(props) {
              return React.createElement(CodexEffortSlider, Object.assign({}, props, { __ctx: ctx }));
            },
          );
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1453-1475](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L1453-L1475)

定位根菜单的语义及数量条件。

<details>
<summary>查看原文（23行）</summary>

```text
    function findEffortRow(doc, composer) {
      if (!doc || !composer || typeof doc.querySelectorAll !== "function") return null;
      var seats = doc.querySelectorAll('button[aria-haspopup="menu"][aria-expanded="true"]');
      var seat = null;
      for (var i = 0; i < seats.length; i += 1) {
        if (composer.contains(seats[i])) { seat = seats[i]; break; }
      }
      if (seat === null) return null;

      var menuId = typeof seat.getAttribute === "function" ? seat.getAttribute("aria-controls") : null;
      var menu = menuId && typeof doc.getElementById === "function" ? doc.getElementById(menuId) : null;
      if (!menu) return null;

      var items = menu.querySelectorAll('button[role="menuitem"]');
      if (items.length !== 2) return null; // 根面板恰好两行；子面板用的是 menuitemradio
      for (var j = 0; j < items.length; j += 1) {
        var label = firstSpanText(items[j]);
        for (var k = 0; k < EFFORT_ROW_LABELS.length; k += 1) {
          if (label === EFFORT_ROW_LABELS[k]) return items[j];
        }
      }
      // 文案认不出（官方改了措辞/别的语言）就按官方固定顺序：第 2 个 menuitem 是推理等级。
      return items[1];
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1961-2026](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L1961-L2026)

提交、错误和后续队列处理。

<details>
<summary>查看原文（66行）</summary>

```text
      function flush() {
        var pending = commitRef.current;
        if (pending.timer !== null) {
          clearTimeout(pending.timer);
          pending.timer = null;
        }
        var levelId = pending.queued;
        pending.queued = null;
        if (pending.safetyTimer !== null) { clearTimeout(pending.safetyTimer); pending.safetyTimer = null; }
        tracePush({ k: "flush", id: levelId });
        if (levelId === null || levelId === undefined || access === null) return;

        var snapshot = currentState();
        var current = snapshot && snapshot.current;
        if (!current || typeof current.provider !== "string" || typeof current.model !== "string") {
          setError("模型目录尚未就绪，无法写入档位");
          return;
        }
        // 发送前再判一次：可能宿主已经把这个档位写好了（去重的第二道闸）。
        if (effectiveEffortId(snapshot) === levelId) { tracePush({ k: "flush-skip", id: levelId, why: "dedupe" }); return; }

        var directory = access.directory();
        if (directory === null || typeof directory.select !== "function") {
          setError("模型目录不可用，档位未写入");
          return;
        }

        pending.inFlight = true;
        optimisticIdRef.current = levelId;
        setOptimistic({ id: levelId });
        setError(null);
        setBusy(true);

        var result;
        try {
          result = directory.select({
            provider: current.provider,
            model: current.model,
            reasoningEffort: levelId,
          });
        } catch (error) {
          result = Promise.reject(error);
        }

        Promise.resolve(result).then(
          function (outcome) {
            pending.inFlight = false;
            tracePush({ k: outcome && outcome.ok === false ? "commit-fail" : "commit-ok" });
            if (outcome && outcome.ok === false) {
              optimisticIdRef.current = null;
              setOptimistic(null);
              setError(errorText(outcome.error));
            }
          },
          function (error) {
            pending.inFlight = false;
            optimisticIdRef.current = null;
            setOptimistic(null);
            setError(errorText(error));
          },
        ).then(function () {
          setBusy(false);
          // 在途合并：拖动期间攒下的最新值在这里补发。
          tracePush({ k: "commit-settle", inFlight: pending.inFlight, queued: pending.queued });
          if (pending.queued !== null) flush();
        });
```

</details>

**依据 4 · 源码核查**：[lib/client.js:49-49](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L49-L49)

乐观显示的超时常量为10000毫秒。

```text
    var COMMIT_DEADLINE_MS = 10000;
```

**依据 5 · 源码核查**：[lib/client.js:1927-1943](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L1927-L1943)

宿主追上则撤乐观态；10秒未追上时回滚显示并报告错误，但不修改inFlight或取消select。

<details>
<summary>查看原文（17行）</summary>

```text
      // 宿主追上乐观值 → 撤掉乐观态（此后以真实目录为准）。
      React.useEffect(function () {
        if (optimisticId !== null && effectiveId === optimisticId) setOptimistic(null);
      }, [effectiveId, optimisticId]);

      // 超时兜底：宿主迟迟不回报就回滚并说明，不继续假装已生效。
      React.useEffect(function () {
        if (optimisticId === null) return undefined;
        var handle = setTimeout(function () {
          if (optimisticIdRef.current === optimisticId) {
            optimisticIdRef.current = null;
            setOptimistic(null);
            setError("档位切换超时，宿主未回报结果（已回滚显示）");
          }
        }, COMMIT_DEADLINE_MS);
        return function () { clearTimeout(handle); };
      }, [optimisticId]);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · DOM 适配和失败恢复的主要边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

兼容性依赖根菜单恰好两个 menuitem、composer 标记及可匹配的档位名称。标签认不出时直接退到第二行，因此宿主保留两行但重排语义的变更不一定静默失效，存在挂到错误行的静态风险；不能照抄 README 的“绝不会改坏”。桥会保存被改的内联样式，dispose 断开观察器、清理轮询、释放颜色并 detach；这是可借鉴的局部恢复设计。模型目录失败有错误显示；COMMIT_DEADLINE_MS=10000 在10秒后撤去乐观显示并报超时，不会修改 pending.inFlight 或取消 Promise。因此已有显示恢复机制，但提交生命周期仍可能等待。safetyTimer 在 inFlight 期间每50ms重新排队，源码没有可见次数上限，注释所称“有界轮询”并不等于总时长有界。未证明会实际永久等待，必须在试用时以官方有效档位为准。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1453-1475](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L1453-L1475)

二行判断与第二行回退显示实际兼容边界。

<details>
<summary>查看原文（23行）</summary>

```text
    function findEffortRow(doc, composer) {
      if (!doc || !composer || typeof doc.querySelectorAll !== "function") return null;
      var seats = doc.querySelectorAll('button[aria-haspopup="menu"][aria-expanded="true"]');
      var seat = null;
      for (var i = 0; i < seats.length; i += 1) {
        if (composer.contains(seats[i])) { seat = seats[i]; break; }
      }
      if (seat === null) return null;

      var menuId = typeof seat.getAttribute === "function" ? seat.getAttribute("aria-controls") : null;
      var menu = menuId && typeof doc.getElementById === "function" ? doc.getElementById(menuId) : null;
      if (!menu) return null;

      var items = menu.querySelectorAll('button[role="menuitem"]');
      if (items.length !== 2) return null; // 根面板恰好两行；子面板用的是 menuitemradio
      for (var j = 0; j < items.length; j += 1) {
        var label = firstSpanText(items[j]);
        for (var k = 0; k < EFFORT_ROW_LABELS.length; k += 1) {
          if (label === EFFORT_ROW_LABELS[k]) return items[j];
        }
      }
      // 文案认不出（官方改了措辞/别的语言）就按官方固定顺序：第 2 个 menuitem 是推理等级。
      return items[1];
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1581-1604](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L1581-L1604)

挂载前保存样式。

<details>
<summary>查看原文（24行）</summary>

```text
          var value = findValueElement(row);
          var previous = {
            // 真实 DOM 里未设置的内联属性读作 ""，这里统一成同样的语义，还原时才不会写回
            // 字面量 "undefined"（那在浏览器里是无效值，会把我们的加高留在原地）。
            height: row.style.height || "",
            flexWrap: row.style.flexWrap || "",
            paddingTop: row.style.paddingTop || "",
            paddingBottom: row.style.paddingBottom || "",
            boxShadow: row.style.boxShadow || "",
            // 数值文字原来的内联颜色（通常没设过，读作 ""）
            valueColor: value && value.style ? value.style.color || "" : "",
          };
          // 「加高那一栏的上下距离」+ 允许折行，让滑条落到第二行并铺满整行宽度。
          row.style.height = "auto";
          row.style.flexWrap = "wrap";
          row.style.paddingTop = ROW_PADDING_BLOCK;
          row.style.paddingBottom = ROW_PADDING_BLOCK;

          var container = doc.createElement("div");
          container.className = "ces-inline";
          container.setAttribute("data-ces-part", "host");
          row.appendChild(container);

          current = { row: row, container: container, value: value, previous: previous };
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1642-1654](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L1642-L1654)

释放监听与样式恢复入口。

<details>
<summary>查看原文（13行）</summary>

```text
        dispose: function () {
          disposed = true;
          if (observer !== null) {
            try { observer.disconnect(); } catch (error) { /* 忽略 */ }
            observer = null;
          }
          if (timer !== null) {
            try { win.clearInterval(timer); } catch (error) { /* 忽略 */ }
            timer = null;
          }
          releaseSeat();
          detach();
        },
```

</details>

**依据 4 · 源码核查**：[lib/client.js:2030-2051](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L2030-L2051)

在途安全轮询没有次数上限。

<details>
<summary>查看原文（22行）</summary>

```text
      function requestCommit(levelId, immediate) {
        if (levelId === null || levelId === undefined) return;
        var pending = commitRef.current;
        var snapshot = currentState();
        if (effectiveEffortId(snapshot) === levelId && pending.queued === null && !pending.inFlight) return;
        pending.queued = levelId;
        tracePush({ k: "req", id: levelId, imm: immediate === true, inFlight: pending.inFlight, queued: pending.queued });
        if (pending.inFlight) {
          // ⚠️ 不能直接 return：那次在途的收尾可能**已经**跑完了（微任务早于本次同步调用），
          //    排队值就会永远躺在 queued 里没人发 —— 实测 eff 长期不更新就是这么来的。
          //    这里加一个**有界轮询**，直到在途结束并把它发出去。
          if (pending.safetyTimer === null) {
            var armSafety = function () {
              pending.safetyTimer = setTimeout(function () {
                pending.safetyTimer = null;
                if (pending.queued === null) return;
                if (pending.inFlight) { armSafety(); return; }
                tracePush({ k: "safety-flush", id: pending.queued });
                flush();
              }, 50);
            };
            armSafety();
```

</details>

**依据 5 · 源码核查**：[lib/client.js:49-49](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L49-L49)

乐观显示的超时常量为10000毫秒。

```text
    var COMMIT_DEADLINE_MS = 10000;
```

**依据 6 · 源码核查**：[lib/client.js:1927-1943](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L1927-L1943)

宿主追上则撤乐观态；10秒未追上时回滚显示并报告错误，但不修改inFlight或取消select。

<details>
<summary>查看原文（17行）</summary>

```text
      // 宿主追上乐观值 → 撤掉乐观态（此后以真实目录为准）。
      React.useEffect(function () {
        if (optimisticId !== null && effectiveId === optimisticId) setOptimistic(null);
      }, [effectiveId, optimisticId]);

      // 超时兜底：宿主迟迟不回报就回滚并说明，不继续假装已生效。
      React.useEffect(function () {
        if (optimisticId === null) return undefined;
        var handle = setTimeout(function () {
          if (optimisticIdRef.current === optimisticId) {
            optimisticIdRef.current = null;
            setOptimistic(null);
            setError("档位切换超时，宿主未回报结果（已回滚显示）");
          }
        }, COMMIT_DEADLINE_MS);
        return function () { clearTimeout(handle); };
      }, [optimisticId]);
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 接入、日常和恢复负担由谁承担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要 Node >=22 的 DSH 包加载环境、web 客户端、slots/sessions/modelDirectories/remote/remote.session 服务和具有 reasoning.efforts 的模型目录；包没有声明运行时依赖不代表宿主服务可缺省。用户通过当前 profile 的插件管理加载并重启，动画设置存在 localStorage，读取失败回退默认。首次负担是安装与确认所属会话和模型；持续负担是理解拖动即写回，必要时检查有效档位；故障时回到官方菜单并禁用组件。模型推理费用由所选档位和供应商决定，不能把本组件零运行时依赖解释为任务免费。没有配置耗时、渲染资源或实际请求费用计量。 10秒超时会恢复显示，但不会证明请求取消；恢复时还需核对官方有效档位，避免将迟到结果当作不存在。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-59](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/package.json#L1-L59)

包的客户端声明、Node约束和发布入口。

<details>
<summary>查看原文（59行）</summary>

```text
{
  "name": "dsh-codex-effort-slider",
  "version": "1.1.4",
  "description": "Codex 风格的推理等级滑条：把 DSH 输入框工具行的推理等级档位换成一条可拖动的连续滑条 / A Codex-style reasoning-effort slider for DeepSeek Harness",
  "license": "MIT",
  "author": "Microqian2th",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Microqian2th/dsh-codex-effort-slider.git"
  },
  "bugs": {
    "url": "https://github.com/Microqian2th/dsh-codex-effort-slider/issues"
  },
  "homepage": "https://github.com/Microqian2th/dsh-codex-effort-slider#readme",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "reasoning-effort",
    "slider",
    "ui"
  ],
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "lib/client.js",
    "cordis.patch.yml",
    "screenshots.json",
    "install-profile.ps1",
    "install.cmd",
    "LICENSE",
    "test",
    "preview",
    "README.md"
  ],
  "scripts": {
    "test": "node test/client.test.mjs",
    "preview": "node preview/make-preview.mjs",
    "pack": "powershell -NoProfile -ExecutionPolicy Bypass -File ./pack-dist.ps1"
  },
  "engines": {
    "node": ">=22"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true
    }
  }
}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:300-319](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L300-L319)

设置读取、规范化和持久化错误边界。

<details>
<summary>查看原文（20行）</summary>

```text
    function readSettings() {
      var cached = cacheGet();
      if (cached !== null) return cached;
      var raw = null;
      try {
        if (typeof localStorage !== "undefined" && localStorage) raw = localStorage.getItem(settingsKey());
      } catch (error) { /* 读不到用默认 */ }
      var parsed = null;
      try { parsed = raw ? JSON.parse(raw) : null; } catch (error) { parsed = null; }
      var expected = (typeof SETTINGS_VERSION === "undefined") ? 3 : SETTINGS_VERSION;
      // 版本不符 → **不丢弃值**，只按当前 schema 规范化（保留仍合法的项）并盖上版本号。
      var out = normalizeSettings(parsed);
      out.v = expected;
      if (parsed && typeof parsed === "object" && parsed.v !== expected) {
        try {
          if (typeof localStorage !== "undefined" && localStorage) localStorage.setItem(settingsKey(), JSON.stringify(out));
        } catch (error) { /* 写盘失败也无妨：值已保住 */ }
      }
      cacheSet(out);
      return out;
```

</details>

**依据 3 · 源码核查**：[lib/client.js:2587-2605](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L2587-L2605)

客户端真实依赖。

<details>
<summary>查看原文（19行）</summary>

```text
    var inject = ["slots", "sessions", "modelDirectories", "remote", "remote.session"];

    function apply(ctx) {
      installStyles();
      try {
        ctx.slots.inject(SLOT_NAME, function () {
          return ctx.slots.register(
            {
              name: SLOT_NAME,
              id: ENTRY_ID,
              order: ENTRY_ORDER,
              label: function () { return "Reasoning effort"; },
              // 会话 id 的第二条来路（标准 props 一般已经带了；两条都走 props.sessionId）。
              inject: function (sessionId) { return { sessionId: sessionId }; },
            },
            function SlotComponent(props) {
              return React.createElement(CodexEffortSlider, Object.assign({}, props, { __ctx: ctx }));
            },
          );
```

</details>

**依据 4 · 作者声明**：[README.md:64-101](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/README.md#L64-L101)

作者给出的安装与卸载方式。

<details>
<summary>查看原文（38行）</summary>

````text
## 安装

### 首选:npm 一条命令（已发布到 registry）

```powershell
# 非 desktop profile
dsh plugin --profile <你的 profile> add dsh-codex-effort-slider
```

> **DSH Desktop 用户**：桌面版的 profile 由 Electron 独占管理，命令行装不了它 —— 请走
> **设置 → 插件 → 添加插件**，在输入框里填 **`dsh-codex-effort-slider`**（包名，现在直接走 npm），
> 或填 `github:Microqian2th/dsh-codex-effort-slider`，点安装，**完全退出并重开** DSH Desktop。
> 装出来的就是上面那组真机截图的样子。

不想用 npm 也没问题 —— 下面两条路一样有效。

> 直接下载打包好的 zip：[**Releases → 最新版**](https://github.com/Microqian2th/dsh-codex-effort-slider/releases/latest)。

**只走 DSH Desktop 自己的插件面板**——命令行装不了 `desktop` profile：

```powershell
dsh plugin --profile desktop add link:"F:\Work Space\DeepSeek Harness\dsh-codex-effort-slider"
# error: profile "desktop" is managed exclusively by the Electron application
```

（这不是配置问题：`bin.js` 里对 `desktop` 直接 `program.error`，只有 Electron 应用本人被允许管理这个保留 profile。）

两条路：

1. **面板安装**（推荐）：**设置 → 插件 → 添加插件** → 填本地目录路径 → 安装 → 重启 DSH Desktop。
   面板会校验两件事，本插件都已满足：是有效的插件包、声明了组合包（`dsh.bundle.patch`）。
2. **手工安装**（当面板本身不可用时——例如 `profileContext` 没挂上，`dsh-base` 会把
   `plugin-manager` 整行 `disabled`，设置侧栏里就看不到「插件」）：
   备份 profile 的 `package.json` → 加一条 `link:` 依赖 → `dsh.profile.bundles` 追加本包名 →
   在 `profiles/<profile>/node_modules/` 下建一个指向本目录的 junction → 重启。

> 卸载用面板；手工装的用 `cmd /c rmdir <junction>`（**不要**用 `Remove-Item -Recurse`，
> 那可能顺着 junction 把插件目录里的文件删掉）。
````

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么范围值得试用，可推导什么未验证改进？

**研究主题**：新假设与验证、采用判断

#### 完整回答

适合已有可恢复 profile、确实频繁切档且愿意核对有效状态的人做短期交互试用。先选无重要任务的会话，比较拖动、键盘和官方菜单的档位状态；出现显示与目录不一致、插错行或操作受阻就停用并回原菜单。由二行回退和在途等待可推导一个尚未实现的方向，让挂载依赖明确的宿主扩展位与语义标识，并在已有10秒显示回滚之外为写入提供可取消超时和队列释放；它可能降低误挂和等待负担，但新增宿主接口协调及超时后状态核对成本。最小验证应模拟菜单重排和永不返回的 select，对照旧实现，只有误挂减少且有效档位不丢失才支持这个假设；如果改造增加失败或无差异则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1453-1475](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L1453-L1475)

改进假设来自菜单顺序回退。

<details>
<summary>查看原文（23行）</summary>

```text
    function findEffortRow(doc, composer) {
      if (!doc || !composer || typeof doc.querySelectorAll !== "function") return null;
      var seats = doc.querySelectorAll('button[aria-haspopup="menu"][aria-expanded="true"]');
      var seat = null;
      for (var i = 0; i < seats.length; i += 1) {
        if (composer.contains(seats[i])) { seat = seats[i]; break; }
      }
      if (seat === null) return null;

      var menuId = typeof seat.getAttribute === "function" ? seat.getAttribute("aria-controls") : null;
      var menu = menuId && typeof doc.getElementById === "function" ? doc.getElementById(menuId) : null;
      if (!menu) return null;

      var items = menu.querySelectorAll('button[role="menuitem"]');
      if (items.length !== 2) return null; // 根面板恰好两行；子面板用的是 menuitemradio
      for (var j = 0; j < items.length; j += 1) {
        var label = firstSpanText(items[j]);
        for (var k = 0; k < EFFORT_ROW_LABELS.length; k += 1) {
          if (label === EFFORT_ROW_LABELS[k]) return items[j];
        }
      }
      // 文案认不出（官方改了措辞/别的语言）就按官方固定顺序：第 2 个 menuitem 是推理等级。
      return items[1];
```

</details>

**依据 2 · 源码核查**：[lib/client.js:2005-2026](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L2005-L2026)

提交结果和错误状态可作为试用观察点。

<details>
<summary>查看原文（22行）</summary>

```text
        Promise.resolve(result).then(
          function (outcome) {
            pending.inFlight = false;
            tracePush({ k: outcome && outcome.ok === false ? "commit-fail" : "commit-ok" });
            if (outcome && outcome.ok === false) {
              optimisticIdRef.current = null;
              setOptimistic(null);
              setError(errorText(outcome.error));
            }
          },
          function (error) {
            pending.inFlight = false;
            optimisticIdRef.current = null;
            setOptimistic(null);
            setError(errorText(error));
          },
        ).then(function () {
          setBusy(false);
          // 在途合并：拖动期间攒下的最新值在这里补发。
          tracePush({ k: "commit-settle", inFlight: pending.inFlight, queued: pending.queued });
          if (pending.queued !== null) flush();
        });
```

</details>

**依据 3 · 源码核查**：[lib/client.js:2030-2051](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L2030-L2051)

超时方向来自持续等待机制。

<details>
<summary>查看原文（22行）</summary>

```text
      function requestCommit(levelId, immediate) {
        if (levelId === null || levelId === undefined) return;
        var pending = commitRef.current;
        var snapshot = currentState();
        if (effectiveEffortId(snapshot) === levelId && pending.queued === null && !pending.inFlight) return;
        pending.queued = levelId;
        tracePush({ k: "req", id: levelId, imm: immediate === true, inFlight: pending.inFlight, queued: pending.queued });
        if (pending.inFlight) {
          // ⚠️ 不能直接 return：那次在途的收尾可能**已经**跑完了（微任务早于本次同步调用），
          //    排队值就会永远躺在 queued 里没人发 —— 实测 eff 长期不更新就是这么来的。
          //    这里加一个**有界轮询**，直到在途结束并把它发出去。
          if (pending.safetyTimer === null) {
            var armSafety = function () {
              pending.safetyTimer = setTimeout(function () {
                pending.safetyTimer = null;
                if (pending.queued === null) return;
                if (pending.inFlight) { armSafety(); return; }
                tracePush({ k: "safety-flush", id: pending.queued });
                flush();
              }, 50);
            };
            armSafety();
```

</details>

**依据 4 · 源码核查**：[lib/client.js:49-49](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L49-L49)

乐观显示的超时常量为10000毫秒。

```text
    var COMMIT_DEADLINE_MS = 10000;
```

**依据 5 · 源码核查**：[lib/client.js:1927-1943](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fc5a994e34d3329bef748135e2c2ed219b9e30ce/lib/client.js#L1927-L1943)

宿主追上则撤乐观态；10秒未追上时回滚显示并报告错误，但不修改inFlight或取消select。

<details>
<summary>查看原文（17行）</summary>

```text
      // 宿主追上乐观值 → 撤掉乐观态（此后以真实目录为准）。
      React.useEffect(function () {
        if (optimisticId !== null && effectiveId === optimisticId) setOptimistic(null);
      }, [effectiveId, optimisticId]);

      // 超时兜底：宿主迟迟不回报就回滚并说明，不继续假装已生效。
      React.useEffect(function () {
        if (optimisticId === null) return undefined;
        var handle = setTimeout(function () {
          if (optimisticIdRef.current === optimisticId) {
            optimisticIdRef.current = null;
            setOptimistic(null);
            setError("档位切换超时，宿主未回报结果（已回滚显示）");
          }
        }, COMMIT_DEADLINE_MS);
        return function () { clearTimeout(handle); };
      }, [optimisticId]);
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
