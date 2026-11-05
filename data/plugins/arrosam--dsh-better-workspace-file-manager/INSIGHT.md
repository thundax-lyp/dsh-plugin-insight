# Better Workspace File Manager

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ef5ecdd](https://github.com/Arrosam/dsh-better-workspace-file-manager/tree/ef5ecdd05d3f382d9faec6e8b4eb9d7b03aad2f5)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Arrosam/dsh-better-workspace-file-manager) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-workspace-file-manager)
<!-- END META -->

> **功能**：在 DSH Web 中管理工作区文件，支持上传、移动、下载和带版本检查的文本编辑。

> **亮点**：[Q01](#research-q01) 将文件管理和版本保护放进 Web 预览。

> **主要限制**：[Q03](#research-q03) 路径和权限依赖宿主，显式冲突覆盖仍会写文件。

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
  - [Q01 · 哪些工作可以留在 DSH？](#detail-section-11)
  - [Q02 · 如何避免覆盖其他人的修改？](#detail-section-12)
  - [Q03 · 文件边界如何检查？](#detail-section-13)
  - [Q04 · 如何先试并保留原文件？](#detail-section-14)
  - [Q05 · 冲突时加差异预览能防误覆盖吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH 修改小文件的开发者可评估工作区编辑器。

独立编辑器可用但要切窗口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 文本编辑 | 在预览修改文件 | 冲突时需人工决策 |
| 文件树 | 管理选中文件 | 受宿主路径语义限制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web | 必需 | 提供文件界面 | 用原编辑器 |
| 本地文件 backend | 必需 | 检查路径和版本 | 无法保存 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 建隔离副本 | 关自动保存 |
| 核查 | 外部改动后保存 | 观察冲突 |
| 退出 | 停用或改用外部编辑器 | 保留原文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 安装耗时未知 | 需宿主支持 |
| 持续 | 处理成本未知 | 复核耗时未知 | 文件操作有副作用 |
| 恢复 | 恢复开销未知 | 排障耗时未知 | 优先用测试副本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 原位编辑 | 保存有版本条件 | 实际后端并发与路径边界 |

> **思考**：[Q03](#research-q03) 路径和权限依赖宿主，显式冲突覆盖仍会写文件。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将文件管理和版本保护放进 Web 预览。

区分文本目标解析与移动删除的最终链接处理。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 路径和权限依赖宿主，显式冲突覆盖仍会写文件。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用隔离副本测试冲突和退出。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的会话工作区解析、写入冲突和文件操作边界。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的会话工作区解析、写入冲突和文件操作边界。未执行目标代码或实际宿主验证。
- 下一步：让用户处理同一组版本冲突

**分析版本**

- **仓库**：[Arrosam/dsh-better-workspace-file-manager](https://github.com/Arrosam/dsh-better-workspace-file-manager)
- **版本号**：1.3.0（[固定提交 ef5ecdd](https://github.com/Arrosam/dsh-better-workspace-file-manager/tree/ef5ecdd05d3f382d9faec6e8b4eb9d7b03aad2f5)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 比较差异预览对误覆盖的影响。

让用户处理同一组版本冲突

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2530 | 1976 | 419 | — |
| .md | source | 1 | 181 | — | — | 1386 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Arrosam/dsh-better-workspace-file-manager/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话工作区解析、写入冲突和文件操作边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些工作可以留在 DSH？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

使用 DSH Web 的开发者可在预览编辑文本，也可从树管理上传和移动。相比切去编辑器，可以直接修改小文件。读取响应携带版本用于随后保存，功能仍受宿主文件服务约束。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-25](https://github.com/Arrosam/dsh-better-workspace-file-manager/blob/ef5ecdd05d3f382d9faec6e8b4eb9d7b03aad2f5/README.md#L7-L25)

作者列出的操作

<details>
<summary>查看原文（19行）</summary>

```text
A file manager for the DeepSeek Harness (DSH) Web **Files** tab and the file preview panel. It adds the everyday file operations the shipped tree leaves out — upload, multi-select, download as a ZIP, new folder, delete, drag-to-move, drag-to-chat, and in-place text editing — without modifying the shipped Files tab's DOM.

## Features

### Files tab

- **Upload** by button, drag-and-drop from the computer, or a dropped folder (recreated recursively, keeping both copies on a name clash).
- **Multi-select** with click, ⌘/Ctrl-click, Shift-click, or a marquee drag over empty tree space.
- **Download** one file, several selected items, or a whole folder as a ZIP. Archives are streamed, so large folders are not held in memory.
- **New folder** from the right-click menu, with keep-both naming for folders created on your behalf.
- **Delete** files and folders after a confirmation dialog. Directories are removed with everything inside them.
- **Drag to move** rows onto a folder. A name already taken at the destination becomes `name (1).ext`, never an overwrite.
- **Drag workspace rows into a conversation** to add `@path` chips, or image attachments for PNG/JPEG/WebP/GIF.

### File preview

- **Download** in the preview's opening menu, next to the shipped Open / Show location actions.
- **Edit text files in place** for the text, code, and Markdown viewers. The editor keeps the file's line endings (LF/CRLF) and byte-order mark, and saves through a version guard: if the agent or another editor changed the file meanwhile, the save reports a conflict instead of overwriting it.
- **Save manually** with the Save button (or ⌘/Ctrl-S), or turn on **auto-save every 5 seconds** in Settings.
```

</details>

**依据 2 · 源码核查**：[index.js:285-292](https://github.com/Arrosam/dsh-better-workspace-file-manager/blob/ef5ecdd05d3f382d9faec6e8b4eb9d7b03aad2f5/index.js#L285-L292)

读取和版本

```text
  /** One workspace text file's exact contents and the version they were read at. */
  async text(request) {
    const file = await this.textFile(new URL(request.url).searchParams);
    const info = await this.ctx.fs.stat(file.target, request.signal);
    if (info === undefined) throw new HttpError(404, 'not-found');
    if ((info.size ?? 0) > MAX_EDIT_BYTES) throw new HttpError(413, 'too-large');
    const text = await this.ctx.fs.readText(file.target, request.signal);
    return Response.json({ text, version: info.version }, { headers: { 'cache-control': 'no-store' } });
```

**依据 3 · 源码核查**：[client.js:1464-1485](https://github.com/Arrosam/dsh-better-workspace-file-manager/blob/ef5ecdd05d3f382d9faec6e8b4eb9d7b03aad2f5/client.js#L1464-L1485)

编辑保存流程

<details>
<summary>查看原文（22行）</summary>

```text
      async function saveDraft(address, force = false) {
        const state = editors.getSnapshot()[address];
        if (state === undefined || state.phase !== 'ready' || state.saving || (!dirtyOf(state) && !force)) return true;
        const text = state.draft;
        setEditor(address, { saving: true, error: undefined });
        try {
          let { version } = state;
          if (force) {
            const latest = await request(`text?${new URLSearchParams({ sessionId: state.sessionId, path: state.path })}`, { method: 'GET' });
            version = (await latest.json()).version;
          }
          const query = new URLSearchParams({ sessionId: state.sessionId, path: state.path, version });
          const response = await request(`save?${query}`, {
            headers: { 'content-type': 'text/plain; charset=utf-8' },
            body: text,
          });
          const saved = await response.json();
          setEditor(address, { saving: false, saved: text, version: saved.version, conflict: false, savedAt: Date.now() });
          return true;
        } catch (error) {
          if (error?.code === 'stale') setEditor(address, { saving: false, conflict: true });
          else setEditor(address, { saving: false, error: t('edit.saveFailed', { reason: messageOf(error) }) });
```

</details>

#### 缺口

- 未跑 Web
  **影响**：实际效率未证
  **进一步探讨**：对照修一个小配置的步骤

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何避免覆盖其他人的修改？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

普通保存向 fs.writeText 传 replaceIfVersion；客户端捕获 stale 并提示冲突。选择保留自己版本时先读最新版再有意覆盖，仍使用新版本条件。写入处理保持原文件风格，最终原子和版本保障取决于宿主 backend。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:303-321](https://github.com/Arrosam/dsh-better-workspace-file-manager/blob/ef5ecdd05d3f382d9faec6e8b4eb9d7b03aad2f5/index.js#L303-L321)

解码与版本条件

<details>
<summary>查看原文（19行）</summary>

```text
  async save(request) {
    const query = new URL(request.url).searchParams;
    const workspace = await this.workspace(query.get('sessionId'));
    const file = await this.textFile(query, workspace);
    const version = query.get('version');
    if (typeof version !== 'string' || version === '') throw new HttpError(400, 'bad-request');
    const text = new TextDecoder('utf-8', { fatal: true });
    let content;
    try {
      content = text.decode(await request.arrayBuffer());
    } catch {
      throw new HttpError(400, 'not-text');
    }
    const head = await this.ctx.fs.readByteRange(file.target, { offset: 0, length: STYLE_SAMPLE_BYTES }, request.signal);
    // The editor's own sandbox root is this Session's workspace: the path is already confined to it,
    // and without an explicit policy fs-sandbox would fence by the deployment's default root instead.
    const policy = { mode: 'workspace-write', workspaceRoot: workspace.root, sessionId: query.get('sessionId') };
    const outcome = await this.ctx.fs.writeText(file.target, matchFileStyle(content, head), { kind: 'replaceIfVersion', version }, request.signal, policy);
    return Response.json({ version: outcome.version }, { headers: { 'cache-control': 'no-store' } });
```

</details>

**依据 2 · 源码核查**：[client.js:1459-1485](https://github.com/Arrosam/dsh-better-workspace-file-manager/blob/ef5ecdd05d3f382d9faec6e8b4eb9d7b03aad2f5/client.js#L1459-L1485)

冲突和显式覆盖

<details>
<summary>查看原文（27行）</summary>

```text
       * Save the current draft. `force` re-reads the file's current version
       * first, so "Keep my version" after a conflict overwrites deliberately.
       * Concurrent calls collapse to one in-flight save; edits made while it
       * runs stay dirty and are saved by the next call.
       */
      async function saveDraft(address, force = false) {
        const state = editors.getSnapshot()[address];
        if (state === undefined || state.phase !== 'ready' || state.saving || (!dirtyOf(state) && !force)) return true;
        const text = state.draft;
        setEditor(address, { saving: true, error: undefined });
        try {
          let { version } = state;
          if (force) {
            const latest = await request(`text?${new URLSearchParams({ sessionId: state.sessionId, path: state.path })}`, { method: 'GET' });
            version = (await latest.json()).version;
          }
          const query = new URLSearchParams({ sessionId: state.sessionId, path: state.path, version });
          const response = await request(`save?${query}`, {
            headers: { 'content-type': 'text/plain; charset=utf-8' },
            body: text,
          });
          const saved = await response.json();
          setEditor(address, { saving: false, saved: text, version: saved.version, conflict: false, savedAt: Date.now() });
          return true;
        } catch (error) {
          if (error?.code === 'stale') setEditor(address, { saving: false, conflict: true });
          else setEditor(address, { saving: false, error: t('edit.saveFailed', { reason: messageOf(error) }) });
```

</details>

#### 缺口

- 未验证后台并发
  **影响**：不能保证所有文件系统语义
  **进一步探讨**：在 fs-local 和 fs-sandbox 注入外部修改

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 文件边界如何检查？

**研究主题**：缺陷与关键质疑

#### 完整回答

使用会话 header 取工作区，resolve 后做 contains。移动和删除只解析父目录，最后一节用 lstat，符号链接作为链接处理。文本保存主动传 workspace-write 策略，以会话目录为根；这条人的文件操作路径不能当成遵从任意 Agent 当前权限档。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:157-174](https://github.com/Arrosam/dsh-better-workspace-file-manager/blob/ef5ecdd05d3f382d9faec6e8b4eb9d7b03aad2f5/index.js#L157-L174)

定位工作区与目标

<details>
<summary>查看原文（18行）</summary>

```text
  async workspace(sessionId) {
    if (typeof sessionId !== 'string' || sessionId === '') throw new HttpError(400, 'bad-request');
    const header = this.ctx.sessions.get(sessionId)?.header
      ?? (await this.ctx.get('sessionPersistence')?.stat(sessionId))?.header;
    const root = header === undefined ? undefined : header.cwd ?? this.ctx.get('sandboxPolicy')?.workspaceRoot;
    if (root === undefined) throw new HttpError(404, 'no-session');
    return { root, target: await this.ctx.fs.resolve(root) };
  }

  /** Resolve one path inside the workspace; anything resolving outside it is refused. */
  async locate(workspace, path) {
    if (typeof path !== 'string' || path === '') throw new HttpError(400, 'bad-request');
    const target = await this.ctx.fs.resolve(path, { cwd: workspace.root });
    if (!this.ctx.fs.contains(workspace.target, target)) throw new HttpError(403, 'outside-workspace');
    const info = await this.ctx.fs.stat(target);
    if (info === undefined) throw new HttpError(404, 'not-found');
    return { target, type: info.type, path: this.ctx.fs.processPath(target) };
  }
```

</details>

**依据 2 · 源码核查**：[index.js:183-205](https://github.com/Arrosam/dsh-better-workspace-file-manager/blob/ef5ecdd05d3f382d9faec6e8b4eb9d7b03aad2f5/index.js#L183-L205)

父路径与链接语义

<details>
<summary>查看原文（23行）</summary>

```text
  /**
   * Locate an entry to move or delete without following its last component:
   * its parent folder must resolve inside the workspace, the entry itself may
   * be a symlink (acted on as a link). The workspace folder's own parent lies
   * outside the workspace, so the workspace can never be such an entry.
   * @returns the entry's process path, whether it is a real directory, and the path as requested.
   */
  async entry(workspace, path) {
    if (typeof path !== 'string' || path === '') throw new HttpError(400, 'bad-request');
    // Normalized first, so `.`/`..` forms (`<ws>/.`, `sub/..`, `..`) name the entry they
    // reach and are refused like that entry: the workspace or its parent is outside-workspace.
    const absolute = resolvePath(workspace.root, path);
    const name = basename(absolute);
    if (name === '') throw new HttpError(403, 'outside-workspace'); // the filesystem root
    const parent = await this.ctx.fs.resolve(dirname(absolute));
    if (!this.ctx.fs.contains(workspace.target, parent)) throw new HttpError(403, 'outside-workspace');
    const full = join(this.ctx.fs.processPath(parent), name);
    const info = await lstat(full).catch((error) => {
      if (error?.code === 'ENOENT') throw new HttpError(404, 'not-found');
      throw error;
    });
    return { path: full, directory: info.isDirectory(), requested: path };
  }
```

</details>

**依据 3 · 源码核查**：[index.js:316-321](https://github.com/Arrosam/dsh-better-workspace-file-manager/blob/ef5ecdd05d3f382d9faec6e8b4eb9d7b03aad2f5/index.js#L316-L321)

显式写入策略

```text
    const head = await this.ctx.fs.readByteRange(file.target, { offset: 0, length: STYLE_SAMPLE_BYTES }, request.signal);
    // The editor's own sandbox root is this Session's workspace: the path is already confined to it,
    // and without an explicit policy fs-sandbox would fence by the deployment's default root instead.
    const policy = { mode: 'workspace-write', workspaceRoot: workspace.root, sessionId: query.get('sessionId') };
    const outcome = await this.ctx.fs.writeText(file.target, matchFileStyle(content, head), { kind: 'replaceIfVersion', version }, request.signal, policy);
    return Response.json({ version: outcome.version }, { headers: { 'cache-control': 'no-store' } });
```

#### 缺口

- 未验证符号链接竞争及跨会话权限
  **影响**：不能证明完整隔离
  **进一步探讨**：在沙箱用外链和并发替换矩阵

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何先试并保留原文件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

用支持版本和宿主本地文件后端，在测试工作区编辑一份副本，刻意制造外部修改验证冲突。保持自动保存关闭，测试后可退出回原编辑器。删除等路径另需验收，原样数据不用于首次测试。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-38](https://github.com/Arrosam/dsh-better-workspace-file-manager/blob/ef5ecdd05d3f382d9faec6e8b4eb9d7b03aad2f5/README.md#L21-L38)

自动保存和宿主要求

<details>
<summary>查看原文（18行）</summary>

```text
### File preview

- **Download** in the preview's opening menu, next to the shipped Open / Show location actions.
- **Edit text files in place** for the text, code, and Markdown viewers. The editor keeps the file's line endings (LF/CRLF) and byte-order mark, and saves through a version guard: if the agent or another editor changed the file meanwhile, the save reports a conflict instead of overwriting it.
- **Save manually** with the Save button (or ⌘/Ctrl-S), or turn on **auto-save every 5 seconds** in Settings.

### Settings

The plugin contributes a **Text editing → Auto-save** row to the Plugins settings page. The choice is stored by the DSH Settings service, not in browser storage.

## Requirements

- DSH **Web** profile, version **0.2.1-rc.3 or newer**. Verified against:
  - `0.2.1-rc.3`
  - `0.2.1-rc.5`
  - `0.2.2-rc.1`
- A Host-local filesystem backend (`fs-local` / `fs-sandbox`), which is what Web profiles mount.
- Node.js 20.15+ on the Host (the plugin uses the built-in Web Streams bridge; DSH itself may require a newer Node).
```

</details>

**依据 2 · 作者声明**：[README.md:40-53](https://github.com/Arrosam/dsh-better-workspace-file-manager/blob/ef5ecdd05d3f382d9faec6e8b4eb9d7b03aad2f5/README.md#L40-L53)

安装入口

<details>
<summary>查看原文（14行）</summary>

````text
## Install

### From the DSH Plugins page

Open **Plugins** in the sidebar, find **Better Workspace File Manager**, and install or enable it. The page adds the package to the current profile and enables its bundle.

### From the profile manifest

Install the package in the profile and add it to the ordered bundle list:

```sh
cd ~/.dsh/profiles/web
pnpm add dsh-better-workspace-file-manager
```
````

</details>

**依据 3 · 源码核查**：[client.js:1464-1485](https://github.com/Arrosam/dsh-better-workspace-file-manager/blob/ef5ecdd05d3f382d9faec6e8b4eb9d7b03aad2f5/client.js#L1464-L1485)

保存冲突可见

<details>
<summary>查看原文（22行）</summary>

```text
      async function saveDraft(address, force = false) {
        const state = editors.getSnapshot()[address];
        if (state === undefined || state.phase !== 'ready' || state.saving || (!dirtyOf(state) && !force)) return true;
        const text = state.draft;
        setEditor(address, { saving: true, error: undefined });
        try {
          let { version } = state;
          if (force) {
            const latest = await request(`text?${new URLSearchParams({ sessionId: state.sessionId, path: state.path })}`, { method: 'GET' });
            version = (await latest.json()).version;
          }
          const query = new URLSearchParams({ sessionId: state.sessionId, path: state.path, version });
          const response = await request(`save?${query}`, {
            headers: { 'content-type': 'text/plain; charset=utf-8' },
            body: text,
          });
          const saved = await response.json();
          setEditor(address, { saving: false, saved: text, version: saved.version, conflict: false, savedAt: Date.now() });
          return true;
        } catch (error) {
          if (error?.code === 'stale') setEditor(address, { saving: false, conflict: true });
          else setEditor(address, { saving: false, error: t('edit.saveFailed', { reason: messageOf(error) }) });
```

</details>

#### 缺口

- 未执行安装和文件变更
  **影响**：真实恢复未证
  **进一步探讨**：使用可删除副本核对退出

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 冲突时加差异预览能防误覆盖吗？

**研究主题**：新假设与验证

#### 完整回答

已有按钮可重新读版本后覆盖。对照现有提示与先显示差异的试验，观察误覆盖和恢复时间。若差异无助或明显延迟小编辑，则不采用。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:1459-1485](https://github.com/Arrosam/dsh-better-workspace-file-manager/blob/ef5ecdd05d3f382d9faec6e8b4eb9d7b03aad2f5/client.js#L1459-L1485)

现有显式覆盖

<details>
<summary>查看原文（27行）</summary>

```text
       * Save the current draft. `force` re-reads the file's current version
       * first, so "Keep my version" after a conflict overwrites deliberately.
       * Concurrent calls collapse to one in-flight save; edits made while it
       * runs stay dirty and are saved by the next call.
       */
      async function saveDraft(address, force = false) {
        const state = editors.getSnapshot()[address];
        if (state === undefined || state.phase !== 'ready' || state.saving || (!dirtyOf(state) && !force)) return true;
        const text = state.draft;
        setEditor(address, { saving: true, error: undefined });
        try {
          let { version } = state;
          if (force) {
            const latest = await request(`text?${new URLSearchParams({ sessionId: state.sessionId, path: state.path })}`, { method: 'GET' });
            version = (await latest.json()).version;
          }
          const query = new URLSearchParams({ sessionId: state.sessionId, path: state.path, version });
          const response = await request(`save?${query}`, {
            headers: { 'content-type': 'text/plain; charset=utf-8' },
            body: text,
          });
          const saved = await response.json();
          setEditor(address, { saving: false, saved: text, version: saved.version, conflict: false, savedAt: Date.now() });
          return true;
        } catch (error) {
          if (error?.code === 'stale') setEditor(address, { saving: false, conflict: true });
          else setEditor(address, { saving: false, error: t('edit.saveFailed', { reason: messageOf(error) }) });
```

</details>

#### 缺口

- 缺用户实验
  **影响**：收益未知
  **进一步探讨**：让用户处理同一组版本冲突

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
