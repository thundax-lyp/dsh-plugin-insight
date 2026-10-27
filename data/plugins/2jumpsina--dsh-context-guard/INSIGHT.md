# dsh-context-guard

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[9d5719c](https://github.com/2JumpSinA/dsh-context-guard/tree/9d5719c94fe9fdf7385800ba40d3a213fdc24e17)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2JumpSinA/dsh-context-guard) [![npm 30d 1,727](https://img.shields.io/static/v1?label=npm+30d&message=1%2C727&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@2jumpsina/dsh-context-guard) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@2jumpsina/dsh-context-guard)
<!-- END META -->

> **实现功能**：读取上下文压力，在轮后提醒换会话，生成机器事实交接草稿并记录压缩读数。

> **核心亮点**：把上下文水位提示接到实际交接文件，并复用宿主投影避免额外模型请求；机器事实收集不等语义交接完成。[Q01](#research-q01)、[Q02](#research-q02)

> **风险与缺陷**：默认草稿含路径与问答片段，关草稿仍可能写压缩台账；估计水位与进程内队列不能证明最佳阈值或完整审计。[Q03](#research-q03)

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
  - [Q01 · 压力提醒和交接草稿针对谁，与手工交接有何增量？](#detail-section-11)
  - [Q02 · contextPressure、压缩事件与文件队列如何协作？](#detail-section-12)
  - [Q03 · 阈值与压缩台账是否准确，草稿隐私边界是什么？](#detail-section-13)
  - [Q04 · 配置、持久化和用户恢复步骤依赖什么？](#detail-section-14)
  - [Q05 · 合格交接的效果/成本和原子写工程边界如何？](#detail-section-15)
  - [Q06 · 基于交接覆盖率而非压力阈值触发能否减少遗漏，如何采用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合长会话用户提前准备交接；草稿需补任务语义后再换会话。

手动看token并维护交接清单是简单替代；本轮没有以同任务证明更省token或更准。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 水位与提醒 | 提醒收尾/换会话 | 依赖contextPressure，压缩点可为估计 |
| 自动/手动草稿 | 记录机器事实 | 默认写工作目录，需补语义 |
| 压缩台账 | 留存压缩前读数 | 不随草稿关闭而停止，非完整审计 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH及schemastery | 必需 | 插件与配置 | 无法加载 |
| token-meter/contextPressure | 水位功能必需 | 提供占用投影 | 未知时不编数字 |
| 可写既有父目录 | 草稿/台账必需 | 持久交接 | 拒写并记录状态 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 确认投影与保存位置 | 水位有效且隐私可控 |
| 使用 | 长会话轮后查看草稿/提醒 | 文件有机器事实 |
| 交接 | 用户/模型补语义并新会话回读 | 核对目标、状态和下一步 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地文件资源，金额未知 | 确认token-meter、位置与隐私 | 父目录须存在 |
| 持续 | 不额外请求模型，仍有落盘/后续读取 | 补结论、坑和下一步 | 净节时未知 |
| 失败恢复 | 备份与重复写入资源 | 修标记、权限及核对丢块 | 跨进程一致性未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 压力提醒 | 共源阈值/迟滞判定 | 各模型最优阈值 |
| 草稿 | 最近问答和改动事实落盘 | 任务语义完整与续接成功率 |
| 写入 | 队列与原子替换 | 跨进程不丢更新 |

> **思考**：默认草稿含路径与问答片段，关草稿仍可能写压缩台账；估计水位与进程内队列不能证明最佳阈值或完整审计。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把上下文水位提示接到实际交接文件，并复用宿主投影避免额外模型请求；机器事实收集不等语义交接完成。[Q01](#research-q01)、[Q02](#research-q02)

把上下文水位提示接到实际交接文件，并复用宿主投影避免额外模型请求；机器事实收集不等语义交接完成。[Q01](#research-q01)、[Q02](#research-q02)

volatile解引用与共源公式减少显示/判断漂移；唯一临时名、坏块拒写和队列失败隔离有明确价值，仍需跨进程与路径环境验证。[Q02](#research-q02)、[Q05](#research-q05)

<a id="detail-section-5"></a>

### 1.4 主要限制

默认草稿含路径与问答片段，关草稿仍可能写压缩台账；估计水位与进程内队列不能证明最佳阈值或完整审计。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先将草稿放在可控位置并检查敏感内容，核对阈值与实际交接质量后试用；不要把自动草稿视为可直接续接的完整说明。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

投影消费、草稿和防半写机制可由源码核查；阈值最优性、跨进程一致性及续接收益未验证；覆盖检查方向是未验证假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/handover.mjs、lib/policy.mjs、README.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查host入口、共源策略、handover写入及作者说明；未完整验证所有Web路由、客户端和真实模型阈值。
- 下一步：可进一步比较相同任务的手工与压力/覆盖驱动交接，计入草稿整理和后续读回成本。

**分析版本**

- **仓库**：[2JumpSinA/dsh-context-guard](https://github.com/2JumpSinA/dsh-context-guard)
- **版本号**：0.7.7（[固定提交 9d5719c](https://github.com/2JumpSinA/dsh-context-guard/tree/9d5719c94fe9fdf7385800ba40d3a213fdc24e17)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是将压力触发与任务状态覆盖检查结合，以接续合格率、重复动作及总token检验，新增检查成本必须显式计入。[Q06](#research-q06)

可进一步比较相同任务的手工与压力/覆盖驱动交接，计入草稿整理和后续读回成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 911 | — | — | 12771 |
| .js | source | 4 | 4330 | 2981 | 1173 | — |
| .mjs | source | 13 | 4885 | 3433 | 1208 | — |
| .mjs | test | 10 | 2599 | 2001 | 388 | — |
| .mjs | example | 1 | 42 | 25 | 14 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/2JumpSinA/dsh-context-guard/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对压力驱动交接的机制、隐私及合格接续边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 压力提醒和交接草稿针对谁，与手工交接有何增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它针对长会话用户在下一轮请求前发现上下文压力并准备换会话。相比手动看token后复制上下文，增量是轮结束时自动计算档位并把最近问答、改动路径和计量事实写成可续接草稿，叙述和待办仍要人/模型补充。合格交接应让下一会话准确接续目标、状态和未完成事项，机器字段齐全只能降低收集负担，不能证明任务语义无遗漏。作者的上下文税为0限定插件自己不注册模型工具、不注入提示、不发模型请求，不代表人工续接和后续读文档没有token成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/README.md#L5-L15)

作者描述轮后提醒、草稿和不额外调用。

<details>
<summary>查看原文（11行）</summary>

```text
A [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/guide/quickstart) plugin that **tells you to wrap up and start a new session before the session gets too long**.

It consumes the `contextPressure` projection that the official `dsh-token-meter` has already computed, and **after a turn has ended** it speaks up on two thresholds: "write the handoff into a document first, then start a new session." It then helps turn that sentence **into an action** — once the threshold is crossed it drafts a handoff block into the session working directory.

**Context tax = 0**: it registers no model-facing tool, injects no prompt section, and sends no extra request. The host does the arithmetic, the UI does the talking.

> 🆕 **Current release is live on npm `latest` (0.7.x)**: 45% silently drafts the handoff, 60% is the only reminder;
> the compaction point shows up in the badge tooltip and in the banner body (computed live as
> `min(window×0.8, window − reserve − 64K)`, with its source; marked "estimated" when the platform's
> compaction config is unreadable); and the moment the platform compacts, the pre-compaction reading is
> captured into the **compaction ledger** inside `HANDOVER.md`.
```

</details>

**依据 2 · 源码核查**：[lib/handover.mjs:372-394](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/lib/handover.mjs#L372-L394)

草稿仅最近轮次与待补充槽位。

<details>
<summary>查看原文（23行）</summary>

```text
  lines.push(t('handover.turns.heading', { n: turns.length }));
  lines.push('');
  if (turns.length === 0) {
    lines.push(t('handover.turns.none'));
  } else {
    for (const item of turns) {
      lines.push(
        t('handover.turn.line', {
          turn: item.turn ?? '?',
          prompt: item.prompt || '—',
          response: item.response || '—',
        }),
      );
    }
  }
  lines.push('');

  lines.push(t('handover.todo.heading'));
  lines.push(TODO_BEGIN);
  lines.push('');
  lines.push(t('handover.todo.conclusion'));
  lines.push(t('handover.todo.pitfalls'));
  lines.push(t('handover.todo.next'));
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · contextPressure、压缩事件与文件队列如何协作？

**研究主题**：功能与机制

#### 完整回答

host软注入sessionProjections并消费contextPressure；策略与client共源，volatile字段先解引用避免配置显示与实际值漂移。默认45%触发草稿、60%提醒，迟滞防止同档反复响，压缩百分比按窗口、reserve、headroom计算；缺关键参数返回null。压缩日志事件另外记录压缩前读数，草稿和台账通过同目标文件队列串行upsert并原子rename。该队列只属于当前进程，不是跨进程文件锁。

#### 证据与依据

**依据 1 · 源码核查**：[lib/policy.mjs:75-91](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/lib/policy.mjs#L75-L91)

volatile解引用。

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

**依据 2 · 源码核查**：[lib/policy.mjs:95-120](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/lib/policy.mjs#L95-L120)

阈值与草稿默认项。

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

**依据 3 · 源码核查**：[lib/policy.mjs:130-150](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/lib/policy.mjs#L130-L150)

压缩点公式与未知处理。

<details>
<summary>查看原文（21行）</summary>

```text
/**
 * v0.6.12：**压缩点公式的唯一实现**（宿主与浏览器共用这一份，逐字内联进 bundle）。
 *
 *   threshold = floor( min(window × r, window − reserve − headroom) )
 *   percent   = round(threshold / window × 1000) / 10
 *
 * 为什么搬到这里：之前宿主 `engine.mjs` 与客户端 `client-source.js` 各写一遍 ——
 * 正是 P1-5「两处同算法必然漂移」的出生地。现在只留这一份，且可被单测直接覆盖。
 *
 * @param {{r?: number, headroom?: number, reserve?: number, window?: number}} params
 * @returns {number|null} 百分比（保留一位小数）；任何输入不成立就返回 null（绝不编数字）。
 */
export function compactPercentPoint(params) {
  if (params === null || typeof params !== 'object') return null;
  const { r, headroom, reserve } = params;
  const window_ = params.window;
  if (!Number.isFinite(r) || !Number.isFinite(headroom) || !Number.isFinite(reserve)) return null;
  if (!Number.isFinite(window_) || window_ <= 0) return null;
  if (r <= 0 || r > 1 || headroom < 0 || reserve < 0) return null;
  const threshold = Math.floor(Math.min(window_ * r, window_ - reserve - headroom));
  if (!Number.isFinite(threshold) || threshold <= 0) return null;
```

</details>

**依据 4 · 源码核查**：[lib/handover.mjs:650-689](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/lib/handover.mjs#L650-L689)

每文件队列的实际作用域。

<details>
<summary>查看原文（40行）</summary>

```text
/* ── 同一目标文件的串行队列（P1-3）────────────────────────────────────────────
 * 锁的粒度必须与**资源**一致。这里的资源是「一个文件」，不是「一个会话」：
 * 同一 cwd 下所有会话都写同一个 `HANDOVER.md`，而 index.js 里的 `pending` 是按 sessionId 的。
 * 没有这把锁时，「读 → upsert → 写 → rename」跨 await 交错会让**后写者覆盖先写者的块**（永久丢块）。
 * · 按文件名分组排队；
 * · 链条尾部**永不 reject**，否则一次写入失败会把后续所有写入带崩（unhandled rejection）。
 */
const fileWriteQueues = new Map();
let tmpSeq = 0;

/**
 * v0.7.0（审查 #21）：串行队列的键必须**规范化**。
 *
 * 旧实现拿 `file` 原串当键：`D:\proj\HANDOVER.md`（cwd 拼出来的）与 `d:\proj\hAnDoVer.md`
 * （配置里写的绝对路径、Windows 大小写不敏感）是两个键 ⇒ 同一个文件不排队 ⇒
 * 「读 → upsert → 写 → rename」交错时后写者会覆盖先写者的块（P1-3 防丢块的前提被绕过）。
 */
function queueKey(file) {
  const text = String(file ?? '');
  try {
    const resolved = resolve(text);
    return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
  } catch {
    return text;
  }
}

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 阈值与压缩台账是否准确，草稿隐私边界是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

占用率是宿主提供的下一请求投影，平台压缩配置读不到时显示估计，不能把固定45/60阈值当不同模型的最优策略。草稿含路径和问答预览，默认写工作目录，可能被版本控制或共享；关闭handoverOnWarn不等停止所有写盘，因为压缩台账与草稿开关解耦。文本目标lstat拒绝符号链接、限制扩展名并用0600写临时文件，但没有跨进程并发事务，父目录路径别名和竞争也需环境验证。这些是边界，不能据静态路径推断已经发生泄漏。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:31-37](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/README.md#L31-L37)

作者明确敏感片段和git传播风险。

```text
## ⚠️ It writes to your working directory (read this before installing)

- **On by default** (`handoverOnWarn: true`). When a session's occupancy crosses `warnRatio` (default 45%), the plugin creates/rewrites `handoverPath` (default `HANDOVER.md`) in **that session's working directory**, and then refreshes it every further 5 percentage points.
- What it writes are **machine facts**: session id, title, working directory, occupancy, turn/call counts, **ledger cost**, **the files this session wrote**, **previews of the last few prompts and replies**, plus empty "to be filled in" slots for the agent.
  ⇒ **It may contain sensitive content** (file paths, fragments of your questions and replies), and **it may end up committed by git**.
- Suggestions: add `HANDOVER.md` to your `.gitignore`; or point `handoverPath` at a location **outside any repository**; or simply set `handoverOnWarn: false`.
- Boundaries: a missing parent directory is refused; an existing target that is not a text file (`.json`/`.yml`/…) is refused; a **symlink** pointing elsewhere is refused; writes are atomic (temp file + rename) with tight permissions (`0o600`). Any failure is recorded as status only — it **never affects** the badge, the banner, or the push.
```

**依据 2 · 源码核查**：[lib/index.js:979-980](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/lib/index.js#L979-L980)

台账与草稿开关解耦。

```text
   * 唯一结构上不可替代的产出。这里在 `compaction/end` 时把本次压缩前的峰值追加成一行：
   *   · **与 `handoverOnWarn` 解耦**：关掉「自动起草」是关提示，不是关记录；
```

**依据 3 · 源码核查**：[lib/handover.mjs:716-755](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/lib/handover.mjs#L716-L755)

读、检查、upsert和rename存在多个await。

<details>
<summary>查看原文（40行）</summary>

```text
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

#### 缺口

- 不同模型阈值对任务质量和成本的关系缺少同条件结果
  **影响**：不能判断提醒是否过早打断或过晚遗漏
  **进一步探讨**：以相同长任务比较手动交接、不同阈值和后续接续合格率

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配置、持久化和用户恢复步骤依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动依赖兼容DSH及schemastery，压力功能依赖官方token-meter投影；软注入让缺服务不阻止加载，但缺投影就不能提供有效水位。用户选择handoverPath且父目录必须已存在，已有非文本或坏块拒写；错误保留状态，不拖垮提醒。操作上先核对保存位置与敏感信息策略，再调整阈值，草稿生成后补结论/坑/下一步，最后换会话并回读。关闭自动草稿仍要检查压缩台账写盘，退出时手工处理已有文档，不应把卸载当清除历史。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:24-28](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/lib/index.js#L24-L28)

投影依赖和软注入。

```text
 *   - `contextPressure` 这个键属于 **dsh-token-meter**（declaration merging 挂进
 *     `SessionProjectionMap`），token-meter 一卸载键就消失 ⇒ 三个字段全 optional，
 *     一律 fail-closed（policy.readOccupancy 负责）。
 *   - `sessionProjections` **不写进 `inject`**：按官方注释，容忍缺席要用
 *     `ctx.inject(['sessionProjections'], …)`；硬 inject 缺席会让 fiber 停在 PENDING 静默不加载。
```

**依据 2 · 源码核查**：[lib/index.js:197-212](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/lib/index.js#L197-L212)

默认草稿与可配绝对路径。

<details>
<summary>查看原文（16行）</summary>

```text
  handoverOnWarn: Schema.boolean()
    .default(true)
    .description(
      'When the session crosses warnRatio, draft/refresh a block of machine facts in the working directory\u2019s ' +
        'HANDOVER.md (session / occupancy / cost / changed files / last turns). Zero LLM, zero extra requests; ' +
        'the narrative is left to the agent. / ' +
        '跨过 warnRatio 时，自动在工作目录的 HANDOVER.md 里起草/刷新一块「机器事实交接」' +
        '（会话/水位/花费/改过的文件/最近几轮摘要）。零 LLM、零额外请求，叙述留给 agent。',
    )
    .volatile(),
  handoverPath: Schema.string()
    .default('HANDOVER.md')
    .description(
      'Handoff file: relative to the **session working directory**, or an absolute path. / ' +
        '交接文件：相对**会话工作目录**，或写绝对路径。',
    )
```

</details>

**依据 3 · 源码核查**：[lib/handover.mjs:728-748](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/lib/handover.mjs#L728-L748)

父目录、类型与坏块的拒写条件。

<details>
<summary>查看原文（21行）</summary>

```text
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
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 合格交接的效果/成本和原子写工程边界如何？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

成本单位应是一次被下一会话准确接续的任务，不是一次banner出现。首次核对依赖与草稿位置，持续承担文档落盘、人工补全和读回，失败时排查坏块/权限/rename并防止后续覆盖。纯策略、共源公式、按文件队列、唯一临时名和失败后继续队列可复用，移植必须保留标记语法与宿主投影语义。原子rename防半文件，进程内队列防本进程丢块，但不能证明跨进程不丢更新。没有实测合格率、账单和人工时间，零额外请求仅支持局部调用成本边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/handover.mjs:631-645](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/lib/handover.mjs#L631-L645)

源码自己区分原子替换和不丢更新。

<details>
<summary>查看原文（15行）</summary>

```text
/** 目标**已存在**时允许改写的扩展名（防止 `handoverPath` 手滑指到 `.json` / `.yml` / `.gitignore` 之类）。 */
const TEXT_EXT = new Set(['', '.md', '.markdown', '.mdx', '.txt', '.rst', '.adoc']);

/**
 * 落盘（fail-soft）。**任何**异常都变成 `{status:'error'}` 返回，绝不抛。
 *
 * 2026-09-30 按安全审计加固（P1-1）：
 *   · **不建目录**：父目录不存在 ⇒ `error:'no-parent-dir'`（`mkdir -p` 会把手滑的绝对路径一路竣工）；
 *   · **不改写非文本文件**：目标已存在且扩展名不在白名单 ⇒ `error:'foreign-file'`；
 *   · **不跟随符号链接**：目标是链接 ⇒ `error:'symlink'`；
 *   · **原子替换**：同目录临时文件 + `rename` —— 只保证"不会写出半截文件"，
 *     ⚠️ **不保证"不丢更新"**：并发交错下后写者仍会覆盖前写者的块。丢块由
 *     `writeHandoverBlock` 的**按文件串行队列**解决（P1-3，见下方 `enqueueFileWrite`）；
 *   · **权限收紧**：`mode 0o600`（内容含本次改过的文件清单与会话摘要）；
 *   · **只回文件名**：`path` 永远是 `basename`，绝不把本机绝对路径回给状态路由（P1-2）。
```

</details>

**依据 2 · 源码核查**：[lib/handover.mjs:677-689](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/lib/handover.mjs#L677-L689)

队列清理与失败隔离。

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

**依据 3 · 源码核查**：[lib/handover.mjs:744-755](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/lib/handover.mjs#L744-L755)

坏块拒写、唯一临时名与权限。

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

#### 缺口

- 机器草稿对续接正确性、人工补写时间没有独立对照
  **影响**：不能计算净节时或单位合格交接成本
  **进一步探讨**：保存一组交接任务，对照手工清单并盲评下一会话恢复目标和副作用状态

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 基于交接覆盖率而非压力阈值触发能否减少遗漏，如何采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是保留压力作提示信号，再以待办、决策、工作区改动与恢复命令的覆盖检查决定交接是否就绪。它由机器事实与语义槽位分离推导，相对只看水位增加任务验收条件，代价是人工维护或额外模型检查，因而不能再宣称整个扩展零上下文税。用同一长任务比较阈值草稿和覆盖检查草稿，观察缺失状态、重复动作及总token；若增加成本却不提高接续合格率则否定。已有token-meter且愿意管理敏感草稿的人可限定试用，先看写盘再谈节省。

#### 证据与依据

**依据 1 · 源码核查**：[lib/handover.mjs:389-394](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/lib/handover.mjs#L389-L394)

待补充槽位显示机器事实不包含完整语义交接。

```text
  lines.push(t('handover.todo.heading'));
  lines.push(TODO_BEGIN);
  lines.push('');
  lines.push(t('handover.todo.conclusion'));
  lines.push(t('handover.todo.pitfalls'));
  lines.push(t('handover.todo.next'));
```

**依据 2 · 源码核查**：[lib/policy.mjs:113-120](https://github.com/2JumpSinA/dsh-context-guard/blob/9d5719c94fe9fdf7385800ba40d3a213fdc24e17/lib/policy.mjs#L113-L120)

当前触发按压力而非任务覆盖。

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

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
