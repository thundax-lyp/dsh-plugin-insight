# dsh-weekly-panel

> 在 DSH 侧栏展示插件周榜、免费模型状态和标明来源性质的推荐位。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[5ee6b1d](https://github.com/514006234/dsh-weekly-check/tree/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel)

<!-- BEGIN META -->

<!-- END META -->

**使用建议**：想在DSH里查看中文榜单可先试只读面板；看清数据日期与赞助/互推标识，复制安装命令后仍要检查插件自身要求。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、流程与依赖](#detail-section-3)
  - [效果、成本与限制](#detail-section-4)
  - [核心贡献与工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

希望在DSH内浏览中文插件榜的用户，读取TOP10和免费模型摘要，并复制原生bundle安装命令；判断选型仍需回到项目与核查材料。

参照浏览器周报、通用侧栏数据面板；原始策展及模型探测不计入组件的原创贡献。

<a id="detail-section-3"></a>

### 能力、流程与依赖

packages/dsh-weekly-panel/lib/index.js通过唯一HTTPS上游、10秒超时、30分钟内存缓存和singleflight提供GET数据；client注册main与sidebar.panellist槽位，渲染榜单并复制命令。

- **Host 路由**：GET周榜数据及上游缓存降级。
- **界面**：main面板、侧栏入口和原生bundle命令复制。

DSH webServer及客户端槽位、公开latest.json结构与GitHub Pages可达性；无本地数据写入链路。

点击周榜→同源GET→缓存或上游读取→摘要/TOP10/模型与推荐位→复制命令或打开原文；上游失败显示旧值/原因与重试。

子包bundle与client双入口，依赖DSH webServer和main/sidebar槽位；README的桌面部署工具是仓库级额外步骤，不能把根仓库直接安装当作本组件安装。

<a id="detail-section-4"></a>

### 效果、成本与限制

减少寻找榜单与拼接命令的操作；不替代源码评估、安全核查或本机模型测试。

首次确定子包安装方式并重启宿主；持续依赖公开Pages数据与接口，故障时人工确认缓存日期。无独立订阅成本证据，节省阅读时间未测。

“免费模型可用”和“值得装”是否会被读者理解为本机可用与质量保证？面板只消费latest.json，不执行本地模型或插件验收；缓存30分钟叠加周报更新周期，会使成功读取仍展示旧状态。star排序、赞助位与模型极短补全都不证明本地长期可靠，复制命令也不是已安装。

<a id="detail-section-5"></a>

### 核心贡献与工程亮点

相对打开外部周报页面，本组件把中文榜单与安装命令复制放入DSH流内面板，并对上游不可用保留带stale标记的缓存。loopback防护与槽位写法作者归于dsh-workbench-lite，周报的策展与模型探测属于仓库其他工具；本组件增量是单上游数据桥、面板展示与降级。

createStore注入fetch与时钟便于隔离验证，inflight合并并发、失败保留旧缓存并标stale；出站地址常量化且不转发凭据可借鉴。大小限制在res.text后检查，不等于下载阶段硬内存上限。

源码依据：[packages/dsh-weekly-panel/lib/index.js](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/index.js)、[packages/dsh-weekly-panel/lib/client.js](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/lib/client.js)、[packages/dsh-weekly-panel/tools/gate.mjs](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/tools/gate.mjs)、[packages/dsh-weekly-panel/package.json](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/package.json)、[packages/dsh-weekly-panel/README.md](https://github.com/514006234/dsh-weekly-check/blob/5ee6b1d8aa90a1dab83c30db96838482331db304/packages/dsh-weekly-panel/README.md)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：希望在DSH内浏览中文插件榜的用户，读取TOP10和免费模型摘要，并复制原生bundle安装命令；判断选型仍需回到项目与核查材料。

- **建议**：待验证假设：每个条目附固定版本、探测出口地区和数据年龄的小型证据卡，可降低从榜单热度直接推导本机可用的误判。当前只有摘要与stale信息，新增卡片未实现。用同一榜单让用户判断安装前置条件，对照有无卡片的误判率与阅读耗时；若字段缺失导致卡片装饰化，则先要求上游提供可追溯探测记录。

想在DSH里查看中文榜单可先试只读面板；看清数据日期与赞助/互推标识，复制安装命令后仍要检查插件自身要求。

**核查状态**：已抽读固定版本源码，未安装、运行目标插件或真实宿主验收。源码支持只读数据面板与缓存降级；榜单上游模型测试和作者宿主验证没有在本轮复现，未来证据卡是假设。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **Host 路由**：GET周榜数据及上游缓存降级。
- **界面**：main面板、侧栏入口和原生bundle命令复制。

- **思考**：“免费模型可用”和“值得装”是否会被读者理解为本机可用与质量保证？面板只消费latest.json，不执行本地模型或插件验收；缓存30分钟叠加周报更新周期，会使成功读取仍展示旧状态。star排序、赞助位与模型极短补全都不证明本地长期可靠，复制命令也不是已安装。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：相对打开外部周报页面，本组件把中文榜单与安装命令复制放入DSH流内面板，并对上游不可用保留带stale标记的缓存。loopback防护与槽位写法作者归于dsh-workbench-lite，周报的策展与模型探测属于仓库其他工具；本组件增量是单上游数据桥、面板展示与降级。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- 版本号：0.6.0；版本日期：2026-10-19（固定提交日期，北京时间；不是包发布日期）。
- 固定版本：[5ee6b1d8](https://github.com/514006234/dsh-weekly-check/tree/5ee6b1d8aa90a1dab83c30db96838482331db304)；本次截止 2026-10-21T03:00:27Z。
- 已检查：README、package与以上源码路径及固定组件统计。
- 未执行：目标代码、目标测试、安装、真实宿主或第三方服务验证。
- 范围限制：只检查packages/dsh-weekly-panel的host/client/manifest与自检源码；上游榜单生成、免费模型探测与外部服务未执行。
- 证据边界：源码与作者说明不等于独立效果验证；GitHub/npm指标不证明采用或收益。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：packages/dsh-weekly-panel；内容摘要：2eb366af15e4bcd05aa833a47a2c3719450eabb50dc82e6d49c134ac3ccd095c。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 863 | 647 | 168 | — |
| .md | source | 1 | 95 | — | — | 1643 |
| .mjs | source | 3 | 1017 | 849 | 86 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：每个条目附固定版本、探测出口地区和数据年龄的小型证据卡，可降低从榜单热度直接推导本机可用的误判。当前只有摘要与stale信息，新增卡片未实现。用同一榜单让用户判断安装前置条件，对照有无卡片的误判率与阅读耗时；若字段缺失导致卡片装饰化，则先要求上游提供可追溯探测记录。

隔离宿主检查缓存过期+上游失败时日期/标识、畸形字段降级、窄屏与剪贴板失败，以及子包安装后槽位存在；未执行目标自检。

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/514006234/dsh-weekly-check/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
