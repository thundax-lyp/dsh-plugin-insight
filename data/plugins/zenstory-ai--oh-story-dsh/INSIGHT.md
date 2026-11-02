# Oh Story DSH

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[bc836dc](https://github.com/zenstory-ai/oh-story-dsh/tree/bc836dc0d2106aab2bf1179f0bc0eedc575635ab)

<!-- BEGIN META -->
[![GitHub ★ 665](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=665&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zenstory-ai/oh-story-dsh)
<!-- END META -->

> **功能**：在 DSH 原生会话中提供小说、短剧、互动游戏和视频解说的文件创作工作台。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把上游资源接入原生服务，并以版本条件保存和冲突交互连接人工/Agent写入；未将上游内容或宿主原子写计作本插件原创。

> **主要限制**：[Q03](#research-q03) 核实任务板成功只代表发现关联输出，生产工具不构成付费确认；脚本虽有精确内容闸门和句柄恢复，仍不能独立证明人类授权、供应商状态或最终质量。

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
  - [Q01 · 谁使用，组合的贡献由谁实现？](#detail-section-11)
  - [Q02 · 文件、工作台和原生Agent怎样接线？](#detail-section-12)
  - [Q03 · 媒体任务如何确认与恢复，哪些动作不代表交付？](#detail-section-13)
  - [Q04 · 依赖与成本会转移给谁？](#detail-section-14)
  - [Q05 · 哪类任务值得试，如何检验新增假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有DSH和文件创作习惯的作者，可在会话旁编辑项目、运行随包上游Skill并查看产物。

外部编辑器加上游Skill或DSH Chat手工查产物是直接替代；创作方法归上游，模型、会话和底层条件写归宿主。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 创作Skill接入 | 加载上游小说/短剧/游戏/视频方法与资源 | 方法归上游，质量由任务验收 |
| 文本编辑 | 在会话旁读取/保存项目文件 | baseVersion条件写，412需选择 |
| 生产界面意图 | 打开/聚焦/登记任务与镜头顺序 | 不生成媒体、不构成人工确认 |
| 精确job闸门 | 将执行绑定指纹和单次确认 | 内容一致不独立证明用户身份 |
| 已提交任务收集 | 根据provider handle取回产物 | 供应商实现/状态须核，未实测 |
| 任务与素材板 | 投影关联文件和回合状态 | 数量齐全不等质量或新鲜度验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node24+与匹配DSH | 启动必需 | 原生Skill/工具/界面和文件服务 | 按发布组件版本范围配对，未验宿主 |
| 宿主模型接入 | 创作必需 | 执行创作任务 | 只看已有文件不等AI创作可用 |
| Python>=3.9 | 短剧脚本必需 | 预检/生产与媒体适配 | 解释器探针不等脚本全运行通过 |
| Python>=3.10与媒体工具 | 视频流程必需 | 视频处理/交付 | 本轮不核全视频链 |
| 供应商账号与环境变量 | 对应媒体生成必需 | 付费图片/视频等 | 存在不等权限/余额/服务可用 |
| 文件备份与人工审稿 | 本次试用前提 | 冲突选择和质量验收 | 不把任务板成功当合格作品 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配对/备份 | 用户固定宿主和插件，保留项目文件 | 发布范围匹配、可回外部编辑器 |
| 文本创作 | 宿主执行Skill，用户编辑/保存 | 版本条件一致，412由用户选择 |
| 媒体预览 | Agent准备精确job与预检 | 按钮不是确认，不先调用供应商 |
| 确认/执行 | 用户明确后Agent按同指纹confirm/run | 脚本消费同job确认并固定输入 |
| 验收/恢复 | 用户核产物质量、句柄和实际状态 | 未知先collect/查服务，勿盲目重发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/模型/脚本环境和备份 | 配对、导入、配置媒体账号 | 金额与工时未知 |
| 持续使用 | 模型调用、媒体生成与存储 | 审稿、镜头/素材检查与版本选择 | 合格作品/尝试数未知 |
| 失败恢复 | 可能再生成和渲染 | 冲突处理、查供应商handle并收集 | 已提交不等取消，不保证无重复费用 |
| 退出 | 项目和历史素材留存 | 保存缓冲后回外部编辑器/上游Skill | 文件保留不等未保存草稿已备份 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文件协作 | baseVersion与宿主条件写、412冲突 | 全平台无丢稿和真实返工率 |
| 资源接入 | provider保留上游Skill资源根 | 所有创作任务质量 |
| 内容闸门 | job指纹、单次确认消费和输入快照 | 人类身份授权及供应商全行为 |
| 媒体恢复 | 记录provider handle并提供collect | 实际收费/取回与最终交付质量 |
| 任务投影 | 按关联输出数量和回合推状态 | 有文件是否即当前合格产物 |

> **思考**：[Q03](#research-q03) 核实任务板成功只代表发现关联输出，生产工具不构成付费确认；脚本虽有精确内容闸门和句柄恢复，仍不能独立证明人类授权、供应商状态或最终质量。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把上游资源接入原生服务，并以版本条件保存和冲突交互连接人工/Agent写入；未将上游内容或宿主原子写计作本插件原创。

[Q02](#research-q02) 插件与宿主分工明确，前后端共同保留版本；[Q03](#research-q03) UI意图、内容确认和已提交句柄分离值得借鉴，移植时不能把预览文本令牌当人类身份认证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 核实任务板成功只代表发现关联输出，生产工具不构成付费确认；脚本虽有精确内容闸门和句柄恢复，仍不能独立证明人类授权、供应商状态或最终质量。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先用文本副本检验改稿、保存与冲突恢复，不把付费媒体纳入已支持试用范围；草稿或状态失配就保全文件回原流程。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核固定版本的文件协作、provider和媒体内容闸门/恢复关键链，未执行目标、宿主或付费API。建议试用限文本项目，媒体全链未验收；收据视图为未验证设计。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/dsh-plugin/package.json、packages/dsh-plugin/src/index.ts、packages/dsh-plugin/src/skill-provider.ts、packages/dsh-plugin/src/workspace-route.ts、packages/dsh-plugin/src/client/index.tsx、packages/dsh-plugin/src/production-tool.ts、packages/dsh-plugin/src/client/production-runtime.ts、packages/dsh-plugin/src/client/production-prompts.ts、packages/knowledge/drama/skills/short-drama-produce/scripts/production_tool.py、packages/dsh-plugin/src/host-python.ts、packages/dsh-plugin/src/drama-adapters.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根仓inventory完整；定向读取provider、编辑器/文件路由、生产意图/状态、上游Python确认与collect关键路径。不穷尽四条创作流水线、供应商实现、预览隔离或宿主fs；没有执行目标或付费API。
- 下一步：文本先演练交错编辑/412和重载；媒体在独立副本用可控服务验证确认、输入变化、提交中断与collect；收据视图先核是否已有等价入口再做决策对照。

**分析版本**

- **仓库**：[zenstory-ai/oh-story-dsh](https://github.com/zenstory-ai/oh-story-dsh)
- **版本号**：0.1.21（[固定提交 bc836dc](https://github.com/zenstory-ai/oh-story-dsh/tree/bc836dc0d2106aab2bf1179f0bc0eedc575635ab)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提议把已有run/fingerprint/句柄与任务板投影并列，帮助区分有文件、可收集、输入过时和已验收；先排查同等能力，若错误决策或追查成本不降就否定。

文本先演练交错编辑/412和重载；媒体在独立副本用可控服务验证确认、输入变化、提交中断与collect；收据视图先核是否已有等价入口再做决策对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 574 | 65744 | — | — | 1148338 |
| .js | source | 34 | 17913 | 14093 | 2137 | — |
| .ts | source | 48 | 8679 | 7506 | 632 | — |
| .tsx | source | 15 | 3907 | 3564 | 175 | — |
| .ts | test | 21 | 3445 | 3090 | 83 | — |
| .tsx | test | 4 | 213 | 196 | 3 | — |
| .mjs | source | 3 | 1143 | 970 | 109 | — |
| .md | example | 1 | 16 | — | — | 208 |
| .mjs | test | 2 | 496 | 467 | 3 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/zenstory-ai/oh-story-dsh/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查原生创作工作台的文件协作与媒体确认/恢复边界，而不把任务投影当合格交付。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用，组合的贡献由谁实现？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向已经用DSH并以文件维护作品的作者，把小说、短剧、互动游戏和视频解说放到原生会话旁的工作台。根工程是private多包工作区，实际发布入口为@oh-story/dsh；本轮按可安装社区插件研究，而不把根目录的开发脚本当第二Agent运行时。合格交付是用户请求范围内的作品文件和可核对的产物，而不是工作台有四个标签。

入口真实注册四个Skill provider、原生hooks、角色工具、生产投影工具及工作区路由。provider遍历打包目录读SKILL.md并保留资源根，这支持将上游方法和脚本接入宿主，而不只复制提示词。上游Oh Story、Drama Skills、NovelToGame和video-recap内容的创作方法归上游，模型、会话和权限归DSH；本插件的贡献在原生界面、文件协议与生命周期适配。直接替代是外部编辑器加上游Skill，或在DSH Chat中手工打开输出；插件减少文件、Agent和预览间切换，但没有对照证明创作质量或交付速度改善。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:34-43](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/README.md#L34-L43)

作者明确四工作台和上游归属。

<details>
<summary>查看原文（10行）</summary>

```text
`oh-story-dsh` 是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）的社区插件，与 DeepSeek 无隶属关系。装上它，DSH Web 里多出四个创作工作台：小说、短剧、游戏、视频解说。Agent、会话、模型、权限审批和 Chat 仍然全是 DSH 原生的，插件只添加创作 Skills、专业 Roles、项目文件协议和工作台界面，不带第二套 Agent 运行时或项目数据库。

以下清单对应当前源码；已发布安装包的上游提交固定在该版本的 manifest 中，未发布更新见 [Unreleased](CHANGELOG.md#unreleased)。

| 工作台 | 上游能力（固定版本，随插件打包） | 主要入口 |
| --- | --- | --- |
| 小说 | [Oh Story 0.9.2](https://github.com/zenstory-ai/oh-story-claudecode/releases/tag/v0.9.2) · 14 Skills · 7 Roles | `/story`、`/story-long-write`、`/story-review`、`/story-publish` |
| 短剧 | [Drama Skills 0.10.0](https://github.com/zenstory-ai/drama-skills/releases/tag/v0.10.0) · 11 Skills | `/short-drama`、`/short-drama-write`、`/short-drama-storyboard`、`/short-drama-edit` |
| 游戏 | [NovelToGame 0.6.1](https://github.com/zenstory-ai/novel-to-game) · 7 Skills · 《金瓶梅》ADV 可玩示例（18+） | `/novel-to-game quick`、`/game-build`、`/game-qa` |
| 视频 | [video-recap-skills 0.6.2](https://github.com/zenstory-ai/video-recap-skills/releases/tag/v0.6.2) · 7 Skills（3 个用户入口） | `/video-recap`、`/video-script`、`/video-reference` |
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/src/index.ts:40-55](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/src/index.ts#L40-L55)

真实注册四provider、hooks、角色和路由。

<details>
<summary>查看原文（16行）</summary>

```text
/** Mount only domain contributions into the current DSH process. */
export async function apply(context: Context, config: Config = {}): Promise<void> {
  const trustedHosts = config.trustedHosts ?? [];
  for (const entry of trustedHosts) assertTrustedWorkspaceAuthority(entry);
  context.skills.registerProvider(() => createOhStorySkillProvider());
  context.skills.registerProvider(() => createDramaSkillProvider());
  context.skills.registerProvider(() => createNovelToGameSkillProvider());
  context.skills.registerProvider(() => createVideoRecapSkillProvider());
  registerOhStoryHooks(context);
  registerOhStoryProductionTool(context);
  await registerOhStoryRoleTool(context);
  registerWorkspaceRoute(context, { maxBytes: config.editorMaxBytes ?? 2_097_152, trustedHosts });
  // Register the bundled media adapters for this host up front so the first
  // short-drama-produce run has a config to pass; the preflight route repeats
  // this and reports the outcome, so a failure here only delays the message.
  await ensureDramaAdapterConfig(defaultDramaSkillRoot(), { python: (await hostPython(DRAMA_PYTHON)).command });
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin/src/skill-provider.ts:318-345](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/src/skill-provider.ts#L318-L345)

打包Skill以resourceBase保留脚本/参考资源。

<details>
<summary>查看原文（28行）</summary>

```text
function createBundledSkillProvider(
  providerName: string,
  skillRoot: string,
  content: (name: string, source: string) => string
): SkillProvider {
  const root = resolve(skillRoot);
  return {
    name: providerName,
    async list(): Promise<readonly SkillCandidate[]> {
      const directories = (await readdir(root, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();
      return Promise.all(directories.map(async (directory): Promise<SkillCandidate> => {
        const path = join(root, directory, "SKILL.md");
        const parsed = parseBundledSkill(await readFile(path, "utf8"));
        if (parsed.name !== directory) throw new Error(`Bundled skill directory "${directory}" does not match name "${parsed.name}".`);
        return {
          name: parsed.name,
          description: parsed.description,
          invocation: { modelInvocable: true, userInvocable: parsed.userInvocable },
          provider: providerName,
          source: "bundled",
          resourceBase: { kind: "directory", path: join(root, directory) },
          rank: BUNDLED_SKILL_RANK,
          locator: pathToFileURL(path),
          path
        };
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin/package.json:22-39](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/package.json#L22-L39)

发布组件、版本与宿主条件。

<details>
<summary>查看原文（18行）</summary>

```text
  "homepage": "https://github.com/zenstory-ai/oh-story-dsh#readme",
  "bugs": "https://github.com/zenstory-ai/oh-story-dsh/issues",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/zenstory-ai/oh-story-dsh.git",
    "directory": "packages/dsh-plugin"
  },
  "publishConfig": {
    "access": "public",
    "provenance": true
  },
  "engines": {
    "node": ">=24.0.0",
    "dsh": ">=0.2.0-rc.2 <0.2.1-0 || >=0.2.1-alpha.1 <0.2.2-0 || >=0.2.2-alpha.2 <0.2.3-0"
  },
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/types/index.d.ts",
```

</details>

#### 缺口

- 缺少作者完成同一作品任务的对照质量、切换次数和返工记录。
  **影响**：不能把四工作台或上游数量解释为已兑现效率。
  **进一步探讨**：以已有小作品比较外部编辑器加上游Skill与工作台全流程，记录交付完整性与人工返工。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件、工作台和原生Agent怎样接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工作台的编辑不是无条件覆盖磁盘。客户端提交读取时的baseVersion与当前内容，服务端要求版本非空，并经当前Session的sandboxPolicy调用宿主fs.writeText replaceIfVersion。保存成功期间若用户又编辑，客户端保留最新输入，只更新saved和version；遇412则重新读取磁盘版本，在保留本地缓冲的同时展示冲突选择。这比只靠前端dirty标记更有实质协作增量，能说明人工编辑和Agent写文件如何交接。

原子条件写本身由DSH文件服务提供，本轮没有审计宿主fs在各文件系统上的内部实现，所以不能保证全部平台竞争绝不丢稿。插件的职责是附带版本、使用会话权限和呈现冲突。文件协议允许回到外部编辑器，不依赖另一套项目数据库；但未保存缓冲仍在界面生命周期中，不能把文件为事实理解成所有未保存草稿已持久。Skill与角色执行继续使用宿主模型/会话，实际质量与取消恢复也受宿主和上游脚本约束。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/src/workspace-route.ts:796-811](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/src/workspace-route.ts#L796-L811)

实际版本条件写与sandboxPolicy。

<details>
<summary>查看原文（16行）</summary>

```text
    if (url.pathname === "/oh-story/file" && request.method === "PUT") {
      const realm = await workspaceRealm(context, url);
      const path = url.searchParams.get("path");
      if (path === null) throw new WorkspaceHttpError(400, "缺少文件路径。");
      const input = await jsonBody(request, options.maxBytes * 6 + 1_024);
      if (typeof input.content !== "string") throw new WorkspaceHttpError(400, "content 必须是字符串。");
      if (typeof input.baseVersion !== "string" || input.baseVersion === "") throw new WorkspaceHttpError(400, "baseVersion 必须是有效版本。");
      if (Buffer.byteLength(input.content) > options.maxBytes) throw new WorkspaceHttpError(413, "文件超过工作台大小限制。");
      const outcome = await realm.fs.writeText(
        await creativeTarget(realm, path),
        input.content,
        { kind: "replaceIfVersion", version: input.baseVersion as FsVersion },
        undefined,
        realm.sandboxPolicy.resolve({ session: realm.agent.session })
      );
      send(response, 200, { path, content: outcome.after, bytes: Buffer.byteLength(outcome.after), version: outcome.version });
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/src/client/index.tsx:1292-1320](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/src/client/index.tsx#L1292-L1320)

保存返回不覆盖期间的新输入。

<details>
<summary>查看原文（29行）</summary>

```text
  const savePath = useCallback(async (path: string) => {
    if (saveLocks.current.has(path)) return;
    const submitted = buffersRef.current[path];
    if (submitted === undefined || submitted.missing === true || submitted.content === submitted.saved) return;
    saveLocks.current.add(path);
    setBuffers((current) => {
      const existing = current[path];
      return existing === undefined ? current : { ...current, [path]: { ...existing, saving: true, error: undefined } };
    });
    try {
      const file = await json<FilePayload>(await fetch(endpoint("file", sessionId, path), {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ content: submitted.content, baseVersion: submitted.version })
      }));
      setBuffers((current) => {
        const latest = current[path];
        if (latest === undefined) return current;
        const unchanged = latest.content === submitted.content;
        return {
          ...current,
          [path]: {
            content: unchanged ? file.content : latest.content,
            saved: file.content,
            source: unchanged ? "disk" : "human",
            version: file.version,
            saving: false
          }
        };
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin/src/client/index.tsx:1323-1340](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/src/client/index.tsx#L1323-L1340)

412读取磁盘并保留本地缓冲/冲突。

<details>
<summary>查看原文（18行）</summary>

```text
    } catch (reason) {
      if (reason instanceof WorkspaceRequestError && reason.status === 412) {
        try {
          const theirs = await json<FilePayload>(await fetch(endpoint("file", sessionId, path)));
          setBuffers((current) => {
            const latest = current[path];
            if (latest === undefined) return current;
            return {
              ...current,
              [path]: {
                ...latest,
                saving: false,
                conflict: {
                  message: `${path} 已在磁盘上更新；请选择保留哪一版。`,
                  theirs: theirs.content,
                  theirsVersion: theirs.version
                }
              }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin/src/index.ts:27-29](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/src/index.ts#L27-L29)

宿主服务注入与所有权边界。

```text
export const inject = ["skills", "subagents", "tools", "typert", "webServer"];

/** DSH owns models, providers, presets, permissions, roots, runs, and sessions. */
```

#### 缺口

- 未核宿主fs条件写实现及浏览器重载/中断的真实草稿恢复。
  **影响**：只能确认插件接入了并发版本协议，不能承诺各平台不丢稿。
  **进一步探讨**：在副本中交错人工/Agent写入、保存返回和页面重载，核保留内容与版本、再匹配宿主条件写结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 媒体任务如何确认与恢复，哪些动作不代表交付？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

oh_story_production只校验并返回界面意图，不生成媒体、不改创作文档，也不构成付费确认。浏览器生成的生产提示明确按钮仅准备预览，须在后续用户消息确认同一预览后才confirm/run。这是Agent行为规则而不是独立人类身份验证。上游production_tool还有实际内容闸门：预览输出任务、prompt、references、outputs、参数与确认字符串；confirm验证job_id和fingerprint，run在项目锁内检查确认未消费、固定输入快照，再消费凭据并记录run。因确认字符串由可读取的预览生成，脚本验证的是精确内容一致和一次消费，不证明确认一定由人作出；人工授权仍依赖DSH审批和Agent遵守提示。

已提交任务有独立provider handle路径，异常记录会保留句柄，collect可针对未完成尝试取回而非重新提交。这是避免超时后重复计费的具体机制，不能保证所有服务都已经收集成功；句柄写出前断开仍须用户查询供应商状态。前端任务板按任务ID相关输出数量推succeeded，回合结束无成果则dispatched_unknown并警告刷新后再重试。因此界面成功表示发现足量关联文件，不等于文件质量、输入新鲜度和最终成片都验收。

不能沿用“缺少指纹/新鲜度协议”的推断。当前脚本本来就有任务fingerprint、输入哈希检查和不可变快照，新增方向必须复用这些事实。本轮定向核了内容闸门与句柄恢复，未穷尽所有供应商、剪辑/游戏/视频流程及跨系统故障，故不把付费媒体纳入已验证采用范围。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/src/production-tool.ts:19-49](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/src/production-tool.ts#L19-L49)

工具描述和execute只返回投影意图。

<details>
<summary>查看原文（31行）</summary>

```text
export function createOhStoryProductionTool(): ToolDefinition {
  return defineTool({
    name: OH_STORY_PRODUCTION_TOOL_NAME,
    description: "Operate the native oh-story short-drama production projection in the current DSH Session. It can open or focus semantic production targets, set an explicit shot order, or track a job the Agent is actually executing. It never controls cosmetic canvas layout, generates media, changes creator documents, or counts as creator confirmation for paid production.",
    parameters: {
      action: { type: "string", required: true, enum: PRODUCTION_INTENT_ACTIONS, description: "The exact production UI/task projection operation." },
      episode: { type: "string", required: true, description: "Creator-first episode directory, for example 剧集/EP001." },
      section: { type: "string", enum: PRODUCTION_INTENT_SECTIONS },
      targetId: { type: "string" },
      shotIds: { type: "array", items: { type: "string" } },
      jobId: { type: "string", description: "Stable ID that must also appear in produced output filenames." },
      jobKind: { type: "string", enum: PRODUCTION_INTENT_JOB_KINDS },
      expectedOutputs: { type: "integer", description: "Number of media files this job will produce. Repeat the count the creator approved when re-registering a batch; omit it to keep the count the workbench already recorded." },
      prompt: { type: "string", description: "Exact prompt/specification for a tracked job; not a production authorization." }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          action: { type: "string", required: true, enum: PRODUCTION_INTENT_ACTIONS },
          episode: { type: "string", required: true },
          message: { type: "string", required: true }
        }
      },
      render: (_args, value) => [{ type: "text", text: value.message }]
    },
    isConcurrencySafe: () => true,
    execute(args) {
      const intent = validateProductionIntent(args);
      return Promise.resolve({ action: intent.action, episode: intent.episode, message: intentMessage(intent) });
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/src/client/production-prompts.ts:31-49](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/src/client/production-prompts.ts#L31-L49)

按钮只准备，不等生产确认。

<details>
<summary>查看原文（19行）</summary>

```text
  return `/short-drama-produce

只准备当前单项生产任务，不运行 Provider。
- 任务 ID：${job.id}
- 任务类型：${job.kind === "image" ? "图片/关键帧" : "镜头视频"}
- 建议 adapter 契约：${job.kind === "image" ? "gpt-image-2" : "seedance"}（实际配置与模型以当前 DSH 运行环境为准）
- 投产对象：${job.targetId}
- 创作文档目录：${production.episodeDirectory}
- 工作台列出的补充参考（不是生产输入快照）：
${referenceText}
- 输出目录：${production.episodeDirectory}/制作成果/${job.targetId}
- 输出文件名必须同时包含投产对象 ID 与任务 ID ${job.id}，以便 DSH 工作台关联版本。

待预检提示词：
${job.prompt}

${referenceParagraph(job.kind)}

按 short-drama-produce 的硬闸门建立临时 job 并执行 prepare，在 Chat 中完整展示 adapter、模型/profile、数量、参数、references、outputs 与 overwrite。此按钮只表达“准备预览”，不构成看到预览后的生产确认；不得 confirm 或 run。用户在后续消息明确确认这份预览后，才可调用 oh_story_production track_job 登记同一个任务 ID，并运行 Provider。${authorityBoundary}`;
```

</details>

**依据 3 · 源码核查**：[packages/knowledge/drama/skills/short-drama-produce/scripts/production_tool.py:1278-1328](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/knowledge/drama/skills/short-drama-produce/scripts/production_tool.py#L1278-L1328)

预览/确认绑定fingerprint及输入检查。

<details>
<summary>查看原文（51行）</summary>

```text
def _preview(job: Mapping[str, Any]) -> dict[str, Any]:
    confirmation = f"CONFIRM {job['job_id']} {str(job['fingerprint'])[:12]}"
    return {
        "job_id": job["job_id"],
        "modality": job["modality"],
        "adapter": job["adapter"],
        "count": len(job["outputs"]),
        "prompt": job["prompt"],
        "source": job["source"],
        "source_entry": job["source_entry"],
        "references": job["references"],
        "reference_bindings": job["reference_bindings"],
        "outputs": job["outputs"],
        "parameters": job["parameters"],
        "overwrite": job["overwrite"],
        "confirmation": confirmation,
        "state": "needs_confirmation",
    }


def confirm_job(root: Path, *, job_id: str, confirmation: str) -> dict[str, Any]:
    root = find_project(root)
    with _project_lock(root):
        if _active_run(root, job_id) is not None:
            raise RuntimeError("this job is already running")
        job = _read_job(root, job_id)
        expected = _preview(job)["confirmation"]
        if confirmation != expected:
            raise ConfirmationRequiredError("confirmation does not match the exact current job")
        receipt = {
            "schema_version": JOB_SCHEMA,
            "job_id": job_id,
            "fingerprint": job["fingerprint"],
            "confirmed_at": utc_now(),
            "consumed_at": None,
            "run_id": None,
        }
        _metadata_atomic_json(
            root, ("confirmations",), f"{_job_key(job_id)}.json", receipt
        )
    return {"job_id": job_id, "state": "confirmed"}


def _inputs_current(root: Path, job: Mapping[str, Any]) -> bool:
    inputs = job.get("inputs")
    if not isinstance(inputs, Mapping):
        return False
    try:
        return all(_hash_project_file(root, str(path)) == digest for path, digest in inputs.items())
    except (FileNotFoundError, OSError, ValueError):
        return False
```

</details>

**依据 4 · 源码核查**：[packages/knowledge/drama/skills/short-drama-produce/scripts/production_tool.py:1726-1785](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/knowledge/drama/skills/short-drama-produce/scripts/production_tool.py#L1726-L1785)

项目锁、确认消费与不可变输入/handle路径。

<details>
<summary>查看原文（60行）</summary>

```text
        with _project_lock(root):
            if _active_run(root, job_id) is not None:
                raise RuntimeError("this job is already running")
            job = _read_job(root, job_id)
            command, timeout, roles = _load_adapter(adapter_config, str(job["adapter"]), root)
            _require_adapter_roles(job, roles)
            try:
                receipt = _metadata_read_json(
                    root,
                    ("confirmations",),
                    f"{_job_key(job_id)}.json",
                    maximum=MAX_RUN_RECORD_BYTES,
                )
            except FileNotFoundError as exc:
                raise ConfirmationRequiredError("job needs explicit confirmation") from exc
            if (
                not isinstance(receipt, dict)
                or receipt.get("fingerprint") != job.get("fingerprint")
                or receipt.get("consumed_at") is not None
            ):
                raise ConfirmationRequiredError("job needs a new explicit confirmation")
            for output in job["outputs"]:
                target = _project_file(root, output)
                if target.exists() and not job["overwrite"]:
                    raise FileExistsError(f"output exists and overwrite is false: {output}")
            # Pin every confirmed input into a private immutable snapshot before
            # consuming confirmation. Provider adapters never reopen live project paths.
            _snapshot_inputs(root, job, snapshot_root)
            run_id = f"{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S')}-{uuid.uuid4().hex[:8]}"
            receipt["consumed_at"] = utc_now()
            receipt["run_id"] = run_id
            _metadata_atomic_json(
                root,
                ("confirmations",),
                f"{_job_key(job_id)}.json",
                receipt,
            )
            run = {
                "schema_version": JOB_SCHEMA,
                "run_id": run_id,
                "job_id": job_id,
                "fingerprint": job["fingerprint"],
                "modality": job["modality"],
                "adapter": job["adapter"],
                "status": "running",
                "started_at": utc_now(),
                "finished_at": None,
                "outputs": [],
            }
            _write_run(root, job_id, run)

        payload = {key: job[key] for key in ALLOWED_JOB_KEYS if key in job}
        payload.update(
            {
                "run_id": run_id,
                "project_root": str(snapshot_root),
                "output_root": str(output_root),
                # Where to record the provider job id the instant it exists, so
                # an interrupted attempt can be collected instead of re-billed.
                "handle_path": str(_handle_metadata_path(root, job_id, run_id)),
```

</details>

**依据 5 · 源码核查**：[packages/knowledge/drama/skills/short-drama-produce/scripts/production_tool.py:1822-1834](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/knowledge/drama/skills/short-drama-produce/scripts/production_tool.py#L1822-L1834)

异常保留供应商句柄，超时不等取消。

<details>
<summary>查看原文（13行）</summary>

```text
        except Exception as exc:
            with _project_lock(root):
                run["status"] = "failed"
                run["finished_at"] = utc_now()
                if isinstance(exc, AdapterError) and exc.public_error is not None:
                    run["error"] = exc.public_error
                # A timeout or a killed adapter does not cancel the provider's
                # task. Carry the handle onto the failed record so `audit` can
                # say "collect this" instead of the creator paying twice.
                orphan = _read_provider_handle(root, job_id, run_id)
                if orphan is not None:
                    run["provider_job_id"] = orphan
                _write_run(root, job_id, run)
```

</details>

**依据 6 · 源码核查**：[packages/knowledge/drama/skills/short-drama-produce/scripts/production_tool.py:1854-1896](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/knowledge/drama/skills/short-drama-produce/scripts/production_tool.py#L1854-L1896)

collect取回已提交任务不重新提交。

<details>
<summary>查看原文（43行）</summary>

```text
def collect_job(root: Path, *, job_id: str, adapter_config: Path) -> dict[str, Any]:
    """Collect an already-submitted task's result without submitting a new one.

    This is deliberately outside the confirmation gate. The gate exists to stop
    an unintended charge; collecting costs nothing, because the charge already
    happened when the task was submitted. Requiring a fresh confirmation here
    would mean the cheapest way out of an interrupted attempt is to pay again,
    which is exactly the outcome the gate is meant to prevent.
    """

    root = find_project(root)
    with tempfile.TemporaryDirectory(prefix="short-drama-collect-") as directory:
        output_root = Path(directory) / "outputs"
        output_root.mkdir(parents=True)
        with _project_lock(root):
            job = _read_job(root, job_id)
            command, timeout, _ = _load_adapter(adapter_config, str(job["adapter"]), root)
            target_run = None
            for run in reversed(_read_run_history(root, job_id)):
                if run.get("status") == "succeeded":
                    continue
                handle = run.get("provider_job_id") or _read_provider_handle(
                    root, job_id, str(run["run_id"])
                )
                if handle:
                    target_run = (run, handle)
                    break
            if target_run is None:
                raise RuntimeError(
                    "no unfinished attempt of this job carries a provider job id; "
                    "there is nothing to collect"
                )
            run, provider_job_id = target_run

        payload = {key: job[key] for key in ALLOWED_JOB_KEYS if key in job}
        payload.update(
            {
                "run_id": str(run["run_id"]),
                "output_root": str(output_root),
                "collect_provider_job_id": provider_job_id,
            }
        )
        response = _run_adapter(command, timeout, payload, root)
```

</details>

**依据 7 · 源码核查**：[packages/dsh-plugin/src/client/production-runtime.ts:246-283](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/src/client/production-runtime.ts#L246-L283)

前端按成果数量推成功，缺成果保持未知。

<details>
<summary>查看原文（38行）</summary>

```text
  const reconciled = settleCompositions(jobs).map((job): ProductionJob => {
    const queued = queuedItemForJob(job.id, queue) !== undefined;
    // A terminal job is never revived by a result that arrived later. This matters most for
    // `outputPath`: a shared deliverable name carries no job identity, so without this guard
    // the next cut would complete a job the creator canceled, and bury the error a failed one
    // reported. A job-id correlated failure keeps its old behaviour — that output really is its own.
    if (job.status === "canceled" || job.status === "succeeded") return job;
    if (job.status === "failed" && job.outputPath !== undefined) return job;
    const outputs = outputsForJob(job, versions);

    if (outputs.length >= job.expectedOutputs) {
      return {
        ...job,
        status: "succeeded",
        progress: 100,
        completedOutputs: outputs.length,
        output: outputs[0],
        error: undefined
      };
    }
    if (job.status === "awaiting_confirmation" && outputs.length === 0) return job;
    if (job.status === "running" && queued) return { ...job, status: "pending", progress: 0 };
    if (job.status === "pending" && sessionRunning && !queued && job === latestPending) {
      return { ...job, status: "running", progress: Math.max(10, job.progress), error: undefined };
    }
    if (!sessionRunning && !queued && (job.status === "running" || job.status === "dispatched_unknown")) {
      return {
        ...job,
        status: "dispatched_unknown",
        progress: Math.round(outputs.length / job.expectedOutputs * 100),
        completedOutputs: outputs.length,
        // Assembly is local ffmpeg, so nothing was billed: a missing cut usually means edit_tool
        // check blocked the render, and those findings — not a billing warning — are what to show.
        error: outputs.length > 0
          ? `DSH Turn 已结束，已发现 ${String(outputs.length)}/${String(job.expectedOutputs)} 项成果；请刷新核对剩余输出。`
          : job.kind === "composition"
            ? "成片未生成：请在 Chat 查看 edit_tool check 的阻断项（未采用镜头理由、画幅/帧率不一致等），修正后再合成。"
            : "DSH Turn 已结束，尚未发现关联成果。任务可能已派发，请先刷新成果，避免重复计费。"
```

</details>

#### 缺口

- 供应商实际授权、提交前断开、计费和collect全链没有运行证据。
  **影响**：内容闸门不能升级为人工授权或全链不重复计费保证。
  **进一步探讨**：用隔离供应商桩和可控账号记录提交/句柄/超时/收集，核同一任务仅消费一次并在未知结果时先查询。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖与成本会转移给谁？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

接入需要Node24+与发布组件声明的DSH版本范围，安装和启动版本必须配对；README的兼容和录制属于作者材料，本轮未安装验证。文本创作需要宿主模型接入；短剧生产另需Python>=3.9、供应商账号/环境变量与媒体成本，视频解说Python>=3.10及相应媒体工具。hostPython先探python3再python并选择满足各Skill最低版本的解释器；adapter配置模块只报告环境变量是否存在，存在不证明账号权限、余额、地区或服务可用。

首次是运行时配对、已有项目导入、备份和模型/媒体环境配置；持续是创作调用、媒体生成、存储和人工审稿，短剧还需检查镜头、资产引用与选用素材。失败恢复包括文本版本冲突选择、重新渲染和外部任务状态查询；返工可能再次收费，不能把开源许可证或本地预览当零费用。退出可保留项目文件并回外部编辑器/上游Skill，但浏览器未保存缓冲需先落盘。没有真实工时、合格产物分母、API价目和尝试数，不输出ROI、节时或单位成片成本。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/package.json:33-39](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/package.json#L33-L39)

Node和DSH版本范围。

```text
  "engines": {
    "node": ">=24.0.0",
    "dsh": ">=0.2.0-rc.2 <0.2.1-0 || >=0.2.1-alpha.1 <0.2.2-0 || >=0.2.2-alpha.2 <0.2.3-0"
  },
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/types/index.d.ts",
```

**依据 2 · 源码核查**：[packages/dsh-plugin/src/host-python.ts:10-18](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/src/host-python.ts#L10-L18)

不同Skill Python门槛与探针。

```text
/** Every bundled Drama script declares `MINIMUM_PYTHON = (3, 9)`. */
export const DRAMA_PYTHON: PythonFloor = [3, 9];
/** video-recap-skills documents Python 3.10 or newer. */
export const VIDEO_PYTHON: PythonFloor = [3, 10];

export async function commandOutput(command: string, args: readonly string[]): Promise<string | undefined> {
  try {
    const { stdout, stderr } = await execFileAsync(command, [...args], { encoding: "utf8", timeout: 5_000, maxBuffer: 4 * 1_024 * 1_024 });
    return `${stdout}${stderr}`.trim();
```

**依据 3 · 源码核查**：[packages/dsh-plugin/src/host-python.ts:39-49](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/src/host-python.ts#L39-L49)

选择满足最低版本的解释器。

<details>
<summary>查看原文（11行）</summary>

```text
export async function hostPython(
  floor: PythonFloor,
  probe: (command: string, args: readonly string[]) => Promise<string | undefined> = commandOutput
): Promise<{ readonly command: string; readonly probe: PythonProbe }> {
  let fallback: { readonly command: string; readonly probe: PythonProbe } | undefined;
  for (const command of ["python3", "python"]) {
    const parsed = pythonVersion(await probe(command, ["--version"]), floor);
    if (parsed.ok) return { command, probe: parsed };
    if (parsed.version !== undefined) fallback ??= { command, probe: parsed };
  }
  return fallback ?? { command: "python3", probe: { ok: false, minimum: pythonVersion(undefined, floor).minimum } };
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin/src/drama-adapters.ts:6-14](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/src/drama-adapters.ts#L6-L14)

供应商执行与只报告环境变量存在的边界。

```text
/**
 * Drama Skills generates no media by itself and neither does DeepSeek: every
 * image, video, speech, or music result comes from a provider adapter that
 * `short-drama-produce` runs through `production_tool.py run --adapter-config`.
 * Upstream deliberately leaves that config file and its credentials outside
 * every project. This module names the bundled adapters (five as of Drama
 * Skills 0.7.1, one per `provider_adapters.py` choice), registers them for the
 * current DSH host so the Agent has a file to pass, and reports which host
 * environment variables are present — never their values.
```

**依据 5 · 源码核查**：[packages/dsh-plugin/src/drama-adapters.ts:51-68](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/src/drama-adapters.ts#L51-L68)

具体图片/视频适配器、环境条件和超时。

<details>
<summary>查看原文（18行）</summary>

```text
export const DRAMA_ADAPTERS: readonly DramaAdapterSpec[] = [
  {
    name: "gpt-image-2",
    label: "GPT Image 2",
    modality: "image",
    requiredEnv: ["OPENAI_API_KEY"],
    optionalEnv: ["OPENAI_BASE_URL"],
    timeoutSeconds: 600,
    reference: "short-drama-produce/references/providers/gpt-image-2.md"
  },
  {
    name: "seedance",
    label: "Seedance",
    modality: "video",
    requiredEnv: ["ARK_API_KEY", "SEEDANCE_MODEL"],
    optionalEnv: ["SEEDANCE_BASE_URL", "SEEDANCE_ALLOWED_RATIOS", "SEEDANCE_MIN_DURATION", "SEEDANCE_MAX_DURATION"],
    timeoutSeconds: 3_600,
    reference: "short-drama-produce/references/providers/seedance.md"
```

</details>

**依据 6 · 源码核查**：[packages/knowledge/drama/skills/short-drama-produce/scripts/production_tool.py:1822-1834](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/knowledge/drama/skills/short-drama-produce/scripts/production_tool.py#L1822-L1834)

失败后远端仍可能已执行的恢复责任。

<details>
<summary>查看原文（13行）</summary>

```text
        except Exception as exc:
            with _project_lock(root):
                run["status"] = "failed"
                run["finished_at"] = utc_now()
                if isinstance(exc, AdapterError) and exc.public_error is not None:
                    run["error"] = exc.public_error
                # A timeout or a killed adapter does not cancel the provider's
                # task. Carry the handle onto the failed record so `audit` can
                # say "collect this" instead of the creator paying twice.
                orphan = _read_provider_handle(root, job_id, run_id)
                if orphan is not None:
                    run["provider_job_id"] = orphan
                _write_run(root, job_id, run)
```

</details>

#### 缺口

- 没有指定模型/媒体任务的真实账单、成功率、返工和人工时间。
  **影响**：无法比较端到端作品成本或是否值得替代原工具链。
  **进一步探讨**：固定一段文本和一集小样，分别计首次配置、全部生成尝试、收集/返工、复核和退出成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪类任务值得试，如何检验新增假设？

**研究主题**：采用判断、新假设与验证

#### 完整回答

已使用匹配DSH并有文件项目的作者，可以先试文本编辑、Skill调用和412冲突恢复，不先扩展到真实付费媒体。交付验收应是改稿符合请求、文件版本没混、可从外部编辑器回读；若草稿覆盖、宿主不匹配或任务板与实际产物不一致，停用工作台并保留文件/版本，回外部编辑器与上游Skill。需要立即稳定成片、无法人工审稿或不能接受供应商未知状态的人，当前材料不足以支持直接采用。

待验证假设是把上游已有run/fingerprint/输入哈希/供应商句柄与工作台“发现输出文件”的状态并排呈现，让用户区分有文件、已收集、输入已变和质量已验收。增量不是再建第二数据库，也不是发明当前已有的fingerprint，而是减少用户跨Chat、元数据和素材板判断何时重试/重生成的负担。已查reconcileJobs按数量标成功且有dispatched_unknown，是明确比较基线；本轮未穷尽所有UI，需要先排查等价入口，不能断言整个项目没有收据视图。

最小对照用一集副本，改变提示词、替换同名文件、制造已提交未收集和质量不合格但数量齐全四类情况，比较当前任务板与合并既有收据视图。记录错误重试/重复提交、误把旧产物当当前交付、人工定位时间与维护代价。若已有入口完全满足、合并视图制造更多状态冲突或负担不降，就否定这个设计；没有结果前不计作当前贡献。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/src/client/index.tsx:1323-1340](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/src/client/index.tsx#L1323-L1340)

文本试用的具体冲突可见性。

<details>
<summary>查看原文（18行）</summary>

```text
    } catch (reason) {
      if (reason instanceof WorkspaceRequestError && reason.status === 412) {
        try {
          const theirs = await json<FilePayload>(await fetch(endpoint("file", sessionId, path)));
          setBuffers((current) => {
            const latest = current[path];
            if (latest === undefined) return current;
            return {
              ...current,
              [path]: {
                ...latest,
                saving: false,
                conflict: {
                  message: `${path} 已在磁盘上更新；请选择保留哪一版。`,
                  theirs: theirs.content,
                  theirsVersion: theirs.version
                }
              }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/src/client/production-runtime.ts:246-283](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/dsh-plugin/src/client/production-runtime.ts#L246-L283)

现有成果数量和未知投影提供对照。

<details>
<summary>查看原文（38行）</summary>

```text
  const reconciled = settleCompositions(jobs).map((job): ProductionJob => {
    const queued = queuedItemForJob(job.id, queue) !== undefined;
    // A terminal job is never revived by a result that arrived later. This matters most for
    // `outputPath`: a shared deliverable name carries no job identity, so without this guard
    // the next cut would complete a job the creator canceled, and bury the error a failed one
    // reported. A job-id correlated failure keeps its old behaviour — that output really is its own.
    if (job.status === "canceled" || job.status === "succeeded") return job;
    if (job.status === "failed" && job.outputPath !== undefined) return job;
    const outputs = outputsForJob(job, versions);

    if (outputs.length >= job.expectedOutputs) {
      return {
        ...job,
        status: "succeeded",
        progress: 100,
        completedOutputs: outputs.length,
        output: outputs[0],
        error: undefined
      };
    }
    if (job.status === "awaiting_confirmation" && outputs.length === 0) return job;
    if (job.status === "running" && queued) return { ...job, status: "pending", progress: 0 };
    if (job.status === "pending" && sessionRunning && !queued && job === latestPending) {
      return { ...job, status: "running", progress: Math.max(10, job.progress), error: undefined };
    }
    if (!sessionRunning && !queued && (job.status === "running" || job.status === "dispatched_unknown")) {
      return {
        ...job,
        status: "dispatched_unknown",
        progress: Math.round(outputs.length / job.expectedOutputs * 100),
        completedOutputs: outputs.length,
        // Assembly is local ffmpeg, so nothing was billed: a missing cut usually means edit_tool
        // check blocked the render, and those findings — not a billing warning — are what to show.
        error: outputs.length > 0
          ? `DSH Turn 已结束，已发现 ${String(outputs.length)}/${String(job.expectedOutputs)} 项成果；请刷新核对剩余输出。`
          : job.kind === "composition"
            ? "成片未生成：请在 Chat 查看 edit_tool check 的阻断项（未采用镜头理由、画幅/帧率不一致等），修正后再合成。"
            : "DSH Turn 已结束，尚未发现关联成果。任务可能已派发，请先刷新成果，避免重复计费。"
```

</details>

**依据 3 · 源码核查**：[packages/knowledge/drama/skills/short-drama-produce/scripts/production_tool.py:1726-1785](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/knowledge/drama/skills/short-drama-produce/scripts/production_tool.py#L1726-L1785)

已有确认指纹/运行与句柄，不应重复发明。

<details>
<summary>查看原文（60行）</summary>

```text
        with _project_lock(root):
            if _active_run(root, job_id) is not None:
                raise RuntimeError("this job is already running")
            job = _read_job(root, job_id)
            command, timeout, roles = _load_adapter(adapter_config, str(job["adapter"]), root)
            _require_adapter_roles(job, roles)
            try:
                receipt = _metadata_read_json(
                    root,
                    ("confirmations",),
                    f"{_job_key(job_id)}.json",
                    maximum=MAX_RUN_RECORD_BYTES,
                )
            except FileNotFoundError as exc:
                raise ConfirmationRequiredError("job needs explicit confirmation") from exc
            if (
                not isinstance(receipt, dict)
                or receipt.get("fingerprint") != job.get("fingerprint")
                or receipt.get("consumed_at") is not None
            ):
                raise ConfirmationRequiredError("job needs a new explicit confirmation")
            for output in job["outputs"]:
                target = _project_file(root, output)
                if target.exists() and not job["overwrite"]:
                    raise FileExistsError(f"output exists and overwrite is false: {output}")
            # Pin every confirmed input into a private immutable snapshot before
            # consuming confirmation. Provider adapters never reopen live project paths.
            _snapshot_inputs(root, job, snapshot_root)
            run_id = f"{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S')}-{uuid.uuid4().hex[:8]}"
            receipt["consumed_at"] = utc_now()
            receipt["run_id"] = run_id
            _metadata_atomic_json(
                root,
                ("confirmations",),
                f"{_job_key(job_id)}.json",
                receipt,
            )
            run = {
                "schema_version": JOB_SCHEMA,
                "run_id": run_id,
                "job_id": job_id,
                "fingerprint": job["fingerprint"],
                "modality": job["modality"],
                "adapter": job["adapter"],
                "status": "running",
                "started_at": utc_now(),
                "finished_at": None,
                "outputs": [],
            }
            _write_run(root, job_id, run)

        payload = {key: job[key] for key in ALLOWED_JOB_KEYS if key in job}
        payload.update(
            {
                "run_id": run_id,
                "project_root": str(snapshot_root),
                "output_root": str(output_root),
                # Where to record the provider job id the instant it exists, so
                # an interrupted attempt can be collected instead of re-billed.
                "handle_path": str(_handle_metadata_path(root, job_id, run_id)),
```

</details>

**依据 4 · 源码核查**：[packages/knowledge/drama/skills/short-drama-produce/scripts/production_tool.py:1321-1328](https://github.com/zenstory-ai/oh-story-dsh/blob/bc836dc0d2106aab2bf1179f0bc0eedc575635ab/packages/knowledge/drama/skills/short-drama-produce/scripts/production_tool.py#L1321-L1328)

已有输入哈希新鲜度检查。

```text
def _inputs_current(root: Path, job: Mapping[str, Any]) -> bool:
    inputs = job.get("inputs")
    if not isinstance(inputs, Mapping):
        return False
    try:
        return all(_hash_project_file(root, str(path)) == digest for path, digest in inputs.items())
    except (FileNotFoundError, OSError, ValueError):
        return False
```

#### 缺口

- 未穷尽全部现有收据展示，也没有对照试验。
  **影响**：新方向可能与已有能力重叠，收益不能预先成立。
  **进一步探讨**：先盘点等价入口，再只对实际状态理解缺口做对照并记录错误决策与新增维护负担。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
