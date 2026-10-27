# dsh-whale-girl-live2d

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[f977bef](https://github.com/Andersen216/dsh-whale-girl-live2d/tree/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0)

<!-- BEGIN META -->
[![GitHub ★ 44](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Andersen216/dsh-whale-girl-live2d)
<!-- END META -->

> **实现功能**：将 Live2D 桌宠注入 DSH Web/桌面界面，借 SSE 展示会话事件并支持输入、控制和钱包 HUD。

> **核心亮点**：把 Live2D 动作、会话可见事件与输入控件合为一套桌宠界面；娱乐/UI 集成而非模型能力。详见[Q01](#research-q01)。

> **风险与缺陷**：信任栅栏缺失/异常时 fail-open 使 say/cancel/control/HUD 等路由失守；素材非商业许可与代码 MIT 分层。详见[Q03](#research-q03)及[Q05](#research-q05)。

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
  - [Q01 · 鲸鱼娘桌宠给 DSH 用户增加了什么，交付形态如何？](#detail-section-11)
  - [Q02 · 会话状态、输入与资源如何闭环？](#detail-section-12)
  - [Q03 · 自定义路由的信任栅栏失效时会怎样？](#detail-section-13)
  - [Q04 · 钱包 HUD 的金额与缓存有什么解释边界？](#detail-section-14)
  - [Q05 · 分发、许可和持续运行成本是什么？](#detail-section-15)
  - [Q06 · 怎样保留趣味交互而减少安全和状态误导？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户在 DSH 看角色反馈、与会话交互；可选 macOS 桌面外壳。详见[Q01](#research-q01)。

普通宿主状态 UI 与独立桌宠已有同类体验；本项需证明趣味和操作便利大于权限/资源/许可成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| Live2D/SSE | 会话反馈 | 宿主事件和渲染待测 |
| 反向输入 | 发消息/取消 | 栅栏失效 fail-open |
| 钱包 HUD | 余额/费用估算 | 费率硬编码、今日内存态 |
| macOS 外壳 | 独立桌宠窗口 | 需另装并遵守素材许可 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH webServer/connection/sessionController | 业务必需 | 路由/权限/会话写入 | 当前 connection 缺失会放行 |
| Live2D/PIXI/模型素材 | 渲染必需 | 角色动画 | 无角色或许可限制 |
| DeepSeek 凭据/API | HUD 余额可选 | 余额展示 | 显示未配置/失败 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | 固定包并重启宿主/刷新 | pet.js 路由和角色可见 |
| 互动 | SSE 动画、说话/打断 | 会话响应且权限可控 |
| HUD | 右键看余额/估价 | 标明 stale/估算 |
| 维护 | 核模型许可、资源与 token | 卸载后路由/SSE 释放 |

**效果与成本**

#### 成本

| 阶段 | 资源/许可成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 安装 | DSH 0.2 线、模型/运行时许可 | 安装/重启及可选 macOS 外壳 | 市场可达性未核 |
| 持续 | Live2D 渲染、余额 API；用量未知 | 调角色与核安全/配置 | GPU/CPU/电量未知 |
| 故障 | 错误状态/路由暴露风险 | 关闭、升级、核通行证 | 安全修复优先 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 桌宠联动 | SSE 会话事件/Live2D 前端 | 实际表情时序/性能 |
| 输入/控制 | say/cancel/control | 栅栏失效后的权限安全 |
| 钱包 HUD | 官方余额 API 查询/轮次估价 | 与账单一致、今日持久 |

> **思考**：信任栅栏缺失/异常时 fail-open 使 say/cancel/control/HUD 等路由失守；素材非商业许可与代码 MIT 分层。详见[Q03](#research-q03)及[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 Live2D 动作、会话可见事件与输入控件合为一套桌宠界面；娱乐/UI 集成而非模型能力。详见[Q01](#research-q01)。

把 Live2D 动作、会话可见事件与输入控件合为一套桌宠界面；娱乐/UI 集成而非模型能力。详见[Q01](#research-q01)。

会话流转与 SSE 桥接可借鉴，静态资源本地供应；信任栅栏 fail-open 与硬编码费率是关键工程债。详见[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

信任栅栏缺失/异常时 fail-open 使 say/cancel/control/HUD 等路由失守；素材非商业许可与代码 MIT 分层。详见[Q03](#research-q03)及[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人非关键娱乐可观察；在开放敏感会话/余额前先验证并修正路由信任栅栏，商业复用须单独核素材授权。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持桌宠事件/会话接线；connection 栅栏缺失或抛错会放行所有自定义路由，HUD 费用为内存估算；目标宿主和性能未测。

- 已检查：作者 README、包清单、源码路径 README.md、NOTICE.md、package.json、lib/index.js、assets/pet.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、NOTICE、manifest、Host 和前端关键事件/交互；未运行目标插件、作者测试、桌面外壳或官方费率核对；旧 META 仅复用。
- 下一步：目标 DSH Web/macOS 测注入、SSE/多会话、say/cancel、connection 缺失/抛错、token/权限、性能、账单与分层许可。

**分析版本**

- **仓库**：[Andersen216/dsh-whale-girl-live2d](https://github.com/Andersen216/dsh-whale-girl-live2d)
- **版本号**：0.4.6（[固定提交 f977bef](https://github.com/Andersen216/dsh-whale-girl-live2d/tree/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是路由默认拒绝、通行证权限/轮换和 HUD 明确估算标识，配目标宿主安全与资源矩阵验收。详见[Q06](#research-q06)。

目标 DSH Web/macOS 测注入、SSE/多会话、say/cancel、connection 缺失/抛错、token/权限、性能、账单与分层许可。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 6998 | 5450 | 1230 | — |
| .md | source | 13 | 2096 | — | — | 26119 |
| .mjs | source | 25 | 6381 | 5451 | 602 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/Andersen216/dsh-whale-girl-live2d/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/Andersen216/dsh-whale-girl-live2d/issues?q=is%3Aissue+created%3A2026-09-21T08%3A02%3A08.574Z..2026-10-21T08%3A02%3A08.574Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Andersen216/dsh-whale-girl-live2d/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A02%3A08.574Z..2026-10-21T08%3A02%3A08.574Z)



统计日期：2026-10-21。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Live2D 桌宠能否在明确许可与安全边界内准确呈现会话并允许交互？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 鲸鱼娘桌宠给 DSH 用户增加了什么，交付形态如何？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件在 Web/官方桌面前端注入 Live2D 角色，监听会话/流事件切换动画，提供对话输入、打断、表情/场景与钱包 HUD；另有可选 macOS 桌面外壳读取相同插件页面。实际贡献是娱乐与会话状态可视化，不是 Agent 推理能力增强。README 的桌面跨平台说明和兼容性属于作者报告，目标宿主/GUI 本轮未运行。仓库包含 skill 候选与多种工具/素材，不能把附带内容都视作已验证插件能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:45-105](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/README.md#L45-L105)

作者说明网页/桌面两种形态

<details>
<summary>查看原文（61行）</summary>

````text
# 🐋 鲸鱼娘桌宠 · Whale Girl Live2D

**DSH（DeepSeek Harness）Web 界面里的 Live2D 桌宠 —— 她真的在跟着 agent 干活。**
**A Live2D desktop pet for the DeepSeek Harness Web UI — she really does follow what the agent is doing.**

[![Release](https://img.shields.io/github/v/release/Andersen216/dsh-whale-girl-live2d?label=release&color=2f81f7)](https://github.com/Andersen216/dsh-whale-girl-live2d/releases)
[![Code: MIT](https://img.shields.io/badge/code-MIT-3fb950)](LICENSE)
[![Artwork: CC BY-NC-SA 4.0](https://img.shields.io/badge/artwork-CC%20BY--NC--SA%204.0-d29922)](NOTICE.md)
[![Non-commercial](https://img.shields.io/badge/use-non--commercial-e5534b)](NOTICE.md)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-8957e5)](#-安装--install)

<img src="docs/screenshots/01-待机.jpg" alt="鲸鱼娘待在 DSH 界面右下角，左手笔右手本子" width="820">

点一下就能跟 agent 说话 · 右键就是钱包 · 表情 / 装饰 / 场景 / 动作 四页菜单 · 拖动换位置

</div>

---

## 🐋 先读这三行：只有**一套插件**，两种用法

1. **插件只有一个**：`dsh-whale-girl-live2d`。装一次，网页版和桌面版**共用同一份** ——
   模型、动作、表情、跟 agent 的联动、菜单、钱包、设置，全部在插件里。
2. **网页版** = 插件自带的用法，装完就有（Windows / macOS / Linux 都能用）。
3. **桌面版** = 额外下载一个 **1.4 MB 的 macOS 外壳 App**，把同一个页面放进桌面上的独立窗口。
   **它不是第二个插件**，也不用再装任何东西。

> **「网页版和桌面版是两套不同的插件吗？」→ 不是。**
> 是一套插件 + 一个可选的 Mac 外壳。所以你不需要"两边都装插件"，
> 也不存在"装了桌面版会不会跟网页版冲突"。

### 两种用法对照

| | 🖥 **网页版** | 🐋 **桌面版**（macOS 外壳） |
| --- | --- | --- |
| 是什么 | 插件本体（**必装**） | 一个 1.4 MB 的 App，加载插件提供的那一页 |
| 她住在哪 | DSH Web 界面右下角（浏览器标签页里） | **你的桌面上**：透明、无边框、永远置顶 |
| 支持平台 | **Windows / macOS / Linux** | **只有 macOS 13+**（跨平台外壳在计划中） |
| 需要装什么 | 插件 | 插件 **＋** 这个 App |
| 浏览器要开着吗 | 要（她在那张标签页里） | **不用**，DSH 在跑就行 |
| 额外能力 | — | 点击穿透（不挡干活）· 拖她=拖窗口 · **贴边悬浮球** · 菜单栏 🐋 · 低性能模式 · 设置里「彻底关闭 App」 |

### 安装：两条路都行，按你现在的状态选

#### 🅰 先装网页版，再装桌面版（推荐）

```bash
# ① 装插件
dsh plugin --profile web add github:Andersen216/dsh-whale-girl-live2d

# ② 重启 DSH（宿主插件只在启动时加载），然后刷新页面
#    右下角出现她 = 网页版成功

# ③ 自检（返回 401 = 已挂载，被信任栅栏挡着，正常；404 = 没加载）
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3080/dsh-pet/pet.js
```

然后装桌面版：去 [Releases](https://github.com/Andersen216/dsh-whale-girl-live2d/releases/latest)
下载 **`DS-WhaleGirl-Pet-macOS-*.zip`** → 解压 → 把 **`DS 鲸鱼娘桌宠.app`** 拖进「应用程序」→ 双击。

#### 🅱 先装桌面版，再装网页版（也可以）
````

</details>

**依据 2 · 源码核查**：[package.json:1-55](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/package.json#L1-L55)

0.4.6 包与 bundle/资源

<details>
<summary>查看原文（55行）</summary>

```text
{
  "name": "dsh-whale-girl-live2d",
  "version": "0.4.6",
  "description": "鲸鱼娘桌宠：把 Live2D 鲸鱼娘挂进 DSH Web 界面的桌宠插件——模型常驻桌面，跟着 agent 的真实状态换表情与动作，点一下就能直接跟 agent 说话，右键菜单可换表情 / 换装 / 摆场景 / 演小动作。（Whale Girl Pet: a Live2D companion for the DeepSeek Harness Web UI. Model assets are non-commercial, CC BY-NC-SA 4.0.）",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "live2d",
    "cubism",
    "desktop-pet",
    "桌宠",
    "鲸鱼娘",
    "whale-girl"
  ],
  "type": "module",
  "main": "lib/index.js",
  "files": [
    "lib",
    "assets",
    "docs",
    "skill",
    "cordis.patch.yml",
    "README.md",
    "CHANGELOG.md",
    "AUTHORS.md",
    "PROVENANCE.md",
    "NOTICE.md",
    "LICENSE"
  ],
  "bin": {
    "dsh-pet": "tools/pet-ctl.mjs"
  },
  "scripts": {
    "build:model": "node tools/build-model.mjs",
    "preview": "node tools/preview-server.mjs",
    "test": "node tools/test-host.mjs",
    "smoke": "node tools/smoke.mjs",
    "shot": "node tools/shot.mjs",
    "test:e2e": "node tools/e2e.mjs",
    "test:agent": "node tools/e2e-agent.mjs",
    "ascii": "node tools/ascii.mjs",
    "test:e2e:ui": "node tools/ui-probe.mjs",
    "test:catalog": "node tools/catalog-test.mjs",
    "repro:stuck": "node tools/repro-stuck.mjs",
    "release:check": "node tools/publish.mjs --check",
    "release:github": "node tools/publish.mjs",
    "release:npm": "node tools/publish-npm.mjs",
    "release:npm:check": "node tools/publish-npm.mjs --check"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
```

</details>

**依据 3 · 源码核查**：[lib/index.js:137-174](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L137-L174)

宿主注入脚本

<details>
<summary>查看原文（38行）</summary>

```text
export default {
  name: 'dsh-live2d-pet',
  inject: ['webServer', 'connection'],
  apply(ctx) {
    // ————————————————————————————————————————————————————————————
    // 桌面版（官方 Electron App）的首页注入
    //
    // 上游贡献者 @3Asterism 的 PR #2 指出：官方桌面版是把前端**静态 dist** 出来的，
    // `ctx.webServer.tapIndex()` 那条路到不了它的 index，所以要用 `webserver/index-inject`
    // 通道推一行 <script src="/dsh-pet/pet.js">。思路是对的，我们采纳。
    //
    // 但他那版把写法改成了 `apply(root)` + `root.inject([...])` —— 实测宿主传进来的 ctx
    // **没有 .inject()**，会直接 TypeError、插件整个挂不上（我们的集成测试就是这么抓到的）。
    // 所以这里保留原有的 `inject` 声明 + `apply(ctx)`，只在 ctx 上挂监听，并且全程兜底：
    // hook 不存在时它只是个不触发的事件，空转、不影响任何现有行为。
    // ————————————————————————————————————————————————————————————
    try {
      if (ctx && typeof ctx.on === 'function') {
        ctx.on('webserver/index-inject', (table) => {
          try {
            if (!Array.isArray(table)) return
            for (const row of table) {
              if (!row) continue
              if (row.kind === 'script-src' && row.src === '/dsh-pet/pet.js') return
              if (row.kind === 'script' && typeof row.text === 'string' && row.text.includes('/dsh-pet/pet.js')) return
            }
            table.push({
              kind: 'script',
              placement: 'body',
              text:
                '(function(){try{var d=document.body||document.head||document.documentElement;if(!d)return;' +
                'var s=document.createElement("script");s.src="/dsh-pet/pet.js";' +
                's.onerror=function(){};d.appendChild(s)}catch(e){}})()',
            })
          } catch (err) {}
        })
      }
    } catch (err) {}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:608-637](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L608-L637)

流事件桥

<details>
<summary>查看原文（30行）</summary>

```text
      ctx.on('agent/assistant-stream', (payload) => {
        try {
          const p = payload || {}
          const agent = p.agent
          const frame = p.frame
          if (!agent || !frame || !agent.session) return
          const sessionId = agent.session.id
          lastSessionId = sessionId
          if (!isPrimary(sessionId)) return
          if (frame.type === 'start') {
            broadcast({ t: 'attempt-start', sessionId, turn: frame.turn, step: frame.step })
            return
          }
          if (frame.type === 'end') {
            broadcast({ t: 'attempt-end', sessionId, turn: frame.turn ?? null })
            return
          }
          if (frame.type !== 'chunk' || !frame.chunk) return
          const c = frame.chunk
          if (c.type === 'text-delta' && c.text) {
            broadcast({ t: 'delta', sessionId, kind: 'text', text: c.text })
          } else if (c.type === 'reasoning-delta' && c.text) {
            broadcast({ t: 'delta', sessionId, kind: 'reasoning', text: c.text })
          } else if (c.type === 'tool-call-delta' && c.name) {
            broadcast({ t: 'tool-draft', sessionId, name: c.name })
          }
        } catch (err) {
          /* 事件桥永远不能把主流程带崩 */
        }
      }),
```

</details>

**依据 5 · 源码核查**：[assets/pet.js:4303-4334](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/assets/pet.js#L4303-L4334)

前端 SSE 消费与重连

<details>
<summary>查看原文（32行）</summary>

```text
  function connectSSE() {
    let es = null
    let retry = 0
    const open = () => {
      es = new EventSource(BASE + '/events')
      es.onopen = () => {
        retry = 0
        log('事件流已连接')
      }
      es.onmessage = (ev) => {
        let msg
        try {
          msg = JSON.parse(ev.data)
        } catch (e) {
          return
        }
        try {
          handleEvent(msg)
        } catch (err) {
          console.warn('[鲸鱼娘] 事件处理出错', msg && msg.t, err)
        }
      }
      es.onerror = () => {
        try {
          es.close()
        } catch (e) {}
        retry++
        setTimeout(open, Math.min(10000, 800 * retry))
      }
    }
    open()
  }
```

</details>

#### 缺口

- 目标 DSH 和桌面外壳体验未测
  **影响**：不能证明播放、兼容或娱乐价值
  **进一步探讨**：分别在目标 Web/macOS 外壳验收角色、动作与交互

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话状态、输入与资源如何闭环？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 通过 assistant-stream/session-event 抽取文本、reasoning、工具和轮次，把主会话状态发 SSE；客户端 EventSource 消费并线性回退重连。/say 经 sessionController.prompt 发 queue/steer 文本，必要时建会话；/cancel 调 controller.cancel。静态资源和模型由本地路由供应，配置随 pet.js boot 注入。API 和素材均为较强宿主耦合，源码接线可核，但目标事件版本、订阅/卸载生命周期和角色表现未实测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:608-810](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L608-L810)

事件到 SSE 的映射

<details>
<summary>查看原文（203行）</summary>

```text
      ctx.on('agent/assistant-stream', (payload) => {
        try {
          const p = payload || {}
          const agent = p.agent
          const frame = p.frame
          if (!agent || !frame || !agent.session) return
          const sessionId = agent.session.id
          lastSessionId = sessionId
          if (!isPrimary(sessionId)) return
          if (frame.type === 'start') {
            broadcast({ t: 'attempt-start', sessionId, turn: frame.turn, step: frame.step })
            return
          }
          if (frame.type === 'end') {
            broadcast({ t: 'attempt-end', sessionId, turn: frame.turn ?? null })
            return
          }
          if (frame.type !== 'chunk' || !frame.chunk) return
          const c = frame.chunk
          if (c.type === 'text-delta' && c.text) {
            broadcast({ t: 'delta', sessionId, kind: 'text', text: c.text })
          } else if (c.type === 'reasoning-delta' && c.text) {
            broadcast({ t: 'delta', sessionId, kind: 'reasoning', text: c.text })
          } else if (c.type === 'tool-call-delta' && c.name) {
            broadcast({ t: 'tool-draft', sessionId, name: c.name })
          }
        } catch (err) {
          /* 事件桥永远不能把主流程带崩 */
        }
      }),
    )

    // —— 会话事件：轮次/步骤/工具/最终消息 ——
    const pendingTools = new Map() // callId -> { name, startedAt }
    /** 每轮累计 token 数，桌宠完成时用它弹「这一轮花了多少」的小结。 */
    const turnTokens = new Map() // sessionId -> tokens
    /** 钱包用：这一轮的 命中/未命中/输出 口径（算钱用） */
    const turnUsage = new Map()

    disposers.push(
      ctx.on('session/event', (session, event) => {
        try {
          const sessionId = (session && session.id) || 'default'
          lastSessionId = sessionId
          const type = event && event.type
          const d = (event && event.data) || {}
          const st = stateOf(sessionId)

          // 人类直接发的 prompt —— 以此认定“当前会话”
          if (type === 'user/message' && d.source && d.source.kind === 'user') {
            primarySessionId = sessionId
            broadcast({ t: 'user', sessionId, text: textOf(d).slice(0, 4000), ts: Date.now() })
            return
          }
          if (type === 'turn/start') {
            turnTokens.set(sessionId, 0)
            st.status = 'running'
            st.turn = d.turn
            st.busySince = Date.now()
            if (isPrimary(sessionId)) broadcast({ t: 'turn-start', sessionId, turn: d.turn })
            else broadcast({ t: 'subagent', sessionId, active: true, kind: 'turn-start' })
            return
          }
          if (type === 'step/start') {
            st.step = d.step
            if (isPrimary(sessionId)) broadcast({ t: 'step-start', sessionId, turn: d.turn, step: d.step })
            return
          }
          if (type === 'assistant/message') {
            if (d.usage) {
              const hit = Number(d.usage.cacheReadTokens) || 0
              const miss = Number(d.usage.inputTokens) || 0
              const out = Number(d.usage.outputTokens) || 0
              const t = hit + miss + out
              turnTokens.set(sessionId, (turnTokens.get(sessionId) || 0) + t)
              // 钱包：把这一轮的三个口径也累计起来（用于算钱）
              const u = turnUsage.get(sessionId) || { hit: 0, miss: 0, out: 0, model: '' }
              u.hit += hit
              u.miss += miss
              u.out += out
              const model = (d.message && d.message.model) || d.model
              if (model) u.model = String(model)
              turnUsage.set(sessionId, u)
            }
            if (!isPrimary(sessionId)) return
            const usage = d.usage || null
            broadcast({
              t: 'assistant',
              sessionId,
              turn: d.turn,
              step: d.step,
              text: textOf(d.message).slice(0, 8000),
              interrupted: d.interrupted === true,
              usage: usage
                ? {
                    input: usage.inputTokens || 0,
                    cache: usage.cacheReadTokens || 0,
                    output: usage.outputTokens || 0,
                  }
                : null,
            })
            return
          }
          if (type === 'assistant/attempt') {
            if (isPrimary(sessionId)) broadcast({ t: 'attempt-failed', sessionId, turn: d.turn })
            return
          }
          if (type === 'tool/call') {
            const startedAt = Date.now()
            pendingTools.set(String(d.callId), { name: d.name, startedAt })
            if (!isPrimary(sessionId)) return
            let args = ''
            try {
              args = String(d.arguments || '')
            } catch (err) {}
            broadcast({
              t: 'tool-call',
              sessionId,
              callId: String(d.callId),
              name: d.name,
              label: TOOL_LABELS[d.name] || d.name,
              args: args.slice(0, 600),
            })
            return
          }
          if (type === 'tool/result') {
            const callId = d.message && d.message.content && d.message.content[0] && d.message.content[0].toolCallId
            const key = String(callId || '')
            const pending = pendingTools.get(key)
            if (pending) pendingTools.delete(key)
            if (!isPrimary(sessionId)) return
            broadcast({
              t: 'tool-result',
              sessionId,
              callId: key,
              name: (pending && pending.name) || '',
              label: (pending && TOOL_LABELS[pending.name]) || (pending && pending.name) || '',
              ms: pending ? Date.now() - pending.startedAt : null,
              error: d.error ? { name: d.error.name, code: d.error.code } : null,
            })
            return
          }
          if (type === 'turn/end') {
            st.status = 'idle'
            const ms = st.busySince ? Date.now() - st.busySince : null
            st.busySince = 0
            const tokens = turnTokens.get(sessionId) || 0
            turnTokens.delete(sessionId)
            // 钱包结算：按「下单时刻」的峰谷 + 模型档位算出这一轮花了多少
            const u = turnUsage.get(sessionId) || { hit: 0, miss: 0, out: 0, model: '' }
            turnUsage.delete(sessionId)
            const nowSec = Math.floor(Date.now() / 1000)
            const peak = isPeakTime(nowSec)
            const amount = tokens > 0 ? costOf(u, peak, priceTier(u.model)) : 0
            wallet.turnSeq += 1
            wallet.lastTurn = {
              seq: wallet.turnSeq,
              turn: d.turn || null,
              amount: Math.round(amount * 1e6) / 1e6,
              tokens,
              ts: Date.now(),
              isPeak: peak,
              tier: priceTier(u.model),
              detail: { hit: u.hit, miss: u.miss, out: u.out },
            }
            if (tokens > 0) addToday(amount, tokens)
            if (isPrimary(sessionId)) {
              broadcast({ t: 'turn-end', sessionId, turn: d.turn, reason: d.reason, ms, tokens,
                amount: wallet.lastTurn.amount, isPeak: peak })
              // HUD 靠这条立刻弹出来，不用等前端再拉一次
              broadcast({ t: 'hud-turn', sessionId, turn: wallet.lastTurn })
            } else {
              broadcast({ t: 'subagent', sessionId, active: false, kind: 'turn-end' })
            }
            return
          }
          if (type === 'approval/asked') {
            if (isPrimary(sessionId)) broadcast({ t: 'approval', sessionId, state: 'asked' })
            return
          }
          if (type === 'approval/decided') {
            if (isPrimary(sessionId)) broadcast({ t: 'approval', sessionId, state: 'decided' })
            return
          }
          if (type === 'session/title') {
            if (isPrimary(sessionId) && d.title) broadcast({ t: 'title', sessionId, title: String(d.title) })
            return
          }
        } catch (err) {
          /* 同上：事件桥不许抛 */
        }
      }),
    )

    disposers.push(
      ctx.on('session/disposed', (session) => {
        const id = session && session.id
        if (!id) return
        turnTokens.delete(id)
        sessionState.delete(id)
        if (primarySessionId === id) primarySessionId = null
        if (lastSessionId === id) lastSessionId = null
      }),
```

</details>

**依据 2 · 源码核查**：[lib/index.js:813-846](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L813-L846)

SSE 状态和 ping

<details>
<summary>查看原文（34行）</summary>

```text
    route('exact', '/dsh-pet/events', (req, res) => {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-store, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      })
      // 连上先给一份当前状态，桌宠不用等下一个事件才知道自己在什么状态
      const state = primarySessionId ? stateOf(primarySessionId) : null
      res.write(
        `data: ${JSON.stringify({
          t: 'hello',
          sessionId: primarySessionId || lastSessionId || null,
          status: state ? state.status : 'idle',
          ts: Date.now(),
        })}\n\n`,
      )
      clients.add(res)
      const ping = setInterval(() => {
        try {
          res.write(': ping\n\n')
        } catch (err) {
          clearInterval(ping)
          clients.delete(res)
        }
      }, 15000)
      const cleanup = () => {
        clearInterval(ping)
        clients.delete(res)
      }
      req.on('close', cleanup)
      req.on('error', cleanup)
      res.on('error', cleanup)
    })
```

</details>

**依据 3 · 源码核查**：[lib/index.js:933-1015](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L933-L1015)

say/cancel 与 sessionController

<details>
<summary>查看原文（83行）</summary>

```text
    route('exact', '/dsh-pet/say', async (req, res) => {
      if (req.method !== 'POST') {
        res.writeHead(405).end()
        return
      }
      const body = await json(req, res)
      if (!body) return
      const text = String(body.text || '').trim()
      if (!text) {
        res.writeHead(400, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: false, error: 'empty text' }))
        return
      }
      const controller = ctx.get('sessionController')
      if (!controller || typeof controller.prompt !== 'function') {
        res.writeHead(503, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: false, error: 'session controller unavailable' }))
        return
      }
      let sessionId = resolveSession(body.sessionId)
      let created = false
      if (!sessionId && typeof controller.create === 'function') {
        // 还没有会话就自己开一个——否则主人刚打开 DSH 时点桌宠说话会直接失败。
        try {
          const made = await controller.create({})
          sessionId = made && made.sessionId
          created = true
        } catch (err) {
          try {
            console.error('[live2d-pet] 自动建会话失败：', (err && err.stack) || err)
          } catch (e) {}
        }
      }
      if (!sessionId) {
        res.writeHead(503, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: false, error: 'no active session' }))
        return
      }
      try {
        // 第二个参数 signal 是**必需**的：SessionController.prompt(request, signal) 里
        // 第一行就是 signal.throwIfAborted()。走 RPC 时由载体提供，直接调用必须自己给。
        await controller.prompt(
          {
            requestId: randomUUID(),
            sessionId,
            mode: body.mode === 'steer' ? 'steer' : 'queue',
            content: [{ type: 'text', text }],
          },
          new AbortController().signal,
        )
        res.writeHead(200, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: true, sessionId, created }))
      } catch (err) {
        // 把栈打到宿主日志——这条路径出错时，前端只拿到一句 message，根本没法定位
        try {
          console.error('[live2d-pet] /say 送话失败：', (err && err.stack) || err)
        } catch (e) {}
        res.writeHead(500, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: false, error: err && err.message ? err.message : String(err) }))
      }
    })

    // 中断当前轮次（桌宠菜单里的“打断”按钮）
    route('exact', '/dsh-pet/cancel', async (req, res) => {
      if (req.method !== 'POST') {
        res.writeHead(405).end()
        return
      }
      const body = await json(req, res)
      if (!body) return
      const sessionId = resolveSession(body.sessionId)
      const controller = ctx.get('sessionController')
      try {
        if (!sessionId || !controller || typeof controller.cancel !== 'function') {
          throw new Error('cancel unavailable')
        }
        await controller.cancel({ sessionId })
        res.writeHead(200, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: true }))
      } catch (err) {
        res.writeHead(500, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: false, error: err && err.message ? err.message : String(err) }))
      }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:500-551](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L500-L551)

脚本/模型/配置路由

<details>
<summary>查看原文（52行）</summary>

```text
    route('exact', '/dsh-pet/pet.js', (req, res) => {
      let body
      try {
        body = readHot(path.join(ASSETS, 'pet.js'))
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('pet.js missing')
        return
      }
      const config = readConfig()
      // desktop：宿主是不是官方 Electron 桌面版（桌面版宿主在 Electron 里跑）
      // port：宿主自己的端口 —— 前端据此显示「当前连的是哪一个」，配合设置里的连接开关
      const boot = `\n;window.__DSH_PET_BOOT__=${JSON.stringify({
        config,
        version: VERSION,
        desktop: !!process.versions.electron,
        port: (ctx && ctx.webServer && ctx.webServer.port) || null,
      })};\n`
      const doc = `/* dsh-live2d-pet ${VERSION} */\n${body}${boot}`
      res.writeHead(200, {
        'Content-Type': MIME['.js'],
        'Content-Length': String(Buffer.byteLength(doc)),
        'Cache-Control': 'no-store',
      })
      res.end(doc)
    })

    route('prefix', '/dsh-pet/vendor', (req, res) => {
      const rel = req.url.split('?')[0].replace(/^\/dsh-pet\/vendor\/?/, '')
      const abs = safeJoin(VENDOR_DIR, rel)
      if (!abs) {
        res.writeHead(403).end()
        return
      }
      // vendor 体积大且不常改，允许浏览器缓存但必须每次校验
      serveFile(res, abs, { cache: 'no-cache' })
    })

    route('prefix', '/dsh-pet/model', (req, res) => {
      const rel = req.url.split('?')[0].replace(/^\/dsh-pet\/model\/?/, '')
      const abs = safeJoin(MODEL_DIR, rel)
      if (!abs) {
        res.writeHead(403).end()
        return
      }
      serveFile(res, abs, { cache: 'no-cache' })
    })

    route('exact', '/dsh-pet/config', (req, res) => {
      res.writeHead(200, { 'Content-Type': MIME['.json'], 'Cache-Control': 'no-store' })
      res.end(JSON.stringify(readConfig()))
    })
```

</details>

**依据 5 · 源码核查**：[assets/pet.js:4303-4334](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/assets/pet.js#L4303-L4334)

SSE 客户端重连

<details>
<summary>查看原文（32行）</summary>

```text
  function connectSSE() {
    let es = null
    let retry = 0
    const open = () => {
      es = new EventSource(BASE + '/events')
      es.onopen = () => {
        retry = 0
        log('事件流已连接')
      }
      es.onmessage = (ev) => {
        let msg
        try {
          msg = JSON.parse(ev.data)
        } catch (e) {
          return
        }
        try {
          handleEvent(msg)
        } catch (err) {
          console.warn('[鲸鱼娘] 事件处理出错', msg && msg.t, err)
        }
      }
      es.onerror = () => {
        try {
          es.close()
        } catch (e) {}
        retry++
        setTimeout(open, Math.min(10000, 800 * retry))
      }
    }
    open()
  }
```

</details>

#### 缺口

- 目标宿主事件时序和页面渲染未核
  **影响**：不能保证动画与真实会话状态一致
  **进一步探讨**：测试多会话、子代理、断线重连、取消和卸载

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自定义路由的信任栅栏失效时会怎样？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

所有路由在包装层调用 rejected：桌面壳回环地址+token 可通行，其余走 connection.requestRejection。但若 connection 服务缺失或没有 requestRejection，代码只 warn 然后返回 false；该 API 抛异常也返回 false，实际为 fail-open。此时 /say 可直接向会话提交文本、/cancel 中断、/control 广播动作，/hud 还会用宿主凭据请求账户余额并返回；要看网络可达性和宿主版本才可判断暴露范围。README 恰称 0.1.x 不支持，不能假设缺服务只发生在不受支持版本。敏感控制路由应在拒绝能力不可用时拒绝。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:390-429](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L390-L429)

回环 token 与 connection 缺失/异常放行

<details>
<summary>查看原文（40行）</summary>

```text
    /** 这个请求是不是「本机桌面壳」发来的（回环地址 + 令牌，两个都要满足） */
    function isDesktopReq(req) {
      try {
        const addr = (req.socket && (req.socket.remoteAddress || '')) || ''
        if (addr !== '127.0.0.1' && addr !== '::1' && addr !== '::ffff:127.0.0.1') return false
        const token = desktopKey()
        if (!token) return false
        const cookie = String(req.headers.cookie || '')
        if (cookie.split(/;\s*/).some((c) => c === `dsh_pet_desk=${token}`)) return true
        if (req.headers['x-dsh-pet-desk'] === token) return true
        const m = /[?&]k=([0-9a-f]{16,})/.exec(String(req.url || ''))
        if (m && m[1] === token) return true
        return false
      } catch (err) {
        return false
      }
    }

    function rejected(req, res) {
      try {
        if (isDesktopReq(req)) return false
        const conn = ctx.get('connection') || ctx.connection
        if (!conn || typeof conn.requestRejection !== 'function') {
          if (!rejected.warned) {
            rejected.warned = true
            try {
              console.warn('[live2d-pet] 信任栅栏不可用：connection 服务缺失，自定义路由将放行')
            } catch (err) {}
          }
          return false
        }
        const code = conn.requestRejection(req)
        if (code === undefined || code === null || code === false) return false
        res.statusCode = typeof code === 'number' ? code : 403
        res.end()
        return true
      } catch (err) {
        return false
      }
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:432-449](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L432-L449)

全部自定义路由统一包装

<details>
<summary>查看原文（18行）</summary>

```text
    function route(kind, pathname, handler) {
      disposers.push(
        ctx.webServer.register({
          kind,
          path: pathname,
          handler: async (req, res) => {
            if (rejected(req, res)) return
            try {
              await handler(req, res)
            } catch (err) {
              try {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
                res.end(`live2d-pet: ${err && err.message ? err.message : String(err)}`)
              } catch (e) {}
            }
          },
        }),
      )
```

</details>

**依据 3 · 源码核查**：[lib/index.js:933-1015](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L933-L1015)

会话写入/取消路由

<details>
<summary>查看原文（83行）</summary>

```text
    route('exact', '/dsh-pet/say', async (req, res) => {
      if (req.method !== 'POST') {
        res.writeHead(405).end()
        return
      }
      const body = await json(req, res)
      if (!body) return
      const text = String(body.text || '').trim()
      if (!text) {
        res.writeHead(400, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: false, error: 'empty text' }))
        return
      }
      const controller = ctx.get('sessionController')
      if (!controller || typeof controller.prompt !== 'function') {
        res.writeHead(503, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: false, error: 'session controller unavailable' }))
        return
      }
      let sessionId = resolveSession(body.sessionId)
      let created = false
      if (!sessionId && typeof controller.create === 'function') {
        // 还没有会话就自己开一个——否则主人刚打开 DSH 时点桌宠说话会直接失败。
        try {
          const made = await controller.create({})
          sessionId = made && made.sessionId
          created = true
        } catch (err) {
          try {
            console.error('[live2d-pet] 自动建会话失败：', (err && err.stack) || err)
          } catch (e) {}
        }
      }
      if (!sessionId) {
        res.writeHead(503, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: false, error: 'no active session' }))
        return
      }
      try {
        // 第二个参数 signal 是**必需**的：SessionController.prompt(request, signal) 里
        // 第一行就是 signal.throwIfAborted()。走 RPC 时由载体提供，直接调用必须自己给。
        await controller.prompt(
          {
            requestId: randomUUID(),
            sessionId,
            mode: body.mode === 'steer' ? 'steer' : 'queue',
            content: [{ type: 'text', text }],
          },
          new AbortController().signal,
        )
        res.writeHead(200, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: true, sessionId, created }))
      } catch (err) {
        // 把栈打到宿主日志——这条路径出错时，前端只拿到一句 message，根本没法定位
        try {
          console.error('[live2d-pet] /say 送话失败：', (err && err.stack) || err)
        } catch (e) {}
        res.writeHead(500, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: false, error: err && err.message ? err.message : String(err) }))
      }
    })

    // 中断当前轮次（桌宠菜单里的“打断”按钮）
    route('exact', '/dsh-pet/cancel', async (req, res) => {
      if (req.method !== 'POST') {
        res.writeHead(405).end()
        return
      }
      const body = await json(req, res)
      if (!body) return
      const sessionId = resolveSession(body.sessionId)
      const controller = ctx.get('sessionController')
      try {
        if (!sessionId || !controller || typeof controller.cancel !== 'function') {
          throw new Error('cancel unavailable')
        }
        await controller.cancel({ sessionId })
        res.writeHead(200, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: true }))
      } catch (err) {
        res.writeHead(500, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: false, error: err && err.message ? err.message : String(err) }))
      }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1022-1050](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L1022-L1050)

