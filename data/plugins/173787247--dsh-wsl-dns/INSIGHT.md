# dsh-wsl-dns

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

> 比较WSL与Windows的IPv4解析结果，读取nameserver并提供DNS、VPN与网络排查提示。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-dns) · [![最后更新 21天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=21%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-dns/commits)
<!-- END META -->

## 版本

固定提交 [04d6ff1aff856dd22b78c53013a9286efa0ddc35](https://github.com/173787247/dsh-wsl-dns/tree/04d6ff1aff856dd22b78c53013a9286efa0ddc35)

## 用途与采用点评

- **用途**：WSL联网异常而Windows正常时，用户需要两端同域名解析证据，以缩小故障范围。
- **亮点**：lib/dns.js读取resolv.conf，分别调用Node resolve4和Windows GetHostAddresses，去重排序后标记地址集合不一致。
- **思考**：同屏比较便于发现单侧解析失败；地址不同只支持差异事实，不支持唯一故障原因。
- **建议**：只作为差异线索，先用稳定测试域名核对，再结合HTTPS与代理探针；企业分流DNS环境不要仅因不一致改配置。

## 场景与替代办法

此前未入档；nslookup/Resolve-DnsName等原生命令为对照，本项减少手动整理但未扩展到完整网络诊断。

## 依赖与流程

需要两端解析器和Windows互操作，DNS服务器、VPN、缓存与网络策略决定答案；IPv6-only服务不在当前口径。

选故障域名执行dns_doctor，查看单侧空结果和mismatch，结合网络策略复核；更改DNS后再检查真实目标请求。

## 成本与效果

每个域名需两端解析和PowerShell调用，批量时可能累积延迟；人工确认VPN策略与误报占时间，无实测排障收益。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：3d575e1abc7f7696b156e36a5f44e46936f4e4147869ace9ef9da5499a212a22。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 95 | — | — | 546 |
| .js | source | 3 | 261 | 234 | 2 | — |
| .js | test | 1 | 65 | 59 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：dns_doctor。

## 工程亮点

结果注释与建议生成是纯函数，错误解析退空数组；失败原因细节丢失，需要原生DNS输出补证。

## 分发与兼容

0.2.0，Node>=18，依赖WSL与PowerShell；默认探测少量开发服务域名，不能代表所有网络正常。


## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只看IPv4，两端DNS走不同接口；CDN和负载均衡也会合法返回不同集合，mismatch不能直接诊断劫持或错误。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在split-DNS、CDN、单侧超时和IPv6-only样本下核对误报，以目标HTTPS恢复作为办结标准而非地址集合相同。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-dns/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-dns/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-dns/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-dns/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-dns/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
