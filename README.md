# DSH Plugin Insight [![已研究 1274](https://img.shields.io/static/v1?label=%E5%B7%B2%E7%A0%94%E7%A9%B6&message=1274&color=766494&style=flat&labelColor=555555&logoColor=white)](data/views/categories/INDEX.md)

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

- **[OpenBitFun Agent 工作区](data/plugins/gcwing--openbitfun/INSIGHT.md)** ｜ 独立 Agent 工作区，支持跨设备控制、远程工作区与可选 DSH 会话。

    **推荐理由**：有常开开发主机的开发者可以用测试账号从手机观察隔离仓库里的一次长任务并处理低风险审批。相比登录 SSH 再找对应终端，会话投影与审批入口能让操作者在同一界面确认任务进度。若无法确认目标主机、工作目录或一次写入是否已经生效，操作者应暂停后续操作并回主机核对。

    **试用条件**：用测试账号和可回滚仓库先跑一次短任务，再从第二设备核对任务 ID 与审批。断开后回主机确认文件结果，状态未知时暂停后续写入。见 [Q04](data/plugins/gcwing--openbitfun/INSIGHT.md#research-q04)。

    [查看完整分析](data/plugins/gcwing--openbitfun/INSIGHT.md)

## [最近发布](data/views/columns/LATEST.md)

> 查看最近发布的版本，了解用途和使用条件。

- [dsh-remote](data/plugins/flymysql--dsh-remote/INSIGHT.md) · 将 SSH 主机接入 DSH 远程工作区，提供文件同步、命令、终端与端口转发。 · [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-remote)
- [DSH Email](data/plugins/stardustlc666--dsh-email/INSIGHT.md) · 在 DSH 中浏览、搜索邮件并编辑回复草稿，支持确认发送与可选邮件任务。 · [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-email)
- [无限画布（Infinite Canvas）](data/plugins/ninkch--dsh-infinite_canvas/INSIGHT.md) · 在 DSH 中用节点画布组织短剧剧本、分镜、图像与视频生成，并衔接后期交付。 · [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ninkch/dsh-infinite-canvas)

## [下载热门](data/views/columns/HOT.md)

> 从近期下载较多的插件中，寻找适合自己任务的工具。

- [billion-context](data/plugins/ranxianglei--billion-context/INSIGHT.md) · 为多种 Agent 提供分层上下文压缩、按需恢复与搜索，并通过代理和原生插件接入长期会话。 · [![npm 30d 2,889,440](https://img.shields.io/static/v1?label=npm+30d&message=2%2C889%2C440&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/billion-context)
- [REA](data/plugins/morluto--rea/INSIGHT.md) · 独立CLI/MCP逆向工具，为构建物静态分析生成带身份、覆盖和限制的可回查Evidence。 · [![npm 30d 1,542,817](https://img.shields.io/static/v1?label=npm+30d&message=1%2C542%2C817&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/rea-agents)
- [DSH Market](data/plugins/dsh-market--dsh-market/INSIGHT.md) · 在 DeepSeek Harness 中浏览社区插件，并管理安装、更新和配置。 · [![npm 30d 907,321](https://img.shields.io/static/v1?label=npm+30d&message=907%2C321&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket)

## 按场景查找

| 分类 | 用途 | 数量 |
| --- | --- | ---: |
| [个人效率](data/views/categories/PERSONAL-PRODUCTIVITY.md) | 输入、会话、快捷操作与个人工作体验 | 378 |
| [办公与运营](data/views/categories/OFFICE-OPERATIONS.md) | 工作记录、日程、团队用量与日常运营 | 53 |
| [研究与知识](data/views/categories/RESEARCH-KNOWLEDGE.md) | 信息检索、网页读取、笔记与长期知识 | 163 |
| [软件交付](data/views/categories/SOFTWARE-DELIVERY.md) | 代码开发、任务编排、调试与交付流程 | 391 |
| [内容生产](data/views/categories/CONTENT-CREATION.md) | 写作、语音、图片与视频内容生产 | 73 |
| [客户服务](data/views/categories/CUSTOMER-SERVICE.md) | 客户沟通、服务响应与支持流程 | 1 |
| [基础设施](data/views/categories/INFRASTRUCTURE.md) | 模型接入、认证、运行环境与系统支撑 | 210 |
| [其他](data/views/categories/OTHER.md) | 其他尚未归入上述场景的插件 | 5 |

[浏览全部分类](data/views/categories/INDEX.md)

## 研究出处

- [awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
- [0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)

## LICENSE

[CC0-1.0](LICENSE)

## 更新时间

2026-11-11