control 路由

<details>
<summary>查看原文（29行）</summary>

```text
    route('exact', '/dsh-pet/control', async (req, res) => {
      if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: true, version: VERSION, sessions: clients.size }))
        return
      }
      if (req.method !== 'POST') {
        res.writeHead(405).end()
        return
      }
      const body = await json(req, res)
      if (!body) return
      const out = { t: 'control', ts: Date.now() }
      if (body.expression !== undefined) out.expression = body.expression === null ? null : String(body.expression)
      if (body.mood !== undefined) out.mood = body.mood === null ? null : String(body.mood)
      if (body.motion !== undefined) out.motion = body.motion === null ? null : String(body.motion)
      if (body.bubble !== undefined) out.bubble = body.bubble === null ? null : String(body.bubble)
      if (body.bubbleMs !== undefined) out.bubbleMs = Number(body.bubbleMs) || 0
      if (body.props !== undefined) out.props = body.props
      if (body.clearProps === true) out.clearProps = true
      if (body.say !== undefined) out.say = String(body.say)
      if (body.attention === true) out.attention = true
      // 工作简报：{title, body} / [title, body] / "纯文本" 都接受
      //（前端头顶会挂一个信封，点开是大号可读面板）
      if (body.report !== undefined && body.report !== null) out.report = body.report
      sendLocal(out)
      res.writeHead(200, { 'Content-Type': MIME['.json'] })
      res.end(JSON.stringify({ ok: true, clients: clients.size, sent: out }))
    })
```

