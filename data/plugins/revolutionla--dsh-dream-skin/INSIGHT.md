# DSH Dream Skin

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f4455b7](https://github.com/RevolutionLA/dsh-dream-skin/tree/f4455b7d1d12f593929783bbd81237a048416161)

<!-- BEGIN META -->
[![GitHub ★ 293](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=293&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/RevolutionLA/dsh-dream-skin) [![npm 30d 39,105](https://img.shields.io/static/v1?label=npm+30d&message=39%2C105&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dream-skin) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dream-skin)
<!-- END META -->

> **功能**：原生 Web 主题、壁纸和主题包定制，配 Host 状态文件支持跨浏览器 origin 保存。

> **亮点**：把视觉配置、分享和跨origin状态接入原生theme契约；审美/可读性和节时仍需真实屏幕判断。见[Q01](#research-q01)。

> **主要限制**：当页改色不等于Host保存：push未检HTTP/JSON成功；Host fixed tmp加direct-write fallback不是跨进程原子事务；token之外仍有DOM材质hook。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 真实入口和用户价值相对内置主题是什么？](#detail-section-11)
  - [Q02 · 持久化、主题导入和壁纸有哪些机制/失败边界？](#detail-section-12)
  - [Q03 · 依赖、生命周期、宿主兼容维护如何？](#detail-section-13)
  - [Q04 · 成本、验收建议和可验证方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望定制DSH本地Web/兼容桌面外观的用户；主要产物是视觉偏好，不改变模型任务能力。见[Q01](#research-q01)。

内置system/light/dark与其它主题；本项目增加可组合预设、壁纸、包分享和持久化渠道。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件与边界 |
|---|---|---|
| 预设/覆盖层 | 调整配色材质 | 真实可读性/性能需验 |
| Host状态 | 跨origin恢复 | 当页变化不证明保存，非多进程事务 |
| 主题包分享 | 校验manifest并hash分发 | 格式合法不等于视觉质量 |
| 文件夹壁纸 | 受限图片列表/读取 | 信任fence非账号认证，个人副本另管 |

**流程与依赖**

Web主题/设置契约、Host可写目录与图形环境；素材出网/副本按选择另核；表见[Q04](#research-q04)。

记录原偏好，预设小样检查可读性，再重启验证保存，退回内置及检查残留；步骤见[Q04](#research-q04)。

**效果与成本**

无必需外部账号，图形/素材、调参、兼容和恢复成本未知；阶段表见[Q04](#research-q04)。

视觉配置/分享有实现，不保证普适审美、无性能代价或省时间；效果见[Q04](#research-q04)。

> **思考**：当页改色不等于Host保存：push未检HTTP/JSON成功；Host fixed tmp加direct-write fallback不是跨进程原子事务；token之外仍有DOM材质hook。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把视觉配置、分享和跨origin状态接入原生theme契约；审美/可读性和节时仍需真实屏幕判断。见[Q01](#research-q01)。

覆盖层、工厂种子与用户状态区分、page owner代际清理可迁移；HTTP回执缺口、并发文件和宿主DOM回归仍是维护面。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

当页改色不等于Host保存：push未检HTTP/JSON成功；Host fixed tmp加direct-write fallback不是跨进程原子事务；token之外仍有DOM材质hook。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

明确需要外观定制的本地Web用户可先用内置预设和非私人渐变试用，核对正文/菜单/信号色及重启保存；难读、卡顿或状态不一致时切回内置停用，个人素材副本另管。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

注册、保存、校验与代际清理有源码依据；未做目标视觉、性能、保存恢复或HMR运行。限本地非私人背景试用，回执假设未实现。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、cordis.patch.yml、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查Host状态/trust/API/文件夹关键链、client注册/持久化/包校验分享/URL门/代际清理；未通读全部一万行主题数据和审计脚本，不执行目标或视觉测试。
- 下一步：在固定宿主同窗口内容对比内置/目标外观；模拟保存500、重启换origin和主题冲突/HMR，再读回状态与残留。

**分析版本**

- **仓库**：[RevolutionLA/dsh-dream-skin](https://github.com/RevolutionLA/dsh-dream-skin)
- **版本号**：10.29.0（[固定提交 f4455b7](https://github.com/RevolutionLA/dsh-dream-skin/tree/f4455b7d1d12f593929783bbd81237a048416161)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是区分已应用/已缓存/Host确认的设置回执，用403/500与换origin重启比较误判保存和恢复时间；轻量响应检查足够则不扩大平台。见[Q04](#research-q04)。

在固定宿主同窗口内容对比内置/目标外观；模拟保存500、重启换origin和主题冲突/HMR，再读回状态与残留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 32 | 8925 | — | — | 289283 |
| .js | source | 2 | 11054 | 6895 | 3922 | — |
| .cjs | source | 28 | 10196 | 6646 | 3090 | — |
| .mjs | source | 3 | 496 | 357 | 95 | — |
| .cjs | test | 39 | 21780 | 15225 | 5297 | — |
| .cjs | example | 2 | 395 | 267 | 116 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/RevolutionLA/dsh-dream-skin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 52](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=52&color=737b86&logo=github)](https://github.com/RevolutionLA/dsh-dream-skin/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)

暂未获取：近30天关闭。

统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：外观与持久化的真实作用、失败回执及宿主兼容边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 真实入口和用户价值相对内置主题是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是原生Web侧换肤插件，同时有Host持久化API；不是模型工具或独立Agent。Host apply注册/dream-skin/api，client apply通过ctx.theme.register注册预设，提供主题/强调色/壁纸/导入包与设置UI。根bundle加载Host、客户端有明确theme/settings/runtime依赖，真实entry_type为plugin。

目标是长时间使用DSH Web或兼容桌面壳，希望有可调整配色、材质与背景的用户。基线是内置system/light/dark主题或其它主题插件。贡献是多个预设加overrideTokens叠加、主题包分享与本地库，以及不依赖固定浏览器origin的Host状态。不是推理能力、业务正确率或省Token插件。

“清透/高级/更安静”是作者审美主张，源码证明可配置界面，不证明所有用户舒适或生产率提升。README的预览和质量门数量也不能代替本轮实际屏幕上的文字可读性、信号色区别、性能与长期视觉疲劳验收。定向源码还看到material/nav/composer等DOM和样式hook，因此README“无注入”宜理解为不用CDP修改安装包，不能解释为完全不创建样式/DOM或永不受宿主变化影响。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:612-644](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/index.js#L612-L644)

真实Host注册。

<details>
<summary>查看原文（33行）</summary>

```text
 * Host loader entry: mount the fenced persistence API.
 * @param ctx - host cordis context (webServer, optionally webRuntime / webStartup).
 */
export function apply(ctx) {
	ctx.effect(() => ctx.webServer.register({
		kind: "prefix",
		path: API_PREFIX,
		handler: async (req, res) => {
			const hosts = trustedAuthorities(ctx);
			if (!isTrustedApiRequest(req, hosts)) {
				writeJson(res, 403, { ok: false, error: { code: "forbidden", message: "forbidden" } });
				return;
			}
			try {
				// The one GET route: an image of the wallpaper folder. Every other
				// request keeps the POST + JSON rules of handleApi.
				if (req.method === "GET" && typeof req.url === "string") {
					const url = new URL(req.url, "http://localhost");
					if (url.pathname === FOLDER_FILE_PATH) {
						await serveFolderImage(res, url);
						return;
					}
				}
				await handleApi(req, res);
			} catch (error) {
				// Do not echo the internal error back to the browser — the
				// trusted-origin page does not need filesystem paths etc.
				console.error("[dsh-dream-skin] persistence API error:", error);
				writeJson(res, 500, { ok: false, error: { code: "internal", message: "internal error" } });
			}
		}
	}), "dsh-dream-skin: persistence API routes");
}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:9026-9079](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/client.js#L9026-L9079)

主题注册、材质与导航hook。

<details>
<summary>查看原文（54行）</summary>

```text
		function apply(ctx) {
			// Claim the page BEFORE anything is installed, so the cleanup effect below always
			// carries a number at least as fresh as the residue it might be about to remove.
			const owner = claimPageOwner();
			ctx.effect(() => () => {
				if (holdsPageOwner(owner) && wallpaperPreviewCleanup) wallpaperPreviewCleanup();
			}, "dsh-dream-skin: wallpaper preview");
			// Boot diagnostics snapshot first, before anything can fail: host/desktop
			// tooling always finds `window.__DSH_DREAM_SKIN_STATUS__` once apply ran
			// (the drift probe later fills in `anchors`; skin switches refresh it).
			publishStatus();
			// Register the curated skins, YIELDING on an id collision instead of
			// throwing (blue-team R19). The host's ThemeRuntime.register throws on a
			// duplicate id (`theme "x" is already registered`), and our ids are
			// common words (mist, rose, ember, ivory…) that a third-party theme
			// plugin can plausibly take first. This call is NOT covered by the
			// factory-level dumb-module fallback (that only guards seed resolution),
			// so an unguarded throw here would escape apply(). Yielding degrades the
			// worst case to "one skin missing" — and the user still keeps their own
			// selection, since we only skip registration.
			const takenThemeIds = new Set(
				((ctx.theme.getTheme() || {}).themes || []).map((themeDefinition) => themeDefinition && themeDefinition.id)
			);
			const disposers = [];
			for (const skinDefinition of SKINS) {
				if (takenThemeIds.has(skinDefinition.id)) {
					try { console.warn(`[dsh-dream-skin] skin id "${skinDefinition.id}" is already registered by another plugin — skipping it`); } catch {}
					continue;
				}
				try {
					disposers.push(ctx.theme.register(skinDefinition));
				} catch (err) {
					// Defensive: a host that throws for another reason must not take
					// down the whole shell either.
					try { console.warn(`[dsh-dream-skin] could not register skin "${skinDefinition.id}":`, err && err.message); } catch {}
				}
			}
			ctx.effect(() => () => {
				for (const dispose of disposers) dispose();
			}, "dsh-dream-skin: theme registration");

			// Give DSH's leaf cards (composer, inline warnings, small popovers) a
			// premium liquid-glass material. Safe: these are not ancestors of any
			// fixed dialog, so it cannot re-trigger the settings-modal trapping bug.
			ensureMaterialStyle(ctx);
			// Issue #110: publish the low-power switch before the first wallpaper
			// render, so a restart does not paint one blurred frame first.
			applyPerformanceMode();

			// T9: claim the page-scope nav-icon hook for THIS generation of the
			// fiber. `navGeneration` is an identity token, not a value — teardown
			// hands the same token back to disposeNavHook. See armNavHook /
			// disposeNavHook above and the generation note in the nav IIFE.
			const navGeneration = {};
```

</details>

**依据 3 · 源码核查**：[package.json:80-104](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/package.json#L80-L104)

client/bundle依赖声明。

<details>
<summary>查看原文（25行）</summary>

```text
	"dsh": {
		"bundle": {
			"patch": "./cordis.patch.yml"
		},
		"client": {
			"inject": [
				"@deepseek-ai/dsh-client-runtime",
				"@deepseek-ai/dsh-client-locale",
				"@deepseek-ai/dsh-client-ui-theme",
				"@deepseek-ai/dsh-client-ui-settings",
				"@deepseek-ai/dsh-client-ui-settings-general"
			],
			"platform": "web",
			"immediately": true
		}
	},
	"peerDependencies": {
		"@deepseek-ai/cordis": "^4.0.1 || >=4.0.5-0 <5",
		"@deepseek-ai/dsh-client-locale": ">=0.1.0-rc.6 <0.3.0-0",
		"@deepseek-ai/dsh-client-runtime": ">=0.1.0-rc.6 <0.3.0-0",
		"@deepseek-ai/dsh-client-store": ">=0.1.0-rc.6 <0.3.0-0",
		"@deepseek-ai/dsh-client-ui-settings": ">=0.1.0-rc.6 <0.3.0-0",
		"@deepseek-ai/dsh-client-ui-settings-general": ">=0.1.0-rc.6 <0.3.0-0",
		"@deepseek-ai/dsh-client-ui-theme": ">=0.1.0-rc.6 <0.3.0-0",
		"react": "^18.2.0"
```

</details>

**依据 4 · 源码核查**：[README.md:11-20](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/README.md#L11-L20)

作者审美与纯原生主张。

<details>
<summary>查看原文（10行）</summary>

```text

原生换肤 · 背景壁纸 · 强调色 · 主题包 —— 一条 `--dsw-*` token 生态内的优雅实现。装一次，用很久。

> **写代码的地方，可以很安静。**

| 🎨 8 套原创主题 | 🖼️ 壁纸 + 弥散光 | 🎯 克制的强调色 | 📦 主题包可分享 |
|---|---|---|---|

> 1 行安装 · 纯原生（无注入/不改安装包）· 不因 DSH 更新失效

```

</details>

#### 缺口

- 未在目标浏览器/壳实际比较可读性与帧率
  **影响**：不能承诺更高效或全版本兼容
  **进一步探讨**：同一窗口/字体/内容对比内置与目标主题，检查错误/选中/代码等状态。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 持久化、主题导入和壁纸有哪些机制/失败边界？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

浏览器先cache/localStorage着色，再向Host读权威状态；写入先立即更新cache/localStorage，200ms合并推送，factory种子不推送。Host状态在DSH_HOME/dream-skin.json，API对字符串/null patch读当前文件再merge，不带的键保留。这样跨origin有稳定落盘渠道，但不等于跨进程事务：文件用固定.tmp、同步read-modify-write，没有锁/CAS；rename失败fallback直接write会失去原子替换属性，两个Host共享同文件仍可能竞争。本轮没有并发/断电复现，不报告实际丢失概率。

更直接的结果边界在pushStateToHost：await fetch后未检查response.ok或JSON ok，网络失败catch吞下。界面和localStorage可以更新，但HTTP500/403不会使此函数报告持久化失败；换origin重启后仍可能恢复Host旧值。故“立即看到新皮肤”和“跨端保存成功”应分开验收，flushStateToHost只await这个函数，不能独立证明落盘。

主题包validate检查格式/version/id、light/dark、必需颜色token等，导入先register成功再入库；分享把manifest编码入URL hash并限制解码大小，不是上传到主题托管服务器。分享hash仍可能随链接、历史或复制传播，用户不应把私人信息写入manifest。导入成功不等于真实屏幕对比度通过，颜色合法与可读性是两类条件。

壁纸可用本地数据、http(s)/data:image或渐变。URL方案校验不是可信来源保证，远端图仍会由浏览器请求；个人本地图可持久到Host状态，文件夹路径从持久设置取值，GET只接受有限相对图像路径并检查中间目录。API的loopback/trustedHost及same-origin标记是跨站防护，源码注释也明确不是认证：无Origin的可信Host请求可通过。不能据此将它部署成多用户公网图片服务或承诺账号隔离。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1937-1991](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/client.js#L1937-L1991)

推送门、writtenKeys/factory和fetch不检HTTP成功。

<details>
<summary>查看原文（55行）</summary>

```text
		 */
		let hostProbeSettled = false;
		let pendingHostSync = false;
		/** Debounce timer for host pushes. */
		let hostSyncTimer = null;
		/** Callback invoked after the host state is applied (set by apply). */
		let onHostReady = null;

		/** Schedule a debounced push of the USER state to the host. */
		function scheduleHostSync() {
			if (!hostProbeSettled) {
				// Boot probe in flight: stash the request, the settled handler
				// pushes once with the merged state.
				pendingHostSync = true;
				return;
			}
			if (hostSyncTimer !== null) return;
			hostSyncTimer = setTimeout(() => {
				hostSyncTimer = null;
				pushStateToHost();
			}, 200);
		}

		/** Push the USER state (factory provenance stripped) to the host file. */
		async function pushStateToHost() {
			const patch = {};
			for (const [key, value] of stateCache) {
				// Only keys actually WRITTEN this session may go out. A read caches
				// absent keys as null (readStorage); pushing those nulls would ERASE
				// the user's durable accent/packs/favorites/history on the host the
				// moment any late write flushes after a slow/failed probe
				// (post-release review 🟠-2). A deliberate user clear goes through
				// writeStorage(key, null) and IS in writtenKeys — still pushed.
				if (!writtenKeys.has(key)) continue;
				// Factory seeds and the provenance bookkeeping are never the
				// user's config — pushing them would bake the shipped look into
				// dream-skin.json (blue-team B1/A1) or leak internals.
				if (isFactorySeededValue(key, value)) continue;
				if (key === FACTORY_APPLIED_KEY || key === FACTORY_SNAPSHOT_KEY) continue;
				patch[key] = value;
			}
			// Nothing user-owned to persist (pure factory boot): skip the
			// round-trip entirely instead of pushing an empty/seed-only patch.
			if (Object.keys(patch).length === 0) return;
			try {
				await fetch(HOST_API, {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ method: "set", patch })
				});
			} catch {
				// host unavailable — the cache + localStorage still hold the values
			}
		}

```

</details>

**依据 2 · 源码核查**：[lib/client.js:2346-2370](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/client.js#L2346-L2370)

先本地后Host。

<details>
<summary>查看原文（25行）</summary>

```text
		/** Write (or remove with null) a value: cache + localStorage now, host later. */		function writeStorage(key, value, opts = {}) {
			stateCache.set(key, value);
			writtenKeys.add(key);
			// Factory seeds are provisional (blue-team B1): tagged so the boot
			// host-probe can outrank them; any later user write unseals the key
			// and clears the persistent provenance (the user owns it now).
			if (opts.factory) {
				factorySealed.add(key);
				// Track provenance durably (blue-team T1): the value must still be
				// recognizable as factory-seeded after a same-origin reload, where
				// the session seal set is gone.
				factorySnapshot.set(key, value);
				saveFactorySnapshot();
			} else {
				factorySealed.delete(key);
				removeFactoryProvenance(key);
			}
			localWrite(key, value);
			// Factory seeding must NEVER schedule a host push (blue-team A1):
			// the shipped look is first-paint sugar, not user config — pushing
			// it would bake it into dream-skin.json (and pendingHostSync would
			// flush it right after the boot probe settles).
			if (opts.factory) return;
			scheduleHostSync();
		}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:139-163](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/index.js#L139-L163)

状态路径和损坏读空。

<details>
<summary>查看原文（25行）</summary>

```text
function statePath() {
	const home = process.env.DSH_HOME && process.env.DSH_HOME.length > 0 ? process.env.DSH_HOME : join(homedir(), ".dsh");
	return join(home, STATE_FILENAME);
}

/** Read the state object; `{}` when absent or corrupt. */
function readState() {
	const state = readStateFile();
	delete state[STATE_SCHEMA_KEY];
	return state;
}

/**
 * Read the state file as bytes on disk, metadata key included. `{}` when the
 * file is absent or unparsable — a corrupt file is treated as empty, which is
 * how this plugin has always behaved (the browser half still holds the values
 * in localStorage and re-pushes them).
 */
function readStateFile() {
	try {
		const parsed = JSON.parse(readFileSync(statePath(), "utf8"));
		return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
	} catch {
		return {};
	}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:189-207](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/index.js#L189-L207)

固定tmp和direct-write fallback。

<details>
<summary>查看原文（19行）</summary>

```text
function writeState(state) {
	const file = statePath();
	mkdirSync(dirname(file), { recursive: true });
	const tmp = `${file}.tmp`;
	// The reserved key is re-stamped last and wins over `state`, so no caller
	// can persist a forged schema through the settings map. Values stay strings:
	// an older build reading this file String()s anything nested into a setting.
	const body = JSON.stringify({ ...state, [STATE_SCHEMA_KEY]: schemaStampFor(readStateFile()) });
	// The state file holds the user's wallpaper data URLs (personal images),
	// so keep it owner-only on POSIX (mode is ignored on Windows).
	writeFileSync(tmp, body, { encoding: "utf8", mode: 0o600 });
	try {
		renameSync(tmp, file);
	} catch {
		// rename can fail on Windows if the target is transiently locked; a
		// direct write is a safe fallback for this single-process case.
		writeFileSync(file, body, { encoding: "utf8", mode: 0o600 });
	}
}
```

</details>

**依据 5 · 源码核查**：[lib/index.js:581-606](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/index.js#L581-L606)

patch merge。

<details>
<summary>查看原文（26行）</summary>

```text
		const patch = payload.patch;
		if (patch === null || typeof patch !== "object" || Array.isArray(patch)) {
			writeJson(res, 400, { ok: false, error: { code: "bad-request", message: "patch must be a plain object" } });
			return;
		}
		// Merge into the current state. Only the keys present in `patch` are
		// touched: a string value sets it, null removes it, and keys not in the
		// patch are left untouched. This makes concurrent writers (e.g. two
		// browser tabs, each with its own in-memory cache) safe — a tab that
		// changed the accent won't wipe the wallpaper another tab just set.
		// Only string / null values are accepted, so a compromised page cannot
		// smuggle non-JSON types into the file.
		const next = readState();
		for (const [key, value] of Object.entries(patch)) {
			if (typeof key !== "string") continue;
			// No special case for STATE_SCHEMA_KEY here on purpose. writeState
			// re-derives the stamp FROM THE FILE and applies it after spreading
			// `state`, so a patch that tries to forge it is overwritten rather
			// than filtered — one authority instead of a guard that could never
			// be shown to matter. The forge test pins that ordering.
			if (value === null) delete next[key];
			else if (typeof value === "string") next[key] = value;
		}
		writeState(next);
		writeJson(res, 200, { ok: true });
		return;
```

</details>

**依据 6 · 源码核查**：[lib/client.js:6392-6444](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/client.js#L6392-L6444)

包校验与合法颜色。

<details>
<summary>查看原文（53行）</summary>

```text
		function validatePack(data) {
			if (typeof data !== "object" || data === null) return { ok: false, errors: ["not an object"] };
			if (data.format !== PACK_FORMAT) return { ok: false, errors: [`format must be "${PACK_FORMAT}"`] };
			if (data.version !== PACK_VERSION) return { ok: false, errors: [`unsupported pack version ${data.version}`] };
			const manifest = data.manifest;
			if (typeof manifest !== "object" || manifest === null) return { ok: false, errors: ["missing manifest"] };
			if (typeof manifest.id !== "string" || !manifest.id.trim()) return { ok: false, errors: ["manifest.id is required"] };
			const id = PACK_ID_PREFIX + manifest.id;
			// Reserved-name check must run on the UNPREFIXED manifest id: with the
			// prefix prepended this comparison could never be true (a check that
			// looks like a defense but never fires).
			if (manifest.id === "system" || manifest.id === "light" || manifest.id === "dark") return { ok: false, errors: [`"${manifest.id}" collides with a reserved id`] };
			if (typeof manifest.name !== "string" || !manifest.name.trim()) return { ok: false, errors: ["manifest.name is required"] };
			if (manifest.colorScheme !== "light" && manifest.colorScheme !== "dark") return { ok: false, errors: [`colorScheme must be light|dark, got ${manifest.colorScheme}`] };
			if (typeof manifest.tokens !== "object" || manifest.tokens === null) return { ok: false, errors: ["manifest.tokens is required"] };
			const tokens = {};
			const errors = [];
			for (const name of PACK_REQUIRED_TOKENS) {
				const value = manifest.tokens[name];
				if (typeof value !== "string" || !looksLikeColor(value)) errors.push(`token ${name} is missing or not a color`);
				else tokens[name] = value;
			}
			// Copy the remaining user-supplied tokens (already owned/validated colors).
			for (const [name, value] of Object.entries(manifest.tokens)) {
				if (!(name in tokens) && typeof value === "string" && looksLikeColor(value)) tokens[name] = value;
			}
			const accent = manifest.accent ? normalizeHex(manifest.accent) : null;
			const pack = {
				format: PACK_FORMAT,
				version: PACK_VERSION,
				manifest: {
					id: manifest.id,
					name: manifest.name,
					nameZh: typeof manifest.nameZh === "string" ? manifest.nameZh : undefined,
					author: typeof manifest.author === "string" ? manifest.author : "anonymous",
					version: typeof manifest.version === "string" ? manifest.version : "1.0.0",
					description: typeof manifest.description === "string" ? manifest.description : "",
					colorScheme: manifest.colorScheme,
					tokens,
					accent
				}
			};
			if (errors.length) return { ok: false, errors };
			return { ok: true, id, pack };
		}

		/** Turn a validated pack manifest into a ThemeRegistration for the runtime. */
		function packToRegistration(pack) {
			return Object.freeze({
				id: PACK_ID_PREFIX + pack.manifest.id,
				colorScheme: pack.manifest.colorScheme,
				tokens: { ...pack.manifest.tokens }
			});
```

</details>

**依据 7 · 源码核查**：[lib/client.js:6496-6511](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/client.js#L6496-L6511)

register后入库。

<details>
<summary>查看原文（16行）</summary>

```text
		function importPack(ctx, result) {
			const { id, pack } = result;
			if (findPack(id)) return { ok: false, error: "a pack with this id is already imported" };
			const registration = packToRegistration(pack);
			try {
				applyPackToTheme(ctx, id, registration);
			} catch (e) {
				return { ok: false, error: "register failed: " + (e && e.message ? e.message : String(e)) };
			}
			const record = { id, manifest: pack.manifest };
			importedPacks.push({ ...record, registration });
			const packs = readPacks();
			packs.push({ id, manifest: pack.manifest });
			writePacks(packs);
			return { ok: true, id, name: pack.manifest.name, colorScheme: pack.manifest.colorScheme };
		}
```

</details>

**依据 8 · 源码核查**：[lib/client.js:6634-6657](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/client.js#L6634-L6657)

hash分享与大小检查。

<details>
<summary>查看原文（24行）</summary>

```text
			}
			return window.location.origin + window.location.pathname + "#dream-skin-pack=" + encoded;
		}

		/** Decode a shared pack from a URL hash; null when absent/invalid. */
		function decodeShareUrl(hash) {
			const prefix = "#dream-skin-pack=";
			const idx = hash ? hash.indexOf(prefix) : -1;
			if (idx === -1) return null;
			const raw = hash.slice(idx + prefix.length);
			if (!raw) return null;
			// Boot-path size gate (mirrors the file import's PACK_MAX_BYTES): a
			// pathological/malicious link must not run a giant base64+JSON.parse
			// synchronously during apply().
			if (raw.length > PACK_MAX_BYTES) return null;
			try {
				const json = decodeBase64Utf8(raw);
				const data = JSON.parse(json);
				const validate = validatePack(data);
				return validate.ok ? { id: validate.id, pack: validate.pack } : null;
			} catch {
				return null;
			}
		}
```

</details>

**依据 9 · 源码核查**：[lib/client.js:7022-7035](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/client.js#L7022-L7035)

壁纸URL方案。

<details>
<summary>查看原文（14行）</summary>

```text
		 * are allowed (http/https/data:image); javascript:, file:, vbscript: and
		 * friends are refused. Control characters (which would silently corrupt
		 * the CSS value) are rejected too. Quotes/backslashes are fine here —
		 * they are escaped later when the value is embedded into a CSS url().
		 */
		function isSafeWallpaperUrl(value) {
			if (typeof value !== "string" || value.trim().length < 5) return false;
			if (/[\u0000-\u001f\u007f]/.test(value)) return false;
			return /^(https?:|data:image\/)/i.test(value.trim());
		}

		/** Escape a wallpaper URL for embedding inside url("...") in a CSS value. */
		function cssUrlValue(value) {
			return value.replace(/[\\"]/g, (ch) => (ch === "\\" ? "\\\\" : "\\\""));
```

</details>

**依据 10 · 源码核查**：[lib/index.js:268-282](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/index.js#L268-L282)

trust fence不是用户认证。

<details>
<summary>查看原文（15行）</summary>

```text
function isTrustedApiRequest(req, trustedHosts) {
	const host = typeof req.headers.host === "string" ? req.headers.host : undefined;
	if (host === undefined) return false;
	const hostUrl = parseAuthority(host);
	if (hostUrl === undefined) return false;
	if (!isLoopbackHostname(hostUrl.hostname) && !isTrustedAuthority(hostUrl, trustedHosts)) return false;
	if (req.headers["sec-fetch-site"] === "cross-site") return false;
	const origin = req.headers.origin;
	if (origin === undefined) return true;
	try {
		return new URL(origin).host === hostUrl.host;
	} catch {
		return false;
	}
}
```

</details>

**依据 11 · 源码核查**：[lib/index.js:473-512](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/index.js#L473-L512)

文件夹相对路径及目录检查。

<details>
<summary>查看原文（40行）</summary>

```text
async function serveFolderImage(res, url) {
	const refuse = (status) => {
		res.writeHead(status, { "cache-control": "no-store" });
		res.end();
	};
	const name = url.searchParams.get("name");
	// A relative path of plain names: no backslashes, control characters, hidden segments or "..".
	const segments = folderPathSegments(name);
	if (segments === null) {
		refuse(404);
		return;
	}
	const type = FOLDER_IMAGE_TYPES.get(extname(name).toLowerCase());
	if (type === undefined) {
		refuse(404);
		return;
	}
	let root;
	try {
		root = await resolveFolder();
	} catch {
		refuse(404);
		return;
	}
	// `root` is a real path and every segment a plain name. lstat does not follow
	// links, so each directory on the way must itself be a real directory — a
	// symlinked subfolder (to anywhere) is refused exactly as the listing skips it.
	let dir = root;
	for (const segment of segments.slice(0, -1)) {
		dir = join(dir, segment);
		let dirStat;
		try {
			dirStat = await lstat(dir);
		} catch {
			refuse(404);
			return;
		}
		if (!dirStat.isDirectory()) {
			refuse(404);
			return;
```

</details>

#### 缺口

- 跨origin重启、两Host写竞争及失败保存未运行
  **影响**：不能保证恢复正确或静默失败发生频率
  **进一步探讨**：先用无私人壁纸改设置，模拟403/500并换origin回读；并发要独立目录验证。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、生命周期、宿主兼容维护如何？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

运行需宿主Web theme/settings/locale/runtime服务及Host webServer，设置持久化另需DSH_HOME可写；TUI不在当前client platform范围。optional peer声明用于包安装兼容，不等于缺少这些运行时服务仍有完整UI。桌面壳若沿用这些Web契约有路径可接，但不是所有Electron壳都保证等价。

主题id冲突时跳过并警告而不让整个apply抛错；因此可能只出现部分主题，不能拿预期八套当实际注册清单。client用ctx.effect注册theme disposer，并给页面状态claimPageOwner/generation，旧fiber卸载不应删新fiber共享样式；最新owner清理wallpaper/material/nav/pack/token override等。是有针对热重载残留的设计，不是本轮HMR实测。

卸载/切默认可撤部分运行时样式与主题注册，但Host dream-skin.json和localStorage仍在，个人壁纸、folder路径、导入库并不会自动删除。文件损坏读取成空，没有在本段发现保存前备份；要迁移或彻底退出应先导出/备份所需配置再处理副本。远程壁纸请求也不因偏好恢复而撤销。

可借鉴的是原生theme服务加覆盖层、配置版本戳保留更高版本、初始cache与持久层区分、按页面代际清理；迁移前提是宿主token消费和DOM语义匹配。大量材质、nav与composer hooks使维护仍需宿主回归，不能把“原生token”泛化为所有未来更新不失效。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:80-104](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/package.json#L80-L104)

运行时client及peer依赖。

<details>
<summary>查看原文（25行）</summary>

```text
	"dsh": {
		"bundle": {
			"patch": "./cordis.patch.yml"
		},
		"client": {
			"inject": [
				"@deepseek-ai/dsh-client-runtime",
				"@deepseek-ai/dsh-client-locale",
				"@deepseek-ai/dsh-client-ui-theme",
				"@deepseek-ai/dsh-client-ui-settings",
				"@deepseek-ai/dsh-client-ui-settings-general"
			],
			"platform": "web",
			"immediately": true
		}
	},
	"peerDependencies": {
		"@deepseek-ai/cordis": "^4.0.1 || >=4.0.5-0 <5",
		"@deepseek-ai/dsh-client-locale": ">=0.1.0-rc.6 <0.3.0-0",
		"@deepseek-ai/dsh-client-runtime": ">=0.1.0-rc.6 <0.3.0-0",
		"@deepseek-ai/dsh-client-store": ">=0.1.0-rc.6 <0.3.0-0",
		"@deepseek-ai/dsh-client-ui-settings": ">=0.1.0-rc.6 <0.3.0-0",
		"@deepseek-ai/dsh-client-ui-settings-general": ">=0.1.0-rc.6 <0.3.0-0",
		"@deepseek-ai/dsh-client-ui-theme": ">=0.1.0-rc.6 <0.3.0-0",
		"react": "^18.2.0"
```

</details>

**依据 2 · 源码核查**：[lib/client.js:9026-9065](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/client.js#L9026-L9065)

冲突跳过和disposer。

<details>
<summary>查看原文（40行）</summary>

```text
		function apply(ctx) {
			// Claim the page BEFORE anything is installed, so the cleanup effect below always
			// carries a number at least as fresh as the residue it might be about to remove.
			const owner = claimPageOwner();
			ctx.effect(() => () => {
				if (holdsPageOwner(owner) && wallpaperPreviewCleanup) wallpaperPreviewCleanup();
			}, "dsh-dream-skin: wallpaper preview");
			// Boot diagnostics snapshot first, before anything can fail: host/desktop
			// tooling always finds `window.__DSH_DREAM_SKIN_STATUS__` once apply ran
			// (the drift probe later fills in `anchors`; skin switches refresh it).
			publishStatus();
			// Register the curated skins, YIELDING on an id collision instead of
			// throwing (blue-team R19). The host's ThemeRuntime.register throws on a
			// duplicate id (`theme "x" is already registered`), and our ids are
			// common words (mist, rose, ember, ivory…) that a third-party theme
			// plugin can plausibly take first. This call is NOT covered by the
			// factory-level dumb-module fallback (that only guards seed resolution),
			// so an unguarded throw here would escape apply(). Yielding degrades the
			// worst case to "one skin missing" — and the user still keeps their own
			// selection, since we only skip registration.
			const takenThemeIds = new Set(
				((ctx.theme.getTheme() || {}).themes || []).map((themeDefinition) => themeDefinition && themeDefinition.id)
			);
			const disposers = [];
			for (const skinDefinition of SKINS) {
				if (takenThemeIds.has(skinDefinition.id)) {
					try { console.warn(`[dsh-dream-skin] skin id "${skinDefinition.id}" is already registered by another plugin — skipping it`); } catch {}
					continue;
				}
				try {
					disposers.push(ctx.theme.register(skinDefinition));
				} catch (err) {
					// Defensive: a host that throws for another reason must not take
					// down the whole shell either.
					try { console.warn(`[dsh-dream-skin] could not register skin "${skinDefinition.id}":`, err && err.message); } catch {}
				}
			}
			ctx.effect(() => () => {
				for (const dispose of disposers) dispose();
			}, "dsh-dream-skin: theme registration");
```

</details>

**依据 3 · 源码核查**：[lib/client.js:9231-9265](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/client.js#L9231-L9265)

owner代际清理。

<details>
<summary>查看原文（35行）</summary>

```text
			// here we only create the store — the persisted wallpaper itself was
			// already applied by restorePersistedState() above.
			const wallpaperStore = createWallpaperStore();
			ctx.effect(() => () => {
				// B9 / T5 (adversarial review 10.6.1, deferred then): a hot reload can unload the
				// OLD fiber AFTER the new one applied. Everything below is module-scope state that
				// the new generation is actively using, so an old generation must not touch any
				// of it — same lock as T9's nav hook, one level up. The number itself is stamped
				// at PAGE scope for exactly the reason in its declaration: a second evaluation of
				// this bundle gets a second module scope, and two private counters cannot arbitrate
				// over one shared `<html>` attribute.
				if (!holdsPageOwner(owner)) return;
				teardownWallpaper();
				teardownMaterial();
				// The low-power flag is ours; leaving it behind would keep the host's
				// own glass flat after the plugin is gone (same residue rule as the
				// material sheet).
				try { document.documentElement.removeAttribute(PERFORMANCE_ATTR); } catch {}
				// T9: release the nav-icon hook if this generation still owns it.
				disposeNavHook(navGeneration);
				disposeAllPacks();
				popupTokenOverrides = {};
				accentTokenOverrides = {};
				wallpaperTokenOverrides = {};
				combinedOverrideDispose?.();
				combinedOverrideDispose = null;
				// B-A-08: this handle is module-scope and points at a store whose slots die with the
				// fiber. Left bound, the module-level helpers (`removeWallpaper`, `setWallpaperKind`)
				// keep calling `sync` on a dead store; unbound, they take their existing `?.` path.
				wallpaperBound = null;
			}, "dsh-dream-skin: wallpaper + material + nav + packs cleanup");

			const skinStore = createSkinStore();
			let skinBound;
			// Monotonic revision for the skin slot store. Using a locally incrementing
```

</details>

**依据 4 · 源码核查**：[lib/index.js:167-207](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/index.js#L167-L207)

版本戳与写入。

<details>
<summary>查看原文（41行）</summary>

```text
function observedSchemaVersion(raw) {
	const stamp = raw[STATE_SCHEMA_KEY];
	if (typeof stamp !== "string" || !/^\d+$/.test(stamp)) return 0;
	return Number(stamp);
}

/**
 * The stamp to write: ours, or the one already on the file when that is HIGHER.
 *
 * A newer build may have put keys in here that we pass through untouched (see
 * writeState). Stamping our own version onto those bytes would claim a format
 * the file is not, and the next upgrade would run its migration over data that
 * already went through it. Nothing we write removes a key, so the highest stamp
 * any writer has declared stays true.
 */
function schemaStampFor(raw) {
	const ours = Number(STATE_SCHEMA_VERSION);
	const seen = observedSchemaVersion(raw);
	return String(seen > ours ? seen : ours);
}

/** Persist the state object atomically (tmp + rename, direct-write fallback). */
function writeState(state) {
	const file = statePath();
	mkdirSync(dirname(file), { recursive: true });
	const tmp = `${file}.tmp`;
	// The reserved key is re-stamped last and wins over `state`, so no caller
	// can persist a forged schema through the settings map. Values stay strings:
	// an older build reading this file String()s anything nested into a setting.
	const body = JSON.stringify({ ...state, [STATE_SCHEMA_KEY]: schemaStampFor(readStateFile()) });
	// The state file holds the user's wallpaper data URLs (personal images),
	// so keep it owner-only on POSIX (mode is ignored on Windows).
	writeFileSync(tmp, body, { encoding: "utf8", mode: 0o600 });
	try {
		renameSync(tmp, file);
	} catch {
		// rename can fail on Windows if the target is transiently locked; a
		// direct write is a safe fallback for this single-process case.
		writeFileSync(file, body, { encoding: "utf8", mode: 0o600 });
	}
}
```

</details>

**依据 5 · 源码核查**：[lib/index.js:139-163](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/index.js#L139-L163)

持久文件和损坏读空。

<details>
<summary>查看原文（25行）</summary>

```text
function statePath() {
	const home = process.env.DSH_HOME && process.env.DSH_HOME.length > 0 ? process.env.DSH_HOME : join(homedir(), ".dsh");
	return join(home, STATE_FILENAME);
}

/** Read the state object; `{}` when absent or corrupt. */
function readState() {
	const state = readStateFile();
	delete state[STATE_SCHEMA_KEY];
	return state;
}

/**
 * Read the state file as bytes on disk, metadata key included. `{}` when the
 * file is absent or unparsable — a corrupt file is treated as empty, which is
 * how this plugin has always behaved (the browser half still holds the values
 * in localStorage and re-pushes them).
 */
function readStateFile() {
	try {
		const parsed = JSON.parse(readFileSync(statePath(), "utf8"));
		return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
	} catch {
		return {};
	}
```

</details>

#### 缺口

- 宿主主题接口、HMR清理和其它插件冲突未执行验证
  **影响**：兼容声明不能当全部壳/版本成功
  **进一步探讨**：同页面安装冲突id后切主题/热重载/停用，看旧样式和选项是否残留。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本、验收建议和可验证方向？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

明确喜欢定制外观的本地Web用户可有限试用；先用内置预设及非私人渐变，检查正文、代码、菜单、错误/成功/选中状态，再测重启回读。它提供比内置深浅更多选择，但审美因人而异，不能作为所有开发者的必装效率工具。

#### 启动与依赖

| 条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| 兼容Web theme/settings/runtime | UI必需 | 注册和设置 | TUI/不兼容壳不保证 |
| Host webServer与可写DSH_HOME | 跨origin持久化必需 | API和状态文件 | 本地可变而Host未保存 |
| 屏幕/浏览器图形能力 | 视觉体验必需 | 材质/模糊/壁纸 | 需试性能与低功耗模式 |
| 远端图或本地个人素材 | 可选 | 自定义背景 | 出网/副本与留存另核 |

#### 试用步骤

| 步骤 | 动作 | 判据 |
|---|---|---|
| 准备 | 记录原偏好并备份所需状态 | 可退内置外观 |
| 小样 | 选一套预设不用私人照片 | 正文/代码/菜单与信号色可读 |
| 保存 | 改一项，重启换origin再查看 | 不能只看当页变化 |
| 导入 | 非敏感小包试验证/移除 | 不覆盖用户已有主题，退路清楚 |
| 退出 | 切内置并停用，检查样式 | 持久文件/壁纸副本另处理 |

#### 成本

| 阶段 | 现金/资源 | 人工时间 | 证据边界 |
|---|---|---|---|
| 首次 | 包/壁纸资源未知，无必需外部账号 | 选主题与视觉比较 | 不测审美普适性 |
| 持续 | 模糊/图像GPU内存与外图流量未知 | 状态可读性和性能复核 | 不推断省时/省Token |
| 升级 | 宿主token/DOM兼容未知 | 对照原界面与保存 | 原生API仍需回归 |
| 恢复退出 | 状态/壁纸副本空间未知 | 切默认、清样式和私人数据 | 停用不删文件 |

#### 效果

| 效果项 | 实现依据 | 未知 |
|---|---|---|
| 外观配置 | theme注册与override层 | 实际屏幕是否舒适 |
| 跨origin持久化 | Host文件/API | fetch静默失败、竞争恢复 |
| 包分享 | manifest/hash校验 | 导入后实际可读性 |
| 生命周期 | owner/disposer清理 | 多插件/HMR实际残留 |

遇到文字难读、信号色不清、明显卡顿、保存重启不一致或卸载残留，应先切回内置和停用，保留状态作对照，不继续堆更多外观插件。

未验证方向是“设置保存回执”：区分当页已应用、本地缓存和Host已确认，校验HTTP/JSON结果并可回读版本，失败明确显示退路。用正常/403/500/重启换origin比较用户误判保存次数和恢复时间。它针对源码silent fetch边界；若仅检查响应加一条提示已足够，不需另做通用同步平台，也不把未来可靠性计入现有分。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1937-1991](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/client.js#L1937-L1991)

保存结果边界。

<details>
<summary>查看原文（55行）</summary>

```text
		 */
		let hostProbeSettled = false;
		let pendingHostSync = false;
		/** Debounce timer for host pushes. */
		let hostSyncTimer = null;
		/** Callback invoked after the host state is applied (set by apply). */
		let onHostReady = null;

		/** Schedule a debounced push of the USER state to the host. */
		function scheduleHostSync() {
			if (!hostProbeSettled) {
				// Boot probe in flight: stash the request, the settled handler
				// pushes once with the merged state.
				pendingHostSync = true;
				return;
			}
			if (hostSyncTimer !== null) return;
			hostSyncTimer = setTimeout(() => {
				hostSyncTimer = null;
				pushStateToHost();
			}, 200);
		}

		/** Push the USER state (factory provenance stripped) to the host file. */
		async function pushStateToHost() {
			const patch = {};
			for (const [key, value] of stateCache) {
				// Only keys actually WRITTEN this session may go out. A read caches
				// absent keys as null (readStorage); pushing those nulls would ERASE
				// the user's durable accent/packs/favorites/history on the host the
				// moment any late write flushes after a slow/failed probe
				// (post-release review 🟠-2). A deliberate user clear goes through
				// writeStorage(key, null) and IS in writtenKeys — still pushed.
				if (!writtenKeys.has(key)) continue;
				// Factory seeds and the provenance bookkeeping are never the
				// user's config — pushing them would bake the shipped look into
				// dream-skin.json (blue-team B1/A1) or leak internals.
				if (isFactorySeededValue(key, value)) continue;
				if (key === FACTORY_APPLIED_KEY || key === FACTORY_SNAPSHOT_KEY) continue;
				patch[key] = value;
			}
			// Nothing user-owned to persist (pure factory boot): skip the
			// round-trip entirely instead of pushing an empty/seed-only patch.
			if (Object.keys(patch).length === 0) return;
			try {
				await fetch(HOST_API, {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ method: "set", patch })
				});
			} catch {
				// host unavailable — the cache + localStorage still hold the values
			}
		}

```

</details>

**依据 2 · 源码核查**：[lib/client.js:9026-9065](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/client.js#L9026-L9065)

冲突和注册退路。

<details>
<summary>查看原文（40行）</summary>

```text
		function apply(ctx) {
			// Claim the page BEFORE anything is installed, so the cleanup effect below always
			// carries a number at least as fresh as the residue it might be about to remove.
			const owner = claimPageOwner();
			ctx.effect(() => () => {
				if (holdsPageOwner(owner) && wallpaperPreviewCleanup) wallpaperPreviewCleanup();
			}, "dsh-dream-skin: wallpaper preview");
			// Boot diagnostics snapshot first, before anything can fail: host/desktop
			// tooling always finds `window.__DSH_DREAM_SKIN_STATUS__` once apply ran
			// (the drift probe later fills in `anchors`; skin switches refresh it).
			publishStatus();
			// Register the curated skins, YIELDING on an id collision instead of
			// throwing (blue-team R19). The host's ThemeRuntime.register throws on a
			// duplicate id (`theme "x" is already registered`), and our ids are
			// common words (mist, rose, ember, ivory…) that a third-party theme
			// plugin can plausibly take first. This call is NOT covered by the
			// factory-level dumb-module fallback (that only guards seed resolution),
			// so an unguarded throw here would escape apply(). Yielding degrades the
			// worst case to "one skin missing" — and the user still keeps their own
			// selection, since we only skip registration.
			const takenThemeIds = new Set(
				((ctx.theme.getTheme() || {}).themes || []).map((themeDefinition) => themeDefinition && themeDefinition.id)
			);
			const disposers = [];
			for (const skinDefinition of SKINS) {
				if (takenThemeIds.has(skinDefinition.id)) {
					try { console.warn(`[dsh-dream-skin] skin id "${skinDefinition.id}" is already registered by another plugin — skipping it`); } catch {}
					continue;
				}
				try {
					disposers.push(ctx.theme.register(skinDefinition));
				} catch (err) {
					// Defensive: a host that throws for another reason must not take
					// down the whole shell either.
					try { console.warn(`[dsh-dream-skin] could not register skin "${skinDefinition.id}":`, err && err.message); } catch {}
				}
			}
			ctx.effect(() => () => {
				for (const dispose of disposers) dispose();
			}, "dsh-dream-skin: theme registration");
```

</details>

**依据 3 · 源码核查**：[lib/client.js:9231-9265](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/client.js#L9231-L9265)

清理设计。

<details>
<summary>查看原文（35行）</summary>

```text
			// here we only create the store — the persisted wallpaper itself was
			// already applied by restorePersistedState() above.
			const wallpaperStore = createWallpaperStore();
			ctx.effect(() => () => {
				// B9 / T5 (adversarial review 10.6.1, deferred then): a hot reload can unload the
				// OLD fiber AFTER the new one applied. Everything below is module-scope state that
				// the new generation is actively using, so an old generation must not touch any
				// of it — same lock as T9's nav hook, one level up. The number itself is stamped
				// at PAGE scope for exactly the reason in its declaration: a second evaluation of
				// this bundle gets a second module scope, and two private counters cannot arbitrate
				// over one shared `<html>` attribute.
				if (!holdsPageOwner(owner)) return;
				teardownWallpaper();
				teardownMaterial();
				// The low-power flag is ours; leaving it behind would keep the host's
				// own glass flat after the plugin is gone (same residue rule as the
				// material sheet).
				try { document.documentElement.removeAttribute(PERFORMANCE_ATTR); } catch {}
				// T9: release the nav-icon hook if this generation still owns it.
				disposeNavHook(navGeneration);
				disposeAllPacks();
				popupTokenOverrides = {};
				accentTokenOverrides = {};
				wallpaperTokenOverrides = {};
				combinedOverrideDispose?.();
				combinedOverrideDispose = null;
				// B-A-08: this handle is module-scope and points at a store whose slots die with the
				// fiber. Left bound, the module-level helpers (`removeWallpaper`, `setWallpaperKind`)
				// keep calling `sync` on a dead store; unbound, they take their existing `?.` path.
				wallpaperBound = null;
			}, "dsh-dream-skin: wallpaper + material + nav + packs cleanup");

			const skinStore = createSkinStore();
			let skinBound;
			// Monotonic revision for the skin slot store. Using a locally incrementing
```

</details>

**依据 4 · 源码核查**：[lib/index.js:189-207](https://github.com/RevolutionLA/dsh-dream-skin/blob/f4455b7d1d12f593929783bbd81237a048416161/lib/index.js#L189-L207)

Host持久化条件。

<details>
<summary>查看原文（19行）</summary>

```text
function writeState(state) {
	const file = statePath();
	mkdirSync(dirname(file), { recursive: true });
	const tmp = `${file}.tmp`;
	// The reserved key is re-stamped last and wins over `state`, so no caller
	// can persist a forged schema through the settings map. Values stay strings:
	// an older build reading this file String()s anything nested into a setting.
	const body = JSON.stringify({ ...state, [STATE_SCHEMA_KEY]: schemaStampFor(readStateFile()) });
	// The state file holds the user's wallpaper data URLs (personal images),
	// so keep it owner-only on POSIX (mode is ignored on Windows).
	writeFileSync(tmp, body, { encoding: "utf8", mode: 0o600 });
	try {
		renameSync(tmp, file);
	} catch {
		// rename can fail on Windows if the target is transiently locked; a
		// direct write is a safe fallback for this single-process case.
		writeFileSync(file, body, { encoding: "utf8", mode: 0o600 });
	}
}
```

</details>

#### 缺口

- 实际可读性、性能、保存恢复及回执方案没有运行数据
  **影响**：采用仅限可回退外观小样
  **进一步探讨**：同内容/窗口比较内置与选定皮肤，故障后换origin回读并记录误判。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
