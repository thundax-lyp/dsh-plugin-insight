# dsh-status-rotator

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[bf980a6](https://github.com/01Virex/dsh-status-rotator/tree/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1)

<!-- BEGIN META -->
[![GitHub ★ 197](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=197&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 10,930](https://img.shields.io/static/v1?label=npm+30d&message=10%2C930&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-status-rotator)
<!-- END META -->

> **实现功能**：DSH 运行状态文案、主题、弹幕与鲸尾动画插件，带持久配置与词库热更新。

> **核心亮点**：把阶段短语、动画和跨升级配置组成可调状态体验。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：私有 DOM 结构易随宿主/其他插件 CSS 改变；默认自动拉 main 词库并有持续定时器。详见[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 状态文案轮换服务何种体验，保留什么宿主信息？](#detail-section-11)
  - [Q02 · 词库层与配置持久化如何避免升级丢设置？](#detail-section-12)
  - [Q03 · 并发保存与网页请求有哪些控制？](#detail-section-13)
  - [Q04 · 自动更新与动态 UI 的持续成本是什么？](#detail-section-14)
  - [Q05 · 如何分阶段试用并验证可访问性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户希望长任务的运行状态更有辨识度且保留宿主时钟/读屏。

DSH 原生 Deep diving 状态行；插件增加可编辑短语和视觉层。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 状态行 | 反馈 | 宿主 DOM |
| 设置 | 升级留存 | If-Match 可选 |
| 词库 | 自动更新 | 远端 main |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| DSH Web DOM | 状态接管 | 不显示或错位 |
| webServer | 配置路由 | 文件回退 |
| CDN | 自动词库 | 保留旧库 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 基础 | 静态文案 | 时钟和读屏保留 |
| 设置 | 两标签保存 | 409 冲突可见 |
| 动画 | 逐项启用 | 性能预算内 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 安装 | Desktop/Web profile 重启 | 版本适配 |
| 使用 | 动画/推送/远端拉取 | CPU/电耗 |
| 维护 | 配置迁移/CSS 协作 | 宿主 DOM 漂移 |

| 结果 | 源码支持 | 未证实 |
| --- | --- | --- |
| 文案回退 | 空库用宿主原文 | 实机呈现 |
| 设置 | $DSH_HOME 持久 | 复杂升级 |
| 同步 | SSE/ETag | 反代行为 |

> **思考**：私有 DOM 结构易随宿主/其他插件 CSS 改变；默认自动拉 main 词库并有持续定时器。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把阶段短语、动画和跨升级配置组成可调状态体验。详见[Q01](#research-q01)、[Q02](#research-q02)。

把阶段短语、动画和跨升级配置组成可调状态体验。详见[Q01](#research-q01)、[Q02](#research-q02)。

Node half 分层配置与可选 If-Match，SSE 推送；客户端适配多代私有 DOM，远端词库默认主分支。

<a id="detail-section-5"></a>

### 1.4 主要限制

私有 DOM 结构易随宿主/其他插件 CSS 改变；默认自动拉 main 词库并有持续定时器。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

测试 profile 先静态文案，再逐项开启更新与动画，核读屏和性能。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持多版本适配及配置机制；视觉、性能与真实升级仍未验证，远端 main 默认自动更新。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js、SECURITY.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 README、package、Node/客户端源码与安全说明；未运行目标插件或浏览器。
- 下一步：隔离 profile 测多代宿主、读屏、双标签冲突和多页面 CPU/网络。

**分析版本**

- **仓库**：[01Virex/dsh-status-rotator](https://github.com/01Virex/dsh-status-rotator)
- **版本号**：0.37.0（[固定提交 bf980a6](https://github.com/01Virex/dsh-status-rotator/tree/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

宿主稳定状态槽位可减少 DOM 猜测与 CSS 协作负担，尚非本包能力。详见[Q05](#research-q05)。

隔离 profile 测多代宿主、读屏、双标签冲突和多页面 CPU/网络。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 4184 | — | — | 70472 |
| .cjs | source | 25 | 7094 | 5859 | 943 | — |
| .js | source | 3 | 11855 | 9219 | 2337 | — |
| .mjs | source | 1 | 111 | 88 | 15 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 23](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=23&color=grey&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+created%3A2026-09-22T06%3A00%3A35.767Z..2026-10-22T06%3A00%3A35.767Z) [![近30天关闭 23](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=23&color=grey&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A00%3A35.767Z..2026-10-22T06%3A00%3A35.767Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**审查状态 UI、配置持久、远端词库和读屏兼容边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 状态文案轮换服务何种体验，保留什么宿主信息？

**研究主题：**场景与需求

#### 完整回答

插件在 DSH Web/Desktop 的运行中行旁轮换短语、渐变、打字机和可选弹幕/鲸尾，面向长任务等待反馈的个性化。客户端识别旧版 role=status、0.1.7 折叠头、0.2.0 data-chat-running 等布局；空词库回退宿主原文，0.2.0 的读屏公告按源码注释保留。README 的 1362 短语与 14 包是作者计数，本轮未重新计数或目视评估。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-11](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/README.md#L1-L11)

定位与数量声称。

<details>
<summary>查看原文（11行）</summary>

```text
# dsh-status-rotator

> Give DSH's running status your own voice: **custom phrases, typewriter output, day/night gradients, danmaku and an optional animated whale tail**. Ships **1362 phrases, 14 theme packs**; choose which packs to enable.

**English** | [中文](./README_ZH.md) · [Effects](#effect-preview) · [Install](#installation) · [Reference](#feature-overview) · [Changelog](./CHANGELOG.md)

[![npm version](https://img.shields.io/npm/v/dsh-status-rotator?color=4a6cf7)](https://www.npmjs.com/package/dsh-status-rotator)
[![GitHub stars](https://img.shields.io/github/stars/01Virex/dsh-status-rotator?color=4a6cf7)](https://github.com/01Virex/dsh-status-rotator)
[![license](https://img.shields.io/github/license/01Virex/dsh-status-rotator)](LICENSE)

A [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) client plugin that replaces `Deep diving...` / `深度求索中...` with editable phrases while preserving the host's elapsed-time clock.
```

</details>

**依据 2 · 作者声明**：[README.md:127-142](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/README.md#L127-L142)

不同版本状态行说明。

<details>
<summary>查看原文（16行）</summary>

```text
### First run

On first start the plugin serves, in order: your **saved settings** (`$DSH_HOME/status-rotator/config.json`) → the package `config.json` → `config.example.json` (what an npm install has: all 1362 default phrases live inside it, see [Phrase Bank](#phrase-bank)). Two more layers join in: the **auto-updated bank** (every 6 hours, see [Auto-updating the bank](#auto-updating-the-bank)) and the optional **external bank** (`$DSH_HOME/status-rotator/phrases.json`, highest priority, see [Hot-reloadable external bank](#hot-reloadable-external-bank)). Edit files directly (hot-reloaded while a page is open) or use the Settings → Status Texts page of DSH.

<details>
<summary>Host version details and isolated testing</summary>

> **Status line as of dsh 0.1.7**: the host moved it into the turn's fold header `button[data-turn-process]` (`Deep diving for 12s`), which scrolls out of view in a long turn. The plugin moves the line **back above the input box**, styled like dsh ≤0.1.6's `.turnStatus` (26px, shimmer, 13px clock) and pinned with the composer; the header copy is hidden and returns when the turn ends. Duration and phase come from reading the header label (never writing into it). On 0.1.6 and older the `role="status"` line already sits there and behaves as before.
>
> **Status line as of dsh 0.2.0**: while a turn runs the host no longer keeps the text inside the fold header — it renders a separate row in the conversation flow, `div[data-chat-running]` (hidden announcement + divider + **DeepSeek whale-tail icon** + shimmer text), and `button[data-turn-process]` now only renders once the turn is **closed**. The plugin gained a matching host path: it adopts that row (writes its phrase into it, hides the host's own shimmer text, still reads the duration from the host text) with the same position and look, and leaves the screen-reader announcement untouched. **`whaleTail` (off by default)** keeps the **whale tail** in that row, next to the plugin's phrase, and animates it with the rainbow-gradient palette. The separate **tail-wagging** switch can follow tok/s or use a fixed speed; enabling that switch explicitly opts in to the wag.

> **Starting an isolated test instance** (without touching your daily profile): install a dsh version into a temp dir and boot a profile with its own `DSH_HOME` — `DSH_HOME=/tmp/dsh-test node /tmp/dsh-test/node_modules/.bin/dsh test020 --from-default-profile web --no-open --port 3081`, then `dsh plugin --profile test020 add <this plugin dir>`. That instance's config store, bank and settings live inside its own `DSH_HOME`, so your daily instance is untouched.

</details>

> **Never a blank line**: `config.labelSource` (default `"phrases"`) decides the text; with an empty bank the plugin's line falls back to the host text instead of rendering an empty row. Set it to `"host"` to drop rotation and get the verbatim 0.1.6 `.turnStatus` look (weight 500, inline-flex, 26px, shimmer, clock after 15s).
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1062-1080](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/client.js#L1062-L1080)

空词库回退。

<details>
<summary>查看原文（19行）</summary>

```text
		/**
		 * 状态行这一次该显示什么(纯函数,供 smoke test 覆盖):
		 *   "phrases" → 从短语库里抽一句轮换;
		 *   "host"    → 显示宿主原文(「Deep diving…」/「深度求索中」),不走打字机;
		 *   "keep"    → 什么都不做,保持现状。
		 *
		 * 两条回落规则:
		 *   1. `labelSource: "host"` = 用户要「纯 0.1.6 观感」:插件自己那条线(0.1.7
		 *      的 LINE_CLASS)写宿主原文;旧宿主(≤0.1.6)的 TurnStatus 本来就写着宿主
		 *      原文,插件不该去改写它 → keep。
		 *   2. 短语库为空(没 config.json / 没文案)时,插件自己那条线**回落宿主原文**
		 *      —— 这就是「状态行变成一条空行、deep diving 不见了」的修复;旧宿主同理
		 *      保持 keep(它自己那句就是原文,不碰最忠实)。
		 */
		function labelPlanFor(source, hasPhrases, ownLine) {
			if (source === "host") return ownLine ? "host" : "keep";
			if (hasPhrases) return "phrases";
			return ownLine ? "host" : "keep";
		}
```

</details>

**依据 4 · 源码核查**：[lib/client.js:2989-3005](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/client.js#L2989-L3005)

新版 DOM 标记与读屏节点。

<details>
<summary>查看原文（17行）</summary>

```text
			/**
			 * dsh 0.2.0 起,「运行中」不再是折叠头按钮里的一段文本,而是会话流里独立的一行:
			 *   div[data-chat-running]
			 *     ├─ span(visuallyHidden, role=status, aria-live=polite)  ← 读屏公告,别动
			 *     ├─ span(class*=runningDivider)
			 *     └─ span(class*=runningContent)
			 *          ├─ span(class*=runningIcon)   ← **鲸鱼尾巴**(svg,stroke=currentColor)
			 *          └─ span(class*=runningText)   ← shimmer 文案("Deep diving for 12s")
			 * 折叠头按钮(button[data-turn-process])在 0.2.0 只在**回合结束后**才渲染(收起态摘要),
			 * 所以运行期间插件必须认得这一行,否则整条状态行都不会被接管(0.2.0 兼容的核心)。
			 */
			const RUNNING_ROW_SELECTOR = "[data-chat-running]";
			const RUNNING_TEXT_SELECTOR = '[class*="runningText"]';
			const RUNNING_ICON_SELECTOR = '[class*="runningIcon"]';
			/** 插件给宿主鲸鱼尾巴加的类:样式表据此给它上炫彩流光 */
			const TAIL_CLASS = "dsh-status-rotator-whale-tail";
			const TAIL_WAG_CLASS = "dsh-status-rotator-whale-wag";
```

</details>

#### 缺口

- 未运行真实 DSH 或视觉体验测试。
  **影响：**宿主版本适配与动画效果未知。
  **进一步探讨：**按 0.1.6/0.1.7/0.2.0 实机矩阵验证。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 词库层与配置持久化如何避免升级丢设置？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

Node half 将随包默认、包内旧配置、远端词库、旧宿主设置、$DSH_HOME 用户配置和外部词库分层合成；用户写入以 $DSH_HOME/status-rotator/config.json 为真相源，包内 config.json 仅兼容镜像。旧包目录手改内容通过指纹辨别并迁移，防升级覆盖；外部词库按文件变化热读。相对纯浏览器 localStorage，这提供跨升级和共享设置的持久路径。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-45](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/index.js#L1-L45)

层次与升级迁移设计。

<details>
<summary>查看原文（45行）</summary>

```text
/**
 * dsh-status-rotator — node half.
 *
 * The browser half (lib/client.js) swaps the "Deep diving..." turn-status
 * label. This node half serves AND persists the config document:
 *
 *   GET/HEAD /plugins/dsh-status-rotator/config.json
 *       → stream the effective document, layered as
 *         bundled config.example.json → package config.json → auto-updated phrase
 *         bank ($DSH_HOME/status-rotator/bank.remote.json) → legacy settings
 *         namespace (only on hosts whose settings service still exposes
 *         `register`) → **user config store**
 *         (`$DSH_HOME/status-rotator/config.json`, survives plugin upgrades;
 *         `DSH_STATUS_ROTATOR_CONFIG` overrides the path) → external phrase bank
 *         (`$DSH_HOME/status-rotator/phrases.json`, or
 *         `$DSH_STATUS_ROTATOR_BANK`; re-read whenever the file changes).
 *         Both banks only carry `packs` / `phrases`.
 *   PUT/POST  same route
 *       → validate the submitted JSON, persist the delta into the user config
 *         store (durable across upgrades) and mirror the full document to the
 *         package-local config.json for backward compatibility.
 *
 * Where settings actually live is the whole point of issue #51: the package
 * directory is replaced wholesale on every plugin upgrade, so anything stored
 * next to the package is gone afterwards. Host-side settings were the original
 * plan, but `@deepseek-ai/dsh-settings` 0.1.7-rc.1 only offers
 * `describe`/`update`/`replace`/`mutate` — the `register()` API this plugin was
 * written against no longer exists, so that path silently returned null and the
 * package-local config.json was the only store left. Persistence now lives in
 * the plugin's own data directory under `$DSH_HOME`, which no upgrade touches.
 *
 * On start-up (and on every GET, so a hand-edited file is picked up while it
 * still exists) the package-local config.json is absorbed into the user config
 * store, because that file is documented as editable and is otherwise lost with
 * the next upgrade. A content fingerprint recorded in the store tells our own
 * mirror apart from a human edit, so the mirror is never absorbed twice.
 *
 * The external bank is what makes a phrase update take effect without
 * republishing or reinstalling the npm package: edit that one file and the
 * node half serves the new content on the next request (the browser half
 * re-reads every `reloadIntervalMs` while the page stays open).
 *
 * The browser half fetches that URL by default. No manual localStorage or
 * deployment step is needed — drop config.json next to this package, restart
 * `dsh web`, hard-refresh.
```

</details>

**依据 2 · 源码核查**：[lib/index.js:65-100](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/index.js#L65-L100)

路径与远端词库参数。

<details>
<summary>查看原文（36行）</summary>

```text
/** 官方持久设置命名空间(存于 $DSH_HOME/settings.yaml,升级插件不会清空) */
const SETTINGS_NS = "status-rotator";
/**
 * 外部词库(热重载)的默认位置:$DSH_HOME/status-rotator/phrases.json。
 * npm 包目录会随升级被整体替换(而且通常不可写),所以词库的"可写副本"必须落在
 * 用户数据目录里;该文件是**可选**覆盖层,不存在时完全按内置词库(config.example.json)运行。
 */
const BANK_DIR = "status-rotator";
const BANK_FILE = "phrases.json";
/** 覆盖外部词库路径的环境变量(绝对路径,或相对当前工作目录) */
const BANK_PATH_ENV = "DSH_STATUS_ROTATOR_BANK";
/**
 * 用户配置的持久存储:**必须**和词库一样落在 `$DSH_HOME/status-rotator/` 下,
 * 不能落在包目录里 —— 包目录会被 npm / Release 升级整体替换,写在里面的配置每次升级
 * 都会没(issue #51「每次更新都会重置我设置的」的根因,详见 userConfigPath)。
 */
const USER_CONFIG_FILE = "config.json";
/** 覆盖用户配置存储路径的环境变量(绝对路径,或相对当前工作目录;测试用) */
const USER_CONFIG_ENV = "DSH_STATUS_ROTATOR_CONFIG";
/**
 * 自动更新(从上游拉取词库):默认源是仓库 main 分支的 config.example.json,
 * 走 jsDelivr CDN(国内可达性优于 raw.githubusercontent);可用环境变量覆盖成
 * raw / 镜像 / 自建地址,空或 off = 关闭。
 */
const BANK_URL_ENV = "DSH_STATUS_ROTATOR_BANK_URL";
const DEFAULT_BANK_URL = "https://cdn.jsdelivr.net/gh/01Virex/dsh-status-rotator@main/config.example.json";
/** 自动更新检查间隔(毫秒);未设置 = 6 小时,0 / 非法 = 关闭 */
const BANK_INTERVAL_ENV = "DSH_STATUS_ROTATOR_BANK_INTERVAL_MS";
const DEFAULT_BANK_INTERVAL_MS = 6 * 60 * 60 * 1000;
/** 上游词库的落盘缓存文件名(放在本地词库文件同目录,用户不用手改) */
const BANK_REMOTE_FILE = "bank.remote.json";
/** 单次拉取上限 2 MiB(正常 config.example.json 约 75 KB) */
const MAX_BANK_BYTES = 2 * 1024 * 1024;

/** 请求体上限(5 MiB),避免异常大 body 吃内存 */
const MAX_BODY_BYTES = 5 * 1024 * 1024;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1756-1765](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/index.js#L1756-L1765)

写入顺序。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * 保存设置页提交的完整文档。
 *
 * 落盘顺序(**持久化以用户配置存储为准**):
 *   1. 用户配置存储 `$DSH_HOME/status-rotator/config.json` —— 升级不会被替换,写不进去
 *      就明确 500,不假装保存成功(v0.26.0 及以前只写包目录,升级即丢,#51);
 *   2. 包目录 `config.json` 兼容镜像 —— 文档 / 老版本 / 手改工作流都认它,失败不算保存
 *      失败(数据已经在存储里了),只是把指纹记成 null 不再认领这个文件;
 *   3. 老宿主(settings 服务还带 `register` 的那代)顺带写一份官方命名空间。
 */
```

</details>

**依据 4 · 作者声明**：[README.md:127-129](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/README.md#L127-L129)

作者所述配置层次。

```text
### First run

On first start the plugin serves, in order: your **saved settings** (`$DSH_HOME/status-rotator/config.json`) → the package `config.json` → `config.example.json` (what an npm install has: all 1362 default phrases live inside it, see [Phrase Bank](#phrase-bank)). Two more layers join in: the **auto-updated bank** (every 6 hours, see [Auto-updating the bank](#auto-updating-the-bank)) and the optional **external bank** (`$DSH_HOME/status-rotator/phrases.json`, highest priority, see [Hot-reloadable external bank](#hot-reloadable-external-bank)). Edit files directly (hot-reloaded while a page is open) or use the Settings → Status Texts page of DSH.
```

#### 缺口

- 未模拟真实 npm 升级。
  **影响：**迁移在复杂历史配置下的正确性未独立验证。
  **进一步探讨：**用旧版配置样本离线迁移对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 并发保存与网页请求有哪些控制？

**研究主题：**工程质量与复用、缺陷与关键质疑

#### 完整回答

GET 返回正文对应 ETag，设置页 PUT 带 If-Match，保存串行锁把检查与落盘串起来；无 If-Match 或 * 明确允许覆盖，因此只保护遵约客户端。写接口检查 content-type/Origin/Host 等作者说明的栅栏，配置校验和 CSS 色值白名单、计时下限抑制注入/资源耗尽。SECURITY.md 自承 DNS rebinding 残余风险，端口若暴露非环回应有外层鉴权；本轮未做漏洞验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:296-329](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/index.js#L296-L329)

服务端安全动机与限制值。

<details>
<summary>查看原文（34行）</summary>

```text
/**
 * 配置安全栅栏(服务端)。
 *
 * 为什么需要:这个写接口是本地 HTTP 端点,宿主 dsh 的 /api 通道有
 * Host/Origin 栅栏 + cookie 鉴权,插件自己注册的路由两者都不经过。
 * 跨站页面用 fetch(..., { mode: "no-cors", headers: { "content-type": "text/plain" } })
 * 发的是「简单请求」,不触发预检 —— 于是任何人都能改写你的本地配置。
 *
 * 两个方向一起堵:
 *   1. 请求侧:isTrustedWrite / isTrustedRead(见下);
 *   2. 内容侧:颜色白名单(颜色值会被拼进浏览器端注入的 <style>,
 *      一个 ";" 就能越出声明块注入任意 CSS)+ 数值钳制
 *      (intervalMs 直接喂给 setInterval,没有下限就是自 DoS)。
 */
const COLOR_RE = /^(#[0-9a-f]{3,8}|[a-z]{3,20}|(?:rgb|rgba|hsl|hsla)\(\s*[0-9.,%\s/deg-]+\))$/i;
/** 渐变配色模式白名单:auto = 跟随深浅色主题,day / night = 强制其中一套 */
const GRADIENT_MODES = ["auto", "day", "night"];
/** 渐变流动方向白名单:rtl = 从右向左(默认),ltr = 从左向右 */
const GRADIENT_DIRECTIONS = ["rtl", "ltr"];
/** 鲸鱼尾巴摇动速度来源 */
const WHALE_TAIL_MOTION_MODES = ["tps", "fixed"];
const WHALE_TAIL_ACTIONS = ["wag", "sway", "twist", "official"];
const WHALE_TAIL_ANIMATIONS = [...WHALE_TAIL_ACTIONS, "random"];
const WHALE_TAIL_WAG_SPEED_RANGE = [0.25, 6];
/** tok/s 模式的分档数上限(0 / 1 表示不分档);与浏览器半边的 WHALE_TAIL_TPS_TIER_MAX 对齐 */
const WHALE_TAIL_TPS_TIER_MAX = 5;
/** 状态行文案来源白名单:phrases = 轮换短语库(默认);host = 只用宿主原文(0.1.6 观感) */
const LABEL_SOURCES = ["phrases", "host"];
const CONFIG_LIMITS = {
	intervalMs: [250, 3600000],
	typeSpeedMs: [0, 1000],
	longAfterMs: [1000, 86400000],
	reloadIntervalMs: [1000, 3600000],
	liveTickMs: [250, 60000]
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1586-1613](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/index.js#L1586-L1613)

ETag 与串行锁。

<details>
<summary>查看原文（28行）</summary>

```text
/** 一段文本 → 带引号的 ETag(与 If-Match / If-None-Match 直接比字符串) */
function etagFor(text) {
	return '"' + digestOf(String(text)).slice(0, 20) + '"';
}

/**
 * 配置文档的对外表示。GET 的 body 与它的 ETag **必须出自同一段文本**,否则
 * If-None-Match 的 304 判断与 If-Match 的前提校验会各说各话。
 */
function documentText(doc) {
	return JSON.stringify(contentTypeOf(doc), null, 4) + "\n";
}

/** 当前生效文档的 ETag;文档不可用(404 那种)返回 null */
async function currentConfigEtag(getSettingsApi) {
	const doc = await effectiveConfigDocument(getSettingsApi);
	return doc === null ? null : etagFor(documentText(doc));
}

/**
 * 保存串行化:If-Match 的「检查」与随后的「落盘」之间不能有另一个 PUT 插进来,
 * 否则两个并发请求可以双双通过检查再先后覆盖 —— 那正是要修的那个洞。
 */
let saveTail = Promise.resolve();
function withSaveLock(fn) {
	const run = saveTail.then(fn, fn);
	saveTail = run.then(() => {}, () => {});
	return run;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1712-1753](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/index.js#L1712-L1753)

读写路由。

<details>
<summary>查看原文（42行）</summary>

```text
function createServeConfig(getSettingsApi) {
	return async function serveConfig(req, res) {
		if (req.method === "GET" || req.method === "HEAD") {
			if (!isTrustedRead(req)) {
				rejectUntrusted(res, "读取");
				return;
			}
			const doc = await effectiveConfigDocument(getSettingsApi);
			if (doc === null) {
				res.writeHead(404);
				res.end();
				return;
			}
			const text = documentText(doc);
			const etag = etagFor(text);
			// 客户端带着上次的 ETag 来问时,没变就 304 —— 轮询兜底路径也就不必再传整个 body
			const inm = String(req.headers["if-none-match"] || "").trim();
			if (inm.length > 0 && inm === etag) {
				res.writeHead(304, { "cache-control": "no-cache", [ETAG_HEADER]: etag });
				res.end();
				return;
			}
			res.writeHead(200, {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-cache",
				[ETAG_HEADER]: etag
			});
			res.end(text);
			return;
		}
		if (req.method === "PUT" || req.method === "POST") {
			if (!isTrustedWrite(req)) {
				rejectUntrusted(res, "写入");
				return;
			}
			// 整段保存串行化 —— 校验与落盘之间不允许另一个 PUT 插队
			await withSaveLock(() => saveConfig(req, res, getSettingsApi));
			return;
		}
		res.writeHead(405);
		res.end();
	};
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1785-1799](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/index.js#L1785-L1799)

可选 If-Match。

<details>
<summary>查看原文（15行）</summary>

```text
	// ── If-Match 前提校验(必须在任何写入之前) ──
	// 语义按标准 HTTP:前提是**客户端自愿**的。
	//   缺省 / `*` → 无条件写(后写覆盖)。这是既有写入方(手写脚本、老设置页)一直以来的行为,
	//                 不做静默变更 —— 它们照样能用,只是拿不到并发保护;
	//   带了且不匹配 → 409:两端基于同一份旧配置先后写入时,后到的这次被明确拒绝。
	// 本插件的设置页**始终**带 If-Match,所以「两个标签页互相覆盖」那条路已经堵上。
	const ifMatch = String(req.headers["if-match"] || "").trim();
	if (ifMatch.length > 0 && ifMatch !== "*") {
		const current = await currentConfigEtag(getSettingsApi);
		if (ifMatch !== current) {
			res.writeHead(409, { "content-type": "application/json; charset=utf-8", [ETAG_HEADER]: current || "" });
			res.end(JSON.stringify({ ok: false, code: "conflict", etag: current, error: "配置在别处已经变更,这次写入已拒绝 —— 重读后再保存" }));
			return;
		}
	}
```

</details>

**依据 5 · 作者声明**：[SECURITY.md:23-26](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/SECURITY.md#L23-L26)

作者安全边界。

```text
## What is in scope

- **The local config route** (`GET`/`PUT /plugins/dsh-status-rotator/config.json`). Write requests are fenced by: `content-type: application/json` (cross-origin simple requests cannot set it), `sec-fetch-site` limited to `same-origin`/`none`, an `Origin` that must match the request `Host`, and the host's loopback-only binding by default. **Known residual risk**: DNS rebinding is same-origin from the browser's point of view and is not caught by this fence — if you expose the port beyond loopback, put an authenticating reverse proxy in front of it.
- **The client half** (`lib/client.js`): it takes over DOM nodes in the DSH Web UI, animates the status line/tail, and renders phrase text. Phrase and config text is inserted as **text**, never as HTML; the submission bot additionally rejects HTML and `;`, so a malicious phrase bank should not be able to inject markup or script.
```

#### 缺口

- 未检查宿主实际监听/反代配置。
  **影响：**网络可达性与 DNS rebinding 风险取决于部署。
  **进一步探讨：**隔离端口与反代环境验证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 自动更新与动态 UI 的持续成本是什么？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

默认从 jsDelivr 拉 main 分支词库，启动即拉、随后默认 6 小时刷新；最多 2 MiB、15 秒超时，校验后仅留 packs/phrases，失败保留旧缓存。SSE 变更推送每 25 秒心跳、文件变更检测每 2 秒，客户端可回退轮询。动态 DOM 依赖宿主私有结构和其他插件 CSS 配合，视觉动画、长连接和定时器有持续资源成本；实际 CPU/电耗尚无独立测量。远端 main 内容可无版本更新，用户须接受内容变动或显式关闭。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:85-100](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/index.js#L85-L100)

默认 URL/间隔/大小。

<details>
<summary>查看原文（16行）</summary>

```text
 * 自动更新(从上游拉取词库):默认源是仓库 main 分支的 config.example.json,
 * 走 jsDelivr CDN(国内可达性优于 raw.githubusercontent);可用环境变量覆盖成
 * raw / 镜像 / 自建地址,空或 off = 关闭。
 */
const BANK_URL_ENV = "DSH_STATUS_ROTATOR_BANK_URL";
const DEFAULT_BANK_URL = "https://cdn.jsdelivr.net/gh/01Virex/dsh-status-rotator@main/config.example.json";
/** 自动更新检查间隔(毫秒);未设置 = 6 小时,0 / 非法 = 关闭 */
const BANK_INTERVAL_ENV = "DSH_STATUS_ROTATOR_BANK_INTERVAL_MS";
const DEFAULT_BANK_INTERVAL_MS = 6 * 60 * 60 * 1000;
/** 上游词库的落盘缓存文件名(放在本地词库文件同目录,用户不用手改) */
const BANK_REMOTE_FILE = "bank.remote.json";
/** 单次拉取上限 2 MiB(正常 config.example.json 约 75 KB) */
const MAX_BANK_BYTES = 2 * 1024 * 1024;

/** 请求体上限(5 MiB),避免异常大 body 吃内存 */
const MAX_BODY_BYTES = 5 * 1024 * 1024;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:856-939](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/index.js#L856-L939)

拉取和失败回退。

<details>
<summary>查看原文（84行）</summary>

```text
/**
 * 拉一次上游词库:结构校验 → 只留 packs / phrases → 与当前缓存比对,变了才原子写盘,
 * 并立刻在内存里生效(下一次 GET 就能读到,不需要重启、不需要重装包)。任何失败都只
 * 记录状态并保留上一次成功的词库 —— 离线 / CDN 挂掉不影响插件运行。
 */
async function refreshRemoteBank() {
	const url = remoteBankUrl();
	if (!url) return { ok: false, skipped: "disabled" };
	if (remoteBankUpdate.inFlight) return { ok: false, skipped: "in-flight" };
	if (typeof fetch !== "function") {
		remoteBankUpdate.lastCheckAt = Date.now();
		remoteBankUpdate.lastError = "当前运行时没有全局 fetch";
		return { ok: false, error: remoteBankUpdate.lastError };
	}
	remoteBankUpdate.inFlight = true;
	remoteBankUpdate.lastCheckAt = Date.now();
	try {
		const response = await fetch(url, {
			redirect: "follow",
			signal: AbortSignal.timeout(15000),
			headers: { accept: "application/json", "user-agent": "dsh-status-rotator" }
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		const text = await response.text();
		if (Buffer.byteLength(text, "utf8") > MAX_BANK_BYTES) throw new Error("上游词库超过 2 MiB,已忽略");
		const doc = phraseOnlyDocument(validateConfigDocument(JSON.parse(text)));
		if (doc.packs === undefined && doc.phrases === undefined) throw new Error("上游词库为空");
		const current = await remoteBankDocument();
		let updated = false;
		if (current === null || !deepEqualJson(current, doc)) {
			const path = remoteBankPath();
			await mkdir(dirname(path), { recursive: true });
			const tmpPath = `${path}.tmp-${process.pid}-${Date.now()}`;
			const serialized = JSON.stringify(doc, null, 4) + "\n";
			try {
				await writeFile(tmpPath, serialized, "utf8");
				await rename(tmpPath, path);
			} catch (error) {
				try {
					await unlink(tmpPath);
				} catch (cleanupError) {
					if (cleanupError.code !== "ENOENT") throw cleanupError;
				}
				throw error;
			}
			const kept = remoteBankCache.path === path ? remoteBankCache : null;
			remoteBankCache = { path, mtimeNs: null, size: -1, text: serialized, doc, reloads: (kept ? kept.reloads : 0) + 1, error: null };
			remoteBankUpdate.updates++;
			updated = true;
		}
		remoteBankUpdate.lastSuccessAt = Date.now();
		remoteBankUpdate.lastError = null;
		return { ok: true, updated };
	} catch (error) {
		remoteBankUpdate.lastError = String((error && error.message) || error);
		return { ok: false, error: remoteBankUpdate.lastError };
	} finally {
		remoteBankUpdate.inFlight = false;
	}
}

/**
 * 启动自动更新定时器:串行执行(上一次没跑完不叠加请求),timer 挂 unref,不影响
 * 进程退出。返回停止函数,交给 ctx.effect 清理。
 */
function startRemoteBankUpdater() {
	if (!remoteBankUrl() || remoteBankIntervalMs() <= 0) return () => {};
	let timer = null;
	let stopped = false;
	const tick = async () => {
		try {
			await refreshRemoteBank();
		} catch (error) { /* refreshRemoteBank 内部已记录错误 */ }
		if (stopped || !remoteBankUrl() || remoteBankIntervalMs() <= 0) return;
		timer = setTimeout(tick, remoteBankIntervalMs());
		if (typeof timer.unref === "function") timer.unref();
	};
	timer = setTimeout(tick, 0);
	if (typeof timer.unref === "function") timer.unref();
	return () => {
		stopped = true;
		if (timer !== null) clearTimeout(timer);
	};
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1577-1584](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/index.js#L1577-L1584)

推送和检测周期。

```text
/** ── 并发控制 ── 响应头名:GET 发它,PUT 用它做前提校验(If-Match) */
const ETAG_HEADER = "etag";
/** ── 推送式热重载 ── SSE 事件路由(独立的 exact path,宿主不允许重复 path) */
const EVENTS_PATH = "/plugins/dsh-status-rotator/events";
/** 服务端变更检测间隔:只做本地 stat / 比对,不产生网络往返 */
const CHANGE_TICK_MS = 2000;
/** SSE 心跳间隔:防中间代理或宿主把长连接掐掉 */
const SSE_HEARTBEAT_MS = 25000;
```

**依据 4 · 源码核查**：[lib/index.js:1940-1999](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/index.js#L1940-L1999)

生命周期与路由。

<details>
<summary>查看原文（60行）</summary>

```text
	ctx.effect(() => startRemoteBankUpdater(), "status-rotator: remote bank updater");

	ctx.effect(() => {
		const handler = createServeConfig(getSettingsApi);
		// SSE 事件路由(独立的 exact path)与事件路由自己的 disposer
		const eventsHandler = createEventsRoute(getSettingsApi);
		let attempts = 0;
		let routeDisposer = null;
		let eventsDisposer = null;
		let timer = null;
		let changeTimer = null;
		/** 本地变更检测 —— 手改的 config.json、上游词库更新也就能推出去,而不只是设置页保存 */
		const tick = async () => {
			try { await broadcastIfChanged(getSettingsApi, "file"); } catch (error) { /* 单拍失败不影响下一拍 */ }
		};
		const registerNow = () => {
			let ws = null;
			try {
				ws = typeof ctx.get === "function" ? ctx.get("webServer") : null;
			} catch (error) { /* ignore */ }
			if (!ws) {
				try { ws = ctx.webServer || null; } catch (error) { /* ignore */ }
			}
			if (!ws || typeof ws.register !== "function") return false;
			routeDisposer = ws.register({
				kind: "exact",
				path: "/plugins/dsh-status-rotator/config.json",
				handler
			});
			// 事件路由注册失败(比如宿主版本不支持长连接)不算致命:轮询兜底仍然可用
			try {
				eventsDisposer = ws.register({ kind: "exact", path: EVENTS_PATH, handler: eventsHandler });
			} catch (error) {
				eventsDisposer = null;
			}
			// 事件路由一就位就起变更检测(注册失败则不起,免得白跑)
			if (eventsDisposer && changeTimer === null) {
				changeTimer = setInterval(tick, CHANGE_TICK_MS);
			}
			return true;
		};
		if (registerNow()) {
			// 正常路径也要把路由 disposer 交回去:否则插件重载/二次 apply 时
			// 宿主对重复 path 抛 duplicate exact route,激活直接失败。
			return () => {
				if (routeDisposer) {
					try { routeDisposer(); } catch (error) { /* ignore */ }
				}
				if (eventsDisposer) {
					try { eventsDisposer(); } catch (error) { /* ignore */ }
				}
				if (changeTimer !== null) { clearInterval(changeTimer); changeTimer = null; }
				// 长连接必须显式关掉:路由注销不会替我们结束已经挂上的响应
				sseCloseAll();
			};
		}
		timer = setInterval(() => {
			attempts++;
			if (registerNow() || attempts >= 20) clearInterval(timer);
		}, 500);
```

</details>

**依据 5 · 源码核查**：[lib/client.js:2965-2983](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/client.js#L2965-L2983)

跨插件 CSS 协作边界。

<details>
<summary>查看原文（19行）</summary>

```text
			/**
			 * 行根节点的**公开标记**:第三方样式表按它放行这条线(issue #141)。
			 *
			 * 为什么需要:接管 0.2.0 的运行行时,这条线是 append 进宿主的
			 * `runningContent` —— 与「运行中」那一行同父母,所以别人写「除我之外全隐藏」
			 * 的规则(dsh-claude-style 0.13.2 就是:
			 * `[data-chat-running][data-dsh-claude-wait] > span >
			 *  :not([aria-hidden="true"]):not(.dsh-claude-chat-wait){display:none}`)
			 * 会连它一起 `display:none`。插件照旧轮换、读时长、推 SSE,**只是看不见**。
			 *
			 * 注意这不是自愈机制:别人的选择器不写 `:not(...)` 时,加属性不改变级联结果
			 * (scripts/issue-141-coexist-test.html 的 whitelist 场景量的就是这件事)。
			 * 它的作用是给消费方一个**稳定的白名单口** —— 以前唯一的白名单口是
			 * `aria-hidden="true"`,但一条可见的文字行打上它会丢读屏,不适合当公开契约。
			 * 消费方写法(二选一,值恒为 "";`.dsh-status-rotator-line` 就是下面的
			 * LINE_CLASS,它同时充当公开别名,不再另立新类名):
			 *   [data-chat-running] > span > :not([data-dsh-status-rotator-line]) { … }
			 *   [data-chat-running] > span > :not(.dsh-status-rotator-line) { … }
			 * 反向亦然:要让位给这条线时,可以直接选中这两个标记。
```

</details>

#### 缺口

- 未测性能、电耗或远端内容变化。
  **影响：**使用成本依设备和页面数不同。
  **进一步探讨：**低端设备/多标签页测 CPU 与网络。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何分阶段试用并验证可访问性？

**研究主题：**新假设与验证、采用判断

#### 完整回答

可先在测试 profile 启用静态短语，关远端自动更新和弹幕/鲸尾，核三代宿主的状态文本、时钟与读屏公告；再开启 ETag/SSE、设置页双标签冲突测试；最后按性能预算逐项启用动画。把可访问性状态文本与装饰动画分离是现有设计方向；进一步减少浏览器 DOM 结构耦合需宿主公开稳定槽位，属于未实现假设。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:84-94](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/README.md#L84-L94)

安装与默认外观。

<details>
<summary>查看原文（11行）</summary>

````text
### Quick start

For Web, run:

```bash
dsh plugin --profile web add dsh-status-rotator
```

Restart `dsh web`, then open **Settings → Status Texts** and start a turn. For Desktop, use the npm walkthrough above or its command-line alternative. Later settings changes save and apply automatically; restart the corresponding host after upgrading plugin code.

The whale tail and tail motion start off; enable them under **Appearance → Whale tail**. Danmaku starts on and can be disabled under **Appearance → Danmaku**.
````

</details>

**依据 2 · 源码核查**：[lib/client.js:1062-1080](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/client.js#L1062-L1080)

回退规则。

<details>
<summary>查看原文（19行）</summary>

```text
		/**
		 * 状态行这一次该显示什么(纯函数,供 smoke test 覆盖):
		 *   "phrases" → 从短语库里抽一句轮换;
		 *   "host"    → 显示宿主原文(「Deep diving…」/「深度求索中」),不走打字机;
		 *   "keep"    → 什么都不做,保持现状。
		 *
		 * 两条回落规则:
		 *   1. `labelSource: "host"` = 用户要「纯 0.1.6 观感」:插件自己那条线(0.1.7
		 *      的 LINE_CLASS)写宿主原文;旧宿主(≤0.1.6)的 TurnStatus 本来就写着宿主
		 *      原文,插件不该去改写它 → keep。
		 *   2. 短语库为空(没 config.json / 没文案)时,插件自己那条线**回落宿主原文**
		 *      —— 这就是「状态行变成一条空行、deep diving 不见了」的修复;旧宿主同理
		 *      保持 keep(它自己那句就是原文,不碰最忠实)。
		 */
		function labelPlanFor(source, hasPhrases, ownLine) {
			if (source === "host") return ownLine ? "host" : "keep";
			if (hasPhrases) return "phrases";
			return ownLine ? "host" : "keep";
		}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:2989-3005](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/client.js#L2989-L3005)

运行行结构与读屏注释。

<details>
<summary>查看原文（17行）</summary>

```text
			/**
			 * dsh 0.2.0 起,「运行中」不再是折叠头按钮里的一段文本,而是会话流里独立的一行:
			 *   div[data-chat-running]
			 *     ├─ span(visuallyHidden, role=status, aria-live=polite)  ← 读屏公告,别动
			 *     ├─ span(class*=runningDivider)
			 *     └─ span(class*=runningContent)
			 *          ├─ span(class*=runningIcon)   ← **鲸鱼尾巴**(svg,stroke=currentColor)
			 *          └─ span(class*=runningText)   ← shimmer 文案("Deep diving for 12s")
			 * 折叠头按钮(button[data-turn-process])在 0.2.0 只在**回合结束后**才渲染(收起态摘要),
			 * 所以运行期间插件必须认得这一行,否则整条状态行都不会被接管(0.2.0 兼容的核心)。
			 */
			const RUNNING_ROW_SELECTOR = "[data-chat-running]";
			const RUNNING_TEXT_SELECTOR = '[class*="runningText"]';
			const RUNNING_ICON_SELECTOR = '[class*="runningIcon"]';
			/** 插件给宿主鲸鱼尾巴加的类:样式表据此给它上炫彩流光 */
			const TAIL_CLASS = "dsh-status-rotator-whale-tail";
			const TAIL_WAG_CLASS = "dsh-status-rotator-whale-wag";
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1785-1799](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/index.js#L1785-L1799)

并发写条件。

<details>
<summary>查看原文（15行）</summary>

```text
	// ── If-Match 前提校验(必须在任何写入之前) ──
	// 语义按标准 HTTP:前提是**客户端自愿**的。
	//   缺省 / `*` → 无条件写(后写覆盖)。这是既有写入方(手写脚本、老设置页)一直以来的行为,
	//                 不做静默变更 —— 它们照样能用,只是拿不到并发保护;
	//   带了且不匹配 → 409:两端基于同一份旧配置先后写入时,后到的这次被明确拒绝。
	// 本插件的设置页**始终**带 If-Match,所以「两个标签页互相覆盖」那条路已经堵上。
	const ifMatch = String(req.headers["if-match"] || "").trim();
	if (ifMatch.length > 0 && ifMatch !== "*") {
		const current = await currentConfigEtag(getSettingsApi);
		if (ifMatch !== current) {
			res.writeHead(409, { "content-type": "application/json; charset=utf-8", [ETAG_HEADER]: current || "" });
			res.end(JSON.stringify({ ok: false, code: "conflict", etag: current, error: "配置在别处已经变更,这次写入已拒绝 —— 重读后再保存" }));
			return;
		}
	}
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
