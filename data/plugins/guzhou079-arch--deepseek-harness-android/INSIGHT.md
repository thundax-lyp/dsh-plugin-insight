# DeepSeek Harness Android

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[6a477ad](https://github.com/guzhou079-arch/deepseek-harness-android/tree/6a477ad728c674e754e4e34d349d4d9aa5a5d09e)

<!-- BEGIN META -->
[![GitHub ★ 65](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=65&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/guzhou079-arch/deepseek-harness-android)
<!-- END META -->

> **功能**：封装本地 DSH、手机自动化与手机自建 APK 工作流的 Android 客户端分发工程

> **亮点**：[Q01](#research-q01) 和 [Q04](#research-q04) 支持移动封装/适配与手机端构建、内容收据/备份组织的工程贡献；当前能检查脚本和console准入，不能证完整APK能力或源制品一致。

> **主要限制**：[Q02](#research-q02) 核心Java/Manifest与runtime缺失，无法核native授权和自动化终态；[Q04](#research-q04) 隐含本机输入/静态可用字样非完整重建/执行验收，[Q05](#research-q05) 签名迁移和含密钥备份决定实际恢复成本。

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
  - [Q01 · 用户获得什么，贡献与上游如何区分？](#detail-section-11)
  - [Q02 · 本地控制台与native能力怎样接，哪些环节不能核？](#detail-section-12)
  - [Q03 · LAN、安全和隐私承诺支持到哪一层？](#detail-section-13)
  - [Q04 · 手机自建和发布验证能证明什么？](#detail-section-14)
  - [Q05 · 用户怎样算全周期成本和退路？](#detail-section-15)
  - [Q06 · 什么改进能证伪自维护和权限边界？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在手机安装即用DSH并维护自身APK的Android用户，见 [Q01](#research-q01)；高权限自动化与主机数据需另验。

手工Termux/Node部署DSH，以及上游Android壳和Operit虚拟屏；不把上游Agent/OS能力与外部壳全算原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 证据和条件边界 |
|---|---|---|
| Android本地DSH | 手机聊天与任务 | 作者APK主张，native/runtime缺材料 |
| 手机自动化/虚拟屏 | 读屏点按输入 | 高权限与Java桥未完整核查 |
| console Host | 接生活/语音/局域网等 | 准入可查，依赖运行脚本 |
| LAN opt-in | 可信网络访问 | env门控非TLS，App侧开关未核 |
| 自建/发布 | 骨架+payload重包签名 | 需缺失源码/工具链/密钥，收据≠真机成功 |
| 备份 | 会话/配置/key留存 | 共享明文归档含秘密，restore覆盖 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
|---|---|---|
| 确切Android机型/版本与APK | 运行客户端 | 文档7+/8+不一，高级能力11+为作者说明 |
| 模型key与网络 | 远端模型 | 本地引擎不等于本地推理 |
| 无障碍/文件/通知等权限 | 可选自动化 | 聊天最小权限与实际撤销待验 |
| 已装骨架/runtime、proot/Java/toolchain、Java/AAR/key | 自建 | 当前Git不足独立重建 |
| 同签名升级与备份 | 延续私有数据 | 冲突勿直接卸载，恢复另验 |

#### 启动步骤

| 步骤 | 动作 | 验收/恢复 |
|---|---|---|
| 准备 | 备用机去敏数据，固定APK摘要/签名和输入清单 | 不据latest说明推当前可用 |
| 安装 | 验签/摘要、模型key，最少授权 | 实测聊天/文件与权限撤销 |
| 自动化 | 无害目标检查native边界/确认 | 未核前不做发送/删除/购买 |
| 自建 | 编译/重包/签名/收据，再隔离实例验收 | 占位R拒发布，缺输入先停止 |
| 升级退出 | 加密备份并演练恢复，再同签名升级 | 卸载删私有数据，sdcard另清理 |

**效果与成本**

#### 成本

| 阶段 | 资源现金 | 人工时间/未知 |
|---|---|---|
| 首次 | 作者约192MB APK/0.6GB数据，模型自付 | 权限/机型/初始化配置，未实测 |
| 自建可选 | 作者约193MB下载/342MB解压及工具链 | 补输入/签名/构建排错，工时未知 |
| 持续 | 模型费、电池/温度/空间、备份 | Android杀进程与上游补丁维护 |
| 失败/退出 | 备份/旧APK占用，已外发数据不可撤 | 签名冲突/恢复验证、共享秘密管理 |

#### 效果

| 效果 | 当前支持 | 未知 |
|---|---|---|
| 手机部署便利 | 作者APK与脚本目标明确 | 当前下载制品/真机启动 |
| 自维护 | 精确DEX/payload/签名收据设计 | 全新Git环境完整重建与恢复 |
| 安全接入 | console fail-closed、LAN env门 | native桥/静态面/设备动作授权 |
| 工作价值 | 减少电脑/Termux依赖的方向 | 节时、成功率、电池与费用收益未测 |

> **思考**：[Q02](#research-q02) 核心Java/Manifest与runtime缺失，无法核native授权和自动化终态；[Q04](#research-q04) 隐含本机输入/静态可用字样非完整重建/执行验收，[Q05](#research-q05) 签名迁移和含密钥备份决定实际恢复成本。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q04](#research-q04) 支持移动封装/适配与手机端构建、内容收据/备份组织的工程贡献；当前能检查脚本和console准入，不能证完整APK能力或源制品一致。

Host connection准入失败关闭、有限roles输入与构建内容收据值得借鉴；大部分native桥和缺失外部输入限制全链判断。静态helper与完整发布门分开，不能拿关键字/MD5体检替真机执行。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 核心Java/Manifest与runtime缺失，无法核native授权和自动化终态；[Q04](#research-q04) 隐含本机输入/静态可用字样非完整重建/执行验收，[Q05](#research-q05) 签名迁移和含密钥备份决定实际恢复成本。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议观察，先补齐native/构建输入及制品摘要，备用机只验去敏无害任务与备份恢复。权限撤销无效、签名冲突或来源无法对应时停止自动化/升级，保留旧APK与备份并回常规手机/电脑工作流。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持部分移动console、LAN补丁与自建发布收据机制；native能力和当前APK运行/完整重建缺关键材料，全部效果/体积时间只作者说明未复现。

- 已检查：作者 README、包清单、源码路径 README.md、selfbuild/scripts/javac-app.sh、plugins/dsh-android-console/lib/index.js、selfbuild/scripts/patch-lan-optin.js、docs/权限与隐私.md、selfbuild/selfbuild.sh、selfbuild/scripts/release-receipts.mjs、selfbuild/scripts/release-publish.mjs、selfbuild/scripts/verify-apk-payload.js、docs/安装与要求.md、docs/自建环境与出包.md、selfbuild/scripts/backup-dshhome.sh 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向读取README/权限/安装/恢复文档、console Host与client关键调用、LAN补丁、selfbuild/javac、发布收据/门和备份脚本；未审3092行console全部布局、所有Skill/皮肤、未提供Java/Manifest/实际runtime。仓库根无标准npm主包，不据此误标普通插件。
- 下一步：本轮未下载安装APK、构建、签名、启动手机/DSH、执行native动作或调用任何发布/备份脚本。作者实测/事故记录只作者主张，当前fixed源码链未闭合的环节保持未知。

**分析版本**

- **仓库**：[guzhou079-arch/deepseek-harness-android](https://github.com/guzhou079-arch/deepseek-harness-android)
- **版本号**：未声明（[固定提交 6a477ad](https://github.com/guzhou079-arch/deepseek-harness-android/tree/6a477ad728c674e754e4e34d349d4d9aa5a5d09e)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 未验证的完整构建输入清单、真机权限/动作确认矩阵与加密恢复演练，用全新环境/撤权限/签名冲突反例验证自维护承诺。

本轮未下载安装APK、构建、签名、启动手机/DSH、执行native动作或调用任何发布/备份脚本。作者实测/事故记录只作者主张，当前fixed源码链未闭合的环节保持未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 51 | 5092 | — | — | 61992 |
| .js | source | 38 | 12504 | 10272 | 1639 | — |
| .mjs | test | 1 | 267 | 208 | 30 | — |
| .mjs | source | 16 | 3400 | 2863 | 292 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/guzhou079-arch/deepseek-harness-android/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=13&color=737b86&logo=github)](https://github.com/guzhou079-arch/deepseek-harness-android/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/guzhou079-arch/deepseek-harness-android/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分Android客户端作者能力、已查补丁/自建链与未提供native实现。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户获得什么，贡献与上游如何区分？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是独立Android客户端分发/增强工程，非装进现有DSH的一项插件。作者目标是手机用户安装APK、自备模型key后本机跑DSH，按权限用读屏/点按/输入/虚拟屏与定时，另可在手机构建签APK。相对Termux/Node手装，封装运行环境与移动控制台降低配置步骤；DSH agent/模型协议继承DeepSeek，Android壳骨架来自woaiys3，虚拟屏移植对齐Operit，不将这些算本项目原创。当前根有自建/补丁/插件/Skill文本，但没有完整Java/Manifest与运行payload可核，不能由README的27款技能/25补丁升级为当前APK功能数量或测试通过。重点可查增量是构建输入/制品收据、patch门控和console Host接线，非新模型或OS隔离。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-38](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/README.md#L19-L38)

作者APK/自动化/自建价值。

<details>
<summary>查看原文（20行）</summary>

```text
</div>

**DeepSeek Harness 装进安卓：一个 APK，不用 Termux、不用 root、不用电脑。**

装完填个 API Key 就能聊：能读屏、点按、输入、在虚拟屏里操作别的 App，能跑定时任务，27 款技能随包。
**最不一样的一点：它能在手机上给自己出包** —— 改完代码直接在手机里 `javac → d8 → 重打包 → 签名 → 发版`，全程不碰电脑。

## 装起来到底省了什么

| | 自己动手装 | 这个 APK |
|---|---|---|
| 准备环境 | 装 Termux、装 Node、拉仓库、改配置 | 下载 APK，安装 |
| 首次配置 | 对着一堆命令和文档 | 填一个 API Key |
| 技能 | 一个个单独装 | 27 款随包 |
| AI 干活时你的屏 | 被占着，没法干别的 | 虚拟屏里跑，主屏照常用 |
| 出包 / 发版 | 得回电脑 | 手机自己构建、签名、发版 |

## 装完能干什么

| 亮点 | 说明 |
```

</details>

**依据 2 · 作者声明**：[README.md:75-109](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/README.md#L75-L109)

上游与本项目改动归因。

<details>
<summary>查看原文（35行）</summary>

````text
```

> ## ⚠️ 更新前必读 —— 只从本仓库 Releases 更新
>
> 本 App 用**本项目自己的钥匙**签名。安装**其它来源**的同名 App（官方原版 / 上游作者的包 /
> 别人转发的 APK）会因签名冲突**无法覆盖安装**；此时若选择「卸载重装」，
> **App 私有数据会全部清空**（会话历史、运行环境、配置；没做过备份的话通常找不回来）。
>
> 遇到 `INSTALL_FAILED_UPDATE_INCOMPATIBLE` 报错时：**不要卸载** —— 这个报错正是在保护你的数据。
> 升级前先备份：App 内「控制台 → 救援 → 导出全部数据」（开发者也可用 `selfbuild/scripts/backup-dshhome.sh`）。
>
> **完整说明与救援步骤 → [docs/升级与救援.md](docs/升级与救援.md)**

---

本发布包是 **DeepSeek Harness 的安卓移植与增强版**，由个人制作。
以下如实说明各部分来源。

## 一、我做了什么（相对上游的改动）

上游 `woaiys3/deepseek-harness-android-app` 提供的是**安卓壳骨架**（WebView + Service 结构、
payload 打包、权限引导）。在这个底子之上，本版本包含大量适配与增强：

### 1. 安卓适配补丁（25 条）

| 类别 | 内容 |
|---|---|
| 系统能力 | NFC 读卡 · 无障碍读屏/点击/截图 · 虚拟屏 · 通知读取 · 特权通道（Shizuku）|
| 引擎适配 | `bash-local` sandboxMode · `flock` 安卓回退 · `session-persistence` 硬链接绕行 |
| 安全加固 | 静态资源门禁 · 客户端路由鉴权 · update-check 门禁 · 局域网绑定显式开关 |
| 界面 | 账户 UI 解锁 · 自定义背景图 · 移动端布局改造 · 应用更新日志 |
| 登录 | 授权链接改由系统浏览器打开 · 登录完成后自动回到 App |

### 2. 可以在手机上自己出包

````

</details>

**依据 3 · 作者声明**：[README.md:111-153](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/README.md#L111-L153)

DSH与Operit许可归因。

<details>
<summary>查看原文（43行）</summary>

```text
不需要电脑。构建环境不进 APK，在「控制台 → 自建环境」里**按需下载**（约 193MB）。
怎么用、踩过哪些坑：[`docs/自建环境与出包.md`](docs/自建环境与出包.md)。

### 3. 自研插件与补丁

- `whale-shota` —— 皮肤 / 桌宠扩展
- `dsh-android-ui` —— 安卓界面适配
- 背景图补丁、账户 UI 补丁

## 二、来源与许可

### 1. 安卓壳骨架 — MIT

| 项 | 内容 |
|---|---|
| 项目 | **deepseek-harness-android-app** |
| 作者 | [woaiys3](https://github.com/woaiys3) |
| 仓库 | <https://github.com/woaiys3/deepseek-harness-android-app> |
| 许可证 | **MIT License**，Copyright (c) 2026 woaiys3 |

MIT 许可允许修改、分发与再发布，**要求保留版权声明与许可证文本**。

### 2. DSH 引擎内核 — 归 DeepSeek 所有

| 项 | 内容 |
|---|---|
| 项目 | **@deepseek-ai/dsh**（DeepSeek Harness）|
| 仓库 | <https://github.com/deepseek-ai/deepseek-harness> |
| 许可证 | **MIT License**（版权归 DeepSeek，许可证全文随包） |
| 说明 | 本包内含其构建产物；版权与许可归原作者，本项目不对其主张任何权利 |

### 3. 虚拟屏（vscreen）— LGPL-3.0

| 项 | 内容 |
|---|---|
| 项目 | **Operit** — Android AI Agent |
| 作者 | [AAswordman](https://github.com/AAswordman) |
| 仓库 | <https://github.com/AAswordman/Operit> |
| 许可证 | **GNU Lesser General Public License v3.0（LGPL-3.0）** |

虚拟屏功能的实现移植/对齐自 Operit 的 shower 模块。相关源文件**已带原始许可声明**，
许可证全文见 `licenses/lgpl-3.0.txt`（LGPL-3.0 以 GPL-3.0 为基础，故同时提供 `licenses/gpl-3.0.txt`）。

```

</details>

**依据 4 · 源码核查**：[selfbuild/scripts/javac-app.sh:38-46](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/javac-app.sh#L38-L46)

构建期引用v118 Java/libs位置。

```text
SB=$REPO/selfbuild
SRC=$REPO/v118/android-app/src
LIBS=$REPO/v118/android-app/libs
HARNESS=$SRC/com/deepseek/harness
VSC=$HARNESS/vscreen
BUILD=$SB/work/appbuild/out
GEN_A=$SB/work/gen/com/deepseek/harness/R.java
RUN=/data/user/0/com.deepseek.harness/files/work/linux/run.sh
RG=/data/user/0/com.deepseek.harness/files/payload/runtime/bin/rg
```

#### 缺口

- 当前固定树缺完整native Java/Manifest、安装runtime和实际APK对应证据，本轮未真机执行。
  **影响**：无法证明自动化授权、后台可靠性、完整重建或敏感数据/恢复边界。
  **进一步探讨**：提供精确可获取构建输入和同摘要APK，在备用机用去敏任务逐权限/失败/恢复验收。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地控制台与native能力怎样接，哪些环节不能核？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

已查android-console Host依赖webServer，prefix routes在认证admit后按需加载life/office/voice/lan-mesh/rag脚本；多数指向/sdcard/DeepSeekHarness/tools，部分优先包内Skill。未提供这些运行脚本时route会500，不是可凭目录认定五套功能可用。native动作按Host注释留在WebView bridge，但当前树无MainActivity/AccessibilityService/EngineService源码、Manifest和AAR；javac脚本明确依赖v118/android-app/src等并检查不存在即失败。因此无法跟到Java桥暴露对象/调用鉴权、Android权限撤销、真正读屏/不可逆点击或后台调度终态。App可运行DSH的整体链和“不需Termux/root/PC”只作作者分发主张，不作本轮真机结论。console apply还会detached启动life tick，返回pid不验证daemon健康，且是引擎启动副作用，停路由不自动停止已派生脚本。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-android-console/lib/index.js:1-40](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/plugins/dsh-android-console/lib/index.js#L1-L40)

Native动作边界、脚本位置与自启动。

<details>
<summary>查看原文（40行）</summary>

```text
/** Android console data routes. Native actions remain in the WebView bridge. */
import { createRequire } from 'node:module';
import { existsSync, readFileSync, writeFileSync, renameSync, unlinkSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const packagedLife = process.env.DSH_HOME && join(process.env.DSH_HOME, 'skills/dsh-life/scripts/life.js');
/** 生活守护脚本：优先用包内那份，退回 /sdcard 的运行副本。 */
const lifeScriptPath = packagedLife && existsSync(packagedLife) ? packagedLife : '/sdcard/DeepSeekHarness/tools/life.js';

/**
 * App 启动即拉起生活中枢守护（幂等，只在引擎启动时打一次）。
 *
 * 为什么挂这里：生活守护只在 selfcheck §7 / tick 被叫时才保活，App 冷启动后没人叫它，
 * 于是打开 App 看到的是「生活中枢未运行」，得手动点启动。插件 apply() 是引擎启动时必然
 * 跑一次的点。`tick` 自身幂等（守护活着就只做心跳检查），也不排付费闹钟（watchdog 默认关）。
 */
let lifeAutostartDone = false;
export function autoStartLife(logger) {
  if (lifeAutostartDone) return { ok: false, skipped: 'already' };
  lifeAutostartDone = true;
  if (!existsSync(lifeScriptPath)) return { ok: false, skipped: 'no-life-script' };
  try {
    const child = spawn(process.execPath, [lifeScriptPath, 'tick'], { detached: true, stdio: 'ignore' });
    child.unref();
    return { ok: true, pid: child.pid };
  } catch (error) {
    logger?.warn?.(`android-console: life autostart failed: ${error instanceof Error ? error.message : String(error)}`);
    return { ok: false, failed: true };
  }
}

const ROUTES = [
  ['/life', packagedLife && existsSync(packagedLife) ? packagedLife : '/sdcard/DeepSeekHarness/tools/life.js', 'createHandler'],
  ['/office', '/sdcard/DeepSeekHarness/tools/office.js', 'createOfficeHandler'],
  ['/voice-hub', '/sdcard/DeepSeekHarness/tools/voice.js', 'createVoiceHubHandler'],
  ['/lan-mesh', '/sdcard/DeepSeekHarness/tools/lan-mesh.js', 'createLanMeshHandler'],
  ['/rag', '/sdcard/DeepSeekHarness/tools/rag.mjs', 'createRagHandler'],
];
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-android-console/lib/index.js:61-100](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/plugins/dsh-android-console/lib/index.js#L61-L100)

admit后lazy工具加载和500。

<details>
<summary>查看原文（40行）</summary>

```text

export function apply(ctx) {
  ctx.inject(['webServer'], (webCtx) => {
    autoStartLife(ctx.logger);
    for (const [prefix, toolPath, factoryName] of ROUTES) {
      let handlerPromise;
      const getHandler = () => {
        if (!handlerPromise) {
          handlerPromise = Promise.resolve().then(async () => {
            // A stable ESM URL avoids retaining one module instance per request.
            const tool = toolPath.endsWith('.mjs') ? await import(toolPath) : require(toolPath);
            return tool[factoryName](prefix);
          }).catch(error => {
            handlerPromise = undefined; // Optional tools may be installed later.
            throw error;
          });
        }
        return handlerPromise;
      };
      webCtx.effect(() => webCtx.webServer.register({
        kind: 'prefix',
        path: prefix,
        handler: async (req, res) => {
          if (!admitConsoleRequest(webCtx, req, res)) return;
          try {
            const handler = await getHandler();
            await handler(req, res);
          } catch (error) {
            if (res.headersSent) {
              res.destroy(error);
              return;
            }
            res.writeHead(500, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
            res.end(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }));
          }
        },
      }), `android-console: ${prefix} route`);
    }

    // 2026-10-25：角色分工表落盘 —— 设置页编辑、AI 派活共用同一份（$DSH_HOME/model-roles.json）。
```

</details>

**依据 3 · 源码核查**：[selfbuild/scripts/javac-app.sh:38-73](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/javac-app.sh#L38-L73)

源码/libs/proot路径与前置缺失失败。

<details>
<summary>查看原文（36行）</summary>

```text
SB=$REPO/selfbuild
SRC=$REPO/v118/android-app/src
LIBS=$REPO/v118/android-app/libs
HARNESS=$SRC/com/deepseek/harness
VSC=$HARNESS/vscreen
BUILD=$SB/work/appbuild/out
GEN_A=$SB/work/gen/com/deepseek/harness/R.java
RUN=/data/user/0/com.deepseek.harness/files/work/linux/run.sh
RG=/data/user/0/com.deepseek.harness/files/payload/runtime/bin/rg
NODE=/data/user/0/com.deepseek.harness/files/.bin/node
export LD_LIBRARY_PATH="/data/user/0/com.deepseek.harness/files/payload/runtime/lib:${LD_LIBRARY_PATH:-}"
INNER=$BUILD/inner-javac.sh

usage() {
  sed -n '3,30p' "$0"
}

RJAVA=""
while [ $# -gt 0 ]; do
  case "$1" in
    --rjava)   RJAVA="${2:-}"; shift 2 ;;
    --rjava=*) RJAVA="${1#--rjava=}"; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "✗ 未知参数：$1（可用：--rjava <path>）" >&2; exit 2 ;;
  esac
done

# ---- 基本检查 -------------------------------------------------------------
[ -f "$RUN" ] || { echo "✗ 找不到 proot 入口 $RUN" >&2; exit 1; }
[ -d "$HARNESS" ] || { echo "✗ 找不到源码目录 $HARNESS" >&2; exit 1; }
[ -d "$VSC" ] || { echo "✗ 找不到 vscreen 目录 $VSC" >&2; exit 1; }
[ -f "$LIBS/shizuku-api.aar" ] || { echo "✗ 缺少 $LIBS/shizuku-api.aar" >&2; exit 1; }

mkdir -p "$BUILD/logs" "$BUILD/aar" "$BUILD/classes" "$BUILD/dex"
# 只清理显式的旧产物路径，删除前回读真实绝对父目录。
APPBUILD=$(realpath "$BUILD")
```

</details>

**依据 4 · 源码核查**：[selfbuild/scripts/javac-app.sh:91-103](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/javac-app.sh#L91-L103)

Java类列表与存在性要求。

<details>
<summary>查看原文（13行）</summary>

```text
VSC_SRCS=$(ls "$VSC"/*.java 2>/dev/null || true)
[ -n "$VSC_SRCS" ] || { echo "✗ $VSC 下没有 .java" >&2; exit 1; }

# ---- R.java 选源 ----------------------------------------------------------
R_MODE=""
if [ -n "$RJAVA" ]; then
  [ -f "$RJAVA" ] || { echo "✗ --rjava 指定的文件不存在：$RJAVA" >&2; exit 1; }
  R_MODE="参数 --rjava"
elif [ -f "$GEN_A" ]; then
  RJAVA="$GEN_A"
  R_MODE="任务A 的 aapt 产物"
else
  RJAVA="$BUILD/gen-temp/com/deepseek/harness/R.java"
```

</details>

#### 缺口

- 当前固定树缺完整native Java/Manifest、安装runtime和实际APK对应证据，本轮未真机执行。
  **影响**：无法证明自动化授权、后台可靠性、完整重建或敏感数据/恢复边界。
  **进一步探讨**：提供精确可获取构建输入和同摘要APK，在备用机用去敏任务逐权限/失败/恢复验收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · LAN、安全和隐私承诺支持到哪一层？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

console的admitConsoleRequest要求connection.admit返回peer且无rejection，服务缺失/异常默认503，401/403明确拒绝，这是实际fail-closed接线。roles写路由也先admit、限制64KiB与字段/数量再原子rename，较无门控console是具体防护。LAN patch把上游通配地址拒绝改为只有DSH_ALLOW_LAN=1放行，并同步到overlay；必须匹配补丁锚点不是直接假定所有新内核兼容。App侧只有用户显式开关才注入env、WebView bridge对origin/cookie如何核实和所有静态资源门是否真实应用，都未见完整native/payload证据。补丁注释承认LAN token走HTTP有同网段嗅探风险；不能把显式开关当TLS或端到端访问隔离。文档承诺不可逆动作前确认、无数据上报、凭据私有存储属于作者说明，不能由局部Host认证证明；读屏/通知可接触OTP/聊天/支付内容并发送用户所选模型，权限和模型数据边界要逐功能真机验收。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-android-console/lib/index.js:42-59](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/plugins/dsh-android-console/lib/index.js#L42-L59)

connection准入fail-closed。

<details>
<summary>查看原文（18行）</summary>

```text
export const inject = ['webServer'];

/** Run the engine Host/Origin fence and signed-cookie check before loading tools. */
export function admitConsoleRequest(ctx, req, res) {
  let status = 503;
  try {
    const connection = typeof ctx.get === 'function' ? ctx.get('connection') : undefined;
    if (connection && typeof connection.admit === 'function') {
      const verdict = connection.admit(req);
      if (verdict && verdict.rejection === undefined && verdict.peer !== undefined) return true;
      if (verdict && (verdict.rejection === 401 || verdict.rejection === 403)) status = verdict.rejection;
    }
  } catch (error) {
    ctx.logger?.warn('android-console: request admission failed');
  }
  res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
  res.end(status === 401 ? 'unauthorized' : status === 403 ? 'forbidden' : 'authentication service unavailable');
  return false;
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-android-console/lib/index.js:106-169](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/plugins/dsh-android-console/lib/index.js#L106-L169)

roles先鉴权、限长及字段检查。

<details>
<summary>查看原文（64行）</summary>

```text
      kind: 'prefix',
      path: '/android-console-roles',
      handler: async (req, res) => {
        if (!admitConsoleRequest(webCtx, req, res)) return;
        const send = (status, body) => {
          res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
          res.end(JSON.stringify(body));
        };
        if (!rolesFile) return send(500, { ok: false, error: 'DSH_HOME unset' });
        if (req.method === 'GET') {
          let raw;
          try { raw = readFileSync(rolesFile, 'utf8'); }
          catch (error) {
            if (error && error.code === 'ENOENT') return send(200, { ok: true, roles: null });
            return send(500, { ok: false, error: 'read failed' });
          }
          try { return send(200, { ok: true, roles: JSON.parse(raw) }); }
          catch (_e) { return send(500, { ok: false, error: 'roles file is not valid json' }); }
        }
        if (req.method !== 'POST') return send(405, { ok: false, error: 'method not allowed' });
        const chunks = [];
        let size = 0;
        try {
          for await (const chunk of req) {
            const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
            size += buf.length;
            if (size > 65536) return send(413, { ok: false, error: 'too large' });
            chunks.push(buf);
          }
        } catch (_e) { return send(400, { ok: false, error: 'read failed' }); }
        let roles;
        try { roles = JSON.parse(Buffer.concat(chunks).toString('utf8')).roles; }
        catch (_e) { return send(400, { ok: false, error: 'bad json' }); }
        if (!Array.isArray(roles) || roles.length === 0 || roles.length > 20) return send(400, { ok: false, error: 'roles must be 1..20' });
        const ids = new Set();
        const clean = [];
        for (const role of roles) {
          if (!role || typeof role !== 'object' || Array.isArray(role)) return send(400, { ok: false, error: 'bad role' });
          for (const key of ['id', 'label', 'provider', 'model']) {
            if (typeof role[key] !== 'string' || !role[key].trim()) return send(400, { ok: false, error: 'role.' + key + ' required' });
          }
          if (ids.has(role.id)) return send(400, { ok: false, error: 'duplicate role id: ' + role.id });
          ids.add(role.id);
          if (role.effort !== undefined && role.effort !== null && !ROLE_EFFORTS.includes(String(role.effort))) {
            return send(400, { ok: false, error: 'role.effort not allowed: ' + String(role.effort) });
          }
          const row = {};
          for (const key of ROLE_FIELDS) {
            const value = role[key];
            if (value === undefined || value === null || value === '') continue;
            if (typeof value !== 'string') return send(400, { ok: false, error: 'role.' + key + ' must be string' });
            row[key] = value.trim();
          }
          clean.push(row);
        }
        const tmp = rolesFile + '.tmp-' + process.pid;
        try {
          writeFileSync(tmp, JSON.stringify(clean, null, 2) + '\n');
          renameSync(tmp, rolesFile);
        } catch (error) {
          try { unlinkSync(tmp); } catch (_e2) {}
          return send(500, { ok: false, error: 'write failed' });
        }
        return send(200, { ok: true, saved: clean.length });
```

</details>

**依据 3 · 源码核查**：[selfbuild/scripts/patch-lan-optin.js:1-16](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/patch-lan-optin.js#L1-L16)

显式LAN与HTTP风险声明。

<details>
<summary>查看原文（16行）</summary>

```text
// v1.32 补丁：给「局域网绑定」开一个**显式开关**，默认仍然拒绝。
//
// 背景（实测，两道闸）：
//   ① dsh-web-app/lib/startup.js:40 对 `--host 0.0.0.0` 直接 program.error（上游安全设计）
//   ② dsh-host-webserver 的 config schema 只接受 "127.0.0.1" | "0.0.0.0"
//      → 想绕开①用 `--host ::` 会被②拒（ValidationError: `$.host expected "127.0.0.1" | "0.0.0.0"`）
//   所以唯一可行路径就是①放行 0.0.0.0 —— 而 0.0.0.0 同时包含回环，App 自己的 WebView（127.0.0.1）不受影响。
//
// 安全设计：**不是删掉上游的拒绝**，而是让它只在环境变量 DSH_ALLOW_LAN=1 时才放行。
//   App 侧只有用户在 /lan 显式开启后才会注入该环境变量 → 任何"误传 --host 0.0.0.0"仍然报错退出。
//
// 前置条件（均已具备）：三处无鉴权读面在 v1.24~v1.31 全部关闭（无 cookie 一律 401/403）。
// 残留风险：令牌走明文 HTTP，同网段可嗅探 → 只在可信网络使用。
const fs = require('fs'), path = require('path'), cp = require('child_process');
const N = process.env.DSH_KERNEL_DIR || '/data/user/0/com.deepseek.harness/files/payload/dshroot/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai';
const R = process.env.DSH_PROJECT || path.join(__dirname, '../..')
```

</details>

**依据 4 · 源码核查**：[selfbuild/scripts/patch-lan-optin.js:24-38](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/patch-lan-optin.js#L24-L38)

env条件与锚点数检查。

<details>
<summary>查看原文（15行）</summary>

```text
const to = [
  '\t\t// v1.32：默认仍拒绝 0.0.0.0（保持上游安全语义）；只有 App 在用户显式开启局域网访问时',
  '\t\t// 注入 DSH_ALLOW_LAN=1 才放行。0.0.0.0 含回环，WebView(127.0.0.1) 不受影响。',
  '\t\tif (options.host === "0.0.0.0" && process.env.DSH_ALLOW_LAN !== "1") program.error("error: --host 0.0.0.0 is intentionally not supported yet for safety: it would expose remote code execution to the network; use 127.0.0.1 instead (or set DSH_ALLOW_LAN=1 to opt in explicitly)");'
].join('\n');

const src = `${N}/${PKG}/${FILE}`;
let s = fs.readFileSync(src, 'utf8');
if (s.includes('DSH_ALLOW_LAN')) {
  console.log('  ✓ 已是打过补丁的状态 → 直通同步（幂等）');
} else {
  const n = s.split(from).length - 1;
  if (n !== 1) { console.error(`✗ 期望 1 处锚点，实际 ${n} 处 → 中止`); process.exit(1); }
  s = s.replace(from, to);
  // 真解析校验（node --check 在这种文件上会给假通过）
```

</details>

**依据 5 · 作者声明**：[docs/权限与隐私.md:25-48](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/docs/%E6%9D%83%E9%99%90%E4%B8%8E%E9%9A%90%E7%A7%81.md#L25-L48)

作者数据/权限/不可逆确认主张。

<details>
<summary>查看原文（24行）</summary>

```text

## 二、数据在哪里

- **会话、配置、附件、日志都在手机本地**：应用私有目录 + `/sdcard/DeepSeekHarness/`。
- **本项目不运营任何服务器，也不做任何数据上报**（没有统计 SDK、没有埋点）。
- 你发给 AI 的内容会送到**你自己在「模型」里选定的服务**（DeepSeek 官方，或你配置的第三方中继）。
  **那部分数据遵循该服务方的隐私政策，不经过我们。**

## 三、凭据怎么存

- 登录凭据与 API Key 存在应用私有目录的凭据文件里（其他 App 读不到）。
- ⚠️ **「导出全部数据」得到的备份 zip 里含凭据** —— 请当作密码保管，不要公开分享。
- 项目仓库里**不含**任何密钥、凭据、会话数据；打包时脚本会自动剔除并做隐私扫描。

## 四、局域网访问（默认关闭）

- 默认**只监听本机**（`127.0.0.1`），局域网里的其他设备访问不到。
- 需要时可在 App 内显式开启：开启后引擎会监听局域网，访问需要本地 token，**重启 App 生效**。
- 不需要时请关掉；在不可信的 Wi-Fi 下不要开。

## 五、敏感能力，请务必注意

- **读屏 / 通知读取**可能接触到**密码、验证码、聊天记录、支付信息**。
  不要在不信任的界面里跑自动化，也不要把这些内容发给任何 AI 服务。
```

</details>

#### 缺口

- 当前固定树缺完整native Java/Manifest、安装runtime和实际APK对应证据，本轮未真机执行。
  **影响**：无法证明自动化授权、后台可靠性、完整重建或敏感数据/恢复边界。
  **进一步探讨**：提供精确可获取构建输入和同摘要APK，在备用机用去敏任务逐权限/失败/恢复验收。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 手机自建和发布验证能证明什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

selfbuild主链复用已装APK骨架，导出payload、overlay覆盖、重打包、显式version、签名再verify；不是从此Git树独立完整构建，需已装私有runtime/proot/Java/toolchain/签名key、v118源码/libs及checks.manifest等未入当前树输入。javac可生成全0占位R.java跑通编译，但发布收据checkCompile明确拒placeholder；编译input哈希与DEX、packed assets、APK内dex/payload/kernel/revision、签名日志指纹绑定，对“改源码却装旧包”有具体检测价值。release-publish还要求同APK privacy/isolated证据、新鲜已发布baseline和干净同步源，不能只拿一个helper绿字当发布通过。verify-apk-payload旧helper按文件存在、MD5和关键字核查，缺manifest条目只计absent不计最终失败，且结构“可用”不测试引擎真正启动，属于辅助静态体检边界；更严格receipt链必须另验。签名完整性不证明程序行为安全，收据/脚本存在不代表本轮已执行或发布APK与固定Git一致。

#### 证据与依据

**依据 1 · 源码核查**：[selfbuild/selfbuild.sh:1-27](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/selfbuild.sh#L1-L27)

复用装机骨架与构建阶段。

<details>
<summary>查看原文（27行）</summary>

```text
#!/system/bin/sh
# ============================================================================
# DSH Android 自构建（selfbuild）—— 改自己，不需要电脑/构建机
#
#   全部零件都在手机上：
#     · proot + Alpine 3.20 + OpenJDK 17   → files/work/linux/run.sh
#     · android.jar / d8.jar / apksigner.jar → files/toolchain/
#     · pkcs12.keystore（v2+v3 签名）        → files/keys/
#     · payload 重打包                       → selfbuild/lib/{ziptool,selfbuild}.js
#
#   最小闭环：复用装机 APK 的骨架（资源/清单/dex 原样搬运），只替换
#   assets/payload.zip 里的引擎侧文件 → 重新签名 → 装机。
#   资源不改 → 不需要 aapt2；payload 是 STORE → 不需要重压缩 2 万个文件。
#
# 用法：
#   sh selfbuild.sh base                 # 取装机 APK 作为骨架（需可读）
#   sh selfbuild.sh payload              # 从骨架导出 assets/payload.zip
#   sh selfbuild.sh patch                # 用 build-overlay/ 覆盖 payload
#   sh selfbuild.sh pack                 # 骨架 + 新 payload → 未签名 APK
#   sh selfbuild.sh mark                 # 写 dshroot 标记（内核版本+revision，触发 App 全量解压）
#   sh selfbuild.sh version 1.21 52     # 改 APK 版本号（更新提示靠它，必须每包递增）
#   sh selfbuild.sh sign                 # apksigner 签名 → out/
#   sh selfbuild.sh verify               # 指纹 + payload 一致性 + patch-check
#   sh selfbuild.sh install              # 经 App 内嵌特权桥 pm install -r
#   sh selfbuild.sh all                  # payload→patch→pack→sign→verify（不装机）
#   sh selfbuild.sh check                # 只跑装机副本的补丁完整性校验
# ============================================================================
```

</details>

**依据 2 · 源码核查**：[selfbuild/scripts/javac-app.sh:13-19](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/javac-app.sh#L13-L19)

R.java来源与占位说明。

```text
#   R.java 选源优先级：
#     1) --rjava <path>                          显式指定
#     2) selfbuild/work/gen/com/deepseek/harness/R.java   （任务A 的 aapt 产物）
#     3) 自动生成临时占位 R.java（只含源码真正引用的字段，值全 0）
#   → 脚本会打印**实际用的是哪一份**与 sha256，交付必须跑成 (2)。
#
#   产物（都在 selfbuild/work/appbuild/out/ 下）：
```

**依据 3 · 源码核查**：[selfbuild/scripts/release-receipts.mjs:73-77](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/release-receipts.mjs#L73-L77)

发布拒placeholder并核DEX。

```text
export function checkCompile(receiptFile, dex) {
  const receipt = checkInputs(readJson(receiptFile));
  insist(receipt.kind === 'compile' && HASH.test(receipt.dexSha256), 'Compilation never completed');
  insist(receipt.mode !== 'placeholder', 'Placeholder R.java cannot be released');
  insist(shaFile(dex || receipt.dex) === receipt.dexSha256, 'DEX changed after compilation'); return receipt;
```

**依据 4 · 源码核查**：[selfbuild/scripts/release-receipts.mjs:144-165](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/release-receipts.mjs#L144-L165)

APK/编译/资产/签名绑定重核。

<details>
<summary>查看原文（22行）</summary>

```text
export function recordArtifact({ apk, compile, payload, checks, signature, assets, output }) {
  const built = checkCompile(compile), identity = apkIdentity(apk), checked = checkPayload(payload, checks, true), checkedAssets = checkPackedAssets(apk, assets);
  insist(identity.dexSha256 === built.dexSha256 && identity.payloadSha256 === shaFile(payload), 'APK dex/payload differs from build inputs');
  insist(identity.kernel && /^[0-9]{14}$/.test(identity.revision), 'APK kernel/revision markers invalid');
  const pkg = readZip(payload, { load: false }).find(e => e.name === 'dshroot/lib/node_modules/@deepseek-ai/dsh/package.json');
  insist(pkg && JSON.parse(readEntry(payload, pkg).toString('utf8')).version === identity.kernel, 'Kernel marker differs from payload');
  const log = fs.readFileSync(signature, 'utf8');
  insist(/Verifies/.test(log) && /Verified using v[23] scheme.*true/.test(log) && /Signer #1 certificate SHA-256 digest: [a-f0-9]{64}/i.test(log), 'Signature verifier did not pass');
  const receipt = { schema: 1, kind: 'artifact', ok: true, completedAt: new Date().toISOString(), ...identity,
    compile: path.resolve(compile), compileSha256: shaFile(compile), inputsSha256: built.inputsSha256,
    payload: path.resolve(payload), checks: path.resolve(checks), ...checked, ...checkedAssets,
    signature: path.resolve(signature), signatureSha256: shaFile(signature), signerSha256: log.match(/Signer #1 certificate SHA-256 digest: ([a-f0-9]{64})/i)[1].toLowerCase() };
  writeJson(output, receipt); return receipt;
}
export function checkArtifact(file) {
  const receipt = readJson(file); insist(receipt.schema === 1 && receipt.kind === 'artifact' && receipt.ok === true, 'Invalid artifact receipt');
  const actual = apkIdentity(receipt.apk);
  for (const key of ['apkSha256', 'apkSize', 'versionName', 'versionCode', 'manifestSha256', 'dexSha256', 'payloadSha256', 'kernel', 'revision']) insist(actual[key] === receipt[key], 'Artifact changed: ' + key);
  const built = checkCompile(receipt.compile), packed = checkPackedAssets(receipt.apk, receipt.packedAssets);
  insist(shaFile(receipt.compile) === receipt.compileSha256 && built.dexSha256 === receipt.dexSha256 && shaFile(receipt.checks) === receipt.checksSha256 && shaFile(receipt.signature) === receipt.signatureSha256 && packed.packedAssetsSha256 === receipt.packedAssetsSha256, 'Artifact verification inputs changed');
  return receipt;
}
```

</details>

**依据 5 · 源码核查**：[selfbuild/scripts/release-publish.mjs:47-59](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/release-publish.mjs#L47-L59)

publish evidence/baseline/源门。

<details>
<summary>查看原文（13行）</summary>

```text
async function main() {
  insist(/^[0-9]+(?:\.[0-9]+)*$/.test(process.env.DSH_DIST_VERSION || '') && /^[1-9][0-9]*$/.test(process.env.DSH_DIST_CODE || ''), 'Set explicit DSH_DIST_VERSION and DSH_DIST_CODE');
  const artifactFile = arg('artifact', path.join(sb, `out/release-v${VERSION}-code${CODE}.json`)), artifact = checkArtifact(artifactFile);
  const baselineTag = arg('baseline-tag');
  const baseline = checkBaseline(arg('baseline', path.join(sb, `out/baseline-${baselineTag || 'unselected'}.json`)), baselineTag);
  checkEvidence(arg('privacy', artifact.apk + '.privacy.json'), 'privacy', artifact.apkSha256);
  checkEvidence(arg('isolated', artifact.apk + '.isolated.json'), 'isolated', artifact.apkSha256);
  const clone = arg('clone', `${process.env.DSH_VERIFY_DIR || '/data/user/0/com.deepseek.harness/files/_verify'}/ws-GitHub`);
  checkSynced(clone);
  const git = (...a) => { try { return execFileSync('git', ['-C', clone, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); } catch { throw new Error('Source Git check failed'); } };
  insist(git('status', '--porcelain').length === 0, 'Publishing clone has uncommitted/untracked files');
  insist(git('branch', '--show-current') === 'main', 'Publishing clone must be on main');
  // 允许显式指定已推送到远端的提交（本机 github.com 直连不通时，源码经 API 推送，本地 clone 的 HEAD 与远端不一致）
```

</details>

**依据 6 · 源码核查**：[selfbuild/scripts/verify-apk-payload.js:53-75](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/verify-apk-payload.js#L53-L75)

缺条目只absent和静态ok。

<details>
<summary>查看原文（23行）</summary>

```text
// B. 补丁清单
console.log('— 补丁清单（能力在不在）—');
const man = fs.readFileSync(path.join(SB, 'checks.manifest'), 'utf8')
  .split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
let hit = 0, miss = 0, older = 0, absent = 0;
for (const line of man) {
  const [p, want, kw] = line.split('|');
  const short = p.replace(N + '/', '').replace('/lib/index.js', '');
  const e = inner.get(p);
  if (!e) { absent++; console.log(`  ␀ 本包无此文件: ${short}`); continue; }
  const buf = bytes(e);
  const md5 = crypto.createHash('md5').update(buf).digest('hex');
  const kwOk = !kw || kw === '-' || buf.includes(kw);
  if (md5 === want && kwOk) { hit++; console.log(`  ✅ ${short}`); }
  else if (inventory) { older++; console.log(`  ↺ ${short}（本包是旧版/未打此补丁）`); }
  else { miss++; console.log(`  ❌ ${short}\n     md5=${md5} 期望=${want}${kwOk ? '' : `  关键字缺失: ${kw}`}`); }
}
console.log(`  → 补丁命中 ${hit} / 旧版或未打 ${older} / 本包无 ${absent}${miss ? ` / ❌不一致 ${miss}` : ''}`);

const ok = structFail === 0 && miss === 0;
console.log(`  结果: ${ok ? '✅ 可用' : '❌ 不可用'}（结构问题 ${structFail}，补丁不一致 ${miss}）`
  + (inventory ? '  [体检模式：旧版条目不算失败]' : ''));
process.exit(ok ? 0 : 1);
```

</details>

#### 缺口

- 当前固定树缺完整native Java/Manifest、安装runtime和实际APK对应证据，本轮未真机执行。
  **影响**：无法证明自动化授权、后台可靠性、完整重建或敏感数据/恢复边界。
  **进一步探讨**：提供精确可获取构建输入和同摘要APK，在备用机用去敏任务逐权限/失败/恢复验收。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 用户怎样算全周期成本和退路？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

首次需要兼容Android设备、安装第三方APK、自备模型key/网络和约192MB包/约0.6GB数据空间，构建环境另约193MB下载/342MB解压都是作者估计；README说Android8+而安装要求说7+/高级自动化11+，缺Manifest时无法消解，必须按确切制品/机型核验。聊天只需网络的声明不代表自动化无需权限；截图、无障碍、文件访问、电池优化、Shizuku等增加配置/隐私和系统版本成本。持续有远端模型费、本地CPU/电池/温度、后台被系统杀、上游内核补丁适配和备份空间，现金/工时/实际可靠性未知。升级只应使用相同签名谱系，签名冲突时卸载会删私有会话/配置，作者记录过事故；备份脚本把payload/dshhome与keys明文tar.gz放共享存储并轮转5份，restore直接覆盖，需保护含凭据/key备份且先核恢复包，非自动无损回滚。建议观察，先备用机去敏任务/撤权限/离线/升级恢复测试，不把日常主机不可逆点击交给未经验证自动化。停用先撤无障碍/通知/LAN并备份，卸载后/sdcard导出仍需自己处理，已发送模型数据不撤回。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:51-55](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/README.md#L51-L55)

作者APK体积与Android8+主张。

```text
### 三步装好

1. 打开 **[Releases](https://github.com/guzhou079-arch/deepseek-harness-android/releases/latest)**，下载最新的 `DeepSeekHarness-vX.Y-dist.apk`（约 192 MB，Android 8.0 及以上）；
2. 安装后按首次引导给权限（无障碍、通知、悬浮窗等，可随时在系统设置里收回）；
3. 在设置页填入自己的模型 API Key 就能开聊 —— 不用装 Termux、不用 root、不用连电脑。
```

**依据 2 · 作者声明**：[docs/安装与要求.md:5-11](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/docs/%E5%AE%89%E8%A3%85%E4%B8%8E%E8%A6%81%E6%B1%82.md#L5-L11)

作者Android7+/高级11+与空间。

```text
| 项 | 要求 |
|---|---|
| **Android 版本** | **7.0（API 24）及以上**。⚠️ 无障碍**截图**、虚拟屏等高级能力需要 **Android 11+**，低版本装了也能聊天，但部分自动化能力不可用 |
| **存储空间** | 安装包约 **192 MB**；安装后应用数据约 **0.6GB**（运行时 + 引擎 + 会话）；另可选下载构建环境约 **340MB** |
| **网络** | 需要联网（AI 模型在远端）。局域网访问默认关闭 |
| **硬件** | 不需要 root；NFC 读卡需要手机有 NFC |
| **权限** | 核心聊天只需要网络；其余权限按需授予，详见 [权限与隐私](权限与隐私.md) |
```

**依据 3 · 作者声明**：[docs/自建环境与出包.md:5-30](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/docs/%E8%87%AA%E5%BB%BA%E7%8E%AF%E5%A2%83%E4%B8%8E%E5%87%BA%E5%8C%85.md#L5-L30)

作者构建资源/校验/解压条件。

<details>
<summary>查看原文（26行）</summary>

```text

## 一、先说清楚：构建环境不在包里，但**一键就能装**

| | 在哪 | 多大 |
|---|---|---|
| 主包（APK） | 本仓库 Releases | 约 192 MB |
| **构建环境** | **App 内按需下载** | 约 193MB（解压后 342MB） |
| 源码 | 本仓库 | 很小 |

为什么不做进主包：绝大多数人只是想用 AI，为 342MB 付体积和首启解压时间不划算。
想要自建能力的人，点一下就有 —— **不用为了照顾少数人让所有人都多背 342MB**，
反过来也**不该因为大多数人不需要就把这个能力砍掉**。

## 二、装构建环境（App 内一键）

**控制台 →「自建环境」**，等它下载 → 校验 → 解压 → 就绪。

构建环境放在本仓库 Releases 的 `buildenv-v1` 里，拆成 3 个分卷（单个附件不超过 100MB），
逐卷校验、可断点续传；界面上的备用源是历史遗留的快照，**以本仓库这份为准**。

它做的事：
1. 读清单 → 逐卷下载（**已下且校验通过的卷会跳过**，可断点续传）
2. 逐卷校 sha256 → 合并 → 再校**整包** sha256
3. 用内置的 python3 解压（`filter='fully_trusted'`，**保证符号链接和权限位还原**）
4. 落到 App 私有目录，写就绪标记

```

</details>

**依据 4 · 作者声明**：[docs/权限与隐私.md:5-24](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/docs/%E6%9D%83%E9%99%90%E4%B8%8E%E9%9A%90%E7%A7%81.md#L5-L24)

权限按功能与Shizuku说明。

<details>
<summary>查看原文（20行）</summary>

```text
**每一项都可以拒绝**，拒绝只是对应功能不可用 —— 聊天本身只需要「网络」。

| 权限 | 用来做什么 | 不授予会怎样 |
|---|---|---|
| **网络** | 与你自己配置的模型服务通信 | 无法聊天 |
| **通知** | 常驻状态、通知栏里的「开关面板 / 开关节能云」等操作 | 收不到通知栏入口；App 仍可用 |
| **悬浮窗** | 悬浮球 / 桌宠 / 流体云卡片 | 悬浮球不显示；其余功能不受影响 |
| **无障碍服务** | 读屏、点击、输入、截图（手机自动化） | 自动化不可用；**聊天与文件功能不受影响** |
| **通知读取**（无障碍） | 读取通知（验证码、聊天消息等） | 相关工具读不到通知 |
| **文件读写** | 在 `/sdcard` 读写文件、导入/导出、保存 AI 生成的文件 | AI 无法保存或读取文件 |
| **所有文件访问** | 访问任意目录（例如微信/QQ 的下载目录） | 只能访问 App 自己的目录 |
| **使用情况访问** | 统计各 App 使用时长 | 该功能不可用 |
| **NFC** | 读取 NFC 标签的 UID / NDEF | 读卡功能不可用 |
| **安装未知应用** | 应用内一键升级 | 只能手动下载安装 |
| **精确闹钟** | 定时任务准点触发 | 定时可能被系统推迟 |
| **修改系统设置** | 调整亮度、音量等 | 相关小功能不可用 |
| **忽略电池优化** | 长任务不被系统杀掉 | 后台长任务可能中断 |

> 本项目**不需要 root**。部分系统级操作（虚拟屏等）可选地通过 **Shizuku** 提供的特权通道实现，
> 不装 Shizuku 也能正常使用其余功能。
```

</details>

**依据 5 · 作者声明**：[docs/安装与要求.md:31-44](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/docs/%E5%AE%89%E8%A3%85%E4%B8%8E%E8%A6%81%E6%B1%82.md#L31-L44)

签名更新与备份凭据/卸载范围。

<details>
<summary>查看原文（14行）</summary>

```text
## 四、更新（**先读这一节**）

- **只从本仓库 Releases 更新**，直接覆盖安装即可。
- ⛔ **不要卸载重装** —— 卸载会清空应用私有数据（会话历史、运行环境、配置）。
- 若报 `INSTALL_FAILED_UPDATE_INCOMPATIBLE`：说明你现在装的是**别的签名**的同名包。
  这时**先别卸载**：先在 App 内「控制台 → 救援 → 导出全部数据」备份，再决定怎么处理。
- 升级前建议每次都导出一次数据（同上路径）。

## 五、卸载 / 换机 / 迁移

- **导出**：控制台 →「救援」→「导出全部数据」→ 得到一个 zip（含会话、配置、工作区）。
- **导入**：换机或重装后 →「从备份导入还原」→ 选那个 zip。
- ⚠️ 备份 zip 里**含登录凭据**，请像对待密码一样保管，别随手转发。
- 卸载会删掉应用私有数据；`/sdcard/DeepSeekHarness` 下的导出包、截图、构建环境分卷**不会**被卸载删除。
```

</details>

**依据 6 · 源码核查**：[selfbuild/scripts/backup-dshhome.sh:20-25](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/backup-dshhome.sh#L20-L25)

共享备份路径和轮转。

```text
F=/data/user/0/com.deepseek.harness/files
OUTDIR=/storage/emulated/0/DeepSeekHarness/backups
KEEP=5
mkdir -p "$OUTDIR"

latest() { ls -t "$OUTDIR"/dshhome-*.tar.gz 2>/dev/null | head -1; }
```

**依据 7 · 源码核查**：[selfbuild/scripts/backup-dshhome.sh:48-61](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/backup-dshhome.sh#L48-L61)

restore覆盖非事务。

<details>
<summary>查看原文（14行）</summary>

```text
    [ -f "$SRC" ] || { echo "✗ 找不到备份: $SRC"; exit 1; }
    echo "== 还原 $SRC =="
    if ! tar -xzf "$SRC" -C "$F"; then
      echo "✗ 还原失败：tar 未能完整解压 $SRC" >&2
      exit 1
    fi
    echo "✓ 已还原到 $F（dshhome/keys/.pip/bin 覆盖回去；重启 App 生效）"
    exit 0
    ;;
esac

TS=$(date +%Y%m%d-%H%M%S)
OUT="$OUTDIR/dshhome-$TS.tar.gz"
echo "== 打包 =="
```

</details>

**依据 8 · 源码核查**：[selfbuild/scripts/backup-dshhome.sh:67-86](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/backup-dshhome.sh#L67-L86)

打包含keys与轮转旧包。

<details>
<summary>查看原文（20行）</summary>

```text
ITEMS="payload/dshhome keys"
for p in .pip bin .local/lib/python3.14/site-packages/usercustomize.py; do
  if [ -e "$F/$p" ] || [ -L "$F/$p" ]; then ITEMS="$ITEMS $p"; else echo "  · 跳过（本机不存在）: $p"; fi
done
tar -czf "$OUT" -C "$F" --exclude 'payload/dshhome/cache' $ITEMS
if [ $? -ne 0 ]; then echo "✗ tar 失败（看上面报错）"; exit 1; fi

if [ ! -s "$OUT" ]; then echo "✗ 打包失败"; exit 1; fi
echo "  → $OUT（$(du -m "$OUT" | cut -f1)MB）"
tar -tzf "$OUT" 2>/dev/null | wc -l | sed 's/^/  条目: /'

echo "== 轮转（保留最近 $KEEP 份）=="
ls -t "$OUTDIR"/dshhome-*.tar.gz 2>/dev/null | tail -n +$((KEEP+1)) | while read -r old; do
  rm -f "$old" && echo "  删除旧备份 $(basename "$old")"
done

echo "== 当前备份 =="
ls -t "$OUTDIR"/dshhome-*.tar.gz 2>/dev/null | head -"$KEEP" | while read -r b; do
  printf "  %s  %sMB\n" "$(basename "$b")" "$(du -m "$b" | cut -f1)"
done
```

</details>

#### 缺口

- 当前固定树缺完整native Java/Manifest、安装runtime和实际APK对应证据，本轮未真机执行。
  **影响**：无法证明自动化授权、后台可靠性、完整重建或敏感数据/恢复边界。
  **进一步探讨**：提供精确可获取构建输入和同摘要APK，在备用机用去敏任务逐权限/失败/恢复验收。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么改进能证伪自维护和权限边界？

**研究主题**：新假设与验证、采用判断

#### 完整回答

由Q02-Q05提出未验证的“完整设备交付清单”假设：固定Java/Manifest/AAR、原APK/payload/toolchain和补丁manifest来源摘要，构建只消费可获取清单，不允许隐含本机v118依赖；对输出APK建立真机能力矩阵，默认拒native桥跨origin请求，撤权限后返回明确不可用，发送/删除等动作由系统可信确认绑定确切目标。每份backup需加密并做恢复演练，更新用同签名测试实例先验证，发布receipt分别表述静态一致/真机执行/恢复。最小反例用全新机器只取Git、缺manifest补丁、权限撤销后点击、LAN未开/跨origin、系统杀进程中断和签名冲突；若缺输入仍声称可重建、静态绿字当执行通过或卸载逼迫丢数据，即推翻自维护充分性。新增清单和机型验收成本需要与手工Termux方案比较，不计当前已有成果或省时。

#### 证据与依据

**依据 1 · 源码核查**：[selfbuild/scripts/javac-app.sh:38-73](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/javac-app.sh#L38-L73)

隐含输入依赖。

<details>
<summary>查看原文（36行）</summary>

```text
SB=$REPO/selfbuild
SRC=$REPO/v118/android-app/src
LIBS=$REPO/v118/android-app/libs
HARNESS=$SRC/com/deepseek/harness
VSC=$HARNESS/vscreen
BUILD=$SB/work/appbuild/out
GEN_A=$SB/work/gen/com/deepseek/harness/R.java
RUN=/data/user/0/com.deepseek.harness/files/work/linux/run.sh
RG=/data/user/0/com.deepseek.harness/files/payload/runtime/bin/rg
NODE=/data/user/0/com.deepseek.harness/files/.bin/node
export LD_LIBRARY_PATH="/data/user/0/com.deepseek.harness/files/payload/runtime/lib:${LD_LIBRARY_PATH:-}"
INNER=$BUILD/inner-javac.sh

usage() {
  sed -n '3,30p' "$0"
}

RJAVA=""
while [ $# -gt 0 ]; do
  case "$1" in
    --rjava)   RJAVA="${2:-}"; shift 2 ;;
    --rjava=*) RJAVA="${1#--rjava=}"; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "✗ 未知参数：$1（可用：--rjava <path>）" >&2; exit 2 ;;
  esac
done

# ---- 基本检查 -------------------------------------------------------------
[ -f "$RUN" ] || { echo "✗ 找不到 proot 入口 $RUN" >&2; exit 1; }
[ -d "$HARNESS" ] || { echo "✗ 找不到源码目录 $HARNESS" >&2; exit 1; }
[ -d "$VSC" ] || { echo "✗ 找不到 vscreen 目录 $VSC" >&2; exit 1; }
[ -f "$LIBS/shizuku-api.aar" ] || { echo "✗ 缺少 $LIBS/shizuku-api.aar" >&2; exit 1; }

mkdir -p "$BUILD/logs" "$BUILD/aar" "$BUILD/classes" "$BUILD/dex"
# 只清理显式的旧产物路径，删除前回读真实绝对父目录。
APPBUILD=$(realpath "$BUILD")
```

</details>

**依据 2 · 源码核查**：[selfbuild/scripts/verify-apk-payload.js:62-75](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/verify-apk-payload.js#L62-L75)

静态体检漏条目反例。

<details>
<summary>查看原文（14行）</summary>

```text
  if (!e) { absent++; console.log(`  ␀ 本包无此文件: ${short}`); continue; }
  const buf = bytes(e);
  const md5 = crypto.createHash('md5').update(buf).digest('hex');
  const kwOk = !kw || kw === '-' || buf.includes(kw);
  if (md5 === want && kwOk) { hit++; console.log(`  ✅ ${short}`); }
  else if (inventory) { older++; console.log(`  ↺ ${short}（本包是旧版/未打此补丁）`); }
  else { miss++; console.log(`  ❌ ${short}\n     md5=${md5} 期望=${want}${kwOk ? '' : `  关键字缺失: ${kw}`}`); }
}
console.log(`  → 补丁命中 ${hit} / 旧版或未打 ${older} / 本包无 ${absent}${miss ? ` / ❌不一致 ${miss}` : ''}`);

const ok = structFail === 0 && miss === 0;
console.log(`  结果: ${ok ? '✅ 可用' : '❌ 不可用'}（结构问题 ${structFail}，补丁不一致 ${miss}）`
  + (inventory ? '  [体检模式：旧版条目不算失败]' : ''));
process.exit(ok ? 0 : 1);
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-android-console/lib/index.js:42-59](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/plugins/dsh-android-console/lib/index.js#L42-L59)

可复用Host fail-closed思路。

<details>
<summary>查看原文（18行）</summary>

```text
export const inject = ['webServer'];

/** Run the engine Host/Origin fence and signed-cookie check before loading tools. */
export function admitConsoleRequest(ctx, req, res) {
  let status = 503;
  try {
    const connection = typeof ctx.get === 'function' ? ctx.get('connection') : undefined;
    if (connection && typeof connection.admit === 'function') {
      const verdict = connection.admit(req);
      if (verdict && verdict.rejection === undefined && verdict.peer !== undefined) return true;
      if (verdict && (verdict.rejection === 401 || verdict.rejection === 403)) status = verdict.rejection;
    }
  } catch (error) {
    ctx.logger?.warn('android-console: request admission failed');
  }
  res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
  res.end(status === 401 ? 'unauthorized' : status === 403 ? 'forbidden' : 'authentication service unavailable');
  return false;
```

</details>

**依据 4 · 源码核查**：[selfbuild/scripts/backup-dshhome.sh:48-61](https://github.com/guzhou079-arch/deepseek-harness-android/blob/6a477ad728c674e754e4e34d349d4d9aa5a5d09e/selfbuild/scripts/backup-dshhome.sh#L48-L61)

覆盖恢复需独立验证。

<details>
<summary>查看原文（14行）</summary>

```text
    [ -f "$SRC" ] || { echo "✗ 找不到备份: $SRC"; exit 1; }
    echo "== 还原 $SRC =="
    if ! tar -xzf "$SRC" -C "$F"; then
      echo "✗ 还原失败：tar 未能完整解压 $SRC" >&2
      exit 1
    fi
    echo "✓ 已还原到 $F（dshhome/keys/.pip/bin 覆盖回去；重启 App 生效）"
    exit 0
    ;;
esac

TS=$(date +%Y%m%d-%H%M%S)
OUT="$OUTDIR/dshhome-$TS.tar.gz"
echo "== 打包 =="
```

</details>

#### 缺口

- 当前固定树缺完整native Java/Manifest、安装runtime和实际APK对应证据，本轮未真机执行。
  **影响**：无法证明自动化授权、后台可靠性、完整重建或敏感数据/恢复边界。
  **进一步探讨**：提供精确可获取构建输入和同摘要APK，在备用机用去敏任务逐权限/失败/恢复验收。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
