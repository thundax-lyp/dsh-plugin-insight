# 肥鱼日记

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[cf35d41](https://github.com/AirPineApplea/feiyu-memory/tree/cf35d41f06c2b764a87531be825756e95b612155)

<!-- BEGIN META -->
[![GitHub ★ 18](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=18&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AirPineApplea/feiyu-memory) [![npm 30d 5,633](https://img.shields.io/static/v1?label=npm+30d&message=5%2C633&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/feiyu-memory) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/feiyu-memory)
<!-- END META -->

> **功能**：给 DeepSeek Harness 的个人陪伴会话提供日记、摘要及跨会话记忆。

> **亮点**：[Q01](#research-q01) 将自动命中与同轮主动结果合并，区分查找索引和模型实际读到的正文。

> **主要限制**：[Q02](#research-q02) 部分阶段仍发送原始或历史文本；[Q03](#research-q03) 写失败后计数清零，回执不能证明落盘。

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
  - [Q01 · 自动与主动检索怎样合入记忆块？](#detail-section-11)
  - [Q02 · 哪些阶段仍把个人文本交给宿主模型？](#detail-section-12)
  - [Q03 · 删除的回执够不够，以及怎样核采用？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人陪伴用户想在新会话延续过往日记和叙事，愿意人工纠正误忆。

自行维护日记或人工将过去片段粘进新会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 自动检索 | 筛历史用于当前会话 | 受阈值与预算限制 |
| 主动检索 | 按问题找日记 | 额外调用模型或退字面 |
| 持久化 | 保存和删除条目 | 需独立验证磁盘 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 会话、提示与可写档案 | 是 | 注入和保存 | 回本地日记 |
| 宿主 LLM 与允许的模型路由 | 后台路径需要 | 判断、摘要及主动检索 | 部分退字面或停止 |
| 虚构或非敏感资料 | 观察前提 | 限定外发损失 | 保持停用 |

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 准备 | 用户 | 独立档案及假的个人条目 | 无隔离则停 |
| 核查 | 用户 | 检查自动/主动命中与请求 | 对照日记原件 |
| 退出 | 用户 | 验证重启后删除与磁盘 | 停用并回笔记 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地存储及宿主 | 配置档案及模型 | 实际兼容未知 |
| 持续 | 注入 token、后台摘要与 picker | 核记忆正确性 | 单位合格续接成本未测 |
| 恢复 | 磁盘副本 | 核实际耐久 | 写错误可被消化 |
| 退出 | 旧档与副本 | 按需单独核删除 | 返回本地笔记 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 自动召回 | 阈值筛选与去重 | 实际相关率 |
| 主动召回 | 同轮待注入和清洗 | 真实预算及来源辨识 |
| 档案维护 | 墓碑、写链与导入 | 失败后耐久 |

> **思考**：[Q02](#research-q02) 部分阶段仍发送原始或历史文本；[Q03](#research-q03) 写失败后计数清零，回执不能证明落盘。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将自动命中与同轮主动结果合并，区分查找索引和模型实际读到的正文。

[Q01](#research-q01) 分离索引和正文接入；[Q03](#research-q03) 写链失败状态需和真实落盘对齐。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 部分阶段仍发送原始或历史文本；[Q03](#research-q03) 写失败后计数清零，回执不能证明落盘。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 仅观察虚构样本，先查后台请求和重启后的档案，再判断继续使用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认召回分路、后台请求及写错误分支。真实模型外发、删除耐久和叙事效果未知。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/core/recall.mjs、src/host/index.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查自动/主动召回、judge、补摘要、picker、写盘和删除；未全面审计宿主隐私、所有归档格式或界面，未执行。
- 下一步：替身模型录四类请求，隔离目录注入三次写失败和重启，并与人工日记对照。

**分析版本**

- **仓库**：[AirPineApplea/feiyu-memory](https://github.com/AirPineApplea/feiyu-memory)
- **版本号**：4.1.0（[固定提交 cf35d41](https://github.com/AirPineApplea/feiyu-memory/tree/cf35d41f06c2b764a87531be825756e95b612155)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 测试带来源及磁盘确认的记忆回执能否减少误判，同时保持陪伴体验。尚未验证。

替身模型录四类请求，隔离目录注入三次写失败和重启，并与人工日记对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 3384 | — | — | 40688 |
| .js | source | 1 | 456 | 335 | 86 | — |
| .mjs | source | 23 | 7877 | 4340 | 2968 | — |
| .mjs | test | 20 | 5257 | 4090 | 573 | — |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/AirPineApplea/feiyu-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=8&color=737b86&logo=github)](https://github.com/AirPineApplea/feiyu-memory/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AirPineApplea/feiyu-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：个人陪伴场景的历史怎样被选入会话，哪些外发、来源和落盘边界会影响可采用性？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 自动与主动检索怎样合入记忆块？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

作者定位为个人陪伴，而人工回填旧日记是简易替代。自动路径索引正文与摘要，用 BM25 和绝对下限、相对首名阈值筛选，默认 patch 有 6000 预算及 0.7 比率。主动工具额外用模型挑摘要，模型返回空列表时不走字面兜底；只有返回 null 才允许 BM25，短查询无结果再扫子串。选中正文先剔 note、清洗，再放入同轮 pendingRecall 并使缓存失效，若取不到 agent ID 仍直接返回正文。同轮主动项优先进入记忆块，后续自动项按 ID 去重。被挑中不保证最后有预算进入模型，也不等于事实准确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-21](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/README.md#L14-L21)

作者限定陪伴和隐私声明。

```text
## ⚠️ 先说清楚（**装之前请务必读完这 200 字**）

- **这是给"拿 DeepSeek 玩玩"的人做的小玩具，不是生产力工具。**
  正式工作和办公场景请不要用。
- 作者**不是职业开发者**。这份代码是一个晚上跟 AI 聊出来的，**有 bug 是正常的**，
  作者也没能对它做安全审计。
- **它会读取你们对话的内容**来做总结。默认全部本地处理、密钥硬拦、
  第三方隐私自动泛化（细节见[隐私](#隐私)一节的自我声明）—— 但**这些声明没有被第三方验证过**。
```

**依据 2 · 源码核查**：[src/core/recall.mjs:57-79](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/core/recall.mjs#L57-L79)

索引输入为正文和摘要。

<details>
<summary>查看原文（23行）</summary>

```text
export function buildIndex(entries) {
  const postings = new Map();
  const df = new Map();
  const lengths = new Map();
  const list = Array.isArray(entries) ? entries : [];

  for (const entry of list) {
    // 正文 + 摘要都吃。
    //
    // 正文是主力：人问往事用的是"项目失败了""那事搞砸了"这种话，
    // 而摘要写的是当天的术语（boot.log、apply/routes），一个字都撞不上。
    //
    // 摘要不能扔：它带着**别名和梗称**（「边缘行者2 / 续集 / 那部动画」），
    // 而正文不一定写全。test/core.test.mjs 里有一条就是拿这个卡着的。
    //
    // 两边都进去的代价只有建索引变重（32ms → 177ms，一次性），
    // 检索本身在 0.2ms 量级，一个 token 都不花。
    const tokens = tokenize(`${entry.text ?? ''}\n${entry.summary ?? ''}`);
    if (tokens.length === 0) continue;

    const tf = new Map();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);

```

</details>

**依据 3 · 源码核查**：[src/core/recall.mjs:281-299](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/core/recall.mjs#L281-L299)

实际阈值和命中上限。

<details>
<summary>查看原文（19行）</summary>

```text
export function topHitScores(index, query, options = {}) {
  const limit = Number.isFinite(options.limit) ? Math.max(0, Math.floor(options.limit)) : 15;
  const ratio = Number.isFinite(options.ratio) ? options.ratio : 0.85;
  const floor = Number.isFinite(options.floor) ? options.floor : 0.6;
  const out = new Map();
  if (limit === 0) return out;

  // 多捞一些再砍：后面的过滤（note、最近的事）会再淘汰一批。
  const scored = searchScores(index, query, { limit: Math.max(limit * 3, 30) });
  const ranked = [...scored.entries()].sort((a, b) => b[1] - a[1]);
  if (ranked.length === 0) return out;

  const cutoff = Math.max(floor, ranked[0][1] * ratio);
  for (const [id, sim] of ranked) {
    if (sim < cutoff) break;
    out.set(id, sim);
    if (out.size >= limit) break;
  }
  return out;
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:62-69](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/cordis.patch.yml#L62-L69)

固定比率及条数设置。

```text
        recentEntries: 3
        # 按相似度最多捞几条**完整正文**进注入（0 = 只留最近的事）。
        # 这是上限，不是目标数 —— 实际条数由下面的 recallScoreRatio 决定。
        recallFanout: 15
        # 召回门槛：只留分数 ≥ 最高分 × 此值的。
        # 越低给得越多，也越吵。0.85 砍过头了（查「南京」5 条全相关，只进 1 条），
        # 提到 0.7。
        recallScoreRatio: 0.7
```

**依据 5 · 源码核查**：[src/host/index.mjs:1044-1075](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/host/index.mjs#L1044-L1075)

同轮主动项优先与自动去重。

<details>
<summary>查看原文（32行）</summary>

```text
      const chosen = [];

      // ── 她刚翻到的，排最前面 ──
      //
      // 2026-11-03：`feiyu_recall` 不再把正文当返回值给她，只存在 `pendingRecall`。
      // 正文从这里混进记忆块 —— 她读到的是"记忆里多了几条"，不是"工具返回了资料"。
      //
      // 只认同一轮（`pendingRecallTurn === s.turn`）：下一轮自动失效，
      // 不会变成常驻条目，也不会滚雪球占预算。
      if (s.pendingRecallTurn === s.turn && s.pendingRecall.length > 0) {
        for (const c of s.pendingRecall) {
          if (chosen.length >= recallLimit) break;
          chosen.push(c);
        }
        log(`会话 ${sessionId} 第 ${s.turn} 轮：翻到的 ${chosen.length} 条并入记忆`);
      }

      if (chatty && recallLimit > 0) {
        // 只留跟第一名接近的（相对门槛），否则会捞进一堆只撞上一个常用词的噪音。
        const hits = topHitScores(index, query, {
          limit: recallLimit,
          ratio: config.recallScoreRatio,
        });
        const poolById = new Map(recallPool.map((e) => [e.id, e]));
        for (const [id, sim] of hits) {
          const entry = poolById.get(id);
          if (entry === undefined) continue;
          // 刚才翻到的已经在里面了，别重复
          if (chosen.some((c) => c.entry?.id === id)) continue;
          chosen.push({ entry, score: sim, sim, why: '' });
          if (chosen.length >= recallLimit) break;
        }
```

</details>

**依据 6 · 源码核查**：[src/host/index.mjs:2319-2333](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/host/index.mjs#L2319-L2333)

模型空数组不退字面。

<details>
<summary>查看原文（15行）</summary>

```text
            const picked = await pickBySummary(query, Math.min(limit, 3));

            let ranked;
            if (picked !== null) {
              ranked = picked
                .map((id) => ({ entry: byId.get(id), sim: 0 }))
                .filter((x) => x.entry && typeof x.entry.text === 'string');
            } else {
              // 没有 llm 服务时退回字面 —— 不能用"挑不了"当没找到
              const scores = searchScores(index, query, { limit: 200 });
              ranked = [...scores.entries()]
                .map(([id, sim]) => ({ entry: byId.get(id), sim }))
                .filter((x) => x.entry && typeof x.entry.text === 'string')
                .sort((a, b) => b.sim - a.sim)
                .slice(0, limit);
```

</details>

**依据 7 · 源码核查**：[src/host/index.mjs:2344-2360](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/host/index.mjs#L2344-L2360)

仅 null 且短查询有子串兜底。

<details>
<summary>查看原文（17行）</summary>

```text
            if (picked === null && ranked.length === 0 && query.length <= 4) {
              const needle = query.toLowerCase();
              ranked = archive.diary
                .filter((e) => typeof e.text === 'string' && e.text.toLowerCase().includes(needle))
                .slice(-limit)
                .reverse()
                .map((entry) => ({ entry, sim: 0 }));
              if (ranked.length > 0) log(`检索「${query.slice(0, 20)}」：词索引空，子串兜底命中 ${ranked.length} 条`);
            }

            if (ranked.length === 0) {
              log(`检索「${query.slice(0, 20)}」：没找到`);
              return {
                ok: true,
                found: 0,
                text: `想不起来了。换个说法再试试，或者直接问他。`,
              };
```

</details>

**依据 8 · 源码核查**：[src/host/index.mjs:2374-2416](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/host/index.mjs#L2374-L2416)

过滤、异常 ID 分支与缓存失效。

<details>
<summary>查看原文（43行）</summary>

```text
            const MAX_CHARS = 2000;
            const pickedEntries = [];
            let used = 0;
            for (const { entry, sim } of ranked) {
              // note（判断那一栏已下线）不进来 —— 让规矩从工具溜回来，等于没删干净
              if (entry.kind === 'note') continue;
              // 跟注入走同一个隐私闸 —— 历史条目里可能还有没洗过的东西
              const clean = scrub(entry.text, { thirdParty: false }).text;
              if (used + clean.length > MAX_CHARS && pickedEntries.length > 0) break;
              pickedEntries.push({ entry: { ...entry, text: clean }, score: sim, sim, why: '' });
              used += clean.length;
            }

            const sid = typeof exec?.agent?.id === 'string' ? exec.agent.id : undefined;
            if (sid === undefined) {
              // 拿不到会话（极端情况）→ 退回旧行为，别让她什么都拿不到
              log(`检索「${query.slice(0, 20)}」：拿不到会话 id，直接返回正文`);
              const now0 = Date.now();
              const lines = pickedEntries.map(({ entry }) => {
                // 跟注入那一栏用同一个时间尺子（dayLabel），别一个模糊一个精确
                const when = dayLabel(entry.created_at, now0);
                return `- ${when === '' ? entry.text : `${when}：${entry.text}`}`;
              });
              return { ok: true, found: lines.length, text: lines.join('\n') || '想不起来了。' };
            }

            const st = stateOf(sid);
            st.pendingRecall = pickedEntries;
            st.pendingRecallTurn = st.turn;
            // 作废按轮缓存：下一次 assemble 会重算，把这批混进记忆块
            st.renderCache = { turn: -1, text: '' };

            log(`检索「${query.slice(0, 20)}」：翻到 ${pickedEntries.length} 条，等注入送`);
            return {
              ok: true,
              found: pickedEntries.length,
              // 2026-11-03：**什么都不留。**
              //
              // 原来是「（翻了翻）」，用户看了说不要 —— 那还是个痕迹：
              // 她读到"我刚翻了一下"，下一句就容易带出"我查到的"。
              //
              // 现在正文全走注入，返回值只是一个空串。工具调用本身还在历史里
              // （该留的证据留着了），但**不会再往她嘴里塞一句"我去翻了"。**
```

</details>

#### 缺口

- 未测实际相关率、同轮重新装配与预算裁剪
  **影响**：检索命中不保证用户得到正确引用
  **进一步探讨**：用非敏感日记样本记录检索、装配及最终回答

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 哪些阶段仍把个人文本交给宿主模型？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

自动检索本身不必为 BM25 请求模型，但 judge 仍将 lastUserText 和手记形成模型输入，摘要补写把待补条目形成请求，主动 picker 将摘要或正文短片段与查询发送到配置模型。固化对 transcript 显式 scrub，主动正文回显也清洗并过滤 note，不能将这些局部措施扩展为所有请求统一清洗。宿主的 llm 可能是本地或远程，须按实际路由验证。主动工具通常将正文经记忆块交给模型，同时工具调用留历史；不能据返回正文为空推断没有传输。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:1370-1395](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/host/index.mjs#L1370-L1395)

judge 以用户文本、手记生成并送出输入。

<details>
<summary>查看原文（26行）</summary>

```text
    let handNotes = [];
    try {
      const p = path.join(archiveDirectory, HANDNOTE_FILE);
      if (existsSync(p)) handNotes = selectHandNotes(readFileSync(p, 'utf8'));
    } catch {
      // 读不到就不给，不影响判断
    }

    const built = buildJudgeInput({ lastUserText: said, handNotes });
    const opts = {
      provider,
      model,
      system: built.system,
      messages: [{ role: 'user', content: [{ type: 'text', text: built.user }] }],
      maxTokens: JUDGE_MAX_TOKENS,
      temperature: 0,
      // 后台任务绝不继承前台的思考档位（踩过：900 token 全烧在推理上）
      reasoningEffort: 'off',
      signal: abort.signal,
    };

    try {
      let raw = '';
      for await (const chunk of llm.stream(opts)) {
        if (chunk?.type === 'text-delta' && typeof chunk.text === 'string') raw += chunk.text;
      }
```

</details>

**依据 2 · 源码核查**：[src/host/index.mjs:557-587](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/host/index.mjs#L557-L587)

补摘要触发独立请求。

<details>
<summary>查看原文（31行）</summary>

```text
      let fails = 0;
      for (let round = 0; round < 80; round++) {
        const todo = pending().slice(0, 10);
        if (todo.length === 0) break;

        const llmP = ctx.get('llm');
        const selection = ctx.get('agentDefaultModel')?.currentSelection?.() ?? undefined;
        const provider = selection?.provider;
        const model = config.model || selection?.model;
        if (llmP === undefined || typeof provider !== 'string' || typeof model !== 'string') {
          warn('补总结：模型信息中途没了，停手');
          markBackfill(total, done, 'stopped');
          return;
        }

        const built = buildSummaryInput(todo);
        let text = '';
        try {
          for await (const chunk of llmP.stream({
            provider,
            model,
            system: built.system,
            messages: [{ role: 'user', content: [{ type: 'text', text: built.user }] }],
            maxTokens: 600,
            temperature: 0,
            // 空字符串是非法档位 —— 实测会让 stream 直接不返回。
            // 跟固化那边保持一致：只有配置里真有值才传。
            ...(typeof config.reasoningEffort === 'string' && config.reasoningEffort.trim() !== ''
              ? { reasoningEffort: config.reasoningEffort.trim() }
              : {}),
          })) {
```

</details>

**依据 3 · 源码核查**：[src/host/index.mjs:1510-1524](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/host/index.mjs#L1510-L1524)

固化清洗当前 transcript，另取日记作为上下文。

<details>
<summary>查看原文（15行）</summary>

```text
    const transcript = recent
      .map((m) => `${m.role === 'user' ? '他' : '我'}：${m.text}`)
      .join('\n\n');

    // 隐私：先洗再发。密钥硬拦 + 第三方泛化都在这一步生效。
    const scrubOpts = {
      thirdParty: config.thirdPartyRedaction !== false,
      amountThreshold: config.amountThreshold,
    };
    const scrubbed = scrub(transcript, scrubOpts);

    const recentDiary = archive.diary
      .slice(-5)
      .map((e) => `- ${e.text}`)
      .join('\n');
```

</details>

**依据 4 · 源码核查**：[src/host/index.mjs:2143-2160](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/host/index.mjs#L2143-L2160)

picker 最多取最近 1200 条摘要或正文短片。

<details>
<summary>查看原文（18行）</summary>

```text
    const POOL_CAP = 1200;
    const pool = base.length > POOL_CAP ? base.slice(-POOL_CAP) : base;
    if (base.length > pool.length) {
      warn(`挑往事：${base.length} 条超过上限 ${POOL_CAP}，只取最近 ${pool.length} 条 —— 更老的挑不到`);
    }

    // 索引行前面带日期 —— 模型才有办法回答「那阵子」这种问法。
    const dayLabel = (t) => {
      if (!Number.isFinite(t)) return '??/??';
      const d = new Date(t);
      return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
    };
    const lines = pool.map((e) => {
      const idx =
        typeof e.summary === 'string' && e.summary !== ''
          ? e.summary
          : String(e.text).replace(/\s+/g, ' ').slice(0, 30);
      return `${e.id} ${dayLabel(e.created_at)} ${idx}`;
```

</details>

**依据 5 · 源码核查**：[src/host/index.mjs:2194-2209](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/host/index.mjs#L2194-L2209)

picker 实际发送索引和问题。

<details>
<summary>查看原文（16行）</summary>

```text
        messages: [
          { role: 'user', content: [{ type: 'text', text: `索引：\n${lines.join('\n')}\n\n她问：${query}` }] },
        ],
        maxTokens: 200,
        temperature: 0,
        // 同上：空字符串是非法档位，stream 会不返回
        ...(typeof config.reasoningEffort === 'string' && config.reasoningEffort.trim() !== ''
          ? { reasoningEffort: config.reasoningEffort.trim() }
          : {}),
      })) {
        if (chunk?.type === 'text-delta') text += chunk.text;
        else if (chunk?.type === 'usage') {
          // 实测（2026-10-28）：usage 不在 finish 上，它是**独立的一种 chunk**。
          // chunkTypes 探针打出来是 block-start,block-end,usage,finish ——
          // 我猜了两轮字段名才看到这个。
          usageChunk = chunk;
```

</details>

**依据 6 · 源码核查**：[src/host/index.mjs:2374-2416](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/host/index.mjs#L2374-L2416)

输出正文过滤，默认由后续注入。

<details>
<summary>查看原文（43行）</summary>

```text
            const MAX_CHARS = 2000;
            const pickedEntries = [];
            let used = 0;
            for (const { entry, sim } of ranked) {
              // note（判断那一栏已下线）不进来 —— 让规矩从工具溜回来，等于没删干净
              if (entry.kind === 'note') continue;
              // 跟注入走同一个隐私闸 —— 历史条目里可能还有没洗过的东西
              const clean = scrub(entry.text, { thirdParty: false }).text;
              if (used + clean.length > MAX_CHARS && pickedEntries.length > 0) break;
              pickedEntries.push({ entry: { ...entry, text: clean }, score: sim, sim, why: '' });
              used += clean.length;
            }

            const sid = typeof exec?.agent?.id === 'string' ? exec.agent.id : undefined;
            if (sid === undefined) {
              // 拿不到会话（极端情况）→ 退回旧行为，别让她什么都拿不到
              log(`检索「${query.slice(0, 20)}」：拿不到会话 id，直接返回正文`);
              const now0 = Date.now();
              const lines = pickedEntries.map(({ entry }) => {
                // 跟注入那一栏用同一个时间尺子（dayLabel），别一个模糊一个精确
                const when = dayLabel(entry.created_at, now0);
                return `- ${when === '' ? entry.text : `${when}：${entry.text}`}`;
              });
              return { ok: true, found: lines.length, text: lines.join('\n') || '想不起来了。' };
            }

            const st = stateOf(sid);
            st.pendingRecall = pickedEntries;
            st.pendingRecallTurn = st.turn;
            // 作废按轮缓存：下一次 assemble 会重算，把这批混进记忆块
            st.renderCache = { turn: -1, text: '' };

            log(`检索「${query.slice(0, 20)}」：翻到 ${pickedEntries.length} 条，等注入送`);
            return {
              ok: true,
              found: pickedEntries.length,
              // 2026-11-03：**什么都不留。**
              //
              // 原来是「（翻了翻）」，用户看了说不要 —— 那还是个痕迹：
              // 她读到"我刚翻了一下"，下一句就容易带出"我查到的"。
              //
              // 现在正文全走注入，返回值只是一个空串。工具调用本身还在历史里
              // （该留的证据留着了），但**不会再往她嘴里塞一句"我去翻了"。**
```

</details>

#### 缺口

- 目标部署实际外发与清洗覆盖未验
  **影响**：不能接办公、第三方或私密数据
  **进一步探讨**：用假的模型服务录请求，对 judge、补写、picker 和主模型分别核对

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 删除的回执够不够，以及怎样核采用？

**研究主题**：工程质量与复用、采用判断、效果与总成本、新假设与验证

#### 完整回答

删除后立墓碑、重建索引并清缓存，再 await persist；但 persist 的 catch 消化写错，后接 then 仍清计数。没有其他抛错时，连续失败难以按注释积到 3，返回 true 不能证明落盘，也不能证明重新启动仍不会召回。导入有显式撤碑意图，应与恢复路径区分。建议用可删的日记样本核报告、磁盘和重启后效果；缓存、摘要补写、picker 与人工校对成本应分开。可试持久写入回执和来源标签同时呈现，观察是否减少误判与不当外发，若准确性不升且损害陪伴体验则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.mjs:881-917](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/host/index.mjs#L881-L917)

写入 catch 后无条件进入清零。

<details>
<summary>查看原文（37行）</summary>

```text
  function persist() {
    if (!ready) return writeChain;
    writeChain = writeChain
      .then(async () => {
        // ⚠️ 顺序要紧：**先并、再改时间戳、再写。**
        // 合并会把 archive 换成新对象，所以 snapshot 必须在合并之后取。
        await mergeDiskEntries();
        // 人格也要先问一声磁盘 —— 不然人手动改的会在这里被覆盖掉
        syncPersonaFromDisk();
        const merged = archive;
        merged.manifest.updated_at = Date.now();
        await writeArchiveDir(archiveDirectory, archiveToFiles(merged));
        await writeReadableDiary(merged);
      })
      .catch((err) => {
        // ⚠️ **连续写盘失败要让面板看得出来。**
        //
        // 原来这里只 warn 一句就吞掉，工具照样返回"记住了"。
        // 社区报告点了一句：这次这个坑是"写成功了但写错地方"，所以捕获救不了 ——
        // 但**真的写失败**的时候，用户同样只会看到「记住了」。
        //
        // 所以：连续 3 次失败就把 degraded 置真，面板上会显示"档案读不了"。
        // 一次失败可能只是临时占用，不值得惊动用户。
        writeFailures += 1;
        warn(
          `写档案失败（连续第 ${writeFailures} 次）：${err instanceof Error ? err.message : String(err)}`,
        );
        if (writeFailures >= 3 && !degraded) {
          degraded = true;
          warn('档案连续写失败 3 次，标记为降级 —— 面板上会显示出来');
        }
      })
      .then(() => {
        // 成功一次就把计数清零：一次失败不该永久挂着
        writeFailures = 0;
      });
    return writeChain;
```

</details>

**依据 2 · 源码核查**：[src/host/index.mjs:1702-1716](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/host/index.mjs#L1702-L1716)

删除路径 await persist 后返回 true。

<details>
<summary>查看原文（15行）</summary>

```text
    const before = archive.diary.length;
    archive.diary = archive.diary.filter((e) => e?.id !== id);
    if (archive.diary.length === before) return false;
    // ⚠️ **删了就得立碑。** 不立的话，落盘前的三路合并会读一遍磁盘 ——
    // 那条还在磁盘上，内存里没有，基线里可能也没有（本会话刚加的）
    // → 判成"别人刚加的" → **捞回来**。面板上的「忘掉」当场失效。
    // 详见 mergeArchives 的说明。
    const tombstones = new Set(archive.manifest.deleted_ids ?? []);
    tombstones.add(id);
    archive.manifest.deleted_ids = [...tombstones];
    // 索引是纯派生的，必须跟着重建 —— 否则"忘掉"的条目还能被召回
    index = buildIndex(archive.diary);
    for (const s of sessionStates.values()) s.renderCache = { turn: -1, text: '' };
    await persist();
    return true;
```

</details>

**依据 3 · 源码核查**：[src/host/index.mjs:1766-1784](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/host/index.mjs#L1766-L1784)

导入有独立撤碑和合并语义。

<details>
<summary>查看原文（19行）</summary>

```text
        // 导入是"我明确要这些东西回来"，墓碑该让位。
        // 基线也要重设：替换之后"谁删过什么"那段历史就不成立了，
        // 不重设的话导入进来的老条目会被判成"别人删了它"。
        archive = { ...incoming, manifest: { ...incoming.manifest, deleted_ids: [] } };
        // ⚠️ **基线要清空，不是设成导入的那些 id。**
        //
        // 基线的语义是「**加载时磁盘上有什么**」，合并靠它区分
        // 「别人删了」和「我刚加的」。而 replace 之后磁盘上什么都没有 ——
        // 导入的内容还在内存里，还没写下去。
        //
        // 设成导入的 id 会出事：persist() 里 mergeDiskEntries 读回一个空磁盘，
        // 每个条目都命中「基线有它、磁盘没有它 → 别人删的」——**全丢**。
        // 端到端测试（导出 → 焚毁 → 导入）就是这么红的。
        loadedIds = new Set();
      } else {
        // merge 模式：并进来的东西同样要撤碑，不然"导入一个之前删过的条目"永远fail
        const incomingIds = new Set(incoming.diary.map((e) => e.id));
        const kept = (archive.manifest.deleted_ids ?? []).filter((id) => !incomingIds.has(id));
        archive = mergeArchives(archive, incoming);
```

</details>

**依据 4 · 源码核查**：[src/host/index.mjs:2217-2224](https://github.com/AirPineApplea/feiyu-memory/blob/cf35d41f06c2b764a87531be825756e95b612155/src/host/index.mjs#L2217-L2224)

picker 记用量但失败不影响结果。

```text
    // 记一笔用量 —— 缓存有没有命中，只有 finish 里的 usage 说得清。
    // 不写日志（debugLog 默认关着），写 manifest：任何时候都能查。
    try {
      markPick(pool.length, lines.length, usageChunk?.usage ?? usageChunk?.data ?? usageChunk);
      await persist();
    } catch (err) {
      warn(`挑往事：记用量失败（不影响结果）：${err instanceof Error ? err.message : String(err)}`);
    }
```

#### 缺口

- 真实断盘、重启与隐私对照未做
  **影响**：不能证明删除持久性或长期净成本
  **进一步探讨**：在隔离档案注入写失败并查重启后的条目，再对照每种请求用量

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
