# SkillHub for DSH

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[a681e43](https://github.com/iflytek/skillhub/tree/a681e43ea6e3cc3929d9d38a5208c10ef1569554/plugins/dsh)

<!-- BEGIN META -->
[![GitHub ★ 5,347](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C347&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/iflytek/skillhub) [![npm 30d 1,055](https://img.shields.io/static/v1?label=npm+30d&message=1%2C055&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@astron-team/skillhub-dsh) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@astron-team/skillhub-dsh)
<!-- END META -->

> **功能**：在 DSH 内搜索、安装和管理 SkillHub 技能。

> **亮点**：将目录、确认范围、安装回执和当前可用性衔接到 DSH；技能服务本身不归插件。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：精确 Host/Client/Node 组合限制写入；回执或文件存在不等于当前技能可用，也不证明技能安全。[Q03](#research-q03)

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
  - [Q01 · DSH 用户如何发现并使用 SkillHub 技能？](#detail-section-11)
  - [Q02 · 对话安装如何区分请求、选择和完成？](#detail-section-12)
  - [Q03 · 宿主兼容和安装状态有哪些硬边界？](#detail-section-13)
  - [Q04 · 采用需要哪些条件和退路？](#detail-section-14)
  - [Q05 · 如何检验安装回执和真实可用性差异？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 中发现、安装并复用技能的用户；基线是手工查找、审阅与复制技能。[Q01](#research-q01)

手工从来源审阅技能并安装到明确用户或项目位置。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 技能发现 | 查找和选择候选 | 外来内容须审阅 |
| 安装确认 | 明确版本与范围 | 接受不等于完成 |
| 兼容门 | 限制不匹配宿主写入 | 精确版本矩阵 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容 DSH Host/Client 与 Node | 写入必需 | 安装及 UI | 禁用写入 |
| SkillHub 服务 | 搜索必需 | 候选来源 | 不安装 |
| 用户审核与明确范围 | 安装必需 | 控制技能与位置 | 停止 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 搜索 | 选择明确候选 | 歧义不写入 |
| 确认 | 核对版本和范围 | 不符则取消 |
| 核验 | 对照回执与宿主发现 | 状态未知则停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 网络及 Host 资源 | 版本与来源审查 | 兼容矩阵有限 |
| 持续 | 服务与模型费用未知 | 技能更新和权限审查 | 节时未测 |
| 恢复 | 状态和文件维护 | 核对回执及实际发现 | 安装成功不等于可用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 确认 | 描述与 UI 提供范围 | 模型实际遵守 |
| 写入兼容 | 新写入重验依赖 | 真实安装成功 |

> **思考**：精确 Host/Client/Node 组合限制写入；回执或文件存在不等于当前技能可用，也不证明技能安全。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将目录、确认范围、安装回执和当前可用性衔接到 DSH；技能服务本身不归插件。[Q01](#research-q01) [Q02](#research-q02)

每次新写入重验 Host、Client 和 Node；用户明确请求、来源与操作状态仍须核对。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

精确 Host/Client/Node 组合限制写入；回执或文件存在不等于当前技能可用，也不证明技能安全。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

测试 profile 选择明确候选并核验范围、回执和发现；不兼容或歧义时停止写入。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子组件源码支持工具契约和兼容门；未运行 Host、服务、模型或安装。

- 已检查：作者 README、包清单、源码路径 plugins/dsh/README.md、plugins/dsh/package.json、plugins/dsh/src/host/install-tool.ts、plugins/dsh/src/client/install-dialog.tsx、plugins/dsh/src/host/runtime-compatibility.ts、plugins/dsh/src/host/compatibility.ts 及固定范围 inventory；组件：plugins/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子组件 inventory 259 个指定扩展名文件、无排除或解析错误；静态核查工具、确认和兼容门，未运行宿主。
- 下一步：固定 Host、Client 与服务，在隔离 profile 核验确认、取消、安装与当前可用性。

**分析版本**

- **仓库**：[iflytek/skillhub](https://github.com/iflytek/skillhub)
- **版本号**：0.6.1（[固定提交 a681e43](https://github.com/iflytek/skillhub/tree/a681e43ea6e3cc3929d9d38a5208c10ef1569554)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：在确认与当前可用性之间显示同一来源、版本和状态可降低误判；须对照现有诊断验证。[Q05](#research-q05)

固定 Host、Client 与服务，在隔离 profile 核验确认、取消、安装与当前可用性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .cjs | source | 1 | 6 | 6 | 0 | — |
| .md | source | 3 | 519 | — | — | 10468 |
| .ts | source | 53 | 4901 | 4454 | 167 | — |
| .mjs | source | 2 | 666 | 621 | 32 | — |
| .tsx | source | 35 | 3813 | 3672 | 56 | — |
| .ts | test | 79 | 7584 | 7138 | 151 | — |
| .tsx | test | 13 | 961 | 898 | 17 | — |
| .mjs | test | 72 | 6721 | 6614 | 67 | — |
| .md | test | 1 | 522 | — | — | 18300 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/iflytek/skillhub/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：SkillHub DSH 插件如何管理明确技能安装，兼容和状态边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 用户如何发现并使用 SkillHub 技能？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

该子组件让 DSH 用户搜索、查看并管理 SkillHub 技能，按用户或项目范围安装和使用；替代是手动寻找、审阅、复制技能文件。作者说明使用入口先核对当前会话的唯一可用安装，填充可编辑草稿而不自动发送；这减少来源与位置的交接，但搜索结果不等同可信或适合安装。SkillHub 服务与仓库其他组件不归本插件实现。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:1-23](https://github.com/iflytek/skillhub/blob/a681e43ea6e3cc3929d9d38a5208c10ef1569554/plugins/dsh/README.md#L1-L23)

作者描述搜索、范围和使用边界。

<details>
<summary>查看原文（23行）</summary>

```text
# SkillHub for DeepSeek Harness

[English](README.en.md)

SkillHub 的 DSH 原生插件。在 DSH 侧栏打开 **技能中心**，匿名浏览、搜索、查看技能详情，并管理安装、升级和卸载；对话中也可搜索和明确请求安装技能。插件内置本地安装核心，无需另装 SkillHub CLI。

`0.2.0` 新增来源可核验的搜索安装状态：广场卡片和对话工具可识别当前来源的受管理安装版本、用户/项目范围及异常记录；对话保留查询时快照。未发现本来源记录不代表其他市场或手工安装不存在，文件存在也不代表 DSH 已启用该技能。按来源、命名空间和技能标识匹配；不按同名目录认领其他来源技能。

`0.2.1` 缺省连接 `https://skill.xfyun.cn`；显式空串或仅空白仍表示断开，已有自定义地址保留。插件不继承 CLI 的默认地址或凭证。

`0.4.0` 使用独立标签 `dsh-v0.4.0`，提供技能案例与原生输入框衔接、对话管理已安装技能及按安装位置独立维护版本。保留 `0.3.1` 的双 RC 兼容范围。公开可用状态以 npm 为准；本地构建的 tarball 可按下文独立验证。

`0.5.0` 新增技能卡片及对话中的只读可用性诊断，分别报告文件完整性、宿主发现和调用策略，保留 `0.4.0` 的兼容范围及库存格式。

`0.6.1` 包含受管理技能启停、统一只读检查更新，以及横向已安装卡片和更多菜单。共享库存继续使用 v2，不要求用户同步升级 CLI；已通过与 CLI 0.2.0 的真实旧包兼容验收。公开可用状态以 npm 为准。

## 使用已安装技能

市场、已安装列表和对话中的日常列表均按技能展示。点击“使用技能”，由 Host 核验当前会话实际可用的唯一安装；不会让用户猜安装位置。技能中心入口在同一工作区新建对话，对话内入口保留当前会话。案例显示在原生输入框上方，确认案例或自定义任务后填入可编辑草稿；不会自动发送、调用模型或覆盖原会话草稿。

已安装卡片的更多菜单中，“管理安装”进入技能详情，右侧直接展示每个位置的版本和状态，可明确使用此位置、检查更新、启停或卸载。全停用或状态无法确认时先进入管理安装。安装范围放在安装确认的高级选项中，未安装技能仍默认安装到当前用户。

需要当前活动会话。被项目同名技能覆盖、本地文件变更、禁止用户调用或会话/来源变化时会提示原因；历史回执不能代替当前安装状态。此功能自 `0.4.0` 起提供。
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/package.json:1-8](https://github.com/iflytek/skillhub/blob/a681e43ea6e3cc3929d9d38a5208c10ef1569554/plugins/dsh/package.json#L1-L8)

DSH 子包身份与版本。

```text
{
  "name": "@astron-team/skillhub-dsh",
  "version": "0.6.1",
  "private": false,
  "type": "module",
  "license": "Apache-2.0",
  "packageManager": "bun@1.3.13",
  "scripts": {
```

#### 缺口

- 未运行 DSH、SkillHub 服务或安装
  **影响**：不能证明模型遵守工具说明、写入与技能可用
  **进一步探讨**：固定 Host/Client 和服务，在隔离 profile 验证确认、安装及取消

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 对话安装如何区分请求、选择和完成？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

安装工具的描述要求用户明确请求并唯一选择；未指定范围默认用户，项目范围需明确指定，接受操作不等于完成，后续通过回执查状态。安装确认对话针对当前会话和选择重新读取；这约束设计意图与 UI 流程，但工具描述本身不是证明模型必然遵守，真实 Host 确认和写入行为仍需验收。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/src/host/install-tool.ts:45-56](https://github.com/iflytek/skillhub/blob/a681e43ea6e3cc3929d9d38a5208c10ef1569554/plugins/dsh/src/host/install-tool.ts#L45-L56)

工具声明明确请求、选择、范围与回执边界。

<details>
<summary>查看原文（12行）</summary>

```text
export function registerInstallTool(tools: Pick<Context['tools'], 'get' | 'register'>, install: (
  request: ConversationInstallRequest, context: ConversationSearchContext, signal: AbortSignal,
) => Promise<NativeOperation | PendingConversationInstall | CancelledConversationInstall | undefined>) {
  if (tools.get(INSTALL_TOOL_NAME)) throw new Error('SkillHub install tool name is already registered.');
  return tools.register(defineTool({
    name: INSTALL_TOOL_NAME,
    description: 'Install a SkillHub skill only when the user explicitly requests installation. Searching or asking about a skill is not an install request. If multiple candidates match and the user says "that skill", "the document skill", or otherwise does not uniquely identify one, ask which namespace/slug or result number they mean and stop without calling this tool. Never pick the first, a random, or an arbitrary selectionRef. An explicit request to install does not resolve an ambiguous target. Keep selectionRef, toolCallId, operationId, hostInstanceId, and sourceRevision internal to tool calls and correlation; never display them or ask the user to copy them. Describe the skill by namespace/slug, version, and current status. For a prior search/detail choice use its selectionRef; opening the detail UI is not required because the Host verifies the exact selected version before installation; never replace an expired or missing reference with coordinates. Use namespace and slug only for a new complete coordinate explicitly supplied by the user. Pass scope only when the user explicitly specifies current user or current project. When the user has not specified scope, omit it: the Host defaults to current user so this user can use it across projects. Only supply project when explicitly requested. Never choose an ambiguous skill. This tool does not upgrade, uninstall, or run skills. An accepted result is not installation success. The DSH installation result card checks completion for the user; use astron_skillhub_operation with the returned receipt to query status. After acceptance, summarize that installation has started and direct the user to that card. Do not use shell commands, filesystem inspection, invented tools, or another install call to check progress.',
    parameters: {
      selectionRef: { type: 'string', description: 'Host-issued reference for the selected search/detail item. Mutually exclusive with namespace and slug.' },
      namespace: { type: 'string', description: 'Namespace of a newly specified complete coordinate. Requires slug; no selectionRef.' },
      slug: { type: 'string', description: 'Slug of a newly specified complete coordinate. Requires namespace; no selectionRef.' },
      scope: { type: 'string', enum: ['user', 'project'], description: 'Only supply user/project when explicitly requested by the user; otherwise omit to default to current user. Never supply file paths.' },
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/src/client/install-dialog.tsx:10-36](https://github.com/iflytek/skillhub/blob/a681e43ea6e3cc3929d9d38a5208c10ef1569554/plugins/dsh/src/client/install-dialog.tsx#L10-L36)

确认界面重新读取与已确认范围。

<details>
<summary>查看原文（27行）</summary>

```text
/** A fresh, identity-bound read for confirmation; no navigation or write on opening. */
export function SkillInstallDialog({ client, identity, load, services, initiatedFrom, close, onManage }: {
  client: QueryClient; identity: string; load(signal: AbortSignal): Promise<{ detail: SkillDetail; sourceRevision: string }>;
  services: InstallationServices; initiatedFrom: HostInstallRequest['initiatedFrom']; close(): void; onManage?(item: InstalledSkillList['items'][number]): void;
}) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const opener = useRef(typeof document === 'undefined' ? null : document.activeElement);
  return <div ref={setContainer} className="skillhub-controls"><NativeControlStyles />{container && <Dialog open onOpenChange={open => { if (!open) close(); }}>
    <DialogContent className="astron-sh-dialog astron-sh-dialog-expanded" container={container} onCloseAutoFocus={event => { event.preventDefault(); if (opener.current instanceof HTMLElement && opener.current.isConnected) opener.current.focus(); }}>
      <DialogTitle>安装技能</DialogTitle><DialogDescription>选择技能的可用范围</DialogDescription>
      <QueryClientProvider client={client}><Content identity={identity} load={load} services={services} initiatedFrom={initiatedFrom} close={close} onManage={onManage} /></QueryClientProvider>
    </DialogContent>
  </Dialog>}</div>;
}
function Content({ identity, load, services, initiatedFrom, close, onManage }: {
  identity: string; load(signal: AbortSignal): Promise<{ detail: SkillDetail; sourceRevision: string }>;
  services: InstallationServices; initiatedFrom: HostInstallRequest['initiatedFrom']; close(): void; onManage?(item: InstalledSkillList['items'][number]): void;
}) {
  const [job, setJob] = useState<InstallationProgressJob | null>(null);
  const result = useQuery({ queryKey: ['skillhub-install-confirmation', services.sessionId, identity], gcTime: 0, retry: false,
    refetchOnWindowFocus: false, refetchOnReconnect: false, queryFn: ({ signal }) => load(signal) });
  if (result.isPending) return <><p role="status">正在核验技能版本与安装位置…</p><Button onClick={close}>取消</Button></>;
  if (result.isError) return <><p role="alert">无法读取安装信息，请重新选择技能或重试。</p><div className="astron-sh-dialog-actions"><Button onClick={close}>取消</Button><Button onClick={() => { void result.refetch(); }}>重试</Button></div></>;
  return <div className="astron-sh-install-dialog-layout"><div>
    <div className="astron-sh-install-dialog-identity"><SkillAvatar name={result.data.detail.title} namespace={result.data.detail.namespace} slug={result.data.detail.slug} />
      <div><strong>{result.data.detail.title}</strong><p>@{result.data.detail.namespace}/{result.data.detail.slug} · {result.data.detail.version}</p></div></div>
    {job ? <><dl className="astron-sh-install-confirmed-scope"><dt>安装范围</dt><dd>{job.scope === 'project' ? '仅此项目' : '所有项目'}</dd></dl>
```

</details>

#### 缺口

- 未运行 DSH、SkillHub 服务或安装
  **影响**：不能证明模型遵守工具说明、写入与技能可用
  **进一步探讨**：固定 Host/Client 和服务，在隔离 profile 验证确认、安装及取消

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 宿主兼容和安装状态有哪些硬边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Node 检查仅接受 24.2 及以上的 Node 24，且每次写入时重新验证 Host 和 Client 解析；Host 依赖必须与所支持的 DSH 版本和 Cordis 组合一致，不能验证或不匹配时禁用本地写入。作者说明目录只认当前来源，未发现记录不代表其他来源不存在；文件存在也不证明宿主已启用。锁定版本及回执减少误选，但不能证明技能本身安全或业务效果。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh/src/host/runtime-compatibility.ts:6-13](https://github.com/iflytek/skillhub/blob/a681e43ea6e3cc3929d9d38a5208c10ef1569554/plugins/dsh/src/host/runtime-compatibility.ts#L6-L13)

Node 基线拒绝写入。

```text
/** Candidate runtime range, validated at its lower bound and current Node 24 release. */
export const nodeRuntimeRange = '>=24.2.0 <25';

export function assertNodeRuntime(version = process.versions.node): void {
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(version);
  if (!match || Number(match[1]) !== 24 || Number(match[2]) < 2) {
    throw new Error('Node runtime baseline does not match; local writes are disabled.');
  }
```

**依据 2 · 源码核查**：[plugins/dsh/src/host/runtime-compatibility.ts:60-75](https://github.com/iflytek/skillhub/blob/a681e43ea6e3cc3929d9d38a5208c10ef1569554/plugins/dsh/src/host/runtime-compatibility.ts#L60-L75)

每次新写入重验运行时。

<details>
<summary>查看原文（16行）</summary>

```text
/** Read the current Host resolution and Client graph on each new write; never cache acceptance. */
export function assertRuntimeCompatibility(
  services: RuntimeServices,
  parentURL: string,
  readClientManifest: (file: string, name: string) => unknown = clientManifest,
  readHostManifest: (file: string) => unknown = file => JSON.parse(readFileSync(file, 'utf8')),
): SupportedDshVersion {
  try {
    assertNodeRuntime();
    const readPackage = (name: string, parent: string) => {
      const actual = services.packageOf(name, parent);
      if (actual?.name !== name || !actual.manifestPath) throw new Error('Runtime package mismatch');
      // packageOf caches metadata until a resolution generation is replaced.
      const current = readHostManifest(actual.manifestPath);
      if (!current || typeof current !== 'object' || !('name' in current) || !('version' in current)
        || current.name !== name || current.version !== actual.version) throw new Error('Runtime manifest mismatch');
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/src/host/compatibility.ts:20-46](https://github.com/iflytek/skillhub/blob/a681e43ea6e3cc3929d9d38a5208c10ef1569554/plugins/dsh/src/host/compatibility.ts#L20-L46)

Host 依赖和组合检查。

<details>
<summary>查看原文（27行）</summary>

```text
/** Only combinations exercised together by the native Host smoke are accepted. */
export const cordisFamilies = [
  { '@deepseek-ai/cordis': '4.0.4', '@deepseek-ai/cordis-plugin-loader': '1.0.5',
    '@deepseek-ai/cordis-plugin-include': '1.0.9', '@deepseek-ai/cordis-plugin-timer': '1.1.6' },
  { '@deepseek-ai/cordis': '4.0.5', '@deepseek-ai/cordis-plugin-loader': '1.0.6',
    '@deepseek-ai/cordis-plugin-include': '1.0.10', '@deepseek-ai/cordis-plugin-timer': '1.1.7' },
] as const;

const require = createRequire(import.meta.url);
export function assertHostDependencies(readManifest: (name: string) => unknown = name => require(`${name}/package.json`)): SupportedDshVersion {
  let release: unknown;
  let cordis: unknown;
  for (const name of Object.keys(hostDependencyBaseline)) {
    let manifest: unknown;
    try { manifest = readManifest(name); }
    catch { throw new Error('Host dependency baseline could not be verified; local writes are disabled.'); }
    if (!manifest || typeof manifest !== 'object' || !('name' in manifest) || !('version' in manifest)
      || manifest.name !== name || (name === '@deepseek-ai/cordis'
        ? !cordisFamilies.some(family => family['@deepseek-ai/cordis'] === manifest.version)
        : !supportedDshVersions.some(candidate => candidate === manifest.version) || (release !== undefined && manifest.version !== release))) {
      throw new Error('Host dependency baseline does not match; local writes are disabled.');
    }
    if (name === '@deepseek-ai/cordis') cordis = manifest.version;
    else release = manifest.version;
  }
  if (release === '0.2.1-rc.2' && cordis !== '4.0.5') {
    throw new Error('Host dependency baseline does not match; local writes are disabled.');
```

</details>

**依据 4 · 作者声明**：[plugins/dsh/README.md:5-9](https://github.com/iflytek/skillhub/blob/a681e43ea6e3cc3929d9d38a5208c10ef1569554/plugins/dsh/README.md#L5-L9)

作者说明来源和安装状态边界。

```text
SkillHub 的 DSH 原生插件。在 DSH 侧栏打开 **技能中心**，匿名浏览、搜索、查看技能详情，并管理安装、升级和卸载；对话中也可搜索和明确请求安装技能。插件内置本地安装核心，无需另装 SkillHub CLI。

`0.2.0` 新增来源可核验的搜索安装状态：广场卡片和对话工具可识别当前来源的受管理安装版本、用户/项目范围及异常记录；对话保留查询时快照。未发现本来源记录不代表其他市场或手工安装不存在，文件存在也不代表 DSH 已启用该技能。按来源、命名空间和技能标识匹配；不按同名目录认领其他来源技能。

`0.2.1` 缺省连接 `https://skill.xfyun.cn`；显式空串或仅空白仍表示断开，已有自定义地址保留。插件不继承 CLI 的默认地址或凭证。
```

#### 缺口

- 未运行 DSH、SkillHub 服务或安装
  **影响**：不能证明模型遵守工具说明、写入与技能可用
  **进一步探讨**：固定 Host/Client 和服务，在隔离 profile 验证确认、安装及取消

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用需要哪些条件和退路？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需兼容的 DSH Host/Client/Node、SkillHub 目录以及明确技能来源和安装范围；用户仍需审阅外来技能权限与内容。先在测试 profile 搜索一个明确候选，确认版本与用户/项目范围，再核对安装回执、实际发现和启用；版本不匹配、来源歧义或结果无法核实则停止写入并回退手动审核。网络、维护和模型成本未测；作者列出的既有验收不是本轮执行。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:26-40](https://github.com/iflytek/skillhub/blob/a681e43ea6e3cc3929d9d38a5208c10ef1569554/plugins/dsh/README.md#L26-L40)

作者列出兼容矩阵和验收范围。

<details>
<summary>查看原文（15行）</summary>

```text
## 环境与验证范围

| 项目 | 要求或范围 |
| --- | --- |
| DSH | `0.2.0-rc.2` 或 `0.2.1-rc.2`；Host、app-boot 与注入 Client 模块必须属于同一精确发行版 |
| Cordis | `0.2.0-rc.2` 保留以下两组完整组合；`0.2.1-rc.2` 仅使用 `4.0.5 / 1.0.6 / 1.0.10 / 1.1.7` |
| Host Node | `>=24.2.0 <25`；不能使用 Node 24.0.0 |
| 开发包管理器 | Bun `1.3.13`，按锁文件安装 |
| 当前 UI | 中文；支持 DSH 深浅主题和窄屏 |
| 已验证环境 | Linux 两版 DSH Host 严格安装、原生探针及浏览器用户/项目安装、升级、卸载与取消；Windows 浏览器访问真实 Host 的界面和交互 |
| 验证边界 | 功能实现已进行真实模型对话及跨平台 CI；构建产物与公开包的验收分别记录。真实桌面客户端、原生 Windows/macOS 人工交互和 SaaS 验收不由这些结果替代 |

Windows 浏览器验证不等于 Windows 原生 Host 的全部文件操作已经验证。CI 的平台矩阵也不替代真实桌面、模型及目标实例验收。完整支持边界见仓库内的 [兼容设计](../../openspec/changes/add-dsh-native-plugin/compatibility-design.md) 和 [验收标准](../../openspec/changes/add-dsh-native-plugin/acceptance.md)。

`0.3.1` 包含已合并的 [Issue #981 兼容修复](https://github.com/iflytek/skillhub/pull/988)；已发布的 `0.3.0` 不包含此修复。其他 RC、未来发行版、混装模块和 Host/Client 版本不一致均拒绝新写入。可选 `userQuestions` 按宿主服务是否可用启用，缺失时仍回退插件确认框；其版本不属于必需写入门禁。两个已列 RC 的问答 API 一致，peer 声明允许二者，不据此承诺其他版本兼容。
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/src/host/install-tool.ts:45-56](https://github.com/iflytek/skillhub/blob/a681e43ea6e3cc3929d9d38a5208c10ef1569554/plugins/dsh/src/host/install-tool.ts#L45-L56)

明确目标和范围。

<details>
<summary>查看原文（12行）</summary>

```text
export function registerInstallTool(tools: Pick<Context['tools'], 'get' | 'register'>, install: (
  request: ConversationInstallRequest, context: ConversationSearchContext, signal: AbortSignal,
) => Promise<NativeOperation | PendingConversationInstall | CancelledConversationInstall | undefined>) {
  if (tools.get(INSTALL_TOOL_NAME)) throw new Error('SkillHub install tool name is already registered.');
  return tools.register(defineTool({
    name: INSTALL_TOOL_NAME,
    description: 'Install a SkillHub skill only when the user explicitly requests installation. Searching or asking about a skill is not an install request. If multiple candidates match and the user says "that skill", "the document skill", or otherwise does not uniquely identify one, ask which namespace/slug or result number they mean and stop without calling this tool. Never pick the first, a random, or an arbitrary selectionRef. An explicit request to install does not resolve an ambiguous target. Keep selectionRef, toolCallId, operationId, hostInstanceId, and sourceRevision internal to tool calls and correlation; never display them or ask the user to copy them. Describe the skill by namespace/slug, version, and current status. For a prior search/detail choice use its selectionRef; opening the detail UI is not required because the Host verifies the exact selected version before installation; never replace an expired or missing reference with coordinates. Use namespace and slug only for a new complete coordinate explicitly supplied by the user. Pass scope only when the user explicitly specifies current user or current project. When the user has not specified scope, omit it: the Host defaults to current user so this user can use it across projects. Only supply project when explicitly requested. Never choose an ambiguous skill. This tool does not upgrade, uninstall, or run skills. An accepted result is not installation success. The DSH installation result card checks completion for the user; use astron_skillhub_operation with the returned receipt to query status. After acceptance, summarize that installation has started and direct the user to that card. Do not use shell commands, filesystem inspection, invented tools, or another install call to check progress.',
    parameters: {
      selectionRef: { type: 'string', description: 'Host-issued reference for the selected search/detail item. Mutually exclusive with namespace and slug.' },
      namespace: { type: 'string', description: 'Namespace of a newly specified complete coordinate. Requires slug; no selectionRef.' },
      slug: { type: 'string', description: 'Slug of a newly specified complete coordinate. Requires namespace; no selectionRef.' },
      scope: { type: 'string', enum: ['user', 'project'], description: 'Only supply user/project when explicitly requested by the user; otherwise omit to default to current user. Never supply file paths.' },
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/src/host/compatibility.ts:29-46](https://github.com/iflytek/skillhub/blob/a681e43ea6e3cc3929d9d38a5208c10ef1569554/plugins/dsh/src/host/compatibility.ts#L29-L46)

依赖不匹配关闭写入。

<details>
<summary>查看原文（18行）</summary>

```text
export function assertHostDependencies(readManifest: (name: string) => unknown = name => require(`${name}/package.json`)): SupportedDshVersion {
  let release: unknown;
  let cordis: unknown;
  for (const name of Object.keys(hostDependencyBaseline)) {
    let manifest: unknown;
    try { manifest = readManifest(name); }
    catch { throw new Error('Host dependency baseline could not be verified; local writes are disabled.'); }
    if (!manifest || typeof manifest !== 'object' || !('name' in manifest) || !('version' in manifest)
      || manifest.name !== name || (name === '@deepseek-ai/cordis'
        ? !cordisFamilies.some(family => family['@deepseek-ai/cordis'] === manifest.version)
        : !supportedDshVersions.some(candidate => candidate === manifest.version) || (release !== undefined && manifest.version !== release))) {
      throw new Error('Host dependency baseline does not match; local writes are disabled.');
    }
    if (name === '@deepseek-ai/cordis') cordis = manifest.version;
    else release = manifest.version;
  }
  if (release === '0.2.1-rc.2' && cordis !== '4.0.5') {
    throw new Error('Host dependency baseline does not match; local writes are disabled.');
```

</details>

#### 缺口

- 未运行 DSH、SkillHub 服务或安装
  **影响**：不能证明模型遵守工具说明、写入与技能可用
  **进一步探讨**：固定 Host/Client 和服务，在隔离 profile 验证确认、安装及取消

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验安装回执和真实可用性差异？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：对同一候选并列显示来源版本、确认范围、已落盘和当前宿主发现/调用策略，可能减少将历史回执当当前可用的误判。已有兼容门、确认对话和作者描述的可用性诊断是反证，新增视图不能证明技能内容安全。对照现有界面模拟 Host 版本不符、项目同名覆盖、文件变更及操作中断，测误判、恢复时间和隐私成本；无改善则否定。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh/README.md:13-23](https://github.com/iflytek/skillhub/blob/a681e43ea6e3cc3929d9d38a5208c10ef1569554/plugins/dsh/README.md#L13-L23)

作者说明已有可用性诊断与覆盖边界。

<details>
<summary>查看原文（11行）</summary>

```text
`0.5.0` 新增技能卡片及对话中的只读可用性诊断，分别报告文件完整性、宿主发现和调用策略，保留 `0.4.0` 的兼容范围及库存格式。

`0.6.1` 包含受管理技能启停、统一只读检查更新，以及横向已安装卡片和更多菜单。共享库存继续使用 v2，不要求用户同步升级 CLI；已通过与 CLI 0.2.0 的真实旧包兼容验收。公开可用状态以 npm 为准。

## 使用已安装技能

市场、已安装列表和对话中的日常列表均按技能展示。点击“使用技能”，由 Host 核验当前会话实际可用的唯一安装；不会让用户猜安装位置。技能中心入口在同一工作区新建对话，对话内入口保留当前会话。案例显示在原生输入框上方，确认案例或自定义任务后填入可编辑草稿；不会自动发送、调用模型或覆盖原会话草稿。

已安装卡片的更多菜单中，“管理安装”进入技能详情，右侧直接展示每个位置的版本和状态，可明确使用此位置、检查更新、启停或卸载。全停用或状态无法确认时先进入管理安装。安装范围放在安装确认的高级选项中，未安装技能仍默认安装到当前用户。

需要当前活动会话。被项目同名技能覆盖、本地文件变更、禁止用户调用或会话/来源变化时会提示原因；历史回执不能代替当前安装状态。此功能自 `0.4.0` 起提供。
```

</details>

**依据 2 · 源码核查**：[plugins/dsh/src/client/install-dialog.tsx:10-36](https://github.com/iflytek/skillhub/blob/a681e43ea6e3cc3929d9d38a5208c10ef1569554/plugins/dsh/src/client/install-dialog.tsx#L10-L36)

已有确认和当前身份读取。

<details>
<summary>查看原文（27行）</summary>

```text
/** A fresh, identity-bound read for confirmation; no navigation or write on opening. */
export function SkillInstallDialog({ client, identity, load, services, initiatedFrom, close, onManage }: {
  client: QueryClient; identity: string; load(signal: AbortSignal): Promise<{ detail: SkillDetail; sourceRevision: string }>;
  services: InstallationServices; initiatedFrom: HostInstallRequest['initiatedFrom']; close(): void; onManage?(item: InstalledSkillList['items'][number]): void;
}) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const opener = useRef(typeof document === 'undefined' ? null : document.activeElement);
  return <div ref={setContainer} className="skillhub-controls"><NativeControlStyles />{container && <Dialog open onOpenChange={open => { if (!open) close(); }}>
    <DialogContent className="astron-sh-dialog astron-sh-dialog-expanded" container={container} onCloseAutoFocus={event => { event.preventDefault(); if (opener.current instanceof HTMLElement && opener.current.isConnected) opener.current.focus(); }}>
      <DialogTitle>安装技能</DialogTitle><DialogDescription>选择技能的可用范围</DialogDescription>
      <QueryClientProvider client={client}><Content identity={identity} load={load} services={services} initiatedFrom={initiatedFrom} close={close} onManage={onManage} /></QueryClientProvider>
    </DialogContent>
  </Dialog>}</div>;
}
function Content({ identity, load, services, initiatedFrom, close, onManage }: {
  identity: string; load(signal: AbortSignal): Promise<{ detail: SkillDetail; sourceRevision: string }>;
  services: InstallationServices; initiatedFrom: HostInstallRequest['initiatedFrom']; close(): void; onManage?(item: InstalledSkillList['items'][number]): void;
}) {
  const [job, setJob] = useState<InstallationProgressJob | null>(null);
  const result = useQuery({ queryKey: ['skillhub-install-confirmation', services.sessionId, identity], gcTime: 0, retry: false,
    refetchOnWindowFocus: false, refetchOnReconnect: false, queryFn: ({ signal }) => load(signal) });
  if (result.isPending) return <><p role="status">正在核验技能版本与安装位置…</p><Button onClick={close}>取消</Button></>;
  if (result.isError) return <><p role="alert">无法读取安装信息，请重新选择技能或重试。</p><div className="astron-sh-dialog-actions"><Button onClick={close}>取消</Button><Button onClick={() => { void result.refetch(); }}>重试</Button></div></>;
  return <div className="astron-sh-install-dialog-layout"><div>
    <div className="astron-sh-install-dialog-identity"><SkillAvatar name={result.data.detail.title} namespace={result.data.detail.namespace} slug={result.data.detail.slug} />
      <div><strong>{result.data.detail.title}</strong><p>@{result.data.detail.namespace}/{result.data.detail.slug} · {result.data.detail.version}</p></div></div>
    {job ? <><dl className="astron-sh-install-confirmed-scope"><dt>安装范围</dt><dd>{job.scope === 'project' ? '仅此项目' : '所有项目'}</dd></dl>
```

</details>

**依据 3 · 源码核查**：[plugins/dsh/src/host/compatibility.ts:29-46](https://github.com/iflytek/skillhub/blob/a681e43ea6e3cc3929d9d38a5208c10ef1569554/plugins/dsh/src/host/compatibility.ts#L29-L46)

已有依赖门控。

<details>
<summary>查看原文（18行）</summary>

```text
export function assertHostDependencies(readManifest: (name: string) => unknown = name => require(`${name}/package.json`)): SupportedDshVersion {
  let release: unknown;
  let cordis: unknown;
  for (const name of Object.keys(hostDependencyBaseline)) {
    let manifest: unknown;
    try { manifest = readManifest(name); }
    catch { throw new Error('Host dependency baseline could not be verified; local writes are disabled.'); }
    if (!manifest || typeof manifest !== 'object' || !('name' in manifest) || !('version' in manifest)
      || manifest.name !== name || (name === '@deepseek-ai/cordis'
        ? !cordisFamilies.some(family => family['@deepseek-ai/cordis'] === manifest.version)
        : !supportedDshVersions.some(candidate => candidate === manifest.version) || (release !== undefined && manifest.version !== release))) {
      throw new Error('Host dependency baseline does not match; local writes are disabled.');
    }
    if (name === '@deepseek-ai/cordis') cordis = manifest.version;
    else release = manifest.version;
  }
  if (release === '0.2.1-rc.2' && cordis !== '4.0.5') {
    throw new Error('Host dependency baseline does not match; local writes are disabled.');
```

</details>

#### 缺口

- 未运行 DSH、SkillHub 服务或安装
  **影响**：不能证明模型遵守工具说明、写入与技能可用
  **进一步探讨**：固定 Host/Client 和服务，在隔离 profile 验证确认、安装及取消

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
