# Adult Tension

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[d0bce1e](https://github.com/daha1216/dsh-adult-tension/tree/d0bce1e6694362e649cd0528f0338ce8ddc7be70)

<!-- BEGIN META -->
[![GitHub ★ 408](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=408&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/daha1216/dsh-adult-tension)
<!-- END META -->

> **功能**：把中文互动叙事交给宿主模型，并以本地 Python 引擎维护角色、时间、事实、事件与存档的 Skill。

> **亮点**：写作与状态维护分责，版本/幂等和working copy使记录有明确结构约束，见 [Q02](#research-q02)。

> **主要限制**：正文可先行积攒，拒绝可改记录不改正文；授权/回应/tag仍由模型提交，成功记录不能证明可见故事符合结构与玩家意图，见 [Q02](#research-q02)。

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
  - [Q01 · 是叙事提示词还是实际本地状态引擎，谁负责什么？](#detail-section-11)
  - [Q02 · 事务和安全校验究竟覆盖什么，正文与记录一致吗？](#detail-section-12)
  - [Q03 · 作者测试支持到哪里，什么条件下试用与继续开发？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：中文互动叙事玩家希望跨回合保留角色/时间/事件，模型写作、引擎管结构状态，见 [Q01](#research-q01)。

纯聊天角色扮演+人工摘要/存档。当前引擎增加可查询、重试、版本检查和操作校验，不自动核正文全部语义。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Skill/CLI | 叙事模型与状态引擎协作 | 宿主shell与Python |
| 状态提交 | 角色/事实/事件保存 | 版本/幂等/事务非文本质量证明 |
| 边界 | 登记tag和暂停检查 | 模型结构输入，不代验正文 |
| 存档 | 本地持久恢复 | 数据目录需备份与隔离 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Skill发现及shell/文件权限 | 必需 | 模型调用CLI | 纯提示不能维护结构 |
| Python>=3.10/SQLite | 必需 | 本地状态引擎 | launcher拒旧版，不自行装环境 |
| 可写独立数据目录 | 必需 | DB/备份/输入 | 保存失败需doctor；目录影响隔离 |
| 模型正确提操作/tag | 必需 | 正文映射结构 | 引擎无法代验文本语义 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 环境 | 宿主doctor和独立目录 | 不动用户已有Skill/数据 |
| 开局 | 玩家选择，模型调new-game | 结构context而非臆造 |
| 叙事 | 模型写作和提交操作 | 核正文-操作-状态一致 |
| 冲突 | 同ID重试/版本重判断 | 禁止只改revision重放 |
| 存退 | 用户备份/恢复/退出 | 数据与Skill分别处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型/Python环境未知 | Skill发现/数据隔离/开局核 | 无独立实装 |
| 持续使用 | token/CLI/DB空间未知 | 操作纠偏与长局管理 | 无净节时对照 |
| 失败恢复 | 重试/备份资源未知 | 同ID查询/doctor/恢复 | 数据不盲重写 |
| 退出 | 本地记录留存未知 | Skill与DB/导出分管 | 卸载不等擦数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 结构状态 | 事务/版本/幂等 | 故障实测与长局收益 |
| 叙事约束 | tag/参与者结构校验 | 正文语义/真实授权一致 |
| 作者评审 | 报告有模型评分 | 独立用户效果，安全共同评分覆盖为零 |

> **思考**：正文可先行积攒，拒绝可改记录不改正文；授权/回应/tag仍由模型提交，成功记录不能证明可见故事符合结构与玩家意图，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：写作与状态维护分责，版本/幂等和working copy使记录有明确结构约束，见 [Q02](#research-q02)。

[Q02](#research-q02) 同事务记录响应和状态、过期context可借鉴；正文先行却隐藏修记录会形成可见与存储分叉。

<a id="detail-section-5"></a>

### 1.4 主要限制

正文可先行积攒，拒绝可改记录不改正文；授权/回应/tag仍由模型提交，成功记录不能证明可见故事符合结构与玩家意图，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

中性多角色短局先核保存/重试/撤销/退出，才扩长局；只需短篇可用纯聊天，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定Python状态提交路径已核；作者报告与实际独立验证分层，建议独立中性样例有限试用。

- 已检查：作者 README、包清单、源码路径 reports/host/stage0/README.md、reports/playtests/reviewer-agreement.md、skill/adult-tension/SKILL.md、skill/adult-tension/runtime/adult_tension/application/service.py、skill/adult-tension/runtime/adult_tension/domain/ops.py、skill/adult-tension/runtime/adult_tension/domain/turn.py、skill/adult-tension/runtime/adult_tension/paths.py、skill/adult-tension/scripts/adult_tension.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：四材料身份/revision一致。baseline路径不存在、catalog identity无既有研究。inventory仅Markdown，补读固定git中Python launcher、paths、service、turn/ops。未全审所有操作/世界包/transfer，不执行目标，不复述露骨内容。
- 下一步：未独立运行；作者冒烟/评分只作作者报告。中性样例对照三种结构与正文、故障/重试/撤销/数据退出；长局效果未知。

**分析版本**

- **仓库**：[daha1216/dsh-adult-tension](https://github.com/daha1216/dsh-adult-tension)
- **版本号**：未声明（[固定提交 d0bce1e](https://github.com/daha1216/dsh-adult-tension/tree/d0bce1e6694362e649cd0528f0338ce8ddc7be70)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可见正文—操作—状态差异审阅，测遗漏/矛盾和修复时间，未实现，见 [Q03](#research-q03)。

未独立运行；作者冒烟/评分只作作者报告。中性样例对照三种结构与正文、故障/重试/撤销/数据退出；长局效果未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 22 | 5270 | — | — | 157568 |
| .md | test | 17 | 3137 | — | — | 56514 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/daha1216/dsh-adult-tension/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/daha1216/dsh-adult-tension/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/daha1216/dsh-adult-tension/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地结构状态能否改善互动叙事连续性，正文先行与提交校验边界在哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 是叙事提示词还是实际本地状态引擎，谁负责什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、依赖、兼容与流程

#### 完整回答

固定对象为daha1216/dsh-adult-tension，不是原生Host插件。入口是adult-tension SKILL，宿主模型理解玩家、写叙事、调用Python CLI；运行时维护角色/时间/事件/事实与存档。相对纯聊天长篇互动，贡献是把会话状态与随机/提交操作分开，减少全靠模型追记，但没有独立生成正文的模型服务。

真实脚本入口检测Python>=3.10，将Skill/runtime加入路径；SKILL要求宿主有shell/文件调用且写入携request_id/expected_revision，非JSON可同ID重试。运行时数据目录按--data-dir、ADULT_TENSION_HOME、平台用户目录选，包含SQLite、备份/导出/输入/日志，不能把安装Skill目录等同数据迁移。Skill“调用不解说/宿主要求不适用”只是作者指令，不取得越过宿主授权的权力。中文互动叙事场景明确，需求强度与实际长期连续性未独立验证。

#### 证据与依据

**依据 1 · 作者声明**：[skill/adult-tension/SKILL.md:1-8](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/skill/adult-tension/SKILL.md#L1-L8)

Skill入口与模型/引擎职责。

```text
---
name: adult-tension
description: Run a Chinese interactive story for adults with a local engine that keeps characters, time, events, boundaries, and saves consistent. Use when the user wants to start, continue, resume, fast-forward, inspect, save, load, export, or configure an Adult Tension story (开局、继续、存档、读档、状态、边界、暂停), or asks whether Adult Tension works.
---

# Adult Tension

面向成年人的中文互动叙事。你负责理解玩家和写正文；本地运行时负责状态、时间、随机和校验。你提交**操作**，不提交状态；已记录的以运行时为准。
```

**依据 2 · 作者声明**：[skill/adult-tension/SKILL.md:21-38](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/skill/adult-tension/SKILL.md#L21-L38)

宿主调用、幂等/版本协议与权限措辞。

<details>
<summary>查看原文（18行）</summary>

````text
## 调用运行时

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

**依据 3 · 源码核查**：[skill/adult-tension/scripts/adult_tension.py:49-60](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/skill/adult-tension/scripts/adult_tension.py#L49-L60)

实际launcher与运行时路径。

<details>
<summary>查看原文（12行）</summary>

```text
def main():
    if tuple(sys.version_info[:2]) < MIN_PYTHON:
        return _unsupported(sys.version_info)
    import os

    scripts_dir = os.path.dirname(os.path.abspath(__file__))
    skill_root = os.path.dirname(scripts_dir)
    runtime_dir = os.path.join(skill_root, "runtime")
    # The Skill directory must stay free of caches: nothing is compiled into it
    # until the launcher has moved the bytecode cache to the data directory.
    sys.dont_write_bytecode = True
    if runtime_dir not in sys.path:
```

</details>

**依据 4 · 源码核查**：[skill/adult-tension/scripts/adult_tension.py:13-14](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/skill/adult-tension/scripts/adult_tension.py#L13-L14)

最低Python。

```text
MIN_PYTHON = (3, 10)
EXIT_ENVIRONMENT = 20
```

**依据 5 · 源码核查**：[skill/adult-tension/runtime/adult_tension/paths.py:11-41](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/skill/adult-tension/runtime/adult_tension/paths.py#L11-L41)

持久状态目录真实选择。

<details>
<summary>查看原文（31行）</summary>

```text
APP_DIR_NAME = "adult-tension"
ENV_VAR = "ADULT_TENSION_HOME"
DB_FILE = "adult_tension.db"
MARKER_FILE = "version.json"
SUBDIRS = ("backups", "exports", "inputs", "logs")


def platform_default(platform=None, environ=None, home=None):
    platform = sys.platform if platform is None else platform
    environ = os.environ if environ is None else environ
    home = os.path.expanduser("~") if home is None else home
    if platform.startswith("win"):
        base = environ.get("LOCALAPPDATA") or os.path.join(home, "AppData", "Local")
        return os.path.join(base, APP_DIR_NAME)
    if platform == "darwin":
        return os.path.join(home, "Library", "Application Support", APP_DIR_NAME)
    base = environ.get("XDG_DATA_HOME")
    if not base or not os.path.isabs(base):
        base = os.path.join(home, ".local", "share")
    return os.path.join(base, APP_DIR_NAME)


def resolve(arg_value=None, environ=None, platform=None, home=None):
    """Return (absolute path, source) where source is arg, env or default."""
    environ = os.environ if environ is None else environ
    if arg_value:
        return os.path.abspath(os.path.expanduser(arg_value)), "arg"
    env_value = environ.get(ENV_VAR)
    if env_value:
        return os.path.abspath(os.path.expanduser(env_value)), "env"
    return os.path.abspath(platform_default(platform, environ, home)), "default"
```

</details>

#### 缺口

- 宿主实际发现/调用能力和长期连续性未独立测试。
  **影响**：不把结构校验、作者报告或Skill要求当独立正文/用户价值验收。
  **进一步探讨**：独立项目Skill目录和ADULT_TENSION_HOME，以中性多角色故事确认输入/输出、状态、保存/恢复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 事务和安全校验究竟覆盖什么，正文与记录一致吗？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

实际session_write先BEGIN、查同scope/request_id和摘要、读版本；版本过期返回新context要求重新判断。handler和幂等响应同事务COMMIT，异常ROLLBACK；domain在working_copy上逐操作校验，批turn路径先validate再应用，支持结构提交而非任意状态替换。这是代码支持的状态一致性设计，不等异常恢复已运行验证。

边界检查以结构为准：登记boundary.tags与提交content_tags相交拒绝，暂停拒绝对应标签；参与者需存在/重要/在场，玩家授权是模型提交的布尔，NPC响应也是模型声明的操作。引擎不识别先前整段正文的语义。SKILL明确允许普通回合先写正文再攒记录，且拒绝后先改记录、不改已写正文，仍失败可去掉出错操作；因此成功提交不证明正文与状态完全一致。部分人物关系限制也交给模型把握，不能把结构护栏称通用内容/同意证明。只评估机制，不复现露骨样例。

#### 证据与依据

**依据 1 · 源码核查**：[skill/adult-tension/runtime/adult_tension/application/service.py:79-89](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/skill/adult-tension/runtime/adult_tension/application/service.py#L79-L89)

同ID异输入冲突。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[skill/adult-tension/runtime/adult_tension/application/service.py:97-126](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/skill/adult-tension/runtime/adult_tension/application/service.py#L97-L126)

事务/版本/幂等真实接线。

<details>
<summary>查看原文（30行）</summary>

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
            conn.execute("ROLLBACK")
        raise
```

</details>

**依据 3 · 源码核查**：[skill/adult-tension/runtime/adult_tension/application/service.py:548-573](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/skill/adult-tension/runtime/adult_tension/application/service.py#L548-L573)

批turn validate和逐项应用。

<details>
<summary>查看原文（26行）</summary>

```text
def _commit_turn(ctx, payload):
    from ..domain import turn

    payload = validate(specs.COMMIT_TURN, payload)
    commits = [{key: item[key] for key in DOMAIN_KEYS} for item in payload["turns"]]
    late = ["$.turns[%d].replaces_turn" % i for i, c in enumerate(commits) if i and c["replaces_turn"] is not None]
    if late:
        problems = [detail(path, "只有第一项可以改写上一回合", "去掉它；还没记录的回合直接改写正文", INVALID_INPUT) for path in late]
        raise AppError(INVALID_INPUT, problems[0]["reason"], problems)

    def handler(conn, session, now):
        sid = session["session_id"]
        state = session["state"]
        failed_before = repo.take_commit_failure(conn, sid) is not None
        unsaved = session["turns_since_save"]
        results = []
        for index, commit in enumerate(commits):
            unsaved += 1
            # Undoing a later turn of a record goes back to where a record of
            # the turns before it would have left the game, requests included.
            undo_base = _record_end(state, session["content"]["world"], results) if results else None
            try:
                state, result = _apply_turn(conn, session, state, commit, unsaved, now, undo_base)
            except AppError as err:
                _at_turn(err, index)
                raise
```

</details>

**依据 4 · 源码核查**：[skill/adult-tension/runtime/adult_tension/domain/turn.py:314-325](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/skill/adult-tension/runtime/adult_tension/domain/turn.py#L314-L325)

working copy。

<details>
<summary>查看原文（12行）</summary>

```text
def commit_turn(state, content, commit, undo_snapshot=None):
    """Return (new_state, result) or raise AppError with every problem found.

    `undo_snapshot` is the stored state from before turn `replaces_turn`
    (loaded by the application); that turn is undone in this same commit.
    """
    world = content["world"]
    replaced = commit["replaces_turn"]
    base = _replace_base(state, replaced, undo_snapshot) if replaced is not None else state
    work = FA.working_copy(base)
    ctx = OPS.TurnContext(work, world, commit, simulation.hooks(work["turn"] + 1))
    ctx.significant_actors = lambda: {a["npc_id"] for a in ctx.applied if a["op"] == "npc_action"}
```

</details>

**依据 5 · 源码核查**：[skill/adult-tension/runtime/adult_tension/domain/turn.py:219-240](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/skill/adult-tension/runtime/adult_tension/domain/turn.py#L219-L240)

结构参与者/模型提交授权与回应。

<details>
<summary>查看原文（22行）</summary>

```text
    state = ctx.state
    player = state["player_id"]
    for index, cid in enumerate(participants):
        path = "$.intimate_participants[%d]" % index
        char = state["characters"].get(cid)
        if char is None:
            ctx.error(path, "角色不存在：%s" % cid, None, "NOT_FOUND")
            continue
        if char["tier"] != "major":
            ctx.error(path, "%s 不是重要角色，不能参与亲密场景" % char["name"], "先 promote_character 升格为 major")
        if not SS.is_present(state, cid):
            ctx.error(path, "%s 不在场" % char["name"])
        if cid == player:
            if commit["action_mode"] not in ("result", "attempt") or not commit["player_authorized"]:
                ctx.error(path, "玩家角色的同意只能来自玩家本人的指令（result/attempt + player_authorized）")
        else:
            cooperative = [r for r in ctx.responses.get(cid, []) if r in ST.COOPERATIVE_RESPONSES]
            if not cooperative and cid not in ctx.significant_actors():
                ctx.error(
                    path,
                    "%s 在这一回合里没有 partial/genuine 回应或主动行动" % char["name"],
                    "每一步都要有对方可见的回应；没有回应就不能继续",
```

</details>

**依据 6 · 源码核查**：[skill/adult-tension/runtime/adult_tension/domain/ops.py:894-919](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/skill/adult-tension/runtime/adult_tension/domain/ops.py#L894-L919)

tags而非正文语义检查。

<details>
<summary>查看原文（26行）</summary>

```text
def check_safety_tags(state, tags):
    """Hard boundaries and pause, for a set of content tags. Returns details."""
    problems = []
    for boundary in state["safety"]["boundaries"]:
        clash = sorted(set(boundary["tags"]) & set(tags) - {"custom"})
        if clash:
            problems.append(
                detail(
                    "$.content_tags",
                    "与玩家登记的边界冲突：%s" % boundary["text"],
                    "换一个不涉及 %s 的写法；硬边界不能被折算成剧情代价" % "、".join(clash),
                    SAFETY_BLOCK,
                )
            )
    if state["safety"]["paused"]:
        blocked = sorted(set(tags) & (set(ST.INTIMACY_TAGS) | set(ST.CONFLICT_TAGS)))
        if blocked:
            problems.append(
                detail(
                    "$.content_tags",
                    "玩家已暂停，亲密与冲突内容都不能继续：%s" % "、".join(blocked),
                    "回到中性叙述；等玩家明确恢复",
                    SAFETY_BLOCK,
                )
            )
    return problems
```

</details>

**依据 7 · 作者声明**：[skill/adult-tension/SKILL.md:69-79](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/skill/adult-tension/SKILL.md#L69-L79)

正文先行、积攒和拒绝修复策略。

<details>
<summary>查看原文（11行）</summary>

```text
3. **正文先行，攒着记录**：普通回合直接写正文，不调用运行时。攒满 10 个回合，在正文之后用一次 `commit-turn` 记录（`turns` 每回合一项，按顺序，≤ 12 项）。先记录（攒下的连同这一回合）再按返回写正文的情况：时间会到达或越过最早的待办事件（`due_soon` 第一项，或攒着的回合里登记的；记录前正文不越过它）或跨过午夜；一次推进 ≥ 60 分钟；要 `roll`；快进、接受转折、存档、读档、状态、导出、暂停、边界、偏好设置之前；玩家说先到这、下次再玩。
4. 照最近返回的 `commit_template` 写，每个回合复制一份 `turns` 里那一项（尖括号处写内容，`a|b` 选一个，用不上的操作删掉）；没有模板时照 `references/operations.md` 写。
   - `player_authorized: true` 只在玩家本人的话授权了玩家角色的移动、承诺、交易、同意、转折或设定修改时。
   - 操作：`npc_response`、`npc_action`（重大的带 `significant: true`，看 `can_act`）、`npc_state`、`add_fact`、`relationship`、`advance_time`（默认 3 分钟）、`move`、`enter_scene`/`exit_scene`、`event_*`、`roll`、`player_update`、`reveal_fact`、`spread_rumor`、`set_voice`、`introduce_character`/`promote_character`（明确成年，名字取自 `name_pool`）、`intimacy_evidence`、`identity_update`、`npc_update`、`leverage_set`/`_release`、`offscreen_beat`、`twist_accept`。
   - 正文里新写出、以后要用到的细节用 `add_fact` 记下；新点名的人即使不在场也要 `introduce_character`。开局写出的，在第一次记录里补上。
   - 模板里有 `chapter_summary`、`prologue` 才写（运行时要求的），照尖括号里的说明。
5. 先记录时，按 `context` 和 `turns` 末项的 `applied`、`resolved_events`、`simulation` 写正文：掷骰、到期、离屏移动与传播由运行时决定。
6. 页脚：`【时间】……｜【地点】……｜回合：N`。记录后用 `context.clock.label`、`context.scene.location`、`turn`；之间自己推算（回合号逐回合加一）。叙事助手开启时（`preferences.assistant`），末尾加“可以：① …… ② …… ③ ……”，只给提示，不替玩家决定。
7. 返回的 `context` 就是之后的依据；信息不够时 `get-context` 带 `"depth": "full"`。

记录被拒：按 `error.details` 的 `path`、`hint` 改记录重交，最多 2 次，玩家看不到，不改已写的正文；仍失败就去掉出错的操作。只有 `SAFETY_BLOCK`（年龄、硬边界、暂停）用一句话告诉玩家。`STALE_REVISION`：按错误附带的 `context` **重新判断**再交，不能只换 revision。
```

</details>

#### 缺口

- 故障原子性与恢复未运行验证，正文/声明操作与真实玩家意图可能不一致。
  **影响**：不把结构校验、作者报告或Skill要求当独立正文/用户价值验收。
  **进一步探讨**：用中性故事记录正文-操作-状态三者对照，含同ID重试/过期版本/批次中项失败/撤销/暂停，逐处核可见叙事能否纠正。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 作者测试支持到哪里，什么条件下试用与继续开发？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议有shell/本地Python能力的中文互动叙事爱好者在独立目录有限试用，中性世界先测，不把角色数量或世界数量当质量。作者stage0报告是OpenCode发现Skill与doctor，并非完整剧情；作者双模型24条评审一致性表中“同意与安全”两边都打分的共同覆盖数为0，不能据此推出任一单方完全未评分，也不能由其他维度好分推到此项。它们是作者测试材料，本轮未复跑，不替代真实长局用户体验。

首次需确认宿主发现Skill、Python和可写数据目录、备份与边界映射；持续为模型token、每次CLI/上下文、SQLite/存档和世界版本维护；失败先同ID查询/重试，再doctor和备份恢复，读档会改变会话状态不能盲重放。退出保留或明确删除独立数据/输入/导出，卸载Skill不等擦数据，现金和时间均未知。若只玩短篇，纯聊天+人工摘要更简单。

生产方向是通用叙事“正文—操作—状态差异”审阅：沿当前幂等/版本链，对正文先行积攒产生的缺记/改记给玩家可理解的确认/修复，不只是隐藏操作重交。用中性多角色长局，比较纯聊天、当前引擎、可见差异审阅三组的遗漏、矛盾、纠正时间和继续意愿；无改善或打断感更高则否定，未实现。

#### 证据与依据

**依据 1 · 作者声明**：[reports/host/stage0/README.md:16-22](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/reports/host/stage0/README.md#L16-L22)

作者仅发现/doctor冒烟。

```text
| # | 工具调用 | 耗时 | 结果 |
|---|---|---|---|
| 1 | `skill {"name": "adult-tension"}` | 512 ms | 宿主发现并加载了被测 Skill |
| 2 | `bash: python3 --version; python --version; py -3 --version` | 260 ms | 3.14.6 / 3.12.10 / 3.14.6 |
| 3 | `bash: python3 "D:\projects\at-host-test\.claude\skills\adult-tension\scripts\adult_tension.py" doctor --json` | 628 ms | `ok: true`，`status: warn`（还没有世界包），`skill_root` 指向被测目录，`data_dir_source: env` |

模型最终回复：“环境已就绪：Python 3.14.6、SQLite 正常、数据目录可写、数据库已完成迁移。唯一提醒是内容版本还是 0.0.0，还没有可开局的世界。”
```

**依据 2 · 作者声明**：[reports/playtests/reviewer-agreement.md:3-14](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/reports/playtests/reviewer-agreement.md#L3-L14)

作者双模型评分及安全维度共同覆盖零。

<details>
<summary>查看原文（12行）</summary>

```text
同一批 24 条记录。第一评审者：claude-opus-4-6-thinking（量表 1）；第二评审者：gemini-3.8-flash-exp-a（量表 1）、gemini-3.8-flash（量表 1）。

| 维度 | 两边都打分 | 相同 | 相差 ≤ 1 | 第二减第一（平均） | 第一 ≤ 2 | 第二 ≤ 2 |
|---|---|---|---|---|---|---|
| 玩家主权 | 24 | 11 | 24 | +0.54 | 0 | 0 |
| NPC 意志 | 24 | 24 | 24 | +0.00 | 0 | 0 |
| 知识边界 | 24 | 12 | 24 | +0.50 | 0 | 0 |
| 关系节奏 | 13 | 6 | 13 | -0.23 | 0 | 0 |
| 同意与安全 | 0 | 0 | 0 | — | 0 | 0 |
| 世界具体性 | 24 | 24 | 24 | +0.00 | 0 | 0 |
| 连续性 | 24 | 23 | 24 | +0.04 | 0 | 0 |
| 表达 | 24 | 15 | 23 | +0.08 | 0 | 2 |
```

</details>

**依据 3 · 源码核查**：[skill/adult-tension/runtime/adult_tension/paths.py:11-41](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/skill/adult-tension/runtime/adult_tension/paths.py#L11-L41)

数据迁移/退出成本。

<details>
<summary>查看原文（31行）</summary>

```text
APP_DIR_NAME = "adult-tension"
ENV_VAR = "ADULT_TENSION_HOME"
DB_FILE = "adult_tension.db"
MARKER_FILE = "version.json"
SUBDIRS = ("backups", "exports", "inputs", "logs")


def platform_default(platform=None, environ=None, home=None):
    platform = sys.platform if platform is None else platform
    environ = os.environ if environ is None else environ
    home = os.path.expanduser("~") if home is None else home
    if platform.startswith("win"):
        base = environ.get("LOCALAPPDATA") or os.path.join(home, "AppData", "Local")
        return os.path.join(base, APP_DIR_NAME)
    if platform == "darwin":
        return os.path.join(home, "Library", "Application Support", APP_DIR_NAME)
    base = environ.get("XDG_DATA_HOME")
    if not base or not os.path.isabs(base):
        base = os.path.join(home, ".local", "share")
    return os.path.join(base, APP_DIR_NAME)


def resolve(arg_value=None, environ=None, platform=None, home=None):
    """Return (absolute path, source) where source is arg, env or default."""
    environ = os.environ if environ is None else environ
    if arg_value:
        return os.path.abspath(os.path.expanduser(arg_value)), "arg"
    env_value = environ.get(ENV_VAR)
    if env_value:
        return os.path.abspath(os.path.expanduser(env_value)), "env"
    return os.path.abspath(platform_default(platform, environ, home)), "default"
```

</details>

**依据 4 · 作者声明**：[skill/adult-tension/SKILL.md:36-38](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/skill/adult-tension/SKILL.md#L36-L38)

重试/冲突流程。

```text
- 会话内的命令都带 `session_id`。写操作带 `request_id`（上次返回的 `next_request_id`），会话内的写操作再带 `expected_revision`（上次返回的 `revision`）；读命令不带这两个。字段拿不准或被拒再查 `references/commands.md`，不用 `--help`，不读运行时源码与数据库。
- 超时、没有输出、输出不是 JSON：用**同一个** `request_id` 重试，最多 3 次，仍失败就运行 `doctor`，一句话告诉玩家。
- `IDEMPOTENCY_CONFLICT`（这个 `request_id` 用过了）：先 `get-context` 看上一次是否生效，再决定是否换新 `request_id` 补交。
```

**依据 5 · 作者声明**：[skill/adult-tension/SKILL.md:69-79](https://github.com/daha1216/dsh-adult-tension/blob/d0bce1e6694362e649cd0528f0338ce8ddc7be70/skill/adult-tension/SKILL.md#L69-L79)

可见差异问题来源。

<details>
<summary>查看原文（11行）</summary>

```text
3. **正文先行，攒着记录**：普通回合直接写正文，不调用运行时。攒满 10 个回合，在正文之后用一次 `commit-turn` 记录（`turns` 每回合一项，按顺序，≤ 12 项）。先记录（攒下的连同这一回合）再按返回写正文的情况：时间会到达或越过最早的待办事件（`due_soon` 第一项，或攒着的回合里登记的；记录前正文不越过它）或跨过午夜；一次推进 ≥ 60 分钟；要 `roll`；快进、接受转折、存档、读档、状态、导出、暂停、边界、偏好设置之前；玩家说先到这、下次再玩。
4. 照最近返回的 `commit_template` 写，每个回合复制一份 `turns` 里那一项（尖括号处写内容，`a|b` 选一个，用不上的操作删掉）；没有模板时照 `references/operations.md` 写。
   - `player_authorized: true` 只在玩家本人的话授权了玩家角色的移动、承诺、交易、同意、转折或设定修改时。
   - 操作：`npc_response`、`npc_action`（重大的带 `significant: true`，看 `can_act`）、`npc_state`、`add_fact`、`relationship`、`advance_time`（默认 3 分钟）、`move`、`enter_scene`/`exit_scene`、`event_*`、`roll`、`player_update`、`reveal_fact`、`spread_rumor`、`set_voice`、`introduce_character`/`promote_character`（明确成年，名字取自 `name_pool`）、`intimacy_evidence`、`identity_update`、`npc_update`、`leverage_set`/`_release`、`offscreen_beat`、`twist_accept`。
   - 正文里新写出、以后要用到的细节用 `add_fact` 记下；新点名的人即使不在场也要 `introduce_character`。开局写出的，在第一次记录里补上。
   - 模板里有 `chapter_summary`、`prologue` 才写（运行时要求的），照尖括号里的说明。
5. 先记录时，按 `context` 和 `turns` 末项的 `applied`、`resolved_events`、`simulation` 写正文：掷骰、到期、离屏移动与传播由运行时决定。
6. 页脚：`【时间】……｜【地点】……｜回合：N`。记录后用 `context.clock.label`、`context.scene.location`、`turn`；之间自己推算（回合号逐回合加一）。叙事助手开启时（`preferences.assistant`），末尾加“可以：① …… ② …… ③ ……”，只给提示，不替玩家决定。
7. 返回的 `context` 就是之后的依据；信息不够时 `get-context` 带 `"depth": "full"`。

记录被拒：按 `error.details` 的 `path`、`hint` 改记录重交，最多 2 次，玩家看不到，不改已写的正文；仍失败就去掉出错的操作。只有 `SAFETY_BLOCK`（年龄、硬边界、暂停）用一句话告诉玩家。`STALE_REVISION`：按错误附带的 `context` **重新判断**再交，不能只换 revision。
```

</details>

#### 缺口

- 没有独立宿主运行、长局对照或用户持续使用证据。
  **影响**：不把结构校验、作者报告或Skill要求当独立正文/用户价值验收。
  **进一步探讨**：独立profile中性样例先验证状态/故障/退出，再以真实玩家长局对照测连续性与修复时间。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
