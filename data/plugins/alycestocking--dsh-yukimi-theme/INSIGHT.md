# Yukimi theme

> 为 DSH 添加雪美主题，并在 Windows 桌面以独立桌宠显示会话提醒。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[4b162a3](https://github.com/AlyceStocking/dsh-yukimi-theme/tree/4b162a3572e894e71001f3cefd0105519d5c4461)

<!-- BEGIN META -->

<!-- END META -->

**使用建议**：角色主题偏好和后台提醒需求同时存在时可评估；对可靠告警有要求应先测helper失败与原请求状态，不能用点击通知代替审批。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：喜欢角色主题且后台等待任务的个人用户，以桌宠察觉提问/审批再返回原会话；提醒不是自动授权或项目完成证明。

- **建议**：把提醒定义成“待察觉/已打开/原请求已解决”三态，并在helper不可用时把未解决数交回宿主显式提示，可能减少把点击当办结。对helper崩溃、重启重放、打开错会话及打开后未答复案例核对持续等待；若只清通知不确认原请求，则假设失败。

角色主题偏好和后台提醒需求同时存在时可评估；对可靠告警有要求应先测helper失败与原请求状态，不能用点击通知代替审批。

核查状态：事件映射、IPC与会话导航接线源码可确认；真实Windows层级、多屏及提醒到达未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

原生通知/任务栏状态或普通主题；本项加入角色化可见提醒，不替代系统告警。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **事件监听**：顶层Agent、会话事件、问题/审批投影驱动提醒。
- **Host 路由**：认证Connection /yukimi状态/偏好/导航确认RPC。
- **界面**：Web主题与Windows独立桌宠/气泡。
- **后台**：Electron helper经命名管道同步状态与偏好。

**流程与依赖**

Web client绘主题与小人；Windows desktop Host跟踪顶层Agent、turn与待回答/审批投影，聚合预设文案状态。启动Electron helper，通过随机命名管道和token握手同步；点击提醒经navigation/ack和原生openSession返回指定会话，helper保存偏好/去重ID。

Windows Desktop、完整Electron helper与DSH connection/agents/sessionProjections，Web主题另依赖slots/DOM；素材/运行时需可用。

加载主题→desktop启动helper→跟踪顶层会话→汇总等待/结束提示→点击发navigation→页面openSession并ack→原请求解决后消除；停用清监听并关helper。

Web与Windows Desktop路径不同，源码不含被忽略Electron运行时，需完整打包；helper仅win32 desktop profile启动。

**效果与成本**

现金无额外模型调用；人工是Electron完整包/偏好维护、素材来源及兼容；动画/置顶/辅助进程有资源和干扰成本，无效率测量。

保留原会话处理路径，减少发送正文到辅助进程；趣味与注意力收益未实测。

- **思考**：桌宠可见是否等于未解决事项被人处理？完成通知按turn/end而非项目验收；persistent等待只有对应投影/事件消除，导航ack也只表示页面接收跳转，不证明用户已回答。helper退出后state.active=false但未见自动重启，不能把Web/桌宠降级当持续可靠告警。标题仍被传送，最小数据不是完全无敏感信息。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：将装饰主题扩展为不转发聊天正文的后台人机交接提醒，区分持续等待与短时结束，session ID让回到原上下文有明确路径。增量是事件到桌宠状态的适配，非授权决策或任务执行体系。

将装饰主题扩展为不转发聊天正文的后台人机交接提醒，区分持续等待与短时结束，session ID让回到原上下文有明确路径。增量是事件到桌宠状态的适配，非授权决策或任务执行体系。

管道随机token握手/超时、单helper连接、不开放额外TCP；结束按单调turn去重，等待事件与投影对账，偏好临时写rename。少发数据与不代答是可借鉴边界。

固定源码依据：[lib/index.js](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/lib/index.js)、[lib/desktop-state.js](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/lib/desktop-state.js)、[lib/desktop-process.js](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/lib/desktop-process.js)、[lib/client.js](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/lib/client.js)、[desktop/main.cjs](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/desktop/main.cjs)、[package.json](https://github.com/AlyceStocking/dsh-yukimi-theme/blob/4b162a3572e894e71001f3cefd0105519d5c4461/package.json)。

<a id="detail-section-5"></a>

### 主要限制

桌宠可见是否等于未解决事项被人处理？完成通知按turn/end而非项目验收；persistent等待只有对应投影/事件消除，导航ack也只表示页面接收跳转，不证明用户已回答。helper退出后state.active=false但未见自动重启，不能把Web/桌宠降级当持续可靠告警。标题仍被传送，最小数据不是完全无敏感信息。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：1.2.0-desktop.3；版本日期：2026-10-13（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[4b162a35](https://github.com/AlyceStocking/dsh-yukimi-theme/tree/4b162a3572e894e71001f3cefd0105519d5c4461)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根Host桌面事件、desktop-state/process、client导航与desktop持久化相关代码；未审计全部主题CSS/素材或Electron二进制，未运行桌面。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

把提醒定义成“待察觉/已打开/原请求已解决”三态，并在helper不可用时把未解决数交回宿主显式提示，可能减少把点击当办结。对helper崩溃、重启重放、打开错会话及打开后未答复案例核对持续等待；若只清通知不确认原请求，则假设失败。

未执行；拟在helper退出/多屏/最小化、重放turn与未答请求场景验证实际可见、准确跳转和等待不误清。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 1608 | 1487 | 44 | — |
| .cjs | source | 2 | 348 | 333 | 13 | — |
| .md | source | 3 | 341 | — | — | 9035 |
| .mjs | source | 6 | 455 | 419 | 9 | — |
| .mjs | test | 12 | 1781 | 1654 | 10 | — |
| .cjs | test | 1 | 31 | 31 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AlyceStocking/dsh-yukimi-theme/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
