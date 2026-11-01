# DSH Dream Skin

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[de3f88e](https://github.com/RevolutionLA/dsh-dream-skin/tree/de3f88e6e05bf00616b4375857b8850946169558)

<!-- BEGIN META -->
[![GitHub ★ 298](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=298&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/RevolutionLA/dsh-dream-skin) [![npm 30d 38,072](https://img.shields.io/static/v1?label=npm+30d&message=38%2C072&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dream-skin) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dream-skin)
<!-- END META -->

> **功能**：为 DSH Web 提供可配置主题、壁纸及跨 origin 状态保存。

> **亮点**：[Q02](#research-q02) 将主题注册与跨 origin 状态同步组合成插件；视觉偏好不是模型能力提升。

> **主要限制**：[Q02](#research-q02) 写失败可直接回退写入，不能保证总是原子；[Q03](#research-q03) 导入合法不证明安全或可读。

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
  - [Q01 · 用户得到什么，相对宿主内置主题增量是什么？](#detail-section-11)
  - [Q02 · 宿主与浏览器怎样注册和保存设置？](#detail-section-12)
  - [Q03 · 壁纸和导入主题包的边界是什么？](#detail-section-13)
  - [Q04 · 兼容、维护和退出如何判断？](#detail-section-14)
  - [Q05 · 如何验证视觉效果是否优于内置主题？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望调整 DSH Web 视觉外观的用户。

宿主默认浅色/深色主题已可使用；插件增加预设、壁纸与持久化，但增加兼容及性能负担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 主题预设 | 修改视觉外观 | 冲突 ID 跳过 |
| 状态保存 | 跨 origin 恢复偏好 | 写失败可能不持久 |
| 壁纸 | 自定义背景 | 图片和目录有范围限制 |
| 主题包 | 导入分享配置 | 通过校验不保证可读 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH Web 及 theme API | 必需 | 注册主题 | 无法使用 |
| 可写宿主状态 | 持久化需要 | 跨 origin 保存 | 当前页面可能有效但不持久 |
| 壁纸或主题包 | 可选 | 自定义视觉 | 使用内置预设 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户使用隔离 profile | 可恢复原主题 |
| 选择 | 用户配置预设及壁纸 | 检查文字和对比度 |
| 保存 | 浏览器同步 host | 重载验证 |
| 退出 | 用户切回原主题 | 核对状态与残留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | 插件和磁盘 | 兼容配置 | 未测 |
| 持续 | 浏览器内存及合成资源 | 调整视觉 | 性能未知 |
| 失败 | 恢复设置 | 核查 host 与本地存储 | 写入可能失败 |
| 退出 | 状态文件 | 切回原主题、管理图片 | 残留未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 主题 | 客户端注册预设 | 用户可读性 |
| 状态 | host 与浏览器同步 | 多进程一致性 |
| 导入 | 大小与格式检查 | 全面安全性 |

> **思考**：[Q02](#research-q02) 写失败可直接回退写入，不能保证总是原子；[Q03](#research-q03) 导入合法不证明安全或可读。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将主题注册与跨 origin 状态同步组合成插件；视觉偏好不是模型能力提升。

[Q02](#research-q02) 使用宿主状态与本地缓存，rename 失败直接写；注册冲突跳过并释放。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 写失败可直接回退写入，不能保证总是原子；[Q03](#research-q03) 导入合法不证明安全或可读。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 隔离试用并检查可读性和性能；异常时回默认主题。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

仅静态检查固定 host/client 源码；未运行浏览器或宿主。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态核查 host 状态和客户端注册、代表性图片及包校验，未运行目标或覆盖全部 UI。
- 下一步：隔离 profile 测刷新、损坏文件、冲突主题、图片和跨设备可读性。

**分析版本**

- **仓库**：[RevolutionLA/dsh-dream-skin](https://github.com/RevolutionLA/dsh-dream-skin)
- **版本号**：11.1.0（[固定提交 de3f88e](https://github.com/RevolutionLA/dsh-dream-skin/tree/de3f88e6e05bf00616b4375857b8850946169558)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 以固定任务和设备对照原生主题，测可读性、操作与性能，未验证。

隔离 profile 测刷新、损坏文件、冲突主题、图片和跨设备可读性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 32 | 9048 | — | — | 294897 |
| .js | source | 2 | 12182 | 7328 | 4587 | — |
| .cjs | source | 28 | 10206 | 6648 | 3098 | — |
| .mjs | source | 3 | 496 | 357 | 95 | — |
| .cjs | test | 43 | 24872 | 17449 | 5898 | — |
| .cjs | example | 3 | 869 | 580 | 244 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/RevolutionLA/dsh-dream-skin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 53](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=53&color=737b86&logo=github)](https://github.com/RevolutionLA/dsh-dream-skin/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 49](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=49&color=737b86&logo=github)](https://github.com/RevolutionLA/dsh-dream-skin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查主题插件的宿主注册、保存与采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户得到什么，相对宿主内置主题增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向希望自定义 DSH Web 外观的用户，提供主题预设、材质和壁纸等视觉选择；原生浅色/深色主题和浏览器样式已经能调整外观。增量是把主题注册、可组合设置和持久化封装进插件，不改变模型能力或保证可读性；个性审美是否改善任务体验需实际用户评价。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-18](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/package.json#L1-L18)

包身份及 host/client 入口。

<details>
<summary>查看原文（18行）</summary>

```text
{
	"name": "dsh-dream-skin",
	"version": "11.1.0",
	"description": "DeepSeek Harness 换肤插件（Dream Skin for DSH）：8 套 iOS / Linear 式清透冷调的高质感主题 + 弥散光壁纸 + 每皮肤智能背景 + 强调色 + 主题包分享，把换肤做成材质与配色克制的高级感工艺，而非贴图。Works in native DSH Web and third-party desktop clients (DSH Desktop): 8 original premium themes, glass materials, wallpaper 2.0, per-user accent, shareable theme packs — purely native token system.",
	"license": "MIT",
	"type": "module",
	"main": "lib/index.js",
	"types": "lib/types/index.d.ts",
	"icon": "./icon.svg",
	"exports": {
		".": {
			"types": "./lib/types/index.d.ts",
			"default": "./lib/index.js"
		},
		"./client": {
			"types": "./lib/types/client/index.d.ts",
			"default": "./lib/client.js"
		},
```

</details>

**依据 2 · 源码核查**：[lib/client.js:10125-10164](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/client.js#L10125-L10164)

向宿主注册主题并处理冲突。

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

#### 缺口

- 未在用户设备实际查看
  **影响**：无法证明可读性和性能
  **进一步探讨**：在不同屏幕及模式比较原生主题和插件。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主与浏览器怎样注册和保存设置？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

bundle patch 将宿主插件插入，host apply 注册 webServer 服务；客户端向 theme 注册预设，遇到 ID 冲突跳过并在 effect 释放注册。浏览器以缓存和 localStorage 处理即时状态，再向 host 同步；host 从 DSH_HOME 读状态，缺失或解析失败返回空对象。写入先临时文件再 rename，失败则直接写，故不能把所有情况称原子持久化；也未证明多进程并发安全。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-7](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/cordis.patch.yml#L1-L7)

宿主 patch。

```text
# dsh-dream-skin profile patch layer — insert one loader entry for the plugin
# package. The entry is a normal cordis loader entry (id + package name); the
# browser half is picked up by dsh-client-modules through the package's
# dsh.client declaration, exactly like the shipped ui-* packages.
- insert:
    - id: dream-skin
      name: 'dsh-dream-skin'
```

**依据 2 · 源码核查**：[lib/index.js:136-163](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/index.js#L136-L163)

状态文件及损坏回退。

<details>
<summary>查看原文（28行）</summary>

```text
// ── state file ─────────────────────────────────────────────────────────────

/** Absolute path of the state file under the DSH home directory. */
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

**依据 3 · 源码核查**：[lib/index.js:188-206](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/index.js#L188-L206)

临时写、rename 和直接写回退。

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/index.js:613-620](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/index.js#L613-L620)

宿主服务注册。

```text
 * @param ctx - host cordis context (webServer, optionally webRuntime / webStartup).
 */
export function apply(ctx) {
	ctx.effect(() => ctx.webServer.register({
		kind: "prefix",
		path: API_PREFIX,
		handler: async (req, res) => {
			const hosts = trustedAuthorities(ctx);
```

**依据 5 · 源码核查**：[lib/client.js:2029-2049](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/client.js#L2029-L2049)

缓存、localStorage 和 host 状态说明。

<details>
<summary>查看原文（21行）</summary>

```text
		//#region dsh-dream-skin: persistence (host-backed, origin-independent)
		/**
		 * Persistence seam. Values live in three places:
		 *
		 *  1. an in-memory Map (`stateCache`) — the synchronous read/write
		 *     surface every feature uses;
		 *  2. localStorage — a same-origin fallback so a page reload on the
		 *     same origin still works, and so the first paint before the host
		 *     round-trip has correct values;
		 *  3. the host state file (`$DSH_HOME/dream-skin.json`, via the fenced
		 *     `/dream-skin/api` route) — the durable, origin-independent
		 *     source of truth that survives the desktop app's per-launch
		 *     random port (localStorage alone is lost because the origin —
		 *     scheme+host+port — changes every restart).
		 *
		 * Writes update the cache + localStorage immediately (sync), then are
		 * debounced and pushed to the host as a full-state replacement. On
		 * boot the host state is fetched once; keys not touched this session
		 * are adopted from it, and `onHostReady` re-applies the visual state.
		 */
		/**
```

</details>

**依据 6 · 源码核查**：[lib/client.js:10125-10164](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/client.js#L10125-L10164)

主题注册和释放。

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

#### 缺口

- 未运行宿主并测试刷新和多进程竞争
  **影响**：不能证明实际持久和无丢失
  **进一步探讨**：隔离 profile 测 host 不可用、写失败、重载和两个页面。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 壁纸和导入主题包的边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

宿主壁纸目录列表只接受常规图像，源码声明跳过符号链接并限制数量、深度和文件大小；这降低越界和资源负担，但非全面安全证明。客户端对主题包有大小上限与解析/校验路径，导入后注册主题；包合法不等于配色可读、可访问或资源完全无害。状态文件可能包含个人图片 data URL，应按用户数据处理；损坏回退空对象不等于自动恢复成功。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:395-403](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/index.js#L395-L403)

文件范围及符号链接说明。

```text
/**
 * The images in the folder and in up to FOLDER_MAX_DEPTH levels of subfolders,
 * in listing order (compareFolderEntries), each named by its relative path with
 * "/" separators. Only regular files in real directories qualify: a symlink is
 * skipped whether it points at an image or a directory, so nothing outside the
 * folder can be listed through it. Directory entries come typed from readdir;
 * image candidates are filtered and sorted first and only then stat'ed, in
 * order, until FOLDER_MAX_FILES are accepted, so a huge tree costs at most that
 * many stats (plus FOLDER_MAX_DIRS directory reads).
```

**依据 2 · 源码核查**：[lib/index.js:439-451](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/index.js#L439-L451)

常规文件大小和数量限制。

<details>
<summary>查看原文（13行）</summary>

```text
	candidates.sort(compareFolderEntries);
	const files = [];
	let examined = 0;
	while (examined < candidates.length && files.length < FOLDER_MAX_FILES) {
		const segments = candidates[examined++];
		let stat;
		try {
			stat = await lstat(join(root, ...segments));
		} catch {
			continue;
		}
		if (!stat.isFile() || stat.size === 0 || stat.size > FOLDER_MAX_IMAGE_BYTES) continue;
		files.push({ name: segments.join("/"), size: stat.size, mtimeMs: Math.round(stat.mtimeMs) });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:188-199](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/index.js#L188-L199)

状态文件可能包含个人图片。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/client.js:7180-7188](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/client.js#L7180-L7188)

包大小上限。

```text
		const PACK_FORMAT = "dsh-dream-skin/pack";
		/** Current pack manifest version. */
		const PACK_VERSION = 1;
		/** Size cap for an imported pack JSON (≈1 MiB). */
		const PACK_MAX_BYTES = 1024 * 1024;
		/** localStorage keys for P0 state. */
		const PACKS_KEY = "dsh-dream-skin:packs"; // JSON array of remote/manual pack manifests
		const ACCENT_KEY = "dsh-dream-skin:accent"; // hex accent (#rrggbb) or "system"
		const FAVORITES_KEY = "dsh-dream-skin:favorites"; // JSON array of theme/ pack ids
```

**依据 5 · 源码核查**：[lib/client.js:7435-7468](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/client.js#L7435-L7468)

主题包解析和验证。

<details>
<summary>查看原文（34行）</summary>

```text
		function disposeAllPacks() {
			for (const dispose of packDisposers.values()) dispose();
			packDisposers.clear();
			importedPacks.length = 0;
		}

		/** Read the persisted pack-manifest list. */
		function readPacks() {
			const raw = readStorage(PACKS_KEY);
			if (raw === null) return [];
			try {
				const parsed = JSON.parse(raw);
				return Array.isArray(parsed) ? parsed : [];
			} catch {
				return [];
			}
		}

		/** Persist the pack-manifest list (removing any entry whose id is empty). */
		function writePacks(packs) {
			writeStorage(PACKS_KEY, JSON.stringify(packs.filter((p) => p && p.id)));
		}

		/** Find a pack manifest by id. */
		function findPack(id) {
			return importedPacks.find((p) => p && p.id === id);
		}

		/** Import a validated pack: register it, add to the in-process + persisted list. */
		function importPack(ctx, result) {
			const { id, pack } = result;
			if (findPack(id)) return { ok: false, error: "a pack with this id is already imported" };
			const registration = packToRegistration(pack);
			try {
```

</details>

#### 缺口

- 未做恶意输入及多浏览器测试
  **影响**：不能证明全面安全和可访问性
  **进一步探讨**：隔离浏览器检查越界、超大图、导入失败及键盘/对比度。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 兼容、维护和退出如何判断？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容版本的 DSH Web 服务和主题 API；客户端对重复 ID 跳过而非覆盖，结果可能少一套主题。首次需配置视觉与备份偏好，持续占用浏览器及宿主状态，模糊和壁纸可能增加合成开销，具体影响未测。卸载 effect 会释放已注册主题，但宿主状态文件、浏览器存储及个人壁纸是否保留须单独核实；必要时切回宿主默认主题。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-18](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/package.json#L1-L18)

host/client 包入口。

<details>
<summary>查看原文（18行）</summary>

```text
{
	"name": "dsh-dream-skin",
	"version": "11.1.0",
	"description": "DeepSeek Harness 换肤插件（Dream Skin for DSH）：8 套 iOS / Linear 式清透冷调的高质感主题 + 弥散光壁纸 + 每皮肤智能背景 + 强调色 + 主题包分享，把换肤做成材质与配色克制的高级感工艺，而非贴图。Works in native DSH Web and third-party desktop clients (DSH Desktop): 8 original premium themes, glass materials, wallpaper 2.0, per-user accent, shareable theme packs — purely native token system.",
	"license": "MIT",
	"type": "module",
	"main": "lib/index.js",
	"types": "lib/types/index.d.ts",
	"icon": "./icon.svg",
	"exports": {
		".": {
			"types": "./lib/types/index.d.ts",
			"default": "./lib/index.js"
		},
		"./client": {
			"types": "./lib/types/client/index.d.ts",
			"default": "./lib/client.js"
		},
```

</details>

**依据 2 · 源码核查**：[lib/client.js:10145-10164](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/client.js#L10145-L10164)

冲突跳过及释放。

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 3 · 源码核查**：[lib/index.js:138-141](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/index.js#L138-L141)

持久状态位置。

```text
/** Absolute path of the state file under the DSH home directory. */
function statePath() {
	const home = process.env.DSH_HOME && process.env.DSH_HOME.length > 0 ? process.env.DSH_HOME : join(homedir(), ".dsh");
	return join(home, STATE_FILENAME);
```

**依据 4 · 源码核查**：[lib/client.js:2029-2049](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/client.js#L2029-L2049)

多层状态。

<details>
<summary>查看原文（21行）</summary>

```text
		//#region dsh-dream-skin: persistence (host-backed, origin-independent)
		/**
		 * Persistence seam. Values live in three places:
		 *
		 *  1. an in-memory Map (`stateCache`) — the synchronous read/write
		 *     surface every feature uses;
		 *  2. localStorage — a same-origin fallback so a page reload on the
		 *     same origin still works, and so the first paint before the host
		 *     round-trip has correct values;
		 *  3. the host state file (`$DSH_HOME/dream-skin.json`, via the fenced
		 *     `/dream-skin/api` route) — the durable, origin-independent
		 *     source of truth that survives the desktop app's per-launch
		 *     random port (localStorage alone is lost because the origin —
		 *     scheme+host+port — changes every restart).
		 *
		 * Writes update the cache + localStorage immediately (sync), then are
		 * debounced and pushed to the host as a full-state replacement. On
		 * boot the host state is fetched once; keys not touched this session
		 * are adopted from it, and `onHostReady` re-applies the visual state.
		 */
		/**
```

</details>

#### 缺口

- 未测版本兼容、性能或完整卸载
  **影响**：不能保证用户偏好恢复和无残留
  **进一步探讨**：在独立 profile 比较帧率、资源、卸载与偏好文件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证视觉效果是否优于内置主题？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有预设、状态保存和主题冲突处理已存在，简单增加更多主题不证明可读性提高。未验证方案是在用户同意下比较宿主默认与用户选定主题，按相同屏幕、亮暗和任务测阅读时间、对比度、键盘操作及性能；若错误率上升或帧率损失超过用户可接受范围则放弃该预设。静态配色合规不能代替真实人群体验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:10145-10164](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/client.js#L10145-L10164)

现有主题注册与冲突处理。

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/index.js:188-206](https://github.com/RevolutionLA/dsh-dream-skin/blob/de3f88e6e05bf00616b4375857b8850946169558/lib/index.js#L188-L206)

现有保存机制。

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

#### 缺口

- 无多用户与设备评估
  **影响**：无法断言改善体验
  **进一步探讨**：用固定任务、设备和原生主题作对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
