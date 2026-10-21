# dsh-computer-use

> 为 DSH 提供桌面观察、元素或坐标操作、虚拟光标及应用管理工具。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[3cf9bd8](https://github.com/988hj7tczd-oss/dsh-computer-use/tree/3cf9bd8ae60271512f263bfa75485cb242ca0892)

<!-- BEGIN META -->
[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-computer-use) · [![npm 30d 3633](https://img.shields.io/static/v1?label=npm+30d&message=3%2C633&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-computer-use) · [![首次发布 2026-08-16](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-computer-use)
<!-- END META -->

**使用建议**：需要无API桌面操作的人先用隔离非敏感页面；固定应用白名单，串行操作并每次变化重观察，核对坐标路径与并发会话再用于真实任务。

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

- **用途**：Agent需要操作原生应用或Canvas时，先观察后点击/输入再验证，交付桌面动作结果及新观察；不是业务成功自动判定。

- **建议**：待验证假设：快照按会话/动作序列隔离，并把高影响动作绑定目标变化摘要和独立确认，可减少并发串窗口及坐标绕过语义审查。由全局snapshot与元素特定guard推导，未实现。用双会话交错观察、TTL内弹窗、坐标点付款三组对照，测错窗/错点与误拦；无法识别坐标语义时应明确未知而非承诺安全。

需要无API桌面操作的人先用隔离非敏感页面；固定应用白名单，串行操作并每次变化重观察，核对坐标路径与并发会话再用于真实任务。

核查状态：源码支持观察-动作护栏与驱动适配；未执行桌面操作、测试或真实宿主，各平台与语义正确性未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

参照鼠标宏、通用Computer Use驱动与DSH工具接线；未独立复现作者演示。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：桌面观察、点击输入滚拖、按键与应用管理。
- **后台**：快照、驱动连接与虚拟光标生命周期。

**流程与依赖**

index注册工具，observe采AX/截图并缓存snapshot，actions把元素token或窗口坐标交cua-driver；guard检查快照、可选应用白名单和元素标签危险词，human处理虚拟光标与前台回退。

DSH tools/llm/attachments/approval、cua-driver及OS权限；native/vision模式对模型图像支持不同。

选应用→观察→冻结元素/窗口→guard→动作→处理拒绝或确认前台回退→重观察验证；结果未知不能盲重放写动作。

Node>=22.18声明，需cua-driver与系统辅助/截图权限；macOS作者验证、Windows/Linux仍需实际环境验收。

**效果与成本**

首次安装驱动和OS权限，持续视觉token、观察重试与人工确认；现金随视觉模型，耗时及桌面副作用复核未测。

能把桌面步骤纳入Agent，但动作返回完成不等于表单已保存或任务合格，必须复观察。

- **思考**：新鲜快照能否保证正确且有权限的动作？snapshot模块是进程单例而非按Agent会话分区，并发观察会替换目标；TTL不能防界面在有效期内改变。密码/危险词检测只在element编号路径，坐标和快捷键无法同样识别，allowedApps空时不限制应用；不能把护栏概括为完整安全边界。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对自由鼠标脚本，增量是把新鲜快照、窗口身份、元素token与动作绑定，并将可见虚拟光标和明确引擎拒绝映射回DSH；实际OS输入由cua-driver提供，不应把驱动能力归本插件原创。

相对自由鼠标脚本，增量是把新鲜快照、窗口身份、元素token与动作绑定，并将可见虚拟光标和明确引擎拒绝映射回DSH；实际OS输入由cua-driver提供，不应把驱动能力归本插件原创。

窗口坐标转换、驱动refused/suspected_noop显式返回及仅声明后台不可用才前台重试可借鉴；全局snapshot和语义护栏覆盖需加强。

固定源码依据：[index.js](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/index.js)、[lib/observe.js](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/observe.js)、[lib/snapshot.js](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/snapshot.js)、[lib/actions.js](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/actions.js)、[lib/guard.js](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/guard.js)、[lib/cua.js](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/cua.js)、[lib/human.js](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/human.js)、[package.json](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/package.json)。

<a id="detail-section-5"></a>

### 主要限制

新鲜快照能否保证正确且有权限的动作？snapshot模块是进程单例而非按Agent会话分区，并发观察会替换目标；TTL不能防界面在有效期内改变。密码/危险词检测只在element编号路径，坐标和快捷键无法同样识别，allowedApps空时不限制应用；不能把护栏概括为完整安全边界。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.3.2；版本日期：2026-10-05（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[3cf9bd8a](https://github.com/988hj7tczd-oss/dsh-computer-use/tree/3cf9bd8ae60271512f263bfa75485cb242ca0892)；本轮基准：2026-10-21T04:06:46Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：抽读注册、observe/snapshot/actions/guard/cua/human；未审驱动全部OS实现或实际权限，无独立成功率。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

待验证假设：快照按会话/动作序列隔离，并把高影响动作绑定目标变化摘要和独立确认，可减少并发串窗口及坐标绕过语义审查。由全局snapshot与元素特定guard推导，未实现。用双会话交错观察、TTL内弹窗、坐标点付款三组对照，测错窗/错点与误拦；无法识别坐标语义时应明确未知而非承诺安全。

隔离双会话交错、陈旧token、TTL内页面变化、坐标敏感目标和驱动拒绝矩阵；本轮不操作桌面。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 1011 | — | — | 10102 |
| .js | source | 8 | 1793 | 1338 | 340 | — |
| .mjs | test | 8 | 458 | 407 | 0 | — |
| .mjs | source | 1 | 244 | 198 | 24 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-computer-use/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
