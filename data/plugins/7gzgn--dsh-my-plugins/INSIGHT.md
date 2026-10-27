# dsh-my-plugins

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[a6ac5e7](https://github.com/7gzgn/dsh-my-plugins/tree/a6ac5e79e9f246c322060163bc794dba9648bff4)

<!-- BEGIN META -->
[![npm 30d 519](https://img.shields.io/static/v1?label=npm+30d&message=519&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-my-plugins) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-my-plugins)
<!-- END META -->

> **实现功能**：在顶栏提供可搜索插件清单，显示所选 profile 的包名、版本、说明和分类。

> **核心亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把散落的profile声明、实装版本和说明变成可搜索入口，适合日常辨认包。该增量是信息组织便利，未建立运行时激活或能力正确性的观测链。

> **风险与缺陷**：[Q03](#research-q03) 发现清单来自声明/依赖而不是运行注册表，profile还能按mtime猜选；README的无请求、仅作者描述与市场fetch/缓存写、notes优先不一致。读者应知道当前真边界，避免以数量排障。

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
|---|---|---|
| profile清单 | 看bundle或依赖声明 | 非运行激活注册表 |
| 版本和描述汇总 | 辨认包作用 | 实装缺失会回退，notes优先 |
| 搜索面板 | 找包名、名称或说明 | Web/Desktop slots |
| 强制重扫 | 更新本地包清单 | 市场map另有6小时缓存 |
| 中文登记表缓存 | 增强说明可读性 | 真实HTTP读取与本地写，非纯无请求 |

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
|---|---|---|
| 指定 | 用户确认DSH_PROFILE | 面板profile名称一致 |
| 加载 | 宿主注册report和overlay | 能读清单 |
| 核对 | 用户搜索已知包、强刷 | 实装与声明区别清楚 |
| 排障 | 用户另查Loader运行状态 | 不以面板数量证明激活 |

#### 成本
| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主资源，金额未知 | 确认profile和已知插件 | 安装耗时未知 |
| 持续使用 | 同步文件读、市场HTTP和缓存磁盘 | 辨认描述来源和缺失包 | 大清单延迟未测 |
| 失败恢复 | 重扫和缓存重建 | 查profile误选、缺包或市场失败 | 无模型调用不等于零代价 |

#### 效果
| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 浏览与搜索 | overlay和字符串筛选 | 真实节时和大量插件性能 |
| 版本显示 | 包版本优先、声明fallback | 是否真正加载成功 |
| 描述可读 | notes/market/package优先 | 文案是否与实际能力一致 |

> **思考**：[Q03](#research-q03) 发现清单来自声明/依赖而不是运行注册表，profile还能按mtime猜选；README的无请求、仅作者描述与市场fetch/缓存写、notes优先不一致。读者应知道当前真边界，避免以数量排障。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持把散落的profile声明、实装版本和说明变成可搜索入口，适合日常辨认包。该增量是信息组织便利，未建立运行时激活或能力正确性的观测链。

[Q01](#research-q01) 与 [Q02](#research-q02) 支持把散落的profile声明、实装版本和说明变成可搜索入口，适合日常辨认包。该增量是信息组织便利，未建立运行时激活或能力正确性的观测链。

scan与客户端分离便于复用，包不可读时降级不会让整份清单失败。代价是宽松fallback隐藏不确定性；profile选择、hasTools和版本应显式标启发式，市场缓存需要同步文档。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 发现清单来自声明/依赖而不是运行注册表，profile还能按mtime猜选；README的无请求、仅作者描述与市场fetch/缓存写、notes优先不一致。读者应知道当前真边界，避免以数量排障。

<a id="detail-section-6"></a>

### 1.5 使用建议

明确设置DSH_PROFILE并仅把它当包清单阅读辅助的人可受控试用。首次检查profile名称、声明bundle和实装版本一致，再搜索一个已知插件并强刷；持续有同步文件读取、面板渲染、市场HTTP与缓存写，未调用模型但不能标零成本。包缺失、市场不可用可降级描述，人工需核对未知而不是信任数量。成功是清单逐项对应所选profile，描述来源不误认作者，禁用后overlay移除；若误选profile或把声明版本/启发式入口当运行状态，应停止依赖这些字段排障。真实节时和大规模插件延迟无数据。 [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

profile包清单与overlay可核查；运行激活未采集，文档的不联网和作者原话保证与实现不符；三层状态为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、client.js、notes.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定README、Host扫描与路由、client overlay、package和notes；不执行插件或读取用户真实profile。
- 下一步：- 已检查固定源码和作者材料。
- 未运行插件、目标测试、浏览器或真实profile扫描。
- 已明确文档与市场缓存实现差异，运行状态未采集。

**分析版本**

- **仓库**：[7gzgn/dsh-my-plugins](https://github.com/7gzgn/dsh-my-plugins)
- **版本号**：0.1.1（[固定提交 a6ac5e7](https://github.com/7gzgn/dsh-my-plugins/tree/a6ac5e79e9f246c322060163bc794dba9648bff4)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出声明/安装/运行三层状态与说明来源标记，未验证；以缺包、pending和多profile任务测排障准确率，运行状态过期或理解负担上升会削弱收益。

- 已检查固定源码和作者材料。
- 未运行插件、目标测试、浏览器或真实profile扫描。
- 已明确文档与市场缓存实现差异，运行状态未采集。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 510 | 344 | 133 | — |
| .md | source | 1 | 55 | — | — | 518 |
| .mjs | test | 2 | 69 | 49 | 8 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/7gzgn/dsh-my-plugins/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/7gzgn/dsh-my-plugins/issues?q=is%3Aissue+created%3A2026-09-24T05%3A55%3A33.013Z..2026-10-24T05%3A55%3A33.013Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/7gzgn/dsh-my-plugins/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-24T05%3A55%3A33.013Z..2026-10-24T05%3A55%3A33.013Z)



统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：插件清单能否如实解释当前profile的安装与加载并减少手工辨认负担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件清单解决什么重复问题？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向装了许多DSH插件、想记清包名、版本和作用的Web或Desktop用户。合格结果是能在当前profile下找到目标包并解释元数据来自哪里，不能把列表存在当激活和可靠性证明。原来可手读profile/package.json和node_modules，此项把信息汇入可搜索面板，并显示官方前缀分类和数量。贡献是方便浏览与统一呈现，不是新插件发现或运行监控算法；数量本身不证明每项能力已在宿主可用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-23](https://github.com/7gzgn/dsh-my-plugins/blob/a6ac5e79e9f246c322060163bc794dba9648bff4/README.md#L10-L23)

作者目标是回答装了什么及元数据来源。

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

**依据 2 · 源码核查**：[client.js:183-203](https://github.com/7gzgn/dsh-my-plugins/blob/a6ac5e79e9f246c322060163bc794dba9648bff4/client.js#L183-L203)

面板搜索、重扫和profile标识。

<details>
<summary>查看原文（21行）</summary>

```text
      const panel = h(
        'div',
        { style: css.panel },
        h(
          'div',
          { style: css.head },
          h('div', { style: { flex: '0 0 auto' } }, data ? `${data.total} 个 · 第三方 ${data.thirdParty}` : '读取中…'),
          h('input', {
            style: css.input,
            value: q,
            placeholder: '搜包名 / 名字 / 描述',
            onChange: (e) => setQ(e.target.value),
          }),
          h('button', { style: css.btn, onClick: () => load(true), disabled: busy }, busy ? '刷新中' : '重扫'),
          h('button', { style: css.btn, onClick: () => setOpen(false) }, '收起'),
        ),
        err ? h('div', { style: { color: '#e06a6a' } }, '出错：' + err) : null,
        data && data.profile
          ? h('div', { style: { color: '#6f7480', fontSize: 11, marginBottom: 4 } }, `配置：${data.profile.name}`)
          : null,
        rows.length ? rows : h('div', { style: { color: '#9a9aa8', padding: '8px 0' } }, data ? '没有匹配的插件' : '还没有数据，点「重扫」'),
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · profile、版本和描述怎样形成报告？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Host从DSH_PROFILE_DIR和dshHome/profiles枚举候选，DSH_PROFILE命中优先，否则选package.json修改时间最新者。scan优先dsh.profile.bundles，非空才用作清单，否则退到所有dependencies；从各node_modules/package.json取实际版本，缺失则回退声明版本。描述优先notes.json人工短句，其次市场中文缓存，最后包描述，descSource保留来源。报告缓存60秒，GET可force；市场缓存6小时，DSH_WEB_URL存在时异步fetch市场registry并写入本地缓存。客户端插入shell.overlay，按包名/名字/描述筛选。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:56-82](https://github.com/7gzgn/dsh-my-plugins/blob/a6ac5e79e9f246c322060163bc794dba9648bff4/lib/index.js#L56-L82)

profile缺明确标识时按mtime猜选。

<details>
<summary>查看原文（27行）</summary>

```text
/** 选当前 profile：DSH_PROFILE 命中优先，否则取 package.json 最新修改的那个。 */
function pickProfile() {
  const dirs = profileCandidates();
  if (!dirs.length) return null;
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
  let best = null;
  for (const d of dirs) {
    const pkg = readJson(join(d, 'package.json'));
    if (!pkg) continue;
    let mtime = 0;
    try {
      mtime = statSync(join(d, 'package.json')).mtimeMs;
    } catch {
      /* ignore */
    }
    if (!best || mtime > best.mtime) best = { dir: d, pkg, mtime };
  }
  return best ? { dir: best.dir, pkg: best.pkg } : null;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:181-215](https://github.com/7gzgn/dsh-my-plugins/blob/a6ac5e79e9f246c322060163bc794dba9648bff4/lib/index.js#L181-L215)

清单、版本与描述三种来源。

<details>
<summary>查看原文（35行）</summary>

```text
  const { dir, pkg } = picked;
  const zhMap = loadZhMap();
  const notes = loadNotes();
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

    const nm = join(dir, 'node_modules', id, 'package.json');
    const modPkg = existsSync(nm) ? readJson(nm) : null;
    const { title, desc } = humanize(modPkg, id);
    // 优先级：人写的一句话 > 市场登记表的中文 > 包自己的描述
    const marketZh = typeof zhMap[id] === 'string' ? clip(zhMap[id]) : '';
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
      official: isOfficial(id),
      hasClient: Boolean(modPkg && (modPkg.dsh?.client || modPkg.exports?.['./client'] || modPkg.exports?.client)),
      hasTools: Boolean(modPkg && (modPkg.main || modPkg.exports?.['.'])),
```

</details>

**依据 3 · 源码核查**：[lib/index.js:112-147](https://github.com/7gzgn/dsh-my-plugins/blob/a6ac5e79e9f246c322060163bc794dba9648bff4/lib/index.js#L112-L147)

市场请求与本地写缓存。

<details>
<summary>查看原文（36行）</summary>

```text
function loadZhMap() {
  try {
    const c = JSON.parse(readFileSync(REGISTRY_CACHE, 'utf8'));
    if (c && c.map && typeof c.at === 'number') {
      if (Date.now() - c.at > REGISTRY_TTL) refreshZhMap();
      return c.map;
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
      if (p?.name && typeof zh === 'string' && zh.trim()) map[p.name] = zh.trim();
    }
    writeFileSync(REGISTRY_CACHE, JSON.stringify({ at: Date.now(), map }), 'utf8');
    cache.at = 0; // 下次请求重新扫描，这次就能拿到中文
  } catch {
    /* 拿不到登记表就退回包自己的描述，不影响使用 */
  } finally {
    refreshing = false;
```

</details>

**依据 4 · 源码核查**：[client.js:222-233](https://github.com/7gzgn/dsh-my-plugins/blob/a6ac5e79e9f246c322060163bc794dba9648bff4/client.js#L222-L233)

真实UI插槽注册。

<details>
<summary>查看原文（12行）</summary>

```text
    return {
      name: NS,
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            { name: 'shell.overlay', id: NS, order: 896 },
            function MyPluginsSlot() {
              return h(Guard, null, h(MyPlugins));
            },
          ),
        );
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为什么不能把报告称作当前已激活插件真相？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

bundles只是profile声明，不读取运行注册表、加载错误或pending服务状态；dependencies回退还可能包含没有装载的依赖。未明确环境变量时按mtime选profile可能选到另一配置。version在包缺失时显示声明版本去掉^/~，无法区分实际安装成功与期望范围。README称不联网且只显示作者原话，但当前代码会fetch宿主市场并写缓存，还以notes人工说明优先，因此文档边界与实现不符。hasTools按main/exports判断只可视作入口候选，不能等于模型工具存在。只读profile成立，纯无写入无请求不成立。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:56-82](https://github.com/7gzgn/dsh-my-plugins/blob/a6ac5e79e9f246c322060163bc794dba9648bff4/lib/index.js#L56-L82)

mtime不是宿主当前scope。

<details>
<summary>查看原文（27行）</summary>

```text
/** 选当前 profile：DSH_PROFILE 命中优先，否则取 package.json 最新修改的那个。 */
function pickProfile() {
  const dirs = profileCandidates();
  if (!dirs.length) return null;
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
  let best = null;
  for (const d of dirs) {
    const pkg = readJson(join(d, 'package.json'));
    if (!pkg) continue;
    let mtime = 0;
    try {
      mtime = statSync(join(d, 'package.json')).mtimeMs;
    } catch {
      /* ignore */
    }
    if (!best || mtime > best.mtime) best = { dir: d, pkg, mtime };
  }
  return best ? { dir: best.dir, pkg: best.pkg } : null;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:185-215](https://github.com/7gzgn/dsh-my-plugins/blob/a6ac5e79e9f246c322060163bc794dba9648bff4/lib/index.js#L185-L215)

声明集合、版本fallback和hasTools启发式。

<details>
<summary>查看原文（31行）</summary>

```text
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

    const nm = join(dir, 'node_modules', id, 'package.json');
    const modPkg = existsSync(nm) ? readJson(nm) : null;
    const { title, desc } = humanize(modPkg, id);
    // 优先级：人写的一句话 > 市场登记表的中文 > 包自己的描述
    const marketZh = typeof zhMap[id] === 'string' ? clip(zhMap[id]) : '';
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
      official: isOfficial(id),
      hasClient: Boolean(modPkg && (modPkg.dsh?.client || modPkg.exports?.['./client'] || modPkg.exports?.client)),
      hasTools: Boolean(modPkg && (modPkg.main || modPkg.exports?.['.'])),
```

</details>

**依据 3 · 源码核查**：[lib/index.js:126-143](https://github.com/7gzgn/dsh-my-plugins/blob/a6ac5e79e9f246c322060163bc794dba9648bff4/lib/index.js#L126-L143)

真实HTTP读取和本地写。

<details>
<summary>查看原文（18行）</summary>

```text
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
      if (p?.name && typeof zh === 'string' && zh.trim()) map[p.name] = zh.trim();
    }
    writeFileSync(REGISTRY_CACHE, JSON.stringify({ at: Date.now(), map }), 'utf8');
    cache.at = 0; // 下次请求重新扫描，这次就能拿到中文
```

</details>

**依据 4 · 作者声明**：[README.md:41-50](https://github.com/7gzgn/dsh-my-plugins/blob/a6ac5e79e9f246c322060163bc794dba9648bff4/README.md#L41-L50)

文档给出的不联网及加载列表保证与实现对照。

<details>
<summary>查看原文（10行）</summary>

```text
## 边界

- **只读**：不改 profile、不动插件文件、不联网
- 一个无参 GET 接口 `/dsh-my-plugins/report`，60 秒缓存，`?force=1` 强刷
- 读不到某个包的 `package.json` 时留空，不报错、不影响其他行

## 已知的限制

- 只在 **web / desktop 界面**有这个药丸；纯 CLI profile 看不到（但接口在）
- 显示的是"被加载的插件"，不含 DSH 内置的宿主能力
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些用户可试，怎样避免误读？

**研究主题**：效果与总成本、采用判断

#### 完整回答

明确设置DSH_PROFILE并仅把它当包清单阅读辅助的人可受控试用。首次检查profile名称、声明bundle和实装版本一致，再搜索一个已知插件并强刷；持续有同步文件读取、面板渲染、市场HTTP与缓存写，未调用模型但不能标零成本。包缺失、市场不可用可降级描述，人工需核对未知而不是信任数量。成功是清单逐项对应所选profile，描述来源不误认作者，禁用后overlay移除；若误选profile或把声明版本/启发式入口当运行状态，应停止依赖这些字段排障。真实节时和大规模插件延迟无数据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:170-188](https://github.com/7gzgn/dsh-my-plugins/blob/a6ac5e79e9f246c322060163bc794dba9648bff4/lib/index.js#L170-L188)

缓存及清单回退。

<details>
<summary>查看原文（19行）</summary>

```text
export function scan(force) {
  const now = Date.now();
  if (!force && cache.data && now - cache.at < CACHE_MS) return cache.data;

  const picked = pickProfile();
  if (!picked) {
    const empty = { ok: false, error: '找不到 profile（没有 ~/.dsh/profiles/*/package.json）', profile: null, plugins: [], total: 0, thirdParty: 0 };
    cache = { at: now, data: empty };
    return empty;
  }

  const { dir, pkg } = picked;
  const zhMap = loadZhMap();
  const notes = loadNotes();
  const profileName = String(pkg.name || '').replace(/^dsh-profile-/, '') || 'unknown';
  const deps = pkg.dependencies && typeof pkg.dependencies === 'object' ? pkg.dependencies : {};
  const declared = Array.isArray(pkg.dsh?.profile?.bundles) ? pkg.dsh.profile.bundles : [];
  // bundles 是「实际加载」的名单；万一没有，退回到 dependencies 里所有插件
  const ids = declared.length ? declared : Object.keys(deps);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:198-215](https://github.com/7gzgn/dsh-my-plugins/blob/a6ac5e79e9f246c322060163bc794dba9648bff4/lib/index.js#L198-L215)

缺包时仍可产生元数据项。

<details>
<summary>查看原文（18行）</summary>

```text
    const nm = join(dir, 'node_modules', id, 'package.json');
    const modPkg = existsSync(nm) ? readJson(nm) : null;
    const { title, desc } = humanize(modPkg, id);
    // 优先级：人写的一句话 > 市场登记表的中文 > 包自己的描述
    const marketZh = typeof zhMap[id] === 'string' ? clip(zhMap[id]) : '';
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
      official: isOfficial(id),
      hasClient: Boolean(modPkg && (modPkg.dsh?.client || modPkg.exports?.['./client'] || modPkg.exports?.client)),
      hasTools: Boolean(modPkg && (modPkg.main || modPkg.exports?.['.'])),
```

</details>

**依据 3 · 源码核查**：[client.js:116-125](https://github.com/7gzgn/dsh-my-plugins/blob/a6ac5e79e9f246c322060163bc794dba9648bff4/client.js#L116-L125)

浏览器调用report处理结果。

<details>
<summary>查看原文（10行）</summary>

```text
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

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 声明、安装和运行三层状态能否提升排障？

**研究主题**：新假设与验证

#### 完整回答

现实现已读取profile声明与实装包，却把两者压成单个version和total。未验证方向是分列declared、installed和runtime activation，运行层从宿主Loader查询并显示pending/failed原因；描述显示notes/market/package来源，profile由宿主scope给出而不猜mtime。增量在让缺包、未加载和服务缺依赖有不同动作，代价是增加宿主版本耦合和状态UI。最小实验设置缺包、disabled、服务pending和另一个最近修改profile，比较用户定位故障的准确率与耗时；若运行状态过期或更难理解，便不支持该改造。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:185-215](https://github.com/7gzgn/dsh-my-plugins/blob/a6ac5e79e9f246c322060163bc794dba9648bff4/lib/index.js#L185-L215)

声明与包数据已有但未分状态。

<details>
<summary>查看原文（31行）</summary>

```text
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

    const nm = join(dir, 'node_modules', id, 'package.json');
    const modPkg = existsSync(nm) ? readJson(nm) : null;
    const { title, desc } = humanize(modPkg, id);
    // 优先级：人写的一句话 > 市场登记表的中文 > 包自己的描述
    const marketZh = typeof zhMap[id] === 'string' ? clip(zhMap[id]) : '';
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
      official: isOfficial(id),
      hasClient: Boolean(modPkg && (modPkg.dsh?.client || modPkg.exports?.['./client'] || modPkg.exports?.client)),
      hasTools: Boolean(modPkg && (modPkg.main || modPkg.exports?.['.'])),
```

</details>

**依据 2 · 源码核查**：[lib/index.js:56-82](https://github.com/7gzgn/dsh-my-plugins/blob/a6ac5e79e9f246c322060163bc794dba9648bff4/lib/index.js#L56-L82)

profile猜选是可替换边界。

<details>
<summary>查看原文（27行）</summary>

```text
/** 选当前 profile：DSH_PROFILE 命中优先，否则取 package.json 最新修改的那个。 */
function pickProfile() {
  const dirs = profileCandidates();
  if (!dirs.length) return null;
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
  let best = null;
  for (const d of dirs) {
    const pkg = readJson(join(d, 'package.json'));
    if (!pkg) continue;
    let mtime = 0;
    try {
      mtime = statSync(join(d, 'package.json')).mtimeMs;
    } catch {
      /* ignore */
    }
    if (!best || mtime > best.mtime) best = { dir: d, pkg, mtime };
  }
  return best ? { dir: best.dir, pkg: best.pkg } : null;
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
