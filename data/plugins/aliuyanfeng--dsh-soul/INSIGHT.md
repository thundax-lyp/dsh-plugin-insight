# dsh-soul

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[17e6624](https://github.com/Aliuyanfeng/dsh-soul/tree/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Aliuyanfeng/dsh-soul) [![npm 30d 2,373](https://img.shields.io/static/v1?label=npm+30d&message=2%2C373&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-soul) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-soul)
<!-- END META -->

> **实现功能**：管理分层人设配置、提示词注入、变更历史及带确认的人设修改。

> **核心亮点**：将人设从散落文本改为有来源、作用域、预览和变更历史的配置流程，工具变更区分批准/拒绝/不可用。贡献在状态管理与交接，不是可持续自演化人格。

> **风险与缺陷**：会话覆盖缓存未命中时先按上层配置装配、后台读盘下一轮生效，首次实际人设可能不同于用户预期。审计在配置成功后独立写，workspaces不进字段审计/哈希，回滚不能称所有作用域完整事务恢复；送达也不等于模型遵守。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户按全局、工作区或会话设置回复风格，并检查当前真正注入的配置。

参照手写系统提示与宿主配置；增量是作用域解析、可预览的人设编译、变更审计及确认入口；不实现模型个性学习。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：set_persona受确认的人设修改
- **用户命令**：/soul配置与预设管理
- **后台**：系统提示装配、作用域缓存与历史持久化
- **Host 路由**：人设/历史/作用域管理
- **界面**：人设设置、预览和时间线

**流程与依赖**

systemPrompt同步text provider取单份配置快照，Global→Workspace→Session合并；活动会话另注入生产者自持snapshot；串行写队列原子保存配置，历史JSONL尽力追加。set_persona走宿主审批或文本确认。

宿主systemPrompt、tools/commands、approval和会话/workspace服务及客户端slot；模型遵循人设是效果依赖，不由配置代码保证。

编辑/选预设→校验/预览→保存或工具提议确认→写配置→记录历史→刷新注入→查看送达；撤销一条及以后改动，损坏文件保留并拒普通覆盖。

**效果与成本**

配置/作用域和历史维护、提示额外token与人工审阅；跨进程并发不是进程内写队列能完全解决，审计失败有告警但配置仍成功。

配置可观测性有实现，无风格遵循率、幻觉或效率改善验证。

> **思考**：会话覆盖缓存未命中时先按上层配置装配、后台读盘下一轮生效，首次实际人设可能不同于用户预期。审计在配置成功后独立写，workspaces不进字段审计/哈希，回滚不能称所有作用域完整事务恢复；送达也不等于模型遵守。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将人设从散落文本改为有来源、作用域、预览和变更历史的配置流程，工具变更区分批准/拒绝/不可用。贡献在状态管理与交接，不是可持续自演化人格。

将人设从散落文本改为有来源、作用域、预览和变更历史的配置流程，工具变更区分批准/拒绝/不可用。贡献在状态管理与交接，不是可持续自演化人格。

interpolate:false防用户模板语法破坏装配，配置失败不静默默认覆盖、同步单快照和注入来源格式可借鉴；人设预设不冒充Agent/Preset注册。

源码依据：[index.mjs](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/index.mjs)、[lib/injection.mjs](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/lib/injection.mjs)、[lib/store.mjs](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/lib/store.mjs)、[lib/history.mjs](https://github.com/Aliuyanfeng/dsh-soul/blob/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0/lib/history.mjs)。

<a id="detail-section-5"></a>

### 1.4 主要限制

会话覆盖缓存未命中时先按上层配置装配、后台读盘下一轮生效，首次实际人设可能不同于用户预期。审计在配置成功后独立写，workspaces不进字段审计/哈希，回滚不能称所有作用域完整事务恢复；送达也不等于模型遵守。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合显式风格管理；先核作用域和实际注入，重要规则仍由宿主权限和验收保障。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[Aliuyanfeng/dsh-soul](https://github.com/Aliuyanfeng/dsh-soul)
- **版本号**：0.9.0（[固定提交 17e6624e](https://github.com/Aliuyanfeng/dsh-soul/tree/17e6624ea5d3f3bd9b077eb4aaca8c0cfe9455f0)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

- 已检查：index.mjs、lib/injection.mjs、lib/store.mjs、lib/history.mjs、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：未来固定宿主核首轮覆盖、审批降级、并发写/历史失败和模型遵循；本轮未修改人设或注入消息。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：将首轮作用域加载作为明确就绪条件，并给每轮可审计配置摘要，可减少“保存了却没生效”的歧义。以新会话、冷缓存、工作区覆盖、审计失败核实际system文本及回滚范围；不能对齐则不标已生效。

未来固定宿主核首轮覆盖、审批降级、并发写/历史失败和模型遵循；本轮未修改人设或注入消息。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：07320c535e365623ca8d09bbfd3b44c29e9fe2d543c3a0c92d88536e7c436da8。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 23 | 26357 | 18436 | 6137 | — |
| .md | source | 9 | 3439 | — | — | 80903 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/Aliuyanfeng/dsh-soul/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
