# dsh-neo-skin

> 通过主题覆盖层为 DSH Web 提供新粗野主义配色和可切换外观方案。

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/0nt-one/dsh-neo-skin) · [![npm 30d 113](https://img.shields.io/static/v1?label=npm+30d&message=113&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-neo-skin) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0nt-one/dsh-neo-skin/commits)
<!-- END META -->

## 版本

固定提交 [fe5ef0e671fab5ab8c8700013f3966eb9642455f](https://github.com/0nt-one/dsh-neo-skin/tree/fe5ef0e671fab5ab8c8700013f3966eb9642455f)

## 用途与采用点评

- **用途**：长时间使用 DSH Web 且偏好高对比外观的用户，需要可撤销的视觉定制。
- **亮点**：客户端调用 theme.overrideTokens，设置插槽控制开关与方案，偏好保存在 localStorage。
- **思考**：叠加覆盖比替换原生主题更容易回退；个性化审美价值不能写成工作效率提升。
- **建议**：先在测试配置中切换深浅主题、关闭插件并刷新，确认能完整恢复原生样式。

## 场景与替代办法

长时间使用 DSH Web 且偏好高对比外观的用户，需要可撤销的视觉定制。

宿主自带主题维护最低；本轮确认仍是覆盖方案，不是完整独立主题引擎。

## 依赖与流程

依赖 DSH Web theme、locale 与 slots；偏好是浏览器本地状态，跨设备不会自动一致。

选择方案并保存本地偏好；升级后检查原生主题切换，异常时关闭覆盖层。

## 成本与效果

无需模型服务，但维护自定义外观和排查主题冲突需要时间，未测视觉疲劳改善。

叠加覆盖比替换原生主题更容易回退；个性化审美价值不能写成工作效率提升。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：e0ea99acd7d6b0e808be36170f4dfadc5adc17fb66451332395526cc3d0e11e9。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 633 | 455 | 130 | — |
| .md | source | 1 | 142 | — | — | 1122 |
| .mjs | source | 1 | 47 | 29 | 10 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **界面**：主题覆盖和外观开关设置。

## 工程亮点

主题 token 与开关持久化分离可借鉴；复用依赖宿主主题和设置插槽契约。

## 分发与兼容

包版本 0.6.1，Web bundle 依赖主题服务；源码和发布产物未逐字节比较。

## 历史对照

前次代码指纹为 fe5ef0e671fab5ab8c8700013f3966eb9642455f；本轮固定为 fe5ef0e671fab5ab8c8700013f3966eb9642455f。宿主自带主题维护最低；本轮确认仍是覆盖方案，不是完整独立主题引擎。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未做可访问性、窄屏和不同宿主版本的视觉验收；截图不证明当前渲染一致。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：逐一检查深浅色、缩放、禁用后恢复和两个主题插件同时加载的冲突。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-20。
