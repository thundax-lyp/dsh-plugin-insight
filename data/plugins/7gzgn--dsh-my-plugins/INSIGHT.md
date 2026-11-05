# dsh-my-plugins

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4bf4175](https://github.com/7gzgn/dsh-my-plugins/tree/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e)

<!-- BEGIN META -->
[![npm 30d 861](https://img.shields.io/static/v1?label=npm+30d&message=861&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-my-plugins) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-my-plugins)
<!-- END META -->

> **功能**：在顶栏提供可搜索插件清单，显示所选 profile 的包名、版本、说明和分类。

> **亮点**：[Q02](#research-q02) 汇总来源标记、清单搜索及profile选择；[Q06](#research-q06) 增加调用观察标签，但不是运行状态或完整用量账本。

> **主要限制**：[Q03](#research-q03) 声明/安装/运行仍混合；[Q06](#research-q06) 名称归因及延迟写使计数不完整，不能据此判断插件闲置。

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
  - [Q01 · 插件清单解决什么重复问题？](#detail-section-11)
  - [Q02 · profile、版本和描述怎样形成报告？](#detail-section-12)
  - [Q03 · 为什么不能把报告称作当前已激活插件真相？](#detail-section-13)
  - [Q04 · 哪些用户可试，怎样避免误读？](#detail-section-14)
  - [Q05 · 声明、安装和运行三层状态能否提升排障？](#detail-section-15)
  - [Q06 · “用过多少次”实际怎样归因、持久化，能否据此识别闲置插件？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向装了许多DSH插件、想记清包名、版本和作用的Web或Desktop用户。合格结果是能在当前profile下找到目标包并解释元数据来自哪里，不能把列表存在当激活和可靠性证明。原来可手读profile/package.json和node_modules，此项把信息汇入可搜索面板，并显示官方前缀分类和数量。贡献是方便浏览与统一呈现，不是新插件发现或运行监控算法；数量本身不证明每项能力已在宿主可用。

参照手工读取profile/package.json和实装包；没有把main导出当模型工具或静态清单当运行可用性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 清单与元数据 | 读取选定profile声明与本地包版本描述 | 缺包版本回退声明；非激活状态 |
| 描述来源汇总 | 人工/市场/包描述与descSource | 人工优先并截短，市场请求会写缓存 |
| 搜索与重扫 | overlay按包名/名称/描述筛选并强扫 | 重扫不提供Loader权威状态 |
| 调用观察标签 | 按全局事件工具名聚合次数及ok/fail | 突发计数可覆盖、跨profile同名混合；非闲置证明 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| webServer和Web slots | 界面必需 | report与overlay | 无面板 |
| profile路径与package.json | 必需 | 清单来源 | 返回找不到profile或猜错 |
| node_modules包清单 | 实装版本必需 | 作者元信息 | fallback声明版本/空描述 |
| DSH_WEB_URL与市场 | 中文说明可选 | registry缓存 | 回退notes或package |
| 可写dshHome缓存 | 市场缓存需要 | 保存中文map | 失败被捕获并降级 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 核profile | 手工对照目录和三项已知包 | 不符先设置明确profile |
| 浏览 | 搜索、看实装/声明及descSource | 不以数量或hasTools判断激活 |
| 看计数 | 只参考观察到的事件 | 不以0或纯界面标签卸载 |
| 退出 | 禁用overlay，手查配置/Loader | 缓存持久副本需按目录决定清理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地目录与包扫描资源 | 核profile、来源、版本与计数边界 | 宿主兼容及工时未测 |
| 持续 | 同步JS目录扫描、市场请求/缓存和1.5秒统计写盘 | 核滞后/漏记而非信赖标签 | 无模型请求，资源金额与延迟未知 |
| 失败 | 缓存与漏计可留下错误线索 | 转手查配置/Loader/事件日志 | 禁用不等删除usage缓存，恢复工时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 清单汇总 | 实际读配置/包并搜索 | 是否当前激活与节时未知 |
| 描述可追源 | descSource区分优先来源 | 截断/别名准确性需人工核 |
| 使用观察 | 事件映射与本地计数链已接 | 非完整次数、闲置或插件价值证明 |

> **思考**：[Q03](#research-q03) 声明/安装/运行仍混合；[Q06](#research-q06) 名称归因及延迟写使计数不完整，不能据此判断插件闲置。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 汇总来源标记、清单搜索及profile选择；[Q06](#research-q06) 增加调用观察标签，但不是运行状态或完整用量账本。

scan与客户端分离便于复用，包不可读时降级不会让整份清单失败。代价是宽松fallback隐藏不确定性；profile选择、hasTools和版本应显式标启发式，市场缓存需要同步文档。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 声明/安装/运行仍混合；[Q06](#research-q06) 名称归因及延迟写使计数不完整，不能据此判断插件闲置。

<a id="detail-section-6"></a>

### 1.5 使用建议

明确设置DSH_PROFILE并仅把它当包清单阅读辅助的人可受控试用。首次检查profile名称、声明bundle和实装版本一致，再搜索一个已知插件并强刷；持续有同步文件读取、面板渲染、市场HTTP与缓存写，未调用模型但不能标零成本。包缺失、市场不可用可降级描述，人工需核对未知而不是信任数量。成功是清单逐项对应所选profile，描述来源不误认作者，禁用后overlay移除；若误选profile或把声明版本/启发式入口当运行状态，应停止依赖这些字段排障。真实节时和大规模插件延迟无数据。 [Q04](#research-q04)

- 已检查固定源码和作者材料。
- 未运行插件、目标测试、浏览器或真实profile扫描。
- 已明确文档与市场缓存实现差异，运行状态未采集。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

profile包清单与overlay可核查；运行激活未采集，文档的不联网和作者原话保证与实现不符；三层状态为假设。

- 已检查：作者 README、包清单、源码路径 README.md、client.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整变更涉及profile选择、市场别名/描述裁剪、正则扫描、usage事件与写盘、scan和客户端标签；未启动宿主或模拟事件。
- 下一步：固定提交4bf4175fa807bebc602bf92d9b6bdf58fb2e091e核profile/扫描/事件/写盘及UI。未安装、启动宿主、注入事件或测延迟；真实事件兼容、路由访问控制及统计准确率未知。

**分析版本**

- **仓库**：[7gzgn/dsh-my-plugins](https://github.com/7gzgn/dsh-my-plugins)
- **版本号**：0.2.0（[固定提交 4bf4175](https://github.com/7gzgn/dsh-my-plugins/tree/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出声明/安装/运行三层状态与说明来源标记，未验证；以缺包、pending和多profile任务测排障准确率，运行状态过期或理解负担上升会削弱收益。

- 已检查固定源码和作者材料。
- 未运行插件、目标测试、浏览器或真实profile扫描。
- 已明确文档与市场缓存实现差异，运行状态未采集。

固定提交4bf4175fa807bebc602bf92d9b6bdf58fb2e091e核profile/扫描/事件/写盘及UI。未安装、启动宿主、注入事件或测延迟；真实事件兼容、路由访问控制及统计准确率未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 737 | 523 | 171 | — |
| .md | source | 1 | 55 | — | — | 518 |
| .mjs | test | 2 | 69 | 49 | 8 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/7gzgn/dsh-my-plugins/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/7gzgn/dsh-my-plugins/issues?q=is%3Aissue+created%3A2026-10-06T06%3A34%3A44.234Z..2026-11-05T06%3A34%3A44.234Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/7gzgn/dsh-my-plugins/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T06%3A34%3A44.234Z..2026-11-05T06%3A34%3A44.234Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：插件管理者能否在明确profile下查包元数据与调用线索，并避免把候选/漏计误当闲置或加载真相？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件清单解决什么重复问题？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向装了许多DSH插件、想记清包名、版本和作用的Web或Desktop用户。合格结果是能在当前profile下找到目标包并解释元数据来自哪里，不能把列表存在当激活和可靠性证明。原来可手读profile/package.json和node_modules，此项把信息汇入可搜索面板，并显示官方前缀分类和数量。贡献是方便浏览与统一呈现，不是新插件发现或运行监控算法；数量本身不证明每项能力已在宿主可用。 新增用过/未调用标签只能作为粗统计线索，不能证明插件无用或应卸载。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-23](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/README.md#L10-L23)

作者目标与清单入口。

<details>
<summary>查看原文（14行）</summary>

```text
## 为什么会有这个东西

装了二十几个插件之后，界面上的变化你天天看得见，但**谁也说不清到底装了什么**：
市场里点过的、朋友推荐的、自己 link 进来的，全混在一起。

所以这颗药丸只回答一个问题：**我现在到底装了什么，它们各自是干什么的。**

## 它怎么知道

读 **当前 profile 的 `package.json`**——`dsh.profile.bundles` 是真正被加载的名单，
`dependencies` 给声明的版本，实装版本看 `node_modules/<包名>/package.json`。

不去扫目录猜，也不用你填任何东西。插件的一句话作用取自它自己的 `package.json`，
**作者怎么写就怎么显示**，我们不替它编、不翻译、不打分。
```

</details>

**依据 2 · 源码核查**：[client.js:165-203](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/client.js#L165-L203)

工具调用标签和汇总展示。

<details>
<summary>查看原文（39行）</summary>

```text
          'div',
          { key: p.id, style: css.row },
          h(
            'div',
            { style: css.line1 },
            h('span', { style: css.title }, p.title || p.id),
            p.version ? h('span', { style: css.ver }, 'v' + p.version) : null,
            h('span', { style: p.official ? css.tag : { ...css.tag, ...css.tagMine } }, p.official ? '自带' : '第三方'),
          p.toolCount > 0
            ? p.used
              ? h('span', { style: css.usedTag }, `用过 ${p.calls} 次`)
              : h('span', { style: css.idleTag }, '没用过')
            : h('span', { style: css.uiTag }, '纯界面'),
          ),
          p.title && p.title !== p.id ? h('div', { style: { ...css.desc, color: '#6f7480' } }, p.id) : null,
          p.desc
            ? h(
                'div',
                { style: css.desc },
                hasCn(p.desc) ? null : h('span', { style: css.enTag }, '英文原文'),
                p.desc,
              )
            : h('div', { style: { ...css.desc, color: '#5d5d6b' } }, '（这个插件没写描述）'),
        ),
      );

      const panel = h(
        'div',
        { style: css.panel },
        h(
          'div',
          { style: css.head },
          h('div', { style: { flex: '0 0 auto' } }, data ? `${data.total} 个 · ${data.idleCount ?? data.unusedCount ?? 0} 个没调用过工具` : '读取中…'),
          h('input', {
            style: css.input,
            value: q,
            placeholder: '搜包名 / 名字 / 描述',
            onChange: (e) => setQ(e.target.value),
          }),
```

</details>

#### 缺口

- 真实插件管理频次与节时未测
  **影响**：不能把入口便利当用户收益
  **进一步探讨**：比较人工核清单与面板的逐项准确率

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · profile、版本和描述怎样形成报告？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

profile优先DSH_PROFILE_DIR，再DSH_PROFILE，再从宿主argv识别profiles/name或--profile，最后才按package mtime兜底。路径形式argv只取名称再拼dshHome/profiles，未保证原路径相同；环境变量优先仍可与运行scope冲突。清单优先非空bundles，否则dependencies，排除自己并去重；包存在读实际version，缺包回退声明去^/~。描述依次notes人工、市场中文、包description，并标descSource；市场别名去字母数字后缀，冒号前短句与截断不是作者原话保真。报告60秒缓存，市场缓存6小时，宿主DSH_WEB_URL存在时异步取registry并写本地。overlay获取report，按名字/描述搜索。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:56-124](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/lib/index.js#L56-L124)

profile来源和优先级。

<details>
<summary>查看原文（69行）</summary>

```text
/**
 * 从宿主自己的命令行里认出**正在跑的那个** profile。
 *
 * 为什么不靠 mtime：宿主每次启动都会把它扫到的 profile 的 package.json 重写一遍，
 * 于是"最新修改的"经常是一个根本没在跑的 profile（2026-11-02 的真实事故：
 * bili-duty 被启动流程重写后比 desktop 新，面板就报成「配置：bili-duty，2 个插件」，
 * 用户看到的像是插件全没了）。
 *
 * 宿主进程的 argv 里带着 profile 目录（`... --expose-internals <host.js> <app> <profiles/desktop>`），
 * 也可能只写 `--profile=desktop` / `--profile desktop` 这种名字形式，两种都认。
 */
function profileFromArgv() {
  const argv = process.argv || [];
  const root = join(dshHome(), 'profiles');
  // 1) 直接给了 profiles/<name> 路径
  for (const a of argv) {
    if (typeof a !== 'string') continue;
    const m = /[\\/]profiles[\\/]([^\\/]+?)[\\/]?$/.exec(a.trim());
    if (m && existsSync(join(root, m[1], 'package.json'))) return join(root, m[1]);
  }
  // 2) 只给了 --profile <name> / --profile=<name>
  for (let i = 0; i < argv.length; i++) {
    const a = String(argv[i] || '');
    let want = null;
    if (/^--profile=/.test(a)) want = a.slice('--profile='.length);
    else if (a === '--profile' && i + 1 < argv.length) want = String(argv[i + 1]);
    if (!want) continue;
    if (existsSync(join(root, want, 'package.json'))) return join(root, want);
  }
  return null;
}

/**
 * 选当前 profile，优先级：
 *   1. DSH_PROFILE_DIR 指的那个（profileCandidates 已把它排在最前）
 *   2. DSH_PROFILE 指的那个
 *   3. 宿主命令行里认出来的那个（最可靠）
 *   4. 都没有才退回"package.json 最新修改的那个"（老办法，只在拿不到 argv 时当兜底）
 */
function pickProfile() {
  const dirs = profileCandidates();
  if (!dirs.length) return null;
  const first = dirs[0];
  if (process.env.DSH_PROFILE_DIR && first === process.env.DSH_PROFILE_DIR) {
    const pkg = readJson(join(first, 'package.json'));
    if (pkg) return { dir: first, pkg };
  }
  const want = process.env.DSH_PROFILE;
  if (want) {
    for (const d of dirs) {
      const pkg = readJson(join(d, 'package.json'));
      if (pkg && pkg.name === `dsh-profile-${want}`) return { dir: d, pkg };
      if (d.endsWith(`profiles${'\\'}${want}`) || d.endsWith(`profiles/${want}`)) {
        if (pkg) return { dir: d, pkg };
      }
    }
  }
  const fromArgv = profileFromArgv();
  if (fromArgv) {
    const pkg = readJson(join(fromArgv, 'package.json'));
    if (pkg) return { dir: fromArgv, pkg };
  }
  let best = null;
  for (const d of dirs) {
    const pkg = readJson(join(d, 'package.json'));
    if (!pkg) continue;
    let mtime = 0;
    try {
      mtime = statSync(join(d, 'package.json')).mtimeMs;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:166-199](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/lib/index.js#L166-L199)

市场获取、别名与写缓存。

<details>
<summary>查看原文（34行）</summary>

```text
    }
  } catch {
    /* 还没有缓存 */
  }
  refreshZhMap();
  return {};
}

async function refreshZhMap() {
  if (refreshing) return;
  const base = process.env.DSH_WEB_URL;
  if (!base) return;
  refreshing = true;
  try {
    const r = await fetch(`${base}/dsh-market/registry`, { headers: { accept: 'application/json' } });
    if (!r.ok) return;
    const j = await r.json();
    const list = j?.registry?.plugins;
    if (!Array.isArray(list)) return;
    const map = {};
    for (const p of list) {
      const zh = p?.description?.zh;
      if (!p?.name || typeof zh !== 'string' || !zh.trim()) continue;
      const v = zh.trim();
      map[p.name] = v;
      // 市场里的名字常带后缀（dsh-better-sidebar-N23），给个去掉后缀的别名指向同一条
      const alias = p.name.replace(/-[A-Za-z]+\d+$/, '');
      if (alias !== p.name && alias.length > 3 && map[alias] === undefined) map[alias] = v;
    }
    writeFileSync(REGISTRY_CACHE, JSON.stringify({ at: Date.now(), map }), 'utf8');
    cache.at = 0; // 下次请求重新扫描，这次就能拿到中文
  } catch {
    /* 拿不到登记表就退回包自己的描述，不影响使用 */
  } finally {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:326-417](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/lib/index.js#L326-L417)

清单、描述、版本及报告缓存。

<details>
<summary>查看原文（92行）</summary>

```text

  const picked = pickProfile();
  if (!picked) {
    const empty = { ok: false, error: '找不到 profile（没有 ~/.dsh/profiles/*/package.json）', profile: null, plugins: [], total: 0, thirdParty: 0 };
    cache = { at: now, data: empty };
    return empty;
  }

  const { dir, pkg } = picked;
  const zhMap = loadZhMap();
  const notes = loadNotes();
  const usageTools = loadUsage().tools;
  const profileName = String(pkg.name || '').replace(/^dsh-profile-/, '') || 'unknown';
  const deps = pkg.dependencies && typeof pkg.dependencies === 'object' ? pkg.dependencies : {};
  const declared = Array.isArray(pkg.dsh?.profile?.bundles) ? pkg.dsh.profile.bundles : [];
  // bundles 是「实际加载」的名单；万一没有，退回到 dependencies 里所有插件
  const ids = declared.length ? declared : Object.keys(deps);

  const seen = new Set();
  const plugins = [];
  for (const rawId of ids) {
    const id = String(rawId);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    if (id === NS) continue; // 自己不列自己

    const pluginDir = join(dir, 'node_modules', id);
    const nm = join(pluginDir, 'package.json');
    const modPkg = existsSync(nm) ? readJson(nm) : null;
    const toolNames = existsSync(pluginDir) ? collectToolNames(pluginDir) : [];
    let calls = 0;
    let ok = 0;
    let fail = 0;
    let lastAt = 0;
    for (const t of toolNames) {
      const r = usageTools[t];
      if (!r) continue;
      calls += r.calls || 0;
      ok += r.ok || 0;
      fail += r.fail || 0;
      if ((r.lastAt || 0) > lastAt) lastAt = r.lastAt;
    }
    const { title, desc } = humanize(modPkg, id);
    // 优先级：人写的一句话 > 市场登记表的中文（砍掉冒号后的细节） > 包自己的描述
    const marketRaw = typeof zhMap[id] === 'string' ? zhMap[id] : '';
    const marketZh = marketRaw ? clip(headPhrase(marketRaw) || marketRaw, 60) : '';
    const humanZh = typeof notes[id] === 'string' ? clip(notes[id], 120) : '';
    const finalDesc = humanZh || marketZh || desc;
    const descSource = humanZh ? 'human' : marketZh ? 'market' : desc ? 'package' : 'none';
    const declaredVersion = deps[id];
    plugins.push({
      id,
      title,
      version: (modPkg && modPkg.version) || (typeof declaredVersion === 'string' ? declaredVersion.replace(/^[~^]/, '') : ''),
      desc: finalDesc,
      descSource,
      toolCount: toolNames.length,
      calls,
      ok,
      fail,
      lastAt,
      used: calls > 0,
      official: isOfficial(id),
      hasClient: Boolean(modPkg && (modPkg.dsh?.client || modPkg.exports?.['./client'] || modPkg.exports?.client)),
      hasTools: Boolean(modPkg && (modPkg.main || modPkg.exports?.['.'])),
    });
  }

  plugins.sort((a, b) => {
    if (a.official !== b.official) return a.official ? -1 : 1;
    return a.id.localeCompare(b.id);
  });

  const thirdParty = plugins.filter((p) => !p.official).length;
  const usedCount = plugins.filter((p) => p.used).length;
  // 「没用过」只该算**有工具却一次没调用**的；纯界面插件（toolCount 0）不参与，
  // 否则它们会被冤枉成吃灰，数字也会虚高。
  const idleCount = plugins.filter((p) => !p.used && p.toolCount > 0).length;
  const uiOnlyCount = plugins.filter((p) => p.toolCount === 0).length;
  const data = {
    ok: true,
    profile: { name: profileName, dir },
    total: plugins.length,
    thirdParty,
    usedCount,
    idleCount,
    uiOnlyCount,
    unusedCount: idleCount,
    plugins,
  };
  cache = { at: now, data };
  return data;
```

</details>

#### 缺口

- argv与当前宿主scope对应关系未运行核对
  **影响**：仍需人工确认报告profile
  **进一步探讨**：使用同名异根profile与环境变量冲突做对照

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为什么不能把报告称作当前已激活插件真相？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。bundle/dependency是配置声明，不读加载注册表或pending/failed状态。argv识别降低mtime误猜，但环境变量优先与兜底仍非运行权威；缺包时version回退声明也不证安装成功。hasTools由main/exports推断，toolCount又是正则扫JS注册候选，二者都非实际工具注册。扫描深度最多3层、单JS文件<=2MiB，跳dist/build与TypeScript，动态工具也可能漏；toolCount=0却被UI标“纯界面”，不能据此断定无工具。描述有人工优先、截断与市场请求/写盘，不能称纯作者原话或零联网零写入。路由回传profile.dir与元数据，未见本组件方法/来源权限校验，整体访问取决宿主webServer，不自行补称鉴权。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:275-307](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/lib/index.js#L275-L307)

正则扫描范围与跳过条件。

<details>
<summary>查看原文（33行）</summary>

```text
  const names = new Set();
  const scan = (d, depth) => {
    if (depth > 3) return;
    let ents;
    try {
      ents = readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of ents) {
      const p = join(d, e.name);
      if (e.isDirectory()) {
        if (!SKIP_DIRS.has(e.name) && !e.name.startsWith('.')) scan(p, depth + 1);
        continue;
      }
      if (!/\.(js|mjs|cjs)$/.test(e.name)) continue;
      let src;
      try {
        if (statSync(p).size > 2 * 1024 * 1024) continue;
        src = readFileSync(p, 'utf8');
      } catch {
        continue;
      }
      const re = /defineTool\s*\(\s*\{[\s\S]{0,500}?name:\s*['"`]([A-Za-z0-9_\-]+)['"`]/g;
      let m;
      while ((m = re.exec(src))) names.add(m[1]);
      const re2 = /\bname:\s*['"`]([A-Za-z0-9_\-]+)['"`][\s\S]{0,600}?(?:execute\s*\(|parameters\s*:)/g;
      while ((m = re2.exec(src))) names.add(m[1]);
    }
  };
  scan(dir, 0);
  return [...names];
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:349-407](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/lib/index.js#L349-L407)

候选工具、版本及纯界面推断。

<details>
<summary>查看原文（59行）</summary>

```text
    seen.add(id);
    if (id === NS) continue; // 自己不列自己

    const pluginDir = join(dir, 'node_modules', id);
    const nm = join(pluginDir, 'package.json');
    const modPkg = existsSync(nm) ? readJson(nm) : null;
    const toolNames = existsSync(pluginDir) ? collectToolNames(pluginDir) : [];
    let calls = 0;
    let ok = 0;
    let fail = 0;
    let lastAt = 0;
    for (const t of toolNames) {
      const r = usageTools[t];
      if (!r) continue;
      calls += r.calls || 0;
      ok += r.ok || 0;
      fail += r.fail || 0;
      if ((r.lastAt || 0) > lastAt) lastAt = r.lastAt;
    }
    const { title, desc } = humanize(modPkg, id);
    // 优先级：人写的一句话 > 市场登记表的中文（砍掉冒号后的细节） > 包自己的描述
    const marketRaw = typeof zhMap[id] === 'string' ? zhMap[id] : '';
    const marketZh = marketRaw ? clip(headPhrase(marketRaw) || marketRaw, 60) : '';
    const humanZh = typeof notes[id] === 'string' ? clip(notes[id], 120) : '';
    const finalDesc = humanZh || marketZh || desc;
    const descSource = humanZh ? 'human' : marketZh ? 'market' : desc ? 'package' : 'none';
    const declaredVersion = deps[id];
    plugins.push({
      id,
      title,
      version: (modPkg && modPkg.version) || (typeof declaredVersion === 'string' ? declaredVersion.replace(/^[~^]/, '') : ''),
      desc: finalDesc,
      descSource,
      toolCount: toolNames.length,
      calls,
      ok,
      fail,
      lastAt,
      used: calls > 0,
      official: isOfficial(id),
      hasClient: Boolean(modPkg && (modPkg.dsh?.client || modPkg.exports?.['./client'] || modPkg.exports?.client)),
      hasTools: Boolean(modPkg && (modPkg.main || modPkg.exports?.['.'])),
    });
  }

  plugins.sort((a, b) => {
    if (a.official !== b.official) return a.official ? -1 : 1;
    return a.id.localeCompare(b.id);
  });

  const thirdParty = plugins.filter((p) => !p.official).length;
  const usedCount = plugins.filter((p) => p.used).length;
  // 「没用过」只该算**有工具却一次没调用**的；纯界面插件（toolCount 0）不参与，
  // 否则它们会被冤枉成吃灰，数字也会虚高。
  const idleCount = plugins.filter((p) => !p.used && p.toolCount > 0).length;
  const uiOnlyCount = plugins.filter((p) => p.toolCount === 0).length;
  const data = {
    ok: true,
    profile: { name: profileName, dir },
```

</details>

**依据 3 · 源码核查**：[lib/index.js:456-490](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/lib/index.js#L456-L490)

报告路由返回范围。

<details>
<summary>查看原文（35行）</summary>

```text
  try {
    if (typeof ctx?.inject === 'function') {
      ctx.inject(['webServer'], (host) => {
        host.effect(() =>
          host.webServer.register(
            {
              kind: 'exact',
              path: `/${NS}/report`,
              handler: (req, res) => {
                let force = false;
                try {
                  force = new URL(req.url || '/', 'http://local').searchParams.get('force') === '1';
                } catch {
                  force = false;
                }
                let body;
                try {
                  body = JSON.stringify(scan(force));
                } catch (err) {
                  body = JSON.stringify({ ok: false, error: String(err && err.message ? err.message : err), plugins: [], total: 0, thirdParty: 0 });
                }
                res.writeHead(200, {
                  'content-type': 'application/json; charset=utf-8',
                  'cache-control': 'no-store',
                });
                res.end(body);
              },
            },
            `${NS}: report`,
          ),
        );
      });
    }
  } catch {
    /* 没有 webServer：面板缺失，宿主照常运行 */
```

</details>

#### 缺口

- 真实宿主路由鉴权未知
  **影响**：报告范围不能推成租户隔离
  **进一步探讨**：在宿主侧核访问控制及多profile隔离

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些用户可试，怎样避免误读？

**研究主题**：效果与总成本、采用判断

#### 完整回答

只把它当清单浏览辅助的用户可在明确设置profile并核对三项已知包后受控试用。首次核当前profile、bundle与实装路径和版本，再看descSource，最后才参考使用标签。持续scan会同步遍历包目录和小JS文件、读usage与描述缓存、可能取市场并写盘；统计全局事件不调用模型，但不能填零资源。大包数量/延迟未测。强制重扫清报告缓存并不能使usage未持久部分立即可见，也不刷新宿主加载状态。发现profile不符、缺包/候选工具误判或计数漏记时停止用标签做卸载/排障依据，改手查配置与宿主加载记录；禁用插件去掉overlay，但使用与市场缓存需按实际目录人工清理。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:326-350](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/lib/index.js#L326-L350)

重扫、usage读取与声明集合。

<details>
<summary>查看原文（25行）</summary>

```text

  const picked = pickProfile();
  if (!picked) {
    const empty = { ok: false, error: '找不到 profile（没有 ~/.dsh/profiles/*/package.json）', profile: null, plugins: [], total: 0, thirdParty: 0 };
    cache = { at: now, data: empty };
    return empty;
  }

  const { dir, pkg } = picked;
  const zhMap = loadZhMap();
  const notes = loadNotes();
  const usageTools = loadUsage().tools;
  const profileName = String(pkg.name || '').replace(/^dsh-profile-/, '') || 'unknown';
  const deps = pkg.dependencies && typeof pkg.dependencies === 'object' ? pkg.dependencies : {};
  const declared = Array.isArray(pkg.dsh?.profile?.bundles) ? pkg.dsh.profile.bundles : [];
  // bundles 是「实际加载」的名单；万一没有，退回到 dependencies 里所有插件
  const ids = declared.length ? declared : Object.keys(deps);

  const seen = new Set();
  const plugins = [];
  for (const rawId of ids) {
    const id = String(rawId);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    if (id === NS) continue; // 自己不列自己
```

</details>

**依据 2 · 源码核查**：[lib/index.js:232-271](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/lib/index.js#L232-L271)

延迟使用计数写盘。

<details>
<summary>查看原文（40行）</summary>

```text
  try {
    const j = JSON.parse(readFileSync(USAGE_PATH, 'utf8'));
    if (j && typeof j.tools === 'object' && j.tools) return j;
  } catch {
    /* 还没有统计 */
  }
  return { tools: {} };
}

let saveTimer = null;
let pendingUsage = null;

function persistUsageNow() {
  if (!pendingUsage) return;
  try {
    writeFileSync(USAGE_PATH, JSON.stringify(pendingUsage), 'utf8');
  } catch {
    /* 写不进去就算了 */
  }
}

function scheduleUsageSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    persistUsageNow();
  }, 1500);
  if (typeof saveTimer.unref === 'function') saveTimer.unref();
}

function bumpUsage(toolName, ok) {
  const u = loadUsage();
  const row = u.tools[toolName] || (u.tools[toolName] = { calls: 0, ok: 0, fail: 0, lastAt: 0 });
  row.calls += 1;
  if (ok) row.ok += 1;
  else row.fail += 1;
  row.lastAt = Date.now();
  pendingUsage = u;
  scheduleUsageSave();
}
```

</details>

**依据 3 · 源码核查**：[client.js:116-128](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/client.js#L116-L128)

报告请求入口。

<details>
<summary>查看原文（13行）</summary>

```text
      const [busy, setBusy] = useState(false);
      const [q, setQ] = useState('');

      const load = useCallback(async (force) => {
        setBusy(true);
        try {
          const r = await fetch(`/${NS}/report` + (force ? '?force=1' : ''), { credentials: 'same-origin' });
          const j = await r.json();
          if (j && j.ok) {
            setData(j);
            setErr('');
          } else {
            setErr((j && j.error) || 'failed');
```

</details>

#### 缺口

- 耗时、磁盘量与用户收益未知
  **影响**：不能按数量/计数排序决定清理
  **进一步探讨**：构造已知包与调用事件逐项对照并量同步扫描延迟

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 声明、安装和运行三层状态能否提升排障？

**研究主题**：新假设与验证

#### 完整回答

未实现方向是将声明、安装、运行、观察到调用四层分开，运行层必须向宿主Loader查询并显示时间/来源，工具名统计须绑定profile、session及实际插件注册身份。提供“未观察到调用”而非“没用/纯界面”，避免将缺事件、漏扫描、重启丢计数当价值结论。最小实验构造缺包、disabled、pending、TypeScript/dist动态工具、两包同名工具、跨profile和突发调用；与独立事件日志逐项比对，并做用户排障准确率/耗时对照。若运行状态过期、计数污染或UI增加误删，应否定改进价值；增加持久日志也可能反增隐私与磁盘成本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:275-307](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/lib/index.js#L275-L307)

当前扫描启发式作对照。

<details>
<summary>查看原文（33行）</summary>

```text
  const names = new Set();
  const scan = (d, depth) => {
    if (depth > 3) return;
    let ents;
    try {
      ents = readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of ents) {
      const p = join(d, e.name);
      if (e.isDirectory()) {
        if (!SKIP_DIRS.has(e.name) && !e.name.startsWith('.')) scan(p, depth + 1);
        continue;
      }
      if (!/\.(js|mjs|cjs)$/.test(e.name)) continue;
      let src;
      try {
        if (statSync(p).size > 2 * 1024 * 1024) continue;
        src = readFileSync(p, 'utf8');
      } catch {
        continue;
      }
      const re = /defineTool\s*\(\s*\{[\s\S]{0,500}?name:\s*['"`]([A-Za-z0-9_\-]+)['"`]/g;
      let m;
      while ((m = re.exec(src))) names.add(m[1]);
      const re2 = /\bname:\s*['"`]([A-Za-z0-9_\-]+)['"`][\s\S]{0,600}?(?:execute\s*\(|parameters\s*:)/g;
      while ((m = re2.exec(src))) names.add(m[1]);
    }
  };
  scan(dir, 0);
  return [...names];
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:419-452](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/lib/index.js#L419-L452)

全局事件与callId映射作隔离反例。

<details>
<summary>查看原文（34行）</summary>

```text

export function apply(ctx) {
  /* 统计「用过没有」：tool-call 的块里有工具名，tool/result 里只有 callId，
     所以先用 assistant/message 建 callId→name 映射，再在结果事件里记账。 */
  const callNames = new Map();
  try {
    if (typeof ctx?.on === 'function') {
      // { global: true } 是必须的：不传只能收到当前会话的事件，
      // 而这个统计要覆盖所有会话（DSH 自己的 dsh-tools 也是这么注册的）。
      ctx.on('session/event', (session, event) => {
        try {
          const t = event && event.type;
          if (t === 'assistant/message') {
            const blocks = event.data && event.data.message && event.data.message.content;
            if (Array.isArray(blocks)) {
              for (const b of blocks) {
                if (b && b.type === 'tool-call' && b.id && b.name) callNames.set(b.id, b.name);
              }
            }
          } else if (t === 'tool/result') {
            const m = event.data && event.data.message;
            const cid = m && m.source && m.source.callId;
            const nm = cid ? callNames.get(cid) : undefined;
            if (nm) {
              bumpUsage(nm, !m.isError);
              if (callNames.size > 800) callNames.clear();
            }
          }
        } catch {
          /* 统计失败不影响主流程 */
        }
      }, { global: true });
    }
  } catch {
```

</details>

#### 缺口

- 宿主权威运行接口与用户理解未证
  **影响**：假设不能计入当前创新
  **进一步探讨**：先定义身份与失效协议，再做可丢弃环境对照

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · “用过多少次”实际怎样归因、持久化，能否据此识别闲置插件？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

assistant/message提取tool-call的id/name放callNames；tool/result按source.callId找name，再以!isError记ok/fail。监听global覆盖会话，但映射只用callId、不含session且结果后不删除，超过800仅在已匹配结果时整体clear；缺assistant事件/重放/碰撞都可能漏记或错记，没有去重。统计按工具名写dshHome单一usage文件，不含profile或插件id；两个包同名工具会共享相同调用数，同一工具在不同profile调用也会混合。ok只代表消息isError为假，不证明业务成功。

bumpUsage每次重新loadUsage磁盘，增一后只替换pendingUsage，1.5秒延迟写；在首次落盘前连续两事件都从同一旧磁盘基数增加，因此后者覆盖前者，不能保证累计真实次数。unref定时器且无退出flush，进程退出可丢最后一批；write失败静默。scan只读已落盘usage并缓存60秒，面板会滞后。正则候选名汇总历史并非活跃注册映射，所以目前标签只能表示不完整观察信号，不能识别“无用插件”。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:232-271](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/lib/index.js#L232-L271)

每事件读磁盘及延迟写导致突发更新覆盖。

<details>
<summary>查看原文（40行）</summary>

```text
  try {
    const j = JSON.parse(readFileSync(USAGE_PATH, 'utf8'));
    if (j && typeof j.tools === 'object' && j.tools) return j;
  } catch {
    /* 还没有统计 */
  }
  return { tools: {} };
}

let saveTimer = null;
let pendingUsage = null;

function persistUsageNow() {
  if (!pendingUsage) return;
  try {
    writeFileSync(USAGE_PATH, JSON.stringify(pendingUsage), 'utf8');
  } catch {
    /* 写不进去就算了 */
  }
}

function scheduleUsageSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    persistUsageNow();
  }, 1500);
  if (typeof saveTimer.unref === 'function') saveTimer.unref();
}

function bumpUsage(toolName, ok) {
  const u = loadUsage();
  const row = u.tools[toolName] || (u.tools[toolName] = { calls: 0, ok: 0, fail: 0, lastAt: 0 });
  row.calls += 1;
  if (ok) row.ok += 1;
  else row.fail += 1;
  row.lastAt = Date.now();
  pendingUsage = u;
  scheduleUsageSave();
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:349-384](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/lib/index.js#L349-L384)

按正则工具名聚合usage。

<details>
<summary>查看原文（36行）</summary>

```text
    seen.add(id);
    if (id === NS) continue; // 自己不列自己

    const pluginDir = join(dir, 'node_modules', id);
    const nm = join(pluginDir, 'package.json');
    const modPkg = existsSync(nm) ? readJson(nm) : null;
    const toolNames = existsSync(pluginDir) ? collectToolNames(pluginDir) : [];
    let calls = 0;
    let ok = 0;
    let fail = 0;
    let lastAt = 0;
    for (const t of toolNames) {
      const r = usageTools[t];
      if (!r) continue;
      calls += r.calls || 0;
      ok += r.ok || 0;
      fail += r.fail || 0;
      if ((r.lastAt || 0) > lastAt) lastAt = r.lastAt;
    }
    const { title, desc } = humanize(modPkg, id);
    // 优先级：人写的一句话 > 市场登记表的中文（砍掉冒号后的细节） > 包自己的描述
    const marketRaw = typeof zhMap[id] === 'string' ? zhMap[id] : '';
    const marketZh = marketRaw ? clip(headPhrase(marketRaw) || marketRaw, 60) : '';
    const humanZh = typeof notes[id] === 'string' ? clip(notes[id], 120) : '';
    const finalDesc = humanZh || marketZh || desc;
    const descSource = humanZh ? 'human' : marketZh ? 'market' : desc ? 'package' : 'none';
    const declaredVersion = deps[id];
    plugins.push({
      id,
      title,
      version: (modPkg && modPkg.version) || (typeof declaredVersion === 'string' ? declaredVersion.replace(/^[~^]/, '') : ''),
      desc: finalDesc,
      descSource,
      toolCount: toolNames.length,
      calls,
      ok,
```

</details>

**依据 3 · 源码核查**：[lib/index.js:419-452](https://github.com/7gzgn/dsh-my-plugins/blob/4bf4175fa807bebc602bf92d9b6bdf58fb2e091e/lib/index.js#L419-L452)

全局事件映射、计数和清空条件。

<details>
<summary>查看原文（34行）</summary>

```text

export function apply(ctx) {
  /* 统计「用过没有」：tool-call 的块里有工具名，tool/result 里只有 callId，
     所以先用 assistant/message 建 callId→name 映射，再在结果事件里记账。 */
  const callNames = new Map();
  try {
    if (typeof ctx?.on === 'function') {
      // { global: true } 是必须的：不传只能收到当前会话的事件，
      // 而这个统计要覆盖所有会话（DSH 自己的 dsh-tools 也是这么注册的）。
      ctx.on('session/event', (session, event) => {
        try {
          const t = event && event.type;
          if (t === 'assistant/message') {
            const blocks = event.data && event.data.message && event.data.message.content;
            if (Array.isArray(blocks)) {
              for (const b of blocks) {
                if (b && b.type === 'tool-call' && b.id && b.name) callNames.set(b.id, b.name);
              }
            }
          } else if (t === 'tool/result') {
            const m = event.data && event.data.message;
            const cid = m && m.source && m.source.callId;
            const nm = cid ? callNames.get(cid) : undefined;
            if (nm) {
              bumpUsage(nm, !m.isError);
              if (callNames.size > 800) callNames.clear();
            }
          }
        } catch {
          /* 统计失败不影响主流程 */
        }
      }, { global: true });
    }
  } catch {
```

</details>

#### 缺口

- 事件字段与宿主实际生命周期未运行核实
  **影响**：不能将计数作为完整账本或卸载依据
  **进一步探讨**：对两同名工具和1.5秒内多结果注入独立对照日志

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
