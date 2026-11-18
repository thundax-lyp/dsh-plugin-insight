# fnOS CLI Skill

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[b054b0e](https://github.com/fnnas-labs/fnos-cli-skill/tree/b054b0e9046ea63b244f35a6ed73cd1f82873c4e)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/fnnas-labs/fnos-cli-skill)
<!-- END META -->

> **功能**：在 DeepSeek Harness 注册 fnOS 管理 Skill，指引助手通过同包 CLI 查询或管理已授权设备。

> **亮点**：[Q01](#research-q01) 将设备查询指引与发布包内启动器放在同一资源目录下，使助手能按宿主 Skill 选择，在同一任务中发起已有 CLI 查询。挂载自身只注册资料，设备响应由 CLI 与 NAS 决定 [Q02](#research-q02)。

> **主要限制**：[Q03](#research-q03) 固定仓库提交仍可能通过 latest 得到不同依赖，而 OAuth 又按实际主机和 profile 存储。即使注册成功，也要分别确认包、执行环境和目标，避免查询或授权错设备 [Q04](#research-q04)。

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
  - [Q01 · 已有 fnOS 的 DSH 操作者，在哪类只读任务里比自行开终端更容易？](#detail-section-11)
  - [Q02 · 从 Git 根部安装到同包启动器，哪些接线实际发生，谁执行 NAS 命令？](#detail-section-12)
  - [Q03 · 为何固定仓库提交不足以复现 Git 安装，首次启动失败又从哪里恢复？](#detail-section-13)
  - [Q04 · 连接和授权在何处发生，如何区分只读会话和高风险写入？](#detail-section-14)
  - [Q05 · 作者的 candidate PASS 支撑什么，何时可以停止或继续？](#detail-section-15)
  - [Q06 · 记录实际解析的制品与执行环境能减少把错设备或错版本当作成功吗？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有飞牛国内版设备、也在使用 DSH 的用户，可以从一条明确设备的例行系统信息检查了解这个入口的作用。

人工查管理网页可以直接确认设备身份，已经装好全局 CLI 的操作者也能直接查询；在 DSH 里再交给助手需要明确命令、插件版本、参数和权限。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| fnOS CLI Skill | 指引助手选择设备授权和查询命令 | 需要 DSH skills 和实际执行环境；适配器不自动登录 |
| 同包启动器指引 | 调用与文档对应的 CLI | Git latest 会解析不同依赖；冷缓存还需网络及有效资产 |
| 设备只读检查 | 查看明确授权设备的系统信息 | 必须确认设备、profile 和执行主机，读取失败需停查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH skills 服务及实际执行 Shell | DSH 路径所需 | 注册 Skill 并执行同包命令 | 在真实宿主上核对入口和资源目录 |
| 同包 Node 启动器、适配资产和有效缓存 | 首次及持续运行所需 | 锁定原生 CLI 版本 | 冷缓存需可用网络，摘要错时停止 |
| 明确 NAS 与受授权 profile | 设备查询所需 | 在正确目标读取数据 | 先核对环境，防止走错设备 |
| SSH/容器实际执行环境及状态存储 | 跨主机时所需 | 匹配本机路径和授权 | 不能假设本机缓存或会话共享 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 绑定 | 管理者选择明确版本和 DSH 组合 | 注册项返回包内资源根，识别 launcher |
| 核对 | 运行对应版本与帮助，确定实际主机和 profile | CLI 与 Skill 入口一致 |
| 使用 | 只在已经授权的确切设备上核对只读返回 | 目标、权限和期待信息一致；先排除误写 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主、网络与存储缓存 | 选版本、核对目标和浏览器授权 | 下载与审核耗时未知 |
| 持续 | 宿主和原生调用资源 | 保持同 profile，查看授权变化 | 消耗与镜像情况未知 |
| 失败 | 可能重复拉取和占用缓存 | 检查路径、来源及状态，必要时重新授权 | 可退回原管理界面；节时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同包命令 | Skill 的 resourceBase 推导对应 Node 启动器 | DSH 真实模型能否稳定选择及引用 |
| 冷热启动 | 固定平台和大小摘要的运行准备 | 生产镜像在各环境的可达性 |
| NAS 验收 | 文档要求同 profile 的只读检查 | 真实设备授权、系统权限与成功率 |

> **思考**：[Q03](#research-q03) 固定仓库提交仍可能通过 latest 得到不同依赖，而 OAuth 又按实际主机和 profile 存储。即使注册成功，也要分别确认包、执行环境和目标，避免查询或授权错设备 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将设备查询指引与发布包内启动器放在同一资源目录下，使助手能按宿主 Skill 选择，在同一任务中发起已有 CLI 查询。挂载自身只注册资料，设备响应由 CLI 与 NAS 决定 [Q02](#research-q02)。

[Q03](#research-q03) 发布脚本锁候选和摘要，宽松的 Git latest 解析与包内严格的运行资产解析是两层机制。多个入口公用版本化缓存，初始化锁与传输校验让失败可定位。对实际干净宿主和镜像的断网场景仍需验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 固定仓库提交仍可能通过 latest 得到不同依赖，而 OAuth 又按实际主机和 profile 存储。即使注册成功，也要分别确认包、执行环境和目标，避免查询或授权错设备 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先核对固定包的版本、帮助和实际执行环境。能确认实际授权对象后再安排只读验收；版本、profile 或设备身份不一致，以及预期只读命令要求确认写入时，停止并回原管理界面。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查根桥接、0.6.2 公开 npm 产物静态字节、授权指导和发布者候选边界。所提收据是待验证设计，真机和宿主未执行。

- 已检查：作者 README、包清单、源码路径 README.md、npm/dsh.mjs、skills/fnos-cli/SKILL.md、package.json、cordis.patch.yml、index.mjs、release.json、skills/fnos-cli/scripts/fnos-cli、skills/fnos-cli/runtime-setup.md、skills/fnos-cli/reference/oauth.md、evidence/gate.json、evidence/darwin.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：已读根 Git 桥接、固定 npm tarball 入口和运行时准备、独立 Skill 指南及发布者候选材料。未运行包代码或原生 CLI，未请求 NAS 或做 OAuth，也未检查原生 CLI 的全部源代码。
- 下一步：先静态固定制品，随后在源码对应 Host 用合成 profile 运行帮助与版本检查。另在获准的测试设备检查只读结果与拒绝边界。

**分析版本**

- **仓库**：[fnnas-labs/fnos-cli-skill](https://github.com/fnnas-labs/fnos-cli-skill)
- **版本号**：0.6.2（[固定提交 b054b0e](https://github.com/fnnas-labs/fnos-cli-skill/tree/b054b0e9046ea63b244f35a6ed73cd1f82873c4e)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 用脱敏收据同时绑定包哈希、执行环境和设备身份，可试验是否减少更新或容器切换后把错误查询当作成功。

先静态固定制品，随后在源码对应 Host 用合成 profile 运行帮助与版本检查。另在获准的测试设备检查只读结果与拒绝边界。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 2 | 37 | 28 | 1 | — |
| .md | source | 37 | 4310 | — | — | 41308 |
| .cjs | source | 5 | 599 | 560 | 27 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/fnnas-labs/fnos-cli-skill/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/fnnas-labs/fnos-cli-skill/issues?q=is%3Aissue+created%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/fnnas-labs/fnos-cli-skill/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-19T02%3A25%3A42.973Z..2026-11-18T02%3A25%3A42.973Z)



统计日期：2026-11-18。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已经使用 fnOS 的管理员如何让 DSH 在确定的宿主与版本上只读检查设备，桥接和实际 CLI 在挂载、首次使用及授权失败时分别提供什么保障？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有 fnOS 的 DSH 操作者，在哪类只读任务里比自行开终端更容易？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对已有飞牛国内版设备、愿意授权且在 DSH 里做例行设备检查的人，近期任务可限定为查看系统信息和设备概况。原办法是自行进入管理界面或打开终端选择正确的全局 CLI、目标及 profile，取结果再交给助手整理。该入口把指令选择及授权说明加入 DSH 的 Skill 服务，向 Agent 指明同一发布包内的启动器，用既有 shell 发起实际查询，减少在每个提示中重复说明 CLI 路径和版本。查询由 fnOS 原生 CLI 完成；命令实现、NAS 权限和真实设备响应不由本适配器实现。只用国内版及明确设备，正确版本和目标的只读返回才是可验收结果。对只做一次或权限不明的设备，人工界面仍容易确认目标及授权。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:29-45](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/README.md#L29-L45)

作者声明包内工具与 Skill 绑定。

<details>
<summary>查看原文（17行）</summary>

````text
# fnOS CLI 的 DSH 集成

`@fnnas-labs/fnos-cli` 包含固定版本的 CLI 启动器、同版本 Skill 和 DSH bundle。bundle 激活 `npm/dsh.mjs`，向 Skill 服务显式注册 `fnos-cli`；安装 bundle 与注册 Skill 是两个步骤。

安装到实际使用的 DSH profile，例如：

```sh
dsh plugin --profile headless add @fnnas-labs/fnos-cli@latest
```

npm 处理发布期间 `latest` 可能仍为上一版。检查安装版本及命令帮助；已有 DSH 安装需要显式升级。复现特定版本时，用明确版本替换 `latest`。

Skill 根据资源目录定位同包 `../npm/run.cjs`，并指导 Agent 通过 Node 调用；不依赖全局命令。适配器仅加载包内文档，不执行命令、不自动添加写确认参数、不登录。

## 首次运行与共享缓存

轻量包的首次 `--version`、`--help` 或业务调用才会下载执行主机对应的一份原生 CLI；安装 bundle、导入适配器和注册 Skill 本身不触发下载。同包运行清单绑定产品、版本和 SHA-256，不使用 PATH 上其他 CLI，也不在运行时解析 `latest`。
````

</details>

**依据 2 · 源码核查**：[npm/dsh.mjs:12-16](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/npm/dsh.mjs#L12-L16)

交给 Agent 可核对路径、Shell 引用、版本检查和只读约束。

```text
  const invocation = `## DSH package-local invocation

1. Resolve \`../npm/run.cjs\` against the base directory returned by this Skill. This is the launcher shipped with this Skill's npm package, version ${metadata.version}.
2. In the local DSH Host shell, run \`node "<resolved-launcher>" <arguments>\`. Replace every \`fnos-cli\` or \`trim-cli\` command prefix in this Skill and its references with that invocation. Quote the resolved path and each argument for the active shell (Bash or PowerShell), including spaces, apostrophes and shell metacharacters. Keep each argument separate. The launcher's path is outside the workspace and does not require changing the working directory.
3. Begin with \`--version\` or \`--help\`, then use the requested read-only command and the chosen \`--profile\`. This entry does not require a global CLI installation and never adds \`--yes\` for you. Only include \`--yes\` after the user explicitly authorizes the corresponding write.
```

**依据 3 · 作者声明**：[skills/fnos-cli/SKILL.md:36-58](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/skills/fnos-cli/SKILL.md#L36-L58)

说明适用任务与命令治理。

<details>
<summary>查看原文（23行）</summary>

```text
## 使用规则

- 两产品的命令、配置、profile 与登录状态独立。新版需重新授权，不读取或迁移旧登录数据，也不自动删除旧凭据。
- 只使用本产品的 `FNOS_CLI_*` 配置变量。没有显式连接参数时，仅恢复当前产品、当前 profile 的目标；无记录时使用 `localhost:5666`。
- 文件写操作默认使用具体 `/vol{n}/...` 路径。高风险操作须核实用户意图及命令的 `--yes` 要求；不把设备验收变成默认写操作。
- `raw` 仅对内置审计过的只读端点免除 `--yes`；未知端点名称不能证明只读。
- CLI 和 Skill 来自同一版本的包。首次安装、升级或公开文档变化后检查实际 `--version` 和相关 `--help`，不假定 `latest` 已完成传播。

## 命令与任务一览

- [连接与授权](entries/trim-shared.md): 登录、选择连接目标或 profile、排查登录状态和连接问题，以及应用通用安全规则时使用。
- [文件](entries/trim-file.md): 列出或搜索文件、上传本地文件、检查共享目录和 ACL，或判断当前用户目录与 NAS 路径语义时使用。
- [照片](entries/trim-photos.md): 浏览相册扫描目录、搜索照片、查看详情，以及获取缩略图或原图预览地址时使用。
- [应用中心](entries/trim-app.md): 管理已安装应用、应用中心安装、FPK 软件包、更新、应用入口与生命周期操作。
- [Docker](entries/trim-docker.md): 查看和管理 Docker 镜像、容器、Compose 项目及长时间运行的生命周期操作。
- [下载](entries/trim-download.md): 列出、搜索、创建和控制下载任务，查看任务文件、统计和状态变化。
- [百度网盘](entries/trim-baidu-netdisk.md): 检查百度网盘授权、容量、云端文件、分享保存、NAS 传输和定时同步。
- [日志](entries/trim-log.md): 浏览筛选日志、列举日志模块、清除或导出记录、配置归档，并复制或取消诊断日志。
- [监控](entries/trim-monitor.md): 查看 CPU、内存、网络、磁盘、进程、服务、电池、风扇、GPU/NPU 与蜂鸣器告警等运行时指标。
- [网络](entries/trim-network.md): 管理网络服务开关，包括开启或关闭 SSH，并确认写操作的授权要求。
- [存储](entries/trim-storage.md): 查看存储池、磁盘与 SMART 数据，或执行挂载、扩容、磁盘替换、格式化等高风险存储写操作。
- [系统与电源](entries/trim-system.md): 查看静态系统标识、机型、版本、卷、硬件和电源计划，或重启、关闭设备。
- [用户与权限](entries/trim-user.md): 查看用户、组、登录设备和当前权限，管理用户，或选择正确的已授权 profile。
```

</details>

#### 缺口

- 未比较同一设备任务的通过率或实际用时
  **影响**：不能声称部署后例行检查已节省人时
  **进一步探讨**：对比原有终端检查与 DSH 只读路线，记录任务、目标和输出一致性

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从 Git 根部安装到同包启动器，哪些接线实际发生，谁执行 NAS 命令？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Git 根清单是 private 的 fnos-cli-skill，有 Cordis patch 和 main。补丁按包名插入 profile，index.mjs 只重导出安装的 @fnnas-labs/fnos-cli，保留真实发布适配器自己的 import.meta.url；因此根目录下的 npm/dsh.mjs 是可审阅快照。独立读取同一仓库 release.json 固定的 npm 0.6.2 tarball，实际 SHA-256 一致，包内 main 为 npm/dsh.mjs，内容与 Git 快照逐字相同。apply 注入 skills，定位自身包下 skill 目录，读取 SKILL.md 与版本，注册 runtime Skill 和目录型 resourceBase。注册方法只交付文档；Agent 依据 resourceBase 定位 ../npm/run.cjs 并在真正的 DSH Host shell 运行 Node；同版本 launch 脚本把参数阵列交给原生程序并传播失败状态。headless 与宿主版本、路径引用和 Node/平台条件仍需验收。根依赖为 latest，本次固定包的验证仅对应这个具体 tarball。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-24](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/package.json#L1-L24)

Git 根入口选择依赖 latest。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "fnos-cli-skill",
  "version": "0.6.2",
  "private": true,
  "description": "fnOS Skill and DSH bridge for the latest fnOS CLI package",
  "homepage": "https://fnnas.com/",
  "type": "module",
  "main": "index.mjs",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/fnnas-labs/fnos-cli-skill.git"
  },
  "engines": {
    "node": ">=18"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
    "@fnnas-labs/fnos-cli": "latest"
  },
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/cordis.patch.yml#L1-L3)

将桥接插入 profile。

```text
- insert:
    - id: fnos-cli-skill
      name: 'fnos-cli-skill'
```

**依据 3 · 源码核查**：[index.mjs:1-2](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/index.mjs#L1-L2)

实际重导出依赖。

```text
// Load the installed dependency, preserving the adapter's own import.meta.url.
export * from '@fnnas-labs/fnos-cli'
```

**依据 4 · 源码核查**：[npm/dsh.mjs:4-16](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/npm/dsh.mjs#L4-L16)

宿主注入与相对目录、终端调用契约。

<details>
<summary>查看原文（13行）</summary>

```text
export const name = 'fnos-cli'
export const inject = ['skills']

export function apply(ctx) {
  const skillDirectory = new URL('../skill/', import.meta.url)
  const metadata = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  const markdown = readFileSync(new URL('SKILL.md', skillDirectory), 'utf8')
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trim()
  const invocation = `## DSH package-local invocation

1. Resolve \`../npm/run.cjs\` against the base directory returned by this Skill. This is the launcher shipped with this Skill's npm package, version ${metadata.version}.
2. In the local DSH Host shell, run \`node "<resolved-launcher>" <arguments>\`. Replace every \`fnos-cli\` or \`trim-cli\` command prefix in this Skill and its references with that invocation. Quote the resolved path and each argument for the active shell (Bash or PowerShell), including spaces, apostrophes and shell metacharacters. Keep each argument separate. The launcher's path is outside the workspace and does not require changing the working directory.
3. Begin with \`--version\` or \`--help\`, then use the requested read-only command and the chosen \`--profile\`. This entry does not require a global CLI installation and never adds \`--yes\` for you. Only include \`--yes\` after the user explicitly authorizes the corresponding write.
```

</details>

**依据 5 · 源码核查**：[npm/dsh.mjs:28-35](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/npm/dsh.mjs#L28-L35)

实际 runtime Skill 注册。

```text
  return ctx.skills.register({
    name: 'fnos-cli',
    source: 'runtime',
    description: 'Manage fnOS NAS files, downloads, storage, apps and system state with the package-local fnOS CLI. Use for fnOS operations and authentication guidance.',
    content: `${invocation}\n${body}`,
    resourceBase: { kind: 'directory', path: fileURLToPath(skillDirectory) },
  })
}
```

**依据 6 · 源码核查**：[release.json:3-22](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/release.json#L3-L22)

指定业务 npm 包、发布身份与 tarball 摘要。

<details>
<summary>查看原文（20行）</summary>

```text
  "variant": "fnos",
  "packageName": "@fnnas-labs/fnos-cli",
  "commandName": "fnos-cli",
  "repository": "fnnas-labs/fnos-cli-skill",
  "version": "0.6.2",
  "tag": "v0.6.2",
  "sourceCommit": "ca15514d681ad83fcb98726cbe3c88ed3a5551fe",
  "evidenceSha256": {
    "candidate.json": "9232dde1bf14b586c4158858e6d93e8add6036e541c594b042db156b7073c1b4",
    "gate.json": "45a86ae77bf383a97cd4392470bf42d8860d0177d38e861ce33ef69d9b598b35",
    "darwin.json": "f41eef0efabb027778e0158f6967386b83d7e4fd11b39cf1584e0b7ec3c7a76e",
    "linux.json": "80990cfa548f9d1b58f89b9ad60d528db5af17885d52a3c57f4dd87b8a035888",
    "win32.json": "73a1f4393937fa279273a7019b0c3b42f6b91f028cab3b6e593d0590199eaa90"
  },
  "bridgeManifestSha256": "09d441dc62449c84358e04b5e8fbf8e1e6659b8b98a3e568d80be53fca02db77",
  "assets": [
    {
      "name": "fnnas-labs-fnos-cli-0.6.2.tgz",
      "sha256": "19f28e0b42e399e9c790f9c8c3ad904fbac4be6c283d51c37e1c3f9713da7f66"
    },
```

</details>

#### 缺口

- 没有运行固定头部 profile 或真实助手 Shell
  **影响**：挂载代码和产物一致只支持源码结论
  **进一步探讨**：在隔离兼容 Host 先验证 Skill 名称、路径、帮助和退出码

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 为何固定仓库提交不足以复现 Git 安装，首次启动失败又从哪里恢复？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

Git 入口要求 latest，旧 lockfile 可能保留先前依赖，Git 提交无法单独决定 CLI 版本。可复核的对象是具体包版本、tarball SHA-256 和运行时资产摘要。静态回读的 0.6.2 tarball 内 package/npm/runtime-manifest.json 绑定平台、大小及摘要，npm/run.cjs 走适配本机的运行时路径，并用独立 argv 运行。匹配缓存先验证内容，冷启动需要下载、锁与临时目录。运行链按固定大小和 SHA-256 约束数据，错误资产不应该被执行；独立 Skill 的 POSIX 脚本也有锁、有限长度下载及再校验。这减少固定版本与 PATH 中其他 CLI 混用的问题，同时把网络失败推迟到首次调用。应先区分安装的版本、冷启动、摘要失败和命令本身的非零退出。锁还占用时不要清缓存，避免损坏另一个入口；确知无初始化后可清无效缓存，再重试同一版本。动态 latest 应用实际安装包来核验。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:17-24](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/package.json#L17-L24)

挂载及 latest 依赖直接写入根包。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
    "@fnnas-labs/fnos-cli": "latest"
  },
```

**依据 2 · 源码核查**：[release.json:18-49](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/release.json#L18-L49)

固定候选与各平台资产摘要。

<details>
<summary>查看原文（32行）</summary>

```text
  "assets": [
    {
      "name": "fnnas-labs-fnos-cli-0.6.2.tgz",
      "sha256": "19f28e0b42e399e9c790f9c8c3ad904fbac4be6c283d51c37e1c3f9713da7f66"
    },
    {
      "name": "fnos-skill.zip",
      "sha256": "62a2c66b3d8ebf216687db96d92047e40b1fddb63924ddfa60854b674fbbbec5"
    },
    {
      "name": "fnos-cli-0.6.2-darwin-arm64.gz",
      "sha256": "27d34ccaa362af76b7166a7c65f6c9267540c3efac67835158f8ceb382649122"
    },
    {
      "name": "fnos-cli-0.6.2-darwin-x64.gz",
      "sha256": "9b83a262197e258c6aaf943a24ec22b3352a82187d99e401d2c99aaa219efbea"
    },
    {
      "name": "fnos-cli-0.6.2-linux-arm64.gz",
      "sha256": "db7d7a1ecac51bf1213b1b3a7eee77e14b5d16604ace00f83ba6587dad649ebc"
    },
    {
      "name": "fnos-cli-0.6.2-linux-x64.gz",
      "sha256": "f3233408662bf667355135771ce0d6db856ef334f16c5a552a53970976ffdc79"
    },
    {
      "name": "fnos-cli-0.6.2-windows-arm64.gz",
      "sha256": "24215e61122c87311acb7d6775e76b9fa0d7063d8fa066665b4d3dec79233763"
    },
    {
      "name": "fnos-cli-0.6.2-windows-x64.gz",
      "sha256": "73effb7c079a1c0cb11d452035113eb0b5d55c8ea55c06d757bcbd81808be3cb"
```

</details>

**依据 3 · 源码核查**：[skills/fnos-cli/scripts/fnos-cli:79-94](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/skills/fnos-cli/scripts/fnos-cli#L79-L94)

单独执行缓存、系统工具和初始化锁。

<details>
<summary>查看原文（16行）</summary>

```text
 [ -x "$BINARY" ] || fail "Runtime is not executable: $BINARY"
}
launch() { umask "$ORIGINAL_UMASK"; export TRIM_CLI_DISTRIBUTION="$PRODUCT"; exec "$BINARY" "$@"; }
if ready; then launch "$@"; fi
for tool in curl gzip head mkfifo od sed mkdir chmod rm mv cat sleep; do command -v "$tool" >/dev/null 2>&1 || fail "Missing required tool: $tool"; done
waited=0
while ! mkdir "$LOCK" 2>/dev/null; do
 [ ! -L "$LOCK" ] || fail "Unsafe initialization lock: $LOCK"
 [ ! -e "$LOCK" ] || [ -d "$LOCK" ] || fail "Cannot create initialization lock: $LOCK"
 if ready; then launch "$@"; fi
 [ "$waited" -lt 60 ] || fail "CLI initialization is locked: $LOCK. Remove this lock only after confirming its initializer has stopped."
 sleep 1; waited=$((waited+1))
done
chmod 700 "$LOCK" || { rm -rf "$LOCK"; fail "Cannot secure initialization lock."; }
OWNER="$$-$(od -An -N16 -tx1 /dev/urandom | tr -d ' \n')"
printf '%s\n' "$OWNER" > "$LOCK/owner" || { rm -rf "$LOCK"; fail "Cannot record initialization owner."; }
```

</details>

**依据 4 · 源码核查**：[skills/fnos-cli/scripts/fnos-cli:157-173](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/skills/fnos-cli/scripts/fnos-cli#L157-L173)

实际 curl 和有限长度响应。

<details>
<summary>查看原文（17行）</summary>

```text
  : > "$LOCK/headers" || fail "Cannot create download headers."
  : > "$LOCK/status" || fail "Cannot create download status."
  mkfifo "$LOCK/stream" || fail 'Cannot create download stream.'
  (trap - EXIT INT TERM HUP; exec head -c "$((ARCHIVE_SIZE+1))" < "$LOCK/stream" > "$LOCK/payload.gz") & consumer=$!
  curl -q --silent --fail --proto '=https' --connect-timeout 10 --max-time 30 --max-filesize "$((ARCHIVE_SIZE+1))" --user-agent platform-cli-bootstrap --header 'Accept: application/octet-stream' --dump-header "$LOCK/headers" --write-out '%{http_code}' --output "$LOCK/stream" "$url" > "$LOCK/status" 2>/dev/null & producer=$!
  rc=0; wait "$producer" || rc=$?; producer=
  # Curl may finish without opening its output (e.g. an HTTP error).
  # A zero-byte writer releases that reader; if it already exited, reap the
  # blocked writer after waiting for the real bounded sink to finish.
  (trap - EXIT INT TERM HUP; : > "$LOCK/stream") & writer=$!
  sink=0; wait "$consumer" || sink=$?; consumer=
  kill -KILL "$writer" 2>/dev/null || :; wait "$writer" 2>/dev/null || :; writer=
  rm -f "$LOCK/stream"
  actual=$(size_file "$LOCK/payload.gz")
  [ "$actual" -le "$ARCHIVE_SIZE" ] && [ "$rc" -ne 63 ] || fail 'Runtime asset exceeds its fixed size.'
  [ "$rc" -ne 23 ] || fail 'Cannot write runtime download.'
  [ "$rc" -eq 0 ] || return 1
```

</details>

**依据 5 · 作者声明**：[skills/fnos-cli/runtime-setup.md:3-15](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/skills/fnos-cli/runtime-setup.md#L3-L15)

冷热缓存、镜像及损坏时恢复流程。

<details>
<summary>查看原文（13行）</summary>

```text
安装包携带固定版本的轻量启动器。首次执行 `fnos-cli --version`、`--help` 或业务命令时，启动器只下载当前执行主机对应的一份 CLI，按包内 SHA-256 校验后运行。下载提示写入 stderr，不混入业务 JSON；安装 Skill 文档不会触发下载，跳过 npm 安装脚本也能首次运行。

首次使用需要联网访问一个可用下载源。缓存准备好后，同一产品、版本和平台的后续调用无需连接下载站。缓存位于当前用户的系统缓存目录下，以命令、版本和平台隔离，无需管理员权限，不修改 PATH，也不读取旧产品登录态。

更新 npm 包或重新安装 Skill 是显式升级；已有入口继续使用自己固定的版本，不会自动升级或删除其他版本。下载失败后重新执行原命令即可重试。校验失败不会执行下载内容；若提示缓存损坏，先确认没有初始化进程运行，再移除提示的缓存目录并重试。残留锁同样只在确认初始化进程已停止后清理。

### 镜像配置

下载顺序是 GitHub Release、用户配置的兼容 npm 二进制镜像、公共 npmmirror。启动器优先读取环境变量 `npm_config_registry`；没有设置时，npm 可用则读取 `npm config get registry` 的有效值。缓存已存在时不再读取这些配置或访问下载站。

镜像基址须为不含用户名、密码、查询参数、空白或反斜杠的 HTTPS URL，可包含企业路径前缀。默认 npmjs registry 不提供二进制接口，会被跳过。镜像使用 `/-/binary/fnos-cli/v<版本>/<资产名>` 路径；普通 npm registry 可能没有此接口，失败后会继续下一源。环境变量设为空字符串时跳过自定义镜像。

所有源获取同一个固定版本，并使用包内摘要校验。网络或 HTTP 失败会继续下一源；成功收到的内容若大小或摘要不符，立即停止，本次不会尝试其他来源。所有来源都失败后可重新执行原命令。公共镜像的可用性取决于对应产品、版本资产的收录与同步；客户端具备回退逻辑不代表镜像已完成收录。
```

</details>

#### 缺口

- 未运行冷缓存和真实镜像
  **影响**：只可说明代码和作者收据的条件
  **进一步探讨**：用授权隔离用户，在同一发布哈希上分别观察空缓存与已有缓存

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 连接和授权在何处发生，如何区分只读会话和高风险写入？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

适配器指导的授权由 CLI 生成一份面向明确 NAS、执行主机和 profile 的链接，浏览器里由用户自行输入账户并同意，用户主动提供一次性 code 后，Agent 在同主机、系统用户、配置环境和 profile 下作兑换。先见持久结果及 system info 才确认成功；一条 pending 不是已登录，两个阶段之间换 SSH 或容器不能沿用预期绑定。文档指出重复生成链接覆盖 pending，code 一次性且短时有效；异常时核对现有凭据，避免反复交换。code 经过聊天和命令参数可能留存，用户不能交付密码或 token。已发布入口的作用是提供调用指引并分开参数，npm launcher 不替换操作策略。文档要求高风险命令中的 --yes 由用户明确授权，不自动追加，且 raw 是否只读来自既定列表；本次没有审查原生程序内部的全部拦截。退出本地 session 不等于远端撤销。首次成本包括设备授权和 Keychain，持续成本是管好 profile、权限和升级，失败需核对目标与会话，金额和工时未知。

#### 证据与依据

**依据 1 · 源码核查**：[npm/dsh.mjs:22-26](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/npm/dsh.mjs#L22-L26)

实际注册内容要求确认 target 和同一环境，不替用户登录。

```text
### First login or an expired session

Choose the Agent's short identity first (use \`codex\` for Codex), pass it as \`--agent-name\` on \`login --authorize-only\`, and let the CLI build the device label from the execution host name. Use the package-local launcher above for both steps in \`reference/oauth.md\`. Ask for the NAS target when unknown; reuse an existing profile's saved endpoint only when it is the intended device. Run \`login --authorize-only --agent-name <agent>\` with the selected connection options and profile, share its \`authorization_url\`, and wait. The user signs in and approves access in their browser, then sends the one-time code back to the Agent. Run \`login --code <code>\` with exactly the same target, options and profile; keep the code a separately quoted argument. Do not generate another link while waiting. Resume the task only after token persistence and a read-only request succeed. The user needs no terminal. Installation and Skill loading do not log in. Keep passwords and tokens out of chat; do not repeat or separately log the user-provided code. Chat and tool records may retain it.

Both login calls are noninteractive and must run on the same DSH Host, as the same system user, with the same configuration environment (including \`FNOS_CLI_CONFIG_DIR\`) and profile as later CLI requests. This works without an interactive login TTY. SSH shell providers and containers may execute on a different host: resolve a launcher installed there and perform both authorization calls there rather than borrowing this local path or session. A remote browser only handles consent; it does not need access to CLI storage. macOS Keychain access may require the user's system approval.
```

**依据 2 · 作者声明**：[skills/fnos-cli/reference/oauth.md:18-27](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/skills/fnos-cli/reference/oauth.md#L18-L27)

授权交接与只读确认。

<details>
<summary>查看原文（10行）</summary>

```text
Agent 默认使用两段式授权，用户不必运行终端：

1. 确认用户指定的 NAS 和 profile；已有有效 session 时直接复用。新目标未知时先询问。
2. Agent 按下述规则提供自身名称，执行 `login --authorize-only --agent-name '<agent 名>'`，把返回的 `authorization_url` 原样作为链接发给用户。
   `authorization_pending=true` 仅代表等待授权，不是已登录；此命令不等待终端输入。
3. 用户自行打开链接、输入账号密码、确认授权，并把页面显示的一次性 code 发回当前 Agent。
4. Agent 收到用户明确提供的 code 后，用同一执行主机、系统用户、配置目录、profile 和连接参数
   执行 `login --code '<code>'`。code 作为独立参数传递；使用 shell 时正确引用，不拼接为 shell 语法。
5. 确认 `token_persisted=true`、`refresh_token_persisted=true`，再用同一 profile 执行
   `system info` 等只读请求，成功后才报告已连接并继续用户任务。
```

</details>

**依据 3 · 作者声明**：[skills/fnos-cli/reference/oauth.md:46-60](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/skills/fnos-cli/reference/oauth.md#L46-L60)

同 profile pending、code 和跨主机边界。

<details>
<summary>查看原文（15行）</summary>

```text

授权 URL 包含 PKCE challenge、client、scope 和 device 参数，不包含 `redirect_uri`，不要自行
改写。每个 profile 只保留一个 pending verifier；等待 code 期间不要再次生成链接，否则会覆盖
原 pending。两个命令均显式保持相同 host/port/scheme/TLS 选项；新 session 尚未保存时，不能
依赖默认目标。远端明文 HTTP 两步都需要 `--scheme http --allow-insecure-http`。

目标为已支持的 Connect 设备子域名时，CLI 对目标的 OAuth 和代理 HTTP 请求自动附加
`mode=relay` Cookie；其他目标不附加。此 Cookie 只用于 CLI 发出的请求，
不改变用户在浏览器中打开的授权链接。

code 只能交换一次，有效期 5 分钟。pending 过期、丢失、目标不匹配或 code 交换失败时停止，
解释原因并重新发起授权，不循环重试旧 code；若响应表明 token 已保存而用户摘要/探测失败，
先检查现有 session 的只读调用，不再次交换已消费的 code。多个并行授权使用不同 profile。
两步都使用 Skill 提供的同包启动器，不需要交互 TTY；切换 Host/SSH/容器时须在实际执行
环境重新授权，不能假定本机 session 自动共享。macOS Keychain 可能需要用户批准系统提示。
```

</details>

**依据 4 · 作者声明**：[skills/fnos-cli/reference/oauth.md:74-88](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/skills/fnos-cli/reference/oauth.md#L74-L88)

刷新失败和退出语义。

<details>
<summary>查看原文（15行）</summary>

```text
`/ogh/ac/h/*` 返回 401 时，CLI 按 profile 加锁 refresh 并只重试一次；第二次仍 401 时停止。
refresh 返回新 refresh token 时替换旧值，未返回时保留旧值。刷新前 CLI 会把当前 session 原值
写回当前 profile，确认真实存储目标可写；预检失败时不会发送 refresh 请求，因此不会消耗可能轮换的 refresh token。
`ask-file` 的存储选择只会询问一次，并沿用到本次刷新提交。多进程获得锁后会重新读取 session，
已被其他进程刷新时直接使用新 token，不覆盖较新的 session。
refresh 不轮换设备安全码，CLI 在请求中携带已保存的访问码头，并在更新 OAuth token 时保留安全码。
响应带 `x-trim-safe-code-challenge` 时按设备访问码拦截处理，不触发 OAuth 401 refresh。HTTP 429 表示验证受限，应等待后重试；503 表示验证服务不可用；403 可能是策略拒绝或临时封锁。网关返回 200 挑战页时无法进一步判定原因，CLI 提示重新登录取得有效码。

存储仍可能在请求发出后失效。若 refresh 成功但最终 session 写入失败，不要反复使用旧 refresh
token；服务端可能已完成轮换，应重新发起上述 OAuth 授权。

## 登录状态与退出

session 保存 access/refresh token、可选设备安全码、过期时间、OAuth client/device/scope 和用户摘要。
`logout` 清理当前 profile 的 session 和 pending 文件，不承诺远端撤销令牌。
```

</details>

**依据 5 · 作者声明**：[skills/fnos-cli/SKILL.md:34-42](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/skills/fnos-cli/SKILL.md#L34-L42)

code 留存、写确认及 raw 限制。

```text
用户密码、2FA 和浏览器确认由用户处理。只接收用户主动发来的 code，不复述、额外落盘或转发。code 可能留在聊天、工具调用和进程参数中；不能承诺无留存。token 与 PKCE verifier 留在 CLI 受控存储，不输出到聊天。

## 使用规则

- 两产品的命令、配置、profile 与登录状态独立。新版需重新授权，不读取或迁移旧登录数据，也不自动删除旧凭据。
- 只使用本产品的 `FNOS_CLI_*` 配置变量。没有显式连接参数时，仅恢复当前产品、当前 profile 的目标；无记录时使用 `localhost:5666`。
- 文件写操作默认使用具体 `/vol{n}/...` 路径。高风险操作须核实用户意图及命令的 `--yes` 要求；不把设备验收变成默认写操作。
- `raw` 仅对内置审计过的只读端点免除 `--yes`；未知端点名称不能证明只读。
- CLI 和 Skill 来自同一版本的包。首次安装、升级或公开文档变化后检查实际 `--version` 和相关 `--help`，不假定 `latest` 已完成传播。
```

#### 缺口

- 未接触真实设备和原生内部实现
  **影响**：无法承诺 OAuth、写防护、平台密钥存储及登出范围
  **进一步探讨**：对有授权的隔离设备检查只读任务、拒绝未允许操作、状态撤回及浏览器确认

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 作者的 candidate PASS 支撑什么，何时可以停止或继续？

**研究主题**：工程质量与复用、缺陷与关键质疑、采用判断

#### 完整回答

固定仓库有 release、候选及三平台收据。发布标识与当前静态下载的指定 tarball 摘要一致；目录、实际 main 和 launcher 能被静态核对。作者的 gate.json 列出的平台是 Darwin arm64、Linux x64、Windows x64，报告范围为安装后 CLI 检查，Darwin 样例记录 help、独立 Skill 冷下载与热缓存，并明确排除 NAS、OAuth、registry 安装和其他结构。README 另提供 headless DSH 集成脚本及真机验证建议，给出的示例和脚本存在不能作为此次已执行。对有已有授权 profile 的用户，目前建议先看固定版本和持久化边界；后续以 version/help 和只读信息作标准，若发现 DSH 解析到旧包、跳向不认识的设备、需要暴露秘密、或要求 --yes 才能做预期只读操作，就暂停并回原管理界面。固定 artifact 的静态读取也不等于可实际发起命令或网络访问。

#### 证据与依据

**依据 1 · 源码核查**：[release.json:7-22](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/release.json#L7-L22)

锁定源提交、证据和指定发布 tarball。

<details>
<summary>查看原文（16行）</summary>

```text
  "version": "0.6.2",
  "tag": "v0.6.2",
  "sourceCommit": "ca15514d681ad83fcb98726cbe3c88ed3a5551fe",
  "evidenceSha256": {
    "candidate.json": "9232dde1bf14b586c4158858e6d93e8add6036e541c594b042db156b7073c1b4",
    "gate.json": "45a86ae77bf383a97cd4392470bf42d8860d0177d38e861ce33ef69d9b598b35",
    "darwin.json": "f41eef0efabb027778e0158f6967386b83d7e4fd11b39cf1584e0b7ec3c7a76e",
    "linux.json": "80990cfa548f9d1b58f89b9ad60d528db5af17885d52a3c57f4dd87b8a035888",
    "win32.json": "73a1f4393937fa279273a7019b0c3b42f6b91f028cab3b6e593d0590199eaa90"
  },
  "bridgeManifestSha256": "09d441dc62449c84358e04b5e8fbf8e1e6659b8b98a3e568d80be53fca02db77",
  "assets": [
    {
      "name": "fnnas-labs-fnos-cli-0.6.2.tgz",
      "sha256": "19f28e0b42e399e9c790f9c8c3ad904fbac4be6c283d51c37e1c3f9713da7f66"
    },
```

</details>

**依据 2 · 源码核查**：[evidence/gate.json:54-72](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/evidence/gate.json#L54-L72)

作者收据的平台与架构。

<details>
<summary>查看原文（19行）</summary>

```text
  "reports": [
    {
      "name": "darwin.json",
      "sha256": "f41eef0efabb027778e0158f6967386b83d7e4fd11b39cf1584e0b7ec3c7a76e",
      "platform": "darwin",
      "arch": "arm64"
    },
    {
      "name": "linux.json",
      "sha256": "80990cfa548f9d1b58f89b9ad60d528db5af17885d52a3c57f4dd87b8a035888",
      "platform": "linux",
      "arch": "x64"
    },
    {
      "name": "win32.json",
      "sha256": "73a1f4393937fa279273a7019b0c3b42f6b91f028cab3b6e593d0590199eaa90",
      "platform": "win32",
      "arch": "x64"
    }
```

</details>

**依据 3 · 作者声明**：[evidence/darwin.json:74-98](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/evidence/darwin.json#L74-L98)

作者实际覆盖清单及明确排除。

<details>
<summary>查看原文（25行）</summary>

```text
  "publicSkill": {
    "tool": "skills@1.7.2",
    "filesCompared": 41,
    "result": "PASS",
    "execution": "passed: independent launcher cold download and hot cache without Node/npm on PATH"
  },
  "checks": [
    "installed-shim-version",
    "installed-shim-help",
    "installed-skill",
    "product-boundary",
    "native-version-source",
    "public-skill-installer",
    "cold-host-download",
    "hot-cache-reuse",
    "standalone-skill-runtime",
    "public-skill-runtime"
  ],
  "notVerified": [
    "NAS/device operations",
    "OAuth authorization",
    "npm registry installation",
    "live GitHub/npm binary mirror availability",
    "other CPU architectures"
  ]
```

</details>

**依据 4 · 作者声明**：[README.md:73-87](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/README.md#L73-L87)

另列 DSH 集成范围、缓存与脚本模型限制。

<details>
<summary>查看原文（15行）</summary>

````text
DSH 验收由用户安排，不在每次 CI 自动执行。选择固定候选，成功结果包含包名、版本、tarball SHA-256、运行环境及未覆盖范围；其他哈希的结果不能用于重建后的包，即使版本相同。

需要 Node.js、npm、pnpm 和 DSH 支持的 macOS/Linux shell，对实际 npm tarball 执行：

```sh
node npm/dsh-integration.mjs --tarball /absolute/path/fnnas-labs-fnos-cli-0.2.1.tgz
```

此检查固定 DSH `0.2.0-rc.2`，在隔离 DSH Home 安装候选，通过本地脚本模型驱动真实 headless Agent 的 `skill` 与 `bash` 工具。无需模型服务密钥、NAS 或 OAuth。覆盖 Skill 发现、从资源推导同包启动器、原生帮助、虚拟 profile 的只读连接尝试和未经确认写操作的拒绝。PATH 仅包含 Node；安装路径包含空格和单引号。日志与隔离配置保存在 `.tmp/`。

显式 `FNOS_DSH_CLI` 可指定已安装的 DSH CLI；`FNOS_DSH_NPM_CACHE`、`FNOS_DSH_PNPM_STORE` 可复用依赖缓存，不改变隔离 Home 与 CLI 状态目录。

测试前记录目标版本的运行缓存是冷缓存还是热缓存；独立 DSH Home 与 Session 目录不隔离当前用户的运行缓存。此 runner 保留用户运行缓存，因此自动收据不声称覆盖冷缓存首次下载或真实镜像可用性。需要验收首次获取时，另行使用明确隔离的系统用户/执行环境和同一候选，不删除其他入口正在使用的缓存；OAuth 真机检查保持原授权用户与配置环境。记录原生 `--version` 首行及构建来源行，分别区分准备失败、校验失败和业务非零退出。

成功仅证明工具链，不证明真实模型自主选 Skill、NAS 授权、后台 Keychain 或 Windows。Linux/Windows 手测与真实模型验收分别记录；现有 shell 路径优先，只有平台验收证明需要时才增加专用 argv 工具。
````

</details>

#### 缺口

- 尚无本轮独立宿主/真实模型/真机验收
  **影响**：不能把发布者的安装候选收据升级为实际工作可用
  **进一步探讨**：隔离 Host 先检查版本与帮助，再在获准同一设备验证只读调用

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 记录实际解析的制品与执行环境能减少把错设备或错版本当作成功吗？

**研究主题**：新假设与验证

#### 完整回答

提出未验证的运维改进。DSH 初次注册后记录入口类型、实际 package 版本与哈希、执行环境身份及 profile 别名，再用只读握手取得设备身份摘要供人工确认。记录采用脱敏标识，避免写 token、code 或完整地址；登录前校验应允许显式切换。推导依据是 Git latest、包内版本和宿主 OAuth 状态三个周期独立，能加载某个 Skill 并不能说明它会调用同一版本或同一设备。对照现有消息式核对与结构化收据，在更新 npm tag、保留旧 lock、切换容器和故意传错 profile 的场景记录错配检测和多余授权次数。若错误仍通过，或无害更新频繁被当错设备而增一轮授权，推翻该部署中的净收益。该设计不改变用户对写入的授权门槛。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:22-24](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/package.json#L22-L24)

Git 依赖解析可随 latest 变化。

```text
  "dependencies": {
    "@fnnas-labs/fnos-cli": "latest"
  },
```

**依据 2 · 源码核查**：[npm/dsh.mjs:12-26](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/npm/dsh.mjs#L12-L26)

文档已有包内路径和同环境约束，但需操作方落实。

<details>
<summary>查看原文（15行）</summary>

```text
  const invocation = `## DSH package-local invocation

1. Resolve \`../npm/run.cjs\` against the base directory returned by this Skill. This is the launcher shipped with this Skill's npm package, version ${metadata.version}.
2. In the local DSH Host shell, run \`node "<resolved-launcher>" <arguments>\`. Replace every \`fnos-cli\` or \`trim-cli\` command prefix in this Skill and its references with that invocation. Quote the resolved path and each argument for the active shell (Bash or PowerShell), including spaces, apostrophes and shell metacharacters. Keep each argument separate. The launcher's path is outside the workspace and does not require changing the working directory.
3. Begin with \`--version\` or \`--help\`, then use the requested read-only command and the chosen \`--profile\`. This entry does not require a global CLI installation and never adds \`--yes\` for you. Only include \`--yes\` after the user explicitly authorizes the corresponding write.

### 固定版本与首次使用

启动器使用当前安装包的固定版本与产品身份，不选择 PATH 中的其他 CLI，也不查询 latest。轻量安装包首次使用时只准备执行主机对应的平台文件，依据包内 SHA-256 校验，并复用按产品、版本和平台隔离的当前用户共享缓存。注册 Skill 本身不会下载 CLI。下载进度写入 stderr，不混入业务 JSON。网络失败时依次尝试 GitHub、用户配置的 npm 二进制镜像与 npmmirror；完整性校验失败立即停止。准备失败后可重试同一启动器；业务命令失败不会重新安装 CLI。需要切换版本时，请明确升级已安装的包。

### First login or an expired session

Choose the Agent's short identity first (use \`codex\` for Codex), pass it as \`--agent-name\` on \`login --authorize-only\`, and let the CLI build the device label from the execution host name. Use the package-local launcher above for both steps in \`reference/oauth.md\`. Ask for the NAS target when unknown; reuse an existing profile's saved endpoint only when it is the intended device. Run \`login --authorize-only --agent-name <agent>\` with the selected connection options and profile, share its \`authorization_url\`, and wait. The user signs in and approves access in their browser, then sends the one-time code back to the Agent. Run \`login --code <code>\` with exactly the same target, options and profile; keep the code a separately quoted argument. Do not generate another link while waiting. Resume the task only after token persistence and a read-only request succeed. The user needs no terminal. Installation and Skill loading do not log in. Keep passwords and tokens out of chat; do not repeat or separately log the user-provided code. Chat and tool records may retain it.

Both login calls are noninteractive and must run on the same DSH Host, as the same system user, with the same configuration environment (including \`FNOS_CLI_CONFIG_DIR\`) and profile as later CLI requests. This works without an interactive login TTY. SSH shell providers and containers may execute on a different host: resolve a launcher installed there and perform both authorization calls there rather than borrowing this local path or session. A remote browser only handles consent; it does not need access to CLI storage. macOS Keychain access may require the user's system approval.
```

</details>

**依据 3 · 作者声明**：[README.md:45-57](https://github.com/fnnas-labs/fnos-cli-skill/blob/b054b0e9046ea63b244f35a6ed73cd1f82873c4e/README.md#L45-L57)

运行缓存与会话独立，Git 与 npm 版本边界。

<details>
<summary>查看原文（13行）</summary>

````text
轻量包的首次 `--version`、`--help` 或业务调用才会下载执行主机对应的一份原生 CLI；安装 bundle、导入适配器和注册 Skill 本身不触发下载。同包运行清单绑定产品、版本和 SHA-256，不使用 PATH 上其他 CLI，也不在运行时解析 `latest`。

下载按 GitHub、用户配置的兼容 npm 二进制镜像、公共 npmmirror 顺序尝试，配置规则见同包安装说明。网络失败可回退；大小或摘要不符立即停止。下载提示写 stderr，不混入业务 JSON。失败后重试同一个包内入口，业务命令报错不会触发重新安装。

同一系统用户的 npm、DSH 和 Skill 入口按产品、版本和平台共享缓存，命中后不访问下载站。显式更新安装包才使用新版本，不删除其他入口仍可能需要的版本。原生可执行缓存与 OAuth Session 是独立状态：换 DSH profile 不代表换系统用户或迁移登录态。

## 通过公开 GitHub 桥接安装

```sh
dsh plugin --profile headless add github:fnnas-labs/fnos-cli-skill
```

桥接声明依赖 `@fnnas-labs/fnos-cli@latest`，由 `index.mjs` 加载实际安装依赖中的适配器、同包 CLI 与 Skill。无需全局 CLI。Git tag 不锁定 CLI 版本；包管理器 lockfile 可能保留旧依赖，需要显式升级。需要可复现安装时选择明确 npm 版本。公开仓库中的适配器是审阅快照，运行时使用安装依赖提供的适配器。
````

</details>

#### 缺口

- 未实现且未测错配率
  **影响**：不能将拟议收据计入本版功能
  **进一步探讨**：按预先定义的旧包、容器和 profile 错配作有标记回放

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
