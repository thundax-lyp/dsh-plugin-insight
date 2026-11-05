# Oh-My-DSH

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[7acdbf5](https://github.com/like-study1/Oh-My-DSH/tree/7acdbf564861b024b01be1fe2e645513c292bee5)

<!-- BEGIN META -->
[![GitHub ★ 100](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=100&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/like-study1/Oh-My-DSH)
<!-- END META -->

> **功能**：提供 DSH 插件分类目录、元数据快照与检索站点。

> **亮点**：[Q01](#research-q01) 想寻找 DSH 扩展的用户可浏览分类目录和检索站点。Python 同步流程从 GitHub 查询获取元数据，结合 curated 覆盖项并排序，生成 Markdown、索引和站点。固定树表现为目录与生成器，其价值是聚合发现入口。

> **主要限制**：[Q02](#research-q02) 同步按 stars 排序取搜索页，类型和维护信号来自元数据与覆盖配置，不能证明安装或安全。README 声明监测 2000 仓库和收录 2133 条，仅当作固定快照作者描述。生成器有手工和覆盖路径，完整性还依赖搜索上限、去重和来源。

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
  - [Q01 · 根项目怎样帮助发现插件？](#detail-section-11)
  - [Q02 · 主题检索与精选能证明什么？](#detail-section-12)
  - [Q03 · 如何使用目录而控制维护成本？](#detail-section-13)
  - [Q04 · 怎样减少目录把非插件当插件？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要查找与初筛扩展的用户。

在主题搜索结果中逐个寻找候选。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 目录 | 查找候选 | 需二次核验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 目录快照 | 浏览需要 | 发现候选 | 回原源 |
| GitHub 元数据 | 维护需要 | 更新 | 保留旧快照 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 查找 | 浏览固定目录 | 记录来源 |
| 核验 | 到目标入口检查 | 确认身份 |
| 退出 | 保留引用快照 | 无宿主安装 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 浏览费用未知 | 核对候选 | 未测 |
| 维护 | 请求额度未知 | 人工分类 | 按规模 |
| 退出 | 归档成本未知 | 保留来源 | 可追溯 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 发现 | 聚合及分类 | 真实覆盖 |
| 筛选 | 元数据与覆盖 | 安装安全 |

> **思考**：[Q02](#research-q02) 同步按 stars 排序取搜索页，类型和维护信号来自元数据与覆盖配置，不能证明安装或安全。README 声明监测 2000 仓库和收录 2133 条，仅当作固定快照作者描述。生成器有手工和覆盖路径，完整性还依赖搜索上限、去重和来源。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 想寻找 DSH 扩展的用户可浏览分类目录和检索站点。Python 同步流程从 GitHub 查询获取元数据，结合 curated 覆盖项并排序，生成 Markdown、索引和站点。固定树表现为目录与生成器，其价值是聚合发现入口。

[Q02](#research-q02) 同步按 stars 排序取搜索页，类型和维护信号来自元数据与覆盖配置，不能证明安装或安全。README 声明监测 2000 仓库和收录 2133 条，仅当作固定快照作者描述。生成器有手工和覆盖路径，完整性还依赖搜索上限、去重和来源。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 同步按 stars 排序取搜索页，类型和维护信号来自元数据与覆盖配置，不能证明安装或安全。README 声明监测 2000 仓库和收录 2133 条，仅当作固定快照作者描述。生成器有手工和覆盖路径，完整性还依赖搜索上限、去重和来源。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先在固定快照查找目标，再到候选固定源核对身份、入口及权限。目录本身无需给宿主安装，若维护生成器则需 GitHub 元数据和人工审核。失准时回到原源，保留被引用快照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码及作者说明，未执行目标。

- 已检查：作者 README、包清单、源码路径 README.md、scripts/sync_plugins.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定身份及其直接依赖的代表实现。
- 下一步：抽样身份、分页及根子去重。

**分析版本**

- **仓库**：[like-study1/Oh-My-DSH](https://github.com/like-study1/Oh-My-DSH)
- **版本号**：未声明（[固定提交 7acdbf5](https://github.com/like-study1/Oh-My-DSH/tree/7acdbf564861b024b01be1fe2e645513c292bee5)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在星数和主题信号后增加固定 manifest 与实际入口的分类核验，对照客户端、目录、插件和子组件保留集。比较误分类及审核时间，若没有改善则调整。

抽样身份、分页及根子去重。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 2900 | — | — | 78828 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/like-study1/Oh-My-DSH/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话地图如何组织和传递上下文？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目怎样帮助发现插件？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

想寻找 DSH 扩展的用户可浏览分类目录和检索站点。Python 同步流程从 GitHub 查询获取元数据，结合 curated 覆盖项并排序，生成 Markdown、索引和站点。固定树表现为目录与生成器，其价值是聚合发现入口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-24](https://github.com/like-study1/Oh-My-DSH/blob/7acdbf564861b024b01be1fe2e645513c292bee5/README.md#L13-L24)

作者定义目录

<details>
<summary>查看原文（12行）</summary>

```text
## 一、项目定位

DeepSeek Harness（以下简称 DSH）是由深度求索（DeepSeek AI）开源的人工智能 Agent 框架，其核心架构理念为“万物皆可插件”。随着生态体系快速扩展，社区插件数量持续增长，开发者在检索、甄别与选用插件方面的成本随之上升。

本仓库以 GitHub `dsh-plugin` 主题为数据源，对生态全量插件实施周期性自动监测，并在此基础上开展人工遴选、分类编目与信息核验，形成集完整性、时效性与可用性于一体的插件聚合目录。收录结果以分类目录、数据文件与检索站点三种形态同步发布。

## 二、内容导航

| 类别 | 入口 | 说明 |
|---|---|---|
| 分类目录 | [PLUGINS.md](PLUGINS.md) | 精选条目的分类明细 |
| 插件聚合社区 | [Oh-My-DSH 插件聚合社区](https://like-study1.github.io/Oh-My-DSH/) | 支持检索与筛选的网页目录 |
```

</details>

**依据 2 · 源码核查**：[scripts/sync_plugins.py:118-137](https://github.com/like-study1/Oh-My-DSH/blob/7acdbf564861b024b01be1fe2e645513c292bee5/scripts/sync_plugins.py#L118-L137)

检索与元数据

<details>
<summary>查看原文（20行）</summary>

```text
    queries = ["topic:dsh-plugin", "topic:dsh-plugin stars:0..4"]
    for query in queries:
        q_total = None
        for page in range(1, 11):
            url = (f"{API}/search/repositories?q={urllib.parse.quote(query)}&sort=stars"
                   f"&order=desc&per_page=100&page={page}")
            data = api_get(url, token)
            if not data or not data.get("items"):
                break
            q_total = data.get("total_count", 0)
            for it in data["items"]:
                if it["full_name"] in seen:
                    continue
                seen.add(it["full_name"])
                items.append({
                    "full_name": it["full_name"], "url": it["html_url"],
                    "description": (it.get("description") or "").strip(),
                    "stars": it.get("stargazers_count", 0), "forks": it.get("forks_count", 0),
                    "language": it.get("language"), "topics": it.get("topics", []),
                    "archived": it.get("archived", False), "fork": it.get("fork", False),
```

</details>

**依据 3 · 源码核查**：[scripts/sync_plugins.py:194-208](https://github.com/like-study1/Oh-My-DSH/blob/7acdbf564861b024b01be1fe2e645513c292bee5/scripts/sync_plugins.py#L194-L208)

策展配置

<details>
<summary>查看原文（15行）</summary>

```text
def load_curated():
    return json.loads((ROOT / "data" / "curated.json").read_text(encoding="utf-8"))

def main():
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if not token:
        import subprocess
        token = subprocess.run(["gh", "auth", "token"], capture_output=True, text=True).stdout.strip()
    if not token:
        sys.exit("GH_TOKEN required")
    now = datetime.now(BEIJING)
    curated_cfg = load_curated()
    min_stars = curated_cfg.get("min_stars", 3)
    overrides = curated_cfg.get("overrides", {})
    manual = curated_cfg.get("manual", [])
```

</details>

**依据 4 · 源码核查**：[scripts/sync_plugins.py:270-289](https://github.com/like-study1/Oh-My-DSH/blob/7acdbf564861b024b01be1fe2e645513c292bee5/scripts/sync_plugins.py#L270-L289)

统一生成

<details>
<summary>查看原文（20行）</summary>

```text
    # categorize + decorate
    for ent in entries.values():
        ent["category"] = ent.get("category") or classify(ent["full_name"], ent["description"])
        ent["activity"] = activity(ent["pushed_at"], now)
        ent["type"] = typify(ent)
    curated = sorted(entries.values(), key=lambda e: (-e["stars"], e["full_name"].lower()))
    log(f"curated entries: {len(curated)} (total stars {sum(e['stars'] for e in curated)})")

    (ROOT / "data" / "plugins.json").write_text(json.dumps(
        {"generated_at": now.isoformat(), "count": len(curated), "items": curated},
        ensure_ascii=False, indent=1), encoding="utf-8")

    log("== generating PLUGINS.md ==")
    generate_plugins_md(curated, len(snapshot), now)
    log("== generating site ==")
    generate_site(curated, len(snapshot), now)
    log("== updating README stats ==")
    generate_readme_stats(curated, len(snapshot), now)
    log("== updating CHANGELOG ==")
    changed = update_changelog(curated, len(snapshot), now)
```

</details>

#### 缺口

- 未运行同步或访问线上站点
  **影响**：当前数据覆盖率未知
  **进一步探讨**：离线抽样核对条目来源

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 主题检索与精选能证明什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

同步按 stars 排序取搜索页，类型和维护信号来自元数据与覆盖配置，不能证明安装或安全。README 声明监测 2000 仓库和收录 2133 条，仅当作固定快照作者描述。生成器有手工和覆盖路径，完整性还依赖搜索上限、去重和来源。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-29](https://github.com/like-study1/Oh-My-DSH/blob/7acdbf564861b024b01be1fe2e645513c292bee5/README.md#L26-L29)

固定统计

```text
## 三、生态统计

<!-- OMD:stats:START -->
截至 2026-11-05 08:53（北京时间），本目录收录精选插件 **2133** 个，监测生态仓库 **2000** 个，累计获得 Star **1981563**。
```

**依据 2 · 作者声明**：[README.md:82-84](https://github.com/like-study1/Oh-My-DSH/blob/7acdbf564861b024b01be1fe2e645513c292bee5/README.md#L82-L84)

责任边界

```text
## 七、责任声明

本目录系社区自发建设，收录行为不代表 DSH 官方背书。收录状态仅反映公开数据，不构成兼容性承诺；活跃度信号不等同于安全性结论。使用者安装第三方插件前，应自行核验插件源码、权限范围、依赖关系、开源许可及最近更新时间。
```

**依据 3 · 源码核查**：[scripts/sync_plugins.py:118-137](https://github.com/like-study1/Oh-My-DSH/blob/7acdbf564861b024b01be1fe2e645513c292bee5/scripts/sync_plugins.py#L118-L137)

搜索分页

<details>
<summary>查看原文（20行）</summary>

```text
    queries = ["topic:dsh-plugin", "topic:dsh-plugin stars:0..4"]
    for query in queries:
        q_total = None
        for page in range(1, 11):
            url = (f"{API}/search/repositories?q={urllib.parse.quote(query)}&sort=stars"
                   f"&order=desc&per_page=100&page={page}")
            data = api_get(url, token)
            if not data or not data.get("items"):
                break
            q_total = data.get("total_count", 0)
            for it in data["items"]:
                if it["full_name"] in seen:
                    continue
                seen.add(it["full_name"])
                items.append({
                    "full_name": it["full_name"], "url": it["html_url"],
                    "description": (it.get("description") or "").strip(),
                    "stars": it.get("stargazers_count", 0), "forks": it.get("forks_count", 0),
                    "language": it.get("language"), "topics": it.get("topics", []),
                    "archived": it.get("archived", False), "fork": it.get("fork", False),
```

</details>

**依据 4 · 源码核查**：[scripts/sync_plugins.py:223-248](https://github.com/like-study1/Oh-My-DSH/blob/7acdbf564861b024b01be1fe2e645513c292bee5/scripts/sync_plugins.py#L223-L248)

覆盖与人工条目

<details>
<summary>查看原文（26行）</summary>

```text
    log("== resolving curated entries ==")
    entries = {}
    dropped = []
    # 1) overrides that live in the snapshot
    for name, ov in overrides.items():
        ent = snap_by_full.get(ov.get("repo", "").lower())
        if ent and not ent["archived"]:
            entries[ent["full_name"]] = {**ent, "category": ov.get("category"), "note": ov.get("note") or "", "source": "topic"}
        elif ent:
            dropped.append(ent["full_name"])
    # 2) overrides / manual entries outside the snapshot -> repo API
    for name, ov in overrides.items():
        if snap_by_full.get(ov.get("repo", "").lower()):
            continue
        data = api_get(f"{API}/repos/{ov['repo']}", token)
        if not data or data.get("archived"):
            dropped.append(ov["repo"]); continue
        ent = repo_entry(data)
        entries[ent["full_name"]] = {**ent, "category": ov.get("category"), "note": ov.get("note") or "", "source": "curated"}
        log(f"  + {ent['full_name']} ({ent['stars']}★)")
    for m in manual:
        data = api_get(f"{API}/repos/{m['repo']}", token)
        if not data or data.get("archived"):
            dropped.append(m["repo"]); continue
        ent = repo_entry(data)
        entries[ent["full_name"]] = {**ent, "category": m.get("category"), "note": m.get("note") or "", "source": "curated"}
```

</details>

#### 缺口

- 未核对所有条目及 GitHub 搜索截断
  **影响**：不能估算遗漏或真实兼容
  **进一步探讨**：抽样根与子组件及分页边界

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何使用目录而控制维护成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先在固定快照查找目标，再到候选固定源核对身份、入口及权限。目录本身无需给宿主安装，若维护生成器则需 GitHub 元数据和人工审核。失准时回到原源，保留被引用快照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-24](https://github.com/like-study1/Oh-My-DSH/blob/7acdbf564861b024b01be1fe2e645513c292bee5/README.md#L19-L24)

浏览入口

```text
## 二、内容导航

| 类别 | 入口 | 说明 |
|---|---|---|
| 分类目录 | [PLUGINS.md](PLUGINS.md) | 精选条目的分类明细 |
| 插件聚合社区 | [Oh-My-DSH 插件聚合社区](https://like-study1.github.io/Oh-My-DSH/) | 支持检索与筛选的网页目录 |
```

**依据 2 · 作者声明**：[README.md:54-64](https://github.com/like-study1/Oh-My-DSH/blob/7acdbf564861b024b01be1fe2e645513c292bee5/README.md#L54-L64)

维护模式

<details>
<summary>查看原文（11行）</summary>

```text
**01 全量监测** — 每 4 小时自动抓取 GitHub `dsh-plugin` 主题全量快照，实时跟踪生态内仓库的新增、更名与归档状态，监测范围覆盖全部主题仓库。

**02 人工策展** — 在自动采集的基础上，对候选插件逐项核验，明确类型归属，撰写条目简介，确保目录信息准确、层次分明。

**03 分类编目** — 按功能领域划分十一大类，涵盖 Web UI 增强、Agent 能力、编码开发、消息通讯、视觉与多模态、皮肤与娱乐、合集与发行版等，条目兼容中英双语说明。

**04 活跃度信号** — 依据仓库最近提交时间，标注“活跃、关注、放缓、停更”四级信号，辅助研判插件维护状态与更新节奏。

**05 社区站点** — 依托 GitHub Pages 部署检索站点，支持关键词检索与分类筛选，便于快速定位目标插件。

**06 自动维护** — 同步脚本与持续集成流程协同运行，目录、数据、站点及变更记录同步更新，全过程无需人工干预。
```

</details>

**依据 3 · 源码核查**：[scripts/sync_plugins.py:194-208](https://github.com/like-study1/Oh-My-DSH/blob/7acdbf564861b024b01be1fe2e645513c292bee5/scripts/sync_plugins.py#L194-L208)

配置依赖

<details>
<summary>查看原文（15行）</summary>

```text
def load_curated():
    return json.loads((ROOT / "data" / "curated.json").read_text(encoding="utf-8"))

def main():
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if not token:
        import subprocess
        token = subprocess.run(["gh", "auth", "token"], capture_output=True, text=True).stdout.strip()
    if not token:
        sys.exit("GH_TOKEN required")
    now = datetime.now(BEIJING)
    curated_cfg = load_curated()
    min_stars = curated_cfg.get("min_stars", 3)
    overrides = curated_cfg.get("overrides", {})
    manual = curated_cfg.get("manual", [])
```

</details>

#### 缺口

- 当前线上可用和请求费用未测
  **影响**：维护人时未知
  **进一步探讨**：对小样本记录有效条目与人工耗时

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少目录把非插件当插件？

**研究主题**：新假设与验证

#### 完整回答

在星数和主题信号后增加固定 manifest 与实际入口的分类核验，对照客户端、目录、插件和子组件保留集。比较误分类及审核时间，若没有改善则调整。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/sync_plugins.py:122-137](https://github.com/like-study1/Oh-My-DSH/blob/7acdbf564861b024b01be1fe2e645513c292bee5/scripts/sync_plugins.py#L122-L137)

元数据信号

<details>
<summary>查看原文（16行）</summary>

```text
            url = (f"{API}/search/repositories?q={urllib.parse.quote(query)}&sort=stars"
                   f"&order=desc&per_page=100&page={page}")
            data = api_get(url, token)
            if not data or not data.get("items"):
                break
            q_total = data.get("total_count", 0)
            for it in data["items"]:
                if it["full_name"] in seen:
                    continue
                seen.add(it["full_name"])
                items.append({
                    "full_name": it["full_name"], "url": it["html_url"],
                    "description": (it.get("description") or "").strip(),
                    "stars": it.get("stargazers_count", 0), "forks": it.get("forks_count", 0),
                    "language": it.get("language"), "topics": it.get("topics", []),
                    "archived": it.get("archived", False), "fork": it.get("fork", False),
```

</details>

**依据 2 · 源码核查**：[scripts/sync_plugins.py:241-248](https://github.com/like-study1/Oh-My-DSH/blob/7acdbf564861b024b01be1fe2e645513c292bee5/scripts/sync_plugins.py#L241-L248)

人工覆盖

```text
        entries[ent["full_name"]] = {**ent, "category": ov.get("category"), "note": ov.get("note") or "", "source": "curated"}
        log(f"  + {ent['full_name']} ({ent['stars']}★)")
    for m in manual:
        data = api_get(f"{API}/repos/{m['repo']}", token)
        if not data or data.get("archived"):
            dropped.append(m["repo"]); continue
        ent = repo_entry(data)
        entries[ent["full_name"]] = {**ent, "category": m.get("category"), "note": m.get("note") or "", "source": "curated"}
```

#### 缺口

- 条目现有分类准确率未知
  **影响**：规则可能漏掉非标准插件
  **进一步探讨**：先构建来源明确的小保留集

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
