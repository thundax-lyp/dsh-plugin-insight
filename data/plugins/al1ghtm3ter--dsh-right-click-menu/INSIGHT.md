# dsh-right-click-menu

> 为文件树与聊天路径增加上下文菜单，衔接预览、系统打开、复制与另存为。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[9976d21](https://github.com/AL1ghtm3ter/dsh-right-click-menu/tree/9976d213318032c6f128e3affa5d1b873cd47871)

<!-- BEGIN META -->

<!-- END META -->

**使用建议**：先在隔离目录核保存目标、覆盖和权限；菜单便利不代表按会话受限文件能力。

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

- **用途**：从聊天中的有效路径快速操作文件，保留非文件位置的浏览器原菜单。

- **建议**：未验证假设：每项操作携带会话资源授权、覆盖确认和流式限长读取，可减少越范围写入与大文件内存峰值。用跨工作区/软链接/已有目标/大文件核目标与权限、覆盖和峰值。

先在隔离目录核保存目标、覆盖和权限；菜单便利不代表按会话受限文件能力。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

参照系统文件管理器与宿主现有session/workspaceFiles API；增量是目标识别和统一操作菜单。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：文件上下文菜单
- **Host 路由**：文件探测、读取和另存写入

**流程与依赖**

客户端contextmenu解析树属性或路径文本，经主机stat确认，再调用既有打开API或本包read/raw/save-as/write-text路由；主机经connection.requestRejection信任栅栏。

slots/locale与宿主connection/webServer、可选session/sidebarRight/workspaceFiles/directoryPicker；系统应用能力随环境变化。

右键识别目标→核存在→选择预览/打开/复制/保存→现有API或主机文件副作用；找不到目标时不拦浏览器菜单。

**效果与成本**

无模型token调用；DOM识别、桌面/浏览器双保存路径和多API降级需维护，raw占内存带宽。

入口便利性实现明确，没有误操作率和操作耗时对照。

- **思考**：主机只要求绝对路径，save-as可任意目标mkdir/copyFile覆盖，write-text同样无工作区realpath约束；信任栅栏是请求授权而非每个文件的能力限制。readTextFile先readFile全文件再截到1MiB，raw完全读取，显示限长不是内存限长。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把文本路径转为实际文件动作并按能力降级，减少复制路径再找文件的步骤；不实现新的文件系统或系统应用协议。

把文本路径转为实际文件动作并按能力降级，减少复制路径再找文件的步骤；不实现新的文件系统或系统应用协议。

精确路由、JSON体64KiB上限与宿主requestRejection复用是实质边界；文件读取体积和任意绝对写仍须独立审阅。

源码依据：[lib/index.js](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/index.js)、[lib/client.js](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/client.js)。

<a id="detail-section-5"></a>

### 主要限制

主机只要求绝对路径，save-as可任意目标mkdir/copyFile覆盖，write-text同样无工作区realpath约束；信任栅栏是请求授权而非每个文件的能力限制。readTextFile先readFile全文件再截到1MiB，raw完全读取，显示限长不是内存限长。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AL1ghtm3ter/dsh-right-click-menu](https://github.com/AL1ghtm3ter/dsh-right-click-menu)
- **版本号**：0.3.1（[固定提交 9976d213](https://github.com/AL1ghtm3ter/dsh-right-click-menu/tree/9976d213318032c6f128e3affa5d1b873cd47871)）
- **版本日期**：2026-10-06（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/client.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：隔离目录核路径识别误报、授权拒绝、覆盖提示、取消保存与大文件；不打开外部程序或写真实文件。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：每项操作携带会话资源授权、覆盖确认和流式限长读取，可减少越范围写入与大文件内存峰值。用跨工作区/软链接/已有目标/大文件核目标与权限、覆盖和峰值。

隔离目录核路径识别误报、授权拒绝、覆盖提示、取消保存与大文件；不打开外部程序或写真实文件。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：94326a46028367babfc49006e1617248ef00fb87ede91259953c68e2307b3e78。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 710 | — | — | 6321 |
| .js | source | 2 | 1662 | 1356 | 223 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AL1ghtm3ter/dsh-right-click-menu/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
