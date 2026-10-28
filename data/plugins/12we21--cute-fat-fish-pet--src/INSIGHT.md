# 可爱大肥鱼桌宠（蓝毛小女仆）

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[652c4ab](https://github.com/12we21/cute-fat-fish-pet/tree/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src)

<!-- BEGIN META -->
[![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/12we21/cute-fat-fish-pet)
<!-- END META -->

> **功能**：为 DSH 提供透明动画桌宠、桌面交互、模型陪聊与可选屏幕点评

> **亮点**：把透明动画、桌面角色和DSH模型陪聊组合，降低在聊天与角色表现之间切换的摩擦；上游dsh-pet架构、模型能力和独立版语音不归本插件新增。[Q01](#research-q01) [Q05](#research-q05)

> **主要限制**：发布lib含看屏幕闭包，截图先入附件再发模型；local标签不独立证明目的地，关闭自动监测不取消在途，且路由内未见owner准入。采用判断必须以发布入口而不是TS功能清单为准。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · src 组件实际是什么，贡献归谁？](#detail-section-11)
  - [Q02 · 对话和屏幕数据如何进入模型？](#detail-section-12)
  - [Q03 · 关闭看屏幕与“本地”承诺的边界是什么？](#detail-section-13)
  - [Q04 · Electron、存储和运行带来哪些成本？](#detail-section-14)
  - [Q05 · 相对普通动画宠物和原生聊天是否值得采用？](#detail-section-15)
  - [Q06 · 什么机制改进可验证而不把陪伴设想当需求？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在本机获得动画陪伴和角色聊天的个人DSH用户；不将陪伴等同于工作收益或心理疗效。

普通动画宠物加原生模型聊天，或仅用原生聊天；交互组合是增量，模型能力来自宿主/本地服务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 透明动画桌宠 | 角色陪伴和桌面互动 | 图形环境、VP9-alpha/Electron；性能未测 |
| 模型陪聊 | 角色回应和记忆 | 实际provider决定出站，不是离线保证 |
| 可选看屏幕 | 基于截图点评 | 保存附件；停自动不撤回在途 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20、DSH>=0.2.0-rc.1与host client依赖 | 启动必需，声明范围 | 宿主/浏览器双半侧 | 宽范围未逐版验证 |
| 图形环境和Electron | 桌面模式必需 | 独立角色窗口 | 无显示跳过，缺Electron会自动下载 |
| DSH模型或配置本地模型 | 聊天必需 | 角色回应/屏幕点评 | 缺服务有错误；auto可回退在线 |
| 原生截图helper与视觉模型/attachments | 看屏幕必需 | 抓图并保存附件发送 | 未核真实目的地前保持关闭 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户确认插件半侧路径与实际lib | 不把独立版语音算入 |
| 2 | 用户确认Electron路径与下载行为 | 非预期下载或进程即停止 |
| 3 | 用户先用合成内容确认实际模型和记忆落点 | local标签与网络一致才扩范围 |
| 4 | 用户保持看屏幕关闭，必要时隔离测试 | stop不撤回已发附件；退出核残留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 作者称整仓约68MB，Electron另下；费用未知 | 核模型、权限、helper路径 | 自动下载并非仅手动命令 |
| 持续使用 | GPU/内存、本地推理或在线调用未知 | 管理记忆、模式和监测 | 次数上限不等于固定账单 |
| 失败恢复 | 重试/附件与截图存储资源未知 | 排查模型和下载/进程 | stop不取消全部在途 |
| 退出 | 残留存储未知 | 停helper并核记忆、附件、Electron和cache | 移除包不等于全部擦除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 动画与角色聊天 | 双半侧、预构建lib和模型流 | 视觉/性能、真实陪伴价值 |
| 屏幕点评 | 发布lib保存图附件并发模型 | 目的地、权限和点评质量 |
| 模式控制 | 自动轮询先检查running，local不回退 | 在途取消与配置真实性 |

> **思考**：发布lib含看屏幕闭包，截图先入附件再发模型；local标签不独立证明目的地，关闭自动监测不取消在途，且路由内未见owner准入。采用判断必须以发布入口而不是TS功能清单为准。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把透明动画、桌面角色和DSH模型陪聊组合，降低在聊天与角色表现之间切换的摩擦；上游dsh-pet架构、模型能力和独立版语音不归本插件新增。[Q01](#research-q01) [Q05](#research-q05)

预构建lib才是执行入口；已独立核其中屏幕闭包和自动下载，不能由TS推断完整行为。可借鉴角色动作与宿主状态结合；代价是发布源码双轨、外部provider、附件和native helper生命周期。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

发布lib含看屏幕闭包，截图先入附件再发模型；local标签不独立证明目的地，关闭自动监测不取消在途，且路由内未见owner准入。采用判断必须以发布入口而不是TS功能清单为准。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察；只在可信本机和无敏感合成内容下核模型、下载及退出，严格离线或敏感桌面先不开屏幕能力。出现未预期出站或停止语义不符即停用，回到普通动画和原生聊天。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

动画/聊天/屏幕与下载链为源码可见；数量、体验为作者声明，未执行目标。端点、宿主外层准入与退出残留未知；收据与统一取消为未来假设。

- 已检查：作者 README、包清单、源码路径 src/README.md、src/package.json、src/cordis.patch.yml、src/lib/index.js、src/src/host/chat.ts 及固定范围 inventory；组件：src。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：src组件68个tracked文件统计；重点README/package/patch、TS聊天、发布lib的屏幕、路由、下载路径。未逐帧核动画数量、未审独立版语音、不运行/下载/抓屏。
- 下一步：合成截图与假provider记录附件落点、实际endpoint和网络；延迟请求中关闭监测、切换模式、停helper并核残留。用户无法预测副作用或退出后仍不可接受地出站时停止试用。

**分析版本**

- **仓库**：[12we21/cute-fat-fish-pet](https://github.com/12we21/cute-fat-fish-pet)
- **版本号**：1.2.4（[固定提交 652c4ab](https://github.com/12we21/cute-fat-fish-pet/tree/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是为首次下载、附件持久化和真实模型出站分开显示收据，并统一可取消阶段；用合成慢请求核用户预测与实际副作用，错误理解或中断率不降就否定。[Q06](#research-q06)

合成截图与假provider记录附件落点、实际endpoint和网络；延迟请求中关闭监测、切换模式、停helper并核残留。用户无法预测副作用或退出后仍不可接受地出站时停止试用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 13 | 18185 | 15761 | 2285 | — |
| .md | source | 3 | 418 | — | — | 7243 |
| .mjs | source | 2 | 454 | 329 | 102 | — |
| .ts | source | 33 | 8986 | 6565 | 2013 | — |
| .ts | test | 17 | 3130 | 2499 | 349 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/12we21/cute-fat-fish-pet/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：实际发布插件的动画、模型和屏幕链是否具有清晰的数据、进程与停止边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · src 组件实际是什么，贡献归谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是 DSH 原生插件半侧，package 1.2.4 的 main 明确 lib/index.js，bundle patch 插入同名插件，另导出 client。它将透明 VP9-alpha 动画、桌面漫步/点击和宿主会话模型陪聊组合；人群是希望在本机工作时有动画陪伴的个人用户，合格结果是动作可见、聊天响应且可停止，不是生产效率提高。作者称106动画与可选看屏幕，但数量不是本轮逐帧验收。早期架构继承 PC2005-cloud/dsh-pet 0.3.0，不能把整个机制归原创。README 明确独立 Windows 版的离线语音识别、Edge TTS 和控制台不属于该插件；包名的fat-fish也不代表角色仍是鱼。

#### 证据与依据

**依据 1 · 源码核查**：[src/package.json:1-4](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/package.json#L1-L4)

版本与作者自述的上游归属。

```text
{
  "name": "cute-fat-fish-pet",
  "version": "1.2.4",
  "description": "「可爱大肥鱼桌宠」的桌宠本体（宿主半侧入口）：待机动画、随机动作、桌面漫步、陪聊与看屏幕。由 Mikolu 独立开发和维护；早期基础架构来自上游 dsh-pet 0.3.0（MIT，作者 PC2005-cloud）。",
```

**依据 2 · 源码核查**：[src/package.json:39-64](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/package.json#L39-L64)

实际lib入口、client与发布资源。

<details>
<summary>查看原文（26行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src",
    "assets/webm",
    "runtime/electron-helper",
    "assets/fonts",
    "assets/pic",
    "assets/memes",
    "assets/config.jsonc",
    "scripts/ensure-electron.mjs",
    "cordis.patch.yml"
```

</details>

**依据 3 · 源码核查**：[src/README.md:31-52](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/README.md#L31-L52)

动画/聊天/看屏幕与独立版语音范围。

<details>
<summary>查看原文（22行）</summary>

```text
## What you get

- **106 hand-drawn animations** — VP9-alpha `webm` with a real alpha channel, composited over
  your wallpaper. Idle breathing, dozing off and waking with a start, dancing, playing with a
  cat, eating, festivals, and a reaction for every click.
- **Desktop wandering** — she walks around on her own and reacts to the mouse: drag her,
  click her, and she notices.
- **Chat** — talk to her from the DSH Web UI. Point her at a local **Ollama** model, or at the
  online model your DSH session already uses. A global switch picks local-only, DSH-only, or
  local-first.
- **Quips** — she can drop a one-line remark generated by your session's own model.
- **Optional screen watching** — with the bundled native capture helper she can look at what
  is on your screen and comment on it. Off unless you turn it on.

## What this half does *not* have

The plugin is a subset of the standalone edition. These live in the standalone Windows build,
not in the DSH plugin:

- offline speech recognition (sherpa-onnx + SenseVoice)
- Edge TTS voices
- the single-page control console
```

</details>

**依据 4 · 源码核查**：[src/cordis.patch.yml:17-19](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/cordis.patch.yml#L17-L19)

真正插入同名Cordis row。

```text

- insert:
    - id: cute-fat-fish-pet
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 对话和屏幕数据如何进入模型？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

TypeScript chat 以 agentDefaultModel.currentSelection 取provider/model，将最近历史转换为用户和assistant消息再 llm.stream，缺模型或LLM有明确错误。实际发布 lib 还有 TS 未覆盖的看屏幕闭包，必须独立审查：swSelection 对local/auto先探测配置localApi的/api/tags，local不就绪返回null，auto可退到当前默认模型。swJudge 把已保存JPEG交 attachments.saveImages，再以图片附件与点评提示进入 ctx.llm.stream，90秒超时；这意味着截图先持久为附件，界面“本地”还依赖provider映射和配置端点真实性。DSH模式只有存在 onlineVisionReady 能力时才显式确认视觉模型，真实DSH缺此能力会走默认选择，不能仅由菜单承诺模型看得懂图。

#### 证据与依据

**依据 1 · 源码核查**：[src/src/host/chat.ts:69-119](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/src/host/chat.ts#L69-L119)

默认模型、历史拼装和超时/推理参数路径。

<details>
<summary>查看原文（51行）</summary>

```text
  let sel: { provider: string; model: string };
  try {
    sel = ctx.agentDefaultModel.currentSelection();
  } catch {
    return { ok: false, reason: 'provider-missing', message: '当前对话未配置模型' };
  }
  if (!sel?.provider || !sel?.model) {
    return { ok: false, reason: 'provider-missing', message: '当前对话未配置模型' };
  }
  const llm = (ctx as { llm?: { stream(o: unknown): AsyncIterable<unknown> } }).llm;
  if (!llm || typeof llm.stream !== 'function') {
    return { ok: false, reason: 'generate-error', message: 'LLM 服务不可用' };
  }

  // 历史 → dsh-llm 消息：user 经 createUserMessage（plugin 来源），assistant 经 createAssistantMessage
  const historyMessages = history.map((m) =>
    m.role === 'user'
      ? createUserMessage({
          content: [{ type: 'text', text: m.content }],
          source: { kind: 'user' },
        })
      : createAssistantMessage({
          content: [{ type: 'text', text: m.content }],
          source: { provider: sel.provider, model: sel.model },
        }),
  );

  const deadline = AbortSignal.timeout(TIMEOUT_MS);
  // 仅当模型声明支持 reasoning effort（含 "off"）时才传，否则省略：
  // 无 reasoning 元数据的模型（如 reasoningEfforts: false）显式传 off 会被
  // dsh-llm 判为 UNSUPPORTED_REASONING_EFFORT 并折叠成空流（表现为"模型未返回文本"）。
  const supportsOff = await supportsReasoningOff(ctx, sel.provider, sel.model);
  // 配图：池非空才把清单与指令附进 user 正文（空池 = 关闭配图，正文与旧行为逐字一致）
  const wantImage = pool.length > 0;
  const options = {
    provider: sel.provider,
    model: sel.model,
    messages: [
      ...historyMessages,
      createUserMessage({
        content: [{ type: 'text', text: wantImage ? userText + imageInstruction(pool) : userText }],
        source: { kind: 'user' },
      }),
    ],
    system,
    // 不显式限 maxTokens：与碎碎念同因——推理模型把思考计入预算，显式小上限会截断正文；
    // 不传由 dsh-llm 按适配器 defaultMaxTokens 兜底，对话短回复输出仍短。
    temperature: 1,
    // 统一关闭深度思考：闲聊对话不需要推理（与碎碎念同一约束；仅模型声明支持时传）
    ...(supportsOff ? { reasoningEffort: ReasoningEffortId('off') } : {}),
    signal: deadline,
```

</details>

**依据 2 · 源码核查**：[src/lib/index.js:2353-2388](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/lib/index.js#L2353-L2388)

local API探测、auto回退和DSH默认选择。

<details>
<summary>查看原文（36行）</summary>

```text
	/** Ollama 是否在跑、且已拉下我们要的那个模型（这是「自动择优」的判据） */
	const swOllamaUp = async (cfg) => {
		try {
			const want = String(cfg.localModel || "").split(":")[0];
			if (!want) return false;
			const res = await fetch(String(cfg.localApi || "http://127.0.0.1:11434") + "/api/tags", { signal: AbortSignal.timeout(2500) });
			if (!res.ok) return false;
			const j = await res.json();
			const list = Array.isArray(j && j.models) ? j.models : [];
			return list.some((m) => String(m && m.name || "").split(":")[0] === want);
		} catch (e) {
			return false;
		}
	};
	const swSelection = async (cfg) => {
		try {
			if (cfg.brain === "local" || cfg.brain === "auto") {
				const model = String(cfg.localModel || "");
				if (model && await swOllamaUp(cfg)) return { provider: String(cfg.localProvider || "ollama"), model };
				if (cfg.brain === "local") return null;
			}
			// [发布版补丁 V4] 在线档：只有视觉（看图那个模型）真的配齐了才走在线；
			//  没配就返回 null，让 swRun 明说「还没配」，绝不把 JPEG 塞给纯文本模型瞎编。
			//  ctx 里没有这个能力（真跑在 DSH 插件里）⇒ 保持原样走下面那条老路。
			if (cfg.brain === "dsh") {
				const ready = typeof ctx.get === "function" ? ctx.get("onlineVisionReady") : void 0;
				if (typeof ready === "function") {
					if (!ready()) return null;
					return { provider: "online", model: "" }; // 具体模型名由 online.mjs 的视觉目标决定
				}
			}
			const s = ctx.agentDefaultModel.currentSelection();
			return s && s.provider && s.model ? { provider: s.provider, model: s.model } : null;
		} catch (e) {
			return null;
		}
```

</details>

**依据 3 · 源码核查**：[src/lib/index.js:2391-2418](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/lib/index.js#L2391-L2418)

截图保存附件后进入真实llm调用。

<details>
<summary>查看原文（28行）</summary>

```text
	const swJudge = async (cfg, force) => {
		const llm = ctx.llm;
		const att = typeof ctx.get === "function" ? ctx.get("attachments") : void 0;
		const sel = await swSelection(cfg);
		if (!llm || typeof llm.stream !== "function" || !att || !sel) return { error: cfg.brain === "local" ? "本地模型不可用：Ollama 没在跑，或还没拉下 " + String(cfg.localModel || "(未配置 localModel)") : "模型或附件服务不可用" };
		let ref;
		try {
			const saved = await att.saveImages([{ data: new Uint8Array(readFileSync(SW_SHOT)), mediaType: "image/jpeg", name: "screen.jpg" }]);
			ref = saved && saved[0];
		} catch (e) {
			return { error: "截图入附件失败：" + (e instanceof Error ? e.message : String(e)) };
		}
		if (!ref) return { error: "截图入附件失败" };
		const ask = force ? "主人让你现在点评一下屏幕上的情况。" : "这是主人此刻的屏幕。判断有没有值得点评的高光时刻、失误，或者卡住受挫。";
		const prompt = ask + '只回一行 JSON：{"react":true|false,"emotion":"success|error|thinking|waiting|result|working","say":"不超过40字的中文点评"}。没什么可说的就 react=false、say 留空。';
		const assembler = new BlockAssembler();
		try {
			for await (const chunk of llm.stream({
				provider: sel.provider,
				model: sel.model,
				messages: [createUserMessage({
					content: [{ type: "image", attachment: ref }, { type: "text", text: prompt }],
					source: { kind: "user" }
				})],
				system: SW_SYSTEM,
				temperature: 1,
				signal: AbortSignal.timeout(90000)
			})) assembler.push(chunk);
```

</details>

#### 缺口

- 当前Host provider映射、附件存储期限及实际出站目的地未实机确认。
  **影响**：不能以local标签独立担保截图不离机或视觉模型兼容。
  **进一步探讨**：只用无敏感屏幕在隔离环境记录实际provider/endpoint、网络和附件落点，再决定是否开启看屏幕。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 关闭看屏幕与“本地”承诺的边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

swRun 在自动抓取前检查running，因此关闭时自动轮询不会继续抓屏；但force=true的单次点评明确绕过开关，手动动作不等于自动监测。关闭控制只异步保存running=false，既有swRun不持有取消信号，llm只用独立90秒timeout，所以停止监测不能撤回已保存附件或已发请求。local模式在选择器中禁止自动回退是有力边界，但localApi/localProvider可配置，且模式口头回答会直接说“不联网”，这比实际可证明条件更强。HTTP前缀handler直接调用业务处理器，所查函数内没有owner准入；部署若对外可达，必须核宿主外层接入，不能把本机UI当认证证据。这些是权限与可理解性边界，不能泛化为所有动画不可用。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/index.js:2479-2518](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/lib/index.js#L2479-L2518)

开关在capture之前，但force绕过，调用期间无共享cancel。

<details>
<summary>查看原文（40行）</summary>

```text
	const swRun = async (opts) => {
		const force = Boolean(opts && opts.force);
		const cfg = swCfg();
		if (SW_RT.busy) return { ok: false, reason: "busy" };
		// 关着又不是手动强制 → 连屏都不抓。抓屏必须发生在开关判断之后：
		// 否则"关着"的时候每 5 秒还是会拍一张存到本地（用户以为关了却还在拍，不可接受）。
		if (!force && !cfg.running) return { ok: false, reason: "not-running" };
		SW_RT.busy = true;
		try {
			if (!(await swEnsurePs1())) return await swRecord({ ok: false, reason: "no-script" });
			const sig = await swCapture();
			if (!sig) return await swRecord({ ok: false, reason: "capture-failed" });
			const mad = swMad(SW_RT.sig, sig);
			SW_RT.sig = sig;
			const changed = mad >= (Number(cfg.changeThreshold) || 10);
			if (!force && !changed) return { ok: true, spoke: false, reason: "no-change", mad };
			if (!force && cfg.verbosity === "manual") return { ok: true, spoke: false, reason: "manual-mode", mad };
			const now = Date.now();
			if (!force && now - SW_RT.lastCall < Math.max(5, Number(cfg.minGapSec) || 20) * 1000) return { ok: true, spoke: false, reason: "throttled", mad };
			if (!swBudget(now, cfg)) return await swRecord({ ok: false, reason: "budget" });
			SW_RT.lastCall = now;
			SW_RT.calls.push(now);
			// [local patch 5] 到这里才真的需要那帧图：原生抓屏分两步，签名不落盘，JPEG 现拍现用。
			// [发布版补丁 V5] 抓屏之前先确认「这条路的模型看得懂图」：没有就直说，
			//  省下一次 SwCapture，也免得多花一次视觉额度。
			if (cfg.brain === "dsh" && !(await swSelection(cfg))) {
				const why = "还没配看屏幕的模型：去控制台「联网模型」里填「视觉模型」（比如 deepseek-flash），或者把大脑切成「本地模型」。";
				swSpeak("waiting", why);
				return await swRecord({ ok: false, reason: "no-vision-model", message: why });
			}
			if (!(await swShot())) return await swRecord({ ok: false, reason: "capture-failed" });
			const verdict = await swJudge(cfg, force);
			if (verdict.error) return await swRecord({ ok: false, reason: "judge-failed", message: verdict.error });
			const speak = force || cfg.verbosity === "chatty" ? verdict.say.length > 0 : verdict.react === true && verdict.say.length > 0;
			if (!speak) return await swRecord({ ok: true, spoke: false, reason: "nothing-notable", mad, react: verdict.react, say: verdict.say });
			const how = swSpeak(verdict.emotion, verdict.say);
			return await swRecord({ ok: true, spoke: true, emotion: verdict.emotion, say: verdict.say, how, mad });
		} finally {
			SW_RT.busy = false;
		}
```

</details>

**依据 2 · 源码核查**：[src/lib/index.js:2540-2555](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/lib/index.js#L2540-L2555)

模式描述声称本地不联网，依赖配置真实性。

<details>
<summary>查看原文（16行）</summary>

```text
	const swModeText = () => {
		const c = swCfg();
		const local = String(c.quipModel || c.localModel || "").trim();
		const localBit = local ? "本机的 " + local : "本机模型";
		const on = petOnlineInfo();
		if (c.brain === "local") return "我现在是本地模式哦——只用" + localBit + "，不联网。";
		if (c.brain === "auto") return on.ready ? "我现在是自动择优哦——先用" + localBit + "，它不行才走联网的 " + on.model + "。" : "我现在是自动择优，不过联网模型还没配好，实际只用" + localBit + "。";
		if (!on.ready) return "我现在是在线模式（联网模型），不过联网模型还没配全，真说话时会回落到" + localBit + "。";
		return "我现在是在线模式哦——说话走联网的 " + on.model + (on.base ? "（" + on.base + "）" : "") + "；" + localBit + " 只在联网连不上时兜底。";
	};
	/* [互动@2] 对话 system 末尾补一句运行状态：兜住「代码没匹配到」的问法，
	 *  让模型手里有个事实，不至于照人设猜自己离线。只在被问到时才提。 */
	const petBrainFactLine = () => {
		const c = swCfg();
		const where = c.brain === "local" ? "本地模式（只用本机模型，绝不联网）" : c.brain === "auto" ? "自动择优（本机模型优先，本机不行才联网）" : "在线模式（走联网模型说话）";
		return "【仅在被问到时才说，平时不要主动提】你现在处于" + where + "，就运行在主人这台电脑上。主人问你在不在线、是联网还是本机、用什么模型时，照这句实话实说，别猜、别说自己离线。";
```

</details>

**依据 3 · 源码核查**：[src/lib/index.js:2571-2584](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/lib/index.js#L2571-L2584)

stop保存标志、手动点评强制执行。

<details>
<summary>查看原文（14行）</summary>

```text
		if (has(["监测状态", "什么模式", "当前模式", "监测模式"])) return swStatusText();
		if (has(["别看了", "停下", "关闭监测", "停止监测", "别盯着"])) {
			void swSave({ running: false });
			return "好，我不看了～";
		}
		if (has(["看着点", "开始监测", "盯着", "开始看", "帮我看着", "看着我玩"])) {
			void swSave({ running: true, trigger: "watch" });
			return "好嘞，我盯着啦，有高光我就喊你～";
		}
		if (has(["点评一下", "看看现在", "现在什么情况", "帮我看一下"])) {
			void swRun({ force: true }).then((r) => {
				if (r && !r.ok) void swSpeak("thinking", "呜……我现在看不了屏幕（" + String(r.reason) + "）");
			});
			return "让我看看屏幕…马上给你点评～";
```

</details>

**依据 4 · 源码核查**：[src/lib/index.js:3067-3081](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/lib/index.js#L3067-L3081)

路由handler内直接执行业务，未看到身份检查。

<details>
<summary>查看原文（15行）</summary>

```text
	ctx.effect(() => ctx.webServer.register({
		kind: "prefix",
		path: ROUTE_PREFIX,
		handler: async (req, res) => {
			try {
				const body = req.method === "PUT" || req.method === "POST" ? await readBody(req) : void 0;
				const result = await handlePetRoute(req.url ?? "/", req.method ?? "GET", body);
				if (result.kind === "json") sendJson(res, result.status, result.obj, result.headers);
				else if (result.kind === "text") sendText(res, result.status, result.body);
				else sendFile(res, result.file, result.contentType);
			} catch (e) {
				sendJson(res, 500, { error: e instanceof Error ? e.message : String(e) });
			}
		}
	}), "dsh-pet: /dsh-pet-7340 asset route");
```

</details>

#### 缺口

- Host外层路由准入与关闭后在途请求/附件清理未端到端验证。
  **影响**：不适合直接部署到多用户高权限远程Host；停止按钮不能作为数据撤回保证。
  **进一步探讨**：分别从未登录来源调用相关私有操作并关闭在途监测；越权或停后继续不可接受则保持关闭并停用插件。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · Electron、存储和运行带来哪些成本？

**研究主题**：效果与总成本、依赖、兼容与流程

#### 完整回答

桌面helper启用后先检测图形环境，缺图形则跳过；有显示但找不到Electron会自动下载到DSH数据目录并拉起，失败提示配置路径后重试。它不是只有手动ensure命令才联网。README说明整仓安装约68MB、慢网可能超时，这是作者估计而非本轮下载；VP9-alpha和桌面窗口需要GPU/内存，视觉效果和实际资源未测。记忆和配置留在DSH_HOME/dsh-pet，改包名不迁移历史路径；截图、附件、Electron落地及共享下载cache不能假定卸载自动抹除。持续聊天、自动点评由本地硬件或在线模型承担；maxCallsPerHour/minGap仅限制部分路径，不能给出固定月费或零成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/index.js:2150-2173](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/lib/index.js#L2150-L2173)

真实helper路径自动下载并启动。

<details>
<summary>查看原文（24行）</summary>

```text
	/** 拉起桌面 Helper：先探测本机 Electron；缺失时进程内异步下载
	*  （不 spawn 子进程，CLI node 与 DSH Desktop 均适用），下载完成后自动拉起。 */
	const startHelper = () => {
		if (helper || electronEnsure || disposed) return;
		if (!hasDesktopPet) return;
		if (!hasGraphicalDisplay()) {
			if (!displayWarned) {
				displayWarned = true;
				ctx.logger?.warn?.("[dsh-pet] 未检测到图形显示环境（DISPLAY/WAYLAND_DISPLAY 均为空），已跳过桌面宠物。浏览器内宠物不受影响；如需在服务器上启用桌面模式，请配置 Xvfb 后设置 DSH_PET_DESKTOP_FORCE=1。");
			}
			return;
		}
		const found = resolveElectronPath();
		if (found) {
			launchHelper(found);
			return;
		}
		console.warn(`[dsh-pet] Electron not found, downloading to ${defaultElectronExe()} ...`);
		electronEnsure = ensureElectronDownload().then((path) => {
			if (path) launchHelper(path);
			else console.warn("[dsh-pet] Electron download failed; desktop pet unavailable. Set DSH_PET_ELECTRON_PATH and restart, or retry later.");
		}).finally(() => {
			electronEnsure = void 0;
		});
```

</details>

**依据 2 · 源码核查**：[src/lib/index.js:2349-2352](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/lib/index.js#L2349-L2352)

按小时次数预算。

```text
	const swBudget = (now, cfg) => {
		SW_RT.calls = SW_RT.calls.filter((t) => now - t < 3600000);
		return SW_RT.calls.length < Math.max(1, Number(cfg.maxCallsPerHour) || 60);
	};
```

**依据 3 · 源码核查**：[src/README.md:21-28](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/README.md#L21-L28)

作者说明预构建lib与整仓下载量。

````text
There is no build step: `lib/` already holds the built host and client bundles.

> **Note — this pulls the whole repository tarball, about 68 MB.** The 106 animations are most
> of it. On a slow connection that can time out. If it does, clone first and add the local path:

```bash
git clone --depth 1 https://github.com/12we21/cute-fat-fish-pet
dsh plugin --profile web add ./cute-fat-fish-pet/src
````

**依据 4 · 源码核查**：[src/README.md:54-69](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/README.md#L54-L69)

本地记忆/配置与未迁移的历史身份。

<details>
<summary>查看原文（16行）</summary>

```text
## Where your data lives

Chat memory and your configuration overrides live under `$DSH_HOME/dsh-pet/`. Nothing leaves
your machine unless you point the chat at an online model.

## About the name

The display name is 蓝毛小女仆 / Blue-Haired Little Maid and the repository keeps the bare
identifier `cute-fat-fish-pet`. The **DSH plugin package was renamed once, on 2026-10-10, from
`dsh-pet` to `cute-fat-fish-pet`** — `dsh-pet` is the upstream npm package and the row id of
another plugin's bundle patch. That rename does not move any user data: the data root
(`$DSH_HOME/dsh-pet/`), the route prefix (`/dsh-pet-7340`) and the browser storage keys are
hard-coded strings in `lib/`, not derived from the package name. The remaining internal
identifiers (`dsh-pet-electron-helper`, `BlueHairMaid`) stay — see
[../NOTICE.md](../NOTICE.md) §5. For the full option reference in the original wording, see
[UPSTREAM-README.md](UPSTREAM-README.md).
```

</details>

#### 缺口

- Electron、GPU/CPU占用、截图/附件清理和真实模型费用未知。
  **影响**：不能给持续陪伴成本或卸载清洁保证。
  **进一步探讨**：记录首次下载、空闲/聊天/看屏幕资源和退出残留；不愿维护这些资源时只用轻量动画或停用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 相对普通动画宠物和原生聊天是否值得采用？

**研究主题**：采用判断、贡献与相对优势

#### 完整回答

优势是把动画表情、桌面交互和上下文陪聊放在同一个角色中，比原生聊天多了陪伴表现，比纯动画多了模型回应；没有材料支持它改善工作产出或情绪疗效。当前应观察，主要因为看屏幕、模型目的地和进程下载的实际权限/退出边界仍需核清。只需动画的人更适合先用关闭聊天/监测的低功能模式；对敏感桌面或严格离线要求，应在确认发布lib实际出站前不启用看屏幕。任何菜单称本地但出现未预期出站、关闭后仍有在途不可接受操作或残留进程，都应停止并回到普通动画或原生聊天。

#### 证据与依据

**依据 1 · 源码核查**：[src/README.md:31-57](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/README.md#L31-L57)

作者陪伴功能与出站声明的任务范围。

<details>
<summary>查看原文（27行）</summary>

```text
## What you get

- **106 hand-drawn animations** — VP9-alpha `webm` with a real alpha channel, composited over
  your wallpaper. Idle breathing, dozing off and waking with a start, dancing, playing with a
  cat, eating, festivals, and a reaction for every click.
- **Desktop wandering** — she walks around on her own and reacts to the mouse: drag her,
  click her, and she notices.
- **Chat** — talk to her from the DSH Web UI. Point her at a local **Ollama** model, or at the
  online model your DSH session already uses. A global switch picks local-only, DSH-only, or
  local-first.
- **Quips** — she can drop a one-line remark generated by your session's own model.
- **Optional screen watching** — with the bundled native capture helper she can look at what
  is on your screen and comment on it. Off unless you turn it on.

## What this half does *not* have

The plugin is a subset of the standalone edition. These live in the standalone Windows build,
not in the DSH plugin:

- offline speech recognition (sherpa-onnx + SenseVoice)
- Edge TTS voices
- the single-page control console

## Where your data lives

Chat memory and your configuration overrides live under `$DSH_HOME/dsh-pet/`. Nothing leaves
your machine unless you point the chat at an online model.
```

</details>

**依据 2 · 源码核查**：[src/lib/index.js:2391-2418](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/lib/index.js#L2391-L2418)

真实截图/附件/模型链决定采用边界。

<details>
<summary>查看原文（28行）</summary>

```text
	const swJudge = async (cfg, force) => {
		const llm = ctx.llm;
		const att = typeof ctx.get === "function" ? ctx.get("attachments") : void 0;
		const sel = await swSelection(cfg);
		if (!llm || typeof llm.stream !== "function" || !att || !sel) return { error: cfg.brain === "local" ? "本地模型不可用：Ollama 没在跑，或还没拉下 " + String(cfg.localModel || "(未配置 localModel)") : "模型或附件服务不可用" };
		let ref;
		try {
			const saved = await att.saveImages([{ data: new Uint8Array(readFileSync(SW_SHOT)), mediaType: "image/jpeg", name: "screen.jpg" }]);
			ref = saved && saved[0];
		} catch (e) {
			return { error: "截图入附件失败：" + (e instanceof Error ? e.message : String(e)) };
		}
		if (!ref) return { error: "截图入附件失败" };
		const ask = force ? "主人让你现在点评一下屏幕上的情况。" : "这是主人此刻的屏幕。判断有没有值得点评的高光时刻、失误，或者卡住受挫。";
		const prompt = ask + '只回一行 JSON：{"react":true|false,"emotion":"success|error|thinking|waiting|result|working","say":"不超过40字的中文点评"}。没什么可说的就 react=false、say 留空。';
		const assembler = new BlockAssembler();
		try {
			for await (const chunk of llm.stream({
				provider: sel.provider,
				model: sel.model,
				messages: [createUserMessage({
					content: [{ type: "image", attachment: ref }, { type: "text", text: prompt }],
					source: { kind: "user" }
				})],
				system: SW_SYSTEM,
				temperature: 1,
				signal: AbortSignal.timeout(90000)
			})) assembler.push(chunk);
```

</details>

**依据 3 · 源码核查**：[src/lib/index.js:2150-2173](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/lib/index.js#L2150-L2173)

自动下载是额外采用负担。

<details>
<summary>查看原文（24行）</summary>

```text
	/** 拉起桌面 Helper：先探测本机 Electron；缺失时进程内异步下载
	*  （不 spawn 子进程，CLI node 与 DSH Desktop 均适用），下载完成后自动拉起。 */
	const startHelper = () => {
		if (helper || electronEnsure || disposed) return;
		if (!hasDesktopPet) return;
		if (!hasGraphicalDisplay()) {
			if (!displayWarned) {
				displayWarned = true;
				ctx.logger?.warn?.("[dsh-pet] 未检测到图形显示环境（DISPLAY/WAYLAND_DISPLAY 均为空），已跳过桌面宠物。浏览器内宠物不受影响；如需在服务器上启用桌面模式，请配置 Xvfb 后设置 DSH_PET_DESKTOP_FORCE=1。");
			}
			return;
		}
		const found = resolveElectronPath();
		if (found) {
			launchHelper(found);
			return;
		}
		console.warn(`[dsh-pet] Electron not found, downloading to ${defaultElectronExe()} ...`);
		electronEnsure = ensureElectronDownload().then((path) => {
			if (path) launchHelper(path);
			else console.warn("[dsh-pet] Electron download failed; desktop pet unavailable. Set DSH_PET_ELECTRON_PATH and restart, or retry later.");
		}).finally(() => {
			electronEnsure = void 0;
		});
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么机制改进可验证而不把陪伴设想当需求？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设是为首次Electron下载、截图附件保存及模型出站分别给可见收据，显示实际目标、数据种类和取消状态，而非只显示local/online档位；统一AbortController让“停下”能取消尚未完成的可取消阶段。最小验证使用合成截图、假服务和延迟附件：关闭前后观察网络、磁盘与口头提示是否一致，同现有开关对照。若用户仍不能判断谁收到截图、取消仍掩盖已发生持久化，或提示负担破坏陪伴体验，就否定当前方案。这是权限可理解性的设计假设，不是已确认产品机会，不能计入已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/index.js:2391-2418](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/lib/index.js#L2391-L2418)

附件持久和请求超时是统一取消/收据切入点。

<details>
<summary>查看原文（28行）</summary>

```text
	const swJudge = async (cfg, force) => {
		const llm = ctx.llm;
		const att = typeof ctx.get === "function" ? ctx.get("attachments") : void 0;
		const sel = await swSelection(cfg);
		if (!llm || typeof llm.stream !== "function" || !att || !sel) return { error: cfg.brain === "local" ? "本地模型不可用：Ollama 没在跑，或还没拉下 " + String(cfg.localModel || "(未配置 localModel)") : "模型或附件服务不可用" };
		let ref;
		try {
			const saved = await att.saveImages([{ data: new Uint8Array(readFileSync(SW_SHOT)), mediaType: "image/jpeg", name: "screen.jpg" }]);
			ref = saved && saved[0];
		} catch (e) {
			return { error: "截图入附件失败：" + (e instanceof Error ? e.message : String(e)) };
		}
		if (!ref) return { error: "截图入附件失败" };
		const ask = force ? "主人让你现在点评一下屏幕上的情况。" : "这是主人此刻的屏幕。判断有没有值得点评的高光时刻、失误，或者卡住受挫。";
		const prompt = ask + '只回一行 JSON：{"react":true|false,"emotion":"success|error|thinking|waiting|result|working","say":"不超过40字的中文点评"}。没什么可说的就 react=false、say 留空。';
		const assembler = new BlockAssembler();
		try {
			for await (const chunk of llm.stream({
				provider: sel.provider,
				model: sel.model,
				messages: [createUserMessage({
					content: [{ type: "image", attachment: ref }, { type: "text", text: prompt }],
					source: { kind: "user" }
				})],
				system: SW_SYSTEM,
				temperature: 1,
				signal: AbortSignal.timeout(90000)
			})) assembler.push(chunk);
```

</details>

**依据 2 · 源码核查**：[src/lib/index.js:2571-2584](https://github.com/12we21/cute-fat-fish-pet/blob/652c4abb3075e574b6fa5d68b79c8aadbaf7b6e7/src/lib/index.js#L2571-L2584)

当前停止与force行为提供反例。

<details>
<summary>查看原文（14行）</summary>

```text
		if (has(["监测状态", "什么模式", "当前模式", "监测模式"])) return swStatusText();
		if (has(["别看了", "停下", "关闭监测", "停止监测", "别盯着"])) {
			void swSave({ running: false });
			return "好，我不看了～";
		}
		if (has(["看着点", "开始监测", "盯着", "开始看", "帮我看着", "看着我玩"])) {
			void swSave({ running: true, trigger: "watch" });
			return "好嘞，我盯着啦，有高光我就喊你～";
		}
		if (has(["点评一下", "看看现在", "现在什么情况", "帮我看一下"])) {
			void swRun({ force: true }).then((r) => {
				if (r && !r.ok) void swSpeak("thinking", "呜……我现在看不了屏幕（" + String(r.reason) + "）");
			});
			return "让我看看屏幕…马上给你点评～";
```

</details>

#### 缺口

- 可见收据与统一取消是否减少错误理解未知。
  **影响**：不能宣称隐私收益已验证。
  **进一步探讨**：让用户在合成慢请求中预测出站/落盘状态，记录错误率和中断率；无改善则不扩展。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
