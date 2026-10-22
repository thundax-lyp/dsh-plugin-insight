# GLM 图片视觉工具

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[10b0cbe](https://github.com/314857493/dsh-vision/tree/10b0cbe8c6f06a175eaa985df28d276575539b6e/packages/vision-tool)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/314857493/dsh-vision) [![npm 30d 1,192](https://img.shields.io/static/v1?label=npm+30d&message=1%2C192&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-vision-free-eyes) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-vision-free-eyes)
<!-- END META -->

> **实现功能**：将本地单张图片发送至智谱 GLM，返回图片问答或 OCR 中文文本。

> **核心亮点**：相对用户另开视觉模型复制结果，贡献是单工具完成本地读图、问答/OCR及缓存，避免依赖外部CLI。图片理解与识别能力归GLM；提示明确图像文字不应当作执行指令，但这只是工具语义约束。

> **风险与缺陷**：“免费眼睛”不保证长期无成本，更不保证结果正确。图片一定上传第三方，缓存命中会跳过新请求；顺序回退可能增加延迟。包声明DSH<0.2.0，不能从工具注册代码存在推出现代宿主兼容。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
- [2 未来设计假设（未验证）](#detail-section-7)
- [3 辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：缺少原生图片输入的DSH会话，针对已知绝对路径图片提问或转录文字；交付GLM生成的文本观察，需按用途复核关键数字。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

参照手工上传GLM、原生视觉模型和本地OCR；未评估独立视觉质量基准。

vision工具验证绝对路径与图片内容/尺寸，将字节base64编码直调GLM API；按图片哈希、模式和提示哈希做进程内结果缓存，模型列表失败后顺序回退。


Node>=22、GLM_API_KEY或ZHIPU_API_KEY及可达智谱API；支持单图<=15MB、不支持PDF。必须具备图片外发许可；宿主声明>=0.1.0-rc.8 <0.2.0、web。

用户提供确切图片路径和问题→校验文件与图片字节→选择image/ocr提示→查缓存或上传→逐模型尝试→返回文本。无法从聊天附件自动发现路径，目录请求应停止。

首次配置API key与图片可访问路径；每次可能产生第三方额度/网络成本、缓存和模型回退成本。免费声明仅作者命名，未核实当前服务价格或配额。

降低补充视觉接口的步骤，但数据外发与转录复核可能抵消便利，未核实第三方用户与识别收益。

**能力**

- **模型工具**：vision提供单张图片理解和OCR两模式。

> **思考**：“免费眼睛”不保证长期无成本，更不保证结果正确。图片一定上传第三方，缓存命中会跳过新请求；顺序回退可能增加延迟。包声明DSH<0.2.0，不能从工具注册代码存在推出现代宿主兼容。

<a id="detail-section-4"></a>

### 1.3 工程贡献

图片与提示共同哈希避免不同问题共用旧答案，绝对路径/内容校验值得复用。调用链直接fetch外部API，移植需补宿主权限、速率和取消语义验证。

组件包dsh-vision-free-eyes 0.1.4，仅packages/vision-tool；同仓vision-route不计入该工具贡献。

固定源码依据：[packages/vision-tool/index.js L151–173](https://github.com/314857493/dsh-vision/blob/10b0cbe8c6f06a175eaa985df28d276575539b6e/packages/vision-tool/index.js#L151-L173)；[packages/vision-tool/index.js L217–230](https://github.com/314857493/dsh-vision/blob/10b0cbe8c6f06a175eaa985df28d276575539b6e/packages/vision-tool/index.js#L217-L230)。上述贡献与关键质疑均限定于这些固定源码，不把测试文件存在当运行通过。

> **亮点**：相对用户另开视觉模型复制结果，贡献是单工具完成本地读图、问答/OCR及缓存，避免依赖外部CLI。图片理解与识别能力归GLM；提示明确图像文字不应当作执行指令，但这只是工具语义约束。

<a id="detail-section-5"></a>

### 1.4 使用建议

适合允许图片出网且缺原生视觉的场景做非敏感样本验证；财务、身份或关键数字需人工回读，不将OCR文本当真值。

核查状态：源码支持本文所述机制与有限集成贡献；效果、宿主兼容和独立采用未验证。未来设计假设仅为推演，未实现、未验证。 只执行研究工程的统计/装配与结构验证，未安装插件、运行目标代码/测试或做真实宿主验收。

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- 版本依据：仓库：[314857493/dsh-vision](https://github.com/314857493/dsh-vision)；固定提交：[10b0cbe8](https://github.com/314857493/dsh-vision/tree/10b0cbe8c6f06a175eaa985df28d276575539b6e)；版本号：0.1.4；版本日期：2026-09-05（固定提交日期，北京时间，非包发布日期）。
- 已检查与未覆盖范围：限定packages/vision-tool组件；未分析同仓vision-route，未上传图片、调用GLM或验证OCR准确率。
- 证据限制：作者功能摘要来自固定版本README；未核实独立用户采用、同条件效果或端到端收益。版本、证据原文与inventory绑定保存在本项JSON；GitHub/npm统计仅作背景，不构成采用证明。

<a id="detail-section-7"></a>

## 2 未来设计假设（未验证）

待验证假设：把图片哈希、实际模型与OCR置信提示连同结果返回，允许关键字段双次复核，可能比纯中文结果更适合研究取证。依据是已有内容哈希但结果缺获取/生成元数据；新增推理会增加延迟和费用。

最小验证与否定条件：用含表格、旋转字、细小数字与图中恶意指令的自有图片对照人工转录；比较字段精确率与上传/返回耗时。若关键数字错误或图内指令导致额外操作，则不能作为自动取证；另验API取消和所有回退失败。

<a id="detail-section-8"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 233 | 194 | 30 | — |
| .md | source | 2 | 99 | — | — | 1191 |
| .mjs | source | 4 | 191 | 160 | 11 | — |
| .mjs | test | 1 | 20 | 15 | 2 | — |

排除 0 项；解析错误 0 项。统计为固定Git范围，源码抽读不冒充全面审计；JS/TS与Markdown分别计量。默认排除为启发式，不能从LOC推算原创量或工时。

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/314857493/dsh-vision/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/314857493/dsh-vision/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/314857493/dsh-vision/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
