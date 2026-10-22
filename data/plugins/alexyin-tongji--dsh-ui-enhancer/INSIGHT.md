# dsh-ui-enhancer

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[87f17fe](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/tree/87f17fe74076570023e01e5d0fc55c21affd2c23)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-ui-enhancer) [![npm 30d 1,212](https://img.shields.io/static/v1?label=npm+30d&message=1%2C212&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-enhancer) [![最新发布 2026-08-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ui-enhancer)
<!-- END META -->

> **实现功能**：组合工作区文件引用、壁纸和可自定义形象的桌面宠物。

> **核心亮点**：把文件引用接入官方结构化输入流程，避免纯文本@丢身份；宠物状态取宿主事实而非模型编造，图像在本地处理。个性化效果不等于新的Agent工作流。

> **风险与缺陷**：宠物任务完成来自turn/step事件和有限去重历史，不证明业务交付合格，星星/亲密度不能作生产率指标。去背景依赖边缘颜色连通假设，复杂主体与背景相似时可能破坏形象；@引用只送路径，不代表模型已读文件。

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

> **用途**：保留官方聊天交互，同时需要文件引用和个性化活动提示的桌面用户。

右侧工作台主要复用aionui-panel；本项独立实现宠物、文件引用与个性化桥，不能把依赖面板完整能力算原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：文件引用、壁纸与宠物设置
- **Host 路由**：工作区文件与宠物活动
- **事件监听**：会话活动投影

**流程与依赖**

主机WorkspaceFiles按注册工作区realpath解析并有界搜索/读取，PetActivityTracker投影宿主事件；客户端inputTriggers注册@文件引用，只序列化路径，宠物图像浏览器边缘连通去背景和IndexedDB库，奖励用本地事件去重。

宿主webServer/workspaceRegistry/session事件、客户端inputTriggers/slots及aionui-panel依赖；图像处理浏览器Canvas/IndexedDB，外部壁纸URL可联网。

工作区@查询→选文件结构化引用→模型需要时另读；事件→宠物状态/片段→用户查看；上传图→本地去背景→保存形象，星星投喂是本地娱乐状态。

**效果与成本**

无宠物内置模型聊天费用；图像解码/去背景与壁纸占资源，本地形象/偏好不跨设备同步；用户仍人工判断文件和任务结果。

文件入口和活动投影有实现，无任务质量、去背景通用准确率或效率增益数据。

> **思考**：宠物任务完成来自turn/step事件和有限去重历史，不证明业务交付合格，星星/亲密度不能作生产率指标。去背景依赖边缘颜色连通假设，复杂主体与背景相似时可能破坏形象；@引用只送路径，不代表模型已读文件。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把文件引用接入官方结构化输入流程，避免纯文本@丢身份；宠物状态取宿主事实而非模型编造，图像在本地处理。个性化效果不等于新的Agent工作流。

把文件引用接入官方结构化输入流程，避免纯文本@丢身份；宠物状态取宿主事实而非模型编造，图像在本地处理。个性化效果不等于新的Agent工作流。

文件读取分配字节预算、路径escape、只引用路径不自动塞全文、奖励event ID去重可复用；宠物“完成”只是事件状态。

源码依据：[src/index.ts](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/index.ts)、[src/host/workspace-files.ts](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/host/workspace-files.ts)、[src/host/pet-activity.ts](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/host/pet-activity.ts)、[src/client/index.ts](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/client/index.ts)、[src/client/file-trigger.ts](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/client/file-trigger.ts)、[src/client/pet-economy.ts](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/client/pet-economy.ts)、[src/client/pet-image.ts](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/blob/87f17fe74076570023e01e5d0fc55c21affd2c23/src/client/pet-image.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

宠物任务完成来自turn/step事件和有限去重历史，不证明业务交付合格，星星/亲密度不能作生产率指标。去背景依赖边缘颜色连通假设，复杂主体与背景相似时可能破坏形象；@引用只送路径，不代表模型已读文件。

<a id="detail-section-6"></a>

### 1.5 使用建议

先核自己宿主的@引用、工作区范围和宠物隐私片段；不需要娱乐层时单独评估依赖面板。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AlexYin-Tongji/dsh-ui-enhancer](https://github.com/AlexYin-Tongji/dsh-ui-enhancer)
- **版本号**：0.2.0（[固定提交 87f17fe7](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/tree/87f17fe74076570023e01e5d0fc55c21affd2c23)）
- **版本日期**：2026-08-23（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/host/workspace-files.ts、src/host/pet-activity.ts、src/client/index.ts、src/client/file-trigger.ts、src/client/pet-economy.ts、src/client/pet-image.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：未来隔离宿主核@序列化、跨工作区/软链接拒绝、任务状态与图像失败回退；本轮未上传图或调用模型。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：活动投影显式区分运行结束与用户验收，并允许去背景预览撤销，可减少误读与破坏性处理。用失败/取消/成功但成果不合格、复杂背景图片核状态和像素保留，未改善则保留装饰用途。

未来隔离宿主核@序列化、跨工作区/软链接拒绝、任务状态与图像失败回退；本轮未上传图或调用模型。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：45e30dc5ea02328b3d4027b215c2170bf5b9e4c20d6b6a04be96ae38ac17f981。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 149 | — | — | 1755 |
| .ts | source | 17 | 3909 | 3430 | 160 | — |
| .tsx | source | 3 | 1430 | 1351 | 6 | — |
| .ts | test | 10 | 1068 | 946 | 10 | — |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AlexYin-Tongji/dsh-ui-enhancer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
