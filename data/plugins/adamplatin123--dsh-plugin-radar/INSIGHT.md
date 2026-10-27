# DSH Plugin Radar

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[aeb605e](https://github.com/AdamPlatin123/dsh-plugin-radar/tree/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac)

<!-- BEGIN META -->
[![GitHub ★ 1,484](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C484&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AdamPlatin123/dsh-plugin-radar)
<!-- END META -->

> **实现功能**：收集DSH插件候选、归并兼容性记录，提供分类目录、静态JSON和可浏览站点。

> **核心亮点**：[Q02](#research-q02)识别的贡献是以canonical统一事实源替代Markdown反向解析，在身份归并和冲突政策后从最终输出行派生统计。相比手工社区清单，发现消费者得到可缓存分类与状态数据；内部一致性提高不证明运行判定正确，测试引擎仍属私有边界。

> **风险与缺陷**：[Q03](#research-q03)指出最影响价值的是逐条状态无法普遍回指插件commit、宿主、环境与日志。项目明确披露这一限制，聚合器计数相等或成功退出不能认证当前兼容。适合发现，不能把历史可用当自动安装门槛。

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
  - [Q01 · 这是可安装插件还是候选发现资源？](#detail-section-11)
  - [Q02 · 公开聚合器怎样避免目录与统计各说各话？](#detail-section-12)
  - [Q03 · 公开源码足以重做运行级判定吗？](#detail-section-13)
  - [Q04 · 浏览、接数据和自建管线分别需要付出什么？](#detail-section-14)
  - [Q05 · 逐条最小证据接口是否比更多目录条目更有价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：这是目录、兼容性记录聚合器和静态数据服务，不是给DSH新增运行能力的可安装插件。适合需要从大量候选中初筛、维护社区目录或接入插件市场的读者和开发者。合格结果是得到有明确出处与数据日期的候选，再回上游检查安装、权限、当前版本及退出，不是凭“可用”状态跳过验收。

手工检索GitHub topic与社区列表，逐项读上游。比较对象是候选发现和复查成本，不比较未经独立验收的全生态兼容率或安全性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 分类目录与站点 | 初筛插件候选 | 历史状态需核对当前版本 |
| 静态JSON | 下游缓存候选与状态 | 无需密钥，需校验和显示日期 |
| canonical聚合 | 统一身份、冲突及导出 | 规则归并不是重新执行 |
| 公开引擎脚本 | 研究发现、聚合、渲染及分发 | 不含完整私有运行验证器 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| GitHub托管与浏览器 | 浏览需要 | 目录/站点/JSON | 可用上次缓存并显示日期 |
| 固定提交及JSON校验 | 一致消费需要 | 同时读取统计明细 | 不仅凭快照号判断一致 |
| bash/Python/GitHub权限 | 自建需要 | 发现、聚合、分发 | 需维护者配置，不能当即插即用插件 |
| 私有生产验证器 | 复现完整运行需要 | 产出运行测试和快照 | 缺件WARN/跳过，不代表本轮新证据 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 消费方先确认用途仅发现 | 不以状态自动放行安装 |
| 2 | 固定完整提交读取状态及明细并校验 | 逐档对账后替换缓存 |
| 3 | 读者选定候选回原仓查版本和权限 | 证据匹配再安排自己的试用 |
| 4 | 刷新失败继续旧缓存并显示日期 | 长期陈旧则停消费，回上游目录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次浏览/接入 | 网络与缓存；金额未知 | 理解状态、选择字段与来源 | 静态接口无需密钥，不代表生产免费 |
| 持续消费 | 条件请求及缓存存储 | 检查数据日期、版本与来源 | 刷新失败保留成功缓存 |
| 失败恢复 | 镜像或重试资源 | 回原仓核查，停止把状态用于放行 | 逐条测试原件不完整公开 |
| 自建引擎 | 服务器、GitHub及可选模型/私有测试资源 | 配置bash/Python、定时任务和权限 | 完整验证器未公开，费用/耗时未知 |
| 退出 | 可删除本地缓存 | 停刷新，回上游目录 | 不撤销消费方另做的安装 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 目录归并 | 身份/冲突政策与统一导出 | 各原件测试正确性 |
| 统计一致性 | 从最终rows计四档 | 不等于当前可安装数量 |
| 下游消费 | 静态接口和缓存策略 | 真实筛选节时、采用率 |
| 运行复现 | 公开发现/聚合部分 | 私有测试引擎和逐条版本日志 |

> **思考**：[Q03](#research-q03)指出最影响价值的是逐条状态无法普遍回指插件commit、宿主、环境与日志。项目明确披露这一限制，聚合器计数相等或成功退出不能认证当前兼容。适合发现，不能把历史可用当自动安装门槛。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)识别的贡献是以canonical统一事实源替代Markdown反向解析，在身份归并和冲突政策后从最终输出行派生统计。相比手工社区清单，发现消费者得到可缓存分类与状态数据；内部一致性提高不证明运行判定正确，测试引擎仍属私有边界。

[Q02](#research-q02)识别的贡献是以canonical统一事实源替代Markdown反向解析，在身份归并和冲突政策后从最终输出行派生统计。相比手工社区清单，发现消费者得到可缓存分类与状态数据；内部一致性提高不证明运行判定正确，测试引擎仍属私有边界。

build_canonical把快照、历史基线、仓库映射和社区登记汇到canonical，再由渲染/导出消费。已有快照新到旧装载，以(name,url)保留先见记录，随后按真实仓库定位与改名身份再归并；这比从生成Markdown反向解析减少了展示格式对事实的影响。

merge_entry对确定的可用/不兼容冲突降为待定，较弱状态与确定运行状态冲突时保留确定结论；这种仲裁是聚合政策，不是重新执行。它也能让较旧确定结论覆盖较新待定，使用者须看版本和条件而不能将最新快照编号当每条最新测试。新登记且无覆盖的条目以未测补入，不把登记当可用。

导出先按定位状态过滤并再次去重，然后从最终rows计算四档统计，最后原子写canonical。这是具体可借鉴工程增量：统计从实际输出派生、监测状态与清单计数分开。它能约束内部一致性，却不证明上游测试结果正确。移植需要明确身份映射、冲突政策、保留历史与消费者schema，不能只搬一个数字汇总脚本。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)指出最影响价值的是逐条状态无法普遍回指插件commit、宿主、环境与日志。项目明确披露这一限制，聚合器计数相等或成功退出不能认证当前兼容。适合发现，不能把历史可用当自动安装门槛。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)建议目录维护者先作为只读发现数据试用，固定完整提交读取并校验，缓存失败保留旧版本日期。逐条版本或日志不匹配就回上游复查，不据历史状态自动安装；自建全量测试不属于公开仓已经可兑现的采用用途。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

公开源码可解释聚合与一致性机制；运行级验证器及逐条版本原件不完整公开，作者生产记录不等于本轮独立验证。

- 已检查：作者 README、包清单、源码路径 README.md、engine/README.md、engine/aggregation/build_canonical.py、engine/ops/private/MANIFEST.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：研究公开聚合源码和文档，不review上游data目录，不独立确认数量、逐条判定或私有生产运行，不执行引擎、测试、部署或安装候选。
- 下一步：后续固定候选样本，比较手工目录与雷达数据的证据定位时间、误读历史状态次数和复查通过情况；不复用作者绿色记录冒充本轮执行。

**分析版本**

- **仓库**：[AdamPlatin123/dsh-plugin-radar](https://github.com/AdamPlatin123/dsh-plugin-radar)
- **版本号**：未声明（[固定提交 aeb605e](https://github.com/AdamPlatin123/dsh-plugin-radar/tree/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)推导未验证的逐条最小证据接口。按实际生产者保存版本/环境/结果/日志元组，缺项不进入本条件已测试筛选；用20个候选对照误判、定位时间和保全成本，不优于发现清单则停止。它尚未实现，也不是已确认插件商业机会。

后续固定候选样本，比较手工目录与雷达数据的证据定位时间、误读历史状态次数和复查通过情况；不复用作者绿色记录冒充本轮执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 51 | 29850 | — | — | 556343 |
| .mjs | source | 1 | 102 | 84 | 16 | — |
| .ts | source | 10 | 377 | 328 | 18 | — |
| .mjs | test | 2 | 92 | 83 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/AdamPlatin123/dsh-plugin-radar/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=10&color=737b86&logo=github)](https://github.com/AdamPlatin123/dsh-plugin-radar/issues?q=is%3Aissue+created%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z) [![近30天关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/AdamPlatin123/dsh-plugin-radar/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：公开雷达的聚合机制能支持什么发现用途，运行兼容性证据能核查到哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是可安装插件还是候选发现资源？

**研究主题**：场景与需求、采用判断

#### 完整回答

这是目录、兼容性记录聚合器和静态数据服务，不是给DSH新增运行能力的可安装插件。适合需要从大量候选中初筛、维护社区目录或接入插件市场的读者和开发者。合格结果是得到有明确出处与数据日期的候选，再回上游检查安装、权限、当前版本及退出，不是凭“可用”状态跳过验收。

简单替代是手工浏览GitHub topic、社区列表和上游README。雷达提供归并状态、分类入口及可被下游缓存的JSON，减少逐列表手工聚合；但README明确指出逐条被测commit、版本、时间及日志尚未完整公开。首页数量是作者当前文档中的历史快照声明，本轮没有逐条独立验证，不当作当前可安装数量或活跃采用人数。

因此适用任务限定为发现和安排复查。需要最新宿主版本保证、完整功能或安全验收的用户，不能把该聚合资源作为最终放行依据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-26](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/README.md#L9-L26)

项目定位为发现、记录和数据接入。

<details>
<summary>查看原文（18行）</summary>

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
| 理解或维护雷达 | [公开引擎](https://github.com/AdamPlatin123/dsh-plugin-radar/tree/main/engine)与[架构说明](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/main/docs/radar/architecture.md) |
```

</details>

**依据 2 · 作者声明**：[README.md:46-59](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/README.md#L46-L59)

公开状态的使用边界及逐条证据缺口。

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

- 逐条状态对目标插件和当前宿主的实际适用性未验证
  **影响**：不能把候选筛选信号解释为安装成功保证
  **进一步探讨**：选定具体插件后固定其commit、宿主和任务，回原仓与运行日志复查

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 公开聚合器怎样避免目录与统计各说各话？

**研究主题**：功能与机制、工程质量与复用、贡献与相对优势

#### 完整回答

build_canonical把快照、历史基线、仓库映射和社区登记汇到canonical，再由渲染/导出消费。已有快照新到旧装载，以(name,url)保留先见记录，随后按真实仓库定位与改名身份再归并；这比从生成Markdown反向解析减少了展示格式对事实的影响。

merge_entry对确定的可用/不兼容冲突降为待定，较弱状态与确定运行状态冲突时保留确定结论；这种仲裁是聚合政策，不是重新执行。它也能让较旧确定结论覆盖较新待定，使用者须看版本和条件而不能将最新快照编号当每条最新测试。新登记且无覆盖的条目以未测补入，不把登记当可用。

导出先按定位状态过滤并再次去重，然后从最终rows计算四档统计，最后原子写canonical。这是具体可借鉴工程增量：统计从实际输出派生、监测状态与清单计数分开。它能约束内部一致性，却不证明上游测试结果正确。移植需要明确身份映射、冲突政策、保留历史与消费者schema，不能只搬一个数字汇总脚本。

#### 证据与依据

**依据 1 · 源码核查**：[engine/aggregation/build_canonical.py:1-15](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/engine/aggregation/build_canonical.py#L1-L15)

canonical与渲染/导出职责分离。

<details>
<summary>查看原文（15行）</summary>

```text
#!/usr/bin/env python3
"""build_canonical.py — 统一聚合器：全部数据源 → generated/current/canonical.json。

P1 数据层收敛：原先埋在 scripts/gen_plugins_all.py main() 的数据半场（快照装载 /
canonical 归并 / 定位复核 / 登记兜底 / 改名跟随 / desc 回填重分类 / 统计）整体上移至此，
渲染半场在 engine/rendering/render_all.py，导出半场在 scripts/export-data.py——
三者共享 canonical.json 这一个事实源，Markdown 不再被反向解析。

快照装载（ADR-0002 落地）：基线 ⊕ 30 天窗口。data/snapshot-baseline.json 承载窗口外
全部历史轮的 (name,url) 合并条目与轮次元信息；无基线文件时自动回退全量扫描（与旧管线
行为一致，保证基线生成前后产物逐字节等价）。装载 IO 从 567 文件降为窗口数。

验收铁律：canonical ⊕ render_all 的 PLUGINS-ALL.md / catalog/all/*.md 与旧管线逐字节
一致；export-data 从 canonical 直出的 latest.json / plugins-all.json 与旧正则解析
逐字段一致（generated_at 除外）。
```

</details>

**依据 2 · 源码核查**：[engine/aggregation/build_canonical.py:69-105](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/engine/aggregation/build_canonical.py#L69-L105)

新旧快照与基线装载。

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

**依据 3 · 源码核查**：[engine/aggregation/build_canonical.py:108-158](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/engine/aggregation/build_canonical.py#L108-L158)

身份主键和冲突仲裁，解释状态并非单纯最新覆盖。

<details>
<summary>查看原文（51行）</summary>

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


def _ok_desc(d):
    d = (d or '').strip()
    return bool(d) and d != '—' and not d.startswith('http')


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
    return out
```

</details>

**依据 4 · 源码核查**：[engine/aggregation/build_canonical.py:297-309](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/engine/aggregation/build_canonical.py#L297-L309)

登记无覆盖项补为未测。

<details>
<summary>查看原文（13行）</summary>

```text
            if full in have:
                continue
            dom, _hit = classify(name, desc)
            fe = {'name': name or full.split('/')[1], 'url': f"https://github.com/{full}",
                  'star': live_star.get(full), 'verdict': '⏳ 未测',
                  'domain': dom, 'desc': desc or '—', 'locate': 'located'}
            if url_audit.get(full, {}).get('status') == 'gone':
                fe['locate'] = 'empty_watch'
                n_floor_gone += 1
            else:
                n_floor += 1
            entries.append(fe)
            have.add(full)
```

</details>

**依据 5 · 源码核查**：[engine/aggregation/build_canonical.py:402-453](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/engine/aggregation/build_canonical.py#L402-L453)

最终rows派生统计并原子写出。

<details>
<summary>查看原文（52行）</summary>

```text
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
    export_stats = {
        'ok': row_counts.get('ok', 0),
        'incompatible': row_counts.get('incompatible', 0),
        'pending': row_counts.get('pending', 0),
        'untested': row_counts.get('untested', 0),
        'gone': n_empty,
        'ambiguous': n_amb,
        'unlocated': n_unresolved,
    }

    doc = {
        'schema': 'radar-canonical/v1',
        'generated_at': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        'loader': {'files_read': n_files, 'window_days': WINDOW_DAYS,
                   'baseline_used': bool(BASELINE.is_file())},
        'rounds': rounds,
        'snapshot_run_id': rounds[0][0] if rounds else None,
        'entries': entries,
        'counts': {'total': len(entries), 'dedup': n_dedup, 'conflict': n_conflict,
                   'locate_fixed': n_fix, 'empty_watch': n_empty, 'ambiguous_watch': n_amb,
                   'unresolved': n_unresolved, 'live_star': n_star,
                   'floor_added': n_floor, 'floor_gone': n_floor_gone,
                   'rename_followed': n_rename, 'desc_backfilled': n_desc, 'reclassed': n_reclass,
                   'pr_registered': len(pr_names)},
        'stats_located': dict(vc), 'stats_all': dict(v_all), 'pr_names': sorted(pr_names),
        'domain_stats': {dom: {'total': sum(1 for e in entries if e.get('domain') == dom),
                               'ok': vc_local(entries, dom, '✅ 运行级可用'),
                               'bad': vc_local(entries, dom, '❌ 运行级不兼容'),
                               'inc': vc_local(entries, dom, '⚠️ 待定'),
                               'un': vc_local(entries, dom, '⏳ 未测'),
                               'watch': sum(1 for e in entries if e.get('domain') == dom
                                            and e.get('locate') != 'located')}
                         for dom in DOMAIN_ORDER},
        'global': {'un': vc.get('⏳ 未测', 0), 'located': sum(vc.values()), 'all': len(entries)},
        'export': {'rows': export_rows, 'stats': export_stats,
                   'anchor_run_id': rounds[0][0] if rounds else None},
    }
    atomic_write_json(OUT, doc)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 公开源码足以重做运行级判定吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不足。README和engine说明明确把生产运行级测试引擎列为未开源部分；私有件清单还列出快照生成、agent测试聚合和服务器驱动等接口。公开代码可以研究发现、聚合、渲染与分发的部分机制，不能据此独立重做一插件一pod的运行级验证，或确认所有失败环境与当前DSH一致。

最影响价值的质疑不是清单是否能浏览，而是下游能否把某条“可用”追到适用的插件commit、宿主、环境和原始结果。项目自己承认扁平清单没有完整逐条证据，全局指针不能补这个缺口。一个聚合器运行成功、计数相等、历史存在绿色结论，都不等于当前插件可完成目标任务。

私有件在缺失时WARN或跳过，某些分发分支exit 0；这允许公开副本继续其他步骤，却也意味着进程成功退出不能证明本轮已经产生新运行证据。本轮没有访问私有环境或运行作者脚本，所有生产效果与持续运转描述保持作者声明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:57-59](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/README.md#L57-L59)

逐条证据限制是作者明示。

```text
公开扁平清单尚未为每条记录提供完整的插件 commit、被测版本、时间与日志。全局版本指针不能替代这些逐条证据，历史“可用”记录也不能解释为已在最新 DSH 版本下验证。

先阅读插件原仓库的安装、权限与卸载说明，在测试环境完成最小功能验证并保留回滚路径。运行级判定不等同于完整功能、性能或安全审计。
```

**依据 2 · 作者声明**：[README.md:114-116](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/README.md#L114-L116)

测试引擎未公开，复现依赖生产侧。

```text
发现、聚合、渲染与分发引擎已公开。生产运行级测试引擎尚未开源，完整测试复现仍依赖生产侧能力。

当前两仓分工：[组织管线仓](https://github.com/Zhidao-Lab-OSS/awesome-dsh-plugins)生产快照，[本仓](https://github.com/AdamPlatin123/dsh-plugin-radar)承载社区登记、公开引擎、数据镜像与站点。
```

**依据 3 · 作者声明**：[engine/README.md:44-48](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/engine/README.md#L44-L48)

公开域与第三阶段验证器边界。

```text
## 诚实边界

- **第三阶段（k8s 运行级验证器）未含在本目录**：一插件一 pod 的隔离测试引擎、L0–L3 分层判定、`input_hash` 增量重测属于第三阶段，稳定后开源轻量版与服务器版。
- 脚本为服务器生产形态（bash + python 混合、经 dirname 相对路径互调；`./scripts/*.sh` 扁平引用已清零）；包化 CLI（`dsh-radar discover/scan/report`）在路线图上。
- 私有件（`~/dsh-k8s`）全部引用点带在场守卫：缺件显式 WARN 安全降级，开源副本可运行到「仅缺私有件功能」。
```

**依据 4 · 作者声明**：[engine/ops/private/MANIFEST.md:8-18](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/engine/ops/private/MANIFEST.md#L8-L18)

缺私有件的跳过/降级契约，成功退出不等于完成测试。

<details>
<summary>查看原文（11行）</summary>

```text
| 私有件 | 引用点 | 契约（输入 → 输出） | 缺失时行为 |
|---|---|---|---|
| `radar-index-request.py` | `engine/discovery/cron-check.sh`（worker 门禁） | `--reason --trigger` → 入队一条索引请求 | WARN 后按「已入队」退出（开源副本手动直跑走 `RADAR_INDEX_WORKER=1`） |
| `gen-snapshot-v2.py` | `engine/distribution/auto-snapshot-push.sh`（①生成快照） | 无参 → `$SNAP_DIR/data/snapshots/<run_id>.json`（radar-snapshot/2） | WARN 后本轮跳过（exit 0，不推） |
| `aggregate-agent-test.py` | `engine/distribution/deliver-all.sh`、`bot-deliver.sh` | 读 `.rt-agent/` 流式结果 → `reports/<日期>/agent-test.md` | WARN 后跳过聚合；deliver-all 继续提交已有结果 |
| `bot-deliver.sh`（服务器版） | `engine/distribution/deliver-all.sh`、`deliver-chain.sh` | 读当日报告 → 双仓 bot PR | WARN 后跳过 bot 交付 |
| `finish-rerun.sh` | `engine/distribution/deliver-chain.sh`（仅 pgrep 等待） | 自聚合+推个人仓 | pgrep 无进程即自然通过，无需守卫 |
| `radar-bot-token.sh` | `engine/distribution/cadence.py:135`（bot-app 令牌装载） | 无参 → stdout 令牌 | try/except 已兜底（空令牌→个人 gh 凭据路径） |
| `pipeline-driver.py` / `cadence-loop.sh` / `metrics-loop.sh` | `engine/ops/radar-watchdog.sh`（活性拉起） | 常驻驱动/交付/指标循环 | 启动自检逐件 WARN；拉起命令对缺失文件自然失败且日志可见 |
| `readme-render-watch.sh` | `engine/ops/radar-probe.sh:11`（探测目标） | 渲染链观察器 | 探测 down 分支已有，无阻断 |
| `state/`（pipeline-state.json 等） | `engine/ops/dashboard.py`（面板数据） | 私有引擎状态目录 | dashboard 按缺文件降级显示 |
```

</details>

#### 缺口

- 逐条测试原件和完整运行验证器不可由公开仓得到
  **影响**：不能以source深度报告认证所有兼容性记录
  **进一步探讨**：维护者为抽样条目给出被测commit、宿主/环境和日志，消费者核对适用条件

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 浏览、接数据和自建管线分别需要付出什么？

**研究主题**：效果与总成本、依赖、兼容与流程

#### 完整回答

直接浏览已生成目录通常只需网络和人工筛选，静态接口不要求密钥；这是消费已有资源的用途，不等同承担生产测试成本。持续接入要缓存成功数据、设置超时和有限重试，刷新失败继续显示上次成功日期；跨文件一致性要固定同一完整Git提交并逐档对账，而不能只看快照号。

自建公开引擎成本明显不同。engine说明生产形态依赖bash/Python、GitHub权限、可选模型端点、定时运行和私有目录；缺件只能降级，不会自动变成完整测试服务。首次需读懂目录与政策、配置身份/来源；持续需维护API限制、状态冲突和上游版本；失败要回查来源和前一成功缓存。没有金额、工作量和耗时记录，不把目录免费浏览推导为整条生产管线低成本。

消费方可以删除本地缓存、停刷新并回到上游目录，这是可行且较轻的退出。若已用聚合状态驱动自动安装，则需另外撤销这层信任与安装副作用；本报告不建议这种用途。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:120-148](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/README.md#L120-L148)

静态接口、缓存、失败回退与同commit读取。

<details>
<summary>查看原文（29行）</summary>

````text
## 接入生态数据

公开静态 JSON 接口无需密钥；建议下游缓存使用，接口可用性受 GitHub 托管平台影响。

- [数据状态：快照指针与统计](https://raw.githubusercontent.com/AdamPlatin123/dsh-plugin-radar/main/data/latest.json)
- [插件明细：仓库、判定、星标与描述](https://raw.githubusercontent.com/AdamPlatin123/dsh-plugin-radar/main/data/plugins-all.json)

持续接入时，建议：

- **统一缓存**：后台统一刷新，从每 15 分钟一次开始并随机错峰；若服务提供 HTTP 内容版本标识 `ETag`，使用条件请求减少重复下载。
- **有限重试**：设置超时，对临时网络故障、限流或服务端错误退避重试，建议最多尝试 3 次；收到 `Retry-After` 时按提示安排下次请求。
- **保留可用数据**：只有新数据校验通过才替换缓存；刷新失败时继续使用上次成功的数据，并显示数据日期和刷新状态。
- **按规模分发**：较大规模接入使用自己的缓存或镜像，让用户请求读取下游缓存。

下面仅演示一次带超时的读取，持续运行的接入方还需实现上述缓存与回退策略。

```python
import json
from urllib.request import urlopen

url = "https://raw.githubusercontent.com/AdamPlatin123/dsh-plugin-radar/main/data/plugins-all.json"
with urlopen(url, timeout=20) as response:
    records = json.load(response)["plugins"]
verdict_by_repo = {record["repo"].lower(): record["verdict"] for record in records}
```

先读取小型状态接口识别更新；明细可独立做条件校验，不仅凭快照编号推断文件未变化。需要跨文件一致性时，应固定同一完整 Git 提交读取统计与明细，并逐档对账。镜像可能有更新延迟，切换来源时需核对数据日期。

这些策略降低重复请求并缓解短时故障影响，不能保证抵御所有攻击。雷达站点数据已在构建期打包，公开 JSON 暂时不可用通常不影响已经部署的插件浏览。
````

</details>

**依据 2 · 作者声明**：[engine/README.md:17-42](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/engine/README.md#L17-L42)

生产运行环境与节奏是作者契约，不是本地执行。

<details>
<summary>查看原文（26行）</summary>

````text
## 运行环境契约

**环境变量**（脚本零硬编码凭证）：

```bash
GH_TOKEN                 # GitHub 读写（发现+bot 交付；缺省回落 gh auth token）
DEEPSEEK_API_KEY         # LLM 摘要（或 ~/.radar-keys/deepseek，0600；再兜底 sqlite）
DSH_QWEN_BASE_URL        # de-stream 模型端点（本地 127.0.0.1 形态）
RADAR_K8S_DIR            # 私有件根目录（默认 ~/dsh-k8s）
RADAR_DASH_PORT          # 面板端口（默认 8898）
```

**期望目录布局**（生产形态）：

```
~/dsh-external-research/   # 本仓库 clone（引擎从这里运行；scripts/ 为转发壳，crontab 旧路径不断）
~/dsh-k8s/                 # 私有件（k8s 挂具/探针/bot；契约与降级行为见 engine/ops/private/MANIFEST.md）
```

**crontab 样例**（真实生产节奏）：

```cron
*/15 * * * * flock -n /tmp/radar-probe.lock    -c "bash ~/dsh-k8s/radar-probe.sh    >> ~/dsh-k8s/probe.log 2>&1"
*/5  * * * * flock -w 60 /tmp/radar-watchdog.lock -c "bash ~/dsh-k8s/radar-watchdog.sh >> ~/dsh-k8s/watchdog.log 2>&1"
17   */4 * * * flock -n /tmp/radar-discover.lock -c "cd ~/dsh-external-research && python3 engine/discovery/discover.py >> ~/dsh-k8s/discover.log 2>&1"
```
````

</details>

**依据 3 · 作者声明**：[engine/ops/private/MANIFEST.md:8-18](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/engine/ops/private/MANIFEST.md#L8-L18)

自建缺私有件时不能完成相同功能。

<details>
<summary>查看原文（11行）</summary>

```text
| 私有件 | 引用点 | 契约（输入 → 输出） | 缺失时行为 |
|---|---|---|---|
| `radar-index-request.py` | `engine/discovery/cron-check.sh`（worker 门禁） | `--reason --trigger` → 入队一条索引请求 | WARN 后按「已入队」退出（开源副本手动直跑走 `RADAR_INDEX_WORKER=1`） |
| `gen-snapshot-v2.py` | `engine/distribution/auto-snapshot-push.sh`（①生成快照） | 无参 → `$SNAP_DIR/data/snapshots/<run_id>.json`（radar-snapshot/2） | WARN 后本轮跳过（exit 0，不推） |
| `aggregate-agent-test.py` | `engine/distribution/deliver-all.sh`、`bot-deliver.sh` | 读 `.rt-agent/` 流式结果 → `reports/<日期>/agent-test.md` | WARN 后跳过聚合；deliver-all 继续提交已有结果 |
| `bot-deliver.sh`（服务器版） | `engine/distribution/deliver-all.sh`、`deliver-chain.sh` | 读当日报告 → 双仓 bot PR | WARN 后跳过 bot 交付 |
| `finish-rerun.sh` | `engine/distribution/deliver-chain.sh`（仅 pgrep 等待） | 自聚合+推个人仓 | pgrep 无进程即自然通过，无需守卫 |
| `radar-bot-token.sh` | `engine/distribution/cadence.py:135`（bot-app 令牌装载） | 无参 → stdout 令牌 | try/except 已兜底（空令牌→个人 gh 凭据路径） |
| `pipeline-driver.py` / `cadence-loop.sh` / `metrics-loop.sh` | `engine/ops/radar-watchdog.sh`（活性拉起） | 常驻驱动/交付/指标循环 | 启动自检逐件 WARN；拉起命令对缺失文件自然失败且日志可见 |
| `readme-render-watch.sh` | `engine/ops/radar-probe.sh:11`（探测目标） | 渲染链观察器 | 探测 down 分支已有，无阻断 |
| `state/`（pipeline-state.json 等） | `engine/ops/dashboard.py`（面板数据） | 私有引擎状态目录 | dashboard 按缺文件降级显示 |
```

</details>

#### 缺口

- 下游缓存的维护量、刷新时延与筛选节时未知
  **影响**：可试用发现数据，不据此承诺运维收益
  **进一步探讨**：在单一消费者记录刷新失败、陈旧时长、人工筛选时间与误判数量

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 逐条最小证据接口是否比更多目录条目更有价值？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是给每个确定运行状态增加可点击的最小证据元组：插件仓库数字身份与commit、宿主版本、环境、时间、执行结果和日志定位；缺字段时继续作为发现信号，但不进入“本条件已测试”筛选。Q02的统一导出能承载这层约束，Q03的私有测试边界说明证据必须来自实际生产者，不能由聚合器补造。

相对继续扩目录，新增价值是让读者对自己要装的版本判断匹配和复查责任；代价是生产端保留日志、隐私处理、版本失效政策与消费方schema升级。最小验证对同一批20个候选随机分配现有清单和带元组清单，记录找到适用证据的时间、误当当前可用次数和最终复查通过数。若误判不降、生产成本过高或原用户只需发现，则不推进完整接口。

现阶段建议将其作为只读发现资源小范围试用。维护目录的人可以缓存数据帮助初筛，比手工聚合多了分类和冲突状态；遇到证据不匹配、日期陈旧或确定状态无法定位日志，就回上游核查并停止把状态用于放行。公开引擎不具备完整运行验证器，不推荐以自建全量测试为本轮已可兑现用途。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:57-59](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/README.md#L57-L59)

逐条版本证据缺口提供假设起点。

```text
公开扁平清单尚未为每条记录提供完整的插件 commit、被测版本、时间与日志。全局版本指针不能替代这些逐条证据，历史“可用”记录也不能解释为已在最新 DSH 版本下验证。

先阅读插件原仓库的安装、权限与卸载说明，在测试环境完成最小功能验证并保留回滚路径。运行级判定不等同于完整功能、性能或安全审计。
```

**依据 2 · 源码核查**：[engine/aggregation/build_canonical.py:402-410](https://github.com/AdamPlatin123/dsh-plugin-radar/blob/aeb605ed0aa53ff30a3b5e42a1c222afd523cfac/engine/aggregation/build_canonical.py#L402-L410)

统一导出是可插入证据约束的机制线索，不表示已实现新接口。

```text
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

#### 缺口

- 读者误判是否源于缺证据，维护者能否低成本公开原件
  **影响**：只是假设，不宣称已识别生产插件需求或商业意愿
  **进一步探讨**：用固定候选对照误判、证据定位时间与生产保全成本

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
