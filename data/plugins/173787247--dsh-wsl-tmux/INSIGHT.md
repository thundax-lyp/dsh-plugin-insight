# dsh-wsl-tmux

> 在 DSH 中列出 tmux 会话并读取 pane 输出。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f6f2372](https://github.com/173787247/dsh-wsl-tmux/tree/f6f23727c2959d69559ec26f474d2e871473c224)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-tmux)
<!-- END META -->

**使用建议**：适合单 pane 的长任务观察；多窗口先人工确认目标，关键完成状态应另查产物或退出码，不能只凭终端尾部。

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

源码支持所述适配机制；贡献评价属于有固定源码依据的解释。尚未安装或运行，效果与宿主兼容未验证；新设计推演均未实现。

[重点创新推演与最小验证](#innovation)

- **用途**：长时间构建或训练放在 tmux 的开发者，希望由 Agent 读取当前终端尾部辅助排障，而不向任务发送输入。

采用建议：适合单 pane 的长任务观察；多窗口先人工确认目标，关键完成状态应另查产物或退出码，不能只凭终端尾部。

本次比较参照为上述人工命令、平台接口或本地脚本；没有独立同任务运行对照，不声称整体收益或首创。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：tmux_status、tmux_list、tmux_capture

**流程与依赖**

Node≥18、DSH、tmux 及同用户服务器/socket 必要；screen 仅被探测，不提供 screen 捕获。

status/list 后指定 session capture；用户交叉核查目标与日志，失败查 socket/权限，不会发送恢复指令。

**效果与成本**

无新服务费用；成本在于建立会话和人工确认 pane、补读截断历史，未测少复制日志能省多少时间。

高频已有 tmux 的用户较可能受益；不具备任务编排或可靠进度服务的交付保障。

- **思考**：日志尾部是否足以代表任务完成是关键。capture 仅按会话定位默认 pane，没有精确窗口/pane 身份；list 对任意退出码1都返回空会话，可能把查询故障误解为无任务。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对复制终端日志，增量是一个不发送按键的观察入口；tmux 继续拥有会话和滚动缓冲，插件没有任务控制或完成判定机制。

相对复制终端日志，增量是一个不发送按键的观察入口；tmux 继续拥有会话和滚动缓冲，插件没有任务控制或完成判定机制。

lib/tmux.js 会话白名单和只读 argv 值得复用；list 的退出码简化及默认 pane 是小实现换来的明确语义损失。 源码：[index.js](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/index.js)、[lib/tmux.js](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/lib/tmux.js)、[test/tmux.test.js](https://github.com/173787247/dsh-wsl-tmux/blob/f6f23727c2959d69559ec26f474d2e871473c224/test/tmux.test.js)。

<a id="detail-section-5"></a>

### 主要限制

日志尾部是否足以代表任务完成是关键。capture 仅按会话定位默认 pane，没有精确窗口/pane 身份；list 对任意退出码1都返回空会话，可能把查询故障误解为无任务。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/tmux.js、test/tmux.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 f6f23727c2959d69559ec26f474d2e871473c224，检查作者说明、入口、所列核心实现与测试内容；未执行测试或插件、未核实外部套件和独立用户效果。
- 下一步：准备两个同会话 pane、一个已结束任务和权限/连接错误，对照原生命令与插件；检查是否误读其他 pane、是否将错误返回空列表。

**分析版本**

- **仓库**：[173787247/dsh-wsl-tmux](https://github.com/173787247/dsh-wsl-tmux)
- **版本号**：0.1.1（[固定提交 f6f2372](https://github.com/173787247/dsh-wsl-tmux/tree/f6f23727c2959d69559ec26f474d2e871473c224)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：明确 pane_id 和捕获时间、把查询失败与空会话分开，可让多窗口构建观察更可靠；当前接口没有完整实现这些身份与失败状态。

准备两个同会话 pane、一个已结束任务和权限/连接错误，对照原生命令与插件；检查是否误读其他 pane、是否将错误返回空列表。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 116 | — | — | 448 |
| .js | source | 2 | 189 | 176 | 0 | — |
| .js | test | 1 | 8 | 7 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-tmux/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
