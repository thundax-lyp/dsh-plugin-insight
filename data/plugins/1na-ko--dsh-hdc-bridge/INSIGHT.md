# dsh-hdc-bridge

> 在 DSH 中连接鸿蒙设备、构建调试应用并查询版本化开发知识。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[395381a](https://github.com/1na-ko/dsh-hdc-bridge/tree/395381a446075c161fa915210e4680c266956de1)

<!-- BEGIN META -->
[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/1na-ko/dsh-hdc-bridge) · [![npm 30d 1769](https://img.shields.io/static/v1?label=npm+30d&message=1%2C769&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-hdc-bridge)
<!-- END META -->

**使用建议**：适合已有鸿蒙工具链的开发者；先用测试设备走完截图、构建、安装、验证闭环，再交给模型处理重要应用。

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

贡献机制有固定源码支持；效果与采用收益为条件性解释，后续设计假设尚未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：鸿蒙开发者希望在一个会话完成设备观察、改码、构建、装包与验证；交付是目标设备上可复核的应用行为。

采用建议：适合已有鸿蒙工具链的开发者；先用测试设备走完截图、构建、安装、验证闭环，再交给模型处理重要应用。

参照直接hdc脚本和README点名的hdc_mcp；未执行设备连通或SDK签名验证。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：hdc_list_targets、hdc_screenshot、hdc_install、hdc_ui（源码注册）
- **界面**：鸿蒙设备面板
- **后台**：随包官方来源知识读取与设备命令桥接

**流程与依赖**

需要本机hdc3.x、USB/网络调试授权及鸿蒙设备/模拟器；构建签名需DevEco/CLT/SDK与相应凭据；DSH shell和会话沙箱策略决定可执行范围。

发现工具链并解析会话cwd/策略，列设备选目标，截图/布局观察，改码和构建，安装/启动后再观察；失败返回结构化原因，不把环境缺失说成设备故障。

**效果与成本**

现金包括开发设备、模型与可选工具链资源；人工为调试授权、SDK/签名配置、跨版本问题和部署验收。预期少搬运，未测端到端合格修复工时。

价值在把分散开发步骤带回同一会话；执行工具齐全不证明模型能修好应用。

- **思考**：设备命令返回成功不等于目标应用验证通过。源码对退出码不可靠作输出与落盘补检，但UI交互是否达成业务目标仍需观察；knowledge.mjs引用固定文档且分段截断，不能据“官方优先”推断与设备SDK始终一致。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：作者明确不重写hdc协议，并以hdc_mcp为参照；实际增量是会话策略、原生图片闭环、结构化失败与官方版本知识组合。把设备命令与源码工作区关联，减少手工在终端和聊天间搬运。

作者明确不重写hdc协议，并以hdc_mcp为参照；实际增量是会话策略、原生图片闭环、结构化失败与官方版本知识组合。把设备命令与源码工作区关联，减少手工在终端和聊天间搬运。

lib/hdc-core.mjs 将发现、目标选择与命令执行封装到可注入依赖的闭包；lib/host.js按会话解析策略并区分shell转义层；knowledge.mjs保留出处和截断信息。复用需保留设备目标和版本身份，不能只复制命令字符串。 源码：[lib/host.js](https://github.com/1na-ko/dsh-hdc-bridge/blob/395381a446075c161fa915210e4680c266956de1/lib/host.js)、[lib/hdc-core.mjs](https://github.com/1na-ko/dsh-hdc-bridge/blob/395381a446075c161fa915210e4680c266956de1/lib/hdc-core.mjs)、[lib/knowledge.mjs](https://github.com/1na-ko/dsh-hdc-bridge/blob/395381a446075c161fa915210e4680c266956de1/lib/knowledge.mjs)。

<a id="detail-section-5"></a>

### 主要限制

设备命令返回成功不等于目标应用验证通过。源码对退出码不可靠作输出与落盘补检，但UI交互是否达成业务目标仍需观察；knowledge.mjs引用固定文档且分段截断，不能据“官方优先”推断与设备SDK始终一致。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 lib/host.js、lib/hdc-core.mjs、lib/knowledge.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交的所列核心实现与作者材料；未运行插件、安装、测试或真实宿主验收，未确认独立用户效果。
- 下一步：同一工程在两个API版本设备分别构建安装，制造错误包、过期知识与设备切换；比较手工hdc与绑定记录流程的误投设备、误判成功、人工步骤。若工具拿不到可靠包身份则只记录未确认。

**分析版本**

- **仓库**：[1na-ko/dsh-hdc-bridge](https://github.com/1na-ko/dsh-hdc-bridge)
- **版本号**：0.10.2（[固定提交 395381a](https://github.com/1na-ko/dsh-hdc-bridge/tree/395381a446075c161fa915210e4680c266956de1)）
- **版本日期**：2026-10-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：把每次部署的SDK/API、设备ID、包摘要与观察结果形成一次绑定记录，可减少多设备多版本误归因。由工具链发现、版本化知识和截图闭环组合推导；会增加记录存储与隐私负担。

同一工程在两个API版本设备分别构建安装，制造错误包、过期知识与设备切换；比较手工hdc与绑定记录流程的误投设备、误判成功、人工步骤。若工具拿不到可靠包身份则只记录未确认。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 47 | 41131 | — | — | 270128 |
| .cjs | source | 1 | 458 | 361 | 36 | — |
| .js | source | 2 | 3281 | 2860 | 324 | — |
| .mjs | source | 17 | 3453 | 2904 | 377 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/1na-ko/dsh-hdc-bridge/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
