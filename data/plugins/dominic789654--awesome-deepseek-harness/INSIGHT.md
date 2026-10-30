# Awesome DeepSeek Harness（资源目录）

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[cbf73de](https://github.com/Dominic789654/awesome-deepseek-harness/tree/cbf73de1ed806ea30de820ea84b927438a9a3504)

<!-- BEGIN META -->
[![GitHub ★ 405](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=405&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Dominic789654/awesome-deepseek-harness)
<!-- END META -->

> **功能**：按用途汇集DSH扩展候选的双语目录，附近期、星标、精选链接和独立示例。

> **亮点**：把跨类型候选、简述和来源线索组织为可浏览入口；四子包独立，不归根运行能力。见[Q01](#research-q01)。

> **主要限制**：近期/星数/精选/链接检查不是版本/运行证据，项目URL也不等组件身份；根无可安装入口和包版本。见[Q03](#research-q03)。

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
  - [Q01 · 资源目录面向谁，什么才算有用？](#detail-section-11)
  - [Q02 · 双语、近期、星数与校验怎样维护？](#detail-section-12)
  - [Q03 · 哪些标签和入口不能当选型证据？](#detail-section-13)
  - [Q04 · 资源如何使用，条件/投入和效果怎样衡量？](#detail-section-14)
  - [Q05 · 可采用到哪一步，未来方向怎样证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：发现DSH扩展候选的读者，合格结果是少量可回源选项，非更多目录条目。见[Q01](#research-q01)。

GitHub topic/search、逐仓或专题目录；本资源预先组织信息，不证明更快选到可用目标。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Markdown分类/双语 | 发现候选 | 资源导航，非宿主UI/已验运行功能 |
| 近期区块 | 跟踪清单编辑 | 新增行不等目标新发布 |
| 星标/精选链接 | 辅助回源线索 | 快照/作者宣称，不是采用/质量证据 |
| PR格式/链接/topic与去重 | 协助维护 | 新增行/有限HTTP/项目键/advisory，不验组件运行 |
| 独立示例目录 | 指向四个子包 | 各自manifest/版本，未并为根能力或验收 |

**流程与依赖**

读Markdown无需DSH；维护自动化和选中目标各有独立条件，不同于根运行依赖。表见[Q04](#research-q04)。

先定任务再分类筛少量候选，核repo+组件/版本/许可/入口后另验目标，失效回搜索。步骤见[Q04](#research-q04)。

**效果与成本**

浏览轻量不免除目标回源/误选/维护成本，按一次合格候选选择计量。完整表见[Q04](#research-q04)。

目录能提供组织与线索，不能从条目/星标推生产需求或可用供给。保留/否定条件见[Q05](#research-q05)。

> **思考**：近期/星数/精选/链接检查不是版本/运行证据，项目URL也不等组件身份；根无可安装入口和包版本。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把跨类型候选、简述和来源线索组织为可浏览入口；四子包独立，不归根运行能力。见[Q01](#research-q01)。

双语格式、从可信base处理PR数据和advisory新增重复可借鉴；健康/组件/验证状态需分层。见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

近期/星数/精选/链接检查不是版本/运行证据，项目URL也不等组件身份；根无可安装入口和包版本。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有限采用作候选发现资源，无需安装根或执行脚本，目标另行验收。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

新固定源码支持资源导航和维护机制，不提供根插件运行能力或目标质量认证；可用于有限候选发现。

- 已检查：作者 README、包清单、源码路径 .github/workflows/check-duplicates.yml、.github/workflows/star-history.yml、.github/workflows/validate-pr.yml、.scripts/annotate_stars.py、.scripts/dsh_recent_added.py、CONTRIBUTING.md、LICENSE、README.md、docs/official-picks.md、plugins/dsh-code-review/package.json、plugins/dsh-research-loop/package.json、plugins/dsh-slides/package.json、plugins/dsh-viz/package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根资源定位、分类/安装例子/精选宣称、贡献规范、近期/星注释脚本、PR新增校验/重复workflow和四子包manifest归属；未逐项验证大清单外链/原帖、用户统计/外部cron或示例实现/运行。统计含子包TS，不等根运行复杂度。
- 下一步：无既有研究基线；README超内嵌阈值但原件可读，与固定blob及准备digest核同。无执行目标/维护脚本/CI/示例；资源无需宿主运行，选型效果和目标验证独立保留。

**分析版本**

- **仓库**：[Dominic789654/awesome-deepseek-harness](https://github.com/Dominic789654/awesome-deepseek-harness)
- **版本号**：未声明（[固定提交 cbf73de](https://github.com/Dominic789654/awesome-deepseek-harness/tree/cbf73de1ed806ea30de820ea84b927438a9a3504)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

分层身份/版本/验证状态的选择收据，能否降低误选和总回源成本待对照。见[Q05](#research-q05)。

无既有研究基线；README超内嵌阈值但原件可读，与固定blob及准备digest核同。无执行目标/维护脚本/CI/示例；资源无需宿主运行，选型效果和目标验证独立保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 17914 | — | — | 551699 |
| .ts | source | 4 | 669 | 530 | 96 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/Dominic789654/awesome-deepseek-harness/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：资源目录怎样帮助选出身份/类型/版本可核候选，避免收录/星数替代能力证据？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 资源目录面向谁，什么才算有用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向要发现DSH扩展候选的用户和研究者。根自述是plugins、skills、MCP、profile、运行时和UI等分类清单，有双语、精选链接、近期和星标线索；合格结果是为具体任务找到少量身份/类型/版本可核的候选，不是浏览更多名字。

GitHub topic/search、按需求逐仓查找或较短专题目录是基线。该目录增加预先分类、简述和原始推荐线索，可能减少搜集；未比较找到真正合格候选的时间/误选率，不能从大条目数或星数证明质量、用户需求或生产插件空白。

真实entry_type是resource。根无package/宿主入口；plugins下四个示例各自有package/main和版本，不能把它们的工具、版本或运行结果并给根。根没有自身包版本，使用固定Git提交标识；无需把目录当插件安装。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-23](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/README.md#L15-L23)

根明确自述跨类型curated list。

```text

> A curated list of **plugins, skills, MCP servers, patch/profile layers, orchestrators, aggregators & UIs** for **DeepSeek Harness (DSH)** — DeepSeek's official agent runtime built around the idea **`Model + Harness = Agent`**.

**English** | [简体中文](./README.zh-CN.md)

DeepSeek Harness ("DSH") is DeepSeek's agent runtime / harness layer — the "hands" that turn the model's reasoning into real actions (context management, tool-call orchestration, execution sandbox, feedback loop, session persistence). Its defining feature is an **open plugin ecosystem**: the community contributes plugins, skills, MCP servers, orchestrators, aggregators, and UIs.

This list collects the best of that ecosystem. Contributions welcome — see [Contributing](#contributing).

```

**依据 2 · 源码核查**：[README.md:64-89](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/README.md#L64-L89)

分类目录导航。

<details>
<summary>查看原文（26行）</summary>

```text
## Contents

- [Official Picks](#official-picks)
- [Official](#official)
- [Profiles & Patch Layers](#profiles--patch-layers)
- [Harnesses & Runtimes](#harnesses--runtimes)
- [Security & Permissions](#security--permissions)
- [Session & Memory Management](#session--memory-management)
- [Cost & Usage Tracking](#cost--usage-tracking)
- [Channel / IM Bridges](#channel--im-bridges)
- [Plugin Marketplaces & Ecosystem](#plugin-marketplaces--ecosystem)
- [Visualization](#visualization)
- [Slides / PPT](#slides--ppt)
- [Documents & Export](#documents--export)
- [Coding](#coding)
- [Agents](#agents)
- [Loops (Auto-Research, Self-Improve, etc.)](#loops-auto-research-self-improve-etc)
- [MCP Servers](#mcp-servers)
- [Tools & Integrations](#tools--integrations)
- [Orchestrators & Aggregators](#orchestrators--aggregators)
- [UI / Clients](#ui--clients)
- [Skills](#skills)
- [Resources](#resources)
- [Contributing](#contributing)

---
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-code-review/package.json:1-14](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/plugins/dsh-code-review/package.json#L1-L14)

独立示例包身份/入口。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "dsh-code-review",
  "description": "Code review assistant for DeepSeek Harness: code_review_context collects deterministic git diff context; a bundled skill drives the review checklist.",
  "version": "0.1.0",
  "license": "MIT",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-research-loop/package.json:1-14](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/plugins/dsh-research-loop/package.json#L1-L14)

独立示例包身份/入口。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "dsh-research-loop",
  "description": "Auto-research loop for DeepSeek Harness: a durable research_log tool (append-only JSONL per topic) plus a skill that drives a plan → search → read → synthesize loop with explicit stop conditions.",
  "version": "0.1.0",
  "license": "MIT",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

**依据 5 · 源码核查**：[plugins/dsh-slides/package.json:1-14](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/plugins/dsh-slides/package.json#L1-L14)

独立示例包身份/入口。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "dsh-slides",
  "description": "Slide-deck generation for DeepSeek Harness: slides_generate turns a markdown outline into a self-contained reveal.js HTML deck in the active workspace.",
  "version": "0.1.0",
  "license": "MIT",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

**依据 6 · 源码核查**：[plugins/dsh-viz/package.json:1-14](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/plugins/dsh-viz/package.json#L1-L14)

独立示例包身份/入口。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "dsh-viz",
  "description": "Visualization tool for DeepSeek Harness: chart_render turns structured data into a self-contained ECharts HTML artifact inside the active workspace.",
  "version": "0.1.0",
  "license": "MIT",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

#### 缺口

- 缺具体选型任务的发现效率、误选和后续核验对照。
  **影响**：不能给相对搜索的净收益或供给缺口结论。
  **进一步探讨**：固定任务对照搜索/专题目录/本清单，记录找到可核候选和全部核验时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 双语、近期、星数与校验怎样维护？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

贡献流程要求两语言同改、用统一单行链接/描述，收录范围跨插件/skill/MCP等，文档另列topic/描述和排除标准。它描述编辑政策，不等所有现存目标已通过安装测试。

近期区块从git log最近若干天的README新增行生成，按显示名称前缀去重取前若干条，再写回两语言；描述修改、移动或星标更新也可产生新增行。因此“最近”是清单编辑历史，不自动等于新插件发布/最近兼容。星标注释脚本读家目录下快照，按阈值补badge；它不是逐条实时能力查询。自托管star-history工作流按日采本仓库星数，和条目星标/采用率是不同对象。

PR校验只抽新增列表行，检查格式/描述、部分HTTP状态和GitHub topic；topic读取失败只警告，链接也不是所有非2xx都拒绝。重复检查按语言/类别比较新增重复，GitHub键只取owner/repo、忽略子路径，且advisory继续执行，不能当全库组件去重证明。它使用可信base脚本、把PR当数据读取的方式可借鉴，但没有给目标组件运行验收。

四示例是独立子包，本轮只核manifest归属；维护脚本、CI和目录数据不等根拥有这些模型工具。

#### 证据与依据

**依据 1 · 源码核查**：[CONTRIBUTING.md:18-34](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/CONTRIBUTING.md#L18-L34)

双语与投稿格式/只增约定。

<details>
<summary>查看原文（17行）</summary>

````text

1. **Tag your repo** with the **`#dsh`** GitHub topic (DeepSeek's discovery convention).
2. Fork this repo and edit **both** `README.md` and `README.zh-CN.md` (keep the two in sync).
3. Add your entry under the most fitting category, using this exact format:

   ```
   - [Name](https://link) — Concise one-line description.
   ```

   (Chinese file uses ` —— ` as the separator.)

4. **Only add new lines — never modify or delete existing ones.**
   Your diff should be pure insertions. Add your entry as its own complete line;
   don't append it onto a neighbouring row or split an existing row in half.

   <details>
   <summary>The most common mistake (click to see what goes wrong)</summary>
````

</details>

**依据 2 · 源码核查**：[CONTRIBUTING.md:104-117](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/CONTRIBUTING.md#L104-L117)

范围/排除和作者校验主张。

<details>
<summary>查看原文（14行）</summary>

```text

## 收录标准与官方推荐专栏（Scope）

**收录（收）**：任何扩展或配合 DeepSeek Harness 的项目——plugin / skill / MCP server / orchestrator / aggregator / UI 客户端 / harness 运行时 / 自动化循环。仓库需带 `dsh` 相关 GitHub topic（`dsh` / `dsh-plugin` / `dsh-skill` / `deepseek-harness`），描述能说清用途。

**排除（不收）**：
1. 聚合/目录类（本身是"N 个插件的精选清单/插件超市"这种聚合站，而非单个插件或工具）；
2. 与 DSH 无关、疑似误标 topic 的仓库；
3. 完全无描述且无法从仓库名判断用途的可疑项；
4. 归档（archived）仓库。

**官方推荐专栏（Official Picks / 官方推荐）**：置顶专栏，只收录 **DeepSeek Harness 团队负责人 @tianyi 在 X 的【DSH 社区插件推荐】系列中公开推荐** 的插件。由自动化每日跟进（`scripts`/cron），保证最新在前、附推荐日期与原推链接。该专栏**不接受外部投稿**——想让自己项目进专栏，唯一途径是被官方推荐。

**校验**：所有条目链接会做存活检查；收录不代表安全审计，安装第三方插件等同在本机运行第三方代码，请自行阅读源码。
```

</details>

**依据 3 · 源码核查**：[.scripts/dsh_recent_added.py:14-29](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.scripts/dsh_recent_added.py#L14-L29)

按README新增行/显示名去重的近期算法。

<details>
<summary>查看原文（16行）</summary>

```text
def recent(days, limit):
    """Added README entry lines in the last N days (newest commits first)."""
    r = subprocess.run(["git", "log", f"--since={days} days ago", "--pretty=format:@@%H%x09%ad",
                        "--date=short", "-p", "--unified=0", "--", "README.md"],
                       cwd=REPO, text=True, capture_output=True)
    out, seen, commit = [], set(), None
    for line in r.stdout.splitlines():
        if line.startswith("@@"):
            commit = line[2:]
        elif ENTRY.match(line):
            entry = line[1:].strip()
            key = entry.split("](")[0]
            if key not in seen:
                seen.add(key)
                out.append((commit, entry))
    return out[:limit], len(out)
```

</details>

**依据 4 · 源码核查**：[.scripts/dsh_recent_added.py:32-55](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.scripts/dsh_recent_added.py#L32-L55)

改写两语言区块。

<details>
<summary>查看原文（24行）</summary>

```text
def rewrite(path, items, total, days):
    t = path.read_text(encoding="utf-8")
    if START not in t or END not in t:
        print(f"{path.name}: markers missing, skip"); return
    if "Recently added" in t:
        title, note = "🆕 Recently added (last %d days)" % days, "_auto-generated by `.scripts/dsh_recent_added.py`_"
    else:
        title, note = "🆕 最近新增（近 %d 天）" % days, "_由 `.scripts/dsh_recent_added.py` 自动生成_"
    body = "\n".join(i[1] for i in items)
    more = "" if total <= len(items) else f"\n\n_…and {total - len(items)} more this week._"
    block = f"{START}\n<details>\n<summary>{title}</summary>\n\n{note}\n\n{body}{more}\n\n</details>\n{END}"
    t = re.sub(re.escape(START) + r".*?" + re.escape(END), block, t, flags=re.S)
    path.write_text(t, encoding="utf-8")
    print(f"{path.name}: wrote {len(items)}/{total} entries")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=7)
    ap.add_argument("--limit", type=int, default=12)
    a = ap.parse_args()
    items, total = recent(a.days, a.limit)
    for f in ("README.md", "README.zh-CN.md"):
        rewrite(REPO / f, items, total, a.days)
```

</details>

**依据 5 · 源码核查**：[.scripts/annotate_stars.py:8-34](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.scripts/annotate_stars.py#L8-L34)

快照与阈值badge。

<details>
<summary>查看原文（27行）</summary>

```text
STARS_FILE = pathlib.Path.home() / "awesome-deepseek-harness" / ".stars-snapshot.tsv"
THRESHOLD = 10

# load stars: full_name -> stars
stars = {}
for line in STARS_FILE.read_text().splitlines():
    parts = line.split("\t")
    if len(parts) >= 2 and parts[1].isdigit():
        stars[parts[0].lower()] = int(parts[1])

badge_re = re.compile(r"\s*`?⭐[\d,]+`?")           # existing badge to strip
entry_re = re.compile(r"^(- \[)([^\]]+)(\]\()(https://github\.com/([A-Za-z0-9._-]+/[A-Za-z0-9._-]+))")

def process(path):
    p = pathlib.Path(path)
    out = []
    changed = 0
    for line in p.read_text().splitlines():
        m = entry_re.match(line)
        if m:
            repo = m.group(5).lower()
            st = stars.get(repo)
            # strip any existing badge first (idempotent)
            line = badge_re.sub("", line)
            if st is not None and st >= THRESHOLD:
                # append badge at end of the line
                line = line.rstrip() + f"  `⭐{st}`"
```

</details>

**依据 6 · 源码核查**：[.github/workflows/star-history.yml:25-40](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.github/workflows/star-history.yml#L25-L40)

本仓库采样/生成工作流。

<details>
<summary>查看原文（16行）</summary>

```text
    runs-on: ubuntu-latest
    # Never run on forks: it would try to push and would chart the wrong repo.
    if: github.repository == 'Dominic789654/awesome-deepseek-harness'
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Record today's star count and render chart
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: python3 .scripts/star_history.py

      - name: Commit if changed
        run: |
          set -euo pipefail
          if git diff --quiet -- assets/star-history.tsv assets/star-history.svg; then
```

</details>

**依据 7 · 源码核查**：[.github/workflows/validate-pr.yml:71-83](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.github/workflows/validate-pr.yml#L71-L83)

仅取新增行。

<details>
<summary>查看原文（13行）</summary>

```text
          # Collect added lines that look like list entries
          git diff --unified=0 "$BASE_SHA" pr-head -- README.md README.zh-CN.md \
            | grep -E '^\+' | grep -v -E '^\+\+\+' | sed 's/^+//' > /tmp/added.txt || true

          grep -E '^\s*-\s*\[' /tmp/added.txt > /tmp/entries.txt || true

          added_count=$(wc -l < /tmp/entries.txt | tr -d ' ')
          echo "Added entry lines: $added_count"

          if [ "$added_count" = "0" ]; then
            echo "No new list entries detected — nothing to validate."
            echo "result=noentries" >> "$GITHUB_OUTPUT"
            exit 0
```

</details>

**依据 8 · 源码核查**：[.github/workflows/validate-pr.yml:122-147](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.github/workflows/validate-pr.yml#L122-L147)

HTTP/topic的实际条件。

<details>
<summary>查看原文（26行）</summary>

```text
            # --- link reachable
            code=$(curl -sS -o /dev/null -w '%{http_code}' -L --max-time 25 \
                    -H 'User-Agent: dsh-list-bot' "$url" 2>/dev/null || echo 000)
            echo "HTTP $code for $url"
            if [ "$code" = "404" ] || [ "$code" = "410" ] || [ "$code" = "000" ]; then
              echo "::error::Link unreachable (HTTP $code): $url"
              echo "- ❌ **Link** — unreachable (HTTP \`$code\`): $url" >> /tmp/report.md
              fail=1
              echo "::endgroup::"
              continue
            fi

            # --- GitHub repo: check dsh topic
            if echo "$url" | grep -qE '^https?://github\.com/[^/]+/[^/]+/?$'; then
              slug=$(echo "$url" | sed -E 's#^https?://github\.com/##; s#/$##')
              topics=$(gh api "repos/$slug" --jq '.topics | join(",")' 2>/dev/null || echo "__ERR__")
              if [ "$topics" = "__ERR__" ]; then
                echo "::warning::Could not read topics for $slug"
                echo "- ⚠️ **Topic** — could not read topics for \`$slug\` (private/renamed?)" >> /tmp/report.md
              elif echo "$topics" | grep -qE '(^|,)(dsh|dsh-plugin|dsh-skill|deepseek-harness)(,|$)'; then
                echo "dsh topic OK ($topics)"
              else
                echo "::warning::No dsh topic on $slug (topics: $topics)"
                echo "- ⚠️ **Topic** — \`$slug\` has no \`dsh\` / \`deepseek-harness\` topic (found: \`${topics:-none}\`). Please add the \`dsh\` topic to your repo." >> /tmp/report.md
                fail=1
              fi
```

</details>

**依据 9 · 源码核查**：[.github/workflows/check-duplicates.yml:1-5](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.github/workflows/check-duplicates.yml#L1-L5)

重复检查范围/非gate声明。

```text
name: Check Duplicates

# Compare per-language, per-category URL counts against the PR merge base.
# Only increases in duplicate rows are reported; existing duplicates and
# cross-category listings are left alone. Findings are advisory, not a gate.
```

**依据 10 · 源码核查**：[.github/workflows/check-duplicates.yml:21-41](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.github/workflows/check-duplicates.yml#L21-L41)

advisory与可信base读取PR数据。

<details>
<summary>查看原文（21行）</summary>

```text
    continue-on-error: true
    if: github.repository == 'Dominic789654/awesome-deepseek-harness'
    steps:
      - name: Checkout trusted base only
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.base.sha }}
          fetch-depth: 0
          persist-credentials: false

      - name: Fetch PR data without checking it out
        env:
          PR_NUM: ${{ github.event.pull_request.number }}
          HEAD_SHA: ${{ github.event.pull_request.head.sha }}
        run: |
          set -euo pipefail
          git fetch --no-tags origin "pull/${PR_NUM}/head"
          # A newer push must not be reported as if it were this event's head.
          test "$(git rev-parse FETCH_HEAD)" = "$HEAD_SHA"
          base_sha="$(git merge-base HEAD "$HEAD_SHA")"
          echo "BASE_SHA=$base_sha" >> "$GITHUB_ENV"
```

</details>

**依据 11 · 源码核查**：[.github/workflows/check-duplicates.yml:62-76](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.github/workflows/check-duplicates.yml#L62-L76)

GitHub键忽略子路径。

<details>
<summary>查看原文（15行）</summary>

```text
          ENTRY = re.compile(r'^\s*-\s+\[[^\]]+\]\((https?://[^\s)]+)\)', re.I)

          def key_of(url):
              url = url.strip().rstrip('/')
              try:
                  parsed = urlsplit(url)
              except ValueError:
                  return url.lower()
              parts = parsed.path.strip('/').split('/')
              if parsed.hostname and parsed.hostname.lower() == 'github.com' and len(parts) >= 2:
                  # GitHub project identity ignores branch/subpath/query/fragment.
                  return '/'.join(parts[:2]).lower().removesuffix('.git')
              return url.lower()

          def index(text):
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些标签和入口不能当选型证据？

**研究主题**：缺陷与关键质疑

#### 完整回答

收录类型混有工具、skill、client、runtime和资源，跨类复列及同仓多组件不能仅靠URL/条目数还原。查重忽略子路径可能把不同组件视同项目，也保留跨类/已有重复；所以本轮不推独立可安装插件数、生态总量、质量比例或需求强度。

“Official Picks”和用户占比等来自目录作者的说明/链接，本轮未独立核原帖、统计样本或外部每日更新任务。它们可以作为回源线索，不是本轮认证。星数快照、链接能打开、topic存在也不证明安全、许可证、宿主兼容或任务收益。

Quick Start以github:owner/repo#main作通用例子，main可变；不是安装本根目录的入口，也不保证任意skill/MCP/子包都能同法安装。选中目标须核固定版本、真实组件路径/发布形态、依赖与实际权限。根CC0文本不把链接目标/子包的许可和能力自动统一。

贡献文档声称所有链接存活检查，已读CI却只覆盖PR新增行和有限状态，不形成全清单当前健康/运行收据。README过大未内嵌材料不是源件不可得：本轮直接读取固定blob并核digest；但只按分类、维护机制和边界抽读，不逐项验证所有链接或四示例执行。工程统计中的示例TS行数也不代表根的运行复杂度。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-23](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/README.md#L15-L23)

跨类型收集。

```text

> A curated list of **plugins, skills, MCP servers, patch/profile layers, orchestrators, aggregators & UIs** for **DeepSeek Harness (DSH)** — DeepSeek's official agent runtime built around the idea **`Model + Harness = Agent`**.

**English** | [简体中文](./README.zh-CN.md)

DeepSeek Harness ("DSH") is DeepSeek's agent runtime / harness layer — the "hands" that turn the model's reasoning into real actions (context management, tool-call orchestration, execution sandbox, feedback loop, session persistence). Its defining feature is an **open plugin ecosystem**: the community contributes plugins, skills, MCP servers, orchestrators, aggregators, and UIs.

This list collects the best of that ecosystem. Contributions welcome — see [Contributing](#contributing).

```

**依据 2 · 源码核查**：[README.md:52-62](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/README.md#L52-L62)

通用main安装例子。

<details>
<summary>查看原文（11行）</summary>

````text
## Quick Start

```bash
# Launch the DSH Web UI
npx @deepseek-ai/dsh web

# Install a community plugin (from this list) into your profile
dsh plugin --profile web add "github:owner/repo#main"
```

Before installing, confirm the target repo carries the **`#dsh`** GitHub topic so the community hub can index it.
````

</details>

**依据 3 · 作者声明**：[README.md:91-95](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/README.md#L91-L95)

精选为目录作者引述。

```text
## Official Picks

_Highlights personally recommended by **Tianyi Cui** ([@tianyi](https://x.com/tianyi)), DeepSeek Harness team lead, in his **【DSH 社区插件推荐】** series on X. Newest first; each entry links the original post. Kept in sync with [README.zh-CN.md](./README.zh-CN.md)._

- [oh-my-dsh/dsh-plugin-upgrade-skill](https://github.com/oh-my-dsh/dsh-plugin-upgrade-skill) — Upgrade skills for DSH plugin authors: 195 versioned upgrade cards (0.1.0-rc.8 → 0.2.0-rc.1) and 11 skills that list breaking changes, patch the plugin, test and publish — so Claude Code / Codex / Gemini can migrate an old plugin to a new DSH release, scored by a 63-task public benchmark.  `⭐287` · Team pick 2026-10-05 · [post](https://x.com/tianyi/status/2107030904233460208)
```

**依据 4 · 作者声明**：[docs/official-picks.md:1-4](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/docs/official-picks.md#L1-L4)

精选说明与原帖线索，不是本轮原帖验证。

```text
# Official Picks — DSH 官方推荐插件

> 由 **DeepSeek Harness 团队负责人 Tianyi Cui（[@tianyi](https://x.com/tianyi)）** 在其 X 的 **【DSH 社区插件推荐】** 系列中亲自推荐的插件。
> 本页与主清单 [README](../README.md) 顶部的 **Official Picks / 官方推荐** 专栏保持同步，最新在前。
```

**依据 5 · 作者声明**：[CONTRIBUTING.md:115-117](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/CONTRIBUTING.md#L115-L117)

每日精选/链接检查与非安全审计声明。

```text
**官方推荐专栏（Official Picks / 官方推荐）**：置顶专栏，只收录 **DeepSeek Harness 团队负责人 @tianyi 在 X 的【DSH 社区插件推荐】系列中公开推荐** 的插件。由自动化每日跟进（`scripts`/cron），保证最新在前、附推荐日期与原推链接。该专栏**不接受外部投稿**——想让自己项目进专栏，唯一途径是被官方推荐。

**校验**：所有条目链接会做存活检查；收录不代表安全审计，安装第三方插件等同在本机运行第三方代码，请自行阅读源码。
```

**依据 6 · 源码核查**：[.github/workflows/validate-pr.yml:71-83](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.github/workflows/validate-pr.yml#L71-L83)

新增行范围。

<details>
<summary>查看原文（13行）</summary>

```text
          # Collect added lines that look like list entries
          git diff --unified=0 "$BASE_SHA" pr-head -- README.md README.zh-CN.md \
            | grep -E '^\+' | grep -v -E '^\+\+\+' | sed 's/^+//' > /tmp/added.txt || true

          grep -E '^\s*-\s*\[' /tmp/added.txt > /tmp/entries.txt || true

          added_count=$(wc -l < /tmp/entries.txt | tr -d ' ')
          echo "Added entry lines: $added_count"

          if [ "$added_count" = "0" ]; then
            echo "No new list entries detected — nothing to validate."
            echo "result=noentries" >> "$GITHUB_OUTPUT"
            exit 0
```

</details>

**依据 7 · 源码核查**：[.github/workflows/validate-pr.yml:122-147](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.github/workflows/validate-pr.yml#L122-L147)

有限链接/topic门槛。

<details>
<summary>查看原文（26行）</summary>

```text
            # --- link reachable
            code=$(curl -sS -o /dev/null -w '%{http_code}' -L --max-time 25 \
                    -H 'User-Agent: dsh-list-bot' "$url" 2>/dev/null || echo 000)
            echo "HTTP $code for $url"
            if [ "$code" = "404" ] || [ "$code" = "410" ] || [ "$code" = "000" ]; then
              echo "::error::Link unreachable (HTTP $code): $url"
              echo "- ❌ **Link** — unreachable (HTTP \`$code\`): $url" >> /tmp/report.md
              fail=1
              echo "::endgroup::"
              continue
            fi

            # --- GitHub repo: check dsh topic
            if echo "$url" | grep -qE '^https?://github\.com/[^/]+/[^/]+/?$'; then
              slug=$(echo "$url" | sed -E 's#^https?://github\.com/##; s#/$##')
              topics=$(gh api "repos/$slug" --jq '.topics | join(",")' 2>/dev/null || echo "__ERR__")
              if [ "$topics" = "__ERR__" ]; then
                echo "::warning::Could not read topics for $slug"
                echo "- ⚠️ **Topic** — could not read topics for \`$slug\` (private/renamed?)" >> /tmp/report.md
              elif echo "$topics" | grep -qE '(^|,)(dsh|dsh-plugin|dsh-skill|deepseek-harness)(,|$)'; then
                echo "dsh topic OK ($topics)"
              else
                echo "::warning::No dsh topic on $slug (topics: $topics)"
                echo "- ⚠️ **Topic** — \`$slug\` has no \`dsh\` / \`deepseek-harness\` topic (found: \`${topics:-none}\`). Please add the \`dsh\` topic to your repo." >> /tmp/report.md
                fail=1
              fi
```

</details>

**依据 8 · 源码核查**：[LICENSE:1-3](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/LICENSE#L1-L3)

根CC0文本标识。

```text
CC0 1.0 Universal

Statement of Purpose
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 资源如何使用，条件/投入和效果怎样衡量？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 条件

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Markdown/Git浏览器与固定文本 | 读目录必需 | 分类/简述/引用导航 | 本地可读，不需DSH或模型运行 |
| 网络与目标仓库访问 | 回源时必需 | 核目标身份/版本/源码/发布 | 链接受阻就保留缺口，别自动安装替代 |
| Git/Python/快照/GitHub API与权限 | 维护脚本相应需要 | 近期/星标/CI | 普通读者无须运行；脚本存在不证部署成功 |
| 各目标自身依赖/许可/权限 | 选用目标时必需 | 确认真正可用 | 目录不代为验收，四示例独立处理 |
| 明确需求与核查清单 | 合格选型必需 | 避免被数量/星标驱动 | 不明确需求就不能判哪项更好 |

本根是无包版本resource，固定Git提交代表所读文本。四示例各自0.1.0不并成根版本；没有根插件安装/停止步骤。运行维护脚本可能写README、调API或触发工作流外部动作，本轮只静态读，没有运行脚本/CI、发消息或安装示例。

#### 步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定义 | 读者写任务、宿主/平台及必要约束 | 明确要完成什么，不按热门榜代决策 |
| 浏览 | 读者从分类/双语/近期找少量候选 | 区分plugin/skill/client/目录和同仓组件 |
| 回源 | 读者核repo+路径/固定SHA/许可/入口/依赖 | 描述与实际匹配；未知不补成肯定 |
| 比较 | 读者与原生/手动办法比较真实增量和负担 | 没有增量就保留原法，不因收录强行安装 |
| 验证 | 对所选具体目标另做隔离安装/任务/退出 | 目录本身没有证明此结果，失败退回搜索 |
| 维护 | 使用者保存选择理由与版本，升级再核 | 不把旧快照/精选变成永久认证 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Markdown/网络，本身不启动模型 | 明确任务、理解分类与类型 | 内容大，找到合格项时间未知 |
| 持续使用 | 回源流量/目标验证环境；维护者API资源 | 去重、版本/兼容/许可跟进 | 星标/近期不免除核验，无净节时数据 |
| 失败恢复 | 无效候选重查、已安装目标的独立恢复 | 找对组件/版本、纠误推荐 | 目录浏览可退出，目标副作用不能归零 |
| 升级退出 | 固定文本/选择记录保留 | 清理失效理由、回topic搜索 | 根无运行状态，目标各自清理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 分类发现 | 双语目录和一行简述/线索 | 相对搜索的合格候选效率 |
| 新近线索 | README编辑历史生成区块 | 对应目标发布/兼容是否新 |
| 辅助信号 | 星快照、精选原帖链接 | 真实采用、权威/质量或任务收益 |
| 维护约束 | 新增行格式/部分链接/topic与advisory去重 | 全清单健康、组件身份与可安装性 |

按“一次找到身份/版本/条件可核的候选”计全部回源/误选时间，不按条目数和星数计价值。根浏览负担轻，不代表目标安装/使用免费或安全。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-23](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/README.md#L15-L23)

资源导航定位。

```text

> A curated list of **plugins, skills, MCP servers, patch/profile layers, orchestrators, aggregators & UIs** for **DeepSeek Harness (DSH)** — DeepSeek's official agent runtime built around the idea **`Model + Harness = Agent`**.

**English** | [简体中文](./README.zh-CN.md)

DeepSeek Harness ("DSH") is DeepSeek's agent runtime / harness layer — the "hands" that turn the model's reasoning into real actions (context management, tool-call orchestration, execution sandbox, feedback loop, session persistence). Its defining feature is an **open plugin ecosystem**: the community contributes plugins, skills, MCP servers, orchestrators, aggregators, and UIs.

This list collects the best of that ecosystem. Contributions welcome — see [Contributing](#contributing).

```

**依据 2 · 源码核查**：[README.md:64-89](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/README.md#L64-L89)

分类入口。

<details>
<summary>查看原文（26行）</summary>

```text
## Contents

- [Official Picks](#official-picks)
- [Official](#official)
- [Profiles & Patch Layers](#profiles--patch-layers)
- [Harnesses & Runtimes](#harnesses--runtimes)
- [Security & Permissions](#security--permissions)
- [Session & Memory Management](#session--memory-management)
- [Cost & Usage Tracking](#cost--usage-tracking)
- [Channel / IM Bridges](#channel--im-bridges)
- [Plugin Marketplaces & Ecosystem](#plugin-marketplaces--ecosystem)
- [Visualization](#visualization)
- [Slides / PPT](#slides--ppt)
- [Documents & Export](#documents--export)
- [Coding](#coding)
- [Agents](#agents)
- [Loops (Auto-Research, Self-Improve, etc.)](#loops-auto-research-self-improve-etc)
- [MCP Servers](#mcp-servers)
- [Tools & Integrations](#tools--integrations)
- [Orchestrators & Aggregators](#orchestrators--aggregators)
- [UI / Clients](#ui--clients)
- [Skills](#skills)
- [Resources](#resources)
- [Contributing](#contributing)

---
```

</details>

**依据 3 · 源码核查**：[.scripts/dsh_recent_added.py:14-29](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.scripts/dsh_recent_added.py#L14-L29)

维护Git/Python输入。

<details>
<summary>查看原文（16行）</summary>

```text
def recent(days, limit):
    """Added README entry lines in the last N days (newest commits first)."""
    r = subprocess.run(["git", "log", f"--since={days} days ago", "--pretty=format:@@%H%x09%ad",
                        "--date=short", "-p", "--unified=0", "--", "README.md"],
                       cwd=REPO, text=True, capture_output=True)
    out, seen, commit = [], set(), None
    for line in r.stdout.splitlines():
        if line.startswith("@@"):
            commit = line[2:]
        elif ENTRY.match(line):
            entry = line[1:].strip()
            key = entry.split("](")[0]
            if key not in seen:
                seen.add(key)
                out.append((commit, entry))
    return out[:limit], len(out)
```

</details>

**依据 4 · 源码核查**：[.scripts/annotate_stars.py:8-16](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.scripts/annotate_stars.py#L8-L16)

快照依赖。

```text
STARS_FILE = pathlib.Path.home() / "awesome-deepseek-harness" / ".stars-snapshot.tsv"
THRESHOLD = 10

# load stars: full_name -> stars
stars = {}
for line in STARS_FILE.read_text().splitlines():
    parts = line.split("\t")
    if len(parts) >= 2 and parts[1].isdigit():
        stars[parts[0].lower()] = int(parts[1])
```

**依据 5 · 源码核查**：[.github/workflows/validate-pr.yml:122-147](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.github/workflows/validate-pr.yml#L122-L147)

网络/API依赖及边界。

<details>
<summary>查看原文（26行）</summary>

```text
            # --- link reachable
            code=$(curl -sS -o /dev/null -w '%{http_code}' -L --max-time 25 \
                    -H 'User-Agent: dsh-list-bot' "$url" 2>/dev/null || echo 000)
            echo "HTTP $code for $url"
            if [ "$code" = "404" ] || [ "$code" = "410" ] || [ "$code" = "000" ]; then
              echo "::error::Link unreachable (HTTP $code): $url"
              echo "- ❌ **Link** — unreachable (HTTP \`$code\`): $url" >> /tmp/report.md
              fail=1
              echo "::endgroup::"
              continue
            fi

            # --- GitHub repo: check dsh topic
            if echo "$url" | grep -qE '^https?://github\.com/[^/]+/[^/]+/?$'; then
              slug=$(echo "$url" | sed -E 's#^https?://github\.com/##; s#/$##')
              topics=$(gh api "repos/$slug" --jq '.topics | join(",")' 2>/dev/null || echo "__ERR__")
              if [ "$topics" = "__ERR__" ]; then
                echo "::warning::Could not read topics for $slug"
                echo "- ⚠️ **Topic** — could not read topics for \`$slug\` (private/renamed?)" >> /tmp/report.md
              elif echo "$topics" | grep -qE '(^|,)(dsh|dsh-plugin|dsh-skill|deepseek-harness)(,|$)'; then
                echo "dsh topic OK ($topics)"
              else
                echo "::warning::No dsh topic on $slug (topics: $topics)"
                echo "- ⚠️ **Topic** — \`$slug\` has no \`dsh\` / \`deepseek-harness\` topic (found: \`${topics:-none}\`). Please add the \`dsh\` topic to your repo." >> /tmp/report.md
                fail=1
              fi
```

</details>

**依据 6 · 源码核查**：[plugins/dsh-code-review/package.json:1-14](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/plugins/dsh-code-review/package.json#L1-L14)

子包独立版本/入口示例。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "dsh-code-review",
  "description": "Code review assistant for DeepSeek Harness: code_review_context collects deterministic git diff context; a bundled skill drives the review checklist.",
  "version": "0.1.0",
  "license": "MIT",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

#### 缺口

- 缺固定选型任务的候选合格率、总回源/误选和维护成本。
  **影响**：不能量化净发现价值或有效创新供给。
  **进一步探讨**：匿名选型任务比较搜索/现目录/带状态目录，计找到合格候选和全部时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可采用到哪一步，未来方向怎样证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可将其有限采用为候选发现资源：先读分类与线索，再回目标原件；无需安装根或执行脚本。比逐仓搜索多了组织入口，但不代替固定组件/版本和任务验收。遇失效链接、类型/版本不明或宣传与源码冲突，停止把条目当推荐，保存缺口退回目标仓库/专题搜索。

可借鉴双语单行格式、只读取PR数据的维护校验和新增重复提示。生产方向是带身份/版本/验证状态的选择收据：repo+component明确，星/收录/原帖与独立安装/任务/退出证据分层；标最后检查时间、兼容范围、未验项及反例，失败显式保留，不用一个评分替代事实。

对照GitHub搜索、当前目录和候选方案，以同仓多包、类型不同、main变化、链接非2xx、topic不可读和过期精选等选型任务测试。量找到合格候选的时间、误选/误信和维护负担；若标签增多但选择不更快、错误不降或维护成本超收益，否定优势。尚未验证，不把现有星标/精选当成该收据。

#### 证据与依据

**依据 1 · 源码核查**：[.github/workflows/check-duplicates.yml:24-41](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.github/workflows/check-duplicates.yml#L24-L41)

可信base读PR数据。

<details>
<summary>查看原文（18行）</summary>

```text
      - name: Checkout trusted base only
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.base.sha }}
          fetch-depth: 0
          persist-credentials: false

      - name: Fetch PR data without checking it out
        env:
          PR_NUM: ${{ github.event.pull_request.number }}
          HEAD_SHA: ${{ github.event.pull_request.head.sha }}
        run: |
          set -euo pipefail
          git fetch --no-tags origin "pull/${PR_NUM}/head"
          # A newer push must not be reported as if it were this event's head.
          test "$(git rev-parse FETCH_HEAD)" = "$HEAD_SHA"
          base_sha="$(git merge-base HEAD "$HEAD_SHA")"
          echo "BASE_SHA=$base_sha" >> "$GITHUB_ENV"
```

</details>

**依据 2 · 源码核查**：[.github/workflows/check-duplicates.yml:62-76](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.github/workflows/check-duplicates.yml#L62-L76)

当前项目键缺component区分。

<details>
<summary>查看原文（15行）</summary>

```text
          ENTRY = re.compile(r'^\s*-\s+\[[^\]]+\]\((https?://[^\s)]+)\)', re.I)

          def key_of(url):
              url = url.strip().rstrip('/')
              try:
                  parsed = urlsplit(url)
              except ValueError:
                  return url.lower()
              parts = parsed.path.strip('/').split('/')
              if parsed.hostname and parsed.hostname.lower() == 'github.com' and len(parts) >= 2:
                  # GitHub project identity ignores branch/subpath/query/fragment.
                  return '/'.join(parts[:2]).lower().removesuffix('.git')
              return url.lower()

          def index(text):
```

</details>

**依据 3 · 源码核查**：[.github/workflows/validate-pr.yml:122-147](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.github/workflows/validate-pr.yml#L122-L147)

当前健康信号的边界。

<details>
<summary>查看原文（26行）</summary>

```text
            # --- link reachable
            code=$(curl -sS -o /dev/null -w '%{http_code}' -L --max-time 25 \
                    -H 'User-Agent: dsh-list-bot' "$url" 2>/dev/null || echo 000)
            echo "HTTP $code for $url"
            if [ "$code" = "404" ] || [ "$code" = "410" ] || [ "$code" = "000" ]; then
              echo "::error::Link unreachable (HTTP $code): $url"
              echo "- ❌ **Link** — unreachable (HTTP \`$code\`): $url" >> /tmp/report.md
              fail=1
              echo "::endgroup::"
              continue
            fi

            # --- GitHub repo: check dsh topic
            if echo "$url" | grep -qE '^https?://github\.com/[^/]+/[^/]+/?$'; then
              slug=$(echo "$url" | sed -E 's#^https?://github\.com/##; s#/$##')
              topics=$(gh api "repos/$slug" --jq '.topics | join(",")' 2>/dev/null || echo "__ERR__")
              if [ "$topics" = "__ERR__" ]; then
                echo "::warning::Could not read topics for $slug"
                echo "- ⚠️ **Topic** — could not read topics for \`$slug\` (private/renamed?)" >> /tmp/report.md
              elif echo "$topics" | grep -qE '(^|,)(dsh|dsh-plugin|dsh-skill|deepseek-harness)(,|$)'; then
                echo "dsh topic OK ($topics)"
              else
                echo "::warning::No dsh topic on $slug (topics: $topics)"
                echo "- ⚠️ **Topic** — \`$slug\` has no \`dsh\` / \`deepseek-harness\` topic (found: \`${topics:-none}\`). Please add the \`dsh\` topic to your repo." >> /tmp/report.md
                fail=1
              fi
```

</details>

**依据 4 · 源码核查**：[.scripts/dsh_recent_added.py:14-29](https://github.com/Dominic789654/awesome-deepseek-harness/blob/cbf73de1ed806ea30de820ea84b927438a9a3504/.scripts/dsh_recent_added.py#L14-L29)

近期语义的当前基线。

<details>
<summary>查看原文（16行）</summary>

```text
def recent(days, limit):
    """Added README entry lines in the last N days (newest commits first)."""
    r = subprocess.run(["git", "log", f"--since={days} days ago", "--pretty=format:@@%H%x09%ad",
                        "--date=short", "-p", "--unified=0", "--", "README.md"],
                       cwd=REPO, text=True, capture_output=True)
    out, seen, commit = [], set(), None
    for line in r.stdout.splitlines():
        if line.startswith("@@"):
            commit = line[2:]
        elif ENTRY.match(line):
            entry = line[1:].strip()
            key = entry.split("](")[0]
            if key not in seen:
                seen.add(key)
                out.append((commit, entry))
    return out[:limit], len(out)
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
