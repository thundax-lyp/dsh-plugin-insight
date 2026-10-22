# dock-editor

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[f6e5e08](https://github.com/AKS1st/dock-editor/tree/f6e5e0845c42e2b09a7a8d671a66b331fe094634)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock-editor) [![npm 30d 886](https://img.shields.io/static/v1?label=npm+30d&message=886&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-editor) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-editor)
<!-- END META -->

> **实现功能**：为 dock 文件域增加同工作台的文本查看、编辑、保存与关闭提醒。

> **核心亮点**：将文件域默认查看器、工作台视图、CodeMirror 状态和读写权限连接成小文本编辑流程；高亮和历史主要属于 CodeMirror，上游 dock 提供工作台，增量在集成及写入围栏。详见[Q02](#research-q02)。

> **风险与缺陷**：服务端 fs.write 直接 writeFile，不比较读取版本；外部或另一视图读后改写可能被覆盖。读取绝对路径也不限工作区，不能称作完整读隔离。风险由源码推断，未复现。详见[Q03](#research-q03)。

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
  - [Q01 · 谁需要在 DSH 中编辑文件，合格结果与原有办法是什么？](#detail-section-11)
  - [Q02 · 本插件怎样把文件域、宿主界面和编辑器接起来，相对简单替代增加什么？](#detail-section-12)
  - [Q03 · 读取、写入、未保存提示各自守住什么边界，关键缺口是什么？](#detail-section-13)
  - [Q04 · 安装、生效、日常操作和退出依赖什么？](#detail-section-14)
  - [Q05 · 当前材料能证明哪些效果、资源和人工成本？](#detail-section-15)
  - [Q06 · 现阶段适合谁试用，下一步可验证的新设计是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在 DSH Web 中偶尔修改会话工作区的小型代码、配置和文档；合格结果是完整读取、编辑并核对目标文件保存。工作区外文件只读。

直接替代是 dock-files 只读查看加外部编辑器或终端修改；本插件在已有 dock 环境中增加有限内嵌编辑，完整 IDE 与并发保护不是其当前能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 文本查看与编辑 | 在 dock 浮窗修改小型文本 | 依赖 workbench/files 和 Web；二进制或超限不保存 |
| 搜索、高亮与历史 | 快速查找、编辑代码或普通文本 | 来自 CodeMirror；具体语言由扩展名决定 |
| 保存与关闭提醒 | 写入工作区并提示未保存修改 | 工作区外只读，关闭提醒不检查并发版本 |
| 窗口几何记忆 | 重开同一路径恢复位置大小 | 浏览器 localStorage 可用才持久 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 与 Cordis | 服务端/客户端必需 | 加载路由与 UI | 入口不工作，具体兼容未测 |
| dock-base、dock-files | UI 必需 | workbench 及文件域分派 | 双服务缺失则客户端不注册 |
| React | 编辑视图必需 | 渲染 CodeMirror 包装层 | UI 不激活 |
| CodeMirror 产物 | 构建客户端必需 | 文本编辑、历史和搜索 | 源码安装需完成构建，发布包状态未独立核验 |
| 会话 cwd 与可写工作区 | 保存必需 | 写端路径围栏 | 路径越界拒写；会话信息缺失会回退进程 cwd |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认固定版本、dock 与 dock-files 兼容 | 不能把 optional peer 当可省略运行服务 |
| 加载 | 按作者说明在 web profile 安装并检查 viewer | 文件域能分派 editor；本轮未执行 |
| 编辑 | 用户打开小型文本并检查是否可写 | 二进制、超限或外部路径停止保存 |
| 保存与验收 | 用户保存并回读目标文件 | 错误或外部改写时返回原工具核对 |
| 退出 | 处理 dirty 提示并停用编辑器 | 重要文件先确认已落盘和可恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | dock 系列与浏览器资源；金额未知 | 确认 peer 版本、安装、加载和可写路径 | 无安装耗时或兼容实测 |
| 持续使用 | CodeMirror 客户端体量和内存；实际消耗未知 | 核对保存目标、只读状态与外部变化 | 作者报告 bundle 体量，未测每任务资源 |
| 失败恢复 | 可能需要外部版本库或备份；金额未知 | 比对外部修改与恢复内容 | 无冲突率和恢复工时 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 小文本编辑 | 同工作台的默认 viewer、CodeMirror 和保存路由 | 相对外部编辑器的净节时 |
| 防误写 | 外部路径只读、超限旧文件拒写 | 宿主环境与所有路径条件的实际表现 |
| 关闭提醒 | dirty 同步到 beforeClose | 并发修改的检测与丢失率 |

效果表描述实现机制，不代表本轮做过运行或用户对照。

> **思考**：服务端 fs.write 直接 writeFile，不比较读取版本；外部或另一视图读后改写可能被覆盖。读取绝对路径也不限工作区，不能称作完整读隔离。风险由源码推断，未复现。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将文件域默认查看器、工作台视图、CodeMirror 状态和读写权限连接成小文本编辑流程；高亮和历史主要属于 CodeMirror，上游 dock 提供工作台，增量在集成及写入围栏。详见[Q02](#research-q02)。

将文件域默认查看器、工作台视图、CodeMirror 状态和读写权限连接成小文本编辑流程；高亮和历史主要属于 CodeMirror，上游 dock 提供工作台，增量在集成及写入围栏。详见[Q02](#research-q02)。

服务端独立检查工作区写入、超限文件拒写，客户端再用 writable/truncated 禁保存，职责分层清楚；dirty 同步到工作台关闭钩子可借鉴。读端任意绝对路径属于明确能力和权限边界，sessionId 缺失时的 cwd 回退增加对宿主关联的依赖。直接 writeFile 没有版本比较或冲突恢复，CodeMirror bundle 与第三方功能不能当本项目原创。

#### 跨插件资源契约

dock基座提供视图注册、实例seed、beforeClose与openPath分派；dock-files用资源地址中的sessionId解析cwd和路径后，只把path交给workbench.openPath；dock-editor读取接受绝对路径，写入独立约束session工作区，尺寸检查后直接writeFile，没有读取版本或内容摘要比较。这些控制分别处理界面关闭、资源分派和写入范围，不能替代保存时并发版本检查。由此提出未验证假设，跨插件资源句柄统一携带原会话身份、读写能力和读取版本，保存时比较内容摘要，冲突保留双方内容。可用两个会话与外部改写交错打开/保存，对照现有路径传递，比较错误目标、静默覆盖、冲突处理和恢复工时；若覆盖或恢复成本无改善，则不支持该假设。固定源码支持前述结构和限制，未证明实际发生错误目标，也未验证未来设计的净收益。

依据包括 [AKS1st/dock/src/client/service.ts](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/service.ts#L210-L245)、[AKS1st/dock-files/src/client/openBridge.ts](https://github.com/AKS1st/dock-files/blob/d24224beb8cf024a9c6e79fe97445001d73150b8/src/client/openBridge.ts#L104-L130)、[AKS1st/dock-editor/src/index.ts](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/index.ts#L79-L109)。

<a id="detail-section-5"></a>

### 1.4 主要限制

服务端 fs.write 直接 writeFile，不比较读取版本；外部或另一视图读后改写可能被覆盖。读取绝对路径也不限工作区，不能称作完整读隔离。风险由源码推断，未复现。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可对非关键小文本进行受控试用，保存后回读目标并留版本库或备份；对并发编辑和重要配置沿用有冲突检测的工具。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持工作台内有限文本编辑及写入范围控制；并发保存与真实宿主表现未验证；条件写是未实现假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/client/index.ts、src/client/EditorView.tsx、src/client/CodeMirrorEditor.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定提交 README、package、服务端读写路由、客户端注册、编辑与搜索主路径及完整范围 inventory；未执行目标代码、测试或宿主。
- 下一步：进一步探讨可在隔离工作区做外部改写与双窗口交错保存对照，再对固定 DSH/dock 版本检查路径、只读、关闭与停用；本轮不执行。

**分析版本**

- **仓库**：[AKS1st/dock-editor](https://github.com/AKS1st/dock-editor)
- **版本号**：0.2.2（[固定提交 f6e5e08](https://github.com/AKS1st/dock-editor/tree/f6e5e0845c42e2b09a7a8d671a66b331fe094634)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在读取时产生版本摘要、保存时条件比较并保留冲突双方内容；以交错保存样本比较静默覆盖、误报与恢复工时。这是未实现设计，现有关闭提醒不能替代。详见[Q06](#research-q06)。

进一步探讨可在隔离工作区做外部改写与双窗口交错保存对照，再对固定 DSH/dock 版本检查路径、只读、关闭与停用；本轮不执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 30952 | 26213 | 5076 | — |
| .md | source | 2 | 131 | — | — | 1838 |
| .ts | source | 8 | 1310 | 872 | 348 | — |
| .tsx | source | 3 | 808 | 625 | 129 | — |
| .mjs | source | 1 | 52 | 38 | 12 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock-editor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock-editor/issues?q=is%3Aissue+created%3A2026-09-22T05%3A09%3A34.160Z..2026-10-22T05%3A09%3A34.160Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock-editor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A09%3A34.160Z..2026-10-22T05%3A09%3A34.160Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**在固定提交下判断 dock-editor 的真实增量、读写边界和适合采用的场景。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要在 DSH 中编辑文件，合格结果与原有办法是什么？

**研究主题：**场景与需求

#### 完整回答

适用对象是已经用 dock 与 dock-files 浏览会话文件、需要顺手修改小型代码、配置或文档的 DSH Web 用户。合格任务包括找到目标、完整读取、完成编辑并明确保存到预期文件；若文件是二进制、超过 256 KiB 或位于工作区外，本插件只提供受限查看，不构成合格写入。原有办法是到外部编辑器或终端操作文件，或只用文件查看器阅读。作者把「最佳」当宣传，本次没有同条件用户评价，不能据此排序。README 的安装与功能说明给出使用设想，package 则限定 Web 客户端和 dock 生态；实际用户频率和任务分布未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-8](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/README.md#L5-L8)

作者定位为 dock 文件查看与编辑，最高级宣传未被独立验证。

```text
> **DSH 生态中最好的文本编辑插件 —— 没有之一。** 在 DSH 里看代码、改配置、写文档，dock-editor 就是那个默认答案：撤销重做、Ctrl+S 保存、未保存提醒、二进制检测、窗口几何记忆，一个不少。别的查看器只会展示，dock-editor 让你真正动手改。

dock 系列的文件编辑器插件：注册 `editor` 文件查看器（默认查看器）与对应的编辑器区视图，通过自己的 `/desk-editor` 主机路由读写文件文本内容。

```

**依据 2 · 作者声明**：[README.md:13-23](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/README.md#L13-L23)

作者列编辑、上限、二进制与未保存提醒等场景条件。

<details>
<summary>查看原文（11行）</summary>

```text
## 功能

- **代码/配置文件高亮**：识别扩展名的代码文件（ts/js/json/yaml/toml/ini/css/html/xml/py/sh 等）用 **CodeMirror 6** 编辑——增量解析、原生撤销/重做、行号、括号匹配、实时代码高亮；主题随 DSH 的 `--dsw-alias-*` 变量走。
- **普通文本同样可编辑**：所有文本文件都走 CodeMirror 编辑器（代码类有高亮，普通文本无高亮但在同一个编辑器里），撤销/重做、搜索、括号匹配等编辑能力全量可用。
- **VSCode 风格右上角搜索（与 CM 面板解耦）**：`Ctrl+F` 打开编辑器内搜索浮窗（**右上角**）、`Ctrl+H` 带替换、`F3`/`Ctrl+G`（`Shift` 反向）跳转、`Esc` 关闭。搜索框是**独立浮层**（非 CM `showPanel`），不占编辑器布局——**没有**拖选自动滚动、匹配位置错乱、替换后面板折叠这些毛病。支持实时匹配高亮与 `current/total` 计数、`↑/↓` 上/下一个、`Enter` 下一个（`Shift+Enter` 上一个）；**替换默认折叠**（`⇄` 展开），主题随 DSH 变量走（深浅正常），在其上滚轮**滚动编辑区**而非整个网页。
- **文本查看与编辑**：`Ctrl+S` 保存（视图内全局可用）；`Ctrl+Z` 撤销 / `Ctrl+Y`(或 `Ctrl+Shift+Z`) 重做、`Ctrl+C/V/X/A` 复制粘贴全选，均走编辑器原生键位；另支持 `Alt+↑/↓` 移动行、`Ctrl+/` 注释。
- **自动换行**：工具条提供「换行」切换按钮，**默认开启**；关掉后长行回到水平滚动。
- **未保存提示**：关闭带未保存修改的窗口前弹出确认（通过工作台 `beforeClose` 钩子与 seed dirty 标记）。
- **二进制检测**：读取时探测 NUL 字节，二进制文件显示提示而非乱码。
- **大小上限**：单文件读取上限 256 KiB；超过上限的文件只显示前 256 KiB、**禁用保存**，避免截断原文件（主机端同样校验并拒绝）。
- **悬浮窗几何记忆**：每个文件记住上次悬浮窗口的位置与大小，重新打开时恢复。
```

</details>

**依据 3 · 源码核查**：[package.json:20-26](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/package.json#L20-L26)

包声明客户端 Web 平台。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本插件怎样把文件域、宿主界面和编辑器接起来，相对简单替代增加什么？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

服务端注入 webServer、sessions 和 webRuntime，挂载 /desk-editor 的 fs.read/fs.write；客户端同时注入 workbench 与 files，注册 editor 为默认文件查看器和同 ID 的编辑区视图。视图以 seed 中的路径和 sessionId 请求文本，CodeMirror 管理编辑文档与历史，EditorView 把内容、dirty、保存和关闭元数据同步给工作台。扩展名到语言的高亮和搜索等编辑功能主要来自 CodeMirror，本插件贡献是将文件分派、视图生命周期、读写约束和编辑状态接成可用流程。相对只在 dock-files 中预览或把路径复制到外部编辑器，它增加同工作台内的有限文本改写；相对完整 IDE，它没有项目级重构、语言服务或并发保存保护。不能把第三方 CodeMirror 能力全记为本插件原创。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:260-294](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/index.ts#L260-L294)

服务端注册受信任 POST 路由与 fs.read。

<details>
<summary>查看原文（35行）</summary>

```text
export function apply(ctx: WbContext): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: '/desk-editor',
    handler: async (req, res) => {
      if (!isTrustedRequest(req, ctx.webRuntime.trustedHosts)) {
        writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
        return
      }
      if (req.method !== 'POST') {
        writeJson(res, 405, { ok: false, error: { code: 'bad-request', message: 'method not allowed' } })
        return
      }
      const pathname = new URL(req.url ?? '/', 'http://dsh.internal').pathname
      const method = pathname.startsWith('/desk-editor/') ? pathname.slice('/desk-editor/'.length) : undefined
      if (method === undefined || method.includes('/')) {
        writeError(res, new WbError('not-found', `unknown /desk-editor method "${method}"`, 404))
        return
      }
      try {
        const payload = await readJsonBody(req)
        if (method === 'fs.read') {
          const sessionId = stringOrUndefined(payload, 'sessionId')
          const raw = stringOrUndefined(payload, 'path')
          if (raw === undefined) {
            writeError(res, new WbError('bad-request', 'fs.read requires a "path"', 400))
            return
          }
          const cwd = sessionCwdOf(ctx, sessionId)
          const path = resolveReadPath(raw)
          const file = await readFileText(path, READ_LIMIT_BYTES)
          // Outside-workspace files open read-only: saving stays confined to
          // the session workspace (fs.write), so tell the client up front.
          const writable = await isInsideWorkspace(cwd, path)
          writeOk(res, { file, cwd, writable })
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:45-68](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/client/index.ts#L45-L68)

客户端要求双服务并注册默认 viewer。

<details>
<summary>查看原文（24行）</summary>

```text
/** Client plugin body. */
export function apply(ctx: WorkbenchContext): void {
  const workbench = ctx.get<WorkbenchService>('workbench')
  const files = ctx.get<FilesService>('files')
  // inject guarantees both services are present when this applies; guard
  // anyway so a broken runtime degrades instead of throwing.
  if (workbench === undefined || files === undefined) return

  ctx.effect(() => workbench.registerPlugin({
    id: 'dock-editor',
    title: 'Editor',
    description: 'Text file viewer and editor for the dock file explorer: undo/redo, Ctrl+S save, and unsaved-change confirmation.',
    hasEntry: false,
  }), 'dock-editor: plugin metadata')

  // Register as the file domain's default viewer (id matches the editor view),
  // carrying the explorer's fallback icon for types with no registered icon
  // and no built-in palette entry (neutral gray, same as the explorer's
  // unclassified-file default).
  ctx.effect(() => files.registerFileViewer({
    id: 'editor',
    default: true,
    icon: { color: '#8b949e' },
  }), 'dock-editor: file viewer')
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:79-103](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/client/index.ts#L79-L103)

编辑视图和 beforeClose 读取 dirty 元数据。

<details>
<summary>查看原文（25行）</summary>

```text
  // The view that receives open seeds ({ path, title }). It stays registered
  // as an editor-area view because floating windows resolve their view
  // through this registry; opening itself is always floating (dock-files
  // dispatches { mode: 'floating' }), so no tab-open path remains. The
  // beforeClose hook consumes the dirty flag the view syncs onto seed.meta
  // (updateViewSeed) and confirms closing the window with unsaved edits.
  ctx.effect(() => workbench.registerEditorView({
    id: 'editor',
    title: 'Editor',
    order: 100,
    component: EditorView,
    beforeClose: (request: CloseRequest): boolean | Promise<boolean> => {
      const meta = request.seed?.meta
      if (meta !== null && typeof meta === 'object' && (meta as { dirty?: unknown }).dirty === true) {
        // Themed in-app confirm (replaces the native window.confirm),
        // localized to the active DSH locale (message + button labels).
        const locale = detectLocale(ctx)
        return confirmDialog(translate(locale, 'unsavedCloseConfirm'), {
          ok: translate(locale, 'ok'),
          cancel: translate(locale, 'cancel'),
        })
      }
      return true
    },
  }), 'dock-editor: editor view')
```

</details>

**依据 4 · 源码核查**：[src/client/EditorView.tsx:131-170](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/client/EditorView.tsx#L131-L170)

按 seed 路径加载并接收可写标记。

<details>
<summary>查看原文（40行）</summary>

```text
  // Load the file when the seed path changes.
  useEffect(() => {
    if (path === undefined) return
    let cancelled = false
    lastDirtyRef.current = null
    setContent(null)
    setError(null)
    setDirty(false)
    setTruncated(false)
    setWritable(true)
    setSavedAt(null)
    codeRef.current = null
    setCanUndo(false)
    setCanRedo(false)
    void (async () => {
      try {
        const response = await fetch('/desk-editor/fs.read', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ sessionId, path }),
        })
        const json = (await response.json()) as ReadResponse
        if (json.ok !== true || json.value === undefined) {
          throw new Error(json.error?.message ?? 'read failed')
        }
        if (cancelled) return
        const file = json.value.file
        contentRef.current = file.content
        setContent(file.content)
        setBinary(file.binary)
        setTruncated(file.truncated)
        setSize(file.size)
        setWritable(json.value.writable !== false)
      } catch (cause) {
        if (cancelled) return
        setError(cause instanceof Error ? cause.message : String(cause))
      }
    })()
    return () => { cancelled = true }
  }, [path, sessionId])
```

</details>

**依据 5 · 源码核查**：[src/client/CodeMirrorEditor.tsx:204-245](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/client/CodeMirrorEditor.tsx#L204-L245)

编辑器扩展、历史、搜索、只读与更新回调。

<details>
<summary>查看原文（42行）</summary>

```text
  useEffect(() => {
    const parent = containerRef.current
    if (parent === null) return
    const extensions: Extension[] = [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      highlightSpecialChars(),
      history(),
      foldGutter(),
      drawSelection(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      bracketMatching(),
      syntaxHighlighting(editorHighlightStyle),
      editorTheme,
      ...(language === null ? [] : [language]),
      search(),
      searchMatches,
      readOnlyCompartment.current.of(EditorState.readOnly.of(readOnly)),
      wrapCompartment.current.of(wrap ? EditorView.lineWrapping : []),
      keymap.of([
        { key: 'Mod-f', run: () => { try { openSearchRef.current('find'); return true } catch { return false } } },
        { key: 'Mod-h', run: () => { try { openSearchRef.current('replace'); return true } catch { return false } } },
        { key: 'F3', run: guardedFindNext, shift: guardedFindPrevious, preventDefault: true },
        { key: 'Mod-g', run: guardedFindNext, shift: guardedFindPrevious, preventDefault: true },
        { key: 'Escape', run: () => { try { closeSearchRef.current(); return true } catch { return false } }, preventDefault: true },
        ...historyKeymap,
        ...defaultKeymap,
        ...EXTRA_KEYMAP,
        indentWithTab,
      ]),
      EditorView.contentAttributes.of({ spellcheck: 'false' }),
      EditorView.updateListener.of((update) => {
        try {
          if (update.docChanged) onDocChangedRef.current(update.state.doc.toString())
          onHistoryChangedRef.current({ canUndo: undoDepth(update.state) > 0, canRedo: redoDepth(update.state) > 0 })
          const plugin = update.view.plugin(searchMatches)
          if (plugin !== null) onSearchRef.current({ count: plugin.count, current: plugin.current })
        } catch { /* defensive */ }
      }),
    ]
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 读取、写入、未保存提示各自守住什么边界，关键缺口是什么？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

请求要经过 host/trustedHosts 与同源检查，路由只接受 POST。fs.read 对绝对路径没有会话工作区限制，读取后另算 writable；它不是读隔离。fs.write 用 realpath 检查目标在会话工作区内，超过 256 KiB 的原文件拒写；客户端对外部路径和截断内容也禁保存。dirty 标记通过 updateViewSeed 交给 beforeClose，在关闭前询问。工程上可借鉴前后端双重写保护和与视图生命周期对齐的状态同步。关键缺口是服务端保存直接 writeFile，客户端只发送路径和文本，没有读取版本、mtime 或内容摘要比较。外部程序或另一窗口在读后修改同一文件时，后保存者可能覆盖先前变化；本轮没有执行交错保存，故这是源码推断风险而非已复现事故。sessionId 缺失或无对应 cwd 时会回退 process.cwd，故实际安全边界还依赖宿主会话关联与可信请求模型。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:95-109](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/index.ts#L95-L109)

写入路径按 realpath 相对工作区检查。

<details>
<summary>查看原文（15行）</summary>

```text
async function resolveWorkspacePath(cwd: string, raw: string): Promise<string> {
  const root = await realpath(cwd).catch(() => resolve(cwd))
  requireAbsolute(raw)
  let target: string
  try {
    target = await realpath(raw)
  } catch {
    const parent = await realpath(dirname(raw)).catch(() => dirname(raw))
    target = join(parent, basename(raw))
  }
  const rel = relative(root, target)
  if (rel === '' || (rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel))) {
    return target
  }
  throw new WbError('forbidden', `path is outside the session workspace: "${raw}"`, 403)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:217-231](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/index.ts#L217-L231)

请求信任围栏检查 Host、Fetch Site 与 Origin。

<details>
<summary>查看原文（15行）</summary>

```text
function isTrustedRequest(request: IncomingMessage, trustedHosts: readonly string[]): boolean {
  const host = header(request.headers, 'host')
  if (host === undefined) return false
  const hostUrl = parseAuthority(host)
  if (hostUrl === undefined) return false
  if (!isLoopbackHostname(hostUrl.hostname) && !isTrustedAuthority(hostUrl, trustedHosts)) return false
  if (header(request.headers, 'sec-fetch-site') === 'cross-site') return false
  const origin = header(request.headers, 'origin')
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
}
```

</details>

**依据 3 · 源码核查**：[src/index.ts:252-258](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/index.ts#L252-L258)

会话 cwd 缺失时回退进程 cwd。

```text
function sessionCwdOf(ctx: WbContext, sessionId: string | undefined): string {
  if (sessionId !== undefined) {
    const cwd = ctx.sessions.get(sessionId)?.header.cwd
    if (cwd !== undefined && cwd !== '') return cwd
  }
  return process.cwd()
}
```

**依据 4 · 源码核查**：[src/index.ts:281-319](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/index.ts#L281-L319)

读取不限工作区、写入检查大小但直接 writeFile。

<details>
<summary>查看原文（39行）</summary>

```text
        if (method === 'fs.read') {
          const sessionId = stringOrUndefined(payload, 'sessionId')
          const raw = stringOrUndefined(payload, 'path')
          if (raw === undefined) {
            writeError(res, new WbError('bad-request', 'fs.read requires a "path"', 400))
            return
          }
          const cwd = sessionCwdOf(ctx, sessionId)
          const path = resolveReadPath(raw)
          const file = await readFileText(path, READ_LIMIT_BYTES)
          // Outside-workspace files open read-only: saving stays confined to
          // the session workspace (fs.write), so tell the client up front.
          const writable = await isInsideWorkspace(cwd, path)
          writeOk(res, { file, cwd, writable })
          return
        }
        if (method === 'fs.write') {
          const raw = stringOrUndefined(payload, 'path')
          const text = stringOrUndefined(payload, 'content')
          if (raw === undefined || text === undefined) {
            writeError(res, new WbError('bad-request', 'fs.write requires "path" and "content"', 400))
            return
          }
          const cwd = sessionCwdOf(ctx, stringOrUndefined(payload, 'sessionId'))
          const path = await resolveWorkspacePath(cwd, raw)
          // Truncation guard: a file larger than the read cap can never be
          // fully read by this editor, so writing the partial buffer back
          // would silently destroy the rest of the file (C2). Reject the
          // write before touching the target.
          const info = await stat(path).catch(() => undefined)
          if (info !== undefined && info.size > READ_LIMIT_BYTES) {
            writeError(res, new WbError('fs-error',
              `"${raw}" is ${info.size} bytes, over the ${READ_LIMIT_BYTES}-byte editor limit`, 413))
            return
          }
          await writeFile(path, text, 'utf8').catch((error) => {
            throw new WbError('fs-error', `cannot write "${raw}": ${messageOf(error)}`, 400)
          })
          writeOk(res, { saved: true, cwd })
```

</details>

**依据 5 · 源码核查**：[src/client/EditorView.tsx:216-228](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/client/EditorView.tsx#L216-L228)

dirty 状态同步 seed。

<details>
<summary>查看原文（13行）</summary>

```text
  /**
   * Keep the instance seed's meta dirty flag in sync (updateViewSeed) so the
   * beforeClose hook registered on the view definition can confirm closing
   * the floating window with unsaved changes.
   */
  useEffect(() => {
    if (workbench === undefined || path === undefined) return
    const instanceId = ownInstance()
    if (instanceId === undefined) return
    if (lastDirtyRef.current === dirty) return
    lastDirtyRef.current = dirty
    workbench.updateViewSeed(instanceId, { meta: { dirty } })
  }, [dirty, path, workbench, ownInstance])
```

</details>

**依据 6 · 源码核查**：[src/client/EditorView.tsx:252-283](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/client/EditorView.tsx#L252-L283)

保存发送路径和全文，没有条件写版本令牌。

<details>
<summary>查看原文（32行）</summary>

```text
  const save = useCallback(async (): Promise<void> => {
    if (path === undefined || contentRef.current === null || !dirty) return
    if (!writable) {
      // Outside-workspace files open read-only (host fs.write rejects them).
      setError(t('readOnly'))
      return
    }
    if (truncated) {
      // The file is larger than the editor's read cap: the buffer in memory
      // is only the first 256 KiB, so writing it back would silently
      // truncate the file. Refuse up front (the host enforces this too).
      setError(t('saveTooLarge'))
      return
    }
    setSaving(true)
    try {
      const response = await fetch('/desk-editor/fs.write', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId, path, content: contentRef.current }),
      })
      const json = (await response.json()) as { ok: boolean; error?: { message: string } }
      if (json.ok !== true) throw new Error(json.error?.message ?? 'save failed')
      setDirty(false)
      setSavedAt(Date.now())
      setSize(new TextEncoder().encode(contentRef.current).length)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setSaving(false)
    }
  }, [path, sessionId, dirty, truncated, writable, t])
```

</details>

#### 缺口

- 没有双窗口及外部改写交错保存记录。
  **影响：**无法量化静默覆盖频率、恢复成本或确认真实宿主行为。
  **进一步探讨：**在隔离工作区固定读后外部改写、两个窗口交错保存样本，核对旧内容是否覆盖并测恢复时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、生效、日常操作和退出依赖什么？

**研究主题：**依赖、兼容与流程

#### 完整回答

源码包声明 Node >=20、Cordis、dock-base、dock-files 与 React peer，客户端依赖 workbench 和 files 服务，服务端依赖 webServer、sessions、webRuntime；optional peer 是安装层标记，不能推断缺少 dock/file 服务仍能启用 UI。README 给出 web profile 下依次安装基座、文件域和编辑器的命令，但本轮未安装。日常流程是从文件域打开文本、编辑、保存、确认状态；超限和二进制只读，错误需回外部工具处理。退出可停用插件并改用外部编辑器，未保存窗口需确认，localStorage 中按路径保存的几何偏好属于额外浏览器状态。不同版本 dock 与 dock-files 是否兼容仍需宿主验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:47-65](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/package.json#L47-L65)

Node/peer/optional 的包声明。

<details>
<summary>查看原文（19行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "peerDependencies": {
    "cordis": "^4.0.0-rc.7",
    "dock-base": ">=0.2.0",
    "dock-files": ">=0.1.0",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "dock-base": {
      "optional": true
    },
    "dock-files": {
      "optional": true
    },
    "react": {
      "optional": true
    }
```

</details>

**依据 2 · 作者声明**：[README.md:27-58](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/README.md#L27-L58)

作者依赖与 web profile 安装顺序。

<details>
<summary>查看原文（32行）</summary>

````text
## 依赖

| 依赖 | 类型 | 说明 |
| --- | --- | --- |
| [dock](https://github.com/AKS1st/dock) >= 0.1.0 | peer（必需） | 工作台外壳：编辑器区视图、浮窗、`ctx.workbench` 由它提供 |
| [dock-files](https://github.com/AKS1st/dock-files) >= 0.1.0 | peer（必需） | 文件域服务：dock-editor 作为其 `editor` 默认查看器被分发打开 |
| DSH Web 环境 | 运行时 | 必需，客户端平台为 Web |
| `cordis` ^4.0.0-rc.7 | peer | 插件框架（DSH 自带） |
| `react` ^18.2.0 | peer（可选） | 客户端渲染需要；未提供时编辑器 UI 不激活 |
| `@codemirror/*`、`@lezer/highlight` | dev（构建期） | CodeMirror 6 编辑器 + 语言文法，仅编译进 `lib/client.js`，发布后无需安装 |

**可选搭档**：`dock-images`、`dock-markdown` 等更多查看器可与 dock-editor 共存，按扩展名各自接管对应文件类型（dock-editor 是 `default` 兜底查看器）。

## 安装

需要 `dock` 与 `dock-files`：

推荐从 npm registry 安装：

```sh
dsh plugin --profile web add dock-base
dsh plugin --profile web add dock-files
dsh plugin --profile web add dock-editor
```

或通过 GitHub 安装（备选）：

```sh
dsh plugin --profile web add github:AKS1st/dock
dsh plugin --profile web add github:AKS1st/dock-files
dsh plugin --profile web add github:AKS1st/dock-editor
```
````

</details>

**依据 3 · 源码核查**：[src/client/index.ts:18-51](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/client/index.ts#L18-L51)

双客户端服务缺失时不注册 UI。

<details>
<summary>查看原文（34行）</summary>

```text
/** Requires the workbench base (carrier) and the dock-files file domain. */
export const inject = ['workbench', 'files']

/** Local structural face of ctx.files (avoid type dependency on dock-files). */
interface FilesService {
  registerFileViewer(def: {
    id: string
    exts?: string[]
    default?: boolean
    icon?: { color?: string; path?: string; viewBox?: string }
  }): () => void
  registerFileIcon(def: {
    exts: string[]
    icon: { color?: string; path?: string; viewBox?: string }
  }): () => void
}

/**
 * The code glyph dock-editor registers for source/config file types: a
 * `</>` mark (thick stroke quads, single evenodd path in a 16×16 viewBox),
 * tinted per family through the icon color.
 */
const CODE_ICON = {
  viewBox: '0 0 16 16',
  path: 'M4.42 8.40L6.72 5.40L5.68 4.60L3.38 7.60ZM3.38 8.40L5.68 11.40L6.72 10.60L4.42 7.60ZM6.58 5.41L8.48 11.01L9.72 10.59L7.82 4.99ZM12.99 7.57L10.39 4.57L9.41 5.43L12.01 8.43ZM12.01 7.57L9.41 10.57L10.39 11.43L12.99 8.43Z',
}

/** Client plugin body. */
export function apply(ctx: WorkbenchContext): void {
  const workbench = ctx.get<WorkbenchService>('workbench')
  const files = ctx.get<FilesService>('files')
  // inject guarantees both services are present when this applies; guard
  // anyway so a broken runtime degrades instead of throwing.
  if (workbench === undefined || files === undefined) return
```

</details>

**依据 4 · 源码核查**：[src/client/EditorView.tsx:29-55](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/client/EditorView.tsx#L29-L55)

浏览器 localStorage 中的几何持久化。

<details>
<summary>查看原文（27行）</summary>

```text
/** localStorage key remembering the floating-window geometry per file path. */
const geometryKey = (path: string): string => `dock-editor:geometry:${path}`

function readGeometry(path: string): WindowGeometry | null {
  try {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(geometryKey(path))
    if (raw === null) return null
    const parsed = JSON.parse(raw) as Partial<WindowGeometry>
    if (typeof parsed.x === 'number' && typeof parsed.y === 'number'
      && typeof parsed.width === 'number' && typeof parsed.height === 'number') {
      return { x: parsed.x, y: parsed.y, width: parsed.width, height: parsed.height }
    }
    return null
  } catch {
    return null
  }
}

function writeGeometry(path: string, geometry: WindowGeometry): void {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(geometryKey(path), JSON.stringify(geometry))
  } catch {
    // Storage unavailable: geometry is forgotten on close, editing still works.
  }
}
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前材料能证明哪些效果、资源和人工成本？

**研究主题：**效果与总成本

#### 完整回答

源码足以确认小文本可经同工作台编辑并提交到写路由，256 KiB 读取截断、NUL 识别与写端大小检查为局部防护；不能由此推出真实用户节时、保存可靠率或净收益。CodeMirror 的语言包被构建进客户端资源，作者报告约 1.12 MB bundle 和 gzip 约 300 KB，本轮没有独立重新测量下载或内存。首次成本包括装配 dock/dock-files、确认版本与加载结果；持续成本包括浏览器资源、检查保存目标与人工处理冲突；失败恢复包括重新读取、比对和人工恢复，金额与耗时都未知。对重要文件，保存失败或覆盖的恢复成本可能抵消省去切换工具的便利。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:147-177](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/index.ts#L147-L177)

256 KiB 读取与 NUL 检测的具体实现。

<details>
<summary>查看原文（31行）</summary>

```text
/** Cap for a single text-file read (256 KiB keeps the editor snappy). */
const READ_LIMIT_BYTES = 1 << 18

/** Text read of a file with a size cap; binary detection via NUL probe. */
async function readFileText(path: string, readLimit: number): Promise<{
  content: string
  truncated: boolean
  binary: boolean
  size: number
}> {
  const info = await stat(path).catch((error) => {
    throw new WbError('fs-error', `cannot read "${path}": ${messageOf(error)}`, 400)
  })
  if (info.isDirectory()) {
    throw new WbError('fs-error', `"${path}" is a directory`, 400)
  }
  const size = info.size
  const truncated = size > readLimit
  const handle = await open(path, 'r').catch((error) => {
    throw new WbError('fs-error', `cannot read "${path}": ${messageOf(error)}`, 400)
  })
  try {
    const buffer = Buffer.alloc(Math.min(size, readLimit))
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0)
    const slice = buffer.subarray(0, bytesRead)
    const binary = slice.includes(0)
    return { content: binary ? '' : slice.toString('utf8'), truncated, binary, size }
  } finally {
    await handle.close()
  }
}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:305-319](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/index.ts#L305-L319)

写端拒绝覆盖超限旧文件，直接写入文本。

<details>
<summary>查看原文（15行）</summary>

```text
          const path = await resolveWorkspacePath(cwd, raw)
          // Truncation guard: a file larger than the read cap can never be
          // fully read by this editor, so writing the partial buffer back
          // would silently destroy the rest of the file (C2). Reject the
          // write before touching the target.
          const info = await stat(path).catch(() => undefined)
          if (info !== undefined && info.size > READ_LIMIT_BYTES) {
            writeError(res, new WbError('fs-error',
              `"${raw}" is ${info.size} bytes, over the ${READ_LIMIT_BYTES}-byte editor limit`, 413))
            return
          }
          await writeFile(path, text, 'utf8').catch((error) => {
            throw new WbError('fs-error', `cannot write "${raw}": ${messageOf(error)}`, 400)
          })
          writeOk(res, { saved: true, cwd })
```

</details>

**依据 3 · 作者声明**：[README.md:20-25](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/README.md#L20-L25)

作者说明编辑功能与 bundle 体量，体量不是本轮实测。

```text
- **未保存提示**：关闭带未保存修改的窗口前弹出确认（通过工作台 `beforeClose` 钩子与 seed dirty 标记）。
- **二进制检测**：读取时探测 NUL 字节，二进制文件显示提示而非乱码。
- **大小上限**：单文件读取上限 256 KiB；超过上限的文件只显示前 256 KiB、**禁用保存**，避免截断原文件（主机端同样校验并拒绝）。
- **悬浮窗几何记忆**：每个文件记住上次悬浮窗口的位置与大小，重新打开时恢复。

> **代码编辑器开销**：`CodeMirror 6` 作为 **构建期 devDependency** 被打包进 `lib/client.js`（与 dock-markdown 打包 marked 同理，不进入 runtime 依赖）。客户端 bundle 约 1.12 MB（gzip 约 300 KB）——其中编辑器运行时（`@codemirror/view` 等）占大头，各语言文法合计仅约 68 KB（gzip）。
```

**依据 4 · 源码核查**：[package.json:67-85](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/package.json#L67-L85)

CodeMirror 等构建依赖。

<details>
<summary>查看原文（19行）</summary>

```text
  "devDependencies": {
    "@codemirror/commands": "^6.0.0",
    "@codemirror/lang-css": "^6.0.0",
    "@codemirror/lang-html": "^6.0.0",
    "@codemirror/lang-javascript": "^6.0.0",
    "@codemirror/lang-json": "^6.0.0",
    "@codemirror/lang-python": "^6.0.0",
    "@codemirror/lang-yaml": "^6.0.0",
    "@codemirror/language": "^6.0.0",
    "@codemirror/legacy-modes": "^6.0.0",
    "@codemirror/search": "^6.0.0",
    "@codemirror/state": "^6.0.0",
    "@codemirror/view": "^6.0.0",
    "@lezer/highlight": "^1.0.0",
    "@types/node": "^22.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tsdown": "^0.22.14",
    "typescript": "^6.0.3",
```

</details>

#### 缺口

- 没有同条件完成任务的时间、资源占用、冲突和丢失率测量。
  **影响：**无法估算单位合格编辑任务成本和节省。
  **进一步探讨：**在同一组小文件任务比较 dock-editor 与外部编辑器，记录成功保存、人工分钟、浏览器资源和恢复事件。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 现阶段适合谁试用，下一步可验证的新设计是什么？

**研究主题：**新假设与验证、采用判断

#### 完整回答

建议有 dock 文件域、只需改小型非关键工作区文本的用户做有限试用；先核对依赖、只读/超限边界和保存后的文件内容。重要配置、并发编辑或工作区外写入任务仍应使用有冲突检查与恢复能力的原工具。源码支持便利的界面整合，但保存覆盖风险和无宿主验收使「值得安装」结论缺依据。可提出未验证的条件写设计：读取时返回内容摘要和会话身份，保存时服务器再次比较，冲突时保留新旧两版并提供差异/重载。它比当前 dirty 关闭提示多处理读后外部变化，代价是版本令牌、原子性与冲突 UI。用两个窗口及外部改写的交错样本，对照现有保存，记录被阻止的静默覆盖、误报和恢复工时；若误报增加且恢复无改进，应否定设计收益。该假设没有实现，不计入现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:297-319](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/index.ts#L297-L319)

当前保存没有预期版本参数与条件写。

<details>
<summary>查看原文（23行）</summary>

```text
        if (method === 'fs.write') {
          const raw = stringOrUndefined(payload, 'path')
          const text = stringOrUndefined(payload, 'content')
          if (raw === undefined || text === undefined) {
            writeError(res, new WbError('bad-request', 'fs.write requires "path" and "content"', 400))
            return
          }
          const cwd = sessionCwdOf(ctx, stringOrUndefined(payload, 'sessionId'))
          const path = await resolveWorkspacePath(cwd, raw)
          // Truncation guard: a file larger than the read cap can never be
          // fully read by this editor, so writing the partial buffer back
          // would silently destroy the rest of the file (C2). Reject the
          // write before touching the target.
          const info = await stat(path).catch(() => undefined)
          if (info !== undefined && info.size > READ_LIMIT_BYTES) {
            writeError(res, new WbError('fs-error',
              `"${raw}" is ${info.size} bytes, over the ${READ_LIMIT_BYTES}-byte editor limit`, 413))
            return
          }
          await writeFile(path, text, 'utf8').catch((error) => {
            throw new WbError('fs-error', `cannot write "${raw}": ${messageOf(error)}`, 400)
          })
          writeOk(res, { saved: true, cwd })
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:79-103](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/client/index.ts#L79-L103)

现有 beforeClose 只基于本地 dirty 标记。

<details>
<summary>查看原文（25行）</summary>

```text
  // The view that receives open seeds ({ path, title }). It stays registered
  // as an editor-area view because floating windows resolve their view
  // through this registry; opening itself is always floating (dock-files
  // dispatches { mode: 'floating' }), so no tab-open path remains. The
  // beforeClose hook consumes the dirty flag the view syncs onto seed.meta
  // (updateViewSeed) and confirms closing the window with unsaved edits.
  ctx.effect(() => workbench.registerEditorView({
    id: 'editor',
    title: 'Editor',
    order: 100,
    component: EditorView,
    beforeClose: (request: CloseRequest): boolean | Promise<boolean> => {
      const meta = request.seed?.meta
      if (meta !== null && typeof meta === 'object' && (meta as { dirty?: unknown }).dirty === true) {
        // Themed in-app confirm (replaces the native window.confirm),
        // localized to the active DSH locale (message + button labels).
        const locale = detectLocale(ctx)
        return confirmDialog(translate(locale, 'unsavedCloseConfirm'), {
          ok: translate(locale, 'ok'),
          cancel: translate(locale, 'cancel'),
        })
      }
      return true
    },
  }), 'dock-editor: editor view')
```

</details>

**依据 3 · 源码核查**：[src/client/EditorView.tsx:252-283](https://github.com/AKS1st/dock-editor/blob/f6e5e0845c42e2b09a7a8d671a66b331fe094634/src/client/EditorView.tsx#L252-L283)

当前请求发送全文并在成功响应后清 dirty。

<details>
<summary>查看原文（32行）</summary>

```text
  const save = useCallback(async (): Promise<void> => {
    if (path === undefined || contentRef.current === null || !dirty) return
    if (!writable) {
      // Outside-workspace files open read-only (host fs.write rejects them).
      setError(t('readOnly'))
      return
    }
    if (truncated) {
      // The file is larger than the editor's read cap: the buffer in memory
      // is only the first 256 KiB, so writing it back would silently
      // truncate the file. Refuse up front (the host enforces this too).
      setError(t('saveTooLarge'))
      return
    }
    setSaving(true)
    try {
      const response = await fetch('/desk-editor/fs.write', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId, path, content: contentRef.current }),
      })
      const json = (await response.json()) as { ok: boolean; error?: { message: string } }
      if (json.ok !== true) throw new Error(json.error?.message ?? 'save failed')
      setDirty(false)
      setSavedAt(Date.now())
      setSize(new TextEncoder().encode(contentRef.current).length)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    } finally {
      setSaving(false)
    }
  }, [path, sessionId, dirty, truncated, writable, t])
```

</details>

#### 缺口

- 条件写与冲突 UI 尚未实现或测试。
  **影响：**不能提升当前插件的安全结论或创新评分。
  **进一步探讨：**先用交错保存样本比较静默覆盖和误报，再评估内容摘要与原子替换方案。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
