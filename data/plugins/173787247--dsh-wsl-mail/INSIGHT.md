# dsh-wsl-mail

> 通过notmuch或himalaya读取邮件列表、未读统计与搜索结果。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[455e0ea](https://github.com/173787247/dsh-wsl-mail/tree/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-mail)
<!-- END META -->

**使用建议**：先核对返回backend和note；使用himalaya时把结果理解为最近收件箱列表。

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

已有贡献：把两个邮件CLI整合到DSH的只读接口，降低检索入口切换；不提供发送或完整邮件工作流。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：Agent需要查看本地邮件索引或收件箱摘要，减少手工搬运主题与发件人。

- **建议**：本次未形成新的创新假设；优先显式区分未读总量与最近邮件样本，避免错误摘要影响优先级。

采用建议：先核对返回backend和note；使用himalaya时把结果理解为最近收件箱列表。

邮件客户端和原生CLI查询；插件便于只读取数，不替代索引维护。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：邮件后端状态、未读/收件箱摘要、列表与notmuch搜索。

**流程与依赖**

需要已配置的notmuch索引或himalaya账号；邮件同步与认证由外部工具维护。

先查后端可用性，再读摘要或指定查询，重要邮件回原客户端确认。

**效果与成本**

邮件同步、索引和敏感摘要上下文成本为主，无处理效率或完整率实测。

把两个邮件CLI整合到DSH的只读接口，降低检索入口切换；不提供发送或完整邮件工作流。 himalaya回退没有未读过滤，count来自最近收件箱样本；不能把mail_unread工具名当作未读总数语义。

- **思考**：himalaya回退没有未读过滤，count来自最近收件箱样本；不能把mail_unread工具名当作未读总数语义。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把两个邮件CLI整合到DSH的只读接口，降低检索入口切换；不提供发送或完整邮件工作流。

把两个邮件CLI整合到DSH的只读接口，降低检索入口切换；不提供发送或完整邮件工作流。

后端选择与固定命令参数可复用；回退状态应在结构字段中表达而非只靠说明文字。

<a id="detail-section-5"></a>

### 主要限制

himalaya回退没有未读过滤，count来自最近收件箱样本；不能把mail_unread工具名当作未读总数语义。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/mail.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读入口与邮件查询实现，未访问邮箱或读取用户邮件。 固定checkout的注册候选与关键主张定向抽读；未逐行完整审阅全部源码、测试、依赖及外部参照，未运行目标代码。评分仅针对文中明确的CLI/API/人工流程参照；跨场景迁移为解释性判断。
- 下一步：构造已读和未读混合收件箱，对照notmuch与himalaya两条路径，核对总数、条数和陈旧索引。

**分析版本**

- **仓库**：[173787247/dsh-wsl-mail](https://github.com/173787247/dsh-wsl-mail)
- **版本号**：0.1.1（[固定提交 455e0ea](https://github.com/173787247/dsh-wsl-mail/tree/455e0eaa31a3aaca2f21b4b91ad588c1419a6abc)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

本次未形成新的创新假设；优先显式区分未读总量与最近邮件样本，避免错误摘要影响优先级。

构造已读和未读混合收件箱，对照notmuch与himalaya两条路径，核对总数、条数和陈旧索引。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 115 | — | — | 460 |
| .js | source | 2 | 263 | 246 | 3 | — |
| .js | test | 1 | 6 | 6 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-mail/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
