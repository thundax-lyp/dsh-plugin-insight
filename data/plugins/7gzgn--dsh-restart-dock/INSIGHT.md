# dsh-restart-dock

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[bb74ab5](https://github.com/7gzgn/dsh-restart-dock/tree/bb74ab5d5eafdd97cec75a0be759346fdcacece7)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在 DSH Web 界面提供可拖动的刷新/Windows 宿主重启坞，并用独立 helper 留下重启报告。

> **核心亮点**：相对手工重开，它把“只刷新 client”和“重启 Host”分成明确按钮，并加入包重建门禁、倒计时撤回和重启报告。贡献是开发交互与安全接线，不是跨平台进程管理；Windows-only 和强制停止限制了普适性。 详见[Q03](#research-q03)。

> **风险与缺陷**：关键风险是重启属于破坏性副作用。自定义头/CORS 防跨站不等于完整鉴权，同源受害页面或宿主路由暴露仍需核对；helper 若受 job object 牵连可能无法拉起。插件不等本轮结束、不自动续话，未保存状态会被中断。 详见[Q04](#research-q04)。

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
  - [Q01 · 谁在何种重复场景需要 dsh-restart-dock，合格交付与简单替代是什么？](#detail-section-11)
  - [Q02 · dsh-restart-dock 的入口、调用链、状态变化与副作用如何实现？](#detail-section-12)
  - [Q03 · 相对宿主原生能力或简单替代，dsh-restart-dock 的具体增量是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使 dsh-restart-dock 的核心价值不成立？](#detail-section-14)
  - [Q05 · dsh-restart-dock 启动、持续生效与失败降级依赖什么？](#detail-section-15)
  - [Q06 · dsh-restart-dock 完成一个合格任务的首次、持续与失败恢复成本是什么？](#detail-section-16)
  - [Q07 · dsh-restart-dock 的工程可靠性和可迁移设计如何？](#detail-section-17)
  - [Q08 · 由贡献与限制可推导什么可证伪的新设计假设？](#detail-section-18)
  - [Q09 · 哪些人应观察、试用或拒绝采用 dsh-restart-dock？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Windows 上调试 DSH 插件的开发者需要频繁区分客户端刷新和 Host 重启；基线是关窗口、找快捷方式再打开。合格结果是只在用户二次确认后重启明确的 DSH 进程树，页面能区分失败、取消和恢复，正在执行的任务不会被误认为已保存。 详见[Q01](#research-q01)。

Windows 上调试 DSH 插件的开发者需要频繁区分客户端刷新和 Host 重启；基线是关窗口、找快捷方式再打开。合格结果是只在用户二次确认后重启明确的 DSH 进程树，页面能区分失败、取消和恢复，正在执行的任务不会被误认为已保存。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 安全刷新 | 包稳定后刷新客户端 | 检查失败会放行，仍需人工观察 boot |
| 宿主重启 | 二次确认/倒计时后停拉进程树 | 仅 Windows，强制停止会中断任务 |
| 报告与轮询 | 展示 pending/last 并等待宿主回来 | helper 被 job 杀死时需手工救援 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows + PowerShell 5.1 | 重启必需 | 执行独立 helper | 非 Windows 只保留刷新 |
| DSH Web/桌面同源路由 | 必需 | UI 调状态与重启端点 | 信任检查失败返回 403 |
| 可识别的 DSH 顶层进程 | 必需 | 限定停止目标和原命令拉起 | 探测失败拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装 | 开发者装 bundle 并手工重启一次 | 右下角出现坞 |
| 选择 | 用户区分刷新或重启 | 刷新先查 bundle；重启弹时机选择 |
| 执行 | helper 延迟后停树并重拉 | 报告写 last.json |
| 恢复 | 用户看状态/日志 | 失败时用原快捷方式手工启动 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 无外部费；占少量状态文件 | 安装、首重启、dry-run 和救援演练 | 真机耗时未测 |
| 持续使用 | 刷新流量与重启数秒停机 | 选择时机并核对当前任务 | 重启中所有会话不可用 |
| 失败恢复 | 可能留下占端口孤儿或停机 | 读日志、清孤儿、手工拉起 | 重复点击可能扩大混乱 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 操作缩短 | 从关窗重开变成坞按钮 | 实际节时和误触率 |
| 刷新保护 | 源码在 reload 前查 bundle-ready | 检测失败放行时的风险 |
| 重启恢复 | helper 写报告并按原命令拉起 | 目标机器/job object 成功率 |

> **思考**：关键风险是重启属于破坏性副作用。自定义头/CORS 防跨站不等于完整鉴权，同源受害页面或宿主路由暴露仍需核对；helper 若受 job object 牵连可能无法拉起。插件不等本轮结束、不自动续话，未保存状态会被中断。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对手工重开，它把“只刷新 client”和“重启 Host”分成明确按钮，并加入包重建门禁、倒计时撤回和重启报告。贡献是开发交互与安全接线，不是跨平台进程管理；Windows-only 和强制停止限制了普适性。 详见[Q03](#research-q03)。

相对手工重开，它把“只刷新 client”和“重启 Host”分成明确按钮，并加入包重建门禁、倒计时撤回和重启报告。贡献是开发交互与安全接线，不是跨平台进程管理；Windows-only 和强制停止限制了普适性。 详见[Q03](#research-q03)。

Host 路由、UI 和 PowerShell helper 职责分离，目标探测与报告可审计，bundle-ready 防止刚改 client.js 时刷新到坏包。可借鉴的是“破坏动作先探测、确认、离进程执行、落盘报告”；移植到 macOS/Linux 必须重写进程树与拉起语义。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

关键风险是重启属于破坏性副作用。自定义头/CORS 防跨站不等于完整鉴权，同源受害页面或宿主路由暴露仍需核对；helper 若受 job object 牵连可能无法拉起。插件不等本轮结束、不自动续话，未保存状态会被中断。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只建议 Windows DSH 插件开发者观察使用，先在无重要任务环境完成 dry-run、一次真实停拉和手工救援演练。普通用户、非 Windows 或无法容忍强制 Stop-Process 的工作站不应启用；任何 target 探测不明确或报告停在 armed 状态都应转人工重启。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认了贴边坞、bundle-ready 刷新门禁、同源/自定义头检查、脱离式 PowerShell helper 和落盘报告；未在 Windows 桌面 Host 执行停拉、job object 故障或跨源请求，因此只能确认破坏动作的静态防线，不能确认重启成功率与救援时长。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 bb74ab5d5eafdd97cec75a0be759346fdcacece7 的作者材料、入口与关键源码；不运行插件、测试、外部服务或真实 Host；检查时间不早于 2026-10-22T15:49:47Z。
- 下一步：在隔离 Windows 实例分别测试稳定 bundle、重建中 bundle、无 Origin 桌面请求、跨源请求、helper 被 job 终止和目标探测失败；以零误杀、报告状态准确、宿主恢复和手工救援上限为门槛。

**分析版本**

- **仓库**：[7gzgn/dsh-restart-dock](https://github.com/7gzgn/dsh-restart-dock)
- **版本号**：0.1.3（[固定提交 bb74ab5](https://github.com/7gzgn/dsh-restart-dock/tree/bb74ab5d5eafdd97cec75a0be759346fdcacece7)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把当前任务忙闲状态接入重启坞，只在会话已落盘且无活跃工具时启用“安全重启”，可减少中断事故。最小实验注入活跃/空闲/写盘三种状态各 20 次，比较当前按钮与门控版的误中断率、恢复成功率和等待时间；若忙闲信号漏报一次破坏性中断即不应自动启用。 详见[Q08](#research-q08)。

在隔离 Windows 实例分别测试稳定 bundle、重建中 bundle、无 Origin 桌面请求、跨源请求、helper 被 job 终止和目标探测失败；以零误杀、报告状态准确、宿主恢复和手工救援上限为门槛。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1306 | 1009 | 200 | — |
| .md | source | 1 | 118 | — | — | 1609 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-restart-dock/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-restart-dock 在固定版本下是否以可控依赖和总成本交付其核心能力，并值得目标用户采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种重复场景需要 dsh-restart-dock，合格交付与简单替代是什么？

**研究主题**：场景与需求

#### 完整回答

Windows 上调试 DSH 插件的开发者需要频繁区分客户端刷新和 Host 重启；基线是关窗口、找快捷方式再打开。合格结果是只在用户二次确认后重启明确的 DSH 进程树，页面能区分失败、取消和恢复，正在执行的任务不会被误认为已保存。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-25](https://github.com/7gzgn/dsh-restart-dock/blob/bb74ab5d5eafdd97cec75a0be759346fdcacece7/README.md#L5-L25)

固定版本作者材料支持 Q01 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（21行）</summary>

```text
界面上一小框，两个按钮：

- **重启** —— 停掉 DSH 宿主，再按原来的命令行把它拉起来。改插件、改 `client.js`、改 profile 配置之后用它。
- **刷新** —— 只重载当前页面，不碰进程。

改完东西总要"关窗口 → 找快捷方式 → 重开"的那条路，变成一次点击。

![按住 0.3 秒才拖得动，拖到边上就贴住](media/dock-loop.gif)

**点重启会先问一句**：`立即` / `30 秒` / `60 秒` / `2 分钟` / `取消`。选延迟就在原地倒计时，随时可以撤回 —— 给自己留一个反悔的窗口。

**框可以拖，而且始终贴边**：整块按住就能拖走（像页面翻译那个小按钮），松手离哪边近就贴哪边；收起成小圆点之后照样能拖。位置记的是"贴哪条边 + 离边多远"，不是绝对坐标 —— 所以窗口放大、缩小、全屏，它都自动跟着边框走，不会跑到视口外面看不见。

## 为什么值得单独做

DSH 的插件分两半：**宿主半**（进程里的 JS）和**客户端半**（浏览器里的 JS）。

- 客户端半改完，刷新页面就行；
- **宿主半改完，必须重启进程**——模块已经加载过，改文件不会换掉那一代代码。

这就是这个插件唯一要解决的问题。它不装功能，只装一个"门把手"。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · dsh-restart-dock 的入口、调用链、状态变化与副作用如何实现？

**研究主题**：功能与机制

#### 完整回答

shell.overlay 提供贴边坞；刷新前查询 bundle-ready，确认客户端包未重建再加时间戳 reload。重启请求经自定义头与同源检查，Host 用 cmd/start 启动脱离的 PowerShell helper，helper探测目标、延迟、停树、按原命令拉起并写 last/pending/log，浏览器轮询停机与恢复。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:131-220](https://github.com/7gzgn/dsh-restart-dock/blob/bb74ab5d5eafdd97cec75a0be759346fdcacece7/lib/index.js#L131-L220)

固定版本源码用于核对 Q02 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（90行）</summary>

```text
/* ------------------------------------------------------------ 重启 */

const PUBLIC = 'public';

/**
 * 起 helper。**必须包一层 `cmd /c start /b`**：
 * 实测（2026-10-18）在 Windows 上「powershell.exe + -File + detached:true」会
 * 「启动 → 立刻 exit 0 → 脚本一行都没执行」，日志和报告都不出来，按钮看起来毫无反应。
 * 去掉 detached 就正常，但那样 helper 活不过宿主被停掉。
 * 折中：让 cmd 去建进程（`start /b` 立即返回），helper 作为独立进程继续跑，
 * 宿主这边 unref 后立刻得到返回。代价是这里拿到的 pid 是 cmd 的，不是 helper 的。
 */
function spawnHelper(info) {
  const script = fileURLToPath(new URL('./relaunch.ps1', import.meta.url));
  // cwd 必须真实存在，否则 spawn 会 ENOENT —— 第一次点的时候状态目录往往还没建。
  try { mkdirSync(info.stateDir, { recursive: true }); } catch { /* 下面写文件时还会再试一次 */ }

  const psArgs = [
    '-NoProfile',
    '-NonInteractive',
    '-ExecutionPolicy', 'Bypass',
    '-File', script,
    '-CallerPid', String(info.callerPid),
    '-StateDir', info.stateDir,
    '-DelaySeconds', String(info.delaySeconds),
  ];

  const child = spawn('cmd.exe', ['/c', 'start', '', '/b', 'powershell.exe', ...psArgs], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
    cwd: info.stateDir,
    env: { ...process.env, DSH_RESTART_DOCK: String(info.id) },
  });
  child.unref();
  return child.pid;
}

export function apply(ctx, config = {}) {
  const cfg = config || {};
  const delaySeconds = Number.isFinite(cfg.delaySeconds) ? Math.max(1, cfg.delaySeconds) : 2;
  const dir = stateDir();

  /** 正在排程/等待的那次重启（防连点）。进程重启后自然清空。 */
  let inFlight = null;
  let acceptedAt = 0;

  const startedAt = Date.now();

  function statusPayload() {
    const last = readJson(join(dir, 'last.json'));
    const pending = readJson(join(dir, 'pending.json'));
    return {
      ok: true,
      dock: {
        version: PUBLIC,
        pid: process.pid,
        platform: process.platform,
        uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
        stateDir: dir,
      },
      restart: {
        supported: process.platform === 'win32',
        inFlight: inFlight !== null,
        // 上次 helper 留下的报告（成功/失败/为什么）。新宿主起来后就能读到。
        last: last ?? null,
        // 还没执行完的排程（点击后到 helper 动手之间会看到）。
        pending: pending ?? null,
      },
    };
  }

  async function onStatus(req, res, webServer) {
    if (methodOf(req) !== 'GET') return json(res, 405, { ok: false, error: 'method-not-allowed' });
    let serverOrigin = '';
    try {
      serverOrigin = webServer.getOrigin();
    } catch {
      serverOrigin = '';
    }
    const trust = trustCheck(req, serverOrigin);
    if (!serverOrigin || !trust.ok) {
      return json(res, 403, {
        ok: false,
        error: 'forbidden',
        reason: serverOrigin ? trust.reason : 'no-server-origin',
      });
    }
    return json(res, 200, statusPayload());
  }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主原生能力或简单替代，dsh-restart-dock 的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对手工重开，它把“只刷新 client”和“重启 Host”分成明确按钮，并加入包重建门禁、倒计时撤回和重启报告。贡献是开发交互与安全接线，不是跨平台进程管理；Windows-only 和强制停止限制了普适性。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-25](https://github.com/7gzgn/dsh-restart-dock/blob/bb74ab5d5eafdd97cec75a0be759346fdcacece7/README.md#L5-L25)

固定版本作者材料支持 Q03 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（21行）</summary>

```text
界面上一小框，两个按钮：

- **重启** —— 停掉 DSH 宿主，再按原来的命令行把它拉起来。改插件、改 `client.js`、改 profile 配置之后用它。
- **刷新** —— 只重载当前页面，不碰进程。

改完东西总要"关窗口 → 找快捷方式 → 重开"的那条路，变成一次点击。

![按住 0.3 秒才拖得动，拖到边上就贴住](media/dock-loop.gif)

**点重启会先问一句**：`立即` / `30 秒` / `60 秒` / `2 分钟` / `取消`。选延迟就在原地倒计时，随时可以撤回 —— 给自己留一个反悔的窗口。

**框可以拖，而且始终贴边**：整块按住就能拖走（像页面翻译那个小按钮），松手离哪边近就贴哪边；收起成小圆点之后照样能拖。位置记的是"贴哪条边 + 离边多远"，不是绝对坐标 —— 所以窗口放大、缩小、全屏，它都自动跟着边框走，不会跑到视口外面看不见。

## 为什么值得单独做

DSH 的插件分两半：**宿主半**（进程里的 JS）和**客户端半**（浏览器里的 JS）。

- 客户端半改完，刷新页面就行；
- **宿主半改完，必须重启进程**——模块已经加载过，改文件不会换掉那一代代码。

这就是这个插件唯一要解决的问题。它不装功能，只装一个"门把手"。
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使 dsh-restart-dock 的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键风险是重启属于破坏性副作用。自定义头/CORS 防跨站不等于完整鉴权，同源受害页面或宿主路由暴露仍需核对；helper 若受 job object 牵连可能无法拉起。插件不等本轮结束、不自动续话，未保存状态会被中断。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:131-220](https://github.com/7gzgn/dsh-restart-dock/blob/bb74ab5d5eafdd97cec75a0be759346fdcacece7/lib/index.js#L131-L220)

固定版本源码用于核对 Q04 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（90行）</summary>

```text
/* ------------------------------------------------------------ 重启 */

const PUBLIC = 'public';

/**
 * 起 helper。**必须包一层 `cmd /c start /b`**：
 * 实测（2026-10-18）在 Windows 上「powershell.exe + -File + detached:true」会
 * 「启动 → 立刻 exit 0 → 脚本一行都没执行」，日志和报告都不出来，按钮看起来毫无反应。
 * 去掉 detached 就正常，但那样 helper 活不过宿主被停掉。
 * 折中：让 cmd 去建进程（`start /b` 立即返回），helper 作为独立进程继续跑，
 * 宿主这边 unref 后立刻得到返回。代价是这里拿到的 pid 是 cmd 的，不是 helper 的。
 */
function spawnHelper(info) {
  const script = fileURLToPath(new URL('./relaunch.ps1', import.meta.url));
  // cwd 必须真实存在，否则 spawn 会 ENOENT —— 第一次点的时候状态目录往往还没建。
  try { mkdirSync(info.stateDir, { recursive: true }); } catch { /* 下面写文件时还会再试一次 */ }

  const psArgs = [
    '-NoProfile',
    '-NonInteractive',
    '-ExecutionPolicy', 'Bypass',
    '-File', script,
    '-CallerPid', String(info.callerPid),
    '-StateDir', info.stateDir,
    '-DelaySeconds', String(info.delaySeconds),
  ];

  const child = spawn('cmd.exe', ['/c', 'start', '', '/b', 'powershell.exe', ...psArgs], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
    cwd: info.stateDir,
    env: { ...process.env, DSH_RESTART_DOCK: String(info.id) },
  });
  child.unref();
  return child.pid;
}

export function apply(ctx, config = {}) {
  const cfg = config || {};
  const delaySeconds = Number.isFinite(cfg.delaySeconds) ? Math.max(1, cfg.delaySeconds) : 2;
  const dir = stateDir();

  /** 正在排程/等待的那次重启（防连点）。进程重启后自然清空。 */
  let inFlight = null;
  let acceptedAt = 0;

  const startedAt = Date.now();

  function statusPayload() {
    const last = readJson(join(dir, 'last.json'));
    const pending = readJson(join(dir, 'pending.json'));
    return {
      ok: true,
      dock: {
        version: PUBLIC,
        pid: process.pid,
        platform: process.platform,
        uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
        stateDir: dir,
      },
      restart: {
        supported: process.platform === 'win32',
        inFlight: inFlight !== null,
        // 上次 helper 留下的报告（成功/失败/为什么）。新宿主起来后就能读到。
        last: last ?? null,
        // 还没执行完的排程（点击后到 helper 动手之间会看到）。
        pending: pending ?? null,
      },
    };
  }

  async function onStatus(req, res, webServer) {
    if (methodOf(req) !== 'GET') return json(res, 405, { ok: false, error: 'method-not-allowed' });
    let serverOrigin = '';
    try {
      serverOrigin = webServer.getOrigin();
    } catch {
      serverOrigin = '';
    }
    const trust = trustCheck(req, serverOrigin);
    if (!serverOrigin || !trust.ok) {
      return json(res, 403, {
        ok: false,
        error: 'forbidden',
        reason: serverOrigin ? trust.reason : 'no-server-origin',
      });
    }
    return json(res, 200, statusPayload());
  }
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-restart-dock 启动、持续生效与失败降级依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

Host 重启仅支持 Windows、PowerShell 5.1 和声明区间 DSH，需能探测顶层可执行文件并写 ~/.dsh/dsh-restart-dock；刷新只依赖 web UI。找不到目标或非 Windows 返回拒绝/501，浏览器页面消失后自动刷新只对外部浏览器有意义。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-25](https://github.com/7gzgn/dsh-restart-dock/blob/bb74ab5d5eafdd97cec75a0be759346fdcacece7/README.md#L5-L25)

固定版本作者材料支持 Q05 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（21行）</summary>

```text
界面上一小框，两个按钮：

- **重启** —— 停掉 DSH 宿主，再按原来的命令行把它拉起来。改插件、改 `client.js`、改 profile 配置之后用它。
- **刷新** —— 只重载当前页面，不碰进程。

改完东西总要"关窗口 → 找快捷方式 → 重开"的那条路，变成一次点击。

![按住 0.3 秒才拖得动，拖到边上就贴住](media/dock-loop.gif)

**点重启会先问一句**：`立即` / `30 秒` / `60 秒` / `2 分钟` / `取消`。选延迟就在原地倒计时，随时可以撤回 —— 给自己留一个反悔的窗口。

**框可以拖，而且始终贴边**：整块按住就能拖走（像页面翻译那个小按钮），松手离哪边近就贴哪边；收起成小圆点之后照样能拖。位置记的是"贴哪条边 + 离边多远"，不是绝对坐标 —— 所以窗口放大、缩小、全屏，它都自动跟着边框走，不会跑到视口外面看不见。

## 为什么值得单独做

DSH 的插件分两半：**宿主半**（进程里的 JS）和**客户端半**（浏览器里的 JS）。

- 客户端半改完，刷新页面就行；
- **宿主半改完，必须重启进程**——模块已经加载过，改文件不会换掉那一代代码。

这就是这个插件唯一要解决的问题。它不装功能，只装一个"门把手"。
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · dsh-restart-dock 完成一个合格任务的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

首次安装后必须人工重启一次并验证状态路由、dry-run 与目标 pid；持续使用刷新几乎无现金费，重启会产生数秒停机并打断所有任务；失败恢复要读 last.json/helper.log，必要时手工从快捷方式启动，不能重复连点未知状态的重启。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:131-220](https://github.com/7gzgn/dsh-restart-dock/blob/bb74ab5d5eafdd97cec75a0be759346fdcacece7/lib/index.js#L131-L220)

固定版本源码用于核对 Q06 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（90行）</summary>

```text
/* ------------------------------------------------------------ 重启 */

const PUBLIC = 'public';

/**
 * 起 helper。**必须包一层 `cmd /c start /b`**：
 * 实测（2026-10-18）在 Windows 上「powershell.exe + -File + detached:true」会
 * 「启动 → 立刻 exit 0 → 脚本一行都没执行」，日志和报告都不出来，按钮看起来毫无反应。
 * 去掉 detached 就正常，但那样 helper 活不过宿主被停掉。
 * 折中：让 cmd 去建进程（`start /b` 立即返回），helper 作为独立进程继续跑，
 * 宿主这边 unref 后立刻得到返回。代价是这里拿到的 pid 是 cmd 的，不是 helper 的。
 */
function spawnHelper(info) {
  const script = fileURLToPath(new URL('./relaunch.ps1', import.meta.url));
  // cwd 必须真实存在，否则 spawn 会 ENOENT —— 第一次点的时候状态目录往往还没建。
  try { mkdirSync(info.stateDir, { recursive: true }); } catch { /* 下面写文件时还会再试一次 */ }

  const psArgs = [
    '-NoProfile',
    '-NonInteractive',
    '-ExecutionPolicy', 'Bypass',
    '-File', script,
    '-CallerPid', String(info.callerPid),
    '-StateDir', info.stateDir,
    '-DelaySeconds', String(info.delaySeconds),
  ];

  const child = spawn('cmd.exe', ['/c', 'start', '', '/b', 'powershell.exe', ...psArgs], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
    cwd: info.stateDir,
    env: { ...process.env, DSH_RESTART_DOCK: String(info.id) },
  });
  child.unref();
  return child.pid;
}

export function apply(ctx, config = {}) {
  const cfg = config || {};
  const delaySeconds = Number.isFinite(cfg.delaySeconds) ? Math.max(1, cfg.delaySeconds) : 2;
  const dir = stateDir();

  /** 正在排程/等待的那次重启（防连点）。进程重启后自然清空。 */
  let inFlight = null;
  let acceptedAt = 0;

  const startedAt = Date.now();

  function statusPayload() {
    const last = readJson(join(dir, 'last.json'));
    const pending = readJson(join(dir, 'pending.json'));
    return {
      ok: true,
      dock: {
        version: PUBLIC,
        pid: process.pid,
        platform: process.platform,
        uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
        stateDir: dir,
      },
      restart: {
        supported: process.platform === 'win32',
        inFlight: inFlight !== null,
        // 上次 helper 留下的报告（成功/失败/为什么）。新宿主起来后就能读到。
        last: last ?? null,
        // 还没执行完的排程（点击后到 helper 动手之间会看到）。
        pending: pending ?? null,
      },
    };
  }

  async function onStatus(req, res, webServer) {
    if (methodOf(req) !== 'GET') return json(res, 405, { ok: false, error: 'method-not-allowed' });
    let serverOrigin = '';
    try {
      serverOrigin = webServer.getOrigin();
    } catch {
      serverOrigin = '';
    }
    const trust = trustCheck(req, serverOrigin);
    if (!serverOrigin || !trust.ok) {
      return json(res, 403, {
        ok: false,
        error: 'forbidden',
        reason: serverOrigin ? trust.reason : 'no-server-origin',
      });
    }
    return json(res, 200, statusPayload());
  }
```

</details>

#### 缺口

- 目标 Windows 环境的停拉成功率与同源边界未由本轮验证
  **影响**：一次失败即可让开发环境离线
  **进一步探讨**：在空闲实例执行 dry-run、真实重启、helper 被终止和同源/跨源请求矩阵，并记录手工救援时间

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · dsh-restart-dock 的工程可靠性和可迁移设计如何？

**研究主题**：工程质量与复用

#### 完整回答

Host 路由、UI 和 PowerShell helper 职责分离，目标探测与报告可审计，bundle-ready 防止刚改 client.js 时刷新到坏包。可借鉴的是“破坏动作先探测、确认、离进程执行、落盘报告”；移植到 macOS/Linux 必须重写进程树与拉起语义。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:131-220](https://github.com/7gzgn/dsh-restart-dock/blob/bb74ab5d5eafdd97cec75a0be759346fdcacece7/lib/index.js#L131-L220)

固定版本源码用于核对 Q07 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（90行）</summary>

```text
/* ------------------------------------------------------------ 重启 */

const PUBLIC = 'public';

/**
 * 起 helper。**必须包一层 `cmd /c start /b`**：
 * 实测（2026-10-18）在 Windows 上「powershell.exe + -File + detached:true」会
 * 「启动 → 立刻 exit 0 → 脚本一行都没执行」，日志和报告都不出来，按钮看起来毫无反应。
 * 去掉 detached 就正常，但那样 helper 活不过宿主被停掉。
 * 折中：让 cmd 去建进程（`start /b` 立即返回），helper 作为独立进程继续跑，
 * 宿主这边 unref 后立刻得到返回。代价是这里拿到的 pid 是 cmd 的，不是 helper 的。
 */
function spawnHelper(info) {
  const script = fileURLToPath(new URL('./relaunch.ps1', import.meta.url));
  // cwd 必须真实存在，否则 spawn 会 ENOENT —— 第一次点的时候状态目录往往还没建。
  try { mkdirSync(info.stateDir, { recursive: true }); } catch { /* 下面写文件时还会再试一次 */ }

  const psArgs = [
    '-NoProfile',
    '-NonInteractive',
    '-ExecutionPolicy', 'Bypass',
    '-File', script,
    '-CallerPid', String(info.callerPid),
    '-StateDir', info.stateDir,
    '-DelaySeconds', String(info.delaySeconds),
  ];

  const child = spawn('cmd.exe', ['/c', 'start', '', '/b', 'powershell.exe', ...psArgs], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
    cwd: info.stateDir,
    env: { ...process.env, DSH_RESTART_DOCK: String(info.id) },
  });
  child.unref();
  return child.pid;
}

export function apply(ctx, config = {}) {
  const cfg = config || {};
  const delaySeconds = Number.isFinite(cfg.delaySeconds) ? Math.max(1, cfg.delaySeconds) : 2;
  const dir = stateDir();

  /** 正在排程/等待的那次重启（防连点）。进程重启后自然清空。 */
  let inFlight = null;
  let acceptedAt = 0;

  const startedAt = Date.now();

  function statusPayload() {
    const last = readJson(join(dir, 'last.json'));
    const pending = readJson(join(dir, 'pending.json'));
    return {
      ok: true,
      dock: {
        version: PUBLIC,
        pid: process.pid,
        platform: process.platform,
        uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
        stateDir: dir,
      },
      restart: {
        supported: process.platform === 'win32',
        inFlight: inFlight !== null,
        // 上次 helper 留下的报告（成功/失败/为什么）。新宿主起来后就能读到。
        last: last ?? null,
        // 还没执行完的排程（点击后到 helper 动手之间会看到）。
        pending: pending ?? null,
      },
    };
  }

  async function onStatus(req, res, webServer) {
    if (methodOf(req) !== 'GET') return json(res, 405, { ok: false, error: 'method-not-allowed' });
    let serverOrigin = '';
    try {
      serverOrigin = webServer.getOrigin();
    } catch {
      serverOrigin = '';
    }
    const trust = trustCheck(req, serverOrigin);
    if (!serverOrigin || !trust.ok) {
      return json(res, 403, {
        ok: false,
        error: 'forbidden',
        reason: serverOrigin ? trust.reason : 'no-server-origin',
      });
    }
    return json(res, 200, statusPayload());
  }
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与限制可推导什么可证伪的新设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把当前任务忙闲状态接入重启坞，只在会话已落盘且无活跃工具时启用“安全重启”，可减少中断事故。最小实验注入活跃/空闲/写盘三种状态各 20 次，比较当前按钮与门控版的误中断率、恢复成功率和等待时间；若忙闲信号漏报一次破坏性中断即不应自动启用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:131-220](https://github.com/7gzgn/dsh-restart-dock/blob/bb74ab5d5eafdd97cec75a0be759346fdcacece7/lib/index.js#L131-L220)

固定版本源码用于核对 Q08 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（90行）</summary>

```text
/* ------------------------------------------------------------ 重启 */

const PUBLIC = 'public';

/**
 * 起 helper。**必须包一层 `cmd /c start /b`**：
 * 实测（2026-10-18）在 Windows 上「powershell.exe + -File + detached:true」会
 * 「启动 → 立刻 exit 0 → 脚本一行都没执行」，日志和报告都不出来，按钮看起来毫无反应。
 * 去掉 detached 就正常，但那样 helper 活不过宿主被停掉。
 * 折中：让 cmd 去建进程（`start /b` 立即返回），helper 作为独立进程继续跑，
 * 宿主这边 unref 后立刻得到返回。代价是这里拿到的 pid 是 cmd 的，不是 helper 的。
 */
function spawnHelper(info) {
  const script = fileURLToPath(new URL('./relaunch.ps1', import.meta.url));
  // cwd 必须真实存在，否则 spawn 会 ENOENT —— 第一次点的时候状态目录往往还没建。
  try { mkdirSync(info.stateDir, { recursive: true }); } catch { /* 下面写文件时还会再试一次 */ }

  const psArgs = [
    '-NoProfile',
    '-NonInteractive',
    '-ExecutionPolicy', 'Bypass',
    '-File', script,
    '-CallerPid', String(info.callerPid),
    '-StateDir', info.stateDir,
    '-DelaySeconds', String(info.delaySeconds),
  ];

  const child = spawn('cmd.exe', ['/c', 'start', '', '/b', 'powershell.exe', ...psArgs], {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
    cwd: info.stateDir,
    env: { ...process.env, DSH_RESTART_DOCK: String(info.id) },
  });
  child.unref();
  return child.pid;
}

export function apply(ctx, config = {}) {
  const cfg = config || {};
  const delaySeconds = Number.isFinite(cfg.delaySeconds) ? Math.max(1, cfg.delaySeconds) : 2;
  const dir = stateDir();

  /** 正在排程/等待的那次重启（防连点）。进程重启后自然清空。 */
  let inFlight = null;
  let acceptedAt = 0;

  const startedAt = Date.now();

  function statusPayload() {
    const last = readJson(join(dir, 'last.json'));
    const pending = readJson(join(dir, 'pending.json'));
    return {
      ok: true,
      dock: {
        version: PUBLIC,
        pid: process.pid,
        platform: process.platform,
        uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
        stateDir: dir,
      },
      restart: {
        supported: process.platform === 'win32',
        inFlight: inFlight !== null,
        // 上次 helper 留下的报告（成功/失败/为什么）。新宿主起来后就能读到。
        last: last ?? null,
        // 还没执行完的排程（点击后到 helper 动手之间会看到）。
        pending: pending ?? null,
      },
    };
  }

  async function onStatus(req, res, webServer) {
    if (methodOf(req) !== 'GET') return json(res, 405, { ok: false, error: 'method-not-allowed' });
    let serverOrigin = '';
    try {
      serverOrigin = webServer.getOrigin();
    } catch {
      serverOrigin = '';
    }
    const trust = trustCheck(req, serverOrigin);
    if (!serverOrigin || !trust.ok) {
      return json(res, 403, {
        ok: false,
        error: 'forbidden',
        reason: serverOrigin ? trust.reason : 'no-server-origin',
      });
    }
    return json(res, 200, statusPayload());
  }
```

</details>

#### 缺口

- 目标 Windows 环境的停拉成功率与同源边界未由本轮验证
  **影响**：一次失败即可让开发环境离线
  **进一步探讨**：在空闲实例执行 dry-run、真实重启、helper 被终止和同源/跨源请求矩阵，并记录手工救援时间

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人应观察、试用或拒绝采用 dsh-restart-dock？

**研究主题**：采用判断

#### 完整回答

只建议 Windows DSH 插件开发者观察使用，先在无重要任务环境完成 dry-run、一次真实停拉和手工救援演练。普通用户、非 Windows 或无法容忍强制 Stop-Process 的工作站不应启用；任何 target 探测不明确或报告停在 armed 状态都应转人工重启。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-25](https://github.com/7gzgn/dsh-restart-dock/blob/bb74ab5d5eafdd97cec75a0be759346fdcacece7/README.md#L5-L25)

固定版本作者材料支持 Q09 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（21行）</summary>

```text
界面上一小框，两个按钮：

- **重启** —— 停掉 DSH 宿主，再按原来的命令行把它拉起来。改插件、改 `client.js`、改 profile 配置之后用它。
- **刷新** —— 只重载当前页面，不碰进程。

改完东西总要"关窗口 → 找快捷方式 → 重开"的那条路，变成一次点击。

![按住 0.3 秒才拖得动，拖到边上就贴住](media/dock-loop.gif)

**点重启会先问一句**：`立即` / `30 秒` / `60 秒` / `2 分钟` / `取消`。选延迟就在原地倒计时，随时可以撤回 —— 给自己留一个反悔的窗口。

**框可以拖，而且始终贴边**：整块按住就能拖走（像页面翻译那个小按钮），松手离哪边近就贴哪边；收起成小圆点之后照样能拖。位置记的是"贴哪条边 + 离边多远"，不是绝对坐标 —— 所以窗口放大、缩小、全屏，它都自动跟着边框走，不会跑到视口外面看不见。

## 为什么值得单独做

DSH 的插件分两半：**宿主半**（进程里的 JS）和**客户端半**（浏览器里的 JS）。

- 客户端半改完，刷新页面就行；
- **宿主半改完，必须重启进程**——模块已经加载过，改文件不会换掉那一代代码。

这就是这个插件唯一要解决的问题。它不装功能，只装一个"门把手"。
```

</details>

#### 缺口

- 目标 Windows 环境的停拉成功率与同源边界未由本轮验证
  **影响**：一次失败即可让开发环境离线
  **进一步探讨**：在空闲实例执行 dry-run、真实重启、helper 被终止和同源/跨源请求矩阵，并记录手工救援时间

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
