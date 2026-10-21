# harness-github

> 为 DSH 提供 GitHub PR、Issue、CI、发布读取与经审批的写操作工具。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[6bb9803](https://github.com/988hj7tczd-oss/harness-github/tree/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/harness-github) [![npm 30d 158](https://img.shields.io/static/v1?label=npm+30d&message=158&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/harness-github) [![首次发布 2026-08-23](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/harness-github)
<!-- END META -->

**使用建议**：已有GitHub流程的人先读公开仓库，再在临时repo试写；逐次核对审批对象和远端结果，提交/推送/合并应分别按团队规则处理。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：开发者在DSH处理PR/Issue/失败CI并准备可审代码变更，交付远端操作和可追溯结果；仍需独立review与CI验收。

- **建议**：待验证假设：写计划绑定目标repo/head与内容摘要，批准后复核并持久记录原操作ID，未知结果先查询，可减少TOCTOU和重试重复评论/提交。由连接器回退和多阶段pr_prepare推导，未实现完整事务。模拟已写响应丢失、批准后head变化、推送成功建PR失败，测重复与误对象；无查询证据时保留未知。

已有GitHub流程的人先读公开仓库，再在临时repo试写；逐次核对审批对象和远端结果，提交/推送/合并应分别按团队规则处理。

核查状态：源码支持连接器/审批路径；未认证GitHub、运行git或外部写入，不核实当前API端到端行为。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

参照gh CLI/REST脚本与常规研发工作流；不把GitHub功能归插件原创。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：GitHub读写、CI/review读取及PR准备工具。

**流程与依赖**

index注册读写工具，GitHubClient优先gh登录态再REST；tools-write统一requestApproval仅allowed-once放行，pr_prepare组合本地git检查/提交推送和PR流程，workflow提示引导。

DSH tools/approval、gh CLI或GITHUB_TOKEN、Git和GitHub API；本地repo状态与远端身份需匹配。

读取对象/反馈→确定方案→逐写审批→执行gh/REST→核结果；pr_prepare串行处理本地检查和远端PR，失败保留已发生步骤。

纯host跨profile声明，需gh或token做私有/写；审批服务缺失失败关闭。

**效果与成本**

首次登录/权限核对，持续API限额、CI等待、审批与结果复核；平台模型费用另计，工时未测。

减少工具切换，远端请求成功不等于代码可接受或CI验收通过。

- **思考**：统一审批是否足以避免错对象或重复写？批准 reason必须与最终repo/head/内容匹配，审批后远端head或本地工作区仍可能变化；gh失败自动REST回退需区分明确失败和已写但响应未知。PR准备含提交/推送多副作用，不是单事务，失败后不能当未发生重跑。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对Agent临时拼gh命令，增量是工具化常用PR/Issue/CI、统一连接器回退及写操作审批。GitHub/gh提供基础能力，插件不是新代码review算法；工作流指引与工具结果不等于质量保证。

相对Agent临时拼gh命令，增量是工具化常用PR/Issue/CI、统一连接器回退及写操作审批。GitHub/gh提供基础能力，插件不是新代码review算法；工作流指引与工具结果不等于质量保证。

requestApproval集中并只收allowed-once、固定argv进程调用与读写分层可借鉴；多阶段恢复与未知结果须明确。

固定源码依据：[index.js](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/index.js)、[lib/github.js](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/github.js)、[lib/tools-read.js](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/tools-read.js)、[lib/tools-write.js](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/tools-write.js)、[lib/workflow.js](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/lib/workflow.js)、[package.json](https://github.com/988hj7tczd-oss/harness-github/blob/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e/package.json)。

<a id="detail-section-5"></a>

### 主要限制

统一审批是否足以避免错对象或重复写？批准 reason必须与最终repo/head/内容匹配，审批后远端head或本地工作区仍可能变化；gh失败自动REST回退需区分明确失败和已写但响应未知。PR准备含提交/推送多副作用，不是单事务，失败后不能当未发生重跑。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.1.0；版本日期：2026-08-23（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[6bb9803f](https://github.com/988hj7tczd-oss/harness-github/tree/6bb9803f787b4ee4fa66f28fa8c889369ce28d2e)；本轮基准：2026-10-21T04:06:46Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：抽读index、github transport、读写工具和workflow；未运行gh/git/API，无独立可靠性证据。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

待验证假设：写计划绑定目标repo/head与内容摘要，批准后复核并持久记录原操作ID，未知结果先查询，可减少TOCTOU和重试重复评论/提交。由连接器回退和多阶段pr_prepare推导，未实现完整事务。模拟已写响应丢失、批准后head变化、推送成功建PR失败，测重复与误对象；无查询证据时保留未知。

隔离假transport/临时repo验证审批拒绝、永不审批策略、回退未知、head变化和部分PR流程；本轮不执行。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 504 | — | — | 5327 |
| .js | source | 5 | 2484 | 2129 | 246 | — |
| .mjs | source | 2 | 107 | 78 | 16 | — |
| .js | test | 6 | 935 | 808 | 63 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/harness-github/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
