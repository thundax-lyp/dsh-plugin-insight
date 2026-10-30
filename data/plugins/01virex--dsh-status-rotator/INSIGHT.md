# dsh-status-rotator

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[6f4e8bf](https://github.com/01Virex/dsh-status-rotator/tree/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2)

<!-- BEGIN META -->
[![GitHub ★ 214](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=214&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/01Virex/dsh-status-rotator) [![npm 30d 10,214](https://img.shields.io/static/v1?label=npm+30d&message=10%2C214&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-status-rotator) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-status-rotator)
<!-- END META -->

> **功能**：自定义 DSH 等待文案、渐变、打字机与弹幕，并保存设置及更新词库。

> **亮点**：把个人词库、阶段呈现和包外持久化组合为可调等待区，减少手改宿主的潜在步骤。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：可见状态仍耦合DOM/主题；保存是多副本分步且锁仅同实例，来源栅栏非认证。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 状态定制实际改善谁的什么任务？](#detail-section-11)
  - [Q02 · 配置怎样保存并同步到状态行？](#detail-section-12)
  - [Q03 · DOM共存、状态语义和退出有什么边界？](#detail-section-13)
  - [Q04 · 启动、词库更新和使用怎样闭环？](#detail-section-14)
  - [Q05 · 成本与效果该如何计量？](#detail-section-15)
  - [Q06 · 什么人可试，未来哪种适配值得验证？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人表达型等待区定制，合格结果需保留计时/读屏及退出恢复，而非模型更快。见[Q01](#research-q01)。

原生状态或简单CSS较轻；插件增加可编辑/可保存/阶段轮换组合，实际体验收益未测。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 阶段短句/渐变 | 个人化等待区 | 非真实进度，依赖宿主DOM |
| 设置保存 | 包外保留个人差异 | If-Match与同实例队列，镜像/权威分步 |
| 词库更新 | 获取新内容 | 网络可关，main非固定发布 |
| 弹幕/鲸尾 | 可选视觉表达 | 资源与读屏影响待验 |

**流程与依赖**

本地宿主/存储必需，远端内容与动画可选，不能把源码固定视作词库固定。详表见[Q04](#research-q04)。

先静态短句核保存/重开和原生计时，再逐项启装饰；部分失败先核文件。步骤见[Q04](#research-q04)。

**效果与成本**

资源与人工负担需要同任务观察，代码级降扫不证明净节省。完整表见[Q05](#research-q05)。

个人表达便利可有限探索，真实状态可信才成立。保留与退出条件见[Q06](#research-q06)。

> **思考**：可见状态仍耦合DOM/主题；保存是多副本分步且锁仅同实例，来源栅栏非认证。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把个人词库、阶段呈现和包外持久化组合为可调等待区，减少手改宿主的潜在步骤。见[Q01](#research-q01)、[Q02](#research-q02)。

分层内容所有权、同实例保存队列与定向清理可借鉴；跨进程、镜像和DOM状态仍有边界。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

可见状态仍耦合DOM/主题；保存是多副本分步且锁仅同实例，来源栅栏非认证。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

独立profile、关闭远端/动画开始；不是安装效果验收。见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持配置、保存/推送及显示清理；个人体验、主题兼容和恢复尚无实测，稳定插槽为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、lib/client.js、lib/index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核README/package、host分层/保存/来源栅栏/词库/SSE与client状态DOM/事件/重扫/清理；未逐项审全部动画设置或其他插件实现。
- 下一步：未运行目标；普通宿主加载归范围边界，待研究的体验/主题/并发失败问题逐题保留。

**分析版本**

- **仓库**：[01Virex/dsh-status-rotator](https://github.com/01Virex/dsh-status-rotator)
- **版本号**：0.38.0（[固定提交 6f4e8bf](https://github.com/01Virex/dsh-status-rotator/tree/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

以稳定状态/插槽和隐藏检测减少DOM维护，效果及宿主协作成本待比较。见[Q06](#research-q06)。

未运行目标；普通宿主加载归范围边界，待研究的体验/主题/并发失败问题逐题保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 4232 | — | — | 72458 |
| .cjs | source | 26 | 7153 | 5903 | 956 | — |
| .js | source | 3 | 12060 | 9369 | 2394 | — |
| .mjs | source | 1 | 111 | 88 | 15 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=15&color=737b86&logo=github)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/01Virex/dsh-status-rotator/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：个性化等待区能否保留可信状态和个人配置，其兼容维护负担是否值得？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 状态定制实际改善谁的什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合喜欢个人化等待区的 DSH Web/Desktop 用户。插件把原生等待短句替换成可编辑、按阶段轮换的文字，附打字机、渐变、弹幕及可选鲸尾。相对手改宿主/CSS，多出词库和设置入口、包外保存与随状态刷新；合格结果是个人文案可见、原生计时/读屏仍准确且禁用能恢复。

这是等待体验定制，不改变模型速度、推理或工具结果；短句和动画不代表任务完成百分比。作者列短句/主题数量，本轮不逐条确认，数量不参与价值推断。没有长期等待用户对照，需求强度主要是偏好便利，原生显示对不重视定制者已足够。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-11](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/README.md#L3-L11)

作者定位为可编辑等待短句并保留宿主计时。

```text
> Give DSH's running status your own voice: **custom phrases, typewriter output, day/night gradients, danmaku and an optional animated whale tail**. Ships **1483 phrases, 14 theme packs**; choose which packs to enable.

**English** | [中文](./README_ZH.md) · [Effects](#effect-preview) · [Install](#installation) · [Reference](#feature-overview) · [Changelog](./CHANGELOG.md)

[![npm version](https://img.shields.io/npm/v/dsh-status-rotator?color=4a6cf7)](https://www.npmjs.com/package/dsh-status-rotator)
[![GitHub stars](https://img.shields.io/github/stars/01Virex/dsh-status-rotator?color=4a6cf7)](https://github.com/01Virex/dsh-status-rotator)
[![license](https://img.shields.io/github/license/01Virex/dsh-status-rotator)](LICENSE)

A [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) client plugin that replaces `Deep diving...` / `深度求索中...` with editable phrases while preserving the host's elapsed-time clock.
```

**依据 2 · 源码核查**：[package.json:2-5](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/package.json#L2-L5)

实际版本0.38.0与描述。

```text
    "name": "dsh-status-rotator",
    "version": "0.38.0",
    "description": "Turn the DSH Web status line into a 1483-phrase meme machine: phase-aware phrases, typewriter, rainbow gradient, danmaku and 14 theme packs, all editable from the settings page.",
    "type": "module",
```

**依据 3 · 源码核查**：[package.json:96-105](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/package.json#L96-L105)

原生bundle/Web入口。

<details>
<summary>查看原文（10行）</summary>

```text
    "dsh": {
        "bundle": {
            "patch": "./cordis.patch.yml"
        },
        "client": {
            "platform": "web",
            "inject": [],
            "immediately": true
        }
    },
```

</details>

#### 缺口

- 缺个人等待体验、状态理解与注意力负担对照。
  **影响**：不能把趣味性写成效率收益。
  **进一步探讨**：同样长任务比较原生/定制的误读、干扰和持续偏好。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配置怎样保存并同步到状态行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

host合成内置、包文件、远端词库、宿主设置、用户存储与外部词库，外部两层只保留packs/phrases。用户显式差异保存在包外目录，临时文件rename后更新缓存；读取生成与正文一致的ETag，客户端通过SSE通知和定时重载取得配置。

保存入口对PUT/POST先校验请求来源，再用模块内withSaveLock把完整校验/落盘串起来。If-Match不匹配拒409，缺省或*仍允许无条件写。锁改善同实例同时保存，但不是跨进程/跨实例文件锁。单文件rename防半文件，不等于多个副本共同事务：实现先写包内兼容镜像，再写权威用户存储，后者失败回500时镜像可能已变；应保留现场并读回，不按错误推全部未写。

client观察宿主状态DOM、主题/会话变化并重接；默认兜底重扫10秒且隐藏页不做，常规更新由事件/定向观察器驱动。它维护的是显示副本，服务同步成功不能证明用户实际看到或宿主执行成功。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1382-1394](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/index.js#L1382-L1394)

实际配置层合成顺序。

<details>
<summary>查看原文（13行）</summary>

```text
	const fileDoc = await readFileDocument(true);
	// 两个可选的词库层,顺序即优先级(低 → 高):
	//   自动更新词库(remote):上游 main 的 config.example.json 落盘缓存,压在
	//     config.json 之上(否则插件目录/示例文件层会把它整份顶掉),但在用户配置之下
	//     —— 用户显式保存过的包仍以用户为准;上游新增的包按 id 追加,不影响其余包。
	//   本地词库(bank):手改的那份,优先级最高,改完即生效(见 externalBankDocument)。
	// 两者都只带 packs / phrases,不会碰运行时配置。
	const remoteDoc = await remoteBankDocument();
	// 用户配置存储($DSH_HOME/status-rotator/config.json):设置页保存的落点,
	// 也是「手改 config.json」被搬过来的落点;升级插件不会清空它(issue #51)。
	const storedDoc = await healedUserConfigDocument();
	const bankDoc = await externalBankDocument();
	return mergeLayers(await bundledDocument(), fileDoc, remoteDoc, userDoc, storedDoc, bankDoc);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1196-1213](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/index.js#L1196-L1213)

包外单文件原子写。

<details>
<summary>查看原文（18行）</summary>

```text
/** 原子写用户配置存储(先写同目录临时文件再 rename);写不进去就抛,由调用方决定怎么报错 */
async function writeUserConfigDocument(doc) {
	const path = userConfigPath();
	await mkdir(dirname(path), { recursive: true });
	const tmpPath = `${path}.tmp-${process.pid}-${Date.now()}`;
	try {
		await writeFile(tmpPath, JSON.stringify(doc, null, 4) + "\n", "utf8");
		await rename(tmpPath, path);
	} catch (error) {
		try {
			await unlink(tmpPath);
		} catch (cleanupError) {
			if (cleanupError.code !== "ENOENT") throw cleanupError;
		}
		throw error;
	}
	// 写盘后就地更新缓存(mtimeNs 置空 → 下一次读会重新 stat,拿到的仍是盘上的真实内容)
	userConfigCache = { path, mtimeNs: null, size: -1, text: null, doc, reloads: userConfigCache.path === path ? userConfigCache.reloads + 1 : 1, error: null };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1604-1620](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/index.js#L1604-L1620)

模块保存队列。

<details>
<summary>查看原文（17行）</summary>

```text
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
}

/**
 * SSE 订阅者。
 * 为什么是 SSE 而不是 WebSocket:宿主 webserver 的 register 明确写着 handler
 * 「may hold the response open, e.g. SSE」,而 registerUpgrade 要自己实现 RFC6455 的
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1743-1750](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/index.js#L1743-L1750)

请求入口实际使用保存锁。

```text
		if (req.method === "PUT" || req.method === "POST") {
			if (!isTrustedWrite(req)) {
				rejectUntrusted(res, "写入");
				return;
			}
			// 整段保存串行化 —— 校验与落盘之间不允许另一个 PUT 插队
			await withSaveLock(() => saveConfig(req, res, getSettingsApi));
			return;
```

**依据 5 · 源码核查**：[lib/index.js:1786-1824](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/index.js#L1786-L1824)

条件保存及镜像/权威存储分步。

<details>
<summary>查看原文（39行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1656-1682](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/index.js#L1656-L1682)

SSE通知与heartbeat。

<details>
<summary>查看原文（27行）</summary>

```text
function openSseStream(res, etag) {
	res.writeHead(200, {
		"content-type": "text/event-stream; charset=utf-8",
		"cache-control": "no-cache, no-transform",
		"connection": "keep-alive",
		// 反向代理默认会缓冲响应,SSE 就推不动了
		"x-accel-buffering": "no"
	});
	if (typeof res.flushHeaders === "function") res.flushHeaders();
	sseClients.add(res);
	const heartbeat = setInterval(() => {
		try {
			if (res.writableEnded === true) throw new Error("closed");
			res.write(": ping\n\n");
		} catch (error) {
			clearInterval(heartbeat);
			sseClients.delete(res);
		}
	}, SSE_HEARTBEAT_MS);
	const cleanup = () => {
		clearInterval(heartbeat);
		sseClients.delete(res);
	};
	res.on("close", cleanup);
	res.on("error", cleanup);
	try {
		res.write("data: " + JSON.stringify({ type: "hello", etag, at: Date.now() }) + "\n\n");
```

</details>

**依据 7 · 源码核查**：[lib/client.js:5242-5267](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/client.js#L5242-L5267)

事件驱动与兜底重扫。

<details>
<summary>查看原文（26行）</summary>

```text
			 * 兜底重扫(默认 10 秒一次、可配、页面隐藏时不做;0 = 关)。**不再是**每 2 秒的
			 * 常驻轮询(issue #166):常规接管由 MutationObserver / sourceObserver 事件驱动,
			 * 服务晚就绪由限次重试,截断由 ResizeObserver,遮罩由定向属性观察;这一拍只兜
			 * 「事件覆盖不到的边角」,并且用 requestIdleCallback 等宿主空闲再跑。
			 */
			let lastSeenStatusCount = -1;
			const rescanAll = () => {
				const status = document.querySelectorAll('[role="status"][aria-live="polite"]');
				if (status.length !== lastSeenStatusCount) {
					lastSeenStatusCount = status.length;
					log("rescan: 状态标签 ×", status.length);
				}
				for (const el of status) adopt(el);
				// 会话/输入框座位重渲染可能把那行状态行一起换掉:清掉失效的再重扫重建
				for (const line of Array.from(lineButtons.keys())) {
					if (!line.isConnected) releaseStatusLine(line);
				}
				scanTurnProcess(document.body);
				scanRunningRows(document.body);
				pruneWatchedButtons();
				// 实时引擎兜底:用户在会话间切换时重新接一次线;「服务晚于插件就绪」
				// 由 scheduleBootstrapRetry 的限次重试负责,不再靠无限期轮询
				try {
					wireLiveEngine();
					syncCurrentSession();
				} catch (error) { /* ignore */ }
```

</details>

#### 缺口

- 同条件并发、镜像已写但权威失败后的重载语义缺运行证据。
  **影响**：不能承诺所有失败均保持原设置或跨进程无覆盖。
  **进一步探讨**：一次性profile模拟两保存者及存储只读，核镜像、用户文件、ETag与重开显示。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · DOM共存、状态语义和退出有什么边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

客户端按data-turn-process、data-chat-running及局部结构识别多代宿主，阶段变化选择文案，时长尽量搬宿主显示；这仍依赖宿主DOM契约。它公开自己的行标记供第三方CSS白名单使用，但标记不能强制别的主题放行。源码明确提到外部样式可令它继续运行却不可见，本轮没有复现具体组合，不把旧版本主题例子迁成当前已确认故障。

要分别核真实运行/重试信号、计时和读屏公告，再看装饰文案。动画、随机短句或自定义标题都不能当业务进度。清理effect解绑事件、观察器、SSE、定时器，清状态并恢复所持标题，提供可退出设计；是否在目标宿主无样式/DOM残留仍需现场核对。

配置路由自做JSON/Fetch-Site/Origin检查，缺Origin被允许，同源也不等于账号认证。源码说明DNS rebinding及暴露LAN的边界；不能把这些检查说成宿主认证/api等价。限定本地受控环境，不建议因有来源检查而直接开放到网络。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:2967-3015](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/client.js#L2967-L3015)

选择器、公开标记及不自愈的具体说明。

<details>
<summary>查看原文（49行）</summary>

```text
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
			/** 插件给宿主鲸鱼尾巴加的类:样式表据此给它上炫彩流光 */
			const TAIL_CLASS = "dsh-status-rotator-whale-tail";
			const TAIL_WAG_CLASS = "dsh-status-rotator-whale-wag";
			const TAIL_MORPH_CLASS = "dsh-status-rotator-tail-morph";
			// Traced from the supplied 24-frame GIF (20 ms/frame). Preserve its one-sided
```

</details>

**依据 2 · 源码核查**：[lib/client.js:5128-5144](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/client.js#L5128-L5144)

宿主时长与阶段同步。

<details>
<summary>查看原文（17行）</summary>

```text
				if (clock) {
					if (clock.textContent !== duration) clock.textContent = duration;
					// 「只用宿主原文」= 纯 0.1.6 观感,连时钟的出现时机也照旧版:
					// 0.1.6 的 TurnStatus 是 elapsedMs >= 15s 才渲染时钟子元素
					// (showClock = elapsedMs >= 15e3),这里照做。默认(轮换短语)模式下
					// 时钟一直显示 —— 新宿主自己从第一秒就把时长写进标签里。
					const gate = config.labelSource === "host";
					const show = !gate || parseClock(duration) * 1000 >= HOST_CLOCK_APPEAR_MS;
					clock.style.display = show ? "" : "none";
				}
				alignStatusLine(line, line.parentElement);
				const phase = phaseOf(line);
				const previous = turnPhases.get(line);
				turnPhases.set(line, phase);
				// 时钟出现(thinking → running)或跨过 longAfterMs 时立刻换文案,
				// 与旧宿主「时钟出现即切换」的手感一致;首次接管由 adopt 自己 refresh。
				if (previous !== undefined && previous !== phase) refresh(line);
```

</details>

**依据 3 · 源码核查**：[lib/client.js:6666-6708](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/client.js#L6666-L6708)

清理事件/观察器/计时与标题。

<details>
<summary>查看原文（43行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/index.js:618-649](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/index.js#L618-L649)

Origin和Fetch-Site实际判定及边界。

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

#### 缺口

- 主题组合、读屏和目标宿主显示正确性未知。
  **影响**：不可宣称所有主题共存或状态语义可靠。
  **进一步探讨**：固定宿主与主题组合核可见状态、读屏、计时和禁用后恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、词库更新和使用怎样闭环？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web/Desktop及DOM接缝 | 启动/显示必需 | 客户端接管与设置入口 | 模块加载不代表行可见，版本组合另验 |
| host WebServer及包外可写存储 | 保存/同步必需 | 配置/SSE与跨升级保存 | 保存可500，读回后再处理 |
| 远端词库网络/CDN | 可选 | 默认main内容、每六小时更新 | 失败保留上次，非固定发布内容 |
| 本地外部词库 | 可选 | 个人高优先级内容 | 修改需核层级，不直接覆盖整份配置 |
| 动画/弹幕资源 | 可选 | 个人视觉效果 | CPU/干扰未知，可逐项关闭 |

远端fetch有15秒超时、只保留词库字段，2MiB检查发生在response.text全部读完之后，不能当网络读入内存的严格上界。定时更新会改变相同代码版本下的内容，需稳定复现者应关闭/固定词库。作者说明尾巴/尾动默认关而弹幕默认开，第一次应主动核自己的配置。

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份包外配置、选独立profile | 记录宿主/插件版本及词库来源 |
| 加载 | 用户安装重启后看设置页 | 无页面先核route/加载，不写入覆盖 |
| 定制 | 用户先关远端与非必要动画，仅改一句 | 保存后读回、重开仍在；冲突先重读 |
| 执行 | 用户跑一段长回合 | 核真实计时/读屏和行可见，再逐项启装饰 |
| 恢复 | 用户停插件保留配置 | 原生状态回来；失败保存先核镜像和权威文件 |


#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:90-95](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/index.js#L90-L95)

远端默认main与六小时。

```text
const DEFAULT_BANK_URL = "https://cdn.jsdelivr.net/gh/01Virex/dsh-status-rotator@main/config.example.json";
/** 自动更新检查间隔(毫秒);未设置 = 6 小时,0 / 非法 = 关闭 */
const BANK_INTERVAL_ENV = "DSH_STATUS_ROTATOR_BANK_INTERVAL_MS";
const DEFAULT_BANK_INTERVAL_MS = 6 * 60 * 60 * 1000;
/** 上游词库的落盘缓存文件名(放在本地词库文件同目录,用户不用手改) */
const BANK_REMOTE_FILE = "bank.remote.json";
```

**依据 2 · 源码核查**：[lib/index.js:862-883](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/index.js#L862-L883)

下载/超时与读完后大小检查。

<details>
<summary>查看原文（22行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:907-939](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/index.js#L907-L939)

失败保留和调度清理。

<details>
<summary>查看原文（33行）</summary>

```text
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
```

</details>

**依据 4 · 作者声明**：[README.md:88-94](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/README.md#L88-L94)

作者重启、设置与默认装饰说明。

````text
```bash
dsh plugin --profile web add dsh-status-rotator
```

Restart `dsh web`, then open **Settings → Status Texts** and start a turn. For Desktop, use the npm walkthrough above or its command-line alternative. Later settings changes save and apply automatically; restart the corresponding host after upgrading plugin code.

The whale tail and tail motion start off; enable them under **Appearance → Whale tail**. Danmaku starts on and can be disabled under **Appearance → Danmaku**.
````

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 成本与效果该如何计量？

**研究主题**：效果与总成本

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/本地存储；无已核额外模型请求 | 安装、词库/动画选择 | 时间未知，不能写免费低成本 |
| 持续使用 | DOM观察、动画/SSE与CDN网络 | 文案和主题兼容维护 | CPU/内存及注意力负担未测 |
| 失败恢复 | 保存/同步排错、重载 | 对照镜像/用户文件、处理冲突 | 同实例串行不覆盖跨进程，恢复耗时未知 |
| 升级退出 | 配置保留及兼容维护 | 备份、检查原生状态恢复 | 清理代码不等于恢复已验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 个人等待显示 | 编辑词库和状态行接线 | 偏好、误读和持续使用收益 |
| 配置保存 | 包外rename、条件保存及同实例队列 | 跨进程/部分失败恢复 |
| 降低空闲工作 | 定向事件与隐藏页重扫控制 | 相对原生/旧方式实际CPU差异 |

合格单位是一次长回合中状态仍可信且个性化设置保留，不是短句轮换数。没有任务对照，不能给节时、成功率或模型费用节省。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1196-1213](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/index.js#L1196-L1213)

持久成本与原子写。

<details>
<summary>查看原文（18行）</summary>

```text
/** 原子写用户配置存储(先写同目录临时文件再 rename);写不进去就抛,由调用方决定怎么报错 */
async function writeUserConfigDocument(doc) {
	const path = userConfigPath();
	await mkdir(dirname(path), { recursive: true });
	const tmpPath = `${path}.tmp-${process.pid}-${Date.now()}`;
	try {
		await writeFile(tmpPath, JSON.stringify(doc, null, 4) + "\n", "utf8");
		await rename(tmpPath, path);
	} catch (error) {
		try {
			await unlink(tmpPath);
		} catch (cleanupError) {
			if (cleanupError.code !== "ENOENT") throw cleanupError;
		}
		throw error;
	}
	// 写盘后就地更新缓存(mtimeNs 置空 → 下一次读会重新 stat,拿到的仍是盘上的真实内容)
	userConfigCache = { path, mtimeNs: null, size: -1, text: null, doc, reloads: userConfigCache.path === path ? userConfigCache.reloads + 1 : 1, error: null };
```

</details>

**依据 2 · 源码核查**：[lib/client.js:5242-5267](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/client.js#L5242-L5267)

事件和重扫开销控制。

<details>
<summary>查看原文（26行）</summary>

```text
			 * 兜底重扫(默认 10 秒一次、可配、页面隐藏时不做;0 = 关)。**不再是**每 2 秒的
			 * 常驻轮询(issue #166):常规接管由 MutationObserver / sourceObserver 事件驱动,
			 * 服务晚就绪由限次重试,截断由 ResizeObserver,遮罩由定向属性观察;这一拍只兜
			 * 「事件覆盖不到的边角」,并且用 requestIdleCallback 等宿主空闲再跑。
			 */
			let lastSeenStatusCount = -1;
			const rescanAll = () => {
				const status = document.querySelectorAll('[role="status"][aria-live="polite"]');
				if (status.length !== lastSeenStatusCount) {
					lastSeenStatusCount = status.length;
					log("rescan: 状态标签 ×", status.length);
				}
				for (const el of status) adopt(el);
				// 会话/输入框座位重渲染可能把那行状态行一起换掉:清掉失效的再重扫重建
				for (const line of Array.from(lineButtons.keys())) {
					if (!line.isConnected) releaseStatusLine(line);
				}
				scanTurnProcess(document.body);
				scanRunningRows(document.body);
				pruneWatchedButtons();
				// 实时引擎兜底:用户在会话间切换时重新接一次线;「服务晚于插件就绪」
				// 由 scheduleBootstrapRetry 的限次重试负责,不再靠无限期轮询
				try {
					wireLiveEngine();
					syncCurrentSession();
				} catch (error) { /* ignore */ }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:6666-6695](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/client.js#L6666-L6695)

退出需清理的资源。

<details>
<summary>查看原文（30行）</summary>

```text
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
```

</details>

#### 缺口

- 缺体验/资源和维护耗时对照。
  **影响**：无法量化净价值。
  **进一步探讨**：同任务测误读、CPU/内存、配置修正和退出耗时。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么人可试，未来哪种适配值得验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

希望个人化等待区且愿意排查主题兼容的人，可在独立profile先只试短句，关闭远端和动画，再核保存重开、读屏、计时与禁用恢复。它的价值是表达便利，不是执行提速；不关心视觉定制者保留原生即可。

保留条件是个人偏好改善且真实状态可理解、配置不丢、资源负担可接受。若文案遮蔽时钟、读屏/主题冲突、保存后内容意外改变，就禁用并备份包外文件回原生，不反复保存掩盖冲突。无同版本宿主验收，只支持有限试用。

未验证方向是稳定状态数据加呈现插槽，并显式检测行被隐藏，而非只公开CSS标记。相对当前多代DOM接管，可能减少升级和主题冲突维护，代价是宿主协作与fallback复杂度。固定两代宿主和一项主题比较可见/读屏正确、修复代码和后台负担；若仍需同量DOM补丁、不减错误或增加资源，则否定该优势。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:2973-2993](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/client.js#L2973-L2993)

公开标记但非自愈，支持稳定接缝假设。

<details>
<summary>查看原文（21行）</summary>

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
			 */
			const LINE_MARKER_ATTR = "data-dsh-status-rotator-line";
```

</details>

**依据 2 · 源码核查**：[lib/client.js:5242-5267](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/client.js#L5242-L5267)

当前DOM重扫与事件基线。

<details>
<summary>查看原文（26行）</summary>

```text
			 * 兜底重扫(默认 10 秒一次、可配、页面隐藏时不做;0 = 关)。**不再是**每 2 秒的
			 * 常驻轮询(issue #166):常规接管由 MutationObserver / sourceObserver 事件驱动,
			 * 服务晚就绪由限次重试,截断由 ResizeObserver,遮罩由定向属性观察;这一拍只兜
			 * 「事件覆盖不到的边角」,并且用 requestIdleCallback 等宿主空闲再跑。
			 */
			let lastSeenStatusCount = -1;
			const rescanAll = () => {
				const status = document.querySelectorAll('[role="status"][aria-live="polite"]');
				if (status.length !== lastSeenStatusCount) {
					lastSeenStatusCount = status.length;
					log("rescan: 状态标签 ×", status.length);
				}
				for (const el of status) adopt(el);
				// 会话/输入框座位重渲染可能把那行状态行一起换掉:清掉失效的再重扫重建
				for (const line of Array.from(lineButtons.keys())) {
					if (!line.isConnected) releaseStatusLine(line);
				}
				scanTurnProcess(document.body);
				scanRunningRows(document.body);
				pruneWatchedButtons();
				// 实时引擎兜底:用户在会话间切换时重新接一次线;「服务晚于插件就绪」
				// 由 scheduleBootstrapRetry 的限次重试负责,不再靠无限期轮询
				try {
					wireLiveEngine();
					syncCurrentSession();
				} catch (error) { /* ignore */ }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1743-1750](https://github.com/01Virex/dsh-status-rotator/blob/6f4e8bf7bf4a23c8a576a1fe5c24196b7e5f03d2/lib/index.js#L1743-L1750)

当前同实例保存接缝供试用核查。

```text
		if (req.method === "PUT" || req.method === "POST") {
			if (!isTrustedWrite(req)) {
				rejectUntrusted(res, "写入");
				return;
			}
			// 整段保存串行化 —— 校验与落盘之间不允许另一个 PUT 插队
			await withSaveLock(() => saveConfig(req, res, getSettingsApi));
			return;
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
