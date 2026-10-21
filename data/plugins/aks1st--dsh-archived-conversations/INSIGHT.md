# dsh-archived-conversations

> 在设置页列出归档会话并提供最小只读文本预览。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[cb1afc3](https://github.com/AKS1st/dsh-archived-conversations/tree/cb1afc38e44c58da2d3e50954b83430cac6e1c12)

<!-- BEGIN META -->
[![npm 30d 814](https://img.shields.io/static/v1?label=npm+30d&message=814&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-archived-conversations) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-archived-conversations)
<!-- END META -->

**使用建议**：用于本机归档摘要；确认片段不足以替代全文证据，远程使用需另设计授权。

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

- **用途**：找回已归档对话的大意，不能用来恢复或继续原会话。

- **建议**：未验证假设：sessionQuery提供末尾有界读取与预览摘要缓存可降低大归档耗时，同时维持成员校验。用大小不同归档、取消归档并发和远程请求比较延迟/错误暴露。

用于本机归档摘要；确认片段不足以替代全文证据，远程使用需另设计授权。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

参照宿主归档列表与直接读日志；项目增量是设置入口与最小化预览路由。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：归档设置列表与只读预览
- **Host 路由**：归档会话最小预览

**流程与依赖**

客户端使用标准useSessions/useWorkspaces列归档ID，主机先核workspaceRegistry归档成员，再用sessionQuery读记录，仅抽最近6条真实user/assistant文本，每条400字符。

webServer硬依赖，workspaceRegistry/sessionQuery运行时可用性另核；客户端settings.section与标准hooks。

设置页列归档→点击ID→路由核loopback与归档成员→抽文本→显示预览；不改变会话归档状态。

**效果与成本**

无模型调用；全日志读取与客户端列表成本随历史增长，宿主事件结构升级需维护。

便于回忆历史，未证明检索效率提升，不是完整历史搜索。

- **思考**：返回上限不代表读取成本上限：readSession先获得全部events再遍历，大归档仍可能昂贵。loopback限定会阻止远程Web使用；不能将“当前无取消归档API”的作者版本说明泛化为宿主永久限制。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：以归档成员验证和文本最小返回实现有界可见性，跳过工具/推理及注入上下文，比整份日志暴露更克制。

以归档成员验证和文本最小返回实现有界可见性，跳过工具/推理及注入上下文，比整份日志暴露更克制。

固定错误文本、no-store、loopback Host/来源/成员多层检查与显式截断，接口范围清楚。

源码依据：[src/index.ts](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/index.ts)、[src/client/index.js](https://github.com/AKS1st/dsh-archived-conversations/blob/cb1afc38e44c58da2d3e50954b83430cac6e1c12/src/client/index.js)。

<a id="detail-section-5"></a>

### 主要限制

返回上限不代表读取成本上限：readSession先获得全部events再遍历，大归档仍可能昂贵。loopback限定会阻止远程Web使用；不能将“当前无取消归档API”的作者版本说明泛化为宿主永久限制。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AKS1st/dsh-archived-conversations](https://github.com/AKS1st/dsh-archived-conversations)
- **版本号**：0.3.2（[固定提交 cb1afc38](https://github.com/AKS1st/dsh-archived-conversations/tree/cb1afc38e44c58da2d3e50954b83430cac6e1c12)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/client/index.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：核非归档ID拒绝、注入消息排除、大日志成本与列表切换旧响应；本轮未读真实会话。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：sessionQuery提供末尾有界读取与预览摘要缓存可降低大归档耗时，同时维持成员校验。用大小不同归档、取消归档并发和远程请求比较延迟/错误暴露。

核非归档ID拒绝、注入消息排除、大日志成本与列表切换旧响应；本轮未读真实会话。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：10cef269733a1c157178c9031c906ec9c2b96f95ceab6fb6bdbee1c390ad39d0。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 987 | 779 | 196 | — |
| .md | source | 1 | 70 | — | — | 1007 |
| .ts | source | 1 | 270 | 188 | 64 | — |
| .ts | test | 1 | 72 | 65 | 3 | — |
| .mjs | source | 1 | 30 | 29 | 0 | — |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AKS1st/dsh-archived-conversations/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
