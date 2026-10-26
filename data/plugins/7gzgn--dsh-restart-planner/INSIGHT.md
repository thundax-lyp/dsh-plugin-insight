# dsh-restart-planner

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[31562ec](https://github.com/7gzgn/dsh-restart-planner/tree/31562ec5555d6e93a81c251b39d173b5d80c03c6)

<!-- BEGIN META -->
[![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-restart-planner)
<!-- END META -->

> **实现功能**：让代理排程宿主自重启，等待会话落盘后由外部 helper 停拉进程并向原会话投递继续提示。

> **核心亮点**：相对人工重启，它把进程死亡点放到回复与写盘之后，并用外部 helper 与持久恢复标记跨越宿主生命周期；比按钮插件更适合 agent 自主流程。优势依赖目标解析和会话静默确实可靠，且“继续”提示不等于原任务状态自动恢复。 详见[Q03](#research-q03)。

> **风险与缺陷**：最关键质疑是强制停止前的“静默”只能近似落盘完整，最后写入仍可能丢失；自动继续可能在环境尚未完全恢复时重复动作。默认 confirm=false 与 resume=true 对无人值守有利，却扩大误排程后果；重复 schedule 覆盖旧排程而不排队。 详见[Q04](#research-q04)。

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
  - [Q01 · 谁在何种重复场景需要 dsh-restart-planner，合格交付与简单替代是什么？](#detail-section-11)
  - [Q02 · dsh-restart-planner 的入口、调用链、状态变化与副作用如何实现？](#detail-section-12)
  - [Q03 · 相对宿主原生能力或简单替代，dsh-restart-planner 的具体增量是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使 dsh-restart-planner 的核心价值不成立？](#detail-section-14)
  - [Q05 · dsh-restart-planner 启动、持续生效与失败降级依赖什么？](#detail-section-15)
  - [Q06 · dsh-restart-planner 完成一个合格任务的首次、持续与失败恢复成本是什么？](#detail-section-16)
  - [Q07 · dsh-restart-planner 的工程可靠性和可迁移设计如何？](#detail-section-17)
  - [Q08 · 由贡献与限制可推导什么可证伪的新设计假设？](#detail-section-18)
  - [Q09 · 哪些人应观察、试用或拒绝采用 dsh-restart-planner？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：代理安装或修改 Host 插件后需要重启才能继续，但当前进程不能杀死自己；基线是让用户手工重开并再次提示继续。合格结果是本轮回复先送达、会话落盘、明确目标被重拉、状态可审计，且自动继续只在新进程接受 prompt 后清标记。 详见[Q01](#research-q01)。

代理安装或修改 Host 插件后需要重启才能继续，但当前进程不能杀死自己；基线是让用户手工重开并再次提示继续。合格结果是本轮回复先送达、会话落盘、明确目标被重拉、状态可审计，且自动继续只在新进程接受 prompt 后清标记。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| self_restart | 让 agent 排程/取消/查询重启 | schedule 是破坏动作；先 dry-run |
| 跨重启 helper | 宿主退出后仍能重拉 | 平台/启动器差异可能失败 |
| 恢复 prompt | 重启后向原会话排队继续 | 只恢复提示，不证明任务状态幂等 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools/sessionController | 必需 | 注册工具并恢复会话 prompt | 缺失则无法排程或继续 |
| 状态与会话目录 | 必需 | 授权、报告、静默检测和恢复标记 | 不可写时应拒绝 |
| Explorer/PowerShell | Windows 路径必需 | 让 helper 活过桌面 job | 拿不到 Explorer 时降级，风险上升 |
| userQuestions | confirm 才需要 | 让用户选择时机 | 缺失按 fallback 并明示 no-asker |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 体检 | 代理调用 status/resolve 或 dryRun | 目标 pid、killList、拉起命令明确 |
| 排程 | schedule 可先 confirm | 立即返回，本轮继续完成 |
| 交接 | helper 等 delay 与日志静默 | 到 maxWait 后执行或取消 |
| 恢复 | 新 Host 投递 queue prompt | accepted 后删标记；失败保留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 无外部费；占状态/日志文件 | 核 target/命令、dry-run、建立救援路径 | 跨平台耗时未知 |
| 每次重启 | 数秒停机及中断中的计算损失 | 等待回复、静默和健康检查 | 应按成功重启+继续任务计量 |
| 失败恢复 | 可能需人工重开应用 | 读 last/helper/resume，判定是否补投 | 重复 resume 可能重复业务动作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 回复后重启 | 源码先排程再由 helper 延迟执行 | 最后写入是否完全落盘 |
| 宿主重拉 | 授权和明确 target 后停拉 | 各启动器/平台成功率 |
| 自动继续 | accepted 后才删恢复标记 | 业务步骤幂等和重复风险 |

> **思考**：最关键质疑是强制停止前的“静默”只能近似落盘完整，最后写入仍可能丢失；自动继续可能在环境尚未完全恢复时重复动作。默认 confirm=false 与 resume=true 对无人值守有利，却扩大误排程后果；重复 schedule 覆盖旧排程而不排队。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对人工重启，它把进程死亡点放到回复与写盘之后，并用外部 helper 与持久恢复标记跨越宿主生命周期；比按钮插件更适合 agent 自主流程。优势依赖目标解析和会话静默确实可靠，且“继续”提示不等于原任务状态自动恢复。 详见[Q03](#research-q03)。

相对人工重启，它把进程死亡点放到回复与写盘之后，并用外部 helper 与持久恢复标记跨越宿主生命周期；比按钮插件更适合 agent 自主流程。优势依赖目标解析和会话静默确实可靠，且“继续”提示不等于原任务状态自动恢复。 详见[Q03](#research-q03)。

排程、计划解析、helper 和 resume 投递拆分，授权标记与临时目录闸防测试误杀，恢复标记采用“成功才删”。可复用的是跨重启交接协议；迁移到别的宿主必须重新证明进程树、写盘安静信号和 prompt 幂等。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

最关键质疑是强制停止前的“静默”只能近似落盘完整，最后写入仍可能丢失；自动继续可能在环境尚未完全恢复时重复动作。默认 confirm=false 与 resume=true 对无人值守有利，却扩大误排程后果；重复 schedule 覆盖旧排程而不排队。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅建议具备救援入口的插件开发环境观察；先 dryRun，随后在空闲会话做一次 confirm=true、resume=false 的真实重启，再单独验证恢复投递。生产工作站、长事务或不可重复外部写入期间不应让 agent 自主 schedule；last.json 不为 ok 或 resume 标记滞留时停止自动继续。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认了 self_restart 的排程/取消/状态入口、明确目标与授权闸、会话静默等待、外部 helper 以及成功才清除的 resume 标记；本轮未真实停止 Host，也未注入 prompt 拒绝或外部副作用任务，故不能证明最后写入不丢失或自动继续不会重复业务动作。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 31562ec5555d6e93a81c251b39d173b5d80c03c6 的作者材料、入口与关键源码；不运行插件、测试、外部服务或真实 Host；检查时间不早于 2026-10-22T15:49:47Z。
- 下一步：先用 dryRun 固定 target/killList/command，再在隔离 Host 注入写盘未静默、helper 中断、健康检查失败和 prompt 拒绝；分别核 last 状态、resume 标记保留、手工救援与任务副作用是否只发生一次。

**分析版本**

- **仓库**：[7gzgn/dsh-restart-planner](https://github.com/7gzgn/dsh-restart-planner)
- **版本号**：0.4.6（[固定提交 31562ec](https://github.com/7gzgn/dsh-restart-planner/tree/31562ec5555d6e93a81c251b39d173b5d80c03c6)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是给恢复标记增加原任务幂等键与上一步完成摘要，可把“继续一句话”升级为可判重的恢复协议。最小实验让 20 个含外部写入的任务在四个阶段重启，比较当前 prompt 与幂等恢复的重复副作用、丢步骤率和人工接管次数；任一重复写远端即否定自动恢复。 详见[Q08](#research-q08)。

先用 dryRun 固定 target/killList/command，再在隔离 Host 注入写盘未静默、helper 中断、健康检查失败和 prompt 拒绝；分别核 last 状态、resume 标记保留、手工救援与任务副作用是否只发生一次。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 3 | 722 | 597 | 76 | — |
| .js | source | 4 | 1672 | 1122 | 457 | — |
| .md | source | 1 | 220 | — | — | 2908 |
| .mjs | example | 2 | 93 | 60 | 22 | — |
| .mjs | test | 1 | 694 | 560 | 85 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-restart-planner/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-restart-planner 在固定版本下是否以可控依赖和总成本交付其核心能力，并值得目标用户采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种重复场景需要 dsh-restart-planner，合格交付与简单替代是什么？

**研究主题**：场景与需求

#### 完整回答

代理安装或修改 Host 插件后需要重启才能继续，但当前进程不能杀死自己；基线是让用户手工重开并再次提示继续。合格结果是本轮回复先送达、会话落盘、明确目标被重拉、状态可审计，且自动继续只在新进程接受 prompt 后清标记。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-49](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/README.md#L28-L49)

固定版本作者材料支持 Q01 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（22行）</summary>

```text
## 它是怎么破的

三段式，把「一次自杀」拆成**三个互不相干的进程**：

| 阶段 | 谁在做 | 做什么 |
|---|---|---|
| **1. 排程** | 你（agent / 用户） | 调用 `self_restart` → 立刻返回。**这一轮还没结束，什么都还没发生。** |
| **2. 交接** | 插件（宿主里） | 算好"要杀谁、用什么命令拉回来"，把任务交给一个**在宿主进程树之外**的 helper，并等它回来报到 |
| **3. 动手** | helper（独立进程） | 先等 `delaySeconds`（让这一轮回复送达）→ 再等会话日志**落盘安静** → 停 → 拉 → 体检 → 写报告 |

关键在第 2 步：**helper 必须活过它自己杀掉的那棵进程树。**

### Windows 上为什么必须绕道 Explorer

这不是"保险起见"，是**实测出来的硬约束**：

- 桌面端的宿主是 Chromium 起的，**进程在一个 job object 里**。被杀时 job 一关，里面的成员**一起没** —— helper 如果也在里面，就没人把 DSH 拉回来了。
- 直接 `spawn(..., { detached: true })` 在 Windows 上还有第二个坑：**PowerShell 被 detached 起来后什么都不做**（进程秒退、退出码 0、脚本一行都没跑）。这是实测结论，不是猜的。

所以 Windows 上走的是：**生成一个 `.lnk`，让 `explorer.exe` 去启动 helper**。
Explorer 在 job 之外、在交互会话里，由它起的进程才能**活过这次重启**，也才能把窗口放回用户桌面上。
（拿不到 Explorer 时退化成普通子进程，并在报告里写明这是降级路径。）
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · dsh-restart-planner 的入口、调用链、状态变化与副作用如何实现？

**研究主题**：功能与机制

#### 完整回答

self_restart 工具提供 schedule/status/cancel/resume；schedule 固定目标、写授权与恢复标记，把任务交给进程树外 helper。helper 等 delay 和会话静默后停止并拉起，写 last.json；新 Host 延迟读取 resume.json，以 sessionController.prompt queue 投递，成功才删除，失败保留重试。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:372-460](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/lib/index.js#L372-L460)

固定版本源码用于核对 Q02 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（89行）</summary>

```text
/**
 * 重启后把「继续」投递进那个会话。
 *
 * 用 `sessionController.prompt`（0.2.x 的现成入口）而不是 dsh-restart 的
 * `agent.followup`（那个 API 在 0.2.x 已经不存在）。**投递成功才删标记**，
 * 失败保留，下次启动还能再试。
 *
 * @param {object} ctx 宿主上下文
 * @param {string} stateDir 状态目录
 * @param {object} cfg 插件配置
 * @returns {() => void} 取消函数
 */
function startResumeDelivery(ctx, stateDir, cfg) {
  if (cfg.resumeAfterRestart === false) return () => {};
  if (readResume(stateDir) === null) return () => {};
  const pauseMs = Number.isFinite(cfg.resumeDelayMs) ? Math.max(0, cfg.resumeDelayMs) : 8000;
  const timer = setTimeout(() => {
    logResume(stateDir, 'startup: 发现恢复标记，开始投递');
    const promptFor = async (sessionId, prompt) => {
      const svc = typeof ctx?.get === 'function' ? ctx.get('sessionController') : undefined;
      if (svc === null || svc === undefined || typeof svc.prompt !== 'function') {
        throw new Error(`sessionController 不可用（typeof prompt=${typeof svc?.prompt}）`);
      }
      // 第二个参数是**必需的 AbortSignal**：不传就会在服务内部 `signal.throwIfAborted()` 上炸
      // （2026-10-17 实测错误：Cannot read properties of undefined (reading 'throwIfAborted')）。
      const controller = new AbortController();
      const kill = setTimeout(() => controller.abort(), 30000);
      kill.unref?.();
      try {
        const result = await svc.prompt({
          requestId: `resume-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          sessionId,
          mode: 'queue',
          content: [{ type: 'text', text: prompt }],
        }, controller.signal);
        if (result !== null && typeof result === 'object' && result.accepted === false) {
          throw new Error(`prompt 未被接受：${JSON.stringify(result).slice(0, 160)}`);
        }
      } finally {
        clearTimeout(kill);
      }
    };
    const log = (line) => {
      logResume(stateDir, line);
      if (cfg.quiet !== true) console.error(`[dsh-restart-planner] ${line}`);
    };
    deliverResume({
      stateDir,
      promptFor,
      retries: Number.isFinite(cfg.resumeRetries) ? cfg.resumeRetries : 6,
      retryDelayMs: Number.isFinite(cfg.resumeRetryDelayMs) ? cfg.resumeRetryDelayMs : 3000,
      log,
    }).catch((err) => log(`resume: 投递过程出错：${err instanceof Error ? err.message : String(err)}`));
  }, pauseMs);
  timer.unref?.();
  return () => clearTimeout(timer);
}

/**
 * 挂载插件。
 * @param {import('@deepseek-ai/cordis').Context} ctx 宿主上下文
 * @param {object} [config] 插件配置
 */
export function apply(ctx, config) {
  const cfg = config ?? {};
  if (cfg.enabled === false) return;
  const { stateDir, sessionRoot } = paths(cfg);
  const disposers = [];

  // 重启后自动继续：本进程起来时如果还有恢复标记，等宿主安顿一下就把「继续」投进去。
  try {
    disposers.push(startResumeDelivery(ctx, stateDir, cfg));
  } catch {
    /* 投递只该是加分项，绝不该拖垮插件加载 */
  }

  if (ctx.tools !== undefined && typeof ctx.tools.register === 'function') {
    disposers.push(ctx.tools.register(defineTool({
      name: 'self_restart',
      description: [
        '让 agent 自己安排一次宿主（DSH）重启：装/改插件、改了 .js、需要重载宿主时用，不必再让用户手动关开。',
        "action='schedule'：排程重启。**调用后立刻返回**，真正的「停 + 拉」发生在你这一轮回复送达、且会话日志落盘安静之后（默认 T+20s 起、静默 4s、最长等 180s）。之后把这一轮正常说完即可。",
        "  可选参数：reason（写进报告的动机）、delaySeconds（至少等多久）、quietSeconds、maxWaitSeconds、dryRun（只演算不动手）、relaunchCommand（特殊启动器/包装脚本才需要）。",
        "action='status'：体检 + 报告 —— 当前 pid 与运行时长、现在重启会结束哪些进程、用什么命令拉回来、上一次重启的结果（重启回来后的第一条消息应该先看它）。",
        "action='cancel'：撤掉还没执行的那次排程。",
        '典型用法：装完插件/改完代码 → schedule(reason) → 说完这一轮 → 重启后 status 汇报结果。',
        '它平时完全静默：不常驻、不轮询、不占资源，只在你真的调用时才动。',
      ].join('\n'),
      timeoutMs: 60000,
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主原生能力或简单替代，dsh-restart-planner 的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对人工重启，它把进程死亡点放到回复与写盘之后，并用外部 helper 与持久恢复标记跨越宿主生命周期；比按钮插件更适合 agent 自主流程。优势依赖目标解析和会话静默确实可靠，且“继续”提示不等于原任务状态自动恢复。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-49](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/README.md#L28-L49)

固定版本作者材料支持 Q03 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（22行）</summary>

```text
## 它是怎么破的

三段式，把「一次自杀」拆成**三个互不相干的进程**：

| 阶段 | 谁在做 | 做什么 |
|---|---|---|
| **1. 排程** | 你（agent / 用户） | 调用 `self_restart` → 立刻返回。**这一轮还没结束，什么都还没发生。** |
| **2. 交接** | 插件（宿主里） | 算好"要杀谁、用什么命令拉回来"，把任务交给一个**在宿主进程树之外**的 helper，并等它回来报到 |
| **3. 动手** | helper（独立进程） | 先等 `delaySeconds`（让这一轮回复送达）→ 再等会话日志**落盘安静** → 停 → 拉 → 体检 → 写报告 |

关键在第 2 步：**helper 必须活过它自己杀掉的那棵进程树。**

### Windows 上为什么必须绕道 Explorer

这不是"保险起见"，是**实测出来的硬约束**：

- 桌面端的宿主是 Chromium 起的，**进程在一个 job object 里**。被杀时 job 一关，里面的成员**一起没** —— helper 如果也在里面，就没人把 DSH 拉回来了。
- 直接 `spawn(..., { detached: true })` 在 Windows 上还有第二个坑：**PowerShell 被 detached 起来后什么都不做**（进程秒退、退出码 0、脚本一行都没跑）。这是实测结论，不是猜的。

所以 Windows 上走的是：**生成一个 `.lnk`，让 `explorer.exe` 去启动 helper**。
Explorer 在 job 之外、在交互会话里，由它起的进程才能**活过这次重启**，也才能把窗口放回用户桌面上。
（拿不到 Explorer 时退化成普通子进程，并在报告里写明这是降级路径。）
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使 dsh-restart-planner 的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最关键质疑是强制停止前的“静默”只能近似落盘完整，最后写入仍可能丢失；自动继续可能在环境尚未完全恢复时重复动作。默认 confirm=false 与 resume=true 对无人值守有利，却扩大误排程后果；重复 schedule 覆盖旧排程而不排队。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:372-460](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/lib/index.js#L372-L460)

固定版本源码用于核对 Q04 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（89行）</summary>

```text
/**
 * 重启后把「继续」投递进那个会话。
 *
 * 用 `sessionController.prompt`（0.2.x 的现成入口）而不是 dsh-restart 的
 * `agent.followup`（那个 API 在 0.2.x 已经不存在）。**投递成功才删标记**，
 * 失败保留，下次启动还能再试。
 *
 * @param {object} ctx 宿主上下文
 * @param {string} stateDir 状态目录
 * @param {object} cfg 插件配置
 * @returns {() => void} 取消函数
 */
function startResumeDelivery(ctx, stateDir, cfg) {
  if (cfg.resumeAfterRestart === false) return () => {};
  if (readResume(stateDir) === null) return () => {};
  const pauseMs = Number.isFinite(cfg.resumeDelayMs) ? Math.max(0, cfg.resumeDelayMs) : 8000;
  const timer = setTimeout(() => {
    logResume(stateDir, 'startup: 发现恢复标记，开始投递');
    const promptFor = async (sessionId, prompt) => {
      const svc = typeof ctx?.get === 'function' ? ctx.get('sessionController') : undefined;
      if (svc === null || svc === undefined || typeof svc.prompt !== 'function') {
        throw new Error(`sessionController 不可用（typeof prompt=${typeof svc?.prompt}）`);
      }
      // 第二个参数是**必需的 AbortSignal**：不传就会在服务内部 `signal.throwIfAborted()` 上炸
      // （2026-10-17 实测错误：Cannot read properties of undefined (reading 'throwIfAborted')）。
      const controller = new AbortController();
      const kill = setTimeout(() => controller.abort(), 30000);
      kill.unref?.();
      try {
        const result = await svc.prompt({
          requestId: `resume-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          sessionId,
          mode: 'queue',
          content: [{ type: 'text', text: prompt }],
        }, controller.signal);
        if (result !== null && typeof result === 'object' && result.accepted === false) {
          throw new Error(`prompt 未被接受：${JSON.stringify(result).slice(0, 160)}`);
        }
      } finally {
        clearTimeout(kill);
      }
    };
    const log = (line) => {
      logResume(stateDir, line);
      if (cfg.quiet !== true) console.error(`[dsh-restart-planner] ${line}`);
    };
    deliverResume({
      stateDir,
      promptFor,
      retries: Number.isFinite(cfg.resumeRetries) ? cfg.resumeRetries : 6,
      retryDelayMs: Number.isFinite(cfg.resumeRetryDelayMs) ? cfg.resumeRetryDelayMs : 3000,
      log,
    }).catch((err) => log(`resume: 投递过程出错：${err instanceof Error ? err.message : String(err)}`));
  }, pauseMs);
  timer.unref?.();
  return () => clearTimeout(timer);
}

/**
 * 挂载插件。
 * @param {import('@deepseek-ai/cordis').Context} ctx 宿主上下文
 * @param {object} [config] 插件配置
 */
export function apply(ctx, config) {
  const cfg = config ?? {};
  if (cfg.enabled === false) return;
  const { stateDir, sessionRoot } = paths(cfg);
  const disposers = [];

  // 重启后自动继续：本进程起来时如果还有恢复标记，等宿主安顿一下就把「继续」投进去。
  try {
    disposers.push(startResumeDelivery(ctx, stateDir, cfg));
  } catch {
    /* 投递只该是加分项，绝不该拖垮插件加载 */
  }

  if (ctx.tools !== undefined && typeof ctx.tools.register === 'function') {
    disposers.push(ctx.tools.register(defineTool({
      name: 'self_restart',
      description: [
        '让 agent 自己安排一次宿主（DSH）重启：装/改插件、改了 .js、需要重载宿主时用，不必再让用户手动关开。',
        "action='schedule'：排程重启。**调用后立刻返回**，真正的「停 + 拉」发生在你这一轮回复送达、且会话日志落盘安静之后（默认 T+20s 起、静默 4s、最长等 180s）。之后把这一轮正常说完即可。",
        "  可选参数：reason（写进报告的动机）、delaySeconds（至少等多久）、quietSeconds、maxWaitSeconds、dryRun（只演算不动手）、relaunchCommand（特殊启动器/包装脚本才需要）。",
        "action='status'：体检 + 报告 —— 当前 pid 与运行时长、现在重启会结束哪些进程、用什么命令拉回来、上一次重启的结果（重启回来后的第一条消息应该先看它）。",
        "action='cancel'：撤掉还没执行的那次排程。",
        '典型用法：装完插件/改完代码 → schedule(reason) → 说完这一轮 → 重启后 status 汇报结果。',
        '它平时完全静默：不常驻、不轮询、不占资源，只在你真的调用时才动。',
      ].join('\n'),
      timeoutMs: 60000,
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-restart-planner 启动、持续生效与失败降级依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要兼容 DSH tools、sessionController、会话目录和可写状态目录；Windows 真机链依赖 Explorer/PowerShell，其他平台代码未真机验证。confirm 可选依赖 userQuestions；缺失时按明确 fallback。特殊启动器需 relaunchCommand，否则目标/命令解析失败应拒绝。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-49](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/README.md#L28-L49)

固定版本作者材料支持 Q05 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（22行）</summary>

```text
## 它是怎么破的

三段式，把「一次自杀」拆成**三个互不相干的进程**：

| 阶段 | 谁在做 | 做什么 |
|---|---|---|
| **1. 排程** | 你（agent / 用户） | 调用 `self_restart` → 立刻返回。**这一轮还没结束，什么都还没发生。** |
| **2. 交接** | 插件（宿主里） | 算好"要杀谁、用什么命令拉回来"，把任务交给一个**在宿主进程树之外**的 helper，并等它回来报到 |
| **3. 动手** | helper（独立进程） | 先等 `delaySeconds`（让这一轮回复送达）→ 再等会话日志**落盘安静** → 停 → 拉 → 体检 → 写报告 |

关键在第 2 步：**helper 必须活过它自己杀掉的那棵进程树。**

### Windows 上为什么必须绕道 Explorer

这不是"保险起见"，是**实测出来的硬约束**：

- 桌面端的宿主是 Chromium 起的，**进程在一个 job object 里**。被杀时 job 一关，里面的成员**一起没** —— helper 如果也在里面，就没人把 DSH 拉回来了。
- 直接 `spawn(..., { detached: true })` 在 Windows 上还有第二个坑：**PowerShell 被 detached 起来后什么都不做**（进程秒退、退出码 0、脚本一行都没跑）。这是实测结论，不是猜的。

所以 Windows 上走的是：**生成一个 `.lnk`，让 `explorer.exe` 去启动 helper**。
Explorer 在 job 之外、在交互会话里，由它起的进程才能**活过这次重启**，也才能把窗口放回用户桌面上。
（拿不到 Explorer 时退化成普通子进程，并在报告里写明这是降级路径。）
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · dsh-restart-planner 完成一个合格任务的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

首次要执行 status/resolve 与 dryRun，确认 targetPid、killList、拉起命令和手工救援；每次真实重启付出 delay+quiet+停机时间，正在运行的工具被终止；失败时需读 last/resume/helper 日志，手工拉起并决定是否调用 resume，避免未确认状态重复任务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:372-460](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/lib/index.js#L372-L460)

固定版本源码用于核对 Q06 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（89行）</summary>

```text
/**
 * 重启后把「继续」投递进那个会话。
 *
 * 用 `sessionController.prompt`（0.2.x 的现成入口）而不是 dsh-restart 的
 * `agent.followup`（那个 API 在 0.2.x 已经不存在）。**投递成功才删标记**，
 * 失败保留，下次启动还能再试。
 *
 * @param {object} ctx 宿主上下文
 * @param {string} stateDir 状态目录
 * @param {object} cfg 插件配置
 * @returns {() => void} 取消函数
 */
function startResumeDelivery(ctx, stateDir, cfg) {
  if (cfg.resumeAfterRestart === false) return () => {};
  if (readResume(stateDir) === null) return () => {};
  const pauseMs = Number.isFinite(cfg.resumeDelayMs) ? Math.max(0, cfg.resumeDelayMs) : 8000;
  const timer = setTimeout(() => {
    logResume(stateDir, 'startup: 发现恢复标记，开始投递');
    const promptFor = async (sessionId, prompt) => {
      const svc = typeof ctx?.get === 'function' ? ctx.get('sessionController') : undefined;
      if (svc === null || svc === undefined || typeof svc.prompt !== 'function') {
        throw new Error(`sessionController 不可用（typeof prompt=${typeof svc?.prompt}）`);
      }
      // 第二个参数是**必需的 AbortSignal**：不传就会在服务内部 `signal.throwIfAborted()` 上炸
      // （2026-10-17 实测错误：Cannot read properties of undefined (reading 'throwIfAborted')）。
      const controller = new AbortController();
      const kill = setTimeout(() => controller.abort(), 30000);
      kill.unref?.();
      try {
        const result = await svc.prompt({
          requestId: `resume-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          sessionId,
          mode: 'queue',
          content: [{ type: 'text', text: prompt }],
        }, controller.signal);
        if (result !== null && typeof result === 'object' && result.accepted === false) {
          throw new Error(`prompt 未被接受：${JSON.stringify(result).slice(0, 160)}`);
        }
      } finally {
        clearTimeout(kill);
      }
    };
    const log = (line) => {
      logResume(stateDir, line);
      if (cfg.quiet !== true) console.error(`[dsh-restart-planner] ${line}`);
    };
    deliverResume({
      stateDir,
      promptFor,
      retries: Number.isFinite(cfg.resumeRetries) ? cfg.resumeRetries : 6,
      retryDelayMs: Number.isFinite(cfg.resumeRetryDelayMs) ? cfg.resumeRetryDelayMs : 3000,
      log,
    }).catch((err) => log(`resume: 投递过程出错：${err instanceof Error ? err.message : String(err)}`));
  }, pauseMs);
  timer.unref?.();
  return () => clearTimeout(timer);
}

/**
 * 挂载插件。
 * @param {import('@deepseek-ai/cordis').Context} ctx 宿主上下文
 * @param {object} [config] 插件配置
 */
export function apply(ctx, config) {
  const cfg = config ?? {};
  if (cfg.enabled === false) return;
  const { stateDir, sessionRoot } = paths(cfg);
  const disposers = [];

  // 重启后自动继续：本进程起来时如果还有恢复标记，等宿主安顿一下就把「继续」投进去。
  try {
    disposers.push(startResumeDelivery(ctx, stateDir, cfg));
  } catch {
    /* 投递只该是加分项，绝不该拖垮插件加载 */
  }

  if (ctx.tools !== undefined && typeof ctx.tools.register === 'function') {
    disposers.push(ctx.tools.register(defineTool({
      name: 'self_restart',
      description: [
        '让 agent 自己安排一次宿主（DSH）重启：装/改插件、改了 .js、需要重载宿主时用，不必再让用户手动关开。',
        "action='schedule'：排程重启。**调用后立刻返回**，真正的「停 + 拉」发生在你这一轮回复送达、且会话日志落盘安静之后（默认 T+20s 起、静默 4s、最长等 180s）。之后把这一轮正常说完即可。",
        "  可选参数：reason（写进报告的动机）、delaySeconds（至少等多久）、quietSeconds、maxWaitSeconds、dryRun（只演算不动手）、relaunchCommand（特殊启动器/包装脚本才需要）。",
        "action='status'：体检 + 报告 —— 当前 pid 与运行时长、现在重启会结束哪些进程、用什么命令拉回来、上一次重启的结果（重启回来后的第一条消息应该先看它）。",
        "action='cancel'：撤掉还没执行的那次排程。",
        '典型用法：装完插件/改完代码 → schedule(reason) → 说完这一轮 → 重启后 status 汇报结果。',
        '它平时完全静默：不常驻、不轮询、不占资源，只在你真的调用时才动。',
      ].join('\n'),
      timeoutMs: 60000,
```

</details>

#### 缺口

- 自动继续对有外部副作用任务的判重能力未知
  **影响**：可能在重启后重复发布、写文件或调用服务
  **进一步探讨**：用含幂等/非幂等步骤的故障注入任务验证每个重启阶段，统计重复副作用与丢步骤

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · dsh-restart-planner 的工程可靠性和可迁移设计如何？

**研究主题**：工程质量与复用

#### 完整回答

排程、计划解析、helper 和 resume 投递拆分，授权标记与临时目录闸防测试误杀，恢复标记采用“成功才删”。可复用的是跨重启交接协议；迁移到别的宿主必须重新证明进程树、写盘安静信号和 prompt 幂等。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:372-460](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/lib/index.js#L372-L460)

固定版本源码用于核对 Q07 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（89行）</summary>

```text
/**
 * 重启后把「继续」投递进那个会话。
 *
 * 用 `sessionController.prompt`（0.2.x 的现成入口）而不是 dsh-restart 的
 * `agent.followup`（那个 API 在 0.2.x 已经不存在）。**投递成功才删标记**，
 * 失败保留，下次启动还能再试。
 *
 * @param {object} ctx 宿主上下文
 * @param {string} stateDir 状态目录
 * @param {object} cfg 插件配置
 * @returns {() => void} 取消函数
 */
function startResumeDelivery(ctx, stateDir, cfg) {
  if (cfg.resumeAfterRestart === false) return () => {};
  if (readResume(stateDir) === null) return () => {};
  const pauseMs = Number.isFinite(cfg.resumeDelayMs) ? Math.max(0, cfg.resumeDelayMs) : 8000;
  const timer = setTimeout(() => {
    logResume(stateDir, 'startup: 发现恢复标记，开始投递');
    const promptFor = async (sessionId, prompt) => {
      const svc = typeof ctx?.get === 'function' ? ctx.get('sessionController') : undefined;
      if (svc === null || svc === undefined || typeof svc.prompt !== 'function') {
        throw new Error(`sessionController 不可用（typeof prompt=${typeof svc?.prompt}）`);
      }
      // 第二个参数是**必需的 AbortSignal**：不传就会在服务内部 `signal.throwIfAborted()` 上炸
      // （2026-10-17 实测错误：Cannot read properties of undefined (reading 'throwIfAborted')）。
      const controller = new AbortController();
      const kill = setTimeout(() => controller.abort(), 30000);
      kill.unref?.();
      try {
        const result = await svc.prompt({
          requestId: `resume-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          sessionId,
          mode: 'queue',
          content: [{ type: 'text', text: prompt }],
        }, controller.signal);
        if (result !== null && typeof result === 'object' && result.accepted === false) {
          throw new Error(`prompt 未被接受：${JSON.stringify(result).slice(0, 160)}`);
        }
      } finally {
        clearTimeout(kill);
      }
    };
    const log = (line) => {
      logResume(stateDir, line);
      if (cfg.quiet !== true) console.error(`[dsh-restart-planner] ${line}`);
    };
    deliverResume({
      stateDir,
      promptFor,
      retries: Number.isFinite(cfg.resumeRetries) ? cfg.resumeRetries : 6,
      retryDelayMs: Number.isFinite(cfg.resumeRetryDelayMs) ? cfg.resumeRetryDelayMs : 3000,
      log,
    }).catch((err) => log(`resume: 投递过程出错：${err instanceof Error ? err.message : String(err)}`));
  }, pauseMs);
  timer.unref?.();
  return () => clearTimeout(timer);
}

/**
 * 挂载插件。
 * @param {import('@deepseek-ai/cordis').Context} ctx 宿主上下文
 * @param {object} [config] 插件配置
 */
export function apply(ctx, config) {
  const cfg = config ?? {};
  if (cfg.enabled === false) return;
  const { stateDir, sessionRoot } = paths(cfg);
  const disposers = [];

  // 重启后自动继续：本进程起来时如果还有恢复标记，等宿主安顿一下就把「继续」投进去。
  try {
    disposers.push(startResumeDelivery(ctx, stateDir, cfg));
  } catch {
    /* 投递只该是加分项，绝不该拖垮插件加载 */
  }

  if (ctx.tools !== undefined && typeof ctx.tools.register === 'function') {
    disposers.push(ctx.tools.register(defineTool({
      name: 'self_restart',
      description: [
        '让 agent 自己安排一次宿主（DSH）重启：装/改插件、改了 .js、需要重载宿主时用，不必再让用户手动关开。',
        "action='schedule'：排程重启。**调用后立刻返回**，真正的「停 + 拉」发生在你这一轮回复送达、且会话日志落盘安静之后（默认 T+20s 起、静默 4s、最长等 180s）。之后把这一轮正常说完即可。",
        "  可选参数：reason（写进报告的动机）、delaySeconds（至少等多久）、quietSeconds、maxWaitSeconds、dryRun（只演算不动手）、relaunchCommand（特殊启动器/包装脚本才需要）。",
        "action='status'：体检 + 报告 —— 当前 pid 与运行时长、现在重启会结束哪些进程、用什么命令拉回来、上一次重启的结果（重启回来后的第一条消息应该先看它）。",
        "action='cancel'：撤掉还没执行的那次排程。",
        '典型用法：装完插件/改完代码 → schedule(reason) → 说完这一轮 → 重启后 status 汇报结果。',
        '它平时完全静默：不常驻、不轮询、不占资源，只在你真的调用时才动。',
      ].join('\n'),
      timeoutMs: 60000,
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与限制可推导什么可证伪的新设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是给恢复标记增加原任务幂等键与上一步完成摘要，可把“继续一句话”升级为可判重的恢复协议。最小实验让 20 个含外部写入的任务在四个阶段重启，比较当前 prompt 与幂等恢复的重复副作用、丢步骤率和人工接管次数；任一重复写远端即否定自动恢复。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:372-460](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/lib/index.js#L372-L460)

固定版本源码用于核对 Q08 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（89行）</summary>

```text
/**
 * 重启后把「继续」投递进那个会话。
 *
 * 用 `sessionController.prompt`（0.2.x 的现成入口）而不是 dsh-restart 的
 * `agent.followup`（那个 API 在 0.2.x 已经不存在）。**投递成功才删标记**，
 * 失败保留，下次启动还能再试。
 *
 * @param {object} ctx 宿主上下文
 * @param {string} stateDir 状态目录
 * @param {object} cfg 插件配置
 * @returns {() => void} 取消函数
 */
function startResumeDelivery(ctx, stateDir, cfg) {
  if (cfg.resumeAfterRestart === false) return () => {};
  if (readResume(stateDir) === null) return () => {};
  const pauseMs = Number.isFinite(cfg.resumeDelayMs) ? Math.max(0, cfg.resumeDelayMs) : 8000;
  const timer = setTimeout(() => {
    logResume(stateDir, 'startup: 发现恢复标记，开始投递');
    const promptFor = async (sessionId, prompt) => {
      const svc = typeof ctx?.get === 'function' ? ctx.get('sessionController') : undefined;
      if (svc === null || svc === undefined || typeof svc.prompt !== 'function') {
        throw new Error(`sessionController 不可用（typeof prompt=${typeof svc?.prompt}）`);
      }
      // 第二个参数是**必需的 AbortSignal**：不传就会在服务内部 `signal.throwIfAborted()` 上炸
      // （2026-10-17 实测错误：Cannot read properties of undefined (reading 'throwIfAborted')）。
      const controller = new AbortController();
      const kill = setTimeout(() => controller.abort(), 30000);
      kill.unref?.();
      try {
        const result = await svc.prompt({
          requestId: `resume-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          sessionId,
          mode: 'queue',
          content: [{ type: 'text', text: prompt }],
        }, controller.signal);
        if (result !== null && typeof result === 'object' && result.accepted === false) {
          throw new Error(`prompt 未被接受：${JSON.stringify(result).slice(0, 160)}`);
        }
      } finally {
        clearTimeout(kill);
      }
    };
    const log = (line) => {
      logResume(stateDir, line);
      if (cfg.quiet !== true) console.error(`[dsh-restart-planner] ${line}`);
    };
    deliverResume({
      stateDir,
      promptFor,
      retries: Number.isFinite(cfg.resumeRetries) ? cfg.resumeRetries : 6,
      retryDelayMs: Number.isFinite(cfg.resumeRetryDelayMs) ? cfg.resumeRetryDelayMs : 3000,
      log,
    }).catch((err) => log(`resume: 投递过程出错：${err instanceof Error ? err.message : String(err)}`));
  }, pauseMs);
  timer.unref?.();
  return () => clearTimeout(timer);
}

/**
 * 挂载插件。
 * @param {import('@deepseek-ai/cordis').Context} ctx 宿主上下文
 * @param {object} [config] 插件配置
 */
export function apply(ctx, config) {
  const cfg = config ?? {};
  if (cfg.enabled === false) return;
  const { stateDir, sessionRoot } = paths(cfg);
  const disposers = [];

  // 重启后自动继续：本进程起来时如果还有恢复标记，等宿主安顿一下就把「继续」投进去。
  try {
    disposers.push(startResumeDelivery(ctx, stateDir, cfg));
  } catch {
    /* 投递只该是加分项，绝不该拖垮插件加载 */
  }

  if (ctx.tools !== undefined && typeof ctx.tools.register === 'function') {
    disposers.push(ctx.tools.register(defineTool({
      name: 'self_restart',
      description: [
        '让 agent 自己安排一次宿主（DSH）重启：装/改插件、改了 .js、需要重载宿主时用，不必再让用户手动关开。',
        "action='schedule'：排程重启。**调用后立刻返回**，真正的「停 + 拉」发生在你这一轮回复送达、且会话日志落盘安静之后（默认 T+20s 起、静默 4s、最长等 180s）。之后把这一轮正常说完即可。",
        "  可选参数：reason（写进报告的动机）、delaySeconds（至少等多久）、quietSeconds、maxWaitSeconds、dryRun（只演算不动手）、relaunchCommand（特殊启动器/包装脚本才需要）。",
        "action='status'：体检 + 报告 —— 当前 pid 与运行时长、现在重启会结束哪些进程、用什么命令拉回来、上一次重启的结果（重启回来后的第一条消息应该先看它）。",
        "action='cancel'：撤掉还没执行的那次排程。",
        '典型用法：装完插件/改完代码 → schedule(reason) → 说完这一轮 → 重启后 status 汇报结果。',
        '它平时完全静默：不常驻、不轮询、不占资源，只在你真的调用时才动。',
      ].join('\n'),
      timeoutMs: 60000,
```

</details>

#### 缺口

- 自动继续对有外部副作用任务的判重能力未知
  **影响**：可能在重启后重复发布、写文件或调用服务
  **进一步探讨**：用含幂等/非幂等步骤的故障注入任务验证每个重启阶段，统计重复副作用与丢步骤

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人应观察、试用或拒绝采用 dsh-restart-planner？

**研究主题**：采用判断

#### 完整回答

仅建议具备救援入口的插件开发环境观察；先 dryRun，随后在空闲会话做一次 confirm=true、resume=false 的真实重启，再单独验证恢复投递。生产工作站、长事务或不可重复外部写入期间不应让 agent 自主 schedule；last.json 不为 ok 或 resume 标记滞留时停止自动继续。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-49](https://github.com/7gzgn/dsh-restart-planner/blob/31562ec5555d6e93a81c251b39d173b5d80c03c6/README.md#L28-L49)

固定版本作者材料支持 Q09 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（22行）</summary>

```text
## 它是怎么破的

三段式，把「一次自杀」拆成**三个互不相干的进程**：

| 阶段 | 谁在做 | 做什么 |
|---|---|---|
| **1. 排程** | 你（agent / 用户） | 调用 `self_restart` → 立刻返回。**这一轮还没结束，什么都还没发生。** |
| **2. 交接** | 插件（宿主里） | 算好"要杀谁、用什么命令拉回来"，把任务交给一个**在宿主进程树之外**的 helper，并等它回来报到 |
| **3. 动手** | helper（独立进程） | 先等 `delaySeconds`（让这一轮回复送达）→ 再等会话日志**落盘安静** → 停 → 拉 → 体检 → 写报告 |

关键在第 2 步：**helper 必须活过它自己杀掉的那棵进程树。**

### Windows 上为什么必须绕道 Explorer

这不是"保险起见"，是**实测出来的硬约束**：

- 桌面端的宿主是 Chromium 起的，**进程在一个 job object 里**。被杀时 job 一关，里面的成员**一起没** —— helper 如果也在里面，就没人把 DSH 拉回来了。
- 直接 `spawn(..., { detached: true })` 在 Windows 上还有第二个坑：**PowerShell 被 detached 起来后什么都不做**（进程秒退、退出码 0、脚本一行都没跑）。这是实测结论，不是猜的。

所以 Windows 上走的是：**生成一个 `.lnk`，让 `explorer.exe` 去启动 helper**。
Explorer 在 job 之外、在交互会话里，由它起的进程才能**活过这次重启**，也才能把窗口放回用户桌面上。
（拿不到 Explorer 时退化成普通子进程，并在报告里写明这是降级路径。）
```

</details>

#### 缺口

- 自动继续对有外部副作用任务的判重能力未知
  **影响**：可能在重启后重复发布、写文件或调用服务
  **进一步探讨**：用含幂等/非幂等步骤的故障注入任务验证每个重启阶段，统计重复副作用与丢步骤

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
