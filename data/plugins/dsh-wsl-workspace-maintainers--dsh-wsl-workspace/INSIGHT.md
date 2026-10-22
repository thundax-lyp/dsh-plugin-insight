# dsh-wsl-workspace

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[00106d9](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/tree/00106d9575d8d087daec0596dd51f283f78dcdbb)

<!-- BEGIN META -->
[![GitHub ★ 96](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=96&color=yellow&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace) [![npm 30d 2,975](https://img.shields.io/static/v1?label=npm+30d&message=2%2C975&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-wsl-workspace)
<!-- END META -->

> **实现功能**：从DSH界面添加WSL工作区，将会话命令、文件工具和模式接到选定发行版，并提供交互终端与作业接线。

> **核心亮点**：将既有模式的shell/fs消费者统一到WSL realm，保持会话发行版与用户并适配9P真实路径/发布语义，减少仅转发bash导致的跨世界错位；上游执行器/fs机制按NOTICE归属。详见[Q02](#research-q02)。

> **风险与缺陷**：文件工具有条件守policy，普通命令由partial/no-op sandbox放行；policy解析失败文件侧也不围栏。shell消失或等待输入可自动整命令重跑，先前副作用可能重复，未做实际复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 为什么需要整个WSL工作区，合格任务是什么？](#detail-section-11)
  - [Q02 · 工作区、preset和shell/fs如何统一？](#detail-section-12)
  - [Q03 · 文件与命令隔离边界是否相同？](#detail-section-13)
  - [Q04 · 持久shell、PTY重跑和恢复会引入什么风险？](#detail-section-14)
  - [Q05 · 安装、使用和恢复依赖什么？](#detail-section-15)
  - [Q06 · 成本和效果能判断到哪一层？](#detail-section-16)
  - [Q07 · 采用建议与未来假设是什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Windows/WSL开发者需要同会话shell、文件与搜索处在相同发行版/用户和路径中，合格任务还需明确取消恢复及副作用。

手动wsl.exe加UNC访问或在WSL内另装宿主是直接参照；插件统一整会话世界，不提供工作区级Linux命令沙箱。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| WSL工作区 | 选择发行版、目录和用户 | Windows/WSL与UNC通路，回环不等于身份鉴权 |
| 模式变体 | 原模式组合WSL执行世界 | 随宿主roster/API代际变化 |
| shell/fs统一 | Linux命令和文件工具对同路径操作 | 文件policy与任意命令权限不同 |
| 持久bash | 保留cd/export及帧协议输出 | shell退出或PTY升级可重跑副作用 |
| 交互终端 | open/send/read/signal/close/list | 输入进入记录，受宿主PTY与用户权限约束 |
| 作业与恢复 | 跟踪后台输出、取消和重建 | 需要核对未恢复状态及重复执行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows、可访问WSL发行版与bash | 目标场景必需 | 执行世界与UNC文件通路 | 路径/发行版不可用无法完成该场景 |
| Node>=24、宿主Cordis与多项服务接口 | 包声明/接线必需 | preset、fs、shell、tools、subprocess等 | optional peer不代表运行可缺契约 |
| wsl.exe与9P访问 | shell/fs分支需要 | 启动发行版、翻译Linux路径 | 用户/挂载和真实路径需核对 |
| 对应宿主preset/PTY代际 | 模式与持久分支需要 | 生成变体并探测持久shell能力 | 旧宿主退单次shell，未知代际需明确报错 |
| sandboxPolicy | 文件工具围栏需要 | 解析read-only/workspace-write | 缺失/解析异常文件侧放行，不提供总安全保证 |
| PTY、script及进程观测 | 交互/重跑分支需要 | 终端输入与等待诊断 | 不能凭普通命令成功确认终端全功能 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选择可丢弃发行版/目录与非敏感用户，明确命令边界 | 不把WSL world当项目级沙箱 |
| 安装 | 固定包来源后重启宿主，打开WSL工作区入口 | 模式与shell/fs消费者实际挂到对应realm |
| 选择 | 核对发行版、Linux路径和工作区用户 | pwd、文件读写和搜索指向一致 |
| 使用 | 区分普通bash、wsl_terminal和后台作业 | 非幂等命令要避免自动重跑风险 |
| 恢复 | 检查restarted/skipped及作业终止，必要时重建会话 | 不盲目重复已可能执行的动作 |

包声明多宿主版本兼容，README称隔离实例验证；这些是作者材料，不转为本轮host_acceptance。目录成员关系本轮不足以确定，来源记unknown不代表仓库移除或不可用。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | WSL与宿主资源、预构建包及变体持久化 | 选择发行版/用户、重启、检查接口代际和路径 | 本轮没有安装时间和内存测量 |
| 持续使用 | 每Agent持久进程、9P文件IO、/proc探测和PTY | 理解持久cd/export、背景进程与政策差异 | 任务规模、缓存与资源峰值未知 |
| 失败恢复 | shell重建、状态回放、进程清理与可能重跑 | 核对第一次副作用、未恢复环境及外部状态 | 重复动作和人工核对可超过省下的接线 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 世界一致 | 同realm shell/fs和会话发行版事实 | 自身宿主/发行版组合实际完整兼容 |
| 状态保持 | 持久shell、队列和回放 | 任意程序/资源下恢复正确性 |
| 文件策略 | realpath与write/edit目标检查 | 竞态、policy缺失及命令侧等价隔离 |
| 交互 | 终端工具与PTY升级分支 | 真正等待识别、尾延迟和副作用恢复 |

作者README包含具体毫秒、矩阵和内存背景数字，本轮没有运行原任务，不将其当独立结果或普遍性能阈值。默认每流256KiB等上限是局部配置而非整个会话成本。引入WSL世界还能访问Windows挂载，迁移成本包括凭据、环境与退出清理，而不只安装一个插件。

> **思考**：文件工具有条件守policy，普通命令由partial/no-op sandbox放行；policy解析失败文件侧也不围栏。shell消失或等待输入可自动整命令重跑，先前副作用可能重复，未做实际复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将既有模式的shell/fs消费者统一到WSL realm，保持会话发行版与用户并适配9P真实路径/发布语义，减少仅转发bash导致的跨世界错位；上游执行器/fs机制按NOTICE归属。详见[Q02](#research-q02)。

将既有模式的shell/fs消费者统一到WSL realm，保持会话发行版与用户并适配9P真实路径/发布语义，减少仅转发bash导致的跨世界错位；上游执行器/fs机制按NOTICE归属。详见[Q02](#research-q02)。

持久shell用管道帧/nonce而非终端画面哨兵确定完成，单会话队列串行执行，按Agent所有权保存shell并在Agent scope结束清理。它保留cd、export等状态，结束或卡住后会重建并回放部分环境，输出说明未恢复项和清理进程。相较终端重绘判定，独立协议通道是可借鉴设计；移植需适配宿主subprocess、PTY和Linux进程观测。

自动恢复并非恰好一次执行。session.run在子shell已消失且非abort/starved时重建后执行同一命令第二次；工具正文也明确shellExited的前半段副作用会发生两次。等待键盘输入的命令可被停止后在PTY里重跑，tty:false能否决这一路径。一个先写文件再退出或先发请求再等待输入的命令，已发生的动作不会由重建撤销。因此不能把“从崩溃透明恢复”当非幂等任务安全保证。

等待判定读取/proc状态，opaque情形可能以发行版root再观察一次，失败后降级不重复探测。wsl_terminal提供open/send/read/signal/close/list，输入会进入会话记录，秘密不应因为工具可输入就当作不会留痕。普通bash默认stdin为受限帧输入或/dev/null，背景工具运行在另一个进程，不共享持久shell的cd/export。工程契约公开这些差异，但正确解释仍需操作者和模型配合，本轮未执行兼容矩阵。

<a id="detail-section-5"></a>

### 1.4 主要限制

文件工具有条件守policy，普通命令由partial/no-op sandbox放行；policy解析失败文件侧也不围栏。shell消失或等待输入可自动整命令重跑，先前副作用可能重复，未做实际复现。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。熟悉WSL的维护者可先在可丢弃发行版核对路径、用户、policy和无副作用恢复；不把read-only当命令只读，结果不明时不盲目重跑真实项目动作。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持整世界组合及路径适配贡献；命令无项目级沙箱、policy失败放行与自动重跑构成重要边界；执行收据为未实现假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、NOTICE、src/index.ts、src/shell.ts、src/fs.ts、src/host/variants.ts、src/host/wsl-sandbox.ts、src/host/wsl-run-code-guard.ts、src/host/wsl-bash-session.ts、src/host/wsl-bash-tool.ts、src/host/wsl-terminal-tool.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本检查preset realm、单次shell路径、文件策略与符号链接、sandbox/run_code分层、持久shell队列/重跑及HTTP面；未完整审计全部兼容适配，未运行代码或WSL。来源目录本轮成员关系未充分确认。
- 下一步：进一步探讨可从唯一token副作用后exit/等待键盘的可丢弃任务入手，核对执行次数与恢复说明，再分别验证文件工具策略和命令权限。

**分析版本**

- **仓库**：[dsh-wsl-workspace-maintainers/dsh-wsl-workspace](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace)
- **版本号**：0.7.9（[固定提交 00106d9](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/tree/00106d9575d8d087daec0596dd51f283f78dcdbb)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索幂等/禁止重跑声明与attempt收据，结果未知时显式交还判断，比较重复副作用、恢复成功率和人工次数；尚未实现。详见[Q07](#research-q07)。

进一步探讨可从唯一token副作用后exit/等待键盘的可丢弃任务入手，核对执行次数与恢复说明，再分别验证文件工具策略和命令权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 29 | 4832 | — | — | 175795 |
| .mjs | source | 33 | 5977 | 4080 | 1573 | — |
| .js | source | 17 | 9756 | 6464 | 3385 | — |
| .mjs | test | 41 | 11888 | 7852 | 3327 | — |
| .tsx | source | 2 | 530 | 398 | 109 | — |
| .ts | source | 31 | 12128 | 6817 | 4690 | — |
| .ts | test | 23 | 5541 | 3810 | 1293 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=grey&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 22](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=22&color=grey&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/issues?q=is%3Aissue+created%3A2026-09-22T05%3A06%3A41.012Z..2026-10-22T05%3A06%3A41.012Z) [![近30天关闭 18](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=18&color=grey&logo=github&style=flat)](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A06%3A41.012Z..2026-10-22T05%3A06%3A41.012Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**判断固定版本整会话WSL执行世界的接线贡献、权限分层和重跑恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 为什么需要整个WSL工作区，合格任务是什么？

**研究主题：**场景与需求

#### 完整回答

面向Windows上已用WSL进行开发、又希望继续使用DSH web或Desktop会话的开发者。目标不是给bash命令加一个wsl前缀，而是让同一Agent的文件读写、搜索、命令、背景作业、终端和模式组合处在同一个发行版/工作目录语义中。合格任务应在选定发行版和用户下读写正确文件，命令与文件工具看到一致状态，取消与恢复可解释。

原有办法是手工wsl.exe执行命令、用UNC访问文件，或另开Linux宿主。只转发shell仍可能让文件工具操作Windows路径、子进程使用不同用户、模式切换掉回原世界。插件的价值在整会话接线及可见工作区选择，尤其不要求向发行版安装完整DSH工具链。

WSL不是工作区写入沙箱。发行版内用户可能访问其Linux文件和/mnt下Windows文件，任意命令的权限与发行版账户、挂载和宿主共享决定；不能从界面显示WSL推断只可触及项目目录。任务涉及非幂等外部动作时，还要理解持久shell的自动重跑边界。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-7](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/README.md#L7-L7)

作者说明整会话WSL与/mnt Windows访问范围。

```text
Add a WSL workspace from the DeepSeek Harness web GUI and run the whole agent session — bash commands and file reads/writes — inside a local WSL distribution with Linux paths. Nothing needs to be installed inside WSL. The session can reach both WSL and Windows at the same time: bash commands run inside the WSL distribution, while Windows files stay accessible via `/mnt/<drive>` (for example `/mnt/c/Users/...`).
```

**依据 2 · 源码核查**：[src/index.ts:1-25](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/index.ts#L1-L25)

源码定义preset变体、工作区路由和发行版会话事实。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * Host half of dsh-wsl-workspace. Three responsibilities:
 *
 * 1. Publish a `wsl-<mode>` variant for every healthy roster preset, so the
 *    WSL execution world — `shell-wsl` + `fs-wsl` behind one entry-local
 *    realm, with `tool-bash`/`tool-fs` consumers — composes with ANY mode
 *    instead of being a mode itself. The channel follows the release:
 *    `0.1.7-alpha.1+` stopped scanning any user preset root and builds its roster
 *    from declarative `@deepseek-ai/dsh-agent-preset` rows, so there a variant
 *    is a *declaration registered through `ctx.agentPresets`* — and only that
 *    path rewrites the absolute provider specifiers below into `file:` URLs,
 *    because a registered preset's entry tree does not translate them the way
 *    the boot-time Include does; earlier releases still get a variant directory
 *    under `<dshHome>/.agent-presets/`, whose legacy standalone `wsl` directory
 *    and stale variants are removed on boot.
 *
 * 2. Serve the browser dialog's data route (`/wsl-workspace/api`):
 *    distribution discovery, one-level directory listing, path checks, and
 *    the per-workspace username store — all over the 9P UNC share.
 *    Loopback-only, matching the sensitivity of the privileged configuration
 *    surface.
 *
 * 3. Contribute the per-session `DSH_WSL_DISTRO` managed-env fact so the WSL
 *    shell executor can resolve a plain Linux `workdir` to the calling
 *    session's distribution.
```

</details>

**依据 3 · 源码核查**：[src/host/wsl-sandbox.ts:13-17](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-sandbox.ts#L13-L17)

源码明确命令不受Windows runner围栏，文件工具另守策略。

```text
 * So the world declares its own provider: commands run unconfined by the
 * Windows runner — the distribution is the boundary — while the file tools keep
 * enforcing the policy themselves, at the resolved real path, in
 * `src/fs.ts`. `enforcement: 'partial'` records that split honestly: within this
 * world the policy is enforced for file effects, not by the wrapped command.
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工作区、preset和shell/fs如何统一？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

宿主为已有健康模式构造wsl-*变体，按宿主代际选择注册声明或生成旧式preset目录。变体内通过entry-local realm同时隔离shell/fs，并在持久栈中提供自己的sandbox provider，工具消费者落入相同世界。工作区选择路由发现发行版、列目录并保存用户，shellEnv把会话UNC路径中的发行版传给Linux绝对路径调用。

WslShellExecutor将UNC、Linux绝对路径或Windows驱动器路径统一为发行版、Linux cwd与Windows启动cwd，再构造wsl.exe -d/-u/--cd/-e bash参数。登录shell会额外显式cd以免profile把位置改回HOME。文件系统继承上游LocalFileSystem的版本和写入机制，按每次执行的会话cwd翻译路径；9P无法直接描述的符号链接或新目标再询问发行版realpath，避免字面路径身份不一致。

贡献是模式组合与跨路径世界的一致接线，不是新虚拟化或文件系统。NOTICE明确归属上游shell/fs机制，插件增加WSL argv、WSLENV、路径转换与rename式发布适配。相较手工wsl命令，这让同一会话的工具/模式互相配合；相较在WSL另装宿主，减少一套部署，但真实兼容与性能收益仍未由本轮运行验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/variants.ts:223-253](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/variants.ts#L223-L253)

entry-local shell/fs与sandbox组成同一world。

<details>
<summary>查看原文（31行）</summary>

```text
  return [
    '# ── WSL execution world (dsh-wsl-workspace variant) ─────────────────────',
    '# The shell and fs services are provided entry-locally (the isolate',
    '# realm); host services (tools registry, shell-env, jobs) fall through.',
    '- id: wsl-world',
    "  name: cordis:group",
    '  group: true',
    '  isolate:',
    '    shell: true', // portability-allow: a YAML fragment for a plugin's own `isolate:` block, not a spawn option
    '    fs: true',
    // The Windows confinement runner cannot describe a Linux path, so the
    // world owns the capability (see the sandbox row below) whenever it mounts
    // a shell that would otherwise call it.
    ...(persistent === undefined ? [] : ['    sandbox: true']),
    '  config:',
    `    - id: shell-wsl`,
    `      name: '${shellPath.replace(/'/g, "''")}'`,
    '    - id: fs-wsl',
    `      name: '${fsPath.replace(/'/g, "''")}'`,
    ...(persistent === undefined
      ? []
      : [
          '    - id: sandbox-wsl',
          `      name: '${persistent.sandboxPath.replace(/'/g, "''")}'`,
        ]),
    // The shell tool comes from the persistent-shell group when this world has
    // one (same `bash` name, so only one of the two may be mounted).
    ...(persistent === undefined
      ? ['    - id: tool-bash', "      name: '@deepseek-ai/dsh-tool-bash'"]
      : []),
    '    - id: tool-fs',
```

</details>

**依据 2 · 源码核查**：[src/shell.ts:240-289](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/shell.ts#L240-L289)

路径和发行版/用户规划，固定wsl argv。

<details>
<summary>查看原文（50行）</summary>

```text
  private plan(spec: ShellExecSpec): WslPlan {
    const workdir = spec.workdir
    let distro: string
    let linuxCwd: string
    let windowsCwd: string
    let username: string | undefined
    const unc = parseWslUnc(workdir)
    if (unc !== null) {
      distro = unc.distro
      linuxCwd = unc.linuxPath
      // The `wsl.exe` process itself needs a plain Windows directory: its own
      // cwd is irrelevant (`--cd` sets the Linux side), and spawning with a
      // UNC cwd is a documented Node/Windows edge. SystemRoot always exists.
      windowsCwd = process.env.SystemRoot ?? process.cwd()
      username = this.resolveUser(spec, joinUnc(unc.distro, unc.linuxPath))
    } else if (workdir.startsWith('/')) {
      distro = this.resolveDistro(spec)
      linuxCwd = workdir
      windowsCwd = process.cwd()
      username = this.resolveUser(spec, undefined)
    } else {
      const mnt = windowsToMntPath(workdir)
      if (mnt === null) {
        throw new Error(`wsl-shell: workdir "${workdir}" is not in the WSL execution world`)
      }
      distro = this.resolveDistro(spec)
      linuxCwd = mnt
      windowsCwd = workdir
      username = this.resolveUser(spec, undefined)
    }
    const env = this.withWslEnv(spec)
    // A login shell (`-lc`) loads /etc/profile + the user profile chain, and
    // several of those reset the cwd to $HOME (observed on Ubuntu 22.04 with
    // a zsh user default: `wsl.exe --cd <dir> -e bash -lc 'pwd'` prints the
    // home directory, while `-c` honors `--cd`). The model-facing cwd must
    // be the resolved workdir in both modes, so prefix an explicit `cd`
    // when the login shell runs. `cd` into a deleted directory fails the
    // command exactly like `--cd` would; the failure text is unchanged.
    const command = this.config.loginShell
      ? `cd '${linuxCwd.replace(/'/g, `'\\''`)}' && ${spec.command}`
      : spec.command
    const argv = [
      this.config.wslPath,
      '-d', distro,
      ...(username !== undefined && username !== '' ? ['-u', username] : []),
      '--cd', linuxCwd,
      '-e', 'bash',
      this.config.loginShell ? '-lc' : '-c',
      command,
    ]
```

</details>

**依据 3 · 源码核查**：[src/fs.ts:93-117](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/fs.ts#L93-L117)

会话cwd隔离与9P发布边界替换。

<details>
<summary>查看原文（25行）</summary>

```text
export class WslFileSystem extends LocalFileSystem {
  static override Config: z<Config> = z.object({
    cwd: z.string(),
    distro: z.string(),
    diffBasisMaxBytes: z.number().default(10 * 1024 * 1024),
  })

  private readonly distro: string | undefined
  private readonly executionCwd = new AsyncLocalStorage<string | undefined>()

  constructor(ctx: Context, config: Config) {
    // schemastery fills the defaults before construction; the parent validates
    // `diffBasisMaxBytes` and stores the resolved shape.
    super(ctx, config)
    this.distro = config.distro
    ctx.on('tools/execute', (exec: ToolExecution, next: () => unknown) => (
      this.executionCwd.run(exec.agent?.session.header.cwd, next)
    ))
    // The 9P/drvfs substrate has no hard links and no Win32 security semantics:
    // replace the atomic-publication boundaries the parent's fsio defaults to.
    this.internals = {
      linkFile: WslFileSystem.publishNoReplace,
      replaceFile: WslFileSystem.replaceOverWrite,
      copyFileDacl: WslFileSystem.skipDaclCopy,
    }
```

</details>

**依据 4 · 源码核查**：[src/fs.ts:228-247](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/fs.ts#L228-L247)

resolved目标再作link-aware身份处理。

<details>
<summary>查看原文（20行）</summary>

```text
  override async resolve(path: string, opts?: { cwd?: string; signal?: AbortSignal }): Promise<FsTarget> {
    if (opts?.signal?.aborted) throw new FsError('resolve aborted', 'FS_ABORTED')
    const { input, cwd } = this.translate(path, opts?.cwd)
    const resolved = { cwd, ...opts?.signal !== undefined ? { signal: opts.signal } : {} }
    let local: FsTarget
    try {
      local = await super.resolve(input, resolved)
    } catch (error) {
      const real = await this.linkAwarePath(input, input)
      if (real === undefined) throw error
      return this.wslTarget(await super.resolve(real, resolved))
    }
    // The share resolves a link path to a *lexical* identity: `lstat` on a
    // Linux symlink fails, so the local resolver hands back the deepest
    // existing ancestor plus the remaining segments. Ask the distribution
    // before accepting that identity, or a link would be treated as a plain
    // missing file (and a write through it would escape the policy).
    const real = await this.linkAwarePath(input, String(local.targetKey))
    if (real === undefined) return this.wslTarget(local)
    return this.wslTarget(await super.resolve(real, resolved))
```

</details>

**依据 5 · 作者声明**：[NOTICE:18-32](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/NOTICE#L18-L32)

作者明确上游继承与插件增量归属。

<details>
<summary>查看原文（15行）</summary>

```text

- `@deepseek-ai/dsh-bash-local` (packages/shell/bash-local) — the executor
  mechanics of `WslShellExecutor` (`src/shell.ts`) are adapted from this
  package: the fused timeout/abort deadline, bounded collect output with
  spill files, the background-process adaptation, and the `ENV_OVERRIDES`
  model-friendly environment set. The WSL argv, WSLENV translation, and
  workdir planning are original to this plugin.
- `@deepseek-ai/dsh-fs-local` (packages/fs/fs-local) — `WslFileSystem`
  (`src/fs.ts`) subclasses `LocalFileSystem` unchanged for realpath target
  identity, per-target write locks, atomic staging, and version guards, and
  overrides the atomic-publication primitives (rename-based, since the WSL
  9P share has no hard links) plus the path-world translation.
- `apps/cli/config/agent-presets/{standard,minimal,code,cordis}/agent.cordis.yml`
  — the preset-variant generator (`src/host/variants.ts`) reads and
  transforms these shipped compositions; the variant persona text is
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 文件与命令隔离边界是否相同？

**研究主题：**缺陷与关键质疑

#### 完整回答

不相同。文件writeText/editText会先checkedTarget，read-only拒绝，workspace-write重新resolve后检查可写根，并把经过检查的同一目标交给父实现。它考虑Linux符号链接和9P身份，这是实际有意义的防线。但当per-call policy不可用、服务缺失或resolve抛错时sandboxPolicy返回undefined，checkedTarget放行；所以文件围栏也是部署和调用上下文有条件成立。

命令世界的WslSandboxProvider原样返回argv并声明enforcement=partial，没有Linux内的系统调用或文件访问围栏。任意bash、终端和背景任务不受上述文件工具写入根约束。run_code另有针对workspace-write+WSL9P的拒绝guard，作用是避免已知Windows ACL启动失败，不会把普通shell变成受限沙箱，也不能由read-only选项推断命令只读。

HTTP工作区面是回环socket+回环Host+POST检查，所读处理器没有Origin或身份判断；不能把localhost当所有本地网页/进程之间的授权隔离。发行版和工作区用户选择属于敏感配置，应结合宿主本地访问控制。这里是静态边界核查，未进行越权、符号链接竞态或浏览器跨源复现。

#### 证据与依据

**依据 1 · 源码核查**：[src/fs.ts:282-296](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/fs.ts#L282-L296)

无policy或解析异常返回undefined，有条件围栏。

<details>
<summary>查看原文（15行）</summary>

```text
   * The host file-effect policy for this call: the tool layer's per-call value
   * when it passes one, else the service's own resolution. `undefined` means
   * the deployment mounts no policy at all — the same state as a host
   * filesystem without `fs-sandbox`, so nothing is fenced.
   */
  protected sandboxPolicy(perCall?: SandboxPolicyLike): SandboxPolicyLike | undefined {
    if (isSandboxPolicy(perCall)) return perCall
    const service = this.sandboxPolicyService()
    if (service === undefined) return undefined
    try {
      const policy = service.resolve()
      return isSandboxPolicy(policy) ? policy : undefined
    } catch {
      // A policy that cannot resolve (no session in scope) fences nothing.
      return undefined
```

</details>

**依据 2 · 源码核查**：[src/fs.ts:326-342](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/fs.ts#L326-L342)

read-only/workspace-write具体检查，undefined放行。

<details>
<summary>查看原文（17行）</summary>

```text
  private async checkedTarget(target: FsTarget, perCall?: SandboxPolicyLike): Promise<FsTarget> {
    const policy = this.sandboxPolicy(perCall)
    if (policy === undefined || policy.mode === 'danger-full-access') return target
    if (policy.mode === 'read-only') {
      throw new FsError(
        `cannot write "${target.displayPath}": file access denied under read-only mode`,
        'FS_SANDBOX_DENIED',
      )
    }
    if (policy.mode !== 'workspace-write') return target
    const fresh = await this.resolve(target.displayPath)
    for (const root of this.writableRoots(policy)) {
      if (this.underRoot(String(fresh.targetKey), root)) return fresh
    }
    throw new FsError(
      `cannot write "${target.displayPath}": file access denied under workspace-write mode`,
      'FS_SANDBOX_DENIED',
```

</details>

**依据 3 · 源码核查**：[src/host/wsl-sandbox.ts:26-43](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-sandbox.ts#L26-L43)

confine原样argv、partial标记，无命令围栏。

<details>
<summary>查看原文（18行）</summary>

```text
/** The WSL world's no-op confinement: the caller's argv, unchanged. */
export class WslSandboxProvider extends SandboxProvider {
  constructor(ctx: Context) {
    super(ctx)
  }

  /**
   * Hand back the caller's own argv.
   * @param argv - the command the caller wants to run.
   * @returns the same argv, with the world's honest enforcement claim.
   */
  override confine(argv: readonly string[]): ConfinedArgv {
    return {
      argv: [...argv],
      enforcement: 'partial',
      denialSignatures: [],
      runnerFailureRules: [],
    }
```

</details>

**依据 4 · 源码核查**：[src/host/wsl-run-code-guard.ts:77-84](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-run-code-guard.ts#L77-L84)

只对特定tool和mode/root shape拒绝。

```text
export function denyRunCodeOn9p (exec: ExecFace, policy: { mode?: string; workspaceRoot?: string } | undefined): string | undefined {
  if (exec.name !== RUN_CODE_NAME || policy === undefined) return undefined
  // An escalated call carries the mode the user approved; only the plain session setting is ours to read.
  if (typeof exec.arguments?.sandbox_permissions === 'string') return undefined
  if (policy.mode !== WRITE_MODE) return undefined
  const root = policy.workspaceRoot
  if (typeof root !== 'string' || !isWsl9pRoot(root)) return undefined
  return refusalForRoot(root)
```

**依据 5 · 源码核查**：[src/index.ts:1253-1284](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/index.ts#L1253-L1284)

路由只核回环Host/socket、POST和JSON形状。

<details>
<summary>查看原文（32行）</summary>

```text
  const webServer = ctx.get('webServer') as unknown as WebServerService
  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: resolved.route,
    handler: async (req, res) => {
      if (!isLoopback(req.socket.remoteAddress) || !isLoopbackHost(req.headers.host)) {
        json(res, 403, { ok: false, error: 'loopback-only' })
        return
      }
      if (req.method !== 'POST') {
        json(res, 405, { ok: false, error: 'method not allowed' })
        return
      }
      let body: Record<string, unknown>
      try {
        body = await readBody(req)
      } catch (error) {
        json(res, 400, { ok: false, error: messageOf(error) })
        return
      }
      const method = typeof body.method === 'string' ? body.method : ''
      const params = body.params === undefined ? {} : body.params
      if (params === null || typeof params !== 'object' || Array.isArray(params)) {
        json(res, 400, { ok: false, error: 'params must be an object' })
        return
      }
      try {
        const value = await dispatch(method, params as Record<string, unknown>)
        json(res, 200, { ok: true, value })
      } catch (error) {
        json(res, 200, { ok: false, error: messageOf(error) })
      }
```

</details>

#### 缺口

- 没有实际部署的policy解析失败、符号链接竞态和本地跨源访问行为记录。
  **影响：**不能将分层控制写成同版本强隔离验收。
  **进一步探讨：**继续探讨可先核对固定宿主policy上下文与HTTP访问链，再用可丢弃发行版分别对文件工具和命令检查边界。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 持久shell、PTY重跑和恢复会引入什么风险？

**研究主题：**工程质量与复用

#### 完整回答

持久shell用管道帧/nonce而非终端画面哨兵确定完成，单会话队列串行执行，按Agent所有权保存shell并在Agent scope结束清理。它保留cd、export等状态，结束或卡住后会重建并回放部分环境，输出说明未恢复项和清理进程。相较终端重绘判定，独立协议通道是可借鉴设计；移植需适配宿主subprocess、PTY和Linux进程观测。

自动恢复并非恰好一次执行。session.run在子shell已消失且非abort/starved时重建后执行同一命令第二次；工具正文也明确shellExited的前半段副作用会发生两次。等待键盘输入的命令可被停止后在PTY里重跑，tty:false能否决这一路径。一个先写文件再退出或先发请求再等待输入的命令，已发生的动作不会由重建撤销。因此不能把“从崩溃透明恢复”当非幂等任务安全保证。

等待判定读取/proc状态，opaque情形可能以发行版root再观察一次，失败后降级不重复探测。wsl_terminal提供open/send/read/signal/close/list，输入会进入会话记录，秘密不应因为工具可输入就当作不会留痕。普通bash默认stdin为受限帧输入或/dev/null，背景工具运行在另一个进程，不共享持久shell的cd/export。工程契约公开这些差异，但正确解释仍需操作者和模型配合，本轮未执行兼容矩阵。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/wsl-bash-session.ts:326-348](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-bash-session.ts#L326-L348)

childGone分支自动重建再执行，并不证明第一次未生副作用。

<details>
<summary>查看原文（23行）</summary>

```text
  async run(command: string, timeoutMs: number, signal?: AbortSignal, ownTerminal = false, stdin?: string): Promise<WslBashRun> {
    const previous = this.queue
    let release: () => void = () => {}
    this.queue = new Promise<void>(resolve => { release = resolve })
    await previous
    try {
      if (this.disposed) throw new Error('wsl-bash: the session is closed')
      const first = await this.execute(command, timeoutMs, signal, DEFINITION.test(command), ownTerminal, stdin)
      if (first.settled) return first.run
      // A starved frame is not re-executed here: the command was blocked on a terminal, so running it
      // again in the same kind of shell would block again. The tool retries it on a pseudo-terminal.
      // The frame went out and no record came back. Two different worlds, and the difference that
      // matters is whether the command may have run. A dead child cannot still hold the shell, so
      // replaying there is safe and keeps a crash transparent. A live one may be mid-command, and a
      // command that merely exceeded its deadline must not be executed a second time — `git commit`,
      // `curl -X POST`, `rm`. So rebuild either way, which kills whatever is wedged and stops the
      // *next* call queueing behind it, and re-execute only when the child was already gone.
      const childGone = this.exited
      const recovery = await this.rebuild()
      const recovered = { restarted: true, ...recovery }
      if (!childGone || signal?.aborted === true || first.run.starved !== undefined) return { ...first.run, ...recovered }
      const second = await this.execute(command, timeoutMs, signal, DEFINITION.test(command), ownTerminal, stdin)
      return { ...second.run, ...recovered }
```

</details>

**依据 2 · 源码核查**：[src/host/wsl-bash-tool.ts:324-338](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-bash-tool.ts#L324-L338)

shellExited输出明确报告重复执行及状态恢复。

<details>
<summary>查看原文（15行）</summary>

```text
  // The command asked for the shell to end — `… ; exit 3`, a `set -e` body, a script that finishes with
  // `exit`. That is not a cancelled call, and the reply a cancellation produces (`Error: tool call
  // aborted`, no streams) is the one answer that tells the model nothing about what its own command did.
  // Measured on the installed 0.7.7 build: this shape came back with nothing, and the evidence that the
  // shell had been rebuilt arrived on the *next* call, where it reads as that call's own event.
  if (run.shellExited) {
    notes.push('[this command ended the session shell itself (bash left with the code reported here), so it was run once more after the shell was rebuilt: anything it did before ending has been done twice, and this answer is from that second run. A command that must exit non-zero without ending its shell should wrap itself in its own `bash -c` body, or use `wsl_terminal`]')
  }
  if (run.restarted) {
    notes.push(run.skipped === undefined || run.skipped.length === 0
      ? '[the shell was restarted and its directory, exported variables, options and aliases were replayed]'
      : `[the shell was restarted; not restored: ${run.skipped.join(', ')}]`)
  }
  if (run.reaped !== undefined && run.reaped > 0) {
    notes.push(`[${run.reaped} detached process${run.reaped === 1 ? '' : 'es'} from the previous shell ${run.reaped === 1 ? 'was' : 'were'} stopped]`)
```

</details>

**依据 3 · 源码核查**：[src/host/wsl-bash-tool.ts:577-604](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-bash-tool.ts#L577-L604)

每Agent scope绑定shell与清理。

<details>
<summary>查看原文（28行）</summary>

```text
      let session = sessions.get(ownerKey)
      if (session === undefined) {
        const spec = buildSessionSpec(resolved, headerCwd)
        if (spec === undefined) {
          throw new Error('wsl-bash: no WSL distribution could be resolved for this session')
        }
        session = new WslBashSession(spawnHost(), spec)
        sessions.set(ownerKey, session)
        // The shell belongs to the agent that made it, not to the plugin. Without a registration on
        // the agent's own scope, every agent that ever called `bash` leaves a shell — two `wsl.exe` and
        // about 9 MB of Windows working set — alive until the whole world is disposed, which a user
        // with several sessions can see as memory that never comes back. `effect` is cordis's scope
        // hook: the disposer it returns runs when that agent's scope ends.
        const created = session
        const scope = (exec.agent as {
          ctx?: { effect?: (setup: () => (() => void) | void) => unknown }
        } | undefined)?.ctx
        const register = scope?.effect
        if (typeof register === 'function') {
          register(() => () => {
            if (sessions.get(ownerKey) !== created) return
            sessions.delete(ownerKey)
            void created.dispose()
          })
        }
        await session.start().catch((error: unknown) => {
          sessions.delete(ownerKey)
          throw error instanceof Error ? error : new Error(String(error))
```

</details>

**依据 4 · 源码核查**：[src/host/wsl-bash-tool.ts:612-639](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-bash-tool.ts#L612-L639)

starved等待被转PTY再执行，tty:false可否决。

<details>
<summary>查看原文（28行）</summary>

```text
      let run = await session.run(command, timeoutMs, exec.signal, escalated, args.stdin)
      // What the session did that the body cannot show, in the order the model has to read it.
      const before: string[] = []
      // The command was caught waiting for a keyboard, so give it what a person at a terminal would: a
      // terminal of its own, in this same call. Its stdin is still `script`'s end-of-file, so what comes
      // back is the program's own complaint instead of a deadline — measured with `sudo`, which answered
      // with its own three lines in 9.4 s of a 25 s call (2026-10-05) after having sat on the pipe for
      // the whole deadline before. `tty: false` vetoes this, because a caller that only wanted the plain
      // pipe must be able to insist on it.
      // `run.restarted` is deliberately not part of this: a starved call whose shell had to be restarted
      // (a builtin that read the terminal blocked the shell itself) still wants the pseudo-terminal
      // retry — the command never did anything but wait.
      if (!escalated && !vetoTty && run.starved !== undefined && !run.aborted) {
        const first = { kind: run.starved, atMs: run.starvedAtMs ?? 0, viaRoot: run.starvedViaRoot === true, shellInterrupted: run.starvedShellInterrupt === true }
        logging?.debug?.(`wsl-bash: stopped a command waiting for input (${first.kind}${first.viaRoot ? ' via the root plane' : ''} at ${first.atMs}ms) and re-running it on a pseudo-terminal`)
        escalated = true
        before.push(retryNote(first.kind, first.atMs, first.viaRoot, first.shellInterrupted))
        command = wrap(wrapForTty(args.command))
        // What the first attempt did to the shell is a fact about this call, not about the attempt it
        // was found in: a builtin that read the terminal blocks the shell itself, so the shell is
        // restarted here, and what that restart could not restore has to reach the note. Measured
        // 2026-10-06: dropped with the first run, the loss went unreported on exactly the path that
        // loses the most.
        const firstRun = run
        const retry = await session.run(command, timeoutMs, exec.signal, true, args.stdin)
        run = { ...retry,
          restarted: retry.restarted || firstRun.restarted,
          skipped: retry.skipped ?? firstRun.skipped }
```

</details>

**依据 5 · 源码核查**：[src/host/wsl-bash-session.ts:741-759](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-bash-session.ts#L741-L759)

opaque等待增加root plane witness与降级。

<details>
<summary>查看原文（19行）</summary>

```text
    // A privileged wait hides its own `/proc` entries, so the user plane can only call it unconfirmable.
    // One pass as the distribution's root settles it: either the terminal read is really there — in
    // which case this is the confirmed reading and acts at once — or the root plane read the wait and it
    // is something else, in which case nothing is stopped at all. That is what replaced waiting eight
    // seconds to be sure, and it is why the unconfirmable window can be as short as it is.
    if (kind === 'opaque' && !watch.witnessed && this.witnessAvailable !== false) {
      watch.witnessed = true
      const witness = await this.probeOnce(this.spec.witnessArgv, elapsed)
      // One failed attempt is enough to stop trying: a distribution without a usable root account would
      // otherwise pay a failed spawn on every privileged wait, and the reading it falls back to is the
      // same one that governs when root answers nothing.
      this.witnessAvailable = witness !== undefined
      const verdict = confirmsTerminalRead(witness)
      if (verdict === true) {
        kind = 'terminal'
        watch.viaRoot = true
        if (witness !== undefined) culprits = witness
      }
      else if (verdict === false) return
```

</details>

#### 缺口

- 非幂等命令遇shell退出或PTY升级时的业务恢复没有本轮对照。
  **影响：**不能承诺自动重跑不造成重复写入、重复提交或外部动作。
  **进一步探讨：**可从“先写唯一收据再exit/等待输入”的最小命令比较执行次数与恢复说明，而非先在真实项目试错。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装、使用和恢复依赖什么？

**研究主题：**依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows、可访问WSL发行版与bash | 目标场景必需 | 执行世界与UNC文件通路 | 路径/发行版不可用无法完成该场景 |
| Node>=24、宿主Cordis与多项服务接口 | 包声明/接线必需 | preset、fs、shell、tools、subprocess等 | optional peer不代表运行可缺契约 |
| wsl.exe与9P访问 | shell/fs分支需要 | 启动发行版、翻译Linux路径 | 用户/挂载和真实路径需核对 |
| 对应宿主preset/PTY代际 | 模式与持久分支需要 | 生成变体并探测持久shell能力 | 旧宿主退单次shell，未知代际需明确报错 |
| sandboxPolicy | 文件工具围栏需要 | 解析read-only/workspace-write | 缺失/解析异常文件侧放行，不提供总安全保证 |
| PTY、script及进程观测 | 交互/重跑分支需要 | 终端输入与等待诊断 | 不能凭普通命令成功确认终端全功能 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选择可丢弃发行版/目录与非敏感用户，明确命令边界 | 不把WSL world当项目级沙箱 |
| 安装 | 固定包来源后重启宿主，打开WSL工作区入口 | 模式与shell/fs消费者实际挂到对应realm |
| 选择 | 核对发行版、Linux路径和工作区用户 | pwd、文件读写和搜索指向一致 |
| 使用 | 区分普通bash、wsl_terminal和后台作业 | 非幂等命令要避免自动重跑风险 |
| 恢复 | 检查restarted/skipped及作业终止，必要时重建会话 | 不盲目重复已可能执行的动作 |

包声明多宿主版本兼容，README称隔离实例验证；这些是作者材料，不转为本轮host_acceptance。目录成员关系本轮不足以确定，来源记unknown不代表仓库移除或不可用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:98-119](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/package.json#L98-L119)

Node与peer条件以固定包声明为准。

<details>
<summary>查看原文（22行）</summary>

```text
  "engines": {
    "node": ">=24"
  },
  "keywords": [
    "deepseek-harness",
    "dsh",
    "wsl",
    "workspace",
    "plugin",
    "windows"
  ],
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-fs": "*",
    "@deepseek-ai/dsh-fs-local": "*",
    "@deepseek-ai/dsh-sandbox": "*",
    "@deepseek-ai/dsh-shell": "*",
    "@deepseek-ai/dsh-subprocess": "*",
    "@deepseek-ai/dsh-timeout": "*",
    "@deepseek-ai/dsh-tool-fs-search": "*",
    "@deepseek-ai/dsh-tools": "*",
    "@deepseek-ai/schemastery": "*"
```

</details>

**依据 2 · 作者声明**：[README.md:9-32](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/README.md#L9-L32)

作者安装及兼容声明，非本轮执行。

<details>
<summary>查看原文（24行）</summary>

````text
## Install

Pick one of the three ways below, then restart `dsh web`:

```powershell
# 1) npm package
dsh plugin --profile web add dsh-wsl-workspace

# 2) GitHub repository (ships the prebuilt lib/, no local build required)
dsh plugin --profile web add https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace

# 3) Local directory (development / self-hosted)
dsh plugin --profile web add D:\path\to\dsh-wsl-workspace
```

After restarting `dsh web`, a W button appears beside Settings at the sidebar foot.

## Compatibility

This build declares these DSH releases, each verified on an isolated instance (its own `DSH_HOME`, dependencies pinned to that release, the full check suite):

`0.1.0-rc.7` · `0.1.0-rc.8` · `0.1.1-rc.1` · `0.1.1-rc.2` · `0.1.2-rc.1` · `0.1.3-alpha.2` · `0.1.5-rc.1` · `0.1.5-rc.2` · `0.1.7-rc.1` · `0.1.7-rc.2` · `0.2.0-rc.2` · `0.2.1-rc.2`

The list mirrors `dsh.compatibility.dshReleases` in `package.json`, and a unit test fails if the two drift apart. `0.2.1-rc.2` is the DSH release DSH Desktop `0.2.1-rc.2` ships — verified against the host inside that application's own bundle, not only against the npm release — so the Desktop is covered by the same declaration; the app's help panel (the dialog's "?" button) shows the same chips next to the plugin version. The plugin detects the DSH generation at runtime and picks the matching API, and a release exposing neither fails loudly instead of leaving an empty workspace. A release outside the list usually still works, but is unverified.
````

</details>

**依据 3 · 源码核查**：[src/shell.ts:304-313](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/shell.ts#L304-L313)

发行版依会话、配置、默认值解析，全部缺失明确错误。

<details>
<summary>查看原文（10行）</summary>

```text
  private resolveDistro(spec: ShellExecSpec): string {
    const fromEnv = spec.dshEnv?.DSH_WSL_DISTRO
    if (fromEnv !== undefined && fromEnv !== '') return fromEnv
    const configured = this.config.distro
    if (configured !== undefined && configured !== '') return configured
    const fallback = defaultDistroSync()
    if (fallback !== undefined) return fallback
    throw new Error(
      'wsl-shell: Linux workdir carries no distribution; no session DSH_WSL_DISTRO, distro config, '
      + 'or default distribution is available',
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本和效果能判断到哪一层？

**研究主题：**效果与总成本

#### 完整回答

合格任务是同一个开发动作在选定发行版/用户下由命令和文件工具一致办结，取消与恢复不留下无法解释的副作用。它减少在Windows与Linux工具间手工翻译的潜力，不代表所有工作负载都比WSL内原生宿主更快或更安全。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | WSL与宿主资源、预构建包及变体持久化 | 选择发行版/用户、重启、检查接口代际和路径 | 本轮没有安装时间和内存测量 |
| 持续使用 | 每Agent持久进程、9P文件IO、/proc探测和PTY | 理解持久cd/export、背景进程与政策差异 | 任务规模、缓存与资源峰值未知 |
| 失败恢复 | shell重建、状态回放、进程清理与可能重跑 | 核对第一次副作用、未恢复环境及外部状态 | 重复动作和人工核对可超过省下的接线 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 世界一致 | 同realm shell/fs和会话发行版事实 | 自身宿主/发行版组合实际完整兼容 |
| 状态保持 | 持久shell、队列和回放 | 任意程序/资源下恢复正确性 |
| 文件策略 | realpath与write/edit目标检查 | 竞态、policy缺失及命令侧等价隔离 |
| 交互 | 终端工具与PTY升级分支 | 真正等待识别、尾延迟和副作用恢复 |

作者README包含具体毫秒、矩阵和内存背景数字，本轮没有运行原任务，不将其当独立结果或普遍性能阈值。默认每流256KiB等上限是局部配置而非整个会话成本。引入WSL世界还能访问Windows挂载，迁移成本包括凭据、环境与退出清理，而不只安装一个插件。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/wsl-bash-tool.ts:61-66](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-bash-tool.ts#L61-L66)

deadline、输出与启动预算是局部默认值。

```text
const DEFAULTS: Required<Pick<Config, 'timeoutMs' | 'maxTimeoutMs' | 'maxOutputBytes' | 'graceMs' | 'bootTimeoutMs'>> = {
  timeoutMs: 120_000,
  maxTimeoutMs: 600_000,
  maxOutputBytes: 256 * 1024,
  graceMs: 3_000,
  bootTimeoutMs: 20_000,
```

**依据 2 · 源码核查**：[src/host/wsl-bash-tool.ts:577-604](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-bash-tool.ts#L577-L604)

持久进程所有权和结束清理，资源随Agent数量变化。

<details>
<summary>查看原文（28行）</summary>

```text
      let session = sessions.get(ownerKey)
      if (session === undefined) {
        const spec = buildSessionSpec(resolved, headerCwd)
        if (spec === undefined) {
          throw new Error('wsl-bash: no WSL distribution could be resolved for this session')
        }
        session = new WslBashSession(spawnHost(), spec)
        sessions.set(ownerKey, session)
        // The shell belongs to the agent that made it, not to the plugin. Without a registration on
        // the agent's own scope, every agent that ever called `bash` leaves a shell — two `wsl.exe` and
        // about 9 MB of Windows working set — alive until the whole world is disposed, which a user
        // with several sessions can see as memory that never comes back. `effect` is cordis's scope
        // hook: the disposer it returns runs when that agent's scope ends.
        const created = session
        const scope = (exec.agent as {
          ctx?: { effect?: (setup: () => (() => void) | void) => unknown }
        } | undefined)?.ctx
        const register = scope?.effect
        if (typeof register === 'function') {
          register(() => () => {
            if (sessions.get(ownerKey) !== created) return
            sessions.delete(ownerKey)
            void created.dispose()
          })
        }
        await session.start().catch((error: unknown) => {
          sessions.delete(ownerKey)
          throw error instanceof Error ? error : new Error(String(error))
```

</details>

**依据 3 · 源码核查**：[src/fs.ts:266-278](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/fs.ts#L266-L278)

部分目标额外请求发行版路径探测，性能取决于路径。

<details>
<summary>查看原文（13行）</summary>

```text
  private async linkAwarePath(input: string, targetKey: string): Promise<string | undefined> {
    const unc = parseWslUnc(targetKey) ?? parseWslUnc(input)
    if (unc === null) return undefined
    const asSpelled = joinUnc(unc.distro, unc.linuxPath)
    if (await this.describable(targetKey)) return undefined
    const real = await resolveLinuxSymlink(asSpelled)
    if (real === undefined) return undefined
    return real.toLowerCase() === asSpelled.toLowerCase() ? undefined : real
  }

  /** Whether this share can describe a Windows-side identity at all. */
  private async describable(winPath: string): Promise<boolean> {
    return await super.lstat(winPath, {}).catch(() => undefined) !== undefined
```

</details>

**依据 4 · 源码核查**：[src/host/wsl-bash-session.ts:343-348](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-bash-session.ts#L343-L348)

重建与再执行带恢复成本。

```text
      const childGone = this.exited
      const recovery = await this.rebuild()
      const recovered = { restarted: true, ...recovery }
      if (!childGone || signal?.aborted === true || first.run.starved !== undefined) return { ...first.run, ...recovered }
      const second = await this.execute(command, timeoutMs, signal, DEFINITION.test(command), ownTerminal, stdin)
      return { ...second.run, ...recovered }
```

#### 缺口

- 缺少同任务WSL内原生宿主/手动wsl命令的合格率、资源和人工对照。
  **影响：**不能量化整会话接线的净收益或普遍低延迟。
  **进一步探讨：**可在同发行版、用户和项目上比较跨工具任务，并把恢复/重复副作用核对计入总时间。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 采用建议与未来假设是什么？

**研究主题：**新假设与验证、采用判断

#### 完整回答

建议观察。对于熟悉Windows/WSL、需要统一shell和文件世界的开发者，贡献明确且有可借鉴架构；但文件策略与命令权限分裂，以及子shell退出/等待输入导致整命令重跑，会直接影响真实项目的副作用安全。本轮没有同版本宿主验收，不能只依作者兼容矩阵就给安装或默认启用建议。

继续研究可先在可丢弃发行版中核对发行版/用户/路径一致性，再分别检查文件围栏与命令权限，选择无外部副作用的任务测试状态保持、取消和退出。不要以配置read-only推断bash只读；对提交、远端写入、包安装或删改任务，首次结果不明时不盲目重跑。缺policy、错发行版、未说明重跑或不能清理子进程时应停止依赖。

可推导“显式重跑许可与执行收据”的未验证设计。当前恢复知道child已消失，却不知道它之前完成了哪些外部动作。若调用先声明幂等/禁止重跑，回收后返回结果未知和原attempt收据，由读者确认再重试，可能降低自动双执行风险；代价是打断透明恢复并增加交互。最小对照用先追加唯一token后exit/等键盘的命令，比较现机制与显式许可版的重复副作用、恢复成功率和人工次数。若降低重复却大幅增加正常任务失败，净收益需重新评估。假设未实现，不计插件既有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/wsl-bash-session.ts:337-348](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-bash-session.ts#L337-L348)

childGone被当作再执行条件，但不包含外部副作用收据。

<details>
<summary>查看原文（12行）</summary>

```text
      // The frame went out and no record came back. Two different worlds, and the difference that
      // matters is whether the command may have run. A dead child cannot still hold the shell, so
      // replaying there is safe and keeps a crash transparent. A live one may be mid-command, and a
      // command that merely exceeded its deadline must not be executed a second time — `git commit`,
      // `curl -X POST`, `rm`. So rebuild either way, which kills whatever is wedged and stops the
      // *next* call queueing behind it, and re-execute only when the child was already gone.
      const childGone = this.exited
      const recovery = await this.rebuild()
      const recovered = { restarted: true, ...recovery }
      if (!childGone || signal?.aborted === true || first.run.starved !== undefined) return { ...first.run, ...recovered }
      const second = await this.execute(command, timeoutMs, signal, DEFINITION.test(command), ownTerminal, stdin)
      return { ...second.run, ...recovered }
```

</details>

**依据 2 · 源码核查**：[src/host/wsl-bash-tool.ts:324-335](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-bash-tool.ts#L324-L335)

正文已承认第二次执行及状态恢复，是显式许可假设的起点。

<details>
<summary>查看原文（12行）</summary>

```text
  // The command asked for the shell to end — `… ; exit 3`, a `set -e` body, a script that finishes with
  // `exit`. That is not a cancelled call, and the reply a cancellation produces (`Error: tool call
  // aborted`, no streams) is the one answer that tells the model nothing about what its own command did.
  // Measured on the installed 0.7.7 build: this shape came back with nothing, and the evidence that the
  // shell had been rebuilt arrived on the *next* call, where it reads as that call's own event.
  if (run.shellExited) {
    notes.push('[this command ended the session shell itself (bash left with the code reported here), so it was run once more after the shell was rebuilt: anything it did before ending has been done twice, and this answer is from that second run. A command that must exit non-zero without ending its shell should wrap itself in its own `bash -c` body, or use `wsl_terminal`]')
  }
  if (run.restarted) {
    notes.push(run.skipped === undefined || run.skipped.length === 0
      ? '[the shell was restarted and its directory, exported variables, options and aliases were replayed]'
      : `[the shell was restarted; not restored: ${run.skipped.join(', ')}]`)
```

</details>

**依据 3 · 源码核查**：[src/host/wsl-sandbox.ts:13-17](https://github.com/dsh-wsl-workspace-maintainers/dsh-wsl-workspace/blob/00106d9575d8d087daec0596dd51f283f78dcdbb/src/host/wsl-sandbox.ts#L13-L17)

采用需理解文件策略与命令边界分裂。

```text
 * So the world declares its own provider: commands run unconfined by the
 * Windows runner — the distribution is the boundary — while the file tools keep
 * enforcing the policy themselves, at the resolved real path, in
 * `src/fs.ts`. `enforcement: 'partial'` records that split honestly: within this
 * world the policy is enforced for file effects, not by the wrapped command.
```

#### 缺口

- 显式重跑许可是否能降低副作用而不破坏恢复体验尚无比较。
  **影响：**这是待验证设计，不提高当前执行保证或采用等级。
  **进一步探讨：**可从唯一token副作用与shell退出/等待输入的故障序列入手，比较重复数、恢复成功率和人工投入。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
