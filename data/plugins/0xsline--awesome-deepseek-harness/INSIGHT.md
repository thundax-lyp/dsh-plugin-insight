# Awesome DeepSeek Harness

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[cd4faf9](https://github.com/0xsline/awesome-deepseek-harness/tree/cd4faf97da814f06fab4a5e307e5ba0f62c638af)

<!-- BEGIN META -->
[![GitHub ★ 1,260](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C260&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0xsline/awesome-deepseek-harness)
<!-- END META -->

> **功能**：按场景分类整理 DSH 插件、工具和基础设施，并提供生成的仓库目录。

> **亮点**：以双语场景分类与人工补充降低公开topic发现的筛选负担；不提供条目安装或可靠性认证。[Q01](#research-q01)

> **主要限制**：topic最多1000条、私有hub需权限、CATALOG日期较旧，不能把全量标题作为当前完整覆盖证明。[Q02](#research-q02)

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
  - [Q01 · 这是可安装插件还是发现资源，具体帮助谁？](#detail-section-11)
  - [Q02 · 完整目录如何生成，覆盖和新鲜度受到什么限制？](#detail-section-12)
  - [Q03 · 读者怎样低负担使用，同时避免把目录当安装保证？](#detail-section-13)
  - [Q04 · 如何让“完整索引”变成可审覆盖声明？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：帮助DSH用户按任务发现候选仓库；本身是目录资源，不是可安装插件。[Q01](#research-q01)

GitHub topic直接搜索或手工收藏；目录增量是组织和补充，不等于原创工具或已研究全生态。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 分类目录 | 发现候选仓库 | 不是运行注册的DSH能力 |
| 生成索引 | 汇总多来源 | 分页和权限约束，不保证全量 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 浏览器/网络 | 阅读必需 | 查看目录与目标仓库 | 使用固定本地快照 |
| Python与GitHub访问 | 生成才需 | 合并来源 | 保留失败信息 |
| HUB_TOKEN权限 | 私有hub生成才需 | 读取hub | 不能声称覆盖私有源 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 发现 | 读者选择任务分类 | 得到少量候选 |
| 核对 | 读者打开固定目标版本 | 能核能力、bundle与许可证 |
| 决策 | 读者单独评估 | 未核实则保留候选不安装 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 浏览网络；金额未知 | 按场景筛选和核对目标仓库 | 无需部署目录 |
| 持续使用 | 浏览或生成资源 | 同步双语、检查过时描述 | 时间未知 |
| 失败恢复 | 上游权限与重新抓取 | 识别截断并保留原目录 | 不把失败当不存在 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 场景导航 | 双语分类和链接 | 用户实际筛选节时 |
| 扩展发现 | hub、topic与人工补充 | 全量与实时覆盖 |
| 安装指导 | bundle声明和重启提示 | 各条目兼容安全 |

> **思考**：topic最多1000条、私有hub需权限、CATALOG日期较旧，不能把全量标题作为当前完整覆盖证明。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以双语场景分类与人工补充降低公开topic发现的筛选负担；不提供条目安装或可靠性认证。[Q01](#research-q01)

精选与生成索引分层值得借鉴；分页、权限和日期需要作为产物状态，不能靠目录数量自证覆盖。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

topic最多1000条、私有hub需权限、CATALOG日期较旧，不能把全量标题作为当前完整覆盖证明。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议作为发现资源试用：按场景挑少量候选后固定目标版本核查；不可访问或过时条目退回原仓库及公开搜索，不批量安装。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

目录与生成机制可核对；全量、实时覆盖和条目可安装性没有得到证明。覆盖报告为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、CATALOG.md、contributing.md、scripts/generate-catalog.py、.github/workflows/sync-catalog.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定README、贡献说明、目录、生成器和CI；未执行抓取及全部目标仓库验收；Python不属于JS/TS LOC口径。
- 下一步：使用截断和权限失败的固定输入核对覆盖声明，另选小样本检验描述与目标版本一致性。[Q04](#research-q04)

**分析版本**

- **仓库**：[0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness)
- **版本号**：未声明（[固定提交 cd4faf9](https://github.com/0xsline/awesome-deepseek-harness/tree/cd4faf97da814f06fab4a5e307e5ba0f62c638af)）
- **版本日期**：2026-10-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是逐来源展示固定版本、分页截断与失败范围，帮助读者区别未收录与未能检查。[Q04](#research-q04)

使用截断和权限失败的固定输入核对覆盖声明，另选小样本检验描述与目标版本一致性。[Q04](#research-q04)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 4053 | — | — | 121440 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/0xsline/awesome-deepseek-harness/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/0xsline/awesome-deepseek-harness/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/0xsline/awesome-deepseek-harness/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：该生态目录的发现价值、生成覆盖和采用边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是可安装插件还是发现资源，具体帮助谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是人工分类README与生成CATALOG组成的生态目录，未声明可安装bundle。目标是找候选插件、工具或基础设施的DSH用户；合格结果是获得可追溯仓库链接后继续核对真实能力与安装条件。与直接搜GitHub topic相比，它增加双语任务分类和人工补充；与逐项研究相比，它只有一行描述，不提供可靠性或采用验收。贡献是整理发现路径，不是条目所指项目的能力，也不能把“curated”读作已运行或安全认证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-32](https://github.com/0xsline/awesome-deepseek-harness/blob/cd4faf97da814f06fab4a5e307e5ba0f62c638af/README.md#L25-L32)

目录明确包含插件、工具和基础设施。

```text
<br>

<p align="center">
 <b>Curated DeepSeek Harness (DSH) ecosystem: plugins, tools &amp; infrastructure. Sources: dsh-external/hub catalog and the public GitHub dsh-plugin topic.</b><br>
</p>

<br>
> Note: the GitHub [`dsh-plugin` topic](https://github.com/topics/dsh-plugin) is public; some `dsh-external` repository links may still require org access.
```

**依据 2 · 源码核查**：[contributing.md:3-15](https://github.com/0xsline/awesome-deepseek-harness/blob/cd4faf97da814f06fab4a5e307e5ba0f62c638af/contributing.md#L3-L15)

人工精选和一行描述要求明确。

<details>
<summary>查看原文（13行）</summary>

```text
Thanks for considering a contribution! This list is a **hand-curated selection** — the full index lives in [dsh-external/hub](https://github.com/dsh-external/hub) (`catalog.json`, CI-generated).

For public discovery, also check GitHub's [`dsh-plugin` topic](https://github.com/topics/dsh-plugin). `CATALOG.md` includes topic repositories that are not already present in the hub catalog.

## Entry standard

Every entry must be:

1. **A real repository** under the ecosystem (dsh-external org or a member project) — no dead links, no placeholders.
2. **A one-line description** — what it does, not marketing. Keep it factual and terse.
3. **A link** to the repository.

No fluff: no badges per entry, no screenshots inside entries, no long blurbs.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 完整目录如何生成，覆盖和新鲜度受到什么限制？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

生成器合并hub与公开topic，再加人工EXTRA_TOPIC_REPOS，按URL去重。topic查询固定最多10页，每页100；源代码注释也承认1000结果上限，人工补充并不能证明覆盖上限之外全部仓库。CATALOG页自称全量但生成日为2026-08-28，固定提交README却含后续编辑，两者不能视作同一实时快照。CI只有workflow_dispatch，依赖HUB_TOKEN读取私有hub，不是每日自动更新。可借鉴是精选与机器索引分层；移植需处理权限、重复、来源完整性和生成日期，不能只复制“全量”标题。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/generate-catalog.py:12-29](https://github.com/0xsline/awesome-deepseek-harness/blob/cd4faf97da814f06fab4a5e307e5ba0f62c638af/scripts/generate-catalog.py#L12-L29)

topic最多10页以及URL去重。

<details>
<summary>查看原文（18行）</summary>

```text
def fetch_topic_repos(token=None):
    """Fetch public repositories tagged with GitHub's dsh-plugin topic."""
    repos = []
    for page in range(1, 11):
        data = fetch(
            f"https://api.github.com/search/repositories?q=topic%3Adsh-plugin&per_page=100&page={page}",
            token,
        )
        items = data.get("items", [])
        repos.extend(items)
        if not items or len(repos) >= data.get("total_count", len(repos)):
            break
    unique = {}
    for repo in repos:
        key = (repo.get("html_url") or repo.get("full_name") or "").rstrip("/").lower()
        if key:
            unique[key] = repo
    return list(unique.values())
```

</details>

**依据 2 · 源码核查**：[scripts/generate-catalog.py:47-53](https://github.com/0xsline/awesome-deepseek-harness/blob/cd4faf97da814f06fab4a5e307e5ba0f62c638af/scripts/generate-catalog.py#L47-L53)

手工补充承认API上限。

```text
# ===== Curated additions: repos missing from the dsh-plugin topic search =====
# (no topic, or beyond the search API's 1000-result cap). They flow into the 🌐
# section so they stay discoverable in CATALOG.md and the site store.
EXTRA_TOPIC_REPOS = [
    {"full_name": "yauntyour/DSH-Multimodal", "name": "DSH-Multimodal",
     "html_url": "https://github.com/yauntyour/DSH-Multimodal",
     "description": "DSH 多模态输入插件：按文件类型（图片/视频/音频）配置独立处理模型链，文件先转成 Prompt Tokens 再交给纯文本会话模型"},
```

**依据 3 · 源码核查**：[CATALOG.md:1-4](https://github.com/0xsline/awesome-deepseek-harness/blob/cd4faf97da814f06fab4a5e307e5ba0f62c638af/CATALOG.md#L1-L4)

产物日期和全量表述。

```text
# 完整目录（自动生成）

> 汇集 [dsh-external/hub](https://github.com/dsh-external/hub) 的 `catalog.json` 与 GitHub 公开 [dsh-plugin Topic](https://github.com/topics/dsh-plugin) 的全量生态索引 · 生成于 2026-08-28
> 精选列表见 [README](README.md)；本页为公开生态全量索引（271 hub 仓库 + 1000 公开 topic 仓库 + 471 手动补充）
```

**依据 4 · 源码核查**：[.github/workflows/sync-catalog.yml:1-20](https://github.com/0xsline/awesome-deepseek-harness/blob/cd4faf97da814f06fab4a5e307e5ba0f62c638af/.github/workflows/sync-catalog.yml#L1-L20)

手动触发及hub token依赖。

<details>
<summary>查看原文（20行）</summary>

```text
name: sync-catalog

on:
  workflow_dispatch:

permissions:
  contents: write

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Fetch hub catalog and generate CATALOG.md
        env:
          HUB_TOKEN: ${{ secrets.HUB_TOKEN }}
        run: |
          python3 scripts/generate-catalog.py "$HUB_TOKEN"
```

</details>

#### 缺口

- 本轮未证明生成目录覆盖截至日全部公开仓库或私有hub。
  **影响**：不可据其数量断言全生态规模和缺项。
  **进一步探讨**：比较固定上游快照、API分页和生成结果，显式报告截断与失败。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 读者怎样低负担使用，同时避免把目录当安装保证？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

读者可按场景挑少量候选，再进入目标仓库确认bundle声明、版本、许可证及依赖；目录安装段已说明普通依赖不会自动变为profile层，安装后需重启。只是浏览无需账号或本地部署；私有仓库访问、核查和未来实际安装需额外权限与时间，不能当目录已验证。维护者需手工同步中英文并复核失效条目；生成失败应保留原目录和错误，不把未访问等同不存在。建议把它用作发现入口，遇到私有不可读、过时安装说明或无法确认版本时，停止采用该条目并回原仓库/公开搜索。现金与核查耗时未知，不能把收录数当节省量。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:65-83](https://github.com/0xsline/awesome-deepseek-harness/blob/cd4faf97da814f06fab4a5e307e5ba0f62c638af/README.md#L65-L83)

安装说明明确bundle声明与重启。

<details>
<summary>查看原文（19行）</summary>

````text
npx @deepseek-ai/dsh web
```

Install an external profile bundle with pnpm on your `PATH`:

```sh
dsh plugin --profile web add "github:owner/repo#ref"
```

`dsh plugin` forwards package operations to pnpm, so npm, Git/GitHub, local path, `file:` and `link:` package specs are supported. Only packages declaring `dsh.bundle.patch` become active profile layers; plain dependencies remain installed but inactive. Restart `dsh --profile web` after installing or updating a bundle.

The former `&path:` sub-path and Repository Plugin installation forms are not part of the current official bundle flow; use an installable package that declares `dsh.bundle.patch`.

Management panel: Settings → Plugins.

## Core & Bundles

- [DeepSeek Harness Ultimate](https://github.com/18126295767-cell/deepseek-harness-ultimate) - Community-maintained reproducible profile installer: deduplicated defaults across coding, workflow, reliability and productivity; full commit-SHA pins, permissive-license audit, pre/post dependency checks, optional sensitive integrations, and beginner guides in 20 languages for Windows, macOS and Linux.
- [dsh-deepresearch](https://github.com/dsh-external/dsh-deepresearch) - DeepResearch plugin (cordis).
````

</details>

**依据 2 · 源码核查**：[contributing.md:45-58](https://github.com/0xsline/awesome-deepseek-harness/blob/cd4faf97da814f06fab4a5e307e5ba0f62c638af/contributing.md#L45-L58)

双语同步、手工维护与私有hub权限条件。

<details>
<summary>查看原文（14行）</summary>

```text
Both language versions should be updated in the same PR — same entry, translated description.

## Process

1. Fork the repository.
2. Add your entry to the correct list(s) — alphabetical order is not required, but keep entries grouped.
3. Open a PR with a concise title (`docs: add <repo>`). No need to run tests — markdown only.

## Maintenance notes

- The curated list is maintained by hand; new entries are reviewed for usefulness, not exhaustiveness.
- Removed/archived repositories should be dropped from both language versions.
- The `dsh-external` org has been private since Aug 2026 — links require org access; the catalog sync CI depends on the `HUB_TOKEN` secret having access.
- The full machine-readable index is generated by [hub](https://github.com/dsh-external/hub) — this list never duplicates the whole catalog, only the curated highlights.
```

</details>

#### 缺口

- 各条目目标仓库的可安装性与描述准确性未逐项验收。
  **影响**：只能推荐目录发现用途，不能推荐全目录安装。
  **进一步探讨**：按具体任务选候选，再固定目标版本单独研究。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何让“完整索引”变成可审覆盖声明？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是生成时为hub、topic和手工补充分别保存抓取时间、固定来源、分页上限及失败范围，标题随覆盖状态显示已覆盖或截断，而不笼统写全量。推导来自Q02的1000上限与产物旧日期；其增量是帮助读者区分没收录和没能检查。最小验证固定一个超过分页上限且含私有不可访问项的输入，比较原生成器与覆盖报告原型。原型应把截断与权限失败显式列出且不制造已检查结论；若仍把缺项显示为不存在，或维护成本超过读者判断改善，则否定。这里未声称有新市场需求或已实现生产机制。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/generate-catalog.py:12-29](https://github.com/0xsline/awesome-deepseek-harness/blob/cd4faf97da814f06fab4a5e307e5ba0f62c638af/scripts/generate-catalog.py#L12-L29)

固定分页数量构成覆盖报告动因。

<details>
<summary>查看原文（18行）</summary>

```text
def fetch_topic_repos(token=None):
    """Fetch public repositories tagged with GitHub's dsh-plugin topic."""
    repos = []
    for page in range(1, 11):
        data = fetch(
            f"https://api.github.com/search/repositories?q=topic%3Adsh-plugin&per_page=100&page={page}",
            token,
        )
        items = data.get("items", [])
        repos.extend(items)
        if not items or len(repos) >= data.get("total_count", len(repos)):
            break
    unique = {}
    for repo in repos:
        key = (repo.get("html_url") or repo.get("full_name") or "").rstrip("/").lower()
        if key:
            unique[key] = repo
    return list(unique.values())
```

</details>

**依据 2 · 源码核查**：[CATALOG.md:1-4](https://github.com/0xsline/awesome-deepseek-harness/blob/cd4faf97da814f06fab4a5e307e5ba0f62c638af/CATALOG.md#L1-L4)

全量标签缺少覆盖边界。

```text
# 完整目录（自动生成）

> 汇集 [dsh-external/hub](https://github.com/dsh-external/hub) 的 `catalog.json` 与 GitHub 公开 [dsh-plugin Topic](https://github.com/topics/dsh-plugin) 的全量生态索引 · 生成于 2026-08-28
> 精选列表见 [README](README.md)；本页为公开生态全量索引（271 hub 仓库 + 1000 公开 topic 仓库 + 471 手动补充）
```

#### 缺口

- 覆盖声明能否改变读者错误选择尚无对照。
  **影响**：只能提出设计假设。
  **进一步探讨**：比较读者对未收录和不可访问项目的判断准确性及核查时间。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
