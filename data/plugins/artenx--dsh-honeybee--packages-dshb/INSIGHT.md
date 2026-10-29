# DSH-HoneyBee

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[dc3c35f](https://github.com/Artenx/dsh-honeybee/tree/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb)

<!-- BEGIN META -->
[![npm 30d 1,319](https://img.shields.io/static/v1?label=npm+30d&message=1%2C319&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@artenx/dshb) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@artenx/dshb)
<!-- END META -->

> **功能**：将 DSH 文件、命令和终端操作路由到本地、SSH 或 Docker 节点，并管理认证、工作区指令与同步。

> **亮点**：DSHB 把工作区到执行节点的映射复用到文件、命令和终端接口，并以摘要、事件前缀校验及待恢复日志支持会话同步，减少模型自行选择SSH入口的责任；这属于可核查的组合设计，实际节时尚未知，见 [Q02](#research-q02) 与 [Q04](#research-q04)。

> **主要限制**：透明路由只有在目标和中断语义可靠时才有价值。绑定文件读取异常会变成空绑定并走本机，普通远端 shell 的 kill 返回 false，执行 SSH 也未接入已登记主机指纹；这些源码边界使重要数据和公网持续使用应暂缓，实际副作用尚未复现，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 完整功能如何加载，谁需要工作区到执行节点的映射？](#detail-section-11)
  - [Q02 · 文件、子进程、shell与终端如何保持同一节点语义，节点缺失时会发生什么？](#detail-section-12)
  - [Q03 · 认证门与SSH信任是否足以支持外网部署？](#detail-section-13)
  - [Q04 · 节点与会话同步如何处理冲突、中断与已有状态？](#detail-section-14)
  - [Q05 · 工作区指令如何进入Agent，持续使用的成本和退出负担是什么？](#detail-section-15)
  - [Q06 · 当前贡献支持怎样的试用、采用及未来验证？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 SSH 或 Docker 开发环境的用户可在 DSH 中绑定远程工作区，集中处理文件、命令和会话；真实频率与节时尚未验证，详见 [Q01](#research-q01)。

比较基线为用户手动 SSH、分别维护文件与本地会话，以及只需本机操作时保留宿主原接口。这里比较固定源码的责任划分，没有做同任务效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 文件路由 | 读取、修改绑定节点的文件 | 依赖有效绑定与world；绑定读取失败可退回本机 |
| shell与子进程路由 | 在绑定节点执行命令 | 普通SSH取消/超时语义不完整，需核对进程 |
| 终端适配 | 使用远端环境与可执行文件 | PTY有独立终止路径，不覆盖普通shell |
| 节点与会话同步 | 跨实例复用绑定和会话 | 显式peer、身份、摘要、工作区映射及持久化服务必需 |
| 工作区指令 | 给会话加入用户管理的项目指导 | 按首次直接用户消息冻结，已有会话不自动更新 |
| 认证门 | 约束HTTP、fallback与升级访问 | 强依赖宿主接线，不等于公网安全验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ≥22.13、DSH 与 Cordis 服务 | 启动必需 | 加载组合及宿主接口 | README、engines、peer范围存在版本信号不一致，需核对实际profile |
| auth、core、router及所用执行子入口 | 完整能力必需 | 认证、绑定与操作转交 | 单独根导出只有UI，不等于远端执行已启用 |
| SSH账号/密钥及可访问节点 | SSH操作必需 | 执行与文件访问 | 连接失败需操作者恢复；执行链指纹约束未接线 |
| Docker节点/镜像/权限 | Docker操作必需 | 容器执行 | 本次未逐层审计容器后端，不能承诺环境可用 |
| peer、持久化及会话服务 | 同步时必需 | 跨实例导入和恢复 | 节点/工作区映射不满足可跳过或报错 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份profile与数据，核对版本和组合加载 | 根入口与子入口均按预期加载 |
| 绑定 | 用户登记节点、凭据和工作区路径 | 文件读取与短命令的实际目标一致 |
| 使用 | 宿主经resolver转交操作 | 核对修改落点与命令结果，不能把取消当远端停止 |
| 同步 | 用户明确启用peer，后台按方向导入 | 核对摘要、事件前缀、跳过与pending记录 |
| 恢复/退出 | 用户停用同步，备份状态，重启干净profile并手动SSH核对 | 两端数据、后台进程与会话状态均可解释 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 计算节点、网络及模型费用金额未知 | 版本、凭据、绑定和profile核对，耗时未知 | 未做安装计时 |
| 持续使用 | 远端计算、传输与存储用量未知 | 核对节点、同步结果与会话指令快照 | 五分钟调度仅对明确启用peer生效 |
| 失败恢复 | 可能有未停止远端作业及重复传输，金额未知 | 检查绑定、进程、journal及两端状态，耗时未知 | 批内可能部分完成，不保证回滚 |
| 升级与退出 | 保留状态和副本所需资源未知 | 备份并重启干净profile、手动接管 | 热卸载还原接线未确认 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工作区路由 | 同一binding用于文件、命令、终端 | 宿主兼容与实际错误率 |
| 会话恢复 | 摘要、prepared日志及事件前缀检查 | 故障注入后的完整恢复和人工耗时 |
| 操作便利 | 相对手工SSH减少每次选择入口的责任 | 节时、合格率、单位成本和真实需求 |

> **思考**：透明路由只有在目标和中断语义可靠时才有价值。绑定文件读取异常会变成空绑定并走本机，普通远端 shell 的 kill 返回 false，执行 SSH 也未接入已登记主机指纹；这些源码边界使重要数据和公网持续使用应暂缓，实际副作用尚未复现，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：DSHB 把工作区到执行节点的映射复用到文件、命令和终端接口，并以摘要、事件前缀校验及待恢复日志支持会话同步，减少模型自行选择SSH入口的责任；这属于可核查的组合设计，实际节时尚未知，见 [Q02](#research-q02) 与 [Q04](#research-q04)。

可借鉴的设计是 [Q04](#research-q04) 的摘要绑定恢复日志与事件前缀校验，它把“重试”具体化为验证后缀而非盲目复制；迁移需要匹配会话持久化API、附件和工作区身份。局限是auth以正则适配打包前端、覆盖宿主认证判断，router装饰器还原函数未进入生命周期，维护成本随宿主API变化而增加，详见 [Q03](#research-q03) 和 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

透明路由只有在目标和中断语义可靠时才有价值。绑定文件读取异常会变成空绑定并走本机，普通远端 shell 的 kill 返回 false，执行 SSH 也未接入已登记主机指纹；这些源码边界使重要数据和公网持续使用应暂缓，实际副作用尚未复现，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前先观察。已有多节点环境的维护者应先用独立profile和仅含哨兵文件的节点核对路径、取消、认证与恢复；确认节点落点和作业终止之前不接重要数据。发生目标不明、状态冲突或进程无法停止时，停用同步并通过手动SSH处理，见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定版本的组合接线、核心路由、认证、指令及同步恢复路径；能力判断来自源码，采用结论为观察。未来操作凭据方案尚未实现或验证。

- 已检查：作者 README、包清单、源码路径 packages/dshb/README.md、packages/dshb/cordis.patch.yml、packages/dshb/package.json、packages/dshb/src/auth/decorate-webserver.ts、packages/dshb/src/auth/gate.ts、packages/dshb/src/auth/index.ts、packages/dshb/src/auth/loopback.ts、packages/dshb/src/core/index.ts、packages/dshb/src/core/sync/coordinator.ts、packages/dshb/src/core/sync/scheduler.ts、packages/dshb/src/core/sync/session-sync.ts、packages/dshb/src/core/workspace-bindings.ts、packages/dshb/src/core/workspace-instruction-context.ts、packages/dshb/src/exec-ssh/connection.ts、packages/dshb/src/exec-ssh/process-provider.ts、packages/dshb/src/exec-ssh/world.ts、packages/dshb/src/index.ts、packages/dshb/src/router/decorate-fs.ts、packages/dshb/src/router/decorate-shell.ts、packages/dshb/src/router/decorate-subprocess.ts、packages/dshb/src/router/index.ts、packages/dshb/src/router/resolve.ts、packages/dshb/src/ui/index.ts 及固定范围 inventory；组件：packages/dshb。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：统计覆盖完整packages/dshb组件；人工抽读覆盖本文列出的入口、路由、SSH连接、认证、指令及同步关键路径，未逐层审计Docker后端、全部同步附件/归档分支，不据此作全组件安全保证。
- 下一步：后续验证应先固定一个受支持宿主版本和独立DSH_HOME，以同一任务集比较手动SSH与插件；记录实际文件目标、取消后远端进程、同步摘要/事件数、人工恢复时间。错误目标、未停止副作用或冲突后无法解释状态均触发停止；本轮未执行这些实验。

**分析版本**

- **仓库**：[Artenx/dsh-honeybee](https://github.com/Artenx/dsh-honeybee)
- **版本号**：0.1.18（[固定提交 dc3c35f](https://github.com/Artenx/dsh-honeybee/tree/dc3c35f3bc312932632882d3d39cccfc6bceb312)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索携带节点身份、绑定版本和取消能力的操作凭据，并将绑定损坏与无绑定分开处理，以减少错误目标和取消误判。这是从 [Q02](#research-q02) 推导的未验证假设；先用隔离目录与手动 SSH 对照，出现错误目标或取消后状态仍不一致即推翻，见 [Q06](#research-q06)。

后续验证应先固定一个受支持宿主版本和独立DSH_HOME，以同一任务集比较手动SSH与插件；记录实际文件目标、取消后远端进程、同步摘要/事件数、人工恢复时间。错误目标、未停止副作用或冲突后无法解释状态均触发停止；本轮未执行这些实验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 20 | — | — | 105 |
| .ts | source | 78 | 13699 | 12521 | 58 | — |
| .tsx | source | 8 | 3362 | 3004 | 167 | — |
| .ts | test | 36 | 5322 | 4802 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Artenx/dsh-honeybee/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Artenx/dsh-honeybee/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Artenx/dsh-honeybee/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSHB 能否在远程开发中保持文件、命令和会话的节点语义及可理解的失败边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 完整功能如何加载，谁需要工作区到执行节点的映射？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

DSHB 是可装入 DSH 的原生插件组合，适合已有 SSH 或 Docker 开发节点、希望在一个 DSH 界面处理远端项目的开发者。合格结果应是同一工作区的文件读取、修改和命令都在用户选定节点发生，并且用户能识别节点不可用。相较先手动 SSH 再分别搬运文件和会话，作者提供节点注册、工作区绑定与多种操作接口的组合；这里识别的是集成能力，尚没有真实用户频率或节时证据。

包根 index.ts 仅导出 UI，UI apply 只装饰目录选择器，因此不能把单独加载根入口等同于完整远程执行。cordis.patch.yml 停用原 web-startup，按组合插入 auth、startup、core、router、SSH、Docker 和 UI；core 注册节点、绑定、同步与指令服务，router 再装饰宿主服务。README 给出 Web profile 安装及重启方式。包 engines 声明较宽 DSH 范围，但 peerDependencies 上限排除 0.2.1-rc.2，devDependencies 又使用该版本，作者 README 也列出该版本，故这些声明存在兼容信号不一致，不能根据安装命令承诺当前所有版本可用。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dshb/README.md:3-18](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/README.md#L3-L18)

作者用途、安装与环境要求。

<details>
<summary>查看原文（16行）</summary>

````text
DSH-HoneyBee routes DSH filesystem, shell, subprocess, and PTY operations to local, SSH, and Docker execution nodes. It includes a node registry, an authentication gate, credential custody, workspace bindings and project instructions, and a mobile-aware management UI.

## Install

```sh
dsh plugin --profile web add @artenx/dshb
```

Restart the corresponding DSH Web profile after installation.

Desktop app: install from **Settings → Plugins → More** in the DSH desktop app; the plugin takes effect on next startup.

## Requirements

- Node.js 22.13 or newer
- DeepSeek Harness 0.1.7-rc.1 or 0.2.1-rc.2 (Web or Desktop)
````

</details>

**依据 2 · 源码核查**：[packages/dshb/src/index.ts:1-1](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/index.ts#L1-L1)

根入口转出UI。

```text
export { name, apply, inject } from './ui/index.js'
```

**依据 3 · 源码核查**：[packages/dshb/src/ui/index.ts:4-10](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/ui/index.ts#L4-L10)

根入口的实际apply只装饰目录选择器。

```text
export const name = 'dshb-ui'

export const inject = ['directoryPicker']

export function apply(ctx: Context): void {
  decorateDirectoryPicker(ctx.directoryPicker)
}
```

**依据 4 · 源码核查**：[packages/dshb/cordis.patch.yml:1-17](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/cordis.patch.yml#L1-L17)

完整组合的加载接线与替换启动。

<details>
<summary>查看原文（17行）</summary>

```text
- id: web-startup
  disabled: true
- insert:
    - id: dshb-auth
      name: "@artenx/dshb/auth"
    - id: dshb-web-startup
      name: "@artenx/dshb/auth/startup"
    - id: dshb-core
      name: "@artenx/dshb/core"
    - id: dshb-router
      name: "@artenx/dshb/router"
    - id: dshb-exec-ssh
      name: "@artenx/dshb/exec-ssh"
    - id: dshb-exec-docker
      name: "@artenx/dshb/exec-docker"
    - id: dshb-ui
      name: "@artenx/dshb"
```

</details>

**依据 5 · 源码核查**：[packages/dshb/package.json:115-137](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/package.json#L115-L137)

peer上限与开发依赖版本不一致。

<details>
<summary>查看原文（23行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-client-ui-settings": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-conversation": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-layout": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-workspace": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "@deepseek-ai/dsh-cmdline": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "@deepseek-ai/dsh-credentials": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "@deepseek-ai/dsh-fs": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "@deepseek-ai/dsh-fs-sandbox": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "@deepseek-ai/dsh-host-directory-picker": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "@deepseek-ai/dsh-host-webserver": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "@deepseek-ai/dsh-sandbox": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "@deepseek-ai/dsh-shell": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "@deepseek-ai/dsh-bash-sandbox": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "@deepseek-ai/dsh-subprocess": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "@deepseek-ai/dsh-subprocess-local": ">=0.1.7-rc.1 <0.2.1-rc.2",
    "react": "^19.0.0"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh": "0.2.1-rc.2",
```

</details>

#### 缺口

- 没有实际用户任务频率及替代流程耗时。
  **影响**：场景必要性仍是有机制依据的推断。
  **进一步探讨**：采集已有远程开发者的同任务操作记录。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件、子进程、shell与终端如何保持同一节点语义，节点缺失时会发生什么？

**研究主题**：功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

核心设计把本机镜像路径转换为节点ID与远端路径。WorkspaceBindingsStore.resolve 对路径边界做匹配并选择最长镜像根；WorldResolver 没有绑定时返回 local，有绑定时遍历已注册world，找不到provider则返回 unrouted。fs装饰器按目标路径转交读取、写入与编辑；子进程按cwd、shell按workdir路由；terminalController 另外替换远端终端环境与可执行文件解析。因此贡献是让已有宿主操作复用同一绑定，不要求模型每次自行拼SSH命令，并非发明SSH或容器执行。

需要区分两种失败。有绑定但world未就绪会明确报错，避免此分支静默在本机执行；然而绑定文件加载的任意异常被catch并改为空数组，loaded又已设为true，此时resolver无法知道用户原本配置了远端路径，后续会走local。这是固定源码可确认的降级行为，实际是否触达危险本机文件还取决于路径和宿主调用，未复现。另一个边界是远端shell适配器的kill固定返回false，SSH run未传递signal/timeout给exec，结果把timedOut和aborted写成false；其语义并不等同本地可取消的长任务。即便PTY另有terminate，也不能用它覆盖普通shell链路的限制。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dshb/src/core/workspace-bindings.ts:33-44](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/workspace-bindings.ts#L33-L44)

加载失败被转换为空绑定且不再重读。

<details>
<summary>查看原文（12行）</summary>

```text
  private load(): void {
    if (this.loaded) return
    this.loaded = true
    try {
      this.bindings = (JSON.parse(readFileSync(this.file(), 'utf8')) as WorkspaceBinding[]).map((b) => ({
        ...b,
        mirrorPath: normalize(b.mirrorPath),
        remotePath: normalize(b.remotePath),
      }))
    } catch {
      this.bindings = []
    }
```

</details>

**依据 2 · 源码核查**：[packages/dshb/src/core/workspace-bindings.ts:76-90](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/workspace-bindings.ts#L76-L90)

最长前缀转换。

<details>
<summary>查看原文（15行）</summary>

```text
  resolve(path: string): BindingHit | undefined {
    this.load()
    const target = normalize(path)
    let best: WorkspaceBinding | undefined
    for (const b of this.bindings) {
      const root = normalize(b.mirrorPath)
      if (target === root || target.startsWith(`${root}/`)) {
        if (!best || root.length > normalize(best.mirrorPath).length) best = b
      }
    }
    if (!best) return undefined
    const root = normalize(best.mirrorPath)
    const remoteRoot = normalize(best.remotePath)
    const suffix = target === root ? '' : target.slice(root.length)
    return { nodeId: best.nodeId, remotePath: normalize(`${remoteRoot}${suffix}`) }
```

</details>

**依据 3 · 源码核查**：[packages/dshb/src/router/resolve.ts:8-34](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/router/resolve.ts#L8-L34)

区分local、remote和unrouted。

<details>
<summary>查看原文（27行）</summary>

```text
export function resolveWorld(absPath: string, bindings?: WorkspaceBindings): { kind: 'local' } | ({ kind: 'remote' } & BindingHit) {
  if (!bindings) return { kind: 'local' }
  const hit = bindings.resolve(absPath)
  if (!hit) return { kind: 'local' }
  return { kind: 'remote', ...hit }
}

export class WorldResolver {
  private bindings?: WorkspaceBindings
  private registries: WorldRegistry[] = []

  setBindings(bindings: WorkspaceBindings): void {
    this.bindings = bindings
  }

  setRegistry(registry: WorldRegistry): void {
    this.registries.push(registry)
  }

  resolve(absPath: string): WorldRef {
    const r = resolveWorld(absPath, this.bindings)
    if (r.kind === 'local') return { kind: 'local' }
    for (const reg of this.registries) {
      const provider = reg.get(r.nodeId)
      if (provider) return { kind: 'remote', provider, remotePath: r.remotePath }
    }
    return { kind: 'unrouted', nodeId: r.nodeId }
```

</details>

**依据 4 · 源码核查**：[packages/dshb/src/router/decorate-fs.ts:96-107](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/router/decorate-fs.ts#L96-L107)

远端写入与编辑真实转交provider。

<details>
<summary>查看原文（12行）</summary>

```text
  fs.writeText = async (target: FsTarget, content: string, expected?: FsWriteIntent, signal?: AbortSignal, sandboxPolicy?: SandboxExecutionPolicy): Promise<FsWriteOutcome> => {
    const ref = resolver.resolve(targetPath(target))
    if (ref.kind === 'local') return origWriteText(target, content, expected, signal, sandboxPolicy)
    if (ref.kind === 'unrouted') throw new Error(`node ${ref.nodeId} world not available`)
    return ref.provider.fs.writeText(ref.remotePath, content, expected, signal, sandboxPolicy) as Promise<FsWriteOutcome>
  }

  fs.editText = async (target: FsTarget, edit: FsEditRequest, expected?: { version: FsVersion }, signal?: AbortSignal, sandboxPolicy?: SandboxExecutionPolicy): Promise<FsEditOutcome> => {
    const ref = resolver.resolve(targetPath(target))
    if (ref.kind === 'local') return origEditText(target, edit, expected, signal, sandboxPolicy)
    if (ref.kind === 'unrouted') throw new Error(`node ${ref.nodeId} world not available`)
    return ref.provider.fs.editText(ref.remotePath, edit, expected, signal, sandboxPolicy) as Promise<FsEditOutcome>
```

</details>

**依据 5 · 源码核查**：[packages/dshb/src/router/decorate-subprocess.ts:11-24](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/router/decorate-subprocess.ts#L11-L24)

cwd路由子进程与PTY。

<details>
<summary>查看原文（14行）</summary>

```text
  sp.spawn = (spec: SubprocessSpawnSpec): SubprocessHandle => {
    const ref = resolver.resolve(spec.cwd ?? '')
    if (ref.kind === 'local') return origSpawn(spec)
    if (ref.kind === 'unrouted') throw new Error(`node ${ref.nodeId} world not available`)
    void ref.provider.ensureDir(ref.remotePath).catch(() => {})
    return ref.provider.subprocess.spawn({ ...spec, cwd: ref.remotePath })
  }

  sp.spawnTerminal = async (spec: SubprocessTerminalSpawnSpec): Promise<SubprocessTerminalHandle> => {
    const ref = resolver.resolve(spec.cwd ?? '')
    if (ref.kind === 'local') return origSpawnTerminal(spec)
    if (ref.kind === 'unrouted') throw new Error(`node ${ref.nodeId} world not available`)
    await ref.provider.ensureDir(ref.remotePath).catch(() => {})
    return ref.provider.subprocess.spawnTerminal({ ...spec, cwd: ref.remotePath })
```

</details>

**依据 6 · 源码核查**：[packages/dshb/src/router/decorate-shell.ts:74-95](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/router/decorate-shell.ts#L74-L95)

kill返回false和workdir路由。

<details>
<summary>查看原文（22行）</summary>

```text
    observed: {
      stdout: outputReader((result) => result.stdout, () => collected),
      stderr: outputReader((result) => result.stderr, () => collected),
    },
    kill: () => false,
    result: () => resultPromise,
  }

  return Promise.resolve(execution as unknown as ShellExecution)
}

export function decorateShell(shell: ShellExecutor): () => void {
  const resolver = sharedWorldResolver()

  const origExecute = shell.execute.bind(shell)

  shell.execute = async (spec: ShellExecSpec): Promise<ShellExecution> => {
    const ref = resolver.resolve(spec.workdir ?? '')
    if (ref.kind === 'local') return origExecute(spec)
    if (ref.kind === 'unrouted') throw new Error(`node ${ref.nodeId} world not available`)
    await ref.provider.ensureDir(ref.remotePath).catch(() => {})
    return executionFromRemoteRun(ref.provider.shell, { ...spec, workdir: ref.remotePath })
```

</details>

**依据 7 · 源码核查**：[packages/dshb/src/exec-ssh/process-provider.ts:21-44](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/exec-ssh/process-provider.ts#L21-L44)

SSH shell未将取消或时限传给exec，返回固定状态。

<details>
<summary>查看原文（24行）</summary>

```text
  async run(spec: ShellExecSpec): Promise<ShellRunResult> {
    const result = await this.executor.exec(['sh', '-c', spec.command], spec.workdir, (spec.env ?? {}) as Record<string, string>, spec.stdin !== undefined ? Buffer.from(spec.stdin) : undefined)
    const collect = (text: string): CollectedOutput => ({ text, truncated: false })
    return {
      exitCode: result.code,
      signal: (result.signal ?? null) as NodeJS.Signals | null,
      timedOut: false,
      aborted: false,
      timeoutMs: spec.timeoutMs,
      stdout: collect(result.stdout),
      stderr: collect(result.stderr),
    } as unknown as ShellRunResult
  }

  start(spec: ShellExecSpec): ShellProcess {
    const promise = this.run(spec)
    const proc: ShellProcess = {
      pid: -1,
      done: promise,
      kill: () => {
        void promise
      },
    } as unknown as ShellProcess
    return proc
```

</details>

**依据 8 · 源码核查**：[packages/dshb/src/router/index.ts:28-43](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/router/index.ts#L28-L43)

终端环境与可执行文件解析的接线。

<details>
<summary>查看原文（16行）</summary>

```text
function decorateTerminalController(ctx: Context): void {
  ctx.inject(['terminalController'], (terminalCtx: Context) => {
    const controller = (terminalCtx as unknown as { terminalController: TerminalControllerLike }).terminalController
    const originalExecution = controller.execution.bind(controller)

    controller.execution = (agent) => {
      const execution = originalExecution(agent)
      const ref = sharedWorldResolver().resolve(agent.session.header.cwd)
      if (ref.kind === 'local') return execution
      if (ref.kind === 'unrouted') throw new Error(`node ${ref.nodeId} world not available`)

      const subprocess = Object.create(execution.subprocess) as SubprocessRuntime
      subprocess.terminalEnvironment = ref.provider.subprocess.terminalEnvironment.bind(ref.provider.subprocess)
      subprocess.resolveExecutable = ref.provider.subprocess.resolveExecutable.bind(ref.provider.subprocess)
      return { ...execution, subprocess }
    }
```

</details>

#### 缺口

- 绑定损坏后的实际本机副作用范围未复现。
  **影响**：不能量化故障概率或断言发生数据损失。
  **进一步探讨**：用独立DSH_HOME和仅含哨兵文件的节点验证损坏绑定后读写目标。
- 普通shell中断后的远端进程状态没有执行记录。
  **影响**：不能把用户取消解释为远端已停止。
  **进一步探讨**：以可观察进程ID的小任务验证取消和超时后的存活状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 认证门与SSH信任是否足以支持外网部署？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

固定源码支持存在认证门，不能据此判定适合直接暴露公网。AuthGate 只豁免登录与auth路径；回环豁免同时要求socket地址和Host为回环，否则检查签名会话，页面重定向、API拒绝。decorateWebServer 包装普通路由、fallback及升级请求，并补包已存在fallback；获准后把Host、Origin和Referer改为回环，以适配宿主检查。这样的完整拦截比仅提供登录页更有实质作用。

它也承担较强宿主耦合。auth/index.ts 会将宿主 browserAuth.isAuthenticated 改成始终true，让DSHB成为唯一门，还以正则替换已打包前端以延迟激活断言。若宿主对象或加载顺序变化，不能仅靠包的版本范围保证门仍完整覆盖。执行用 SshConnection 的ConnectConfig含认证和超时，却没有hostVerifier或已信任主机指纹的参数；world传入的target也没有该字段。core虽注册KnownHostsStore，不能由此推出执行SSH连接实际校验已登记指纹。同步链路另有SyncHostKeyChallengeError，不能拿同步的检查替代执行连接。当前应在受控网络及独立凭据范围观察，外网部署需要对最终路由和执行连接分别验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dshb/src/auth/gate.ts:11-22](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/auth/gate.ts#L11-L22)

认证判定和拒绝条件。

<details>
<summary>查看原文（12行）</summary>

```text
  decide(req: IncomingMessage): GateDecision {
    const path = new URL(req.url ?? '/', 'http://x').pathname
    if (path === '/login' || path.startsWith('/api/auth/')) return 'exempt'
    if (isLoopbackRequest(req.socket.remoteAddress, req.headers.host)) return 'allow'
    const secret = this.store.sessionSecret
    const username = this.store.username
    if (secret && username) {
      const value = readCookie(req.headers.cookie, SESSION_COOKIE)
      if (verifySession(value, secret, username)) return 'allow'
    }
    if (this.isPageRequest(req)) return 'redirect-login'
    return 'reject'
```

</details>

**依据 2 · 源码核查**：[packages/dshb/src/auth/loopback.ts:21-26](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/auth/loopback.ts#L21-L26)

回环要求双条件。

```text
export function isLoopbackRequest(
  remoteAddress: string | undefined | null,
  hostHeader: string | undefined | null,
): boolean {
  return isLoopbackAddress(remoteAddress) && isLoopbackHost(hostHeader)
}
```

**依据 3 · 源码核查**：[packages/dshb/src/auth/decorate-webserver.ts:18-49](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/auth/decorate-webserver.ts#L18-L49)

普通、升级、fallback包裹。

<details>
<summary>查看原文（32行）</summary>

```text
  webServer.register = (route: WebRoute): (() => void) => {
    return origRegister({
      ...route,
      handler: (req, res) => guarded(route, req, res),
    })
  }

  webServer.registerFallback = (handler: WebRoute['handler']): (() => void) => {
    return origRegisterFallback((req, res) =>
      guarded({ kind: 'exact', path: '/', handler }, req, res),
    )
  }

  webServer.registerUpgrade = (route: WebUpgradeRoute): (() => void) => {
    return origRegisterUpgrade({
      ...route,
      handler: (req, socket, head) => guardedUpgrade(route, req, socket, head),
    })
  }

  // DSH 0.1.5+: the frontend-static plugin may have claimed the fallback seat
  // *before* this decoration runs (plugin apply order is not guaranteed). The
  // registerFallback wrap above only gates fallbacks registered later, so also
  // wrap an already-claimed seat in place. Idempotent via the __dshbGated mark.
  const ws = webServer as unknown as { fallback?: WebRoute['handler'] & { __dshbGated?: true } }
  const origFallback = ws.fallback
  if (typeof origFallback === 'function' && !origFallback.__dshbGated) {
    const wrapped: WebRoute['handler'] & { __dshbGated?: true } = (req, res) =>
      guarded({ kind: 'exact', path: '/', handler: origFallback }, req, res)
    wrapped.__dshbGated = true
    ws.fallback = wrapped
  }
```

</details>

**依据 4 · 源码核查**：[packages/dshb/src/auth/index.ts:31-69](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/auth/index.ts#L31-L69)

对已打包前端的版本相关替换。

<details>
<summary>查看原文（39行）</summary>

```text
    const assetDir = join(dirname(manifestPath), 'dist', 'assets')
    const assetName = readdirSync(assetDir).find((name) => /^index-.*\.js$/.test(name))
    if (!assetName) return

    const assetPath = join(assetDir, assetName)
    const source = readFileSync(assetPath, 'utf8')
    // DSH asserts before api-remotes' dynamic remote namespace fibers settle.
    // Delay the assertion so mountApp sees the complete client graph; real
    // activation failures still throw after the bounded wait. The minified
    // identifiers vary between builds, and 0.1.7 moved the assertion into nE.
    const legacyPatch = source.replace(
      /await ([A-Za-z_$][\w$]*)\.await\(\),this\.assertEntriesActive\(([A-Za-z_$][\w$]*)\)/,
      'await $1.await(),await new Promise(r=>setTimeout(r,8000)),this.assertEntriesActive($2)',
    )
    const patched = legacyPatch !== source
      ? legacyPatch
      : source.replace(
          /await ([A-Za-z_$][\w$]*)\.await\(\),([A-Za-z_$][\w$]*)\(([A-Za-z_$][\w$]*),([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\)/,
          'await $1.await(),await new Promise(r=>setTimeout(r,8000)),$2($3,$4)',
        )
    if (patched === source) return

    ctx.effect(() =>
      ctx.webServer.register({
        kind: 'exact',
        path: `/assets/${basename(assetPath)}`,
        handler: (_req, res) => {
          res.writeHead(200, {
            'cache-control': 'no-store',
            'content-type': 'application/javascript; charset=utf-8',
          })
          res.end(patched)
        },
      }),
    )
  } catch {
    // Upstream assets are optional from DSHB's perspective. A missing or changed
    // frontend layout simply skips this version-specific workaround.
  }
```

</details>

**依据 5 · 源码核查**：[packages/dshb/src/auth/index.ts:78-94](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/auth/index.ts#L78-L94)

禁用宿主原认证判断。

<details>
<summary>查看原文（17行）</summary>

```text
  // DSH 0.1.5 introduced a browser-auth fence on the connection package: the SPA
  // fallback calls connection.authorizeIndex() on "/" (mints/checks DSH's own
  // launch-token cookie), and /api routes run requestRejection() which 401s when
  // that DSH cookie is absent. DSHB uses its own session cookie and must stay the
  // sole auth gate (DSH 0.1.1 had no such connection fence, so DSHB worked there).
  // Neutralize the connection's browserAuth.isAuthenticated check so DSH's fence
  // never rejects a DSHB-authenticated (or loopback) request; DSHB's gate still
  // rejects unauthenticated access to gated routes. Property is read at request
  // time, so installing it once after connection is ready suffices.
  ctx.inject(['connection'], (connCtx: Context) => {
    const conn = (connCtx as unknown as { connection?: { browserAuth?: { isAuthenticated?: (...a: unknown[]) => unknown; __dshbNeutralized?: true } } }).connection
    const auth = conn?.browserAuth
    if (auth && typeof auth.isAuthenticated === 'function' && !auth.__dshbNeutralized) {
      auth.isAuthenticated = () => true
      auth.__dshbNeutralized = true
    }
  })
```

</details>

**依据 6 · 源码核查**：[packages/dshb/src/exec-ssh/connection.ts:58-81](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/exec-ssh/connection.ts#L58-L81)

执行连接配置未带hostVerifier。

<details>
<summary>查看原文（24行）</summary>

```text
function buildConnectConfig(target: SshTarget, secrets: SshSecrets): ConnectConfig {
  const cfg: ConnectConfig = {
    host: target.host,
    port: target.port,
    username: target.username,
    readyTimeout: HANDSHAKE_TIMEOUT_MS,
    keepaliveInterval: 0,
    keepaliveCountMax: 3,
  }
  switch (target.auth.kind) {
    case 'password':
      if (secrets.password) cfg.password = secrets.password
      break
    case 'key':
      if (secrets.privateKey) {
        cfg.privateKey = secrets.privateKey
        if (secrets.passphrase) cfg.passphrase = secrets.passphrase
      }
      break
    case 'agent':
      cfg.agent = process.env.SSH_AUTH_SOCK ?? undefined
      break
  }
  return cfg
```

</details>

**依据 7 · 源码核查**：[packages/dshb/src/exec-ssh/world.ts:31-42](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/exec-ssh/world.ts#L31-L42)

world到连接池的target构造。

<details>
<summary>查看原文（12行）</summary>

```text
    const target = {
      host: config.host,
      port: config.port,
      username: config.username,
      auth: config.auth,
      jump: config.jump,
    }
    const connection = pool.acquire(target, config.secrets)
    this.executor = new SshExecutor(connection, nodeId, audit ? (op, t, r) => audit(nodeId, op, t, r) : undefined)
    this.fs = new SshFileSystem(this.executor)
    this.subprocess = new SshSubprocessRuntime(this.executor)
    this.shell = new SshShellExecutor(this.executor)
```

</details>

**依据 8 · 源码核查**：[packages/dshb/src/core/sync/coordinator.ts:102-108](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/sync/coordinator.ts#L102-L108)

同步指纹错误单独分类，不代表执行链路。

```text
function mapFailure(error: unknown): SyncCoordinatorError {
  if (error instanceof SyncCoordinatorError) return error
  if (error instanceof SyncPeerNotFoundError) return new SyncCoordinatorError('peer-not-found', '同步节点已不存在')
  if (error instanceof SyncHostKeyChallengeError) {
    const code = error.decision === 'changed' ? 'host-key-changed' : 'host-key-untrusted'
    return new SyncCoordinatorError(code, error.message)
  }
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 节点与会话同步如何处理冲突、中断与已有状态？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

同步具有明确的冲突与恢复设计，而非简单复制目录。core 把 peer、状态、节点、会话服务和协调器注册在同一组合中，并启动调度与未完成批次恢复。节点双向计划以来源身份对应记录，比较revision；同revision但摘要不同直接报revision-conflict。协调器按peer复用进行中的Promise，避免同peer并发启动；其本地apply和远端apply按顺序执行，因而不能宣称两端原子提交。

会话导入先校验bundle及摘要、拒绝未允许的同实例导入，创建携带bundle的journal。每个prepared记录落盘后才apply；必要时先归档已有会话，最后排序并complete journal。恢复逐个读pending batch、核对bundle摘要、重新串行应用，某批失败保留pending并汇总错误。写事件时检查header、继承事件计数和已有事件前缀，只追加缺少的后缀再flush；前缀冲突拒绝覆盖。这个设计为幂等恢复提供具体支持，但批内前项可能已经生效，之后的错误不是整体回滚成功；断网后仍要按两端记录与journal确认状态。没有运行中断实验，不能把恢复机制写成零丢失保证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dshb/src/core/index.ts:70-118](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/index.ts#L70-L118)

协调器、调度和恢复接线。

<details>
<summary>查看原文（49行）</summary>

```text
  const syncCoordinator = new SyncCoordinator(syncPeerManager, syncState, syncNodes, syncSshTransport, Date.now, syncSessions)
  const syncScheduler = new SyncScheduler(syncPeerManager, syncCoordinator)
  ctx.provide('nodeRegistry', registry)
  ctx.provide('knownHosts', knownHosts)
  ctx.provide('workspaceBindings', bindings)
  ctx.provide('syncPeerStore', syncPeers)
  ctx.provide('syncStateStore', syncState)
  ctx.provide('syncNodeService', syncNodes)
  ctx.provide('syncSessionService', syncSessions)
  ctx.provide('syncOfflineArchiveService', syncOfflineArchives)
  ctx.provide('syncPeerManager', syncPeerManager)
  ctx.provide('syncSshTransport', syncSshTransport)
  ctx.provide('syncCoordinator', syncCoordinator)
  ctx.provide('syncScheduler', syncScheduler)
  ctx.provide('dshbAudit', sharedAuditLogger())
  sharedWorldResolver().setBindings(bindings)
  void registerNodeRoutes(ctx, registry, bindings, () => workspaceRegistry, syncNodes)
  void registerSshConfigRoutes(ctx, knownHosts)
  void registerWorkspaceRoutes(ctx, registry, bindings, syncNodes)
  void registerRemoteDownloadRoutes(ctx, registry, bindings)
  void registerWorkspaceInstructionRoutes(ctx, sharedWorkspaceInstructionStore())
  registerSyncPeerRoutes(ctx, syncPeerManager, syncSshTransport, syncCoordinator)
  registerSyncInternalRoutes(ctx, syncState, syncNodes, syncSessions)
  registerSyncSessionRoutes(ctx, syncSessions)
  registerSyncOfflineRoutes(ctx, syncOfflineArchives)
  ctx.effect(() => {
    const stopScheduler = syncScheduler.start()
    let disposed = false
    setImmediate(() => {
      if (disposed) return
      void (async () => {
        try {
          await syncSessions.recoverPending()
        } catch {
          ctx.logger.warn('sync session recovery remains pending')
        }
        try {
          await syncOfflineArchives.recoverPending()
        } catch {
          ctx.logger.warn('offline archive recovery remains pending')
        }
      })()
    })
    return () => {
      disposed = true
      stopScheduler()
    }
  })
  registerWorkspaceInstructionInjector(ctx)
```

</details>

**依据 2 · 源码核查**：[packages/dshb/src/core/sync/coordinator.ts:59-99](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/sync/coordinator.ts#L59-L99)

节点冲突规划。

<details>
<summary>查看原文（41行）</summary>

```text
export function planNodeTransfers(
  direction: SyncPeer['direction'],
  localEntries: readonly SyncNodeEntry[],
  remoteEntries: readonly SyncNodeEntry[],
): NodeTransferPlan {
  const toLocal: SyncNodeEntry[] = []
  const toRemote: SyncNodeEntry[] = []
  if (direction === 'pull') return { toLocal: [...remoteEntries], toRemote, skipped: 0 }

  const localByKey = new Map(localEntries.map((entry) => [syncRecordKey('node', entry.metadata), entry]))
  const remoteByKey = new Map(remoteEntries.map((entry) => [syncRecordKey('node', entry.metadata), entry]))
  const keys = new Set([...localByKey.keys(), ...remoteByKey.keys()])
  let skipped = 0

  for (const key of keys) {
    const local = localByKey.get(key)
    const remote = remoteByKey.get(key)
    if (!local) {
      toLocal.push(remote!)
      continue
    }
    if (!remote) {
      toRemote.push(local)
      continue
    }

    const comparison = compareSyncRevision(local.metadata.revision, remote.metadata.revision)
    if (comparison > 0) {
      toRemote.push(local)
    } else if (comparison < 0) {
      toLocal.push(remote)
    } else if (
      local.metadata.contentDigest === remote.metadata.contentDigest &&
      Boolean(local.metadata.deleted) === Boolean(remote.metadata.deleted)
    ) {
      skipped += 1
    } else {
      throw new SyncCoordinatorError('revision-conflict', 'Equal node revisions contain different content')
    }
  }
  return { toLocal, toRemote, skipped }
```

</details>

**依据 3 · 源码核查**：[packages/dshb/src/core/sync/coordinator.ts:157-195](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/sync/coordinator.ts#L157-L195)

同peer在途复用及本地/远端顺序应用。

<details>
<summary>查看原文（39行）</summary>

```text
  run(peerId: string): Promise<SyncRunSummary> {
    const active = this.inFlight.get(peerId)
    if (active) return active
    const run = this.execute(peerId)
    this.inFlight.set(peerId, run)
    void run.then(() => this.clear(peerId, run), () => this.clear(peerId, run))
    return run
  }

  private async execute(peerId: string): Promise<SyncRunSummary> {
    const peer = await this.peers.get(peerId)
    if (!peer) throw new SyncCoordinatorError('peer-not-found', '同步节点已不存在')
    if (!peer.enabled) throw new SyncCoordinatorError('peer-disabled', '此同步节点已停用')

    const startedAt = new Date(this.now()).toISOString()
    this.peers.updateProgress(peer.id, {
      lastRunAt: startedAt,
      lastRunStatus: 'running',
      lastErrorCode: undefined,
      lastErrorMessage: undefined,
    })

    try {
      if (peer.syncSessions && !this.sessions) throw new SyncCoordinatorError('sessions-unavailable', '会话同步服务不可用')
      const remoteManifest = await this.retryTransport(() => this.transport.fetchNodeManifest(peer.id))
      if (remoteManifest.protocolVersion !== 1 || remoteManifest.instanceId === this.state.instanceId()) {
        throw new SyncCoordinatorError('protocol-invalid', '同步 peer 协议版本或实例身份无效')
      }
      const remoteEntries = this.nodes.validateManifest(remoteManifest.records)
      const localManifest = await this.nodes.exportManifest()
      const localEntries = this.nodes.validateManifest(localManifest.records)
      const plan = planNodeTransfers(peer.direction, localEntries, remoteEntries)

      const localResult = plan.toLocal.length > 0
        ? await this.nodes.applyManifest(plan.toLocal, peer.name, 'peer')
        : EMPTY_APPLY_RESULT
      const remoteResult = plan.toRemote.length > 0
        ? await this.retryTransport(() => this.transport.applyNodeManifest(peer.id, plan.toRemote, localManifest.instanceId))
        : EMPTY_APPLY_RESULT
```

</details>

**依据 4 · 源码核查**：[packages/dshb/src/core/sync/session-sync.ts:1133-1153](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/sync/session-sync.ts#L1133-L1153)

pending恢复校验并保留失败。

<details>
<summary>查看原文（21行）</summary>

```text
  async recoverPending(): Promise<void> {
    const failures: unknown[] = []
    for (const batch of this.journal.pendingBatches()) {
      try {
        const bundle = this.journal.readBundle(batch.batchId)
        if (bundle === undefined) throw new SyncSessionError('journal-missing-bundle', '未完成的会话 journal 缺少 bundle')
        const validatedBundle = validateSyncSessionBundle(bundle)
        if (validatedBundle.digest !== batch.bundleDigest) {
          throw new SyncSessionError('journal-bundle-mismatch', '会话 journal bundle 摘要不匹配')
        }
        await this.serializeMutation(() => this.applyBundleNow(bundle, batch.sourceName, batch.peerId, {
          importedVia: batch.importedVia,
          allowSameInstance: batch.allowSameInstance,
        }, batch))
      } catch (error) {
        failures.push(error)
      }
    }
    if (failures.length > 0) {
      throw new AggregateError(failures, 'One or more sync session batches remain pending')
    }
```

</details>

**依据 5 · 源码核查**：[packages/dshb/src/core/sync/session-sync.ts:1276-1300](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/sync/session-sync.ts#L1276-L1300)

bundle校验与journal起点。

<details>
<summary>查看原文（25行）</summary>

```text
    const bundle = validateSyncSessionBundle(value)
    const pendingBatch = recoveryBatch ?? this.journal.findBatch(peerId, bundle.digest)
    if (pendingBatch && (pendingBatch.bundleDigest !== bundle.digest || pendingBatch.peerId !== peerId)) {
      throw new SyncSessionError('journal-bundle-mismatch', '会话 journal batch 与 bundle 不匹配')
    }
    const importedVia = pendingBatch?.importedVia ?? options.importedVia ?? 'peer'
    const allowSameInstance = pendingBatch?.allowSameInstance ?? options.allowSameInstance ?? false
    const localInstanceId = this.state.instanceId()
    if (bundle.instanceId === localInstanceId && !allowSameInstance) {
      throw new SyncSessionError('same-instance', 'cannot import sessions from this instance')
    }
    if (!pendingBatch) await this.exportBundleNow()
    this.preflightBundle(bundle, { importedVia, allowSameInstance })
    const safeSourceName = (pendingBatch?.sourceName ?? sourceName).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, 128) || 'sync peer'
    const recordKeys = bundle.entries.map((entry) => entry.branchId ?? sessionOriginKey(entry.metadata))
    const batchId = pendingBatch?.batchId ?? this.journal.beginWithBundle(
      peerId,
      safeSourceName,
      bundle.digest,
      recordKeys,
      bundle,
      new Date(this.now()).toISOString(),
      importedVia,
      allowSameInstance,
    )
```

</details>

**依据 6 · 源码核查**：[packages/dshb/src/core/sync/session-sync.ts:1417-1453](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/sync/session-sync.ts#L1417-L1453)

prepared持久化、逐项应用与最后完成。

<details>
<summary>查看原文（37行）</summary>

```text
        let preparedValue = this.journal.readPrepared(batchId, key)
        let prepared: PreparedSyncSession
        if (preparedValue === undefined) {
          try {
            prepared = await this.prepareEntry(entry, safeSourceName, plannedSessionIds, entryWorkspace, importedVia)
          } catch (error) {
            if (error instanceof SyncSessionError && error.code === 'workspace-unmapped') {
              result.skipped += 1
              result.unmapped += 1
              continue
            }
            throw error
          }
          this.journal.writePrepared(batchId, key, prepared)
          preparedValue = prepared
        }
        prepared = this.validatePrepared(preparedValue)

        if (current && !current.deleted && current.localEntityId !== prepared.localSessionId) {
          if (await this.archiveCurrent(current)) result.archived += 1
        }

        const existed = (await this.requirePersistence().stat(prepared.localSessionId)) !== undefined
        await this.applyPrepared(prepared)
        if (prepared.branchId) result.archived += 1
        else if (existed) result.updated += 1
        else result.created += 1

        queueWorkspaceOrder(prepared.workspaceId, prepared.localSessionId, prepared.workspacePosition)
      }

      await this.orderWorkspaceSessions(workspaceOrders)
      this.journal.complete(batchId)
      return result
    } catch (error) {
      if (error instanceof SyncSessionError) throw error
      throw new SyncSessionError('session-apply-failed', '会话同步应用失败', error)
```

</details>

**依据 7 · 源码核查**：[packages/dshb/src/core/sync/session-sync.ts:2037-2067](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/sync/session-sync.ts#L2037-L2067)

已有事件前缀校验和后缀追加。

<details>
<summary>查看原文（31行）</summary>

```text
  private async writeSession(prepared: PreparedSyncSession): Promise<boolean> {
    const persistence = this.requirePersistence()
    const existed = await persistence.stat(prepared.localSessionId)
    const handle = existed
      ? await persistence.open(prepared.localSessionId, 'write')
      : await persistence.create(prepared.header, prepared.header.isSeeded ? { inheritedEventCount: prepared.inheritedEventCount } : undefined)
    try {
      if (canonicalJson(handle.header) !== canonicalJson(prepared.header) || handle.inheritedEventCount !== prepared.inheritedEventCount) {
        throw new SyncSessionError('session-id-conflict', '目标 session ID 已被其他 header 占用')
      }
      const existing: SessionEvent[] = []
      for (let offset = 0; ; ) {
        const page = await handle.read(offset, SESSION_READ_PAGE_SIZE)
        if (page.events.length === 0) break
        existing.push(...page.events)
        offset += page.events.length
        if (page.events.length < SESSION_READ_PAGE_SIZE) break
      }
      if (existing.length > prepared.events.length) throw new SyncSessionError('session-prefix-conflict', '目标 session 前缀比导入记录更长')
      for (let index = 0; index < existing.length; index += 1) {
        if (canonicalJson(existing[index]) !== canonicalJson(prepared.events[index])) {
          throw new SyncSessionError('session-prefix-conflict', '目标 session 的已提交事件与导入前缀不同')
        }
      }
      for (let offset = existing.length; offset < prepared.events.length; offset += SESSION_READ_PAGE_SIZE) {
        await handle.append(prepared.events.slice(offset, Math.min(offset + SESSION_READ_PAGE_SIZE, prepared.events.length)))
      }
      await handle.flush()
    } finally {
      await handle.close()
    }
```

</details>

#### 缺口

- 跨两端中断与批内部分应用尚无实测。
  **影响**：不能确定所有错误点都能无重复恢复。
  **进一步探讨**：在副本会话中于prepared、事件追加、远端响应丢失各点中断并核对摘要与事件数。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工作区指令如何进入Agent，持续使用的成本和退出负担是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

工作区指令是按会话冻结的用户配置，不是每步跟随最新项目文本。首次有直接用户消息且尚无本插件指令消息时，代码按cwd解析工作区，读取指令并createIfAbsent；已存在快照直接复用，没有记录也会保存空快照。agent/pre-step 在下游未拒绝后加入带来源与digest的用户消息，防止同一会话重复插入；session/deleted时尝试清除快照。因此修改工作区指令后，已有会话不应被假定立即更新；好处是会话解释更稳定，代价是用户需理解会话快照边界。

首次使用需操作者核对宿主依赖、组合加载、远端权限、凭据和工作区绑定；持续成本来自远端资源、连接、同步检查以及指令治理，不能把MIT许可等同总成本为零。定时同步仅给enabled且every-5m的peer启动，停止函数清理订阅和计时器，但路由apply调用decorators后未保存返回的还原函数，不能保证热卸载自动恢复原服务。退回手动SSH前应停用同步、保存配置与会话、重启干净profile，再核对本地与远端目录，不能假设卸载即终止远端作业。现金金额、配置耗时、恢复时长均无记录，保持未知。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dshb/src/core/workspace-instruction-context.ts:85-129](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/workspace-instruction-context.ts#L85-L129)

首次直接用户输入时冻结快照，空指令也冻结。

<details>
<summary>查看原文（45行）</summary>

```text
export async function resolveSnapshotForSession(
  agent: AgentLike,
  messages: MessageLike[],
  workspaceStore = sharedWorkspaceInstructionStore(),
  snapshotStore = sharedSessionInstructionSnapshotStore(),
  registry?: WorkspaceRegistryLike,
): Promise<SessionInstructionSnapshot | undefined> {
  const sessionId = agent.session.id
  const existing = snapshotStore.get(sessionId)
  if (existing) return existing

  const isFirstDirect = hasDirectUserMessage(messages) && !hasOwnInstructionMessage(agent)
  if (!isFirstDirect) return undefined

  let workspaceId: string | undefined
  let workspaceTitle = 'Unknown'
  const cwd = agent.session.header.cwd
  if (registry && cwd) {
    try {
      const ws = await registry.resolveByPath(cwd)
      if (ws) {
        workspaceId = ws.id
        workspaceTitle = ws.title
      }
    } catch {
      // path 不可解析时创建无工作区空快照
    }
  }

  const record: WorkspaceInstructionRecord | undefined = workspaceId
    ? workspaceStore.get(workspaceId)
    : undefined

  if (!record || record.text.length === 0) {
    return snapshotStore.createIfAbsent(sessionId, {
      kind: 'empty',
      workspaceId,
    })
  }

  return snapshotStore.createIfAbsent(sessionId, {
    kind: 'workspace',
    record,
    workspaceId: workspaceId!,
  })
```

</details>

**依据 2 · 源码核查**：[packages/dshb/src/core/workspace-instruction-context.ts:137-181](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/workspace-instruction-context.ts#L137-L181)

pre-step注入与会话删除清理。

<details>
<summary>查看原文（45行）</summary>

```text
  ;(ctx as unknown as { on: (event: string, handler: (arg: { agent: AgentLike; messages: MessageLike[]; signal: AbortSignal }, next: () => Promise<{ kind: string; messages: MessageLike[] }>) => Promise<unknown>) => void }).on('agent/pre-step', async ({ agent, messages, signal }, next) => {
    const decision = await next()
    if (decision.kind === 'reject') return decision
    signal.throwIfAborted()

    const agentLike = agent as unknown as AgentLike
    const messagesLike = messages as unknown as MessageLike[]

    const registry = ctx.get('workspaceRegistry') as WorkspaceRegistryLike | undefined

    let snapshot = snapshotStore.get(agentLike.session.id)
    if (!snapshot) {
      snapshot = await resolveSnapshotForSession(
        agentLike,
        messagesLike,
        workspaceStore,
        snapshotStore,
        registry,
      )
    }
    signal.throwIfAborted()
    if (!snapshot || snapshot.text.length === 0) return decision

    if (hasOwnInstructionMessage(agentLike)) return decision

    const workspaceId = snapshot.workspaceId
    if (!workspaceId) return decision
    const ws = registry?.get(workspaceId)
    const workspaceTitle = ws?.title ?? 'Unknown'

    const message = createInstructionMessage(workspaceId, workspaceTitle, snapshot)
    const lastClaimedIndex = decision.messages.findLastIndex((m) =>
      (messages as unknown as MessageLike[]).includes(m as unknown as MessageLike),
    )
    const entered = decision.messages.toSpliced(lastClaimedIndex + 1, 0, message)
    return {
      ...decision,
      messages: entered,
    }
  })

  try {
    ;(ctx as { on?: (event: string, handler: (sessionId: string) => void) => void }).on?.('session/deleted', (sessionId: string) => {
      snapshotStore.remove(sessionId)
    })
```

</details>

**依据 3 · 源码核查**：[packages/dshb/src/core/sync/scheduler.ts:28-37](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/sync/scheduler.ts#L28-L37)

可选五分钟调度。

<details>
<summary>查看原文（10行）</summary>

```text
    const configure = (peer: Pick<SyncPeer, 'id' | 'enabled' | 'schedule'>): void => {
      if (!peer.enabled || peer.schedule !== 'every-5m') {
        clearTimer(peer.id)
        return
      }
      if (timers.has(peer.id)) return
      const timer = setInterval(() => {
        void this.coordinator.run(peer.id).catch(() => {})
      }, this.intervalMs)
      timers.set(peer.id, timer)
```

</details>

**依据 4 · 源码核查**：[packages/dshb/src/core/sync/scheduler.ts:70-83](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/sync/scheduler.ts#L70-L83)

停止订阅和计时器。

<details>
<summary>查看原文（14行）</summary>

```text
    const unsubscribe = this.peers.subscribe((peerId, peer) => {
      generation += 1
      if (peer) configure(peer)
      else clearTimer(peerId)
      refresh()
    })
    refresh()

    return () => {
      if (stopped) return
      stopped = true
      unsubscribe()
      for (const timer of timers.values()) clearInterval(timer)
      timers.clear()
```

</details>

**依据 5 · 源码核查**：[packages/dshb/src/router/index.ts:12-18](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/router/index.ts#L12-L18)

apply未保存decorator还原函数。

```text
export function apply(ctx: Context): void {
  ctx.provide('dshbRouter', sharedWorldResolver())
  decorateFileSystem(ctx.fs)
  decorateSubprocess(ctx.subprocess)
  decorateShell(ctx.shell)
  decorateTerminalController(ctx)
}
```

**依据 6 · 源码核查**：[packages/dshb/src/router/decorate-fs.ts:110-121](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/router/decorate-fs.ts#L110-L121)

装饰器提供还原函数，但接线未接入此返回值。

<details>
<summary>查看原文（12行）</summary>

```text
  return () => {
    fs.stat = origStat
    fs.lstat = origLstat
    fs.readText = origReadText
    fs.streamText = origStreamText
    fs.readBytes = origReadBytes
    if (origReadByteRange) fs.readByteRange = origReadByteRange
    else delete (fs as unknown as { readByteRange?: unknown }).readByteRange
    fs.listDir = origListDir
    fs.writeText = origWriteText
    fs.editText = origEditText
  }
```

</details>

#### 缺口

- 没有端到端人工时间、资源账单及退出执行记录。
  **影响**：不能量化合格任务成本或承诺热卸载恢复。
  **进一步探讨**：用同一远程改文件任务记录首次配置、日常操作、故障恢复和重启退出耗时。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前贡献支持怎样的试用、采用及未来验证？

**研究主题**：贡献与相对优势、新假设与验证、采用判断

#### 完整回答

当前建议观察。统一工作区绑定、多个宿主接口转交以及有日志的会话同步是可解释的集成贡献；相较手动SSH，它把“选目标节点”的责任前移到持久绑定，可能减少反复切换，但这个收益尚未用合格任务对照验证。对只运行一次SSH命令的人，额外认证、节点、镜像路径和同步状态很可能不值得；对多节点开发者则有明确待验证价值。普通shell不能可靠响应取消、绑定读取错误可退回local、执行SSH没有接入已登记主机指纹，以及认证强耦合，使当前不宜推荐处理重要数据或公网持续使用。

由上述限制推导一个未验证假设：让每次远端操作携带不可变的节点身份、绑定版本与取消能力声明，并把“绑定不可读”和“明确未绑定”分开处理，可能在保留透明路由的同时减少错误目标及取消误判。它需要改变resolver和执行协议，增加用户确认或失败信息，不能说已经实现。最小验证以隔离目录的读取、修改、短命令和可取消长命令为同一任务集，与手动SSH比较；注入损坏绑定、节点缺失和中断，观察实际目标、远端存活进程、重复事件与人工恢复时间。如果改造后仍存在错误目标或取消状态与实际进程不一致，假设不成立；若用户根本不承担重复切换负担，也应停止该方向。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dshb/src/router/resolve.ts:27-34](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/router/resolve.ts#L27-L34)

统一解析但缺少绑定版本/操作身份。

```text
  resolve(absPath: string): WorldRef {
    const r = resolveWorld(absPath, this.bindings)
    if (r.kind === 'local') return { kind: 'local' }
    for (const reg of this.registries) {
      const provider = reg.get(r.nodeId)
      if (provider) return { kind: 'remote', provider, remotePath: r.remotePath }
    }
    return { kind: 'unrouted', nodeId: r.nodeId }
```

**依据 2 · 源码核查**：[packages/dshb/src/router/decorate-shell.ts:74-95](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/router/decorate-shell.ts#L74-L95)

取消能力与透明路由的矛盾。

<details>
<summary>查看原文（22行）</summary>

```text
    observed: {
      stdout: outputReader((result) => result.stdout, () => collected),
      stderr: outputReader((result) => result.stderr, () => collected),
    },
    kill: () => false,
    result: () => resultPromise,
  }

  return Promise.resolve(execution as unknown as ShellExecution)
}

export function decorateShell(shell: ShellExecutor): () => void {
  const resolver = sharedWorldResolver()

  const origExecute = shell.execute.bind(shell)

  shell.execute = async (spec: ShellExecSpec): Promise<ShellExecution> => {
    const ref = resolver.resolve(spec.workdir ?? '')
    if (ref.kind === 'local') return origExecute(spec)
    if (ref.kind === 'unrouted') throw new Error(`node ${ref.nodeId} world not available`)
    await ref.provider.ensureDir(ref.remotePath).catch(() => {})
    return executionFromRemoteRun(ref.provider.shell, { ...spec, workdir: ref.remotePath })
```

</details>

**依据 3 · 源码核查**：[packages/dshb/src/core/sync/session-sync.ts:2037-2067](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/sync/session-sync.ts#L2037-L2067)

可借鉴的前缀校验与恢复单元。

<details>
<summary>查看原文（31行）</summary>

```text
  private async writeSession(prepared: PreparedSyncSession): Promise<boolean> {
    const persistence = this.requirePersistence()
    const existed = await persistence.stat(prepared.localSessionId)
    const handle = existed
      ? await persistence.open(prepared.localSessionId, 'write')
      : await persistence.create(prepared.header, prepared.header.isSeeded ? { inheritedEventCount: prepared.inheritedEventCount } : undefined)
    try {
      if (canonicalJson(handle.header) !== canonicalJson(prepared.header) || handle.inheritedEventCount !== prepared.inheritedEventCount) {
        throw new SyncSessionError('session-id-conflict', '目标 session ID 已被其他 header 占用')
      }
      const existing: SessionEvent[] = []
      for (let offset = 0; ; ) {
        const page = await handle.read(offset, SESSION_READ_PAGE_SIZE)
        if (page.events.length === 0) break
        existing.push(...page.events)
        offset += page.events.length
        if (page.events.length < SESSION_READ_PAGE_SIZE) break
      }
      if (existing.length > prepared.events.length) throw new SyncSessionError('session-prefix-conflict', '目标 session 前缀比导入记录更长')
      for (let index = 0; index < existing.length; index += 1) {
        if (canonicalJson(existing[index]) !== canonicalJson(prepared.events[index])) {
          throw new SyncSessionError('session-prefix-conflict', '目标 session 的已提交事件与导入前缀不同')
        }
      }
      for (let offset = existing.length; offset < prepared.events.length; offset += SESSION_READ_PAGE_SIZE) {
        await handle.append(prepared.events.slice(offset, Math.min(offset + SESSION_READ_PAGE_SIZE, prepared.events.length)))
      }
      await handle.flush()
    } finally {
      await handle.close()
    }
```

</details>

**依据 4 · 源码核查**：[packages/dshb/src/core/workspace-bindings.ts:33-44](https://github.com/Artenx/dsh-honeybee/blob/dc3c35f3bc312932632882d3d39cccfc6bceb312/packages/dshb/src/core/workspace-bindings.ts#L33-L44)

错误状态与无绑定混同的推导依据。

<details>
<summary>查看原文（12行）</summary>

```text
  private load(): void {
    if (this.loaded) return
    this.loaded = true
    try {
      this.bindings = (JSON.parse(readFileSync(this.file(), 'utf8')) as WorkspaceBinding[]).map((b) => ({
        ...b,
        mirrorPath: normalize(b.mirrorPath),
        remotePath: normalize(b.remotePath),
      }))
    } catch {
      this.bindings = []
    }
```

</details>

#### 缺口

- 假设未实现且没有用户需求或效果对照。
  **影响**：不能宣称改造已降低错误或有商业价值。
  **进一步探讨**：先记录真实多节点任务，再用同资源故障注入对照支持或推翻假设。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
