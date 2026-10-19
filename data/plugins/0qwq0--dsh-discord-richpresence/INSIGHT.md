# dsh-discord-richpresence

> 将 DSH 的粗粒度交互状态推送到本机 Discord Rich Presence，支持自定义文案与可选丰富状态。

- **用途**：把 DSH 的粗粒度工作状态展示到本地 Discord 桌面客户端。
- **亮点**：默认模糊状态与可选丰富模式分开，支持推送节流、IPC重连与卸载清理。
- **思考**：社交可见性不是任务完成提醒或效率证明；丰富模式和自定义文案仍可能暴露工作节奏或标量使用信息。
- **建议**：仅推荐给明确想展示状态的个人用户试用；默认保持模糊模式，先核查实际外发字段。

## 版本

固定提交 [bf8d34b4a4c52e9128a44ca7abf6a7de52880266](https://github.com/0QwQ0/dsh-discord-richpresence/tree/bf8d34b4a4c52e9128a44ca7abf6a7de52880266)

## 场景、替代办法与合格交付

个人用户希望在 Discord 显示正在与代理工作，合格结果是好友所见状态与当前粗粒度阶段一致、断开后能恢复。基线是手动状态；不是企业协作审批、任务结果通知或生产监控。

## 实现机制与依据

lib/index.js 监听 inbox、agent、工具和session等信号，按配置映射状态；lib/discord-rpc.js 用本地IPC握手、SET_ACTIVITY和重连；client设置开关持久化 richMode，丰富模式跟踪最后真实用户输入对应会话。

本轮重点审读：[lib/index.js](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js)、[lib/discord-rpc.js](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/discord-rpc.js)、[lib/client.js](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/client.js)、[test/active-session.mjs](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/test/active-session.mjs)。固定文本材料已保存；完整文件统计不表示每行代码都经过人工审计。

## 安装与效果依赖

必须有本机 Discord 桌面客户端及其 IPC，可用DSH事件和设置服务；作者声明兼容多个宿主版本，仍需在目标版本验收。标准模式无需模型或额外服务器，但展示数据最终进入 Discord 社交表面。

发布核查：npm latest 404；不能据此判定GitHub release包不可用。未安装发布产物。

## 用户、后台与失败流程

安装／重启／刷新 → 确认Discord在线 → 观察模糊状态 → 按需打开丰富模式 → 断开重连测试。升级需要重启宿主与刷新浏览器，卸载后 settings.yaml 段可能残留，清理前先备份。

## 首次、持续与迁移成本

持续成本是socket／重连定时器及外部可见信息的管理，无额外模型调用。首次只需少量配置，迁移时保留文案和richMode；无证据支持其节省开发时间。

## 工程规模与能力清单

| 扩展名 | 范围 | 文件数 | 总行数 | Markdown字数 | 代码行 |
|---|---|---:|---:|---:|---:|
| .md | source | 4 | 518 | 4632 | — |
| .js | source | 3 | 1305 | — | 940 |
| .mjs | test | 7 | 762 | — | 608 |

- **事件监听**：DSH 活动事件
- **界面**：1 个设置开关
- **后台**：本地 Discord IPC

## 工程亮点

IPC实现与事件映射分层，兼容探测和cleanup较清楚；默认不发送正文的设计值得肯定，但具体配置字符串可以被用户填入敏感信息。隐私结论只覆盖审读的发送构造，不延伸到Discord侧数据保留。

可借鉴粗粒度状态枚举、最小发送间隔和会话关联；复用到企业渠道时应改成明确opt-in字段与发送预览，不复制含糊的“绝不泄漏”承诺。

上述工程判断依据：[lib/index.js](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js)、[lib/discord-rpc.js](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/discord-rpc.js)、[lib/client.js](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/client.js)、[test/active-session.mjs](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/test/active-session.mjs)。

## 采用判断与最小验证

用两会话、子任务、断线和重启检查状态归属与重连，抓取合成SET_ACTIVITY字段核对无标题／正文／路径；若不需要社交展示则直接不装，不为增加状态装饰付出常驻负担。

## 核查说明

- 首次分析；不代表本周新发布。
- 已阅读固定版本的源码、配置和测试文件。
- 未实际运行或安装插件，也未在 DSH 中试用或比较模型任务效果。
- 作者的自测和发布说明未经独立验证。
- Issue 数量仅供参考，不代表使用人数或实际收益。

## Issue 活跃度

Issue：未关闭 0／已关闭 0 · 近30天：新建 0／关闭 0／更新 0

统计日期：2026-10-19。
