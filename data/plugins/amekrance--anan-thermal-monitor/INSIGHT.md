# anan-thermal-monitor

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[13ed26d](https://github.com/AmeKrance/anan-thermal-monitor/tree/13ed26da20da08eecc300fb9963bea3dd4634205)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AmeKrance/anan-thermal-monitor) [![npm 30d 159](https://img.shields.io/static/v1?label=npm+30d&message=159&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/anan-thermal-monitor) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/anan-thermal-monitor)
<!-- END META -->

> **实现功能**：在Windows启动独立WPF桌宠，显示LibreHardwareMonitor提供的硬件温度。

> **核心亮点**：将既有硬件监控库接到可随DSH加载/卸载的桌面小部件，无需模型请求即可展示温度。价值是本地可见性与轻量入口，采样算法、驱动和WPF本身不是本插件原创。

> **风险与缺陷**：插件返回running是否意味着桌宠已就绪？Node spawn后即返回成功，PID存在也未验证进程身份；旧PID复用可能阻止启动，stop返回也未等待窗口确认。更具体地，提权Start-Process的catch虽注释称低权限继续，随后无条件exit，拒绝UAC仍退出。采样JSON直接覆盖，读取失败返回null，状态还缺明确新鲜度判据。

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

> **用途**：想在桌面持续查看CPU/GPU等可用传感器读数的个人用户；读数提示设备状态，不构成散热诊断或自动保护控制。

LibreHardwareMonitor等独立监控软件；本项增加角色化桌面展示和DSH生命周期接线。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：独立Windows WPF悬浮桌宠显示温度和硬件信息。
- **后台**：PowerShell辅助进程轮询LibreHardwareMonitor并随插件清理；条件式harness.handle分支不视为已确认的DSH工具注册。

**流程与依赖**

DSH入口随生命周期启动PowerShell脚本；脚本请求管理员权限、加载LibreHardwareMonitor，后台约两秒轮询，WPF渲染读数与交互。PID文件、停止标记和临时JSON连接生命周期及状态读取；硬件访问来自上游组件。

Windows PowerShell、WPF/.NET及LibreHardwareMonitor资源和可用硬件传感器；部分数据需要管理员权限。

加载插件→启动脚本→检查PID与提权→初始化硬件库→轮询并显示→写临时数据→卸载发停止标记并尝试kill；成功响应不含就绪/退出确认。

Windows专用插件，包内assets含脚本和LibreHardwareMonitor相关组件；启动powershell.exe使用ExecutionPolicy Bypass并可能触发UAC，需完整资源。

**效果与成本**

现金无模型/API调用；人工涉及Windows权限、上游驱动/组件兼容、打包与温度解释；轮询和独立GUI消耗本机资源，未测占用。

本地常驻读数无需与模型交互，但能读取哪些硬件取决于传感器和权限，没有监控准确率或性能收益证据。

> **思考**：插件返回running是否意味着桌宠已就绪？Node spawn后即返回成功，PID存在也未验证进程身份；旧PID复用可能阻止启动，stop返回也未等待窗口确认。更具体地，提权Start-Process的catch虽注释称低权限继续，随后无条件exit，拒绝UAC仍退出。采样JSON直接覆盖，读取失败返回null，状态还缺明确新鲜度判据。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将既有硬件监控库接到可随DSH加载/卸载的桌面小部件，无需模型请求即可展示温度。价值是本地可见性与轻量入口，采样算法、驱动和WPF本身不是本插件原创。

将既有硬件监控库接到可随DSH加载/卸载的桌面小部件，无需模型请求即可展示温度。价值是本地可见性与轻量入口，采样算法、驱动和WPF本身不是本插件原创。

GUI与采样工作分离、nullable读数处理、卸载停止标记是实用接线；CPU Package/Core Max等选择来自明确规则，上游LibreHardwareMonitor承担硬件访问，NVMe显示实际取Storage传感器不保证仅NVMe。

固定源码依据：[lib/index.js](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/lib/index.js)、[assets/desktop-pet.ps1](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/assets/desktop-pet.ps1)、[package.json](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/package.json)、[cordis.patch.yml](https://github.com/AmeKrance/anan-thermal-monitor/blob/13ed26da20da08eecc300fb9963bea3dd4634205/cordis.patch.yml)。

<a id="detail-section-5"></a>

### 1.4 主要限制

插件返回running是否意味着桌宠已就绪？Node spawn后即返回成功，PID存在也未验证进程身份；旧PID复用可能阻止启动，stop返回也未等待窗口确认。更具体地，提权Start-Process的catch虽注释称低权限继续，随后无条件exit，拒绝UAC仍退出。采样JSON直接覆盖，读取失败返回null，状态还缺明确新鲜度判据。

<a id="detail-section-6"></a>

### 1.5 使用建议

希望观察本机温度且接受Windows脚本与权限要求时再评估；先验证UAC拒绝/缺传感器及退出状态，不以温度颜色作硬件安全保证。

核查状态：Windows启动与采样/界面路径源码可确认；未运行PowerShell、提权或传感器，实际温度准确性和启动成功未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：1.0.4；版本日期：2026-08-16（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[13ed26da](https://github.com/AmeKrance/anan-thermal-monitor/tree/13ed26da20da08eecc300fb9963bea3dd4634205)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：lib/index.js、实际承担采样与WPF的assets/desktop-pet.ps1、包入口及patch；PowerShell不在JS/TS统计内，随包上游DLL/EXE未做二进制审计，不能按整包体积认定原创代码。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

以随机实例ID、就绪握手和采样时间界定“已启动/不可用/读数过期”，并将拒绝提权显式呈现，可能减少虚假运行状态。检查拒绝UAC、PID复用、helper启动失败、无传感器和停止超时五种故障；若Host仍显示running或旧温度无过期提示，则该生命周期方案未成立。

未执行；拟在隔离Windows环境检查UAC拒绝、旧PID/重复实例、无传感器、采样过期与卸载退出，另以可信监控读数交叉核对，不能由源码推断温度真实准确。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 97 | 70 | 19 | — |
| .md | source | 1 | 161 | — | — | 1705 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/AmeKrance/anan-thermal-monitor/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
