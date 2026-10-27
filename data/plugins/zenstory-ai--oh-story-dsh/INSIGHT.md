# Oh Story DSH

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[41ed015](https://github.com/zenstory-ai/oh-story-dsh/tree/41ed01576febb280ada4742ac3d7f780ff4612ed)

<!-- BEGIN META -->
[![GitHub ★ 615](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=615&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zenstory-ai/oh-story-dsh)
<!-- END META -->

> **功能**：在 DSH 中提供小说、短剧、游戏改编与视频解说的创作 Skills 和文件工作台

> **亮点**：[Q01](#research-q01) 将上游Skills的脚本资源与DSH原生服务接通；[Q02](#research-q02) 用版本条件写和冲突选择连接人工编辑与Agent写入。贡献在适配和交互，创作方法及模型运行分别归上游与DSH。

> **主要限制**：[Q03](#research-q03) 的生产工具只产生界面意图，不生成媒体也不算确认；本轮未审全付费适配器，不能把任务板状态或提示词当作计费安全保证。

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
  - [Q01 · 比复制上游 Skill 到聊天客户端多做了什么？](#detail-section-11)
  - [Q02 · 文件编辑如何避免覆盖用户与 Agent 的并发修改？](#detail-section-12)
  - [Q03 · 生产工具显示任务是否意味着媒体已生成或已获确认？](#detail-section-13)
  - [Q04 · 首次与持续创作的依赖和成本是什么，适合谁试用？](#detail-section-14)
  - [Q05 · 编辑冲突能否推广为跨阶段内容新鲜度验收？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有DSH和文件创作习惯的作者，可在同一会话编辑项目、调用上游创作Skill并查看工作台投影。

上游创作Skills加外部文本编辑器与独立预览；比较同一项目的改稿、冲突恢复和终稿，不把工作台数量当效果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 创作Skill适配 | 在DSH调用随包上游内容 | 创作方法归上游，需模型与相应工具 |
| 条件编辑 | 人工与Agent改稿冲突处理 | 依赖宿主版本写入语义 |
| 生产投影 | 显示任务与镜头等界面意图 | 不生成媒体，也不代表付费确认 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node24与匹配DSH版本 | 必需 | 加载Skill与工作台 | 安装启动同版本，不强行放行 |
| 模型Provider | AI创作必需 | 生成与改稿 | 只浏览既有项目或回外部编辑器 |
| Python与ffmpeg | 视频生产才需 | 上游脚本与媒体处理 | 不模拟结果，不将未执行写为通过 |
| 媒体供应商Key与明确任务确认 | 付费生产才需 | 图片视频音频生成 | 本轮未审全链，不纳入文本试用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 作者保留项目副本并匹配DSH | 原文件与上游Skill可回退 |
| 改稿 | 作者编辑一段，Agent修改相同文件 | 本地输入保留，版本冲突可选择 |
| 保存 | 编辑器提交baseVersion | 过期版本拒绝，不能静默覆盖 |
| 验收 | 作者核对正文与磁盘并退出 | 无丢稿后再扩大范围 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 模型和本地运行资源，金额未知 | 匹配DSH、载入已有项目 | 无安装验收 |
| 持续使用 | 改稿模型调用，媒体另计 | 正文审核、冲突选择和适配维护 | 无实际返修率和耗时 |
| 失败恢复 | 可能重跑模型与媒体，费用未知 | 原文件核对、版本选择，已提交媒体先查句柄 | UI成功不等于生成成功 |
| 退出 | 保留项目文件 | 关闭工作台回外部编辑器 | 不依赖第二项目数据库 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| Skill接入 | 保留随包资源目录与DSH调用 | 所有上游任务运行效果 |
| 文本协作 | 条件保存和412冲突路径 | 匹配宿主真实丢稿防护 |
| 媒体工作台 | 任务意图投影 | 付费确认全链和最终质量 |

> **思考**：[Q03](#research-q03) 的生产工具只产生界面意图，不生成媒体也不算确认；本轮未审全付费适配器，不能把任务板状态或提示词当作计费安全保证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将上游Skills的脚本资源与DSH原生服务接通；[Q02](#research-q02) 用版本条件写和冲突选择连接人工编辑与Agent写入。贡献在适配和交互，创作方法及模型运行分别归上游与DSH。

[Q02](#research-q02) UI与服务端共同保留版本，避免仅凭前端dirty标记承诺不丢稿；底层原子条件写仍由宿主提供。[Q03](#research-q03)明确区分任务板投影与付费确认，边界值得借鉴，但提示词不等于全部执行保障。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的生产工具只产生界面意图，不生成媒体也不算确认；本轮未审全付费适配器，不能把任务板状态或提示词当作计费安全保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用已有文本项目试用一次改稿和冲突恢复；不将未核查付费媒体链纳入推荐。草稿覆盖或宿主不匹配即回外部编辑器与上游Skill。

最小验证在一集小样上分别修改角色设定、镜头顺序和无关注释，比较当前项目协议与摘要依赖视图的漏报、误报和人工追查时间。它必须复用上游已有新鲜度协议，不能先宣称生态没有同类机制；若已存在相同能力、依赖噪声让作者频繁重生成，或新增状态难以与文件一致，就否定独立插件方向。当前仅是从已查编辑协议推导的研究假设。 依据见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

Skill资源适配、版本条件保存和界面生产意图有源码支持；创作质量、所有媒体生产与宿主运行未验证。跨阶段收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/dsh-plugin/src/index.ts、packages/dsh-plugin/src/skill-provider.ts、packages/dsh-plugin/src/workspace-route.ts、packages/dsh-plugin/src/client/index.tsx、packages/dsh-plugin/src/production-tool.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定41ed01576febb280ada4742ac3d7f780ff4612ed，检查上游归属、provider、工作区文本读写、客户端保存和生产工具投影；不覆盖所有媒体Python脚本、角色及游戏预览内部。
- 下一步：仅源码核查，未安装、运行目标代码、生成媒体或执行其测试。真实创作质量和宿主版本兼容未独立验证。

**分析版本**

- **仓库**：[zenstory-ai/oh-story-dsh](https://github.com/zenstory-ai/oh-story-dsh)
- **版本号**：0.1.18（[固定提交 41ed015](https://github.com/zenstory-ai/oh-story-dsh/tree/41ed01576febb280ada4742ac3d7f780ff4612ed)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可以提出未验证的文件版本收据。把当前编辑器baseVersion思想推广到剧本、分镜、提示词和最终媒体，产物保存来源文件摘要；源文件改变时先展示哪些后续产物基于旧输入，而不直接再次调用付费生成。这比单看任务板“有文件”更能区分当前可用与过时结果，且保留文件为事实、不引入平行数据库。

最小验证在一集小样上分别修改角色设定、镜头顺序和无关注释，比较当前项目协议与摘要依赖视图的漏报、误报和人工追查时间。它必须复用上游已有新鲜度协议，不能先宣称生态没有同类机制；若已存在相同能力、依赖噪声让作者频繁重生成，或新增状态难以与文件一致，就否定独立插件方向。当前仅是从已查编辑协议推导的研究假设。 依据见 [Q05](#research-q05)。

仅源码核查，未安装、运行目标代码、生成媒体或执行其测试。真实创作质量和宿主版本兼容未独立验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 564 | 64860 | — | — | 1124777 |
| .js | source | 34 | 17913 | 14093 | 2137 | — |
| .ts | source | 48 | 8670 | 7499 | 630 | — |
| .tsx | source | 15 | 3907 | 3564 | 175 | — |
| .ts | test | 21 | 3438 | 3084 | 82 | — |
| .tsx | test | 4 | 213 | 196 | 3 | — |
| .mjs | source | 3 | 1143 | 970 | 109 | — |
| .md | example | 1 | 16 | — | — | 218 |
| .mjs | test | 2 | 496 | 467 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/zenstory-ai/oh-story-dsh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=13&color=737b86&logo=github)](https://github.com/zenstory-ai/oh-story-dsh/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/zenstory-ai/oh-story-dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有创作Skills如何在DSH形成文件事实的工作台，原生适配和付费生产边界在哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 比复制上游 Skill 到聊天客户端多做了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户是已用文件组织小说、短剧、游戏改编或视频项目的创作者，合格结果是可编辑且可回到原文件追溯的项目，而不是聊天里一段建议。原办法可以直接使用上游 Skills 加编辑器。Oh Story DSH 将四组内容通过 DSH skills.registerProvider 注册，并接入原生角色、工具与工作区路由；Skill provider 从随包目录读取 SKILL.md、验证名称并保持 resourceBase，避免只搬一段提示却丢掉脚本和参考相对路径。

贡献归属于宿主适配和创作文件工作台。小说/短剧/游戏/视频方法来自 README 指明的上游，模型、会话、审批来自 DSH；不能把整套上游内容和宿主运行时算作本插件原创。文件成为单一事实有利于人工参与，但是否比外部编辑器省时取决于创作者是否反复在聊天、文件和预览间切换。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:34-43](https://github.com/zenstory-ai/oh-story-dsh/blob/41ed01576febb280ada4742ac3d7f780ff4612ed/README.md#L34-L43)

作者明列上游内容与本插件范围。

<details>
<summary>查看原文（10行）</summary>

```text
`oh-story-dsh` 是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）的社区插件，与 DeepSeek 无隶属关系。装上它，DSH Web 里多出四个创作工作台：小说、短剧、游戏、视频解说。Agent、会话、模型、权限审批和 Chat 仍然全是 DSH 原生的，插件只添加创作 Skills、专业 Roles、项目文件协议和工作台界面，不带第二套 Agent 运行时或项目数据库。

以下清单对应当前源码；已发布安装包的上游提交固定在该版本的 manifest 中，未发布更新见 [Unreleased](CHANGELOG.md#unreleased)。

| 工作台 | 上游能力（固定版本，随插件打包） | 主要入口 |
| --- | --- | --- |
| 小说 | [Oh Story 0.9.0](https://github.com/zenstory-ai/oh-story-claudecode/releases/tag/v0.9.0) · 13 Skills · 7 Roles | `/story`、`/story-long-write`、`/story-review` |
| 短剧 | [Drama Skills 0.9.0](https://github.com/zenstory-ai/drama-skills/releases/tag/v0.9.0) · 11 Skills | `/short-drama`、`/short-drama-write`、`/short-drama-storyboard`、`/short-drama-edit` |
| 游戏 | [NovelToGame 0.6.0](https://github.com/zenstory-ai/novel-to-game) · 7 Skills · 《金瓶梅》ADV 可玩示例（18+） | `/novel-to-game quick`、`/game-build`、`/game-qa` |
| 视频 | [video-recap-skills 0.6.2](https://github.com/zenstory-ai/video-recap-skills/releases/tag/v0.6.2) · 7 Skills（3 个用户入口） | `/video-recap`、`/video-script`、`/video-reference` |
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/src/index.ts:40-55](https://github.com/zenstory-ai/oh-story-dsh/blob/41ed01576febb280ada4742ac3d7f780ff4612ed/packages/dsh-plugin/src/index.ts#L40-L55)

四组provider、角色、生产工具和工作区路由有真实注册。

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

**依据 3 · 源码核查**：[packages/dsh-plugin/src/skill-provider.ts:315-364](https://github.com/zenstory-ai/oh-story-dsh/blob/41ed01576febb280ada4742ac3d7f780ff4612ed/packages/dsh-plugin/src/skill-provider.ts#L315-L364)

动态列Skill并保留资源目录，读取时验证名称与路径。

<details>
<summary>查看原文（50行）</summary>

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
      }));
    },
    async get(candidate): Promise<SkillDefinition | undefined> {
      if (candidate.provider !== providerName || typeof candidate.path !== "string") return undefined;
      const path = resolve(candidate.path);
      const relativePath = relative(root, path);
      if (relativePath === "" || relativePath.startsWith("..") || isAbsolute(relativePath)) {
        throw new Error("Bundled skill locator escaped the packaged skill root.");
      }
      const parsed = parseBundledSkill(await readFile(path, "utf8"));
      if (parsed.name !== candidate.name) return undefined;
      return {
        name: parsed.name,
        description: parsed.description,
        invocation: { modelInvocable: true, userInvocable: parsed.userInvocable },
        provider: providerName,
        source: "bundled",
        resourceBase: { kind: "directory", path: join(root, parsed.name) },
        path,
        content: content(parsed.name, parsed.content)
      };
    }
```

</details>

#### 缺口

- 未取得创作者同任务使用上游Skill加编辑器的实际对照。
  **影响**：可确认适配机制，不能宣布写作质量或节时提高。
  **进一步探讨**：对同一章或一集收集修改、文件查找和预览切换步骤以及终稿返修。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件编辑如何避免覆盖用户与 Agent 的并发修改？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

编辑器提交当前缓冲区内容及读取时的baseVersion。服务端要求有效baseVersion，并调用宿主fs.writeText的replaceIfVersion，再按当前Session解析sandboxPolicy；不是直接覆盖磁盘文件。客户端处理412时再读当前文件，将用户缓冲区保留并附冲突信息，让创作者选择。正常保存返回后，若用户在请求期间又编辑了内容，客户端保留最新本地输入，只更新已保存版本。

这比轮询后无条件替换有实质可靠性增量，也说明“文件事实”必须与版本协议一起成立。原子比较写入能力由DSH文件服务实现，本插件负责任务接线与冲突交互，不能把宿主接口本身算原创。本轮没有继续审查宿主fs实现，所以结论是使用了条件写协议，而非独立证明所有文件系统下竞争绝不丢稿。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/src/workspace-route.ts:796-818](https://github.com/zenstory-ai/oh-story-dsh/blob/41ed01576febb280ada4742ac3d7f780ff4612ed/packages/dsh-plugin/src/workspace-route.ts#L796-L818)

路由强制版本并将条件写和sandboxPolicy传给宿主。

<details>
<summary>查看原文（23行）</summary>

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
      return;
    }
    send(response, 404, { error: "Oh Story route not found." });
  } catch (error) {
    const mapped = error instanceof WorkspaceHttpError ? error : mapFsError(error);
    if (mapped === undefined) context.logger("oh-story").error("workspace route failed", error);
    send(response, mapped?.status ?? 500, { error: mapped?.message ?? "Oh Story workspace operation failed." });
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/src/client/index.tsx:1292-1341](https://github.com/zenstory-ai/oh-story-dsh/blob/41ed01576febb280ada4742ac3d7f780ff4612ed/packages/dsh-plugin/src/client/index.tsx#L1292-L1341)

客户端提交版本、保留请求期间新输入并处理412冲突。

<details>
<summary>查看原文（50行）</summary>

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
      });
      reload();
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
            };
```

</details>

#### 缺口

- DSH实际文件服务在相应宿主版本的比较写入语义未独立验证。
  **影响**：不能声称跨所有文件系统绝不丢稿。
  **进一步探讨**：在匹配宿主中让Agent与未保存的人工作文同时改同一文件，检查412、缓冲区和最终磁盘内容。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 生产工具显示任务是否意味着媒体已生成或已获确认？

**研究主题**：缺陷与关键质疑

#### 完整回答

不是。oh_story_production 的execute只验证界面意图并返回动作、集数和消息；工具描述明确它不生成媒体、不改创作文件、也不算付费任务确认。任务板状态因此是投影或追踪入口，不是供应商已完成的结果证明。若只读“已发送到工作台”的成功文案，容易把界面动作误认为生产完成。

Skill适配说明要求精确任务预览后创作者确认，再执行上游adapter，已提交但中断的供应商任务应collect回收而非再次收费提交。这是有价值的流程约束，但本轮没有沿全部Python生产适配器检验确认绑定、任务句柄与计费恢复，所以不能将提示词要求当作不可绕过的硬门禁。涉及真实付费生产应另做当前任务的端到端核查。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/src/production-tool.ts:19-49](https://github.com/zenstory-ai/oh-story-dsh/blob/41ed01576febb280ada4742ac3d7f780ff4612ed/packages/dsh-plugin/src/production-tool.ts#L19-L49)

生产工具明确投影语义，execute只验证并返回消息。

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

**依据 2 · 源码核查**：[packages/dsh-plugin/src/skill-provider.ts:63-70](https://github.com/zenstory-ai/oh-story-dsh/blob/41ed01576febb280ada4742ac3d7f780ff4612ed/packages/dsh-plugin/src/skill-provider.ts#L63-L70)

适配层文本保留当前任务确认和已提交任务回收说明。

```text
  "Use only tools visible in the current DSH preset and preserve the upstream project ownership, freshness, review, and explicit production-confirmation contracts.",
  "Use oh_story_production only for semantic production-view intents (open/focus, explicit shot order, or tracking a job that this Agent is actually executing). Cosmetic canvas layout remains creator-controlled. The tool changes only the Session projection: it does not edit creator documents, generate media, or authorize production.",
  "Production credentials remain outside project files. Never treat a prior acceptance, preview, continuation request, or budget discussion as confirmation for a paid production run.",
  "</short-drama-dsh-integration>"
].join("\n");
const DSH_DRAMA_OVERRIDES: Readonly<Partial<Record<string, string | ((skillRoot: string) => string)>>> = {
  "short-drama": "A dashboard request means focus or use the native 短剧 tab in this DSH Session. Do not run the bundled standalone Dashboard script. New projects follow only the v0.6 creator-first contract and create only documents required by the current request.",
  "short-drama-produce": (skillRoot) => `Use an upstream adapter only after the creator explicitly confirms the exact current job. Its source must be the current creator-first Markdown and its output belongs under 剧集/<EP>/制作成果/. DSH permissions and approval UI remain authoritative. When oh_story_production is visible, register a previewed image or video job with track_job after the confirmation is valid and before run — never at prepare time — passing the same job ID, target, modality and count the creator just approved. track_job's jobKind is image, video or composition (the assembled cut), so from this Skill it registers image and video jobs only: speech (tts) and music jobs pass through the same prepare → explicit creator confirmation → run gate but are never registered with track_job or relabelled as another kind, and their audio results stay under 剧集/<EP>/制作成果/. Optional voice references belong on the MOTION entry's separate 参考音频 line, never in 输入参考图 or the workbench image picker. Compile them as reference_audio bindings, preserve character exactly from 角色, and match the project-local audio path to that character's single 声音参考 in 视觉设定.md. 不得控制 lists 台词、语气、情绪 individually. The selected adapter profile must explicitly declare reference_audio in reference_roles; otherwise reject before paid submission, never drop or substitute the binding. The generated generic adapter profiles intentionally omit reference_audio because their model IDs are environment-selected; use a creator-owned OH_STORY_DRAMA_ADAPTER_CONFIG profile that declares audio support only for a known reference-audio-capable model. DeepSeek generates no media: every image, video, speech, or music result comes from a provider adapter. The bundled adapters are ${dramaAdapterSummary()}; they are registered for this DSH host in ${dramaAdapterConfigPath(skillRoot).path} — pass that file as --adapter-config unless the creator names another config (${DRAMA_ADAPTER_CONFIG_ENV}). Credentials are read only from the DSH host process environment. Before preparing a paid job, name the adapter that will run it; if its variables are missing, tell the creator exactly which ones to export before starting DSH instead of failing inside run. Never read, print, or write credential values. A submitted video job is already billed, so an interrupted run is recovered, not resubmitted: when audit reports orphaned_provider_job, recover it with collect, passing --job-id — the drama job the finding names, not its provider_job_id, which collect reads from the run handle itself. collect spends nothing and does not need the confirmation gate — the gate exists to stop unintended spending — but re-running the same job does, and would charge the creator twice.`,
```

#### 缺口

- 上游生产脚本的确认摘要、provider句柄持久化与恢复链未全面核查。
  **影响**：不能承诺所有付费调用均严格绑定确认或不会重复收费。
  **进一步探讨**：只对实际选定的一个供应商跟踪prepare、确认、run、句柄保存和collect，再在隔离非付费夹具中检查任务变更和中断。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次与持续创作的依赖和成本是什么，适合谁试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

普通文件创作需要Node24、匹配DSH版本和模型；README明确安装与启动要用同一DSH，仍需模型Provider。视频与媒体生产另依赖Python、ffmpeg及具体供应商凭据。根workspace private，实际发布包@oh-story/dsh，不能把仓库根当作所有打包字节已验证。

建议已有DSH且有文件创作习惯的作者先用一个小说章节或已有项目做有限试用。以同一段文本修改、一次Agent并发写入和冲突恢复为验收单位，比较外部编辑器加Skill是否已足够。没有输出质量、返修率、人工时间及模型账单，不推测节省金额。若本地草稿被覆盖、版本不匹配或角色调用不可用，停止并回到原编辑器和上游Skill；暂不把未审查的付费媒体生产纳入这条试用建议。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:83-111](https://github.com/zenstory-ai/oh-story-dsh/blob/41ed01576febb280ada4742ac3d7f780ff4612ed/README.md#L83-L111)

Node、DSH版本及模型和视频依赖说明。

<details>
<summary>查看原文（29行）</summary>

````text
## 安装

需要 Node.js 24+。安装命令会临时提供 pnpm，只装了 Node.js 的机器也能执行：

```bash
npx -y --package pnpm@11.7.0 --package @deepseek-ai/dsh@0.2.1-rc.2 dsh plugin --profile web add @oh-story/dsh@0.1.18 &&
npx -y @deepseek-ai/dsh@0.2.1-rc.2 web
```

保持终端运行，浏览器默认自动打开；没有自动打开就复制终端打印的完整 `http://127.0.0.1:3080/?token=...` 链接访问，首次认证需要链接里的 token。关闭终端会停止服务。安装与启动请使用同一个 dsh 版本。本页默认命令固定使用 npm `latest` 的 `0.2.1-rc.2`；本插件接受 `>=0.2.0-rc.2 <0.2.1-0` 与 `>=0.2.1-alpha.1 <0.2.2-0`。仍在用 `0.2.0-rc.2` 时，安装与启动两条命令都要换成 `@deepseek-ai/dsh@0.2.0-rc.2`；不要把两个宿主版本混用。DSH 会在安装与加载时检查版本，不匹配时给出明确提示（`dsh plugin allow-version` 可自担风险放行）。

开始 AI 创作前，在 DSH 的「设置 → 模型」中添加 Provider 并填入 API Key，或在启动前设置环境变量 `DEEPSEEK_API_KEY`。只查看已有作品可在首次引导中选择「稍后配置 / Configure later」。

<details>
<summary>从 GitHub Release 安装预构建包</summary>

GitHub Release 中的预构建包经过同一套测试：

```bash
npx -y --package pnpm@11.7.0 --package @deepseek-ai/dsh@0.2.1-rc.2 dsh plugin --profile web add https://github.com/zenstory-ai/oh-story-dsh/releases/download/v0.1.18/oh-story-dsh-0.1.18.tgz &&
npx -y @deepseek-ai/dsh@0.2.1-rc.2 web
```

</details>

<details>
<summary>视频工作台的宿主机依赖</summary>

视频流水线还需要宿主机安装 Python 3.10+ 与 ffmpeg/ffprobe（Debian/Ubuntu `sudo apt install ffmpeg`）。带 libass `subtitles` 滤镜时会烧录字幕；未提供该滤镜的构建交付外部 SRT，也可另装带 libass 的构建。视频解说另用 `MIMO_API_KEY`（Fish Audio TTS 另需 `FISH_API_KEY`）。Key 与 `PATH` 在启动 DSH 的终端里设置，重启 DSH 后生效。
````

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/src/workspace-route.ts:796-818](https://github.com/zenstory-ai/oh-story-dsh/blob/41ed01576febb280ada4742ac3d7f780ff4612ed/packages/dsh-plugin/src/workspace-route.ts#L796-L818)

文本试用有可核对的条件保存边界。

<details>
<summary>查看原文（23行）</summary>

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
      return;
    }
    send(response, 404, { error: "Oh Story route not found." });
  } catch (error) {
    const mapped = error instanceof WorkspaceHttpError ? error : mapFsError(error);
    if (mapped === undefined) context.logger("oh-story").error("workspace route failed", error);
    send(response, mapped?.status ?? 500, { error: mapped?.message ?? "Oh Story workspace operation failed." });
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin/src/index.ts:44-55](https://github.com/zenstory-ai/oh-story-dsh/blob/41ed01576febb280ada4742ac3d7f780ff4612ed/packages/dsh-plugin/src/index.ts#L44-L55)

宿主服务注册和Python适配配置范围。

<details>
<summary>查看原文（12行）</summary>

```text
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

#### 缺口

- 无同版宿主安装及真实创作任务结果。
  **影响**：源码支持有限试用路径，不足持续安装或所有工作台统一推荐。
  **进一步探讨**：固定现有文本项目，记录一次完整编辑、Agent改稿、冲突选择和退出，按终稿正确性与恢复负担验收。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 编辑冲突能否推广为跨阶段内容新鲜度验收？

**研究主题**：新假设与验证

#### 完整回答

可以提出未验证的文件版本收据。把当前编辑器baseVersion思想推广到剧本、分镜、提示词和最终媒体，产物保存来源文件摘要；源文件改变时先展示哪些后续产物基于旧输入，而不直接再次调用付费生成。这比单看任务板“有文件”更能区分当前可用与过时结果，且保留文件为事实、不引入平行数据库。

最小验证在一集小样上分别修改角色设定、镜头顺序和无关注释，比较当前项目协议与摘要依赖视图的漏报、误报和人工追查时间。它必须复用上游已有新鲜度协议，不能先宣称生态没有同类机制；若已存在相同能力、依赖噪声让作者频繁重生成，或新增状态难以与文件一致，就否定独立插件方向。当前仅是从已查编辑协议推导的研究假设。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/src/workspace-route.ts:796-811](https://github.com/zenstory-ai/oh-story-dsh/blob/41ed01576febb280ada4742ac3d7f780ff4612ed/packages/dsh-plugin/src/workspace-route.ts#L796-L811)

版本绑定是可借鉴的具体机制。

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

**依据 2 · 源码核查**：[packages/dsh-plugin/src/production-tool.ts:22-32](https://github.com/zenstory-ai/oh-story-dsh/blob/41ed01576febb280ada4742ac3d7f780ff4612ed/packages/dsh-plugin/src/production-tool.ts#L22-L32)

界面任务投影不等于生成和确认，说明跨阶段收据不能只取界面状态。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

#### 缺口

- 上游全流程已有新鲜度协议的具体覆盖与创作者痛点频率未核对。
  **影响**：不能将设想当作尚未满足的市场或原创实现。
  **进一步探讨**：先查选定上游协议，再请真实作者用同一集定位过期产物，已有方案足够则停止扩展。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
