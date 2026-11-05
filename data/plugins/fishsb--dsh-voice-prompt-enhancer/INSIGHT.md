# DSH Voice Prompt Enhancer

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[6642100](https://github.com/Fishsb/dsh-voice-prompt-enhancer/tree/66421001c11b31ebdbc011407ff5725fd1d78fa5)

<!-- BEGIN META -->
[![GitHub ★ 122](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=122&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Fishsb/dsh-voice-prompt-enhancer) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-voice-prompt-enhancer)
<!-- END META -->

> **功能**：为官方语音输入增加热键与停顿检测，并在发送前改写草稿

> **亮点**：[Q01](#research-q01) 将热键、语音清理和发送前草稿增强合入输入区。

> **主要限制**：[Q03](#research-q03) 浏览器包装与宿主控件耦合，外部模型可能处理草稿。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 具体改善哪个步骤？](#detail-section-11)
  - [Q02 · 插件怎样接入？](#detail-section-12)
  - [Q03 · 隐私和行为边界是什么？](#detail-section-13)
  - [Q04 · 怎样采用和退出？](#detail-section-14)
  - [Q05 · 怎样衡量是否值得用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：口述长提示词需要清理停顿、识别错误和模糊表达。

使用官方语音按钮并手工整理草稿。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 使用官方语音按钮并手工整理草稿。 | 可直接比较 | 保留人工步骤 |
| DSH Voice Prompt Enhancer | 将热键、语音清理和发送前草稿增强合入输入区。 | 浏览器包装与宿主控件耦合，外部模型可能处理草稿。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 沿用官方语音采集，通过浏览器桥增加停顿检测，增强阶段调用配置模型。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 口述长提示词需要清理停顿、识别错误和模糊表达。 | 保留原流程 |
| 试验 | 沿用官方语音采集，通过浏览器桥增加停顿检测，增强阶段调用配置模型。 | 观察固定版本 |
| 复核 | 固定版本分开验证语音、改写与退出。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 减少口述提示词整理时间且保留用户原意 | 口述增强能减少编辑时间且保留事实与意图。 | 固定版本分开验证语音、改写与退出。 |

> **思考**：[Q03](#research-q03) 浏览器包装与宿主控件耦合，外部模型可能处理草稿。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将热键、语音清理和发送前草稿增强合入输入区。

录音包装有恢复路径，模型链具备超时与有限重试。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 浏览器包装与宿主控件耦合，外部模型可能处理草稿。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 固定版本分开验证语音、改写与退出。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的减少口述提示词整理时间且保留用户原意。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/voice/official-bridge-module.cjs、src/host/enhance-generation.cjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的减少口述提示词整理时间且保留用户原意。未执行目标代码或实际宿主验证。
- 下一步：保留转写、优化前后草稿和时间线。

**分析版本**

- **仓库**：[Fishsb/dsh-voice-prompt-enhancer](https://github.com/Fishsb/dsh-voice-prompt-enhancer)
- **版本号**：3.5.0（[固定提交 6642100](https://github.com/Fishsb/dsh-voice-prompt-enhancer/tree/66421001c11b31ebdbc011407ff5725fd1d78fa5)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 口述增强能减少编辑时间且保留事实与意图。

保留转写、优化前后草稿和时间线。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 39 | 2015 | — | — | 127488 |
| .cjs | source | 75 | 22107 | 17042 | 4354 | — |
| .js | source | 1 | 6093 | 5074 | 762 | — |
| .mjs | source | 35 | 9008 | 5734 | 2950 | — |
| .cjs | test | 92 | 20587 | 15512 | 3845 | — |
| .js | example | 3 | 3 | 3 | 3 | — |
| .md | example | 3 | 64 | — | — | 1033 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Fishsb/dsh-voice-prompt-enhancer/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Fishsb/dsh-voice-prompt-enhancer/issues?q=is%3Aissue+created%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Fishsb/dsh-voice-prompt-enhancer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：减少口述提示词整理时间且保留用户原意

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 具体改善哪个步骤？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

口述长要求时，用户可从热键启动官方语音，停顿后回到草稿，再按需清理或优化。相比官方识别后手工整理，验收应检查专名、数量、否定词及输入框可编辑性，并确认发送仍由用户触发。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-34](https://github.com/Fishsb/dsh-voice-prompt-enhancer/blob/66421001c11b31ebdbc011407ff5725fd1d78fa5/README.md#L19-L34)

作者说明草稿优化和语音功能边界

<details>
<summary>查看原文（16行）</summary>

```text
## 能做什么

**提示词优化**

- ✨ **一键优化** — 改写当前草稿，可继续优化、可撤回、优化中可取消
- **5 种模式** — 基础 / 轻量 / 标准 / 专家 / 一键发布
- **记忆开关** — 发送前的多轮优化累积为记忆链，发送即清空（默认关）
- **模型链** — 多个模型按序尝试，可增删改序、开关思考、行内测连通性

**语音输入增强**（识别由 DSH 官方 `speechToText` 提供；插件不自带识别引擎、不下载模型）

- **两种入口** — 官方 🎤 按钮，或插件热键（点按开始 / 再按停止；长按 = 按住说、松开停）
- **静音监测** — 说完自动停，判定时长 1–5 秒可调（默认 2 秒），可整体关闭
- **清口水词** — 本地规则清理语气词 / 重复 / 拖音，不改写、不新增（默认开）
- **语音纠错** — 识别完成后做字词层订正，仅作用于语音路径（默认关）
- **自动增强** — 识别结果填入草稿后自动触发增强（默认关）
```

</details>

**依据 2 · 源码核查**：[src/client/voice/official-bridge-module.cjs:14-34](https://github.com/Fishsb/dsh-voice-prompt-enhancer/blob/66421001c11b31ebdbc011407ff5725fd1d78fa5/src/client/voice/official-bridge-module.cjs#L14-L34)

语音桥复用官方控件和停止语义

<details>
<summary>查看原文（21行）</summary>

```text
// P2-补做（2026-10-13 · CHG-011 / §4.6.2.6 · UD-0014 选 B）：官方录音路径增值桥。
// P2-补做·热键改走官方路径（2026-10-13 · UD-0016 · CHG-011）：
//   **热键 = 远程按一下官方录制按钮 = 一条链、一个状态** ⇒ 本桥新增**启动**能力
//   （`startOfficial()`：派发点击官方开始按钮），并把**停止**的第一优先改为
//   「派发点击官方停止按钮」（语义校验见下），插件自有采集链退居兜底。
//
// 目的：用户点**官方**麦克风按钮、或按**插件热键**时，本插件的两项增值——**静音监测（说完自动停）**
//   与**自动增强**——同样生效，且**走官方同一条链**（相位/电平/停止/上限/转写/写回全归官方）。
// 性质：**知情的高侵入方案**（§4.6.2.6 E5）——包装的是**浏览器标准 API**
//   （`navigator.mediaDevices.getUserMedia` / `MediaRecorder`），并对**官方渲染出来的按钮**
//   派发点击（等价用户按下）；**不改官方任何源码、不注入官方模块、不依赖其私有变量**
//   （官方只经公开 API 调用 ⇒ 不触红线）。
// 定位（UD-0014 第 2 条 / UD-0005 总纲）：**只做增值层的对齐**——采集/识别/写回**全部仍归官方**，
//   插件不接管、不遮蔽、不抢槽位、不恢复自建 🎤（否 C）。
//
// 三条不变量（改本文件时必须保持）：
//   ① **只观测不改行为**：`getUserMedia` 包装原样调用原函数、原样返回原结果（同一性保持，绝不改 stream / 不改参数）。
//   ② **停止必须走完官方链**：官方 `finish()`（相位收尾 → `capture.stop()` → 转写 → 写回）**只能**由
//      官方停止按钮触发 ⇒ 停止第一优先 = 派发点击官方停止按钮；`MediaRecorder.stop()` 仅是兜底
//      （实测语义：官方 `Recording.stop()` 不被 `MediaRecorder.stop()` 触发 ⇒ 单独调它**不会**走 `finish()`）。
//   ③ **不得静默失效**（§4.6.2.6 D）：任何一条失效都必须**可被用户看到**（设置页诊断区），不是只写日志。
```

</details>

#### 缺口

- 改写质量和启动便利不是同一收益。
  **影响**：可降低重复补充和编辑成本。
  **进一步探讨**：固定口述稿和关键词列表。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 插件怎样接入？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

语音桥包装 getUserMedia 和 MediaRecorder，并通过官方按钮实现启动和停止。草稿增强模型链独立，在配置空时返回明确错误，链路带总预算和可恢复的重试。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/voice/official-bridge-module.cjs:850-864](https://github.com/Fishsb/dsh-voice-prompt-enhancer/blob/66421001c11b31ebdbc011407ff5725fd1d78fa5/src/client/voice/official-bridge-module.cjs#L850-L864)

包装浏览器取麦入口

<details>
<summary>查看原文（15行）</summary>

```text
        });
        ovbNotify();
      } catch (e) { /* 观察失败不得影响官方链路 */ }
      return stream;
    }, (err) => { throw err; });
  }
  wrappedGetUserMedia.__dshPeWrapped = true;

  try { mediaDevices.getUserMedia = wrappedGetUserMedia; } catch (e) {
    b.abandonReason = 'get-user-media-wrap-failed';
    return false;
  }
  b.original = original;
  b.installed = true;
  ovbWrapRecorder();
```

</details>

**依据 2 · 源码核查**：[src/client/voice/official-bridge-module.cjs:900-925](https://github.com/Fishsb/dsh-voice-prompt-enhancer/blob/66421001c11b31ebdbc011407ff5725fd1d78fa5/src/client/voice/official-bridge-module.cjs#L900-L925)

包装录音器并提供复原

<details>
<summary>查看原文（26行）</summary>

```text
        const prev = inst.onstop;
        inst.onstop = function () { try { if (prev) prev.apply(this, arguments); } finally { clearIfSelf(); } };
      }
    } catch (e) { /* 捕获失败不影响官方实例本身 */ }
    return inst;
  }
  WrappedRecorder.prototype = Orig.prototype;
  for (const k of ['isTypeSupported']) { if (typeof Orig[k] === 'function') WrappedRecorder[k] = Orig[k].bind(Orig); }
  try { window.MediaRecorder = WrappedRecorder; } catch (e) {
    b.abandonReason = 'media-recorder-wrap-failed';
    return;
  }
  b.originalRecorder = Orig;
  b.wrappedRecorder = true;
}

// 卸载 / HMR：恢复原函数（同一性：恢复后 === 原函数），并把命名空间复位
function uninstallOfficialVoiceBridge() {
  const b = ovbBus();
  if (!b) return false;
  if (b.original && typeof navigator !== 'undefined' && navigator.mediaDevices) {
    try { navigator.mediaDevices.getUserMedia = b.original; } catch (e) { /* 忽略 */ }
  }
  if (b.wrappedRecorder && b.originalRecorder) {
    try { window.MediaRecorder = b.originalRecorder; } catch (e) { /* 忽略 */ }
  }
```

</details>

**依据 3 · 源码核查**：[src/host/enhance-generation.cjs:33-54](https://github.com/Fishsb/dsh-voice-prompt-enhancer/blob/66421001c11b31ebdbc011407ff5725fd1d78fa5/src/host/enhance-generation.cjs#L33-L54)

空模型链及重试上限

<details>
<summary>查看原文（22行）</summary>

```text
    async function enhanceStageLlm(state) {
      const sessionId = state.sessionId;
      const seq = state.seq;
      const rec = state.rec;
      let chain = state.chain.slice();
      const system = state.system;
      const messages = state.messages;
      const isPublish = state.isPublish;
      const maxTokens = state.maxTokens;
      const outputLimit = state.outputLimit;
      let lastFailure = null;
      // 2026-08-18（用户需求·删内置兜底链）：模型链为空 → 明确报「未配置模型」（不自适应补足）
      if (chain.length === 0) {
        state.enhanceCandidate = { code: 'NO_MODEL', message: friendlyMessage({ code: 'NO_MODEL' }) };
        return state;
      }
      // v3.3.3（2026-08-27 用户实测·增强易断链修复）：外层 pass 循环——首轮整链耗尽后
      // 整体重试一次（最多 2 pass），瞬时限流/慢首字/网络抖动自愈；重试轮不再挂看门狗、
      // 不走探测缓存（直接真实生成），杜绝「探测判死 → 冻结整链 → 连续失败」；
      // 总预算仍由外层 timeoutMs 计时器兜底（rec.timedOut 立即中断，不无限重试）。
      for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < chain.length; i++) {
```

</details>

#### 缺口

- 宿主按钮和浏览器 API 能力变化影响接入。
  **影响**：语音采集、停录和草稿生成应分别排查。
  **进一步探讨**：模拟权限拒绝、无模型与模型超时。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 隐私和行为边界是什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

官方承担语音识别，草稿增强使用配置模型。关闭自动增强并不改变官方 ASR 数据流。直接触发 MediaRecorder.stop 的兜底与点官方按钮的收尾不同，不能仅用麦克风已关闭判断结果写回。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-34](https://github.com/Fishsb/dsh-voice-prompt-enhancer/blob/66421001c11b31ebdbc011407ff5725fd1d78fa5/README.md#L28-L34)

作者区分语音识别和可选增强

```text
**语音输入增强**（识别由 DSH 官方 `speechToText` 提供；插件不自带识别引擎、不下载模型）

- **两种入口** — 官方 🎤 按钮，或插件热键（点按开始 / 再按停止；长按 = 按住说、松开停）
- **静音监测** — 说完自动停，判定时长 1–5 秒可调（默认 2 秒），可整体关闭
- **清口水词** — 本地规则清理语气词 / 重复 / 拖音，不改写、不新增（默认开）
- **语音纠错** — 识别完成后做字词层订正，仅作用于语音路径（默认关）
- **自动增强** — 识别结果填入草稿后自动触发增强（默认关）
```

**依据 2 · 作者声明**：[README.md:44-53](https://github.com/Fishsb/dsh-voice-prompt-enhancer/blob/66421001c11b31ebdbc011407ff5725fd1d78fa5/README.md#L44-L53)

作者标出外部 LLM

<details>
<summary>查看原文（10行）</summary>

```text
| 模型配置 | 模型链；语音识别：热键、静音监测（1–5 秒）、清口水词、语音纠错、自动增强 |
| 优化参数 | 优化模式、模板、记忆开关、上下文预算、超时 / 回复长度 / 输出上限 |

录音采集、识别与写回都由 DSH 官方语音控件完成，插件只叠加上述增值。录音不落盘。

![语音输入](docs/screenshots/voice-main.png)

[Releases](https://github.com/Fishsb/dsh-voice-prompt-enhancer/releases) · [CHANGELOG](CHANGELOG.md) · [兼容性说明](docs/compatibility-matrix.md) · Licensed under [Apache-2.0](LICENSE)

> 隐私：插件不记录、不上报任何数据；增强结果来自外部 LLM，发送前请自行核对。
```

</details>

**依据 3 · 源码核查**：[src/client/voice/official-bridge-module.cjs:26-37](https://github.com/Fishsb/dsh-voice-prompt-enhancer/blob/66421001c11b31ebdbc011407ff5725fd1d78fa5/src/client/voice/official-bridge-module.cjs#L26-L37)

官方停止流程与录音器兜底不同

<details>
<summary>查看原文（12行）</summary>

```text
// 定位（UD-0014 第 2 条 / UD-0005 总纲）：**只做增值层的对齐**——采集/识别/写回**全部仍归官方**，
//   插件不接管、不遮蔽、不抢槽位、不恢复自建 🎤（否 C）。
//
// 三条不变量（改本文件时必须保持）：
//   ① **只观测不改行为**：`getUserMedia` 包装原样调用原函数、原样返回原结果（同一性保持，绝不改 stream / 不改参数）。
//   ② **停止必须走完官方链**：官方 `finish()`（相位收尾 → `capture.stop()` → 转写 → 写回）**只能**由
//      官方停止按钮触发 ⇒ 停止第一优先 = 派发点击官方停止按钮；`MediaRecorder.stop()` 仅是兜底
//      （实测语义：官方 `Recording.stop()` 不被 `MediaRecorder.stop()` 触发 ⇒ 单独调它**不会**走 `finish()`）。
//   ③ **不得静默失效**（§4.6.2.6 D）：任何一条失效都必须**可被用户看到**（设置页诊断区），不是只写日志。
//
// 与自建采集链的关系（UD-0016 第 2 条）：自建采集链已**退役**（`recorder.js`/热键模块不再自行
//   取麦、录音、停止、调 `voice/transcribe`）⇒ **不再需要「自控采集」互斥**；但 `setSelfCapture`
```

</details>

#### 缺口

- 宿主 ASR 或模型可处理敏感草稿。
  **影响**：用户应能看到停录后有无转写。
  **进一步探讨**：用虚构语音验证网络去向、停录和草稿。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样采用和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

使用固定发行版及隔离 Web profile，先关闭自动增强、语音纠错和记忆，再逐一打开。初次配置麦克风与模型，持续成本含模型尝试和人工核对。退出停用或卸载后重启，确认官方按钮可用且浏览器包装解除。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-17](https://github.com/Fishsb/dsh-voice-prompt-enhancer/blob/66421001c11b31ebdbc011407ff5725fd1d78fa5/README.md#L9-L17)

作者提供安装、移除和宿主条件

````text
## 安装

```sh
dsh plugin --profile web add github:Fishsb/dsh-voice-prompt-enhancer#v3.4.2
dsh plugin --profile web update dsh-voice-prompt-enhancer   # 更新
dsh plugin --profile web remove dsh-voice-prompt-enhancer   # 卸载
```

装完（或更新 / 卸载后）重启 DSH，输入框工具行出现 ✨ 即安装成功。需本机已装 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) **≥ 0.1.0-rc.6** 且 `pnpm` 在 PATH 中。
````

**依据 2 · 作者声明**：[README.md:23-34](https://github.com/Fishsb/dsh-voice-prompt-enhancer/blob/66421001c11b31ebdbc011407ff5725fd1d78fa5/README.md#L23-L34)

作者说明模型链和默认开关

<details>
<summary>查看原文（12行）</summary>

```text
- ✨ **一键优化** — 改写当前草稿，可继续优化、可撤回、优化中可取消
- **5 种模式** — 基础 / 轻量 / 标准 / 专家 / 一键发布
- **记忆开关** — 发送前的多轮优化累积为记忆链，发送即清空（默认关）
- **模型链** — 多个模型按序尝试，可增删改序、开关思考、行内测连通性

**语音输入增强**（识别由 DSH 官方 `speechToText` 提供；插件不自带识别引擎、不下载模型）

- **两种入口** — 官方 🎤 按钮，或插件热键（点按开始 / 再按停止；长按 = 按住说、松开停）
- **静音监测** — 说完自动停，判定时长 1–5 秒可调（默认 2 秒），可整体关闭
- **清口水词** — 本地规则清理语气词 / 重复 / 拖音，不改写、不新增（默认开）
- **语音纠错** — 识别完成后做字词层订正，仅作用于语音路径（默认关）
- **自动增强** — 识别结果填入草稿后自动触发增强（默认关）
```

</details>

**依据 3 · 源码核查**：[src/client/voice/official-bridge-module.cjs:914-925](https://github.com/Fishsb/dsh-voice-prompt-enhancer/blob/66421001c11b31ebdbc011407ff5725fd1d78fa5/src/client/voice/official-bridge-module.cjs#L914-L925)

卸载路径恢复浏览器 API

<details>
<summary>查看原文（12行）</summary>

```text
}

// 卸载 / HMR：恢复原函数（同一性：恢复后 === 原函数），并把命名空间复位
function uninstallOfficialVoiceBridge() {
  const b = ovbBus();
  if (!b) return false;
  if (b.original && typeof navigator !== 'undefined' && navigator.mediaDevices) {
    try { navigator.mediaDevices.getUserMedia = b.original; } catch (e) { /* 忽略 */ }
  }
  if (b.wrappedRecorder && b.originalRecorder) {
    try { window.MediaRecorder = b.originalRecorder; } catch (e) { /* 忽略 */ }
  }
```

</details>

#### 缺口

- 未验证卸载和失焦后的清理。
  **影响**：长期维护受宿主 UI 变更影响。
  **进一步探讨**：记录启停前后同一权限及控件状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样衡量是否值得用？

**研究主题**：新假设与验证

#### 完整回答

用相同口述语料比较官方输入、只开静音与清理、再加模型增强，记录误停、漏字、纠错、意图和耗时。注入远程超时，在请求途中手动改草稿。若丢失人工改动、误停变多、关键数字或否定词失真，或整理时间没有改善，当前配置的收益不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/voice/official-bridge-module.cjs:41-55](https://github.com/Fishsb/dsh-voice-prompt-enhancer/blob/66421001c11b31ebdbc011407ff5725fd1d78fa5/src/client/voice/official-bridge-module.cjs#L41-L55)

静音判断依赖噪声底和迟滞

<details>
<summary>查看原文（15行）</summary>

```text
// ⚠ 2026-10-17（判停修复批 · CHG-178）：**绝对阈值下界 OVB_THRESHOLD = 0.025 已拆除**。
//   它不是调小一点就能完事的参数：作为 Math.max() 的下界，它让阈值在底噪 < 0.01 时
//   **完全不再跟随底噪** ⇒ 正常/偏小音量过不了门（用户必须很大声），并被 heardSpeech 闩锁
//   放大成「一降就停」。⇒ 判据改为**相对量**（噪声底 × 倍率），下限改为**与测量分辨率挂钩**。
//   ⚠ 拆的是「绝对下限」这一形态，不是换一个更小的常数（那只是把复发点挪位置）。
const OVB_NOISE_FACTOR = 2.5;          // 开阈倍率（阈值 = 噪声底 × 该值；语义仍为相对倍率）
const OVB_HYSTERESIS = 0.6;            // 关阈 = 开阈 × 该系数（迟滞带内的帧不累计静音 = hangover）
const OVB_THRESHOLD_MAX = 0.2;         // 阈值上限（语义不变）
const OVB_QUANT_STEP_8BIT = 1 / 256;   // 8-bit 路径的 **RMS 分辨率** ≈ 一个幅度台阶(1/128)的一半
const OVB_FLOAT_RESOLUTION = 1 / 32768; // float32 容器的有效分辨率 = 16-bit PCM 台阶（2^-15）
//   ⚠ 依据：MediaStreamTrack 虽以 float32 传输，但采集设备的分辨率上限就是 16-bit；
//     float32 容器不会凭空产生更多可测台阶 ⇒ 拿设备分辨率作下限，才谈得上量得出来。
const OVB_RESOLUTION_STEPS = 1;        // 阈值下限 = 分辨率 × 该步数（低于一个台阶的阈值量不出来）
// 噪声底 = **滑动最小值**（最近 N 帧的最小值；不是只降不升，也不是双向自由跟随）
const OVB_NOISE_WINDOW = 100;          // 100 帧 = 10 s @100ms/帧
```

</details>

**依据 2 · 源码核查**：[src/host/enhance-generation.cjs:44-54](https://github.com/Fishsb/dsh-voice-prompt-enhancer/blob/66421001c11b31ebdbc011407ff5725fd1d78fa5/src/host/enhance-generation.cjs#L44-L54)

模型链错误和重试行为可对照

<details>
<summary>查看原文（11行）</summary>

```text
      // 2026-08-18（用户需求·删内置兜底链）：模型链为空 → 明确报「未配置模型」（不自适应补足）
      if (chain.length === 0) {
        state.enhanceCandidate = { code: 'NO_MODEL', message: friendlyMessage({ code: 'NO_MODEL' }) };
        return state;
      }
      // v3.3.3（2026-08-27 用户实测·增强易断链修复）：外层 pass 循环——首轮整链耗尽后
      // 整体重试一次（最多 2 pass），瞬时限流/慢首字/网络抖动自愈；重试轮不再挂看门狗、
      // 不走探测缓存（直接真实生成），杜绝「探测判死 → 冻结整链 → 连续失败」；
      // 总预算仍由外层 timeoutMs 计时器兜底（rec.timedOut 立即中断，不无限重试）。
      for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < chain.length; i++) {
```

</details>

**依据 3 · 作者声明**：[README.md:23-34](https://github.com/Fishsb/dsh-voice-prompt-enhancer/blob/66421001c11b31ebdbc011407ff5725fd1d78fa5/README.md#L23-L34)

作者描述人工控制和默认状态

<details>
<summary>查看原文（12行）</summary>

```text
- ✨ **一键优化** — 改写当前草稿，可继续优化、可撤回、优化中可取消
- **5 种模式** — 基础 / 轻量 / 标准 / 专家 / 一键发布
- **记忆开关** — 发送前的多轮优化累积为记忆链，发送即清空（默认关）
- **模型链** — 多个模型按序尝试，可增删改序、开关思考、行内测连通性

**语音输入增强**（识别由 DSH 官方 `speechToText` 提供；插件不自带识别引擎、不下载模型）

- **两种入口** — 官方 🎤 按钮，或插件热键（点按开始 / 再按停止；长按 = 按住说、松开停）
- **静音监测** — 说完自动停，判定时长 1–5 秒可调（默认 2 秒），可整体关闭
- **清口水词** — 本地规则清理语气词 / 重复 / 拖音，不改写、不新增（默认开）
- **语音纠错** — 识别完成后做字词层订正，仅作用于语音路径（默认关）
- **自动增强** — 识别结果填入草稿后自动触发增强（默认关）
```

</details>

#### 缺口

- 暂无独立口述对照。
  **影响**：可分离识别错误和增强改写错误。
  **进一步探讨**：保留转写、优化前后草稿和时间线。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
