# Polaris

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[0900568](https://github.com/ZJU-REAL/Polaris/tree/09005681bdbd03d7771c690e5f5431c864a8e707)

<!-- BEGIN META -->
[![GitHub ★ 264](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=264&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZJU-REAL/Polaris)
<!-- END META -->

> **功能**：独立桌面/Python研究工作台，以持久Voyage驱动真实实验执行与模型反思迭代；预算审批是条件开关，运行指标和自验证不等独立科研真值。

> **亮点**：将真实计划/代码执行/指标反思组织成持久步骤、尝试/恢复与条件人介入；主能力按独立操作展开，已有终检/来源机制边界见[Q02](#research-q02)、[Q03](#research-q03)。

> **主要限制**：confirm_budget默认false且当前创建Modal不传，0小时不限时；生成脚本指标入DB不等独立测量，自检/规则/模型判定不等研究结果正确，eval_model可真实下发Key到远端，见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · Polaris真实应用与本轮核心范围是什么？](#detail-section-11)
  - [Q02 · UI到持久任务以及观察—模型决策—再执行是否真实闭合？](#detail-section-12)
  - [Q03 · 远端执行、指标和预算/授权分别有什么条件？](#detail-section-13)
  - [Q04 · 本地/远端依赖、明文模型配置和退出成本是什么？](#detail-section-14)
  - [Q05 · 生产插件方向如何区别现有工作台/恢复/验证，怎样证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有模型和受控实验资源、能核方法的研究者管理长期实验；六阶段全链是作者说明，本轮不全验论文/评审，见[Q01](#research-q01)。

研究者现有脚本/作业平台+模型+实验追踪日志；不把模型/SSH/数据库或三个角色命名当原创科学算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面/本地引擎 | 加载研究UI和Python服务 | 首启依赖/发行物另核，不只TS kernel |
| 创建Experiment/Voyage | 把当前用户项目任务入队持久化 | 输入/凭据/资源条件按所选backend |
| experiment.plan | 模型生成结构化实验计划 | action registry、模型配置/JSON校验，不等方法正确 |
| experiment.setup | 生成文件/写目标/建环境 | 生成代码按目标权限运行，预算Gate非默认 |
| experiment.smoke | 以小规模入口试代码 | 真运行/错误可见，不等正式评测通过 |
| experiment.run | 正式launch/轮询/日志/指标 | Runner/按任务资源；有PID重挂和条件预算，未证全exactly-once |
| experiment.analyze | 用指标/历史/日志反思并改文件再运行 | 受限信号分支，不等独立研究判断 |
| compute_budget Gate | 暂停后待批准再续 | 需显式confirm_budget=true；当前创建UI没传，非逐命令审批 |
| Sextant/终检 | 规则、自检/按声明模型判别及最低产出检查 | 至少主指标/报告已检查，非独立科研真值 |
| 远端模型评测配置 | eval_model时写模型API配置供脚本调用 | 可含已解密Key，需授权目标/文件与退出管理，不是仅本地密文 |

**流程与依赖**

本地引擎/模型与资料，SSH/GPU/容器按所选Runner/任务而异，不当全产品必需；完整四列表见[Q04](#research-q04)。

UI发起→持久计划/步骤→写/跑/取指标→反思/改文件→再执行/停问→人核结果；完整步骤表见[Q01](#research-q01)，实际反馈见[Q02](#research-q02)。

**效果与成本**

首启Python/模型/测试资源，持续修复/数据/算力，失败核已有作业再续，退出分别处理本地与远端/可选Key文件；现金/人工四阶段见[Q04](#research-q04)。

可执行/续作、结果存在、授权/资源三个效果层有源码支持；独立实验真值、总费/净节时未知，效果表见[Q03](#research-q03)。

> **思考**：confirm_budget默认false且当前创建Modal不传，0小时不限时；生成脚本指标入DB不等独立测量，自检/规则/模型判定不等研究结果正确，eval_model可真实下发Key到远端，见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将真实计划/代码执行/指标反思组织成持久步骤、尝试/恢复与条件人介入；主能力按独立操作展开，已有终检/来源机制边界见[Q02](#research-q02)、[Q03](#research-q03)。

保留真Observation→反思→改文件→再run和持久尝试/PID重挂；条件Gate、主指标出现/报告终检与独立科学验证分层，不把模板命令当生成代码沙箱。

<a id="detail-section-5"></a>

### 1.4 主要限制

confirm_budget默认false且当前创建Modal不传，0小时不限时；生成脚本指标入DB不等独立测量，自检/规则/模型判定不等研究结果正确，eval_model可真实下发Key到远端，见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可丢弃合成已知答案任务，借已核API显式confirm_budget与正max_hours，固定允许模型/Runner资源；当前创建Modal未提交确认字段，不把默认GUI当有预算人工门，见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源闭合桌面/Python引擎接线、真实创建/队列/持久状态机与实验反思改文件再run，核SSH/指标/条件预算关键callee。未运行目标/模型/GPU/在线demo，不全审六阶段/所有runner与平台；限已知答案小实验、显式预算/允许资源试用。

- 已检查：作者 README、包清单、源码路径 package.json、src/backend/app/agents/voyage/__init__.py、src/backend/app/agents/voyage/actions.py、src/backend/app/agents/voyage/actions_experiment.py、src/backend/app/agents/voyage/engine.py、src/backend/app/agents/voyage/helm.py、src/backend/app/agents/voyage/navigator.py、src/backend/app/agents/voyage/plan_edit.py、src/backend/app/agents/voyage/runner.py、src/backend/app/agents/voyage/sextant.py、src/backend/app/api/experiments.py、src/backend/app/api/gates.py、src/backend/app/api/router.py、src/backend/app/core/llm/router.py、src/backend/app/core/queue.py、src/backend/app/main.py、src/backend/app/schemas/experiment.py、src/backend/app/services/ai_evidence_context.py、src/backend/app/services/experiments.py、src/backend/app/services/managed_ssh.py、src/backend/app/services/runners/registry.py、src/backend/app/services/ssh_exec.py、src/backend/pyproject.toml、src/backend/worker/tasks.py、src/desktop/package.json、src/desktop/src/main/engine-bootstrap.ts、src/desktop/src/main/index.ts、src/desktop/src/main/kernel.ts、src/desktop/src/main/window.ts、src/frontend/src/features/experiment/NewExperimentModal.tsx、src/kernel/src/plugins/legacy-engine.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：工程统计按表列MD/TS/TSX/JS及变体，未计核心Python；含vendor/测试/示例候选，非原创/工时，不手补PY数。固定摘要/身份已核，无正式identity旧稿。只读桌面/本地引擎、实验创建/queue/registry/DB loop、Sextant代表、SSH/容器选择与指标/预算/远端Key写路径；未执行目标/脚本/测试/模型或外部动作，未全审所有provider、领域runner、安全/退出、文献/写文/评审。
- 下一步：受控任务独立真值比当前脚本/Polaris/固定评测器，注入常量/旧run/错split/失败有数字/重挂；同时看误通过、费用/重复作业、工时与维护，见[Q05](#research-q05)。

**分析版本**

- **仓库**：[ZJU-REAL/Polaris](https://github.com/ZJU-REAL/Polaris)
- **版本号**：0.1.0（桌面与Python后端声明；根私有工作区0.0.0）（[固定提交 0900568](https://github.com/ZJU-REAL/Polaris/tree/09005681bdbd03d7771c690e5f5431c864a8e707)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

超出现有重挂/指标终检与文献manifest，验证Python-ML候选代码和固定独立评测器/数据划分的结果来源边界；反例/成本/停止条件见[Q05](#research-q05)。

受控任务独立真值比当前脚本/Polaris/固定评测器，注入常量/旧run/错split/失败有数字/重挂；同时看误通过、费用/重复作业、工时与维护，见[Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

本表按所列MD/TS/TSX/JS及变体统计，未计核心Python；包含vendor/测试/示例候选，不等原创量或实现工时。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 47 | 8795 | — | — | 88970 |
| .js | source | 11 | 949 | 857 | 5 | — |
| .ts | source | 116 | 20898 | 15233 | 3869 | — |
| .ts | test | 71 | 6410 | 5213 | 555 | — |
| .js | test | 8 | 311 | 276 | 22 | — |
| .mjs | source | 3 | 441 | 336 | 66 | — |
| .md | example | 1 | 10 | — | — | 136 |
| .tsx | source | 186 | 59564 | 53316 | 3724 | — |
| .tsx | test | 11 | 899 | 766 | 41 | — |
| .mts | source | 1 | 175 | 153 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/ZJU-REAL/Polaris/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=15&color=737b86&logo=github)](https://github.com/ZJU-REAL/Polaris/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=12&color=737b86&logo=github)](https://github.com/ZJU-REAL/Polaris/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定源限定实验Voyage代表链，判断真实Agent反馈、采用成本与独立评测方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Polaris真实应用与本轮核心范围是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

Polaris是Electron桌面、Python本地研究引擎、Web UI及插件/集成组成的研究工作台，根对象归client，不是根DSH插件，也不是只看TypeScript kernel就能代表的科研Agent。desktop和backend各声明0.1.0，root私有工作区0.0.0，不当已发布应用/远端统一版本。README六阶段“文献到审稿论文”为作者产品说明，本轮只选实验Voyage的直接活动链、重要失败和采用边界；不把未展开的全套论文/引用/协作等功能计成本轮已验成果。

正常桌面main先createWindow再后台startKernel，窗口通过app协议加载页面。kernel bootstrapEngine准备Python环境；backend argv启动app.main FastAPI，legacy-engine插件真实spawn。桌面main包指dist/main.cjs且esbuild实际对应src/main/index.ts，源码构建接线不等发行物已验证。Python依赖/数据库/队列与模型/远端Runner形成采用条件，非只有一份Skill。面向有模型/实验资源且能核研究方法的研究者，可把手串实验代码、日志、指标和反思组织成长期任务；真实需求/节时和科研结论质量未独立验证。

| 步骤 | 执行者与动作 | 判据/失败 |
|---|---|---|
| 应用 | Electron加载前端并启动本地Python引擎 | 引导/健康不是科研任务完成 |
| 发起 | UI带参数创建experiment，API按user/project校验并入队Voyage | 参数/凭据/资源不可用明确拒绝 |
| 计划 | Navigator选实验步骤，动作LLM生成计划/文件 | 外骨架部分固定模板，不因三角色名当三个独立模型 |
| 执行/迭代 | Runner写文件/运行/取指标，模型反思改文件再run | 真实受限action闭环，预算/审批条件见Q03 |
| 交接 | DB/checkpoint/日志/报告供人检查 | 至少主指标/报告等终检不等科学发现已证 |

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-12](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/package.json#L1-L12)

根私有工作区0.0.0。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "polaris",
  "private": true,
  "version": "0.0.0",
  "packageManager": "pnpm@10.34.5",
  "scripts": {
    "lint": "pnpm run vendor:types && pnpm -r --if-present run lint",
    "build": "pnpm -r --if-present run build",
    "test": "pnpm -r --if-present run test",
    "vendor:types": "tsc -b vendor/deepseek-cordis/cordis vendor/deepseek-cordis/cosmokit vendor/deepseek-cordis/schemastery vendor/deepseek-cordis/loader vendor/deepseek-cordis/include vendor/deepseek-cordis/group vendor/deepseek-cordis/timer vendor/deepseek-cordis/logger-console"
  },
  "devDependencies": {
```

</details>

**依据 2 · 源码核查**：[src/backend/pyproject.toml:5-20](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/pyproject.toml#L5-L20)

Python backend0.1.0与3.12/核心依赖。

<details>
<summary>查看原文（16行）</summary>

```text
[project]
name = "polaris-backend"
version = "0.1.0"
description = "Polaris 自动 AI 科研平台 — local engine (FastAPI, single process)"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115",
    "uvicorn[standard]>=0.30",
    "sqlalchemy[asyncio]>=2.0.40",
    "alembic>=1.14",
    "fastapi-users[sqlalchemy]>=14.0",
    "redis>=5",
    "pydantic>=2.11",
    "pydantic-settings>=2.6",
    "httpx>=0.27",
    "asyncssh>=2.18",
```

</details>

**依据 3 · 源码核查**：[src/desktop/package.json:1-16](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/desktop/package.json#L1-L16)

桌面0.1.0/真实main和esbuild入口。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "polaris-desktop",
  "private": true,
  "version": "0.1.0",
  "description": "Polaris desktop shell (Electron)",
  "homepage": "https://github.com/ZJU-REAL/Polaris",
  "author": "Polaris contributors <polaris@users.noreply.github.com>",
  "main": "dist/main.cjs",
  "scripts": {
    "build:main": "esbuild src/main/index.ts --bundle --platform=node --target=node24 --format=cjs --outfile=dist/main.cjs --external:electron --external:node-addon-require-builtin --define:import.meta.url=__polarisImportMetaUrl --banner:js=\"const __polarisImportMetaUrl = require('node:url').pathToFileURL(__filename).href;\"",
    "build:preload": "esbuild src/preload/index.ts --bundle --platform=node --target=node24 --format=cjs --outfile=dist/preload.cjs --external:electron",
    "build:bootstrap-smoke": "esbuild src/bootstrap-smoke.ts --bundle --platform=node --target=node22 --format=cjs --outfile=dist/bootstrap-smoke.cjs",
    "build:smoke": "esbuild src/smoke.ts --bundle --platform=node --target=node24 --format=cjs --outfile=dist/smoke.cjs --external:electron --external:node-addon-require-builtin --define:import.meta.url=__polarisImportMetaUrl --banner:js=\"const __polarisImportMetaUrl = require('node:url').pathToFileURL(__filename).href;\"",
    "build": "pnpm run build:main && pnpm run build:preload && pnpm run build:bootstrap-smoke",
    "smoke": "pnpm run build:preload && pnpm run build:smoke && electron dist/smoke.cjs",
    "dev": "pnpm run build && electron .",
```

</details>

**依据 4 · 源码核查**：[src/desktop/src/main/index.ts:41-57](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/desktop/src/main/index.ts#L41-L57)

真正先窗口/后kernel启动。

<details>
<summary>查看原文（17行）</summary>

```text
  void app.whenReady().then(() => {
    app.setAsDefaultProtocolClient(DEEP_LINK_SCHEME);
    handleAppProtocol();
    installIpc();
    installMenu();
    // 窗口先起、内核后台启动（#721）：打包态首启的内嵌引擎引导要下载
    // Python 工具链、装依赖，可能长达数分钟——以前 await startKernel 在
    // createWindow 之前，用户这几分钟连窗口都看不到，像没装上一样。
    // 现在渲染层经 kernel.engineBootstrapStatus 轮询进度并显示首启等待页；
    // 期间 kernel.status/localBackend 读到「还没启动」是真实状态而不是假象，
    // 等待页正是为消化这个窗口期而存在。
    createWindow();
    void startKernel().catch((err) => console.error('[kernel] start failed:', err));

    app.on('activate', () => {
      if (!getWindow()) createWindow();
    });
```

</details>

**依据 5 · 源码核查**：[src/desktop/src/main/window.ts:148-161](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/desktop/src/main/window.ts#L148-L161)

实际app页面加载。

<details>
<summary>查看原文（14行）</summary>

```text
  win.webContents.on('did-fail-load', (_e, code, desc, url, isMainFrame) => {
    if (!isMainFrame || !stagedRendererDir()) return;
    console.error(`[polaris] 界面加载失败（${code} ${desc} ${url}），回滚到内置版本`);
    clearStagedRenderer();
    void win.loadURL(APP_INDEX);
  });

  win.on('close', () => persistBounds(win));
  win.on('closed', () => {
    if (current === win) current = null;
  });

  void win.loadURL(APP_INDEX);
  return win;
```

</details>

**依据 6 · 源码核查**：[src/desktop/src/main/kernel.ts:139-157](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/desktop/src/main/kernel.ts#L139-L157)

kernel调用Python bootstrap。

<details>
<summary>查看原文（19行）</summary>

```text
 */
async function bootstrapPackagedEngine(): Promise<LegacyEngineConfig | null> {
  const dataDir = app.getPath('userData');
  bootstrapTracker = new BootstrapProgressTracker({ engineDir: join(dataDir, 'engine') });
  try {
    const config = await bootstrapEngine({
      resourcesDir: process.resourcesPath,
      dataDir,
      onProgress: ({ phase, line }) => {
        setBootstrapStatus(phase, false);
        // 首启会下载 Python 工具链，日志与首启等待页是仅有的可观测面
        if (line) {
          console.log(`[engine-bootstrap] ${line}`);
          bootstrapTracker?.line(line);
        }
      },
    });
    // 环境装好 ≠ 可用：引擎进程还要跑迁移并通过健康检查（下方 entry.update
    // 才等它），done 必须等引擎真的健康——否则首启等待页会提前放行，
```

</details>

**依据 7 · 源码核查**：[src/desktop/src/main/engine-bootstrap.ts:200-232](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/desktop/src/main/engine-bootstrap.ts#L200-L232)

真实Python/uvicorn app.main启动argv。

<details>
<summary>查看原文（33行）</summary>

```text
 * 引擎启动 argv：与 legacy-engine docker 模式的 `sh -lc "alembic && uvicorn"`
 * 同构，但 command 模式没有 shell，所以用 python -c 的小启动器串联两步。
 * 启动器同时负责 cwd、数据库地址与用户数据目录：
 * - chdir 到后端源码目录——alembic.ini 的 script_location/prepend_sys_path
 *   都是相对 cwd 的相对路径；
 * - POLARIS_DATABASE_URL 指到 userData 的 SQLite 文件（数据库路径是引导方
 *   才知道的信息，所以写在启动器里）；
 * - POLARIS_DATA_DIR 指到 userData 的 engine/data/（#718）：后端 data_dir
 *   默认相对 './data'，chdir 之后会落进 App 安装包的 resources/backend/，
 *   应用更新整包替换时用户的 PDF/导出/实验日志就全没了。setdefault 而非
 *   覆写：给高级用户留 env 改道的口子。
 */
function buildEngineCommand(venvPython: string, backendDir: string, engineDir: string): string[] {
  const dbPath = join(engineDir, 'polaris.db').split('\\').join('/');
  const snapshotRoot = join(engineDir, 'snapshots').split('\\').join('/');
  const dataDir = join(engineDir, 'data').split('\\').join('/');
  const legacyDataDir = join(backendDir, 'data').split('\\').join('/');
  // JSON.stringify 产出的字符串字面量对 Python 同样合法（转义子集兼容），
  // 借它安全嵌入含空格/反斜杠/非 ASCII 的路径
  const launcher = [
    'import os, subprocess, sys',
    // 传给 alembic 子进程（子解释器启动时读 env；本进程靠 -X utf8）
    "os.environ.setdefault('PYTHONUTF8', '1')",
    `os.environ['POLARIS_DATABASE_URL'] = ${JSON.stringify(`sqlite+aiosqlite:///${dbPath}`)}`,
    // 用户数据目录钉在 userData 下（#718，理由见本函数 docstring）
    `os.environ.setdefault('POLARIS_DATA_DIR', ${JSON.stringify(dataDir)})`,
    `os.chdir(${JSON.stringify(backendDir)})`,
    ...buildDataDirMigration(legacyDataDir),
    ...buildMigrationGuard(dbPath, snapshotRoot, "[sys.executable, '-m', 'alembic', 'upgrade', 'head']"),
    'import uvicorn',
    `uvicorn.run('app.main:app', host='127.0.0.1', port=${ENGINE_PORT})`,
  ].join('\n');
  // -X utf8：启动器自身的解释器也走 UTF-8 模式（env 对已启动的进程无效）
```

</details>

**依据 8 · 源码核查**：[src/kernel/src/plugins/legacy-engine.ts:418-433](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/kernel/src/plugins/legacy-engine.ts#L418-L433)

真正spawn，不只声明command。

<details>
<summary>查看原文（16行）</summary>

```text

    let child!: ChildProcess
    // spawn 放进 effect：fiber 被 dispose（kernel.stop / 插件卸载 / 启动失败）
    // 时 disposer 必然执行，子进程不会变孤儿。
    ctx.effect(() => {
      const argv = buildEngineArgv(config, port)
      child = spawn(argv[0]!, argv.slice(1), {
        stdio: ['ignore', 'pipe', 'pipe'],
        // fake LLM 回退是严格显式 opt-in（#717）：只随宿主 env 自然继承，插件不代设。
        env: { ...process.env, ...engineEnv },
      })
      child.stdout!.on('data', capture)
      child.stderr!.on('data', capture)
      if (config.pidFile && child.pid !== undefined) {
        const record: PidRecord = { pid: child.pid, instanceId }
        if (config.mode === 'docker') record.containerName = config.containerName ?? ENGINE_CONTAINER
```

</details>

**依据 9 · 源码核查**：[src/backend/app/main.py:126-134](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/main.py#L126-L134)

本地FastAPI挂实际api/router。

```text
        # 未配置大模型：统一 503，前端提示到设置页配置，而不是 500 堆栈
        return JSONResponse(status_code=503, content={"detail": "LLM_NOT_CONFIGURED"})

    # 只读账号（游客）的写入闸门已随治理机制移除（#614）：单机档位登录即主人。
    app.include_router(api_router, prefix="/api")
    # WS 不挂 /api 前缀：nginx 按 /ws 反代（Upgrade），见 docs/architecture.md §7
    app.include_router(ws_router)
    # MCP 工具服务：默认只读；受 scope 保护的 Profile 可显式开放写工具。
    app.include_router(mcp_router)
```

#### 缺口

- 未构建启动发行物/在线demo、六阶段完整产出或真实研究者对照。
  **影响**：不能把README全链、UI健康或大仓行数当自主科研成功、成品兼容和原创算法价值。
  **进一步探讨**：固定版本/独立数据目录，在可丢弃合成任务闭合一个实验，再对照研究者现有脚本+日志/作业平台的总投入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · UI到持久任务以及观察—模型决策—再执行是否真实闭合？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

NewExperimentModal实际api.createExperiment并在响应后导航实验页；正常创建字段未传confirm_budget，时间空值传0。已注册API带current_active_user，查该user的project，服务创建Experiment/Voyage，queue.enqueue(run_voyage)到worker调用VoyageEngine.run；get_task_queue默认进程级InlineTaskQueue，_start实际从worker.tasks取函数、带ctx并asyncio.create_task执行，不把历史ARQ接口当必须外部worker。Voyage包导入actions_experiment完成decorator注册，Helm按registry.get_action真实执行，异常回observation而非只生成任务图。

引擎从DB取run、恢复/计划并建步骤行，按首个未passed节点推进；ActionContext携checkpoint，Helm执行结果落step.observation，checkpoint/尝试/usage落库，再交Sextant判verdict。Sextant先看error，部分action self_check直接采信；有结构化checks时组合确定性与按声明LLM判别，legacy确定性action可执行即过、无acceptance且有content也可默认过，故不是所有“自验证”都独立审查。引擎还会跑Voyage级done_criteria，不应等同没校验。

实验反思确把run.primary_value、各指标末值、历史/日志带入_complete_json；后者走ctx.llm.complete→router.provider.complete并解析/验证JSON，debug/improve分支再生成文件、executor.write_files、依赖变化可重装，然后产plan_signal=continue。引擎消费signal，用确定性分支表追加下一轮run+analyze；因此是有实际工具/文件/远端观测反馈的受限Agent闭环，不仅固定阶段编排；但模板初始结构与规则分支存在，不把它说成无边界自由科研智能体或全程自动成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/frontend/src/features/experiment/NewExperimentModal.tsx:144-174](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/frontend/src/features/experiment/NewExperimentModal.tsx#L144-L174)

真实创建/参数/导航消费。

<details>
<summary>查看原文（31行）</summary>

```text
      const hours = Number(maxHours);
      const runs = Number(maxRuns);
      const intake = questions
        .map((q, i) => ({ question: q.question, answer: (answers[i] ?? '').trim() }))
        .filter((qa) => qa.answer !== '');
      return api.createExperiment(pid, {
        idea_id: ideaId,
        // 不需要凭据的后端这里是空串，而后端的 credential_id 是 UUID|None——
        // 发空串会 422。不选就整个不发这个键
        ...(credentialId ? { credential_id: credentialId } : {}),
        params: {
          ...(intake.length > 0 ? { intake } : {}),
          // 不选就不带键：缺省后端 / 原计划路径，与这个选择器出现之前完全一致
          ...(backend ? { backend } : {}),
          ...(processPack ? { process_pack: processPack } : {}),
          budget: {
            // 留空 = 无限时（后端 0 = 不设时限）
            max_hours: Number.isFinite(hours) && hours > 0 ? hours : 0,
            ...(Number.isFinite(runs) && runs > 0 ? { max_runs: runs } : {}),
            no_improve_stop: 2,
          },
        },
      });
    },
    onSuccess: (exp) => {
      toast(tr('实验已创建', 'Experiment created'), 'ok');
      void queryClient.invalidateQueries({ queryKey: ['experiments', pid] });
      void queryClient.invalidateQueries({ queryKey: ['voyages'] });
      onClose();
      navigate(`/experiment/${exp.id}`);
    },
```

</details>

**依据 2 · 源码核查**：[src/backend/app/api/router.py:90-94](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/api/router.py#L90-L94)

experiment路由实际挂载。

```text
api_router.include_router(tts.router)
api_router.include_router(evidence.router)
api_router.include_router(experiments.router)
api_router.include_router(manuscripts.router)
api_router.include_router(export.router)
```

**依据 3 · 源码核查**：[src/backend/app/api/experiments.py:150-181](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/api/experiments.py#L150-L181)

实际认证/项目/服务/queue caller。

<details>
<summary>查看原文（32行）</summary>

```text
@router.post(
    "/projects/{project_id}/experiments",
    response_model=ExperimentRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_experiment(
    project_id: uuid.UUID,
    data: ExperimentCreate,
    session: AsyncSession = Depends(get_session),
    user: User = Depends(current_active_user),
    queue: TaskQueue = Depends(get_task_queue),
) -> ExperimentRead:
    project = await projects_service.get_project(session, project_id=project_id, user_id=user.id)
    if project is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="PROJECT_NOT_FOUND")
    try:
        experiment, voyage, idea_title = await experiments_service.create_experiment(
            session, project=project, data=data, user_id=user.id
        )
    except experiments_service.IdeaNotFoundError as e:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="IDEA_NOT_FOUND") from e
    except experiments_service.IdeaNotPromotedError as e:
        raise HTTPException(status.HTTP_409_CONFLICT, detail="IDEA_NOT_PROMOTED") from e
    except experiments_service.CredentialNotFoundError as e:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="CREDENTIAL_NOT_FOUND") from e
    except experiments_service.RunnerHostNotFoundError as e:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="RESOURCE_NOT_FOUND") from e
    except experiments_service.RunnerHostUnavailableError as e:
        # 凭据被吊销/资源没绑凭据：请求本身合法但资源当前用不了 → 409
        raise HTTPException(status.HTTP_409_CONFLICT, detail="RESOURCE_UNAVAILABLE") from e
    await queue.enqueue("run_voyage", str(voyage.id))
    return experiments_service.to_read(experiment, idea_title)
```

</details>

**依据 4 · 源码核查**：[src/backend/app/core/queue.py:133-146](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/core/queue.py#L133-L146)

正常内联队列真实取worker函数并执行。

<details>
<summary>查看原文（14行）</summary>

```text
    def _start(self, job_id: str, func: str, args: tuple[Any, ...], kwargs: dict[str, Any]) -> None:
        from worker import tasks as worker_tasks  # 懒导入避免 app↔worker 环

        fn = getattr(worker_tasks, func)
        ctx = {"redis": _InlineArqRedis(self)}
        slots = self._voyage_slots if func in VOYAGE_FUNCTIONS else self._job_slots

        async def _run() -> Any:
            async with slots:
                return await fn(ctx, *args, **kwargs)

        task = asyncio.create_task(_run(), name=f"inline:{func}")
        self._tasks[job_id] = task
        task.add_done_callback(lambda t, jid=job_id: self._finish(jid, t))
```

</details>

**依据 5 · 源码核查**：[src/backend/app/core/queue.py:201-207](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/core/queue.py#L201-L207)

正常FastAPI依赖返回InlineTaskQueue单例。

```text
async def get_task_queue() -> TaskQueue:
    """FastAPI 依赖；测试覆盖为 stub（进程级单例）。"""
    global _queue
    if _queue is None:
        _queue = InlineTaskQueue()
    return _queue

```

**依据 6 · 源码核查**：[src/backend/worker/tasks.py:58-69](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/worker/tasks.py#L58-L69)

worker真正驱动Engine run/resume。

<details>
<summary>查看原文（12行）</summary>

```text
def _make_engine() -> VoyageEngine:
    return VoyageEngine(event_bus=EventBus(get_redis()))


async def run_voyage(ctx: dict[str, Any], run_id: str) -> None:
    """驱动一次新航程（POST /voyages 入队）。"""
    await _make_engine().run(uuid.UUID(run_id))


async def resume_voyage(ctx: dict[str, Any], run_id: str) -> None:
    """闸门批准后从断点恢复航程（gates approve 入队）。"""
    await _make_engine().resume(uuid.UUID(run_id))
```

</details>

**依据 7 · 源码核查**：[src/backend/app/agents/voyage/__init__.py:7-19](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/__init__.py#L7-L19)

实验actions实际导入注册。

<details>
<summary>查看原文（13行）</summary>

```text
from app.agents.voyage import (
    actions_daily,  # noqa: F401  注册 daily.*（每日新论文抓取）动作
    actions_discovery,  # noqa: F401  注册 hypothesis.* / discovery.summarize 树搜索动作
    actions_experiment,  # noqa: F401  注册 experiment.* 动作
    actions_ideas,  # noqa: F401  注册 forge.* / review.pair 等辩论动作
    actions_present,  # noqa: F401  注册 present.*（论文分享 PPT）动作
    actions_proposal,  # noqa: F401  注册 goal.* / proposal.* 深耕动作
    actions_review,  # noqa: F401  注册 review.citation_check 等论文评审动作
    actions_wiki,  # noqa: F401  注册 wiki.* 动作
    actions_writing,  # noqa: F401  注册 writing.* 动作
)
from app.agents.voyage.engine import VoyageEngine

```

</details>

**依据 8 · 源码核查**：[src/backend/app/agents/voyage/actions.py:70-79](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions.py#L70-L79)

register/get_action实实现。

<details>
<summary>查看原文（10行）</summary>

```text
def register(name: str) -> Callable[[ActionFunc], ActionFunc]:
    def decorator(func: ActionFunc) -> ActionFunc:
        _REGISTRY[name] = func
        return func

    return decorator


def get_action(name: str) -> ActionFunc | None:
    return _REGISTRY.get(name)
```

</details>

**依据 9 · 源码核查**：[src/backend/app/agents/voyage/helm.py:13-23](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/helm.py#L13-L23)

Helm真正执行registry动作并返回观察/失败。

<details>
<summary>查看原文（11行）</summary>

```text
class Helm:
    async def execute(self, ctx: ActionContext, step_def: dict[str, Any]) -> dict[str, Any]:
        action_name = str(step_def.get("action", ""))
        action = get_action(action_name)
        if action is None:
            return {"error": f"unknown action: {action_name}"}
        try:
            return await action(ctx, step_def.get("params") or {})
        except Exception as e:  # noqa: BLE001 —— 步骤失败要落 observation 而非炸掉状态机
            report = failure_from_exception(e)
            return {"error": error_text(e), "failure": report.to_dict()}
```

</details>

**依据 10 · 源码核查**：[src/backend/app/agents/voyage/engine.py:597-618](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/engine.py#L597-L618)

DB恢复/计划/进入loop。

<details>
<summary>查看原文（22行）</summary>

```text
    async def _drive(self, run_id: uuid.UUID) -> None:
        async with self._sessionmaker() as session:
            run = await session.get(VoyageRun, run_id)
            if run is None or run.status in TERMINAL_STATUSES:
                return
            try:
                # mode 由 kind 静态决定（docs/task-system.md §7）；首次驱动时对齐，
                # 顺带覆盖迁移前创建的存量 run
                expected_mode = mode_for_kind(run.kind)
                if run.mode != expected_mode:
                    run.mode = expected_mode
                    await session.commit()
                await self._ensure_guidance_snapshot(session, run)
                # 已回答的提问先变成行为（可能重置计划 / 扩展计划 / 直接收束）
                if not await self._consume_answered_asks(session, run):
                    return
                if run.plan is None:
                    await self._plan(session, run)
                await self._ensure_step_rows(session, run)
                if run.status == "planning":
                    await self._set_status(session, run, "executing")
                await self._loop(session, run)
```

</details>

**依据 11 · 源码核查**：[src/backend/app/agents/voyage/engine.py:803-824](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/engine.py#L803-L824)

真实gate/execute/verify/signal/失败调度。

<details>
<summary>查看原文（22行）</summary>

```text
            # 复位失败节点（直接 run() 再驱动而未经 resume 复位时）
            if node.status == "failed":
                if not await self._handle_failure(session, run, node, node_index, step_def):
                    return
                continue

            # 人在环闸门
            if step_def.get("requires_gate") and not await self._gate_cleared(
                session, run, node, node_index, step_def
            ):
                return

            if not await self._execute_and_verify(session, run, step_def, node):
                return  # 动作主动向用户提问，任务已暂停

            if node.verdict and node.verdict.get("passed"):
                # 节点可携带 plan_signal（如 experiment.analyze 的继续/收束判定）：
                # 走 kind 确定性分支表做计划编辑，不经 LLM（docs/task-system.md §7）
                await self._apply_signal_edits(session, run, node)
                await self._set_status(session, run, "executing")
                continue
            if not await self._handle_failure(session, run, node, node_index, step_def):
```

</details>

**依据 12 · 源码核查**：[src/backend/app/agents/voyage/engine.py:972-986](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/engine.py#L972-L986)

ActionContext→真实execute→observation/checkpoint落库。

<details>
<summary>查看原文（15行）</summary>

```text
        ctx = ActionContext(
            run=run,
            llm=self._llm,
            checkpoint=checkpoint,
            bus=self._bus,
            step_id=step_row.id,
        )
        observation = await self.helm.execute(ctx, step_def)
        run.checkpoint = dict(ctx.checkpoint)
        snapshot = ctx.checkpoint.get("ai_evidence")
        manifest = snapshot.get("manifest") if isinstance(snapshot, dict) else []
        step_row.observation = attach_observation_evidence(observation, manifest or [])
        step_row.finished_at = utcnow()
        action_usage = observation.get("usage") if isinstance(observation, dict) else None
        await session.commit()
```

</details>

**依据 13 · 源码核查**：[src/backend/app/agents/voyage/engine.py:1011-1031](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/engine.py#L1011-L1031)

verdict/尝试/usage实际记录。

<details>
<summary>查看原文（21行）</summary>

```text
        await self._set_status(session, run, "verifying")
        verdict, verify_usage = await self.sextant.verify(run, step_def, observation)
        step_row.verdict = verdict
        step_row.status = "passed" if verdict.get("passed") else "failed"
        passed = bool(verdict.get("passed"))
        reason = str(verdict.get("reason") or "")
        await self._emit_log(
            run,
            f"{'✓ 通过' if passed else '✗ 未通过'}：{step_row.title}"
            + (f" — {reason}" if reason else ""),
            level="success" if passed else "error",
            step_id=step_row.id,
        )
        step_row.tokens = self._sum_usage(action_usage or {}, verify_usage)
        self._archive_attempt(step_row)
        self._accumulate_usage(run, step_row.tokens)
        # observation 未携带 usage 的动作（如 wiki 批处理）绕过了上面的累计，
        # 以 LLMUsage 明细（router 记账，含 voyage_id）为准刷新 run.usage
        await self._refresh_usage_from_ledger(session, run)
        await session.commit()
        await self._emit_step(run, step_row)
```

</details>

**依据 14 · 源码核查**：[src/backend/app/agents/voyage/sextant.py:46-94](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/sextant.py#L46-L94)

error/self_check/checks/legacy判定层级。

<details>
<summary>查看原文（49行）</summary>

```text
    async def verify(
        self, run: VoyageRun, step_def: dict[str, Any], observation: dict[str, Any]
    ) -> tuple[dict[str, Any], dict[str, int]]:
        """返回 (verdict {passed, reason}, 本次验证消耗的 usage)。"""
        if observation.get("error"):
            return {"passed": False, "reason": str(observation["error"])}, {}

        # 动作自带机械验收结论（goal./proposal. 系动作，docs/task-system.md §7）：直接采信
        self_check = observation.get("self_check")
        if isinstance(self_check, dict) and isinstance(self_check.get("passed"), bool):
            return {
                "passed": self_check["passed"],
                "reason": str(self_check.get("reason", "")),
            }, {}

        # ---- 结构化验收（docs/task-system.md §7（原 voyage-loop.md §6））----
        checks = step_def.get("checks")
        if isinstance(checks, list) and checks:
            verdict, rubrics = run_deterministic_checks(
                checks, observation=observation, checkpoint=run.checkpoint
            )
            if verdict is not None:
                return verdict, {}
            usage_total = {"prompt_tokens": 0, "completion_tokens": 0}
            for rubric in rubrics:
                verdict, usage = await self._judge(
                    run, step_def, observation, str(rubric.get("rubric") or "")
                )
                usage_total["prompt_tokens"] += usage.get("prompt_tokens", 0)
                usage_total["completion_tokens"] += usage.get("completion_tokens", 0)
                if not verdict["passed"]:
                    return verdict, usage_total
            return {"passed": True, "reason": "全部检查通过（含 LLM 判定）"}, usage_total

        # ---- 遗留路径（无 checks 声明的步骤）----
        action = str(step_def.get("action", ""))
        acceptance = step_def.get("acceptance")

        if action in DETERMINISTIC_ACTIONS:
            return {"passed": True, "reason": f"确定性步骤 {action} 执行成功"}, {}

        content = observation.get("content")
        if not content:
            return {"passed": False, "reason": "步骤无产出（observation.content 为空）"}, {}

        if not acceptance:
            return {"passed": True, "reason": "未声明验收标准，且步骤有产出，默认通过"}, {}

        return await self._judge(run, step_def, observation, str(acceptance))
```

</details>

**依据 15 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:2927-2942](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L2927-L2942)

真实指标/日志入模型反思。

<details>
<summary>查看原文（16行）</summary>

```text
            f"本轮运行：seq={run.seq} status={run.status} exit_code={run.exit_code} "
            f"primary_value={run.primary_value}\n"
            f"本轮各指标末值：{json.dumps(run_lasts, ensure_ascii=False)[:1500]}\n"
            f"{cond_line}"
            f"历史各轮：{json.dumps(history, ensure_ascii=False)}\n"
            f"迭代状态：无提升连续 {state['no_improve_streak']} 轮，"
            f"debug 已修 {state['debug_count']} 次\n"
            f"本轮日志尾部：\n" + "\n".join(log_lines)
        )
        reflection = await _complete_json(
            ctx,
            system=REFLECTION_SYSTEM_PROMPT,
            user=reflection_user,
            validate=validate_reflection,
        )
        run.reflection = reflection
```

</details>

**依据 16 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:918-940](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L918-L940)

实际llm请求与JSON验证/错误反馈。

<details>
<summary>查看原文（23行）</summary>

```text
                f"上一次输出没通过校验（第 {attempt} 次尝试）：{last_error}{hint}\n"
                "请针对这个错误修正后重新输出完整 JSON，不要重复同样的问题。"
            )
        result = await ctx.llm.complete(
            "experiment",
            [Message(role="system", content=system), Message(role="user", content=prompt)],
            user_id=ctx.run.created_by,
            project_id=ctx.run.project_id,
            voyage_id=ctx.run.id,
            max_tokens=max_tokens,
        )
        if getattr(result, "finish_reason", None) == "max_tokens":
            max_tokens = 16384 if max_tokens else 8192
            last_error = ValueError(
                "输出超长被截断（max_tokens）。请压缩输出：省略非必要注释与空行，"
                "避免重复内容，只保留任务要求的字段与文件"
            )
            continue
        try:
            return validate(_extract_json(result.content))
        except (ValueError, TypeError, KeyError, json.JSONDecodeError) as e:
            last_error = e
    raise ValueError(f"LLM 连续输出非法 JSON：{last_error}")
```

</details>

**依据 17 · 源码核查**：[src/backend/app/core/llm/router.py:774-793](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/core/llm/router.py#L774-L793)

真实provider.complete调用。

<details>
<summary>查看原文（20行）</summary>

```text
                    extra["effort"] = eff
                if tools:
                    # 只在真的要用工具时才传：未声明该参数的 provider 子类/测试替身
                    # 一旦收到未知关键字就会 TypeError，而它们本来工作得好好的
                    extra["tools"] = tools
                    if tool_choice is not None:
                        extra["tool_choice"] = tool_choice
                result = await provider.complete(
                    messages, model=route.model, temperature=temp, max_tokens=max_tokens, **extra
                )
        except Exception as e:
            if log_enabled:
                await self._log_call(
                    stage=stage,
                    route=route,
                    model=route.model,
                    started_at=started_at,
                    status="error",
                    error=f"{type(e).__name__}: {e}",
                    request=call_log.sanitize_request(messages, images),
```

</details>

**依据 18 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:3085-3114](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L3085-L3114)

再生成/写文件、重装依赖与继续signal。

<details>
<summary>查看原文（30行）</summary>

```text
        prev_files = ctx.checkpoint.get("exp_files") or {}
        files = await _complete_json(
            ctx, system=system_prompt, user=fix_user, validate=validate_files
        )
        executor = await _open_executor(session, ctx, experiment)
        try:
            await executor.write_files(files)
            if files.get("requirements.txt") != prev_files.get("requirements.txt"):
                # 与冒烟修复循环同理：requirements 变更必须真正重装（增量 pip），
                # 否则下一轮 run 还在旧依赖上跑
                await ctx.log("requirements.txt 有变更，重装依赖供下一轮使用")
                with contextlib.suppress(Exception):
                    dep = await executor.setup_venv()
                    if dep.exit_status != 0:
                        await ctx.log(
                            f"依赖重装未成功（exit={dep.exit_status}），下一轮将带错重修",
                            level="warn",
                        )
            await _sync_memory_file(ctx, executor)
        finally:
            await executor.close()
        ctx.checkpoint["exp_files"] = files
        iterate_cp["last_completed_seq"] = run.seq
        ctx.checkpoint["iterate"] = iterate_cp

        return {
            "seq": run.seq,
            "decision": decision,
            "rounds": len(runs),
            "plan_signal": {"decision": "continue", "next_round": run.seq + 1},
```

</details>

**依据 19 · 源码核查**：[src/backend/app/agents/voyage/plan_edit.py:164-185](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/plan_edit.py#L164-L185)

继续信号实际追加下一轮，已待办则不重复。

<details>
<summary>查看原文（22行）</summary>

```text
def experiment_signal_edits(
    signal: dict[str, Any], active_rows: list[Any]
) -> dict[str, Any] | None:
    """experiment.analyze 的 plan_signal → 追加节点（幂等：待办节点已存在则跳过）。

    - decision continue（improve/debug 已改完代码）→ 追加下一轮 run + analyze；
    - decision finish（终止条件命中）→ 追加 figures + report 收尾。
    """
    pending_actions = {r.action for r in active_rows if r.status != "passed"}
    decision = str(signal.get("decision") or "")
    if decision == "continue":
        if "experiment.run" in pending_actions:
            return None
        next_round = int(signal.get("next_round") or 0)
        return {
            "finish": False,
            "reason": f"继续迭代：第 {next_round} 轮",
            "edits": [
                {
                    "op": "add_nodes",
                    "insert_after": None,
                    "nodes": experiment_round_nodes(next_round),
```

</details>

#### 缺口

- 未运行LLM/全部provider或调度并发/异常恢复，未对全部check/action作正确性审计。
  **影响**：能证实现反馈闭环，不能据角色名称、自判passed或最终done就推实验正确和无人监管可靠性。
  **进一步探讨**：合成已知答案任务核观察确进入后续模型、改文件真被下一轮使用；注入模型JSON坏/进程错/无指标与重启，独立验产物/状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 远端执行、指标和预算/授权分别有什么条件？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

本轮闭合Python-ML样式SSH代表路径，不说所有后端必须SSH/GPU：create_experiment按backend manifest的credential_kinds决定是否需SSH，并验证credential.user_id/kind；Runner无合法container规格走SSHExecutor，有则ContainerRunner，其他领域后端虽可注册/创建，本次既有动作的_open_executor在无SSH底座时明确报“尚未接入生命周期”，不把manifest选项当该链已能执行。默认backend从params或registry.DEFAULT_BACKEND取python-ml，经_resolve_runner_plugin绑定open_runner再交动作；已追正常选择到SSH代表callee，其他领域完整生命周期未全审。SSH写文件经相对路径校验/SFTP；执行固定模板但LLM产run.sh/Python等实际内容，模板命令不是不可信实验代码沙箱。正式运行用managed launch，已有running+PID时有重挂/远端pointer与PID一致性护栏，不能把“再加断点恢复/不重起”当新方向。

预算闸门不是默认必经。schema confirm_budget=false，service存到checkpoint，Navigator只有显式true才在setup前requires_gate=compute_budget；当前创建Modal没提交该字段。引擎会建Gate、暂停、批准后API排resume；不能叫每条SSH命令都问或所有迭代都重审。max_hours默认0表示不限时，max_runs默认10/no_improve_stop2；恢复/运行会按有效值检查，启用时间限制不等现金账单上限。运行用量/修复/远端任务需操作者管理，不能因“human-gated”标题就自动放心付费运行。

指标真实来源是远端日志POLARIS_METRIC JSON与可选metrics.json；正常managed路径_monitor_managed_command实际read_managed_output并parse_metric_lines/merge入DB，完成后以snapshot.exit_status定run状态；旧_poll_run另兼容。parser要求可存有限数值，随后写ExperimentRun/Experiment.metrics，按exit code记succeeded/failed，并提取主指标计数。已有done标准要求至少一轮主指标、停止原因和报告，阻止只写空报告就done。可证“有运行记录/有指标”，本次已核parse/ingest没有独立重算数据/评测；脚本输出0.99被入库不等性能真实、未泄漏测试或科研方法成立。仅指已核路径，不否定其他领域后端可能另有验证器。

| 效果 | 当前实现支持 | 不能推出 |
|---|---|---|
| 可执行/续作 | 真SFTP/Runner launch、PID重挂与DB观察 | 所有崩溃/未知结果exactly-once |
| 结果存在 | 有限数值解析、主指标/报告终检 | 指标独立真实、实验可复现或论文正确 |
| 授权/资源 | 条件Gate、次数/时间/无提升规则 | 默认人工预算审批、默认限时或现金硬cap |

#### 证据与依据

**依据 1 · 源码核查**：[src/backend/app/services/experiments.py:183-193](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/services/experiments.py#L183-L193)

按manifest需要/credential用户与kind检查。

<details>
<summary>查看原文（11行）</summary>

```text
    needs_ssh = "ssh" in manifest_for(backend).credential_kinds
    credential = None
    if credential_id is not None:
        credential = await session.get(SSHCredential, credential_id)
        # kind 校验（#677 凭据多态化后）：实验直跑只吃 ssh 凭据，别的 kind 私钥列为空，
        # 放进来会在 ssh_exec 解密时炸得不知所云——这里当不存在处理
        if credential is None or credential.user_id != user_id or credential.kind != "ssh":
            raise CredentialNotFoundError(str(credential_id))
    elif needs_ssh:
        # schema 的条件校验已挡住这条路；服务层兜底（不走 schema 的直接调用方）
        raise CredentialNotFoundError(str(credential_id))
```

</details>

**依据 2 · 源码核查**：[src/backend/app/services/experiments.py:212-234](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/services/experiments.py#L212-L234)

创建checkpoint真实保存confirm/后端参数。

<details>
<summary>查看原文（23行）</summary>

```text
    voyage = VoyageRun(
        kind="experiment",
        goal=f"实验验证：{idea.title}",
        status="planning",
        cursor=0,
        checkpoint={
            "params": {
                "experiment_id": str(experiment.id),
                "gpu_hint": params.gpu_hint if params else None,
                # 预算闸门开关（默认 False=不拦）：navigator 与 experiment.plan 都读这里
                "confirm_budget": bool(params.confirm_budget) if params else False,
                "eval_model": params.eval_model if params else None,
                "hf_mirror": bool(params.hf_mirror) if params else False,
                "extra_notes": params.extra_notes if params else None,
                # 开题问答（AI 按 idea 生成的问题 + 用户回答）：进 plan/codegen prompt
                "intake": (
                    [qa.model_dump() for qa in params.intake] if params and params.intake else None
                ),
                # 执行后端（Runner v2，#675/#716）：动作层分派点
                # （actions_experiment._resolve_runner_plugin）从这里读，经注册表拿插件
                "backend": params.backend if params else "python-ml",
                # 流程包（#678）：非空时 navigator 按包生成计划；None = 原路径
                "process_pack": params.process_pack if params else None,
```

</details>

**依据 3 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:1270-1307](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L1270-L1307)

实际backend选择/bindopen_runner与非SSH动作路径明确拒绝未接入。

<details>
<summary>查看原文（38行）</summary>

```text
    raw = str(_params(ctx).get("backend") or "").strip()
    backend = raw or runner_registry.DEFAULT_BACKEND
    # 未注册后端在此抛 UnknownBackendError：经 _guarded 留痕后交引擎失败分派（可诊断）
    manifest = runner_registry.manifest_for(backend)
    if "ssh" not in manifest.credential_kinds:
        return runner_registry.get(backend)(), None
    if experiment.credential_id is None:
        raise ValueError("实验缺少 SSH 凭据（credential_id 为空）")
    credential = await session.get(SSHCredential, experiment.credential_id)
    if credential is None:
        raise ValueError("SSH 凭据已删除，无法连接实验服务器")
    plan = experiment.plan if isinstance(experiment.plan, dict) else {}
    runner = await open_runner(
        credential=credential,
        exp_id=str(experiment.id),
        project_id=experiment.project_id,
        kind=plan.get("kind"),
        container=plan.get("container"),
    )
    return runner_registry.get(backend)(runner=runner), runner


async def _open_executor(
    session: AsyncSession, ctx: ActionContext, experiment: Experiment
) -> Runner:
    """为实验打开执行后端（Runner）。分派收窄到 _resolve_runner_plugin 一处（#716）。

    本动作层的既有流程（setup/smoke/run/figures 及其修复循环）建立在 19 原语之上，
    只对 SSH 底座后端成立；非 SSH 后端在这里明确报错（可诊断、进失败分派），
    绝不拿错底座乱跑。
    """
    plugin, runner = await _resolve_runner_plugin(session, ctx, experiment)
    if runner is None:
        raise ValueError(
            f"后端 {plugin.manifest.backend} 不使用 SSH 执行底座，"
            "实验动作流程尚未接入该后端的执行生命周期"
        )
    return runner
```

</details>

**依据 4 · 源码核查**：[src/backend/app/services/runners/registry.py:23-25](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/services/runners/registry.py#L23-L25)

默认python-ml真实常量。

```text
from app.services.runners.python_ml import PYTHON_ML_BACKEND, PythonMLRunner

DEFAULT_BACKEND = PYTHON_ML_BACKEND  # 缺省后端：兼容全部存量实验
```

**依据 5 · 源码核查**：[src/backend/app/services/ssh_exec.py:509-535](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/services/ssh_exec.py#L509-L535)

managed backend绑定真实SSH run并start。

<details>
<summary>查看原文（27行）</summary>

```text
    async def _run(
        self, command: str, timeout: float | None = DEFAULT_CMD_TIMEOUT_SECONDS
    ) -> SSHResult:
        await self._audit(command)
        return await self._session.run(command, timeout=timeout)

    def _managed_commands(self) -> SSHManagedCommands:
        """Return the command-name-agnostic durable execution backend."""
        return SSHManagedCommands(
            session=self._session,
            run=self._run,
            shell_workdir=self.workdir,
            sftp_workdir=self._sftp_dir,
        )

    async def start_managed_command(
        self,
        context: OperationContext,
        command: str,
        *,
        attempt_id: str | None = None,
    ) -> ManagedCommandHandle:
        return await self._managed_commands().start(
            context,
            command,
            attempt_id=attempt_id,
        )
```

</details>

**依据 6 · 源码核查**：[src/backend/app/services/managed_ssh.py:225-257](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/services/managed_ssh.py#L225-L257)

managed launcher真实SFTP/远端nohup setsid执行。

<details>
<summary>查看原文（33行）</summary>

```text
            launcher = (
                "#!/usr/bin/env bash\n"
                "set +e\n"
                f"prefix={prefix}\n"
                "echo $$ > ${prefix}.pid\n"
                "ps -o pgid= -p $$ | tr -d ' ' > ${prefix}.pgid\n"
                "awk '{print $22}' /proc/$$/stat > ${prefix}.start_ticks 2>/dev/null || true\n"
                "date +%s > ${prefix}.started\n"
                "touch ${prefix}.stdout ${prefix}.stderr\n"
                # 命令单独成行：写成 `{ cmd; }` 时，只要 cmd 以注释收尾
                # （`bash run.sh # 说明`），后面的 `; }` 会被一起注释掉，
                # 整个启动脚本变成语法错误。换行后注释只吃掉它自己那一行。
                "{\n"
                f"{command}\n"
                "} >${prefix}.stdout 2>${prefix}.stderr\n"
                "status=$?\n"
                "printf '%s\\n' \"$status\" > ${prefix}.exit.tmp\n"
                "mv ${prefix}.exit.tmp ${prefix}.exit\n"
                "exit $status\n"
            )
            await self._session.write_file(f"{sftp_prefix}.sh", launcher)
            pointer = f"{operation_dir}/current"
            await self._run(
                f"printf '%s\\n' {attempt_id} > {pointer}.tmp && mv {pointer}.tmp {pointer}",
                60,
            )
            launch_command = (
                f"chmod 700 {prefix}.sh || exit $?; "
                f"nohup setsid bash {prefix}.sh >/dev/null 2>&1 < /dev/null & "
                "pid=$!; printf '%s\\n' \"$pid\""
            )
            try:
                launch = await self._run(launch_command, 60)
```

</details>

**依据 7 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:1063-1087](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L1063-L1087)

正常managed输出实际parse/merge/inspect，不拿旧poll helper冒充。

<details>
<summary>查看原文（25行）</summary>

```text
            chunks, stdout_offset, stderr_offset = await executor.read_managed_output(
                handle,
                stdout_offset=stdout_offset,
                stderr_offset=stderr_offset,
            )
            for chunk in chunks:
                experiments_service.append_terminal_output(
                    experiment.id,
                    operation=handle.operation_id,
                    stream=chunk.stream,
                    text=chunk.text,
                )
                if run is not None:
                    experiments_service.append_local_log(experiment.id, run.seq, chunk.text)
                    points = parse_metric_lines(chunk.text)
                    if points:
                        run.metrics = merge_metrics(run.metrics, points)
                        experiment.metrics = merge_metrics(experiment.metrics, points)
            if run is not None and chunks:
                await session.commit()
            snapshot = await executor.inspect_managed_command(
                handle,
                previous_token=previous_token,
                diagnostic_evidence=diagnostic_evidence,
            )
```

</details>

**依据 8 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:2779-2803](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L2779-L2803)

正常managed调用/真实snapshot退出状态。

<details>
<summary>查看原文（25行）</summary>

```text
            if managed_handle is not None:
                try:
                    run_snapshot, executor = await _monitor_managed_command(
                        ctx, session, executor, experiment, managed_handle, run=run
                    )
                except ManagedCommandNeedsUser as pending:
                    return _managed_command_waiting_result(ctx, experiment, pending)
                except ManagedCommandCancelled as cancelled:
                    executor = cancelled.executor
                    return {
                        "cancelled": True,
                        "run_id": str(run.id),
                        "seq": run.seq,
                    }
                run.exit_code = run_snapshot.exit_status
                run.status = "succeeded" if run_snapshot.exit_status == 0 else "failed"
                run.finished_at = utcnow()
                await session.commit()
                observation = {
                    "run_id": str(run.id),
                    "seq": run.seq,
                    "exit_code": run_snapshot.exit_status,
                    "run_status": run.status,
                    "metric_names": sorted((run.metrics or {}).keys()),
                }
```

</details>

**依据 9 · 源码核查**：[src/backend/app/agents/voyage/runner.py:450-465](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/runner.py#L450-L465)

实际SSH/合法container分支，不采信旧仅Remote注释。

<details>
<summary>查看原文（16行）</summary>

```text
    exp_id: str | uuid.UUID,
    project_id: uuid.UUID,
    kind: str | None = None,  # noqa: ARG001 — kind 是提示；具体分派看 plan 是否声明 container
    container: Any = None,
) -> Runner:
    """为一个实验挑选并打开 Runner。

    分派规则（声明式，kind 无关）：plan 若声明了合法的 `container`（含 image）→ ContainerRunner
    （在容器里跑，训练类/需框架的实验用）；否则 → RemoteHostRunner（裸机 venv，行为与之前一致）。
    `kind` 只是提示（PLAN 用它决定要不要声明 container），真正的开关是 container 规格本身。
    """
    executor = await open_executor(credential=credential, exp_id=str(exp_id), project_id=project_id)
    spec = parse_container_spec(container)
    if spec is not None:
        return ContainerRunner.from_executor(executor, spec=spec)
    return executor
```

</details>

**依据 10 · 源码核查**：[src/backend/app/services/ssh_exec.py:147-157](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/services/ssh_exec.py#L147-L157)

真实SSH run/SFTP写入callee。

<details>
<summary>查看原文（11行）</summary>

```text
    async def run(self, command: str, timeout: float | None = None) -> SSHResult:
        result = await self._conn.run(command, check=False, timeout=timeout)
        return SSHResult(
            exit_status=int(result.exit_status or 0),
            stdout=str(result.stdout or ""),
            stderr=str(result.stderr or ""),
        )

    async def write_file(self, path: str, content: str) -> None:
        async with self._conn.start_sftp_client() as sftp, sftp.open(path, "w") as f:
            await f.write(content)
```

</details>

**依据 11 · 源码核查**：[src/backend/app/services/ssh_exec.py:582-594](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/services/ssh_exec.py#L582-L594)

路径验证→真实写文件。

<details>
<summary>查看原文（13行）</summary>

```text
    async def write_files(self, files: dict[str, str]) -> list[str]:
        """SFTP 写文件到 workdir（LLM 产出的内容只经此通道落盘，不进 shell）。"""
        written: list[str] = []
        for name, content in files.items():
            rel = _validate_relpath(name)
            parent = posixpath.dirname(rel)
            if parent:
                await self._run(f"mkdir -p {self.workdir}/{parent}")
            path = f"{self._sftp_dir}/{rel}"
            await self._audit(f"sftp:write {self.workdir}/{rel} ({len(content)} bytes)")
            await self._session.write_file(path, str(content))
            written.append(rel)
        return written
```

</details>

**依据 12 · 源码核查**：[src/backend/app/services/ssh_exec.py:703-734](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/services/ssh_exec.py#L703-L734)

真实nohup/managed正式运行。

<details>
<summary>查看原文（32行）</summary>

```text
    async def launch_run(self) -> tuple[int, str]:
        """后台启动正式运行，返回 (PID, 启动命令)。退出码落 run.exit 供轮询读取。"""
        # PYTHONUNBUFFERED=1 + stdbuf 行缓冲：让 run.log 实时刷新，轮询才能镜像日志/解析指标
        # （否则 Python 块缓冲 stdout，长实验期间 run.log 长时间为空，无法观测进度）。
        command = (
            f"cd {self.workdir} && rm -f run.exit && "
            f"nohup bash -c 'export PYTHONUNBUFFERED=1; {ENV_SOURCE_PREFIX} "
            f"stdbuf -oL -eL bash run.sh > run.log 2>&1; "
            "echo $? > run.exit' >/dev/null 2>&1 & echo $!"
        )
        result = await self._run(command)
        try:
            pid = int(result.stdout.strip().splitlines()[-1])
        except (ValueError, IndexError) as e:
            raise SSHExecError(f"launch_run 未返回 PID：{result.stdout!r}") from e
        return pid, command

    async def launch_managed_run(self) -> ManagedCommandHandle:
        command = (
            f"cd {self.workdir} && {{ export PYTHONUNBUFFERED=1; "
            f"{ENV_SOURCE_PREFIX} stdbuf -oL -eL bash run.sh; }}"
        )
        return await self.start_managed_command(
            OperationContext(
                phase="application.run",
                operation="experiment-run",
                display_command="bash run.sh",
                target=self.host,
                soft_timeout_seconds=600,
                stall_timeout_seconds=900,
                repair_scope=RepairScope.APPLICATION_FILES,
            ),
```

</details>

**依据 13 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:2684-2705](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L2684-L2705)

已有运行/PID重挂与预算检查。

<details>
<summary>查看原文（22行）</summary>

```text
        seq = (prior_runs[-1].seq + 1) if prior_runs else 1
        # 重启重挂：上一轮还挂着 running（worker 重启/任务被打断），远端 nohup 进程仍在跑
        # （或已留下 run.exit）——**重挂轮询同一进程**而不是再起一轮。否则新旧两棵进程树
        # 共写同一 workdir 的 run.log/run.exit（旧 launcher 晚到覆写 run.exit → 新轮读到假
        # 退出码；实测每次部署重启都会孤儿一轮训练）。_poll_run 天然处理三种情况：还活着
        # →继续跟；已结束→读 run.exit 收尾；死了没退出码→判 failed 交 analyze 诊断。
        stale = (
            prior_runs[-1]
            if prior_runs and prior_runs[-1].status == "running" and prior_runs[-1].pid
            else None
        )

        # 恢复现场护栏：预算已满就不再启动（正常路径由 analyze 的终止判定拦截；
        # 重挂不是新一轮，不受 max_runs 拦截）
        for reason, exhausted in (
            ("max_runs", bool(stale is None and max_runs and seq > max_runs)),
            (
                "max_hours",
                bool(prior_runs and max_hours and _elapsed_hours(iterate_started) > max_hours),
            ),
        ):
            if exhausted:
```

</details>

**依据 14 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:2735-2755](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L2735-L2755)

remote pointer需PID相符/否则不接错实例及新launch。

<details>
<summary>查看原文（21行）</summary>

```text
                            soft_timeout_seconds=600,
                            stall_timeout_seconds=900,
                            hard_timeout_seconds=max_hours * 3600 if max_hours else None,
                            repair_scope=RepairScope.APPLICATION_FILES,
                        )
                    )
                    # The remote current pointer is authoritative only when it still
                    # names the process recorded for this database run.  A mismatch
                    # falls back to the pre-managed compatibility path; it must never
                    # attach an unrelated attempt merely because it shares a workdir.
                    if recovered is not None and recovered.process_id == int(run.pid):
                        managed_handle = recovered
            else:
                managed_handle = await executor.launch_managed_run()
                base_context = managed_handle.context
                managed_handle = ManagedCommandHandle(
                    operation_id=managed_handle.operation_id,
                    attempt_id=managed_handle.attempt_id,
                    context=OperationContext(
                        phase=base_context.phase,
                        operation=base_context.operation,
```

</details>

**依据 15 · 源码核查**：[src/backend/app/schemas/experiment.py:10-30](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/schemas/experiment.py#L10-L30)

真实预算默认0小时、10轮及confirm默认false。

<details>
<summary>查看原文（21行）</summary>

```text
class ExperimentBudget(BaseModel):
    # 0 = 无限时（默认）：修复循环/运行轮询只受它约束，不再按次数设限（用户定调）
    max_hours: float = Field(default=0, ge=0)
    max_runs: int = Field(default=10, ge=1)
    # 连续 N 轮主指标无提升即停（docs/task-system.md §7（原 api-m5-a.md §3））
    no_improve_stop: int = Field(default=2, ge=1)


class IntakeQA(BaseModel):
    """开题问答：创建实验时 AI 按 idea 提出的问题与用户的回答（可留空）。"""

    question: str = Field(min_length=1, max_length=500)
    answer: str = Field(default="", max_length=4000)


class ExperimentParams(BaseModel):
    gpu_hint: str | None = None
    budget: ExperimentBudget | None = None
    # 建环境前过 compute_budget 人工审批闸门。默认关（#626）：单人产品里实验默认
    # 直行到跑完；要人拍板预算就显式传 True，机制（Gate + engine 断点）原样保留
    confirm_budget: bool = False
```

</details>

**依据 16 · 源码核查**：[src/backend/app/agents/voyage/navigator.py:434-452](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/navigator.py#L434-L452)

只在显式true挂预算Gate。

<details>
<summary>查看原文（19行）</summary>

```text
    # 预算闸门默认不拦（#626）：创建实验时显式传 confirm_budget=True 才在建环境前
    # 停下等审批；机制（Gate 模型 + engine 断点）原样保留。
    # run 可为 None（失败语义单测直接调计划模板），当默认（不拦）处理
    checkpoint = (run.checkpoint if run is not None else None) or {}
    confirm_budget = bool((checkpoint.get("params") or {}).get("confirm_budget"))
    steps = [
        (
            "实验计划（LLM）",
            "experiment.plan",
            "plan JSON（含 primary_metric）已通过严格校验并写入 Experiment.plan",
            None,
        ),
        (
            "建环境（SSH + 代码生成）",
            "experiment.setup",
            "远端 workdir 就绪、代码文件已写入、venv 依赖安装成功",
            "compute_budget" if confirm_budget else None,
        ),
        ("冒烟测试", "experiment.smoke", "run.sh --smoke 退出码为 0", None),
```

</details>

**依据 17 · 源码核查**：[src/backend/app/agents/voyage/engine.py:879-902](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/engine.py#L879-L902)

实际Gate落库/通知暂停。

<details>
<summary>查看原文（24行）</summary>

```text
        payload: dict[str, Any] = {
            "voyage_id": str(run.id),
            "step_seq": node_index,
            "step_title": step_def.get("title"),
        }
        # 动作可在 checkpoint["gate_payload"] 预置业务上下文（如实验 id + 预算摘要）
        extra_payload = checkpoint.get("gate_payload")
        if isinstance(extra_payload, dict):
            payload = extra_payload | payload
        gate = Gate(
            project_id=run.project_id,
            kind=str(step_def["requires_gate"]),
            payload=payload,
            requested_by=f"voyage:{run.kind}",
        )
        session.add(gate)
        await session.flush()
        gates[str(node.id)] = {"gate_id": str(gate.id)}
        checkpoint["gates"] = gates
        run.checkpoint = checkpoint
        await session.commit()
        await self._emit_log(
            run, f"步骤 {node_index} 需要 {gate.kind} 人工审批，任务暂停", level="gate"
        )
```

</details>

**依据 18 · 源码核查**：[src/backend/app/api/gates.py:111-121](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/api/gates.py#L111-L121)

批准路径排resume，不只声明Gate。

<details>
<summary>查看原文（11行）</summary>

```text
                    )
                    await bus.publish_voyage_event(
                        voyage_id,
                        "message",
                        {"message": messages_service.serialize_message(message)},
                    )
                except messages_service.MessageSeqConflictError:
                    pass  # 极小概率并发撞 seq：意见仍在 gate.comment 里，不阻塞审批
            await queue.enqueue("resume_voyage", str(voyage_id))
        else:
            run = await gates_service.fail_voyage(session, voyage_id)
```

</details>

**依据 19 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:1550-1608](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L1550-L1608)

日志/metricsJSON真实有限值解析，不是独立测量。

<details>
<summary>查看原文（59行）</summary>

```text
def parse_metric_lines(text: str) -> list[dict[str, Any]]:
    """解析日志中的 ``POLARIS_METRIC {json}`` 行 → [{name, step, value}]。

    非有限值（NaN/Inf）跳过——它们进不了 JSONB，见 :func:`_is_storable_number`。
    """
    points: list[dict[str, Any]] = []
    for line in text.splitlines():
        m = METRIC_LINE_RE.search(line)
        if not m:
            continue
        try:
            data = json.loads(m.group(1))
        except json.JSONDecodeError:
            continue
        name = data.get("name") if isinstance(data, dict) else None
        value = data.get("value") if isinstance(data, dict) else None
        if not isinstance(name, str) or not _is_storable_number(value):
            continue
        step = data.get("step")
        points.append(
            {
                "name": name,
                "step": int(step) if isinstance(step, int | float) else None,
                "value": float(value),
            }
        )
    return points


def parse_metrics_json(text: str) -> list[dict[str, Any]]:
    """解析可选 workdir/metrics.json → 指标点列表（非法内容一律返回空，不抛错）。

    支持 {"name": 数值} 与 {"name": [{"step": 1, "value": 0.5}]} 两种形态。
    """
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        return []
    if not isinstance(data, dict):
        return []
    points: list[dict[str, Any]] = []
    for name, value in data.items():
        if not isinstance(name, str):
            continue
        if _is_storable_number(value):
            points.append({"name": name, "step": None, "value": float(value)})
        elif isinstance(value, list):
            for item in value:
                if not isinstance(item, dict):
                    continue
                v = item.get("value")
                if not _is_storable_number(v):
                    continue
                step = item.get("step")
                points.append(
                    {
                        "name": name,
                        "step": int(step) if isinstance(step, int | float) else None,
                        "value": float(v),
```

</details>

**依据 20 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:3142-3163](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L3142-L3163)

指标入DB与退出码状态。

<details>
<summary>查看原文（22行）</summary>

```text
    async def ingest_chunk() -> None:
        nonlocal offset
        chunk, offset = await executor.tail_log(offset)
        if not chunk:
            return
        experiments_service.append_local_log(experiment.id, run.seq, chunk)
        points = parse_metric_lines(chunk)
        if points:
            run.metrics = merge_metrics(run.metrics, points)
            experiment.metrics = merge_metrics(experiment.metrics, points)
        await session.commit()

    async def finish(exit_code: int | None) -> dict[str, Any]:
        try:
            await ingest_chunk()  # 收尾：抓最后一段日志
        except Exception as e:  # noqa: BLE001 — 收尾抓日志断连不该翻盘
            if not ssh_exec.is_connection_error(e):
                raise
        run.exit_code = exit_code
        run.status = "succeeded" if exit_code == 0 else "failed"
        run.finished_at = utcnow()
        await session.commit()
```

</details>

**依据 21 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:2814-2838](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L2814-L2838)

额外metrics合并/主指标计数。

<details>
<summary>查看原文（25行）</summary>

```text
            # 可选 workdir/metrics.json 合并（平台确定性解析，非 LLM）
            metrics_text = await executor.read_metrics_json()
            if metrics_text:
                extra_points = parse_metrics_json(metrics_text)
                if extra_points:
                    run.metrics = merge_metrics(run.metrics, extra_points)
                    experiment.metrics = merge_metrics(experiment.metrics, extra_points)
        finally:
            await executor.close()

        # 主指标解析 + direction 感知比较（无提升连击数供 analyze 终止判定用）
        primary_value = extract_primary_value(run.metrics, pm_name)
        run.primary_value = primary_value
        if primary_value is not None:
            # 记账：真正拿到主指标的轮次数。voyage 级完成标准据此判「这趟到底有没有
            # 结果」——否则每轮 exit 1、指标全空，只要写出了报告就照样宣告 done
            # （实测 voyage 6c5df454：三轮里两轮 exit 1，全被判 passed，最后 done，
            # 报告基于空数据。比直接失败更有害，因为它看起来是成功的）。
            iterate_cp = dict(ctx.checkpoint.get("iterate") or {})
            iterate_cp["primary_metric_runs"] = int(iterate_cp.get("primary_metric_runs") or 0) + 1
            ctx.checkpoint["iterate"] = iterate_cp
            if is_improvement(primary_value, best, pm_direction):
                state["no_improve_streak"] = 0
            else:
                state["no_improve_streak"] += 1
```

</details>

**依据 22 · 源码核查**：[src/backend/app/agents/voyage/navigator.py:496-505](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/navigator.py#L496-L505)

现有至少主指标/停止/报告终检。

<details>
<summary>查看原文（10行）</summary>

```text
    "experiment": {
        "checks": [
            # 至少有一轮真的跑出了主指标。原来只查「停止原因」+「报告已生成」，
            # 于是每轮 exit 1、指标全空，只要写出报告就照样 done——实测 voyage
            # 6c5df454 三轮里两轮失败仍宣告完成，还产出了一份基于空数据的报告。
            # 「跑完了」不等于「有结果」，完成标准必须要求后者。
            {"kind": "min_count", "field": "iterate.primary_metric_runs", "value": 1},
            {"kind": "artifact_exists", "key": "iterate.stopped_reason"},
            {"kind": "artifact_exists", "key": "report_done"},
        ]
```

</details>

**依据 23 · 源码核查**：[src/backend/app/agents/voyage/engine.py:827-837](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/engine.py#L827-L837)

终检真实被调用，未达转人裁决。

<details>
<summary>查看原文（11行）</summary>

```text
    async def _finalize(self, session: AsyncSession, run: VoyageRun) -> None:
        """所有节点走完 → voyage 级完成标准终检（docs/task-system.md §7）。"""
        criteria = run.done_criteria if isinstance(run.done_criteria, dict) else None
        checks = criteria.get("checks") if criteria else None
        if checks:
            verdict, _rubrics = run_deterministic_checks(
                checks, observation=None, checkpoint=run.checkpoint
            )
            if verdict is not None and not verdict.get("passed"):
                await self._emit_log(run, f"完成标准未达成：{verdict.get('reason')}", level="error")
                # 防"过早宣告完成"：转提问让用户裁决（接受为完成 / 指示补做 / 放弃）
```

</details>

#### 缺口

- 未实跑GPU/SSH/容器、独立重算指标、全后端权限/审批角色或端到端恢复。
  **影响**：不能将生成代码、指标DB/审核标签当科学结果或成本可靠保证；采用需先控真实权限、预算和评测输入。
  **进一步探讨**：受控合成任务显式正max_hours/confirm_budget，用独立真值比较正常/常量指标/失败输出/丢响应/重启重挂；现金和资源单独记录。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本地/远端依赖、明文模型配置和退出成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

本地Python>=3.12引擎、桌面/Web资源、数据库/队列与模型配置需匹配；README单机本地模式，不能把pyproject列Redis/Postgres依赖理解为每用户都必部署外部服务。SSH/GPU仅所选实验Runner和任务需要，其他backend按manifest；文献或本地资料不一概必须GPU。真实首启bootstrap准备Python/venv/后端，安装/网络/平台成本未测。

重要额外流向：eval_model非空时从default路由拿已解密api_key/base_url，生成llm_config.json并作为platform_files写远端工作目录，ACP路由无可下发API会拒绝。审计只记路径/字节不等远端不存在明文密钥；SFTP write_file未在该callee显式设置文件权限，实际由服务器/已有文件权限等决定，未声称已经泄漏。复制/保留远端工件要考虑该文件，初试可不启eval_model或用限定实验Key。

本地关窗/断开SSH不等远端费用停止：正式run有nohup与可重挂状态，SSHExecutor.close只关session；已有cancel/managed stop路径仍需操作者核远端真实状态，本轮未穷审所有退出分支，不许所有退出都自动停或都不停。退出要保存DB/代码/日志/报告、确认作业/资源租约和远端秘密文件后再卸本地壳，不能只删应用视为撤销实验。

| 依赖/条件 | 是否必需 | 用途 | 缺失/不满足 |
|---|---|---|---|
| 匹配桌面/Web/Python本地引擎 | 此入口需 | UI/API/持久任务与本地资料 | 首启下载/依赖/迁移可失败，成品未核 |
| 模型或Agent后端/权限 | 智能规划/反思需 | 产生计划/代码/判断 | provider路由和实际费用另核，不许自动正确 |
| 授权Runner/任务资源 | 所选实验路径需 | SSH/容器或其他backend按manifest执行 | GPU不是全产品必需；代码按目标账号权限运行 |
| 项目数据/磁盘/评测依据 | 相关任务需 | 本地记录、远端工件/数据/独立答案 | 权限与来源不足不应以模拟指标补齐 |

| 阶段 | 现金与资源 | 人工与时间 | 已知/未知 |
|---|---|---|---|
| 首次 | Python/后端、模型、测试机/按需GPU与磁盘；金额未知 | 独立目录/副本、配置资源与正预算/确认、核已知任务 | 未启动，安装/首结果工时未知 |
| 持续 | 模型/生成/修复、训练/数据下载/远端API、工件 | 审方法/代码/评测，核预算与指标来源 | 0小时不限时，非现金硬封顶；无净节省实测 |
| 失败恢复 | partial作业/工件、远端仍跑与重复费用 | 先看PID/managed记录和DB/输出，再续作；保留原版本 | 现有重挂不等所有情况exactly-once |
| 退出 | 本地数据、远端代码/模型/数据/日志/可选Key文件 | 核停作业/释放资源、保全证据并撤回测试Key，再清理实际目录 | 不许自动全清、全树停止或研究数据回滚 |

#### 证据与依据

**依据 1 · 源码核查**：[src/backend/pyproject.toml:5-37](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/pyproject.toml#L5-L37)

本地Python/依赖声明不等每项外部部署必需。

<details>
<summary>查看原文（33行）</summary>

```text
[project]
name = "polaris-backend"
version = "0.1.0"
description = "Polaris 自动 AI 科研平台 — local engine (FastAPI, single process)"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115",
    "uvicorn[standard]>=0.30",
    "sqlalchemy[asyncio]>=2.0.40",
    "alembic>=1.14",
    "fastapi-users[sqlalchemy]>=14.0",
    "redis>=5",
    "pydantic>=2.11",
    "pydantic-settings>=2.6",
    "httpx>=0.27",
    "asyncssh>=2.18",
    "cryptography>=43",
    "python-multipart>=0.0.12",
    "pgvector>=0.5",
    "pymupdf>=1.26",
    "pillow>=10",
    "bibtexparser>=1.4,<2",
    "pycrdt>=0.10",
    "pycrdt-websocket>=0.15",
    "python-pptx>=1.0",
    "pyyaml>=6.0",
    "tzdata>=2025.2",
    # SQLite 上的语义检索在 Python 侧打余弦分（services/vector_search.py）；
    # 缺了也能跑（退回纯 Python），只是慢一个数量级
    "numpy>=1.26",
    # 单进程本地引擎：SQLite + 进程内 redis 替身（fakeredis 依赖 redis 包）
    "aiosqlite>=0.20",
    "fakeredis>=2.26",
```

</details>

**依据 2 · 源码核查**：[src/desktop/src/main/engine-bootstrap.ts:122-171](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/desktop/src/main/engine-bootstrap.ts#L122-L171)

实际Python/venv首启引导与缓存条件。

<details>
<summary>查看原文（50行）</summary>

```text
export async function bootstrapEngine(opts: BootstrapOptions): Promise<EngineCommand> {
  const { resourcesDir, dataDir, onProgress } = opts;

  const uvBin = join(resourcesDir, 'uv', process.platform === 'win32' ? 'uv.exe' : 'uv');
  const backendDir = join(resourcesDir, 'backend');
  for (const [what, path] of [
    ['uv 二进制', uvBin],
    ['后端源码', join(backendDir, 'pyproject.toml')],
    ['后端哈希', join(backendDir, '.hash')],
  ] as const) {
    if (!existsSync(path)) {
      throw new Error(`engine-bootstrap: 安装包里缺少${what}（${path}）——打包时没跑 stage:resources？`);
    }
  }
  const uvVersion = readTrimmed(join(resourcesDir, 'uv', 'version.txt'));
  const backendHash = readTrimmed(join(backendDir, '.hash'));

  const engineDir = join(dataDir, 'engine');
  const venvDir = join(engineDir, 'venv');
  const venvPython =
    process.platform === 'win32'
      ? join(venvDir, 'Scripts', 'python.exe')
      : join(venvDir, 'bin', 'python');
  const sentinelPath = join(engineDir, 'bootstrap.json');

  onProgress?.({ phase: 'check' });
  const wanted: Sentinel = { uvVersion, backendHash, pythonVersion: PYTHON_VERSION };
  let fresh = true;
  try {
    const current = JSON.parse(readFileSync(sentinelPath, 'utf8')) as Partial<Sentinel>;
    fresh = !(
      current.uvVersion === wanted.uvVersion &&
      current.backendHash === wanted.backendHash &&
      current.pythonVersion === wanted.pythonVersion &&
      existsSync(venvPython)
    );
  } catch {
    /* 哨兵不存在或损坏 → 全量引导 */
  }

  if (fresh) {
    await mkdir(engineDir, { recursive: true });
    // uv 的一切可变状态都圈进 engine/：托管 Python、缓存都不落用户主目录，
    // UV_NO_CONFIG 再挡掉用户自己的 uv.toml（比如镜像源/固定 python 目录），
    // only-managed 保证绝不用系统里碰巧存在的 Python——机器上有没有 Python
    // 结果必须一致。
    const env: NodeJS.ProcessEnv = {
      ...process.env,
      UV_PYTHON_INSTALL_DIR: join(engineDir, 'python'),
      UV_CACHE_DIR: join(engineDir, 'uv-cache'),
```

</details>

**依据 3 · 源码核查**：[src/backend/app/services/experiments.py:183-193](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/services/experiments.py#L183-L193)

资源/凭据条件依后端而异。

<details>
<summary>查看原文（11行）</summary>

```text
    needs_ssh = "ssh" in manifest_for(backend).credential_kinds
    credential = None
    if credential_id is not None:
        credential = await session.get(SSHCredential, credential_id)
        # kind 校验（#677 凭据多态化后）：实验直跑只吃 ssh 凭据，别的 kind 私钥列为空，
        # 放进来会在 ssh_exec 解密时炸得不知所云——这里当不存在处理
        if credential is None or credential.user_id != user_id or credential.kind != "ssh":
            raise CredentialNotFoundError(str(credential_id))
    elif needs_ssh:
        # schema 的条件校验已挡住这条路；服务层兜底（不走 schema 的直接调用方）
        raise CredentialNotFoundError(str(credential_id))
```

</details>

**依据 4 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:693-714](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L693-L714)

eval_model真实解密路由→api_key JSON内容，ACP拒绝。

<details>
<summary>查看原文（22行）</summary>

```text
async def _eval_model_config_file(ctx: ActionContext) -> dict[str, str]:
    """eval_model 非空时：从 LLM 路由 default stage 解析 provider（api_key 已解密），
    生成 llm_config.json 内容。审计侧安全：write_files 的审计只记路径与字节数，
    api_key 不会出现在任何日志/Activity。"""
    eval_model = str(_params(ctx).get("eval_model") or "").strip()
    if not eval_model:
        return {}
    _provider, route = await ctx.llm.resolve("default")
    if route.provider_kind == "acp":
        # 外部 agent（#840）没有可以交给实验机的地址和 key：实验代码要自己调模型，
        # 只能靠一个模型 API。空着发过去只会让实验跑到一半才因为连不上而失败。
        raise RuntimeError(
            "eval_model needs a model API: the default model is an agent backend, which "
            "experiment code on another machine cannot call. Configure a model API for the "
            "default stage, or leave eval_model empty."
        )
    config = {
        "base_url": route.base_url or "",
        "api_key": route.api_key,
        "model": eval_model,
    }
    return {"llm_config.json": json.dumps(config, ensure_ascii=False, indent=2) + "\n"}
```

</details>

**依据 5 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:2073-2103](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L2073-L2103)

platform_files实际进入write_files。

<details>
<summary>查看原文（31行）</summary>

```text

        # 平台注入文件（非 LLM 产物，不进 exp_files，避免被 smoke/iterate 修复覆写）：
        # env.sh（POLARIS_WORKDIR/HF_ENDPOINT/代理）与可选 llm_config.json（评测模型）
        eval_files = await _eval_model_config_file(ctx)
        llm_host = ""
        if eval_files:
            from urllib.parse import urlparse

            llm_host = (
                urlparse(json.loads(eval_files["llm_config.json"])["base_url"]).hostname or ""
            )

        executor = await _open_executor(session, ctx, experiment)
        # 代理优先用凭据上配的（那是「这台机器」的属性），没配才回落到全局实验设置
        proxy_url = executor.proxy_url or env_settings.get("proxy_url") or None
        platform_files = (
            _platform_env_files(
                ctx,
                proxy_url=proxy_url,
                no_proxy_extra=llm_host,
                env_settings=env_settings,
            )
            | eval_files
        )
        try:
            await executor.mkdir_workdir()
            experiment.workdir = executor.workdir
            experiment.server_host = executor.host
            await session.commit()
            await executor.write_files(platform_files)  # 平台文件写一次（不随修复变）

```

</details>

**依据 6 · 源码核查**：[src/backend/app/services/ssh_exec.py:155-165](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/services/ssh_exec.py#L155-L165)

实际SFTP写和关连接，不许默认文件权限/作业全停。

<details>
<summary>查看原文（11行）</summary>

```text
    async def write_file(self, path: str, content: str) -> None:
        async with self._conn.start_sftp_client() as sftp, sftp.open(path, "w") as f:
            await f.write(content)

    async def read_file(self, path: str) -> bytes:
        async with self._conn.start_sftp_client() as sftp, sftp.open(path, "rb") as f:
            return await f.read()

    async def close(self) -> None:
        self._conn.close()
        await self._conn.wait_closed()
```

</details>

**依据 7 · 源码核查**：[src/backend/app/services/ssh_exec.py:490-491](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/services/ssh_exec.py#L490-L491)

Executor.close只委托session.close。

```text
    async def close(self) -> None:
        await self._session.close()
```

**依据 8 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:3123-3137](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L3123-L3137)

远端nohup/日志状态跨连接持续，恢复不是重起。

<details>
<summary>查看原文（15行）</summary>

```text
async def _poll_run(
    ctx: ActionContext,
    session: AsyncSession,
    executor: Runner,
    experiment: Experiment,
    run: ExperimentRun,
    max_hours: float,
) -> tuple[dict[str, Any], Runner]:
    """轮询远端运行直到结束。返回 (observation, executor)——executor 可能在轮询中因
    连接断开而重连，调用方须使用返回的（存活）executor 做后续读取与关闭。

    容错要点：轮询期间底层 SSH 连接可能被服务器 idle 断开或网络抖动切断。远端运行状态
    （run.exit/run.log/pid）都持久化在服务器上，且进程经 nohup 脱离会话——因此瞬时断连
    应「重连后继续跟踪」而非让实验失败（历史 bug：一次 ChannelOpenError 即判实验 failed，
    而进程其实还在跑）。仅在连续多次重连失败后才放弃。"""
```

</details>

#### 缺口

- 无合法配置/真实模型/GPU费用、全权限/凭据生命周期和退出清理实测。
  **影响**：成本/撤退不能靠一个预算或shutdown标签概括；远端作业与秘密材料是实际采用责任。
  **进一步探讨**：用可丢弃资源/限定Key记录首次/稳定/失败/退出的作业、文件/用量，独立确认停止与撤Key；无净益不扩大任务。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 生产插件方向如何区别现有工作台/恢复/验证，怎样证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前可试“有明确评测真值的受控实验”，不把六阶段自动科研标题当已交付论文。持久步骤/checkpoint、managed command/PID重挂、条件Gate、至少主指标终检和Sextant层级判断都已经存在，不能把再加任务面板、预算提示、断点恢复或要求有metrics当新方向。文献ai_evidence还已有内容版本/句子来源manifest，本轮未全审其质量；本题不重复提一套同名证据日志。

对已核Python-ML日志/metrics路径，可证伪假说是独立评测来源闭合：把生成的候选训练/实验代码与只读的固定评测器/数据划分分开，真实执行由允许资源的后端回传可核结果与运行条件，检测“打印常量指标但没完成预设评测”与数据/协议换版。增量是独立重算/约束来源，而不是让同一模型再读自己的指标或只验JSON/记录一致。未宣称所有科研都可机械验真或其他backend无验证；无法重算/无法证实必须unknown并交研究者，不能为报告凑数。

最低对照先用合法合成已知答案/小公开评测任务和独立维护者，比较手工脚本+日志、当前Polaris、增加评测器边界，同模型/资源预算。注入常量POLARIS_METRIC、测试数据泄漏/错误split、指标json来自旧run、真实训练失败但有数字、正常重启重挂；测假通过/漏检/误拒、结果可复算、重复作业、最终人工核对/修正分钟、模型/GPU/存储总投入和维护成本。先定假成功/重复费用不得高于基线；若当前过程已足够、独立评测层不能降错/总投入或研究者不愿继续，就停独立插件，把必要的预算默认说明/密钥清理等修复留原工程。

#### 证据与依据

**依据 1 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:2684-2705](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L2684-L2705)

当前重挂/预算护栏不能冒充新方向。

<details>
<summary>查看原文（22行）</summary>

```text
        seq = (prior_runs[-1].seq + 1) if prior_runs else 1
        # 重启重挂：上一轮还挂着 running（worker 重启/任务被打断），远端 nohup 进程仍在跑
        # （或已留下 run.exit）——**重挂轮询同一进程**而不是再起一轮。否则新旧两棵进程树
        # 共写同一 workdir 的 run.log/run.exit（旧 launcher 晚到覆写 run.exit → 新轮读到假
        # 退出码；实测每次部署重启都会孤儿一轮训练）。_poll_run 天然处理三种情况：还活着
        # →继续跟；已结束→读 run.exit 收尾；死了没退出码→判 failed 交 analyze 诊断。
        stale = (
            prior_runs[-1]
            if prior_runs and prior_runs[-1].status == "running" and prior_runs[-1].pid
            else None
        )

        # 恢复现场护栏：预算已满就不再启动（正常路径由 analyze 的终止判定拦截；
        # 重挂不是新一轮，不受 max_runs 拦截）
        for reason, exhausted in (
            ("max_runs", bool(stale is None and max_runs and seq > max_runs)),
            (
                "max_hours",
                bool(prior_runs and max_hours and _elapsed_hours(iterate_started) > max_hours),
            ),
        ):
            if exhausted:
```

</details>

**依据 2 · 源码核查**：[src/backend/app/agents/voyage/navigator.py:496-505](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/navigator.py#L496-L505)

有指标终检已经存在。

<details>
<summary>查看原文（10行）</summary>

```text
    "experiment": {
        "checks": [
            # 至少有一轮真的跑出了主指标。原来只查「停止原因」+「报告已生成」，
            # 于是每轮 exit 1、指标全空，只要写出报告就照样 done——实测 voyage
            # 6c5df454 三轮里两轮失败仍宣告完成，还产出了一份基于空数据的报告。
            # 「跑完了」不等于「有结果」，完成标准必须要求后者。
            {"kind": "min_count", "field": "iterate.primary_metric_runs", "value": 1},
            {"kind": "artifact_exists", "key": "iterate.stopped_reason"},
            {"kind": "artifact_exists", "key": "report_done"},
        ]
```

</details>

**依据 3 · 源码核查**：[src/backend/app/services/ai_evidence_context.py:20-47](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/services/ai_evidence_context.py#L20-L47)

现有文献版本/句子manifest范围，不泛称全库无来源机制。

<details>
<summary>查看原文（28行）</summary>

```text
    r"(?:\[EVIDENCE\s+p=(\d+):s=(\d+)\]|\[文(\d+)[·.。]句(\d+)\])",
    re.IGNORECASE,
)
_TARGET_KINDS = frozenset(
    {"idea_forge", "idea_review", "experiment", "paper_writing", "paper_review", "presentation"}
)
_MANIFEST_RE = re.compile(r"\n?<!-- polaris-ai-evidence:(\{.*?\}) -->\s*$", re.DOTALL)
_SECTION_ORDER = ("methods", "experiments", "results", "discussion", "background", "other")
_SECTION_TERMS: dict[str, tuple[str, ...]] = {
    "methods": ("method", "methodology", "approach", "model", "方法", "模型"),
    "experiments": ("experiment", "setup", "dataset", "implementation", "实验", "数据集"),
    "results": ("result", "evaluation", "finding", "结果", "评估", "性能"),
    "discussion": ("discussion", "limitation", "conclusion", "future", "讨论", "局限", "结论"),
    "background": ("abstract", "introduction", "background", "摘要", "引言", "背景"),
}
_ARTIFACT_REF_FIELDS = (
    "article_no",
    "sentence_no",
    "paper_id",
    "content_version_id",
    "chunk_id",
    "anchor_id",
    "href",
    "page_start",
    "page_end",
    "source",
    "parser",
)
```

</details>

**依据 4 · 源码核查**：[src/backend/app/agents/voyage/actions_experiment.py:1550-1576](https://github.com/ZJU-REAL/Polaris/blob/09005681bdbd03d7771c690e5f5431c864a8e707/src/backend/app/agents/voyage/actions_experiment.py#L1550-L1576)

当前有限值/日志协议与独立评测来源的区别。

<details>
<summary>查看原文（27行）</summary>

```text
def parse_metric_lines(text: str) -> list[dict[str, Any]]:
    """解析日志中的 ``POLARIS_METRIC {json}`` 行 → [{name, step, value}]。

    非有限值（NaN/Inf）跳过——它们进不了 JSONB，见 :func:`_is_storable_number`。
    """
    points: list[dict[str, Any]] = []
    for line in text.splitlines():
        m = METRIC_LINE_RE.search(line)
        if not m:
            continue
        try:
            data = json.loads(m.group(1))
        except json.JSONDecodeError:
            continue
        name = data.get("name") if isinstance(data, dict) else None
        value = data.get("value") if isinstance(data, dict) else None
        if not isinstance(name, str) or not _is_storable_number(value):
            continue
        step = data.get("step")
        points.append(
            {
                "name": name,
                "step": int(step) if isinstance(step, int | float) else None,
                "value": float(value),
            }
        )
    return points
```

</details>

#### 缺口

- 无真实科研采用对照/独立评测维护成本、协议可固定性与继续使用意愿验证。
  **影响**：只能受控试用，独立生产插件价值仍为假说，不能以源复杂/工作流完整充当投资依据。
  **进一步探讨**：先选能独立复算的少数任务/维护者，固定错误和总投入门槛；不可固定/不获净益就停独立产品。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
