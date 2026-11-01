# DSH Plugin Radar

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[c200222](https://github.com/AdamPlatin123/dsh-plugin-radar/tree/c200222795370ed18ab607115edc090535ddcbd8)

<!-- BEGIN META -->
[![GitHub ★ 1,488](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C488&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AdamPlatin123/dsh-plugin-radar)
<!-- END META -->

> **功能**：收集 DSH 插件候选，归并兼容性记录并发布可浏览目录与机器可读数据。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把历史快照和登记候选合并为统一目录，便于发现和接入；这不证明逐条状态当前正确。

> **主要限制**：[Q03](#research-q03) 公开状态缺逐条 commit、宿主环境和日志，私有测试生产者不可审计；历史 ok 不能当当前兼容或安全证明。

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
  - [Q01 · 目录服务为谁完成什么，与人工查上游相比增量是什么？](#detail-section-11)
  - [Q02 · 多来源候选如何归并并生成发布数据？](#detail-section-12)
  - [Q03 · 测试状态可以当作当前可安装兼容性证明吗？](#detail-section-13)
  - [Q04 · 运行聚合或使用目录需要什么，失败和成本由谁承担？](#detail-section-14)
  - [Q05 · 怎样可增量提升逐条兼容性证据可追溯性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：插件使用者需要发现候选，市场或社区维护者需要可处理的目录与状态。

人工查上游仓库和自行记录目录，也能发现候选但需自行维护合并口径。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 快照聚合 | 合并历史和社区登记 | 损坏快照会跳过 |
| 仓库归并 | 统一来源身份、冲突降待定 | 未定位项保留原始键 |
| 目录导出 | 为站点和工具提供数据 | 状态不等于当前兼容或安全 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| 输入快照、基线及仓库身份 | 聚合需要 | 合并与定位候选 | 缺失或损坏可能使结果不完整 |
| Python、文件系统 | 运行公开聚合需要 | 生成规范记录 | 生成失败或不可运行 |
| 私有验证器和快照生产者 | 生产运行判定需要 | 生成兼容性记录 | 公共仓库不能独立复现该阶段 |
| 上游源码与测试环境 | 采用插件前需要 | 核对版本与权限 | 不能把历史状态当现行证明 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 使用者固定同一数据提交及生成时间 | 两份输出不是同轮则停止对账 |
| 发现 | 查询目录获得候选 | 将状态视为线索，不作为安装许可 |
| 核验 | 回原仓核对版本、权限与卸载 | 缺逐条证据则保持未知 |
| 故障 | 检查数据日期、上游与私有管线状态 | 无可靠数据时退回人工查找 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 下载、集成资源未知 | 对齐提交和数据格式 | 历史状态不能直接安装 |
| 持续 | 刷新与存储成本未知 | 核对每个候选的来源与版本 | 更新延迟及覆盖未知 |
| 恢复 | 网络与重建成本未知 | 排查丢失输入及私有组件 | 完整重现需要测试生产者 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 聚合 | 规则化身份、冲突与未测兜底 | 全来源覆盖和正确率 |
| 输出 | canonical 驱动渲染与导出 | 固定数据实际一致性 |
| 状态 | 可作历史筛选线索 | 当前兼容、安全或真实运行 |

> **思考**：[Q03](#research-q03) 公开状态缺逐条 commit、宿主环境和日志，私有测试生产者不可审计；历史 ok 不能当当前兼容或安全证明。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把历史快照和登记候选合并为统一目录，便于发现和接入；这不证明逐条状态当前正确。

[Q02](#research-q02) 的分层归并与最终统计便于对账，但损坏快照跳过与 [Q03](#research-q03) 的私有生产者阻碍独立复现。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 公开状态缺逐条 commit、宿主环境和日志，私有测试生产者不可审计；历史 ok 不能当当前兼容或安全证明。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先按固定提交读取少量候选，再回原仓核对版本和权限；数据日期或逐条证据不明时停止自动安装并人工查找。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交公开聚合源码和数据契约已查；私有验证器、实际数据及运行效果未验证。

- 已检查：作者 README、包清单、源码路径 README.md、engine/aggregation/build_canonical.py、engine/rendering/render_all.py、docs/api.md、engine/README.md、engine/ops/private/MANIFEST.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交 README、公开聚合源码、渲染器、API 文档及私有组件契约；不审阅 data 目录，不运行目标和测试，不核定生态数量或私有验证器。
- 下一步：固定输入模拟改名、损坏快照和冲突，检查最终记录与统计；按照 [Q05](#research-q05) 评估逐条证据对误判和核验时间的影响。

**分析版本**

- **仓库**：[AdamPlatin123/dsh-plugin-radar](https://github.com/AdamPlatin123/dsh-plugin-radar)
- **版本号**：未声明（[固定提交 c200222](https://github.com/AdamPlatin123/dsh-plugin-radar/tree/c200222795370ed18ab607115edc090535ddcbd8)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设生产者提供逐条版本、环境与可核验日志元组可减少误分类；依赖私有生产者配合，尚未实现或验证。

固定输入模拟改名、损坏快照和冲突，检查最终记录与统计；按照 [Q05](#research-q05) 评估逐条证据对误判和核验时间的影响。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 51 | 29850 | — | — | 556343 |
| .mjs | source | 1 | 102 | 84 | 16 | — |
| .ts | source | 10 | 377 | 328 | 18 | — |
| .mjs | test | 2 | 92 | 83 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/AdamPlatin123/dsh-plugin-radar/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=8&color=737b86&logo=github)](https://github.com/AdamPlatin123/dsh-plugin-radar/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/AdamPlatin123/dsh-plugin-radar/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查插件目录聚合、公开状态、证据与使用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目录服务为谁完成什么，与人工查上游相比增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:9-25 描述为插件使用者和市场维护者提供发现、筛选与机器可读目录；人工逐仓搜索和记录是基线。公开聚合器把多轮材料整理为可复用记录，消费者可按同一格式初筛并回到上游核对，属于静态数据服务和聚合基础设施，不是加载到 DSH 的运行时插件。README 所列数量和人工策展是作者对某快照的陈述，不代表本次独立核验数量、独立用户需求或现在可安装插件数量；真实节时和召回率未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-25](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/README.md#L9-L25)

作者描述读者、目录和接入。

<details>
<summary>查看原文（17行）</summary>

```text
**发现 DSH 插件，查看兼容性记录，把生态数据接入你的工具。**

*Discover DeepSeek Harness plugins, explore compatibility records, and integrate ecosystem data into your tools.*

DSH Plugin Radar 持续收集插件候选、归并兼容性记录，并发布可浏览的目录与机器可读数据。你可以用它寻找插件，也可以把相同数据接入自己的市场、工具或社区清单。

**[浏览插件](https://adamplatin123.github.io/dsh-plugin-radar/)** · **[接入数据](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/main/docs/api.md)** · **[登记插件](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/main/PLUGINS.md)**

## 选择你的入口

| 你想做什么 | 从哪里开始 |
|---|---|
| 找到合适的插件 | [雷达站点](https://adamplatin123.github.io/dsh-plugin-radar/)提供浏览、筛选、精选与整合包入口 |
| 查看精选与整合包 | [精选与整合包目录](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/main/docs/catalog-highlights.md)，成员由人工策展 |
| 在 GitHub 阅读完整记录 | [完整目录](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/main/PLUGINS-ALL.md)与[分类目录](https://github.com/AdamPlatin123/dsh-plugin-radar/tree/main/catalog/all) |
| 将兼容性记录接入自己的工具 | [数据接口与口径](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/main/docs/api.md) |
| 提交插件或更正记录 | [社区登记表](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/main/PLUGINS.md)与[问题反馈](https://github.com/AdamPlatin123/dsh-plugin-radar/issues) |
```

</details>

**依据 2 · 源码核查**：[engine/aggregation/build_canonical.py:395-410](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/engine/aggregation/build_canonical.py#L395-L410)

规范化输出字段及去重。

<details>
<summary>查看原文（16行）</summary>

```text
            if e.get('locate') != 'located':
                continue
            desc = (e.get('desc') or '—').strip()
            if desc.startswith('http'):
                desc = '—'
            pr = ' 〔PR〕' if e['name'] in pr_names else ''
            bundle = '〔📦〕' if e.get('bundle') else ''
            export_rows.append({
                'repo': e['url'].split('github.com/')[1],
                'name': e['name'],
                'verdict': EXPORT_VERDICT.get(e.get('verdict'), 'untested'),
                'stars': e.get('star') if isinstance(e.get('star'), int) else None,
                'desc': f'{desc}{pr}{bundle}',
            })
    # 出口再验证归一身份；与站点和历史 Markdown 导出共享同仓标签/星数/判定归并规则。
    export_rows = dedupe_public_rows(export_rows, identities)
```

</details>

**依据 3 · 作者声明**：[README.md:32-42](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/README.md#L32-L42)

作者固定历史快照统计及限制。

<details>
<summary>查看原文（11行）</summary>

```text
快照：`20261016T063437Z` · 快照时间：2026-10-16 14:34:38 UTC+8。此摘要由已合并快照对应的聚合结果自动生成。

| 已定位、按仓库去重后的清单 | 条数 |
|---|---:|
| 全量记录 | 9,105 |
| 可用记录 | 5,751 |
| 不兼容记录 | 2,051 |
| 待定记录 | 961 |
| 未测记录 | 342 |

四档合计等于全量清单条数。仓库消亡、定位歧义等监测计数在清单之外，见[数据状态接口](https://raw.githubusercontent.com/AdamPlatin123/dsh-plugin-radar/main/data/latest.json)。逐条测试版本证据尚未完整公开。
```

</details>

#### 缺口

- 没有独立的完整来源普查与发现效率对照
  **影响**：不能推断覆盖率、使用量或节时
  **进一步探讨**：固定同一来源和时间窗，对比人工查找与接口候选。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 多来源候选如何归并并生成发布数据？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

build_canonical.py:69-105 新到旧读取快照、按 name/url 首次出现保留，缺损文件被跳过，历史基线补底；108-125 先从真实 URL 再映射或定位结果推导仓库身份，均无则保留原始键。133-157 的合并在互相冲突的确定判定间降为待定；280-302 将登记但未命中的仓库补为未测。395-415 对已定位条目映射字段、再次按仓去重并从最终行计算四档统计；render_all.py:41-53 消费 canonical。仓库级聚合能使输出口径更统一，但损坏文件跳过和聚合冲突规则都不证明测试运行或输出完整。

#### 证据与依据

**依据 1 · 源码核查**：[engine/aggregation/build_canonical.py:69-105](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/engine/aggregation/build_canonical.py#L69-L105)

快照读取、跳过错误与基线补底。

<details>
<summary>查看原文（37行）</summary>

```text
def _merge_snapshot_files(files, merged, rounds):
    """files 须为新→旧序；(name,url) 同键以最新轮覆盖（setdefault），返回读取的文件数。"""
    n = 0
    for fp in files:
        try:
            d = json.loads(Path(fp).read_text())
        except (json.JSONDecodeError, UnicodeDecodeError, OSError):
            continue   # 单文件截断/损坏跳过（镜像仓实测案例），不阻断清单生成
        if not str(d.get('schema', '')).startswith('radar-snapshot/'):
            continue
        n += 1
        rounds.append((d['run_id'], d.get('generated_at', '')))
        for e in d.get('catalog_entries') or []:
            merged.setdefault((e['name'], e.get('url', '')), dict(e))
    return n


def load_entries():
    """全部数据装载：现存快照全扫（新→旧）⊕ 基线补被裁历史。

    裁剪（rebaseline --prune）把 IO 边界交给磁盘：窗口外文件删除、其信息并入
    data/snapshot-baseline.json；本函数读现存全部文件 + 基线条目垫底（setdefault，
    现存总是更新）、基线轮次去重后续接（基线轮次恒旧于现存滞留文件）。
    无基线文件时退化为旧 load_snapshots() 全量行为（逐字节一致）。

    返回 (合并条目列表[保持旧管线遭遇序], [轮次(run_id, generated_at)], 读取文件数)。
    """
    files = sorted(glob.glob(str(SNAP_DIR / '*.json')), reverse=True)
    merged, rounds = {}, []
    n = _merge_snapshot_files(files, merged, rounds)
    if BASELINE.is_file():
        base = _read_json_safe(BASELINE, {}) or {}
        seen_rids = {rid for rid, _ in rounds}
        rounds += [tuple(r) for r in base.get('rounds', []) if r[0] not in seen_rids]
        for e in base.get('entries', []):
            merged.setdefault((e['name'], e.get('url', '')), dict(e))
    return list(merged.values()), rounds, n
```

</details>

**依据 2 · 源码核查**：[engine/aggregation/build_canonical.py:108-125](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/engine/aggregation/build_canonical.py#L108-L125)

规范身份优先顺序。

<details>
<summary>查看原文（18行）</summary>

```text
def canonical_key(e, repo_map, locate, identities=None):
    """条目 → 规范主键。真实 URL > repo-map local_key > locate-cache；均无则退回原始键。"""
    url = e.get('url') or ''
    if 'search?q=' not in url:
        m = REAL_URL_RE.search(url)
        if m:
            full = f"{m.group(1)}/{m.group(2)}"
            return ('repo', (identities.resolve(full) if identities else full).lower())
    name = e['name']
    r = repo_map.get(name)
    if r and r.get('full_name'):
        full = r['full_name']
        return ('repo', (identities.resolve(full) if identities else full).lower())
    lc = locate.get(name) or {}
    if lc.get('status') == 'found' and lc.get('full_name'):
        full = lc['full_name']
        return ('repo', (identities.resolve(full) if identities else full).lower())
    return ('raw', name.lower(), url)
```

</details>

**依据 3 · 源码核查**：[engine/aggregation/build_canonical.py:133-157](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/engine/aggregation/build_canonical.py#L133-L157)

判定冲突仲裁。

<details>
<summary>查看原文（25行）</summary>

```text
def merge_entry(a, b):
    """同 canonical 的更旧轮次 b 补齐/仲裁 a：URL 取真实、star 取大、desc 取有效、判定冲突降待定。"""
    out = dict(a)
    if 'search?q=' in (out.get('url') or '') and 'search?q=' not in (b.get('url') or ''):
        out['url'] = b['url']
    if (out.get('star') or 0) < (b.get('star') or 0):
        out['star'] = b['star']
    if not out.get('bundle') and b.get('bundle'):
        out['bundle'] = b['bundle']
    if not _ok_desc(out.get('desc')) and _ok_desc(b.get('desc')):
        out['desc'] = b['desc']
    if not out.get('domain') and b.get('domain'):
        out['domain'] = b['domain']
    va, vb = out.get('verdict'), b.get('verdict')
    if out.get('verdict_conflict') or b.get('verdict_conflict'):
        out['verdict'] = '⚠️ 待定'
        out['verdict_conflict'] = out.get('verdict_conflict') or b['verdict_conflict']
    elif va != vb:
        if vb in CONFLICTING_VERDICTS and va not in CONFLICTING_VERDICTS:
            out['verdict'] = vb
        elif va in CONFLICTING_VERDICTS and vb not in CONFLICTING_VERDICTS:
            pass
        elif va in CONFLICTING_VERDICTS and vb in CONFLICTING_VERDICTS:
            out['verdict'] = '⚠️ 待定'
            out['verdict_conflict'] = f'{va} ↔ {vb}'
```

</details>

**依据 4 · 源码核查**：[engine/aggregation/build_canonical.py:280-302](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/engine/aggregation/build_canonical.py#L280-L302)

登记缺口以未测补充。

<details>
<summary>查看原文（23行）</summary>

```text
    # 登记表兜底（#189）：PLUGINS.md 表行有、已定位集合没有的仓，按登记信息补行
    n_floor = n_floor_gone = 0
    reg_md = ROOT / 'PLUGINS.md'
    if reg_md.is_file():
        have = set()
        for e in entries:
            mh = REAL_URL_RE.search(e.get('url') or '')
            if mh:
                have.add(f"{mh.group(1)}/{mh.group(2)}".lower())
            have.add(e['name'].lower().replace('/', '-'))
        for line in reg_md.read_text().splitlines():
            rm = re.match(r'^\|\s*([^|]+?)\s*\|\s*\[[^\]]*\]\('
                          r'(https://github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+?)/?\)\s*\|\s*([^|]*)', line)
            if not rm:
                continue
            name, url, desc = rm.group(1).strip(), rm.group(2), rm.group(3).strip()
            full = identities.resolve(url.split('github.com/')[1].strip('/')).lower()
            if full in have:
                continue
            dom, _hit = classify(name, desc)
            fe = {'name': name or full.split('/')[1], 'url': f"https://github.com/{full}",
                  'star': live_star.get(full), 'verdict': '⏳ 未测',
                  'domain': dom, 'desc': desc or '—', 'locate': 'located'}
```

</details>

**依据 5 · 源码核查**：[engine/aggregation/build_canonical.py:395-415](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/engine/aggregation/build_canonical.py#L395-L415)

公开行归并及计数。

<details>
<summary>查看原文（21行）</summary>

```text
            if e.get('locate') != 'located':
                continue
            desc = (e.get('desc') or '—').strip()
            if desc.startswith('http'):
                desc = '—'
            pr = ' 〔PR〕' if e['name'] in pr_names else ''
            bundle = '〔📦〕' if e.get('bundle') else ''
            export_rows.append({
                'repo': e['url'].split('github.com/')[1],
                'name': e['name'],
                'verdict': EXPORT_VERDICT.get(e.get('verdict'), 'untested'),
                'stars': e.get('star') if isinstance(e.get('star'), int) else None,
                'desc': f'{desc}{pr}{bundle}',
            })
    # 出口再验证归一身份；与站点和历史 Markdown 导出共享同仓标签/星数/判定归并规则。
    export_rows = dedupe_public_rows(export_rows, identities)

    # 四档清单统计在同仓去重与判定仲裁后按最终 rows 计数，与对外数组逐条一致
    # （曾用去重前的 vc，latest.stats 与 plugins[] 实际计数漂移——语义门禁校验的就是它）；
    # 监测三态（gone/ambiguous/unlocated）不进入 rows，单独计数，不能与 total_listed 相加对账。
    row_counts = Counter(p['verdict'] for p in export_rows)
```

</details>

**依据 6 · 源码核查**：[engine/rendering/render_all.py:41-53](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/engine/rendering/render_all.py#L41-L53)

渲染器读取 canonical。

<details>
<summary>查看原文（13行）</summary>

```text
                               key=lambda kv: (kv[0] == latest, _version_key(kv[0])), reverse=True))
        return f"- 测试版本（多主线累计）：{vd}；最新 `{latest}`（烤入磁贴右段）"
    except Exception:
        return f"- 测试版本（多主线累计）：{radar_ver}；最新 `{radar_ver}`（烤入磁贴右段）"


def render(canonical=None) -> dict:
    if canonical is None:
        canonical = json.loads(CANON.read_text(encoding='utf8'))
    entries = canonical['entries']
    counts = canonical['counts']
    vc = canonical['stats_located']
    v_all = canonical['stats_all']
```

</details>

#### 缺口

- 未运行聚合或核对输入完整性
  **影响**：不能证明当前输出完整、一致或来源覆盖
  **进一步探讨**：构造固定样本对照缺损、改名和冲突后的导出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 测试状态可以当作当前可安装兼容性证明吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

README:46-59 和 docs/api.md:68-80 明确公开状态合并历史，逐条缺少完整插件 commit、测试版本、时间及日志，不能将 ok 推断为当前 DSH 通过，也不能推断安全或功能齐全。engine/README.md:44-48 披露运行级验证器和部分生产组件不在公开仓库，MANIFEST.md:8-13 说明缺私有件会警告或跳过；公开聚合逻辑不能复现或独立审计被汇入的测试结论。用户可把状态当候选线索并回上游核版本，不能将其当自动安装或信任门槛。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:46-59](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/README.md#L46-L59)

作者说明历史状态和逐条证据缺口。

<details>
<summary>查看原文（14行）</summary>

```text
## 怎样理解兼容性记录

公开清单归并了多轮历史记录；状态是筛选信号，使用时需要结合插件自己的安装说明与当前版本。

| 状态 | 阅读方式 |
|---|---|
| 可用 | 归并记录中存在运行级可用结论；具体版本与条件需查对应测试证据 |
| 不兼容 | 归并记录中存在运行级失败结论；作者更新或环境变化后可能改变 |
| 待定 | 尚未形成确定结论，可能涉及测试环境问题或记录冲突 |
| 未测 | 没有相应运行级测试覆盖 |

公开扁平清单尚未为每条记录提供完整的插件 commit、被测版本、时间与日志。全局版本指针不能替代这些逐条证据，历史“可用”记录也不能解释为已在最新 DSH 版本下验证。

先阅读插件原仓库的安装、权限与卸载说明，在测试环境完成最小功能验证并保留回滚路径。运行级判定不等同于完整功能、性能或安全审计。
```

</details>

**依据 2 · 作者声明**：[docs/api.md:68-80](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/docs/api.md#L68-L80)

机器可读字段与历史判定限制。

<details>
<summary>查看原文（13行）</summary>

````text
**plugins-all.json**（`plugins[]` 数组，每条）

```json
{"repo": "owner/name", "name": "显示名", "verdict": "ok",
 "stars": 48288, "desc": "一句话描述"}
```

- `verdict ∈ ok | incompatible | pending | untested | gone | ambiguous | unlocated`
  （运行级四档 + 定位监测三态；当前已定位明细数组含前四档，监测三态单独计数。`ok` 为历史归并中的可用结论，不能解释为已在全局最新 runner 下验证。）
- `stars` 为 `null` 表示未知（缺值，非 0）
- **口径承诺**：字段只增不删；判定真相以 `data/snapshots/` 逐轮快照为准（本接口为多轮并集归并口径）

发布说明：2026-10-02 维护修复将四档统计改为在最终仓库去重和冲突仲裁之后计数，字段名和数组结构不变，数量与明细逐条对账。公开接口尚未为每条记录提供完整的插件 commit、测试版本、时间和日志；全局版本指针不能替代逐条证据。
````

</details>

**依据 3 · 作者声明**：[engine/README.md:44-48](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/engine/README.md#L44-L48)

生产验证器不在公开源码。

```text
## 诚实边界

- **第三阶段（k8s 运行级验证器）未含在本目录**：一插件一 pod 的隔离测试引擎、L0–L3 分层判定、`input_hash` 增量重测属于第三阶段，稳定后开源轻量版与服务器版。
- 脚本为服务器生产形态（bash + python 混合、经 dirname 相对路径互调；`./scripts/*.sh` 扁平引用已清零）；包化 CLI（`dsh-radar discover/scan/report`）在路线图上。
- 私有件（`~/dsh-k8s`）全部引用点带在场守卫：缺件显式 WARN 安全降级，开源副本可运行到「仅缺私有件功能」。
```

**依据 4 · 作者声明**：[engine/ops/private/MANIFEST.md:8-13](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/engine/ops/private/MANIFEST.md#L8-L13)

私有生产组件缺失时的契约。

```text
| 私有件 | 引用点 | 契约（输入 → 输出） | 缺失时行为 |
|---|---|---|---|
| `radar-index-request.py` | `engine/discovery/cron-check.sh`（worker 门禁） | `--reason --trigger` → 入队一条索引请求 | WARN 后按「已入队」退出（开源副本手动直跑走 `RADAR_INDEX_WORKER=1`） |
| `gen-snapshot-v2.py` | `engine/distribution/auto-snapshot-push.sh`（①生成快照） | 无参 → `$SNAP_DIR/data/snapshots/<run_id>.json`（radar-snapshot/2） | WARN 后本轮跳过（exit 0，不推） |
| `aggregate-agent-test.py` | `engine/distribution/deliver-all.sh`、`bot-deliver.sh` | 读 `.rt-agent/` 流式结果 → `reports/<日期>/agent-test.md` | WARN 后跳过聚合；deliver-all 继续提交已有结果 |
| `bot-deliver.sh`（服务器版） | `engine/distribution/deliver-all.sh`、`deliver-chain.sh` | 读当日报告 → 双仓 bot PR | WARN 后跳过 bot 交付 |
```

**依据 5 · 源码核查**：[engine/aggregation/build_canonical.py:133-157](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/engine/aggregation/build_canonical.py#L133-L157)

冲突状态的公开聚合。

<details>
<summary>查看原文（25行）</summary>

```text
def merge_entry(a, b):
    """同 canonical 的更旧轮次 b 补齐/仲裁 a：URL 取真实、star 取大、desc 取有效、判定冲突降待定。"""
    out = dict(a)
    if 'search?q=' in (out.get('url') or '') and 'search?q=' not in (b.get('url') or ''):
        out['url'] = b['url']
    if (out.get('star') or 0) < (b.get('star') or 0):
        out['star'] = b['star']
    if not out.get('bundle') and b.get('bundle'):
        out['bundle'] = b['bundle']
    if not _ok_desc(out.get('desc')) and _ok_desc(b.get('desc')):
        out['desc'] = b['desc']
    if not out.get('domain') and b.get('domain'):
        out['domain'] = b['domain']
    va, vb = out.get('verdict'), b.get('verdict')
    if out.get('verdict_conflict') or b.get('verdict_conflict'):
        out['verdict'] = '⚠️ 待定'
        out['verdict_conflict'] = out.get('verdict_conflict') or b['verdict_conflict']
    elif va != vb:
        if vb in CONFLICTING_VERDICTS and va not in CONFLICTING_VERDICTS:
            out['verdict'] = vb
        elif va in CONFLICTING_VERDICTS and vb not in CONFLICTING_VERDICTS:
            pass
        elif va in CONFLICTING_VERDICTS and vb in CONFLICTING_VERDICTS:
            out['verdict'] = '⚠️ 待定'
            out['verdict_conflict'] = f'{va} ↔ {vb}'
```

</details>

#### 缺口

- 未取得逐插件测试运行环境、日志和私有生产者
  **影响**：无法核验兼容结论或现在的安全性
  **进一步探讨**：逐条索取固定版本、环境与执行日志，并在隔离宿主复核。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 运行聚合或使用目录需要什么，失败和成本由谁承担？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

docs/api.md:35-44 指出可变 main 的两份数据并非原子一致，严格对账应绑定同一个完整提交并使用生成时间；镜像可能延迟，不能当已验证的故障切换。engine/README.md:5-15、44-48 将公开脚本拆为发现、聚合、渲染和分发，并说明私有验证器缺席；维护者需投入维护输入、网络、存储和证据保全，使用者仍要人工核版本及失败退路。适合维护候选清单的使用者先按固定提交获取一小批再查上游，证据缺失或数据日期不一致时停止自动决策；未测实际时间、运行成本及恢复表现。

#### 证据与依据

**依据 1 · 作者声明**：[docs/api.md:35-44](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/docs/api.md#L35-L44)

固定提交对账与镜像延迟。

<details>
<summary>查看原文（10行）</summary>

```text
### 镜像与一致性

可选内容分发网络镜像地址：

- https://cdn.jsdelivr.net/gh/AdamPlatin123/dsh-plugin-radar@main/data/latest.json
- https://cdn.jsdelivr.net/gh/AdamPlatin123/dsh-plugin-radar@main/data/plugins-all.json

镜像可能延迟更新，也可能存在服务限制；它不是已经验证的实时故障切换保障。切换来源时先核对数据日期和结构；不得把不同来源、不同更新轮次的统计与明细视为同一组数据。

需要严格跨文件一致性时，把两个地址中的 `main` 替换为同一个完整 Git 提交哈希（40 位提交标识）读取，再逐档对账。轮询结果可用于发现更新，但读取可变分支下的两个文件本身不构成原子快照。下游显示数据日期时使用数据中的 `generated_at`，不要用本地下载时间替代。
```

</details>

**依据 2 · 作者声明**：[engine/README.md:5-15](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/engine/README.md#L5-L15)

公开工程域和用途。

<details>
<summary>查看原文（11行）</summary>

```text
## 目录 ↔ 管线映射

| 目录 | 域 | 内容 |
|---|---|---|
| `lib/radar/` | 公共层 | 唯一实现：atomicio 原子写 · secretsource 密钥（env > `~/.radar-keys/` > sqlite 兜底，header 文件传 curl）· ghql GraphQL 客户端（urllib 直连，限速感知）· gitops（push 只允许 `--force-with-lease`）· thresholds · sanitize 消毒 |
| `discovery/` | 发现 | `discover.py`（GitHub topic×2 + keyword×3、403 退避）· `cron-check.sh`（编排：增量检测逻辑在 `lib_cron_logic.sh`，回归用 `scripts/selftest-cron-increment.sh`）· `watch-*.sh` |
| `aggregation/` | 聚合 | `build_canonical.py`（**统一聚合器** → `generated/current/canonical.json` 单一事实源，三条数据路径的收敛点）· `rebaseline.py`（ADR-0002 基线固化+窗口裁剪，重放等价断言 fail-closed）· `aggregate.py`（发现轨统计，dashboard/probe 消费）· `normalize.py` |
| `rendering/` | 渲染 | `render_all.py`（canonical → PLUGINS-ALL.md + catalog/all）· `gen-catalog.sh`（读 `data/domain-map.json`，支持 `--offline` 缓存）· `update-readme.sh` · `report-llm.sh` |
| `distribution/` | 分发 | `merge_guard.py`（**唯一自动合并门控**：head SHA+作者+文件集合三重闸门，回归 `scripts/selftest-merge-guard.sh`）· `cadence.py` · `bot-deliver.sh` / `deliver-*.sh` · `auto-snapshot-push.sh`（含内容门禁：JSON 合法性+API 错误对象+关键文件形态）· `auto-merge-render.sh` |
| `maintenance/` | 目录维护 | `compat/`（compare-mainline 五库化：编排壳 + `lib_{fetch,anchor,patch,report,state}.sh`；`lib_report` 增产 `mainline-compat.json`；原 1117 行单体留名 `legacy-compare-mainline.sh` 双轨观察）· `build-mainline.sh` · `check-ref-lag.sh` · `fix-plugin.sh` · `report-*.sh` |
| `ops/` | 运维自愈 | `radar-probe.sh`（15 分钟心跳）· `radar-watchdog.sh`（看门狗+私有件自检）· `dashboard.py`（`RADAR_DASH_PORT`，默认 8898）· `model-*.sh` · `monitor-usage.sh` · `private/MANIFEST.md`（私有件契约清单） |
```

</details>

**依据 3 · 作者声明**：[engine/README.md:44-48](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/engine/README.md#L44-L48)

私有验证器及公开脚本边界。

```text
## 诚实边界

- **第三阶段（k8s 运行级验证器）未含在本目录**：一插件一 pod 的隔离测试引擎、L0–L3 分层判定、`input_hash` 增量重测属于第三阶段，稳定后开源轻量版与服务器版。
- 脚本为服务器生产形态（bash + python 混合、经 dirname 相对路径互调；`./scripts/*.sh` 扁平引用已清零）；包化 CLI（`dsh-radar discover/scan/report`）在路线图上。
- 私有件（`~/dsh-k8s`）全部引用点带在场守卫：缺件显式 WARN 安全降级，开源副本可运行到「仅缺私有件功能」。
```

**依据 4 · 作者声明**：[README.md:46-59](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/README.md#L46-L59)

采用时必须回原仓和保留退路。

<details>
<summary>查看原文（14行）</summary>

```text
## 怎样理解兼容性记录

公开清单归并了多轮历史记录；状态是筛选信号，使用时需要结合插件自己的安装说明与当前版本。

| 状态 | 阅读方式 |
|---|---|
| 可用 | 归并记录中存在运行级可用结论；具体版本与条件需查对应测试证据 |
| 不兼容 | 归并记录中存在运行级失败结论；作者更新或环境变化后可能改变 |
| 待定 | 尚未形成确定结论，可能涉及测试环境问题或记录冲突 |
| 未测 | 没有相应运行级测试覆盖 |

公开扁平清单尚未为每条记录提供完整的插件 commit、被测版本、时间与日志。全局版本指针不能替代这些逐条证据，历史“可用”记录也不能解释为已在最新 DSH 版本下验证。

先阅读插件原仓库的安装、权限与卸载说明，在测试环境完成最小功能验证并保留回滚路径。运行级判定不等同于完整功能、性能或安全审计。
```

</details>

#### 缺口

- 未测下载、生成失败及人工核验成本
  **影响**：不能断言目录更新延迟或集成净收益
  **进一步探讨**：固定提交小批接入并记录核对、失败恢复和人力。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样可增量提升逐条兼容性证据可追溯性？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

公开每条扁平记录已有 repo/name/verdict/stars/desc，全局也有生成日期和 runner_versions；README 和 API 已披露逐条 commit、环境、时间与日志不全。因此仅再显示四档或全局版本不是增量。未验证设想是由实际测试生产者为每次记录输出稳定组件、源码 commit、宿主及运行环境、测试步骤、完成时间、结果和日志摘要的元组，并让消费者按可核对条件筛选；缺项显式 unknown，不从全局指针回填。该方案依赖私有生产者愿意和能够公开脱敏证据，不能从公开聚合推断实现或真实性。用同一批 20 个已知版本样本对照现有目录和元组接口，包含过期 commit、失败重试、冲突、缺日志和隐私敏感日志，测错误归类、追溯时间、维护和泄露成本；若缺项被冒充通过、错误结论不降、日志泄露或额外成本超过价值则否定。

#### 证据与依据

**依据 1 · 作者声明**：[docs/api.md:68-80](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/docs/api.md#L68-L80)

现有字段和逐条证据缺口。

<details>
<summary>查看原文（13行）</summary>

````text
**plugins-all.json**（`plugins[]` 数组，每条）

```json
{"repo": "owner/name", "name": "显示名", "verdict": "ok",
 "stars": 48288, "desc": "一句话描述"}
```

- `verdict ∈ ok | incompatible | pending | untested | gone | ambiguous | unlocated`
  （运行级四档 + 定位监测三态；当前已定位明细数组含前四档，监测三态单独计数。`ok` 为历史归并中的可用结论，不能解释为已在全局最新 runner 下验证。）
- `stars` 为 `null` 表示未知（缺值，非 0）
- **口径承诺**：字段只增不删；判定真相以 `data/snapshots/` 逐轮快照为准（本接口为多轮并集归并口径）

发布说明：2026-10-02 维护修复将四档统计改为在最终仓库去重和冲突仲裁之后计数，字段名和数组结构不变，数量与明细逐条对账。公开接口尚未为每条记录提供完整的插件 commit、测试版本、时间和日志；全局版本指针不能替代逐条证据。
````

</details>

**依据 2 · 作者声明**：[README.md:46-59](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/README.md#L46-L59)

状态的限制与回查建议。

<details>
<summary>查看原文（14行）</summary>

```text
## 怎样理解兼容性记录

公开清单归并了多轮历史记录；状态是筛选信号，使用时需要结合插件自己的安装说明与当前版本。

| 状态 | 阅读方式 |
|---|---|
| 可用 | 归并记录中存在运行级可用结论；具体版本与条件需查对应测试证据 |
| 不兼容 | 归并记录中存在运行级失败结论；作者更新或环境变化后可能改变 |
| 待定 | 尚未形成确定结论，可能涉及测试环境问题或记录冲突 |
| 未测 | 没有相应运行级测试覆盖 |

公开扁平清单尚未为每条记录提供完整的插件 commit、被测版本、时间与日志。全局版本指针不能替代这些逐条证据，历史“可用”记录也不能解释为已在最新 DSH 版本下验证。

先阅读插件原仓库的安装、权限与卸载说明，在测试环境完成最小功能验证并保留回滚路径。运行级判定不等同于完整功能、性能或安全审计。
```

</details>

**依据 3 · 作者声明**：[engine/README.md:44-48](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/engine/README.md#L44-L48)

私有测试生产者边界。

```text
## 诚实边界

- **第三阶段（k8s 运行级验证器）未含在本目录**：一插件一 pod 的隔离测试引擎、L0–L3 分层判定、`input_hash` 增量重测属于第三阶段，稳定后开源轻量版与服务器版。
- 脚本为服务器生产形态（bash + python 混合、经 dirname 相对路径互调；`./scripts/*.sh` 扁平引用已清零）；包化 CLI（`dsh-radar discover/scan/report`）在路线图上。
- 私有件（`~/dsh-k8s`）全部引用点带在场守卫：缺件显式 WARN 安全降级，开源副本可运行到「仅缺私有件功能」。
```

**依据 4 · 源码核查**：[engine/aggregation/build_canonical.py:133-157](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/c200222795370ed18ab607115edc090535ddcbd8/engine/aggregation/build_canonical.py#L133-L157)

现有冲突仲裁。

<details>
<summary>查看原文（25行）</summary>

```text
def merge_entry(a, b):
    """同 canonical 的更旧轮次 b 补齐/仲裁 a：URL 取真实、star 取大、desc 取有效、判定冲突降待定。"""
    out = dict(a)
    if 'search?q=' in (out.get('url') or '') and 'search?q=' not in (b.get('url') or ''):
        out['url'] = b['url']
    if (out.get('star') or 0) < (b.get('star') or 0):
        out['star'] = b['star']
    if not out.get('bundle') and b.get('bundle'):
        out['bundle'] = b['bundle']
    if not _ok_desc(out.get('desc')) and _ok_desc(b.get('desc')):
        out['desc'] = b['desc']
    if not out.get('domain') and b.get('domain'):
        out['domain'] = b['domain']
    va, vb = out.get('verdict'), b.get('verdict')
    if out.get('verdict_conflict') or b.get('verdict_conflict'):
        out['verdict'] = '⚠️ 待定'
        out['verdict_conflict'] = out.get('verdict_conflict') or b['verdict_conflict']
    elif va != vb:
        if vb in CONFLICTING_VERDICTS and va not in CONFLICTING_VERDICTS:
            out['verdict'] = vb
        elif va in CONFLICTING_VERDICTS and vb not in CONFLICTING_VERDICTS:
            pass
        elif va in CONFLICTING_VERDICTS and vb in CONFLICTING_VERDICTS:
            out['verdict'] = '⚠️ 待定'
            out['verdict_conflict'] = f'{va} ↔ {vb}'
```

</details>

#### 缺口

- 没有可核实的逐项证据接口、样本和私有生产者材料
  **影响**：无法证明生产可行性或减少误判
  **进一步探讨**：先取得可脱敏的真实测试元组，再做固定样本对照。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
