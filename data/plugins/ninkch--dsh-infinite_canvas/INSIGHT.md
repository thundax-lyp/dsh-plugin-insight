# dsh-infinite-canvas

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[fde7341](https://github.com/NINKCH/dsh-infinite_canvas/tree/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61)

<!-- BEGIN META -->
[![GitHub ★ 107](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=107&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/NINKCH/dsh-infinite_canvas) [![npm 30d 8,312](https://img.shields.io/static/v1?label=npm+30d&message=8%2C312&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ninkch/dsh-infinite-canvas) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ninkch/dsh-infinite-canvas)
<!-- END META -->

> **功能**：在 DSH 中以节点画布组织剧本、分镜、媒体生成和成片预览，并连接后期工具。

> **亮点**：把创意、设定、节点引用、迭代生成和后期交接集中于DSH，减少手工搬运并保留可见中间状态；已查公共编排和代表分支。[Q01](#research-q01)

> **主要限制**：单个运行槽读取即清空，触发不等于已运行，超时也不是失败；工作区文档与媒体分开，CLI工程交接未证明最终渲染，尚不支持无人值守采用。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 项目、节点和生成怎样从对话进入实际画布？](#detail-section-11)
  - [Q02 · 关闭画布、异步任务与本地项目有哪些限制？](#detail-section-12)
  - [Q03 · 交接到成片的依赖和成本如何影响采用与改进？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：连续短片创作者在同一项目中维护设定、分镜与媒体引用，结合对话改节点并在画布查看结果。[Q01](#research-q01)

生成网页与剪辑器本已能产出素材与视频；这里增量是项目图、共享设定和对话编排，不归因模型画质给画布。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 对话与项目图 | 组织设定/剧本/节点 | 宿主工具与Web同步，当前检查公共链 |
| 真实生成 | 按节点模型入库产物 | 自备模型端点，代表图片分支已查 |
| 运行状态 | 触发和轮询查询 | 单请求槽、客户端消费，非可靠后台队列 |
| 预览及后期 | 录制或XML/SRT交接 | 浏览器格式支持或ArtCraft/CLI，未实测 |
| 工作区项目 | 保存文档/记忆/绑定 | 媒体仍需另备数据根 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
|---|---|---|---|
| DSH Web、webServer/tools | 核心必需 | 工具与界面/RPC | 核心不可用 |
| 宿主0.2.0-rc.2+ | 作者声明 | 兼容目标 | 未验证其他版本 |
| 数据根、可写项目目录 | 保存媒体必需 | 文档与文件 | 工作区文档不含独立媒体 |
| 模型端点、密钥及额度 | 真生成必需 | 图片/视频/文本 | 无配置明确报错 |
| 浏览器MediaRecorder/解码器 | 预览合成必需 | 实时录制 | 无格式支持则报错，音频可降级 |
| ArtCraft>=0.3.0与FilmCraft CLI | 后期可选 | 工程导入和渲染 | 缺CLI不提交，参数需核验 |
| workspaceRegistry/skills | 绑定及技能条件 | 定位会话与指导 | 缺服务对应功能降级 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据与退路 |
|---|---|---|
| 准备 | 用户设数据根、模型与预算 | 文件可写、单端点可用 |
| 立项 | 对话建项目并复用节点 | 主画布可见，设定与连线正确 |
| 生成 | 保持画布客户端可运行，逐个触发 | 查本轮状态及真实资产，非只看triggered |
| 交接 | 先预览，再导出XML/SRT和提交CLI | 实查声音/画幅/最终文件 |
| 保全退出 | 另存工作区文档与媒体根 | 可往返重开，否则回原网页/剪辑器 |

**效果与成本**

#### 成本

| 阶段 | 现金与资源 | 人工与时间 | 已知与未知 |
|---|---|---|---|
| 首次 | 本地存储、模型账户与可选CLI | 配端点、目录和一个镜头 | 金额及安装时长未知 |
| 持续 | 文本/图/视频调用、下载与编码 | 选片、返工、维护引用 | 生成失败与重试可能仍花费 |
| 失败恢复 | 查询/重生成与保留媒体 | 核对taskId和本轮状态 | 非每种协议均证明可恢复 |
| 退出 | 媒体备份空间 | 同时带走文档与数据根 | 单拷工作区不全 |

#### 效果

| 效果项 | 当前支持 | 尚不能确定 |
|---|---|---|
| 工作组织 | 项目图、设定与对话改点 | 实际省时/连续性提升 |
| 生成接线 | 代表分支提交、入库和状态反馈 | 全厂商兼容、费用与质量 |
| 交付 | 浏览器录制和XML/SRT/CLI job入口 | 最终声音、渲染成功与商用质量 |

> **思考**：单个运行槽读取即清空，触发不等于已运行，超时也不是失败；工作区文档与媒体分开，CLI工程交接未证明最终渲染，尚不支持无人值守采用。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把创意、设定、节点引用、迭代生成和后期交接集中于DSH，减少手工搬运并保留可见中间状态；已查公共编排和代表分支。[Q01](#research-q01)

本轮状态过滤、任务id保留、失败还原旧稿和单文档原子写有价值；单运行槽、Web执行与分离媒体使后台和备份承诺需要明确边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

单个运行槽读取即清空，触发不等于已运行，超时也不是失败；工作区文档与媒体分开，CLI工程交接未证明最终渲染，尚不支持无人值守采用。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先保留原素材，单项目逐节点验证真实生成、任务恢复、媒体迁移和一个后期工程；记录费用与返工再决定是否扩大，当前观察。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持有限范围的媒体编排判断；多供应商、3D和真实后期渲染未验证，采用保持观察。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、cordis.patch.yml、index.js、client.js、skills.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查Host项目/工具/运行握手、Web消费和代表图片/脚本结果分支、存储边界与FilmCraft交接；未全面审计供应商、3D、更新安装、迁移及所有Skill，也未运行目标代码。
- 下一步：后续固定双触发与断连轨迹，再用单镜头真实媒体核费用、音轨与工程往返；本次仅固定源码。

**分析版本**

- **仓库**：[NINKCH/dsh-infinite_canvas](https://github.com/NINKCH/dsh-infinite_canvas)
- **版本号**：0.19.21（[固定提交 fde7341](https://github.com/NINKCH/dsh-infinite_canvas/tree/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是runId持久队列及消费确认，替代单槽与文档时间归因；断连和双触发若仍错绑或引入重扣费就否定。[Q03](#research-q03)

后续固定双触发与断连轨迹，再用单镜头真实媒体核费用、音轨与工程往返；本次仅固定源码。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 139 | 20648 | — | — | 399960 |
| .js | source | 8 | 34269 | 30073 | 4471 | — |
| .mjs | source | 90 | 17858 | 14463 | 2546 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/NINKCH/dsh-infinite_canvas/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/NINKCH/dsh-infinite_canvas/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/NINKCH/dsh-infinite_canvas/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对节点式媒体工作室从模型工具到浏览器生成再到交接工程的实际链路，以及后台运行和素材保全边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 项目、节点和生成怎样从对话进入实际画布？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

它面向短剧和连续媒体项目的创作者，把剧本、分镜、图片/视频和成片节点保存在可连接的项目图里。相比聊天复制到多个生成网页，贡献是同一项目的设定、引用和可见节点迭代，而不是新生成模型。bundle加入媒体创作预设，Host注册canvas工具和Skill provider，Web注册主面板及输入行绑定入口；项目创建保存文档并标记同步。canvas_generate_node实际先写运行请求，Web同步消费后切目标项目/画布并调用runGenNode。图片分支解析节点/默认模型，没有配置明确报错，通过apiImage向Host代理提交，再入库资产并更新节点；脚本分支带设定集和技能规则调用文本生成，非空后存稿，失败可恢复上一稿。这里只确认公共编排与图片代表分支、脚本结果流，不将所有厂商适配与3D预演一概算已验证。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-18](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/cordis.patch.yml#L1-L18)

bundle加入插件与媒体创作预设。

<details>
<summary>查看原文（18行）</summary>

```text
- insert:
    - id: infinite-canvas
      name: '@ninkch/dsh-infinite-canvas'
      config: {}
    - id: preset-media-studio
      name: '@deepseek-ai/dsh-agent-preset'
      config:
        id: media-studio
        name: 媒体创作
        description: 导演第一视角：无限画布（剧本/分镜/生成）+ ArtCraft 家族（剪辑/调色/混音/交付）端到端创作流水线
        # 内置预设已占用 order 1/2/3/4（standard=1, ptc=2, minimal=3, cordis=4），
        # 本预设取 5 以避免与 ptc 抢同一排序位。
        order: 5
        plugins:
          - id: persona
            name: '@deepseek-ai/dsh-persona'
            config:
              prefix: |
```

</details>

**依据 2 · 源码核查**：[index.js:2026-2059](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/index.js#L2026-L2059)

Skill候选、正文读取与provider注册。

<details>
<summary>查看原文（34行）</summary>

```text
function registerCanvasSkill(ctx, disposers) {
  const skills = ctx.get('skills');
  if (!skills || typeof skills.registerProvider !== 'function') return false;
  const candidates = [];
  for (const name of SKILL_NAMES) {
    const assetPath = path.join(HERE, 'assets', name, 'SKILL.md');
    if (!existsSync(assetPath)) continue;
    const { description } = parseSkillMd(readFileSync(assetPath, 'utf8'));
    if (!description) continue;
    candidates.push({
      name,
      description,
      invocation: { modelInvocable: true, userInvocable: true },
      provider: 'dsh-infinite-canvas',
      source: 'bundled',
      rank: SKILL_RANK,
      resourceBase: { kind: 'directory', path: path.dirname(assetPath) },
      locator: assetPath,
    });
  }
  if (!candidates.length) return false;
  const provider = {
    name: 'dsh-infinite-canvas',
    list: () => Promise.resolve(candidates),
    async get(c, options) {
      const { rank: _rank, locator, ...summary } = c;
      const raw = await fs.readFile(locator, { encoding: 'utf8', signal: options && options.signal });
      return { ...summary, content: parseSkillMd(raw).content };
    },
  };
  try {
    const off = skills.registerProvider(() => provider);
    if (typeof off === 'function') disposers.push(off);
    return true;
```

</details>

**依据 3 · 源码核查**：[index.js:2065-2086](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/index.js#L2065-L2086)

同名项目复用与保存/标记同步。

<details>
<summary>查看原文（22行）</summary>

```text
function canvasCreateProject(args) {
  const name = String((args && args.name) || '').trim();
  if (!name) throw new Error('需要项目名称');
  // 幂等保护：同名项目已存在 → 复用，绝不重复创建（Agent 重试或误调用都会走到这里）
  const existing = projectsList().find((p) => String(p.name).trim() === name);
  if (existing) {
    return { ok: true, projectId: existing.id, name: existing.name, reused: true, nodeId: null };
  }
  const id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const doc = { id, name: name.slice(0, 80), createdAt: Date.now(), updatedAt: Date.now(), source: 'agent', nodes: {}, edges: [], view: { x: 60, y: 40, scale: 1 } };
  const st = String((args && args.scriptText) || '');
  const out = String((args && args.scriptOutput) || '');
  if (st.trim() || out.trim()) {
    const pos = nextNodePos(doc);
    const n = agentNode('script', st, pos.x, pos.y, (args && args.nodeName) || defaultLabel(st || out));
    if (out.trim()) n.data.output = out; // 剧本节点：idea 与 output 同属一个节点，一次写全
    doc.nodes[n.id] = n;
  }
  mkdirSync(PROJECTS_DIR, { recursive: true });
  writeIcDoc(id, doc);
  markDocChanged(id);
  return { ok: true, projectId: id, name: doc.name, nodeId: Object.keys(doc.nodes)[0] || null };
```

</details>

**依据 4 · 源码核查**：[index.js:4247-4268](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/index.js#L4247-L4268)

生成工具注册到实际函数与返回文案。

<details>
<summary>查看原文（22行）</summary>

```text
          name: 'canvas_generate_node',
          description: '触发节点执行并（可选）等到结束——"改完提示词 → 点生成 → 拿结果"的一站式入口（等价于点画布上的生成按钮）。执行由画布侧用节点上配置的模型真实运行，**画布页面必须处于打开状态**；等待超时不代表失败（任务仍在继续，可用 canvas_node_status 继续查）。waitSeconds=0 表示只触发不等待；图片通常 30–120s，视频数分钟。',
          parameters: {
            type: 'object',
            properties: {
              projectId: { type: 'string', description: '项目 id' },
              canvasId: { type: 'string', description: '可选：画布 id（项目下的子画布；缺省 = 项目默认画布）' },
              nodeId: { type: 'string', description: '节点 id' },
              waitSeconds: { type: 'number', description: '可选：等待秒数（0=只触发；上限 600）' },
            },
            required: ['projectId', 'nodeId'],
            additionalProperties: false,
          },
          output: textOutput,
          timeoutMs: 660000,
          async execute(args) {
            const r = await canvasGenerateNode(args);
            const head = '🚀 已触发[' + r.type + ']「' + (r.label || r.nodeId) + '」';
            const tail = r.finished
              ? (r.ok ? '✅ 已完成（状态 ' + r.status + (r.assetId ? '，产物资产 ' + r.assetId : '') + '）' : '❌ 失败：' + (r.error || r.status))
              : '⏳ ' + (r.note || '仍在进行');
            return { ok: r.ok !== false, projectId: r.projectId, nodeId: r.nodeId, status: r.status || undefined, assetId: r.assetId || undefined, text: head + '。' + tail };
```

</details>

**依据 5 · 源码核查**：[client.js:21415-21441](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/client.js#L21415-L21441)

主画布和会话绑定入口。

<details>
<summary>查看原文（27行）</summary>

```text
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: PANEL_ID,
          order: 100,
          label: () => T('panel'),
          locale: NS,
        }, PanelIcon));
        // —— 会话↔画布绑定：composer 画布选择 chip（session 作用域槽位，Runner 标准属性免费给 sessionId）——
        // 旧 runner 没有 conversation.input.left 槽位：try/catch 静默降级（无 chip，画布面板走全局行为，功能缺席不炸插件）
        try {
          ctx.slots.inject('conversation.input.left', () => ctx.slots.register({
            name: 'conversation.input.left',
            id: 'infinite-canvas-binding',
            order: 40,
            locale: NS,
          }, SessionBindingChip));
        } catch { /* 旧 runner：绑定 chip 不可用（降级） */ }
        // 面板根：包一层错误边界——任何渲染期崩溃都不再白屏，而是显示可复制的错误卡片
        PanelErrorBoundary.__dshicClass = true; // 冒烟 walker 标记
    function PanelRoot() {
          return h(CanvasHostedApp, { host: 'main' });
        }
        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: PANEL_ID,
          locale: NS,
        }, PanelRoot));
```

</details>

**依据 6 · 源码核查**：[client.js:8810-8826](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/client.js#L8810-L8826)

消费请求、切画布、调用生成并刷新保存。

<details>
<summary>查看原文（17行）</summary>

```text
    async function handleRunRequest(runRequest) {
      const pid = runRequest.projectId;
      const nodeId = runRequest.nodeId;
      const wantCanvas = (runRequest.canvasId === undefined || runRequest.canvasId === null) ? null : String(runRequest.canvasId);
      if (pid && pid !== S.activeId && S.projects.some((p) => p.id === pid)) {
        switchProject(pid);
        revealCanvasInRight();
      }
      // 多画布：对话侧指定了子画布 → 先切到那个画布再找节点（否则会找不到节点/跑错画布）
      if (pid && pid === S.activeId && wantCanvas && wantCanvas !== activeCanvasId()) {
        switchCanvas(wantCanvas);
      }
      const node = S.graph.nodes[nodeId];
      if (!node) throw new Error('节点不存在: ' + nodeId);
      if (node.data && node.data.status === 'running') return; // 已在运行：不重复触发
      await runGenNode(node);
      flushSave();
```

</details>

**依据 7 · 源码核查**：[client.js:10642-10718](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/client.js#L10642-L10718)

设置运行中，分派及图片生成/入库/结果提交。

<details>
<summary>查看原文（77行）</summary>

```text
    async function runGenNode(n) {
      const type = n.type;
      const settings = loadSettings(); // 模型解析（供应商+模型）用
      const ctl = new AbortController();
      genAbort.ctl = ctl;
      genActive++;
      // 生成告警收集器：参考素材截断、厂商参数落空等"需要用户知道"的事实，一律挂到节点上（绝不静默）
      const addWarn = (msg) => {
        if (!msg) return;
        update((s) => {
          const nd = s.graph.nodes[n.id];
          if (!nd) return;
          const prev = String(nd.data.genWarn || '').trim();
          if (prev.includes(msg)) return;
          nd.data.genWarn = prev ? (prev + '；' + msg) : String(msg);
        });
      };
      update((s) => {
        const nd = s.graph.nodes[n.id];
        if (nd) { nd.data.status = 'running'; nd.data.error = null; nd.data.stopNote = null; nd.data.genWarn = null; }
        s.running = true; // 单节点触发（对话/节点按钮）也显示停止按钮
      });
      flushSave(); // 立刻落盘 + 推送 Host：切走画面/对话查询都能看到"运行中"
      try {
        if (type === 'script') { await genScriptNode(n); return true; }
        if (type === 'storyboard') { await genStoryboardNode(n); return true; }
        if (type === 'finalcut') { await genFinalCutNode(n); return true; }
        if (type !== 'image' && type !== 'video') throw new Error(T('nodeNotRunnable'));
        let prompt = resolvePrompt(n);
        const bible = loadBible(S.activeId);
        // 未闭合引用自愈：@糯糯。 → @糯糯@（按设定集名归一），修复结果回写节点让用户可见
        const _fixed = repairUnclosedMentions(prompt, bibleNames(bible));
        if (_fixed !== prompt) { prompt = _fixed; update((s) => { const nd = s.graph.nodes[n.id]; if (nd) nd.data.prompt = _fixed; }); }
        if (type === 'image') {
          // 参考图 = **只取连进 ref 口的连线**（顺序 refOrder）；@引用只注入文字设定，不追加图片
          const { refs, entities } = await collectRefs(n, prompt, bible);
          const metas = refs.map((r) => ({ blob: r.blob, name: r.name, category: r.category, assetId: r.assetId }));
          let p = buildEffectivePrompt(prompt, refs, entities, bible, true); // light：图片不内联设定全文（防文字渲染污染 + 参考图约束稀释）
          // 技能包的「镜头语言锁」：只追加风格参数与负向词，不内联叙事与剪辑（不污染图片提示词）
          // 资产设定图（label 以「设定图」结尾，由 assetSheetNodeSpec 生成）走 assets 切片：
          // 只要成像与材质，不要分镜/剪辑；普通图片仍走 prompt 切片。判定失败自动退化为 prompt。
          const lockKind = /设定图\s*$/.test(String((n.data && n.data.label) || '')) ? 'assets' : 'prompt';
          try {
            const lock = await buildShotLockText(lockKind, { medium: 'image' });
            if (lock) p = p + '\n' + lock;
          } catch { /* 技能包不可用时不影响生成 */ }
          // 模型解析：节点选择优先，未指定路由到星标默认模型；都没有 = 明确报错（不再静默走演示模式）
          const mcfg = resolveImageModelCfg(settings, nodeImageModelRef(n));
          if (!mcfg) throw new Error(T('errNoImageModel'));
          // 张数（1–4）：同一提示词一次生成多张；历史条保留全部结果，节点显示最后一张
          const want = clamp(Number(n.data.imageCount) || 1, 1, 4);
          const cases = [];
          for (let i = 0; i < want; i++) {
            if (want > 1) update((s) => { const nd = s.graph.nodes[n.id]; if (nd) nd.data.progress = (i + 1) + '/' + want; });
            const blob = await apiImage(p, metas, mcfg, {
              size: n.data.size, ratio: n.data.ratio, nodeExtra: n.data.imgExtra, warn: addWarn,
              // 任务式厂商（三宝图片）：任务 id 就是凭证——代理超时/页面关闭后仍可凭 id 回查（与视频同口径）
              onTask: (tid, qurl) => {
                update((s) => { const nd = s.graph.nodes[n.id]; if (nd) { nd.data.taskId = String(tid || ''); nd.data.taskQueryUrl = String(qurl || ''); } });
                flushSave();
              },
            });
            const rec = await saveAssetRecord(S.activeId, 'image', blob, {
              name: assetNameFor(n, entities, 'image'),
              prompt: stripMentionMarks(prompt), effectivePrompt: p,
              source: 'api',
              entity: entities.length ? entities[0].name : undefined,
              entities: entities.map((e) => e.name),
              nodeLabel: (n.data && n.data.label) || '',
              // 分类：@引用命中的实体品类优先；无引用时按命名规范前缀（角色-/场景-/道具-）兜底
              category: entities.length ? entityCategoryOf(entities[0].kind) : (categoryFromName(n.data.label) || 'general'),
            });
            cases.push(rec.id);
            commitGenResult(n.id, rec.id, false, 'image');
          }
          update((s) => { const nd = s.graph.nodes[n.id]; if (nd) nd.data.progress = null; });
          if (!cases.length) throw new Error(T('noResult'));
```

</details>

**依据 8 · 源码核查**：[client.js:5842-5894](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/client.js#L5842-L5894)

代表性图片编辑协议通过代理发送，解析产物或报错。

<details>
<summary>查看原文（53行）</summary>

```text
    async function apiImage(prompt, refBlobs, s, opts) {
      if (!s.baseUrl) throw new Error('未配置图片 API');
      // URL 归一化：裸域 → /v1；粘贴完整端点也不会被二次拼接
      let base = s.baseUrl.replace(/\/+$/, '').replace(/\/images\/generations$/, '');
      if (!base.replace(/^https?:\/\//i, '').includes('/')) base = base + '/v1';
      const refs = refBlobs || [];
      const auth = s.apiKey ? { Authorization: 'Bearer ' + String(s.apiKey).trim() } : {};
      // 节点级扩展参数（手动参数框）与供应商扩展参数合并（节点优先）
      const nodeExtra = String((opts && opts.nodeExtra) || '').trim();
      let extraSrc = String(s.extra || '');
      if (nodeExtra) {
        try {
          extraSrc = JSON.stringify({ ...(extraSrc.trim() ? JSON.parse(extraSrc) : {}), ...JSON.parse(nodeExtra) });
        } catch (e) { throw new Error('节点扩展参数需为 JSON 对象：' + ((e && e.message) || e)); }
      }
      const extra = parseExtraParams(extraSrc); // 厂商专属参数（留空不发送）
      // 优云智算（compshare）任务式：Qwen-Image 异步任务（提交 → 轮询 → output_url 下载）
      if (s.mode === 'compshare') return await compshareImageTask(prompt, refs, { ...s, extra: extraSrc }, opts);
      // 协议自动路由：优云智算的图片 API 只有任务式（/image/v1/tasks）——误配成通用模式
      // 会在 /v1/images/generations 上拿到 401 "invalid api key"（该面不存在），按域名自动切任务式
      try { if (/compshare\.cn$/i.test(new URL(base).hostname)) return await compshareImageTask(prompt, refs, { ...s, extra: extraSrc }, opts); } catch { /* URL 异常由后续流程报错 */ }
      // 三宝影像工坊：图片走**异步任务协议**（POST /openapi/v1/images 拿任务 id → 轮询 → 下载）。
      // 通用同步格式在该厂商出图 >120s 会吃代理 504，且手里没有任务 id、已扣费也无法回查；
      // 域名命中自动切任务式（与优云同款），也可在图片 API 模式下拉显式选「三宝图片任务」。
      let sanbaoRoute = s.mode === 'sanbao';
      if (!sanbaoRoute) { try { sanbaoRoute = /(^|\.)sanbaobeauty\.com$/i.test(new URL(base).hostname); } catch { /* URL 异常由后续流程报错 */ } }
      if (sanbaoRoute) return await sanbaoImageTask(prompt, refs, s, opts);
      const upstreamTimeout = Number(s.timeoutMs) > 0 ? Number(s.timeoutMs) : 120000; // 商汤等同步接口 20s+，默认 120s
      // 参考图编辑模式：multipart 上传到 /images/edits（OpenAI gpt-image-1 兼容）
      if (refs.length && s.mode === 'edits') {
        const fd = new FormData();
        if (s.model) fd.append('model', s.model);
        fd.append('prompt', prompt);
        fd.append('n', '1');
        if (s.size) fd.append('size', s.size);
        fd.append('watermark', 'false'); // 稳定默认：去水印优先（与 generations 路径一致）
        refs.forEach((b, i) => fd.append('image[]', b.blob || b, 'ref-' + i + '.png'));
        // FormData 经 Response 序列化为 multipart 字节（含 boundary）→ base64 经代理原样转发
        const serialized = new Response(fd);
        const bodyRaw = arrayBufferToBase64(await serialized.arrayBuffer());
        const bodyContentType = serialized.headers.get('content-type') || 'multipart/form-data';
        const res = await fetchViaProxy(base + '/images/edits', { headers: auth, bodyRaw, bodyContentType, timeoutMs: upstreamTimeout, label: '图片编辑 API' });
        if (!res.ok) throw new Error('图片编辑 API HTTP ' + res.status + '：' + res.text.slice(0, 300));
        let j = null;
        try { j = JSON.parse(res.text); } catch { j = null; }
        const d = j && j.data && j.data[0];
        if (d && d.b64_json) return base64ToBlob(d.b64_json, 'image/png');
        if (d && d.url) {
          const r2 = await fetchViaProxy(d.url, { method: 'GET', timeoutMs: 120000, label: '下载图片' });
          if (!r2.ok) throw new Error('下载生成图片失败 HTTP ' + r2.status);
          return r2.blob;
        }
        throw new Error('图片编辑 API 响应中没有 data[0].b64_json / url');
```

</details>

**依据 9 · 源码核查**：[client.js:5800-5813](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/client.js#L5800-L5813)

实际向Host fetch-proxy提交并读回结果。

<details>
<summary>查看原文（14行）</summary>

```text
    async function fetchViaProxy(url, { method = 'POST', headers = {}, body = null, bodyRaw = null, bodyContentType = '', timeoutMs = 120000, label = '请求' } = {}) {
      const payload = { url, method, headers, timeoutMs };
      if (bodyRaw != null) { payload.bodyRaw = bodyRaw; payload.bodyContentType = bodyContentType; }
      else if (body != null) payload.body = body;
      // 客户端→Host 的预算比上游超时多 15s：让上游超时（504/带原因）先到，而不是客户端先断
      const res = await fetchT('/' + NS + '/api/fetch-proxy', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      }, Number(timeoutMs) + 15000, label + '(代理)');
      const ct = res.headers.get('content-type') || '';
      const buf = await res.arrayBuffer();
      const blob = new Blob([buf], { type: ct || 'application/octet-stream' });
      let text = '';
      if (!ct || /json|text|plain/.test(ct)) { try { text = new TextDecoder().decode(buf); } catch { text = ''; } }
      return { ok: res.ok, status: res.status, contentType: ct, text, blob };
```

</details>

**依据 10 · 源码核查**：[client.js:10465-10502](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/client.js#L10465-L10502)

脚本非空结果入库及失败恢复旧稿。

<details>
<summary>查看原文（38行）</summary>

```text
    async function genScriptNode(n) {
      if (!String(n.data.idea || '').trim()) throw new Error(T('needIdea'));
      update((s) => {
        const nd = s.graph.nodes[n.id];
        if (nd) {
          // 生成开始即清空结果框（旧稿备份，失败自动还原）：避免"还在生成中，结果框却挂着上一版"的误解
          nd.data.prevOutput = nd.data.output || '';
          nd.data.output = '';
          nd.data.aiStatus = 'running';
          nd.data.aiError = null;
        }
      });
      aiStreamClear(n.id);
      flushSave();
      try {
        const text = await aiScriptNodes(n.data.idea, n.data.model, (kind, d) => aiStreamAppend(n.id, kind, d));
        if (!String(text || '').trim()) throw new Error(T('aiEmptyResult'));
        const fixedText = repairUnclosedMentions(text, bibleNames(loadBible(S.activeId)));
        update((s) => { const nd = s.graph.nodes[n.id]; if (nd) { nd.data.output = fixedText; nd.data.prevOutput = null; nd.data.aiStatus = 'idle'; nd.data.status = 'done'; nd.data.error = null; } s.assetsTick++; });
        await saveTextAssetRecord(S.activeId, {
          name: (String(n.data.label || '').trim() || T('scriptAssetPrefix')) + ' ' + nowStamp(),
          text: fixedText, category: 'script', prompt: n.data.idea,
        });
        update((s) => { s.assetsTick++; });
        flushSave();
        return text;
      } catch (e) {
        update((s) => {
          const nd = s.graph.nodes[n.id];
          // 失败时还原上一版成稿，不让用户白丢内容
          if (nd && !String(nd.data.output || '').trim() && nd.data.prevOutput) { nd.data.output = nd.data.prevOutput; nd.data.prevOutput = null; }
        });
        setNodeAiError(n.id, (e && e.message) || e);
        flushSave();
        throw e;
      } finally {
        aiStreamClear(n.id);
      }
```

</details>

**依据 11 · 源码核查**：[client.js:9087-9123](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/client.js#L9087-L9123)

设定集与技能规则进入脚本生成上下文。

<details>
<summary>查看原文（37行）</summary>

```text
    async function aiScriptNodes(idea, model, onDelta) {
      const settings = loadSettings();
      const bible = bibleBlock(loadBible(S.activeId));
      const zh = effLang() !== 'en';
      // 按当前专家调度：人设 + 技能组（general 等价于原「内置专家 + canvas-craft」）
      const ctx = await buildExpertContext('script', settings, zh);
      const rules = ctx.rules
        || await loadSkillRules(CRAFT_SKILL, zh)
        || (zh ? '把输入的创意或片段写成可直接拍摄的短剧剧本。只输出剧本正文，不要解释。' : 'Turn the idea or excerpt into a shootable short-drama script. Output the script only.');
      const system = [
        ctx.persona,
        ctx.packText,
        rules,
        bible ? (zh ? '项目设定集（角色/场景/道具名称与设定必须严格一致，禁止私自改名或新增设定）：\n' : 'Series bible (names and settings must strictly match; do not invent changes):\n') + bible : '',
        outLangLine(),
      ].filter(Boolean).join('\n');
      const user = zh ? [
        `创意 / 原文：\n${String(idea ?? '').trim()}`,
        '要求：',
        '- 本节点输出**一集**的剧本：成片时长 1-2 分钟（60-120 秒），共 4-10 个场景；',
        '- **每个场景必须以「【场N】场景名（地点·时间）」单独一行开头**（如【场1】城市街头（夜））——这是后续自动铺开到分镜的分场标记，格式不可省略或改写；',
        '- 每场按内容写足（成片 10–30 秒量级，约 150–400 字含该场全部对白）；全部场景时长之和 ≈ 1-3 分钟；',
        '- 场景头之后：可视化动作描写 + 对白（角色：台词，单独成行）；需要的声音（环境音/旁白）标注在括号里；',
        '- **【资产锚定·硬性】正文中所有角色/场景/道具名称一律写成 @名称@ 引用形式**（前后各一个 @ 精确包裹，名称与设定集逐字一致，如「@陈拾@ 在 @城市街头@ 的 @铁皮围挡@ 旁」）——下游分镜生成靠这些锚点识别资产并挂接参考图；叙述性文字正常书写，不要把动作描述包进 @…@；',
        '- 结尾单独一行「人物：」与「场景/道具：」清单，便于后续资产制作。',
      ].join('\n') : [
        `Idea / source:\n${String(idea ?? '').trim()}`,
        'Requirements:',
        '- This node outputs ONE episode: 1-2 minutes of screen time (60-120s), 4-10 scenes;',
        '- **Every scene MUST start with its own line "【SCENE N】name (location · time)"** — this marker drives the automatic per-scene expansion and must not be omitted;',
        '- Each scene is written to what it needs (10-30 seconds of screen time, ≈150-400 words incl. dialogue); all scenes sum to ≈1-3 minutes;',
        '- After each scene header: visual action + dialogue ("Character: line" on its own lines); mark sounds in brackets;',
        '- **[ASSET ANCHORING - HARD] wrap every character/scene/prop name as @Name@** (an @ on each side, names verbatim from the bible, e.g. "@Chen@ stands by @Wall@ at @Street@") - downstream storyboard generation relies on these anchors to attach references; keep narration text normal, never wrap action descriptions inside @...@;',
        '- End with "Characters:" and "Locations/Props:" lists for asset production.',
      ].join('\n');
      return await aiCompleteStream({
        system, user, model,
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 关闭画布、异步任务与本地项目有哪些限制？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

生成不是独立Host后台作业：请求只写cfg.ui.runRequest一个槽，浏览器每3秒同步、Host读取即清空，随后客户端消费；两个未消费请求可后写覆盖，读取后客户端失败则只有错误提示，不能称可靠队列。工具无等待时立即回triggered，等待上限600秒，用见过running或文档updatedAt变动过滤旧终态；超时回finished=false而不是失败，也不证明已启动。文档时间变化不是每次任务独立ID回执，多节点并发或其他编辑的归因仍需验证。部分任务式厂商把taskId/queryUrl写回节点，停止返回idle且保留回查提示，普通异常写error；这提供找回线索但不证明供应商取消或所有协议恢复成功。工作区.infinite-canvas保存设定/画布/记忆，媒体仍在独立数据根，单拷工作区不带走媒体；原子临时写改名保全单文档，不等于跨媒体/数据库完整备份。无workspaceRegistry时会话定位降级，不应以预设纪律代替宿主身份保证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:2635-2645](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/index.js#L2635-L2645)

写入单个runRequest，而非追加队列。

<details>
<summary>查看原文（11行）</summary>

```text
async function canvasRunNode(args) {
  const pid = String((args && args.projectId) || '');
  const nodeId = String((args && args.nodeId) || '');
  const canvasId = toolCanvasId(args);
  const doc = readToolDoc(args);
  const node = doc.nodes[nodeId];
  if (!node) throw new Error('节点不存在: ' + nodeId);
  const cfg = readIcConfig();
  cfg.ui = { ...(cfg.ui || {}), runRequest: { projectId: pid, canvasId, nodeId, at: Date.now() } };
  writeIcConfig(cfg);
  return { ok: true, projectId: pid, ...(canvasId ? { canvasId } : {}), nodeId, type: node.type, label: (node.data && node.data.label) || '' };
```

</details>

**依据 2 · 源码核查**：[index.js:1850-1860](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/index.js#L1850-L1860)

同步读取后立即清空一次性请求。

<details>
<summary>查看原文（11行）</summary>

```text
async function projectsSync() {
  const cfg = readIcConfig();
  const openRequest = (cfg.ui && cfg.ui.openRequest) || null;
  const runRequest = (cfg.ui && cfg.ui.runRequest) || null;
  const deletedProjects = (cfg.ui && cfg.ui.deletedProjects) || null;
  const docChanged = (cfg.ui && cfg.ui.docChanged) || null;
  if (openRequest || runRequest || deletedProjects || docChanged) {
    cfg.ui = { ...(cfg.ui || {}), openRequest: null, runRequest: null, deletedProjects: null, docChanged: null };
    writeIcConfig(cfg);
  }
  return { projects: projectsList(), openRequest, runRequest, deletedProjects, docChanged };
```

</details>

**依据 3 · 源码核查**：[client.js:21404-21413](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/client.js#L21404-L21413)

Web启动同步和3秒定时轮询。

<details>
<summary>查看原文（10行）</summary>

```text
          // 对话 ↔ 画布同步（启动一次 + 3s 轮询；旧 Host 自动停轮询）
          hostSyncTick().then(() => pushAllProjectsToHost());
          const hostSyncTimer = setInterval(() => hostSyncTick(), 3000);
          // 后台路由探活：失败时在画布顶部给出可操作的提示
          hostRpc('ping').then(() => { S.hostOk = true; S.hostError = null; notify(); }).catch((e) => {
            S.hostOk = false;
            S.hostError = String((e && e.message) || e);
            notify();
          });
          return () => { unsub(); clearInterval(hostSyncTimer); };
```

</details>

**依据 4 · 源码核查**：[client.js:8781-8786](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/client.js#L8781-L8786)

消费失败只展示错误。

```text
        // 一次性请求（Host 读取即清空，绝不能因后面出错而丢失）：
        // 放在逐项目循环之后、独立 try —— 循环里任何异常都不会让 runRequest 被静默吞掉
        try {
          if (r.runRequest) await handleRunRequest(r.runRequest);
        } catch (e) {
          toast(T('runRequestFailed') + '：' + String((e && e.message) || e));
```

**依据 5 · 源码核查**：[index.js:2866-2906](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/index.js#L2866-L2906)

启动快照、终态判断、等待上限与超时语义。

<details>
<summary>查看原文（41行）</summary>

```text
async function canvasGenerateNode(args) {
  const pid = String((args && args.projectId) || '');
  const nodeId = String((args && args.nodeId) || '');
  const canvasId = toolCanvasId(args);
  const waitSec = Math.max(0, Math.min(600, Number((args && args.waitSeconds) || 0)));
  // 触发前快照：canvasRunNode 只写一次性 runRequest，真正的执行要等画布下一个 3s 同步 tick
  // 才开始（状态才翻成 running）；而下面的首轮轮询在 2.5s 就发生——对**曾经跑过**的节点，
  // 首轮会读到上一次的 done/error 并误当本次结果（页面关闭 100%、页开约 17% 触发）。
  // 因此终态只有在「本轮确实跑过」时才可信：轮询中见过 running，或文档在触发后被写过
  //（快进完成的短任务可能整体落在两次轮询之间，用文档时间戳兜底）。
  const baseline = await canvasNodeStatus({ projectId: pid, canvasId, nodeId }).catch(() => null);
  const baseUpdatedAt = Number(baseline && baseline.docUpdatedAt) || 0;
  const run = await canvasRunNode({ projectId: pid, canvasId, nodeId });
  if (!waitSec) {
    return { ok: true, triggered: true, finished: false, projectId: pid, nodeId, type: run.type, label: run.label, status: 'running', note: '已触发执行；画布需处于打开状态才会真正执行，可用 canvas_node_status 查询进度' };
  }
  const deadline = Date.now() + waitSec * 1000;
  let last = null;
  let sawRunning = false;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 2500));
    try { last = await canvasNodeStatus({ projectId: pid, canvasId, nodeId }); } catch { continue; }
    const st = String(last.status || '');
    const ai = String(last.aiStatus || '');
    if (st === 'running' || ai === 'running') { sawRunning = true; continue; }
    // 终态可信门：没见过 running 且文档也没动过 → 这是触发前就挂着的旧终态，继续等
    const confirmed = sawRunning || (baseUpdatedAt > 0 && (Number(last.docUpdatedAt) || 0) > baseUpdatedAt);
    if (!confirmed) continue;
    const isAiNode = last.type === 'script' || last.type === 'storyboard';
    if (isAiNode) {
      if (ai === 'error') return { ok: false, triggered: true, finished: true, projectId: pid, nodeId, type: last.type, label: last.label, status: 'error', error: last.error || 'AI 生成失败' };
      if (ai !== 'running' && (String(last.output || '').trim() || (Array.isArray(last.shots) && last.shots.length))) {
        return { ok: true, triggered: true, finished: true, projectId: pid, nodeId, type: last.type, label: last.label, status: 'done' };
      }
    } else if (st === 'done' || st === 'error') {
      return { ok: st === 'done', triggered: true, finished: true, projectId: pid, nodeId, type: last.type, label: last.label, status: st, assetId: last.assetId || null, error: last.error || null };
    }
  }
  const started = sawRunning || (last && (Number(last.docUpdatedAt) || 0) > baseUpdatedAt && baseUpdatedAt > 0);
  return { ok: true, triggered: true, finished: false, projectId: pid, nodeId, type: last ? last.type : run.type, label: last ? last.label : run.label, status: last ? last.status : 'running',
    note: started ? '等待超时，任务仍在进行；可继续用 canvas_node_status 查询' : '等待超时且未见本轮开始执行——画布页面很可能未打开（运行请求未被消费）；打开画布后会自动继续' };
```

</details>

**依据 6 · 源码核查**：[client.js:10865-10890](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/client.js#L10865-L10890)

视频任务id持久化与产物入库。

<details>
<summary>查看原文（26行）</summary>

```text
            nodeExtra: n.data.vidExtra, // 节点级扩展参数（手动参数框，如 {"use_context_ir":true}）
            warn: addWarn, // 参考素材超限等告警回传（节点上可见）
            // 任务提交成功即持久化 task id：轮询中断/页面关闭后仍可凭 id 回查结果（钱花了就必须能找回）
            onTask: (tid, qurl) => {
              update((s) => { const nd = s.graph.nodes[n.id]; if (nd) { nd.data.taskId = String(tid || ''); nd.data.taskQueryUrl = String(qurl || ''); } });
              flushSave();
            },
            audioRefs: audioBlobs.map((a) => a.blob), // 角色声音参考（@引用实体名下的音频资产）
          });
          const rec = await saveAssetRecord(S.activeId, 'video', blob, {
            name: assetNameFor(n, entities, 'video'),
            prompt: stripMentionMarks(prompt), effectivePrompt: p,
            source: 'api',
            entity: entities.length ? entities[0].name : undefined,
            entities: entities.map((e) => e.name),
            nodeLabel: (n.data && n.data.label) || '',
            category: 'finalcut', // 节点生成的视频 = 成片（实体归属由 entities 字段承担，不占用分类）
          });
          // 记录续帧来源（节点上可追溯：本段是从哪一段接过来的）
          if (useFrame) {
            update((s) => {
              const nd = s.graph.nodes[n.id];
              if (nd) { nd.data.chainFrom = frameAuto ? (autoPrevVideoNode(n) || {}).id || null : 'wired'; }
            });
          }
          commitGenResult(n.id, rec.id, false, 'video');
```

</details>

**依据 7 · 源码核查**：[client.js:10958-10980](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/client.js#L10958-L10980)

停止/错误分支及保存。

<details>
<summary>查看原文（23行）</summary>

```text
      } catch (err) {
        const stopped = !!(ctl.signal && ctl.signal.aborted);
        update((s) => {
          const nd = s.graph.nodes[n.id];
          if (!nd) return;
          if (stopped) {
            // 手动打断：回到待命而不是报错；视频任务 id 已持久化，可凭 id 回查结果
            nd.data.status = 'idle';
            nd.data.error = null;
            if (nd.type === 'script' || nd.type === 'storyboard') nd.data.aiStatus = 'idle';
            nd.data.stopNote = T('stoppedNote') + (nd.data.taskId ? '；' + T('stoppedTaskKept') : '');
          } else {
            nd.data.status = 'error';
            nd.data.error = String((err && err.message) || err);
          }
        });
        flushSave(); // 让对话侧的 canvas_node_status 也能读到失败原因
        if (stopped) toast(T('stoppedToast'));
        return false;
      } finally {
        genActive = Math.max(0, genActive - 1);
        if (genActive === 0) update((s) => { s.running = false; });
        if (genAbort.ctl === ctl) genAbort.ctl = null;
```

</details>

**依据 8 · 源码核查**：[index.js:1127-1164](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/index.js#L1127-L1164)

工作区文档定位与媒体仍在数据根。

<details>
<summary>查看原文（38行）</summary>

```text
// 项目随工作区目录走（宿主侧 workspaceRegistry 发现）：project.json / canvases/ / memory/ / bindings.json
// 全部内嵌目录自包含。文档读写与数据根/SQLite 完全解耦（wsDocFile 分发）；媒体仍走数据根管线
//（ensureProjectFolder 统一登记媒体文件夹），拷工作区目录 = 带走全部设定/记忆/画布文档。
const WS_APP_DIR = '.infinite-canvas';
/** 工作区项目缓存：pid -> { pid, wsId, wsPath, home, doc }；wsProjectsScan 负责刷新。 */
const wsProjects = new Map();
/** 扫描工作区注册表 list（[{id,path,title,sessionIds}]），发现带 `.infinite-canvas/project.json` 标记的项目。
 *  每次全量重扫（代价 = 每工作区读一个小 JSON），标记消失/目录消失自然落榜。 */
function wsProjectsScan(list) {
  const seen = Array.isArray(list) ? list : [];
  wsProjects.clear();
  for (const w of seen) {
    if (!w || typeof w.path !== 'string' || !w.path) continue;
    let doc = null;
    try {
      doc = JSON.parse(readFileSync(path.join(w.path, WS_APP_DIR, 'project.json'), 'utf8'));
    } catch { /* 无标记/损坏 → 不算项目 */ }
    if (!doc || typeof doc !== 'object' || !doc.id) continue;
    const pid = String(doc.id);
    wsProjects.set(pid, { pid, wsId: String(w.id || ''), wsPath: w.path, home: path.join(w.path, WS_APP_DIR), doc });
  }
  return [...wsProjects.values()];
}
/** 该 pid 是否工作区内嵌项目（按最近一次扫描缓存）。 */
function isWsProject(pid) { return wsProjects.has(String(pid || '')); }
/** 工作区项目家目录（<工作区>/.infinite-canvas）；非工作区项目返回 null。 */
function wsProjectHome(pid) {
  const r = wsProjects.get(String(pid || ''));
  return r ? r.home : null;
}
/** 工作区文档 id → 物理文件：项目文档 = project.json；子画布文档 = canvases/<cid>.json；非工作区项目返回 null。 */
function wsDocFile(id) {
  const s = String(id || '');
  try { projectFile(s); } catch { return null; } // id 段合法性复用 projectFile 校验：封死 canvases/<cid> 路径逃逸（评审 I4）
  const ref = isCanvasDocId(s) ? splitCanvasDocId(s) : { projectId: s, canvasId: null };
  const home = wsProjectHome(ref.projectId);
  if (!home) return null;
  return ref.canvasId ? path.join(home, 'canvases', ref.canvasId + '.json') : path.join(home, 'project.json');
```

</details>

**依据 9 · 源码核查**：[index.js:2226-2242](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/index.js#L2226-L2242)

工作区原子文档写不阻塞媒体登记失败。

<details>
<summary>查看原文（17行）</summary>

```text
/** 原子写项目/画布文档：SQL 模式走单行事务；文件模式先写临时文件再改名，避免半写导致项目"消失"。
 *  子画布文档（id 含 __cv__）不重复登记项目文件夹、不镜像 project.json——项目级 meta 只属于默认画布行。 */
function writeIcDoc(id, doc) {
  const canvasRef = splitCanvasDocId(id);
  const isCanvas = isCanvasDocId(id);
  // 工作区内嵌项目：文档直接落 <ws>/.infinite-canvas/（原子写）；不进 SQLite、不镜像数据根。
  // 项目级文档顺带在数据根登记媒体文件夹（媒体仍走数据根管线），失败不阻塞。
  const wsf = wsDocFile(id);
  if (wsf) {
    try { mkdirSync(path.dirname(wsf), { recursive: true }); } catch { /* 目录已存在 */ }
    const tmp = wsf + '.' + process.pid + '.tmp';
    writeFileSync(tmp, JSON.stringify(doc, null, 1), 'utf8');
    renameSync(tmp, wsf);
    if (!isCanvas) {
      try { ensureProjectFolder(canvasRef.projectId, (doc && doc.name) || canvasRef.projectId); } catch { /* 媒体文件夹登记失败不阻塞文档 */ }
    }
    return;
```

</details>

**依据 10 · 源码核查**：[index.js:3486-3496](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/index.js#L3486-L3496)

无工作区服务时supported:false。

<details>
<summary>查看原文（11行）</summary>

```text
    // ---- 会话↔画布绑定：会话所在工作区解析（ctx 闭包内：需要 workspaceRegistry 服务）----
    /** 解析 sessionId 所在工作区与活会话判定；老宿主无 workspaceRegistry → supported:false（全链降级）。 */
    const wsSessionContext = (sessionId) => {
      let reg = null;
      try { reg = ctx.get && ctx.get('workspaceRegistry'); } catch { reg = null; }
      const list = reg && typeof reg.list === 'function' ? reg.list() : null;
      if (!Array.isArray(list)) return { supported: false, list: null, ws: null, isAlive: () => true };
      const sid = String(sessionId || '');
      const ws = list.find((w) => w && Array.isArray(w.sessionIds) && w.sessionIds.map(String).includes(sid)) || null;
      const isAlive = (t) => list.some((w) => w && Array.isArray(w.sessionIds) && w.sessionIds.map(String).includes(String(t)));
      return { supported: true, list, ws, isAlive };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 交接到成片的依赖和成本如何影响采用与改进？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

当前适合有意评估节点创作流程、能保留原始素材并逐步验收的技术创作者先观察，不能直接承诺整集无人值守生产。需要DSH Web、webServer/tools与可写数据目录；作者要求DSH 0.2.0-rc.2+，包未声明Node最低版本，不自行补造。图片/视频另需可用模型端点和账户，文本生成与重试消耗模型费用，生成媒体占磁盘与下载，浏览器实时合成消耗解码/编码与等时录制时间，金额及节省工时未知。源码MediaRecorder优先尝试MP4，兼容失败退WebM，不以README旧说法断言只输出WebM；音频初始化失败可无声。FilmCraft桥是可选ArtCraft>=0.3.0，先查CLI与项目目录，写FCP7 XML和SRT后打开可编辑参数对话，再提交job并轮询，界面自己标明CLI子命令未实测，写工程不等于成功渲染MP4。建议先验证单项目单节点、一个真实短视频和往返工程/媒体迁移，明确预算；请求覆盖、产物丢失或外部渲染未通过就保留原件回原生成网页与剪辑器。未验证假设是将运行槽改为带runId的持久待确认队列：由单槽覆盖与文档时间归因缺口推导，最小对照两个快速触发、浏览器断开重连及读取后崩溃，检查丢请求、重扣费和结果错绑；若重复执行增加或不能正确归因则否定。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:3322-3322](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/index.js#L3322-L3322)

Host硬依赖webServer/tools。

```text
export const inject = ['webServer', 'tools'];
```

**依据 2 · 源码核查**：[package.json:62-80](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/package.json#L62-L80)

Web bundle及可选ArtCraft版本。

<details>
<summary>查看原文（19行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true
    }
  },
  "devDependencies": {
    "fbx2gltf": "^0.9.7-p1"
  },
  "peerDependencies": {
    "@ninkch/dsh-artcraft": ">=0.3.0"
  },
  "peerDependenciesMeta": {
    "@ninkch/dsh-artcraft": {
      "optional": true
    }
```

</details>

**依据 3 · 作者声明**：[README.md:236-241](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/README.md#L236-L241)

作者声明宿主/浏览器条件，旧预览格式表述不能替代当前源码。

```text
## Requirements & limitations

- DeepSeek Harness 0.2.0-rc.2+; demo video export needs MediaRecorder (Chromium).
- The preview cut is real-time recorded WebM; for MP4 masters with multi-track editing, pair with ArtCraft FilmCraft or any NLE.
- Image `edits`/mask inpainting requires a model that supports the endpoint (e.g. gpt-image-1).
- Host-side plugin updates need one Harness restart; the web half hot-reloads.
```

**依据 4 · 源码核查**：[client.js:7934-7958](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/client.js#L7934-L7958)

选择MP4或WebM录制，音频初始化失败无声降级。

<details>
<summary>查看原文（25行）</summary>

```text
      if (!vids.length) throw new Error('没有可合成的片段');
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const g = cv.getContext('2d');
      // mp4 优先（含音轨：H.264 + AAC）：webm 只是兜底，保证成片统一为 mp4
      const mimes = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
      const mime = (typeof MediaRecorder !== 'undefined') && mimes.find((m) => MediaRecorder.isTypeSupported(m));
      if (!mime) throw new Error('当前环境不支持视频录制');
      const stream = cv.captureStream(30);
      // 音频：AudioContext 汇聚各片段原声；初始化失败则降级为无声
      let audio = null;
      try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const dest = ac.createMediaStreamDestination();
        stream.addTrack(dest.stream.getAudioTracks()[0]);
        audio = { ac, dest };
      } catch { audio = null; }
      const rec = new MediaRecorder(stream, {
        mimeType: mime,
        // 码率：仅在用户显式选择时指定，否则交给浏览器/编码器默认（不在代码里写死）
        ...(opts.bitrate ? { videoBitsPerSecond: Number(opts.bitrate) } : {}),
      });
      const chunks = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
      const stopped = new Promise((res) => { rec.onstop = res; });
      rec.start(200);
```

</details>

**依据 5 · 源码核查**：[client.js:14007-14052](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/client.js#L14007-L14052)

检查FilmCraft与项目目录，落盘工程并以job提交。

<details>
<summary>查看原文（46行）</summary>

```text
      const filmcraftExport = async () => {
        const st = await craftStatusSafe();
        if (!st) return;
        if (!(st.bins && st.bins.filmcraft && st.bins.filmcraft.found)) { toast(T('craftCliMissing').replace('{name}', 'filmcraft')); return; }
        // BLK-02：先取项目绝对目录（ArtCraft 无数据根，必须由画布给 base）
        let base;
        try { base = await craftBaseDirRequired(S.activeId); } catch (e) { toast('Craft: ' + ((e && e.message) || e)); return; }
        const items = [];
        for (const x of segs) {
          if (!x.nd.data.assetId) continue;
          try {
            const rec = await idbGet(x.nd.data.assetId);
            const blob = await assetBlob(x.nd.data.assetId);
            if (!blob) continue;
            const rel = await ensureAssetOnDisk({ ...(rec || {}), id: x.nd.data.assetId, blob });
            const vd = await videoDurationOf(blob);
            const ed = Number(x.nd.data.editDuration) || 0;
            // items.rel 用「项目目录下的相对路径」，FCP7 XML 里再拼成绝对路径
            items.push({ rel: rel.slice(rel.indexOf('/craft/') + 1), name: (rec && rec.name) || 'seg', sub: getSub(x), dur: ed > 0 ? Math.min(ed, vd) : vd });
          } catch (e) { toast('Craft: ' + (e.message || e)); return; }
        }
        if (!items.length) { toast(T('noSegments')); return; }
        const dims = videoDimsFor({ resolution: n.data.resolution, ratio: n.data.ratio });
        const xml = buildFcp7Xml(items, {
          name: (S.projects.find((p) => p.id === S.activeId) || {}).name || 'project',
          dataRoot: base, // BLK-02：媒体绝对路径 = 项目目录 + items.rel（原读 ArtCraft 的 dataRoot 字段恒为空）
          width: dims.w, height: dims.h,
        });
        const outRel = 'craft/out/final.mp4'; // 相对 base
        try {
          await craft.writeText(base, 'craft/timeline.xml', xml);
          await craft.writeText(base, 'craft/subs.srt', buildSrt(items));
        } catch (e) { return; /* craftFetch 已提示 */ }
        setFcDialog({
          // args 里一律绝对路径（job 的 cwd 语义不依赖）
          args: JSON.stringify(['--project', joinLocal(base, 'craft/drama.fcproj'), '--import', joinLocal(base, 'craft/timeline.xml'), '--export', joinLocal(base, outRel)], null, 1),
          outRel,
          base,
        });
      };
      const submitFc = (args, outRel, base) => {
        craft.jobStart({ bin: 'filmcraft', cwd: base, args, outputs: [outRel], timeoutMs: 30 * 60 * 1000 }).then((job) => {
          update((s) => { const nd = s.graph.nodes[n.id]; if (nd) { nd.data.fcJobId = job.id; nd.data.fcStatus = 'running'; } });
          setFcDialog(null);
          pollFilmcraftJob(n.id, job.id, outRel, base);
        }).catch(() => { /* craftFetch 已提示 */ });
```

</details>

**依据 6 · 源码核查**：[client.js:1338-1342](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/client.js#L1338-L1342)

界面明确CLI子命令未实测。

```text
      'filmcraftExport': 'FilmCraft 导出',
      'filmcraftParams': 'FilmCraft 导出参数（CLI 子命令未实测，默认取自配方，可编辑）',
      'filmcraftArgs': 'CLI 参数（JSON 数组）',
      'filmcraftOut': '输出文件（相对数据目录）',
      'filmcraftSubmit': '提交 FilmCraft 任务',
```

**依据 7 · 源码核查**：[index.js:2635-2645](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/index.js#L2635-L2645)

持久runId队列假设的单槽依据。

<details>
<summary>查看原文（11行）</summary>

```text
async function canvasRunNode(args) {
  const pid = String((args && args.projectId) || '');
  const nodeId = String((args && args.nodeId) || '');
  const canvasId = toolCanvasId(args);
  const doc = readToolDoc(args);
  const node = doc.nodes[nodeId];
  if (!node) throw new Error('节点不存在: ' + nodeId);
  const cfg = readIcConfig();
  cfg.ui = { ...(cfg.ui || {}), runRequest: { projectId: pid, canvasId, nodeId, at: Date.now() } };
  writeIcConfig(cfg);
  return { ok: true, projectId: pid, ...(canvasId ? { canvasId } : {}), nodeId, type: node.type, label: (node.data && node.data.label) || '' };
```

</details>

**依据 8 · 源码核查**：[index.js:2890-2906](https://github.com/NINKCH/dsh-infinite_canvas/blob/fde73419dc3c6bdba1f552b1c2ed93f5bc9b9b61/index.js#L2890-L2906)

文档时间判断的当前归因边界。

<details>
<summary>查看原文（17行）</summary>

```text
    if (st === 'running' || ai === 'running') { sawRunning = true; continue; }
    // 终态可信门：没见过 running 且文档也没动过 → 这是触发前就挂着的旧终态，继续等
    const confirmed = sawRunning || (baseUpdatedAt > 0 && (Number(last.docUpdatedAt) || 0) > baseUpdatedAt);
    if (!confirmed) continue;
    const isAiNode = last.type === 'script' || last.type === 'storyboard';
    if (isAiNode) {
      if (ai === 'error') return { ok: false, triggered: true, finished: true, projectId: pid, nodeId, type: last.type, label: last.label, status: 'error', error: last.error || 'AI 生成失败' };
      if (ai !== 'running' && (String(last.output || '').trim() || (Array.isArray(last.shots) && last.shots.length))) {
        return { ok: true, triggered: true, finished: true, projectId: pid, nodeId, type: last.type, label: last.label, status: 'done' };
      }
    } else if (st === 'done' || st === 'error') {
      return { ok: st === 'done', triggered: true, finished: true, projectId: pid, nodeId, type: last.type, label: last.label, status: st, assetId: last.assetId || null, error: last.error || null };
    }
  }
  const started = sawRunning || (last && (Number(last.docUpdatedAt) || 0) > baseUpdatedAt && baseUpdatedAt > 0);
  return { ok: true, triggered: true, finished: false, projectId: pid, nodeId, type: last ? last.type : run.type, label: last ? last.label : run.label, status: last ? last.status : 'running',
    note: started ? '等待超时，任务仍在进行；可继续用 canvas_node_status 查询' : '等待超时且未见本轮开始执行——画布页面很可能未打开（运行请求未被消费）；打开画布后会自动继续' };
```

</details>

#### 缺口

- 未逐一核查全部供应商协议、3D预演及其资源适配。
  **影响**：不能把公共编排正确性推广为所有生成能力可用。
  **进一步探讨**：选实际要用的一种图片和视频协议，从提交、轮询、下载到资产回写逐项核验。
- 没有实际Host、外部生成或FilmCraft CLI端到端执行。
  **影响**：无法确认真媒体生成、声音保留与最终工程兼容。
  **进一步探讨**：隔离环境做单镜头真实素材并检查任务费用、文件、时长与音轨。
- 无创作质量/省时/总费用对照。
  **影响**：不能用节点丰富或预设纪律证明收益。
  **进一步探讨**：与原生成网页+剪辑器对照相同短片任务，记录返工、费用与交付差错。
- runId持久队列方案未验证。
  **影响**：不能列为现有后台可靠性。
  **进一步探讨**：两请求、断连、读取后崩溃轨迹对照丢失/重复与归因。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
