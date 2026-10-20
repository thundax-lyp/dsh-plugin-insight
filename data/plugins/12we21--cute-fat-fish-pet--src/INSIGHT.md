# 蓝毛小女仆桌宠

> 以透明动画桌宠提供陪伴聊天，可选本地模型、在线模型与屏幕观察。

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet) · [![最后更新 前天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E5%89%8D%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet/commits)
<!-- END META -->

## 版本

固定提交 [e53f63e67227671aca092e3334c8611e29b880b6](https://github.com/12we21/cute-fat-fish-pet/tree/e53f63e67227671aca092e3334c8611e29b880b6/src)

## 用途与采用点评

- **用途**：个人桌面用户希望用角色动画和轻量聊天增加陪伴感，而非完成标准化办公任务。
- **亮点**：插件 Host 调用本地 Ollama 或 DSH 模型，管理辅助进程与事件；资源和浏览器交互由 src 下的已构建 bundle 提供。
- **思考**：角色交互价值高度主观；本地优先不是任何配置下都离线，在线模型可能接收聊天及选定观察内容。
- **建议**：先关闭屏幕观察和在线回退，确认数据路径、模型路由与卸载，再按个人偏好试用。

## 场景与替代办法

个人桌面用户希望用角色动画和轻量聊天增加陪伴感，而非完成标准化办公任务。

纯动画桌宠成本更低且少网络依赖；加入模型仅适合愿意管理角色、路由与隐私配置的人群。

## 依赖与流程

依赖 DSH 模型或 Ollama、动画解码和可选原生辅助进程；完整仓库安装还有较大下载体积。

选模型与交互设置后聊天，观察屏幕能力明确启用；异常时分别检查 helper、模型和资源。

## 成本与效果

资源下载、辅助进程和模型调用会占网络、内存与额度；没有量化陪伴效果或资源占用。

角色交互价值高度主观；本地优先不是任何配置下都离线，在线模型可能接收聊天及选定观察内容。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：src；内容摘要：7ebfc18ec4c79fb8e7b63ae3b4370bc0c14b950253280c6dd07d72da50e8cb22。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 13 | 17928 | 15530 | 2258 | — |
| .md | source | 3 | 418 | — | — | 7243 |
| .mjs | source | 2 | 454 | 329 | 102 | — |
| .ts | source | 33 | 8986 | 6565 | 2013 | — |
| .ts | test | 17 | 3130 | 2499 | 349 | — |

排除 381 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **界面**：动画桌宠和聊天交互。
- **后台**：模型路由与可选桌面辅助进程。

## 工程亮点

配置与聊天数据放在包外利于升级，但保留旧数据根与路由标识，重命名和卸载需按实际路径处理。

## 分发与兼容

组件 src 的 cute-fat-fish-pet 1.2.3，仓库含大量动画与打包依赖，不能把总体行数当原创代码规模。

## 历史对照

前次代码指纹为 e53f63e67227671aca092e3334c8611e29b880b6；本轮固定为 e53f63e67227671aca092e3334c8611e29b880b6。纯动画桌宠成本更低且少网络依赖；加入模型仅适合愿意管理角色、路由与隐私配置的人群。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核查插件半区，不把独立 Windows 版离线语音和 TTS 算入；未验证辅助程序、资源许可或屏幕隐私。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：检查本地/在线路由、无模型降级、屏幕开关、helper 退出和数据清理，并实测内存与下载。

## 活跃度

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 0](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=0&color=grey&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
