# ZCode Usage Stats

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f202d78](https://github.com/Amer-CN/zcode-usage-stats/tree/f202d78d3db342fbb251b862b6f8f23bbe4d61c3)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Amer-CN/zcode-usage-stats) [![npm 30d 290](https://img.shields.io/static/v1?label=npm+30d&message=290&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/zcode-usage-stats) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/zcode-usage-stats)
<!-- END META -->

> **功能**：在 DSH 设置页统计本机会话的 Token 用量、模型与时间趋势。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将文件扫描、模型归因和图表组织为本地趋势入口；变化文件复用和告警支持检查，但未证明全量或计费准确。

> **主要限制**：[Q03](#research-q03) 显示枚举失败可能被跳过、读取失败可保留旧贡献且 UI 顶部仍标全部历史；partial 为 false 也不足以证明覆盖完整。

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
  - [Q01 · 谁可用该面板，和逐条读日志或服务商账单相比增加什么？](#detail-section-11)
  - [Q02 · 日志怎样发现、计量与复用，哪些数据不进入总量？](#detail-section-12)
  - [Q03 · 超时或文件读取失败时，总数是否仍为完整、实时结果？](#detail-section-13)
  - [Q04 · 接口和缓存需要哪些宿主能力，写入失败如何处理？](#detail-section-14)
  - [Q05 · 怎样试用，什么时候应停止依赖图表？](#detail-section-15)
  - [Q06 · 显式来源与完整率收据能否减少把部分值误当全量？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：想粗看本地 DSH 历史会话中高用量模型和时段的用户，可使用设置页观察趋势。

手工解析会话日志和查看服务商用量也能帮助核对；日志统计与实际账单口径可能不同。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 用量聚合 | 按日期和模型统计 usage | 仅覆盖匹配文件及可解析字段 |
| 缓存复用 | 避免重读未变文件 | 按 size/mtime，不证明完整或实时 |
| 告警 | 展示超时与读取失败 | 目录枚举错误不一定计入 partial |
| 设置页面 | 查看时间和模型趋势 | 顶部历史标签不能证明全量 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与 Node | 加载需要 | Host、Web 设置页与接口 | 不能假定可用 |
| 已知布局的会话文件及读取权限 | 统计需要 | 获取 usage 事件 | 未匹配或不可读影响覆盖 |
| zstd 解压能力 | 压缩日志需要 | 解压会话文件 | 失败可能保留旧贡献 |
| 宿主 connection 栅栏 | API 需要 | 判断请求可信性 | 缺失时返回 503 |
| 可写缓存目录 | 持久缓存需要 | 保存扫描状态与结果 | 写入失败需重新核实与扫描 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认日志范围与访问权限 | 选少量已知会话作对照 |
| 统计 | 用户打开设置页或刷新 | 查看生成时间和警告 |
| 核对 | 用户逐项比对 usage、模型与日期 | 偏差需回源解释 |
| 退出 | 出现范围未知、错误或总量不符 | 停止依赖汇总并查事件及服务商记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 文件读取、解压及缓存资源未知 | 选择样本并对账，耗时未知 | 全读可能耗时 |
| 持续 | 文件枚举与变化文件重读资源未知 | 检查 warnings 与新旧贡献 | 复用不意味着零 I/O |
| 恢复 | 重扫和缓存存储资源未知 | 检查目录权限及原事件 | 直接覆盖回退的故障结果未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 时间和模型趋势 | 可从匹配事件聚合并展示 | 全量覆盖、账单一致性 |
| 增量复用 | 按文件大小与修改时间复用 | 实时性和实际性能 |
| 部分结果提醒 | warnings 与 API partial/scan | 枚举缺口完整识别及用户理解 |

> **思考**：[Q03](#research-q03) 显示枚举失败可能被跳过、读取失败可保留旧贡献且 UI 顶部仍标全部历史；partial 为 false 也不足以证明覆盖完整。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将文件扫描、模型归因和图表组织为本地趋势入口；变化文件复用和告警支持检查，但未证明全量或计费准确。

[Q02](#research-q02) 的 schema 和文件 revision 复用有具体实现；[Q03](#research-q03) 的目录遍历与 partial 口径不等价，需单独判断覆盖。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示枚举失败可能被跳过、读取失败可保留旧贡献且 UI 顶部仍标全部历史；partial 为 false 也不足以证明覆盖完整。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先逐事件对账，再将其用于本地趋势；来源或完整性不明时回源与服务商核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持有条件的本地聚合和缓存判断；真实覆盖、账单一致性和宿主体验没有本次运行证据。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.mjs、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核查 Host 文件发现、usage 解析、缓存、路由信任检查及 Client 指标和 warnings；未全审所有解压分支、视觉和可插拔后端，不运行目标或真实日志。
- 下一步：用隔离日志构造已知 usage、不可读目录、慢文件和旧贡献，再比较 API、页面与原事件；不使用真实敏感会话。

**分析版本**

- **仓库**：[Amer-CN/zcode-usage-stats](https://github.com/Amer-CN/zcode-usage-stats)
- **版本号**：0.1.2（[固定提交 f202d78](https://github.com/Amer-CN/zcode-usage-stats/tree/f202d78d3db342fbb251b862b6f8f23bbe4d61c3)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出展示来源、旧贡献及覆盖未知的完整率收据；需通过用户误读和理解时间对照验证。

用隔离日志构造已知 usage、不可读目录、慢文件和旧贡献，再比较 API、页面与原事件；不使用真实敏感会话。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 1138 | 975 | 92 | — |
| .mjs | source | 1 | 826 | 701 | 88 | — |
| .md | source | 1 | 209 | — | — | 2558 |
| .cjs | test | 5 | 719 | 618 | 63 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Amer-CN/zcode-usage-stats/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查本地会话用量统计的计量、扫描覆盖和部分结果边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁可用该面板，和逐条读日志或服务商账单相比增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

想了解本地 DSH 会话历史中模型和时段用量趋势的用户，可从设置页查看聚合。作者将其定位为本地会话统计；包声明 bundle 和 Web 客户端，客户端注册设置页并请求 Host API。与逐个解析日志相比，它集中时间和模型聚合与可视化；服务商账单有不同计费与覆盖口径，不能由本地 token 总量替代。没有实测使用或账单对照，不证明全量覆盖或节费。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-23](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/README.md#L19-L23)

作者定位本地统计。

```text

一个装进 DSH 设置页的「Token 记账本」。扫描 `~/.dsh` 下的全历史会话，把每一枚 token 按天、按小时、按模型算清楚：今天写了多少、哪个模型最费、哪天是巅峰。**纯本地扫描、本地聚合、本地渲染**——数据不出本机。

> ⚠️ 非官方社区插件，与 DeepSeek / ZCode 无关联。"zcode" 仅为致敬对象与包名沿用。

```

**依据 2 · 源码核查**：[package.json:1-14](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/package.json#L1-L14)

包身份和 Host、客户端导出。

<details>
<summary>查看原文（14行）</summary>

```text
{
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

**依据 3 · 源码核查**：[package.json:37-47](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/package.json#L37-L47)

bundle 与客户端声明。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/client.js:1003-1018](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/client.js#L1003-L1018)

客户端请求统计 API。

<details>
<summary>查看原文（16行）</summary>

```text
			const load = react.useCallback(async (force) => {
				setLoading(true);
				try {
					const res = await fetch("/api/usage-stats" + (force ? "?refresh=1" : ""), { credentials: "same-origin" });
					if (!res.ok) throw new Error("HTTP " + res.status);
					const json = await res.json();
					if (!json || json.ok === false) throw new Error((json && json.error) || "响应异常");
					setData(json);
					setError(null);
				} catch (e) {
					setError(String((e && e.message) || e));
				}
				setLoading(false);
			}, []);

			react.useEffect(() => { load(false); }, [load]);
```

</details>

**依据 5 · 源码核查**：[lib/client.js:1125-1131](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/client.js#L1125-L1131)

注册设置页。

```text
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "usage-stats",
				order: 80,
				label: () => "使用统计",
				inject: () => ({}),
			}, UsageStatsView));
```

#### 缺口

- 没有独立用户及服务商对账
  **影响**：不能证明需求频率、覆盖或成本收益
  **进一步探讨**：用少量已知会话对照原始事件和提供方记录。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 日志怎样发现、计量与复用，哪些数据不进入总量？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

默认读取 DSH 会话目录，递归深度和文件名有固定上限；同一目录优先较高版本，同版本取较大文件。解析器按 assistant/message 的 usage 将输入、输出、缓存读写累加到日期和模型，模型优先消息来源再回退上下文；没有 usage 或有效日期不会形成用量，step/end 用于计 turn。扫描按文件大小与修改时间复用未变记录，变化文件整份读取；支持 zstd 的逐帧路径。此机制说明计量与复用，但不保证未匹配文件、外部存储、缺失 usage 或 provider 账单被覆盖。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:47-53](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L47-L53)

schema、文件匹配与深度上限。

```text
// 缓存/状态 schema：结构变化时递增，旧缓存自动失效并重建（避免读出旧口径数字）
const CACHE_SCHEMA = 3;
const STATE_SCHEMA = 3;
const CACHE_TTL = 60_000; // 60s 后触发后台刷新(SWR)
const READ_CONCURRENCY = 2; // 解压并发；整份解压后即释放，限制峰值内存
const SESSION_FILE_RE = /^session(?:\.[A-Za-z0-9_-]+)?\.jsonl(?:\.zstd)?$/;
const MAX_SESSION_DEPTH = 4;
```

**依据 2 · 源码核查**：[lib/index.mjs:145-179](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L145-L179)

会话根和目录发现。

<details>
<summary>查看原文（35行）</summary>

```text
// 测试/特殊部署可覆盖会话根；默认 <dshHome>/sessions
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

**依据 3 · 源码核查**：[lib/index.mjs:187-209](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L187-L209)

会话文件版本去重。

<details>
<summary>查看原文（23行）</summary>

```text
// 同一会话目录可能同时留着迁移前的 v3 和迁移后的 v4（内容重叠）。
// 每个目录只保留版本最高的一份；同版本取更大的文件，避免重复计数。
async function dedupeSessionFiles(files) {
  const byDir = new Map();
  for (const file of files) {
    const dir = dirname(file);
    const version = sessionFileVersion(file);
    const prev = byDir.get(dir);
    if (!prev) {
      byDir.set(dir, { file, version });
      continue;
    }
    if (version > prev.version) {
      byDir.set(dir, { file, version });
      continue;
    }
    if (version < prev.version) continue;
    try {
      const [current, kept] = await Promise.all([stat(file), stat(prev.file)]);
      if (current.size > kept.size) byDir.set(dir, { file, version });
    } catch { /* 取不到大小就保留先遇到的一份 */ }
  }
  return [...byDir.values()].map((entry) => entry.file);
```

</details>

**依据 4 · 源码核查**：[lib/index.mjs:299-305](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L299-L305)

模型来源优先级。

```text
// 从 assistant/message 事件里识别模型：消息源优先（逐条准确），
// 其次事件自带 model，最后回退到最近一次 request/context 的模型。
function eventModel(ev, currentModel) {
  const source = ev.data?.message?.source;
  if (source && typeof source.model === "string" && source.model) return source.model;
  if (ev.data && typeof ev.data.model === "string" && ev.data.model) return ev.data.model;
  return currentModel || "other";
```

**依据 5 · 源码核查**：[lib/index.mjs:308-366](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L308-L366)

事件解析与 usage 聚合。

<details>
<summary>查看原文（59行）</summary>

```text
function parseSessionLine(line, ctx, state) {
  if (!line) return;
  let ev;
  try {
    ev = JSON.parse(line);
  } catch {
    ctx.badLines += 1;
    return;
  }
  if (!ev || typeof ev !== "object") return;
  if (!ctx.header) {
    // 首行：{"type":"session", version, id, createdAt, cwd...}
    if (ev.type === "session") {
      ctx.header = ev;
      state.created = typeof ev.createdAt === "number" ? ev.createdAt : 0;
      state.ver = Number.isFinite(ev.version) ? ev.version : 0;
    }
    return;
  }
  if (typeof ev.time === "number") state.last = ev.time;
  switch (ev.type) {
    case "request/context":
      if (typeof ev.data?.model === "string") ctx.currentModel = ev.data.model;
      break;
    case "request/header": {
      const model = ev.data?.header?.config?.model;
      if (typeof model === "string" && model) ctx.currentModel = model;
      break;
    }
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
```

</details>

**依据 6 · 源码核查**：[lib/index.mjs:375-385](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L375-L385)

整文件读取与压缩处理。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 7 · 源码核查**：[lib/index.mjs:449-465](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L449-L465)

revision 复用与重读。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

#### 缺口

- 未以真实会话和账单对账
  **影响**：不能确认日志字段、重复排除与服务商计费一致
  **进一步探讨**：选已知消息逐项核 input、output、cache 及模型。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 超时或文件读取失败时，总数是否仍为完整、实时结果？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

扫描 deadline 在处理每个文件前检查，已在执行的整文件读取和解压没有在此代码处被中断；读失败时若存在旧贡献就保留，结果可能混合不同时间的值。扫描超时或读文件失败写 warnings，并设置 partial 和 scan 元信息；客户端显示 warnings，但顶部会话及消息指标仍标全部历史，未见该页面单独展示 partial 与 scan 完整率。目录遍历的 readdir 异常被逐目录吞掉，若枚举为空只提示目录为空，partial 的计算只根据 timedOut 或 failed，不能据 false 推断完整；枚举漏掉的旧文件还可能被清理出状态。因此发现告警或范围不明时应回源核对，不能把总量视作账单或严格实时值。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:158-179](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L158-L179)

目录读取失败被跳过。

<details>
<summary>查看原文（22行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/index.mjs:420-432](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L420-L432)

空文件集警告。

<details>
<summary>查看原文（13行）</summary>

```text
async function scanSessions(state, warnings, hooks) {
  const startedAt = Date.now();
  const deadline = startedAt + scanTimeoutMs();
  const root = sessionsRoot();
  let files = [];
  try {
    files = await dedupeSessionFiles(await listSessionFiles(root));
  } catch (e) {
    warnings.push(`无法读取会话目录 ${root}：${e && e.message ? e.message : e}`);
    return { sessionCount: 0, timedOut: false, reused: 0, read: 0, failed: 0, elapsedMs: Date.now() - startedAt };
  }
  if (files.length === 0) {
    warnings.push(`会话目录为空：${root}`);
```

</details>

**依据 3 · 源码核查**：[lib/index.mjs:444-479](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L444-L479)

deadline、旧贡献保留和状态清理。

<details>
<summary>查看原文（36行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/index.mjs:482-495](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L482-L495)

超时及失败告警与扫描计数。

<details>
<summary>查看原文（14行）</summary>

```text
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
  };
```

</details>

**依据 5 · 源码核查**：[lib/index.mjs:762-778](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L762-L778)

partial 由超时或文件失败决定。

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

**依据 6 · 源码核查**：[lib/client.js:1089-1104](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/client.js#L1089-L1104)

顶部标签与 warnings 展示。

<details>
<summary>查看原文（16行）</summary>

```text
				element("div", { className: "ust-metrics" },
					element(Metric, { icon: element(IconToken), label: "窗口 Token", value: fmtLarge(stats.total), sub: fmtFull(stats.total) }),
					element(Metric, { icon: element(IconCalendar), label: "活跃天数", value: String(stats.activeDays) + " 天", sub: "有用量的天" }),
					element(Metric, { icon: element(IconTrend), label: "日均", value: fmtLarge(avgPerActive), sub: "按活跃天平均" }),
					element(Metric, { icon: element(IconChat), label: "会话累计", value: fmtFull((data && data.sessionCount) || 0), sub: "全部历史" }),
					element(Metric, { icon: element(IconMail), label: "消息累计", value: fmtFull((data && data.messageCount) || 0), sub: "全部历史" }),
					element(Metric, { icon: element(IconBolt), label: "最常用模型", value: topName, sub: topSub, text: true }),
				),
				wnd.dateKeys.length === 0 ? element("div", { className: "ust-warn" }, "当前时间范围没有数据") : null,
				data.warnings && data.warnings.length > 0 ? element("div", { className: "ust-warn" }, data.warnings.join("；")) : null,
				hasData ? element(Heatmap, { days, window: wnd }) : null,
				hasData && wnd.dateKeys.length > 0 ? element(Trend, { days, window: wnd }) : null,
				hasData && wnd.dateKeys.length > 0 ? element(Donut, { days, window: wnd }) : null,
				element("div", { className: "ust-footer" },
					element("div", { className: "ust-meta" },
						loading ? "正在重新扫描全部会话…" : (data.generatedAt ? "数据更新于 " + fmtClock(data.generatedAt) : ""),
```

</details>

#### 缺口

- 未进行慢盘、权限缺失和 UI 实测
  **影响**：不能确定故障频率、告警可见性或总体误差
  **进一步探讨**：在隔离日志目录测试不可读子目录、超时和旧文件读取失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 接口和缓存需要哪些宿主能力，写入失败如何处理？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

包声明 Node >=20、DSH >=0.2.1-rc.1 与 Web 客户端；Host API 调用宿主 connection.requestRejection，缺该能力时以 503 拒绝，而非直接放行。压缩日志还需运行环境提供 zstd 解压；实际 Node 与宿主组合须验证。缓存默认跟随 profile，环境变量可覆盖；写入先写临时文件再 rename，rename 出错时退化直接覆盖，因此失败或中断时不能一概保证旧缓存完整。首次全读、后续目录枚举和变化文件重读、损坏日志排查均消耗本地资源与人工；金额和时间没有本次测量。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:32-47](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/package.json#L32-L47)

Node、DSH 和 bundle 声明。

<details>
<summary>查看原文（16行）</summary>

```text
    "statistics",
    "使用统计"
  ],
  "engines": {
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
```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:19-22](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L19-L22)

文件 API 和 zstd 解压依赖。

```text
import { readFile, writeFile, mkdir, rename, readdir, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { join, dirname, basename } from "node:path";
import { zstdDecompressSync } from "node:zlib";
```

**依据 3 · 源码核查**：[lib/index.mjs:691-700](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L691-L700)

临时文件、rename 和直接覆盖回退。

<details>
<summary>查看原文（10行）</summary>

```text
async function atomicWrite(path, text) {
  const tmp = `${path}.tmp`;
  await mkdir(dirname(path), { recursive: true });
  await writeFile(tmp, text, "utf8");
  try {
    await rename(tmp, path);
  } catch {
    // Windows 上目标被占用时 rename 可能失败，退化为直接覆盖
    await writeFile(path, text, "utf8");
  }
```

</details>

**依据 4 · 源码核查**：[lib/index.mjs:711-722](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L711-L722)

profile 与环境缓存路径。

<details>
<summary>查看原文（12行）</summary>

```text
export function apply(ctx) {
  const { webServer, connection } = ctx;
  if (!webServer) return;

  // 缓存跟随当前 profile（此前硬编码 profiles/web 是历史遗留）。
  // 解析不到时回退旧路径，保证不断；读缓存时新旧路径都试（一次性迁移）。
  try {
    const profile = typeof ctx.get === "function" ? ctx.get("profileContext") : null;
    if (profile && typeof profile.dir === "string" && profile.dir) cacheDir = profile.dir;
  } catch { /* 保持旧路径 */ }
  const envCacheDir = process.env.USAGE_STATS_CACHE_DIR;
  if (typeof envCacheDir === "string" && envCacheDir.trim()) cacheDir = envCacheDir.trim();
```

</details>

**依据 5 · 源码核查**：[lib/index.mjs:798-810](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L798-L810)

宿主信任检查及缺失时拒绝。

<details>
<summary>查看原文（13行）</summary>

```text
  webServer.register({
    kind: "exact",
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
```

</details>

#### 缺口

- 未运行兼容组合、访问控制与缓存写故障
  **影响**：不能保证目标宿主的接口、权限或恢复结果
  **进一步探讨**：隔离 profile 验证拒绝分支、压缩日志与写入中断。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样试用，什么时候应停止依赖图表？

**研究主题**：采用判断、效果与总成本

#### 完整回答

本地 DSH 用户可先选择几条已知会话，对照 assistant/message 中的四类 usage、日期与模型，再查看 warnings、生成时间和扫描范围；只把结果用于趋势观察。若日志目录不可读、文件匹配或缺失字段不明、出现超时和读取失败，或总量与原始事件明显不符，应停止依赖汇总并回源查事件；费用和账单以服务提供方记录与价格口径核对。冷扫描、人工对账和失败恢复时间未测，历史日志本身不因删除缓存而自动恢复或改变。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:348-366](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L348-L366)

计量的事件与四类 usage。

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[lib/index.mjs:482-495](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L482-L495)

部分扫描告警。

<details>
<summary>查看原文（14行）</summary>

```text
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
  };
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1089-1104](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/client.js#L1089-L1104)

页面指标与警告。

<details>
<summary>查看原文（16行）</summary>

```text
				element("div", { className: "ust-metrics" },
					element(Metric, { icon: element(IconToken), label: "窗口 Token", value: fmtLarge(stats.total), sub: fmtFull(stats.total) }),
					element(Metric, { icon: element(IconCalendar), label: "活跃天数", value: String(stats.activeDays) + " 天", sub: "有用量的天" }),
					element(Metric, { icon: element(IconTrend), label: "日均", value: fmtLarge(avgPerActive), sub: "按活跃天平均" }),
					element(Metric, { icon: element(IconChat), label: "会话累计", value: fmtFull((data && data.sessionCount) || 0), sub: "全部历史" }),
					element(Metric, { icon: element(IconMail), label: "消息累计", value: fmtFull((data && data.messageCount) || 0), sub: "全部历史" }),
					element(Metric, { icon: element(IconBolt), label: "最常用模型", value: topName, sub: topSub, text: true }),
				),
				wnd.dateKeys.length === 0 ? element("div", { className: "ust-warn" }, "当前时间范围没有数据") : null,
				data.warnings && data.warnings.length > 0 ? element("div", { className: "ust-warn" }, data.warnings.join("；")) : null,
				hasData ? element(Heatmap, { days, window: wnd }) : null,
				hasData && wnd.dateKeys.length > 0 ? element(Trend, { days, window: wnd }) : null,
				hasData && wnd.dateKeys.length > 0 ? element(Donut, { days, window: wnd }) : null,
				element("div", { className: "ust-footer" },
					element("div", { className: "ust-meta" },
						loading ? "正在重新扫描全部会话…" : (data.generatedAt ? "数据更新于 " + fmtClock(data.generatedAt) : ""),
```

</details>

#### 缺口

- 没有同条件对账和真实成本测量
  **影响**：不能保证趋势准确或节省管理时间
  **进一步探讨**：记录小样逐事件对账差异和审核耗时。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 显式来源与完整率收据能否减少把部分值误当全量？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

可提出未验证假设：在图表旁展示发现目录、文件匹配规则、扫描失败与超时、复用旧贡献数量及生成时间，发现不可读目录时单独标未知覆盖；用户点击后能回到来源清单。相对现有 warnings 和 API partial，这可能帮助判断总数适用范围，但需要准确统计枚举失败和数据保留策略，也可能增加界面负担。用相同的完整、超时、不可读目录和旧贡献样本，比较现有页面与收据原型的全量误判率、理解时间；若用户已从警告准确识别或额外信息造成更高误解，则不引入。当前没有原型或结果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.mjs:158-179](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L158-L179)

当前目录枚举失败处理。

<details>
<summary>查看原文（22行）</summary>

```text
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

**依据 2 · 源码核查**：[lib/index.mjs:444-486](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/index.mjs#L444-L486)

旧贡献及错误警告。

<details>
<summary>查看原文（43行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/client.js:1089-1104](https://github.com/Amer-CN/zcode-usage-stats/blob/f202d78d3db342fbb251b862b6f8f23bbe4d61c3/lib/client.js#L1089-L1104)

当前总数与警告并列。

<details>
<summary>查看原文（16行）</summary>

```text
				element("div", { className: "ust-metrics" },
					element(Metric, { icon: element(IconToken), label: "窗口 Token", value: fmtLarge(stats.total), sub: fmtFull(stats.total) }),
					element(Metric, { icon: element(IconCalendar), label: "活跃天数", value: String(stats.activeDays) + " 天", sub: "有用量的天" }),
					element(Metric, { icon: element(IconTrend), label: "日均", value: fmtLarge(avgPerActive), sub: "按活跃天平均" }),
					element(Metric, { icon: element(IconChat), label: "会话累计", value: fmtFull((data && data.sessionCount) || 0), sub: "全部历史" }),
					element(Metric, { icon: element(IconMail), label: "消息累计", value: fmtFull((data && data.messageCount) || 0), sub: "全部历史" }),
					element(Metric, { icon: element(IconBolt), label: "最常用模型", value: topName, sub: topSub, text: true }),
				),
				wnd.dateKeys.length === 0 ? element("div", { className: "ust-warn" }, "当前时间范围没有数据") : null,
				data.warnings && data.warnings.length > 0 ? element("div", { className: "ust-warn" }, data.warnings.join("；")) : null,
				hasData ? element(Heatmap, { days, window: wnd }) : null,
				hasData && wnd.dateKeys.length > 0 ? element(Trend, { days, window: wnd }) : null,
				hasData && wnd.dateKeys.length > 0 ? element(Donut, { days, window: wnd }) : null,
				element("div", { className: "ust-footer" },
					element("div", { className: "ust-meta" },
						loading ? "正在重新扫描全部会话…" : (data.generatedAt ? "数据更新于 " + fmtClock(data.generatedAt) : ""),
```

</details>

#### 缺口

- 没有收据原型及用户理解实验
  **影响**：无法证明误读减少或增加的复杂度值得
  **进一步探讨**：用同样故障数据进行盲测并记录判断与耗时。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
