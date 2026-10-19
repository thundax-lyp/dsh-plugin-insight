# dsh-workspace-menu

> 为 DSH 工作区与会话补充右键、双击菜单，集中提供置顶、重命名、归档、分叉和打开目录等操作。

- **用途**：为工作区和会话行补充置顶、重命名、归档、打开目录等菜单操作。
- **亮点**：把分散动作集中到右键／双击入口，保留移除列表与删除磁盘的区别，并复用归档管理器。
- **思考**：React fiber识别依赖界面内部结构；二次确认在浏览器侧，不能证明删除端点被限制在当前工作区。
- **建议**：先试非破坏菜单并保持删除关闭；需要删除时必须在临时目录验证路径授权、归档依赖和失败恢复。

## 版本

固定提交 [afd55510f82821cde60a8364e42f752e244b5b31](https://github.com/0imzero/dsh-workspace-menu/tree/afd55510f82821cde60a8364e42f752e244b5b31)

## 场景、替代办法与合格交付

经常管理很多会话和项目的用户，希望减少定位和切页。合格交付物是动作作用于正确对象、可区分保留文件与永久删除；基线是宿主原生菜单和系统文件管理器。

## 实现机制与依据

src/client/index.ts 用DOM事件与React fiber恢复行对象，置顶和未读保存在localStorage；src/index.ts提供打开系统文件管理器和删除目录的两个POST接口。永久会话删除调用dsh-archive-manager，工作区目录由本插件rm递归删除。

本轮重点审读：[src/index.ts](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/index.ts)、[src/client/index.ts](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/client/index.ts)、[README.md](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/README.md)。固定文本材料已保存；完整文件统计不表示每行代码都经过人工审计。

## 安装与效果依赖

依赖DSH客户端runtime／slots／settings与React，Host webServer／webRuntime及系统文件管理器；删除功能额外依赖 @mlgbnb/dsh-archive-manager。效果依赖宿主DOM／fiber和深链格式，宽peer范围不保证每个版本都兼容。

发布核查：根包 private=true，未按同名 npm 包推断发布归属。

## 用户、后台与失败流程

安装／刷新 → 开启所需菜单 → 用临时项目检查对象识别 → 执行非破坏动作；删除时先清会话记录再移除目录，浏览器两次确认。部分步骤成功后另一部分失败，需要手动核对，未发现跨两插件的事务回滚。

## 首次、持续与迁移成本

常用动作可能减少点击，但需要界面升级适配、localStorage跨浏览器不一致处理和依赖插件维护。删除误操作成本远高于省下点击；迁移需备份置顶／未读偏好和项目数据。无本轮耗时实测。

## 工程规模与能力清单

| 扩展名 | 范围 | 文件数 | 总行数 | Markdown字数 | 代码行 |
|---|---|---:|---:|---:|---:|
| .md | source | 5 | 340 | 2797 | — |
| .js | source | 2 | 1251 | — | 1215 |
| .mjs | source | 1 | 34 | — | 24 |
| .ts | source | 3 | 1472 | — | 1355 |

- **Host 路由**：2 个 POST 路由
- **界面**：1 个设置槽位及菜单动作

## 工程亮点

路由引用计数与卸载清理、跨平台spawn参数化值得肯定。后端删除检查可信请求、POST、绝对路径和少数禁删根路径；审读路径未见绑定已注册工作区的允许列表或操作对象凭据。由此不能推断远程可利用，但足以要求采用前验证授权范围；前端确认不是服务端约束。

可借鉴菜单动作分组、删除／移除分离和route lease清理；更稳的复用是使用公开行操作接口，并把对象ID、服务端解析路径、允许范围与可恢复删除做成独立契约。

上述工程判断依据：[src/index.ts](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/index.ts)、[src/client/index.ts](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/src/client/index.ts)、[README.md](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/README.md)。

## 采用判断与最小验证

临时工作区先验证置顶／重命名／归档，再用不含真实资料的允许与禁止路径测试删除API；模拟归档成功而目录删除失败。若后端能删除不属于选中工作区的目录，保持删除禁用并向上游报告具体条件。

## 核查说明

- 首次分析；不代表本周新发布。
- 已阅读固定版本的源码、配置和测试文件。
- 未实际运行或安装插件，也未在 DSH 中试用或比较模型任务效果。
- 作者的自测和发布说明未经独立验证。
- Issue 数量仅供参考，不代表使用人数或实际收益。

## Issue 活跃度

Issue：未关闭 1／已关闭 0 · 近30天：新建 0／关闭 0／更新 0

统计日期：2026-10-19。
