# dsh-callout

> 将助手 Markdown 的 GitHub 风格提示标记呈现为语义卡片。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[0e92c13](https://github.com/Aafff623/dsh-callout/tree/0e92c135644be8d84601ea846098f2799ef4dcf7)

<!-- BEGIN META -->

<!-- END META -->

**使用建议**：希望技术回答更易扫描者可作为展示插件候选；不能将是否出现警告卡片作为执行高影响操作的批准依据。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：长技术回答中让警告、前提和关键结论更容易被读到；交付物是展示增强，原会话Markdown保持可读。

- **建议**：为高影响提示附可展开的“触发依据/影响对象”而保持原Markdown可读，可能比仅颜色提高读者定位损失对象的正确率。用相同危险命令说明做盲测，比较理解正确率与阅读时间；若只增加醒目程度而未减少误解，不成立。

希望技术回答更易扫描者可作为展示插件候选；不能将是否出现警告卡片作为执行高影响操作的批准依据。

核查状态：标记识别、样式升级与卸载清理源码支持；读者理解和警告遵守率未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

普通Markdown粗体/引用或宿主原生alert renderer均可表达重点；本项补展示适配，不做内容审核。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：五种Markdown提示卡片与主题样式。
- **事件监听**：MutationObserver处理流式DOM变化，Host注入输出格式section。

**流程与依赖**

Host注入五类标记的输出约定，浏览器MutationObserver在助手Markdown中识别引用首段的直接文本标记，设置插件自有data属性和CSS；窄范围兼容裸标记。初次全扫后只处理脏根，流式修改撤回样式，卸载尝试恢复拥有的原标记。

DSH systemPrompt、Web Markdown DOM、MutationObserver与主题CSS；依赖模型遵循标记格式。

模型按约定输出→宿主渲染普通Markdown→observer升级合规标记→编辑/流式改变时重评→卸载按所有权恢复；未知标记保留文本。

MIT双面bundle，仓库提交lib用于Git安装；依赖DSH systemPrompt/Web DOM，不修改核心renderer或持久会话。

**效果与成本**

现金为额外格式提示token，无独立API；人工需理解卡片只是模型标注并维护宿主DOM兼容，长流式输出有观察处理开销。

保持原文可移植同时改善视觉层次；不保证语义类型正确、风险完整覆盖或行动安全。

- **思考**：彩色warning来自谁的判断？类型由模型输出，渲染器不判断命令危险性，也不强制每回复最多一个卡片；漏标危险操作仍普通显示。DOM识别依赖助手/Markdown结构，重渲染或其他插件共同改文本时必须避免恢复旧内容；源码做所有权条件判断但未真实宿主验证。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：使用可移植Markdown标记而非修改存储格式，补上宿主普通引用块的语义可见性；Host格式约定与展示识别对齐。核心是受控展示升级与可逆DOM所有权，不能视为风险检测或业务安全能力。

使用可移植Markdown标记而非修改存储格式，补上宿主普通引用块的语义可见性；Host格式约定与展示识别对齐。核心是受控展示升级与可逆DOM所有权，不能视为风险检测或业务安全能力。

插件data/CSS命名空间、脏根扫描和自写mutation抑制减少互扰；HMR先dispose旧实例，迟到teardown不删新样式，恢复文本只在仍等于本插件产物时发生。

固定源码依据：[src/index.ts](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/index.ts)、[src/client/index.ts](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/src/client/index.ts)、[package.json](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/package.json)、[cordis.patch.yml](https://github.com/Aafff623/dsh-callout/blob/0e92c135644be8d84601ea846098f2799ef4dcf7/cordis.patch.yml)。

<a id="detail-section-5"></a>

### 主要限制

彩色warning来自谁的判断？类型由模型输出，渲染器不判断命令危险性，也不强制每回复最多一个卡片；漏标危险操作仍普通显示。DOM识别依赖助手/Markdown结构，重渲染或其他插件共同改文本时必须避免恢复旧内容；源码做所有权条件判断但未真实宿主验证。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.2.0；版本日期：2026-09-09（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[0e92c135](https://github.com/Aafff623/dsh-callout/tree/0e92c135644be8d84601ea846098f2799ef4dcf7)；本轮基准：2026-10-21T05:26:52Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根组件src Host格式section、client标记识别/observer/清理与README，未运行构建或页面；lib与src一致性未证明。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

为高影响提示附可展开的“触发依据/影响对象”而保持原Markdown可读，可能比仅颜色提高读者定位损失对象的正确率。用相同危险命令说明做盲测，比较理解正确率与阅读时间；若只增加醒目程度而未减少误解，不成立。

未运行目标；最小验证应覆盖流式标记被删、复杂嵌套、用户引用、HMR与其他插件共同修改，再独立测阅读理解。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 405 | — | — | 3189 |
| .mjs | source | 1 | 54 | 35 | 13 | — |
| .js | source | 2 | 473 | 460 | 9 | — |
| .ts | source | 2 | 626 | 450 | 125 | — |
| .mjs | test | 1 | 297 | 219 | 42 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/Aafff623/dsh-callout/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
