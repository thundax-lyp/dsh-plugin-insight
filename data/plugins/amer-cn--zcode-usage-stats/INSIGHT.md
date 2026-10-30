# ZCode Usage Stats

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[7045cfd](https://github.com/Amer-CN/zcode-usage-stats/tree/7045cfd29cea53f139d3eed873c5ecf38202f55f)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Amer-CN/zcode-usage-stats) [![npm 30d 137](https://img.shields.io/static/v1?label=npm+30d&message=137&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/zcode-usage-stats) [![最新发布 2026-09-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/zcode-usage-stats)
<!-- END META -->

> **功能**：直接扫描 DSH 会话日志，按日期、小时和模型聚合 Token 用量，提供增量缓存、趋势与活跃热力图。

> **亮点**：变化文件复用、模型来源优先归因、schema失效及partial/scan元信息提高本地趋势可检查性，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：直接文件范围不等所有日志，deadline非硬取消，失败留旧贡献形成混合；Client未突出partial收据，顶栏仍可能被当全量，见 [Q02](#research-q02)。

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
  - [Q01 · 当前从什么数据生成趋势，用户能拿它做什么？](#detail-section-11)
  - [Q02 · 部分扫描、增量缓存与API信任如何表达？](#detail-section-12)
  - [Q03 · 怎样限定试用，完整率收据如何检验？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本地DSH操作者可查高用量模型/时段与活跃趋势，先核覆盖和计量，非费用账单，见 [Q01](#research-q01)。

逐日志手算或服务商独立账单；插件增加本地分布图/缓存，不测真实扣费或所有持久后端。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 文件聚合 | 历史usage趋势 | 已知布局/深度，非所有后端 |
| 增量缓存 | 变化重读、schema失效 | size/mtime非强内容指纹 |
| API | partial/scan+受保护读取 | ok不等全量，旧贡献可保留 |
| 视图 | 日期/model可视化 | 警告不是独立完整率卡 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20/匹配DSH Web | 必需 | Host/Client及路由 | 声明版本非实机验收 |
| 已知session文件布局/权限 | 统计必需 | JSONL/zstd扫描 | 可插拔后端/深路径不保证 |
| usage桶/模型/事件代次 | 计量必需 | 聚合解释 | 缺usage不计token |
| connection信任栅栏 | API必需 | 授权访问聚合 | 缺服务503 |
| 可写profile缓存 | 性能可选 | schema3与增量复用 | 写失败重扫/可能覆盖降级 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定root/profile、小样对账 | 清单/桶口径明确 |
| 扫描 | Host枚举/读变文件 | 查partial/scan而非sessionCount |
| 展示 | Client读API/SWR | 旧值与警告可解释 |
| 恢复 | 强制刷新并查旧贡献 | 不混用缓存来源或删真实日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 全读/解压/缓存未知 | 对范围与usage小样 | 大文件非硬超时 |
| 持续使用 | 枚举/变动重读未知 | partial/陈旧值复核 | 复用不等零I/O |
| 失败恢复 | 重扫/旧缓存未知 | 核坏文件与来源/新旧贡献 | 写失败可能直接覆盖 |
| 退出 | 聚合隐私存储未知 | 明确profile清缓存 | 不清真实日志 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 历史趋势 | 日/小时/model聚合 | 原始字段/日志覆盖准确 |
| 缓存 | schema/变动复用/SWR | 多root/profile范围一致 |
| 完整率 | API partial/scan及warnings | 读者是否误当全量 |

> **思考**：直接文件范围不等所有日志，deadline非硬取消，失败留旧贡献形成混合；Client未突出partial收据，顶栏仍可能被当全量，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：变化文件复用、模型来源优先归因、schema失效及partial/scan元信息提高本地趋势可检查性，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

[Q02](#research-q02) schema与partial/scan是可复用工程增量；直接扫文件的范围身份和可中止/耐久写要另验，不能把旧缺口原样继承。

<a id="detail-section-5"></a>

### 1.4 主要限制

直接文件范围不等所有日志，deadline非硬取消，失败留旧贡献形成混合；Client未突出partial收据，顶栏仍可能被当全量，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

少量已知会话对账后再本地趋势试用；partial/旧贡献不明时停止依赖总数，回源事件/服务商记录，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前文件扫描/缓存/鉴权和Client警告已核，条件本地趋势试用；未执行目标或读真实会话。

- 已检查：作者 README、包清单、源码路径 build/body.js、lib/index.mjs、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：旧五题/11findings/自code依赖与原稿证据复核；完整inventory，当前读lib/index主要扫描/解析/缓存/栅栏及build/body对应请求/警告，未验视觉/所有解压分支。
- 下一步：新完整/超时/坏文件/同mtime/切root profile日志夹具，小样授权usage对账和UI误读对照；本轮未运行插件/测试或读用户日志。

**分析版本**

- **仓库**：[Amer-CN/zcode-usage-stats](https://github.com/Amer-CN/zcode-usage-stats)
- **版本号**：0.1.2（[固定提交 7045cfd](https://github.com/Amer-CN/zcode-usage-stats/tree/7045cfd29cea53f139d3eed873c5ecf38202f55f)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将现有partial升级为来源/schema及新旧完整率显著UI收据，测误读和恢复负担；未实现部分不计能力，见 [Q03](#research-q03)。

新完整/超时/坏文件/同mtime/切root profile日志夹具，小样授权usage对账和UI误读对照；本轮未运行插件/测试或读用户日志。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 1138 | 975 | 92 | — |
| .mjs | source | 1 | 826 | 701 | 88 | — |
| .md | source | 1 | 187 | — | — | 2281 |
| .cjs | test | 5 | 719 | 618 | 63 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Amer-CN/zcode-usage-stats/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Amer-CN/zcode-usage-stats/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Amer-CN/zcode-usage-stats/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：日志文件范围、增量/部分统计和缓存能否被正确解释为本地用量趋势？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 当前从什么数据生成趋势，用户能拿它做什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

zcode-usage-stats 0.1.2是DSH原生Host/Client插件，Node>=20、宿主声明>=0.2.1-rc.1。给本地操作者看日/小时/model用量、活跃天和热力图，适合发现高用量时期而非账单价格、成本因果或硬预算。相对逐日志手算，它聚合时间分布和模型来源，是本地观测便利，不独立测token或提高业务完成率。

当前直接扫描DSH_HOME/sessions或显式root下已知session JSONL/zstd文件，最多深度4、解压并发2；不是依赖sessionPersistence读取所有可插拔后端。读文件后按事件解析，模型优先消息source.model再事件model再最近context/header，usage四桶相加，缺usage不算token，step/end计轮数。逻辑依赖官方日志形状、文件布局、字段互斥和模型归因，其他后端或更深路径可能不覆盖；跨provider同名也只按model显示。先确认范围再读图，不能由“全量”字样认定完整。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-14](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/package.json#L2-L14)

版本及双半区出口。

<details>
<summary>查看原文（13行）</summary>

```text
  "name": "zcode-usage-stats",
  "version": "0.1.2",
  "description": "仿zcode的使用统计：在 DeepSeek Harness(DSH) 设置页渲染全量会话的 Token 用量统计——按天/按小时趋势图、模型用量仪表盘、活跃热力图，支持今天/昨天/最近7·30天/本月/上月/自定义区间。",
  "type": "module",
  "main": "./lib/index.mjs",
  "exports": {
    ".": {
      "default": "./lib/index.mjs"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[package.json:36-49](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/package.json#L36-L49)

Node/宿主声明。

<details>
<summary>查看原文（14行）</summary>

```text
    "node": ">=20",
    "dsh": ">=0.2.1-rc.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    },
    "engines": {
      "dsh": ">=0.2.1-rc.1"
    },
    "compatibility": {
```

</details>

**依据 3 · 源码核查**：[lib/index.mjs:48-53](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L48-L53)

schema及并发/文件范围。

```text
const CACHE_SCHEMA = 3;
const STATE_SCHEMA = 3;
const CACHE_TTL = 60_000; // 60s 后触发后台刷新(SWR)
const READ_CONCURRENCY = 2; // 解压并发；整份解压后即释放，限制峰值内存
const SESSION_FILE_RE = /^session(?:\.[A-Za-z0-9_-]+)?\.jsonl(?:\.zstd)?$/;
const MAX_SESSION_DEPTH = 4;
```

**依据 4 · 源码核查**：[lib/index.mjs:146-179](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L146-L179)

sessions root与深度扫描。

<details>
<summary>查看原文（34行）</summary>

```text
function sessionsRoot() {
  const env = process.env.USAGE_STATS_SESSIONS_ROOT;
  if (typeof env === "string" && env.trim()) return env.trim();
  return join(dshHome(), "sessions");
}

// 扫描超时：默认 120s；冷扫描实测 20s 左右，留足慢盘/大库余量
function scanTimeoutMs() {
  const n = Number(process.env.USAGE_STATS_SCAN_TIMEOUT_MS);
  return Number.isFinite(n) && n >= 0 ? n : 120_000;
}

// 会话文件发现：sessions/<project>/<session-dir>/session[.vN].jsonl[.zstd]
async function listSessionFiles(root) {
  const files = [];
  const stack = [[root, 0]];
  while (stack.length > 0) {
    const [dir, depth] = stack.pop();
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (depth < MAX_SESSION_DEPTH) stack.push([p, depth + 1]);
      } else if (entry.isFile() && SESSION_FILE_RE.test(entry.name)) {
        files.push(p);
      }
    }
  }
  return files;
```

</details>

**依据 5 · 源码核查**：[lib/index.mjs:299-305](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L299-L305)

模型归因优先级。

```text
// 从 assistant/message 事件里识别模型：消息源优先（逐条准确），
// 其次事件自带 model，最后回退到最近一次 request/context 的模型。
function eventModel(ev, currentModel) {
  const source = ev.data?.message?.source;
  if (source && typeof source.model === "string" && source.model) return source.model;
  if (ev.data && typeof ev.data.model === "string" && ev.data.model) return ev.data.model;
  return currentModel || "other";
```

**依据 6 · 源码核查**：[lib/index.mjs:337-368](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L337-L368)

轮数与usage实际累计。

<details>
<summary>查看原文（32行）</summary>

```text
    case "step/end": {
      // turns 官方口径:一个新 turn 记 1 次。以 step/end 为权威——每个 step 必然发出,
      // 覆盖 completed/failed/cancelled/max-tokens;而 assistant/message 会漏 cancelled。
      const turn = ev.data?.turn;
      if (typeof turn === "number" && turn !== ctx.lastTurn) {
        ctx.lastTurn = turn;
        const key = dateKey(ev.time);
        if (key) state.t[key] = (state.t[key] || 0) + 1;
      }
      break;
    }
    case "assistant/message": {
      state.m += 1;
      const usage = ev.data?.usage;
      if (!usage) break;
      const key = dateKey(ev.time);
      if (!key) break;
      const model = eventModel(ev, ctx.currentModel);
      ctx.currentModel = model;
      const hour = hourOf(ev.time);
      const arr = [
        Number(usage.inputTokens) || 0,
        Number(usage.outputTokens) || 0,
        Number(usage.cacheReadTokens) || 0,
        Number(usage.cacheWriteTokens) || 0,
      ];
      if (arr[0] + arr[1] + arr[2] + arr[3] === 0) break;
      bumpUsage(ensureBucket(state.u, key), model, arr);
      if (typeof hour === "number") {
        bumpUsage(ensureBucket(ensureBucket(state.h, key), hour), model, arr);
      }
      break;
```

</details>

#### 缺口

- 不同日志代次、桶口径、坏行/迁移和provider同名的完整率未验。
  **影响**：不能把部分/缓存趋势当完整实时计量或账单事实。
  **进一步探讨**：合成小样逐条核字段/模型/轮数，对比文件清单和真实持久源，确认统计覆盖后再看趋势。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 部分扫描、增量缓存与API信任如何表达？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

扫描以size+毫秒mtime复用旧文件状态，默认120秒deadline只在派发下一文件前看，已经readFile/解压的不取消，不是硬时限。读失败保留该文件旧贡献，新文件失败则不计，超时未处理文件也可留旧值，结果可能混新旧；当前API明确partial和scan读/复用/失败/耗时字段，比仅warning可检查，但ok仍true、sessionCount仍全部发现数，不等处理完成数。Client以ok决定加载并显示warnings，未独立展示partial/scan收据，读者仍可能忽略提示把顶部数字当全量。

缓存有schema3失效检查，优先当前profile.dir或显式cache目录，缺失退旧web路径，并能迁移同schema旧缓存。缓存路径与数据源标识、模块级cacheDir是否在同进程多profile串扰仍需验证，不继续沿用“固定web且无schema”的旧判断。60秒后SWR先给旧快照再后台刷，refresh=1等重扫；扫描state写失败吞错、临时rename失败直接覆盖，非全局耐久保证。API显式connection.requestRejection，缺服务503，宿主身份细节仍由宿主负责，聚合数据也能暴露使用习惯，不等无敏感数据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:375-391](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L375-L391)

完整文件读与mtime复用基线。

<details>
<summary>查看原文（17行）</summary>

```text
// 读一个会话文件 → 可跨进程复用的聚合状态
async function readSessionState(file) {
  const state = newSessionState();
  const ctx = { header: null, currentModel: "other", lastTurn: null, badLines: 0 };
  const buf = await readFile(file);
  if (file.endsWith(".zstd")) {
    parseSessionBuffer(buf, ctx, state);
  } else {
    for (const line of buf.toString("utf8").split("\n")) parseSessionLine(line, ctx, state);
  }
  if (!ctx.header) throw new Error("缺少会话头");
  return state;
}

function fileRevision(info) {
  // size + mtime 足够判断“文件是否被追加/重写”；比哈希整份文件便宜得多
  return `${info.size}:${Math.floor(info.mtimeMs)}`;
```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:444-494](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L444-L494)

deadline、旧贡献及扫描字段。

<details>
<summary>查看原文（51行）</summary>

```text
  await runPool(files, READ_CONCURRENCY, async (file) => {
    if (Date.now() >= deadline) {
      timedOut = true;
      return;
    }
    let info;
    try {
      info = await stat(file);
    } catch {
      return; // 扫描期间被删除：稍后由清理逻辑移除
    }
    const rev = fileRevision(info);
    const prev = state.files[file];
    if (prev && prev.rev === rev) {
      reused += 1;
      done += 1;
      hooks.progress(done, total);
      return;
    }
    try {
      const parsed = await readSessionState(file);
      state.files[file] = { rev, ...parsed };
      read += 1;
    } catch {
      failed += 1;
      if (failedExamples.length < 5) failedExamples.push(basename(dirname(file)));
      // 读失败时保留旧贡献，避免统计突然掉数据；下次再试
      if (!prev) delete state.files[file];
    }
    done += 1;
    hooks.progress(done, total);
  });

  // 清理已不存在的会话文件（只删“确实不在本次文件清单”的条目）
  for (const key of Object.keys(state.files)) {
    if (!fileSet.has(key)) delete state.files[key];
  }

  if (timedOut) {
    warnings.push(`扫描超时：已处理 ${done}/${total} 个会话，下次刷新会继续补齐`);
  }
  if (failed > 0) {
    warnings.push(`${failed} 个会话读取失败${failedExamples.length ? `（${failedExamples.join("、")} 等）` : ""}，已跳过`);
  }
  return {
    sessionCount: total,
    timedOut,
    reused,
    read,
    failed,
    elapsedMs: Date.now() - startedAt,
```

</details>

**依据 3 · 源码核查**：[lib/index.mjs:624-639](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L624-L639)

ok与partial/scan同存。

<details>
<summary>查看原文（16行）</summary>

```text
  return {
    ok: true,
    schemaVersion: CACHE_SCHEMA,
    generatedAt: Date.now(),
    sessionCount: s.sessionCount,
    messageCount: s.messageCount,
    dayCount: dayList.length,
    currentStreak: s.currentStreak,
    summary,
    grandTotal,
    topModel,
    totals,
    days: dayList,
    warnings: s.warnings, // 失败/降级提示
    partial: Boolean(meta && meta.partial),
    scan: meta && meta.scan ? meta.scan : undefined,
```

</details>

**依据 4 · 源码核查**：[lib/index.mjs:672-699](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L672-L699)

schema检查和写失败降级覆盖。

<details>
<summary>查看原文（28行）</summary>

```text
async function loadDiskCache() {
  // 新路径优先；没有则读旧路径做一次性迁移（冷启动不丢数）
  for (const p of [cacheFilePath(), legacyCacheFilePath()]) {
    if (!p) continue;
    const j = await readJson(p);
    if (j && typeof j === "object" && (j.ok || j.error)) {
      // 旧口径缓存不再使用：字段语义已变（模型归因/统计范围），避免显示错数
      if (j.ok && j.schemaVersion !== CACHE_SCHEMA) continue;
      return j;
    }
  }
  return null;
}

async function loadScanState() {
  const j = await readJson(stateFilePath());
  return isScanState(j) ? j : emptyScanState();
}

async function atomicWrite(path, text) {
  const tmp = `${path}.tmp`;
  await mkdir(dirname(path), { recursive: true });
  await writeFile(tmp, text, "utf8");
  try {
    await rename(tmp, path);
  } catch {
    // Windows 上目标被占用时 rename 可能失败，退化为直接覆盖
    await writeFile(path, text, "utf8");
```

</details>

**依据 5 · 源码核查**：[lib/index.mjs:715-735](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L715-L735)

profile缓存与吞写错误。

<details>
<summary>查看原文（21行）</summary>

```text
  // 缓存跟随当前 profile（此前硬编码 profiles/web 是历史遗留）。
  // 解析不到时回退旧路径，保证不断；读缓存时新旧路径都试（一次性迁移）。
  try {
    const profile = typeof ctx.get === "function" ? ctx.get("profileContext") : null;
    if (profile && typeof profile.dir === "string" && profile.dir) cacheDir = profile.dir;
  } catch { /* 保持旧路径 */ }
  const envCacheDir = process.env.USAGE_STATS_CACHE_DIR;
  if (typeof envCacheDir === "string" && envCacheDir.trim()) cacheDir = envCacheDir.trim();

  let state = emptyScanState();
  let stateDirty = false;
  let stateWrite = Promise.resolve();

  const persistScanState = () => {
    if (!stateDirty) return stateWrite;
    stateDirty = false;
    const snapshot = JSON.stringify(state);
    stateWrite = stateWrite
      .then(() => atomicWrite(stateFilePath(), snapshot))
      .catch(() => { /* 写盘失败不影响主流程，下次重扫 */ });
    return stateWrite;
```

</details>

**依据 6 · 源码核查**：[lib/index.mjs:762-778](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L762-L778)

partial接线。

<details>
<summary>查看原文（17行）</summary>

```text
  const ensureScan = () => {
    if (!inflight) {
      inflight = (async () => {
        await stateReady;
        const warnings = [];
        const scan = await scanSessions(state, warnings, hooks);
        const aggregated = aggregateStates(state, scan.sessionCount, warnings);
        const built = buildCache(aggregated, {
          partial: scan.timedOut || scan.failed > 0,
          scan: {
            sessions: scan.sessionCount,
            read: scan.read,
            reused: scan.reused,
            failed: scan.failed,
            elapsedMs: scan.elapsedMs,
            timedOut: scan.timedOut,
          },
```

</details>

**依据 7 · 源码核查**：[lib/index.mjs:800-823](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L800-L823)

失败关闭鉴权与SWR。

<details>
<summary>查看原文（24行）</summary>

```text
    path: "/api/usage-stats",
    handler: async (req, res) => {
      // 本路由是 /api 下的 exact 路由,优先级高于 dsh-client-connection 挂在 /api prefix 上的
      // 信任栅栏(Host/Origin + 浏览器认证 cookie),必须自己过栅栏(官方 dsh-host-open-in-app 同一做法)。
      const rejection = connection && typeof connection.requestRejection === "function"
        ? connection.requestRejection(req)
        : 503; // 拿不到栅栏服务时拒绝服务,而不是放行
      if (rejection !== undefined) {
        res.statusCode = rejection;
        res.end(rejection === 401 ? "unauthorized" : rejection === 403 ? "forbidden" : "service unavailable");
        return;
      }
      const url = new URL(req.url, "http://x");
      const refresh = url.searchParams.get("refresh") === "1";
      if (!cache || refresh) {
        // 无缓存:必须同步扫描首屏等待;或强制刷新:等待新结果
        await ensureScan();
      } else {
        // 有缓存:立即返回;若过期则后台异步刷新,不阻塞本次响应(SWR)
        const stale = Date.now() - (cache.generatedAt || 0) > CACHE_TTL;
        if (stale) ensureScan();
      }
      res.writeHead(cache && cache.ok ? 200 : 500, { "Content-Type": "application/json" });
      res.end(JSON.stringify(cache));
```

</details>

**依据 8 · 源码核查**：[build/body.js:729-736](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/build/body.js#L729-L736)

前端按ok接受数据。

```text
			const load = react.useCallback(async (force) => {
				setLoading(true);
				try {
					const res = await fetch("/api/usage-stats" + (force ? "?refresh=1" : ""), { credentials: "same-origin" });
					if (!res.ok) throw new Error("HTTP " + res.status);
					const json = await res.json();
					if (!json || json.ok === false) throw new Error((json && json.error) || "响应异常");
					setData(json);
```

**依据 9 · 源码核查**：[build/body.js:823-824](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/build/body.js#L823-L824)

warnings实际展示。

```text
				wnd.dateKeys.length === 0 ? element("div", { className: "ust-warn" }, "当前时间范围没有数据") : null,
				data.warnings && data.warnings.length > 0 ? element("div", { className: "ust-warn" }, data.warnings.join("；")) : null,
```

#### 缺口

- 大文件deadline、文件同mtime改写、多profile/root及缓存写失败下的统计范围未实测。
  **影响**：不能把部分/缓存趋势当完整实时计量或账单事实。
  **进一步探讨**：副本注入慢/坏文件、同size/mtime、切root/profile与失败写，核partial/scan、旧贡献、UI警告和实际缓存来源。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样限定试用，完整率收据如何检验？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议本地趋势小范围试用，先对少量已知会话逐条核usage和模型归因，再观察大量文件下partial、warnings、耗时和手动刷新。金融/预算结论应回服务商记录；当前不生成费用，不能让Token图替代收款账单。首次扫描/解压/缓存占I/O和内存，持续只重读变化文件但还枚举目录，失败需核旧贡献/重扫和缓存范围；现金/耗时未知。退出可保留聚合备份并禁用，但清缓存需确认实际profile和隐私范围，不能误删真实日志。

可证伪方向是把已具partial/scan进一步提升为顶层显著完整率/数据源/schema/新旧贡献收据，分开发现数、处理数、坏行数及陈旧行，不以ok总括。当前部分标记已实现，未来增量是UI和范围身份闭环，不再把“加入partial”冒充全新建议。用完整/超时/旧贡献/根切换样本比较当前与显著收据的误读全量、定位缺口和人工时间；若不减误判或维护负担增加则停止。总token/节时收益和真实用户需求未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:762-778](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L762-L778)

已有partial和scan作为基线。

<details>
<summary>查看原文（17行）</summary>

```text
  const ensureScan = () => {
    if (!inflight) {
      inflight = (async () => {
        await stateReady;
        const warnings = [];
        const scan = await scanSessions(state, warnings, hooks);
        const aggregated = aggregateStates(state, scan.sessionCount, warnings);
        const built = buildCache(aggregated, {
          partial: scan.timedOut || scan.failed > 0,
          scan: {
            sessions: scan.sessionCount,
            read: scan.read,
            reused: scan.reused,
            failed: scan.failed,
            elapsedMs: scan.elapsedMs,
            timedOut: scan.timedOut,
          },
```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:467-483](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/lib/index.mjs#L467-L483)

旧贡献及超时混合。

<details>
<summary>查看原文（17行）</summary>

```text
    } catch {
      failed += 1;
      if (failedExamples.length < 5) failedExamples.push(basename(dirname(file)));
      // 读失败时保留旧贡献，避免统计突然掉数据；下次再试
      if (!prev) delete state.files[file];
    }
    done += 1;
    hooks.progress(done, total);
  });

  // 清理已不存在的会话文件（只删“确实不在本次文件清单”的条目）
  for (const key of Object.keys(state.files)) {
    if (!fileSet.has(key)) delete state.files[key];
  }

  if (timedOut) {
    warnings.push(`扫描超时：已处理 ${done}/${total} 个会话，下次刷新会继续补齐`);
```

</details>

**依据 3 · 源码核查**：[build/body.js:823-824](https://github.com/Amer-CN/zcode-usage-stats/blob/7045cfd29cea53f139d3eed873c5ecf38202f55f/build/body.js#L823-L824)

当前warnings入口是显示增量基线。

```text
				wnd.dateKeys.length === 0 ? element("div", { className: "ust-warn" }, "当前时间范围没有数据") : null,
				data.warnings && data.warnings.length > 0 ? element("div", { className: "ust-warn" }, data.warnings.join("；")) : null,
```

#### 缺口

- 没有真实对账、完整率理解、I/O或增强收据对照。
  **影响**：不能把部分/缓存趋势当完整实时计量或账单事实。
  **进一步探讨**：新合成日志后用授权匿名小样对账，测统计误差、用户误读、扫描/恢复资源和人时。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
