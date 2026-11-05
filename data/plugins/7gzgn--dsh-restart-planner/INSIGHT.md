# dsh-restart-planner

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b115ddb](https://github.com/7gzgn/dsh-restart-planner/tree/b115ddb47fcad13c2581d359cd0fd827e9db3f76)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7gzgn/dsh-restart-planner) [![npm 30d 777](https://img.shields.io/static/v1?label=npm+30d&message=777&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-restart-planner) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-restart-planner)
<!-- END META -->

> **功能**：让代理排程宿主自重启，等待会话落盘后由外部 helper 停拉进程并向原会话投递继续提示。

> **亮点**：[Q03](#research-q03) 增量是延迟重启计划、跨生命周期helper与会话继续标记的组合；静默只是一种启发式，不保证回复送达或落盘完成。

> **主要限制**：[Q04](#research-q04) 静默超时、取消与TCP健康都不能证明原任务安全交接；[Q07](#research-q07) 继续提示缺幂等收据。

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
| 计划与状态 | 解析目标、停止范围、拉起参数及历史报告 | status/dry-run只读演算，不证明重启可用 |
| 延迟重启排程 | helper等待延迟/静默后停止并重拉 | 最长静默到期仍继续；强停会中断工作 |
| 取消待排程 | 为最后pending写取消标记并等退出 | helperExited=false不保证取消，不能撤销已发生停止 |
| 会话继续投递 | 持久标记支持启动重试与手动resume | 接受不等任务完成；标记删除失败可能重复 |

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
| 核计划 | status/dry-run核PID、killList、exe参数cwd | 只演算，不启动helper |
| 确认与排程 | 可选confirm并检查实际fallback；关闭resume先测开发环境 | 排程ok还须核resume.ok，未确认状态不重排 |
| 等待停拉 | helper延迟/静默后执行 | maxWait到期仍继续；核killFailures与新进程 |
| 恢复 | 核真实会话与外部结果后处理继续标记 | prompt接受非任务恢复，重复/未知暂停人工判断 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地目录/日志资源，未新增独立API收费 | 核目标、命令、cwd并建立手工救援 | 演算不验证真实重启；工时未知 |
| 持续 | 重拉与中断任务计算，可能重复宿主模型调用 | 等待delay/quiet/health并核新进程 | 默认20秒延迟/4秒静默并非实测停机；费用未知 |
| 失败 | 重试/重拉和日志占用 | 核helperExited、last、resume及外部写入，再决定手工补投 | 取消不确定、标记删除失败可重投；恢复时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 计划可见 | 返回目标和停止/拉起范围 | 目标解析实际准确性未运行验证 |
| 跨进程重拉 | Explorer或detached helper执行链 | 存活/启动成功率与最后写入完整性未知 |
| 会话提示 | 持久标记及接受后清理尝试 | 非幂等任务恢复，删除失败可再次投递 |

> **思考**：[Q04](#research-q04) 静默超时、取消与TCP健康都不能证明原任务安全交接；[Q07](#research-q07) 继续提示缺幂等收据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q03](#research-q03) 增量是延迟重启计划、跨生命周期helper与会话继续标记的组合；静默只是一种启发式，不保证回复送达或落盘完成。

排程、计划解析、helper 和 resume 投递拆分，授权标记与临时目录闸防测试误杀，恢复标记采用“成功才删”。可复用的是跨重启交接协议；迁移到别的宿主必须重新证明进程树、写盘安静信号和 prompt 幂等。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04) 静默超时、取消与TCP健康都不能证明原任务安全交接；[Q07](#research-q07) 继续提示缺幂等收据。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅建议具备救援入口的插件开发环境观察；先 dryRun，随后在空闲会话做一次 confirm=true、resume=false 的真实重启，再单独验证恢复投递。生产工作站、长事务或不可重复外部写入期间不应让 agent 自主 schedule；last.json 不为 ok 或 resume 标记滞留时停止自动继续。 详见[Q09](#research-q09)。

先用 dryRun 固定 target/killList/command，再在隔离 Host 注入写盘未静默、helper 中断、健康检查失败和 prompt 拒绝；分别核 last 状态、resume 标记保留、手工救援与任务副作用是否只发生一次。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认了 self_restart 的排程/取消/状态入口、明确目标与授权闸、会话静默等待、外部 helper 以及成功才清除的 resume 标记；本轮未真实停止 Host，也未注入 prompt 拒绝或外部副作用任务，故不能证明最后写入不丢失或自动继续不会重复业务动作。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/core.js、lib/helper.ps1、lib/helper.mjs、lib/resume.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定index/core/plan/resume、POSIX helper及Git原始Windows helper完整关键分支；未运行任何重启或进程探测。
- 下一步：- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 31562ec5555d6e93a81c251b39d173b5d80c03c6 的作者材料、入口与关键源码；不运行插件、测试、外部服务或真实 Host；检查时间不早于 2026-10-22T15:49:47Z。
- 下一步：先用 dryRun 固定 target/killList/command，再在隔离 Host 注入写盘未静默、helper 中断、健康检查失败和 prompt 拒绝；分别核 last 状态、resume 标记保留、手工救援与任务副作用是否只发生一次。

**分析版本**

- **仓库**：[7gzgn/dsh-restart-planner](https://github.com/7gzgn/dsh-restart-planner)
- **版本号**：0.4.6（[固定提交 b115ddb](https://github.com/7gzgn/dsh-restart-planner/tree/b115ddb47fcad13c2581d359cd0fd827e9db3f76)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是给恢复标记增加原任务幂等键与上一步完成摘要，可把“继续一句话”升级为可判重的恢复协议。最小实验让 20 个含外部写入的任务在四个阶段重启，比较当前 prompt 与幂等恢复的重复副作用、丢步骤率和人工接管次数；任一重复写远端即否定自动恢复。 详见[Q08](#research-q08)。

先用 dryRun 固定 target/killList/command，再在隔离 Host 注入写盘未静默、helper 中断、健康检查失败和 prompt 拒绝；分别核 last 状态、resume 标记保留、手工救援与任务副作用是否只发生一次。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 31562ec5555d6e93a81c251b39d173b5d80c03c6 的作者材料、入口与关键源码；不运行插件、测试、外部服务或真实 Host；检查时间不早于 2026-10-22T15:49:47Z。
- 下一步：先用 dryRun 固定 target/killList/command，再在隔离 Host 注入写盘未静默、helper 中断、健康检查失败和 prompt 拒绝；分别核 last 状态、resume 标记保留、手工救援与任务副作用是否只发生一次。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 3 | 722 | 597 | 76 | — |
| .js | source | 4 | 1672 | 1122 | 457 | — |
| .md | source | 1 | 220 | — | — | 2908 |
| .mjs | example | 2 | 93 | 60 | 22 | — |
| .mjs | test | 1 | 694 | 560 | 85 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/7gzgn/dsh-restart-planner/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：插件开发者能否跨宿主重启保持可审计交接，并避免重复执行未确认的任务？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种重复场景需要 dsh-restart-planner，合格交付与简单替代是什么？

**研究主题**：场景与需求

#### 完整回答

代理安装或修改 Host 插件后需要重启才能继续，但当前进程不能杀死自己；基线是让用户手工重开并再次提示继续。合格结果是本轮回复先送达、会话落盘、明确目标被重拉、状态可审计，且自动继续只在新进程接受 prompt 后清标记。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-49](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/README.md#L28-L49)

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

真实工具先resolveConfirm，再scheduleRestart；core在非dry-run时写.allow-real-restart，解析目标、分派helper后写pending，之后工具才另写resume。故排程成功与恢复标记写成功分开，返回ok:true仍须检查resume.ok；立即重启也存在标记尚未写入的窗口。dry-run在dispatchHelper直接返回，不启动helper、不写pending，因此只能审计划，不能证明停止/拉起可用。Windows arm先冻结targetPid，再经Explorer .lnk交接并等boot文件；失败回退普通子进程并发warning，该回退可能随job退出死亡。POSIX detached走另一条实现，不继承Windows安全保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:372-460](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/index.js#L372-L460)

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

**依据 2 · 源码核查**：[lib/index.js:577-616](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/index.js#L577-L616)

排程先于恢复标记；两种结果分开。

<details>
<summary>查看原文（40行）</summary>

```text
        try {
          if (action === 'schedule') {
            const dryRun = a.dryRun === true || cfg.dryRun === true;
            const asked = await resolveConfirm(a, cfg, ctx, dryRun, exec ?? null);
            if (asked.canceled === true) {
              return { ok: true, action, data: { canceled: true, reason: 'user-canceled', confirm: asked.confirm, stateDir } };
            }
            const forcedDelay = asked.confirm?.delaySeconds ?? null;
            const result = await scheduleRestart({
              ...common,
              schedule: {
                delaySeconds: forcedDelay === null ? a.delaySeconds : forcedDelay,
                quietSeconds: a.quietSeconds,
                maxWaitSeconds: a.maxWaitSeconds,
                reason: typeof a.reason === 'string' ? a.reason : '',
              },
              dryRun,
              relaunchCommand: typeof a.relaunchCommand === 'string' ? a.relaunchCommand : undefined,
              // 「临时目录也能真排程」这个口子默认关着 —— 只有调用方显式要、或插件配置里写了 force
              // 才放行。留给「确实要真动手的集成测试」，避免测试把炸弹排到真宿主头上。
              force: a.force === true || cfg.force === true,
            });
            // 重启后自动继续：记下「哪个会话 + 继续时说什么」。dry run 不记（没真重启）。
            let resume = null;
            if (!dryRun && (a.resume !== false) && cfg.resumeAfterRestart !== false) {
              const sessionId = initiatorSessionId(ctx);
              if (sessionId === null) {
                resume = { ok: false, sessions: 0, error: '拿不到当前会话 id（不在 agent 调用链里？）' };
              } else {
                const prompt = typeof a.continuePrompt === 'string' && a.continuePrompt !== ''
                  ? a.continuePrompt
                  : (typeof cfg.continuePrompt === 'string' && cfg.continuePrompt !== '' ? cfg.continuePrompt : DEFAULT_CONTINUE_PROMPT);
                resume = writeResume(stateDir, { sessionId, prompt });
              }
            }
            return { ok: true, action, data: { ...result, confirm: asked.confirm ?? null, resume, stateDir } };
          }

          if (action === 'cancel') {
            const result = await cancelPending({ stateDir });
```

</details>

**依据 3 · 源码核查**：[lib/core.js:181-205](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/core.js#L181-L205)

dry-run不分派；平台分支。

<details>
<summary>查看原文（25行）</summary>

```text
export async function dispatchHelper(payload, timeoutMs = 45000) {
  // dry run 的语义是「只演算、绝不动手」——那就**连 helper 都不该放出去**。
  // （2026-10-16 实测的 bug：dry run 照样 arm 了一个 helper、返回里还带 helperPid，
  //  于是测试里出现「取消也排了程」的假象。）
  if (payload !== null && typeof payload === 'object' && payload.dryRun === true) {
    return { mode: 'dry-run', helperPid: null };
  }
  if (isWindows) {
    const result = await runHelper('arm', payload, timeoutMs);
    if (result.ok !== true) throw new Error(result.error ?? 'helper 交接失败');
    const out = {
      mode: String(result.mode ?? 'unknown'),
      helperPid: Number.isFinite(Number(result.helperPid)) ? Number(result.helperPid) : null,
    };
    if (typeof result.warning === 'string' && result.warning !== '') out.warning = result.warning;
    return out;
  }
  const { file, args } = await helperCommand('run', payload);
  const env = { ...process.env };
  if (!/node$/i.test(process.execPath)) env.ELECTRON_RUN_AS_NODE = '1';
  const child = spawn(file, args, { detached: true, stdio: 'ignore', env });
  child.unref();
  return { mode: 'posix-detached', helperPid: typeof child.pid === 'number' ? child.pid : null };
}

```

</details>

**依据 4 · 源码核查**：[lib/helper.ps1:314-410](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/helper.ps1#L314-L410)

目标冻结与Explorer/普通子进程交接。

<details>
<summary>查看原文（97行）</summary>

```text
    Remove-Item -LiteralPath $bootPath -Force -ErrorAction SilentlyContinue

    # Freeze the target NOW, while the caller is still guaranteed to be alive.
    # The arming process is often short-lived (the CLI exits as soon as arming
    # returns), and the handed-over helper runs seconds later - if it had to walk
    # the ancestor chain again at that point, the chain's first link would be gone.
    $armed = Resolve-Plan -Payload $Payload
    if ($null -eq $armed -or [int]$armed.targetPid -le 0) {
        return [ordered]@{ ok = $false; action = 'arm'; id = $id; error = 'cannot resolve a restart target' }
    }
    $Payload | Add-Member -NotePropertyName targetPid -NotePropertyValue ([int]$armed.targetPid) -Force

    Write-JsonFile -Path $payloadPath -Object $Payload

    $helperPath = Get-HelperPath
    $waitSeconds = 20
    if ($null -ne $Payload.armWaitSeconds) {
        $parsed = [int]$Payload.armWaitSeconds
        if ($parsed -gt 0) { $waitSeconds = $parsed }
    }

    $result = [ordered]@{
        ok = $true
        action = 'arm'
        id = $id
        payloadPath = $payloadPath
        helperPath = $helperPath
        stateDir = $stateDir
        targetPid = [int]$armed.targetPid
        targetName = [string]$armed.targetName
        relaunchCommand = [string]$armed.relaunchCommand
        resolution = [string]$armed.resolution
    }

    # --- route 1: let Explorer start it (outside the application's job object)
    $launched = $false
    $launchError = ''
    if (Test-Path -LiteralPath (Join-Path $env:SystemRoot 'explorer.exe')) {
        try {
            $arguments = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$helperPath`" -Action run -PayloadFile `"$payloadPath`""
            $shell = New-Object -ComObject WScript.Shell
            $link = $shell.CreateShortcut($lnkPath)
            $link.TargetPath = (Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe')
            $link.Arguments = $arguments
            $link.WorkingDirectory = $stateDir
            $link.WindowStyle = 7
            $link.Save()
            Start-Process -FilePath 'explorer.exe' -ArgumentList $lnkPath | Out-Null
            $deadline = (Get-Date).AddSeconds($waitSeconds)
            while ((Get-Date) -lt $deadline) {
                if (Test-Path -LiteralPath $bootPath) { $launched = $true; break }
                Start-Sleep -Milliseconds 400
            }
            if (-not $launched) { $launchError = "explorer route did not check in within $waitSeconds s" }
        }
        catch {
            $launchError = $_.Exception.Message
        }
    }
    else {
        $launchError = 'explorer.exe not found'
    }

    if ($launched) {
        $result['mode'] = 'explorer'
        $result['launchedAt'] = (Get-Date).ToString('o')
        $boot = $null
        try { $boot = ([IO.File]::ReadAllText($bootPath, (New-Utf8NoBom)) | ConvertFrom-Json) } catch { }
        if ($null -ne $boot -and $null -ne $boot.pid) { $result['helperPid'] = [int]$boot.pid }
        [IO.File]::AppendAllText($logPath, ("{0} [arm] explorer route ok, helper pid {1}`r`n" -f (Get-Date).ToString('o'), $result['helperPid']), (New-Utf8NoBom))
        Remove-Item -LiteralPath $lnkPath -Force -ErrorAction SilentlyContinue
        return $result
    }

    # --- route 2: plain child (survives a normal parent exit, not a job kill)
    $result['mode'] = 'direct'
    $result['warning'] = "explorer route unavailable ($launchError); started as a plain child instead"
    try {
        $pidDirect = Start-HelperDirectly -PayloadPath $payloadPath -HelperPath $helperPath -LogPath $logPath
        $result['helperPid'] = $pidDirect
        $deadline = (Get-Date).AddSeconds(15)
        while ((Get-Date) -lt $deadline) {
            if (Test-Path -LiteralPath $bootPath) { break }
            Start-Sleep -Milliseconds 300
        }
        if (-not (Test-Path -LiteralPath $bootPath)) {
            $result['ok'] = $false
            $result['error'] = "helper did not start (explorer: $launchError)"
        }
        return $result
    }
    catch {
        $result['ok'] = $false
        $result['error'] = "cannot start the helper: $($_.Exception.Message)"
        return $result
    }
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主原生能力或简单替代，dsh-restart-planner 的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对人工重启，它用延迟、会话文件静默启发式和外部helper尝试避开当前回复阶段，并用持久恢复标记跨越宿主生命周期；没有回复送达或落盘ACK保证。其增量适合开发代理流程，但目标解析和继续提示都需独立核验，不能当原任务快照自动恢复。

可确认增量是计划可检查、跨进程交接及会话继续提示的状态记录，不是快照恢复引擎。新宿主等待8秒后queue投递，30秒AbortSignal只约束单次prompt；accepted:false视失败，未返回明确拒绝即可当成功。每次requestId随机，无法把多次投递当同一幂等操作。它也不验证原工具已终止或上一步外部写入是否完成，恢复仍是模型重新判断。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-49](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/README.md#L28-L49)

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

**依据 2 · 源码核查**：[lib/index.js:382-431](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/index.js#L382-L431)

启动延迟、投递及accepted检查。

<details>
<summary>查看原文（50行）</summary>

```text
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
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使 dsh-restart-planner 的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最关键质疑是强制停止前的“静默”只能近似落盘完整，最后写入仍可能丢失；自动继续可能在环境尚未完全恢复时重复动作。默认 confirm=false 与 resume=true 对无人值守有利，却扩大误排程后果；重复 schedule 覆盖旧排程而不排队。

两个平台都在静默最长等待到期后写quiet-reached并继续，而不是超时拒绝；找不到会话写入也直接退出等待，所以该状态不是落盘ACK。Windows先Force停顶层、等子进程宽限再Force幸存者，killFailures留报告但后续仍可重拉。健康仅TCP端口重开，不验证新进程提供正确会话；无healthUrl也可ok。cancel写标记等最多5秒后即使helperExited=false仍删除标记，故返回ok不能证明helper停止；多个schedule各自启动helper、共享pending最后写覆盖，没有互斥队列，cancel只指向最后pending。POSIX的relaunchCommand override虽被报告，但实际spawn在relaunchArgv为null时回退targetExe，不等覆盖命令执行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:372-460](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/index.js#L372-L460)

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

**依据 2 · 源码核查**：[lib/helper.ps1:492-578](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/helper.ps1#L492-L578)

静默超时、Force停止与失败记录。

<details>
<summary>查看原文（87行）</summary>

```text
    $quiet = [int]$Payload.quietSeconds
    if ($quiet -lt 0) { $quiet = 0 }
    $maxWait = [int]$Payload.maxWaitSeconds
    if ($maxWait -le 0) { $maxWait = 180 }
    $hardCap = (Get-Date).AddSeconds($maxWait)
    $sessionRoot = [string]$Payload.sessionRoot
    $idleMs = $null
    $lastBeat = Get-Date
    while ((Get-Date) -lt $hardCap) {
        if (Is-Canceled) { Write-Report -State 'canceled' -Extra @{}; Write-Log 'canceled while waiting for quiet'; return $script:report }
        # Get-Process instead of a WMI query: a blocked CIM call hangs the whole
        # wait loop with no log line, which looks exactly like "waiting forever".
        $target = Get-Process -Id $plan.targetPid -ErrorAction SilentlyContinue
        if ($null -eq $target) {
            Write-Report -State 'exited-early' -Extra @{ note = 'the application exited on its own before the restart; relaunch skipped' }
            Write-Log 'target exited before we stopped it; not relaunching'
            return $script:report
        }
        $newest = Get-NewestSessionWrite -SessionRoot $sessionRoot
        if ($null -eq $newest) { break }
        $idle = ((Get-Date) - $newest).TotalMilliseconds
        if ($idle -ge ($quiet * 1000)) { $idleMs = [int]$idle; break }
        if (((Get-Date) - $lastBeat).TotalSeconds -ge 10) { Write-Log ("heartbeat: quiet wait, idle={0}ms, cap in {1}s" -f [int]$idle, [int]($hardCap - (Get-Date)).TotalSeconds); $lastBeat = Get-Date }
        Start-Sleep -Milliseconds 500
    }
    Write-Report -State 'quiet-reached' -Extra @{ idleMs = $idleMs }

    if ([bool]$Payload.dryRun) {
        Write-Report -State 'dry-run' -Extra @{ note = 'dry run: nothing was stopped' }
        Write-Log 'dry run: exiting without touching anything'
        return $script:report
    }

    if (Is-Canceled) { Write-Report -State 'canceled' -Extra @{}; return $script:report }

    # 2b) re-read the process table right before the kill: anything spawned by the
    #     asking turn after the first look belongs to this application too.
    try {
        $fresh = $null
        try {
            $fresh = Resolve-Plan -Payload $Payload
        }
        catch {
            # The caller can be gone by now (a CLI process, for instance). Fall back
            # to the target we already resolved rather than giving up on the refresh.
            $refreshed = [pscustomobject]@{ targetPid = $plan.targetPid; selfExe = [string]$Payload.selfExe }
            $fresh = Resolve-Plan -Payload $refreshed
            Write-Log 'kill list refreshed by explicit target (the original caller had exited)'
        }
        if ($null -ne $fresh.killList -and @($fresh.killList).Count -gt 0) {
            if (@($fresh.killList).Count -ne @($plan.killList).Count) {
                Write-Log ("kill list refreshed: {0} -> {1} process(es)" -f @($plan.killList).Count, @($fresh.killList).Count)
            }
            $plan.killList = $fresh.killList
        }
    }
    catch { Write-Log ("kill list refresh failed, using the original plan: {0}" -f $_.Exception.Message) }

    # 3) stop the application. The shell goes first on purpose: its death breaks
    #    the IPC channel and the host reacts with its own graceful shutdown,
    #    which flushes session state. Survivors are force-killed right after.
    $killFailed = @()
    $stopped = 0
    if ($null -ne (Get-ProcInfo -ProcessId $plan.targetPid)) {
        Write-Log ("stopping target {0}" -f $plan.targetPid)
        try { Stop-Process -Id $plan.targetPid -Force -ErrorAction Stop; $stopped++ }
        catch { $killFailed += "target $($plan.targetPid): $($_.Exception.Message)" }
    }

    $grace = [int]$Payload.graceSeconds
    if ($grace -le 0) { $grace = 8 }
    $graceDeadline = (Get-Date).AddSeconds($grace)
    while ((Get-Date) -lt $graceDeadline) {
        $alive = @($plan.killList | Where-Object { $null -ne (Get-ProcInfo -ProcessId ([int]$_.pid)) })
        if ($alive.Count -eq 0) { break }
        Start-Sleep -Milliseconds 300
    }

    foreach ($row in $plan.killList) {
        if ($null -eq (Get-ProcInfo -ProcessId ([int]$row.pid))) { continue }
        try { Stop-Process -Id ([int]$row.pid) -Force -ErrorAction Stop; $stopped++ }
        catch { $killFailed += "pid $($row.pid): $($_.Exception.Message)" }
    }
    $killedAt = Get-Date
    Write-Report -State 'stopped' -Extra @{ killedAt = $killedAt.ToString('o'); killFailures = $killFailed; killCount = $stopped }
    Write-Log ("stopped; count={0} failures={1}" -f $stopped, $killFailed.Count)

```

</details>

**依据 3 · 源码核查**：[lib/helper.ps1:652-679](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/helper.ps1#L652-L679)

端口健康及无探测ok边界。

<details>
<summary>查看原文（28行）</summary>

```text
    # 6) health check: the listener has to come back
    $healthy = $false
    if ($port -gt 0) {
        $healthSeconds = [int]$Payload.healthSeconds
        if ($healthSeconds -le 0) { $healthSeconds = 120 }
        $healthDeadline = (Get-Date).AddSeconds($healthSeconds)
        while ((Get-Date) -lt $healthDeadline) {
            if (Test-PortOpen -TargetHost $healthHost -Port $port -TimeoutMs 800) { $healthy = $true; break }
            Start-Sleep -Milliseconds 500
        }
    }
    $readyAt = Get-Date
    $elapsedMs = [int]($readyAt - $killedAt).TotalMilliseconds
    $finalState = 'ok'
    if ($port -gt 0 -and -not $healthy) { $finalState = 'started-but-unhealthy' }
    $extra = @{
        readyAt = $readyAt.ToString('o')
        healthy = $healthy
        portChecked = ($port -gt 0)
    }
    if ($port -gt 0) {
        # only a probed listener justifies the word "downtime"
        $extra['downtimeMs'] = $elapsedMs
    }
    else {
        $extra['relaunchMs'] = $elapsedMs
        $extra['note'] = 'no health url: the listener was not probed, so this is launch latency, not downtime'
    }
```

</details>

**依据 4 · 源码核查**：[lib/core.js:378-407](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/core.js#L378-L407)

取消等待后清标记，不保证helper退出。

<details>
<summary>查看原文（30行）</summary>

```text
export async function cancelPending(options) {
  const { stateDir, waitMs = 5000 } = options;
  const pending = readPending(stateDir);
  if (pending === null || typeof pending.id !== 'string') {
    return { ok: false, error: '没有待执行的重启排程' };
  }
  mkdirSync(stateDir, { recursive: true });
  const cancelFile = join(stateDir, `cancel-${pending.id}`);
  writeFileSync(cancelFile, `${new Date().toISOString()}\n`, 'utf8');

  const helperPid = Number.isFinite(Number(pending.helperPid)) ? Number(pending.helperPid) : null;
  let helperExited = false;
  if (helperPid !== null) {
    const deadline = Date.now() + waitMs;
    while (Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (!isAlive(helperPid)) {
        helperExited = true;
        break;
      }
    }
  }
  writeFileSync(join(stateDir, 'pending.json'),
    `${JSON.stringify({ ...pending, canceled: true, canceledAt: new Date().toISOString(), helperExited }, null, 2)}\n`,
    'utf8');
  try {
    rmSync(cancelFile, { force: true });
  } catch {
    /* 标记删不掉不影响结果 */
  }
```

</details>

**依据 5 · 源码核查**：[lib/helper.mjs:355-375](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/helper.mjs#L355-L375)

POSIX实际spawn argv。

<details>
<summary>查看原文（21行）</summary>

```text
  const argv = plan.relaunchArgv ?? [plan.targetExe];
  log(`relaunching ${argv.join(' ')}`);
  let newPid = null;
  try {
    const child = spawn(argv[0], argv.slice(1), {
      detached: true,
      stdio: 'ignore',
      cwd: plan.workingDirectory,
      env: (() => {
        const env = { ...process.env };
        delete env.DSH_SESSION_ID;
        delete env.DSH_WEB_URL;
        delete env.DSH_SHELL;
        return env;
      })(),
    });
    child.unref();
    newPid = child.pid ?? null;
  } catch (err) {
    writeReport('relaunch-failed', { error: err.message, relaunchCommand: plan.relaunchCommand });
    log(`relaunch failed: ${err.message}`);
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-restart-planner 启动、持续生效与失败降级依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要兼容 DSH tools、sessionController、会话目录和可写状态目录；Windows 真机链依赖 Explorer/PowerShell，其他平台代码未真机验证。confirm 可选依赖 userQuestions；缺失时按明确 fallback。特殊启动器需 relaunchCommand，否则目标/命令解析失败应拒绝。

Windows依赖可读进程表、PowerShell、COM WScript.Shell和Explorer交互桌面；Explorer不可用会降级普通子进程，需人工判断能否存活。特殊包装器须逐项检查targetExe、参数与cwd，不能只看relaunchCommand字符串；POSIX命令覆盖问题使特殊启动器不宜自动使用。状态目录可写是排程与恢复前提；sessionController只在投递时获取，缺失会重试并保留标记，不能因插件加载成功视为恢复成功。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-49](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/README.md#L28-L49)

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

**依据 2 · 源码核查**：[lib/helper.ps1:301-410](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/helper.ps1#L301-L410)

Windows交接依赖与回退。

<details>
<summary>查看原文（110行）</summary>

```text
function Invoke-Arm {
    param($Payload)

    $stateDir = [string]$Payload.stateDir
    if ([string]::IsNullOrEmpty($stateDir)) { throw 'stateDir is required' }
    if (-not (Test-Path -LiteralPath $stateDir)) { New-Item -ItemType Directory -Path $stateDir -Force | Out-Null }
    $id = [string]$Payload.id
    if ([string]::IsNullOrEmpty($id)) { throw 'id is required' }
    $logPath = Join-Path $stateDir 'helper.log'
    $payloadPath = Join-Path $stateDir "payload-$id.json"
    $bootPath = Join-Path $stateDir "boot-$id.json"
    $lnkPath = Join-Path $stateDir "launch-$id.lnk"

    Remove-Item -LiteralPath $bootPath -Force -ErrorAction SilentlyContinue

    # Freeze the target NOW, while the caller is still guaranteed to be alive.
    # The arming process is often short-lived (the CLI exits as soon as arming
    # returns), and the handed-over helper runs seconds later - if it had to walk
    # the ancestor chain again at that point, the chain's first link would be gone.
    $armed = Resolve-Plan -Payload $Payload
    if ($null -eq $armed -or [int]$armed.targetPid -le 0) {
        return [ordered]@{ ok = $false; action = 'arm'; id = $id; error = 'cannot resolve a restart target' }
    }
    $Payload | Add-Member -NotePropertyName targetPid -NotePropertyValue ([int]$armed.targetPid) -Force

    Write-JsonFile -Path $payloadPath -Object $Payload

    $helperPath = Get-HelperPath
    $waitSeconds = 20
    if ($null -ne $Payload.armWaitSeconds) {
        $parsed = [int]$Payload.armWaitSeconds
        if ($parsed -gt 0) { $waitSeconds = $parsed }
    }

    $result = [ordered]@{
        ok = $true
        action = 'arm'
        id = $id
        payloadPath = $payloadPath
        helperPath = $helperPath
        stateDir = $stateDir
        targetPid = [int]$armed.targetPid
        targetName = [string]$armed.targetName
        relaunchCommand = [string]$armed.relaunchCommand
        resolution = [string]$armed.resolution
    }

    # --- route 1: let Explorer start it (outside the application's job object)
    $launched = $false
    $launchError = ''
    if (Test-Path -LiteralPath (Join-Path $env:SystemRoot 'explorer.exe')) {
        try {
            $arguments = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$helperPath`" -Action run -PayloadFile `"$payloadPath`""
            $shell = New-Object -ComObject WScript.Shell
            $link = $shell.CreateShortcut($lnkPath)
            $link.TargetPath = (Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe')
            $link.Arguments = $arguments
            $link.WorkingDirectory = $stateDir
            $link.WindowStyle = 7
            $link.Save()
            Start-Process -FilePath 'explorer.exe' -ArgumentList $lnkPath | Out-Null
            $deadline = (Get-Date).AddSeconds($waitSeconds)
            while ((Get-Date) -lt $deadline) {
                if (Test-Path -LiteralPath $bootPath) { $launched = $true; break }
                Start-Sleep -Milliseconds 400
            }
            if (-not $launched) { $launchError = "explorer route did not check in within $waitSeconds s" }
        }
        catch {
            $launchError = $_.Exception.Message
        }
    }
    else {
        $launchError = 'explorer.exe not found'
    }

    if ($launched) {
        $result['mode'] = 'explorer'
        $result['launchedAt'] = (Get-Date).ToString('o')
        $boot = $null
        try { $boot = ([IO.File]::ReadAllText($bootPath, (New-Utf8NoBom)) | ConvertFrom-Json) } catch { }
        if ($null -ne $boot -and $null -ne $boot.pid) { $result['helperPid'] = [int]$boot.pid }
        [IO.File]::AppendAllText($logPath, ("{0} [arm] explorer route ok, helper pid {1}`r`n" -f (Get-Date).ToString('o'), $result['helperPid']), (New-Utf8NoBom))
        Remove-Item -LiteralPath $lnkPath -Force -ErrorAction SilentlyContinue
        return $result
    }

    # --- route 2: plain child (survives a normal parent exit, not a job kill)
    $result['mode'] = 'direct'
    $result['warning'] = "explorer route unavailable ($launchError); started as a plain child instead"
    try {
        $pidDirect = Start-HelperDirectly -PayloadPath $payloadPath -HelperPath $helperPath -LogPath $logPath
        $result['helperPid'] = $pidDirect
        $deadline = (Get-Date).AddSeconds(15)
        while ((Get-Date) -lt $deadline) {
            if (Test-Path -LiteralPath $bootPath) { break }
            Start-Sleep -Milliseconds 300
        }
        if (-not (Test-Path -LiteralPath $bootPath)) {
            $result['ok'] = $false
            $result['error'] = "helper did not start (explorer: $launchError)"
        }
        return $result
    }
    catch {
        $result['ok'] = $false
        $result['error'] = "cannot start the helper: $($_.Exception.Message)"
        return $result
    }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:389-416](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/index.js#L389-L416)

sessionController延迟获取和失败。

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · dsh-restart-planner 完成一个合格任务的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

首次要执行 status/resolve 与 dryRun，确认 targetPid、killList、拉起命令和手工救援；每次真实重启付出 delay+quiet+停机时间，正在运行的工具被终止；失败时需读 last/resume/helper 日志，手工拉起并决定是否调用 resume，避免未确认状态重复任务。

现金没有独立API费用机制，但重拉的宿主模型任务可能重复产生费用，金额未知。持续代价包含默认20秒延迟、4秒静默、最长180秒等待及8秒子进程宽限，不能相加成测得停机。恢复投递默认6次、间隔3秒、单次30秒超时；超时或删除失败可能重复交接，先查实际会话与外部结果，再决定手工resume。取消返回后必须看helperExited与报告，不可立刻当无副作用；不要在自动继续尚未解除时循环重排。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:372-460](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/index.js#L372-L460)

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

**依据 2 · 源码核查**：[lib/index.js:420-430](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/index.js#L420-L430)

启动恢复重试参数。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/resume.js:111-127](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/resume.js#L111-L127)

删除/写回失败保留旧标记。

<details>
<summary>查看原文（17行）</summary>

```text
  if (next.length === 0) {
    try {
      rmSync(file, { force: true });
    } catch {
      /* 删不掉也无所谓：下次读出来是空 */
    }
    return;
  }
  try {
    writeFileSync(file, `${JSON.stringify({ sessions: next }, null, 2)}\n`, 'utf8');
  } catch {
    /* 写不回去就留着旧文件，下次还会重试 */
  }
}

/**
 * 把标记里的会话逐个投递一次「继续」。
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

所谓授权标记由scheduleRestart/runHelper自身写入，Windows helper只检查文件存在，未绑定用户确认、具体id、有效期；这是防实验误动的局部闸，不是人类授权协议。POSIX helper没有同等读取该标记的入口。resume.json用读改写而非事务：prompt接受后删除失败会保留，下次启动再发；成功前进程崩溃也可能重发，不能承诺恰好一次。取消不删除resume标记，取消重启后仍须检查自动继续是否会在后续启动发生。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:372-460](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/index.js#L372-L460)

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

**依据 2 · 源码核查**：[lib/core.js:96-106](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/core.js#L96-L106)

调用方自动生成标记。

<details>
<summary>查看原文（11行）</summary>

```text
function ensureAllowMarker(action, payload) {
  if (action !== 'arm' && action !== 'run') return;
  const stateDir = payload?.stateDir;
  if (typeof stateDir !== 'string' || stateDir === '') return;
  try {
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(join(stateDir, '.allow-real-restart'), `${new Date().toISOString()}\n${String(payload.id ?? '')}\n`, 'utf8');
  } catch {
    /* 写不进去就让 helper 自己拒绝（安全侧） */
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/helper.ps1:697-716](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/helper.ps1#L697-L716)

Windows仅验证文件存在。

<details>
<summary>查看原文（20行）</summary>

```text
    # BEFORE touching anything. Why: on 2026-10-16 a test run aimed the helper at
    # the live host and the user's app restarted four times. 'resolve' is read-only
    # and stays allowed.
    #
    # The flag is a FILE in the state directory, not an environment variable:
    # the arm hand-off goes through Explorer + a generated .lnk, and that hop
    # does not carry the caller's environment.
    if (($Action -eq 'arm') -or ($Action -eq 'run')) {
        $allowFile = Join-Path ([string]$payload.stateDir) '.allow-real-restart'
        if (-not (Test-Path -LiteralPath $allowFile)) {
            Emit ([ordered]@{
                ok    = $false
                action = $Action
                error = 'refused: real restart requires an explicit allow marker (.allow-real-restart in the state dir); a thrown-away helper must not move the live host'
            })
            exit 0
        }
    }

    if ($Action -eq 'resolve') {
```

</details>

**依据 4 · 源码核查**：[lib/resume.js:137-175](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/resume.js#L137-L175)

投递、重试与成功后删除。

<details>
<summary>查看原文（39行）</summary>

```text
 * @returns {Promise<{delivered:string[], kept:string[], errors:object[]}>} 结果
 */
export async function deliverResume(options) {
  const { stateDir, promptFor } = options;
  const retries = Number.isFinite(options.retries) ? options.retries : 2;
  const retryDelayMs = Number.isFinite(options.retryDelayMs) ? options.retryDelayMs : 2000;
  const log = typeof options.log === 'function' ? options.log : () => {};
  const marker = readResume(stateDir);
  const delivered = [];
  const kept = [];
  const errors = [];
  if (marker === null) return { delivered, kept, errors };

  for (const entry of marker.sessions) {
    let ok = false;
    for (let attempt = 1; attempt <= retries && !ok; attempt += 1) {
      try {
        await promptFor(entry.sessionId, entry.prompt);
        ok = true;
        logResume(stateDir, `delivered ${entry.sessionId} (attempt ${attempt})`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push({ sessionId: entry.sessionId, attempt, error: message });
        logResume(stateDir, `failed ${entry.sessionId} (attempt ${attempt}/${retries}): ${message}`);
        log(`resume: 第 ${attempt} 次投递失败（${entry.sessionId}）：${message}`);
        if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
    if (ok) {
      delivered.push(entry.sessionId);
      removeResume(stateDir, entry.sessionId);
      log(`resume: 已投递「继续」→ ${entry.sessionId}`);
    } else {
      kept.push(entry.sessionId);
      logResume(stateDir, `kept ${entry.sessionId} for the next startup`);
    }
  }
  return { delivered, kept, errors };
}
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与限制可推导什么可证伪的新设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是给恢复标记增加原任务幂等键与上一步完成摘要，可把“继续一句话”升级为可判重的恢复协议。最小实验让 20 个含外部写入的任务在四个阶段重启，比较当前 prompt 与幂等恢复的重复副作用、丢步骤率和人工接管次数；任一重复写远端即否定自动恢复。

还应注入静默持续写入直到maxWait、Explorer迟到boot/回退、cancel等待超时、prompt已接受但回执丢失、删除标记失败等反例；合格条件须是未知结果暂停人工判定，且旧恢复尝试不能再次写远端。任务摘要本身不提供服务侧幂等性，必须由实际外部写入端承认幂等键才可能改进。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:372-460](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/index.js#L372-L460)

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

**依据 2 · 源码核查**：[lib/resume.js:148-175](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/resume.js#L148-L175)

当前重试接受与删除分离，构成假设反例。

<details>
<summary>查看原文（28行）</summary>

```text
  if (marker === null) return { delivered, kept, errors };

  for (const entry of marker.sessions) {
    let ok = false;
    for (let attempt = 1; attempt <= retries && !ok; attempt += 1) {
      try {
        await promptFor(entry.sessionId, entry.prompt);
        ok = true;
        logResume(stateDir, `delivered ${entry.sessionId} (attempt ${attempt})`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push({ sessionId: entry.sessionId, attempt, error: message });
        logResume(stateDir, `failed ${entry.sessionId} (attempt ${attempt}/${retries}): ${message}`);
        log(`resume: 第 ${attempt} 次投递失败（${entry.sessionId}）：${message}`);
        if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
    if (ok) {
      delivered.push(entry.sessionId);
      removeResume(stateDir, entry.sessionId);
      log(`resume: 已投递「继续」→ ${entry.sessionId}`);
    } else {
      kept.push(entry.sessionId);
      logResume(stateDir, `kept ${entry.sessionId} for the next startup`);
    }
  }
  return { delivered, kept, errors };
}
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

观察阶段先做status与dry-run核目标，但不把演算当真实链验收。实际重启实验只应在用户自行选定的可丢弃开发会话、明确人工允许、没有长事务时进行；先关闭自动resume，核新进程、last状态、killFailures与真实会话，再单独测无副作用的继续。cancel helperExited=false、started-but-unhealthy、resume.ok:false、重复helper或不确定外部写入都应退出自动路径，人工重开并核实状态后处理残留标记。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-49](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/README.md#L28-L49)

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

**依据 2 · 源码核查**：[lib/core.js:378-407](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/core.js#L378-L407)

取消结果需独立核实helper退出。

<details>
<summary>查看原文（30行）</summary>

```text
export async function cancelPending(options) {
  const { stateDir, waitMs = 5000 } = options;
  const pending = readPending(stateDir);
  if (pending === null || typeof pending.id !== 'string') {
    return { ok: false, error: '没有待执行的重启排程' };
  }
  mkdirSync(stateDir, { recursive: true });
  const cancelFile = join(stateDir, `cancel-${pending.id}`);
  writeFileSync(cancelFile, `${new Date().toISOString()}\n`, 'utf8');

  const helperPid = Number.isFinite(Number(pending.helperPid)) ? Number(pending.helperPid) : null;
  let helperExited = false;
  if (helperPid !== null) {
    const deadline = Date.now() + waitMs;
    while (Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (!isAlive(helperPid)) {
        helperExited = true;
        break;
      }
    }
  }
  writeFileSync(join(stateDir, 'pending.json'),
    `${JSON.stringify({ ...pending, canceled: true, canceledAt: new Date().toISOString(), helperExited }, null, 2)}\n`,
    'utf8');
  try {
    rmSync(cancelFile, { force: true });
  } catch {
    /* 标记删不掉不影响结果 */
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:599-616](https://github.com/7gzgn/dsh-restart-planner/blob/b115ddb47fcad13c2581d359cd0fd827e9db3f76/lib/index.js#L599-L616)

恢复标记失败与工具ok可并存。

<details>
<summary>查看原文（18行）</summary>

```text
            // 重启后自动继续：记下「哪个会话 + 继续时说什么」。dry run 不记（没真重启）。
            let resume = null;
            if (!dryRun && (a.resume !== false) && cfg.resumeAfterRestart !== false) {
              const sessionId = initiatorSessionId(ctx);
              if (sessionId === null) {
                resume = { ok: false, sessions: 0, error: '拿不到当前会话 id（不在 agent 调用链里？）' };
              } else {
                const prompt = typeof a.continuePrompt === 'string' && a.continuePrompt !== ''
                  ? a.continuePrompt
                  : (typeof cfg.continuePrompt === 'string' && cfg.continuePrompt !== '' ? cfg.continuePrompt : DEFAULT_CONTINUE_PROMPT);
                resume = writeResume(stateDir, { sessionId, prompt });
              }
            }
            return { ok: true, action, data: { ...result, confirm: asked.confirm ?? null, resume, stateDir } };
          }

          if (action === 'cancel') {
            const result = await cancelPending({ stateDir });
```

</details>

#### 缺口

- 自动继续对有外部副作用任务的判重能力未知
  **影响**：可能在重启后重复发布、写文件或调用服务
  **进一步探讨**：用含幂等/非幂等步骤的故障注入任务验证每个重启阶段，统计重复副作用与丢步骤

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
