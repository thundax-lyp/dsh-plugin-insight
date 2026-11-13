# FlowX for DeepSeek Harness

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[317e261](https://github.com/AIpRoBuilder/FlowX/tree/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx)

<!-- BEGIN META -->
[![GitHub ★ 202](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=202&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AIpRoBuilder/FlowX)
<!-- END META -->

> **功能**：在 DSH Web 侧栏查看 FlowX 工作流、依赖图与流程文件。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，查看器把流程索引、计划图和发布资料带入 DSH 的同一界面，底层解析复用 FlowX SDK。

> **主要限制**：[Q03](#research-q03) 确认界面只提供浏览和设置，但宿主仍保留实际构建 API，且调用者身份依赖宿主的共享 Fetch 入口。

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
  - [Q01 · 从 DSH 查看已有 FlowX 流程，相对直接打开目录有哪些增量？](#detail-section-11)
  - [Q02 · 查看器如何读工作区、绘图并限制文件路径？](#detail-section-12)
  - [Q03 · 只读界面与宿主 API 的权限及依赖边界分别是什么？](#detail-section-13)
  - [Q04 · 怎样用一个无敏感内容的流程验证采用收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 FlowX 项目的 DSH Web 使用者可从对话旁查看当前计划图和已发布流程资料。

直接从 FlowX 工作区和 JSON 查看同样的原始内容，无需在 DSH 另建浏览入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 流程查看 | 浏览已有计划和发布资料 | 依赖可信 SDK 和工作区 |
| 文件浏览 | 查看允许的流程文本 | 路径、类型和大小限制 |
| 兼容 API | 供既有调用者执行构建 | 依赖宿主 owner 鉴权，浏览界面无对应控制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 固定 DSH Web 与 Node | 必需 | 加载两端入口 | 版本不匹配可能无法挂载 |
| 可信 Python 与 FlowX SDK | 查看必需 | 检查本地流程 | 报配置或检查错误 |
| 宿主 owner 认证 | 必需 | 控制兼容 API 的调用人 | 不能安全暴露 |
| FlowX Skill 与 provider | 兼容构建所需 | 启动流程生成 | 不能执行对应构建 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在隔离宿主配置可信 Python 与测试工作区 | 只含无敏感流程 |
| 查看 | 从侧栏选择流程并查看依赖 | 区分计划与发布且证据一致 |
| 退出 | 禁用挂载并检查工作区变化 | 恢复本地文件查看 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载与环境资源未知 | 配置解释器和工作区 | 实际耗时未知 |
| 持续 | SDK 启动及可能 provider 费用未知 | 核对计划、发布和路径 | 单次等待待测 |
| 恢复 | 环境重建费用未知 | 停止挂载并查意外写入 | 构建若已触发需另查结果 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 图与文件关联 | 同面板呈现依赖及发布资料 | 是否更快识别关系 |
| 权限与读取 | 共用宿主入口且文件读取检查范围 | 部署实际身份边界 |
| 运行负担 | 查看由 Python 子进程执行 | 实际等待、费用与故障率 |

> **思考**：[Q03](#research-q03) 确认界面只提供浏览和设置，但宿主仍保留实际构建 API，且调用者身份依赖宿主的共享 Fetch 入口。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，查看器把流程索引、计划图和发布资料带入 DSH 的同一界面，底层解析复用 FlowX SDK。

固定源码分开显示计划与已发布修订，浏览文件检查真实路径和打开后身份，异步界面检查代次。兼容构建仍然能修改流程状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 确认界面只提供浏览和设置，但宿主仍保留实际构建 API，且调用者身份依赖宿主的共享 Fetch 入口。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 只建议已有 FlowX 的使用者在隔离环境观察，先核实 owner 请求边界，再比较一个无敏感样例。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持界面、宿主挂载及文件浏览机制。宿主身份、SDK 与实际收益仍待验证。

- 已检查：作者 README、包清单、源码路径 plugins/deepseek-harness-flowx/package.json、plugins/deepseek-harness-flowx/cordis.patch.yml、plugins/deepseek-harness-flowx/index.js、plugins/deepseek-harness-flowx/client.js、plugins/deepseek-harness-flowx/host/service.js 及固定范围 inventory；组件：plugins/deepseek-harness-flowx。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定仓库子包，检查查看、浏览与构建入口。未执行实际宿主、Python、模型调用或端到端访问测试。
- 下一步：在隔离主机分别验证 owner 与非 owner 请求，比较同一个测试流程的手工与界面查看，核对文件前后状态。

**分析版本**

- **仓库**：[AIpRoBuilder/FlowX](https://github.com/AIpRoBuilder/FlowX)
- **版本号**：0.1.0（[固定提交 317e261](https://github.com/AIpRoBuilder/FlowX/tree/317e261c51fcef600aa145485138f1d6f96f0f82)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 的待验证假设是计划和发布并列能减少误读及查找时间。若额外配置抵消收益或无法区分两者，放弃假设。

在隔离主机分别验证 owner 与非 owner 请求，比较同一个测试流程的手工与界面查看，核对文件前后状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1313 | 1153 | 103 | — |
| .md | source | 1 | 215 | — | — | 1723 |
| .js | test | 2 | 2228 | 2095 | 40 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AIpRoBuilder/FlowX/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/AIpRoBuilder/FlowX/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/AIpRoBuilder/FlowX/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版 FlowX 查看器能为已有流程项目增加什么，浏览与兼容构建 API 在宿主上各有什么权限和运行负担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 从 DSH 查看已有 FlowX 流程，相对直接打开目录有哪些增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 FlowX 流程的 DSH Web 使用者可以从侧栏按钮打开覆盖层，查看流程目录、当前依赖图以及已发布的节点资料。客户端把当前计划图与已发布修订并列标识，图只更新时两者可能不同。合格查看结果是能在不离开对话的情况下，指出正确计划中的一个依赖及相应发布修订。与用文本编辑器打开原始 JSON 相比，增量是图和相关文件入口集中；实际创建、演进和运行仍依赖 FlowX 自身工具。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/deepseek-harness-flowx/README.md:8-21](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/README.md#L8-L21)

作者定位为查看器，且说明保留兼容构建 API。

<details>
<summary>查看原文（14行）</summary>

```text
# FlowX for DeepSeek Harness

The web-profile interface is an owner-only, **read-only workflow viewer**. The
**FlowX** sidebar footer action opens a left-side overlay without replacing the
conversation; it overlays part of the window instead of adding a native,
resizable sidebar column. The overlay lists workflows, renders the current
plan graph with node descriptions, and browses the workflow directory. It is a
UI and host integration, **not an agent tool**. Use the separately installed
[FlowX workflow skill](https://github.com/AIpRoBuilder/FlowX/tree/main/skills/flowx-workflows)
to create, evolve, and run workflows.

The viewer intentionally has no **Start a build**, repair, or evolve controls.
The authenticated host API retains build endpoints for existing host
compatibility, but the browser interface does not surface them.
```

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness-flowx/client.js:232-248](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/client.js#L232-L248)

界面分列修订、当前计划与文件浏览。

<details>
<summary>查看原文（17行）</summary>

```text
          error && h('div', { role: 'alert', style: styles.notice }, error),
          h('section', { style: styles.card, 'aria-labelledby': 'flowx-workflows-heading' },
            h('div', { style: { ...styles.row, justifyContent: 'space-between', marginBottom: 10 } }, h('h2', { id: 'flowx-workflows-heading', style: styles.heading }, 'Workflows'), h('button', { type: 'button', style: styles.button, disabled: !!busy, onClick: refresh }, 'Refresh')),
            busy === 'list' ? h('p', { role: 'status', style: styles.muted }, 'Loading workflows…') : catalog && workflows.length === 0 ? h('p', { style: styles.muted }, 'No workflows found in this workspace.') :
              h('div', { style: { display: 'grid', gap: 6 } }, workflows.map(([id, info]) => h('button', { key: id, type: 'button', style: { ...styles.button, textAlign: 'left', background: workflow === id ? '#f0f3ff' : '#fff', overflowWrap: 'anywhere' }, disabled: !!busy, 'aria-pressed': workflow === id, onClick: () => inspect(id) }, id, h('span', { style: { ...styles.muted, display: 'block', fontWeight: 400 } }, `Published revision ${info?.workflow_version ?? '—'} · ${Object.keys(info?.nodes || {}).length} listed nodes`))))),
          workflow && h('section', { style: styles.card, 'aria-labelledby': 'flowx-explorer-heading' },
            h('p', { style: styles.eyebrow }, 'Workflow explorer'), h('h2', { id: 'flowx-explorer-heading', style: { ...styles.heading, overflowWrap: 'anywhere' } }, workflow),
            busy === 'inspect' && h('p', { role: 'status', style: styles.muted }, 'Loading workflow and graph…'),
            artifacts && h(React.Fragment, null,
              h('p', { style: { ...styles.muted, marginBottom: 10 } }, `Published workflow revision ${artifacts.workflow_version ?? '—'}`),
              h('div', { style: styles.row }, artifactButton('Requirement', artifacts.requirement), artifactButton('Main entrypoint', artifacts.main_entrypoint?.path), artifactButton('Graph JSON', artifacts.graph)),
              h('h3', { style: { ...styles.heading, marginTop: 16 } }, 'Current plan dependency graph'),
              h('p', { style: { ...styles.muted, marginBottom: 10 } }, 'Published artifacts may differ after graph-only updates. Select a node for details.'),
              graphError ? h('div', { role: 'alert', style: styles.notice }, graphError) : graph ? h(Graph, { model: graph, selected: selectedNode, onSelect: setSelectedNode }) : !artifacts.graph ? h('p', { style: styles.muted }, 'No graph artifact is available.') : null,
              node && h('div', { style: { marginTop: 12, padding: 12, border: '1px solid #e3e9f5', borderRadius: 10 } }, h('h3', { style: styles.heading }, node.name), h('p', { style: { ...styles.muted, whiteSpace: 'pre-wrap' } }, node.desc || 'No description provided.'), h('p', { style: { ...styles.muted, marginTop: 8 } }, `Status: ${node.enabled ? 'Enabled' : 'Disabled'} · Depends on: ${node.depends.length ? node.depends.join(', ') : 'None'}`), nodeArtifacts && h('p', { style: styles.muted }, `Node ID: ${nodeArtifacts.node_id} · Published node revision ${nodeArtifacts.version}`), h('div', { style: { ...styles.row, marginTop: 8 } }, nodeArtifacts && Object.entries(nodeArtifacts.artifacts || {}).sort(([a], [b]) => compare(a, b)).map(([label, path]) => artifactButton(label, path)))),
              h('h3', { style: { ...styles.heading, marginTop: 18 } }, 'Workflow folder'),
              h('p', { style: { ...styles.muted, marginBottom: 8 } }, 'Expand folders and open supported text files.'),
```

</details>

**依据 3 · 源码核查**：[plugins/deepseek-harness-flowx/client.js:259-278](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/client.js#L259-L278)

侧栏入口和覆盖面板连接。

<details>
<summary>查看原文（20行）</summary>

```text
    return {
      inject: ['slots', 'layout'],
      apply(ctx) {
        let open = false, listeners = new Set(), savedListeners = new Set(), trigger = null;
        const publish = value => { open = value; for (const listener of listeners) listener(value); };
        const close = () => { publish(false); trigger?.focus(); };
        const subscribeSaved = listener => { savedListeners.add(listener); return () => savedListeners.delete(listener); };
        const notifySaved = () => { for (const listener of savedListeners) listener(); };
        function Launcher({ wide }) {
          const [expanded, setExpanded] = useState(open);
          useEffect(() => { listeners.add(setExpanded); return () => listeners.delete(setExpanded); }, []);
          return h('button', { type: 'button', title: 'FlowX workflows', 'aria-label': 'FlowX workflows', 'aria-expanded': expanded, 'aria-controls': 'flowx-overlay', onClick: event => { trigger = event.currentTarget; if (!open && trigger.closest('[role="dialog"][aria-modal="true"]')) { trigger = trigger.ownerDocument.querySelector('[data-sidebar-opener]') || trigger; ctx.layout.toggleSidebar(); } publish(!open); }, style: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', border: 0, borderRadius: 8, background: expanded ? 'rgba(100, 115, 210, .16)' : 'transparent', color: 'inherit', cursor: 'pointer', font: 'inherit' } }, h(Icon), wide && h('span', null, 'FlowX'));
        }
        function Overlay() {
          const [expanded, setExpanded] = useState(open);
          useEffect(() => { listeners.add(setExpanded); return () => listeners.delete(setExpanded); }, []);
          return expanded ? h(Page, { call: callFlowX, close, subscribeSaved, notifySaved }) : null;
        }
        ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({ name: 'sidebar.footer.action', id: 'flowx', order: 100 }, Launcher));
        ctx.slots.inject('shell.overlay', () => ctx.slots.register({ name: 'shell.overlay', id: 'flowx', order: 100 }, Overlay));
```

</details>

#### 缺口

- 未运行实际宿主和样例图
  **影响**：不能确认查找更快或复杂图更清楚
  **进一步探讨**：比较同一流程的原始 JSON 与 DSH 查看器任务

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 查看器如何读工作区、绘图并限制文件路径？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

选择流程先请求 inspect，再用宿主返回的 artifact 路径读取图，旧请求返回时用界面代次检查避免覆盖后一次选择。宿主调用指定 Python 运行 SDK，检查退出状态、结构和输出上限，超时尝试停止子进程。通过 artifact 接口必须先获得当前根的映射。文件读取检查相对路径、可接受文本扩展、真实路径仍在流程目录且与候选一致，再以只读方式打开并核对设备与 inode；目录浏览另拒绝符号链接、秘密路径并限制扫描。源码试图控制浏览范围与简单链接绕过，外部 SDK 行为与竞争场景仍需单独核实。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/deepseek-harness-flowx/client.js:158-176](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/client.js#L158-L176)

选中流程后再读取图并隔离陈旧响应。

<details>
<summary>查看原文（19行）</summary>

```text
      const inspect = async id => {
        if (busy || operation.current) return;
        clearExplorer(); const ticket = generation.current;
        setWorkflow(id); setError(''); setBusy('inspect'); operation.current = 'inspect';
        try {
          const result = await call('inspect', { workflowId: id });
          if (!mounted.current || ticket !== generation.current) return;
          if (!result?.artifacts || typeof result.artifacts !== 'object') throw new Error('The workflow artifact map is invalid.');
          setArtifacts(result.artifacts);
          if (result.artifacts.graph) {
            try {
              const file = await call('readArtifact', { workflowId: id, path: result.artifacts.graph });
              const model = graphModel(JSON.parse(file.content));
              if (mounted.current && ticket === generation.current) setGraph(model);
            } catch (failure) { if (mounted.current && ticket === generation.current) setGraphError(`Unable to load graph: ${failure.message || 'Invalid graph.'}`); }
          }
        } catch (failure) { if (mounted.current && ticket === generation.current) setError(failure.message || 'Unable to inspect workflow.'); }
        finally { operation.current = ''; if (mounted.current && ticket === generation.current) setBusy(''); }
        if (mounted.current && ticket === generation.current) loadFolder(id, '', ticket);
```

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness-flowx/host/service.js:711-735](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/host/service.js#L711-L735)

SDK 子进程、超时与返回校验。

<details>
<summary>查看原文（25行）</summary>

```text
  async runInspection(config, operation, id) {
    if (this.closed) throw problem('disposed', 'The plugin has been disposed.');
    const args = ['-c', INSPECT_CODE, config.root, operation];
    if (id) args.push(id);
    const child = this.spawnChild(config.interpreter, args, config.savedSettings);
    child.stdin.end();
    return new Promise((resolve, reject) => {
      let chunks = [], size = 0, failure = null;
      const timer = setTimeout(() => { failure = problem('inspection-timeout', 'Workflow inspection timed out.'); this.stopChild(child); }, this.inspectTimeoutMs);
      child.stdout.on('data', chunk => {
        size += chunk.length;
        if (size > LIMIT && !failure) { failure = problem('inspection-failed', 'Workflow inspection output exceeded the limit.'); chunks = []; this.stopChild(child); }
        else if (!failure) chunks.push(chunk);
      });
      child.stdout.on('error', () => { failure ||= problem('inspection-failed', 'Workflow inspection output failed.'); this.stopChild(child); });
      child.on('error', () => { failure ||= problem('inspection-failed', 'Workflow inspection could not be started.'); });
      child.once('close', code => {
        clearTimeout(timer);
        if (failure) return reject(failure);
        try {
          const data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)));
          if (code !== 0 || !object(data) || data.ok !== true || data.operation !== operation || !Object.hasOwn(data, 'data')) throw new Error();
          resolve(data.data);
        } catch { reject(problem('inspection-failed', 'Workflow inspection failed.')); }
      });
```

</details>

**依据 3 · 源码核查**：[plugins/deepseek-harness-flowx/host/service.js:817-843](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/host/service.js#L817-L843)

路径、文件类型及打开后复核。

<details>
<summary>查看原文（27行）</summary>

```text
  async readMapped(root, id, relative, graph = false, { browse = false } = {}) {
    if (!relativeArtifact(relative) || !TEXT_TYPES.has(path.extname(relative).toLowerCase())) throw problem('artifact-unavailable', 'The artifact is unavailable or unsafe.');
    let file;
    try {
      const directory = await this.workflowRoot(root, id);
      const candidate = path.join(directory, ...relative.split('/'));
      const real = await fs.realpath(candidate);
      if (!inside(directory, real) || real !== candidate) throw new Error();
      const before = await fs.stat(real);
      if (!before.isFile() || before.size > LIMIT) throw new Error();
      file = await fs.open(real, constants.O_RDONLY | (constants.O_NOFOLLOW || 0) | (constants.O_NONBLOCK || 0));
      const opened = await file.stat();
      if (!opened.isFile() || opened.size > LIMIT || (browse && opened.nlink !== 1) || opened.dev !== before.dev || opened.ino !== before.ino || await fs.realpath(candidate) !== real) throw new Error();
      const buffer = Buffer.alloc(LIMIT + 1);
      let offset = 0;
      while (offset < buffer.length) {
        const { bytesRead } = await file.read(buffer, offset, buffer.length - offset, offset);
        if (!bytesRead) break;
        offset += bytesRead;
      }
      if (offset > LIMIT) throw new Error();
      const source = new TextDecoder('utf-8', { fatal: true }).decode(buffer.subarray(0, offset));
      if (browse && /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(source)) throw new Error();
      // All JSON and JSON-shaped text gets structural redaction, including graph
      // aliases and escaped credentials. Invalid JSON fails closed.
      const structured = graph || (browse && (path.extname(relative).toLowerCase() === '.json' || /^\s*[\[{]/.test(source)));
      let content = structured ? this.sanitizeGraph(source) : this.redact(source);
```

</details>

**依据 4 · 源码核查**：[plugins/deepseek-harness-flowx/host/service.js:857-872](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/host/service.js#L857-L872)

artifact 访问依赖当前根和检查结果。

<details>
<summary>查看原文（16行）</summary>

```text
  async readArtifact(id, relative) {
    if (settingsWrites) throw busy();
    if (buildOwner) {
      if (this.graphSnapshot?.workflowId === id && this.graphSnapshot.path === relative) return { ...this.graphSnapshot, cached: true };
      throw busy();
    }
    return this.withInspection(async config => {
      const entry = this.artifacts.get(id);
      if (!entry || entry.root !== config.root || !this.pathsIn(entry.map).has(relative)) throw problem('artifact-unavailable', 'Inspect the workflow before reading one of its listed artifacts.');
      return this.readMapped(config.root, id, relative, relative === entry.map.graph);
    });
  }

  safeFolderPath(relative) {
    return relative === '' || (relativeArtifact(relative) && relative.split('/').every(part =>
      !part.startsWith('.') && !SECRET_PATH.test(part) && this.safeIdentifier(part)));
```

</details>

**依据 5 · 源码核查**：[plugins/deepseek-harness-flowx/host/service.js:894-925](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/host/service.js#L894-L925)

目录扫描边界及链接拒绝。

<details>
<summary>查看原文（32行）</summary>

```text
  async folderDirectory(directory, relative) {
    try {
      const candidate = relative ? path.join(directory, ...relative.split('/')) : directory;
      if ((relative && !inside(directory, candidate)) || await fs.realpath(candidate) !== candidate || !(await fs.lstat(candidate)).isDirectory()) throw new Error();
      return candidate;
    } catch { throw problem('artifact-unavailable', 'The workflow directory is unavailable or unsafe.'); }
  }

  async listFolder(id, relative) {
    return this.withInspection(async config => {
      if (!this.safeFolderPath(relative)) throw problem('artifact-unavailable', 'The workflow directory is unavailable or unsafe.');
      const directory = await this.folderWorkflow(config, id);
      const target = await this.folderDirectory(directory, relative);
      const entries = [];
      let scanned = 0, metadata = 0, probed = 0, truncated = false;
      try {
        const before = await fs.lstat(target);
        const handle = await fs.opendir(target);
        for await (const item of handle) {
          if (++scanned > FOLDER_SCAN_LIMIT) { truncated = true; break; }
          const itemPath = relative ? `${relative}/${item.name}` : item.name;
          if (!this.safeFolderPath(itemPath) || item.isSymbolicLink()) continue;
          const candidate = path.join(target, item.name);
          let stat;
          try {
            stat = await fs.lstat(candidate);
            if (stat.isSymbolicLink() || (!stat.isDirectory() && !stat.isFile()) || await fs.realpath(candidate) !== candidate) continue;
          } catch { continue; }
          if (entries.length >= FOLDER_ENTRY_LIMIT) { truncated = true; break; }
          const isDirectory = stat.isDirectory();
          let readable = isDirectory;
          if (!isDirectory && stat.nlink === 1 && stat.size <= LIMIT && TEXT_TYPES.has(path.extname(item.name).toLowerCase())) {
```

</details>

#### 缺口

- 未实测链接竞争和 SDK 外部行为
  **影响**：不能把已检查浏览路径当完整文件沙箱
  **进一步探讨**：在可丢弃工作区检查普通文本、超限文件和越界链接

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读界面与宿主 API 的权限及依赖边界分别是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

固定插件声明 DSH 0.2.2-rc.1 与 Node 至少 24.9，主入口依赖 connection。路由注册在宿主共享 fetch 下，并把常量 OWNER 交给 dispatch，因此请求者是谁取决于宿主注册层，dispatch 的 owner 检查并不独立认证外部调用者。界面隐藏构建入口，但实际宿主 dispatch 包含 start、answer、abort 和保存设置，能启动兼容构建路径。插件也通过 SDK 做查看，需准备受信任的绝对 Python 与工作目录。作者说明模型配置不会从 DSH 自动继承；宿主子进程保留指定 provider 环境并可用保存的 key。子进程用 shell=false 和过滤环境降低暴露面，执行的解释器和脚本仍在宿主账号权限下。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/deepseek-harness-flowx/package.json:8-25](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/package.json#L8-L25)

宿主、Node 与包入口。

<details>
<summary>查看原文（18行）</summary>

```text
  "engines": {
    "dsh": "0.2.2-rc.1",
    "node": ">=24.9.0"
  },
  "main": "./index.js",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
```

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness-flowx/index.js:11-43](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/index.js#L11-L43)

共享 Fetch 挂载、请求缓冲限额、常量 owner 转交。

<details>
<summary>查看原文（33行）</summary>

```text
export const inject = ['connection'];

const LIMIT = 1024 * 1024;
const OWNER = { principal: { kind: 'owner' } };
const failure = (code, message) => ({ ok: false, error: { code: `flowx/${code}`, message, details: {} } });
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

export function apply(ctx) {
  const service = new FlowXHostService();
  // Harness authenticates the shared /api carrier and its exact-route registry
  // admits only owner principals. Do not mount this handler outside that boundary.
  ctx.connection.fetch.register({
    path: '/api/flowx', methods: ['POST'], requestBody: 'buffered',
    async fetch(request) {
      try {
        if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
          return json(failure('unsupported-media-type', 'Content type must be application/json.'), 415);
        }
        // Harness buffers first under its shared cap (300 MiB by default); this
        // route's smaller cap is enforced on the actual bytes, not the header.
        const bytes = await request.arrayBuffer();
        if (bytes.byteLength > LIMIT) return json(failure('request-too-large', 'Request body exceeds 1 MiB.'), 413);
        let body;
        try { body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
        catch { return json(failure('invalid-request', 'Invalid JSON request.'), 400); }
        if (!body || typeof body !== 'object' || Array.isArray(body) ||
            Object.keys(body).length !== 2 || !Object.hasOwn(body, 'endpoint') ||
            !Object.hasOwn(body, 'payload') || typeof body.endpoint !== 'string') {
          return json(failure('invalid-request', 'Expected endpoint and payload.'), 400);
        }
        return json(await service.dispatch(body.endpoint, body.payload, OWNER));
```

</details>

**依据 3 · 源码核查**：[plugins/deepseek-harness-flowx/host/service.js:152-179](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/host/service.js#L152-L179)

读取和写设置、构建操作共用 dispatcher。

<details>
<summary>查看原文（28行）</summary>

```text
  async dispatch(endpoint, payload, peer) {
    if (peer?.principal?.kind !== 'owner') return { ok: false, error: safeError(problem('forbidden', 'Only the owner may use FlowX.')) };
    try {
      if (this.closed) throw problem('disposed', 'The plugin has been disposed.');
      let value;
      switch (endpoint) {
        case 'status': if (payload !== null) throw invalid(); value = this.snapshot(); break;
        case 'getSettings': if (payload !== null) throw invalid(); value = await this.getSettings(); break;
        case 'saveSettings':
          if (!exact(payload, SAVE_KEYS) || !SAVE_KEYS.every(key => text(payload[key], 4096))) throw invalid();
          value = await this.saveSettings({ python: payload.python, workspace: payload.workspace, apiKey: payload.apiKey }); break;
        case 'start':
          if (!exact(payload, ['prompt']) || !text(payload.prompt) || !payload.prompt.trim()) throw invalid();
          value = await this.start(payload.prompt); break;
        case 'answer':
          if (!exact(payload, ['requestId', 'stepId', 'revision', 'input']) || !identifier(payload.requestId) || !identifier(payload.stepId) || !Number.isSafeInteger(payload.revision) || !text(payload.input)) throw invalid();
          if (Buffer.byteLength(JSON.stringify({ action: 'answer', step_id: payload.stepId, input: payload.input })) + 1 > LIMIT) throw invalid();
          value = this.respond(payload, false); break;
        case 'abort':
          if (!exact(payload, ['requestId', 'stepId', 'revision']) || !identifier(payload.requestId) || !identifier(payload.stepId) || !Number.isSafeInteger(payload.revision)) throw invalid();
          value = this.respond(payload, true); break;
        case 'list': if (payload !== null) throw invalid(); value = await this.list(); break;
        case 'inspect':
          if (!exact(payload, ['workflowId']) || !workflowId(payload.workflowId)) throw invalid();
          value = await this.inspect(payload.workflowId); break;
        case 'readArtifact':
          if (!exact(payload, ['workflowId', 'path']) || !workflowId(payload.workflowId) || !relativeArtifact(payload.path)) throw invalid();
          value = await this.readArtifact(payload.workflowId, payload.path); break;
```

</details>

**依据 4 · 源码核查**：[plugins/deepseek-harness-flowx/host/service.js:394-412](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/host/service.js#L394-L412)

解释器与工作区检查。

<details>
<summary>查看原文（19行）</summary>

```text
  async validateConfig(settings, createStorage) {
    const { workspace, python } = settings;
    if (![workspace, python].every(p => typeof p === 'string' && path.isAbsolute(p))) {
      throw problem('configuration', 'FLOWX_WORKSPACE and FLOWX_PYTHON must be absolute paths.');
    }
    let stage = 'workspace directory';
    try {
      // Execute the configured Python path, not its realpath: a venv's symlink
      // must remain argv[0] so Python discovers pyvenv.cfg and its packages.
      const root = await fs.realpath(workspace);
      if (!(await fs.stat(root)).isDirectory()) throw new Error();
      stage = 'executable Python interpreter (FLOWX_PYTHON)';
      const interpreter = path.normalize(python);
      if (!(await fs.stat(interpreter)).isFile()) throw new Error();
      await fs.access(interpreter, constants.X_OK);
      stage = 'workspace storage (workflows/ must be a real directory without symlinks)';
      await this.checkStorage(root, createStorage);
      return { root, interpreter };
    } catch { throw problem('configuration', `FlowX configuration is invalid: cannot use ${stage}.`); }
```

</details>

**依据 5 · 源码核查**：[plugins/deepseek-harness-flowx/host/service.js:434-448](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/host/service.js#L434-L448)

执行已配置解释器并保留部分环境。

<details>
<summary>查看原文（15行）</summary>

```text
  spawnChild(command, args, settings) {
    // Keep Python, proxy and provider configuration, but drop unrelated secrets.
    // Credential paths and the explicitly supported FlowX/LLM keys are retained.
    const env = Object.fromEntries(Object.entries(this.env).filter(([key, value]) => {
      const upper = key.toUpperCase();
      if (PROVIDER_CREDENTIALS.has(upper) || CREDENTIAL_PATHS.has(upper) || PROVIDER_URLS.has(upper)) return true;
      return !SECRET_ENV.test(key) && !(typeof value === 'string' && URL_CREDENTIALS.test(value));
    }));
    if (settings) {
      Object.assign(env, { FLOWX_PYTHON: settings.python, FLOWX_WORKSPACE: settings.workspace });
      if (settings.apiKey) env.FLOWX_LLM_API_KEY = settings.apiKey;
    }
    const child = this.spawn(command, args, { env, stdio: ['pipe', 'pipe', 'pipe'], shell: false, detached: process.platform !== 'win32' });
    this.children.add(child);
    // stderr can contain credentials and arbitrary test output: drain, never retain or log it.
```

</details>

**依据 6 · 源码核查**：[plugins/deepseek-harness-flowx/host/service.js:478-493](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/host/service.js#L478-L493)

实际兼容构建启动，使用 FlowX build 脚本。

<details>
<summary>查看原文（16行）</summary>

```text
    if (buildOwner || inspections || settingsWrites) throw busy();
    buildOwner = this;
    const run = { child: null, temp: null, terminal: null, failure: null, abortRequested: false, done: null };
    run.startFinished = new Promise(resolve => { run.finishStart = resolve; });
    this.active = run;
    this.update({ status: 'starting', workflowId: null, requestId: null, awaiting: null, result: null, error: null });
    try {
      const config = await this.config();
      run.temp = await fs.mkdtemp(path.join(os.tmpdir(), 'flowx-harness-'));
      const promptFile = path.join(run.temp, 'prompt.txt');
      await fs.writeFile(promptFile, prompt, { mode: 0o600, flag: 'wx' });
      if (this.closed) throw problem('disposed', 'The plugin has been disposed.');
      run.config = config;
      const buildScript = await this.buildScript();
      const child = this.spawnChild(config.interpreter, [buildScript, '--workspace', config.root, 'new', '--host', '127.0.0.1', '--prompt-file', promptFile], config.savedSettings);
      run.child = child;
```

</details>

**依据 7 · 作者声明**：[plugins/deepseek-harness-flowx/README.md:25-41](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/README.md#L25-L41)

作者要求固定宿主、Python SDK 与 provider 配置。

<details>
<summary>查看原文（17行）</summary>

```text
- DeepSeek Harness `dsh` **0.2.2-rc.1**, Node.js **24.9.0 or newer**, and
  `pnpm` on `PATH` for the CLI plugin installer. This package declares an
  exact Harness version, not compatibility with other releases. Only the web
  profile is supported; installing it does not install a Desktop plugin.
- Python **3.10 or newer** with the FlowX SDK and its dependencies installed in
  the interpreter used by the plugin. Installing this npm package does not
  install Python, the SDK, or the FlowX skill.
- The viewer and its settings need only the Python SDK. The FlowX skill is
  needed only by the retained build compatibility endpoints, which invoke its
  `build.py`.
- A provider and model with authorized API access. Export
  `FLOWX_LLM_API_KEY`, `FLOWX_LLM_PROVIDER`, and `FLOWX_LLM_MODEL` into the
  Harness host process environment before launch. Credentials are not entered
  in the viewer or saved in its settings; they may be inherited by spawned skill
  processes. The SDK and skill scripts do not automatically load a FlowX
  `.env` file; even inspection can require a provider key. Harness model
  settings do not automatically configure FlowX.
```

</details>

#### 缺口

- 未执行宿主共享 fetch 的身份测试及 provider 调用
  **影响**：无法从固定组件单独证明部署认证，实际查看成本也未知
  **进一步探讨**：在隔离宿主先确认非 owner 请求被拒绝，另确认查看不会触发构建

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样用一个无敏感内容的流程验证采用收益？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

已有 FlowX 且能隔离 DSH 账号与工作区的用户，可以用一个预先生成的非敏感流程测试查看。先配置受信任 Python 环境和只放测试数据的目录，验证宿主身份边界，再用查看器和原始文件分别定位一个依赖及发布修订。记录配置、查看、排查和退出时间，并检查工作区是否发生计划外写入。假设是集中视图减少来回查找，特别是在计划与发布不同步时。若看不清版本归属、SDK 配置耗时超过省下的查找时间，或者出现不预期写入或非 owner 能调用，则停止并禁用挂载，回到本地文件检查。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/deepseek-harness-flowx/client.js:239-248](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/client.js#L239-L248)

可观察计划与发布区分、失败与目录浏览。

<details>
<summary>查看原文（10行）</summary>

```text
            busy === 'inspect' && h('p', { role: 'status', style: styles.muted }, 'Loading workflow and graph…'),
            artifacts && h(React.Fragment, null,
              h('p', { style: { ...styles.muted, marginBottom: 10 } }, `Published workflow revision ${artifacts.workflow_version ?? '—'}`),
              h('div', { style: styles.row }, artifactButton('Requirement', artifacts.requirement), artifactButton('Main entrypoint', artifacts.main_entrypoint?.path), artifactButton('Graph JSON', artifacts.graph)),
              h('h3', { style: { ...styles.heading, marginTop: 16 } }, 'Current plan dependency graph'),
              h('p', { style: { ...styles.muted, marginBottom: 10 } }, 'Published artifacts may differ after graph-only updates. Select a node for details.'),
              graphError ? h('div', { role: 'alert', style: styles.notice }, graphError) : graph ? h(Graph, { model: graph, selected: selectedNode, onSelect: setSelectedNode }) : !artifacts.graph ? h('p', { style: styles.muted }, 'No graph artifact is available.') : null,
              node && h('div', { style: { marginTop: 12, padding: 12, border: '1px solid #e3e9f5', borderRadius: 10 } }, h('h3', { style: styles.heading }, node.name), h('p', { style: { ...styles.muted, whiteSpace: 'pre-wrap' } }, node.desc || 'No description provided.'), h('p', { style: { ...styles.muted, marginTop: 8 } }, `Status: ${node.enabled ? 'Enabled' : 'Disabled'} · Depends on: ${node.depends.length ? node.depends.join(', ') : 'None'}`), nodeArtifacts && h('p', { style: styles.muted }, `Node ID: ${nodeArtifacts.node_id} · Published node revision ${nodeArtifacts.version}`), h('div', { style: { ...styles.row, marginTop: 8 } }, nodeArtifacts && Object.entries(nodeArtifacts.artifacts || {}).sort(([a], [b]) => compare(a, b)).map(([label, path]) => artifactButton(label, path)))),
              h('h3', { style: { ...styles.heading, marginTop: 18 } }, 'Workflow folder'),
              h('p', { style: { ...styles.muted, marginBottom: 8 } }, 'Expand folders and open supported text files.'),
```

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness-flowx/host/service.js:711-735](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/host/service.js#L711-L735)

SDK 调用是额外启动与等待成本。

<details>
<summary>查看原文（25行）</summary>

```text
  async runInspection(config, operation, id) {
    if (this.closed) throw problem('disposed', 'The plugin has been disposed.');
    const args = ['-c', INSPECT_CODE, config.root, operation];
    if (id) args.push(id);
    const child = this.spawnChild(config.interpreter, args, config.savedSettings);
    child.stdin.end();
    return new Promise((resolve, reject) => {
      let chunks = [], size = 0, failure = null;
      const timer = setTimeout(() => { failure = problem('inspection-timeout', 'Workflow inspection timed out.'); this.stopChild(child); }, this.inspectTimeoutMs);
      child.stdout.on('data', chunk => {
        size += chunk.length;
        if (size > LIMIT && !failure) { failure = problem('inspection-failed', 'Workflow inspection output exceeded the limit.'); chunks = []; this.stopChild(child); }
        else if (!failure) chunks.push(chunk);
      });
      child.stdout.on('error', () => { failure ||= problem('inspection-failed', 'Workflow inspection output failed.'); this.stopChild(child); });
      child.on('error', () => { failure ||= problem('inspection-failed', 'Workflow inspection could not be started.'); });
      child.once('close', code => {
        clearTimeout(timer);
        if (failure) return reject(failure);
        try {
          const data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)));
          if (code !== 0 || !object(data) || data.ok !== true || data.operation !== operation || !Object.hasOwn(data, 'data')) throw new Error();
          resolve(data.data);
        } catch { reject(problem('inspection-failed', 'Workflow inspection failed.')); }
      });
```

</details>

**依据 3 · 源码核查**：[plugins/deepseek-harness-flowx/index.js:20-50](https://github.com/AIpRoBuilder/FlowX/blob/317e261c51fcef600aa145485138f1d6f96f0f82/plugins/deepseek-harness-flowx/index.js#L20-L50)

试用前应单独核验认证与允许操作。

<details>
<summary>查看原文（31行）</summary>

```text
export function apply(ctx) {
  const service = new FlowXHostService();
  // Harness authenticates the shared /api carrier and its exact-route registry
  // admits only owner principals. Do not mount this handler outside that boundary.
  ctx.connection.fetch.register({
    path: '/api/flowx', methods: ['POST'], requestBody: 'buffered',
    async fetch(request) {
      try {
        if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') {
          return json(failure('unsupported-media-type', 'Content type must be application/json.'), 415);
        }
        // Harness buffers first under its shared cap (300 MiB by default); this
        // route's smaller cap is enforced on the actual bytes, not the header.
        const bytes = await request.arrayBuffer();
        if (bytes.byteLength > LIMIT) return json(failure('request-too-large', 'Request body exceeds 1 MiB.'), 413);
        let body;
        try { body = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
        catch { return json(failure('invalid-request', 'Invalid JSON request.'), 400); }
        if (!body || typeof body !== 'object' || Array.isArray(body) ||
            Object.keys(body).length !== 2 || !Object.hasOwn(body, 'endpoint') ||
            !Object.hasOwn(body, 'payload') || typeof body.endpoint !== 'string') {
          return json(failure('invalid-request', 'Expected endpoint and payload.'), 400);
        }
        return json(await service.dispatch(body.endpoint, body.payload, OWNER));
      } catch {
        return json(failure('internal', 'The operation failed.'), 500);
      }
    },
  });
  // Connection owns its registration; this fiber separately owns subprocesses.
  ctx.effect(() => () => service.dispose(), 'flowx: host cleanup');
```

</details>

#### 缺口

- 未测配置时间、API 费用和任务耗时
  **影响**：仅能提出低风险范围的比较方案
  **进一步探讨**：固定同一流程和宿主逐项计时并对比工作区前后状态

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
