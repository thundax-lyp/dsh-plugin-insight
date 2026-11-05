# All in Luna

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b471713](https://github.com/zenx0x/allinluna/tree/b471713089d8352c1c97e05fe3d25907a4164b1a)

<!-- BEGIN META -->
[![GitHub ★ 65](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=65&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zenx0x/allinluna)
<!-- END META -->

> **功能**：以持久TaskGraph、资源调度、宿主动作回执和独立验收组织跨会话任务，包含DSH适配。

> **亮点**：将任务依赖、资源/ownership调度、意图/回执和done_when的独立验证组织为持久编排事实，避免只凭模型叙述合并结果。此结构可解释跨会话交接，但实际净效率尚无同任务证据。[Q01](#research-q01) [Q03](#research-q03) [Q04](#research-q04)

> **主要限制**：当前DSH next_actions调用只读preview别名，缺relay所需完整字段，声明路径不闭合；relay又先物理创建child后入库回执，失败重试不由后置去重保证唯一创建。上下文和ownership不是安全隔离，receipt/hash不是业务验收。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 顶层任务层给谁解决什么，根条目是否普通插件？](#detail-section-11)
  - [Q02 · DSH的start、next-actions到relay是否真的闭合？](#detail-section-12)
  - [Q03 · 调度与持久化提供哪些恢复/隔离边界？](#detail-section-13)
  - [Q04 · 验收如何独立于done，采用需要承担哪些成本？](#detail-section-14)
  - [Q05 · 当前谁应观察，能验证怎样的改进？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：跨前后端、迁移、测试等大目标的维护者，需要独立任务上下文、依赖交接与可复核验收，减少单会话全日志的协调负担。[Q01](#research-q01)

参照单个长会话内临时子Agent及手工进度表。新增持久任务/回执与验证结构，继承模型和宿主执行能力；DSH持续child不自动等同OS隔离或独立用户顶层聊天。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 顶层TaskGraph | 拆分独立工作与依赖 | 任务合同和导出需真实覆盖 |
| SQLite事务/日志 | 保留事实与协调进度 | 本地事务不包远端创建 |
| 资源/ownership调度 | 选择就绪任务与slot | 声明约束，非OS隔离 |
| HostAction/receipt | 冻结操作并记录观察身份 | hash和后置去重不保证物理唯一 |
| DSH start/status | 建run并查持久状态 | 需Python CLI和宿主服务 |
| DSH relay | 完整动作创建continuable child | next-actions摘要当前不能原样消费 |
| typed验证与证据 | 检查覆盖done_when/工件 | 充分性依合同，命令需信任门 |

**流程与依赖**

#### 启动与依赖

| 条件 | 必需范围 | 作用 | 缺失/边界 |
|---|---|---|---|
| Python >=3.11/allinluna CLI | 核心 | CLI与SQLite事实层 | 路径不存在时适配返回安装提示 |
| 文件DB及迁移权限 | 持久运行 | Run、任务、回执与日志 | SQLite事务不包远端child |
| DSH tools/subagents | All in Flash | 四工具及startContinuable | provider实际能力须宿主验收 |
| 完整持久HostAction | relay | 冻结prompt/opcode/hash | next-actions预览目前不满足 |
| Task合同/ownership/spec | 可靠交付 | 依赖和验收边界 | 声明错误不能自动变安全 |
| 模型/工具/人工决策 | 实际工作 | 独立执行与命令信任批准 | 费用和并发资源未测 |

根2.0.0-rc.7，DSH文档安装All in Flash 0.2.0；制品未执行验收。[Q02](#research-q02) [Q04](#research-q04)

#### 使用步骤

| 阶段 | 动作/责任 | 结果和检查 |
|---|---|---|
| 准备 | 维护者固定DB/宿主/模型和副本任务 | 独立验收、ownership和退路先明确 |
| 建图 | CLI编译目标为TaskGraph并tick | 可能返回动作，不代表全目标完成 |
| 调度 | Python按依赖/资源/租约持久意图 | 预览不派发，DSH接口错配待修 |
| 派发 | 宿主relay完整动作创建child | 先创建后回执，失败先对账不盲重试 |
| 验收 | collector用明确spec覆盖done_when | 检查只证明合同覆盖的范围 |
| 恢复退出 | 维护者查DB与活动child、保留工件 | 停编排不等于已停所有外部工作 |

本轮未执行；先修接线再跑副本流程。[Q02](#research-q02) [Q05](#research-q05)

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工投入 | 未知与限制 |
|---|---|---|---|
| 首次 | Python/DSH包、DB和环境存储 | 配专用profile、合同/spec/ownership | 两生态版本/制品未验收 |
| 持续 | 并行模型/工具、SQLite/工件 | 调度、审批、依赖与handoff复核 | 不保证token或墙钟节省 |
| 失败 | 重试可能重复child/模型费用 | 对账动作/回执/租约和外部结果 | timeout失败不是无副作用 |
| 退出 | 保留DB/工件 | 撤适配并检查活动child | 无自动回滚远端操作保证 |

总人工时间与单位合格任务成本待比较。[Q04](#research-q04)

#### 效果

| 项目 | 源码支持 | 未证实/反证 |
|---|---|---|
| 持久协调 | SQLite事务与outbox | 不跨远端动作原子提交 |
| 有条件并行 | 依赖/ownership/资源slot | 未测吞吐或冲突避免效果 |
| 独立验收 | typed spec、信任门、done_when覆盖 | spec不充分仍可漏业务错误 |
| DSH转交 | 完整动作到child/receipt | next-actions目前只读摘要不满足relay |
| 恢复 | DB去重/回执事实 | 创建前无同键保证，重复child未实测 |

本轮仅源码机制，不把作者效果图/测试数量当运行结果。[Q02](#research-q02) [Q03](#research-q03)

> **思考**：当前DSH next_actions调用只读preview别名，缺relay所需完整字段，声明路径不闭合；relay又先物理创建child后入库回执，失败重试不由后置去重保证唯一创建。上下文和ownership不是安全隔离，receipt/hash不是业务验收。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将任务依赖、资源/ownership调度、意图/回执和done_when的独立验证组织为持久编排事实，避免只凭模型叙述合并结果。此结构可解释跨会话交接，但实际净效率尚无同任务证据。[Q01](#research-q01) [Q03](#research-q03) [Q04](#research-q04)

SQLite外层事务与意图/回执分离、验证程序不从自然语言自动变shell是明确工程设计。DSH预览/派发合同漂移及物理创建到入库间隙显示跨层接线仍需验收；RLock/ownership不等同多租户或全局fencing。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

当前DSH next_actions调用只读preview别名，缺relay所需完整字段，声明路径不闭合；relay又先物理创建child后入库回执，失败重试不由后置去重保证唯一创建。上下文和ownership不是安全隔离，receipt/hash不是业务验收。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

当前观察。DSH维护者先对齐next-actions/dispatch与relay，并验证创建后入库失败、重放与活动child对账；再以双Task副本对照单会话子Agent，业务验收与总成本不改善则回原工作方式。保留DB/工件并逐项处理活动child，不靠暂停等同终止。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认持久任务/调度和验收结构；当前DSH默认动作路径有合同矛盾，部署/故障恢复/效果未执行，观察等待接线修正与验收。

- 已检查：作者 README、包清单、源码路径 README.md、pyproject.toml、plugins/deepseek-harness/index.js、plugins/allinluna/runtime/allinluna_runtime/store.py、plugins/allinluna/runtime/allinluna_runtime/verification.py、plugins/allinluna/runtime/allinluna_runtime/cli.py、plugins/allinluna/runtime/allinluna_runtime/store_dispatch.py、plugins/allinluna/runtime/allinluna_runtime/scheduler/global_scheduler.py、plugins/allinluna/runtime/allinluna_runtime/evidence.py、plugins/deepseek-harness/README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：inventory覆盖根组件；人工聚焦DSH四工具、CLI预览/派发、SQLite事务、global调度与验收证据。未全面审计Codex adapter、全部packs、租约恢复、命令信任实现或多进程fencing；未执行目标/测试/真实宿主。
- 下一步：先修DSH动作合同并验证物理API，再对三个创建/回执崩溃点重放，核对child数、unknown和恢复步骤；固定任务对比单会话方案的验收、冲突、人工/模型成本。本轮未执行。

**分析版本**

- **仓库**：[zenx0x/allinluna](https://github.com/zenx0x/allinluna)
- **版本号**：2.0.0-rc.7（[固定提交 b471713](https://github.com/zenx0x/allinluna/tree/b471713089d8352c1c97e05fe3d25907a4164b1a)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究消费持久动作、创建前认领和创建后对账的DSH派发协议，中间失败保留unknown/reconcile；先核对provider幂等/查询能力，再在三个崩溃点重放检验实际child数与恢复成本，不以数据库去重替代外部效果保证。[Q05](#research-q05)

先修DSH动作合同并验证物理API，再对三个创建/回执崩溃点重放，核对child数、unknown和恢复步骤；固定任务对比单会话方案的验收、冲突、人工/模型成本。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 43 | 3621 | — | — | 21433 |
| .md | example | 2 | 76 | — | — | 452 |
| .js | source | 2 | 498 | 454 | 9 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/zenx0x/allinluna/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/zenx0x/allinluna/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/zenx0x/allinluna/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：顶层任务编排、持久调度与验收如何接线，DSH路径能否闭环？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 顶层任务层给谁解决什么，根条目是否普通插件？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根组件是Python持久编排基础设施，含Codex/DSH适配，不能只按子目录Cordis插件将整个项目叫普通插件。pyproject提供allinluna CLI与Python >=3.11要求，DSH子包All in Flash导出四个工具并要求subagents服务。场景是涉及前后端、迁移、测试和文档的大目标：一个长会话持有所有日志时，任务阻塞、交接与验收容易混在一起；作者提出顶层Task拥有独立目标、上下文、依赖、状态和结果边界，局部仍可用WorkUnit/subagent。

相对只在一个会话里临时spawn子Agent，代码增量是SQLite事实层、全局TaskGraph调度、资源/ownership租约、冻结host动作与回执、独立VerificationSpec和handoff证据。这改变工作与验收组织，而非提高模型本身推理能力。独立上下文不等于独立OS进程、工作树或安全租户；DSH具体使用startContinuable，是宿主的持续child入口，产品所称top-level是本系统的编排语义，不自动等同另一个产品的用户顶层聊天。

合格结果是所有约定工件/检查有可追溯证据、依赖正确交接且能解释重启/未知执行状态，不是“更多任务并发”或模型说done。作者主张的减少上下文污染/提高效率须同任务比较，目前未验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-49](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/README.md#L23-L49)

作者说明长任务上下文摩擦，不视为用户实测。

<details>
<summary>查看原文（27行）</summary>

```text
---

## Why does this exist?

Small AI coding tasks are easy.

The hard part looks more like this:

> “Refactor authentication end to end, including the backend, frontend, migration, tests, and documentation.”

At first, everything is fine.

Then the agent reads files, edits code, runs tests, starts subagents, handles failures, reads more files, and keeps pushing more execution detail back into the same conversation.

After enough turns, familiar problems appear:

- the context keeps growing;
- unrelated work starts contaminating other work;
- earlier constraints become easier to forget;
- one local blocker stalls the whole flow;
- subagent results become harder to manage;
- a new conversation has to reconstruct what really happened;
- the agent says “done,” but the outcome may not actually be complete.

**All in Luna starts from one simple idea: one conversation should not have to carry an entire project.**

<p align="center">
```

</details>

**依据 2 · 作者声明**：[README.md:95-109](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/README.md#L95-L109)

作者定义顶层Task边界。

<details>
<summary>查看原文（15行）</summary>

````text
> **All in Luna does not replace subagents. It gives them a better place to live.**

---

# What you get

## 1. Real top-level tasks

A large goal can become independent work domains instead of temporary chat branches.

For example:

```text
Add billing to this app

````

</details>

**依据 3 · 源码核查**：[pyproject.toml:1-25](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/pyproject.toml#L1-L25)

Python运行时与CLI身份。

<details>
<summary>查看原文（25行）</summary>

```text
[project]
name = "allinluna"
version = "2.0.0-rc.7"
description = "Durable, resource-aware multi-agent orchestration for Codex and DeepSeek Harness"
readme = "README.md"
requires-python = ">=3.11"
license = "Apache-2.0"
authors = [{ name = "zenx0x" }]
keywords = ["agents", "codex", "deepseek-harness", "multi-agent", "orchestration", "workflow"]
classifiers = [
  "Development Status :: 4 - Beta",
  "Operating System :: OS Independent",
  "Programming Language :: Python :: 3",
  "Programming Language :: Python :: 3.11",
  "Programming Language :: Python :: 3.12",
  "Programming Language :: Python :: 3.13",
  "Topic :: Software Development :: Libraries :: Application Frameworks",
]

[project.scripts]
allinluna = "allinluna_runtime.cli:main"

[build-system]
requires = ["setuptools>=68", "wheel"]
build-backend = "setuptools.build_meta"
```

</details>

**依据 4 · 源码核查**：[plugins/deepseek-harness/index.js:15-18](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/deepseek-harness/index.js#L15-L18)

子适配插件要求tools/subagents，与根基础设施区分。

```text
export const name = 'allinflash'
export const inject = ['tools', 'subagents']

const CREATE_TOP_LEVEL_TASK_TOOL = 'allinflash__create_top_level_task'
```

**依据 5 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/store.py:1-57](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/store.py#L1-L57)

SQLite事实层而非聊天摘要文件。

<details>
<summary>查看原文（57行）</summary>

```text
"""SQLite authority for the All in Luna vNext core runtime.

The store deliberately owns facts, not presentation files.  Every write is
performed in a SQLite transaction and the signal journal can share that
transaction through :meth:`transaction`.  The implementation uses only the
Python standard library so it is usable by the host adapters and by offline
recovery tooling alike.
"""

from __future__ import annotations

import sqlite3
import threading
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Iterator, Sequence

from .migrations import apply_migrations
from .store_observability import StoreObservability
from .store_scheduling import StoreScheduling
from .store_errors import DuplicateIdentityError, LeaseConflictError, ResourceClaimError, StoreError


from .store_repositories import StoreRepositories
from .store_resources import StoreResources
from .store_dispatch import StoreDispatch
from .store_services import StoreServices


class Store(StoreRepositories, StoreResources, StoreDispatch, StoreServices, StoreObservability, StoreScheduling):
    """Thread-safe SQLite store implementing the T1 task/store contract."""

    def __init__(self, path: str | Path | sqlite3.Connection, *, auto_migrate: bool = True) -> None:
        self._lock = threading.RLock()
        self._transaction_state = threading.local()
        self._owns_connection = not isinstance(path, sqlite3.Connection)
        if isinstance(path, sqlite3.Connection):
            self.path = Path(":memory:")
            self._connection = path
        else:
            self.path = Path(path)
            if str(path) != ":memory:":
                self.path.parent.mkdir(parents=True, exist_ok=True)
            self._connection = sqlite3.connect(
                str(path),
                isolation_level=None,
                check_same_thread=False,
                timeout=30.0,
            )
        self._connection.row_factory = sqlite3.Row
        with self._lock:
            self._connection.execute("PRAGMA foreign_keys = ON")
            self._connection.execute("PRAGMA busy_timeout = 30000")
            self._connection.execute("PRAGMA journal_mode = WAL")
        if auto_migrate:
            self.migrate()

```

</details>

**依据 6 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/verification.py:1-17](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/verification.py#L1-L17)

done_when与独立程序明确分开。

<details>
<summary>查看原文（17行）</summary>

```text
"""Typed, declarative verification procedures for task contracts.

``done_when`` states the semantic outcome a task must reach.  A
``VerificationSpec`` describes the independent, executable or observable
procedure which may establish evidence for that outcome.  The two concepts are
intentionally not interchangeable: human language is never promoted into a
shell command.
"""

from __future__ import annotations

from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from typing import Any


VERIFICATION_KINDS = frozenset({"command", "artifact", "workspace", "human", "pack"})
```

</details>

#### 缺口

- 没有同任务单会话/多Task的真实结果、成本和上下文质量比较。
  **影响**：不能声称并发与持久状态已经带来净效率或更可靠交付。
  **进一步探讨**：固定一个跨域任务比较验收质量、等待、重复工作与总模型/人工成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH的start、next-actions到relay是否真的闭合？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

DSH四工具通过execFile调用外部allinluna，默认30秒、1MiB缓冲，从stdout末尾可解析行取JSON；CLI未找到给安装提示，非零/超时只返回ok=false及已有输出，不证明远端child没建立或数据库无变化。start调用CLI start，Python启动编译并tick，结果可含actions/receipts；并不是一条工具调用保证整个大目标自动执行完。

核心不一致是：插件next_actions文案承诺冻结动作可原样relay，实际invoke调用next-actions；固定CLI把next-actions作为preview-actions旧别名，返回relayable:false，用_preview_summary只留下kind/target/execution_class/note，移除tool、arguments、hash等。relay的parseRelayAction又要求exact工具/能力、无替代opcode、hash和冻结prompt/title。所以按“next_actions取得对象→原样relay”的文档路径不能满足校验。这是固定源码合同矛盾；start中已有完整动作或CLI dispatch/drive是其他路径，不能据此把这个接口不一致抹去，也未在本轮验证替代路径全程可用。

relay通过校验后调用ctx.subagents.startContinuable，取childId，才提取runRef并调用CLI ingest-receipt；receipt记实际工具、动作hash、派发ID和child身份。child已创建而ingest超时/失败时，工具抛错，不能理解成没创建。再次relay时在startContinuable前没有查询持久回执或向调用传入idempotency_key；store的后置去重只能去重记录，不能撤销第二次物理创建。由于provider行为未验证，只能说存在重复child的条件风险，不能断言已发生。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/deepseek-harness/index.js:73-128](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/deepseek-harness/index.js#L73-L128)

relay动作校验和外部CLI调用边界。

<details>
<summary>查看原文（56行）</summary>

```text
  let action
  try {
    action = JSON.parse(nonEmpty(actionJson, 'action_json'))
  } catch (error) {
    throw new Error(`action_json must be valid JSON: ${error.message}`)
  }
  if (action?.kind !== 'create-top-level-task' || action.execution_class !== 'top_level_task') {
    throw new Error('All in Flash relays only top-level task actions')
  }
  if (action.tool !== CREATE_TOP_LEVEL_TASK_TOOL || action.host_capability_required !== CREATE_TOP_LEVEL_TASK_TOOL) {
    throw new Error('action does not require the exact All in Flash top-level capability')
  }
  if (action.tool_policy?.exact_tool !== CREATE_TOP_LEVEL_TASK_TOOL || (action.tool_policy?.substitutions ?? []).length !== 0) {
    throw new Error('action tool policy is not an exact All in Flash opcode policy')
  }
  if (action.action_contract_hash !== actionContractHash(action)) {
    throw new Error('action_contract_hash does not match immutable action material')
  }
  if (typeof action.arguments?.prompt !== 'string' || typeof action.arguments?.title !== 'string') {
    throw new Error('top-level action is missing its frozen prompt or title')
  }
  return action
}

async function invoke(config, args) {
  const resolved = commandConfig(config)
  const commandArgs = [...resolved.commandArgs]
  if (resolved.db) commandArgs.push('--db', resolved.db)
  commandArgs.push(...args)
  try {
    const result = await execFileAsync(resolved.command, commandArgs, {
      cwd: resolved.cwd,
      windowsHide: true,
      timeout: resolved.timeoutMs,
      maxBuffer: 1024 * 1024,
    })
    return {
      ok: true,
      exitCode: 0,
      resultJson: JSON.stringify(parseJsonOutput(result.stdout)),
      stderr: String(result.stderr ?? '').trim(),
    }
  } catch (error) {
    const missingRuntime = error.code === 'ENOENT'
      ? `All in Luna CLI was not found (${resolved.command}). Install it with "python -m pip install allinluna" or re-run "allinflash init" with --runtime-command.`
      : null
    return {
      ok: false,
      exitCode: typeof error.code === 'number' ? error.code : null,
      resultJson: JSON.stringify(parseJsonOutput(error.stdout)),
      stderr: String(missingRuntime ?? error.stderr ?? error.message ?? '').trim(),
    }
  }
}

const OUTPUT = {
```

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness/index.js:181-190](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/deepseek-harness/index.js#L181-L190)

next_actions实际调用next-actions并要求原样转交。

<details>
<summary>查看原文（10行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'allinflash_next_actions',
    description: 'Read exact pending All in Luna host actions. Relay a returned HostAction only through its named physical host capability.',
    parameters: {
      run_id: { type: 'string', required: true, description: 'Run ID returned by allinflash_start.' },
    },
    output: OUTPUT,
    execute: (args) => invoke(config, ['next-actions', nonEmpty(args.run_id, 'run_id')]),
    presentCall: (args) => present('Read All in Luna next actions', args),
  }))
```

</details>

**依据 3 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/cli.py:73-86](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/cli.py#L73-L86)

预览删去可执行字段。

<details>
<summary>查看原文（14行）</summary>

```text
def _preview_summary(action: Any) -> dict[str, Any]:
    """Describe a possible action without exposing a relayable tool call."""

    value = dict(action) if isinstance(action, Mapping) else action.to_dict()
    payload = value.get("payload") if isinstance(value.get("payload"), Mapping) else {}
    return {
        "kind": value.get("kind"),
        "target_type": value.get("target_type") or payload.get("target_type"),
        "target_id": value.get("target_id") or payload.get("task_id") or payload.get("work_unit_id"),
        "execution_class": value.get("execution_class"),
        "relayable": False,
        "note": "read-only scheduler projection; use dispatch or drive to persist a relayable action",
    }

```

</details>

**依据 4 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/cli.py:420-437](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/cli.py#L420-L437)

start包含tick/actions，不等于自动闭环完成。

<details>
<summary>查看原文（18行）</summary>

```text
            run_id = str(result["run_ref"]).removeprefix("run://")
            tick = engine.tick(run_id, dispatch=not args.no_dispatch)
            result = {
                "run_ref": result["run_ref"],
                "runtime_db": str(store.path),
                "dispatch_started": not args.no_dispatch,
                "compilation": {
                    "input_kind": compilation.input_kind,
                    "task_graph_form": compilation.compatibility.get("task_graph_form"),
                    "pack": str(compilation.intent.pack.id),
                    "task_count": len(compilation.task_graph.tasks),
                    "work_graph_count": len(compilation.task_graph.work_graphs),
                },
                "status": tick.status,
                "actions": list(tick.actions),
                "receipts": list(tick.receipts),
            }
        elif args.command == "status":
```

</details>

**依据 5 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/cli.py:452-469](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/cli.py#L452-L469)

next-actions明确不可relay且引导dispatch/drive。

<details>
<summary>查看原文（18行）</summary>

```text
        elif args.command in {"preview-actions", "next-actions"}:
            # Preview is the scheduler's read-only path.  Calling Coordinator
            # tick here used to make this observational command look like a
            # scheduling step and could create leases/attempts on regressions.
            result = {
                "run_id": args.run_id,
                "relayable": False,
                "actions": [
                    _preview_summary(action)
                    for action in engine.scheduler.preview(args.run_id)
                ],
            }
            if args.command == "next-actions":
                result["deprecated"] = "next-actions is an alias for preview-actions; use dispatch or drive to relay"
        elif args.command == "dispatch":
            tick = engine.tick(args.run_id, dispatch=True)
            result = {"run_id": args.run_id, "actions": list(tick.actions), "receipts": list(tick.receipts), "status": tick.status}
        elif args.command == "drive":
```

</details>

**依据 6 · 源码核查**：[plugins/deepseek-harness/index.js:208-251](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/deepseek-harness/index.js#L208-L251)

实际child先创建，随后才ingest回执。

<details>
<summary>查看原文（44行）</summary>

```text
    async execute(args, exec) {
      const action = parseRelayAction(args.action_json)
      if (!exec.agent) throw new Error('allinflash_relay_action requires a calling DSH agent')
      const provider = typeof config.subagentProvider === 'string' && config.subagentProvider.trim()
        ? config.subagentProvider.trim()
        : 'spawn'
      const accepted = await ctx.subagents.startContinuable({
        provider,
        label: action.arguments.title,
        request: {
          label: action.arguments.title,
          prompt: [{ type: 'text', text: action.arguments.prompt }],
          parent: exec.agent,
        },
        signal: exec.signal,
      })
      const runId = String(action.payload?.task_envelope?.run_ref ?? '').replace('run://', '')
      if (!runId) throw new Error('action payload does not contain a durable run reference')
      const receipt = {
        receipt_id: `allinflash-receipt-${action.action_id}`,
        status: 'ready',
        source: 'deepseek-harness',
        host_adapter: 'deepseek-harness',
        host_id: typeof config.hostId === 'string' && config.hostId.trim() ? config.hostId.trim() : 'allinflash-dsh',
        thread_id: accepted.childId,
        action_id: action.action_id,
        action_kind: action.kind,
        idempotency_key: action.idempotency_key,
        dispatch_key: action.idempotency_key,
        dispatch_id: action.dispatch_id,
        task_id: action.task_id,
        actual: true,
        actual_tool: CREATE_TOP_LEVEL_TASK_TOOL,
        actual_capability: CREATE_TOP_LEVEL_TASK_TOOL,
        action_contract_hash: action.action_contract_hash,
        payload: { provider, child_id: accepted.childId },
      }
      const ingested = await invoke(config, ['ingest-receipt', runId, JSON.stringify(receipt)])
      if (!ingested.ok) throw new Error(`failed to ingest All in Flash receipt: ${ingested.stderr || ingested.resultJson}`)
      return { childId: accepted.childId, receiptJson: JSON.stringify(receipt) }
    },
    presentCall: (args) => present('Relay All in Flash task', args),
  }))
}
```

</details>

**依据 7 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/store_dispatch.py:397-407](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/store_dispatch.py#L397-L407)

持久去重发生在回执入库阶段。

<details>
<summary>查看原文（11行）</summary>

```text
        def ingest() -> dict[str, Any]:
            nonlocal requested_model, requested_reasoning, resolved_model, resolved_reasoning
            nonlocal actual_model, actual_reasoning, resource_state, evidence_source, resource_observed_at, payload
            existing = self._fetchone("SELECT * FROM host_receipts WHERE id = ?", (receipt_id,))
            if existing is None and dispatch_key:
                existing = self._fetchone(
                    "SELECT * FROM host_receipts WHERE host_adapter = ? AND dispatch_key = ?",
                    (adapter, str(dispatch_key)),
                )
            if existing is None:
                try:
```

</details>

#### 缺口

- 未运行DSH profile，start返回动作替代路径、child lifecycle与重复请求行为未知。
  **影响**：主要DSH声明路径有源码矛盾，不能给即装即用试用结论或exactly-once保证。
  **进一步探讨**：先对齐next_actions与持久dispatch合同，再用固定DSH验收首次/重复relay与创建后入库失败，检查实际child数量与回执。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 调度与持久化提供哪些恢复/隔离边界？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Store使用SQLite WAL、foreign_keys和busy_timeout，外层transaction以进程RLock和BEGIN IMMEDIATE包住，异常rollback、成功commit，嵌套共享事务；可把状态和journal放同一提交。它支持本地事实一致性，不是跨宿主物理动作与数据库的分布式事务，也不自动保证远端停止。

global scheduler先看依赖：默认上游completed，exports_available要求verifying/completed且实际导出可用；不是只凭合同宣称有输出。step检测循环、按关键路径/下游评分就绪任务、过滤与active ownership冲突，再受资源slot/backlog限制；获取任务lease后persist_dispatch_intent才交host处理。无法路由时释放资源/租约并发解析动作。设计把调度意图和物理动作分开，优于只在会话记“已派发”。

但ownership是声明路径集合上的协作约束，未在此链给每Task建立OS沙箱或访问控制；错误/不完整声明不能由调度器自动发现，DSH child启动参数也没有指定独立工作树。SQLite事务不跨child进程；父/子共用什么目录、权限和模型受宿主provider决定。本轮未审完租约过期、所有generation fencing和崩溃重放路径，不能把持久/租约直接写成无重复执行、数据隔离或多租户保证。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/store.py:34-57](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/store.py#L34-L57)

SQLite配置与本地连接范围。

<details>
<summary>查看原文（24行）</summary>

```text
        self._lock = threading.RLock()
        self._transaction_state = threading.local()
        self._owns_connection = not isinstance(path, sqlite3.Connection)
        if isinstance(path, sqlite3.Connection):
            self.path = Path(":memory:")
            self._connection = path
        else:
            self.path = Path(path)
            if str(path) != ":memory:":
                self.path.parent.mkdir(parents=True, exist_ok=True)
            self._connection = sqlite3.connect(
                str(path),
                isolation_level=None,
                check_same_thread=False,
                timeout=30.0,
            )
        self._connection.row_factory = sqlite3.Row
        with self._lock:
            self._connection.execute("PRAGMA foreign_keys = ON")
            self._connection.execute("PRAGMA busy_timeout = 30000")
            self._connection.execute("PRAGMA journal_mode = WAL")
        if auto_migrate:
            self.migrate()

```

</details>

**依据 2 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/store.py:84-115](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/store.py#L84-L115)

外层事务commit/rollback和锁范围。

<details>
<summary>查看原文（32行）</summary>

```text
        """Open an IMMEDIATE transaction, nesting without a partial commit.

        The re-entrant process lock is held for the whole outer transaction.
        This serializes writers, makes the default single connection safe for
        concurrent journal appenders, and lets state + signal share one commit.
        """

        self._lock.acquire()
        outer = self._depth == 0
        if outer:
            self._connection.execute("BEGIN IMMEDIATE")
        self._depth = self._depth + 1
        try:
            yield self
        except BaseException:
            self._depth = self._depth - 1
            if outer:
                self._connection.rollback()
            raise
        else:
            self._depth = self._depth - 1
            if outer:
                self._connection.commit()
        finally:
            self._lock.release()

    def _write(self, callback: Any) -> Any:
        if self._depth > 0:
            return callback()
        with self.transaction():
            return callback()

```

</details>

**依据 3 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/scheduler/global_scheduler.py:151-174](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/scheduler/global_scheduler.py#L151-L174)

依赖与真实export读取。

<details>
<summary>查看原文（24行）</summary>

```text
            upstream = self.store.get_task(str(dependency["depends_on_task_id"]))
        if upstream is None:
            return False
        condition = dependency.get("condition") or {}
        kind = str(condition.get("type", condition.get("condition", "completed")))
        if kind == "exports_available":
            required = set(map(str, condition.get("exports", ())))
            available = self._available_exports(str(upstream["id"]))
            return upstream["state"] in {"verifying", "completed"} and (not required or required.issubset(available))
        return upstream["state"] == "completed"

    def _available_exports(self, task_id: str) -> set[str]:
        """Read only verified export values, never contract declarations."""

        available = set(self._compat_exports.get(str(task_id), set()))
        task = self._snapshot_tasks.get(str(task_id)) or self.store.get_task(str(task_id))
        if task is None:
            return available
        if "actual_exports" in task:
            available.update(map(str, task.get("actual_exports", ())))
        elif hasattr(self.store, "task_exports"):
            available.update(str(item["port_name"]) for item in self.store.task_exports(str(task["id"])))
        return available

```

</details>

**依据 4 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/scheduler/global_scheduler.py:690-749](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/scheduler/global_scheduler.py#L690-L749)

cycle/ownership/slot/lease与持久意图顺序。

<details>
<summary>查看原文（60行）</summary>

```text
        # dispatch effects and become visible to the next step/reconciliation.
        self._snapshot = None
        self._snapshot_tasks = {}
        tasks = self._tasks(run_id)
        dependencies, cycle = self._graph(tasks)
        if cycle:
            self.last_decision = SchedulerDecision(run_id, (), (), (), (), cycle)
            return []
        ready = self.ready_tasks(run_id, _reuse_snapshot=True)
        downstream: dict[str, int] = {str(task["id"]): 0 for task in tasks}
        for task, deps in dependencies.items():
            for dep in deps:
                downstream[dep] = downstream.get(dep, 0) + 1
        critical = critical_path_lengths((str(task["id"]) for task in tasks), dependencies)
        ready.sort(key=lambda item: self._score(item, critical, downstream), reverse=True)
        ready = filter_ownership_conflicts(ready, self._active_ownership())
        policy = run.get("policy") or run.get("policy_json") or {}
        if isinstance(policy, str):
            try:
                policy = json.loads(policy)
            except json.JSONDecodeError:
                policy = {}
        backlog_limit = int(policy.get("max_outbox_backlog", max(1, self.resource_broker.top_level_budget * 2)))
        backlog = int((self._snapshot or {}).get("outbox_backlog", 0))
        # Preserve already-durable actions, but do not create unbounded new
        # intents while the host/reconciler is behind.
        allocation_candidates = ready if backlog < backlog_limit else []
        allocations = self.resource_broker.allocate_top_level_slots(allocation_candidates)
        allocation_by_task = {item.entity_id: item for item in allocations}
        actions: list[HostAction] = []
        selected: list[str] = []
        for task in allocation_candidates:
            task_id = str(task["id"])
            allocation = allocation_by_task.get(task_id)
            if allocation is None:
                continue
            ownership = [str(item.get("path")) for item in task.get("ownership", ()) if str(item.get("access", "write")) == "write"]
            try:
                self.recovery.acquire("task", task_id, self.owner_id, ownership)
            except LeaseConflictError:
                self.resource_broker.release(task_id)
                continue
            action = self.action_factory(task, allocation.to_dict())
            if action.kind in {"resolve-project", "resolve-resource-route"}:
                self.resource_broker.release(task_id)
                lease = self.store._fetchone(
                    "SELECT id FROM leases WHERE scope_type = 'task' AND scope_id = ? AND state = 'active' ORDER BY acquired_at DESC LIMIT 1",
                    (task_id,),
                )
                if lease:
                    self.recovery.release(str(lease["id"]))
                actions.append(action)
                break
            self.store.persist_dispatch_intent(action, adapter=self.adapter, host_id=action.host_id)
            selected.append(task_id)
            actions.append(action)
        pending = self._pending_actions(run_id)
        known = {action.idempotency_key for action in actions}
        actions.extend(action for action in pending if action.idempotency_key not in known)
        self.last_decision = SchedulerDecision(run_id, tuple(str(item["id"]) for item in ready), tuple(selected), tuple(actions), tuple(str(item["id"]) for item in tasks if str(item["state"]) == "blocked"), ())
```

</details>

**依据 5 · 源码核查**：[plugins/deepseek-harness/index.js:212-223](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/deepseek-harness/index.js#L212-L223)

child创建没有本链独立目录/安全域参数。

<details>
<summary>查看原文（12行）</summary>

```text
        ? config.subagentProvider.trim()
        : 'spawn'
      const accepted = await ctx.subagents.startContinuable({
        provider,
        label: action.arguments.title,
        request: {
          label: action.arguments.title,
          prompt: [{ type: 'text', text: action.arguments.prompt }],
          parent: exec.agent,
        },
        signal: exec.signal,
      })
```

</details>

#### 缺口

- 未验收崩溃重放、租约恢复与多进程/跨主机部署，也未追踪所有fencing路径。
  **影响**：不支持强安全隔离、自动消除冲突或端到端exactly-once。
  **进一步探讨**：在副本任务上注入协调器/child故障与重放，核对实际动作、租约、导出及共享目录冲突。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 验收如何独立于done，采用需要承担哪些成本？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用、缺陷与关键质疑

#### 完整回答

VerificationSpec区分command/artifact/workspace/human/pack，只有command可含命令，要求明确形状与最长900秒timeout；done_when语义条件不会自动升成shell命令。CheckRunner先做trust/provenance/approval评估，不可执行时返回approval_required或failed；允许后用参数列表、shell=False、指定cwd/环境与timeout执行，并记录stdout/stderr和returncode。EvidenceCollector把check receipts映射到satisfies覆盖的done_when，缺覆盖、未可信command、人工证据要求或工件问题形成错误，不因为模型叙述完成就verified。

这把“想得到什么”和“怎样验证”分开，是可借鉴机制；然而验收充分性仍依赖合同/spec/检查命令是否覆盖真实业务，命令exit0仅证明该检查返回零。没有本轮执行，不把检查框架等同结果可靠；同一作者生成合同和验收也可能共享误解，重要需求仍需人类复核。

部署需Python CLI、数据库/迁移、宿主DSH与All in Flash包、可执行命令路径和可用subagent provider，DSH文档建议专用profile、init验证runtime并拒绝覆盖非managed profile除非force。作者安装流程未本轮执行；同时维护两生态、冻结动作/回执及错误恢复比普通插件更重。首次要分解任务/写ownership和验收，持续有并行模型/工具资源、数据库和工件存储、人类审批及handoff复核；失败时尤其要先对账实际child和receipt，不能简单重试。暂停编排/撤下插件不等于终止既有child，退出须按宿主实际机制检查活动任务并保留DB/工件。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/verification.py:17-18](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/verification.py#L17-L18)

验证类型枚举。

```text
VERIFICATION_KINDS = frozenset({"command", "artifact", "workspace", "human", "pack"})

```

**依据 2 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/verification.py:43-104](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/verification.py#L43-L104)

spec约束、command与其他类型分离。

<details>
<summary>查看原文（62行）</summary>

```text

    ``command`` is the only procedure that invokes a subprocess.  ``artifact``
    and ``workspace`` are observable collector checks, ``human`` explicitly
    requests manual evidence, and ``pack`` is a declarative Pack assertion.
    """

    id: str
    kind: str
    satisfies: tuple[str, ...] = ()
    command: str | tuple[str, ...] | None = None
    timeout_seconds: float | None = None
    artifact_ref: str | None = None
    assertion: str | None = None
    details: Mapping[str, Any] = field(default_factory=dict)
    source: str | None = None
    provenance: Mapping[str, Any] = field(default_factory=dict)
    trust: Mapping[str, Any] = field(default_factory=dict)
    approval: Mapping[str, Any] = field(default_factory=dict)
    execution: Mapping[str, Any] = field(default_factory=dict)

    def __post_init__(self) -> None:
        identifier = str(self.id).strip()
        if not identifier:
            raise VerificationSpecError("verification spec id must be non-empty")
        object.__setattr__(self, "id", identifier)
        kind = str(self.kind).strip().lower()
        if kind not in VERIFICATION_KINDS:
            raise VerificationSpecError(f"unsupported verification kind: {kind!r}")
        object.__setattr__(self, "kind", kind)
        object.__setattr__(self, "satisfies", _strings(self.satisfies, "verification spec satisfies"))
        if self.command is not None:
            if isinstance(self.command, str):
                command: str | tuple[str, ...] = self.command.strip()
                if not command:
                    raise VerificationSpecError("verification command must be non-empty")
            elif isinstance(self.command, Sequence) and not isinstance(self.command, (bytes, bytearray)):
                command = _strings(self.command, "verification command", required=True)
            else:
                raise VerificationSpecError("verification command must be a string or sequence")
            object.__setattr__(self, "command", command)
        if kind == "command" and self.command is None:
            raise VerificationSpecError("command verification requires command")
        if kind != "command" and self.command is not None:
            raise VerificationSpecError(f"{kind} verification cannot declare command")
        if self.timeout_seconds is not None:
            if isinstance(self.timeout_seconds, bool) or not isinstance(self.timeout_seconds, (int, float)) or not 0 < float(self.timeout_seconds) <= 900:
                raise VerificationSpecError("timeout_seconds must be between 0 and 900")
            object.__setattr__(self, "timeout_seconds", float(self.timeout_seconds))
        if self.artifact_ref is not None:
            ref = str(self.artifact_ref).strip()
            if not ref:
                raise VerificationSpecError("artifact_ref must be non-empty")
            object.__setattr__(self, "artifact_ref", ref)
        if kind == "artifact" and self.artifact_ref is None:
            raise VerificationSpecError("artifact verification requires artifact_ref")
        if self.assertion is not None:
            assertion = str(self.assertion).strip()
            if not assertion:
                raise VerificationSpecError("assertion must be non-empty")
            object.__setattr__(self, "assertion", assertion)
        if kind == "pack" and self.assertion is None:
            raise VerificationSpecError("pack verification requires assertion")
```

</details>

**依据 3 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/evidence.py:190-242](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/evidence.py#L190-L242)

trust门与真实subprocess调用接线。

<details>
<summary>查看原文（53行）</summary>

```text
            if callable(runner):
                raise ValueError(
                    "direct callable checks are disabled; use an executable command with timeout_seconds"
                )
            elif command_value:
                command = normalize_command(command_value)
                decision = self.trust_evaluator.evaluate(
                    command,
                    provenance=value.get("provenance"),
                    trust=value.get("trust"),
                    approval=value.get("approval"),
                    execution=execution,
                    cwd=value.get("cwd") or execution.get("cwd") or (scope or {}).get("worktree") or self.cwd,
                    workspace=(scope or {}).get("worktree") or execution.get("workspace") or self.cwd,
                )
                trust = decision.to_dict()
                details["trust"] = trust
                if not decision.executable:
                    status = "approval_required" if decision.approval_required else "failed"
                    details.update({
                        "error": decision.reason,
                        "error_code": "VERIFICATION_DECISION_REQUIRED" if decision.approval_required else "COMMAND_TRUST_DENIED",
                    })
                    command = decision.command
                else:
                    cwd = decision.cwd or value.get("cwd") or execution.get("cwd") or (scope or {}).get("worktree") or self.cwd
                    env_allowlist = decision.env_allowlist
                    env = allowed_environment(env_allowlist) if env_allowlist else None
                    if env is not None:
                        # Python and platform launchers need these two values
                        # even when a caller supplied a narrow allowlist.
                        for key in ("SystemRoot", "WINDIR"):
                            if key in os.environ and key not in env and key in env_allowlist:
                                env[key] = os.environ[key]
                    completed = subprocess.run(
                        list(command),
                        cwd=str(cwd or "") or None,
                        env=env,
                        capture_output=True,
                        text=True,
                        check=False,
                        shell=False,
                        timeout=decision.timeout_seconds or timeout_seconds,
                    )
                    exit_code = int(completed.returncode)
                    stdout = str(completed.stdout or "")[: self.output_limit_bytes]
                    stderr = str(completed.stderr or "")[: self.output_limit_bytes]
                    status = "pass" if exit_code == 0 else "fail"
            else:
                details["error"] = "check has no executable command or runner"
                command = f"unexecuted:{name}"
        except subprocess.TimeoutExpired as exc:
            stdout = str(exc.stdout or "")
```

</details>

**依据 4 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/evidence.py:435-475](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/evidence.py#L435-L475)

证据覆盖done_when与未满足错误。

<details>
<summary>查看原文（41行）</summary>

```text
        # receipts.  Keep those separate from VerificationSpecs: they are
        # observed results, never executable procedures or contract changes.
        for item in result_receipts or ():
            value = dict(item)
            if self._valid_check(value):
                check_receipts.append(value)
            else:
                errors.append("work_result_receipt_not_verified")
        automatable_specs = tuple(spec for spec in active_specs if spec.kind in {"command", "artifact", "workspace"})
        # Absence of an automatable procedure is not itself a human approval
        # request.  Only an explicit ``human`` contract spec creates that
        # boundary; uncovered done_when conditions remain unresolved below.
        manual_evidence_required = any(spec.kind == "human" for spec in active_specs)
        if manual_evidence_required:
            errors.append("manual_evidence_required")
        decision_required = any(
            str(spec.trust.get("state") or "approval_required") != "trusted"
            for spec in active_specs
            if spec.kind == "command"
        ) or any(item.get("status") == "approval_required" for item in check_receipts if isinstance(item, Mapping))
        if decision_required:
            errors.append("verification_decision_required")
        if selected.checks_required and automatable_specs and (not check_receipts or any(not self._valid_check(item) for item in check_receipts)):
            errors.append("checks_not_verified")

        done_evidence = []
        for condition in done_conditions:
            matching = [item for item in check_receipts if condition in {str(name) for name in item.get("satisfies", ())}]
            satisfied = bool(matching) and all(self._valid_check(item) for item in matching)
            done_evidence.append({"condition": condition, "satisfied": satisfied, "source_receipts": [item.get("receipt_id") for item in matching]})
            if not satisfied:
                errors.append(f"done_when:{condition}")

        artifact_values = list(artifacts if artifacts is not None else handoff_value.get("artifacts") or ())
        export_values = list(exports if exports is not None else handoff_value.get("exports") or ())
        artifact_refs = self._verified_artifacts(artifact_values, errors)
        artifact_refs = sorted(set(artifact_refs) | {
            str(ref)
            for item in check_receipts
            for ref in (item.get("stdout_artifact_ref"), item.get("stderr_artifact_ref"))
            if ref
```

</details>

**依据 5 · 作者声明**：[plugins/deepseek-harness/README.md:15-44](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/deepseek-harness/README.md#L15-L44)

作者提供专用profile、runtime和初始化边界。

<details>
<summary>查看原文（30行）</summary>

````text
## Installation

Install the All in Luna CLI, then let the published package create and resolve
a dedicated DSH profile:

```powershell
python -m pip install "allinluna==2.0.0rc7"
npx @zenx0x/allinflash@0.2.0 init --profile allinflash
dsh --profile allinflash
```

The initializer verifies the `allinluna` command, creates an idempotent managed
profile, enables the All in Flash bundle, writes its Cordis configuration, and
runs the DSH profile package installation. It refuses to overwrite an unmanaged
profile unless `--force` is explicit.

Check an installation without starting the server:

```powershell
npx @zenx0x/allinflash@0.2.0 doctor --profile allinflash
```

`allinflash` is a new user-owned profile. It does not modify the DSH-shipped
`standard`, `code`, `minimal`, or `cordis` presets.

Use `--db`, `--cwd`, `--model`, or `--runtime-command` with `init` when the
defaults do not match the deployment. Repository contributors can instead run
`python scripts/install_allinflash_profile.py --force`; that development path
uses `uv run allinluna` and the checkout's `runtime.db`.

````

</details>

**依据 6 · 源码核查**：[plugins/deepseek-harness/index.js:26-35](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/deepseek-harness/index.js#L26-L35)

外部CLI路径、cwd/db和超时配置。

<details>
<summary>查看原文（10行）</summary>

```text

function commandConfig(config = {}) {
  const command = nonEmpty(config.command ?? 'allinluna', 'command')
  const commandArgs = Array.isArray(config.commandArgs) ? config.commandArgs.map(String) : []
  const db = typeof config.db === 'string' && config.db.trim() ? config.db.trim() : undefined
  const cwd = typeof config.cwd === 'string' && config.cwd.trim() ? config.cwd.trim() : undefined
  const timeoutMs = Number.isSafeInteger(config.timeoutMs) && config.timeoutMs > 0
    ? config.timeoutMs
    : 30000
  return { command, commandArgs, db, cwd, timeoutMs }
```

</details>

#### 缺口

- 安装、实际命令信任策略、业务合同充分性与总token/人工成本尚未执行测量。
  **影响**：不能宣称低配置、高可靠或节省模型费用；不宜直接调度生产变更。
  **进一步探讨**：固定小型副本任务写独立验收，测信任拒绝/人工覆盖、费用、交接与退出活动child状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前谁应观察，能验证怎样的改进？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前建议观察，尤其DSH用户先处理next_actions/preview合同冲突，再谈以文档默认路径试用。熟悉任务分解和宿主运行时的维护者可准备双Task副本用例：一个独立工作、一个依赖已验证export，固定DB/模型/权限，显式ownership与验收，比较普通单会话子Agent方案。只以真实工件、检查和回执为完成证据；日志中有action/hash不代表物理效果已提交。

最值得验证的改进是对DSH relay建立带状态的派发协议：消费已持久化的完整动作，在创建前以dispatch键查询/认领，创建后立即把观察到的child身份落库；中间失败进入unknown/reconcile而非盲重放，且核对provider是否支持同键创建或按child查找。依据来自先创建后入库的实际间隙与CLI preview错配，不能靠加一个hash把外部副作用原子化。现有SQLite outbox和receipt去重是基础，但不等于物理创建阶段已有这个保证。

最小验证在创建前、创建后未入库、入库后未响应三个点中断，重复提交同一dispatch，统计实际child数、被接管身份、unknown数与恢复人工步骤；只要任一场景遗留无法解释的活动child就否定“可安全盲重试”。另测next_actions返回是否明确拒relay/有可持久dispatch入口。若修复后大目标验收质量没有改善或协调成本超过单会话方案，就停止并回原宿主任务组织，保留DB/工件审计，明确处置活动child。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/deepseek-harness/index.js:208-251](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/deepseek-harness/index.js#L208-L251)

物理创建与入库间隙是改进推导依据。

<details>
<summary>查看原文（44行）</summary>

```text
    async execute(args, exec) {
      const action = parseRelayAction(args.action_json)
      if (!exec.agent) throw new Error('allinflash_relay_action requires a calling DSH agent')
      const provider = typeof config.subagentProvider === 'string' && config.subagentProvider.trim()
        ? config.subagentProvider.trim()
        : 'spawn'
      const accepted = await ctx.subagents.startContinuable({
        provider,
        label: action.arguments.title,
        request: {
          label: action.arguments.title,
          prompt: [{ type: 'text', text: action.arguments.prompt }],
          parent: exec.agent,
        },
        signal: exec.signal,
      })
      const runId = String(action.payload?.task_envelope?.run_ref ?? '').replace('run://', '')
      if (!runId) throw new Error('action payload does not contain a durable run reference')
      const receipt = {
        receipt_id: `allinflash-receipt-${action.action_id}`,
        status: 'ready',
        source: 'deepseek-harness',
        host_adapter: 'deepseek-harness',
        host_id: typeof config.hostId === 'string' && config.hostId.trim() ? config.hostId.trim() : 'allinflash-dsh',
        thread_id: accepted.childId,
        action_id: action.action_id,
        action_kind: action.kind,
        idempotency_key: action.idempotency_key,
        dispatch_key: action.idempotency_key,
        dispatch_id: action.dispatch_id,
        task_id: action.task_id,
        actual: true,
        actual_tool: CREATE_TOP_LEVEL_TASK_TOOL,
        actual_capability: CREATE_TOP_LEVEL_TASK_TOOL,
        action_contract_hash: action.action_contract_hash,
        payload: { provider, child_id: accepted.childId },
      }
      const ingested = await invoke(config, ['ingest-receipt', runId, JSON.stringify(receipt)])
      if (!ingested.ok) throw new Error(`failed to ingest All in Flash receipt: ${ingested.stderr || ingested.resultJson}`)
      return { childId: accepted.childId, receiptJson: JSON.stringify(receipt) }
    },
    presentCall: (args) => present('Relay All in Flash task', args),
  }))
}
```

</details>

**依据 2 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/cli.py:452-469](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/cli.py#L452-L469)

只读preview和dispatch明确分开。

<details>
<summary>查看原文（18行）</summary>

```text
        elif args.command in {"preview-actions", "next-actions"}:
            # Preview is the scheduler's read-only path.  Calling Coordinator
            # tick here used to make this observational command look like a
            # scheduling step and could create leases/attempts on regressions.
            result = {
                "run_id": args.run_id,
                "relayable": False,
                "actions": [
                    _preview_summary(action)
                    for action in engine.scheduler.preview(args.run_id)
                ],
            }
            if args.command == "next-actions":
                result["deprecated"] = "next-actions is an alias for preview-actions; use dispatch or drive to relay"
        elif args.command == "dispatch":
            tick = engine.tick(args.run_id, dispatch=True)
            result = {"run_id": args.run_id, "actions": list(tick.actions), "receipts": list(tick.receipts), "status": tick.status}
        elif args.command == "drive":
```

</details>

**依据 3 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/store_dispatch.py:397-407](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/store_dispatch.py#L397-L407)

现有回执去重不是创建前认领。

<details>
<summary>查看原文（11行）</summary>

```text
        def ingest() -> dict[str, Any]:
            nonlocal requested_model, requested_reasoning, resolved_model, resolved_reasoning
            nonlocal actual_model, actual_reasoning, resource_state, evidence_source, resource_observed_at, payload
            existing = self._fetchone("SELECT * FROM host_receipts WHERE id = ?", (receipt_id,))
            if existing is None and dispatch_key:
                existing = self._fetchone(
                    "SELECT * FROM host_receipts WHERE host_adapter = ? AND dispatch_key = ?",
                    (adapter, str(dispatch_key)),
                )
            if existing is None:
                try:
```

</details>

**依据 4 · 源码核查**：[plugins/allinluna/runtime/allinluna_runtime/scheduler/global_scheduler.py:743-749](https://github.com/zenx0x/allinluna/blob/b471713089d8352c1c97e05fe3d25907a4164b1a/plugins/allinluna/runtime/allinluna_runtime/scheduler/global_scheduler.py#L743-L749)

持久意图/outbox是可利用的现有基础。

```text
            self.store.persist_dispatch_intent(action, adapter=self.adapter, host_id=action.host_id)
            selected.append(task_id)
            actions.append(action)
        pending = self._pending_actions(run_id)
        known = {action.idempotency_key for action in actions}
        actions.extend(action for action in pending if action.idempotency_key not in known)
        self.last_decision = SchedulerDecision(run_id, tuple(str(item["id"]) for item in ready), tuple(selected), tuple(actions), tuple(str(item["id"]) for item in tasks if str(item["state"]) == "blocked"), ())
```

#### 缺口

- provider能否按幂等键创建/查询，以及修复后协调收益未知。
  **影响**：不能把建议协议描述成现有无重复派发，当前不具默认试用闭环。
  **进一步探讨**：先验证物理API能力再实现/故障注入，若不能重识别创建结果，保留unknown并要求人工核查。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
