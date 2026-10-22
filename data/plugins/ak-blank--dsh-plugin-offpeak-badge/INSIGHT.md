# offpeak-badge

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[7baac21](https://github.com/AK-blank/dsh-plugin-offpeak-badge/tree/7baac218a3ac9a7a31964bda164284c4647cf308)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-offpeak-badge)
<!-- END META -->

> **实现功能**：在 DSH Web 侧栏显示按内置规则计算的高峰/空闲时段。

> **核心亮点**：把分散的时间窗与节假日规则变为常驻决策提示，尤其显式说明缺失年份日历会降级，优于只有一个固定倒计时。贡献是规则可见性与界面集成，计费规则来自作者引用资料，不能算原创调度或节费机制。

> **风险与缺陷**：用户看到绿色是否真的意味着该请求会被按较低单价计费？源码不读取账号、模型、网关或账单，只依赖本机时钟与2025/2026日历；政策变更、代理服务与未知年份都可能使提示偏离实际。因此只能解释为内置规则状态，不能承诺“半价”。

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

> **用途**：面向需要手动安排非紧急 API 任务的用户，交付物是当前时段与下一切换时间提示。

可自行查价格页与北京时间，或用日历提醒；该插件的增量是持续可见而非新的计价/调度能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：品牌行时段徽标、折叠侧栏overlay小点、规则tooltip与屏幕阅读器公告。

**流程与依赖**

浏览器按 Asia/Shanghai 日历解释时钟，工作日排除内置法定假日后判断两个半开时间窗；侧栏品牌单槽优先级 -1 重绘词标并加标记，折叠侧栏以 overlay 定位小点，同时提供 aria-live 提示。

Node包加载、DSH Web client module/slots/locale与React；依赖本机时间正确和规则仍适用。

页面加载注册词典及座位，时钟更新状态，悬停显示规则和切换时间；不发请求、不改任务、不存账单。

双面 Cordis 包：Host空apply让client模块入图，浏览器依赖React、官方UI primitives以及slots/locale。

**效果与成本**

现金：无新增API或远程数据调用；可能节省金额没有账单证据。人工：每年更新日历并随政策修正规则，DSH私有CSS选择器或品牌slot变化需要维护。

减少查日历和换算时区的操作；并不估算token成本、校验账号资格或自动调整任务时间。

> **思考**：用户看到绿色是否真的意味着该请求会被按较低单价计费？源码不读取账号、模型、网关或账单，只依赖本机时钟与2025/2026日历；政策变更、代理服务与未知年份都可能使提示偏离实际。因此只能解释为内置规则状态，不能承诺“半价”。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把分散的时间窗与节假日规则变为常驻决策提示，尤其显式说明缺失年份日历会降级，优于只有一个固定倒计时。贡献是规则可见性与界面集成，计费规则来自作者引用资料，不能算原创调度或节费机制。

把分散的时间窗与节假日规则变为常驻决策提示，尤其显式说明缺失年份日历会降级，优于只有一个固定倒计时。贡献是规则可见性与界面集成，计费规则来自作者引用资料，不能算原创调度或节费机制。

规则函数与显示层分离，时区固定、时间窗半开、未知年份提示降级；overlay避开已有连接状态槽。但折叠定位依赖class片段并每秒测量，品牌单槽接管需要跟随宿主变化。

固定源码依据：[lib/client.js](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/lib/client.js)、[lib/index.js](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/lib/index.js)、[package.json](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/package.json)、[cordis.patch.yml](https://github.com/AK-blank/dsh-plugin-offpeak-badge/blob/7baac218a3ac9a7a31964bda164284c4647cf308/cordis.patch.yml)。

<a id="detail-section-5"></a>

### 1.4 主要限制

用户看到绿色是否真的意味着该请求会被按较低单价计费？源码不读取账号、模型、网关或账单，只依赖本机时钟与2025/2026日历；政策变更、代理服务与未知年份都可能使提示偏离实际。因此只能解释为内置规则状态，不能承诺“半价”。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在确认自己的服务确实适用该内置规则时，把它当作时间提示；不依据徽标单独做费用承诺或自动延迟紧急任务。

核查状态：本地规则与呈现路径可确认；规则是否匹配用户当前服务合同及实际节费未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：1.0.0；版本日期：2026-10-03（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[7baac218](https://github.com/AK-blank/dsh-plugin-offpeak-badge/tree/7baac218a3ac9a7a31964bda164284c4647cf308)；本轮基准：2026-10-21T05:26:52Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根组件的浏览器规则、日历、侧栏/overlay注册与包清单；不核定外部价格页面现状、不执行作者测试。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

若将规则版本、适用服务及有效期作为可见数据，并用脱敏账单样本校验，可能降低把通用时段误当个人计费结果的概率。对不同模型/渠道的固定样本比较“可适用/未知”的判断准确率；若仍把不适用渠道判为适用，则不成立。

可证伪验证需用账单样本对照规则适用性，再检查工作日边界、节假日及未知年份；未运行代码、未访问计费账号。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 2 | 650 | 506 | 78 | — |
| .js | source | 2 | 630 | 452 | 146 | — |
| .md | source | 2 | 482 | — | — | 5282 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-offpeak-badge/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-offpeak-badge/issues?q=is%3Aissue+created%3A2026-09-21T05%3A33%3A23.262Z..2026-10-21T05%3A33%3A23.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AK-blank/dsh-plugin-offpeak-badge/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A33%3A23.262Z..2026-10-21T05%3A33%3A23.262Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
