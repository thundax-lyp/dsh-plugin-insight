# api-balance

> 在 DSH Web 输入区实时显示 DeepSeek API 账户余额，支持自动轮询、手动刷新和自定义刷新间隔。

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance/commits)
<!-- END META -->

- **用途**：在 DSH Web 输入区显示 DeepSeek API 账户余额与可用状态。
- **亮点**：浏览器只读同源余额接口，支持刷新间隔与失败保留旧值，减少切换控制台。
- **思考**：余额不是任务预算或成本预警；凭证被拼入 curl 子进程命令，不能将“不发给浏览器”写成“不出宿主进程”。
- **建议**：适合单账户用户按需查看，先验证凭证处理与轮询负担；需要预算控制时仍要配合计量和限额。

## 版本

固定提交 [c27c8b61acf97714ab08d99f97b7be3a9007e52e](https://github.com/02Muller25/dsh-api-balance/tree/c27c8b61acf97714ab08d99f97b7be3a9007e52e)

## 场景、替代办法与合格交付

用户在开发过程中担心余额不足，需要快速确认可用性；合格结果是展示与官方账户相符且失败时不会把旧值冒充实时值。基线是官方控制台或手动查询余额接口。

## 实现机制与依据

lib/index.js 注册 GET /api/abal-balance，每次解析 DEEPSEEK_API_KEY，用 shell.resolve／run 调用固定 API；lib/client.js 在 composer dock 渲染并轮询，刷新偏好保存在 localStorage。

本轮重点审读：[lib/index.js](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/index.js)、[lib/client.js](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/client.js)、[package.json](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/package.json)。固定文本材料已保存；完整文件统计不表示每行代码都经过人工审计。

## 安装与效果依赖

需要 DSH Web 的 webServer、credentials、shell、客户端 slots 与 react；系统要有 curl，账户凭证要能调用余额接口。sandboxPolicy 是可选读取，但 shell 执行显式使用 danger-full-access。包 private=true，适合 GitHub bundle，不以同名 api-balance npm 包作归属依据。

发布核查：根包 private=true，未按同名 npm 包推断发布归属。

## 用户、后台与失败流程

安装／重启 → 提供凭证 → 选择手动或轮询 → 显示更新时间与余额；网络失败保留旧值并提示，恢复后再次查询。多浏览器会各自轮询；账户总余额不区分项目或用户消耗。

## 首次、持续与迁移成本

每浏览器每30秒默认最多约120次查询/小时，每次另起 curl；10秒模式约360次，这是配置推算并非实测。没有模型 token 调用增量，但有网络、子进程和故障排查成本。迁移主要是本地刷新偏好。

## 工程规模与能力清单

| 扩展名 | 范围 | 文件数 | 总行数 | Markdown字数 | 代码行 |
|---|---|---:|---:|---:|---:|
| .js | source | 2 | 346 | — | 327 |
| .md | source | 1 | 89 | 928 | — |

- **Host 路由**：1 个精确 GET 路由
- **界面**：1 个输入区槽位

## 工程亮点

功能面小、宿主和客户端分工清晰，失败信息较具体。确认到凭证值插入命令字符串且经 shell.run 执行，实际日志／进程参数可见性依赖宿主和系统；这是待核查风险，不宣称已发生泄漏。README 的“不出宿主进程”与实际启动子进程的代码不一致。

可借鉴同源接口、no-store响应和旧值加失败标记；移植时优先宿主内 HTTP API 和明确的凭证传递边界，避免为了只读查询引入宽权限 shell。

上述工程判断依据：[lib/index.js](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/index.js)、[lib/client.js](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/client.js)、[package.json](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/package.json)。

## 怎么用、要注意什么

想随时看一眼账户还剩多少钱，可以试试。先用测试账户确认余额是否准确、断网或密钥填错时有没有提示；同时打开几个页面，看看是否频繁重复查询。再检查日志里会不会露出密钥，别拿真实密钥做实验。它只能查看余额，不能给每个任务设置花费上限。

## 核查说明

- 首次分析；不代表本周新发布。
- 已阅读固定版本的源码、配置和测试文件。
- 未实际运行或安装插件，也未在 DSH 中试用或比较模型任务效果。
- 作者的自测和发布说明未经独立验证。
- Issue 数量仅供参考，不代表使用人数或实际收益。

## Issue 活跃度

Issue：未关闭 0／已关闭 1 · 近30天：新建 0／关闭 1／更新 1

统计日期：2026-10-19。
