# OpenQuantum

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[0da563f](https://github.com/xi-zhao/OpenQuantum/tree/0da563fa87c6592a8923d2eb98eea80f484d2151)

<!-- BEGIN META -->
[![GitHub ★ 71](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=71&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xi-zhao/OpenQuantum)
<!-- END META -->

> **功能**：面向 DeepSeek Harness Desktop 与 Codex 的量子研究 Skills 和 Tools

> **亮点**：[Q01](#research-q01) 统一按需准备与具摘要的事实/校验交付，ground-state有独立科学Validator而非仅模型解释。

> **主要限制**：[Q03](#research-q03) 模型域很窄，通用SDK结果非科学验收；Host有180秒/2MiB边界，但底层worker省略预算可不限，纯JS取消不保证即时停止。

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
  - [Q01 · 它为谁解决什么任务，根项目实际新增了什么？](#detail-section-11)
  - [Q02 · 从按需选择到结果落盘，真实机制和信任分界是什么？](#detail-section-12)
  - [Q03 · 哪些限制、副作用和生命周期会使价值失效？](#detail-section-13)
  - [Q04 · 安装、成本、采用和退出需要哪些具体条件？](#detail-section-14)
  - [Q05 · 哪项价值假设值得验证，怎样避免把案例当整机收益？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：量子研究者在Agent中做受限模型计算并交给同事重验，需要保存输入、数值与校验规则。

通用DSH加手写SDK脚本/笔记本和人工记录；专业SDK仍是计算来源。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 受限ground-state事实与独立观察 | 求解、精确参考及数值/收敛检查 | 两量子位固定激发扇区；内存observations不是整体Acceptance |
| 按需量子Skill/SDK准备与调用 | 发现/准备ready后执行真实本地计算 | 下载需权限；明确禁用及缺凭据阻断 |
| Host科学结果包与状态交接 | 回读文件、中央profile判定、commit摘要投影 | 需可写sandbox和真实匹配事件；一般MCP输出not_evaluated |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=24、DSH0.1.0-rc.6及锁依赖 | 必需 | 根工程及Host适配 | private根非直接单插件安装，版本不匹配需处理 |
| 选中SDK的Python/uv/锁定环境 | SDK路径需要 | 如PennyLane0.45.1 CPU计算 | 需显式prepare；未ready不能直接执行 |
| 独立Home/可写工作区与科学域知识 | 物化验收需要 | 保存输入事实和摘要报告并判断适用性 | 只读或超域不能当passed研究结论 |
| 固定DSH Desktop2.0.0源码/Electron | Desktop可选 | 桌面适配构建与菜单 | 下载构建成本；有源码修改则拒绝覆盖 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 备份工作区，隔离Home，选一个支持域任务和SDK | find只读；prepare获准且返回ready才执行 |
| 执行和复核 | 设置有限预算/timeout/output，核输入、事实、报告与摘要 | observations与持久化Acceptance分开；fail/conditional不报passed |
| 退出 | 停止Agent/插件并待backend/worker关闭，保存结果再退原SDK | 核残留进程和部分文件；不直接删用户Home |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 依赖/SDK缓存、本机CPU和可选Desktop构建资源未知 | 配置隔离Home、科学域与版本核对耗时未知 | 首次下载/编译与热运算分开计量 |
| 持续 | 模型API、CPU内存及主动选用服务费用未知 | 物理范围检查和结果包独立复核耗时未知 | Host有预算而底层省略worker限制可为0，需显式设置，未形成统一代供资源 |
| 恢复 | 保留包/缓存与重建原SDK所需资源未知 | 停止核查、备份和双宿主兼容维护耗时未知 | 已写结果不自动删除，Windows后代清理可明确失败 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 可追溯计算交付 | 源码具有事实/独立观察、写盘回读和摘要commit路径 | 本轮未运行；不能保证每次Host时序/失败均安全 |
| 按需准备 | 默认provider按设置发现、准备并复核ready/禁用 | 未测冷安装成本或减少人工时间 |
| 作者局部性能案例 | 0.8.4路径报告PennyLane固定对易子5.09×，小任务0.37×，不含安装编译 | 不等于0.8.10整机收益、跨机器性能或正式科学Acceptance |

> **思考**：[Q03](#research-q03) 模型域很窄，通用SDK结果非科学验收；Host有180秒/2MiB边界，但底层worker省略预算可不限，纯JS取消不保证即时停止。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 统一按需准备与具摘要的事实/校验交付，ground-state有独立科学Validator而非仅模型解释。

独立校验、摘要和session事件匹配构成可读机制；不同工具/宿主的信任路径不等同。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 模型域很窄，通用SDK结果非科学验收；Host有180秒/2MiB边界，但底层worker省略预算可不限，纯JS取消不保证即时停止。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅隔离Home试支持域的重复复核任务，保留原SDK和结果包，先验失败/停止/回退。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的判断量子领域工具相对通用宿主的计算、证据交付与按需准备增量及其可采用边界。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 package.json、src/capabilities/native-quantum-tools.mjs、.agents/skills/quantum-ground-state/scripts/solve.mjs、.agents/skills/pennylane-differentiable/mcp/bridge.py、scripts/lib/desktop-profile-config.mjs、src/settings/desktop/provider.mjs、src/settings/codex/application.mjs、runtime/openquantum/agent-presets/openquantum/scientific-result-projection.mjs、runtime/openquantum/agent-presets/openquantum/scientific-result-materializer.mjs、.agents/skill-contracts/src/acceptance-report.mjs、src/lib/bounded-science-mcp.mjs、.agents/skills/quantum-ground-state/validators/validate-result.mjs、runtime/openquantum/agent-presets/openquantum/scientific-result-adapters.mjs、.agents/skills/quantum-ground-state/core/contracts.mjs、.agents/skills/quantum-ground-state/scripts/lib/deterministic-optimizer.mjs、src/lib/sdk-differentiable.mjs、src/lib/local-compute-policy.mjs、src/lib/local-json-process.mjs、runtime/chatgpt/native-adapter.mjs、src/settings/desktop/application.mjs、packages/openquantum-web-security/browser-auth.mjs、packages/openquantum-web-security/index.mjs、runtime/chatgpt/backend.mjs、src/lib/science-execution.mjs、scripts/run-harness.mjs、scripts/setup-desktop.mjs、scripts/lib/desktop-source.mjs、src/settings/desktop/preparation.mjs、README.md、experiments/pennylane-rust-commutator/README.md、.agents/skill-contracts/src/result-commit.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的判断量子领域工具相对通用宿主的计算、证据交付与按需准备增量及其可采用边界。未执行目标代码或实际宿主验证。
- 下一步：以同输入双路径比较重验率/误接受/总工时，失败、低预算、写盘拒绝和取消任一出现虚假passed即否定采用

**分析版本**

- **仓库**：[xi-zhao/OpenQuantum](https://github.com/xi-zhao/OpenQuantum)
- **版本号**：0.8.10（[固定提交 0da563f](https://github.com/xi-zhao/OpenQuantum/tree/0da563fa87c6592a8923d2eb98eea80f484d2151)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 同输入比较第三方重验率、误接受、总准备/人工时间；一次虚假passed即可否定。

以同输入双路径比较重验率/误接受/总工时，失败、低预算、写盘拒绝和取消任一出现虚假passed即否定采用

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 441 | 36477 | 34022 | 1073 | — |
| .md | source | 373 | 30108 | — | — | 545182 |
| .mjs | test | 214 | 30953 | 29156 | 393 | — |
| .mjs | example | 34 | 1402 | 1381 | 12 | — |
| .md | example | 5 | 537 | — | — | 4806 |
| .js | source | 7 | 1712 | 1653 | 30 | — |
| .tsx | source | 3 | 137 | 123 | 4 | — |
| .ts | source | 8 | 245 | 215 | 15 | — |
| .ts | test | 1 | 52 | 48 | 1 | — |
| .jsx | source | 1 | 115 | 109 | 1 | — |
| .cjs | example | 2 | 125 | 120 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/xi-zhao/OpenQuantum/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/xi-zhao/OpenQuantum/issues?q=is%3Aissue+created%3A2026-10-06T06%3A34%3A44.234Z..2026-11-05T06%3A34%3A44.234Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/xi-zhao/OpenQuantum/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T06%3A34%3A44.234Z..2026-11-05T06%3A34%3A44.234Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断量子领域工具相对通用宿主的计算、证据交付与按需准备增量及其可采用边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它为谁解决什么任务，根项目实际新增了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已经知道量子模型与物理适用条件、希望在 Agent 会话中选择并复核计算工具的研究者。根 package 是 private 的 OpenQuantum 0.8.10，自述面向 DSH Desktop 与 Codex 的量子研究 Skills/Tools，按工具集合研究；会话、通用命令和桌面壳继承宿主，独立 branding 包也不代表科研能力。本轮不把整个 SDK 目录数量当作已验能力，选择实际原生 ground-state 和 PennyLane 桥贯穿核查。solve_and_validate_ground_state 实际调用求解器与独立 Validator，返回六类事实及 pass/fail/not_checked observations；求解器构造两量子位 Pauli 矩阵，检查 Hermitian 与扇区不泄漏，用固定激发扇区的2×2精确参考及周期网格/黄金分割优化对照能量。相比直接让模型解释答案或自己在笔记本拼装求解与日志，它的实质交付是带输入、参考、轨迹、资源估计的计算事实与校验观察，再由宿主专门链条物化为可回读的结果包；不是新的物理算法、任意分子求解器或通用科学正确性保证。SDK 路径亦有真计算：PennyLane bridge 用 default.qubit、解析 Autograd 回传状态、期望值与 Jacobian，而非仅生成代码。可复核交付判据是输入对应的事实、校验状态和持久化文件一致，不能以模型文字称成功。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-17](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/package.json#L1-L17)

根包身份、private及Node要求

<details>
<summary>查看原文（17行）</summary>

```text
{
  "name": "openquantum",
  "version": "0.8.10",
  "private": true,
  "description": "Quantum research Skills and Tools for DeepSeek Harness Desktop and Codex",
  "author": "OpenQuantum contributors",
  "license": "MIT",
  "keywords": [
    "openquantum",
    "quantum-computing",
    "deepseek-harness",
    "scientific-agent",
    "mcp"
  ],
  "engines": {
    "node": ">=24"
  },
```

</details>

**依据 2 · 源码核查**：[src/capabilities/native-quantum-tools.mjs:52-81](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/src/capabilities/native-quantum-tools.mjs#L52-L81)

原子工具真实求解及Validator调用

<details>
<summary>查看原文（30行）</summary>

```text
function groundStateTool() {
  const parameters = structuredClone(SOLVE_AND_VALIDATE_INPUT_SCHEMA);
  const outputSchema = structuredClone(SOLVE_AND_VALIDATE_OUTPUT_SCHEMA);
  return Object.freeze({
    name: "solve_and_validate_ground_state",
    description:
      "Preferred atomic tool for ordinary requests. Deterministically compute six two-qubit ground-state facts and immediately run the independent scientific Validator. Computation reports observations and leaves provenance not_checked until materialization; it never derives overall Acceptance.",
    parameters,
    output: Object.freeze({
      schema: outputSchema,
      render(_arguments, value) {
        const counts = { pass: 0, fail: 0, not_checked: 0 };
        for (const observation of value.validation.observations) {
          counts[observation.status] += 1;
        }
        return text(
          `Computed six deterministic facts and ${value.validation.observations.length} independent observations for request ${value.facts.problemSpec.requestId}. ${counts.pass} pass, ${counts.fail} fail, ${counts.not_checked} not checked; scope fact: ${value.validation.scopeMatch.status}. Execution provenance remains not checked until the host materializes a Result Package. No overall Acceptance decision was produced.`,
        );
      },
    }),
    async execute(argumentsValue) {
      const request = requireSolveAndValidateRequest(argumentsValue);
      const facts = validateFacts(solveGroundState(request));
      const validation = validateGroundStateComputation({
        profile: trustedAcceptanceProfile(),
        request,
        facts,
      });
      return { facts, validation };
    },
```

</details>

**依据 3 · 源码核查**：[.agents/skills/quantum-ground-state/scripts/solve.mjs:54-109](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/.agents/skills/quantum-ground-state/scripts/solve.mjs#L54-L109)

实际求解、独立矩阵回放及科学边界

<details>
<summary>查看原文（56行）</summary>

```text
  const { normalized, requestDigest, hamiltonianDigest } = canonicalizeRequest(request);
  const matrix = buildHamiltonianMatrix(normalized.hamiltonian.terms);
  const { hermiticityResidual, sectorLeakage } = assertSupportedHamiltonian(
    matrix,
    normalized.hamiltonian.terms,
  );
  const sectorMatrix = extractSectorMatrix(matrix);
  const exact = solveExactRealSymmetricTwoByTwo(sectorMatrix);

  const energyAtTheta = (thetaRadians) =>
    expectationFromTerms(
      normalized.hamiltonian.terms,
      statevectorForTheta(thetaRadians),
    );
  const optimization = minimizePeriodicAngle(energyAtTheta, normalized.method.optimizer);
  const optimalThetaRadians = optimization.best.thetaRadians;
  const statevectorReal = statevectorForTheta(optimalThetaRadians);
  const energyHartree = optimization.best.energyHartree;
  const matrixReplayEnergy = expectationFromMatrix(matrix, statevectorReal);
  const replayResidual = normalizedEnergyDifference(
    matrixReplayEnergy,
    energyHartree,
    hamiltonianScale(normalized.hamiltonian.terms),
  );
  if (replayResidual > REPLAY_RELATIVE_TOLERANCE) {
    throw new Error("Independent matrix and Pauli-term expectations disagree");
  }

  const problemSpec = {
    schemaVersion: "1.0",
    artifactType: "problem-spec",
    requestId: normalized.requestId,
    requestDigest,
    claim: normalized.claim,
    system: normalized.system,
    hamiltonianDigest,
    method: normalized.method,
    acceptanceProfile: normalized.acceptanceProfile,
    limitations: [
      "Only the declared fixed-hamming-weight=1 sector is solved.",
      "The supplied Pauli Hamiltonian is not derived or validated from molecular geometry.",
      "Noise, finite shots, physical hardware, excited states, and QAOA are outside this version.",
    ],
  };
  const hamiltonianManifest = {
    schemaVersion: "1.0",
    artifactType: "hamiltonian-manifest",
    hamiltonianDigest,
    format: normalized.hamiltonian.format,
    qubitCount: normalized.hamiltonian.qubitCount,
    qubitOrder: normalized.hamiltonian.qubitOrder,
    basisOrder: BASIS_ORDER,
    coefficientUnit: normalized.hamiltonian.coefficientUnit,
    terms: normalized.hamiltonian.terms,
    matrix,
    sector: {
```

</details>

**依据 4 · 源码核查**：[.agents/skills/pennylane-differentiable/mcp/bridge.py:9-53](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/.agents/skills/pennylane-differentiable/mcp/bridge.py#L9-L53)

PennyLane状态与解析梯度实际计算

<details>
<summary>查看原文（45行）</summary>

```text
def compute(value):
    import pennylane as qml
    from pennylane import numpy as pnp
    import numpy as np
    check_representation(value)
    trainable = {index: column for column, index in enumerate(value["trainableGateIndices"])}
    parameters = pnp.array([value["gates"][i]["angle"] for i in value["trainableGateIndices"]], dtype=float, requires_grad=True)
    device = qml.device("default.qubit", wires=value["numQubits"], shots=None)
    names = {"CX": "CNOT", "X": "PauliX", "Y": "PauliY", "Z": "PauliZ", "H": "Hadamard"}

    def apply_circuit(params):
        for index, item in enumerate(value["gates"]):
            operation = getattr(qml, names.get(item["gate"], item["gate"]))
            if item["gate"] in ["RX", "RY", "RZ"]:
                angle = params[trainable[index]] if index in trainable else item["angle"]
                operation(angle, wires=item["targets"])
            else:
                operation(wires=item["targets"])

    @qml.qnode(device, interface="autograd", diff_method="backprop")
    def state_circuit(params):
        apply_circuit(params)
        return qml.state()

    @qml.qnode(device, interface="autograd", diff_method="backprop")
    def measured_circuit(params):
        apply_circuit(params)
        measurements = []
        for word in value["observables"]:
            factors = [getattr(qml, letter)(wire) for wire, letter in enumerate(word) if letter != "I"]
            observable = qml.prod(*factors) if factors else qml.Identity(0)
            measurements.append(qml.expval(observable))
        return tuple(measurements)

    def expectations(params):
        return pnp.stack(measured_circuit(params))

    means = expectations(parameters)
    jacobian = qml.jacobian(expectations)(parameters) if trainable else np.empty((len(means), 0))
    return format_result(value, state_circuit(parameters), means, jacobian,
                         "default.qubit (CPU)", "PennyLane Autograd backpropagation")


if __name__ == "__main__":
    execute(compute)
```

</details>

#### 缺口

- 当前用户是否反复需要这些受限模型，且愿意保留证据包，未有使用记录
  **影响**：若用户主要做不支持的模型或只需一次SDK调用，整套准备与验收编排可能没有净价值
  **进一步探讨**：先选择一项落在支持域的真实任务，核对原始输入、六事实和科学验收状态再比较原脚本流程

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从按需选择到结果落盘，真实机制和信任分界是什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

默认 Home 生成会把固定预设里的受管 native/MCP 行移除，以 additional-skills 与 adaptive-capabilities 代替；因此不是启动即运行所有科研服务。provider 提供 find/prepare，按设置动态注册工具并给每个 Agent 创建独立 backend。调用前走原生 DSH pre-execute：保留其他策略的 deny/ask，下载准备需批准或当前 danger-full-access 的持续授权，workspace-write 也只在该权限下复用；执行再经 Settings.callBuiltin 检查禁用及 preparation 状态，环境租约结束释放。ground-state 的内存返回明确把 provenance 留作 not_checked，不生成整体 Acceptance。Host scientific-result-projection 只接收真实顶层调用、参数和值一致且 finalized 的结果，匹配实际追加的 session tool/result 事件；物化使用当前 sandbox 和 ctx.fs，新建输入、事实、带版本/摘要的 Result Package，并从已写字节重新加载校验。中央 builder 按受信 profile 注入规则，必需检查 fail/not_checked 得 failed，scope 不在域或 warning 得 conditional，满足才 passed；ResultCommit 引用文件摘要，而不是取模型自评。随后仍须原事件在 surface、signal未取消，才替换展示。PennyLane 等通用 Python SDK 桥则严格校验输入输出、输入与依赖锁摘要，但 scientificValidation 固定 not_evaluated；保留输出文件不等于走过 ground-state 科学 Acceptance。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/lib/desktop-profile-config.mjs:68-91](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/scripts/lib/desktop-profile-config.mjs#L68-L91)

默认onDemand改写实际静态挂载

<details>
<summary>查看原文（24行）</summary>

```text
export function desktopPreset(source, sourceRoot, nodeExecutable = process.execPath, { runtimeBin, onDemand = false, projectRoot = sourceRoot } = {}) {
  const rendered = render(source, projectRoot, nodeExecutable);
  const document = parseDocument(rendered, desktopYamlOptions);
  if (document.errors.length) throw new Error("Invalid OpenQuantum preset");
  if (!isSeq(document.contents)) throw new Error("Expected preset rows");
  if (onDemand) {
    const policy = parse(readFileSync(path.join(sourceRoot, ".agents/capability-packages.yml"), "utf8"));
    const managed = new Set(policy.packages.flatMap(item => (item.execution?.mcpServers ?? []).map(server => server.name)));
    assertManagedRows(source, projectRoot, nodeExecutable, managed);
    document.contents.items = document.contents.items.filter(row => {
      if (!isMap(row)) return true;
      if (row.get("id") === "openquantum-adaptive-capabilities") return false;
      if (row.get("id") === "skill-filesystem") {
        row.set("name", "./additional-skills.mjs");
        row.set("inject", document.createNode(["skills", "openquantumCapabilities"]));
      }
      if (nativeProviderNames.has(row.get("name"))) return false;
      const config = row.get("config", true);
      return !(isMap(config) && managed.has(config.get("serverName")));
    });
    document.contents.items.push(document.createNode({ id: "openquantum-adaptive-capabilities", name: "./adaptive-capabilities.mjs",
      inject: ["tools", "skills", "openquantumCapabilities"] }));
  }
  const bin = runtimeBin || path.dirname(nodeExecutable);
```

</details>

**依据 2 · 源码核查**：[src/settings/desktop/provider.mjs:21-85](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/src/settings/desktop/provider.mjs#L21-L85)

原生权限询问、动态工具、执行与准备

<details>
<summary>查看原文（65行）</summary>

```text
  const owners = new Set();
  const fullAccess = exec => Boolean(exec.agent?.session && ctx.get("sandboxPolicy")?.resolve({ session: exec.agent.session }).mode === "danger-full-access");
  // MCP annotations do not install a DSH permission policy. Native pre-execute
  // asks flow through DSH approval, session audit and cancellation. Local
  // writes may use the session's standing full-access grant. Never infer that
  // grant from approval=never: in confined sessions never means reject asks.
  // Never override a denial/ask made by another host policy.
  ctx.on("tools/pre-execute", async (exec, next) => {
    const decision = await next();
    if (!["allow", "ask"].includes(decision.kind)) return decision;
    if (exec.name === PREPARE_TOOL) {
      if (decision.kind === "ask") installationApproved.add(exec.token);
      const selection = Object.fromEntries(Object.entries(exec.arguments).filter(([key]) => key !== "retry"));
      const plan = await application.discover(selection);
      if (plan.state === "environment_required" || plan.state === "retry_required") {
        if (decision.kind === "allow" && fullAccess(exec)) {
          standingInstallations.add(exec.token);
          return decision;
        }
        installationApproved.add(exec.token);
        return decision.kind === "ask" ? decision : { kind: "ask", reason: "为当前任务下载并安装所选 Skill 的固定依赖，只准备这一项。" };
      }
    } else if (decision.kind === "allow") {
      const declaration = settings.backend.providers.flatMap(provider => provider.tools).find(value => value.name === exec.name);
      if (declaration?.effect === "workspace-write" && fullAccess(exec)) standingWrites.add(exec.token);
      else if (declaration && declaration.effect !== "read-only") return { kind: "ask", reason: `此 OpenQuantum Tool 的操作权限为 ${declaration.effect}，可能写入工作区或调用外部服务。` };
    }
    return decision;
  });
  let invalidate = () => {};
  let closed = false;
  let refreshes = Promise.resolve();
  const refresh = () => refreshes = refreshes.then(async () => {
    if (closed) return;
    const allowed = new Set((await settings.listTools()).map(value => value.name));
    if (closed) return;
    for (const [name, dispose] of registered) if (!allowed.has(name)) { dispose(); registered.delete(name); }
    for (const definition of settings.backend.tools) {
      if (!allowed.has(definition.name) || registered.has(definition.name)) continue;
      const provider = settings.backend.providers.find(value => value.key === settings.backend.providerFor(definition.name));
      const effect = provider.tools.find(value => value.name === definition.name).effect;
      registered.set(definition.name, ctx.tools.register({ name: definition.name,
        description: `${definition.name === "solve_and_validate_ground_state" ? "计算二量子位基态事实和 Validator observations；最终科学验收仅由 Harness 的物化与中央验收链确定。" : definition.description}\nOpenQuantum: ${effect}. Prepare the selected Skill first; never bypass explicit prohibitions.`,
        parameters: harnessSchema(definition.inputSchema), output: { ...output, render: (_args, value) => value.content?.every(item => item.type === "text") ? value.content : output.render(_args, value) }, timeoutMs: 180000,
        async execute(args, exec) {
          owners.add(exec.agent);
          const value = await application.execute(definition.name, args, exec, { authorize: () => {
            if (standingWrites.has(exec.token) && !fullAccess(exec)) throw new Error("当前聊天权限已变化，请重新调用此 Tool 以确认执行。");
          } });
          // Returning isError as ordinary JSON would be a successful DSH event.
          if (value.isError) throw new Error(value.content?.filter(item => item.type === "text").map(item => item.text).join("\n") || "OpenQuantum Tool 执行失败");
          return wireValue(value);
        },
      }));
    }
    invalidate();
  });
  ctx.tools.register(tool(DISCOVER_TOOL, "Search OpenQuantum Skills by task or inspect one selection. Read-only; never installs or starts services. Explicit user prohibitions always win.",
    { ...preparationProperties, query: { type: "string", maxLength: 240 } }, [], args => application.discover(args)));
  ctx.tools.register({ ...tool(PREPARE_TOOL, "Prepare exactly one Skill's Tool or SDK when needed. Downloads and writes pinned dependencies, then waits for completion in this call. Do not poll discovery/job_list or execute in parallel; execute only after this call returns ready. A failure, prohibition or missing credential stops preparation. Missing credentials belong in OpenQuantum settings, never chat. Ready Tools and sdk.run work in this same chat.",
    { ...preparationProperties, retry: { type: "boolean" } }, ["skillId"], (args, exec) => { owners.add(exec.agent); return application.prepare(args, exec, {
      allowInstall: () => installationApproved.has(exec.token) || (standingInstallations.has(exec.token) && fullAccess(exec)),
    }); }), timeoutMs: PREPARATION_TIMEOUT_MS + 30000 });
  const candidates = async () => {
    const { codex } = await settings.read();
```

</details>

**依据 3 · 源码核查**：[src/settings/codex/application.mjs:194-225](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/src/settings/codex/application.mjs#L194-L225)

禁用复核、准备和租约

<details>
<summary>查看原文（32行）</summary>

```text
  async callBuiltin(name, args, signal, context = {}) {
    await this.backend.validateCall?.(name, args);
    const external = externalMcp(this.backend.providerFor(name));
    const authorize = async () => {
      const { config, codex } = await this.read();
      return this.builtinAllowed(config, codex, name, context.skillId) && (!external || !config.disabledTools.includes(args.operation));
    };
    const initial = await this.read();
    if (!this.builtinAllowed(initial.config, initial.codex, name, context.skillId)) throw new Error("用户已禁止此 Skill、Tool 或 MCP；不能自动恢复");
    signal?.throwIfAborted();
    const preparation = args.operation === "close_session" && externalMcp(this.backend.providerFor(name))?.persistent ? null : await executionPreparation(this, name, args, { skillId: context.skillId });
    if (preparation) {
      await recordSkill(this, preparation.skillId, preparation.state, { selection: preparation.selection, ...(preparation.serviceId ? { serviceId: preparation.serviceId } : {}) });
      // Scientific output schemas describe successful results. Keep setup errors
      // in content so strict MCP clients can read them without schema rejection.
      return { isError: true, content: [{ type: "text", text: JSON.stringify({ code: "preparation_required", ...preparation }) }] };
    }
    const id = this.environmentFor(name);
    const lease = !external && id && this.environments ? await this.environments.acquire(id, name) : null;
    try {
      const getValues = async () => ({ ...(external && id ? this.environments.values(id, await this.environments.read(id)) : lease?.values), ...await this.providerEnvironment(name, args) });
      const values = await getValues();
      const result = await this.backend.call(name, args, signal, authorize, values, { ...context, ...(external ? { values: getValues, acquire: () => this.environments.acquire(id, name) } : {}) });
      const capability = this.capabilityFor(name);
      if (capability && !result.isError) await recordSkill(this, capability.id, "used", { selection: { skillId: capability.id, toolName: name }, lastUsedAt: new Date().toISOString() }).catch(() => {});
      return result;
    } finally { await lease?.release(); }
  }
  async environmentCommand(input) {
    if (!this.environments) throw new Error("当前插件没有运行环境管理入口");
    requireKeys(input, ["action", "id", "revision", "configuration", "configurationRevision", "jobId", "dependencyGroups"]);
    if (input.revision !== (await this.read()).revision) throw new Error("设置已更新，请刷新后重试");
```

</details>

**依据 4 · 源码核查**：[runtime/openquantum/agent-presets/openquantum/scientific-result-projection.mjs:55-174](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/runtime/openquantum/agent-presets/openquantum/scientific-result-projection.mjs#L55-L174)

真实调用事件匹配、物化后才投影及生命周期

<details>
<summary>查看原文（120行）</summary>

```text
    && message?.source?.kind === "tool" && message.source.callId === candidate.exec.callId
    && message.content.length === 1 && block?.type === "tool-result"
    && block.toolCallId === candidate.exec.callId && block.isError === false
    && isDeepStrictEqual(block.content, candidate.content);
}

export function apply(ctx) {
  const sessions = new WeakMap();
  const executions = new WeakMap();
  const warn = () => ctx.logger?.warn?.("Scientific result materialization failed; original observations retained");
  function stateFor(session) {
    if (!sessions.has(session)) sessions.set(session, { candidates: new Map(), jobs: new Map() });
    return sessions.get(session);
  }
  async function drain(session) {
    const state = sessions.get(session);
    if (!state) return;
    while (state.jobs.size) await Promise.all([...state.jobs.values()].map(job => job.promise));
    // Native step boundaries follow all scheduled result commits. An unmatched
    // candidate cannot be promoted by a later, unrelated event or reused call id.
    state.candidates.clear();
  }
  function cancel(state) {
    state.candidates.clear();
    for (const job of state.jobs.values()) job.abort.abort();
  }

  ctx.on("tools/post-execute", async (exec, result, next) => {
    const downstream = await next();
    if (downstream.kind !== "accept" || Object.hasOwn(downstream, "value") || result.isError || exec.parent !== undefined) {
      return downstream;
    }
    const computational = projectScientificToolResult(exec.name, result.value);
    const originalText = flattenText(downstream.content ?? result.content);
    if (!computational || originalText === undefined) return downstream;
    const content = presentationContent(originalText, computational);
    try {
      const session = exec.agent?.session;
      const adapter = scientificResultAdapter(exec.name);
      if (session && typeof adapter?.materialize === "function" && !exec.signal?.aborted) {
        const callEvent = matchingCallEvent(session, exec);
        if (callEvent && typeof session.header.cwd === "string") {
          const recordedArguments = typeof callEvent.data.arguments === "string"
            ? JSON.parse(callEvent.data.arguments) : callEvent.data.arguments;
          if (!isDeepStrictEqual(recordedArguments, exec.arguments)) throw new Error("Recorded scientific input differs");
          const candidate = { exec, adapter, callEvent, originalText, content: structuredClone(content),
            canonicalValue: structuredClone(result.value), arguments: structuredClone(exec.arguments), finalized: false };
          stateFor(session).candidates.set(callEvent.seq, candidate);
          executions.set(exec, candidate);
        }
      }
    } catch { warn(); }
    return { kind: "accept", content,
      ...(downstream.additionalContexts ? { additionalContexts: downstream.additionalContexts } : {}) };
  }, { prepend: true });

  // Definition-owned finalizers and outer policies run after post-execute. Only
  // the identical successful final value and content may form an audit candidate.
  ctx.on("tools/result", (exec, result) => {
    const candidate = executions.get(exec);
    if (!candidate) return;
    executions.delete(exec);
    candidate.finalized = !result.isError && !exec.signal?.aborted
      && isDeepStrictEqual(result.value, candidate.canonicalValue)
      && isDeepStrictEqual(result.content, candidate.content);
    if (!candidate.finalized) sessions.get(exec.agent.session)?.candidates.delete(candidate.callEvent.seq);
  });

  ctx.on("session/event", (session, event) => {
    const state = sessions.get(session);
    if (!state) return;
    if (event.type === "turn/end" || event.type === "sandbox/mode" && ctx.sandboxPolicy.resolve({ session }).mode === "read-only") {
      cancel(state);
      return;
    }
    if (event.surfaceOp?.op === "replace") {
      for (const seq of event.sourceEventSeqs ?? []) {
        const job = state.jobs.get(seq);
        if (job && !job.publishing) job.abort.abort();
      }
    }
    if (event.type !== "tool/result" || event.surfaceOp !== "append") return;
    const candidate = state.candidates.get(event.sourceEventSeqs?.[0]);
    if (!candidate) return;
    state.candidates.delete(candidate.callEvent.seq);
    if (!matchesResult(event, candidate)) return;
    const abort = new AbortController();
    const signal = candidate.exec.signal ? AbortSignal.any([candidate.exec.signal, abort.signal]) : abort.signal;
    const job = { abort, publishing: false };
    state.jobs.set(event.seq, job);
    // session/event is a synchronous observer: defer work until append returns.
    // Native awaited hooks below drain it before model input or turn completion.
    job.promise = Promise.resolve().then(async () => {
      signal.throwIfAborted();
      if (!session.surface.nodes.includes(event.seq)) return;
      const materialized = await candidate.adapter.materialize({
        sandboxPolicy: ctx.sandboxPolicy.resolve({ session }), fileSystem: ctx.fs,
        workspaceRoot: session.header.cwd, sessionId: session.id, callId: candidate.exec.callId,
        eventRange: { from: candidate.callEvent.seq, to: event.seq },
        arguments: candidate.arguments, canonicalValue: candidate.canonicalValue, signal,
      });
      signal.throwIfAborted();
      if (!session.surface.nodes.includes(event.seq)) return;
      const presentation = projectMaterializedScientificResult(candidate.exec.name, candidate.canonicalValue, materialized);
      if (!presentation) return;
      const message = event.data.message;
      job.publishing = true;
      session.append("tool/result", {
        ...event.data,
        message: { ...message, content: [{ ...message.content[0], content: presentationContent(candidate.originalText, presentation) }] },
      }, { surfaceOp: { op: "replace", start: event.seq, end: event.seq }, sourceEventSeqs: [event.seq] });
    }).catch(warn).finally(() => state.jobs.delete(event.seq));
  });

  ctx.on("agent/pre-step", async ({ agent }, next) => {
    await drain(agent.session);
    return next();
  }, { prepend: true });
  ctx.on("agent/turn-stopping", ({ agent }) => drain(agent.session));
  ctx.on("session/disposed", session => {
```

</details>

**依据 5 · 源码核查**：[runtime/openquantum/agent-presets/openquantum/scientific-result-materializer.mjs:326-410](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/runtime/openquantum/agent-presets/openquantum/scientific-result-materializer.mjs#L326-L410)

写盘回读后独立校验与中央builder/commit

<details>
<summary>查看原文（85行）</summary>

```text
    const inputTarget = await writeNewText({
      fileSystem,
      workspaceTarget,
      workspaceRoot,
      sandboxPolicy,
      relativePath: `${directory.relativePath}/${inputReference.path}`,
      content: inputContent,
      signal,
    });
    const artifactTargets = new Map();
    for (const entry of artifactEntries) {
      const target = await writeNewText({
        fileSystem,
        workspaceTarget,
        workspaceRoot,
        sandboxPolicy,
        relativePath: `${directory.relativePath}/${entry.reference.path}`,
        content: entry.content,
        signal,
      });
      artifactTargets.set(entry.key, target);
    }

    const resultPackageRelativePath =
      `${directory.relativePath}/result-package.json`;
    const resultPackageTarget = await writeNewText({
      fileSystem,
      workspaceTarget,
      workspaceRoot,
      sandboxPolicy,
      relativePath: resultPackageRelativePath,
      content: canonicalJson(resultPackageValue),
      signal,
    });
    const resultPackage = loadResultPackage(
      fileSystem.processPath(resultPackageTarget),
      loadedCapability,
    );
    const persistedArtifacts = Object.fromEntries(
      artifactEntries.map((entry) => [
        entry.key,
        readPersistedJson(fileSystem, artifactTargets.get(entry.key)),
      ]),
    );
    const validation = await prepared.validate({
      resultPackage,
      profile,
      signal,
      request: readPersistedJson(fileSystem, inputTarget),
      artifacts: persistedArtifacts,
    });
    const acceptanceValue = buildAcceptanceReport({
      capability: loadedCapability,
      resultPackage,
      validatorId: definition.validatorId,
      profileId: definition.profileId,
      reportId: `${definition.packagePrefix}-acceptance-${directory.callDigest}`,
      generatedAt: safeTimestamp(now),
      scopeMatch: validation.scopeMatch,
      observations: validation.observations,
      limitations: validation.limitations,
      statement: validation.statement,
    });
    const acceptanceRelativePath =
      `${directory.relativePath}/acceptance-report.json`;
    const acceptanceTarget = await writeNewText({
      fileSystem,
      workspaceTarget,
      workspaceRoot,
      sandboxPolicy,
      relativePath: acceptanceRelativePath,
      content: canonicalJson(acceptanceValue),
      signal,
    });
    const acceptanceReport = loadAcceptanceReport(
      fileSystem.processPath(acceptanceTarget),
      loadedCapability,
      resultPackage,
    );
    const resultCommit = buildResultCommit({
      capability: loadedCapability,
      resultPackage,
      acceptanceReport,
      artifactRoot: workspaceProcessPath,
    });
```

</details>

**依据 6 · 源码核查**：[.agents/skill-contracts/src/acceptance-report.mjs:19-41](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/.agents/skill-contracts/src/acceptance-report.mjs#L19-L41)

整体Acceptance真实聚合规则

<details>
<summary>查看原文（23行）</summary>

```text
export function deriveAcceptanceStatus(checks, scopeMatch) {
  if (
    checks.some(
      (check) =>
        check.required && ["fail", "not_checked"].includes(check.status),
    )
  ) {
    return "failed";
  }
  if (scopeMatch && scopeMatch.status !== "in_scope") {
    return "conditional";
  }
  if (
    checks.some(
      (check) =>
        (check.required && check.status === "warn") ||
        (!check.required && ["warn", "fail", "not_checked"].includes(check.status)),
    )
  ) {
    return "conditional";
  }
  return "passed";
}
```

</details>

**依据 7 · 源码核查**：[src/lib/bounded-science-mcp.mjs:24-40](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/src/lib/bounded-science-mcp.mjs#L24-L40)

一般SDK科学状态明确不评估

<details>
<summary>查看原文（17行）</summary>

```text
  const ajv = new Ajv({ allErrors: true, useDefaults: true, strict: false, strictNumbers: true });
  const validateInput = ajv.compile(inputSchema);
  const outputSchema = objectSchema({
    schemaVersion: { const: "1.0" },
    source: objectSchema(Object.fromEntries(Object.entries(source).map(([key, value]) => [key, { const: value }]))),
    input: inputSchema,
    inputSha256: { type: "string", pattern: "^[a-f0-9]{64}$" },
    dependencyLockSha256: { type: "string", pattern: "^[a-f0-9]{64}$" },
    result: resultSchema,
    scientificValidation: { const: "not_evaluated" },
    limitations: arraySchema({ type: "string", minLength: 1 }, 1, 12),
  });
  if (inputSchema.properties.referenceMode && resultSchema.properties.reference) {
    outputSchema.allOf = ["auto", "required", "skip"].map(mode => ({
      if: { properties: { input: { properties: { referenceMode: { const: mode } } } } },
      then: { properties: { result: { properties: { reference: { properties: { mode: { const: mode } } } } } } },
    }));
```

</details>

**依据 8 · 源码核查**：[.agents/skills/quantum-ground-state/validators/validate-result.mjs:630-715](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/.agents/skills/quantum-ground-state/validators/validate-result.mjs#L630-L715)

Validator独立重放期望值、变分界及能量误差

<details>
<summary>查看原文（86行）</summary>

```text

  const ansatzReplay = replayAnsatz(result);
  observations.set(
    "result.ansatz-replayed",
    makeObservation({
      id: "result.ansatz-replayed",
      passed:
        Number.isFinite(ansatzReplay.metric) &&
        ansatzReplay.metric <= definitions.get("result.ansatz-replayed").threshold,
      observed: ansatzReplay,
      evidenceRefs: evidence.artifactRefs("ground-state-result"),
    }),
  );

  const matrixEnergy = expectationFromMatrix(matrix, result?.statevectorReal ?? []);
  const termEnergy = canonical.inScope
    ? expectationFromTerms(canonical.hamiltonian.terms, result?.statevectorReal ?? [])
    : Number.POSITIVE_INFINITY;
  const expectationMetric = maximum([
    relativeResidual(result?.energyHartree, matrixEnergy, scale),
    relativeResidual(result?.energyHartree, termEnergy, scale),
    relativeResidual(matrixEnergy, termEnergy, scale),
  ]);
  observations.set(
    "result.expectation-replayed",
    makeObservation({
      id: "result.expectation-replayed",
      passed:
        Number.isFinite(expectationMetric) &&
        expectationMetric <= definitions.get("result.expectation-replayed").threshold,
      observed: {
        normalizedResidual: expectationMetric,
        matrixEnergyHartree: matrixEnergy,
        termEnergyHartree: termEnergy,
        scaleHartree: scale,
      },
      evidenceRefs: evidence.artifactRefs("ground-state-result", "hamiltonian-manifest"),
    }),
  );

  const exactEnergy = exact?.groundEnergyHartree;
  const variationalViolation =
    Number.isFinite(exactEnergy) && Number.isFinite(result?.energyHartree)
      ? Math.max(0, exactEnergy - result.energyHartree) /
        Math.max(scale, Math.abs(exactEnergy), Math.abs(result.energyHartree))
      : Number.POSITIVE_INFINITY;
  const recordedGapResidual = relativeResidual(
    result?.variationalGapHartree,
    result?.energyHartree - exactEnergy,
    scale,
  );
  const variationalMetric = Math.max(variationalViolation, recordedGapResidual);
  observations.set(
    "vqe.variational-bound",
    makeObservation({
      id: "vqe.variational-bound",
      passed:
        Number.isFinite(variationalMetric) &&
        variationalMetric <= definitions.get("vqe.variational-bound").threshold,
      observed: {
        normalizedLowerBoundViolation: variationalViolation,
        normalizedRecordedGapResidual: recordedGapResidual,
      },
      evidenceRefs: evidence.artifactRefs("ground-state-result", "exact-reference"),
    }),
  );

  const energyError =
    Number.isFinite(exactEnergy) && Number.isFinite(result?.energyHartree)
      ? Math.abs(result.energyHartree - exactEnergy)
      : Number.POSITIVE_INFINITY;
  observations.set(
    "vqe.energy-accuracy",
    makeObservation({
      id: "vqe.energy-accuracy",
      passed:
        Number.isFinite(energyError) &&
        energyError <= definitions.get("vqe.energy-accuracy").threshold,
      observed: { absoluteErrorHartree: energyError },
      evidenceRefs: evidence.artifactRefs("ground-state-result", "exact-reference"),
    }),
  );

  const converged =
    result?.converged === true &&
    result?.terminationReason === "angle-tolerance" &&
```

</details>

**依据 9 · 源码核查**：[runtime/openquantum/agent-presets/openquantum/scientific-result-adapters.mjs:102-130](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/runtime/openquantum/agent-presets/openquantum/scientific-result-adapters.mjs#L102-L130)

ground-state实际adapter把持久化事实交独立Validator

<details>
<summary>查看原文（29行）</summary>

```text
  async prepare({ request, structuredContent }) {
    const runtime = await groundStateRuntime();
    const canonicalRequest = runtime.requireSolveAndValidateRequest({ request });
    const canonicalFacts = runtime.validateFacts(structuredContent?.facts);
    return {
      request: canonicalRequest,
      artifacts: Object.entries(GROUND_STATE_FACT_FILES).map(
        ([key, fileName]) => ({
          key,
          id: canonicalFacts[key].artifactType,
          type: canonicalFacts[key].artifactType,
          fileName,
          value: canonicalFacts[key],
        }),
      ),
      validate({ resultPackage, profile, request: persistedRequest, artifacts }) {
        return runtime.validateValidationBundle({
          schemaVersion: "1.0",
          resultPackage: {
            kind: resultPackage.kind,
            value: resultPackage.value,
          },
          profile,
          request: persistedRequest,
          facts: artifacts,
        });
      },
    };
  },
```

</details>

**依据 10 · 源码核查**：[runtime/openquantum/agent-presets/openquantum/scientific-result-adapters.mjs:470-505](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/runtime/openquantum/agent-presets/openquantum/scientific-result-adapters.mjs#L470-L505)

工具名、嵌套structuredContent和request到物化映射

<details>
<summary>查看原文（36行）</summary>

```text
  [
    SOLVE_AND_VALIDATE_TOOL,
    Object.freeze({
      descriptor: Object.freeze({
        capabilityId: "quantum-ground-state",
        operation: "solve-and-validate",
        title: "量子基态求解与科学观察",
        scientificStatuses: Object.freeze([
          "observations_available",
          "acceptance_available",
        ]),
        materializedArtifactTypes: Object.freeze([
          "problem-spec",
          "hamiltonian-manifest",
          "exact-reference",
          "ground-state-result",
          "convergence-trace",
          "resource-estimate",
        ]),
      }),
      project: groundStateAtomicPresentation,
      materialize(context) {
        return materializeGroundState({
          ...context,
          request: context.arguments?.request,
          structuredContent:
            context.canonicalValue?.structuredContent ?? context.canonicalValue,
        });
      },
      projectMaterialized(canonicalValue, materialized) {
        return materializedPresentation({
          computational: groundStateAtomicPresentation(
            canonicalValue?.structuredContent ?? canonicalValue,
          ),
          materialized,
          title: "量子基态科学验收",
```

</details>

#### 缺口

- 跨真实Host版本的hook顺序、写盘失败及取消时序尚未运行验证
  **影响**：若最终事件匹配/物化未完成，计算成功仍不能宣称持久化验收通过；可能只保留原结果或部分新建文件
  **进一步探讨**：隔离会话注入写入拒绝/事件替换/取消，确认无虚假passed投影，并以磁盘摘要重读检查结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些限制、副作用和生命周期会使价值失效？

**研究主题**：缺陷与关键质疑

#### 完整回答

ground-state 输入契约只接受两量子位、固定 Hamming weight=1 的 supplied Pauli Hamiltonian，方法是理想 statevector VQE；不从分子几何推导或验证 Hamiltonian，也不涵盖噪声、有限 shots、硬件或激发态。预算耗尽优化可返回 converged:false，不能把存在最优候选当收敛。PennyLane 路径是 CPU default.qubit、列出的离散门与旋转、初始零态及解析梯度，不是任意 PennyLane 程序或 QPU。通用 MCP 每服务只允许一个 active 调用，忙时返回错误；选定可信 entrypoint 才能声明可传的凭据环境名，输出 schema、输入、依赖锁摘要均复核。须区分Host和底层worker预算：共享backend规定最多2个并发、调用180秒和返回2MiB检查，向含execution的schema投影最多180秒/2MiB/2线程；这些是可读约束，不应说整个入口完全不限额。但其Ajv未启useDefaults，声明default本身不等于运行注入；底层SDK server的execution默认空对象，进程超时/流字节预算在请求和环境均省略时仍为0。Host返回后大小检查也不是进程峰值内存限制，因此采用时应显式传worker预算并核实实际约束。取消会终止 POSIX 调用进程组；Windows 用 taskkill，父进程已退出时无法安全确认后代会明确报清理失败。纯 JS native adapter 只在同步求解前后检查 signal，不能保证高预算循环即时中断。按 Agent 关闭会 abort controller 并关 backend/环境，插件关闭等待资源释放；已写结果和缓存不会随关闭自动消失。Web 增量层用随机启动令牌换 authority 绑定的 HMAC cookie，并约束 HTTP/WS Origin，重启密钥使旧 cookie失效；这适用于本机研究入口，不构成多租户授权隔离，也不替代宿主通用bash/fs权限。

#### 证据与依据

**依据 1 · 源码核查**：[.agents/skills/quantum-ground-state/core/contracts.mjs:69-116](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/.agents/skills/quantum-ground-state/core/contracts.mjs#L69-L116)

固定模型与方法输入范围

<details>
<summary>查看原文（48行）</summary>

```text
  hamiltonian: strictObject({
    format: stringConstant("openquantum-pauli-sum-v1"),
    qubitCount: integerConstant(2),
    qubitOrder: stringConstant("left-to-right-msb"),
    basisOrder: stringConstant("00-01-10-11"),
    coefficientUnit: stringConstant("hartree"),
    sector: strictObject({
      kind: stringConstant("fixed-hamming-weight"),
      value: integerConstant(1),
    }),
    terms: {
      type: "array",
      description:
        "Unique two-character Pauli terms over I/X/Z with finite coefficients in Hartree.",
      items: strictObject({
        pauli: { type: "string" },
        coefficient: { type: "number" },
      }),
    },
  }),
  method: strictObject({
    algorithm: stringConstant("vqe"),
    simulator: stringConstant("statevector"),
    ansatz: strictObject({
      id: stringConstant("two-qubit-single-excitation-givens"),
      version: stringConstant("1.0.0"),
    }),
    optimizer: strictObject({
      id: stringConstant("coarse-grid-golden-refine"),
      version: stringConstant("1.0.0"),
      coarsePoints: { type: "integer", minimum: 4, maximum: Number.MAX_SAFE_INTEGER },
      angleToleranceRadians: {
        type: "number",
        description: "Finite angle tolerance in [1e-14, 0.01].",
      },
      maxEvaluations: {
        type: "integer",
        description: "Caller-supplied evaluation budget, at least 8.",
      },
    }),
    randomness: stringConstant("none"),
  }),
  acceptanceProfile: strictObject({
    id: stringConstant("supplied-pauli-statevector"),
    version: stringConstant("1.1.0"),
  }),
});

```

</details>

**依据 2 · 源码核查**：[.agents/skills/quantum-ground-state/scripts/lib/deterministic-optimizer.mjs:23-87](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/.agents/skills/quantum-ground-state/scripts/lib/deterministic-optimizer.mjs#L23-L87)

优化预算及未收敛返回

<details>
<summary>查看原文（65行）</summary>

```text
export function minimizePeriodicAngle(energyAtTheta, options) {
  const { coarsePoints, angleToleranceRadians, maxEvaluations } = options;
  const uniqueCoarsePointCount = coarsePoints - 1;
  if (
    !Number.isSafeInteger(uniqueCoarsePointCount) ||
    uniqueCoarsePointCount < 3 ||
    !Number.isFinite(angleToleranceRadians) ||
    angleToleranceRadians <= 0 ||
    !Number.isSafeInteger(maxEvaluations) ||
    maxEvaluations < 1
  ) {
    throw new Error("Invalid deterministic optimizer options");
  }
  const trace = [];
  let best;

  function evaluate(thetaRadians, phase) {
    if (trace.length >= maxEvaluations) {
      return undefined;
    }
    const canonicalThetaRadians = canonicalizePeriodicAngle(thetaRadians);
    const energyHartree = energyAtTheta(canonicalThetaRadians);
    if (!Number.isFinite(energyHartree)) {
      throw new Error("Statevector expectation produced a non-finite energy");
    }
    if (!best || energyHartree < best.energyHartree) {
      best = { thetaRadians: canonicalThetaRadians, energyHartree };
    }
    const entry = {
      evaluation: trace.length + 1,
      phase,
      thetaRadians: canonicalThetaRadians,
      energyHartree,
      bestEnergyHartree: best.energyHartree,
    };
    trace.push(entry);
    return energyHartree;
  }

  const lowerBound = -Math.PI;
  const coarseStep = TWO_PI / uniqueCoarsePointCount;
  const coarseAngleAt = (index) => lowerBound + index * coarseStep;
  const coarseEnergies = [];
  // Generate only evaluated nodes; a small budget must not allocate the full grid.
  for (let index = 0; index < Math.min(uniqueCoarsePointCount, maxEvaluations); index += 1) {
    const energy = evaluate(coarseAngleAt(index), "coarse");
    if (energy === undefined) {
      break;
    }
    coarseEnergies.push(energy);
  }

  if (coarseEnergies.length < uniqueCoarsePointCount) {
    return {
      best,
      trace,
      converged: false,
      terminationReason: "evaluation-budget",
      finalBracketWidthRadians: null,
      coarsePointsEvaluated: coarseEnergies.length,
      refinementEvaluations: 0,
    };
  }

  let bestCoarseIndex = 0;
```

</details>

**依据 3 · 源码核查**：[src/lib/sdk-differentiable.mjs:9-30](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/src/lib/sdk-differentiable.mjs#L9-L30)

实际PennyLane公共输入域

<details>
<summary>查看原文（22行）</summary>

```text
export function differentiableCircuitDefinition({ name, source, backend, gradientMethod }) {
  return defineScienceTool({
    name, source,
    description: `Simulate a user-specified ideal qubit circuit and differentiate Pauli expectations using ${source.name}. All qubits start in |0>. Supports H/X/Y/Z/S/T/RX/RY/RZ/CX/CZ/SWAP; angles in radians. trainableGateIndices selects independent rotation angles; Jacobian rows follow observables and columns follow those indices. CPU local execution, no shots or cloud/QPU. Returns unmodified numerical state amplitudes/probabilities and expectations. Dependencies require explicit setup.`,
    inputSchema: obj({
      numQubits: count(1, 2),
      gates: { ...arr(obj({ gate: { enum: gateNames }, targets: arr(count(0), 1, 2), angle: finite() }, ["gate", "targets"]), 0), default: [{ gate: "RY", targets: [0], angle: 0.4 }, { gate: "CX", targets: [0, 1] }] },
      observables: { ...arr({ type: "string", pattern: "^[IXYZ]+$" }, 1), default: ["ZI", "IZ", "XX"] },
      trainableGateIndices: { ...arr(count(0), 0), default: [0] },
    }),
    checkInput(value) {
      for (const { gate, targets, angle } of value.gates) {
        if (targets.length !== (twoQubit.has(gate) ? 2 : 1) || new Set(targets).size !== targets.length || targets.some(q => q >= value.numQubits)) throw new Error("Gate targets must be distinct, in range, and match gate arity");
        if (rotations.has(gate) !== (angle !== undefined)) throw new Error("Only rotation gates require an angle in radians");
      }
      if (value.observables.some(word => word.length !== value.numQubits)) throw new Error("Every Pauli word must contain one character per qubit, left to right q0,q1,...");
      if (new Set(value.trainableGateIndices).size !== value.trainableGateIndices.length) throw new Error("trainableGateIndices must be distinct");
      if (value.trainableGateIndices.some(index => index >= value.gates.length || !rotations.has(value.gates[index].gate))) throw new Error("Every trainable index must select an RX, RY or RZ gate");
    },
    resultSchema: obj({
      numQubits: count(),
      amplitudes: arr(arr(finite(), 2, 2), 2),
```

</details>

**依据 4 · 源码核查**：[src/lib/bounded-science-mcp.mjs:64-116](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/src/lib/bounded-science-mcp.mjs#L64-L116)

单活调用、受控凭据环境与结果校验

<details>
<summary>查看原文（53行）</summary>

```text
  for (const name of credentialEnvironment) {
    if (!/^[A-Z][A-Z0-9_]*_(?:API_KEY|TOKEN|USERNAME|PASSWORD|CLIENT_ID|CLIENT_SECRET|ADDRESS|ENDPOINT|HOST|PORT)$/.test(name)) throw new Error("Invalid SDK credential environment name");
    allowed.push(name);
  }
  const env = localComputeEnvironment({
    ...Object.fromEntries(allowed.filter((key) => process.env[key]).map((key) => [key, process.env[key]])),
    UV_PROJECT_ENVIRONMENT: path.join(projectRoot, ".openquantum/python-envs", id),
    CARGO_HOME: path.join(projectRoot, ".openquantum/cargo-cache"),
    MPLCONFIGDIR: path.join(projectRoot, ".openquantum/cache", `${id}-matplotlib`),
    PYTHONNOUSERSITE: "1", PYTHONDONTWRITEBYTECODE: "1", MPLBACKEND: "Agg",
    JULIA_NUM_PRECOMPILE_TASKS: "2", JULIA_PKG_PRECOMPILE_AUTO: "0",
    ...(process.env.OPENQUANTUM_JULIA_DEPOT_PATH ? { JULIA_DEPOT_PATH: process.env.OPENQUANTUM_JULIA_DEPOT_PATH } : {}),
  });
  const server = new Server({ name: `openquantum-${id}`, version: "0.1.0" }, { capabilities: { tools: {} } });
  let active;
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: definitions.map(item => item.tool) }));
  server.setRequestHandler(CallToolRequestSchema, async (request, { signal }) => {
    let controller;
    try {
      const definition = definitions.find(item => item.tool.name === request.params.name);
      if (!definition) throw new Error("Unknown tool: " + request.params.name);
      const input = definition.normalize(request.params.name, request.params.arguments);
      if (active) throw new Error("This local capability is busy; retry when its current call completes");
      controller = new AbortController(); active = controller;
      const inputSha256 = sha256(JSON.stringify(input));
      const value = await runLocalJsonProcess({
        ...(launchFor ? await launchFor({ skillRoot, id, dependencyLockSha256, tool: request.params.name }) : runtime === "julia" ? {
          command: process.env.OPENQUANTUM_JULIA || "julia", args: ["--startup-file=no", `--project=${skillRoot}`, path.join(skillRoot, "mcp/bridge.jl")],
          notFoundMessage: "需要 Julia；请先运行 npm run capability:paper-tools:setup",
        } : await preparedPythonLaunch({ skillRoot, id, dependencyLockSha256 })),
        cwd: skillRoot, env: localComputeEnvironment(env, input.execution), input: { input, inputSha256, dependencyLockSha256, source: definition.source, ...(definitions.length > 1 ? { toolName: request.params.name } : {}) },
        signal: AbortSignal.any([signal, controller.signal].filter(Boolean)),
        ...localComputeProcessOptions(input.execution),
        label: id,
      });
      if (!definition.validateOutput(value)
        || value.inputSha256 !== inputSha256 || value.dependencyLockSha256 !== dependencyLockSha256
        || !isDeepStrictEqual(value.input, input)) {
        throw new Error("Scientific bridge returned an invalid result or mismatched provenance");
      }
      return { content: [{ type: "text", text: JSON.stringify(value) }], structuredContent: value };
    } catch (error) {
      return { isError: true, content: [{ type: "text", text: `${id}: ${error.message}` }] };
    } finally {
      if (controller === active) active = undefined;
    }
  });
  const abort = () => active?.abort();
  server.onclose = abort;
  process.stdin.once("end", abort);
  for (const event of ["SIGTERM", "SIGINT"]) process.once(event, () => { abort(); void server.close(); });
  await server.connect(new StdioServerTransport());
}
```

</details>

**依据 5 · 源码核查**：[src/lib/local-compute-policy.mjs:7-23](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/src/lib/local-compute-policy.mjs#L7-L23)

0禁用timeout/output限制

<details>
<summary>查看原文（17行）</summary>

```text

function configuredInteger(name) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return 0;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${name} must be a nonnegative safe integer; 0 disables the limit`);
  return value;
}

export function localComputeProcessOptions(execution = {}) {
  return {
    timeoutMs: execution.timeoutMs ?? configuredInteger("OPENQUANTUM_COMPUTE_TIMEOUT_MS"),
    maxOutputBytes: execution.maxOutputBytes ?? configuredInteger("OPENQUANTUM_COMPUTE_MAX_OUTPUT_BYTES"),
  };
}

export function localComputeEnvironment(environment, execution = {}) {
```

</details>

**依据 6 · 源码核查**：[src/lib/local-json-process.mjs:43-104](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/src/lib/local-json-process.mjs#L43-L104)

进程组与Windows清理失败边界

<details>
<summary>查看原文（62行）</summary>

```text
  maxOutputBytes,
  label,
  notFoundMessage,
}, { platform = process.platform } = {}) {
  signal?.throwIfAborted();
  const stdin = JSON.stringify(input);
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: ["pipe", "pipe", "pipe"],
      // uv can own a Python child. A private POSIX process group lets Stop
      // terminate both without touching the MCP server or sibling calls.
      detached: platform !== "win32",
      windowsHide: true,
    });
    const stdout = [];
    const stderr = [];
    let outputBytes = 0;
    let failure;
    let cleanup;
    let cleanupFailure;
    let exited = false;

    const closeOwnedPipes = () => {
      child.stdin.destroy();
      child.stdout.destroy();
      child.stderr.destroy();
    };
    const stopOwnedProcesses = () => {
      if (cleanup || !child.pid) return;
      if (platform !== "win32") {
        // Use the invocation's process group, never a possibly reused PID.
        // Do this immediately on exit, before any asynchronous continuation.
        try {
          process.kill(-child.pid, "SIGKILL");
        } catch (error) {
          if (error.code !== "ESRCH") cleanupFailure = error;
        }
        cleanup = Promise.resolve();
      } else if (!exited) {
        cleanup = execFileAsync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
          windowsHide: true,
          timeout: 5000,
        }).catch((error) => {
          cleanupFailure = new Error("Failed to stop the local computation process tree", { cause: error });
          if (!exited) child.kill("SIGKILL");
          closeOwnedPipes();
        });
      } else if (failure) {
        // taskkill cannot safely address a root PID after it exits. A child
        // may still own inherited pipes; release our ends and fail explicitly
        // rather than hanging past cancellation or killing a reused PID.
        cleanupFailure = new Error("The Windows bridge exited; descendant termination could not be confirmed");
        cleanup = Promise.resolve();
        closeOwnedPipes();
      }
    };
    const fail = (error) => {
      failure ??= error;
      stopOwnedProcesses();
    };
```

</details>

**依据 7 · 源码核查**：[runtime/chatgpt/native-adapter.mjs:18-29](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/runtime/chatgpt/native-adapter.mjs#L18-L29)

同步native调用只有前后signal检查

<details>
<summary>查看原文（12行）</summary>

```text
    })) }; },
    async callTool({ name, arguments: args = {} }, _schema, { signal } = {}) {
      const tool = definitions.find(item => item.name === name);
      if (!tool) throw new Error("Unknown native tool");
      signal?.throwIfAborted();
      try {
        const value = await tool.execute(args, { signal });
        signal?.throwIfAborted();
        return { content: tool.output.render(args, value), ...(tool.output.schema.type === "object" ? { structuredContent: value } : {}) };
      } catch (error) { return { isError: true, content: [{ type: "text", text: error.message }] }; }
    },
    async close() {},
```

</details>

**依据 8 · 源码核查**：[src/settings/desktop/application.mjs:58-72](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/src/settings/desktop/application.mjs#L58-L72)

Agent abort与资源关闭

<details>
<summary>查看原文（15行）</summary>

```text
  function closeAgent(agent) {
    if (closingAgents.has(agent)) return closingAgents.get(agent);
    disposedAgents.add(agent);
    const promise = agents.get(agent);
    const closing = (async () => {
      if (!promise) return;
      const owner = await promise;
      owner.controller.abort();
      await Promise.all([owner.settings.backend.close(), owner.settings.environments.close()]);
      agents.delete(agent);
    })();
    closingAgents.set(agent, closing);
    // Retain only active teardown work; disposedAgents prevents recreation.
    closing.finally(() => closingAgents.delete(agent)).catch(() => {});
    return closing;
```

</details>

**依据 9 · 源码核查**：[packages/openquantum-web-security/browser-auth.mjs:137-194](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-security/browser-auth.mjs#L137-L194)

启动令牌交换、cookie及未授权处理

<details>
<summary>查看原文（58行）</summary>

```text
  authorizeIndex(req, res) {
    /* v8 ignore next -- node:http always supplies url on server requests. */
    const url = new URL(req.url ?? "/", "http://dsh.invalid");
    const tokens = url.searchParams.getAll(TOKEN_QUERY);
    if (tokens.length > 0) {
      const authority = requestAuthority(req.headers);
      if (req.method === "GET" && url.pathname === "/" && tokens.length === 1 && authority !== void 0 && tokenMatches(tokens.join(""), this.launchToken)) {
        const issuedAt = Date.now();
        const expiresAt = issuedAt + this.maxAgeMilliseconds;
        const value = encodeCookie({
          version: COOKIE_PAYLOAD_VERSION,
          authority,
          issuedAt,
          expiresAt
        }, this.secret);
        res.writeHead(303, {
          "cache-control": "no-store",
          "location": cleanRoot(url),
          "referrer-policy": "no-referrer",
          "set-cookie": sessionCookie(cookieName(authority), value, expiresAt, Math.floor(this.maxAgeMilliseconds / 1e3))
        });
        res.end();
        return false;
      }
      if (req.method === "GET" && url.pathname === "/" && this.isAuthenticated(req)) {
        res.writeHead(303, {
          "cache-control": "no-store",
          "location": cleanRoot(url),
          "referrer-policy": "no-referrer"
        });
        res.end();
        return false;
      }
      this.writeUnauthorized(req, res);
      return false;
    }
    if (this.isAuthenticated(req)) return true;
    this.writeUnauthorized(req, res);
    return false;
  }
  /**
  * Verify the authority-bound browser cookie on a Host request.
  * @param request - request headers carrying Host and Cookie.
  * @returns true only for an unexpired cookie signed by this activation's loaded secret.
  */
  isAuthenticated(request) {
    const authority = requestAuthority(request.headers);
    const rawCookie = header(request.headers, "cookie");
    if (authority === void 0 || rawCookie === void 0) return false;
    const value = cookieValue(rawCookie, cookieName(authority));
    if (value === void 0) return false;
    const payload = decodeCookie(value, this.secret);
    if (payload === void 0 || payload.authority !== authority) return false;
    const now = Date.now();
    return payload.issuedAt <= now && payload.expiresAt > now && payload.expiresAt > payload.issuedAt && payload.expiresAt - payload.issuedAt <= this.maxAgeMilliseconds;
  }
  writeUnauthorized(req, res) {
    res.writeHead(401, {
```

</details>

**依据 10 · 源码核查**：[packages/openquantum-web-security/index.mjs:20-63](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/packages/openquantum-web-security/index.mjs#L20-L63)

HTTP/WS认证与Origin包装

<details>
<summary>查看原文（44行）</summary>

```text
 * producers in the pinned composition wait for openquantumWebSecurity. This
 * preserves the Desktop launcher's loopback/random-port invariant and lifecycle.
 */
export function protectWebServer(server, auth) {
  const requestRejection = request => !auth.isAuthenticated(request) ? 401 : originRejection(request);
  const authorize = (request, response) => {
    if (originRejection(request) !== undefined) {
      response.writeHead(403, { "cache-control": "no-store" });
      response.end("forbidden");
      return false;
    }
    return auth.authorizeIndex(request, response);
  };
  const originals = Object.fromEntries(["register", "registerFallback", "registerUpgrade"].map(name => [name, server[name]]));
  const methods = {
    register(route) {
      return originals.register.call(server, { ...route, handler: (request, response) => {
        if (authorize(request, response)) return route.handler(request, response);
      } });
    },
    registerFallback(handler) {
      return originals.registerFallback.call(server, (request, response) => {
        if (authorize(request, response)) return handler(request, response);
      });
    },
    registerUpgrade(route) {
      return originals.registerUpgrade.call(server, { ...route, handler: (request, socket, head) => {
        const status = requestRejection(request);
        if (status !== undefined) {
          socket.end(`HTTP/1.1 ${status} ${status === 401 ? "Unauthorized" : "Forbidden"}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`);
          return;
        }
        return route.handler(request, socket, head);
      } });
    },
  };
  Object.assign(server, methods);
  return {
    requestRejection,
    authenticatedUrl: url => auth.authenticatedUrl(url),
    dispose() {
      for (const name of Object.keys(methods)) if (server[name] === methods[name]) server[name] = originals[name];
    },
  };
```

</details>

**依据 11 · 源码核查**：[runtime/chatgpt/backend.mjs:15-51](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/runtime/chatgpt/backend.mjs#L15-L51)

Host预算、Ajv配置和投影schema默认声明

<details>
<summary>查看原文（37行）</summary>

```text
export const LIMITS = Object.freeze({ timeoutMs: 180000, maxOutputBytes: 2 * 1024 * 1024, threads: 2, concurrentCalls: 2 });
const ajv = new Ajv({ strict: false, allErrors: true });

function environment(root) {
  // Do not inherit model/API/hardware secrets into numerical tools.
  const allowed = ["PATH", "HOME", "SYSTEMROOT", "WINDIR", "TEMP", "TMP", "TMPDIR", "UV_CACHE_DIR", "UV_PYTHON_INSTALL_DIR", "SSL_CERT_FILE", "SSL_CERT_DIR"];
  return { ...Object.fromEntries(allowed.filter((key) => process.env[key]).map((key) => [key, process.env[key]])), OPENQUANTUM_PROJECT_ROOT: root };
}

export async function connectProvider(provider, root, values = {}, signal, nodeExecutable = process.execPath) {
  const args = provider.kind === "native"
    ? [path.join(root, "runtime/chatgpt/native-server.mjs"), provider.key]
    : [containedPath(root, provider.entrypoint)];
  const fields = serviceById(provider.key)?.fields ?? [];
  const env = { ...environment(root), ...Object.fromEntries(RUNTIME_ENV_NAMES.filter(key => values[key]).map(key => [key, values[key]])), ...Object.fromEntries(fields.filter(field => values[field.name]).map(field => [field.name, values[field.name]])) };
  env.PATH = `${path.dirname(nodeExecutable)}${path.delimiter}${env.PATH ?? ""}`;
  const transport = new StdioClientTransport({ command: nodeExecutable, args, cwd: root, env, stderr: "pipe", maxBufferSize: 4 * 1024 * 1024 });
  transport.stderr?.resume();
  const client = new Client({ name: "openquantum-chatgpt", version: "1.0.0" });
  try {
    signal?.throwIfAborted();
    await client.connect(transport, { timeout: 15000, signal });
    return client;
  } catch (error) {
    await transport.close();
    throw error;
  }
}

export function boundedSchema(schema) {
  const projected = structuredClone(schema);
  if (projected.properties?.execution?.properties) {
    const execution = projected.properties.execution.properties;
    execution.timeoutMs = { type: "integer", minimum: 1, maximum: LIMITS.timeoutMs, default: LIMITS.timeoutMs };
    execution.maxOutputBytes = { type: "integer", minimum: 1, maximum: LIMITS.maxOutputBytes, default: LIMITS.maxOutputBytes };
    execution.threads = { type: "integer", minimum: 1, maximum: LIMITS.threads, default: 1 };
  }
```

</details>

**依据 12 · 源码核查**：[runtime/chatgpt/backend.mjs:149-190](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/runtime/chatgpt/backend.mjs#L149-L190)

并发、连接后禁用复核、调用超时及返回字节检查

<details>
<summary>查看原文（42行）</summary>

```text
    async call(name, args, signal, authorize = async () => true, values = {}, lifecycle = {}) {
      if (closed) throw new Error("计算连接已关闭");
      const route = routes.get(name);
      if (!route) throw new Error("Unknown or unavailable tool");
      if (!route.validate(args)) throw new Error(`Invalid arguments: ${ajv.errorsText(route.validate.errors)}`);
      if (active >= LIMITS.concurrentCalls) throw new Error("计算服务繁忙，请稍后重试。");
      signal?.throwIfAborted();
      active += 1;
      const controller = new AbortController();
      calls.add(controller);
      let settled;
      const drain = new Promise(resolve => { settled = resolve; });
      draining.add(drain);
      let client;
      const combined = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;
      try {
        if (!await authorize()) throw new Error("Tool 已停用");
        combined.throwIfAborted();
        if (route.provider.kind === "external") {
          const result = await externalSessions.call(externalMcp(route.provider.key), args, { signal: combined, authorize,
            values: lifecycle.values ?? (async () => values), acquire: lifecycle.acquire ?? (async () => ({ release: async () => {} })) });
          if (Buffer.byteLength(JSON.stringify(result)) > LIMITS.maxOutputBytes) throw new Error("Tool output exceeds the ChatGPT result budget");
          // ExternalSessions redacts using credentials read during this call,
          // including a newer generation than the initial values snapshot.
          return result;
        }
        client = await connect(route.provider, root, values, combined);
        const actual = await providerTools(client, route.provider, combined);
        if (!isDeepStrictEqual(sortedTools(actual), sortedTools(route.contracts))) {
          throw new Error(`Provider contract changed: ${route.provider.key}; rebuild or reinstall the plugin`);
        }
        if (!await authorize()) throw new Error("Tool 已停用");
        combined.throwIfAborted();
        const result = await client.callTool({ name, arguments: args }, undefined, { timeout: LIMITS.timeoutMs, signal: combined });
        if (Buffer.byteLength(JSON.stringify(result)) > LIMITS.maxOutputBytes) throw new Error("Tool output exceeds the ChatGPT result budget");
        // Service responses must not put credentials into the host conversation.
        // Public endpoints and usernames can match schema values (for example
        // "source" or "text"); only secret fields are token/password material.
        const secrets = (serviceById(route.provider.key)?.fields ?? []).filter(field => field.secret).map(field => values[field.name]);
        return redactToolResult(result, secrets.filter(Boolean));
      } catch (error) {
        // MCP cancellation reaches the provider's existing process-group cleanup
```

</details>

**依据 13 · 源码核查**：[src/lib/science-execution.mjs:1-12](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/src/lib/science-execution.mjs#L1-L12)

底层execution默认空对象、省略继承部署预算

<details>
<summary>查看原文（12行）</summary>

```text
// Representation limits, not computational size budgets.
export const countSchema = (minimum = 1, value) => ({ type: "integer", minimum, maximum: Number.MAX_SAFE_INTEGER, ...(value === undefined ? {} : { default: value }) });
export const finiteSchema = (minimum = -Number.MAX_VALUE, value) => ({ type: "number", minimum, maximum: Number.MAX_VALUE, ...(value === undefined ? {} : { default: value }) });
export const listSchema = (items, minItems = 1) => ({ type: "array", items, minItems });
export const executionSchema = {
  type: "object", additionalProperties: false, default: {}, required: [],
  properties: {
    timeoutMs: { ...countSchema(0), description: "Worker deadline; 0 disables it. Omitted inherits the deployment setting." },
    maxOutputBytes: { ...countSchema(0), description: "Combined stdout/stderr budget; 0 disables it. Omitted inherits the deployment setting." },
    threads: { ...countSchema(1), description: "Thread count for supported numerical kernels. Omitted preserves the user's environment and library defaults." },
  },
};
```

</details>

#### 缺口

- 本机权限组合下的实际资源峰值、跨平台停止耗时与残留进程未测试
  **影响**：无法据Host等待预算和静态清理路径保证计算硬截止、内存上限或无孤儿进程；省略worker限制的大输入仍可能耗尽资源
  **进一步探讨**：采用前设有限预算/超时/输出上限，分别试取消与异常子进程；超出两量子位域直接回原生SDK或专用软件

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、成本、采用和退出需要哪些具体条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

根不是可直接 npm 安装的单个插件，而是 private 工具工程：需要Node>=24及锁定DSH rc.6等依赖；Web脚本在项目cwd以专用 .openquantum/dsh（可显式DSH_HOME）准备Home后启动原DSH web，默认关闭宿主遥测。Desktop另走显式desktop:setup，从固定 dsh-desktop 2.0.0 提交取源码、安装依赖和Electron、构建菜单并写构建标记；遇已有上游源码修改拒绝覆盖。这些下载、磁盘缓存和兼容维护属于采用成本，不是实验热运行耗时。只需原生ground-state不应为目录内每个SDK装全环境；PennyLane等Python SDK需准备选中的锁定环境，find只读、prepare可下载安装且等待回执，缺凭据引导设置而不是聊天索钥。准备等待约30分钟边界并结清所属worker，不是会自动继续科学计算。研究者须具备Hamiltonian与物理域判断能力，还要保留独立工作区、结果包和SDK/模型依赖版本。现金结构为本机CPU/存储、可能的模型API及主动选用外部服务费用，未发现该根自有订阅或统一云算力替代；不能由源码推算金额、峰值或投资回报。建议仅在隔离Home与备份工作区试一项支持域任务，确认工具ready、真实事实/报告与摘要，然后再考虑迁移。退出先停止会话及插件、等待Agent/backend和计算worker清理，保留需复核的结果/凭据设置，再切回原DSH或原SDK脚本；缓存和用户数据应审查后自行清理，不能把删整个DSH_HOME当无损卸载。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-17](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/package.json#L1-L17)

private根及Node>=24

<details>
<summary>查看原文（17行）</summary>

```text
{
  "name": "openquantum",
  "version": "0.8.10",
  "private": true,
  "description": "Quantum research Skills and Tools for DeepSeek Harness Desktop and Codex",
  "author": "OpenQuantum contributors",
  "license": "MIT",
  "keywords": [
    "openquantum",
    "quantum-computing",
    "deepseek-harness",
    "scientific-agent",
    "mcp"
  ],
  "engines": {
    "node": ">=24"
  },
```

</details>

**依据 2 · 源码核查**：[package.json:134-141](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/package.json#L134-L141)

固定DSH rc.6与MCP依赖

```text
  "dependencies": {
    "@deepseek-ai/dsh": "0.1.0-rc.6",
    "@deepseek-ai/dsh-acp": "0.1.0-rc.6",
    "@deepseek-ai/dsh-atomic-write": "0.1.0-rc.6",
    "@deepseek-ai/dsh-cordis-host-runner": "0.1.0-rc.6",
    "@deepseek-ai/dsh-credentials": "0.1.0-rc.6",
    "@deepseek-ai/dsh-mcp-client": "0.1.0-rc.6",
    "@modelcontextprotocol/sdk": "1.32.1",
```

**依据 3 · 源码核查**：[scripts/run-harness.mjs:16-40](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/scripts/run-harness.mjs#L16-L40)

专用Home启动、cwd与遥测默认值

<details>
<summary>查看原文（25行）</summary>

```text
);
loadProjectEnv(projectRoot);
const harnessHome = process.env.DSH_HOME ?? path.join(projectRoot, ".openquantum", "dsh");
await prepareOpenQuantumHarnessHome({ harnessHome, projectRoot });

const child = spawn(
  process.execPath,
  [harnessBin, "web", ...process.argv.slice(2)],
  {
    cwd: projectRoot,
    env: {
      ...process.env,
      DSH_HOME: harnessHome,
      DSH_TELEMETRY_DISABLED: process.env.DSH_TELEMETRY_DISABLED ?? "1",
    },
    stdio: "inherit",
  },
);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => child.kill(signal));
}

child.once("error", (error) => {
  console.error(`Failed to start DeepSeek Harness: ${error.message}`);
```

</details>

**依据 4 · 源码核查**：[scripts/setup-desktop.mjs:26-49](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/scripts/setup-desktop.mjs#L26-L49)

固定源码、修改保护、依赖和Electron准备

<details>
<summary>查看原文（24行）</summary>

```text

await mkdir(path.dirname(directory), { recursive: true });
const fresh = !existsSync(directory);
if (fresh) await run("git", ["clone", "--filter=blob:none", "--no-checkout", DESKTOP_SOURCE.repository, directory], root);
const { stdout } = await exec("git", ["rev-parse", "HEAD"], { cwd: directory });
if (fresh || stdout.trim() !== DESKTOP_SOURCE.revision) {
  await run("git", ["fetch", "--depth", "1", "origin", DESKTOP_SOURCE.revision]);
  await run("git", ["checkout", "--detach", DESKTOP_SOURCE.revision]);
}
const { stdout: changes } = await exec("git", ["status", "--porcelain", "--untracked-files=no"], { cwd: directory });
if (changes.trim()) throw new Error("Desktop 源码有本地修改；为避免覆盖，请先保留这些修改再构建固定版本。");
const dependencySecurity = await installDesktopDependencies(directory, () =>
  run("corepack", ["yarn", "install"], directory, { YARN_ENABLE_IMMUTABLE_INSTALLS: "false" }),
);
await verifyDesktopDependencySecurity(directory, dependencySecurity);
const nativeMenu = await buildDesktopNativeMenu(directory, async () => {
  await run("corepack", ["yarn", "workspace", "dsh-plugin-desktop", "build"]);
  await run("corepack", ["yarn", "workspace", "dsh-plugin-desktop", "exec", "vitest", "run", "tests/electron-runtime.spec.ts", "tests/tray-icons.spec.ts"]);
});
const packageRoot = desktopPackageDirectory(root);
// Upstream disables dependency hooks and exposes native setup explicitly.
await run(process.execPath, [path.join(packageRoot, "node_modules/electron/install.js")]);
await writeFile(path.join(directory, ".openquantum-build.json"), JSON.stringify({ ...DESKTOP_SOURCE, dependencySecurity, nativeMenu }, null, 2));
console.log(`DSH Desktop ready: ${DESKTOP_SOURCE.version} (${DESKTOP_SOURCE.revision.slice(0, 12)}); reviewed native menu extension and security-patched dependencies.`);
```

</details>

**依据 5 · 源码核查**：[scripts/lib/desktop-source.mjs:6-19](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/scripts/lib/desktop-source.mjs#L6-L19)

Desktop/DSH固定版本与缓存目录

<details>
<summary>查看原文（14行）</summary>

```text
export const DESKTOP_SOURCE = Object.freeze({
  repository: "https://github.com/anywhere-labs/dsh-desktop.git",
  revision: "ee1235e1dd1675bbd6c52cfbe3f27b27bcfcfa81",
  version: "2.0.0",
  harnessVersion: "0.1.0-rc.6",
  sessionFormatVersion: 0,
});

export function desktopSourceDirectory(projectRoot) {
  return path.join(projectRoot, ".openquantum/external/dsh-desktop-2.0.0");
}

export function desktopPackageDirectory(projectRoot) {
  return path.join(desktopSourceDirectory(projectRoot), "dsh-plugin-desktop");
```

</details>

**依据 6 · 源码核查**：[src/settings/desktop/preparation.mjs:4-39](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/src/settings/desktop/preparation.mjs#L4-L39)

准备等待边界、所属job结清及ready复核

<details>
<summary>查看原文（36行）</summary>

```text
// The existing installer has a 30-minute limit. Allow its cancellation and
// receipt to settle before the native Tool timeout. No model turn is needed
// while this one Tool call waits for that bounded installation.
export const PREPARATION_TIMEOUT_MS = 1_830_000;

export async function prepareDesktopSkill(settings, input, signal, { timeoutMs = PREPARATION_TIMEOUT_MS, intervalMs = 500, ...options } = {}) {
  const deadline = new AbortController();
  const timer = setTimeout(() => deadline.abort(new Error("等待环境准备超时，请检查网络与安装条件后重试。")), timeoutMs);
  timer.unref();
  const waiting = AbortSignal.any([signal, deadline.signal].filter(Boolean));
  let started, value, waited = false;
  try {
    value = await prepareSkill(settings, input, waiting, { ...options, onStarted: job => { started = job; } });
    const jobId = value.environment?.job?.id;
    while (value.state === "preparing") {
      waited = true;
      await delay(intervalMs, undefined, { signal: waiting });
      // Reuse the existing receipt and policy checks, including changes made
      // in settings while waiting. Never start a replacement or retry here.
      value = await inspectPreparation(settings, input);
      waiting.throwIfAborted();
      if (value.state === "preparing" && value.environment?.job?.id !== jobId) throw new Error("环境准备操作已变化，请重新准备所选 Skill。");
    }
  } catch (error) {
    throw waiting.aborted ? waiting.reason : error;
  } finally {
    try {
      if (started) await settings.environments.finishOwned(started.id, started.jobId, { cancel: waiting.aborted || value?.state !== "ready" });
    } finally { clearTimeout(timer); }
  }
  waiting.throwIfAborted();
  // Finishing the worker is asynchronous. Read policy/readiness once more
  // before returning success; preparation never invokes the scientific Tool.
  if (started || waited) value = await inspectPreparation(settings, input);
  if (value.state === "preparing") throw new Error("环境准备操作已变化，请重新准备所选 Skill。");
  await recordSkill(settings, input.skillId, value.state, { selection: value.selection, ...(value.serviceId ? { serviceId: value.serviceId } : {}) });
```

</details>

**依据 7 · 源码核查**：[src/settings/desktop/application.mjs:78-108](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/src/settings/desktop/application.mjs#L78-L108)

准备、凭据引导与总关闭

<details>
<summary>查看原文（31行）</summary>

```text
      return value.state === "preparing" ? { ...value, next: "Call prepare_openquantum_skill with this selection to wait for completion. Do not poll discovery or execute before ready." } : value;
    },
    prepare(input, exec, options) { return track(async () => {
      const owner = await owned(exec.agent);
      const signal = AbortSignal.any([lifetime.signal, owner.controller.signal, exec.signal]);
      const value = await prepareDesktopSkill(owner.settings, input, signal, options);
      return { ...await describeSdk(value, owner.settings), ...(value.state === "credentials_required" ? { settingsPath: `/openquantum/settings#skill=${encodeURIComponent(value.skillId)}`, instruction: "打开 OpenQuantum 设置填写所缺凭据，保存后在当前聊天继续；不要在聊天中发送密钥。" } : {}) };
    }); },
    execute(name, args, exec, { authorize } = {}) { return track(async () => {
      const owner = await owned(exec.agent);
      authorize?.();
      return owner.settings.callBuiltin(name, args, AbortSignal.any([lifetime.signal, owner.controller.signal, exec.signal]), { cwd: exec.agent.session?.header?.cwd ?? root });
    }); },
    request(input) { return track(async () => {
      if (input.action === "snapshot") return settings.snapshot();
      if (input.action === "credential.field.prepare") return channel.prepare(input);
      if (input.action === "credential.field.commit") return channel.commit(input);
      if (input.action === "skill.prepare") {
        const selection = Object.fromEntries(Object.entries(input).filter(([key]) => !["action", "revision"].includes(key)));
        await prepareSkill(settings, selection, lifetime.signal); return settings.snapshot();
      }
      if (input.action?.startsWith("environment.")) return settings.environmentCommand(input);
      if (!["skill.set", "tool.set", "tool.operation.set", "provider.set"].includes(input.action)) throw new Error("此操作由 Desktop 原生设置管理");
      return settings.command(input);
    }); },
    closeAgent,
    async close() {
      closed = true; lifetime.abort(); channel.close();
      await Promise.all([...agents.keys()].map(agent => closeAgent(agent)));
      await Promise.all([...closingAgents.values()]);
      await Promise.allSettled([...pending]);
```

</details>

#### 缺口

- 首次安装/SDK缓存/模型调用及后续维护的实际金额与耗时未知
  **影响**：无法判断该任务频率下是否值得承担完整工程和双宿主兼容维护；一次性SDK用户尤其可能得不偿失
  **进一步探讨**：记录一次冷安装、选中SDK准备、完成及关闭的资源与人工时间，对照直接SDK脚本并保留独立Home回退

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪项价值假设值得验证，怎样避免把案例当整机收益？

**研究主题**：新假设与验证

#### 完整回答

待验证的具体假设是：对支持域内且需要他人复核的重复任务，固定工具输入、独立校验和摘要结果包能提高交付可重验率，并减少人工补证据的步骤；源码只支持这些步骤已实现，不证明已节省时间。用相同已知两量子位Hamiltonian与失败样例，让同一研究者分别采用原SDK/脚本及OpenQuantum：记录冷准备和热计算、有效结果率、第三方只凭包能否重验、误把fail/not_checked当passed次数和总人工时间；控制相同模型、机器、预算及验收域，并加入超域、低优化预算、写盘拒绝、取消与篡改事实。若重验率无提升、出现错误passed、额外准备维护超过补证据时间，停止采用并保留直接SDK及独立审查流程。README列5.09×/5.69×是作者固定子任务案例，不能推广为平台加速。已细读PennyLane报告：它用OpenQuantum0.8.4的准备定位路径而非本轮0.8.10验收，代表32qubit Pauli对易子包含转换，9轮热中位数不含安装编译；单qubit小任务Rust反慢0.37×，位编码Python与Rust差异也不能全归因语言，更没有有/无OpenQuantum科研生产率对照。该案例明确未走central Acceptance Builder。本轮未运行工具、benchmark、Host、云服务或硬件，因此效果表仅列代码交付和作者受限测量，不把它们混成运行通过。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:276-285](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/README.md#L276-L285)

作者两项特定任务计时与适用限制

<details>
<summary>查看原文（10行）</summary>

```text
## 实测案例

针对固定科研计算的优化，公开完整调用计时、输出和独立参考检查，便于复跑与评估。

| 计算任务 | 原实现 → 优化后 | 测量条件与证据 |
| --- | --- | --- |
| PennyLane Pauli 对易子 | 30.62 ms → **6.02 ms（5.09 倍）** | 32 量子位局域模型；Apple M4、PennyLane 0.45.1、9 轮热运行中位数；[程序、原始计时与独立核验](experiments/pennylane-rust-commutator/README.md) |
| QuTiP Wigner 函数 | 171.77 ms → **30.18 ms（5.69 倍）** | 64 维 Fock 空间、201×201 网格；Apple M4、QuTiP 5.3.1、单线程、9 轮热运行中位数；[程序、原始计时与独立核验](experiments/qutip-rust-wigner/README.md) |

两项计时包含输入输出转换，不含环境准备与编译；收益限于各报告定义的任务与条件，不能推广为所有量子计算的加速比。
```

</details>

**依据 2 · 作者声明**：[experiments/pennylane-rust-commutator/README.md:3-39](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/experiments/pennylane-rust-commutator/README.md#L3-L39)

作者测量、反例与表示/语言贡献界限

<details>
<summary>查看原文（37行）</summary>

```text
实测日期：2026-10-20。工程与数值检查通过，独立审阅通过；central Acceptance Builder 未参与，本案例不宣称生成正式科学 Acceptance Report。

## 实测结论

实测硬件 Apple M4 上，PennyLane 0.45.1 的代表案例为 **30.62 ms → 6.02 ms，5.09×**。该任务计算一个 32 量子位、125 项局域 Hamiltonian 与一个含 512 项的二体算符和的**单个对易子**。时间包含从 PennyLane 对象转入 Rust、计算、返回及重建 PennyLane 对象。

位编码 Python 的完整调用为 9.50 ms，Rust 为 6.02 ms，后一步的收益为 1.58×。同为预编码输入时，Python 内核 4.198 ms，Rust 内核 0.213 ms，约 19.72×。整体加速同时包含数据表示与执行实现的变化，不能全部归因于 Rust 语言。

![所有预定义场景的完整调用耗时与加速比](results/timings.png)

| 场景 | PennyLane / ms | 位编码 Python / ms | Rust 完整调用 / ms | 完整调用加速 | 非零输出项 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 单比特 X 与 Y | 0.001359 | 0.003619 | 0.003715 | 0.37× | 1 |
| 4 位随机算符和，16 × 16 项 | 0.301991 | 0.192102 | 0.156058 | 1.94× | 110 |
| 16 位稠密随机，64 × 64 项 | 10.191042 | 6.254459 | 5.731542 | 1.78× | 2063 |
| 16 位稠密随机，128 × 128 项 | 40.388833 | 24.679916 | 22.259000 | 1.81× | 8298 |
| 16 位稠密随机，256 × 256 项 | 162.220167 | 99.680375 | 89.940292 | 1.80× | 32687 |
| 32 位稠密随机，256 × 256 项 | 290.283625 | 193.913167 | 183.234500 | 1.58× | 32777 |
| 32 位局域 H 与二体算符和，125 × 512 项 | 30.621250 | 9.502542 | 6.018459 | 5.09× | 4325 |
| 64 位稀疏随机，256 × 256 项 | 36.744500 | 16.011791 | 11.173875 | 3.29× | 5888 |
| 32 位全可交换，输出为零 | 30.489333 | 2.880167 | 0.471958 | 64.60× | 0 |

单比特小任务的完整 Rust 调用更慢；全可交换场景返回零，因而可以很快跳过构造输出。两者均保留在全表中。全可交换场景的大倍数不能概括一般任务。代表案例是对算符和的一次对易子计算，文件 ID 中的 pool512 不表示做了 512 次独立梯度计算。

## 研究问题与范围

计算 [H, A] = HA − AH。代表输入是各向异性 Heisenberg 链加局域 Z 场，以及随机固定实系数的二体可观测量之和。它可用于海森堡方程的算符计算步骤；本次没有积分时间演化或计算完整算法的运行时间。

本原型只处理固定、有限的 binary64 实数/复数系数，最多 64 个可映射 wire，返回 PauliSentence；不做近似截断，只移除精确零项。拒绝自动微分量、广播数组、非有限系数、超出支持精度的系数和结果溢出。它是一个算符代数子任务，不是 PennyLane 整体、完整 VQE/ADAPT 或量子模拟器的性能测试。

## 为什么同时测 Python 位编码

位编码 Python 的完整调用为 9.50 ms，Rust 为 6.02 ms，后一步的收益为 1.58×。同为预编码输入时，Python 内核 4.198 ms，Rust 内核 0.213 ms，约 19.72×。整体加速同时包含数据表示与执行实现的变化，不能全部归因于 Rust 语言。

Pauli word 写成 P(x,z)=i^popcount(x&z) X^x Z^z。对易的项对直接跳过；反对易时使用 [P,Q]=2PQ，保留复相位与系数合并。Python 控制与 Rust 使用同样的位掩码、预计算 Y 计数、相位、筛选和累加顺序。相位指数可为负数，Rust 使用有符号余数规范化。

PennyLane 基线直接调用其优化的 `PauliSentence.commutator()`，不使用更慢的两次乘法作为基线。原型未使用 GPU、并行 Rust 或有损系数截断。输入、双向转换及输出对象构造均计入主要完整调用指标；预编码内核时间仅作分解。
```

</details>

**依据 3 · 作者声明**：[experiments/pennylane-rust-commutator/README.md:43-61](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/experiments/pennylane-rust-commutator/README.md#L43-L61)

测量条件、0.8.4路径及无生产率对照

<details>
<summary>查看原文（19行）</summary>

````text
独立 Kronecker 矩阵穷举覆盖 1–3 位全部 4,368 对 Pauli 单项，结果精确一致。40 组随机复系数算符和同时比较全部 Pauli 系数与独立矩阵，最大矩阵绝对误差 1.42e-14。另外覆盖相消、极小非零系数、混合 wire 标签、实际 64-wire 往返、65-wire 拒绝和非有限结果拒绝；共 96 条验证记录。9 个计时场景中的四种对照实现也逐项核对，全部通过。

固定 plan.json 中的输入类型、规模与 seed；同进程、每方法预热 2 次，9 轮打乱方法次序，报告中位数、四分位区间及全部 405 条原始样本。小任务自动批量重复，最多 16,384 次/样本；较大任务通常每样本 1 次。计时使用 perf_counter_ns，计时期间关闭循环 GC。Rust 单线程，释放 GIL 不启动线程；BLAS/OpenMP 等环境上限设为 1。生成输入、核验、环境安装和编译不计入热运行耗时。未专门测量峰值内存，未做跨机器或跨平台性能验收。

首次本地 release 构建 12.05 s（Rust crates 已缓存），复核后增量构建 1.69 s。它们与 SDK 准备均不包含在热运行时间中。

## OpenQuantum 实际路径与复跑

本案例读取已安装 OpenQuantum 0.8.4 的 `pennylane-differentiable` Skill。已安装 MCP 服务的实际 tools/list 返回发现与准备入口；通过 MCP 协议依次执行 find_openquantum_skills、prepare_openquantum_skill，并查询至 ready。随后由 Skill 的 SDK 定位器返回固定 PennyLane 0.45.1 环境，宿主代码工具执行本目录的 Rust 构建、Python 验证和计时。未修改插件代码、能力开关、共享 SDK 的包版本或模型路由。

本聊天的可见工具清单没有发现/准备入口，因此准备回执来自对同一已安装 MCP 服务的直接协议调用；本次不把它称为原生侧边页点击、原生 Tool 菜单或新用户安装体验验收。该案例展示了完成研究软件实验的一条路径，没有做“有/无 OpenQuantum”的科研生产率对照。

```bash
# 先由 OpenQuantum 为本任务准备 pennylane-differentiable 的原生 SDK。
# LOCATOR 是已安装 Skill 的 scripts/sdk-access.mjs 的绝对路径。
python3 reproduce.py --locator "$LOCATOR" --node "$NODE" --steps build validate benchmark export_outputs
```

`reproduce.py` 每次运行先通过已安装 Skill 的定位器检查权限与 prepared 状态，使用返回的解释器及 environment；它不会安装依赖或更改能力开关。Rust 依赖由 Cargo.lock 固定，build 步骤显式调用 cargo build --release --locked。图表可用已有 Matplotlib 环境运行 `python report.py` 再生成；绘图环境不参与科学计算。
````

</details>

**依据 4 · 源码核查**：[.agents/skill-contracts/src/result-commit.mjs:637-676](https://github.com/xi-zhao/OpenQuantum/blob/0da563fa87c6592a8923d2eb98eea80f484d2151/.agents/skill-contracts/src/result-commit.mjs#L637-L676)

可复核提交绑定实际文件及摘要

<details>
<summary>查看原文（40行）</summary>

```text
export function buildResultCommit({
  capability,
  resultPackage,
  acceptanceReport,
  scoreReport,
  reproductionReport,
  artifactRoot = resultPackage.root,
}) {
  const root = fs.realpathSync(path.resolve(artifactRoot));
  const resultPackageRef = relativeFileRef(
    root,
    resultPackage.path,
    "resultPackage.path",
  );
  const artifacts = resultPackage.value.artifacts.map((artifact) => {
    const absolutePath = path.resolve(resultPackage.root, artifact.path);
    return {
      id: artifact.id,
      type: artifact.type,
      mediaType: artifact.mediaType,
      ...relativeFileRef(root, absolutePath, `artifact ${artifact.id}.path`),
    };
  });

  const commit = {
    kind: "openquantum.result-commit",
    schemaVersion: "1.0",
    createdAt: resultPackage.value.createdAt,
    capability: {
      id: capability.manifest.id,
      version: capability.manifest.version,
      manifestSha256: digestFile(capability.manifestPath),
    },
    resultPackage: {
      packageId: resultPackage.value.packageId,
      ...resultPackageRef,
    },
    ...(acceptanceReport
      ? {
          acceptanceReport: {
```

</details>

#### 缺口

- 当前版本对真实研究任务的重验率和端到端净收益未做对照
  **影响**：不能把作者旧版局部热运算加速升级为当前版本安装体验、科研效率或科学可靠性收益
  **进一步探讨**：以同输入双路径比较重验率/误接受/总工时，失败、低预算、写盘拒绝和取消任一出现虚假passed即否定采用

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
