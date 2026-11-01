# helm-d

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e5a68f8](https://github.com/ADWMC/helm-d/tree/e5a68f88a6017dd1bb393e2d020c2c1bf091154c)

<!-- BEGIN META -->
[![GitHub ★ 933](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=933&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ADWMC/helm-d)
<!-- END META -->

> **功能**：面向 DeepSeek Harness 的安全分析工具与案卷项目。

> **亮点**：[Q01](#research-q01) 作者描述集中工具和案卷；[Q02](#research-q02) 根项目维护版本和发布包检查。

> **主要限制**：[Q03](#research-q03) 文档的引用门禁声明不证明实现或结论真实性；[Q04](#research-q04) 目标授权与供应链仍需独立确认。

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
  - [Q01 · 案卷化安全分析相比独立工具及手工记录的用途是什么？](#detail-section-11)
  - [Q02 · 根目录怎样约束版本、构建和发布包检查？](#detail-section-12)
  - [Q03 · 证据链和复现约束的文档承诺有哪些边界？](#detail-section-13)
  - [Q04 · 采用的授权、宿主、供应链和人工审查成本是什么？](#detail-section-14)
  - [Q05 · 可复核的发行收据能否补足现有包检查？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：授权安全评估中需要记录分析工具输出和结论。

安全人员可独立使用工具并手工维护证据及结论。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 安全分析工具 | 支持授权评估 | 具体子组件实现未查 |
| 案卷 | 将分析结果与结论关联 | 文档声明不等于结果真实性 |
| 发布检查 | 检查包内容与载荷 | 检查脚本本轮未执行 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| 授权范围 | 必需 | 明确评估对象 | 不接触真实资产 |
| DSH 与 Node | 使用插件需要 | 运行宿主和插件 | 兼容未经确认时停止 |
| release 或源码包 | 必需 | 分发插件 | 来源或摘要不明时停止 |
| 领域工具 | 依具体任务 | 提供分析能力 | 自行审查与安装 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 使用者确认授权与隔离 | 范围不明不执行 |
| 校验 | 使用者核实版本和资产来源 | 摘要不符停止 |
| 分析 | 使用者按文档建立案卷并核查工具输出 | 不把引用本身当事实 |
| 复核 | 人工检查原始证据、复现与敏感数据 | 证据不足保留未知 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 准备 | 安装和计算资源未知 | 授权、来源和环境核验 | 宿主兼容未测 |
| 分析 | 具体外部工具成本未知 | 数据整理和结果复核 | 工具质量需单独审查 |
| 留存 | 案卷存储及访问控制成本未知 | 脱敏和保管 | 可能含敏感样本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 发包检查 | 源码比较文件和封装载荷 | 实际 release 是否通过 |
| 案卷 | 文档声明引用和复现要求 | 子组件运行实现与结果质量 |
| 版本管理 | 工作区指定依赖队列 | 所有宿主兼容 |

> **思考**：[Q03](#research-q03) 文档的引用门禁声明不证明实现或结论真实性；[Q04](#research-q04) 目标授权与供应链仍需独立确认。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 作者描述集中工具和案卷；[Q02](#research-q02) 根项目维护版本和发布包检查。

[Q02](#research-q02) 根目录的 test:pack 是独立入口，不能从 check 推断已运行。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 文档的引用门禁声明不证明实现或结论真实性；[Q04](#research-q04) 目标授权与供应链仍需独立确认。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先确认授权和包来源，在隔离环境测试后再考虑接入；保持原始证据和敏感数据访问控制。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已查根目录文档和发行检查脚本代表路径，未运行目标或查独立子组件实现。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、pnpm-workspace.yaml、scripts/verify-pack.mjs、SECURITY.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅静态检查根 README、根包清单、workspace 配置、打包检查和安全文档；不读取独立子组件源码，不执行目标、构建、网络、安全工具或样本。
- 下一步：[Q05](#research-q05) 应先查当前 release，再对机器可读发行收据做资产错配对照。

**分析版本**

- **仓库**：[ADWMC/helm-d](https://github.com/ADWMC/helm-d)
- **版本号**：未声明（[固定提交 e5a68f8](https://github.com/ADWMC/helm-d/tree/e5a68f88a6017dd1bb393e2d020c2c1bf091154c)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设将固定提交、构建及资产摘要绑定为可验证发行收据可减少错配；未验证。

[Q05](#research-q05) 应先查当前 release，再对机器可读发行收据做资产错配对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 626 | 148406 | — | — | 909894 |
| .ts | source | 56 | 7943 | 6444 | 983 | — |
| .js | source | 13 | 3403 | 2642 | 548 | — |
| .mjs | source | 40 | 4224 | 3325 | 515 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/ADWMC/helm-d/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根项目发行编排、安全分析声明和供应链边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 案卷化安全分析相比独立工具及手工记录的用途是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:48-57 将项目描述为 DSH 安全分析插件，提供领域工具、参考资料及案卷证据入口；相对独立调用工具并手写记录，声明的增量是集中工具和把结果与结论关联。此处为根 README 的作者声明；是否能正确定位问题、覆盖六个领域或实际节时需独立验证。用途限定在自有或已授权资产，不能把产品入口当目标授权或漏洞真实性证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:48-57](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/README.md#L48-L57)

作者描述安全分析工具和证据链。

<details>
<summary>查看原文（10行）</summary>

```text
## 它是什么

helm-d 是 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的插件，不修改宿主二进制，通过 cordis 钩子给模型加四样东西：

- **33 个工具**：Android / Web / Native / Protocol / Malware / AI-Security，加上 Case 生命周期、路由与工具账本。
- **证据链**：工具输出自动落 `evidence/`，结论必须引用 E 编号和可复现的 `repro_cmd`。
- **按需知识**：362 篇参考文档由 `read_reference` 读取，不塞进 system prompt。
- **三档破甲**：core / stealth / redteam-max，工作台一键热切换，下一次模型调用生效。

它 **不是** 引擎补丁：不落盘改审批/沙箱，也不起独立进程。和补丁类工具可以同装，分工不同。
```

</details>

**依据 2 · 作者声明**：[README.md:74-92](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/README.md#L74-L92)

作者描述案卷流程及限制。

<details>
<summary>查看原文（19行）</summary>

````text
## 5 分钟上手

1. 新建 DSH 会话，把 Agent 预设切到 **helmd**。
2. 发送 `helmd` 激活。
3. 先做一个读文件/列目录动作。首轮只暴露 `shell + read`，下一轮 33 个工具（含 `begin_case`）才会出现——这是宿主晋升机制，不是插件坏了。
4. 直接下任务，例如：

   > 分析 `samples/app.apk` 的加固方式，建 case、收集证据，最后给出带 `repro_cmd` 的结论。

5. 需要结构化结论时，让模型走 Case 流程：

```text
begin_case(goal, samples)
  → 工具输出自动写入 evidence/（E-001、E-002…）
  → record_finding(title, detail, evidence_ids, repro_cmd)
  → end_case(summary)
```

引用不存在的 E 编号会被拒绝；`repro_cmd` 是必填项，没有可复现命令的结论不算结论。
````

</details>

#### 缺口

- 未执行真实任务与对照
  **影响**：声明不能证明分析质量或节时
  **进一步探讨**：用授权且可复现样本与手工案卷比较。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 根目录怎样约束版本、构建和发布包检查？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

package.json:5-12 定义递归构建、类型检查、测试和独立 test:pack；18-20 指定 pnpm 和 Node 范围。pnpm-workspace.yaml:38-55 注释说明开发测试版本队列并设置部分覆盖。verify-pack.mjs:144-161 比较预期文件和实际文件并拒绝禁止路径，175-200 检查封装载荷与生成 patch；这是检查脚本的静态逻辑，非本轮运行结果。尤其根 check 未包含 test:pack，不能从 check 命令名称推断包检查已执行。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:5-12](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/package.json#L5-L12)

构建、测试和包检查入口。

```text
  "scripts": {
    "build": "pnpm -r build",
    "typecheck": "pnpm -r exec tsc -p tsconfig.json --noEmit",
    "test": "pnpm build && pnpm test:checks",
    "test:preset": "node scripts/test-gen-preset.mjs",
    "test:checks": "node scripts/checks/run-all.mjs",
    "test:pack": "node scripts/verify-pack.mjs",
    "check": "pnpm build && pnpm typecheck && pnpm test:checks"
```

**依据 2 · 源码核查**：[package.json:18-20](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/package.json#L18-L20)

包管理器和 Node 版本。

```text
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": ">=22.19.0"
```

**依据 3 · 源码核查**：[pnpm-workspace.yaml:38-55](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/pnpm-workspace.yaml#L38-L55)

版本队列与 overrides。

<details>
<summary>查看原文（18行）</summary>

```text
# Dev/test cohort pinned to the target host: dsh 0.2.1-rc.2 vendors every
# @deepseek-ai/dsh-* package at 0.2.1-rc.2 with cordis 4.0.4 and schemastery 3.18.4
# (verified against the registry manifests).
#
# 0.2.0 notes (DSH-0.2.0-RC1-01):
#   * peer ranges must admit the 0.2 prerelease tuple explicitly — `^0.2.0` refuses
#     `0.2.1-rc.2` (semver: 0.2.1-rc.2 < 0.2.0). Published peers use
#     `>=0.1.5-rc.1 <0.2.0-0 || ^0.2.0-rc.1`.
#   * `@deepseek-ai/dsh-code-runtime` stops at 0.1.5-rc.3; the 0.2 family renames it
#     to `@deepseek-ai/dsh-ptc-runtime` (dsh-tools peers on ptc-runtime).
#   * dsh-tools/dsh-settings pull their siblings as auto-installed peers, which pnpm
#     otherwise resolves across cohorts, so the whole family is nailed down here.
overrides:
  "@deepseek-ai/cordis": 4.0.4
  "@deepseek-ai/cordis-plugin-group": 1.0.5
  "@deepseek-ai/cordis-plugin-include": 1.0.10
  "@deepseek-ai/schemastery": 3.18.4
  "@deepseek-ai/dsh-agent": 0.2.1-rc.2
```

</details>

**依据 4 · 源码核查**：[scripts/verify-pack.mjs:144-161](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/scripts/verify-pack.mjs#L144-L161)

比对文件清单与禁止路径。

<details>
<summary>查看原文（18行）</summary>

```text
  const manifest = JSON.parse(plain)
  return new Set(Object.keys(manifest.files ?? {}))
}

function verify(pkg, source) {
  const got = new Set(pkg.files)
  const missing = [...EXPECTED].filter((f) => !got.has(f))
  const unexpected = [...got].filter((f) => !EXPECTED.has(f))

  if (missing.length > 0) fail(`${source}: missing ${missing.join(', ')}`)
  if (unexpected.length > 0) fail(`${source}: unexpected ${unexpected.join(', ')}`)

  for (const file of got) {
    if (FORBIDDEN_PREFIXES.some((prefix) => file.startsWith(prefix))) {
      fail(`${source}: forbidden path ${file}`)
    }
    if (FORBIDDEN_FILES.has(file) || file.endsWith('.map')) {
      fail(`${source}: forbidden file ${file}`)
```

</details>

**依据 5 · 源码核查**：[scripts/verify-pack.mjs:175-200](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/scripts/verify-pack.mjs#L175-L200)

检查载荷及生成 patch。

<details>
<summary>查看原文（26行）</summary>

```text
  let sealedCount = 0
  if (got.has('payload.dat')) {
    let sealed = new Set()
    try {
      sealed = payloadFiles(pkg)
    } catch (error) {
      fail(`${source}: payload.dat cannot be unsealed (${error.message})`)
    }
    sealedCount = sealed.size
    for (const rel of ['.real/health.js', '.real/index.js', ...SEALED_SCRIPTS]) {
      if (!sealed.has(rel)) fail(`${source}: payload.dat is missing ${rel}`)
    }
  }

  if (got.has('preset.generated.patch.yml')) {
    const preset = pkg.read('preset.generated.patch.yml')
    if (!/^# gen-preset: host=[0-9a-f]{64}/m.test(preset)) {
      fail(`${source}: preset.generated.patch.yml has no host fingerprint header`)
    }
    for (const marker of PERSONA_LEAK_MARKERS) {
      if (preset.includes(marker)) fail(`${source}: persona plaintext leaked into preset patch ("${marker}")`)
    }
  }

  for (const rel of ['client.js', 'cordis.patch.yml']) {
    if (got.has(rel) && pkg.size(rel) === 0) fail(`${source}: ${rel} is empty`)
```

</details>

#### 缺口

- 未执行构建、测试或包验证
  **影响**：无法推断发布包通过或宿主兼容
  **进一步探讨**：隔离环境对指定 release 单独验证并留存结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 证据链和复现约束的文档承诺有哪些边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

README:83-92 描述 begin_case、工具输出关联 E 编号、record_finding 必填复现命令及 end_case，并声称不存在编号会被拒绝。该根报告没有检查独立 packages/helmd 组件的实现，不将文档声明当执行证据；即使引用存在，仍需核对原始输出、目标范围、命令适用性、敏感数据和结论推理，引用本身不能证明命令曾运行或结论真实。SECURITY.md:25-34 提醒本地案卷和日志可能含敏感样本或提示词。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:83-92](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/README.md#L83-L92)

作者描述引用和复现门禁。

<details>
<summary>查看原文（10行）</summary>

````text
5. 需要结构化结论时，让模型走 Case 流程：

```text
begin_case(goal, samples)
  → 工具输出自动写入 evidence/（E-001、E-002…）
  → record_finding(title, detail, evidence_ids, repro_cmd)
  → end_case(summary)
```

引用不存在的 E 编号会被拒绝；`repro_cmd` 是必填项，没有可复现命令的结论不算结论。
````

</details>

**依据 2 · 作者声明**：[SECURITY.md:25-34](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/SECURITY.md#L25-L34)

本地案卷与日志敏感数据提醒。

<details>
<summary>查看原文（10行）</summary>

```text
## 4. 本地数据

| 路径 | 内容 | 建议 |
|---|---|---|
| `~/.dsh/storages/helmd/gate-state.json` | star 状态 / login | 可删除以重置门禁 |
| `~/.dsh/storages/helmd/gate-code.txt` | 一次性设备码 | 会话结束应清理 |
| `~/.dsh/helmd-tools/` | 工具账本 / dead-end / 模型评测 JSONL | 可能含目标信息，勿提交 |
| `~/.dsh/helmd-stream-intercept.log` | 拦截计数与拒绝摘录 | 可能含提示词片段，勿公开 |
| `helmd-cases/` | 样本、证据、CASE.md | 可能含敏感样本，勿提交 |
| `cookie.txt` | 本地 dsh 认证 cookie（已 gitignore） | 不要打包/共享 |
```

</details>

#### 缺口

- 本项未读取独立子组件实现或执行案卷
  **影响**：文档不能证明门禁及因果真实性
  **进一步探讨**：独立组件研究应追踪入链、校验和持久化并固定版本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用的授权、宿主、供应链和人工审查成本是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

README:59-68 要求 Node 和 DSH 并建议版本化 release URL；README:180-186 声称 DSH 0.2.x 并以 0.2.1-rc.2 验证；package.json:18-20 同样声明 Node 下限。SECURITY.md:36-47 要求使用者审查第三方工具并建议核对资产哈希，提醒第三方和宿主安全不在范围；当地授权、敏感样本保管、工具安装与人工复核均有成本。版本化 URL 不证明包是可信构建。缺授权、哈希来源不可信或宿主兼容无法确认时不接入真实资产。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:59-68](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/README.md#L59-L68)

固定版本安装与 Node 前提。

<details>
<summary>查看原文（10行）</summary>

````text
## 安装

**前提**：Node >= 22.19，已安装 [`dsh`](https://github.com/deepseek-ai/deepseek-harness) CLI。

```bash
dsh plugin --profile web add https://github.com/ADWMC/helm-d/releases/download/v0.5.2/helm-d.tgz
dsh web
```

> 安装/更新请使用带 `vX.Y.Z` 的版本化 URL。`releases/latest/download/*` 是滚动地址，写进 profile 依赖后，下次发版会让 pnpm lockfile 的 sha512 失配（`ERR_PNPM_TARBALL_INTEGRITY`）。遇到见 [安装故障排查](docs/install-troubleshooting.md)。
````

</details>

**依据 2 · 作者声明**：[README.md:180-186](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/README.md#L180-L186)

作者陈述宿主与平台范围。

```text
## 兼容性、更新与卸载

| 项 | 要求 |
|---|---|
| DSH | 0.2.x（本版在 `0.2.1-rc.2` 验证） |
| Node | `>= 22.19.0` |
| 平台 | Windows 用 `pwsh`；Linux / macOS 用 `bash`；WSL 通过 `wsl.exe` |
```

**依据 3 · 源码核查**：[package.json:18-20](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/package.json#L18-L20)

Node 与 pnpm 要求。

```text
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": ">=22.19.0"
```

**依据 4 · 作者声明**：[SECURITY.md:36-47](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/SECURITY.md#L36-L47)

供应链与责任边界。

<details>
<summary>查看原文（12行）</summary>

```text
## 5. 供应链

- 从 GitHub Releases 下载时，优先核对发布资产的 SHA-256；当前发布资产是 3 个 tgz（版本化 tgz + `helm-d.tgz` + `helmd.tgz`）。
- 需要可审计时，从源码构建：`pnpm install && pnpm build && .\scripts\repack.ps1`，并对比 `payload.dat` / `references.dat` 的哈希。
- 发布者应保留构建环境、版本与命令记录；建议后续给 release 增加 `SHA256SUMS` 与 npm provenance。
- 安装第三方工具（`find_tool` / `references/` 指向的仓库）前自行审查；helm-d 不保证第三方工具的安全性。

## 6. 不在范围内

- 第三方工具、样本、references 中描述的攻击手法本身。
- 因用户未授权使用、违反所在地法律或超出授权范围产生的后果。
- 宿主（dsh）自身的安全问题；请向对应项目报告。
```

</details>

#### 缺口

- 未验证 release 哈希或目标授权
  **影响**：不能证明发布包安全、兼容或实际成本
  **进一步探讨**：隔离环境核对独立可信哈希和授权后试用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可复核的发行收据能否补足现有包检查？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 verify-pack.mjs 已校验文件集合、禁止路径、载荷和 patch；SECURITY.md:36-40 已建议保留构建环境、命令和 SHA256SUMS。新增设想不是重复散列：将固定源码提交、构建环境、检查命令及结果、各资产摘要和可验证签名关联为机器可读发行收据，并允许复核者将其和下载物独立比对；签名、构建来源与通过验证仍不能证明运行逻辑安全。对照现有检查和发布说明，以伪造哈希、替换资产、遗漏测试、构建版本不符与泄露信息为案例，测错配检出率和复核成本；若不能独立验证来源、未比现状发现更多错配或泄漏敏感信息则否定。须先核当前 release 是否已有等价收据。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/verify-pack.mjs:144-161](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/scripts/verify-pack.mjs#L144-L161)

已有文件集与禁止路径检查。

<details>
<summary>查看原文（18行）</summary>

```text
  const manifest = JSON.parse(plain)
  return new Set(Object.keys(manifest.files ?? {}))
}

function verify(pkg, source) {
  const got = new Set(pkg.files)
  const missing = [...EXPECTED].filter((f) => !got.has(f))
  const unexpected = [...got].filter((f) => !EXPECTED.has(f))

  if (missing.length > 0) fail(`${source}: missing ${missing.join(', ')}`)
  if (unexpected.length > 0) fail(`${source}: unexpected ${unexpected.join(', ')}`)

  for (const file of got) {
    if (FORBIDDEN_PREFIXES.some((prefix) => file.startsWith(prefix))) {
      fail(`${source}: forbidden path ${file}`)
    }
    if (FORBIDDEN_FILES.has(file) || file.endsWith('.map')) {
      fail(`${source}: forbidden file ${file}`)
```

</details>

**依据 2 · 源码核查**：[scripts/verify-pack.mjs:175-200](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/scripts/verify-pack.mjs#L175-L200)

已有载荷与 patch 检查。

<details>
<summary>查看原文（26行）</summary>

```text
  let sealedCount = 0
  if (got.has('payload.dat')) {
    let sealed = new Set()
    try {
      sealed = payloadFiles(pkg)
    } catch (error) {
      fail(`${source}: payload.dat cannot be unsealed (${error.message})`)
    }
    sealedCount = sealed.size
    for (const rel of ['.real/health.js', '.real/index.js', ...SEALED_SCRIPTS]) {
      if (!sealed.has(rel)) fail(`${source}: payload.dat is missing ${rel}`)
    }
  }

  if (got.has('preset.generated.patch.yml')) {
    const preset = pkg.read('preset.generated.patch.yml')
    if (!/^# gen-preset: host=[0-9a-f]{64}/m.test(preset)) {
      fail(`${source}: preset.generated.patch.yml has no host fingerprint header`)
    }
    for (const marker of PERSONA_LEAK_MARKERS) {
      if (preset.includes(marker)) fail(`${source}: persona plaintext leaked into preset patch ("${marker}")`)
    }
  }

  for (const rel of ['client.js', 'cordis.patch.yml']) {
    if (got.has(rel) && pkg.size(rel) === 0) fail(`${source}: ${rel} is empty`)
```

</details>

**依据 3 · 作者声明**：[SECURITY.md:36-40](https://github.com/ADWMC/helm-d/blob/e5a68f88a6017dd1bb393e2d020c2c1bf091154c/SECURITY.md#L36-L40)

已有哈希和构建记录建议。

```text
## 5. 供应链

- 从 GitHub Releases 下载时，优先核对发布资产的 SHA-256；当前发布资产是 3 个 tgz（版本化 tgz + `helm-d.tgz` + `helmd.tgz`）。
- 需要可审计时，从源码构建：`pnpm install && pnpm build && .\scripts\repack.ps1`，并对比 `payload.dat` / `references.dat` 的哈希。
- 发布者应保留构建环境、版本与命令记录；建议后续给 release 增加 `SHA256SUMS` 与 npm provenance。
```

#### 缺口

- 未查询实际 release 是否已有同等材料
  **影响**：新增性与收益均未实证
  **进一步探讨**：先对照固定 release，再做错误注入和独立复核。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
