# dsh-voice-input-web

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c2fceee](https://github.com/0nt-one/dsh-voice-input/tree/c2fceee6a865a8466f3909d3896172f0f2fad2fa)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input) [![npm 30d 60](https://img.shields.io/static/v1?label=npm+30d&message=60&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-voice-input-web) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-voice-input-web)
<!-- END META -->

> **实现功能**：在输入框旁增加麦克风入口，使用浏览器语音识别把文字写入草稿。

> **核心亮点**：客户端检测 SpeechRecognition/webkitSpeechRecognition，将最终结果追加到输入区，自动发送由本地开关控制。

> **风险与缺陷**：转写进入草稿保留人工检查点；自动发送会放大识别错误，不能因免密钥就认定隐私已解决。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：偏好口述输入的用户，希望先得到可编辑草稿再发送消息。

系统听写和直接键盘是低耦合替代；本轮维持先试用、先校对的建议。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **界面**：输入框麦克风、语言切换与转写预览。

**流程与依赖**

依赖支持 Web Speech 的浏览器、麦克风权限和输入插槽，服务不可用时仍需键盘输入。

授权麦克风并选择语言，口述后修订草稿再发送；异常停止识别并检查浏览器权限。

**兼容条件**

包名 dsh-voice-input-web、版本 0.1.3；不能与同名的其他本地转写项目混同。

**效果与成本**

不需插件专用密钥，但有听写纠错、权限配置和浏览器服务可用性成本，未测单位输入成本。

> **思考**：转写进入草稿保留人工检查点；自动发送会放大识别错误，不能因免密钥就认定隐私已解决。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：客户端检测 SpeechRecognition/webkitSpeechRecognition，将最终结果追加到输入区，自动发送由本地开关控制。

浏览器能力探测与转写生命周期集中在客户端，轻量可借鉴；效果依赖系统语音实现。

<a id="detail-section-4"></a>

## 4 使用建议

先关闭自动发送，用专有名词和噪声样本比较打字与听写的总校对时间。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：浏览器语音服务不等于保证离线，本轮未核实音频去向、识别准确率或权限行为。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在不同浏览器测试拒绝权限、断网、长停顿和术语，记录误词与误发送次数。

**分析版本**

固定提交 [c2fceee](https://github.com/0nt-one/dsh-voice-input/tree/c2fceee6a865a8466f3909d3896172f0f2fad2fa)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 314 | 250 | 37 | — |
| .md | source | 1 | 71 | — | — | 564 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0nt-one/dsh-voice-input/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
