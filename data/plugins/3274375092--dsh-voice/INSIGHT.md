# dsh-voice

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[de3911b](https://github.com/3274375092/dsh-voice/tree/de3911b18e4ecc9ec1bad7709c66c45b62c57f46)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/3274375092/dsh-voice) [![npm 30d 607](https://img.shields.io/static/v1?label=npm+30d&message=607&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@nn12138/dsh-voice) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@nn12138/dsh-voice)
<!-- END META -->

> **实现功能**：通过麦克风或快捷键把语音识别为 DSH 普通聊天输入。

> **核心亮点**：相对单一浏览器语音输入，提供本地离线模型与浏览器回退的统一输入路径，且不通过修改persona承接语音；模型真正加载后才声明native可用，避免仅目录存在就虚报能力。

> **风险与缺陷**：即使显式engine=native，resolveEngine在能力不足时也返回browser，隐私预期与实际引擎可能不同。Web Speech是否联网受浏览器实现影响，不能把自动回退概括为始终离线。LRU上限4会驱逐仍在说话的会话，导致一句话拆断。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
- [2 未来设计假设（未验证）](#detail-section-7)
- [3 辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：不便持续键盘输入的用户口述需求，期望最终文字准确提交到当前会话，并保留普通预设行为。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

参照浏览器Web Speech输入；ASR模型算法不是插件自身贡献，未做独立语音质量对照。

浏览器采集音频重采样后经RPC送宿主，原生sherpa模型与VAD按会话维护识别状态；host统一引擎决策，资源加载失败锁存并回退Web Speech。


浏览器麦克风权限、DSH连接RPC；原生路径需sherpa-onnx-node和模型，浏览器路径需Web Speech支持。

探测生效引擎，按键录音，经partial预览与final分段提交普通聊天消息；加载失败回退浏览器，原生会话满额按LRU驱逐。

原生模型下载约百MB为作者估计，现金还含本地计算；人工为模型安装、麦克风权限、误识别纠正与热键冲突，未测字错率或总输入时间。

降低文字输入操作负担，无法从实时partial显示推出准确率和省时。

**能力**

- **界面**：麦克风与热键语音输入
- **后台**：宿主原生ASR及浏览器回退，partial/final结果

> **思考**：即使显式engine=native，resolveEngine在能力不足时也返回browser，隐私预期与实际引擎可能不同。Web Speech是否联网受浏览器实现影响，不能把自动回退概括为始终离线。LRU上限4会驱逐仍在说话的会话，导致一句话拆断。

<a id="detail-section-4"></a>

### 1.3 工程贡献

engine资源状态机单飞加载并锁存失败，HostAsr独占解码与会话池；RPC边界统一错误翻译。复用需保留会话隔离、驱逐提示和引擎可见性。 源码依据：[src/core/engine.ts](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/core/engine.ts#L15)、[src/core/host-asr.ts](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/core/host-asr.ts#L39)、[src/client/voice-service.ts](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/client/voice-service.ts#L27)、[src/index.ts](https://github.com/3274375092/dsh-voice/blob/de3911b18e4ecc9ec1bad7709c66c45b62c57f46/src/index.ts#L59)。

> **亮点**：相对单一浏览器语音输入，提供本地离线模型与浏览器回退的统一输入路径，且不通过修改persona承接语音；模型真正加载后才声明native可用，避免仅目录存在就虚报能力。

<a id="detail-section-5"></a>

### 1.4 使用建议

先用非敏感内容核对生效引擎及识别质量；有严格本地要求时需核查回退行为，重要指令提交前复核文字。

**核查状态**：已实现机制有源码支持；贡献价值为条件性解释，未来设计假设未验证。本轮仅作固定版本源码核查，未安装、运行目标代码或验收宿主。

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[3274375092/dsh-voice](https://github.com/3274375092/dsh-voice)
- **版本号**：0.2.6（[固定提交 de3911b](https://github.com/3274375092/dsh-voice/tree/de3911b18e4ecc9ec1bad7709c66c45b62c57f46)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）
- **实际范围**：固定提交源码抽读与作者材料核查；没有执行目标代码、测试、安装或真实宿主验收，没有确认独立用户效果。
- **来源**：作者README与上述固定版本源码；未确认独立采用效果，目录收录与下载统计不作效果证据。

<a id="detail-section-7"></a>

## 2 未来设计假设（未验证）

待验证假设：把严格本地模式与允许回退模式分开，并在提交前显示生效引擎，可降低对语音去向的误解；源于统一决策器与回退反例，代价是离线失效时输入不可用。

最小验证：禁网、模型损坏、五会话并发和中英混输，对比严格本地与自动回退的引擎误认、尾词丢失及纠错工时；若显示模式仍无法预测音频路径则否定。

<a id="detail-section-8"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 439 | — | — | 4600 |
| .cjs | source | 5 | 308 | 250 | 41 | — |
| .mjs | source | 2 | 392 | 318 | 39 | — |
| .ts | source | 16 | 1418 | 996 | 318 | — |
| .tsx | source | 1 | 61 | 45 | 12 | — |
| .ts | test | 14 | 887 | 790 | 30 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/3274375092/dsh-voice/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
