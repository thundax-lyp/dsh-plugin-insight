# hover-glossary

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[620b85d](https://github.com/AlyceStocking/hover-glossary/tree/620b85d4291e6983cc2d1205ff76f4833978f38b)

<!-- BEGIN META -->
[![npm 30d 48](https://img.shields.io/static/v1?label=npm+30d&message=48&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/hover-glossary) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/hover-glossary)
<!-- END META -->

> **实现功能**：在已发送聊天正文中悬停词语，显示内置的一对多释义。

> **核心亮点**：把归一化、一对多释义和最长词查询封装到本地悬停，避免每次术语检索模型请求；复用相同纯Lexicon源码构建client减少漂移。增量是低成本阅读入口，词库覆盖与条目权威性不由算法保证。

> **风险与缺陷**：多个释义怎样避免“最高weight就是当前意思”的误读？排序是静态weight而非上下文消歧；跨DOM样式节点拆词不匹配，英文短语只首词命中，可能漏词或给不适用义项。README把旧浏览器验证和Desktop入口检查分开，本轮不能将其升级为当前悬停已验收。legacy host-service/Skill文件存在也不等于当前注册能力。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：读中英文技术聊天时快速查固定术语/缩写含义，保留上下文；交付是词库条目展示，不是上下文语义判断。

浏览器词典扩展、搜索或模型解释；本项减少网络/模型请求但义项静态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：聊天正文术语悬停气泡，多释义按固定权重展示。
- **事件监听**：mousemove/leave/scroll/blur只读触发本地词库查询。

**流程与依赖**

当前Host入口no-op，词库与Lexicon内联client；鼠标caret API找单一文本节点/字符矩形，限制用户/助手正文并排除交互区域。NFKC/大小写归一、中文最长词与英文词边界匹配后排序显示多条释义，离开/滚动清气泡并卸载监听。

DSH浏览器client/DOM、caretRangeFromPoint或caretPositionFromPoint与聊天标记；无Host查询服务、模型或外部词库。

悬停正文→定位字符→本地匹配→按weight显示多义→离开/滚动隐藏；词库更改需重新构建/装载，不自动学习对话。

纯client bundle，词库来自src/seed-data构建内联；重启重新加载固定词库，非在线词典或持久自定义词条服务。

**效果与成本**

现金无模型/API；人工维护释义/权重、重建/安装和宿主DOM契约；鼠标监听与词库内存有小额资源成本未测。

减少离开聊天查术语，保留本地性；无正确率和阅读时间实测。

> **思考**：多个释义怎样避免“最高weight就是当前意思”的误读？排序是静态weight而非上下文消歧；跨DOM样式节点拆词不匹配，英文短语只首词命中，可能漏词或给不适用义项。README把旧浏览器验证和Desktop入口检查分开，本轮不能将其升级为当前悬停已验收。legacy host-service/Skill文件存在也不等于当前注册能力。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把归一化、一对多释义和最长词查询封装到本地悬停，避免每次术语检索模型请求；复用相同纯Lexicon源码构建client减少漂移。增量是低成本阅读入口，词库覆盖与条目权威性不由算法保证。

把归一化、一对多释义和最长词查询封装到本地悬停，避免每次术语检索模型请求；复用相同纯Lexicon源码构建client减少漂移。增量是低成本阅读入口，词库覆盖与条目权威性不由算法保证。

纯函数归一/最长词索引可测试复用，气泡内容按纯字符串呈现，caret矩形避免行尾空白误弹，effect清理事件；DOM节点边界是明确能力限度。

固定源码依据：[lib/index.js](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/lib/index.js)、[lib/client.js](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/lib/client.js)、[src/lexicon.mjs](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/src/lexicon.mjs)、[cordis.patch.yml](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/cordis.patch.yml)、[package.json](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

多个释义怎样避免“最高weight就是当前意思”的误读？排序是静态weight而非上下文消歧；跨DOM样式节点拆词不匹配，英文短语只首词命中，可能漏词或给不适用义项。README把旧浏览器验证和Desktop入口检查分开，本轮不能将其升级为当前悬停已验收。legacy host-service/Skill文件存在也不等于当前注册能力。

<a id="detail-section-6"></a>

### 1.5 使用建议

固定术语查阅需求可评估；需要权威领域解释或上下文消歧时仍回原来源，不以首条释义作唯一结论。

核查状态：纯浏览器词库查询与边界源码支持；术语准确率、真实Desktop悬停和阅读收益未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：1.1.0；版本日期：2026-10-14（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[620b85d4](https://github.com/AlyceStocking/hover-glossary/tree/620b85d4291e6983cc2d1205ff76f4833978f38b)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：当前lib Host/client、patch与Lexicon纯函数；legacy plugin/host-service仅核为非当前入口，不确认任何动态Skill/工具注册。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

为义项标注来源/适用领域与当前上下文不确定性，并对跨节点词用只读范围合并，可能在不调用模型下减少误解。固定同缩写不同领域和加粗拆词案例，比较用户选义正确率与误弹；若只多显示解释而选义不改善，则不能称语义辅助升级。

未执行；拟测试中文最长词、全角缩写、同缩写跨领域、跨样式节点和Desktop真实hover，分别记命中与理解正确率。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 169 | — | — | 2005 |
| .js | source | 5 | 2581 | 2262 | 164 | — |
| .mjs | source | 3 | 1208 | 958 | 200 | — |
| .mjs | test | 5 | 1068 | 795 | 174 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/AlyceStocking/hover-glossary/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
