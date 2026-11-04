# ZeroToken Skill

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[cc26fda](https://github.com/phoenixlucky/zerotoken-skill/tree/cc26fda4ee949e29bfdc11ee43123292025cde3f)

<!-- BEGIN META -->
[![GitHub ★ 22](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=22&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/phoenixlucky/zerotoken-skill)
<!-- END META -->

> **功能**：提供面向 Agent 的简洁输出、渐进读取与平台适配规则。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 提供任务模式、工具路由与环境脚本；效益尚未对照。

> **主要限制**：[Q03](#research-q03) 需求更新时机械替换旧方案可能影响仍有效要求，须结合文档的追加确认及上级约束；[Q04](#research-q04) 工具有文件副作用。

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
  - [Q01 · 该 Skill 面向谁，相比一般简洁提示增加什么？](#detail-section-11)
  - [Q02 · 模式路由与环境探测实际由什么执行？](#detail-section-12)
  - [Q03 · 压缩规则与复杂任务和已有授权如何协调？](#detail-section-13)
  - [Q04 · 可选工具的副作用及检查边界是什么？](#detail-section-14)
  - [Q05 · 怎样测量节省上下文是否以正确性为代价？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户明确要求简洁或低 token 时，助手需控制上下文和输出，同时保持任务质量。

宿主原有指令或用户直接要求简洁，再按任务选择必要读取与验证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 任务模式 | 选择阅读与输出深度 | 自然语言，依宿主遵循 |
| 环境探测 | 保存平台和编码信息 | 写入当前目录缓存 |
| 检查入口 | 运行项目检查 | 不证明用户任务已完成 |

**流程与依赖**

| 依赖 | 条件 | 用途 | 缺失影响 |
|---|---|---|---|
| 兼容 Skill 的宿主 | 读取和应用需要 | 解释任务规则 | 仅为文本文件 |
| Python | 使用脚本需要 | 探测及检查工具 | 脚本不可运行 |
| 当前工作目录写权限 | 保存探测时需要 | 写缓存 | 可能无法持久化或覆盖已有文件 |
| 任务与上级约束 | 全程需要 | 判断完整性与优先级 | 机械压缩可能遗漏需求 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 触发 | 用户明确调用或要求低 token | 不适用任务不启用 |
| 选择 | 助手判断任务风险与必要证据 | 复杂或高风险退出压缩 |
| 探测 | 命令任务按需核对环境和写入位置 | 不允许写入则不运行 |
| 完成 | 按任务验收并报告边界 | 证据不足时继续核查 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | 宿主上下文和可选 Python | 读取规则和配置 | token 节省未知 |
| 持续 | 探测及工具调用 | 检查任务和规则冲突 | 质量影响未测 |
| 恢复 | 文件备份 | 撤销误用脚本 | 恢复未测 |

| 结果 | 依据 | 未知 |
|---|---|---|
| 模式建议 | SKILL 决策表 | 是否被宿主遵循 |
| 环境缓存 | Python 写入实现 | 平台正确性 |
| 节省 token | 作者主张 | 质量与节省对照 |

> **思考**：[Q03](#research-q03) 需求更新时机械替换旧方案可能影响仍有效要求，须结合文档的追加确认及上级约束；[Q04](#research-q04) 工具有文件副作用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 提供任务模式、工具路由与环境脚本；效益尚未对照。

[Q02](#research-q02) 缓存和平台选择是显式脚本；[Q04](#research-q04) 检查入口可发现测试，但不能证明目标任务结果。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 需求更新时机械替换旧方案可能影响仍有效要求，须结合文档的追加确认及上级约束；[Q04](#research-q04) 工具有文件副作用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先比较宿主规则并检查脚本副作用；复杂或需完整证据时按 [Q03](#research-q03) 停止压缩。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本文本与代表脚本静态核查，未执行脚本或加载宿主。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、SKILL.md、scripts/detect_env.py、scripts/zt.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 Skill 路由、质量规则、环境缓存和统一检查入口；未审计全部编码与文件修改脚本。
- 下一步：固定模型和任务比较上下文成本、遗漏与完成率，在临时目录核对探测与写入；本次未执行。

**分析版本**

- **仓库**：[phoenixlucky/zerotoken-skill](https://github.com/phoenixlucky/zerotoken-skill)
- **版本号**：1.17.0（[固定提交 cc26fda](https://github.com/phoenixlucky/zerotoken-skill/tree/cc26fda4ee949e29bfdc11ee43123292025cde3f)）
- **版本日期**：2026-10-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设以风险分层任务同时衡量 token 和质量可识别适用边界。

固定模型和任务比较上下文成本、遗漏与完成率，在临时目录核对探测与写入；本次未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 1303 | — | — | 18617 |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/phoenixlucky/zerotoken-skill/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/phoenixlucky/zerotoken-skill/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查低 token Skill 的触发、环境探测和复杂任务质量边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 该 Skill 面向谁，相比一般简洁提示增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

该仓库是面向 Agent 的自然语言 Skill 和配套 Python 工具，而非原生 DSH 插件。入口明确写明用户显式要求低 token、直接结果或按名称调用才使用；它按任务类型给出渐进读取、输出、环境规则，并带可选脚本。相对一句“简洁回答”，其增量是按任务和平台给出具体路由与边界；并无同任务 token、准确率或完成率对照，名字不能证明零成本。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:1-17](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/SKILL.md#L1-L17)

显式触发和能力披露。

<details>
<summary>查看原文（17行）</summary>

```text
---
name: zerotoken-skill
version: 1.17.0
description: Token-efficient assistant discipline for concise, direct answers and minimal-context task execution. Use only when the user explicitly requests low-token / direct output (e.g. says「省 token」「直接给结果」) or invokes this skill by name; includes optional file-encoding and Windows PowerShell utilities (single entry: `python scripts/zt.py help`).
metadata:
  security:
    capabilities:
      - filesystem-read: "read local files"
      - filesystem-write: "write/modify local files"
      - batch-edit: "apply multiple text replacements to a single file"
      - encoding-conversion: "batch file encoding detection and conversion"
      - gbk-contamination-detection: "detect and repair GBK-contaminated UTF-8 files"
      - git-operations: "git config and commit operations"
    permissions-declared: true
    language: "回答语言跟随用户交互语言（用中文问就中文答）；文档正文为 zh-CN"
    platforms: "auto-detects OS at session start (detect_env.py): Windows/PowerShell -> Mode F, Linux/macOS -> Mode G"
    references: "细节按需读取 references/*.md（Windows 陷阱 / 重构手册 / 搜索规范 / 发布手册 / 工具映射）"
```

</details>

**依据 2 · 源码核查**：[SKILL.md:39-51](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/SKILL.md#L39-L51)

模式路由。

<details>
<summary>查看原文（13行）</summary>

```text
## 📐 快速决策表

| 用户请求特征 | 模式 | 首轮输出 | 工具偏好 |
|---|---|---|---|
| 问定义/翻译/短建议 | **A. 简单问答** | 1-5 句直接回答 | 直接输出，不跑工具 |
| 单文件修复/配置调整 | **B. 代码小改** | 改动 + 验证结果 | `grep` → `read_file`(局部) → `edit_file` |
| 跨模块功能/常规重构/CI | **C. 多文件任务** | 3-5 步短计划 | `glob` → `grep` → 分批 `read_file` |
| 长文/日志/PR/文档总结 | **D. 大资料总结** | 要点 + 证据位置 | `read_file`(head+tail) → `grep`(关键行) |
| 反复出同类 bug / 加功能越来越难 / 架构与需求不匹配 | **E. 重大重构/架构调整** | 问题诊断 + 目标方案 + 迁移路线图 | `explore` → 分批 `read_file`（详见 [`references/refactor-playbook.md`](references/refactor-playbook.md)） |
| 用户明确说"省 token" | **ZeroToken 强化** | 最短可执行输出 | 同上，但跳过所有非必要探索 |
| 用户说"详细解释/教学" | **➡ 退出 ZeroToken** | 常规详尽模式 | 不限 |
| 系统是 Windows/PowerShell（detect_env.py 自动识别） | **F. Windows/PowerShell 环境适配** | 系统参数已保存，按陷阱规则调整工作流 | 详见 [`references/windows-powershell.md`](references/windows-powershell.md) |
| 系统是 Linux/macOS（detect_env.py 自动识别） | **G. POSIX 标准工作流** | 按 POSIX 规则工作，禁用 PowerShell 语法 | 常规 shell 工具链（sh/bash/zsh） |
```

</details>

**依据 3 · 源码核查**：[SKILL.md:57-69](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/SKILL.md#L57-L69)

上下文和环境规则。

<details>
<summary>查看原文（13行）</summary>

```text
## 🧭 核心原则

1. **先分类，再预算** — 按上表决定上下文深度，不默认全量读取。
2. **压缩提示词** — 目标 + 已知输入 + 约束 + 验收格式；只在缺失项会改变结果时追问。
3. **渐进读取** — 先定位（`grep`/`glob`），再局部读，读完即停。大文件（70KB+）用 `read_file` 的 `offset` + `limit` 分页，避免被截断。
4. **先给结果** — 结论或完成状态先行；解释、推理按需补充。
5. **不复述** — 不重复用户问题、不写礼貌铺垫、不解释常识。
6. **plan 只写顶层步骤，不写子 bullet** — 每个 phase 写 1 行（共 2-5 个），细节放说明文字里。宿主把 bullet 注册成独立待办时的规避细节、签收证据规则见 [`references/tool-mapping.md`](references/tool-mapping.md)。
7. **设置停止条件** — 已定位目标、必要调用方/数据源和验证方式后停止搜索；同一文件未变化时不重复读取。
8. **先识别环境，再选 Shell** — 任何涉及命令行执行的任务，第一步：
   `python scripts/detect_env.py` → `.zerotoken/environment.json`（7 天有效期）。
   之后所有命令按已保存的系统参数选择：Windows 一律 PowerShell（禁用 bash），
   Linux/macOS 用 sh/bash/zsh；中文支持能力以 `console.cjk_capable` 为准。
```

</details>

**依据 4 · 作者声明**：[README.md:13-20](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/README.md#L13-L20)

作者的效率与准确性主张。

```text
[![Author](https://img.shields.io/badge/author-phoenixlucky-orange.svg)]()
[![CI](https://github.com/phoenixlucky/zerotoken-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/phoenixlucky/zerotoken-skill/actions/workflows/ci.yml)

</div>

> **ZeroToken Skill** 是一套为 AI Agent 设计的**提示词纪律规范**——在不降低回答准确性的前提下，压缩无效上下文、无效解释、无效工具调用和无效输出。
>
> 它解决的核心问题是：Agent 在任务中经常过度读取、过度思考、过度输出，导致一次对话消耗成千上万不必要的 token。本 Skill 通过一套可执行的**模式决策表 + 行为约束 + 工具链策略**，让 Agent 在每一个任务环节都有明确的"省 token 行为准则"。
```

#### 缺口

- 无固定任务集的 token 和正确率对照
  **影响**：无法证明省量且不损质量
  **进一步探讨**：使用同模型、任务和验收标准比较 token、成功率及纠错。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模式路由与环境探测实际由什么执行？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

模式选择是自然语言指令，由宿主和模型解释执行，不是注册的自动分类器。文档要求命令任务先运行 detect_env.py，脚本采集平台、shell 与编码字段，默认将 JSON 保存到当前工作目录的 .zerotoken/environment.json；七天内缓存可复用，否则重新探测写入。声明的“自动”依赖宿主遵守并实际调用脚本，不能因 SKILL 文本存在就断言自动执行或所有宿主支持该工具。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:39-53](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/SKILL.md#L39-L53)

文本形式的任务选择与宿主工具映射。

<details>
<summary>查看原文（15行）</summary>

```text
## 📐 快速决策表

| 用户请求特征 | 模式 | 首轮输出 | 工具偏好 |
|---|---|---|---|
| 问定义/翻译/短建议 | **A. 简单问答** | 1-5 句直接回答 | 直接输出，不跑工具 |
| 单文件修复/配置调整 | **B. 代码小改** | 改动 + 验证结果 | `grep` → `read_file`(局部) → `edit_file` |
| 跨模块功能/常规重构/CI | **C. 多文件任务** | 3-5 步短计划 | `glob` → `grep` → 分批 `read_file` |
| 长文/日志/PR/文档总结 | **D. 大资料总结** | 要点 + 证据位置 | `read_file`(head+tail) → `grep`(关键行) |
| 反复出同类 bug / 加功能越来越难 / 架构与需求不匹配 | **E. 重大重构/架构调整** | 问题诊断 + 目标方案 + 迁移路线图 | `explore` → 分批 `read_file`（详见 [`references/refactor-playbook.md`](references/refactor-playbook.md)） |
| 用户明确说"省 token" | **ZeroToken 强化** | 最短可执行输出 | 同上，但跳过所有非必要探索 |
| 用户说"详细解释/教学" | **➡ 退出 ZeroToken** | 常规详尽模式 | 不限 |
| 系统是 Windows/PowerShell（detect_env.py 自动识别） | **F. Windows/PowerShell 环境适配** | 系统参数已保存，按陷阱规则调整工作流 | 详见 [`references/windows-powershell.md`](references/windows-powershell.md) |
| 系统是 Linux/macOS（detect_env.py 自动识别） | **G. POSIX 标准工作流** | 按 POSIX 规则工作，禁用 PowerShell 语法 | 常规 shell 工具链（sh/bash/zsh） |

> 工具名以当前宿主实际提供的为准；名字不同时见 [`references/tool-mapping.md`](references/tool-mapping.md)。
```

</details>

**依据 2 · 源码核查**：[SKILL.md:65-69](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/SKILL.md#L65-L69)

命令任务要求先探测并保存。

```text
7. **设置停止条件** — 已定位目标、必要调用方/数据源和验证方式后停止搜索；同一文件未变化时不重复读取。
8. **先识别环境，再选 Shell** — 任何涉及命令行执行的任务，第一步：
   `python scripts/detect_env.py` → `.zerotoken/environment.json`（7 天有效期）。
   之后所有命令按已保存的系统参数选择：Windows 一律 PowerShell（禁用 bash），
   Linux/macOS 用 sh/bash/zsh；中文支持能力以 `console.cjk_capable` 为准。
```

**依据 3 · 源码核查**：[scripts/detect_env.py:48-51](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/scripts/detect_env.py#L48-L51)

相对缓存路径与有效期。

```text
# 探测结果默认存放位置（仓库根目录 .zerotoken/ 下）
DEFAULT_ENV_PATH = os.path.join(".zerotoken", "environment.json")
# 结果有效期：超过后建议重新探测（系统更新、终端切换会使结果过期）
MAX_AGE_SECONDS = 7 * 24 * 3600
```

**依据 4 · 源码核查**：[scripts/detect_env.py:111-145](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/scripts/detect_env.py#L111-L145)

采集的平台和编码字段。

<details>
<summary>查看原文（35行）</summary>

```text
def detect_environment(force: bool = False) -> Dict[str, Any]:
    """收集当前系统参数并返回结构化报告（不落盘）。"""
    os_name = platform.system().lower()
    stdout_enc = (getattr(sys.stdout, "encoding", None) or "").lower()
    preferred_enc = (sys.getfilesystemencoding() or "").lower()
    fs_encoding = sys.getfilesystemencoding()
    cjk_ok = check_cjk_console(stdout_enc)

    env: Dict[str, Any] = {
        "schema": 1,
        # 机器解析用（is_fresh 依赖此格式）；detected_at_iso 为人类可读副本
        "detected_at": time.strftime("%Y%m%dT%H%M%S%z"),
        "detected_at_iso": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "os": {
            "name": os_name,                       # windows / linux / darwin
            "release": platform.release(),
            "version": platform.version(),
            "machine": platform.machine(),
            "python_platform": sys.platform,
        },
        "shell": {
            "recommended": recommended_shell(os_name),
            "comspec": os.environ.get("COMSPEC"),
            "posix": os.name == "posix",
            "bash_available": None,                # 非 POSIX 下不探测，保持 None
        },
        "console": {
            "stdout_encoding": stdout_enc,
            "preferred_encoding": preferred_enc,
            "filesystem_encoding": (fs_encoding or "").lower(),
            "utf8_mode": bool(sys.flags.utf8_mode),
            "ansi_cp": None,
            "oem_cp": None,
            "cjk_capable": cjk_ok,
            "cjk_note": (
```

</details>

**依据 5 · 源码核查**：[scripts/detect_env.py:213-223](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/scripts/detect_env.py#L213-L223)

实际写文件。

<details>
<summary>查看原文（11行）</summary>

```text
def save_environment(report: Optional[Dict[str, Any]] = None,
                     out_path: str = DEFAULT_ENV_PATH) -> str:
    """把探测报告写入 JSON（UTF-8 无 BOM + LF + ensure_ascii=False）。"""
    if report is None:
        report = detect_environment()
    path = Path(out_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
        f.write("\n")
    return str(path)
```

</details>

**依据 6 · 源码核查**：[scripts/detect_env.py:356-378](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/scripts/detect_env.py#L356-L378)

缓存复用和刷新调用。

<details>
<summary>查看原文（23行）</summary>

```text
def main(argv: Optional[list] = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    force = False
    out_path = DEFAULT_ENV_PATH
    it = iter(argv)
    for arg in it:
        if arg == "--force":
            force = True
        elif arg == "--out":
            try:
                out_path = next(it)
            except StopIteration:
                safe_print("[detect_env] --out requires a value")
                return 2
    ensure_utf8_stdio()

    if not force and is_fresh(_peek_saved(out_path)):
        env = _peek_saved(out_path)
        source = out_path
    else:
        env = detect_environment()
        source = save_environment(env, out_path)
    safe_print(build_report(env, source_path=source))
```

</details>

#### 缺口

- 未在任一宿主加载 Skill 或运行探测
  **影响**：不能确认触发、行为遵循或路径权限
  **进一步探讨**：在隔离工作区记录 Skill 触发、文件写入与实际路由。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 压缩规则与复杂任务和已有授权如何协调？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Skill 规定简单任务少读少答，同时对医疗、法律、金融和明确详细请求列出退出条件，且强调不省略准确性和必要测试。文档第 5 条要求新需求先确认废弃、覆盖或追加，第 6 条则写“需求更新后旧方案立即失效，删除/替换/迁移，不留兼容层”。二者应结合具体范围理解：若机械地把旧方案或仍有效的要求一概视作失效，可能遗漏用户追加需求中仍需保留的部分；实际取舍应服从用户及更高优先级约束。没有行为实验，不能确认某宿主实际发生冲突。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:113-124](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/SKILL.md#L113-L124)

单一命令和旧令替换规则。

<details>
<summary>查看原文（12行）</summary>

```text
| # | 原则 | 要求 | 违反示例 |
|---|---|---|---|
| 1 | **先谋后动（谋于庙）** | 编码前先理解需求、明确目标、列出约束与方案，确认后再实现 | 边思考边改大量代码 |
| 2 | **统一方案（行令于廷）** | 全仓库统一架构/命名/目录/接口/风格 | 一个问题多个实现、新旧逻辑混用 |
| 3 | **职责明确（分职）** | 每层各司其职（UI→Service→Repository→DB），不得越级 | UI 直连数据库 |
| 4 | **不得越权（逾分请者）** | 只改自己职责范围；修 SQL 不顺手改页面/接口/重构 | 顺手重构整个系统 |
| 5 | **唯一命令（军无二令）** | 任何时刻只有一个最终需求；新需求先确认：废弃/覆盖/追加原需求 | 同时执行互相冲突的需求 |
| 6 | **禁止旧令（留令者）** | 需求更新后旧方案立即失效，删除/替换/迁移，不留兼容层 | "为了兼容以前"偷偷保留旧代码 |
| 7 | **严格执行（失令者）** | 已确认要求全部落实：功能/性能/注释/测试/边界情况 | 遗漏边界情况 |
| 8 | **最小改动** | 修改范围越小越好，不影响已有功能；每次提交只解决一个问题 | 无关优化/重构 |
| 9 | **可追溯** | 每次修改说明：为什么改、改了哪些文件/函数、影响、如何验证 | 修改历史无法追踪 |
| 10 | **验证先于结束** | 编译/运行/需求/边界/回归全部验证通过才宣布完成 | 编码完就宣布结束 |
```

</details>

**依据 2 · 源码核查**：[SKILL.md:150-157](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/SKILL.md#L150-L157)

强化压缩规则。

```text
## ⚡ ZeroToken 强化模式

当用户明确要求省 token / 简洁 / 减少上下文时，在对应模式基础上额外：

- 跳过所有非必要探索（不 glob 全目录、不预览多个候选）
- 工具调用次数压到最低（能 1 步不用 2 步）
- 每次读取或工具调用前写明要验证的假设；得到答案即停止，不为"保险"重复调用
- 输出只保留：做了什么 + 结果 + 用户下一步需要的操作（如果有）
```

**依据 3 · 源码核查**：[SKILL.md:179-190](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/SKILL.md#L179-L190)

退出和质量底线。

<details>
<summary>查看原文（12行）</summary>

```text
## 🚫 何时不使用 ZeroToken

- 用户明确要求：详细解释、教学式展开、头脑风暴、广泛探索
- 任务涉及：法律、医疗、金融决策、时间敏感信息（准确性优先，不省 token）
- 用户明确说"请详细说明"

## 🛡️ 质量底线

- 不省略安全、准确性和用户明确要求
- 不跳过必要测试来制造"省 token"假象
- 不把猜测写成事实
- 不用短答案掩盖不确定性
```

</details>

#### 缺口

- 未测试相冲突指令和多轮用户追加
  **影响**：不知道模型如何处理实际指令层级
  **进一步探讨**：用同一多轮任务对照指令保留、准确率与工具调用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可选工具的副作用及检查边界是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

Skill 披露文件写入、批量替换、编码转换和 Git 配置能力；统一入口 zt.py 将命令映射至对应脚本，check 动态发现 test_*.py、运行审计并在失败后停下。环境探测也可能在当前目录写缓存，check 是作者项目检查，不是对任意用户任务的正确性证明。若使用者要采用，应先读当前宿主更高优先级规则，隔离预览写入/转换并保留备份；不接受文件副作用或输出不满足任务时停止。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:29-35](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/SKILL.md#L29-L35)

声明文件与 Git 相关能力。

```text
> **🛡️ 能力与安全披露**（安装前请确认符合你的安全策略）
> 除提示词纪律外，本 Skill 还声明这些文件系统能力：
> 读取/修改本地文件（`read_file`/`edit_file`/`write_file`）；批量替换与编码转换
> （`scripts/batch_edit.py`、`fix_encoding.py`）；安全读写与追加（`scripts/safe_io.py`，
> 规避 `Add-Content` 的 GBK 污染）；GBK 污染检测修复（`scripts/detect_gbk_contamination.py`）；
> Git 配置（`scripts/init_env.ps1` 只改**当前仓库 local 配置**，不动全局）；
> 环境探测结果写 `.zerotoken/environment.json`（7 天有效期，已 gitignore）。
```

**依据 2 · 源码核查**：[scripts/zt.py:38-65](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/scripts/zt.py#L38-L65)

子命令包括写入和转换。

<details>
<summary>查看原文（28行）</summary>

```text
            '识别系统参数（OS/Shell/控制台编码/中文支持/PS 版本）并保存 7 天缓存',
            ('python scripts/zt.py env', 'python scripts/zt.py env --force')),
    'audit': ('audit_skill.py',
              '文档一致性审计：体积/链接/计数/脚本引用/异体字',
              ('python scripts/zt.py audit',
               'python scripts/zt.py audit --json --out audit_skill.json')),
    'encoding': ('audit_encoding.py',
                 '编码合规审计：UTF-8 / 替换字符 / 混合换行',
                 ('python scripts/zt.py encoding',
                  'python scripts/zt.py encoding --json')),
    'version': ('bump_version.py',
                '版本号三处联动（package.json / SKILL.md / README）：空参=校验，带版本号=写入',
                ('python scripts/zt.py version',
                 'python scripts/zt.py version 1.14.0')),
    'gbk': ('detect_gbk_contamination.py',
            'GBK 污染检测与修复（scan / inspect / fix）',
            ('python scripts/zt.py gbk scan .',
             'python scripts/zt.py gbk fix . --backup --preview')),
    'convert': ('fix_encoding.py',
                '批量编码转换（scan / preview / convert / check-replacement）',
                ('python scripts/zt.py convert scan .',
                 'python scripts/zt.py convert convert . --backup')),
    'edit': ('batch_edit.py',
             '同一文件多处替换（宿主编辑工具阻塞时的备用路径）',
             ('python scripts/zt.py edit notes.md replacements.json',)),
    'verify': ('verify_output.py',
               '验证结果写入 .txt（避免终端中文乱码，供 read_file 读取）',
               ('python scripts/zt.py verify "检查项" out.txt --pass "✓ 通过"',)),
```

</details>

**依据 3 · 源码核查**：[scripts/zt.py:68-84](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/scripts/zt.py#L68-L84)

check 动态发现与检查项。

<details>
<summary>查看原文（17行）</summary>

```text
# check 的动态步骤：scripts/test_*.py 自动发现（新增测试无需手改本文件）
def discover_tests():
    """返回 [(说明, 脚本名, 参数)]，按文件名排序。"""
    return [
        (f'回归测试：{name}', name, ())
        for name in sorted(
            n for n in os.listdir(SCRIPTS_DIR)
            if n.startswith('test_') and n.endswith('.py'))
    ]


# check 的步骤：(说明, 脚本, 参数)
CHECK_STEPS = (
    *discover_tests(),
    ('编码合规审计', 'audit_encoding.py', None),   # None -> 运行时注入临时 --out
    ('文档一致性审计', 'audit_skill.py', ()),
    ('版本号三处联动', 'bump_version.py', ('--check',)),
```

</details>

**依据 4 · 源码核查**：[scripts/zt.py:140-181](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/scripts/zt.py#L140-L181)

临时输出和首个失败停止。

<details>
<summary>查看原文（42行）</summary>

```text
def run_check(argv) -> int:
    json_mode, out_path, rest = parse_json_out(argv)
    if json_mode is None:
        safe_print('[zt] --out 需要一个文件路径')
        return 2
    if rest:
        safe_print(f'[zt] check 不认识的参数: {" ".join(rest)}'
                   '（支持 --json / --out <文件>）')
        return 2

    total = len(CHECK_STEPS)
    ok = True
    steps = []
    with tempfile.TemporaryDirectory(prefix='zt-check-') as tmp:
        for index, (name, script, extra) in enumerate(CHECK_STEPS, start=1):
            args = list(extra) if extra is not None else [
                '--root', '.', '--out', os.path.join(tmp, 'audit_result.txt')]
            if not json_mode:
                safe_print(f'[{index}/{total}] {name} ...')
            code, output = run_script(script, args, capture=json_mode)
            step = {'name': name, 'script': script, 'exit': code}
            if code != 0:
                ok = False
                if json_mode:
                    step['output'] = output[-OUTPUT_LIMIT:]
                    if output:
                        safe_print(f'[{index}/{total}] {name} 输出:\n{output}')
                else:
                    safe_print(f'[{index}/{total}] {name} -> 失败（退出码 {code}）')
                steps.append(step)
                break
            if not json_mode:
                safe_print(f'[{index}/{total}] {name} -> OK')
            steps.append(step)

    if json_mode:
        write_or_print_json({'ok': ok, 'repo': REPO_ROOT, 'steps': steps}, out_path)
    elif ok:
        safe_print(f'全部通过（{total} 步）。')
    else:
        safe_print(f'失败步骤: {steps[-1]["name"]} —— 见上方输出。')
    return 0 if ok else 1
```

</details>

**依据 5 · 源码核查**：[scripts/detect_env.py:213-223](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/scripts/detect_env.py#L213-L223)

缓存写入。

<details>
<summary>查看原文（11行）</summary>

```text
def save_environment(report: Optional[Dict[str, Any]] = None,
                     out_path: str = DEFAULT_ENV_PATH) -> str:
    """把探测报告写入 JSON（UTF-8 无 BOM + LF + ensure_ascii=False）。"""
    if report is None:
        report = detect_environment()
    path = Path(out_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
        f.write("\n")
    return str(path)
```

</details>

#### 缺口

- 未审计所有工具、执行 check 或比较不同平台
  **影响**：无法保证批量操作可逆或节省总成本
  **进一步探讨**：在临时文件上先预览、核对差异与恢复，记录额外耗时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样测量节省上下文是否以正确性为代价？

**研究主题**：新假设与验证

#### 完整回答

Q03 已有明确退出及质量底线，不能声称该 Skill 完全忽略准确性。假设使用按风险分层的固定任务集，同时测输入输出 token、完成率、关键证据遗漏、追问次数和人工修复成本，可找到适用阈值；与宿主原生最小读取及无 Skill 两组对照。如果节约被漏证或补救成本抵消、复杂任务完成率下降，则否定相应省量主张。该评估不是已发生实验。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:150-157](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/SKILL.md#L150-L157)

强化模式减少调用。

```text
## ⚡ ZeroToken 强化模式

当用户明确要求省 token / 简洁 / 减少上下文时，在对应模式基础上额外：

- 跳过所有非必要探索（不 glob 全目录、不预览多个候选）
- 工具调用次数压到最低（能 1 步不用 2 步）
- 每次读取或工具调用前写明要验证的假设；得到答案即停止，不为"保险"重复调用
- 输出只保留：做了什么 + 结果 + 用户下一步需要的操作（如果有）
```

**依据 2 · 源码核查**：[SKILL.md:179-190](https://github.com/phoenixlucky/zerotoken-skill/blob/cc26fda4ee949e29bfdc11ee43123292025cde3f/SKILL.md#L179-L190)

现有退出和质量原则。

<details>
<summary>查看原文（12行）</summary>

```text
## 🚫 何时不使用 ZeroToken

- 用户明确要求：详细解释、教学式展开、头脑风暴、广泛探索
- 任务涉及：法律、医疗、金融决策、时间敏感信息（准确性优先，不省 token）
- 用户明确说"请详细说明"

## 🛡️ 质量底线

- 不省略安全、准确性和用户明确要求
- 不跳过必要测试来制造"省 token"假象
- 不把猜测写成事实
- 不用短答案掩盖不确定性
```

</details>

#### 缺口

- 没有量化对照或复现实验
  **影响**：无法估计真实效果和风险阈值
  **进一步探讨**：固定模型、上下文和验收标准执行盲评。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
