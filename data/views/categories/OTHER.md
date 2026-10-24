# 其他

[返回首页](../../../README.md)

其他尚未归入上述场景的插件。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [dsh-armor-switch](#plugin-1409096911-root) | 向 DSH 提示词插入覆盖性规则并暴露运行时开关和显式权限预设；当前版禁止新磁盘清洗。 | 不在真实环境安装；防御研究限无凭证模拟宿主。 |
| [dsh-piano](#plugin-1412161923-root) | 在 DSH web 提供可拖按钮、浮动键盘与 Web Audio 合成的单音和刮奏。 | 娱乐用途可观察或在隔离浏览器小范围试用，先核发声、刮奏与停用后资源；不用于需 MIDI/录音交付的场景。 |

<a id="plugin-1409096911-root"></a>

## [dsh-armor-switch](../../plugins/571242--dsh-armor-switch/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/571242/dsh-armor-switch)

> **用途**：开发者研究 DSH 提示词扩展/历史还原时可静态分析；真实使用会冲击指令层级与权限。

> **亮点**：展示 section/context 热切换和维护诊断结构；不将规避安全的提示词视为正向创新。详见[Q02](#research-q02)。

> **思考**：规则文本要求无条件服从工作区/操作者且覆盖高风险类别；fullAccess 可改权限。README 仍称可清洗宿主，但当前 RPC 禁用。详见[Q01](#research-q01)、[Q03](#research-q03)。

> **建议**：可把来源标记与低信任提示词隔离做成防御性检测；此包未实现。详见[Q05](#research-q05)。

<a id="plugin-1412161923-root"></a>

## [dsh-piano](../../plugins/439436269-ctrl--dsh-piano/INSIGHT.md)



> **用途**：希望在 DSH web 界面临时体验钢琴音效的个人用户。

> **亮点**：把钢琴键盘、24ms 跨键限速、Web Audio 合成与可拖浮钮接入 DSH overlay；增量主要是宿主内就近娱乐交互，非音乐算法突破。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **思考**：style 在模块加载时插入、AudioContext 在模块作用域缓存，没有显式卸载移除/关闭；热卸载后的资源状态未知，不能把零采样等于零成本。详见[Q03](#research-q03)。

> **建议**：可把样式、音频和按钮延迟 timer 绑定 overlay 生命周期，并以重复挂载/卸载对照资源残留与再进入首音成功率；当前未实现。详见[Q04](#research-q04)。

## 更新时间

2026-10-24
