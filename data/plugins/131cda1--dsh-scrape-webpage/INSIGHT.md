# dsh-scrape-webpage

> 抓取网页正文、结构、链接与关键词，可选下载内容图片并交给扩展分析器。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[7485af1](https://github.com/131CDA1/dsh-scrape-webpage/tree/7485af10c063579323058583c7f13e69c4c8bd21)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage) [![npm 30d 1,132](https://img.shields.io/static/v1?label=npm+30d&message=1%2C132&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage)
<!-- END META -->

**使用建议**：已有用户可保留正文抓取用途，先在公开测试页核对重定向、动态内容与超时；非 Windows 环境先验证 shell 回退，限制敏感网络目标。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：研究者读取具体网页时希望得到可引用正文与结构，原有办法是浏览器复制或宿主抓取工具。

代码仍为7485af1，变化来自目录或维护背景，本轮重写采用画像并收窄跨平台结论；与浏览器阅读相比主要减少结构整理步骤。

## 能力与限制

- **模型工具**：scrape_webpage。
- **后台**：scrape.imageAnalyzer 注册及顺序分析。

**流程与依赖**

抓取依赖网络与宿主服务，图片依赖工作区、shell 和可选视觉分析器；TLS 权限升级需 approval 和 Agent 上下文，失败后不能直接视作网页不存在。

输入URL获取正文与统计，必要时下载图片，人工检查原页与截断标记；TLS受限时按宿主审批重试，图片失败不冒充识图完成。

**兼容条件**

1.0.0 Host-only；tools、systemPrompt、timer 为硬依赖，shell 回退使用 Windows 风格 PowerShell 路径与命令，跨平台不能假定。

**效果与成本**

基础抓取有网络、超时和人工核对成本；图片分析另外消耗模型与存储。未测合格抓取率或单位成本。

- **思考**：分析器注册接口避免把视觉服务绑死，但自动提取并不证明正文完整或网页内容可信。

## 工程分析

- **亮点**：lib/index.js 优先宿主 web.fetch，缺失或异常后经 shell 调用 curl；解析与统计分层，图片逐张下载并调用注册分析器。

html、analyze 与执行层分开便于复用；图片失败返回逐项说明。web 与 shell 两条路径的策略一致性仍需实际验证。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：非浏览器渲染，动态页面和登录状态未验证；任意URL、重定向和图片下载需要部署方检查网络边界。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：对静态页、脚本页、重定向、内网和大正文分别比较原始页面，记录正文保留率、错误及人工修正时间。

**分析版本**

固定提交 [7485af1](https://github.com/131CDA1/dsh-scrape-webpage/tree/7485af10c063579323058583c7f13e69c4c8bd21)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 139 | — | — | 1522 |
| .js | source | 5 | 716 | 622 | 65 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/131CDA1/dsh-scrape-webpage/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
