# dsh-status-rotator

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2458e21](https://github.com/01Virex/dsh-status-rotator/tree/2458e215cf7e3460854bc191f61a15a8dcd74b6a)

<!-- BEGIN META -->
[![GitHub ★ 221](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=221&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 8,316](https://img.shields.io/static/v1?label=npm+30d&message=8%2C316&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-status-rotator)
<!-- END META -->

> **功能**：为 DSH 等待状态行提供可编辑轮换文案、渐变、弹幕和鲸尾动画。

> **亮点**：[Q01](#research-q01) 的增量是无需改宿主源码即可配置阶段文案，结合 [Q02](#research-q02) 的用户差异存储支持升级后保留个人设置；未证明业务效率改善。

> **主要限制**：[Q02](#research-q02) 的多副本保存并非事务；[Q03](#research-q03) 的白名单仅提供主题合作入口，不能保证状态行始终可见。

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
  - [Q01 · 替换等待文案的用户价值与实现边界是什么？](#detail-section-11)
  - [Q02 · 设置保存、远端词库与并发冲突怎样处理？](#detail-section-12)
  - [Q03 · 观察器、主题共存和退出能否保持原界面可用？](#detail-section-13)
  - [Q04 · 什么范围值得试用，如何衡量成本和验证替代设计？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望定制等待界面的个人用户，在保留真实计时和读屏信息的前提下调整文案与动画。

参照原状态行与静态主题，不把更多动画当作任务效率提升。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 阶段文案轮换 | 定制等待提示 | 不改变模型执行速度 |
| 外观与动画 | 渐变、鲸尾、弹幕 | 资源开销与读屏需核对 |
| 词库配置 | 编辑个人内容 | 包外差异保存，跨进程保护有限 |
| 远端更新 | 获取新词库 | 网络可选，内容独立变化 |
| 配置事件流 | 刷新已打开客户端 | 依赖Host路由与浏览器连接 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH Web与Cordis | 必需 | Host路由与客户端挂载 | 状态DOM漂移时显示可能失效 |
| 用户配置可写目录 | 保存必需 | 持久用户差异 | 写失败返回500，镜像可能先变 |
| 远端词库网络 | 可选 | 更新可用文案 | 失败保留旧缓存 |
| 主题协作与读屏核对 | 使用条件 | 保持真实状态可见 | 标记不保证主题自动放行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户用独立profile备份配置 | 保留原状态行退路 |
| 加载 | 仅开本地文案，关动画和远端 | 正确显示时长与阶段 |
| 编辑 | 设置页保存，遇409先重读 | 刷新后差异仍一致 |
| 验收与退出 | 检查结束、读屏与停用 | 残留则停用重载并保留配置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地资源，金额未知 | 选择词库、主题，耗时未知 | 不需模型调用 |
| 持续使用 | 扫描、动画、可选词库网络 | 跟随宿主与主题适配 | CPU和帧耗时未测 |
| 失败恢复 | 配置副本与重载 | 对照权威副本和镜像 | 多副本并非事务 |
| 退出 | 保留配置存储 | 停用并确认状态复原 | 未验证全部主题组合 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 等待区定制 | 文案、样式与动画入口存在 | 主观体验和注意力影响 |
| 配置保留 | 包外差异与冲突响应 | 多进程写入完整性 |
| 性能与退出 | 隐藏暂停及定向清理 | 真实资源与复原成功率 |

> **思考**：[Q02](#research-q02) 的多副本保存并非事务；[Q03](#research-q03) 的白名单仅提供主题合作入口，不能保证状态行始终可见。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的增量是无需改宿主源码即可配置阶段文案，结合 [Q02](#research-q02) 的用户差异存储支持升级后保留个人设置；未证明业务效率改善。

[Q02](#research-q02) 内容分层与差异保存值得借鉴；[Q03](#research-q03) 隐藏暂停、白名单和定向清理降低维护冲突，但需宿主协作。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的多副本保存并非事务；[Q03](#research-q03) 的白名单仅提供主题合作入口，不能保证状态行始终可见。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先只试本地文案，逐项核对时长、阶段、读屏和配置回读；冲突先重读，隐藏或残留时停用并回原状态行。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

文案呈现、分层配置与清理机制有源码依据；主题共存、退出体验和资源效果未实测；插槽方向未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件抽读Host保存、远端词库与来源栅栏、Web状态定位、重扫和卸载；未穷举所有动画与设置项，未执行目标。
- 下一步：在目标宿主与主题矩阵检查正常、结束、隐藏恢复、读屏和停用，记录资源与错误；比较稳定插槽是否降低维护代价。

**分析版本**

- **仓库**：[01Virex/dsh-status-rotator](https://github.com/01Virex/dsh-status-rotator)
- **版本号**：0.38.0（[固定提交 2458e21](https://github.com/01Virex/dsh-status-rotator/tree/2458e215cf7e3460854bc191f61a15a8dcd74b6a)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 的未验证方向是稳定宿主状态插槽，比较其与DOM观察器在主题矩阵中的隐藏、阶段错误和维护负担；没有净改善则放弃。

在目标宿主与主题矩阵检查正常、结束、隐藏恢复、读屏和停用，记录资源与错误；比较稳定插槽是否降低维护代价。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 4314 | — | — | 73594 |
| .cjs | source | 30 | 7380 | 6107 | 968 | — |
| .js | source | 3 | 17883 | 15190 | 2395 | — |
| .mjs | source | 1 | 111 | 88 | 15 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=17&color=737b86&logo=github)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+created%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z) [![近30天关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：个性化等待区能否保留可信宿主状态，配置与外部词库的持久所有权是否清晰？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 替换等待文案的用户价值与实现边界是什么？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

它是个性化等待界面的 Web 插件，适合愿意调整等待文案、颜色与动画的个人用户。README把替换 Deep diving 文案且保留宿主计时作为定位，源码按 data-chat-running、runningText 等节点识别运行行，并针对旧宿主折叠头设另一套定位。可核查增量是无需手改宿主就能轮换词库和设置外观，不是模型速度、工具成功或任务完成质量的提升。

计时与状态仍来自宿主节点及事件，文案只做呈现。用户的合格结果应包括运行时能看到正确时长、结束后状态不滞留、读屏公告不被隐藏。已有简单替代是保留原状态行或只用静态主题；没有感到等待界面摩擦的人不必承担额外观察器和设置维护。作者的录屏和声明不是本次宿主执行证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-11](https://github.com/01Virex/dsh-status-rotator/blob/2458e215cf7e3460854bc191f61a15a8dcd74b6a/README.md#L1-L11)

作者明确定位为状态文案替换与保留时钟。

<details>
<summary>查看原文（11行）</summary>

```text
# dsh-status-rotator

> Give DSH's running status your own voice: **custom phrases, typewriter output, day/night gradients, danmaku and an optional animated whale tail**. Ships **1533 phrases, 14 theme packs**; choose which packs to enable.

**English** | [中文](./README_ZH.md) · [Effects](#effect-preview) · [Install](#installation) · [Reference](#feature-overview) · [Changelog](./CHANGELOG.md)

[![npm version](https://img.shields.io/npm/v/dsh-status-rotator?color=4a6cf7)](https://www.npmjs.com/package/dsh-status-rotator)
[![GitHub stars](https://img.shields.io/github/stars/01Virex/dsh-status-rotator?color=4a6cf7)](https://github.com/01Virex/dsh-status-rotator)
[![license](https://img.shields.io/github/license/01Virex/dsh-status-rotator)](LICENSE)

A [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) client plugin that replaces `Deep diving...` / `深度求索中...` with editable phrases while preserving the host's elapsed-time clock.
```

</details>

**依据 2 · 源码核查**：[lib/client.js:2990-3043](https://github.com/01Virex/dsh-status-rotator/blob/2458e215cf7e3460854bc191f61a15a8dcd74b6a/lib/client.js#L2990-L3043)

两代宿主定位、读屏节点和状态行选择器属于真实客户端机制。

<details>
<summary>查看原文（54行）</summary>

```text
			/**
			 * TurnStatus 的时钟是直接子元素,且带 aria-hidden="true"(dsh 本体
			 * 渲染约定)。不能取「第一个元素子节点」:渐变开启时第一个元素是本
			 * 插件包出的文案 span,会抢走时钟的位置,导致阶段判定彻底错乱。
			 * 0.1.7 的按钮宿主上还有别的 aria-hidden 直接子元素(chevron 图标就是
			 * aria-hidden="true"),所以插件自己的时钟 span 优先。
			 */
			const clockEl = (el) => el.querySelector(":scope > ." + CLOCK_CLASS)
				|| Array.from(el.children).find((n) => n.getAttribute("aria-hidden") === "true");

			/** 0.1.7 宿主:回合折叠头 class 名带构建哈希,只能靠 data-turn-process 按钮定位 */
			const TURN_PROCESS_SELECTOR = "[data-turn-process]";
			/** 0.1.7 宿主:插件自己的时钟 span(内容 = 宿主时长文本原样搬过来) */
			const CLOCK_CLASS = "dsh-status-rotator-clock";
			/** 0.1.7 宿主:插件自己的状态行(dsh ≤0.1.6 的位置:输入框上方、对话下方) */
			const LINE_CLASS = "dsh-status-rotator-line";
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
			 */
			const LINE_MARKER_ATTR = "data-dsh-status-rotator-line";
			/** 观测徽标(重试 / 降级等结构化信号):挂在时钟后面,两代宿主都渲染 */
			const BADGE_CLASS = "dsh-status-rotator-badge";

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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 设置保存、远端词库与并发冲突怎样处理？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

配置将用户差异与随包、远端和外部词库分层，避免把远端内容误认成用户编辑。保存先检查可选 If-Match；不匹配返回409，但缺省或星号仍无条件覆盖。withSaveLock串行化当前模块实例的写入，不能把它解释成多个宿主进程共享文件时的原子比较发布。

代码注释把用户配置称权威副本，但实际先写兼容镜像，再写用户配置；第二步失败会报500，镜像已经可能改变。原子 rename 只保护单文件，不构成多副本事务。旧 settings 副本失败被忽略，也与完整成功不同。远端词库使用15秒超时、结构校验和2MiB限制，失败保留已有缓存；成功后内容可独立于插件版本变化。读写来源栅栏检查 JSON类型与浏览器Origin/Fetch-Site，缺少Origin也可通过，不能替代账户认证；暴露服务需由宿主或代理负责访问控制。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1786-1825](https://github.com/01Virex/dsh-status-rotator/blob/2458e215cf7e3460854bc191f61a15a8dcd74b6a/lib/index.js#L1786-L1825)

实际If-Match语义与镜像先写、权威副本失败路径。

<details>
<summary>查看原文（40行）</summary>

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

	const s = await getSettingsApi();
	const bundled = await bundledDocument();
	// 「用户改动」= 提交的整份文档 相对「内置 + 自动更新词库 + 外部词库」的差异(见
	// userChangeBaselineDocument):整份词库留在包内的 config.example.json,存储不跟着膨胀;
	// 上游与外部词库送来的内容也不算用户改动(issue #92)。
	const delta = userConfigDeltaFor(await userChangeBaselineDocument(), document);

	// 兼容镜像 = **用户自己的配置**:内置默认 + 老宿主设置 + 本次算出的用户差异。
	// 刻意不含「外部词库」与「自动更新词库」两层 —— 它们各自有交付通道(词库文件 / 上游缓存),
	// 混进镜像会让「把包从外部词库删掉即可回到随包内容」失效(镜像里那份快照会在词库层消失后
	// 顶上来),也会让下一次 absorbFileLayer 把它们误当成手改内容。issue #92 的另一半原因。
	const mirrorText = JSON.stringify(mergeLayers(bundled, s ? contentTypeOf(rawSection(s) || {}) : null, delta), null, 4) + "\n";
	const mirrorOk = await writeMirrorFile(mirrorText);
	try {
		await writeUserConfigDocument({
			...delta,
			[SETTINGS_VERSION_KEY]: SETTINGS_VERSION,
			[MIRROR_HASH_KEY]: mirrorOk ? digestOf(mirrorText) : null
		});
	} catch (error) {
		res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
		res.end(JSON.stringify({ ok: false, error: `设置持久化失败: ${error.message}(${userConfigPath()})` }));
		return;
	}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1827-1856](https://github.com/01Virex/dsh-status-rotator/blob/2458e215cf7e3460854bc191f61a15a8dcd74b6a/lib/index.js#L1827-L1856)

旧settings失败忽略与回传保存状态。

<details>
<summary>查看原文（30行）</summary>

```text
	// 老宿主:官方设置命名空间也写一份(新版 dsh 的 settings 服务没有 register,
	// getSettingsApi() 返回 null,这段自然跳过)。它已经不是权威副本,失败不影响保存结果。
	if (s) {
		try {
			const stored = {
				...settingsDeltaFor(
					bundled,
					await readFileDocument(true),
					await remoteBankDocument(),
					await externalBankDocument(),
					contentTypeOf(rawSection(s) || {}),
					document
				),
				[SETTINGS_VERSION_KEY]: SETTINGS_VERSION
			};
			await s.scope.replace(stored);
		} catch (error) { /* ignore */ }
	}

	// 把写完之后的 ETag 一起回给调用方 —— 设置页记住它,下一次写才不会把自己刚写的版本误判成冲突
	let savedEtag = null;
	try { savedEtag = await currentConfigEtag(getSettingsApi); } catch (error) { /* ignore */ }
	res.writeHead(200, {
		"content-type": "application/json; charset=utf-8",
		"cache-control": "no-cache",
		...(savedEtag ? { [ETAG_HEADER]: savedEtag } : {})
	});
	res.end(JSON.stringify({ ok: true, mirror: mirrorOk }));
	// 保存成功立刻推给已打开的那一端(不必等下一次检测拍)
	try { await broadcastIfChanged(getSettingsApi, "save"); } catch (error) { /* ignore */ }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:855-914](https://github.com/01Virex/dsh-status-rotator/blob/2458e215cf7e3460854bc191f61a15a8dcd74b6a/lib/index.js#L855-L914)

远端拉取校验、缓存写入和失败保留。

<details>
<summary>查看原文（60行）</summary>

```text
const remoteBankUpdate = { lastCheckAt: 0, lastSuccessAt: 0, updates: 0, lastError: null, inFlight: false };

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
```

</details>

**依据 4 · 源码核查**：[lib/index.js:618-649](https://github.com/01Virex/dsh-status-rotator/blob/2458e215cf7e3460854bc191f61a15a8dcd74b6a/lib/index.js#L618-L649)

请求来源检查不是身份认证。

<details>
<summary>查看原文（32行）</summary>

```text
function originMatchesHost(origin, host) {
	if (!origin) return true;
	try {
		return new URL(origin).host === String(host || "");
	} catch (error) {
		return false;
	}
}

/**
 * 写请求栅栏:
 *   - content-type 必须是 application/json —— 跨域带这个头必然触发预检,
 *     CORS 下预检失败,恶意页面只能发 text/plain 之类的简单请求,直接拒掉;
 *   - sec-fetch-site(浏览器自己带、页面无法伪造)只接受 same-origin / none;
 *   - 带 Origin 时必须同源(非 GET 请求即使同源也会带 Origin)。
 * 残余风险:DNS rebinding 在浏览器视角是 same-origin,拦不住;端口只监听
 * 回环地址时风险可控,若要暴露到局域网,请自行加反向代理鉴权。
 */
function isTrustedWrite(req) {
	const headers = (req && req.headers) || {};
	const type = String(headers["content-type"] || "").toLowerCase();
	if (!type.startsWith("application/json")) return false;
	const site = String(headers["sec-fetch-site"] || "").toLowerCase();
	if (site && site !== "same-origin" && site !== "none") return false;
	return originMatchesHost(headers.origin, headers.host);
}

/** 读请求栅栏:挡掉跨站读取(简单请求即可读,不需要 cookie) */
function isTrustedRead(req) {
	const headers = (req && req.headers) || {};
	if (String(headers["sec-fetch-site"] || "").toLowerCase() === "cross-site") return false;
	return originMatchesHost(headers.origin, headers.host);
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1608-1620](https://github.com/01Virex/dsh-status-rotator/blob/2458e215cf7e3460854bc191f61a15a8dcd74b6a/lib/index.js#L1608-L1620)

Promise队列限定当前模块实例。

<details>
<summary>查看原文（13行）</summary>

```text
 * 否则两个并发请求可以双双通过检查再先后覆盖 —— 那正是要修的那个洞。
 */
let saveTail = Promise.resolve();
function withSaveLock(fn) {
	const run = saveTail.then(fn, fn);
	saveTail = run.then(() => {}, () => {});
	return run;
}

/**
 * SSE 订阅者。
 * 为什么是 SSE 而不是 WebSocket:宿主 webserver 的 register 明确写着 handler
 * 「may hold the response open, e.g. SSE」,而 registerUpgrade 要自己实现 RFC6455 的
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 观察器、主题共存和退出能否保持原界面可用？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

客户端有针对性的状态节点和稳定白名单标记，并保留宿主读屏公告的意图。源码明确说明另一主题若把非自有节点全部隐藏，轮换和计时虽仍继续，新增行仍可能不可见；标记提供合作入口，并不会自动覆盖别人的CSS。因此兼容判断必须覆盖用户实际主题，不能从选择器存在推断共存成功。

定时兜底重扫在页面隐藏时暂停，并优先空闲回调；MutationObserver对已接管行更新图标和阶段。卸载回调拆观察器、计时器、事件流、自己的标题和样式，再释放状态行。这些是降低残留和资源竞争的工程措施，但尚无本轮浏览器执行，不能确认所有宿主重渲染、休眠唤醒和动画组合都复原。长期维护成本主要来自宿主DOM约定，而不是词库数量。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:3007-3043](https://github.com/01Virex/dsh-status-rotator/blob/2458e215cf7e3460854bc191f61a15a8dcd74b6a/lib/client.js#L3007-L3043)

白名单标记及多主题隐藏反例由实现注释明确限定。

<details>
<summary>查看原文（37行）</summary>

```text
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
			 */
			const LINE_MARKER_ATTR = "data-dsh-status-rotator-line";
			/** 观测徽标(重试 / 降级等结构化信号):挂在时钟后面,两代宿主都渲染 */
			const BADGE_CLASS = "dsh-status-rotator-badge";

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
```

</details>

**依据 2 · 源码核查**：[lib/client.js:11160-11222](https://github.com/01Virex/dsh-status-rotator/blob/2458e215cf7e3460854bc191f61a15a8dcd74b6a/lib/client.js#L11160-L11222)

隐藏暂停、空闲重扫与MutationObserver真实接线。

<details>
<summary>查看原文（63行）</summary>

```text
			const pauseRescanTimer = () => {
				if (rescanTimer !== null) { clearTimeout(rescanTimer); rescanTimer = null; }
				if (rescanIdle !== null) {
					if (cancelIdle) { try { cancelIdle(rescanIdle); } catch (error) { /* ignore */ } }
					rescanIdle = null;
				}
			};
			/**
			 * 排下一拍兜底重扫:间隔来自 config.rescanIntervalMs(0 = 不排);
			 * 到点后优先等一次空闲回调再扫,免得和流式渲染抢同一帧。
			 */
			const scheduleRescan = (delay) => {
				pauseRescanTimer();
				const iv = config.rescanIntervalMs > 0 ? config.rescanIntervalMs : 0;
				if (iv === 0) return;
				const wait = typeof delay === "number" && delay >= 0 ? Math.min(delay, iv) : iv;
				rescanTimer = setTimeout(() => {
					rescanTimer = null;
					if (document.visibilityState === "hidden") { pauseRescanTimer(); return; }
					if (idleCallback) {
						rescanIdle = idleCallback(() => {
							rescanIdle = null;
							rescanAll();
							scheduleRescan();
						}, { timeout: Math.max(500, Math.min(iv, 2000)) });
					} else {
						rescanAll();
						scheduleRescan();
					}
				}, wait);
			};
			/** 配置里的间隔变化 / 关闭时同步定时器(与 syncReloadTimer 同一套写法) */
			const syncRescanTimer = () => {
				const iv = config.rescanIntervalMs > 0 ? config.rescanIntervalMs : 0;
				if (iv === 0) { pauseRescanTimer(); activeRescanMs = 0; return; }
				if (activeRescanMs === iv && (rescanTimer !== null || rescanIdle !== null)) return;
				activeRescanMs = iv;
				scheduleRescan();
			};

			const observer = new MutationObserver((records) => {
				// A replaced icon can be deep inside an already-adopted row. Scanning
				// just the added icon misses its ancestor; recover immediately on its row.
				for (const record of records) {
					const target = record.target instanceof Element ? record.target : record.target.parentElement;
					const row = target && target.closest(RUNNING_ROW_SELECTOR);
					if (row && runningLines.has(row)) syncRunningRow(row);
				}
				for (const record of records) {
					// 深浅色主题切换(body[data-ds-dark-theme] 增删)→ 重算渐变 CSS 并刷新已接管元素
					if (record.type === "attributes" && record.attributeName === "data-conversation-session") {
						syncCurrentSession();
						continue;
					}
					if (record.type === "attributes" && record.attributeName === "data-ds-dark-theme") {
						updateStyle();
						for (const el of adopted) if (el.isConnected) { syncGradient(el); syncAppearance(el); }
						continue;
					}
					// 阶段变化:adopted 元素内部结构变化(时钟出现/移除)→ 立即换文案;
					// 自己 wrap 渐变 span 造成的新增要排除(防自我触发循环);
					// 但"span 被移除"(自己 unwrap 或 React 重渲染接管)必须刷新——
					// 否则 React 恢复的初始文案(Deep diving.../深度求索中...)
```

</details>

**依据 3 · 源码核查**：[lib/client.js:12487-12538](https://github.com/01Virex/dsh-status-rotator/blob/2458e215cf7e3460854bc191f61a15a8dcd74b6a/lib/client.js#L12487-L12538)

effect返回卸载清理，覆盖事件和自身DOM资源。

<details>
<summary>查看原文（52行）</summary>

```text
			// dsh 的 ctx.effect 会「立即执行」回调,并把回调的「返回值」当作卸载时的
			// 清理函数注册。因此清理逻辑必须包在返回的函数里,否则 apply 一结束
			// 观察器和定时器就被立刻拆掉,文本替换永远不会生效。
			ctx.effect(() => {
				return () => {
					unsubscribe();
					document.removeEventListener("visibilitychange", onVisibility);
					window.removeEventListener("pageshow", onPageShow);
					document.removeEventListener("pointermove", onDanmakuPointerMove);
					observer.disconnect();
					sourceObserver.disconnect();
					if (truncationObserver !== null) truncationObserver.disconnect();
					if (maskAttributeObserver !== null) maskAttributeObserver.disconnect();
					if (timer !== null) clearInterval(timer);
					pauseRescanTimer();
					if (bootstrapTimer !== null) { clearTimeout(bootstrapTimer); bootstrapTimer = null; }
					if (reloadTimer !== null) clearInterval(reloadTimer);
					closeEventStream();
					if (titleTimer !== null) clearInterval(titleTimer);
					if (titleLiveTimer !== null) clearInterval(titleLiveTimer);
					if (scheduleTimer !== null) clearInterval(scheduleTimer);
					if (liveEngineTimer !== null) clearInterval(liveEngineTimer);
					if (liveSessionUnsub) { try { liveSessionUnsub(); } catch (error) { /* ignore */ } }
					if (liveEventsUnsub) { try { liveEventsUnsub(); } catch (error) { /* ignore */ } }
					liveEventsGeneration++;
					clearPendingToolSwitch(true);
					whaleTailPlaybackByRow.clear();
					toolMotionListeners.clear();
					if (liveListUnsub) { try { liveListUnsub(); } catch (error) { /* ignore */ } }
					if (pendingUnsub) { try { pendingUnsub(); } catch (error) { /* ignore */ } }
					for (const state of typists.values()) {
						if (state.timer !== null) clearInterval(state.timer);
					}
					for (const live of liveTimers.values()) clearInterval(live);
					if (danmakuMaskProbeTimer !== null) {
						clearTimeout(danmakuMaskProbeTimer);
						danmakuMaskProbeTimer = null;
					}
					// 卸载时只交还「我们自己写上去的」标题;没持有过就别碰(见 updateTitle)
					if (titleOwned) {
						titleOwned = false;
						if (origTitle && document.title !== origTitle) document.title = origTitle;
					}
					teardownDanmaku();
					for (const tail of Array.from(whaleTailMotionStates.keys())) stopWhaleTailMotion(tail);
					if (styleEl !== null && styleEl.isConnected) styleEl.remove();
					settingsPage.dispose();
					if (danmakuStyleEl !== null && danmakuStyleEl.isConnected) danmakuStyleEl.remove();
					if (whaleWagStyleEl !== null && whaleWagStyleEl.isConnected) whaleWagStyleEl.remove();
					whaleWagStyleEl = null;
					// 0.1.7 状态行:撤掉插件那行、把折叠头放出来
					for (const line of Array.from(lineButtons.keys())) releaseStatusLine(line);
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么范围值得试用，如何衡量成本和验证替代设计？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

可在独立profile里先只开本地文案，关闭远端词库和动画，保留配置副本；再按需要逐项启用。验收应检查计时、真实阶段、结束清理、刷新后配置和读屏，并与原状态行比较，而不是以“文案好看”代替可用性。若等待信息不可见、配置冲突或卸载后残留，应停用插件、保留配置与错误并回原状态行。它不直接调用模型，但客户端扫描、动画与服务器词库更新仍消耗资源；金额、CPU占用与配置耗时没有测量。

未验证假设是让宿主提供稳定状态插槽和结构化阶段，再由插件只负责呈现，可减少DOM适配负担。当前稳定白名单已经缓解样式合作问题，所以新设计的增量必须是消除节点结构依赖，而不只是再加属性。最小比较在相同宿主和主题矩阵下，对照现有观察器方案与插槽原型，记录错误阶段、隐藏行、帧耗时和维护修改数；若兼容失败不降或宿主耦合代价更高，则不采用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:49-55](https://github.com/01Virex/dsh-status-rotator/blob/2458e215cf7e3460854bc191f61a15a8dcd74b6a/README.md#L49-L55)

安装与宿主适配条件是作者说明。

```text
## Installation

Install from npm through the Desktop plugin manager, or use `dsh plugin add` for Web. Restart the corresponding host after the first install.

### Desktop npm walkthrough

DSH Desktop can install directly from npm without cloning this repository. The screenshots below show **DSH Desktop 0.2.0-rc.2** with a Chinese interface; layouts may differ between host versions.
```

**依据 2 · 源码核查**：[lib/client.js:11160-11198](https://github.com/01Virex/dsh-status-rotator/blob/2458e215cf7e3460854bc191f61a15a8dcd74b6a/lib/client.js#L11160-L11198)

存在实际重扫资源与关闭配置。

<details>
<summary>查看原文（39行）</summary>

```text
			const pauseRescanTimer = () => {
				if (rescanTimer !== null) { clearTimeout(rescanTimer); rescanTimer = null; }
				if (rescanIdle !== null) {
					if (cancelIdle) { try { cancelIdle(rescanIdle); } catch (error) { /* ignore */ } }
					rescanIdle = null;
				}
			};
			/**
			 * 排下一拍兜底重扫:间隔来自 config.rescanIntervalMs(0 = 不排);
			 * 到点后优先等一次空闲回调再扫,免得和流式渲染抢同一帧。
			 */
			const scheduleRescan = (delay) => {
				pauseRescanTimer();
				const iv = config.rescanIntervalMs > 0 ? config.rescanIntervalMs : 0;
				if (iv === 0) return;
				const wait = typeof delay === "number" && delay >= 0 ? Math.min(delay, iv) : iv;
				rescanTimer = setTimeout(() => {
					rescanTimer = null;
					if (document.visibilityState === "hidden") { pauseRescanTimer(); return; }
					if (idleCallback) {
						rescanIdle = idleCallback(() => {
							rescanIdle = null;
							rescanAll();
							scheduleRescan();
						}, { timeout: Math.max(500, Math.min(iv, 2000)) });
					} else {
						rescanAll();
						scheduleRescan();
					}
				}, wait);
			};
			/** 配置里的间隔变化 / 关闭时同步定时器(与 syncReloadTimer 同一套写法) */
			const syncRescanTimer = () => {
				const iv = config.rescanIntervalMs > 0 ? config.rescanIntervalMs : 0;
				if (iv === 0) { pauseRescanTimer(); activeRescanMs = 0; return; }
				if (activeRescanMs === iv && (rescanTimer !== null || rescanIdle !== null)) return;
				activeRescanMs = iv;
				scheduleRescan();
			};
```

</details>

**依据 3 · 源码核查**：[lib/client.js:3007-3043](https://github.com/01Virex/dsh-status-rotator/blob/2458e215cf7e3460854bc191f61a15a8dcd74b6a/lib/client.js#L3007-L3043)

插槽假设基于明确DOM约定和现有白名单边界。

<details>
<summary>查看原文（37行）</summary>

```text
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
			 */
			const LINE_MARKER_ATTR = "data-dsh-status-rotator-line";
			/** 观测徽标(重试 / 降级等结构化信号):挂在时钟后面,两代宿主都渲染 */
			const BADGE_CLASS = "dsh-status-rotator-badge";

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
```

</details>

#### 缺口

- 缺少原状态行同任务资源和使用体验对照。
  **影响**：不能认定资源开销轻或等待体验改善。
  **进一步探讨**：记录相同会话的帧耗时、CPU、可读性反馈和全部设置时间。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
