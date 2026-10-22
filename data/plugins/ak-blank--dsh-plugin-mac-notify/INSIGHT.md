# mac-notify

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[a9ef943](https://github.com/AK-blank/dsh-plugin-mac-notify/tree/a9ef9439a1e8f7957a402c742bc639919ab1d1c8)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-mac-notify)
<!-- END META -->

> **实现功能**：把 DSH 完成、提问、审批与报错转为 macOS 原生通知。

> **核心亮点**：相较盯着 Web 页或给每个任务写通知脚本，贡献在于把“完成”和“等待人介入”统一映射到宿主事件，并让通知失败不阻塞原审批/提问流水线。它改善人机交接的可见性，未改变审批规则或任务执行结果。

> **风险与缺陷**：通知是否真正把人带回正确上下文？click.mjs 按 Web URL 前缀寻找浏览器标签，只指向站点而非具体 session；多会话同站点时仍需人工定位。成功启动通知进程也不能证明 Focus/通知权限下人已收到，摘要还会把助手文本展示到系统通知中心。

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

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合把长任务留在后台、需要被叫回处理问题或审批的 macOS 单人用户；交付物是可感知的提醒和返回 Web 的入口。

原有办法是 Web 状态提示、轮询页面或外部脚本通知；本项把宿主语义纳入提醒，未新增远程协作流程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **事件监听**：监听 agent/status、session/event、提问、审批及错误等 Host 事件。
- **后台**：串行发送系统通知并选择 terminal-notifier/osascript 与声音后端。

**流程与依赖**

Host 监听运行状态、会话消息、问题、审批及错误；running→idle 才产生完成通知，记录最近助手文本作为摘要。通知经串行队列发送，优先 terminal-notifier，缺失时退回 osascript；问题与审批绕过普通节流，但相同内容五秒内仍去重。

依赖 macOS、Node 与 DSH 事件/会话服务；terminal-notifier 为可选能力，其他平台不发送通知。

用户启动任务后插件被动监听；提问/审批处理器通知后总是 next()，人仍回原界面处理；结束与错误根据配置触发，dispose 清理监听和缓存。

包以 Cordis bundle patch 装入，Host 依赖 sessions/webServer 等服务；可选 terminal-notifier 增强点击，内置 osascript 降级。

**效果与成本**

现金：无新增模型/API调用，系统工具可用性与可选通知器自行承担。人工：通知权限、浏览器 Automation 权限及声音策略配置；失败后仍需回 Web 检查。高并发摘要去重可能省打扰，也可能漏掉不同会话的相同提示。

价值来自缩短人未察觉的阻塞时间；不提供审批决策、远端推送或可证明的送达回执。

> **思考**：通知是否真正把人带回正确上下文？click.mjs 按 Web URL 前缀寻找浏览器标签，只指向站点而非具体 session；多会话同站点时仍需人工定位。成功启动通知进程也不能证明 Focus/通知权限下人已收到，摘要还会把助手文本展示到系统通知中心。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相较盯着 Web 页或给每个任务写通知脚本，贡献在于把“完成”和“等待人介入”统一映射到宿主事件，并让通知失败不阻塞原审批/提问流水线。它改善人机交接的可见性，未改变审批规则或任务执行结果。

相较盯着 Web 页或给每个任务写通知脚本，贡献在于把“完成”和“等待人介入”统一映射到宿主事件，并让通知失败不阻塞原审批/提问流水线。它改善人机交接的可见性，未改变审批规则或任务执行结果。

execFile 传 argv，AppleScript 从 argv 取用户文本；点击帮助器只探测已运行浏览器并有单调用超时。运行时可注入 exec/时钟便于隔离测试。通知排队与失败列表有处理，但送达账本仅内存，重启不会恢复等待事项。

固定源码依据：[lib/index.js](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/index.js)、[lib/click.mjs](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/lib/click.mjs)、[cordis.patch.yml](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/cordis.patch.yml)、[package.json](https://github.com/AK-blank/dsh-plugin-mac-notify/blob/a9ef9439a1e8f7957a402c742bc639919ab1d1c8/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

通知是否真正把人带回正确上下文？click.mjs 按 Web URL 前缀寻找浏览器标签，只指向站点而非具体 session；多会话同站点时仍需人工定位。成功启动通知进程也不能证明 Focus/通知权限下人已收到，摘要还会把助手文本展示到系统通知中心。

<a id="detail-section-6"></a>

### 1.5 使用建议

有后台任务提醒需求的 macOS 用户可将其列入候选；涉及敏感输出时先限制摘要与声音，是否适用取决于通知权限和多会话定位要求。

核查状态：事件到通知的机制已有源码支撑；减少等待与正确返回会话的效果尚未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：1.0.0；版本日期：2026-10-03（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[a9ef9439](https://github.com/AK-blank/dsh-plugin-mac-notify/tree/a9ef9439a1e8f7957a402c742bc639919ab1d1c8)；本轮基准：2026-10-21T05:26:52Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：仅根组件 Host 通知实现、点击帮助器、注册清单和说明；读取自测设计但未执行，未核验作者所称宿主兼容。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

若在通知载荷中加入可验证的会话深链接，并对尚未解决的提问/审批进行状态合并，可能比站点级提醒缩短有效响应时间。以双会话并发和重复事件回放比较“点击后到正确问题”的操作数与误定位率；没有降低误定位则否定此增量。

最小验证只提出方案，未运行：同时打开同一站点两个会话，触发审批与相同完成文本，记录去重、通知展示和点击定位；单独检查拒绝 Automation 权限时的降级。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 3 | 1215 | 948 | 154 | — |
| .js | source | 1 | 890 | 623 | 193 | — |
| .md | source | 2 | 417 | — | — | 3621 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-mac-notify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-mac-notify/issues?q=is%3Aissue+created%3A2026-09-21T05%3A33%3A22.657Z..2026-10-21T05%3A33%3A22.657Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-mac-notify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A33%3A22.657Z..2026-10-21T05%3A33%3A22.657Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
