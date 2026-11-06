# DSH Plugin Insight [![已研究 1200](https://img.shields.io/static/v1?label=%E5%B7%B2%E7%A0%94%E7%A9%B6&message=1200&color=766494&style=flat&labelColor=555555&logoColor=white)](data/views/categories/INDEX.md)

按 DSH 使用场景查找插件与相关工具，了解用途、使用条件和核查结果。

[推荐尝试](data/views/columns/RECOMMENDED.md) · [最近发布](data/views/columns/LATEST.md) · [下载热门](data/views/columns/HOT.md) · [按场景查找](data/views/categories/INDEX.md)

<img src="assets/dsh-plugin-insight-banner.svg" alt="DSH Plugin Insight：从源码与证据中识别贡献、限制与创新方向" width="960">

## [推荐尝试](data/views/columns/RECOMMENDED.md)

> 看看插件能解决什么问题，以及试用前需要确认什么。

- **[dsh-plugin-veriscope](data/plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)** ｜ 重放VeriScope归档或对已有逐条评分做三态阈值门禁，保存输入/策略绑定回执并重查当前有效性。

    **推荐理由**：已有可信逐条分数与显式策略可试用，先用builtin和独立状态备份；PASS限输入范围，replay需固定环境且发布另负责。

    **试用条件**：可信逐条分数可试用builtin，原replay固定环境，PASS不直接授权发布。详见[Q06](data/plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md#research-q06)。

    [查看完整分析](data/plugins/4444wjt--dsh-plugin-veriscope/INSIGHT.md)

- **[dsh-markdown-live](data/plugins/9426haruka--dsh-markdown-live/INSIGHT.md)** ｜ 在 DSH 输入框实时着色/成形 Markdown，并让已发送用户文本复用宿主 Markdown 渲染器。

    **推荐理由**：Markdown重度用户可在固定样本上试用其显示层增强，前提是先验证发送字节、IME和撤销不变。

    **试用条件**：经常写 Markdown 且能接受表格/图片限制的 DSH Desktop 用户可在非关键草稿试用；先复制带中英混排、列表、链接和代码围栏的固定样本，校验发送前后字节与撤销。依赖无障碍输入、超长文档或宿主版本频繁升级的人应先观察。 详见[Q09](data/plugins/9426haruka--dsh-markdown-live/INSIGHT.md#research-q09)。

    [查看完整分析](data/plugins/9426haruka--dsh-markdown-live/INSIGHT.md)

- **[Tokdash](data/plugins/jingbiaomei--tokdash/INSIGHT.md)** ｜ 本地 AI 编码工具用量与费用看板，汇总会话、模型、缓存用量及使用报告。

    **推荐理由**：保存 DSH 会话日志并愿意核对计数的个人开发者可试用本地 Tokdash 回顾用量。相比人工翻日志，它按会话与模型汇总，并显式处理重试和重复文件，但金额仍是本地价格估算。日志格式被跳过、模型价格缺失或样本不一致时，应暂停费用判断并回到原始日志和供应商账单。

    **试用条件**：[Q04](data/plugins/jingbiaomei--tokdash/INSIGHT.md#research-q04) 限定个人本地使用回顾，先人工核对一个会话；价格或日志缺口出现即暂停金额判断。

    [查看完整分析](data/plugins/jingbiaomei--tokdash/INSIGHT.md)

## [最近发布](data/views/columns/LATEST.md)

> 查看最近发布的版本，了解用途和使用条件。

- [Garmin Connect](data/plugins/likenttt--garmin-connect-plugin-for-dsh/INSIGHT.md) · 在 DSH 与 MCP 中查询 Garmin 健身健康数据，并支持本地 FIT 导出及预览确认后的训练管理。 · [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-garmin-connect)
- [Hedgehog](data/plugins/skyf0xx--hedgehog/INSIGHT.md) · 为编码 Agent 安装角色与 Skill，并用 SQLite 构建图协调任务依赖、租约、范围验证和 Git 提交。 · [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@skyf0xx/hedgehog)
- [DSH Skills Manager](data/plugins/michengai--dsh-skills-manager/INSIGHT.md) · 在DSH集中管理本机与项目Skill，提供Git安装、更新预览、备份回退及回收站。 · [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager)

## [下载热门](data/views/columns/HOT.md)

> 从近期下载较多的插件中，寻找适合自己任务的工具。

- [billion-context](data/plugins/ranxianglei--billion-context/INSIGHT.md) · 为多种 Agent 提供分层上下文压缩、按需恢复与搜索，并通过代理和原生插件接入长期会话。 · [![npm 30d 2,889,440](https://img.shields.io/static/v1?label=npm+30d&message=2%2C889%2C440&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context)
- [REA](data/plugins/morluto--rea/INSIGHT.md) · 独立CLI/MCP逆向工具，为构建物静态分析生成带身份、覆盖和限制的可回查Evidence。 · [![npm 30d 1,542,817](https://img.shields.io/static/v1?label=npm+30d&message=1%2C542%2C817&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents)
- [DSH Market](data/plugins/dsh-market--dsh-market/INSIGHT.md) · 在 DeepSeek Harness 中浏览社区插件，并管理安装、更新和配置。 · [![npm 30d 907,321](https://img.shields.io/static/v1?label=npm+30d&message=907%2C321&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket)

## 按场景查找

| 分类 | 用途 | 数量 |
| --- | --- | ---: |
| [个人效率](data/views/categories/PERSONAL-PRODUCTIVITY.md) | 输入、会话、快捷操作与个人工作体验 | 361 |
| [办公与运营](data/views/categories/OFFICE-OPERATIONS.md) | 工作记录、日程、团队用量与日常运营 | 47 |
| [研究与知识](data/views/categories/RESEARCH-KNOWLEDGE.md) | 信息检索、网页读取、笔记与长期知识 | 150 |
| [软件交付](data/views/categories/SOFTWARE-DELIVERY.md) | 代码开发、任务编排、调试与交付流程 | 367 |
| [内容生产](data/views/categories/CONTENT-CREATION.md) | 写作、语音、图片与视频内容生产 | 69 |
| [客户服务](data/views/categories/CUSTOMER-SERVICE.md) | 客户沟通、服务响应与支持流程 | 1 |
| [基础设施](data/views/categories/INFRASTRUCTURE.md) | 模型接入、认证、运行环境与系统支撑 | 201 |
| [其他](data/views/categories/OTHER.md) | 其他尚未归入上述场景的插件 | 3 |

[浏览全部分类](data/views/categories/INDEX.md)

## 研究出处

- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)

## LICENSE

[CC0-1.0](LICENSE)

## 更新时间

2026-11-06
