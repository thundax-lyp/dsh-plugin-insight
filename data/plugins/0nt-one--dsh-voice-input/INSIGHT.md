# dsh-voice-input-web

> 在输入框旁增加麦克风入口，使用浏览器语音识别把文字写入草稿。

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input) · [![npm 30d 71](https://img.shields.io/static/v1?label=npm+30d&message=71&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-voice-input-web) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input/commits)
<!-- END META -->

## 版本

固定提交 [c2fceee6a865a8466f3909d3896172f0f2fad2fa](https://github.com/0nt-one/dsh-voice-input/tree/c2fceee6a865a8466f3909d3896172f0f2fad2fa)

## 用途与采用点评

- **用途**：偏好口述输入的用户，希望先得到可编辑草稿再发送消息。
- **亮点**：客户端检测 SpeechRecognition/webkitSpeechRecognition，将最终结果追加到输入区，自动发送由本地开关控制。
- **思考**：转写进入草稿保留人工检查点；自动发送会放大识别错误，不能因免密钥就认定隐私已解决。
- **建议**：先关闭自动发送，用专有名词和噪声样本比较打字与听写的总校对时间。

## 场景与替代办法

偏好口述输入的用户，希望先得到可编辑草稿再发送消息。

系统听写和直接键盘是低耦合替代；本轮维持先试用、先校对的建议。

## 依赖与流程

依赖支持 Web Speech 的浏览器、麦克风权限和输入插槽，服务不可用时仍需键盘输入。

授权麦克风并选择语言，口述后修订草稿再发送；异常停止识别并检查浏览器权限。

## 成本与效果

不需插件专用密钥，但有听写纠错、权限配置和浏览器服务可用性成本，未测单位输入成本。

转写进入草稿保留人工检查点；自动发送会放大识别错误，不能因免密钥就认定隐私已解决。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：7b0a77672b668df7566955d1f41f94097d92e444dd408a20c44d100e7c941a6d。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 314 | 250 | 37 | — |
| .md | source | 1 | 71 | — | — | 564 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **界面**：输入框麦克风、语言切换与转写预览。

## 工程亮点

浏览器能力探测与转写生命周期集中在客户端，轻量可借鉴；效果依赖系统语音实现。

## 分发与兼容

包名 dsh-voice-input-web、版本 0.1.3；不能与同名的其他本地转写项目混同。

## 历史对照

前次代码指纹为 c2fceee6a865a8466f3909d3896172f0f2fad2fa；本轮固定为 c2fceee6a865a8466f3909d3896172f0f2fad2fa。系统听写和直接键盘是低耦合替代；本轮维持先试用、先校对的建议。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：浏览器语音服务不等于保证离线，本轮未核实音频去向、识别准确率或权限行为。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在不同浏览器测试拒绝权限、断网、长停顿和术语，记录误词与误发送次数。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input/issues?q=is%3Aissue+created%3A2026-09-20T02%3A56%3A47.770Z..2026-10-20T02%3A56%3A47.770Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T02%3A56%3A47.770Z..2026-10-20T02%3A56%3A47.770Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input/issues?q=is%3Aissue+updated%3A2026-09-20T02%3A56%3A47.770Z..2026-10-20T02%3A56%3A47.770Z)

统计日期：2026-10-20。
