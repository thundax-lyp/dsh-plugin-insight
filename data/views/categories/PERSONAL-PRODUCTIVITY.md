# 个人效率

[返回首页](../../../README.md)

## 分类导航

- [@0xsline/dsh-spotlight](#plugin-1333136466-root)：为 DSH Web 提供键盘优先的命令面板。
- [@dph/taskboard](#plugin-1336994666-root)：在侧边栏按会话组织四列任务看板，并支持新建、备注与导入导出。
- [@zzerx/dsh-plugin-memory](#plugin-1363429979-plugin-memory)：保存全局与项目偏好并跨会话注入，提供可视化管理。
- [@zzerx/dsh-plugin-notes](#plugin-1363429979-plugin-notes)：在 DSH 中管理 Markdown 便签、任务泳道与定时执行。
- [api-balance](#plugin-1334899834-root)：用户在开发过程中担心余额不足，需要快速确认可用性；合格结果是展示与官方账户相符且失败时不会把旧值冒充实时值。
- [cute-fat-fish-pet](#plugin-1409724830-src)：在 DSH Web 中提供带动画、陪聊与可选看屏的桌面宠物。
- [dsh-composer-expand](#plugin-1334850903-root)：给输入框增加展开按钮，切换到 70vh 的长文本编辑视图。
- [dsh-crypto-portfolio](#plugin-1342742812-root)：聚合多链、交易所与代币化股票的自托管资产看板。
- [dsh-discord-richpresence](#plugin-1342915339-root)：个人用户希望在 Discord 显示正在与代理工作，合格结果是好友所见状态与当前粗粒度阶段一致、断开后能恢复。
- [dsh-neo-skin](#plugin-1335557891-root)：新粗野主义双方案界面皮肤，支持浅色与深色主题。
- [dsh-perlica-ding](#plugin-1335704653-root)：按计划完成、任务结束、等待输入与错误播放分级提示音。
- [dsh-prompt-ErrorNotes-desk](#plugin-1418691015-root)：管理全局/会话提示词，并把经确认的错误经验回注后续对话。
- [dsh-side-session](#plugin-1355639507-root)：从输入区启动可继续的独立旁会话，让主会话保持运行。
- [dsh-status-rotator](#plugin-1333328839-root)：用户在等待模型时希望状态更可读或更有趣；合格结果是状态能随阶段变化且不遮挡操作。
- [dsh-voice-input-web](#plugin-1335558973-root)：在输入框加入浏览器语音转写、语言切换与可选自动发送。
- [dsh-workspace-menu](#plugin-1339803365-root)：经常管理很多会话和项目的用户，希望减少定位和切页。

### 个人效率（16）

<a id="plugin-1333136466-root"></a>

#### [@0xsline/dsh-spotlight](../../plugins/0xsline--dsh-spotlight/INSIGHT.md)

[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight) · [![npm 30d 697](https://img.shields.io/static/v1?label=npm+30d&message=697&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@0xsline/dsh-spotlight) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0xsline/dsh-spotlight/commits)

- **用途**：为 DSH Web 提供键盘优先的命令面板。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：效率收益取决于命令覆盖、冲突快捷键和检索命中；对少量常用操作可能不如原生入口直接。
- **建议**：用十个高频导航/命令任务测量查找时间和误触，再决定是否替代原入口。

<a id="plugin-1336994666-root"></a>

#### [@dph/taskboard](../../plugins/1070296335-create--dph-taskboard/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/1070296335-create/dph-taskboard) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/@dph/taskboard) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1070296335-create/dph-taskboard/commits)

- **用途**：在侧边栏按会话组织四列任务看板，并支持新建、备注与导入导出。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：列状态主要是人工组织信号，不证明任务真实完成；导入导出还需核对身份冲突和恢复语义。
- **建议**：用一个小项目验证拖拽、新建、恢复和导入后的会话对应关系，再评估是否减少管理时间。

<a id="plugin-1363429979-plugin-memory"></a>

#### [@zzerx/dsh-plugin-memory](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-memory/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 2569](https://img.shields.io/static/v1?label=npm+30d&message=2%2C569&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/commits)

- **用途**：保存全局与项目偏好并跨会话注入，提供可视化管理。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：自动注入会把陈旧或错误记忆带入后续任务；作用域、修订和删除是否可靠比条目数量更重要。
- **建议**：用可纠错的项目决策做小样本，验证保存、召回、改正和删除后再扩大范围。

<a id="plugin-1363429979-plugin-notes"></a>

#### [@zzerx/dsh-plugin-notes](../../plugins/0x7a7a6572--dsh-forge-studio--plugin-notes/INSIGHT.md)

[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 2739](https://img.shields.io/static/v1?label=npm+30d&message=2%2C739&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-notes) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/commits)

- **用途**：在 DSH 中管理 Markdown 便签、任务泳道与定时执行。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：便签升级为自动任务后会引入工作区、日程和重复执行风险；WebDAV 也增加外部同步边界。
- **建议**：先只用本地便签与手动执行，确认幂等和工作区选择后再启用定时或同步。

<a id="plugin-1334899834-root"></a>

#### [api-balance](../../plugins/02muller25--dsh-api-balance/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/api-balance) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance/commits)

- **用途**：用户在开发过程中担心余额不足，需要快速确认可用性；合格结果是展示与官方账户相符且失败时不会把旧值冒充实时值。基线是官方控制台或手动查询余额接口。
- **亮点**：在 DSH Web 输入区实时显示 DeepSeek API 账户余额，支持自动轮询、手动刷新和自定义刷新间隔。
- **思考**：每浏览器每30秒默认最多约120次查询/小时，每次另起 curl；10秒模式约360次，这是配置推算并非实测。没有模型 token 调用增量，但有网络、子进程和故障排查成本。迁移主要是本地刷新偏好。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：适合单账户用户按需查看，先验证凭证处理与轮询负担；需要预算控制时仍要配合计量和限额。

<a id="plugin-1409724830-src"></a>

#### [cute-fat-fish-pet](../../plugins/12we21--cute-fat-fish-pet--src/INSIGHT.md)

[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/cute-fat-fish-pet) · [![最后更新 昨天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E6%98%A8%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/12we21/cute-fat-fish-pet/commits)

- **用途**：在 DSH Web 中提供带动画、陪聊与可选看屏的桌面宠物。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：Electron 运行时、屏幕观察和在线模型扩大资源与隐私边界；视觉素材数量不证明稳定性。
- **建议**：先关闭看屏和在线聊天，测量空闲资源、关闭/卸载与重启恢复，再逐项开启能力。

<a id="plugin-1334850903-root"></a>

#### [dsh-composer-expand](../../plugins/13071301808--dsh-composer-expand/INSIGHT.md)

[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand) · [![npm 30d 1047](https://img.shields.io/static/v1?label=npm+30d&message=1%2C047&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-composer-expand) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/13071301808/dsh-composer-expand/commits)

- **用途**：给输入框增加展开按钮，切换到 70vh 的长文本编辑视图。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：这是局部 UI 改进；需确认移动端、窄屏和宿主布局升级后不遮挡发送与附件控件。
- **建议**：在桌面与窄窗口检查长 prompt、附件、快捷键和收起后的草稿保持。

<a id="plugin-1342742812-root"></a>

#### [dsh-crypto-portfolio](../../plugins/0xrabit--dsh-crypto-portfolio/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-crypto-portfolio) · [![最后更新 13天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=13%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0xRabit/dsh-crypto-portfolio/commits)

- **用途**：聚合多链、交易所与代币化股票的自托管资产看板。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：资产聚合跨多个第三方 API；报价延迟、链支持和凭据权限会直接影响财务判断，源码存在不等于余额正确。
- **建议**：只用只读 API 和小额地址，逐来源对账并记录失败降级；不得据看板直接执行交易。

<a id="plugin-1342915339-root"></a>

#### [dsh-discord-richpresence](../../plugins/0qwq0--dsh-discord-richpresence/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-discord-richpresence) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence/commits)

- **用途**：个人用户希望在 Discord 显示正在与代理工作，合格结果是好友所见状态与当前粗粒度阶段一致、断开后能恢复。基线是手动状态；不是企业协作审批、任务结果通知或生产监控。
- **亮点**：将 DSH 的粗粒度交互状态推送到本机 Discord Rich Presence，支持自定义文案与可选丰富状态。
- **思考**：持续成本是socket／重连定时器及外部可见信息的管理，无额外模型调用。首次只需少量配置，迁移时保留文案和richMode；无证据支持其节省开发时间。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：仅推荐给明确想展示状态的个人用户试用；默认保持模糊模式，先核查实际外发字段。

<a id="plugin-1335557891-root"></a>

#### [dsh-neo-skin](../../plugins/0nt-one--dsh-neo-skin/INSIGHT.md)

[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/0nt-one/dsh-neo-skin) · [![npm 30d 117](https://img.shields.io/static/v1?label=npm+30d&message=117&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-neo-skin) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0nt-one/dsh-neo-skin/commits)

- **用途**：新粗野主义双方案界面皮肤，支持浅色与深色主题。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：价值主要是视觉偏好；需确认宿主 CSS token 变化不会造成局部不可读。
- **建议**：先在非关键浏览器 Profile 检查常用页面、深浅色和升级后的样式，再决定长期启用。

<a id="plugin-1335704653-root"></a>

#### [dsh-perlica-ding](../../plugins/117bs--dsh-perlica-ding/INSIGHT.md)

[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/117BS/dsh-perlica-ding) · [![npm 30d 339](https://img.shields.io/static/v1?label=npm+30d&message=339&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-perlica-ding) · [![最后更新 12天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=12%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/117BS/dsh-perlica-ding/commits)

- **用途**：按计划完成、任务结束、等待输入与错误播放分级提示音。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：事件映射错误或高频任务会造成噪声；系统级播放也可能泄露工作状态或打扰共享环境。
- **建议**：在耳机和后台窗口中核对四类事件、音量与静音规则，普通聊天误响时停用。

<a id="plugin-1418691015-root"></a>

#### [dsh-prompt-ErrorNotes-desk](../../plugins/1015677515--dsh-prompt-errornotes-desk/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/1015677515/dsh-prompt-ErrorNotes-desk/commits)

- **用途**：管理全局/会话提示词，并把经确认的错误经验回注后续对话。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：持续回注会增加上下文并可能固化错误规则；用户确认能降低风险但不能保证经验仍适用。
- **建议**：只记录可复现错误，设置复查与删除步骤，并观察是否减少同类错误而非只增加提示词长度。

<a id="plugin-1355639507-root"></a>

#### [dsh-side-session](../../plugins/123dbl--dsh-side-session/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/123dbl/dsh-side-session) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-side-session) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/123dbl/dsh-side-session/commits)

- **用途**：从输入区启动可继续的独立旁会话，让主会话保持运行。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：并行会话会复制上下文并增加结论合并负担；独立可继续不代表状态自动同步。
- **建议**：用一个主任务加一个短研究支线，检查创建、返回、续聊和结论回收是否减少等待。

<a id="plugin-1333328839-root"></a>

#### [dsh-status-rotator](../../plugins/01virex--dsh-status-rotator/INSIGHT.md)

[![GitHub ★ 174](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=174&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) · [![npm 30d 11947](https://img.shields.io/static/v1?label=npm+30d&message=11%2C947&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/commits)

- **用途**：用户在等待模型时希望状态更可读或更有趣；合格结果是状态能随阶段变化且不遮挡操作。基线是宿主原生状态栏，不以词库数量或主题数量证明生产效率。
- **亮点**：为 DSH Web 状态栏提供阶段文案、打字机、渐变、弹幕和主题，支持在设置页自定义。
- **思考**：首次主要是外观选择与兼容确认；持续有浏览器动画／定时器、SSE连接、设置存储和注意力成本，无模型收益实测。迁移需保留词库与配置，升级要复核 DOM／客户端契约。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：适合重视界面氛围的个人用户体验；工作环境先关弹幕与动画，比较状态可读性和浏览器负担。

<a id="plugin-1335558973-root"></a>

#### [dsh-voice-input-web](../../plugins/0nt-one--dsh-voice-input/INSIGHT.md)

[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input) · [![npm 30d 73](https://img.shields.io/static/v1?label=npm+30d&message=73&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-voice-input-web) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input/commits)

- **用途**：在输入框加入浏览器语音转写、语言切换与可选自动发送。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：转写依赖 Chrome/Edge 的 Web Speech API；浏览器支持、网络实现和误触自动发送会改变实际可用性。
- **建议**：先关闭自动发送，用含专有名词和噪声的短样本比较手工输入；误识别不可接受时停用。

<a id="plugin-1339803365-root"></a>

#### [dsh-workspace-menu](../../plugins/0imzero--dsh-workspace-menu/INSIGHT.md)

[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/@dsh-external/dsh-workspace-menu) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu/commits)

- **用途**：经常管理很多会话和项目的用户，希望减少定位和切页。合格交付物是动作作用于正确对象、可区分保留文件与永久删除；基线是宿主原生菜单和系统文件管理器。
- **亮点**：为 DSH 工作区与会话补充右键、双击菜单，集中提供置顶、重命名、归档、分叉和打开目录等操作。
- **思考**：常用动作可能减少点击，但需要界面升级适配、localStorage跨浏览器不一致处理和依赖插件维护。删除误操作成本远高于省下点击；迁移需备份置顶／未读偏好和项目数据。无本轮耗时实测。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：先试非破坏菜单并保持删除关闭；需要删除时必须在临时目录验证路径授权、归档依赖和失败恢复。

## 更新时间

2026-10-19
