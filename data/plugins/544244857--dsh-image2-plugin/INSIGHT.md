# dsh-image2-tool

> 通过兼容图片接口生成或编辑图片，将结果保存到会话目录并支持内联预览。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[fc44d3f](https://github.com/544244857/dsh-image2-plugin/tree/fc44d3feb4be5b7b4d0e0c20bd2b4d09c925dc1e)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/544244857/dsh-image2-plugin) · [![npm 30d 582](https://img.shields.io/static/v1?label=npm+30d&message=582&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-image2-tool) · [![首次发布 2026-10-16](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-image2-tool)
<!-- END META -->

**使用建议**：适合已能确认中转服务支持的图片任务。先用非敏感参考图验证生成、编辑、取消和落盘，再逐张看图；别把自动生成开关当费用上限。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、依赖与流程](#detail-section-3)
  - [成本与效果](#detail-section-4)
  - [工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

替代办法是直接图片服务界面或curl上传下载；插件新增宿主工具集成，不提供本地图像模型。

<a id="detail-section-3"></a>

### 能力、依赖与流程

index.js 注册 image2_generate；有参考图走 multipart edits，否则走 generations；魔术字节判型并用 wx 排他创建文件。

- **模型工具**：image2_generate文生图及本地参考图编辑

依赖宿主tools、Schemastery、Node全局fetch/FormData、兼容图片端点与密钥；预览另依赖@wisdoverse/dsh-inline-media-viewer。

用户明确要求→工具校验配置及图片→请求远端→解析base64或下载URL→判型保存→模型另行视觉复查。失败请求也可能产生服务端费用。

<a id="detail-section-4"></a>

### 成本与效果

首次配置服务地址、密钥与模型；现金按远端图片请求及失败重试计费，人工需核对构图、内容和参考图传输范围，不能以保存成功计合格产出。

可减少图片下载与路径回填，但没有同条件工时或画面合格率对照。

<a id="detail-section-5"></a>

### 工程亮点

safeOutputRoot检查既有祖先真实路径，saveUniqueImage用wx避免覆盖；错误消息遮蔽key，图片URL下载不附带中转key。可复用文件落盘防护，仍需评估下载体积及参考图可读范围。

源码依据：[index.js](https://github.com/544244857/dsh-image2-plugin/blob/fc44d3feb4be5b7b4d0e0c20bd2b4d09c925dc1e/index.js)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：适合已有图片中转服务的开发者制作插图；交付物是本地可检查图片，而非接口成功提示。

- **建议**：待验证假设：将任务预算与视觉验收状态保存为独立记录，可把提示纪律变成可审计流程。对照同一素材任务的提示版与持久计数版，测超额请求、漏验收和人工确认时间；若代价大于费用与漏验收改善则否定。

适合已能确认中转服务支持的图片任务。先用非敏感参考图验证生成、编辑、取消和落盘，再逐张看图；别把自动生成开关当费用上限。

**核查状态**：已检查固定版本源码，未安装、执行目标插件或完成真实宿主验收。已有贡献仅由固定版本源码支持，实际宿主和任务效果尚未验证；未来设计假设保持未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **模型工具**：image2_generate文生图及本地参考图编辑

- **思考**：自动生成开关和最多六次请求预算只写在工具描述中，execute没有任务级计数或授权判断，因此不是费用硬闸门。输出目录检查realpath，但参考图可读绝对路径，二者权限边界不同。视觉自检同样只是要求模型调用read_image，不能证明生成质量。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：作者主张一句话生图；源码可确认的增量是把兼容图片接口、参考图上传、会话内落盘和视觉复查提示连接起来。相对手写curl与另存图片，减少路径整理和接回对话的步骤；模型能力归属远端服务，内联显示归属依赖的Wisdoverse插件。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- **仓库**：[544244857/dsh-image2-plugin](https://github.com/544244857/dsh-image2-plugin)
- **版本号**：0.4.1（[固定提交 fc44d3fe](https://github.com/544244857/dsh-image2-plugin/tree/fc44d3feb4be5b7b4d0e0c20bd2b4d09c925dc1e)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

- 已检查：index.js、作者README与固定范围inventory；源码抽读不等于完整审计。
- 未完成：目标插件执行、测试、安装、模型调用和真实宿主验收。
- 证据限制：核查固定提交内列明入口、核心实现及相关配置/作者材料的源码子集；未执行插件、其测试、安装、付费请求或真实宿主验收，未核实独立用户采用。
- 下一步：用假服务覆盖失败JSON、取消、同名及符号链接，再在固定宿主检查图生图和read_image闭环；本轮未执行。

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：将任务预算与视觉验收状态保存为独立记录，可把提示纪律变成可审计流程。对照同一素材任务的提示版与持久计数版，测超额请求、漏验收和人工确认时间；若代价大于费用与漏验收改善则否定。

用假服务覆盖失败JSON、取消、同名及符号链接，再在固定宿主检查图生图和read_image闭环；本轮未执行。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：d7458ffe4ac53b154d9bc4b39ea24da6d44c8ca8d58b46aa7f1415a067270b78。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 466 | — | — | 4770 |
| .js | source | 2 | 743 | 644 | 54 | — |
| .js | test | 1 | 206 | 198 | 8 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/544244857/dsh-image2-plugin/issues) 查看。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
