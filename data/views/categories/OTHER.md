# 其他

[返回首页](../../../README.md)

其他尚未归入上述场景的插件。

**快速比较**

> 索引与下方短评均按插件名字母顺序排列；点击插件名跳转到本页短评。

| 插件 | 主要用途 | 关键使用条件 |
| --- | --- | --- |
| [dsh-armor-switch](#plugin-1409096911-root) | 向DSH注册可切换交付规则与普通偏好，提供显式权限预设和既有改动诊断恢复。 | 普通偏好优先使用既有窄配置；当前不建议新增采用整套覆盖契约。 |
| [dsh-piano](#plugin-1412161923-root) | 在 DSH web 提供可拖按钮、浮动键盘与 Web Audio 合成的单音和刮奏。 | 娱乐用途可观察或在隔离浏览器小范围试用，先核发声、刮奏与停用后资源；不用于需 MIDI/录音交付的场景。 |
| [竹知了](#plugin-1319484586-root) | 在浏览器中模拟竹知了玩具的甩动、发声与本机圈数记录。 | 不推荐作为DSH插件；许可允许的个人本地阅读与体验是不同任务。 |

<a id="plugin-1409096911-root"></a>

## [dsh-armor-switch](../../plugins/571242--dsh-armor-switch/INSIGHT.md)

[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/571242/dsh-armor-switch)

> **用途**：面向管理模型交付偏好与既有宿主改动的操作者，各开关有不同作用域。

> **亮点**：统一契约切换、独立普通偏好和旧磁盘改动诊断恢复，工程增量主要在开关接线与可观察性。[Q01](../../plugins/571242--dsh-armor-switch/INSIGHT.md#research-q01)、[Q02](../../plugins/571242--dsh-armor-switch/INSIGHT.md#research-q02)

> **思考**：主开关关闭不撤回显式权限、普通偏好或既有磁盘状态；清洗说明与当前禁用入口冲突，缺少交付改善对照。[Q03](../../plugins/571242--dsh-armor-switch/INSIGHT.md#research-q03)、[Q05](../../plugins/571242--dsh-armor-switch/INSIGHT.md#research-q05)

> **建议**：未验证方向是窄偏好入口加逐agent权限租约/原快照收据，以异构权限和中断矩阵验证无损归还，失败则否定。[Q06](../../plugins/571242--dsh-armor-switch/INSIGHT.md#research-q06)

<a id="plugin-1412161923-root"></a>

## [dsh-piano](../../plugins/439436269-ctrl--dsh-piano/INSIGHT.md)



> **用途**：希望在 DSH web 界面临时体验钢琴音效的个人用户。

> **亮点**：把钢琴键盘、24ms 跨键限速、Web Audio 合成与可拖浮钮接入 DSH overlay；增量主要是宿主内就近娱乐交互，非音乐算法突破。详见[Q01](../../plugins/439436269-ctrl--dsh-piano/INSIGHT.md#research-q01)、[Q02](../../plugins/439436269-ctrl--dsh-piano/INSIGHT.md#research-q02)。

> **思考**：style 在模块加载时插入、AudioContext 在模块作用域缓存，没有显式卸载移除/关闭；热卸载后的资源状态未知，不能把零采样等于零成本。详见[Q03](../../plugins/439436269-ctrl--dsh-piano/INSIGHT.md#research-q03)。

> **建议**：可把样式、音频和按钮延迟 timer 绑定 overlay 生命周期，并以重复挂载/卸载对照资源残留与再进入首音成功率；当前未实现。详见[Q04](../../plugins/439436269-ctrl--dsh-piano/INSIGHT.md#research-q04)。

<a id="plugin-1319484586-root"></a>

## [竹知了](../../plugins/imsai-sh--zhuzhiliao/INSIGHT.md)

[![GitHub ★ 2,880](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C880&color=yellow&logo=github&style=flat)](https://github.com/imsai-sh/zhuzhiliao)

> **用途**：传统玩具爱好者在手机浏览器通过画圈或传感器体验竹知了；它是独立Web项目。

> **亮点**：相对静态视频或录音，以角速度和绳张力共同驱动交互声音，增量属于玩具体验设计；不构成DSH能力。见[Q01](../../plugins/imsai-sh--zhuzhiliao/INSIGHT.md#research-q01)。

> **思考**：它并非DSH插件，完整PWA/3D也不等于单文件离线；源码公开不授权第三方部署或再分发。见[Q03](../../plugins/imsai-sh--zhuzhiliao/INSIGHT.md#research-q03)。

> **建议**：未验证假设是固定同一物理轨迹，比较纯音频、2D与3D模式的拟真感和卡顿；若3D无辨识增益且更耗资源则保留2D默认。见[Q04](../../plugins/imsai-sh--zhuzhiliao/INSIGHT.md#research-q04)。

## 更新时间

2026-10-27