</details>

**依据 5 · 源码核查**：[lib/index.js:852-869](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L852-L869)

HUD 余额路由

<details>
<summary>查看原文（18行）</summary>

```text
    route('exact', '/dsh-pet/hud', async (req, res) => {
      if (rejected(req, res)) return
      try {
        const force = /[?&]refresh=1/.test(req.url || '')
        await fetchBalance(force)
        const snap = walletSnapshot()
        const body = JSON.stringify(snap)
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
          'Content-Length': String(Buffer.byteLength(body)),
        })
        res.end(body)
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
        res.end(JSON.stringify({ ok: false, error: String((err && err.message) || err).slice(0, 200) }))
      }
    })
```

</details>

#### 缺口

- 目标宿主是否提供 connection/网络绑定及实际可达性未核
  **影响**：不能断言远程攻击已发生，但保护失效路径成立
  **进一步探讨**：隔离环境移除/令 requestRejection 抛错，核所有敏感路由必须拒绝

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 钱包 HUD 的金额与缓存有什么解释边界？

**研究主题**：效果与总成本、缺陷与关键质疑

#### 完整回答

Host 读取 DSH 凭据或 DEEPSEEK_API_KEY，访问固定余额 API，60 秒缓存且失败沿用旧数并标 stale。每轮估价按代码里写死的价格表、模型档和轮结束时的峰谷状态计算，today 计数只在进程内存，重启归零；这些是估算/展示数据，不应当作官方结算。源码注释“按下单时刻”的说法与实际 turn/end 取 nowSec 不一致。价格和模型档会变，当前费率未经实时官方核验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:261-313](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L261-L313)

