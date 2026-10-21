# dsh-permissions

> 为DSH工具调用配置hard、deny、ask、allow权限规则，提供工作区作用域和可视化编辑。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[ad84f1d](https://github.com/940842546/dsh-permissions/tree/ad84f1d0928396a9597e557b6540f1f6feca2052)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/940842546/dsh-permissions) · [![npm 30d 606](https://img.shields.io/static/v1?label=npm+30d&message=606&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-permissions) · [![首次发布 2026-08-16](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-permissions)
<!-- END META -->

**使用建议**：适合将它作为宿主沙箱之上的附加规则层先试用。先测hard在never与异常时的行为，核对shell别名/等价操作，保留真正文件沙箱和最小权限。

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

- **用途**：团队需要在宿主既有沙箱上增加工具级规则，合格结果是匹配的敏感操作确实被拒绝，规则修改与审批有可审计边界。

- **建议**：由异常放行与硬规则承诺张力推导，可将hard判定做成最小fail-closed核，加载失败时拒绝相关写工具；ask/便利规则可单独降级。未验证假设是减少策略错误时漏放而不使无关读取不可用。注入设置/解析/审批异常并测敏感写是否被阻止，若仍放行则不成立。

适合将它作为宿主沙箱之上的附加规则层先试用。先测hard在never与异常时的行为，核对shell别名/等价操作，保留真正文件沙箱和最小权限。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

系统提示缺少执行阻断，OS/宿主沙箱边界更强；此插件补可视规则便利，不能替代后者。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **事件监听**：tools/pre-execute规则判定与自定义审批。
- **界面**：规则编辑、匹配试算和决策日志。
- **Host 路由**：权限规则与日志查询修改接口。

**流程与依赖**

依赖tools/pre-execute契约、工作区身份、可选approval与webServer；规则效果取决于工具参数语义和宿主其它策略，allow不授予额外沙箱权限。

管理员编辑并保存规则，执行前归并global/workspace，先匹配hard/deny再ask/allow，用户按需审批；错误会记录但当前仍继续宿主原链。

**效果与成本**

首次要设计规则与验证命中，日常审批打断、误拦截、例外和规则漂移有人工成本；未测保护覆盖或合法任务阻断率。

可降低常见误操作并让规则透明，未证明对恶意输入或全部敏感路径的防护能力。

- **思考**：hard是否在所有异常下仍有效？index.js最外catch记录engine-error后return next，工作区解析失败还会只用global；match按工具名称/原参数字符串，不能解析shell等价写法、符号链接或未枚举工具。因此正常匹配可阻断，不等于不可绕过的安全边界，异常放行是核心限制。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对只靠系统提示，增量是在真正工具执行链上增加可视规则判定，并将hard与会话never策略分开；这是可执行接线，不仅是提示承诺。但规则覆盖不是OS级隔离。

相对只靠系统提示，增量是在真正工具执行链上增加可视规则判定，并将hard与会话never策略分开；这是可执行接线，不仅是提示承诺。但规则覆盖不是OS级隔离。

匹配纯函数、作用域优先级、草稿保存与审计分离便于检查；catch后放行、字符串匹配和状态迁移是复用时必须显式处理的边界，不可把配置面板等同强制隔离。 源码依据：[lib/index.js](https://github.com/940842546/dsh-permissions/blob/ad84f1d0928396a9597e557b6540f1f6feca2052/lib/index.js)、[lib/match.js](https://github.com/940842546/dsh-permissions/blob/ad84f1d0928396a9597e557b6540f1f6feca2052/lib/match.js)、[lib/client.js](https://github.com/940842546/dsh-permissions/blob/ad84f1d0928396a9597e557b6540f1f6feca2052/lib/client.js)。

<a id="detail-section-5"></a>

### 主要限制

hard是否在所有异常下仍有效？index.js最外catch记录engine-error后return next，工作区解析失败还会只用global；match按工具名称/原参数字符串，不能解析shell等价写法、符号链接或未枚举工具。因此正常匹配可阻断，不等于不可绕过的安全边界，异常放行是核心限制。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[940842546/dsh-permissions](https://github.com/940842546/dsh-permissions)
- **版本号**：2.0.2（[固定提交 ad84f1d0](https://github.com/940842546/dsh-permissions/tree/ad84f1d0928396a9597e557b6540f1f6feca2052)）
- **版本日期**：2026-09-22（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/match.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：隔离profile对照hard/deny/ask/allow优先级、never、引擎异常、工作区解析失败、路径变体和shell等价命令，统计漏放与误拦。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由异常放行与硬规则承诺张力推导，可将hard判定做成最小fail-closed核，加载失败时拒绝相关写工具；ask/便利规则可单独降级。未验证假设是减少策略错误时漏放而不使无关读取不可用。注入设置/解析/审批异常并测敏感写是否被阻止，若仍放行则不成立。

隔离profile对照hard/deny/ask/allow优先级、never、引擎异常、工作区解析失败、路径变体和shell等价命令，统计漏放与误拦。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：9aa20c1f9faddc6e8a5d92e684e3f8687da7421d5e177850b1d0d722bbe8ef4d。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 291 | — | — | 2798 |
| .js | source | 3 | 1746 | 1645 | 58 | — |
| .mjs | test | 1 | 160 | 137 | 17 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/940842546/dsh-permissions/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/940842546/dsh-permissions/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/940842546/dsh-permissions/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
