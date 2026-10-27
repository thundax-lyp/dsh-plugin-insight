# J-Space Cognition Suite

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[b202312](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/tree/b2023124a1fa08278e3ee82aefa8ed9faeade995)

<!-- BEGIN META -->
[![GitHub ★ 2,960](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C960&color=yellow&logo=github&style=flat)](https://github.com/Tiger3807861189/J-Space-Cognition-Suite)
<!-- END META -->

> **实现功能**：用可选Skill模块与Python控制器维护长任务状态、源码映射和证据检查。

> **核心亮点**：[Q02](#research-q02)、[Q03](#research-q03) 相对人工清单，脚本可机械拒绝过期读取、改变的证据和不匹配的任务契约，增量是证据失效治理，不是验证模型内部认知。

> **风险与缺陷**：[Q03](#research-q03) 摘要一致不能证明验证文件真实，一份虚构而未变的日志仍需独立事实核对；门控exit 0不代表工程任务已正确完成。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程亮点](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · 它是怎样的安装对象，谁需要严格控制层？](#detail-section-15)
  - [Q02 · 控制器是否真正重读文件并检测陈旧记录？](#detail-section-16)
  - [Q03 · 相对检查清单的贡献与证据真实性边界是什么？](#detail-section-17)
  - [Q04 · 严格工作循环的总负担是否值得？](#detail-section-18)
  - [Q05 · 独立核对结果能否补强内容真实性？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多文件长任务中需要防止陈旧源码与报告继续流转的开发或研究负责人。

原办法是人工清单与任务笔记，严格控制只在陈旧证据确实造成风险时更可能值得；没有同条件效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Skill路由 | 选取复杂任务相关模块 | 宿主提供工具与Agent |
| 证据门控 | 检测材料和契约失效 | 需主动调用，不证明内容真假 |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 退路 |
|---|---|---|
| 可读取支持文件的Skill宿主 | 加载模块与控制流程 | 先核对完整目录 |
| Python3.10+ | 严格控制器 | low/medium仅按说明轻量使用 |
| 真实验证证据与可写任务目录 | 持久控制 | 无真实材料不补造文件 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与判据 | 失败处理 |
|---|---|---|
| 复制完整Skill | 用户确认入口与支持文件 | 避免混合旧目录 |
| 选择最轻层级 | 使用者按任务依赖决定 | 短任务不强上严格控制 |
| 读取与登记真实材料 | 执行者核对当前摘要 | 变更后重开与重验 |
| ship前独立验收 | 负责人核对实际成果 | 不以exit 0替代验收 |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次 | Python与宿主资源，金额未知 | 完整复制、路由和控制器学习，未知 |
| 持续 | 模型上下文和文件扫描，未知 | 刷新、报告、问题闭合与map同步，未知 |
| 失败恢复 | 重验与可选独立复跑，未知 | 重新开启受影响问题、修契约，未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 合格任务 | 已核查机制 | 缺口 |
|---|---|---|
| 拒绝陈旧证据 | 文件摘要与TTL检查 | 未执行故障注入 |
| 当前契约交付 | goal、route与report摘要绑定 | 不证明日志真实及产物正确 |

> **思考**：[Q03](#research-q03) 摘要一致不能证明验证文件真实，一份虚构而未变的日志仍需独立事实核对；门控exit 0不代表工程任务已正确完成。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q02](#research-q02)、[Q03](#research-q03) 相对人工清单，脚本可机械拒绝过期读取、改变的证据和不匹配的任务契约，增量是证据失效治理，不是验证模型内部认知。

[Q02](#research-q02)、[Q03](#research-q03) 相对人工清单，脚本可机械拒绝过期读取、改变的证据和不匹配的任务契约，增量是证据失效治理，不是验证模型内部认知。

可借鉴规范JSON与Markdown投影分离、收据失效与契约绑定；迁移需对齐宿主读取/执行能力和真实证据记录，不能把脚本状态当不可绕过的宿主权限控制。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q03](#research-q03) 摘要一致不能证明验证文件真实，一份虚构而未变的日志仍需独立事实核对；门控exit 0不代表工程任务已正确完成。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q04](#research-q04) 先在单个非关键长任务验证证据变化会被拒绝，再看维护负担是否换来少返工；短直接任务用轻量级别，不强行跑完整控制循环。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已核查工程控制代码；未执行，未验证认知叙事或任务效果，独立复核为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、j-space/SKILL.md、j-space/scripts/control.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：研究对象是根分发的j-space Skill及Python控制器；未执行目标脚本、安装Skill、模型实验或宿主验收，不评价科学文献真伪。
- 下一步：隔离目录登记真实文件再改动，检查旧收据与闭题失效；之后比较普通清单与门控流程的漏检和人工分钟，尚未执行。

**分析版本**

- **仓库**：[Tiger3807861189/J-Space-Cognition-Suite](https://github.com/Tiger3807861189/J-Space-Cognition-Suite)
- **版本号**：未声明（[固定提交 b202312](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/tree/b2023124a1fa08278e3ee82aefa8ed9faeade995)）
- **版本日期**：2026-09-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是在关键门槛增加可重放命令与独立抽样复跑，以真假/过期材料对照误接受和时间；不改善或成本更高则停止。

隔离目录登记真实文件再改动，检查旧收据与闭题失效；之后比较普通清单与门控流程的漏检和人工分钟，尚未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 26 | 5353 | — | — | 48009 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-27。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查Skill控制器的证据失效机制、长任务收益和真实性边界。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · 它是怎样的安装对象，谁需要严格控制层？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

这是可被宿主加载的j-space Skill目录与标准库Python控制脚本，而非DSH原生工具包。面向多文件、长周期、证据会变化的工程任务，要求把目标、未决问题、报告与源码版本持续对应。low/medium可以轻量使用，high/xhigh引入持久状态与门控；宿主自行提供工具和Agent，复制文件不会自动注册hook或启动Agent。原办法是人工检查清单和文档笔记，合格交付应是实际工程成果及可追溯验证，而不是门控exit 0本身。没有长期状态和失效风险的短任务不应承担严格控制循环。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-18](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/blob/b2023124a1fa08278e3ee82aefa8ed9faeade995/README.md#L7-L18)

作者限定Skill与宿主工具、Python版本和无后台服务。

<details>
<summary>查看原文（12行）</summary>

```text
J-Space is an inference-time workspace and control suite for complex reasoning, repository
engineering, coordinated agents, and authorized security analysis. You install one skill,
load relevant modules, and keep long-task decisions connected to durable evidence.

Its thirteen modules share one premise and one routing entry. Standard-library Python
scripts persist state, reread actual source text, detect stale maps and evidence, and return
blocking results when a required condition is missing. The host supplies tools and agents.

## Quick start

You need a host that can load a local `SKILL.md` and retrieve its supporting files.
Python 3.10+ is needed for executable controllers and validation; low/medium can use the
```

</details>

**依据 2 · 作者声明**：[README.md:57-76](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/blob/b2023124a1fa08278e3ee82aefa8ed9faeade995/README.md#L57-L76)

安装不自动授权或启动，层级按任务复杂度选择。

<details>
<summary>查看原文（20行）</summary>

````text
& "C:\Python313\python.exe" "C:\Skills\j-space\scripts\control.py" --root "D:\Task Directory" status
```

Run `status` after initializing the task. UTF-8 input supports English and Chinese task
content; use the language requested by the user for deliverables.
Run controllers in the target project's task directory, not the installed skill directory.
Installing the files does not automatically register hooks, launch agents, or grant tool access.

> **Intended use.** This suite is designed for real engineering and production-oriented
> projects with contracts, dependencies, verification, and recovery needs. It is not aimed
> at toy demonstrations such as “a pelican riding a bicycle.” Its suitability for serious
> work is a design focus, not a guarantee that any untested deployment is production-ready.

## Operating levels

| Level | Use | Control |
|---|---|---|
| `low` | A direct answer checkable at a glance | Fast pass; no persistent setup |
| `medium` | A bounded deliverable with a few dependent steps | Full pass; selective modules and delivery audit |
| `high` | Multi-file, multi-stage, or persistent work | Loop; shared state, source refresh, evidence checks |
````

</details>

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 控制器是否真正重读文件并检测陈旧记录？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

源码不是仅提示模型记得检查。read_files实际读取路由Skill文件字节并输出内容，记录sha256与时间；check_reads校验收据存在、TTL、当前字节哈希和待广播标志。gate对活跃checkpoint和已关闭问题调用current_evidence，ship时要求未决题关闭、最新报告与当前目标/路由契约一致、根completion证据及子Agent第二轮报告和独立接受。这可以阻止文件改变后继续把旧收据当当前材料。JSON为规范状态、Markdown为投影的做法可借鉴，但本轮未执行崩溃恢复或多进程一致性，不能由注释保证原子性与跨平台可靠。

#### 证据与依据

**依据 1 · 源码核查**：[j-space/scripts/control.py:323-348](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/blob/b2023124a1fa08278e3ee82aefa8ed9faeade995/j-space/scripts/control.py#L323-L348)

实际文件读取、摘要时间和陈旧判断。

<details>
<summary>查看原文（26行）</summary>

```text
def read_files(state, aid, paths):
    agent = get_agent(state, aid)
    output = []
    for name in paths:
        path = safe_path(SKILL, name)
        require(path.is_file(), 'Skill read requires a file: ' + name)
        data = path.read_bytes()
        output += ['--- BEGIN ' + name + ' SHA256 ' + digest(data) + ' ---', data.decode('utf-8'),
                   '--- END ' + name + ' ---']
        agent['reads'][name] = {'sha256': digest(data), 'time': time.time()}
    required = skill_files(state)
    if (not agent['broadcast'] or set(required).issubset(paths)) and all(name in agent['reads'] and 0 <= time.time() - agent['reads'][name]['time'] <= state['config']['read_ttl']
           and agent['reads'][name]['sha256'] == digest(safe_path(SKILL, name).read_bytes()) for name in required):
        agent['broadcast'] = False
    return '\n'.join(output)


def check_reads(state, aid):
    agent = get_agent(state, aid)
    for name in skill_files(state):
        receipt = agent['reads'].get(name)
        require(receipt is not None, aid + ' must actually read ' + name)
        age = time.time() - receipt['time']
        require(0 <= age <= state['config']['read_ttl'], aid + ' has expired read: ' + name)
        require(digest(safe_path(SKILL, name).read_bytes()) == receipt['sha256'], 'Skill source changed: ' + name)
    require(not agent.get('broadcast'), aid + ' must pulse to receive the pending context broadcast.')
```

</details>

**依据 2 · 源码核查**：[j-space/scripts/control.py:435-475](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/blob/b2023124a1fa08278e3ee82aefa8ed9faeade995/j-space/scripts/control.py#L435-L475)

交付门控针对当前证据、目标与契约检查。

<details>
<summary>查看原文（41行）</summary>

```text
def gate(root, state, aid, stage):
    require(nonempty(state['goal']) and nonempty(state['next']), 'Goal and next action are required.')
    check_reads(state, aid)
    agent = get_agent(state, aid)
    if repo_enabled(state):
        repo = check_repo(root, state)
        require(agent.get('view') == repo['fingerprint'], aid + ' must run repo view before work.')
    for checkpoint in state['checkpoints']:
        if checkpoint.get('active', True):
            require(current_evidence(root, checkpoint['evidence'], 'Active checkpoint ' + str(checkpoint['id'])),
                    'Active checkpoint evidence changed: ' + str(checkpoint['id']) +
                    '. Reopen a dependent question or record a new checkpoint with --supersede ID.')
    for qid, question in state['questions'].items():
        if question['closed']:
            checkpoint = next(item for item in state['checkpoints'] if item['id'] == question['checkpoint'])
            require(current_evidence(root, checkpoint['evidence']),
                    'Closed question evidence changed: ' + qid + '. Use note --reopen ' + qid + ' and reverify.')
    if stage == 'ship':
        require(not any(not question['closed'] for question in state['questions'].values()), 'Open questions require evidence-backed closure.')
        require(state['level'] != 'xhigh' or len(active_agents(state)) > 1 or nonempty(state['solo_reason']),
                'xhigh needs participating agents or an explicit --solo-reason describing unavailable host delegation.')
        for member, details in active_agents(state).items():
            check_reads(state, member)
            if repo_enabled(state):
                require(details.get('view') == repo['fingerprint'], member + ' must run repo view before shipment.')
            require(details['reports'], member + ' has no delivery report.')
            report = details['reports'][-1]
            if member != 'root':
                require(report.get('contract_sha256') == contract_fingerprint(state),
                        member + ' task contract changed; begin a fresh two-round report cycle and review.')
            require(current_evidence(root, report['evidence']), member + ' report evidence changed.')
            for source in report['sources']:
                require(current_evidence(root, source), member + ' report source changed: ' + source['path'])
            if repo_enabled(state):
                require(bool(report['sources']), member + ' needs explicit --source dependencies.')
            if member == 'root':
                require(report.get('completion') and current_evidence(root, report['completion']),
                        'Root needs current --completion evidence checking the goal and deliverable.')
                require(report.get('goal') == state['goal'], 'Goal changed after root completion; submit a fresh root report.')
                require(report.get('contract_sha256') == contract_fingerprint(state),
                        'Task contract or route changed after root completion; submit a fresh root report.')
```

</details>

**依据 3 · 源码核查**：[j-space/scripts/control.py:480-487](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/blob/b2023124a1fa08278e3ee82aefa8ed9faeade995/j-space/scripts/control.py#L480-L487)

第二轮与独立接受绑定到当前报告摘要。

```text
            if state['level'] in ('high', 'xhigh'):
                require(report['round'] == 2, member + ' requires a second-thinking report.')
            review = report.get('review')
            require(review and review['verdict'] == 'accepted', member + ' latest report is not independently accepted.')
            require(review['agent'] in state['agents'] and review['agent'] != member and
                    review['report_sha256'] == digest(encoded({k: v for k, v in report.items() if k != 'review'})),
                    member + ' review is not bound to the current report.')
            require(current_evidence(root, review['evidence']), member + ' review evidence changed.')
```

#### 缺口

- 没有控制器真实执行和异常恢复结果
  **影响**：静态逻辑不能证明全部门控与跨平台正确
  **进一步探讨**：在隔离目录修改已登记证据与路由文件，检查对应门控失败和修复后恢复

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 相对检查清单的贡献与证据真实性边界是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

相对只写“先读源码再验证”的提示清单，执行脚本把已读收据、证据文件、任务契约和报告接受绑定到摘要，使陈旧材料可被机械拒绝，这是实际增量。哈希和任务状态是成熟机制，组合贡献在长期工程证据失效管理，不宣称认知科学机制或模型能力得到验证。最关键反例是提交一份内容虚构但非空且未改变的验证文件，哈希只能说明它没变，不能证明声称的测试确实运行、覆盖正确或结果真实。Skill也声明提示无法测量模型激活或主观体验。因此核心采用结论必须落在工程控制脚本，不把“J-space”科学叙事算成独立效果证据；门控仍依赖Agent调用、真实结果与审查者。

#### 证据与依据

**依据 1 · 源码核查**：[j-space/scripts/control.py:443-475](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/blob/b2023124a1fa08278e3ee82aefa8ed9faeade995/j-space/scripts/control.py#L443-L475)

当前证据与契约摘要检查能证明一致性而非事实真伪。

<details>
<summary>查看原文（33行）</summary>

```text
        if checkpoint.get('active', True):
            require(current_evidence(root, checkpoint['evidence'], 'Active checkpoint ' + str(checkpoint['id'])),
                    'Active checkpoint evidence changed: ' + str(checkpoint['id']) +
                    '. Reopen a dependent question or record a new checkpoint with --supersede ID.')
    for qid, question in state['questions'].items():
        if question['closed']:
            checkpoint = next(item for item in state['checkpoints'] if item['id'] == question['checkpoint'])
            require(current_evidence(root, checkpoint['evidence']),
                    'Closed question evidence changed: ' + qid + '. Use note --reopen ' + qid + ' and reverify.')
    if stage == 'ship':
        require(not any(not question['closed'] for question in state['questions'].values()), 'Open questions require evidence-backed closure.')
        require(state['level'] != 'xhigh' or len(active_agents(state)) > 1 or nonempty(state['solo_reason']),
                'xhigh needs participating agents or an explicit --solo-reason describing unavailable host delegation.')
        for member, details in active_agents(state).items():
            check_reads(state, member)
            if repo_enabled(state):
                require(details.get('view') == repo['fingerprint'], member + ' must run repo view before shipment.')
            require(details['reports'], member + ' has no delivery report.')
            report = details['reports'][-1]
            if member != 'root':
                require(report.get('contract_sha256') == contract_fingerprint(state),
                        member + ' task contract changed; begin a fresh two-round report cycle and review.')
            require(current_evidence(root, report['evidence']), member + ' report evidence changed.')
            for source in report['sources']:
                require(current_evidence(root, source), member + ' report source changed: ' + source['path'])
            if repo_enabled(state):
                require(bool(report['sources']), member + ' needs explicit --source dependencies.')
            if member == 'root':
                require(report.get('completion') and current_evidence(root, report['completion']),
                        'Root needs current --completion evidence checking the goal and deliverable.')
                require(report.get('goal') == state['goal'], 'Goal changed after root completion; submit a fresh root report.')
                require(report.get('contract_sha256') == contract_fingerprint(state),
                        'Task contract or route changed after root completion; submit a fresh root report.')
```

</details>

**依据 2 · 源码核查**：[j-space/SKILL.md:28-33](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/blob/b2023124a1fa08278e3ee82aefa8ed9faeade995/j-space/SKILL.md#L28-L33)

作者主动限定科学叙事为功能框架，提示不测激活或体验。

```text
Use this premise as a functional operating frame. The research measures particular models
under particular interventions; a prompt does not measure your activations or establish
subjective experience. First-person statements bind a task state to an action. Preserve
source wording and distinguish it from engineering claims; see
[the evidence boundaries](references/engineering-evidence.md) and
[the research reference](references/j-space-science.md).
```

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 严格工作循环的总负担是否值得？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次需完整复制Skill及支持文件、确认Python3.10以上，并学习路由和控制器；持续需pulse、read、repo map同步、报告和问题闭合，失败时重开问题或重新验证受影响证据。脚本不依赖pip与后台服务，降低环境管理，但门控记录会增加人工与上下文成本；文件摘要只检测变更，解释变更影响仍由人或模型承担。对经常因陈旧证据返工的人可在单个非关键任务有条件试用，先以high单人最小流程核对证据失效，再按真实独立工作需要引入Agent。若记录维护吞没验证时间、模型只是填文件过门槛或无法解释门控错误，应停止严格控制并退回普通清单；保留原证据与成果，不能把清空状态当问题解决。金额与分钟均没有实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-32](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/blob/b2023124a1fa08278e3ee82aefa8ed9faeade995/README.md#L14-L32)

安装与Python环境条件。

<details>
<summary>查看原文（19行）</summary>

````text

## Quick start

You need a host that can load a local `SKILL.md` and retrieve its supporting files.
Python 3.10+ is needed for executable controllers and validation; low/medium can use the
documented prose fallback. No pip dependencies or background service are required.

1. Copy the complete [`j-space/`](j-space/) directory into your host's Skills directory.
   Obtain that directory from the host's own configuration; no universal location or
   invocation syntax applies to every host. Keep `SKILL.md`, `modules/`, `references/`,
   and `scripts/` together; avoid an extra nested `j-space/j-space/` directory.
   Copy `LICENSE` and `THIRD_PARTY_NOTICES.md` alongside the installed `SKILL.md` when
   distributing the standalone skill. Use an empty destination to avoid mixing installs.
2. Use Python 3.10 or later to verify the installed directory:

   ```text
   <python-command> <skill-root>/scripts/verify_suite.py
   ```

````

</details>

**依据 2 · 源码核查**：[j-space/SKILL.md:85-98](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/blob/b2023124a1fa08278e3ee82aefa8ed9faeade995/j-space/SKILL.md#L85-L98)

持久状态、投影、seam与实际文件刷新说明操作负担。

<details>
<summary>查看原文（14行）</summary>

```text
You maintain `.jspace/control.json` through the controller. Read `.jspace/CONTROL.md` as
its shared human-readable projection. Keep decisions, evidence, open questions, agent
reports, reviews, and the next action current. Do not hand-edit the projection or maintain
a competing source of truth. The small `jspace.py` ledger is an optional standalone aid
for bounded work; its heuristic `ship` audit cannot substitute for strict control checks.

A **seam** is a phase change, a tool boundary, a checkpoint, a handoff, a failure, or a
return after context loss. At each seam, consume the current record and advance `Next`
after progress. Run `pulse` at tool boundaries. Its event/count/time schedule rereads actual
files and returns their contents; recalling an earlier reading does not satisfy refresh.
Use `failure`, `handoff`, `resume`, or `compact` immediately when that event occurs.
Explicit `read` loads the selected sources and records their current hashes per agent.
Use `route --module modules/NAME.md --reason "Phase change"` to change active optional
sources without losing state; repeat `--module` for each needed source. Add `--level xhigh`
```

</details>

**依据 3 · 源码核查**：[j-space/scripts/control.py:443-455](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/blob/b2023124a1fa08278e3ee82aefa8ed9faeade995/j-space/scripts/control.py#L443-L455)

证据变化和未闭问题会阻断ship。

<details>
<summary>查看原文（13行）</summary>

```text
        if checkpoint.get('active', True):
            require(current_evidence(root, checkpoint['evidence'], 'Active checkpoint ' + str(checkpoint['id'])),
                    'Active checkpoint evidence changed: ' + str(checkpoint['id']) +
                    '. Reopen a dependent question or record a new checkpoint with --supersede ID.')
    for qid, question in state['questions'].items():
        if question['closed']:
            checkpoint = next(item for item in state['checkpoints'] if item['id'] == question['checkpoint'])
            require(current_evidence(root, checkpoint['evidence']),
                    'Closed question evidence changed: ' + qid + '. Use note --reopen ' + qid + ' and reverify.')
    if stage == 'ship':
        require(not any(not question['closed'] for question in state['questions'].values()), 'Open questions require evidence-backed closure.')
        require(state['level'] != 'xhigh' or len(active_agents(state)) > 1 or nonempty(state['solo_reason']),
                'xhigh needs participating agents or an explicit --solo-reason describing unavailable host delegation.')
```

</details>

#### 缺口

- 没有长期任务维护分钟、失败恢复和收益对照
  **影响**：不能证明记录开销小于返工节省
  **进一步探讨**：同类型有变更任务比较普通清单和严格门控的陈旧引用、返工与人工分钟

<a id="research-q05"></a>

<a id="detail-section-19"></a>

### Q05 · 独立核对结果能否补强内容真实性？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是在现有摘要绑定之外，为关键验收记录最小可重放命令、退出码与环境，并由独立检查者抽样复跑，使“文件没变”进一步接近“结果可重复”。推导来自Q02的一致性机制和Q03的虚构文件反例；增加的副作用是重复执行成本与不安全命令风险，因此只限可重复且已授权的隔离任务。最小试验包含真实通过、真实失败、虚构日志和过期源码四类材料，对比现有门控与独立复核的误接受率与人工分钟。若增加复核却不减少误接受，或成本超过直接验收，应停止；不宣称能自动证明全部任务正确。

#### 证据与依据

**依据 1 · 源码核查**：[j-space/scripts/control.py:465-487](https://github.com/Tiger3807861189/J-Space-Cognition-Suite/blob/b2023124a1fa08278e3ee82aefa8ed9faeade995/j-space/scripts/control.py#L465-L487)

现有验收绑定证据摘要与报告接受，指明新增核对的接口边界。

<details>
<summary>查看原文（23行）</summary>

```text
            require(current_evidence(root, report['evidence']), member + ' report evidence changed.')
            for source in report['sources']:
                require(current_evidence(root, source), member + ' report source changed: ' + source['path'])
            if repo_enabled(state):
                require(bool(report['sources']), member + ' needs explicit --source dependencies.')
            if member == 'root':
                require(report.get('completion') and current_evidence(root, report['completion']),
                        'Root needs current --completion evidence checking the goal and deliverable.')
                require(report.get('goal') == state['goal'], 'Goal changed after root completion; submit a fresh root report.')
                require(report.get('contract_sha256') == contract_fingerprint(state),
                        'Task contract or route changed after root completion; submit a fresh root report.')
                require(all(report.get('time', 0) >= a.get('retirement', {}).get('time', 0)
                            for a in state['agents'].values()),
                        'Agent retirement changed integration scope; submit a fresh root completion report.')
                continue
            if state['level'] in ('high', 'xhigh'):
                require(report['round'] == 2, member + ' requires a second-thinking report.')
            review = report.get('review')
            require(review and review['verdict'] == 'accepted', member + ' latest report is not independently accepted.')
            require(review['agent'] in state['agents'] and review['agent'] != member and
                    review['report_sha256'] == digest(encoded({k: v for k, v in report.items() if k != 'review'})),
                    member + ' review is not bound to the current report.')
            require(current_evidence(root, review['evidence']), member + ' review evidence changed.')
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
