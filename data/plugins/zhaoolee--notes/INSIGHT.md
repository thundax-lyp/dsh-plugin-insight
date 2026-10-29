# 开源版锤子便签（根应用）

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[878cfab](https://github.com/zhaoolee/notes/tree/878cfab47a87183524d7f0ddd6b7b791181c0801)

<!-- BEGIN META -->
[![GitHub ★ 315](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=315&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhaoolee/notes)
<!-- END META -->

> **功能**：Web 便签应用，支持 Markdown 编辑、多便签管理、主题图片导出、账号同步和文章资源输出。

> **亮点**：应用把便签源稿、主题、资源等待和截图输出串在同一流程，前端还核对导出主题，减少手动组合不同工具的步骤；价值属于集成设计和有条件推断，见 [Q01](#research-q01) 与 [Q03](#research-q03)。

> **主要限制**：单页串行保存不能推出多端无覆盖。Web请求未传服务端可选的expectedUpdatedAt，多设备的整工作区后写可能覆盖先写；实际损失尚未复现，因此试用应限制单活动编辑端并保留源稿，见 [Q02](#research-q02)。

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
  - [Q01 · 根应用与DSH子插件分别是什么，适合谁？](#detail-section-11)
  - [Q02 · 编辑、保存、云同步怎样避免旧快照覆盖新内容？](#detail-section-12)
  - [Q03 · Markdown如何变为图片或资源包，失败如何呈现？](#detail-section-13)
  - [Q04 · 登录、导入和公众号/网站出口是否有明确边界？](#detail-section-14)
  - [Q05 · 采用条件、总成本和未来验证是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：以单人编辑为主的内容作者可把 Markdown 便签排版为主题长图或文章资源，先保留源稿再分享，详见 [Q01](#research-q01)。

基线为文本编辑器加手动排版/截图，以及分别管理源稿、图片和公众号草稿的流程。只比较固定实现，没有同条件实测，也不把根Web应用与仓库DSH子插件合成同一组件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 多便签编辑 | 创建、选择与维护Markdown稿件 | 浏览器本地持久化不等于云备份 |
| 云工作区 | 同账号读取与保存稿件 | Web保存未带版本前提，不推荐多端并发 |
| 图片导出 | 主题长图生成与下载 | 需要服务器浏览器，实际布局需人工核对 |
| 公众号导入预览 | 取得公开文章转换预览 | 独立登录、URL与配额要求 |
| 公众号草稿 | 保存文章到公众号草稿箱 | 同源、账号配置和外部权限，属于远端写入 |
| 网站资源包 | 生成Hugo网站ZIP | 另需部署，生成不等于公开上线 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node与前后端构建依赖 | 自托管必需 | 运行Web服务与页面 | 需按根package构建，不能用DSH子插件安装代替 |
| Playwright Chromium与页面资源 | 图片导出必需 | 填充、布局等待及截图 | 缺浏览器返回错误，主题不符前端拒绝 |
| 账号与持久化存储 | 云工作区必需 | 隔离账号并保存便签 | 匿名本地稿不等于服务器副本 |
| 七牛/公众号配置、可选模型凭据 | 对应操作必需 | 资源上传、草稿、润色 | 外部权限和费用未验证 |
| Hugo及图片处理条件 | 网站ZIP操作必需 | 构建可下载网站包 | 不能将ZIP生成当公网托管完成 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者配置服务、存储和登录策略 | 健康与账号范围明确，保留备份 |
| 编辑 | 用户创建便签并保留源稿 | 本地/云状态可识别，不同时跨端改稿 |
| 导出 | 用户选主题，服务器等待资源后截图 | 主题响应相符，人工核对图片和文字 |
| 外部操作 | 用户单独决定复制文章、写公众号草稿或部署ZIP | 核对远端结果，未知结果不盲目重试 |
| 退出 | 用户导出稿件与资源并停用服务 | 先验证可读取副本再迁移 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 服务、浏览器和存储资源金额未知 | 安装构建、账号、备份配置耗时未知 | 根应用自托管不是仅装DSH插件 |
| 持续使用 | 截图计算、图片存储、网络及可选模型费未知 | 排版与云状态复核 | 未测合格导出单位成本 |
| 失败恢复 | 重试生成文件与资源残留用量未知 | 比对本地/云稿、重新导出 | 前端超时不证明服务端未完成 |
| 迁移退出 | 副本与资源保留成本未知 | 检查Markdown、图片和元数据可用性 | 全量元信息迁移未验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 主题图片导出 | 页面填充、资源等待、截图与主题核对 | 视觉质量、长文合格率和速度 |
| 单页云保存 | 串行队列及待写时不轮询覆盖 | 多端并发无覆盖与断网恢复 |
| 内容出口 | 公众号草稿写入和网站ZIP路径存在 | 外部权限、成功率与节时 |

> **思考**：单页串行保存不能推出多端无覆盖。Web请求未传服务端可选的expectedUpdatedAt，多设备的整工作区后写可能覆盖先写；实际损失尚未复现，因此试用应限制单活动编辑端并保留源稿，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：应用把便签源稿、主题、资源等待和截图输出串在同一流程，前端还核对导出主题，减少手动组合不同工具的步骤；价值属于集成设计和有条件推断，见 [Q01](#research-q01) 与 [Q03](#research-q03)。

[Q02](#research-q02) 的串行保存队列与待写状态抑制轮询能解决单页异步乱序；[Q03](#research-q03) 复用前端渲染并核对主题也值得迁移。维护代价在于server/index.ts承载多种外部出口，以及可选版本前提未在Web客户端接线，不能用工具函数存在代替有效保护。

<a id="detail-section-5"></a>

### 1.4 主要限制

单页串行保存不能推出多端无覆盖。Web请求未传服务端可选的expectedUpdatedAt，多设备的整工作区后写可能覆盖先写；实际损失尚未复现，因此试用应限制单活动编辑端并保留源稿，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先以单人、单活动编辑端和非敏感稿件试用，保留Markdown原稿，核对主题、图片和全文后再分享；多端并发编辑暂缓。云保存异常或导出缺失时退回本地稿与手工排版，外部草稿另行核对结果，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查根Web应用的编辑、保存、导出、登录及发布出口源码。建议在单活动编辑端与保留源稿的范围试用；多端可靠性和视觉效果未实测，未来冲突方案未验证。

- 已检查：作者 README、包清单、源码路径 README.md、docker-compose.yml、package.json、server/auth.ts、server/index.ts、server/site-publishing/route.ts、server/wechat-import/route.ts、src/App.tsx、src/lib/app-state.ts、src/lib/auth.ts、src/lib/export-config.ts、src/lib/export.ts、src/lib/workspace-save.ts、src/store/useAppStore.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整根组件inventory为统计范围，人工检查本文列出的编辑、保存、导出、认证与发布路径；未完整审计全部UI、网络下载、安全、公众号SDK及DSH子插件，子插件另有独立组件。
- 下一步：后续以同一组中文、代码、图片、长文样本比较手动截图与应用导出，并在两个隔离客户端验证并发/断网；观察内容完整性、视觉质量、人工恢复与总资源成本。本轮未执行目标网站、测试、上传或草稿写入。

**分析版本**

- **仓库**：[zhaoolee/notes](https://github.com/zhaoolee/notes)
- **版本号**：1.14.1（[固定提交 878cfab](https://github.com/zhaoolee/notes/tree/878cfab47a87183524d7f0ddd6b7b791181c0801)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

让每次Web写入强制带云版本，并在冲突时保留双方副本，可能减少静默覆盖，但也增加人工合并负担。这是未实现假设，用双端不同/相同便签和断网重连对照，任一方内容无提示消失则否定，见 [Q05](#research-q05)。

后续以同一组中文、代码、图片、长文样本比较手动截图与应用导出，并在两个隔离客户端验证并发/断网；观察内容完整性、视觉质量、人工恢复与总资源成本。本轮未执行目标网站、测试、上传或草稿写入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 27 | 7770 | — | — | 137664 |
| .ts | test | 38 | 15010 | 13792 | 353 | — |
| .js | source | 3 | 509 | 463 | 48 | — |
| .ts | source | 67 | 20204 | 17053 | 425 | — |
| .md | example | 1 | 86 | — | — | 1053 |
| .md | test | 3 | 366 | — | — | 1958 |
| .mjs | source | 5 | 3127 | 2703 | 19 | — |
| .tsx | source | 24 | 12894 | 11668 | 62 | — |
| .ts | example | 1 | 255 | 252 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/zhaoolee/notes/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：notes 根应用怎样支持便签编辑与导出，其同步和外部发布边界能否满足个人作者的可控使用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根应用与DSH子插件分别是什么，适合谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本组件是供内容作者编辑、保存、排版和导出Markdown便签的Web应用，根package私有且由Vite前端与Express后端组成；仓库内另有dsh-plugin，README中的DSH安装命令针对该子组件，不能据目录收录把根应用叫成原生DSH插件。作者强调手机/PC、主题图片、公众号与AI调用；这些是用途声明，本次只按根应用链路核查。

目标用户是已有文字、希望变成可分享长图或文章资源的个人作者。合格结果须保留原文、主题与图片，导出可读文件且有可恢复的源稿。相对文本编辑器加手工截图，应用把多便签、主题、图片和导出入口集成起来；相对多人协作编辑器，没有据此证明更强同步。没有用户频率和可读性对照，不能把“复刻”或“免费”解读为可用性验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-35](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/README.md#L18-L35)

作者说明根Web应用用途。

<details>
<summary>查看原文（18行）</summary>

```text
- 一个锤子便签风格的导出器，预览与图片导出支持**暖白纸感**、**深夜便签**、**iPhone 备忘录深浅模式**和 **Bear 极简排版**。
- 可用来分享与openclaw的对话记录。
- 完美复刻锤子便签网页版和PC版，支持多便签，分类存储。
- 支持Docker一键私有化部署
- 纯WEB应用，无需安装任何App，打开即用
- 支持PC端和手机版，多端数据同步，支持公网部署
- 支持图片插入。
- 支持一键粘贴到公众号助手。
- 支持直接导出便签为图片，或复制为markdown格式进行分享。
- 自带浏览器持久化，关闭页面也不会丢失数据。
- 开源免费，可私有化部署。
- 工匠精神沁入AI，可以通过AI Skill直接调用工具，生成便签。
- 支持自定义底部标识（点击即可编辑）
- API原生封装支持Hermes Agent，OpenClaw直接通过skill驱动管理便签
- 支持 DeepSeek Harness（DSH），让智能体将对话导出为锤子便签。
- 支持接入DeepSeek润色书写内容，语法标点检查，重点加粗，复杂概念通俗化释义。
- 支持一键下载包含图片的Markdown资源包
- 支持下载为html离线查看
```

</details>

**依据 2 · 作者声明**：[README.md:37-46](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/README.md#L37-L46)

DSH安装指向子插件包。

<details>
<summary>查看原文（10行）</summary>

````text
## 通过DSH调用

可以在 DSH 的“插件市场”中搜索 `notes` 直接安装；源码仓库已经携带预编译产物，
无需开启 `allowBuilds`。也可以通过命令行安装 npm 版本：

```
dsh plugin --profile web add @zhaoolee/dsh-notes
```

安装后请重启目标 profile，使插件生效。重启后，在 DeepSeek Harness 对话中说：**把我们的对话导出成便签**， 智能体会自动整理当前对话并调用插件生成便签。
````

</details>

**依据 3 · 源码核查**：[package.json:1-27](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/package.json#L1-L27)

私有根应用及构建/服务脚本。

<details>
<summary>查看原文（27行）</summary>

```text
{
  "name": "notes",
  "private": true,
  "version": "1.14.1",
  "license": "Apache-2.0",
  "type": "module",
  "scripts": {
    "backend": "tsx server/index.ts",
    "backend:watch": "tsx watch server/index.ts",
    "dev": "node scripts/dev.mjs",
    "dev:frontend": "vite --host 127.0.0.1 --port 15173",
    "dev:docker": "vite --host 0.0.0.0 --port 15173",
    "build": "npm run typecheck && npm run build:server && vite build",
    "build:static": "npm run typecheck:app && vite build",
    "build:server": "tsc -p tsconfig.server.json",
    "typecheck": "npm run typecheck:app && npm run typecheck:server && npm run typecheck:feedback",
    "typecheck:app": "tsc --noEmit -p tsconfig.json",
    "typecheck:server": "tsc --noEmit -p tsconfig.server.json",
    "typecheck:feedback": "tsc --noEmit -p tsconfig.feedback.json",
    "test": "npm run test:feedback",
    "test:feedback": "npm run test:frontend && npm run test:backend && npm run test:dsh-plugin",
    "test:frontend": "node --import tsx --test frontend/tests/*.test.ts",
    "test:backend": "node --import tsx --test --test-concurrency=1 backend/tests/*.test.ts",
    "test:dsh-plugin": "node --import tsx --test --test-concurrency=1 dsh-plugin/tests/*.test.ts",
    "benchmark:input": "node scripts/benchmark-input-latency.mjs",
    "preview": "vite preview"
  },
```

</details>

**依据 4 · 源码核查**：[src/store/useAppStore.ts:74-107](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/src/store/useAppStore.ts#L74-L107)

创建便签并选择为活动文档。

<details>
<summary>查看原文（34行）</summary>

```text
export const useAppStore = create<AppStoreState>((set, get) => ({
  activeNoteId: initialActiveNote.id,
  folders: initialWorkspace.folders,
  notes: initialWorkspace.notes,
  markdown: initialActiveNote.markdown,
  selectedTheme: getInitialTheme(),
  isExporting: false,
  exportError: "",
  copyState: "idle",
  pendingAction: null,
  createNote: (markdown = "", folderId = null, isStarred = false) => {
    let createdNoteId = "";

    set((state) => {
      const firstNormalOrder = state.notes.reduce(
        (smallest, note) => Math.min(smallest, note.normalOrder),
        0,
      );
      const note = createNoteDocument(
        markdown,
        Date.now(),
        firstNormalOrder - 1,
        folderId,
        isStarred,
      );
      createdNoteId = note.id;

      return {
        activeNoteId: note.id,
        exportError: "",
        markdown: note.markdown,
        notes: [note, ...state.notes],
        pendingAction: null,
      };
```

</details>

#### 缺口

- 没有作者任务频率及同条件截图对照。
  **影响**：价值是机制推断，非已测节时。
  **进一步探讨**：记录一组真实文章从编辑到合格导出的完整流程。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 编辑、保存、云同步怎样避免旧快照覆盖新内容？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

编辑store维护便签和活动Markdown；本地persistNoteWorkspace写localStorage。登录后的App把云保存接入createCloudSaveQueue，同页只允许一个PUT在途并合并为最新待写快照；新快照尚排队时不把旧请求完成显示成“已同步”，轮询也在本地待写时避免覆盖编辑器。这能解释单页异步乱序的防护，但本地存储不是跨设备备份。

跨客户端有更重要边界。服务端saveWorkspace在exclusive块读取当前工作区，可选expectedUpdatedAt不匹配时报冲突，随后整份workspace替换保存；实际Web客户端saveCloudWorkspace请求仅包含workspace，未传expectedUpdatedAt。两台设备各自有单页队列仍可提交基于旧版本的整工作区，后写方不触发该前提检查，潜在覆盖另一台修改。这里确认的是源码条件与调用不匹配，尚未复现数据丢失。失败回调会显示failed，但队列已取出的快照不会因此自动回放；用户需保留本地副本并复核错误，不能把队列空闲解释为云端已经落盘。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/app-state.ts:114-124](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/src/lib/app-state.ts#L114-L124)

本地写入localStorage。

<details>
<summary>查看原文（11行）</summary>

```text
export function persistNoteWorkspace(workspace: NoteWorkspace): void {
  if (typeof window === "undefined" || getRenderMode() === "playwright") {
    return;
  }

  window.localStorage.setItem(getWorkspaceStorageKey(), JSON.stringify(workspace));

  const activeNote = workspace.notes.find((note) => note.id === workspace.activeNoteId);
  if (activeNote && !isSmartisanWebTestDataMode()) {
    window.localStorage.setItem(DRAFT_STORAGE_KEY, activeNote.markdown);
  }
```

</details>

**依据 2 · 源码核查**：[src/lib/workspace-save.ts:74-99](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/src/lib/workspace-save.ts#L74-L99)

串行取出最新快照，失败通知后继续。

<details>
<summary>查看原文（26行）</summary>

```text
  async function drain(): Promise<void> {
    if (running) {
      return;
    }

    running = true;

    try {
      while (pending !== null) {
        const workspace = pending;
        pending = null;

        try {
          const result = await options.save(workspace);
          options.onSaved?.(result);
        } catch (error) {
          options.onError?.(error);
        }
      }
    } finally {
      running = false;

      const resolvers = idleResolvers;
      idleResolvers = [];
      for (const resolve of resolvers) {
        resolve();
```

</details>

**依据 3 · 源码核查**：[src/App.tsx:339-367](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/src/App.tsx#L339-L367)

实际保存队列与同步状态回调。

<details>
<summary>查看原文（29行）</summary>

```text
  if (cloudSaveQueueRef.current === null) {
    cloudSaveQueueRef.current = createCloudSaveQueue({
      save: saveCloudWorkspace,
      onSaved: (stored) => {
        cloudRevisionRef.current = stored.updatedAt ?? Date.now();

        // 队列里还有更新的快照或新的防抖定时器时保持“同步中”，
        // 不能让前一个在途请求把后续未保存的快照标成已保存。
        if (
          !shouldMarkCloudSyncComplete({
            hasPendingSave:
              cloudSaveQueueRef.current?.hasPending() ?? false,
            isDebounceScheduled: cloudSaveTimeoutRef.current !== null,
          })
        ) {
          return;
        }

        setCloudSyncError("");
        hasFailedLocalSaveRef.current = false;
        setCloudSyncState("synced");
      },
      onError: (error) => {
        hasFailedLocalSaveRef.current = true;
        setCloudSyncError(
          error instanceof Error ? error.message : "云端便签保存失败。",
        );
        setCloudSyncState("failed");
      },
```

</details>

**依据 4 · 源码核查**：[src/App.tsx:645-667](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/src/App.tsx#L645-L667)

轮询尊重本地待写状态。

<details>
<summary>查看原文（23行）</summary>

```text
    const intervalId = window.setInterval(() => {
      if (hasPendingLocalSave()) {
        return;
      }

      void getCloudWorkspace()
        .then((cloud) => {
          if (
            cloud.workspace &&
            shouldApplyPolledWorkspace({
              polledUpdatedAt: cloud.updatedAt,
              knownRevision: cloudRevisionRef.current,
              hasPendingLocalSave: hasPendingLocalSave(),
            })
          ) {
            cloudRevisionRef.current = cloud.updatedAt ?? 0;
            skipNextCloudSaveRef.current = true;
            replaceWorkspace(cloud.workspace, {
              preserveActiveNote: true,
            });
            setCloudSyncError("");
            setCloudSyncState("synced");
          }
```

</details>

**依据 5 · 源码核查**：[src/lib/auth.ts:214-227](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/src/lib/auth.ts#L214-L227)

Web PUT仅发workspace。

<details>
<summary>查看原文（14行）</summary>

```text
export function saveCloudWorkspace(
  workspace: NoteWorkspace,
): Promise<CloudWorkspace> {
  return requestJson<CloudWorkspace>(
    "/api/workspace",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workspace }),
    },
    "保存云端便签失败。",
  );
```

</details>

**依据 6 · 源码核查**：[server/auth.ts:925-955](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/server/auth.ts#L925-L955)

前提版本可选，整工作区保存。

<details>
<summary>查看原文（31行）</summary>

```text
  async saveWorkspace(
    userId: string,
    value: unknown,
    now = Date.now(),
    expectedUpdatedAt?: number | null,
  ): Promise<StoredWorkspace> {
    return this.runExclusive(async () => {
      const workspace = parseNoteWorkspace(JSON.stringify(value));

      if (!workspace) {
        throw new Error("云端工作区数据格式无效。");
      }

      const database = await this.readDatabase();
      const currentUpdatedAt = database.workspaces[userId]?.updatedAt ?? null;

      if (
        expectedUpdatedAt !== undefined &&
        currentUpdatedAt !== expectedUpdatedAt
      ) {
        throw new WorkspaceConflictError(currentUpdatedAt);
      }

      const stored = {
        updatedAt: Math.max(now, (currentUpdatedAt ?? 0) + 1),
        workspace,
      };
      database.workspaces[userId] = stored;
      await this.writeDatabase(database);
      return stored;
    });
```

</details>

#### 缺口

- 多设备同时编辑和断网恢复未运行。
  **影响**：不能给出无覆盖或自动恢复保证。
  **进一步探讨**：两个隔离客户端基于同一版本各编辑不同便签后提交，比较最终内容和错误提示。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Markdown如何变为图片或资源包，失败如何呈现？

**研究主题**：功能与机制、依赖、兼容与流程、效果与总成本

#### 完整回答

图片导出不是纯浏览器本地截图。前端把Markdown、主题和页脚发给/api/export，为每次尝试建20秒AbortController，最多初次加三次重试；5xx和429可重试，主题响应头不匹配则拒绝。服务端解析文本、规范图片URL、启动Playwright页面，填入编辑器，等待资源与布局稳定再截取note-sheet，最后持久化PNG并返回路径、URL和主题。浏览器下载或手机分享是输出一步，不表示源稿已云同步。

这种复用实际前端布局的办法使预览和截图有共同渲染来源，值得借鉴；浏览器二进制、页面资源与后端版本却成为必要条件。服务端在持久化后返回，前端超时无法证明服务端未完成，再次尝试可能另生导出文件；本次不把它当支付类事务，却需计入资源和人工清理成本。截图排版、超长文档、字体/图片最终显示未做视觉验收，不能声称导出效果已一致。网站出口另生成ZIP，并不在此接口自动部署公网。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/export-config.ts:1-3](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/src/lib/export-config.ts#L1-L3)

客户端重试与时限常量。

```text
export const EXPORT_RETRY_LIMIT = 3;
export const EXPORT_RETRY_BASE_DELAY_MS = 600;
export const EXPORT_REQUEST_TIMEOUT_MS = 20_000;
```

**依据 2 · 源码核查**：[src/lib/export.ts:181-244](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/src/lib/export.ts#L181-L244)

导出请求、响应主题核对及重试。

<details>
<summary>查看原文（64行）</summary>

```text
async function tryServerExport(
  markdown: string,
  filename: string,
  theme: NoteCardThemeId,
  footer: ExportFooterOptions,
): Promise<Blob> {
  const maxAttempts = EXPORT_RETRY_LIMIT + 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = globalThis.setTimeout(() => {
      controller.abort();
    }, EXPORT_REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename,
          footerBrand: footer.footerBrand,
          footerLogoUrl: footer.footerLogoUrl,
          footerVia: footer.footerVia,
          markdown,
          theme,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new ExportError(await readExportErrorMessage(response), {
          status: response.status,
          retriable: response.status >= 500 || response.status === 429,
          attempts: attempt,
        });
      }

      const renderedTheme = response.headers.get("X-Export-Theme");

      if (renderedTheme !== theme) {
        throw new ExportError(
          "导出服务尚未更新到当前主题版本，请重启后端服务后再保存图片。",
          {
            status: 409,
            retriable: false,
            attempts: attempt,
          },
        );
      }

      return response.blob();
    } catch (error) {
      const normalizedError = normalizeExportError(error, attempt);

      if (attempt >= maxAttempts || !shouldRetryExport(normalizedError)) {
        throw normalizedError;
      }

      await wait(EXPORT_RETRY_BASE_DELAY_MS * attempt);
    } finally {
      globalThis.clearTimeout(timeoutId);
    }
```

</details>

**依据 3 · 源码核查**：[server/index.ts:3429-3452](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/server/index.ts#L3429-L3452)

Playwright实际填充、等待和截图。

<details>
<summary>查看原文（24行）</summary>

```text
async function renderNotePng(markdown: string, renderUrl: string): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage({
    deviceScaleFactor: exportDeviceScaleFactor,
    viewport: { width: 1280, height: 960 },
  });

  try {
    await page.goto(renderUrl, {
      waitUntil: "domcontentloaded",
    });

    const editor = page.locator("#markdown-editor");
    await editor.waitFor();
    await editor.fill(markdown);
    await waitForAssets(page);

    const noteSheet = page.locator(".note-sheet");
    await noteSheet.waitFor();
    await waitForStableHeight(noteSheet);
    return await screenshotNoteSheet(noteSheet);
  } finally {
    await page.close();
  }
```

</details>

**依据 4 · 源码核查**：[server/index.ts:4885-4925](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/server/index.ts#L4885-L4925)

PNG持久化后回传，以及浏览器缺失提示。

<details>
<summary>查看原文（41行）</summary>

```text
app.post(
  "/api/export",
  async (
    request: Request<Record<string, never>, unknown, ExportRequestBody>,
    response: Response,
  ) => {
    try {
      const body = request.body || {};
      const theme = resolveTheme(body);
      const renderUrl = getRenderUrl(request, theme, resolveFooterConfig(body));
      const markdown = normalizeRenderableImageUrls(
        await resolveMarkdown(body),
        request,
        renderUrl,
      );
      const requestedFilename = resolveExportFilename(body.filename);

      const pngBuffer = await renderNotePng(markdown, renderUrl);
      const storedExport = await persistExport(request, requestedFilename, pngBuffer);

      response.setHeader("Content-Type", "image/png");
      response.setHeader("Content-Disposition", `inline; filename="${storedExport.filename}"`);
      response.setHeader("X-Export-Path", storedExport.path);
      response.setHeader("X-Export-Url", storedExport.url);
      response.setHeader("X-Export-Theme", theme);
      response.send(pngBuffer);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to export note image";
      const isBrowserInstallError =
        message.includes("Executable doesn't exist") ||
        message.includes("Please run the following command");

      console.error("Export request failed:", error);

      response.status(error instanceof UnsupportedExportThemeError ? 400 : 500).json({
        error: message,
        hint: isBrowserInstallError
          ? "Run `npx playwright install chromium` on this machine."
          : undefined,
      });
```

</details>

**依据 5 · 源码核查**：[server/site-publishing/route.ts:25-47](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/server/site-publishing/route.ts#L25-L47)

网站生成返回ZIP而非直接发布。

<details>
<summary>查看原文（23行）</summary>

```text
    running.add(user.id);
    const controller = new AbortController();
    const deadline = setTimeout(() => controller.abort(), 120_000);
    const disconnect = () => { if (!response.writableFinished) controller.abort(); };
    response.on("close", disconnect);
    try {
      const entries = await buildSiteEntries(parsed, {
        rootDirectory: options.rootDirectory, signal: controller.signal,
        readImage: createSiteImageReader({ imagesDirectory: options.imagesDirectory, publicDirectory: options.publicDirectory, publicOrigin: options.publicOrigin(request) }),
      });
      controller.signal.throwIfAborted();
      const buffer = options.createZip(entries);
      response.setHeader("Content-Type", "application/zip");
      response.setHeader("Content-Disposition", 'attachment; filename="notes-hugo-site.zip"');
      response.setHeader("X-Content-Type-Options", "nosniff");
      response.send(buffer);
    } catch (error) {
      if (response.destroyed) return;
      response.status(controller.signal.aborted ? 504 : 422).json({ error: controller.signal.aborted ? "网站生成超时，请减少便签或图片后重试。" : error instanceof Error ? error.message : "网站生成失败，请重试。" });
    } finally {
      clearTimeout(deadline);
      response.off("close", disconnect);
      running.delete(user.id);
```

</details>

#### 缺口

- 没有导出视觉验收与资源使用记录。
  **影响**：不能量化长图合格率、速度和单位成本。
  **进一步探讨**：以带中文、代码、图片和长文的样本核对预览/PNG，记录资源与重试残留。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 登录、导入和公众号/网站出口是否有明确边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

部署默认不能被理解为全站强制登录。compose把REQUIRE_LOGIN默认设为false；中间件只在开启时统一限制非公开API，各专用接口仍可有独立登录要求。公众号文章导入即使全站匿名模式也先确认authenticated，再验证URL、配额并返回预览；网站ZIP接口要求同源和账号，还限制并发与120秒时限。不能把匿名演示模式直接作为私有团队部署配置。

需区分三种外部行为。/api/wechat准备可粘贴文章，可能上传图片；/api/wechat/draft则要求同源、登录用户及该账号公众号配置，取得token、上传正文图片和封面，再调用addWechatDraft写入远端草稿。它是有副作用的发布准备步骤，不等于正式群发，也不是纯本地预览。网站出口buildSiteEntries后返回ZIP供用户后续部署，不因栏目叫“网站发布”就声称已托管。本文未调用这些接口；账号权限、外部服务可用性与重复草稿处理均不由静态链路证明。

#### 证据与依据

**依据 1 · 源码核查**：[docker-compose.yml:28-39](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/docker-compose.yml#L28-L39)

默认匿名开关和持久化卷。

<details>
<summary>查看原文（12行）</summary>

```text
      SUPERADMIN: ${SUPERADMIN:-}
      SUPERADMINPASSWORD: ${SUPERADMINPASSWORD:-}
      SESSION_SECRET: ${SESSION_SECRET:-}
      REQUIRE_LOGIN: ${REQUIRE_LOGIN:-false}
      WECHAT_IMPORT_ENABLED: ${WECHAT_IMPORT_ENABLED:-true}
      ANONYMOUS_DAILY_UPLOAD_LIMIT: ${ANONYMOUS_DAILY_UPLOAD_LIMIT:-500}
      OPENAI_API_KEY: ${OPENAI_API_KEY:-}
      OPENAI_BASE_URL: ${OPENAI_BASE_URL:-}
      OPENAI_MODEL: ${OPENAI_MODEL:-}
    volumes:
      - ./storage/images:/app/storage/images
      - ./storage/data:/app/storage/data
```

</details>

**依据 2 · 源码核查**：[server/index.ts:4131-4148](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/server/index.ts#L4131-L4148)

统一登录中间件条件。

<details>
<summary>查看原文（18行）</summary>

```text
app.use(async (request: Request, response: Response, next: NextFunction) => {
  if (
    !requireLogin ||
    !request.path.startsWith("/api/") ||
    isPublicApiRequestWhenLoginRequired(request)
  ) {
    next();
    return;
  }

  if (!(await getWorkspaceUser(request))) {
    response.status(401).json({
      error: "此服务已开启强制登录，请先登录账号。",
    });
    return;
  }

  next();
```

</details>

**依据 3 · 源码核查**：[server/wechat-import/route.ts:25-57](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/server/wechat-import/route.ts#L25-L57)

导入专用认证、URL与配额。

<details>
<summary>查看原文（33行）</summary>

```text
  return async (request, response) => {
    try {
      const identity = await options.getRateIdentity(request);

      if (identity.kind !== "authenticated") {
        throw new WechatImportError("AUTH_REQUIRED");
      }

      if (!(options.isEnabled ?? isWechatImportEnabled)()) {
        throw new WechatImportError("IMPORT_DISABLED");
      }

      const url = request.body && typeof request.body === "object"
        ? (request.body as { url?: unknown }).url
        : undefined;

      if (typeof url !== "string") {
        throw new WechatImportError("INVALID_URL");
      }

      // Only authenticated accounts can import; invalid URLs do not use quota.
      const parsed = parseWechatArticleInput(url);

      if (!parsed.ok) {
        throw new WechatImportError("INVALID_URL", parsed.message);
      }

      if (!options.limiter.consume(identity.key, identity.kind)) {
        throw new WechatImportError("RATE_LIMITED");
      }

      const result = await options.preview(parsed.url, request);
      response.json(result);
```

</details>

**依据 4 · 源码核查**：[server/site-publishing/route.ts:15-29](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/server/site-publishing/route.ts#L15-L29)

网站接口同源、身份、并发和时限。

<details>
<summary>查看原文（15行）</summary>

```text
  return async (request: Request, response: Response): Promise<void> => {
    response.setHeader("Cache-Control", "no-store");
    if (!options.isSameOrigin(request)) { response.status(403).json({ error: "请从本站打开网站发布面板。" }); return; }
    const user = await options.getUser(request, response);
    if (!user) return;
    if (running.has(user.id) || running.size >= 2) { response.status(429).json({ error: "已有网站导出正在进行，请稍后再试。" }); return; }
    let parsed;
    try { parsed = validateSiteExportRequest(request.body); } catch (error) {
      response.status(400).json({ error: error instanceof Error ? error.message : "网站设置不正确。" }); return;
    }
    running.add(user.id);
    const controller = new AbortController();
    const deadline = setTimeout(() => controller.abort(), 120_000);
    const disconnect = () => { if (!response.writableFinished) controller.abort(); };
    response.on("close", disconnect);
```

</details>

**依据 5 · 源码核查**：[server/index.ts:5107-5119](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/server/index.ts#L5107-L5119)

文章准备可能暂存上传资源。

<details>
<summary>查看原文（13行）</summary>

```text
    try {
      const body = request.body || {};
      const theme = resolveTheme(body);
      const markdown = await resolveMarkdown(body);
      const authenticatedUser = await getWorkspaceUser(request);
      response.json(
        await prepareWechatArticle(markdown, {
          footer: resolveFooterConfig(body),
          publicBaseUrl: getPublicBaseUrl(request),
          temporaryUploads: !authenticatedUser,
          theme,
        }),
      );
```

</details>

**依据 6 · 源码核查**：[server/index.ts:5156-5222](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/server/index.ts#L5156-L5222)

草稿外部写入全链路。

<details>
<summary>查看原文（67行）</summary>

```text
    if (!isSameOriginRequest(request)) {
      response.status(403).json({ error: "请从当前便签页面发布公众号草稿。" });
      return;
    }

    const user = await requireNoteServiceUser(request, response);

    if (!user) {
      return;
    }

    const startedAt = performance.now();
    let stageStartedAt = startedAt;
    const timings: Record<string, number> = {};
    const recordStage = (name: string) => {
      const now = performance.now();
      timings[name] = Math.round(now - stageStartedAt);
      stageStartedAt = now;
    };

    try {
      const configuration = await notesDataStore.getWechatConfiguration(user.id);

      if (!configuration) {
        response.status(409).json({
          error: "请先在设置中配置并连通当前账号的公众号 AppID 和 AppSecret。",
        });
        return;
      }

      const body = request.body || {};
      const theme = resolveTheme(body);
      const markdown = await resolveMarkdown(body);
      const publicBaseUrl = getPublicBaseUrl(request);
      const prepared = prepareWechatDraftArticle(
        markdown,
        resolveFooterConfig(body),
        theme,
      );
      assertWechatDraftContentLimits(prepared.html);
      recordStage("prepare");
      const accessToken = await getWechatAccessToken(configuration);
      recordStage("token");
      const content = await replaceDraftContentImages(
        prepared.html,
        accessToken,
        publicBaseUrl,
        prepared.sourceByPlaceholder,
        collectMarkdownImageSources(markdown)[0],
      );
      assertWechatDraftContentLimits(content.html);
      recordStage("images");
      const thumbMediaId = await uploadDraftCover(
        markdown,
        accessToken,
        publicBaseUrl,
        theme,
        content.permanentImagesBySource,
        content.coverImage,
      );
      recordStage("cover");
      const title = getWechatDraftTitle(markdown);
      const mediaId = await addWechatDraft(accessToken, {
        content: content.html,
        thumbMediaId,
        title,
      });
```

</details>

#### 缺口

- 公众号权限、草稿写入失败与重放语义未执行核对。
  **影响**：不能承诺一键对外发布成功或没有重复草稿。
  **进一步探讨**：测试账号以唯一标记检查外部返回mediaId及失败后实际草稿状态，避免不明结果直接重试。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用条件、总成本和未来验证是什么？

**研究主题**：采用判断、效果与总成本、新假设与验证、贡献与相对优势

#### 完整回答

适合以单人、单活动编辑端为主的Markdown作者，在保留原稿副本的条件下小范围试用主题导出。相比手工排版再截图，实际代码把主题检查、资源等待、截图和下载串在一起；有可控试用路径，尚无相同任务下节时或质量胜出证据。多设备同时编辑应暂缓，公网部署先明确登录、存储、备份与资源权限；公众号和网站出口应分别审批其外部写入步骤，不从生成图片推导自动发布授权。

首次成本是Node/构建、Playwright浏览器、后端和存储配置；持续有计算、图片及可选模型/对象存储费用，恢复涉及云冲突、导出重试和本地稿比对，金额与人工耗时未知。退出可导出Markdown/资源并保留源稿，但完整迁移是否保留全部元信息未验证。由Q02可提出未验证改进：让所有Web写入强制携带云版本，并在冲突时保留双方副本、让用户选择合并，可能比当前可选前提版本降低静默覆盖。它会增加冲突处理操作，需用双端不同便签编辑、同便签冲突、断网后重连验证；任何一方修改无提示消失即否定有效性。

#### 证据与依据

**依据 1 · 源码核查**：[src/lib/auth.ts:214-227](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/src/lib/auth.ts#L214-L227)

改进假设来自实际缺省前提版本。

<details>
<summary>查看原文（14行）</summary>

```text
export function saveCloudWorkspace(
  workspace: NoteWorkspace,
): Promise<CloudWorkspace> {
  return requestJson<CloudWorkspace>(
    "/api/workspace",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workspace }),
    },
    "保存云端便签失败。",
  );
```

</details>

**依据 2 · 源码核查**：[server/auth.ts:938-954](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/server/auth.ts#L938-L954)

已有可复用版本比较和保存机制。

<details>
<summary>查看原文（17行）</summary>

```text
      const database = await this.readDatabase();
      const currentUpdatedAt = database.workspaces[userId]?.updatedAt ?? null;

      if (
        expectedUpdatedAt !== undefined &&
        currentUpdatedAt !== expectedUpdatedAt
      ) {
        throw new WorkspaceConflictError(currentUpdatedAt);
      }

      const stored = {
        updatedAt: Math.max(now, (currentUpdatedAt ?? 0) + 1),
        workspace,
      };
      database.workspaces[userId] = stored;
      await this.writeDatabase(database);
      return stored;
```

</details>

**依据 3 · 源码核查**：[src/lib/export.ts:220-233](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/src/lib/export.ts#L220-L233)

主题一致检查可支撑受控导出试用。

<details>
<summary>查看原文（14行）</summary>

```text
      const renderedTheme = response.headers.get("X-Export-Theme");

      if (renderedTheme !== theme) {
        throw new ExportError(
          "导出服务尚未更新到当前主题版本，请重启后端服务后再保存图片。",
          {
            status: 409,
            retriable: false,
            attempts: attempt,
          },
        );
      }

      return response.blob();
```

</details>

**依据 4 · 源码核查**：[docker-compose.yml:17-39](https://github.com/zhaoolee/notes/blob/878cfab47a87183524d7f0ddd6b7b791181c0801/docker-compose.yml#L17-L39)

首次与持续资源及凭据条件。

<details>
<summary>查看原文（23行）</summary>

```text
    environment:
      IMAGE_STORAGE_DIR: /app/storage/images
      DATA_STORAGE_DIR: /app/storage/data
      QINIU_ACCESS_KEY: ${QINIU_ACCESS_KEY:-}
      QINIU_SECRET_KEY: ${QINIU_SECRET_KEY:-}
      QINIU_BUCKET: ${QINIU_BUCKET:-}
      QINIU_DOMAIN: ${QINIU_DOMAIN:-}
      QINIU_PREFIX: ${QINIU_PREFIX:-}
      QINIU_UPLOAD_TIMEOUT_MS: ${QINIU_UPLOAD_TIMEOUT_MS:-30000}
      QINIU_UPLOAD_URL: ${QINIU_UPLOAD_URL:-}
      QINIU_UPLOAD_URLS: ${QINIU_UPLOAD_URLS:-}
      SUPERADMIN: ${SUPERADMIN:-}
      SUPERADMINPASSWORD: ${SUPERADMINPASSWORD:-}
      SESSION_SECRET: ${SESSION_SECRET:-}
      REQUIRE_LOGIN: ${REQUIRE_LOGIN:-false}
      WECHAT_IMPORT_ENABLED: ${WECHAT_IMPORT_ENABLED:-true}
      ANONYMOUS_DAILY_UPLOAD_LIMIT: ${ANONYMOUS_DAILY_UPLOAD_LIMIT:-500}
      OPENAI_API_KEY: ${OPENAI_API_KEY:-}
      OPENAI_BASE_URL: ${OPENAI_BASE_URL:-}
      OPENAI_MODEL: ${OPENAI_MODEL:-}
    volumes:
      - ./storage/images:/app/storage/images
      - ./storage/data:/app/storage/data
```

</details>

#### 缺口

- 未来冲突处理方案未实现，效果和接受度未知。
  **影响**：不能把假设计为本应用已实现贡献。
  **进一步探讨**：观察真实单人多端频率，再以当前版与强制版本原型比较丢失、人工修复和退出成本。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
