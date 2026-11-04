# DSHBox

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[e9ec1e8](https://github.com/WSK-build/DSHBox/tree/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7)

<!-- BEGIN META -->
[![GitHub ★ 511](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=511&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WSK-build/DSHBox)
<!-- END META -->

> **功能**：在 Android 设备上运行 DeepSeek Harness，集成 Debian 环境、双渲染变体、终端和移动工具。

> **亮点**：把 Android 渲染与 Debian DSH 启动接在同一客户端，并在特定文件系统拒绝时通过不覆盖复制适配异步硬链接调用。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：本地运行与额外隔离、离线模型和真实恢复是独立条件。文件复制不保留共享 inode，开发者通道也有独立权限边界。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 相对远程访问桌面宿主，根项目实际交付什么？](#detail-section-11)
  - [Q02 · 硬链接兼容与手机控制各改变哪条边界？](#detail-section-12)
  - [Q03 · 什么条件下值得先在测试机试用？](#detail-section-13)
  - [Q04 · 怎样判断本机宿主是否值得替代远端工作站？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：远离工作站但需要继续 DSH 会话的 Android 用户，可以把宿主进程和工作目录放在设备上。

以 Android 浏览器访问已有远端 DSH Web 为对照。远端仍在线且工作数据集中时，不必在移动端重复管理环境。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| Android 本机宿主 | 启动本地 DSH Web | 依赖可用运行层与模型服务 |
| 双渲染变体 | 适配设备 Web 渲染 | APK 分变体，须真机核对 |
| 文件发布兼容 | 特定拒绝时回退复制 | 不覆盖目标，不共享 inode |

**流程与依赖**

| 依赖 | 用途 | 条件 |
| --- | --- | --- |
| Android ARM64 与相应渲染器 | 安装和显示 DSH | 选 APK flavor |
| Debian、Node 与 DSH | 本地宿主 | 首次导入并确认运行层 |
| 可访问的模型服务 | 生成结果 | 本机宿主不代表模型离线 |

| 步骤 | 操作 | 退出 |
| --- | --- | --- |
| 准备 | 测试机安装并导入运行层 | 先保留工作区备份 |
| 核验 | 开会话、保存文件、重启 | 不打开调试或 Root |
| 回退 | 导出工作区并回到远端 | 先核对文件与会话 |

**效果与成本**

| 阶段 | 主要负担 | 计量 |
| --- | --- | --- |
| 首次 | 环境下载和首启 | 记录实际时长、流量和占用 |
| 持续 | 版本维护和模型服务 | 现金、人工和耗电分记 |
| 恢复 | 导出或重建工作区 | 按一次可恢复会话计量 |

| 效果 | 判据 | 边界 |
| --- | --- | --- |
| 本地宿主 | 工作站不可达时仍能启动会话 | 模型服务需可访问 |
| 文件恢复 | 重启后可打开并核对哈希 | 真实设备未验证 |

> **思考**：本地运行与额外隔离、离线模型和真实恢复是独立条件。文件复制不保留共享 inode，开发者通道也有独立权限边界。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 Android 渲染与 Debian DSH 启动接在同一客户端，并在特定文件系统拒绝时通过不覆盖复制适配异步硬链接调用。见 [Q01](#research-q01)、[Q02](#research-q02)。

分发层以 build flavor 选择渲染器，运行脚本默认使用回环。本地链接适配保留目标不覆盖，但只针对部分错误和 API。

<a id="detail-section-5"></a>

### 1.4 主要限制

本地运行与额外隔离、离线模型和真实恢复是独立条件。文件复制不保留共享 inode，开发者通道也有独立权限边界。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

用测试机和非敏感工作区做一次本地会话及重启恢复，保持开发者通道关闭。若数据恢复不明，回到远端 DSH。见 [Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

确认 APK 构建变体、启动脚本和特定硬链接兼容机制。运行层更新、ROM 兼容和真机权限仅有设计或作者说明，待独立验证。

- 已检查：作者 README、包清单、源码路径 README.md、app/build.gradle.kts、runtime-bundle/scripts/start_dsh.sh、plugin-manager/dshbox-plugins/assets/dshbox/link-shim.mjs、pilot/interlock-relay-core/SECURITY.md、runtime-bundle/README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定根客户端的构建、启动、硬链接路径与可选权限文档，未深入验证 Android 全模块、全部随包插件或已发布 APK。
- 下一步：固定两 APK flavor 和同一 Android 条件，运行首次导入、保存、重启与回退验收；权限和模型服务另测。

**分析版本**

- **仓库**：[WSK-build/DSHBox](https://github.com/WSK-build/DSHBox)
- **版本号**：未声明（[固定提交 e9ec1e8](https://github.com/WSK-build/DSHBox/tree/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在远程宿主断开而模型仍可用的条件下，对照本机运行与远端 Web 的会话恢复和文件完整性。见 [Q04](#research-q04)。

固定两 APK flavor 和同一 Android 条件，运行首次导入、保存、重启与回退验收；权限和模型服务另测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .cjs | source | 5 | 4495 | 3882 | 422 | — |
| .cjs | test | 13 | 4035 | 3659 | 228 | — |
| .js | test | 16 | 5487 | 5162 | 105 | — |
| .md | source | 17 | 2523 | — | — | 44416 |
| .js | source | 26 | 11089 | 9331 | 1306 | — |
| .mjs | source | 6 | 436 | 293 | 106 | — |
| .mjs | test | 4 | 2629 | 2244 | 193 | — |

</details>

**活跃度**

[![Issue 未关闭 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=16&color=737b86&logo=github)](https://github.com/WSK-build/DSHBox/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Android 用户能否用 DSHBox 取代仅远程访问工作站的日常会话，哪些权限和恢复条件仍须单独验证？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对远程访问桌面宿主，根项目实际交付什么？

**研究主题**：场景与需求、功能与机制、工程质量与复用

#### 完整回答

面向手边只有 Android 设备但仍要访问个人 DSH 工作区的人，项目交付 Android 应用，不是装入现有桌面 DSH 的单一插件。Gradle 使用同一 applicationId、minSdk 29 与 1.5.1 版本名，定义 systemWebView 和 gecko 渲染变体。Debian 环境的启动脚本优先执行指定 Node 和本地 DSH 入口，默认 127.0.0.1；本地二进制入口条件不满足时走 npx。与远程打开 PC 上的 DSH Web 相比，本机拥有进程与工作目录，不需要常开远端工作站来提供宿主。项目文档所说的本地运行不保证模型或搜索服务离线，首次 Debian/Node 获取亦有在线路径。仓库内随包扩展是 APK 的配套，不应把其注册项当成 Android 根包的模型工具。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-33](https://github.com/WSK-build/DSHBox/blob/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7/README.md#L16-L33)

作者描述 Android 形态与首次准备

<details>
<summary>查看原文（18行）</summary>

```text
**DSHBox** is an open-source app that runs the full **DeepSeek Harness (DSH)** locally on Android phones and tablets. It brings DSH, PRoot, System WebView or embedded GeckoView, Debian and Node.js together with a terminal, file manager, AI browser assistant, phone assistant and optional developer tools to form a personal AI workbench. No root access or separate Termux installation is required for normal use.

**DSHBox** 是一个可在安卓手机和平板上本机运行完整 **DeepSeek Harness（DSH）** 的开源应用。它将 DSH、PRoot、系统 WebView 或内置 GeckoView、Debian、Node.js 集成协调在一起，配套终端、文件管理、AI 浏览器助手、手机助手与可选开发者工具，组成个人 AI 工作台。日常使用无需 Root，也无需单独安装 Termux。

---

## 快速安装

| 项目 | 说明 |
|---|---|
| 系统要求 | Android 10+ · ARM64 |
| 权限 | 日常使用无需 Root · 无需 Termux；开发者模式中的 Root 通道为可选能力 |
| 发布版本 | **系统 WebView 版**：APK 较小，复用手机系统 WebView；**内置 Gecko 版**：随包提供 GeckoView 158，不依赖系统 WebView |
| 内置 | DSH `0.2.1-rc.5` · PRoot；系统 WebView 或 GeckoView；Debian 与 Node.js 在首次运行时通过多镜像源检测在线获取，或离线导入 |
| 首次准备 | 按分步引导安装精简 Debian 与 Node.js，支持多镜像源检测、失败重试或离线导入；系统 WebView 版还会检测 provider 与启动前兼容能力 |
| **如何选择** | 系统 WebView 较新且工作正常时，可优先选择体积较小的系统 WebView 版；系统 WebView 较旧、白屏、受厂商定制影响，或希望固定渲染内核时，选择内置 Gecko 版。两个 APK 同包名、同签名，覆盖安装会保留 Debian、sandbox 与 user-data。 |

**[下载系统 WebView 版或内置 Gecko 版](https://github.com/WSK-build/DSHBox/releases/latest)** → 覆盖安装 → 启动应用 → 按引导获取运行环境（在线多镜像源，或沿用离线导入）→ 打开 DSH。
```

</details>

**依据 2 · 源码核查**：[app/build.gradle.kts:39-62](https://github.com/WSK-build/DSHBox/blob/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7/app/build.gradle.kts#L39-L62)

应用标识、版本和渲染 flavor

<details>
<summary>查看原文（24行）</summary>

```text
        applicationId = "com.dshbox.app"
        minSdk = 29
        targetSdk = 36
        // 多语言版本：联合国六语 + 语言选择器 + 硬编码清零 + 布局恒 LTR + i18n 门禁。
        versionCode = 10
        versionName = "1.5.1"
        buildConfigField("String", "DSH_GECKOVIEW_VERSION", "\"${libs.versions.geckoview.get()}\"")

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables.useSupportLibrary = true
    }

    flavorDimensions += "dshRenderer"
    productFlavors {
        create("systemWebView") {
            dimension = "dshRenderer"
        }
        create("gecko") {
            dimension = "dshRenderer"
            ndk {
                abiFilters += "arm64-v8a"
            }
        }
    }
```

</details>

**依据 3 · 源码核查**：[runtime-bundle/scripts/start_dsh.sh:28-46](https://github.com/WSK-build/DSHBox/blob/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7/runtime-bundle/scripts/start_dsh.sh#L28-L46)

启动路径与默认监听地址

<details>
<summary>查看原文（19行）</summary>

```text
export DSH_HOME="${DSH_HOME:-/root/projects/.dsh}"
mkdir -p "$DSH_HOME"
# DSH's workspace root follows the process cwd (dsh-base sandbox-policy row);
# starting in the persistent workspace makes the DSH workspace identical to
# the app's Files-tab workspace (/root/projects).
cd /root/projects

HOST="${DSH_HOST:-127.0.0.1}"
PORT="${DSH_PORT:-3080}"

DSH_BIN="/opt/dshapp/runtime/node_modules/@deepseek-ai/dsh/lib/bin.js"
NODE_BIN="${NODE_BIN:-/usr/local/bin/node}"

if [ -x "$NODE_BIN" ] && [ -f "$DSH_BIN" ]; then
    exec "$NODE_BIN" "$DSH_BIN" web --host "$HOST" --port "$PORT"
fi

# Fallback (should only be used in development; offline bundles have DSH installed).
exec npx --yes @deepseek-ai/dsh web --host "$HOST" --port "$PORT"
```

</details>

#### 缺口

- 未构建 APK 或在 ARM64 真机启动
  **影响**：变体白屏、账号和宿主兼容未验证
  **进一步探讨**：分别记录系统渲染版与 Gecko 的首启、登录、开会话及重启

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 硬链接兼容与手机控制各改变哪条边界？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

Android 适配在目标文件系统拒绝硬链接时拦截 Node Promise 版 link，只有指定错误回退 COPYFILE_EXCL，目标已存在仍报 EEXIST，随后尽力同步权限。其增量是无须修改调用方即可保留不覆盖发布的分支；回退会复制文件而失去 inode 共享，不能推出原子性或权限完全等价，同步与回调 API 也不受覆盖。另一条边界是手机执行权限。Pilot 的文件 relay 设计将执行、策略和审批归宿主，威胁模型明说 PRoot guest 共享宿主 uid，不能当额外安全隔离。项目 README 另列开发者 ADB/Root 通路并称其不经过 Pilot 逐项审批。试用本地会话不需要打开这些通道，也不把 Pilot 的审批约束移植到开发者模式。

#### 证据与依据

**依据 1 · 源码核查**：[plugin-manager/dshbox-plugins/assets/dshbox/link-shim.mjs:1-19](https://github.com/WSK-build/DSHBox/blob/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7/plugin-manager/dshbox-plugins/assets/dshbox/link-shim.mjs#L1-L19)

作用范围与触发错误

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * Android 硬链接兼容层，以 node --import 预加载。
 *
 * 替换 node:fs/promises.link：仅对 LINK_DENIED 中的平台拒绝错误
 * 回退到 COPYFILE_EXCL，保留源文件及目标已存在时的 EEXIST 语义。
 * 拷贝后尝试同步权限；权限同步失败不影响已完成的内容复制。
 *
 * 只处理异步 Promise 接口，不替换 fs.link 回调接口或 fs.linkSync。
 * syncBuiltinESMExports 用于同步内建模块的具名导出。
 */

import fsp from "node:fs/promises";
import { constants } from "node:fs";
import { syncBuiltinESMExports } from "node:module";

/** 平台拒绝硬链接时可能给出的错误码（各家 ROM/内核不一，全部纳入）。 */
const LINK_DENIED = new Set(["EACCES", "EPERM", "ENOTSUP", "ENOSYS"]);

const realLink = fsp.link.bind(fsp);
```

</details>

**依据 2 · 源码核查**：[plugin-manager/dshbox-plugins/assets/dshbox/link-shim.mjs:30-54](https://github.com/WSK-build/DSHBox/blob/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7/plugin-manager/dshbox-plugins/assets/dshbox/link-shim.mjs#L30-L54)

不覆盖复制、尽力权限和 ESM 替换

<details>
<summary>查看原文（25行）</summary>

```text
async function linkWithFallback(existing, newPath) {
  try {
    return await realLink(existing, newPath);
  } catch (error) {
    if (!error || !LINK_DENIED.has(error.code)) throw error;

    // EXCL 保留 link() 的「不覆盖」语义：目标已存在时抛 EEXIST，
    // 与上游 catch 分支（校验目标完整性后继续）严格对应。
    await fsp.copyFile(existing, newPath, constants.COPYFILE_EXCL);

    // link() 共享 inode 因而天然继承源文件权限；拷贝是新建文件，
    // 默认权限受 umask 影响，这里从源文件补齐（尽力而为，不因此让发布失败）。
    try {
      const st = await fsp.stat(existing);
      await fsp.chmod(newPath, st.mode);
    } catch {
      /* 权限补齐失败不影响内容正确性 */
    }
  }
}

fsp.link = linkWithFallback;
// 让已经 `import { link } from "node:fs/promises"` 的模块看到替换后的实现
// （ESM 内建具名导入是活绑定，必须显式重同步）。
syncBuiltinESMExports();
```

</details>

**依据 3 · 作者声明**：[pilot/interlock-relay-core/SECURITY.md:27-41](https://github.com/WSK-build/DSHBox/blob/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7/pilot/interlock-relay-core/SECURITY.md#L27-L41)

文档的 capability relay 与宿主决策

<details>
<summary>查看原文（15行）</summary>

```text
## What this library is, for threat-model purposes

Interlock Relay is a **capability relay**. It exposes a host app's device capabilities to a sandboxed
agent over a single file-based channel, and routes every call through an approval interlock that the
host can gate, observe and audit. The host keeps control of UI, dialogs, policy and execution.

Reports are especially interesting when they show any of the following.

- A call that reaches an execution backend **without passing the interlock**: a gate bypass, a queue
  arbitration race, an answer applied to the wrong request id, or a parked request resumed twice.
- An argument that escapes a capability's declared shape: path traversal through an output path,
  argument injection into a shell verb, or a self-targeted destructive call that gets past the
  "this target is the relay itself" guard.
- Anything that lets the guest side change a **host-side verdict** (approval state, access tier, shell
  opt-in, audit record) instead of only its own copy of the advisory files.
```

</details>

**依据 4 · 作者声明**：[pilot/interlock-relay-core/SECURITY.md:46-58](https://github.com/WSK-build/DSHBox/blob/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7/pilot/interlock-relay-core/SECURITY.md#L46-L58)

同 uid 边界和默认确认行为

<details>
<summary>查看原文（13行）</summary>

```text
## By design, not vulnerabilities

- **The sandbox is not a security boundary against the host.** The guest runs under the host's uid, and
  the guest-side files this library materialises — the entry CLI, the capability list, the usage notes
  — are advisory. The guest can rewrite them, and by construction that cannot change any host-side
  decision.
- **The host owns policy.** Mount point, naming, wording, notification channel ids, which capabilities
  are usable, and what the approval prompt says are all injected by the host. A host that configures a
  permissive path policy, or supplies its own execution backend, is making its own choice.
- **Unattended confirmation fails closed.** With the default surface (`NoSurfaces`) there is nowhere to
  ask, so a call that requires confirmation fails with `E_GATE_NO_FOREGROUND` rather than proceeding.
- **Device-mutating routes ask first.** Shell verbs are individually opt-in, and coordinate injection is
  reachable only by naming it explicitly.
```

</details>

**依据 5 · 作者声明**：[README.md:96-108](https://github.com/WSK-build/DSHBox/blob/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7/README.md#L96-L108)

作者区分开发者模式与 Pilot 审批

<details>
<summary>查看原文（13行）</summary>

```text
### 开发者模式（v1.5.1 新增）

从 Pilot 进入独立的“开发者模式”面板。该面板提供的是面向高级用户的完整能力，不属于 Pilot 手机助手的受控审批体系：

| 通道 | 能力与边界 |
|---|---|
| ADB | 开关开启时把完整 ADB 客户端及依赖挂载到 Debian 沙箱，关闭时移出；支持本机服务、无线调试配对、外部设备调试、端口与自定义密钥。 |
| Root | 使用设备现有的 `su` 实现，在 guest 内提供 `android-root` CLI；支持访问码、失败锁定、Unix/TCP 传输与权限预检。 |

- **与手机助手隔离**：ADB / Root 不经过 Pilot 的“禁止 / 询问审批 / 完全访问”逐项审批、权限分级或动作拦截。用户开启开关后自行决定用途，并对自己执行的调试、系统或 Root 操作及其后果负责；原手机助手通道继续保留受控权限和审批保护。
- **与 Shizuku 隔离**：开发者模式 ADB 不依赖 Shizuku，可作为部分 Shizuku 兼容性或未解决问题的替代路径；两者的开关、密钥、server 配置和生命周期独立。
- **外部设备调试**：该 ADB 不仅能连接手机本机服务，也可通过网络连接其他设备。ADB 通道关闭后，相关命令、server 入口和挂载均从沙箱撤除。
- **使用前须知**：无线调试要求设备支持该能力且网络可互通；Root 要求设备已有可用 `su`，并可能受 Magisk、KernelSU、APatch、隐藏策略和厂商 ROM 差异影响。
```

</details>

#### 缺口

- 未对 Android ROM 文件系统、并发发布及手机控制做验证
  **影响**：不能判断断电恢复、权限实效和误授权
  **进一步探讨**：用无敏感数据工作区验证重复发布与中断恢复，审批链另行在测试机测试

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么条件下值得先在测试机试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

有兼容 ARM64 Android、可取得该版 APK 和运行层，且经常离开工作站需要继续一段本地会话的用户，先在测试设备准备一个非敏感工作区。按作者指引，系统 WebView 较新可先用 system 变体，遇能力阻断可评估 Gecko；覆盖安装保留数据是作者声明，不能代替备份。首次成本是安装包、运行层传输、存储与首启；持续成本有移动网络、充电、电量、模型服务与版本维护；失败恢复要回查会话和文件是否可读，再考虑导出回远端。运行文档有 current/new 和校验设计，不能从设计推断更新事务在所有中断点成功。以一次可恢复的会话和完整工作区为合格结果，人工时间和流量、电量及服务费分开记。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-33](https://github.com/WSK-build/DSHBox/blob/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7/README.md#L24-L33)

设备、两变体和恢复路径自述

<details>
<summary>查看原文（10行）</summary>

```text
| 项目 | 说明 |
|---|---|
| 系统要求 | Android 10+ · ARM64 |
| 权限 | 日常使用无需 Root · 无需 Termux；开发者模式中的 Root 通道为可选能力 |
| 发布版本 | **系统 WebView 版**：APK 较小，复用手机系统 WebView；**内置 Gecko 版**：随包提供 GeckoView 158，不依赖系统 WebView |
| 内置 | DSH `0.2.1-rc.5` · PRoot；系统 WebView 或 GeckoView；Debian 与 Node.js 在首次运行时通过多镜像源检测在线获取，或离线导入 |
| 首次准备 | 按分步引导安装精简 Debian 与 Node.js，支持多镜像源检测、失败重试或离线导入；系统 WebView 版还会检测 provider 与启动前兼容能力 |
| **如何选择** | 系统 WebView 较新且工作正常时，可优先选择体积较小的系统 WebView 版；系统 WebView 较旧、白屏、受厂商定制影响，或希望固定渲染内核时，选择内置 Gecko 版。两个 APK 同包名、同签名，覆盖安装会保留 Debian、sandbox 与 user-data。 |

**[下载系统 WebView 版或内置 Gecko 版](https://github.com/WSK-build/DSHBox/releases/latest)** → 覆盖安装 → 启动应用 → 按引导获取运行环境（在线多镜像源，或沿用离线导入）→ 打开 DSH。
```

</details>

**依据 2 · 作者声明**：[runtime-bundle/README.md:25-38](https://github.com/WSK-build/DSHBox/blob/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7/runtime-bundle/README.md#L25-L38)

运行层校验和与切换设计

<details>
<summary>查看原文（14行）</summary>

```text
## 设计约束

- 双 Runtime：`runtime-current/` 与 `runtime-new/`，更新成功才切换。
- 每个 Bundle 必须有 SHA-256、版本、架构、构建日期、来源。
- 永不删除 `user-data/` 下的 Workspace。
- DSH 只监听 `127.0.0.1`。
- PRoot 不是安全容器，最终边界是 Android App Sandbox。

## 使用

1. 将构建好的 `debian-arm64-rootfs.tar.gz` 放入本目录或 App assets。
2. 填写 `bundle.yaml` 的 `sha256`、`version`、`built_at`、`source`。
3. Android 侧调用 `SandboxManager` 解包到 `runtime-new/` 并校验。
4. 启动顺序：`init_sandbox.sh` → `start_sandbox.sh` → Debian 内 `start_dsh.sh` → `healthcheck.sh`。
```

</details>

**依据 3 · 源码核查**：[app/build.gradle.kts:39-62](https://github.com/WSK-build/DSHBox/blob/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7/app/build.gradle.kts#L39-L62)

构建层兼容条件

<details>
<summary>查看原文（24行）</summary>

```text
        applicationId = "com.dshbox.app"
        minSdk = 29
        targetSdk = 36
        // 多语言版本：联合国六语 + 语言选择器 + 硬编码清零 + 布局恒 LTR + i18n 门禁。
        versionCode = 10
        versionName = "1.5.1"
        buildConfigField("String", "DSH_GECKOVIEW_VERSION", "\"${libs.versions.geckoview.get()}\"")

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables.useSupportLibrary = true
    }

    flavorDimensions += "dshRenderer"
    productFlavors {
        create("systemWebView") {
            dimension = "dshRenderer"
        }
        create("gecko") {
            dimension = "dshRenderer"
            ndk {
                abiFilters += "arm64-v8a"
            }
        }
    }
```

</details>

**依据 4 · 源码核查**：[runtime-bundle/scripts/start_dsh.sh:28-46](https://github.com/WSK-build/DSHBox/blob/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7/runtime-bundle/scripts/start_dsh.sh#L28-L46)

本地或 npx 启动的选择

<details>
<summary>查看原文（19行）</summary>

```text
export DSH_HOME="${DSH_HOME:-/root/projects/.dsh}"
mkdir -p "$DSH_HOME"
# DSH's workspace root follows the process cwd (dsh-base sandbox-policy row);
# starting in the persistent workspace makes the DSH workspace identical to
# the app's Files-tab workspace (/root/projects).
cd /root/projects

HOST="${DSH_HOST:-127.0.0.1}"
PORT="${DSH_PORT:-3080}"

DSH_BIN="/opt/dshapp/runtime/node_modules/@deepseek-ai/dsh/lib/bin.js"
NODE_BIN="${NODE_BIN:-/usr/local/bin/node}"

if [ -x "$NODE_BIN" ] && [ -f "$DSH_BIN" ]; then
    exec "$NODE_BIN" "$DSH_BIN" web --host "$HOST" --port "$PORT"
fi

# Fallback (should only be used in development; offline bundles have DSH installed).
exec npx --yes @deepseek-ai/dsh web --host "$HOST" --port "$PORT"
```

</details>

#### 缺口

- 没有实测包大小、首启、断网或恢复
  **影响**：无法判移动端成本和迁移成功率
  **进一步探讨**：用测试工作区记录首启传输、两次重启、迁移前后哈希及恢复时间

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样判断本机宿主是否值得替代远端工作站？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是在远端工作站暂不可达但手机仍能访问同一模型服务时，本地 DSH 能减少因远程宿主不可达造成的会话中断。固定同一个测试项目、模型服务和会话操作，比较手机本地启动与远端 Web 两组，分别断开远端工作站连接并恢复，记录首个可见响应、任务是否完成、会话和工作文件是否可再次打开、耗电与人工恢复时间。若恢复后的文件或会话不完整，或正常远端网络下额外成本超过预设阈值，保留远端工作站方案。不会据作者声称的本机运行推断离线推理。

#### 证据与依据

**依据 1 · 源码核查**：[runtime-bundle/scripts/start_dsh.sh:28-46](https://github.com/WSK-build/DSHBox/blob/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7/runtime-bundle/scripts/start_dsh.sh#L28-L46)

本地地址和启动方式支持测试前提

<details>
<summary>查看原文（19行）</summary>

```text
export DSH_HOME="${DSH_HOME:-/root/projects/.dsh}"
mkdir -p "$DSH_HOME"
# DSH's workspace root follows the process cwd (dsh-base sandbox-policy row);
# starting in the persistent workspace makes the DSH workspace identical to
# the app's Files-tab workspace (/root/projects).
cd /root/projects

HOST="${DSH_HOST:-127.0.0.1}"
PORT="${DSH_PORT:-3080}"

DSH_BIN="/opt/dshapp/runtime/node_modules/@deepseek-ai/dsh/lib/bin.js"
NODE_BIN="${NODE_BIN:-/usr/local/bin/node}"

if [ -x "$NODE_BIN" ] && [ -f "$DSH_BIN" ]; then
    exec "$NODE_BIN" "$DSH_BIN" web --host "$HOST" --port "$PORT"
fi

# Fallback (should only be used in development; offline bundles have DSH installed).
exec npx --yes @deepseek-ai/dsh web --host "$HOST" --port "$PORT"
```

</details>

**依据 2 · 源码核查**：[plugin-manager/dshbox-plugins/assets/dshbox/link-shim.mjs:30-48](https://github.com/WSK-build/DSHBox/blob/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7/plugin-manager/dshbox-plugins/assets/dshbox/link-shim.mjs#L30-L48)

发布文件差异是应监测的完整性边界

<details>
<summary>查看原文（19行）</summary>

```text
async function linkWithFallback(existing, newPath) {
  try {
    return await realLink(existing, newPath);
  } catch (error) {
    if (!error || !LINK_DENIED.has(error.code)) throw error;

    // EXCL 保留 link() 的「不覆盖」语义：目标已存在时抛 EEXIST，
    // 与上游 catch 分支（校验目标完整性后继续）严格对应。
    await fsp.copyFile(existing, newPath, constants.COPYFILE_EXCL);

    // link() 共享 inode 因而天然继承源文件权限；拷贝是新建文件，
    // 默认权限受 umask 影响，这里从源文件补齐（尽力而为，不因此让发布失败）。
    try {
      const st = await fsp.stat(existing);
      await fsp.chmod(newPath, st.mode);
    } catch {
      /* 权限补齐失败不影响内容正确性 */
    }
  }
```

</details>

**依据 3 · 作者声明**：[README.md:53-63](https://github.com/WSK-build/DSHBox/blob/e9ec1e873ba8df2d9ead87f207e40350a46bc5e7/README.md#L53-L63)

本地工作区与兼容层的作者说明

<details>
<summary>查看原文（11行）</summary>

```text
### DeepSeek Harness 全内嵌与双渲染（v1.5.1）

- DSH `0.2.1-rc.5` 随 APK 内置，层内容保持上游纯净；首启按**版本仲裁**装配到 `runtime-current/dsh`，换层时旧层单份备份到 `previous/dsh`，不触碰用户数据。
- **系统 WebView 版 / 内置 Gecko 版**：两个发布变体共用唯一 DSH 页面、宿主导航、文件交付、诊断与日志实现，差异集中在 Renderer Adapter；两个 APK 同为 `com.dshbox.app`、同一签名，可覆盖切换并保留 `filesDir`。
- **全屏 DSH 工作区**：DSH 标签页在本地地址上自动解析 launchToken、使用移动 UA、处理键盘与视觉视口并支持双指缩放；可拖动悬浮球继续提供刷新和首页、文件、终端、Browser 快捷切换，首页保留“浏览器”和“更 多”入口。
- **系统 WebView 兼容**：在 DSH 主脚本执行前补齐启动期所需 API，并通过单次 document-start 注入进入页面；支持 document-start 的内核继续复用系统 WebView，不支持的内核会明确阻止导航并提示升级。
- **内置 GeckoView 158**：完全使用随包渲染内核，不依赖系统 WebView，不静默回退；处理 DSH 账号 popup、外链、401、文件选择、页面状态、右侧栏和键盘视口等差异。
- **DSH 访问设置**：首页 DSH 卡片可进入全屏访问设置页，查看并复制带 token 的完整地址、设置外部打开方式、复制连接信息并查看运行时间。
- **运行期硬链接兼容垫片**：安卓应用数据分区（FBE/FUSE）拒绝硬链接，而 DSH 使用 `link()` 作为“不覆盖发布文件”的原语，会导致会话持久化、文件工具和附件发布失败。App 启动时通过 `node --import` 替换 `node:fs/promises.link`；遇到平台拒绝时退化为保留不覆盖语义的内容拷贝。
- **DSH 源码零修改**：兼容逻辑位于 App、渲染适配层、内置扩展和运行环境接线；随包 DSH 层保持上游文件与业务逻辑不变。
- 前台服务通知带「启动 / 重启 / 关闭」快捷操作；页面刷新和重新认证统一使用当前 launchToken，DSH 重启或健康循环换 token 后不会继续请求旧地址。
```

</details>

#### 缺口

- 未运行配对测试
  **影响**：本地宿主的净收益未知
  **进一步探讨**：先固定同一模型可用性，再按中断与恢复场景记录两组结果

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
