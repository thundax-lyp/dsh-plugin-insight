# dsh-restart-dock

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[308cae3](https://github.com/7gzgn/dsh-restart-dock/tree/308cae353be22472e8af0b2c949e052afc86520a)

<!-- BEGIN META -->
[![npm 30d 350](https://img.shields.io/static/v1?label=npm+30d&message=350&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-restart-dock) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-restart-dock)
<!-- END META -->

> **功能**：在 DSH Web 界面提供可拖动的刷新/Windows 宿主重启坞，并用独立 helper 留下重启报告。

> **亮点**：[Q03](#research-q03) 将刷新/重启区分、尽力构建检查、页面倒计时和本地报告组合成开发入口；不是保证落盘的安全重启协议。

> **主要限制**：[Q04](#research-q04) 页面确认没有Host凭据约束，强停没有任务交接；[Q02](#research-q02) POST后无取消且恢复未绑定本次id。

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
| 客户端刷新 | 尽力检查包基线/语法后绕缓存刷新 | 缺服务或异常可放行，不保证构建完整 |
| 重启问询与倒计时 | 页面内选时机并在POST前撤回 | POST后无Host取消 |
| Host重启 | Windows helper解析目标、停树和重拉 | 202仅排程，无落盘ACK和任务续话 |
| 状态与恢复提示 | 读pending/last并轮询离线再回归 | HTTP恢复不绑定id；报告只证进程层动作 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows + PowerShell 5.1 | 重启必需 | 执行独立 helper | 非 Windows 只保留刷新 |
| DSH Web/桌面同源路由 | 必需 | UI 调状态与重启端点 | 信任检查失败返回 403 |
| 可识别的 DSH 顶层进程 | 必需 | 限定停止目标和原命令拉起 | 探测失败拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 核环境 | 开发者核Windows、状态、目标和手工救援 | 不在忙碌或重要任务期间操作 |
| 刷新 | 先看bundle检查再重载 | 异常可能放行，失败人工重开 |
| 重启选择 | 页面倒计时可撤回，随后POST | POST后不可取消，不确定回执不重复请求 |
| 回归核实 | 核last与实际Host会话 | HTTP200不等本次重启成功，slow转人工 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地状态文件与依赖资源 | 核目标/原参数和救援，网页无dry-run | 安装及权限实测未知 |
| 持续 | 重启helper、900ms轮询及中断计算 | 等停拉与核新Host | 代码等待不是实测停机；费用/工时未知 |
| 失败 | 重复重启可损更多未落盘任务 | 核pending/last与进程，手工启动 | POST后无取消，未知时禁止盲重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 区分动作 | 不同按钮走页面刷新或Host路由 | 实际开发效率未知 |
| 构建提示 | 基线与部分语法/取包失败会阻刷新 | 异常放行，非事务安全 |
| 重启反馈 | helper记录进程层结果并页面轮询 | 未证明任务保存、健康恢复或降低事故 |

> **思考**：[Q04](#research-q04) 页面确认没有Host凭据约束，强停没有任务交接；[Q02](#research-q02) POST后无取消且恢复未绑定本次id。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q03](#research-q03) 将刷新/重启区分、尽力构建检查、页面倒计时和本地报告组合成开发入口；不是保证落盘的安全重启协议。

[Q07](#research-q07) 路由/UI/helper职责分离，目标探测与进程报告可查。bundle-ready仅尽力比较基线和部分语法，不保证刷新安全；迁移平台须重写进程与重拉语义。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04) 页面确认没有Host凭据约束，强停没有任务交接；[Q02](#research-q02) POST后无取消且恢复未绑定本次id。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q09](#research-q09) 仅供有人工救援通道的Windows插件开发者观察；先核状态与目标。网页无dry-run，手工helper演算须明确目标并由维护者操作；真实停拉应限无重要任务环境。POST后无取消，回执未知/slow/armed未结束均停止重试，人工核进程和报告。

在隔离 Windows 实例分别测试稳定 bundle、重建中 bundle、无 Origin 桌面请求、跨源请求、helper 被 job 终止和目标探测失败；以零误杀、报告状态准确、宿主恢复和手工救援上限为门槛。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态确认overlay、尽力包检查、头/Origin检查与Windows停拉路径；缺失服务或异常可放行，确认并非Host授权凭据。未执行真实重启或测停机/恢复成功率。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、client.js、lib/relaunch.ps1 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核固定Host完整路由、client交互/倒计时/轮询与Git PowerShell目标、停树、重拉分支；未执行目标。
- 下一步：固定提交308cae353be22472e8af0b2c949e052afc86520a静态核查Host、客户端与PowerShell核心分支。未安装、运行目标或执行停拉；真实平台、任务保存、恢复和工时未知。后续仅在可丢弃开发环境核目标与人工救援。

**分析版本**

- **仓库**：[7gzgn/dsh-restart-dock](https://github.com/7gzgn/dsh-restart-dock)
- **版本号**：0.1.5（[固定提交 308cae3](https://github.com/7gzgn/dsh-restart-dock/tree/308cae353be22472e8af0b2c949e052afc86520a)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把当前任务忙闲状态接入重启坞，只在会话已落盘且无活跃工具时启用“安全重启”，可减少中断事故。最小实验注入活跃/空闲/写盘三种状态各 20 次，比较当前按钮与门控版的误中断率、恢复成功率和等待时间；若忙闲信号漏报一次破坏性中断即不应自动启用。 详见[Q08](#research-q08)。

在隔离 Windows 实例分别测试稳定 bundle、重建中 bundle、无 Origin 桌面请求、跨源请求、helper 被 job 终止和目标探测失败；以零误杀、报告状态准确、宿主恢复和手工救援上限为门槛。

固定提交308cae353be22472e8af0b2c949e052afc86520a静态核查Host、客户端与PowerShell核心分支。未安装、运行目标或执行停拉；真实平台、任务保存、恢复和工时未知。后续仅在可丢弃开发环境核目标与人工救援。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1306 | 1009 | 200 | — |
| .md | source | 1 | 118 | — | — | 1609 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/7gzgn/dsh-restart-dock/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/7gzgn/dsh-restart-dock/issues?q=is%3Aissue+created%3A2026-10-06T06%3A34%3A44.234Z..2026-11-05T06%3A34%3A44.234Z)

暂未获取：近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：开发者能否明确区分客户端刷新与Host重启，并在确认目标和退出路径后恢复开发界面？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种重复场景需要 dsh-restart-dock，合格交付与简单替代是什么？

**研究主题**：场景与需求

#### 完整回答

Windows 上调试 DSH 插件的开发者需要频繁区分客户端刷新和 Host 重启；基线是关窗口、找快捷方式再打开。合格结果是只在用户二次确认后重启明确的 DSH 进程树，页面能区分失败、取消和恢复，正在执行的任务不会被误认为已保存。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-25](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/README.md#L5-L25)

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

客户端的30/60/120秒倒计时只在页面内，到点才POST；abortCountdown只清本地interval，Host没有取消路由。Host接受后写pending并cmd/start启动helper，202只代表排程，返回pid是cmd而非helper。inFlight仅进程内且delay+120秒后过期，旧helper是否仍在运行未核，不能把它当持久互斥。恢复轮询900ms一次，只要见一次status错误/网络错后再次HTTP200就刷新，不核id、新pid或last结果，90秒转slow而非取消。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:131-220](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/lib/index.js#L131-L220)

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

**依据 2 · 源码核查**：[client.js:536-596](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/client.js#L536-L596)

恢复轮询与202后状态。

<details>
<summary>查看原文（61行）</summary>

```text

      const pollUntilBack = useCallback(() => {
        const tick = async () => {
          if (!alive.current) return;
          try {
            const res = await fetch(BASE + '/status', { headers: MARK, cache: 'no-store' });
            if (res.ok) {
              if (sawDown.current) {
                // 宿主真的停过又回来了：自动刷新，用户不用自己按。
                setPhase('restarting');
                setNote(T.done);
                try { window.location.reload(); } catch { /* 忽略 */ }
                return;
              }
            } else {
              sawDown.current = true;
            }
          } catch {
            sawDown.current = true;
          }
          if (sawDown.current) setNote(T.waiting);
          // 整个重启最长可能走 70 秒左右（等停 + 补刀 + 拉起轮询），
          // 所以放弃阈值给到 90 秒 —— 别在它还好好地重启时先说"比预期久"。
          if (Date.now() - startedAt.current > 90000) {
            setPhase('slow');
            setNote(T.slow);
            return;
          }
          pollTimer.current = setTimeout(tick, 900);
        };
        tick();
      }, [T]);

      const doRestart = useCallback(async () => {
        if (phase === 'sending' || phase === 'restarting') return;
        setPhase('sending');
        setNote(T.sending);
        try {
          const res = await fetch(BASE + '/restart', {
            method: 'POST',
            headers: MARK,
            cache: 'no-store',
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.ok) {
            setPhase('idle');
            if (res.status === 403) setNote(T.forbidden);
            else if (res.status === 501) setNote(T.unsupported);
            else if (res.status === 409) setNote(data.detail || T.restarting);
            else setNote(T.failed + (data.detail ? '：' + data.detail : ''));
            return;
          }
          startedAt.current = Date.now();
          setPhase('restarting');
          setNote(T.restarting);
          playFx();          // 让「正在重启」有个看得见的起手
          pollUntilBack();
        } catch {
          setPhase('idle');
          setNote(T.failed);
        }
```

</details>

**依据 3 · 源码核查**：[client.js:623-654](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/client.js#L623-L654)

本地倒计时和取消。

<details>
<summary>查看原文（32行）</summary>

```text

      const startCountdown = useCallback((seconds) => {
        setAsking(false);
        if (countdownTimer.current) clearInterval(countdownTimer.current);
        setCountdown(seconds);
        countdownTimer.current = setInterval(() => {
          setCountdown((cur) => {
            if (cur === null) return null;
            if (cur <= 1) {
              if (countdownTimer.current) {
                clearInterval(countdownTimer.current);
                countdownTimer.current = null;
              }
              // 用 ref 拿最新的 doRestart，避开闭包过期
              const fire = restartRef.current;
              setNote('');
              if (fire) fire();
              return null;
            }
            return cur - 1;
          });
        }, 1000);
      }, []);

      const abortCountdown = useCallback(() => {
        if (countdownTimer.current) {
          clearInterval(countdownTimer.current);
          countdownTimer.current = null;
        }
        setCountdown(null);
        setAsking(false);
        setNote('');
```

</details>

**依据 4 · 源码核查**：[lib/index.js:239-301](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/lib/index.js#L239-L301)

过期内存标记、pending与202。

<details>
<summary>查看原文（63行）</summary>

```text

    if (process.platform !== 'win32') {
      return json(res, 501, {
        ok: false,
        error: 'unsupported-platform',
        detail: '这个版本只实现了 Windows 的重启；刷新页面在任何平台都能用。',
      });
    }

    // 防连点，但**必须会过期**：helper 可能启动失败、或卡在杀进程那一步没真正重启，
    // 那样宿主还活着，这个标记就会永远卡着，之后点「重启」一律 409，看起来像按钮坏了。
    // 整个重启最长可能走「延迟 + 等停 20s + 补刀 8s + 拉起 40s」≈ 70 秒，
    // 所以过期时间给到「延迟 + 120 秒」，别在流程还没走完时把锁放掉。
    const STALE_MS = (delaySeconds + 120) * 1000;
    if (inFlight && Date.now() - inFlight.startedAtMs < STALE_MS) {
      return json(res, 409, {
        ok: false,
        error: 'already-scheduled',
        detail: '已经有一次重启在路上了，别连点。',
        inFlight: { id: inFlight.id, helperPid: inFlight.helperPid, delaySeconds: inFlight.delaySeconds },
      });
    }
    inFlight = null;

    const id = `rd-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const record = {
      id,
      at: new Date().toISOString(),
      callerPid: process.pid,
      hostPid: process.pid,
      delaySeconds,
      requestedBy: String(req.headers.origin || ''),
    };

    writeJson(join(dir, 'pending.json'), record);

    let helperPid;
    try {
      helperPid = spawnHelper({ id, callerPid: process.pid, stateDir: dir, delaySeconds });
    } catch (error) {
      writeJson(join(dir, 'last.json'), {
        ok: false,
        at: new Date().toISOString(),
        id,
        error: 'spawn-failed',
        detail: String(error && error.message ? error.message : error),
      });
      return json(res, 500, { ok: false, error: 'spawn-failed', detail: String(error && error.message ? error.message : error) });
    }

    acceptedAt = Date.now();
    inFlight = { id, helperPid, at: record.at, delaySeconds, startedAtMs: acceptedAt };
    writeJson(join(dir, 'pending.json'), { ...record, helperPid });

    return json(res, 202, {
      ok: true,
      id,
      helperPid,
      delaySeconds,
      detail: '已排程：约 1~2 秒后宿主会停下并重新拉起，界面会断开几秒。',
    });
  }

```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主原生能力或简单替代，dsh-restart-dock 的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对手工重开，它把“只刷新 client”和“重启 Host”分成明确按钮，并加入包重建门禁、倒计时撤回和重启报告。贡献是开发交互与安全接线，不是跨平台进程管理；Windows-only 和强制停止限制了普适性。

刷新门禁会对比artifactBaseline的mtime/ctime/size，并尝试fetchBundle和new Function只编译。包不可取或显式语法错误会ready=false，但缺clientModules/no-baseline/stat异常/检查抛错多条路径仍保留ready=true；客户端请求异常也放行。其增量是尽力提示，不是构建事务或保证刷新安全的门禁。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-25](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/README.md#L5-L25)

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

**依据 2 · 源码核查**：[lib/index.js:327-390](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/lib/index.js#L327-L390)

明确失败与缺信息放行分支。

<details>
<summary>查看原文（64行）</summary>

```text

    const cm = getClientModules();
    if (!cm || typeof cm.artifactBaseline !== 'function') {
      // 拿不到 clientModules 就保守放行 —— 这个接口只做提示，不阻断用户。
      return json(res, 200, { ok: true, ready: true, detail: 'no-client-modules' });
    }

    let ready = true;
    let detail = 'stable';
    let syntax = 'skipped';
    try {
      const base = cm.artifactBaseline(name);
      if (!base || !base.path) {
        detail = 'no-baseline';
      } else {
        const st = statSync(base.path);
        const changed = st.mtimeMs !== base.mtimeMs || st.ctimeMs !== base.ctimeMs || st.size !== base.size;
        ready = !changed;
        detail = changed ? 'rebuilding' : 'stable';
      }
    } catch (error) {
      detail = 'stat-failed';
    }

    // 第二道：光看时间戳不够 —— HMR 可能「重建已完成、但产出的包本身是坏的」，
    // 这种包时间戳正常却一加载就 import failed（2026-10-18 21:41 实测，保护没拦住）。
    // 所以把当前 bundle 取出来，用 new Function 干跑一遍语法检查；编译不过就不让刷。
    try {
      if (typeof cm.graph === 'function' && typeof cm.fetchBundle === 'function') {
        const graph = cm.graph();
        const entry = graph && graph.entries ? graph.entries.find((e) => e.id === name) : null;
        if (entry && entry.rev) {
          const url = `http://dsh-restart-dock.local/plugins/??${encodeURIComponent(name)}/client.js&rev=${entry.rev}`;
          const bundleRes = await cm.fetchBundle(new Request(url));
          if (!bundleRes || !bundleRes.ok) {
            // **取不到包 = 这孩子不能放行**。之前这里只记 syntax、忘了把 ready 置否，
            // 结果「包还没准备好」时守卫反而放行，刷新照样 import failed
            // （2026-10-18 22:09 实测又崩一次）。
            syntax = 'fetch-failed';
            ready = false;
            detail = 'bundle-unavailable';
          } else {
            const text = await bundleRes.text();
            if (!text || text.length < 200) {
              syntax = 'too-short';
              ready = false;
              detail = 'bundle-too-short';
            } else {
              try {
                // 只编译不执行：能过说明语法是好的
                new Function(text);
                syntax = 'ok';
              } catch (compileError) {
                syntax = 'syntax-error';
                ready = false;
                detail = 'bundle-syntax-error';
              }
            }
          }
        }
      }
    } catch (error) {
      syntax = 'check-failed';
    }
```

</details>

**依据 3 · 源码核查**：[client.js:665-684](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/client.js#L665-L684)

前端请求异常放行。

<details>
<summary>查看原文（20行）</summary>

```text
        // 为什么：client 插件包是按需拼的，本地文件刚改过会有一小段「重建中」；
        // 这个窗口里刷新会拿到坏包 → import failed → 整个 web boot 起不来
        // （2026-10-18 21:37 就是这么刷崩的，只能手动重启）。
        // 宿主侧用 clientModules 的文件基线对比磁盘，能准确判断这个窗口。
        let ready = true;
        try {
          const res = await fetch(BASE + '/bundle-ready', { headers: MARK, cache: 'no-store' });
          if (res.ok) {
            const data = await res.json().catch(() => null);
            if (data && data.ready === false) ready = false;
          }
        } catch {
          ready = true; // 查不到就放行，不拿接口故障阻断用户
        }

        if (!ready) {
          setPhase('idle');
          setNote(T.pkgNotReady);
          return;
        }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使 dsh-restart-dock 的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键风险是重启属于破坏性副作用。自定义头/CORS 防跨站不等于完整鉴权，同源受害页面或宿主路由暴露仍需核对；helper 若受 job object 牵连可能无法拉起。插件不等本轮结束、不自动续话，未保存状态会被中断。

路由要求自定义头，但无Origin时直接允许，dsh-app协议也允许；同源脚本或非浏览器客户端能提供这些头，未见宿主用户确认凭据校验。前端二次选择只约束按钮路径，直接POST不需要确认token。helper不等活跃任务结束或会话落盘；按树Force停止并清理父PID属于本次名单的孤儿，非完整应用事务。停止失败会再杀并在顶层仍存活时拒绝拉起，但子进程清理错误多被静默处理。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:131-220](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/lib/index.js#L131-L220)

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

**依据 2 · 源码核查**：[lib/index.js:77-112](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/lib/index.js#L77-L112)

头和Origin检查，不构成人类授权。

<details>
<summary>查看原文（36行）</summary>

```text
function trustCheck(req, serverOrigin) {
  if (req.headers[HEADER_MARK] !== '1') return { ok: false, reason: 'missing-mark' };

  const site = req.headers['sec-fetch-site'];
  if (typeof site === 'string' && site === 'cross-site') return { ok: false, reason: 'site:cross-site' };

  const origin = req.headers.origin;
  const hasOrigin = typeof origin === 'string' && origin !== '';
  if (!hasOrigin) return { ok: true, reason: 'no-origin' };

  let asked;
  try {
    asked = new URL(origin);
  } catch {
    return { ok: false, reason: `bad-origin:${origin}` };
  }

  // DSH 桌面 app 的页面协议。外部网页无法伪造浏览器自己写的 Origin，所以这一条可信。
  if (asked.protocol === 'dsh-app:') return { ok: true };

  let base;
  try {
    base = new URL(serverOrigin);
  } catch {
    return { ok: false, reason: 'bad-server-origin' };
  }
  if (asked.protocol !== base.protocol) return { ok: false, reason: `proto:${asked.protocol}|${base.protocol}` };
  if (asked.port !== base.port) return { ok: false, reason: `port:${asked.port}|${base.port}` };
  if (asked.hostname === base.hostname) return { ok: true };
  // 监听在 0.0.0.0 / :: 时，页面实际拿的是 127.0.0.1 或 localhost —— 同一台机器、同一个端口就算同源。
  if (LOOPBACK.has(asked.hostname) && LOOPBACK.has(base.hostname)) return { ok: true };
  return { ok: false, reason: `host:${asked.hostname}|${base.hostname}` };
}

function isTrusted(req, serverOrigin) {
  return trustCheck(req, serverOrigin).ok;
```

</details>

**依据 3 · 源码核查**：[lib/relaunch.ps1:135-174](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/lib/relaunch.ps1#L135-L174)

停树与孤儿清理范围。

<details>
<summary>查看原文（40行）</summary>

```text
function Stop-Tree([int]$RootId) {
    $desc = Get-Descendants $RootId
    $allIds = @($RootId) + @($desc)
    # 先叶子后根：倒着杀，避免父进程先死留下孤儿。
    for ($i = $desc.Count - 1; $i -ge 0; $i--) {
        try { Stop-Process -Id $desc[$i] -Force -ErrorAction SilentlyContinue } catch { }
    }
    try { Stop-Process -Id $RootId -Force -ErrorAction SilentlyContinue } catch { }

    # 复查 + 清孤儿。
    # 教训（2026-10-18 20:54）：只杀一次不够 —— 杀父进程之后，它的子进程会变成
    # 「父进程 pid 已死」的孤儿继续活着，残留的 web 宿主占着端口，新实例启动时
    # 连上去认证失败（Error: desktop welcome: Web authentication failed），
    # 于是新桌面版起一次崩一次。
    # 判据要精确：只清「父进程 pid 在本次清理名单里」的进程 ——
    # 绝不能按「父进程已死」判断，因为正常的桌面版主进程，其父进程本来就已经退了
    # （那样会把用户正在用的实例和 3081 救援通道一起误杀）。
    Start-Sleep -Milliseconds 700
    $set = @{}
    foreach ($id in $allIds) { $set[[string]$id] = $true }
    $orphanKilled = 0
    try {
        $alive = @(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue)
        foreach ($p in $alive) {
            $pp = [string]$p.ParentProcessId
            if ($set.ContainsKey($pp)) {
                try { Stop-Process -Id ([int]$p.ProcessId) -Force -ErrorAction SilentlyContinue; $orphanKilled += 1 } catch { }
            }
        }
    } catch { }
    if ($orphanKilled -gt 0) { Write-Log ("清了 {0} 个孤儿进程（父进程在本次清理名单里）" -f $orphanKilled) }
    # 名单里还剩活着的（刚才强杀没成功的），再补一刀。
    $stillAlive = 0
    foreach ($id in $allIds) {
        if ($null -ne (Get-Process -Id $id -ErrorAction SilentlyContinue)) {
            $stillAlive += 1
            try { Stop-Process -Id $id -Force -ErrorAction SilentlyContinue } catch { }
        }
    }
    if ($stillAlive -gt 0) { Write-Log ("补刀：名单里还有 {0} 个没退，再强杀一遍" -f $stillAlive) }
```

</details>

**依据 4 · 源码核查**：[lib/relaunch.ps1:289-309](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/lib/relaunch.ps1#L289-L309)

强停、等待与失败拒绝重拉。

<details>
<summary>查看原文（21行）</summary>

```text

    # ---------- 3) 等一会儿：让 HTTP 响应先回到界面 ----------
    if ($DelaySeconds -gt 0) { Start-Sleep -Seconds $DelaySeconds }

    # ---------- 4) 停 ----------
    Write-Log ("stopping tree of {0}" -f $targetPid)
    Stop-Tree $targetPid

    if (-not (Wait-Gone $targetPid 20000)) {
        Write-Log ("target {0} 20s 内没有退出，再强杀一轮" -f $targetPid)
        Stop-Tree $targetPid
        if (-not (Wait-Gone $targetPid 8000)) {
            throw ("进程 {0} 停不下来（可能被保护或被别的实例占着），已放弃拉起以免出现两个实例" -f $targetPid)
        }
    }
    # 给端口/锁文件留足释放时间。
    # 实测教训（2026-10-18 20:25）：只等 600ms 就拉起，Electron 的 `--remote-debugging-port`
    # 会静默绑定失败（进程照常起来、命令行参数也对，就是端口不监听），界面上完全没事，
    # 但调试通道没了。等 3 秒能稳定绑上。
    Start-Sleep -Seconds 3

```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-restart-dock 启动、持续生效与失败降级依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

Host 重启仅支持 Windows、PowerShell 5.1 和声明区间 DSH，需能探测顶层可执行文件并写 ~/.dsh/dsh-restart-dock；刷新只依赖 web UI。找不到目标或非 Windows 返回拒绝/501，浏览器页面消失后自动刷新只对外部浏览器有意义。

当前刷新能力跨平台，Host重启路由在非Windows明确501。Windows helper需要可读进程命令行/路径、WMI/CIM、Explorer与WScript.Shell；从caller祖先最多12层找DSH标记，再爬同exe顶层，找不到拒绝而非全机猜测。状态目录写失败被writeJson吞并返回false而路由未检查，因此收到202不保证pending可审计。特殊启动器和原参数需检查，不能依据包兼容字段确认成功。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-25](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/README.md#L5-L25)

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

**依据 2 · 源码核查**：[lib/relaunch.ps1:199-244](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/lib/relaunch.ps1#L199-L244)

目标祖先定位与拒绝。

<details>
<summary>查看原文（46行）</summary>

```text
    $target = $null
    $resolution = ''

    if ($TargetPid -gt 0) {
        $target = Get-ProcInfo $TargetPid
        if ($null -eq $target) {
            throw ("指定的目标 pid {0} 不在运行" -f $TargetPid)
        }
        $resolution = 'explicit-target'
    }
    else {
        # 找「DSH 那一侧」的进程
        $anchorId = $CallerPid
        $anchor = $null
        for ($i = 0; $i -lt 12; $i++) {
            $candidate = Get-ProcInfo $anchorId
            if ($null -eq $candidate) { break }
            if (Test-DshProcess $candidate) { $anchor = $candidate; break }
            $parentId = [int]$candidate.ParentProcessId
            if ($parentId -le 0) { break }
            $anchorId = $parentId
        }
        if ($null -eq $anchor) {
            throw ("找不到 DSH 进程（从 pid {0} 往上 12 层都没有 dsh-desktop-host / dsh 标记）" -f $CallerPid)
        }

        # 爬到「同一可执行文件的最顶层」= 用户会双击的那个应用
        $exe = [string]$anchor.ExecutablePath
        if ([string]::IsNullOrEmpty($exe)) {
            throw ("pid {0} 拿不到可执行文件路径，拒绝重启" -f $anchorId)
        }
        $top = $anchor
        for ($i = 0; $i -lt 16; $i++) {
            $parent = Get-ProcInfo ([int]$top.ParentProcessId)
            if ($null -eq $parent) { break }
            $parentExe = ''
            try { $parentExe = [string]$parent.ExecutablePath } catch { }
            if ([string]::IsNullOrEmpty($parentExe)) { break }
            if ($parentExe -ne $exe) { break }
            # Chromium 子进程有 --type=，向上不能穿到渲染/GPU 进程
            if ([string]$parent.CommandLine -like '*--type=*') { break }
            $top = $parent
        }
        $target = $top
        $resolution = 'ancestor-walk'
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:48-61](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/lib/index.js#L48-L61)

写盘失败返回false。

<details>
<summary>查看原文（14行）</summary>

```text
  }
}

function writeJson(file, value) {
  try {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(value, null, 2), 'utf8');
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------ 同源判断 */
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · dsh-restart-dock 完成一个合格任务的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

首次需核状态路由与目标PID并准备手工救援。网页没有dry-run；helper的DryRun需维护者手工明确目标调用。持续有本地资源开销，重启中断目标树任务，现金费用与实际停机时间未测。失败应查last.json/helper.log和真实进程，再决定手工启动，不重复请求未知状态重启。

包不提供网页dry-run入口；README中的helper DryRun必须手工明确目标调用，不能建议用户在按钮里选不存在的演算功能。客户端倒计时取消只在POST前有效。持续资源是路由请求、重启时helper与900ms轮询，资源量和现金未知；强停会中断全部目标树任务。90秒slow或202网络回执不明时要先核last、pending和实际进程，不应因锁过期再次点重启。停机并非已测数秒：helper含延迟、最多20+8秒等停止、3秒释放等待、40秒找新进程及存活检查。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:131-220](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/lib/index.js#L131-L220)

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

**依据 2 · 源码核查**：[lib/relaunch.ps1:277-309](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/lib/relaunch.ps1#L277-L309)

helper DryRun及真实等待。

<details>
<summary>查看原文（33行）</summary>

```text
    if ($DryRun) {
        $sw.Stop()
        Write-Log ("dry-run: would relaunch {0} with args [{1}]" -f $targetExe, $launchArgs)
        Write-Report 'dry-run' @{
            targetPid  = $targetPid
            targetExe  = $targetExe
            durationMs = [int]$sw.ElapsedMilliseconds
            detail     = ('dry run：会停掉 {0}（{1}），再按原命令行拉起' -f $targetPid, $targetName)
            launchArgs = $launchArgs
        }
        exit 0
    }

    # ---------- 3) 等一会儿：让 HTTP 响应先回到界面 ----------
    if ($DelaySeconds -gt 0) { Start-Sleep -Seconds $DelaySeconds }

    # ---------- 4) 停 ----------
    Write-Log ("stopping tree of {0}" -f $targetPid)
    Stop-Tree $targetPid

    if (-not (Wait-Gone $targetPid 20000)) {
        Write-Log ("target {0} 20s 内没有退出，再强杀一轮" -f $targetPid)
        Stop-Tree $targetPid
        if (-not (Wait-Gone $targetPid 8000)) {
            throw ("进程 {0} 停不下来（可能被保护或被别的实例占着），已放弃拉起以免出现两个实例" -f $targetPid)
        }
    }
    # 给端口/锁文件留足释放时间。
    # 实测教训（2026-10-18 20:25）：只等 600ms 就拉起，Electron 的 `--remote-debugging-port`
    # 会静默绑定失败（进程照常起来、命令行参数也对，就是端口不监听），界面上完全没事，
    # 但调试通道没了。等 3 秒能稳定绑上。
    Start-Sleep -Seconds 3

```

</details>

**依据 3 · 源码核查**：[client.js:550-564](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/client.js#L550-L564)

90秒停止轮询而非撤销动作。

<details>
<summary>查看原文（15行）</summary>

```text
            } else {
              sawDown.current = true;
            }
          } catch {
            sawDown.current = true;
          }
          if (sawDown.current) setNote(T.waiting);
          // 整个重启最长可能走 70 秒左右（等停 + 补刀 + 拉起轮询），
          // 所以放弃阈值给到 90 秒 —— 别在它还好好地重启时先说"比预期久"。
          if (Date.now() - startedAt.current > 90000) {
            setPhase('slow');
            setNote(T.slow);
            return;
          }
          pollTimer.current = setTimeout(tick, 900);
```

</details>

#### 缺口

- 目标 Windows 环境的停拉成功率与同源边界未由本轮验证
  **影响**：一次失败即可让开发环境离线
  **进一步探讨**：在空闲实例由维护者手工明确目标执行helper DryRun（网页无此入口），再核真实重启、helper 被终止和同源/跨源请求矩阵，并记录手工救援时间

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · dsh-restart-dock 的工程可靠性和可迁移设计如何？

**研究主题**：工程质量与复用

#### 完整回答

Host 路由、UI 和 PowerShell helper 职责分离，目标探测与报告可审计，bundle-ready 尝试识别刚改 client.js 后的坏包，但缺服务或检查异常可能放行，不能保证安全刷新。可借鉴的是“破坏动作先探测、确认、离进程执行、落盘报告”；移植到 macOS/Linux 必须重写进程树与拉起语义。

helper重拉先记录同名进程PID，Explorer后找新出现同名PID，不能完整证明该PID对应此次命令或正确Host；再等1.5秒看仍活着后写relaunched，没有端口/会话健康验收。直接回退同样只看进程生存。因此报告是进程层动作记录，浏览器HTTP恢复另有独立且未绑定本次id的判断，二者均不是未保存任务恢复协议。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:131-220](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/lib/index.js#L131-L220)

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

**依据 2 · 源码核查**：[lib/relaunch.ps1:337-386](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/lib/relaunch.ps1#L337-L386)

新同名进程排旧PID与存活检查。

<details>
<summary>查看原文（50行）</summary>

```text
    $launchVia = ''
    if ($lnkReady) {
        # 拉起前先把「已经存在的同名进程」记下来 —— 它们可能是另一个实例
        # （比如 3081 救援通道），不能当成我们刚拉起的那个。
        # 2026-10-18 实测踩过：newPid 报成了救援通道的 6732，而真正的新进程是 6932。
        $beforeIds = @(Get-Process -Name $procName -ErrorAction SilentlyContinue | ForEach-Object { [int]$_.Id })
        try { Start-Process -FilePath 'explorer.exe' -ArgumentList $lnkPath } catch { Write-Log ("explorer 启动失败：" + $_.Exception.Message) }
        $deadline = (Get-Date).AddSeconds(40)
        while ((Get-Date) -lt $deadline) {
            Start-Sleep -Milliseconds 400
            if ([string]::IsNullOrEmpty($procName)) { break }
            $fresh = @(Get-Process -Name $procName -ErrorAction SilentlyContinue | Where-Object { $beforeIds -notcontains [int]$_.Id })
            if ($fresh.Count -gt 0) { $newPid = [int]$fresh[0].Id; break }
        }
        if ($newPid -gt 0) {
            $launchVia = 'explorer'
            Write-Log ("explorer 拉起成功：newPid={0}（拉起前已有 {1} 个同名进程，已排除）" -f $newPid, $beforeIds.Count)
        }
    }

    if ($newPid -le 0) {
        Write-Log 'explorer 没能拉起新进程，退回直接 Start-Process（可能起不来窗口）'
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = $targetExe
        $psi.Arguments = $launchArgs
        if (-not [string]::IsNullOrEmpty($workingDir)) { $psi.WorkingDirectory = $workingDir }
        $psi.UseShellExecute = $true
        $started = [System.Diagnostics.Process]::Start($psi)
        Start-Sleep -Milliseconds 1500
        if ($null -ne $started) { try { $newPid = [int]$started.Id; $launchVia = 'direct' } catch { } }
    }

    if ($newPid -le 0) { throw '拉起失败：Explorer 与直接 Start 都没拿到新进程' }

    Start-Sleep -Milliseconds 1500
    $alive = Get-Process -Id $newPid -ErrorAction SilentlyContinue
    if ($null -eq $alive) { throw ("新进程 {0} 一起来就退了（看 exe / 参数的兼容性）" -f $newPid) }

    $sw.Stop()
    Write-Log ("done: newPid={0} in {1}ms" -f $newPid, $sw.ElapsedMilliseconds)
    Write-Report 'relaunched' @{
        targetPid  = $targetPid
        targetExe  = $targetExe
        newPid     = $newPid
        launchArgs = $launchArgs
        launchVia  = $launchVia
        durationMs = [int]$sw.ElapsedMilliseconds
        detail     = ('已停下 {0}，并重新拉起为 {1}（经 {2}）' -f $targetPid, $newPid, $launchVia)
    }
    exit 0
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与限制可推导什么可证伪的新设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把当前任务忙闲状态接入重启坞，只在会话已落盘且无活跃工具时启用“安全重启”，可减少中断事故。最小实验注入活跃/空闲/写盘三种状态各 20 次，比较当前按钮与门控版的误中断率、恢复成功率和等待时间；若忙闲信号漏报一次破坏性中断即不应自动启用。

最小验证还应注入status短时403/网络断线后旧Host继续应答、丢202回执、helper迟到超过内存锁、bundle检查服务缺失和同名新进程干扰。若只看到HTTP200就称恢复，或未知落盘仍允许强停，便否定“安全重启”假设；需可绑定重启id的新Host/落盘ACK，而不是仅把按钮置灰。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:131-220](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/lib/index.js#L131-L220)

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

**依据 2 · 源码核查**：[client.js:536-564](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/client.js#L536-L564)

当前恢复判据用作反例基线。

<details>
<summary>查看原文（29行）</summary>

```text

      const pollUntilBack = useCallback(() => {
        const tick = async () => {
          if (!alive.current) return;
          try {
            const res = await fetch(BASE + '/status', { headers: MARK, cache: 'no-store' });
            if (res.ok) {
              if (sawDown.current) {
                // 宿主真的停过又回来了：自动刷新，用户不用自己按。
                setPhase('restarting');
                setNote(T.done);
                try { window.location.reload(); } catch { /* 忽略 */ }
                return;
              }
            } else {
              sawDown.current = true;
            }
          } catch {
            sawDown.current = true;
          }
          if (sawDown.current) setNote(T.waiting);
          // 整个重启最长可能走 70 秒左右（等停 + 补刀 + 拉起轮询），
          // 所以放弃阈值给到 90 秒 —— 别在它还好好地重启时先说"比预期久"。
          if (Date.now() - startedAt.current > 90000) {
            setPhase('slow');
            setNote(T.slow);
            return;
          }
          pollTimer.current = setTimeout(tick, 900);
```

</details>

#### 缺口

- 目标 Windows 环境的停拉成功率与同源边界未由本轮验证
  **影响**：一次失败即可让开发环境离线
  **进一步探讨**：在空闲实例由维护者手工明确目标执行helper DryRun（网页无此入口），再核真实重启、helper 被终止和同源/跨源请求矩阵，并记录手工救援时间

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人应观察、试用或拒绝采用 dsh-restart-dock？

**研究主题**：采用判断

#### 完整回答

建议具备人工救援通道的Windows插件开发者观察。先核状态、目标和原命令；网页没有dry-run，若要演算须由维护者按文档明确目标调用helper的DryRun，再在无重要任务环境自行完成一次真实停拉和手工救援。只刷新客户端可先看构建门禁，但检查异常会放行，仍须保留手工重开方法。POST发出后不提供取消；网络回执未知、90秒slow、目标不明确或报告停armed时停止重试，人工核实际进程与日志，不把HTTP回归等同本次成功。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-25](https://github.com/7gzgn/dsh-restart-dock/blob/308cae353be22472e8af0b2c949e052afc86520a/README.md#L5-L25)

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
  **进一步探讨**：在空闲实例由维护者手工明确目标执行helper DryRun（网页无此入口），再核真实重启、helper 被终止和同源/跨源请求矩阵，并记录手工救援时间

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
