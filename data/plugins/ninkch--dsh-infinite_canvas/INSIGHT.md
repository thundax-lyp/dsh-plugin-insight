# 无限画布（Infinite Canvas）

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[04e9fea](https://github.com/NINKCH/dsh-infinite_canvas/tree/04e9fea11127d80ba76c7fb602f9277285d2b751)

<!-- BEGIN META -->
[![GitHub ★ 143](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=143&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/NINKCH/dsh-infinite_canvas) [![npm 30d 11,413](https://img.shields.io/static/v1?label=npm+30d&message=11%2C413&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ninkch/dsh-infinite-canvas) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ninkch/dsh-infinite-canvas)
<!-- END META -->

> **功能**：在 DSH 中用节点画布组织短剧剧本、分镜、图像与视频生成，并衔接后期交付。

> **亮点**：把项目设定、可见节点和分镜检查接入宿主动作，使拆场、重做一段及人工核查共享同一份可检查的图。当前证据支持工作流结构，成片质量需单独验证。[Q01](#research-q01)

> **主要限制**：报价只要见到任意相连视频就把该场计为零新增调用，实际续跑仍可补缺段。批准也不绑定单价，无法用预算指纹证明请求与金额都受控。[Q02](#research-q02)

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
  - [Q01 · 对短剧制作者有什么具体增量？](#detail-section-11)
  - [Q02 · 批准的预算如何转成付费段，断点续跑是否一致？](#detail-section-12)
  - [Q03 · 环境、持久化和会话边界在哪里？](#detail-section-13)
  - [Q04 · 如何采用并证伪用剩余工作清单约束预算的方案？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复制作多个场次、需要复用角色和场景设定的 DSH 用户，可以在画布上同时检查分镜、生成节点及上游关系。

手工用表格、文件夹和生成界面也能管理分镜与素材，但项目人需要重新维护对应关系和顺序。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 分镜与生成节点 | 检查场次、镜头和上游关系 | 带分镜上游的视频受阶段闸门约束 |
| 预算和生成 | 报价、审批与按场／段执行 | 已有部分段的续跑应另核预算 |
| 项目与绑定 | 让对话操作关联画布 | 依赖宿主调用携带会话身份 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH Web、webServer、tools | 加载画布与对话工具 | 须核查真实宿主传入会话 ID |
| 数据根与工作区 | 存储文档、媒体和绑定 | SQLite 可用性改变主存储；备份应覆盖双方 |
| 生成服务与 ArtCraft | 可选真实媒体生成和后期 | 供应商请求需授权，缺同伴包不能宣称完成后期 |

| 阶段 | 操作 | 异常处理 |
| --- | --- | --- |
| 首次 | 创建隔离工程并设置数据根，仅使用示例或替身 | 确认项目和媒体可重开，未设付费凭据 |
| 持续 | 对照分镜、阶段缺项、预计段数及恢复状态 | 部分段完成后重新核对剩余清单 |
| 退出 | 停用并备份数据根和工作区目录 | 检查会话绑定、原始媒体和后期文件是否可回读 |

**效果与成本**

| 成本 | 单位 | 边界 |
| --- | --- | --- |
| 供应商和工具 | 每个合格生成段的实发请求、视频秒数和参考图 | 报价为估算，未核算重复或失败 |
| 人工与存储 | 每场的素材整理、交接、恢复与媒体磁盘 | 未量化，不能推算收益 |
| 退出 | 验证工作区和数据根备份可恢复 | 云同步不能代替一致性验证 |

| 效果 | 判据 | 边界 |
| --- | --- | --- |
| 可追溯分镜 | 从生成段找回场次、镜头和素材关系 | 不代表内容合格 |
| 预算一致 | 记录实际待发段、参考图及金额与批准相符 | 当前半完成分镜存在统计差异 |

> **思考**：报价只要见到任意相连视频就把该场计为零新增调用，实际续跑仍可补缺段。批准也不绑定单价，无法用预算指纹证明请求与金额都受控。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把项目设定、可见节点和分镜检查接入宿主动作，使拆场、重做一段及人工核查共享同一份可检查的图。当前证据支持工作流结构，成片质量需单独验证。[Q01](#research-q01)

分镜闸门返回缺项，便于定位失败；调用方传入的身份与预算语义仍是关键依赖。可复用画布节点的可见阶段，但应把实际外部提交与本地节点存在分开核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

报价只要见到任意相连视频就把该场计为零新增调用，实际续跑仍可补缺段。批准也不绑定单价，无法用预算指纹证明请求与金额都受控。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

保留观察。先用隔离工作区及无计费替身跑两场分镜，检查状态和备份；保持付费段关闭直到残缺段、价格变化和未知结果都可对账。无法核验则停在分镜并用原生成流程。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持分镜闸门和自动段处理。预算与断点续跑的口径差异可由代码推出，真实供应商请求和成片质量未实测。

- 已检查：作者 README、包清单、源码路径 production.js、index.js、package.json、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查分镜、预算、付费生成、绑定和存储实现，未执行插件、模型、生成供应商、测试或真实宿主。
- 下一步：用记录实际请求的假供应商复现一个已有一段的双段分镜，再改变单价并模拟提交超时，按报价外请求、未知结果重复及正常续跑判定。

**分析版本**

- **仓库**：[NINKCH/dsh-infinite_canvas](https://github.com/NINKCH/dsh-infinite_canvas)
- **版本号**：0.20.4（[固定提交 04e9fea](https://github.com/NINKCH/dsh-infinite_canvas/tree/04e9fea11127d80ba76c7fb602f9277285d2b751)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将具体剩余段、模型和价格写入审批依据，由生成器执行同一清单，并将超时未知作为待查。用部分完成和上游已受理的故障对照，若报价外或重复请求不降且正常续跑变差，就撤回。[Q04](#research-q04)

用记录实际请求的假供应商复现一个已有一段的双段分镜，再改变单价并模拟提交超时，按报价外请求、未知结果重复及正常续跑判定。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 140 | 20893 | — | — | 401696 |
| .js | source | 10 | 37190 | 32452 | 5035 | — |
| .mjs | source | 95 | 21478 | 17497 | 3012 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/NINKCH/dsh-infinite_canvas/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/NINKCH/dsh-infinite_canvas/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/NINKCH/dsh-infinite_canvas/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：剧本、分镜和生成接到同一 DSH 画布后，流程可见性和生成预算能否由同一套状态可靠表达？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对短剧制作者有什么具体增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要反复拆场、复用角色设定和调整生成素材的短剧制作者，可把设定、剧本、分镜和视频保存在同一张可见的画布，通过对话工具触发节点，同时能在界面检查和修改。手工流程靠文件夹、文档与生成网站衔接，每次更新需人工追踪上游。该插件的增量是把分镜数据及规则与生成动作连在一起，例如有分镜上游的视频在运行前检查画面描述、时长和阶段，返回可操作的缺项。机械条件无法判断剧情是否合理，自由 prompt 视频也不走同样的分镜闸门。成片交接仍须核实实际媒体文件与后期工具。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-26](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/README.md#L9-L26)

作者描述对话与画布协作、短剧交付和后期接口。

<details>
<summary>查看原文（18行）</summary>

```text
## What is this?

Infinite Canvas is a [DeepSeek Harness](https://github.com/deepseek-ai) plugin that turns the web GUI's sidebar into a full creation studio. Instead of chat round-trips, you work the way directors do: nodes on an infinite canvas, wired into a pipeline — script, storyboard, character & scene assets, image generation, video generation, and a final cut with transitions, subtitles and dubbing.

Everything runs locally in your Harness. Bring your own generation APIs, or use the built-in demo mode to learn the whole flow with zero configuration.

## Drive it from the chat

The canvas and the agent share one brain. Every node is an AI workbench, and the **chat side is the director**: ask in plain language and the agent operates the canvas tools for you — batch work especially.

> *"Create a project called Time-Postman, write the world view and series bible first."*
> *"Write episode 1 based on the bible."* → the script node generates one episode (60–120s), every scene marked with a `【场N】` header.
> *"Expand episode 1 into scenes."* → per-scene text nodes + storyboard nodes appear, wired automatically.
> *"Generate reference images for every character, scene and prop."* → ten image nodes created and generated in one go.
> *"Generate scene 1's video."* → storyboard shots + reference images compose one multi-shot video call.
> *"Send episode 1 to FilmCraft for an MP4 render."* → FCP7 XML + SRT land in your data root for the Craft suite.

The heavy lifting — bibles, episode scripts, storyboard breakdowns, batches of reference images — is exactly what the agent is fast at. You then fine-tune the 20% you care about directly on the nodes: tweak a prompt, reorder references, re-roll one shot, pull an older result from history.
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-10](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/cordis.patch.yml#L1-L10)

补丁同时注册宿主插件和媒体创作预设。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[production.js:343-391](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/production.js#L343-L391)

设定集与分镜闸门有可检查的机械条件。

<details>
<summary>查看原文（49行）</summary>

```text
  function gateBible(bible) {
    const b = bible || {};
    const missing = [];
    if (!String(b.worldview || '').trim()) missing.push('worldview（世界观/核心设定）');
    if (!String(b.style || '').trim()) missing.push('style（风格基调）');
    if (!Array.isArray(b.characters) || !b.characters.length) missing.push('characters（至少 1 个角色）');
    return { ok: missing.length === 0, code: 'G1', missing };
  }

  /**
   * G2 分镜质量闸门（建/跑视频节点前）：只查**机械可判定**项；
   * 冲突点/因果钩子这类需要创作判断的项放 warns（由 canvas-craft 技能与自检清单负责）。
   */
  function gateStoryboard(shots) {
    const fails = [];
    const warns = [];
    const arr = Array.isArray(shots) ? shots : [];
    if (!arr.length) {
      fails.push('分镜表还没有任何镜头（shots 为空）——先 canvas_run_node 分镜表生成镜头，绝不手工编造镜头表');
      return { ok: false, code: 'G2', fails, warns };
    }
    if (arr.length > 24) fails.push('镜头 ' + arr.length + ' 个超过单表上限 24——请按场景拆分为多个分镜表');
    const normMotion = (s) => String((s && s.motion) || '').trim().toLowerCase();
    arr.forEach((s, i) => {
      const no = '镜' + (i + 1);
      const visual = String((s && s.visual) || '').trim();
      if (!(Number(s && s.duration) > 0)) fails.push(no + ' 缺少时长（duration 必须为正数）');
      if (!visual) fails.push(no + ' 缺少画面描述（visual）');
      else if (!SHOTSIZE_WORDS.some((w) => visual.includes(w))) fails.push(no + ' 景别不具体（画面需含 大特写/特写/近景/中近景/中景/中全景/全景/远景 之一）');
      const seg = String((s && s.seg) || '').trim().toLowerCase();
      if (seg && !SEG_CANON.has(seg)) fails.push(no + ' seg 取值非法：' + seg + '（只能是 opening/continuation/scene_change/new_character/closeup）');
      if (!seg || !String((s && s.tail) || '').trim() || !String((s && s.cam) || '').trim()) {
        warns.push(no + ' 缺衔接字段（' + (['seg', 'tail', 'cam'].filter((k) => !String((s && s[k]) || '').trim()).join('/')) + '）——跨段接戏靠这四个字段，建议 canvas_update_node 补齐');
      }
      const dlg = s && s.dialogue;
      const dlgText = typeof dlg === 'string' ? dlg : Array.isArray(dlg) ? dlg.join(' ') : '';
      if (dlgText.trim() && !dlgText.includes('：') && !dlgText.includes(':')) warns.push(no + ' 台词建议逐行「角色：台词」格式（音画同步依赖它）');
    });
    if (arr.length && !arr.some((s) => String((s && s.visual) || '').includes('大特写'))) {
      fails.push('全表没有一个「大特写」——每场至少 1 个大特写（分镜自检硬项）');
    }
    for (let i = 0; i + 2 < arr.length; i++) {
      const a = normMotion(arr[i]);
      if (a && a === normMotion(arr[i + 1]) && a === normMotion(arr[i + 2])) {
        fails.push('镜' + (i + 1) + '–' + (i + 3) + ' 连续三镜运动完全相同（「' + String(arr[i].motion).trim() + '」）——连续三镜必须不同运动');
        break;
      }
    }
    return { ok: fails.length === 0, code: 'G2', fails, warns };
```

</details>

**依据 4 · 源码核查**：[index.js:2894-2936](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/index.js#L2894-L2936)

工具处理节点并写出供画布消费的请求，G2/G6 限定有分镜上游的视频。

<details>
<summary>查看原文（43行）</summary>

```text
/** 运行节点：写一次性请求，画布客户端轮询消费后用画布内配置的模型/接口真实执行。 */
async function canvasRunNode(args) {
  const pid = String((args && args.projectId) || '');
  const nodeId = String((args && args.nodeId) || '');
  const canvasId = toolCanvasId(args);
  const doc = readToolDoc(args);
  const node = doc.nodes[nodeId];
  if (!node) throw new Error('节点不存在: ' + nodeId);
  // ── 流程闸门（0.20.0）：只拦"生成"与"花钱"，不拦节点搭建。逃生舱见各 fix 字段。 ──
  {
    const ov = args && args.override;
    const ovOk = ov && ov.by === 'user-explicit' && String(ov.quote || '').trim();
    // G1 设定集先行：剧本/分镜表**生成内容**前必须有世界观+风格+≥1 角色
    if (node.type === 'script' || node.type === 'storyboard') {
      const g1 = PROD.gateBible(doc.bible);
      if (!g1.ok && !ovOk) {
        return { ok: false, gate: g1.code, projectId: pid, ...(canvasId ? { canvasId } : {}), nodeId, missing: g1.missing, error: '设定集先行：' + g1.missing.join('、') + ' 尚未补全——先 canvas_get_bible 读现状、canvas_update_bible 补全后再生成。跨镜一致性全靠它。', fix: 'canvas_update_bible 补全缺失项（用户已给创意按其创意写，不要另起一套）；用户明确说"先随便生成"时传 override:{by:\'user-explicit\',quote:\'用户原话\'}' };
      }
      if (!g1.ok && ovOk) PROD.recordOverride(pid, canvasId, 'G1', ov.quote, { node: node.type });
    }
    // G2/G6 视频生成：镜头清单必须来自已过闸门的分镜表；自由 prompt 视频（无分镜上游）不受此限
    if (node.type === 'video') {
      const sbEdge = (doc.edges || []).filter((e) => e && e.toNode === nodeId && doc.nodes[e.fromNode] && doc.nodes[e.fromNode].type === 'storyboard').pop();
      const sbNode = sbEdge ? doc.nodes[sbEdge.fromNode] : null;
      if (sbNode) {
        const shots = Array.isArray(sbNode.data && sbNode.data.shots) ? sbNode.data.shots : [];
        const g2 = PROD.gateStoryboard(shots);
        if (!g2.ok && !ovOk) {
          return { ok: false, gate: g2.code, projectId: pid, ...(canvasId ? { canvasId } : {}), nodeId, error: '分镜质量闸门未通过（' + g2.fails.length + ' 项）——分镜重生成不花钱，视频按秒计费，绝不带病生成', fails: g2.fails, warns: g2.warns || [], fix: 'canvas_run_node 重生成该分镜表，或 canvas_update_node 整表替换 shots；用户明确要求继续时传 override:{by:\'user-explicit\',quote:\'用户原话\'}' };
        }
        if (!g2.ok && ovOk) PROD.recordOverride(pid, canvasId, 'G2', ov.quote, { nodeId });
        if (g2.ok) { try { PROD.noteStage(pid, canvasId, 'shots_ready', 'storyboard_gate_pass'); } catch { /* 忽略 */ } }
        const g6 = PROD.gateStage(pid, canvasId, 'shots_ready');
        if (!g6.ok && !ovOk) {
          return { ok: false, gate: g6.code, projectId: pid, ...(canvasId ? { canvasId } : {}), nodeId, error: '阶段越序：当前阶段「' + g6.at + '」尚未到达「shots_ready」——先完成分镜并通过质量闸门，再触发视频生成（视频按秒计费）。', fix: '用 canvas_production_status 查看缺口；用户明确要求跳过时传 override:{by:\'user-explicit\',quote:\'用户原话\'}' };
        }
        if (!g6.ok && ovOk) PROD.recordOverride(pid, canvasId, 'G6', ov.quote, { nodeId });
      }
    }
  }
  const cfg = readIcConfig();
  cfg.ui = { ...(cfg.ui || {}), runRequest: { projectId: pid, canvasId, nodeId, at: Date.now() } };
  writeIcConfig(cfg);
```

</details>

#### 缺口

- 未对照完整短剧项目的人工作业或结果质量
  **影响**：不能声称减少工期或提高成片一致性
  **进一步探讨**：用同一套两场短剧资料比较节点返工、状态可解释性和最终交接件

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 批准的预算如何转成付费段，断点续跑是否一致？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

报价根据分镜镜头、上限、缺参考图数和连边推算，再用统计字段生成 quoteId。批准记录保存当前 quoteId 和非空确认文本，付费段入口重算指纹，未通过不启动。报价把任何已连视频视为该场零新增调用，但执行区分旧整表视频与带段号的节点，已有某段时仍可建立其他缺段。可构造两段且已有第一段的分镜，报价计零，执行仍可继续第二段。报价指纹也未带配置单价和具体提示文本；更改单价但统计不变时，指纹维持，不能把批准当金额封顶。执行偏差只记日志，且节点失败允许一次重试；供应商端如何避免未知结果的重复计费未验证。

#### 证据与依据

**依据 1 · 源码核查**：[production.js:244-275](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/production.js#L244-L275)

报价用是否存在连边视频决定场内是否计新调用。

<details>
<summary>查看原文（32行）</summary>

```text
  function quote(pid, cid, unitPricePerSecond) {
    const st = stageOf(pid, cid);
    const doc = st.doc || { nodes: {} };
    const nodes = Object.values(doc.nodes || {});
    const sbs = nodes.filter((n) => n.type === 'storyboard' && Array.isArray(n.data && n.data.shots) && n.data.shots.length);
    const videoNodes = nodes.filter((n) => n.type === 'video');
    // 项目资产名（SQL/JSON 双模由宿主 readAssetIndexNames 决定）；读失败视为无资产 → 全部计缺（诚实从宽）
    let assetNames = [];
    try { assetNames = (deps.readAssetIndexNames ? (deps.readAssetIndexNames(pid) || []) : []).map((n) => String(n || '').trim()).filter(Boolean); } catch { assetNames = []; }
    const claimed = new Set();
    let refImagesTotal = 0;
    let totalSeconds = 0;
    const scenes = sbs.map((n, i) => {
      const shots = n.data.shots || [];
      const secs = shots.reduce((a, s) => a + (Number(s && s.duration) || 0), 0);
      totalSeconds += secs;
      const hasVideo = videoNodes.some((v) => (doc.edges || []).some((e) => e.fromNode === n.id && e.toNode === v.id));
      const maxSeconds = Number(n.data.targetDuration) || 15;
      // 已有视频的表不产生新调用；待生成的表按切段算法数段（与客户端 expandStoryboard 同式同默认）
      let calls = 0;
      let refImages = 0;
      if (!hasVideo) {
        const plan = planShotSegments(shots, { maxSeconds });
        // 客户端兜底同款（L13884）：切段结果为空但表里有镜头时，客户端会整表按一段生成——估算按 1 次算
        calls = plan.segments.length ? plan.segments.length : 1;
        // T8 参考图行项：该场缺失参考资产的实体数（跨场共享只计一次）
        for (const ent of collectShotEntities(shots)) {
          if (claimed.has(ent.key)) continue;
          claimed.add(ent.key);
          if (!hasRefAssetName(assetNames, ent.kind, ent.name)) refImages++;
        }
      }
```

</details>

**依据 2 · 源码核查**：[production.js:289-334](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/production.js#L289-L334)

预算摘要绑定统计量，单价参与金额展示但未进入指纹，审批依赖当前指纹和确认文本。

<details>
<summary>查看原文（46行）</summary>

```text
    const videoCalls = scenes.reduce((a, s) => a + s.videoCalls, 0);
    const price = Number(unitPricePerSecond);
    // 指纹吃切段结果与每场上限：段数/上限变了 → 旧批准自动失效 → 用户重新复核预算（预期行为，无兼容垫片）
    // T8：参考图行项一并进指纹——缺失实体集合变了（设定集/资产中途变化）同样要求重新复核
    const payload = { pid, cid: keyOf(cid), scenes: scenes.map((s) => [s.storyboardId, s.shots, s.seconds, s.videoCalls, s.maxSeconds, s.refImages]), pending: videoCalls, refImages: refImagesTotal };
    const baseNote = videoCalls === 0 ? '全部分镜表都已有视频节点：本次只做重生成，不产生新调用' : '批准后按镜头切段逐段调用视频接口（按秒计费）';
    return {
      ok: true, quoteId: fingerprint(payload),
      projectId: pid, canvasId: keyOf(cid) === 'default' ? null : keyOf(cid),
      stage: st.stage,
      scenes, sceneCount: scenes.length, shotCount: scenes.reduce((a, s) => a + s.shots, 0),
      totalSeconds: Math.round(totalSeconds * 10) / 10,
      videoCalls,
      refImagesTotal,
      unitPricePerSecond: Number.isFinite(price) && price > 0 ? price : null,
      estimatedCost: Number.isFinite(price) && price > 0 ? Math.round(price * totalSeconds * 100) / 100 : null,
      note: refImagesTotal > 0 ? baseNote + '；含参考图 ' + refImagesTotal + ' 张（未登记/未生成参考资产的实体）' : baseNote,
    };
  }

  /** 批准（一次性令牌）：quoteId 必须与当前文档指纹一致，否则拒绝（镜头变了就得重新看预算）。 */
  function approve(pid, cid, quoteId, confirm, unitPricePerSecond) {
    const q = quote(pid, cid, unitPricePerSecond);
    const given = String(quoteId || '').trim();
    if (!given) return { ok: false, error: '缺少 quoteId：先调 autoQuote 生成预算单，用户看过后再批准' };
    if (given !== q.quoteId) return { ok: false, expired: true, error: '预算单已过期（镜头/时长/新增分镜表发生了变化）——请重新 autoQuote 并让用户复核后再批准', current: q.quoteId };
    const words = String(confirm || '').trim();
    if (!words) return { ok: false, error: '缺少 confirm：批准付费生成必须携带用户确认原话（审计要求）' };
    const cur = stageOf(pid, cid);
    const state = cur.state || {
      version: 1, projectId: pid, canvasKey: keyOf(cid),
      floor: cur.inferred, explicit: null, createdAt: Date.now(), updatedAt: 0, history: [], overrides: [],
    };
    state.approval = { quoteId: q.quoteId, at: Date.now(), by: 'user', confirm: words.slice(0, 200), videoCalls: q.videoCalls, totalSeconds: q.totalSeconds };
    state.updatedAt = Date.now();
    writeState(pid, cid, state);
    return { ok: true, approved: true, quoteId: q.quoteId, videoCalls: q.videoCalls, totalSeconds: q.totalSeconds };
  }

  /** 当前批准是否仍然有效（预算指纹未变）；返回 null 表示没有批准。 */
  function approvalOf(pid, cid, unitPricePerSecond) {
    const state = readState(pid, cid);
    if (!state || !state.approval) return null;
    const q = quote(pid, cid, unitPricePerSecond);
    const valid = state.approval.quoteId === q.quoteId;
    return { ...state.approval, valid, currentQuoteId: q.quoteId };
```

</details>

**依据 3 · 源码核查**：[index.js:4185-4203](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/index.js#L4185-L4203)

付费入口验证批准、运行状态与全量预算。

<details>
<summary>查看原文（19行）</summary>

```text
    async function autoPaid(pid, cid, scenes) {
      const cfg = readIcConfig();
      const price = Number(cfg.production && cfg.production.videoUnitPricePerSecond);
      const ap = PROD.approvalOf(pid, cid, price);
      if (!ap || !ap.valid) return { ok: false, error: '没有有效的付费批准：先用 canvas_auto_budget 生成预算单，用户批准后重试' };
      const run = AUTO_RUNS.get(runKeyOf(pid, cid));
      if (!run || run.status !== 'done') return { ok: false, error: '免费段尚未完成（没有分镜与预算）' };
      if (run.paid === 'running') return { ok: false, error: '付费段已在运行' };
      run.paid = 'running';
      run.paidAbort = false;
      run.paidLog = [{ at: Date.now(), text: '付费段启动（已批准预算 ' + ap.quoteId + '）' }];
      const abortNow = () => { run.paid = 'aborted'; run.paidPhase = 'aborted'; run.paidLog.push({ at: Date.now(), text: '已中止（保留已完成视频）' }); };
      (async () => {
        try {
          const doc = readToolDoc({ projectId: pid, canvasId: cid });
          const boards = Object.values(doc.nodes || {}).filter((n) => n.type === 'storyboard' && Array.isArray(n.data && n.data.shots) && n.data.shots.length);
          // T9 ②：选场执行——scenes 存在时按 boards 序号过滤（boards[i] 的场号 = i+1，与 quote scenes 序号一致）；
          // 被排除的场不进循环：零视频节点、实体收集也不跑（连参考图都不生成）。批准令牌不受影响：
          // 本函数入口的 approvalOf 已按全量预算指纹校验（PROD.approve 语义零改动），scenes 只是执行过滤器。
```

</details>

**依据 4 · 源码核查**：[index.js:4245-4257](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/index.js#L4245-L4257)

实际段数变化仅记录，旧整表视频才跳过整场。

<details>
<summary>查看原文（13行）</summary>

```text
            // ③ 预算一致性（只记日志不阻塞）：run.budget 是免费段终点的快照，镜头中途被用户改过就对不上；
            //   批准令牌的指纹校验已在 autoPaid 入口把守，这里只是日志诚实化。
            const budgetRow = run.budget && Array.isArray(run.budget.scenes) ? run.budget.scenes.find((r) => r && r.storyboardId === sb.id) : null;
            if (budgetRow && Number(budgetRow.videoCalls) !== segCount) {
              const msg = '预算与实际段数不一致（预算 ' + Number(budgetRow.videoCalls) + ' / 实际 ' + segCount + '），按实际执行';
              run.log.push({ at: Date.now(), role: 'runner', summary: baseLabel + ' ' + msg });
              run.paidLog.push({ at: Date.now(), text: msg });
            }
            // 断点续跑：旧版整表单节点（名字不带「段k/N」）→ 整场跳过（该场已有视频、预算已计 0）；
            // 本 hotfix 的段节点 → 只跳过已存在的那几段，缺的段照建（重试语义按段保留）。
            const boardVideos = (doc.edges || []).filter((e) => e.fromNode === sb.id).map((e) => doc.nodes[e.toNode]).filter((n) => n && n.type === 'video');
            const segNumOf = (v) => { const m = String((v.data && v.data.label) || '').match(/ · 段(\d+)\/(\d+)$/); return m ? Number(m[1]) : 0; };
            if (boardVideos.length && !boardVideos.some((v) => segNumOf(v) > 0)) continue;
```

</details>

**依据 5 · 源码核查**：[index.js:4307-4317](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/index.js#L4307-L4317)

执行按段名查存在，继续创建缺段。

<details>
<summary>查看原文（11行）</summary>

```text
            for (let k = 0; k < segCount; k++) {
              if (run.paidAbort) { abortNow(); return; }
              const seg = segs[k];
              const label = segLabelOf(k);
              if (boardVideos.some((v) => String((v.data && v.data.label) || '') === label)) continue;
              // G3 一表一视频的逃生舱只给「同场第 2 段起 / 续跑补建缺段」用；quote 引用用户批准过的预算单号（审计可查），
              // 绝不伪造用户原话。首段不传 override：G2 不过的场在这里照旧硬失败（分镜带病不下场）。
              const needOverride = boardVideos.length > 0 || k > 0;
              const segDuration = Math.max(1, Math.round(Number(seg.duration) || 0));
              const v = canvasCreateNode({ projectId: pid, canvasId: cid, type: 'video', name: label, connectFrom: sb.id, duration: segDuration,
                ...(needOverride ? { override: { by: 'user-explicit', quote: '付费段按预算切段执行（批准单 ' + ap.quoteId + '）：' + label } } : {}) });
```

</details>

**依据 6 · 源码核查**：[index.js:4345-4353](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/index.js#L4345-L4353)

生成失败最多再执行一次。

```text
              let done = false; let err = null;
              for (let attempt = 0; attempt < 2 && !done; attempt++) {
                if (attempt > 0 && run.paidAbort) { abortNow(); return; }
                try { await canvasExec(pid, cid, v.nodeId, { timeoutMs: 15 * 60 * 1000 }); done = true; }
                catch (e) { err = e; run.paidLog.push({ at: Date.now(), text: label + ' 第 ' + (attempt + 1) + ' 次失败：' + String((e && e.message) || e) }); }
              }
              if (!done) throw err;
              lastVideo = v.nodeId;
              run.paidLog.push({ at: Date.now(), text: label + ' 完成' });
```

#### 缺口

- 未在目标宿主或实际提供商验证构造的半完成场景
  **影响**：无法估计真实重复提交及结算影响
  **进一步探讨**：用无实际计费的适配器测试半完成、价格变更、首次超时但上游已受理和重新报价

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 环境、持久化和会话边界在哪里？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

宿主入口依赖 webServer 和 tools，客户端在 Web 环境加载。SQLite 和已设置数据根并存时使用数据库，旧环境可以保留 JSON，媒体位于数据根；工作区绑定与多画布项目需要核对工作区目录。会话工具包装层在成功找到 sid 且参数声明项目／画布时拒绝越界；解析抛错或缺 sid 会原样执行，因此这项保护不代表全部宿主权限隔离。第三方生成调用可由宿主进程代理，带 URL、请求头和正文；所谓本地工作台并不保证请求内容留在本机。 ArtCraft 属于可选同伴包，外部后期交付需另验。首次配置、媒体占用、失败重试和双位置备份都增加人工成本。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:30-38](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/package.json#L30-L38)

声明宿主、客户端和 Skill 导出。

```text
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json",
    "./assets/director/*.js": "./assets/director/*.js",
    "./assets/canvas-director/*.js": "./assets/canvas-director/*.js",
    "./skills": "./skills.js"
  },
```

**依据 2 · 源码核查**：[package.json:64-82](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/package.json#L64-L82)

声明 Web 客户端和可选 ArtCraft。

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

**依据 3 · 源码核查**：[index.js:272-287](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/index.js#L272-L287)

核查媒体与 SQLite 入口和存储启用条件。

<details>
<summary>查看原文（16行）</summary>

```text
//   <dataRoot>/canvas.db                元数据 + 项目文档 = 唯一事实源
//   <dataRoot>/projects/<项目>/<类型>/   媒体文件（0.18.5 起新上传一律落这里）
//   <dataRoot>/objects/<sha2>/<sha256>  历史 CAS 对象库：**只读保留**
//       ！0.18.0–0.18.4 上传的媒体在这里，删掉老用户的图/视频会 404
//       ！IC-08 已退役写路径：不再有 POST /api/object，新上传不再产生对象
//       ！删资产时仍按引用计数回收（gcObjectIfUnreferenced），避免只增不减
// node:sqlite 需要 Node ≥22.5（DSH 捆绑 Node 24 满足）；不可用时整站回退 v1 JSON 存储。
// ============================================================
const require_ = createRequire(import.meta.url);
const SQLITE = (() => { try { return require_('node:sqlite'); } catch { return null; } })();
let _db = null;       // DatabaseSync 实例（按 dataRoot 缓存）
let _dbRoot = null;
let _rpcMethods = null; // RPC 方法表（apply 时赋值；测试直接调用）

function sqlActive() { return !!SQLITE && !!dataRoot(); }
function dbFileFor(root) { return path.join(root, 'canvas.db'); }
```

</details>

**依据 4 · 源码核查**：[index.js:1844-1869](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/index.js#L1844-L1869)

宿主转发 HTTP(S) 目标和传入负载。

<details>
<summary>查看原文（26行）</summary>

```text
async function fetchProxyForward(reqBody) {
  const url = String((reqBody && reqBody.url) || '');
  if (!/^https?:\/\//i.test(url)) throw new Error('需要 http(s) 接口 url');
  const method = String((reqBody && reqBody.method) || 'POST').toUpperCase();
  // 头部统一小写：客户端与默认补值可能各自携带不同大小写的同名头（Content-Type 与 content-type），
  // 混用会作为重复头转发，严格网关（优云智算）直接 400 "Content-Type must be application/json"
  const headers = {};
  for (const [hk, hv] of Object.entries((reqBody && reqBody.headers && typeof reqBody.headers === 'object') ? reqBody.headers : {})) {
    if (hv === undefined || hv === null) continue;
    headers[String(hk).toLowerCase()] = String(hv);
  }
  let body;
  if (method !== 'GET' && method !== 'HEAD') {
    if (reqBody && reqBody.bodyRaw != null) {
      body = Buffer.from(String(reqBody.bodyRaw), 'base64');
      if (reqBody.bodyContentType) headers['content-type'] = String(reqBody.bodyContentType);
    } else if (reqBody && reqBody.body != null) {
      body = typeof reqBody.body === 'string' ? reqBody.body : JSON.stringify(reqBody.body);
      if (!headers['content-type']) headers['content-type'] = 'application/json';
    }
  }
  const ms = Number(reqBody && reqBody.timeoutMs) > 0 ? Number(reqBody.timeoutMs) : 120000;
  const upstream = await fetch(url, {
    method,
    headers,
    ...(body !== undefined ? { body } : {}),
```

</details>

**依据 5 · 源码核查**：[index.js:5040-5076](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/index.js#L5040-L5076)

绑定约束的触发条件与原参数回退。

<details>
<summary>查看原文（37行）</summary>

```text
            // 会话绑定（0.20.x）：绑定会话的 agent 被**代码级锁死**在本集画布——
            //  ① projectId/canvasId 缺省 → 自动注入绑定值；
            //  ② 显式传其他项目/画布（含同项目其他画布与默认画布）→ 直接拒绝（locked），文案指引先解绑；
            //  ③ 未绑定会话不受任何限制（编码等普通任务零打扰）。
            // 只对 schema 声明了该参数的工具生效（additionalProperties:false 的工具不能多塞键）；
            // 嗅探失败（宿主不带会话身份）静默回退旧行为。
            const propDefs = (def.parameters && def.parameters.properties) || null;
            const allowProject = !!(propDefs && Object.prototype.hasOwnProperty.call(propDefs, 'projectId'));
            const allowCanvas = !!(propDefs && Object.prototype.hasOwnProperty.call(propDefs, 'canvasId'));
            def.execute = async (args, exec) => {
              let a = args;
              try {
                const sid = toolExecSessionId(exec);
                if (sid && (allowProject || allowCanvas)) {
                  const b = toolBindingForSession(sid);
                  if (b) {
                    a = (args && typeof args === 'object' && !Array.isArray(args)) ? args : {};
                    const wantPid = b.projectId == null ? null : String(b.projectId);
                    const wantCid = b.canvasId == null ? null : String(b.canvasId);
                    const deny = (what) => {
                      const label = bindingLabelOf(b);
                      return stripUndefined({
                        ok: false,
                        locked: true,
                        text: '本会话已绑定画布工作台「' + label + '」，代码级限制：' + what
                          + '。一个会话只允许操作自己绑定的那一张画布；如需操作其他画布/项目，请先在对话输入行的画布选择器里解绑。',
                      });
                    };
                    if (allowProject && a.projectId != null && String(a.projectId) !== wantPid) return deny('禁止跨项目操作');
                    if (allowCanvas && a.canvasId != null && String(a.canvasId) !== wantCid) return deny('禁止跨画布操作（含同项目其他画布与默认画布）');
                    if (allowProject && a.projectId == null && wantPid != null) a.projectId = b.projectId;
                    if (allowCanvas && a.canvasId == null && wantCid != null) a.canvasId = b.canvasId;
                  }
                }
              } catch { /* 默认解析失败 → 原参数路径 */ }
              return stripUndefined(await inner(a, exec));
            };
```

</details>

**依据 6 · 作者声明**：[README.md:92-99](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/README.md#L92-L99)

作者说明工作区状态与媒体数据根分开。

```text
## Session ↔ canvas binding + project memory (multi-episode series)

Built for long-running series: **one workspace = one project, one session = one episode.**

- **Bind in the composer — only if you want to.** The canvas selector in the chat input row (same dropdown shape as 「选择工作区」) shows 选择画布 while unbound. Unbound menu = **仅会话 / 创建项目 / existing projects**: a project expands to its sub-canvases and clicking one binds the session (new sub-canvases can be created inline); touching nothing keeps the session unbound — coding and other non-canvas tasks stay untouched, and an unbind is never reversed by anything. Once bound, the project is locked: the menu shows only that project's sub-canvases (current highlighted, occupied marked 占用中) plus 新建子画布 / 打开画布 / 仅会话 (= unbind).
- **The chat agent operates exactly the bound canvas.** With the bundled「媒体创作」preset, the agent self-identifies via `canvas_my_canvas` ("this session = episode N of project X") and every `canvas_*` tool defaults to the bound canvas — write/connect/run/delete any node, update the bible, manage the episode. **Cross-canvas and cross-project operations are a code-level ban**: explicitly passing another project's or canvas's ids (including other canvases of the same project) is rejected with a locked error pointing at the unbind action. Unbound sessions are unrestricted.
- **Project memory keeps 100 episodes continuous.** Each episode's canvas has its own memory (plot decisions, character-state changes, foreshadowing ledger) plus a project-level scheduling index (titles / summaries / keywords / status). The agent is bound by skill discipline to read the index before writing an episode and write its memory back at every milestone, so episode 47 never re-invents what episode 12 decided. Browse any episode's memory in the canvas's **记忆** tab.
- **Everything lives in the workspace.** `project.json`, `canvases/`, `memory/`, `bindings.json` sit inside `<workspace>/.infinite-canvas/` — copy the folder, move the series. (Media files stay in the plugin's data root.)
```

#### 缺口

- 目标 DSH 传参、宿主网络隔离、备份回读未验证
  **影响**：不能把绑定或本地字样当隔离承诺
  **进一步探讨**：在隔离工程核对无 sid、错误画布、迁移前后项目和媒体恢复，并用假生成网关记录转发范围

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何采用并证伪用剩余工作清单约束预算的方案？

**研究主题**：新假设与验证、采用判断

#### 完整回答

有 DSH 且需要管理多场镜头关系的人可观察并先看样例画布，维持无外部计费配置。付费段在报价与实发一致前不适合承担真实素材或预算。可由同一剩余工作清单生成报价与执行项，批准绑定具体段键、模型和价格并在请求前校验；超时未知状态先查远端而不是再发一次。用假供应商对照空项目、仅有一段、价格变更、失败恢复四类，记录报价外请求数、合法续跑成功率与重复提交。若新流程只增加审批等待，且无法减少报价外请求或重复提交，则假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[production.js:260-275](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/production.js#L260-L275)

报价对已连视频当前视为整场完成，可作对照。

<details>
<summary>查看原文（16行）</summary>

```text
      const hasVideo = videoNodes.some((v) => (doc.edges || []).some((e) => e.fromNode === n.id && e.toNode === v.id));
      const maxSeconds = Number(n.data.targetDuration) || 15;
      // 已有视频的表不产生新调用；待生成的表按切段算法数段（与客户端 expandStoryboard 同式同默认）
      let calls = 0;
      let refImages = 0;
      if (!hasVideo) {
        const plan = planShotSegments(shots, { maxSeconds });
        // 客户端兜底同款（L13884）：切段结果为空但表里有镜头时，客户端会整表按一段生成——估算按 1 次算
        calls = plan.segments.length ? plan.segments.length : 1;
        // T8 参考图行项：该场缺失参考资产的实体数（跨场共享只计一次）
        for (const ent of collectShotEntities(shots)) {
          if (claimed.has(ent.key)) continue;
          claimed.add(ent.key);
          if (!hasRefAssetName(assetNames, ent.kind, ent.name)) refImages++;
        }
      }
```

</details>

**依据 2 · 源码核查**：[index.js:4253-4257](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/index.js#L4253-L4257)

执行区分旧整场视频和已存在段。

```text
            // 断点续跑：旧版整表单节点（名字不带「段k/N」）→ 整场跳过（该场已有视频、预算已计 0）；
            // 本 hotfix 的段节点 → 只跳过已存在的那几段，缺的段照建（重试语义按段保留）。
            const boardVideos = (doc.edges || []).filter((e) => e.fromNode === sb.id).map((e) => doc.nodes[e.toNode]).filter((n) => n && n.type === 'video');
            const segNumOf = (v) => { const m = String((v.data && v.data.label) || '').match(/ · 段(\d+)\/(\d+)$/); return m ? Number(m[1]) : 0; };
            if (boardVideos.length && !boardVideos.some((v) => segNumOf(v) > 0)) continue;
```

**依据 3 · 源码核查**：[index.js:4307-4318](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/index.js#L4307-L4318)

缺段创建分支给出可测试的阶段键。

<details>
<summary>查看原文（12行）</summary>

```text
            for (let k = 0; k < segCount; k++) {
              if (run.paidAbort) { abortNow(); return; }
              const seg = segs[k];
              const label = segLabelOf(k);
              if (boardVideos.some((v) => String((v.data && v.data.label) || '') === label)) continue;
              // G3 一表一视频的逃生舱只给「同场第 2 段起 / 续跑补建缺段」用；quote 引用用户批准过的预算单号（审计可查），
              // 绝不伪造用户原话。首段不传 override：G2 不过的场在这里照旧硬失败（分镜带病不下场）。
              const needOverride = boardVideos.length > 0 || k > 0;
              const segDuration = Math.max(1, Math.round(Number(seg.duration) || 0));
              const v = canvasCreateNode({ projectId: pid, canvasId: cid, type: 'video', name: label, connectFrom: sb.id, duration: segDuration,
                ...(needOverride ? { override: { by: 'user-explicit', quote: '付费段按预算切段执行（批准单 ' + ap.quoteId + '）：' + label } } : {}) });
              if (v && v.ok === false) throw new Error('[' + v.gate + '] ' + v.error);
```

</details>

**依据 4 · 源码核查**：[index.js:4345-4353](https://github.com/NINKCH/dsh-infinite_canvas/blob/04e9fea11127d80ba76c7fb602f9277285d2b751/index.js#L4345-L4353)

当前重试按本地错误处理。

```text
              let done = false; let err = null;
              for (let attempt = 0; attempt < 2 && !done; attempt++) {
                if (attempt > 0 && run.paidAbort) { abortNow(); return; }
                try { await canvasExec(pid, cid, v.nodeId, { timeoutMs: 15 * 60 * 1000 }); done = true; }
                catch (e) { err = e; run.paidLog.push({ at: Date.now(), text: label + ' 第 ' + (attempt + 1) + ' 次失败：' + String((e && e.message) || e) }); }
              }
              if (!done) throw err;
              lastVideo = v.nodeId;
              run.paidLog.push({ at: Date.now(), text: label + ' 完成' });
```

#### 缺口

- 提供商查询、幂等和金额回报接口是否能统一未知
  **影响**：不能估计收紧后恢复成本
  **进一步探讨**：用测试替身分别模拟有查询、无查询和幂等结果再评估

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
