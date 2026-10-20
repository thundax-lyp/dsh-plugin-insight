# feishu-dsh-plugin（2286893544）

> 通过企业自建飞书应用为 DSH 提供消息、云文档、多维表格、表格与权限操作工具。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[8cb7f88](https://github.com/2286893544/feishu-dsh-plugin/tree/8cb7f88b0eed0b8c59932e381f52f096c7e56df9)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2286893544/feishu-dsh-plugin)
<!-- END META -->

**使用建议**：已有自建机器人且权限清楚的团队可在测试群和可丢弃文档先试；确认创建后目标人可打开再扩展。中文图表先用外部可核对图片，不直接依赖当前ASCII字库输出。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
  - [源码索引](#detail-section-7)
  - [比较依赖](#detail-section-8)
- [未来设计假设（未验证）](#detail-section-9)
- [辅助信息](#detail-section-10)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

核查了应用身份、创建后授权和本地图表机制；工具与技能定义存在不等于目标租户已挂载、可访问。作者25项声明未作为本次运行计数，权限结果与中文图表未实测。

[重点创新推演与最小验证](#innovation)

- **用途**：面向用自建机器人管理文档和群消息的团队，合格交付需内容写入、目标人员可见，图表标签与原数据一致。

采用建议：已有自建机器人且权限清楚的团队可在测试群和可丢弃文档先试；确认创建后目标人可打开再扩展。中文图表先用外部可核对图片，不直接依赖当前ASCII字库输出。

参照人工复制+分享、通用HTTP脚本及同轮用户OAuth集成；本项以应用资产加分享满足机器人场景，不能把授权后访问视为和个人所有权完全相同。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：飞书消息、文档、表格、多维表格及权限工具定义
- **Skill**：通过技能provider提供feishu工作流材料

**流程与依赖**

需要飞书企业自建应用、tenant凭据、已发布scopes和群/文档访问权限；全程应用身份，可配置对人授权，未实现同轮2048lr的用户OAuth路径。图表仅本地渲染，插图仍需平台上传权限。

配置应用→连接测试→Agent选工具→缓存tenant token→创建内容→尝试给目标人授权→返回创建/授权文本→操作者打开核对。授权失败应在已有文档上补授权，不盲目重复创建。

**效果与成本**

首次需发布机器人scopes、加入目标群、共享原文档及配置grantOpenId；日常模型与API调用和授权排错，图表中文需另生成图像再插入，增加人工。未测每份文档费用/人工分钟。

把消息和文档整理接进Agent可少一次人工复制；生成资产可见性和图表标签完整才是有效交付，不能把25个工具当25种已验收流程。

- **思考**：创建成功是否意味着操作者拥有可用结果？autoGrantOwner失败返回auto-grant failed文本，仍保留创建成果，且grantOpenId可为空。它避免授权失败丢失文档，却把可访问性复核交给模型/用户；应用身份共享权限也不等同于个人原生所有权。群权限和文档归属是采用前必须实际核对的边界。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对通用HTTP工具加人工分享，本项把常用飞书任务及创建后授权联结，并以零外部依赖PNG生成补上图表插入。核心是应用机器人工作流的便利，而不是新的认证协议或原生图表引擎；“纯Node”避免Python部署但不自动证明端到端低成本。

相对通用HTTP工具加人工分享，本项把常用飞书任务及创建后授权联结，并以零外部依赖PNG生成补上图表插入。核心是应用机器人工作流的便利，而不是新的认证协议或原生图表引擎；“纯Node”避免Python部署但不自动证明端到端低成本。

autoGrantOwner把授权失败与创建结果区分，避免掩盖已成功副作用，值得借鉴为多阶段API流程；目前返回字符串使机器难以精确分辨阶段。png.js本地编码移除绘图库依赖但5×7字库不含汉字，维护和复用必须限定ASCII标签。

<a id="detail-section-5"></a>

### 主要限制

创建成功是否意味着操作者拥有可用结果？autoGrantOwner失败返回auto-grant failed文本，仍保留创建成果，且grantOpenId可为空。它避免授权失败丢失文档，却把可访问性复核交给模型/用户；应用身份共享权限也不等同于个人原生所有权。群权限和文档归属是采用前必须实际核对的边界。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js、lib/png.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读工具注册、创建授权、REST客户端和本地图表代码，未调用真实飞书API、未复现作者烟测，未确认所有工具参数在当前平台均有效。
- 下一步：同一测试用户分别配置有效/缺失/无权限grantOpenId，创建后以该用户打开并记录阶段结果；注入授权失败验证补授权不重复创建；用中英文图表核对标签。结构化阶段若不能减少遗漏授权和重复资产，则否定假设。

**分析版本**

- **仓库**：[2286893544/feishu-dsh-plugin](https://github.com/2286893544/feishu-dsh-plugin)
- **版本号**：0.1.0（[固定提交 8cb7f88b](https://github.com/2286893544/feishu-dsh-plugin/tree/8cb7f88b0eed0b8c59932e381f52f096c7e56df9)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

### 源码索引

- [lib/index.js](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/index.js)
- [lib/client.js](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/client.js)
- [lib/png.js](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/png.js)

<a id="detail-section-8"></a>

### 比较依赖

本篇仅作固定机制比较，不继承对方运行结论，不增加档案循环依赖。

- `github:1418842530:root`，code `17ed9c0dada4b40580dcf1e1b07918716a94f69d`：[2048lr 身份选择实现](https://github.com/2048lr/dsh-feishu/blob/17ed9c0dada4b40580dcf1e1b07918716a94f69d/lib/identity.js)，调用前选择用户/应用身份。
- `github:1364766828:root`，code `8cb7f88b0eed0b8c59932e381f52f096c7e56df9`：[2286893544 创建与授权实现](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/index.js)，应用身份创建后按 grantOpenId 尝试授予访问。

<a id="detail-section-9"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：把create与grant结果拆成结构化独立阶段，返回可重试grant任务而不重新create；验收先检查目标用户能访问。来源是当前文本附注可能被忽略，而授权失败不应再制造文档。代价是增加任务状态和权限查询调用。

同一测试用户分别配置有效/缺失/无权限grantOpenId，创建后以该用户打开并记录阶段结果；注入授权失败验证补授权不重复创建；用中英文图表核对标签。结构化阶段若不能减少遗漏授权和重复资产，则否定假设。

<a id="detail-section-10"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 178 | — | — | 1931 |
| .js | source | 6 | 1784 | 1492 | 159 | — |
| .mjs | source | 3 | 526 | 463 | 27 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2286893544/feishu-dsh-plugin/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-20。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
