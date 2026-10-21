# dsh-workspace-tools

> 为工作区保存Agent和权限默认预设，并在新根会话创建时自动应用。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[d370852](https://github.com/AHIOSUZ/dsh-workspace-tools/tree/d370852671425f09909862a7d220f7b0538f2f3c)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/AHIOSUZ/dsh-workspace-tools)
<!-- END META -->

**使用建议**：适合工作区信任稳定的用户先用保守权限测试。新建立即运行和手动改选时核对持久会话最终值，不把自动默认当授权审核。

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

- **用途**：在不同项目间重复切换预设的用户，希望减少每次设置；合格结果是只影响正确新会话，人工选择优先且权限默认符合项目信任。

- **建议**：由异步双预设应用推导，可让宿主创建时携带原子默认计划，应用前后版本检查并在人手选后取消自动任务。未验证；注入慢select与立即首轮/手选，若自动值仍覆盖选择则否定。

适合工作区信任稳定的用户先用保守权限测试。新建立即运行和手动改选时核对持久会话最终值，不把自动默认当授权审核。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

手工选预设最直接；插件是便利默认，而非安全策略替代。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **事件监听**：agent/created匹配并应用工作区默认。
- **界面**：工作区默认预设设置页。

**流程与依赖**

workspaceRegistry、agentPresets、permissionPresets、turnBoundary与settings；效果依赖目标预设能成功挂载。

用户保存工作区规则，新root发布后匹配并切预设；失败日志提示，既有会话不主动改变，后续人工值应优先。

**效果与成本**

初始配置每工作区，持续维护预设/工作区移动和权限复核；节省重复点击未测，误用高权限默认的代价需考虑。

减少重复选择，不能保证项目代码可信或防止权限扩大。

- **思考**：创建后异步切换是否必定先于第一轮和手选？监听void applyRule，Agent切换await后再改权限；源码检查已有turn发生在应用前，执行期间的首轮/用户选择存在时序待验。normalizePath还统一大小写，非Windows大小写敏感路径需检查，不能由ID主路径推断所有fallback正确。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对全局同一默认值，增量是项目上下文默认化，采用官方服务并保留后续手动选择。不是新权限引擎，权限实际语义归宿主。

相对全局同一默认值，增量是项目上下文默认化，采用官方服务并保留后续手动选择。不是新权限引擎，权限实际语义归宿主。

稳定ID优先、已开始/子会话跳过和失败日志可借鉴；Agent/权限两段非事务，路径fallback与异步时序是维护重点。 源码依据：[src/index.js](https://github.com/AHIOSUZ/dsh-workspace-tools/blob/d370852671425f09909862a7d220f7b0538f2f3c/src/index.js)。

<a id="detail-section-5"></a>

### 主要限制

创建后异步切换是否必定先于第一轮和手选？监听void applyRule，Agent切换await后再改权限；源码检查已有turn发生在应用前，执行期间的首轮/用户选择存在时序待验。normalizePath还统一大小写，非Windows大小写敏感路径需检查，不能由ID主路径推断所有fallback正确。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AHIOSUZ/dsh-workspace-tools](https://github.com/AHIOSUZ/dsh-workspace-tools)
- **版本号**：0.4.6（[固定提交 d3708526](https://github.com/AHIOSUZ/dsh-workspace-tools/tree/d370852671425f09909862a7d220f7b0538f2f3c)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读src/index.js；未覆盖全部参考/界面分支与真实并发宿主行为，未运行目标代码、外部工具或安装验收。
- 下一步：隔离会话验证子目录/移除工作区、大小写路径、慢切换、第一轮竞态与人工改选，核对日志和持久最终值。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由异步双预设应用推导，可让宿主创建时携带原子默认计划，应用前后版本检查并在人手选后取消自动任务。未验证；注入慢select与立即首轮/手选，若自动值仍覆盖选择则否定。

隔离会话验证子目录/移除工作区、大小写路径、慢切换、第一轮竞态与人工改选，核对日志和持久最终值。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：f2cd00ac0cccb7a6ae6ae62490d9524e946453b1c857c025b62bc61df4a8d8d2。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 896 | 804 | 83 | — |
| .md | source | 2 | 148 | — | — | 2010 |
| .mjs | source | 3 | 227 | 196 | 14 | — |

排除 0 项，解析错误 194 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AHIOSUZ/dsh-workspace-tools/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
