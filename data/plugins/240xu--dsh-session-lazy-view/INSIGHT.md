# @240xu/dsh-session-lazy-view

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[6224eb1](https://github.com/240xu/dsh-session-lazy-view/tree/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d)

<!-- BEGIN META -->
[![npm 30d 1,359](https://img.shields.io/static/v1?label=npm+30d&message=1%2C359&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-session-lazy-view) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@240xu/dsh-session-lazy-view)
<!-- END META -->

> **实现功能**：以独立网页只读查看本地会话尾帧，提供时间线、搜索、统计及Markdown导出。

> **核心亮点**：多帧尾部读取把“找最近事件”从完整解压拆成有界窗口查看，并把seq、turn和遮蔽投影组合为只读诊断入口；收益依赖多帧文件与局部问题，不代表全文检索有界。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：“惰性”仅对tail和fast统计成立，搜索/全统计先分配文件大小buffer；搜索匹配文本化后最多2000字且有500帧上限。路径防护是词法normalize前缀，未解析realpath，因此不能把根目录边界称为抗符号链接隔离。参见[Q03](#research-q03)。

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
  - [Q01 · 谁需要长会话按需浏览，相对手工或宿主原生办法增加什么？](#detail-section-11)
  - [Q02 · 时间线索引、分页与搜索一致性如何从入口形成完整调用链，依赖失效怎么办？](#detail-section-12)
  - [Q03 · 什么实现边界最可能使长会话按需浏览的贡献不成立，哪些工程设计可复用？](#detail-section-13)
  - [Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？](#detail-section-14)
  - [Q05 · 可从时间线索引、分页与搜索一致性的限制推导什么可证伪改进？](#detail-section-15)
  - [Q06 · 哪些用户可以受控采用长会话按需浏览，何时应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向排查超大会话最后发生了什么的Harness维护者。合格输出是可追溯到会话和seq的最近事件，而非替代完整轨迹或修改会话；原办法为完整解压后检索。多帧格式使读取尾窗口具有针对性增量，旧单帧没有同等收益。

完整解压+文本搜索保留全貌但对局部排查付出更多IO；宿主完整轨迹能补足上下文，此插件不替代它。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 尾帧读取 | 最近事件排查 | 多帧有效，窗口上限与文本截断 |
| 会话搜索 | 按可见文本定位事件 | 500帧上限，partial不等于完整 |
| fast/完整统计 | 大小帧数及事件统计 | fast为魔数计数，完整分支整文件内存 |
| 时间线和导出 | turn阅读及文本分享 | 只读投影，非完整原件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node >=24与zstd API | 必需 | 解压会话帧 | 缺少zstdDecompressSync无法读取 |
| webServer及schemastery | 必需 | 注册独立HTTP面板 | 没有侧栏替代入口 |
| ~/.dsh/sessions可读 | 必需 | 固定根目录发现会话 | 非该目录存储不可见 |
| loopback Host与same-origin请求 | 必需 | 保护本地会话内容 | 远程hostname访问返回403 |
| 独立多帧artifact | 惰性收益必需 | 尾部少量解压 | legacy单帧仍可能全量解压 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 安装并重启web profile | 访问loopback /lazyview，不能依赖侧栏入口 |
| 2 | 列举后选择tail | 核对会话path、seq及truncatedScan |
| 3 | 按需搜索/统计/导出 | 注意partial、frameErrors和文本截断 |
| 4 | 发现缺口回完整原始artifact复核 | 不从“未命中”推断事件不存在 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node/web profile与本地磁盘，金额未知 | 安装及确认会话路径，时间未知 | 没有额外模型调用链 |
| 持续使用 | 尾窗最大64MB，搜索/全统计分配整文件内存 | 检查partial及原始事件，工时未知 | 同步解压仍有单帧阻塞 |
| 失败恢复 | 重新读取和完整解压资源，量未知 | 核对坏帧、并发截断、格式差异 | 无会话写入，下载导出由用户保管 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 快速尾部检查 | 窗口增长有上限，跳过部分旧帧 | 真实大文件延迟和峰值内存 |
| 搜索与统计 | 有partial/abort与fast计数分支 | 魔数误判及文本截断下完整性 |
| 只读诊断 | 源文件以r打开，GET接口返回投影 | 符号链接逃逸及部署访问边界 |

> **思考**：“惰性”仅对tail和fast统计成立，搜索/全统计先分配文件大小buffer；搜索匹配文本化后最多2000字且有500帧上限。路径防护是词法normalize前缀，未解析realpath，因此不能把根目录边界称为抗符号链接隔离。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：多帧尾部读取把“找最近事件”从完整解压拆成有界窗口查看，并把seq、turn和遮蔽投影组合为只读诊断入口；收益依赖多帧文件与局部问题，不代表全文检索有界。参见[Q01](#research-q01)、[Q02](#research-q02)。

多帧尾部读取把“找最近事件”从完整解压拆成有界窗口查看，并把seq、turn和遮蔽投影组合为只读诊断入口；收益依赖多帧文件与局部问题，不代表全文检索有界。参见[Q01](#research-q01)、[Q02](#research-q02)。

尾窗、有界扫描、句柄finally与纯函数时间线便于借鉴；复用需保留数据格式、投影截断和本地信任假设，不能将magic计数当严格帧解析。

<a id="detail-section-5"></a>

### 1.4 主要限制

“惰性”仅对tail和fast统计成立，搜索/全统计先分配文件大小buffer；搜索匹配文本化后最多2000字且有500帧上限。路径防护是词法normalize前缀，未解析realpath，因此不能把根目录边界称为抗符号链接隔离。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合本机维护者先用只读小范围试用，默认tail或fast统计；搜索未命中和统计异常必须回原件复核。远程共享服务、任意符号链接目录或需完整审计时暂缓。参见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

只读尾帧与投影机制有源码支持；完整性、性能及新游标假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/frames.js、lib/timeline.js、lib/artifact.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读路由、帧读取、搜索统计与时间线；未运行目标测试、压缩fixture或宿主。
- 下一步：用固定会话中的已知seq做尾帧和全文对照，记录覆盖、RSS、延迟、并发截断和恢复结果。

**分析版本**

- **仓库**：[240xu/dsh-session-lazy-view](https://github.com/240xu/dsh-session-lazy-view)
- **版本号**：0.3.6（[固定提交 6224eb1](https://github.com/240xu/dsh-session-lazy-view/tree/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可把搜索改为带文件身份与大小边界的逐帧流式游标，返回已扫字节/seq及截断原因，缓存只绑定不可变前缀。对照当前实现用追加、截断、超大帧和长文本测峰值内存与漏检；内存未降或漏检上升则否定，维护索引成本也须计入。假设未验证。参见[Q05](#research-q05)。

用固定会话中的已知seq做尾帧和全文对照，记录覆盖、RSS、延迟、并发截断和恢复结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 768 | 532 | 205 | — |
| .md | source | 2 | 256 | — | — | 3301 |
| .js | test | 3 | 357 | 308 | 35 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/240xu/dsh-session-lazy-view/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 6224eb1e41b9408de1a9aec2749a21a4e0c8f31d 和截止 2026-10-23T01:41:11Z 范围内，长会话按需浏览能为明确用户提供什么可核查增量，其关键限制、总成本和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要长会话按需浏览，相对手工或宿主原生办法增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护者排查长会话最近异常时，需要找到会话path/seq而不先完整解压。插件用尾帧和只读投影提供局部诊断，相对完整解压的增量依赖独立多帧与尾部问题；legacy单帧及完整法证任务不能据此省略原件。

作者的只读定位与独立面板明确。相对完整Trajectory，插件交付的是事件投影与局部导出，文本截断不能作为法证原件。收益取决于文件由独立zstd帧组成且问题发生于尾部，若要全历史上下文仍需完整扫描。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-13](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/README.md#L1-L13)

作者定义独立只读诊断用途

<details>
<summary>查看原文（13行）</summary>

```text
# @240xu/dsh-session-lazy-view

> **怎么打开**：安装后访问 **`http://<dsh-web-地址>/lazyview`** 即是独立面板页；
> DSH 宿主侧边栏没有本插件入口是**有意设计**（纯只读工具，不污染主界面）。
> 可选：若你另装了 dsh-devkit，**Ctrl+K** 命令面板里会有「打开」入口；没装也不影响本插件。

DSH web 插件：**会话惰性查看器**（纯只读）。列出 `~/.dsh/sessions` 下全部会话（只 stat 不解压），
并可只解压任意会话文件的**最后 1–2 个 zstd 帧**快速查看最近发生的事件，不碰整份文件。

不做删除、不做归档、不是 Trajectory 替代品；对 `~/.dsh/sessions` 零写入。


## 10 秒速查
```

</details>

**依据 2 · 源码核查**：[lib/frames.js:81-118](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/lib/frames.js#L81-L118)

尾窗选择与增长构成机制支持

<details>
<summary>查看原文（38行）</summary>

```text
export async function readTailFrames(filePath, count = 2, skip = 0) {
	const handle = await open(filePath, "r");
	try {
		const { size } = await handle.stat();
		let window = Math.min(size, Math.max(TAIL_WINDOW, count * (256 << 10)));
		for (;;) {
			const from = Math.max(0, size - window);
			const buf = Buffer.alloc(size - from);
			await handle.read(buf, 0, buf.length, from);
			const offsets = scanFrameOffsets(buf);
			const candidates = decompressAllFrames(buf, offsets).map((frame) => ({
				...frame,
				// absolute file offset, so pagination UI can show real positions
				absStart: from + frame.start,
				absEnd: from + frame.end
			}));
			// Only frames that decompressed cleanly count as readable; a candidate
			// at the very window edge that failed is likely truncated by the window.
			const ok = candidates.filter((frame) => frame.text !== void 0);
			const edgeTruncated = candidates.some((frame) => frame.text === void 0 && frame.start === 0 && from > 0);
			if (ok.length >= count + skip && !edgeTruncated) {
				const picked = ok.slice(-(count + skip), ok.length - skip).reverse();
				return {
					size,
					frames: picked.map((frame, i) => ({ index: skip + i, ...describeFrame(frame) }))
				};
			}
			if (window >= size || window >= TAIL_WINDOW_MAX) {
				// Whole file scanned (or cap hit): report what we have, newest first.
				const picked = ok.slice(-(count + skip), ok.length - skip).reverse();
				return {
					size,
					frames: picked.map((frame, i) => ({ index: skip + i, ...describeFrame(frame) })),
					truncatedScan: window >= TAIL_WINDOW_MAX && window < size
				};
			}
			window = Math.min(window * 4, TAIL_WINDOW_MAX, size);
		}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 时间线索引、分页与搜索一致性如何从入口形成完整调用链，依赖失效怎么办？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Host effect注册/lazyview，先经本地信任门，再列举固定sessions根或按path读artifact；tail扫描尾窗候选zstd帧，事件文本化后进入面板，时间线按seq/turn分组。Node24/zstd、webServer及可读会话必需；用户安装重启后访问独立loopback页，先tail再按需搜索，错误/partial回原件处理。

信任门检查Host、Sec-Fetch-Site与Origin，不是用户身份授权；输入path限制artifact形状后做词法根前缀检查。时间线是纯数据投影，不会改变宿主消息的真实遮蔽状态。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:54-68](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/lib/index.js#L54-L68)

本地请求信任门

<details>
<summary>查看原文（15行）</summary>

```text
/** Same trust gate as archived-sessions: loopback Host, no cross-site fetch, same-origin. */
function isTrustedApiRequest(request) {
	const host = header(request.headers, "host");
	if (host === void 0) return false;
	const hostUrl = parseAuthority(host);
	if (hostUrl === void 0) return false;
	if (!isLoopbackHostname(hostUrl.hostname)) return false;
	if (header(request.headers, "sec-fetch-site") === "cross-site") return false;
	const origin = header(request.headers, "origin");
	if (origin === void 0) return true;
	try {
		return new URL(origin).host === hostUrl.host;
	} catch {
		return false;
	}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:99-115](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/lib/index.js#L99-L115)

path形状及词法边界

<details>
<summary>查看原文（17行）</summary>

```text
function resolveSessionPath(relativePath) {
	if (typeof relativePath !== "string" || relativePath === "") throw badRequest("session path is required");
	const root = SESSIONS_ROOT();
	const full = normalize(join(root, relativePath));
	if (full !== root && !full.startsWith(root + sep)) throw badRequest("session path escapes the sessions root");
	return full;
}

/**
 * Only the two known artifact names are ever opened; ?path= must end in one
 * of them so a stray path cannot be used as a file probe. Shared by every
 * artifact-backed endpoint (tail / search / stats / export).
 */
function requireArtifactPath(url) {
	const path = url.searchParams.get("path") ?? "";
	if (!isArtifactPath(path)) throw badRequest("path must point at a session.vN.jsonl.zstd (v4/v3) or session.jsonl.zstd");
	return resolveSessionPath(path);
```

</details>

**依据 3 · 源码核查**：[lib/timeline.js:27-47](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/lib/timeline.js#L27-L47)

替换范围投影修改内存事件masked字段

<details>
<summary>查看原文（21行）</summary>

```text
export function applySurfaceOps(events) {
	const masked = new Set();
	for (const ev of events) {
		const op = ev?.surfaceOp;
		if (!op || op.op !== "replace") continue;
		if (Array.isArray(op.seqs)) {
			for (const s of op.seqs) if (Number.isFinite(s)) masked.add(s);
		}
		// 0.3.4（P1 修复）：message-ops 真实写的是 start/end（新引擎）与 startSeq/endSeq
		// （legacy），原实现只认 fromSeq/toSeq —— 真实 revert 数据上遮蔽标注永不触发。
		// 三种拼写全兼容（与 message-ops computeShadowed 同款双拼写）。
		const lo = [op.start, op.startSeq, op.fromSeq].find(Number.isFinite);
		const hi = [op.end, op.endSeq, op.toSeq].find(Number.isFinite);
		if (Number.isFinite(lo) && Number.isFinite(hi)) {
			for (let s = lo; s <= hi; s++) masked.add(s);
		}
	}
	if (masked.size > 0) {
		for (const ev of events) if (masked.has(ev.seq)) ev.masked = true;
	}
	return events;
```

</details>

**依据 4 · 源码核查**：[package.json:17-26](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/package.json#L17-L26)

Node24及bundle要求

<details>
<summary>查看原文（10行）</summary>

```text
    "node": ">=24"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "license": "MIT",
  "author": "240xu",
  "files": [
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么实现边界最可能使长会话按需浏览的贡献不成立，哪些工程设计可复用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

关键质疑是惰性与完整性范围。tail有窗上限，搜索/全统计却先读整文件buffer，文本搜索还受截断和帧上限；路径只做词法前缀，不能抗受信目录中的符号链接。finally关闭与yield值得复用，但不等于资源和路径安全保证。

有界尾窗、finally关闭句柄、EOF停止和循环间yield值得借鉴；但同步单帧解压仍可能拖慢服务，魔数可能出现在压缩数据内。tail仅返回解压成功候选，坏候选细节可能被过滤，不能从展示帧数判定原始完整性。代码未显式realpath验证，受信本地目录假设必须保留。

#### 证据与依据

**依据 1 · 源码核查**：[lib/frames.js:215-248](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/lib/frames.js#L215-L248)

全量读取使用Buffer.alloc(size)，EOF和yield分支可核

<details>
<summary>查看原文（34行）</summary>

```text
export async function forEachFrame(filePath, { signal, maxFrames, onFrame } = {}) {
	const handle = await open(filePath, "r");
	try {
		const { size } = await handle.stat();
		const buf = Buffer.alloc(size);
		let read = 0;
		while (read < size) {
			// 0.3.4（P2）：stat 后并发截断 → bytesRead=0 永不推进 = 死循环 fs 空转，
			// search/stats 请求悬挂可拖垮 web 进程 → 0 字节即停
			const n = (await handle.read(buf, read, size - read, read)).bytesRead;
			if (n === 0) break;
			read += n;
		}
		const offsets = scanFrameOffsets(buf);
		let scannedFrames = 0;
		let aborted = signal?.aborted === true;
		for (let i = 0; i < offsets.length; i++) {
			if (signal?.aborted) { aborted = true; break; }
			if (maxFrames !== void 0 && i >= maxFrames) break;
			const start = offsets[i];
			const end = i + 1 < offsets.length ? offsets[i + 1] : buf.length;
			let text, error;
			try {
				text = decompressFrame(buf, start, end).toString("utf8");
			} catch (e) {
				error = e instanceof Error ? e.message : String(e);
			}
			const stop = (await onFrame({ index: i, start, end, text, error })) === false;
			scannedFrames++;
			if (stop) break;
			await yieldToLoop();
		}
		return { size, totalFrames: offsets.length, scannedFrames, aborted };
	} finally {
```

</details>

**依据 2 · 源码核查**：[lib/frames.js:260-287](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/lib/frames.js#L260-L287)

搜索只检查describeEvent投影文本

<details>
<summary>查看原文（28行）</summary>

```text
export function searchFrameText(text, qLower, frameIndex) {
	const hits = [];
	for (const line of text.split("\n")) {
		if (line.trim() === "") continue;
		let entries;
		try {
			entries = describeEvent(JSON.parse(line));
		} catch {
			entries = [{ type: "<unparsable>", seq: void 0, role: "event", kind: "raw", text: line }];
		}
		for (const entry of entries) {
			const hay = String(entry.text ?? "").toLowerCase();
			let at = hay.indexOf(qLower);
			while (at !== -1) {
				const from = Math.max(0, at - SNIPPET_WINDOW);
				hits.push({
					frameIndex,
					seq: entry.seq,
					type: entry.type,
					role: entry.role,
					snippet: String(entry.text).slice(from, at + qLower.length + SNIPPET_WINDOW)
				});
				if (hits.length >= 50) return hits;
				at = hay.indexOf(qLower, at + qLower.length);
			}
		}
	}
	return hits;
```

</details>

**依据 3 · 源码核查**：[lib/frames.js:97-115](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/lib/frames.js#L97-L115)

tail过滤成功候选并返回truncatedScan

<details>
<summary>查看原文（19行）</summary>

```text
			// Only frames that decompressed cleanly count as readable; a candidate
			// at the very window edge that failed is likely truncated by the window.
			const ok = candidates.filter((frame) => frame.text !== void 0);
			const edgeTruncated = candidates.some((frame) => frame.text === void 0 && frame.start === 0 && from > 0);
			if (ok.length >= count + skip && !edgeTruncated) {
				const picked = ok.slice(-(count + skip), ok.length - skip).reverse();
				return {
					size,
					frames: picked.map((frame, i) => ({ index: skip + i, ...describeFrame(frame) }))
				};
			}
			if (window >= size || window >= TAIL_WINDOW_MAX) {
				// Whole file scanned (or cap hit): report what we have, newest first.
				const picked = ok.slice(-(count + skip), ok.length - skip).reverse();
				return {
					size,
					frames: picked.map((frame, i) => ({ index: skip + i, ...describeFrame(frame) })),
					truncatedScan: window >= TAIL_WINDOW_MAX && window < size
				};
```

</details>

**依据 4 · 源码核查**：[lib/index.js:99-104](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/lib/index.js#L99-L104)

词法前缀不解析符号链接

```text
function resolveSessionPath(relativePath) {
	if (typeof relativePath !== "string" || relativePath === "") throw badRequest("session path is required");
	const root = SESSIONS_ROOT();
	const full = normalize(join(root, relativePath));
	if (full !== root && !full.startsWith(root + sep)) throw badRequest("session path escapes the sessions root");
	return full;
```

#### 缺口

- 压缩魔数误判、超大帧与并发写入下准确性未量化
  **影响**：无法担保完整检索或安全资源上界
  **进一步探讨**：构造不同帧布局并与原始完整解压逐事件对照

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？

**研究主题**：效果与总成本

#### 完整回答

首次需安装、核对会话目录和Node支持；持续tail付出窗口读取/解压，全文搜索还付出整文件内存及人工解释partial；失败要改用完整解压、核对坏帧与投影。无金额/RSS/延迟数据，支持局部读取机制，不支持量化净节省。

任务单位应是正确定位一个已知事件；应计入未命中后的完整扫描和人工回原件核对。无本轮延迟、RSS、IO或金额数据，不给节省比例。

#### 证据与依据

**依据 1 · 源码核查**：[lib/frames.js:81-118](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/lib/frames.js#L81-L118)

tail读窗资源边界

<details>
<summary>查看原文（38行）</summary>

```text
export async function readTailFrames(filePath, count = 2, skip = 0) {
	const handle = await open(filePath, "r");
	try {
		const { size } = await handle.stat();
		let window = Math.min(size, Math.max(TAIL_WINDOW, count * (256 << 10)));
		for (;;) {
			const from = Math.max(0, size - window);
			const buf = Buffer.alloc(size - from);
			await handle.read(buf, 0, buf.length, from);
			const offsets = scanFrameOffsets(buf);
			const candidates = decompressAllFrames(buf, offsets).map((frame) => ({
				...frame,
				// absolute file offset, so pagination UI can show real positions
				absStart: from + frame.start,
				absEnd: from + frame.end
			}));
			// Only frames that decompressed cleanly count as readable; a candidate
			// at the very window edge that failed is likely truncated by the window.
			const ok = candidates.filter((frame) => frame.text !== void 0);
			const edgeTruncated = candidates.some((frame) => frame.text === void 0 && frame.start === 0 && from > 0);
			if (ok.length >= count + skip && !edgeTruncated) {
				const picked = ok.slice(-(count + skip), ok.length - skip).reverse();
				return {
					size,
					frames: picked.map((frame, i) => ({ index: skip + i, ...describeFrame(frame) }))
				};
			}
			if (window >= size || window >= TAIL_WINDOW_MAX) {
				// Whole file scanned (or cap hit): report what we have, newest first.
				const picked = ok.slice(-(count + skip), ok.length - skip).reverse();
				return {
					size,
					frames: picked.map((frame, i) => ({ index: skip + i, ...describeFrame(frame) })),
					truncatedScan: window >= TAIL_WINDOW_MAX && window < size
				};
			}
			window = Math.min(window * 4, TAIL_WINDOW_MAX, size);
		}
```

</details>

**依据 2 · 源码核查**：[lib/frames.js:295-315](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/lib/frames.js#L295-L315)

搜索partial和abort

<details>
<summary>查看原文（21行）</summary>

```text
export async function searchSession(filePath, query, { max = 20, signal, frameCap = SEARCH_FRAME_CAP } = {}) {
	const qLower = query.toLowerCase();
	const hits = [];
	let stop = false;
	const { size, totalFrames, scannedFrames, aborted } = await forEachFrame(filePath, {
		signal,
		maxFrames: frameCap,
		onFrame(frame) {
			if (frame.text !== void 0) {
				for (const hit of searchFrameText(frame.text, qLower, frame.index)) {
					hits.push(hit);
					if (hits.length >= max) { stop = true; break; }
				}
			}
			return stop ? false : void 0;
		}
	});
	return {
		query, max, hits, size, totalFrames, scannedFrames,
		partial: scannedFrames < totalFrames,
		aborted: aborted || signal?.aborted === true
```

</details>

**依据 3 · 源码核查**：[lib/frames.js:358-395](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/lib/frames.js#L358-L395)

fast与全统计路径不同

<details>
<summary>查看原文（38行）</summary>

```text
export async function collectStats(filePath, { fast = false } = {}) {
	if (fast) {
		return { fast: true, bytes: (await stat(filePath)).size, totalFrames: await countFrames(filePath) };
	}
	const typeCounts = {};
	let events = 0;
	let unparsableLines = 0;
	let frameErrors = 0;
	let firstTime, lastTime, header;
	const { size, totalFrames, scannedFrames } = await forEachFrame(filePath, {
		onFrame(frame) {
			if (frame.text === void 0) { frameErrors++; return; }
			for (const line of frame.text.split("\n")) {
				if (line.trim() === "") continue;
				let json;
				try {
					json = JSON.parse(line);
				} catch {
					events++;
					unparsableLines++;
					typeCounts["<unparsable>"] = (typeCounts["<unparsable>"] ?? 0) + 1;
					continue;
				}
				if (json.type === "session") {
					header = { id: json.id, version: json.version, cwd: json.cwd, createdAt: json.createdAt };
					continue;
				}
				events++;
				const t = typeof json.type === "string" ? json.type : "<unknown>";
				typeCounts[t] = (typeCounts[t] ?? 0) + 1;
				if (typeof json.time === "number") {
					if (firstTime === void 0 || json.time < firstTime) firstTime = json.time;
					if (lastTime === void 0 || json.time > lastTime) lastTime = json.time;
				}
			}
		}
	});
	return { fast: false, bytes: size, totalFrames, scannedFrames, frameErrors, events, unparsableLines, typeCounts, firstTime, lastTime, header };
```

</details>

#### 缺口

- 峰值内存、尾部延迟和人工核对工时未知
  **影响**：净效率尚不能判断
  **进一步探讨**：固定相同会话和目标事件对照完整解压与tail/search

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可从时间线索引、分页与搜索一致性的限制推导什么可证伪改进？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是用绑定文件身份与稳定前缀的流式游标搜索，报告已扫字节/seq和截断原因，以降低内存并使缺口可见。用追加、截断、大帧和长文本对照当前搜索及完整解压；峰值内存不降、漏检增加或缓存错位就否定，维护索引负担另计。

当前搜索先读整文件再逐帧yield，说明CPU让步与内存有界是两件事。新的游标须识别文件被替换/截断，不能按可变尾部复用旧索引；只缓存稳定前缀且明确遗漏范围，才可能提升诊断可信度。

#### 证据与依据

**依据 1 · 源码核查**：[lib/frames.js:215-248](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/lib/frames.js#L215-L248)

读取和解压耦合，支持流式拆分设计

<details>
<summary>查看原文（34行）</summary>

```text
export async function forEachFrame(filePath, { signal, maxFrames, onFrame } = {}) {
	const handle = await open(filePath, "r");
	try {
		const { size } = await handle.stat();
		const buf = Buffer.alloc(size);
		let read = 0;
		while (read < size) {
			// 0.3.4（P2）：stat 后并发截断 → bytesRead=0 永不推进 = 死循环 fs 空转，
			// search/stats 请求悬挂可拖垮 web 进程 → 0 字节即停
			const n = (await handle.read(buf, read, size - read, read)).bytesRead;
			if (n === 0) break;
			read += n;
		}
		const offsets = scanFrameOffsets(buf);
		let scannedFrames = 0;
		let aborted = signal?.aborted === true;
		for (let i = 0; i < offsets.length; i++) {
			if (signal?.aborted) { aborted = true; break; }
			if (maxFrames !== void 0 && i >= maxFrames) break;
			const start = offsets[i];
			const end = i + 1 < offsets.length ? offsets[i + 1] : buf.length;
			let text, error;
			try {
				text = decompressFrame(buf, start, end).toString("utf8");
			} catch (e) {
				error = e instanceof Error ? e.message : String(e);
			}
			const stop = (await onFrame({ index: i, start, end, text, error })) === false;
			scannedFrames++;
			if (stop) break;
			await yieldToLoop();
		}
		return { size, totalFrames: offsets.length, scannedFrames, aborted };
	} finally {
```

</details>

**依据 2 · 源码核查**：[lib/frames.js:295-315](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/lib/frames.js#L295-L315)

现有partial元数据可扩为覆盖收据

<details>
<summary>查看原文（21行）</summary>

```text
export async function searchSession(filePath, query, { max = 20, signal, frameCap = SEARCH_FRAME_CAP } = {}) {
	const qLower = query.toLowerCase();
	const hits = [];
	let stop = false;
	const { size, totalFrames, scannedFrames, aborted } = await forEachFrame(filePath, {
		signal,
		maxFrames: frameCap,
		onFrame(frame) {
			if (frame.text !== void 0) {
				for (const hit of searchFrameText(frame.text, qLower, frame.index)) {
					hits.push(hit);
					if (hits.length >= max) { stop = true; break; }
				}
			}
			return stop ? false : void 0;
		}
	});
	return {
		query, max, hits, size, totalFrames, scannedFrames,
		partial: scannedFrames < totalFrames,
		aborted: aborted || signal?.aborted === true
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户可以受控采用长会话按需浏览，何时应停止？

**研究主题**：采用判断

#### 完整回答

本机维护者可限定tail/fast统计试用，先确认能找到已知事件并正确识别partial和错误；共享远程服务、符号链接不受控目录或要求完整审计者暂缓。内存压迫、投影与原件不符或路径越界迹象均应停用。

试用成功是能找到已知尾部事件并正确处理截断/错误，不是HTTP200；停止条件为内存压迫、原件与投影不一致或访问跨出预期根。卸载移除路由，已经下载的Markdown需用户自行处置。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:164-183](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/lib/index.js#L164-L183)

effect托管路由与GET模式

<details>
<summary>查看原文（20行）</summary>

```text
function apply(ctx) {
	ctx.effect(() => ctx.get("webServer")?.register({
		kind: "prefix",
		path: "/lazyview",
		handler: async (req, res) => {
			try {
				if (!isTrustedApiRequest(req)) {
					writeFail(res, "forbidden", 403, "forbidden");
					return;
				}
				const url = new URL(req.url ?? "/", "http://dsh.internal");
				const pathname = url.pathname;
				if (req.method !== "GET") {
					writeFail(res, "method not allowed", 405, "method-error");
					return;
				}
				// API surface is GET-only: a viewer needs no POSTs, and GET keeps
				// every endpoint linkable straight from the panel HTML.
				if (pathname === "/lazyview/api/list") {
					writeOk(res, await listSessions());
```

</details>

**依据 2 · 源码核查**：[lib/frames.js:402-416](https://github.com/240xu/dsh-session-lazy-view/blob/6224eb1e41b9408de1a9aec2749a21a4e0c8f31d/lib/frames.js#L402-L416)

导出包含文本投影及路径，用户需保管

<details>
<summary>查看原文（15行）</summary>

```text
export function framesToMarkdown(value, { path = "" } = {}) {
	const out = [];
	out.push("# DSH session export", "", `- path: \`${path}\``, `- file bytes: ${value.size}`, `- frames exported: ${value.frames.length}`, `- exported at: ${new Date().toISOString()}`, "");
	for (const frame of value.frames) {
		out.push(`## frame #${frame.index} (bytes ${frame.start}–${frame.end})`, "");
		if (frame.header) out.push(`- session: ${frame.header.id ?? "?"} · cwd: \`${frame.header.cwd ?? "?"}\` · createdAt: ${frame.header.createdAt ?? "?"}`, "");
		if (frame.error) { out.push(`> frame error: ${frame.error}`, ""); continue; }
		for (const ev of frame.events ?? []) {
			const who = [ev.role, ev.type, ev.kind].filter(Boolean).join("/");
			const seq = ev.seq !== void 0 ? ` (seq ${ev.seq})` : "";
			out.push(`- **${who}**${seq}: ${String(ev.text ?? "").replace(/\n/g, "\n  ")}`);
		}
		out.push("");
	}
	return out.join("\n");
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