凭据、余额查询、缓存和 stale

<details>
<summary>查看原文（53行）</summary>

```text
    /** DeepSeek key：优先问 DSH 的凭据服务，其次看环境变量 */
    async function deepseekKey() {
      try {
        const cred = ctx.get('credentials')
        if (cred && typeof cred.resolve === 'function') {
          const c = await cred.resolve('DEEPSEEK_API_KEY')
          if (c && c.value) return String(c.value)
        }
      } catch (err) {
        if (!wallet.keyWarned) {
          wallet.keyWarned = true
          try {
            console.warn('[live2d-pet] 读不到凭据服务里的 DEEPSEEK_API_KEY：' + String((err && err.message) || err).slice(0, 120))
          } catch (e) {}
        }
      }
      return process.env.DEEPSEEK_API_KEY || ''
    }

    async function fetchBalance(force) {
      const now = Date.now()
      if (!force && wallet.balance && now - wallet.balanceAt < 60000) return wallet.balance
      const key = await deepseekKey()
      if (!key) {
        wallet.balance = { ok: false, code: 'NO_KEY', error: '没配置 DEEPSEEK_API_KEY' }
        wallet.balanceAt = now
        return wallet.balance
      }
      try {
        const res = await fetch('https://api.deepseek.com/user/balance', {
          headers: { Authorization: 'Bearer ' + key },
          signal: AbortSignal.timeout(8000),
        })
        if (!res.ok) throw new Error('HTTP ' + res.status)
        const j = await res.json()
        const info = (j && j.balance_infos && j.balance_infos[0]) || {}
        wallet.balance = {
          ok: true,
          totalBalance: Number(info.total_balance),
          currency: info.currency || 'CNY',
          isAvailable: j.is_available !== false,
          updatedAt: new Date().toISOString(),
        }
      } catch (err) {
        // 拿不到就沿用上一次的数字（标 stale），别让 HUD 变空
        const msg = String((err && err.message) || err).slice(0, 160)
        wallet.balance = wallet.balance && wallet.balance.ok
          ? Object.assign({}, wallet.balance, { stale: true, error: msg })
          : { ok: false, code: 'ERROR', error: msg }
      }
      wallet.balanceAt = now
      return wallet.balance
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:315-338](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L315-L338)

今日内存累计

<details>
<summary>查看原文（24行）</summary>

```text
    function todayKey() {
      return bjDate(Math.floor(Date.now() / 1000)).toISOString().slice(0, 10)
    }
    function addToday(amount, tokens) {
      const k = todayKey()
      if (wallet.today.date !== k) wallet.today = { date: k, amount: 0, tokens: 0 }
      wallet.today.amount += Number(amount) || 0
      wallet.today.tokens += Number(tokens) || 0
    }

    function walletSnapshot() {
      const nowSec = Math.floor(Date.now() / 1000)
      return {
        ok: true,
        version: VERSION,
        source: 'dsh-live2d-pet',
        isPeak: isPeakTime(nowSec),
        peakNextChangeAt: nextPeakChangeAt(nowSec),
        balance: wallet.balance,
        today: { date: wallet.today.date, amount: wallet.today.amount, tokens: wallet.today.tokens },
        turn: wallet.lastTurn,
        priceTier: 'flash',
        priceNote: 'Flash 空闲 0.02/1/4・高峰 ×2（元每百万 token）',
      }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:750-778](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L750-L778)

