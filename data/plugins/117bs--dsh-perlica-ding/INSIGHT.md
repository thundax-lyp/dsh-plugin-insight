# dsh-perlica-ding

> 根据计划、执行、等待回应和错误状态播放分级提示音，普通问答保持安静。

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/117BS/dsh-perlica-ding) · [![npm 30d 333](https://img.shields.io/static/v1?label=npm+30d&message=333&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-perlica-ding) · [![最后更新 13天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=13%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/117BS/dsh-perlica-ding/commits)
<!-- END META -->

## 版本

固定提交 [f9db75c3cff13919659e81311a2b3d62f9af8aab](https://github.com/117BS/dsh-perlica-ding/tree/f9db75c3cff13919659e81311a2b3d62f9af8aab)

## 用途与采用点评

- **用途**：后台运行智能体时，用户希望听到需要关注的状态而不盯住窗口。
- **亮点**：监听主会话事件和执行类工具，按类别去抖，通过 subprocess 调用系统播放程序；PCM 音量副本有内容缓存。
- **思考**：主会话限定与普通问答静音可减少噪声；有效性取决于事件分类是否符合使用者期待。
- **建议**：先用测试音和短任务核查四种状态，调整音量及去抖，不将完成音当验收。

## 场景与替代办法

后台运行智能体时，用户希望听到需要关注的状态而不盯住窗口。

系统通知更少资源定制；分级声音适合无需持续看屏的个人使用。

## 依赖与流程

依赖事件名称、执行工具清单和本机播放设备，缺播放器时没有声音不代表没完成。

选择音效和音量，后台等待提示后回看任务实际结果；无声时先测试设备和播放器。

## 成本与效果

没有模型专用调用，但需配置声音与免打扰，密集通知可能反而增加打断。

主会话限定与普通问答静音可减少噪声；有效性取决于事件分类是否符合使用者期待。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：c8cfcb1ceb257ff6ab915e835a2965800ee964c1e98ea02d02181c0f533a4b33。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 1382 | 1073 | 217 | — |
| .js | source | 1 | 307 | 269 | 22 | — |
| .md | source | 2 | 272 | — | — | 2017 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **后台**：主会话分级声音通知。

## 工程亮点

参数化 subprocess、PCM 缩放和内容寻址缓存可借鉴；音效资源授权与平台行为仍需单独核查。

## 分发与兼容

版本 0.2.1，入口 index.mjs，依赖 subprocess 及 macOS/Windows/Linux 对应播放器。

## 历史对照

前次代码指纹为 f9db75c3cff13919659e81311a2b3d62f9af8aab；本轮固定为 f9db75c3cff13919659e81311a2b3d62f9af8aab。系统通知更少资源定制；分级声音适合无需持续看屏的个人使用。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：工具调用分类不证明任务成功，未验证平台播放器、静音策略与实际漏报误报。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试计划、纯问答、执行失败、子代理和连续审批，记录误响与漏响而非只听一次。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-20。
