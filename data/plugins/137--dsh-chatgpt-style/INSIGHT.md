# dsh-chatgpt-style

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[fe4f23b](https://github.com/137/dsh-chatgpt-style/tree/fe4f23bed4bec14ad01577050eaacdc0893f57d9)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：调整DSH聊天排版与语义标注，并在发送框旁提供思考或快速档位切换。

> **核心亮点**：client.js注入CSS并用MutationObserver装饰完成后的文本，检测data-streaming避免修改流中节点；档位通过宿主modelDirectories读取和提交。

> **风险与缺陷**：复用宿主模型目录比维护另一套配置可靠，但视觉强调不构成事实已验证，绿色结论仍需读者核实。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：习惯居中聊天版式的用户希望改善长文本阅读和切换模型思考档位，验收是内容不丢失、输入操作正常。

此前未入档；原生主题和字号设置更稳定，本项提供更细布局与正文标记，但增加DOM耦合。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **界面**：聊天样式、完成文本语义装饰、工作区高亮及宿主思考/快速档位切换。

**流程与依赖**

需要DSH Web/DOM结构、React与可选模型目录；思考按钮依赖供应商正确声明reasoningEfforts，不会自动赋予模型能力。

启用后查看排版，正文完成才装饰，按钮切换宿主档位；遇到内容或布局问题先禁用并刷新，核对原生视图再排查。

**兼容条件**

0.1.0 private，GitHub/本地bundle，浏览器依赖chat、conversation与模型目录服务，Host入口基本为空。

**效果与成本**

无新增模型审查调用，主要是安装、浏览器观察器和升级核对成本；档位切换本身可能改变模型费用，未测性能影响。

> **思考**：复用宿主模型目录比维护另一套配置可靠，但视觉强调不构成事实已验证，绿色结论仍需读者核实。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：client.js注入CSS并用MutationObserver装饰完成后的文本，检测data-streaming避免修改流中节点；档位通过宿主modelDirectories读取和提交。

流式节点保护与effect清理值得借鉴，正文装饰幂等减少重复包裹；跨版本DOM选择器仍是主要维护边界。

<a id="detail-section-4"></a>

## 4 使用建议

先检查长文、流式输出、代码块、公式和输入法，再验证禁用能还原；供应商未声明推理档位时使用原生模型菜单。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：依赖宿主语义属性及CSS局部类名，升级可能静默失效；作者假DOM测试不等于真实浏览器兼容。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在目标宿主版本测试流中追加、代码公式、切会话、卸载和长列表滚动，记录内容一致性与渲染耗时。

**分析版本**

固定提交 [fe4f23b](https://github.com/137/dsh-chatgpt-style/tree/fe4f23bed4bec14ad01577050eaacdc0893f57d9)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 927 | 798 | 104 | — |
| .md | source | 1 | 160 | — | — | 1830 |
| .mjs | test | 1 | 298 | 263 | 10 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/137/dsh-chatgpt-style/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
