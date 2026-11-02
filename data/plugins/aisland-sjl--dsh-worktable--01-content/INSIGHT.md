# dsh-worktable 内容组件

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f98246e](https://github.com/Aisland-SJL/dsh-worktable/tree/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content)

<!-- BEGIN META -->
[![GitHub ★ 823](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=823&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aisland-SJL/dsh-worktable)
<!-- END META -->

> **功能**：将项目窗格、文件、网页、终端与DSH会话绑定，使用owner准入和目录预览能力，项目不是文件沙箱。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 显式身份降低旧结果串挂；[Q03](#research-q03) owner与opaque目录cap分离私有API/页面资源，不是项目文件隔离。

> **主要限制**：[Q02](#research-q02)、[Q04](#research-q04) 当前绑定不证内容版本，owner写可覆盖共享路径，撤销落盘吞错/旧WS不即时撤权；安全准入不能掩盖状态边界。

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
  - [Q01 · 项目窗格比独立文件/网页/终端窗口增加什么？](#detail-section-11)
  - [Q02 · 身份版本怎样拒绝旧结果，和内容版本是同一事吗？](#detail-section-12)
  - [Q03 · owner准入和目录预览如何隔开权限？](#detail-section-13)
  - [Q04 · 撤销、写入与终端的失败边界是什么？](#detail-section-14)
  - [Q05 · 什么条件支持两项目小试和完整退出？](#detail-section-15)
  - [Q06 · 内容generation与可见撤销收据能补什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人多项目开发者集中文件/网页/终端/结果，正确归属与可恢复是结果，非窗口数量。

独立窗口和原生会话手工对齐；生命周期/权限边界是增量，不改变真实文件共享。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 项目绑定 | 防旧结果串挂 | 身份当前非内容不可变 |
| 私有API | owner文件/终端操作 | 权限不等项目沙箱 |
| 目录预览 | 相对资源/脚本HTML | opaque、整目录可读/可联网 |
| 撤销/清理 | 关绑定/网页/PTY | 持久失败吞、现有WS非即时撤权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 精确支持DSH/Node>=22 | 必需 | slots/会话/准入 | 其他版本不推可用 |
| connection.admit身份 | 私有API必需 | owner或旧operator | 不可确认503，非降级开放 |
| ws/node-pty | 终端按需 | Shell | 缺失不注册terminal |
| 无敏感预览目录 | 预览前提 | 整目录只读cap | 页面仍可联网 |
| 独立文件/配置备份 | 采用前提 | 共享覆盖/状态恢复 | 绑定非沙箱 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 精确Windows版/备份/两独立目录 | 核Web/Desktop来源 |
| 绑定 | 建项目窗格会话，旧/新结果比较 | 身份+实际内容匹配 |
| 权限 | 私有拒绝/预览专目录/PTY | owner与页面能力分开 |
| 故障 | 撤销刷新/晚到/现有WS核 | 不仅当前UI显示 |
| 退出 | 关连接禁插件回独立窗口 | 保文件/项目与浏览器状态另清 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主/浏览器/备份 | 布局/目录/会话核验 | 来源/时长未知 |
| 持续 | PTY/网页/媒体/模型任务 | 核绑定与真实文件 | 状态镜像无模型非任务无费 |
| 失败恢复 | 重试/存储备份 | 晚到内容/撤销/token/WS | 共享写可覆盖，人工量未知 |
| 退出 | 数据留存/迁移 | 关资源回原视图 | 保活非即时撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 结果归属 | 多身份/version核对 | 路径内容晚到修改正确性 |
| 权限/预览 | owner默认拒/opaque/token | 即时WS撤权/恶意本机竞态/并发总内存 |
| 项目组织 | 多窗/会话与状态镜像 | 业务合格率/净节时 |

> **思考**：[Q02](#research-q02)、[Q04](#research-q04) 当前绑定不证内容版本，owner写可覆盖共享路径，撤销落盘吞错/旧WS不即时撤权；安全准入不能掩盖状态边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 显式身份降低旧结果串挂；[Q03](#research-q03) owner与opaque目录cap分离私有API/页面资源，不是项目文件隔离。

[Q03](#research-q03) 默认拒/随机目录cap/单handle限量读可迁移；[Q04](#research-q04) 全环境PTY/共享写与撤销吞错仍需承担，内容版本和授权身份不同。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q04](#research-q04) 当前绑定不证内容版本，owner写可覆盖共享路径，撤销落盘吞错/旧WS不即时撤权；安全准入不能掩盖状态边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 精确支持Windows个人环境两独立低风险项目试，先绑定文件再预览终端；错挂/旧结果复活/撤权不符停并回原生会话与独立窗口，保备份。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定01_content源码/发布lib关键准入预览终端与绑定重核全部findings；未运行目标/宿主/模型或目标测试，作者局部Windows结果不作本轮通过。

- 已检查：作者 README、包清单、源码路径 01_content/README.md、01_content/lib/index.js、01_content/package.json、01_content/src/client/SandboxedFrame.tsx、01_content/src/client/widgetMount.ts、01_content/src/index.ts、01_content/src/previewFiles.ts、01_content/src/requestAuth.ts 及固定范围 inventory；组件：01_content。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅01_content组件，重点绑定/Host准入PTY写入/预览与发布lib对应段；未全审所有UI/布局/兼容层及根其他资源。
- 下一步：[Q06](#research-q06) 同目录/晚到/重绑/存储满/revoke失败/现有WS撤权矩阵比错误接受和人工恢复，未执行。

**分析版本**

- **仓库**：[Aisland-SJL/dsh-worktable](https://github.com/Aisland-SJL/dsh-worktable)
- **版本号**：0.5.1（[固定提交 f98246e](https://github.com/Aisland-SJL/dsh-worktable/tree/f98246ef0cd10173cabfdb4d7070eb245b12b42d)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 未验证产物generation/摘要与可见撤销持久收据，对照已有身份/handle复核测晚到错认和恢复负担，不称文件沙箱。

[Q06](#research-q06) 同目录/晚到/重绑/存储满/revoke失败/现有WS撤权矩阵比错误接受和人工恢复，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 586 | 463 | 96 | — |
| .mjs | test | 1 | 72 | 45 | 14 | — |
| .js | source | 2 | 24829 | 23398 | 1955 | — |
| .md | source | 1 | 123 | — | — | 3865 |
| .ts | source | 16 | 2715 | 2350 | 226 | — |
| .tsx | source | 3 | 6548 | 5832 | 503 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/Aisland-SJL/dsh-worktable/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/Aisland-SJL/dsh-worktable/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aisland-SJL/dsh-worktable/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多项目结果归属和私有API/预览权限如何接线，状态边界支持怎样采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 项目窗格比独立文件/网页/终端窗口增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

01_content是真DSH插件，给个人多项目开发者把文件、终端、网页、自定义结果与会话集中在项目容器；控制室镜像宿主状态而非额外调用模型。相比独立窗口/手工对齐结果，显式项目/窗格/绑定身份减少旧结果串挂，复用宿主会话和输入而非新Agent执行框架。

正确结果是目标项目收到当前绑定产物、用户看清实际文件归属和权限，不是窗口出现就任务完成。项目目录和绑定不是OS文件隔离，同一真实目录仍可被其他项目/进程写；作者局部Windows结果不作本轮验收。

#### 证据与依据

**依据 1 · 作者声明**：[01_content/README.md:3-17](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/README.md#L3-L17)

作者项目容器与状态/存储定位。

<details>
<summary>查看原文（15行）</summary>

```text
> DeepSeek Harness 侧边栏的 agent 级项目容器（应用抽屉）。纯增量插件，不替换、不禁用任何官方插件。

## 是什么

- **侧边栏「工作台」区块**：收纳用户自建项目与入驻插件项目，支持改名/图标/排序/显示隐藏、项目 × 对话绑定、项目文件夹。
- **分栏工作区引擎（自研）**：声明式布局预设（左栏/顶行/主行 + 右侧对话窗），窗格可拖拽分割、标签页模型；内置 资源管理器 / 终端 / 浏览器 / 动画 / 自定义窗口。
- **控制室**：默认自带项目（固定首位、不可删除），项目卡片网格镜像可见绑定项目的宿主状态（工作中/待你决定/已完成）；状态订阅不调用模型，计时与预览另有刷新机制。
- **项目独立挂载**：窗口任务使用项目 ID、窗格 ID 与绑定 ID 对应的专属结果文件；同一文件夹里的新项目仍从空白窗口开始，不自动读取其他项目的旧结果。
- **平台**：Windows 是本轮验证平台，范围见下方兼容说明；macOS 为实验性支持（核心文件路径代码已做跨平台适配，尚未真机端到端验证）。

## 技术底座

- Cordis 插件协议（客户端 bundle + 服务端路由 /api/worktable/*、终端 WebSocket）。
- 界面经 slot 座位协议注入侧边栏与 shell.overlay；对话窗复用宿主会话服务（新版 uiWorkspace.openSession，旧版 sessions.open）。
- 状态监控为宿主会话运行时快照的事件订阅镜像；视图/项目/绑定状态存 localStorage。
```

</details>

**依据 2 · 源码核查**：[01_content/package.json:1-20](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/package.json#L1-L20)

0.5.1组件发布与支持范围。

<details>
<summary>查看原文（20行）</summary>

```text
{
  "name": "dsh-worktable",
  "description": "工作台 Worktable：DeepSeek Harness 侧边栏的 agent 级项目容器（应用抽屉）",
  "version": "0.5.1",
  "repository": {
    "type": "git",
    "url": "https://github.com/Aisland-SJL/dsh-worktable.git",
    "directory": "01_content"
  },
  "engines": {
    "node": ">=22",
    "dsh": "0.2.0-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.5"
  },
  "license": "MIT",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
```

</details>

**依据 3 · 源码核查**：[01_content/src/client/widgetMount.ts:35-39](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/client/widgetMount.ts#L35-L39)

专属manifest按项目窗格绑定分路。

```text
export function widgetManifestPath(binding: WidgetBinding): string {
  // Binding-specific files also keep late writers from overwriting a newer binding's result.
  return joinPath(binding.folder, joinPath('.dsh-worktable', joinPath(
    'project-' + encodeURIComponent(binding.projectId),
    'pane-' + encodeURIComponent(binding.paneId) + '-' + binding.bindingId + '.json',
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 身份版本怎样拒绝旧结果，和内容版本是同一事吗？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

begin按当前项目spec与唯一pane校验，选目标生成新bindingId并带sessionId/folder/window，持久失败回滚内存；manifest路径带project/pane/binding，不让旧manifest直接覆盖新绑定结果。isCurrent再核enabled、bindingId/sessionId/folder/spec，resolve要求version2和project/pane/binding/window及合法kind/path，才能形成目标item。

这些核对是身份/结果通路版本，不校验文件内容摘要、文件生成时刻或执行generation，返回item还是路径。因此同binding指向文件被晚到写者改写仍可能显示错误内容；不能把当前manifest当产物不可变收据。可借鉴显式身份和创建持久失败回滚，结果内容一致性另需设计。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/client/widgetMount.ts:73-91](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/client/widgetMount.ts#L73-L91)

begin和持久失败回滚。

<details>
<summary>查看原文（19行）</summary>

```text
  begin(projectId: string, spec: WidgetSpec, folder: string, sessionId: string, window: string): WidgetBinding[] {
    if (!this.storage) throw new Error('project storage unavailable')
    if (!folder || !sessionId || spec.id !== projectId) throw new Error('project folder or session unavailable')
    const targets = widgetTargets(spec)
    const selected = targets.find((t) => t.window === window)
    if (!selected || new Set(targets.map((t) => t.pane.id)).size !== targets.length) throw new Error('project window changed')
    const before = this.records[projectId]
    const next: Record<string, WidgetBinding> = Object.create(null)
    for (const t of targets) {
      const old = before?.[t.pane.id]
      // Unassigned windows can participate in one multi-window result. A manually revoked
      // window stays revoked until explicitly selected for another custom task.
      next[t.pane.id] = t === selected || !old || old.folder !== folder || (old.enabled && old.window !== t.window)
        ? { projectId, paneId: t.pane.id, window: t.window, folder, sessionId, bindingId: this.makeId(), enabled: true }
        : old
    }
    this.records[projectId] = next
    try { this.persist() } catch (error) { if (before) this.records[projectId] = before; else delete this.records[projectId]; throw error }
    return this.entries(projectId).filter((b) => b.sessionId === sessionId)
```

</details>

**依据 2 · 源码核查**：[01_content/src/client/widgetMount.ts:103-121](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/client/widgetMount.ts#L103-L121)

当前身份与manifest完整判断。

<details>
<summary>查看原文（19行）</summary>

```text
  isCurrent(binding: WidgetBinding, spec: WidgetSpec | null | undefined, folder: string | undefined): boolean {
    const current = this.records[binding.projectId]?.[binding.paneId]
    return !!current?.enabled && current.bindingId === binding.bindingId && current.sessionId === binding.sessionId &&
      current.folder === folder && binding.folder === folder && spec?.id === binding.projectId &&
      widgetTargets(spec).filter((t) => t.pane.id === binding.paneId).length === 1
  }
  resolve(binding: WidgetBinding, raw: string, spec: WidgetSpec | null | undefined, folder: string | undefined):
    { target: WidgetTarget; item: { kind: 'html' | 'url' | 'file'; path: string } } | null {
    if (!this.isCurrent(binding, spec, folder)) return null
    try {
      const d = JSON.parse(raw)
      if (!d || Array.isArray(d) || d.version !== 2 || d.projectId !== binding.projectId ||
          d.paneId !== binding.paneId || d.bindingId !== binding.bindingId || d.window !== binding.window ||
          !['html', 'url', 'file'].includes(d.kind) || typeof d.path !== 'string' || !d.path.trim()) return null
      const target = widgetTargets(spec).find((t) => t.pane.id === binding.paneId)!
      return { target, item: { kind: d.kind, path: d.path.trim() } }
    } catch { return null }
  }
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · owner准入和目录预览如何隔开权限？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

直接WebServer route不继承宿主/api认证，包装每私有HTTP请求调用当前connection.admit，owner或旧单operator才放行，服务缺失/异常503，其他403。终端WS建连也先准入。预览mount是owner私有操作，资源凭随机24byte token只读目录capability无需身份；最多128、空闲30分钟、40MiB单文件，真实路径/单句柄前后身份复核和撤销检查防普通替换，非对抗本机ABA竞态的OS jail。

iframe用allow-scripts/forms/downloads但没有same-origin，opaque origin不能直接读宿主页存储；CSP禁object/frame/base，资源CORS*让页面读所挂整目录，而非仅一个HTML。页面仍可联网，选择含秘密的目录会扩大能力暴露；不能称防外发或文件沙箱。single-resource限额也非并发总内存预算。相应准入/sandbox/token路径在发布lib也读到，不仅TS候选。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/requestAuth.ts:1-19](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/requestAuth.ts#L1-L19)

每次当前身份、默认拒绝。

<details>
<summary>查看原文（19行）</summary>

```text
/** Use the host's current authentication service for every request, never a cached grant. */
export async function requestRejection(ctx: any, req: any): Promise<number | undefined> {
  try {
    const connection = typeof ctx.get === 'function' ? ctx.get('connection') : undefined
    if (!connection) return 503
    if (typeof connection.admit === 'function') {
      const admission = await connection.admit(req)
      if (!admission || typeof admission !== 'object') return 503
      if ('rejection' in admission) return admission.rejection === 401 ? 401 : 403
      const peer = admission.peer
      // 0.2.1 has owner/non-owner principals. 0.2.0 has a single operator Peer.
      if (peer?.principal?.kind === 'owner') return undefined
      if (peer && peer === connection.operator && peer.principal === undefined) return undefined
      return 403
    }
  } catch {}
  // An unavailable or failed security service must not turn into public filesystem access.
  return 503
}
```

</details>

**依据 2 · 源码核查**：[01_content/src/index.ts:282-306](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/index.ts#L282-L306)

路由包装及owner创建capability。

<details>
<summary>查看原文（25行）</summary>

```text

  const previews = createPreviewFiles()
  ctx.effect(() => () => previews.clear(), 'dsh-worktable: preview capabilities')
  // Direct WebServer routes do NOT inherit the host's /api authentication route.
  const register = (route: any, publicAsset = false) => ctx.effect(() => webServer.register({
    ...route,
    handler: async (req: any, res: any) => {
      if (!publicAsset && route.path !== HEALTH_PATH) {
        const rejected = await requestRejection(ctx, req)
        if (rejected !== undefined) { json(res, rejected, { error: rejectionText(rejected) }); return }
      }
      return route.handler(req, res)
    },
  }), 'dsh-worktable: ' + route.path)

  register({
    kind: 'exact', path: '/api/worktable/preview',
    handler: async (req: any, res: any) => {
      if (req.method !== 'POST') { json(res, 405, { error: 'method not allowed' }); return }
      try {
        const body = await readJsonBody(req)
        if (typeof body.revoke === 'string') { previews.revoke(body.revoke); json(res, 200, { ok: true }); return }
        if (typeof body.root !== 'string') { json(res, 400, { error: 'missing root' }); return }
        const token = await previews.mount(body.root)
        json(res, 200, { token, base: PREVIEW_PREFIX + '/' + token + '/' })
```

</details>

**依据 3 · 源码核查**：[01_content/src/previewFiles.ts:5-45](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/previewFiles.ts#L5-L45)

限额/token/目录边界。

<details>
<summary>查看原文（41行）</summary>

```text
export const PREVIEW_PREFIX = '/api/worktable/preview-static'
export const PREVIEW_SANDBOX = 'allow-scripts allow-forms allow-downloads'
export const PREVIEW_CSP = `sandbox ${PREVIEW_SANDBOX}; base-uri 'none'; object-src 'none'; frame-src 'none'`
export const PREVIEW_MAX_BYTES = 40 * 1024 * 1024
const IDLE_MS = 30 * 60 * 1000
const MAX_MOUNTS = 128

function inside(root: string, file: string): boolean {
  const rel = relative(root, file)
  return rel === '' || (!isAbsolute(rel) && rel !== '..' && !rel.startsWith('..' + sep))
}

/** Short-lived read-only capabilities. They grant one directory, never host APIs. */
export function createPreviewFiles(now = () => Date.now()) {
  const mounts = new Map<string, { root: string; touched: number }>()
  const prune = () => { for (const [key, item] of mounts) if (now() - item.touched >= IDLE_MS) mounts.delete(key) }
  return {
    async mount(root: string) {
      if (!isAbsolute(root)) throw new Error('Preview root must be absolute')
      const canonical = await realpath(root)
      if (!(await stat(canonical)).isDirectory()) throw new Error('Preview root is not a directory')
      prune()
      if (mounts.size >= MAX_MOUNTS) throw new Error('Too many open previews; close an unused preview first')
      const token = randomBytes(24).toString('base64url')
      mounts.set(token, { root: canonical, touched: now() })
      return token
    },
    revoke(token: string) { mounts.delete(token) },
    clear() { mounts.clear() },
    async file(token: string, segments: string[], headOnly = false) {
      prune()
      const mount = mounts.get(token)
      if (!mount) return null
      // Decode exactly once before this call; forbid separators embedded in a segment.
      if (segments.some(s => s === '..' || s.includes('/') || s.includes('\\') || s.includes('\0'))) return null
      let target = resolve(mount.root, ...segments)
      if (!inside(mount.root, target)) return null
      let info = await stat(target).catch(() => null)
      if (info?.isDirectory()) target = resolve(target, 'index.html')
      const canonical = await realpath(target).catch(() => null)
      if (!canonical || !inside(mount.root, canonical)) return null
```

</details>

**依据 4 · 源码核查**：[01_content/src/previewFiles.ts:46-89](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/previewFiles.ts#L46-L89)

单句柄/身份/撤销/限量读取。

<details>
<summary>查看原文（44行）</summary>

```text
      // Keep the read bound to one handle. Recheck path/identity around the read
      // to reject ordinary replacement races; this is not an OS filesystem jail
      // against an adversarial local process coordinating ABA path swaps.
      const handle = await open(canonical, 'r').catch(() => null)
      if (!handle) return null
      try {
        const before = await handle.stat({ bigint: true })
        if (!before.isFile()) return null
        const sameFile = (other: typeof before) => other.isFile()
          && other.dev === before.dev && other.ino === before.ino
          && other.size === before.size && other.mtimeNs === before.mtimeNs
          && other.ctimeNs === before.ctimeNs
        const stillValid = async () => {
          const current = await realpath(canonical)
          if (current !== canonical || !inside(mount.root, current)) return false
          const named = await stat(current, { bigint: true })
          const opened = await handle.stat({ bigint: true })
          return sameFile(named) && sameFile(opened)
            && mounts.get(token) === mount && now() - mount.touched < IDLE_MS
        }
        const tooLarge = () => Object.assign(new Error('file too large'), { status: 413 })
        if (before.size > BigInt(PREVIEW_MAX_BYTES)) throw tooLarge()
        if (!(await stillValid())) return null
        const chunks: Buffer[] = []
        let total = 0
        if (!headOnly) {
          // A file may grow after stat. Never allocate/read an unbounded body.
          while (total <= PREVIEW_MAX_BYTES) {
            const chunk = Buffer.alloc(Math.min(64 * 1024, PREVIEW_MAX_BYTES + 1 - total))
            const { bytesRead } = await handle.read(chunk, 0, chunk.length, total)
            if (!bytesRead) break
            total += bytesRead
            if (total > PREVIEW_MAX_BYTES) throw tooLarge()
            chunks.push(chunk.subarray(0, bytesRead))
          }
        }
        if (!(await stillValid()) || (!headOnly && BigInt(total) !== before.size)) return null
        mount.touched = now()
        return { path: canonical, size: Number(before.size), data: headOnly ? undefined : Buffer.concat(chunks, total) }
      } catch (error: any) {
        if (error?.status === 413) throw error
        return null
      } finally {
        await handle.close()
```

</details>

**依据 5 · 源码核查**：[01_content/src/client/SandboxedFrame.tsx:22-56](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/client/SandboxedFrame.tsx#L22-L56)

opaque sandbox与生命周期撤销。

<details>
<summary>查看原文（35行）</summary>

```text
/** Untrusted project pages never share the host's document origin or storage. */
export function SandboxedFrame(props: { url: string; title?: string; reloadKey: number }) {
  const [src, setSrc] = useState('about:blank')
  const [error, setError] = useState('')
  useEffect(() => {
    let alive = true
    let token: string | undefined
    const revoke = (value: string) => { void fetch('/api/worktable/preview', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ revoke: value }), keepalive: true,
    }).catch(() => {}) }
    setSrc('about:blank')
    setError('')
    void (async () => {
      if (!props.url || props.url === 'about:blank') return
      const target = previewTarget(props.url, location.href)
      if ('url' in target) { if (alive) setSrc(target.url!); return }
      const response = await fetch('/api/worktable/preview', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ root: target.root }),
      })
      if (!response.ok) throw new Error('Preview HTTP ' + response.status)
      const grant = await response.json()
      if (typeof grant.token !== 'string' || !/^[\w-]{32}$/.test(grant.token) || grant.base !== '/api/worktable/preview-static/' + grant.token + '/') throw new Error('Invalid preview grant')
      token = grant.token
      if (!alive) { revoke(token!); token = undefined; return }
      setSrc(hostPreviewUrl(grant.base + target.relative + target.suffix))
    })().catch(err => {
      if (token) { revoke(token); token = undefined }
      if (alive) setError(String(err))
    })
    return () => { alive = false; if (token) revoke(token) }
  }, [props.url, props.reloadKey])
  if (error) return <div className="dsh-wt_paneWip"><span className="dsh-wt_paneWipText">{error}</span></div>
  return <iframe key={props.reloadKey} className="dsh-wt_paneFrame" src={src}
    data-source-url={props.url} title={props.title ?? ''} sandbox={SANDBOX} referrerPolicy="no-referrer" />
```

</details>

**依据 6 · 源码核查**：[01_content/lib/index.js:7-23](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/lib/index.js#L7-L23)

发布准入相同。

<details>
<summary>查看原文（17行）</summary>

```text
import { homedir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";

// src/requestAuth.ts
async function requestRejection(ctx, req) {
  try {
    const connection = typeof ctx.get === "function" ? ctx.get("connection") : void 0;
    if (!connection) return 503;
    if (typeof connection.admit === "function") {
      const admission = await connection.admit(req);
      if (!admission || typeof admission !== "object") return 503;
      if ("rejection" in admission) return admission.rejection === 401 ? 401 : 403;
      const peer = admission.peer;
      if (peer?.principal?.kind === "owner") return void 0;
      if (peer && peer === connection.operator && peer.principal === void 0) return void 0;
      return 403;
    }
```

</details>

**依据 7 · 源码核查**：[01_content/lib/index.js:37-61](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/lib/index.js#L37-L61)

发布sandbox/token路径。

<details>
<summary>查看原文（25行）</summary>

```text
var PREVIEW_SANDBOX = "allow-scripts allow-forms allow-downloads";
var PREVIEW_CSP = `sandbox ${PREVIEW_SANDBOX}; base-uri 'none'; object-src 'none'; frame-src 'none'`;
var PREVIEW_MAX_BYTES = 40 * 1024 * 1024;
var IDLE_MS = 30 * 60 * 1e3;
var MAX_MOUNTS = 128;
function inside(root, file) {
  const rel = relative(root, file);
  return rel === "" || !isAbsolute(rel) && rel !== ".." && !rel.startsWith(".." + sep);
}
function createPreviewFiles(now = () => Date.now()) {
  const mounts = /* @__PURE__ */ new Map();
  const prune = () => {
    for (const [key, item] of mounts) if (now() - item.touched >= IDLE_MS) mounts.delete(key);
  };
  return {
    async mount(root) {
      if (!isAbsolute(root)) throw new Error("Preview root must be absolute");
      const canonical = await realpath(root);
      if (!(await stat(canonical)).isDirectory()) throw new Error("Preview root is not a directory");
      prune();
      if (mounts.size >= MAX_MOUNTS) throw new Error("Too many open previews; close an unused preview first");
      const token = randomBytes(24).toString("base64url");
      mounts.set(token, { root: canonical, touched: now() });
      return token;
    },
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 撤销、写入与终端的失败边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

revokePane先内存enabled=false，persist失败吞掉；当前页有效不保证重载后旧持久enabled不会复活，与begin失败回滚不同。SandboxedFrame卸载/换url发revoke但fetch失败吞掉，失效仍靠服务端超时/清理；仅切/关项目有保活池，不等网页卸载和即时撤capability。

owner文件write把任意pathResolve(p)直接writeFile，只有内容长度/方法约束，无项目根校验、expected hash或原子编辑冲突保护，可覆盖共享真实路径；owner权限是授权天花板，不是Agent项目沙箱。终端spawn继承整个process.env和Shell权限，WS建连后消息直接term.write，无每条重验身份；身份撤销不主动断既有连接。插件dispose杀自有PTY/WS是正面退出，不保证其他外部子任务停或文件写可逆。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/client/widgetMount.ts:93-108](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/client/widgetMount.ts#L93-L108)

撤销持久失败吞错。

<details>
<summary>查看原文（16行）</summary>

```text
  revokePane(projectId: string, paneId: string) {
    const b = this.records[projectId]?.[paneId]
    if (!b || !b.enabled) return
    this.records[projectId] = { ...this.records[projectId], [paneId]: { ...b, enabled: false } }
    try { this.persist() } catch { /* Revocation takes effect in memory even if storage is full. */ }
  }
  revokeProject(projectId: string) {
    if (!this.records[projectId]) return
    for (const b of this.entries(projectId)) this.revokePane(projectId, b.paneId)
  }
  isCurrent(binding: WidgetBinding, spec: WidgetSpec | null | undefined, folder: string | undefined): boolean {
    const current = this.records[binding.projectId]?.[binding.paneId]
    return !!current?.enabled && current.bindingId === binding.bindingId && current.sessionId === binding.sessionId &&
      current.folder === folder && binding.folder === folder && spec?.id === binding.projectId &&
      widgetTargets(spec).filter((t) => t.pane.id === binding.paneId).length === 1
  }
```

</details>

**依据 2 · 源码核查**：[01_content/src/client/SandboxedFrame.tsx:29-52](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/client/SandboxedFrame.tsx#L29-L52)

cap revoke best effort。

<details>
<summary>查看原文（24行）</summary>

```text
    const revoke = (value: string) => { void fetch('/api/worktable/preview', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ revoke: value }), keepalive: true,
    }).catch(() => {}) }
    setSrc('about:blank')
    setError('')
    void (async () => {
      if (!props.url || props.url === 'about:blank') return
      const target = previewTarget(props.url, location.href)
      if ('url' in target) { if (alive) setSrc(target.url!); return }
      const response = await fetch('/api/worktable/preview', {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ root: target.root }),
      })
      if (!response.ok) throw new Error('Preview HTTP ' + response.status)
      const grant = await response.json()
      if (typeof grant.token !== 'string' || !/^[\w-]{32}$/.test(grant.token) || grant.base !== '/api/worktable/preview-static/' + grant.token + '/') throw new Error('Invalid preview grant')
      token = grant.token
      if (!alive) { revoke(token!); token = undefined; return }
      setSrc(hostPreviewUrl(grant.base + target.relative + target.suffix))
    })().catch(err => {
      if (token) { revoke(token); token = undefined }
      if (alive) setError(String(err))
    })
    return () => { alive = false; if (token) revoke(token) }
```

</details>

**依据 3 · 源码核查**：[01_content/src/index.ts:238-270](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/index.ts#L238-L270)

WS建连校验/全环境PTY/后续消息。

<details>
<summary>查看原文（33行）</summary>

```text
      if (rejected !== undefined) {
        socket.end(`HTTP/1.1 ${rejected} ${rejectionText(rejected)}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`)
        return
      }
      wss.handleUpgrade(req, socket, head, (ws: any) => {
        const u = new URL(req.url ?? '/', 'http://dsh.internal')
        const cwd = serverCwd(ctx, u.searchParams.get('sessionId') || undefined, u.searchParams.get('cwd') || undefined)
        const cols = clampDim(Number(u.searchParams.get('cols')), 80)
        const rows = clampDim(Number(u.searchParams.get('rows')), 24)
        let term: any = null
        try {
          const shell = spawnShell()
          term = pty.spawn(shell.cmd, shell.args, { name: 'xterm-256color', cols, rows, cwd, env: process.env })
          terminals.add(term)
        } catch (err) {
          try { ws.send('\r\n[worktable] 终端启动失败：' + String(err)) } catch {}
          try { ws.close() } catch {}
          return
        }
        term.onData((d: string) => { try { ws.send(d) } catch {} })
        term.onExit(() => { terminals.delete(term); try { ws.close() } catch {} })
        ws.on('message', (raw: any) => {
          const text = String(raw)
          try {
            const msg = JSON.parse(text)
            if (msg && msg.type === 'resize' && Number.isFinite(msg.cols) && Number.isFinite(msg.rows)) {
              term.resize(clampDim(msg.cols, cols), clampDim(msg.rows, rows))
              return
            }
          } catch {}
          try { term.write(text) } catch {}
        })
        ws.on('close', () => { terminals.delete(term); try { term.kill() } catch {} })
```

</details>

**依据 4 · 源码核查**：[01_content/src/index.ts:219-226](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/index.ts#L219-L226)

卸载关闭本插件资源。

```text
  const terminals = new Set<any>()
  ctx.effect(() => () => {
    disposed = true
    for (const ws of wss.clients ?? []) { try { ws.terminate() } catch {} }
    for (const term of terminals) { try { term.kill() } catch {} }
    terminals.clear()
    try { wss.close() } catch {}
  }, 'dsh-worktable: terminal sessions')
```

**依据 5 · 源码核查**：[01_content/src/index.ts:493-510](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/index.ts#L493-L510)

owner写真实路径无内容版本。

<details>
<summary>查看原文（18行）</summary>

```text
  register({
    kind: 'exact',
    path: '/api/worktable/write',
    handler: async (req: any, res: any) => {
      try {
        if (req.method !== 'POST') { res.writeHead(405); res.end(); return }
        const body = await readJsonBody(req)
        const p = typeof body.path === 'string' ? body.path : ''
        const content = typeof body.content === 'string' ? body.content : ''
        if (!p) { json(res, 400, { error: 'missing path' }); return }
        if (content.length > 20 * 1024 * 1024) { json(res, 413, { error: 'content too large' }); return }
        const abs = pathResolve(p)
        await import('node:fs/promises').then((m) => m.writeFile(abs, content, 'utf8'))
        json(res, 200, { ok: true })
      } catch (err) {
        json(res, (err as any).status ?? 500, { error: String(err) })
      }
    },
```

</details>

**依据 6 · 作者声明**：[01_content/README.md:47-50](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/README.md#L47-L50)

作者整目录/保活/WS撤销边界。

```text
- 本地 HTML 通过登录后创建的随机只读地址加载，允许读取该次选择目录内的资源（包括子目录），支持相对 CSS、JS 模块与 fetch；它不是“只能读当前 HTML 文件”。不要给不可信页面挂载含敏感文件的目录；页面仍可主动联网，隔离不等于阻止数据外发。
- 临时地址不写入项目存档，单资源最多 40 MiB，最多 128 个挂载，连续 30 分钟无读取后失效；失效后点击窗格刷新重新创建。关闭网页标签、刷新替换、组件卸载或插件卸载会撤销；仅关闭/切换项目仍沿用最多 6 个项目的保活池，不立即撤销仍挂载的页面。
- 预览使用同一文件句柄限量读取，读取前后复核真实路径、文件身份与状态；检测到替换、改写或撤销时不返回内容。此措施不是针对恶意本地写入者精确竞态的操作系统沙箱；40 MiB 是单资源限制，不是所有并发请求的总内存额度。
- 终端插件卸载时关闭本插件连接及 Shell。鉴权检查发生在每次 HTTP 请求/WS 建连；本轮没有实现宿主身份撤销后即时断开已有 WS 的机制。
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件支持两项目小试和完整退出？

**研究主题**：效果与总成本、采用判断

#### 完整回答

Windows个人owner在package精确支持的DSH版本（0.2.0-rc.2/0.2.1-rc.3/rc.5）可从两非敏感独立目录项目试，先验会话/绑定/文件，再预览/终端；Web/Desktop安装来源分别核，不能认为latest与固定提交相同。预览用专门无秘密资源目录，不用共享目录测覆盖保障。

首次建项目/布局/会话和目录、备份配置/文件并验owner拒绝路径；持续PTY/网页/媒体与模型任务资源、绑定/文件归属人工核对。失败核晚到内容、撤销存储、失效token和已有WS，时间/现金未知。错挂/旧结果复活/身份撤销不符预期立即停，关连接/禁插件并回原会话和独立窗口；项目/文件和浏览器状态备份另处理，不把卸载当隐私清除。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/package.json:1-13](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/package.json#L1-L13)

固定兼容声明。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "dsh-worktable",
  "description": "工作台 Worktable：DeepSeek Harness 侧边栏的 agent 级项目容器（应用抽屉）",
  "version": "0.5.1",
  "repository": {
    "type": "git",
    "url": "https://github.com/Aisland-SJL/dsh-worktable.git",
    "directory": "01_content"
  },
  "engines": {
    "node": ">=22",
    "dsh": "0.2.0-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.5"
  },
```

</details>

**依据 2 · 作者声明**：[01_content/README.md:35-50](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/README.md#L35-L50)

作者验证范围和预览/终端边界。

<details>
<summary>查看原文（16行）</summary>

```text

- HTTP 文件/目录/写入/Git/工作区与终端握手先通过宿主身份验证，仅放行 owner（0.2.0 使用单 operator 身份）；缺少可确认身份的服务时返回 503，不降级开放。health 仍可公开读取状态。以前直接用无登录 curl 调用这些接口的方式将被拒绝；不提供跳过鉴权开关。
- 候选 dev.1 已在 Windows 隔离数据目录验证 **DSH 0.2.0-rc.2 / 0.2.1-rc.3 网页端**的冷启动、加载、分栏、文件与网页资源；0.2.1 另测创建/写入、控制室绑定和终端，未发送模型请求。用户已在官方 Windows Desktop 0.2.1-rc.3 验证 dev.2 的项目打开、分栏缩放与侧栏设置弹窗正常；前轮新项目也已点测。正式包另做安装与回归检查，这些证据不等于双端全功能验收。
- 0.5.0 当时的 `engines.dsh` 与兼容矩阵只列上述两个 0.2 版本；0.5.1 的当前范围以上节为准。旧 0.1.x 不在本版支持范围；下方 v0.4.0 的记录是历史范围，不代表 0.5.0 继续支持旧宿主。
- 折叠侧栏与展开侧栏共用一份弹窗层，使控制室新建项目、绑定、图标与删除弹窗不因侧栏收起而消失，避免重复渲染。
- 修复分栏 margin 的小数值被浏览器规范化后误判为外部改写，以及会话根更换后观察器仍盯着旧元素的问题。

### 网页隔离的影响与边界

- 浏览器/动画/自定义 HTML 窗格使用无 `allow-same-origin` 的 sandbox；网页不能直接读取 DSH 主页面及其同源存储；私有文件操作和终端接口仍需宿主身份校验。工作台自己的项目、布局和媒体存储不迁移、不删除。
- **可能受影响**：嵌入页面的 localStorage、IndexedDB、Cookie 登录、依赖同源的请求、弹出新窗口/顶层跳转，以及标注时自动读取 iframe 内文字。项目页内嵌 iframe/object 被限制；依赖这些能力的页面可能需要单独适配。网页窗口级标注仍可使用，但不能承诺保留逐元素文字提取。
- **已观察到的兼容限制**：Cesium 等库的 WebGL 纹理可能需要显式跨源加载。StarMap 的月球纹理已在独立项目中修复并验证，改动不包含在工作台安装包里；其他旧网页仍需各自检查。不会为恢复旧网页取消安全隔离。
- 本地 HTML 通过登录后创建的随机只读地址加载，允许读取该次选择目录内的资源（包括子目录），支持相对 CSS、JS 模块与 fetch；它不是“只能读当前 HTML 文件”。不要给不可信页面挂载含敏感文件的目录；页面仍可主动联网，隔离不等于阻止数据外发。
- 临时地址不写入项目存档，单资源最多 40 MiB，最多 128 个挂载，连续 30 分钟无读取后失效；失效后点击窗格刷新重新创建。关闭网页标签、刷新替换、组件卸载或插件卸载会撤销；仅关闭/切换项目仍沿用最多 6 个项目的保活池，不立即撤销仍挂载的页面。
- 预览使用同一文件句柄限量读取，读取前后复核真实路径、文件身份与状态；检测到替换、改写或撤销时不返回内容。此措施不是针对恶意本地写入者精确竞态的操作系统沙箱；40 MiB 是单资源限制，不是所有并发请求的总内存额度。
- 终端插件卸载时关闭本插件连接及 Shell。鉴权检查发生在每次 HTTP 请求/WS 建连；本轮没有实现宿主身份撤销后即时断开已有 WS 的机制。
```

</details>

**依据 3 · 源码核查**：[01_content/src/index.ts:219-226](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/index.ts#L219-L226)

退出资源清理。

```text
  const terminals = new Set<any>()
  ctx.effect(() => () => {
    disposed = true
    for (const ws of wss.clients ?? []) { try { ws.terminate() } catch {} }
    for (const term of terminals) { try { term.kill() } catch {} }
    terminals.clear()
    try { wss.close() } catch {}
  }, 'dsh-worktable: terminal sessions')
```

#### 缺口

- 未同版Windows Web/Desktop/模型与绑定全链、存储满/晚到/撤权运行
  **影响**：不能持续采用或保证多项目无损/权限即时撤销
  **进一步探讨**：两个独立非敏感项目矩阵，核实际文件/拒绝/终端和退出，记录人工/资源成本。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 内容generation与可见撤销收据能补什么？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是在当前身份manifest上再绑定产物内容摘要/生成version，并将撤销落盘/失败待处理显示给用户；不是再加projectId/bindingId，也不宣称变成文件沙箱。已有身份校验、begin回滚及preview stillValid是强基线，增量只针对共享真实文件晚到变化与撤销持久漂移。

用同目录双项目、旧writer晚到、重绑/刷新、localStorage满、preview revoke网络失败和身份撤销既有WS对照，测错误接受/误认已撤销及人工恢复。若现有路径足够、摘要也跟旧内容一起被重写或收据状态漂移增负担，则否定。未实际实施/运行，不计已有创新或保证。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/client/widgetMount.ts:93-121](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/client/widgetMount.ts#L93-L121)

身份已全但撤销/内容缺口。

<details>
<summary>查看原文（29行）</summary>

```text
  revokePane(projectId: string, paneId: string) {
    const b = this.records[projectId]?.[paneId]
    if (!b || !b.enabled) return
    this.records[projectId] = { ...this.records[projectId], [paneId]: { ...b, enabled: false } }
    try { this.persist() } catch { /* Revocation takes effect in memory even if storage is full. */ }
  }
  revokeProject(projectId: string) {
    if (!this.records[projectId]) return
    for (const b of this.entries(projectId)) this.revokePane(projectId, b.paneId)
  }
  isCurrent(binding: WidgetBinding, spec: WidgetSpec | null | undefined, folder: string | undefined): boolean {
    const current = this.records[binding.projectId]?.[binding.paneId]
    return !!current?.enabled && current.bindingId === binding.bindingId && current.sessionId === binding.sessionId &&
      current.folder === folder && binding.folder === folder && spec?.id === binding.projectId &&
      widgetTargets(spec).filter((t) => t.pane.id === binding.paneId).length === 1
  }
  resolve(binding: WidgetBinding, raw: string, spec: WidgetSpec | null | undefined, folder: string | undefined):
    { target: WidgetTarget; item: { kind: 'html' | 'url' | 'file'; path: string } } | null {
    if (!this.isCurrent(binding, spec, folder)) return null
    try {
      const d = JSON.parse(raw)
      if (!d || Array.isArray(d) || d.version !== 2 || d.projectId !== binding.projectId ||
          d.paneId !== binding.paneId || d.bindingId !== binding.bindingId || d.window !== binding.window ||
          !['html', 'url', 'file'].includes(d.kind) || typeof d.path !== 'string' || !d.path.trim()) return null
      const target = widgetTargets(spec).find((t) => t.pane.id === binding.paneId)!
      return { target, item: { kind: d.kind, path: d.path.trim() } }
    } catch { return null }
  }
}
```

</details>

**依据 2 · 源码核查**：[01_content/src/index.ts:493-510](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/index.ts#L493-L510)

真实文件写无版本是反证来源。

<details>
<summary>查看原文（18行）</summary>

```text
  register({
    kind: 'exact',
    path: '/api/worktable/write',
    handler: async (req: any, res: any) => {
      try {
        if (req.method !== 'POST') { res.writeHead(405); res.end(); return }
        const body = await readJsonBody(req)
        const p = typeof body.path === 'string' ? body.path : ''
        const content = typeof body.content === 'string' ? body.content : ''
        if (!p) { json(res, 400, { error: 'missing path' }); return }
        if (content.length > 20 * 1024 * 1024) { json(res, 413, { error: 'content too large' }); return }
        const abs = pathResolve(p)
        await import('node:fs/promises').then((m) => m.writeFile(abs, content, 'utf8'))
        json(res, 200, { ok: true })
      } catch (err) {
        json(res, (err as any).status ?? 500, { error: String(err) })
      }
    },
```

</details>

**依据 3 · 源码核查**：[01_content/src/previewFiles.ts:57-66](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/previewFiles.ts#L57-L66)

已有实际身份复核是基线。

<details>
<summary>查看原文（10行）</summary>

```text
          && other.ctimeNs === before.ctimeNs
        const stillValid = async () => {
          const current = await realpath(canonical)
          if (current !== canonical || !inside(mount.root, current)) return false
          const named = await stat(current, { bigint: true })
          const opened = await handle.stat({ bigint: true })
          return sameFile(named) && sameFile(opened)
            && mounts.get(token) === mount && now() - mount.touched < IDLE_MS
        }
        const tooLarge = () => Object.assign(new Error('file too large'), { status: 413 })
```

</details>

#### 缺口

- 未实施generation/撤销收据和故障对照
  **影响**：不能认定降低错挂或恢复负担
  **进一步探讨**：隔离矩阵比错误接受/持久复活/总恢复人工，无净改善不扩展。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
