# DSH Codex Effort Slider

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[fd1b78a](https://github.com/Microqian2th/dsh-codex-effort-slider/tree/fd1b78a73322c9686301e4ba9da0db85d60559ae)

<!-- BEGIN META -->
[![GitHub ★ 260](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=260&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Microqian2th/dsh-codex-effort-slider) [![npm 30d 9,207](https://img.shields.io/static/v1?label=npm+30d&message=9%2C207&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-effort-slider) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-effort-slider)
<!-- END META -->

> **功能**：在 DeepSeek Harness 模型菜单中以 Codex 风格滑条选择推理等级，并提供动画与显示设置。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 为既有目录等级提供拖动入口，并通过宿主选择 API 发送档位。

> **主要限制**：[Q03](#research-q03) 排队只保存档位 ID，发送才读取当前模型，切模型时可能把旧选择提交给新模型。宿主会如何处理这类请求仍须核查。

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
  - [Q01 · 滑条改变哪项操作？](#detail-section-11)
  - [Q02 · 拖动如何提交到宿主？](#detail-section-12)
  - [Q03 · 模型或会话切换时，排队与乐观状态会如何处理？](#detail-section-13)
  - [Q04 · 怎样判断是否值得保留？](#detail-section-14)
  - [Q05 · 显示确认状态能否降低误选？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常比较模型推理档位的 DSH 用户，可用拖动和颜色反馈选择现有等级。

直接使用官方模型菜单选择推理等级。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 档位滑条 | 拖动或键盘选择现有推理等级 | 依赖目录与 DOM 结构，回读实际状态 |
| 显示设置 | 调整动画和刻度外观 | 视觉偏好与性能需自行核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH web 与模型目录 | 必需 | 读取和选择等级 | 目录缺失时停止使用 |
| Node ≥22 | 按包声明必需 | 宿主加载 | 先核对运行环境 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户隔离配置并记录官方等级 | 原菜单可用 |
| 选择 | 用户拖动或键盘切档 | 官方目录回读一致 |
| 退出 | 用户停用插件恢复原菜单 | 核查最终等级和输入状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 客户端资源 | 安装并核对目录 | 耗时未知 |
| 持续 | 动画与宿主选择请求 | 兼容与误选复核 | 模型费用随实际档位变化 |
| 失败 | 原菜单仍需保留 | 停用后回读等级 | 在途请求结果待核对 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 选档入口 | 读取实际目录并提交 | 交互准确性与节时 |
| 错误反馈 | 显式失败清理乐观状态 | 全部竞态下的最终显示 |

> **思考**：[Q03](#research-q03) 排队只保存档位 ID，发送才读取当前模型，切模型时可能把旧选择提交给新模型。宿主会如何处理这类请求仍须核查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 为既有目录等级提供拖动入口，并通过宿主选择 API 发送档位。

[Q02](#research-q02) 请求合并能减少拖动期间的发送。[Q03](#research-q03) 目录访问器有会话生命周期，但排队值缺少发送目标身份。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 排队只保存档位 ID，发送才读取当前模型，切模型时可能把旧选择提交给新模型。宿主会如何处理这类请求仍须核查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 一次只在同一会话和模型试选，等官方菜单读回后再切换。出现实际等级错配时停用插件并恢复原菜单。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持目录读取、选择提交与显式失败恢复。实际交互和竞态表现尚未验证。

- 已检查：作者 README、包清单、源码路径 lib/client.js、lib/index.js、README.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查目录、会话插槽、提交队列和错误分支，未运行动画、宿主或目标测试。
- 下一步：隔离宿主中阻塞 select，随后排队并交错切换模型、会话和卸载，核对实际发送模型、档位以及最终目录和界面。

**分析版本**

- **仓库**：[Microqian2th/dsh-codex-effort-slider](https://github.com/Microqian2th/dsh-codex-effort-slider)
- **版本号**：1.1.5（[固定提交 fd1b78a](https://github.com/Microqian2th/dsh-codex-effort-slider/tree/fd1b78a73322c9686301e4ba9da0db85d60559ae)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可分开展示拖动目标和宿主已确认等级，测试延迟下的误判是否减少。

隔离宿主中阻塞 select，随后排队并交错切换模型、会话和卸载，核对实际发送模型、档位以及最终目录和界面。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2832 | 1937 | 786 | — |
| .mjs | source | 1 | 553 | 452 | 73 | — |
| .md | source | 1 | 333 | — | — | 5378 |
| .mjs | test | 2 | 2518 | 2024 | 312 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Microqian2th/dsh-codex-effort-slider/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：频繁切换推理档位的 DSH 用户能否用滑条可靠选择实际模型目录中的等级？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 滑条改变哪项操作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户已在官方模型菜单里选择当前模型的推理等级时，滑条提供连续拖动到离散档位的入口和颜色反馈。它适合需要试几种等级的交互偏好。模型能力和等级数量来自宿主目录，不能从滑条长度或动画推断模型更聪明、费用更低。原办法是官方菜单直接点击等级，合格结果是宿主实际选中预期档位。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/README.md#L5-L15)

作者描述拖动、设置与诊断。

<details>
<summary>查看原文（11行）</summary>

```text
给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）用的 **Codex 风格推理等级滑条**。

**一档一色、越往右越"通电"**：填充从蓝渐变到紫罗兰，高档位亮起紫色星云与星尘粒子，
连官方那一行的数值文字也跟着变色（`Off` 档保持官方灰）。

## 怎么用

1. **拖**：在模型菜单里那条滑条上按住拖动 —— 跟手连续运动，**拖到哪一档就即时变成哪一档**
   （滑过档位边界就把官方档位切过去，不用等松手）。
2. **右键**：在**滑条上点右键**打开设置面板 
3. 设置**即时生效并记住**；出问题时点一下「复制诊断」把逐帧记录导出。
```

</details>

**依据 2 · 源码核查**：[lib/client.js:690-734](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L690-L734)

真实档位与生效默认值均来自宿主状态。

<details>
<summary>查看原文（45行）</summary>

```text
    /** 当前模型真实可用的档位列表（官方 id + 官方显示名，按目录顺序）。 */
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

    /**
     * 解析"本次渲染真正可用的档位列表"：
     *   活列表非空 → 更新缓存并返回它；
     *   活列表为空 → 若缓存属于同一模型（或身份未知），用缓存兜底；否则返回空。
     * 纯函数 + 显式传入缓存，便于单测（见 test/client.test.mjs 第 49 节）。
     */
    function resolveLevels(liveLevels, liveKey, cache) {
      if (liveLevels.length > 0) {
        cache.key = liveKey;
        cache.levels = liveLevels;
        return liveLevels;
      }
      var sameModel = liveKey === null || cache.key === null || liveKey === cache.key;
      if (cache.levels.length > 0 && sameModel) return cache.levels;
      return liveLevels;
    }

    /**
     * 当前**生效**的档位 id：显式设置优先；没设置过就是模型的默认档
     * （与官方 `syncInputs()` 的 `effort = intended.reasoningEffort ?? reasoning.defaultEffort` 同款）。
     */
    function effectiveEffortId(state) {
      var current = state && state.current;
      if (current && typeof current.reasoningEffort === "string" && current.reasoningEffort.length > 0) {
        return current.reasoningEffort;
      }
      var model = modelOf(state);
      var fallback = model && model.reasoning && model.reasoning.defaultEffort;
      return typeof fallback === "string" && fallback.length > 0 ? fallback : null;
```

</details>

#### 缺口

- 频繁切档的真实操作频率和可用性收益未知。
  **影响**：不足以说明视觉便利值得持续维护。
  **进一步探讨**：同一组切档任务比较点击与滑条的误选率和完成时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 拖动如何提交到宿主？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端声明 slots、sessions、modelDirectories 和远程会话服务，注册输入栏插槽并传递 sessionId。目录为渲染提供当前模型的档位。requestCommit 只保存档位字符串，在途或节流时保留最新选择。flush 发送前重新读取当时的 provider 和 model，并在该档位已生效时跳过重复请求，然后调用 directory.select。这里没有将排队的档位与原模型绑定，也没有核对它是否属于发送时的模型。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:690-720](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L690-L720)

目录列表供渲染使用。

<details>
<summary>查看原文（31行）</summary>

```text
    /** 当前模型真实可用的档位列表（官方 id + 官方显示名，按目录顺序）。 */
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

    /**
     * 解析"本次渲染真正可用的档位列表"：
     *   活列表非空 → 更新缓存并返回它；
     *   活列表为空 → 若缓存属于同一模型（或身份未知），用缓存兜底；否则返回空。
     * 纯函数 + 显式传入缓存，便于单测（见 test/client.test.mjs 第 49 节）。
     */
    function resolveLevels(liveLevels, liveKey, cache) {
      if (liveLevels.length > 0) {
        cache.key = liveKey;
        cache.levels = liveLevels;
        return liveLevels;
      }
      var sameModel = liveKey === null || cache.key === null || liveKey === cache.key;
      if (cache.levels.length > 0 && sameModel) return cache.levels;
      return liveLevels;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:2045-2079](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L2045-L2079)

入队仅保存档位字符串，并合并或延后提交。

<details>
<summary>查看原文（35行）</summary>

```text
      /** 请求写回某一档：同档位去重 + 在途合并 + 降频；immediate 用于松手/键盘。 */
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
          }
          return;
        }
        if (immediate === true) {
          flush();
          return;
        }
        if (pending.timer !== null) return;
        pending.timer = setTimeout(function () {
          pending.timer = null;
          flush();
        }, COMMIT_THROTTLE_MS);
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1983-2016](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L1983-L2016)

发送时读取当前模型并检查相等去重。

<details>
<summary>查看原文（34行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/client.js:2037-2042](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L2037-L2042)

在途结束可触发下一项提交。

```text
        ).then(function () {
          setBusy(false);
          // 在途合并：拖动期间攒下的最新值在这里补发。
          tracePush({ k: "commit-settle", inFlight: pending.inFlight, queued: pending.queued });
          if (pending.queued !== null) flush();
        });
```

**依据 5 · 源码核查**：[lib/client.js:2650-2667](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L2650-L2667)

宿主服务和会话插槽。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 模型或会话切换时，排队与乐观状态会如何处理？

**研究主题**：缺陷与关键质疑

#### 完整回答

同一会话切模型时，渲染缓存会使用 provider 和 model 判断能否复用，但排队槽仍只保存档位 ID。若 flush 读到另一模型，可能把旧档位提交给新模型，宿主最终接受、拒绝或解释为同名等级的行为尚未验证。会话变化时旧目录访问器会释放，关闭后的快照为空，可使仍捕获旧访问器的回调在发送前退出。排队 ref 的清空却只在组件卸载效应中，插槽创建也没有显式给组件按会话或模型设置 key，因此无法从此处证明切换必定重挂、或共享 ref 中的选择不会被新的访问器处理。已发请求不因卸载而自动撤回。乐观值在显式失败或超时可回滚，仍须读回官方菜单。DOM 语义定位也是独立兼容条件。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1332-1347](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L1332-L1347)

关闭后的目录快照为空。

<details>
<summary>查看原文（16行）</summary>

```text
      return {
        getSnapshot: function () {
          if (closed) return EMPTY_SNAPSHOT;
          if (directory === null) {
            resolve();
            if (directory === null) scheduleRetry();
          }
          if (directory !== null) {
            try {
              var value = directory.store.getSnapshot();
              if (value && typeof value === "object") last = value;
            } catch (error) {
              /* 保留上一次快照，绝不把渲染打崩 */
            }
          }
          return last;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1367-1378](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L1367-L1378)

释放访问器及旧订阅。

<details>
<summary>查看原文（12行）</summary>

```text
        dispose: function () {
          closed = true;
          listeners.clear();
          if (retryTimer !== null) {
            try { timers.clear(retryTimer); } catch (error) { /* 忽略 */ }
            retryTimer = null;
          }
          if (unsubscribe !== null) {
            try { unsubscribe(); } catch (error) { /* 忽略 */ }
            unsubscribe = null;
          }
          directory = null;
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1770-1801](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L1770-L1801)

访问器随会话变化，模型身份用于档位缓存。

<details>
<summary>查看原文（32行）</summary>

```text
        function () {
          if (sessionId === null || !ctx) return null;
          return createDirectoryAccess(ctx, sessionId, {
            set: function (fn, delay) { return setTimeout(fn, delay); },
            clear: function (handle) { clearTimeout(handle); },
          });
        },
        [ctx, sessionId],
      );

      React.useEffect(function () {
        return function () {
          if (access !== null) access.dispose();
        };
      }, [access]);

      var subscribe = React.useCallback(
        function (onChange) { return access === null ? function () {} : access.subscribe(onChange); },
        [access],
      );
      var getSnapshot = React.useCallback(
        function () { return access === null ? EMPTY_SNAPSHOT : access.getSnapshot(); },
        [access],
      );
      var state = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

      var liveLevels = levelsOf(state);
      // 模型身份：缓存的有效性判断（provider + model 变了就不复用缓存）。
      var liveLevelKey = (state && state.current && typeof state.current.provider === "string" && typeof state.current.model === "string")
        ? state.current.provider + "\u0000" + state.current.model
        : null;
      var levels = resolveLevels(liveLevels, liveLevelKey, __levelsCache);
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1943-1971](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L1943-L1971)

乐观状态超时和组件卸载清理。

<details>
<summary>查看原文（29行）</summary>

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

      // 组件卸载：清掉降频定时器（否则会在卸载后写一次宿主）。
      React.useEffect(function () {
        return function () {
          var pending = commitRef.current;
          if (pending.timer !== null) {
            clearTimeout(pending.timer);
            pending.timer = null;
          }
          pending.queued = null;
        };
      }, []);
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1983-2016](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L1983-L2016)

发送时的模型与入队档位分开取值。

<details>
<summary>查看原文（34行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[lib/client.js:2045-2053](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L2045-L2053)

队列没有模型或会话身份。

```text
      /** 请求写回某一档：同档位去重 + 在途合并 + 降频；immediate 用于松手/键盘。 */
      function requestCommit(levelId, immediate) {
        if (levelId === null || levelId === undefined) return;
        var pending = commitRef.current;
        var snapshot = currentState();
        if (effectiveEffortId(snapshot) === levelId && pending.queued === null && !pending.inFlight) return;
        pending.queued = levelId;
        tracePush({ k: "req", id: levelId, imm: immediate === true, inFlight: pending.inFlight, queued: pending.queued });
        if (pending.inFlight) {
```

**依据 7 · 源码核查**：[lib/client.js:2663-2667](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L2663-L2667)

插槽传入会话，没有显式 key。

```text
              inject: function (sessionId) { return { sessionId: sessionId }; },
            },
            function SlotComponent(props) {
              return React.createElement(CodexEffortSlider, Object.assign({}, props, { __ctx: ctx }));
            },
```

#### 缺口

- 未验证宿主如何处置模型切换后的旧档位或何时重挂插槽。
  **影响**：不能据界面显示判断最终宿主等级。
  **进一步探讨**：在隔离宿主中阻塞一次 select，先排队另一档再换模型或会话，记录发送参数、宿主返回和最终状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样判断是否值得保留？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

可在一次性 DSH profile 中先用已有模型目录的几档测试鼠标拖动与键盘切换，一次只在同一会话、同一模型操作，等官方菜单读回再换模型或会话。需要 web 客户端、模型目录和会话服务，根包 Node 范围为 >=22。使用者承担 DOM 兼容、视觉偏好和诊断复核。若换模型后收到意外选择、等级跳动或实际状态不符，停用插件并恢复官方菜单。模型消耗取决于最终等级，滑条自身没有提供效果或费用计量。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:47-57](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/package.json#L47-L57)

Node 和 web 客户端声明。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/client.js:2650-2667](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L2650-L2667)

实际服务依赖。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/client.js:2021-2042](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L2021-L2042)

错误及排队处理。

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

#### 缺口

- 浏览器与宿主版本覆盖、动画负担和键盘可达性未验收。
  **影响**：持续维护价值未知。
  **进一步探讨**：用同一模型的固定切档任务记录误选、帧负担和退出状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 显示确认状态能否降低误选？

**研究主题**：新假设与验证

#### 完整回答

假设把用户正在拖动的档位与宿主已确认的等级分别显示，能减少在途延迟时误以为选择已经生效。现有乐观状态和目录有效值提供实现线索。对同一组快速拖动，增加可控 select 延迟并对比单一显示与双状态显示，测停止拖动后的实际匹配率、误操作和额外理解时间。如果用户同样误判或更多迟疑，方案没有可证明的收益。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:2004-2035](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L2004-L2035)

当前有乐观值与提交失败清理。

<details>
<summary>查看原文（32行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/client.js:727-734](https://github.com/Microqian2th/dsh-codex-effort-slider/blob/fd1b78a73322c9686301e4ba9da0db85d60559ae/lib/client.js#L727-L734)

宿主有效档位可独立读取。

```text
    function effectiveEffortId(state) {
      var current = state && state.current;
      if (current && typeof current.reasoningEffort === "string" && current.reasoningEffort.length > 0) {
        return current.reasoningEffort;
      }
      var model = modelOf(state);
      var fallback = model && model.reasoning && model.reasoning.defaultEffort;
      return typeof fallback === "string" && fallback.length > 0 ? fallback : null;
```

#### 缺口

- 双状态展示未实现和测试。
  **影响**：是否提升可用性未知。
  **进一步探讨**：在非生产环境配对测试不同响应延迟。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
