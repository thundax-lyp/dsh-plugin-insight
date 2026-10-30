# MiMoTTS

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c8105ac](https://github.com/1497105876/dsh-mimotts/tree/c8105acbd3407ea45162a32aed4233e41bfe49a7)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：在DSH里朗读定稿回复并回放多版本；需辨识内容删略、实际播放与历史恢复边界。

> **亮点**：工程贡献在把定稿消息、外部语音和版本回放接入宿主实际席位/凭据/播放器生命周期；音质与模型由服务商提供，不能从按钮/音频数推断任务改善，见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：历史原文/voice标签缺实际覆盖/样本证明，关闭等待浮层不取消而仍可能尝试autoplay，索引直接写及删除吞错限制恢复；manifest新版与requestRejection旧方法契约另待核。这些是源码条件，不冒称真实丢失/匿名访问，见[Q03](#research-q03)。

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
  - [Q01 · 相对系统朗读，真正交付的是什么，哪个版本能用？](#detail-section-11)
  - [Q02 · 真实消息如何成为历史版本并被播放？](#detail-section-12)
  - [Q03 · 省略、关闭、历史与权限分别有哪些边界？](#detail-section-13)
  - [Q04 · 实际启用、日常与退出各需要什么投入？](#detail-section-14)
  - [Q05 · 哪些已经存在，下一步值得验证什么？](#detail-section-15)
  - [Q06 · 当前应如何决策，什么结果才允许升级试用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常听取/复听DSH自然语言答复、需要消息内控制与版本回找的用户；合格结果是正确理解并能回原文/停止，具体条件见[Q01](#research-q01)。

系统朗读通常少端点/样本/归档配置，复制到外部TTS则独立管理音频；是否值得留在消息内，要以理解正确率、回找/重做时间与合格任务总费同题比较，见[Q04](#research-q04)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 外部TTS | 将定稿文字/可选样本换音频 | 原文/样本外发；代码/图像省略、长文截前缀，非模型原创 |
| 内联播放 | 暂停/seek/复听已有blob | 解码/播放许可另验；关闭等待浮层非取消，上游无断连传播 |
| 历史与重合成 | 按原文多版本回放/删除 | 非事务索引；不记录实际覆盖/样本指纹，删除成功非擦除证明 |
| 配置/试听 | 宿主凭据引用与样例试听 | 浏览器配置输入会传key；试听仅草稿style/voice，Host方法兼容未验 |

**流程与依赖**

先核声明宿主中的Connection/configForms/credentials/Chat席位与浏览器解码，再核可用端点/key/样本和真实存储目录；详细条件与缺失后果仅列于[Q04](#research-q04)依赖表。

完整流程把准入、已保存配置、真实短文听取和可恢复历史作为不同检查点；退出需核请求/凭据/本地残留，不能以关闭面板当停止付费，步骤见[Q04](#research-q04)。

**效果与成本**

主要可变负担包括重复合成、版本增长与校对/恢复人工；默认字符数或等待时间不等账单/存储上限。四阶段成本与未知项统一见[Q04](#research-q04)，没有金额估算。

消息内少切换是可见集成优势，完整听懂仍缺覆盖与播放证据；若必须逐段返工，便利可能不足以抵消额外端点/归档负担。效果逐项边界见[Q04](#research-q04)，不以供应商声学表现归插件。

> **思考**：历史原文/voice标签缺实际覆盖/样本证明，关闭等待浮层不取消而仍可能尝试autoplay，索引直接写及删除吞错限制恢复；manifest新版与requestRejection旧方法契约另待核。这些是源码条件，不冒称真实丢失/匿名访问，见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：工程贡献在把定稿消息、外部语音和版本回放接入宿主实际席位/凭据/播放器生命周期；音质与模型由服务商提供，不能从按钮/音频数推断任务改善，见[Q01](#research-q01)、[Q02](#research-q02)。

可迁移的是normalize/tts/wav职责分离、稳定错误码、宿主凭据与浏览器界面分层、播放器监听/URL清理；不可照搬的假设是PCM参数、Host方法/作用域与索引可靠性。工程统计仅所列扩展/启发式范围，src/编译副本可能重复，不是独立原创量或完整发布包大小。

<a id="detail-section-5"></a>

### 1.4 主要限制

历史原文/voice标签缺实际覆盖/样本证明，关闭等待浮层不取消而仍可能尝试autoplay，索引直接写及删除吞错限制恢复；manifest新版与requestRejection旧方法契约另待核。这些是源码条件，不冒称真实丢失/匿名访问，见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，先验证当前Host方法/拒绝和一条非敏感短文真实播放/暂停/历史，再决定有限试用；技术/敏感内容继续回原文。停止和恢复阈值详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定built核心链及反例可核；当前Host方法、合成/播放/理解与并发恢复未验，采用观察；覆盖回执仍为假设。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、lib/client.js、lib/node/index.js、lib/node/normalize.js、lib/node/profile-dir.js、lib/node/recordings.js、lib/node/settings.js、lib/node/tts.js、lib/node/wav.js、package.json、tests/recordings.test.mjs、tests/tts.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核当前manifest/patch/README及main=lib/node/index.js实际import链和lib/client.js factory；逐项追真实SpeakAction→recordings、credential-ref、normalize/clamp、样本/网络/音频解析、WAV/index及resynth/delete/file成员检查、profile实际caller、Audio暂停/seek/autoplay/卸载和已有配置/历史。src与两份测试只作阅读对照；未全审所有构建器/样式/sourceMap或Host源码，未执行任何目标/单测/桩/安装/付费API/播放。
- 下一步：本轮四摘要/HEAD/固定原文与问题绑定均复核；只读tests/tts.test.mjs、tests/recordings.test.mjs的已有测试文本，未运行。README旧版类型/19单测/桩/协议探测属于作者报告，未当本轮结果；当前方法契约/关闭等待播放/并发与坏索引、实际理解/费用按[Q06](#research-q06)独立验收。

**分析版本**

- **仓库**：[1497105876/dsh-mimotts](https://github.com/1497105876/dsh-mimotts)
- **版本号**：2.1.1001（[固定提交 c8105ac](https://github.com/1497105876/dsh-mimotts/tree/c8105acbd3407ea45162a32aed4233e41bfe49a7)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

覆盖/配置与样本标识随音频版本回执是未验证候选；先修契约/取消/索引问题，再与已有播放器+简单警告/系统朗读比较，不重新发明现有历史/试听，证伪条件见[Q05](#research-q05)。

本轮四摘要/HEAD/固定原文与问题绑定均复核；只读tests/tts.test.mjs、tests/recordings.test.mjs的已有测试文本，未运行。README旧版类型/19单测/桩/协议探测属于作者报告，未当本轮结果；当前方法契约/关闭等待播放/并发与坏索引、实际理解/费用按[Q06](#research-q06)独立验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 24 | 3919 | 2954 | 1004 | — |
| .md | source | 1 | 145 | — | — | 2426 |
| .mjs | source | 3 | 276 | 190 | 61 | — |
| .ts | source | 17 | 2410 | 1581 | 674 | — |
| .tsx | source | 6 | 722 | 564 | 121 | — |
| .mjs | test | 5 | 326 | 288 | 14 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/1497105876/dsh-mimotts/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：MiMoTTS从定稿答复到外部合成、实际播放与版本历史是否形成可正确理解、可停止/回找的交付；当前宿主契约与内容/费用/恢复边界如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对系统朗读，真正交付的是什么，哪个版本能用？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

根组件是@gw/dsh-mimotts2.1.1001、MIT的DSH插件：ESM main=lib/node/index.js，Web factory=lib/client.js，patch插入mimotts。它把已定稿助手回复的文字读取、外部MiMo合成、内联播放/进度控制及按原文分组的多版本历史连在一起，不是语音模型、麦克风输入或独立Agent。验收单位是用户听清正确内容并能回找、知道遗漏和停止，而非HTTP200或WAV头。

适合经常听取/复听DSH自然语言答复且愿意使用外部TTS的人。比复制到独立TTS减少换应用、保存和回找动作；比系统朗读多特定服务音色/克隆与持久版本，但系统朗读可能更省配置和外发成本。声学能力、宿主Chat/slots/credentials和浏览器Audio均是继承能力，不能算本插件原创；无理解任务或听感对照，不能称已改善无障碍或效率。

根manifest声明DSH>=0.2.1-rc.2 <0.3.0、compatible0.2.1-rc.2、Node>=22.19.0；README标题/适配说明/验证记录仍指0.2.0-rc.2。真正built直接调用connection.requestRejection，未做admit/方法存在性兼容；本轮没有当前Host保留该方法的可核契约，既不承诺新版可用，也不武断断言已坏。Host路由只在webServer+connection注入成立时注册；前端需要configForms/remote.credentials等服务。发行声明、作者过去测试和当前安装/鉴权验收分别看待。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-38](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/package.json#L1-L38)

根身份和真正双入口、发布文件及构建脚本。

<details>
<summary>查看原文（38行）</summary>

```text
{
  "name": "@gw/dsh-mimotts",
  "version": "2.1.1001",
  "description": "MiMo TTS speech synthesis for DeepSeek Harness: a configuration card on the Plugins page, a speak button under every finalized assistant message, and an inline player with a draggable progress bar",
  "icon": "./icon.svg",
  "type": "module",
  "main": "./lib/node/index.js",
  "types": "./lib/node/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/node/index.d.ts",
      "default": "./lib/node/index.js"
    },
    "./client": {
      "types": "./lib/node/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./locale/*.json": "./locale/*.json",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/node",
    "lib/client.js",
    "lib/client.js.map",
    "cordis.patch.yml",
    "locale",
    "icon.svg"
  ],
  "scripts": {
    "build": "tsc -p tsconfig.json && tsdown",
    "test": "node --test tests/*.test.mjs"
  },
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
```

</details>

**依据 2 · 作者声明**：[package.json:52-85](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/package.json#L52-L85)

manifest/engine/peer当前0.2.1声明。

<details>
<summary>查看原文（34行）</summary>

```text
      ]
    },
    "compatibility": {
      "dshReleases": {
        "0.2.1-rc.2": "compatible"
      }
    }
  },
  "engines": {
    "dsh": ">=0.2.1-rc.2 <0.3.0",
    "node": ">=22.19.0"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "~3.18.4"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-scope": "0.2.1-rc.2",
    "@deepseek-ai/dsh-credentials": "0.2.1-rc.2"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-api-remotes": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-connection": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-locale": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-store": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-chat": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-conversation": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-plugin-manager": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-primitives": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-renderer": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-session": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-settings": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.1-rc.2",
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:18-20](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/cordis.patch.yml#L18-L20)

真实mimotts插入。

```text
- insert:
    - id: mimotts
      name: '@gw/dsh-mimotts'
```

**依据 4 · 源码核查**：[lib/client.js:1521-1584](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/client.js#L1521-L1584)

实际factory服务依赖、配置卡/历史/消息动作注册。

<details>
<summary>查看原文（64行）</summary>

```text
		// src/client/index.ts
		/** Required services (cordis fiber inject); remote.credentials stores the API key. */
		const inject = [
			"slots",
			"locale",
			"configForms",
			"remote",
			"remote.credentials"
		];
		/**
		* Mount the speak entries, the Plugins-page configuration card, and the
		* speech-history settings page.
		* @param ctx - the browser plugin context.
		*/
		function apply(ctx) {
			ctx.effect(() => injectStyles(), "dsh-mimotts: styles");
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh-mimotts: dictionaries");
			const t = ctx.locale.bind(NS);
			const controller = new TtsSettingsController(ctx.configForms.get(MIMOTTS_NAMESPACE), async (ref, value) => (await ctx.remote.credentials.set(ref, value)).ok);
			ctx.effect(() => () => {
				controller.dispose();
			}, "dsh-mimotts: settings form");
			ctx.effect(() => ctx.configForms.whileServed([MIMOTTS_NAMESPACE], () => {
				const offCard = ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register({
					name: "plugins.bundle.config",
					key: MIMOTTS_PACKAGE_KEY,
					locale: NS,
					inject: () => controller.inject()
				}, BundleConfigCard));
				const offPage = ctx.slots.inject("settings.section", () => ctx.slots.register({
					name: "settings.section",
					id: "mimotts",
					order: 20,
					label: () => t("nav"),
					locale: NS
				}, RecordingsPage));
				return () => {
					offPage();
					offCard();
				};
			}), "dsh-mimotts: plugins-page card and history page");
			ctx.slots.inject("conversation.chat.assistant-actions", () => ctx.slots.register({
				name: "conversation.chat.assistant-actions",
				id: "mimotts",
				order: 20,
				locale: NS,
				inject: () => ({
					hooks: { status: ttsStatusStore() },
					ensureStatus: () => {
						ensureTtsStatus();
					},
					synthesize: requestSpeech
				})
			}, SpeakAction));
		}
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

```

</details>

**依据 5 · 源码核查**：[lib/node/index.js:70-87](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/index.js#L70-L87)

路由注入与直接requestRejection；不能以注释替代当前Host契约。

<details>
<summary>查看原文（18行）</summary>

```text
export function apply(ctx, config) {
    // This plugin owns its settings page (the browser half's `settings.section`
    // entry), so it opts out of the automatic Plugins-page config card.
    ctx.inject(['settings'], (child) => {
        child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
    });
    ctx.inject(['webServer', 'connection'], (child) => {
        const fence = (req, res) => {
            // The configured Host/Origin fence plus browser authentication: an
            // unauthenticated LAN request must not spend the operator's API credits.
            const rejection = child.connection.requestRejection(req);
            if (rejection === undefined)
                return false;
            res.statusCode = rejection;
            res.end();
            return true;
        };
        const sendJson = (res, status, body) => {
```

</details>

**依据 6 · 作者声明**：[README.md:1-14](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/README.md#L1-L14)

作者旧版接口与安全声明。

<details>
<summary>查看原文（14行）</summary>

```text
# @gw/dsh-mimotts — MiMo TTS 语音合成插件（DeepSeek Harness 0.2.0-rc.2）

把助手回复"读出来"的 DSH 插件：**"插件"页里的配置卡片** + **每条已定稿助手回复动作行里的音量按钮** + **带可拖动进度条的内联播放器** + **设置页里的"语音历史"**。语音由小米 MiMo TTS（`mimo-v2.5-tts`）合成，API Key 只存在于宿主侧，浏览器只发送文本、收到 WAV。

面向 **deepseek-harness `0.2.0-rc.2`**（`engines.dsh: ">=0.2.0-rc.2 <0.3.0"`），完全按照官方插件规范实现：

| 官方规范条目 | 本插件的落点 |
|---|---|
| [打包与安装插件](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.0-rc.2/docs/user/develop/basic/publish.zh.md)（bundle 组合包） | `package.json` 声明 `dsh.bundle.patch` + `cordis.patch.yml` 插入 `id: mimotts` 行；同包携带 `dsh.client` 浏览器半侧（裸包名行同时挂载 Host/Client 两侧） |
| [插件配置](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.0-rc.2/docs/user/develop/basic/config.zh.md)（无硬编码可调参数） | 全部参数走 Schemastery Config + `.volatile()`（接口地址/模型/音色/克隆样本/风格/字数/超时均可配）；密钥 `role('secret')` |
| [即时配置表单](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.0-rc.2/docs/cookbook/adding-a-settings-card.zh.md) | `ctx.configForms`（`mimotts` 命名空间）+ `SettingsFormModel` 标准表单；`ctx.settings.configure({ auto: false })` 关闭自动页策略，配置卡片自己注册进官方 `plugins.bundle.config`（key = npm 包名） |
| [Web Client Slots](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.0-rc.2/docs/subsystems/slots.zh.md) | `plugins.bundle.config`（插件页配置卡）+ `conversation.chat.assistant-actions`（消息动作行）+ `settings.section`（语音历史页）三个席位，`ctx.slots.inject` 贡献、effect 生命周期托管；跨插件只 `import type` 取 slot 声明 |
| [Web Server 子系统](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.0-rc.2/docs/subsystems/web-server.zh.md) | `ctx.webServer.register` 挂 `/api/mimotts/status`、`/api/mimotts/synthesize` 两条路由，入口先过 `ctx.connection.requestRejection` 信任栅栏（Host/Origin + 浏览器鉴权），LAN 裸请求无法白嫖 API 额度 |
| [客户端模块系统](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.0-rc.2/packages/client/modules/README.zh.md) | `lib/client.js` 为 lazy-CJS factory（`window.__ModuleLoader__.load({ id, factory })`），外部仅平台模块（react / cordis / client-store / ui-primitives），跨插件只经 Cordis 服务与 `import type`（构建期 purity gate 强制） |
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 真实消息如何成为历史版本并被播放？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

实际lib/client.js的speakableTextFor按messageId查assistant-step/finalNode，只拼text块，优先visible候选，不读reasoning/工具块。SpeakAction检测configured后直接调用requestRecording({text})，不是只看slot注入的synthesize名称；后者POST /api/mimotts/recordings。Host先fence，再限制JSON体1MiB并校验非空text，resolveEngineSnapshot通过宿主credential-ref取key；浏览器配置输入确会经remote.credentials.set传入字面key，日常朗读接口不回传key，不能说浏览器从不接触密钥。

引擎把Markdown归一化、按默认2000个JS字符单位截前缀，风格加<style>，作为assistant message POST到配置baseUrl/chat/completions；默认MiMo模型/端点仅是源码默认，未核服务现状。预置voice与本地voiceSamplePath二选一，样本整体读入/base64后外发，未校验注释所称24k/16bit/单声道/5–15秒。请求设默认60秒AbortSignal.timeout；取choices[0].message.audio.data，非空base64解码，RIFF/WAVE开头直接返回，否则假定24kHz/16bit/mono PCM包44字节WAV。格式包装不等于音频有效或可理解。

recordings路由先成功合成再addVersion(原始request.text,style,voice,model,wav)，写UUID WAV再写单index.json，成功后回音频与身份header。前端读blob/createObjectURL，标记ready后尝试Audio.play，拖动/键盘可seek，模块内activeElement会暂停同插件其他内联播放器。play拒绝只改playing=false；既非播放完成回执，也非全系统音频互斥。再次点击已有source复用音频，无需再付费合成；历史页file GET有fence及hasVersion成员检查，resynth按当前配置另加版本、delete按版本删。设置试听走/synthesize，不进持久录音；试听只覆盖草稿style/voice，未保存的baseUrl/model/样本路径等仍用Host配置。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:215-231](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/client.js#L215-L231)

实际text块提取与message身份匹配。

<details>
<summary>查看原文（17行）</summary>

```text
		function speakableTextFor(snapshot, messageId) {
			const matches = [];
			for (const node of snapshot.nodes.values()) {
				if (node.kind !== "assistant-step") continue;
				const candidate = node;
				const data = candidate.data;
				const blocks = data.finalNode?.blocks ?? data.blocks;
				if (data.finalNode?.messageId !== messageId) continue;
				const text = blocks.filter((block) => block.kind === "text").map((block) => block.text).join("\n").trim();
				matches.push({
					anchorSeq: candidate.anchorSeq,
					visibility: candidate.visibility,
					text
				});
			}
			if (matches.length === 0) return void 0;
			return (matches.find((match) => match.visibility === "visible") ?? matches[0]).text;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:132-166](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/client.js#L132-L166)

真实朗读POST recordings与blob/身份header。

<details>
<summary>查看原文（35行）</summary>

```text
		*/
		async function requestRecording(request) {
			let response;
			try {
				response = await fetch(MIMOTTS_RECORDINGS_PATH, {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(request)
				});
			} catch (error) {
				throw new TtsClientError("generic", error instanceof Error ? error.message : String(error));
			}
			if (response.ok) {
				const blob = await response.blob();
				const header = response.headers.get(MIMOTTS_RECORDING_HEADER);
				let ref = {
					recId: "",
					verId: ""
				};
				if (header !== null) try {
					ref = JSON.parse(atob(header));
				} catch {}
				return {
					blob,
					ref
				};
			}
			let code = "generic";
			let message = `recording request failed with HTTP ${response.status}`;
			try {
				const body = await response.json();
				if (typeof body.error?.code === "string") code = body.error.code;
				if (typeof body.error?.message === "string") message = body.error.message;
			} catch {}
			throw new TtsClientError(code, message);
```

</details>

**依据 3 · 源码核查**：[lib/client.js:573-615](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/client.js#L573-L615)

SpeakAction真正caller及source复用。

<details>
<summary>查看原文（43行）</summary>

```text
				autoplay.current = false;
				toggle();
			}, [source, toggle]);
			const onClick = (0, react.useCallback)(() => {
				if (phase === "loading") return;
				if (source !== null) {
					if (!panelOpen) setPanelOpen(true);
					player.toggle();
					return;
				}
				if (text === void 0 || text === "") {
					setFailure("empty");
					return;
				}
				if (!status.configured) {
					setFailure("unconfigured");
					return;
				}
				setPhase("loading");
				setFailure(null);
				setPanelOpen(true);
				requestRecording({ text }).then(({ blob }) => {
					autoplay.current = true;
					setPhase("ready");
					setSource((previous) => {
						if (previous !== null) URL.revokeObjectURL(previous);
						return URL.createObjectURL(blob);
					});
				}).catch((error) => {
					setPhase("error");
					setFailure(error instanceof TtsClientError ? error : new TtsClientError("generic", String(error)));
				});
			}, [
				phase,
				player,
				source,
				status.configured,
				text
			]);
			const open = source !== null;
			const buttonLabel = phase === "loading" ? t("synthesize") : player.state.playing ? t("pause") : open ? t("play") : t("speak");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				ref: rootRef,
```

</details>

**依据 4 · 源码核查**：[lib/node/index.js:40-65](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/index.js#L40-L65)

凭据解析和配置快照。

<details>
<summary>查看原文（26行）</summary>

```text
async function resolveEngineSnapshot(ctx, config) {
    const credentials = ctx.get?.('credentials');
    const ref = (config.apiKeyEnv.get() ?? '').trim();
    let apiKey = '';
    if (credentials !== undefined && ref !== '') {
        try {
            const resolved = await credentials.resolve(credentialRef(ref));
            apiKey = (resolved?.value ?? '').trim();
        }
        catch {
            apiKey = '';
        }
    }
    return resolveEngineConfig({
        apiKey,
        baseUrl: config.baseUrl.get(),
        model: config.model.get(),
        voice: config.voice.get(),
        voiceSamplePath: config.voiceSamplePath.get(),
        style: config.style.get(),
        maxChars: config.maxChars.get(),
        timeoutMs: config.timeoutMs.get(),
    });
}
/**
 * Host registration: the settings presentation policy and the two Web routes.
```

</details>

**依据 5 · 源码核查**：[lib/node/tts.js:69-138](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/tts.js#L69-L138)

归一化/样本外发/负载/超时/解码的实际callee。

<details>
<summary>查看原文（70行）</summary>

```text
 * @throws {TtsError} when the request is unusable or the provider fails.
 */
export async function synthesizeSpeech(config, request, deps = nodeDeps) {
    if (config.apiKey === '') {
        throw new TtsError('not-configured', 'No MiMo API key is configured; add the credential in the credentials store and reference it in Settings → 语音合成.');
    }
    const speakable = clampText(toSpeakableText(request.text ?? ''), config.maxChars);
    if (speakable === '') {
        throw new TtsError('bad-request', 'The message carries no speakable text.');
    }
    const style = (request.style ?? '').trim() || config.style;
    const content = style === '' ? speakable : `<style>${style}</style>${speakable}`;
    const voice = (request.voice ?? '').trim() || config.voice;
    let audio;
    if (config.voiceSamplePath !== '') {
        let sample;
        try {
            sample = await deps.readVoiceSample(config.voiceSamplePath);
        }
        catch (cause) {
            throw new TtsError('voice-sample-unreadable', `The voice-clone sample at ${config.voiceSamplePath} could not be read.`, cause);
        }
        audio = {
            format: 'wav',
            voice_audio: { format: 'wav', data: Buffer.from(sample).toString('base64') },
        };
    }
    else {
        audio = { format: 'wav', voice };
    }
    const payload = {
        model: config.model,
        audio,
        messages: [{ role: 'assistant', content }],
    };
    const endpoint = `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;
    let response;
    try {
        response = await deps.fetch(endpoint, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'api-key': config.apiKey,
                'user-agent': 'dsh-mimotts/0.1.0',
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(config.timeoutMs),
        });
    }
    catch (cause) {
        const timedOut = cause instanceof Error && cause.name === 'TimeoutError';
        throw new TtsError(timedOut ? 'timeout' : 'upstream-error', timedOut
            ? `MiMo TTS did not answer within ${config.timeoutMs} ms.`
            : `MiMo TTS could not be reached: ${cause instanceof Error ? cause.message : String(cause)}`, cause);
    }
    if (!response.ok) {
        const detail = await response.text().catch(() => '');
        throw new TtsError('upstream-error', `MiMo TTS returned HTTP ${response.status}${detail === '' ? '' : `: ${detail.slice(0, 300)}`}`);
    }
    let body;
    try {
        body = await response.json();
    }
    catch (cause) {
        throw new TtsError('invalid-audio', 'MiMo TTS returned a response that is not JSON.', cause);
    }
    const data = decodeAudioData(body);
    if (isRiffWav(data))
        return data;
    return wrapPcmAsWav(data);
```

</details>

**依据 6 · 源码核查**：[lib/node/tts.js:139-165](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/tts.js#L139-L165)

实际音频字段/非空base64检查，不是完整格式或听取验证。

<details>
<summary>查看原文（27行）</summary>

```text
}
/**
 * Pull the base64 audio block out of the provider response.
 * @param body - parsed `chat.completion` response.
 * @returns decoded audio bytes (WAV or raw PCM).
 * @throws {TtsError} when the response carries an error or no audio block.
 */
function decodeAudioData(body) {
    const root = body;
    if (root === null || typeof root !== 'object') {
        throw new TtsError('invalid-audio', 'MiMo TTS returned an empty response.');
    }
    if (root.error !== undefined && root.error !== null) {
        const detail = typeof root.error === 'object' && 'message' in root.error
            ? String(root.error.message)
            : JSON.stringify(root.error);
        throw new TtsError('upstream-error', `MiMo TTS reported an error: ${detail.slice(0, 300)}`);
    }
    const encoded = root.choices?.[0]?.message?.audio?.data;
    if (typeof encoded !== 'string' || encoded === '') {
        throw new TtsError('invalid-audio', 'MiMo TTS returned no audio block in choices[0].message.audio.data.');
    }
    const data = new Uint8Array(Buffer.from(encoded, 'base64'));
    if (data.length === 0)
        throw new TtsError('invalid-audio', 'MiMo TTS returned an empty audio block.');
    return data;
}
```

</details>

**依据 7 · 源码核查**：[lib/node/wav.js:10-60](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/wav.js#L10-L60)

仅头检测与固定PCM假设包装。

<details>
<summary>查看原文（51行）</summary>

```text
export const PCM_SAMPLE_RATE = 24_000;
/** Bits per sample the MiMo TTS endpoint emits raw PCM at. */
export const PCM_BITS_PER_SAMPLE = 16;
/** Channel count the MiMo TTS endpoint emits raw PCM at. */
export const PCM_CHANNELS = 1;
/**
 * Test whether the bytes already carry a RIFF/WAVE container.
 * @param bytes - audio payload as decoded from the provider response.
 * @returns true when the payload starts with a `RIFF…WAVE` header.
 */
export function isRiffWav(bytes) {
    return bytes.length >= 12
        && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 // RIFF
        && bytes[8] === 0x57 && bytes[9] === 0x41 && bytes[10] === 0x56 && bytes[11] === 0x45; // WAVE
}
/**
 * Wrap raw PCM samples in a minimal canonical WAV container.
 *
 * The layout is the 44-byte `RIFF`/`fmt `/`data` header every browser audio
 * decoder seeks: no `fact` chunk, no extended format.
 * @param pcm - interleaved little-endian PCM samples.
 * @param sampleRate - samples per second per channel.
 * @param bitsPerSample - bits per sample.
 * @param channels - channel count.
 * @returns a complete WAV file.
 */
export function wrapPcmAsWav(pcm, sampleRate = PCM_SAMPLE_RATE, bitsPerSample = PCM_BITS_PER_SAMPLE, channels = PCM_CHANNELS) {
    const blockAlign = (channels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;
    const wav = new Uint8Array(44 + pcm.length);
    const view = new DataView(wav.buffer);
    const ascii = (offset, text) => {
        for (let index = 0; index < text.length; index += 1)
            wav[offset + index] = text.charCodeAt(index);
    };
    ascii(0, 'RIFF');
    view.setUint32(4, 36 + pcm.length, true);
    ascii(8, 'WAVE');
    ascii(12, 'fmt ');
    view.setUint32(16, 16, true); // PCM fmt chunk size
    view.setUint16(20, 1, true); // format: PCM
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    ascii(36, 'data');
    view.setUint32(40, pcm.length, true);
    wav.set(pcm, 44);
    return wav;
}
```

</details>

**依据 8 · 源码核查**：[lib/node/index.js:341-370](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/index.js#L341-L370)

实际1MiB流式JSON体读取上限与对象校验。

<details>
<summary>查看原文（30行）</summary>

```text
/** JSON body size limit; settings and one speak request are small. */
const MAX_BODY_BYTES = 1024 * 1024;
/**
 * Read one JSON object request body under the size limit.
 * @param req - inbound request.
 * @returns the parsed object, or undefined when the body is absent, oversized,
 * malformed, or not a JSON object.
 */
async function readJsonBody(req) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
        const buffer = chunk;
        size += buffer.length;
        if (size > MAX_BODY_BYTES)
            return undefined;
        chunks.push(buffer);
    }
    if (chunks.length === 0)
        return undefined;
    try {
        const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
            ? parsed
            : undefined;
    }
    catch {
        return undefined;
    }
}
```

</details>

**依据 9 · 源码核查**：[lib/node/index.js:189-229](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/index.js#L189-L229)

合成后存原文、WAV和header。

<details>
<summary>查看原文（41行）</summary>

```text
                }
                void (async () => {
                    const parsed = await readJsonBody(req);
                    if (parsed === undefined) {
                        sendError(res, 400, { error: { code: 'bad-request', message: 'Request body is not a JSON object.' } });
                        return;
                    }
                    const request = parsed;
                    if (typeof request.text !== 'string' || request.text.trim() === '') {
                        sendError(res, 400, { error: { code: 'bad-request', message: 'A non-empty `text` string is required.' } });
                        return;
                    }
                    const engine = await resolveEngineSnapshot(ctx, config);
                    try {
                        const wav = await synthesizeSpeech(engine, {
                            text: request.text,
                            style: typeof request.style === 'string' ? request.style : undefined,
                            voice: typeof request.voice === 'string' ? request.voice : undefined,
                        });
                        const style = (typeof request.style === 'string' ? request.style : '').trim() || engine.style;
                        const voice = (typeof request.voice === 'string' ? request.voice : '').trim() || engine.voice;
                        const { recording, version } = await addVersion(request.text, style || undefined, voice || undefined, engine.model, wav);
                        res.statusCode = 200;
                        res.setHeader('content-type', 'audio/wav');
                        res.setHeader('cache-control', 'no-store');
                        res.setHeader(MIMOTTS_RECORDING_HEADER, Buffer.from(JSON.stringify({ recId: recording.id, verId: version.id })).toString('base64'));
                        res.end(Buffer.from(wav));
                    }
                    catch (error) {
                        const failure = error instanceof TtsError
                            ? error
                            : new TtsError('upstream-error', error instanceof Error ? error.message : String(error));
                        const status = failure.code === 'not-configured' ? 503
                            : failure.code === 'bad-request' || failure.code === 'text-too-long' ? 400
                                : failure.code === 'timeout' ? 504
                                    : 502;
                        sendError(res, status, { error: { code: failure.code, message: failure.message } });
                    }
                })();
            },
        }), `dsh-mimotts: ${MIMOTTS_RECORDINGS_PATH}`);
```

</details>

**依据 10 · 源码核查**：[lib/node/recordings.js:86-111](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/recordings.js#L86-L111)

版本元数据、先WAV后索引。

<details>
<summary>查看原文（26行）</summary>

```text
 * @param style - style phrase used, or undefined for neutral.
 * @param voice - preset voice used, or undefined for default.
 * @param model - model id used.
 * @param wav - the WAV bytes to persist.
 * @returns the recording node and the new version.
 */
export async function addVersion(text, style, voice, model, wav) {
    await ensureDir();
    const index = await readIndex();
    const version = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        style: style ?? null,
        voice: voice ?? null,
        model,
    };
    let recording = index.entries.find(entry => entry.text === text);
    if (recording === undefined) {
        recording = { id: randomUUID(), text, createdAt: version.createdAt, versions: [] };
        index.entries.unshift(recording);
    }
    recording.versions.unshift(version);
    await writeFile(versionFilePath(recording.id, version.id), Buffer.from(wav));
    await writeIndex(index);
    return { recording, version };
}
```

</details>

**依据 11 · 源码核查**：[lib/client.js:400-497](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/client.js#L400-L497)

实际Audio生命周期、互斥/播放拒绝处理。

<details>
<summary>查看原文（98行）</summary>

```text
		function useAudioPlayer(source) {
			const [state, setState] = (0, react.useState)(IDLE);
			const elementRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				if (source === null) return;
				const audio = new Audio(source);
				elementRef.current = audio;
				const publish = (patch) => {
					setState((previous) => ({
						...previous,
						...patch
					}));
				};
				const onTime = () => {
					publish({ currentTime: audio.currentTime });
				};
				const onLoaded = () => {
					publish({ duration: Number.isFinite(audio.duration) ? audio.duration : 0 });
				};
				const onPlay = () => {
					activeElement = audio;
					publish({
						playing: true,
						ended: false
					});
				};
				const onPause = () => {
					if (activeElement === audio) activeElement = null;
					publish({ playing: false });
				};
				const onEnded = () => {
					if (activeElement === audio) activeElement = null;
					publish({
						playing: false,
						ended: true,
						currentTime: 0
					});
				};
				audio.addEventListener("timeupdate", onTime);
				audio.addEventListener("loadedmetadata", onLoaded);
				audio.addEventListener("durationchange", onLoaded);
				audio.addEventListener("play", onPlay);
				audio.addEventListener("pause", onPause);
				audio.addEventListener("ended", onEnded);
				setState({
					playing: false,
					currentTime: 0,
					duration: 0,
					ended: false
				});
				return () => {
					if (activeElement === audio) activeElement = null;
					audio.pause();
					audio.removeAttribute("src");
					audio.load();
					audio.removeEventListener("timeupdate", onTime);
					audio.removeEventListener("loadedmetadata", onLoaded);
					audio.removeEventListener("durationchange", onLoaded);
					audio.removeEventListener("play", onPlay);
					audio.removeEventListener("pause", onPause);
					audio.removeEventListener("ended", onEnded);
					elementRef.current = null;
				};
			}, [source]);
			return {
				state,
				toggle: (0, react.useCallback)(() => {
					const audio = elementRef.current;
					if (audio === null) return;
					if (audio.paused) {
						if (activeElement !== null && activeElement !== audio) activeElement.pause();
						if (audio.ended) audio.currentTime = 0;
						audio.play().catch(() => {
							setState((previous) => ({
								...previous,
								playing: false
							}));
						});
					} else audio.pause();
				}, []),
				seek: (0, react.useCallback)((seconds) => {
					const audio = elementRef.current;
					if (audio === null) return;
					const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
					const target = Math.max(0, duration > 0 ? Math.min(seconds, duration) : seconds);
					audio.currentTime = target;
					setState((previous) => ({
						...previous,
						currentTime: target,
						ended: false
					}));
				}, []),
				pause: (0, react.useCallback)(() => {
					const audio = elementRef.current;
					if (audio !== null) audio.pause();
				}, [])
			};
		}
```

</details>

**依据 12 · 源码核查**：[lib/client.js:741-768](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/client.js#L741-L768)

试听仅覆草稿style/voice。

<details>
<summary>查看原文（28行）</summary>

```text
				autoplay.current = false;
				toggle();
			}, [sampleUrl, toggle]);
			const audition = (0, react.useCallback)(() => {
				if (busy) return;
				setBusy(true);
				setFailure(null);
				synthesize({
					text: AUDITION_TEXT,
					style: state.style.text.trim() === "" ? void 0 : state.style.text,
					voice: state.voice.text.trim() === "" ? void 0 : state.voice.text
				}).then((blob) => {
					autoplay.current = true;
					setBusy(false);
					setSampleUrl((previous) => {
						if (previous !== null) URL.revokeObjectURL(previous);
						return URL.createObjectURL(blob);
					});
				}).catch((error) => {
					setBusy(false);
					setFailure(error instanceof TtsClientError ? error : new TtsClientError("generic", String(error)));
				});
			}, [
				busy,
				state.style.text,
				state.voice.text,
				synthesize
			]);
```

</details>

**依据 13 · 源码核查**：[lib/client.js:1540-1543](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/client.js#L1540-L1543)

配置输入经宿主credentials.set写入，非浏览器完全不触密钥。

```text
			}), "dsh-mimotts: dictionaries");
			const t = ctx.locale.bind(NS);
			const controller = new TtsSettingsController(ctx.configForms.get(MIMOTTS_NAMESPACE), async (ref, value) => (await ctx.remote.credentials.set(ref, value)).ok);
			ctx.effect(() => () => {
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 省略、关闭、历史与权限分别有哪些边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最核心反证是“原文有历史版本”不等于朗读全部内容。normalize用“代码略”替代围栏代码，删除图片/链接目标、把表格格子逗号串联，再clampText按预算找句界或硬截前缀；history只存原文及style/voice/model/时间，不存实际speakable、截断位置、maxChars或克隆样本身份。克隆分支发voice_audio却仍把预置voice记录进版本，因此该标签也不是所用样本证明。README称长文动作旁有提示，但当前SpeakAction只在失败时显示warning，成功并无覆盖差异回执；已有原文回看不是省略清单。

关闭播放浮层只setPanelOpen(false)+player.pause；loading时请求没有AbortSignal/取消按钮，成功回调仍设置autoplay并在source变化后toggle，因此关闭等待浮层后仍会尝试自动播放（浏览器可能拒绝），不能当取消。Host也没有把请求关闭/插件卸载连到上游signal。60秒限制针对外部fetch信号，不覆盖先读样本、文件持久化或证明服务端停止计费；响应丢失/落盘失败后再点可能新增付费合成。play().catch没有把解码失败提升为TTS错误，ready/0秒不等于音频有效。

历史不是事务归档：有效索引读入后read-modify-write无跨请求锁/CAS/原子替换，两个重叠请求可覆盖另一索引变更、留下孤儿WAV；坏读回的是共享EMPTY_INDEX而非磁盘恢复/备份，初始缺文件写入可原地修改该对象，不能承诺总回全新空表。delete吞掉unlink错误后仍改索引，UI成功不证明文件擦除；无自动保留上限。历史列表首次加载失败时index仍null，组件先返回空提示，error尚未显示，空界面亦非磁盘为空。上述是具体分支/并发风险，未注入故障复现。

store按识别到的存在profile目录定位并缓存；实际调用profileScopedDefault未传moduleUrl，安装路径探测分支不会由该caller启用，未识别时回~/.dsh/mimotts-recordings而非自定义DSH_HOME。索引按文本无会话/agent/用户owner，不能把profile当多用户隔离。路由确有requestRejection和file的hasVersion成员核查，不能把query参数说成任意路径读取；但实际Host认证/权限契约未核，不继承README“LAN无法白嫖”的验收结论。

#### 证据与依据

**依据 1 · 源码核查**：[lib/node/normalize.js:10-50](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/normalize.js#L10-L50)

代码/图片/表格变换，非无损朗读。

<details>
<summary>查看原文（41行）</summary>

````text
/** Replacement spoken for a fenced code block (reading code aloud is noise). */
const CODE_FENCE_NOTE = '代码略。';
/**
 * Convert assistant Markdown into text worth speaking aloud.
 *
 * Removes fenced code (kept as a short spoken note), inline-code markers,
 * heading/list/quote markers, emphasis markers, tables (cells joined with
 * commas), images, HTML tags, and link targets (the anchor text stays).
 * @param markdown - raw assistant reply text.
 * @returns plain text suitable for TTS input.
 */
export function toSpeakableText(markdown) {
    let text = markdown;
    // Fenced code: one spoken note per block, whatever its language.
    text = text.replace(/```[\s\S]*?```/g, `\n${CODE_FENCE_NOTE}\n`);
    text = text.replace(/~~~[\s\S]*?~~~/g, `\n${CODE_FENCE_NOTE}\n`);
    // Inline code keeps its content, loses its ticks.
    text = text.replace(/`([^`\n]*)`/g, '$1');
    // Images: drop entirely (alt text is rarely speakable).
    text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
    // Links keep the anchor text; the URL is never spoken.
    text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
    text = text.replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1');
    // Reference definitions and HTML tags.
    text = text.replace(/^\[[^\]]*\]:\s+\S+.*$/gmu, '');
    text = text.replace(/<\/?[a-zA-Z][^>\n]*>/g, '');
    // Headings, bullets, quotes, and horizontal rules.
    text = text.replace(/^#{1,6}\s+/gmu, '');
    text = text.replace(/^\s*(?:[-*+]|\d+[.)])\s+/gmu, '');
    text = text.replace(/^\s*>\s?/gmu, '');
    text = text.replace(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gmu, '\n');
    // Tables: keep cell text in reading order, drop alignment and cell markup.
    text = text.replace(/^\|?[\s:|-]+\|[\s:|-]*$/gmu, '');
    text = text.replace(/\s*\|\s*/g, '，');
    // Emphasis and strikethrough markers only; the words stay.
    text = text.replace(/(\*\*|__|~~)/g, '');
    text = text.replace(/(?<!\w)\*([^*\n]+)\*(?!\w)/g, '$1');
    text = text.replace(/(?<!\w)_([^_\n]+)_(?!\w)/g, '$1');
    // Escaped punctuation keeps the punctuation.
    text = text.replace(/\\([\\`*_{}[\]()#+\-.!])/g, '$1');
    // Whitespace: collapse runs, trim each line, drop empty lines.
````

</details>

**依据 2 · 源码核查**：[lib/node/normalize.js:65-71](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/normalize.js#L65-L71)

预算前缀截断。

```text
export function clampText(text, maxChars) {
    if (text.length <= maxChars)
        return text;
    const prefix = text.slice(0, maxChars);
    const boundary = Math.max(prefix.lastIndexOf('。'), prefix.lastIndexOf('！'), prefix.lastIndexOf('？'), prefix.lastIndexOf('!'), prefix.lastIndexOf('?'), prefix.lastIndexOf('.'));
    return boundary > maxChars / 2 ? prefix.slice(0, boundary + 1) : prefix;
}
```

**依据 3 · 源码核查**：[lib/node/tts.js:76-101](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/tts.js#L76-L101)

克隆样本替代voice，实际合成无覆盖元数据回传。

<details>
<summary>查看原文（26行）</summary>

```text
    if (speakable === '') {
        throw new TtsError('bad-request', 'The message carries no speakable text.');
    }
    const style = (request.style ?? '').trim() || config.style;
    const content = style === '' ? speakable : `<style>${style}</style>${speakable}`;
    const voice = (request.voice ?? '').trim() || config.voice;
    let audio;
    if (config.voiceSamplePath !== '') {
        let sample;
        try {
            sample = await deps.readVoiceSample(config.voiceSamplePath);
        }
        catch (cause) {
            throw new TtsError('voice-sample-unreadable', `The voice-clone sample at ${config.voiceSamplePath} could not be read.`, cause);
        }
        audio = {
            format: 'wav',
            voice_audio: { format: 'wav', data: Buffer.from(sample).toString('base64') },
        };
    }
    else {
        audio = { format: 'wav', voice };
    }
    const payload = {
        model: config.model,
        audio,
```

</details>

**依据 4 · 源码核查**：[lib/node/recordings.js:20-72](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/recordings.js#L20-L72)

caller未传moduleUrl、缓存路径/共享EMPTY_INDEX/直接索引写。

<details>
<summary>查看原文（53行）</summary>

```text
import { profileScopedDefault } from './profile-dir.js';
/** The legacy home-level store, used when no DSH profile is active. */
const LEGACY_RECORDINGS_DIR = join(homedir(), '.dsh', 'mimotts-recordings');
// Resolved lazily on first use and cached: the profile signals (env, argv,
// install location) only settle once the harness process is up, and the store
// must stay in one place for the process lifetime.
let cachedDir;
function recordingsDir() {
    if (cachedDir === undefined) {
        cachedDir = profileScopedDefault('mimotts-recordings') ?? LEGACY_RECORDINGS_DIR;
    }
    return cachedDir;
}
/** The single index file mapping texts to their version trees. */
function indexFile() {
    return join(recordingsDir(), 'index.json');
}
/** A recordings store with no entries yet. */
const EMPTY_INDEX = { entries: [] };
// `mkdir` is idempotent but we still memoize the in-flight promise so
// concurrent first writes don't race the directory creation.
let ensurePromise;
function ensureDir() {
    if (ensurePromise === undefined) {
        ensurePromise = mkdir(recordingsDir(), { recursive: true })
            .then(() => undefined)
            .catch((error) => {
            ensurePromise = undefined;
            throw error;
        });
    }
    return ensurePromise;
}
/**
 * Read the index, tolerating a missing or corrupt file.
 * @returns the parsed index, or an empty one when unreadable.
 */
async function readIndex() {
    try {
        const raw = await readFile(indexFile(), 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed.entries) ? parsed : EMPTY_INDEX;
    }
    catch {
        return EMPTY_INDEX;
    }
}
/** Persist the index, creating the directory first. */
async function writeIndex(index) {
    await ensureDir();
    await writeFile(indexFile(), JSON.stringify(index), 'utf8');
}
/** The on-disk file name for one version; ids are uuids, so no path tricks. */
```

</details>

**依据 5 · 源码核查**：[lib/node/recordings.js:86-111](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/recordings.js#L86-L111)

原文+版本字段与非事务写顺序。

<details>
<summary>查看原文（26行）</summary>

```text
 * @param style - style phrase used, or undefined for neutral.
 * @param voice - preset voice used, or undefined for default.
 * @param model - model id used.
 * @param wav - the WAV bytes to persist.
 * @returns the recording node and the new version.
 */
export async function addVersion(text, style, voice, model, wav) {
    await ensureDir();
    const index = await readIndex();
    const version = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        style: style ?? null,
        voice: voice ?? null,
        model,
    };
    let recording = index.entries.find(entry => entry.text === text);
    if (recording === undefined) {
        recording = { id: randomUUID(), text, createdAt: version.createdAt, versions: [] };
        index.entries.unshift(recording);
    }
    recording.versions.unshift(version);
    await writeFile(versionFilePath(recording.id, version.id), Buffer.from(wav));
    await writeIndex(index);
    return { recording, version };
}
```

</details>

**依据 6 · 源码核查**：[lib/node/recordings.js:120-170](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/recordings.js#L120-L170)

重合成/删除吞unlink错误/成员核查。

<details>
<summary>查看原文（51行）</summary>

```text
 * @param recId - the recording node id.
 * @param style - style phrase used, or undefined for neutral.
 * @param voice - preset voice used, or undefined for default.
 * @param model - model id used.
 * @param wav - the freshly synthesized WAV bytes.
 * @returns the recording and new version, or undefined when `recId` is unknown.
 */
export async function resynthesize(recId, style, voice, model, wav) {
    await ensureDir();
    const index = await readIndex();
    const recording = index.entries.find(entry => entry.id === recId);
    if (recording === undefined)
        return undefined;
    const version = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        style: style ?? null,
        voice: voice ?? null,
        model,
    };
    recording.versions.unshift(version);
    await writeFile(versionFilePath(recording.id, version.id), Buffer.from(wav));
    await writeIndex(index);
    return { recording, version };
}
/**
 * Delete one version's file and index entry. When a recording loses its last
 * version it is removed entirely.
 * @returns true when the version existed and was removed.
 */
export async function deleteVersion(recId, verId) {
    const index = await readIndex();
    const recording = index.entries.find(entry => entry.id === recId);
    if (recording === undefined)
        return false;
    const at = recording.versions.findIndex(version => version.id === verId);
    if (at === -1)
        return false;
    recording.versions.splice(at, 1);
    await unlink(versionFilePath(recId, verId)).catch(() => { });
    if (recording.versions.length === 0) {
        index.entries = index.entries.filter(entry => entry.id !== recId);
    }
    await writeIndex(index);
    return true;
}
/** Whether a recording/version pair exists (used to authorize file serving). */
export async function hasVersion(recId, verId) {
    const index = await readIndex();
    const recording = index.entries.find(entry => entry.id === recId);
    return recording !== undefined && recording.versions.some(version => version.id === verId);
```

</details>

**依据 7 · 源码核查**：[lib/node/profile-dir.js:51-85](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/profile-dir.js#L51-L85)

有效profile探测的env/argv/moduleUrl条件和DSH_HOME。

<details>
<summary>查看原文（35行）</summary>

```text
    catch { }
    return '';
}
/**
 * The active profile name, or `''` when the process was not booted under a
 * named profile (legacy global home).
 */
export function detectProfileName(options = {}) {
    const base = String(process.env.DSH_HOME ?? '').trim() || join(os.homedir(), '.dsh');
    const profilesDir = join(base, 'profiles');
    const valid = (name) => {
        const n = sanitizeProfileName(name);
        return n && fs.existsSync(join(profilesDir, n)) ? n : '';
    };
    const fromEnv = valid(process.env.DSH_PROFILE);
    if (fromEnv)
        return fromEnv;
    const fromArgv = valid(profileNameFromArgv(process.argv.slice(2)));
    if (fromArgv)
        return fromArgv;
    if (options.moduleUrl)
        return valid(profileNameFromModuleUrl(options.moduleUrl, profilesDir));
    return '';
}
/**
 * The profile-scoped default for one data directory:
 * `<home>/profiles/<profile>/<dir>`, or `undefined` when no profile is active
 * (the caller keeps its legacy default).
 */
export function profileScopedDefault(dir, options = {}) {
    const profile = detectProfileName(options);
    if (!profile)
        return undefined;
    const base = String(process.env.DSH_HOME ?? '').trim() || join(os.homedir(), '.dsh');
    return join(base, 'profiles', profile, dir);
```

</details>

**依据 8 · 源码核查**：[lib/client.js:535-615](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/client.js#L535-L615)

关闭仅pause，异步成功仍autoplay，无请求取消。

<details>
<summary>查看原文（81行）</summary>

```text
		function SpeakAction({ messageId, useChat, useStatus, ensureStatus, t }) {
			const status = useStatus((snapshot) => snapshot);
			const text = useChat((snapshot) => speakableTextFor(snapshot, messageId));
			const [phase, setPhase] = (0, react.useState)("idle");
			const [failure, setFailure] = (0, react.useState)(null);
			const [source, setSource] = (0, react.useState)(null);
			const player = useAudioPlayer(source);
			const toggle = player.toggle;
			const [panelOpen, setPanelOpen] = (0, react.useState)(false);
			const rootRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				if (!panelOpen) return;
				const onPointerDown = (event) => {
					const root = rootRef.current;
					if (root !== null && root.contains(event.target)) return;
					setPanelOpen(false);
					player.pause();
				};
				const onKeyDown = (event) => {
					if (event.key !== "Escape") return;
					setPanelOpen(false);
					player.pause();
				};
				document.addEventListener("pointerdown", onPointerDown);
				document.addEventListener("keydown", onKeyDown);
				return () => {
					document.removeEventListener("pointerdown", onPointerDown);
					document.removeEventListener("keydown", onKeyDown);
				};
			}, [panelOpen]);
			const autoplay = (0, react.useRef)(false);
			const sourceRef = (0, react.useRef)(null);
			sourceRef.current = source;
			(0, react.useEffect)(() => () => {
				if (sourceRef.current !== null) URL.revokeObjectURL(sourceRef.current);
			}, []);
			(0, react.useEffect)(() => {
				if (source === null || !autoplay.current) return;
				autoplay.current = false;
				toggle();
			}, [source, toggle]);
			const onClick = (0, react.useCallback)(() => {
				if (phase === "loading") return;
				if (source !== null) {
					if (!panelOpen) setPanelOpen(true);
					player.toggle();
					return;
				}
				if (text === void 0 || text === "") {
					setFailure("empty");
					return;
				}
				if (!status.configured) {
					setFailure("unconfigured");
					return;
				}
				setPhase("loading");
				setFailure(null);
				setPanelOpen(true);
				requestRecording({ text }).then(({ blob }) => {
					autoplay.current = true;
					setPhase("ready");
					setSource((previous) => {
						if (previous !== null) URL.revokeObjectURL(previous);
						return URL.createObjectURL(blob);
					});
				}).catch((error) => {
					setPhase("error");
					setFailure(error instanceof TtsClientError ? error : new TtsClientError("generic", String(error)));
				});
			}, [
				phase,
				player,
				source,
				status.configured,
				text
			]);
			const open = source !== null;
			const buttonLabel = phase === "loading" ? t("synthesize") : player.state.playing ? t("pause") : open ? t("play") : t("speak");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				ref: rootRef,
```

</details>

**依据 9 · 源码核查**：[lib/client.js:633-660](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/client.js#L633-L660)

warning仅failure，不是成功覆盖提示。

<details>
<summary>查看原文（28行）</summary>

```text
						})
					}),
					failure !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
						label: t(errorKeyFor(failure)),
						side: "bottom",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "mimotts-failure",
							role: "img",
							"aria-label": t(errorKeyFor(failure)),
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningTriangleOutlineRegular, { size: 14 })
						})
					}) : null,
					panelOpen && open ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "mimotts-panel",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PlayerBar, {
							state: player.state,
							onToggle: player.toggle,
							onSeek: player.seek,
							labels: {
								play: t("play"),
								pause: t("pause"),
								progress: t("progress")
							}
						})
					}) : null
				]
			});
		}
```

</details>

**依据 10 · 源码核查**：[lib/client.js:1101-1126](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/client.js#L1101-L1126)

错误状态之前先返回空历史分支。

<details>
<summary>查看原文（26行）</summary>

```text
		function RecordingsList({ t }) {
			const [index, setIndex] = (0, react.useState)(null);
			const [error, setError] = (0, react.useState)(null);
			const [busyRec, setBusyRec] = (0, react.useState)(null);
			const load = (0, react.useCallback)(() => {
				setError(null);
				fetchRecordings().then(setIndex).catch((failure) => setError(failure instanceof Error ? failure.message : String(failure)));
			}, []);
			(0, react.useEffect)(() => {
				load();
			}, [load]);
			const onResynth = (0, react.useCallback)((recId) => {
				setBusyRec(recId);
				resynthesizeRecording(recId).then(load).catch((failure) => setError(failure instanceof TtsClientError ? failure.message : String(failure))).finally(() => setBusyRec(null));
			}, [load]);
			const onDelete = (0, react.useCallback)((recId, verId) => {
				deleteRecordingVersion(recId, verId).then(load).catch((failure) => setError(failure instanceof TtsClientError ? failure.message : String(failure)));
			}, [load]);
			if (index === null || index.entries.length === 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: "mimotts-recordingsEmpty",
				children: t("recordingsEmpty")
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "mimotts-recordings",
				children: [error !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "mimotts-fieldError",
```

</details>

**依据 11 · 源码核查**：[lib/node/index.js:305-338](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/index.js#L305-L338)

文件路由fence+索引成员校验后读文件。

<details>
<summary>查看原文（34行）</summary>

```text
        child.effect(() => child.webServer.register({
            kind: 'exact',
            path: `${MIMOTTS_RECORDINGS_PATH}/file`,
            handler: (req, res) => {
                if (fence(req, res))
                    return;
                if (req.method !== 'GET') {
                    sendError(res, 405, { error: { code: 'bad-request', message: 'GET only.' } });
                    return;
                }
                const recId = readQuery(req).get('rec');
                const verId = readQuery(req).get('ver');
                if (recId === null || verId === null) {
                    sendError(res, 400, { error: { code: 'bad-request', message: 'The `rec` and `ver` queries are required.' } });
                    return;
                }
                void (async () => {
                    if (!(await hasVersion(recId, verId))) {
                        sendError(res, 404, { error: { code: 'bad-request', message: 'Unknown recording or version.' } });
                        return;
                    }
                    try {
                        const data = await readFile(versionFilePath(recId, verId));
                        res.statusCode = 200;
                        res.setHeader('content-type', 'audio/wav');
                        res.setHeader('cache-control', 'no-store');
                        res.end(data);
                    }
                    catch {
                        sendError(res, 404, { error: { code: 'bad-request', message: 'File missing on disk.' } });
                    }
                })();
            },
        }), `dsh-mimotts: ${MIMOTTS_RECORDINGS_PATH}/file`);
```

</details>

**依据 12 · 作者声明**：[README.md:133-138](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/README.md#L133-L138)

作者长文提示/IPC等声明需区分实现。

```text
## 已知边界

- 按**消息**朗读：动作行属于该条已定稿回复，朗读其正文（不读思考块与工具调用）；代码块以"代码略"代替。
- 文本超过"单次最大字符数"时朗读开头并在句末截断（动作行旁有提示）。
- Desktop（Electron）走 IPC 桥接 fetch，路由路径不变。
- 语音输入（麦克风）是官方 `voice-input` 组合包的职责，与本插件互补不冲突。
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 实际启用、日常与退出各需要什么投入？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先把下表的固定宿主接口与一条短文闭环核清，再考虑持续使用；不按README旧版本安装命令承诺新版可用。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH声明0.2.1-rc.2、Node>=22.19、Cordis/Schemastery及Web/Connection | 是 | 加载真实lib/注册并准入HTTP | README仍旧版、requestRejection实际契约待核；方法/服务缺失不能提供闭环 |
| Chat/slots/configForms/remote.credentials、浏览器Audio | 界面/播放必需 | 取定稿text、表单/凭据、音频播放 | 没有对应席位/权限/编解码/播放许可就不等可听 |
| 可用MiMo兼容端点/key、网络、额度 | 合成必需 | 正文及可选样本外发换音频 | configured仅key非空；实际服务、价格/音色/余额未核 |
| 可读样本路径与约定音频格式 | 仅克隆必需 | 整样本base64外发替代voice | 只读文件，无实际格式/时长检查，非可用克隆证明 |
| 可写profile/回退存储、磁盘与备份 | 历史必需 | WAV/index持久化和版本回找 | 合成后存储失败可返回错误，接口付费并不回滚 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 首次 | 管理者核当前Host方法/声明、真实lib和隔离profile目录；用户经配置卡存key、保存端点/音色/长度 | 拒绝未授权请求且允许合法请求；确认目录，不用“已配置”替代调用验收 |
| 试听 | 用户对可外发示例试听，理解仅草稿style/voice覆盖，其余读取已保存Host配置 | 实际听到且暂停/定位可用；失败先核上游请求/费用而非反复点 |
| 日常 | 用户点一条非敏感短文，校对提取/省略/音频；历史回放，必要才重合成 | 当前语音对应期望版本与内容覆盖；重合成另收费可能性单列 |
| 恢复/退出 | 管理者先备份index+WAV、对照孤儿/损坏；用户停播放和停止新合成，再禁用并按需要删除本地历史/撤key | 浮层关闭不是取消；索引删除非擦除证明，未承诺供应商数据撤回 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主环境、样本/试听请求与磁盘 | 对接口版本、凭据、目录和实际播放 | 无安装/API请求/价目核验，不报金额或零成本 |
| 持续使用 | 每次合成/重合成、正文/样本网络、WAV及索引增长 | 校对删略、挑音色、备份/清理、回读技术原文 | 默认2000字符/60秒不代表账单上限；真实延时/金额/音频大小未知 |
| 失败恢复 | 上游可能已处理的重试费用、孤儿WAV/备份空间 | 查费用/历史、修复索引/重放、重新核播放 | 无请求幂等键/事务恢复；关闭浮层不撤销已发请求 |
| 退出或替换 | 本地残留/迁移、未结束请求和供应商留存未知 | 停发、禁用、备份/删WAV与index、按需撤凭据，改系统朗读 | 卸载不自动删历史；unlink失败可被吞，端到端擦除未知 |

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 减少切换应用 | 消息动作→TTS→内联Audio与seek | 比系统朗读/外部TTS净节时、音质/理解率 |
| 复听版本 | 同原文分组、另WAV/版本、回放/重合成/删除 | 并发/故障恢复、完整样本/覆盖可追溯性 |
| 有限自然语言覆盖 | 明确代码省略、表格变形和长文截前缀 | 用户是否察觉遗漏，复杂技术答复能否正确听懂 |
| 播放控制 | pointer/键盘seek、pause与URL清理 | 实际编解码/自动播放权限；关闭等待面板不等取消 |

单位成本应以“正确理解且可回找的一次答复”分摊全部付费请求、失败/重做、网络/存储和人工；本轮没有价格、时长或听取实验，不把缺指标作源码受阻，也不把资源成本填0。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:60-85](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/package.json#L60-L85)

实际运行/宿主依赖声明。

<details>
<summary>查看原文（26行）</summary>

```text
  "engines": {
    "dsh": ">=0.2.1-rc.2 <0.3.0",
    "node": ">=22.19.0"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "~3.18.4"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-scope": "0.2.1-rc.2",
    "@deepseek-ai/dsh-credentials": "0.2.1-rc.2"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-api-remotes": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-connection": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-locale": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-store": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-chat": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-conversation": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-plugin-manager": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-primitives": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-renderer": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-session": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-settings": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.1-rc.2",
```

</details>

**依据 2 · 源码核查**：[lib/node/settings.js:27-45](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/settings.js#L27-L45)

默认端点、模型、字符与超时。

<details>
<summary>查看原文（19行）</summary>

```text
/** MiMo TTS model id. */
export const DEFAULT_MODEL = 'mimo-v2.5-tts';
/** Preset voice used when no clone sample is configured. */
export const DEFAULT_VOICE = 'mimo_default';
/**
 * Credential reference naming the MiMo API key inside the host credentials
 * store; the literal key itself never lands in a configuration file.
 */
export const DEFAULT_CREDENTIAL_REF = 'MIMO_API_KEY';
/** Longest text one synthesis accepts, in characters. */
export const DEFAULT_MAX_CHARS = 2000;
/** Upper bound on one upstream round-trip, in milliseconds. */
export const DEFAULT_TIMEOUT_MS = 60_000;
/** Sample sentence the settings page's audition button speaks. */
export const AUDITION_TEXT = '你好，这是 MiMo 语音合成的试听效果。';
/** Route prefix for persisted speech history (list / create / file). */
export const MIMOTTS_RECORDINGS_PATH = `${MIMOTTS_API_PREFIX}/recordings`;
/**
 * Response header carrying the new recording identity. Its value is the
```

</details>

**依据 3 · 源码核查**：[lib/node/index.js:189-229](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/index.js#L189-L229)

持久化在付费合成之后。

<details>
<summary>查看原文（41行）</summary>

```text
                }
                void (async () => {
                    const parsed = await readJsonBody(req);
                    if (parsed === undefined) {
                        sendError(res, 400, { error: { code: 'bad-request', message: 'Request body is not a JSON object.' } });
                        return;
                    }
                    const request = parsed;
                    if (typeof request.text !== 'string' || request.text.trim() === '') {
                        sendError(res, 400, { error: { code: 'bad-request', message: 'A non-empty `text` string is required.' } });
                        return;
                    }
                    const engine = await resolveEngineSnapshot(ctx, config);
                    try {
                        const wav = await synthesizeSpeech(engine, {
                            text: request.text,
                            style: typeof request.style === 'string' ? request.style : undefined,
                            voice: typeof request.voice === 'string' ? request.voice : undefined,
                        });
                        const style = (typeof request.style === 'string' ? request.style : '').trim() || engine.style;
                        const voice = (typeof request.voice === 'string' ? request.voice : '').trim() || engine.voice;
                        const { recording, version } = await addVersion(request.text, style || undefined, voice || undefined, engine.model, wav);
                        res.statusCode = 200;
                        res.setHeader('content-type', 'audio/wav');
                        res.setHeader('cache-control', 'no-store');
                        res.setHeader(MIMOTTS_RECORDING_HEADER, Buffer.from(JSON.stringify({ recId: recording.id, verId: version.id })).toString('base64'));
                        res.end(Buffer.from(wav));
                    }
                    catch (error) {
                        const failure = error instanceof TtsError
                            ? error
                            : new TtsError('upstream-error', error instanceof Error ? error.message : String(error));
                        const status = failure.code === 'not-configured' ? 503
                            : failure.code === 'bad-request' || failure.code === 'text-too-long' ? 400
                                : failure.code === 'timeout' ? 504
                                    : 502;
                        sendError(res, status, { error: { code: failure.code, message: failure.message } });
                    }
                })();
            },
        }), `dsh-mimotts: ${MIMOTTS_RECORDINGS_PATH}`);
```

</details>

**依据 4 · 源码核查**：[lib/node/tts.js:84-123](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/tts.js#L84-L123)

样本整体外发、fetch信号与外部调用。

<details>
<summary>查看原文（40行）</summary>

```text
        let sample;
        try {
            sample = await deps.readVoiceSample(config.voiceSamplePath);
        }
        catch (cause) {
            throw new TtsError('voice-sample-unreadable', `The voice-clone sample at ${config.voiceSamplePath} could not be read.`, cause);
        }
        audio = {
            format: 'wav',
            voice_audio: { format: 'wav', data: Buffer.from(sample).toString('base64') },
        };
    }
    else {
        audio = { format: 'wav', voice };
    }
    const payload = {
        model: config.model,
        audio,
        messages: [{ role: 'assistant', content }],
    };
    const endpoint = `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;
    let response;
    try {
        response = await deps.fetch(endpoint, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'api-key': config.apiKey,
                'user-agent': 'dsh-mimotts/0.1.0',
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(config.timeoutMs),
        });
    }
    catch (cause) {
        const timedOut = cause instanceof Error && cause.name === 'TimeoutError';
        throw new TtsError(timedOut ? 'timeout' : 'upstream-error', timedOut
            ? `MiMo TTS did not answer within ${config.timeoutMs} ms.`
            : `MiMo TTS could not be reached: ${cause instanceof Error ? cause.message : String(cause)}`, cause);
    }
```

</details>

**依据 5 · 源码核查**：[lib/node/recordings.js:120-161](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/recordings.js#L120-L161)

多版本增长、删除错误与索引行为。

<details>
<summary>查看原文（42行）</summary>

```text
 * @param recId - the recording node id.
 * @param style - style phrase used, or undefined for neutral.
 * @param voice - preset voice used, or undefined for default.
 * @param model - model id used.
 * @param wav - the freshly synthesized WAV bytes.
 * @returns the recording and new version, or undefined when `recId` is unknown.
 */
export async function resynthesize(recId, style, voice, model, wav) {
    await ensureDir();
    const index = await readIndex();
    const recording = index.entries.find(entry => entry.id === recId);
    if (recording === undefined)
        return undefined;
    const version = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        style: style ?? null,
        voice: voice ?? null,
        model,
    };
    recording.versions.unshift(version);
    await writeFile(versionFilePath(recording.id, version.id), Buffer.from(wav));
    await writeIndex(index);
    return { recording, version };
}
/**
 * Delete one version's file and index entry. When a recording loses its last
 * version it is removed entirely.
 * @returns true when the version existed and was removed.
 */
export async function deleteVersion(recId, verId) {
    const index = await readIndex();
    const recording = index.entries.find(entry => entry.id === recId);
    if (recording === undefined)
        return false;
    const at = recording.versions.findIndex(version => version.id === verId);
    if (at === -1)
        return false;
    recording.versions.splice(at, 1);
    await unlink(versionFilePath(recId, verId)).catch(() => { });
    if (recording.versions.length === 0) {
        index.entries = index.entries.filter(entry => entry.id !== recId);
```

</details>

**依据 6 · 源码核查**：[lib/client.js:741-768](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/client.js#L741-L768)

试听的草稿覆盖边界。

<details>
<summary>查看原文（28行）</summary>

```text
				autoplay.current = false;
				toggle();
			}, [sampleUrl, toggle]);
			const audition = (0, react.useCallback)(() => {
				if (busy) return;
				setBusy(true);
				setFailure(null);
				synthesize({
					text: AUDITION_TEXT,
					style: state.style.text.trim() === "" ? void 0 : state.style.text,
					voice: state.voice.text.trim() === "" ? void 0 : state.voice.text
				}).then((blob) => {
					autoplay.current = true;
					setBusy(false);
					setSampleUrl((previous) => {
						if (previous !== null) URL.revokeObjectURL(previous);
						return URL.createObjectURL(blob);
					});
				}).catch((error) => {
					setBusy(false);
					setFailure(error instanceof TtsClientError ? error : new TtsClientError("generic", String(error)));
				});
			}, [
				busy,
				state.style.text,
				state.voice.text,
				synthesize
			]);
```

</details>

**依据 7 · 源码核查**：[lib/client.js:285-326](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/client.js#L285-L326)

真实指针/键盘播放定位。

<details>
<summary>查看原文（42行）</summary>

```text
						"aria-valuemin": 0,
						"aria-valuemax": Math.max(0, Math.round(duration)),
						"aria-valuenow": Math.round(state.currentTime),
						"aria-valuetext": `${clock(state.currentTime)} / ${clock(duration)}`,
						onPointerDown: (event) => {
							event.currentTarget.setPointerCapture(event.pointerId);
							setDragging(true);
							onSeek(positionAt(event.clientX));
						},
						onPointerMove: (event) => {
							if (!dragging) return;
							onSeek(positionAt(event.clientX));
						},
						onPointerUp: (event) => {
							if (!dragging) return;
							setDragging(false);
							if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
							onSeek(positionAt(event.clientX));
						},
						onPointerCancel: () => {
							setDragging(false);
						},
						onKeyDown: (event) => {
							const step = event.shiftKey ? 15 : 5;
							if (event.key === "ArrowRight" || event.key === "ArrowUp") {
								event.preventDefault();
								onSeek(state.currentTime + step);
							} else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
								event.preventDefault();
								onSeek(state.currentTime - step);
							} else if (event.key === "Home") {
								event.preventDefault();
								onSeek(0);
							} else if (event.key === "End" && duration > 0) {
								event.preventDefault();
								onSeek(duration);
							}
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: "mimotts-fill",
							style: { width: `${(ratio * 100).toFixed(2)}%` }
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些已经存在，下一步值得验证什么？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

播放器、键盘进度、按原文多版本、重合成/删除、样例试听和配置表单已经存在，不能把再加历史/试听称为创新。现版API/body/fence、跨请求存储、取消和成功覆盖提示应先修到可验证；基础缺陷的修补也不能包装成新需求已成立。

未验证候选是让每个音频版本保存并展示“实际朗读文本/省略种类/截断位置+配置/克隆样本非敏感标识”，提供一键回原文定位，使用户准确知道已听范围。它是覆盖可追溯性的产品假设，不是新TTS模型或当前已有效功能；避免为了提示收集更多原始敏感语音/会话。当前已有原文和版本ID可作为最小接缝，尚无真实覆盖文本元数据。

先比较简单替代：现版旁固定警告+回读原文、系统朗读、复制到外部TTS；不先建新的语音平台。最小对照用相同获准短文、含代码/图片/表格/超长的混合集和同一端点，对比现版与覆盖提示。分别测关键事实答题/遗漏发现率、定位原文时间、重复合成次数、合格任务总费/存储/人工；音质服务保持相同以免误把供应商改进归插件。若简单警告已足够，覆盖提示不提高正确理解/定位，或其检查负担抵消收益，就否定单独插件机会；不能只看点击/音频个数。

#### 证据与依据

**依据 1 · 源码核查**：[lib/node/normalize.js:10-50](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/normalize.js#L10-L50)

非无损内容变换是候选依据。

<details>
<summary>查看原文（41行）</summary>

````text
/** Replacement spoken for a fenced code block (reading code aloud is noise). */
const CODE_FENCE_NOTE = '代码略。';
/**
 * Convert assistant Markdown into text worth speaking aloud.
 *
 * Removes fenced code (kept as a short spoken note), inline-code markers,
 * heading/list/quote markers, emphasis markers, tables (cells joined with
 * commas), images, HTML tags, and link targets (the anchor text stays).
 * @param markdown - raw assistant reply text.
 * @returns plain text suitable for TTS input.
 */
export function toSpeakableText(markdown) {
    let text = markdown;
    // Fenced code: one spoken note per block, whatever its language.
    text = text.replace(/```[\s\S]*?```/g, `\n${CODE_FENCE_NOTE}\n`);
    text = text.replace(/~~~[\s\S]*?~~~/g, `\n${CODE_FENCE_NOTE}\n`);
    // Inline code keeps its content, loses its ticks.
    text = text.replace(/`([^`\n]*)`/g, '$1');
    // Images: drop entirely (alt text is rarely speakable).
    text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
    // Links keep the anchor text; the URL is never spoken.
    text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
    text = text.replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1');
    // Reference definitions and HTML tags.
    text = text.replace(/^\[[^\]]*\]:\s+\S+.*$/gmu, '');
    text = text.replace(/<\/?[a-zA-Z][^>\n]*>/g, '');
    // Headings, bullets, quotes, and horizontal rules.
    text = text.replace(/^#{1,6}\s+/gmu, '');
    text = text.replace(/^\s*(?:[-*+]|\d+[.)])\s+/gmu, '');
    text = text.replace(/^\s*>\s?/gmu, '');
    text = text.replace(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gmu, '\n');
    // Tables: keep cell text in reading order, drop alignment and cell markup.
    text = text.replace(/^\|?[\s:|-]+\|[\s:|-]*$/gmu, '');
    text = text.replace(/\s*\|\s*/g, '，');
    // Emphasis and strikethrough markers only; the words stay.
    text = text.replace(/(\*\*|__|~~)/g, '');
    text = text.replace(/(?<!\w)\*([^*\n]+)\*(?!\w)/g, '$1');
    text = text.replace(/(?<!\w)_([^_\n]+)_(?!\w)/g, '$1');
    // Escaped punctuation keeps the punctuation.
    text = text.replace(/\\([\\`*_{}[\]()#+\-.!])/g, '$1');
    // Whitespace: collapse runs, trim each line, drop empty lines.
````

</details>

**依据 2 · 源码核查**：[lib/node/normalize.js:65-71](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/normalize.js#L65-L71)

具体尾部截断。

```text
export function clampText(text, maxChars) {
    if (text.length <= maxChars)
        return text;
    const prefix = text.slice(0, maxChars);
    const boundary = Math.max(prefix.lastIndexOf('。'), prefix.lastIndexOf('！'), prefix.lastIndexOf('？'), prefix.lastIndexOf('!'), prefix.lastIndexOf('?'), prefix.lastIndexOf('.'));
    return boundary > maxChars / 2 ? prefix.slice(0, boundary + 1) : prefix;
}
```

**依据 3 · 源码核查**：[lib/node/recordings.js:86-111](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/recordings.js#L86-L111)

现有原文/版本数据但缺实际覆盖与样本指纹。

<details>
<summary>查看原文（26行）</summary>

```text
 * @param style - style phrase used, or undefined for neutral.
 * @param voice - preset voice used, or undefined for default.
 * @param model - model id used.
 * @param wav - the WAV bytes to persist.
 * @returns the recording node and the new version.
 */
export async function addVersion(text, style, voice, model, wav) {
    await ensureDir();
    const index = await readIndex();
    const version = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        style: style ?? null,
        voice: voice ?? null,
        model,
    };
    let recording = index.entries.find(entry => entry.text === text);
    if (recording === undefined) {
        recording = { id: randomUUID(), text, createdAt: version.createdAt, versions: [] };
        index.entries.unshift(recording);
    }
    recording.versions.unshift(version);
    await writeFile(versionFilePath(recording.id, version.id), Buffer.from(wav));
    await writeIndex(index);
    return { recording, version };
}
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1101-1177](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/client.js#L1101-L1177)

历史重合成/删除/回放已存在。

<details>
<summary>查看原文（77行）</summary>

```text
		function RecordingsList({ t }) {
			const [index, setIndex] = (0, react.useState)(null);
			const [error, setError] = (0, react.useState)(null);
			const [busyRec, setBusyRec] = (0, react.useState)(null);
			const load = (0, react.useCallback)(() => {
				setError(null);
				fetchRecordings().then(setIndex).catch((failure) => setError(failure instanceof Error ? failure.message : String(failure)));
			}, []);
			(0, react.useEffect)(() => {
				load();
			}, [load]);
			const onResynth = (0, react.useCallback)((recId) => {
				setBusyRec(recId);
				resynthesizeRecording(recId).then(load).catch((failure) => setError(failure instanceof TtsClientError ? failure.message : String(failure))).finally(() => setBusyRec(null));
			}, [load]);
			const onDelete = (0, react.useCallback)((recId, verId) => {
				deleteRecordingVersion(recId, verId).then(load).catch((failure) => setError(failure instanceof TtsClientError ? failure.message : String(failure)));
			}, [load]);
			if (index === null || index.entries.length === 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
				className: "mimotts-recordingsEmpty",
				children: t("recordingsEmpty")
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "mimotts-recordings",
				children: [error !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "mimotts-fieldError",
					role: "status",
					children: error
				}) : null, index.entries.map((entry) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "mimotts-recording",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "mimotts-recordingText",
						title: entry.text,
						children: entry.text
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: "mimotts-versions",
						children: entry.versions.map((version) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
							className: "mimotts-version",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("audio", {
									className: "mimotts-versionAudio",
									src: recordingFileUrl(entry.id, version.id),
									controls: true,
									preload: "none"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "mimotts-versionMeta",
									children: [
										new Date(version.createdAt).toLocaleString(),
										version.voice !== null ? ` · ${version.voice}` : "",
										version.style !== null ? ` · ${version.style}` : ""
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mimotts-recButton",
									disabled: busyRec === entry.id,
									onClick: () => {
										onResynth(entry.id);
									},
									children: busyRec === entry.id ? t("reSynthesizing") : t("reSynthesize")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mimotts-recButton",
									onClick: () => {
										onDelete(entry.id, version.id);
									},
									children: t("deleteVersion")
								})
							]
						}, version.id))
					})]
				}, entry.id))]
			});
		}
		// src/client/RecordingsPage.tsx
```

</details>

**依据 5 · 源码核查**：[lib/client.js:741-768](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/client.js#L741-L768)

已有试听，不计为新功能。

<details>
<summary>查看原文（28行）</summary>

```text
				autoplay.current = false;
				toggle();
			}, [sampleUrl, toggle]);
			const audition = (0, react.useCallback)(() => {
				if (busy) return;
				setBusy(true);
				setFailure(null);
				synthesize({
					text: AUDITION_TEXT,
					style: state.style.text.trim() === "" ? void 0 : state.style.text,
					voice: state.voice.text.trim() === "" ? void 0 : state.voice.text
				}).then((blob) => {
					autoplay.current = true;
					setBusy(false);
					setSampleUrl((previous) => {
						if (previous !== null) URL.revokeObjectURL(previous);
						return URL.createObjectURL(blob);
					});
				}).catch((error) => {
					setBusy(false);
					setFailure(error instanceof TtsClientError ? error : new TtsClientError("generic", String(error)));
				});
			}, [
				busy,
				state.style.text,
				state.voice.text,
				synthesize
			]);
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前应如何决策，什么结果才允许升级试用？

**研究主题**：采用判断、工程质量与复用

#### 完整回答

结论为观察，尚不按README安装说明推定当前新版组合可试用。声音外发、内容删略、关闭不取消、历史非事务和Host方法契约缺口同时影响核心合格听取；这不是因“没有运行”泛判受阻，也不意味着已证明服务不可用。

当前只建议确有复听需求的人先在隔离profile核声明Host/凭据方法与准入，用可外发、可人工对照的一条短自然语言答复完成真实播放/暂停/seek/回放/删除，并记录实际目录与费用。然后再测代码/表格/超长覆盖、关闭等待面板、失联/重复请求、并发索引/删除失败；复杂技术/敏感答复继续回读原文。禁用前停止新请求，保全索引与WAV，按需撤key并核本地残留；若范围无法说明、目录/权限不符或重做成本高于系统朗读就退出。

源码可借鉴模块化normalize/tts/wav、稳定错误码、凭据与界面/Host分层和真实播放器清理；不可迁移的是对服务格式/Host接口/播放权限/历史可靠性的未经验证承诺。本轮读built完整关键链、相关source/已有测试文本，不运行测试或目标；作者测试记录独立标注，不替代当前宿主和用户验收。场景与便利成立，证据只到静态链，维护/恢复成本未解除；技术贡献以普通TTS集成为主，商业暂无专有任务壁垒/经济机制。

#### 证据与依据

**依据 1 · 源码核查**：[lib/node/index.js:70-87](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/index.js#L70-L87)

方法与注入门槛具体待验。

<details>
<summary>查看原文（18行）</summary>

```text
export function apply(ctx, config) {
    // This plugin owns its settings page (the browser half's `settings.section`
    // entry), so it opts out of the automatic Plugins-page config card.
    ctx.inject(['settings'], (child) => {
        child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
    });
    ctx.inject(['webServer', 'connection'], (child) => {
        const fence = (req, res) => {
            // The configured Host/Origin fence plus browser authentication: an
            // unauthenticated LAN request must not spend the operator's API credits.
            const rejection = child.connection.requestRejection(req);
            if (rejection === undefined)
                return false;
            res.statusCode = rejection;
            res.end();
            return true;
        };
        const sendJson = (res, status, body) => {
```

</details>

**依据 2 · 源码核查**：[lib/client.js:535-615](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/client.js#L535-L615)

有限播放/关闭等待语义。

<details>
<summary>查看原文（81行）</summary>

```text
		function SpeakAction({ messageId, useChat, useStatus, ensureStatus, t }) {
			const status = useStatus((snapshot) => snapshot);
			const text = useChat((snapshot) => speakableTextFor(snapshot, messageId));
			const [phase, setPhase] = (0, react.useState)("idle");
			const [failure, setFailure] = (0, react.useState)(null);
			const [source, setSource] = (0, react.useState)(null);
			const player = useAudioPlayer(source);
			const toggle = player.toggle;
			const [panelOpen, setPanelOpen] = (0, react.useState)(false);
			const rootRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				if (!panelOpen) return;
				const onPointerDown = (event) => {
					const root = rootRef.current;
					if (root !== null && root.contains(event.target)) return;
					setPanelOpen(false);
					player.pause();
				};
				const onKeyDown = (event) => {
					if (event.key !== "Escape") return;
					setPanelOpen(false);
					player.pause();
				};
				document.addEventListener("pointerdown", onPointerDown);
				document.addEventListener("keydown", onKeyDown);
				return () => {
					document.removeEventListener("pointerdown", onPointerDown);
					document.removeEventListener("keydown", onKeyDown);
				};
			}, [panelOpen]);
			const autoplay = (0, react.useRef)(false);
			const sourceRef = (0, react.useRef)(null);
			sourceRef.current = source;
			(0, react.useEffect)(() => () => {
				if (sourceRef.current !== null) URL.revokeObjectURL(sourceRef.current);
			}, []);
			(0, react.useEffect)(() => {
				if (source === null || !autoplay.current) return;
				autoplay.current = false;
				toggle();
			}, [source, toggle]);
			const onClick = (0, react.useCallback)(() => {
				if (phase === "loading") return;
				if (source !== null) {
					if (!panelOpen) setPanelOpen(true);
					player.toggle();
					return;
				}
				if (text === void 0 || text === "") {
					setFailure("empty");
					return;
				}
				if (!status.configured) {
					setFailure("unconfigured");
					return;
				}
				setPhase("loading");
				setFailure(null);
				setPanelOpen(true);
				requestRecording({ text }).then(({ blob }) => {
					autoplay.current = true;
					setPhase("ready");
					setSource((previous) => {
						if (previous !== null) URL.revokeObjectURL(previous);
						return URL.createObjectURL(blob);
					});
				}).catch((error) => {
					setPhase("error");
					setFailure(error instanceof TtsClientError ? error : new TtsClientError("generic", String(error)));
				});
			}, [
				phase,
				player,
				source,
				status.configured,
				text
			]);
			const open = source !== null;
			const buttonLabel = phase === "loading" ? t("synthesize") : player.state.playing ? t("pause") : open ? t("play") : t("speak");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				ref: rootRef,
```

</details>

**依据 3 · 源码核查**：[lib/node/recordings.js:54-72](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/lib/node/recordings.js#L54-L72)

索引容错与直接写，不是恢复事务。

<details>
<summary>查看原文（19行）</summary>

```text
 * Read the index, tolerating a missing or corrupt file.
 * @returns the parsed index, or an empty one when unreadable.
 */
async function readIndex() {
    try {
        const raw = await readFile(indexFile(), 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed.entries) ? parsed : EMPTY_INDEX;
    }
    catch {
        return EMPTY_INDEX;
    }
}
/** Persist the index, creating the directory first. */
async function writeIndex(index) {
    await ensureDir();
    await writeFile(indexFile(), JSON.stringify(index), 'utf8');
}
/** The on-disk file name for one version; ids are uuids, so no path tricks. */
```

</details>

**依据 4 · 作者声明**：[README.md:140-145](https://github.com/1497105876/dsh-mimotts/blob/c8105acbd3407ea45162a32aed4233e41bfe49a7/README.md#L140-L145)

作者旧版测试记录，不当本轮执行。

```text
## 验证记录

- `tsc` 全量类型检查通过（对着 0.2.0-rc.2 的真实 .d.ts）
- `node --test`：19/19 通过（请求形状/PCM 封装/Markdown 归一化/文本提取/错误码映射）
- `scripts/stub-e2e.mjs`：真实 HTTP 桩端到端通过（96,044 字节 WAV）
- MiMo 实机协议探测通过（与官方 `mimo-tts-wav` skill 同一契约，115,244 字节 WAV）；`scripts/live-e2e.mjs` 可对真实 API 跑完整引擎链路
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
