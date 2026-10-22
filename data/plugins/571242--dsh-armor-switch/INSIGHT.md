# dsh-armor-switch

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[24966ed](https://github.com/571242/dsh-armor-switch/tree/24966edef55f27e795b095e94f5b61508a125e3f)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/571242/dsh-armor-switch)
<!-- END META -->

> **实现功能**：提供运行时提示契约切换及可选的宿主、Profile文案维护和恢复操作。

> **核心亮点**：作者主张减少过度自审；源码可确认的是把提示装配热切换、偏好持久化和可逆维护统一到UI。相对直接编辑提示，开关不需反复注册；host-clean的锚点及manifest为特定宿主字节修改提供恢复依据。它不能改变供应商模型规则或增加网络能力。

> **风险与缺陷**：提示文字优先权宣告不等于实际指令优先权，效果依赖模型；minimal完整预设会抑制这些注册。更关键的是主开关关闭不代表独立host-clean已还原，等长字节改写绑定宿主版本，升级或不完整恢复可能留下不同状态。 profile-clean的BLOCK_BODY还会设置danger-full-access、approval never及默认权限预设，实际作用不仅是文案维护，需独立核对执行权限变化。

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

替代是用户自定义系统提示和手动备份修改；该项目增加运行时控件及特定宿主字节维护，后者迁移负担更大。

<a id="detail-section-3"></a>

### 1.2 能力、依赖与流程

src/index.js通过systemPrompt动态text注册契约和上下文；独立host-clean/profile-clean模块可改写宿主归档及配置，并维护恢复记录。

- **界面**：运行时契约开关及维护状态
- **后台**：宿主与Profile修改及恢复记录

依赖systemPrompt、Schemastery及特定Desktop宿主布局；宿主维护涉及app.asar和Profile文件权限。

加载提示注册→UI切换下一次装配→可选显式宿主/Profile维护→按不同生效时机重启或新建会话→依据manifest恢复。

<a id="detail-section-4"></a>

### 1.3 成本与效果

首次需核对特定DSH版本及安装路径；维护涉及归档备份、重启和升级适配，现金无固定费用但人工恢复成本可能显著。

集中切换与恢复信息有维护价值，但没有模型任务成功率的独立对照，不能保证减少拒答。

<a id="detail-section-5"></a>

### 1.4 工程亮点

动态text返回空串避免重复注册；源码分离preferences和维护模块。锚点、前缀与指纹验证比盲替换更可审计，但与宿主内部格式耦合仍高。

源码依据：[src/index.js](https://github.com/571242/dsh-armor-switch/blob/24966edef55f27e795b095e94f5b61508a125e3f/src/index.js)、[src/host-clean.js](https://github.com/571242/dsh-armor-switch/blob/24966edef55f27e795b095e94f5b61508a125e3f/src/host-clean.js)、[src/profile-clean.js](https://github.com/571242/dsh-armor-switch/blob/24966edef55f27e795b095e94f5b61508a125e3f/src/profile-clean.js)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：适合研究DSH提示装配与自有环境维护的开发者；提示开关、宿主改写和配置改写要分别核对。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **界面**：运行时契约开关及维护状态
- **后台**：宿主与Profile修改及恢复记录

> **思考**：提示文字优先权宣告不等于实际指令优先权，效果依赖模型；minimal完整预设会抑制这些注册。更关键的是主开关关闭不代表独立host-clean已还原，等长字节改写绑定宿主版本，升级或不完整恢复可能留下不同状态。 profile-clean的BLOCK_BODY还会设置danger-full-access、approval never及默认权限预设，实际作用不仅是文案维护，需独立核对执行权限变化。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：作者主张减少过度自审；源码可确认的是把提示装配热切换、偏好持久化和可逆维护统一到UI。相对直接编辑提示，开关不需反复注册；host-clean的锚点及manifest为特定宿主字节修改提供恢复依据。它不能改变供应商模型规则或增加网络能力。

<a id="detail-section-9"></a>

### 1.8 使用建议

只建议在可恢复的独立Profile中检查机制。先看改写清单和恢复记录，分别确认提示、归档及Profile状态；不要把UI关闭理解为全部回滚。

**核查状态**：已检查固定版本源码，未安装、执行目标插件或完成真实宿主验收。已有贡献仅由固定版本源码支持，实际宿主和任务效果尚未验证；未来设计假设保持未验证。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[571242/dsh-armor-switch](https://github.com/571242/dsh-armor-switch)
- **版本号**：1.1.2（[固定提交 24966ede](https://github.com/571242/dsh-armor-switch/tree/24966edef55f27e795b095e94f5b61508a125e3f)）
- **版本日期**：2026-10-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.js、src/host-clean.js、src/profile-clean.js、作者README与固定范围inventory；源码抽读不等于完整审计。
- 未完成：目标插件执行、测试、安装、模型调用和真实宿主验收。
- 证据限制：核查固定提交内列明入口、核心实现及相关配置/作者材料的源码子集；未执行插件、其测试、安装、付费请求或真实宿主验收，未核实独立用户采用。
- 下一步：只在复制环境核对各开关生效时机、minimal预设、宿主升级不匹配与逐字节恢复；本轮未改写宿主。

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：以纯只读差异预览和逐模块恢复状态代替单一总开关，可减少用户误判。用运行时开关、磁盘归档、新会话配置的组合场景测状态理解与恢复成功；不把解除模型限制当实验目标。

只在复制环境核对各开关生效时机、minimal预设、宿主升级不匹配与逐字节恢复；本轮未改写宿主。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：78ff7da0f061ce6be43c80334318de3781749a7ef00e7f63d2c731733e79f723。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1870 | — | — | 17815 |
| .mjs | source | 1 | 396 | 279 | 73 | — |
| .js | source | 6 | 2170 | 1546 | 479 | — |
| .mjs | test | 2 | 317 | 308 | 2 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/571242/dsh-armor-switch/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
