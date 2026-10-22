# dsh-plugin-market（99galaxy）

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[b976645](https://github.com/99galaxy/dsh-plugin-market/tree/b97664510aafd55a74f17e304e271956f1c07659)

<!-- BEGIN META -->
[![npm 30d 1,435](https://img.shields.io/static/v1?label=npm+30d&message=1%2C435&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@99galaxy/dsh-plugin-market) [![最新发布 2026-09-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@99galaxy/dsh-plugin-market)
<!-- END META -->

> **实现功能**：在 DSH 设置页浏览社区插件目录、查看安装版本并执行安装。

> **核心亮点**：相对逐条复制安装命令，增量是同屏目录/安装/更新比较、多源缓存与界面操作。目录与pnpm能力归上游，本插件提供接线与状态整理；目录收录/下载不等于质量或兼容。

> **风险与缺陷**：“装当前profile”与更新是否符合用户预期？index硬编码PROFILE=web，安装/清单都传web；放到其他profile不自动跟随。更新执行目录命令可能从固定Git commit转npm源；多来源回退没有内容同一性证明。pnpm exit0也只说明安装流程结束，不是插件加载或宿主业务验收。

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

> **用途**：用户在GUI查目录与已安装/可更新项，点击安装；交付profile依赖变化，仍须重启和核对插件加载。

参照手工dsh plugin add和常规市场UI；不将目录内容认作插件质量证据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Host 路由**：目录列表和安装HTTP。
- **界面**：全部/已安装/可更新设置页。
- **后台**：目录缓存、多来源回退与pnpm helper。

**流程与依赖**

index提供list/install同源HTTP，helper抓多来源目录缓存1小时、读profile安装清单，safeSpec解析安装命令后以单argv给Node helper再调用pnpm；client提供三个页内tab。

DSH webServer/settings槽位、Node/pnpm/profile写权限、目录域/镜像/CDN/npm可达性。

读取缓存/回退抓目录→比web已装版本→用户选安装→同源JSON校验/safeSpec→helper/pnpm→失效清单缓存→用户重启核载入。

host/client现成产物，固定web profile；更新版本来自目录，不是每插件源码实时比较。

**效果与成本**

首次装bundle并重启，持续网络/缓存/更新源核查和失败日志维护；无平台费实测，安装后测试成本另计。

降低发现与操作门槛，不能把目录热度、版本高或安装成功当采用推荐。

> **思考**：“装当前profile”与更新是否符合用户预期？index硬编码PROFILE=web，安装/清单都传web；放到其他profile不自动跟随。更新执行目录命令可能从固定Git commit转npm源；多来源回退没有内容同一性证明。pnpm exit0也只说明安装流程结束，不是插件加载或宿主业务验收。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对逐条复制安装命令，增量是同屏目录/安装/更新比较、多源缓存与界面操作。目录与pnpm能力归上游，本插件提供接线与状态整理；目录收录/下载不等于质量或兼容。

相对逐条复制安装命令，增量是同屏目录/安装/更新比较、多源缓存与界面操作。目录与pnpm能力归上游，本插件提供接线与状态整理；目录收录/下载不等于质量或兼容。

避免shell、拒绝leading-dash选项、安装串行锁和缓存失效可借鉴；目录信任/profile选择及安装后验收仍需明确。

固定源码依据：[index.js](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/index.js)、[market-core.mjs](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/market-core.mjs)、[client/client.js](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/client/client.js)、[package.json](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

“装当前profile”与更新是否符合用户预期？index硬编码PROFILE=web，安装/清单都传web；放到其他profile不自动跟随。更新执行目录命令可能从固定Git commit转npm源；多来源回退没有内容同一性证明。pnpm exit0也只说明安装流程结束，不是插件加载或宿主业务验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

主要用web profile的人先浏览目录；点击前检查来源和版本，固定commit用户别直接更新，其他profile先核目标，安装后重启确认加载。

核查状态：源码支持目录/安装工具链；未联网抓目录、安装包或宿主验收，目录可信度与供应链未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：1.1.1；版本日期：2026-09-23（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[b9766451](https://github.com/99galaxy/dsh-plugin-market/tree/b97664510aafd55a74f17e304e271956f1c07659)；本轮基准：2026-10-21T04:06:46Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：抽读index/helper/client和manifest；未验证目录当前规模、镜像、pnpm安装或版本实际兼容。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

待验证假设：从宿主取得明确profile并让用户审核旧spec→新spec/版本摘要，目录回退绑定签名或摘要，可减少错profile与来源漂移。由硬编码web和目录命令驱动推导，未实现。对照desktop/custom profile、Git固定版转npm及镜像内容不同，测目标准确性和拒绝未知来源；更新保持人工确认。

隔离profile验证web硬编码、来源更新差异、恶意spec拒绝、镜像漂移和安装后加载失败；本轮不执行安装。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1180 | 932 | 174 | — |
| .mjs | source | 19 | 2881 | 2201 | 469 | — |
| .md | source | 1 | 157 | — | — | 1459 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/99galaxy/dsh-plugin-market/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
