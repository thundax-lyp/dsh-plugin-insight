# dsh-science

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[23767ab](https://github.com/biociao/dsh-science/tree/23767ab2f8d7bcf84a0820daa4c6ae79549da000)

<!-- BEGIN META -->
[![GitHub ★ 47](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=47&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/biociao/dsh-science) [![npm 30d 1,384](https://img.shields.io/static/v1?label=npm+30d&message=1%2C384&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-science) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-science)
<!-- END META -->

> **功能**：为DSH组织研究记录、版本化产物和SSH/SLURM远程任务，附科学Skills与模型路由依赖。

> **亮点**：[Q02](#research-q02)结构化问题假设/实验记录；[Q03](#research-q03)版本文件/来源/hash；[Q04](#research-q04)可追真实远端执行接线，而非独立科学验证。

> **主要限制**：[Q04](#research-q04)approve参数可跳作业审批、远端先启动本地后记、项目Jxx/scratch冲突；[Q05](#research-q05)取消失败仍标killed、unknown/输出/UI权限和写锁边界限制采用。

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
  - [Q01 · 它是自动科学Agent，还是给Host组织研究与远程工具的插件？](#detail-section-11)
  - [Q02 · research状态如何真实写入，结论状态意味着什么？](#detail-section-12)
  - [Q03 · artifact归档、校验与reproduce能支持多强的复现？](#detail-section-13)
  - [Q04 · 远程任务的审批、项目授权与真实执行怎样接通？](#detail-section-14)
  - [Q05 · 状态、取消、拉回和主机UI的失败边界是什么？](#detail-section-15)
  - [Q06 · 当前可采用到哪一步，验证什么方向才有意义？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：dsh-science0.2.0是MIT、Node>=18的DSH原生bundle/研究preset/Skills工具集，面向能审数据/脚本/结论的科研开发者。包把research/artifact/remote引擎和远程主机UI装入profile，另依赖dsh-model-tier^0.1.0；并非独立模型/科学验证器。基线是实验笔记+git/文件hash、手工SSH/SLURM或原生可信远程工具组合，成功须输入/脚本/目标和真实结果可对账，并经独立科学/数据验收。

笔记+git/文件hash和手工SSH/SLURM/原生远程工具；真实结果/停止和科学验收由人核。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| research记录 | 问题/假设/实验状态 | 非独立科学验证 |
| artifact | 版本/hash/复现说明 | 非自动重跑/WORM |
| remote | 真SSH/SCP/后台/SLURM | 审批可关/目录冲突/停机须核 |
| 主机UI | 配置/真实probe | Origin非认证/无共用锁 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| Node>=18/DSH tools/approval/Web | 对应路径必需 | 加载/审批/UI | 当前Host未运行 |
| SSH/SCP/bash/远端账户 | 远程必需 | 真脚本/传输 | 账户权限非插件沙箱 |
| SLURM或nohup/setsid/timeout | 按模式 | 后台计算 | 实际可用/取消须验 |
| 项目独立scratch/数据环境 | 采用前提 | 控Jxx冲突与复现 | 配额只本项目记录 |
| dsh-model-tier^0.1.0/模型 | 伴随路由 | 单独依赖/选择 | 本轮不全验发布行为 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 记录 | 低敏固定数据/人工计划 | phase非科学验收 |
| 归档 | 小文件/输入环境/hash | reproduce说明须真重跑 |
| 准备 | 核私有Host/权限/独立账户scratch | 不凭默认审批 |
| 提交 | 一确定输出小任务 | 核真实远端job/本地记录 |
| 恢复 | unknown/cancel失败先对账 | 不信killed/不盲重投 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Host/SSH/环境/账户未知 | 权限/数据/脚本/目录核对 | 未安装/连接 |
| 持续 | 模型/远端CPU-GPU/磁盘网络未知 | 审原始数据/方法/结果 | 无总费用封顶 |
| 故障 | 孤儿job/冲突/残留未知 | 查PID/SLURM/状态 | 本地kill非远端停止 |
| 退出 | scratch/产物/日志留存未知 | 真停机/清远端/备份 | 卸载非数据计算撤回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 研究记录 | 真manifest/状态写 | 科学结论/自治循环 |
| 产物版本 | 真复制/hash/provenance | 完整环境/自动复现 |
| 远端执行 | 真SSH/SLURM/后台 | 不丢不重/全局配额 |
| 状态/取消 | 真probe/cancel与记录 | killed对应真实停机 |

> **思考**：[Q04](#research-q04)approve参数可跳作业审批、远端先启动本地后记、项目Jxx/scratch冲突；[Q05](#research-q05)取消失败仍标killed、unknown/输出/UI权限和写锁边界限制采用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)结构化问题假设/实验记录；[Q03](#research-q03)版本文件/来源/hash；[Q04](#research-q04)可追真实远端执行接线，而非独立科学验证。

[Q02](#research-q02)记录状态与锁约定需分清；[Q03](#research-q03)hash/来源非科学验证；[Q04](#research-q04)/[Q05](#research-q05)真实提交/终止/结果收据不可用状态代替。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04)approve参数可跳作业审批、远端先启动本地后记、项目Jxx/scratch冲突；[Q05](#research-q05)取消失败仍标killed、unknown/输出/UI权限和写锁边界限制采用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06)观察；低敏本地记录先核，远端需私有Host/独立账户与唯一scratch，未知回手工对账。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持记录/归档和代表远程执行；取消状态、审批/目录/UI安全及恢复边界显著，观察。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、engines/artifact-registry.mjs、engines/core.mjs、engines/remote-compute.mjs、engines/remote-hosts-ui.mjs、engines/research-loop.mjs、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：新项source；核根bundle/companion归属、research记录/锁与状态、artifact保存/hash/verify/reproduce说明、remote项目授权/作业审批/exec与代表SSH-SCP/后台-SLURM提交、jobs写时序/status/cancel/pull、主机UI同源/探测/JSON写；未全审45统计文件、所有Skills/模型路由/全部shell字段注入、Host外围认证/权限与真实远端运行。
- 下一步：只读固定源码，不运行SSH/本地bash/目标/模型/测试/Host/账号或浏览器；无科研正确性、复现/性能/安全/费用或真实恢复独立验证。

**分析版本**

- **仓库**：[biociao/dsh-science](https://github.com/biociao/dsh-science)
- **版本号**：0.2.0（[固定提交 23767ab](https://github.com/biociao/dsh-science/tree/23767ab2f8d7bcf84a0820daa4c6ae79549da000)）
- **版本日期**：2026-08-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)分开提交/真实终止/独立结果验收收据与唯一项目远端命名，先比人工清单/小修，不算已有成果。

只读固定源码，不运行SSH/本地bash/目标/模型/测试/Host/账号或浏览器；无科研正确性、复现/性能/安全/费用或真实恢复独立验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 1320 | 1162 | 94 | — |
| .md | source | 23 | 2312 | — | — | 27536 |
| .mjs | source | 17 | 9541 | 8154 | 850 | — |
| .mjs | test | 1 | 550 | 441 | 54 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/biociao/dsh-science/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分研究记录/归档与真实SSH执行，核审批/持久/取消/拉回/UI关键边界，不以状态当科学验证。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它是自动科学Agent，还是给Host组织研究与远程工具的插件？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

dsh-science0.2.0是MIT、Node>=18的DSH原生bundle/研究preset/Skills工具集，面向能审数据/脚本/结论的科研开发者。包把research/artifact/remote引擎和远程主机UI装入profile，另依赖dsh-model-tier^0.1.0；并非独立模型/科学验证器。基线是实验笔记+git/文件hash、手工SSH/SLURM或原生可信远程工具组合，成功须输入/脚本/目标和真实结果可对账，并经独立科学/数据验收。

作者称ReAct research-loop和11Skills，但所核research工具主要登记/推进状态并给下一步建议，实际模型决策和工具调用循环由DSH/模型承担。artifact_reproduce也只输出重跑步骤，不执行命令。远程执行才有真shell/SSH/SLURM副作用，不能把研究phase或hash一致等同实验正确、可重复结论或临床有效。

companion模型分档的包声明/patch另有归属；当前patch说明虚拟provider按会话opt-in，与README早期全局waterfall叙述不可混同。本轮未全审该依赖发布物/路由和本地科学Skills，不将其宣传收益归为本根已验证贡献。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-7](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/package.json#L1-L7)

当前身份/版本/MIT。

```text
{
  "name": "dsh-science",
  "version": "0.2.0",
  "description": "Claude Science-style research workbench for DeepSeek Harness: ReAct research-loop engine (research_* tools), versioned artifacts with provenance (artifact_* tools), SSH remote-compute engine for long bioinformatics jobs on workstations/HPC (remote_* tools), and 11 science skills for genomics / pathogens / bioinformatics. Ships the tiered cross-provider model router via the companion dsh-model-tier bundle.",
  "type": "module",
  "license": "MIT",
  "author": "fangchao <fangchao@genomics.cn>",
```

**依据 2 · 源码核查**：[package.json:36-48](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/package.json#L36-L48)

Node/真实引擎与client导出。

<details>
<summary>查看原文（13行）</summary>

```text
  "engines": {
    "node": ">=18"
  },
  "packageManager": "pnpm@9.15.0",
  "main": "./engines/remote-hosts-ui.mjs",
  "exports": {
    ".": "./engines/remote-hosts-ui.mjs",
    "./engines/*": "./engines/*",
    "./skills/*": "./skills/*",
    "./preset/*": "./preset/*",
    "./client": "./client/remote-hosts-ui/lib/client.js",
    "./client/*": "./client/*",
    "./package.json": "./package.json"
```

</details>

**依据 3 · 源码核查**：[package.json:62-77](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/package.json#L62-L77)

实际模型路由依赖与DSH bundle/client。

<details>
<summary>查看原文（16行）</summary>

```text
    "react": "^18.2.0",
    "dsh-model-tier": "^0.1.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": ["@deepseek-ai/dsh-client-runtime", "@deepseek-ai/dsh-client-ui-settings"]
    }
  },
  "scripts": {
    "test": "node scripts/smoke-test.mjs && node packages/dsh-model-tier/test/model-tier.test.mjs",
    "test:stability": "node scripts/stability-test.mjs",
    "sync": "bash scripts/sync-engines.sh",
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:9-31](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/cordis.patch.yml#L9-L31)

实际三引擎/主机UI加载及审批配置。

<details>
<summary>查看原文（23行）</summary>

```text
- insert:
    - id: science-research-loop
      name: dsh-science/engines/research-loop.mjs
    - id: science-artifact-registry
      name: dsh-science/engines/artifact-registry.mjs
    - id: science-remote-compute
      name: dsh-science/engines/remote-compute.mjs
      config:
        # 远程作业每次提交默认要求审批（等价于 Claude Science 的 "Run this job on <host>?" 卡）。
        # requireHostAccess：首次使用某主机默认审批并写入本项目白名单（allowlist.json）。
        # 无人值守/CI 场景请将两者改为 false。
        requireApproval: true
        requireHostAccess: true
    # 远程主机配置 UI 的宿主侧：为浏览器设置页提供 REST API（webServer 前缀路由
    # /dsh-science/remote-hosts/*），读写与 remote-compute 引擎同一套 hosts/白名单/作业
    # 文件，并支持真实 ssh 只读探测。客户端 bundle 由 package.json 的 dsh.client 声明
    # （client/remote-hosts-ui/lib/client.js，scripts/build-client-bundle.mjs 生成）。
    # 注意：本行 name 必须是包根名 `dsh-science`（经 exports["."] 指向
    # engines/remote-hosts-ui.mjs）——client-modules 按 loader 条目名
    # require.resolve("<name>/package.json") 定位 dsh.client 声明，子路径条目名
    # 解析不到 package.json，客户端 bundle 会被静默跳过（设置页不出现）。
    - id: science-remote-hosts-ui
      name: dsh-science
```

</details>

**依据 5 · 作者声明**：[cordis.patch.yml:32-42](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/cordis.patch.yml#L32-L42)

当前companion独立与opt-in说明。

<details>
<summary>查看原文（11行）</summary>

```text
    # 模型分档路由（HOST 平面）：来自配套依赖包 dsh-model-tier（package.json
    # dependencies；profile 安装为 hoisted nodeLinker，包根名可解析）。
    # dsh-model-tier 也可脱离 dsh-science 单独安装到任意 profile
    # （dsh plugin add dsh-model-tier），两处条目 id 一致（model-tier），
    # 语义：注册虚拟 provider「智能分档」，会话在模型选择器选中方案后才路由
    # （按会话 opt-in，无全局路由）；未配置档位时选择器不出现方案，示例配置
    # 可安全随包发布。
    # 注意：config 与 packages/dsh-model-tier/cordis.patch.yml 保持一致。
    - id: model-tier
      name: dsh-model-tier
      config:
```

</details>

**依据 6 · 作者声明**：[README.md:9-21](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/README.md#L9-L21)

作者研究/产物/远程/Skill范围主张。

<details>
<summary>查看原文（13行）</summary>

```text
**A Claude Science–style research workbench for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) — for genomics / pathogens / human health / bioinformatics projects.**

> One-liner: **dsh-science** — Claude Science-style research workbench for DSH: ReAct research-loop engine (research_* tools), versioned artifacts with provenance (artifact_* tools), an SSH remote-compute engine (remote_* tools, mirroring Claude Science's Computer / Remote compute clusters), and 11 science skills for genomics / pathogens / bioinformatics.

- **ReAct research loop engine** — `research_init` / `research_state` / `research_hypothesis` / `research_experiment` / `research_findings` / `research_phase` / `research_review` / `research_report`, persisted in a `research-manifest.json` state machine (Question → Hypothesis → Experiment → Observe → Analyze → Conclude → Next Question).
- **Versioned artifacts with provenance** — `artifact_save` / `artifact_list` / `artifact_show` / `artifact_diff` / `artifact_verify` / `artifact_deprecate` / `artifact_reproduce`: every result saved as `artifacts/<name>/v<N>/` with per-file SHA-256, `artifact.json` provenance (command / inputs / environment / envFile) and an append-only `provenance.md`.
- **Remote compute engine (SSH / HPC clusters)** — 16 tools: `remote_host_add` / `remote_host_probe` / `remote_host_notes` / `remote_run` / `remote_status` / `remote_logs` / `remote_pull` / `remote_cancel` / `remote_exec` etc. Connect lab workstations or HPC clusters via `~/.ssh/config` aliases (nothing installed on the host, zero third-party deps). Long bioinformatics jobs run as detached processes on workstations or via `sbatch` on SLURM — they survive connection loss; submission asks for approval by default; `remote_status` batch-monitors and auto-transitions state (running → succeeded/failed/killed); `remote_pull` fetches outputs back (files over the size threshold stay on the host with their paths recorded).
- **Remote Hosts config UI (bundle/profile-level)** — a Settings > 远程主机 page (the analog of Claude Science's Settings > Compute > SSH hosts): list/add/probe/edit/remove hosts, plus each project's access allowlist and job summary. Host-side REST API (`webServer` route `/dsh-science/remote-hosts/*`, `engines/remote-hosts-ui.mjs`) + client bundle (`client/remote-hosts-ui/`, built by `scripts/build-client-bundle.mjs`) sharing the same data files as the remote engine. Requires a web-process restart to activate (see [docs/remote-hosts-ui.md](docs/remote-hosts-ui.md)).
- **Model Tier router (tiered, cross-provider)** — via the companion bundle [`dsh-model-tier`](packages/dsh-model-tier/): within one session, automatically routes auxiliary requests (session titles, compaction summaries) and subagent/background tasks to a **light tier**, keeps the main conversation on the **default tier**, and escalates complex work (deep subagent chains, very long inputs) to a **strong tier** — each tier may point at a **different provider** (e.g. strong GLM-5.3 / default deepseek-v4-flash / light minimax-M3), mirroring Claude Code's Opus/Sonnet/Haiku strategy. Built on DSH's native `agent/request` + `llm/stream` waterfall extension points; a no-op when the tier's provider is unregistered. Installed automatically with dsh-science, but also standalone-installable into any profile (`dsh plugin add dsh-model-tier`).
- **11 science skills** — research-loop, science-project-setup, artifact-provenance, scientific-reviewer, literature-connector, parallel-delegation, manuscript-writing, bioinformatics-toolkit, conda-environments, data-inventory, remote-compute.

All in-repo engine plugins are **zero-dependency** (Node built-ins + the system OpenSSH binaries, sharing `engines/core.mjs`) and register plain cordis tools; the companion `dsh-model-tier` router is likewise zero-dependency. Installable either as a profile bundle (`dsh plugin add`) or as an agent preset (`科学模式`).

```

</details>

**依据 7 · 源码核查**：[engines/research-loop.mjs:490-496](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/research-loop.mjs#L490-L496)

研究工具返回下一步建议而非运行实验。

```text
        const suggestion = [
          "下一步建议：",
          "1. 把代码写入 experiments/" + expId + "/code/ 并运行，结果放 results/。",
          "2. 运行后用 research_findings 记录观察（finding）；若可下结论，填 conclusion（supported/refuted/inconclusive）更新假设状态。",
          "3. 重要结果用 artifact_save 归档（artifacts/<name>/v<N>/）。",
        ].join("\n");
        return `已登记实验 ${expId}，目录：${dir}\n\n${suggestion}\n\n` + (await dashboard(root, m));
```

**依据 8 · 源码核查**：[engines/artifact-registry.mjs:574-581](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/artifact-registry.mjs#L574-L581)

reproduce实际只返回重跑步骤。

```text
        "## 复现步骤",
        "1. 确认输入文件可用并核对输入哈希（见上；缺失时从 data/ 或原始来源恢复）。",
        "2. 重建运行环境（见 envs/ 或 conda-environments 技能；有 envFile 时按其中记录恢复并核对哈希）。",
        "3. 在 analyses/ 中重跑产生该工件的命令/脚本，输出到 experiments/ 对应实验的 results/。",
        "4. 对比新输出与 `artifact_show " + name + "` / `artifact_verify " + name + "` 的文件 SHA-256 是否一致。",
        "",
      ];
      return lines.join("\n");
```

#### 缺口

- 当前DSH兼容、发行依赖/路由/Skills、研究需求与科学/节时效果未验证。
  **影响**：不能据工具名或作者类比宣称自动科学循环/真实节约算力。
  **进一步探讨**：先用手工笔记/SSH基线，对一份低敏固定数据核结果/证据与恢复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · research状态如何真实写入，结论状态意味着什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

research_init解root并创建项目目录/manifest和缺省README；hypothesis校初始状态，仅允许proposed/testing，再append并推进phase。experiment真正建code/results/design/log脚手架并登记experiment，返回让Agent写代码运行、再记finding的建议，不自己执行实验。research_findings校实验/状态转移，再把传入finding append日志、按传入conclusion更新假设；这是结构化研究记录，不独立测数据/统计显著性或证明supported。

withManifestCfg持锁load→调用更新→save，core JSON写临时同目录文件再rename；文件锁用wx排他、默认等10秒、mtime老30秒可回收，finally删除。其保护是文件级约定，不是多文件/远程事务；未见所核锁heartbeat/PID存活复验，长操作超过stale窗口可能被别写方回收，不能沿README说并发从此不丢更新。日志append/目录与manifest不在统一事务，audit失败也best-effort不阻断。

一般root解析允许显式root相对/绝对并向上找marker，无会话cwd可回process.cwd；这是定位机制，不是工作区权限边界，Host工具权限仍需限制。记录状态与脚手架便利不能替人工核原始结果与独立审阅。

#### 证据与依据

**依据 1 · 源码核查**：[engines/research-loop.mjs:315-345](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/research-loop.mjs#L315-L345)

真实初始化/目录/README。

<details>
<summary>查看原文（31行）</summary>

```text
    async execute(args, exec) {
      const root = await core.resolveRoot(args, exec, markers);
      const existing = await loadManifest(root);
      if (existing) {
        await ensureProjectDirs(root); // 幂等：目录缺失时补建
        return `项目已存在（${await manifestPath(root)}）。\n\n` + (await dashboard(root, existing));
      }
      const m = emptyManifest(core.optStr(args, "title", ""), core.optStr(args, "domain", "life-science"), args.question);
      await core.withFileLock(await manifestPath(root), async () => {
        await ensureProjectDirs(root);
        await saveManifest(root, m);
      }, lockOpts);
      const readme = path.join(root, "README.md");
      if (!existsSync(readme)) {
        await fsp.writeFile(
          readme,
          [
            `# ${m.project.title}`,
            "",
            `领域：${m.project.domain}`,
            "",
            "本目录是科研项目根。研究状态由 research-manifest.json 维护（由 research_* 工具更新）。",
            "目录约定：experiments/ 实验记录 ｜ literature/ 文献 ｜ artifacts/ 版本化工件与溯源 ｜",
            "analyses/ 分析脚本 ｜ figures/ 图表 ｜ manuscript/ 论文 ｜ data/ 数据 ｜ envs/ 环境记录。",
            "",
          ].join("\n"),
          "utf8"
        );
      }
      const warn = m.question.text ? "" : "\n⚠ 提示：未设置核心研究问题。可用 research_hypothesis 的 question 参数设置。\n";
      return `已初始化科研项目「${m.project.title}」（${root}）。\n${warn}` + (await dashboard(root, m));
```

</details>

**依据 2 · 源码核查**：[engines/research-loop.mjs:402-418](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/research-loop.mjs#L402-L418)

真实假设状态校验与登记。

<details>
<summary>查看原文（17行）</summary>

```text
    async execute(args, exec) {
      const root = await core.resolveRoot(args, exec, markers);
      const text = core.requireStr(args, "text");
      const status = args.status ?? "proposed";
      if (!INITIAL_HYP_STATUSES.includes(status)) {
        throw core.sciErr("ERR_VALIDATION", `初始状态只能是 ${INITIAL_HYP_STATUSES.join("/")}（结论须经研究验证产生）`);
      }
      return withManifestCfg(root, async (m) => {
        const id = core.nextSeqId(m.hypotheses, "H");
        m.hypotheses.push({ id, text, status, experiments: [], reviews: [], updatedAt: core.nowISO() });
        if (args.question && String(args.question).trim()) {
          m.question = { text: String(args.question).trim(), updatedAt: core.nowISO() };
        }
        advancePhaseIfForward(m, "hypothesis");
        appendHistory(m, "hypothesis", `${id}：${text}`);
        return `已登记假设 ${id}。\n\n` + (await dashboard(root, m));
      });
```

</details>

**依据 3 · 源码核查**：[engines/research-loop.mjs:440-451](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/research-loop.mjs#L440-L451)

真实实验目录创建。

<details>
<summary>查看原文（12行）</summary>

```text
    audit,
    async execute(args, exec) {
      const root = await core.resolveRoot(args, exec, markers);
      const title = core.requireStr(args, "title");
      const objective = core.optStr(args, "objective", "");
      const hyp = core.optStr(args, "hypothesis", "");
      const steps = core.asList(args.plan);
      return withManifestCfg(root, async (m) => {
        const expId = core.nextSeqId(m.experiments, "E", 2);
        const dir = path.join(root, "experiments", expId);
        await fsp.mkdir(path.join(dir, "code"), { recursive: true });
        await fsp.mkdir(path.join(dir, "results"), { recursive: true });
```

</details>

**依据 4 · 源码核查**：[engines/research-loop.mjs:486-496](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/research-loop.mjs#L486-L496)

登记后给运行建议。

<details>
<summary>查看原文（11行）</summary>

```text
          reviews: [],
        });
        advancePhaseIfForward(m, "experiment");
        appendHistory(m, "experiment", `${expId}：${title}`, "experiment");
        const suggestion = [
          "下一步建议：",
          "1. 把代码写入 experiments/" + expId + "/code/ 并运行，结果放 results/。",
          "2. 运行后用 research_findings 记录观察（finding）；若可下结论，填 conclusion（supported/refuted/inconclusive）更新假设状态。",
          "3. 重要结果用 artifact_save 归档（artifacts/<name>/v<N>/）。",
        ].join("\n");
        return `已登记实验 ${expId}，目录：${dir}\n\n${suggestion}\n\n` + (await dashboard(root, m));
```

</details>

**依据 5 · 源码核查**：[engines/research-loop.mjs:523-548](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/research-loop.mjs#L523-L548)

真实finding/结论由参数写入。

<details>
<summary>查看原文（26行）</summary>

```text
      return withManifestCfg(root, async (m) => {
        const exp = findExperiment(m, expId); // 先校验实验存在，再写日志（未知实验不产生垃圾目录）
        // 提前校验结论转移是否合法（避免拒绝时留下半截日志）
        if (args.conclusion && exp.hypothesis) {
          const h0 = findHypothesis(m, exp.hypothesis);
          const allowed = HYP_TRANSITIONS[h0.status] ?? [];
          if (!allowed.includes(args.conclusion)) {
            throw core.sciErr(
              "ERR_VALIDATION",
              `假设 ${h0.id} 不允许状态转移 ${h0.status} → ${args.conclusion}（允许：${allowed.join(", ") || "无"}；结论须先经 testing）`
            );
          }
        }
        const logPath = path.join(root, "experiments", expId, "log.md");
        const stamp = core.nowISO();
        await fsp.mkdir(path.dirname(logPath), { recursive: true });
        await fsp.appendFile(logPath, `\n## ${stamp}\n\n${finding}\n`, "utf8");
        const notes = [`${expId}：${finding}`];
        if (args.conclusion) {
          exp.status = "concluded";
          exp.concludedAt = stamp;
          if (exp.hypothesis) {
            const h = findHypothesis(m, exp.hypothesis);
            setHypothesisStatus(h, args.conclusion);
            h.updatedAt = stamp;
            if (!h.experiments.includes(expId)) h.experiments.push(expId);
```

</details>

**依据 6 · 源码核查**：[engines/research-loop.mjs:285-296](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/research-loop.mjs#L285-L296)

真实lock/load/update/save封装。

<details>
<summary>查看原文（12行）</summary>

```text
  const withManifestCfg = async (root, fn) =>
    core.withFileLock(
      await manifestPath(root),
      async () => {
        const m = await loadManifest(root);
        if (!m) throw core.sciErr("ERR_NOT_INIT", "项目未初始化，请先调用 research_init");
        const out = await fn(m);
        await saveManifest(root, m);
        return out;
      },
      lockOpts
    );
```

</details>

**依据 7 · 源码核查**：[engines/core.mjs:138-156](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/core.mjs#L138-L156)

实际临时写/rename JSON。

<details>
<summary>查看原文（19行）</summary>

```text
export async function writeFileAtomic(file, data) {
  const dir = path.dirname(file);
  try {
    await fsp.mkdir(dir, { recursive: true });
  } catch (err) {
    throw sciErr("ERR_IO", `创建目录失败 ${dir}：${err.message}`);
  }
  const tmp = path.join(dir, `.${path.basename(file)}.${process.pid}.${Date.now()}.tmp`);
  try {
    await fsp.writeFile(tmp, data, "utf8");
    await fsp.rename(tmp, file);
  } catch (err) {
    await fsp.rm(tmp, { force: true }).catch(() => {});
    throw sciErr("ERR_IO", `写入失败 ${file}：${err.message}`);
  }
}

export async function writeJsonAtomic(file, obj) {
  await writeFileAtomic(file, JSON.stringify(obj, null, 2) + "\n");
```

</details>

**依据 8 · 源码核查**：[engines/core.mjs:163-205](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/core.mjs#L163-L205)

真实wx锁/mtime回收/释放。

<details>
<summary>查看原文（43行）</summary>

```text
export async function withFileLock(file, fn, opts = {}) {
  const timeoutMs = opts.timeoutMs ?? 10000;
  const staleMs = opts.staleMs ?? 30000;
  const lockPath = `${file}.lock`;
  const start = Date.now();

  const acquire = async () => {
    for (;;) {
      try {
        await fsp.mkdir(path.dirname(lockPath), { recursive: true }); // 首次初始化时根目录可能还不存在
        const fh = await fsp.open(lockPath, "wx");
        try {
          await fh.writeFile(JSON.stringify({ pid: process.pid, at: nowISO() }));
        } finally {
          await fh.close();
        }
        return;
      } catch (err) {
        if (err.code !== "EEXIST") throw sciErr("ERR_IO", `创建锁失败 ${lockPath}：${err.message}`);
        // 陈旧锁回收
        try {
          const st = await fsp.stat(lockPath);
          if (Date.now() - st.mtimeMs > staleMs) {
            await fsp.rm(lockPath, { force: true });
            continue;
          }
        } catch {
          continue; // 锁刚被释放
        }
        if (Date.now() - start > timeoutMs) {
          throw sciErr("ERR_LOCK_TIMEOUT", `等待锁超时（${timeoutMs}ms）：${lockPath}`);
        }
        await sleep(20 + Math.random() * 60);
      }
    }
  };

  await acquire();
  try {
    return await fn();
  } finally {
    await fsp.rm(lockPath, { force: true }).catch(() => {});
  }
```

</details>

**依据 9 · 源码核查**：[engines/core.mjs:81-116](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/core.mjs#L81-L116)

真实cwd/root定位与进程回退。

<details>
<summary>查看原文（36行）</summary>

```text
export function resolveCwd(exec) {
  try {
    const c = exec?.agent?.session?.header?.cwd ?? exec?.agent?.session?.cwd;
    if (typeof c === "string" && c.length > 0) return c;
  } catch {
    /* 忽略 */
  }
  return process.cwd();
}

// 注意：~/.dsh 是 DSH 自身的配置主目录（DSH_HOME 默认值），不是项目标记。
// 若把 HOME 当作项目根，任何从 home 下出发且路径上没有 .git/.dsh 的探测都会
// 命中 ~/.dsh，把整个 home 当成"项目"并在其中脚手架目录。因此 HOME 永不
// 作为自动探测的项目根（确需以 home 为根时显式传 root 参数）。
export function findProjectRoot(start, markers) {
  let dir = path.resolve(start);
  const home = os.homedir();
  for (;;) {
    if (dir !== home) {
      for (const m of markers) {
        try {
          if (existsSync(path.join(dir, m))) return dir;
        } catch {
          /* 忽略 */
        }
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) return path.resolve(start);
    dir = parent;
  }
}

export async function resolveRoot(args, exec, markers) {
  const base = args?.root ? path.resolve(resolveCwd(exec), args.root) : resolveCwd(exec);
  return findProjectRoot(base, markers);
```

</details>

**依据 10 · 源码核查**：[engines/core.mjs:250-259](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/core.mjs#L250-L259)

audit写失败吞下。

<details>
<summary>查看原文（10行）</summary>

```text
// ── 审计日志（尽力而为，失败不影响主流程）───────────────────────────────────

export async function appendAudit(root, entry) {
  try {
    const p = path.join(root, ".science.log");
    await fsp.mkdir(path.dirname(p), { recursive: true });
    await fsp.appendFile(p, JSON.stringify({ at: nowISO(), ...entry }) + "\n", "utf8");
  } catch {
    /* best-effort */
  }
```

</details>

#### 缺口

- 长持锁/并发/崩溃多文件一致性、Host权限及科学效果未测。
  **影响**：不能把supported状态当独立验证，锁不是强全局事务。
  **进一步探讨**：可丢弃目录测并发/超过stale/写失败，按日志/manifest/原始结果逐项核。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · artifact归档、校验与reproduce能支持多强的复现？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

artifact_save先lexical withinRoot拒绝../等解析越界，遍历来源、stat/sha256Stream、复制到artifacts/name/vN；相同path+已存hash可hardlink旧版本，失败退copy。写artifact.json元数据、append provenance.md、写全局index，再best-effort回写manifest；多文件非同一事务，失败可部分完成。hardlink复用也非只读/WORM快照，用户改已归档inode可能影响链接版本，verify可查变化但不预防。

provenance.command/inputs/notes是调用者填写，inputs哈希缺失吞下只留路径，envFile显式缺失报错；environment主要Node/平台加可选文件hash，并非实际Python/conda/依赖锁完整捕获。artifact_verify重算归档文件hash并报告missing/mismatch，只证明所查字节与所存记录一致，不证明方法/数据来源可信。artifact_reproduce读meta后返回Markdown步骤，让人重建环境/重跑，不执行也不验证新输出。

withinRoot只比path.resolve字符串，来源stat/copy可能跟随符号链接；此处不是realpath权限隔离。调用者可以显式改root，不能将归档目录约定当数据不外泄或完整防越权。应仅在受控无链接/低敏数据目录核验，另审Host工具权限。

#### 证据与依据

**依据 1 · 源码核查**：[engines/artifact-registry.mjs:30-36](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/artifact-registry.mjs#L30-L36)

实际lexical路径包含。

```text
function withinRoot(root, rel) {
  const abs = path.resolve(root, rel);
  const r = path.resolve(root);
  if (abs !== r && !abs.startsWith(r + path.sep)) {
    throw core.sciErr("ERR_PATH", `路径越出项目根：${rel}`);
  }
  return abs;
```

**依据 2 · 源码核查**：[engines/artifact-registry.mjs:113-175](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/artifact-registry.mjs#L113-L175)

真实版本目录/哈希/硬链接或复制。

<details>
<summary>查看原文（63行）</summary>

```text
        });
        const version = (meta.versions.reduce((mx, v) => Math.max(mx, v.version || 0), 0)) + 1;
        const vdir = path.join(artifactDir, `v${version}`);
        await fsp.mkdir(vdir, { recursive: true });

        // 去重候选：任一旧版本有相同 path + sha256 → 硬链接复用（失败退化为复制）
        const prevCandidate = (relPath, sha) => {
          if (!allowHardlink) return null;
          for (const v of meta.versions) {
            for (const f of v.files || []) {
              if (f.path === relPath && f.sha256 === sha) {
                const abs = path.join(artifactDir, `v${v.version}`, relPath);
                if (existsSync(abs)) return { version: v.version, abs };
              }
            }
          }
          return null;
        };

        const archiveOne = async (srcAbs, relPath) => {
          const st = await fsp.stat(srcAbs);
          if (maxFileBytes && st.size > maxFileBytes) {
            throw core.sciErr(
              "ERR_QUOTA",
              `文件超过大小配额（${st.size} B > ${maxFileBytes} B）：${relPath}（可调 config.maxFileBytes）`
            );
          }
          const sha = await core.sha256Stream(srcAbs);
          const destAbs = path.join(vdir, relPath);
          await fsp.mkdir(path.dirname(destAbs), { recursive: true });
          const cand = prevCandidate(relPath, sha);
          if (cand) {
            try {
              await fsp.link(cand.abs, destAbs);
              return { path: relPath, sha256: sha, size: st.size, linkedFrom: `v${cand.version}` };
            } catch {
              /* 跨设备等 → 退化为复制 */
            }
          }
          await fsp.copyFile(srcAbs, destAbs);
          return { path: relPath, sha256: sha, size: st.size };
        };

        const files = [];
        for (const rel of rawSources) {
          const src = withinRoot(root, rel);
          let st;
          try {
            st = await fsp.stat(src);
          } catch (err) {
            throw core.sciErr("ERR_NOT_FOUND", `源路径不存在：${rel}（${err.message}）`);
          }
          if (st.isDirectory()) {
            const rels = await core.collectFiles(src, src);
            for (const r of rels) {
              const abs = path.join(src, r);
              const relPath = normalizeRel(path.join(path.basename(rel), r));
              files.push(await archiveOne(abs, relPath));
            }
          } else {
            const relPath = normalizeRel(path.basename(rel));
            files.push(await archiveOne(src, relPath));
          }
```

</details>

**依据 3 · 源码核查**：[engines/artifact-registry.mjs:178-205](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/artifact-registry.mjs#L178-L205)

inputs尽力hash与envFile/环境记录。

<details>
<summary>查看原文（28行）</summary>

```text
        // 溯源增强：inputs 哈希（尽力而为）+ envFile 哈希（显式指定必须存在）
        const inputHashes = [];
        for (const inp of core.asList(args.inputs)) {
          try {
            const abs = withinRoot(root, inp);
            const st = await fsp.stat(abs);
            if (st.isFile()) {
              inputHashes.push({ path: inp, sha256: await core.sha256Stream(abs), size: st.size });
            }
          } catch {
            /* 输入缺失：只记录路径，不阻断 */
          }
        }
        let envEntry = null;
        if (args.envFile) {
          const abs = withinRoot(root, args.envFile);
          try {
            const st = await fsp.stat(abs);
            if (st.isFile()) {
              envEntry = { path: args.envFile, sha256: await core.sha256Stream(abs), size: st.size };
            }
          } catch {
            throw core.sciErr("ERR_NOT_FOUND", `envFile 不存在：${args.envFile}`);
          }
        }
        const environment =
          `${process.platform} ${process.arch} / node ${process.version}` +
          (envEntry ? ` / env ${envEntry.path}#${envEntry.sha256.slice(0, 12)}` : "");
```

</details>

**依据 4 · 源码核查**：[engines/artifact-registry.mjs:207-244](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/artifact-registry.mjs#L207-L244)

真实metadata与provenance append。

<details>
<summary>查看原文（38行）</summary>

```text
        const entry = {
          version,
          created: core.nowISO(),
          author: sessionLabel(exec),
          provenance: {
            command: core.optStr(args, "command", ""),
            inputs: core.asList(args.inputs),
            inputHashes,
            envFile: envEntry ? { path: envEntry.path, sha256: envEntry.sha256 } : null,
            notes: core.optStr(args, "notes", ""),
            environment,
          },
          files,
        };
        meta.versions.push(entry);
        meta.updatedAt = core.nowISO();
        await core.writeJsonAtomic(metaPath, meta);

        // 溯源日志（追加式）
        const provPath = path.join(artifactDir, "provenance.md");
        const provLines = [
          `## v${version} · ${entry.created} · ${entry.author}`,
          "",
          ...(core.optStr(args, "description", "") ? [`描述：${core.optStr(args, "description", "")}`, ""] : []),
          ...(entry.provenance.command ? [`命令：\`${entry.provenance.command}\``, ""] : []),
          ...(entry.provenance.inputs.length ? [`输入：${entry.provenance.inputs.join(", ")}`, ""] : []),
          ...(inputHashes.length ? [`输入哈希：${inputHashes.map((h) => `${h.path}#${h.sha256.slice(0, 12)}`).join(", ")}`, ""] : []),
          ...(envEntry ? [`环境文件：\`${envEntry.path}\` sha256=${envEntry.sha256}`, ""] : []),
          ...(entry.provenance.notes ? [`备注：${entry.provenance.notes}`, ""] : []),
          `环境：${entry.provenance.environment}`,
          "",
          "| 文件 | SHA-256 | 大小 (B) | 来源 |",
          "| --- | --- | ---: | --- |",
          ...files.map((f) => `| \`${f.path}\` | \`${f.sha256}\` | ${f.size} | ${f.linkedFrom ? f.linkedFrom : "复制"} |`),
          "",
        ];
        await fsp.mkdir(path.dirname(provPath), { recursive: true });
        await fsp.appendFile(provPath, provLines.join("\n"), "utf8");
```

</details>

**依据 5 · 源码核查**：[engines/artifact-registry.mjs:246-274](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/artifact-registry.mjs#L246-L274)

实际index/manifest同步与输出。

<details>
<summary>查看原文（29行）</summary>

```text
        // 全局索引
        const indexPath = withinRoot(root, path.join("artifacts", "artifacts.json"));
        const index = await core.readJson(indexPath, { artifacts: [] });
        const existing = index.artifacts.find((a) => a.name === name);
        if (existing) {
          existing.latestVersion = version;
          existing.updatedAt = core.nowISO();
          existing.description = core.optStr(args, "description", existing.description);
        } else {
          index.artifacts.push({
            name,
            latestVersion: version,
            created: meta.created,
            updatedAt: core.nowISO(),
            description: core.optStr(args, "description", ""),
            tags: core.asList(args.tags),
          });
        }
        await core.writeJsonAtomic(indexPath, index);

        // 尽力回写研究清单（manifest 不存在则跳过；失败不影响工件保存）
        await syncManifestArtifacts(root, name, version, core.optStr(args, "description", ""), lockOpts);

        const out = [`工件 ${name} v${version} 已保存 → ${artifactDir}`, ""];
        for (const f of files) {
          out.push(`- ${f.path}  sha256=${f.sha256.slice(0, 16)}…  ${f.size} B${f.linkedFrom ? `  （去重：链接自 ${f.linkedFrom}）` : ""}`);
        }
        out.push("", "溯源已追加至 provenance.md。");
        return out.join("\n");
```

</details>

**依据 6 · 源码核查**：[engines/artifact-registry.mjs:447-474](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/artifact-registry.mjs#L447-L474)

真实verify检查文件哈希/缺失。

<details>
<summary>查看原文（28行）</summary>

```text
    async execute(args, exec) {
      const root = await core.resolveRoot(args, exec, markers);
      const name = core.requireStr(args, "name");
      const artifactDir = withinRoot(root, path.join("artifacts", core.slugify(name, name)));
      const meta = await core.readJson(path.join(artifactDir, "artifact.json"), null);
      if (!meta) throw core.sciErr("ERR_NOT_FOUND", `工件 ${name} 不存在。`);
      const vs = [...meta.versions].sort((a, b) => a.version - b.version);
      if (vs.length === 0) throw core.sciErr("ERR_NOT_FOUND", `工件 ${name} 没有任何版本。`);
      const version = args.version !== undefined ? Number(args.version) : vs[vs.length - 1].version;
      const entry = vs.find((e) => e.version === version);
      if (!entry) throw core.sciErr("ERR_NOT_FOUND", `工件 ${name} 没有 v${version}。`);
      const vdir = path.join(artifactDir, `v${version}`);
      const mismatches = [], missing = [];
      for (const f of entry.files || []) {
        const abs = path.join(vdir, f.path);
        let sha;
        try {
          sha = await core.sha256Stream(abs);
        } catch {
          missing.push({ path: f.path, expected: f.sha256 });
          continue;
        }
        if (sha !== f.sha256) mismatches.push({ path: f.path, expected: f.sha256, actual: sha });
      }
      const status = mismatches.length || missing.length ? "mismatch" : "ok";
      return { name, version, status, checked: entry.files.length, mismatches, missing };
    },
  }));
```

</details>

**依据 7 · 源码核查**：[engines/artifact-registry.mjs:549-581](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/artifact-registry.mjs#L549-L581)

真实reproduce只拼接/返回步骤。

<details>
<summary>查看原文（33行）</summary>

```text
    async execute(args, exec) {
      const root = await core.resolveRoot(args, exec, markers);
      const name = core.requireStr(args, "name");
      const artifactDir = withinRoot(root, path.join("artifacts", core.slugify(name, name)));
      const meta = await core.readJson(path.join(artifactDir, "artifact.json"), null);
      if (!meta) throw core.sciErr("ERR_NOT_FOUND", `工件 ${name} 不存在。`);
      const want = args.version ? Number(args.version) : meta.versions.length;
      const entry = meta.versions.find((v) => v.version === want);
      if (!entry) throw core.sciErr("ERR_NOT_FOUND", `工件 ${name} 没有 v${want}。`);
      const vdir = path.join(artifactDir, `v${entry.version}`);
      const lines = [
        `# 复现工件 ${name} v${entry.version}`,
        "",
        `工件目录：${vdir}`,
        "",
        "## 溯源记录",
        ...(entry.provenance.command ? [`- 命令：\`${entry.provenance.command}\``] : ["- 命令：（未记录）"]),
        ...(entry.provenance.inputs.length ? [`- 输入：${entry.provenance.inputs.join(", ")}`] : []),
        ...((entry.provenance.inputHashes || []).length
          ? [`- 输入哈希：${entry.provenance.inputHashes.map((h) => `${h.path}#${h.sha256.slice(0, 12)}`).join(", ")}`]
          : []),
        ...(entry.provenance.envFile ? [`- 环境文件：\`${entry.provenance.envFile.path}\` sha256=${entry.provenance.envFile.sha256}`] : []),
        `- 环境：${entry.provenance.environment}`,
        ...(entry.provenance.notes ? [`- 备注：${entry.provenance.notes}`] : []),
        "",
        "## 复现步骤",
        "1. 确认输入文件可用并核对输入哈希（见上；缺失时从 data/ 或原始来源恢复）。",
        "2. 重建运行环境（见 envs/ 或 conda-environments 技能；有 envFile 时按其中记录恢复并核对哈希）。",
        "3. 在 analyses/ 中重跑产生该工件的命令/脚本，输出到 experiments/ 对应实验的 results/。",
        "4. 对比新输出与 `artifact_show " + name + "` / `artifact_verify " + name + "` 的文件 SHA-256 是否一致。",
        "",
      ];
      return lines.join("\n");
```

</details>

**依据 8 · 源码核查**：[engines/artifact-registry.mjs:586-610](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/artifact-registry.mjs#L586-L610)

manifest尽力回写失败吞下。

<details>
<summary>查看原文（25行）</summary>

```text
// 尽力把工件登记回写 research-manifest.json 的 artifacts[]（与 research_* 共用同一锁）
async function syncManifestArtifacts(root, name, version, description, lockOpts) {
  const mp = path.join(root, "research-manifest.json");
  if (!existsSync(mp)) return;
  try {
    await core.withFileLock(
      mp,
      async () => {
        const m = await core.readJson(mp, null);
        if (!m) return;
        if (!Array.isArray(m.artifacts)) m.artifacts = [];
        const i = m.artifacts.findIndex((a) => a.name === name);
        const rec = { name, latestVersion: version, updatedAt: core.nowISO(), description };
        if (i >= 0) m.artifacts[i] = { ...m.artifacts[i], ...rec };
        else m.artifacts.push(rec);
        m.updatedAt = core.nowISO();
        await core.writeJsonAtomic(mp, m);
      },
      lockOpts
    );
  } catch {
    /* best-effort：清单不可用/被占用时不阻断工件保存 */
  }
}

```

</details>

#### 缺口

- 完整环境重建/新输出复现、符号链接/文件竞态/失败残留未测。
  **影响**：不能说已有自动再执行/不可变归档/科学可重复性保证。
  **进一步探讨**：固定小文件、环境记录和重跑命令人工复现，比较hash/语义，测链接修改与中途写失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 远程任务的审批、项目授权与真实执行怎样接通？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

remote默认requireHostAccess和requireApproval true，strict root只有显式root或session.cwd才继续（与通用header.cwd解析不同）；Host未获项目JSON allowlist时请求allowed-once并持久grant，无审批服务/agent则拒。授权对象是host在该root的访问权，不是每条命令/账户隔离，配置可关Host访问要求。remote_exec对已授权Host直接adapter.run任意cmd，未再走作业审批；local transport是真本机bash。

remote_run还有args.approve：true强制、false明确跳过每次作业审批，首次Host grant与作业审批会合并；因此默认有审批不等每次不可绕过。脚本/inputs先lexical root检查/读文件，建远端scratch/Jxx目录，写script/env/run.sh并SCP inputs，auto查sbatch后走SLURM或nohup/setsid后台工作站。adapter实际spawn ssh/scp或bash，使用当前系统SSH配置/密钥；这是远端执行，不是纯任务记录。Host权限/SSH账户权限之外没有此处容器/租户隔离。

任务在withJobs持锁期间远端先启动，随后才push running/save本地jobs；远端接受后本地写失败可留真实进程无已确认job，不能盲重投。Jxx从本项目jobs递增，但远端目录只scratch/Jxx，多个项目共同Host scratch存在碰撞风险；activeCount也只本项目记录，非主机全局配额。必须为项目分配独立scratch/账户、核真实Job/PID与脚本，不依赖注释“全隔离”。

#### 证据与依据

**依据 1 · 源码核查**：[engines/remote-compute.mjs:738-770](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L738-L770)

默认与strict root真实条件。

<details>
<summary>查看原文（33行）</summary>

```text
    ? config.markers
    : ["research-manifest.json", ".dsh", ".git"];
  const lockOpts = {
    timeoutMs: config.lock?.timeoutMs ?? 10000,
    staleMs: config.lock?.staleMs ?? 30000,
  };
  const cfg = {
    markers,
    hostsDir: config.hostsDir,
    requireApproval: config.requireApproval !== false, // 每次 remote_run 提交作业默认要求审批（对齐 Claude Science 的作业审批卡）
    requireHostAccess: config.requireHostAccess !== false, // 首次使用主机默认要求项目级授权（白名单审批）
    bigFileThresholdBytes: config.bigFileThresholdBytes,
    execTimeoutMs: config.execTimeoutMs ?? 120000,
  };

  // 严格项目根：仅当显式 root 或会话携带工作目录时才解析；
  // 否则返回 null（授权/白名单路径 fail-closed，绝不回退到进程级 cwd 造成跨项目共享）。
  const resolveRootStrict = async (args, exec) => {
    if (args?.root || exec?.agent?.session?.cwd) {
      return core.resolveRoot(args, exec, markers);
    }
    return null;
  };
  // 严格解析 + 失败即抛（用于作业注册表等按项目定位的读写路径）
  const resolveRootStrictOrThrow = async (args, exec, what) => {
    const root = await resolveRootStrict(args, exec);
    if (!root) {
      throw core.sciErr(
        "ERR_VALIDATION",
        `无法确定项目根（缺少会话工作目录），无法${what}。请显式传 root=…，或先将会话绑定到工作区。`
      );
    }
    return root;
```

</details>

**依据 2 · 源码核查**：[engines/remote-compute.mjs:151-180](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L151-L180)

真实allowlist检查/审批/持久grant。

<details>
<summary>查看原文（30行）</summary>

```text
async function ensureHostAccess(ctx, exec, root, hostId, reason, config) {
  if (config.requireHostAccess === false) return { created: false, skipped: true };
  if (await isHostAllowed(root, hostId)) return { created: false, granted: true };
  const approval = ctx?.get?.("approval");
  if (!approval || !exec?.agent) {
    throw core.sciErr(
      "ERR_ACCESS",
      `主机 ${hostId} 未在本项目授权，且无法请求审批（approval 服务或 agent 上下文不可用）。` +
        `授权方式：在 GUI 审批弹窗批准，或用 remote_host_allow 添加（同样需审批），或手动编辑 ${allowlistPath(root)}；` +
        `无人值守场景可设插件配置 requireHostAccess: false。\n申请内容：${reason}`
    );
  }
  const outcome = await approval.request({
    agent: exec.agent,
    toolName: exec.name || "remote",
    callId: exec.callId,
    reason,
    signal: exec.signal,
  });
  if (outcome !== "allowed-once") {
    throw core.sciErr("ERR_ACCESS", `主机 ${hostId} 未被授权用于本项目（${outcome}）。用户拒绝了访问申请：${reason.split("\n")[0]}`);
  }
  await core.withFileLock(
    allowlistPath(root),
    async () => {
      const list = await loadAllowlist(root);
      if (!list.hosts.some((h) => h.host === hostId)) {
        list.hosts.push({ host: hostId, grantedAt: core.nowISO(), grantedBy: exec?.agent?.session?.id ?? "agent", note: "首次使用审批授权" });
      }
      await saveAllowlist(root, list);
```

</details>

**依据 3 · 源码核查**：[engines/remote-compute.mjs:1246-1268](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L1246-L1268)

remote_exec授权后直接adapter.run。

<details>
<summary>查看原文（23行）</summary>

```text
      const adapter = makeAdapter(h);
      const timeoutSeconds = Math.min(Math.max(Number(args.timeoutSeconds ?? 60) || 60, 1), 600);
      const wd = args.workdir ? safePath(args.workdir, "workdir") : null;
      const full = wd ? `cd ${sq(h.transport === "local" ? expandHome(wd) : wd)} && ${cmd}` : cmd;
      const root = await resolveRootStrict(args, exec);
      if (!root) {
        throw core.sciErr(
          "ERR_ACCESS",
          "无法确定项目根（缺少会话工作目录），无法完成项目级授权。请在参数中显式传 root=…，或先将会话绑定到工作区。"
        );
      }
      await ensureHostAccess(ctx, exec, root, id, `在主机 ${id}（${h.alias}）执行命令：${cmd.slice(0, 200)}`, cfg);
      const t0 = Date.now();
      const res = await adapter.run(full, { timeoutMs: timeoutSeconds * 1000 });
      return {
        host: id,
        exitCode: res.code,
        stdout: res.stdout,
        stderr: res.stderr,
        elapsedMs: Date.now() - t0,
        timedOut: res.timedOut,
        truncated: res.truncated,
      };
```

</details>

**依据 4 · 源码核查**：[engines/remote-compute.mjs:287-311](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L287-L311)

实际SSH参数/local bash与runCommand。

<details>
<summary>查看原文（25行）</summary>

```text
function sshArgs(host, extra = []) {
  const args = [];
  if (host.batchMode !== false) args.push("-o", "BatchMode=yes");
  args.push("-o", "ConnectTimeout=15");
  if (host.port) args.push("-p", String(host.port));
  if (host.identityFile) args.push("-i", host.identityFile);
  args.push(...extra);
  args.push(host.alias);
  return args;
}

function scpArgs(host, extra = []) {
  const args = [];
  if (host.batchMode !== false) args.push("-o", "BatchMode=yes");
  args.push("-o", "ConnectTimeout=15");
  args.push("-q", "-r");
  if (host.port) args.push("-P", String(host.port));
  if (host.identityFile) args.push("-i", host.identityFile);
  args.push(...extra);
  return args;
}

function remoteExec(host, cmd, opts = {}) {
  if (host.transport === "local") return runCommand(["bash", "-c", cmd], opts);
  return runCommand(["ssh", ...sshArgs(host), cmd], opts);
```

</details>

**依据 5 · 源码核查**：[engines/remote-compute.mjs:318-331](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L318-L331)

真实adapter远端写文件命令/错误。

<details>
<summary>查看原文（14行）</summary>

```text
    local,
    async run(cmd, opts) {
      return remoteExec(host, cmd, opts);
    },
    async writeFile(rpath, content) {
      if (local) {
        await fsp.mkdir(path.dirname(rpath), { recursive: true });
        await fsp.writeFile(rpath, content, "utf8");
        return;
      }
      const dir = path.posix.dirname(rpath);
      const res = await remoteExec(host, `mkdir -p ${sq(dir)} && cat > ${sq(rpath)}`, { stdin: content });
      if (res.code !== 0) throw sshFail(res, `写入远程文件 ${rpath}`);
    },
```

</details>

**依据 6 · 源码核查**：[engines/remote-compute.mjs:397-421](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L397-L421)

真实SCP copyUp/copyDown与失败。

<details>
<summary>查看原文（25行）</summary>

```text
          const st = await fsp.stat(lp);
          if (st.isDirectory()) {
            await copyDir(lp, path.join(rdir, path.basename(lp)));
          } else {
            await fsp.mkdir(path.dirname(path.join(rdir, path.basename(lp))), { recursive: true });
            await fsp.copyFile(lp, path.join(rdir, path.basename(lp)));
          }
        }
        return;
      }
      const res = await runCommand(["scp", ...scpArgs(host), ...localPaths, `${host.alias}:${rdir}/`]);
      if (res.code !== 0) throw sshFail(res, `上传到 ${rdir}`);
    },
    async copyDown(rdir, names, ldir) {
      if (local) {
        await fsp.mkdir(ldir, { recursive: true });
        for (const n of names) {
          await copyDir(path.join(rdir, n), path.join(ldir, n));
        }
        return;
      }
      const targets = names.map((n) => `${host.alias}:${rdir}/${n}`);
      const res = await runCommand(["scp", ...scpArgs(host), ...targets, ldir + "/"]);
      if (res.code !== 0) throw sshFail(res, `拉取到 ${ldir}`);
    },
```

</details>

**依据 7 · 源码核查**：[engines/remote-compute.mjs:226-267](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L226-L267)

实际spawn/timeout/kill及错误返回。

<details>
<summary>查看原文（42行）</summary>

```text
function runCommand(argv, opts = {}) {
  return new Promise((resolve) => {
    const { stdin, timeoutMs, signal } = opts;
    const child = spawn(argv[0], argv.slice(1), { stdio: ["pipe", "pipe", "pipe"] });
    const out = { data: [], len: 0, truncated: false };
    const err = { data: [], len: 0, truncated: false };
    captureStream(child.stdout, out);
    captureStream(child.stderr, err);
    let timedOut = false;
    let aborted = false;
    let settled = false;

    const cleanup = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    };
    const onAbort = () => {
      if (settled) return;
      aborted = true;
      child.kill("SIGKILL");
    };
    const timer = timeoutMs
      ? setTimeout(() => {
          if (settled) return;
          timedOut = true;
          child.kill("SIGKILL");
        }, timeoutMs)
      : null;

    signal?.addEventListener("abort", onAbort, { once: true });
    if (stdin !== undefined && stdin !== null) {
      child.stdin.on("error", () => {});
      child.stdin.end(stdin);
    } else {
      child.stdin.end();
    }
    child.on("error", (e) => {
      // spawn 失败（如 ssh 不存在）：当作非零退出
      if (settled) return;
      settled = true;
      cleanup();
      resolve({ code: 127, stdout: "", stderr: `spawn 失败: ${e.message}`, timedOut, aborted, truncated: false });
```

</details>

**依据 8 · 源码核查**：[engines/remote-compute.mjs:1320-1345](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L1320-L1345)

脚本/输入lexical检查/读取。

<details>
<summary>查看原文（26行）</summary>

```text
        if (!scriptFileAbs.startsWith(path.resolve(root) + path.sep) && scriptFileAbs !== path.resolve(root)) {
          throw core.sciErr("ERR_PATH", `scriptFile 越出项目根：${args.scriptFile}`);
        }
        if (!existsSync(scriptFileAbs)) throw core.sciErr("ERR_NOT_FOUND", `scriptFile 不存在：${args.scriptFile}`);
      }
      if ((script === null) === (scriptFileAbs === null)) {
        throw core.sciErr("ERR_VALIDATION", "script 与 scriptFile 必须且只能提供一个");
      }
      const scriptContent = script !== null ? script : await fsp.readFile(scriptFileAbs, "utf8");
      if (!scriptContent.trim()) throw core.sciErr("ERR_VALIDATION", "脚本内容为空");

      const inputs = core.asList(args.inputs).map((p) => {
        const abs = path.resolve(root, p);
        if (!abs.startsWith(path.resolve(root) + path.sep) && abs !== path.resolve(root)) {
          throw core.sciErr("ERR_PATH", `input 越出项目根：${p}`);
        }
        if (!existsSync(abs)) throw core.sciErr("ERR_NOT_FOUND", `input 不存在：${p}`);
        return abs;
      });

      const { hosts } = await loadHosts(config);
      const h = findHost(hosts, hostId);
      const adapter = makeAdapter(h);
      const timeoutMinutes = args.timeoutMinutes !== undefined ? Number(args.timeoutMinutes) : (h.timeoutMinutes ?? DEFAULT_TIMEOUT_MIN);
      if (!Number.isFinite(timeoutMinutes) || timeoutMinutes < 1 || timeoutMinutes > 10080) {
        throw core.sciErr("ERR_VALIDATION", `timeoutMinutes 必须是 1–10080 的整数（当前 ${args.timeoutMinutes}）`);
```

</details>

**依据 9 · 源码核查**：[engines/remote-compute.mjs:1361-1390](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L1361-L1390)

真实approve false/项目activeCount/Jxx/远端写上传。

<details>
<summary>查看原文（30行）</summary>

```text
      // 生效规则：approve:true 强制要求；approve:false 显式跳过；缺省按 config.requireApproval（默认要求）。
      // 首次使用该主机时，授权审批（项目白名单）与本次作业审批合并为一次弹窗（grantNow=true 则不再弹第二次）。
      const grantNow = await ensureHostAccess(ctx, exec, root, hostId, `首次在本项目使用主机 ${hostId}（${h.alias}）并提交作业：\n${reason}`, cfg);
      const wantApproval = args.approve === true || (args.approve !== false && cfg.requireApproval);
      if (wantApproval && !grantNow.created) {
        await requireApproval(ctx, exec, reason, { requireApproval: true });
      }

      return withJobs(root, async (data) => {
        const jobs = data.jobs;
        const activeCount = jobs.filter((j) => j.host === hostId && ["submitted", "running"].includes(j.state)).length;
        if (activeCount >= (h.maxConcurrent ?? DEFAULT_MAX_CONCURRENT)) {
          throw core.sciErr("ERR_LIMIT", `主机 ${hostId} 并发作业已达上限 ${h.maxConcurrent}（当前 ${activeCount} 个活动）。等前面的作业结束或调高 maxConcurrent。`);
        }
        const jobId = core.nextSeqId(jobs, "J", 2);
        const jobDir = `${scratch.replace(/\/$/, "")}/${jobId}`;
        const job = newJob(jobId, hostId, title, jobDir);
        job.timeoutMinutes = timeoutMinutes;

        // 1) 建远程作业目录 + 上传
        await adapter.mkdir(jobDir);
        await adapter.mkdir(`${jobDir}/inputs`);
        await adapter.writeFile(`${jobDir}/script.sh`, scriptContent);
        if (args.env && typeof args.env === "object") {
          const envLines = Object.entries(args.env)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => `export ${String(k)}=${JSON.stringify(String(v))}`);
          await adapter.writeFile(`${jobDir}/env.sh`, envLines.join("\n") + "\n");
        }
        if (inputs.length) await adapter.copyUp(inputs, `${jobDir}/inputs`);
```

</details>

**依据 10 · 源码核查**：[engines/remote-compute.mjs:1392-1439](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L1392-L1439)

真实sbatch或nohup/setsid启动再push状态。

<details>
<summary>查看原文（48行）</summary>

```text
        // 2) 决定提交方式（auto：有 sbatch 用 slurm）
        let useSlurm = false;
        if (args.mode === "slurm") useSlurm = true;
        else if (args.mode === "direct") useSlurm = false;
        else {
          const chk = await adapter.run("command -v sbatch >/dev/null 2>&1 && echo yes || echo no");
          useSlurm = chk.stdout.trim() === "yes";
        }

        // 3) 生成 run.sh 并提交
        const workdir = args.workdir ? safePath(args.workdir, "workdir") : null;
        await adapter.writeFile(`${jobDir}/run.sh`, runShContent(jobDir, workdir, timeoutMinutes, useSlurm ? "slurm" : "direct"));
        let pid = null;
        let slurmJobId = null;
        if (useSlurm) {
          const timeFlag = timeoutMinutes && timeoutMinutes > 0 ? ` --time=${Math.floor(timeoutMinutes)}` : "";
          // 先 cd 再以 $(pwd) 取绝对路径作 --chdir（~ 不会被 sbatch 展开）
          const launch =
            `cd ${sq(jobDir)} && sbatch --parsable --chdir="$(pwd)" -o stdout.log -e stderr.log --job-name=dsh-${jobId}${timeFlag} run.sh 2> sbatch.err || (cat sbatch.err >&2; exit 1)`;
          const res = await adapter.run(launch, { timeoutMs: 60000 });
          if (res.code !== 0) throw sshFail(res, `sbatch 提交 ${jobId}`);
          slurmJobId = res.stdout.trim().split("\n").pop().trim();
          if (!/^\d+$/.test(slurmJobId)) {
            const m = /(\d+)/.exec(res.stdout + res.stderr);
            slurmJobId = m ? m[1] : null;
          }
          job.mode = "slurm";
          job.slurmJobId = slurmJobId;
        } else {
          // detached 启动：优先 setsid（独立会话，进程组可整体终止）；无 setsid（如 macOS）退化为 nohup。
          // run.sh 会把自身 $$ 写入 pid 文件（setsid 分叉后即新会话组长 pid）。
          const launch =
            `cd ${sq(jobDir)} && ` +
            `if command -v setsid >/dev/null 2>&1; then nohup setsid sh run.sh > stdout.log 2> stderr.log < /dev/null & ` +
            `else nohup sh run.sh > stdout.log 2> stderr.log < /dev/null & fi; echo $!`;
          const res = await adapter.run(launch, { timeoutMs: 30000 });
          if (res.code !== 0) throw sshFail(res, `启动作业 ${jobId}`);
          pid = Number(res.stdout.trim().split("\n").pop()) || null;
          job.mode = "direct";
          job.pid = pid;
        }
        job.scriptPath = `${jobDir}/script.sh`;
        job.stdoutLog = `${jobDir}/stdout.log`;
        job.stderrLog = `${jobDir}/stderr.log`;
        job.state = "running";
        job.startedAt = core.nowISO();
        job.lastCheckedAt = core.nowISO();
        jobs.push(job);
```

</details>

**依据 11 · 源码核查**：[engines/remote-compute.mjs:773-783](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L773-L783)

真实fn后才saveJobs。

<details>
<summary>查看原文（11行）</summary>

```text
  const withJobs = async (root, fn) =>
    core.withFileLock(
      jobsPath(root),
      async () => {
        const data = await loadJobs(root);
        const out = await fn(data);
        await saveJobs(root, data);
        return out;
      },
      lockOpts
    );
```

</details>

#### 缺口

- SSH/SLURM与Host实际权限、提交未知/跨项目scratch冲突/全传输安全未测。
  **影响**：不能声称每次强审批、远端不重不丢/项目硬隔离或全局限额。
  **进一步探讨**：只观察；若测试用独立账户/scratch与低敏echo任务，故障后先查远端PID/SLURM再重投。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 状态、取消、拉回和主机UI的失败边界是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

remote_status只轮询submitted/running记录，实际SSH执行状态脚本，失败置unknown；退出码/marker是程序结束信号，非科学结果正确。unknown不在所核下次active过滤中，不能假设再次status就自动修复所有未知。remote_cancel执行scancel或按pid TERM/KILL，却不验证成功后才写killed：即使scancel返回失败文字/no pid仍记录killed，因此记录不能证明进程已停；再次status也可能不再探终态，必须手工核远端。

remote_pull要求job非running，listTop后按条目size阈值挑选，其余留远端，copyDown并写pulled-manifest。output是path.resolve(root,args.output)而未检查包含，可写root外；阈值是顶层entry大小判断，不应承诺递归目录累计硬限制。它不是自动清远端，也不核所有文件内容hash与完整环境。运行中SCP/SSH本地子进程超时kill不等远端后台作业/全部子树停止，取消/删除本地记录不撤远端数据和计算费用。

Host UI另外经webServer prefix POST+必须Origin host匹配，但没有本handler账户认证；Host外围是否保护未独立核。addHost默认真实runProbe，不经过工具的项目allowlist/approval；revoke直接按传入root写allowlist，UI自身writeJson无与engine共用锁/atomic且readJson任何错误当fallback，不能把engine锁推广到UI全部写。当前多人/反代/权限边界及UI字段到shell拼接未全审，不建议公网或共享部署。

#### 证据与依据

**依据 1 · 源码核查**：[engines/remote-compute.mjs:1483-1518](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L1483-L1518)

真实active过滤/SSH探测与unknown。

<details>
<summary>查看原文（36行）</summary>

```text
      const root = await resolveRootStrictOrThrow(args, exec, "继续操作");
      return withJobs(root, async (data) => {
        const jobs = data.jobs;
        let targets = jobs;
        if (args.host) targets = targets.filter((j) => j.host === args.host);
        if (args.job) targets = targets.filter((j) => j.id === args.job);
        const active = targets.filter((j) => ["submitted", "running"].includes(j.state));
        const { hosts } = await loadHosts(config);
        const byHost = new Map();
        for (const j of active) {
          const h = hosts.find((x) => x.id === j.host);
          if (!h) {
            j.state = "unknown";
            j.error = "主机未注册";
            continue;
          }
          if (!byHost.has(j.host)) byHost.set(j.host, { host: h, jobs: [] });
          byHost.get(j.host).jobs.push(j);
        }
        const results = [];
        for (const [, { host, jobs: hj }] of byHost) {
          const adapter = makeAdapter(host);
          const res = await adapter.run(statusScript(hj), { timeoutMs: 60000 });
          if (res.code !== 0) {
            for (const j of hj) {
              j.state = "unknown";
              j.error = `状态探测失败：${res.stderr.trim().split("\n").slice(-2).join(" | ")}`;
            }
            continue;
          }
          const rows = parseStatus(res.stdout);
          for (const j of hj) {
            const row = rows.find((r) => r.jobId === j.id);
            if (row) applyStatusRow(j, row);
            else {
              j.state = "unknown";
```

</details>

**依据 2 · 源码核查**：[engines/remote-compute.mjs:1694-1725](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L1694-L1725)

真实cancel返回失败仍标killed。

<details>
<summary>查看原文（32行）</summary>

```text
    async execute(args, exec) {
      const root = await resolveRootStrictOrThrow(args, exec, "继续操作");
      const jobId = core.requireStr(args, "job");
      return withJobs(root, async (data) => {
        const job = data.jobs.find((j) => j.id === jobId);
        if (!job) throw core.sciErr("ERR_NOT_FOUND", `作业 ${jobId} 不存在。`);
        if (!["submitted", "running"].includes(job.state)) {
          return { jobId, result: `作业已结束（${job.state}），无需取消`, state: job.state };
        }
        const { hosts } = await loadHosts(config);
        const h = findHost(hosts, job.host);
        const adapter = makeAdapter(h);
        let result;
        if (job.mode === "slurm") {
          const res = await adapter.run(`scancel ${sq(job.slurmJobId)} 2>&1; echo "rc=$?"`);
          result = res.stdout.trim().split("\n").slice(-1)[0] === "rc=0" ? "scancel 已发送" : `scancel 失败：${res.stdout.trim()}`;
        } else {
          // 有 setsid 会话时按进程组终止；否则回退 pkill 子树 + kill 主进程
          const res = await adapter.run(
            `pid=$(cat ${sq(`${job.jobDir}/pid`)} 2>/dev/null); ` +
              `if [ -n "$pid" ]; then ` +
              `kill -TERM -- -$pid 2>/dev/null || { pkill -TERM -P $pid 2>/dev/null; kill -TERM $pid 2>/dev/null; }; ` +
              `sleep 2; ` +
              `kill -KILL -- -$pid 2>/dev/null || { pkill -KILL -P $pid 2>/dev/null; kill -KILL $pid 2>/dev/null; }; ` +
              `echo "killed $pid"; else echo "no pid"; fi`
          );
          result = res.stdout.trim();
        }
        job.state = "killed";
        job.finishedAt = core.nowISO();
        job.lastCheckedAt = core.nowISO();
        return { jobId, result, state: "killed" };
```

</details>

**依据 3 · 源码核查**：[engines/remote-compute.mjs:1637-1649](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L1637-L1649)

非running才pull并调真实pull函数。

<details>
<summary>查看原文（13行）</summary>

```text
    async execute(args, exec) {
      const root = await resolveRootStrictOrThrow(args, exec, "继续操作");
      const jobId = core.requireStr(args, "job");
      const data = await loadJobs(root);
      const job = data.jobs.find((j) => j.id === jobId);
      if (!job) throw core.sciErr("ERR_NOT_FOUND", `作业 ${jobId} 不存在。`);
      if (["submitted", "running"].includes(job.state)) {
        throw core.sciErr("ERR_VALIDATION", `作业 ${jobId} 仍在运行（${job.state}），先 remote_status 等它结束再拉取。`);
      }
      const { hosts } = await loadHosts(config);
      const h = findHost(hosts, job.host);
      const adapter = makeAdapter(h);
      const { manifest, outDir } = await pullJobOutputs(h, adapter, job, args, root, cfg);
```

</details>

**依据 4 · 源码核查**：[engines/remote-compute.mjs:671-705](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L671-L705)

真实output解析/阈值/复制/manifest。

<details>
<summary>查看原文（35行）</summary>

```text
async function pullJobOutputs(host, adapter, job, args, root, config) {
  const threshold = args.thresholdBytes ?? config.bigFileThresholdBytes ?? host.bigFileThresholdBytes ?? DEFAULT_BIG_FILE_BYTES;
  const listing = await adapter.listTop(job.jobDir);
  if (!listing.exists) {
    throw core.sciErr("ERR_REMOTE", `远程作业目录不存在：${job.jobDir}（可能被清理）`);
  }
  const outDir = args.output
    ? path.resolve(root, args.output)
    : job.localOutDir || path.join(root, "analyses", "remote", job.id);
  const candidates = listing.entries.filter((e) => !CONTROL_FILES.has(e.name) && e.name !== "inputs");
  const pulled = [];
  const bigFiles = [];
  for (const e of candidates) {
    if (e.size > threshold) bigFiles.push({ name: e.name, size: e.size, kind: e.type });
    else pulled.push(e.name);
  }
  await fsp.mkdir(outDir, { recursive: true });
  if (pulled.length) await adapter.copyDown(job.jobDir, pulled, outDir);
  const manifest = {
    jobId: job.id,
    host: host.id,
    pulledAt: core.nowISO(),
    remoteJobDir: job.jobDir,
    localOutDir: outDir,
    pulled: pulled.map((n) => ({ name: n, size: listing.entries.find((e) => e.name === n)?.size ?? 0 })),
    leftOnHost: bigFiles,
    thresholdBytes: threshold,
    note: "leftOnHost 中的文件因超过阈值留在主机，路径见 remoteJobDir（可用 remote_exec 查看/按需下载）。",
  };
  const mf = path.join(outDir, "pulled-manifest.json");
  await core.writeJsonAtomic(mf, manifest);
  job.localOutDir = outDir;
  job.bigFiles = bigFiles;
  job.pulledAt = core.nowISO();
  return { manifest, outDir };
```

</details>

**依据 5 · 源码核查**：[engines/remote-compute.mjs:226-252](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L226-L252)

本地子进程kill非远端后台停止。

<details>
<summary>查看原文（27行）</summary>

```text
function runCommand(argv, opts = {}) {
  return new Promise((resolve) => {
    const { stdin, timeoutMs, signal } = opts;
    const child = spawn(argv[0], argv.slice(1), { stdio: ["pipe", "pipe", "pipe"] });
    const out = { data: [], len: 0, truncated: false };
    const err = { data: [], len: 0, truncated: false };
    captureStream(child.stdout, out);
    captureStream(child.stderr, err);
    let timedOut = false;
    let aborted = false;
    let settled = false;

    const cleanup = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    };
    const onAbort = () => {
      if (settled) return;
      aborted = true;
      child.kill("SIGKILL");
    };
    const timer = timeoutMs
      ? setTimeout(() => {
          if (settled) return;
          timedOut = true;
          child.kill("SIGKILL");
        }, timeoutMs)
```

</details>

**依据 6 · 源码核查**：[engines/remote-hosts-ui.mjs:268-283](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-hosts-ui.mjs#L268-L283)

真实Web prefix POST/Origin/handler。

<details>
<summary>查看原文（16行）</summary>

```text
  const disposer = webServer.register({
    kind: "prefix",
    path: "/dsh-science/remote-hosts",
    async handler(req, res) {
      if (req.method !== "POST") return send(res, 405, { ok: false, error: "仅支持 POST" });
      if (!sameOrigin(req)) return send(res, 403, { ok: false, error: "非浏览器同源请求被拒绝（缺少/不匹配 Origin）" });
      const name = (req.url || "").replace(/^\/dsh-science\/remote-hosts\/?/, "").split("/")[0];
      if (!name || !METHODS.includes(name)) return send(res, 404, { ok: false, error: `未知方法 ${name}` });
      try {
        const body = await readBody(req);
        const result = await byName[name](body || {});
        send(res, 200, result);
      } catch (e) {
        send(res, 400, fail(e));
      }
    },
```

</details>

**依据 7 · 源码核查**：[engines/remote-hosts-ui.mjs:139-148](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-hosts-ui.mjs#L139-L148)

真实Origin必须存在host匹配，非账户身份。

<details>
<summary>查看原文（10行）</summary>

```text
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return false; // 非浏览器（curl 等）拒绝
  const host = req.headers.host;
  if (!host) return false;
  try {
    const u = new URL(origin);
    return u.host === host;
  } catch (e) {
    return false;
```

</details>

**依据 8 · 源码核查**：[engines/remote-hosts-ui.mjs:164-185](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-hosts-ui.mjs#L164-L185)

UI真实add/probe/save，不走工具审批。

<details>
<summary>查看原文（22行）</summary>

```text
    async addHost(a) {
      const { p, hosts } = await loadHosts();
      const id = String(a.host || "").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
      if (!id) return fail("host id 不能为空");
      if (hosts.some((x) => x.id === id)) return fail(`主机 ${id} 已存在`);
      const t = a.transport === "local" ? "local" : "ssh";
      const e = {
        id, transport: t, alias: t === "local" ? "local" : String(a.alias || id),
        notes: String(a.notes || ""), scratch: String(a.scratch || "~/dsh-scratch"),
        maxConcurrent: Number(a.maxConcurrent) || 100, timeoutMinutes: Number(a.timeoutMinutes) || 30,
        port: a.port ? Number(a.port) : undefined, identityFile: a.identityFile ? String(a.identityFile) : undefined,
        batchMode: a.batchMode !== false, probe: null, probeError: null, probedAt: null,
        addedAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      if (a.probe !== false) {
        const r = await runProbe(e);
        if (r.ok) { e.probe = r.probe; e.probedAt = new Date().toISOString(); }
        else e.probeError = r.error;
      }
      hosts.push(e);
      await saveHosts(p, hosts);
      return { ok: true, host: e };
```

</details>

**依据 9 · 源码核查**：[engines/remote-hosts-ui.mjs:97-114](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-hosts-ui.mjs#L97-L114)

UI真实sh -c探测调用。

<details>
<summary>查看原文（18行）</summary>

```text
function runCommand(argv, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(argv[0], argv.slice(1), { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "", stderr = "";
    child.stdout.on("data", (c) => { stdout += c; });
    child.stderr.on("data", (c) => { stderr += c; });
    const timer = opts.timeoutMs ? setTimeout(() => child.kill("SIGKILL"), opts.timeoutMs) : null;
    child.on("close", (code) => { clearTimeout(timer); resolve({ code, stdout, stderr }); });
  });
}

async function runProbe(host) {
  try {
    const res = await runCommand(["sh", "-c", probeCommand(host)], { timeoutMs: 30000 });
    if (res.code !== 0) return { ok: false, error: `探测失败(exit ${res.code})：${res.stderr.trim().slice(0, 200) || res.stdout.trim().slice(0, 200)}` };
    return { ok: true, probe: parseProbe(res.stdout) };
  } catch (e) {
    return { ok: false, error: String(e && e.message || e).slice(0, 200) };
```

</details>

**依据 10 · 源码核查**：[engines/remote-hosts-ui.mjs:31-51](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-hosts-ui.mjs#L31-L51)

UI读错回fallback/直接writeFile。

<details>
<summary>查看原文（21行）</summary>

```text
async function readJson(abs, fallback) {
  try {
    return JSON.parse(await fsp.readFile(abs, "utf8"));
  } catch (e) {
    return fallback;
  }
}

async function writeJson(abs, obj) {
  await fsp.mkdir(path.dirname(abs), { recursive: true });
  await fsp.writeFile(abs, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

async function loadHosts() {
  const p = hostsFilePath();
  const d = await readJson(p, { hosts: [] });
  return { p, hosts: Array.isArray(d.hosts) ? d.hosts : [] };
}

async function saveHosts(p, hosts) {
  await writeJson(p, { schema: 1, hosts, updatedAt: new Date().toISOString() });
```

</details>

**依据 11 · 源码核查**：[engines/remote-hosts-ui.mjs:240-247](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-hosts-ui.mjs#L240-L247)

UI revoke信root写allowlist。

```text
    async revoke(a) {
      const root = String(a.root || "");
      if (!root) return fail("缺少 root");
      const f = projFile(root, "allowlist");
      const d = await readJson(f, { hosts: [] });
      d.hosts = (d.hosts || []).filter((x) => x.host !== a.host);
      await writeJson(f, d);
      return { ok: true };
```

#### 缺口

- 真实取消/远端清理、目录体积与越界写、Host外围认证/UI注入与并发未测或全审。
  **影响**：killed/拉回清单不是停机/完整交付/安全证明；核心安全依赖未知限制采用。
  **进一步探讨**：独立测试Host核scancel失败/no pid/unknown、输出../及目录阈值、UI认证与并发；不满足停接生产。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前可采用到哪一步，验证什么方向才有意义？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

建议观察；有可追溯计算记录需求的科研开发者，先用无账号/无敏感数据的本地记录/小文件样例比较笔记+git+hash，远程功能需独立低权账户/每项目唯一scratch并显式核Host/工具审批。只用已审脚本和确定输出，实验/假设结论要人审；不因manifest supported或hash一致直接用于科学结论/业务决策。模型分档伴随包/Skills另审，不默认启用不明provider。

首次Host/SSH配置/账户/计算环境/调度器和目录，持续模型/分类/远端CPU-GPU/存储/SCP网络、人工方法/原始数据/结果审阅，失败孤儿job/冲突/unknown/残留修复、退出远端scratch/本地manifest与版本留存费用工时未知，不填0。超时/并发/阈值不是总费硬上限；远端断连存活也是恢复责任。结果未知先停新作业，查PID/SLURM/远端路径与本地清单，回手工SSH/笔记核对后再处置，不盲重投或信killed。

独立假设：在现有manifest/哈希/作业记录上，增加提交接受、真实终止与独立结果验收三份分别可核收据，带项目唯一远端命名和不确定状态恢复责任，可能比继续加科学Skills/状态更减少误判。先与人工SSH/验收清单及小修比较，不造新科学OS；固定远端成功本地写失败、两个项目J01、取消失败、unknown/输出越界和hash一致但结果错误样本，测误判、重复作业/清理人时与总成本。若现有清单足够或维护负担超收益则推翻，不算当前能力。

#### 证据与依据

**依据 1 · 源码核查**：[engines/remote-compute.mjs:1369-1377](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L1369-L1377)

现有项目内ID/配额。

```text
      return withJobs(root, async (data) => {
        const jobs = data.jobs;
        const activeCount = jobs.filter((j) => j.host === hostId && ["submitted", "running"].includes(j.state)).length;
        if (activeCount >= (h.maxConcurrent ?? DEFAULT_MAX_CONCURRENT)) {
          throw core.sciErr("ERR_LIMIT", `主机 ${hostId} 并发作业已达上限 ${h.maxConcurrent}（当前 ${activeCount} 个活动）。等前面的作业结束或调高 maxConcurrent。`);
        }
        const jobId = core.nextSeqId(jobs, "J", 2);
        const jobDir = `${scratch.replace(/\/$/, "")}/${jobId}`;
        const job = newJob(jobId, hostId, title, jobDir);
```

**依据 2 · 源码核查**：[engines/remote-compute.mjs:1433-1439](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L1433-L1439)

远端启动后本地记录。

```text
        job.scriptPath = `${jobDir}/script.sh`;
        job.stdoutLog = `${jobDir}/stdout.log`;
        job.stderrLog = `${jobDir}/stderr.log`;
        job.state = "running";
        job.startedAt = core.nowISO();
        job.lastCheckedAt = core.nowISO();
        jobs.push(job);
```

**依据 3 · 源码核查**：[engines/remote-compute.mjs:1694-1725](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/remote-compute.mjs#L1694-L1725)

记录killed与真实终止需分开。

<details>
<summary>查看原文（32行）</summary>

```text
    async execute(args, exec) {
      const root = await resolveRootStrictOrThrow(args, exec, "继续操作");
      const jobId = core.requireStr(args, "job");
      return withJobs(root, async (data) => {
        const job = data.jobs.find((j) => j.id === jobId);
        if (!job) throw core.sciErr("ERR_NOT_FOUND", `作业 ${jobId} 不存在。`);
        if (!["submitted", "running"].includes(job.state)) {
          return { jobId, result: `作业已结束（${job.state}），无需取消`, state: job.state };
        }
        const { hosts } = await loadHosts(config);
        const h = findHost(hosts, job.host);
        const adapter = makeAdapter(h);
        let result;
        if (job.mode === "slurm") {
          const res = await adapter.run(`scancel ${sq(job.slurmJobId)} 2>&1; echo "rc=$?"`);
          result = res.stdout.trim().split("\n").slice(-1)[0] === "rc=0" ? "scancel 已发送" : `scancel 失败：${res.stdout.trim()}`;
        } else {
          // 有 setsid 会话时按进程组终止；否则回退 pkill 子树 + kill 主进程
          const res = await adapter.run(
            `pid=$(cat ${sq(`${job.jobDir}/pid`)} 2>/dev/null); ` +
              `if [ -n "$pid" ]; then ` +
              `kill -TERM -- -$pid 2>/dev/null || { pkill -TERM -P $pid 2>/dev/null; kill -TERM $pid 2>/dev/null; }; ` +
              `sleep 2; ` +
              `kill -KILL -- -$pid 2>/dev/null || { pkill -KILL -P $pid 2>/dev/null; kill -KILL $pid 2>/dev/null; }; ` +
              `echo "killed $pid"; else echo "no pid"; fi`
          );
          result = res.stdout.trim();
        }
        job.state = "killed";
        job.finishedAt = core.nowISO();
        job.lastCheckedAt = core.nowISO();
        return { jobId, result, state: "killed" };
```

</details>

**依据 4 · 源码核查**：[engines/artifact-registry.mjs:549-581](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/artifact-registry.mjs#L549-L581)

现有reproduce是说明需人工执行验收。

<details>
<summary>查看原文（33行）</summary>

```text
    async execute(args, exec) {
      const root = await core.resolveRoot(args, exec, markers);
      const name = core.requireStr(args, "name");
      const artifactDir = withinRoot(root, path.join("artifacts", core.slugify(name, name)));
      const meta = await core.readJson(path.join(artifactDir, "artifact.json"), null);
      if (!meta) throw core.sciErr("ERR_NOT_FOUND", `工件 ${name} 不存在。`);
      const want = args.version ? Number(args.version) : meta.versions.length;
      const entry = meta.versions.find((v) => v.version === want);
      if (!entry) throw core.sciErr("ERR_NOT_FOUND", `工件 ${name} 没有 v${want}。`);
      const vdir = path.join(artifactDir, `v${entry.version}`);
      const lines = [
        `# 复现工件 ${name} v${entry.version}`,
        "",
        `工件目录：${vdir}`,
        "",
        "## 溯源记录",
        ...(entry.provenance.command ? [`- 命令：\`${entry.provenance.command}\``] : ["- 命令：（未记录）"]),
        ...(entry.provenance.inputs.length ? [`- 输入：${entry.provenance.inputs.join(", ")}`] : []),
        ...((entry.provenance.inputHashes || []).length
          ? [`- 输入哈希：${entry.provenance.inputHashes.map((h) => `${h.path}#${h.sha256.slice(0, 12)}`).join(", ")}`]
          : []),
        ...(entry.provenance.envFile ? [`- 环境文件：\`${entry.provenance.envFile.path}\` sha256=${entry.provenance.envFile.sha256}`] : []),
        `- 环境：${entry.provenance.environment}`,
        ...(entry.provenance.notes ? [`- 备注：${entry.provenance.notes}`] : []),
        "",
        "## 复现步骤",
        "1. 确认输入文件可用并核对输入哈希（见上；缺失时从 data/ 或原始来源恢复）。",
        "2. 重建运行环境（见 envs/ 或 conda-environments 技能；有 envFile 时按其中记录恢复并核对哈希）。",
        "3. 在 analyses/ 中重跑产生该工件的命令/脚本，输出到 experiments/ 对应实验的 results/。",
        "4. 对比新输出与 `artifact_show " + name + "` / `artifact_verify " + name + "` 的文件 SHA-256 是否一致。",
        "",
      ];
      return lines.join("\n");
```

</details>

**依据 5 · 源码核查**：[engines/research-loop.mjs:523-548](https://github.com/biociao/dsh-science/blob/23767ab2f8d7bcf84a0820daa4c6ae79549da000/engines/research-loop.mjs#L523-L548)

结论由输入记录，非独立科学验证。

<details>
<summary>查看原文（26行）</summary>

```text
      return withManifestCfg(root, async (m) => {
        const exp = findExperiment(m, expId); // 先校验实验存在，再写日志（未知实验不产生垃圾目录）
        // 提前校验结论转移是否合法（避免拒绝时留下半截日志）
        if (args.conclusion && exp.hypothesis) {
          const h0 = findHypothesis(m, exp.hypothesis);
          const allowed = HYP_TRANSITIONS[h0.status] ?? [];
          if (!allowed.includes(args.conclusion)) {
            throw core.sciErr(
              "ERR_VALIDATION",
              `假设 ${h0.id} 不允许状态转移 ${h0.status} → ${args.conclusion}（允许：${allowed.join(", ") || "无"}；结论须先经 testing）`
            );
          }
        }
        const logPath = path.join(root, "experiments", expId, "log.md");
        const stamp = core.nowISO();
        await fsp.mkdir(path.dirname(logPath), { recursive: true });
        await fsp.appendFile(logPath, `\n## ${stamp}\n\n${finding}\n`, "utf8");
        const notes = [`${expId}：${finding}`];
        if (args.conclusion) {
          exp.status = "concluded";
          exp.concludedAt = stamp;
          if (exp.hypothesis) {
            const h = findHypothesis(m, exp.hypothesis);
            setHypothesisStatus(h, args.conclusion);
            h.updatedAt = stamp;
            if (!h.experiments.includes(expId)) h.experiments.push(expId);
```

</details>

#### 缺口

- 实际需求/重现质量、误判/维护成本、科研与远端费用未知；三收据净价值未测。
  **影响**：不推荐生产/敏感计算，假设不是已实现可靠性或经济创新。
  **进一步探讨**：同一低敏样本对照人工清单，明确真实停止/结果验收与总成本反证。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
