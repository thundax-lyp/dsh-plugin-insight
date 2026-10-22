# dsh-zspace

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[7074390](https://github.com/439436269-ctrl/dsh-zspace/tree/70743909450191c09f3dcef15d46d8d0119200a9)

<!-- BEGIN META -->
[![npm 30d 1,242](https://img.shields.io/static/v1?label=npm+30d&message=1%2C242&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-zspace) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-zspace)
<!-- END META -->

> **实现功能**：用 19 个模型工具管理极空间 NAS 文件、容器和系统状态。

> **核心亮点**：双通道自动探测与业务错误判定提升家用 NAS 可达性，且能区分 containerd 卡死与需整机重启。 详见[Q03](#research-q03)。

> **风险与缺陷**：依赖社区逆向/私有 API 与本地 vuex 凭据；confirm=true 仍只是模型参数，不能替代人在设备级破坏操作前的独立批准。 详见[Q04](#research-q04)。

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
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 场景：适合从对话读取/传输 NAS 文件、检查容器和健康状态？](#detail-section-11)
  - [Q02 · 机制：客户端在 WebDAV 直连和桌面客户端 relay 间选择，同次调用可回退？](#detail-section-12)
  - [Q03 · 贡献：双通道自动探测与业务错误判定提升家用 NAS 可达性，且能区分 containerd 卡死与需整机重启。？](#detail-section-13)
  - [Q04 · 局限：依赖社区逆向/私有 API 与本地 vuex 凭据？](#detail-section-14)
  - [Q05 · 依赖：需要极空间设备、桌面客户端已登录或 WebDAV 凭据/网络？](#detail-section-15)
  - [Q06 · 成本与效果：通常复用已有 NAS，但大文件传输占带宽、容器/重启中断服务？](#detail-section-16)
  - [Q07 · 工程：HTTP 200 内业务失败检查、30秒重探与健康分类有价值？](#detail-section-17)
  - [Q08 · 假设：把读写工具拆成不同权限，并要求重启/删除通过 Host 侧一次性批准令牌，可显著降低模型误触发半径。？](#detail-section-18)
  - [Q09 · 采用：保持观察，不连接承载唯一数据或家庭核心服务的 NAS？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合从对话读取/传输 NAS 文件、检查容器和健康状态；重启、删除等管理任务用官方客户端更易确认目标。 详见[Q01](#research-q01)。

适合从对话读取/传输 NAS 文件、检查容器和健康状态；重启、删除等管理任务用官方客户端更易确认目标。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

#### 能力明细

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 模型工具 | 文件、Docker、系统健康与重启等 19 个 NAS 操作 | 固件/API 版本矩阵、非幂等回退和灾难恢复路径未验证 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| 极空间 NAS/账户 | 必需 | 目标资源与权限 | 无操作目标 |
| 桌面客户端 relay | 默认通道 | 复用登录态 | 回退 WebDAV |
| WebDAV 凭据 | 可选直连 | 文件操作 | 凭据泄漏风险 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 只读接入 | 先列目录/健康 | 核设备与路径 |
| 故障注入 | 切断一种通道 | 确认同次回退次数 |
| 写操作 | 独立批准目标/备份 | 记录 operation id |
| 恢复 | 官方客户端核状态 | 必要时从备份还原 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 接入 | 已有 NAS/客户端/凭据 | 配置两通道 | 固件适配未知 |
| 传输 | 局域网带宽和磁盘 IO | 选择文件/目录 | 大文件耗时 |
| 破坏恢复 | 服务中断与数据恢复 | 备份/人工确认 | 最坏损失高 |

#### 效果

| 效果项 | 源码支持 | 验证指标 |
| --- | --- | --- |
| 对话式文件管理 | 19 工具统一入口 | 任务成功率 |
| 通道韧性 | 直连/relay 回退 | 故障恢复率 |
| 官方客户端对照 | 自动化更强但风险更高 | 每任务人工分钟与误操作数 |

> **思考**：依赖社区逆向/私有 API 与本地 vuex 凭据；confirm=true 仍只是模型参数，不能替代人在设备级破坏操作前的独立批准。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：双通道自动探测与业务错误判定提升家用 NAS 可达性，且能区分 containerd 卡死与需整机重启。 详见[Q03](#research-q03)。

双通道自动探测与业务错误判定提升家用 NAS 可达性，且能区分 containerd 卡死与需整机重启。 详见[Q03](#research-q03)。

HTTP 200 内业务失败检查、30秒重探与健康分类有价值；写操作需要 operation id、幂等键和调用前后快照。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

依赖社区逆向/私有 API 与本地 vuex 凭据；confirm=true 仍只是模型参数，不能替代人在设备级破坏操作前的独立批准。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

保持观察，不连接承载唯一数据或家庭核心服务的 NAS；先只开只读工具，在测试共享目录验证通道切换和重复请求。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 19 个 NAS 工具、WebDAV/relay 路由及健康分类；本轮未连接极空间设备、客户端或凭据，尤其未验证非幂等回退、删除与重启，因此不把静态确认视为设备操作验收。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/tools.js、lib/client/router.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 README.md、lib/index.js、lib/tools.js、lib/zspace-client.js 与 prepared inventory；未安装、未运行、未访问真实账号/设备/服务。固件/API 版本矩阵、非幂等回退和灾难恢复路径未验证。
- 下一步：下一步只做本项可证伪实验：在测试共享目录注入直连超时/relay 恢复，逐工具记录请求次数；对删除/重启做 dry-run 与备份恢复演练。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-zspace](https://github.com/439436269-ctrl/dsh-zspace)
- **版本号**：0.4.0（[固定提交 7074390](https://github.com/439436269-ctrl/dsh-zspace/tree/70743909450191c09f3dcef15d46d8d0119200a9)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把读写工具拆成不同权限，并要求重启/删除通过 Host 侧一次性批准令牌，可显著降低模型误触发半径。 详见[Q08](#research-q08)。

下一步只做本项可证伪实验：在测试共享目录注入直连超时/relay 恢复，逐工具记录请求次数；对删除/重启做 dry-run 与备份恢复演练。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 618 | — | — | 9835 |
| .js | source | 43 | 4789 | 3056 | 1443 | — |
| .js | test | 4 | 1940 | 1596 | 214 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/439436269-ctrl/dsh-zspace/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：模型直控 NAS 的双通道路由是否能在不可逆操作与私有 API 漂移下保持可恢复？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 场景：适合从对话读取/传输 NAS 文件、检查容器和健康状态？

**研究主题**：场景与需求

#### 完整回答

适合从对话读取/传输 NAS 文件、检查容器和健康状态；重启、删除等管理任务用官方客户端更易确认目标。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-zspace/blob/70743909450191c09f3dcef15d46d8d0119200a9/README.md#L1-L5)

固定提交复核：场景相关声明与实现入口。

```text
# dsh-zspace

[![npm](https://img.shields.io/npm/v/dsh-zspace.svg)](https://www.npmjs.com/package/dsh-zspace)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![dsh-plugin](https://img.shields.io/badge/awesome-dsh--plugin-listed-8a2be2.svg)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
```

#### 缺口

- 固件/API 版本矩阵、非幂等回退和灾难恢复路径未验证
  **影响**：场景结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在测试共享目录注入直连超时/relay 恢复，逐工具记录请求次数；对删除/重启做 dry-run 与备份恢复演练

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 机制：客户端在 WebDAV 直连和桌面客户端 relay 间选择，同次调用可回退？

**研究主题**：功能与机制

#### 完整回答

客户端在 WebDAV 直连和桌面客户端 relay 间选择，同次调用可回退；19 个工具覆盖文件、Docker、状态和系统重启。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools.js:1-10](https://github.com/439436269-ctrl/dsh-zspace/blob/70743909450191c09f3dcef15d46d8d0119200a9/lib/tools.js#L1-L10)

固定提交复核：机制相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Tool registry for the 极空间 (ZSpace) plugin.
 *
 * One tool per file under `./tools/`, in the order the model should see them.
 * Each factory receives the shared context and returns a plain tool spec, which
 * `lib/index.js` turns into a registered host tool.
 *
 * @module dsh-zspace/tools
 */

```

</details>

#### 缺口

- 固件/API 版本矩阵、非幂等回退和灾难恢复路径未验证
  **影响**：机制结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在测试共享目录注入直连超时/relay 恢复，逐工具记录请求次数；对删除/重启做 dry-run 与备份恢复演练

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 贡献：双通道自动探测与业务错误判定提升家用 NAS 可达性，且能区分 containerd 卡死与需整机重启。？

**研究主题**：贡献与相对优势

#### 完整回答

双通道自动探测与业务错误判定提升家用 NAS 可达性，且能区分 containerd 卡死与需整机重启。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-zspace/blob/70743909450191c09f3dcef15d46d8d0119200a9/README.md#L1-L5)

固定提交复核：贡献相关声明与实现入口。

```text
# dsh-zspace

[![npm](https://img.shields.io/npm/v/dsh-zspace.svg)](https://www.npmjs.com/package/dsh-zspace)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![dsh-plugin](https://img.shields.io/badge/awesome-dsh--plugin-listed-8a2be2.svg)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
```

#### 缺口

- 固件/API 版本矩阵、非幂等回退和灾难恢复路径未验证
  **影响**：贡献结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在测试共享目录注入直连超时/relay 恢复，逐工具记录请求次数；对删除/重启做 dry-run 与备份恢复演练

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 局限：依赖社区逆向/私有 API 与本地 vuex 凭据？

**研究主题**：缺陷与关键质疑

#### 完整回答

依赖社区逆向/私有 API 与本地 vuex 凭据；confirm=true 仍只是模型参数，不能替代人在设备级破坏操作前的独立批准。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools.js:1-10](https://github.com/439436269-ctrl/dsh-zspace/blob/70743909450191c09f3dcef15d46d8d0119200a9/lib/tools.js#L1-L10)

固定提交复核：局限相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Tool registry for the 极空间 (ZSpace) plugin.
 *
 * One tool per file under `./tools/`, in the order the model should see them.
 * Each factory receives the shared context and returns a plain tool spec, which
 * `lib/index.js` turns into a registered host tool.
 *
 * @module dsh-zspace/tools
 */

```

</details>

#### 缺口

- 固件/API 版本矩阵、非幂等回退和灾难恢复路径未验证
  **影响**：局限结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在测试共享目录注入直连超时/relay 恢复，逐工具记录请求次数；对删除/重启做 dry-run 与备份恢复演练

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖：需要极空间设备、桌面客户端已登录或 WebDAV 凭据/网络？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要极空间设备、桌面客户端已登录或 WebDAV 凭据/网络；账户权限、固件版本和局域网拓扑共同决定结果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-zspace/blob/70743909450191c09f3dcef15d46d8d0119200a9/README.md#L1-L5)

固定提交复核：依赖相关声明与实现入口。

```text
# dsh-zspace

[![npm](https://img.shields.io/npm/v/dsh-zspace.svg)](https://www.npmjs.com/package/dsh-zspace)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![dsh-plugin](https://img.shields.io/badge/awesome-dsh--plugin-listed-8a2be2.svg)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
```

#### 缺口

- 固件/API 版本矩阵、非幂等回退和灾难恢复路径未验证
  **影响**：依赖结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在测试共享目录注入直连超时/relay 恢复，逐工具记录请求次数；对删除/重启做 dry-run 与备份恢复演练

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本与效果：通常复用已有 NAS，但大文件传输占带宽、容器/重启中断服务？

**研究主题**：效果与总成本

#### 完整回答

通常复用已有 NAS，但大文件传输占带宽、容器/重启中断服务；错误回退可能重复非幂等请求，恢复工时未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-zspace/blob/70743909450191c09f3dcef15d46d8d0119200a9/README.md#L1-L5)

固定提交复核：成本与效果相关声明与实现入口。

```text
# dsh-zspace

[![npm](https://img.shields.io/npm/v/dsh-zspace.svg)](https://www.npmjs.com/package/dsh-zspace)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![dsh-plugin](https://img.shields.io/badge/awesome-dsh--plugin-listed-8a2be2.svg)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
```

#### 缺口

- 固件/API 版本矩阵、非幂等回退和灾难恢复路径未验证
  **影响**：成本与效果结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在测试共享目录注入直连超时/relay 恢复，逐工具记录请求次数；对删除/重启做 dry-run 与备份恢复演练

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 工程：HTTP 200 内业务失败检查、30秒重探与健康分类有价值？

**研究主题**：工程质量与复用

#### 完整回答

HTTP 200 内业务失败检查、30秒重探与健康分类有价值；写操作需要 operation id、幂等键和调用前后快照。

#### 证据与依据

**依据 1 · 源码核查**：[lib/tools.js:1-10](https://github.com/439436269-ctrl/dsh-zspace/blob/70743909450191c09f3dcef15d46d8d0119200a9/lib/tools.js#L1-L10)

固定提交复核：工程相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Tool registry for the 极空间 (ZSpace) plugin.
 *
 * One tool per file under `./tools/`, in the order the model should see them.
 * Each factory receives the shared context and returns a plain tool spec, which
 * `lib/index.js` turns into a registered host tool.
 *
 * @module dsh-zspace/tools
 */

```

</details>

#### 缺口

- 固件/API 版本矩阵、非幂等回退和灾难恢复路径未验证
  **影响**：工程结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在测试共享目录注入直连超时/relay 恢复，逐工具记录请求次数；对删除/重启做 dry-run 与备份恢复演练

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 假设：把读写工具拆成不同权限，并要求重启/删除通过 Host 侧一次性批准令牌，可显著降低模型误触发半径。？

**研究主题**：新假设与验证

#### 完整回答

把读写工具拆成不同权限，并要求重启/删除通过 Host 侧一次性批准令牌，可显著降低模型误触发半径。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-zspace/blob/70743909450191c09f3dcef15d46d8d0119200a9/README.md#L1-L5)

固定提交复核：假设相关声明与实现入口。

```text
# dsh-zspace

[![npm](https://img.shields.io/npm/v/dsh-zspace.svg)](https://www.npmjs.com/package/dsh-zspace)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![dsh-plugin](https://img.shields.io/badge/awesome-dsh--plugin-listed-8a2be2.svg)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
```

#### 缺口

- 固件/API 版本矩阵、非幂等回退和灾难恢复路径未验证
  **影响**：假设结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在测试共享目录注入直连超时/relay 恢复，逐工具记录请求次数；对删除/重启做 dry-run 与备份恢复演练

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 采用：保持观察，不连接承载唯一数据或家庭核心服务的 NAS？

**研究主题**：采用判断

#### 完整回答

保持观察，不连接承载唯一数据或家庭核心服务的 NAS；先只开只读工具，在测试共享目录验证通道切换和重复请求。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-zspace/blob/70743909450191c09f3dcef15d46d8d0119200a9/README.md#L1-L5)

固定提交复核：采用相关声明与实现入口。

```text
# dsh-zspace

[![npm](https://img.shields.io/npm/v/dsh-zspace.svg)](https://www.npmjs.com/package/dsh-zspace)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![dsh-plugin](https://img.shields.io/badge/awesome-dsh--plugin-listed-8a2be2.svg)](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
```

#### 缺口

- 固件/API 版本矩阵、非幂等回退和灾难恢复路径未验证
  **影响**：采用结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：在测试共享目录注入直连超时/relay 恢复，逐工具记录请求次数；对删除/重启做 dry-run 与备份恢复演练

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
