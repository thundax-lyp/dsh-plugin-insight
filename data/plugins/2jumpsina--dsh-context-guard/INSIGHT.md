# dsh-context-guard

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[a889e8c](https://github.com/2JumpSinA/dsh-context-guard/tree/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2JumpSinA/dsh-context-guard) [![npm 30d 1,388](https://img.shields.io/static/v1?label=npm+30d&message=1%2C388&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@2jumpsina/dsh-context-guard) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@2jumpsina/dsh-context-guard)
<!-- END META -->

> **实现功能**：基于DSH上下文占用投影显示提醒，生成机器事实交接草稿，并记录压缩前读数台账。

> **核心亮点**：把原生token投影转成收尾提示、自动机器事实草稿和压缩读数台账，较手工记录减少重复摘抄；上游计量与压缩不属插件原创，也不等于交接已完成。详见[Q03](#research-q03)。

> **风险与缺陷**：默认草稿可能把路径和问答片段带入工作目录，关闭草稿仍会写压缩台账；进程内队列与短ID去重不能证明完整审计，压缩点可能只是估计。以上为静态边界，未复现竞态。详见[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁需要占用率提醒，交付怎样才合格？](#detail-section-11)
  - [Q02 · 投影到提醒、交接和压缩台账怎样接线？](#detail-section-12)
  - [Q03 · 相对原生压缩和手工交接，具体增加了什么？](#detail-section-13)
  - [Q04 · 默认写盘与估计压缩点有哪些关键限制？](#detail-section-14)
  - [Q05 · 依赖与操作流程如何影响启动和恢复？](#detail-section-15)
  - [Q06 · 按合格交接计量，成本与效果已知到哪里？](#detail-section-16)
  - [Q07 · 哪些工程设计可复用，怎样检验新的交接方向？](#detail-section-17)
  - [Q08 · 谁适合受控试用，停止标准是什么？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：帮助长会话用户决定收尾并保留交接线索，合格交接还需人工补充目标、约束和未决事项。

原生token-meter和compaction提供计量与压缩，用户可手工记交接和决定换会话。本插件自动组织提示和机器事实，不迁移全部语义或代做交接验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 上下文徽标/提醒 | 提示占用与收尾 | 依赖官方投影，压缩点可能估计 |
| 机器事实草稿 | 保存近期线索与人工区 | 默认写盘，可能敏感，非完整结论 |
| 压缩台账 | 保留成功压缩前读数 | 独立于草稿开关，短ID和保留上限 |
| 手动起草与状态 | 查看失败并触发草稿 | 继承宿主web访问控制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 包声明的Node/DSH及schemastery | 启动必需 | 配置、宿主和客户端契约 | 不承诺版本外兼容 |
| sessionProjections/contextPressure | 读数必需 | 占用率与机器事实来源 | 未知读数不推进状态 |
| session/event与成功压缩事件 | 台账必需 | 轮计数及压缩记录 | 事件缺失不能补造记录 |
| webServer和client挂载 | UI/手动动作必需 | 状态、徽标和draft路由 | host日志不等于用户见到提醒 |
| 可写且知情选择的交接路径 | 写入必需 | 保存草稿与台账 | 错误只记状态，不保证已保存 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者固定scope包名，明确路径、敏感性及Git忽略 | 不误装无scope同名包 |
| 加载 | 安装后重启宿主并刷新客户端 | 实际读数和参数来源可见 |
| 收尾 | 读者核对机器事实，补人工结论再迁移 | 新会话可按交接完成已知任务 |
| 恢复/退出 | 查failed状态和完整文件，禁用后处理已有敏感文档 | 不把禁用草稿当停写台账，不自动删除人工信息 |

本轮没有安装或挂载操作。路径和数据分享范围应在采用前确定，不能让默认草稿意外进入提交。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、包与路径资源，增量金额未知 | 版本/读数检查、配置阈值与敏感文件策略 | 没有部署耗时基准 |
| 持续使用 | 内存状态、文件探测、草稿/台账写入 | 理解阈值、核对事实、补结论和新会话交接 | 模型上下文不增不代表总成本0 |
| 失败恢复 | 重写与人工恢复文档、任务重建 | 排查丢块/权限/未知读数、还原人工区 | 未知恢复时间和任务遗漏代价 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 提早收尾线索 | 已有阈值与展示/草稿链 | 阈值是否匹配具体任务 |
| 保留机器事实 | 标记块与压缩台账实际实现 | 跨进程和完整历史保真 |
| 降低长期费用 | 可促成更早迁移而不新增模型请求 | 净费用、人时和任务质量是否改善 |

作者费用样本与价格表相关表述仅作作者报告，当前不额外采用时变价格推算收益。比较必须把重新解释上下文、误迁移和失败重做成本算进去。

> **思考**：默认草稿可能把路径和问答片段带入工作目录，关闭草稿仍会写压缩台账；进程内队列与短ID去重不能证明完整审计，压缩点可能只是估计。以上为静态边界，未复现竞态。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把原生token投影转成收尾提示、自动机器事实草稿和压缩读数台账，较手工记录减少重复摘抄；上游计量与压缩不属插件原创，也不等于交接已完成。详见[Q03](#research-q03)。

把原生token投影转成收尾提示、自动机器事实草稿和压缩读数台账，较手工记录减少重复摘抄；上游计量与压缩不属插件原创，也不等于交接已完成。详见[Q03](#research-q03)。

值得借鉴的是host/client共用纯策略，volatile配置先解引用，避免同一设置显示值和判定值漂移；草稿、手动动作及台账共用每文件队列，失败不会堵住后续写；标记结构破损时拒写，人工子块单独保留，原子rename减少半截文件。它们依赖稳定标记和单进程所有权，不能自动成为数据库事务。测试存在六会话并发写与重复写断言，本轮只读未运行。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认草稿可能把路径和问答片段带入工作目录，关闭草稿仍会写压缩台账；进程内队列与短ID去重不能证明完整审计，压缩点可能只是估计。以上为静态边界，未复现竞态。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合有长会话交接需求的人在私有路径和非敏感任务上试用，先了解草稿和台账两种写入；人工补充约束再迁移，意外落盘、丢块或迁移负担过高时停用。详见[Q08](#research-q08)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的投影提醒与机器事实持久化集成；节费和迁移后效果未独立验证。交接完整性门槛是未验证新假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/policy.mjs、lib/engine.mjs、lib/handover.mjs、test/concurrency.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取固定入口、共享策略/engine、文件写入及测试定义；未运行插件、目标测试或宿主冒烟，不将作者单机成本报告当独立效果。
- 下一步：进一步探讨可从私有样本的草稿刷新、同前缀事件ID、跨进程写入和新会话约束保持入手，同时记录完整费用和人时。

**分析版本**

- **仓库**：[2JumpSinA/dsh-context-guard](https://github.com/2JumpSinA/dsh-context-guard)
- **版本号**：0.7.5（[固定提交 a889e8c](https://github.com/2JumpSinA/dsh-context-guard/tree/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨交接完整性门槛，把明确目标、未决约束和来源与新会话核对结合，检验是否减少遗漏；新增人时或模型调用，与当前零新增请求不同，尚未验证。详见[Q07](#research-q07)。

进一步探讨可从私有样本的草稿刷新、同前缀事件ID、跨进程写入和新会话约束保持入手，同时记录完整费用和人时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 4330 | 2981 | 1173 | — |
| .mjs | source | 13 | 4885 | 3433 | 1208 | — |
| .md | source | 3 | 894 | — | — | 12493 |
| .mjs | test | 10 | 2599 | 2001 | 388 | — |
| .mjs | example | 1 | 42 | 25 | 14 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2JumpSinA/dsh-context-guard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/2JumpSinA/dsh-context-guard/issues?q=is%3Aissue+created%3A2026-09-22T04%3A50%3A20.785Z..2026-10-22T04%3A50%3A20.785Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2JumpSinA/dsh-context-guard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A50%3A20.785Z..2026-10-22T04%3A50%3A20.785Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核查上下文提醒、机器事实交接与压缩台账的价值、来源和默认写盘边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要占用率提醒，交付怎样才合格？

**研究主题：**场景与需求

#### 完整回答

长时间在同一个DSH会话迭代的开发者，需要在继续发送大上下文前决定收尾、迁移或继续。插件把token-meter已有contextPressure读数变成徽标、提醒和机器事实交接草稿，压缩时另存读数台账。合格交接应让读者知道当前目标、已完成与未解决事项、相关文件及下一步判断，机器事实只是其中一部分。

输入是宿主投影、会话事件和工作目录信息，不是模型重新总结整段对话。草稿包括近期问答预览与空白结论区域，不能证明新会话已理解约束。它不替代原生自动压缩，也不自动开启新会话或迁移所有历史。没有长会话负担、没有所需投影，或工作目录不允许自动写入的人，不应只因“零token”而默认启用全部功能。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-9](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/README.md#L5-L9)

作者定位为长会话提醒与机器事实交接。

```text
A [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart) plugin that **tells you to wrap up and start a new session before the session gets too long**.

It consumes the `contextPressure` projection that the official `dsh-token-meter` has already computed, and **after a turn has ended** it speaks up on two thresholds: "write the handoff into a document first, then start a new session." It then helps turn that sentence **into an action** — once the threshold is crossed it drafts a handoff block into the session working directory.

**Context tax = 0**: it registers no model-facing tool, injects no prompt section, and sends no extra request. The host does the arithmetic, the UI does the talking.
```

**依据 2 · 作者声明**：[README.md:31-37](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/README.md#L31-L37)

作者列出写入内容及默认副作用。

```text
## ⚠️ It writes to your working directory (read this before installing)

- **On by default** (`handoverOnWarn: true`). When a session's occupancy crosses `warnRatio` (default 45%), the plugin creates/rewrites `handoverPath` (default `HANDOVER.md`) in **that session's working directory**, and then refreshes it every further 5 percentage points.
- What it writes are **machine facts**: session id, title, working directory, occupancy, turn/call counts, **ledger cost**, **the files this session wrote**, **previews of the last few prompts and replies**, plus empty "to be filled in" slots for the agent.
  ⇒ **It may contain sensitive content** (file paths, fragments of your questions and replies), and **it may end up committed by git**.
- Suggestions: add `HANDOVER.md` to your `.gitignore`; or point `handoverPath` at a location **outside any repository**; or simply set `handoverOnWarn: false`.
- Boundaries: a missing parent directory is refused; an existing target that is not a text file (`.json`/`.yml`/…) is refused; a **symlink** pointing elsewhere is refused; writes are atomic (temp file + rename) with tight permissions (`0o600`). Any failure is recorded as status only — it **never affects** the badge, the banner, or the push.
```

**依据 3 · 源码核查**：[lib/policy.mjs:113-120](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/policy.mjs#L113-L120)

默认交接开启，近期轮次和文件数量受限。

```text
    // —— 自动交接草稿（2026-09-29 新增）。跨过 warnRatio 时由**宿主半边**零 LLM 起草一块机器事实
    //    （会话/水位/花费/改过的文件/最近几轮摘要），叙述留给 agent；只读已算好的投影 ⇒ 上下文税仍是 0。
    //    默认开：这是「一个任务一个会话」的落地动作 —— 45% 开始起草，60% 换会话时交接已经在文件里。
    handoverOnWarn: true,
    handoverPath: 'HANDOVER.md',
    handoverRefreshPercent: 5,
    handoverTurns: 6,
    handoverFiles: 12,
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 投影到提醒、交接和压缩台账怎样接线？

**研究主题：**功能与机制

#### 完整回答

host半部软注入sessionProjections，接收contextPressure并按会话保存读数；状态机以已知占用率划分warn/hard、设置迟滞和冷却。默认45%静默准备交接，60%为提醒。重要时序以当前代码为准，observe发生在投影变化时，turn/end只推进轮计数和冷却，不能照README说成仅轮末判断。

机器事实来自投影及宿主状态，在阈值增量或手动draft时组成标记块，再经文件队列和临时文件rename写入。compaction/end按error是否存在区分成功/失败，成功才写压缩台账，写失败进入可查询状态。host提供web状态、draft与压缩参数路由，浏览器半部共享纯策略和文案计算展示，host/client资源由包client bundle连接。源码没有模型调用链，提醒不意味着模型已经执行收尾。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1295-1350](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/index.js#L1295-L1350)

实际投影触发observe和草稿，说明时序边界。

<details>
<summary>查看原文（56行）</summary>

```text
        projections.onChanged((session, key, value) => {
          diag.projectionEvents += 1;
          const id = sessionIdOf(session);
          // v0.7.1（审查 #7）：没有 id 就没有可落的键 —— 直接返回，不制造共享桶。
          if (id === null) return;
          if (MATERIAL_KEYS.has(key)) noteMaterial(id, key, value, session);
          if (key !== KEY) return;
          // v0.6.10（真机：宿主读数落后于客户端）：留一条**原始载荷**指纹，排障时看形状与数值，
          // 只留最近 6 条，不含正文。
          diag.pressure = diag.pressure ?? [];
          diag.pressure.push({
            at: Date.now(),
            session: String(id ?? '').slice(-12),
            projected: Number.isFinite(value?.projectedTokens) ? value.projectedTokens : null,
            window: Number.isFinite(value?.contextWindow) ? value.contextWindow : null,
            keys: value !== null && typeof value === 'object' ? Object.keys(value).slice(0, 10) : null,
          });
          if (diag.pressure.length > 6) diag.pressure.shift();
          // 手动起草路由要用：记住该会话**最新的压力原值**与 session 引用（见 draftNow 注释）
          lastPressure.set(id, value);
          lastSession.set(id, session);
          // v0.4.1：记下读数（压缩后靠这个 ring 取"压缩前峰值"，当前值已经不可用了）
          const snap = readOccupancy(value);
          if (snap.known === true && Number.isFinite(snap.ratio)) {
            const ring = recentReadings.get(id) ?? [];
            ring.push({
              ratio: snap.ratio,
              projectedTokens: snap.projectedTokens,
              contextWindow: snap.contextWindow,
              at: Date.now(),
            });
            if (ring.length > 30) ring.splice(0, ring.length - 30);
            recentReadings.set(id, ring);
          }
          try {
            refreshConfig(); // 设置页改完不用重启：每一轮判断前都读一次当前设置
            /**
             * 判定点：**投影变化时**（不是 `turn/end`）。
             *
             * P1-2 的定案（2026-10-17 代码审查后）：README / package.json 原本写 "at turn end"，
             * 但实现一直是「投影变化即判」，而且 `tools/selftest.mjs` 有 14 项场景把这件事当**规格**钉着。
             * 两条路里选了**改文档、不改时机**，理由是风险不对称：
             *   · 保持投影即判 ⇒ 最坏只是 banner 出现得早一点（时序，不是正确性）；
             *   · 改成只在 turn/end 判 ⇒ 一旦某个会话的 `turn/end` 没送到，就**完全不提示**（漏报）。
             * （实测过后者：selftest 立刻红 14 项 —— 因为它只推投影、不发 turn/end。）
             *
             * `justCompacted`：v0.4.3 起它是**状态里的** `pendingCompaction`（由 `compaction/end`
             * 事件置位、由这一次观测消费，见 `lib/engine.mjs` 的 `fold`）—— 所以这里不再需要
             * 传任何东西，也不再需要宿主自己维护那个一次性 Map。
             */
            const hit = engine.observe(id, value, { locale: localeOf(session, id) });
            if (hit !== null) {
              logHit(hit);
            }
            // 45% 起自动起草/刷新交接（零 LLM；写失败只记状态，不影响判定）
            maybeDraftHandover(session, id, value);
```

</details>

**依据 2 · 源码核查**：[lib/engine.mjs:196-242](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/engine.mjs#L196-L242)

未知读数不动状态，迟滞与档位更新。

<details>
<summary>查看原文（47行）</summary>

```text
export function reduce(state, reading, options = {}) {
  const next = { ...state };
  if (!reading || reading.known !== true || reading.ratio === null) {
    // fail-closed：无分母不动状态机，也不清除既有档位（清除要靠 nextTurn 或回落观测）。
    return { state: next, signal: null };
  }

  const cfg = options.config ?? defaultConfig();
  const ratio = reading.ratio;
  /**
   * P1-4：迟滞的上限必须压到 `warnRatio` 的一半。
   *
   * 若不压：`warnRatio <= hysteresisRatio` 时 `rearmBelow` 会被 `max(0, …)` 夹成 **0**，
   * 而占用率永远 > 0 ⇒ 一旦武装就**永不解除**（`armed` 恒 true，再也收不到下一次 `enter`，
   * 徽标也永远停在那个档位）。`warnRatio` 的 schema 下限是 0.1，所以压一半后回落线
   * 至少是 `0.05 > 0`，一定回得去。
   */
  const hysteresis = Math.min(Math.max(0, cfg.hysteresisRatio ?? 0), cfg.warnRatio / 2);
  // 回落线：warn 以下 hysteresis 才算「真的下来了」。hard 不设独立回落线 —— 回到 warn 区间即可重新武装。
  const rearmBelow = Math.max(0, cfg.warnRatio - hysteresis);

  const wasLevel = state.level;
  next.occupancy = {
    ratio,
    ratioRaw: reading.ratioRaw,
    projectedTokens: reading.projectedTokens,
    contextWindow: reading.contextWindow,
    clampMismatch: reading.clampMismatch,
  };

  // —— 回落即清旗（§10.3 第 4 条）：压缩遮蔽一段后 projectedTokens 会掉下来。
  if (ratio < rearmBelow) {
    if (wasLevel !== 'none') next.compactionDrop = true; // 记录「掉下来过」，供 UI 说明
    next.level = 'none';
    next.armed = false;
  } else if (ratio < cfg.warnRatio) {
    next.compactionDrop = false;
  }

  if (ratio < cfg.warnRatio) return { state: next, signal: null };

  const level = ratio >= cfg.hardRatio ? 'hard' : 'warn';

  if (!next.armed) {
    next.armed = true;
    next.level = level;
    next.cooldown = Math.max(0, cfg.cooldownTurns ?? 0);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1394-1433](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/index.js#L1394-L1433)

turn/end与compaction/end分派，失败不写台账。

<details>
<summary>查看原文（40行）</summary>

```text
  // —— 日志事件分派。**这是唯一能看到 turn/end 与 compaction 的地方**。
  ctx.on('session/event', (session, event) => {
    diag.sessionEvents += 1;
    diag.lastType = event?.type ?? null;
    try {
      refreshConfig();
      if (event?.type === 'turn/end') {
        // ⚠️ 判定**不在这里**（见 `onChanged` 里 P1-2 的定案说明）；这里只推进轮计数、衰减冷却。
        const turnId = sessionIdOf(session);
        if (turnId !== null) engine.endTurn(turnId);
        return;
      }
      if (event?.type === 'compaction/end') {
        /**
         * 压缩是否失败：**只在这一处解析一次**（D2，2026-10-17 复审）。
         *
         * 载荷实况（DSH 0.2.0-rc.2，`dsh-compaction-basic`）：成功事件是
         * `{ compactionId, turn, sourceCommandId? }` —— **根本没有 `error` 键**；
         * 失败才追加 `error: errorChain(error)`，而 `errorChain` 返回的是**字符串**
         * （`String(current)` / `current.message`）。
         *
         * 历史 bug：这里写的是 `event.data?.error !== true`，字符串 `!== true` 恒为 `true`
         * ⇒ **失败路径与成功路径走完全相同的分支**（失败压缩也置标记、也写压缩前快照）；
         * 而紧邻的上一行却用 `Boolean(event.data?.error)`（对字符串是正确的）—— 同一段两套判据。
         *
         * 现在统一成「键在不在」的真值判断：`undefined` / `null` 视为成功，
         * 其余任何值（字符串、对象、布尔）一律视为失败。
         * 注意**不能**用 `Boolean(data?.error)`：`error: ''` 是可能出现的空消息，
         * 布尔化会把它误判成成功。
         */
        const failed = event.data?.error !== undefined && event.data?.error !== null;
        const sid = sessionIdOf(session);
        // v0.7.1（审查 #7）：无 id 时不许写压缩账（那是**写盘**）—— 在 noteCompaction 之前返回。
        if (sid === null) return;
        // 载荷解析**只在这一处**（上面那段注释）；标记本身折进状态里（`pendingCompaction`），
        // 失败时清掉 —— 失败/异常结束的压缩并没有真的把水位压下来，不该抑制下一次提示。
        engine.noteCompaction(sid, failed);
        // v0.5.0：平台压缩后，压缩前的读数就查不到了 —— 这里追加一行「压缩账」
        // （只对**真的压过**的那次写；失败路径不落盘，那是没走完的压缩，写它没有信息量）。
        if (!failed) writeLedgerRow(session, sid, event);
```

</details>

**依据 4 · 源码核查**：[lib/handover.mjs:708-755](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/handover.mjs#L708-L755)

统一队列、结构检查与原子替换。

<details>
<summary>查看原文（48行）</summary>

```text
export async function updateHandoverFile({ file, apply }) {
  if (typeof file !== 'string' || file === '') {
    return { status: 'error', path: null, bytes: 0, error: 'no-cwd' };
  }
  // 同一文件上的所有写入串行执行（自动草稿、手动 /draft、压缩账都走这里）
  return enqueueFileWrite(file, () => updateHandoverFileOnce({ file, apply }));
}

async function updateHandoverFileOnce({ file, apply }) {
  const name = basename(file);
  try {
    let existing = null;
    try {
      existing = await readFile(file, 'utf8');
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        return { status: 'error', path: name, bytes: 0, error: String(error?.code ?? error?.message ?? error) };
      }
    }

    if (existing === null) {
      // 新文件：只允许落在**已存在**的目录里（不做 mass-mkdir）
      try {
        const dir = await lstat(dirname(file));
        if (!dir.isDirectory()) return { status: 'error', path: name, bytes: 0, error: 'no-parent-dir' };
      } catch {
        return { status: 'error', path: name, bytes: 0, error: 'no-parent-dir' };
      }
    } else {
      const st = await lstat(file);
      if (st.isSymbolicLink()) return { status: 'error', path: name, bytes: 0, error: 'symlink' };
      if (!TEXT_EXT.has(extname(file).toLowerCase())) {
        return { status: 'error', path: name, bytes: 0, error: 'foreign-file' };
      }
    }

    const { text, action, seq } = apply(existing ?? '');
    // 结构不认（缺 end、块被手工改坏）⇒ 不写盘，把原因交给调用方记状态。宁可不写，不可吞正文。
    if (action === 'broken-block') return { status: 'error', path: name, bytes: 0, error: 'broken-block' };
    if (action === 'unchanged' || text === (existing ?? '')) {
      return { status: 'unchanged', path: name, bytes: Buffer.byteLength(existing ?? '', 'utf8'), error: null, seq: seq ?? null };
    }
    // ⚠️ 临时名**必须唯一**（P1-3）：固定名在并发下会让先 `rename` 的一方把别人的内容搬走，
    //    第二个 `rename` 抛 ENOENT —— 日志报"写失败"，而文件其实已经被改过（排查的人会看错方向）。
    const tmp = `${file}.${process.pid}.${++tmpSeq}.dsh-context-guard.tmp`;
    await writeFile(tmp, text, { encoding: 'utf8', mode: 0o600 });
    try {
      await rename(tmp, file);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对原生压缩和手工交接，具体增加了什么？

**研究主题：**贡献与相对优势

#### 完整回答

已有增量是把原生投影变成读者可操作的收尾界面和持久机器事实，在压缩后仍能看见之前记录的占用、费用与文件线索。原生压缩负责上下文处理，token-meter负责读数；本插件的贡献是阈值提示、草稿与台账组织，不能把上游计量或压缩机制算作原创。相对手工文档，它自动更新机器事实并保留人工区域，减少重复摘抄；人工结论、失败原因和未来计划仍须人或旧会话另写。

无新增模型工具、prompt和请求支持“插件本身不增加模型上下文”这一狭义判断，不能支持总边际成本恰好为零。作者单机费用分析可能说明一个环境中的长会话形态，不是该插件降低总体花费和任务损失的因果证据。换会话会带来解释与重建成本，提醒阈值是否合适应按任务判断。

#### 证据与依据

**依据 1 · 源码核查**：[lib/policy.mjs:1-17](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/policy.mjs#L1-L17)

纯策略从官方读数作决定，标明上游归属与共享来源。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * dsh-context-guard · 纯策略（零依赖，host 半边与 client 半边共用一份）
 *
 * 这里只做「拿官方算好的数字 → 一个提示决策」这一件事，不碰任何 cordis / React / DOM：
 *   - 输入：`contextPressure` projection（`projectedTokens` / `contextWindow`）
 *   - 输出：`{ state, signal }`，signal 只在本轮**跨越**档位的那一刻非 null（边沿触发）
 *
 * 为什么必须是纯函数：§10.2 第 3 条要求这个插件的上下文税 = 0（不注册 model-facing 工具、
 * 不注入任何 prompt 段落）。纯函数可以在真机之外被完整覆盖，装进运行时之前就能证明
 * 「双档 + 迟滞 + 冷却 + compaction 回落 + fail-closed」五条都对。
 *
 * 本文件是 client 半边 `lib/client.js` 里内嵌那段策略的**唯一来源**：
 * `scripts/build-client.mjs` 把本文件（连同 `lib/i18n.mjs`）去掉 import/export 后注入 client 的
 * factory，`test/client-sync.test.mjs` 逐字节核对，所以不存在「两边各写一份、慢慢漂移」。
 *
 * ⚠️ 允许的唯一 import 是 `./i18n.mjs`（文案表，同样会被内联进同一个作用域）—— 见 build 脚本的
 * `SHARED_MODULES`。除此之外本文件必须保持零依赖。
```

</details>

**依据 2 · 源码核查**：[lib/handover.mjs:573-595](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/handover.mjs#L573-L595)

人工区域检测与读取接口，支持机器/人工分工。

<details>
<summary>查看原文（23行）</summary>

```text
export function isTodoFilled(text) {
  const region = oldTodoRegion(typeof text === 'string' ? text : '');
  if (region === null) return false;
  return region
    .split('\n')
    .map((line) => line.trim())
    .some((line) => line !== '' && !/^-[ ]*\[[ xX]\][ ]*.*[：:]$/.test(line) && !/^-[ ]*\[[ xX]\][ ]*.*:$/.test(line));
}

/** 只看**指定会话那一块**的待补区（避免读到文件里别的会话的块）。 */
export function todoFilledIn(text, sessionId) {
  const source = typeof text === 'string' ? text : '';
  const start = source.indexOf(beginMarker(sessionId));
  if (start < 0) return false;
  const endIdx = source.indexOf(endMarker, start);
  return isTodoFilled(source.slice(start, endIdx < 0 ? source.length : endIdx));
}

/**
 * 从磁盘判断该会话的待补是否已填。读不到文件 ⇒ `null`（**不知道**，不是"没填"）。
 * 宿主路由用它把"结论还在不在"变成状态面上的一个字段，而不是靠人记。
 */
export async function readTodoFilled(file, sessionId) {
```

</details>

**依据 3 · 作者声明**：[README.md:45-64](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/README.md#L45-L64)

作者单机测量范围，不能替代独立对照。

<details>
<summary>查看原文（20行）</summary>

```text
### The problem is measurable

Cost ≈ (average prompt size) × (number of calls) × (unit price). A long session pushes the first two factors up
**at the same time**, and the unit price itself rises with occupancy. Measured against the ledger of the machine
this plugin was calibrated on (its local session-projection cache: **84 sessions / 14 days**, ¥252.29
self-reported) and the official DeepSeek pricing table:

| Measurement | Value |
|---|---|
| Self-check (price table × `contextTimeline.cost`, against the ledger total) | ¥254.29 vs ¥252.29 ⇒ **0.8% deviation**; per-request rows cover 85.4% of the total |
| Unit price by occupancy | **¥0.011/call** at 0–10% → **¥0.045/call** at 70–80% (**4.2×**) |
| Where the historical spend sits | calls at **≥40%** occupancy: **37.4%** of spend · at **≥60%**: **20.0%** |
| Session peaks | Observed **75/75 sessions never exceed ~80%**; the real point comes from the formula (≈ **67.8%** on this machine's deepseek-flash) |
| Interruption cost, if the line is drawn at 40% / 50% / 60% | **0.78 / 0.57 / 0.50** prompts per day |

And one real session, from the very repository this plugin was built in: **584 calls, 274M tokens, ¥31.66 — of
which 98.6% was re-reading context and 0.17% was model output.** That is the failure shape being addressed here:
no crash, no error message, just an invoice.

### Why this guard is the cheap half of the trade
```

</details>

#### 缺口

- 没有同任务继续长会话、原生压缩和人工/插件交接的效果对照。
  **影响：**不能证明提醒带来净节省或任务质量提升。
  **进一步探讨：**可对相同任务记录总费用、交接人时、迁移后遗漏和合格交付率。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 默认写盘与估计压缩点有哪些关键限制？

**研究主题：**缺陷与关键质疑

#### 完整回答

最影响采用的是机器事实会把会话标题、路径和问答片段带进工作目录。handoverOnWarn默认true，关闭它仅关闭草稿；成功compaction仍独立写台账，不能把该开关解释成完全不写文件。路径允许用户配置绝对位置，属于配置者权限而不是工作区沙箱；现有目标符号链接被拒，缺父目录/非文本文件受拒，但父链、检查与rename之间的竞态以及跨进程竞争没有由当前进程内队列完全解决。均是静态边界，未作竞态复现。

状态路由没有插件级认证，依赖DSH web访问控制；隐藏绝对路径、no-store和无CORS不等于允许公开暴露。压缩百分比优先尝试真实配置，否则使用默认政策推算，必须保留估计来源。台账还把eventId和sessionId清洗缩到8字符，用短event值去重；不同完整ID共享前缀时可能被误当重复。队列、原子rename和记录提示有助于减少意外，但不能把“幂等”理解为跨所有进程和ID的严格保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:577-625](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/index.js#L577-L625)

路由继承宿主访问控制且返回状态，未做独立认证。

<details>
<summary>查看原文（49行）</summary>

```text
  ctx.inject(['webServer'], (webCtx) => {
    const server = webCtx.webServer;
    if (server === undefined || typeof server.register !== 'function') {
      warn(bootT()('log.web.noRegister', { name }));
      return;
    }
    webCtx.effect(
      () =>
        server.register({
          kind: 'exact',
          path: STATE_ROUTE,
          handler: (_req, res) => {            try {
              // 先刷新：浏览器半边读到的必须是**当前**设置（设置页改完刷新页面就该变）
              const live = refreshConfig();
              const payload = {
                plugin: name,
                at: Date.now(),
                // ⚠️ 这条路由**无认证**（宿主 webServer 的既有访问控制之外，插件不做校验）⇒ 绝不回本机绝对路径。
                config: { ...live, handoverPath: publicPath(live.handoverPath) },
                recent: engine.recent(10),
                // v0.6.5：压缩点的**输入**（窗口/预留/路由/配置态）——排障时先看这一块
                compact: typeof engine.debugCompact === 'function' ? engine.debugCompact(5) : undefined,
                // v0.6.6：压缩服务可读性（absent / no-config / config / bad-config / error:…）
                compaction: compactionProbe(),
                // v0.6.9：事件流还在不在（真机排障：重启后一条事件都没收到时先看这里）
                diag: { ...diag },
                // v0.5.0：`push` / `trend` 已删除；`ledger` 是记录工具唯一的命门（写失败必须可见）。
                ledger: {
                  written: ledgerState.written,
                  failed: ledgerState.failed,
                  unchanged: ledgerState.unchanged,
                  last: ledgerState.last,
                },
                handover: {
                  enabled: live.handoverOnWarn === true,
                  path: publicPath(live.handoverPath),
                  refreshPercent: live.handoverRefreshPercent,
                  written: draftState.written,
                  failed: draftState.failed,
                  skipped: draftState.skipped,
                  last: draftState.last,
                  history: draftState.history.slice(-3).reverse(),
                },
              };
              const body = JSON.stringify(payload);
              res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'no-store',
                'Content-Length': Buffer.byteLength(body),
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1394-1433](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/index.js#L1394-L1433)

压缩台账与草稿开关没有同一门控。

<details>
<summary>查看原文（40行）</summary>

```text
  // —— 日志事件分派。**这是唯一能看到 turn/end 与 compaction 的地方**。
  ctx.on('session/event', (session, event) => {
    diag.sessionEvents += 1;
    diag.lastType = event?.type ?? null;
    try {
      refreshConfig();
      if (event?.type === 'turn/end') {
        // ⚠️ 判定**不在这里**（见 `onChanged` 里 P1-2 的定案说明）；这里只推进轮计数、衰减冷却。
        const turnId = sessionIdOf(session);
        if (turnId !== null) engine.endTurn(turnId);
        return;
      }
      if (event?.type === 'compaction/end') {
        /**
         * 压缩是否失败：**只在这一处解析一次**（D2，2026-10-17 复审）。
         *
         * 载荷实况（DSH 0.2.0-rc.2，`dsh-compaction-basic`）：成功事件是
         * `{ compactionId, turn, sourceCommandId? }` —— **根本没有 `error` 键**；
         * 失败才追加 `error: errorChain(error)`，而 `errorChain` 返回的是**字符串**
         * （`String(current)` / `current.message`）。
         *
         * 历史 bug：这里写的是 `event.data?.error !== true`，字符串 `!== true` 恒为 `true`
         * ⇒ **失败路径与成功路径走完全相同的分支**（失败压缩也置标记、也写压缩前快照）；
         * 而紧邻的上一行却用 `Boolean(event.data?.error)`（对字符串是正确的）—— 同一段两套判据。
         *
         * 现在统一成「键在不在」的真值判断：`undefined` / `null` 视为成功，
         * 其余任何值（字符串、对象、布尔）一律视为失败。
         * 注意**不能**用 `Boolean(data?.error)`：`error: ''` 是可能出现的空消息，
         * 布尔化会把它误判成成功。
         */
        const failed = event.data?.error !== undefined && event.data?.error !== null;
        const sid = sessionIdOf(session);
        // v0.7.1（审查 #7）：无 id 时不许写压缩账（那是**写盘**）—— 在 noteCompaction 之前返回。
        if (sid === null) return;
        // 载荷解析**只在这一处**（上面那段注释）；标记本身折进状态里（`pendingCompaction`），
        // 失败时清掉 —— 失败/异常结束的压缩并没有真的把水位压下来，不该抑制下一次提示。
        engine.noteCompaction(sid, failed);
        // v0.5.0：平台压缩后，压缩前的读数就查不到了 —— 这里追加一行「压缩账」
        // （只对**真的压过**的那次写；失败路径不落盘，那是没走完的压缩，写它没有信息量）。
        if (!failed) writeLedgerRow(session, sid, event);
```

</details>

**依据 3 · 源码核查**：[lib/handover.mjs:623-632](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/handover.mjs#L623-L632)

绝对/相对配置路径及文本扩展限制。

<details>
<summary>查看原文（10行）</summary>

```text
export function resolveHandoverPath(cwd, configured) {
  if (typeof configured !== 'string' || configured.trim() === '') return null;
  const p = configured.trim();
  if (hasRoot(p)) return p;
  if (typeof cwd !== 'string' || cwd === '') return null;
  return join(cwd, p);
}

/** 目标**已存在**时允许改写的扩展名（防止 `handoverPath` 手滑指到 `.json` / `.yml` / `.gitignore` 之类）。 */
const TEXT_EXT = new Set(['', '.md', '.markdown', '.mdx', '.txt', '.rst', '.adoc']);
```

</details>

**依据 4 · 源码核查**：[lib/handover.mjs:517-544](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/handover.mjs#L517-L544)

短event/session键参与去重和淘汰。

<details>
<summary>查看原文（28行）</summary>

```text
export function upsertLedgerRow(existingText, entry, { locale = 'zh' } = {}) {
  const text = typeof existingText === 'string' ? existingText : '';
  const t = makeT(locale);
  const start = text.indexOf(LEDGER_BEGIN);
  if (start < 0) {
    const block = `${renderLedgerHeader(t)}\n${renderLedgerRow(t, entry, 1)}\n${LEDGER_END}`;
    const glue = text === '' ? '' : text.endsWith('\n') ? '\n' : '\n\n';
    return { text: `${text}${glue}${block}\n`, action: 'appended', seq: 1 };
  }
  const endIdx = text.indexOf(LEDGER_END, start + LEDGER_BEGIN.length);
  // ⚠️ 只有 begin 没有 end ⇒ 说明文件被人手工改坏。**绝不**把 begin 之后整段当账本写，
  //    那会吞掉后面的正文（§19.5 的真实事故）。宁可不写。
  if (endIdx < 0) return { text, action: 'broken-block' };
  const inner = text.slice(start + LEDGER_BEGIN.length, endIdx);
  const rows = ledgerRowsOf(inner);
  const event = typeof entry.eventId === 'string' ? scrubExternal(entry.eventId, 8) : '';
  if (event !== '' && rows.some((row) => row.event === event)) {
    const existing = rows.find((row) => row.event === event);
    return { text, action: 'unchanged', seq: existing ? existing.seq : null };
  }

  const sessionKey = scrubExternal(String(entry.sessionId ?? ''), 8);
  const fresh = { seq: 0, at: entry.at, session: sessionKey, peak: '', size: '', cost: '', files: '', event, _fresh: true };
  rows.push(fresh);
  // 上限淘汰：每会话最多 N 行、全表最多 M 行；单次写入最多淘汰一行（避免一次触发删一堆）。
  const perSession = rows.filter((row) => row.session === sessionKey);
  if (perSession.length > LEDGER_MAX_PER_SESSION) rows.splice(rows.indexOf(perSession[0]), 1);
  else if (rows.length > LEDGER_MAX_ROWS) rows.splice(0, 1);
```

</details>

**依据 5 · 源码核查**：[lib/engine.mjs:470-502](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/engine.mjs#L470-L502)

参数来源和公式展示不能当精确预测。

<details>
<summary>查看原文（33行）</summary>

```text
    const ratio = Number.isFinite(s?.occupancy?.ratio) ? s.occupancy.ratio : null;
    const enabled = cfg?.enabled !== false;
    const warnRatio = Number.isFinite(cfg?.warnRatio) ? cfg.warnRatio : null;
    const hardRatio = Number.isFinite(cfg?.hardRatio) ? cfg.hardRatio : null;
    /**
     * v0.6.2：压缩点从「默认常量」升级为「**优先读 DSH 解析后的配置**」。
     * v0.6.8：按**会话**取（有的机器上服务在 agent 的 scoped ctx 里，只有拿到 sessionId 才够得着）。
     */
    let compactionCfg = null;
    try {
      if (typeof deps.compactionConfig === 'function') compactionCfg = deps.compactionConfig(sessionId) ?? null;
    } catch {
      compactionCfg = null;
    }
    const policy = resolveCompactPolicy(compactionCfg, route);
    const compactPercent = autoCompactPercent(s, reserve, policy);
    /**
     * v0.7.0（审查 #3）：`basis` **只描述参数来源**，不再因为「百分比算不出来」而变成 `none`。
     *
     * 旧实现把两种情况折叠成 `none`：①真的没有参数；②参数齐全、只是宿主此刻没有窗口。
     * ②里客户端用实时读数**算得出**数字，却被 `none` 拦住 tooltip，而 banner 又因为
     * `compactPercent` 有值照写 —— 同一个 basis，两处相反。现在「给不给数字」只由
     * `compactPercent === null` 决定（调用方本来就有 `typeof number` 判断）。
     */
    const compactBasis = policy.auto === false ? 'off' : policy.basis;
    /**
     * v0.6.10（真机：宿主缓存的窗口落后于客户端读数，压缩点偏 ~1.5pp）：
     * 把**算这个数用的三个参数**一起下发，让客户端可以用它自己那份实时读数重算 ——
     * 宿主仍是参数与档位的唯一真源，客户端只做一次纯算术。三项都齐全才给。
     */
    const compactRatio = policy.auto !== false && Number.isFinite(policy.ratio) ? policy.ratio : null;
    const compactHeadroom = policy.auto !== false && Number.isFinite(policy.headroom) ? policy.headroom : null;
    const compactReserve = Number.isFinite(reserve) ? reserve : null;
```

</details>

#### 缺口

- 多进程同时写同一HANDOVER及同前缀事件ID的表现未复现。
  **影响：**可能导致丢块或错误去重，不能作完整审计台账。
  **进一步探讨：**可用两个独立进程写同一文件，并构造相同前8字符的不同事件，核对完整行集合。
- 自定义压缩政策和宿主不可读配置下估计值偏差未知。
  **影响：**提醒是否足够早不能只看展示数字。
  **进一步探讨：**可比对固定宿主实际政策、输出预留与压缩事件，按来源标记估计误差。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖与操作流程如何影响启动和恢复？

**研究主题：**依赖、兼容与流程

#### 完整回答

包0.7.5要求Node ^22.19.0或>=24、指定DSH版本区间和schemastery peer。入口采用软注入是为了让缺少投影/浏览器服务时不把插件纤维永远挂起，但“加载未失败”不等于提醒有效。token-meter投影、会话事件、webServer和client bundle分别决定计算、台账和UI，缺任一会退化。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 包声明的Node/DSH及schemastery | 启动必需 | 配置、宿主和客户端契约 | 不承诺版本外兼容 |
| sessionProjections/contextPressure | 读数必需 | 占用率与机器事实来源 | 未知读数不推进状态 |
| session/event与成功压缩事件 | 台账必需 | 轮计数及压缩记录 | 事件缺失不能补造记录 |
| webServer和client挂载 | UI/手动动作必需 | 状态、徽标和draft路由 | host日志不等于用户见到提醒 |
| 可写且知情选择的交接路径 | 写入必需 | 保存草稿与台账 | 错误只记状态，不保证已保存 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者固定scope包名，明确路径、敏感性及Git忽略 | 不误装无scope同名包 |
| 加载 | 安装后重启宿主并刷新客户端 | 实际读数和参数来源可见 |
| 收尾 | 读者核对机器事实，补人工结论再迁移 | 新会话可按交接完成已知任务 |
| 恢复/退出 | 查failed状态和完整文件，禁用后处理已有敏感文档 | 不把禁用草稿当停写台账，不自动删除人工信息 |

本轮没有安装或挂载操作。路径和数据分享范围应在采用前确定，不能让默认草稿意外进入提交。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:37-49](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/package.json#L37-L49)

client声明、peer与引擎版本。

<details>
<summary>查看原文（13行）</summary>

```text
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": []
    }
  },
  "peerDependencies": {
    "@deepseek-ai/schemastery": "*"
  },
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.1.6-alpha.2 <0.2.0 || >=0.2.0-0 <0.3.0-0"
```

</details>

**依据 2 · 源码核查**：[lib/engine.mjs:196-201](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/engine.mjs#L196-L201)

未知读数不推进状态。

```text
export function reduce(state, reading, options = {}) {
  const next = { ...state };
  if (!reading || reading.known !== true || reading.ratio === null) {
    // fail-closed：无分母不动状态机，也不清除既有档位（清除要靠 nextTurn 或回落观测）。
    return { state: next, signal: null };
  }
```

**依据 3 · 源码核查**：[lib/index.js:1057-1071](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/index.js#L1057-L1071)

手动起草先加pending并finally释放。

<details>
<summary>查看原文（15行）</summary>

```text
  async function draftNow(sessionId) {
    const live = refreshConfig();
    if (live.handoverOnWarn !== true) return { ok: false, reason: 'disabled' };
    if (draftState.pending.has(sessionId)) return { ok: false, reason: 'busy' };
    /**
     * v0.7.0（审查 #11）：**锁必须在第一个 `await` 之前加**。旧实现在 `probeFiles` 之后才
     * `pending.add`，两次快速点击/两个标签页都能穿过 `busy` 检查各写一次（`busy` 形同不存在）。
     * 现在先占位，所有 early-return 都走 finally 释放。
     */
    draftState.pending.add(sessionId);
    try {
      return await draftNowLocked(sessionId, live);
    } finally {
      draftState.pending.delete(sessionId);
    }
```

</details>

**依据 4 · 作者声明**：[README.md:18-22](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/README.md#L18-L22)

作者强调scope包名区别。

```text

> ⚠️ **Do not run `npm i dsh-context-guard`** — that unscoped name is a **third party's** package
> (by `greenlv`). This plugin's name is scoped: **`@2jumpsina/dsh-context-guard`**, published on npm
> (see [Install](#install)).

```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 按合格交接计量，成本与效果已知到哪里？

**研究主题：**效果与总成本

#### 完整回答

计量单位应是一次收尾迁移后继续正确交付的任务。插件不新增模型调用，但计算状态、聚合素材、读取文件存在性和写盘均使用资源；人工还需审查预览是否敏感、补结论、验证迁移后约束是否保持。把机器事实写出只是局部活动，不等于交接成功。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、包与路径资源，增量金额未知 | 版本/读数检查、配置阈值与敏感文件策略 | 没有部署耗时基准 |
| 持续使用 | 内存状态、文件探测、草稿/台账写入 | 理解阈值、核对事实、补结论和新会话交接 | 模型上下文不增不代表总成本0 |
| 失败恢复 | 重写与人工恢复文档、任务重建 | 排查丢块/权限/未知读数、还原人工区 | 未知恢复时间和任务遗漏代价 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 提早收尾线索 | 已有阈值与展示/草稿链 | 阈值是否匹配具体任务 |
| 保留机器事实 | 标记块与压缩台账实际实现 | 跨进程和完整历史保真 |
| 降低长期费用 | 可促成更早迁移而不新增模型请求 | 净费用、人时和任务质量是否改善 |

作者费用样本与价格表相关表述仅作作者报告，当前不额外采用时变价格推算收益。比较必须把重新解释上下文、误迁移和失败重做成本算进去。

#### 证据与依据

**依据 1 · 源码核查**：[lib/policy.mjs:95-120](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/policy.mjs#L95-L120)

阈值、刷新步进和材料数量控制。

<details>
<summary>查看原文（26行）</summary>

```text
export function defaultConfig(overrides = {}) {
  return {
    enabled: true,
    // 用**官方定价**对「占用率 → 每次调用成本」曲线做过标定后，从 0.6 / 0.8 下调（见 README「阈值与设计取舍」）：
    //   · 观测到的会话峰值从未超过 ~80%（平台自身会在 ~80% 处 compaction）⇒ `hardRatio` 必须明显早于那一刻，
    //     否则 `respectCompaction` 会把提示消音，hard 档可能永远不出声；
    //   · 每次调用的成本随占用率近似线性上升（高档位约是空会话的数倍），因此越晚收尾越贵。
    warnRatio: 0.45,
    hardRatio: 0.6,
    hysteresisRatio: 0.05,
    cooldownTurns: 5,
    onResume: true,
    respectCompaction: true,
    // —— v0.7.2：`crossSessionTrend` / `trendWindowHours` / `trendEscalateAt` 与
    //    `pushChannel` / `pushMinLevel` / `pushCooldownMinutes` **已从默认值里删除**。
    //    行为早在 v0.5.0 就删了；旧 profile 里残留的键在非 strict 解析下会被 `merge`
    //    （schemastery `index.mjs:518-527`），**不会**让插件 init 失败 —— 所以「删键会起不来」
    //    那个前提是错的，键可以安全退场。
    // —— 自动交接草稿（2026-09-29 新增）。跨过 warnRatio 时由**宿主半边**零 LLM 起草一块机器事实
    //    （会话/水位/花费/改过的文件/最近几轮摘要），叙述留给 agent；只读已算好的投影 ⇒ 上下文税仍是 0。
    //    默认开：这是「一个任务一个会话」的落地动作 —— 45% 开始起草，60% 换会话时交接已经在文件里。
    handoverOnWarn: true,
    handoverPath: 'HANDOVER.md',
    handoverRefreshPercent: 5,
    handoverTurns: 6,
    handoverFiles: 12,
```

</details>

**依据 2 · 源码核查**：[lib/handover.mjs:171-194](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/handover.mjs#L171-L194)

文件探测有界且可能unverified。

<details>
<summary>查看原文（24行）</summary>

```text
export async function probeFiles(paths, cwd, { limit = 12, timeoutMs = 150 } = {}) {
  const out = new Map();
  if (!Array.isArray(paths) || paths.length === 0) return out;
  const root = typeof cwd === 'string' && cwd !== '' ? safeRealpath(cwd) : null;
  for (const raw of paths.slice(0, limit)) {
    const p = typeof raw === 'string' ? raw : '';
    if (p === '') {
      out.set(p, { state: 'unverified', reason: 'empty' });
      continue;
    }
    // UNC（\\server\share）与 //server/share：不 stat，直接「核不了」——避免卡住写盘队列。
    if (/^[\\/]{2}/.test(p)) {
      out.set(p, { state: 'unverified', reason: 'remote' });
      continue;
    }
    if (root === null && !isAbsolute(p)) {
      out.set(p, { state: 'unverified', reason: 'no-cwd' });
      continue;
    }
    const abs = isAbsolute(p) ? p : join(root ?? cwd, p);
    try {
      out.set(p, await withTimeout(checkOne(abs, root), timeoutMs));
    } catch (error) {
      out.set(p, { state: 'unverified', reason: error?.code === 'TIMEOUT' ? 'timeout' : 'error' });
```

</details>

**依据 3 · 源码核查**：[lib/handover.mjs:744-770](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/handover.mjs#L744-L770)

写入和清理过程产生资源与失败恢复成本。

<details>
<summary>查看原文（27行）</summary>

```text
    const { text, action, seq } = apply(existing ?? '');
    // 结构不认（缺 end、块被手工改坏）⇒ 不写盘，把原因交给调用方记状态。宁可不写，不可吞正文。
    if (action === 'broken-block') return { status: 'error', path: name, bytes: 0, error: 'broken-block' };
    if (action === 'unchanged' || text === (existing ?? '')) {
      return { status: 'unchanged', path: name, bytes: Buffer.byteLength(existing ?? '', 'utf8'), error: null, seq: seq ?? null };
    }
    // ⚠️ 临时名**必须唯一**（P1-3）：固定名在并发下会让先 `rename` 的一方把别人的内容搬走，
    //    第二个 `rename` 抛 ENOENT —— 日志报"写失败"，而文件其实已经被改过（排查的人会看错方向）。
    const tmp = `${file}.${process.pid}.${++tmpSeq}.dsh-context-guard.tmp`;
    await writeFile(tmp, text, { encoding: 'utf8', mode: 0o600 });
    try {
      await rename(tmp, file);
    } catch (error) {
      /**
       * v0.7.0（审查 #21）：rename 失败（Windows 上杀软/编辑器锁文件很常见）时，
       * 临时文件会留在用户仓库里，每失败一次多一个。这里尽力清理，再抛回原因。
       */
      try {
        await unlink(tmp);
      } catch {
        /* 清不掉就算了：不能因为清理失败掩盖真正的写入错误 */
      }
      throw error;
    }
    return { status: action, path: name, bytes: Buffer.byteLength(text, 'utf8'), error: null, seq: seq ?? null };
  } catch (error) {
    return { status: 'error', path: name, bytes: 0, error: String(error?.code ?? error?.message ?? error) };
```

</details>

#### 缺口

- 缺少继续长会话与迁移策略的完整费用、人时及正确交付对照。
  **影响：**不能据无模型调用宣称采用总成本为零或必然节约。
  **进一步探讨：**可按相同任务记录完整账单、交接耗时、遗漏约束与重做次数。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些工程设计可复用，怎样检验新的交接方向？

**研究主题：**工程质量与复用、新假设与验证

#### 完整回答

值得借鉴的是host/client共用纯策略，volatile配置先解引用，避免同一设置显示值和判定值漂移；草稿、手动动作及台账共用每文件队列，失败不会堵住后续写；标记结构破损时拒写，人工子块单独保留，原子rename减少半截文件。它们依赖稳定标记和单进程所有权，不能自动成为数据库事务。测试存在六会话并发写与重复写断言，本轮只读未运行。

可提出未验证的“交接完整性门槛”假设。在机器事实和人工结论分工上，进一步记录明确目标、未决约束、拒绝方案及逐项来源，再由新会话回答少量可核对问题后显示准备度；目的为防止空模板或近期预览被误当完整交接。增量是交接验收，不是更多总结文本。它需要用户定义关键约束，若用模型检查会增加调用，与当前零新增请求取舍不同。最小对照可用已知关键约束的多阶段任务，比较原草稿、人工交接和门槛原型的约束保持率、总人时及费用；若不能减少遗漏或投入抵消收益，就不值得引入。

#### 证据与依据

**依据 1 · 源码核查**：[lib/policy.mjs:75-91](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/policy.mjs#L75-L91)

volatile配置摊平。

<details>
<summary>查看原文（17行）</summary>

```text
/** 是不是 cosmokit 的 volatile 引用（照 `@deepseek-ai/cosmokit` 的 `isVolatile` 逐字等价）。 */
export function isVolatileRef(value) {
  return typeof value === 'object' && value !== null && VOLATILE_WRITE in value;
}

/**
 * 把 loader 交给插件的配置摊平成普通值（逐字段 `.get()`）。
 * 对普通对象（单测、client 收到的 JSON）是恒等变换，所以两边可以共用同一份。
 */
export function plainConfig(raw) {
  if (raw === null || typeof raw !== 'object') return {};
  const out = {};
  for (const key of Object.keys(raw)) {
    const value = raw[key];
    out[key] = isVolatileRef(value) ? value.get() : value;
  }
  return out;
```

</details>

**依据 2 · 源码核查**：[lib/handover.mjs:677-689](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/handover.mjs#L677-L689)

进程内队列及失败后续执行。

<details>
<summary>查看原文（13行）</summary>

```text
function enqueueFileWrite(file, task) {
  const key = queueKey(file);
  const tail = fileWriteQueues.get(key) ?? Promise.resolve();
  const run = tail.then(task, task); // 前一次即使失败，也照样执行这一次
  const settled = run.then(
    () => {},
    () => {},
  );
  fileWriteQueues.set(key, settled);
  settled.finally(() => {
    if (fileWriteQueues.get(key) === settled) fileWriteQueues.delete(key);
  });
  return run;
```

</details>

**依据 3 · 源码核查**：[lib/handover.mjs:744-770](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/handover.mjs#L744-L770)

破块拒写、原子替换与失败回收。

<details>
<summary>查看原文（27行）</summary>

```text
    const { text, action, seq } = apply(existing ?? '');
    // 结构不认（缺 end、块被手工改坏）⇒ 不写盘，把原因交给调用方记状态。宁可不写，不可吞正文。
    if (action === 'broken-block') return { status: 'error', path: name, bytes: 0, error: 'broken-block' };
    if (action === 'unchanged' || text === (existing ?? '')) {
      return { status: 'unchanged', path: name, bytes: Buffer.byteLength(existing ?? '', 'utf8'), error: null, seq: seq ?? null };
    }
    // ⚠️ 临时名**必须唯一**（P1-3）：固定名在并发下会让先 `rename` 的一方把别人的内容搬走，
    //    第二个 `rename` 抛 ENOENT —— 日志报"写失败"，而文件其实已经被改过（排查的人会看错方向）。
    const tmp = `${file}.${process.pid}.${++tmpSeq}.dsh-context-guard.tmp`;
    await writeFile(tmp, text, { encoding: 'utf8', mode: 0o600 });
    try {
      await rename(tmp, file);
    } catch (error) {
      /**
       * v0.7.0（审查 #21）：rename 失败（Windows 上杀软/编辑器锁文件很常见）时，
       * 临时文件会留在用户仓库里，每失败一次多一个。这里尽力清理，再抛回原因。
       */
      try {
        await unlink(tmp);
      } catch {
        /* 清不掉就算了：不能因为清理失败掩盖真正的写入错误 */
      }
      throw error;
    }
    return { status: action, path: name, bytes: Buffer.byteLength(text, 'utf8'), error: null, seq: seq ?? null };
  } catch (error) {
    return { status: 'error', path: name, bytes: 0, error: String(error?.code ?? error?.message ?? error) };
```

</details>

**依据 4 · 源码核查**：[test/concurrency.test.mjs:22-55](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/test/concurrency.test.mjs#L22-L55)

作者并发/幂等静态测试。

<details>
<summary>查看原文（34行）</summary>

```text
test('P1-3 回归：6 个会话并发写同一文件，一个块都不能丢', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'dcg-conc-'));
  const file = join(dir, 'HANDOVER.md');
  const sessions = ['s-a', 's-b', 's-c', 's-d', 's-e', 's-f'];
  try {
    // 全部同时发起（不去 await 中间结果）—— 这正是真机上多会话同时跨阈值的形状
    const results = await Promise.all(
      sessions.map((id) => writeHandoverBlock({ file, sessionId: id, block: blockOf(id) })),
    );
    for (const [i, r] of results.entries()) {
      assert.ok(r.status === 'replaced' || r.status === 'appended', `第 ${i} 次写入应成功，实际 ${r.status}/${r.error}`);
    }
    const text = await readFile(file, 'utf8');
    for (const id of sessions) {
      assert.ok(text.includes(`BODY-${id}`), `会话 ${id} 的块被覆盖丢失了`);
    }
    // 每块都应有配对的 begin / end，别写出半截
    assert.equal((text.match(/dsh-context-guard:begin/g) ?? []).length, sessions.length);
    assert.equal((text.match(/dsh-context-guard:end/g) ?? []).length, sessions.length);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('P1-3：同一会话重复写是幂等的（替换而非追加）', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'dcg-idem-'));
  const file = join(dir, 'HANDOVER.md');
  try {
    const id = 'same-session';
    await writeHandoverBlock({ file, sessionId: id, block: blockOf(id) });
    await writeHandoverBlock({ file, sessionId: id, block: blockOf(id).replace('BODY-', 'BODY2-') });
    const text = await readFile(file, 'utf8');
    assert.equal((text.match(/dsh-context-guard:begin/g) ?? []).length, 1, '同一会话只该留一块');
    assert.ok(text.includes('BODY2-'), '第二次写应生效');
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 谁适合受控试用，停止标准是什么？

**研究主题：**采用判断

#### 完整回答

有长会话和跨会话交接需求、能配置私有路径与检查投影来源的DSH用户可受控试用。先明确草稿和台账两条写入路径，使用非敏感任务与专用工作目录，检查阈值、估计来源、文件内容和人工区保留；机器事实应经人补充约束后再交给新会话。源码级证据支持便利机制，不支持默认持续安装或节费承诺。

若出现未授权内容落盘、Git误提交、同文件人工信息丢失、压缩台账漏行，或提醒让迁移代价超过继续工作的收益，应停用相关路径并核查保留数据。它不适合公开暴露web服务的部署、要求完整审计台账的人或以为handoverOnWarn=false便完全停写的人。采用结论trial，主要限制回指Q04，成本回指Q06。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-37](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/README.md#L31-L37)

默认写盘与敏感预览影响采用。

```text
## ⚠️ It writes to your working directory (read this before installing)

- **On by default** (`handoverOnWarn: true`). When a session's occupancy crosses `warnRatio` (default 45%), the plugin creates/rewrites `handoverPath` (default `HANDOVER.md`) in **that session's working directory**, and then refreshes it every further 5 percentage points.
- What it writes are **machine facts**: session id, title, working directory, occupancy, turn/call counts, **ledger cost**, **the files this session wrote**, **previews of the last few prompts and replies**, plus empty "to be filled in" slots for the agent.
  ⇒ **It may contain sensitive content** (file paths, fragments of your questions and replies), and **it may end up committed by git**.
- Suggestions: add `HANDOVER.md` to your `.gitignore`; or point `handoverPath` at a location **outside any repository**; or simply set `handoverOnWarn: false`.
- Boundaries: a missing parent directory is refused; an existing target that is not a text file (`.json`/`.yml`/…) is refused; a **symlink** pointing elsewhere is refused; writes are atomic (temp file + rename) with tight permissions (`0o600`). Any failure is recorded as status only — it **never affects** the badge, the banner, or the push.
```

**依据 2 · 源码核查**：[lib/index.js:1394-1433](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/index.js#L1394-L1433)

关闭草稿不取消成功压缩台账这一事实必须告知。

<details>
<summary>查看原文（40行）</summary>

```text
  // —— 日志事件分派。**这是唯一能看到 turn/end 与 compaction 的地方**。
  ctx.on('session/event', (session, event) => {
    diag.sessionEvents += 1;
    diag.lastType = event?.type ?? null;
    try {
      refreshConfig();
      if (event?.type === 'turn/end') {
        // ⚠️ 判定**不在这里**（见 `onChanged` 里 P1-2 的定案说明）；这里只推进轮计数、衰减冷却。
        const turnId = sessionIdOf(session);
        if (turnId !== null) engine.endTurn(turnId);
        return;
      }
      if (event?.type === 'compaction/end') {
        /**
         * 压缩是否失败：**只在这一处解析一次**（D2，2026-10-17 复审）。
         *
         * 载荷实况（DSH 0.2.0-rc.2，`dsh-compaction-basic`）：成功事件是
         * `{ compactionId, turn, sourceCommandId? }` —— **根本没有 `error` 键**；
         * 失败才追加 `error: errorChain(error)`，而 `errorChain` 返回的是**字符串**
         * （`String(current)` / `current.message`）。
         *
         * 历史 bug：这里写的是 `event.data?.error !== true`，字符串 `!== true` 恒为 `true`
         * ⇒ **失败路径与成功路径走完全相同的分支**（失败压缩也置标记、也写压缩前快照）；
         * 而紧邻的上一行却用 `Boolean(event.data?.error)`（对字符串是正确的）—— 同一段两套判据。
         *
         * 现在统一成「键在不在」的真值判断：`undefined` / `null` 视为成功，
         * 其余任何值（字符串、对象、布尔）一律视为失败。
         * 注意**不能**用 `Boolean(data?.error)`：`error: ''` 是可能出现的空消息，
         * 布尔化会把它误判成成功。
         */
        const failed = event.data?.error !== undefined && event.data?.error !== null;
        const sid = sessionIdOf(session);
        // v0.7.1（审查 #7）：无 id 时不许写压缩账（那是**写盘**）—— 在 noteCompaction 之前返回。
        if (sid === null) return;
        // 载荷解析**只在这一处**（上面那段注释）；标记本身折进状态里（`pendingCompaction`），
        // 失败时清掉 —— 失败/异常结束的压缩并没有真的把水位压下来，不该抑制下一次提示。
        engine.noteCompaction(sid, failed);
        // v0.5.0：平台压缩后，压缩前的读数就查不到了 —— 这里追加一行「压缩账」
        // （只对**真的压过**的那次写；失败路径不落盘，那是没走完的压缩，写它没有信息量）。
        if (!failed) writeLedgerRow(session, sid, event);
```

</details>

**依据 3 · 源码核查**：[lib/handover.mjs:517-544](https://github.com/2JumpSinA/dsh-context-guard/blob/a889e8c0c8c8b0ff86df2c016bf4da2da2b123fc/lib/handover.mjs#L517-L544)

台账保留/去重边界影响审计用途。

<details>
<summary>查看原文（28行）</summary>

```text
export function upsertLedgerRow(existingText, entry, { locale = 'zh' } = {}) {
  const text = typeof existingText === 'string' ? existingText : '';
  const t = makeT(locale);
  const start = text.indexOf(LEDGER_BEGIN);
  if (start < 0) {
    const block = `${renderLedgerHeader(t)}\n${renderLedgerRow(t, entry, 1)}\n${LEDGER_END}`;
    const glue = text === '' ? '' : text.endsWith('\n') ? '\n' : '\n\n';
    return { text: `${text}${glue}${block}\n`, action: 'appended', seq: 1 };
  }
  const endIdx = text.indexOf(LEDGER_END, start + LEDGER_BEGIN.length);
  // ⚠️ 只有 begin 没有 end ⇒ 说明文件被人手工改坏。**绝不**把 begin 之后整段当账本写，
  //    那会吞掉后面的正文（§19.5 的真实事故）。宁可不写。
  if (endIdx < 0) return { text, action: 'broken-block' };
  const inner = text.slice(start + LEDGER_BEGIN.length, endIdx);
  const rows = ledgerRowsOf(inner);
  const event = typeof entry.eventId === 'string' ? scrubExternal(entry.eventId, 8) : '';
  if (event !== '' && rows.some((row) => row.event === event)) {
    const existing = rows.find((row) => row.event === event);
    return { text, action: 'unchanged', seq: existing ? existing.seq : null };
  }

  const sessionKey = scrubExternal(String(entry.sessionId ?? ''), 8);
  const fresh = { seq: 0, at: entry.at, session: sessionKey, peak: '', size: '', cost: '', files: '', event, _fresh: true };
  rows.push(fresh);
  // 上限淘汰：每会话最多 N 行、全表最多 M 行；单次写入最多淘汰一行（避免一次触发删一堆）。
  const perSession = rows.filter((row) => row.session === sessionKey);
  if (perSession.length > LEDGER_MAX_PER_SESSION) rows.splice(rows.indexOf(perSession[0]), 1);
  else if (rows.length > LEDGER_MAX_ROWS) rows.splice(0, 1);
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
