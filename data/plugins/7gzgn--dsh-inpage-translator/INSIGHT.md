# dsh-inpage-translator

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[4a57cad](https://github.com/7gzgn/dsh-inpage-translator/tree/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在DSH浏览器页面注入翻译按钮，用宿主模型分块翻译可见文本并支持还原。

> **核心亮点**：相对复制网页文字到聊天，增量是宿主凭据留在宿主侧、页面按钮仅提交标记，再将批量译文映回原文位置。去重后限额与按模型路线缓存减少重复文本处理，属于成熟翻译/DOM机制在缺少工具栏扩展点下的组合。

> **风险与缺陷**：整页原位替换是否保留语义与页面行为？固定范围不含iframe/图像/输入框，动态DOM可覆盖译文，失败块又按原文回退；因此按钮完成并不表示整页已翻。后台枚举私有runtime.providers与provider.sessions也使当前页面选择、导航期间回填和兼容性成为核心边界。没有翻译忠实度评测。

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

> **用途**：在DSH浏览器阅读外文网页的用户希望原位翻译并可对照原文；合格交付是重点信息忠实、覆盖范围明确且页面交互可恢复。

浏览器内置翻译更少宿主适配，复制文本到聊天便于解释但割裂阅读；此插件适合已有DSH浏览器/模型工作流，未做质量排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：translate_page提供安装/翻译/还原/状态和会话查询。
- **界面**：页面内可拖拽翻译按钮。
- **后台**：轮询现有浏览器会话补按钮与处理翻译请求。

**流程与依赖**

必要为ctx.browser、ctx.llm与可访问页面DOM；模型能力决定忠实度，跨域iframe受浏览器限制；自动会话发现依赖私有运行时结构。

后台巡检页面补按钮，用户点击后收集可见文本，去重后分块调用模型并合并缓存，按标记回填；再次点击还原，失败与超限统计应供用户判断。

**效果与成本**

首次需模型和浏览器服务；日常有分块模型调用现金成本、轮询与翻译延迟，去重缓存可能减少重复调用但无费用实测。敏感页面文本需按所选模型的处理条件判断。

减少复制粘贴和重复菜单翻译，不能取代专业校译或敏感资料处理判断；没有独立用户或同条件成本结果。

> **思考**：整页原位替换是否保留语义与页面行为？固定范围不含iframe/图像/输入框，动态DOM可覆盖译文，失败块又按原文回退；因此按钮完成并不表示整页已翻。后台枚举私有runtime.providers与provider.sessions也使当前页面选择、导航期间回填和兼容性成为核心边界。没有翻译忠实度评测。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对复制网页文字到聊天，增量是宿主凭据留在宿主侧、页面按钮仅提交标记，再将批量译文映回原文位置。去重后限额与按模型路线缓存减少重复文本处理，属于成熟翻译/DOM机制在缺少工具栏扩展点下的组合。

相对复制网页文字到聊天，增量是宿主凭据留在宿主侧、页面按钮仅提交标记，再将批量译文映回原文位置。去重后限额与按模型路线缓存减少重复文本处理，属于成熟翻译/DOM机制在缺少工具栏扩展点下的组合。

DOM脚本与模型编排分离、textContent写入、分块失败降级和路线+语言+原文缓存值得借鉴。复用需处理私有会话枚举、动态DOM版本和缓存隔离；格式可解析不等于翻译语义正确。 源码依据：[lib/index.js](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/index.js)、[lib/translate.js](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/translate.js)、[lib/page-script.js](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/page-script.js)、[lib/constants.js](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/constants.js)。

<a id="detail-section-5"></a>

### 1.4 主要限制

整页原位替换是否保留语义与页面行为？固定范围不含iframe/图像/输入框，动态DOM可覆盖译文，失败块又按原文回退；因此按钮完成并不表示整页已翻。后台枚举私有runtime.providers与provider.sessions也使当前页面选择、导航期间回填和兼容性成为核心边界。没有翻译忠实度评测。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合普通公开网页阅读时先试用。先检查模型路由与页面内容范围，重要数字和否定句对照原文；不把按钮完成当整页覆盖或译文正确证明。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[7gzgn/dsh-inpage-translator](https://github.com/7gzgn/dsh-inpage-translator)
- **版本号**：0.2.4（[固定提交 4a57cad0](https://github.com/7gzgn/dsh-inpage-translator/tree/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/translate.js、lib/page-script.js、lib/constants.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：用含数字、否定、重复菜单、动态节点和iframe的固定公开页面，对比原文与译文、覆盖计数、还原行为及重复调用费用；切换/导航时检查回填目标。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由部分覆盖和可还原标记推导，可将翻译结果作为带DOM文本摘要与版本的旁路层：回填前核对节点原文未变，失败/跳过区域可见标记，并保留原文可一键比较。未验证假设是提高覆盖可信度且减少动态页面错位。对实时更新与嵌套标签页测试，若错配或阅读负担不降则否定。

用含数字、否定、重复菜单、动态节点和iframe的固定公开页面，对比原文与译文、覆盖计数、还原行为及重复调用费用；切换/导航时检查回填目标。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：54722034a82466f098036a68b7f1e3a2b7ba896b50ad0d60591e66921d32d8fe。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 1960 | 1418 | 418 | — |
| .md | source | 1 | 143 | — | — | 2247 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/7gzgn/dsh-inpage-translator/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
