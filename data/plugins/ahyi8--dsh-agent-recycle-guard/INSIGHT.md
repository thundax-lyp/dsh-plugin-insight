# dsh-agent-recycle-guard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[fd84079](https://github.com/AhYi8/dsh-agent-recycle-guard/tree/fd84079f98170d5066547c087c58c824b4e59d07)

<!-- BEGIN META -->
[![npm 30d 876](https://img.shields.io/static/v1?label=npm+30d&message=876&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-agent-recycle-guard) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-agent-recycle-guard)
<!-- END META -->

> **实现功能**：将 Agent 常见直接删除改为系统回收，并对执行脚本做有限内容检查，异常时阻止命令。

> **核心亮点**：将有限删除识别、真实Shell参数展开和系统回收接入DSH原工具权限链，并在分析失败时拒绝，而非宿主插件直接越过工具执行回收；增量是边界清楚的机制组合。详见[Q01](#research-q01)。

> **风险与缺陷**：有限脚本检查并不证明任意代码安全，超大、未知编码和深层加载可能放行，路径复核也非原子隔离；这些静态边界必须限制其作为删除缓冲的用途。详见[Q03](#research-q03)。

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
  - [Q01 · 谁需要可恢复删除，现有替代与交付是什么？](#detail-section-11)
  - [Q02 · 原工具如何经分析、改写、重新执行和回收？](#detail-section-12)
  - [Q03 · 有限脚本检查和路径复核留下什么边界？](#detail-section-13)
  - [Q04 · 自动运行时准备与操作流程依赖什么？](#detail-section-14)
  - [Q05 · 首次、持续及失败恢复成本和效果如何？](#detail-section-15)
  - [Q06 · 工程设计可借鉴什么，能推导什么未验证改进？](#detail-section-16)
  - [Q07 · 对什么人值得试用，停止标准是什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：本机项目维护者希望给Agent常见删除提供可恢复缓冲，合格结果是目标与语义不扩大、失败不降级永久删除，不把插件当系统级隔离。详见[Q01](#research-q01)。

简单替代为人工确认、禁用删除或显式使用回收命令；本插件减少提示和手工改写，但新增解析环境与覆盖判断负担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 常见直接删除改写 | 用系统回收替代永久删除 | 不支持的语义拒绝 |
| 有限脚本检查 | 识别常见删除API与调用 | 体积、编码、深度和动态加载受限 |
| 平台回收与回执 | 保留恢复可能性 | 需要系统回收区；多目标非事务 |
| 自动运行时准备 | 减少手工Python接线 | 首次联网、缓存与平台依赖 |

**流程与依赖**

#### 启动与依赖

| 条件 | 必要性与用途 | 失效影响 |
| --- | --- | --- |
| DSH tools/shell及匹配事件 | 分析与重入工具 | 不匹配影响权限与执行 |
| Python>=3.10或uv托管3.12 | AST和回收后端 | 自动准备失败拒绝命令 |
| bashlex、Send2Trash、Windows pywin32 | Shell解析及回收 | 缺失需联网准备 |
| Shell与系统回收区 | 对应操作必需 | 不可用时拒绝，不永久删除兜底 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 安装并开新会话 | 维护者 | 插件加载到tools事件链 |
| 准备缓存环境 | 插件 | 校验依赖并发布ready |
| 可丢弃目标调用 | Agent/维护者 | allow/rewrite/deny与回收结果一致 |
| 异常核对并恢复 | 维护者 | 确定部分完成项目和可恢复文件 |
| 卸载后新会话 | 维护者/宿主 | 停用插件，保留回收站用户文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 隔离环境、依赖联网；uv/Python可能下载 | 准备等待及镜像排查，实际耗时未知 | uv/Python/依赖可能下载；真实包量与准备耗时未知 |
| 持续使用 | Python分析、Shell解析、目标扫描及回收存储 | 复核拒绝与可恢复结果 | 分析/扫描/回收存储依目标；扫描上限不是固定资源价 |
| 失败恢复 | 重建缓存、重试与部分回收核对 | 查明哪些已完成、恢复文件并调整任务 | 部分已回收/缓存故障需核；误拒恢复与挽回率未量化 |


#### 效果

| 目标 | 可核查支持 | 未确定边界 |
| --- | --- | --- |
| 常见删除可恢复 | 改写到系统回收后端 | 平台实际结果与恢复耗时未测 |
| 不永久删除兜底 | 后端错误直接报错 | 仍有任意程序和动态加载边界 |
| 尽量保留正常工作 | 有限检查和支持的Shell重写 | 误拒率及性能未知 |

> **思考**：有限脚本检查并不证明任意代码安全，超大、未知编码和深层加载可能放行，路径复核也非原子隔离；这些静态边界必须限制其作为删除缓冲的用途。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将有限删除识别、真实Shell参数展开和系统回收接入DSH原工具权限链，并在分析失败时拒绝，而非宿主插件直接越过工具执行回收；增量是边界清楚的机制组合。详见[Q01](#research-q01)。

将有限删除识别、真实Shell参数展开和系统回收接入DSH原工具权限链，并在分析失败时拒绝，而非宿主插件直接越过工具执行回收；增量是边界清楚的机制组合。详见[Q01](#research-q01)。

allow/deny/rewrite协议与宿主重入、环境校验及失败闭锁值得借鉴；迁移需重新确认事件顺序、Shell语义和平台回收，不能只复制正则。详见[Q06](#research-q06)。

<a id="detail-section-5"></a>

### 1.4 主要限制

有限脚本检查并不证明任意代码安全，超大、未知编码和深层加载可能放行，路径复核也非原子隔离；这些静态边界必须限制其作为删除缓冲的用途。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议有独立备份的维护者在可丢弃目录受控试用常见删除缓冲；不以此替代权限隔离，准备长期阻断、语义不一致或需要动态程序全覆盖时停止。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

常见删除改写、无永久删除兜底与宿主重入设计有源码依据；动态程序不在完整覆盖内。覆盖收据仅为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、requirements.txt、lib/plugin.js、lib/runtime.js、guard/guard.py、guard/script_checks.py、guard/shell_commands.py、tests/test_boundaries.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交读取JS入口和运行时、Python分析/回收及脚本边界、Bash改写与边界测试；未覆盖全部PowerShell实现，不将阅读测试转为执行验收。
- 下一步：进一步探讨可先核对固定DSH权限重入契约，再研究常见删除与合法脚本反例，观察误拒、部分成功恢复以及覆盖收据对读者判断的作用。

**分析版本**

- **仓库**：[AhYi8/dsh-agent-recycle-guard](https://github.com/AhYi8/dsh-agent-recycle-guard)
- **版本号**：1.2.0（[固定提交 fd84079](https://github.com/AhYi8/dsh-agent-recycle-guard/tree/fd84079f98170d5066547c087c58c824b4e59d07)）
- **版本日期**：2026-10-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨最小检查覆盖收据，区分实际读取、跳过和重写内容，再连接最终回收回执；先验证是否减少用户安全误解并控制隐私和日志负担。当前未验证。详见[Q06](#research-q06)。

进一步探讨可先核对固定DSH权限重入契约，再研究常见删除与合法脚本反例，观察误拒、部分成功恢复以及覆盖收据对读者判断的作用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 465 | 406 | 45 | — |
| .md | source | 1 | 86 | — | — | 2117 |
| .mjs | test | 3 | 423 | 385 | 21 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AhYi8/dsh-agent-recycle-guard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AhYi8/dsh-agent-recycle-guard/issues?q=is%3Aissue+created%3A2026-09-22T04%3A44%3A16.996Z..2026-10-22T04%3A44%3A16.996Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AhYi8/dsh-agent-recycle-guard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A44%3A16.996Z..2026-10-22T04%3A44%3A16.996Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：常见删除转回收如何与DSH权限管线组合，有限检查的真实覆盖、代价和采用边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要可恢复删除，现有替代与交付是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向让DSH Agent操作本机项目文件的开发者，核心任务是把常见删除误操作从不可恢复的永久删除变为系统回收，或者在不能保持语义时拒绝。合格交付应包括目标正确、原删除范围不被扩大、失败不永久删除兜底，并能由用户找到回收结果。它不应被描述为阻止任意程序文件写入的系统级隔离。

简单替代是禁止Agent删除、人工确认后删除，或让Agent直接使用回收命令。插件的增量是在保留原Shell变量、循环和通配展开的条件下，替换常见删除入口，再让改写调用重新进入宿主工具管线。这样把“记得使用回收”的责任从提示转入运行接线，同时仍借助宿主权限和沙箱。回收后端来自系统API和Send2Trash，Shell解析借助成熟AST组件，贡献是契约组合与运行时接线，不是发明回收技术。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-7](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/README.md#L1-L7)

作者限定常见直接删除与有限脚本检查，优先DSH。

```text
# DSH 删除防护

Agent 直接提交的常见删除命令改为系统回收站操作；执行脚本前做有限的内容检查。优先支持 DSH，支持 Windows、Linux 与 macOS 的回收后端，不提供永久删除兜底。

## 安装

安装到 DSH 后直接使用，默认无需填写配置、预装 Python 或手动安装 Python 依赖。Windows 使用系统自带 PowerShell 5.1 或已有 PowerShell 7；Linux/macOS 的 Bash 删除不依赖 PowerShell，执行 `.ps1` 时仍需相应平台的 PowerShell。
```

**依据 2 · 源码核查**：[lib/plugin.js:68-81](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/lib/plugin.js#L68-L81)

改写后调用ctx.tools.execute，保留原工具与Agent并带父调用。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.on('tools/execute', async (exec, next) => {
    if (!exec.arguments || typeof exec.arguments !== 'object' || !('command' in exec.arguments || 'cmd' in exec.arguments)) return next();
    const decision = decisions.get(exec.token);
    decisions.delete(exec.token);
    if (!decision) return {isError: true, error: {message: '缺少删除防护检查，已阻止命令。'}, content: [{type: 'text', text: '缺少删除防护检查，已阻止命令。'}]};
    if (decision.action === 'allow') return next();
    if (decision.action !== 'rewrite' || !decision.input || typeof (decision.input.command ?? decision.input.cmd) !== 'string') {
      return {isError: true, error: {message: '非法删除转换结果。'}, content: [{type: 'text', text: '非法删除转换结果。'}]};
    }
    return ctx.tools.execute({
      callId: 'recycle-' + randomUUID(), rootCallId: exec.rootCallId,
      name: exec.name, arguments: decision.input, agent: exec.agent,
      parent: exec.token, signal: exec.signal,
    });
```

</details>

**依据 3 · 源码核查**：[guard/shell_commands.py:47-76](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/guard/shell_commands.py#L47-L76)

Bash仅替换删除命令头，保留其余原语法。

<details>
<summary>查看原文（30行）</summary>

```text
def rewrite_bash(text, cfg, guard, inspect_entry=None):
    changes = []
    for node, words in commands(text, guard):
        head = words[0]
        if head.parts:
            raise guard.GuardError("动态 Bash 命令名无法核实，已阻止执行。")
        name = Path(head.word).name
        args = [word.word for word in words[1:]]
        if name in DELETE_NAMES:
            changes.append((head.pos[0], head.pos[1], runtime_prefix(cfg, guard, "bash", name)))
        elif name == 'alias' and any('=' in arg and guard.looks_dangerous(arg.split('=', 1)[1]) for arg in args):
            raise guard.GuardError("删除别名无法可靠追踪，请直接调用普通删除命令。")
        elif name in EXTERNAL_DELETERS or name.startswith("mkfs."):
            raise guard.GuardError("外部抹除程序无法转为回收，已阻止执行。")
        elif name in {"command", "env", "sudo", "exec", "xargs", "find", "git", "rsync"} and guard.looks_dangerous(" ".join([name, *args])):
            raise guard.GuardError("包装或外部程序中的删除无法安全改写，已阻止执行。")
        elif name in {"eval", "source", "."}:
            # source 是脚本加载入口，交由有限的内容检查；eval 的载荷无法绑定。
            if name == "eval":
                raise guard.GuardError("动态 Shell 代码无法核实，已阻止执行。")
            if inspect_entry:
                inspect_entry(name, words[1:], node)
        elif inspect_entry:
            replacement = inspect_entry(head.word, words[1:], node)
            if replacement:
                changes.append(replacement)
    updated = text
    for start, end, replacement in sorted(changes, reverse=True):
        updated = updated[:start] + replacement + updated[end:]
    return updated if changes else None
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 原工具如何经分析、改写、重新执行和回收？

**研究主题**：功能与机制

#### 完整回答

插件监听tools/pre-execute，先取得后续gate，只有allow或ask且工具参数含command/cmd才分析。它通过shell.resolve取得执行目录和环境，再用ensureRuntime得到Python，向guard.py analyze发送JSON；只接受allow/deny/rewrite。决策按exec.token保存在Map，tools/execute消费并删除；缺失决策会阻断，deny在预执行阶段返回，allow继续原链，rewrite则构造新调用重入ctx.tools.execute。tools/result再清理未消费状态，避免被其他策略拒绝的缓存一直保留。

Python分析先限定已知Shell工具名与命令长度，再按Bash/CMD/PowerShell处理。Bash AST定位命令头后替换为受控回收入口，让真实Shell先展开参数；回收入口将已展开argv转成结构化请求，不再二次解释。目标校验保护根、家目录、防护目录、回收区和符号链接等，递归扫描有上限。Linux/macOS调用Send2Trash，Windows用IFileOperation并核查回执，失败直接报错，没有永久删除fallback。多目标逐个处理，已经成功的前项不会因后项失败自动回滚。

#### 证据与依据

**依据 1 · 源码核查**：[lib/plugin.js:45-84](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/lib/plugin.js#L45-L84)

宿主gate、决策缓存、execute重入与清理全过程。

<details>
<summary>查看原文（40行）</summary>

```text
export function apply(ctx, config) {
  const decisions = new Map();
  ctx.on('tools/pre-execute', async (exec, next) => {
    const gate = await next();
    if (gate.kind !== 'allow' && gate.kind !== 'ask') return gate;
    if (!exec.arguments || typeof exec.arguments !== 'object' || !('command' in exec.arguments || 'cmd' in exec.arguments)) return gate;
    try {
      // DSH 本地执行器每条命令启动新进程；输出 schema 不能用于判断持久终端。
      // resolve 是只读的执行规格解析，使用同一 workdir，保留工具原始参数与沙箱。
      const shell = ctx.shell;
      const spec = shell?.resolve?.({command: exec.arguments.command ?? exec.arguments.cmd, workdir: exec.arguments.workdir, env: exec.arguments.env});
      const dialect = exec.name === 'pwsh' || exec.name === 'powershell' || shell?.pwshPath
        ? 'powershell' : exec.arguments.shell ?? config?.shell ?? 'bash';
      const decision = await inspect({tool_name: exec.name, tool_input: exec.arguments,
        cwd: exec.agent?.session?.header?.cwd ?? process.cwd(), execution_cwd: spec?.workdir ? path.resolve(spec.workdir) : undefined,
        shell: dialect, env: spec?.env ?? exec.arguments.env}, config, exec.signal);
      decisions.set(exec.token, decision);
      if (decision.action === 'deny') return {kind: 'deny', reason: decision.reason};
      return gate;
    } catch (error) {
      return {kind: 'deny', reason: '删除防护检查失败，已阻止命令：' + error.message};
    }
  });
  ctx.on('tools/execute', async (exec, next) => {
    if (!exec.arguments || typeof exec.arguments !== 'object' || !('command' in exec.arguments || 'cmd' in exec.arguments)) return next();
    const decision = decisions.get(exec.token);
    decisions.delete(exec.token);
    if (!decision) return {isError: true, error: {message: '缺少删除防护检查，已阻止命令。'}, content: [{type: 'text', text: '缺少删除防护检查，已阻止命令。'}]};
    if (decision.action === 'allow') return next();
    if (decision.action !== 'rewrite' || !decision.input || typeof (decision.input.command ?? decision.input.cmd) !== 'string') {
      return {isError: true, error: {message: '非法删除转换结果。'}, content: [{type: 'text', text: '非法删除转换结果。'}]};
    }
    return ctx.tools.execute({
      callId: 'recycle-' + randomUUID(), rootCallId: exec.rootCallId,
      name: exec.name, arguments: decision.input, agent: exec.agent,
      parent: exec.token, signal: exec.signal,
    });
  });
  // 被其他策略拒绝的调用可能不进入 execute；在最终结果事件释放解析缓存。
  ctx.on('tools/result', exec => { decisions.delete(exec.token); });
```

</details>

**依据 2 · 源码核查**：[guard/guard.py:385-422](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/guard/guard.py#L385-L422)

工具边界、长度和Shell分析分支。

<details>
<summary>查看原文（38行）</summary>

```text
def analyze(event, agent, cfg, _depth=0):
    """直接删除严格改写；脚本采用有限递归的尽力内容检查。"""
    if _depth > 3:
        if looks_dangerous(str(event.get("tool_input", {}).get("command", ""))):
            raise GuardError("嵌套执行中的删除超过安全解析深度，请拆为独立回收命令。")
        return {"action": "allow", "reason": "脚本检查达到递归上限。"}
    if not isinstance(event, dict):
        raise GuardError("钩子输入必须为对象。")
    data = event.get("tool_input", event.get("toolInput", {}))
    if not isinstance(data, dict):
        raise GuardError("工具参数必须为对象。")
    tool = event.get("tool_name", event.get("toolName", ""))
    if base_name(tool) not in SHELL_NAMES:
        return {"action": "allow"}
    key = "command" if "command" in data else "cmd" if "cmd" in data else None
    if key is None:
        return {"action": "allow"}
    command = data[key]
    if not isinstance(command, str) or len(command.encode("utf-8")) > 131072:
        raise GuardError("命令必须是长度受限的字符串。")
    launcher = str(ROOT / "recycle.cmd").replace("\\", "/")
    for prefix in ("& '" + launcher.replace("'", "''") + "' ", '"' + launcher + '" '):
        if command.startswith(prefix) and re.fullmatch(r"[A-Za-z0-9+/]{1,6000}", command[len(prefix):]):
            return {"action": "allow"}
    name = base_name(tool)
    shell = str(event.get("shell", data.get("shell", ""))).lower()
    dialect = "powershell" if name in {"pwsh", "powershell"} or "powershell" in shell or "pwsh" in shell else "cmd" if "cmd" in shell else "bash"
    if agent == "codex" and not shell and IS_WINDOWS:
        dialect = "powershell"
    # 检查器是当前需求的新实现，旧的名称过滤与多套引用扫描不再参与决策。
    from script_checks import Inspector
    import shell_commands
    inspector = Inspector(sys.modules[__name__], cfg, {**event, "tool_input": data}, agent, _depth)
    if dialect in {"bash", "cmd"}:
        rewritten = shell_commands.rewrite_bash(command, cfg, sys.modules[__name__], inspector.bash_entry) if dialect == "bash" else shell_commands.rewrite_cmd(command, cfg, sys.modules[__name__], inspector.cmd_entry)
        if rewritten:
            return {"action": "rewrite", "input": {**data, key: rewritten}, "reason": "删除调用已替换为运行时回收入口；路径在实际执行目录中解析。"}
        return {"action": "allow"}
```

</details>

**依据 3 · 源码核查**：[guard/shell_commands.py:79-91](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/guard/shell_commands.py#L79-L91)

Shell已展开的参数转为请求并检查目录语义。

<details>
<summary>查看原文（13行）</summary>

```text
def runtime_spec(args, dialect, name, cfg, guard):
    if name not in ({"del", "erase", "rd", "rmdir"} if dialect == "cmd" else DELETE_NAMES):
        raise guard.GuardError("非法运行时删除名称。")
    # Shell 已完成展开；不把文件名中的空格、美元符号或通配符再解释一遍。
    parts = [guard.Part(name)] + [guard.Part(arg, quoted=True) for arg in args]
    spec, _ = guard.delete_spec(parts, dialect)
    spec["cwd"] = os.getcwd()
    if dialect == "bash":
        allow_dirs = name == "rmdir" or spec["recursive"] or any(arg == "--dir" or arg.startswith("-") and "d" in arg for arg in args)
        if not allow_dirs:
            for entry in spec["paths"]:
                if guard.checked_path(entry["path"], spec["cwd"], cfg).is_dir():
                    raise guard.GuardError("原 rm/unlink 未允许目录目标，不扩大为目录回收。")
```

</details>

**依据 4 · 源码核查**：[guard/guard.py:555-599](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/guard/guard.py#L555-L599)

平台回收、逐项目循环、回执核对和失败行为。

<details>
<summary>查看原文（45行）</summary>

```text
def recycle(spec, cfg):
    """现代 Shell COM 接口；禁止降级到永久删除或旧版删除 API。"""
    if not IS_WINDOWS:
        from send2trash import send2trash
        targets = resolve_targets(spec, cfg)
        receipts = []
        for path in targets:
            checked_path(str(path), spec["cwd"], cfg)
            # 成熟平台后端负责本卷回收位置；错误直接传播，不调用 unlink/rmtree 兜底。
            send2trash(str(path))
            if path.exists():
                raise GuardError("系统回收后目标仍存在，已停止后续操作。")
            receipt = {"original": str(path), "backend": "send2trash", "platform": sys.platform}
            receipts.append(receipt)
            audit({"action": "recycled", **receipt})
        return receipts
    import pythoncom
    from win32com.shell import shell, shellcon

    targets = resolve_targets(spec, cfg)
    receipts = []

    pythoncom.CoInitialize()
    try:
        for path in targets:
            # 再次检查路径，缩小分析与执行之间的竞态窗口。
            checked_path(str(path), spec["cwd"], cfg)
            sink = make_sink()
            operation = pythoncom.CoCreateInstance(shell.CLSID_FileOperation, None, pythoncom.CLSCTX_INPROC_SERVER, shell.IID_IFileOperation)
            flags = shellcon.FOF_NOCONFIRMATION | shellcon.FOF_NOERRORUI | shellcon.FOF_SILENT | shellcon.FOFX_EARLYFAILURE | 0x20000000 | 0x00080000
            operation.SetOperationFlags(flags)
            item = shell.SHCreateItemFromParsingName(str(path), None, shell.IID_IShellItem)
            operation.DeleteItem(item, pythoncom.WrapObject(sink, shell.IID_IFileOperationProgressSink))
            result = operation.PerformOperations()
            if result or operation.GetAnyOperationsAborted() or sink.rejected or not sink.receipt:
                raise GuardError("回收未被确认成功，已停止后续操作；绝不改用永久删除。")
            recycled = Path(sink.receipt)
            if not recycled.exists() or "$recycle.bin" not in str(recycled).lower() or not recycled.name.startswith("$R"):
                raise GuardError("Windows 未返回有效回收站项目，已停止后续操作。")
            receipt = {"original": str(path), "recycled": sink.receipt}
            receipts.append(receipt)
            audit({"action": "recycled", **receipt})
    finally:
        pythoncom.CoUninitialize()
    return receipts
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 有限脚本检查和路径复核留下什么边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

最关键的限制是脚本检查明确采用尽力模型。读取失败、未知编码或超过128KiB内容时返回None，深度达到三层也不再检查；Python模块入口和动态加载不受完整分析。这是可见的放行边界，而不是“任何未证明安全的代码都会拒绝”。Python AST和JavaScript有限规则只能识别已建模API；外部二进制内部删除不因Shell命令表面无删除词而变安全。

路径在分析和回收前复核可缩小目标歧义，但并没有持有文件句柄完成原子校验与操作。同用户并发修改路径、干净脚本继续执行原文件等仍有时序窗口。运行日志记录回收项目但不是事务日志，多目标回收后项失败时必须人工核对已完成项目，不能把重试视作从零开始。还需核对宿主gate为ask时新调用重入是否保留正确权限确认；源码表达了意图，本轮没有把它视为已执行保证。

#### 证据与依据

**依据 1 · 源码核查**：[guard/script_checks.py:70-105](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/guard/script_checks.py#L70-L105)

内容不可读、过大、编码未知和深度上限都会停止检查。

<details>
<summary>查看原文（36行）</summary>

```text
    def content(self, path):
        try:
            raw = path.read_bytes()
            if len(raw) > 131072:
                return None
            if raw.startswith((b'\xff\xfe', b'\xfe\xff')):
                return raw.decode('utf-16')
            return raw.decode('utf-8-sig')
        except (OSError, UnicodeError):
            # 脚本是尽力检查；大文件与未知编码的限制明确记入文档，不造成普遍误拒。
            return None

    def freeze(self, text, language):
        folder = self.guard.ROOT / "logs" / "rewritten"
        folder.mkdir(parents=True, exist_ok=True)
        digest = hashlib.sha256(text.encode('utf-8')).hexdigest()
        suffix = {"powershell": ".ps1", "bash": ".sh", "cmd": ".cmd"}[language]
        if language == "powershell":
            # 文件保持无 BOM；ASCII 外壳显式按 UTF-8 解码，兼容 PowerShell 5.1 中文。
            payload = base64.b64encode(text.encode('utf-8')).decode('ascii')
            text = "# AgentRecycleGuard UTF-8\n& ([ScriptBlock]::Create([Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('" + payload + "')))) @args\n"
        path = folder / (digest + suffix)
        path.write_text(text, encoding='utf-8', newline='')
        if language == 'bash':
            path.chmod(0o700)
        return path

    def inspect(self, path, language=None):
        language = language or SCRIPT_SUFFIXES.get(path.suffix.lower())
        if language is None or self.depth >= 3:
            return None
        if path.resolve() == (self.guard.ROOT / "recycle_powershell.ps1").resolve():
            return None
        content = self.content(path)
        if content is None:
            return None
```

</details>

**依据 2 · 源码核查**：[guard/script_checks.py:134-163](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/guard/script_checks.py#L134-L163)

解释器模块和动态参数的有限覆盖。

<details>
<summary>查看原文（30行）</summary>

```text
    def interpreter(self, name, args):
        language = LANGUAGES.get(name)
        if not language:
            return None
        values = [arg.get('value', '') for arg in args]
        for i, value in enumerate(values):
            if value in {'-c', '-e', '--eval'} and i + 1 < len(args):
                content = values[i + 1]
                if language == 'python' and python_deletes(content) or language == 'javascript' and JS_DELETE.search(content):
                    raise self.guard.GuardError("解释器内联代码包含已识别的删除 API。")
                if language == 'bash':
                    event = {**self.event, 'shell': 'bash', 'tool_name': 'bash', 'tool_input': {'command': content, 'shell': 'bash'}}
                    result = self.guard.analyze(event, self.agent, self.cfg, _depth=self.depth + 1)
                    if result['action'] == 'rewrite':
                        return i + 1, result['input']['command'], True
                return None
            if value in {'-m', '-', '--help', '--version', '-V'}:
                return None
            if value.startswith('-'):
                continue
            if language == 'javascript' and name in {'deno', 'bun'} and value in {'run', 'exec'}:
                continue
            if not value or args[i].get('opaque'):
                return None
            path = self.resolve(value, 'bash', argument=True)
            if path:
                frozen = self.inspect(path, language)
                if frozen:
                    return i, str(frozen), False
            return None
```

</details>

**依据 3 · 源码核查**：[guard/guard.py:208-245](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/guard/guard.py#L208-L245)

路径校验的拒绝条件。

<details>
<summary>查看原文（38行）</summary>

```text
def checked_path(raw, cwd, cfg):
    if not isinstance(raw, str) or not raw or len(raw) > 4096 or any(ord(c) < 32 for c in raw):
        raise GuardError("路径为空、过长或包含控制字符。")
    if not IS_WINDOWS:
        if ".." in raw.split("/"):
            raise GuardError("删除路径不能包含父目录跳转，请使用明确绝对路径。")
        path = Path(os.path.abspath(os.path.join(cwd, raw)))
        if str(path) == path.anchor or protected(path, cfg):
            raise GuardError("拒绝删除文件系统根、用户目录、防护程序或受保护配置。")
        if any(p in {".Trash", ".Trashes", "Trash", ".Trash-" + str(os.getuid())} for p in path.parts):
            raise GuardError("拒绝操作系统回收区。")
        if any(p.is_symlink() for p in [path, *path.parents]):
            raise GuardError("拒绝符号链接路径，避免回收目标歧义。")
        return path
    raw = raw.replace("/", "\\")
    if raw.startswith("\\\\") or raw.startswith("\\?") or re.search(r"[:<>|\"]", raw[2:]) or (":" in raw and not re.match(r"^[A-Za-z]:\\", raw)):
        raise GuardError("仅支持本地文件系统路径，不支持 UNC、设备路径、数据流或其他 Provider。")
    if raw.startswith("\\"):
        raise GuardError("请使用完整盘符路径，避免根相对路径歧义。")
    components = re.split(r"[\\/]", raw[3:] if re.match(r"^[A-Za-z]:", raw) else raw)
    # 先折叠 .. 会掩盖经过目录联接的真实遍历顺序，直接拒绝以收紧边界。
    if ".." in components:
        raise GuardError("删除路径不能包含父目录跳转，请使用明确绝对路径。")
    if any(c not in {"", ".", ".."} and (c.endswith((".", " ")) or re.match(r"(?i)^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)", c)) for c in components):
        raise GuardError("拒绝 Windows 保留名称或尾部点/空格路径。")
    path = Path(os.path.abspath(os.path.join(cwd, raw)))
    if str(path) == path.anchor or protected(path, cfg):
        raise GuardError("拒绝删除磁盘根、用户目录、防护程序或受保护配置。")
    if any(p.lower() in {"$recycle.bin", "recycler", "system volume information"} for p in path.parts):
        raise GuardError("拒绝操作系统回收区或卷管理目录。")
    import ctypes
    if ctypes.windll.kernel32.GetDriveTypeW(path.anchor) != 3:
        raise GuardError("仅支持有回收能力的本地固定磁盘。")
    for ancestor in [path, *path.parents]:
        if ancestor.exists() or ancestor.is_symlink():
            attrs = ancestor.lstat().st_file_attributes
            if attrs & stat.FILE_ATTRIBUTE_REPARSE_POINT:
                raise GuardError("拒绝符号链接、目录联接或其他重解析路径。")
```

</details>

**依据 4 · 源码核查**：[guard/guard.py:579-596](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/guard/guard.py#L579-L596)

回收前再校验但逐项执行，不是原子事务。

<details>
<summary>查看原文（18行）</summary>

```text
        for path in targets:
            # 再次检查路径，缩小分析与执行之间的竞态窗口。
            checked_path(str(path), spec["cwd"], cfg)
            sink = make_sink()
            operation = pythoncom.CoCreateInstance(shell.CLSID_FileOperation, None, pythoncom.CLSCTX_INPROC_SERVER, shell.IID_IFileOperation)
            flags = shellcon.FOF_NOCONFIRMATION | shellcon.FOF_NOERRORUI | shellcon.FOF_SILENT | shellcon.FOFX_EARLYFAILURE | 0x20000000 | 0x00080000
            operation.SetOperationFlags(flags)
            item = shell.SHCreateItemFromParsingName(str(path), None, shell.IID_IShellItem)
            operation.DeleteItem(item, pythoncom.WrapObject(sink, shell.IID_IFileOperationProgressSink))
            result = operation.PerformOperations()
            if result or operation.GetAnyOperationsAborted() or sink.rejected or not sink.receipt:
                raise GuardError("回收未被确认成功，已停止后续操作；绝不改用永久删除。")
            recycled = Path(sink.receipt)
            if not recycled.exists() or "$recycle.bin" not in str(recycled).lower() or not recycled.name.startswith("$R"):
                raise GuardError("Windows 未返回有效回收站项目，已停止后续操作。")
            receipt = {"original": str(path), "recycled": sink.receipt}
            receipts.append(receipt)
            audit({"action": "recycled", **receipt})
```

</details>

**依据 5 · 作者声明**：[README.md:51-55](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/README.md#L51-L55)

作者公开动态加载、并发和原位置依赖的边界。

```text
解释器的脚本参数以实际执行目录解析，语言由解释器决定。例如 `python code.txt` 仍按 Python 检查。PowerShell `-File` 和 `-Command`、常见脚本嵌套调用会进入同一套有限检查。递归最多三层，文本最多 128 KiB；未知编码、超大文件、动态加载、Python 模块和深层导入超出尽力检查范围，可能放行。脚本不承诺全量覆盖，避免演变为通用程序验证器。

改写副本仅绑定被改写的脚本内容，干净脚本继续执行原文件；同用户并发修改、动态 PATH/cwd、模块与外部程序内部加载仍可能漏检。含删除且依赖 `$PSScriptRoot`、`$PSCommandPath`、`BASH_SOURCE` 等原位置的脚本，以及需保留点源作用域的调用会拒绝，提示改成独立删除命令。PowerShell 副本为无 BOM 的 ASCII 外壳，显式解码 UTF-8 内容，兼容 5.1 中文路径。

CMD 包装解释器时，如果脚本需要改写为回收副本则拒绝，提示独立调用对应 Shell；不能丢弃改写结果而继续执行原脚本。
```

#### 缺口

- 所用DSH权限确认、重入调用与工具事件顺序契约没有在插件仓库中固定。
  **影响**：影响ask处理和改写后权限检查能否按预期保留。
  **进一步探讨**：检查部署DSH固定提交的tools.pre-execute、execute和parent调用管线，核对每条拒绝及确认分支。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 自动运行时准备与操作流程依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

运行时优先查找DSH托管Python并比较版本与pip可用性，要求不低于3.10；然后在用户cache目录创建隔离venv安装requirements。找不到或这条准备失败时安装固定uv版本，校验归档SHA256，由uv准备Python3.12和依赖。可配置HTTPS simple索引，默认依次尝试三处镜像再官方PyPI。依赖包括固定bashlex0.18、范围版本Send2Trash和Windows pywin32；因此缓存摘要固定requirements字节并不等同于锁定每个依赖包hash。

digest还包含Python来源、索引、平台架构和uv版本，同进程Promise去重，跨进程mkdir锁串行准备；ready文件读回验证后复用。准备失败删pending以便下次重试，同时插件失败会拒绝命令而非绕过防护。维护者需要联网、缓存写入权、目标Shell及回收区可用；PowerShell解析需对应可执行环境，Linux Bash路线不因此必须PowerShell。卸载后新会话由宿主管理，回收站中的用户文件不能随插件删除。

#### 证据与依据

**依据 1 · 源码核查**：[lib/runtime.js:195-205](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/lib/runtime.js#L195-L205)

DSH Python选择基于版本和探测。

<details>
<summary>查看原文（11行）</summary>

```text
export async function probeDshPython(candidates, run = runProcess) {
  let best = null;
  for (const exe of candidates) {
    let version;
    try { version = JSON.parse(await run(exe, ['-I', '-X', 'utf8', '-c', DSH_BASE_PROBE], {timeout: 15000})); }
    catch { continue; }
    if (!Array.isArray(version) || version.length < 2 || typeof version[0] !== 'number' || typeof version[1] !== 'number'
      || compareVersion(version, [3, 10]) < 0) continue;
    if (!best || compareVersion(version, best.version) > 0) best = {exe, version};
  }
  return best;
```

</details>

**依据 2 · 源码核查**：[lib/runtime.js:253-280](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/lib/runtime.js#L253-L280)

digest、pending和ready校验。

<details>
<summary>查看原文（28行）</summary>

```text
  return async (config = {}) => {
    if (config.python !== undefined && (typeof config.python !== 'string' || !config.python || !path.isAbsolute(config.python))) {
      throw new Error('可选 Python 配置必须是解释器的绝对路径；默认无需配置。');
    }
    const requirements = path.join(root, 'requirements.txt');
    const indexes = pypiIndexes(config);
    // 运行时来源进摘要：DSH 升级替换内置 Python 后旧 venv 自动失效重建。
    const dshBase = config.python ? null : await resolveDshBase();
    const baseKey = config.python ? 'user:' + config.python : dshBase ? 'dsh:' + dshBase.exe + ':' + dshBase.version.join('.') : 'uv:managed-3.12';
    const digest = createHash('sha256').update(await readFile(requirements)).update(baseKey)
      .update(indexes.join('\n'))
      .update(process.platform + process.arch + manifest.version).digest('hex');
    if (pending.has(digest)) return pending.get(digest);
    const task = (async () => {
      await mkdir(cacheDir, {recursive: true});
      const env = environment(cacheDir);
      const ready = path.join(cacheDir, digest + '.json');
      const verify = async python => {
        if (typeof python !== 'string' || !path.isAbsolute(python) || !(await stat(python)).isFile()) throw new Error('缓存解释器路径无效。');
        if (JSON.parse(await run(python, ['-I', '-X', 'utf8', '-c', probe], {cwd: cacheDir, env, timeout: 15000})) !== python) throw new Error('缓存解释器检查失败。');
        return python;
      };
      try { return await verify(JSON.parse(await readFile(ready, 'utf8')).python); }
      catch { /* 缓存缺失或依赖失效时自动修复，失败不影响下次重试。 */ }
      notify('删除防护：正在自动准备隔离运行环境，首次使用需要联网；准备完成后继续执行检查。');
      return withBootstrapLock(path.join(cacheDir, digest + '.lock'), async () => {
        // 另一进程可能在等待期间已完成准备；先读回并重新验证，不覆盖其环境。
        try { return await verify(JSON.parse(await readFile(ready, 'utf8')).python); }
```

</details>

**依据 3 · 源码核查**：[lib/runtime.js:282-340](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/lib/runtime.js#L282-L340)

venv、镜像、uv回退、原子ready及失败重试。

<details>
<summary>查看原文（59行）</summary>

```text
        // DSH 宿主内置 Python 优先：只建 venv 并从镜像补装依赖，不下载 uv 与托管 Python。
        if (dshBase) {
          try {
          const envRoot = path.join(cacheDir, 'environments', digest);
          const venv = path.join(envRoot, '.venv');
          // 摘要未变但 venv 损坏时整体重建，避免半成品环境。
          await rm(envRoot, {recursive: true, force: true});
          await mkdir(envRoot, {recursive: true});
          await run(dshBase.exe, ['-m', 'venv', venv], {cwd: cacheDir, env});
          const python = path.join(venv, process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
          let lastError;
          for (const index of indexes) {
            try {
              await run(python, ['-m', 'pip', 'install', '--no-input', '--disable-pip-version-check',
                '--requirement', requirements, '--index-url', index], {cwd: cacheDir, env});
              lastError = undefined;
              break;
            } catch (error) { lastError = error; }
          }
          if (lastError) throw new Error('国内镜像和官方 PyPI 均无法安装依赖：' + lastError.message);
          await verify(python);
          const temporary = ready + '.' + randomUUID() + '.tmp';
          await writeFile(temporary, JSON.stringify({python}), {mode: 0o600});
          await rename(temporary, ready);
          return python;
          } catch (error) {
            // 内置 Python 的 venv 或镜像安装失败时继续尝试 uv；两条路线都失败才阻止命令。
            notify('删除防护：DSH 内置 Python 准备失败，尝试备用运行环境：' + error.message);
            await rm(path.join(cacheDir, 'environments', digest), {recursive: true, force: true});
          }
        }
        const uv = await prepareUv(cacheDir, run);
        const envRoot = path.join(cacheDir, 'environments', digest);
        const venv = path.join(envRoot, '.venv');
        await rm(envRoot, {recursive: true, force: true});
        await mkdir(envRoot, {recursive: true});
        await run(uv, ['venv', '--no-config', '--python', config.python ?? '3.12',
          ...(config.python ? [] : ['--managed-python']), venv], {cwd: cacheDir, env});
        const python = path.join(venv, process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
        let lastError;
        for (const index of indexes) {
          try {
            await run(uv, ['pip', 'install', '--no-config', '--python', python, '--requirement', requirements,
              '--default-index', index], {cwd: cacheDir, env});
            lastError = undefined;
            break;
          } catch (error) { lastError = error; }
        }
        if (lastError) throw new Error('国内镜像和官方 PyPI 均无法安装依赖：' + lastError.message);
        await verify(python);
        const temporary = ready + '.' + randomUUID() + '.tmp';
        await writeFile(temporary, JSON.stringify({python}), {mode: 0o600});
        await rename(temporary, ready);
        return python;
      });
    })();
    pending.set(digest, task);
    try { return await task; }
    catch (error) {pending.delete(digest); throw new Error('删除防护自动准备失败，命令已阻止：' + error.message);}
```

</details>

**依据 4 · 源码核查**：[requirements.txt:1-3](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/requirements.txt#L1-L3)

精确和范围依赖混合，不是hash锁。

```text
send2trash>=1.8.3,<3
bashlex==0.18
pywin32>=306; sys_platform == "win32"
```

**依据 5 · 作者声明**：[README.md:82-84](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/README.md#L82-L84)

作者卸载和回收文件保留说明。

```text
## 卸载

在 DSH 插件管理器卸载并新开会话。插件运行目录的清理由插件管理器负责，回收站中的用户文件不随卸载删除。
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 首次、持续及失败恢复成本和效果如何？

**研究主题**：效果与总成本

#### 完整回答

首次使用可能创建隔离环境、下载uv/Python、解析依赖并多次尝试镜像；复用DSH Python能避免下载一部分可执行文件，但仍可能联网安装包。未采集包体大小或初始化耗时，不给零资源或秒级启动承诺。准备子进程可等待至十五分钟量级，分析器也有长超时，离线无缓存会阻断原命令，首次准备成本由用户承受。

持续阶段每条含命令的受支持工具调用都可能启动Python分析，Bash/PowerShell解析、脚本读写副本和递归目标扫描产生I/O；目录扫描最多二十万项是拒绝上限，不是免费操作。恢复阶段需要处理部分目标已回收、路径或回收区失败、脚本语义被拒绝和缓存损坏。成功收益是把可识别误删变成可恢复路径，无法由源码量化真实挽回率；应以同一删除任务、原有人工确认方案作对照，计入误拒、用户恢复时间和回收空间，不把“回收存在”当备份保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/runtime.js:65-84](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/lib/runtime.js#L65-L84)

准备进程的长超时和输出限制。

<details>
<summary>查看原文（20行）</summary>

```text
export function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], ...options});
    let output = '', errorOutput = '', failure;
  const timer = setTimeout(() => {failure = new Error('自动准备运行环境超时，请检查网络后重试。' + errorOutput.trim()); child.kill();}, options.timeout ?? 900000);
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', value => {
      output += value;
      if (output.length > 262144) {failure = new Error('运行环境返回内容超过上限。'); child.kill();}
    });
    // 只保留有限诊断文本，避免安装器输出无限累积。
    child.stderr.on('data', value => {errorOutput = (errorOutput + value).slice(-4096);});
    child.on('error', error => {clearTimeout(timer); reject(error);});
    child.on('close', code => {
      clearTimeout(timer);
      if (failure) reject(failure);
      else if (code !== 0) reject(new Error(`运行环境准备失败（退出码 ${code}）：${errorOutput.trim()}`));
      else resolve(output.trim());
    });
```

</details>

**依据 2 · 源码核查**：[lib/plugin.js:13-27](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/lib/plugin.js#L13-L27)

每次检查启动分析子进程及分析超时。

<details>
<summary>查看原文（15行）</summary>

```text
async function inspect(event, config, signal) {
  const python = await ensureRuntime(config);
  return new Promise((resolve, reject) => {
    const child = spawn(python, ['-X', 'utf8', guardPath, 'analyze', '--agent', 'dsh'], {
      windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'], signal,
      env: {...process.env, ...event.env},
    });
    let output = '';
    child.stdout.setEncoding('utf8');
    // 首次运行可能正在下载隔离 Python；等待其显式成功或失败，不能用分析超时绕过初始化。
    const timer = setTimeout(() => child.kill(), 960000);
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.stdout.on('data', chunk => {
      output += chunk;
      if (output.length > 262144) child.kill();
```

</details>

**依据 3 · 源码核查**：[guard/guard.py:283-298](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/guard/guard.py#L283-L298)

递归扫描上限及父子目标去重。

<details>
<summary>查看原文（16行）</summary>

```text
            if candidate.is_dir():
                if not spec["recursive"] and next(candidate.iterdir(), None) is not None:
                    raise GuardError("非空目录需要明确的递归选项。")
                count = 0
                for directory, dirs, files in os.walk(candidate, followlinks=False, onerror=lambda e: (_ for _ in ()).throw(e)) if deep else []:
                    for name in dirs + files:
                        count += 1
                        if count > 200000:
                            raise GuardError("目录超过安全扫描上限，已阻止删除。")
                        checked_path(str(Path(directory) / name), spec["cwd"], cfg)
            if candidate not in targets:
                targets.append(candidate)
            if len(targets) > 1000:
                raise GuardError("通配符展开超过 1000 个目标，已阻止删除。")
    # 父目录已包含的子路径只回收一次，避免后续操作指向已消失的文件。
    return [p for p in targets if not any(q in p.parents for q in targets)]
```

</details>

**依据 4 · 源码核查**：[guard/guard.py:555-570](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/guard/guard.py#L555-L570)

回收有实际I/O且后项失败可能部分完成。

<details>
<summary>查看原文（16行）</summary>

```text
def recycle(spec, cfg):
    """现代 Shell COM 接口；禁止降级到永久删除或旧版删除 API。"""
    if not IS_WINDOWS:
        from send2trash import send2trash
        targets = resolve_targets(spec, cfg)
        receipts = []
        for path in targets:
            checked_path(str(path), spec["cwd"], cfg)
            # 成熟平台后端负责本卷回收位置；错误直接传播，不调用 unlink/rmtree 兜底。
            send2trash(str(path))
            if path.exists():
                raise GuardError("系统回收后目标仍存在，已停止后续操作。")
            receipt = {"original": str(path), "backend": "send2trash", "platform": sys.platform}
            receipts.append(receipt)
            audit({"action": "recycled", **receipt})
        return receipts
```

</details>

#### 缺口

- 缺少可代表日常工作负载的误拒率、分析耗时及恢复时间。
  **影响**：不能量化安全收益与日常阻断代价是否相称。
  **进一步探讨**：用固定删除/非删除任务集记录应回收、应拒绝和应放行的结果，并分别统计初始化、常规检查与恢复成本。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 工程设计可借鉴什么，能推导什么未验证改进？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

值得借鉴的已有设计是将分析子进程与实际执行分开，返回显式allow/deny/rewrite，再由原工具管线执行改写调用，而不是在宿主插件里直接执行回收。失败不放行、运行时下载校验、环境变量隔离和原子ready记录共同减少初始化状态不清的风险。边界测试源码明确把不可读大脚本视为不检查，说明测试契约与文档一致，但本轮仅阅读测试，不能据其宣称平台通过。

可推导的未验证方向是在现有决策之外给出“检查覆盖收据”，标出实际检查的文件hash、跳过原因、重写副本以及最终目标回收回执，让用户能区分完整直删处理与有限脚本放行。相对把所有未知代码一律拒绝，这种方案可能在保持可用性的同时减少安全误解，但会增加隐私、日志和一致性负担。最小验证用相同脚本任务对照收据能否让维护者正确识别未覆盖范围；若日志泄露超出必要材料、或收据被当安全认证而不降低误判，应否定采用。它不是当前插件能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/plugin.js:12-19](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/lib/plugin.js#L12-L19)

分析不直接执行回收的边界。

```text
/** 子进程只分析 JSON；不在宿主插件中直接执行文件回收，以保留原工具沙箱。 */
async function inspect(event, config, signal) {
  const python = await ensureRuntime(config);
  return new Promise((resolve, reject) => {
    const child = spawn(python, ['-X', 'utf8', guardPath, 'analyze', '--agent', 'dsh'], {
      windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'], signal,
      env: {...process.env, ...event.env},
    });
```

**依据 2 · 源码核查**：[lib/plugin.js:68-81](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/lib/plugin.js#L68-L81)

改写重入原工具。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.on('tools/execute', async (exec, next) => {
    if (!exec.arguments || typeof exec.arguments !== 'object' || !('command' in exec.arguments || 'cmd' in exec.arguments)) return next();
    const decision = decisions.get(exec.token);
    decisions.delete(exec.token);
    if (!decision) return {isError: true, error: {message: '缺少删除防护检查，已阻止命令。'}, content: [{type: 'text', text: '缺少删除防护检查，已阻止命令。'}]};
    if (decision.action === 'allow') return next();
    if (decision.action !== 'rewrite' || !decision.input || typeof (decision.input.command ?? decision.input.cmd) !== 'string') {
      return {isError: true, error: {message: '非法删除转换结果。'}, content: [{type: 'text', text: '非法删除转换结果。'}]};
    }
    return ctx.tools.execute({
      callId: 'recycle-' + randomUUID(), rootCallId: exec.rootCallId,
      name: exec.name, arguments: decision.input, agent: exec.agent,
      parent: exec.token, signal: exec.signal,
    });
```

</details>

**依据 3 · 源码核查**：[lib/runtime.js:150-157](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/lib/runtime.js#L150-L157)

清理环境变量以隔离运行时。

```text
function environment(cacheDir) {
  const env = {...process.env};
  // 用户项目的 UV_*/PIP_*、虚拟环境和 PYTHONPATH 不应改变防护器的隔离环境。
  for (const key of Object.keys(env)) if (/^(UV_|PIP_|PYTHON|VIRTUAL_ENV$|CONDA_PREFIX$)/i.test(key)) delete env[key];
  return {...env, UV_CACHE_DIR: path.join(cacheDir, 'uv-cache'), UV_PYTHON_INSTALL_DIR: path.join(cacheDir, 'python'),
    // 使用操作系统证书库，兼容系统信任的企业代理；仍保持完整 TLS 校验。
    UV_PYTHON_DOWNLOADS: 'automatic', UV_PYTHON_INSTALL_MIRROR: 'https://github.com/astral-sh/python-build-standalone/releases/download',
    UV_SYSTEM_CERTS: 'true', PYTHONNOUSERSITE: '1'};
```

**依据 4 · 源码核查**：[tests/test_boundaries.py:147-157](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/tests/test_boundaries.py#L147-L157)

测试对大文件和未知编码的契约。

<details>
<summary>查看原文（11行）</summary>

```text
def test_unreadable_large_and_unknown_encoding_script_limits(guard):
    event={'tool_input':{},'cwd':str(guard.test_workspace)}
    checker=Inspector(guard,guard.test_cfg,event,'dsh')
    assert checker.content(guard.test_workspace/'missing.py') is None
    large=guard.test_workspace/'large.py'
    large.write_bytes(b'x'*131073)
    assert checker.content(large) is None
    large.write_bytes(b'\x81\x82')
    assert checker.content(large) is None
    large.write_bytes('print(1)'.encode('utf-16'))
    assert checker.content(large)=='print(1)'
```

</details>

**依据 5 · 源码核查**：[guard/guard.py:520-525](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/guard/guard.py#L520-L525)

当前审计只追加记录，可作为收据设计起点。

```text
def audit(record):
    folder = ROOT / "logs"
    folder.mkdir(exist_ok=True)
    record = {"time": datetime.now(timezone.utc).isoformat(), **record}
    with (folder / (datetime.now().strftime("%Y-%m-%d") + ".jsonl")).open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(record, ensure_ascii=False) + "\n")
```

#### 缺口

- 覆盖收据对用户判断的效果及隐私最小字段尚未比较。
  **影响**：只能提出方向，不能宣称增强安全。
  **进一步探讨**：先定义无需整条命令的最小覆盖字段，用盲判任务检查维护者是否能正确区分已检查与未覆盖。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 对什么人值得试用，停止标准是什么？

**研究主题**：采用判断

#### 完整回答

建议对需要本机删除缓冲的DSH维护者进行受控试用，前提是已有独立备份、可用回收区和能接受有限检查的明确边界。起点应是可丢弃目录里的常见独立删除、包含合法变量的脚本、拒绝路径与回收失败反例；不能直接把它当作不可信程序的隔离边界，也不应依赖其保护唯一重要数据。

应同时检查三种决策以及重新进入宿主权限链的契约，合法非删除调用不能普遍被阻断，失败不能改为永久删除，多目标部分成功要有人工可核对结果。若运行时准备使常规命令长期不可用、实际Shell语义和改写不一致、或者用户需要覆盖动态模块和任意程序，应停止该范围采用并用更强权限隔离或人工确认。源码材料支持有条件试用价值，没有同版本安装、核心功能与卸载验收，不能给值得安装。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:51-62](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/README.md#L51-L62)

作者限定脚本覆盖和回收边界。

<details>
<summary>查看原文（12行）</summary>

```text
解释器的脚本参数以实际执行目录解析，语言由解释器决定。例如 `python code.txt` 仍按 Python 检查。PowerShell `-File` 和 `-Command`、常见脚本嵌套调用会进入同一套有限检查。递归最多三层，文本最多 128 KiB；未知编码、超大文件、动态加载、Python 模块和深层导入超出尽力检查范围，可能放行。脚本不承诺全量覆盖，避免演变为通用程序验证器。

改写副本仅绑定被改写的脚本内容，干净脚本继续执行原文件；同用户并发修改、动态 PATH/cwd、模块与外部程序内部加载仍可能漏检。含删除且依赖 `$PSScriptRoot`、`$PSCommandPath`、`BASH_SOURCE` 等原位置的脚本，以及需保留点源作用域的调用会拒绝，提示改成独立删除命令。PowerShell 副本为无 BOM 的 ASCII 外壳，显式解码 UTF-8 内容，兼容 5.1 中文路径。

CMD 包装解释器时，如果脚本需要改写为回收副本则拒绝，提示独立调用对应 Shell；不能丢弃改写结果而继续执行原脚本。

## 回收行为

- Windows：使用 COM `IFileOperation`，拒绝永久删除请求，核对回收站项目回执。
- Linux/macOS：使用 Send2Trash 的平台后端；回收区不可用或权限不足时返回错误，不调用永久删除 API 兜底。Linux 无桌面环境时仍可使用 freedesktop 回收目录；恢复可通过回收元数据完成。
- 根目录、用户目录本身、防护目录及其祖先、回收区、符号链接或 Windows 重解析路径受保护；递归目录会先校验内容与扫描上限。
- 删除选项无法保持语义时拒绝，不把非递归删除扩大为整目录回收。
```

</details>

**依据 2 · 源码核查**：[lib/plugin.js:64-81](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/lib/plugin.js#L64-L81)

检查失败拒绝与重入机制。

<details>
<summary>查看原文（18行）</summary>

```text
    } catch (error) {
      return {kind: 'deny', reason: '删除防护检查失败，已阻止命令：' + error.message};
    }
  });
  ctx.on('tools/execute', async (exec, next) => {
    if (!exec.arguments || typeof exec.arguments !== 'object' || !('command' in exec.arguments || 'cmd' in exec.arguments)) return next();
    const decision = decisions.get(exec.token);
    decisions.delete(exec.token);
    if (!decision) return {isError: true, error: {message: '缺少删除防护检查，已阻止命令。'}, content: [{type: 'text', text: '缺少删除防护检查，已阻止命令。'}]};
    if (decision.action === 'allow') return next();
    if (decision.action !== 'rewrite' || !decision.input || typeof (decision.input.command ?? decision.input.cmd) !== 'string') {
      return {isError: true, error: {message: '非法删除转换结果。'}, content: [{type: 'text', text: '非法删除转换结果。'}]};
    }
    return ctx.tools.execute({
      callId: 'recycle-' + randomUUID(), rootCallId: exec.rootCallId,
      name: exec.name, arguments: decision.input, agent: exec.agent,
      parent: exec.token, signal: exec.signal,
    });
```

</details>

**依据 3 · 源码核查**：[guard/guard.py:555-599](https://github.com/AhYi8/dsh-agent-recycle-guard/blob/fd84079f98170d5066547c087c58c824b4e59d07/guard/guard.py#L555-L599)

回收无永久删除fallback及平台回执条件。

<details>
<summary>查看原文（45行）</summary>

```text
def recycle(spec, cfg):
    """现代 Shell COM 接口；禁止降级到永久删除或旧版删除 API。"""
    if not IS_WINDOWS:
        from send2trash import send2trash
        targets = resolve_targets(spec, cfg)
        receipts = []
        for path in targets:
            checked_path(str(path), spec["cwd"], cfg)
            # 成熟平台后端负责本卷回收位置；错误直接传播，不调用 unlink/rmtree 兜底。
            send2trash(str(path))
            if path.exists():
                raise GuardError("系统回收后目标仍存在，已停止后续操作。")
            receipt = {"original": str(path), "backend": "send2trash", "platform": sys.platform}
            receipts.append(receipt)
            audit({"action": "recycled", **receipt})
        return receipts
    import pythoncom
    from win32com.shell import shell, shellcon

    targets = resolve_targets(spec, cfg)
    receipts = []

    pythoncom.CoInitialize()
    try:
        for path in targets:
            # 再次检查路径，缩小分析与执行之间的竞态窗口。
            checked_path(str(path), spec["cwd"], cfg)
            sink = make_sink()
            operation = pythoncom.CoCreateInstance(shell.CLSID_FileOperation, None, pythoncom.CLSCTX_INPROC_SERVER, shell.IID_IFileOperation)
            flags = shellcon.FOF_NOCONFIRMATION | shellcon.FOF_NOERRORUI | shellcon.FOF_SILENT | shellcon.FOFX_EARLYFAILURE | 0x20000000 | 0x00080000
            operation.SetOperationFlags(flags)
            item = shell.SHCreateItemFromParsingName(str(path), None, shell.IID_IShellItem)
            operation.DeleteItem(item, pythoncom.WrapObject(sink, shell.IID_IFileOperationProgressSink))
            result = operation.PerformOperations()
            if result or operation.GetAnyOperationsAborted() or sink.rejected or not sink.receipt:
                raise GuardError("回收未被确认成功，已停止后续操作；绝不改用永久删除。")
            recycled = Path(sink.receipt)
            if not recycled.exists() or "$recycle.bin" not in str(recycled).lower() or not recycled.name.startswith("$R"):
                raise GuardError("Windows 未返回有效回收站项目，已停止后续操作。")
            receipt = {"original": str(path), "recycled": sink.receipt}
            receipts.append(receipt)
            audit({"action": "recycled", **receipt})
    finally:
        pythoncom.CoUninitialize()
    return receipts
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
