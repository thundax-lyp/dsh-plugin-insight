# dsh-asciinema

> 录制DSH工具输出为带时间轴的数据文件，提供文本提取和自包含离线HTML回放。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c478634](https://github.com/988hj7tczd-oss/dsh-asciinema/tree/c47863413886ffac9b66ee13a9ab276ab195d5d9)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-asciinema) · [![npm 30d 401](https://img.shields.io/static/v1?label=npm+30d&message=401&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-asciinema)
<!-- END META -->

**使用建议**：适合记录普通非敏感工具文本供本插件回放。先检查输出内容和截断，分享HTML前脱敏；需要真实终端保真或官方.cast互操作时先做独立验收。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：开发者需要保存Agent工具输出用于演示或排错，合格记录应忠实反映收到的文本与范围；工具结果记录不等于真实终端逐字节会话。

- **建议**：由文本事件来源与自有序列化推导，可将“工具结果记录”和“终端字节流记录”分成明确类型，并为标准格式导出做独立官方解析验收；输出中显示缺失/截断。未验证假设是减少误用且使分享更可靠。用控制序列、连续工具流及官方工具解析对照，若事件含义或导出仍不一致则否定。

适合记录普通非敏感工具文本供本插件回放。先检查输出内容和截断，分享HTML前脱敏；需要真实终端保真或官方.cast互操作时先做独立验收。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

宿主会话日志包含更完整结构，真实asciinema CLI针对终端；插件便于工具文本回放，但不是两者完整替代。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：term_rec、term_play、term_cat录制/回放/文本提取。
- **事件监听**：按会话捕获tool/result及可选输入并处理生命周期。

**流程与依赖**

DSH tools/fs与session事件，编译依赖相邻宿主源码；HTML回放依赖浏览器，外部互操作未验证，工具输出本身可能包含凭据。

start绑定当前会话，收集后续tool/result文本，可插标记，stop写文件或step结束封存；play生成离线HTML，cat提取文本，最后人工检查范围与敏感内容。

**效果与成本**

首次配置构建与输出目录，持续内存/磁盘随容量限制增长，HTML可含敏感工具输出；没有带宽或排错效率实测。

便于复看工具结果与演示，但不构成执行环境复现、审计不可篡改记录或完整命令历史。

- **思考**：asciinema命名是否暗示超过实现的保真？来源是完成后的tool/result文本，丢失工具执行中真实终端流与光标状态；cast-io保存一个含events数组的JSON对象，由自身parseCast读取。README主动排除官方播放器互操作，故回放仅应承诺本插件文本时间轴，不能承诺PTY录屏或通用.cast兼容。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对复制工具日志，增量是将会话内文本、标记、时间和离线回放组织成可分享材料；默认不录输入且有容量限制。自写格式核心与播放器不依赖外部CLI，但不能据自解析往返证明官方互操作。

相对复制工具日志，增量是将会话内文本、标记、时间和离线回放组织成可分享材料；默认不录输入且有容量限制。自写格式核心与播放器不依赖外部CLI，但不能据自解析往返证明官方互操作。

会话注册表、生命周期解绑、容量封存、输入默认关闭与脚本转义可借鉴。录制时钟按事件到达而非执行实时，命令scope实际step/end；移植需明确范围，FS输出仍依赖宿主策略。 源码依据：[src/index.ts](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/index.ts)、[src/recorder.ts](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/recorder.ts)、[src/cast-core.ts](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/cast-core.ts)、[src/cast-io.ts](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/cast-io.ts)、[src/tools/play.ts](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/tools/play.ts)。

<a id="detail-section-5"></a>

### 主要限制

asciinema命名是否暗示超过实现的保真？来源是完成后的tool/result文本，丢失工具执行中真实终端流与光标状态；cast-io保存一个含events数组的JSON对象，由自身parseCast读取。README主动排除官方播放器互操作，故回放仅应承诺本插件文本时间轴，不能承诺PTY录屏或通用.cast兼容。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[988hj7tczd-oss/dsh-asciinema](https://github.com/988hj7tczd-oss/dsh-asciinema)
- **版本号**：0.1.1（[固定提交 c4786341](https://github.com/988hj7tczd-oss/dsh-asciinema/tree/c47863413886ffac9b66ee13a9ab276ab195d5d9)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/recorder.ts、src/cast-core.ts、src/cast-io.ts、src/tools/play.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：隔离会话验证跨会话隔离、文本/非文本、容量封存、step结束、命名/未命名dispose保存，以及HTML转义；另用官方工具验证导出，不用自parser自证兼容。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由文本事件来源与自有序列化推导，可将“工具结果记录”和“终端字节流记录”分成明确类型，并为标准格式导出做独立官方解析验收；输出中显示缺失/截断。未验证假设是减少误用且使分享更可靠。用控制序列、连续工具流及官方工具解析对照，若事件含义或导出仍不一致则否定。

隔离会话验证跨会话隔离、文本/非文本、容量封存、step结束、命名/未命名dispose保存，以及HTML转义；另用官方工具验证导出，不用自parser自证兼容。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：699f9c12e86620aaa9916e7e4c4dab4d7b8b5e4117d5b609322f1152cf082d96。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 246 | — | — | 2884 |
| .ts | source | 7 | 1478 | 1136 | 201 | — |
| .ts | test | 1 | 449 | 352 | 44 | — |

排除 2 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-asciinema/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
