# dsh-openai-oauth

> 通过浏览器或设备码登录ChatGPT，将Codex模型作为DSH原生LLM适配器提供。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[ba29660](https://github.com/AdonisSheldon/dsh-openai-oauth/tree/ba29660530fe05779b06f129a0c0ed5c2237b73f)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/AdonisSheldon/dsh-openai-oauth) · [![npm 30d 814](https://img.shields.io/static/v1?label=npm+30d&message=814&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-openai-oauth) · [![首次发布 2026-08-15](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-openai-oauth)
<!-- END META -->

**使用建议**：仅在本机临时profile核对工具和中断续聊语义；先确认账户授权条件和凭据清理方式，再替代现有模型连接。

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

- **用途**：有Codex访问资格的本机用户希望沿用DSH会话、工具和模型选择器。

- **建议**：由显式选项拒绝与replay转换推导，可提供模型能力协商及事件保真度收据，提前暴露不支持特性。未验证；同一含工具、图片、中断续聊任务对照事件序列和结果，静默降级应为0。

仅在本机临时profile核对工具和中断续聊语义；先确认账户授权条件和凭据清理方式，再替代现有模型连接。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

原生API key或独立Codex客户端各有成熟路径；此插件减少外部代理层但承担协议适配。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **后台**：OAuth会话、凭据刷新与LLM适配器。
- **Host 路由**：本机OAuth管理接口。
- **界面**：授权与模型选择集成。

**流程与依赖**

DSH llm与可选attachments/webServer，上游Codex OAuth和模型接口；CLI bin是登录入口，非DSH注册命令。

用户授权，写本地凭据，模型选择触发适配器转换请求/事件并刷新token；退出清凭据，卸载前需主动退出。

**效果与成本**

已有账户资格、首次授权和凭据维护；持续订阅/额度及协议跟进成本，本轮未核实账号可用性或费用。

减少跨应用上下文搬运，未证明稳定配额或任务质量提升。

- **思考**：原生外观能否保证协议等价？适配器明确拒绝不支持的maxTokens等选项，重放、工具结果和流式停止原因仍需真实任务验收。凭据虽权限收紧仍明文，卸载保留，不能当作密钥保险库。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对启动独立Codex代理，增量是直接模型路由和DSH事件/工具语义适配。模型能力与账户配额归上游，OAuth标准不算原创。

相对启动独立Codex代理，增量是直接模型路由和DSH事件/工具语义适配。模型能力与账户配额归上游，OAuth标准不算原创。

锁、原子替换、路径检查和loopback强制边界较清晰；直接适配仍受上游协议变动影响。 源码依据：[src/index.ts](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/index.ts)、[src/adapter.ts](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/adapter.ts)、[src/credential-store.ts](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/credential-store.ts)、[src/auth-controller.ts](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/auth-controller.ts)、[src/stream.ts](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/src/stream.ts)、[package.json](https://github.com/AdonisSheldon/dsh-openai-oauth/blob/ba29660530fe05779b06f129a0c0ed5c2237b73f/package.json)。

<a id="detail-section-5"></a>

### 主要限制

原生外观能否保证协议等价？适配器明确拒绝不支持的maxTokens等选项，重放、工具结果和流式停止原因仍需真实任务验收。凭据虽权限收紧仍明文，卸载保留，不能当作密钥保险库。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AdonisSheldon/dsh-openai-oauth](https://github.com/AdonisSheldon/dsh-openai-oauth)
- **版本号**：0.1.0（[固定提交 ba296605](https://github.com/AdonisSheldon/dsh-openai-oauth/tree/ba29660530fe05779b06f129a0c0ed5c2237b73f)）
- **版本日期**：2026-08-21（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/adapter.ts、src/credential-store.ts、src/auth-controller.ts、src/stream.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读src/index.ts、src/adapter.ts、src/credential-store.ts、src/auth-controller.ts、src/stream.ts、package.json；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：核对工具调用/图片/上下文重放、取消、刷新竞态与凭据损坏；日志不得含token，远程Web绑定应拒绝。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由显式选项拒绝与replay转换推导，可提供模型能力协商及事件保真度收据，提前暴露不支持特性。未验证；同一含工具、图片、中断续聊任务对照事件序列和结果，静默降级应为0。

核对工具调用/图片/上下文重放、取消、刷新竞态与凭据损坏；日志不得含token，远程Web绑定应拒绝。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：1e6fca9d4a8270e6418a45400a70c155748ffa041cb55ca0a43bee7c46ada309。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 309 | — | — | 2366 |
| .js | source | 4 | 3022 | 2907 | 171 | — |
| .ts | source | 18 | 2937 | 2635 | 104 | — |
| .tsx | source | 1 | 297 | 274 | 3 | — |

排除 3 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AdonisSheldon/dsh-openai-oauth/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
