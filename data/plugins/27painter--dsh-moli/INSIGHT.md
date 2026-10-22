# Moli 浏览器工具

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[b3a1fc9](https://github.com/27painter/dsh-moli/tree/b3a1fc970a513fa3ecd81830c8e0029334032e92)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/27painter/dsh-moli) [![npm 30d 1,514](https://img.shields.io/static/v1?label=npm+30d&message=1%2C514&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-moli) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-moli)
<!-- END META -->

> **实现功能**：通过本地 Moli 引擎渲染页面，读取选区并生成截图或 PDF。

> **核心亮点**：浏览器能力来自 lexmount/moli；插件的贡献是DSH工具契约、选择器读取、Windows文件捕获及引擎探测/安装的集成。选择器计数可区分“没有匹配”与正文为空，比直接把空输出当成功更清楚。

> **风险与缺陷**：能调用浏览器不证明网页可信或默认安全。index.js 默认 insecureTls=true；引擎独立下载，安装器默认没有预期校验和，记录其SHA只证明执行了哪些字节。作者选择器字符缩减示例不是同质量跨站收益验证。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
- [2 未来设计假设（未验证）](#detail-section-7)
- [3 辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要读取JS渲染网页、登录页面或保存页面图片的研究者；交付可读正文、选区文本或本地截图/PDF，静态页优先与普通HTTP抓取对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

参照为原生web_fetch和手工Moli CLI；浏览器内核与渲染归上游，插件适配增量单独评价。

注册 moli_fetch 与 moli_probe，查找本地 Moli 二进制，以子进程驱动渲染；selectorScript 将CSS选择器作为数据编码，返回匹配数与正文；二进制输出经临时文件保持字节。


Node>=20.12、本地Moli二进制及网络为必要；schemastery缺失时设置表单降级但工具仍注册。浏览器渲染、平台资源和引擎维护由上游承担；安装可下载并执行第三方安装器。

先probe确定路径和版本→必要时明确安装→fetch URL与输出格式→读取文本或本地文件→人工核对。抓取同步子进程和文件中转需留意宿主阻塞；安装路径另用异步进程和取消处理。

首次有引擎下载、证书/代理和磁盘配置成本；每次渲染比HTTP更耗CPU/内存，截图和PDF需要保存与清理。未测跨站总时长或现金成本。

将浏览器能力接到模型可提高动态网页可达性；是否节省整体阅读成本取决于选择器准确性和启动开销。

**能力**

- **模型工具**：moli_fetch 渲染抓取与 moli_probe 探测/显式安装。

> **思考**：能调用浏览器不证明网页可信或默认安全。index.js 默认 insecureTls=true；引擎独立下载，安装器默认没有预期校验和，记录其SHA只证明执行了哪些字节。作者选择器字符缩减示例不是同质量跨站收益验证。

<a id="detail-section-4"></a>

### 1.3 工程贡献

选择器JSON编码及文件方式保持图片字节可复用；移植要兼容Moli退出码和不同平台路径。同步runFetch设计可能影响宿主响应，需实测并发，不把安装异步等同抓取全异步。

插件1.1.19不含Moli引擎；配置与二进制各自升级，只有本轮固定插件源码被核查。

固定源码依据：[index.js L27–35](https://github.com/27painter/dsh-moli/blob/b3a1fc970a513fa3ecd81830c8e0029334032e92/index.js#L27-L35)；[lib/moli.js L69–90](https://github.com/27painter/dsh-moli/blob/b3a1fc970a513fa3ecd81830c8e0029334032e92/lib/moli.js#L69-L90)；[lib/install.js L14–20](https://github.com/27painter/dsh-moli/blob/b3a1fc970a513fa3ecd81830c8e0029334032e92/lib/install.js#L14-L20)。上述贡献与关键质疑均限定于这些固定源码，不把测试文件存在当运行通过。

> **亮点**：浏览器能力来自 lexmount/moli；插件的贡献是DSH工具契约、选择器读取、Windows文件捕获及引擎探测/安装的集成。选择器计数可区分“没有匹配”与正文为空，比直接把空输出当成功更清楚。

<a id="detail-section-5"></a>

### 1.4 使用建议

确需JS渲染时可在隔离环境先验证引擎；确认TLS策略和安装来源后再接真实账号，普通文章优先比较轻量HTTP路径。

核查状态：源码支持本文所述机制与有限集成贡献；效果、宿主兼容和独立采用未验证。未来设计假设仅为推演，未实现、未验证。 只执行研究工程的统计/装配与结构验证，未安装插件、运行目标代码/测试或做真实宿主验收。

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- 版本依据：仓库：[27painter/dsh-moli](https://github.com/27painter/dsh-moli)；固定提交：[b3a1fc97](https://github.com/27painter/dsh-moli/tree/b3a1fc970a513fa3ecd81830c8e0029334032e92)；版本号：1.1.19；版本日期：2026-10-19（固定提交日期，北京时间，非包发布日期）。
- 已检查与未覆盖范围：核查注册、默认配置、选择器/文件捕获与安装器；未下载引擎、运行浏览器或复现作者网络样本。
- 证据限制：作者功能摘要来自固定版本README；未核实独立用户采用、同条件效果或端到端收益。版本、证据原文与inventory绑定保存在本项JSON；GitHub/npm统计仅作背景，不构成采用证明。

<a id="detail-section-7"></a>

## 2 未来设计假设（未验证）

待验证假设：为抓取结果附“引擎版本、TLS校验状态、匹配数、最终URL”形成小型获取回执，能让下游先判断证据来源再作摘要。由当前有探测/匹配计数却缺统一可信性输出推导；新增负担是维护引擎接口映射。

最小验证与否定条件：在受控静态页和SPA各取相同事实，对照HTTP和Moli；测试无匹配、证书错误、引擎缺失与截图PNG完整性。若选择器漏关键内容或关闭TLS校验仍被当作可信取证，则不能认可研究收益。

<a id="detail-section-8"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 2756 | 1810 | 846 | — |
| .md | source | 2 | 1156 | — | — | 12651 |
| .mjs | source | 14 | 1908 | 1390 | 405 | — |

排除 0 项；解析错误 0 项。统计为固定Git范围，源码抽读不冒充全面审计；JS/TS与Markdown分别计量。默认排除为启发式，不能从LOC推算原创量或工时。

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/27painter/dsh-moli/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
