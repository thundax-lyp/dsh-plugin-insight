# easyeda-agent

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d93d3dd](https://github.com/zhoushoujianwork/easyeda-agent/tree/d93d3dd94edd1890557c5b3a5f61756a8d5fef83)

<!-- BEGIN META -->
[![GitHub ★ 837](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=837&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhoushoujianwork/easyeda-agent)
<!-- END META -->

> **功能**：通过 CLI、MCP 和 Skill 连接 EasyEDA Pro，读取工程并执行原理图及 PCB 操作。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明价值是把类型化EDA动作、真实文档身份和知识流程接到Agent，避免只凭截图操作；根DSH入口为空，贡献不能夸成新EDA算法或自主生产整板。

> **主要限制**：[Q03](#research-q03) 明确CLI超时不代表EDA没修改，handler晚到效果须回读核对；动作成功和局部DRC也不等于电气及制造全部合格。因此只能由工程师监督，不能盲重试或无人值守出板。

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
  - [Q01 · 配置包和EDA自动化层分别贡献什么？](#detail-section-11)
  - [Q02 · MCP如何确定动作、文档并执行CLI？](#detail-section-12)
  - [Q03 · 超时等于没修改吗，检查通过等于可生产吗？](#detail-section-13)
  - [Q04 · 谁可以在什么成本条件下试用？](#detail-section-14)
  - [Q05 · 晚到修改的状态核对能否降低误重试？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：能核对电路与规则的工程师，可在工程副本先读取和诊断，再试有限可回退操作。

工程师手工EDA操作及通用截图自动化是参照；项目可改善操作可追踪性，专业判断和官方API贡献不归DSH空入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 动作发现 | 检索CLI支持的领域操作 | CLI启动及目录成功 |
| 工程动作 | 带project/doc或window执行 | 实际EDA/connector，需专业复核 |
| workflow | 检查或推进设计流程状态 | 不等同整板生产合格 |
| Skill | 指导规格与回读流程 | 知识提示不代替执行约束 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH MCP/Skill与Node | DSH必需 | 启动工具知识入口 | 无法注册 |
| easyeda CLI/daemon | 是 | 动作目录和通信 | MCP启动失败 |
| EasyEDA Pro/connector | 工程操作必需 | 官方API实际操作 | 无窗口可用 |
| 专业复核与备份 | 写入必需 | 引脚、几何和制造判断 | 停在只读 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 工程师建立副本并接CLI/connector | health列出正确window |
| 读取 | 核对project/doc与动作 | 不凭截图猜身份 |
| 小写 | 试可回退操作并回读 | 检查身份/几何/保存 |
| 异常 | 只读核对未知结果 | 不重发写入，人工恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | EDA/CLI/daemon及模型资源未知 | 多层接线、备份副本 | 需专业环境 |
| 持续 | 模型费用未知 | 手册、引脚、DRC与保存复核 | 不以动作数算收益 |
| 恢复 | 重复写入可能增加修正代价 | 等待晚到动作、只读核对与备份 | 超时不等于没执行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 接线 | MCP动态目录与CLI调用 | 实际EDA兼容 |
| 目标与恢复 | 目标参数/FIFO/abandoned语义 | 所有动作故障一致性 |
| 工程结果 | 有回读与专业检查流程 | 电气/制造合格率、节时和成本 |

> **思考**：[Q03](#research-q03) 明确CLI超时不代表EDA没修改，handler晚到效果须回读核对；动作成功和局部DRC也不等于电气及制造全部合格。因此只能由工程师监督，不能盲重试或无人值守出板。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 表明价值是把类型化EDA动作、真实文档身份和知识流程接到Agent，避免只凭截图操作；根DSH入口为空，贡献不能夸成新EDA算法或自主生产整板。

[Q03](#research-q03)对“放弃等待”和“取消执行”明确区分，是可借鉴的异步写机制；[Q02](#research-q02)固定动作目录和目标要求比任意命令更可审阅。移植需保留实际领域身份、晚到副作用和专业验收，不能只复制MCP schema。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 明确CLI超时不代表EDA没修改，handler晚到效果须回读核对；动作成功和局部DRC也不等于电气及制造全部合格。因此只能由工程师监督，不能盲重试或无人值守出板。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在备份工程副本中先确认health、window/project/doc和只读动作，再试小范围操作并回读。ACTION_ABANDONED或引脚/保存状态不清立即停写，等待并人工核对；不靠重复执行解决未知结果，不将局部检查当生产许可。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查DSH/MCP接线、目标参数和连接器未知副作用处理，未运行EasyEDA或目标测试；电气/制造效果未验收，恢复核对设计未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、cordis.patch.yml、mcp/src/core.mjs、mcp/src/server.mjs、extension/src/transport.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定DSH配置、MCP/CLI参数和连接器FIFO响应源码级核查，不覆盖全部Go CLI与EDA领域动作；未运行目标代码或硬件验收。
- 下一步：在非生产工程副本对身份切换、延迟写入和超时回读逐项核查，再比较人工修正与恢复时间；本轮不执行EDA或制造实验。

**分析版本**

- **仓库**：[zhoushoujianwork/easyeda-agent](https://github.com/zhoushoujianwork/easyeda-agent)
- **版本号**：1.13.1（[固定提交 d93d3dd](https://github.com/zhoushoujianwork/easyeda-agent/tree/d93d3dd94edd1890557c5b3a5f61756a8d5fef83)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出基于已有abandoned/mutationContext的只读恢复核对假设，先排除CLI与Skill已等价实现，再比较延迟动作的重复修改和恢复时间；不能确定时保持未知。

在非生产工程副本对身份切换、延迟写入和超时回读逐项核查，再比较人工修正与恢复时间；本轮不执行EDA或制造实验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 186 | 25621 | — | — | 476148 |
| .md | example | 15 | 1902 | — | — | 32106 |
| .js | source | 5 | 292 | 241 | 49 | — |
| .ts | source | 37 | 22883 | 17613 | 4179 | — |
| .mjs | source | 5 | 591 | 507 | 47 | — |
| .ts | test | 55 | 13495 | 12034 | 519 | — |
| .mjs | test | 4 | 373 | 329 | 23 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/zhoushoujianwork/easyeda-agent/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=10&color=737b86&logo=github)](https://github.com/zhoushoujianwork/easyeda-agent/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 24](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=24&color=737b86&logo=github)](https://github.com/zhoushoujianwork/easyeda-agent/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH配置包怎样接入真实EDA工程，类型化动作和未知写结果处理支持怎样的工程师试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 配置包和EDA自动化层分别贡献什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向能核对电路、器件和制造规则的工程师，任务包括库资料整理、原理图诊断、布局与丝印操作；合格结果应是回读一致且由工程师确认的工程，不能只看截图。仓库提供EasyEDA Pro自动化层，DSH根入口实际apply为空，patch才注册MCP与独立Skill目录。因此DSH包贡献是把现有CLI和专业知识流程接入Agent，不把eda官方API或所有电路算法算为根入口创新。相对按截图指导Agent点击，类型化动作与真实工程回读有更可追踪输入，但作者案例不证明任意电路可生产。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-38](https://github.com/zhoushoujianwork/easyeda-agent/blob/d93d3dd94edd1890557c5b3a5f61756a8d5fef83/README.md#L21-L38)

目标工程任务、官方API与回读主张。

<details>
<summary>查看原文（18行）</summary>

```text
`easyeda-agent` 是 EasyEDA Pro（嘉立创 EDA 专业版）的 AI 自动化层。你可以直接描述想做的
电路或要修的问题，Agent 会读取真实工程数据，通过官方 `eda.*` API 完成操作，并在写入前后
检查器件身份、引脚网络、几何、DRC 和保存状态。

## 它能做什么

| 使用场景 | 能力 |
|---|---|
| **拿 PDF / 尺寸图建库** | 读取型号、引脚和封装证据，创建 Symbol、Footprint、Device 和可选 3D Model；校验来源、焊盘依据和 pin↔pad 映射。[实战：AS07 私有库与框外丝印](docs/examples/as07-m1101d-sma/README.md) |
| **从需求做到一块板** | 从自然语言需求完成选型、原理图、分区布局、PCB、板框、叠层、布线、铺铜、丝印、DRC 和制造检查 |
| **原理图器件标准化** | 用 LCSC C 号或准确型号替换非标准器件，保留位号、位置和 PCB 同步身份；报告引脚差异并指导重新接线 |
| **原理图整理与修复** | 读取完整连接图，检查悬空、短路、跨页网名、NC、位号和模块归属，重新排版并回读验证 |
| **PCB 布局与布线** | 模块感知自动布局、板框贴合、规则感知短线布线、过孔、铺铜、4 层电源平面、天线 keepout |
| **丝印调整** | 自动避开焊盘、器件体、禁区、板框和其他标签；添加板注、接口名、LED 极性及 SVG Logo |
| **复用成熟电路** | 从内置电路块库复用 CH340、ESP32 自动下载、按键、USB Hub、降压等拓扑，放件、连线并对账 |
| **检查与交付** | 原理图连接与几何检查、PCB DRC/DFM、BOM、网表、制造文件、截图、审计日志和显式保存 |

当前可用范围与检查进度见 [CLI Status](docs/cli-STATUS.md)，完整能力见 [功能清单](docs/FEATURES.md)，命令索引见
```

</details>

**依据 2 · 源码核查**：[index.js:1-7](https://github.com/zhoushoujianwork/easyeda-agent/blob/d93d3dd94edd1890557c5b3a5f61756a8d5fef83/index.js#L1-L7)

入口为空，注册职责由patch承担。

```text
'use strict';

// DSH installers resolve the package entry even for a configuration-only bundle.
// MCP and Skill registration belongs to cordis.patch.yml; loading this entry
// must not start another server or register duplicate providers.
exports.name = 'easyeda-agent-dsh';
exports.apply = function apply() {};
```

**依据 3 · 源码核查**：[cordis.patch.yml:20-38](https://github.com/zhoushoujianwork/easyeda-agent/blob/d93d3dd94edd1890557c5b3a5f61756a8d5fef83/cordis.patch.yml#L20-L38)

stdio MCP和隔离Skill目录真实接线。

<details>
<summary>查看原文（19行）</summary>

```text
- insert:
    - id: easyeda-mcp
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: easyeda
        transport: stdio
        command: node
        args:
          - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('node_modules/easyeda-agent-dsh/mcp/src/server.mjs', baseUrl))"
        env:
          EASYEDA_BIN: !!js "process.env.EASYEDA_BIN || 'easyeda'"

    - id: easyeda-skill-fs
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: easyeda
        includeDefaultRoots: false
        customSkillDirs:
          - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('node_modules/easyeda-agent-dsh/.agents/skills/easyeda-agent', baseUrl))"
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · MCP如何确定动作、文档并执行CLI？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

MCP启动先执行easyeda actions拿动作目录，失败或非数组就退出；按domain过滤生成工具，调用时再检查动作确属该domain，然后buildActionCallArgs传给execFile。普通写动作必须有project和doc；新建项目要求明确window，项目open/export必须window与UUID，open显式承认可能丢弃未保存内容。execFile使用argv而非shell，默认五分钟、32MiB缓冲，成功解析JSON或文本并转MCP结果；非零/超时保留stdout/stderr而非假成功。需要另行可用的Go easyeda CLI、daemon、EDA连接器和Pro环境，DSH包不会凭空安装完整专业环境。

#### 证据与依据

**依据 1 · 源码核查**：[mcp/src/server.mjs:20-26](https://github.com/zhoushoujianwork/easyeda-agent/blob/d93d3dd94edd1890557c5b3a5f61756a8d5fef83/mcp/src/server.mjs#L20-L26)

动作目录是启动前置，动态来源失败就退出。

```text
const catalogExecution = await runEasyeda(['actions'], 30_000);
if (!catalogExecution.ok || !Array.isArray(catalogExecution.result)) {
  process.stderr.write(`easyeda-agent-mcp: cannot load action catalog: ${JSON.stringify(catalogExecution)}\n`);
  process.exit(1);
}
const actions = catalogExecution.result.filter((action) => DOMAIN_NAMES.includes(action.domain));
const byName = new Map(actions.map((action) => [action.name, action]));
```

**依据 2 · 源码核查**：[mcp/src/server.mjs:181-206](https://github.com/zhoushoujianwork/easyeda-agent/blob/d93d3dd94edd1890557c5b3a5f61756a8d5fef83/mcp/src/server.mjs#L181-L206)

真实工具调用到core与错误结果。

<details>
<summary>查看原文（26行）</summary>

```text
    if (name === 'easyeda_health') {
      return toMcpResult(await runEasyeda(['daemon', 'health'], 30_000));
    }
    if (name === 'easyeda_actions') {
      const filtered = filterActions(actions, input);
      return toMcpResult({ ok: true, result: { count: filtered.length, actions: filtered } });
    }
    if (name === 'easyeda_blocks') {
      return toMcpResult(await runEasyeda(buildBlocksArgs(input), 30_000));
    }
    if (name === 'easyeda_workflow') {
      return toMcpResult(await runEasyeda(buildWorkflowArgs(input)));
    }
    if (name.startsWith('easyeda_')) {
      const domain = name.slice('easyeda_'.length);
      if (!DOMAIN_NAMES.includes(domain)) throw new Error(`unknown EasyEDA domain tool: ${name}`);
      const action = byName.get(input.action);
      if (!action || action.domain !== domain) {
        throw new Error(`action ${input.action || '(missing)'} does not belong to domain ${domain}`);
      }
      return toMcpResult(await runEasyeda(buildActionCallArgs(action, input)));
    }
    throw new Error(`unknown tool: ${name}`);
  }
  catch (error) {
    return toMcpResult({ ok: false, error: { message: error.message } });
```

</details>

**依据 3 · 源码核查**：[mcp/src/core.mjs:16-54](https://github.com/zhoushoujianwork/easyeda-agent/blob/d93d3dd94edd1890557c5b3a5f61756a8d5fef83/mcp/src/core.mjs#L16-L54)

CLI路径、execFile、时限、输出与错误。

<details>
<summary>查看原文（39行）</summary>

```text
export function easyedaBinary() {
  return process.env.EASYEDA_BIN || 'easyeda';
}

export async function runEasyeda(args, timeoutMs = 300_000) {
  try {
    const { stdout, stderr } = await execFileAsync(easyedaBinary(), args, {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
      timeout: timeoutMs,
    });
    return {
      ok: true,
      result: parseOutput(stdout),
      stderr: stderr.trim() || undefined,
    };
  }
  catch (error) {
    return {
      ok: false,
      error: {
        message: error.message,
        code: error.code ?? null,
        stdout: parseOutput(error.stdout || ''),
        stderr: String(error.stderr || '').trim() || undefined,
      },
    };
  }
}

export function parseOutput(stdout) {
  const text = String(stdout).trim();
  if (!text) return null;
  try {
    return JSON.parse(text);
  }
  catch {
    return text;
  }
```

</details>

**依据 4 · 源码核查**：[mcp/src/core.mjs:70-107](https://github.com/zhoushoujianwork/easyeda-agent/blob/d93d3dd94edd1890557c5b3a5f61756a8d5fef83/mcp/src/core.mjs#L70-L107)

项目/文档/window身份与显式丢弃确认。

<details>
<summary>查看原文（38行）</summary>

```text
// Project creation targets a connector window, not a document that does not exist yet.
// Project transfer uses explicit window/UUID guards; other mutations retain document pinning.
export function buildActionCallArgs(action, input = {}) {
  if (action.name === 'project.create') {
    if (typeof input.window !== 'string' || !input.window.trim()) {
      throw new Error('project.create requires an explicit window from easyeda_health');
    }
    if (input.project || input.doc) {
      throw new Error('project.create does not accept project or doc routing; use payload.friendlyName for the new project');
    }
  }
  else if (action.name === 'project.open' || action.name === 'project.export') {
    if (typeof input.window !== 'string' || !input.window.trim() || input.project || input.doc) {
      throw new Error('Project transfer requires an explicit window and payload.projectUuid; omit project/doc routing');
    }
    if (typeof input.payload?.projectUuid !== 'string' || !input.payload.projectUuid.trim()) {
      throw new Error('payload.projectUuid is required');
    }
    if (action.name === 'project.open' && input.payload.allowDiscardUnsaved !== true) {
      throw new Error('Save documents first; payload.allowDiscardUnsaved must be true');
    }
  }
  else if (action.mutates && (!input.project || !input.doc)) {
    throw new Error(`mutating action ${action.name} requires both project and doc`);
  }
  return buildCallArgs(action.name, input);
}

export function buildCallArgs(action, input = {}) {
  const args = [];
  if (input.project) args.push('--project', input.project);
  if (input.doc) args.push('--doc', input.doc);
  args.push('call', action);
  if (input.payload && Object.keys(input.payload).length > 0) {
    args.push('--payload', JSON.stringify(input.payload));
  }
  if (input.window) args.push('--window', input.window);
  return args;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 超时等于没修改吗，检查通过等于可生产吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

都不是。连接器收到request后同步入FIFO，runAction结果带context/mutationContext等元信息；abandoned明确表示不再等待，handler仍可能随后生效，对特定操作FIFO甚至保持阻塞直到真实结束，错误文案要求只做document.current诊断而不重试写入。这比普通超时直接重发更诚实。MCP层的CLI超时却只返回失败，调用者必须理解该状态不取消EDA已开始动作。作者AS07案例也明确尺寸是假设、未验证实物装配/放置/DRC，其他布局图不代表整板布线完成。不能以动作成功、分数、DRC单项或演示图推出电气与制造全部合格。

#### 证据与依据

**依据 1 · 源码核查**：[extension/src/transport.ts:1090-1148](https://github.com/zhoushoujianwork/easyeda-agent/blob/d93d3dd94edd1890557c5b3a5f61756a8d5fef83/extension/src/transport.ts#L1090-L1148)

FIFO、真实返回元信息与未知副作用响应。

<details>
<summary>查看原文（59行）</summary>

```text
async function handleRequest(request: RequestFrame): Promise<void> {
	const base = {
		type: 'response' as const,
		id: request.id,
		version: request.version ?? PROTOCOL_VERSION,
	};

	// 入队是**同步**发生的(submit 在第一个 await 之前就把任务挂上了链),
	// 所以入队顺序 === 消息到达顺序。这一点是整个 happens-before 的地基:
	// 换成先 await 再入队,FIFO 立刻退化回原来的并发。
	const outcome = await actionQueue.submit({
		id: request.id,
		timeoutMs: request.timeoutMs,
		bypass: isBypassAction(request.action),
		holdAfterAbandon: mustHoldAfterAbandon(request.action),
		run: () => runAction(request.action, request.payload),
	});

	let response: ResponseFrame;
	switch (outcome.status) {
		case 'ok': {
			const result = outcome.value;
			response = { ...base, ok: true };
			if (result.result !== undefined) {
				response.result = result.result;
			}
			if (result.context !== undefined) {
				response.context = result.context;
			}
			if (result.mutationContext !== undefined) response.mutationContext = result.mutationContext;
			if (result.mutationContextAvailable !== undefined) response.mutationContextAvailable = result.mutationContextAvailable;
			if (result.mutationContextError !== undefined) response.mutationContextError = result.mutationContextError;
			if (result.artifacts !== undefined && result.artifacts.length > 0) {
				response.artifacts = result.artifacts;
			}
			if (result.warnings !== undefined && result.warnings.length > 0) {
				response.warnings = result.warnings;
			}
			break;
		}
		case 'error':
			response = { ...base, ok: false, error: toResponseError(outcome.error) };
			break;
		case 'abandoned':
			// daemon 多半已经在 (timeoutMs - 2s) 就超时了,所以这条回执往往落不到
			// 任何等待者手上 —— 那不要紧:它的价值在于**下一条**响应上递增了的
			// seqAbandoned。措辞必须停在可证边界内:我们只知道「不再等它了」,
			// 不知道它到底做没做成。
			response = {
				...base,
				ok: false,
				error: {
					code: ErrorCodes.ACTION_ABANDONED,
					message: `action "${request.action}" response was abandoned after ${outcome.waitedMs}ms`,
					detail: mustHoldAfterAbandon(request.action)
						? 'the handler is still running; FIFO remains blocked until it actually settles. Use only document.current diagnostic reads; do not retry this write (seqAbandoned was incremented)'
						: 'the handler is still running; its effect may land later — treat any conclusion about this write as unproven (seqAbandoned was incremented)',
				},
			};
```

</details>

**依据 2 · 源码核查**：[mcp/src/core.mjs:20-42](https://github.com/zhoushoujianwork/easyeda-agent/blob/d93d3dd94edd1890557c5b3a5f61756a8d5fef83/mcp/src/core.mjs#L20-L42)

CLI超时是进程结果，不包含EDA事务回滚证明。

<details>
<summary>查看原文（23行）</summary>

```text
export async function runEasyeda(args, timeoutMs = 300_000) {
  try {
    const { stdout, stderr } = await execFileAsync(easyedaBinary(), args, {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
      timeout: timeoutMs,
    });
    return {
      ok: true,
      result: parseOutput(stdout),
      stderr: stderr.trim() || undefined,
    };
  }
  catch (error) {
    return {
      ok: false,
      error: {
        message: error.message,
        code: error.code ?? null,
        stdout: parseOutput(error.stdout || ''),
        stderr: String(error.stderr || '').trim() || undefined,
      },
    };
```

</details>

**依据 3 · 作者声明**：[README.md:99-119](https://github.com/zhoushoujianwork/easyeda-agent/blob/d93d3dd94edd1890557c5b3a5f61756a8d5fef83/README.md#L99-L119)

作者案例主动保留假设和未验收边界。

<details>
<summary>查看原文（21行）</summary>

```text
### 从模块尺寸图到个人私有库

**需求：** 按用户提供的 AS07-M1101D-SMA 尺寸与引脚图创建个人库，原理图保持双排引脚的
左右顺序；封装标注引脚名和型号，丝印全部放在模块覆盖区域外，安装后仍可查看，并收紧、对齐。

**结果：** 已创建并保存 Symbol、Footprint 和 Device，核对 8 个引脚与 8 个通孔焊盘映射；
修正符号边框闭合和引脚方向。封装左侧用两列脚号＋名称，列间距约 0.5 mm，靠框一列距框
约 0.6 mm；型号居中放在框外上方，实际文字包围盒回读无重叠。
最终按用户要求使用普通引脚线和未定义类型，1 脚使用独立圆形标记；保留用户清理 NC 后的状态。

![AS07 原理图符号：与用户引脚图一致的左右顺序](docs/examples/as07-m1101d-sma/symbol.png)

这次输入是用户尺寸图，不是完整原厂 PDF；焊盘与部分偏移采用明确假设计算。
尚未验证实物装配、放置实例和 PCB DRC，不作为生产就绪证明。
[查看原始需求图、封装预览、规格与回读结果](docs/examples/as07-m1101d-sma/README.md)。

### 嘉立创 PCB 初级考试第十八期：AT32F415 Layout

当前参数化 Layout 基线包含 69 个器件、15 个功能区和 90 × 50 mm 圆角板框，用于验证
“样例关系 → 算法候选 → AI 选择 → typed 写入 → 回读”的布局方法。该图展示布局阶段结果，
不代表整板布线或生产检查已经完成。
```

</details>

#### 缺口

- 各动作对故障、中断及文档切换的实际表现未知
  **影响**：不能承诺无重复修改或无错误板
  **进一步探讨**：在工程副本定向检查request超时、晚到写入、切换文档及回读，核对电路和几何而非只看截图

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁可以在什么成本条件下试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

只建议具备EasyEDA专业判断的人先在工程副本运行health、动作发现和读取，再挑可回退的小范围丝印或诊断任务。首次有Pro环境、CLI/daemon/connector和DSH MCP/Skill多层配置；持续有模型费用、数据手册核对、规则维护和专业复核；失败恢复还要等待未知handler、回读实际修改并使用备份，不能无脑重试。金额、任务时间与合格板成本未实测。出现工程/window不匹配、ACTION_ABANDONED、pin/pad不一致或保存状态不清时停止写入，回到EDA人工操作及副本备份。可核查的接线与未知状态处理支持受监督试用，不支持无人值守生产。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:19-38](https://github.com/zhoushoujianwork/easyeda-agent/blob/d93d3dd94edd1890557c5b3a5f61756a8d5fef83/cordis.patch.yml#L19-L38)

需要CLI、MCP与Skill多层环境。

<details>
<summary>查看原文（20行）</summary>

```text
# 依赖本仓库的 Go CLI：EASYEDA_BIN 环境变量可覆盖，默认取 PATH 上的 easyeda。
- insert:
    - id: easyeda-mcp
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: easyeda
        transport: stdio
        command: node
        args:
          - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('node_modules/easyeda-agent-dsh/mcp/src/server.mjs', baseUrl))"
        env:
          EASYEDA_BIN: !!js "process.env.EASYEDA_BIN || 'easyeda'"

    - id: easyeda-skill-fs
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: easyeda
        includeDefaultRoots: false
        customSkillDirs:
          - !!js "process.getBuiltinModule('node:url').fileURLToPath(new URL('node_modules/easyeda-agent-dsh/.agents/skills/easyeda-agent', baseUrl))"
```

</details>

**依据 2 · 源码核查**：[mcp/src/core.mjs:70-94](https://github.com/zhoushoujianwork/easyeda-agent/blob/d93d3dd94edd1890557c5b3a5f61756a8d5fef83/mcp/src/core.mjs#L70-L94)

副作用动作要求身份及明确确认。

<details>
<summary>查看原文（25行）</summary>

```text
// Project creation targets a connector window, not a document that does not exist yet.
// Project transfer uses explicit window/UUID guards; other mutations retain document pinning.
export function buildActionCallArgs(action, input = {}) {
  if (action.name === 'project.create') {
    if (typeof input.window !== 'string' || !input.window.trim()) {
      throw new Error('project.create requires an explicit window from easyeda_health');
    }
    if (input.project || input.doc) {
      throw new Error('project.create does not accept project or doc routing; use payload.friendlyName for the new project');
    }
  }
  else if (action.name === 'project.open' || action.name === 'project.export') {
    if (typeof input.window !== 'string' || !input.window.trim() || input.project || input.doc) {
      throw new Error('Project transfer requires an explicit window and payload.projectUuid; omit project/doc routing');
    }
    if (typeof input.payload?.projectUuid !== 'string' || !input.payload.projectUuid.trim()) {
      throw new Error('payload.projectUuid is required');
    }
    if (action.name === 'project.open' && input.payload.allowDiscardUnsaved !== true) {
      throw new Error('Save documents first; payload.allowDiscardUnsaved must be true');
    }
  }
  else if (action.mutates && (!input.project || !input.doc)) {
    throw new Error(`mutating action ${action.name} requires both project and doc`);
  }
```

</details>

**依据 3 · 源码核查**：[extension/src/transport.ts:1133-1146](https://github.com/zhoushoujianwork/easyeda-agent/blob/d93d3dd94edd1890557c5b3a5f61756a8d5fef83/extension/src/transport.ts#L1133-L1146)

未知写结果时只能诊断不盲重试。

<details>
<summary>查看原文（14行）</summary>

```text
		case 'abandoned':
			// daemon 多半已经在 (timeoutMs - 2s) 就超时了,所以这条回执往往落不到
			// 任何等待者手上 —— 那不要紧:它的价值在于**下一条**响应上递增了的
			// seqAbandoned。措辞必须停在可证边界内:我们只知道「不再等它了」,
			// 不知道它到底做没做成。
			response = {
				...base,
				ok: false,
				error: {
					code: ErrorCodes.ACTION_ABANDONED,
					message: `action "${request.action}" response was abandoned after ${outcome.waitedMs}ms`,
					detail: mustHoldAfterAbandon(request.action)
						? 'the handler is still running; FIFO remains blocked until it actually settles. Use only document.current diagnostic reads; do not retry this write (seqAbandoned was incremented)'
						: 'the handler is still running; its effect may land later — treat any conclusion about this write as unproven (seqAbandoned was incremented)',
```

</details>

#### 缺口

- 专业复核时间、模型账单和各动作合格率未知
  **影响**：无法证明AI自动化更省总成本
  **进一步探讨**：按单个已定义合格诊断/丝印任务记录完整账单、回读、修正与恢复时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 晚到修改的状态核对能否降低误重试？

**研究主题**：新假设与验证

#### 完整回答

已有abandoned语义及mutationContext，因此新假设不能说“增加未知状态”就是创新。更窄的未验证方向是在Agent收到超时后自动转入只读核对流程，以请求ID、文档身份和回读差异向工程师展示已发生、未发生或仍无法判断，禁止自行重发。先核查CLI/Skill已有恢复指导是否已等价实现。对工程副本中人工设置的延迟动作比较只报超时与核对流程，记录重复修改、错误目标、人工恢复时间及误判；若没有可信请求结果或核对仍可能误称没执行，则只能维持未知，不推广。

#### 证据与依据

**依据 1 · 源码核查**：[extension/src/transport.ts:1116-1146](https://github.com/zhoushoujianwork/easyeda-agent/blob/d93d3dd94edd1890557c5b3a5f61756a8d5fef83/extension/src/transport.ts#L1116-L1146)

上下文与未知结果为只读核对提供材料，未证明结果已确定。

<details>
<summary>查看原文（31行）</summary>

```text
			if (result.context !== undefined) {
				response.context = result.context;
			}
			if (result.mutationContext !== undefined) response.mutationContext = result.mutationContext;
			if (result.mutationContextAvailable !== undefined) response.mutationContextAvailable = result.mutationContextAvailable;
			if (result.mutationContextError !== undefined) response.mutationContextError = result.mutationContextError;
			if (result.artifacts !== undefined && result.artifacts.length > 0) {
				response.artifacts = result.artifacts;
			}
			if (result.warnings !== undefined && result.warnings.length > 0) {
				response.warnings = result.warnings;
			}
			break;
		}
		case 'error':
			response = { ...base, ok: false, error: toResponseError(outcome.error) };
			break;
		case 'abandoned':
			// daemon 多半已经在 (timeoutMs - 2s) 就超时了,所以这条回执往往落不到
			// 任何等待者手上 —— 那不要紧:它的价值在于**下一条**响应上递增了的
			// seqAbandoned。措辞必须停在可证边界内:我们只知道「不再等它了」,
			// 不知道它到底做没做成。
			response = {
				...base,
				ok: false,
				error: {
					code: ErrorCodes.ACTION_ABANDONED,
					message: `action "${request.action}" response was abandoned after ${outcome.waitedMs}ms`,
					detail: mustHoldAfterAbandon(request.action)
						? 'the handler is still running; FIFO remains blocked until it actually settles. Use only document.current diagnostic reads; do not retry this write (seqAbandoned was incremented)'
						: 'the handler is still running; its effect may land later — treat any conclusion about this write as unproven (seqAbandoned was incremented)',
```

</details>

#### 缺口

- 请求结果查询是否已有、能否覆盖所有动作未知
  **影响**：不能把核对假设写成可用功能
  **进一步探讨**：先核查现有CLI恢复契约，再对少量可回滚动作检验差异

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
