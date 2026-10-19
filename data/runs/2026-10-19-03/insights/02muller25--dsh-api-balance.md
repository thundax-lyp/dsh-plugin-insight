# api-balance

- **用途：**在 DSH Web 输入区显示 DeepSeek API 账户余额与可用状态。
- **亮点：**浏览器只读同源余额接口，支持刷新间隔与失败保留旧值，减少切换控制台。
- **关键质疑：**余额不是任务预算或成本预警；凭证被拼入 curl 子进程命令，不能将“不发给浏览器”写成“不出宿主进程”。
- **建议：**适合单账户用户按需查看，先验证凭证处理与轮询负担；需要预算控制时仍要配合计量和限额。

## 固定范围与依据

组件 github:1334899834:root，路径 仓库根，固定提交 [c27c8b61acf97714ab08d99f97b7be3a9007e52e](https://github.com/02Muller25/dsh-api-balance/tree/c27c8b61acf97714ab08d99f97b7be3a9007e52e/)。本轮 20261019T091725Z-init10，核查于 2026-10-19T09:30:10.915Z。
材料：[源码快照](../snapshots/02muller25--dsh-api-balance/SOURCE.json)、[仓库与发布记录](../snapshots/02muller25--dsh-api-balance/REPOSITORY.json)、[统计产物](../snapshots/02muller25--dsh-api-balance/INVENTORY.json)、[META](../snapshots/02muller25--dsh-api-balance/META.json)。目录来源固定版本见[本轮报告](../REPORT.md)。

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

口径：sloc 0.3.2／TypeScript 5.9.3，固定提交全仓根组件；仅 Markdown 与 JS／TS。Markdown 字数含标记和代码；各扩展名分列，不合成跨语言总量。scripts中的验证脚本按当前路径启发式可能归source，其数量不等于产品代码量。
生成、复制和第三方归属仍需人工辨认：lib若是交付构建结果，会与src重复，不相加为原创规模；本表保留实际收录文件面积。默认排除项及路径见统计JSON，声明文件、build/dist、依赖与其他扩展名不计。

核查一个精确 GET 路由与一个输入区界面槽位；无 SKILL.md、Agent/Preset、模型工具或用户命令定义。

自动提取的Agent、工具、事件／UI候选及未解析位置保存在统计JSON；confirmed_count=null不改成运行时确认。

## 代码评价与可借鉴处

功能面小、宿主和客户端分工清晰，失败信息较具体。确认到凭证值插入命令字符串且经 shell.run 执行，实际日志／进程参数可见性依赖宿主和系统；这是待核查风险，不宣称已发生泄漏。README 的“不出宿主进程”与实际启动子进程的代码不一致。

可借鉴同源接口、no-store响应和旧值加失败标记；移植时优先宿主内 HTTP API 和明确的凭证传递边界，避免为了只读查询引入宽权限 shell。

上述工程判断依据：[lib/index.js](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/index.js)、[lib/client.js](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/client.js)、[package.json](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/package.json)。

## 采用判断与最小验证

用专门测试账户比较余额一致性、超时和无效凭证，再观察并发页面请求数和命令／日志处理。若需要对每任务限额，停止把本插件当预算控制方案；不得使用真实密钥做可公开的日志实验。

## 历史对照与验证边界

本条首次纳入本工程深评；added表示相对上轮三插件样本新增，不是本周新发布。 作者报告、静态核查和独立执行分开：本轮重新阅读固定源码／配置／测试，未运行目标代码、未安装目标插件、未做真实宿主验收或模型任务对照。仓库自测、发布说明属于作者材料，未作为独立通过证据。Issue数量只作背景，不证明独立采用或实际收益。
