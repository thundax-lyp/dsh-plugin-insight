# dsh-douyin-publish

> 把本地视频上传到抖音或B站投稿页并填写内容，默认私密且停在发布前。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[3413d53](https://github.com/7gzgn/dsh-douyin-publish/tree/3413d538e2b4a3384092c456c56f97862f787fed)

<!-- BEGIN META -->

<!-- END META -->

**使用建议**：适合固定抖音/B站工作流的创作者在非公开测试稿先检查。先用dryRun，再用draft逐字段核对视频与可见性；遇到发布结果不明时先去平台查状态，不重复发布。

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

- **用途**：已有成片和文案的创作者需要自动完成投稿准备，合格交付是正确视频、标题、话题和可见性均可回读；最终发布是独立且不可随意重试的动作。

- **建议**：由草稿终点与发布未知结果推导，可把准备结果固定为带内容摘要和平台草稿ID的回执，最终发布只引用该回执并先查询状态；相对重新跑整条上传链，可减少重复稿件。未验证。模拟点击发布后网络断开，要求恢复只查询而不重传；若不能准确绑定同一草稿则方案不成立。

适合固定抖音/B站工作流的创作者在非公开测试稿先检查。先用dryRun，再用draft逐字段核对视频与可见性；遇到发布结果不明时先去平台查状态，不重复发布。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

人工网页投稿可清楚确认最终状态但重复操作多；简单浏览器脚本通常缺少平台条件与保守默认值。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：douyin_upload执行分阶段投稿准备，默认draft/private。

**流程与依赖**

必要为ctx.browser、平台登录态与可访问投稿页；文件注入依赖页面容许相关请求，超大文件或限制时需Windows对话框；混音需ffmpeg。

核对参数与文件，打开投稿页并检查版式，递文件等待编辑态，填标题/文案/话题及可见性，默认停手供人工核对；显式publish才尝试发布，验证码交人。

**效果与成本**

首次需平台登录与浏览器服务，日常上传带宽/等待、DOM改版维护和人工核对；混音增加CPU与临时文件。模型和平台费用未计量，没有端到端人工耗时对照。

可能减少跨窗口选文件和填表工作，但内容创作、版权与最终发布判断仍在人，未证明合格投稿率或规模化稳定性。

- **思考**：“待发布”与“已发布”回执能否可靠区分？源码有draft与private保护、平台不支持的可见性会拒绝，这是有力支持；但页面选择器与成功迹象仍是外站可变信号，发布后超时不代表没发布，重新跑pipeline也不是既有草稿的事务提交。作者真机记录不能替代当前宿主验收。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对逐次系统对话框与手填表单，增量是将交文件、版式探测、填写和状态回执组成投稿准备链，并把默认终点设为人工发布前。文件注入和浏览器自动化是成熟手段，主要贡献在保守终点与分阶段验证的流程组合。

相对逐次系统对话框与手填表单，增量是将交文件、版式探测、填写和状态回执组成投稿准备链，并把默认终点设为人工发布前。文件注入和浏览器自动化是成熟手段，主要贡献在保守终点与分阶段验证的流程组合。

纯参数计划、平台档案、临时单文件服务和pipeline分离值得借鉴；数据回读强于仅记录点击。外站DOM、真实键盘与文件接收信号仍需维护，不能把工具ok当平台审核/发布已完成。 源码依据：[lib/plan.js](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/plan.js)、[lib/pipeline.js](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/pipeline.js)、[lib/serve.js](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/serve.js)、[lib/attach.js](https://github.com/7gzgn/dsh-douyin-publish/blob/3413d538e2b4a3384092c456c56f97862f787fed/lib/attach.js)。

<a id="detail-section-5"></a>

### 主要限制

“待发布”与“已发布”回执能否可靠区分？源码有draft与private保护、平台不支持的可见性会拒绝，这是有力支持；但页面选择器与成功迹象仍是外站可变信号，发布后超时不代表没发布，重新跑pipeline也不是既有草稿的事务提交。作者真机记录不能替代当前宿主验收。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[7gzgn/dsh-douyin-publish](https://github.com/7gzgn/dsh-douyin-publish)
- **版本号**：0.6.4（[固定提交 3413d538](https://github.com/7gzgn/dsh-douyin-publish/tree/3413d538e2b4a3384092c456c56f97862f787fed)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/plan.js、lib/pipeline.js、lib/serve.js、lib/attach.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：在临时测试账号仅做draft验收，检查不同input候选、旧草稿、可见性不支持、注入失败与超时。发布未知结果恢复需另行授权的固定测试，不以本轮执行宣称通过。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由草稿终点与发布未知结果推导，可把准备结果固定为带内容摘要和平台草稿ID的回执，最终发布只引用该回执并先查询状态；相对重新跑整条上传链，可减少重复稿件。未验证。模拟点击发布后网络断开，要求恢复只查询而不重传；若不能准确绑定同一草稿则方案不成立。

在临时测试账号仅做draft验收，检查不同input候选、旧草稿、可见性不支持、注入失败与超时。发布未知结果恢复需另行授权的固定测试，不以本轮执行宣称通过。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：c67c9d9a4d1210ad64f578f7733f05b027d71131a1d80f10fb2cd169699297ed。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 99 | 70 | 14 | — |
| .js | source | 10 | 2267 | 1653 | 496 | — |
| .md | source | 1 | 177 | — | — | 2675 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/7gzgn/dsh-douyin-publish/issues) 查看。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
