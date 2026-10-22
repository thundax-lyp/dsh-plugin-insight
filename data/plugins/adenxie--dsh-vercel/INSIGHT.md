# dsh-vercel

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[21b3c73](https://github.com/AdenXie/dsh-vercel/tree/21b3c7372284ab53d10e61f2c717d44f752d9567)

<!-- BEGIN META -->
[![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adenxie/dsh-vercel)
<!-- END META -->

> **实现功能**：将Vercel官方MCP接入DSH，提供OAuth、按Agent限额加载工具及结果检索与管理界面。

> **核心亮点**：相对全量MCP注入，主要增量是目录搜索/加载预算、子Agent继承限制及保留宿主调用链；平台能力归Vercel，附带官方skills不计插件原创。

> **风险与缺陷**：字符压缩能否保持成功率和授权语义？精简schema及按需加载会增搜索回合；实测字符数不等于token/总费用节省。嵌套工具沿宿主执行接口，但本轮未验证宿主审批与策略实际拦截。

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

> **用途**：Agent执行Vercel项目查询与部署协作，大工具目录需控制提示开销且保持账号/项目范围。

全量MCP工具省加载步骤但占上下文；原生Vercel界面可完成任务，插件让Agent接入并增加治理成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：账号管理、目录搜索加载、已加载远程工具调用与结果控制。
- **Host 路由**：OAuth与连接状态管理。
- **界面**：Vercel连接管理页。
- **Skill**：随包上游Vercel开发技能，具体归属与许可独立。

**流程与依赖**

Vercel MCP/OAuth、DSH tools/agents/webServer、Node文件系统；官方skills另有执行前提。

授权并持久凭据，连接发现目录，搜索→加载→调用；结果进入受控缓存，断开清空目录及Agent限制。

**效果与成本**

OAuth和账号权限首次成本，持续Vercel服务/模型工具回合费用；字符节省不能直接承诺现金下降。

潜在减少全目录上下文压力，但外部任务完成率与账单收益未核实。

> **思考**：字符压缩能否保持成功率和授权语义？精简schema及按需加载会增搜索回合；实测字符数不等于token/总费用节省。嵌套工具沿宿主执行接口，但本轮未验证宿主审批与策略实际拦截。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对全量MCP注入，主要增量是目录搜索/加载预算、子Agent继承限制及保留宿主调用链；平台能力归Vercel，附带官方skills不计插件原创。

相对全量MCP注入，主要增量是目录搜索/加载预算、子Agent继承限制及保留宿主调用链；平台能力归Vercel，附带官方skills不计插件原创。

原子0600凭据写、state一次性结算、受限scope回退和嵌套dispatch可借鉴；依赖远端schema与宿主Agent生命周期。 源码依据：[src/index.ts](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/index.ts)、[src/mcp.ts](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/mcp.ts)、[src/oauth.ts](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/oauth.ts)、[src/store.ts](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/store.ts)、[src/scope.ts](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/scope.ts)、[src/routes.ts](https://github.com/AdenXie/dsh-vercel/blob/21b3c7372284ab53d10e61f2c717d44f752d9567/src/routes.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

字符压缩能否保持成功率和授权语义？精简schema及按需加载会增搜索回合；实测字符数不等于token/总费用节省。嵌套工具沿宿主执行接口，但本轮未验证宿主审批与策略实际拦截。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已有Vercel账户者从只读项目查询核查。先验证账号范围、断开清理及真实审批，再进入会改变部署的工具。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AdenXie/dsh-vercel](https://github.com/AdenXie/dsh-vercel)
- **版本号**：0.4.0（[固定提交 21b3c737](https://github.com/AdenXie/dsh-vercel/tree/21b3c7372284ab53d10e61f2c717d44f752d9567)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/mcp.ts、src/oauth.ts、src/store.ts、src/scope.ts、src/routes.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读src/index.ts、src/mcp.ts、src/oauth.ts、src/store.ts、src/scope.ts、src/routes.ts；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：构造只读、复杂schema、父子Agent、token刷新失败与撤权任务；总回合计费并核验宿主审批和最终项目ID。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由预算与已加载集合推导，可按任务阶段/失败信号自适应装载，并显示最终项目归属与调用预算收据。未验证；同任务比全量目录总token、成功率、越scope拒绝和额外回合，若成本转移抵消收益则否定。

构造只读、复杂schema、父子Agent、token刷新失败与撤权任务；总回合计费并核验宿主审批和最终项目ID。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：cb4b97d7d4a6886e316b138b68527b20c159aab1862a7e5d38d4284435107eff。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 163 | 22022 | — | — | 130212 |
| .js | source | 2 | 3078 | 2873 | 250 | — |
| .ts | source | 13 | 3281 | 2608 | 448 | — |
| .tsx | source | 1 | 196 | 164 | 12 | — |
| .mjs | test | 7 | 1218 | 1137 | 56 | — |

排除 11 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/AdenXie/dsh-vercel/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
