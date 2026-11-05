# Jacky Creator

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[5018193](https://github.com/Jackywxsz/DSH-Creator/tree/50181934a2d14f3ff076faf0508456e4090701d8)

<!-- BEGIN META -->
[![GitHub ★ 125](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=125&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Jackywxsz/DSH-Creator) [![npm 30d 1,510](https://img.shields.io/static/v1?label=npm+30d&message=1%2C510&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/jacky-creator) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/jacky-creator)
<!-- END META -->

> **功能**：在 DSH 内管理本地内容项目和运营工作台，按需接入字幕、封面与发布能力。

> **亮点**：[Q01](#research-q01) 把目录结构和运营操作接到同一 DSH 工作流。

> **主要限制**：[Q02](#research-q02) 配置确认和图片预览都需要额外验证宿主权限边界。

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
  - [Q01 · 内容创作者获得什么工作流？](#detail-section-11)
  - [Q02 · 预览和确认的边界在哪里？](#detail-section-12)
  - [Q03 · 试用需要哪些资源？](#detail-section-13)
  - [Q04 · 如何限制文章预览文件读取？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望用 Agent 操作本地创作目录的个人创作者。

在文件管理器和多个制作工具之间人工管理选题、脚本和素材。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 创作项目 | 创建日期目录 | 需要配置内容根 |
| 图片预览 | 回环服务读图 | 权限和链接边界待测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH profile | 必需 | 注册工作台与工具 | 改用手工流程 |
| 独立内容目录 | 试用必需 | 隔离合成素材 | 暂停试用 |
| 可选本机与外部扩展 | 按需 | 制作和发布 | 保持禁用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 选测试 profile 及目录 | 保留原配置 |
| 建稿 | 预览配置并明确确认后新建合成项目 | 核对目录与状态 |
| 退出 | 关闭预览并禁用插件 | 保留目录备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 基础费用未知 | 准备测试目录和 profile | 未实测 |
| 扩展 | 依赖工具和服务费用未知 | 按项评估 | 先保持禁用 |
| 退出 | 恢复成本未知 | 保留文件和运营状态 | 验证禁用后的存留 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 本地建稿 | 创建工具与布局约定 | 产出速度 |
| 内容预览 | 回环静态图片服务 | 浏览器与根目录边界 |

> **思考**：[Q02](#research-q02) 配置确认和图片预览都需要额外验证宿主权限边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把目录结构和运营操作接到同一 DSH 工作流。

[Q02](#research-q02) 分开检查审批、预览来源及文件实际路径。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 配置确认和图片预览都需要额外验证宿主权限边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 无真实素材和外部凭据试跑。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码与作者文档核对，未执行。

- 已检查：作者 README、包清单、源码路径 README.md、src/articleServe.ts、src/index.ts、src/tools.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：宿主入口、创作工具与图片预览代表源码。
- 下一步：核对配置预览及提交、目录写入和根外图片拒绝。

**分析版本**

- **仓库**：[Jackywxsz/DSH-Creator](https://github.com/Jackywxsz/DSH-Creator)
- **版本号**：0.1.0-beta.9（[固定提交 5018193](https://github.com/Jackywxsz/DSH-Creator/tree/50181934a2d14f3ff076faf0508456e4090701d8)）
- **版本日期**：2026-10-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 预览按实际路径和短期权限约束可阻止越界读取。

核对配置预览及提交、目录写入和根外图片拒绝。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 20 | 1760 | — | — | 28761 |
| .mjs | source | 5 | 1158 | 1069 | 23 | — |
| .ts | source | 81 | 11505 | 10586 | 95 | — |
| .tsx | source | 25 | 5913 | 5606 | 3 | — |
| .ts | test | 57 | 6227 | 5639 | 49 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Jackywxsz/DSH-Creator/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：如何在 DSH 管理本地内容与制作扩展？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 内容创作者获得什么工作流？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

已有本地内容目录的创作者可在 DSH 用工具建立日期项目，并在同一工作台处理选题、产物和运营状态。入口通过 Cordis 注入设置、工具、系统提示和 Skill。相比手动约定文件名和分散操作，这套工具让本地目录可成为 Agent 工作流输入。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:16-32](https://github.com/Jackywxsz/DSH-Creator/blob/50181934a2d14f3ff076faf0508456e4090701d8/src/index.ts#L16-L32)

宿主注入入口

<details>
<summary>查看原文（17行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  migrateLegacyDefaultState(config);
  const service = new OilCreatorService(ctx, config);
  const cockpit = new CreatorCockpitService(ctx, resolveCockpitDataDir(config), service);
  ctx.inject(["settings"], (settingsCtx) => {
    settingsCtx.effect(() => registerCreatorSettingsNamespace(settingsCtx.settings));
  });
  ctx.inject(["tools"], (toolsCtx) => {
    registerCreatorTools(toolsCtx as never, service);
    registerCockpitTools(toolsCtx as never, cockpit);
  });
  ctx.inject(["systemPrompt"], (promptCtx) => {
    registerLibraryPrompt(promptCtx as never, service);
  });
  ctx.inject(["skills"], (skillsCtx) => {
    registerCreatorWorkbenchSkill(skillsCtx as never);
  });
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:120-141](https://github.com/Jackywxsz/DSH-Creator/blob/50181934a2d14f3ff076faf0508456e4090701d8/src/tools.ts#L120-L141)

创建内容目录工具接线

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.tools.register(defineTool({
    name: "jacky_creator_create_content",
    description:
      "Create an empty dated library folder named YYYY-MM-DD_title using today's date and a readable title.",
    parameters: {
      title: { type: "string", required: true, description: "Episode title. Hyphens become spaces." },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string", required: true },
          folderPath: { type: "string", required: true },
        },
      },
      render: (_args, value) => compactText("Created", value.id),
    },
    presentCall: (args) => present("Create content", args),
    execute: (args, exec) => {
      if (args.title.trim() === "") throw new Error("title is required");
      return service.createContent({ title: args.title }, signalOf(exec));
```

</details>

**依据 3 · 作者声明**：[README.md:103-127](https://github.com/Jackywxsz/DSH-Creator/blob/50181934a2d14f3ff076faf0508456e4090701d8/README.md#L103-L127)

本地布局与核心、可选能力

<details>
<summary>查看原文（25行）</summary>

````text
## 本地文件

```text
内容目录/
└── YYYY-MM-DD_内容标题/
    ├── topic.md
    ├── script.md
    ├── 内容标题.mp4
    ├── 内容标题.srt
    ├── 内容标题_16x9.png
    └── 公众号文章/
```

正文和产物保存在你选择的内容目录。Jacky Creator 只在本机保存工作台设置、运营状态和发布记录，不会把正文搬进封闭数据库。

## 核心能力

不安装额外 Skill，也可以使用内容库、运营工作台、灵感库和脚本规则。字幕、封面、演示动画、Screen Studio 和多平台发布属于可选扩展，缺少时不会影响核心工作台。

| 能力 | 说明 |
| --- | --- |
| 内容工作流 | 管理选题、脚本、制作资产和发布状态 |
| 运营工作台 | 管理档期、目标、复盘和内容推进 |
| 灵感库 | 记录想法并推进为真实内容项目 |
| 可选制作能力 | 字幕、封面、演示动画和多平台发布 |
````

</details>

#### 缺口

- 未运行项目创建和内容索引
  **影响**：实际目录行为和节省时间未知
  **进一步探讨**：用合成选题创建后检查目录及可读性

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 预览和确认的边界在哪里？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

配置工具以调用参数 apply=true 提交，工具描述要求用户确认，宿主是否强制执行这项确认待验证。文章图片服务监听回环并检查扩展名及词法路径前缀，允许跨源且这段服务无请求令牌；stat 和读取跟随符号链接。若可在预览根创建图片后缀符号链接，词法检查可能允许返回根外图片。需同时验证调用环境能否访问回环、预览根写入者及宿主确认。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:80-92](https://github.com/Jackywxsz/DSH-Creator/blob/50181934a2d14f3ff076faf0508456e4090701d8/src/tools.ts#L80-L92)

确认约束写在工具说明

<details>
<summary>查看原文（13行）</summary>

```text
  ctx.tools.register(defineTool({
    name: "jacky_creator_setup",
    description:
      "Inspect the creator workspace, optional local capabilities, credential status, and current configuration. "
      + "Omit fields for a read-only diagnosis. Proposed changes are previewed unless apply=true. "
      + "Only use apply=true after the user confirms the exact directory and enabled platform changes.",
    parameters: {
      apply: { type: "boolean", description: "False previews changes. True saves them after user confirmation." },
      libraryRoot: { type: "string", description: "Existing absolute content directory, or a path starting with ~/." },
      enabledPlatforms: {
        type: "array",
        items: { type: "string", enum: PUBLISH_PLATFORMS },
        description: "Complete list of enabled platforms. Empty disables all platforms.",
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:107-116](https://github.com/Jackywxsz/DSH-Creator/blob/50181934a2d14f3ff076faf0508456e4090701d8/src/tools.ts#L107-L116)

布尔参数直接透传

<details>
<summary>查看原文（10行）</summary>

```text
    presentCall: (args) => present("Creator setup", args),
    async execute(args, exec) {
      const request = {
        apply: args.apply === true,
        ...(typeof args.libraryRoot === "string" ? { libraryRoot: args.libraryRoot } : {}),
        ...(Array.isArray(args.enabledPlatforms)
          ? { enabledPlatforms: normalizeEnabledPlatforms(args.enabledPlatforms) }
          : {}),
      };
      return asJson(await service.configureCreator(request, signalOf(exec)));
```

</details>

**依据 3 · 源码核查**：[src/articleServe.ts:17-51](https://github.com/Jackywxsz/DSH-Creator/blob/50181934a2d14f3ff076faf0508456e4090701d8/src/articleServe.ts#L17-L51)

词法检查与跨源响应

<details>
<summary>查看原文（35行）</summary>

```text
export function resolveArticleFile(root: string, urlPath: string): string | undefined {
  let rel = urlPath.split("?")[0] ?? "";
  try {
    rel = decodeURIComponent(rel);
  } catch {
    return undefined;
  }
  rel = rel.replace(/^\/+/, "");
  if (rel === "" || rel.includes("\0")) return undefined;
  const base = resolve(root);
  const candidate = resolve(base, rel);
  if (candidate !== base && !candidate.startsWith(base + sep)) return undefined;
  const mime = IMAGE_MIME[extname(candidate).toLowerCase()];
  if (mime === undefined) return undefined;
  return candidate;
}

export async function startArticleServer(root: string): Promise<{
  origin: string;
  close: () => void;
}> {
  const port = await findFreePort(9000, 9099);
  const server = createServer((request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405);
      response.end();
      return;
    }
    const file = resolveArticleFile(root, request.url ?? "/");
```

</details>

**依据 4 · 源码核查**：[src/articleServe.ts:57-85](https://github.com/Jackywxsz/DSH-Creator/blob/50181934a2d14f3ff076faf0508456e4090701d8/src/articleServe.ts#L57-L85)

直接 stat 读取及回环绑定

<details>
<summary>查看原文（29行）</summary>

```text
    void stat(file).then((info) => {
      if (!info.isFile()) {
        response.writeHead(404);
        response.end();
        return;
      }
      const mime = IMAGE_MIME[extname(file).toLowerCase()] ?? "application/octet-stream";
      response.writeHead(200, {
        "Content-Type": mime,
        "Content-Length": info.size,
        "Cache-Control": "private, max-age=3600",
      });
      if (request.method === "HEAD") {
        response.end();
        return;
      }
      createReadStream(file).pipe(response);
    }, () => {
      response.writeHead(404);
      response.end();
    });
  });
  await new Promise<void>((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => { resolveListen(); });
  });
  server.unref();
  return {
    origin: `http://127.0.0.1:${port}`,
```

</details>

#### 缺口

- 未验证真实宿主工具审批、浏览器回环策略和符号链接可利用条件
  **影响**：不能据此认定公开暴露或已发生读取
  **进一步探讨**：用合成图片、符号链接和不同来源验证访问并观察审批

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 试用需要哪些资源？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

把插件装入实际启用的 DSH profile，只用新建的内容目录测试配置预览、确认和建稿。基础工作台按作者说明不依赖额外 Skill，字幕、封面和发布需按使用功能核对本机工具、外部账户与费用。退出前关闭预览并保存内容目录及状态备份，再在对应 profile 禁用插件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:93-101](https://github.com/Jackywxsz/DSH-Creator/blob/50181934a2d14f3ff076faf0508456e4090701d8/README.md#L93-L101)

首启预览和保存流程

```text
### 3. 完成首次配置

新建会话，选择标准模式，然后发送：

> 帮我配置 Jacky Creator：选择本地内容目录，先预览准备修改的设置，确认后再保存。

配置完成后，直接告诉 AI 想做的内容主题，就可以新建项目、整理选题并生成脚本初稿。

完整步骤见 [安装与首次使用](docs/installation.md)。
```

**依据 2 · 作者声明**：[README.md:118-137](https://github.com/Jackywxsz/DSH-Creator/blob/50181934a2d14f3ff076faf0508456e4090701d8/README.md#L118-L137)

核心能力和外部服务说明

<details>
<summary>查看原文（20行）</summary>

```text
## 核心能力

不安装额外 Skill，也可以使用内容库、运营工作台、灵感库和脚本规则。字幕、封面、演示动画、Screen Studio 和多平台发布属于可选扩展，缺少时不会影响核心工作台。

| 能力 | 说明 |
| --- | --- |
| 内容工作流 | 管理选题、脚本、制作资产和发布状态 |
| 运营工作台 | 管理档期、目标、复盘和内容推进 |
| 灵感库 | 记录想法并推进为真实内容项目 |
| 可选制作能力 | 字幕、封面、演示动画和多平台发布 |

详细能力和依赖见 [使用说明](docs/usage.md)。

## 数据与权限

- 正文、视频、字幕、封面和文章留在用户选择的本地目录。
- API Key 由 DSH 凭据服务保存，界面只显示配置状态。
- 目录创建、批量重命名和配置保存会先预览，再等待确认。
- 外部服务只在用户主动启用对应能力时访问。
- 插件不会在卸载时删除内容目录。
```

</details>

**依据 3 · 作者声明**：[README.md:141-145](https://github.com/Jackywxsz/DSH-Creator/blob/50181934a2d14f3ff076faf0508456e4090701d8/README.md#L141-L145)

profile 区分

```text
## 常见问题

如果侧边栏没有出现 Jacky Creator：

1. 确认插件安装到正在使用的 Profile（官方桌面端为 `desktop`，CLI 为 `web`）。
```

#### 缺口

- 未试装可选扩展或确认卸载行为
  **影响**：现金与迁移时间未知
  **进一步探讨**：先在无真实素材、无外部凭据的 profile 走通本地流程

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何限制文章预览文件读取？

**研究主题**：新假设与验证

#### 完整回答

可对照现有词法限制，试验解析实际文件路径并核对真实根，另给预览窗口范围内的请求使用短期授权。正常图片、根外链接、错误令牌和已关闭预览做对照。若正常渲染明显退化或负例仍可读，则撤回或重做。

#### 证据与依据

**依据 1 · 源码核查**：[src/articleServe.ts:17-40](https://github.com/Jackywxsz/DSH-Creator/blob/50181934a2d14f3ff076faf0508456e4090701d8/src/articleServe.ts#L17-L40)

现有词法限制和 CORS

<details>
<summary>查看原文（24行）</summary>

```text
export function resolveArticleFile(root: string, urlPath: string): string | undefined {
  let rel = urlPath.split("?")[0] ?? "";
  try {
    rel = decodeURIComponent(rel);
  } catch {
    return undefined;
  }
  rel = rel.replace(/^\/+/, "");
  if (rel === "" || rel.includes("\0")) return undefined;
  const base = resolve(root);
  const candidate = resolve(base, rel);
  if (candidate !== base && !candidate.startsWith(base + sep)) return undefined;
  const mime = IMAGE_MIME[extname(candidate).toLowerCase()];
  if (mime === undefined) return undefined;
  return candidate;
}

export async function startArticleServer(root: string): Promise<{
  origin: string;
  close: () => void;
}> {
  const port = await findFreePort(9000, 9099);
  const server = createServer((request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
```

</details>

**依据 2 · 源码核查**：[src/articleServe.ts:57-87](https://github.com/Jackywxsz/DSH-Creator/blob/50181934a2d14f3ff076faf0508456e4090701d8/src/articleServe.ts#L57-L87)

文件读流与服务关闭

<details>
<summary>查看原文（31行）</summary>

```text
    void stat(file).then((info) => {
      if (!info.isFile()) {
        response.writeHead(404);
        response.end();
        return;
      }
      const mime = IMAGE_MIME[extname(file).toLowerCase()] ?? "application/octet-stream";
      response.writeHead(200, {
        "Content-Type": mime,
        "Content-Length": info.size,
        "Cache-Control": "private, max-age=3600",
      });
      if (request.method === "HEAD") {
        response.end();
        return;
      }
      createReadStream(file).pipe(response);
    }, () => {
      response.writeHead(404);
      response.end();
    });
  });
  await new Promise<void>((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => { resolveListen(); });
  });
  server.unref();
  return {
    origin: `http://127.0.0.1:${port}`,
    close: () => {
      server.close();
```

</details>

#### 缺口

- 真实预览传输及浏览器策略未知
  **影响**：令牌接入可能影响图片加载
  **进一步探讨**：用本地合成素材验证兼容和拒绝路径

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
