# dsh-wsl-clock

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

> 比较WSL与Windows时间，报告时钟偏差并给出休眠后TLS或令牌故障的排查建议。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clock)
<!-- END META -->

## 版本

固定提交 [111cc4c013ef17a495c8790fbfa6373d7abbdebc](https://github.com/173787247/dsh-wsl-clock/tree/111cc4c013ef17a495c8790fbfa6373d7abbdebc)

## 用途与采用点评

- **用途**：笔记本休眠后WSL联网或令牌异常，开发者希望先确认时钟是否明显漂移，验收是找到实际故障原因。
- **亮点**：lib/clock.js先取WSL Date.now，再通过PowerShell取Windows毫秒时间，计算偏差等级并返回诊断建议。
- **思考**：把常见休眠漂移变成具名探针有帮助；单次偏差不能直接解释所有TLS失败。
- **建议**：先把它当粗粒度线索，临界偏差用系统命令复核；保存工作后再考虑关闭WSL或同步时间。

## 场景与替代办法

此前未入档；手工比较date和Windows时间同样可行，本项减少收集与格式化步骤。

## 依赖与流程

依赖WSL识别和Windows时间读取权限，诊断阈值需适应启动延迟；网络故障仍要其他证据。

运行clock_doctor，核对两端UTC与等级，必要时手工验证并修时；修复后重新请求目标服务确认。

## 成本与效果

无需外部API，主要是进程启动时间和人工排查；重启WSL等建议会中断任务，应计入恢复成本。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：38470592c12ee46549ef06f680260be9232bf521ce15adddce57e92d630a7733。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 94 | — | — | 560 |
| .js | source | 3 | 198 | 174 | 4 | — |
| .js | test | 1 | 35 | 31 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：clock_doctor。

## 工程亮点

偏差计算与建议生成是可复用纯函数，读取失败单独返回；顺序采样缺少往返延迟校正，精度边界清楚。

## 分发与兼容

0.2.0，Node>=18，WSL和Windows PowerShell为必要环境；套件兼容声明不是本轮验收。


## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：两次采样非同时，PowerShell启动延迟会计入偏差；结果正常不排除DNS、代理或证书故障，不自动校时。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在已知偏移和慢PowerShell场景下测量误差，记录阈值误报；以实际TLS请求恢复作为办结条件。

## 活跃度

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clock/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clock/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clock/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)



统计日期：2026-10-20。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
