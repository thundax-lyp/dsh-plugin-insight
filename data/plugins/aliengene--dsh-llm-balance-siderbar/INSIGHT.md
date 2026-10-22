# dsh-llm-balance-siderbar

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[b35aa1e](https://github.com/AlienGene/dsh-llm-balance-siderbar/tree/b35aa1e8501051ab3541cea2f43f0609b214f9a1)

<!-- BEGIN META -->
[![npm 30d 859](https://img.shields.io/static/v1?label=npm+30d&message=859&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-llm-balance) [![最新发布 2026-09-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-12&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-llm-balance)
<!-- END META -->

> **实现功能**：按已挂载模型路由查询余额或套餐额度，并在侧栏保留独立错误和陈旧状态。

> **核心亮点**：把异构余额/额度统一成可解释状态，并按宿主实际路由而非所有机器凭据探测，减少无关查询。不是通用计费或消费限制器。

> **风险与缺陷**：cache按probe.id而非route/credential身份，hostFor只选首个匹配route；多个相同provider不同key可能被同一快照标成都覆盖。凭据或route改动后TTL内还可显示旧账户值，影响“当前账户”判断。

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

> **用途**：多供应商用户判断当前模型路由的余额/额度状态，不能据此核算账单。

参照供应商控制台与单账户余额卡；增量是路由发现、分源缓存和明确unsupported占位。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **后台**：多来源余额/额度缓存探测
- **Host 路由**：/dsh-llm-balance/state
- **界面**：路由相关余额和额度侧栏

**流程与依赖**

自动仅探测已注册route匹配的provider；每source独立cache/inFlight/error，失败保留最后成功值并stale；GET/HEAD状态路由触发到期探测，客户端轮询展示。

webServer、llm路由/settings/credentials及DeepSeek/Moonshot/Kimi/OpenCode各查询协议；可显式sources绕过自动门。

枚举路由→匹配source/凭据→并行探测→成功缓存/失败标记→侧栏按当前选择展示→到期重试；无接口者不伪造0。

**效果与成本**

各供应商网络与账号权限、轮询延迟和接口维护；无模型生成调用，人工仍分清货币余额与周期quota。

异构数据的可见性和失败隔离明确，无实际预算改善或账单一致性验证。

> **思考**：cache按probe.id而非route/credential身份，hostFor只选首个匹配route；多个相同provider不同key可能被同一快照标成都覆盖。凭据或route改动后TTL内还可显示旧账户值，影响“当前账户”判断。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把异构余额/额度统一成可解释状态，并按宿主实际路由而非所有机器凭据探测，减少无关查询。不是通用计费或消费限制器。

把异构余额/额度统一成可解释状态，并按宿主实际路由而非所有机器凭据探测，减少无关查询。不是通用计费或消费限制器。

每源缓存/单飞、缺凭据与失败分开、unsupported占位避免静默消失；route仅限制方法，无本包请求授权，需宿主确认。

源码依据：[src/index.ts](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/index.ts)、[src/state.ts](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/state.ts)、[src/route.ts](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/route.ts)、[src/providers/deepseek.ts](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/providers/deepseek.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

cache按probe.id而非route/credential身份，hostFor只选首个匹配route；多个相同provider不同key可能被同一快照标成都覆盖。凭据或route改动后TTL内还可显示旧账户值，影响“当前账户”判断。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合路由较多且有额度查询接口者；先核账户匹配、来源新鲜度和外层路由授权。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AlienGene/dsh-llm-balance-siderbar](https://github.com/AlienGene/dsh-llm-balance-siderbar)
- **版本号**：0.7.1（[固定提交 b35aa1e8](https://github.com/AlienGene/dsh-llm-balance-siderbar/tree/b35aa1e8501051ab3541cea2f43f0609b214f9a1)）
- **版本日期**：2026-09-12（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/state.ts、src/route.ts、src/providers/deepseek.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：未来mock供应商核多路由凭据、stale/skip与超时，另核宿主信任栅栏；本轮未查真实余额。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：缓存键绑定route与非秘密账户指纹，凭据变更使快照失效，可避免多账户误归属。以两条同厂商不同key、换key、失败重试核每行来源与新鲜度；无法区分时明确单账户合并。

未来mock供应商核多路由凭据、stale/skip与超时，另核宿主信任栅栏；本轮未查真实余额。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：7f58de24f5df20171a706553cfdbe730f2b52f1a33048c49a6dc7604c38f17b8。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 10 | 3532 | 2908 | 668 | — |
| .md | source | 3 | 194 | — | — | 2188 |
| .mjs | source | 2 | 230 | 189 | 24 | — |
| .ts | source | 18 | 3033 | 2089 | 712 | — |
| .tsx | source | 2 | 835 | 714 | 62 | — |
| .mjs | test | 7 | 1624 | 1417 | 92 | — |

排除 10 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AlienGene/dsh-llm-balance-siderbar/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AlienGene/dsh-llm-balance-siderbar/issues?q=is%3Aissue+created%3A2026-09-21T08%3A00%3A19.627Z..2026-10-21T08%3A00%3A19.627Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AlienGene/dsh-llm-balance-siderbar/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A00%3A19.627Z..2026-10-21T08%3A00%3A19.627Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
