# Awesome DSH Plugin

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[3b44fe8](https://github.com/Alex-Yanggg/awesome-DSH-plugin/tree/3b44fe8ffddbf19ccebd459829e5a8ae2cbb0fa6)

<!-- BEGIN META -->
[![GitHub ★ 104](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=104&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alex-Yanggg/awesome-DSH-plugin)
<!-- END META -->

> **功能**：以双语元数据整理跨场景插件候选

> **亮点**：[Q01](#research-q01) 统一双语目录及可复查元数据。

> **主要限制**：[Q03](#research-q03) 收录状态需回到实际包核验。

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
  - [Q01 · 目录帮助谁？](#detail-section-11)
  - [Q02 · 如何维护？](#detail-section-12)
  - [Q03 · 哪些状态不能当成验收？](#detail-section-13)
  - [Q04 · 采用和退出成本？](#detail-section-14)
  - [Q05 · 怎样检验价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户按用途寻找 DSH 插件。

GitHub 自由搜索。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| GitHub 自由搜索。 | 可直接比较 | 保留人工步骤 |
| Awesome DSH Plugin | 统一双语目录及可复查元数据。 | 收录状态需回到实际包核验。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | JSON 分类和验证生成目录。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户按用途寻找 DSH 插件。 | 保留原流程 |
| 试验 | JSON 分类和验证生成目录。 | 观察固定版本 |
| 复核 | 固定提交抽样核对来源和双语。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 按用途定位可独立核查的插件来源 | 可缩短发现候选时间。 | 固定提交抽样核对来源和双语。 |

> **思考**：[Q03](#research-q03) 收录状态需回到实际包核验。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 统一双语目录及可复查元数据。

有结构及重复字段检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 收录状态需回到实际包核验。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 固定提交抽样核对来源和双语。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的按用途定位可独立核查的插件来源。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、scripts/generate_readmes.py、catalog/schema.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的按用途定位可独立核查的插件来源。未执行目标代码或实际宿主验证。
- 下一步：保留人工判定表。

**分析版本**

- **仓库**：[Alex-Yanggg/awesome-DSH-plugin](https://github.com/Alex-Yanggg/awesome-DSH-plugin)
- **版本号**：未声明（[固定提交 3b44fe8](https://github.com/Alex-Yanggg/awesome-DSH-plugin/tree/3b44fe8ffddbf19ccebd459829e5a8ae2cbb0fa6)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可缩短发现候选时间。

保留人工判定表。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 546 | — | — | 6402 |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/Alex-Yanggg/awesome-DSH-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Alex-Yanggg/awesome-DSH-plugin/issues?q=is%3Aissue+created%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Alex-Yanggg/awesome-DSH-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：按用途定位可独立核查的插件来源

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目录帮助谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

初次选插件的用户可先按用途浏览，再到来源检查。相对自由搜索，目录提供统一分类和双语说明。验收应抽样确认同一名称和来源在两种语言中一致。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:6-10](https://github.com/Alex-Yanggg/awesome-DSH-plugin/blob/3b44fe8ffddbf19ccebd459829e5a8ae2cbb0fa6/README.md#L6-L10)

作者说明跨场景社区目录

```text
> A community-curated, vendor-neutral catalog of plugins for DeepSeek Harness (DSH) — from developer tooling and data workflows to media, operations, and everyday life.

**Language:** English | [简体中文](docs/README.zh-CN.md)

DeepSeek Harness plugins can connect an agent to tools, services, devices, and repeatable workflows. This list is intentionally broad: if it gives an agent a useful real-world capability, it belongs here.
```

**依据 2 · 源码核查**：[scripts/generate_readmes.py:49-58](https://github.com/Alex-Yanggg/awesome-DSH-plugin/blob/3b44fe8ffddbf19ccebd459829e5a8ae2cbb0fa6/scripts/generate_readmes.py#L49-L58)

双语字段必填

<details>
<summary>查看原文（10行）</summary>

```text
def require_localized(value: Any, label: str) -> dict[str, str]:
    if not isinstance(value, dict):
        fail(f"{label} must be an object with en and zh-CN text.")
    result: dict[str, str] = {}
    for language in LANGUAGES:
        text = value.get(language)
        if not isinstance(text, str) or not text.strip():
            fail(f"{label}.{language} must be a non-empty string.")
        result[language] = text.strip()
    return result
```

</details>

#### 缺口

- 收录范围未独立对照。
  **影响**：降低候选整理成本。
  **进一步探讨**：对照同任务搜索结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何维护？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

JSON 为分类和条目输入，生成器检查类别 ID、双语文本和重复名。中文页面由指定生成目标维护。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/generate_readmes.py:16-23](https://github.com/Alex-Yanggg/awesome-DSH-plugin/blob/3b44fe8ffddbf19ccebd459829e5a8ae2cbb0fa6/scripts/generate_readmes.py#L16-L23)

输入、输出和状态枚举

```text
ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "catalog" / "plugins.json"
MARKERS = ("<!-- CATALOG:START -->", "<!-- CATALOG:END -->")
LANGUAGES = ("en", "zh-CN")
PAGES = {"zh-CN": ROOT / "docs" / "README.zh-CN.md"}
SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
STATUSES = {"active", "beta", "archived"}
SOURCES = {"official", "community"}
```

**依据 2 · 源码核查**：[scripts/generate_readmes.py:61-90](https://github.com/Alex-Yanggg/awesome-DSH-plugin/blob/3b44fe8ffddbf19ccebd459829e5a8ae2cbb0fa6/scripts/generate_readmes.py#L61-L90)

类别和条目验证

<details>
<summary>查看原文（30行）</summary>

```text
def validate(catalog: dict[str, Any]) -> tuple[list[dict[str, Any]], dict[str, list[dict[str, Any]]]]:
    categories: list[dict[str, Any]] = []
    category_ids: set[str] = set()
    for index, category in enumerate(catalog["categories"], start=1):
        label = f"categories[{index}]"
        if not isinstance(category, dict):
            fail(f"{label} must be an object.")
        category_id = category.get("id")
        if not isinstance(category_id, str) or not SLUG_PATTERN.fullmatch(category_id):
            fail(f"{label}.id must be a lowercase kebab-case string.")
        if category_id in category_ids:
            fail(f"Duplicate category id: {category_id}")
        category_ids.add(category_id)
        categories.append({"id": category_id, "title": require_localized(category.get("title"), f"{label}.title")})

    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    names: set[str] = set()
    urls: set[str] = set()
    for index, plugin in enumerate(catalog["plugins"], start=1):
        label = f"plugins[{index}]"
        if not isinstance(plugin, dict):
            fail(f"{label} must be an object.")
        name = plugin.get("name")
        url = plugin.get("url")
        category = plugin.get("category")
        if not isinstance(name, str) or not name.strip():
            fail(f"{label}.name must be a non-empty string.")
        if name.casefold() in names:
            fail(f"Duplicate plugin name: {name}")
        names.add(name.casefold())
```

</details>

#### 缺口

- 英文与中文具体同步范围需核对。
  **影响**：便于结构化消费。
  **进一步探讨**：按固定提交对账。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些状态不能当成验收？

**研究主题**：缺陷与关键质疑

#### 完整回答

schema 中 active、beta、archived 是有限字段，来源 official/community 也是元数据。结构验证无法证明工具可装、可运行或授权真实。

#### 证据与依据

**依据 1 · 源码核查**：[catalog/schema.json:18-30](https://github.com/Alex-Yanggg/awesome-DSH-plugin/blob/3b44fe8ffddbf19ccebd459829e5a8ae2cbb0fa6/catalog/schema.json#L18-L30)

条目结构与状态枚举

<details>
<summary>查看原文（13行）</summary>

```text
    "plugins": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "url", "category", "description"],
        "properties": {
          "name": { "type": "string", "minLength": 1 },
          "url": { "type": "string", "format": "uri" },
          "category": { "type": "string" },
          "description": { "$ref": "#/$defs/localizedText" },
          "status": { "enum": ["active", "beta", "archived"] },
          "source": { "type": "string", "enum": ["official", "community"] }
        }
```

</details>

#### 缺口

- 目标包运行未验。
  **影响**：需要回源审查。
  **进一步探讨**：挑一条过期候选核查。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用和退出成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

浏览固定 README 或读取 JSON 即可，无需向 DSH 安装目录。主要成本是时效和来源核对，退出移除索引依赖并保留研究来源。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/generate_readmes.py:16-23](https://github.com/Alex-Yanggg/awesome-DSH-plugin/blob/3b44fe8ffddbf19ccebd459829e5a8ae2cbb0fa6/scripts/generate_readmes.py#L16-L23)

本地 JSON 与页面输入输出

```text
ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "catalog" / "plugins.json"
MARKERS = ("<!-- CATALOG:START -->", "<!-- CATALOG:END -->")
LANGUAGES = ("en", "zh-CN")
PAGES = {"zh-CN": ROOT / "docs" / "README.zh-CN.md"}
SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
STATUSES = {"active", "beta", "archived"}
SOURCES = {"official", "community"}
```

**依据 2 · 作者声明**：[README.md:6-10](https://github.com/Alex-Yanggg/awesome-DSH-plugin/blob/3b44fe8ffddbf19ccebd459829e5a8ae2cbb0fa6/README.md#L6-L10)

目录定位

```text
> A community-curated, vendor-neutral catalog of plugins for DeepSeek Harness (DSH) — from developer tooling and data workflows to media, operations, and everyday life.

**Language:** English | [简体中文](docs/README.zh-CN.md)

DeepSeek Harness plugins can connect an agent to tools, services, devices, and repeatable workflows. This list is intentionally broad: if it gives an agent a useful real-world capability, it belongs here.
```

#### 缺口

- 上游覆盖和更新延迟未知。
  **影响**：不适合作唯一发现源。
  **进一步探讨**：记录提交与候选日期。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样检验价值？

**研究主题**：新假设与验证

#### 完整回答

同需求比较自由搜索和分类查找，记录命中率、来源失效和时间。若双语不一致或目标无法定位，则当前索引需补核。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/generate_readmes.py:49-58](https://github.com/Alex-Yanggg/awesome-DSH-plugin/blob/3b44fe8ffddbf19ccebd459829e5a8ae2cbb0fa6/scripts/generate_readmes.py#L49-L58)

双语一致结构可验

<details>
<summary>查看原文（10行）</summary>

```text
def require_localized(value: Any, label: str) -> dict[str, str]:
    if not isinstance(value, dict):
        fail(f"{label} must be an object with en and zh-CN text.")
    result: dict[str, str] = {}
    for language in LANGUAGES:
        text = value.get(language)
        if not isinstance(text, str) or not text.strip():
            fail(f"{label}.{language} must be a non-empty string.")
        result[language] = text.strip()
    return result
```

</details>

**依据 2 · 源码核查**：[catalog/schema.json:22-29](https://github.com/Alex-Yanggg/awesome-DSH-plugin/blob/3b44fe8ffddbf19ccebd459829e5a8ae2cbb0fa6/catalog/schema.json#L22-L29)

来源字段可比对

```text
        "required": ["name", "url", "category", "description"],
        "properties": {
          "name": { "type": "string", "minLength": 1 },
          "url": { "type": "string", "format": "uri" },
          "category": { "type": "string" },
          "description": { "$ref": "#/$defs/localizedText" },
          "status": { "enum": ["active", "beta", "archived"] },
          "source": { "type": "string", "enum": ["official", "community"] }
```

#### 缺口

- 尚无对照数据。
  **影响**：发现便利可与软件质量分开计量。
  **进一步探讨**：保留人工判定表。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
