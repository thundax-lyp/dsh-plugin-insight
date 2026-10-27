# DeepSeek iDesign

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[62ee529](https://github.com/Devin-AXIS/deepseek-design/tree/62ee529e84423ba63e823b23860293a43b6eb03b/packages/deepseek-idesign)

<!-- BEGIN META -->
[![GitHub ★ 1,604](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C604&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Devin-AXIS/deepseek-design) [![npm 30d 2,130](https://img.shields.io/static/v1?label=npm+30d&message=2%2C130&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-idesign) [![最新发布 2026-08-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deepseek-idesign)
<!-- END META -->

> **功能**：在DSH中加入可视化Design视图，编辑本地HTML/CSS并把选区修改交给AI草稿。

> **亮点**：[Q01](#research-q01)、[Q03](#research-q03) iPolloWork Studio适配把真实文件、手动精调和选区草稿接入同一会话，减少定位转述；不是另创设计引擎。

> **主要限制**：[Q02](#research-q02)、[Q03](#research-q03) mtime冲突仅在带基线且非force时检查，原子替换不保证多编辑者事务；旧选区草稿也可能在文件变动后误指对象。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程亮点](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · iDesign交付什么，简单替代是什么？](#detail-section-15)
  - [Q02 · 选区如何成为草稿，保存冲突是否无条件保证？](#detail-section-16)
  - [Q03 · 可编辑交接增量与采用负担如何权衡？](#detail-section-17)
  - [Q04 · 绑定选区摘要能否降低旧定位误改？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要可继续编辑的原型、海报或信息卡的用户，在本地文件和视觉画布间迭代。

聊天生成HTML后浏览器加编辑器是简单基线；未比较完整任务节时或审美质量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Design视图 | 本地设计预览精调 | 不含PPT/Video |
| 选区草稿 | 定位局部AI修改 | 用户确认后发送，旧定位需重核 |
| 文件保存 | 真实HTML/CSS交接 | mtime检查有条件，非事务锁 |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 退路 |
|---|---|---|
| 匹配Node/DSH | 运行原生视图 | 核对包版本 |
| 已注册工作区 | 保存design项目 | 无工作区先不创建 |
| 许可与人工验收 | 确认用途和成果 | 超范围先核对许可 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与判据 | 失败处理 |
|---|---|---|
| 副本工作区打开Design | 用户确认项目位置 | 不修改原件 |
| 选择模板与元素 | 用户确认草稿目标 | 文件变动后重选 |
| 保存并重开检查 | 用户检查响应布局 | 冲突重载，不盲目force |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次 | DSH/Node与模型资源，未知 | 配对版本、工作区与模板，未知 |
| 持续 | 模型和素材资源，未知 | 布局/链接/选区复核，未知 |
| 失败恢复 | 重生成资源，未知 | 重载、冲突协调、文件回退，未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 任务 | 支持 | 缺口 |
|---|---|---|
| 局部设计迭代 | 视觉选区转草稿 | 修改准确性未测 |
| 文件保存 | 条件mtime与原子替换 | 并发无覆盖未验 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03) mtime冲突仅在带基线且非force时检查，原子替换不保证多编辑者事务；旧选区草稿也可能在文件变动后误指对象。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q01](#research-q01)、[Q03](#research-q03) iPolloWork Studio适配把真实文件、手动精调和选区草稿接入同一会话，减少定位转述；不是另创设计引擎。

复用同源/source双校验与setDraft确认边界；移植需保留workspace作用域与条件写入语义，不把原子rename当版本事务。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q02](#research-q02)、[Q03](#research-q03) mtime冲突仅在带基线且非force时检查，原子替换不保证多编辑者事务；旧选区草稿也可能在文件变动后误指对象。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q03](#research-q03) 适合许可范围内的副本项目试用；重要改动先保存版本，冲突后重载重选，不把force当默认恢复。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已检查client与实际分发lib关键路径；未运行，选区摘要绑定为未验证假设。

- 已检查：作者 README、包清单、源码路径 packages/deepseek-idesign/README.md、packages/deepseek-idesign/package.json、source/plugins/deepseek-idesign/src/client.tsx、packages/deepseek-idesign/lib/index.js、README.md、LICENSE 及固定范围 inventory；组件：packages/deepseek-idesign。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查packages组件与对应source适配器，分发lib为构建产物不计原创量；未运行、未全量对齐source与构建字节。
- 下一步：隔离项目并发人工/AI保存和DOM变动，核对条件409及误对象修改，尚未执行。

**分析版本**

- **仓库**：[Devin-AXIS/deepseek-design](https://github.com/Devin-AXIS/deepseek-design)
- **版本号**：0.2.2（[固定提交 62ee529](https://github.com/Devin-AXIS/deepseek-design/tree/62ee529e84423ba63e823b23860293a43b6eb03b)）
- **版本日期**：2026-10-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证假设是随选区绑定内容摘要和元素指纹，DOM变动任务比较误改与重选成本；无改善或负担过高则停止。

隔离项目并发人工/AI保存和DOM变动，核对条件409及误对象修改，尚未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 4384 | 4265 | 324 | — |
| .md | source | 2 | 166 | — | — | 1519 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/Devin-AXIS/deepseek-design/issues) 查看。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查原生可编辑设计工作流、选区交接和条件性文件冲突边界。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · iDesign交付什么，简单替代是什么？

**研究主题**：场景与需求、采用判断

#### 完整回答

面向需要网站、原型、海报或信息卡的使用者，将聊天生成的HTML/CSS留在当前工作区并在原生Design视图手动精调。它不包含PPT或Video Studio。合格交付是可重开编辑且符合需求与响应布局的项目文件，截图好看本身不够。原办法是让Agent写HTML后另开浏览器/编辑器，iDesign减少选择具体对象与描述修改位置的摩擦；业务需求、审美与跨设备验收仍需用户判断。

#### 证据与依据

**依据 1 · 作者声明**：[packages/deepseek-idesign/README.md:13-29](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/packages/deepseek-idesign/README.md#L13-L29)

作者定位非幻灯片设计与真实工作区文件。

<details>
<summary>查看原文（17行）</summary>

```text
## 让 DeepSeek Harness 真正拥有设计能力

`deepseek-idesign` 将 iPolloWork Design Studio 作为原生 **Design** 视图加入 DeepSeek Harness。AI 可以根据对话创建和修改设计文件，你也可以在同一个界面里直接选中元素，精调文字、字体、颜色、尺寸、间距、背景、链接与图片。

它适合网站、App 原型、海报、信息卡、数据报告、杂志文章等非幻灯片设计。编辑开关旁的 `+` 会打开专属 Design 模板市场；PPT 模板由独立的 [`deepseek-ippt`](https://www.npmjs.com/package/deepseek-ippt) 提供，Video Studio 不包含在本包中。

### 核心能力

- 作为 DeepSeek Harness 对话中的原生 **Design** 视图运行
- AI 对话生成、全局修改与选区级 **Ask AI**
- 画布内文字、排版、颜色、尺寸、间距、背景、链接和图片编辑
- 桌面与移动端预览
- 主题与设计令牌统一控制
- Design 模板市场
- 保存、撤销与文件冲突检测
- 真实 HTML、CSS 和项目文件保存在当前 Harness 工作区

```

</details>

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 选区如何成为草稿，保存冲突是否无条件保证？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

client从宿主workspace找到当前session，iframe收到消息时同时核对event.origin与source，再验证消息结构；Ask AI调用inputActions.setDraft而不是自动发送，因此用户仍有确认机会。写文件在分发lib中限制工作区路径、解析父目录realpath防逃逸，用临时文件再rename替换。冲突判断仅当force=false、baseUpdatedAt非空且目标存在时比较mtime差值超过0.5；这不是不可绕过版本锁，缺基线或强制写会跳过该检查，stat与rename间并发改变也不能靠原子替换本身保证无覆盖。源码支持减少一般意外覆盖，不足称并发事务或全量安全审计。

#### 证据与依据

**依据 1 · 源码核查**：[source/plugins/deepseek-idesign/src/client.tsx:23-45](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/source/plugins/deepseek-idesign/src/client.tsx#L23-L45)

同源/来源校验与setDraft链路。

<details>
<summary>查看原文（23行）</summary>

```text
  function StudioView({ sessionId, useWorkspaces, inputActions }: ConvViewProps) {
    const iframeRef = React.useRef<HTMLIFrameElement>(null);
    const workspace = useWorkspaces((state) => state.items.find((item) => item.sessionIds.includes(sessionId)));
    const projectId = `${String(sessionId)}${options.projectSuffix ?? ""}`;

    React.useEffect(() => {
      const receive = (event: MessageEvent) => {
        if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
        if (!isDesignStudioHostMessage(event.data)) return;
        if (event.data.type === "ask-document-ai") {
          inputActions.setDraft([
            `Help me improve the current ${options.studioTitle} document.`,
            `Project: design/${projectId}`,
            "Read manifest.json, then read its entry file and linked design-tokens.css before editing.",
            "Preserve the existing structure unless I request a redesign.",
            "My requested change:",
          ].join("\n"));
          return;
        }
        inputActions.setDraft(designStudioAskAiPrompt(event.data.request));
      };
      window.addEventListener("message", receive);
      return () => window.removeEventListener("message", receive);
```

</details>

**依据 2 · 源码核查**：[packages/deepseek-idesign/lib/index.js:3653-3671](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/packages/deepseek-idesign/lib/index.js#L3653-L3671)

父目录realpath限制。

<details>
<summary>查看原文（19行）</summary>

```text
async function verifiedWritePath$1(root, requested, prefix, studioTitle) {
	const relativePath = safeRelativePath$1(requested, prefix, studioTitle);
	const target = resolve(root, relativePath);
	if (!inside(root, target)) throw new StudioHttpError(403, "File path escaped the workspace.");
	let canonicalParent = root;
	for (const segment of relativePath.split("/").slice(0, -1)) {
		const next = resolve(canonicalParent, segment);
		const existing = await lstat(next).catch((error) => {
			if (errorCode(error) === "ENOENT") return null;
			throw error;
		});
		if (!existing) await mkdir(next).catch((error) => {
			if (errorCode(error) !== "EEXIST") throw error;
		});
		else if (!existing.isDirectory() && !existing.isSymbolicLink()) throw new StudioHttpError(400, `${studioTitle} folder path is not a directory.`);
		canonicalParent = await realpath(next);
		if (!inside(root, canonicalParent)) throw new StudioHttpError(403, "Symbolic links outside the workspace are not allowed.");
	}
	return resolve(canonicalParent, basename(target));
```

</details>

**依据 3 · 源码核查**：[packages/deepseek-idesign/lib/index.js:3685-3701](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/packages/deepseek-idesign/lib/index.js#L3685-L3701)

可选mtime检查与临时原子替换，限定并发声明。

<details>
<summary>查看原文（17行）</summary>

```text
async function writeStudioText(input) {
	if (Buffer.byteLength(input.content) > input.maxBytes) throw new StudioHttpError(413, `${input.studioTitle} file is too large.`);
	const path = await verifiedWritePath$1(input.root, input.requested, input.prefix, input.studioTitle);
	const current = await stat(path).catch((error) => {
		if (errorCode(error) === "ENOENT") return null;
		throw error;
	});
	if (!input.force && input.baseUpdatedAt != null && current && Math.abs(current.mtimeMs - input.baseUpdatedAt) > .5) throw new StudioHttpError(409, input.conflictMessage ?? `${input.studioTitle} changed since it was loaded. Reload before saving.`);
	const temporary = resolve(dirname(path), `.${basename(path)}.${randomUUID()}.tmp`);
	try {
		await writeFile(temporary, input.content, {
			encoding: "utf8",
			flag: "wx"
		});
		await rename(temporary, path);
	} finally {
		await unlink(temporary).catch(() => void 0);
```

</details>

#### 缺口

- 未注入两个编辑者同时保存
  **影响**：不能确认实际冲突路径覆盖与客户端基线传递
  **进一步探讨**：隔离项目同时人工/AI编辑并核对409、基线缺失和force行为

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 可编辑交接增量与采用负担如何权衡？

**研究主题**：贡献与相对优势、缺陷与关键质疑、效果与总成本

#### 完整回答

已有贡献是把可编辑文件、视觉选区和AI草稿组织成循环，相对截图生成多了精确再编辑，相对纯聊天HTML少做定位转述；Studio能力来自iPolloWork上游，不重复计为新设计引擎。主要限制是草稿选区生成到模型修改之间文件可能变化，旧定位可能指向错误对象，而mtime写入检查不约束模型对语义目标的理解。首次需匹配Node/DSH及已注册工作区，持续需检查布局、资源链接和合并修改，失败应保留文件、重载并重新选区而非强制覆盖。所查LICENSE仅列个人非商业和少于3人的内部非商业等有限用途，对3人及以上、外部服务或付费交付列出另取书面授权要求；这里只报告固定许可文本，不能把source available理解为无限商用。费用、人工分钟和商业授权条款未量化。

#### 证据与依据

**依据 1 · 源码核查**：[source/plugins/deepseek-idesign/src/client.tsx:25-42](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/source/plugins/deepseek-idesign/src/client.tsx#L25-L42)

草稿包含session目标，但没有本段的文件内容摘要绑定。

<details>
<summary>查看原文（18行）</summary>

```text
    const workspace = useWorkspaces((state) => state.items.find((item) => item.sessionIds.includes(sessionId)));
    const projectId = `${String(sessionId)}${options.projectSuffix ?? ""}`;

    React.useEffect(() => {
      const receive = (event: MessageEvent) => {
        if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
        if (!isDesignStudioHostMessage(event.data)) return;
        if (event.data.type === "ask-document-ai") {
          inputActions.setDraft([
            `Help me improve the current ${options.studioTitle} document.`,
            `Project: design/${projectId}`,
            "Read manifest.json, then read its entry file and linked design-tokens.css before editing.",
            "Preserve the existing structure unless I request a redesign.",
            "My requested change:",
          ].join("\n"));
          return;
        }
        inputActions.setDraft(designStudioAskAiPrompt(event.data.request));
```

</details>

**依据 2 · 作者声明**：[README.md:60-68](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/README.md#L60-L68)

共享上游与可编辑工作流主张。

```text
- **Harness 原生界面**：Design 与 PPT 作为独立视图出现在 DeepSeek Harness 对话中，不需要启动 iPolloWork 桌面端。
- **AI 与手动编辑并存**：既能让 AI 完整生成或重构，也能在画布中直接修改单个元素和全局主题。
- **选区级 Ask AI**：选中元素后，插件把明确的文件、定位信息和当前样式整理为对话草稿；由用户确认后再发送，不会自动提交。
- **真实项目文件**：作品保存在 Harness 工作区，而不是封闭的云端画布或不可编辑截图。
- **模板市场**：Design 与 PPT 拥有各自的精选模板入口；网站和海报不会混入 PPT，幻灯片也不会混入 Design。
- **可逆编辑**：支持保存、撤销和文件变更冲突检测，降低 AI 与手动编辑同时发生时的覆盖风险。
- **设计系统能力**：通过设计令牌统一管理颜色、字体、背景、圆角、阴影、间距和组件视觉语言。
- **独立安装**：每个 npm 包都包含所需的浏览器资源，只安装选择的能力，不把完整 iPolloWork 主项目带入 Harness。
- **原生 Video 工作流**：iVideo 直接复用 HyperFrames 时间线、可视化编辑、预览、校验与导出，不维护第二套视频引擎。
```

**依据 3 · 源码核查**：[LICENSE:15-53](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/LICENSE#L15-L53)

固定许可文本限定使用与另行授权范围。

<details>
<summary>查看原文（39行）</summary>

```text
2. Permitted Uses

You may use and modify the Software without prior written authorization only
for the limited uses below:

  a. Individual Personal Use by one natural person for that person's own
     non-commercial work, learning, research, evaluation, or testing; and
  b. Small Internal Use by fewer than three total Users solely for internal,
     non-commercial evaluation, testing, or operations.

Small Internal Use is permitted only when the Software and its functionality
are not sold, hosted for, provided to, or otherwise made available to
customers, clients, or other external third parties. The three-User threshold
is measured across all people who access, operate, deploy, administer, or
benefit from a shared deployment of the Software, whether they are employees,
contractors, founders, collaborators, or other personnel.

3. Prior Written Authorization Required

You must obtain prior written authorization from the Licensor before You do
any of the following:

  a. use the Software with three or more total Users, regardless of whether
     the use is personal, internal, commercial, non-commercial, individual,
     organizational, hosted, local, private, or public;
  b. provide the Software or its functionality to any external third party as
     a hosted, managed, cloud, SaaS, single-tenant, or multi-tenant service;
  c. sell, rent, lease, sublicense, resell, or distribute the Software for a
     fee or other commercial advantage, whether by an individual or an
     organization;
  d. incorporate the Software as a material component of a product or service
     offered to external third parties for revenue or other commercial
     advantage;
  e. use the Software to provide paid customer delivery, implementation,
     customization, operation, consulting, or outsourcing services;
  f. use the Software in any paid, revenue-generating, resale, white-label,
     agency, marketplace, or customer-facing context; or
  g. remove, alter, obscure, hide, or replace the iPolloWork brand attribution
     required by Section 4.
```

</details>

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 绑定选区摘要能否降低旧定位误改？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是将选区所属文件内容摘要与元素指纹随草稿保存，模型准备修改时先核对，失配就重新选择或要求用户确认。这从Q02的setDraft与Q03的异步文件变化推导；增量是语义目标与版本的交接，不能靠mtime替代。最小验证五个含DOM移动和同时人工改动的任务，对比现有定位和摘要绑定，记录错误对象修改及重新选择分钟；若误改不减少或维护成本更大就停止。

#### 证据与依据

**依据 1 · 源码核查**：[source/plugins/deepseek-idesign/src/client.tsx:32-42](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/source/plugins/deepseek-idesign/src/client.tsx#L32-L42)

当前草稿边界提供版本绑定的推导入口。

<details>
<summary>查看原文（11行）</summary>

```text
        if (event.data.type === "ask-document-ai") {
          inputActions.setDraft([
            `Help me improve the current ${options.studioTitle} document.`,
            `Project: design/${projectId}`,
            "Read manifest.json, then read its entry file and linked design-tokens.css before editing.",
            "Preserve the existing structure unless I request a redesign.",
            "My requested change:",
          ].join("\n"));
          return;
        }
        inputActions.setDraft(designStudioAskAiPrompt(event.data.request));
```

</details>

**依据 2 · 源码核查**：[packages/deepseek-idesign/lib/index.js:3692-3699](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/packages/deepseek-idesign/lib/index.js#L3692-L3699)

写入时mtime与原子替换不等同选区语义一致。

```text
	if (!input.force && input.baseUpdatedAt != null && current && Math.abs(current.mtimeMs - input.baseUpdatedAt) > .5) throw new StudioHttpError(409, input.conflictMessage ?? `${input.studioTitle} changed since it was loaded. Reload before saving.`);
	const temporary = resolve(dirname(path), `.${basename(path)}.${randomUUID()}.tmp`);
	try {
		await writeFile(temporary, input.content, {
			encoding: "utf8",
			flag: "wx"
		});
		await rename(temporary, path);
```

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
