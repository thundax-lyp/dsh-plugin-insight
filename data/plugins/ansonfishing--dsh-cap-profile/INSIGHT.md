# dsh-cap-profile

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[ef1675a](https://github.com/Ansonfishing/dsh-cap-profile/tree/ef1675acaf48e41297f94f24bd8f4ca13626827c)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/Ansonfishing/dsh-cap-profile)
<!-- END META -->

> **实现功能**：扫描 DSH 本地会话历史，按模型展示工具调用、错误签名和时间范围对比。

> **核心亮点**：把冷会话日志转换为模型、工具和错误签名的查阅入口，减少逐份查原日志的导航负担；不需要 live agent，但不能据工具错误率直接评模型质量。[Q01](#research-q01) [Q02](#research-q02)

> **风险与缺陷**：结果错误归给到达时当前模型，callId 只保留工具名，跨模型延迟结果可能使错误分母错位；任务环境混杂也阻止能力排名。定时扫描卸载释放需另核查。[Q03](#research-q03)

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
  - [Q01 · 画像替代什么人工工作，能否代表模型能力？](#detail-section-11)
  - [Q02 · 会话如何解析、归属并呈现？](#detail-section-12)
  - [Q03 · 归因和扫描的风险、成本是什么？](#detail-section-13)
  - [Q04 · 如何建立可比较的任务画像？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：积累大量本地会话的人可用模型与工具摘要定位应回看的日志；指标属于诊断线索。[Q01](#research-q01)

人工按请求头与工具结果整理日志有同类功能，但成本高；现有聚合仅替代整理，未替代业务验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模型调用对比 | 查会话与工具量 | 本地日志可解析，非质量排名 |
| 错误签名聚合 | 定位高频错误 | isError 口径，责任未区分 |
| 时间窗口与多模型面板 | 查看历史分布 | 需真实数据，窗口锚在数据最大日 |
| 后台增量扫描 | 维护历史摘要 | 读取本地目录，资源与卸载待核查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer 与客户端 slots | 启动必需 | 同源路由和观察 tab | 面板不可用 |
| Node24 zstd | 历史解析必需 | 解压会话 | 无真实聚合 |
| 本地会话目录读取权限 | 真实数据必需 | 扫描历史 | 可能回退示例 |
| 固定日志格式 | 正确指标必需 | 请求及工具归因 | 丢事件或偏差 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装重启并打开 tab | 路由与面板可用 |
| 等待 | Host 扫描，用户检查来源 | source 为 live 而非示例 |
| 排查 | 用户筛模型工具并回看原日志 | 计数与归因符合样本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 解压与全扫 CPU/I/O，费用未知 | 安装、确认数据来源、校对样本 | Node zstd 与日志格式依赖 |
| 持续使用 | 60秒增量与24小时全扫，资源未测 | 解释错误、检查任务混杂 | 错误不等于业务失败 |
| 失败恢复 | 重扫与排查资源未知 | 检查路径、归因、卸载定时器 | 日志本身只读 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 历史聚合 | 文件解析、模型工具计数 | 当前用户日志兼容 |
| 错误排查入口 | 签名与窗口展示 | 归因准确率、排查节时 |
| 模型能力判断 | 没有控制任务与环境 | 公平比较和业务结果预测力 |

> **思考**：结果错误归给到达时当前模型，callId 只保留工具名，跨模型延迟结果可能使错误分母错位；任务环境混杂也阻止能力排名。定时扫描卸载释放需另核查。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把冷会话日志转换为模型、工具和错误签名的查阅入口，减少逐份查原日志的导航负担；不需要 live agent，但不能据工具错误率直接评模型质量。[Q01](#research-q01) [Q02](#research-q02)

把冷会话日志转换为模型、工具和错误签名的查阅入口，减少逐份查原日志的导航负担；不需要 live agent，但不能据工具错误率直接评模型质量。[Q01](#research-q01) [Q02](#research-q02)

按文件缓存与只读路由降低冷会话分析耦合，live/mock 标识保留数据边界。源码评估须关注调用结果归因和扫描生命周期，不能只看面板完整度。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

结果错误归给到达时当前模型，callId 只保留工具名，跨模型延迟结果可能使错误分母错位；任务环境混杂也阻止能力排名。定时扫描卸载释放需另核查。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先确认面板显示真实数据，再选数份脱敏会话核对调用、模型和错误归属；用它缩小排查范围。需要模型选型结论时补同任务结果对照。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

回顾聚合实现可核查，模型能力因果判断未建立；归因与生命周期风险有条件，任务分层方案未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/analyzer.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Host 路由、分析器与客户端请求源码；未读取用户真实日志、执行测试或宿主。
- 下一步：核对脱敏日志计数、跨模型延迟结果、损坏压缩帧、加载卸载定时器和历史规模资源，未执行。

**分析版本**

- **仓库**：[Ansonfishing/dsh-cap-profile](https://github.com/Ansonfishing/dsh-cap-profile)
- **版本号**：1.0.0（[固定提交 ef1675a](https://github.com/Ansonfishing/dsh-cap-profile/tree/ef1675acaf48e41297f94f24bd8f4ca13626827c)）
- **版本日期**：2026-08-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可绑定调用时模型并引入任务分层和人工责任标注，以同任务盲审检验画像是否预测业务问题；标注不可靠或环境主导时否定。尚未实现。[Q04](#research-q04)

核对脱敏日志计数、跨模型延迟结果、损坏压缩帧、加载卸载定时器和历史规模资源，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 171 | — | — | 1446 |
| .js | source | 3 | 1477 | 1223 | 188 | — |
| .mjs | test | 2 | 1598 | 1368 | 129 | — |
| .js | example | 1 | 187 | 153 | 17 | — |
| .js | test | 3 | 792 | 685 | 87 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Ansonfishing/dsh-cap-profile/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Ansonfishing/dsh-cap-profile/issues?q=is%3Aissue+created%3A2026-09-24T05%3A55%3A43.696Z..2026-10-24T05%3A55%3A43.696Z)

暂未获取：近30天关闭。

统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：检验会话工具错误画像的诊断价值及模型归因边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 画像替代什么人工工作，能否代表模型能力？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向积累许多 DSH 本地会话、想知道哪个模型经常调用何种工具并出现什么错误的用户。合格交付是可回溯的调用与错误摘要，帮助定位后续应检查的原会话。相对逐份翻日志，按模型和工具归一化聚合、错误签名与时间窗口提供了明确便利。名称中的能力画像不能被理解为同任务模型质量排行榜。工具 isError 可能来自权限、网络、文件不存在或用户任务难度，不等于模型不懂任务；成功调用也不等于合格业务交付。源码支持回顾式观测机制，没有控制任务分布或模型预算，故只能形成诊断线索。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-34](https://github.com/Ansonfishing/dsh-cap-profile/blob/ef1675acaf48e41297f94f24bd8f4ca13626827c/README.md#L9-L34)

作者把翻历史、工具量与错误画像关联，说明目标任务。

<details>
<summary>查看原文（26行）</summary>

````text
## 为什么

会话跑得越多,越难回答「哪个模型在哪些事上稳、哪些事上老翻车」。翻原始日志太慢,人肉统计容易漏。

这个插件把 `~/.dsh/sessions` 的会话历史做成画像,直接回答:每个模型的会话数、工具调用量、错误率、最爱用的工具和最高频的错误签名。

## 快速开始

**前提**:DSH(带 web)+ pnpm;Node ≥ 24(zstd 解码用 Node 内置 `zstdDecompressSync`)。

```bash
cd ~/.dsh/profiles/web                      # 你的 DSH web profile 目录
pnpm add github:Ansonfishing/dsh-cap-profile
```

然后在 `package.json` 的 `dsh.profile.bundles` 数组里加上 `"dsh-cap-profile"`,重启 `dsh`。会话视图出现「能力画像」tab;首次打开触发后台首扫(大历史约 20s 级),期间先显示 mock 数据。

## 功能

- **模型对比表**——每个模型(provider / model)的会话数、工具调用数、错误数、错误率。
- **工具 Top5 / 错误签名 Top5**——每模型最常用工具(含 per-tool 错误率:0 灰 / <5% 琥珀 / ≥5% 红);归一化后的高频错误模式(如 `bash: [exit code: 137] OOM`),快速看出模型「易翻车」面。
- **多模型对比(≤4)**——勾选多个模型进入对比视图:每模型一张卡片,卡内收敛指标对照(best/worst/top 标色)、工具 Top-10 矩阵、高频错误 Top-5、每日调用/错误趋势 mini 竖条(当日错误红色标注);有效勾选 <2 时自动回退单模型详情。
- **时间范围筛选**——全部 / 近 7 / 近 30 / 近 90 天 / 今天 / 昨天(锚点 = 数据中最大日,对系统时钟漂移免疫)。
- **只读**——只分析展示,从不修改会话数据;路由校验客户端头 + Origin/Referer,跨源请求 403。
- **增量缓存**——per-file mtime 基线,后台 60s 增量 / 24h 全量;首扫未完成时路由不阻塞,回退上次缓存或 mock。
- **零运行时依赖**——纯 Node.js。
````

</details>

**依据 2 · 源码核查**：[lib/analyzer.js:172-195](https://github.com/Ansonfishing/dsh-cap-profile/blob/ef1675acaf48e41297f94f24bd8f4ca13626827c/lib/analyzer.js#L172-L195)

错误计数由 tool-result.isError 产生，限定指标含义。

<details>
<summary>查看原文（24行）</summary>

```text
    } else if (o.type === "tool/result") {
      const c = d && d.message && d.message.content;
      let item = null;
      if (Array.isArray(c)) for (const it of c) if (it && it.type === "tool-result") { item = it; break; }
      if (!item || !item.isError) continue;
      if (!curModel) continue;
      const name = item.toolCallId ? callNames.get(item.toolCallId) : undefined;
      const m = model(curModel);
      m.toolErrors++;
      if (name) {
        if (!m.tools[name]) m.tools[name] = { calls: 0, errors: 0 };
        m.tools[name].errors++;
      }
      const sig = errorSignature(name, resultText(item));
      m.errors.set(sig, (m.errors.get(sig) || 0) + 1);
      if (ts !== null) {
        const de = dayEntry(m, dayKey(ts));
        de.errors++;
        if (name) {
          const t = de.tools.get(name) || { calls: 0, errors: 0 };
          t.errors++;
          de.tools.set(name, t);
        }
        de.sigs.set(sig, (de.sigs.get(sig) || 0) + 1);
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话如何解析、归属并呈现？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

Host 读取 sessions 根目录的压缩会话，解析 request/header 更新当前 provider/model；tool/call 记录调用并将 callId 映射为工具名，错误结果按当前模型计数。后台首扫和定时增量更新聚合，客户端经同源 /capability-profile GET 读取，未有真实数据时返回显式 source=mock 的示例。路由检查自定义头与 Origin/Referer，约束浏览器跨源调用，但并非独立用户鉴权系统。它无需 live agent，可查看冷会话；成本是 Host 具备本地历史读取权限、Node 的 zstd 能力以及固定日志格式。示例回退避免空界面却要求用户先看数据来源标识，不能拿示例值判断自己的模型。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:176-205](https://github.com/Ansonfishing/dsh-cap-profile/blob/ef1675acaf48e41297f94f24bd8f4ca13626827c/index.js#L176-L205)

路由来源检查、mock 回退及扫描启动构成数据通路。

<details>
<summary>查看原文（30行）</summary>

```text
function profileHandler(store) {
  return async (req, res) => {
    if (req.headers[CLIENT_HEADER] !== CLIENT_HEADER_VALUE) {
      return json(res, 403, { error: "forbidden: client header missing or wrong" });
    }
    if (!requestOriginOk(req)) {
      return json(res, 403, { error: "forbidden: origin mismatch" });
    }
    if (req.method !== "GET") {
      return json(res, 405, { error: "method not allowed" });
    }
    try {
      // P1: 有 live 数据返回真实聚合;尚无(首扫未完成/root 缺失)回退 mock。
      // P1.5: ?days=7/30/90/today/yesterday 窗口聚合(锚点=数据最大日);非法/缺失=全量。
      return json(res, 200, store.getPayload(parseDaysParam(req)) ?? summaryPayload());
    } catch (err) {
      return json(res, 500, { error: String(err?.message ?? err) });
    }
  };
}

export async function apply(ctx) {
  const store = new ProfileStore({ sessionsRoot: defaultSessionsRoot() });
  ctx.effect(() => ctx.webServer.register({
    kind: "exact",
    path: PROFILE_PATH,
    handler: profileHandler(store),
  }), "dsh-cap-profile: /capability-profile route");
  // 后台扫描:首扫立即 + 60s 增量 + 24h 全量自愈(定时器 unref,不挡进程退出)。
  store.start();
```

</details>

**依据 2 · 源码核查**：[lib/analyzer.js:146-179](https://github.com/Ansonfishing/dsh-cap-profile/blob/ef1675acaf48e41297f94f24bd8f4ca13626827c/lib/analyzer.js#L146-L179)

请求头、callId 工具名和当前模型归因的具体实现。

<details>
<summary>查看原文（34行）</summary>

```text
    if (o.type === "request/header") {
      const cfg = d && d.header && d.header.config;
      if (cfg && cfg.provider && cfg.model) {
        curModel = `${cfg.provider} / ${cfg.model}`;
        if (firstHeaderModel === null) firstHeaderModel = curModel;
      }
    } else if (o.type === "tool/call") {
      const name = d && d.name;
      const cid = d && d.callId;
      if (cid && name) callNames.set(cid, name);
      if (!curModel) continue; // 首个 header 之前的 call 无法归属（实测仅 10 个文件，丢弃）
      const m = model(curModel);
      m.toolCalls++;
      if (name) {
        if (!m.tools[name]) m.tools[name] = { calls: 0, errors: 0 };
        m.tools[name].calls++;
      }
      if (ts !== null) {
        const de = dayEntry(m, dayKey(ts));
        de.calls++;
        if (name) {
          const t = de.tools.get(name) || { calls: 0, errors: 0 };
          t.calls++;
          de.tools.set(name, t);
        }
      }
    } else if (o.type === "tool/result") {
      const c = d && d.message && d.message.content;
      let item = null;
      if (Array.isArray(c)) for (const it of c) if (it && it.type === "tool-result") { item = it; break; }
      if (!item || !item.isError) continue;
      if (!curModel) continue;
      const name = item.toolCallId ? callNames.get(item.toolCallId) : undefined;
      const m = model(curModel);
```

</details>

**依据 3 · 源码核查**：[lib/client.js:562-566](https://github.com/Ansonfishing/dsh-cap-profile/blob/ef1675acaf48e41297f94f24bd8f4ca13626827c/lib/client.js#L562-L566)

客户端带识别头请求窗口聚合。

```text
          // P1.5: 时间范围 → ?days=("0"=全量不带参;today/yesterday/7/30/90;mock 半服务端忽略 days)
          const res = await fetch(PROFILE_PATH + (rangeDays !== "0" ? "?days=" + rangeDays : ""), { headers: { [CLIENT_HEADER]: CLIENT_HEADER_VALUE } });
          if (res.status === 404) throw new Error("404:宿主路由未注册(node 半可能未加载或 dsh 未重启)");
          if (!res.ok) throw new Error("HTTP " + res.status);
          const s = await res.json();
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 归因和扫描的风险、成本是什么？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

最关键的归因边界是 callNames 仅保存工具名，结果的错误归给结果到达时 curModel，而非 callId 对应的调用模型。若模型切换发生在调用和结果之间，错误可记到另一个模型，分母与分子不再对应；是否在真实日志出现该顺序未知。会话数另归文件首个 header 模型，也不能解读为每个参与模型的独立会话数。start 创建的两个 unref 定时器未返回清理接口，apply 没有注册 stop，动态卸载能否清除扫描需要验证。采用成本包括首次解压扫描、持续增量与24小时全扫的 CPU/I/O、人工核对错误分类和样本混杂；金额、耗时与规模曲线未知。适合把它作为本地排查索引小范围试用，若要据此选型或给模型排名，应先补样本对齐和归因校验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/analyzer.js:124-128](https://github.com/Ansonfishing/dsh-cap-profile/blob/ef1675acaf48e41297f94f24bd8f4ca13626827c/lib/analyzer.js#L124-L128)

callId 映射只存工具名。

```text
  const callNames = new Map(); // callId -> tool name（按文件）
  const fileDays = new Set();

  const model = (id) => {
    if (!models[id]) models[id] = { sessions: 0, toolCalls: 0, toolErrors: 0, tools: {}, errors: new Map(), days: new Map() };
```

**依据 2 · 源码核查**：[lib/analyzer.js:172-209](https://github.com/Ansonfishing/dsh-cap-profile/blob/ef1675acaf48e41297f94f24bd8f4ca13626827c/lib/analyzer.js#L172-L209)

错误归当前模型与会话归首模型体现指标口径。

<details>
<summary>查看原文（38行）</summary>

```text
    } else if (o.type === "tool/result") {
      const c = d && d.message && d.message.content;
      let item = null;
      if (Array.isArray(c)) for (const it of c) if (it && it.type === "tool-result") { item = it; break; }
      if (!item || !item.isError) continue;
      if (!curModel) continue;
      const name = item.toolCallId ? callNames.get(item.toolCallId) : undefined;
      const m = model(curModel);
      m.toolErrors++;
      if (name) {
        if (!m.tools[name]) m.tools[name] = { calls: 0, errors: 0 };
        m.tools[name].errors++;
      }
      const sig = errorSignature(name, resultText(item));
      m.errors.set(sig, (m.errors.get(sig) || 0) + 1);
      if (ts !== null) {
        const de = dayEntry(m, dayKey(ts));
        de.errors++;
        if (name) {
          const t = de.tools.get(name) || { calls: 0, errors: 0 };
          t.errors++;
          de.tools.set(name, t);
        }
        de.sigs.set(sig, (de.sigs.get(sig) || 0) + 1);
      }
    }
  }

  // 会话数归文件首个 request/header 的模型；其活跃日（fileDays）全部 file=true
  if (firstHeaderModel !== null) {
    const fm = model(firstHeaderModel);
    fm.sessions++;
    for (const dk of fileDays) dayEntry(fm, dk).file = true;
  }

  // 每个模型补 errorRate（4 位小数）
  for (const m of Object.values(models)) {
    m.errorRate = m.toolCalls ? Math.round((m.toolErrors / m.toolCalls) * 10000) / 10000 : 0;
```

</details>

**依据 3 · 源码核查**：[lib/analyzer.js:524-535](https://github.com/Ansonfishing/dsh-cap-profile/blob/ef1675acaf48e41297f94f24bd8f4ca13626827c/lib/analyzer.js#L524-L535)

创建定时扫描但没有返回释放方法，说明生命周期核查点。

<details>
<summary>查看原文（12行）</summary>

```text
  /** apply() 调用：首扫 + 60s 增量 + 24h 全量自愈（全部 unref，不挡进程退出）。 */
  start() {
    this.scanFull().catch((err) => { this.lastError = String((err && err.message) || err); });
    const ivIncremental = setInterval(() => {
      this.scanIncremental().catch((err) => { this.lastError = String((err && err.message) || err); });
    }, INCREMENTAL_MS);
    ivIncremental.unref();
    const ivFull = setInterval(() => {
      this.scanFull().catch((err) => { this.lastError = String((err && err.message) || err); });
    }, FULL_REFRESH_MS);
    ivFull.unref();
  }
```

</details>

#### 缺口

- 跨 header 延迟结果的实际频率与宿主卸载行为未知。
  **影响**：无法估计归因偏差和重复扫描负担。
  **进一步探讨**：先用脱敏日志检查事件顺序，再在加载卸载循环中观测定时器。
- 没有规模与单位诊断任务耗时数据。
  **影响**：不能量化收益和资源负担。
  **进一步探讨**：按历史体积分档对照手工查日志与面板定位。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何建立可比较的任务画像？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证的任务分层画像，先把 callId 绑定到调用时模型与请求，再把工具错误区分为环境、输入及模型决策，并按共同任务类型呈现样本量和不确定性。增量是从无条件错误聚合变成可追溯的对照入口，不是凭错误文本自动判定模型责任。新增人工标注、脱敏与口径维护成本必须计算。最小验证抽取同任务多模型日志，由盲审人员检查归因与业务合格结果，比较原始错误率和分层结果能否预测需排查会话。若标注一致性低或分层仍被工具环境主导，就不能升级为模型能力判断。当前实现未提供该因果层，假设不能计入现有评分。

#### 证据与依据

**依据 1 · 源码核查**：[lib/analyzer.js:146-186](https://github.com/Ansonfishing/dsh-cap-profile/blob/ef1675acaf48e41297f94f24bd8f4ca13626827c/lib/analyzer.js#L146-L186)

当前归因与错误聚合是任务分层设计的出发点。

<details>
<summary>查看原文（41行）</summary>

```text
    if (o.type === "request/header") {
      const cfg = d && d.header && d.header.config;
      if (cfg && cfg.provider && cfg.model) {
        curModel = `${cfg.provider} / ${cfg.model}`;
        if (firstHeaderModel === null) firstHeaderModel = curModel;
      }
    } else if (o.type === "tool/call") {
      const name = d && d.name;
      const cid = d && d.callId;
      if (cid && name) callNames.set(cid, name);
      if (!curModel) continue; // 首个 header 之前的 call 无法归属（实测仅 10 个文件，丢弃）
      const m = model(curModel);
      m.toolCalls++;
      if (name) {
        if (!m.tools[name]) m.tools[name] = { calls: 0, errors: 0 };
        m.tools[name].calls++;
      }
      if (ts !== null) {
        const de = dayEntry(m, dayKey(ts));
        de.calls++;
        if (name) {
          const t = de.tools.get(name) || { calls: 0, errors: 0 };
          t.calls++;
          de.tools.set(name, t);
        }
      }
    } else if (o.type === "tool/result") {
      const c = d && d.message && d.message.content;
      let item = null;
      if (Array.isArray(c)) for (const it of c) if (it && it.type === "tool-result") { item = it; break; }
      if (!item || !item.isError) continue;
      if (!curModel) continue;
      const name = item.toolCallId ? callNames.get(item.toolCallId) : undefined;
      const m = model(curModel);
      m.toolErrors++;
      if (name) {
        if (!m.tools[name]) m.tools[name] = { calls: 0, errors: 0 };
        m.tools[name].errors++;
      }
      const sig = errorSignature(name, resultText(item));
      m.errors.set(sig, (m.errors.get(sig) || 0) + 1);
```

</details>

#### 缺口

- 任务标签与责任分类的可靠性未验证。
  **影响**：不能宣称可公平比较模型。
  **进一步探讨**：以人工双标小样本检查一致性及与合格结果的关系。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
