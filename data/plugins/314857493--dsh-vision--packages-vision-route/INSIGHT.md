# dsh-vision

> 给纯文本模型路由添加图片附件转译旁路，使用智谱视觉模型生成文字证据。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[10b0cbe](https://github.com/314857493/dsh-vision/tree/10b0cbe8c6f06a175eaa985df28d276575539b6e/packages/vision-route)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/314857493/dsh-vision) · [![npm 30d 1264](https://img.shields.io/static/v1?label=npm+30d&message=1%2C264&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-proxy-route) · [![首次发布 2026-08-17](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vision-proxy-route)
<!-- END META -->

**使用建议**：需要保留纯文本主模型时可隔离试用；要求原始像素高保真或禁止上传智谱的场景先选其他办法，勿把文字描述当图像原件。

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

已实现机制由固定源码支持；效果未独立实测，未来假设未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：希望继续使用已有纯文本provider、偶尔询问GUI图片的DSH用户，交付为可供下游推理的视觉描述。

采用建议：需要保留纯文本主模型时可隔离试用；要求原始像素高保真或禁止上传智谱的场景先选其他办法，勿把文字描述当图像原件。

参照作者承认的DSH原生Vision及单独上传视觉模型；旁路牺牲部分保真换取主模型不变。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **后台**：图片块转译、问题相关缓存与历史图追问路由

**流程与依赖**

必要为llm/attachments服务、已挂载目标provider、GLM key及网络；目标与包装provider不能同名。

用户选包装路由并发图→读取附件→GLM转译→不可信数据标签→原provider推理；失败变成可见文字标记继续。

**效果与成本**

首次配置GLM凭据和provider；图片上传第三方，网络重试和三模型降级叠加时延；免费额度政策未本轮核实，人工复核另计。

把视觉调用从主模型计费与能力中分离有机制依据，但准确率、实际价格与端到端时延未实测。

- **思考**：转译文字是否保存足够细节？代码按问题生成并可复看旧图，这是强支持；但JSON结果默认只展平value而不保留key，表格关系和细节可能丢失。追问选择最多近期8轮/6张图，是有限范围的指代启发式，不能承诺任意历史理解。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对切换整个会话到原生视觉模型，增量在视觉前处理与主模型解耦，以及基于本轮追问重新解析近期历史图；依赖现成视觉API，非新视觉算法。只研究vision-route，磁盘vision工具是另一组件。

相对切换整个会话到原生视觉模型，增量在视觉前处理与主模型解耦，以及基于本轮追问重新解析近期历史图；依赖现成视觉API，非新视觉算法。只研究vision-route，磁盘vision工具是另一组件。

成功结果才入缓存，瞬时缺key或限流不会黏住；AbortSignal及单模型60秒超时可观察，三次串行回退仍会放大等待。 [固定源码](https://github.com/314857493/dsh-vision/blob/10b0cbe8c6f06a175eaa985df28d276575539b6e/packages/vision-route/index.js#L1)。

<a id="detail-section-5"></a>

### 主要限制

转译文字是否保存足够细节？代码按问题生成并可复看旧图，这是强支持；但JSON结果默认只展平value而不保留key，表格关系和细节可能丢失。追问选择最多近期8轮/6张图，是有限范围的指代启发式，不能承诺任意历史理解。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 packages/vision-route/index.js、packages/vision-route/package.json 及固定范围 inventory；组件：packages/vision-route。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读指定核心源码与作者说明；未执行目标插件或测试、未安装或做真实宿主验收，未核实独立用户收益。
- 下一步：用含重复数字、跨列标题的图片及超过回看窗口的追问对照原生视觉、当前旁路与结构证据版本；若信息保真无改善或成本超过价值则否定假设。

**分析版本**

- **仓库**：[314857493/dsh-vision](https://github.com/314857493/dsh-vision)
- **版本号**：0.1.4（[固定提交 10b0cbe8](https://github.com/314857493/dsh-vision/tree/10b0cbe8c6f06a175eaa985df28d276575539b6e)）
- **版本日期**：2026-09-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：把每条视觉证据附上图片序号、提取区域与不确定性，并在涉及数字或表格时保留结构，可降低文字旁路丢失关系的风险；新增token与二次识别成本。

用含重复数字、跨列标题的图片及超过回看窗口的追问对照原生视觉、当前旁路与结构证据版本；若信息保真无改善或成本超过价值则否定假设。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 579 | 475 | 59 | — |
| .md | source | 2 | 106 | — | — | 1163 |
| .mjs | source | 4 | 540 | 465 | 40 | — |
| .mjs | test | 1 | 20 | 15 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/314857493/dsh-vision/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
