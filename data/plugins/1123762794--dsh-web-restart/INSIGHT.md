# dsh-web-restart

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[5de8214](https://github.com/1123762794/dsh-web-restart/tree/5de8214051b3245a8cfc825e7e907cf5e57f51d8)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1123762794/dsh-web-restart)
<!-- END META -->

> **实现功能**：在 Web 侧边栏提供重启按钮，通过独立 PowerShell 进程触发宿主重启脚本。

> **核心亮点**：POST /restart-dsh 延迟启动隐藏 PowerShell，读取硬编码 D:\1\dsh-web-host.ps1；健康路由只报告当前进程存活。

> **风险与缺陷**：便利入口不能替代可靠的进程管理；返回触发成功不能当作重启完成。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：Windows 本机调试人员希望从浏览器重启 DSH，不再切回终端。

宿主 CLI 或系统服务管理器更通用，当前插件主要减少作者环境的重复操作。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **Host 路由**：重启触发和健康检查。

**流程与依赖**

依赖 Windows PowerShell、外部重启脚本和足够进程权限；其他系统无法直接照搬。

保存工作后点击按钮，等待服务恢复并核对状态；脚本缺失或启动失败需回到终端处理。

**兼容条件**

版本 0.1.0，依赖 Web 与 shell，当前源码并未提供跨平台自动适配。

**效果与成本**

需要改造并维护本地脚本，重启会中断运行；一次点击减少操作却增加误触和恢复负担。

> **思考**：便利入口不能替代可靠的进程管理；返回触发成功不能当作重启完成。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：POST /restart-dsh 延迟启动隐藏 PowerShell，读取硬编码 D:\1\dsh-web-host.ps1；健康路由只报告当前进程存活。

独立进程可在宿主退出后继续运行，但固定路径和全权限 shell 使可移植性较弱。

<a id="detail-section-4"></a>

## 4 使用建议

当前更适合参考实现，先在可丢弃 profile 验证脚本路径、失败反馈和会话恢复。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：硬编码作者机器路径和 Windows 命令使其不具通用部署条件；响应成功发生在实际重启之前。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：覆盖脚本缺失、权限失败、重复点击、启动失败与未完成任务恢复，不能仅测 HTTP 200。

**分析版本**

固定提交 [5de8214](https://github.com/1123762794/dsh-web-restart/tree/5de8214051b3245a8cfc825e7e907cf5e57f51d8)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 218 | 173 | 34 | — |
| .md | source | 2 | 164 | — | — | 1267 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1123762794/dsh-web-restart/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
