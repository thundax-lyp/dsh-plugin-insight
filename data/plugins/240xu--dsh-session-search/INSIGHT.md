# @240xu/dsh-session-search

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[a12bbb9](https://github.com/240xu/dsh-session-search/tree/a12bbb94f66829e092cd7e3b6431c8a23d357fe5)

<!-- BEGIN META -->
[![npm 30d 1,752](https://img.shields.io/static/v1?label=npm+30d&message=1%2C752&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@240xu/dsh-session-search) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@240xu/dsh-session-search)
<!-- END META -->

> **实现功能**：对本地 DSH 会话日志建立消息索引，提供跨会话关键词搜索、定位摘录和独立面板。

> **核心亮点**：将压缩会话读取、遮蔽过滤和seq定位接入面板/Agent，减少人工解压搜索；算法为成熟子串检索。参见[Q01](#research-q01)。

> **风险与缺陷**：全文名称不能覆盖每消息500字符外；坏日志保旧且无陈旧标识，可能在遮蔽后重扫失败时继续给旧片段。参见[Q02](#research-q02)。

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
  - [Q01 · 跨会话搜索相对rg和人工回顾增加什么？](#detail-section-11)
  - [Q02 · 索引刷新如何处理遮蔽、损坏与新鲜度？](#detail-section-12)
  - [Q03 · 运行、隐私与阶段成本是什么？](#detail-section-13)
  - [Q04 · 怎么试用，何种改进假设能被证伪？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本地单人用户按关键词找历史会话，合格交付为可核原文的session/seq定位，不是语义答案。

人工解压后rg或逐会话查看是参照；插件减接线，前500字符/mtime排序不能和完整相关性检索混称。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 关键词定位 | 跨会话找消息 | 每条前500字符、子串非语义 |
| 面板/API | 本机搜索/刷新 | 回环信任域，非多用户授权 |
| Agent工具 | 返回定位摘录 | dsh-tools可选，失败回字符串 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=23.5、会话读权限 | 必需 | zstd解析 | 无法构建，人工导出 |
| webServer与回环Host | HTTP必需 | 本机围栏API | 远程域名被拒 |
| dsh-tools | 工具可选 | Agent调用 | HTTP面继续 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户核DSH_HOME并启用 | 正确本机日志根 |
| 2 | 用户/Agent关键词搜索 | session/seq可回查 |
| 3 | 用户核原文与陈旧 | 缺失不当无信息，坏缓存重建 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 全量解压/解析、缓存和内存 | 核根和样例定位 | 金额/峰值未测 |
| 持续使用 | refresh、内存线性搜索 | 核原文/覆盖边界 | 无运行服务费用保证，耗时未知 |
| 失败恢复 | 清缓存重建、保旧状态 | 查坏日志与陈旧命中 | 不改源日志；恢复工时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 定位 | project/session/seq摘录 | 全文与相关性 |
| 增量 | mtime+size跳扫 | 元数据碰撞/坏日志新鲜度 |
| 只读原件 | 写缓存不改会话 | 缓存隐私与规模资源 |

> **思考**：全文名称不能覆盖每消息500字符外；坏日志保旧且无陈旧标识，可能在遮蔽后重扫失败时继续给旧片段。参见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将压缩会话读取、遮蔽过滤和seq定位接入面板/Agent，减少人工解压搜索；算法为成熟子串检索。参见[Q01](#research-q01)。

将压缩会话读取、遮蔽过滤和seq定位接入面板/Agent，减少人工解压搜索；算法为成熟子串检索。参见[Q01](#research-q01)。

外部finally清Promise避免永久失败锁，遮蔽过滤尊重逻辑可见性；借鉴时应补覆盖和陈旧状态，勿把缓存原子rename等同全事务。参见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

全文名称不能覆盖每消息500字符外；坏日志保旧且无陈旧标识，可能在遮蔽后重扫失败时继续给旧片段。参见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

单人非敏感本地范围试用，先验已知词与长消息尾部边界，命中后核原文；完整全文/多租户需求暂缓。参见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

可定位前缀检索有源码支持；全文完整性、陈旧与规模效果有边界；分块/新鲜度设计未验证。

- 已检查：作者 README、包清单、源码路径 src/indexer.js、src/index.js、src/fence.js、src/session-file.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核索引、刷新、工具/HTTP、围栏与日志读帧主链；未穷尽全部surface语义、面板渲染或真实宿主。
- 下一步：未运行目标；固定含长尾、遮蔽/坏尾、大帧和同元数据替换语料核覆盖、陈旧与资源。

**分析版本**

- **仓库**：[240xu/dsh-session-search](https://github.com/240xu/dsh-session-search)
- **版本号**：0.1.11（[固定提交 a12bbb9](https://github.com/240xu/dsh-session-search/tree/a12bbb94f66829e092cd7e3b6431c8a23d357fe5)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是全文分块与查询可见新鲜度，默认排除陈旧项；以尾部词/撕裂日志对照覆盖与资源。参见[Q04](#research-q04)。

未运行目标；固定含长尾、遮蔽/坏尾、大帧和同元数据替换语料核覆盖、陈旧与资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 137 | — | — | 1641 |
| .mjs | source | 1 | 52 | 33 | 16 | — |
| .js | source | 5 | 806 | 564 | 203 | — |
| .js | test | 3 | 739 | 608 | 99 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/240xu/dsh-session-search/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地跨会话检索的有效范围、新鲜度与成本边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨会话搜索相对rg和人工回顾增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向知道历史关键词但忘记会话位置的本地DSH用户。合格结果应给项目、session/seq和命中窗口，用户再打开原日志确认适用性。会话为压缩多帧日志，直接rg压缩目录无法得到同样结果；插件把解压、可见消息过滤、缓存和定位集成为HTTP面板/Agent工具。

增量是本地会话格式与消息定位接线，不是新的检索算法。正文名为全文搜索，实际每条消息仅前500字符入索引；这是一种前缀搜索投影，不能将no hits解释为全部历史无此信息。按会话mtime排序也不是语义相关度。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-16](https://github.com/240xu/dsh-session-search/blob/a12bbb94f66829e092cd7e3b6431c8a23d357fe5/README.md#L1-L16)

定位与只读原日志主张。

<details>
<summary>查看原文（16行）</summary>

```text
# @240xu/dsh-session-search
<!-- TODO(截图): 真机截图替换占位图（本轮无浏览器通道，不硬造） -->

DSH web 插件：**跨会话全文搜索**。对 `~/.dsh/sessions` 下全部会话日志（多帧
zstd，v3 格式）建立消息级全文索引，一条关键词查回所有历史会话的命中位置
（sessionId + seq ±60 字符窗口摘录）。

- **零 npm 依赖**（node:zlib zstd + 纯 JS）；
- **对 `~/.dsh/sessions` 零写入**：索引缓存是唯一写点，存
  `$DSH_HOME/cache/session-search/index.json`（原子写 tmp+rename）；
- **侧边栏零触碰**：无任何 sidebar 注册面，UI 是独立面板页
  `/api/session-search/panel`（可选：装了 dsh-devkit 后可由 Ctrl+K 指向该 URL）；
- **信任围栏硬门槛**：全部路由先过 `isTrustedApiRequest`（回环 Host 挡
  DNS rebinding + `sec-fetch-site: cross-site` 拒绝 + Origin 同源校验），
  与 dsh-message-ops 0.2.1 同款（arch-review L4/L5 教训）。

```

</details>

**依据 2 · 源码核查**：[src/indexer.js:21-38](https://github.com/240xu/dsh-session-search/blob/a12bbb94f66829e092cd7e3b6431c8a23d357fe5/src/indexer.js#L21-L38)

每消息截断前500。

<details>
<summary>查看原文（18行）</summary>

```text
const TEXT_LIMIT = 500;

/** 单会话索引条目（msg 级）。 */
function messagesOf(events) {
  const out = [];
  // 0.1.7：**被回滚遮蔽的消息不进索引**（专家组评估的隐私缺口 #3）。
  // 遮蔽由 append-only 的 surface replace marker 表达；恢复则以新 seq 追加重放副本，
  // 新副本不在 replace 区间内 → 恢复后照常可搜、且不会与死本重复（死本已滤掉）。
  // 任一 revert/restore 都会 append 日志 → mtime+size 变化 → 增量重建必然重算本集合，
  // 不存在「缓存里留着旧遮蔽集」的陈旧窗口（缓存版本见 loadCache 的 version）。
  const shadowed = computeShadowed(events);
  for (const e of events) {
    if (!e || typeof e.seq !== "number") continue;
    if (e.type !== "user/message" && e.type !== "assistant/message" && e.type !== "system/message") continue;
    if (shadowed.has(e.seq)) continue;
    const text = messageText(e);
    if (!text) continue;
    out.push({ seq: e.seq, type: e.type, text: text.length > TEXT_LIMIT ? text.slice(0, TEXT_LIMIT) : text });
```

</details>

**依据 3 · 源码核查**：[src/indexer.js:143-173](https://github.com/240xu/dsh-session-search/blob/a12bbb94f66829e092cd7e3b6431c8a23d357fe5/src/indexer.js#L143-L173)

子串和mtime排序。

<details>
<summary>查看原文（31行）</summary>

```text
  search(q, { limit = 20, project, returnMeta = false } = {}) {
    const needle = String(q == null ? "" : q).trim().toLowerCase();
    if (!needle) return returnMeta ? { hits: [], capped: false } : [];
    const requested = Number.isSafeInteger(limit) && limit > 0 ? limit : 20;
    const lim = Math.min(requested, 100);
    // 封顶探测：limit 被 100 钳制时多收 1 条 —— 收满 lim+1 条即证明真实
    // 命中 > 封顶值，capped:true；真实命中恰好 ≤ 封顶值则 capped 不置位。
    const cap = requested > lim ? lim + 1 : lim;
    const entries = Object.values(this.cache.sessions)
      .filter((s) => (project ? s.slug === project : true))
      .sort((a, b) => b.mtime - a.mtime);
    const hits = [];
    for (const s of entries) {
      for (const m of s.messages) {
        const idx = m.text.toLowerCase().indexOf(needle);
        if (idx === -1) continue;
        const from = Math.max(0, idx - 60);
        const to = Math.min(m.text.length, idx + needle.length + 60);
        hits.push({
          session: { id: s.id, slug: s.slug, title: s.title ?? null },
          seq: m.seq,
          type: m.type,
          snippet: (from > 0 ? "…" : "") + m.text.slice(from, to) + (to < m.text.length ? "…" : ""),
        });
        if (hits.length >= cap) break;
      }
      if (hits.length >= cap) break;
    }
    const capped = hits.length > lim;
    const out = capped ? hits.slice(0, lim) : hits;
    return returnMeta ? { hits: out, capped } : out;
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 索引刷新如何处理遮蔽、损坏与新鲜度？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

索引从user/assistant/system事件提文本，computeShadowed排除被surface replace遮蔽的seq。refresh以mtime+size跳过未变日志，重扫变更会话，删除未发现记录；扫描Promise合并并在外部finally清除，避免一次同步错误永久毒化。缓存同目录tmp+rename，仅有新增/删除时写。

可靠性边界在坏日志保留旧缓存，以及mtime+size不能证明内容相同。变更日志重扫失败仍可能回旧文本，API未附每会话陈旧状态，onLog也不保证调用者收到；此时旧缓存里的已遮蔽内容可能仍可搜。源码注释称append重建必然重算，实际上需以成功解压为条件。原子rename防半文件，不等断电耐久或跨进程协调；500字符外、tool/call与空文本明确不覆盖。

#### 证据与依据

**依据 1 · 源码核查**：[src/indexer.js:24-38](https://github.com/240xu/dsh-session-search/blob/a12bbb94f66829e092cd7e3b6431c8a23d357fe5/src/indexer.js#L24-L38)

遮蔽过滤与文本范围。

<details>
<summary>查看原文（15行）</summary>

```text
function messagesOf(events) {
  const out = [];
  // 0.1.7：**被回滚遮蔽的消息不进索引**（专家组评估的隐私缺口 #3）。
  // 遮蔽由 append-only 的 surface replace marker 表达；恢复则以新 seq 追加重放副本，
  // 新副本不在 replace 区间内 → 恢复后照常可搜、且不会与死本重复（死本已滤掉）。
  // 任一 revert/restore 都会 append 日志 → mtime+size 变化 → 增量重建必然重算本集合，
  // 不存在「缓存里留着旧遮蔽集」的陈旧窗口（缓存版本见 loadCache 的 version）。
  const shadowed = computeShadowed(events);
  for (const e of events) {
    if (!e || typeof e.seq !== "number") continue;
    if (e.type !== "user/message" && e.type !== "assistant/message" && e.type !== "system/message") continue;
    if (shadowed.has(e.seq)) continue;
    const text = messageText(e);
    if (!text) continue;
    out.push({ seq: e.seq, type: e.type, text: text.length > TEXT_LIMIT ? text.slice(0, TEXT_LIMIT) : text });
```

</details>

**依据 2 · 源码核查**：[src/indexer.js:79-130](https://github.com/240xu/dsh-session-search/blob/a12bbb94f66829e092cd7e3b6431c8a23d357fe5/src/indexer.js#L79-L130)

并发合并、重扫失败保旧与清Promise。

<details>
<summary>查看原文（52行）</summary>

```text
  async refresh({ onLog } = {}) {
    if (this.scanning) return this.scanning;
    // 0.1.5（P1 修复）：原实现把 async IIFE 直接赋给 this.scanning——IIFE 在首个
    // await 前同步抛出（saveCache ENOSPC / 坏缓存 sessions:null 读属性）时，
    // 内层 finally 的 this.scanning=null 先于赋值执行，随后 rejected promise 被
    // 永久挂上 → 此后所有 refresh 永远返回同一个 rejected promise，索引到进程重启
    // 前全部 500，且毒化后 saveCache 永不执行、坏缓存无法自愈。
    // 正确顺序：先赋值，再在外部挂 finally（且吞掉 finally 链自身的 rejection，
    // 调用方仍通过返回的 p 收到原始 rejection）。
    const scanPromise = (async () => {
      {
        const logs = discoverSessionLogs();
        const seen = new Set();
        let scanned = 0, skipped = 0;
        for (const entry of logs) {
          const key = `${entry.slug}/${entry.id}`;
          seen.add(key);
          const cached = this.cache.sessions[key];
          if (cached && cached.mtime === entry.mtime && cached.size === entry.size) { skipped++; continue; }
          try {
            const { header, events } = await readSessionFileAsync(entry.logPath);
            this.cache.sessions[key] = {
              id: header.id || entry.id,
              slug: entry.slug,
              title: typeof header.title === "string" ? header.title : null,
              parentSession: header.parentSession ?? null,
              mtime: entry.mtime,
              size: entry.size,
              messages: messagesOf(events),
            };
            scanned++;
            if (onLog) onLog(`indexed ${key} (${this.cache.sessions[key].messages.length} messages)`);
          } catch (err) {
            // 坏帧/撕裂日志：保留旧缓存（如有），跳过该会话
            if (onLog) onLog(`skip ${key}: ${err && err.message}`);
            if (!cached) delete this.cache.sessions[key];
          }
        }
        let removed = 0;
        for (const key of Object.keys(this.cache.sessions)) {
          if (!seen.has(key)) { delete this.cache.sessions[key]; removed++; }
        }
        // 0.1.5（P2）：零变更不重写 index.json——GET /api/session-search 每次都先
        // await refresh()，大索引下无条件同步 stringify+write 会阻塞事件循环
        if (scanned > 0 || removed > 0) saveCache(this.cache);
        return { scanned, skipped, removed, total: Object.keys(this.cache.sessions).length };
      }
    })();
    this.scanning = scanPromise;
    scanPromise.finally(() => {
      if (this.scanning === scanPromise) this.scanning = null;
    }).catch(() => { /* finally 链自吞——原始 rejection 由 scanPromise 返回给调用方 */ });
```

</details>

**依据 3 · 源码核查**：[src/indexer.js:57-64](https://github.com/240xu/dsh-session-search/blob/a12bbb94f66829e092cd7e3b6431c8a23d357fe5/src/indexer.js#L57-L64)

缓存写盘边界。

```text
/** 原子写：tmp + rename（同目录保证同一文件系统）。 */
function saveCache(cache) {
  const dir = cacheRoot();
  fs.mkdirSync(dir, { recursive: true });
  cache.builtAt = Date.now();
  const tmp = path.join(dir, `index.json.${process.pid}.tmp`);
  fs.writeFileSync(tmp, JSON.stringify(cache));
  fs.renameSync(tmp, path.join(dir, "index.json"));
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 运行、隐私与阶段成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

Node>=23.5提供内置zstd，DSH_HOME选择日志与缓存根；HTTP需webServer，Agent工具缺包/服务时容错跳过。HTTP fence只准回环Host，拒cross-site并核Origin；这不是账号授权或多租户隔离，无Origin请求可过，远程域名部署反而会被拒。项目过滤是查询便利，不是项目权限隔离。

首次全量解压/解析并在内存保存消息；每八帧让出不能消除单大帧同步解压与整文件Buffer的峰值。日常每查询先refresh，全部缓存仍线性搜索；无npm运行依赖不等无CPU/内存/存储或人工成本。失败可删缓存重建但不改原日志，用户需核原文和陈旧状态；未测数据规模和合格查回，不能给亚秒级保证或单位金额。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:28-34](https://github.com/240xu/dsh-session-search/blob/a12bbb94f66829e092cd7e3b6431c8a23d357fe5/package.json#L28-L34)

Node和tools peer。

```text
  },
  "engines": {
    "node": ">=23.5"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6 || ^0.2.0-rc.1"
  },
```

**依据 2 · 源码核查**：[src/fence.js:24-33](https://github.com/240xu/dsh-session-search/blob/a12bbb94f66829e092cd7e3b6431c8a23d357fe5/src/fence.js#L24-L33)

回环/Origin围栏而非身份授权。

<details>
<summary>查看原文（10行）</summary>

```text
export function isTrustedApiRequest(req) {
  const host = headerOf(req && req.headers, "host");
  if (host === undefined) return false;
  const hostUrl = parseAuthority(host);
  if (hostUrl === undefined) return false;
  if (!isLoopbackHostname(hostUrl.hostname)) return false;
  if (headerOf(req.headers, "sec-fetch-site") === "cross-site") return false;
  const origin = headerOf(req.headers, "origin");
  if (origin === undefined) return true;
  try { return new URL(origin).host === hostUrl.host; } catch { return false; }
```

</details>

**依据 3 · 源码核查**：[src/index.js:147-156](https://github.com/240xu/dsh-session-search/blob/a12bbb94f66829e092cd7e3b6431c8a23d357fe5/src/index.js#L147-L156)

工具每次刷新后查询。

<details>
<summary>查看原文（10行）</summary>

```text
          async execute(args) {
            try {
              await sharedIndex.refresh();
              const results = sharedIndex.search(args.q, { limit: args.limit, project: args.project });
              if (results.length === 0) return `no hits for: ${args.q}`;
              return results.map((h) =>
                `[${h.session.slug}] ${h.session.title || h.session.id} seq ${h.seq} (${h.type}): ${h.snippet}`
              ).join("\n");
            } catch (e) {
              return `search failed: ${e && e.message ? e.message : e}`;
```

</details>

**依据 4 · 源码核查**：[src/session-file.js:143-164](https://github.com/240xu/dsh-session-search/blob/a12bbb94f66829e092cd7e3b6431c8a23d357fe5/src/session-file.js#L143-L164)

整文件与帧间让出。

<details>
<summary>查看原文（22行）</summary>

```text
export async function readSessionFileAsync(file, { framesPerYield = 8 } = {}) {
  // 与 dsh-message-ops 同款：文件读取走 fs.promises.readFile（线程池，
  // 不阻塞事件循环 —— 10.8MB 的 readFileSync 是 19ms 的额外同步阻塞）。
  const buf = await fs.promises.readFile(file);
  const { frames } = scanZstdFrames(buf);
  if (frames.length === 0) throw new Error("empty or header-less session log");
  const frame0Text = zstdDecompressSync(buf.subarray(frames[0].start, frames[0].end)).toString("utf8");
  if (frames.length === 1) {
    // legacy 单帧：一次解压即整份，无需让出
    return { ...parseLegacySingleFrame(frame0Text), frameCount: 1 };
  }
  const header = JSON.parse(frame0Text.trim());
  if (header.type !== "session") throw new Error("first frame is not a session header");
  assertKnownVersion(header);
  const events = [];
  const bodyFrames = frames.slice(1);
  let sinceYield = 0;
  for (const f of bodyFrames) {
    events.push(...parseEventLines(zstdDecompressSync(buf.subarray(f.start, f.end)).toString("utf8")));
    if (++sinceYield >= framesPerYield) { sinceYield = 0; await yieldToLoop(); }
  }
  return { header, events, frameCount: bodyFrames.length };
```

</details>

#### 缺口

- 真实日志规模的延迟/RSS与损坏覆盖未测
  **影响**：不能确认规模上限和完整查回
  **进一步探讨**：构造短长消息、多帧/大帧与坏尾日志，记录峰值和覆盖

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎么试用，何种改进假设能被证伪？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可在单人非敏感本地资料试用，以前500字符内的已知词验证定位，再故意查长消息尾部，理解no hits边界；命中后必须核原文，不把搜索摘要作为知识真相。若需要完整全文、远程多用户隔离或可审计删除传播，应暂缓。

未验证假设为分块全文索引加每会话新鲜度/解析状态，查询默认排除陈旧项并展示覆盖。它从前缀遗漏与失败保旧推导，可能提高查回且避免旧敏感片段泄露，但增加缓存与解压成本。最小对照使用固定消息集合含第501字符后关键词、遮蔽后撕裂日志和同mtime/size替换，比较覆盖、陈旧命中、RSS和刷新耗时。若增加资源却未消除遗漏或陈旧误导，就否定收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/indexer.js:21-38](https://github.com/240xu/dsh-session-search/blob/a12bbb94f66829e092cd7e3b6431c8a23d357fe5/src/indexer.js#L21-L38)

前缀范围导出分块需求。

<details>
<summary>查看原文（18行）</summary>

```text
const TEXT_LIMIT = 500;

/** 单会话索引条目（msg 级）。 */
function messagesOf(events) {
  const out = [];
  // 0.1.7：**被回滚遮蔽的消息不进索引**（专家组评估的隐私缺口 #3）。
  // 遮蔽由 append-only 的 surface replace marker 表达；恢复则以新 seq 追加重放副本，
  // 新副本不在 replace 区间内 → 恢复后照常可搜、且不会与死本重复（死本已滤掉）。
  // 任一 revert/restore 都会 append 日志 → mtime+size 变化 → 增量重建必然重算本集合，
  // 不存在「缓存里留着旧遮蔽集」的陈旧窗口（缓存版本见 loadCache 的 version）。
  const shadowed = computeShadowed(events);
  for (const e of events) {
    if (!e || typeof e.seq !== "number") continue;
    if (e.type !== "user/message" && e.type !== "assistant/message" && e.type !== "system/message") continue;
    if (shadowed.has(e.seq)) continue;
    const text = messageText(e);
    if (!text) continue;
    out.push({ seq: e.seq, type: e.type, text: text.length > TEXT_LIMIT ? text.slice(0, TEXT_LIMIT) : text });
```

</details>

**依据 2 · 源码核查**：[src/indexer.js:97-115](https://github.com/240xu/dsh-session-search/blob/a12bbb94f66829e092cd7e3b6431c8a23d357fe5/src/indexer.js#L97-L115)

失败保旧导出新鲜度状态。

<details>
<summary>查看原文（19行）</summary>

```text
          if (cached && cached.mtime === entry.mtime && cached.size === entry.size) { skipped++; continue; }
          try {
            const { header, events } = await readSessionFileAsync(entry.logPath);
            this.cache.sessions[key] = {
              id: header.id || entry.id,
              slug: entry.slug,
              title: typeof header.title === "string" ? header.title : null,
              parentSession: header.parentSession ?? null,
              mtime: entry.mtime,
              size: entry.size,
              messages: messagesOf(events),
            };
            scanned++;
            if (onLog) onLog(`indexed ${key} (${this.cache.sessions[key].messages.length} messages)`);
          } catch (err) {
            // 坏帧/撕裂日志：保留旧缓存（如有），跳过该会话
            if (onLog) onLog(`skip ${key}: ${err && err.message}`);
            if (!cached) delete this.cache.sessions[key];
          }
```

</details>

#### 缺口

- 全文分块与新鲜度效果未验证
  **影响**：仅是设计假设，不能记当前能力
  **进一步探讨**：按固定语料对照覆盖、陈旧命中及资源

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
