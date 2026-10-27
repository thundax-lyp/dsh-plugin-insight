# DSH Plugin Insight [![已研究 576](https://img.shields.io/static/v1?label=%E5%B7%B2%E7%A0%94%E7%A9%B6&message=576&color=766494&style=flat&labelColor=555555&logoColor=white)](data/views/categories/INDEX.md)

按 DSH 使用场景查找插件与相关工具，了解用途、使用条件和核查结果。

[推荐尝试](data/views/columns/RECOMMENDED.md) · [最近发布](data/views/columns/LATEST.md) · [下载热门](data/views/columns/HOT.md) · [按场景查找](data/views/categories/INDEX.md)

<img src="assets/dsh-plugin-insight-banner.png" alt="DSH Plugin Insight" width="240">

## [推荐尝试](data/views/columns/RECOMMENDED.md)

> 看看插件能解决什么问题，以及试用前需要确认什么。

- **[Answer me with HTML](data/plugins/qingyuna--answer-me-with-html/INSIGHT.md)**｜将Agent撰写的扩展Markdown转换为含图表的单文件HTML页面，并提供可选视频输出。

    **推荐理由**：需要交付协议解释或多维比较页面的Agent用户可用已核实短稿试生成单文件HTML。相比手写HTML，源码支持将布局和图坐标交给CLI，作者节时结果尚未在当前任务复现。若图形误导、渲染反复失败或纠错慢于Markdown，应关闭自动附页并退回原草稿。

    **试用条件**：需要在协议或方案比较中交付单页材料的用户，可先选一份已有答案的短稿试渲染，并逐个核对图形关系与原文。若组件错误、图形误导或纠错时间超过直接Markdown，停止自动附页并回到原草稿；敏感文件不因可内联就自动加入输出。视频仅在明确请求且成本可接受时另试。 依据 [Q09](data/plugins/qingyuna--answer-me-with-html/INSIGHT.md#research-q09)。

    [查看完整分析](data/plugins/qingyuna--answer-me-with-html/INSIGHT.md)

- **[no-ai-style](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)**｜提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。

    **推荐理由**：适合保留原文、由作者复核的写作流程试用；flags/锚点相同不等语义或原创认证，真实证据需独立核。

    **试用条件**：作者留原文并逐命题复核的可控范围试用，先audit再授权编辑。详见[Q05](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md#research-q05)。

    [查看完整分析](data/plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)

- **[dsh-plugin-veriscope](data/plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)**｜重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。

    **推荐理由**：已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。

    **试用条件**：可信逐条分数可试用builtin，原replay固定环境，PASS不直接授权发布。详见[Q06](data/plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md#research-q06)。

    [查看完整分析](data/plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)

- **[dsh-markdown-live](data/plugins/9426haruka--dsh-markdown-live/INSIGHT.md)**｜在 DSH 输入框实时着色/成形 Markdown，并让已发送用户文本复用宿主 Markdown 渲染器。

    **推荐理由**：Markdown重度用户可在固定样本上试用其显示层增强，前提是先验证发送字节、IME和撤销不变。

    **试用条件**：经常写 Markdown 且能接受表格/图片限制的 DSH Desktop 用户可在非关键草稿试用；先复制带中英混排、列表、链接和代码围栏的固定样本，校验发送前后字节与撤销。依赖无障碍输入、超长文档或宿主版本频繁升级的人应先观察。 详见[Q09](data/plugins/9426haruka--dsh-markdown-live/INSIGHT.md#research-q09)。

    [查看完整分析](data/plugins/9426haruka--dsh-markdown-live/INSIGHT.md)

- **[dsh-nav-history](data/plugins/ahacrazy--dsh-nav-history/INSIGHT.md)**｜为 DSH 会话与整页面板提供后退、前进、历史底栏和本地持久化。

    **推荐理由**：适合频繁跨会话面板的人先核对交错导航与持久化后试用，接受历史记录可能失效及不恢复滚动的边界。

    **试用条件**：先用普通会话和面板交错导航，检查后退后新访问的分支截断、重载和失效目标；只把它当主视图位置入口。记录不稳定时回侧栏手动查找。[Q03](data/plugins/ahacrazy--dsh-nav-history/INSIGHT.md#research-q03)

    [查看完整分析](data/plugins/ahacrazy--dsh-nav-history/INSIGHT.md)

## [最近发布](data/views/columns/LATEST.md)

> 查看最近发布的版本，了解用途和使用条件。

- [dsh-web-all](data/plugins/zhu1090093659--dsh-web--packages-dsh-web-all/INSIGHT.md) · 聚合安装 dsh-web 家族功能插件，并提供可选的界面兼容与响应式补丁层。 · [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-web-all)
- [dsh-model-everything](data/plugins/amethystluna--dsh-model-everything/INSIGHT.md) · 把设计和代码断言建成模型，执行验证、图审查和前后报告比较。 · [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-model-everything)
- [DSH Task Board](data/plugins/zhu1090093659--dsh-web--packages-dsh-task-board/INSIGHT.md) · 在 DSH Web 界面管理任务，由 Host 执行真实会话、定时调度并记录验证与执行状态。 · [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board)

## [下载热门](data/views/columns/HOT.md)

> 从近期下载较多的插件中，寻找适合自己任务的工具。

- [billion-context](data/plugins/ranxianglei--billion-context/INSIGHT.md) · 为长会话提供模型驱动的增量分层压缩、原文恢复、上下文搜索及多客户端代理/原生通道。 · [![npm 30d 2,010,311](https://img.shields.io/static/v1?label=npm+30d&message=2%2C010%2C311&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context)
- [REA](data/plugins/morluto--rea/INSIGHT.md) · 独立CLI和MCP服务器，为应用、二进制及运行行为逆向分析返回证据和限制。 · [![npm 30d 634,260](https://img.shields.io/static/v1?label=npm+30d&message=634%2C260&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents)
- [DSH Market](data/plugins/dsh-market--dsh-market/INSIGHT.md) · 在DSH内浏览社区插件，管理安装、更新、分组、备份与诊断。 · [![npm 30d 538,384](https://img.shields.io/static/v1?label=npm+30d&message=538%2C384&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket)

## 按场景查找

| 分类 | 用途 | 数量 |
| --- | --- | ---: |
| [个人效率](data/views/categories/PERSONAL-PRODUCTIVITY.md) | 输入、会话、快捷操作与个人工作体验 | 190 |
| [办公与运营](data/views/categories/OFFICE-OPERATIONS.md) | 工作记录、日程、团队用量与日常运营 | 22 |
| [研究与知识](data/views/categories/RESEARCH-KNOWLEDGE.md) | 信息检索、网页读取、笔记与长期知识 | 56 |
| [软件交付](data/views/categories/SOFTWARE-DELIVERY.md) | 代码开发、任务编排、调试与交付流程 | 175 |
| [内容生产](data/views/categories/CONTENT-CREATION.md) | 写作、语音、图片与视频内容生产 | 29 |
| [客户服务](data/views/categories/CUSTOMER-SERVICE.md) | 客户沟通、服务响应与支持流程 | 1 |
| [基础设施](data/views/categories/INFRASTRUCTURE.md) | 模型接入、认证、运行环境与系统支撑 | 100 |
| [其他](data/views/categories/OTHER.md) | 其他尚未归入上述场景的插件 | 3 |

[浏览全部分类](data/views/categories/INDEX.md)

## 研究出处

- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)

## LICENSE

[CC0-1.0](LICENSE)

## 更新时间

2026-10-27
