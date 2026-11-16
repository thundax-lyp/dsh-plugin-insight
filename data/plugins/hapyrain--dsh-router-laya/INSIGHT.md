# dsh-router-laya

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[29624e7](https://github.com/HapyRain/dsh-router-laya/tree/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HapyRain/dsh-router-laya) [![npm 30d 2,558](https://img.shields.io/static/v1?label=npm+30d&message=2%2C558&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-router-laya) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-router-laya)
<!-- END META -->

> **功能**：按任务估计自动推理档位并路由 DSH 模型请求。

> **亮点**：[Q01](#research-q01) 将本地难度估计和档位 route 接入 DSH 请求及输入栏状态。[Q02](#research-q02) 保留 explicit route、manual 开关和 judge fallback，提供一定可控性。

> **主要限制**：[Q02](#research-q02) fallback low 对高难任务可能降低预算；[Q03](#research-q03) 分类服务常驻、版本兼容和运行成本未实测。

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
  - [Q01 · 自动思考档路由要替用户解决什么任务，当前实现增加了什么？](#detail-section-11)
  - [Q02 · 固定源码怎样决定路由，失败和显式模型选择如何处理？](#detail-section-12)
  - [Q03 · 本地判定服务、模型权重和 DSH client 接线带来哪些成本与边界？](#detail-section-13)
  - [Q04 · 怎样验证自动档位确实改善成本/质量而不压低难题表现？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常在简单问答和复杂任务之间切换推理档、希望减少手工调节的 DSH 用户。

由用户手动选择模型思考预算或统一使用高档；本轮没有基于相同任务对照质量、时间或 token。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 自动推理档 | 由任务判定选择可用 provider、model 和 effort | 依赖 judge 端点、当前 profile 和目标模型支持 |
| 同轮缓存和回退 | 保持一轮内路由一致并处理 judge 失败 | fallback 档也须可用，不可用时保留原配置 |
| 输入栏状态 | 查看目前模式和近期判定 | 依赖Web客户端挂载及状态读取，显示可能滞后 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途及失败边界 |
| --- | --- | --- |
| 兼容 DSH Host 与 Node | 路由接线需要 | 接收 agent/request 并尝试应用目标路由 |
| 可用 Laya Judge 服务 | 难度判断需要 | 默认本机 HTTP，可用环境变量另选端点；不可达则尝试 fallback |
| Python 环境、权重及运行脚本 | 自托管 judge 需要 | 包内主入口调用 HTTP，需另准备服务及启动条件 |
| 目标提供方、模型和推理档 | 实际应用档位需要 | 当前 profile 不支持判定路由时保留宿主原配置 |
| Web 客户端槽位 | 可视状态和模式界面需要 | 槽位兼容、模式写入及轮询待核验 |

| 阶段 | 操作 | 验收或退回 |
| --- | --- | --- |
| 准备 | 为测试 profile 配置 judge 地址和实际支持的模型路由 | 确认端点及数据范围，用虚构任务核对可达 |
| 判档 | 比较易题、难题、显式要求档位和服务中断 | 核对应用的 provider/model/effort 与同轮缓存，不以芯片单独作采用证据 |
| 异常与退出 | 服务不可达或硬任务预算异常时切 manual，检查下一次请求 | 确认优先尊重外部 route；移除插件后按需另停自行管理的服务 |

**效果与成本**

| 阶段 | 资源与人工投入 | 未验证 |
| --- | --- | --- |
| 首次 | Python、常驻服务、作者说明的约 846 MB 权重及约 2 GB 磁盘，核对宿主和模型 | 安装耗时及实际存储、CPU |
| 持续 | judge HTTP 与目标模型本身是两条调用，需维护服务并检查错误路由 | 首字、token 与实际费用净变化 |
| 失败与退出 | 核查请求使用的路由、手动选择和停止本地服务 | fallback 是否使难题正确率下降 |

| 效果 | 固定源码支持 | 尚不能确定 |
| --- | --- | --- |
| 按任务选择推理预算 | judge 推断、路由可用性检查与同轮缓存 | 相同任务上的正确率、用量与首字延迟 |
| 保持用户控制 | manual 路径透传，非本插件留下的显式 route 会在配置允许时保留 | 客户端模式写入、会话或子代理实际行为 |

> **思考**：[Q02](#research-q02) fallback low 对高难任务可能降低预算；[Q03](#research-q03) 分类服务常驻、版本兼容和运行成本未实测。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将本地难度估计和档位 route 接入 DSH 请求及输入栏状态。[Q02](#research-q02) 保留 explicit route、manual 开关和 judge fallback，提供一定可控性。

自动档检查同轮缓存并分别处理 judge 不可达与目标路由不可用。服务失败会尝试 fallback，目标模型在 profile 不可用时则保留原配置。judge URL 默认回环但可改写，自动模式携带本轮文本、前轮任务和会话标记，客户端芯片只能辅助观察。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) fallback low 对高难任务可能降低预算；[Q03](#research-q03) 分类服务常驻、版本兼容和运行成本未实测。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q01](#research-q01) 有清晰的模型预算分配场景，但 [Q03](#research-q03) 仍需运维本地服务和权重；[Q04](#research-q04) 还没有质量/成本对照。先在固定无敏感任务集上比手动档位，若复杂题误落低档或服务不稳定，就关闭 auto 并手动选档。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认本地 judge 路由、session/turn 缓存、manual/auto 以及 fallback 的实现路径。没有运行 DSH、judge 服务或模型，也未验证作者报告的准确率、时延和成本数据。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、client.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：阅读固定提交 README、package.json、lib/index.js 和 lib/client.js；核对 DSH bundle/client 接入、历史回填、live fold、KV 别名、余额子进程和 HTTP 路由。未执行安装、测试、宿主验收、外部 API 请求或计时。
- 下一步：在隔离 profile 用固定无敏感任务对照手动和自动，单列难题误降档与成功率。分别制造 judge 超时、目标模型不可用及外部显式 effort，核对实际模型请求与输出。确认关 auto 后的请求配置及退出时自行启动的服务。

**分析版本**

- **仓库**：[HapyRain/dsh-router-laya](https://github.com/HapyRain/dsh-router-laya)
- **版本号**：2.2.1（[固定提交 29624e7](https://github.com/HapyRain/dsh-router-laya/tree/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 按任务自动分配预算或能减少不必要的高档调用，同时保持难题表现；本轮未有独立数据证明。

在隔离 profile 用固定无敏感任务对照手动和自动，单列难题误降档与成功率。分别制造 judge 超时、目标模型不可用及外部显式 effort，核对实际模型请求与输出。确认关 auto 后的请求配置及退出时自行启动的服务。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | test | 3 | 399 | 290 | 75 | — |
| .mjs | source | 3 | 554 | 406 | 99 | — |
| .js | source | 2 | 1434 | 947 | 413 | — |
| .md | source | 1 | 109 | — | — | 1502 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/HapyRain/dsh-router-laya/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/HapyRain/dsh-router-laya/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)

暂未获取：近30天关闭。

统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本如何根据任务调整 DSH 思考档，服务失败和外部显式选择如何处理？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 自动思考档路由要替用户解决什么任务，当前实现增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合经常在简单问答与复杂任务间切换推理预算、但不想每次手动调档的 DSH Web 用户。固定源码把本地难度评估、规则路由和输入框状态芯片接入会话；易/中档映射到 DeepSeek flash low，hard 映射 Qwen flash xhigh。作者报告了本地评估和实验，但本轮没有独立复核数据或运行目标环境，不能把节省 token、准确率或延迟作为已证实收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-6](https://github.com/HapyRain/dsh-router-laya/blob/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e/README.md#L3-L6)

作者介绍自动选择思考档及本地判定模型。

```text
一个 DSH 插件：对没有明确档位指令的消息，自动选择思考档（low / high / max）。

做法是在本地跑一个微调过的分类模型（842MB，CPU 推理不到 1 秒），配合会话内的检测无感自动升降档。
全程本地离线，超快响应，适配日常使用，从此让Harness开启"自动驾驶"模式。
```

**依据 2 · 作者声明**：[README.md:30-50](https://github.com/HapyRain/dsh-router-laya/blob/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e/README.md#L30-L50)

README 声称升档策略和试验表现，并展示档位芯片；均不是本轮独立验证。

<details>
<summary>查看原文（21行）</summary>

```text
- **省钱**：简单消息走 low，思考 token 只有拉满时的零头，不再为简单问题支付推理成本
- **快**：低档首字响应更快；本地判定不到 1 秒，无感
- **难事不掉链子**：任务复杂或你在重试时自动升档，max 兜底
- **隐私**：判定模型本地跑，任务文本不出本机
- **越用越准**：判定模型可以随你的使用习惯持续重训

另外我做了 120 多次本地对照实验交叉验证，方向与公开结论一致：单任务 low 档约 96% 成功
（确实不必多花钱）；15 个任务连吃 low 档 42% 翻车、升档后约 17%——这就是这个插件要吃的
那一段：

![会话失败率 vs 任务数](docs/charts/chart-why.svg)

负责判断的 7 题微调分类头，对金标（三模型交叉标注）一致率 99%、本地判定小于 1 秒：

![判定质量](docs/charts/chart-accuracy.svg)

会话内自动升档的实测阶梯——重试两轮，low 到 max：

![升档实测](docs/charts/chart-ladder.svg)

输入栏有个档位芯片，实时显示当前档位和最近 20 轮的判断原因；服务离线时变灰并给出启动命令。
```

</details>

**依据 3 · 源码核查**：[package.json:47-54](https://github.com/HapyRain/dsh-router-laya/blob/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e/package.json#L47-L54)

声明 DSH bundle patch 与 web client。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  }
```

**依据 4 · 源码核查**：[index.js:75-85](https://github.com/HapyRain/dsh-router-laya/blob/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e/index.js#L75-L85)

源码固定档位映射、judge 超时和文本截断上限。

<details>
<summary>查看原文（11行）</summary>

```text
export const ROUTE_TABLE = {
  easy: { provider: DEFAULT_PROVIDER, model: 'deepseek-flash', effort: 'low' },
  medium: { provider: DEFAULT_PROVIDER, model: 'deepseek-flash', effort: 'low' },
  hard: { provider: 'qwen-token-plan-cn', model: 'qwen3.8-flash', effort: 'xhigh' },
  fallback: { provider: DEFAULT_PROVIDER, model: 'deepseek-flash', effort: 'low' },
};

/** The judge's route is now the local Laya HTTP router, not an LLM call. */
const JUDGE_TIMEOUT_MS = 20000;
/** Task text is truncated before it reaches the judge. */
const JUDGE_MAX_CHARS = 4000;
```

</details>

#### 缺口

- 未运行固定版本 judge service 或 DSH 宿主，也未复核 README 引用的本地试验原始数据。
  **影响**：难度分类质量、路由兼容、真实 fallback、延迟和 token/效果净增益未知。
  **进一步探讨**：在隔离 profile 用固定样本记录人工难度、档位、token、首字延迟和服务中断结果，分开比较简单/复杂任务并核对显式 route。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 固定源码怎样决定路由，失败和显式模型选择如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

插件可运行固定 provider/model/effort、judge 或 auto 模式；在 agent/request 中读取 manual/auto 开关，优先尊重外部显式 route，并按 task/session 缓存档位。源码对 judge 返回 difficulty，再经 route table 映射；自动模式使用前后轮状态和意图规则控制升档。judge 不可达时走 fallback low；若目标 profile 不支持配置 route，则保留原请求配置。一次 turn 只重用已判档位，避免同轮工具调用中改变路由。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:6-23](https://github.com/HapyRain/dsh-router-laya/blob/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e/index.js#L6-L23)

模块说明固定 route/judge 模式、fallback 与尊重显式 route。

<details>
<summary>查看原文（18行）</summary>

```text
 *   1. `ROUTEEXP_ARM='provider/model:effort'` -- a fixed arm. Unchanged, and still the whole control
 *      surface for the pilot: unset means this plugin does nothing at all, which is why it is safe to
 *      leave installed anywhere.
 *   2. `ROUTEEXP_ARM='judge'` -- ask a cheap model to rate the first task text of a session once
 *      (easy | medium | hard), cache that verdict per session, and map it through `ROUTE_TABLE` to a
 *      route for every request in that session.
 *
 * A comma-separated list still cycles routes per request, which is what the cache question needed.
 * The effort level is whatever the target route accepts -- this file does not own that vocabulary.
 *
 * The judge is a *level*, never a route: it answers one word, so a routing table can be re-tuned
 * without re-prompting it. It is one cheap call per session and `ROUTE_TABLE.fallback` covers every
 * failure path, so a judge that is slow, refused, or nonsensical degrades to the fallback column
 * instead of breaking the session.
 *
 * Deferring to an explicit route (see ROUTEEXP_RESPECT_EXPLICIT below) exists because the `subagent`
 * tool can carry its own provider/model/effort. Without it this plugin would overwrite the very
 * choice layer 2 just made.
```

</details>

**依据 2 · 源码核查**：[index.js:75-85](https://github.com/HapyRain/dsh-router-laya/blob/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e/index.js#L75-L85)

Difficulty route mapping 和 judge 上限。

<details>
<summary>查看原文（11行）</summary>

```text
export const ROUTE_TABLE = {
  easy: { provider: DEFAULT_PROVIDER, model: 'deepseek-flash', effort: 'low' },
  medium: { provider: DEFAULT_PROVIDER, model: 'deepseek-flash', effort: 'low' },
  hard: { provider: 'qwen-token-plan-cn', model: 'qwen3.8-flash', effort: 'xhigh' },
  fallback: { provider: DEFAULT_PROVIDER, model: 'deepseek-flash', effort: 'low' },
};

/** The judge's route is now the local Laya HTTP router, not an LLM call. */
const JUDGE_TIMEOUT_MS = 20000;
/** Task text is truncated before it reaches the judge. */
const JUDGE_MAX_CHARS = 4000;
```

</details>

**依据 3 · 源码核查**：[index.js:908-928](https://github.com/HapyRain/dsh-router-laya/blob/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e/index.js#L908-L928)

agent/request 开关和显式 route 判断。

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.on('agent/request', async (payload, next) => {
    const config = await next();
    const key = keyOf(payload);
    // The runtime switch, read HERE so flipping it takes effect on the next model call rather than at
    // the next restart. Manual means exactly what it says: the request keeps the config its own owner
    // chose, and nothing below runs.
    if (auto && isManual()) {
      return config;
    }
    if (respectExplicit && carriesExplicitRoute(config)) {
      // v2.1: in auto mode, an explicit effort that matches what WE served this session is our
      // own footprint -- re-route it (that is the whole point of auto). Anything foreign
      // (subagent delegation, a pinned default) still defers. v1 paths keep the blanket defer.
      if (auto && isOurRoute(config, sessionState.get(key), tiers)) {
        log('explicit effort is our own last applied route -- re-routing');
      } else {
        log('request already names a reasoning effort -- deferring');
        return config;
      }
    }
    if (auto) {
```

</details>

**依据 4 · 源码核查**：[index.js:944-967](https://github.com/HapyRain/dsh-router-laya/blob/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e/index.js#L944-L967)

judge 结果/失败 fallback 与状态保存。

<details>
<summary>查看原文（24行）</summary>

```text
      const judgment = task === undefined
        ? null
        : await judgeTier(task.text, state ? state.tier : undefined, state ? state.task : undefined,
          task.sessionId, payload && payload.signal);
      // Fail-safe, two branches (plan §4.4): /judge unreachable -> the fallback ROUTE (low);
      // a route this profile cannot serve -> leave the request on its own config (usableRoute
      // returns null, v1 semantics -- NOT the fallback).
      let route;
      let servedTier;
      if (judgment === null) {
        route = usableRoute(ctx, tiers.fallback);
        servedTier = 'low';
      } else {
        route = usableRoute(ctx, tiers[judgment.tier] || tiers.fallback);
        servedTier = judgment.tier;
      }
      verdicts.set(key, { turn, route });
      if (task !== undefined) {
        sessionState.set(key, { tier: servedTier, task: task.text, turn });
      }
      log(`turn ${turn} auto "${task === undefined ? '(no task text captured)' : task.text.slice(0, 60).replace(/\s+/g, ' ')}"`
        + ` -> ${judgment === null ? 'judge unreachable -> fallback' : `${judgment.tier} (${judgment.triggered_by})`} -> `
        + (route === null ? 'left on its own config' : routeLabel(route)));
      return route === null ? config : applyRoute(config, route);
```

</details>

**依据 5 · 源码核查**：[index.js:969-987](https://github.com/HapyRain/dsh-router-laya/blob/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e/index.js#L969-L987)

同一 turn 缓存 verdict，后续请求复用。

<details>
<summary>查看原文（19行）</summary>

```text
    if (judging) {
      const turn = payload && payload.turn;
      const cached = verdicts.get(key);
      // One judgment per TURN, held across every step of it. An agentic turn makes many model calls,
      // and a tier that moved mid-turn would fight both the KV cache and the tool calls already in
      // flight -- so this is "route each task once", not "route every tool-call round".
      if (cached !== undefined && cached.turn === turn) {
        return cached.route === null ? config : applyRoute(config, cached.route);
      }
      const task = tasks.get(key);
      const level = task === undefined
        ? null
        : await judgeDifficulty(ctx, task.text, task.sessionId, payload && payload.signal);
      const route = usableRoute(ctx, routeForLevel(level, table));
      verdicts.set(key, { turn, route });
      log(`turn ${turn} judged "${task === undefined ? '(no task text captured)' : task.text.slice(0, 60).replace(/\s+/g, ' ')}"`
        + ` -> ${level === null ? 'unjudged' : level} -> `
        + (route === null ? 'left on its own config' : routeLabel(route)));
      return route === null ? config : applyRoute(config, route);
```

</details>

#### 缺口

- 未运行固定版本 judge service 或 DSH 宿主，也未复核 README 引用的本地试验原始数据。
  **影响**：难度分类质量、路由兼容、真实 fallback、延迟和 token/效果净增益未知。
  **进一步探讨**：在隔离 profile 用固定样本记录人工难度、档位、token、首字延迟和服务中断结果，分开比较简单/复杂任务并核对显式 route。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地判定服务、模型权重和 DSH client 接线带来哪些成本与边界？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

依赖 DSH、Node、Python、本机常驻服务、约 846MB 权重与约 2GB 磁盘；本地推理避免把判定文本发送到远端 judge，但实际模型路由仍可能调用外部供应商。服务启动慢或不可达会使请求 fallback 到 low，可能降低难题思考预算而非中断会话。agent/thread/继承状态、模型支持的 effort 名称和 client 前端挂载都依赖 DSH 版本；README 本身提醒客户端插槽可能随大版本变化。服务运维、判定质量、token 净节省和首字延迟均未在本轮运行验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:59-69](https://github.com/HapyRain/dsh-router-laya/blob/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e/README.md#L59-L69)

安装过程需要 Python venv、846MB 权重和常驻服务。

<details>
<summary>查看原文（11行）</summary>

````text
setup 做三件事：建 Python 虚拟环境、下载 846MB 的 checkpoint（走本仓 GitHub Release，
HF 和镜像做兜底，支持断点续传）、启动判定服务。然后按它打印的 snippet 在你的 DSH profile
里注册插件行，设两个环境变量：

```
ROUTEEXP_ARM=auto
ROUTEEXP_RESPECT_EXPLICIT=1
```

要求：Node ≥ 18，Python ≥ 3.10，约 2GB 磁盘。判定服务需要常驻（setup 会启动，重启机器后
重跑 `npx dsh-router-laya setup` 或 service 里的启动脚本）。
````

</details>

**依据 2 · 作者声明**：[README.md:80-86](https://github.com/HapyRain/dsh-router-laya/blob/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e/README.md#L80-L86)

服务离线 fallback、判定延迟与前端缝变化是作者声明的边界。

```text
失败路径：判定服务不可达 → 落 low，会话不断(概率极低<0.3%)。

## 已知边界

- 判定耗时 1–3 秒，计入每轮首字延迟
- 服务需要常驻进程；DSH 大版本更新可能改动前端注入缝，client.js 需要跟着适配
- 权重下载在国内网络走镜像兜底，首次 846MB
```

**依据 3 · 源码核查**：[package.json:36-54](https://github.com/HapyRain/dsh-router-laya/blob/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e/package.json#L36-L54)

运行时 Node/DSH 要求与 web client 定义。

<details>
<summary>查看原文（19行）</summary>

```text
  "engines": {
    "node": ">=18",
    "dsh": ">=0.1.0-rc.6"
  },
  "peerDependencies": {
    "@deepseek-ai/schemastery": "~3.18.4"
  },
  "devDependencies": {
    "@deepseek-ai/cosmokit": "~1.8.5",
    "@deepseek-ai/schemastery": "~3.18.4"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  }
```

</details>

**依据 4 · 源码核查**：[index.js:17-23](https://github.com/HapyRain/dsh-router-laya/blob/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e/index.js#L17-L23)

设计声称 judge/failure fallback 和 explicit-route 保护，仍需目标环境验收。

```text
 * without re-prompting it. It is one cheap call per session and `ROUTE_TABLE.fallback` covers every
 * failure path, so a judge that is slow, refused, or nonsensical degrades to the fallback column
 * instead of breaking the session.
 *
 * Deferring to an explicit route (see ROUTEEXP_RESPECT_EXPLICIT below) exists because the `subagent`
 * tool can carry its own provider/model/effort. Without it this plugin would overwrite the very
 * choice layer 2 just made.
```

#### 缺口

- 未运行固定版本 judge service 或 DSH 宿主，也未复核 README 引用的本地试验原始数据。
  **影响**：难度分类质量、路由兼容、真实 fallback、延迟和 token/效果净增益未知。
  **进一步探讨**：在隔离 profile 用固定样本记录人工难度、档位、token、首字延迟和服务中断结果，分开比较简单/复杂任务并核对显式 route。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证自动档位确实改善成本/质量而不压低难题表现？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合愿意管理本机分类服务的 DSH 用户先在测试 profile 做一组固定任务。逐项人工标注难度，对比手动固定档和自动档的正确率、升级次数、token、首字时间、服务不可达回退及被显式 effort 保护的情况。应把容易任务成本和困难任务失败率分开报告。若 hard 任务持续落 low、自动/手动选择无法解释、常驻服务无法恢复或费用没有下降而质量受损，就关闭 auto 并改为手动选择。当前源码与 README 无本轮实测证明达到这些指标。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:71-86](https://github.com/HapyRain/dsh-router-laya/blob/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e/README.md#L71-L86)

作者描述四层判档与服务失败回退及服务运维要求。

<details>
<summary>查看原文（16行）</summary>

```text
## 它怎么决定档位

按顺序过四层，任何一层命中就停：

1. 词典意图：「用最高档」→ 直接定档（一票否决）；「继续」→ 保持上轮；「别用 max」→ 记一个约束
2. 微调模型：laya接管判定（副作用 / 跨模块 / 步骤依赖 / 深推理 / 代码 / 生成 / 会话复利）→ 规则引擎出档
3. 升级：这轮消息是上一轮的重试 → 沿阶梯升一级
4. 约束过滤：第 1 层记下的约束最后统一执行

失败路径：判定服务不可达 → 落 low，会话不断(概率极低<0.3%)。

## 已知边界

- 判定耗时 1–3 秒，计入每轮首字延迟
- 服务需要常驻进程；DSH 大版本更新可能改动前端注入缝，client.js 需要跟着适配
- 权重下载在国内网络走镜像兜底，首次 846MB
```

</details>

**依据 2 · 源码核查**：[index.js:908-987](https://github.com/HapyRain/dsh-router-laya/blob/29624e7e89d64d25ba0e6d8b3a6d79a1823c357e/index.js#L908-L987)

agent/request 自动、显式配置及 fallback 实际路径。

<details>
<summary>查看原文（80行）</summary>

```text
  ctx.on('agent/request', async (payload, next) => {
    const config = await next();
    const key = keyOf(payload);
    // The runtime switch, read HERE so flipping it takes effect on the next model call rather than at
    // the next restart. Manual means exactly what it says: the request keeps the config its own owner
    // chose, and nothing below runs.
    if (auto && isManual()) {
      return config;
    }
    if (respectExplicit && carriesExplicitRoute(config)) {
      // v2.1: in auto mode, an explicit effort that matches what WE served this session is our
      // own footprint -- re-route it (that is the whole point of auto). Anything foreign
      // (subagent delegation, a pinned default) still defers. v1 paths keep the blanket defer.
      if (auto && isOurRoute(config, sessionState.get(key), tiers)) {
        log('explicit effort is our own last applied route -- re-routing');
      } else {
        log('request already names a reasoning effort -- deferring');
        return config;
      }
    }
    if (auto) {
      // AUTO (plugin v2): the current task text comes from `tasks` (claimed this turn); the
      // previous tier/task come from `sessionState` (written at the END of the previous turn) --
      // two maps with two writers, deliberately (deepseek review F7). Same per-turn caching as
      // the judge path; the state map carries `turn` so a session reset / id reuse (turn going
      // backwards) discards stale prev_tier/prev_task instead of leaking them (deepseek F4).
      const turn = payload && payload.turn;
      const cached = verdicts.get(key);
      if (cached !== undefined && cached.turn === turn) {
        return cached.route === null ? config : applyRoute(config, cached.route);
      }
      const task = tasks.get(key);
      const prev = sessionState.get(key);
      const state = prev !== undefined && (turn === undefined || prev.turn === undefined || turn >= prev.turn)
        ? prev
        : undefined;
      const judgment = task === undefined
        ? null
        : await judgeTier(task.text, state ? state.tier : undefined, state ? state.task : undefined,
          task.sessionId, payload && payload.signal);
      // Fail-safe, two branches (plan §4.4): /judge unreachable -> the fallback ROUTE (low);
      // a route this profile cannot serve -> leave the request on its own config (usableRoute
      // returns null, v1 semantics -- NOT the fallback).
      let route;
      let servedTier;
      if (judgment === null) {
        route = usableRoute(ctx, tiers.fallback);
        servedTier = 'low';
      } else {
        route = usableRoute(ctx, tiers[judgment.tier] || tiers.fallback);
        servedTier = judgment.tier;
      }
      verdicts.set(key, { turn, route });
      if (task !== undefined) {
        sessionState.set(key, { tier: servedTier, task: task.text, turn });
      }
      log(`turn ${turn} auto "${task === undefined ? '(no task text captured)' : task.text.slice(0, 60).replace(/\s+/g, ' ')}"`
        + ` -> ${judgment === null ? 'judge unreachable -> fallback' : `${judgment.tier} (${judgment.triggered_by})`} -> `
        + (route === null ? 'left on its own config' : routeLabel(route)));
      return route === null ? config : applyRoute(config, route);
    }
    if (judging) {
      const turn = payload && payload.turn;
      const cached = verdicts.get(key);
      // One judgment per TURN, held across every step of it. An agentic turn makes many model calls,
      // and a tier that moved mid-turn would fight both the KV cache and the tool calls already in
      // flight -- so this is "route each task once", not "route every tool-call round".
      if (cached !== undefined && cached.turn === turn) {
        return cached.route === null ? config : applyRoute(config, cached.route);
      }
      const task = tasks.get(key);
      const level = task === undefined
        ? null
        : await judgeDifficulty(ctx, task.text, task.sessionId, payload && payload.signal);
      const route = usableRoute(ctx, routeForLevel(level, table));
      verdicts.set(key, { turn, route });
      log(`turn ${turn} judged "${task === undefined ? '(no task text captured)' : task.text.slice(0, 60).replace(/\s+/g, ' ')}"`
        + ` -> ${level === null ? 'unjudged' : level} -> `
        + (route === null ? 'left on its own config' : routeLabel(route)));
      return route === null ? config : applyRoute(config, route);
```

</details>

#### 缺口

- 未运行固定版本 judge service 或 DSH 宿主，也未复核 README 引用的本地试验原始数据。
  **影响**：难度分类质量、路由兼容、真实 fallback、延迟和 token/效果净增益未知。
  **进一步探讨**：在隔离 profile 用固定样本记录人工难度、档位、token、首字延迟和服务中断结果，分开比较简单/复杂任务并核对显式 route。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
