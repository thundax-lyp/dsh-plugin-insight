# dsh Browser Control

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f7bafd3](https://github.com/omdsh-dev/dsh-browser/tree/f7bafd3191e96745cb94a1074d189e23a30b3d3b)

<!-- BEGIN META -->
[![GitHub ★ 987](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=987&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-browser)
<!-- END META -->

> **功能**：以DSH桥和浏览器扩展控制已登录标签页，支持页面读取、操作、截图与原生输入。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持把已有登录页面、编号/选择器与侧栏会话连成实际工具执行，并在批准后复核目标/来源。截图与原生输入扩展可操作面，但分别带权限/数据代价，未独立证明总收益。

> **主要限制**：[Q02](#research-q02)至[Q05](#research-q05)表明自动读页与可选unrestricted改变审批保证，字段遮罩不覆盖截图/全部网络结果，本机文件/剪贴板是真实副作用；安装顺序也非整组回滚。真实账号与失败重试需人工核网页结果，不能靠工具ok或作者速度数字验收。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁使用整套浏览器控制工具，作者性能基准证明到哪里？](#detail-section-11)
  - [Q02 · 共享标签、来源审批和等待后复核如何约束真实执行？](#detail-section-12)
  - [Q03 · 字段遮罩与截图、网络和JS工具的隐私边界是什么？](#detail-section-13)
  - [Q04 · 本机文件、剪贴板和原生输入怎样改变权限与失败含义？](#detail-section-14)
  - [Q05 · 安装、升级和退出是否像一个可回滚插件安装？](#detail-section-15)
  - [Q06 · 什么人值得承担整套工具负担，怎样判定继续或停止？](#detail-section-16)
  - [Q07 · 已有文档/目标检查之外，什么方向值得独立检验？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：根组件是桥插件加 Chrome/Firefox 扩展的独立工作区工具套件，不是单一 npm 插件，也不是另造 DSH Agent。它面向已有登录网页任务、愿意明确选择控制标签和审阅动作的 DSH 用户，支持查页、表单、导航、标签管理以及部分原生输入和图像/开发者功能。合格交付由最终网页和业务状态确认，工具返回成功不是任务成功。

人工浏览加复制到DSH、隔离Playwright上下文与上游DSH循环；比较真实登录/会话交接和控件执行，不把作者小型本地基准当当前真实站点结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| DOM文本与控件 | 登录网页查读/表单 | 编号或selector，语义动态变化另核 |
| 标签/来源批准 | 绑定会话页并复核 | 默认auto读，信任/无约束改变弹窗保证 |
| 截图 | 页面视觉信息 | active/focused像素，无字段遮罩保证 |
| 原生输入/文件 | Chrome键鼠/粘贴/attach | debugger、本机文件与剪贴板副作用 |
| 开发者工具 | 页面JS和网络/console | 独立授权，敏感值可显式读取 |
| 一体安装 | 注册桥并构建复制扩展 | profile先于扩展构建，非整组回滚 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=24/pnpm与DSH rc.5 | 必需 | 工作区/桥/Host | 老Host不支持，非同名npm包 |
| Chrome125+或Firefox140+独立构建 | 必需 | 扩展和侧栏 | 原生/debugger功能不等价 |
| 可信本地profile/标签与共享选择 | 本文试用前提 | 限定真实账号/owner桥 | 多人/不可信公网不直接扩大 |
| 所选模型与Host附件 | 推理/图像按需 | 页面信息与截图 | 外发/持久费用依部署 |
| Chrome debugger/本机路径与剪贴板 | 可选原生操作必需 | 上传/键鼠/粘贴 | 文件是浏览器机器，不是远程Host |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定checkout/Host，备profile并用无敏感页面 | 不直接跑滚动脚本/重要账号 |
| 加载 | 构建注册桥和正确扩展，手工加载 | 标准plugin命令不足，平台能力单核 |
| 验证 | 核共享/标签/批准、等待中换页/取消 | 真实网页回读，不靠工具成功 |
| 扩大 | 仅需时独立验文件/剪贴板/devtools | 本机与数据副作用单独接受 |
| 退出 | 停任务、关扩展移profile桥并清归属授权 | 保留会话/附件，不自动撤网站变化 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Host/浏览器/构建资源未知 | 双端版本、权限、标签和模型 | 一行安装仍需手动加载 |
| 持续 | 快照/图像/token/磁盘未知 | 审批、业务核对、升级 | 作者工具耗时非总账单 |
| 失败 | 重抓/重试/恢复资源未知 | 实际网页/剪贴板/文件状态与安装阶段对账 | 非幂等不能盲重试 |
| 升级退出 | 保存旧构建/配置未知 | profile/扩展一致、撤信任和token | 非整组事务，不撤站点已有数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 页面控制 | 后台到真实DOM/原生输入 | 真实站点合格率与净人审 |
| 防错页 | 批准后文档/来源复核 | 同document语义变化 |
| 局部隐私 | 表单遮罩/网络默认掩码 | 截图/正文/显式敏感读取全链路 |
| 性能 | 作者本地配对方法/数字 | 同版本独立结果与生产成本 |

> **思考**：[Q02](#research-q02)至[Q05](#research-q05)表明自动读页与可选unrestricted改变审批保证，字段遮罩不覆盖截图/全部网络结果，本机文件/剪贴板是真实副作用；安装顺序也非整组回滚。真实账号与失败重试需人工核网页结果，不能靠工具ok或作者速度数字验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持把已有登录页面、编号/选择器与侧栏会话连成实际工具执行，并在批准后复核目标/来源。截图与原生输入扩展可操作面，但分别带权限/数据代价，未独立证明总收益。

后台目标/授权/取消分离、批准后再验document、仅缺接收器补注入值得复用；默认读页/可选高权限、像素/网络/本机边界与非事务安装必须共同说明，不泛称完整安全。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)至[Q05](#research-q05)表明自动读页与可选unrestricted改变审批保证，字段遮罩不覆盖截图/全部网络结果，本机文件/剪贴板是真实副作用；安装顺序也非整组回滚。真实账号与失败重试需人工核网页结果，不能靠工具ok或作者速度数字验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

用独立本地profile、固定双端版本和无敏感测试站点起步，先不开unrestricted/devtools/本机文件功能。核共享、标签和批准后变化，按真实网页验结果；不明副作用就停止重试并退人工。恢复/维护超过手工复制收益时退出，保留所需会话/附件。见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

整套工作区工具，固定源码支持扩展执行、权限/数据和安装边界；没有运行或独立复核作者基准。只建议非敏感测试站点受控试用，语义绑定仍是假设。

- 已检查：作者 README、包清单、源码路径 README.md、benchmark/README.md、extensions/dsh-browser/manifest.firefox.json、extensions/dsh-browser/manifest.json、extensions/dsh-browser/src/background/clipboard-write.ts、extensions/dsh-browser/src/background/devtools-serialization.ts、extensions/dsh-browser/src/background/index.ts、extensions/dsh-browser/src/background/input-actions.ts、extensions/dsh-browser/src/background/tab-affinity.ts、extensions/dsh-browser/src/background/tools.ts、extensions/dsh-browser/src/content/privacy.ts、extensions/dsh-browser/src/content/snapshot.ts、extensions/dsh-browser/src/offscreen/clipboard.ts、extensions/dsh-browser/src/shared/clipboard-document.ts、extensions/dsh-browser/src/shared/clipboard.ts、package.json、packages/browser/bridge-browser/src/devtools-tools.ts、packages/browser/bridge-browser/src/remote-host-api.ts、packages/browser/bridge-browser/src/screenshot-tools.ts、packages/browser/bridge-browser/src/server.ts、scripts/install.sh 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核根README/package、作者benchmark方法和results树、Chrome/Firefox manifests、后台真实路由/授权/tab-affinity、工具执行与截图、表单隐私/快照、网络格式化、CDP上传、剪贴板writer/offscreen/HTML清理与失败、shell安装阶段；未审Windows脚本全部内容、完整提取算法或浏览器/Host全部权限实现。
- 下一步：未运行插件、浏览器、模型、基准/目标测试或安装。作者数字不当独立运行，普通加载/冒烟为scope_boundary；状态竞态和总任务收益仍为研究缺口。

**分析版本**

- **仓库**：[omdsh-dev/dsh-browser](https://github.com/omdsh-dev/dsh-browser)
- **版本号**：0.1.4（[固定提交 f7bafd3](https://github.com/omdsh-dev/dsh-browser/tree/f7bafd3191e96745cb94a1074d189e23a30b3d3b)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07)推导未验证的高影响控件语义绑定，补同文档变化检查而非重复已有document/来源防线；与现实现对照错点、误拒及总恢复成本，当前机制足够或无净收益则不开发。

未运行插件、浏览器、模型、基准/目标测试或安装。作者数字不当独立运行，普通加载/冒烟为scope_boundary；状态竞态和总任务收益仍为研究缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 1358 | — | — | 23638 |
| .mjs | source | 16 | 3281 | 3055 | 70 | — |
| .mjs | test | 8 | 495 | 458 | 7 | — |
| .ts | source | 90 | 21026 | 16218 | 3422 | — |
| .tsx | source | 5 | 3769 | 3424 | 196 | — |
| .ts | test | 96 | 17983 | 15509 | 928 | — |
| .js | source | 1 | 180 | 160 | 9 | — |
| .mjs | example | 2 | 83 | 67 | 13 | — |

</details>

**活跃度**

[![Issue 未关闭 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=16&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-browser/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-browser/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)

暂未获取：近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断完整工具套件的浏览器执行/数据与本机权限、分发维护和受限采用价值。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用整套浏览器控制工具，作者性能基准证明到哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根组件是桥插件加 Chrome/Firefox 扩展的独立工作区工具套件，不是单一 npm 插件，也不是另造 DSH Agent。它面向已有登录网页任务、愿意明确选择控制标签和审阅动作的 DSH 用户，支持查页、表单、导航、标签管理以及部分原生输入和图像/开发者功能。合格交付由最终网页和业务状态确认，工具返回成功不是任务成功。

相对手工把网页复制进聊天，套件把真实标签、编号/选择器和侧栏会话连起来；相对 Playwright 独立上下文，可以在当前浏览器复用登录，但隔离性和可重放测试条件不同。它是文本优先并有截图工具，不应继续称纯文本或把截图等同全视觉策略。画布、依赖像素的控件和受保护浏览器页仍不能由常规DOM编号保证覆盖。

README报告2026-08-18的60次配对基准，使用同模型/profile、六个确定性本地任务和服务端状态验收。方法文档刻意对齐工具契约和运行顺序，比较的是完整后端而不是WebSocket微开销；成功样本延迟须与成功率/失败惩罚一起看。本次未取得作者原始基准结果，也没有运行或独立复核作者数字；其来源不是当前提交/任意真实站点的效果验收，也不能外推到重要账号或总成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-17](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/README.md#L7-L17)

整套身份、文本与截图及Host要求。

<details>
<summary>查看原文（11行）</summary>

```text
Connect [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) to the Chrome or Firefox tabs you are already using. The model can read page content, operate controls, navigate, and manage tabs while preserving your login state, session, and cookies. A side panel or sidebar provides the conversation UI.

`dsh` is DeepSeek AI's open-source, plugin-based agent harness. This repository provides a companion browser bridge plugin and Chrome/Firefox MV3 extension as one standalone pnpm workspace.

Pages become structured text with a numbered inventory of interactive elements. Tools address elements by number or selector; `browser_screenshot` captures the controlled tab's viewport after approval. The side panel also accepts PNG, JPEG, WebP, and GIF attachments when the host advertises image support.

> [!IMPORTANT]
> The workspace targets the latest public dsh release, currently pinned to 0.2.1-rc.5. Older DSH releases are not supported.

## Quick install

```

</details>

**依据 2 · 作者声明**：[README.md:31-47](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/README.md#L31-L47)

非同名npm包与作者配对基准。

<details>
<summary>查看原文（17行）</summary>

```text

When the installer opens `chrome://extensions`, follow its instructions to load or reload **dsh Browser Assistant**. If dsh is already running, restart it after installation. See [Detailed installation and usage](#detailed-installation-and-usage) for prerequisites, startup commands, updates, and developer installation.

> [!IMPORTANT]
> The unscoped [`dsh-browser`](https://www.npmjs.com/package/dsh-browser) package on npm belongs to a different project and is not affiliated with this repository. This project is not currently published as an npm package; use the installer above.

## Performance

In a paired 60-run end-to-end benchmark on August 18, 2026, both backends completed all 30 assigned runs successfully, while dsh Browser Control required fewer model/tool round trips and finished faster:

| Backend | Success | Mean end-to-end latency | Mean browser tool calls |
|---|---:|---:|---:|
| **dsh Browser Control** | **30/30** | **5.32 s** | **3.4** |
| Matched Playwright baseline | 30/30 | 6.67 s | 4.7 |

The paired Playwright / extension duration ratio was **1.24** (95% CI **1.16–1.34**): Playwright took about 24% longer, or equivalently, dsh Browser Control reduced latency by about 20% and saved 1.35 seconds per task on average. The suite used six browser tasks, five deterministic seeds, the same DSH profile and model (`deepseek-v4-flash`), and independently validated page state. See the [benchmark methodology and reproduction guide](benchmark/README.md).

```

</details>

**依据 3 · 作者声明**：[benchmark/README.md:62-98](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/benchmark/README.md#L62-L98)

确定性任务、契约/顺序对齐、失败惩罚方法。

<details>
<summary>查看原文（37行）</summary>

```text

`--output` 必须指向一个尚不存在的新文件；runner 会拒绝向旧 JSONL 追加另一轮 benchmark，避免不同套件版本、模型或环境被静默汇总。报告生成器也会拒绝聚合包含多个 `benchmarkSuiteVersion` 的 JSONL。需要合并分析时应保留各自文件，并显式按套件版本和配置分组后分别生成报告。

## 任务集

任务全部运行在 `127.0.0.1` 上的确定性网页中，不依赖外网数据：

| 任务 | 类型 | 验证方式 |
| --- | --- | --- |
| `order_lookup` | 读取 | 最终回答包含 seed 对应金额 |
| `notification_toggle` | 单步写操作 | 服务端状态确认已开启并保存 |
| `contact_form` | 表单 | 服务端状态确认三个字段和提交动作 |
| `inventory_filter` | 筛选 + 读取 | 服务端确认筛选值，回答确认唯一商品 |
| `cart_checkout` | 多步操作 | 服务端确认商品、数量和结算 |
| `lazy_load` | 动态内容 | 服务端确认加载动作，回答确认新代码 |

每个任务的可见数据随 seed 确定性变化，降低模型记住固定答案的可能。网页状态通过独立 HTTP API 验证，不依据模型自报“已完成”。

当前任务套件版本为 `2`。版本 `2` 修正了 `inventory_filter`：seed 继续改变商品根名称、SKU、价格和库存顺序，但不再把仅用于生成数据的 seed 数字拼进目标商品名。旧结果没有 `benchmarkSuiteVersion`，其成功率不能与版本 `2` 直接比较。以后只要任务提示、数据生成或 validator 语义变化，都必须递增该版本。

## 公平性控制

- 两边共享同一提示词、任务实例、DSH profile、模型选择、浏览器尺寸、locale 和时区。
- Playwright 适配器使用与扩展相同的 `browser_snapshot`、`browser_click`、`browser_type` 等模型可见工具名、说明、参数 schema 和通用系统提示；动作后的 DOM 稳定等待策略也使用相同时间预算。
- 两个 DSH 进程使用隔离的 session/storage 目录，避免相互污染；模型凭据仍来自同一个本机 DSH profile。
- 同任务、同 seed 形成一个 pair，谁先运行由确定性哈希交替，降低固定顺序导致的热身偏差。
- 提示词禁止非 `browser_*` 工具，validator 也会把使用其他工具的运行判为失败。
- 两边都使用当前仓库构建产物；正式评测前必须先执行 `pnpm build`。

## 指标定义

- `success`：网页外部状态和/或最终答案通过任务 validator，未使用禁用工具，并以 `turn/end: completed` 结束。
- `timings.completionMs`：调用 `session.prompt` 前到收到对应 `turn/end` 的端到端耗时，是报告的主指标。
- `timings.stateReachedMs`：写操作首次在独立网页状态 API 中达到目标的时间，50ms 轮询精度。
- `timings.ttftMs`：从主计时起点到第一个非空模型 stream delta。
- `timings.toolWallMs`：runner 从 `tool/call` 到匹配 `tool/result` 观察到的工具耗时之和。
- `tokens`：该 turn 中所有 assistant step 报告的 token 总和。报告将新输入、缓存读取、缓存写入和输出分列；总览中的 `prompt token` 是前三项之和，不再笼统称为“输入 token”。
```

</details>

**依据 4 · 作者声明**：[benchmark/README.md:100-108](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/benchmark/README.md#L100-L108)

完整后端比较和模型延迟边界。

```text
报告只对成功运行计算常规延迟，并始终并列展示成功率。少于 10 个成功样本时不展示 P90，避免小样本的虚假精度。配对表会分别列出双方成功、仅一方成功和双方失败，并另提供失败惩罚指标：失败样本按 `2 × timeout` 计时，避免一个后端通过快速失败得到看似更低的耗时。

## 解释边界

这是完整浏览器后端的端到端比较，不是纯 WebSocket 或进程内调用的传输微基准。虽然模型可见工具契约已经对齐，两边的页面结构化表示、元素索引和动作执行实现仍然不同；这些差异会影响模型调用次数、token 和成功率，也正是被测后端的一部分。因此，报告中的速度比不能被表述为“扩展传输本身的开销”。

模型服务端延迟也无法由本地 runner 隔离。正式结论必须同时看成功率、配对结果、失败惩罚比、运行顺序敏感性和置信区间，而不是只比较一次 P50。

## 建议的正式流程
```

**依据 5 · 源码核查**：[package.json:1-13](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/package.json#L1-L13)

独立private工作区。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "dsh-browser",
  "version": "0.1.4",
  "description": "Standalone dsh browser bridge and controlled-tab Chrome/Firefox extension workspace",
  "author": "Yuxiang Lin",
  "license": "MIT",
  "private": true,
  "packageManager": "pnpm@11.7.0",
  "scripts": {
    "build": "pnpm --filter @yuxianglin/dsh-bridge-browser run build && pnpm --filter dsh-browser-extension run build",
    "start": "dsh web",
    "test": "pnpm --filter @yuxianglin/dsh-bridge-browser run test && pnpm --filter dsh-browser-extension run test",
    "typecheck": "pnpm --filter @yuxianglin/dsh-bridge-browser run typecheck && pnpm --filter dsh-browser-extension run typecheck",
```

</details>

#### 缺口

- 本次未取得作者原始基准结果，真实站点质量与总成本缺独立对照。
  **影响**：不把作者小样本性能结论当当前版本已验证收益。
  **进一步探讨**：在自有测试站点固定模型/预算，保留原始运行、网页验收与全部失败/人审，再比较手工或隔离自动化。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 共享标签、来源审批和等待后复核如何约束真实执行？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

后台收到 tool.call 后建立与调用ID绑定的controller和期限，按会话解析被控标签，dispatchToolCall检查取消、共享设置、frame与元素文档，再请求来源/动作批准。等待后重新读frames并比较批准边界和目标document；变化则要求重新快照。index目标需原快照属于当前document，selector或focused目标不走同一编号校验。tab-affinity保存会话与tab绑定，把可见标签和被控制标签分开，不随便把后台页换成当前页。

默认 sharePageContent=auto，所以普通读页无需每次提问；unrestrictedBrowserAccess默认false，但显式打开后绕过普通共享/审批条件。站点/当前侧栏信任也会减少逐次批准。开发者工具走独立分支，普通站点信任不能授予debugger，仍有独立设置或会话授权。因而“每次写动作一定弹审批”不是所有配置下的事实。

发生未知派发错误时不会无条件重发，只有确认content脚本接收器缺失才注入后再验证并尝试；已派发后无答要求重新快照。commitAction只标已经进入副作用阶段，不是业务事务receipt；取消可能发生在实际导航/输入之后。Host桥本地免token按Chrome扩展Origin类别、内部用owner Peer，因此整套安全还依赖可信扩展和本地环境，不能拿网页来源批准当Host多用户隔离。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh-browser/src/background/index.ts:121-132](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/index.ts#L121-L132)

共享auto而普通/开发者无约束默认false。

<details>
<summary>查看原文（12行）</summary>

```text

const SETTINGS_DEFAULTS: Settings = {
  // 空地址 = 自动探测本机 dsh（零配置）；手动填地址时优先手动。
  bridgeUrl: '',
  token: '',
  sharePageContent: 'auto',
  unrestrictedBrowserAccess: false,
  allowDevTools: false,
  trustedActionOrigins: [],
  approvalNotifications: true,
  autoResumeSession: true,
}
```

</details>

**依据 2 · 源码核查**：[extensions/dsh-browser/src/background/index.ts:1379-1474](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/index.ts#L1379-L1474)

真实路由、controller/commit与session目标调用。

<details>
<summary>查看原文（96行）</summary>

```text
/** Route one tool.call frame to the user-approved controlled tab. */
function routeToolCall(call: ToolCall): void {
  if (bridge === null) return
  activeToolCalls.get(call.id)?.controller.abort()
  const controller = new AbortController()
  const unrestrictedAccess = unrestrictedAccessEnabled()
  let settle!: () => void
  const activeCall: ActiveToolCall = {
    controller,
    name: call.name,
    unrestrictedAccess,
    committed: false,
    revocationRequested: false,
    settled: new Promise<void>((resolve) => { settle = resolve }),
    settle: () => { settle() },
  }
  activeToolCalls.set(call.id, activeCall)
  unsettledToolCalls.add(activeCall)
  const commitAction = (): void => { activeCall.committed = true }
  const rollbackActionCommit = (): void => {
    activeCall.committed = false
    if (activeCall.revocationRequested) controller.abort()
  }
  const expiryTimer = call.expiresAt === undefined
    ? undefined
    : setTimeout(() => {
        if (!activeCall.committed) controller.abort()
      }, Math.max(0, call.expiresAt - Date.now()))
  const budget = caps === null
    ? undefined
    : { maxItems: caps.maxInteractiveItems, maxChars: caps.snapshotMaxChars }
  const sharePageContent = unrestrictedAccess ? 'auto' : settings.sharePageContent
  const managementDispatch = async (): Promise<ToolAnswer> => {
    await affinityReady
    const affinity = tabAffinity.snapshot()
    let windowId = affinity.active?.windowId ?? affinity.controlled?.windowId
    if (windowId === undefined) {
      try {
        windowId = (await chrome.windows.getLastFocused()).id
      } catch { /* approvals can still report unavailable without a focused window */ }
    }
    const controlledTabId = call.sessionId === undefined
      ? affinity.controlled?.tabId
      : tabAffinity.getSessionTab(call.sessionId)?.tabId
    return dispatchToolCall(
      call,
      sharePageContent,
      budget,
      (prompt) => authorizeToolCall(prompt, controller.signal, windowId ?? 0, call.sessionId, unrestrictedAccess),
      controller.signal,
      undefined,
      undefined,
      {
        unrestrictedAccess,
        ...(controlledTabId === undefined ? {} : { controlledTabId }),
        followTab: (tab) => followModelSelectedTab(tab, call.sessionId),
        input: inputRuntime,
        commitAction,
        rollbackActionCommit,
      },
    )
  }
  void (isTabManagementTool(call.name)
    ? managementDispatch()
    : isDevToolsTool(call.name)
    ? dispatchDevToolsTool(call, controller.signal)
    : call.name === 'browser_open_tab'
    ? resolveOpenTabWindow(call.sessionId).then((target) => 'ok' in target
      ? target
      : dispatchOpenTab(
          call,
          target.windowId,
          sharePageContent,
          budget,
          (prompt) => authorizeToolCall(prompt, controller.signal, target.windowId, call.sessionId, unrestrictedAccess),
          controller.signal,
          (tab) => bindOpenedTab(tab, call.sessionId, { active: call.args.active !== false }),
          (tabId) => tabAffinity.allowsTarget(tabId, call.sessionId),
          commitAction,
        ))
    : resolveToolTab(call.sessionId).then((target) => 'ok' in target
      ? target
      : dispatchToolCall(
          call,
          sharePageContent,
          budget,
          (prompt) => authorizeToolCall(prompt, controller.signal, target.windowId, call.sessionId, unrestrictedAccess),
          controller.signal,
          target,
          () => target.id !== undefined && tabAffinity.allowsTarget(target.id, call.sessionId),
          { unrestrictedAccess, input: inputRuntime, commitAction, rollbackActionCommit },
        ))
  ).then(
    async (answer) => {
      if (activeToolCalls.get(call.id) !== activeCall) return
      // A committed browser_open_tab already rebound affinity; prefer that
```

</details>

**依据 3 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:1273-1321](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/tools.ts#L1273-L1321)

共享/目标/审批后复核。

<details>
<summary>查看原文（49行）</summary>

```text
  }
  // Privacy boundary: with sharing off, no page content may leave the page.
  if (!tabManagement.unrestrictedAccess
    && sharePageContent === 'off'
    && (call.name === 'browser_snapshot' || call.name === 'browser_get_text' || call.name === 'browser_screenshot')) {
    return { ok: false, error: { code: 'action-failed', message: 'Page content sharing is disabled in Settings > Page content sharing.' } }
  }
  const tab = targetTab ?? (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0]
  if (isCancelled(call, signal)) return cancelled()
  if (tab?.id === undefined) {
    return { ok: false, error: { code: 'no-active-tab', message: 'No active tab is available for browser operations.' } }
  }
  if (targetStillAllowed?.() === false) return targetChanged()
  const frames = await listTabFrames(tab.id, tab.url)
  if (isCancelled(call, signal)) return cancelled()
  if (targetStillAllowed?.() === false) return targetChanged()
  const frameError = validateFrameTarget(call, frames)
  if (frameError !== undefined) return frameError
  if (!isInjectablePage(tab.url) && !TAB_NATIVE_TOOLS.has(call.name) && call.name !== 'browser_screenshot') {
    return unavailable('The current page DOM is protected by the browser. Only snapshot metadata, navigate, back, forward, and reload are available on this page.')
  }
  const targetError = validateElementTarget(call, tab.id, frames)
  if (targetError !== undefined) return targetError
  const approval = tabManagement.unrestrictedAccess
    ? undefined
    : approvalPromptForCall(call, sharePageContent, frames)
  if (approval !== undefined) {
    const authorization = authorize === undefined ? 'unavailable' : await authorize(approval)
    if (isCancelled(call, signal)) return cancelled()
    if (targetStillAllowed?.() === false) return targetChanged()
    if (authorization !== 'approved') {
      return approvalFailure(approval, authorization)
    }
  }
  let executionFrames = frames
  if (approval !== undefined) {
    executionFrames = await listTabFrames(tab.id, tab.url)
    if (isCancelled(call, signal)) return cancelled()
    if (targetStillAllowed?.() === false) return targetChanged()
    const refreshedApproval = approvalPromptForCall(call, sharePageContent, executionFrames)
    if (refreshedApproval === undefined
      || !sameApprovalBoundary(approval, refreshedApproval)
      || (approval.kind === 'action' && !sameTargetDocument(call, frames, executionFrames))) {
      return unavailable('The page changed while approval was pending. Call browser_snapshot again before retrying.')
    }
    const refreshedTargetError = validateElementTarget(call, tab.id, executionFrames)
    if (refreshedTargetError !== undefined) return refreshedTargetError
  }
  if (!isInjectablePage(tab.url)) {
```

</details>

**依据 4 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:1346-1395](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/tools.ts#L1346-L1395)

仅接收器缺失才补注入并复核，不任意重发。

<details>
<summary>查看原文（50行）</summary>

```text
    const trustedFailureAnswer = devToolsFailure(error)
    if (trustedFailureAnswer !== undefined) return trustedFailureAnswer
    if (!contentScriptReceiverMissing(error)) {
      const detail = error instanceof Error ? error.message : String(error)
      return unavailable(`The browser operation failed after it was dispatched: ${detail}`)
    }
    // Manifest content scripts do not run retroactively in tabs that were
    // already open when an unpacked extension was installed or reloaded.
    // Recover in place so the user never has to refresh and lose page state.
    try {
      await injectContentScript(tab.id)
    } catch {
      return await dispatchTabNativeTool(tab.id, tab.url, tab.title, tab.windowId, call, effectiveBudget, signal, targetStillAllowed, tabManagement.commitAction)
        ?? unavailable('The content script could not be loaded on this page. Its DOM does not support browser operations.')
    }
    try {
      if (isCancelled(call, signal)) return cancelled()
      if (targetStillAllowed?.() === false) return targetChanged()
      const refreshedFrames = await listTabFrames(tab.id, tab.url)
      if (isCancelled(call, signal)) return cancelled()
      if (targetStillAllowed?.() === false) return targetChanged()
      const refreshedTargetError = validateElementTarget(call, tab.id, refreshedFrames)
      if (refreshedTargetError !== undefined) return refreshedTargetError
      if (approval !== undefined) {
        const refreshedApproval = approvalPromptForCall(call, sharePageContent, refreshedFrames)
        if (refreshedApproval === undefined
          || !sameApprovalBoundary(approval, refreshedApproval)
          || (approval.kind === 'action' && !sameTargetDocument(call, executionFrames, refreshedFrames))) {
          return unavailable('The page changed while the content script was loading. Call browser_snapshot again before retrying.')
        }
      }
      return await dispatchOnce(
        tab.id,
        refreshedFrames,
        call,
        effectiveBudget,
        signal,
        targetStillAllowed,
        tabManagement.unrestrictedAccess || sharePageContent === 'auto',
        tabManagement.commitAction,
        tabManagement.rollbackActionCommit,
        tabManagement.input,
      )
    } catch (error: unknown) {
      const trustedFailureAnswer = devToolsFailure(error)
      if (trustedFailureAnswer !== undefined) return trustedFailureAnswer
      const detail = error instanceof Error ? error.message : String(error)
      return unavailable(`The content script did not answer after it was loaded (${detail}). Call browser_snapshot again before retrying.`)
    }
  }
```

</details>

**依据 5 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:1418-1429](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/tools.ts#L1418-L1429)

编号绑定document，不同于selector。

<details>
<summary>查看原文（12行）</summary>

```text
  // A selector or "the focused element" is self-contained; only
  // a snapshot index needs a snapshot of the same document to resolve.
  if (!INDEX_TARGETED_TOOLS.has(call.name)) return undefined
  if (call.args.index === undefined) return undefined
  const frameId = requestedFrame(call.args)
  const frame = frames.find((candidate) => candidate.frameId === frameId)
  const snapshotted = snapshotDocumentsByTab.get(tabId)?.get(frameId)
  if (frame === undefined || snapshotted === undefined || snapshotted !== frameDocumentKey(frame)) {
    return unavailable('The element reference does not belong to the current document. Call browser_snapshot again for current frame and index values.')
  }
  return undefined
}
```

</details>

**依据 6 · 源码核查**：[extensions/dsh-browser/src/background/tab-affinity.ts:389-425](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/tab-affinity.ts#L389-L425)

按会话tab解析和最终允许检查。

<details>
<summary>查看原文（37行）</summary>

```text
  resolveTarget(sessionId?: string): TabTargetResolution {
    if (sessionId !== undefined) {
      const tab = this.sessionTabs.get(sessionId)
      return tab === undefined ? { kind: 'lost' } : { kind: 'target', tab: { ...tab } }
    }
    switch (this.status()) {
      case 'unbound': return { kind: 'initial' }
      case 'lost': return { kind: 'lost' }
      case 'handoff': return { kind: 'handoff' }
      case 'following':
      case 'background':
        return { kind: 'target', tab: { ...this.controlled! } }
    }
  }

  tracks(tabId: number): boolean {
    if (this.controlled?.tabId === tabId || this.active?.tabId === tabId) return true
    for (const tab of this.sessionTabs.values()) {
      if (tab.tabId === tabId) return true
    }
    return false
  }

  /** Final dispatch guard for async calls that began before a tab switch. */
  allowsTarget(tabId: number, sessionId?: string): boolean {
    if (sessionId !== undefined) {
      return this.sessionTabs.get(sessionId)?.tabId === tabId
    }
    const resolution = this.resolveTarget()
    return resolution.kind === 'target' && resolution.tab.tabId === tabId
  }

  private status(): TabAffinityStatus {
    if (this.controlled === null) return this.lost ? 'lost' : 'unbound'
    if (this.active?.tabId === this.controlled.tabId) return 'following'
    if (this.active !== null && !this.pinned && this.keptActiveTabId !== this.active.tabId) return 'handoff'
    return 'background'
```

</details>

**依据 7 · 源码核查**：[extensions/dsh-browser/src/background/index.ts:1125-1168](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/index.ts#L1125-L1168)

实际授权分流/信任与devtools会话grant。

<details>
<summary>查看原文（44行）</summary>

```text
async function authorizeToolCall(
  prompt: ApprovalPrompt,
  signal: AbortSignal,
  windowId: number,
  sessionId?: string,
  unrestrictedAccess: boolean = unrestrictedAccessEnabled(),
): Promise<ApprovalAuthorization> {
  if (signal.aborted) return 'cancelled'
  const gate = resolveApprovalGate({
    prompt,
    devToolsAllowed: devToolsAllowed(),
    devToolsSessionGrant: sessionDevToolsGrant,
    unrestrictedAccess,
    coveredByTrustedOrigins: actionCoveredByTrustedOrigins(
      prompt,
      sessionTrustedActionOrigins,
      settings.trustedActionOrigins,
    ),
  })
  if (gate !== 'prompt') return gate
  const result: ApprovalRequestResult = await approvals.request(prompt, signal, windowId, sessionId)
  if (signal.aborted) return 'cancelled'
  if (result.status !== 'decision') return result.status
  const { decision } = result
  if (prompt.devTools === true) {
    // 授权持续到侧栏关闭、worker 终止或用户修改设置。
    if (decision === 'trust-session') {
      if (panelPorts.size === 0) return 'cancelled'
      sessionDevToolsGrant = true
      devTools.resume()
      return 'approved'
    }
    if (decision === 'allow-once') devTools.resume()
    return decision === 'allow-once' ? 'approved' : 'denied'
  }
  if (decision === 'always-allow-reads' && prompt.kind === 'read') {
    await persistSettings({ sharePageContent: 'auto' })
    return 'approved'
  }
  if (decision === 'trust-session' && prompt.kind === 'action' && prompt.canTrust && prompt.origins.length === 1) {
    sessionTrustedActionOrigins.add(prompt.origins[0]!)
    return 'approved'
  }
  return decision === 'allow-once' ? 'approved' : 'denied'
```

</details>

**依据 8 · 源码核查**：[packages/browser/bridge-browser/src/server.ts:311-328](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/server.ts#L311-L328)

本地Chrome来源类别认证。

<details>
<summary>查看原文（18行）</summary>

```text
        // Zero-config local mode: loopback sockets skip the token (the
        // extension auto-discovers the bridge and connects without setup).
        // WebSockets have no same-origin policy, so a malicious page could
        // open a cross-origin socket to 127.0.0.1 with a loopback remote —
        // the loopback shortcut therefore requires a chrome-extension://
        // Origin (only extension contexts can present one; pages cannot
        // forge the header). Firefox moz-extension:// origins contain a
        // per-install UUID rather than the manifest's stable Gecko ID, so
        // they are not an identity boundary and must present the bearer token.
        // Non-loopback remotes must also present the bearer token.
        const loopbackNoToken = isLoopbackAddress(remoteAddress)
          && typeof origin === 'string'
          && origin.startsWith('chrome-extension://')
        if (!loopbackNoToken && !verifyToken(this.deps.token, frame.token)) {
          ws.close(4002, 'bad token')
          return
        }
        clearTimeout(helloTimer)
```

</details>

**依据 9 · 源码核查**：[packages/browser/bridge-browser/src/remote-host-api.ts:138-146](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/remote-host-api.ts#L138-L146)

owner Peer。

```text
  constructor(
    private readonly gateway: TypertGatewayLike,
    connection: HostConnectionLike,
  ) {
    // Interactions default to `answer`; the bridge answers user-question
    // waterfalls for sessions it created, so it names that explicitly.
    this.peer = connection.createPeer({ principal: { kind: 'owner' }, interactions: 'answer' })
    this.fetchHandler = connection.createSharedFetchHandler('/api')
  }
```

#### 缺口

- 同document动态重排、SPA以及授权等待/断线后的实际误操作率未知。
  **影响**：文档级检查不能证明控件语义始终匹配，也不能称取消回滚。
  **进一步探讨**：测试站点同时改document、同页按钮语义和iframe，记录错点/误拒/重抓与最终副作用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 字段遮罩与截图、网络和JS工具的隐私边界是什么？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

DOM快照对password、信用卡autocomplete及名称/id/aria-label的敏感模式字段值用固定占位符；snapshot实际把表单值和正文来源分开收集，正文不是同一敏感字段检测。未标注字段、普通正文和网页本身提供的文字都可能进入模型上下文。这个机制支持局部脱敏，不支持“任何秘密永不离开页面”。

截图直接captureVisibleTab取窗口像素，没有在此链路调用字段遮罩；代码要求受控页为窗口active且窗口聚焦，以免给出别页/陈旧画面，但页面上可见的敏感正文仍在像素中。开发者工具能在页面运行JavaScript，并读取捕获的请求/响应；序列化默认按header名和auth形URL掩码，显式includeSensitive参数可请求敏感字段，未知header或不匹配URL不保证检出。批准开发者权限不等批准所有潜在外发内容的语义安全。

Host会把截图保存为持久附件，页面文字/图像随后是否发云模型取决于DSH配置；浏览器本地执行不等推理本地，Cookie用于真实登录也不等绝不会被已授权工具看到。适合先用无敏感profile，无法接受页面正文/图像发给模型者应保留人工或本地模型并独立核请求，不能仅靠遮罩开关。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh-browser/src/content/privacy.ts:12-51](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/content/privacy.ts#L12-L51)

字段识别模式和固定遮罩。

<details>
<summary>查看原文（40行）</summary>

```text
/** Name/id/aria-label fragments that mark a field as sensitive. */
const SENSITIVE_PATTERNS = [
  /password/i,
  /passwd/i,
  /credit/i,
  /card/i,
  /cvv/i,
  /cvc/i,
  /secret/i,
  /pwd/i,
]

/**
 * Whether a form field must never be echoed back to the model.
 * @param el - the form element (input/select/textarea).
 * @returns true for password inputs, credit-card autocomplete fields, and
 *   fields whose id/name/aria-label matches a sensitive fragment.
 */
export function isSensitiveField(el: Element): boolean {
  if (el instanceof HTMLInputElement) {
    if (el.type === 'password') return true
    const autocomplete = String(el.autocomplete)
    if (autocomplete === 'credit-card' || autocomplete.startsWith('cc-')) return true
  }
  const name = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement
    ? el.name
    : ''
  const haystack = [el.id, name, el.getAttribute('aria-label')].filter(Boolean).join(' ')
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(haystack))
}

/**
 * Mask a sensitive value for snapshots. Non-empty values become a fixed
 * placeholder so the model knows a value is present without learning it.
 * @param value - the field's current value.
 * @returns the masked representation.
 */
export function maskValue(value: string): string {
  return value.length === 0 ? '' : '••••'
}
```

</details>

**依据 2 · 源码核查**：[extensions/dsh-browser/src/content/snapshot.ts:235-264](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/content/snapshot.ts#L235-L264)

实际字段遮罩与正文独立路径。

<details>
<summary>查看原文（30行）</summary>

```text
  for (const el of formElements.slice(0, options.budget.maxForms)) {
    const index = ids.indexOf(el)
    if (index === undefined) continue
    const masked = isSensitiveField(el)
    const checkable = el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')
    const value = checkable
      ? ''
      : el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement
      ? el.value
      : el instanceof HTMLSelectElement
        ? selectedText(el)
        : ''
    forms.push({
      index,
      label: nameOf(el),
      kind: el instanceof HTMLInputElement ? el.type : el.tagName.toLowerCase(),
      value: masked ? maskValue(value) : value.slice(0, 120),
      masked,
      ...checkable ? { checked: el.checked } : {},
      ...el instanceof HTMLInputElement && el.required ? { required: true } : {},
    })
  }

  const regionEl = options.region !== undefined && options.region !== ''
    ? document.querySelector(options.region)
    : null
  const mainSource = regionEl !== null ? pageText(regionEl) : mainText(document)
  const mainBudget = Math.floor(options.budget.maxChars * 0.5)
  const main = truncate(mainSource, mainBudget)

```

</details>

**依据 3 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:1171-1234](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/tools.ts#L1171-L1234)

active/focus后像素捕获，无字段遮罩处理。

<details>
<summary>查看原文（64行）</summary>

```text
 * active tab of the window, so a controlled-but-inactive tab is a hard error
 * rather than a silent capture of the wrong page.
 */
async function dispatchScreenshot(
  tab: Pick<chrome.tabs.Tab, 'id' | 'url'> & { active?: boolean; windowId?: number },
  call: ToolCall,
  signal?: AbortSignal,
  targetStillAllowed?: () => boolean,
): Promise<ToolAnswer> {
  if (isCancelled(call, signal)) return cancelled()
  if (targetStillAllowed?.() === false) return targetChanged()
  const options = screenshotCaptureOptions(call)
  if ('ok' in options) return options
  let active = tab.active
  let windowId = tab.windowId
  if (active === undefined || windowId === undefined) {
    const fresh = await findTab(tab.id!)
    if (fresh === undefined) return unavailable('The controlled tab closed before the screenshot was captured.')
    active = fresh.active
    windowId = fresh.windowId
  }
  if (isCancelled(call, signal)) return cancelled()
  if (targetStillAllowed?.() === false) return targetChanged()
  if (active !== true) {
    return unavailable('The controlled tab is not the active tab of its window, so its viewport cannot be captured. Activate the tab first, then retry.')
  }
  if (windowId === undefined) {
    return unavailable('The controlled tab has no window, so its viewport cannot be captured.')
  }
  // `captureVisibleTab` photographs the last composited frame. A window that is
  // not focused can hand back a stale image that no longer matches the DOM, so
  // fail clearly instead of presenting old pixels as the current state.
  const windowsApi = (globalThis as {
    chrome?: { windows?: { get?: (id: number) => Promise<{ focused?: boolean }> } }
  }).chrome?.windows
  if (typeof windowsApi?.get === 'function') {
    try {
      const win = await windowsApi.get(windowId)
      if (win.focused === false) {
        return unavailable('The browser window is not focused, so a captured frame could be stale. Bring it to the front (browser_follow_tab { activate: true }) and retry.')
      }
    } catch {
      // A closed window is reported by the capture call itself.
    }
  }
  let dataUrl: string
  try {
    dataUrl = await chrome.tabs.captureVisibleTab(windowId, {
      format: options.format,
      ...(options.format === 'jpeg' ? { quality: options.quality } : {}),
    })
  } catch (error: unknown) {
    const detail = error instanceof Error ? error.message : String(error)
    return unavailable(`The screenshot could not be captured: ${detail}`)
  }
  if (isCancelled(call, signal)) return cancelled()
  if (targetStillAllowed?.() === false) return targetChanged()
  const captured = decodeCaptureDataUrl(dataUrl)
  if (captured === undefined) return unavailable('The browser returned the screenshot in an unsupported format.')
  const dimensions = await measureImageBytes(captured.data, captured.mediaType)
  return {
    ok: true,
    result: {
      image: {
```

</details>

**依据 4 · 源码核查**：[extensions/dsh-browser/src/background/devtools-serialization.ts:12-60](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/devtools-serialization.ts#L12-L60)

敏感header/URL启发式与显式放行。

<details>
<summary>查看原文（49行）</summary>

```text
/** Header names whose values never reach the model unless the user opts in per call. */
const SENSITIVE_HEADERS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'proxy-authorization',
  'x-csrf-token',
  'x-xsrf-token',
  'x-api-key',
  'api-key',
  'x-auth-token',
  'x-access-token',
  'x-session-token',
])

/** URL shapes whose bodies are redacted by default (credentials travel there). */
const SENSITIVE_BODY_URL = /(?:^|[^a-z])(auth|login|logout|signin|sign-in|signup|register|oauth|token|session|password|passwd|credential|apikey|api-key)(?:[^a-z]|$)/i

/** One CDP header entry as `Network`/`Fetch` report it. */
export interface CdpHeader {
  name: string
  value: string
}

/** Redaction marker used in place of a hidden value. */
export const REDACTED = '[redacted]'

/** Whether a header name is treated as a credential carrier. */
export function isSensitiveHeader(name: string): boolean {
  return SENSITIVE_HEADERS.has(name.trim().toLowerCase())
}

/** Whether a request URL suggests a body that should be redacted by default. */
export function isSensitiveBodyUrl(url: string): boolean {
  return SENSITIVE_BODY_URL.test(url)
}

/**
 * Render a CDP header list as indented lines.
 * @param headers - header entries in wire order.
 * @param sensitive - when false (default) credential-bearing values are masked.
 * @returns one line per header.
 */
export function formatHeaders(headers: readonly CdpHeader[] | undefined, sensitive = false): string[] {
  if (headers === undefined || headers.length === 0) return ['  (none)']
  return headers.map((header) => {
    const value = !sensitive && isSensitiveHeader(header.name) ? REDACTED : header.value
    return `  ${header.name}: ${value}`
  })
```

</details>

**依据 5 · 源码核查**：[packages/browser/bridge-browser/src/devtools-tools.ts:169-182](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/devtools-tools.ts#L169-L182)

页面JS调用。

<details>
<summary>查看原文（14行）</summary>

```text

  const consoleEval = (): ToolDefinition => defineTool({
    name: 'browser_console_eval',
    description: `Run JavaScript in the page's own context, as typing in the DevTools console would. Prefer a single expression; use an async IIFE and awaitPromise for multi-step work. ${APPROVAL_NOTE} ${UNTRUSTED_CONTENT_WARNING}`,
    parameters: {
      expression: { type: 'string', required: true, description: 'JavaScript source evaluated in the page context.' },
      frame: FRAME_PARAMETER,
      awaitPromise: { type: 'boolean', description: 'Wait for a returned promise to settle and return its value.' },
      includePreview: { type: 'boolean', description: 'Include a property preview when the value cannot be returned by value.' },
      maxChars: { type: 'number', description: 'Cap on the rendered result characters.' },
    },
    timeoutMs: options.toolTimeoutMs,
    output: TEXT_OUTPUT,
    execute: (args, exec) => call(exec, 'browser_console_eval', compact(args as Record<string, unknown>)),
```

</details>

**依据 6 · 源码核查**：[packages/browser/bridge-browser/src/devtools-tools.ts:229-251](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/devtools-tools.ts#L229-L251)

逐调用敏感header/body参数。

<details>
<summary>查看原文（23行）</summary>

```text
    name: 'browser_devtools_get_request',
    description: `Inspect one captured request in full: request and response headers (sensitive names redacted by default), post data, timing breakdown, and optionally the response body. ${APPROVAL_NOTE} ${UNTRUSTED_CONTENT_WARNING}`,
    parameters: {
      index: { type: 'number', required: true, description: 'Request index from browser_devtools_list_requests.' },
      includeBody: { type: 'boolean', description: 'Also fetch the response body.' },
      maxChars: { type: 'number', description: 'Cap on the rendered result characters.' },
      includeSensitiveHeaders: { type: 'boolean', description: 'Show Authorization, Cookie, Set-Cookie, and similar values instead of [redacted].' },
      includeSensitiveBody: { type: 'boolean', description: 'Show bodies of authentication-looking requests instead of [redacted].' },
    },
    timeoutMs: options.toolTimeoutMs,
    output: TEXT_OUTPUT,
    execute: (args, exec) => call(exec, 'browser_devtools_get_request', compact(args as Record<string, unknown>)),
  })

  const requestBody = (): ToolDefinition => defineTool({
    name: 'browser_devtools_request_body',
    description: `Fetch the request payload or response body of one captured request, pretty-printing JSON when possible. ${APPROVAL_NOTE} ${UNTRUSTED_CONTENT_WARNING}`,
    parameters: {
      index: { type: 'number', required: true, description: 'Request index from browser_devtools_list_requests.' },
      kind: { type: 'string', enum: ['request', 'response'], description: 'Which body to read. Defaults to response.' },
      maxChars: { type: 'number', description: 'Cap on the returned characters; the extension caps bodies at 64 KB.' },
      includeSensitiveBody: { type: 'boolean', description: 'Show bodies of authentication-looking requests instead of [redacted].' },
    },
```

</details>

**依据 7 · 源码核查**：[packages/browser/bridge-browser/src/screenshot-tools.ts:66-83](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/packages/browser/bridge-browser/src/screenshot-tools.ts#L66-L83)

Host保存图像附件。

<details>
<summary>查看原文（18行）</summary>

```text
  const storeImage = async (image: ScreenshotImage): Promise<ImageAttachmentRef> => {
    const attachments = ctx.get('attachments') as
      | { saveImages(inputs: ReadonlyArray<{ data: Uint8Array; mediaType: string }>): Promise<readonly ImageAttachmentRef[]> }
      | undefined
    if (attachments === undefined) {
      throw new Error('No attachment store is mounted, so the screenshot cannot be returned as an image.')
    }
    const mediaType = image.mediaType
    if (!SUPPORTED_MEDIA_TYPES.has(mediaType)) {
      throw new Error(`The browser returned an unsupported screenshot media type: ${mediaType}`)
    }
    const data = Buffer.from(image.data, 'base64')
    const [ref] = await attachments.saveImages([{ data: new Uint8Array(data), mediaType }])
    return ref as ImageAttachmentRef
  }

  const tool = defineTool({
    name: 'browser_screenshot',
```

</details>

#### 缺口

- 快照正文、截图与网络结果在具体模型/存储部署中的完整数据留存范围未全审。
  **影响**：不对私密页面承诺全链路脱敏或离线。
  **进一步探讨**：用人工构造的多类敏感字段/正文/图像/headers核实际消息和附件，按用途限制工具面与模型出口。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本机文件、剪贴板和原生输入怎样改变权限与失败含义？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Chrome扩展声明debugger、clipboardWrite、offscreen等权限和all_urls；Firefox构建没有同组debugger权限，使用不同manifest和后台形态，不能从Chrome工具表推出全平台等价。原生键盘、粘贴和文件上传依赖Chrome debugger，和普通合成DOM输入并不是一种可靠性/权限取舍。

browser_clipboard write会实际替换系统剪贴板文本/HTML，paste可先写再发原生快捷键；工具失败后剪贴板可能已经改变，不只是网页内部变量。browser_upload从模型参数接收非空本地paths，先标记目标input，再通过CDP DOM.setFileInputFiles让浏览器进程读取路径，finally尽力清标记；扩展本身不读文件字节不代表文件没有进入网页。它选择的是浏览器所在机器的文件，不是远程DSH Host路径；“attached”只确认设置input，不代表网站已上传或接收成功。

因此文件/剪贴板功能只能在用户明确知道内容与站点用途时试验，不能把模型猜测路径或成功回执当用户确认。切标签、取消和重试都需核真实input、页面和剪贴板；独立profile不能撤销系统剪贴板变化，也不能自动清理已发站点内容。本次没有测试各浏览器原生输入差异，不宣称未知行为已失效。

补查实际写入路径可确认系统剪贴板主张。Chrome后台以CLIPBOARD理由创建打包offscreen文档，经runtime.sendMessage请求；接收者调用copyClipboardInDocument，创建隐藏可编辑元素、按DOMPurify规则清理HTML，拦截copy事件向clipboardData写text/plain及可选text/html，然后document.execCommand('copy')。无selection、copy事件未写入或浏览器拒绝会抛错，finally移除listener和隐藏节点；没有offscreen时直接在Firefox式event-page文档调用同一writer，无document则报input-unavailable。后台仅收到带合格outcome的ok才确认成功，无确认/错误则action-failed。此为API接线事实，不是各浏览器系统剪贴板权限已通过实测，HTML清理也不等内容无敏感信息或写入可撤回。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh-browser/manifest.json:7-23](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/manifest.json#L7-L23)

Chrome权限及all_urls。

<details>
<summary>查看原文（17行）</summary>

```text
  "minimum_chrome_version": "125",
  "permissions": [
    "sidePanel",
    "storage",
    "tabs",
    "activeTab",
    "scripting",
    "webNavigation",
    "alarms",
    "notifications",
    "debugger",
    "clipboardWrite",
    "offscreen"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
```

</details>

**依据 2 · 源码核查**：[extensions/dsh-browser/manifest.firefox.json:7-37](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/manifest.firefox.json#L7-L37)

Firefox版本/后台权限差异。

<details>
<summary>查看原文（31行）</summary>

```text
  "browser_specific_settings": {
    "gecko": {
      "id": "dsh-browser@lum1104.github.io",
      "strict_min_version": "140.0",
      "data_collection_permissions": {
        "required": [
          "browsingActivity",
          "personalCommunications",
          "websiteActivity",
          "websiteContent"
        ]
      }
    }
  },
  "permissions": [
    "storage",
    "tabs",
    "activeTab",
    "scripting",
    "webNavigation",
    "alarms",
    "notifications"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "background": {
    "scripts": [
      "background.js"
    ]
  },
```

</details>

**依据 3 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:756-784](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/tools.ts#L756-L784)

系统剪贴板写与原生paste。

<details>
<summary>查看原文（29行）</summary>

```text
/** Clipboard write (host path) and system-clipboard paste (trusted path). */
async function trustedClipboard(
  tabId: number,
  frame: TabFrame,
  call: ToolCall,
  budget: ContentBudget,
  runtime: InputRuntime | undefined,
  includePageDelta: boolean,
): Promise<ToolAnswer | undefined> {
  const args = call.args
  const text = typeof args.text === 'string' ? args.text : ''
  const html = typeof args.html === 'string' && args.html !== '' ? args.html : undefined
  if (args.action === 'write') {
    if (text === '' && html === undefined) throw new InputError('bad-args', 'text or html is required for a clipboard write.')
    const outcome = await writeClipboard({ text, ...(html === undefined ? {} : { html }) })
    return { ok: true, result: { text: describeClipboardWrite(outcome) } }
  }
  const input = requireInput(runtime)
  if (text !== '' || html !== undefined) {
    await writeClipboard({ text, ...(html === undefined ? {} : { html }) })
  }
  await prepareInputTarget(tabId, frame, args, 'none')
  await input.run(tabId, async (client) => {
    await withFocusEmulation(client, async () => {
      await sendPasteShortcut(client, inputStates.get(tabId), navigator.userAgent)
    })
  })
  return settleAfterInput(tabId, frame, `pasted the system clipboard into ${describeTarget(args)}`, budget, includePageDelta)
}
```

</details>

**依据 4 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:786-824](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/tools.ts#L786-L824)

标input、CDP设文件与尽力清理。

<details>
<summary>查看原文（39行）</summary>

```text
/** File attachment: mark the input, let the browser process read the paths. */
async function trustedUpload(
  tabId: number,
  frame: TabFrame,
  call: ToolCall,
  runtime: InputRuntime | undefined,
): Promise<ToolAnswer | undefined> {
  const args = call.args
  if (args.index === undefined && typeof args.selector !== 'string') {
    throw new InputError('bad-args', 'browser_upload needs index or selector for the file input.')
  }
  const paths = requestedPaths(args.paths)
  const input = requireInput(runtime)
  const token = uploadToken()
  const mark = await sendInputSetup(tabId, frame, {
    op: 'upload-mark',
    token,
    ...(args.index === undefined ? {} : { index: args.index as number }),
    ...(typeof args.selector === 'string' ? { selector: args.selector } : {}),
  })
  if (mark.op !== 'upload-mark') {
    throw new InputSetupError('action-failed', 'The page returned an unexpected upload result.')
  }
  try {
    await input.run(tabId, async (client) => {
      if (frame.frameId === 0) {
        await setInputFiles(client, mark.selector, paths)
        return
      }
      const target = await resolveDebuggerFrame(client, tabId, frame)
      await setInputFiles(target.client, mark.selector, paths, target.uniqueId)
    })
  } finally {
    void sendInputSetup(tabId, frame, { op: 'upload-clear', token }).catch(() => undefined)
  }
  return {
    ok: true,
    result: { text: `Attached ${paths.length} file(s) to ${describeTarget(args)}.` },
  }
```

</details>

**依据 5 · 源码核查**：[extensions/dsh-browser/src/background/input-actions.ts:238-261](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/input-actions.ts#L238-L261)

浏览器进程读取paths与setFileInputFiles。

<details>
<summary>查看原文（24行）</summary>

```text
 * Assign files to a file input addressed by a unique selector.
 *
 * The browser process reads the paths; the extension never reads file content.
 *
 * @param client - attached CDP client.
 * @param selector - selector produced by the content script's upload marker.
 * @param paths - host paths to attach.
 */
export async function setInputFiles(client: CdpClient, selector: string, paths: readonly string[], uniqueContextId?: string): Promise<void> {
  if (paths.length === 0) throw new InputError('bad-args', 'paths must contain at least one local file path.')
  if (uniqueContextId !== undefined) {
    const nodeId = await resolveFrameNode(client, selector, uniqueContextId)
    await client.send('DOM.setFileInputFiles', { files: [...paths], nodeId })
    return
  }
  const document = await client.send('DOM.getDocument', { depth: -1, pierce: true }) as { root?: { nodeId?: number } }
  const rootNodeId = document.root?.nodeId
  if (rootNodeId === undefined) throw new InputError('action-failed', 'The page document could not be resolved.')
  const found = await client.send('DOM.querySelector', { nodeId: rootNodeId, selector }) as { nodeId?: number }
  if (found.nodeId === undefined || found.nodeId === 0) {
    throw new InputError('action-failed', `No file input matched ${selector}.`)
  }
  await client.send('DOM.setFileInputFiles', { files: [...paths], nodeId: found.nodeId })
}
```

</details>

**依据 6 · 源码核查**：[extensions/dsh-browser/src/background/clipboard-write.ts:24-70](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/clipboard-write.ts#L24-L70)

实际offscreen创建、Firefox文档fallback与确认/错误。

<details>
<summary>查看原文（47行）</summary>

```text
/** Create the offscreen document unless it already exists. */
async function ensureOffscreenDocument(): Promise<void> {
  if (creating !== undefined) return creating
  creating = (async () => {
    if (await chrome.offscreen.hasDocument()) return
    await chrome.offscreen.createDocument({
      url: OFFSCREEN_CLIPBOARD_URL,
      reasons: ['CLIPBOARD' as chrome.offscreen.Reason],
      justification: 'Write text or rich HTML to the clipboard at the user\'s request.',
    })
  })()
  try {
    await creating
  } finally {
    creating = undefined
  }
}

/**
 * Write text and optional rich HTML to the system clipboard.
 *
 * @param payload - clipboard content.
 * @throws {InputError} with `input-unavailable` when the platform cannot copy.
 */
export async function writeClipboard(payload: ClipboardWritePayload): Promise<ClipboardWriteOutcome> {
  if (payload.text === '' && payload.html === undefined) {
    throw new InputError('bad-args', 'text or html is required for a clipboard write.')
  }
  if (chrome.offscreen === undefined) {
    if (typeof document === 'undefined') throw new InputError('input-unavailable', 'The browser has no clipboard document.')
    return copyClipboardInDocument(payload)
  }
  await ensureOffscreenDocument()
  const response: unknown = await chrome.runtime.sendMessage({ type: CLIPBOARD_WRITE_MESSAGE, target: 'offscreen', payload })
  if (typeof response === 'object' && response !== null && (response as { ok?: unknown }).ok === true) {
    const outcome = (response as { outcome?: unknown }).outcome
    if (typeof outcome === 'object' && outcome !== null) {
      const record = outcome as { rich?: unknown; plainDerived?: unknown; plainText?: unknown }
      if (typeof record.rich === 'boolean' && typeof record.plainDerived === 'boolean' && typeof record.plainText === 'string') {
        return { rich: record.rich, plainDerived: record.plainDerived, plainText: record.plainText }
      }
    }
  }
  if (typeof response === 'object' && response !== null && typeof (response as { error?: unknown }).error === 'string') {
    throw new InputError('action-failed', (response as { error: string }).error)
  }
  throw new InputError('action-failed', 'The offscreen document did not confirm the clipboard write.')
```

</details>

**依据 7 · 源码核查**：[extensions/dsh-browser/src/offscreen/clipboard.ts:12-27](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/offscreen/clipboard.ts#L12-L27)

runtime消息接收者调用真实writer并回传结果。

<details>
<summary>查看原文（16行）</summary>

```text
import {
  CLIPBOARD_WRITE_MESSAGE,
  type ClipboardWritePayload,
} from '../shared/clipboard.ts'
import { copyClipboardInDocument } from '../shared/clipboard-document.ts'

chrome.runtime.onMessage.addListener((message: unknown, _sender, sendResponse: (response: unknown) => void) => {
  if (typeof message !== 'object' || message === null) return
  const request = message as { type?: unknown; target?: unknown; payload?: ClipboardWritePayload }
  if (request.type !== CLIPBOARD_WRITE_MESSAGE || request.target !== 'offscreen' || request.payload === undefined) return
  try {
    sendResponse({ ok: true, outcome: copyClipboardInDocument(request.payload) })
  } catch (error: unknown) {
    sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) })
  }
})
```

</details>

**依据 8 · 源码核查**：[extensions/dsh-browser/src/shared/clipboard-document.ts:1-36](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/shared/clipboard-document.ts#L1-L36)

copy事件设置系统clipboardData和execCommand，失败与finally清理。

<details>
<summary>查看原文（36行）</summary>

```text
import { sanitizeClipboardHtml, type ClipboardWriteOutcome, type ClipboardWritePayload } from './clipboard.ts'

/** 在扩展文档中同时写入准确的纯文本和 HTML。 */
export function copyClipboardInDocument(payload: ClipboardWritePayload): ClipboardWriteOutcome {
  const host = document.createElement('div')
  host.contentEditable = 'true'
  Object.assign(host.style, { position: 'fixed', left: '-9999px', top: '0' })
  const html = payload.html === undefined ? undefined : sanitizeClipboardHtml(payload.html)
  if (html !== undefined) host.innerHTML = html
  else host.textContent = payload.text
  document.body.appendChild(host)
  const plainDerived = payload.html !== undefined && payload.text === ''
  const plainText = plainDerived ? host.innerText : payload.text
  let copied = false
  const copy = (event: ClipboardEvent) => {
    if (event.clipboardData === null) throw new Error('Clipboard data is unavailable.')
    event.clipboardData.setData('text/plain', plainText)
    if (html !== undefined) event.clipboardData.setData('text/html', html)
    event.preventDefault()
    copied = true
  }
  document.addEventListener('copy', copy)
  try {
    const selection = document.getSelection()
    if (selection === null) throw new Error('The clipboard document has no selection.')
    const range = document.createRange()
    range.selectNodeContents(host)
    selection.removeAllRanges()
    selection.addRange(range)
    if (!document.execCommand('copy') || !copied) throw new Error('The browser rejected the clipboard write.')
    return { rich: payload.html !== undefined, plainDerived, plainText }
  } finally {
    document.removeEventListener('copy', copy)
    host.remove()
  }
}
```

</details>

**依据 9 · 源码核查**：[extensions/dsh-browser/src/shared/clipboard.ts:10-19](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/shared/clipboard.ts#L10-L19)

HTML在写入前使用DOMPurify清理的固定规则。

<details>
<summary>查看原文（10行）</summary>

```text
import DOMPurify from 'dompurify'

/** 保留粘贴内容的排版，移除可执行内容和表单控件。 */
export function sanitizeClipboardHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'form', 'input', 'button', 'select', 'textarea', 'template', 'noscript'],
    FORBID_ATTR: ['srcdoc', 'formaction'],
  })
}
```

</details>

#### 缺口

- 本机路径/账号隔离、原生键鼠和不同浏览器的任务验收未测。
  **影响**：不能说Firefox等价支持Chrome原生功能或上传成功即业务完成。
  **进一步探讨**：以可丢弃文件和剪贴板内容核目标input/浏览器位置、拒绝和中断，逐浏览器记录真实结果。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装、升级和退出是否像一个可回滚插件安装？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

根private工作区0.1.4固定pnpm和DSH rc.5，标准dsh plugin命令不能单独装出扩展。作者要求Node>=24、Chrome125+/Firefox140+，默认一行安装器构建Chrome；Firefox须单独构建并临时加载。普通Chrome Stable也不等基准自动加载所需的Chrome for Testing。包名相同的非scope npm项目与本仓库无关。

实际shell远程模式从配置分支下载tar，确认工作区结构后rsync --delete-after到托管目录，保留node_modules并清不在新源中的文件；并没有先成功构建所有产物再原子替换整套。随后依赖安装/桥构建、移除旧profile依赖、添加新链接、再构建扩展并同步到稳定目录。扩展构建若失败，Host profile可能已修改；trap清临时下载目录不是整套rollback。已有非托管非空目录会拒绝覆盖是有效防线，但不能把作者“安全更新”当无损事务。Windows文档/PS1本次未全审，不将shell边界冒充同平台实现。

首次需版本/构建、浏览器权限和加载，持续需模型快照/图像、审批及双端升级；恢复需检查源码/依赖/profile/扩展目录处于哪一步，网站已发生动作另对账。退出要先停活动任务，关闭扩展、移除对应profile桥、按归属清信任/token与持久数据，保存要保留的会话/附件。卸扩展不撤网站/剪贴板副作用，一行脚本更新也不能保证恢复旧版本。金额、恢复时间和端到端收益均未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-21](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/package.json#L1-L21)

private工作区、pnpm与固定Host。

<details>
<summary>查看原文（21行）</summary>

```text
{
  "name": "dsh-browser",
  "version": "0.1.4",
  "description": "Standalone dsh browser bridge and controlled-tab Chrome/Firefox extension workspace",
  "author": "Yuxiang Lin",
  "license": "MIT",
  "private": true,
  "packageManager": "pnpm@11.7.0",
  "scripts": {
    "build": "pnpm --filter @yuxianglin/dsh-bridge-browser run build && pnpm --filter dsh-browser-extension run build",
    "start": "dsh web",
    "test": "pnpm --filter @yuxianglin/dsh-bridge-browser run test && pnpm --filter dsh-browser-extension run test",
    "typecheck": "pnpm --filter @yuxianglin/dsh-bridge-browser run typecheck && pnpm --filter dsh-browser-extension run typecheck",
    "check:runtime": "node scripts/check-runtime.mjs",
    "test:smoke": "node scripts/smoke-runtime.mjs",
    "test:browser": "node scripts/smoke-browser.mjs"
  },
  "dependencies": {
    "@deepseek-ai/cordis-plugin-group": "~1.0.5",
    "@deepseek-ai/dsh": "0.2.1-rc.5",
    "@deepseek-ai/dsh-agent-default-model": "0.2.1-rc.5",
```

</details>

**依据 2 · 作者声明**：[README.md:19-35](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/README.md#L19-L35)

作者一体安装及同名npm警示。

<details>
<summary>查看原文（17行）</summary>

````text

macOS and Linux:

```sh
curl -fsSL https://raw.githubusercontent.com/Lum1104/dsh-browser/refs/heads/main/scripts/install.sh | bash
```

Windows, in PowerShell:

```powershell
$s="$env:TEMP\dsh-install.ps1"; irm https://raw.githubusercontent.com/Lum1104/dsh-browser/refs/heads/main/scripts/install.ps1 -OutFile $s; powershell -NoProfile -ExecutionPolicy Bypass -File $s
```

When the installer opens `chrome://extensions`, follow its instructions to load or reload **dsh Browser Assistant**. If dsh is already running, restart it after installation. See [Detailed installation and usage](#detailed-installation-and-usage) for prerequisites, startup commands, updates, and developer installation.

> [!IMPORTANT]
> The unscoped [`dsh-browser`](https://www.npmjs.com/package/dsh-browser) package on npm belongs to a different project and is not affiliated with this repository. This project is not currently published as an npm package; use the installer above.
````

</details>

**依据 3 · 作者声明**：[README.md:98-118](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/README.md#L98-L118)

作者环境、分支下载/构建和扩展加载。

<details>
<summary>查看原文（21行）</summary>

````text
```

or, on Windows:

```powershell
$s="$env:TEMP\dsh-install.ps1"; irm https://raw.githubusercontent.com/Lum1104/dsh-browser/refs/heads/main/scripts/install.ps1 -OutFile $s; powershell -NoProfile -ExecutionPolicy Bypass -File $s
```

The installer downloads `main`, builds and registers the bridge plugin, builds the Chrome extension into `~/.dsh/browser-extension`, and opens `chrome://extensions`. On the first install, load that directory as an unpacked extension; on updates, click **Reload**. Restart dsh if it is already running.

`scripts/install.sh` covers macOS and Linux, and `scripts/install.ps1` covers Windows; both write the same managed workspace and the same install metadata. The installer copies the extension path to the clipboard when a clipboard tool is available (`pbcopy`, `wl-copy`, `xclip`, `xsel`, or PowerShell's `Set-Clipboard`), and prints the path either way. When no Chrome or Chromium install is found, it prints the command that installs one; set `DSH_INSTALL_BROWSER=1` to let the installer attempt that install itself.

The Windows command downloads `install.ps1` and runs it rather than piping it into `Invoke-Expression`: the script is UTF-8 with a byte order mark so Windows PowerShell renders its Chinese output, and `Invoke-Expression` rejects a leading mark. Local checkout paths may contain spaces; the installer registers the bridge through a profile-local directory junction so the package spec never contains the absolute Windows path.

To install the current branch from a source checkout instead:

```sh
git clone https://github.com/Lum1104/dsh-browser.git
cd dsh-browser
./scripts/install.sh
```
````

</details>

**依据 4 · 源码核查**：[scripts/install.sh:252-290](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/scripts/install.sh#L252-L290)

非托管目录拒绝、下载结构检查与rsync更新。

<details>
<summary>查看原文（39行）</summary>

```text
bootstrap_remote_install() {
  local archive
  local source_dir
  local temp_base="${TMPDIR:-/tmp}"

  require_command curl "未找到 curl；请先安装 curl。" "curl was not found; install curl first."
  require_command tar "未找到 tar；请先安装 tar。" "tar was not found; install tar first."
  require_command rsync "未找到 rsync；请先安装 rsync。" "rsync was not found; install rsync first."

  if [ -d "$MANAGED_ROOT" ] && [ ! -f "$MANAGED_MARKER" ] && [ -n "$(ls -A "$MANAGED_ROOT" 2>/dev/null)" ]; then
    fail_pair \
      "$MANAGED_ROOT 已存在且不是脚本托管的安装目录；为避免覆盖，请移动该目录或在其中运行 ./scripts/install.sh。" \
      "$MANAGED_ROOT already exists and is not managed by this installer; move it or run ./scripts/install.sh inside it to avoid overwriting it."
  fi

  print_pair "未检测到完整的本地 checkout，切换到免 clone 安装。" "No complete local checkout was detected; switching to the clone-free install."
  print_pair "正在从 $REPOSITORY 的 $REMOTE_REF 分支下载安装文件……" "Downloading installation files from $REPOSITORY at ${REMOTE_REF}…"

  BOOTSTRAP_TMP="$(mktemp -d "$temp_base/dsh-browser-install.XXXXXX")"
  trap cleanup_bootstrap EXIT HUP INT TERM
  archive="$BOOTSTRAP_TMP/source.tar.gz"
  source_dir="$BOOTSTRAP_TMP/source"
  mkdir -p "$source_dir"

  curl --fail --location --silent --show-error --retry 3 "$ARCHIVE_URL" --output "$archive"
  tar -xzf "$archive" -C "$source_dir" --strip-components=1
  has_workspace "$source_dir" || fail_pair \
    "下载内容不完整，未修改现有安装。" \
    "The download is incomplete; the existing installation was not changed."

  mkdir -p "$MANAGED_ROOT"
  touch "$MANAGED_MARKER"
  rsync -a --delete-after \
    --exclude 'node_modules/' \
    --exclude '.managed-by-install-sh' \
    "$source_dir/" "$MANAGED_ROOT/"

  cleanup_bootstrap
  trap - EXIT HUP INT TERM
```

</details>

**依据 5 · 源码核查**：[scripts/install.sh:319-345](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/scripts/install.sh#L319-L345)

桥→profile→扩展顺序，非整组提交。

<details>
<summary>查看原文（27行）</summary>

```text
require_command rsync "未找到 rsync；请先安装 rsync。" "rsync was not found; install rsync first."

print_step 1 "构建浏览器桥" "Build the browser bridge"
(cd "$ROOT" && pnpm install --frozen-lockfile >/dev/null 2>&1)
(cd "$ROOT" && pnpm --filter @yuxianglin/dsh-bridge-browser run build >/dev/null 2>&1)

print_step 2 "注册到本机 web profile" "Register with the local web profile"
if profile_has_dependency "$WEB_PROFILE_MANIFEST" "$LEGACY_PLUGIN"; then
  (cd "$ROOT" && pnpm exec dsh plugin --profile web remove "$LEGACY_PLUGIN" >/dev/null)
fi
(cd "$ROOT" && pnpm exec dsh plugin --profile web add -w "@yuxianglin/dsh-bridge-browser@link:$PLUGIN" >/dev/null)

print_step 3 "构建 Chrome 扩展" "Build the Chrome extension"
(cd "$ROOT" && pnpm --filter dsh-browser-extension run build >/dev/null 2>&1)

print_step 4 "准备扩展并打开 Chrome" "Prepare the extension and open Chrome"
ensure_chrome || true
DIST_DIR="$DSH_HOME_DIR/browser-extension"
if [ -f "$DIST_DIR/manifest.json" ]; then
  IS_UPDATE=1
else
  IS_UPDATE=0
fi
mkdir -p "$DIST_DIR"
rsync -a --delete-after "$EXT/dist/" "$DIST_DIR/"
if [ -f "$ROOT/.managed-by-install-sh" ]; then
  INSTALL_MODE="managed"
```

</details>

**依据 6 · 作者声明**：[benchmark/README.md:11-20](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/benchmark/README.md#L11-L20)

自动基准浏览器的额外条件。

<details>
<summary>查看原文（10行）</summary>

````text

先从仓库根目录安装与 lockfile 中 `playwright-core` 匹配的 Chrome for Testing、构建当前代码并检查运行矩阵：

```bash
pnpm --dir benchmark install-browser
pnpm build
node benchmark/run.mjs --dry-run --smoke
```

扩展自动加载需要 Chrome for Testing 或 Chromium。新版 Google Chrome Stable 会忽略 `--load-extension`，不能作为扩展后端的自动评测浏览器。
````

</details>

#### 缺口

- 更新中断后各目录/profile恢复，以及Windows/Firefox完整安装退出未验。
  **影响**：新手或不能恢复版本者不适合直接用滚动分支更新生产环境。
  **进一步探讨**：在副本profile故障注入构建/注册/同步各阶段，核保留路径与旧版本回退；Windows单独审脚本再验。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么人值得承担整套工具负担，怎样判定继续或停止？

**研究主题**：采用判断、效果与总成本

#### 完整回答

可控试用对象是能维护双端版本、接受页面内容进入所选模型的单用户，任务是自有无敏感测试站点的阅读和可逆表单操作。相比人工复制网页，实际增量是现有登录页、编号工具和会话连续交接，并有等待后复核；不能将作者基准的20%延迟改善当自己的节时或账单承诺。只有原生页面能表达任务、工具与目标状态可回读时才成立，画布、重要发送/付款和私密页面不应直接扩大使用。

第一次用独立浏览器profile和固定checkout/Host，保留可恢复profile配置；先核读页共享默认、目标标签、拒绝批准、等待中换页和取消，再只试一项可逆动作并人工读回。先不开unrestricted、devtools、文件与剪贴板，后者另有本机副作用。该路径避免将整套最大权限作为起点，但仍需信任本地扩展和owner桥，不能把收窄任务掩盖核心认证/取消限制。

每次合格结果都计模型、截图、重抓、审批、最终网页复核与恢复人工；这比只看tool latency更接近实际代价，金额和时间先记未知。若目标页不符、无法解释已经执行什么、同页控件错误或审批失联，就停止重试并改人工浏览；反复核对比原流程更重也应退出。测试通过本次仅是建议条件，不冒充已执行结果或持续安装结论。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:1273-1321](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/tools.ts#L1273-L1321)

共享/审批/目标复核限定。

<details>
<summary>查看原文（49行）</summary>

```text
  }
  // Privacy boundary: with sharing off, no page content may leave the page.
  if (!tabManagement.unrestrictedAccess
    && sharePageContent === 'off'
    && (call.name === 'browser_snapshot' || call.name === 'browser_get_text' || call.name === 'browser_screenshot')) {
    return { ok: false, error: { code: 'action-failed', message: 'Page content sharing is disabled in Settings > Page content sharing.' } }
  }
  const tab = targetTab ?? (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0]
  if (isCancelled(call, signal)) return cancelled()
  if (tab?.id === undefined) {
    return { ok: false, error: { code: 'no-active-tab', message: 'No active tab is available for browser operations.' } }
  }
  if (targetStillAllowed?.() === false) return targetChanged()
  const frames = await listTabFrames(tab.id, tab.url)
  if (isCancelled(call, signal)) return cancelled()
  if (targetStillAllowed?.() === false) return targetChanged()
  const frameError = validateFrameTarget(call, frames)
  if (frameError !== undefined) return frameError
  if (!isInjectablePage(tab.url) && !TAB_NATIVE_TOOLS.has(call.name) && call.name !== 'browser_screenshot') {
    return unavailable('The current page DOM is protected by the browser. Only snapshot metadata, navigate, back, forward, and reload are available on this page.')
  }
  const targetError = validateElementTarget(call, tab.id, frames)
  if (targetError !== undefined) return targetError
  const approval = tabManagement.unrestrictedAccess
    ? undefined
    : approvalPromptForCall(call, sharePageContent, frames)
  if (approval !== undefined) {
    const authorization = authorize === undefined ? 'unavailable' : await authorize(approval)
    if (isCancelled(call, signal)) return cancelled()
    if (targetStillAllowed?.() === false) return targetChanged()
    if (authorization !== 'approved') {
      return approvalFailure(approval, authorization)
    }
  }
  let executionFrames = frames
  if (approval !== undefined) {
    executionFrames = await listTabFrames(tab.id, tab.url)
    if (isCancelled(call, signal)) return cancelled()
    if (targetStillAllowed?.() === false) return targetChanged()
    const refreshedApproval = approvalPromptForCall(call, sharePageContent, executionFrames)
    if (refreshedApproval === undefined
      || !sameApprovalBoundary(approval, refreshedApproval)
      || (approval.kind === 'action' && !sameTargetDocument(call, frames, executionFrames))) {
      return unavailable('The page changed while approval was pending. Call browser_snapshot again before retrying.')
    }
    const refreshedTargetError = validateElementTarget(call, tab.id, executionFrames)
    if (refreshedTargetError !== undefined) return refreshedTargetError
  }
  if (!isInjectablePage(tab.url)) {
```

</details>

**依据 2 · 源码核查**：[extensions/dsh-browser/src/background/index.ts:121-132](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/index.ts#L121-L132)

默认值与可选高权限。

<details>
<summary>查看原文（12行）</summary>

```text

const SETTINGS_DEFAULTS: Settings = {
  // 空地址 = 自动探测本机 dsh（零配置）；手动填地址时优先手动。
  bridgeUrl: '',
  token: '',
  sharePageContent: 'auto',
  unrestrictedBrowserAccess: false,
  allowDevTools: false,
  trustedActionOrigins: [],
  approvalNotifications: true,
  autoResumeSession: true,
}
```

</details>

**依据 3 · 源码核查**：[extensions/dsh-browser/src/background/index.ts:1379-1405](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/index.ts#L1379-L1405)

实际动作committed/截止状态。

<details>
<summary>查看原文（27行）</summary>

```text
/** Route one tool.call frame to the user-approved controlled tab. */
function routeToolCall(call: ToolCall): void {
  if (bridge === null) return
  activeToolCalls.get(call.id)?.controller.abort()
  const controller = new AbortController()
  const unrestrictedAccess = unrestrictedAccessEnabled()
  let settle!: () => void
  const activeCall: ActiveToolCall = {
    controller,
    name: call.name,
    unrestrictedAccess,
    committed: false,
    revocationRequested: false,
    settled: new Promise<void>((resolve) => { settle = resolve }),
    settle: () => { settle() },
  }
  activeToolCalls.set(call.id, activeCall)
  unsettledToolCalls.add(activeCall)
  const commitAction = (): void => { activeCall.committed = true }
  const rollbackActionCommit = (): void => {
    activeCall.committed = false
    if (activeCall.revocationRequested) controller.abort()
  }
  const expiryTimer = call.expiresAt === undefined
    ? undefined
    : setTimeout(() => {
        if (!activeCall.committed) controller.abort()
```

</details>

**依据 4 · 作者声明**：[README.md:37-47](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/README.md#L37-L47)

作者基准只用于限定对照线索。

<details>
<summary>查看原文（11行）</summary>

```text
## Performance

In a paired 60-run end-to-end benchmark on August 18, 2026, both backends completed all 30 assigned runs successfully, while dsh Browser Control required fewer model/tool round trips and finished faster:

| Backend | Success | Mean end-to-end latency | Mean browser tool calls |
|---|---:|---:|---:|
| **dsh Browser Control** | **30/30** | **5.32 s** | **3.4** |
| Matched Playwright baseline | 30/30 | 6.67 s | 4.7 |

The paired Playwright / extension duration ratio was **1.24** (95% CI **1.16–1.34**): Playwright took about 24% longer, or equivalently, dsh Browser Control reduced latency by about 20% and saved 1.35 seconds per task on average. The suite used six browser tasks, five deterministic seeds, the same DSH profile and model (`deepseek-v4-flash`), and independently validated page state. See the [benchmark methodology and reproduction guide](benchmark/README.md).

```

</details>

**依据 5 · 源码核查**：[scripts/install.sh:319-345](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/scripts/install.sh#L319-L345)

采用承担的双端profile步骤。

<details>
<summary>查看原文（27行）</summary>

```text
require_command rsync "未找到 rsync；请先安装 rsync。" "rsync was not found; install rsync first."

print_step 1 "构建浏览器桥" "Build the browser bridge"
(cd "$ROOT" && pnpm install --frozen-lockfile >/dev/null 2>&1)
(cd "$ROOT" && pnpm --filter @yuxianglin/dsh-bridge-browser run build >/dev/null 2>&1)

print_step 2 "注册到本机 web profile" "Register with the local web profile"
if profile_has_dependency "$WEB_PROFILE_MANIFEST" "$LEGACY_PLUGIN"; then
  (cd "$ROOT" && pnpm exec dsh plugin --profile web remove "$LEGACY_PLUGIN" >/dev/null)
fi
(cd "$ROOT" && pnpm exec dsh plugin --profile web add -w "@yuxianglin/dsh-bridge-browser@link:$PLUGIN" >/dev/null)

print_step 3 "构建 Chrome 扩展" "Build the Chrome extension"
(cd "$ROOT" && pnpm --filter dsh-browser-extension run build >/dev/null 2>&1)

print_step 4 "准备扩展并打开 Chrome" "Prepare the extension and open Chrome"
ensure_chrome || true
DIST_DIR="$DSH_HOME_DIR/browser-extension"
if [ -f "$DIST_DIR/manifest.json" ]; then
  IS_UPDATE=1
else
  IS_UPDATE=0
fi
mkdir -p "$DIST_DIR"
rsync -a --delete-after "$EXT/dist/" "$DIST_DIR/"
if [ -f "$ROOT/.managed-by-install-sh" ]; then
  INSTALL_MODE="managed"
```

</details>

#### 缺口

- 实际重复任务的合格率、人审总时间和费用没有独立对照。
  **影响**：只推荐明确受控试用，不能推荐持续安装或生产节费。
  **进一步探讨**：同任务/模型预算比较手工浏览，全部计入重试/复核；净收益不成立则停。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 已有文档/目标检查之外，什么方向值得独立检验？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可复用已有设计是把目标归属、来源授权和执行期取消从模型意图中分离，批准后再次核对document，且只在明确缺接收器时补注入重试。这比依赖模型“我点对了”更能解释限制，但同文档内控件语义替换和副作用未知仍不由document ID解决。

未验证方向是在高影响控件上把快照ID与语义摘要、关键属性和预期动作绑定，执行前与当前控件比较，变化时返回冲突并要求人确认；不要替换现有document/来源检查。相对现有编号/selector与文档验证的增量是检测同页语义变更，代价是误拒、额外读取和维护不同控件类型，不能默认优于现有stable ID。

用同一SPA测试页、模型与预算，比较现实现与语义绑定，分别注入按钮重排、节点保留但用途改变、iframe替换和正常动画。测错误点击、误拒、重抓、人审/总耗时和实际网页结果；若当前机制已足够或误拒/成本更大则不加机制，必要时只限提交/删除按钮。方向未实现，不计当前贡献；不从此推断真实用户已提出市场需求。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:1295-1321](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/tools.ts#L1295-L1321)

当前批准后复核。

<details>
<summary>查看原文（27行）</summary>

```text
  if (targetError !== undefined) return targetError
  const approval = tabManagement.unrestrictedAccess
    ? undefined
    : approvalPromptForCall(call, sharePageContent, frames)
  if (approval !== undefined) {
    const authorization = authorize === undefined ? 'unavailable' : await authorize(approval)
    if (isCancelled(call, signal)) return cancelled()
    if (targetStillAllowed?.() === false) return targetChanged()
    if (authorization !== 'approved') {
      return approvalFailure(approval, authorization)
    }
  }
  let executionFrames = frames
  if (approval !== undefined) {
    executionFrames = await listTabFrames(tab.id, tab.url)
    if (isCancelled(call, signal)) return cancelled()
    if (targetStillAllowed?.() === false) return targetChanged()
    const refreshedApproval = approvalPromptForCall(call, sharePageContent, executionFrames)
    if (refreshedApproval === undefined
      || !sameApprovalBoundary(approval, refreshedApproval)
      || (approval.kind === 'action' && !sameTargetDocument(call, frames, executionFrames))) {
      return unavailable('The page changed while approval was pending. Call browser_snapshot again before retrying.')
    }
    const refreshedTargetError = validateElementTarget(call, tab.id, executionFrames)
    if (refreshedTargetError !== undefined) return refreshedTargetError
  }
  if (!isInjectablePage(tab.url)) {
```

</details>

**依据 2 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:1418-1436](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/tools.ts#L1418-L1436)

当前document/编号与来源边界判据。

<details>
<summary>查看原文（19行）</summary>

```text
  // A selector or "the focused element" is self-contained; only
  // a snapshot index needs a snapshot of the same document to resolve.
  if (!INDEX_TARGETED_TOOLS.has(call.name)) return undefined
  if (call.args.index === undefined) return undefined
  const frameId = requestedFrame(call.args)
  const frame = frames.find((candidate) => candidate.frameId === frameId)
  const snapshotted = snapshotDocumentsByTab.get(tabId)?.get(frameId)
  if (frame === undefined || snapshotted === undefined || snapshotted !== frameDocumentKey(frame)) {
    return unavailable('The element reference does not belong to the current document. Call browser_snapshot again for current frame and index values.')
  }
  return undefined
}

function sameApprovalBoundary(before: ApprovalPrompt, after: ApprovalPrompt): boolean {
  return before.kind === after.kind
    && before.action === after.action
    && before.origins.length === after.origins.length
    && before.origins.every((origin, index) => origin === after.origins[index])
}
```

</details>

**依据 3 · 源码核查**：[extensions/dsh-browser/src/background/tools.ts:1346-1395](https://github.com/omdsh-dev/dsh-browser/blob/f7bafd3191e96745cb94a1074d189e23a30b3d3b/extensions/dsh-browser/src/background/tools.ts#L1346-L1395)

缺接收器补注入的明确重试条件。

<details>
<summary>查看原文（50行）</summary>

```text
    const trustedFailureAnswer = devToolsFailure(error)
    if (trustedFailureAnswer !== undefined) return trustedFailureAnswer
    if (!contentScriptReceiverMissing(error)) {
      const detail = error instanceof Error ? error.message : String(error)
      return unavailable(`The browser operation failed after it was dispatched: ${detail}`)
    }
    // Manifest content scripts do not run retroactively in tabs that were
    // already open when an unpacked extension was installed or reloaded.
    // Recover in place so the user never has to refresh and lose page state.
    try {
      await injectContentScript(tab.id)
    } catch {
      return await dispatchTabNativeTool(tab.id, tab.url, tab.title, tab.windowId, call, effectiveBudget, signal, targetStillAllowed, tabManagement.commitAction)
        ?? unavailable('The content script could not be loaded on this page. Its DOM does not support browser operations.')
    }
    try {
      if (isCancelled(call, signal)) return cancelled()
      if (targetStillAllowed?.() === false) return targetChanged()
      const refreshedFrames = await listTabFrames(tab.id, tab.url)
      if (isCancelled(call, signal)) return cancelled()
      if (targetStillAllowed?.() === false) return targetChanged()
      const refreshedTargetError = validateElementTarget(call, tab.id, refreshedFrames)
      if (refreshedTargetError !== undefined) return refreshedTargetError
      if (approval !== undefined) {
        const refreshedApproval = approvalPromptForCall(call, sharePageContent, refreshedFrames)
        if (refreshedApproval === undefined
          || !sameApprovalBoundary(approval, refreshedApproval)
          || (approval.kind === 'action' && !sameTargetDocument(call, executionFrames, refreshedFrames))) {
          return unavailable('The page changed while the content script was loading. Call browser_snapshot again before retrying.')
        }
      }
      return await dispatchOnce(
        tab.id,
        refreshedFrames,
        call,
        effectiveBudget,
        signal,
        targetStillAllowed,
        tabManagement.unrestrictedAccess || sharePageContent === 'auto',
        tabManagement.commitAction,
        tabManagement.rollbackActionCommit,
        tabManagement.input,
      )
    } catch (error: unknown) {
      const trustedFailureAnswer = devToolsFailure(error)
      if (trustedFailureAnswer !== undefined) return trustedFailureAnswer
      const detail = error instanceof Error ? error.message : String(error)
      return unavailable(`The content script did not answer after it was loaded (${detail}). Call browser_snapshot again before retrying.`)
    }
  }
```

</details>

#### 缺口

- 语义绑定对同页动态控件是否有净收益未知。
  **影响**：不能把未来保护当当前已防错能力或必须开发方向。
  **进一步探讨**：以上故障与正常动画同条件对照，错误不降或误拒增加则放弃。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
