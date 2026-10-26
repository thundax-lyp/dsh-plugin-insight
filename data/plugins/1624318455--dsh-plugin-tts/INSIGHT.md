# dsh-plugin-tts

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[5b09401](https://github.com/1624318455/dsh-plugin-tts/tree/5b094011dfba35a1d30d44a18d2b411654e8fff8)

<!-- BEGIN META -->
[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-tts) [![npm 30d 2,693](https://img.shields.io/static/v1?label=npm+30d&message=2%2C693&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@memef1f1y/dsh-plugin-tts)
<!-- END META -->

> **实现功能**：为DSH Web消息提供手动与自动朗读，支持Edge、Cloud及多种本地音色和长文本分块播放。

> **核心亮点**：把宿主消息生命周期、可取消渐进式长读、多本地/云后端和分层设置组合为同一工作流；贡献在交互与恢复接线，不在语音模型本身。详见[Q02](#research-q02)、[Q03](#research-q03)。

> **风险与缺陷**：零配置 Edge 与自动回退会外发文本，本地音色又转移模型、端口和资源维护；端点、Host slot 或服务方言变化都可能破坏核心体验。详见[Q04](#research-q04)、[Q05](#research-q05)。

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
  - [Q01 · 语音插件服务谁的什么任务，合格结果是什么？](#detail-section-11)
  - [Q02 · 从消息到音频播放的主链路怎样实现？](#detail-section-12)
  - [Q03 · 相对系统朗读或单一 TTS 接口，具体增加了什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使核心价值不成立？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复依赖什么？](#detail-section-15)
  - [Q06 · 一次合格朗读和持续使用的总成本如何判断？](#detail-section-16)
  - [Q07 · 实现有哪些可复用设计与维护风险？](#detail-section-17)
  - [Q08 · 由当前贡献和限制可推导什么新方向？](#detail-section-18)
  - [Q09 · 对什么人值得观察或试用，停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要在 DSH Web 中听取回答、无障碍访问或减少盯屏时间的用户，将消息、选中文本和可选审批事件转为可控音频；合格结果需完整、可停止且失败不阻塞会话。详见[Q01](#research-q01)。

比较基线为系统/浏览器朗读与复制到单一TTS服务。插件减少消息搬运并增加渐进播放，但引入Host路由和多服务维护；无同条件效果对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 消息朗读 | 手动、自动或选中内容播放 | DSH web与浏览器音频可用 |
| 长文本播放 | 渐进分块、暂停、调速和取消 | 听感与段间隙未实测 |
| 多语音后端 | 在线或本地音色选择 | 各自网络、密钥、服务或模型 |
| 下载与缓存 | 保存短音频并复用会话缓存 | 长分块读不导出单文件 |
| 诊断与提醒 | 检查服务并播报审批事件 | 提醒默认关闭，任务完成未覆盖 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web与Node>=22 | 必需 | Host路由、WebSocket与Client slots | 插件不加载或界面缺失 |
| 网络与Edge端点 | Edge必需 | 默认在线合成 | 无法朗读，需选择其他提供者 |
| Cloud密钥 | Cloud才必需 | Google Cloud TTS | 该提供者不可用 |
| 本地服务/模型/参考音频 | 对应本地音色必需 | RVC、Index-TTS2、CosyVoice | 需回退或停止 |
| 浏览器音频策略与设备 | 实际播放必需 | 解锁和输出音频 | 合成成功也可能无声 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选择数据可外发范围和提供者 | 明确本地/外部路由 |
| 加载 | 在web profile安装并重启 | 消息按钮和设置页可见 |
| 验证 | 先短文本，再长文本与停止 | 完整播放、无重复漏段 |
| 扩展 | 按需配置一个本地或Cloud后端 | 诊断成功且边界可接受 |
| 恢复 | 停止任务、检查错误后显式回退 | 不静默改变数据流向 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Edge联网；Cloud密钥；本地模型磁盘/CPU/GPU | 安装、选音色、按需启动服务 | 费用、耗时与设备基线未知 |
| 持续使用 | 合成流量、Cloud调用、本地推理与缓存 | 监听失败、升级端点、核对数据流向 | 无单位合格朗读实测 |
| 失败恢复 | 重试、回退、临时文件与模型服务重启 | 定位网络/端口/模型/宿主slot | 回退可能改变隐私边界 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 消息内朗读 | Client有按钮、自动开关和选中文本入口 | 真实宿主可见性与可访问性 |
| 长文本 | 分块、预热、取消和进度机制存在 | 段间间隙、漏读与首音时间 |
| 多后端 | Host有Edge/Cloud/三类本地服务路由 | 服务兼容、音质和稳定性 |
| 故障处理 | 超时、重试、toast与显式回退路径 | 真实网络/模型故障恢复率 |

> **思考**：零配置 Edge 与自动回退会外发文本，本地音色又转移模型、端口和资源维护；端点、Host slot 或服务方言变化都可能破坏核心体验。详见[Q04](#research-q04)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把宿主消息生命周期、可取消渐进式长读、多本地/云后端和分层设置组合为同一工作流；贡献在交互与恢复接线，不在语音模型本身。详见[Q02](#research-q02)、[Q03](#research-q03)。

把宿主消息生命周期、可取消渐进式长读、多本地/云后端和分层设置组合为同一工作流；贡献在交互与恢复接线，不在语音模型本身。详见[Q02](#research-q02)、[Q03](#research-q03)。

Host/Client职责和显式job取消值得复用，设置敏感项与UI偏好分层也降低浏览器数据丢失影响。风险是两个主文件规模大、多提供者与路由集中、Edge私有协议常量和宿主slot均是维护热点；静态故障分支不等于运行可靠。

<a id="detail-section-5"></a>

### 1.4 主要限制

零配置 Edge 与自动回退会外发文本，本地音色又转移模型、端口和资源维护；端点、Host slot 或服务方言变化都可能破坏核心体验。详见[Q04](#research-q04)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议先小范围试用。用非敏感短文本核对按钮、停止、自动播放和错误提示，再单独验证长文本；纯本地场景关闭外部回退，逐一加入所需音色。出现未经确认外发、重复漏读、取消不释放或宿主入口失效时停用。详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 Host/Client 接线、多提供者路由、长文本分块和取消；未运行插件、音频服务或真实宿主，听感、兼容、隐私边界和收益仍为待验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.mjs、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码检查 README、包清单、Host 路由/worker/分块、Client slot/播放路径；未穷尽所有设置字段、第三方服务协议或音频质量，不运行目标。
- 下一步：最小验证固定宿主、设备和中英长短文本，测首音、完整率、段间隙、取消延迟、资源与人工恢复；制造本地服务故障并核对是否外发。

**分析版本**

- **仓库**：[1624318455/dsh-plugin-tts](https://github.com/1624318455/dsh-plugin-tts)
- **版本号**：0.6.7（[固定提交 5b09401](https://github.com/1624318455/dsh-plugin-tts/tree/5b094011dfba35a1d30d44a18d2b411654e8fff8)）
- **版本日期**：2026-10-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索逐任务“数据流向收据”，按敏感级别确认本地故障后的外部回退，并记录延迟、失败与取消；先做影子记录比较误路由和确认负担。未实现。详见[Q08](#research-q08)。

最小验证固定宿主、设备和中英长短文本，测首音、完整率、段间隙、取消延迟、资源与人工恢复；制造本地服务故障并核对是否外发。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 3403 | — | — | 44199 |
| .js | source | 1 | 7165 | 6548 | 659 | — |
| .mjs | source | 3 | 3703 | 3154 | 479 | — |
| .mjs | test | 9 | 2486 | 2043 | 360 | — |
| .md | test | 1 | 45 | — | — | 626 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/1624318455/dsh-plugin-tts/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断多提供者消息朗读集成的真实增量、数据流向与维护边界，并提出可证伪的安全路由方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 语音插件服务谁的什么任务，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

它面向在 DSH Web 中需要听取回答、无障碍访问或减少盯屏时间的用户，把已完成的助手消息、选中文本和可选审批事件转换为可控音频。合格结果不是“接口返回成功”，而是目标文本被正确清洗、以所选音色完整播放，用户能暂停、停止、调速，并且失败不会阻塞会话。原有办法是浏览器或系统朗读、复制到独立 TTS 工具；插件的增量是把消息级操作、自动朗读和多提供者配置嵌入宿主界面。源码级研究不能证明任一语音服务在用户网络、模型与设备上稳定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:29-58](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/README.md#L29-L58)

作者列出消息按钮、自动朗读、多提供者和设置面板。

<details>
<summary>查看原文（30行）</summary>

```text
# dsh-plugin-tts — Edge TTS + RVC / Index-TTS2 / CosyVoice / Cloud voices for DeepSeek Harness

A dual-sided (Host + Web UI) DeepSeek Harness plugin that reads assistant replies
aloud — Microsoft Edge's free online TTS out of the box, **your own RVC voice
models** for custom voices, **local Index-TTS2 reference-audio voices**,
**local CosyVoice zero-shot prompt clones** (CosyVoice-2.0-0.5B), or
**paid Google Cloud TTS voices** (Chinese Standard/Wavenet). Long replies stream
with **gapless adaptive chunked playback**; voices install **one-click from a
voice-pack registry**; a **portable RVC runtime** means no RVC WebUI install is needed.

> 📖 **First time? See the [user guide (执行手册)](docs/USER-GUIDE.md)** — every step
> covers "what / how / how to tell it worked": read-aloud, RVC voices and
> voice-pack downloads.

## Features

1. **Read-aloud button** on every finalized assistant message (in the
   copy / feedback / branch action row): click to speak that message (the
   button shows an animated equalizer), click again to stop.
2. **Auto-read toggle** in the composer tool row (between the command and the
   access-mode buttons): when on, every newly completed assistant reply is
   read aloud automatically (the toggle gets a circular highlight); when off,
   nothing is auto-read.
3. **Voice settings panel** under 设置 → 插件 → 语音:
    - **TTS provider**: Edge TTS (free, no API key) / custom RVC voice /
      local Index-TTS2 voice / local CosyVoice clone / Google Cloud TTS (paid, API key)
    - **Voice**: 22 live-verified Edge TTS voices (default 晓萱 zh-CN-XiaoxuanNeural);
      8 Cloud voices in the cmn-CN group (default cmn-CN-Wavenet-A, free-form id allowed)
    - **Sound tuning**: rate / pitch / volume (0 = default, shared by Edge & Cloud)
    - **RVC config**: service URL + model (.pth) / index (.index) picker, base voice,
```

</details>

**依据 2 · 源码核查**：[lib/client.js:3384-3438](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/lib/client.js#L3384-L3438)

客户端通过宿主 slots 注入覆盖层和交互入口。

<details>
<summary>查看原文（55行）</summary>

```text
      slots.inject("shell.overlay", () =>
        slots.register(
          { name: "shell.overlay", key: "tts-audio-host", id: "tts-audio-host", order: 1000 },
          TtsAudioHost,
        ),
      );

      // ---------- toast host (transient notifications in shell.overlay) ----------
      function TtsToastHost() {
        useI18n();
        useSharedForce();
        const toast = shared.toast;
        if (!toast) return null;
        const node = react.createElement(
          "div",
          { className: "dsh-tts-toast dsh-tts-toast-" + toast.kind, role: "alert" },
          react.createElement("span", { className: "dsh-tts-toast-text" }, toast.text),
          toast.action
            ? react.createElement(
                "button",
                {
                  type: "button",
                  className: "dsh-tts-toast-action",
                  onClick: () => {
                    const fn = toast.action.onClick;
                    dismissToast();
                    if (typeof fn === "function") fn();
                  },
                },
                toast.action.label,
              )
            : null,
          react.createElement(
            "button",
            {
              type: "button",
              className: "dsh-tts-toast-close",
              "aria-label": t("toast.dismiss"),
              onClick: dismissToast,
            },
            "✕",
          ),
        );
        return node;
      }
      slots.inject("shell.overlay", () =>
        slots.register(
          { name: "shell.overlay", key: "tts-toast-host", id: "tts-toast-host", order: 1001 },
          TtsToastHost,
        ),
      );

      // ---------- approval alert poller (invisible, in shell.overlay) ----------
      // Polls /dsh-tts-api/notify?s=N every few seconds for new approval events
      // and announces them aloud. The first successful poll only syncs the
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从消息到音频播放的主链路怎样实现？

**研究主题**：功能与机制

#### 完整回答

Host 注入 webServer 并注册 speak、音频、分块任务、配置、诊断和本地服务代理路由；客户端从消息动作读取清洗后的文本，经 fetch 请求合成。短文本返回单一音频 URL，长文本按提供者能力切块并由客户端逐块预取、通过 Web Audio 调度衔接；停止或切换会取消活动任务。Edge 路径由 Node 子进程执行内嵌 WebSocket 协议，其他提供者通过本地服务或 Cloud API。静态接线可见，但本轮未启动服务器或播放音频。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:1-25](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/lib/index.mjs#L1-L25)

Host 文件声明主要路由并注入 webServer。

<details>
<summary>查看原文（25行）</summary>

```text
// @memef1f1y/dsh-plugin-tts — Host half.
// Registers webServer routes:
//   POST /dsh-tts-api/speak            { text, voice } -> { url | jobId+chunks } | { error }
//   GET  /dsh-tts-audio/<id>                              -> audio bytes
//   GET  /dsh-tts-api/rvc-next?job=<id>                   -> { url, more } | { done }
//   GET  /dsh-tts-api/rvc-files?baseUrl=&kind=            -> { files }
//   POST /dsh-tts-api/rvc-compact-index                   -> compact .index
//   GET  /dsh-tts-api/rvc-packs?registry=<url>            -> { packs } (voice-pack manifest)
//   GET  /dsh-tts-api/rvc-packs-installed                 -> { installed }
//   POST /dsh-tts-api/rvc-pack-install {registry, packId} -> download+sha256-verify+install
// Synthesis runs a zero-dependency Edge TTS worker via `node -e`
// (Sec-MS-GEC query-param protocol, mirroring node-edge-tts@1.2.10;
// 2026-10 v1->v2 migration per rany2/edge-tts#490: WSS host is now
// api.msedgeservices.com with Ocp-Apim-Subscription-Key, legacy token kept).
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import tls from 'node:tls';
import os from 'node:os';
import path from 'node:path';

export const name = 'tts';
export const inject = ['webServer'];
```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:2203-2245](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/lib/index.mjs#L2203-L2245)

speak 路由接收并分派合成请求。

<details>
<summary>查看原文（43行）</summary>

```text
  const speakDisposer = webServer.register({
    kind: 'exact',
    path: '/dsh-tts-api/speak',
    async handler(req, res) {
      const t0 = Date.now();
      let dbg = null; // { provider, voice, textLen } for the error log below
      try {
        let body = '';
        for await (const chunk of req) body += chunk;
        let parsed = {};
        try { parsed = JSON.parse(body); } catch (e) { /* fall through */ }
        const text = String((parsed && parsed.text) || '').trim();
        if (!text) {
          writeJson(res, 400, { error: 'empty text' });
          return;
        }
        const voice = String((parsed && parsed.voice) || 'zh-CN-XiaoxuanNeural');
        const provider = String((parsed && parsed.provider) || 'edge-tts');
        const custom = (parsed && parsed.custom) || null;
        const prosody = (parsed && parsed.prosody) || null;
        dbg = { provider, voice, textLen: text.length };
        const cfg = provider === 'rvc' ? rvcConfig(custom) : null;
        const indexCfg = provider === 'index-tts2' ? indexTts2Config(custom, voice) : null;
        const cosyCfg = provider === 'cosyvoice' ? cosyConfig(custom, voice) : null;
        {
          // Model/reference identity for triage (basenames only — never full
          // paths, never key material).
          const base = (p) => String(p || '').split(/[\\/]/).pop().slice(0, 80);
          if (provider === 'rvc' && cfg) {
            if (cfg.model) dbg.model = base(cfg.model);
            if (cfg.index) dbg.index = base(cfg.index);
          } else if ((provider === 'index-tts2' || provider === 'cosyvoice') && custom && custom.voice) {
            dbg.ref = base(custom.voice);
          } else if (provider === 'local-piper' && custom && custom.piperModel) {
            dbg.model = base(custom.piperModel);
          }
        }
        const cloudVoice = provider === 'google-cloud-tts'
          ? (String((custom && custom.voice) || voice || CLOUD_TTS_DEFAULTS.voice).trim() || CLOUD_TTS_DEFAULTS.voice)
          : null;
        const providerKey = provider === 'rvc'
          ? 'rvc|' + rvcFingerprint(cfg)
          : provider === 'index-tts2'
```

</details>

**依据 3 · 源码核查**：[lib/client.js:2270-2310](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/lib/client.js#L2270-L2310)

客户端调用 speak 并处理播放请求。

<details>
<summary>查看原文（41行）</summary>

```text
        const edgeOnly = useProvider === "edge-tts";
        const ctrl = edgeOnly ? new AbortController() : null;
        const timer = edgeOnly
          ? setTimeout(() => { try { ctrl.abort(); } catch (e) {} }, 55000)
          : null;
        const t0 = Date.now();
        const logSpeak = (ok, error, extra) => logDiag(Object.assign({
          kind: "speak",
          provider: useProvider,
          voice,
          textLen: String(text).length,
          ms: Date.now() - t0,
          ok: !!ok,
          error: String(error || "").slice(0, 200),
        }, extra || {}));
        try {
          const response = await fetch("/dsh-tts-api/speak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            ...(edgeOnly ? { signal: ctrl.signal } : {}),
          });
          const result = await response.json();
          logSpeak(!(result && result.error), result && result.error, { cached: !!(result && result.cached) });
          return result;
        } catch (e) {
          if (edgeOnly && e && e.name === "AbortError") {
            logSpeak(false, "abort-timeout-55s");
            throw new Error(t("err.synthTimeout"));
          }
          logSpeak(false, (e && e.message) || e);
          throw e;
        } finally {
          if (timer) clearTimeout(timer);
        }
      }

      async function fetchNextChunk(jobId, token) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 200000);
        try {
```

</details>

#### 缺口

- 未在真实浏览器测量首包、断句和无缝衔接。
  **影响**：不能确认不同文本和提供者的听感、延迟与中断一致性。
  **进一步探讨**：用固定长短中英文本分别测首音时间、段间间隙、取消延迟和漏读。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对系统朗读或单一 TTS 接口，具体增加了什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者识别的贡献是把宿主消息生命周期、可取消的渐进式长文本播放、多个本地/云语音后端和分层设置组合成同一工作流。自适应切块、会话内缓存、消息级播放器与审批提醒解决的是交互接线和恢复问题，不是新的语音模型；Edge 协议和各模型能力归上游。相对复制粘贴到外部工具，集成减少上下文切换并保留消息归属，但也扩大 Host 路由、凭据、本地模型和网络服务的维护面。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:43-106](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/README.md#L43-L106)

作者说明长读、下载、选中朗读、审批提醒和多后端。

<details>
<summary>查看原文（64行）</summary>

```text
## Features

1. **Read-aloud button** on every finalized assistant message (in the
   copy / feedback / branch action row): click to speak that message (the
   button shows an animated equalizer), click again to stop.
2. **Auto-read toggle** in the composer tool row (between the command and the
   access-mode buttons): when on, every newly completed assistant reply is
   read aloud automatically (the toggle gets a circular highlight); when off,
   nothing is auto-read.
3. **Voice settings panel** under 设置 → 插件 → 语音:
    - **TTS provider**: Edge TTS (free, no API key) / custom RVC voice /
      local Index-TTS2 voice / local CosyVoice clone / Google Cloud TTS (paid, API key)
    - **Voice**: 22 live-verified Edge TTS voices (default 晓萱 zh-CN-XiaoxuanNeural);
      8 Cloud voices in the cmn-CN group (default cmn-CN-Wavenet-A, free-form id allowed)
    - **Sound tuning**: rate / pitch / volume (0 = default, shared by Edge & Cloud)
    - **RVC config**: service URL + model (.pth) / index (.index) picker, base voice,
      voice tuning and advanced params — see the [RVC Guide](docs/RVC-GUIDE.md)
    - **Index-TTS2 config**: service URL (default 7880) + reference-voice
      picker/refresh/upload + clean-text toggle + emotion control + sampling
      params — see the [Index-TTS2 Guide](docs/INDEX-TTS2-GUIDE.md)
    - **CosyVoice config**: service URL (default 7890) + prompt-audio picker/refresh/upload +
      prompt transcript (required, in order and in full) + speed (0.5–2.0) + seed (0 = random) —
      see the [CosyVoice Guide](docs/COSYVOICE-GUIDE.md)
    - **Cloud config**: API Key (Host-file-only, write-only input) + Project ID (optional) +
      test button + this month's local usage per tier (Standard 4M / Wavenet-Neural2-Chirp3 1M) —
      see the [Cloud Guide](docs/CLOUD-GUIDE.md)
   - **Voice packs**: one-click install of voices from a registry
   - **Preview**: type text and press the play (triangle) button — a spinning
     loader shows while it is synthesizing/playing (click again to stop),
     failures show an inline message.
4. **RVC custom voices**: read with your own trained RVC models, computed
   locally (index-free mode, advanced params — see the
   [RVC guide](docs/RVC-GUIDE.md)).
5. **Gapless long reads**: adaptive chunked progressive playback — probe-calibrated
   chunk size, play-while-converting, Web Audio sample-accurate joins, no gaps
   between chunks (see the [design doc](docs/adaptive-chunked-playback.md)).
6. **Mini player** while reading: pause / resume + playback speed (1x / 1.25x /
   1.5x) on the message's action row; chunked long reads surface a visible
   "chunk x/y" counter.
7. **Themed tooltips & RVC onboarding**: hover tooltips use the app's theme
   tokens (`--dsw-*`); the RVC panel opens with a first-time 3-step guide
   (per-OS startup commands + one-click diagnostics).
8. **Download audio**: a download button on each message saves the synthesized
    audio — MP3 for Edge/Cloud reads, WAV for local (RVC/Index-TTS2/CosyVoice)
    reads — reusing the in-session cache so a just-read message downloads
    instantly. Long chunked reads have no single output file yet and report
    "not supported" instead of starting a wasteful re-synthesis.
9. **Read selected text**: selecting text in a message shows a floating
   "朗读选中" chip — click it to read just that selection.
10. **Streaming long reads (Edge too)**: long plain-Edge reads also stream
    progressively (first chunk plays while the rest synthesize), reusing the
    gapless chunked pipeline — no more waiting for full synthesis.
11. **Approval voice alerts**: optional voice broadcast of Agent approval events.
     When enabled, an approval request (`approval/asked`) is announced aloud and
     **interrupts the current read** (the agent is waiting on the decision); an
     approval result (`approval/decided`) is announced only when idle. Alerts
     always use Edge TTS with their own alert voice (independent of the RVC
     service), are deduplicated by approval id, and off by default. (Scope note:
     task-completion announcements are deferred to a later phase — the jobs
     subsystem has no session-event channel this plugin can observe yet.)
12. **Clean reads, quiet RVC**: message Markdown (code blocks, tables, links,
    quotes, task lists) is cleaned before reading — no symbol soup; an opt-in
    "read raw Markdown symbols" toggle keeps verbatim reads for source code.
    With the Edge provider the RVC panel stays fully hidden behind a single
```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:1151-1325](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/lib/index.mjs#L1151-L1325)

Host 实现分块、校准和提供者差异。

<details>
<summary>查看原文（175行）</summary>

```text
// Adaptive chunked progressive playback.
// Long RVC reads are split into sentence-sized blocks and converted one by one
// into a queue. A one-shot probe calibrates chunk size + prewarm count from the
// local machine's convert/play speed ratio (convert_time / audio_seconds).
// ---------------------------------------------------------------------------

const PROBE_TEXT = '你好，这是语音合成性能检测。';

/** Heuristic speech duration in seconds (zh ~3.6 chars/s, latin ~12 chars/s). */
function estimateSpeechSeconds(text) {
  let cjk = 0, latin = 0, other = 0;
  for (const ch of String(text || '')) {
    const cp = ch.codePointAt(0);
    if (cp >= 0x4e00 && cp <= 0x9fff) cjk++;
    else if (/[A-Za-z0-9]/.test(ch)) latin++;
    else other++;
  }
  return cjk / 3.6 + latin / 12 + other / 4;
}

function isLatinHeavy(text) {
  let latin = 0, cjk = 0;
  for (const ch of String(text || '')) {
    const cp = ch.codePointAt(0);
    if (cp >= 0x4e00 && cp <= 0x9fff) cjk++;
    else if (/[A-Za-z]/.test(ch)) latin++;
  }
  return latin > 0 && latin > cjk * 2;
}

/**
 * Atomic tokens that must never be split: URLs, emails and decimals/versions.
 * They contain '.' which the sentence splitter would otherwise treat as a
 * sentence end (splitting "3.14" into "3"/"14"), and hard cuts could break
 * them mid-token. Each atom is swapped for a placeholder without sentence
 * punctuation before splitting, then restored on the final parts.
 */
const ATOM_RE = /https?:\/\/[^\s，。！？；,!?;]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|\d+(?:\.\d+)+/g;

/**
 * Character spans of each part within the source text: [[start,end), …].
 * Walks the text once, tolerating whitespace differences (trimmed part edges,
 * collapsed newlines, Cloud's synthetic join gaps) — never message content
 * aware beyond ordering. Returns null when the parts cannot be walked in
 * order (then callers fall back to equal division). Pure, unit-tested.
 * Lets the client map "chunk k" to an exact text slice for scroll-follow
 * highlight (docs/scroll-follow-v2.md P1-3) instead of guessing by length.
 */
function spanParts(text, parts) {
  const src = String(text || '');
  const spans = [];
  let pos = 0;
  for (const part of parts) {
    while (pos < src.length && /\s/.test(src[pos])) pos++;
    const start = pos;
    let ok = true;
    for (const ch of String(part)) {
      if (/\s/.test(ch)) {
        while (pos < src.length && /\s/.test(src[pos])) pos++;
      } else {
        if (src[pos] !== ch) { ok = false; break; }
        pos++;
      }
    }
    if (!ok) return null;
    spans.push([start, pos]);
  }
  return spans;
}

/** Split text into chunks of <= maxChars, preferring sentence/segment boundaries. */
function splitText(text, maxChars) {
  const atoms = [];
  const guarded = String(text).replace(ATOM_RE, (tok) => {
    atoms.push(tok);
    return '\u0001' + (atoms.length - 1) + '\u0002';
  });
  const parts = [];
  const sentences = [];
  let m;
  const sre = /[^。！？；.!?;]+[。！？；.!?;]?/g;
  while ((m = sre.exec(guarded)) !== null) {
    const s = m[0].trim();
    if (s) sentences.push(s);
  }
  if (!sentences.length) sentences.push(guarded.trim());
  const segRe = /[^，、,]+[，、,]?/g;
  let cur = '';
  const flush = () => {
    if (cur.trim()) parts.push(cur.trim());
    cur = '';
  };
  const CUT_MIN = Math.max(4, Math.floor(maxChars * 0.5));
  // Boundary-aware hard cut: prefer the last whitespace / CJK punctuation in
  // the window, and never split an atomic placeholder (its tail \u0002 is a
  // good boundary; if we're inside one, cut before its \u0001 head).
  function safeEnd(seg, from) {
    const end = Math.min(seg.length, from + maxChars);
    for (let p = end; p > from + CUT_MIN; p--) {
      const ch = seg[p - 1];
      if (/\s/.test(ch) || '，、。！？；,!?;'.includes(ch) || ch === '\u0002') return p;
    }
    for (let p = end - 1; p > from; p--) {
      if (seg[p] === '\u0002') return p + 1;
      if (seg[p] === '\u0001') return p;
    }
    return end;
  }
  for (const s of sentences) {
    if (cur && cur.length + s.length > maxChars) flush();
    if (s.length > maxChars) {
      const segs = [];
      while ((m = segRe.exec(s)) !== null) {
        const g = m[0].trim();
        if (g) segs.push(g);
      }
      for (const seg of segs) {
        if (cur && cur.length + seg.length > maxChars) flush();
        if (seg.length > maxChars) {
          for (let i = 0; i < seg.length; ) {
            flush();
            const end = safeEnd(seg, i);
            if (end <= i) break; // defensive: never loop forever on zero progress
            cur = seg.slice(i, end);
            flush();
            i = end;
          }
        } else {
          cur += seg;
        }
      }
    } else {
      cur += s;
    }
  }
  flush();
  const restored = parts.map((p) =>
    p.replace(/\u0001(\d+)\u0002/g, (_, idx) => atoms[Number(idx)] ?? ''),
  );
  // Orphan-tail fix: a tiny trailing chunk ("好。"/"OK.") reads like a stutter
  // on top of the previous chunk; merge it back when it fits.
  if (restored.length >= 2) {
    const last = restored[restored.length - 1];
    const prev = restored[restored.length - 2];
    if (last.length < 8 && prev.length + last.length <= maxChars) {
      const gap =
        /[A-Za-z0-9]$/.test(prev) && /^[A-Za-z0-9]/.test(last) ? ' ' : '';
      restored[restored.length - 2] = prev + gap + last;
      restored.pop();
    }
  }
  return restored.filter((p) => p.length > 0);
}

function chunkTier(ratio) {
  if (ratio <= 0.4) return { chunkSec: 20, prewarm: 2 };
  if (ratio <= 0.6) return { chunkSec: 15, prewarm: 2 };
  if (ratio <= 0.9) return { chunkSec: 10, prewarm: 3 };
  return { chunkSec: 6, prewarm: 4 };
}

// Chunk policy per provider (pure, unit-tested):
// fastFirst (edge/cloud only, ratio ~0.1): TTFB = 1 block — chunk 1 returns
// immediately, the rest warm in the background at their own indexes (served
// strictly in order). Local synthesis (rvc/index/cosy, ratio 0.5-1.1) keeps
// full prewarm so playback never starves.
function chunkCal(provider) {
  if (provider === 'index-tts2') return { chunkSec: 15, prewarm: 2, ratio: 0 };
  if (provider === 'cosyvoice') return { chunkSec: 15, prewarm: 2, ratio: 0 };
  if (provider === 'google-cloud-tts') return { chunkSec: 120, prewarm: 2, ratio: 0, fastFirst: true };
  return { chunkSec: 20, prewarm: 2, ratio: 0, fastFirst: true };
}

const FALLBACK_CAL = { ratio: null, chunkSec: 10, prewarm: 3, probeFailed: true, at: 0 };
const calibCache = new Map(); // rvcFingerprint -> { ratio, chunkSec, prewarm, at }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最关键前提是“多后端集成仍能保持可预测、私密且低维护”。Edge 与 Cloud 会把文本发送到外部服务；RVC、Index-TTS2 和 CosyVoice 又要求用户维护本地进程、模型、端口与文件。插件还内嵌随上游变化的 Edge WebSocket 协议常量，端点或客户端版本变化可能使零配置路径失效。README 明示 RVC 自动回退默认关闭，因为回退会把原本本地文本发送到微软；这支持风险已被设计者识别，但不证明所有路由与凭据边界已经过安全审计。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:27-50](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/lib/index.mjs#L27-L50)

Edge worker固定协议端点和客户端常量。

<details>
<summary>查看原文（24行）</summary>

```text
const WORKER_SRC = `// edge-tts-worker — zero-dependency Edge TTS synthesis (Node >= 22).
// Transient failures are retried once with backoff; auth/voice errors fail fast.
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const CHROMIUM_FULL_VERSION = '143.0.3650.75';
const WINDOWS_FILE_TIME_EPOCH = 11644473600n;
const WSS_BASE = 'wss://api.msedgeservices.com/tts/cognitiveservices/websocket/v1';
const CRLF = String.fromCharCode(13, 10);
function generateSecMsGecToken() {
  const ticks = BigInt(Math.floor(Date.now() / 1000) + Number(WINDOWS_FILE_TIME_EPOCH)) * 10000000n;
  const roundedTicks = ticks - (ticks % 3000000000n);
  const hash = crypto.createHash('sha256');
  hash.update(String(roundedTicks) + TRUSTED_CLIENT_TOKEN, 'ascii');
  return hash.digest('hex').toUpperCase();
}
function readStdin() {
  return new Promise(function (resolve, reject) {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (c) { data += c; });
    process.stdin.on('end', function () { resolve(data); });
```

</details>

**依据 2 · 作者声明**：[README.md:170-203](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/README.md#L170-L203)

作者说明外发回退、端点变化和故障行为。

<details>
<summary>查看原文（34行）</summary>

```text
## Edge cases handled

- Clicking the read button of the message being auto-read stops it; another
  message's button switches to manual reading.
- Disabling auto-read never interrupts a manual read; it stops auto reads.
- A newly completed message (auto on) interrupts the current read; text-less
  messages are skipped; session switches only stop auto reads.
- Stopping / switching messages **eagerly cancels** the active RVC chunked job on
  the Host, so the local conversion service stops scheduling new chunks and
  releases GPU/memory promptly (no waiting for the lazy GC).
- Repeatedly reading the same text + voice **reuses the in-session audio cache**
  (no re-synthesis); if the cached backing file was cleaned by the OS, it
  transparently re-synthesizes instead of serving a stale 404 URL.
- If an Edge voice was removed by the endpoint (`1007 Unsupported voice`), the
  voice is pruned from the picker and the plugin auto-falls back to the default.
- Audio is **autoplay-unlocked** on the first user gesture (Web Audio context
  resumed + silent clip) so reads aren't silently blocked by browser policy.
- `Esc` / `S` (outside an input) stops the current read-aloud.
- Synthesis / playback failures **surface a themed toast** (message read-aloud and
  auto-read no longer fail silently; the preview panel keeps its inline error).
  In RVC mode the error toast carries a one-click **"read with Edge TTS instead"**
  action; with the opt-in toggle **"auto-switch to Edge TTS when RVC fails"** in
  the RVC settings (off by default — RVC is fully local, auto-fallback sends the
  text to Microsoft's endpoint), a failed RVC read silently retries with the RVC
  base voice via Edge TTS and shows a warn toast.
- **Smart chunking** never splits URLs / emails / decimals / versions ("3.14")
  mid-token — hard cuts slide to word/punctuation boundaries, and a tiny trailing
  sentence merges into the previous chunk instead of reading like a stutter.
- **Approval voice alerts** (opt-in): the Host subscribes to the session/event
  firehose (`approval/asked` / `approval/decided`), dedupes by approval id, and
  the client polls `/dsh-tts-api/notify?s=N` — the first poll baseline-syncs the
  cursor so a page refresh never replays stale alerts; announcements are silent
  on failure (no error toasts while the agent loops).

```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

基础 Edge 路径要求 DSH web、Node 22、可用网络与宿主 slots/webServer；Cloud 另需 API key，三个本地音色路径分别依赖对应服务、模型或参考音频。浏览器自动播放策略、音频设备与宿主消息 DOM/slot 契约影响实际播放。失败时界面可停止、重试或回退 Edge，本地分块任务支持取消；但本地服务安装、模型兼容、端口冲突和外部端点升级仍由用户处理。Host 文件设置与 localStorage 分担敏感服务配置和 UI 偏好，清理或迁移时需同时核对两层。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:109-143](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/README.md#L109-L143)

作者列出宿主、Node和本地服务要求。

<details>
<summary>查看原文（35行）</summary>

````text
## Requirements

- DeepSeek Harness `web` profile (`dsh web`)
- Node.js >= 22 (the worker uses the native `WebSocket`)
- For **local-voice providers only** (nothing to install for Edge/Cloud):
  - **RVC custom voices**: a local RVC inference environment (an RVC WebUI
    or the portable runtime) and a running `rvc-server.py` — see the
    [RVC Guide](docs/RVC-GUIDE.md) → "启动本地 RVC 服务" and the
    [User Guide](docs/USER-GUIDE.md) §4.2. macOS users start there too.
  - **Index-TTS2 voices**: the local `index-tts2-nvidia` bundle's API service
    (`启动api服务.bat`, default port 7880) — see the
    [Index-TTS2 Guide](docs/INDEX-TTS2-GUIDE.md).
  - **CosyVoice clones**: the local CosyVoice-2.0-0.5B bundle's `cosy-server.py`
    (`启动cosy服务.bat`, default port 7890) — see the
    [CosyVoice Guide](docs/COSYVOICE-GUIDE.md).

## Install

Four equivalent ways (pick any one):

```sh
# dsh-market UI: search the market for the plugin name and install
# npm package:
dsh plugin --profile web add "@memef1f1y/dsh-plugin-tts"
# GitHub source:
dsh plugin --profile web add "github:1624318455/dsh-plugin-tts#main"
# or local development:
dsh plugin --profile web add "file:/path/to/dsh-plugin-tts/plugin"
```

Restart `dsh web`; the plugin then loads automatically as a profile bundle.
Uninstalling any one of the above first is required before installing another:
they all register the same loader entry id (`tts`), and the installer refuses
duplicates (it rolls back instead of overwriting).

````

</details>

**依据 2 · 作者声明**：[README.md:204-222](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/README.md#L204-L222)

作者说明Host文件与localStorage两层持久化。

<details>
<summary>查看原文（19行）</summary>

```text
## Settings persistence

Layered storage:

- **Host file** (`~/.dsh/tts-rvc/settings.json`,
  `{ version: 1, rvc: …, index: …, cosy: …, cloud: … }`):
  service-class config — RVC service URL/model/index paths, Index-TTS2 and
  CosyVoice service URLs, Cloud API key (+ optional project ID). Shared across
  browsers, survives browser-data clears and incognito. Served/updated through
  `GET /dsh-tts-api/rvc-config` + `POST /dsh-tts-api/rvc-config-save`
  (and the matching `index-config`, `cosy-config`, `cloud-config` routes;
  legacy `localStorage` values migrate up once, then the file wins).
- **localStorage** (`dsh-tts-settings`): UI prefs only — voice, auto-read
  toggle, provider, sound tuning, the raw-Markdown toggle, approval-alert and
  remaining RVC prefs. Never stores the service URL / model / index.

A "Reset to defaults" button in the settings panel restores defaults and clears
both layers (best-effort on the Host file).

```

</details>

**依据 3 · 源码核查**：[lib/index.mjs:2000-2020](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/lib/index.mjs#L2000-L2020)

Host检查webServer并监听审批事件。

<details>
<summary>查看原文（21行）</summary>

```text
  const webServer = ctx.get('webServer');
  if (!webServer) return;

  // Approval voice alerts: subscribe to the session/event firehose (the
  // sandbox exposes ctx.on; feature-detect so the smoke fake-ctx still works).
  if (typeof ctx.on === 'function') {
    ctx.effect(
      () =>
        ctx.on('session/event', (_session, event) => {
          try {
            ingestSessionEvent(event);
          } catch (e) { /* observer failures are logged-and-contained by design */ }
        }),
      'dsh-plugin-tts: session events (approval alerts)',
    );
  }

  const files = new Map();   // id -> absolute mp3 path
  const cache = new Map();   // voice|text -> url
  let seq = 0;

```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 一次合格朗读和持续使用的总成本如何判断？

**研究主题**：效果与总成本

#### 完整回答

Edge 路径没有插件声明的 API 费用，但需要联网并承担外发数据、端点维护和合成等待；不能把“免费”写成零成本。Cloud 按供应商计费并需管理配额。本地音色避免按次云费用，却把模型包、磁盘、CPU/GPU、服务启动和故障排查转给用户；README 给出便携 RVC 体积区间，但不是本轮测量。合格任务成本应包含成功完整播放的合成调用、失败重试、模型加载、人工确认和下载/缓存清理，本轮没有工作负载与实测数据，不能计算单位成本或 ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:109-123](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/README.md#L109-L123)

本地提供者有独立服务依赖。

<details>
<summary>查看原文（15行）</summary>

```text
## Requirements

- DeepSeek Harness `web` profile (`dsh web`)
- Node.js >= 22 (the worker uses the native `WebSocket`)
- For **local-voice providers only** (nothing to install for Edge/Cloud):
  - **RVC custom voices**: a local RVC inference environment (an RVC WebUI
    or the portable runtime) and a running `rvc-server.py` — see the
    [RVC Guide](docs/RVC-GUIDE.md) → "启动本地 RVC 服务" and the
    [User Guide](docs/USER-GUIDE.md) §4.2. macOS users start there too.
  - **Index-TTS2 voices**: the local `index-tts2-nvidia` bundle's API service
    (`启动api服务.bat`, default port 7880) — see the
    [Index-TTS2 Guide](docs/INDEX-TTS2-GUIDE.md).
  - **CosyVoice clones**: the local CosyVoice-2.0-0.5B bundle's `cosy-server.py`
    (`启动cosy服务.bat`, default port 7890) — see the
    [CosyVoice Guide](docs/COSYVOICE-GUIDE.md).
```

</details>

**依据 2 · 作者声明**：[README.md:247-260](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/README.md#L247-L260)

作者给出RVC包体积和维护背景。

<details>
<summary>查看原文（14行）</summary>

```text

> RVC-specific troubleshooting: [RVC Guide → Troubleshooting](docs/RVC-GUIDE.md#troubleshooting).

## FAQ

**Q: Is it big?**
- Default experience (Edge TTS): the plugin itself is tiny (MB scale) — **no service or model to download**.
- You only need a local RVC portable package if you want custom voices (RVC). Its size mostly comes from the **bundled offline Python runtime + inference deps + pretrained models**:
  | Platform | Archive | Extracted |
  |---|---:|---:|
  | macOS (Apple Silicon) | ~660 MB | ~1.3 GB |
  | Windows (CPU-minimal) | ~1–2 GB | ~2–3 GB |
  | Windows (with NVIDIA GPU) | ~6 GB | ~7 GB |
- These are self-contained runtimes; the **full RVC WebUI is 7.8 GB** — we don't ship the WebUI / training / realtime parts this plugin doesn't need.
```

</details>

**依据 3 · 源码核查**：[lib/index.mjs:173-215](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/lib/index.mjs#L173-L215)

Edge worker设定重试与超时边界。

<details>
<summary>查看原文（43行）</summary>

```text
        reject('timeout after 20000ms without turn.end (endpoint slow or blocked)');
      }
    }, 20000);
  });
}
function findVoiceArgs() {
  const args = process.argv;
  const out = [];
  for (let i = 1; i < args.length; i++) {
    const a = args[i];
    if (a === '--' || a === '-e') continue;
    if (a.indexOf('.cjs') >= 0 || a.indexOf('.mjs') >= 0 || a.indexOf('edge-tts-worker') >= 0) continue;
    out.push(a);
  }
  return out;
}
async function main() {
  const args = findVoiceArgs();
  const voice = args[0] || 'zh-CN-XiaoxuanNeural';
  const rate = args[1] || 'default';
  const pitch = args[2] || 'default';
  const volume = args[3] || 'default';
  const text = (await readStdin()).trim();
  if (!text) return fail('empty text');
  const vparts = String(voice).split('-');
  const lang = (vparts.length >= 2 ? vparts[0] + '-' + vparts[1] : 'zh-CN');
  const outPath = path.join(os.tmpdir(), 'dsh-tts-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.mp3');
  let lastErr = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const size = await synthesizeOnce(voice, text, outPath, lang, rate, pitch, volume);
      console.log('OK ' + outPath);
      console.log('SIZE ' + size);
      process.exit(0);
    } catch (e) {
      lastErr = e;
      if (isHardWorkerError(String((e && e.message) || e))) break;
      if (attempt === 0) console.log('RETRY ' + String((e && e.message) || e).slice(0, 200));
      if (attempt === 0) await new Promise(function (r) { setTimeout(r, 800); });
    }
  }
  return fail(String(lastErr));
}
```

</details>

#### 缺口

- 缺少固定文本集上的调用费用、资源、成功率和人工时间。
  **影响**：无法比较Edge、Cloud与本地模型的单位合格朗读成本。
  **进一步探讨**：固定文本长度、语言和设备，记录总尝试、成功播放、首音、资源、费用和人工恢复。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可复用设计与维护风险？

**研究主题**：工程质量与复用

#### 完整回答

可借鉴之处是 Host/Client 分层、长任务显式 jobId 与取消、短音频缓存失效后重合成、配置敏感项与 UI 偏好分层、错误提示和降级由用户控制。源码对超时、子进程退出、临时文件、自动播放和过期声音有专门分支。维护风险也明显：Host 和手写 Client 文件规模大，多个提供者、路由和设置都集中在少数文件；Edge 私有协议常量、宿主 slot/DOM 以及本地服务方言都是外部耦合。现有工具和 README 声称验证不等于本轮执行测试。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:160-215](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/lib/index.mjs#L160-L215)

Edge子进程有重试、超时和错误分类。

<details>
<summary>查看原文（56行）</summary>

```text
    };
    ws.onopen = function () {
      const requestId = crypto.randomBytes(16).toString('hex');
      const speechConfig = { context: { synthesis: { audio: { metadataoptions: { sentenceBoundaryEnabled: 'false', wordBoundaryEnabled: 'true' }, outputFormat: 'audio-24khz-48kbitrate-mono-mp3' } } } };
      const ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="' + lang + '">' + '<voice name="' + xmlEscape(voice) + '">' + '<prosody rate="' + xmlEscape(rate) + '" pitch="' + xmlEscape(pitch) + '" volume="' + xmlEscape(volume) + '">' + xmlEscape(text) + '</prosody></voice></speak>';
      ws.send('Content-Type:application/json; charset=utf-8' + CRLF + 'Path:speech.config' + CRLF + CRLF + JSON.stringify(speechConfig));
      ws.send('X-RequestId:' + requestId + CRLF + 'Content-Type:application/ssml+xml' + CRLF + 'Path:ssml' + CRLF + CRLF + ssml);
    };
    setTimeout(function () {
      if (!settled) {
        settled = true;
        if (errorTimer) { clearTimeout(errorTimer); errorTimer = null; }
        try { ws.close(); } catch (e) {}
        reject('timeout after 20000ms without turn.end (endpoint slow or blocked)');
      }
    }, 20000);
  });
}
function findVoiceArgs() {
  const args = process.argv;
  const out = [];
  for (let i = 1; i < args.length; i++) {
    const a = args[i];
    if (a === '--' || a === '-e') continue;
    if (a.indexOf('.cjs') >= 0 || a.indexOf('.mjs') >= 0 || a.indexOf('edge-tts-worker') >= 0) continue;
    out.push(a);
  }
  return out;
}
async function main() {
  const args = findVoiceArgs();
  const voice = args[0] || 'zh-CN-XiaoxuanNeural';
  const rate = args[1] || 'default';
  const pitch = args[2] || 'default';
  const volume = args[3] || 'default';
  const text = (await readStdin()).trim();
  if (!text) return fail('empty text');
  const vparts = String(voice).split('-');
  const lang = (vparts.length >= 2 ? vparts[0] + '-' + vparts[1] : 'zh-CN');
  const outPath = path.join(os.tmpdir(), 'dsh-tts-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8) + '.mp3');
  let lastErr = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const size = await synthesizeOnce(voice, text, outPath, lang, rate, pitch, volume);
      console.log('OK ' + outPath);
      console.log('SIZE ' + size);
      process.exit(0);
    } catch (e) {
      lastErr = e;
      if (isHardWorkerError(String((e && e.message) || e))) break;
      if (attempt === 0) console.log('RETRY ' + String((e && e.message) || e).slice(0, 200));
      if (attempt === 0) await new Promise(function (r) { setTimeout(r, 800); });
    }
  }
  return fail(String(lastErr));
}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1-25](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/lib/client.js#L1-L25)

客户端是手写宿主模块加载器并声明slots依赖。

<details>
<summary>查看原文（25行）</summary>

```text
// @memef1f1y/dsh-plugin-tts — Client half (browser bundle).
// Hand-written in the harness module-loader format; `require` answers the
// platform externals (react), everything else is inlined.
window.__ModuleLoader__.load({
  id: "@memef1f1y/dsh-plugin-tts",
  factory: require => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    let react = require("react");

    // Service dependencies (fiber inject waiting): the client runner creates
    // the entry as ctx.plugin({ inject, apply }), so apply only runs after
    // `slots` is available. Without this declaration, ctx.get("slots") can be
    // undefined at apply time and the whole UI silently no-ops (no read-aloud
    // buttons, no auto-read toggle, no voice settings tab).
    const inject = ["slots"];

    // Bundle build tag: bump on every client fix so a console line proves
    // WHICH code is actually running (rules out stale-bundle confusion).
    const CLIENT_BUILD = "2026-10-11.01-remove-dead-runtime-inject";
    const apply = ctx => {
      const slots = ctx.slots ?? (typeof ctx.get === "function" ? ctx.get("slots") : undefined);
      if (!slots) throw new Error("[dsh-plugin-tts] slots service unavailable");
      try {
```

</details>

**依据 3 · 作者声明**：[README.md:157-169](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/README.md#L157-L169)

作者概括Host/Client职责。

<details>
<summary>查看原文（13行）</summary>

```text
## Architecture

| Layer | Location | Role |
|---|---|---|
| Host | `lib/index.mjs` | Registers webServer routes: `/dsh-tts-api/speak` (synthesis / chunk queue, all providers), `/dsh-tts-audio/<id>` (audio bytes), `/dsh-tts-api/rvc-next` (next chunk / job cancel), `/dsh-tts-api/rvc-files` + `/rvc-compact-index` + `/rvc-packs*` (RVC service proxy / packs), `/dsh-tts-api/index-*` and `/dsh-tts-api/cosy-*` (local service proxy + config), `/dsh-tts-api/cloud-*` (Cloud key/usage/test), `/dsh-tts-api/notify` (approval-alert queue), `/dsh-tts-api/diagnose` (one-click diagnostics); runs a zero-dependency Edge worker via `node -e` |
| Client | `lib/client.js` | Web Audio chunk player (sample-accurate joins, `<audio>` fallback) in `shell.overlay` + the UI entries (read-aloud button / auto-read toggle / settings panel); talks to the Host through `fetch` |

The TTS worker mirrors [node-edge-tts@1.2.10](https://github.com/SchneeHertz/node-edge-tts):
`Sec-MS-GEC` query params (ticks rounded to the 5-minute boundary),
`Sec-MS-GEC-Version=1-143.0.3650.75`, `Path:audio` binary framing, `xml:lang`
derived from the voice locale, one retry on abnormal (1006) closures. Audio is
`audio-24khz-48kbitrate-mono-mp3`.

```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由当前贡献和限制可推导什么新方向？

**研究主题**：新假设与验证

#### 完整回答

可推导“数据流向收据驱动的语音路由”假设。插件可在每次朗读前显示或记录文本将留在本机、发往 Edge 还是发往 Cloud，本地服务不可用时要求按数据敏感级别确认回退，并把提供者、字符数、首音、取消与失败原因写入本地收据。相对当前全局开关，这可能让隐私和成本成为逐任务可核对条件，而不是设置页知识。最小验证用含敏感标记与普通文本的任务集，制造本地服务故障，比较误外发、恢复时间、用户确认负担和完成率；若提示负担显著且不减少误路由，则假设不成立。该方向未实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:188-203](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/README.md#L188-L203)

当前回退会改变数据流向且默认关闭。

<details>
<summary>查看原文（16行）</summary>

```text
- Synthesis / playback failures **surface a themed toast** (message read-aloud and
  auto-read no longer fail silently; the preview panel keeps its inline error).
  In RVC mode the error toast carries a one-click **"read with Edge TTS instead"**
  action; with the opt-in toggle **"auto-switch to Edge TTS when RVC fails"** in
  the RVC settings (off by default — RVC is fully local, auto-fallback sends the
  text to Microsoft's endpoint), a failed RVC read silently retries with the RVC
  base voice via Edge TTS and shows a warn toast.
- **Smart chunking** never splits URLs / emails / decimals / versions ("3.14")
  mid-token — hard cuts slide to word/punctuation boundaries, and a tiny trailing
  sentence merges into the previous chunk instead of reading like a stutter.
- **Approval voice alerts** (opt-in): the Host subscribes to the session/event
  firehose (`approval/asked` / `approval/decided`), dedupes by approval id, and
  the client polls `/dsh-tts-api/notify?s=N` — the first poll baseline-syncs the
  cursor so a page refresh never replays stale alerts; announcements are silent
  on failure (no error toasts while the agent loops).

```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:802-825](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/lib/index.mjs#L802-L825)

Host按提供者分派短文本与分块任务。

<details>
<summary>查看原文（24行）</summary>

```text
// edge/rvc/index: short text -> single URL, long text -> chunked job whose
// sink is cloud synthesis per packet. No new playback chain.
// Key lives in the Host file (~/.dsh/tts-rvc/settings.json, cloud.apiKey) and
// NEVER touches localStorage; the client only sends provider + voice names.
// Quota: local per-month char counting by voice tier (standard 4M,
// wavenet/neural2/chirp3 1M). Official serviceusage/monitoring queries are
// intentionally NOT enabled by default (needs SA JSON; 99% users won't have
// it) — the usage endpoint reports local counts only.
// ---------------------------------------------------------------------------

const CLOUD_TTS_DEFAULTS = {
  voice: 'cmn-CN-Wavenet-A'
};
const CLOUD_QUOTA_LIMITS = {
  standard: 4000000,
  wavenet: 1000000,
  neural2: 1000000,
  chirp3: 1000000
};
// Cloud synchronous synthesize hard limit is 5000 UTF-8 bytes; stay under it
// with a safety margin. CJK packets are packed to ~1200 chars max
// (≈3600 bytes), inside the required 800–1200 chars per packet.
const CLOUD_MAX_BYTES = 4500;
const CLOUD_PACK_CHARS = 1200;
```

</details>

#### 缺口

- 数据流向收据尚未实现或实验。
  **影响**：不能把假设计入插件已有贡献。
  **进一步探讨**：实现仅记录不拦截的影子收据，再测误路由、恢复和提示负担。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对什么人值得观察或试用，停止条件是什么？

**研究主题**：采用判断

#### 完整回答

建议观察后小范围试用，适合明确需要消息朗读、愿意核对文本流向并能维护所选提供者的 DSH Web 用户。先只启用 Edge，使用非敏感短文本验证按钮、停止、自动播放和错误提示；再按需求逐一加入本地音色或 Cloud，不要一次启用全部路径。需要纯本地隐私的人应关闭任何自动 Edge 回退并验证网络边界。成功标准是固定文本完整朗读、可及时取消、无重复/漏段且故障可解释；出现未经确认外发、持续断句/卡死、GPU任务取消不释放或宿主升级后入口失效，应停用并回到系统朗读或单一服务。源码级证据不足以推荐持续安装。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:61-108](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/README.md#L61-L108)

作者给出交互能力及可选提供者。

<details>
<summary>查看原文（48行）</summary>

```text
      picker/refresh/upload + clean-text toggle + emotion control + sampling
      params — see the [Index-TTS2 Guide](docs/INDEX-TTS2-GUIDE.md)
    - **CosyVoice config**: service URL (default 7890) + prompt-audio picker/refresh/upload +
      prompt transcript (required, in order and in full) + speed (0.5–2.0) + seed (0 = random) —
      see the [CosyVoice Guide](docs/COSYVOICE-GUIDE.md)
    - **Cloud config**: API Key (Host-file-only, write-only input) + Project ID (optional) +
      test button + this month's local usage per tier (Standard 4M / Wavenet-Neural2-Chirp3 1M) —
      see the [Cloud Guide](docs/CLOUD-GUIDE.md)
   - **Voice packs**: one-click install of voices from a registry
   - **Preview**: type text and press the play (triangle) button — a spinning
     loader shows while it is synthesizing/playing (click again to stop),
     failures show an inline message.
4. **RVC custom voices**: read with your own trained RVC models, computed
   locally (index-free mode, advanced params — see the
   [RVC guide](docs/RVC-GUIDE.md)).
5. **Gapless long reads**: adaptive chunked progressive playback — probe-calibrated
   chunk size, play-while-converting, Web Audio sample-accurate joins, no gaps
   between chunks (see the [design doc](docs/adaptive-chunked-playback.md)).
6. **Mini player** while reading: pause / resume + playback speed (1x / 1.25x /
   1.5x) on the message's action row; chunked long reads surface a visible
   "chunk x/y" counter.
7. **Themed tooltips & RVC onboarding**: hover tooltips use the app's theme
   tokens (`--dsw-*`); the RVC panel opens with a first-time 3-step guide
   (per-OS startup commands + one-click diagnostics).
8. **Download audio**: a download button on each message saves the synthesized
    audio — MP3 for Edge/Cloud reads, WAV for local (RVC/Index-TTS2/CosyVoice)
    reads — reusing the in-session cache so a just-read message downloads
    instantly. Long chunked reads have no single output file yet and report
    "not supported" instead of starting a wasteful re-synthesis.
9. **Read selected text**: selecting text in a message shows a floating
   "朗读选中" chip — click it to read just that selection.
10. **Streaming long reads (Edge too)**: long plain-Edge reads also stream
    progressively (first chunk plays while the rest synthesize), reusing the
    gapless chunked pipeline — no more waiting for full synthesis.
11. **Approval voice alerts**: optional voice broadcast of Agent approval events.
     When enabled, an approval request (`approval/asked`) is announced aloud and
     **interrupts the current read** (the agent is waiting on the decision); an
     approval result (`approval/decided`) is announced only when idle. Alerts
     always use Edge TTS with their own alert voice (independent of the RVC
     service), are deduplicated by approval id, and off by default. (Scope note:
     task-completion announcements are deferred to a later phase — the jobs
     subsystem has no session-event channel this plugin can observe yet.)
12. **Clean reads, quiet RVC**: message Markdown (code blocks, tables, links,
    quotes, task lists) is cleaned before reading — no symbol soup; an opt-in
    "read raw Markdown symbols" toggle keeps verbatim reads for source code.
    With the Edge provider the RVC panel stays fully hidden behind a single
    "need a cloned voice?" entry, so casual reading is zero-config.

```

</details>

**依据 2 · 源码核查**：[lib/client.js:2280-2315](https://github.com/1624318455/dsh-plugin-tts/blob/5b094011dfba35a1d30d44a18d2b411654e8fff8/lib/client.js#L2280-L2315)

客户端发起合成并处理请求失败。

<details>
<summary>查看原文（36行）</summary>

```text
          textLen: String(text).length,
          ms: Date.now() - t0,
          ok: !!ok,
          error: String(error || "").slice(0, 200),
        }, extra || {}));
        try {
          const response = await fetch("/dsh-tts-api/speak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            ...(edgeOnly ? { signal: ctrl.signal } : {}),
          });
          const result = await response.json();
          logSpeak(!(result && result.error), result && result.error, { cached: !!(result && result.cached) });
          return result;
        } catch (e) {
          if (edgeOnly && e && e.name === "AbortError") {
            logSpeak(false, "abort-timeout-55s");
            throw new Error(t("err.synthTimeout"));
          }
          logSpeak(false, (e && e.message) || e);
          throw e;
        } finally {
          if (timer) clearTimeout(timer);
        }
      }

      async function fetchNextChunk(jobId, token) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 200000);
        try {
          const r = await fetch(
            "/dsh-tts-api/rvc-next?job=" + encodeURIComponent(jobId),
            { signal: ctrl.signal },
          );
          return await r.json().catch(() => ({ done: true }));
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
