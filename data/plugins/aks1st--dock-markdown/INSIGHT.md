# dock-markdown

> 将Markdown净化渲染、目录与本地资源解析接入Dock。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[64cbfd8](https://github.com/AKS1st/dock-markdown/tree/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-markdown) · [![npm 30d 900](https://img.shields.io/static/v1?label=npm+30d&message=900&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-markdown) · [![首次发布 2026-08-23](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-markdown)
<!-- END META -->

**使用建议**：适合有限Markdown阅读；先确认editor依赖、资源来源与截断提示。

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

- **用途**：阅读工作区说明文档并跳转相关文件，必要时切换编辑器。

- **建议**：未验证假设：为每个资源展示最终来源根并对缺依赖/截断显式告警，可减少错误阅读。用同名资源多根、缺editor、大文档和失效链接核定位正确率及用户误读。

适合有限Markdown阅读；先确认editor依赖、资源来源与截断提示。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

参照marked、DOMPurify和IDE Markdown预览；增量是本地引用查找与Dock跳转。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：Markdown预览、目录与编辑切换
- **Host 路由**：/dock-markdown/resolve资源查找

**流程与依赖**

MarkdownView调用dock-editor的fs.read，以marked生成HTML再DOMPurify.sanitize；/resolve按文档目录、Git根、会话根查本地资源，图片内联data URL，链接workbench打开。

Dock/files、额外dock-editor读路由、宿主webServer/sessions/webRuntime和git可执行程序；marked/DOMPurify打包。

选择md→读取有限文本→净化HTML→异步解析相对图片/链接→目录导航或切编辑；mdx扩展不代表执行React。

**效果与成本**

三个扩展及git解析维护，全文HTML和base64图片增加内存，无模型token调用。

可降低文档跳转成本，未有阅读效率与安全独立验证。

- **思考**：文件读取实际依赖另一个插件路由，workbench/files注入成功不能证明文档可读。资源解析有意不限工作区，读取外部绝对资源是功能边界；继承editor截断意味着长文可能不完整，不能当全文审阅。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把文档目录、锚点、资源优先级和编辑切换整合成阅读工作流；渲染与净化归上游库，不是新Markdown方言。

把文档目录、锚点、资源优先级和编辑切换整合成阅读工作流；渲染与净化归上游库，不是新Markdown方言。

净化在渲染后执行、引用异步更新和目录slug处理有实质实现；资源读取权限须单独说明。

源码依据：[src/index.ts](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/src/index.ts)、[src/client/index.ts](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/src/client/index.ts)、[src/client/MarkdownView.tsx](https://github.com/AKS1st/dock-markdown/blob/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54/src/client/MarkdownView.tsx)。

<a id="detail-section-5"></a>

### 主要限制

文件读取实际依赖另一个插件路由，workbench/files注入成功不能证明文档可读。资源解析有意不限工作区，读取外部绝对资源是功能边界；继承editor截断意味着长文可能不完整，不能当全文审阅。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AKS1st/dock-markdown](https://github.com/AKS1st/dock-markdown)
- **版本号**：0.1.2（[固定提交 64cbfd89](https://github.com/AKS1st/dock-markdown/tree/64cbfd89b2e008ca3bd2c42a8f167e46ee7b3b54)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/client/index.ts、src/client/MarkdownView.tsx、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：隔离资料核净化样例、相对引用优先级、长文提示、缺依赖及链接打开目标；不把DOMPurify存在等同完整审计。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：为每个资源展示最终来源根并对缺依赖/截断显式告警，可减少错误阅读。用同名资源多根、缺editor、大文档和失效链接核定位正确率及用户误读。

隔离资料核净化样例、相对引用优先级、长文提示、缺依赖及链接打开目标；不把DOMPurify存在等同完整审计。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：da8358ce874f6c8643086fd514b81c1c98d1906b1276bb8251ec7b964245582b。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 4725 | 4179 | 565 | — |
| .md | source | 2 | 128 | — | — | 1374 |
| .ts | source | 5 | 849 | 495 | 281 | — |
| .tsx | source | 1 | 501 | 398 | 70 | — |
| .mjs | source | 1 | 52 | 38 | 12 | — |

排除 6 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AKS1st/dock-markdown/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
