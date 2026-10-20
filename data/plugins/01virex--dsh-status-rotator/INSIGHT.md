# dsh-status-rotator

> 为 DSH Web 状态区提供阶段化文案、主题词库、动画与可编辑设置。

<!-- BEGIN META -->
[![GitHub ★ 185](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=185&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) · [![npm 30d 11750](https://img.shields.io/static/v1?label=npm+30d&message=11%2C750&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) · [![最后更新 昨天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E6%98%A8%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/commits)
<!-- END META -->

## 版本

固定提交 [bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1](https://github.com/01Virex/dsh-status-rotator/tree/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1)

## 用途与采用点评

- **用途**：希望改善等待体验的桌面用户，以更清楚或有趣的状态文案替代默认状态行。
- **亮点**：Host 保存并提供配置，客户端按阶段和偏好选择文案，支持持久化覆盖与扩展词库。
- **思考**：配置持久化使个性化可重复；状态文案不是实际进度，不能拿它判断任务是否完成。
- **建议**：先只开静态文案，确认设置能保存且与原生状态共存，再逐步启用弹幕和动画。

## 场景与替代办法

希望改善等待体验的桌面用户，以更清楚或有趣的状态文案替代默认状态行。

直接使用宿主状态行维护最低；本轮重新检查配置链路，旧截图不证明当前版本渲染正确。

## 依赖与流程

依赖 DSH Web 插槽、设置与宿主路由能力；浏览器存储和外部配置可影响最终表现。

启用后调整词库和展示项，保存配置；界面异常时关闭可选效果并恢复默认配置。

## 成本与效果

主要付出配置、冲突排查和界面维护时间，未证明动画改善任务效率。

配置持久化使个性化可重复；状态文案不是实际进度，不能拿它判断任务是否完成。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：a5a9d88ef851d869a12c13d723fb4c37fe784fb26c07fc7c74a85e0ef0e78290。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 4184 | — | — | 70472 |
| .cjs | source | 25 | 7094 | 5859 | 943 | — |
| .js | source | 3 | 11855 | 9219 | 2337 | — |
| .mjs | source | 1 | 111 | 88 | 15 | — |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **界面**：状态文案、词库与外观设置扩展。

## 工程亮点

配置临时文件加 rename、Host 与客户端协议分离可借鉴；大体积手工客户端增加适配负担。

## 分发与兼容

清单版本 0.37.0，Host 和 Web client 共同组成 bundle；未验收宿主兼容。

## 历史对照

前次代码指纹为 bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1；本轮固定为 bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1。直接使用宿主状态行维护最低；本轮重新检查配置链路，旧截图不证明当前版本渲染正确。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：lib 客户端很大，仅抽读配置和词库接口；未检查全部动画路径或 UI 性能。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：比较静态与动画设置下的输入延迟、配置重载、窄屏布局及重启恢复。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+created%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+updated%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z)

统计日期：2026-10-20。
