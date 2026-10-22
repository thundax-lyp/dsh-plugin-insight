# dsh-vision

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[f8b2619](https://github.com/54xkeee/dsh-vision/tree/f8b26198aff85bc72c3bb12a2e843ebec68c04d1)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/54xkeee/dsh-vision) [![npm 30d 1,431](https://img.shields.io/static/v1?label=npm+30d&message=1%2C431&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-web) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vision-web)
<!-- END META -->

> **实现功能**：为纯文本模型接入多通道识图，提供图片面板、视觉工具和会话证据记忆。

> **核心亮点**：作者把免API key的豆包Web作为默认卖点；源码更有价值的增量是将识图结果分成中性证据与当前问题回答，绑定图片摘要并复用到后续对话。相对每轮手工截图另问视觉模型，减少重复调用；视觉推断仍由通道模型完成。

> **风险与缺陷**：Web桥接依赖已登录Chrome及页面结构，零API现金不等于零维护成本。auto档根据视觉模型自己给出的complexity决定是否深查，漏判可能跳过必要第二遍；JSON解析失败回退文本且默认simple，不能据此宣称可靠升级。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 场景与替代办法](#detail-section-2)
  - [1.2 能力、依赖与流程](#detail-section-3)
  - [1.3 成本与效果](#detail-section-4)
  - [1.4 工程亮点](#detail-section-5)
  - [1.5 用途与适用场景](#detail-section-6)
  - [1.6 能力、流程与成本](#detail-section-7)
  - [1.7 工程贡献](#detail-section-8)
  - [1.8 使用建议](#detail-section-9)
  - [1.9 核查说明与分析版本](#detail-section-10)
- [2 未来设计假设（未验证）](#detail-section-11)
- [3 辅助信息](#detail-section-12)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 场景与替代办法

可直接使用原生多模态主模型或单独视觉聊天；此插件以文本主模型加外置视觉证据换取模型选择自由。

<a id="detail-section-3"></a>

### 1.2 能力、依赖与流程

src/index.ts包装上游provider，把图片块替换为附件占位，注册vision工具；vision-core.ts规范化结构化视觉证据、内容缓存键，压缩结束后恢复近期记录。

- **模型工具**：vision识图/OCR/区域/比较
- **界面**：识图面板
- **事件监听**：compaction完成后恢复近期视觉记录

宿主webServer/llm/tools/sessions/attachments；豆包通道另需Windows桥接、Chrome CDP与登录，其他通道依赖对应凭据和服务。

粘贴图片→包装provider占位→模型调用vision→通道识图及可选升级→会话写证据→跨轮复用；桥接失效需修登录或更换通道。

<a id="detail-section-4"></a>

### 1.3 成本与效果

首次需登录浏览器、桥接进程或配置API/IDE通道；每轮可能两遍识图，现金随实际通道，人工需维护登录、DOM和错误描述。

证据缓存有减少重复识图的机制依据，准确率、免费服务持续性与业务节省均未独立验证。

<a id="detail-section-5"></a>

### 1.4 工程亮点

纯函数vision-core将规范化、缓存键与提示分离；失败缓存删除和compaction/end后的有限恢复值得借鉴。fallback容忍非结构化结果也会削弱结构保证，应显式展示structured状态。

源码依据：[src/index.ts](https://github.com/54xkeee/dsh-vision/blob/f8b26198aff85bc72c3bb12a2e843ebec68c04d1/src/index.ts)、[src/vision-core.ts](https://github.com/54xkeee/dsh-vision/blob/f8b26198aff85bc72c3bb12a2e843ebec68c04d1/src/vision-core.ts)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：适合保持文本主模型、额外理解截图或表格的用户；应保留原图作为最终核对依据。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **模型工具**：vision识图/OCR/区域/比较
- **界面**：识图面板
- **事件监听**：compaction完成后恢复近期视觉记录

> **思考**：Web桥接依赖已登录Chrome及页面结构，零API现金不等于零维护成本。auto档根据视觉模型自己给出的complexity决定是否深查，漏判可能跳过必要第二遍；JSON解析失败回退文本且默认simple，不能据此宣称可靠升级。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：作者把免API key的豆包Web作为默认卖点；源码更有价值的增量是将识图结果分成中性证据与当前问题回答，绑定图片摘要并复用到后续对话。相对每轮手工截图另问视觉模型，减少重复调用；视觉推断仍由通道模型完成。

<a id="detail-section-9"></a>

### 1.8 使用建议

已有可用视觉通道且愿意核对原图时可试。先检查桥接登录、密集截图和压缩后记录恢复，敏感图片先确认会送到哪个通道。

**核查状态**：已检查固定版本源码，未安装、执行目标插件或完成真实宿主验收。已有贡献仅由固定版本源码支持，实际宿主和任务效果尚未验证；未来设计假设保持未验证。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[54xkeee/dsh-vision](https://github.com/54xkeee/dsh-vision)
- **版本号**：0.1.0（[固定提交 f8b26198](https://github.com/54xkeee/dsh-vision/tree/f8b26198aff85bc72c3bb12a2e843ebec68c04d1)）
- **版本日期**：2026-08-16（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/vision-core.ts、作者README与固定范围inventory；源码抽读不等于完整审计。
- 未完成：目标插件执行、测试、安装、模型调用和真实宿主验收。
- 证据限制：核查固定提交内列明入口、核心实现及相关配置/作者材料的源码子集；未执行插件、其测试、安装、付费请求或真实宿主验收，未核实独立用户采用。
- 下一步：固定宿主下比较简单图、密集表、对比图与压缩恢复；记录错误、通道、成本和延迟，不以作者猫图示例外推。

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：用OCR密度与用户任务类型等确定信号补充complexity自报，可降低密集界面漏升级。对固定标注截图比较漏字率、额外调用和延迟；若召回改善不足以抵消双遍开销，则保持人工深查。

固定宿主下比较简单图、密集表、对比图与压缩恢复；记录错误、通道、成本和延迟，不以作者猫图示例外推。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：cab319056d4f2e6977f3ba0f5907cf41b9c77420fb26decf81fd5fd51da02379。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 2 | 221 | 192 | 18 | — |
| .md | source | 2 | 514 | — | — | 3946 |
| .ts | source | 5 | 1728 | 1517 | 131 | — |
| .tsx | source | 1 | 358 | 343 | 2 | — |
| .mjs | test | 1 | 215 | 195 | 1 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/54xkeee/dsh-vision/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
