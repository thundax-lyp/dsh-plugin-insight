# Adult Tension

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[e30bef4](https://github.com/daha1216/dsh-adult-tension/tree/e30bef40688d5da1cd8d9afecf98c4ec21385bfb)

<!-- BEGIN META -->
[![GitHub ★ 484](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=484&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/daha1216/dsh-adult-tension)
<!-- END META -->

> **功能**：面向成年人的中文互动叙事 Skill，用本地 Python 运行时管理剧情状态、时间、边界与存档。

> **亮点**：把会话状态从纯文本中分离，在写事务绑定幂等记录和修订检查，令已提交的进度可单独核对。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：普通回合会先展示正文后批量落盘；退出时可能只保留已提交状态。诊断日志和模型传输也有独立的数据路径。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 长篇互动叙事如何把存档从对话上下文中分离？](#detail-section-11)
  - [Q02 · 重试和陈旧会话怎么处理，正文是否即时持久化？](#detail-section-12)
  - [Q03 · 试用和退出有哪些数据及运行条件？](#detail-section-13)
  - [Q04 · 加入状态引擎是否减少跨会话的可复现矛盾？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望跨会话续写互动故事的成年用户，可以重新读取引擎保存的已提交状态。

参照只靠宿主聊天历史和手工摘要的叙事流程。短会话或无需恢复结构化状态时，额外引擎的价值有限。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| JSON CLI | 操作状态与读取回执 | 需宿主及 Python |
| 幂等与修订 | 区分重复和陈旧写入 | 只覆盖已提交操作 |
| 会话存档 | 重新读取结构化进度 | 普通回合可能尚未刷新 |

**流程与依赖**

| 依赖 | 用途 | 条件 |
| --- | --- | --- |
| 支持 Agent Skill 的宿主 | 编排文本和命令 | 需本地命令权限 |
| Python 3.10+ | 执行 CLI 和持久化 | 实际解释器待核对 |
| 独立数据目录 | 保存状态 | 与 Skill 安装目录分离 |

| 步骤 | 操作 | 退出 |
| --- | --- | --- |
| 准备 | 隔离项目与合成文本 | 保留数据位置记录 |
| 恢复测试 | 保存、退出再重开 | 核对最后确认修订 |
| 退出 | 移除 Skill、独立处理数据 | 留意 trace 与宿主历史 |

**效果与成本**

| 阶段 | 主要负担 | 计量 |
| --- | --- | --- |
| 首次 | 配置宿主与解释器 | 记录实际设置时间 |
| 持续 | 模型费用与提交核对 | 现金与人工分开 |
| 恢复 | 核对状态并回退 | 按一次成功重开计量 |

| 效果 | 判据 | 边界 |
| --- | --- | --- |
| 状态可核对 | 已提交修订及事件一致 | 未做真实宿主测试 |
| 减少重复推进 | 重复请求得到原回执 | 未验证宿主在故障时会重试同一输入 |

> **思考**：普通回合会先展示正文后批量落盘；退出时可能只保留已提交状态。诊断日志和模型传输也有独立的数据路径。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把会话状态从纯文本中分离，在写事务绑定幂等记录和修订检查，令已提交的进度可单独核对。见 [Q01](#research-q01)、[Q02](#research-q02)。

从 JSON 分发到事务处理有明确职责区分。去重与修订针对状态层，普通正文的提交节奏由宿主指令约束。

<a id="detail-section-5"></a>

### 1.4 主要限制

普通回合会先展示正文后批量落盘；退出时可能只保留已提交状态。诊断日志和模型传输也有独立的数据路径。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只用中性合成内容和隔离项目验证存档恢复。确认状态差异或诊断输出无法解释时，回到原会话摘要并独立清理数据。见 [Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核对固定 CLI、修订校验与回执写入。宿主遵循指令程度、非结构化正文表现和恢复收益待验证。

- 已检查：作者 README、包清单、源码路径 skill/adult-tension/SKILL.md、skill/adult-tension/runtime/adult_tension/adapters/cli.py、README.md、skill/adult-tension/runtime/adult_tension/application/service.py、RELEASE_NOTES.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查 Skill 启动协议、应用事务、CLI 和 trace。未逐个检查内容包、所有域校验或真实宿主输出，不生成故事正文。
- 下一步：用中性合成状态验证重复请求、陈旧修订、提交前后退出与 trace 开关。未执行目标代码。

**分析版本**

- **仓库**：[daha1216/dsh-adult-tension](https://github.com/daha1216/dsh-adult-tension)
- **版本号**：未声明（[固定提交 e30bef4](https://github.com/daha1216/dsh-adult-tension/tree/e30bef40688d5da1cd8d9afecf98c4ec21385bfb)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

分别在提交前后中断同一故事，比较纯摘要与状态引擎能否恢复最后确认的事件。见 [Q04](#research-q04)。

用中性合成状态验证重复请求、陈旧修订、提交前后退出与 trace 开关。未执行目标代码。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 22 | 5266 | — | — | 157590 |
| .md | test | 17 | 3137 | — | — | 56514 |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/daha1216/dsh-adult-tension/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/daha1216/dsh-adult-tension/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/daha1216/dsh-adult-tension/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：互动叙事 Skill 怎样把模型叙述与持久状态分开，哪些可恢复性与隐私边界仍需核验？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 长篇互动叙事如何把存档从对话上下文中分离？

**研究主题**：场景与需求、功能与机制、工程质量与复用

#### 完整回答

需要跨会话续写中文互动故事的成年用户，目标是重新打开一局时可核对当前时间、已提交事件和存档，而不依赖整段历史聊天。交付形式是 Agent Skill，附带 Python 运行时和编译内容包。宿主负责解释输入并生成文本，Skill 指示用 stdin 或 UTF-8 JSON 文件调用，携带会话标识、请求标识和期望修订。CLI 解析命令并将 JSON 分发给对应处理器；应用服务再落盘或回传错误。较普通长对话提示，增加可重新读取的权威状态，但提示调用、权限弹窗和输出效果都依赖宿主。运行时不是对全部模型输出逐字执行的过滤器，本次只研究非露骨场景下的状态管理机制。

#### 证据与依据

**依据 1 · 源码核查**：[skill/adult-tension/SKILL.md:23-38](https://github.com/daha1216/dsh-adult-tension/blob/e30bef40688d5da1cd8d9afecf98c4ec21385bfb/skill/adult-tension/SKILL.md#L23-L38)

宿主调用协议与失败路径

<details>
<summary>查看原文（16行）</summary>

````text
bash/zsh 里一次调用，输入接在命令后面（`AT_JSON` 顶格单独成行）：

```bash
<python> <本 Skill 目录>/scripts/adult_tension.py <command> --json --input-file - <<'AT_JSON'
{"encoding_check": "汉字", ……其余输入}
AT_JSON
```

- `<python>`：依次试 `python3`、`python`、`py -3`，用第一个 3.10 及以上的。
- 调用是游戏自己的存取，宿主“运行命令前先解释”的要求不适用：调用前后不写解说（中英文都不写），写了会原样显示给玩家；正文之后记录的，调用后不再写字。
- 每个输入都带 `"encoding_check": "汉字"`。**玩家的原话只在 JSON 里，永远不放进命令行参数。**
- shell 报错、宿主拒绝这种写法（PowerShell、cmd），或因 `encoding_check` 被拒：本对话改用文件，输入写成 UTF-8 JSON 文件放进 `doctor` 的 `input_dir`（不放本 Skill 目录），用 `--input-file <文件>` 传入。JSON 写错（如字符串里有换行）只改 JSON 重交。
- stdout 是一个 JSON：`{"ok", "data", "error"}`。
- 会话内的命令都带 `session_id`。写操作带 `request_id`（上次返回的 `next_request_id`），会话内的写操作再带 `expected_revision`（上次返回的 `revision`）；读命令不带这两个。字段拿不准或被拒再查 `references/commands.md`，不用 `--help`，不读运行时源码与数据库。
- 超时、没有输出、输出不是 JSON：用**同一个** `request_id` 重试，最多 3 次，仍失败就运行 `doctor`，一句话告诉玩家。
- `IDEMPOTENCY_CONFLICT`（这个 `request_id` 用过了）：先 `get-context` 看上一次是否生效，再决定是否换新 `request_id` 补交。
````

</details>

**依据 2 · 源码核查**：[skill/adult-tension/runtime/adult_tension/adapters/cli.py:221-248](https://github.com/daha1216/dsh-adult-tension/blob/e30bef40688d5da1cd8d9afecf98c4ec21385bfb/skill/adult-tension/runtime/adult_tension/adapters/cli.py#L221-L248)

真实参数处理及调用分发

<details>
<summary>查看原文（28行）</summary>

```text
def execute(argv, skill_root, stdin=None, environ=None):
    """Run one command; return (envelope, exit code, options, text, payload). Never raises.

    The envelope is serialized here, inside the error handling: a result that
    cannot be written as JSON is an INTERNAL_ERROR envelope, never a crash
    with nothing on stdout.
    """
    from ..application.context import Context

    stdin = stdin if stdin is not None else getattr(sys.stdin, "buffer", sys.stdin)
    environ = os.environ if environ is None else environ
    ctx = None
    options = {}
    payload = None
    try:
        command, options, flags = parse_argv(argv)
        payload = merge_flags(read_payload(command, options, stdin), flags)
        if command.input == "none":
            _normalized, errors = schema.validate(schema.EMPTY, payload)
            if errors:
                raise AppError(INVALID_INPUT, "命令 %s 不接受这些输入" % command.name, errors)
        ctx = Context(skill_root, options.get("data_dir"), environ, flags, options.get("debug", False))
        if environ.get("ADULT_TENSION_FAULT") == "internal_error":
            raise RuntimeError("injected internal error")  # test hook: exercises the INTERNAL_ERROR path
        module = __import__(command.module, fromlist=[command.func])
        # the command works on its own copy (an import upgrades an old state in
        # place); the trace records the input as it was given
        data = getattr(module, command.func)(ctx, copy(payload))
```

</details>

**依据 3 · 作者声明**：[README.md:208-221](https://github.com/daha1216/dsh-adult-tension/blob/e30bef40688d5da1cd8d9afecf98c4ec21385bfb/README.md#L208-L221)

交付和 SQLite 状态说明

<details>
<summary>查看原文（14行）</summary>

````text
<summary><b>开发者</b></summary>
<br>

```
skill/adult-tension/     可安装的 Skill：SKILL.md、references/、runtime/、编译好的世界包
content-src/worlds/      世界包源文件
tools/                   编译、校验、开局预览、模拟、基准测试
tests/                   core · content · integration · e2e
reports/                 试玩记录、评审、基准与验收证据
spec/                    需求规范
PROGRESS.md              进度、实际数字、待决事项
```

运行时只用 Python 标准库；SQLite 是唯一的状态存储，只有一个写入口。每个写操作都带 `request_id`，会话内的还带 `expected_revision`，重试不会重复推进。
````

</details>

#### 缺口

- 未在真实 DSH 运行固定版
  **影响**：宿主能否稳定加载 Skill、执行 CLI 和续写未知
  **进一步探讨**：用中性合成测试故事验证开始、读状态和退出后重载

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 重试和陈旧会话怎么处理，正文是否即时持久化？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

应用事务先按会话与 request_id 查找旧结果。输入一致则复用回执，输入变化则报告幂等冲突；命中前次回执不需要把状态重复推进。新操作先比较 expected_revision，过期则返回当前上下文，不能直接改修订号重放。成功时会话操作和幂等记录在同次事务提交，异常回滚。相对模型自行保留摘要，这对已提交状态有可追溯增量。另一方面，Skill 对普通回合明确规定先展示正文，攒到十个回合才提交，时间临界与存档等操作需提前刷新。若宿主中途退出，未提交正文可能仍在对话里而缺少数据库状态。故不能把幂等与事务等同于每段文字都持久化，也不能把运行时拒绝状态写入等同于屏蔽模型已显示的文字。

#### 证据与依据

**依据 1 · 源码核查**：[skill/adult-tension/runtime/adult_tension/application/service.py:78-125](https://github.com/daha1216/dsh-adult-tension/blob/e30bef40688d5da1cd8d9afecf98c4ec21385bfb/skill/adult-tension/runtime/adult_tension/application/service.py#L78-L125)

请求重放、修订、存储和提交

<details>
<summary>查看原文（48行）</summary>

```text
def _replay(conn, scope, request_id, digest):
    cached = repo.idem_get(conn, scope, request_id)
    if cached is None:
        return None
    if cached["digest"] != digest:
        raise AppError(
            IDEMPOTENCY_CONFLICT,
            "request_id %s 已经用于另一个请求" % request_id,
            [detail("$.request_id", "同一个 request_id 带了不同的内容", "先 get-context 确认上一次是否已经生效，再决定是否用新的 request_id 补交；不能把同一回合写两次", IDEMPOTENCY_CONFLICT)],
        )
    response = cached["response"]
    response["replayed"] = True
    return response


def save_info(session):
    return {"current_slot": session["current_slot"], "turns_since_save": session["turns_since_save"]}


def session_write(ctx, command, payload, handler):
    """Run a session-scoped write. handler(conn, session, now) -> response dict."""
    conn = ctx.db()
    digest = digest_of(command, payload)
    db.begin_write(conn)
    try:
        replay = _replay(conn, payload["session_id"], payload["request_id"], digest)
        if replay is not None:
            conn.execute("COMMIT")
            return replay
        session = repo.load_session(conn, payload["session_id"])
        if session["revision"] != payload["expected_revision"]:
            raise AppError(
                STALE_REVISION,
                "局面已经变了：当前 revision 是 %d，不是 %d" % (session["revision"], payload["expected_revision"]),
                [detail("$.expected_revision", "revision 已过期", "基于附带的新上下文重新判断后再提交；不要只换 revision 重放旧操作", STALE_REVISION)],
                current_revision=session["revision"],
                context=CX.brief(session["state"], session["content"], save_info(session)),
            )
        now = now_iso()
        response = handler(conn, session, now)
        response.setdefault("next_request_id", new_request_id())
        response["replayed"] = False
        repo.idem_put(conn, payload["session_id"], payload["request_id"], digest, response, now)
        conn.execute("COMMIT")
        return response
    except BaseException:
        if conn.in_transaction:
            conn.execute("ROLLBACK")
```

</details>

**依据 2 · 源码核查**：[skill/adult-tension/SKILL.md:67-71](https://github.com/daha1216/dsh-adult-tension/blob/e30bef40688d5da1cd8d9afecf98c4ec21385bfb/skill/adult-tension/SKILL.md#L67-L71)

批量提交与强制刷新点

```text
   - `continue`：空输入、“继续”、“……”、“你决定” → 场景推进，至少一个可观察的变化（NPC 行动、状态变化、新事实、有人来去）；玩家角色不说有意义的话、不移动、不同意任何事。
   - `wait`：玩家选择不动 → 给 NPC 行动空间。
3. **正文先行，攒着记录**：普通回合直接写正文，不调用运行时。攒满 10 个回合，在正文之后用一次 `commit-turn` 记录（`turns` 每回合一项，按顺序，≤ 12 项）。先记录（攒下的连同这一回合）再按返回写正文的情况：时间会到达或越过最早的待办事件（`due_soon` 第一项，或攒着的回合里登记的；记录前正文不越过它）或跨过午夜；一次推进 ≥ 60 分钟；要 `roll`；快进、接受转折、存档、读档、状态、导出、暂停、边界、偏好设置之前；玩家说先到这、下次再玩。
4. 照最近返回的 `commit_template` 写，每个回合复制一份 `turns` 里那一项（尖括号处写内容，`a|b` 选一个，用不上的操作删掉）；没有模板时照 `references/operations.md` 写。
   - `player_authorized: true` 只在玩家本人的话授权了玩家角色的移动、承诺、交易、同意、转折或设定修改时。
```

#### 缺口

- 未注入崩溃、重复提交和两个窗口的冲突
  **影响**：无法确认端到端恢复及用户看到的提示
  **进一步探讨**：用同一回合重复请求并制造陈旧修订，再在普通批次提交前终止宿主核对状态差异

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 试用和退出有哪些数据及运行条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

要求能加载项目级 Skill、可运行本地命令的宿主和 Python 3.10 以上。作者说明存档位于 Skill 之外，移除 Skill 不能当作删除存档。CLI 若显式设置 ADULT_TENSION_TRACE，会将输入和输出回执写入追踪文件，故测试用合成文本并避免开启 trace；宿主如何向外部模型传输输入也须单独核对。首次成本是配置宿主与 Python、创建隔离目录；持续成本是模型调用与回合状态核对；失败时先核对上下文，找出最后成功的修订，再选择恢复或退出。只适合作为独立测试方案，不应用隐私文本验证。计量单位为一次可重开的存档，模型费用与排障人时分开。本次没有清除、迁移或导出任何存档。

#### 证据与依据

**依据 1 · 作者声明**：[RELEASE_NOTES.md:7-19](https://github.com/daha1216/dsh-adult-tension/blob/e30bef40688d5da1cd8d9afecf98c4ec21385bfb/RELEASE_NOTES.md#L7-L19)

草稿声明版本及宿主、Python 前提

<details>
<summary>查看原文（13行）</summary>

```text
- Skill 版本：`0.3.0`；数据库格式：4；状态格式：2。
- 内容：211 个世界（内容版本 2026.10.29），说“世界列表”查看；另可自定义世界，说“保存世界 名字”存下来以后再玩。

## 需要什么

- Python 3.10 或更高（只用标准库；不需要 `pip install`）。宿主会依次试 `python3`、`python`、`py -3`。
- 一个能加载 Agent Skill 的宿主，或只有命令行的环境。

用户不需要编辑环境变量、不需要创建数据库、不需要复制世界包。

## 安装

安装 = 把整个 `adult-tension/` 目录放进宿主的 Skill 搜索路径。Git 克隆、压缩包解压或宿主的安装命令，结果都是同一个目录。
```

</details>

**依据 2 · 作者声明**：[README.md:181-189](https://github.com/daha1216/dsh-adult-tension/blob/e30bef40688d5da1cd8d9afecf98c4ec21385bfb/README.md#L181-L189)

作者说明存档独立于 Skill

```text
<details>
<summary><b>存档在哪里，升级会不会丢</b></summary>
<br>

存档永远不放在 Skill 目录里，升级、卸载都不会动它。

| 系统 | 数据目录 |
|---|---|
| Windows | `%LOCALAPPDATA%\adult-tension` |
```

**依据 3 · 源码核查**：[skill/adult-tension/runtime/adult_tension/adapters/cli.py:272-300](https://github.com/daha1216/dsh-adult-tension/blob/e30bef40688d5da1cd8d9afecf98c4ec21385bfb/skill/adult-tension/runtime/adult_tension/adapters/cli.py#L272-L300)

可选 trace 会保存输入和回执

<details>
<summary>查看原文（29行）</summary>

```text
def trace(path, argv, payload, code, text, started, skill_root):
    """Append one call to the evaluation trace. A trace that cannot be written
    does not fail the command (its answer is already on stdout); it is reported
    on stderr, so an evaluation sees the gap instead of counting fewer calls."""
    try:
        line = {
            "ts": time.strftime("%Y-%m-%dT%H:%M:%S"),
            "ms": round((time.perf_counter() - started) * 1000, 1),
            "pid": os.getpid(),
            "skill_root": skill_root,
            "argv": list(argv),
            "input": payload,
            "exit": code,
            "envelope": json.loads(text),
        }
        with open(path, "ab") as handle:
            handle.write((json.dumps(line, ensure_ascii=False) + "\n").encode("utf-8"))
    except (OSError, ValueError, TypeError) as exc:
        sys.stderr.write("adult-tension: ADULT_TENSION_TRACE not written: %s\n" % exc)


def run(argv, skill_root, stdin=None, stdout=None, environ=None):
    environ = os.environ if environ is None else environ
    started = time.perf_counter()
    _envelope, code, _options, text, payload = execute(argv, skill_root, stdin, environ)
    stdout = stdout if stdout is not None else getattr(sys.stdout, "buffer", sys.stdout)
    write_text(stdout, text)
    if environ.get("ADULT_TENSION_TRACE"):
        trace(environ["ADULT_TENSION_TRACE"], argv, payload, code, text, started, skill_root)
```

</details>

**依据 4 · 源码核查**：[skill/adult-tension/SKILL.md:33-38](https://github.com/daha1216/dsh-adult-tension/blob/e30bef40688d5da1cd8d9afecf98c4ec21385bfb/skill/adult-tension/SKILL.md#L33-L38)

失败和重试操作规范

```text
- 每个输入都带 `"encoding_check": "汉字"`。**玩家的原话只在 JSON 里，永远不放进命令行参数。**
- shell 报错、宿主拒绝这种写法（PowerShell、cmd），或因 `encoding_check` 被拒：本对话改用文件，输入写成 UTF-8 JSON 文件放进 `doctor` 的 `input_dir`（不放本 Skill 目录），用 `--input-file <文件>` 传入。JSON 写错（如字符串里有换行）只改 JSON 重交。
- stdout 是一个 JSON：`{"ok", "data", "error"}`。
- 会话内的命令都带 `session_id`。写操作带 `request_id`（上次返回的 `next_request_id`），会话内的写操作再带 `expected_revision`（上次返回的 `revision`）；读命令不带这两个。字段拿不准或被拒再查 `references/commands.md`，不用 `--help`，不读运行时源码与数据库。
- 超时、没有输出、输出不是 JSON：用**同一个** `request_id` 重试，最多 3 次，仍失败就运行 `doctor`，一句话告诉玩家。
- `IDEMPOTENCY_CONFLICT`（这个 `request_id` 用过了）：先 `get-context` 看上一次是否生效，再决定是否换新 `request_id` 补交。
```

#### 缺口

- 没有宿主数据流实测或移除演练
  **影响**：不能承诺所有文本始终只落本地或卸载后无痕
  **进一步探讨**：用隔离项目核对模型请求和落盘位置，并独立清理测试数据

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 加入状态引擎是否减少跨会话的可复现矛盾？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是将时钟、已提交事件和存档放在外置状态层，能降低重开时的状态矛盾，但批量未提交仍是丢失窗口。用同一模型、同一非露骨虚构情境和相同轮次，比较普通对话摘要与 Skill。分别在普通批次中途和已收到提交回执后终止，重开后记录是否恢复最后确认的状态、是否出现重复推进、额外调用、人工恢复时长。若已提交恢复一致性没有改善，或批量丢失与修复的代价抵消收益，就继续采用原宿主的手工摘要。该对照方案不是仓库已有结果。

#### 证据与依据

**依据 1 · 源码核查**：[skill/adult-tension/runtime/adult_tension/application/service.py:97-124](https://github.com/daha1216/dsh-adult-tension/blob/e30bef40688d5da1cd8d9afecf98c4ec21385bfb/skill/adult-tension/runtime/adult_tension/application/service.py#L97-L124)

提交及回放可作为恢复基准

<details>
<summary>查看原文（28行）</summary>

```text
def session_write(ctx, command, payload, handler):
    """Run a session-scoped write. handler(conn, session, now) -> response dict."""
    conn = ctx.db()
    digest = digest_of(command, payload)
    db.begin_write(conn)
    try:
        replay = _replay(conn, payload["session_id"], payload["request_id"], digest)
        if replay is not None:
            conn.execute("COMMIT")
            return replay
        session = repo.load_session(conn, payload["session_id"])
        if session["revision"] != payload["expected_revision"]:
            raise AppError(
                STALE_REVISION,
                "局面已经变了：当前 revision 是 %d，不是 %d" % (session["revision"], payload["expected_revision"]),
                [detail("$.expected_revision", "revision 已过期", "基于附带的新上下文重新判断后再提交；不要只换 revision 重放旧操作", STALE_REVISION)],
                current_revision=session["revision"],
                context=CX.brief(session["state"], session["content"], save_info(session)),
            )
        now = now_iso()
        response = handler(conn, session, now)
        response.setdefault("next_request_id", new_request_id())
        response["replayed"] = False
        repo.idem_put(conn, payload["session_id"], payload["request_id"], digest, response, now)
        conn.execute("COMMIT")
        return response
    except BaseException:
        if conn.in_transaction:
```

</details>

**依据 2 · 源码核查**：[skill/adult-tension/SKILL.md:67-70](https://github.com/daha1216/dsh-adult-tension/blob/e30bef40688d5da1cd8d9afecf98c4ec21385bfb/skill/adult-tension/SKILL.md#L67-L70)

批次和刷新界点可做实验分层

```text
   - `continue`：空输入、“继续”、“……”、“你决定” → 场景推进，至少一个可观察的变化（NPC 行动、状态变化、新事实、有人来去）；玩家角色不说有意义的话、不移动、不同意任何事。
   - `wait`：玩家选择不动 → 给 NPC 行动空间。
3. **正文先行，攒着记录**：普通回合直接写正文，不调用运行时。攒满 10 个回合，在正文之后用一次 `commit-turn` 记录（`turns` 每回合一项，按顺序，≤ 12 项）。先记录（攒下的连同这一回合）再按返回写正文的情况：时间会到达或越过最早的待办事件（`due_soon` 第一项，或攒着的回合里登记的；记录前正文不越过它）或跨过午夜；一次推进 ≥ 60 分钟；要 `roll`；快进、接受转折、存档、读档、状态、导出、暂停、边界、偏好设置之前；玩家说先到这、下次再玩。
4. 照最近返回的 `commit_template` 写，每个回合复制一份 `turns` 里那一项（尖括号处写内容，`a|b` 选一个，用不上的操作删掉）；没有模板时照 `references/operations.md` 写。
```

#### 缺口

- 未做同模型的对照
  **影响**：不能量化恢复质量或回合成本
  **进一步探讨**：记录回执及重启前后的结构化状态，按相同标准盲比

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
