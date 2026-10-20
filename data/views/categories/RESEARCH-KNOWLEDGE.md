# 研究与知识

[返回首页](../../../README.md)

## 快速比较

索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [dsh-codevault](#plugin-1359423472-root) | 把源码阅读整理成可检索的仓库、文件和符号卡片，并关联本地知识库。 | 先给一个常读模块建卡，代码更新后核对引用和过期结论，不把历史笔记直接当现状。 |
| [dsh-cortex](#plugin-1366089972-workspace-plugins-dsh-cortex) | 按会话活动安排静默巩固，将工具经历归为持久记忆卡，并召回相关卡片与压低重复告警。 | 先少量召回并定期抽查卡片来源，重要故障保持外部告警；先验证重启后记忆仍可恢复再长期使用。 |
| [dsh-plugin-tavily](#plugin-1334654243-root) | 把Tavily搜索与页面提取接入宿主web服务，提供参数设置、额度状态与引擎切换。 | 先确认安装后的默认引擎和查询数据去向，用少量已知问题核对来源；额度错误时处理key，不期待自动换引擎掩盖失败。 |
| [dsh-scrape-webpage](#plugin-1334269686-root) | 抓取网页正文、结构、链接与关键词，可选下载内容图片并交给扩展分析器。 | 已有用户可保留正文抓取用途，先在公开测试页核对重定向、动态内容与超时；非 Windows 环境先验证 shell 回退，限制敏感网络目标。 |
| [Forge 记忆](#plugin-1363429979-plugin-memory) | 为 DSH 保存偏好、项目决策与关系化记忆，支持检索和跨会话使用。 | 先记录少量明确偏好，测试修改和删除后是否停止影响回答，再扩展自动积累。 |

### 研究与知识（5）

<a id="plugin-1359423472-root"></a>

#### [dsh-codevault](../../plugins/1014029855--dsh-codevault/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1014029855/dsh-codevault)

- **用途**：反复阅读相同代码的人需要保留带对象身份的笔记，减少重复整理。
- **亮点**：入口注册 code-reading Skill、read/vault 工具及 /codevault，配置档案目录与可选只读 vault。
- **思考**：对象卡片比聊天时间线容易复用；写得整齐不等于理解准确或跟上代码变更。
- **建议**：先给一个常读模块建卡，代码更新后核对引用和过期结论，不把历史笔记直接当现状。

<a id="plugin-1366089972-workspace-plugins-dsh-cortex"></a>

#### [dsh-cortex](../../plugins/1420079678-ctrl--agent-body--workspace-plugins-dsh-cortex/INSIGHT.md)

[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)

- **用途**：长期运行Agent-Body的用户希望跨会话保留失败教训和重复做法，并减少常驻告警噪声。
- **亮点**：组件src/index.ts以agent/pre-step判断活动，静默后按工具记录确定性生成卡片，关键词加权召回，权重衰减归档；重复告警收敛静默。
- **思考**：不让心跳和维护调用冒充会话活动能避免永不巩固；自动抽取的打法可能只记录偶然成功，需要真实任务对照。
- **建议**：先少量召回并定期抽查卡片来源，重要故障保持外部告警；先验证重启后记忆仍可恢复再长期使用。

<a id="plugin-1334654243-root"></a>

#### [dsh-plugin-tavily](../../plugins/1624318455--dsh-plugin-tavily/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tavily)

- **用途**：经常做联网研究的用户希望统一搜索参数并取回来源，合格结果是相关且可追溯的证据，不只是搜索成功。
- **亮点**：src/provider.ts实现web.search与fetch提供者，按请求解析密钥环，支持缓存与受限重试；可显式切换或在特定故障时回退DeepSeek。
- **思考**：统一设置和明确回退类型有利于诊断；丰富参数并不能代替同问题的检索质量比较。
- **建议**：先确认安装后的默认引擎和查询数据去向，用少量已知问题核对来源；额度错误时处理key，不期待自动换引擎掩盖失败。

<a id="plugin-1334269686-root"></a>

#### [dsh-scrape-webpage](../../plugins/131cda1--dsh-scrape-webpage/INSIGHT.md)

[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/131CDA1/dsh-scrape-webpage) · [![npm 30d 1151](https://img.shields.io/static/v1?label=npm+30d&message=1%2C151&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-scrape-webpage)

- **用途**：研究者读取具体网页时希望得到可引用正文与结构，原有办法是浏览器复制或宿主抓取工具。
- **亮点**：lib/index.js 优先宿主 web.fetch，缺失或异常后经 shell 调用 curl；解析与统计分层，图片逐张下载并调用注册分析器。
- **思考**：分析器注册接口避免把视觉服务绑死，但自动提取并不证明正文完整或网页内容可信。
- **建议**：已有用户可保留正文抓取用途，先在公开测试页核对重定向、动态内容与超时；非 Windows 环境先验证 shell 回退，限制敏感网络目标。

<a id="plugin-1363429979-plugin-memory"></a>

#### [Forge 记忆](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-memory/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 2404](https://img.shields.io/static/v1?label=npm+30d&message=2%2C404&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory)

- **用途**：反复在项目间切换的使用者需要可管理的长期偏好和决策，而非无差别保存聊天。
- **亮点**：storage-domain 支撑实体、关系和审计记录，服务统一管理写入、查询与导入校验。
- **思考**：结构化存储比散落提示词更可管理；错误或跨范围记忆可能持续影响后续决策。
- **建议**：先记录少量明确偏好，测试修改和删除后是否停止影响回答，再扩展自动积累。

## 更新时间

2026-10-20
