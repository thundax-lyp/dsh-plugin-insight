# dsh-tts-flash

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[a23020b](https://github.com/2021Heei/dsh-tts-flash/tree/a23020b72a5c403e3dc50527b3ef43c6e55c739a)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2021Heei/dsh-tts-flash)
<!-- END META -->

> **实现功能**：为 DSH 流式回复提供语音朗读、字幕浮条及等待短语，支持 Edge 与 OpenAI 兼容语音服务。

> **核心亮点**：作者强调边生成边朗读与多引擎；README 和 speak-queue.ts 明示分句及队列改编自 MIT 的 dsh-voice，因此不把继承的流式朗读认作原创。本项增量在统一 TtsProvider、引擎声明与缓存等待音频的衔接：等待反馈和正文共享播放通道，正文入队后停止等待循环，减少维护多套语音状态的负担。

> **风险与缺陷**：最关键的问题是追赶速度是否牺牲用户必须听到的内容。SpeakQueue 的 MAX_PENDING=12，积压时 pending.shift() 丢弃最旧句；这保护内存、贴近当前输出，却意味着 README 的“无损”只能理解为不阻断模型流，不能理解为全文朗读无遗漏。相反，短回复或快引擎可能从不触发丢句，因此不能据此否定日常可用性。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
  - [1.7 源码索引](#detail-section-8)
- [2 未来设计假设（未验证）](#detail-section-9)
- [3 辅助信息](#detail-section-10)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合希望边听边看长回复的桌面用户；交付物是与当前会话对应的可中止音频及字幕，而非离线音频档案。

参照手动复制回复到 TTS 和项目声明的 dsh-voice：省去复制及固定引擎限制，但继承的分句和串行队列不是新算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **事件监听**：llm/stream旁路分句与正文入队
- **后台**：按会话串行合成、epoch取消及等待短语音频缓存
- **Host 路由**：语音配置、试听、取消与SSE音频推送

**流程与依赖**

必需 DSH 的 llm/stream、webServer 与浏览器 slots、React；默认 Edge 走微软网络服务且无公开 SLA，OpenAI 兼容服务需端点、模型和 API Key。引擎 JSON 含本地密钥，迁移不得作为普通设置公开分享。

开启朗读并选择引擎→发送问题→旁路分句入队→后台合成→SSE 音频与浮条→用户停止或继续。合成单句失败记录警告并继续，不会补回该句；停止通过 epoch 丢弃旧合成结果。

**效果与成本**

默认 Edge 不需用户密钥，但联网和非公开服务可用性是持续成本；云端 TTS 按供应商计费，失败句和等待短语首次生成也可能消耗额度。首次配置音色/自动播放权限和日常核对漏句耗费人工，未测单位任务价格或耗时。

把生成和收听重叠可能缩短开始收听的等待；上游合成慢时会转移为内容遗漏，收益取决于回复速度、音色合成速度和用户是否需要全文，尚无同条件节时数据。

> **思考**：最关键的问题是追赶速度是否牺牲用户必须听到的内容。SpeakQueue 的 MAX_PENDING=12，积压时 pending.shift() 丢弃最旧句；这保护内存、贴近当前输出，却意味着 README 的“无损”只能理解为不阻断模型流，不能理解为全文朗读无遗漏。相反，短回复或快引擎可能从不触发丢句，因此不能据此否定日常可用性。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：作者强调边生成边朗读与多引擎；README 和 speak-queue.ts 明示分句及队列改编自 MIT 的 dsh-voice，因此不把继承的流式朗读认作原创。本项增量在统一 TtsProvider、引擎声明与缓存等待音频的衔接：等待反馈和正文共享播放通道，正文入队后停止等待循环，减少维护多套语音状态的负担。

作者强调边生成边朗读与多引擎；README 和 speak-queue.ts 明示分句及队列改编自 MIT 的 dsh-voice，因此不把继承的流式朗读认作原创。本项增量在统一 TtsProvider、引擎声明与缓存等待音频的衔接：等待反馈和正文共享播放通道，正文入队后停止等待循环，减少维护多套语音状态的负担。

值得借鉴的是 src/speak-queue.ts 的 epoch 取消：不必等外部合成真正取消，就能抑制过时结果；移植需补浏览器正在播放音频的停止契约。provider 在 pump 开始时取一次，热切换引擎与旧 provider 延迟 dispose 的交互需用长队列验证，不能把统一接口当作所有引擎行为完全相同。

<a id="detail-section-5"></a>

### 1.4 主要限制

最关键的问题是追赶速度是否牺牲用户必须听到的内容。SpeakQueue 的 MAX_PENDING=12，积压时 pending.shift() 丢弃最旧句；这保护内存、贴近当前输出，却意味着 README 的“无损”只能理解为不阻断模型流，不能理解为全文朗读无遗漏。相反，短回复或快引擎可能从不触发丢句，因此不能据此否定日常可用性。

<a id="detail-section-6"></a>

### 1.5 使用建议

需要听当前回复的用户可先用非敏感短文试用，确认窗口切换、停止和自动播放正常；长回复必须对照文字检查是否跳句，不适合直接当完整有声文稿导出器。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持流式分句、队列取消和可替换语音引擎的集成贡献；朗读完整性和实时延迟尚无本次运行证据，下面的积压策略假设未实现、未验证。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/speak-queue.ts、src/segmenter.ts、src/providers/edge-tts.provider.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核查固定版本的 host 管线、队列、分句和 Edge provider；未运行语音服务、未测浏览器自动播放、未独立复核延迟或语言质量。
- 下一步：用同一100句文本固定生成速度，对比快/慢合成器和12句以上积压，记录句序、缺失数、首音延迟及停止后残留时长；完整模式若不减少遗漏或显著增加人工整理，则否定其增量。

**分析版本**

- **仓库**：[2021Heei/dsh-tts-flash](https://github.com/2021Heei/dsh-tts-flash)
- **版本号**：0.1.0（[固定提交 a23020b7](https://github.com/2021Heei/dsh-tts-flash/tree/a23020b72a5c403e3dc50527b3ef43c6e55c739a)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

### 1.7 源码索引

- [src/index.ts](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/index.ts)
- [src/speak-queue.ts](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/speak-queue.ts)
- [src/segmenter.ts](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/segmenter.ts)
- [src/providers/edge-tts.provider.ts](https://github.com/2021Heei/dsh-tts-flash/blob/a23020b72a5c403e3dc50527b3ef43c6e55c739a/src/providers/edge-tts.provider.ts)

<a id="detail-section-9"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：将“实时追赶”和“完整阅读”设为显式模式；前者展示跳过句数，后者缓存文本并允许稍后续读。推导依据是同一队列上限同时承担资源保护与内容选择，两种目标可以拆开；代价是本地文本保存和额外播放状态。

用同一100句文本固定生成速度，对比快/慢合成器和12句以上积压，记录句序、缺失数、首音延迟及停止后残留时长；完整模式若不减少遗漏或显著增加人工整理，则否定其增量。

<a id="detail-section-10"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 88 | 65 | 15 | — |
| .md | source | 1 | 138 | — | — | 1535 |
| .ts | source | 9 | 2129 | 1602 | 385 | — |
| .tsx | source | 2 | 1864 | 1609 | 179 | — |
| .mjs | test | 3 | 250 | 190 | 34 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/2021Heei/dsh-tts-flash/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
