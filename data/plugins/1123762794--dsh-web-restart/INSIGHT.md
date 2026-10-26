# dsh-web-restart

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[5de8214](https://github.com/1123762794/dsh-web-restart/tree/5de8214051b3245a8cfc825e7e907cf5e57f51d8)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1123762794/dsh-web-restart)
<!-- END META -->

> **实现功能**：Windows DSH Web 的侧栏重启按钮，调用硬编码 PowerShell 外部脚本。

> **核心亮点**：将重启入口与在线状态点放进 DSH Web 侧栏；用户可从界面触发作者环境的维护动作。详见[Q01](#research-q01)。

> **风险与缺陷**：已触发 UI 不代表重启成功，路由只有方法/重入检查；全权限外部脚本和单击中断需核外层授权。详见[Q03](#research-q03)与[Q04](#research-q04)。

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
  - [Q01 · 一键重启适合什么场景，默认能否直接迁移？](#detail-section-11)
  - [Q02 · 前后端如何触发并反馈重启？](#detail-section-12)
  - [Q03 · 失败状态和防重入会不会误导用户？](#detail-section-13)
  - [Q04 · 重启路由的权限和滥用面如何界定？](#detail-section-14)
  - [Q05 · 如何把它变成可核验的维护操作？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：作者 Windows Web profile 的维护操作；单击会中断 DSH 服务，脚本路径必须按机器改。详见[Q01](#research-q01)。

手工受控终端重启可查看脚本退出和进程状态；当前按钮省点击但隐藏失败。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 一键重启 | 操作便捷 | 作者硬编码脚本 |
| 防重入 | 限本进程重复调用 | 客户端忽略 ok:false |
| 在线点 | 可达性显示 | 非执行成功证明 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH webServer/shell/slots | 必需 | 路由、进程、按钮 | 无法触发 |
| Windows PowerShell | 必需 | 独立重启进程 | 启动失败 |
| D:\1\dsh-web-host.ps1 | 必需 | 实际停/启动 | 仓库不含、需自备 |

#### 操作步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 预备 | 审核外部脚本/会话与权限 | 可回滚 |
| 安装 | 改路径、profile 加载 | 按钮与健康点出现 |
| 触发 | 单击按钮 | 仅收到请求已接受 |
| 验收 | Web 断开再恢复/会话复核 | 成功要端到端验证 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 安装 | DSH Web/Windows/受控 ps1，价格未知 | fork、改路径、安装 | 脚本未提供 |
| 操作 | 主动断开约 15–20 秒为作者说法 | 检查会话/通知并等待 | 实际恢复未证 |
| 故障 | 全权限脚本/错误反馈 | 人工排障和回滚 | 响应不反映执行结果 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 侧栏按钮 | 单击 POST | 服务真实重启 |
| 防重入 | 进程内 bool | 多进程/脚本层重入 |
| 状态点 | 健康路由可达 | 会话恢复/脚本成功 |

> **思考**：已触发 UI 不代表重启成功，路由只有方法/重入检查；全权限外部脚本和单击中断需核外层授权。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将重启入口与在线状态点放进 DSH Web 侧栏；用户可从界面触发作者环境的维护动作。详见[Q01](#research-q01)。

将重启入口与在线状态点放进 DSH Web 侧栏；用户可从界面触发作者环境的维护动作。详见[Q01](#research-q01)。

原生 setTimeout 避开 handler fiber 的约束是实现细节；缺脚本配置、执行回执与权限边界，UI 忽略 ok:false。详见[Q02](#research-q02)至[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

已触发 UI 不代表重启成功，路由只有方法/重入检查；全权限外部脚本和单击中断需核外层授权。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

暂不直接采用；只在隔离 Windows 复核脚本、授权和失败状态后考虑。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可核按钮与后端启动链，但外部脚本缺失/硬编码，响应在执行前确认且 Client 忽略 ok:false；目标环境未跑。

- 已检查：作者 README、包清单、源码路径 README.zh.md、lib/index.js、lib/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.zh.md、Host/Client/包声明；未运行目标 PowerShell/插件，仓库无外部 ps1；旧 META 仅复用。
- 下一步：隔离 Windows 测脚本存在/失败、ok:false、外层授权、实际进程退出/再上线、会话落盘和重复请求。

**分析版本**

- **仓库**：[1123762794/dsh-web-restart](https://github.com/1123762794/dsh-web-restart)
- **版本号**：0.1.0（[固定提交 5de8214](https://github.com/1123762794/dsh-web-restart/tree/5de8214051b3245a8cfc825e7e907cf5e57f51d8)）
- **版本日期**：2026-08-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为受控脚本路径、管理员授权/确认、异步 job 回执和恢复验收；先在隔离环境实测。详见[Q05](#research-q05)。

隔离 Windows 测脚本存在/失败、ok:false、外层授权、实际进程退出/再上线、会话落盘和重复请求。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 218 | 173 | 34 | — |
| .md | source | 2 | 164 | — | — | 1267 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1123762794/dsh-web-restart/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：一键重启能否在受控权限下可靠触发、报告结果并恢复 DSH Web？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 一键重启适合什么场景，默认能否直接迁移？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件面向作者 Windows 上的 DSH Web：侧栏底部一个单击重启按钮和 5 秒健康状态点。Host 延后 1 秒启动隐藏 PowerShell 子进程，子进程再等 3 秒运行作者机器的 D:\1\dsh-web-host.ps1；脚本本身不在仓库。README 明确要求 fork 后改硬编码路径，故不能把本仓库当通用可安装重启方案。它会中断活跃会话，作者的“自动落盘恢复/15–20秒”未有目标环境复核。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:3-16](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/README.zh.md#L3-L16)

作者场景及恢复声明

<details>
<summary>查看原文（14行）</summary>

```text
**DeepSeek Harness Web 界面的一键重启按钮。**

在侧边栏底部（设置按钮旁）增加一个圆形重启按钮（↻）。**单击**即可立即重启 `dsh web` 进程——页面断开约 15–20 秒，刷新后一切恢复（会话数据自动落盘并恢复）。按钮是**常驻**的：它触发的重启不会把它自己带走。

> 仅限 Windows：重启通过独立的隐藏 PowerShell 进程拉起 `dsh web`，因此即使 harness 进程被杀死，脚本也会继续执行完毕。

## 功能

- 单击直接重启——无需二次确认，也不用连点两下。
- 常驻：以 bundle 层插件安装，DSH 重启后依然存在（不是会话级动态插件）。
- 轻量：位于侧边栏底部设置入口旁；56px 窄轨只显示图标，宽轨显示图标 + 文字。
- 状态反馈：请求处理中按钮变红并显示「重启中…」→「已触发」。
- 防重入：重启进行中再次点击会被拒绝。
- 在线状态点：按钮旁显示 DSH 存活状态——绿色圆点每 5 秒轮询 `GET /dsh-health`（harness 不可达 / 重启中显示红色）。
```

</details>

**依据 2 · 作者声明**：[README.zh.md:66-70](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/README.zh.md#L66-L70)

作者承认脚本路径硬编码

```text
## 兼容性

- DeepSeek Harness `0.1.0-rc.6`（web profile）。
- 重启脚本路径（`D:\1\dsh-web-host.ps1`）硬编码自作者机器——**请 fork 后自行调整**（或替换 `lib/index.js` 中的命令）。欢迎贡献使其可配置。

```

**依据 3 · 源码核查**：[lib/index.js:46-65](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/lib/index.js#L46-L65)

具体 PowerShell 启动链

<details>
<summary>查看原文（20行）</summary>

```text
      restarting = true
      // 注意：webServer handler 是纯 Node http 回调，不在 Cordis fiber 上下文里，
      // ctx.timeout（mixin→ctx.effect）在此不触发；改用 Node 原生 setTimeout。
      setTimeout(() => {
        try {
          // 独立进程 + 内部 3 秒延迟：DSH 被脚本杀掉后脚本继续执行，前端有时间渲染状态
          const command = "Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-Command','Start-Sleep -Seconds 3; & \"D:\\1\\dsh-web-host.ps1\"' -WindowStyle Hidden"
          const spec = ctx.shell.resolve({
            command,
            sandboxPolicy: { mode: 'danger-full-access' }
          })
          ctx.shell.start(spec)
          console.log('[dsh-web-restart] restart script launched')
        } catch (error) {
          restarting = false
          console.error('[dsh-web-restart] failed to launch restart:', error)
        }
      }, 1000)
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: true, message: '重启已触发：DSH 将断开约 15-20 秒，之后请刷新页面' }))
```

</details>

**依据 4 · 源码核查**：[lib/client.js:45-81](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/lib/client.js#L45-L81)

按钮与轮询

<details>
<summary>查看原文（37行）</summary>

```text
      // ── footer action button + online status dot ──
      ctx.effect(() => {
        var disposeSlot = ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
          name: 'sidebar.footer.action',
          id: 'restart-dsh',
          order: -100,
          label: () => '重启 DSH'
        }, (props) => {
          var wide = props.wide;
          var phaseState = React.useState('idle');
          var phase = phaseState[0];
          var setPhase = phaseState[1];
          var messageState = React.useState('');
          var message = messageState[0];
          var setMessage = messageState[1];
          // 在线状态：'checking' | 'ok' | 'down'
          var healthState = React.useState('checking');
          var health = healthState[0];
          var setHealth = healthState[1];

          // 每 5 秒探测 /dsh-health；fetch 失败或非 200 视为离线
          React.useEffect(function () {
            var check = function () {
              fetch('/dsh-health', { method: 'GET' })
                .then(function (res) { return res.ok ? setHealth('ok') : setHealth('down'); })
                .catch(function () { setHealth('down'); });
            };
            check();
            var timer = setInterval(check, 5000);
            return function () { clearInterval(timer); };
          }, []);

          // 单击直接重启（无二次确认）
          var click = () => {
            if (phase === 'sending' || phase === 'done') return;
            setPhase('sending');
            fetch('/restart-dsh', { method: 'POST' })
```

</details>

#### 缺口

- 外部脚本内容与宿主持久化行为未知
  **影响**：不能承诺跨机可用或会话安全恢复
  **进一步探讨**：取得脚本后在隔离 Windows 测环境与持久化

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 前后端如何触发并反馈重启？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Client 在 sidebar.footer.action 注入按钮，单击 POST /restart-dsh；Host 仅允许 POST，进程内 restarting 标志阻止重复启动，立即返回 ok:true，再用 Node setTimeout 异步 shell.resolve/start，sandboxPolicy 为 danger-full-access。健康路由 /dsh-health 返回时间戳，客户端每 5 秒轮询；但状态点只说明该路由当下可达，不能证明外部脚本已启动或重启成功。目标宿主权限和进程行为未测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:20-69](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/lib/index.js#L20-L69)

路由/延迟/权限/锁

<details>
<summary>查看原文（50行）</summary>

```text
export function apply(ctx) {
  let restarting = false

  const disposeHealth = ctx.webServer.register({
    kind: 'exact',
    path: '/dsh-health',
    handler: async (req, res) => {
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' })
      res.end(JSON.stringify({ ok: true, ts: Date.now() }))
    }
  })

  const disposeRoute = ctx.webServer.register({
    kind: 'exact',
    path: '/restart-dsh',
    handler: async (req, res) => {
      if (req.method !== 'POST') {
        res.writeHead(405, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ ok: false, message: 'method not allowed' }))
        return
      }
      if (restarting) {
        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ ok: false, message: '重启已在进行中，请稍候' }))
        return
      }
      restarting = true
      // 注意：webServer handler 是纯 Node http 回调，不在 Cordis fiber 上下文里，
      // ctx.timeout（mixin→ctx.effect）在此不触发；改用 Node 原生 setTimeout。
      setTimeout(() => {
        try {
          // 独立进程 + 内部 3 秒延迟：DSH 被脚本杀掉后脚本继续执行，前端有时间渲染状态
          const command = "Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-Command','Start-Sleep -Seconds 3; & \"D:\\1\\dsh-web-host.ps1\"' -WindowStyle Hidden"
          const spec = ctx.shell.resolve({
            command,
            sandboxPolicy: { mode: 'danger-full-access' }
          })
          ctx.shell.start(spec)
          console.log('[dsh-web-restart] restart script launched')
        } catch (error) {
          restarting = false
          console.error('[dsh-web-restart] failed to launch restart:', error)
        }
      }, 1000)
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: true, message: '重启已触发：DSH 将断开约 15-20 秒，之后请刷新页面' }))
    }
  })

  return () => { disposeHealth(); disposeRoute() }
```

</details>

**依据 2 · 源码核查**：[lib/client.js:45-91](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/lib/client.js#L45-L91)

按钮调用与健康轮询

<details>
<summary>查看原文（47行）</summary>

```text
      // ── footer action button + online status dot ──
      ctx.effect(() => {
        var disposeSlot = ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
          name: 'sidebar.footer.action',
          id: 'restart-dsh',
          order: -100,
          label: () => '重启 DSH'
        }, (props) => {
          var wide = props.wide;
          var phaseState = React.useState('idle');
          var phase = phaseState[0];
          var setPhase = phaseState[1];
          var messageState = React.useState('');
          var message = messageState[0];
          var setMessage = messageState[1];
          // 在线状态：'checking' | 'ok' | 'down'
          var healthState = React.useState('checking');
          var health = healthState[0];
          var setHealth = healthState[1];

          // 每 5 秒探测 /dsh-health；fetch 失败或非 200 视为离线
          React.useEffect(function () {
            var check = function () {
              fetch('/dsh-health', { method: 'GET' })
                .then(function (res) { return res.ok ? setHealth('ok') : setHealth('down'); })
                .catch(function () { setHealth('down'); });
            };
            check();
            var timer = setInterval(check, 5000);
            return function () { clearInterval(timer); };
          }, []);

          // 单击直接重启（无二次确认）
          var click = () => {
            if (phase === 'sending' || phase === 'done') return;
            setPhase('sending');
            fetch('/restart-dsh', { method: 'POST' })
              .then((res) => res.json().catch(() => null))
              .then((data) => {
                setPhase('done');
                setMessage((data && data.message) || '重启已触发');
              })
              .catch((err) => {
                setPhase('error');
                setMessage(String((err && err.message) || err));
              });
          };
```

</details>

**依据 3 · 作者声明**：[README.zh.md:52-65](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/README.zh.md#L52-L65)

作者机制说明

<details>
<summary>查看原文（14行）</summary>

```text
## 工作原理

| 层 | 文件 | 作用 |
| --- | --- | --- |
| Host | `lib/index.js` | 在 webServer 注册精确路由 `POST /restart-dsh`；以 `danger-full-access` 沙箱策略、独立隐藏 PowerShell 进程启动重启脚本 |
| Client | `lib/client.js` | 在 `sidebar.footer.action` slot 注册侧边栏底部按钮；单击 `fetch` `POST /restart-dsh`；每 5 秒轮询 `GET /dsh-health` 驱动状态点 |
| Bundle | `cordis.patch.yml` | 同时挂载 host / client 两半的加载器行 |

host 路由在重启发生**之前**返回（约 1 秒宿主定时器 + 3 秒内部延迟），给浏览器留出渲染「重启中」状态的时间。

### 为什么路由 handler 里不用 `ctx.timeout`

`ctx.timeout` 是 Cordis mixin，底层由 `ctx.effect()` 实现，而 `ctx.effect` 绑定 **fiber** 生命周期。`webServer` 路由 handler 是纯 Node HTTP 回调——不在任何 fiber 上下文中——因此 `ctx.effect` 注册的定时器会被静默丢弃，重启永远不触发。本插件在 handler 中使用 Node 原生 `setTimeout` 解决。

```

</details>

#### 缺口

- ctx.shell.start 返回值、外部脚本退出状态与宿主权限未知
  **影响**：200 响应只是接受触发，不是成功重启证据
  **进一步探讨**：记录子进程 pid/退出与目标 Web 再上线验收

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败状态和防重入会不会误导用户？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

Host 在异步启动前就返回 ok:true，若一秒后 shell.resolve/start 抛错，日志记录并清 restarting，但已无法更正先前 HTTP 响应；若外部脚本启动后失败，当前代码没有回执。重复请求返回 HTTP 200、正文 ok:false，Client 只要 JSON 可解析就 setPhase(done)，不检查 data.ok，因此也会把“重启已在进行中”显示为已触发。健康点继续在线也不证明成功。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:41-65](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/lib/index.js#L41-L65)

重复请求/先回包后启动/捕获异常

<details>
<summary>查看原文（25行）</summary>

```text
      if (restarting) {
        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ ok: false, message: '重启已在进行中，请稍候' }))
        return
      }
      restarting = true
      // 注意：webServer handler 是纯 Node http 回调，不在 Cordis fiber 上下文里，
      // ctx.timeout（mixin→ctx.effect）在此不触发；改用 Node 原生 setTimeout。
      setTimeout(() => {
        try {
          // 独立进程 + 内部 3 秒延迟：DSH 被脚本杀掉后脚本继续执行，前端有时间渲染状态
          const command = "Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-Command','Start-Sleep -Seconds 3; & \"D:\\1\\dsh-web-host.ps1\"' -WindowStyle Hidden"
          const spec = ctx.shell.resolve({
            command,
            sandboxPolicy: { mode: 'danger-full-access' }
          })
          ctx.shell.start(spec)
          console.log('[dsh-web-restart] restart script launched')
        } catch (error) {
          restarting = false
          console.error('[dsh-web-restart] failed to launch restart:', error)
        }
      }, 1000)
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: true, message: '重启已触发：DSH 将断开约 15-20 秒，之后请刷新页面' }))
```

</details>

**依据 2 · 源码核查**：[lib/client.js:77-90](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/lib/client.js#L77-L90)

忽略 ok 字段后设置 done

<details>
<summary>查看原文（14行）</summary>

```text
          // 单击直接重启（无二次确认）
          var click = () => {
            if (phase === 'sending' || phase === 'done') return;
            setPhase('sending');
            fetch('/restart-dsh', { method: 'POST' })
              .then((res) => res.json().catch(() => null))
              .then((data) => {
                setPhase('done');
                setMessage((data && data.message) || '重启已触发');
              })
              .catch((err) => {
                setPhase('error');
                setMessage(String((err && err.message) || err));
              });
```

</details>

**依据 3 · 源码核查**：[lib/client.js:65-75](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/lib/client.js#L65-L75)

5 秒健康轮询

<details>
<summary>查看原文（11行）</summary>

```text
          // 每 5 秒探测 /dsh-health；fetch 失败或非 200 视为离线
          React.useEffect(function () {
            var check = function () {
              fetch('/dsh-health', { method: 'GET' })
                .then(function (res) { return res.ok ? setHealth('ok') : setHealth('down'); })
                .catch(function () { setHealth('down'); });
            };
            check();
            var timer = setInterval(check, 5000);
            return function () { clearInterval(timer); };
          }, []);
```

</details>

#### 缺口

- 目标异常和脚本失败频率未测
  **影响**：UI 可能误报成功，无法据此操作复盘
  **进一步探讨**：设计 job 状态/失败回执并分别模拟 ok:false 与启动失败

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 重启路由的权限和滥用面如何界定？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

源码只检查请求方法与进程内 restarting 布尔值，路由 handler 没有独立用户授权、Origin/CSRF 校验或确认令牌；是否由 DSH webServer 外层会话保护未核，不能直接断言远端可滥用。脚本以 danger-full-access 启动 PowerShell 并使用 ExecutionPolicy Bypass，且客户端单击无二次确认，因此若路由可被非预期调用就会导致服务中断。该插件仅适用于明确隔离/授权的作者 Windows 环境，其他主机先审宿主边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:32-65](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/lib/index.js#L32-L65)

路由仅方法/重入检查和全权限 PowerShell

<details>
<summary>查看原文（34行）</summary>

```text
  const disposeRoute = ctx.webServer.register({
    kind: 'exact',
    path: '/restart-dsh',
    handler: async (req, res) => {
      if (req.method !== 'POST') {
        res.writeHead(405, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ ok: false, message: 'method not allowed' }))
        return
      }
      if (restarting) {
        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ ok: false, message: '重启已在进行中，请稍候' }))
        return
      }
      restarting = true
      // 注意：webServer handler 是纯 Node http 回调，不在 Cordis fiber 上下文里，
      // ctx.timeout（mixin→ctx.effect）在此不触发；改用 Node 原生 setTimeout。
      setTimeout(() => {
        try {
          // 独立进程 + 内部 3 秒延迟：DSH 被脚本杀掉后脚本继续执行，前端有时间渲染状态
          const command = "Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-Command','Start-Sleep -Seconds 3; & \"D:\\1\\dsh-web-host.ps1\"' -WindowStyle Hidden"
          const spec = ctx.shell.resolve({
            command,
            sandboxPolicy: { mode: 'danger-full-access' }
          })
          ctx.shell.start(spec)
          console.log('[dsh-web-restart] restart script launched')
        } catch (error) {
          restarting = false
          console.error('[dsh-web-restart] failed to launch restart:', error)
        }
      }, 1000)
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: true, message: '重启已触发：DSH 将断开约 15-20 秒，之后请刷新页面' }))
```

</details>

**依据 2 · 源码核查**：[lib/client.js:77-81](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/lib/client.js#L77-L81)

客户端单击即 POST

```text
          // 单击直接重启（无二次确认）
          var click = () => {
            if (phase === 'sending' || phase === 'done') return;
            setPhase('sending');
            fetch('/restart-dsh', { method: 'POST' })
```

**依据 3 · 作者声明**：[README.zh.md:3-7](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/README.zh.md#L3-L7)

作者 Windows 限定

```text
**DeepSeek Harness Web 界面的一键重启按钮。**

在侧边栏底部（设置按钮旁）增加一个圆形重启按钮（↻）。**单击**即可立即重启 `dsh web` 进程——页面断开约 15–20 秒，刷新后一切恢复（会话数据自动落盘并恢复）。按钮是**常驻**的：它触发的重启不会把它自己带走。

> 仅限 Windows：重启通过独立的隐藏 PowerShell 进程拉起 `dsh web`，因此即使 harness 进程被杀死，脚本也会继续执行完毕。
```

#### 缺口

- webServer 外层认证/CSRF/网络暴露范围未知
  **影响**：不能宣称路由安全或远程可利用
  **进一步探讨**：核目标宿主认证/Origin，限定管理员和可信本机

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何把它变成可核验的维护操作？

**研究主题**：采用判断、新假设与验证、工程质量与复用

#### 完整回答

当前实现应先观察，不宜直接在生产 profile 安装：需把外部脚本纳入受控配置并确认其只作用于目标 DSH 实例，启动前保存会话/通知用户，提供二次确认和管理员权限边界。技术上可令路由返回 job id，Client 按 ok/失败和健康恢复状态展示，异步启动失败需有可查询结果；修正样式查找属性与实际 dataset 名不符的问题，防重复挂载。以上为未实现改进，不能记作现有能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:66-70](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/README.zh.md#L66-L70)

作者要求自行改脚本路径

```text
## 兼容性

- DeepSeek Harness `0.1.0-rc.6`（web profile）。
- 重启脚本路径（`D:\1\dsh-web-host.ps1`）硬编码自作者机器——**请 fork 后自行调整**（或替换 `lib/index.js` 中的命令）。欢迎贡献使其可配置。

```

**依据 2 · 源码核查**：[lib/index.js:49-65](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/lib/index.js#L49-L65)

缺异步结果回执

<details>
<summary>查看原文（17行）</summary>

```text
      setTimeout(() => {
        try {
          // 独立进程 + 内部 3 秒延迟：DSH 被脚本杀掉后脚本继续执行，前端有时间渲染状态
          const command = "Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-Command','Start-Sleep -Seconds 3; & \"D:\\1\\dsh-web-host.ps1\"' -WindowStyle Hidden"
          const spec = ctx.shell.resolve({
            command,
            sandboxPolicy: { mode: 'danger-full-access' }
          })
          ctx.shell.start(spec)
          console.log('[dsh-web-restart] restart script launched')
        } catch (error) {
          restarting = false
          console.error('[dsh-web-restart] failed to launch restart:', error)
        }
      }, 1000)
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: true, message: '重启已触发：DSH 将断开约 15-20 秒，之后请刷新页面' }))
```

</details>

**依据 3 · 源码核查**：[lib/client.js:21-27](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/lib/client.js#L21-L27)

style selector 与 dataset 属性不一致

```text
      ctx.effect(() => {
        if (typeof document === 'undefined') return () => {};
        var existing = document.querySelector('style[data-dsh-web-restart-css]');
        if (existing !== null) return () => {};
        var tag = document.createElement('style');
        tag.dataset.dshRestartButtonCss = '1';
        tag.textContent = [
```

**依据 4 · 源码核查**：[lib/client.js:77-91](https://github.com/1123762794/dsh-web-restart/blob/5de8214051b3245a8cfc825e7e907cf5e57f51d8/lib/client.js#L77-L91)

客户端结果处理

<details>
<summary>查看原文（15行）</summary>

```text
          // 单击直接重启（无二次确认）
          var click = () => {
            if (phase === 'sending' || phase === 'done') return;
            setPhase('sending');
            fetch('/restart-dsh', { method: 'POST' })
              .then((res) => res.json().catch(() => null))
              .then((data) => {
                setPhase('done');
                setMessage((data && data.message) || '重启已触发');
              })
              .catch((err) => {
                setPhase('error');
                setMessage(String((err && err.message) || err));
              });
          };
```

</details>

#### 缺口

- 改进成本、完整脚本行为与目标恢复流程未知
  **影响**：未验之前重启可造成实际中断/状态误判
  **进一步探讨**：隔离主机端到端试验和失败注入验收

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
