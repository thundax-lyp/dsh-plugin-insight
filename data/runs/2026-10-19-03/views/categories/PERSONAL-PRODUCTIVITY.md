# 个人效率

[返回首页](../../../../../README.md)

## 分类导航

- [api-balance](#plugin-1334899834-root)：在 DSH Web 输入区显示 DeepSeek API 账户余额与可用状态。
- [dsh-discord-richpresence](#plugin-1342915339-root)：把 DSH 的粗粒度工作状态展示到本地 Discord 桌面客户端。
- [dsh-status-rotator](#plugin-1333328839-root)：替换 DSH Web 状态文案，提供阶段感知词库、主题、打字机和弹幕效果。
- [dsh-workspace-menu](#plugin-1339803365-root)：为工作区和会话行补充置顶、重命名、归档、打开目录等菜单操作。

### 个人效率（4）

<a id="plugin-1334899834-root"></a>

#### [api-balance](../../../../plugins/02muller25--dsh-api-balance/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance) · 最后更新：2个月前（2026-08-15）

- **用途**：在 DSH Web 输入区显示 DeepSeek API 账户余额与可用状态。
- **亮点**：浏览器只读同源余额接口，支持刷新间隔与失败保留旧值，减少切换控制台。
- **思考**：余额不是任务预算或成本预警；凭证被拼入 curl 子进程命令，不能将“不发给浏览器”写成“不出宿主进程”。
- **建议**：适合单账户用户按需查看，先验证凭证处理与轮询负担；需要预算控制时仍要配合计量和限额。

<a id="plugin-1342915339-root"></a>

#### [dsh-discord-richpresence](../../../../plugins/0qwq0--dsh-discord-richpresence/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence) · 最后更新：1个月前（2026-09-19）

- **用途**：把 DSH 的粗粒度工作状态展示到本地 Discord 桌面客户端。
- **亮点**：默认模糊状态与可选丰富模式分开，支持推送节流、IPC重连与卸载清理。
- **思考**：社交可见性不是任务完成提醒或效率证明；丰富模式和自定义文案仍可能暴露工作节奏或标量使用信息。
- **建议**：仅推荐给明确想展示状态的个人用户试用；默认保持模糊模式，先核查实际外发字段。

<a id="plugin-1333328839-root"></a>

#### [dsh-status-rotator](../../../../plugins/01virex--dsh-status-rotator/INSIGHT.md)

[![GitHub ★ 162](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=162&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) · [![npm 30d 11532](https://img.shields.io/static/v1?label=npm+30d&message=11%2C532&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) · 最后更新：今天（2026-10-19）

- **用途**：替换 DSH Web 状态文案，提供阶段感知词库、主题、打字机和弹幕效果。
- **亮点**：状态显示之外有设置持久化、配置校验和 SSE 同步，体验配置可以由用户调整。
- **思考**：装饰层已带来较大的前后端维护面；更多动效是否帮助判断运行状态，还是增加干扰和兼容负担？
- **建议**：适合重视界面氛围的个人用户体验；工作环境先关弹幕与动画，比较状态可读性和浏览器负担。

<a id="plugin-1339803365-root"></a>

#### [dsh-workspace-menu](../../../../plugins/0imzero--dsh-workspace-menu/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu) · 最后更新：1个月前（2026-08-24）

- **用途**：为工作区和会话行补充置顶、重命名、归档、打开目录等菜单操作。
- **亮点**：把分散动作集中到右键／双击入口，保留移除列表与删除磁盘的区别，并复用归档管理器。
- **思考**：React fiber识别依赖界面内部结构；二次确认在浏览器侧，不能证明删除端点被限制在当前工作区。
- **建议**：先试非破坏菜单并保持删除关闭；需要删除时必须在临时目录验证路径授权、归档依赖和失败恢复。

## 更新时间

2026-10-19
