# dsh-web-restart

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

> 在 Web 侧边栏提供重启按钮，通过独立 PowerShell 进程触发宿主重启脚本。

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1123762794/dsh-web-restart) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-restart)
<!-- END META -->

## 版本

固定提交 [5de8214051b3245a8cfc825e7e907cf5e57f51d8](https://github.com/1123762794/dsh-web-restart/tree/5de8214051b3245a8cfc825e7e907cf5e57f51d8)

## 用途与采用点评

- **用途**：Windows 本机调试人员希望从浏览器重启 DSH，不再切回终端。
- **亮点**：POST /restart-dsh 延迟启动隐藏 PowerShell，读取硬编码 D:\1\dsh-web-host.ps1；健康路由只报告当前进程存活。
- **思考**：便利入口不能替代可靠的进程管理；返回触发成功不能当作重启完成。
- **建议**：当前更适合参考实现，先在可丢弃 profile 验证脚本路径、失败反馈和会话恢复。

## 场景与替代办法

宿主 CLI 或系统服务管理器更通用，当前插件主要减少作者环境的重复操作。

## 依赖与流程

依赖 Windows PowerShell、外部重启脚本和足够进程权限；其他系统无法直接照搬。

保存工作后点击按钮，等待服务恢复并核对状态；脚本缺失或启动失败需回到终端处理。

## 成本与效果

需要改造并维护本地脚本，重启会中断运行；一次点击减少操作却增加误触和恢复负担。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：22d6dac685f59337c1479fbc7e69dba928500011e1a551747752f24916bcd815。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 218 | 173 | 34 | — |
| .md | source | 2 | 164 | — | — | 1267 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **Host 路由**：重启触发和健康检查。

## 工程亮点

独立进程可在宿主退出后继续运行，但固定路径和全权限 shell 使可移植性较弱。

## 分发与兼容

版本 0.1.0，依赖 Web 与 shell，当前源码并未提供跨平台自动适配。


## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：硬编码作者机器路径和 Windows 命令使其不具通用部署条件；响应成功发生在实际重启之前。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：覆盖脚本缺失、权限失败、重复点击、启动失败与未完成任务恢复，不能仅测 HTTP 200。

## 活跃度

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/1123762794/dsh-web-restart/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
