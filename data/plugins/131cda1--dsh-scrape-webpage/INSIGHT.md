# dsh-scrape-webpage

> 抓取网页正文、结构、链接与关键词，可选下载内容图片并交给扩展分析器。

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage) · [![npm 30d 1151](https://img.shields.io/static/v1?label=npm+30d&message=1%2C151&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage/commits)
<!-- END META -->

## 版本

固定提交 [7485af10c063579323058583c7f13e69c4c8bd21](https://github.com/131CDA1/dsh-scrape-webpage/tree/7485af10c063579323058583c7f13e69c4c8bd21)

## 用途与采用点评

- **用途**：研究者读取具体网页时希望得到可引用正文与结构，原有办法是浏览器复制或宿主抓取工具。
- **亮点**：lib/index.js 优先宿主 web.fetch，缺失或异常后经 shell 调用 curl；解析与统计分层，图片逐张下载并调用注册分析器。
- **思考**：分析器注册接口避免把视觉服务绑死，但自动提取并不证明正文完整或网页内容可信。
- **建议**：已有用户可保留正文抓取用途，先在公开测试页核对重定向、动态内容与超时；非 Windows 环境先验证 shell 回退，限制敏感网络目标。

## 场景与替代办法

代码仍为7485af1，变化来自目录或维护背景，本轮重写采用画像并收窄跨平台结论；与浏览器阅读相比主要减少结构整理步骤。

## 依赖与流程

抓取依赖网络与宿主服务，图片依赖工作区、shell 和可选视觉分析器；TLS 权限升级需 approval 和 Agent 上下文，失败后不能直接视作网页不存在。

输入URL获取正文与统计，必要时下载图片，人工检查原页与截断标记；TLS受限时按宿主审批重试，图片失败不冒充识图完成。

## 成本与效果

基础抓取有网络、超时和人工核对成本；图片分析另外消耗模型与存储。未测合格抓取率或单位成本。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：85b5c05d679412c6f8c60fe91617c416dbf9fcd6d1dd587c00d20d11880bff5b。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 139 | — | — | 1522 |
| .js | source | 5 | 716 | 622 | 65 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：scrape_webpage。
- **后台**：scrape.imageAnalyzer 注册及顺序分析。

## 工程亮点

html、analyze 与执行层分开便于复用；图片失败返回逐项说明。web 与 shell 两条路径的策略一致性仍需实际验证。

## 分发与兼容

1.0.0 Host-only；tools、systemPrompt、timer 为硬依赖，shell 回退使用 Windows 风格 PowerShell 路径与命令，跨平台不能假定。


## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：非浏览器渲染，动态页面和登录状态未验证；任意URL、重定向和图片下载需要部署方检查网络边界。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：对静态页、脚本页、重定向、内网和大正文分别比较原始页面，记录正文保留率、错误及人工修正时间。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
