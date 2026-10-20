# dsh-mimotts

> 把定稿助手回复交给MiMo TTS合成语音，提供消息播放按钮、内联播放器与语音历史。

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/1497105876/dsh-mimotts) · [![最后更新 19天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=19%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1497105876/dsh-mimotts/commits)
<!-- END META -->

## 版本

固定提交 [fe04c509d3a308a2807238162998792ba8de6bca](https://github.com/1497105876/dsh-mimotts/tree/fe04c509d3a308a2807238162998792ba8de6bca)

## 用途与采用点评

- **用途**：希望听回复的用户需要可重放音频和便捷控制，验收包括文字读音、播放完成与敏感文本发送范围。
- **亮点**：Host合成路由先过connection.requestRejection，读取有限文本并调用TTS端点；客户端提交消息文本并接收WAV，语音记录独立保存。
- **思考**：消息动作行和历史让朗读更连贯；声音自然不代表文本正确，模型回复内容仍可能有误。
- **建议**：先用无敏感信息的短文本验证读音、取消和历史，再配置音色；听到语音不应代替核对原始技术结论。

## 场景与替代办法

希望听回复的用户需要可重放音频和便捷控制，验收包括文字读音、播放完成与敏感文本发送范围。

此前未入档；系统朗读无需该云端集成，本项增量在模型音色、消息定位和历史管理。

## 依赖与流程

需要TTS凭据、网络和受信宿主连接，声音克隆还依赖可读取样本及相应服务支持；浏览器只收到音频不等于文本不出本机。

配置key和音色，点定稿消息朗读，查看播放器或历史；请求失败核对状态与额度，重复点击前确认是否已有合成进行。

## 成本与效果

合成请求产生供应商费用与网络延迟，长回复裁剪可能需重做；语音历史占存储，人工核对发音另计。未测合格朗读成本。

消息动作行和历史让朗读更连贯；声音自然不代表文本正确，模型回复内容仍可能有误。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：909235fe2f3f866f8563578e329455376c37237affad784e4dce1886d1e32321。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 23 | 3832 | 2878 | 993 | — |
| .md | source | 1 | 145 | — | — | 2426 |
| .mjs | source | 3 | 276 | 190 | 61 | — |
| .ts | source | 16 | 2314 | 1516 | 649 | — |
| .tsx | source | 6 | 722 | 564 | 121 | — |
| .mjs | test | 5 | 326 | 288 | 14 | — |

排除 22 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **Host 路由**：状态查询及语音合成API。
- **界面**：消息朗读入口、播放器和历史。

## 工程亮点

Host持有key、路由采用宿主信任检查，TTS传输和文本规范化分层；HTTP超时与播放器停止是否一致需运行验证。

## 分发与兼容

0.2.0-rc.4，声明DSH >=0.2.0-rc.2 <0.3.0与Node>=22.19；Web/connection/settings与客户端槽位构成主要耦合面。

## 历史对照

当前快照此前没有该稳定身份的研究档案。此前未入档；系统朗读无需该云端集成，本项增量在模型音色、消息定位和历史管理。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码的信任栅栏不等于本轮安全或真机验收；未验证实际MiMo端点、音色、长文本和多设备播放质量。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用中英混合、代码、空消息和超长回复测试裁剪/发音，验证未认证路由拒绝和重复点击行为，记录实际费用。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1497105876/dsh-mimotts/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1497105876/dsh-mimotts/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1497105876/dsh-mimotts/issues?q=is%3Aissue+created%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1497105876/dsh-mimotts/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1497105876/dsh-mimotts/issues?q=is%3Aissue+updated%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z)

统计日期：2026-10-20。