turn/end 时计算估价

<details>
<summary>查看原文（29行）</summary>

```text
          if (type === 'turn/end') {
            st.status = 'idle'
            const ms = st.busySince ? Date.now() - st.busySince : null
            st.busySince = 0
            const tokens = turnTokens.get(sessionId) || 0
            turnTokens.delete(sessionId)
            // 钱包结算：按「下单时刻」的峰谷 + 模型档位算出这一轮花了多少
            const u = turnUsage.get(sessionId) || { hit: 0, miss: 0, out: 0, model: '' }
            turnUsage.delete(sessionId)
            const nowSec = Math.floor(Date.now() / 1000)
            const peak = isPeakTime(nowSec)
            const amount = tokens > 0 ? costOf(u, peak, priceTier(u.model)) : 0
            wallet.turnSeq += 1
            wallet.lastTurn = {
              seq: wallet.turnSeq,
              turn: d.turn || null,
              amount: Math.round(amount * 1e6) / 1e6,
              tokens,
              ts: Date.now(),
              isPeak: peak,
              tier: priceTier(u.model),
              detail: { hit: u.hit, miss: u.miss, out: u.out },
            }
            if (tokens > 0) addToday(amount, tokens)
            if (isPrimary(sessionId)) {
              broadcast({ t: 'turn-end', sessionId, turn: d.turn, reason: d.reason, ms, tokens,
                amount: wallet.lastTurn.amount, isPeak: peak })
              // HUD 靠这条立刻弹出来，不用等前端再拉一次
              broadcast({ t: 'hud-turn', sessionId, turn: wallet.lastTurn })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:176-245](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L176-L245)

代码内置价格和模型档

<details>
<summary>查看原文（70行）</summary>

```text
    // 钱包：余额 / 峰谷时段 / 本轮消耗 —— 右键 HUD 的数据源
    //
    // 为什么自己做而不是读 dsh-whale-widget：那个插件是可选的，主人可能停用它
    // （实测停用后 /dsh-whale/balance.json 直接 404）。桌宠自己会算，才到哪都能用。
    // 价格与峰谷规则照官方文档口径（与 dsh-whale-widget 的实现同源，便于对账）：
    //   · 高峰 = 北京时间周一至周五（不含法定节假日）9:00–12:00、14:00–18:00
    //   · 其余时段（含周末、调休上班的周末、法定节假日全天）一律空闲价
    //   · Flash: 命中 0.02/未命中 1/输出 4（元每百万 token），高峰 = 空闲 × 2
    //   · Pro 为 Flash 的 3 倍价
    //   ⚠️ 每年国务院公布次年放假安排后，记得往 HOLIDAY_VALLEY 里补下一年的日期。
    // ————————————————————————————————————————————————————————————
    const PEAK_HOURS = [
      [9, 12],
      [14, 18],
    ]
    const WEEKEND_VALLEY_FROM = Math.floor(Date.UTC(2026, 7, 22, 16, 0, 0) / 1000)
    const HOLIDAY_VALLEY_FROM = Math.floor(Date.UTC(2026, 8, 18, 16, 0, 0) / 1000)
    const HOLIDAY_VALLEY = new Set([
      '2026-01-01', '2026-01-02', '2026-01-03',
      '2026-02-15', '2026-02-16', '2026-02-17', '2026-02-18', '2026-02-19',
      '2026-02-20', '2026-02-21', '2026-02-22', '2026-02-23',
      '2026-04-04', '2026-04-05', '2026-04-06',
      '2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05',
      '2026-06-19', '2026-06-20', '2026-06-21',
      '2026-09-25', '2026-09-26', '2026-09-27',
      '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04',
      '2026-10-05', '2026-10-06', '2026-10-07',
    ])
    /** 元 / 百万 token，数组是 [空闲价, 高峰价] */
    const PRICE = {
      flash: { hit: [0.02, 0.04], miss: [1, 2], out: [4, 8] },
      pro: { hit: [0.15, 0.3], miss: [4.5, 9], out: [13.5, 27] },
    }
    /** 按北京时间（UTC+8）读日历 */
    function bjDate(sec) {
      return new Date(Number(sec) * 1000 + 8 * 3600 * 1000)
    }
    function isPeakTime(sec) {
      const n = Number(sec)
      if (!Number.isFinite(n)) return false
      const bj = bjDate(n)
      if (n >= WEEKEND_VALLEY_FROM) {
        const dow = bj.getUTCDay()
        if (dow === 0 || dow === 6) return false
      }
      if (n >= HOLIDAY_VALLEY_FROM && HOLIDAY_VALLEY.has(bj.toISOString().slice(0, 10))) return false
      const hour = bj.getUTCHours()
      for (const [a, b] of PEAK_HOURS) if (hour >= a && hour < b) return true
      return false
    }
    /** 下一个峰谷切换时刻（epoch 秒）：扫北京时间的 0/9/12/14/18 点边界，最多往后看 12 天 */
    function nextPeakChangeAt(sec) {
      const n = Number(sec)
      if (!Number.isFinite(n)) return null
      const nowPeak = isPeakTime(n)
      for (let i = 1; i <= 12 * 24; i++) {
        const t = n + i * 3600
        if (isPeakTime(t) !== nowPeak) return t
      }
      return null
    }
    function priceTier(model) {
      return /pro/i.test(String(model || '')) ? 'pro' : 'flash'
    }
    /** 一轮的花费（元）：命中/未命中/输出 三个价目分别算 */
    function costOf(usage, peak, tier) {
      const p = PRICE[tier] || PRICE.flash
      const idx = peak ? 1 : 0
      const hit = (Number(usage.hit) || 0) / 1e6 * p.hit[idx]
      const miss = (Number(usage.miss) || 0) / 1e6 * p.miss[idx]
```

</details>

#### 缺口

- 实时费率、账单对账和重启误差未核
  **影响**：不能把 HUD 金额当真实收费或每日持久账本
  **进一步探讨**：对比官方账单/当前费率、跨午夜/重启与失败状态

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 分发、许可和持续运行成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

代码包 manifest 为 MIT，但 NOTICE 明确 Live2D 模型素材采用 CC BY-NC-SA 4.0 且整体非商业，Cubism Core 为专有许可，必须按层判断复用/商业使用。Web 依赖 DSH 0.2.0-rc.x 目标线、宿主 webServer/connection/sessionController 与浏览器渲染；macOS 外壳另需安装。角色/渲染资源体量、持续 GPU/CPU 和 API 请求成本未测。README 的 curl|bash 一键部署会执行远端脚本，使用前应固定版本并核脚本/来源；本轮没有运行。

#### 证据与依据

**依据 1 · 作者声明**：[NOTICE.md:1-41](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/NOTICE.md#L1-L41)

代码/素材/运行时分层许可

<details>
<summary>查看原文（41行）</summary>

```text
# NOTICE —— 许可分层与署名 / License layering & attribution

`LICENSE`（MIT）**只覆盖本项目的代码**。仓库里还带着美术素材和第三方运行时，它们各自另有条款 ——
这就是这份 NOTICE 存在的原因（放在这里而不是塞进 `LICENSE`，是为了让 GitHub 能正确识别出 MIT）。

`LICENSE` (MIT) **covers the code of this project only**. The repository also ships artwork and third-party
runtimes under their own terms — hence this NOTICE (kept separate from `LICENSE` so that GitHub detects the
MIT license correctly).

---

## 1. 代码 / Code

- **范围 / Scope**：`lib/`、`tools/`、`cordis.patch.yml`、`assets/pet.js`
- **许可 / License**：**MIT**，Copyright © 2026 **Andersen216**（全文见 [`LICENSE`](LICENSE)）

## 2. 美术素材 / Artwork

- **范围 / Scope**：`assets/model/**` —— `*.moc3`、贴图、`*.exp3.json`（表情）、`*.motion3.json`（动作）、
  `model3.json` 等模型相关文件
- **许可 / License**：**[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh)**
  （署名 — **非商业性使用** — 相同方式共享）/ (Attribution — **NonCommercial** — ShareAlike)
- **版权 / Copyright**：**上善无形 / ZipZipPipe / 氵六青** 三位所有，逐项贡献见 [`AUTHORS.md`](AUTHORS.md)，
  逐文件来源与原《使用须知》原文见 [`PROVENANCE.md`](PROVENANCE.md)

## 3. 第三方运行时 / Third-party runtime

| 组件 / Component | 许可 / License | 版权 / Copyright |
| --- | --- | --- |
| Live2D Cubism Core（`assets/vendor/live2dcubismcore.min.js`） | Live2D 专有许可 / Live2D Proprietary License | Live2D Inc. |
| PIXI.js 6.5.10（`assets/vendor/pixi.min.js`） | MIT | PIXI.js contributors |
| pixi-live2d-display 0.4.0（`assets/vendor/cubism4.min.js`） | MIT | pixi-live2d-display contributors |

## 4. 本项目整体是非商业的 / This project is non-commercial

完全免费：**不收费、不带货、不接广告变现、不卖周边、不作为任何付费产品或服务的卖点**。
模型作者的无偿分享与转载授权，**不解除**角色形象本身的 NC / SA 条件。

Entirely free: **no fees, no ads, no merchandise, no sponsorships, and not a selling point of any paid
product or service**. The model authors' kind permission to share and redistribute does **not** waive the
NC / SA conditions attached to the character artwork itself.
```

</details>

**依据 2 · 作者声明**：[README.md:1-42](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/README.md#L1-L42)

作者一键部署与兼容声明

<details>
<summary>查看原文（42行）</summary>

````text
<div align="center">


## 🚀 网页版一键部署（不用懂命令行）

DSH 网页版原来要自己装 Node、装 CLI、起服务、再装插件 —— 现在一条命令搞定：

```bash
# macOS / Linux / WSL：起网页版（自动挑空闲端口、自动打开浏览器）
curl -fsSL https://raw.githubusercontent.com/Andersen216/dsh-whale-girl-live2d/main/tools/dsh-web-deploy.sh | bash

# 想连桌宠插件一起装好
curl -fsSL https://raw.githubusercontent.com/Andersen216/dsh-whale-girl-live2d/main/tools/dsh-web-deploy.sh | bash -s -- --with-pet
```

Windows：下载仓库里的 `tools/dsh-web-deploy.cmd` **双击运行**（内部走 PowerShell，
已绕开执行策略；⚠️ 作者没有 Windows 机器，这版**尚未真机验证**）。

**它做了什么**：检查 Node（≥20）→ 复用已装的 dsh（没有就用 `npm exec` 免安装跑）→
用官方支持的 `--port 0` 让系统挑空闲端口 → 抓出带登录 token 的地址 → 自动开浏览器 →
（可选）装桌宠插件。

**子命令**：`--doctor` 只体检不起服务 · `stop` 停止 · `status` 看状态。
状态记在 `~/.dsh/.web-deploy.json`（**只存 pid/端口/时间，不存 token**）。

> 为什么不用现成的？调研了一圈（2026-10-03），社区 6 个「一键部署」项目**全是 Windows 专用**
> （.cmd / PowerShell / WinForms），macOS/Linux 的 `curl | bash` 是空白；而且多数选择
> 「下便携 Node + 拉源码 + 完整构建」这条 2–4GB 的重路径 —— 其实 `npm exec` 直接跑官方包即可。

## 兼容性（重要）

| 宿主 | 状态 |
| --- | --- |
| DSH **0.2.0-rc.1 / 0.2.0-rc.2**（官方桌面版当前版本） | ✅ **对齐的目标版本**，开发与验证都在这个版本上 |
| DSH 0.2.x（后续版本） | 🔄 会持续跟进 |
| DSH **0.1.x**（例如桌面版 0.1.7-rc.2） | ❌ **不支持** —— 会报 `failed to import` / `did not activate` |

为什么老版本不行：宿主插件 API 在 0.1.x → 0.2.x 之间有过变动
（举例：`connection.requestRejection` 在 0.1.0-rc.3 上不存在、0.1.5-rc.2 上才有）。
本插件本身**只依赖 Node 内置模块**、没有任何第三方依赖，所以加载失败不是缺依赖，
而是与老宿主的 API 不匹配。

````

</details>

**依据 3 · 源码核查**：[package.json:16-55](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/package.json#L16-L55)

包打入素材与脚本

<details>
<summary>查看原文（40行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "files": [
    "lib",
    "assets",
    "docs",
    "skill",
    "cordis.patch.yml",
    "README.md",
    "CHANGELOG.md",
    "AUTHORS.md",
    "PROVENANCE.md",
    "NOTICE.md",
    "LICENSE"
  ],
  "bin": {
    "dsh-pet": "tools/pet-ctl.mjs"
  },
  "scripts": {
    "build:model": "node tools/build-model.mjs",
    "preview": "node tools/preview-server.mjs",
    "test": "node tools/test-host.mjs",
    "smoke": "node tools/smoke.mjs",
    "shot": "node tools/shot.mjs",
    "test:e2e": "node tools/e2e.mjs",
    "test:agent": "node tools/e2e-agent.mjs",
    "ascii": "node tools/ascii.mjs",
    "test:e2e:ui": "node tools/ui-probe.mjs",
    "test:catalog": "node tools/catalog-test.mjs",
    "repro:stuck": "node tools/repro-stuck.mjs",
    "release:check": "node tools/publish.mjs --check",
    "release:github": "node tools/publish.mjs",
    "release:npm": "node tools/publish-npm.mjs",
    "release:npm:check": "node tools/publish-npm.mjs --check"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
```

</details>

**依据 4 · 源码核查**：[lib/index.js:137-140](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L137-L140)

宿主依赖声明

```text
export default {
  name: 'dsh-live2d-pet',
  inject: ['webServer', 'connection'],
  apply(ctx) {
```

#### 缺口

- 实时发行包、目标硬件性能、许可授权细节未独立核实
  **影响**：不能给商业复用许可结论或持续资源估计
  **进一步探讨**：核对应发布包/授权原件，测帧耗、内存与安装路径

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样保留趣味交互而减少安全和状态误导？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是让 connection 不可用/抛异常时所有自定义路由默认拒绝，桌面通行证继续强制回环并核 token 文件权限/轮换；对 /say、/cancel、/control 增明确审计和权限范围。钱包 HUD 要标估算、旧余额和内存今日值，并从当前官方费率或宿主计费数据驱动。对娱乐体验加减动效/省资源指标。验收覆盖信任栅栏失败、token 丢失、会话写入、断线及目标硬件。当前建议仅个人非关键试用，敏感路由需先修复。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:408-429](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L408-L429)

