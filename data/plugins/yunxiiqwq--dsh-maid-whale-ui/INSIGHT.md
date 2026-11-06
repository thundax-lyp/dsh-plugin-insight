# 鲸鱼女仆 UI 根工程资源

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1678a16](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/tree/1678a1640a21705ca5f3520e2a81892e4616bd33)

<!-- BEGIN META -->
[![GitHub ★ 48](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=48&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yunxiiQwQ/dsh-maid-whale-UI)
<!-- END META -->

> **功能**：提供鲸鱼主题项目的中英文安装/开发文档，以及委派子插件构建、测试和检查的根命令。

> **亮点**：中英导航与维护门禁索引；子包功能不重复计为根运行贡献。见 [Q03](#research-q03)。

> **主要限制**：private根没有DSH入口；旧EXE hash检查后重建，脚本未生成新SHA或证明发行源码一致，CI非Host验收。见 [Q02](#research-q02)。

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
  - [Q01 · 仓库根能直接装为主题吗，它实际提供什么入口？](#detail-section-11)
  - [Q02 · 根CI究竟验证什么，绿灯是否绑定随包EXE和实际Host？](#detail-section-12)
  - [Q03 · 根资源相比直接看子包的增量和成本是什么？](#detail-section-13)
  - [Q04 · 作为工程资源如何使用，值得验证的改进是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用者定位正确安装包，维护者查CI/构建路径；根本身不是运行主题。见 [Q01](#research-q01)。

直接读maid-whale-webui README、package和脚本，在子目录执行相同维护命令。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 安装导航 | 找正确子包/profile | 根不提供DSH加载入口 |
| 委派命令 | 统一维护调用 | 真实副作用在子工具 |
| CI定义 | 检查构建与包清单 | 未执行/非Host验收 |
| 来源说明 | 上游/素材归因 | 不自动授第三方权利 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Git/文件阅读器 | 只读所需 | 固定版本导航 | 无需运行目标 |
| pnpm11.21.0/Node22.19+ | 维护所需 | 委派子包 | 根无独立runtime |
| maid-whale-webui子包 | 安装/命令实际对象 | lib/DSH bundle | 根private不可替代 |
| Linux/Windows CI与Python3.11 | 门禁环境 | 测试/构建helper | 声明不等本次运行 |
| PyInstaller/PySide6 | EXE构建所需 | onefile/Qt smoke | 失败不产可信发行 |
| 发行artifact/签名/Host验收 | 生产信任另需 | 确认来源与实际效果 | 本轮未验证 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定位 | 读root package/README | private0.1.0非插件 |
| 转包 | 核子manifest0.1.1 | 选web/desktop子路径 |
| 维护审查 | 读CI/委派脚本 | 不把声明当执行 |
| 验发行 | 另核固定artifact/Hash/run | 不明保持只读 |
| 退出 | 停阅读/清克隆按需 | 子插件卸载另按profile |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次阅读 | 克隆磁盘/流量未知 | 定位版本/profile | 无需安装 |
| 主动维护 | CI/模型外构建资源未知 | 两平台依赖/产物同步 | 会写lib/EXE/.build |
| 失败恢复 | 重建资源未知 | 子日志/Git差异定位 | 根无统一回滚 |
| 退出 | 仓库/已装子包另计 | 停阅读或按profile卸载 | 删仓库非卸载 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 根导航 | 明确子目录 | 初学错装减少 |
| 根命令 | 四条真实委派 | 执行成功 |
| CI门禁 | 两平台检查脚本 | 当前远端绿灯 |
| helper smoke | READY/产图/退出判据 | 图片语义/Host完整效果 |
| 发行可信 | 旧EXE同仓hash比对 | 重建等价/签名/已发布包 |

> **思考**：private根没有DSH入口；旧EXE hash检查后重建，脚本未生成新SHA或证明发行源码一致，CI非Host验收。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：中英导航与维护门禁索引；子包功能不重复计为根运行贡献。见 [Q03](#research-q03)。

根导航与固定CI actions可追溯；hash校验、重建产物与Host验收须分别绑定。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

private根没有DSH入口；旧EXE hash检查后重建，脚本未生成新SHA或证明发行源码一致，CI非Host验收。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

作为只读工程资源先定位子包/profile与发行证据，不把根装为主题。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根manifest/导航/CI及委派helper构建/清单/视觉smoke源码已核；未运行任何目标或远端CI。

- 已检查：作者 README、包清单、源码路径 .github/workflows/ci.yml、README.md、maid-whale-webui/NOTICE、maid-whale-webui/package.json、maid-whale-webui/scripts/build-helper.ps1、maid-whale-webui/scripts/check-package-contents.mjs、maid-whale-webui/scripts/test-packaged-helper.mjs、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：独立核根private package/中英导航/CI与直接委派子脚本；子manifest仅证明路由，未复用子组件运行结论，未运行目标/远端CI/EXE。
- 下一步：五静态发行/安装情形对照，未执行。

**分析版本**

- **仓库**：[yunxiiQwQ/dsh-maid-whale-UI](https://github.com/yunxiiQwQ/dsh-maid-whale-UI)
- **版本号**：0.1.0（[固定提交 1678a16](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/tree/1678a1640a21705ca5f3520e2a81892e4616bd33)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

复用manifest/CI建立单一安装与发行映射，五静态情形证伪；发布页足够则仅链接。见 [Q04](#research-q04)。

五静态发行/安装情形对照，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 7 | 4576 | 4356 | 197 | — |
| .md | source | 4 | 564 | — | — | 4762 |
| .mjs | source | 6 | 260 | 241 | 4 | — |
| .ts | source | 14 | 1921 | 1680 | 119 | — |
| .ts | test | 20 | 2683 | 2383 | 37 | — |
| .tsx | test | 1 | 107 | 95 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/issues?q=is%3Aissue+created%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：根private工程入口与子插件实际能力/发行门禁如何区分并追溯？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 仓库根能直接装为主题吗，它实际提供什么入口？

**研究主题**：场景与需求、功能与机制

#### 完整回答

本条目是private工程资源入口，面向查安装路径、来源和维护命令的主题使用者/维护者；不是额外一个可装DSH主题。根package名dsh-maid-whale-webui-workspace0.1.0，private:true，没有main/exports/dsh.bundle或client注册，也没有自己的Host apply。四条build/test/typecheck/lint都只是pnpm -C maid-whale-webui委派，对应根动作仍在子目录执行。

README直接说明根提供文档和命令入口、可安装插件在maid-whale-webui；安装示例cd根后add ./maid-whale-webui，web/desktop profile各自管理。子package才有@yunxii/...0.1.1、lib/index.js/client.js与cordis.patch bundle；本题独立核这些manifest，只用于验证根的路由，不把子主题/桌宠能力复制成根组件贡献。根description沿产品整体描述，但不能由名称/宣传把根当可加载插件。

根npm scripts不会自动安装/启用DSH，也不会因为读取README而启动helper；若用户主动run build则执行子tsdown，test执行vitest，typecheck/lint执行子工具。所有这些都不是本次执行结果；根无独立用户账号、数据存储、模型调用或业务Agent循环，运行副作用归具体子命令。基线是直接读子README与进入子目录执行相同命令，根入口的成功是把人带到正确包/版本/平台。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-19](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/package.json#L1-L19)

private根与四个委派命令。

<details>
<summary>查看原文（19行）</summary>

```text
{
  "name": "dsh-maid-whale-webui-workspace",
  "version": "0.1.0",
  "private": true,
  "description": "Whale-maid theme for DeepSeek Harness desktop and Web UI with a native Windows companion",
  "license": "BSD-3-Clause",
  "type": "module",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yunxiiQwQ/dsh-maid-whale-UI.git"
  },
  "packageManager": "pnpm@11.21.0",
  "scripts": {
    "build": "pnpm -C maid-whale-webui build",
    "test": "pnpm -C maid-whale-webui test",
    "typecheck": "pnpm -C maid-whale-webui typecheck",
    "lint": "pnpm -C maid-whale-webui lint"
  }
}
```

</details>

**依据 2 · 源码核查**：[README.md:106-128](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/README.md#L106-L128)

根职责与子目录开发流程。

<details>
<summary>查看原文（23行）</summary>

````text
仓库根目录提供文档和命令入口，可安装的插件位于 `maid-whale-webui/`：

| 路径 | 用途 |
| --- | --- |
| `src/client/` | 主题样式、边框、装饰和桌宠设置 |
| `src/index.ts`、`src/host/` | Host 入口、DSH 事件和桌宠进程桥接 |
| `runtime/` | Python/Qt 桌宠与 Windows 可执行文件 |
| `assets/`、`preview/` | 原始美术素材与界面预览 |
| `build/`、`scripts/` | 打包配置、素材嵌入和发布检查 |
| `tests/`、`runtime/tests/` | 客户端、Host 和 Python 测试 |
| `lib/` | 随仓库提交、供 DSH 加载的客户端和 Host 构建产物 |

开发需要 Node.js 22.19+ 和 pnpm 11.21.0。从仓库根目录执行：

```bash
cd maid-whale-webui
pnpm install --frozen-lockfile
pnpm art:embed:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm pack:check
````

</details>

**依据 3 · 源码核查**：[README.md:37-60](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/README.md#L37-L60)

安装明确指子目录/profile。

<details>
<summary>查看原文（24行）</summary>

````text
### 桌面端安装

完全退出 DSH（包括托盘进程），在可使用 DSH CLI 的终端中执行：

```powershell
git clone https://github.com/yunxiiQwQ/dsh-maid-whale-UI.git
cd dsh-maid-whale-UI
dsh plugin --profile desktop add ./maid-whale-webui
```

随后从桌面快捷方式打开 DeepSeek Harness。桌面端和 Web 端使用独立的 profile。桌宠菜单中的 **打开 DSH** 会通过 `dsh://open` 唤起桌面窗口，无需配置固定的本地端口。

### Web 端安装

```powershell
# 1. 完全退出 DSH（包括托盘进程）
# 2. 克隆仓库并添加插件
git clone https://github.com/yunxiiQwQ/dsh-maid-whale-UI.git
cd dsh-maid-whale-UI
dsh plugin --profile web add ./maid-whale-webui

# 3. 启动 DSH Web UI
dsh --profile web
```
````

</details>

**依据 4 · 源码核查**：[maid-whale-webui/package.json:1-21](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/package.json#L1-L21)

可安装子包才有入口与bundle。

<details>
<summary>查看原文（21行）</summary>

```text
{
  "name": "@yunxii/dsh-client-ui-skin-maid-whale-webui",
  "description": "Whale-maid theme for DeepSeek Harness desktop and Web UI with a native Windows companion",
  "version": "0.1.1",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./skin.json": "./skin.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
  },
```

</details>

**依据 5 · 源码核查**：[maid-whale-webui/package.json:23-39](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/package.json#L23-L39)

被委派脚本实际工具。

<details>
<summary>查看原文（17行）</summary>

```text
    "art:embed": "node scripts/embed-background.mjs && node scripts/embed-ornaments.mjs && node scripts/embed-frames.mjs",
    "art:embed:background": "node scripts/embed-background.mjs",
    "art:embed:ornaments": "node scripts/embed-ornaments.mjs",
    "art:embed:frames": "node scripts/embed-frames.mjs",
    "art:embed:check": "node scripts/check-embedded-art.mjs",
    "build": "tsdown",
    "watch": "tsdown --watch",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "typecheck": "tsc -p tsconfig.vitest.json --noEmit",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "pack:check": "node scripts/check-package-contents.mjs",
    "build:helper:windows": "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build-helper.ps1",
    "test:helper:packaged": "node scripts/test-packaged-helper.mjs",
    "test:python": "py -3 -m unittest discover -s runtime/tests -t ."
  },
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 根CI究竟验证什么，绿灯是否绑定随包EXE和实际Host？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

CI在push main与PR触发，contents:read，Linux和Windows两job均working-directory=maid-whale-webui。Linux安装锁依赖、检查嵌入美术/lint/typecheck/tests coverage/build/pack清单，再装Python依赖跑runtime单测；Windows先把仓库现有EXE hash与同仓.sha256对比，再装build依赖并执行helper构建。actions固定完整SHA有助依赖定位，但本次未取远端CI运行结果，不写green/通过。

实际build-helper.ps1选择指定env或项目venv/Python，先核PyInstaller+PySide6可import，再onefile构建EXE到runtime/bin/win32-x64，失败抛错，调用test-packaged-helper.mjs。该smoke确实spawn EXE而非只读schema，等READY，发WORKING/tasks，等>1024字节PNG，再SHUTDOWN并要求5秒内code0。成功只说明该测试构建能启动/产图/退出，不检图片语义、全部动作、多Session/DSH Host接线或没有网络；本次只读脚本没运行。

Windows hash检查发生重建前，验证旧EXE与旧校验文件相符；构建脚本尾只输出EXE路径，未生成/更新sha256，也未把重建产物与checked-in EXE逐字对照。README称Windows构建会生成EXE和SHA文件，源码链仅支持前者加旧hash检查，不沿用后者为已完成能力。包清单检查用pnpm pack dry-run对manifest.files精确集合，能抓缺项但不证明内容可信、源码与二进制一致或发布包就是这个工作区。

因此根CI是维护门禁声明，不是DSH安装/卸载/任务效果/发行签名证明。无自动publish、签名或artifact绑定步骤；仓库hash可与EXE一起被替换，不能当独立供应链背书。调用构建/测试会生成lib/EXE/.build与测试资源，失败需保留输出定位，不能把这些命令看成无副作用的文档预览。

#### 证据与依据

**依据 1 · 源码核查**：[.github/workflows/ci.yml:1-39](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/.github/workflows/ci.yml#L1-L39)

Linux真实job与权限/范围。

<details>
<summary>查看原文（39行）</summary>

```text
name: CI

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  verify:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: maid-whale-webui
    steps:
      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4
      - uses: pnpm/action-setup@f40ffcd9367d9f12939873eb1018b921a783ffaa # v4
        with:
          version: 11.21.0
      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4
        with:
          node-version: 22
          cache: pnpm
          cache-dependency-path: maid-whale-webui/pnpm-lock.yaml
      - run: pnpm install --frozen-lockfile
      - run: pnpm art:embed:check
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test:coverage
      - run: pnpm build
      - run: pnpm pack:check
      - uses: actions/setup-python@a26af69be951a213d495a4c3e4e4022e16d87065 # v5
        with:
          python-version: "3.11"
      - run: python -m pip install -r requirements.txt -r requirements-test.txt
      - run: python -m coverage run --rcfile=.coveragerc -m unittest discover -s runtime/tests -t .
      - run: python -m coverage report --rcfile=.coveragerc
```

</details>

**依据 2 · 源码核查**：[.github/workflows/ci.yml:41-67](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/.github/workflows/ci.yml#L41-L67)

Windows先hash后build。

<details>
<summary>查看原文（27行）</summary>

```text
  windows-helper:
    runs-on: windows-latest
    defaults:
      run:
        working-directory: maid-whale-webui
    steps:
      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4
      - uses: pnpm/action-setup@f40ffcd9367d9f12939873eb1018b921a783ffaa # v4
        with:
          version: 11.21.0
      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4
        with:
          node-version: 22
          cache: pnpm
          cache-dependency-path: maid-whale-webui/pnpm-lock.yaml
      - uses: actions/setup-python@a26af69be951a213d495a4c3e4e4022e16d87065 # v5
        with:
          python-version: "3.11"
      - run: pnpm install --frozen-lockfile
      - name: Verify checked-in helper hash
        shell: pwsh
        run: |
          $expected = (Get-Content runtime/bin/win32-x64/dsw-drool-helper.exe.sha256).Split()[0]
          $actual = (Get-FileHash -Algorithm SHA256 runtime/bin/win32-x64/dsw-drool-helper.exe).Hash.ToLowerInvariant()
          if ($actual -ne $expected) { throw "helper hash mismatch: $actual" }
      - run: python -m pip install -r requirements-build.txt
      - run: pnpm build:helper:windows
```

</details>

**依据 3 · 源码核查**：[maid-whale-webui/scripts/build-helper.ps1:1-47](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/scripts/build-helper.ps1#L1-L47)

实际构建/失败/视觉smoke调用，未生成hash。

<details>
<summary>查看原文（47行）</summary>

```text
param(
  [string]$Python = $env:DSH_DAFEIYU_BUILD_PYTHON
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$entry = Join-Path $projectRoot 'runtime\helper.py'
$assets = Join-Path $projectRoot 'assets'
$output = Join-Path $projectRoot 'runtime\bin\win32-x64'
$work = Join-Path $projectRoot '.build\helper'
$projectPython = Join-Path $projectRoot '.build\python-env\Scripts\python.exe'

if (-not $Python) {
  $Python = if (Test-Path -LiteralPath $projectPython) { $projectPython } else { 'python' }
}

New-Item -ItemType Directory -Force -Path $output, $work | Out-Null

& $Python -c "import PyInstaller, PySide6; print(f'PyInstaller {PyInstaller.__version__}; PySide6 {PySide6.__version__}')"
if ($LASTEXITCODE -ne 0) {
  throw "The selected Python cannot import both PyInstaller and PySide6. Install requirements into the same interpreter or set DSH_DAFEIYU_BUILD_PYTHON. Selected: $Python"
}

& $Python -m PyInstaller `
  --noconfirm `
  --clean `
  --onefile `
  --console `
  --name dsw-drool-helper `
  --distpath $output `
  --workpath $work `
  --specpath $work `
  --add-data "$assets;assets" `
  --paths (Join-Path $projectRoot 'runtime') `
  $entry

if ($LASTEXITCODE -ne 0) {
  throw "PyInstaller failed with exit code $LASTEXITCODE"
}

$executable = Join-Path $output 'dsw-drool-helper.exe'
& node (Join-Path $PSScriptRoot 'test-packaged-helper.mjs') --executable $executable
if ($LASTEXITCODE -ne 0) {
  throw "Packaged helper visual smoke test failed with exit code $LASTEXITCODE"
}

Write-Output $executable
```

</details>

**依据 4 · 源码核查**：[maid-whale-webui/scripts/test-packaged-helper.mjs:18-25](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/scripts/test-packaged-helper.mjs#L18-L25)

实际spawn EXE。

```text
await stat(executable)
await mkdir(dirname(snapshot), { recursive: true })
await rm(snapshot, { force: true })

const child = spawn(executable, ['--snapshot', snapshot], {
  stdio: ['pipe', 'pipe', 'pipe'],
  windowsHide: true,
})
```

**依据 5 · 源码核查**：[maid-whale-webui/scripts/test-packaged-helper.mjs:53-103](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/scripts/test-packaged-helper.mjs#L53-L103)

READY/PNG/SHUTDOWN判据。

<details>
<summary>查看原文（51行）</summary>

```text
try {
  await waitUntil(() => standardOutput.includes('"kind": "ready"'), 'ready handshake')
  child.stdin.write(
    `${JSON.stringify({
      protocolVersion: 1,
      kind: 'state',
      timestamp: Date.now(),
      state: 'WORKING',
      activity: 'testing',
      message: 'Packaged visual smoke test',
      detail: 'Qt renderer and assets are available',
    })}\n`,
  )
  child.stdin.write(
    `${JSON.stringify({
      protocolVersion: 1,
      kind: 'tasks',
      timestamp: Date.now(),
      tasks: [
        { sessionId: 'one', state: 'WORKING', project: 'dsh-dafeiyu', task: 'Windows package validation' },
        { sessionId: 'two', state: 'WAITING', project: 'WSL2 interop', task: 'User confirmation' },
      ],
    })}\n`,
  )
  await waitUntil(async () => {
    try {
      return (await stat(snapshot)).size > 1024
    } catch {
      return false
    }
  }, 'visual snapshot')
  child.stdin.end(
    `${JSON.stringify({
      protocolVersion: 1,
      kind: 'shutdown',
      timestamp: Date.now(),
    })}\n`,
  )
  const result = await Promise.race([exit, delay(5_000).then(() => ({ timeout: true }))])
  if (result.timeout) {
    child.kill()
    throw new Error('helper did not exit after shutdown')
  }
  if (result.code !== 0) {
    throw new Error(`helper exited with code ${result.code}. ${standardError}`)
  }
  console.log(`Packaged helper visual smoke test passed: ${snapshot}`)
} catch (error) {
  if (child.exitCode === null) child.kill()
  throw error
}
```

</details>

**依据 6 · 源码核查**：[maid-whale-webui/scripts/check-package-contents.mjs:6-32](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/scripts/check-package-contents.mjs#L6-L32)

dry-run清单集合而非真实性。

<details>
<summary>查看原文（27行）</summary>

```text
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pnpmScript = process.env.npm_execpath
const command = pnpmScript ? process.execPath : process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const args = pnpmScript ? [pnpmScript, 'pack', '--dry-run', '--json'] : ['pack', '--dry-run', '--json']
const result = spawnSync(command, args, {
  cwd: packageRoot,
  encoding: 'utf8',
  shell: !pnpmScript && process.platform === 'win32',
})
if (result.status !== 0) {
  process.stderr.write(result.stderr || result.stdout)
  process.exit(result.status ?? 1)
}

const output = result.stdout.trim()
const parsed = JSON.parse(output)
const pack = Array.isArray(parsed) ? parsed[0] : parsed
const paths = (pack?.files ?? []).map((file) => String(file.path).replace(/^package\//, '')).sort()
const manifest = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8'))
const expected = ['package.json', ...(manifest.files ?? [])].sort()
const missing = expected.filter((path) => !paths.includes(path))
const unexpected = paths.filter((path) => !expected.includes(path))
if (missing.length > 0 || unexpected.length > 0) {
  const details = [...missing.map((path) => `- missing: ${path}`), ...unexpected.map((path) => `- unexpected: ${path}`)]
  throw new Error(`Package contents differ from package.json files:\n${details.join('\n')}`)
}
console.log(`Package contents verified: ${paths.length} files`)
```

</details>

**依据 7 · 源码核查**：[README.md:131-133](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/README.md#L131-L133)

作者构建SHA与共用产物说明。

```text
修改美术素材后，先运行 `pnpm art:embed` 再构建；源码改动应连同更新后的 `lib/` 一起提交。开发桌宠时，安装 `requirements.txt` 和 `requirements-test.txt` 中的依赖，再运行 `pnpm test:python`。Windows 下通过 `pnpm build:helper:windows` 使用构建依赖生成可执行文件和 SHA-256 校验文件。

桌面端与 Web 端共用客户端构建产物。消息样式兼容 `ui-chat` 和 `ui-conversation` 模块；桌面窗口保留应用标题和图标。
```

#### 缺口

- 固定提交远端CI结果、构建可复现/签名与真实Host验收未核。
  **影响**：不能声明本次通过或发行EXE可信/完整运行安全。
  **进一步探讨**：另行固定运行及artifact后对源码树/包/EXE hash建立对应，再授权隔离Host验收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 根资源相比直接看子包的增量和成本是什么？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

贡献是中英文安装/开发导航与统一维护门禁，能澄清root0.1.0和子包0.1.1、web/desktop profile/Windows宠物条件；原生产品功能/美术/进程都在子包，根没有独立业务闭环。直接读子README与脚本是功能等价替代，根四条委派不改变算法或执行能力，不把聚合目录/命令数算创新。

根packageManager pnpm11.21.0、license BSD-3-Clause但无engines字段；README开发Node22.19+，子manifest Node>=22.19实际要求，CI Node22/Python3.11和Windowsrunner是维护环境，不等用户必须全装开发栈。普通使用者应按子包安装，不需run所有测试；维护者则需锁依赖和Python构建依赖，Windows EXE构建另有PyInstaller/PySide6。NOTICE称Node/Python桌宠来自dafeiyu MIT及素材参考，不把BSD代码声明扩展为所有美术权利，也不把衍生runtime算根原创。

只读阶段成本是克隆/查文件/版本路径人工，仓库包含原生EXE/美术会占磁盘，字节与工时未测；不安装/不执行则不会由根入口启动进程或写DSH配置。维护阶段主动执行委派后会生成lib/EXE/.build等，持续承担两平台依赖/升级、素材与源码产物同步，现金/CI资源/人工未知不填0。失败回到子命令日志与固定Git差异，根无统一事务回滚；退出资源研究可停止阅读，已经安装子插件需走该插件profile卸载，不能删仓库就当卸载完成。

经济上还是同维护者同源码开发/用户自托管，没有资源池、供给/计价或服务责任结构改变；同样没有新增组织分工、交付验收单元或此前受限明确群体，文档集中不计业务创新。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-19](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/package.json#L1-L19)

根依赖/许可/命令声明边界。

<details>
<summary>查看原文（19行）</summary>

```text
{
  "name": "dsh-maid-whale-webui-workspace",
  "version": "0.1.0",
  "private": true,
  "description": "Whale-maid theme for DeepSeek Harness desktop and Web UI with a native Windows companion",
  "license": "BSD-3-Clause",
  "type": "module",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yunxiiQwQ/dsh-maid-whale-UI.git"
  },
  "packageManager": "pnpm@11.21.0",
  "scripts": {
    "build": "pnpm -C maid-whale-webui build",
    "test": "pnpm -C maid-whale-webui test",
    "typecheck": "pnpm -C maid-whale-webui typecheck",
    "lint": "pnpm -C maid-whale-webui lint"
  }
}
```

</details>

**依据 2 · 源码核查**：[README.md:118-141](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/README.md#L118-L141)

开发环境、同步要求与上游/许可。

<details>
<summary>查看原文（24行）</summary>

````text
开发需要 Node.js 22.19+ 和 pnpm 11.21.0。从仓库根目录执行：

```bash
cd maid-whale-webui
pnpm install --frozen-lockfile
pnpm art:embed:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm pack:check
```

修改美术素材后，先运行 `pnpm art:embed` 再构建；源码改动应连同更新后的 `lib/` 一起提交。开发桌宠时，安装 `requirements.txt` 和 `requirements-test.txt` 中的依赖，再运行 `pnpm test:python`。Windows 下通过 `pnpm build:helper:windows` 使用构建依赖生成可执行文件和 SHA-256 校验文件。

桌面端与 Web 端共用客户端构建产物。消息样式兼容 `ui-chat` 和 `ui-conversation` 模块；桌面窗口保留应用标题和图标。

## 声明

- 代码使用 BSD-3-Clause 许可证。
- 本项目是非官方社区主题，与 DeepSeek 官方无隶属或背书关系；角色与插画素材来源于社区二创。
- 桌宠的 Node 侧伴侣代码与 Python runtime 基于 [QCYTSN/dsh-dafeiyu](https://github.com/QCYTSN/dsh-dafeiyu)（MIT），完整归属说明见 [`maid-whale-webui/NOTICE`](maid-whale-webui/NOTICE)。
- 插件仅使用 DSH 官方客户端插件机制，不修改 DeepSeek Harness 源码，也不介入模型请求。
- 桌宠不存储密钥、不截图、无遥测、不新增网络端口，只响应 DSH 自身事件。
````

</details>

**依据 3 · 源码核查**：[maid-whale-webui/package.json:123-125](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/package.json#L123-L125)

子包Node最低声明。

```text
  "engines": {
    "node": ">=22.19"
  }
```

**依据 4 · 源码核查**：[maid-whale-webui/NOTICE:16-29](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/NOTICE#L16-L29)

上游与美术权利边界。

<details>
<summary>查看原文（14行）</summary>

```text
This notice records the immediate development sources. It does not grant or
imply a license for third-party artwork, names, or marks depicted by them.

Desktop companion integration
-----------------------------

The desktop companion in `src/host/`, `src/index.ts`, `runtime/`, and
`scripts/build-helper.ps1` is vendored from QCYTSN/dsh-dafeiyu (MIT License,
https://github.com/QCYTSN/dsh-dafeiyu) and rebranded for this skin. The
companion's idle artwork is the first idle cell from the user's local
`deepseek-drool` Codex spritesheet, preserved at its original pixel scale.
The other 19 action poses were generated with OpenAI ImageGen using that
idle cell as the character reference, then fitted to the companion canvas.
None of the original dafeiyu character assets are redistributed here.
```

</details>

**依据 5 · 源码核查**：[maid-whale-webui/scripts/build-helper.ps1:5-17](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/scripts/build-helper.ps1#L5-L17)

产物路径与目录创建。

<details>
<summary>查看原文（13行）</summary>

```text
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$entry = Join-Path $projectRoot 'runtime\helper.py'
$assets = Join-Path $projectRoot 'assets'
$output = Join-Path $projectRoot 'runtime\bin\win32-x64'
$work = Join-Path $projectRoot '.build\helper'
$projectPython = Join-Path $projectRoot '.build\python-env\Scripts\python.exe'

if (-not $Python) {
  $Python = if (Test-Path -LiteralPath $projectPython) { $projectPython } else { 'python' }
}

New-Item -ItemType Directory -Force -Path $output, $work | Out-Null
```

</details>

#### 缺口

- 导航是否减少安装选错、两平台维护时间与发行资源成本未量化。
  **影响**：不能证明根入口比子README更有用/更便宜，也不能据脚本在场判断CI真实成功。
  **进一步探讨**：用首次读者定位包/profile/版本与维护者原文审查作小对照，决定是否保留重复文档。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 作为工程资源如何使用，值得验证的改进是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可作为只读资源试用：想了解此主题的用户或维护者先读根package与安装段，确认root是private0.1.0、可装对象是子包0.1.1，选择正确profile后再转子组件研究。它比直接进子目录多入口导航和CI索引，不代表根能安装或宠物已通过Host验收。若只想换皮肤，不要执行根build/test或把整个根add进DSH；路径/版本或二进制来源不明就停在只读，回原生主题并查子包。

可证伪方向是复用已有manifest与CI产物生成单一安装/发行映射：root职责、子包版本、固定Git、npm包与EXE的hash/构建run链接分开，README引用而非重复手写“生成SHA”。最小检查比较根/子版本、旧hash检查前后产物、包清单、Desktop/Web安装路径和CI失败五种情形，记录错误安装/错误安全推断与修订负担。若现有子README/发布页已经提供等效可追溯映射，直接链接即可；不另建门户，不把候选发行账本算当前生产能力。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-19](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/package.json#L1-L19)

资源路由与版本依据。

<details>
<summary>查看原文（19行）</summary>

```text
{
  "name": "dsh-maid-whale-webui-workspace",
  "version": "0.1.0",
  "private": true,
  "description": "Whale-maid theme for DeepSeek Harness desktop and Web UI with a native Windows companion",
  "license": "BSD-3-Clause",
  "type": "module",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/yunxiiQwQ/dsh-maid-whale-UI.git"
  },
  "packageManager": "pnpm@11.21.0",
  "scripts": {
    "build": "pnpm -C maid-whale-webui build",
    "test": "pnpm -C maid-whale-webui test",
    "typecheck": "pnpm -C maid-whale-webui typecheck",
    "lint": "pnpm -C maid-whale-webui lint"
  }
}
```

</details>

**依据 2 · 源码核查**：[.github/workflows/ci.yml:60-67](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/.github/workflows/ci.yml#L60-L67)

旧hash到重建的证据缺口。

```text
      - name: Verify checked-in helper hash
        shell: pwsh
        run: |
          $expected = (Get-Content runtime/bin/win32-x64/dsw-drool-helper.exe.sha256).Split()[0]
          $actual = (Get-FileHash -Algorithm SHA256 runtime/bin/win32-x64/dsw-drool-helper.exe).Hash.ToLowerInvariant()
          if ($actual -ne $expected) { throw "helper hash mismatch: $actual" }
      - run: python -m pip install -r requirements-build.txt
      - run: pnpm build:helper:windows
```

**依据 3 · 源码核查**：[README.md:106-131](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/README.md#L106-L131)

现有文档与构建说明可复用。

<details>
<summary>查看原文（26行）</summary>

````text
仓库根目录提供文档和命令入口，可安装的插件位于 `maid-whale-webui/`：

| 路径 | 用途 |
| --- | --- |
| `src/client/` | 主题样式、边框、装饰和桌宠设置 |
| `src/index.ts`、`src/host/` | Host 入口、DSH 事件和桌宠进程桥接 |
| `runtime/` | Python/Qt 桌宠与 Windows 可执行文件 |
| `assets/`、`preview/` | 原始美术素材与界面预览 |
| `build/`、`scripts/` | 打包配置、素材嵌入和发布检查 |
| `tests/`、`runtime/tests/` | 客户端、Host 和 Python 测试 |
| `lib/` | 随仓库提交、供 DSH 加载的客户端和 Host 构建产物 |

开发需要 Node.js 22.19+ 和 pnpm 11.21.0。从仓库根目录执行：

```bash
cd maid-whale-webui
pnpm install --frozen-lockfile
pnpm art:embed:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm pack:check
```

修改美术素材后，先运行 `pnpm art:embed` 再构建；源码改动应连同更新后的 `lib/` 一起提交。开发桌宠时，安装 `requirements.txt` 和 `requirements-test.txt` 中的依赖，再运行 `pnpm test:python`。Windows 下通过 `pnpm build:helper:windows` 使用构建依赖生成可执行文件和 SHA-256 校验文件。
````

</details>

**依据 4 · 源码核查**：[maid-whale-webui/scripts/check-package-contents.mjs:24-32](https://github.com/yunxiiQwQ/dsh-maid-whale-UI/blob/1678a1640a21705ca5f3520e2a81892e4616bd33/maid-whale-webui/scripts/check-package-contents.mjs#L24-L32)

现有产物清单基础。

```text
const manifest = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8'))
const expected = ['package.json', ...(manifest.files ?? [])].sort()
const missing = expected.filter((path) => !paths.includes(path))
const unexpected = paths.filter((path) => !expected.includes(path))
if (missing.length > 0 || unexpected.length > 0) {
  const details = [...missing.map((path) => `- missing: ${path}`), ...unexpected.map((path) => `- unexpected: ${path}`)]
  throw new Error(`Package contents differ from package.json files:\n${details.join('\n')}`)
}
console.log(`Package contents verified: ${paths.length} files`)
```

#### 缺口

- 候选发行映射与首次读者理解实验未做。
  **影响**：不计当前贡献，资源采用不等安装许可/运行认证。
  **进一步探讨**：先查现有发布页是否足够，再做五情形静态对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
