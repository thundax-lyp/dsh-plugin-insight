# dsh-right-click-menu

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[9976d21](https://github.com/AL1ghtm3ter/dsh-right-click-menu/tree/9976d213318032c6f128e3affa5d1b873cd47871)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在 DSH Web 的文件树、聊天路径和链接上提供上下文菜单与文件操作。

> **核心亮点**：把文件树与聊天路径映射为同一操作菜单，利用既有宿主预览/打开能力，减少手工复制路径；增量在目标识别与 UI 接线，不是新文件协议。详见[Q01](#research-q01)。

> **风险与缺陷**：host 仅要求绝对路径，save-as/write-text 可写任意宿主可达目标且覆盖；read/raw 全量读入后才裁剪或返回，展示限长不等于内存限长。请求授权不是资源授权。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 右键菜单在什么场景减少了哪些操作，何时算合格交付？](#detail-section-11)
  - [Q02 · 前端识别目标到宿主读写的调用链与降级如何工作？](#detail-section-12)
  - [Q03 · 宿主路径与文件体积限制是否足以限制读写范围和覆盖？](#detail-section-13)
  - [Q04 · 安装、持续操作和错误恢复有哪些现金/资源与人工负担？](#detail-section-14)
  - [Q05 · 哪些局部边界可复用，怎样验证资源级授权与流式读取改进？](#detail-section-15)
  - [Q06 · 当前版本应如何试用，哪些操作须保持人工检查？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户从已识别文件/链接快速预览、复制、系统打开或另存；目标正确与覆盖处理是合格条件。详见[Q01](#research-q01)。

系统文件管理器与 DSH 现有 session/workspaceFiles API 可做底层操作；插件提供上下文识别和统一入口，不替代文件授权。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 目标识别/菜单 | 从文件树、聊天路径与链接启动动作 | 误识别仍需用户核目标 |
| 预览/系统打开 | 复用宿主已有 API | 可选能力与系统应用可用性不同 |
| 读取/另存 | 通过 host 路由操作文件 | 仅请求级信任，绝对路径/覆盖/大文件需谨慎 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web client/slots/locale | 菜单必需 | 注册 UI 与文案 | 无菜单 |
| webServer/connection | 本包文件路由必需 | 探测/读写与请求信任 | host 路由不挂载 |
| session/workspaceFiles/目录选择器 | 部分动作需要 | 预览、打开、保存降级 | 对应菜单项可能不可用 |
| 目标检查与备份 | 安全使用需要 | 防误覆盖和范围误判 | 成功执行也可能错目标 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在隔离目录确认插件两半加载 | 菜单和路由均可用 |
| 选择 | 对文件/链接右键核识别目标 | 无关位置仍是原生菜单 |
| 执行 | 小文件预览/复制，保存前核目标与覆盖 | 结果路径/内容与预期一致 |
| 异常 | 用户停止并从备份恢复误写 | 原件可恢复且定位原因 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH Web client/host 能力；金额未知 | 安装、核路由和菜单/权限；耗时未知 | 部分动作依赖可选宿主 API |
| 持续使用 | DOM 识别、文件 IO、raw 带宽/内存；资源未知 | 核路径和覆盖、处理降级；频率未知 | 文本/原始读取均先全量缓冲 |
| 失败恢复 | 备份或撤回误拷贝；金额未知 | 定位覆盖、权限、应用打开失败；耗时未知 | 没有资源级授权/自动回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 目标菜单 | 文件树/消息路径/链接识别与按能力展示 | 误识别率和节省时间 |
| 文件读写 | host 探测、读取、另存、文本写入 | 会话范围、误覆盖和大文件峰值 |
| 回退 | 现有 session/workspaceFiles API 与浏览器保存 | 不同客户端一致性 |

> **思考**：host 仅要求绝对路径，save-as/write-text 可写任意宿主可达目标且覆盖；read/raw 全量读入后才裁剪或返回，展示限长不等于内存限长。请求授权不是资源授权。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把文件树与聊天路径映射为同一操作菜单，利用既有宿主预览/打开能力，减少手工复制路径；增量在目标识别与 UI 接线，不是新文件协议。详见[Q01](#research-q01)。

把文件树与聊天路径映射为同一操作菜单，利用既有宿主预览/打开能力，减少手工复制路径；增量在目标识别与 UI 接线，不是新文件协议。详见[Q01](#research-q01)。

请求级信任围栏、精确路由和能力降级可借鉴；文件授权、覆盖和内存约束须下沉到 host 资源级。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

host 仅要求绝对路径，save-as/write-text 可写任意宿主可达目标且覆盖；read/raw 全量读入后才裁剪或返回，展示限长不等于内存限长。请求授权不是资源授权。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，在隔离目录先做预览、复制和小文件保存；写入前核目标及覆盖，敏感/大文件暂不依赖菜单保证。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持菜单、路由和请求级防线；资源级范围/覆盖/大文件风险是源码推导，未实测真实宿主；改进假设未实现。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、package、lib/index.js、lib/client.js；未安装、执行目标代码或真实 UI/宿主；旧 META 仅复用。
- 下一步：在隔离目录构造跨工作区、软链接、已有目标、取消保存、二进制与大文件，核识别、请求拒绝、目标覆盖、峰值和恢复时间。

**分析版本**

- **仓库**：[AL1ghtm3ter/dsh-right-click-menu](https://github.com/AL1ghtm3ter/dsh-right-click-menu)
- **版本号**：0.3.1（[固定提交 9976d21](https://github.com/AL1ghtm3ter/dsh-right-click-menu/tree/9976d213318032c6f128e3affa5d1b873cd47871)）
- **版本日期**：2026-10-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是每项动作绑定会话文件授权与 realpath，写入做覆盖确认/独占创建，读取流式限量；跨根/软链/已有目标/大文件夹具核安全和可用性。详见[Q05](#research-q05)。

在隔离目录构造跨工作区、软链接、已有目标、取消保存、二进制与大文件，核识别、请求拒绝、目标覆盖、峰值和恢复时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 710 | — | — | 6321 |
| .js | source | 2 | 1662 | 1356 | 223 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AL1ghtm3ter/dsh-right-click-menu/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-right-click-menu 是否可靠地将文件/链接右键转成目标操作，宿主读写路由的范围与体积边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 右键菜单在什么场景减少了哪些操作，何时算合格交付？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户在 DSH 文件树、聊天路径或超链接右键，选预览、系统打开、复制路径/内容、另存为或链接动作。合格交付是目标识别正确，找不到文件时不误操作，选中的动作按用户预期作用于明确文件/链接；菜单出现和复制成功不代表文件权限按会话收窄。原有办法是复制路径后用文件树/系统管理器或宿主已有 session/workspaceFiles API；插件增量是跨文件树、聊天文本和链接的识别与同一菜单、按环境回退既有 API。它没有发明文件系统操作或系统应用协议，也无误操作率/耗时对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-53](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/README.md#L16-L53)

作者列场景、菜单项与原生菜单保留规则。

<details>
<summary>查看原文（38行）</summary>

```text
## 能做什么

在 DSH 里对着文件、文件路径或链接点右键，弹出的菜单只给这一类对象真正能做的事。

| 在哪右键 | 怎么认出来的 | 菜单里有什么 |
|---|---|---|
| 右侧栏「文件」标签里的一行 | 该行自带的 `data-files-path` / `data-files-entry` 标记 | 文件动作 |
| 对话消息里的文件路径（行内代码、正文都行） | 指针下的那段文字，先问过宿主、确认文件真在 | 文件动作 |
| 聊天渲染出来的文件提及 | 提及按钮的 `title` 属性 | 文件动作 |
| 超链接 | 锚点的 `href` | 链接动作；链接本身指向文件时，再补上文件动作 |

**文件动作**

| 菜单项 | 点了会怎样 |
|---|---|
| 在 DSH 中预览 / 在文件树中展开 | 用 DSH 自带的预览打开文件；文件夹则是展开 |
| 在默认应用中打开 | 交给系统默认程序（`session.openWorkspacePath`） |
| 打开方式 ▸ | 列出宿主查到的关联程序，一个一个点 |
| 在资源管理器中打开 | 在文件管理器里定位到这个文件 |
| 复制路径 | 绝对路径进剪贴板 |
| 复制相对路径 | 相对当前会话工作区的路径 |
| 复制文件名 | 路径最后一段 |
| 复制文件内容 | 读出文件内容进剪贴板（上限 1 MiB，二进制文件会拒绝） |
| 另存为… | 能用浏览器保存对话框就用；否则让你选个目录，再由宿主拷过去 |

**链接动作**

| 菜单项 | 点了会怎样 |
|---|---|
| 在侧边栏中打开 | 在右侧栏的浏览器标签页里打开 |
| 在外部浏览器中打开 | 交给系统默认浏览器 |
| 复制链接地址 | 复制 `href` |
| 复制链接文字 | 复制链接显示出来的那段文字 |
| 复制为 Markdown 链接 | 复制成 `[文字](href)`，可以直接粘进文档或提示词 |

链接指向文件时——`dsh-resource://file/…`、`file://`、`api/file?path=…` 这类地址——同一个菜单里既有链接动作，也有完整的文件动作。

**其它位置一律不管。** 既不是文件也不是链接的地方点右键，照样弹浏览器原生菜单：选文字、消息操作、代码块、JSON 复制按钮全都照旧。碰到长得像路径、但宿主查不到的内容，会直接告诉你「工作区里没有找到 <路径>」，不会把这次右键悄悄吞掉。
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1007-1142](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/client.js#L1007-L1142)

从树行和消息候选解析文件路径。

<details>
<summary>查看原文（136行）</summary>

```text
       * Resolve a file-tree row: the row itself carries the absolute path, and
       * the tree root carries the workspace root, so no Host round trip is
       * needed to know that the file exists.
       */
      const treeTarget = (row) => {
        const path = row.getAttribute("data-files-path");
        if (path === null || path === "") return undefined;
        const root = row.closest("[data-files-state='tree']")?.getAttribute("data-files-root") ?? undefined;
        const separator = separatorOf(root ?? path);
        const absolutePath = isAbsolutePath(path)
          ? withSeparator(path, separator)
          : root === undefined
            ? path
            : joinPath(root, path);
        const context = contextOf(row);
        return {
          name: baseName(path),
          kind: row.getAttribute("data-files-entry") === "directory" ? "directory" : "file",
          absolutePath,
          relativePath: relativeTo(root ?? context?.cwd, absolutePath),
          sessionId: context?.sessionId,
          cwd: context?.cwd ?? root,
          rowButton: row.querySelector("button") ?? undefined
        };
      };

      /**
       * The same `@file` search the composer uses, for a bare name that is not
       * a workspace-root path: an exact candidate wins, then a candidate whose
       * path ends with the name.
       */
      const searchWorkspace = async (sessionId, token, signal) => {
        const references = remotes.references;
        if (references === undefined || typeof references.list !== "function") return undefined;
        let list;
        try {
          list = unwrap(await references.list(sessionId, token, signal));
        } catch {
          return undefined;
        }
        if (!Array.isArray(list) || list.length === 0) return undefined;
        const wanted = normalizePath(token);
        const usable = list.filter((item) => item !== null && typeof item === "object" && typeof item.path === "string");
        const picked =
          usable.find((item) => normalizePath(item.path) === wanted) ??
          usable.find((item) => normalizePath(item.path).endsWith(`/${wanted}`));
        if (picked === undefined) return undefined;
        return { path: picked.path, kind: picked.kind === "directory" ? "directory" : "file" };
      };

      /**
       * Resolve one path to an absolute path and a file kind, using every source
       * the Host offers: the `/stat` route for absolute paths anywhere it can
       * reach, the `workspaceFiles` Remote for workspace-relative ones (which
       * also reports the authoritative absolute path), and the composer's own
       * `@file` search for a bare name that is not a workspace-root path.
       * @returns `{ absolutePath, fileKind }`, or undefined when nothing proves
       * that the path exists.
       */
      const resolveFile = async (sessionId, path, cwd) => {
        const files = remotes.files;
        const signal = new AbortController().signal;
        if (isAbsolutePath(path)) {
          const host = await hostPost("/stat", { path });
          if (host !== undefined) {
            if (host.exists !== true) return undefined;
            return { absolutePath: path, fileKind: host.kind === "directory" ? "directory" : "file" };
          }
          // No route: an absolute path inside the workspace still resolves remotely.
          if (files === undefined || sessionId === undefined) return undefined;
          let value;
          try {
            value = unwrap(await files.stat(sessionId, path, signal));
          } catch {
            return undefined;
          }
          if (value === undefined || value === null || typeof value.absolutePath !== "string") return undefined;
          return { absolutePath: value.absolutePath, fileKind: "file" };
        }
        if (files !== undefined && sessionId !== undefined) {
          let value;
          try {
            value = unwrap(await files.stat(sessionId, path, signal));
          } catch {
            value = undefined;
          }
          if (value !== undefined && value !== null && typeof value.absolutePath === "string") {
            let fileKind = "file";
            if (!FILE_TAIL.test(path)) {
              try {
                const listing = unwrap(await files.list(sessionId, path, signal));
                if (listing !== undefined && listing !== null) fileKind = "directory";
              } catch {}
            }
            return { absolutePath: value.absolutePath, fileKind };
          }
          const found = await searchWorkspace(sessionId, path, signal);
          if (found !== undefined) {
            let resolved;
            try {
              const statValue = unwrap(await files.stat(sessionId, found.path, signal));
              if (statValue !== undefined && statValue !== null && typeof statValue.absolutePath === "string") {
                resolved = statValue.absolutePath;
              }
            } catch {}
            if (resolved === undefined && cwd !== undefined) resolved = joinPath(cwd, found.path);
            if (resolved !== undefined) return { absolutePath: resolved, fileKind: found.kind };
          }
        }
        if (cwd !== undefined) {
          const guess = joinPath(cwd, path);
          const host = await hostPost("/stat", { path: guess });
          if (host !== undefined && host.exists === true) {
            return { absolutePath: guess, fileKind: host.kind === "directory" ? "directory" : "file" };
          }
        }
        return undefined;
      };

      /** The Session context of an element, without failing the right-click when it is unavailable. */
      const contextOfSafe = (element) => {
        try {
          return contextOf(element);
        } catch {
          // A surface whose sidebar controller refuses an element: treat the
          // Session context as unknown rather than failing the right-click.
          return undefined;
        }
      };

      /** One resolved file, shaped as a menu target. */
      const fileTargetOf = (sessionId, cwd, resolved) => ({
        name: baseName(resolved.absolutePath),
        kind: resolved.fileKind,
        absolutePath: resolved.absolutePath,
        relativePath: cwd === undefined ? undefined : relativeTo(cwd, resolved.absolutePath),
```

</details>

**依据 3 · 源码核查**：[lib/client.js:701-793](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/client.js#L701-L793)

内容读取和另存选择的客户端调用分支。

<details>
<summary>查看原文（93行）</summary>

```text
      /** Read one file as text: this package's route first, the Session Remote as the fallback. */
      const readContents = async (target) => {
        const host = await hostPost("/read", { path: target.absolutePath });
        if (host !== undefined) {
          if (host.binary === true) return { binary: true, size: host.size };
          if (typeof host.text !== "string") return undefined;
          return { text: host.text, truncated: host.truncated === true, size: host.size };
        }
        const sessionId = target.sessionId;
        const files = remotes.files;
        if (files === undefined || sessionId === undefined) return undefined;
        const signal = new AbortController().signal;
        const relative = target.relativePath ?? target.absolutePath;
        const parts = [];
        let offset = 1;
        let size;
        for (let page = 0; page < 12; page += 1) {
          let value;
          try {
            value = unwrap(await files.read(sessionId, relative, { offset }, signal));
          } catch {
            return undefined;
          }
          if (value === undefined || typeof value.text !== "string") return undefined;
          parts.push(value.text);
          size = value.bytes;
          if (value.eof === true || value.lines === 0) break;
          offset += value.lines;
        }
        return { text: parts.filter((part) => part !== "").join("\n"), size };
      };

      /** The raw bytes of one file, for a browser-side Save As. */
      const fetchBytes = async (target) => {
        try {
          const response = await fetch(`/dsh-right-click-menu/raw?path=${encodeURIComponent(target.absolutePath)}`);
          if (response.ok) return await response.blob();
        } catch {}
        try {
          const response = await fetch(`api/file?path=${encodeURIComponent(target.absolutePath)}`);
          if (response.ok) return await response.blob();
        } catch {}
        const files = remotes.files;
        if (files !== undefined && target.sessionId !== undefined) {
          try {
            const value = unwrap(
              await files.readBytes(
                target.sessionId,
                target.relativePath ?? target.absolutePath,
                {},
                new AbortController().signal
              )
            );
            if (value?.data !== undefined) return new Blob([value.data]);
          } catch {}
        }
        return undefined;
      };

      /** Write a copy of one file somewhere else, with a real Save-As dialog when the browser has one. */
      const saveAs = async (target) => {
        if (typeof window.showSaveFilePicker === "function") {
          let handle;
          try {
            handle = await window.showSaveFilePicker({ suggestedName: target.name });
          } catch (error) {
            if (error !== null && typeof error === "object" && error.name === "AbortError") return { cancelled: true };
            handle = undefined;
          }
          if (handle !== undefined) {
            const blob = await fetchBytes(target);
            if (blob === undefined) return { failed: true };
            try {
              const writable = await handle.createWritable();
              await writable.write(blob);
              await writable.close();
              return { path: handle.name };
            } catch {
              return { failed: true };
            }
          }
        }
        const picker = remotes.directoryPicker;
        if (picker !== undefined && typeof picker.pick === "function") {
          let directory;
          try {
            directory = unwrap(await picker.pick(new AbortController().signal));
          } catch {
            directory = undefined;
          }
          if (directory === null || directory === undefined) return { cancelled: true };
          const destination = joinPath(directory, target.name);
          const written = await hostPost("/save-as", { from: target.absolutePath, to: destination });
```

</details>

#### 缺口

- 未在真实 UI 任务测路径识别正确率和操作时间
  **影响**：不能证明节时或误操作下降
  **进一步探讨**：同一组文件任务对比手工路径操作与菜单，记录目标/时长/恢复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 前端识别目标到宿主读写的调用链与降级如何工作？

**研究主题**：功能与机制

#### 完整回答

客户端监听 document contextmenu，区分文件树属性、对话文本路径和链接；可用时先经 host /stat 或宿主 workspaceFiles 核目标，然后按能力显示菜单。预览/系统打开主要走宿主现有 session API，读取和另存走本包 /read、/raw、/save-as、/write-text，浏览器保存能力不可用时走宿主拷贝。host 在 webServer 与 connection 都注入后注册精确路由；每个请求先问 connection.requestRejection，JSON POST 还限制方法、媒体类型和 64KiB 请求体。它是请求级信任栅栏，不是按 session/workspace 对每个路径的授权。前端正常路径会选会话相对表示，但 host 路由接受绝对路径，最终安全界限以 host 为准。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1058-1142](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/client.js#L1058-L1142)

前端多来源识别路径与存在检查。

<details>
<summary>查看原文（85行）</summary>

```text
       * Resolve one path to an absolute path and a file kind, using every source
       * the Host offers: the `/stat` route for absolute paths anywhere it can
       * reach, the `workspaceFiles` Remote for workspace-relative ones (which
       * also reports the authoritative absolute path), and the composer's own
       * `@file` search for a bare name that is not a workspace-root path.
       * @returns `{ absolutePath, fileKind }`, or undefined when nothing proves
       * that the path exists.
       */
      const resolveFile = async (sessionId, path, cwd) => {
        const files = remotes.files;
        const signal = new AbortController().signal;
        if (isAbsolutePath(path)) {
          const host = await hostPost("/stat", { path });
          if (host !== undefined) {
            if (host.exists !== true) return undefined;
            return { absolutePath: path, fileKind: host.kind === "directory" ? "directory" : "file" };
          }
          // No route: an absolute path inside the workspace still resolves remotely.
          if (files === undefined || sessionId === undefined) return undefined;
          let value;
          try {
            value = unwrap(await files.stat(sessionId, path, signal));
          } catch {
            return undefined;
          }
          if (value === undefined || value === null || typeof value.absolutePath !== "string") return undefined;
          return { absolutePath: value.absolutePath, fileKind: "file" };
        }
        if (files !== undefined && sessionId !== undefined) {
          let value;
          try {
            value = unwrap(await files.stat(sessionId, path, signal));
          } catch {
            value = undefined;
          }
          if (value !== undefined && value !== null && typeof value.absolutePath === "string") {
            let fileKind = "file";
            if (!FILE_TAIL.test(path)) {
              try {
                const listing = unwrap(await files.list(sessionId, path, signal));
                if (listing !== undefined && listing !== null) fileKind = "directory";
              } catch {}
            }
            return { absolutePath: value.absolutePath, fileKind };
          }
          const found = await searchWorkspace(sessionId, path, signal);
          if (found !== undefined) {
            let resolved;
            try {
              const statValue = unwrap(await files.stat(sessionId, found.path, signal));
              if (statValue !== undefined && statValue !== null && typeof statValue.absolutePath === "string") {
                resolved = statValue.absolutePath;
              }
            } catch {}
            if (resolved === undefined && cwd !== undefined) resolved = joinPath(cwd, found.path);
            if (resolved !== undefined) return { absolutePath: resolved, fileKind: found.kind };
          }
        }
        if (cwd !== undefined) {
          const guess = joinPath(cwd, path);
          const host = await hostPost("/stat", { path: guess });
          if (host !== undefined && host.exists === true) {
            return { absolutePath: guess, fileKind: host.kind === "directory" ? "directory" : "file" };
          }
        }
        return undefined;
      };

      /** The Session context of an element, without failing the right-click when it is unavailable. */
      const contextOfSafe = (element) => {
        try {
          return contextOf(element);
        } catch {
          // A surface whose sidebar controller refuses an element: treat the
          // Session context as unknown rather than failing the right-click.
          return undefined;
        }
      };

      /** One resolved file, shaped as a menu target. */
      const fileTargetOf = (sessionId, cwd, resolved) => ({
        name: baseName(resolved.absolutePath),
        kind: resolved.fileKind,
        absolutePath: resolved.absolutePath,
        relativePath: cwd === undefined ? undefined : relativeTo(cwd, resolved.absolutePath),
```

</details>

**依据 2 · 源码核查**：[lib/client.js:701-793](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/client.js#L701-L793)

读取/保存与宿主 API 回退。

<details>
<summary>查看原文（93行）</summary>

```text
      /** Read one file as text: this package's route first, the Session Remote as the fallback. */
      const readContents = async (target) => {
        const host = await hostPost("/read", { path: target.absolutePath });
        if (host !== undefined) {
          if (host.binary === true) return { binary: true, size: host.size };
          if (typeof host.text !== "string") return undefined;
          return { text: host.text, truncated: host.truncated === true, size: host.size };
        }
        const sessionId = target.sessionId;
        const files = remotes.files;
        if (files === undefined || sessionId === undefined) return undefined;
        const signal = new AbortController().signal;
        const relative = target.relativePath ?? target.absolutePath;
        const parts = [];
        let offset = 1;
        let size;
        for (let page = 0; page < 12; page += 1) {
          let value;
          try {
            value = unwrap(await files.read(sessionId, relative, { offset }, signal));
          } catch {
            return undefined;
          }
          if (value === undefined || typeof value.text !== "string") return undefined;
          parts.push(value.text);
          size = value.bytes;
          if (value.eof === true || value.lines === 0) break;
          offset += value.lines;
        }
        return { text: parts.filter((part) => part !== "").join("\n"), size };
      };

      /** The raw bytes of one file, for a browser-side Save As. */
      const fetchBytes = async (target) => {
        try {
          const response = await fetch(`/dsh-right-click-menu/raw?path=${encodeURIComponent(target.absolutePath)}`);
          if (response.ok) return await response.blob();
        } catch {}
        try {
          const response = await fetch(`api/file?path=${encodeURIComponent(target.absolutePath)}`);
          if (response.ok) return await response.blob();
        } catch {}
        const files = remotes.files;
        if (files !== undefined && target.sessionId !== undefined) {
          try {
            const value = unwrap(
              await files.readBytes(
                target.sessionId,
                target.relativePath ?? target.absolutePath,
                {},
                new AbortController().signal
              )
            );
            if (value?.data !== undefined) return new Blob([value.data]);
          } catch {}
        }
        return undefined;
      };

      /** Write a copy of one file somewhere else, with a real Save-As dialog when the browser has one. */
      const saveAs = async (target) => {
        if (typeof window.showSaveFilePicker === "function") {
          let handle;
          try {
            handle = await window.showSaveFilePicker({ suggestedName: target.name });
          } catch (error) {
            if (error !== null && typeof error === "object" && error.name === "AbortError") return { cancelled: true };
            handle = undefined;
          }
          if (handle !== undefined) {
            const blob = await fetchBytes(target);
            if (blob === undefined) return { failed: true };
            try {
              const writable = await handle.createWritable();
              await writable.write(blob);
              await writable.close();
              return { path: handle.name };
            } catch {
              return { failed: true };
            }
          }
        }
        const picker = remotes.directoryPicker;
        if (picker !== undefined && typeof picker.pick === "function") {
          let directory;
          try {
            directory = unwrap(await picker.pick(new AbortController().signal));
          } catch {
            directory = undefined;
          }
          if (directory === null || directory === undefined) return { cancelled: true };
          const destination = joinPath(directory, target.name);
          const written = await hostPost("/save-as", { from: target.absolutePath, to: destination });
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1331-1335](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/client.js#L1331-L1335)

上下文菜单监听器。

```text
        document.addEventListener("contextmenu", onContextMenu, true);
        return () => {
          document.removeEventListener("contextmenu", onContextMenu, true);
        };
      }, "right-click-menu: contextmenu listener");
```

**依据 4 · 源码核查**：[lib/index.js:137-155](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/index.js#L137-L155)

connection 信任拒绝与路由装配。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * Register the routes behind the connection trust fence. The fence and route
 * carrier are injected as a scoped fiber so a composition without them simply
 * keeps this plugin inert instead of failing it.
 */
export function apply(ctx) {
  ctx.inject(['webServer', 'connection'], (scope) => {
    /** Answer an untrusted/unauthenticated request; true when it was rejected. */
    const rejected = (req, res) => {
      const rejection = scope.connection.requestRejection(req)
      if (rejection === undefined) return false
      res.statusCode = rejection
      res.end()
      return true
    }

    /**
     * Wrap one JSON POST route: fence, method, media type, body ceiling, field
     * validation, then the operation's own handler.
```

</details>

**依据 5 · 源码核查**：[lib/index.js:219-303](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/index.js#L219-L303)

host 的 raw、stat、read、save-as 和 write-text。

<details>
<summary>查看原文（85行）</summary>

```text
    /** Raw bytes for one absolute path: the source of a browser-side Save As. */
    scope.effect(
      () =>
        scope.webServer.register({
          kind: 'exact',
          path: `${ROUTE_BASE}/raw`,
          handler: async (req, res) => {
            if (rejected(req, res)) return
            if (req.method !== 'GET') {
              sendMethodNotAllowed(res, 'GET')
              return
            }
            const path = new URL(String(req.url), 'http://localhost').searchParams.get('path') ?? ''
            if (path === '' || !isAbsolute(path)) {
              sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
              return
            }
            const info = await describePath(path)
            if (!info.exists || info.kind !== 'file') {
              sendJson(res, 404, { code: 'not-found', message: path })
              return
            }
            let bytes
            try {
              bytes = await readFile(path)
            } catch (error) {
              sendJson(res, 500, { code: 'failed', message: error instanceof Error ? error.message : String(error) })
              return
            }
            res.statusCode = 200
            res.setHeader('content-type', CONTENT_TYPES[extname(path).toLowerCase()] ?? 'application/octet-stream')
            res.setHeader('cache-control', 'no-store')
            res.setHeader('content-length', String(bytes.byteLength))
            res.end(bytes)
          }
        }),
      `right-click-menu: GET ${ROUTE_BASE}/raw`
    )

    post('/stat', ['path'], async ({ path }, res) => {      if (!isAbsolute(path)) {
        sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
        return
      }
      sendJson(res, 200, { path, ...(await describePath(path)) })
    })

    post('/read', ['path'], async ({ path }, res) => {
      if (!isAbsolute(path)) {
        sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
        return
      }
      const result = await readTextFile(path, MAX_READ_BYTES)
      if (!result.ok) {
        sendJson(res, result.code === 'not-found' ? 404 : 400, { code: result.code, message: path })
        return
      }
      sendJson(res, 200, { path, ...result })
    })

    post('/save-as', ['from', 'to'], async ({ from, to }, res) => {
      if (!isAbsolute(from) || !isAbsolute(to)) {
        sendJson(res, 400, { code: 'bad-request', message: 'from and to must be absolute paths' })
        return
      }
      const source = await describePath(from)
      if (!source.exists || source.kind !== 'file') {
        sendJson(res, 404, { code: 'not-found', message: from })
        return
      }
      await mkdir(dirname(to), { recursive: true })
      await copyFile(from, to)
      sendJson(res, 200, { path: to, size: (await describePath(to)).size })
    })

    /** Write UTF-8 text to an absolute path: the fallback when no byte source is reachable. */
    post('/write-text', ['path', 'text'], async ({ path, text }, res) => {
      if (!isAbsolute(path)) {
        sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
        return
      }
      await mkdir(dirname(path), { recursive: true })
      await writeFile(path, text, 'utf8')
      sendJson(res, 200, { path, size: (await describePath(path)).size })
    })
  })
```

</details>

#### 缺口

- 未在不同 DSH 客户端/权限模式执行
  **影响**：不能确认能力降级与请求围栏对所有部署一致
  **进一步探讨**：在无可选 API/拒绝状态/浏览器保存不支持等环境逐项验收

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 宿主路径与文件体积限制是否足以限制读写范围和覆盖？

**研究主题**：缺陷与关键质疑

#### 完整回答

host 的 /raw、/stat、/read、/save-as、/write-text 基本只要求绝对路径，未见工作区 realpath 包含检查或逐资源能力票据；因此通过请求围栏的调用可以操作宿主可访问的其他绝对路径。save-as 会 mkdir 后 copyFile，默认覆盖既有目标；write-text 也直接 writeFile，没有源/目标版本与覆盖确认。readTextFile 先 readFile 整个文件，再切 1MiB；raw 直接 readFile 全部，响应长度是在加载后知道的。故展示上限不等于内存上限，大文件可能造成资源峰值。此处仅静态源码风险，尚未在真实宿主尝试越范围读写或大文件压测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:124-135](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/index.js#L124-L135)

读取整文件后裁剪。

<details>
<summary>查看原文（12行）</summary>

```text
/** Read one file as text, refusing directories and flagging binary/oversized content. */
async function readTextFile(path, limit) {
  const info = await describePath(path)
  if (!info.exists) return { ok: false, code: 'not-found' }
  if (info.kind !== 'file') return { ok: false, code: 'not-a-file' }
  const bytes = await readFile(path)
  const truncated = bytes.byteLength > limit
  const slice = truncated ? bytes.subarray(0, limit) : bytes
  const text = slice.toString('utf8')
  const binary = text.slice(0, 8000).includes('\u0000')
  return { ok: true, text: binary ? '' : text, binary, truncated, size: info.size }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:219-253](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/index.js#L219-L253)

raw 整文件读取和返回。

<details>
<summary>查看原文（35行）</summary>

```text
    /** Raw bytes for one absolute path: the source of a browser-side Save As. */
    scope.effect(
      () =>
        scope.webServer.register({
          kind: 'exact',
          path: `${ROUTE_BASE}/raw`,
          handler: async (req, res) => {
            if (rejected(req, res)) return
            if (req.method !== 'GET') {
              sendMethodNotAllowed(res, 'GET')
              return
            }
            const path = new URL(String(req.url), 'http://localhost').searchParams.get('path') ?? ''
            if (path === '' || !isAbsolute(path)) {
              sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
              return
            }
            const info = await describePath(path)
            if (!info.exists || info.kind !== 'file') {
              sendJson(res, 404, { code: 'not-found', message: path })
              return
            }
            let bytes
            try {
              bytes = await readFile(path)
            } catch (error) {
              sendJson(res, 500, { code: 'failed', message: error instanceof Error ? error.message : String(error) })
              return
            }
            res.statusCode = 200
            res.setHeader('content-type', CONTENT_TYPES[extname(path).toLowerCase()] ?? 'application/octet-stream')
            res.setHeader('cache-control', 'no-store')
            res.setHeader('content-length', String(bytes.byteLength))
            res.end(bytes)
          }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:258-303](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/index.js#L258-L303)

绝对路径检查、任意目标 mkdir/copyFile/writeFile。

<details>
<summary>查看原文（46行）</summary>

```text
    post('/stat', ['path'], async ({ path }, res) => {      if (!isAbsolute(path)) {
        sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
        return
      }
      sendJson(res, 200, { path, ...(await describePath(path)) })
    })

    post('/read', ['path'], async ({ path }, res) => {
      if (!isAbsolute(path)) {
        sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
        return
      }
      const result = await readTextFile(path, MAX_READ_BYTES)
      if (!result.ok) {
        sendJson(res, result.code === 'not-found' ? 404 : 400, { code: result.code, message: path })
        return
      }
      sendJson(res, 200, { path, ...result })
    })

    post('/save-as', ['from', 'to'], async ({ from, to }, res) => {
      if (!isAbsolute(from) || !isAbsolute(to)) {
        sendJson(res, 400, { code: 'bad-request', message: 'from and to must be absolute paths' })
        return
      }
      const source = await describePath(from)
      if (!source.exists || source.kind !== 'file') {
        sendJson(res, 404, { code: 'not-found', message: from })
        return
      }
      await mkdir(dirname(to), { recursive: true })
      await copyFile(from, to)
      sendJson(res, 200, { path: to, size: (await describePath(to)).size })
    })

    /** Write UTF-8 text to an absolute path: the fallback when no byte source is reachable. */
    post('/write-text', ['path', 'text'], async ({ path, text }, res) => {
      if (!isAbsolute(path)) {
        sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
        return
      }
      await mkdir(dirname(path), { recursive: true })
      await writeFile(path, text, 'utf8')
      sendJson(res, 200, { path, size: (await describePath(path)).size })
    })
  })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:142-151](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/index.js#L142-L151)

信任栅栏仅按请求处理。

<details>
<summary>查看原文（10行）</summary>

```text
export function apply(ctx) {
  ctx.inject(['webServer', 'connection'], (scope) => {
    /** Answer an untrusted/unauthenticated request; true when it was rejected. */
    const rejected = (req, res) => {
      const rejection = scope.connection.requestRejection(req)
      if (rejection === undefined) return false
      res.statusCode = rejection
      res.end()
      return true
    }
```

</details>

#### 缺口

- 未实测宿主授权前提、跨工作区路径与大文件峰值
  **影响**：不能宣称可由任意网页访问或量化泄漏/覆盖规模
  **进一步探讨**：隔离目录构造跨工作区、软链接、已有目标和大文件夹具，核拒绝与内存

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、持续操作和错误恢复有哪些现金/资源与人工负担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

首次需要 DSH web 的 slots/locale 与 host webServer/connection，部分动作再依赖 session/sidebar/workspaceFiles/目录选择器；包作者称尚未发 npm，建议 GitHub 或本地包安装，这一发布状态仅属固定 README/旧 META，当前取得性未重查。持续成本主要是 DOM 路径识别、不同宿主 API 降级维护、文件 I/O 和 raw 大文件内存/带宽，不涉及模型调用本身。用户需要确认路径、另存目标、覆盖和权限；失败恢复需找回被覆盖文件、撤回误拷贝、定位权限/应用打开失败。没有性能、误操作率和人工恢复时间数据，不能填零。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:55-87](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/README.md#L55-L87)

作者安装与宿主/客户端验收说明。

<details>
<summary>查看原文（33行）</summary>

````text
## 安装

在网页界面里：侧栏 **Plugins → Add plugin**，粘贴下面任意一条，点 **Install**。

| 来源 | 粘贴这个 |
|---|---|
| GitHub | `github:AL1ghtm3ter/dsh-right-click-menu` |
| Release 压缩包 | `https://github.com/AL1ghtm3ter/dsh-right-click-menu/releases/latest/download/dsh-right-click-menu.tgz` |
| 本地目录 | 该目录的绝对路径，或者打好的 `.tgz` |

这个包**还没发到 npm**。`dsh-right-click-menu` 是它将来用的包名，发布只要两条命令，见[发布](#发布)。

命令行装法（先把 DSH 退干净）：

```sh
dsh plugin --profile <profile> add github:AL1ghtm3ter/dsh-right-click-menu
```

### 给 Agent 的说明

一句话，用户可以直接丢进对话：

> 给 DSH 装上文件右键菜单：调用 `plugin_manager`，`action` 填 `install_bundle`，`target` 填
> `github:AL1ghtm3ter/dsh-right-click-menu`。

Agent 照着这几步做：

1. **装。** `plugin_manager` 的 `action: install_bundle`、`target: github:AL1ghtm3ter/dsh-right-click-menu`。它会用 profile 自己的 pnpm 装好，并把包名写进 `dsh.profile.bundles`。看返回值里的 `application` 字段判断有没有生效：`applied` 是已经跑起来了，`restart-required` 要等下次启动应用。
2. **验宿主半。** 用需要走路由的那几项来验（复制文件内容、另存为…）。匿名请求 `http://<主机>/dsh-right-click-menu/ping` 会先被信任围栏拦下、根本到不了路由，所以它的状态码不能当作路由测试：按路由拦的部署返回 `401`，整台服务器都拦的部署一律 `403`（连不存在的路径也是 `403`）。
3. **验浏览器半。** 用 `cordis_inspect_query` 查 client 的 `Slots`，`listSubTree` 传 `{"root": "shell.overlay"}`，占用列表里应该出现 `right-click-menu`。
4. **告诉用户去哪右键。** 右侧栏「文件」标签、对话消息里的文件路径，或者任意超链接。改过 `lib/client.js` 要刷新页面（Ctrl+R）；改**宿主半**要重启应用。

装的时候不用构建，也没有安装脚本，所以不会弹 `allowBuilds` 授权。
````

</details>

**依据 2 · 源码核查**：[package.json:1-54](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/package.json#L1-L54)

web client/host 打包入口。

<details>
<summary>查看原文（54行）</summary>

```text
{
  "name": "dsh-right-click-menu",
  "version": "0.3.1",
  "description": "Codex-style right-click menu for the DSH web GUI: files, chat file paths, and hyperlinks.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "lib/client.js",
    "cordis.patch.yml",
    "icon.svg",
    "locale/*.json",
    "README.md",
    "README.en.md",
    "LOCALIZATION.md"
  ],
  "keywords": [
    "dsh",
    "dsh-plugin",
    "dsh-bundle",
    "cordis",
    "context-menu",
    "file-menu",
    "right-click"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/AL1ghtm3ter/dsh-right-click-menu.git"
  },
  "homepage": "https://github.com/AL1ghtm3ter/dsh-right-click-menu#readme",
  "bugs": {
    "url": "https://github.com/AL1ghtm3ter/dsh-right-click-menu/issues"
  },
  "license": "MIT",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:137-155](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/index.js#L137-L155)

host 服务依赖。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * Register the routes behind the connection trust fence. The fence and route
 * carrier are injected as a scoped fiber so a composition without them simply
 * keeps this plugin inert instead of failing it.
 */
export function apply(ctx) {
  ctx.inject(['webServer', 'connection'], (scope) => {
    /** Answer an untrusted/unauthenticated request; true when it was rejected. */
    const rejected = (req, res) => {
      const rejection = scope.connection.requestRejection(req)
      if (rejection === undefined) return false
      res.statusCode = rejection
      res.end()
      return true
    }

    /**
     * Wrap one JSON POST route: fence, method, media type, body ceiling, field
     * validation, then the operation's own handler.
```

</details>

**依据 4 · 源码核查**：[lib/index.js:219-303](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/index.js#L219-L303)

文件 IO 与副作用。

<details>
<summary>查看原文（85行）</summary>

```text
    /** Raw bytes for one absolute path: the source of a browser-side Save As. */
    scope.effect(
      () =>
        scope.webServer.register({
          kind: 'exact',
          path: `${ROUTE_BASE}/raw`,
          handler: async (req, res) => {
            if (rejected(req, res)) return
            if (req.method !== 'GET') {
              sendMethodNotAllowed(res, 'GET')
              return
            }
            const path = new URL(String(req.url), 'http://localhost').searchParams.get('path') ?? ''
            if (path === '' || !isAbsolute(path)) {
              sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
              return
            }
            const info = await describePath(path)
            if (!info.exists || info.kind !== 'file') {
              sendJson(res, 404, { code: 'not-found', message: path })
              return
            }
            let bytes
            try {
              bytes = await readFile(path)
            } catch (error) {
              sendJson(res, 500, { code: 'failed', message: error instanceof Error ? error.message : String(error) })
              return
            }
            res.statusCode = 200
            res.setHeader('content-type', CONTENT_TYPES[extname(path).toLowerCase()] ?? 'application/octet-stream')
            res.setHeader('cache-control', 'no-store')
            res.setHeader('content-length', String(bytes.byteLength))
            res.end(bytes)
          }
        }),
      `right-click-menu: GET ${ROUTE_BASE}/raw`
    )

    post('/stat', ['path'], async ({ path }, res) => {      if (!isAbsolute(path)) {
        sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
        return
      }
      sendJson(res, 200, { path, ...(await describePath(path)) })
    })

    post('/read', ['path'], async ({ path }, res) => {
      if (!isAbsolute(path)) {
        sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
        return
      }
      const result = await readTextFile(path, MAX_READ_BYTES)
      if (!result.ok) {
        sendJson(res, result.code === 'not-found' ? 404 : 400, { code: result.code, message: path })
        return
      }
      sendJson(res, 200, { path, ...result })
    })

    post('/save-as', ['from', 'to'], async ({ from, to }, res) => {
      if (!isAbsolute(from) || !isAbsolute(to)) {
        sendJson(res, 400, { code: 'bad-request', message: 'from and to must be absolute paths' })
        return
      }
      const source = await describePath(from)
      if (!source.exists || source.kind !== 'file') {
        sendJson(res, 404, { code: 'not-found', message: from })
        return
      }
      await mkdir(dirname(to), { recursive: true })
      await copyFile(from, to)
      sendJson(res, 200, { path: to, size: (await describePath(to)).size })
    })

    /** Write UTF-8 text to an absolute path: the fallback when no byte source is reachable. */
    post('/write-text', ['path', 'text'], async ({ path, text }, res) => {
      if (!isAbsolute(path)) {
        sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
        return
      }
      await mkdir(dirname(path), { recursive: true })
      await writeFile(path, text, 'utf8')
      sendJson(res, 200, { path, size: (await describePath(path)).size })
    })
  })
```

</details>

#### 缺口

- 当前发布可得性和真实宿主资源/恢复耗时未测
  **影响**：不能估算每次合格操作总成本
  **进一步探讨**：隔离安装并计文件读写、内存、人工目标确认与回滚时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些局部边界可复用，怎样验证资源级授权与流式读取改进？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

精确路由、请求信任检查、JSON 请求体上限和按能力降级是可复用接线；客户端保留非文件处原生菜单也减少界面干扰。但可信请求仍可传任意绝对路径，读取先全量缓冲。未验证方向是给每项文件动作携带会话资源授权/根范围，并对 realpath 和软链接目标复核；写入需展示目标是否存在并获得覆盖确认或用独占创建；读取使用流式限量，超限前不分配整文件缓冲。最小实验比较跨工作区、符号链接、已有目标、取消保存、二进制与大文件的拒绝正确率、误覆盖、内存峰值和额外操作耗时。若授权显著妨碍合法跨工作区打开，应提供明确的用户授权路径，而非静默放宽。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:137-155](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/index.js#L137-L155)

现有请求信任边界。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * Register the routes behind the connection trust fence. The fence and route
 * carrier are injected as a scoped fiber so a composition without them simply
 * keeps this plugin inert instead of failing it.
 */
export function apply(ctx) {
  ctx.inject(['webServer', 'connection'], (scope) => {
    /** Answer an untrusted/unauthenticated request; true when it was rejected. */
    const rejected = (req, res) => {
      const rejection = scope.connection.requestRejection(req)
      if (rejection === undefined) return false
      res.statusCode = rejection
      res.end()
      return true
    }

    /**
     * Wrap one JSON POST route: fence, method, media type, body ceiling, field
     * validation, then the operation's own handler.
```

</details>

**依据 2 · 源码核查**：[lib/index.js:124-135](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/index.js#L124-L135)

文本读取全量后裁剪。

<details>
<summary>查看原文（12行）</summary>

```text
/** Read one file as text, refusing directories and flagging binary/oversized content. */
async function readTextFile(path, limit) {
  const info = await describePath(path)
  if (!info.exists) return { ok: false, code: 'not-found' }
  if (info.kind !== 'file') return { ok: false, code: 'not-a-file' }
  const bytes = await readFile(path)
  const truncated = bytes.byteLength > limit
  const slice = truncated ? bytes.subarray(0, limit) : bytes
  const text = slice.toString('utf8')
  const binary = text.slice(0, 8000).includes('\u0000')
  return { ok: true, text: binary ? '' : text, binary, truncated, size: info.size }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:258-303](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/index.js#L258-L303)

绝对路径与覆盖链。

<details>
<summary>查看原文（46行）</summary>

```text
    post('/stat', ['path'], async ({ path }, res) => {      if (!isAbsolute(path)) {
        sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
        return
      }
      sendJson(res, 200, { path, ...(await describePath(path)) })
    })

    post('/read', ['path'], async ({ path }, res) => {
      if (!isAbsolute(path)) {
        sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
        return
      }
      const result = await readTextFile(path, MAX_READ_BYTES)
      if (!result.ok) {
        sendJson(res, result.code === 'not-found' ? 404 : 400, { code: result.code, message: path })
        return
      }
      sendJson(res, 200, { path, ...result })
    })

    post('/save-as', ['from', 'to'], async ({ from, to }, res) => {
      if (!isAbsolute(from) || !isAbsolute(to)) {
        sendJson(res, 400, { code: 'bad-request', message: 'from and to must be absolute paths' })
        return
      }
      const source = await describePath(from)
      if (!source.exists || source.kind !== 'file') {
        sendJson(res, 404, { code: 'not-found', message: from })
        return
      }
      await mkdir(dirname(to), { recursive: true })
      await copyFile(from, to)
      sendJson(res, 200, { path: to, size: (await describePath(to)).size })
    })

    /** Write UTF-8 text to an absolute path: the fallback when no byte source is reachable. */
    post('/write-text', ['path', 'text'], async ({ path, text }, res) => {
      if (!isAbsolute(path)) {
        sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
        return
      }
      await mkdir(dirname(path), { recursive: true })
      await writeFile(path, text, 'utf8')
      sendJson(res, 200, { path, size: (await describePath(path)).size })
    })
  })
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1331-1335](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/client.js#L1331-L1335)

前端事件接线。

```text
        document.addEventListener("contextmenu", onContextMenu, true);
        return () => {
          document.removeEventListener("contextmenu", onContextMenu, true);
        };
      }, "right-click-menu: contextmenu listener");
```

#### 缺口

- 资源级授权和流式读取尚未实现/对照
  **影响**：不能把越界减少或性能收益算当前贡献
  **进一步探讨**：实现隔离原型后按固定路径/文件夹具测安全与可用性

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前版本应如何试用，哪些操作须保持人工检查？

**研究主题**：采用判断

#### 完整回答

可以在隔离目录使用右键菜单做预览、复制和小文件另存；每次保存前核源、目标及是否覆盖，并备份原件。涉及不属于当前会话工作区的绝对路径、敏感文件和大型二进制时，不应依赖菜单是否显示来判断授权与安全。成功提示只表示接口执行，不能证明目标正确。建议 observe，待 host 资源级边界和流式限量得到夹具验证后再扩大使用。本轮没有安装或执行目标插件，也没有真实 UI 验收。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:219-303](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/index.js#L219-L303)

host 可读写路径与资源限制。

<details>
<summary>查看原文（85行）</summary>

```text
    /** Raw bytes for one absolute path: the source of a browser-side Save As. */
    scope.effect(
      () =>
        scope.webServer.register({
          kind: 'exact',
          path: `${ROUTE_BASE}/raw`,
          handler: async (req, res) => {
            if (rejected(req, res)) return
            if (req.method !== 'GET') {
              sendMethodNotAllowed(res, 'GET')
              return
            }
            const path = new URL(String(req.url), 'http://localhost').searchParams.get('path') ?? ''
            if (path === '' || !isAbsolute(path)) {
              sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
              return
            }
            const info = await describePath(path)
            if (!info.exists || info.kind !== 'file') {
              sendJson(res, 404, { code: 'not-found', message: path })
              return
            }
            let bytes
            try {
              bytes = await readFile(path)
            } catch (error) {
              sendJson(res, 500, { code: 'failed', message: error instanceof Error ? error.message : String(error) })
              return
            }
            res.statusCode = 200
            res.setHeader('content-type', CONTENT_TYPES[extname(path).toLowerCase()] ?? 'application/octet-stream')
            res.setHeader('cache-control', 'no-store')
            res.setHeader('content-length', String(bytes.byteLength))
            res.end(bytes)
          }
        }),
      `right-click-menu: GET ${ROUTE_BASE}/raw`
    )

    post('/stat', ['path'], async ({ path }, res) => {      if (!isAbsolute(path)) {
        sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
        return
      }
      sendJson(res, 200, { path, ...(await describePath(path)) })
    })

    post('/read', ['path'], async ({ path }, res) => {
      if (!isAbsolute(path)) {
        sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
        return
      }
      const result = await readTextFile(path, MAX_READ_BYTES)
      if (!result.ok) {
        sendJson(res, result.code === 'not-found' ? 404 : 400, { code: result.code, message: path })
        return
      }
      sendJson(res, 200, { path, ...result })
    })

    post('/save-as', ['from', 'to'], async ({ from, to }, res) => {
      if (!isAbsolute(from) || !isAbsolute(to)) {
        sendJson(res, 400, { code: 'bad-request', message: 'from and to must be absolute paths' })
        return
      }
      const source = await describePath(from)
      if (!source.exists || source.kind !== 'file') {
        sendJson(res, 404, { code: 'not-found', message: from })
        return
      }
      await mkdir(dirname(to), { recursive: true })
      await copyFile(from, to)
      sendJson(res, 200, { path: to, size: (await describePath(to)).size })
    })

    /** Write UTF-8 text to an absolute path: the fallback when no byte source is reachable. */
    post('/write-text', ['path', 'text'], async ({ path, text }, res) => {
      if (!isAbsolute(path)) {
        sendJson(res, 400, { code: 'bad-request', message: 'path must be absolute' })
        return
      }
      await mkdir(dirname(path), { recursive: true })
      await writeFile(path, text, 'utf8')
      sendJson(res, 200, { path, size: (await describePath(path)).size })
    })
  })
```

</details>

**依据 2 · 作者声明**：[README.md:27-53](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/README.md#L27-L53)

作者的菜单效果声明。

<details>
<summary>查看原文（27行）</summary>

```text
**文件动作**

| 菜单项 | 点了会怎样 |
|---|---|
| 在 DSH 中预览 / 在文件树中展开 | 用 DSH 自带的预览打开文件；文件夹则是展开 |
| 在默认应用中打开 | 交给系统默认程序（`session.openWorkspacePath`） |
| 打开方式 ▸ | 列出宿主查到的关联程序，一个一个点 |
| 在资源管理器中打开 | 在文件管理器里定位到这个文件 |
| 复制路径 | 绝对路径进剪贴板 |
| 复制相对路径 | 相对当前会话工作区的路径 |
| 复制文件名 | 路径最后一段 |
| 复制文件内容 | 读出文件内容进剪贴板（上限 1 MiB，二进制文件会拒绝） |
| 另存为… | 能用浏览器保存对话框就用；否则让你选个目录，再由宿主拷过去 |

**链接动作**

| 菜单项 | 点了会怎样 |
|---|---|
| 在侧边栏中打开 | 在右侧栏的浏览器标签页里打开 |
| 在外部浏览器中打开 | 交给系统默认浏览器 |
| 复制链接地址 | 复制 `href` |
| 复制链接文字 | 复制链接显示出来的那段文字 |
| 复制为 Markdown 链接 | 复制成 `[文字](href)`，可以直接粘进文档或提示词 |

链接指向文件时——`dsh-resource://file/…`、`file://`、`api/file?path=…` 这类地址——同一个菜单里既有链接动作，也有完整的文件动作。

**其它位置一律不管。** 既不是文件也不是链接的地方点右键，照样弹浏览器原生菜单：选文字、消息操作、代码块、JSON 复制按钮全都照旧。碰到长得像路径、但宿主查不到的内容，会直接告诉你「工作区里没有找到 <路径>」，不会把这次右键悄悄吞掉。
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1058-1142](https://github.com/AL1ghtm3ter/dsh-right-click-menu/blob/9976d213318032c6f128e3affa5d1b873cd47871/lib/client.js#L1058-L1142)

前端存在性识别不能替代 host 授权。

<details>
<summary>查看原文（85行）</summary>

```text
       * Resolve one path to an absolute path and a file kind, using every source
       * the Host offers: the `/stat` route for absolute paths anywhere it can
       * reach, the `workspaceFiles` Remote for workspace-relative ones (which
       * also reports the authoritative absolute path), and the composer's own
       * `@file` search for a bare name that is not a workspace-root path.
       * @returns `{ absolutePath, fileKind }`, or undefined when nothing proves
       * that the path exists.
       */
      const resolveFile = async (sessionId, path, cwd) => {
        const files = remotes.files;
        const signal = new AbortController().signal;
        if (isAbsolutePath(path)) {
          const host = await hostPost("/stat", { path });
          if (host !== undefined) {
            if (host.exists !== true) return undefined;
            return { absolutePath: path, fileKind: host.kind === "directory" ? "directory" : "file" };
          }
          // No route: an absolute path inside the workspace still resolves remotely.
          if (files === undefined || sessionId === undefined) return undefined;
          let value;
          try {
            value = unwrap(await files.stat(sessionId, path, signal));
          } catch {
            return undefined;
          }
          if (value === undefined || value === null || typeof value.absolutePath !== "string") return undefined;
          return { absolutePath: value.absolutePath, fileKind: "file" };
        }
        if (files !== undefined && sessionId !== undefined) {
          let value;
          try {
            value = unwrap(await files.stat(sessionId, path, signal));
          } catch {
            value = undefined;
          }
          if (value !== undefined && value !== null && typeof value.absolutePath === "string") {
            let fileKind = "file";
            if (!FILE_TAIL.test(path)) {
              try {
                const listing = unwrap(await files.list(sessionId, path, signal));
                if (listing !== undefined && listing !== null) fileKind = "directory";
              } catch {}
            }
            return { absolutePath: value.absolutePath, fileKind };
          }
          const found = await searchWorkspace(sessionId, path, signal);
          if (found !== undefined) {
            let resolved;
            try {
              const statValue = unwrap(await files.stat(sessionId, found.path, signal));
              if (statValue !== undefined && statValue !== null && typeof statValue.absolutePath === "string") {
                resolved = statValue.absolutePath;
              }
            } catch {}
            if (resolved === undefined && cwd !== undefined) resolved = joinPath(cwd, found.path);
            if (resolved !== undefined) return { absolutePath: resolved, fileKind: found.kind };
          }
        }
        if (cwd !== undefined) {
          const guess = joinPath(cwd, path);
          const host = await hostPost("/stat", { path: guess });
          if (host !== undefined && host.exists === true) {
            return { absolutePath: guess, fileKind: host.kind === "directory" ? "directory" : "file" };
          }
        }
        return undefined;
      };

      /** The Session context of an element, without failing the right-click when it is unavailable. */
      const contextOfSafe = (element) => {
        try {
          return contextOf(element);
        } catch {
          // A surface whose sidebar controller refuses an element: treat the
          // Session context as unknown rather than failing the right-click.
          return undefined;
        }
      };

      /** One resolved file, shaped as a menu target. */
      const fileTargetOf = (sessionId, cwd, resolved) => ({
        name: baseName(resolved.absolutePath),
        kind: resolved.fileKind,
        absolutePath: resolved.absolutePath,
        relativePath: cwd === undefined ? undefined : relativeTo(cwd, resolved.absolutePath),
```

</details>

#### 缺口

- 真实环境的误操作率、恢复成本和授权表现未知
  **影响**：不能给广泛安装建议
  **进一步探讨**：隔离目录先做目标、拒绝、大文件和覆盖测试

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