fail-open 位置

<details>
<summary>查看原文（22行）</summary>

```text
    function rejected(req, res) {
      try {
        if (isDesktopReq(req)) return false
        const conn = ctx.get('connection') || ctx.connection
        if (!conn || typeof conn.requestRejection !== 'function') {
          if (!rejected.warned) {
            rejected.warned = true
            try {
              console.warn('[live2d-pet] 信任栅栏不可用：connection 服务缺失，自定义路由将放行')
            } catch (err) {}
          }
          return false
        }
        const code = conn.requestRejection(req)
        if (code === undefined || code === null || code === false) return false
        res.statusCode = typeof code === 'number' ? code : 403
        res.end()
        return true
      } catch (err) {
        return false
      }
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:346-387](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L346-L387)

本地通行证存储

<details>
<summary>查看原文（42行）</summary>

```text
    let deskToken = null
    function desktopKey() {
      if (deskToken) return deskToken
      try {
        const raw = JSON.parse(fs.readFileSync(DESKTOP_FILE, 'utf8'))
        if (raw && typeof raw.token === 'string' && raw.token.length >= 16) {
          deskToken = raw.token
          // 宿主端口只有它自己知道（官方桌面版由宿主决定、dsh web 可能带 --port），
          // 所以顺手补写进文件：客户端读文件就能连上，不用猜端口。
          const livePort = ctx && ctx.webServer && ctx.webServer.port
          if (livePort && raw.port !== livePort) {
            try {
              fs.writeFileSync(DESKTOP_FILE, JSON.stringify({ ...raw, port: livePort }, null, 2), { mode: 0o600 })
            } catch (err) {}
          }
          return deskToken
        }
      } catch (err) {}
      const token = randomBytes(24).toString('hex')
      try {
        fs.writeFileSync(
          DESKTOP_FILE,
          JSON.stringify(
            {
              token,
              // 客户端据此自动连上正确的宿主（端口由宿主决定，因机器而异）
              port: (ctx && ctx.webServer && ctx.webServer.port) || null,
              note: '桌面版（macOS 原生壳）的本机通行证。删掉这个文件会自动重新生成，旧壳子需要重启。',
              createdAt: new Date().toISOString(),
            },
            null,
            2,
          ) + '\n',
          { mode: 0o600 },
        )
      } catch (err) {
        try {
          console.warn('[live2d-pet] 桌面版通行证写不进去：', err && err.message)
        } catch (e) {}
      }
      deskToken = token
      return deskToken
```

</details>

**依据 3 · 源码核查**：[lib/index.js:933-1050](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L933-L1050)

敏感动作路由

<details>
<summary>查看原文（118行）</summary>

```text
    route('exact', '/dsh-pet/say', async (req, res) => {
      if (req.method !== 'POST') {
        res.writeHead(405).end()
        return
      }
      const body = await json(req, res)
      if (!body) return
      const text = String(body.text || '').trim()
      if (!text) {
        res.writeHead(400, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: false, error: 'empty text' }))
        return
      }
      const controller = ctx.get('sessionController')
      if (!controller || typeof controller.prompt !== 'function') {
        res.writeHead(503, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: false, error: 'session controller unavailable' }))
        return
      }
      let sessionId = resolveSession(body.sessionId)
      let created = false
      if (!sessionId && typeof controller.create === 'function') {
        // 还没有会话就自己开一个——否则主人刚打开 DSH 时点桌宠说话会直接失败。
        try {
          const made = await controller.create({})
          sessionId = made && made.sessionId
          created = true
        } catch (err) {
          try {
            console.error('[live2d-pet] 自动建会话失败：', (err && err.stack) || err)
          } catch (e) {}
        }
      }
      if (!sessionId) {
        res.writeHead(503, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: false, error: 'no active session' }))
        return
      }
      try {
        // 第二个参数 signal 是**必需**的：SessionController.prompt(request, signal) 里
        // 第一行就是 signal.throwIfAborted()。走 RPC 时由载体提供，直接调用必须自己给。
        await controller.prompt(
          {
            requestId: randomUUID(),
            sessionId,
            mode: body.mode === 'steer' ? 'steer' : 'queue',
            content: [{ type: 'text', text }],
          },
          new AbortController().signal,
        )
        res.writeHead(200, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: true, sessionId, created }))
      } catch (err) {
        // 把栈打到宿主日志——这条路径出错时，前端只拿到一句 message，根本没法定位
        try {
          console.error('[live2d-pet] /say 送话失败：', (err && err.stack) || err)
        } catch (e) {}
        res.writeHead(500, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: false, error: err && err.message ? err.message : String(err) }))
      }
    })

    // 中断当前轮次（桌宠菜单里的“打断”按钮）
    route('exact', '/dsh-pet/cancel', async (req, res) => {
      if (req.method !== 'POST') {
        res.writeHead(405).end()
        return
      }
      const body = await json(req, res)
      if (!body) return
      const sessionId = resolveSession(body.sessionId)
      const controller = ctx.get('sessionController')
      try {
        if (!sessionId || !controller || typeof controller.cancel !== 'function') {
          throw new Error('cancel unavailable')
        }
        await controller.cancel({ sessionId })
        res.writeHead(200, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: true }))
      } catch (err) {
        res.writeHead(500, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: false, error: err && err.message ? err.message : String(err) }))
      }
    })

    /**
     * 外部驱动通道。桌宠自己的菜单用它，agent 也可以直接 POST 过来让模型做指定反应
     * （见 tools/pet-ctl.mjs）。这是“agent 主动表演”的唯一入口。
     */
    route('exact', '/dsh-pet/control', async (req, res) => {
      if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': MIME['.json'] })
        res.end(JSON.stringify({ ok: true, version: VERSION, sessions: clients.size }))
        return
      }
      if (req.method !== 'POST') {
        res.writeHead(405).end()
        return
      }
      const body = await json(req, res)
      if (!body) return
      const out = { t: 'control', ts: Date.now() }
      if (body.expression !== undefined) out.expression = body.expression === null ? null : String(body.expression)
      if (body.mood !== undefined) out.mood = body.mood === null ? null : String(body.mood)
      if (body.motion !== undefined) out.motion = body.motion === null ? null : String(body.motion)
      if (body.bubble !== undefined) out.bubble = body.bubble === null ? null : String(body.bubble)
      if (body.bubbleMs !== undefined) out.bubbleMs = Number(body.bubbleMs) || 0
      if (body.props !== undefined) out.props = body.props
      if (body.clearProps === true) out.clearProps = true
      if (body.say !== undefined) out.say = String(body.say)
      if (body.attention === true) out.attention = true
      // 工作简报：{title, body} / [title, body] / "纯文本" 都接受
      //（前端头顶会挂一个信封，点开是大号可读面板）
      if (body.report !== undefined && body.report !== null) out.report = body.report
      sendLocal(out)
      res.writeHead(200, { 'Content-Type': MIME['.json'] })
      res.end(JSON.stringify({ ok: true, clients: clients.size, sent: out }))
    })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:250-338](https://github.com/Andersen216/dsh-whale-girl-live2d/blob/f977bef508690e75ba6535cd8f4ce18e7f6ba9b0/lib/index.js#L250-L338)

钱包估算和缓存

<details>
<summary>查看原文（89行）</summary>

```text
    /** 余额缓存（60 秒）——不缓存的话，每轮结束都打一次官方接口 */
    const wallet = {
      balanceAt: 0,
      balance: null,
      balanceErr: '',
      lastTurn: null,
      turnSeq: 0,
      today: { date: '', amount: 0, tokens: 0 },
      keyWarned: false,
    }

    /** DeepSeek key：优先问 DSH 的凭据服务，其次看环境变量 */
    async function deepseekKey() {
      try {
        const cred = ctx.get('credentials')
        if (cred && typeof cred.resolve === 'function') {
          const c = await cred.resolve('DEEPSEEK_API_KEY')
          if (c && c.value) return String(c.value)
        }
      } catch (err) {
        if (!wallet.keyWarned) {
          wallet.keyWarned = true
          try {
            console.warn('[live2d-pet] 读不到凭据服务里的 DEEPSEEK_API_KEY：' + String((err && err.message) || err).slice(0, 120))
          } catch (e) {}
        }
      }
      return process.env.DEEPSEEK_API_KEY || ''
    }

    async function fetchBalance(force) {
      const now = Date.now()
      if (!force && wallet.balance && now - wallet.balanceAt < 60000) return wallet.balance
      const key = await deepseekKey()
      if (!key) {
        wallet.balance = { ok: false, code: 'NO_KEY', error: '没配置 DEEPSEEK_API_KEY' }
        wallet.balanceAt = now
        return wallet.balance
      }
      try {
        const res = await fetch('https://api.deepseek.com/user/balance', {
          headers: { Authorization: 'Bearer ' + key },
          signal: AbortSignal.timeout(8000),
        })
        if (!res.ok) throw new Error('HTTP ' + res.status)
        const j = await res.json()
        const info = (j && j.balance_infos && j.balance_infos[0]) || {}
        wallet.balance = {
          ok: true,
          totalBalance: Number(info.total_balance),
          currency: info.currency || 'CNY',
          isAvailable: j.is_available !== false,
          updatedAt: new Date().toISOString(),
        }
      } catch (err) {
        // 拿不到就沿用上一次的数字（标 stale），别让 HUD 变空
        const msg = String((err && err.message) || err).slice(0, 160)
        wallet.balance = wallet.balance && wallet.balance.ok
          ? Object.assign({}, wallet.balance, { stale: true, error: msg })
          : { ok: false, code: 'ERROR', error: msg }
      }
      wallet.balanceAt = now
      return wallet.balance
    }

    function todayKey() {
      return bjDate(Math.floor(Date.now() / 1000)).toISOString().slice(0, 10)
    }
    function addToday(amount, tokens) {
      const k = todayKey()
      if (wallet.today.date !== k) wallet.today = { date: k, amount: 0, tokens: 0 }
      wallet.today.amount += Number(amount) || 0
      wallet.today.tokens += Number(tokens) || 0
    }

    function walletSnapshot() {
      const nowSec = Math.floor(Date.now() / 1000)
      return {
        ok: true,
        version: VERSION,
        source: 'dsh-live2d-pet',
        isPeak: isPeakTime(nowSec),
        peakNextChangeAt: nextPeakChangeAt(nowSec),
        balance: wallet.balance,
        today: { date: wallet.today.date, amount: wallet.today.amount, tokens: wallet.today.tokens },
        turn: wallet.lastTurn,
        priceTier: 'flash',
        priceNote: 'Flash 空闲 0.02/1/4・高峰 ×2（元每百万 token）',
      }
```

</details>

#### 缺口

- 安全修正、费率与性能方案未实现/验证
  **影响**：不能计入当前能力
  **进一步探讨**：先做失败注入和最小安全修复，再作目标宿主验收

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
