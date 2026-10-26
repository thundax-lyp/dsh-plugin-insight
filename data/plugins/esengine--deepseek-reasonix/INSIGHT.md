# Reasonix

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[ec56ac2](https://github.com/esengine/DeepSeek-Reasonix/tree/ec56ac27a34a47aa36f8748f93d08aaab21027fb)

<!-- BEGIN META -->
[![GitHub ★ 35,959](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C959&color=yellow&logo=github&style=flat)](https://github.com/esengine/DeepSeek-Reasonix)
<!-- END META -->

> **实现功能**：独立开源编码Agent，提供终端、Studio、Web及ACP入口，可由DSH委派任务。

> **核心亮点**：本体把编码引擎组织为多前端与权限接口；DSH集成复用ACP以配置完成委派，增量是可用接线而非新协议或宿主保证。[Q01](#research-q01)

> **风险与缺陷**：自动allow不是逐次人工审批，nil Approver与Ask语义需按前端核对；新进程不共享父会话，rewind不覆盖shell副作用。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 根项目与DSH集成各是什么，贡献在哪里？](#detail-section-11)
  - [Q02 · ACP委派与权限取消怎样接线？](#detail-section-12)
  - [Q03 · 委派与rewind容易被误读的边界是什么？](#detail-section-13)
  - [Q04 · 如何试用及验证有意义的新方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要本地编码Agent或DSH委派只读研究/评审的开发者；根项目是工具/应用，DSH bundle只是子目录配置。[Q01](#research-q01)

直接在Reasonix或既有单Agent上执行同任务；委派应以相同模型预算比较交付及交接负担，不以另开进程数证明协作价值。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|编码Agent|读改跑及测试|模型远端接收内容，需独立验收|
|DSH ACP委派|子进程处理任务|同版provider、默认reject、无父历史|
|rewind|回退编辑工具改动|不覆盖shell副作用|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|正确2.x Reasonix发行|必需|与固定studio代码对应|不混用npm1.x|
|模型home/key和可达command|任务必需|子进程模型执行|先reasonix setup并核对路径|
|同版DSH/ACP provider|委派必需|协议与插件加载|显式核对版本|
|可丢弃cwd/明确权限|试用必需|限制修改与恢复|维持reject只读|

#### 启动步骤

|步骤|执行者与成功判据|失败处理|
|---|---|---|
|配置正确发行及模型home|用户确认独立执行可用|修正路径/凭据|
|装同版bundle并启开关|用户确认reasonix工具存在|不接受shell伪委派|
|只读任务、取消和恢复|用户核对返回与进程|检查副作用再重试|

**效果与成本**

#### 成本

|阶段|现金与资源|人工与时间|未知|
|---|---|---|---|
|首次|正确发行、模型和ACP包|配置home/key、目录及版本|兼容与配置工时|
|持续|子模型请求和重复上下文|委派、合并与独立测试|总调用成本和收益|
|失败恢复|取消、重试与文件恢复|核对shell副作用及未验证改动|回收/恢复成功率与时间|

#### 效果

|效果项|抽读支持|未知|
|---|---|---|
|DSH委派|ACP配置与作者报告|本轮运行兼容|
|权限/取消|Policy分离、request context|所有前端和工具实际行为|
|文件恢复|作者明确编辑工具范围|shell及完整工作区恢复|

> **思考**：自动allow不是逐次人工审批，nil Approver与Ask语义需按前端核对；新进程不共享父会话，rewind不覆盖shell副作用。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：本体把编码引擎组织为多前端与权限接口；DSH集成复用ACP以配置完成委派，增量是可用接线而非新协议或宿主保证。[Q01](#research-q01)

本体把编码引擎组织为多前端与权限接口；DSH集成复用ACP以配置完成委派，增量是可用接线而非新协议或宿主保证。[Q01](#research-q01)

纯Policy与Approver解耦、requestId独立取消值得复用；移植必须保留前端默认权限和副作用所有权，不能只复制工具名。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

自动allow不是逐次人工审批，nil Approver与Ask语义需按前端核对；新进程不共享父会话，rewind不覆盖shell副作用。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先以可丢弃项目和默认reject做只读研究/评审试用，核对真实tool委派、同版provider和模型home；不把正常结束或rewind当完整验收。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

抽读支持ACP/权限接线；作者宿主验证未独立复现，完整编码/rewind效果未知；交付收据假设未验证。

- 已检查：作者 README、包清单、源码路径 docs/DSH.md、integrations/dsh-plugin/cordis.patch.yml、internal/safety/permission/permission.go、internal/frontend/acp/cancel_request.go、desktop/frontend-next/src/state/rewind_notice.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：partial clone固定studio源码抽读DSH文档/bundle、Go permission与ACP取消及UI notice；inventory只计支持的MD/TS子集，不把Go遗漏当零规模，未审计整个loop/sandbox/rewind，未执行。
- 下一步：隔离项目核查ACP工具注册、reject、取消、错误、未验证暂停标记及编辑/shell差异；同任务比较父误判与恢复工时。

**分析版本**

- **仓库**：[esengine/DeepSeek-Reasonix](https://github.com/esengine/DeepSeek-Reasonix)
- **版本号**：未声明（[固定提交 ec56ac2](https://github.com/esengine/DeepSeek-Reasonix/tree/ec56ac27a34a47aa36f8748f93d08aaab21027fb)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是父子交换验证命令、修改范围及不可恢复副作用收据，减少正常结束被误当完成验收；对照错误/取消任务的父误判和恢复时间，无改善则否定。[Q04](#research-q04)

隔离项目核查ACP工具注册、reject、取消、错误、未验证暂停标记及编辑/shell差异；同任务比较父误判与恢复工时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：根；内容摘要：5bd593c6c641d9a8735d8f7f11e15aab2bd92edf23241a4aaec9c081a4f14bee。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 1 | 32 | 26 | 0 | — |
| .md | source | 2 | 464 | — | — | 3830 |

</details>

**活跃度**

[![Issue 未关闭 482](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=482&color=grey&logo=github&style=flat)](https://github.com/esengine/DeepSeek-Reasonix/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1,154](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1%2C154&color=grey&logo=github&style=flat)](https://github.com/esengine/DeepSeek-Reasonix/issues?q=is%3Aissue+created%3A2026-09-26T03%3A38%3A16.401Z..2026-10-26T03%3A38%3A16.401Z) [![近30天关闭 1,877](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1%2C877&color=grey&logo=github&style=flat)](https://github.com/esengine/DeepSeek-Reasonix/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A38%3A16.401Z..2026-10-26T03%3A38%3A16.401Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多前端编码Agent与DSH ACP委派如何处理权限、取消和恢复边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目与DSH集成各是什么，贡献在哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根项目是Go编码Agent和多前端应用，Studio/终端/浏览器/ACP共用本地引擎，模型服务由用户配置；integrations/dsh-plugin只是其中一个配置bundle，不能把根项目写成普通DSH插件。目标是读取项目、修改文件和执行测试，合格结果是可核查的改动与验证。相对终端脚本，本体贡献是权限与多前端执行组织；DSH集成则复用宿主subagent-acp，用reasonix acp配置委派，没有新跨进程算法。README明确2.x Studio在开发而npm/main-v2是1.x维护线，当前固定studio源码不能用npm版本的成熟度或行为替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:64-74](https://github.com/esengine/DeepSeek-Reasonix/blob/ec56ac27a34a47aa36f8748f93d08aaab21027fb/README.md#L64-L74)

本地程序与远端模型、编辑和rewind边界

<details>
<summary>查看原文（11行）</summary>

```text
## What it is

Reasonix is an open-source AI coding assistant. The program runs on your computer; the AI model is a service you configure, which receives what it reads. You describe a task in plain language; it reads code, edits files and runs commands and tests inside the project folder you choose, and shows you each step.

You pick the model: a DeepSeek preset is built in, any OpenAI-compatible service is one config entry, and you pay the model provider directly.

## What you get

- **Read, edit, run.** It reads code, edits files and runs tests and commands, all inside your project folder.
- **Permission levels.** Have it ask every time, or let everyday actions run on their own; your forbid rules always hold. To see the approach first, use plan mode: it starts work only once you approve.
- **Rewind.** A file is saved before it changes, so you can rewind by conversation turn without touching your git history. Only files its edit tools changed are covered, not what a shell command did.
```

</details>

**依据 2 · 作者声明**：[README.md:87-119](https://github.com/esengine/DeepSeek-Reasonix/blob/ec56ac27a34a47aa36f8748f93d08aaab21027fb/README.md#L87-L119)

前端、DSH集成与版本线

<details>
<summary>查看原文（33行）</summary>

```text
## Four ways to use it

- **Desktop app (Studio).** A graphical app; the best place to start.
- **Terminal.** A full-screen text interface; `reasonix run "task"` also works in scripts.
- **Browser.** `reasonix web` opens a web interface on your own machine.
- **Editor.** Install the extension in VS Code; other editors that support ACP (Agent Client Protocol, a common way for an editor to connect to an AI assistant) can connect to `reasonix acp`.

All four are the same program underneath. What follows is for advanced users and contributors.

## Use it from DeepSeek Harness

DeepSeek Harness (`dsh`) can hand a task to Reasonix as a subagent over ACP. This repository publishes a plugin index for it:

1. Run `reasonix setup` on the machine that runs `dsh`. In the DSH Web UI turn on Custom plugin markets (Plugins, More) and add this index in the Discover tab: `https://raw.githubusercontent.com/esengine/DeepSeek-Reasonix/studio/integrations/dsh-plugin/market-index.json`
2. Install "Reasonix subagent" from it.
3. Open the plugin's page and turn its switch on. While it is off the model has no `reasonix` tool and may run `reasonix -p` in its own shell, which looks like a delegation and is not one.

Setup details, the permission policy and limits are in [Using Reasonix from DeepSeek Harness](./docs/DSH.md).

## Versions

Reasonix ships on two lines. See the [version roadmap announcement](https://github.com/esengine/DeepSeek-Reasonix/discussions/10748) for the reasoning behind the split.

| Line | Branch | Status | Get it |
| --- | --- | --- | --- |
| **Reasonix 2.x** | `studio` (this branch) | Active development | [Studio releases](https://github.com/esengine/DeepSeek-Reasonix/releases?q=studio-v&expanded=true) |
| **Reasonix 1.x** | [`main-v2`](https://github.com/esengine/DeepSeek-Reasonix/tree/main-v2) | Maintenance / stable | `npm i -g reasonix` · [desktop download](https://reasonix.io/?download=desktop#start) |

- **Want something stable?** Stay on 1.x. It keeps receiving bug fixes,
  provider/API compatibility, updater and security fixes; its core architecture
  is no longer being extended.
- **Want the new architecture?** Use 2.x Reasonix Studio. It is still moving
  quickly; reports are welcome.
```

</details>

**依据 3 · 作者声明**：[docs/DSH.md:16-25](https://github.com/esengine/DeepSeek-Reasonix/blob/ec56ac27a34a47aa36f8748f93d08aaab21027fb/docs/DSH.md#L16-L25)

作者说明配置委派与版本前提

<details>
<summary>查看原文（10行）</summary>

```text
## Purpose

DeepSeek Harness (`dsh`) can delegate a task to any Agent Client Protocol agent through its `subagent-acp` provider. Reasonix speaks ACP with `reasonix acp`, so a Harness agent can hand work to Reasonix as a subagent with no code on either side, only configuration.

Verified against `dsh` 0.2.1-rc.2 and `@deepseek-ai/dsh-subagent-acp` 0.2.1-rc.2, with a real DeepSeek model in the Reasonix child.

## Preconditions

1. Reasonix MUST be installed on the machine that runs `dsh`, and its model provider MUST be set up there: run `reasonix setup` once.
2. `reasonix` MUST be reachable by the command you configure (an absolute path is the safest).
```

</details>

#### 缺口

- 同模型编码任务交付及多前端一致性未验证
  **影响**：不能确认委派正确、兼容或恢复成本
  **进一步探讨**：在可丢弃项目用固定读代码任务验证ACP权限、取消、错误和产物，同模型直接执行作对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · ACP委派与权限取消怎样接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

bundle注册subagent-acp provider指向reasonix acp，permission:reject，再注册tool-subagent并maxDepth:provider-managed。docs说明宿主自动答复子进程权限卡，reject取消，allow选择每次允许项，父UI不会逐卡展示；因此allow不是人逐次审批，隔离与子进程sandbox另配。Go permission模块将纯Policy与可交互Approver分离，有助跨前端保持规则，但注释明确非交互nil Approver保留自主allow语义，不能从“Ask”字样保证会有人确认。本项未检查所有调用者是否装Approver，不把注释当可利用漏洞。ACP flightSet按JSON-RPC requestId创建独立context取消，未知id忽略且结束回收，体现请求级取消隔离；它不单独证明工具副作用可撤销或子进程全回收。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh-plugin/cordis.patch.yml:1-14](https://github.com/esengine/DeepSeek-Reasonix/blob/ec56ac27a34a47aa36f8748f93d08aaab21027fb/integrations/dsh-plugin/cordis.patch.yml#L1-L14)

provider/tool配置和默认权限

<details>
<summary>查看原文（14行）</summary>

```text
- insert:
    - id: subagent-acp-reasonix
      name: '@deepseek-ai/dsh-subagent-acp'
      config:
        providerName: reasonix
        command: reasonix
        args: ['acp']
        permission: reject
    - id: tool-subagent-reasonix
      name: '@deepseek-ai/dsh-tool-subagent'
      config:
        provider: reasonix
        toolName: reasonix
        maxDepth: provider-managed
```

</details>

**依据 2 · 源码核查**：[internal/safety/permission/permission.go:1-27](https://github.com/esengine/DeepSeek-Reasonix/blob/ec56ac27a34a47aa36f8748f93d08aaab21027fb/internal/safety/permission/permission.go#L1-L27)

Policy/Gate分工及决策

<details>
<summary>查看原文（27行）</summary>

```text
// Package permission decides, per tool call, whether to allow it, deny it, or
// ask the user first. The core is a pure Policy (rule evaluation, no I/O); a
// Gate wraps a Policy with an optional interactive Approver and is what the
// agent consults at execute time. Keeping rule evaluation pure makes it
// trivially testable and keeps the agent independent of how "ask" is resolved.
package permission

import (
	"context"
	"encoding/json"
	"reasonix/internal/contract/permrule"
	"strings"

	"reasonix/internal/base/shellparse"
	"reasonix/internal/safety/shellsafe"
)

// Decision is the outcome of evaluating a tool call against a Policy.
type Decision int

const (
	// Allow runs the tool without prompting.
	Allow Decision = iota
	// Ask defers to an interactive Approver (or, with none, resolves to Allow).
	Ask
	// Deny blocks the tool in every mode.
	Deny
```

</details>

**依据 3 · 源码核查**：[internal/safety/permission/permission.go:576-611](https://github.com/esengine/DeepSeek-Reasonix/blob/ec56ac27a34a47aa36f8748f93d08aaab21027fb/internal/safety/permission/permission.go#L576-L611)

可选Approver及非交互语义

<details>
<summary>查看原文（36行）</summary>

```text
// Approver resolves an Ask decision interactively. Implementations live in the
// front-end (the chat TUI); a non-interactive run passes a nil Approver, which
// the Gate treats as "allow" to preserve autonomous behaviour.
type Approver interface {
	// Approve asks the user about a pending call. It returns whether to allow
	// it and whether to remember that choice as a new rule. A non-nil err (e.g.
	// the context was cancelled while waiting) aborts the turn.
	Approve(ctx context.Context, toolName, subject string, args json.RawMessage) (allow, remember bool, err error)
}

// ReasonedApprover is the optional extension used by frontends that can return
// a denial reason to feed back to the model.
type ReasonedApprover interface {
	ApproveWithReason(ctx context.Context, toolName, subject string, args json.RawMessage) (allow, remember bool, reason string, err error)
}

// PolicyReasonedApprover receives the explicit permission-rule provenance that
// caused an Ask decision. Frontends can display it without duplicating Policy
// matching logic; older Approver implementations remain source-compatible.
type PolicyReasonedApprover interface {
	ApproveWithPolicyReason(ctx context.Context, toolName, subject string, args json.RawMessage, policyReason string) (allow, remember bool, reason string, err error)
}

// Gate is what the agent consults at execute time: a Policy plus an optional
// Approver. It satisfies the agent's Gate interface structurally.
type Gate struct {
	Policy   Policy
	Approver Approver

	// OnRemember, when set, is invoked with a new allow rule the user chose to
	// remember (e.g. "Bash(go build)"), so the front-end can persist it.
	OnRemember func(rule string)
}

// NewGate wires a Policy to an Approver (nil for non-interactive use).
func NewGate(p Policy, a Approver) *Gate { return &Gate{Policy: p, Approver: a} }
```

</details>

**依据 4 · 源码核查**：[internal/frontend/acp/cancel_request.go:17-72](https://github.com/esengine/DeepSeek-Reasonix/blob/ec56ac27a34a47aa36f8748f93d08aaab21027fb/internal/frontend/acp/cancel_request.go#L17-L72)

独立请求上下文和取消

<details>
<summary>查看原文（56行）</summary>

```text
)

// flightSet is the requests being served, so one can be cancelled by its id
// without touching the others or the session they belong to.
type flightSet struct {
	mu sync.Mutex
	m  map[string]*flight
}

type flight struct {
	cancel    context.CancelFunc
	cancelled atomic.Bool
}

func flightKey(id json.RawMessage) string { return string(bytes.TrimSpace(id)) }

// begin registers a request and returns the context its handler runs under, the
// flight to ask whether it was cancelled, and the function that ends it.
func (s *flightSet) begin(ctx context.Context, id json.RawMessage) (context.Context, *flight, func()) {
	ctx, cancel := context.WithCancel(ctx)
	f := &flight{cancel: cancel}
	key := flightKey(id)
	s.mu.Lock()
	if s.m == nil {
		s.m = map[string]*flight{}
	}
	s.m[key] = f
	s.mu.Unlock()
	return ctx, f, func() {
		s.mu.Lock()
		if s.m[key] == f {
			delete(s.m, key)
		}
		s.mu.Unlock()
		cancel()
	}
}

// cancel ends the request with this id if it is still being served. An id that
// is unknown, already answered or malformed is ignored: a notification has nowhere
// to report anything.
func (s *flightSet) cancel(params json.RawMessage) {
	var p struct {
		RequestID json.RawMessage `json:"requestId"`
	}
	if json.Unmarshal(params, &p) != nil || len(p.RequestID) == 0 {
		return
	}
	s.mu.Lock()
	f := s.m[flightKey(p.RequestID)]
	s.mu.Unlock()
	if f != nil {
		f.cancelled.Store(true)
		f.cancel()
	}
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 委派与rewind容易被误读的边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

docs中的0.2.1-rc.2真实模型验证是作者报告，本轮没有复现。前提是Reasonix在DSH所在机器配置好provider key、command可达、宿主与ACP provider包同版本；凭据在Reasonix home而非仅靠父env注入，配置切错home可能失败或使用错误账号。每次委派新ACP进程，仅prompt和cwd跨边界、无父会话和后续消息，不能当长期共享团队成员；maxDepth交给provider管理意味着父侧没有子进程内部深度保证。README的rewind只覆盖编辑工具修改，不覆盖shell改文件，不能当完整工作区回滚。模型接收读取内容，local运行不代表代码留本地。权限、上下文和可恢复范围必须进入采用判断，不能只比较子Agent返回文本。

#### 证据与依据

**依据 1 · 作者声明**：[docs/DSH.md:20-25](https://github.com/esengine/DeepSeek-Reasonix/blob/ec56ac27a34a47aa36f8748f93d08aaab21027fb/docs/DSH.md#L20-L25)

作者验证与配置前提

```text
Verified against `dsh` 0.2.1-rc.2 and `@deepseek-ai/dsh-subagent-acp` 0.2.1-rc.2, with a real DeepSeek model in the Reasonix child.

## Preconditions

1. Reasonix MUST be installed on the machine that runs `dsh`, and its model provider MUST be set up there: run `reasonix setup` once.
2. `reasonix` MUST be reachable by the command you configure (an absolute path is the safest).
```

**依据 2 · 作者声明**：[docs/DSH.md:111-134](https://github.com/esengine/DeepSeek-Reasonix/blob/ec56ac27a34a47aa36f8748f93d08aaab21027fb/docs/DSH.md#L111-L134)

自动权限、父可见状态与限制

<details>
<summary>查看原文（24行）</summary>

```text
| `allow` | `dsh` selects the first `allow_once` or `allow_always` option of every request. Every approval card Reasonix raises is accepted without a person looking at it. |

Choosing `allow` MUST be a deliberate decision to let the Harness agent, and whoever steers it, run whatever Reasonix's tools can do in that workspace. It answers approval cards only; Reasonix's sandbox is configured separately in Reasonix.

1. Use `reject` for read-only research and review tasks.
2. Use `allow` only for a task you would approve wholesale, in a workspace you can discard or restore, and set `cwd` to that workspace.

## What the parent sees

| Event | Parent receives |
| --- | --- |
| Child answers | The child's final message text, as the closing message of a finished background subagent. |
| Child turn pauses as unverified (files written, no verification command ran) | The same final text, ending in a host-written `[paused] Not verified, …` line. The turn itself ends normally. |
| Child turn fails (model endpoint down, provider refusal) | A failed subagent with category `transport`. `dsh` does not put the child's error message into the parent model's view. |
| Parent cancels | The child is sent `session/cancel`, the turn ends as `cancelled`, and the process is reaped. |

## Limits

1. One fresh `reasonix acp` process per delegation; nothing from the parent conversation crosses, only the prompt text and the workspace path.
2. The child accepts no follow-up messages.
3. Only message text crosses back. The child's reasoning, tool traffic and plans stay in its own session.
4. `dsh` advertises no filesystem or terminal client capability, so Reasonix reads and writes the workspace directly.
5. The child pays for its own context; its tokens do not enter the parent conversation.
6. An install without credentials fails `session/new` with the ACP "Authentication required" error (`-32000`), which `dsh` reports as a failed start.
```

</details>

**依据 3 · 作者声明**：[README.md:66-74](https://github.com/esengine/DeepSeek-Reasonix/blob/ec56ac27a34a47aa36f8748f93d08aaab21027fb/README.md#L66-L74)

远端模型及rewind覆盖

```text
Reasonix is an open-source AI coding assistant. The program runs on your computer; the AI model is a service you configure, which receives what it reads. You describe a task in plain language; it reads code, edits files and runs commands and tests inside the project folder you choose, and shows you each step.

You pick the model: a DeepSeek preset is built in, any OpenAI-compatible service is one config entry, and you pay the model provider directly.

## What you get

- **Read, edit, run.** It reads code, edits files and runs tests and commands, all inside your project folder.
- **Permission levels.** Have it ask every time, or let everyday actions run on their own; your forbid rules always hold. To see the approach first, use plan mode: it starts work only once you approve.
- **Rewind.** A file is saved before it changes, so you can rewind by conversation turn without touching your git history. Only files its edit tools changed are covered, not what a shell command did.
```

#### 缺口

- 宿主委派、进程回收、凭据隔离与rewind实际覆盖未验收
  **影响**：不能确认委派正确、兼容或恢复成本
  **进一步探讨**：在可丢弃项目用固定读代码任务验证ACP权限、取消、错误和产物，同模型直接执行作对照

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试用及验证有意义的新方向？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议有编码Agent需求者先在可丢弃仓库，以默认reject做只读研究/评审委派，核对确实有reasonix工具调用而不是模型用shell运行reasonix -p。首次成本为选择正确2.x发行、模型配置、同版ACP包与目录权限；持续为子模型调用、上下文重复和人工合并/测试；失败恢复包含子进程取消、已修改文件与shell副作用核对，未测金额和工时。未验证假设是父子显式传递“已验证命令、实际修改范围、不可rewind副作用”收据，比只有最终文本更能防止正常结束被误当代码验证完成。docs已有unverified暂停标记提供推导线索；对照读/写/测试失败/取消任务，测父误判、重复执行和恢复人工时间。若不能减少误判或让交接成本更高，则否定。未授权不把reject改allow以追求成功演示。

#### 证据与依据

**依据 1 · 作者声明**：[docs/DSH.md:75-82](https://github.com/esengine/DeepSeek-Reasonix/blob/ec56ac27a34a47aa36f8748f93d08aaab21027fb/docs/DSH.md#L75-L82)

开关和shell伪委派边界

```text
- Turning the switch on in a running `dsh web` is enough: the next new session has the `reasonix` tool (observed on `dsh` 0.2.1-rc.2, 2026-10-18). Restart `dsh` only if it is still missing.
- While it is off the model has no `reasonix` tool and may run `reasonix -p` in its own shell instead.
- That looks like a delegation and is not one: there is no subagent, no `reasonix` tool call, and no permission policy applies.

## Finding it in Discover

DSH ships an optional "Custom plugin markets" feature with no default index; a user adds index URLs themselves. This repository publishes one:

```

**依据 2 · 作者声明**：[docs/DSH.md:115-134](https://github.com/esengine/DeepSeek-Reasonix/blob/ec56ac27a34a47aa36f8748f93d08aaab21027fb/docs/DSH.md#L115-L134)

权限及父子状态差异

<details>
<summary>查看原文（20行）</summary>

```text
1. Use `reject` for read-only research and review tasks.
2. Use `allow` only for a task you would approve wholesale, in a workspace you can discard or restore, and set `cwd` to that workspace.

## What the parent sees

| Event | Parent receives |
| --- | --- |
| Child answers | The child's final message text, as the closing message of a finished background subagent. |
| Child turn pauses as unverified (files written, no verification command ran) | The same final text, ending in a host-written `[paused] Not verified, …` line. The turn itself ends normally. |
| Child turn fails (model endpoint down, provider refusal) | A failed subagent with category `transport`. `dsh` does not put the child's error message into the parent model's view. |
| Parent cancels | The child is sent `session/cancel`, the turn ends as `cancelled`, and the process is reaped. |

## Limits

1. One fresh `reasonix acp` process per delegation; nothing from the parent conversation crosses, only the prompt text and the workspace path.
2. The child accepts no follow-up messages.
3. Only message text crosses back. The child's reasoning, tool traffic and plans stay in its own session.
4. `dsh` advertises no filesystem or terminal client capability, so Reasonix reads and writes the workspace directly.
5. The child pays for its own context; its tokens do not enter the parent conversation.
6. An install without credentials fails `session/new` with the ACP "Authentication required" error (`-32000`), which `dsh` reports as a failed start.
```

</details>

**依据 3 · 作者声明**：[README.md:72-74](https://github.com/esengine/DeepSeek-Reasonix/blob/ec56ac27a34a47aa36f8748f93d08aaab21027fb/README.md#L72-L74)

文件恢复覆盖

```text
- **Read, edit, run.** It reads code, edits files and runs tests and commands, all inside your project folder.
- **Permission levels.** Have it ask every time, or let everyday actions run on their own; your forbid rules always hold. To see the approach first, use plan mode: it starts work only once you approve.
- **Rewind.** A file is saved before it changes, so you can rewind by conversation turn without touching your git history. Only files its edit tools changed are covered, not what a shell command did.
```

#### 缺口

- 交付收据假设及委派总成本没有对照结果
  **影响**：不能确认委派正确、兼容或恢复成本
  **进一步探讨**：在可丢弃项目用固定读代码任务验证ACP权限、取消、错误和产物，同模型直接执行作对照

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
