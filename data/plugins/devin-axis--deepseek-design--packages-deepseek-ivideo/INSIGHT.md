# DeepSeek iVideo

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[62ee529](https://github.com/Devin-AXIS/deepseek-design/tree/62ee529e84423ba63e823b23860293a43b6eb03b/packages/deepseek-ivideo)

<!-- BEGIN META -->
[![GitHub ★ 1,604](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C604&color=yellow&logo=github&style=flat)](https://github.com/Devin-AXIS/deepseek-design) [![npm 30d 994](https://img.shields.io/static/v1?label=npm+30d&message=994&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/deepseek-ivideo) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/deepseek-ivideo)
<!-- END META -->

> **实现功能**：在DSH中加入HyperFrames视频时间线，编辑本地项目、预览并提供受限自动校验。

> **核心亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将上游HyperFrames作为同会话本地视频工作流，增加预览资源归属与受限校验交接；编辑器引擎贡献归上游。

> **风险与缺陷**：[Q03](#research-q03) validate采用5样本并限40问题，退出码0不等于整段视频和业务内容验收；短时缺陷与最终导出仍需检查。

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
  - [Q01 · 会话视频编辑适合谁，什么算交付？](#detail-section-15)
  - [Q02 · 预览与校验怎样受会话和进程所有权约束？](#detail-section-16)
  - [Q03 · 采样校验能否代替整段验收，采用负担在哪？](#detail-section-17)
  - [Q04 · 时间覆盖表能否让采样质检更可靠？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：能人工验收短视频的用户，在对话与时间线间迭代产品演示和动态信息项目。

独立时间线编辑器与人工描述修改为简单替代；本轮不比较完整制作效率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 视频Studio | 编辑本地时间线项目 | 上游引擎，非语音克隆 |
| validate | 有限自动检查 | 5样本不代表全片 |
| 预览管理 | 合并启动与空闲回收 | 只清理自有进程 |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 退路 |
|---|---|---|
| Node/DSH与定制运行时 | 预览检查导出 | 核对包中匹配版本 |
| 已注册工作区 | 保存video/session | 保留项目备份 |
| 人工全片与许可核对 | 业务交付验收 | 不以样本检查替代 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与判据 | 失败处理 |
|---|---|---|
| 副本项目打开Video | 用户确认会话项目 | 不直接写原片 |
| 选模板并局部修改 | 用户确认草稿与时间线 | 变化后重看关键片段 |
| check及整段导出复核 | 用户核对全片 | 缺覆盖不放行 |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次 | DSH/Node/运行时，未知 | 安装与短片项目配置，未知 |
| 持续 | 模型、预览和导出渲染，未知 | 逐段质量与素材核对，未知 |
| 失败恢复 | 重渲染和项目备份，未知 | 停预览、恢复项目及全片重验，未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 任务 | 支持 | 缺口 |
|---|---|---|
| 同会话编辑预览 | 会话身份与预览生命周期 | 实际兼容/耗时 |
| 自动检查 | 固定check与结构化输出 | 时间覆盖及业务内容正确性 |

> **思考**：[Q03](#research-q03) validate采用5样本并限40问题，退出码0不等于整段视频和业务内容验收；短时缺陷与最终导出仍需检查。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将上游HyperFrames作为同会话本地视频工作流，增加预览资源归属与受限校验交接；编辑器引擎贡献归上游。

[Q01](#research-q01)、[Q02](#research-q02) 将上游HyperFrames作为同会话本地视频工作流，增加预览资源归属与受限校验交接；编辑器引擎贡献归上游。

复用starts去重、view lease与owned进程清理可减少资源误关；移植需绑定项目真实路径并说明借用服务的所有权，不能复制kill逻辑而丢掉owned。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q03](#research-q03) validate采用5样本并限40问题，退出码0不等于整段视频和业务内容验收；短时缺陷与最终导出仍需检查。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q03](#research-q03) 在许可范围内短片副本试用，先确定导出验收和人工全片责任；模型validate只作有限检查，不能当最终发布门槛。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已核查runtime身份、预览生命周期和validate；未运行，覆盖驱动采样为未验证假设。

- 已检查：作者 README、包清单、源码路径 packages/deepseek-ivideo/README.md、packages/deepseek-ivideo/package.json、source/plugins/deepseek-ivideo/src/runtime.ts、source/plugins/deepseek-ivideo/src/index.ts、LICENSE 及固定范围 inventory；组件：packages/deepseek-ivideo。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：组件packages与对应source runtime抽读；未验证构建对应、所有模板、目标运行或导出兼容。
- 下一步：隔离短片检查两视图共享与回收，再注入短时缺陷比较5样本和覆盖策略，尚未执行。

**分析版本**

- **仓库**：[Devin-AXIS/deepseek-design](https://github.com/Devin-AXIS/deepseek-design)
- **版本号**：0.5.0（[固定提交 62ee529](https://github.com/Devin-AXIS/deepseek-design/tree/62ee529e84423ba63e823b23860293a43b6eb03b)）
- **版本日期**：2026-10-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 未验证假设是公开时间覆盖并风险驱动加样，以已知短时缺陷比较漏检和渲染/人工成本；无改善即停止。

隔离短片检查两视图共享与回收，再注入短时缺陷比较5样本和覆盖策略，尚未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 69 | 228889 | 202466 | 25383 | — |
| .md | source | 2 | 194 | — | — | 2091 |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Devin-AXIS/deepseek-design/issues?q=is%3Aissue+created%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Devin-AXIS/deepseek-design/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-27。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查HyperFrames会话视频适配、资源所有权与采样验收边界。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · 会话视频编辑适合谁，什么算交付？

**研究主题**：场景与需求、采用判断

#### 完整回答

适合制作产品演示、动态信息和短视频且能人工预览验收的人，在DSH对话旁用时间线和选区修改本地HTML/CSS及素材。作者明确复用iPolloWork定制HyperFrames，不维护第二引擎，首版没有语音克隆。合格结果应是可重新编辑的项目及整段可播放、文字/素材/时间符合需求的导出视频，不是预览能启动或模板数多。简单基线是在独立时间线编辑器中制作，再手工把修改描述给Agent；此组件连接同一工作区与会话，少做上下文切换，但完整制作收益未测。

#### 证据与依据

**依据 1 · 作者声明**：[packages/deepseek-ivideo/README.md:15-37](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/packages/deepseek-ivideo/README.md#L15-L37)

作者定位、上游复用、输出边界与环境，模板数只作声明。

<details>
<summary>查看原文（23行）</summary>

```text
`deepseek-ivideo` 将 iPolloWork 的同一个 Video Studio 作为原生 **Video** 视图加入 DeepSeek Harness。它直接复用 iPolloWork 的 `VideoPanel` 和定制 HyperFrames 时间线、可视化编辑器、动画系统、预览及视频导出能力，不维护第二套编辑器、顶部栏或渲染链路。

你可以让 Harness 从对话生成或修改整段视频，也可以在画面中选中标题、图片、素材或其他元素，通过 **Ask AI** 只修改当前对象。所有操作仍落在当前工作区的真实 HTML、CSS、素材和项目文件中，可继续手动精调、预览和导出。

### 核心能力

- DeepSeek Harness 对话中的原生 **Video** 视图
- HyperFrames 时间线、可视化编辑、动画、素材和实时预览
- 28 个内置可编辑 Video 模板
- 跟随主题的可复用组件库，可从 Studio 直接加入时间线
- 统一的组件变量表单与 AI 可读数据契约
- 西班牙、美国、美国六边形、世界、气泡和流向等 6 类地图组件
- 整段视频与选区级 **Ask AI**
- `ipollowork_video_validate` 自动校验工具
- HyperFrames 原生视频导出
- 每个工作区会话独立运行，空闲自动回收
- 真实项目保存在 `video/<sessionId>/`

首版不包含语音克隆、语音设置和 iPolloWork 全局 Design System 抽屉。

## 安装并启动

要求 Node.js 22 或更高版本。发布包内置从 iPolloWork 主仓库构建的定制 HyperFrames 运行时，当前源版本为 `0.7.60`；不会在安装时另外下载同名公共 npm 版本。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 预览与校验怎样受会话和进程所有权约束？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

runtime以真实workspace和session形成video项目身份，校验路径realpath仍在工作区；并发启动存入starts并共享promise。release移除view lease，最后一个释放后定时回收，removePreview仅在owned时杀进程，避免关掉借用的外部服务。这是本地预览资源所有权设计而非所有进程的通用管理。validate先检查项目index.html，再调用HyperFrames check --json --samples 5 --max-issues 40，按退出码生成ok，尝试解析JSON并限制输出。DSH模型工具是受限检查接口，不是任意命令执行入口；需要Node、打包的定制运行时和可写工作区，实际启动/端口/导出链未运行。

#### 证据与依据

**依据 1 · 源码核查**：[source/plugins/deepseek-ivideo/src/runtime.ts:180-226](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/source/plugins/deepseek-ivideo/src/runtime.ts#L180-L226)

starts共享、lease释放及固定check调用。

<details>
<summary>查看原文（47行）</summary>

```text
      if (started && input.viewId) started.leases.add(input.viewId);
      return { ...session, reused: true };
    }

    const start = this.startProject(identity, input.viewId);
    this.starts.set(identity.key, start);
    try {
      return await start;
    } finally {
      if (this.starts.get(identity.key) === start) this.starts.delete(identity.key);
    }
  }

  async release(input: { workspaceRoot: string; sessionId: string; viewId: string }) {
    const identity = await this.projectIdentity(input.workspaceRoot, input.sessionId, false);
    const preview = this.previews.get(identity.key);
    if (!preview) return;
    preview.leases.delete(input.viewId);
    if (preview.leases.size === 0) this.scheduleIdle(identity.key, preview);
  }

  async stop(input: { workspaceRoot: string; sessionId: string }) {
    const identity = await this.projectIdentity(input.workspaceRoot, input.sessionId, false);
    await this.starts.get(identity.key)?.catch(() => undefined);
    const preview = this.previews.get(identity.key);
    if (preview) await this.stopPreview(identity.key, preview);
  }

  async validate(input: { workspaceRoot: string; sessionId: string; signal?: AbortSignal }): Promise<VideoValidationResult> {
    const identity = await this.projectIdentity(input.workspaceRoot, input.sessionId, false);
    await verifiedExistingPath(identity.workspaceRoot, `${identity.projectDirectory}/index.html`, "video", "iVideo");
    const result = await this.runCommand(
      ["check", identity.projectPath, "--json", "--samples", "5", "--max-issues", "40"],
      identity.projectPath,
      input.signal,
    );
    let report: JsonValue = null;
    try {
      report = JSON.parse(result.stdout.trim());
    } catch {
      report = null;
    }
    return {
      ok: result.exitCode === 0,
      exitCode: result.exitCode,
      report,
      output: (result.stderr.trim() || result.stdout.trim()).slice(-MAX_OUTPUT_CHARS),
```

</details>

**依据 2 · 源码核查**：[source/plugins/deepseek-ivideo/src/runtime.ts:234-247](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/source/plugins/deepseek-ivideo/src/runtime.ts#L234-L247)

真实路径与工作区包含判断。

<details>
<summary>查看原文（14行）</summary>

```text
  private async projectIdentity(workspacePath: string, sessionId: string, create: boolean): Promise<ProjectIdentity> {
    const workspaceRoot = await realpath(resolve(workspacePath.trim()));
    const projectDirectory = videoProjectDirectory(sessionId);
    const projectId = videoProjectId(sessionId);
    const requestedProjectPath = create
      ? dirname(await verifiedWritePath(workspaceRoot, `${projectDirectory}/index.html`, "video", "iVideo"))
      : resolve(workspaceRoot, projectDirectory);
    const projectPath = create
      ? requestedProjectPath
      : await realpath(requestedProjectPath).catch((error: unknown) => {
        if (error && typeof error === "object" && Reflect.get(error, "code") === "ENOENT") return requestedProjectPath;
        throw error;
      });
    if (!inside(workspaceRoot, projectPath)) throw new Error("iVideo project escaped the workspace.");
```

</details>

**依据 3 · 源码核查**：[source/plugins/deepseek-ivideo/src/runtime.ts:400-428](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/source/plugins/deepseek-ivideo/src/runtime.ts#L400-L428)

idle回收与owned进程清理。

<details>
<summary>查看原文（29行）</summary>

```text
  private clearIdle(preview: ManagedPreview) {
    if (preview.idleTimer) clearTimeout(preview.idleTimer);
    preview.idleTimer = null;
  }

  private scheduleIdle(key: string, preview: ManagedPreview) {
    this.clearIdle(preview);
    preview.idleTimer = setTimeout(() => {
      if (preview.leases.size === 0 && this.previews.get(key) === preview) this.removePreview(key, preview);
    }, this.idleMs);
  }

  private removePreview(key: string, preview: ManagedPreview, stop = true) {
    this.clearIdle(preview);
    if (this.previews.get(key) === preview) this.previews.delete(key);
    if (stop && preview.owned) killOwnedProcess(preview.child);
  }

  private async stopPreview(key: string, preview: ManagedPreview) {
    this.removePreview(key, preview, false);
    const child = preview.owned ? preview.child : null;
    if (!child || child.exitCode !== null) return;
    const exited = new Promise<void>((resolvePromise) => child.once("exit", () => resolvePromise()));
    killOwnedProcess(child);
    await Promise.race([
      exited,
      new Promise<void>((resolvePromise) => setTimeout(resolvePromise, 2_000)),
    ]);
    if (child.exitCode === null) {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 采样校验能否代替整段验收，采用负担在哪？

**研究主题**：贡献与相对优势、缺陷与关键质疑、效果与总成本

#### 完整回答

贡献是将已存在HyperFrames引擎接入会话，统一预览租约、受限校验和本地文件交接，不能把继承的编辑器/动画系统全算本项目原创。关键限制是check只请求5个样本且最多40问题，退出码0只表示该工具运行契约，不足说明每个时间点、内容正确性、品牌和导出播放都合格；样本间闪现错字或素材异常可能漏检。首次接入需版本与运行时匹配，持续要渲染和模型资源、手动时间线/全片检查，失败需处理预览释放和项目恢复，现金与人工均未知。所查LICENSE为source available并限定个人非商业/少于3人的内部非商业等用途，付费客户交付、3人及以上等另列书面授权条件，不把可下载包当无限许可。可在许可范围内短片副本试用，但不能以validate ok自动放行。

#### 证据与依据

**依据 1 · 源码核查**：[source/plugins/deepseek-ivideo/src/runtime.ts:208-226](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/source/plugins/deepseek-ivideo/src/runtime.ts#L208-L226)

五样本/问题上限、JSON和退出码是实际校验边界。

<details>
<summary>查看原文（19行）</summary>

```text
  async validate(input: { workspaceRoot: string; sessionId: string; signal?: AbortSignal }): Promise<VideoValidationResult> {
    const identity = await this.projectIdentity(input.workspaceRoot, input.sessionId, false);
    await verifiedExistingPath(identity.workspaceRoot, `${identity.projectDirectory}/index.html`, "video", "iVideo");
    const result = await this.runCommand(
      ["check", identity.projectPath, "--json", "--samples", "5", "--max-issues", "40"],
      identity.projectPath,
      input.signal,
    );
    let report: JsonValue = null;
    try {
      report = JSON.parse(result.stdout.trim());
    } catch {
      report = null;
    }
    return {
      ok: result.exitCode === 0,
      exitCode: result.exitCode,
      report,
      output: (result.stderr.trim() || result.stdout.trim()).slice(-MAX_OUTPUT_CHARS),
```

</details>

**依据 2 · 作者声明**：[packages/deepseek-ivideo/README.md:69-82](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/packages/deepseek-ivideo/README.md#L69-L82)

Ask AI草稿、边界及上游唯一源。

<details>
<summary>查看原文（14行）</summary>

```text
**Ask AI** 只会把经过校验的文件、元素定位、文字、素材和样式信息写入当前对话草稿，不会自动发送或直接执行。

## 安全与运行边界

- 只访问 DeepSeek Harness 已注册工作区中的 `video/<sessionId>/`。
- 拒绝目录穿越和逃逸工作区的符号链接。
- Studio 接口使用进程级随机令牌；跨 iframe 消息同时校验来源窗口和来源地址。
- 模板应用先停止预览、暂存并原子替换；失败时恢复旧项目，再重新启动。
- 并发启动会合并；端口冲突会安全回退；只回收插件自己创建的进程。
- 模型校验工具返回有限、结构化的结果，不提供任意文件访问。

## 参与贡献

请在 [`deepseek-design`](https://github.com/Devin-AXIS/deepseek-design) 仓库的 `source/plugins/deepseek-ivideo` 下提交适配器改动。iPolloWork 主仓库是唯一上游代码源；贡献会作为可审查 PR 回流，合并后再统一构建、同步和发布三个插件。
```

</details>

**依据 3 · 源码核查**：[LICENSE:15-53](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/LICENSE#L15-L53)

固定许可用途与另行授权文本。

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

#### 缺口

- 五样本对真实短时缺陷覆盖不足以定量判断
  **影响**：不能估计漏检率和完整质检成本
  **进一步探讨**：在固定视频时间点注入错字/缺图，比较check与全片人工审看

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 时间覆盖表能否让采样质检更可靠？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把每次check的采样时间点、缺失片段与高变化区标成覆盖表，要求新增素材或短促动画附近增加检查，再让用户全片抽查。推导来自Q02的固定5样本与Q03的样本间缺陷反例；增量在覆盖可见与风险驱动采样，不是另建视频引擎。最小验证使用五段含已知短时缺陷的视频，对比固定采样与覆盖驱动采样，记录漏检、渲染时间和人工分钟；无漏检改善或成本高于全片查看即停止，不能宣称保证全部内容真实。

#### 证据与依据

**依据 1 · 源码核查**：[source/plugins/deepseek-ivideo/src/runtime.ts:208-226](https://github.com/Devin-AXIS/deepseek-design/blob/62ee529e84423ba63e823b23860293a43b6eb03b/source/plugins/deepseek-ivideo/src/runtime.ts#L208-L226)

固定采样入口可作为覆盖策略扩展的接口。

<details>
<summary>查看原文（19行）</summary>

```text
  async validate(input: { workspaceRoot: string; sessionId: string; signal?: AbortSignal }): Promise<VideoValidationResult> {
    const identity = await this.projectIdentity(input.workspaceRoot, input.sessionId, false);
    await verifiedExistingPath(identity.workspaceRoot, `${identity.projectDirectory}/index.html`, "video", "iVideo");
    const result = await this.runCommand(
      ["check", identity.projectPath, "--json", "--samples", "5", "--max-issues", "40"],
      identity.projectPath,
      input.signal,
    );
    let report: JsonValue = null;
    try {
      report = JSON.parse(result.stdout.trim());
    } catch {
      report = null;
    }
    return {
      ok: result.exitCode === 0,
      exitCode: result.exitCode,
      report,
      output: (result.stderr.trim() || result.stdout.trim()).slice(-MAX_OUTPUT_CHARS),
```

</details>

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
