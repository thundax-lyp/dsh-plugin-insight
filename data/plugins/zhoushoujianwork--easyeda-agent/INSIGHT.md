# easyeda-agent

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[4a74c56](https://github.com/zhoushoujianwork/easyeda-agent/tree/4a74c5636670e91c9894ac413f0badcf425757a9)

<!-- BEGIN META -->
[![GitHub ★ 906](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=906&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhoushoujianwork/easyeda-agent)
<!-- END META -->

> **功能**：通过 CLI、MCP 与连接器让 Agent 读取和操作 EasyEDA Pro 工程，并配套设计与回读 Skill。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 支持的贡献是DSH配置接线、类型化工具目录与真实目标约束，配合领域Skill要求回读和保存。CLI、EDA官方接口与专业资料各有独立职责，不把根空apply误作无功能，也不把集成夸为新EDA算法。

> **主要限制**：[Q03](#research-q03) 超时不等于EDA未修改，普通放弃后仍可晚到；整文档roundtrip则继续占住FIFO直到handler结束。handler返回、局部DRC与外层ok都不能证明保存或生产合格，不能用盲重试解决未知状态。

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
  - [Q01 · 谁使用什么交付，DSH 包实际提供什么增量？](#detail-section-11)
  - [Q02 · Agent 工具如何形成类型化 EDA 动作并定位文档？](#detail-section-12)
  - [Q03 · 超时与排队能保证什么，晚到写如何处理？](#detail-section-13)
  - [Q04 · 专业用户怎样承担全周期成本与采用边界？](#detail-section-14)
  - [Q05 · 已有顺序与变更上下文之上还能验证什么恢复假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：能核对电路和制造规则的工程师可在工程副本中读取真实对象、试有限编辑并回读，最终结果需身份、引脚、几何、检查和保存证据，而非单一动作成功。

默认人工EDA编辑和截图指挥是直接基线。本包把领域动作与知识流程接到Agent，避免仅凭截图猜连接；未证明完整电路设计更快或更可靠。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 连接健康读取 | 确认daemon和EDA窗口 | 依赖本地CLI与connector |
| 动作目录与领域调用 | 发现并执行类型化EDA动作 | domain核对，变更需目标；非幂等 |
| 工程转移入口 | 打开或导出指定工程 | 明确window/UUID，打开需接受未保存风险 |
| 电路块读取 | 列举、搜索和读取可复用块 | 不等于对应工程已验证 |
| workflow入口 | 读取或推进设计流状态 | 状态不能代替专业验收 |
| 领域Skill | 指导计划、回读与保存 | 提供正文不证明已执行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH及内置MCP/Skill插件 | DSH入口必需 | 注册stdio工具与隔离Skill | 根apply不提供替代服务 |
| Node >=20.17与MCP SDK | MCP必需 | 运行服务与路径表达式 | 动作目录启动失败则退出 |
| easyeda CLI/daemon | 现场动作必需 | 读取目录和转发领域请求 | PATH或EASYEDA_BIN需核对 |
| EasyEDA Pro V4及connector | 现场动作必需 | 运行eda接口 | 需允许外部交互，health未就绪先停 |
| 专业资料与工程副本 | 可信编辑必需 | 核对器件、引脚、几何与恢复 | 未知不能当空，生产任务不直接试 |
| 模型与人工复核 | Agent编辑必需 | 选择动作并验收 | 费用、质量与投入未知 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 工程师保存副本并确认CLI/connector/DSH | health确认窗口、工程、文档与V4条件 |
| 计划 | Agent读真实快照、动作目录和help，生成小范围计划 | 目标与输入明确，支持时先预览 |
| 执行 | typed动作串行写入 | partial/超时/漂移先停依赖写，不盲重发 |
| 回读 | 工程师核对身份、引脚、几何与相关检查 | 保存→重载→新回读，saved必须布尔true |
| 恢复 | 普通迟到写核对现场；保留FIFO模式只做允许诊断 | 无法确定就保持未知，必要时退回原工程人工操作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | CLI/EDA/模型和本地资源费用未知 | 多层安装、版本/窗口核对和备份；时长未知 | 单装DSH包不等于完整环境 |
| 持续使用 | 模型调用与本地计算未知 | 手册、引脚、几何、DRC及保存复核 | 无总尝试/合格数 |
| 失败恢复 | 晚到修改和重试可能产生修正开销 | 等待、现场回读、修源重算与专业复核 | 超时不是取消，不能估零恢复成本 |
| 退出/迁移 | 工程副本与资料保存资源未知 | 停止Agent写入、人工EDA接管 | 生产/硬件验证另计 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| Agent领域接线 | patch、动态目录和domain/target校验 | 实际DSH/EDA环境兼容 |
| 顺序与未知结果 | FIFO、abandoned及整文档保留模式 | 真实后台窗口延迟/故障表现 |
| 合格工程 | Skill要求回读、显式保存和专业检查 | 电气、制造与硬件结果 |
| 效率成本 | 有自动化与专业复核流程 | 无同条件节时、ROI或单位合格成本 |

> **思考**：[Q03](#research-q03) 超时不等于EDA未修改，普通放弃后仍可晚到；整文档roundtrip则继续占住FIFO直到handler结束。handler返回、局部DRC与外层ok都不能证明保存或生产合格，不能用盲重试解决未知状态。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 支持的贡献是DSH配置接线、类型化工具目录与真实目标约束，配合领域Skill要求回读和保存。CLI、EDA官方接口与专业资料各有独立职责，不把根空apply误作无功能，也不把集成夸为新EDA算法。

[Q03](#research-q03) 将放弃响应与停止执行分开，且为不可取消整文档setter保留FIFO，是比统一超时重试更明确的设计。类型化目录和目标参数也让调用可审阅。移植要保留旁路弱证据、晚到效果和领域验收，不能只复制MCP schema；inventory的JS/TS统计不代表Go CLI或全语言原创规模。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 超时不等于EDA未修改，普通放弃后仍可晚到；整文档roundtrip则继续占住FIFO直到handler结束。handler返回、局部DRC与外层ok都不能证明保存或生产合格，不能用盲重试解决未知状态。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 专业用户仅在备份副本中先确认health和目标身份，再试一项小编辑并回读、检查和保存重载。对象不可读、身份漂移、引脚差异未解、放弃回执或保存不明确时停止依赖写入，等待并人工核对，不以重复执行解决未知结果。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持DSH注册、MCP目标保护与队列未知结果语义；未执行EDA、目标测试或真实电路任务。恢复记录为条件性假设，未计为已有功能。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、index.js、README.md、mcp/src/server.mjs、mcp/src/core.mjs、extension/src/action-queue.ts、extension/src/transport.ts、.agents/skills/easyeda-agent/SKILL.md、.agents/skills/easyeda-agent/references/actions.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定DSH包、MCP目录/参数调用、connector队列与响应和Skill恢复规则；未穷尽Go CLI与全部领域handler，不执行安装、目标代码、真实宿主或硬件验证。
- 下一步：按 [Q05](#research-q05) 先核查既有CLI/audit等价记录，再在隔离工程比较普通迟到写和整文档保留的恢复错误、重复修改与人工投入。

**分析版本**

- **仓库**：[zhoushoujianwork/easyeda-agent](https://github.com/zhoushoujianwork/easyeda-agent)
- **版本号**：1.13.1（[固定提交 4a74c56](https://github.com/zhoushoujianwork/easyeda-agent/tree/4a74c5636670e91c9894ac413f0badcf425757a9)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 条件性未验证假设是把未知写、原目标与后续只读核对组织为审阅记录，减少错误解除未知和重复修改。现有Skill已有先回读/不盲重发，须先排除CLI/audit等价能力，再比较恢复错误与复核投入。

按 [Q05](#research-q05) 先核查既有CLI/audit等价记录，再在隔离工程比较普通迟到写和整文档保留的恢复错误、重复修改与人工投入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 189 | 26080 | — | — | 489442 |
| .md | example | 15 | 1902 | — | — | 32106 |
| .js | source | 5 | 292 | 241 | 49 | — |
| .ts | source | 43 | 23719 | 18365 | 4236 | — |
| .mjs | source | 5 | 591 | 507 | 47 | — |
| .ts | test | 61 | 14241 | 12732 | 525 | — |
| .mjs | test | 4 | 373 | 329 | 23 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/zhoushoujianwork/easyeda-agent/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/zhoushoujianwork/easyeda-agent/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 30](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=30&color=737b86&logo=github)](https://github.com/zhoushoujianwork/easyeda-agent/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH配置插件如何将Agent请求接到EDA工程，并让专业用户处理迟到写入及专业验收的不确定性？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用什么交付，DSH 包实际提供什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合能核对器件、电路和制造规则的工程师，在已有 EasyEDA Pro 工程中让 Agent 读取真实对象、执行受约束编辑并回读。合格结果不是一句动作成功，而是目标身份、引脚网络和几何与需求一致，检查覆盖明确，显式保存后重载回读；实际制造和硬件性能仍需领域验证。相比截图驱动的人工指挥，类型化操作与真实数据可减少凭图猜连接，但没有同任务实测证明总工作量下降。

根包是有效的 DSH 配置插件：package 声明 bundle，cordis.patch 注册 stdio MCP 和隔离的 Skill filesystem 实例；index.js 的 apply 有意为空，防止重复服务。它不把 EasyEDA 或 CLI 全部装进一个 Node 入口，仍需单独 CLI/daemon、EDA连接器及正确宿主。README 推荐的 Desktop 内测工作台源码未公开，不能把其能力或验收归为本次公开代码核查结果。

贡献在领域工具与知识工作流接线，而非发明新的 EDA 算法。README 自己限定示例存在未做实物装配与 DRC 的边界，本研究也不把作者样例当独立复现；“从需求做到板”的宣传不能升级为无人监督生产许可。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-29](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/package.json#L1-L29)

根是private DSH bundle配置包，Node入口与依赖声明。

<details>
<summary>查看原文（29行）</summary>

```text
{
  "name": "easyeda-agent-dsh",
  "version": "1.13.1",
  "private": true,
  "description": "EasyEDA Pro (JLC EDA) automation for DeepSeek Harness: MCP bridge + agent skill bundle",
  "license": "MIT",
  "main": "./index.js",
  "files": [
    "index.js",
    "cordis.patch.yml",
    "mcp/package.json",
    "mcp/src/",
    ".agents/skills/easyeda-agent/"
  ],
  "scripts": {
    "test:dsh": "node --test scripts/tests/test_dsh_bundle.mjs scripts/tests/test_dsh_packaging.mjs"
  },
  "engines": {
    "node": ">=20.17.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "1.30.0"
  }
}
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:20-38](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/cordis.patch.yml#L20-L38)

实际注册MCP及隔离Skill发现实例。

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

**依据 3 · 源码核查**：[index.js:1-7](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/index.js#L1-L7)

空apply是配置插件入口，不启动重复服务。

```text
'use strict';

// DSH installers resolve the package entry even for a configuration-only bundle.
// MCP and Skill registration belongs to cordis.patch.yml; loading this entry
// must not start another server or register duplicate providers.
exports.name = 'easyeda-agent-dsh';
exports.apply = function apply() {};
```

**依据 4 · 作者声明**：[README.md:37-45](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/README.md#L37-L45)

Desktop内测、源码未公开及额度/签名边界是作者说明，不能移作公开源码验收。

```text
当前 Desktop **0.1.0 内测版**内置 easyeda-agent **1.16.0**，提供 **macOS Apple Silicon**
和 **Windows x64** 安装包；文件托管在本项目的
[GitHub Release](https://github.com/zhoushoujianwork/easyeda-agent/releases/tag/v1.16.0#edadesk-desktop)，
无需访问私有仓库即可下载。后续版本与支持平台以 [Desktop 官网](https://eda.daboluo.cc/) 为准。

Desktop 源码暂不公开，开源时间待定；本仓库的 easyeda-agent 继续按下方开源许可提供。
macOS 包尚未开发者签名和公证，Windows 包尚未签名或完成真机验收。
可使用自行安装并登录的本机智能体或自定义模型；官方 Token 赠送与统一模型服务尚未开放，
下载安装不代表获得额度。首次体验建议使用可丢弃的测试工程。
```

**依据 5 · 作者声明**：[README.md:123-135](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/README.md#L123-L135)

作者示例明确没有覆盖实物装配和部分现场检查。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

#### 缺口

- 缺少同任务独立复现与工程师总投入对照
  **影响**：不能证明自动化比手工更快、更可靠或可直接生产
  **进一步探讨**：在可丢弃工程比较一项明确编辑，记录正确性、全部尝试、回读复核和恢复时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Agent 工具如何形成类型化 EDA 动作并定位文档？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

MCP 服务启动先调用 easyeda actions 读取动作目录，失败即退出，不臆造工具列表。按允许领域筛选后生成领域工具的动作枚举；调用时再次核对动作是否属于目标领域，再以 execFile 参数数组运行 CLI，而非拼成 shell 命令。普通变更要求 project 与 doc；新建工程例外必须给 health 中的 window，打开/导出工程则要求明确窗口与工程UUID，打开还需确认可能丢弃未保存内容。工具注解明确不保证幂等。

连接器 transport 把 request 同步放入每窗口 ActionQueue，再调用 runAction；成功响应可携带实际 context、mutationContext 与其可用性/错误字段。队列为普通 handler 建立先后，旁路名单仅 document.current，且标记 unordered。这样可为后续核对提供位置与顺序材料，但不证明每个领域动作都完整校验引脚与几何。

必须先准备 EasyEDA Pro V4、连接器并允许外部交互，CLI/daemon可达；Node MCP在启动目录读取失败时不可用。DSH bundle只接注册，并不替用户确认窗口或装好全部环境。所查链覆盖DSH→MCP→CLI调用及connector入队/响应，未穷尽Go CLI与全部领域handler，因此本题对全动作正确性保留未知，而非把schema存在当已用通。

#### 证据与依据

**依据 1 · 源码核查**：[mcp/src/server.mjs:20-37](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/mcp/src/server.mjs#L20-L37)

动态目录启动门槛与工具说明。

<details>
<summary>查看原文（18行）</summary>

```text
const catalogExecution = await runEasyeda(['actions'], 30_000);
if (!catalogExecution.ok || !Array.isArray(catalogExecution.result)) {
  process.stderr.write(`easyeda-agent-mcp: cannot load action catalog: ${JSON.stringify(catalogExecution)}\n`);
  process.exit(1);
}
const actions = catalogExecution.result.filter((action) => DOMAIN_NAMES.includes(action.domain));
const byName = new Map(actions.map((action) => [action.name, action]));

const server = new Server(
  { name: 'easyeda-agent-mcp', version: '0.18.3' },
  {
    capabilities: { tools: {} },
    instructions: [
      'Control EasyEDA Pro through easyeda-agent.',
      'For project.create, provide an explicit window and payload.friendlyName, without project/doc routing. For other mutations, provide project and doc.',
      'Inspect before editing and run schematic/PCB checks plus native DRC after editing.',
      'Do not bypass workflow gates or use force-unsafe in real projects.',
    ].join(' '),
```

</details>

**依据 2 · 源码核查**：[mcp/src/server.mjs:194-206](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/mcp/src/server.mjs#L194-L206)

调用时再次按domain检验动作并构造CLI调用。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 3 · 源码核查**：[mcp/src/core.mjs:20-42](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/mcp/src/core.mjs#L20-L42)

execFile参数数组及超时/错误返回。

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

**依据 4 · 源码核查**：[mcp/src/core.mjs:70-107](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/mcp/src/core.mjs#L70-L107)

变更目标和工程转移的具体约束。

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

**依据 5 · 源码核查**：[extension/src/transport.ts:1095-1126](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/extension/src/transport.ts#L1095-L1126)

真正入队runAction并传递context与mutationContext。

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

**依据 6 · 作者声明**：[README.md:202-222](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/README.md#L202-L222)

连接器、允许外部交互、health与V4要求。

<details>
<summary>查看原文（21行）</summary>

````text
### 2. 安装连接器

从 [立创插件市场](https://jlc-ext.com/item/zhoushoujian/easyeda-agent-connector) 安装，或从
[最新 GitHub Release](https://github.com/zhoushoujianwork/easyeda-agent/releases/latest) 下载
`easyeda-agent-connector.eext` 后在 EasyEDA Pro 的扩展管理器中导入。

### 3. 打开工程并检查

打开目标 EasyEDA 工程，并启用 **设置 → 允许外部交互**，然后运行：

```bash
easyeda health
```

它逐项列出 daemon、连接器、版本、EasyEDA 宿主、工程与标签页是否就绪，未就绪项直接给出下一步。
daemon 不用手动常驻：任何 `easyeda` 命令发现它没在运行时会自动在后台启动（日志在
`~/.easyeda-agent/daemon.log`；`EASYEDA_NO_AUTOSTART=1` 关闭）。需要安装对账时再运行
`easyeda update --check --exit-code`。

项目主线要求 **EasyEDA Pro V4**，推荐升级到已验证的 **V4.1.60 或更新 V4**。
`easyeda health` 会在 `hostCompatibility` 中单独报告宿主产品版本；V3 环境应先升级再做现场写入。
````

</details>

#### 缺口

- 未逐一跟完Go CLI和全部EDA领域handler的身份与结果校验
  **影响**：不能保证所有动作满足同等保护或宿主兼容
  **进一步探讨**：对准备试用的具体动作定向核查CLI路由、领域handler和实际副本回读。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 超时与排队能保证什么，晚到写如何处理？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

队列提供的是handler级先后，不是EDA文档已提交或已保存。普通任务依次运行，积压到64明确返回overflow；deadline后返回abandoned会增加seqAbandoned并记录请求ID，但底层handler仍可能运行。普通abandoned之后队列可继续，所以后来的读写不能假定前一写没有发生；MCP子进程超时也不能停止已经送到EDA的效果。明确未知结果是这条链最值得借鉴的边界。

有一个重要例外不能遗漏：document.source.roundtrip 在响应已放弃后仍等待底层handler settle，保持FIFO阻塞，避免迟到的整文档setter覆盖后续有序编辑。document.current仍可走旁路观察当前文档，但unordered响应不是写入完成或新鲜快照证明。源码实际将holdAfterAbandon判定传到submit，transport对该类超时返回“不要重试写，只做当前文档诊断”的说明。

因此操作策略不是所有超时一律重试，也不是所有队列都会在超时后释放。普通写结果未知时先停止依赖写入，核对晚到状态；整文档保留模式则等待真正settle，不用有序读试图穿过阻塞。正常handler成功也只到其返回边界，最终保存仍要求Skill的save→reload→fresh readback。以上是源码机制核查，没有在真实后台窗口验证worker时钟与实际落盘。

#### 证据与依据

**依据 1 · 源码核查**：[extension/src/action-queue.ts:165-178](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/extension/src/action-queue.ts#L165-L178)

入队顺序、溢出与串行链。

<details>
<summary>查看原文（14行）</summary>

```text
	submit<T>(task: QueueTask<T>): Promise<QueueOutcome<T>> {
		if (task.bypass) {
			return this.runBypass(task);
		}
		if (this.depth >= this.maxDepth) {
			// 溢出保护:明确拒绝,而不是让积压无限增长。调用方把它翻译成一个
			// 可读的 error code,调用者于是知道「连接器堵了」而不是「超时了」。
			return Promise.resolve({ status: 'overflow', depth: this.depth, stamp: this.stamp(false) });
		}
		this.depth += 1;
		return new Promise<QueueOutcome<T>>((resolve) => {
			// 链上每一环都必须**永不 reject**,否则一次失败会把整条链断掉,
			// 后续动作全部静默消失 —— 那正是这个文件要根治的病。
			this.tail = this.tail.then(() => this.runHead(task, resolve));
```

</details>

**依据 2 · 源码核查**：[extension/src/action-queue.ts:223-253](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/extension/src/action-queue.ts#L223-L253)

放弃响应后普通继续/保留等待的实际分支，成功只计handler完成。

<details>
<summary>查看原文（31行）</summary>

```text
		const outcome = await Promise.race([running, abandonSignal]);
		handle?.cancel();
		setActiveDeadline(undefined);

		if (outcome.kind === 'abandoned') {
			// 我们不再等它,但它**还在跑**:效果可能稍后才落地。这就是
			// seqAbandoned 的全部意义 —— 它一变,那段时间的顺序证据就作废。
			// 绝不给它补 seq:一个被放弃的动作没有可定位的完成时刻。
			this.abandoned += 1;
			this.abandonedIds.push(task.id);
			while (this.abandonedIds.length > ABANDONED_ID_RING) {
				this.abandonedIds.shift();
			}
			resolve({ status: 'abandoned', waitedMs: Date.now() - startedAt, stamp: this.stamp(false) });
			if (task.holdAfterAbandon) {
				// The diagnostic response has settled, but the FIFO tail has not.
				// No later ordered read/write can race an uncancellable late setter.
				await running;
			} else {
				running.then(() => undefined, () => undefined); // 防未处理拒绝
			}
			return;
		}

		// settle 了(成功或失败都算完成)→ 计数 +1,响应带的是完成之后的值。
		this.seq += 1;
		if (outcome.kind === 'ok') {
			resolve({ status: 'ok', value: outcome.value, stamp: this.stamp(false) });
		}
		else {
			resolve({ status: 'error', error: outcome.error, stamp: this.stamp(false) });
```

</details>

**依据 3 · 源码核查**：[extension/src/action-queue.ts:282-308](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/extension/src/action-queue.ts#L282-L308)

唯一旁路与整文档保留名单。

<details>
<summary>查看原文（27行）</summary>

```text
 * 名单:
 *   - `document.current` —— 「编辑器还活着吗、现在开着哪一页」的规范探针,只读
 *     `eda.dmt_*` 的当前文档信息,不碰任何图元。第 3 条尤其成立:它抢在一个还
 *     排在队里的 `document.open` 前面时,只会报**旧的**那一页,于是 `--doc` 门
 *     (ensureActiveDoc)判定「还没切过去」→ 重试;它不可能反过来谎报「已经切到
 *     目标页了」——那一页此刻确实还没被打开。也就是说旁路只会让它更保守。
 *
 * 铁律:**旁路的响应永远不能被当成新鲜度证据**。它们打 `unordered: true`,Go 侧
 * 见到这个标记就退回弱证据档(见 internal/app/sch_place_adopt.go)。
 */
export const BYPASS_ACTIONS: ReadonlySet<string> = new Set<string>([
	'document.current',
]);

/**
 * 判断一个 action 是否走旁路通道。
 *
 * @param action - action 名
 * @returns true = 不进 FIFO,响应打 unordered
 */
export function isBypassAction(action: string): boolean {
	return BYPASS_ACTIONS.has(action);
}

/** Whole-document writes retain FIFO even after their response budget expires. */
export function mustHoldAfterAbandon(action: string): boolean {
	return action === 'document.source.roundtrip';
```

</details>

**依据 4 · 源码核查**：[extension/src/transport.ts:1105-1110](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/extension/src/transport.ts#L1105-L1110)

holdAfterAbandon确实接入请求路径。

```text
	const outcome = await actionQueue.submit({
		id: request.id,
		timeoutMs: request.timeoutMs,
		bypass: isBypassAction(request.action),
		holdAfterAbandon: mustHoldAfterAbandon(request.action),
		run: () => runAction(request.action, request.payload),
```

**依据 5 · 源码核查**：[extension/src/transport.ts:1138-1152](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/extension/src/transport.ts#L1138-L1152)

超时响应明确区分仍运行和FIFO仍阻塞。

<details>
<summary>查看原文（15行）</summary>

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
				},
```

</details>

**依据 6 · 源码核查**：[.agents/skills/easyeda-agent/SKILL.md:25-31](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/.agents/skills/easyeda-agent/SKILL.md#L25-L31)

专业工作循环要求回读及显式保存/重载，不把外层ok当saved。

```text
5. 用当前 `--help` / `easyeda actions` 核对接口，从新鲜快照生成计划，支持 dry-run 时先检查。
   仅经 Cobra 子命令、typed action 或 `easyeda apply` 写入；同一窗口的调用串行执行。
6. 操作后检查宿主弹窗/进度阻塞，按[恢复流程](references/environment-setup.md#宿主弹窗与进度阻塞)处理；CLI 成功不等于界面无阻塞。
   回读身份、逐脚连接和实际几何，与目标对账。部分成功、超时或 stale ID 时先回读，再修源并重算。
7. 稳定检查点显式保存；最终完成 `save → doc reload → fresh readback/render`。
   必须返回布尔 `saved:true`；`saved:false`、缺失或其他类型均为失败，外层 `ok:true` 和 autosave 不替代保存证据。
8. 交付具体结果、证据与未覆盖项；检查、评分、版本或旧 `workflow/stage` 状态不作为普通动作许可。
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 专业用户怎样承担全周期成本与采用边界？

**研究主题**：效果与总成本、采用判断

#### 完整回答

可控试用应从备份工程副本和只读health开始，确认窗口、工程、文档，读取当前动作目录与help。先选一项范围很小的编辑，保存原件、预览计划，操作后按真实身份和几何回读，再执行相关连接检查、DRC和显式保存重载。这里的能力证据支持让专业用户探索，而不支持把大型设计交给无人值守Agent。

首次投入包含CLI/连接器/DSH注册和宿主V4适配；持续投入包含模型调用、器件资料核对、几何与引脚检查、复核弹窗和保存状态。失败后要等待迟到效果、重读现场并从当前状态重算，不只是重试一次命令。现金金额、模型消耗、完整尝试时间及专业复核成本均未知，没有合格数与总尝试数，不能计算ROI或单位成本。

Skill已明确变更超时不自动重发、部分成功要先回读；采用建议不能把相同约束包装成尚未实现的新功能。若对象读不出、工程身份漂移、引脚差异未解、ACTION_ABANDONED或saved不是布尔true，应停止依赖写入并由工程师核对副本，必要时回到原工程及人工EDA操作。

#### 证据与依据

**依据 1 · 源码核查**：[.agents/skills/easyeda-agent/SKILL.md:19-31](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/.agents/skills/easyeda-agent/SKILL.md#L19-L31)

health、快照、串行typed操作、回读和保存的现有流程。

<details>
<summary>查看原文（13行）</summary>

```text
1. 明确供电、接口、机械与装配约束；已有授权内自主完成常规取舍，只澄清影响目标的缺失信息。
2. 现场读写前用 `easyeda health` 确认用户已打开的内置浏览器 Web EDA、工程和文档。
   宿主要求 V4；连接或版本异常按[环境配置](references/environment-setup.md)处理，不擅自切换桌面版。
3. 保留原始快照，核实真实库身份、完整引脚、网络、NC、几何与规则；未知不能当作空或 NC。
4. 在源副本中明确连接、核心外围归属、单位与约束，生成候选并检查和预览。
   求解器、样例或模型生成的数据均须满足[数据契约](references/schematic-data.md#数据驱动架构基准)；不强制某个求解器。
5. 用当前 `--help` / `easyeda actions` 核对接口，从新鲜快照生成计划，支持 dry-run 时先检查。
   仅经 Cobra 子命令、typed action 或 `easyeda apply` 写入；同一窗口的调用串行执行。
6. 操作后检查宿主弹窗/进度阻塞，按[恢复流程](references/environment-setup.md#宿主弹窗与进度阻塞)处理；CLI 成功不等于界面无阻塞。
   回读身份、逐脚连接和实际几何，与目标对账。部分成功、超时或 stale ID 时先回读，再修源并重算。
7. 稳定检查点显式保存；最终完成 `save → doc reload → fresh readback/render`。
   必须返回布尔 `saved:true`；`saved:false`、缺失或其他类型均为失败，外层 `ok:true` 和 autosave 不替代保存证据。
8. 交付具体结果、证据与未覆盖项；检查、评分、版本或旧 `workflow/stage` 状态不作为普通动作许可。
```

</details>

**依据 2 · 源码核查**：[.agents/skills/easyeda-agent/SKILL.md:35-49](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/.agents/skills/easyeda-agent/SKILL.md#L35-L49)

不支持时停写，检查覆盖与制造验证分别表达。

<details>
<summary>查看原文（15行）</summary>

```text
- 工程编辑、保存、重载和验证使用 typed 接口，不用 GUI 或 `debug.exec_js` 绕过缺失设计接口；
  已有授权操作引起的宿主确认/取消弹窗可按恢复流程处理，不能扩展为画布或属性面板编辑。
  接口缺失或宿主持续加载、对象不可读时停止依赖写入，保留输入与错误，标 `unsupported/incomplete`，先修工具验证。
- 原始观测不可改写；改源数据后重新生成受保护队列，不手改队列、SVG 或回读来掩盖差异。
- 库中的相近型号须核对引脚和封装后复用；多变体未支持选择时拒绝，不默认取第一项。
- 原理图用 raw、y 向上、5 raw 网格；PCB 命令通常用 mil。明确原点、anchor 与 bbox 语义。
- 保留全部物理脚与明确 NC。`netAmbiguous:true` 表示歧义，不能转成未连接；标记通过非零导线接脚。
  同名网络、同框或高分不能代替要求的外围实际直连；功能归属与网名分别核验（`sch check` 按已登记模块报 `peripheral-not-direct`，严格门禁失败）。
- 位号参与碰撞与入框检查；其余属性保留原值，最终导图仍须检查全部可见文字，不能由零碰撞推断无叠字。
- PCB 按真实机械、回流与器件要求安排布局；采集缺测不等于空，检查须说明几何与铜的覆盖范围。
  完成前按[布局规则](references/pcb-layout.md)通过连续两轮自检，第二轮包含保存重载和新回读；修复后重来。
  展示最新回读版本并获用户确认后进入整板布线；确认前仅允许规则范围内的电源模块局部连接。
- 临时隐藏属性只能使用可恢复的 typed 视图接口，保存旧值、恢复并回读；不改属性内容来隐藏问题。
- DRC、连接检查、几何和图面分别说明覆盖事实；原生 `pcb drc` 的 `passed:false` 是失败，SCH 的 INFO 不等于错误。
  离线通过、导出成功或截图不能代替现场持久化、制造或硬件验证。
```

</details>

**依据 3 · 源码核查**：[.agents/skills/easyeda-agent/references/actions.md:64-76](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/.agents/skills/easyeda-agent/references/actions.md#L64-L76)

现有执行默认失败即停、只读可重试、变更超时不自动重发。

<details>
<summary>查看原文（13行）</summary>

```text
支持 `exists`、`true/false`、`==/!=`、数值比较及 `len` 比较。内部 run 继承目标工程/页。

执行默认失败即停，只读步骤可重试；变更超时不自动重发。`partial:true` 或非空
`notApplied` 会使 typed 步骤失败。成功回执不等于保存；计划应包含读回与显式 save。
可选 `verify` 是失败后的落地检查，不是事务回滚。已生效的前序步骤保留在画布和 journal。

CLI 完整读取单次 action 的 HTTP 响应，最多 32 MiB；health 清单另限 1 MiB。
超限必须报错且不输出截断内容。整页含属性、pins、bbox 与 wires 的快照可能超过 1 MiB；
旧 CLI 会静默截断并导致 JSON 解析失败，不能据此判断宿主对象缺失。遇回读失败先停止依赖写入，
保留 journal、输入和原始输出；已写入状态可 typed save/原生导出冻结，但不算验证通过。
修复读取后重新采集完整快照、核对已生效步骤，并从当前状态重算受保护队列；不要盲重放或删减必要字段。

**生成的保护计划**（如 compose、designators、connectivity plan）禁止改目标、
```

</details>

**依据 4 · 作者声明**：[README.md:174-175](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/README.md#L174-L175)

CLI/daemon、connector和Skill是三部分。

```text
easyeda-agent 由三部分组成：`easyeda` CLI/daemon、运行在 EasyEDA 内的
**EDA Agent Connector**，以及安装在 AI 客户端中的 `easyeda-agent` Skill。
```

#### 缺口

- 实际合格结果、全部模型/资源费用与人工复核时间未测
  **影响**：不能承诺经济优势或自主生产适用
  **进一步探讨**：仅对一项有明确验收的小编辑记全尝试、专业核对及故障恢复，再决定是否扩范围。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有顺序与变更上下文之上还能验证什么恢复假设？

**研究主题**：新假设与验证

#### 完整回答

现有Skill和actions参考已经规定超时先回读、变更不自动重发，队列也已有seqAbandoned、abandonedIds和整文档保留模式，所以“给Agent一个别重试的提醒”不能算新方向。可检验的增量是把一次未知写的请求身份、原目标、晚到现象和后续只读核对汇总成可审阅恢复记录，帮助专业用户区分已变更、未变更与仍未知，而不自动把其中一种当成功。

推导依据是普通abandoned可有迟到效果、旁路不证明新鲜度，而成功响应可附mutationContext。实验必须先盘点CLI/audit已有记录是否已提供等价关联；若已有，就比较现有呈现与新组织，不重复造一个恢复器。使用隔离副本设置普通写迟到、整文档setter长期运行和窗口切换，记录重复修改、错误解除未知状态、恢复时间与复核成本。保留模式下不可用额外有序读绕过队列，只能保留未知和已允许诊断。

若现有日志已经同样清楚、汇总误把旁路视为提交证据，或用户复核成本更高，则否定新方案。没有执行该对照，也未穷尽CLI全部审计视图，因此它是条件性假设，不是项目已缺少恢复能力的结论。

#### 证据与依据

**依据 1 · 源码核查**：[extension/src/action-queue.ts:227-244](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/extension/src/action-queue.ts#L227-L244)

普通与整文档超时分支的差异。

<details>
<summary>查看原文（18行）</summary>

```text
		if (outcome.kind === 'abandoned') {
			// 我们不再等它,但它**还在跑**:效果可能稍后才落地。这就是
			// seqAbandoned 的全部意义 —— 它一变,那段时间的顺序证据就作废。
			// 绝不给它补 seq:一个被放弃的动作没有可定位的完成时刻。
			this.abandoned += 1;
			this.abandonedIds.push(task.id);
			while (this.abandonedIds.length > ABANDONED_ID_RING) {
				this.abandonedIds.shift();
			}
			resolve({ status: 'abandoned', waitedMs: Date.now() - startedAt, stamp: this.stamp(false) });
			if (task.holdAfterAbandon) {
				// The diagnostic response has settled, but the FIFO tail has not.
				// No later ordered read/write can race an uncancellable late setter.
				await running;
			} else {
				running.then(() => undefined, () => undefined); // 防未处理拒绝
			}
			return;
```

</details>

**依据 2 · 源码核查**：[extension/src/transport.ts:1121-1126](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/extension/src/transport.ts#L1121-L1126)

成功响应已有变更上下文字段，不应假定没有关联材料。

```text
			if (result.context !== undefined) {
				response.context = result.context;
			}
			if (result.mutationContext !== undefined) response.mutationContext = result.mutationContext;
			if (result.mutationContextAvailable !== undefined) response.mutationContextAvailable = result.mutationContextAvailable;
			if (result.mutationContextError !== undefined) response.mutationContextError = result.mutationContextError;
```

**依据 3 · 源码核查**：[.agents/skills/easyeda-agent/references/actions.md:64-76](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/.agents/skills/easyeda-agent/references/actions.md#L64-L76)

已有恢复约束是强反证，限定假设增量。

<details>
<summary>查看原文（13行）</summary>

```text
支持 `exists`、`true/false`、`==/!=`、数值比较及 `len` 比较。内部 run 继承目标工程/页。

执行默认失败即停，只读步骤可重试；变更超时不自动重发。`partial:true` 或非空
`notApplied` 会使 typed 步骤失败。成功回执不等于保存；计划应包含读回与显式 save。
可选 `verify` 是失败后的落地检查，不是事务回滚。已生效的前序步骤保留在画布和 journal。

CLI 完整读取单次 action 的 HTTP 响应，最多 32 MiB；health 清单另限 1 MiB。
超限必须报错且不输出截断内容。整页含属性、pins、bbox 与 wires 的快照可能超过 1 MiB；
旧 CLI 会静默截断并导致 JSON 解析失败，不能据此判断宿主对象缺失。遇回读失败先停止依赖写入，
保留 journal、输入和原始输出；已写入状态可 typed save/原生导出冻结，但不算验证通过。
修复读取后重新采集完整快照、核对已生效步骤，并从当前状态重算受保护队列；不要盲重放或删减必要字段。

**生成的保护计划**（如 compose、designators、connectivity plan）禁止改目标、
```

</details>

**依据 4 · 源码核查**：[extension/src/action-queue.ts:282-294](https://github.com/zhoushoujianwork/easyeda-agent/blob/4a74c5636670e91c9894ac413f0badcf425757a9/extension/src/action-queue.ts#L282-L294)

旁路unordered不能升级为新鲜度证据。

<details>
<summary>查看原文（13行）</summary>

```text
 * 名单:
 *   - `document.current` —— 「编辑器还活着吗、现在开着哪一页」的规范探针,只读
 *     `eda.dmt_*` 的当前文档信息,不碰任何图元。第 3 条尤其成立:它抢在一个还
 *     排在队里的 `document.open` 前面时,只会报**旧的**那一页,于是 `--doc` 门
 *     (ensureActiveDoc)判定「还没切过去」→ 重试;它不可能反过来谎报「已经切到
 *     目标页了」——那一页此刻确实还没被打开。也就是说旁路只会让它更保守。
 *
 * 铁律:**旁路的响应永远不能被当成新鲜度证据**。它们打 `unordered: true`,Go 侧
 * 见到这个标记就退回弱证据档(见 internal/app/sch_place_adopt.go)。
 */
export const BYPASS_ACTIONS: ReadonlySet<string> = new Set<string>([
	'document.current',
]);
```

</details>

#### 缺口

- 未穷尽CLI审计视图，也无恢复呈现对照
  **影响**：不能认定新增恢复记录有独立价值
  **进一步探讨**：先对现有audit和CLI记录做等价检查，再比较错误解除未知、重复写和复核时间；无改善则不新增。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
