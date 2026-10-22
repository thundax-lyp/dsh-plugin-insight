# dock

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[8535f6e](https://github.com/AKS1st/dock/tree/8535f6e24670931d9e93fb087ab474e38aa01856)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dock) [![npm 30d 1,532](https://img.shields.io/static/v1?label=npm+30d&message=1%2C532&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-base) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-base)
<!-- END META -->

> **实现功能**：向扩展提供活动栏、浮窗、编辑视图、状态和设置注册服务的客户端工作台。

> **核心亮点**：以独立注册域、实例seed和关闭钩子减少每个扩展自建窗口的重复工作；注册ID冲突拒绝、释放时按定义身份清理，生命周期比单纯固定按钮更完整。没有实现新窗口协议或远程一致性。

> **风险与缺陷**：各扩展vendored类型契约只在编译时检查，真实ctx.workbench版本兼容仍需验收。localStorage是浏览器本地状态，不等于跨设备同步或可靠工作成果存储；异步关闭钩子正确性不代表业务保存已成功。

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

> **用途**：需要在DSH聊天旁组织多个文件/工具面板的用户与扩展作者。

参照IDE工作台与宿主原有侧栏；本项贡献是DSH客户端的统一注册、布局和视图生命周期，文件读写并非基座自身能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：四边Dock、浮窗、设置与布局
- **后台**：客户端workbench扩展注册及视图生命周期服务

**流程与依赖**

客户端先ctx.provide(workbench)，service管理插件、活动、面板、编辑、状态、命令和设置注册；layout/settings存储本地布局，Shell渲染各扩展。主机入口不实现业务路由。

宿主uiSession、React客户端环境和扩展复制的WorkbenchService契约；文件、Git、预览等功能由另行安装的扩展提供。

基座启动→扩展注册带disposer的定义→用户打开视图实例→更新布局→关闭/替换前运行beforeClose→本地保存布局。

**效果与成本**

首次需迁移入口与扩展接线；持续承担工作台契约和布局兼容。无模型调用，界面与本地存储成本随窗口数增加。

统一交互有减少重复开发的潜力，没有扩展迁移工时或真实使用收益数据。

> **思考**：各扩展vendored类型契约只在编译时检查，真实ctx.workbench版本兼容仍需验收。localStorage是浏览器本地状态，不等于跨设备同步或可靠工作成果存储；异步关闭钩子正确性不代表业务保存已成功。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：以独立注册域、实例seed和关闭钩子减少每个扩展自建窗口的重复工作；注册ID冲突拒绝、释放时按定义身份清理，生命周期比单纯固定按钮更完整。没有实现新窗口协议或远程一致性。

以独立注册域、实例seed和关闭钩子减少每个扩展自建窗口的重复工作；注册ID冲突拒绝、释放时按定义身份清理，生命周期比单纯固定按钮更完整。没有实现新窗口协议或远程一致性。

注册器带disposer、重复ID检测及统一beforeClose是可借鉴机制；契约副本同步与本地布局迁移是后续维护条件。

源码依据：[src/index.ts](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/index.ts)、[src/client/index.ts](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/index.ts)、[src/client/contract.ts](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/contract.ts)、[src/client/service.ts](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/service.ts)。

<a id="detail-section-5"></a>

### 1.4 主要限制

各扩展vendored类型契约只在编译时检查，真实ctx.workbench版本兼容仍需验收。localStorage是浏览器本地状态，不等于跨设备同步或可靠工作成果存储；异步关闭钩子正确性不代表业务保存已成功。

<a id="detail-section-6"></a>

### 1.5 使用建议

先与少量扩展验证打开、关闭和重载；将布局持久化与文件保存分别验收。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AKS1st/dock](https://github.com/AKS1st/dock)
- **版本号**：0.2.4（[固定提交 8535f6e2](https://github.com/AKS1st/dock/tree/8535f6e24670931d9e93fb087ab474e38aa01856)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/client/index.ts、src/client/contract.ts、src/client/service.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：固定宿主核注册释放、异步拒绝关闭、扩展缺失恢复、localStorage异常与契约版本差异；本轮未启动。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：服务启动公开能力版本并让扩展按需求协商，可将方法缺失转为明确兼容提示。用旧新扩展、拒绝/异步关闭和卸载重载矩阵比较故障定位时间及状态丢失。

固定宿主核注册释放、异步拒绝关闭、扩展缺失恢复、localStorage异常与契约版本差异；本轮未启动。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：3bdaa863442cceb79cf27b16961389ebca0e4b541f955b77c445fc90de1f0203。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2814 | 2500 | 313 | — |
| .md | source | 2 | 248 | — | — | 3267 |
| .tsx | source | 3 | 999 | 823 | 120 | — |
| .ts | source | 12 | 2437 | 1826 | 472 | — |
| .ts | test | 2 | 406 | 363 | 9 | — |
| .mjs | source | 1 | 53 | 38 | 13 | — |

排除 15 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dock/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
