# dsh-subagent

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b548020](https://github.com/1373700184/dsh-subagent/tree/b548020a6c36521d93a0d9a2ec08e6f74961e8a2)

<!-- BEGIN META -->
[![npm 30d 33](https://img.shields.io/static/v1?label=npm+30d&message=33&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-subagent) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-subagent)
<!-- END META -->

> **功能**：把本机编码CLI接为DSH子代理，提供调度、进度与崩溃重接；尝试归属、总预算与退出仍需验收。

> **亮点**：把多个CLI的argv/事件与宿主结果契约接起来，持久日志先折叠再判死，共享槽降低各宿主各算一份的并发失控；这些是可检查编排机制，未证明任务质量、硬账户预算或正确恢复。见[Q02](#research-q02)。

> **主要限制**：默认bypass可绕过批准/沙箱，300秒仅首JSON等待而非总墙钟；模型尝试复用id/追加日志与单次终态对象，面板/计量可能不对应最终结果，Unix killTree也只杀直接child。具体源码条件未作运行故障复现，见[Q03](#research-q03)。

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
  - [Q01 · 它提供什么委派成果，父Agent、插件和外部CLI的自主能力归谁？](#detail-section-11)
  - [Q02 · 从委派工具到真实进程、结果和父任务，调度与事件如何接上？](#detail-section-12)
  - [Q03 · 默认权限、等待、模型重试、取消和恢复有哪些具体责任边界？](#detail-section-13)
  - [Q04 · 依赖、诊断/更新、四阶段成本和效果应怎样验收？](#detail-section-14)
  - [Q05 · 现有恢复/共享并发之外，什么增量仍值得验证？](#detail-section-15)
  - [Q06 · 现在如何采用，何时应停止或回退？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有多CLI账号的DSH用户分派自包含独立任务，以正确子产物及父任务验收为单位；进程0、completed或notice均不是业务办结。见[Q01](#research-q01)。

相对手动多终端，集中启动/查询/调度和重接；若只用一个CLI，原生单后端/终端更简单。订阅、模型、CLI工具循环和官方harness是继承能力，不因后端数计原创。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 多CLI委派 | 把自包含子任务送实际后端并交回结果 | CLI自装登录/循环，自动调度可改实际账号，产物另验 |
| 原生协调入口 | 动态工具、命令与父Agent预设 | 上下文不继承，规划/验收提示不是质量门禁 |
| 进度/恢复/并发 | 文件日志、共享槽、PID重接/父notice | 尝试与终态/计量未隔离；非硬额度/只一次消费 |
| Web管理 | 探测、设置、更新及工具行状态 | 探测运行CLI，更新有副作用；宿主访问/升级互斥另验 |

**流程与依赖**

真实执行前提是已授权CLI/账号、匹配宿主、完整任务与明确工作区/权限；自动溢出改变实际后端，入口名不锁账户。完整条件和平台差异表见[Q04](#research-q04)。

只启一个已授权后端先验正确产物，再加重试/恢复与并发；更新另有状态副作用，停用先查在途而非重发同任务。步骤及成功/退出判据见[Q04](#research-q04)。

**效果与成本**

成本应按所有模型/后端尝试、父验收与未停止进程结算；展示credits和300秒等待不能充当全任务预算。四阶段表见[Q04](#research-q04)，真实费用/工时未知。

当前可检查价值是集中委派与恢复线索；对重试任务还须分清最终文本、面板、元数据和真实动作，不能把计数/状态当完成率。效果表见[Q04](#research-q04)，最强简单替代见[Q05](#research-q05)。

> **思考**：默认bypass可绕过批准/沙箱，300秒仅首JSON等待而非总墙钟；模型尝试复用id/追加日志与单次终态对象，面板/计量可能不对应最终结果，Unix killTree也只杀直接child。具体源码条件未作运行故障复现，见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把多个CLI的argv/事件与宿主结果契约接起来，持久日志先折叠再判死，共享槽降低各宿主各算一份的并发失控；这些是可检查编排机制，未证明任务质量、硬账户预算或正确恢复。见[Q02](#research-q02)。

detached落盘与先读尾部再判死值得借鉴，须同时设计attempt身份、进程所有权与父消费回执；shared gate是同名后端协调而非硬账户额度，方法名killTree/恢复日志也不是外部办结证明。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认bypass可绕过批准/沙箱，300秒仅首JSON等待而非总墙钟；模型尝试复用id/追加日志与单次终态对象，面板/计量可能不对应最终结果，Unix killTree也只杀直接child。具体源码条件未作运行故障复现，见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，先修/验attempt归属、权限/总墙钟和进程停止，再以一项可回滚子任务比较终端基线；有跨账号、停止后写入或不确定结果重发就停新委派，见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根运行源码支持实际委派/日志/结果接线；尝试记录、权限/预算/进程/父消费未闭环，未运行CLI或真实任务。观察，先修/验关键边界。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、lib/client.js、lib/hidden-runner.cjs、lib/hidden-runner.ps1、lib/index.js、lib/shared-gate.js、package.json、scripts/build-client.mjs、src/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根/补丁与tracked运行lib，定向核动态工具/provider、Qoder/Codex及OpenCode/Pi结果分支、调度/shared-gate、真实spawn/Windows runner、日志/尝试状态/预算/取消/重接/notice、probe/update和客户端RPC/注册。未全审所有CLI/驱动事件、客户端设置/CSS、宿主connection/官方harness内部或真实账号/工具循环；未运行任何目标或CLI。PS1因sparse未落盘，以固定Git blob补原文。
- 下一步：仅只读固定Git/准备原件及研究装配校验；未安装、构建、执行目标测试/CLI/probe/update、调用模型或真实写入。后续核初始JSON后挂起、先失败后成功、父消费/重启、后代取消及全尝试费用，对照真实产物和总工时，见[Q06](#research-q06)。

**分析版本**

- **仓库**：[1373700184/dsh-subagent](https://github.com/1373700184/dsh-subagent)
- **版本号**：1.1.10（[固定提交 b548020](https://github.com/1373700184/dsh-subagent/tree/b548020a6c36521d93a0d9a2ec08e6f74961e8a2)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先修每attempt身份/独立日志与终态、总墙钟和可验停止，再验证稳定完成回执及父消费确认是否胜过小修补；用真实可回滚案件测误标/重复动作、恢复工时和全尝试费用，无优势就不做独立协议。未实现/未验证，见[Q05](#research-q05)。

仅只读固定Git/准备原件及研究装配校验；未安装、构建、执行目标测试/CLI/probe/update、调用模型或真实写入。后续核初始JSON后挂起、先失败后成功、父消费/重启、后代取消及全尝试费用，对照真实产物和总工时，见[Q06](#research-q06)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

下表仅统计表中所列语言／扩展名；本轮实际核查的关键文件 `lib/hidden-runner.ps1` 未计入该表，因此表中数值不是仓库完整的全语言代码量。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 190 | — | — | 3100 |
| .js | source | 4 | 3651 | 3361 | 200 | — |
| .cjs | source | 1 | 21 | 18 | 2 | — |
| .mjs | source | 1 | 40 | 35 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1373700184/dsh-subagent/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/1373700184/dsh-subagent/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1373700184/dsh-subagent/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核一个自包含CLI子任务的真实执行/结果、尝试归属、权限/预算与进程/父消费恢复，比较多终端基线后决定采用与剩余机会。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它提供什么委派成果，父Agent、插件和外部CLI的自主能力归谁？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

这是根DSH插件dsh-subagent1.1.10、MIT，入口lib/index.js和客户端lib/client.js均提交在固定Git中；Node声明^22.19.0或>=24，宿主peer要求0.2.1-rc.2到0.3.0之前。补丁除了插件，还插入自由子代理预设及一组宿主工具。源码实际按启用配置动态注册官方ToolSubagent插件和自己的provider，再挂可用CLI的用户指令；不是只列几个命令名称。源码入口存在不等本轮安装/兼容已验，预设依赖也不由一个peer版本自动覆盖。

对象是已安装登录多个编码CLI、希望在DSH里分派独立子任务的人；单位成果是子任务正确产物被父任务核验并纳入目标，而不是进程退出0、活动记录completed或完成notice。与手动多终端相比，增量是后端调度、统一句柄/结果、进度、日志和重启重接；自包含上下文、边界定义及验收仍由父Agent/操作者负责。订阅、模型、CLI本身及官方子代理工具是依赖，不计为本插件原创。

provider明确不继承父会话上下文，promptText仅拼文本块。父端预设让DSH模型规划、调用委派工具、看结果再核验；外部CLI自行实现其模型和工具循环，本插件只构造进程参数、送入任务并解析事件，不是在sink.tool里再执行工具或重新调用模型。Qoder/Codex驱动可识别工具调用/命令结果事件，这是接线证据，不是各CLI真实版本工具循环已验收。预设中的“验收”是给模型的指令，不是机器强制的业务质量门禁；父模型是否采用正确结果仍需真任务验证。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-32](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/package.json#L1-L32)

根包版本、入口和web声明。

<details>
<summary>查看原文（32行）</summary>

```text
{
  "name": "dsh-subagent",
  "version": "1.1.10",
  "description": "把本机 Qoder、QoderCN、Codex、Claude、OpenCode、Pi、CodeBuddy 等外部 CLI 注册为 DSH 子代理后端,支持模型故障转移链、实时进度、额度显示、设置页与斜杠指令。",
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/*.js",
    "lib/*.cjs",
    "lib/*.ps1",
    "src/*.js",
    "cordis.patch.yml",
    "README.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
  "scripts": {
    "build": "node scripts/build-client.mjs"
  },
  "keywords": [
```

</details>

**依据 2 · 作者声明**：[package.json:46-58](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/package.json#L46-L58)

Node及宿主peer边界。

<details>
<summary>查看原文（13行）</summary>

```text
    "node": "^22.19.0 || >=24.0.0"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-session": ">=0.2.1-rc.2 <0.3.0",
    "@deepseek-ai/dsh-subagent": ">=0.2.1-rc.2 <0.3.0",
    "@deepseek-ai/dsh-tool-subagent": ">=0.2.1-rc.2 <0.3.0",
    "@deepseek-ai/dsh-tools": ">=0.2.1-rc.2 <0.3.0",
    "@deepseek-ai/schemastery": "^3.18.2",
    "@deepseek-ai/dsh-llm": ">=0.2.1-rc.2 <0.3.0"
  },
  "devDependencies": {
    "esbuild": "^0.25.0",
    "puppeteer-core": "^25.14.0",
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-35](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/cordis.patch.yml#L1-L35)

真正插入插件、预设与父Agent协作指令。

<details>
<summary>查看原文（35行）</summary>

```text
# 注册 dsh-subagent 提供方插件;委派工具由插件按“已启用后端”动态挂载,
# 预设与斜杠指令同样跟随启用项,因此这里只需插入插件本身。
- insert:
    - id: subagent-cli
      name: 'dsh-subagent'

    # Agent 预设:让 dsh 本地模型担任指挥,把任务委派给上面的外部 CLI 后端,
    # 像一个小团队一样协调它们。
    - id: preset-free-subagents
      name: '@deepseek-ai/dsh-agent-preset'
      config:
        id: free-subagents
        name: 自由子代理
        description: dsh 本地模型做指挥,把任务分派给已启用的外部 CLI 子代理并行执行并验收结果。
        order: 20
        plugins:
          - id: persona
            name: '@deepseek-ai/dsh-persona'
            config:
              prefix: |
                你是运行在 {{model}} 上的子代理指挥官。你的职责是规划、分派、监督与验收,而不是独揽执行。

                可用后端(通过委派工具调用;只使用下面列出的,未启用的后端不会出现):
                {{subagent_backends}}
                - sub_agent_status:随时查询任意委派的进度,不必盲等。

                工作方式:
                1. 规划:把任务拆成可独立验收的子任务,标出依赖关系与验收标准。
                2. 分派:独立子任务并行发出,有依赖的串行;调度与并发上限由插件自动处理,你直接调用合适的委派工具并让委派内容自带完整上下文。
                3. 委派内容必须自带完整上下文:子代理看不到本对话,写清目标、路径、约束与验收标准。
                4. 监督:分派后不要空转等待,用 sub_agent_status 查询进度;静默过久或失败时切换模型或改派。
                5. 验收:汇总子代理产出并独立核验关键数字与结论,差异要说明来源。
                6. 汇报:给出分工、各子代理产出摘要、核验结果、未完成项与风险。

                原则:能并行就并行;绝不伪造子代理输出;子代理失败时如实报告并给出补救方案。
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1739-1769](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L1739-L1769)

实际官方委派工具/provider及可用CLI指令注册。

<details>
<summary>查看原文（31行）</summary>

```text
			registrations.delete(providerName);
		}
		for (const [providerName, entry] of entries) {
			let record = registrations.get(providerName);
			if (!record) {
				record = { provider: undefined, command: undefined, tool: undefined };
				registrations.set(providerName, record);
			}
			if (!record.tool) {
				const fiber = ctx.plugin(ToolSubagentPlugin, { provider: providerName, toolName: providerName, maxDepth: "provider-managed" });
				record.tool = () => {
					void fiber.dispose?.();
				};
			}
			if (!record.provider) {
				record.provider = ctx.subagents.registerProvider(new QoderJsonProvider(
					providerName,
					() => liveSpec(providerName),
					(id) => ctx.get("agents")?.get?.(id),
					schedule,
				));
			}
			// 只有本机确实存在对应 CLI 时斜杠指令才有用;
			// 否则跳过,避免指令菜单出现死路。
			const commandBinary = resolveBinary(providerName, entry.binary);
			const commandAvailable = Boolean(commandBinary && existsSync(commandBinary));
			if (commandAvailable && !record.command) record.command = buildCommand(providerName);
			else if (!commandAvailable && record.command) {
				record.command();
				record.command = undefined;
			}
```

</details>

**依据 5 · 源码核查**：[lib/index.js:306-332](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L306-L332)

不继承父上下文及实际start。

<details>
<summary>查看原文（27行）</summary>

```text
class QoderJsonProvider {
	name;
	capabilities = NO_START_CAPABILITIES;
	inheritsParentContext = false;
	#getSpec;
	#getAgent;
	#getSchedule;

	constructor(name, getSpec, getAgent, getSchedule) {
		this.name = name;
		this.#getSpec = getSpec;
		this.#getAgent = getAgent;
		this.#getSchedule = getSchedule;
	}

	async start(request) {
		assertUsableCwd(this.name, "cwd", request.cwd);
		const spec = this.#getSpec();
		if (!spec) {
			throw new Error(`${this.name}: provider is no longer present in the dsh-subagent config.`);
		}
		const prompt = promptText(request.prompt);
		const id = SessionId(randomUUID());
		const activity = activityLedger.begin({ id, provider: this.name, label: request.label ?? "", prompt: prompt.slice(0, 160), stallWarnSeconds: spec.stallWarnSeconds });
		let currentRun;
		let cancelled = false;
		let lastDiagnostic;
```

</details>

**依据 6 · 源码核查**：[lib/index.js:711-718](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L711-L718)

仅拼文本，不宣称无损传递所有块。

```text
function promptText(blocks) {
	return blocks
		.map((block) => (block && block.type === "text" ? block.text : ""))
		.filter(Boolean)
		.join("\n");
}

//#region 活动账本(聊天工具行的实时进度)
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从委派工具到真实进程、结果和父任务，调度与事件如何接上？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

按启用配置创建ToolSubagent(provider/toolName)后，provider.start核cwd、取实时spec，生成runId并记录活动。scheduler在存在CLI路径的后端中选槽：priority从所请求后端向后找，balanced按当前占用/使用次数选择，选择后会记录真实后端；工具叫codex不保证最终一定由Codex账号执行。若任务只允许特定服务/账户，应限制启用后端，不能把入口名称当授权锁。排队在runChain之前，可取消但没有被模型链的deadline覆盖。

实际执行不是空壳：driver构造argv，spawnCommand处理node启动、cmd包装等差异，QoderJsonRun用request.cwd启动直接CLI或Windows外层runner，继承环境并合并额外项，任务经stdin发送，stdout/stderr直接落盘、detached并unref；Windows另经隐藏runner→PowerShell→Start-Process。所读PS1是固定Git regular blob，因准备checkout的sparse规则未落盘，已用git show补保存，不能误说仓库缺此文件。外部CLI的shell/MCP动作由CLI执行，插件只折叠JSON事件；没有在解析sink.tool后自行执行shell的第二条循环。

以Qoder为例，result事件提供文本/错误，assistant事件累积文本；Codex把thread/item/turn事件映成session、活动和结果；OpenCode/Pi另允许以进程退出作为收敛依据。run等待进程close后按结果事件、超时或退出码组装SubagentResult，再经settleRunResult/subprocessRunHandle交回官方宿主工具。父消费/继续决策属于宿主；本插件自有迟到通知另用agent.followup。completed是协议/进程结果，不是产物正确；空文本也不被一概当业务失败，不能拿状态省略独立验收。

共享gate以临时目录、独占创建槽文件、token/PID及心跳约束共享同一临时根的同名后端跨宿主并发，恢复运行可reserve占位；这是比单进程计数更具体的机制。它仍非全账户成本上限：目录不可用会退本进程内存计数，宿主死/心跳超时可回收而detached CLI可能仍在，重接前有窗口；不同后端名/配置也不自动代表同一真实账号。应把并发槽、运行身份和付费资源分开核验。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:267-298](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L267-L298)

实际scheduler选择/等待与共享槽。

<details>
<summary>查看原文（32行）</summary>

```text
class ProviderScheduler {
	#uses = new Map();
	async acquire(specs, requested, mode, signal, onWait) {
		const pool = specs.filter((spec) => spec.binary && existsSync(spec.binary));
		if (pool.length === 0) throw new Error("no enabled provider has a usable CLI binary");
		const requestedAt = pool.findIndex((spec) => spec.name === requested);
		for (;;) {
			if (signal?.aborted) throw new Error("cancelled");
			let ordered;
			if (mode === "balanced") {
				ordered = [...pool].sort((a, b) =>
					providerGate.active(a.name) - providerGate.active(b.name)
					|| (this.#uses.get(a.name) ?? 0) - (this.#uses.get(b.name) ?? 0)
					|| pool.indexOf(a) - pool.indexOf(b));
			} else {
				ordered = pool.slice(requestedAt >= 0 ? requestedAt : 0);
			}
			for (const spec of ordered) {
				const release = providerGate.tryAcquire(spec.name, spec.maxConcurrency);
				if (release) {
					this.#uses.set(spec.name, (this.#uses.get(spec.name) ?? 0) + 1);
					return { spec, release };
				}
			}
			onWait?.();
			await new Promise((resolve) => setTimeout(resolve, 250));
		}
	}
}
const providerScheduler = new ProviderScheduler();

//#region qoder-json 驱动
```

</details>

**依据 2 · 源码核查**：[lib/index.js:404-448](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L404-L448)

选择后runChain、finally释放、结果句柄返回。

<details>
<summary>查看原文（45行）</summary>

```text
			const selected = await providerScheduler.acquire(
				schedule.specs,
				this.name,
				schedule.mode,
				request.signal,
				() => {
					if (waiting) return;
					waiting = true;
					activity.record("queue", "所有可用后端均已达到并发上限(含其他 dsh 任务),等待空位");
				},
			);
			const target = selected.spec;
			activity.provider(target.name);
			activity.record("queue", target.name === this.name
				? `使用 ${target.name}(并发上限 ${target.maxConcurrency ?? 2})`
				: `已从 ${this.name} 转给 ${target.name}(并发上限 ${target.maxConcurrency ?? 2})`);
			try {
				return await runChain(target);
			} finally {
				selected.release();
			}
		};

		const result = settleRunResult({
			attempt,
			collectOutput: () => [],
			collectDiagnostic: () => lastDiagnostic,
			cancelled: () => cancelled,
			signal: request.signal,
			onAbort,
		});
		return subprocessRunHandle({
			id,
			result,
			signal: request.signal,
			onAbort,
			requestCancel: () => {
				cancelled = true;
				void currentRun?.dispose();
			},
			teardown: async () => {
				await currentRun?.dispose();
			},
		});
	}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1088-1127](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L1088-L1127)

真实spawn、cwd/环境、stdin、detached/unref和meta。

<details>
<summary>查看原文（40行）</summary>

```text
				Stdout: this.#logPath,
				Stderr: this.#errPath,
				Env: opts.env ?? {},
			}));
			this.#child = spawn(process.execPath, [HIDDEN_RUNNER, this.#configPath, this.#runnerErrPath], {
				cwd: opts.cwd,
				stdio: "ignore",
				windowsHide: true,
				detached: true,
			});
		} else {
			const outFd = openSync(this.#logPath, "a");
			const errFd = openSync(this.#errPath, "a");
			try {
				this.#child = spawn(opts.command, opts.args, {
					cwd: opts.cwd,
					stdio: ["pipe", outFd, errFd],
					windowsHide: true,
					detached: true,
					...(opts.env ? { env: { ...process.env, ...opts.env } } : {}),
				});
			} finally {
				closeSync(outFd);
				closeSync(errFd);
			}
			this.#child.stdin.on("error", () => {});
			this.#child.stdin.write(opts.prompt);
			this.#child.stdin.end();
		}
		this.#child.unref();
		this.#meta = {
			id: this.#id,
			provider: opts.provider ?? "",
			driver: opts.driverName ?? "",
			label: opts.label ?? "",
			prompt: opts.promptSummary ?? "",
			parentId: opts.parentId ?? "",
			pid: this.#child.pid ?? null,
			startedAt: Date.now(),
			status: "running",
```

</details>

**依据 4 · 源码核查**：[lib/hidden-runner.cjs:1-21](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/hidden-runner.cjs#L1-L21)

Windows实际启动PowerShell的caller。

<details>
<summary>查看原文（21行）</summary>

```text
const { spawn } = require("node:child_process");
const { openSync } = require("node:fs");
const path = require("node:path");

// 以隐藏控制台托管 CLI:本进程保持 detached 以便 dsh 崩溃后继续运行,
// PowerShell 为 CLI 创建不可见控制台,避免其 shell 子进程弹黑框。
const configPath = process.argv[2];
const errPath = process.argv[3];
if (!configPath) process.exit(2);
let errFd = "ignore";
try {
	if (errPath) errFd = openSync(errPath, "a");
} catch {}
const child = spawn("powershell.exe", [
	"-NoProfile",
	"-ExecutionPolicy", "Bypass",
	"-File", path.join(__dirname, "hidden-runner.ps1"),
	"-ConfigPath", configPath,
], { windowsHide: true, stdio: ["ignore", "ignore", errFd] });
child.on("error", () => process.exit(1));
child.on("exit", (code) => process.exit(code ?? 0));
```

</details>

**依据 5 · 源码核查**：[lib/hidden-runner.ps1:1-26](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/hidden-runner.ps1#L1-L26)

PowerShell实际Start-Process并等退出；补固定Git原件。

<details>
<summary>查看原文（26行）</summary>

```text
param([string]$ConfigPath)
$ErrorActionPreference = 'Stop'
$cfg = Get-Content -Raw -LiteralPath $ConfigPath | ConvertFrom-Json
if ($cfg.Env) {
    foreach ($item in $cfg.Env.PSObject.Properties) {
        Set-Item -Path "Env:$($item.Name)" -Value ([string]$item.Value)
    }
}
$startParams = @{
    FilePath = $cfg.File
    RedirectStandardInput = $cfg.Stdin
    RedirectStandardOutput = $cfg.Stdout
    RedirectStandardError = $cfg.Stderr
    WindowStyle = 'Hidden'
    PassThru = $true
}
if ($cfg.Arguments) { $startParams.ArgumentList = $cfg.Arguments } else { $startParams.ArgumentList = '' }
$p = Start-Process @startParams
$p.WaitForExit()
for ($i = 0; $i -lt 20; $i++) {
    if ($null -ne $p.ExitCode) { break }
    Start-Sleep -Milliseconds 50
}
$code = $p.ExitCode
if ($null -eq $code) { $code = 0 }
exit $code
```

</details>

**依据 6 · 源码核查**：[lib/index.js:456-488](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L456-L488)

Qoder真实事件callee与result协议。

<details>
<summary>查看原文（33行）</summary>

```text
const DRIVERS = {
	"qoder-json": {
		buildArgs(spec, model) {
			const args = ["-p", "--input-format", "text", "--output-format", "stream-json", "--permission-mode", spec.permissionMode];
			if (model) args.push("--model", model);
			if (spec.reasoningEffort && spec.reasoningEffort !== "auto") args.push("--reasoning-effort", spec.reasoningEffort);
			if (spec.contextWindow) args.push("--context-window", String(spec.contextWindow));
			args.push(...(spec.extraArgs ?? []));
			return args;
		},
		consume(event, sink) {
			sink.session(event.session_id);
			if (event.type === "result") {
				sink.credits({ total: typeof event.total_credits === "number" ? event.total_credits : 0, billable: sink.billable(), model: sink.modelName() });
				sink.result(typeof event.result === "string" ? event.result : "", event.is_error === true);
				return;
			}
			if (event.type === "assistant" && event.message?.usage) {
				const usage = event.message.usage;
				sink.usage({ billable: usage.billable, model: event.message.model });
			}
			if ((event.type === "assistant" || event.type === "user") && event.message?.content) {
				for (const block of event.message.content) {
					if (block.type === "text" && block.text) sink.text(block.text, event.type === "assistant");
					else if (block.type === "thinking" && block.thinking) sink.record("think", block.thinking);
					else if (block.type === "tool_use") sink.tool(block.name, block.input);
				}
			}
		},
		modelArgs: () => ["--list-models"],
		parseModels: (out) => out.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && line !== "MODEL"),
		usesResultEvent: true,
	},
```

</details>

**依据 7 · 源码核查**：[lib/index.js:577-616](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L577-L616)

Codex命令/结果事件转换。

<details>
<summary>查看原文（40行）</summary>

```text
		consume(event, sink) {
			if (event.type === "thread.started") {
				sink.session(event.thread_id);
				return;
			}
			if (event.type === "item.started") {
				const item = event.item ?? {};
				if (item.type === "command_execution") sink.tool("shell", { command: item.command ?? "" });
				else if (item.type === "mcp_tool_call") sink.tool(`${item.server ?? "mcp"}.${item.tool ?? "tool"}`, item.arguments);
				else if (item.type === "web_search") sink.tool("web_search", { pattern: item.query ?? "" });
				return;
			}
			if (event.type === "item.completed") {
				const item = event.item ?? {};
				if (item.type === "agent_message" && item.text) sink.text(item.text, true);
				else if (item.type === "reasoning" && item.text) sink.record("think", item.text);
				else if (item.type === "command_execution") {
					const output = String(item.aggregated_output ?? "").trim();
					sink.record("tool", `exit ${item.exit_code ?? "?"}${output ? `: ${output.slice(0, 500)}` : ""}`);
				} else if (item.type === "file_change") {
					const files = (item.changes ?? []).map((change) => change.path).filter(Boolean).join(", ");
					if (files) sink.record("tool", `file_change ${files}`);
				} else if (item.type === "todo_list") {
					const todos = (item.items ?? []).map((todo) => `${todo.completed ? "✔" : "·"} ${todo.text ?? ""}`).join("\n");
					if (todos) sink.record("todo", todos);
				} else if (item.type === "error" && item.message) {
					sink.record("error", item.message);
				}
				return;
			}
			if (event.type === "turn.completed") {
				const usage = event.usage;
				if (usage) sink.record("usage", `in ${usage.input_tokens ?? 0} / out ${usage.output_tokens ?? 0} tokens`);
				sink.result("", false);
				return;
			}
			if (event.type === "turn.failed") {
				sink.result(event.error?.message ?? event.message ?? "codex turn failed", true);
				return;
			}
```

</details>

**依据 8 · 源码核查**：[lib/index.js:1328-1365](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L1328-L1365)

结果优先、退出/超时与最终文本。

<details>
<summary>查看原文（38行）</summary>

```text
	async #attempt() {
		try {
			await this.#waitForExit();
			if (this.#spawnError) throw this.#spawnError;
			if (this.#resultEvent) {
				if (this.#resultEvent.isError) {
					return {
						output: this.#collectOutput(),
						diagnostic: this.#resultDiagnostic(),
						stopReason: "error",
					};
				}
				return { output: this.#collectOutput(), stopReason: "completed" };
			}
			// 没有终止 result 事件的驱动(opencode/pi)以进程退出作为收敛信号。
			const exitCode = this.#exitInfo?.code;
			if (!this.#driver.usesResultEvent && !this.#timedOut && exitCode === 0) {
				this.#activity?.finish("completed", this.#assistantText.at(-1) || undefined);
				return { output: this.#collectOutput(), stopReason: "completed" };
			}
			if (this.#timedOut) throw new Error(`timed out after ${this.#timeoutMs / 1000}s`);
			throw new Error(
				`CLI exited (code=${exitCode} signal=${this.#exitInfo?.signal}) without a result event`,
			);
		} finally {
			if (this.#timeoutTimer) clearTimeout(this.#timeoutTimer);
		}
	}

	#collectOutput() {
		const text = this.#settledText || this.#assistantText.join("");
		return text ? [{ type: "text", text }] : [];
	}

	#collectDiagnostic() {
		const runnerErr = this.#runnerErrPath ? readTail(this.#runnerErrPath, 2048) : "";
		const pieces = [readTail(this.#errPath), runnerErr, this.#exitInfo && `exit code=${this.#exitInfo.code} signal=${this.#exitInfo.signal}`].filter(Boolean);
		return pieces.join("\n") || undefined;
```

</details>

**依据 9 · 源码核查**：[lib/shared-gate.js:76-83](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/shared-gate.js#L76-L83)

独占创建槽文件的实际callee。

```text
	#writeNew(file, token) {
		const fd = openSync(file, "wx");
		try {
			writeSync(fd, JSON.stringify({ pid: process.pid, token, since: Date.now() }));
		} finally {
			closeSync(fd);
		}
	}
```

**依据 10 · 源码核查**：[lib/shared-gate.js:203-241](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/shared-gate.js#L203-L241)

共享槽与文件系统失败的内存降级。

<details>
<summary>查看原文（39行）</summary>

```text
		return value;
	}

	#acquireShared(name, limit) {
		const dir = this.#ensureDir(name);
		if (this.#countActive(dir) >= limit) return null;
		for (let i = 0; i < limit; i++) {
			const file = join(dir, `slot-${i}.lock`);
			for (let attempt = 0; attempt < 2; attempt++) {
				const token = randomUUID();
				try {
					this.#writeNew(file, token);
				} catch (error) {
					if (error?.code !== "EEXIST") throw error;
					if (attempt > 0) break;
					const record = this.#read(file);
					if (record && this.#alive(record)) break;
					this.#reclaim(file, record?.token);
					continue;
				}
				this.#activeCache.delete(name);
				return this.#hold(file, token, name);
			}
		}
		return null;
	}

	/** 占用一个槽位;成功返回释放函数,已满返回 null。 */
	tryAcquire(name, limit) {
		const max = Math.max(1, Number(limit) || 1);
		if (!this.#memory) {
			try {
				return this.#acquireShared(name, max);
			} catch {
				this.#memory = new Map();
			}
		}
		return this.#acquireMemory(name, max);
	}
```

</details>

**依据 11 · 源码核查**：[lib/shared-gate.js:257-294](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/shared-gate.js#L257-L294)

恢复reserve与独立占位。

<details>
<summary>查看原文（38行）</summary>

```text
		this.#activeCache.set(name, { value, at: Date.now() });
		return value;
	}

	/** 接管宿主机重启前遗留的运行:优先占用固定槽位,槽位已满则单独记一条。 */
	reserve(name) {
		if (!this.#memory) {
			try {
				const dir = this.#ensureDir(name);
				this.#sweep(dir);
				for (let i = 0; i < 64; i++) {
					const file = join(dir, `slot-${i}.lock`);
					const token = randomUUID();
					try {
						this.#writeNew(file, token);
						this.#activeCache.delete(name);
						return this.#hold(file, token, name);
					} catch (error) {
						if (error?.code !== "EEXIST") throw error;
					}
				}
				const file = join(dir, `adopt-${randomUUID()}.lock`);
				const token = randomUUID();
				this.#writeNew(file, token);
				this.#activeCache.delete(name);
				return this.#hold(file, token, name);
			} catch {
				this.#memory = new Map();
			}
		}
		const used = this.#memory.get(name) ?? 0;
		this.#memory.set(name, used + 1);
		let released = false;
		return () => {
			if (released) return;
			released = true;
			this.#memory.set(name, Math.max(0, (this.#memory.get(name) ?? 1) - 1));
		};
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认权限、等待、模型重试、取消和恢复有哪些具体责任边界？

**研究主题**：缺陷与关键质疑、工程质量与复用、功能与机制

#### 完整回答

默认permissionMode=bypass_permissions，Codex真实映射为--dangerously-bypass-approvals-and-sandbox；其他CLI各有自己的模式，extraArgs还会原样追加。cwd只决定进程工作目录，继承的环境/CLI登录配置决定真实账号和可达资源，父会话权限不会自动夹紧CLI；不要把所有后端的同名permissionMode看成等效沙箱。应先选最小权限和隔离副本，明确账号/范围，不能直接让默认值操作生产资产。

allowedWaitSeconds默认300并非全任务墙钟或财务上限。deadline只在runChain内，race等待firstEvent；任何可JSON.parse的事件就完成firstEvent，包括初始化/无实质输出的事件，随后直接await run.handle().result，没有按remaining再race。timeoutSeconds默认未设；所以收到初始化后长挂仍可能超过300秒，静默警告只通知父端、不杀任务。排队时间也在此deadline外。重试意味着前次CLI可能已做过工具副作用，不能把“模型失败再试下个”当无重复业务动作保证。

模型尝试还有身份/展示边界：start只生成一个id并在每个模型循环复用，非Windows直接spawn分支用追加日志，而新QoderJsonRun的logOffset从0读，旧尝试可重新进入firstEvent/结果解析。活动对象也复用；ActivityLedger.finish仅接受running→终态，meta只在字段为空时填，没有在换模型重置。因此“先失败后成功”可留下首失败状态/首计量或首会话，与最终返回结果不同；这些是源码推导的条件行为，未作为真实运行故障。不能把活动面板和credits当整条链的可靠办结/累计账单，需要attempt维度和真实产物对账。

取消/超时会调用名为killTree的函数，但Unix分支仅child.kill(SIGKILL)，没有按负进程组ID回收后代；Windows用taskkill /T /F且失败再杀根。等待直接child退出不证明后代或远端动作停止。Windows外层runner设cwd，但PS1的Start-Process未显式传WorkingDirectory，最终CLI目录也需实机核。detached有崩溃存活价值，也使宿主/插件停止不等任务停止。恢复先折叠日志再按PID检查，避免漏掉停机期间完成；但meta没有进程启动身份绑定，PID存活不是仍为同一CLI的充分证明。

迟到notice仍先agent.followup，再写notified，未看到父端持久消费确认。崩溃/并发窗口可能重复，标记true也不是父模型已采用正确结果；只一次承诺须收窄。索引读改写/rename不是跨进程事务，恢复与多宿主写入也需验。日志/状态完整性、停止、实际写入和父验收应分别验，不应以重发任务解决不确定结果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:219-243](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L219-L243)

权限与可选timeout配置。

<details>
<summary>查看原文（25行）</summary>

```text
const ProviderConfig = z.object({
	/** 注册名;必须与 patch 中 `dsh-tool-subagent` 的 provider 一致。 */
	name: z.string().required(),
	/** 传输驱动:qoder-json | opencode-json | pi-json | codebuddy-json | codex-json | claude-json。 */
	driver: z.string().default("qoder-json"),
	/** CLI 绝对路径;省略则按内置名称自动探测。 */
	binary: z.string(),
	/** 无头运行的 CLI 权限模式;无法弹窗询问,故默认放行。 */
	permissionMode: z.string().default("bypass_permissions"),
	/** 强制指定模型 id;省略则使用 CLI 自己的默认值(如免费额度)。 */
	model: z.string(),
	/** 有序的模型回退链;非空时覆盖 `model`。 */
	models: z.array(z.string()).default([]),
	/** 整条回退链共用的总等待预算,单位秒。 */
	allowedWaitSeconds: z.number().min(1),
	/** 传给 CLI 的思考程度:auto|none|low|medium|high|xhigh|max|ultracode。 */
	reasoningEffort: z.string().default("auto"),
	/** 显式上下文窗口(正整数 token);省略则使用 CLI 默认值。 */
	contextWindow: z.number().min(1),
	/** 单次委派的墙钟上限(秒),可选。 */
	timeoutSeconds: z.number().min(1),
	/** CLI 连续无输出的秒数,达到后提醒父 agent;0 表示关闭。 */
	stallWarnSeconds: z.number().min(0),
	/** 原样追加的额外 CLI 参数(高级覆盖项)。 */
	extraArgs: z.array(z.string()).default([]),
```

</details>

**依据 2 · 源码核查**：[lib/index.js:563-576](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L563-L576)

Codex具体绕过批准/沙箱参数及额外参数。

<details>
<summary>查看原文（14行）</summary>

```text
	"codex-json": {
		buildArgs(spec, model) {
			const sandbox = { accept_edits: ["--approve-for-me"], auto: ["-s", "workspace-write"], dont_ask: ["-s", "workspace-write"], default: ["-s", "read-only"], plan: ["-s", "read-only"] };
			const access = spec.permissionMode === "bypass_permissions"
				? ["--dangerously-bypass-approvals-and-sandbox"]
				: sandbox[spec.permissionMode] ?? ["-s", "workspace-write"];
			const args = ["exec", "--json", "--skip-git-repo-check", "--color", "never", ...access];
			if (model) args.push("--model", model);
			const effort = { low: "low", medium: "medium", high: "high", xhigh: "xhigh", max: "max", ultracode: "ultra" }[spec.reasoningEffort];
			if (effort) args.push("-c", `model_reasoning_effort="${effort}"`);
			if (spec.contextWindow) args.push("-c", `model_context_window=${spec.contextWindow}`);
			args.push(...(spec.extraArgs ?? []));
			return args;
		},
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1644-1664](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L1644-L1664)

实际默认300/90与无timeout。

<details>
<summary>查看原文（21行）</summary>

```text
function normalizeSpec(entry) {
	const models = Array.isArray(entry.models) && entry.models.length > 0
		? entry.models
		: entry.model
			? [entry.model]
			: [];
	return {
		name: entry.name,
		driver: entry.driver ?? "qoder-json",
		binary: resolveBinary(entry.name, entry.binary),
		permissionMode: entry.permissionMode ?? "bypass_permissions",
		models,
		allowedWaitSeconds: entry.allowedWaitSeconds ?? 300,
		reasoningEffort: entry.reasoningEffort ?? "auto",
		contextWindow: entry.contextWindow ?? undefined,
		timeoutSeconds: entry.timeoutSeconds ?? undefined,
		stallWarnSeconds: entry.stallWarnSeconds ?? 90,
		extraArgs: entry.extraArgs ?? [],
		maxConcurrency: entry.maxConcurrency ?? 2,
	};
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:337-392](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L337-L392)

同id各模型启动、首事件race及ready后无remaining约束。

<details>
<summary>查看原文（56行）</summary>

```text
		};

		const runChain = async (target) => {
			const chain = target.models.length > 0 ? target.models : [undefined];
			const deadline = Date.now() + target.allowedWaitSeconds * 1000;
			const tried = [];
			for (const model of chain) {
				if (cancelled) throw new Error("cancelled");
				const label = model ?? "(CLI 默认)";
				activity.record("model", `正在尝试模型 ${label}`);
				const driver = DRIVERS[target.driver];
				const spawnSpec = spawnCommand(target.driver, target);
				const run = new QoderJsonRun({
					id,
					activity,
					parentAgent: this.#getAgent?.(request.parent?.id),
					stallWarnSeconds: target.stallWarnSeconds,
					warnAfterFirstEvent: true,
					driver,
					driverName: target.driver,
					provider: target.name,
					label: request.label ?? "",
					promptSummary: prompt.slice(0, 160),
					parentId: request.parent?.id,
					command: spawnSpec.command,
					args: [...spawnSpec.prefix, ...driver.buildArgs(target, model)],
					env: spawnSpec.env,
					cwd: request.cwd,
					prompt,
					signal: request.signal,
					timeoutMs: target.timeoutSeconds ? target.timeoutSeconds * 1000 : 0,
				});
				currentRun = run;
				const remaining = Math.max(0, deadline - Date.now());
				const waitMs = target.stallWarnSeconds > 0 ? Math.min(target.stallWarnSeconds * 1000, remaining) : remaining;
				const first = await Promise.race([
					run.firstEvent.then(() => "ready"),
					new Promise((resolve) => setTimeout(() => resolve("timeout"), waitMs)),
					aborted,
				]);
				if (first === "aborted" || cancelled) {
					await run.dispose();
					throw new Error("cancelled");
				}
				if (first === "ready") {
					const result = await run.handle().result;
					await run.dispose();
					if (result.stopReason === "completed") return result;
					if (cancelled) throw new Error("cancelled");
					tried.push(`${label}: ${result.stopReason}${result.diagnostic ? ` — ${result.diagnostic.slice(0, 160)}` : ""}`);
					activity.record("error", `${label} 失败(${result.stopReason}),尝试下一个模型`);
					if (Date.now() >= deadline) break;
					continue;
				}
				tried.push(`${label}: ${Math.round(waitMs / 1000)} 秒无输出`);
				activity.record("error", `${label} ${Math.round(waitMs / 1000)} 秒无输出,切换下一个模型`);
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1048-1079](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L1048-L1079)

每个新run的logOffset=0、id及同一日志路径。

<details>
<summary>查看原文（32行）</summary>

```text
	#logPath;
	#errPath;
	#logOffset = 0;
	#tailTimer;
	#promptPath;
	#configPath;
	#runnerErrPath;
	#meta;

	constructor(opts) {
		this.#id = opts.id;
		this.#activity = opts.activity;
		this.#driver = opts.driver;
		this.#parentAgent = opts.parentAgent;
		this.#stallWarnSeconds = opts.stallWarnSeconds ?? 0;
		this.#warnAfterFirstEvent = opts.warnAfterFirstEvent === true;
		this.#firstEventPromise = new Promise((resolve) => {
			this.#firstEventResolve = resolve;
		});
		this.#lastEventAt = Date.now();
		this.#signal = opts.signal;
		this.#timeoutMs = opts.timeoutMs;
		// 输出持久化:子进程直接写文件并以 detached 方式运行,
		// 因此 dsh 崩溃既不会中断其 stdout,也不会丢失转录;宿主
		// 跟踪日志,并在重启后继续跟踪。
		ensureRunsDir();
		this.#logPath = runLogPath(this.#id);
		this.#errPath = runErrPath(this.#id);
		const useHiddenRunner = platform === "win32" && existsSync(HIDDEN_RUNNER);
		if (useHiddenRunner) {
			// Windows 下经隐藏控制台包装启动:detached 保证崩溃后存活,
			// 隐藏控制台避免 CLI 的 shell 子进程闪出黑框。
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1208-1228](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L1208-L1228)

drainLog实际从该offset读日志并把行送consumeEvent。

<details>
<summary>查看原文（21行）</summary>

```text
		const { text, offset } = readAppended(this.#logPath, this.#logOffset);
		if (!text) return;
		this.#logOffset = offset;
		this.#stdoutBuf += text;
		let newline;
		while ((newline = this.#stdoutBuf.indexOf("\n")) >= 0) {
			const line = this.#stdoutBuf.slice(0, newline).trim();
			this.#stdoutBuf = this.#stdoutBuf.slice(newline + 1);
			if (line) this.#consumeEvent(line);
		}
		if (final && this.#stdoutBuf.trim()) {
			const line = this.#stdoutBuf.trim();
			this.#stdoutBuf = "";
			this.#consumeEvent(line);
		}
	}

	/** 持久化本次运行的终态。 */
	#persistFinish() {
		clearInterval(this.#tailTimer);
		cleanupRunFiles(this.#id);
```

</details>

**依据 7 · 源码核查**：[lib/index.js:1095-1115](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L1095-L1115)

同路径日志追加及真实环境/进程。

<details>
<summary>查看原文（21行）</summary>

```text
				windowsHide: true,
				detached: true,
			});
		} else {
			const outFd = openSync(this.#logPath, "a");
			const errFd = openSync(this.#errPath, "a");
			try {
				this.#child = spawn(opts.command, opts.args, {
					cwd: opts.cwd,
					stdio: ["pipe", outFd, errFd],
					windowsHide: true,
					detached: true,
					...(opts.env ? { env: { ...process.env, ...opts.env } } : {}),
				});
			} finally {
				closeSync(outFd);
				closeSync(errFd);
			}
			this.#child.stdin.on("error", () => {});
			this.#child.stdin.write(opts.prompt);
			this.#child.stdin.end();
```

</details>

**依据 8 · 源码核查**：[lib/index.js:1252-1274](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L1252-L1274)

任何可解析JSON即firstEvent，随后才driver消费。

<details>
<summary>查看原文（23行）</summary>

```text

	#consumeEvent(line) {
		let event;
		try {
			event = JSON.parse(line);
		} catch {
			return;
		}
		this.#lastEventAt = Date.now();
		this.#stallWarned = false;
		if (!this.#gotFirstEvent) {
			this.#gotFirstEvent = true;
			this.#firstEventResolve?.();
		}
		const sink = {
			record: (kind, text) => this.#activity?.record(kind, text),
			text: (text, assistant) => {
				if (assistant) this.#assistantText.push(text);
				this.#activity?.record("text", text);
			},
			tool: (name, input) => {
				const detail = typeof input?.command === "string" ? input.command : input?.file_path ?? input?.path ?? input?.pattern ?? "";
				this.#activity?.record("tool", `${name ?? "tool"} ${detail}`.trim());
```

</details>

**依据 9 · 源码核查**：[lib/index.js:730-757](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L730-L757)

活动终态只写一次、meta只填空字段。

<details>
<summary>查看原文（28行）</summary>

```text
class ActivityLedger {
	runs = [];
	begin(meta) {
		const entry = { ...meta, sessionId: null, startedAt: Date.now(), endedAt: null, status: "running", events: [] };
		this.runs.unshift(entry);
		if (this.runs.length > MAX_RUNS) this.runs.length = MAX_RUNS;
		return {
			record(kind, text) {
				if (entry.events.length >= MAX_EVENTS) entry.events.shift();
				entry.events.push({ t: Date.now(), kind, text: String(text ?? "").slice(0, MAX_EVENT_TEXT) });
			},
			meta(key, value) {
				if (value != null && entry[key] == null) entry[key] = value;
			},
			provider(name) {
				if (name) entry.provider = name;
			},
			finish(status, summary) {
				if (entry.status !== "running") return;
				entry.status = status;
				entry.endedAt = Date.now();
				if (summary) this.record("result", summary);
			},
			snapshot() {
				return { status: entry.status, sessionId: entry.sessionId, credits: entry.credits, costUsd: entry.costUsd, startedAt: entry.startedAt };
			},
		};
	}
```

</details>

**依据 10 · 源码核查**：[lib/index.js:1299-1325](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L1299-L1325)

静默只提醒，不是总时长熔断。

<details>
<summary>查看原文（27行）</summary>

```text
	* (进程挂起、模型排队、网络中断)。父 agent 随后可以
	* 查询 sub_agent_status、继续等待或中断,而不是盲目挂着。
	*/
	#checkStall() {
		if (this.#stallWarned || this.#exitInfo || this.#cancelled) return;
		if (this.#warnAfterFirstEvent && !this.#gotFirstEvent) return;
		const idleSeconds = Math.round((Date.now() - this.#lastEventAt) / 1000);
		if (idleSeconds < this.#stallWarnSeconds) return;
		this.#stallWarned = true;
		this.#activity?.record("error", `no output for ${idleSeconds}s — warned the parent`);
		const agent = this.#parentAgent;
		if (!agent || typeof agent.followup !== "function") return;
		try {
			agent.followup(createUserMessage({
				content: [{
					type: "text",
					text: `⚠️ 子代理已 ${idleSeconds} 秒没有任何输出(可能卡住、网络不通或模型排队)。运行 id: ${this.#id}。你可以调用 sub_agent_status 查看详情并决定继续等待或中断。`,
				}],
				source: {
					kind: "subagent-settled",
					form: "notice",
					summary: boundContextSummary(`子代理无输出 ${idleSeconds} 秒`),
					senderSessionId: this.#id,
				},
			}));
		} catch {}
	}
```

</details>

**依据 11 · 源码核查**：[lib/index.js:1375-1397](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L1375-L1397)

waitForExit与实际POSIX/Windows取消callee。

<details>
<summary>查看原文（23行）</summary>

```text
	#waitForExit() {
		if (this.#exitInfo) return Promise.resolve();
		return new Promise((resolve) => this.#child.once("close", resolve));
	}

	#killTree() {
		if (this.#child.exitCode !== null || this.#child.signalCode !== null) return;
		if (platform === "win32") {
			const killer = spawn("taskkill", ["/pid", String(this.#child.pid), "/T", "/F"], {
				stdio: "ignore",
				windowsHide: true,
			});
			killer.on("error", () => this.#child.kill("SIGKILL"));
			return;
		}
		try {
			this.#child.kill("SIGKILL");
		} catch {}
	}
}
//#endregion

//#region 探测(设置页 RPC)
```

</details>

**依据 12 · 源码核查**：[lib/index.js:939-970](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L939-L970)

恢复先读日志/PID，发送notice再标记。

<details>
<summary>查看原文（32行）</summary>

```text
function resumePersistedRuns(ctx) {
	const getAgent = (id) => ctx.get("agents")?.get?.(id);
	const index = readRunIndex();
	for (const meta of index) {
		if (!meta?.id) continue;
		const entry = activityLedger.adopt(meta);
		let offset = foldRunLog(meta, entry, 0);
		if (entry.status === "running" && !pidAlive(meta.pid)) {
			// CLI 可能在宿主停机期间已经完成:先折叠日志尾部,
			// 只有仍未收敛的运行才判定为失败。
			offset = foldRunLog(meta, entry, offset, true);
			if (entry.status === "running") {
				entry.status = "error";
				entry.endedAt = Date.now();
			}
			upsertRunIndex({ id: meta.id, status: entry.status, endedAt: entry.endedAt ?? Date.now(), pid: null });
		}
		if (entry.status !== "running") {
			cleanupRunFiles(meta.id);
			upsertRunIndex({ id: meta.id, status: entry.status, endedAt: entry.endedAt ?? Date.now(), sessionId: entry.sessionId, credits: entry.credits, costUsd: entry.costUsd, pid: null });
			if (!meta.notified) {
				const agent = getAgent(meta.parentId);
				if (agent && typeof agent.followup === "function") {
					try {
						agent.followup(createUserMessage({
							content: [{ type: "text", text: lateNoticeText(meta, entry) }],
							source: { kind: "subagent-settled", form: "notice", summary: boundContextSummary(`重启前发起的子代理已结束`), senderSessionId: meta.id },
						}));
						upsertRunIndex({ id: meta.id, notified: true });
					} catch {}
				}
			}
```

</details>

**依据 13 · 源码核查**：[lib/index.js:812-825](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L812-L825)

共享索引RMW/rename，无跨进程事务。

<details>
<summary>查看原文（14行）</summary>

```text
function writeRunIndex(runs) {
	try {
		ensureRunsDir();
		const tmp = `${INDEX_PATH}.tmp`;
		writeFileSync(tmp, JSON.stringify(runs.slice(0, MAX_RUNS), null, 1));
		renameSync(tmp, INDEX_PATH);
	} catch {}
}
function upsertRunIndex(meta) {
	const runs = readRunIndex();
	const at = runs.findIndex((run) => run.id === meta.id);
	if (at >= 0) runs[at] = { ...runs[at], ...meta };
	else runs.unshift(meta);
	writeRunIndex(runs);
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、诊断/更新、四阶段成本和效果应怎样验收？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

探测不只是读静态元数据：probeBackend实际spawn --version及各驱动模型命令，latest可调用CLI update --check或npm网络；update端点则真跑后端update/upgrade，结束后重新probe。更新前检查providerGate.active>0是已有保护，却不是检查和更新之间不可抢占的事务锁。客户端callRpc经connection.rpc.call，服务端通过connection.fetch.register挂POST并核method信封/后端名；本插件没有额外账号/admin许可检查，当前宿主连接层的认证/授权未独立核，不能据此宣称匿名公网可更新，也不能把“已认证桥”注释当管理员授权证明。更新是需要单独明确授权的状态操作，不把本轮只读研究视作运行许可。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node及匹配DSH服务/官方委派工具 | 必需 | 注册、结果句柄、命令/父notice | peer范围与API需同版本核；不以加载成功证明任务通过 |
| 已装登录的CLI/真实账号 | 每启用后端必需 | 实际模型与工具动作 | 本地binary存在不等版本/登录/额度可用 |
| 父DSH模型与自包含任务 | 自主协调必需 | 拆分、工具调用、消费结果并验收 | 子端不继承父上下文，预设不能代替验收人/判据 |
| cwd、最小权限、隔离副本和总预算 | 有写入/调用时必需明确 | 限定实际资源与退出责任 | 默认bypass/无timeout不得解释为已有边界 |
| 共享临时槽、DSH_HOME日志/索引 | 调度/恢复必需 | 并发、进度、重接 | 文件系统可降级，磁盘/身份/多进程一致性另验 |
| Windows node/PowerShell及runner | Windows分支必需 | 隐藏detached启动及树终止 | 与Unix进程树不同，需独立平台验收 |
| connection及Web设置界面 | 可选管理分支 | probe/更新/活动查看 | 真实宿主访问边界、更新授权和兼容需另验 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 固定依赖 | 操作者选宿主/CLI版本和单个已授权账号 | binary、参数/事件与权限均对应；不先启用所有后端 |
| 限定任务 | 父Agent写目标/上下文/cwd/允许动作及验收标准 | 不依赖隐藏父上下文；自动溢出不能越过账号范围 |
| 隔离执行 | 设明确timeout和可控并发，委派一个任务 | 对照最终文本、真实文件/外部结果，不只看面板 |
| 故障验收 | 先失败后成功、首JSON后挂起、取消、重启/notice窗口 | attempt归属、后代停止、父消费和费用逐项可核 |
| 升级/退出 | 单独授权后更新；停新任务并查在途、日志及子进程 | 更新不撞运行；卸载不遗留写进程，不确定结果先对账 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次接入 | 多CLI/订阅、隔离机器/副本、磁盘 | 登录、版本/参数、权限与cwd/预算配置 | 实际价格/工时未知，Node/peer声明非当前安装验收 |
| 持续使用 | 各CLI模型/工具与父模型费用、并发资源/日志 | 自包含上下文、监督/纠错、真实产物验收 | 静态rates/credits不等完整账单，切后端改变账户和费用 |
| 失败恢复 | 多模型尝试、重复副作用、存活后代/远端动作 | 查attempt/索引/PID/notice、停止及对账 | 300秒非总运行上限，未测恢复/重复/误标代价 |
| 停用/迁移 | 在途CLI、长期日志/会话与备份/清理资源 | 逐进程/账号核停止与结果、导出/删除记录 | 索引24条/内存事件有界不等原始日志有界；未证明退出即停 |

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 委派 | 动态工具/provider→真实spawn→事件/结果句柄 | 每CLI版本的工具任务质量、父消费及业务完成 |
| 调度 | 同名后端共享文件槽、溢出/平均分配与恢复reserve | 故障窗口硬并发、账户总预算和净吞吐优势 |
| 进度/恢复 | 日志落盘、重读和迟到notice | 模型尝试隔离、正确进程、只一次消费及后代全停 |
| 使用成本 | 接线复用CLI账户、已有额度显示和诊断 | 全尝试账单、总工时/维护负担和单位合格任务成本 |

本轮不运行安装/目标代码/测试/CLI、模型、probe或更新；金额、用量、时长与节省均未知，不用0补齐。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:46-58](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/package.json#L46-L58)

Node/peer依赖边界。

<details>
<summary>查看原文（13行）</summary>

```text
    "node": "^22.19.0 || >=24.0.0"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-session": ">=0.2.1-rc.2 <0.3.0",
    "@deepseek-ai/dsh-subagent": ">=0.2.1-rc.2 <0.3.0",
    "@deepseek-ai/dsh-tool-subagent": ">=0.2.1-rc.2 <0.3.0",
    "@deepseek-ai/dsh-tools": ">=0.2.1-rc.2 <0.3.0",
    "@deepseek-ai/schemastery": "^3.18.2",
    "@deepseek-ai/dsh-llm": ">=0.2.1-rc.2 <0.3.0"
  },
  "devDependencies": {
    "esbuild": "^0.25.0",
    "puppeteer-core": "^25.14.0",
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1508-1556](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L1508-L1556)

实际版本/模型探测与网络。

<details>
<summary>查看原文（49行）</summary>

```text
async function latestVersionFor(spec) {
	const hit = latestCache.get(spec.name);
	if (hit && Date.now() - hit.at < LATEST_TTL_MS) return hit.value;
	let latest = null;
	try {
		if (spec.name === "qoder" || spec.name === "qodercn") {
			const spawnSpec = spawnCommand(spec.driver, spec);
			const env = spawnSpec.env ? { ...process.env, ...spawnSpec.env } : undefined;
			const output = await runCli(spawnSpec.command, [...spawnSpec.prefix, "update", "--check"], 20000, env);
			const versions = [...String(output).matchAll(/(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)/g)].map((match) => match[1]);
			latest = versions.at(-1) ?? null;
		} else if (NPM_PACKAGES[spec.name]) {
			const response = await fetch(`https://registry.npmjs.org/${NPM_PACKAGES[spec.name]}/latest`, { signal: AbortSignal.timeout(6000) });
			if (response.ok) {
				const data = await response.json();
				if (typeof data?.version === "string") latest = data.version;
			}
		}
	} catch {}
	latestCache.set(spec.name, { at: Date.now(), value: latest });
	return latest;
}

/** 某个后端的存在性、版本和模型目录,带 TTL 缓存。 */
async function probeBackend(spec) {
	const hit = probeCache.get(spec.name);
	if (hit && Date.now() - hit.at < PROBE_TTL_MS) return hit.value;
	const rates = spec.driver === "qoder-json" ? CREDIT_RATES : spec.driver === "codebuddy-json" ? CODEBUDDY_RATES : undefined;
	const value = { name: spec.name, driver: spec.driver, binary: spec.binary ?? null, exists: false, version: null, latestVersion: null, updateAvailable: false, models: [], rates, error: null };
	if (!spec.binary || !existsSync(spec.binary)) {
		value.error = "CLI binary not found. Install the CLI or set a binary path.";
	} else {
		try {
			const driver = DRIVERS[spec.driver] ?? DRIVERS["qoder-json"];
			const spawnSpec = spawnCommand(spec.driver, spec);
			const run = (args) => runCli(spawnSpec.command, [...spawnSpec.prefix, ...args], 30000, spawnSpec.env ? { ...process.env, ...spawnSpec.env } : undefined);
			const rawVersion = (await run(["--version"])).trim().split(/\r?\n/)[0];
			value.version = (/(\d+\.\d+\.\d+[\w.-]*)/.exec(rawVersion) ?? [rawVersion])[0];
			value.models = typeof driver.models === "function" ? driver.models() : driver.parseModels(await run(driver.modelArgs()));
			value.exists = true;
			value.latestVersion = await latestVersionFor(spec);
			value.updateAvailable = Boolean(value.latestVersion && value.version && compareVersions(value.latestVersion, value.version) > 0);
		} catch (error) {
			value.error = String(error?.message ?? error).slice(0, 512);
		}
	}
	probeCache.set(spec.name, { at: Date.now(), value });
	return value;
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1559-1630](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L1559-L1630)

更新真实spawn与POST注册/局部验证。

<details>
<summary>查看原文（72行）</summary>

```text
async function updateBackend(spec, registry) {
	if (providerGate.active(spec.name) > 0) throw new Error("该后端还有运行中的子代理,请等它们结束后再更新");
	const args = UPDATE_ARGS[spec.name];
	if (!args) throw new Error("该后端不支持自动更新");
	const spawnSpec = spawnCommand(spec.driver, spec);
	const env = spawnSpec.env ? { ...process.env, ...spawnSpec.env } : undefined;
	try {
		await runCli(spawnSpec.command, [...spawnSpec.prefix, ...args], 180000, env);
	} catch (error) {
		throw new Error(`CLI 更新失败: ${String(error?.message ?? error).slice(0, 300)}`);
	}
	probeCache.delete(spec.name);
	latestCache.delete(spec.name);
	const nextSpec = registry.get(spec.name) ?? builtinSpec(spec.name) ?? spec;
	return probeBackend(nextSpec);
}

/**
* 通过 Codex 订阅插件所用的同一条已认证 /api 桥提供设置页接口:
* 每个端点一个 POST 路由,使用 `{type,rpcId,result}`
* 信封。无凭据宿主(headless)中不存在,设置页也无意义。
*/
function registerProbeRoutes(connection, registry) {
	const route = (endpoint, handle) => connection.fetch.register({
		path: `/api/qoder-subagent/${endpoint}`,
		methods: ["POST"],
		requestBody: "buffered",
		async fetch(request) {
			const method = `qoder-subagent/${endpoint}`;
			let envelope;
			try {
				envelope = await request.json();
			} catch {
				return Response.json({ type: "server-response", rpcId: null, result: { ok: false, error: { code: "invalid", message: "invalid JSON", details: { issues: [] } } } });
			}
			let result;
			try {
				if (envelope?.method !== method) throw new Error("method mismatch");
				result = { ok: true, value: await handle(envelope.payload ?? {}, request.signal) };
			} catch (error) {
				result = { ok: false, error: { code: "internal", message: "qoder-subagent probe failed", details: { issues: [String(error?.message ?? error).slice(0, 256)] } } };
			}
			return Response.json({ type: "server-response", rpcId: envelope?.rpcId ?? null, result });
		},
	});
	return [
		route("probe", (payload) => {
			const name = String(payload?.name ?? "");
			const spec = registry.get(name) ?? builtinSpec(name);
			if (!spec) throw new Error("unknown provider");
			return probeBackend(spec);
		}),
		route("refresh", (payload) => {
			const name = String(payload?.name ?? "");
			probeCache.delete(name);
			latestCache.delete(name);
			const spec = registry.get(name) ?? builtinSpec(name);
			if (!spec) throw new Error("unknown provider");
			return probeBackend(spec);
		}),
		route("update", (payload) => {
			const name = String(payload?.name ?? "");
			const spec = registry.get(name) ?? builtinSpec(name);
			if (!spec) throw new Error("unknown provider");
			return updateBackend(spec, registry);
		}),
		route("activity", (payload) => ({ run: activityLedger.view(String(payload?.runId ?? "")), now: Date.now() })),
	];
}
//#endregion

//#region 装配
```

</details>

**依据 4 · 源码核查**：[lib/client.js:108-114](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/client.js#L108-L114)

实际发布客户端RPC caller。

```text
function callRpc(connection, endpoint, payload, timeout = 6e4) {
  return connection.rpc.call("/api", `qoder-subagent/${endpoint}`, payload, AbortSignal.timeout(timeout)).then((result) => {
    if (!result?.ok) throw new Error(result?.error?.message ?? "probe failed");
    return result.value;
  });
}
function ProviderCard({ spec, index, form, connection, onRemove, onMove, canUp, canDown, removingName, probeCache }) {
```

**依据 5 · 源码核查**：[src/client.js:176-193](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/src/client.js#L176-L193)

用户更新动作及结果，不是纯读取。

<details>
<summary>查看原文（18行）</summary>

```text
	const updateCli = () => {
		if (updating) return;
		setUpdating(true);
		setUpdateMsg("");
		callRpc(connection, "update", { name: spec.name }, 190000)
			.then((value) => {
				probeCache?.current?.set(probeKey, { value });
				if (mountedRef.current) {
					setProbe({ status: "ready", value });
					setUpdateMsg(`CLI 已更新到 v${value.version ?? "最新版"}`);
				}
			})
			.catch((error) => {
				if (mountedRef.current) setUpdateMsg(`更新失败: ${String(error?.message ?? error).slice(0, 200)}`);
			})
			.finally(() => {
				if (mountedRef.current) setUpdating(false);
			});
```

</details>

**依据 6 · 源码核查**：[lib/index.js:719-721](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L719-L721)

仅近期内存有界。

```text
const MAX_RUNS = 24;
const MAX_EVENTS = 200;
const MAX_EVENT_TEXT = 1500;
```

**依据 7 · 源码核查**：[lib/index.js:794-825](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L794-L825)

只清临时prompt/config及裁索引，没有清原始日志。

<details>
<summary>查看原文（32行）</summary>

```text
function cleanupRunFiles(id) {
	try { rmSync(runPromptPath(id), { force: true }); } catch {}
	try { rmSync(runConfigPath(id), { force: true }); } catch {}
}

function ensureRunsDir() {
	try {
		mkdirSync(RUNS_DIR, { recursive: true });
	} catch {}
}
function readRunIndex() {
	try {
		const data = JSON.parse(readFileSync(INDEX_PATH, "utf8"));
		return Array.isArray(data) ? data : [];
	} catch {
		return [];
	}
}
function writeRunIndex(runs) {
	try {
		ensureRunsDir();
		const tmp = `${INDEX_PATH}.tmp`;
		writeFileSync(tmp, JSON.stringify(runs.slice(0, MAX_RUNS), null, 1));
		renameSync(tmp, INDEX_PATH);
	} catch {}
}
function upsertRunIndex(meta) {
	const runs = readRunIndex();
	const at = runs.findIndex((run) => run.id === meta.id);
	if (at >= 0) runs[at] = { ...runs[at], ...meta };
	else runs.unshift(meta);
	writeRunIndex(runs);
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 现有恢复/共享并发之外，什么增量仍值得验证？

**研究主题**：新假设与验证、贡献与相对优势、工程质量与复用

#### 完整回答

共享并发槽、活动轮询、日志/PID重接和迟到通知已经存在，重复做“统一进度页/崩溃恢复”没有新量。剩余问题应先落到尝试身份和办结语义：同一个run下换模型，日志/firstEvent/状态/用量不隔离；通知投递也没有父端持久消费确认。对结果已不确定的外部写入，重发同任务可能扩大副作用，不能以新runId当业务重试保证。

候选是先修单run内的attempt边界：每次真实后端/模型/cwd/权限配置与进程启动身份绑定独立日志/终态，用明确总墙钟和可验证树停止约束资源，再给最终结果稳定完成回执，并由父端确认接收/验收状态。当前没有该完整协议，亦没有证明它需要独立插件；逐模型日志偏移、重置活动对象、修取消和补一个消费标记，可能已足够，必须作为最强简单替代。

最小实验用授权的可回滚副本/模拟外部动作，包含A模型失败B成功、只发初始化后挂起、宿主停机/重启、notice前后落标窗口和父消费中断。分别核最终模型/结果、误标/重复汇总、遗留进程/重复写入、恢复/纠错工时和所有尝试费用，对照当前实现与上述小修补。只有真实案件里仍有稳定收益，才考虑跨CLI的独立回执/资源协议；无法胜过简单修补、日志负担或误判增加，就否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:337-374](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L337-L374)

同run跨模型及首事件等待基础。

<details>
<summary>查看原文（38行）</summary>

```text
		};

		const runChain = async (target) => {
			const chain = target.models.length > 0 ? target.models : [undefined];
			const deadline = Date.now() + target.allowedWaitSeconds * 1000;
			const tried = [];
			for (const model of chain) {
				if (cancelled) throw new Error("cancelled");
				const label = model ?? "(CLI 默认)";
				activity.record("model", `正在尝试模型 ${label}`);
				const driver = DRIVERS[target.driver];
				const spawnSpec = spawnCommand(target.driver, target);
				const run = new QoderJsonRun({
					id,
					activity,
					parentAgent: this.#getAgent?.(request.parent?.id),
					stallWarnSeconds: target.stallWarnSeconds,
					warnAfterFirstEvent: true,
					driver,
					driverName: target.driver,
					provider: target.name,
					label: request.label ?? "",
					promptSummary: prompt.slice(0, 160),
					parentId: request.parent?.id,
					command: spawnSpec.command,
					args: [...spawnSpec.prefix, ...driver.buildArgs(target, model)],
					env: spawnSpec.env,
					cwd: request.cwd,
					prompt,
					signal: request.signal,
					timeoutMs: target.timeoutSeconds ? target.timeoutSeconds * 1000 : 0,
				});
				currentRun = run;
				const remaining = Math.max(0, deadline - Date.now());
				const waitMs = target.stallWarnSeconds > 0 ? Math.min(target.stallWarnSeconds * 1000, remaining) : remaining;
				const first = await Promise.race([
					run.firstEvent.then(() => "ready"),
					new Promise((resolve) => setTimeout(() => resolve("timeout"), waitMs)),
```

</details>

**依据 2 · 源码核查**：[lib/index.js:730-757](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L730-L757)

现有活动元数据/终态不足尝试隔离。

<details>
<summary>查看原文（28行）</summary>

```text
class ActivityLedger {
	runs = [];
	begin(meta) {
		const entry = { ...meta, sessionId: null, startedAt: Date.now(), endedAt: null, status: "running", events: [] };
		this.runs.unshift(entry);
		if (this.runs.length > MAX_RUNS) this.runs.length = MAX_RUNS;
		return {
			record(kind, text) {
				if (entry.events.length >= MAX_EVENTS) entry.events.shift();
				entry.events.push({ t: Date.now(), kind, text: String(text ?? "").slice(0, MAX_EVENT_TEXT) });
			},
			meta(key, value) {
				if (value != null && entry[key] == null) entry[key] = value;
			},
			provider(name) {
				if (name) entry.provider = name;
			},
			finish(status, summary) {
				if (entry.status !== "running") return;
				entry.status = status;
				entry.endedAt = Date.now();
				if (summary) this.record("result", summary);
			},
			snapshot() {
				return { status: entry.status, sessionId: entry.sessionId, credits: entry.credits, costUsd: entry.costUsd, startedAt: entry.startedAt };
			},
		};
	}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:939-970](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L939-L970)

现有重接与发送后标记，未见父消费回执。

<details>
<summary>查看原文（32行）</summary>

```text
function resumePersistedRuns(ctx) {
	const getAgent = (id) => ctx.get("agents")?.get?.(id);
	const index = readRunIndex();
	for (const meta of index) {
		if (!meta?.id) continue;
		const entry = activityLedger.adopt(meta);
		let offset = foldRunLog(meta, entry, 0);
		if (entry.status === "running" && !pidAlive(meta.pid)) {
			// CLI 可能在宿主停机期间已经完成:先折叠日志尾部,
			// 只有仍未收敛的运行才判定为失败。
			offset = foldRunLog(meta, entry, offset, true);
			if (entry.status === "running") {
				entry.status = "error";
				entry.endedAt = Date.now();
			}
			upsertRunIndex({ id: meta.id, status: entry.status, endedAt: entry.endedAt ?? Date.now(), pid: null });
		}
		if (entry.status !== "running") {
			cleanupRunFiles(meta.id);
			upsertRunIndex({ id: meta.id, status: entry.status, endedAt: entry.endedAt ?? Date.now(), sessionId: entry.sessionId, credits: entry.credits, costUsd: entry.costUsd, pid: null });
			if (!meta.notified) {
				const agent = getAgent(meta.parentId);
				if (agent && typeof agent.followup === "function") {
					try {
						agent.followup(createUserMessage({
							content: [{ type: "text", text: lateNoticeText(meta, entry) }],
							source: { kind: "subagent-settled", form: "notice", summary: boundContextSummary(`重启前发起的子代理已结束`), senderSessionId: meta.id },
						}));
						upsertRunIndex({ id: meta.id, notified: true });
					} catch {}
				}
			}
```

</details>

**依据 4 · 源码核查**：[lib/shared-gate.js:257-294](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/shared-gate.js#L257-L294)

恢复并发占位已实现，不重复当新功能。

<details>
<summary>查看原文（38行）</summary>

```text
		this.#activeCache.set(name, { value, at: Date.now() });
		return value;
	}

	/** 接管宿主机重启前遗留的运行:优先占用固定槽位,槽位已满则单独记一条。 */
	reserve(name) {
		if (!this.#memory) {
			try {
				const dir = this.#ensureDir(name);
				this.#sweep(dir);
				for (let i = 0; i < 64; i++) {
					const file = join(dir, `slot-${i}.lock`);
					const token = randomUUID();
					try {
						this.#writeNew(file, token);
						this.#activeCache.delete(name);
						return this.#hold(file, token, name);
					} catch (error) {
						if (error?.code !== "EEXIST") throw error;
					}
				}
				const file = join(dir, `adopt-${randomUUID()}.lock`);
				const token = randomUUID();
				this.#writeNew(file, token);
				this.#activeCache.delete(name);
				return this.#hold(file, token, name);
			} catch {
				this.#memory = new Map();
			}
		}
		const used = this.#memory.get(name) ?? 0;
		this.#memory.set(name, used + 1);
		let released = false;
		return () => {
			if (released) return;
			released = true;
			this.#memory.set(name, Math.max(0, (this.#memory.get(name) ?? 1) - 1));
		};
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 现在如何采用，何时应停止或回退？

**研究主题**：采用判断、效果与总成本

#### 完整回答

建议观察，不把多CLI默认bypass、同名工具或“300秒预算”直接接生产写入。适合已有CLI订阅、理解账号/工作区边界且能验收子任务的人，先在隔离副本只启用一个已授权后端，用最小权限与显式timeout完成一个可核任务。并行/溢出应在真实后端/账号允许范围内，再按所有尝试的费用与父验收工时决定是否增加。

升级/使用前至少核实际宿主与CLI版本、首JSON后挂起、A失败B成功的结果/状态/用量、取消后代和重启父notice消费。任务产物、结果句柄、活动面板与恢复通知要能对应；任何停止后仍写入、跨账号范围、模型归属/状态不一致或不确定动作被重发，均应停新委派、查现有进程与权威结果，再回手动终端/原生单后端流程，不能先再发一次。

独立评分把具体委派机制与净收益分开：有真实spawn/日志/结果链，源码证据不因未运行统一归零；同时源内尝试隔离、权限、总预算与退出边界限制采用。技术增量是CLI驱动/宿主编排与日志恢复，非外部模型和CLI工具循环原创；商业仍是同类编码任务便利，没有质量/费用/新用户工作流证据。未来回执协议未实现，不计现有分数。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1644-1664](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L1644-L1664)

实际默认权限/等待/timeout。

<details>
<summary>查看原文（21行）</summary>

```text
function normalizeSpec(entry) {
	const models = Array.isArray(entry.models) && entry.models.length > 0
		? entry.models
		: entry.model
			? [entry.model]
			: [];
	return {
		name: entry.name,
		driver: entry.driver ?? "qoder-json",
		binary: resolveBinary(entry.name, entry.binary),
		permissionMode: entry.permissionMode ?? "bypass_permissions",
		models,
		allowedWaitSeconds: entry.allowedWaitSeconds ?? 300,
		reasoningEffort: entry.reasoningEffort ?? "auto",
		contextWindow: entry.contextWindow ?? undefined,
		timeoutSeconds: entry.timeoutSeconds ?? undefined,
		stallWarnSeconds: entry.stallWarnSeconds ?? 90,
		extraArgs: entry.extraArgs ?? [],
		maxConcurrency: entry.maxConcurrency ?? 2,
	};
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:337-385](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L337-L385)

不是全任务预算的真实调用。

<details>
<summary>查看原文（49行）</summary>

```text
		};

		const runChain = async (target) => {
			const chain = target.models.length > 0 ? target.models : [undefined];
			const deadline = Date.now() + target.allowedWaitSeconds * 1000;
			const tried = [];
			for (const model of chain) {
				if (cancelled) throw new Error("cancelled");
				const label = model ?? "(CLI 默认)";
				activity.record("model", `正在尝试模型 ${label}`);
				const driver = DRIVERS[target.driver];
				const spawnSpec = spawnCommand(target.driver, target);
				const run = new QoderJsonRun({
					id,
					activity,
					parentAgent: this.#getAgent?.(request.parent?.id),
					stallWarnSeconds: target.stallWarnSeconds,
					warnAfterFirstEvent: true,
					driver,
					driverName: target.driver,
					provider: target.name,
					label: request.label ?? "",
					promptSummary: prompt.slice(0, 160),
					parentId: request.parent?.id,
					command: spawnSpec.command,
					args: [...spawnSpec.prefix, ...driver.buildArgs(target, model)],
					env: spawnSpec.env,
					cwd: request.cwd,
					prompt,
					signal: request.signal,
					timeoutMs: target.timeoutSeconds ? target.timeoutSeconds * 1000 : 0,
				});
				currentRun = run;
				const remaining = Math.max(0, deadline - Date.now());
				const waitMs = target.stallWarnSeconds > 0 ? Math.min(target.stallWarnSeconds * 1000, remaining) : remaining;
				const first = await Promise.race([
					run.firstEvent.then(() => "ready"),
					new Promise((resolve) => setTimeout(() => resolve("timeout"), waitMs)),
					aborted,
				]);
				if (first === "aborted" || cancelled) {
					await run.dispose();
					throw new Error("cancelled");
				}
				if (first === "ready") {
					const result = await run.handle().result;
					await run.dispose();
					if (result.stopReason === "completed") return result;
					if (cancelled) throw new Error("cancelled");
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1375-1397](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L1375-L1397)

进程停止验收必须看实际callee。

<details>
<summary>查看原文（23行）</summary>

```text
	#waitForExit() {
		if (this.#exitInfo) return Promise.resolve();
		return new Promise((resolve) => this.#child.once("close", resolve));
	}

	#killTree() {
		if (this.#child.exitCode !== null || this.#child.signalCode !== null) return;
		if (platform === "win32") {
			const killer = spawn("taskkill", ["/pid", String(this.#child.pid), "/T", "/F"], {
				stdio: "ignore",
				windowsHide: true,
			});
			killer.on("error", () => this.#child.kill("SIGKILL"));
			return;
		}
		try {
			this.#child.kill("SIGKILL");
		} catch {}
	}
}
//#endregion

//#region 探测(设置页 RPC)
```

</details>

**依据 4 · 源码核查**：[lib/index.js:939-970](https://github.com/1373700184/dsh-subagent/blob/b548020a6c36521d93a0d9a2ec08e6f74961e8a2/lib/index.js#L939-L970)

恢复/通知不等父任务验收。

<details>
<summary>查看原文（32行）</summary>

```text
function resumePersistedRuns(ctx) {
	const getAgent = (id) => ctx.get("agents")?.get?.(id);
	const index = readRunIndex();
	for (const meta of index) {
		if (!meta?.id) continue;
		const entry = activityLedger.adopt(meta);
		let offset = foldRunLog(meta, entry, 0);
		if (entry.status === "running" && !pidAlive(meta.pid)) {
			// CLI 可能在宿主停机期间已经完成:先折叠日志尾部,
			// 只有仍未收敛的运行才判定为失败。
			offset = foldRunLog(meta, entry, offset, true);
			if (entry.status === "running") {
				entry.status = "error";
				entry.endedAt = Date.now();
			}
			upsertRunIndex({ id: meta.id, status: entry.status, endedAt: entry.endedAt ?? Date.now(), pid: null });
		}
		if (entry.status !== "running") {
			cleanupRunFiles(meta.id);
			upsertRunIndex({ id: meta.id, status: entry.status, endedAt: entry.endedAt ?? Date.now(), sessionId: entry.sessionId, credits: entry.credits, costUsd: entry.costUsd, pid: null });
			if (!meta.notified) {
				const agent = getAgent(meta.parentId);
				if (agent && typeof agent.followup === "function") {
					try {
						agent.followup(createUserMessage({
							content: [{ type: "text", text: lateNoticeText(meta, entry) }],
							source: { kind: "subagent-settled", form: "notice", summary: boundContextSummary(`重启前发起的子代理已结束`), senderSessionId: meta.id },
						}));
						upsertRunIndex({ id: meta.id, notified: true });
					} catch {}
				}
			}
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
