# DSH Literature

> 在 DSH 侧窗识别文献、抓取元数据、下载阅读 PDF 并管理本地文献库。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[fc6650e](https://github.com/Aik358/dsh-literature/tree/fc6650ef12747de08512d99c2f9c8388572b7724)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-literature) [![npm 30d 1,971](https://img.shields.io/static/v1?label=npm+30d&message=1%2C971&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-literature) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-literature)
<!-- END META -->

**使用建议**：需要会话旁阅读/归档可评估其设计；先修复并核对下载候选变量，再考虑核心全文流程，不依据作者一键/全文宣称直接采用。

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

- **用途**：研究者把对话中的标识符/标题转成可阅读归档条目，并将阅读问题送回当前会话；合格交付是标识、全文与引用对应正确。

- **建议**：把每条资料的标识、下载来源、PDF摘要和覆盖页段绑定到引用/问答输出，可减少“元数据正确但全文错误/未读全”的误归属。先以已知PDF和错误候选测试下载链，再对超长论文尾部问题要求明确未覆盖；若仍生成未见页码或引用错误，则不成立。

需要会话旁阅读/归档可评估其设计；先修复并核对下载候选变量，再考虑核心全文流程，不依据作者一键/全文宣称直接采用。

核查状态：识别/存储/阅读交接设计可核查；下载主路径存在静态可定位的未定义变量，实际效果未运行验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

浏览器检索+Zotero/PDF阅读器+手动粘贴；插件缩短入口距离，不替代事实查核。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：按需挂载literature查询/检索/引用/笔记/保存/图表等定义。
- **Host 路由**：文献识别、资料/批注/下载与阅读服务接口。
- **界面**：文献侧窗与PDF阅读/批注入口。
- **事件监听**：会话活动与文献意图触发按需工具挂载。

**流程与依赖**

Host注册路由和按需挂载的literature工具，pipeline连接标识解析、外部元数据与PDF来源；独立JSON shadow store保存条目、任务、批注，避免直接写Zotero内部库。AI阅读抽取PDF文本最多60000字符，经steer送入指定或最近会话；client提供文献/阅读侧窗。

DSH tools/systemPrompt/agents/webServer、外部Crossref/arXiv/OpenAlex等服务、PDF解析；Zotero/导出渠道可选。

识别标识→元数据→下载候选→本地保存→阅读/批注→选段或截断全文发会话→用户核对引用与答案；失败分类重试仍需人工，不自动证明全文已获取。

DSH Web bundle导出lib，src为开发原件；Node与Host工具/系统提示/回环webServer，PDF文本抽取及可选Zotero按实际配置另依赖。

**效果与成本**

现金：原宿主模型与外部元数据/下载网络，AI全文问答增加上下文；人工：匹配同名文献、下载失败、引用/页码和冲突合并复核。本地PDF/批注存储及升级迁移有维护成本。

减少复制标识、切软件和搬阅读内容的步骤；正确文献归属与完整阅读仍需独立核对。

- **思考**：一键落入全文库的核心路径是否成立？src/node/fetch/pdf.js的push闭包读取未声明trusted，且提交lib/index.js同样存在Boolean(trusted)；遇到非空候选URL时有ReferenceError风险，不能以源码/构建目录区别回避。即使修复，AI全文只截前60000字符且页码由模型概括，不能当完整论文核读；“本地”指转发/存储，不代表外部元数据与模型调用不联网。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：将文献发现、元数据、阅读与引用集中在会话旁，并把文献状态与Zotero内部schema隔离；工具按意图/面板启用减少无关上下文负担。增量是研究资料交接与本地库集成，不是文献正确性或AI阅读算法创新。

将文献发现、元数据、阅读与引用集中在会话旁，并把文献状态与Zotero内部schema隔离；工具按意图/面板启用减少无关上下文负担。增量是研究资料交接与本地库集成，不是文献正确性或AI阅读算法创新。

shadow store延迟持久化并在flush等待在途写，状态与Zotero分离减少schema冲突；AI源文加资料界限，HTTP限制loopback Host/远端地址。来源判断与下载缺陷表明工具丰富不等于闭环通过。

固定源码依据：[src/node/index.js](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/index.js)、[src/node/tools.js](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/tools.js)、[src/node/fetch/pdf.js](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/fetch/pdf.js)、[src/node/store/db.js](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/store/db.js)、[src/node/http.js](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/http.js)、[src/node/ai.js](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/ai.js)、[lib/index.js](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/lib/index.js)、[package.json](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/package.json)。

<a id="detail-section-5"></a>

### 主要限制

一键落入全文库的核心路径是否成立？src/node/fetch/pdf.js的push闭包读取未声明trusted，且提交lib/index.js同样存在Boolean(trusted)；遇到非空候选URL时有ReferenceError风险，不能以源码/构建目录区别回避。即使修复，AI全文只截前60000字符且页码由模型概括，不能当完整论文核读；“本地”指转发/存储，不代表外部元数据与模型调用不联网。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.3.6；版本日期：2026-09-17（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[fc6650ef](https://github.com/Aik358/dsh-literature/tree/fc6650ef12747de08512d99c2f9c8388572b7724)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根src/node入口、tools、PDF获取、shadow store、HTTP围栏与AI交接，另核lib/index.js对应缺陷；未审计全部reader/引用格式或执行构建。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

把每条资料的标识、下载来源、PDF摘要和覆盖页段绑定到引用/问答输出，可减少“元数据正确但全文错误/未读全”的误归属。先以已知PDF和错误候选测试下载链，再对超长论文尾部问题要求明确未覆盖；若仍生成未见页码或引用错误，则不成立。

未运行目标或下载。最小验证先用固定公开PDF的候选构建检查ReferenceError，再用同名异文献/超长尾部问题验证身份与覆盖范围。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 2330 | — | — | 29088 |
| .mjs | source | 7 | 1713 | 1331 | 228 | — |
| .js | source | 42 | 45420 | 40510 | 4437 | — |
| .cjs | source | 13 | 5611 | 4764 | 526 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/Aik358/dsh-literature/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=grey&logo=github&style=flat)](https://github.com/Aik358/dsh-literature/issues?q=is%3Aissue+created%3A2026-09-21T07%3A59%3A10.094Z..2026-10-21T07%3A59%3A10.094Z)

暂未获取：近30天关闭。

统计日期：2026-10-21。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
