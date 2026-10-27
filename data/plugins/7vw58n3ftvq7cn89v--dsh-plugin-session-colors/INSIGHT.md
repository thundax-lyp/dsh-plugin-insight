# dsh-plugin-session-colors

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[d0f5113](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/tree/d0f51131aef40e6bc3f60b560342e22551a972cd)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：通过侧栏悬停palette为会话设置颜色，host保存id颜色映射并以浏览器镜像加快显示。

> **核心亮点**：把ID持久颜色、即时镜像与不打开会话的picker组合，减少手动标题/CSS整理。详见[Q01](#research-q01)。

> **风险与缺陷**：DOM同名顺序误配可不只错画还写错ID，离线/持久失败只warn，HTTP写入无本层身份校验。详见[Q03](#research-q03)。

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
  - [Q01 · 颜色标签给谁用，能表达真实任务状态吗？](#detail-section-11)
  - [Q02 · 原子存储和HTTP路由的可靠范围是什么？](#detail-section-12)
  - [Q03 · DOM身份和乐观镜像是否能保证改的是那一行？](#detail-section-13)
  - [Q04 · 工程证据和三阶段成本怎样分开判断？](#detail-section-14)
  - [Q05 · 当前推荐与可证伪方向是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多会话用户用自定颜色辨认项目和分组。详见[Q01](#research-q01)。

手动标题/pin和临时CSS视觉标记，当前不是任务状态服务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| hover palette | 12色/清除无需打开会话 | 依标题DOM映射，错配可写错ID |
| 持久颜色API | 多浏览器读取id映射 | 本层无身份/成员检查 |
| 镜像/行色条 | 即显/离线可看 | 写失败未确认，focus只重新取host |

**流程与依赖**

#### 启动与依赖

| 条件 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Node/Cordis/webServer | 存储及HTTP | 外层访问控制须明确 |
| DSH_HOME/storages | 持久颜色 | 单实例队列非多进程CAS |
| client sessions/DOM | 映射行与ID | 标题/顺序非强身份 |
| localStorage/fetch | 快显与同步 | 离线选择无重试确认 |


#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 核准入并备份映射 | 用户 | 单主体/实例边界明确 |
| 悬停唯一标题行选色 | 用户 | 对应ID可确认 |
| 刷新核server结果 | 用户 | 不只信镜像色条 |
| 失败盘点三份状态 | 用户 | 内存/磁盘/镜像一致 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 匹配Node/宿主、颜色JSON及浏览器镜像空间，金额未知 | 核路由访问控制、同名列表顺序并备份原存储，工时未知 | 颜色仅视觉标签，无模型服务Key，但不能推总成本为零 |
| 持续使用 | DOM全树观察/rAF重绘、列表/映射复制、PUT/GET与文件写入 | 选色并确认目标和持久成功 | 无独立LLM调用；大列表/全量映射成本与实际延迟未知 |
| 失败恢复 | 旧JSON/镜像备份与重同步；失败写可能留temp | 核内存/磁盘/镜像差异、误归属并重设颜色 | 无失败回滚或多实例锁；恢复工时/金额未知，坏文件自愈不等找回原颜色 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 快速颜色组织 | hover/palette/id映射 | DOM同名顺序可误配 |
| 刷新持久 | host JSON/镜像 | 失败只warn/跨实例覆盖 |
| 即时首屏 | localStorage先读 | 非已确认落盘/主体隔离 |

> **思考**：DOM同名顺序误配可不只错画还写错ID，离线/持久失败只warn，HTTP写入无本层身份校验。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把ID持久颜色、即时镜像与不打开会话的picker组合，减少手动标题/CSS整理。详见[Q01](#research-q01)。

把ID持久颜色、即时镜像与不打开会话的picker组合，减少手动标题/CSS整理。详见[Q01](#research-q01)。

队列/原子替换和DOM mock可借鉴，坏文件覆盖和即时镜像不等持久恢复。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

DOM同名顺序误配可不只错画还写错ID，离线/持久失败只warn，HTTP写入无本层身份校验。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察；独立本机/唯一标题与备份下核持久结果后再评估。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

颜色持久与交互机制可查；身份误配/乐观失败和路由权限限制稳定标签价值，版本化身份写入假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js、smoke-host.js、smoke-host-phase2.js、smoke-client-dom.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整267行host、client store/painter/picker/lifecycle关键链、host/phase2和DOM测试，未穷尽样式/viewport定位；不执行目标/测试或读真实存储。
- 下一步：用同名倒序/旧GET晚到/离线PUT/磁盘失败/多实例反例核身份与持久确认。

**分析版本**

- **仓库**：[7vw58n3ftvq7cn89v/dsh-plugin-session-colors](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors)
- **版本号**：0.1.0（[固定提交 d0f5113](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/tree/d0f51131aef40e6bc3f60b560342e22551a972cd)）
- **版本日期**：2026-10-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究稳定ID行契约、带版本持久确认和按主体镜像，对照乱序/离线/同名/多实例错标恢复，未验证。详见[Q05](#research-q05)。

用同名倒序/旧GET晚到/离线PUT/磁盘失败/多实例反例核身份与持久确认。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 5 | 1140 | 906 | 193 | — |
| .md | source | 2 | 238 | — | — | 1919 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/issues?q=is%3Aissue+created%3A2026-09-22T09%3A28%3A53.741Z..2026-10-22T09%3A28%3A53.741Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A28%3A53.741Z..2026-10-22T09%3A28%3A53.741Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：颜色能否准确归属并可靠持久化，标题DOM映射、镜像同步和HTTP写权限的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 颜色标签给谁用，能表达真实任务状态吗？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向多会话并行、需要迅速辨认项目或自定分组的DSH用户，侧栏悬停160ms出现选色点，12预设/清除并画左侧色条，无需打开会话；host保存id→颜色，浏览器镜像支持先显示。合格结果是用户指的会话被正确标记、重载/换浏览器后仍归同一会话，不是只看到色条。颜色由用户赋义，不读取任务结果或自动判断优先级。

参照改标题/原生pin和自定义CSS，增量是会话ID持久颜色与快捷picker组合，形成可跨浏览器读取的标签状态；不改变会话业务内容或执行权限。README承认同名按DOM顺序且DOM匹配best-effort，但“匹配失败只影响着色、不影响数据”需收窄，因为picker也依该映射选写入ID。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-31](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/README.md#L13-L31)

用户体验与持久主张。

<details>
<summary>查看原文（19行）</summary>

```text
**🎨 侧栏悬停取色**

鼠标停在侧栏任意会话行上，行左缘浮出一枚颜色圆点，点开即是取色面板 —— 12 种预设颜色 + 一键清除，选完立即生效。全程无需打开会话。

- 圆点即为状态：已标色的会话显示实心色点，未标色的显示虚线圆圈
- 面板自动在屏幕边缘翻转方向，不会溢出视野
- 160ms 悬停防抖：扫视列表时不会误触，停留即出现

**🌈 会话行着色**

被标色的会话行左侧显示同色竖条（3px 内嵌条），多会话并行工作时一眼找到目标行。切换会话、刷新页面、重启应用后依然保持。

**💾 宿主侧持久化**

颜色存在 Harness 宿主的 `storages/session-colors.json`，浏览器端有 localStorage 镜像：

- 重启应用、换浏览器都不丢
- 打开页面即时显示（镜像先渲染，宿主数据随后对齐）
- 宿主 API 短暂不可达时仍可查看，恢复后自动同步
```

</details>

**依据 2 · 作者声明**：[README.md:58-61](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/README.md#L58-L61)

匹配与数据影响主张。

```text

- **宿主半**：一个零依赖的 cordis 插件，向 Harness webserver 注册 `/session-colors` 路由，把 `sessionId → 颜色` 映射持久化为 JSON（临时文件 + 原子重命名，损坏的存储文件会在下次写入时自动修复）。
- **浏览器半**：懒 CJS 工厂包（`__ModuleLoader__`），零运行时依赖。由于官方未提供会话行的插槽，侧栏着色通过「会话标题 ↔ 行标题 span」精确匹配实现（未读噪声安全、同名会话按 DOM 序消费、子串陷阱防护）。匹配失败只影响着色，不影响数据。

```

**依据 3 · 源码核查**：[lib/client.js:383-426](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/lib/client.js#L383-L426)

picker取映射ID后持久。

<details>
<summary>查看原文（44行）</summary>

```text
			function showFor(row) {
				if (row === currentRow) return;
				clearTimeout(dwellTimer);
				currentRow = row;
				currentSessionId = null;
				dwellTimer = setTimeout(() => {
					dwellTimer = 0;
					const assignment = painter.rowAt(row);
					if (assignment === void 0) {
						hide();
						return;
					}
					currentSessionId = assignment.sessionId;
					refreshDot();
					placeDot();
				}, 160);
			}
			function openPalette() {
				if (currentSessionId === null) return;
				const sessionId = currentSessionId;
				const current = colorOf(sessionId);
				palette.replaceChildren();
				for (const [, value] of PALETTE) {
					const swatch = document.createElement("button");
					swatch.type = "button";
					swatch.className = "dshsc-swatch";
					swatch.style.background = value;
					swatch.title = value;
					swatch.setAttribute("aria-label", value);
					if (current === value) swatch.textContent = "✓";
					swatch.addEventListener("click", () => {
						colorStore.set(sessionId, value);
						refreshDot();
						closePalette();
					});
					palette.appendChild(swatch);
				}
				const clear = document.createElement("button");
				clear.type = "button";
				clear.className = "dshsc-clear";
				clear.title = "Clear";
				clear.textContent = "✕";
				clear.addEventListener("click", () => {
					colorStore.set(sessionId, null);
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 原子存储和HTTP路由的可靠范围是什么？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

host Store进程内队列串行snapshot/set，首次load只接受颜色/ID正则并规范hex，持久化写pid+时间临时文件再rename；避免同实例写交错和半截JSON是可借鉴机制。没有文件版本/CAS/跨进程锁且只读盘一次，多profile共DSH_HOME可覆盖彼此映射。set先改内存再persist，磁盘写失败不回滚，后续GET仍见未持久值；另一次成功写还可能把先前失败值一并落盘。坏JSON吞成空且下次全覆盖，属于可继续使用而非恢复旧数据，没有腐败原件备份。

路由GET/HEAD全量映射，PUT/DELETE按保守ID与hex校验，PUT body16KiB上限，无来源/Host/peer/身份或会话成员检查，合法形状的任意ID都能写；因此依赖宿主外层准入，不能把ID语法当用户有权修改。响应不含文本标题但有会话ID和颜色关联。实际远端可达性仍需部署证明，本次不宣称外部攻击已复现。

Node ^22.19或>=24、Cordis4.0.2、webServer与client sessions ABI是启动条件。DSH_HOME否则homedir/.dsh，存储不是per-session agent scope；无webServer时动态inject等待，卸载route走effect，已排写入没有共享取消。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:96-163](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/lib/index.js#L96-L163)

缓存/原子替换/队列。

<details>
<summary>查看原文（68行）</summary>

```text
	#path;
	#colors = {};
	#loaded = false;
	#queue = Promise.resolve();

	/** @param {string} path - absolute store file path. */
	constructor(path) {
		this.#path = path;
	}

	/** Read the store once, tolerating absence and unrecoverable corruption. */
	async #load() {
		if (this.#loaded) return;
		let raw;
		try {
			raw = await readFile(this.#path, "utf8");
		} catch (error) {
			if (/** @type {NodeJS.ErrnoException} */ (error).code === "ENOENT") {
				this.#loaded = true;
				return;
			}
			throw error;
		}
		try {
			const parsed = JSON.parse(raw);
			if (parsed !== null && typeof parsed === "object" && parsed.colors !== null && typeof parsed.colors === "object") {
				const colors = {};
				for (const [id, color] of Object.entries(parsed.colors)) {
					if (typeof color === "string" && COLOR_PATTERN.test(color) && SESSION_ID_PATTERN.test(id)) colors[id] = canonicalColor(color);
				}
				this.#colors = colors;
			}
		} catch {
			// A torn or hand-mangled file must not take the plugin down; the next
			// write replaces it wholesale with a valid store.
		}
		this.#loaded = true;
	}

	/** Atomically persist the current map. */
	async #persist() {
		await mkdir(join(this.#path, ".."), { recursive: true });
		const temp = `${this.#path}.${process.pid}.${Date.now()}.tmp`;
		const body = `${JSON.stringify({ version: STORE_VERSION, colors: this.#colors }, null, 2)}\n`;
		await writeFile(temp, body, "utf8");
		await rename(temp, this.#path);
	}

	/**
	 * Run one read-modify-write cycle behind the write queue.
	 * @template T
	 * @param {() => Promise<T>} task - closure over a snapshot clone.
	 * @returns {Promise<T>} the task's result.
	 */
	#enqueue(task) {
		const run = this.#queue.then(task);
		// Keep the queue alive regardless of individual failures.
		this.#queue = run.then(() => undefined, () => undefined);
		return run;
	}

	/**
	 * Snapshot the current color map (a clone — callers may hold it).
	 * @returns {Promise<Record<string, string>>}
	 */
	snapshot() {
		return this.#enqueue(async () => {
			await this.#load();
```

</details>

**依据 2 · 源码核查**：[lib/index.js:177-185](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/lib/index.js#L177-L185)

先改内存再持久。

```text
			if (color === null) delete this.#colors[sessionId];
			else this.#colors[sessionId] = color;
			await this.#persist();
			return { ...this.#colors };
		});
	}
}

/**
```

**依据 3 · 源码核查**：[lib/index.js:203-236](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/lib/index.js#L203-L236)

实际请求准入/字段校验。

<details>
<summary>查看原文（34行）</summary>

```text
			}
			const match = COLORS_ID_PATTERN.exec(url.pathname);
			if (match) {
				if (req.method !== "PUT" && req.method !== "DELETE") return respond(405, errorBody("method not allowed"));
				const sessionId = decodeURIComponent(match[1]);
				if (!SESSION_ID_PATTERN.test(sessionId)) return respond(400, errorBody("invalid session id"));
				if (req.method === "DELETE") return respond(200, colorsBody(await store.set(sessionId, null)));
				const raw = await readBody(req);
				if (raw === undefined) return respond(400, errorBody("unreadable request body"));
				let parsed;
				try {
					parsed = JSON.parse(raw);
				} catch {
					return respond(400, errorBody("request body must be JSON"));
				}
				const color = parsed === null || typeof parsed !== "object" ? undefined : /** @type {{color?: unknown}} */ (parsed).color;
				if (color === null) return respond(200, colorsBody(await store.set(sessionId, null)));
				if (typeof color !== "string" || !COLOR_PATTERN.test(color)) return respond(400, errorBody("color must be a #rgb/#rrggbb hex string or null"));
				return respond(200, colorsBody(await store.set(sessionId, canonicalColor(color))));
			}
			return respond(404, errorBody("not found"));
		} catch (error) {
			ctx.logger?.error?.(error);
			if (!res.headersSent) respond(500, errorBody("session-colors internal error"));
			else res.end();
		}
	};

	const registerWebCarrier = (webCtx) => {
		webCtx.effect(() => /** @type {import("@deepseek-ai/dsh-host-webserver").WebServer} */ (webCtx.webServer).register({
			kind: "prefix",
			path: "/session-colors",
			handler: /** @type {(req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse) => void} */ (handler)
		}), "session-colors: api route");
```

</details>

**依据 4 · 源码核查**：[lib/index.js:244-267](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/lib/index.js#L244-L267)

路由生命周期/body cap。

<details>
<summary>查看原文（24行）</summary>

```text
 * Read and hard-cap a request body.
 * @param {import("node:http").IncomingMessage} req
 * @returns {Promise<string | undefined>} the body, or undefined when over cap.
 */
function readBody(req) {
	return new Promise((resolve) => {
		let size = 0;
		/** @type {Buffer[]} */
		const chunks = [];
		req.on("data", (chunk) => {
			size += chunk.length;
			if (size > MAX_BODY_BYTES) {
				resolve(undefined);
				req.destroy();
				return;
			}
			chunks.push(chunk);
		});
		req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
		req.on("error", () => resolve(undefined));
	});
}

export { apply, inject, name };
```

</details>

**依据 5 · 源码核查**：[package.json:27-42](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/package.json#L27-L42)

运行/宿主范围。

<details>
<summary>查看原文（16行）</summary>

```text
    "node": "^22.19.0 || >=24.0.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": []
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2"
  },
  "repository": {
    "type": "git",
```

</details>

#### 缺口

- 具体宿主部署的HTTP外层准入与同DSH_HOME多实例使用约定
  **影响**：决定接口是否可被非预期读写及跨实例丢色概率
  **进一步探讨**：只读同版本宿主访问控制与部署配置，用假ID映射/两个实例原件核准入和CAS需求

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · DOM身份和乐观镜像是否能保证改的是那一行？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

client从sessions.list的ids/byId按displayTitle排队；先用行直接子span最长文字精确匹配，再对未消费队列在整行text includes兜底，同名按DOM顺序shift。这样可处理部分未读噪声和已匹配标题子串陷阱，但不是稳定ID定位。排序/分组/虚拟列表使DOM顺序不同于summary.ids时，同名可映射错ID，picker便对那个ID调用set；退化不止错画色，也可能持久改另一个会话。空标题/blank跳过，本来合法行未匹配则无picker。

ColorStore先publish本地镜像再PUT，失败仅console.warn、不回滚/可见待同步标记/重试队列；成功也不读取server返回映射。sync只防同期GET，按服务器全量替换，不协调进行中的PUT或本地修改版本，旧GET可覆盖新选色，快速PUT先后到达可违最后意图。恢复focus/reset只是重新读host，不会补发失败离线选择，故README“恢复后自动同步”只保证取回服务器值，不能保证保存离线改动。

浏览器镜像仅按包固定key，未绑定host/profile身份，且load/sync仅筛字符串色值不复用host hex/ID校验；同源切换主体或手改镜像可能先见错误标签。卸载有observer、rAF、hover事件和layer清理，但在途fetch无abort，body广域MutationObserver仍可能随无关DOM频繁计划全列表重绘。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:105-155](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/lib/client.js#L105-L155)

GET覆盖/乐观写/失败策略。

<details>
<summary>查看原文（51行）</summary>

```text
			async sync() {
				if (this.syncing) return;
				this.syncing = true;
				try {
					const response = await fetch("/session-colors/api/colors", { cache: "no-store" });
					if (!response.ok) return;
					const body = await response.json();
					if (body === null || typeof body !== "object" || body.colors === null || typeof body.colors !== "object") return;
					const next = new Map(Object.entries(body.colors).filter(([, color]) => typeof color === "string"));
					if (sameMap(next, this.snapshot)) return;
					this.publish(next);
				} catch (error) {
					console.warn("[session-colors] sync failed:", error);
				} finally {
					this.syncing = false;
				}
			}
			/** Optimistically set/clear one session color, then persist via the API. */
			async set(sessionId, color) {
				const next = new Map(this.snapshot);
				if (color === null) next.delete(sessionId);
				else next.set(sessionId, color);
				if (!sameMap(next, this.snapshot)) this.publish(next);
				try {
					const response = await fetch(`/session-colors/api/colors/${encodeURIComponent(sessionId)}`, {
						method: "PUT",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ color })
					});
					if (!response.ok) console.warn("[session-colors] save failed:", response.status);
				} catch (error) {
					console.warn("[session-colors] save failed:", error);
				}
			}
		}
		function readMirror() {
			try {
				const raw = localStorage.getItem(MIRROR_KEY);
				if (raw === null) return;
				const parsed = JSON.parse(raw);
				if (parsed === null || typeof parsed !== "object") return;
				return new Map(Object.entries(parsed).filter(([, color]) => typeof color === "string"));
			} catch {
				return;
			}
		}
		function writeMirror(snapshot) {
			try {
				localStorage.setItem(MIRROR_KEY, JSON.stringify(Object.fromEntries(snapshot)));
			} catch {}
		}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:194-254](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/lib/client.js#L194-L254)

队列/最长span/substring。

<details>
<summary>查看原文（61行）</summary>

```text
			function sessionQueuesByTitle() {
				const colors = colorStore.getSnapshot();
				const summary = sessionsSummary();
				const queues = /* @__PURE__ */ new Map();
				if (summary === void 0) return queues;
				const ids = summary.ids ?? [];
				for (const sessionId of ids) {
					const session = summary.byId?.[sessionId];
					if (session === void 0 || session.blank) continue;
					const title = typeof session.displayTitle === "string" ? session.displayTitle.trim() : "";
					if (title.length === 0) continue;
					let queue = queues.get(title);
					if (queue === void 0) queues.set(title, queue = []);
					queue.push({ sessionId, color: colors.get(sessionId) ?? null });
				}
				return queues;
			}
			/**
			 * The row's title is its direct-child span with the longest text (the
			 * title span flexes to fill the row; time/unread noise lives in other
			 * or nested spans).
			 */
			function rowTitleText(row) {
				let best = "";
				for (const child of row.children) {
					if (child.tagName !== "SPAN") continue;
					const text = (child.textContent ?? "").trim();
					if (text.length > best.length) best = text;
				}
				return best;
			}
			function repaint() {
				const queues = sessionQueuesByTitle();
				const rows = document.querySelectorAll(ROW_SELECTOR);
				const next = /* @__PURE__ */ new Map();
				const assigned = /* @__PURE__ */ new Set();
				if (queues.size > 0) {
					// Pass 1 — exact title-span match (kills nearly all false positives).
					for (const row of rows) {
						const queue = queues.get(rowTitleText(row));
						if (queue !== void 0 && queue.length > 0) {
							next.set(row, queue.shift());
							assigned.add(row);
						}
					}
					// Pass 2 — whole-row text fallback for titles whose queue still
					// has unconsumed entries (covers unread-flagged/odd row shapes).
					let remaining = false;
					for (const queue of queues.values()) if (queue.length > 0) {
						remaining = true;
						break;
					}
					if (remaining) for (const row of rows) {
						if (assigned.has(row)) continue;
						const text = row.textContent ?? "";
						for (const [title, queue] of queues) {
							if (queue.length > 0 && text.includes(title)) {
								next.set(row, queue.shift());
								assigned.add(row);
								break;
							}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:283-309](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/lib/client.js#L283-L309)

observer与清理。

<details>
<summary>查看原文（27行）</summary>

```text
			const unsubscribeSessions = sessions.list.subscribe(schedule);
			const unsubscribeStore = colorStore.subscribe(schedule);
			const observer = new MutationObserver(schedule);
			observer.observe(document.body, { childList: true, subtree: true, characterData: true });
			schedule();
			return {
				dispose() {
					unsubscribeSessions();
					unsubscribeStore();
					observer.disconnect();
					if (frame) {
						cancelAnimationFrame(frame);
						frame = 0;
					}
					rowSessions = /* @__PURE__ */ new Map();
					clearAll();
				},
				/** Resolve a hovered element to its row's session assignment. */
				rowAt(element) {
					const row = element.closest?.(ROW_SELECTOR);
					if (row === null || row === void 0) return void 0;
					return rowSessions.get(row);
				},
				setAfterRepaint(fn) {
					afterRepaint = fn;
				}
			};
```

</details>

**依据 4 · 源码核查**：[lib/client.js:383-426](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/lib/client.js#L383-L426)

映射给picker写ID。

<details>
<summary>查看原文（44行）</summary>

```text
			function showFor(row) {
				if (row === currentRow) return;
				clearTimeout(dwellTimer);
				currentRow = row;
				currentSessionId = null;
				dwellTimer = setTimeout(() => {
					dwellTimer = 0;
					const assignment = painter.rowAt(row);
					if (assignment === void 0) {
						hide();
						return;
					}
					currentSessionId = assignment.sessionId;
					refreshDot();
					placeDot();
				}, 160);
			}
			function openPalette() {
				if (currentSessionId === null) return;
				const sessionId = currentSessionId;
				const current = colorOf(sessionId);
				palette.replaceChildren();
				for (const [, value] of PALETTE) {
					const swatch = document.createElement("button");
					swatch.type = "button";
					swatch.className = "dshsc-swatch";
					swatch.style.background = value;
					swatch.title = value;
					swatch.setAttribute("aria-label", value);
					if (current === value) swatch.textContent = "✓";
					swatch.addEventListener("click", () => {
						colorStore.set(sessionId, value);
						refreshDot();
						closePalette();
					});
					palette.appendChild(swatch);
				}
				const clear = document.createElement("button");
				clear.type = "button";
				clear.className = "dshsc-clear";
				clear.title = "Clear";
				clear.textContent = "✕";
				clear.addEventListener("click", () => {
					colorStore.set(sessionId, null);
```

</details>

**依据 5 · 源码核查**：[lib/client.js:489-508](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/lib/client.js#L489-L508)

focus/reset只sync。

<details>
<summary>查看原文（20行）</summary>

```text
		 */
		function apply(ctx) {
			ctx.effect(() => {
				const painter = createSidebarPainter(store, ctx.sessions);
				const hover = attachSidebarHover(store, painter);
				return () => {
					hover.dispose();
					painter.dispose();
				};
			}, "session-colors: sidebar painter + hover picker");
			ctx.effect(() => {
				store.sync();
				const resubscribe = () => store.sync();
				ctx.on("connection/reset", resubscribe);
				const onFocus = () => store.sync();
				window.addEventListener("focus", onFocus);
				return () => {
					window.removeEventListener("focus", onFocus);
				};
			}, "session-colors: store sync");
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程证据和三阶段成本怎样分开判断？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

host测试直接装真实lib到mock webserver，使用临时home/本地HTTP读写，检查颜色规范化、路径/方法拒绝和磁盘结果；phase2期望坏文件为空再由下一写“修复”。DOM测试在jsdom构造summary/行、hover后点选，覆盖顺序一致的同名、未读噪声和已消费标题子串。它比复制实现断言更有价值，但没有覆盖乱序PUT/GET、磁盘失败回滚、多实例或DOM排序与ids不同。host基础脚本还有重复同一磁盘断言，计数不代表独立边界数量；本次只读测试不运行。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 匹配Node/宿主、颜色JSON及浏览器镜像空间，金额未知 | 核路由访问控制、同名列表顺序并备份原存储，工时未知 | 颜色仅视觉标签，无模型服务Key，但不能推总成本为零 |
| 持续使用 | DOM全树观察/rAF重绘、列表/映射复制、PUT/GET与文件写入 | 选色并确认目标和持久成功 | 无独立LLM调用；大列表/全量映射成本与实际延迟未知 |
| 失败恢复 | 旧JSON/镜像备份与重同步；失败写可能留temp | 核内存/磁盘/镜像差异、误归属并重设颜色 | 无失败回滚或多实例锁；恢复工时/金额未知，坏文件自愈不等找回原颜色 |

损坏自愈和乐观即显各有可用性价值，代价是用户可能把内存/镜像值当已落盘。计量应分别看选色到可见、写入成功、恢复后身份一致，再比较手动标题/CSS操作；没有同条件任务计时或错标率，不填收益比例。

#### 证据与依据

**依据 1 · 源码核查**：[smoke-host.js:1-115](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/smoke-host.js#L1-L115)

生产route本地mock测试与重复断言。

<details>
<summary>查看原文（115行）</summary>

```text
// Offline smoke test for the dsh-plugin-session-colors host half.
// Drives apply() with a mock cordis ctx + mock webServer, then exercises the
// route handler directly through node:http against a real ephemeral server.
import { createServer } from "node:http";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const plugin = await import("./lib/index.js");
console.log("exports:", Object.keys(plugin));
console.assert(plugin.name === "session-colors", "name");
console.assert(Array.isArray(plugin.inject), "inject");

const home = await mkdtemp(join(tmpdir(), "dshsc-test-"));
process.env.DSH_HOME = home;

let registered = null;
const ctx = {
	get: (service) => undefined,
	inject: (deps, fn) => {
		console.log("ctx.inject(", deps, ")");
		fn({
			webServer: {
				register: (route) => {
					registered = route;
					return () => {};
				}
			},
			effect: (fn2, label) => {
				console.log("webCtx.effect(", label, ")");
				return fn2();
			}
		});
	},
	logger: { error: (e) => console.error("logger.error:", e) }
};

await plugin.apply(ctx, {});
if (!registered) throw new Error("route was never registered");
console.log("route:", registered.kind, registered.path);

// Mount the handler on a real ephemeral server.
const server = createServer((req, res) => registered.handler(req, res));
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;

async function call(method, path, body) {
	const response = await fetch(base + path, {
		method,
		headers: body === undefined ? {} : { "content-type": "application/json" },
		body: body === undefined ? undefined : JSON.stringify(body)
	});
	return { status: response.status, body: await response.json() };
}

let failures = 0;
function check(label, condition, detail) {
	if (condition) console.log("  ✓", label);
	else {
		failures++;
		console.error("  ✗", label, detail ?? "");
	}
}

{
	const r = await call("GET", "/session-colors/api/colors");
	check("GET empty store → 200 {}", r.status === 200 && JSON.stringify(r.body) === JSON.stringify({ colors: {} }), r);
}
{
	const r = await call("PUT", "/session-colors/api/colors/session-abc", { color: "#FF0000" });
	check("PUT canonicalizes to #ff0000", r.status === 200 && r.body.colors["session-abc"] === "#ff0000", r);
}
{
	const r = await call("PUT", "/session-colors/api/colors/session-def", { color: "#0a8" });
	check("PUT expands 3-digit hex", r.status === 200 && r.body.colors["session-def"] === "#00aa88", r);
}
{
	const r = await call("GET", "/session-colors/api/colors");
	check("GET returns both colors", r.status === 200 && Object.keys(r.body.colors).length === 2, r);
}
{
	const r = await call("PUT", "/session-colors/api/colors/session-abc", { color: "red" });
	check("PUT rejects non-hex color", r.status === 400, r);
}
{
	const r = await call("PUT", "/session-colors/api/colors/bad id/slash", { color: "#123123" });
	check("PUT rejects path-y session id", r.status === 404, r);
}
{
	const r = await call("DELETE", "/session-colors/api/colors/session-def");
	check("DELETE clears one color", r.status === 200 && r.body.colors["session-def"] === undefined, r);
}
{
	const r = await call("POST", "/session-colors/api/colors", {});
	check("POST → 405", r.status === 405, r);
}
{
	const r = await call("GET", "/session-colors/other");
	check("unknown subpath → 404", r.status === 404, r);
}
{
	// Store durability: the file on disk reflects the surviving color.
	const raw = JSON.parse(await readFile(join(home, "storages", "session-colors.json"), "utf8"));
	check("file persisted with version", raw.version === 1 && raw.colors["session-abc"] === "#ff0000", raw);
}
{
	// Store durability: the file on disk reflects the surviving color.
	const raw = JSON.parse(await readFile(join(home, "storages", "session-colors.json"), "utf8"));
	check("file persisted with version", raw.version === 1 && raw.colors["session-abc"] === "#ff0000", raw);
}

server.close();
console.log(failures === 0 ? "\nALL SMOKE CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
```

</details>

**依据 2 · 源码核查**：[smoke-host-phase2.js:39-48](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/smoke-host-phase2.js#L39-L48)

坏数据覆盖预期。

<details>
<summary>查看原文（10行）</summary>

```text
		console.error("  ✗", label, detail ?? "");
	}
}

const r = await call("GET", "/session-colors/api/colors");
check("corrupt store → 200 {}", r.status === 200 && JSON.stringify(r.body) === JSON.stringify({ colors: {} }), r);
const r2 = await call("PUT", "/session-colors/api/colors/session-new", { color: "#123456" });
check("write after corruption repairs file", r2.status === 200 && r2.body.colors["session-new"] === "#123456", r2);
const raw = JSON.parse(await readFile(join(home, "storages", "session-colors.json"), "utf8"));
check("repaired file parses with version 1", raw.version === 1 && raw.colors["session-new"] === "#123456", raw);
```

</details>

**依据 3 · 源码核查**：[smoke-client-dom.js:128-181](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/smoke-client-dom.js#L128-L181)

DOM顺序一致的交互测试。

<details>
<summary>查看原文（54行）</summary>

```text
};
const layer = document.body.querySelector(".dshsc-layer");
check("overlay layer mounted", layer !== null);

// 1. Exact-span matching: s-color is uncolored so far; rowDup1/2 uncolored; nothing painted yet.
check("no color attribute before any color set", ![...document.querySelectorAll("[data-dsh-session-color]")].length);

// 2. Set a color through the API path the plugin itself uses: fetch stub + store set.
//    The store instance is internal; use the hover picker end-to-end instead:
//    hover rowColor → dwell → dot appears → click → palette → pick swatch.
hoverRow(rowColor);
await new Promise((resolve) => setTimeout(resolve, 220));
const dot = layer.querySelector(".dshsc-hoverdot");
check("hover dot appears after dwell", dot !== null && dot.style.display === "inline-flex", dot?.style.display);
dot.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
const swatches = [...layer.querySelectorAll(".dshsc-swatch")];
check("palette opens with 12 swatches", swatches.length === 12, swatches.length);
swatches[0].dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); // red #ef4444
await new Promise((resolve) => setTimeout(resolve, 10));
check("PUT sent for s-color with #ef4444", putCalls.some((c) => c.sessionId === "s-color" && c.body.color === "#ef4444"), putCalls);
check("row painted red after pick", rowColor.getAttribute("data-dsh-session-color") === "#ef4444", rowColor.getAttribute("data-dsh-session-color"));
check("dot filled after pick", dot.dataset.filled === "true", dot.dataset.filled);

// 3. Duplicate titles: color the second "Review PR" session; DOM-order queue gives rowDup1 the color.
hoverRow(rowDup1);
await new Promise((resolve) => setTimeout(resolve, 220));
dot.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
[...layer.querySelectorAll(".dshsc-swatch")][3].dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); // yellow
await new Promise((resolve) => setTimeout(resolve, 10));
// rowDup1 maps to s-dup-1 (DOM order), rowDup2 to s-dup-2 — painting s-dup-1 colors rowDup1 only.
check("duplicate-title first row painted", rowDup1.getAttribute("data-dsh-session-color") === "#eab308", rowDup1.getAttribute("data-dsh-session-color"));
check("duplicate-title second row unpainted", rowDup2.getAttribute("data-dsh-session-color") === null, rowDup2.getAttribute("data-dsh-session-color"));

// 4. Unread row (nested "未读" noise before title) still matches by title span.
hoverRow(rowUnread);
await new Promise((resolve) => setTimeout(resolve, 220));
dot.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
[...layer.querySelectorAll(".dshsc-swatch")][6].dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); // teal
await new Promise((resolve) => setTimeout(resolve, 10));
check("unread-noise row painted", rowUnread.getAttribute("data-dsh-session-color") === "#14b8a6", rowUnread.getAttribute("data-dsh-session-color"));

// 5. Substring trap: "Fix login flow retrospective" must NOT take s-color's color…
check("substring row not painted", rowNoise.getAttribute("data-dsh-session-color") === null, rowNoise.getAttribute("data-dsh-session-color"));
// …and hovering it must NOT show the picker for s-color.
hoverRow(rowNoise);
await new Promise((resolve) => setTimeout(resolve, 220));
check("substring row has no picker", dot.style.display === "none", dot.style.display);

// 6. Plain + blank rows are picker-less.
hoverRow(rowPlain);
await new Promise((resolve) => setTimeout(resolve, 220));
check("uncolored plain row shows picker", dot.style.display === "inline-flex", dot.style.display);
hoverRow(rowBlank);
await new Promise((resolve) => setTimeout(resolve, 220));
```

</details>

**依据 4 · 源码核查**：[lib/index.js:177-185](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/lib/index.js#L177-L185)

持久失败边界。

```text
			if (color === null) delete this.#colors[sessionId];
			else this.#colors[sessionId] = color;
			await this.#persist();
			return { ...this.#colors };
		});
	}
}

/**
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前推荐与可证伪方向是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先观察。颜色组织便利，但写操作目标依赖标题/DOM顺序，持久失败/离线选择也未明确显示，尚不适合把重要会话标签当稳定唯一组织依据。若读者继续试用，限定可信本机单实例、唯一标题、已有JSON备份，设色后刷新核server持久结果；不只信即时色条，也不向未核准入的外部宿主开放接口。

可研究“身份稳定、写入可解释”的标签契约——宿主提供session ID行插槽/属性、按主体分镜像，用户变更带版本并串行/可重试，服务器persist成功才提交或显式pending，跨进程CAS和坏文件留副本。基线为当前标题队列与乐观publish/全量sync。反例含同名倒序/虚拟行、旧GET晚到、离线PUT失败再focus、双tab同ID冲突、磁盘rename失败和两进程写；若仍错ID/丢最后意图或可恢复性未增加，则否定收益。比较错标率、已确认落盘率、恢复工时和重绘资源，未验证方向不计已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:105-155](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/lib/client.js#L105-L155)

同步基线。

<details>
<summary>查看原文（51行）</summary>

```text
			async sync() {
				if (this.syncing) return;
				this.syncing = true;
				try {
					const response = await fetch("/session-colors/api/colors", { cache: "no-store" });
					if (!response.ok) return;
					const body = await response.json();
					if (body === null || typeof body !== "object" || body.colors === null || typeof body.colors !== "object") return;
					const next = new Map(Object.entries(body.colors).filter(([, color]) => typeof color === "string"));
					if (sameMap(next, this.snapshot)) return;
					this.publish(next);
				} catch (error) {
					console.warn("[session-colors] sync failed:", error);
				} finally {
					this.syncing = false;
				}
			}
			/** Optimistically set/clear one session color, then persist via the API. */
			async set(sessionId, color) {
				const next = new Map(this.snapshot);
				if (color === null) next.delete(sessionId);
				else next.set(sessionId, color);
				if (!sameMap(next, this.snapshot)) this.publish(next);
				try {
					const response = await fetch(`/session-colors/api/colors/${encodeURIComponent(sessionId)}`, {
						method: "PUT",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ color })
					});
					if (!response.ok) console.warn("[session-colors] save failed:", response.status);
				} catch (error) {
					console.warn("[session-colors] save failed:", error);
				}
			}
		}
		function readMirror() {
			try {
				const raw = localStorage.getItem(MIRROR_KEY);
				if (raw === null) return;
				const parsed = JSON.parse(raw);
				if (parsed === null || typeof parsed !== "object") return;
				return new Map(Object.entries(parsed).filter(([, color]) => typeof color === "string"));
			} catch {
				return;
			}
		}
		function writeMirror(snapshot) {
			try {
				localStorage.setItem(MIRROR_KEY, JSON.stringify(Object.fromEntries(snapshot)));
			} catch {}
		}
```

</details>

**依据 2 · 源码核查**：[lib/client.js:194-254](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/lib/client.js#L194-L254)

身份基线。

<details>
<summary>查看原文（61行）</summary>

```text
			function sessionQueuesByTitle() {
				const colors = colorStore.getSnapshot();
				const summary = sessionsSummary();
				const queues = /* @__PURE__ */ new Map();
				if (summary === void 0) return queues;
				const ids = summary.ids ?? [];
				for (const sessionId of ids) {
					const session = summary.byId?.[sessionId];
					if (session === void 0 || session.blank) continue;
					const title = typeof session.displayTitle === "string" ? session.displayTitle.trim() : "";
					if (title.length === 0) continue;
					let queue = queues.get(title);
					if (queue === void 0) queues.set(title, queue = []);
					queue.push({ sessionId, color: colors.get(sessionId) ?? null });
				}
				return queues;
			}
			/**
			 * The row's title is its direct-child span with the longest text (the
			 * title span flexes to fill the row; time/unread noise lives in other
			 * or nested spans).
			 */
			function rowTitleText(row) {
				let best = "";
				for (const child of row.children) {
					if (child.tagName !== "SPAN") continue;
					const text = (child.textContent ?? "").trim();
					if (text.length > best.length) best = text;
				}
				return best;
			}
			function repaint() {
				const queues = sessionQueuesByTitle();
				const rows = document.querySelectorAll(ROW_SELECTOR);
				const next = /* @__PURE__ */ new Map();
				const assigned = /* @__PURE__ */ new Set();
				if (queues.size > 0) {
					// Pass 1 — exact title-span match (kills nearly all false positives).
					for (const row of rows) {
						const queue = queues.get(rowTitleText(row));
						if (queue !== void 0 && queue.length > 0) {
							next.set(row, queue.shift());
							assigned.add(row);
						}
					}
					// Pass 2 — whole-row text fallback for titles whose queue still
					// has unconsumed entries (covers unread-flagged/odd row shapes).
					let remaining = false;
					for (const queue of queues.values()) if (queue.length > 0) {
						remaining = true;
						break;
					}
					if (remaining) for (const row of rows) {
						if (assigned.has(row)) continue;
						const text = row.textContent ?? "";
						for (const [title, queue] of queues) {
							if (queue.length > 0 && text.includes(title)) {
								next.set(row, queue.shift());
								assigned.add(row);
								break;
							}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:139-185](https://github.com/7vw58n3ftvq7cn89v/dsh-plugin-session-colors/blob/d0f51131aef40e6bc3f60b560342e22551a972cd/lib/index.js#L139-L185)

持久化基线。

<details>
<summary>查看原文（47行）</summary>

```text
		const body = `${JSON.stringify({ version: STORE_VERSION, colors: this.#colors }, null, 2)}\n`;
		await writeFile(temp, body, "utf8");
		await rename(temp, this.#path);
	}

	/**
	 * Run one read-modify-write cycle behind the write queue.
	 * @template T
	 * @param {() => Promise<T>} task - closure over a snapshot clone.
	 * @returns {Promise<T>} the task's result.
	 */
	#enqueue(task) {
		const run = this.#queue.then(task);
		// Keep the queue alive regardless of individual failures.
		this.#queue = run.then(() => undefined, () => undefined);
		return run;
	}

	/**
	 * Snapshot the current color map (a clone — callers may hold it).
	 * @returns {Promise<Record<string, string>>}
	 */
	snapshot() {
		return this.#enqueue(async () => {
			await this.#load();
			return { ...this.#colors };
		});
	}

	/**
	 * Set or clear one session's color and persist.
	 * @param {string} sessionId - validated session id.
	 * @param {string | null} color - canonical color, or null to clear.
	 * @returns {Promise<Record<string, string>>} the map after the change.
	 */
	set(sessionId, color) {
		return this.#enqueue(async () => {
			await this.#load();
			if (color === null) delete this.#colors[sessionId];
			else this.#colors[sessionId] = color;
			await this.#persist();
			return { ...this.#colors };
		});
	}
}

/**
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
