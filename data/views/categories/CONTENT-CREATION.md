# 内容生产

[返回首页](../../../README.md)

写作、语音、图片与视频内容生产。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [dsh-douyin-publish](#plugin-1422396858-root) | 把本地视频交给抖音或B站投稿页并填字段，默认草稿停手，可选配乐和显式发布分支。 | 先观察，仅受控草稿核有效配置/账号与字段，补授权和受理收据后再评估采用。 |
| [dsh-LorebookMD](#plugin-1334395883-root) | 将Tavern角色卡与世界书导入DSH，生成本地设定文档和世界书、创作提示词，并按关键词追加设定条目。 | 先观察。 |
| [dsh-plugin-translation](#plugin-1336663562-root) | 为模型翻译提供切段、术语抽取、规则质检、语体指引与工作区翻译/术语记忆。 | 建议单用户明确cwd、有词表备份的辅助试用；不自动放行高风险翻译，高分语义错、覆盖或路径不明时停写库。 |
| [dsh-sticker-pack](#plugin-1418769012-root) | 订阅远端表情包清单，镜像图片，向 agent 提供选图工具和 Web/微信渠道贴图提示。 | 仅可信图册试点，Web/微信均以收件端确认；限制等待时间并检查设置路由保护。 |
| [dsh-video-pipeline](#plugin-1414936636-root) | 以 DSH skill provider 提供 19 个视频制作、核验和多平台发布技能与脚本。 | 先只启用无外部发布的生成/核验技能，用测试素材逐环节验证；不要把真实 ARK_API_KEY 注入技能正文。 |
| [dsh-wsl-media](#plugin-1381725238-root) | 把ffprobe、ffmpeg、PDF文本、Whisper、Pandoc、OCR和ExifTool接为DSH本地文件工具，按允许目录读取或生成产物。 | 先观察，先显式窄roots和无敏感独立输出，核真实产物/覆盖/取消，避免唯一原件与批量并发。 |
| [gzhflow](#plugin-1339888505-root) | 把公众号素材、写作、去AI味、配图、排版、推草稿和复盘组织为随包Skill，提供七个DSH工具调用本地脚本。 | 先观察。 |
| [no-ai-style](#plugin-1418493685-root) | 提供英中日写作审阅、润色和起草Skill，附DSH模式插入按钮与离线词法/锚点检查。 | 作者留原文并逐命题复核的可控范围试用，先audit再授权编辑。 |

<a id="plugin-1422396858-root"></a>

## [dsh-douyin-publish](../../plugins/7gzgn--dsh-douyin-publish/INSIGHT.md)



> **用途**：已有本地视频的创作者减少上传填表劳动，需人工核账号/素材/字段和平台受理。

> **亮点**：把文件递交、页面推进和字段准备接成步骤回执，减少桌面对话框依赖；非新上传/浏览器技术。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **思考**：cfg可默认publish，字段warning仍继续；published只证明点击，不核平台受理，固定browser键和取消传播也需明确。详见[Q02](#research-q02)。

> **建议**：可探讨账号/素材/字段绑定和发布受理收据，逐次授权、页锁及unknown查询恢复，平台维护成本未验证。详见[Q05](#research-q05)。

<a id="plugin-1334395883-root"></a>

## [dsh-LorebookMD](../../plugins/609476965--dsh-lorebookmd/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/609476965/dsh-LorebookMD) [![npm 30d 631](https://img.shields.io/static/v1?label=npm+30d&message=631&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-lorebookmd)

> **用途**：面向已有Tavern/SillyTavern角色卡或世界书、希望在DSH中复用设定写小说或互动推演的用户。输入是自己提供的PNG/JSON和场景要求，输出是可查看的设定文档、可激活提示词以及模型生成的正文。插件不自带小说素材，也没有独立生成模型。

> **亮点**：将角色卡和世界书解析接入共享预设管理，生成世界书/创作两种提示词及本地MD，减少手工迁移和重复切换；不是完整Tavern引擎或新生成模型。详见[Q02](#research-q02)。

> **思考**：实例共享active可影响其它会话；MD编辑不回流，全文与关键词状态可分叉。固定Git缺声明的host入口，发行包内容仍需核对，未做故障复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

> **建议**：可探索按会话绑定的版本化权威文档与预算注入收据，比较串用、遗漏、token和编辑传播；未实现。详见[Q06](#research-q06)。

<a id="plugin-1336663562-root"></a>

## [dsh-plugin-translation](../../plugins/863683348--dsh-plugin-translation/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-translation) [![npm 30d 1,011](https://img.shields.io/static/v1?label=npm+30d&message=1%2C011&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-translation)

> **用途**：长文及技术翻译用户需要一致术语和形式核查，合格译文仍以独立语义正确为准。详见[Q01](#research-q01)。

> **亮点**：把切段、规则、术语和风格记忆集中成模型可调用翻译辅助流程，减少重复约束交接；不是翻译模型或可靠语义评分器。详见[Q01](#research-q01)。

> **思考**：quality从表面规则扣分，严重语义错仍可能高分；无版本条件读改写和缺cwd跳过containment也限制共享记忆可靠性。详见[Q03](#research-q03)。

> **建议**：可研究规则命中位置与独立语义验收分层，以及确认译对的来源/失效关系，以否定翻反等固定反例比较错误放行。当前未验证。详见[Q05](#research-q05)。

<a id="plugin-1418769012-root"></a>

## [dsh-sticker-pack](../../plugins/5v1a-afk--dsh-sticker-pack/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/5V1A-afk/dsh-sticker-pack)

> **用途**：让 DSH 回复按语境适度使用授权图像，并在目标渠道实际显示。

> **亮点**：把远端图册与 DSH agent 工具、Web 地址及微信文件格式打通，并由插件决定贴图概率。详见[Q02](#research-q02)。

> **思考**：设置 GET 带参数即写盘，组件内无身份/CSRF 校验；等待上限可无限增大，实际外部保护需核。详见[Q03](#research-q03)。

> **建议**：受保护设置和交付回执能让“能选到图”升级为“已显示/送达”；尚未实现。详见[Q05](#research-q05)。

<a id="plugin-1414936636-root"></a>

## [dsh-video-pipeline](../../plugins/439436269-ctrl--dsh-video-pipeline/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-video-pipeline)

> **用途**：已有短视频/AI 短剧素材生产需求，希望把多工具环节、质量门与发布回写串成可发现技能。

> **亮点**：把多阶段短视频生产、核验和发布经验包装为可在 DSH 发现的技能目录。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：环境变量 ARK_API_KEY 会替换到 Agent 可见技能正文；脚本占位符不替换、外部依赖和平台账号不随包提供。详见[Q03](#research-q03)。

> **建议**：采用秘密引用/受控工具而非正文替换，并维护平台版本/费用/发布门端到端回归，可降低迁移风险；现版未实现。详见[Q04](#research-q04)。

<a id="plugin-1381725238-root"></a>

## [dsh-wsl-media](../../plugins/173787247--dsh-wsl-media/INSIGHT.md)

[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-media)

> **用途**：面向在WSL/类Linux环境用DSH处理本地媒体和文档的人。九工具覆盖CLI状态、媒体信息、抽音轨、缩略图、PDF文本、Whisper转录、Pandoc转换、OCR与Exif，不提供远程素材下载、专业编辑时间线或模型自动理解全部媒体。

> **亮点**：将常用媒体/文档CLI封装成结构化参数、路径检查和统一错误/截断结果，减少手写命令。详见[Q02](#research-q02)。

> **思考**：不存在输出不核父realpath，ffmpeg-y覆盖且写工具并发安全标记；Whisper写/tmp txt但返回stdout，stderr内存无上限、宿主取消未接child。默认roots较宽。详见[Q03](#research-q03)、[Q05](#research-q05)。

> **建议**：可探索物理父路径/文件身份绑定、临时产物验收后原子不覆盖、显式后端收据及stderr/signal树治理；未实现。详见[Q06](#research-q06)。

<a id="plugin-1339888505-root"></a>

## [gzhflow](../../plugins/andiii208--gzhflow/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/Andiii208/gzhflow)

> **用途**：面向经常用Agent写微信公众号内容、希望保留素材/文风并减少排版和推草稿重复操作的个人作者。输入为主题、用户真实素材和风格/主题配置，输出从Markdown到排版HTML、图片和公众号草稿，再复盘回写个人知识库。它不是无人值守新闻真实性系统，也不直接完成读者可见的最终发布。

> **亮点**：结合可替换风格/主题、静态脚本门、LLM清单与人工停靠点，并以七工具和一个bundled Skill接入DSH，减少重复流程说明；方法借鉴归属以NOTICE作者说明为界。详见[Q02](#research-q02)。

> **思考**：reader先trim再用非空首字符判顶层，图生子键无法读入；check_env接受env而publish只读credentials。dry-run不连官方接口，前门/审阅未由发布工具强制，未运行复现。详见[Q03](#research-q03)。

> **建议**：可探索按产物hash绑定质检/审阅、按attempt保存图生/上传/草稿远端ID收据，比较错版/重复与恢复人工；未实现。详见[Q06](#research-q06)。

<a id="plugin-1418493685-root"></a>

## [no-ai-style](../../plugins/01ngvi-qingyi--no-ai-style/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/01NGVI-QINGYI/no-ai-style)

> **用途**：需要保持事实与证据强度的学术/职业文本编辑。详见[Q01](#research-q01)。

> **亮点**：将阅读契约、事实边界、最小编辑和回查门槛与三模式交付接合，比单句润色提示更有审阅结构。详见[Q01](#research-q01)。

> **思考**：词法flags和数字multiset不能证明语义等价；按钮只是提示插入，自动执行与宿主引用保护有具体契约条件。详见[Q03](#research-q03)。

> **建议**：从锚点不保关系推导命题级变更收据，按换对象/因果升级/删null等反例比较误改和人工负担，未验证。详见[Q05](#research-q05)。

## 更新时间

2026-10-22
