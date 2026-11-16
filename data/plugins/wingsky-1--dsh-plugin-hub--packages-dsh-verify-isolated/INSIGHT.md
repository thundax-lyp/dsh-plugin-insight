# dsh-verify-isolated

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[62d5343](https://github.com/wingsky-1/dsh-plugin-hub/tree/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wingsky-1/dsh-plugin-hub) [![npm 30d 1,622](https://img.shields.io/static/v1?label=npm+30d&message=1%2C622&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wingsky-1/dsh-verify-isolated) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wingsky-1/dsh-verify-isolated)
<!-- END META -->

> **功能**：在临时 DSH 环境和独立浏览器中验证插件界面改动。

> **亮点**：在锚定宿主版本后，脚本统一准备临时 DSH_HOME、profile、回环端口和可选独立浏览器，并记录宿主启动与退出状态。真实页面截图和断言仍需操作者检查。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：HTTP 小于 500 即可满足启动 readiness，401 仍须完成身份验证再判目标功能。探针跳过、审计告警和清理异常需要独立解读，退出码或 verdict 不能替代端口与文件回查。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 它针对什么验证任务，较普通 smoke/unit test 或使用者主 profile 多解决什么？](#detail-section-11)
  - [Q02 · 脚本如何启动、挂载插件、打开浏览器并生成证据？](#detail-section-12)
  - [Q03 · 审计和安全隔离具体覆盖什么，哪些范围不覆盖？](#detail-section-13)
  - [Q04 · 适合怎样采用该验证工具，成本/失败恢复如何核算？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向修改 DSH 插件客户端 UI、响应式布局或宿主渲染的开发者。工具在临时 DSH_HOME、独立 profile/端口和可选独立浏览器中启动真实 DSH Web，提供截图/快照证据与结束 verdict；较单元测试多验证真实宿主渲染，较主 profile 操作降低污染风险。脚本只执行验证环境搭建，并不替代任务行为判定。

在主 profile 启动浏览器可直接观察页面，却会共用用户设置与宿主状态。单元测试能快速验证单点逻辑，手工临时 profile 能另做真实宿主检查。组合脚本的比较点是搭建和回收步骤，而不是替代独立 UI 断言。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件与边界 |
| --- | --- | --- |
| 隔离宿主启动 | 在临时 home、profile 和端口装载目标插件 | 必须匹配声明的固定 DSH 版本 |
| 独立浏览器驱动 | 对真实页面截图和采集快照 | 浏览器模式才启用，需完成身份验证和功能断言 |
| 审计与终态记录 | 区分启动、可选探针和清理阶段 | audit 可选，probe skip 不是任务通过；资源另行回读 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| PATH 中的 DSH 0.2.2-rc.1 与 Node | 运行回环宿主和版本预检 | 版本无法读取或不匹配时提前退出 |
| 插件构建所需 pnpm 和依赖 | 准备可供临时 profile 挂载的插件 | 已有产物使用仍需人工确认版本及入口 |
| Chromium 与 CDP（浏览器模式） | 独立地打开 Web 并保存界面证据 | 实际登录与页面断言由验证者核对 |

| 阶段 | 操作 | 异常与退出 |
| --- | --- | --- |
| 启动 | 固定二进制、构建插件，用临时 profile 启回环宿主 | 端口响应仅证明可达，排除 401 与错误页 |
| 检查 | 在独立浏览器作一项变更的 UI 断言并保留截图 | 可选 probe 和 audit 的 skip、error 与通过分开看 |
| 清理 | 正常退出，复查监听、浏览器进程及临时目录 | 显式 --keep 时根据记录处理保留目录 |

**效果与成本**

| 阶段 | 现金与资源 | 人工投入 | 未知 |
| --- | --- | --- | --- |
| 准备 | 本地安装固定 DSH、工具链与可选浏览器 | 核对构建和版本 | 与手搭 profile 的准备时间未测 |
| 运行 | 会启动真实宿主、可选 Chromium 与取证文件 | 人工复核首启、登录和实际 UI 行为 | 资源峰值及长期团队采用成本未知 |
| 收尾 | 退出后可能留有临时目录或仍在关闭的进程 | 保存必要证据，检查端口和清理结果 | 失败回收时间与异常残留未实测 |

| 效果项 | 当前源码可支持 | 未验证项 |
| --- | --- | --- |
| 取得宿主渲染证据 | 真实进程、独立 browser profile 与证据输出均有固定接线 | 具体插件行为、截图正确性和版本兼容要分别检查 |
| 降低主配置干扰 | 环境变量与回环监听限定验证环境 | 审计只有显式作用域，不能覆盖 OS 权限与外部副作用 |

> **思考**：HTTP 小于 500 即可满足启动 readiness，401 仍须完成身份验证再判目标功能。探针跳过、审计告警和清理异常需要独立解读，退出码或 verdict 不能替代端口与文件回查。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在锚定宿主版本后，脚本统一准备临时 DSH_HOME、profile、回环端口和可选独立浏览器，并记录宿主启动与退出状态。真实页面截图和断言仍需操作者检查。[Q01](#research-q01) [Q02](#research-q02)

版本预检锚定 DSH 可执行文件。运行期 verdict 将 readiness 和退出码组合为终态，401 可达到 readiness。退出统一处理宿主、浏览器、可选审计、状态文件和目录，审计及清理异常只提示并可能不改变进程退出码。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

HTTP 小于 500 即可满足启动 readiness，401 仍须完成身份验证再判目标功能。探针跳过、审计告警和清理异常需要独立解读，退出码或 verdict 不能替代端口与文件回查。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

在一次易复原的修改上先确认宿主版本与构建，再用独立浏览器检查一项目标控件。若仅记录到可达、探针跳过或退出后资源仍在，回查实际页面、端口和目录后再决定是否采纳验证结果。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码核实版本锚定、回环启动规则、可选浏览器与清理时序。插件业务行为、浏览器截图有效性和实际隔离效果仍待宿主试验。

- 已检查：作者 README、包清单、源码路径 packages/dsh-verify-isolated/skills/dsh-verify-isolated/SKILL.md、packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs、packages/dsh-verify-isolated/README.md、packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/browser-driver.mjs 及固定范围 inventory；组件：packages/dsh-verify-isolated。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 wingsky-1/dsh-plugin-hub packages/dsh-verify-isolated 的固定提交、README/manifest、入口和直接调用的关键模块；未安装或执行目标插件、宿主、浏览器、模型/API或第三方服务。
- 下一步：用一个固定 UI 修改做样本，核对初始化、身份验证、目标控件与截图。另检查 401 readiness、审计异常、探针跳过及 --keep 的记录与预期一致。退出后独立确认端口、宿主、浏览器和临时目录。[Q04](#research-q04)

**分析版本**

- **仓库**：[wingsky-1/dsh-plugin-hub](https://github.com/wingsky-1/dsh-plugin-hub)
- **版本号**：0.2.11（[固定提交 62d5343](https://github.com/wingsky-1/dsh-plugin-hub/tree/62d5343c0021d115e350875157f6b33a23072d28)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

固定环境加可回读的页面与清理证据，可能减少团队在重复 UI 回归中搭建环境及重跑的工时。用同一界面修改对照手搭临时 profile 与随包脚本，计准备耗时、目标控件断言、误把 401 当通过和环境残留。若证据仍不能复查或总工时不降，则继续人工搭建。[Q04](#research-q04)

用一个固定 UI 修改做样本，核对初始化、身份验证、目标控件与截图。另检查 401 readiness、审计异常、探针跳过及 --keep 的记录与预期一致。退出后独立确认端口、宿主、浏览器和临时目录。[Q04](#research-q04)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1041 | — | — | 14151 |
| .mjs | source | 11 | 3602 | 2598 | 809 | — |
| .ts | source | 1 | 17 | 3 | 13 | — |
| .ts | test | 12 | 3387 | 2875 | 127 | — |

</details>

**活跃度**

[![Issue 未关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/wingsky-1/dsh-plugin-hub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 26](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=26&color=737b86&logo=github)](https://github.com/wingsky-1/dsh-plugin-hub/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z) [![近30天关闭 32](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=32&color=737b86&logo=github)](https://github.com/wingsky-1/dsh-plugin-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)



统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：隔离验证脚本能否让插件 UI 浏览器验收可重复且不污染用户 DSH_HOME，同时哪些写面和版本条件仍在隔离范围之外？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它针对什么验证任务，较普通 smoke/unit test 或使用者主 profile 多解决什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向修改 DSH 插件客户端 UI、响应式布局或宿主渲染的开发者。工具在临时 DSH_HOME、独立 profile/端口和可选独立浏览器中启动真实 DSH Web，提供截图/快照证据与结束 verdict；较单元测试多验证真实宿主渲染，较主 profile 操作降低污染风险。脚本只执行验证环境搭建，并不替代任务行为判定。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/SKILL.md:11-37](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/SKILL.md#L11-L37)

定义 UI 改动适用范围和四重隔离。

<details>
<summary>查看原文（27行）</summary>

```text
# dsh-verify-isolated — 隔离环境浏览器验证

> 适用于任意 dsh 插件仓库的**客户端界面改动**（`src/client/**` 或宿主端 UI 渲染逻辑）
> 的浏览器实测。本 skill 是可执行清单；仓库级约定（截图归档路径、PR 证据要求）以被测
> 仓库自身为准。

## 0. 何时用

凡改动命中以下区域，**必须**做隔离环境浏览器验证并附截图：

- `src/client/**`（客户端 UI 渲染逻辑、样式、组件）
- 宿主端涉及 UI 渲染逻辑的改动（如路由注入、URL 重写、overlay/Modal 渲染、双主题适配）
- 涉及窄屏/响应式布局的调整

**不需要**的例外：纯文档改动、纯宿主端逻辑（不涉及 UI 渲染）、纯后端数据流变更。

## 1. 四重隔离

| 隔离层 | 做法 | 隔离内容 |
|--------|------|----------|
| 一：临时 `DSH_HOME` | `DSH_HOME=$(mktemp -d)` | 凭据、会话、全部用户数据、home 级 `cordis.patch.yml` |
| 二：独立 profile | `verify_<8位随机>`（非 `web`） | 插件组合栈（bundles）、profile 级 patch、插件依赖 |
| 三：独立端口 | `--port` 自选/探测空闲端口 | 与运行中主 `dsh web` 及其它验证实例互不冲突 |
| 四：独立浏览器实例 | `--browser` 拉起自带浏览器（独立 user-data-dir + 调试端口） | 页面/tab/console 完全独立，多会话并行互不可见 |

只建独立 profile 不够：profile 共享 home 级的凭据与会话；只有同时把 `DSH_HOME` 指向
临时目录，才做到与用户正在使用的环境完全隔离。
```

</details>

**依据 2 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs:9-33](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs#L9-L33)

脚本建立隔离 home/profile/端口和独立 browser。

<details>
<summary>查看原文（25行）</summary>

```text
 * 用途：在不污染真实 ~/.dsh（含正在使用的 web profile）的前提下，拉起一个
 * 完全隔离的 dsh web 实例，用于客户端 UI 改动的浏览器实测。
 *
 * 四重隔离：
 *   1. DSH_HOME 指向全新临时目录 —— 隔离凭据 / 会话 / home 级 cordis.patch.yml；
 *   2. 独立 profile verify_<8位随机> —— 隔离插件组合栈，不触碰用户 web profile；
 *   3. 独立端口 + 显式回环（--host 127.0.0.1）—— 当前 dsh 默认即回环，显式写死
 *      把隐式行为钉成结构性保证，防上游默认变更；
 *   4. --browser 时独立浏览器实例（browser-driver.mjs，raw CDP 零依赖）。
 * 隔离环境同时显式 DSH_TELEMETRY_DISABLED=1：测试数据不外发遥测（0.1.2 线
 * profile-boot 消费的官方开关）。
 *
 * 用法：
 *   node verify-isolated.mjs [--port <port>] [--browser] [--keep]
 *                            [--no-build] [--evidence-dir <dir>] [--audit]
 *                            [--audit-extra-dirs <dir>] [--no-skip-onboarding]
 *                            [--probe-provider-usage] [--json] [-- <pkg-path>...]
 *   dsh 入口     从 PATH 解析 `dsh`，要求 `dsh --version` 为 0.2.2-rc.1。找不到、
 *                不可用、读取失败或其它版本一律 fail-closed，避免产出不属于目标
 *                runtime 的 preset/验证证据。
 *   --port <port>      默认 3456；--port 0 自动探测真实空闲端口并打印（修复打印 0）。
 *                      探测块贴近 dsh 启动，防 EADDRINUSE 窗口。
 *   --browser          额外启动独立浏览器实例（browser-driver.mjs）：独立
 *                      user-data-dir + 自选空闲调试端口 + headless，实例信息写入
 *                      $ISOLATED_HOME/browser.state（与 DSH_HOME 同生命周期）。
```

</details>

**依据 3 · 作者声明**：[packages/dsh-verify-isolated/README.md:1-35](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/README.md#L1-L35)

插件用途与安装说明。

<details>
<summary>查看原文（35行）</summary>

````text
# dsh-verify-isolated

DSH 插件开发的**隔离环境浏览器验证** skill 插件：临时 `DSH_HOME` + 独立
`verify_<随机>` profile + 独立端口 + **独立浏览器实例**四重隔离，一键拉起隔离
`dsh web`，退出自动清理，不污染正在使用的 `web` profile。

## 安装

```bash
dsh plugin --profile web add @wingsky-1/dsh-verify-isolated
```

> 安装 / 卸载 / 更新后都需**重启一次** `dsh web`（bundle 层只在启动时组合）生效。

安装后 `dsh-verify-isolated` skill 自动注册为内置 skill，profile 内所有会话
即可用（`/skill dsh-verify-isolated` 查看）。

## 工作原理

- **内置 skill 注册**：`cordis.patch.yml` 复用官方 `@deepseek-ai/dsh-skill-filesystem`
  的 `bundledSkillDir` 配置，从包 manifest 解析本包 `skills/` 目录（参照
  [archify-dsh](https://github.com/tt-a1i/archify) 模式）——官方 provider 发现并
  注册 `skills/dsh-verify-isolated/SKILL.md`，无需自写注册代码；
- **主线 + 支线披露**：`SKILL.md` 只放每次验证都要用的判据与步骤（何时用、快速路径、
  两个硬前提、隔离自检、核验与完成检查），支线内容（脚本契约、手动步骤、内核排查、
  视口几何方法论）下沉到 `references/`，各文件自包含、由主线按「读它的时机」指向——
  一次常规验证不必加载支线，触发到对应分支时才读；
- **四重隔离**：`DSH_HOME=$(mktemp -d)` 隔离凭据/会话/home 级 patch；独立
  `verify_<8位随机>` profile 隔离插件组合栈；独立端口隔离网络面；**独立浏览器
  实例**（`--browser`）隔离页面/tab/console——多会话并行互不可见，从结构上杜绝
  共享 MCP 浏览器的 tab 漂移串扰；
- **自带浏览器驱动** `skills/dsh-verify-isolated/scripts/browser-driver.mjs`：
  raw CDP 零依赖（仅 Node ≥22 内置全局 WebSocket），launch 独立 chromium
  （临时 user-data-dir + 自选空闲调试端口 + headless），原子操作 CLI
  （snapshot / click / eval / fill / wait / screenshot / console / quit），
````

</details>

#### 缺口

- 没有真实插件改动的对照验收记录。
  **影响**：无法量化相对 mock 单测发现问题的增益
  **进一步探讨**：选同一 UI 改动比较两种方式的缺陷发现和操作成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 脚本如何启动、挂载插件、打开浏览器并生成证据？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Node 脚本校验 PATH 中 dsh 必须是 0.2.2-rc.1，创建临时 home/profile，注入 web-app bundle、构建/挂载插件并启动 loopback web；可选启动独立 headless 浏览器，经 raw CDP 操作和保存证据。退出阶段杀 dsh/浏览器、审计、写 verdict 并清理临时目录。依赖固定版本 DSH、Node、pnpm/插件构建产物及 Chromium（浏览器模式）。

启动判断使用进程仍存活与回环 HTTP 状态小于 500，401 也能满足 readiness。中间 verdict 的 ok 与 ready 表示启动可达；终态 ok 使用 readyOk 与退出码，不能代替身份、目标功能、截图和插件操作的结果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs:9-33](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs#L9-L33)

用途、隔离层和运行参数。

<details>
<summary>查看原文（25行）</summary>

```text
 * 用途：在不污染真实 ~/.dsh（含正在使用的 web profile）的前提下，拉起一个
 * 完全隔离的 dsh web 实例，用于客户端 UI 改动的浏览器实测。
 *
 * 四重隔离：
 *   1. DSH_HOME 指向全新临时目录 —— 隔离凭据 / 会话 / home 级 cordis.patch.yml；
 *   2. 独立 profile verify_<8位随机> —— 隔离插件组合栈，不触碰用户 web profile；
 *   3. 独立端口 + 显式回环（--host 127.0.0.1）—— 当前 dsh 默认即回环，显式写死
 *      把隐式行为钉成结构性保证，防上游默认变更；
 *   4. --browser 时独立浏览器实例（browser-driver.mjs，raw CDP 零依赖）。
 * 隔离环境同时显式 DSH_TELEMETRY_DISABLED=1：测试数据不外发遥测（0.1.2 线
 * profile-boot 消费的官方开关）。
 *
 * 用法：
 *   node verify-isolated.mjs [--port <port>] [--browser] [--keep]
 *                            [--no-build] [--evidence-dir <dir>] [--audit]
 *                            [--audit-extra-dirs <dir>] [--no-skip-onboarding]
 *                            [--probe-provider-usage] [--json] [-- <pkg-path>...]
 *   dsh 入口     从 PATH 解析 `dsh`，要求 `dsh --version` 为 0.2.2-rc.1。找不到、
 *                不可用、读取失败或其它版本一律 fail-closed，避免产出不属于目标
 *                runtime 的 preset/验证证据。
 *   --port <port>      默认 3456；--port 0 自动探测真实空闲端口并打印（修复打印 0）。
 *                      探测块贴近 dsh 启动，防 EADDRINUSE 窗口。
 *   --browser          额外启动独立浏览器实例（browser-driver.mjs）：独立
 *                      user-data-dir + 自选空闲调试端口 + headless，实例信息写入
 *                      $ISOLATED_HOME/browser.state（与 DSH_HOME 同生命周期）。
```

</details>

**依据 2 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs:72-104](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs#L72-L104)

退出码与临时证据/清理说明。

<details>
<summary>查看原文（33行）</summary>

```text
 * 退出码契约（显式表，smoke 锁定）：
 *   +-----+------------------------------------------------------------------+
 *   |  0  | 正常完成：启动 + 就绪 + 前台等待 dsh 退出，清理完毕                |
 *   |  1  | 启动或就绪失败：profile 初始化失败 / add 失败 / dsh 就绪前退出 /   |
 *   |     | 15s 就绪超时                                                      |
 *   |  2  | 参数错误：未知选项 / 缺参 / 找不到 dsh 入口 / --no-build 缺产物    |
 *   | 130 | SIGINT（Ctrl+C）：终态清理后透传                                   |
 *   | 143 | SIGTERM：终态清理后透传                                            |
 *   +-----+------------------------------------------------------------------+
 *   （--probe-provider-usage 的 fail 也归 1：凭据存在但 no-api-key / stats 请求或
 *    响应不可用；skip/pass 归 0。探针模式跑完即退出，不进入前台等待。）
 *   （其余：就绪后 dsh 自身异常退出码原样透传；信号退出归一为 130/143——与
 *     bash 版 wait 透传同语义，见 main() 中 child "exit" 处理注释。）
 *
 * Windows 三坑（承诺等级：试验性，文档已标注；smoke 不启动 dsh，Windows 行为走
 * 代码审查）：
 *   1. spawn/execFile 对 .cmd 回退：.cmd/.bat 入口无 PATHEXT 解析，统一
 *      shell:true 回退（见 spawnDsh / readDshVersion / runDsh / resolveDsh
 *      注释）；win32 下 PATH 查找优先 .exe，仅剩 .cmd/.bat 时按脚本回退；
 *   2. 无 POSIX 信号：SIGTERM/SIGINT 语义在 Windows 不成立，kill 走
 *      taskkill /T /F 进程树（见 killDsh）；
 *   3. taskkill /T 进程树清理：Node child.kill 只杀壳进程、孙进程残留，
 *      统一按 pid 树清理。
 *
 * B6 启动自检 verdict：就绪后写 $ISOLATED_HOME/verdict.json（0o600），退出终态
 * 更新 cleanup 字段（中间态 "running" → 终态 "done" / "kept"）。端口实际绑定
 * 三通道：parsed（解析 dsh.log 端口行）→ asserted（就绪断言端口）→ probed
 * （--port 0 探测端口），标 source。
 *
 * B7 证据目录：默认 $ISOLATED_HOME/evidence/；供截图/快照等归档，退出随
 * DSH_HOME 一并清理（--keep 保留）。显式 --evidence-dir 时建外部子目录，
 * 绝不动外部目录本体。
 *
```

</details>

**依据 3 · 作者声明**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/SKILL.md:43-61](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/SKILL.md#L43-L61)

固定 runtime 版本和调用方式。

<details>
<summary>查看原文（19行）</summary>

````text
## 2. 跑起来

```bash
# 工作目录：被测插件所在的仓库（插件参数的相对路径按当前 cwd 绝对化）
# SKILL_BASE 取注入的「Base directory for this skill:」后面的绝对路径：
SKILL_BASE="<Base directory for this skill 一行的绝对路径，见 skill_resources>"
# 环境要求：PATH 中 `dsh --version` 为 `0.2.2-rc.1`（只支持该版本）。
# 最小可用：起隔离实例（--port 0 自动探测空闲端口）
node "$SKILL_BASE/scripts/verify-isolated.mjs" --port 0 <插件包路径>
# 要跑浏览器验证：加 --browser（自带独立浏览器实例，见 §4 并行约束）
node "$SKILL_BASE/scripts/verify-isolated.mjs" --port 0 --browser <插件包路径>
# 可选真实宿主 provider-usage 探针（就绪后请求 stats/health 即退出；无凭据 skip，见 §5.4）
node "$SKILL_BASE/scripts/verify-isolated.mjs" --port 0 --probe-provider-usage <插件包路径>
# 排查用：--keep 保留临时 DSH_HOME；--no-build 跳过挂载前的 pnpm build
node "$SKILL_BASE/scripts/verify-isolated.mjs" --port 0 --keep --no-build <插件包路径>
```

本 skill 只支持 dsh `0.2.2-rc.1`，不兼容其它 runtime。dsh 入口从 PATH 解析；
PATH 中找不到、版本读取失败或版本不匹配都立即失败。
````

</details>

**依据 4 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/browser-driver.mjs:361-424](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/browser-driver.mjs#L361-L424)

独立浏览器启动和 state 保存。

<details>
<summary>查看原文（64行）</summary>

```text
async function cmdLaunch(flags) {
  const statePath = flag(flags, "state", "browser.state");
  const chromePath = flag(flags, "chrome", null);
  const userDataDir = flag(flags, "user-data-dir", null);
  const port = Number(flag(flags, "port", "0"));
  const ownedDir = !userDataDir; // 未显式指定则 mkdtemp 自建，quit 时一并清理
  const finalUserDataDir = userDataDir || mkdtempSync(join(tmpdir(), "dsh-verify-"));
  const bin = chromePath || detectChrome();

  let actualPort = port;
  if (!actualPort) actualPort = await findFreePort();

  const stderrBuf = [];
  const headlessFlags = ["--headless=new", "--headless"];
  let child = null;
  let version = null;

  for (const headless of headlessFlags) {
    const args = [
      headless,
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-dev-shm-usage",
      "--remote-debugging-address=127.0.0.1",
      `--remote-debugging-port=${actualPort}`,
      `--user-data-dir=${finalUserDataDir}`,
      "about:blank",
    ];
    stderrBuf.length = 0;
    child = spawn(bin, args, { stdio: ["ignore", "ignore", "pipe"] });
    child.unref(); // daemon：父进程退出不等待浏览器，实例由 state 文件管理
    child.stderr.on("data", (c) => {
      if (stderrBuf.join("").length < 4096) stderrBuf.push(String(c));
    });
    try {
      version = await waitForDebugEndpoint(actualPort, child, 15000, () =>
        stderrBuf.join("").split("\n").slice(-8).join("\n"),
      );
      break;
    } catch (e) {
      if (child && pidAlive(child.pid)) {
        try {
          child.kill("SIGKILL");
        } catch {}
      }
      const headlessHint = /headless/i.test(stderrBuf.join(""));
      if (headless === "--headless=new" && headlessHint && child.exitCode !== null) continue; // 旧内核不认 =new，回退
      throw e;
    }
  }

  const state = {
    version: 1,
    pid: child.pid,
    port: actualPort,
    chromePath: bin,
    userDataDir: finalUserDataDir,
    userDataDirOwned: ownedDir,
    wsUrl: version.webSocketDebuggerUrl,
    launchedAt: new Date().toISOString(),
  };
  // 0o600：state 含调试 wsUrl/pid 等敏感信息，仅限本用户可读
  writeFileSync(statePath, JSON.stringify(state, null, 2), { mode: 0o600 });
```

</details>

**依据 5 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs:293-321](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs#L293-L321)

准备和终态口径以及 HTTP 就绪阈值。

<details>
<summary>查看原文（29行）</summary>

```text
function writeVerdictRunning() {
  writeVerdict({ ok: true, ready: true, readyAt: readyIso, cleanup: "running" });
}

function writeVerdictTerminal() {
  const done = readyOk && (exiting?.code ?? EXIT.FAIL) === 0;
  writeVerdict({
    ok: done,
    ready: readyOk,
    readyAt: readyIso,
    cleanup: flags?.keep ? "kept" : "done",
  });
}

// --- 就绪断言：轮询 HTTP 可达 + 进程存活核对 ---
// 2xx-4xx 就绪（GUI 带鉴权，实测 401 即就绪）、5xx/拒绝继续等、
// AbortSignal.timeout 1.5s、15s 超时、进程退出立即判失败。
async function waitReady(port, pid) {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  for (;;) {
    if (!pidAlive(pid)) return "dead";
    try {
      const r = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(1500) });
      if (r.status < 500) return "ready";
    } catch {
      /* 连接拒绝 / 超时：继续等 */
    }
    if (Date.now() >= deadline) return "timeout";
    await new Promise((r) => setTimeout(r, 250));
```

</details>

**依据 6 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs:835-876](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs#L835-L876)

校验版本、构建装载、起服务、记录基线和可选探针的顺序。

<details>
<summary>查看原文（42行）</summary>

```text
  // 0a + 0（分阶段 helpers，顺序不变：先参数校验，再 dsh 入口锚定）
  const extraDirsAbs = resolveAuditExtraDirs(f);
  auditExtraDirsAbs = extraDirsAbs;
  resolveDshEntry();

  // 1 + 1b + 2 + 3 + 4（分阶段 helpers，顺序不变）
  setupIsolatedHome(f, extraDirsAbs);
  onboardingPreset = resetOnboardingPreset(f, { isolatedHome, dshAbs, out, outWarn });
  initProfileAndBundles({ isolatedHome, profile, runDsh });
  setupPlugins(pkgs, {
    noBuild: f.noBuild,
    jsonMode,
    profile,
    out,
    outWarn,
    runDsh,
  });

  // 5 + 6 + 7（分阶段 helpers，顺序不变）
  launchBrowserIfNeeded(f);
  await resolveWebPort(f);
  syncBrowserPort(f);

  out(`隔离环境就绪: DSH_HOME=${isolatedHome}  profile=${profile}`);
  out(`启动 dsh web 于 http://127.0.0.1:${dshWebPort} （Ctrl+C 退出并自动清理）`);

  // 8 + 9 + 9b + B4 + 10 + 11（分阶段 helpers，顺序不变）
  spawnDshChild();
  const collector = createDshLogCollector();
  dshChild.stdout.on("data", collector.onData);
  dshChild.stderr.on("data", collector.onData);
  attachChildExitHandler();
  const verdictPort = dshWebPort;
  await awaitDshReady(collector, verdictPort);
  await resolveAccessUrl(f);
  // 审计 t0 在探针请求之前：探针是运行期行为，写面增量应计入审计面。
  snapshotAuditBaseline(f, extraDirsAbs);
  // 11. 可选真实宿主探针：跑完即退出，退出码由探针判定（skip/pass=0，fail=1）。
  if (f.probeProviderUsage) {
    const probeCode = await runProviderUsageProbeStep();
    requestExit(probeCode, null);
    await settle();
```

</details>

#### 缺口

- 本轮没有执行脚本或检查脚本与当前宿主CLI兼容。
  **影响**：运行依赖安装、浏览器可用性及构建时长未知
  **进一步探讨**：在无用户数据的临时机器按固定版本重放。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 审计和安全隔离具体覆盖什么，哪些范围不覆盖？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

脚本显式隔离临时 DSH_HOME、profile、回环端口和可选浏览器 user-data-dir；审计只比较隔离目录/显式附加目录对白名单的变化，不扫描真实 home，审计异常不阻断退出。provider-usage 探针不复制真实凭据，无凭据时标记未验证。GUI 认证需使用启动 URL token；首启弹窗或错误 401 页面可能让截图误判。

审计是可选的，异常进入 audit.conclusion=error 且不改退出码。清理先尝试关闭 DSH 与浏览器，再审计、写终态 verdict，之后才删除临时目录；异常只警告继续退出。因此 cleanup 字样、进程退出与实际资源清理要分别核查，显式使用 --keep 时验收者还要处理所保留的目录。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs:37-66](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs#L37-L66)

证据目录、审计范围、凭据探针及不读取真实 ~/.dsh。

<details>
<summary>查看原文（30行）</summary>

```text
 *   --evidence-dir <dir>
 *                      证据目录（B7）：默认 $ISOLATED_HOME/evidence/；显式外部化
 *                      时建 <dir>/evidence-<profile>/ 子目录，**绝不动外部目录**
 *                      （不删、不覆盖，仅创建子目录并打印路径）。
 *   --audit            隔离审计（B4）：对比隔离 DSH_HOME 写面与预置白名单
 *                      （版本化 WHITELIST_V，lib/audit.mjs），白名单外变化报
 *                      「可疑」（新增/删除/修改 + 越界 symlink），**不阻断退出**
 *                      （审计是补充非门禁，退出码契约不变）；t0 基线在**就绪
 *                      断言成功后**扫描（dsh 启动写面进基线，审计 dsh 运行期
 *                      写面；先扫后写 + 白名单双保险）。
 *   --audit-extra-dirs <dir>
 *                      额外审计目录（可重复）：相对路径基于 cwd 绝对化；局限
 *                      ——审计只扫 $ISOLATED_HOME 子树 + 本选项指定目录，**不扫
 *                      真实 home**（插件写真实 ~/.dsh 的数据面不在判定面内）。
 *   --no-skip-onboarding
 *                      不预置首启弹窗跳过（默认预置 settings.yaml 的
 *                      <namespace>.welcomeNoticeVersion，使「内测声明」默认
 *                      不弹；命名空间与版本均从同一份 dsh 客户端产物现取，任一
 *                      缺失就不预置并交给 browser-driver 导航后兜底。
 *                      要验证 onboarding 弹窗本身时用它保留原生首启态。
 *   --json             stdout 只出最终 verdict JSON（人类文案全部走 stderr）。
 *   --probe-provider-usage
 *                      可选真实宿主验证（**不是离线 CI 门禁**）：隔离实例就绪后请求
 *                      provider-usage 的 /stats?provider=deepseek-official 与 /health，
 *                      解析 ok/error/lastSuccessAt 与 health.errors/fetchErrors 后
 *                      **立即退出**（不进入前台等待）。隔离 DSH_HOME 的
 *                      .credentials.yaml 无 refs 条目 → skip（输出「未验证（无凭据）」，
 *                      退出 0）；有存储凭据且 ok:true 或 error 非 no-api-key → 退出 0；
 *                      有存储凭据但 no-api-key → 退出 1 并给可操作诊断。不读取/复制
 *                      用户 ~/.dsh 凭据，不把继承的 env 凭据当证据，不回显 token/密钥。
```

</details>

**依据 2 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs:85-118](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs#L85-L118)

审计基线、symlink 与退出阶段限制。

<details>
<summary>查看原文（34行）</summary>

```text
 *
 * Windows 三坑（承诺等级：试验性，文档已标注；smoke 不启动 dsh，Windows 行为走
 * 代码审查）：
 *   1. spawn/execFile 对 .cmd 回退：.cmd/.bat 入口无 PATHEXT 解析，统一
 *      shell:true 回退（见 spawnDsh / readDshVersion / runDsh / resolveDsh
 *      注释）；win32 下 PATH 查找优先 .exe，仅剩 .cmd/.bat 时按脚本回退；
 *   2. 无 POSIX 信号：SIGTERM/SIGINT 语义在 Windows 不成立，kill 走
 *      taskkill /T /F 进程树（见 killDsh）；
 *   3. taskkill /T 进程树清理：Node child.kill 只杀壳进程、孙进程残留，
 *      统一按 pid 树清理。
 *
 * B6 启动自检 verdict：就绪后写 $ISOLATED_HOME/verdict.json（0o600），退出终态
 * 更新 cleanup 字段（中间态 "running" → 终态 "done" / "kept"）。端口实际绑定
 * 三通道：parsed（解析 dsh.log 端口行）→ asserted（就绪断言端口）→ probed
 * （--port 0 探测端口），标 source。
 *
 * B7 证据目录：默认 $ISOLATED_HOME/evidence/；供截图/快照等归档，退出随
 * DSH_HOME 一并清理（--keep 保留）。显式 --evidence-dir 时建外部子目录，
 * 绝不动外部目录本体。
 *
 * B4 隔离审计（--audit）：判定面 = 预置白名单（WHITELIST_V 版本化，
 * lib/audit.mjs 纯函数：scanSnapshot / diffAgainstWhitelist /
 * checkSymlinkEscape / runAudit）外的新增/删除/修改 + 越界 symlink；
 * symlink 快照 lstat 不跟随，「t0 已存在且目标未变的外部 symlink（link:
 * 挂载点）合法不报」，「新增或目标变化且 resolve 后在**所在扫描根**外的
 * 报『越界 symlink』（防插件经 symlink 写到隔离环境之外）。时序：t0 基线
 * 在**就绪断言成功之后**（dsh web 首启自建的 profiles/node_modules/** 官方
 * bundle link 与顶层 .credentials.yaml/storages/** 启动写面进基线——语义为
 * 「就绪后运行期写面审计」；verdict 中间态在其后写入，先扫后写 + 白名单
 * 双保险）；审计 diff 插在 settle「kill dsh → browser quit → 审计 →
 * verdict 终态 → rm」；--keep 落 $ISOLATED_HOME/audit/audit.json，否则并入
 * verdict JSON（audit 字段，--json 错误对象恒带 audit 字段与 verdict 对齐）。
 * 不阻断退出（审计异常仅警告，退出码契约不变）。就绪前退出/超时路径
 * auditBaseline 为 null → 审计跳过不报。
```

</details>

**依据 3 · 作者声明**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/SKILL.md:85-110](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/SKILL.md#L85-L110)

文档解释 GUI token 和首启拦截窗口。

<details>
<summary>查看原文（26行）</summary>

````text
## 3. 跑之前的两个硬前提

全新 `DSH_HOME` 的隔离实例，首屏不是插件界面，而是两个**阻断式**弹窗；同时 GUI 带
鉴权，裸端口访问拿不到界面。两者都会让「打开页面截图」看似成功、实则无效。

### 3.1 带令牌的访问 URL

dsh web 的 GUI 带鉴权，**不带令牌只得到 401 文本页**
（`dsh web authentication required; reopen the URL printed by dsh web.`）。就绪断言把
2xx-4xx 都算就绪，所以漏带令牌时验证会在 401 页面上继续跑下去。令牌的唯一来源是 dsh
启动打印的那一行：

```bash
# 三种取法（等价，取其一）：
# 1) 脚本启动时直接打印：`访问 URL（含访问令牌，GUI 鉴权必需）: http://127.0.0.1:<port>/?token=...`
# 2) 从 dsh.log 取（与端口解析同一行）：
grep -o 'dsh web: http://[^ ]*' "$DSH_HOME/dsh.log" | tail -1 | sed 's/^dsh web: //'
# 3) 交给 browser-driver（--browser 时脚本已写入 browser.state.dshWebUrl）：
node "$SKILL_BASE/scripts/browser-driver.mjs" snapshot --state "$DSH_HOME/browser.state" --url state
```

- `--url state` 是页面命令的保留取值：读 state 文件里的带令牌 URL，省掉手工拼接。
  省略 `--url` 仍是**不导航**（保留上一条命令的页面状态，多步交互验证不受影响）。
- **令牌是访问凭据**：命令回显的 URL 恒去令牌（`token=***`），真值只在 0o600 的
  `browser.state` / `dsh.log` 里。截图与快照 JSON 进证据前确认其中没有 `token=` 明文；
  手工传 `--url` 时同样用已脱敏的形态记录。
````

</details>

**依据 4 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/browser-driver.mjs:544-593](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/browser-driver.mjs#L544-L593)

浏览器遇到模态无法安全处理时返回 blocked。

<details>
<summary>查看原文（50行）</summary>

```text
      "--url state 需要 state 文件里存在 dshWebUrl（由 verify-isolated.mjs 写入）；手动拉起的 dsh web 请直接传带令牌的完整 URL",
    );
  }
  return url;
}

/**
 * 导航后一次性收尾：跳过首启弹窗 + 鉴权误用诊断。
 *
 * 弹窗由 React 在页面加载后异步挂载（实测晚于 readyState=complete，且时机会在
 * 数百毫秒内波动），故按窗口轮询而不是探一次就下结论——漏检的代价不是「少一次
 * 提示」，而是后续点击落在 inert 根上静默失效、验证结论假绿。等待窗口默认为
 * OVERLAY_WAIT_MS，`--overlay-wait 0` 可退回单次探测（快，但可能漏检）。
 *
 * 两级弹窗（内测声明 → API Key）会无缝衔接：前一个卸载与后一个置位 inert 可能
 * 落在同一帧，故**不能**用「等 inert 解除」判断弹窗已清空（必然超时误报），而是
 * 直接推进到下一轮窗口轮询——没有下一个弹窗时，该轮窗口自然以「无弹窗」收尾。
 *
 * 识别不到跳过按钮时**不点**：弹窗内可能并列「保存并继续」这类有副作用的按钮，
 * 点错会把验证流程变成一次误操作；此时只上报 blocked 交调用方处置。
 */
async function settleOverlays(wsUrl, flags) {
  const result = { dismissed: [], authRequired: false, blocked: null };
  const auto = !flags.has("no-auto-dismiss");
  const waitMs = Math.max(0, Number(flag(flags, "overlay-wait", String(OVERLAY_WAIT_MS))) || 0);
  const expr = buildOverlayProbeExpression({ click: auto });
  for (let round = 0; round < MAX_OVERLAY_ROUNDS; round++) {
    // 上一轮点过的弹窗需要一点时间卸载，否则本轮窗口会重复命中同一按钮
    if (round > 0) await sleep(250);
    let probe = null;
    let seen = false;
    const deadline = Date.now() + waitMs;
    for (;;) {
      try {
        probe = await evalRaw(wsUrl, expr);
      } catch {
        return result;
      }
      if (!probe) return result;
      if (probe.authRequired) result.authRequired = true;
      if (probe.blocked) {
        seen = true;
        break;
      }
      if (Date.now() >= deadline) break;
      await sleep(150);
    }
    if (!seen) return result;
    if (!probe.dismissed) {
      result.blocked = { reason: probe.reason, buttons: probe.buttons ?? [] };
```

</details>

**依据 5 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs:334-350](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs#L334-L350)

终止 DSH 的期限和浏览器关闭入口。

<details>
<summary>查看原文（17行）</summary>

```text
async function stopDshChild() {
  // 1. kill dsh：与 bash trap 对齐，先 SIGTERM 优雅终止（5s 窗口），SIGKILL
  //    仅作二次兜底（避免活体 dsh 被直接 SIGKILL 跳过清理钩子）
  if (!dshChild) return;
  if (pidAlive(dshChild.pid)) killDsh(dshChild, "SIGTERM");
  await waitPidExit(dshChild.pid, 5000);
  if (pidAlive(dshChild.pid)) killDsh(dshChild, "SIGKILL");
}

function quitBrowserInstance() {
  // 2. browser quit（如有实例，CDP 优雅关闭 + kill 兜底，行为同 bash trap）
  if (!(flags?.browser && browserState && existsSync(browserState))) return;
  out("清理浏览器实例（browser-driver quit）...");
  try {
    spawnSync(process.execPath, [DRIVER, "quit", "--state", browserState, "--json"], {
      stdio: "ignore",
      timeout: 20000,
```

</details>

**依据 6 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs:401-434](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs#L401-L434)

审计异常不改退出码，写终态后才删除临时目录。

<details>
<summary>查看原文（34行）</summary>

```text
function runSettleAudit() {
  // 3. 隔离审计（B4，--audit）：t1 终态扫描 → 白名单 diff + symlink 防逃逸 →
  //    输出结论。审计是补充非门禁：任何异常仅警告（auditResult 带 error），
  //    不阻断退出、不影响退出码契约。
  if (!(flags?.audit && auditBaseline)) return;
  try {
    reportAuditResult(collectAuditSuspicious());
    persistAuditReport();
  } catch (e) {
    outWarn(`审计异常（不影响退出码）: ${e.message}`);
    auditResult = {
      enabled: true,
      whitelistV: WHITELIST_V,
      extraDirs: auditExtraDirsAbs,
      suspicious: [],
      count: -1,
      conclusion: "error",
      error: e.message,
      runAt: new Date().toISOString(),
    };
  }
}

function finalizeVerdictAndHome() {
  // 4. verdict 终态 cleanup（done/kept；audit 字段已并入 makeVerdict）
  writeVerdictTerminal();
  // 5. 不 --keep 时清理 ISOLATED_HOME
  if (!isolatedHome) return;
  if (flags?.keep) {
    out(`（--keep）临时 DSH_HOME 保留于: ${isolatedHome}`);
    out(`（--keep）如需删除: rm -rf '${isolatedHome}'`);
    return;
  }
  rmSync(isolatedHome, { recursive: true, force: true });
```

</details>

**依据 7 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs:454-472](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs#L454-L472)

清理异常记录警告，继续按原退出码退出。

<details>
<summary>查看原文（19行）</summary>

```text
function emitSettleOutput() {
  // --json：stdout 只出一份 JSON；非 --json 模式此处不出声。
  if (jsonMode) jsonOut(settleJsonPayload());
  process.exit(exiting?.code ?? EXIT.FAIL);
}

async function settle() {
  if (settling) return;
  settling = true;
  try {
    await stopDshChild();
    quitBrowserInstance();
    runSettleAudit();
    finalizeVerdictAndHome();
  } catch (e) {
    outWarn(`清理异常（继续退出）: ${e.message}`);
  } finally {
    emitSettleOutput();
  }
```

</details>

#### 缺口

- 未实测隔离目录外写入、子进程残留或 browser token 脱敏。
  **影响**：隔离不能证明插件不写真实 home
  **进一步探讨**：验证审计边界并检查被测插件是否使用绝对路径/外部服务。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 适合怎样采用该验证工具，成本/失败恢复如何核算？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

适合频繁改 DSH 插件 UI 且需提供浏览器实测证据的开发者。先固定 DSH 0.2.2-rc.1，在临时工作区对一个小改动运行最小模式，再启用独立浏览器并确认 token/弹窗处理，检查 verdict 与清理。可减少手工搭隔离环境，但需构建、运行 DSH、准备 Chromium 和确认具体页面断言；若版本不匹配、审计失败或清理状态不明，不把运行当通过。

一次合格样本仍要由操作者核对已完成登录、页面实际加载和一项变更的界面断言。把 provider 探针跳过与执行通过分别登记，检验终态 JSON、端口和临时目录；只有独立条件成立才判这次宿主任务通过。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/SKILL.md:17-37](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/SKILL.md#L17-L37)

要求哪些 UI 变更使用隔离浏览器验证。

<details>
<summary>查看原文（21行）</summary>

```text
## 0. 何时用

凡改动命中以下区域，**必须**做隔离环境浏览器验证并附截图：

- `src/client/**`（客户端 UI 渲染逻辑、样式、组件）
- 宿主端涉及 UI 渲染逻辑的改动（如路由注入、URL 重写、overlay/Modal 渲染、双主题适配）
- 涉及窄屏/响应式布局的调整

**不需要**的例外：纯文档改动、纯宿主端逻辑（不涉及 UI 渲染）、纯后端数据流变更。

## 1. 四重隔离

| 隔离层 | 做法 | 隔离内容 |
|--------|------|----------|
| 一：临时 `DSH_HOME` | `DSH_HOME=$(mktemp -d)` | 凭据、会话、全部用户数据、home 级 `cordis.patch.yml` |
| 二：独立 profile | `verify_<8位随机>`（非 `web`） | 插件组合栈（bundles）、profile 级 patch、插件依赖 |
| 三：独立端口 | `--port` 自选/探测空闲端口 | 与运行中主 `dsh web` 及其它验证实例互不冲突 |
| 四：独立浏览器实例 | `--browser` 拉起自带浏览器（独立 user-data-dir + 调试端口） | 页面/tab/console 完全独立，多会话并行互不可见 |

只建独立 profile 不够：profile 共享 home 级的凭据与会话；只有同时把 `DSH_HOME` 指向
临时目录，才做到与用户正在使用的环境完全隔离。
```

</details>

**依据 2 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs:21-40](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs#L21-L40)

CLI 参数和 evidence-dir 安全行为。

<details>
<summary>查看原文（20行）</summary>

```text
 * 用法：
 *   node verify-isolated.mjs [--port <port>] [--browser] [--keep]
 *                            [--no-build] [--evidence-dir <dir>] [--audit]
 *                            [--audit-extra-dirs <dir>] [--no-skip-onboarding]
 *                            [--probe-provider-usage] [--json] [-- <pkg-path>...]
 *   dsh 入口     从 PATH 解析 `dsh`，要求 `dsh --version` 为 0.2.2-rc.1。找不到、
 *                不可用、读取失败或其它版本一律 fail-closed，避免产出不属于目标
 *                runtime 的 preset/验证证据。
 *   --port <port>      默认 3456；--port 0 自动探测真实空闲端口并打印（修复打印 0）。
 *                      探测块贴近 dsh 启动，防 EADDRINUSE 窗口。
 *   --browser          额外启动独立浏览器实例（browser-driver.mjs）：独立
 *                      user-data-dir + 自选空闲调试端口 + headless，实例信息写入
 *                      $ISOLATED_HOME/browser.state（与 DSH_HOME 同生命周期）。
 *   --keep             结束后保留临时 DSH_HOME（不删，方便排查；路径会打印）。
 *   --no-build         跳过挂载前的 pnpm build；此时校验产物存在（缺失即报可操作
 *                      错误），并对比 src/ 与产物的 mtime，源码更新即给陈旧警告。
 *   --evidence-dir <dir>
 *                      证据目录（B7）：默认 $ISOLATED_HOME/evidence/；显式外部化
 *                      时建 <dir>/evidence-<profile>/ 子目录，**绝不动外部目录**
 *                      （不删、不覆盖，仅创建子目录并打印路径）。
```

</details>

**依据 3 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs:72-103](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs#L72-L103)

退出码、verdict 与临时证据退出处理。

<details>
<summary>查看原文（32行）</summary>

```text
 * 退出码契约（显式表，smoke 锁定）：
 *   +-----+------------------------------------------------------------------+
 *   |  0  | 正常完成：启动 + 就绪 + 前台等待 dsh 退出，清理完毕                |
 *   |  1  | 启动或就绪失败：profile 初始化失败 / add 失败 / dsh 就绪前退出 /   |
 *   |     | 15s 就绪超时                                                      |
 *   |  2  | 参数错误：未知选项 / 缺参 / 找不到 dsh 入口 / --no-build 缺产物    |
 *   | 130 | SIGINT（Ctrl+C）：终态清理后透传                                   |
 *   | 143 | SIGTERM：终态清理后透传                                            |
 *   +-----+------------------------------------------------------------------+
 *   （--probe-provider-usage 的 fail 也归 1：凭据存在但 no-api-key / stats 请求或
 *    响应不可用；skip/pass 归 0。探针模式跑完即退出，不进入前台等待。）
 *   （其余：就绪后 dsh 自身异常退出码原样透传；信号退出归一为 130/143——与
 *     bash 版 wait 透传同语义，见 main() 中 child "exit" 处理注释。）
 *
 * Windows 三坑（承诺等级：试验性，文档已标注；smoke 不启动 dsh，Windows 行为走
 * 代码审查）：
 *   1. spawn/execFile 对 .cmd 回退：.cmd/.bat 入口无 PATHEXT 解析，统一
 *      shell:true 回退（见 spawnDsh / readDshVersion / runDsh / resolveDsh
 *      注释）；win32 下 PATH 查找优先 .exe，仅剩 .cmd/.bat 时按脚本回退；
 *   2. 无 POSIX 信号：SIGTERM/SIGINT 语义在 Windows 不成立，kill 走
 *      taskkill /T /F 进程树（见 killDsh）；
 *   3. taskkill /T 进程树清理：Node child.kill 只杀壳进程、孙进程残留，
 *      统一按 pid 树清理。
 *
 * B6 启动自检 verdict：就绪后写 $ISOLATED_HOME/verdict.json（0o600），退出终态
 * 更新 cleanup 字段（中间态 "running" → 终态 "done" / "kept"）。端口实际绑定
 * 三通道：parsed（解析 dsh.log 端口行）→ asserted（就绪断言端口）→ probed
 * （--port 0 探测端口），标 source。
 *
 * B7 证据目录：默认 $ISOLATED_HOME/evidence/；供截图/快照等归档，退出随
 * DSH_HOME 一并清理（--keep 保留）。显式 --evidence-dir 时建外部子目录，
 * 绝不动外部目录本体。
```

</details>

**依据 4 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs:862-879](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs#L862-L879)

可选探针可独立结束，跳过和通过都是零退出码。

<details>
<summary>查看原文（18行）</summary>

```text
  spawnDshChild();
  const collector = createDshLogCollector();
  dshChild.stdout.on("data", collector.onData);
  dshChild.stderr.on("data", collector.onData);
  attachChildExitHandler();
  const verdictPort = dshWebPort;
  await awaitDshReady(collector, verdictPort);
  await resolveAccessUrl(f);
  // 审计 t0 在探针请求之前：探针是运行期行为，写面增量应计入审计面。
  snapshotAuditBaseline(f, extraDirsAbs);
  // 11. 可选真实宿主探针：跑完即退出，退出码由探针判定（skip/pass=0，fail=1）。
  if (f.probeProviderUsage) {
    const probeCode = await runProviderUsageProbeStep();
    requestExit(probeCode, null);
    await settle();
    return;
  }
  await waitForDshExit();
```

</details>

**依据 5 · 源码核查**：[packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs:401-434](https://github.com/wingsky-1/dsh-plugin-hub/blob/62d5343c0021d115e350875157f6b33a23072d28/packages/dsh-verify-isolated/skills/dsh-verify-isolated/scripts/verify-isolated.mjs#L401-L434)

审计与退出资源状态需要额外回读。

<details>
<summary>查看原文（34行）</summary>

```text
function runSettleAudit() {
  // 3. 隔离审计（B4，--audit）：t1 终态扫描 → 白名单 diff + symlink 防逃逸 →
  //    输出结论。审计是补充非门禁：任何异常仅警告（auditResult 带 error），
  //    不阻断退出、不影响退出码契约。
  if (!(flags?.audit && auditBaseline)) return;
  try {
    reportAuditResult(collectAuditSuspicious());
    persistAuditReport();
  } catch (e) {
    outWarn(`审计异常（不影响退出码）: ${e.message}`);
    auditResult = {
      enabled: true,
      whitelistV: WHITELIST_V,
      extraDirs: auditExtraDirsAbs,
      suspicious: [],
      count: -1,
      conclusion: "error",
      error: e.message,
      runAt: new Date().toISOString(),
    };
  }
}

function finalizeVerdictAndHome() {
  // 4. verdict 终态 cleanup（done/kept；audit 字段已并入 makeVerdict）
  writeVerdictTerminal();
  // 5. 不 --keep 时清理 ISOLATED_HOME
  if (!isolatedHome) return;
  if (flags?.keep) {
    out(`（--keep）临时 DSH_HOME 保留于: ${isolatedHome}`);
    out(`（--keep）如需删除: rm -rf '${isolatedHome}'`);
    return;
  }
  rmSync(isolatedHome, { recursive: true, force: true });
```

</details>

#### 缺口

- 没有实测 setup 时间、清理可靠性或缺陷发现率。
  **影响**：与手工隔离配置对照 setup/运行/清理时间和发现缺陷
  **进一步探讨**：未确认清理状态时人工检查后再继续。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
