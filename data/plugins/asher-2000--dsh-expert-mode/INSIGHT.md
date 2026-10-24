# dsh-expert-mode

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[ed9a19d](https://github.com/Asher-2000/dsh-expert-mode/tree/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299)

<!-- BEGIN META -->
[![GitHub ★ 14](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=14&color=yellow&logo=github&style=flat)](https://github.com/Asher-2000/dsh-expert-mode) [![npm 30d 307](https://img.shields.io/static/v1?label=npm+30d&message=307&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-expert-mode) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-expert-mode)
<!-- END META -->

> **实现功能**：提供专家协调预设、领域委派工具、渐进式方法、文件消息总线和任务看板。

> **核心亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持领域方法与宿主spawn、文件协作协议的组合增量。任务板和总线提供持久材料，模型必须主动调用；角色数量与提示内容不构成专业效果证据。

> **风险与缺陷**：[Q03](#research-q03) 的核心问题是运行状态与预设部署同树，apply清理可能破坏协作持久性；认领代码未呈现原子锁，package.files未列必需router目录。提示质量门也不能替代产物真实验收。

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
  - [Q01 · 专家协作的合格交付是什么？](#detail-section-11)
  - [Q02 · 预设、分阶段路由和文件总线怎样进入执行？](#detail-section-12)
  - [Q03 · 质量门、任务板和安装过程有哪些实质边界？](#detail-section-13)
  - [Q04 · 是否值得为专家角色引入协作和维护成本？](#detail-section-14)
  - [Q05 · 版本绑定的交付与独立运行态可否改善协作？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向跨前后端、数据或内容等多个领域的复合任务。协调官应选择合适方法、分配目标并回收带证据的结果，合格交付仍由用户具体验收决定，专家角色数量不表示专业正确性。相对普通subagent，这个预设提供领域persona、按需方法、文件消息和任务板，是现成协作约定与入口组合。简单任务保留直接做的通道，有助避免固定多agent成本；法务与金融角色只是提示词，不能据名称赋予资质或真实专业验证。

参照普通宿主subagent与人工项目看板；未运行专家或专业高风险任务，不主张领域资质。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 专家委派预设 | 按领域组织子任务 | 执行仍归宿主，角色不保证专业性 |
| 阶段工具披露 | 控制理解至验证工具面 | 需router资源完整 |
| 文件消息总线 | 专家间持久消息 | 需主动调用脚本和共享文件树 |
| 任务看板 | 依赖与ready/running状态 | 认领为读改写，并发原子性未证 |
| 方法资源 | 按需读取领域指导 | 需人工/模型把关输出 |

#### 启动与依赖
| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH预设发现与官方subagent | 必需 | persona和真实执行 | 安装包不等于已激活 |
| systemPrompt/tools/llm | router必需 | 阶段工具接线 | 路由不可完整加载 |
| Python和共享可写树 | 协作脚本必需 | bus与taskboard | 无文件协作链 |
| router资源随包存在 | composition必需 | 本地模块加载 | 缺失可阻止预设 |
| 独立运行态备份 | 持久协作必要 | 重部署与故障恢复 | 清理可能丢用户状态 |

#### 启动步骤
| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 检查 | 用户先查包清单和目标目录 | router存在，资料已隔离 |
| 激活 | 宿主部署发现预设 | 资源齐备无覆盖用户资料 |
| 委派 | 协调模型选择方法与工具 | 任务owner与验收明确 |
| 验收恢复 | 用户核对产物和看板 | done与真实结果一致，失败不盲重放 |

#### 成本
| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主模型与Python资源 | 确认独立targetDir和发布清单 | 费用耗时未知 |
| 持续使用 | 专家与交叉评审模型调用、文件状态 | 分工、回收、验收与教训维护 | 节token主张未独立测 |
| 失败恢复 | 重试、状态副本 | 查实际副作用、恢复部署树资料 | 并发和重载可能丢状态 |

#### 效果
| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 领域委派 | 宿主spawn加persona | 专业正确性和少返工 |
| 文件协作 | 消息和任务真实落盘 | 并发认领及中断恢复 |
| 渐进工具 | 有阶段工具集合 | 发布包入口齐全与净token改善 |

> **思考**：[Q03](#research-q03) 的核心问题是运行状态与预设部署同树，apply清理可能破坏协作持久性；认领代码未呈现原子锁，package.files未列必需router目录。提示质量门也不能替代产物真实验收。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持领域方法与宿主spawn、文件协作协议的组合增量。任务板和总线提供持久材料，模型必须主动调用；角色数量与提示内容不构成专业效果证据。

[Q01](#research-q01) 与 [Q02](#research-q02) 支持领域方法与宿主spawn、文件协作协议的组合增量。任务板和总线提供持久材料，模型必须主动调用；角色数量与提示内容不构成专业效果证据。

共享文件协议易检查且无专用服务依赖，但load/check/write与直接覆盖JSON不应称原子调度。宿主入口重部署会清理目标树，复用这套安装方式前须分离用户运行态和只读资源。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的核心问题是运行状态与预设部署同树，apply清理可能破坏协作持久性；认领代码未呈现原子锁，package.files未列必需router目录。提示质量门也不能替代产物真实验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前建议观察。潜在受益者是有复合需求且能核查多个输出的人，但首先必须解决部署树保留和分发完整性。首次要确认目标预设目录、模型与Python，持续每个专家、交叉评审和返工都会增加调用与人工整合；渐进披露的节token百分比是作者主张，本轮没有同条件证据。失败恢复要区分任务状态和实际文件副作用，done并不验证交付质量，也不能盲retry已经完成的外部动作。若未来受控试用，应使用独立targetDir、可丢弃任务和明确验收，任何重载清掉用户状态或两个worker同时认领就暂停。 [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

预设与文件协作基础可核查；重部署清理、打包路由和并发认领限制尚待独立实测；资源/运行态分离为假设。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、package.json、lib/index.js、agent.cordis.yml、cordis.patch.yml、.expert-mode/router/router-bootstrap-v34.mjs、.expert-mode/comm/taskboard.py、.expert-mode/comm/bus.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定包入口、composition、router阶段声明和Python总线/看板核心路径；未执行目标脚本。
- 下一步：- 已检查固定源码、composition、包声明和Python文本。
- 未执行目标代码、npm打包、模型或宿主。
- 分发完整性、重载状态保留和并发认领保留具体缺口。

**分析版本**

- **仓库**：[Asher-2000/dsh-expert-mode](https://github.com/Asher-2000/dsh-expert-mode)
- **版本号**：0.9.2（[固定提交 ed9a19d](https://github.com/Asher-2000/dsh-expert-mode/tree/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299)）
- **版本日期**：2026-09-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出资源/运行态隔离加原子租约和交付版本绑定，未验证；应对照重载损失、重复认领和陈旧交付接受率，出现迁移破坏则否定收益。

- 已检查固定源码、composition、包声明和Python文本。
- 未执行目标代码、npm打包、模型或宿主。
- 分发完整性、重载状态保留和并发认领保留具体缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 41 | 3383 | — | — | 30805 |
| .mjs | source | 3 | 1651 | 1340 | 246 | — |
| .js | source | 2 | 102 | 62 | 33 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/Asher-2000/dsh-expert-mode/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：专家路由与方法库能否改善复杂任务分工并避免把提示角色当执行保证？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 专家协作的合格交付是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向跨前后端、数据或内容等多个领域的复合任务。协调官应选择合适方法、分配目标并回收带证据的结果，合格交付仍由用户具体验收决定，专家角色数量不表示专业正确性。相对普通subagent，这个预设提供领域persona、按需方法、文件消息和任务板，是现成协作约定与入口组合。简单任务保留直接做的通道，有助避免固定多agent成本；法务与金融角色只是提示词，不能据名称赋予资质或真实专业验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:33-44](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/README.zh.md#L33-L44)

作者声明简单任务直做和复杂任务委派。

<details>
<summary>查看原文（12行）</summary>

```text
## ✨ 功能介绍

安装此预设后，DSH 自动变成「首席协调官」模式：

| 场景 | 行为 |
|------|------|
| 收到任务 | 识别领域 → 委派给最合适的专家 |
| 复杂任务 | 并行派发多个专家 |
| 简单任务 | 协调官直接处理 — 不强制委派 |
| 任务完成 | 专家在线等待后续修改 |

无需自定义提示词。无需多配置维护。**安装即用。**
```

</details>

**依据 2 · 源码核查**：[agent.cordis.yml:317-335](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/agent.cordis.yml#L317-L335)

专家工具为宿主spawn加persona配置。

<details>
<summary>查看原文（19行）</summary>

```text
    - id: tool-subagent-expert-backend-dev
      name: '@deepseek-ai/dsh-tool-subagent'
      config:
        provider: spawn
        toolName: expert_backend_dev
        backgroundMode: continuable
        persona: |
          你是一位资深后端工程师。方法论：API设计→数据库交互→认证授权→性能优化。
          产出：API接口文档 + 数据库Schema + 安全编码实践。铁律：输入验证优先，错误处理规范化。

    - id: tool-subagent-expert-devops
      name: '@deepseek-ai/dsh-tool-subagent'
      config:
        provider: spawn
        toolName: expert_devops
        backgroundMode: continuable
        persona: |
          你是一位资深DevOps工程师。方法论：CI/CD流水线→容器化→基础设施即代码→监控告警。
          产出：Dockerfile + docker-compose.yml + CI/CD配置 + 部署文档。铁律：不可变基础设施，最小权限原则。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 预设、分阶段路由和文件总线怎样进入执行？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

宿主包apply将agent.cordis.yml等复制到预设发现目录，composition再加载router-bootstrap和官方subagent工具。router有理解、规划、开发、验证四阶段工具集合；它改变工具呈现和可见性，不另提供模型执行后端。bus.py把消息写到脚本旁mailboxes，由专家或协调官通过命令读；taskboard.py在脚本旁tasks存JSON并按依赖提升ready，claim再改running。它们必须实际被模型调用才参与工作，不因脚本存在就自动调度每个专家。依赖DSH对应服务、Python与共享可写文件树。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:68-79](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/lib/index.js#L68-L79)

复制composition和expert材料。

<details>
<summary>查看原文（12行）</summary>

```text
    // Copy top-level preset files (agent.cordis.yml, preset.yml, cordis.patch.yml)
    for (const f of readdirSync(PKG_ROOT, { withFileTypes: true })) {
      if (f.isDirectory() || f.name.startsWith('.') || f.name.endsWith('.bak') || f.name.endsWith('.md') || f.name.endsWith('.json')) {
        continue
      }
      copyFileSync(join(PKG_ROOT, f.name), join(targetDir, f.name))
    }

    // Copy bundled .expert-mode/ tree
    const bundledDir = join(PKG_ROOT, '.expert-mode')
    if (existsSync(bundledDir)) {
      copyDir(bundledDir, join(targetDir, '.expert-mode'))
```

</details>

**依据 2 · 源码核查**：[agent.cordis.yml:140-145](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/agent.cordis.yml#L140-L145)

路由实际引用。

```text
# ── 思维模式路由（router-standard 融合 · We need 优先）────────────────────
# 路由层在首轮分类任务并注入匹配 persona（见 .expert-mode/router/router-bootstrap-v34.mjs）
# persona 已替换为「专家协调官 + We need 优先」，见该文件 RL_PERSONA
- id: router-bootstrap
  name: ./.expert-mode/router/router-bootstrap-v34.mjs?v=3
  config: {}
```

**依据 3 · 源码核查**：[.expert-mode/router/router-bootstrap-v34.mjs:108-138](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/.expert-mode/router/router-bootstrap-v34.mjs#L108-L138)

阶段工具集合。

<details>
<summary>查看原文（31行）</summary>

```text
const STAGES = [
  { name: '了解/对齐', tools: ['read', 'glob', 'grep', 'web_search', 'ask_user_question', 'engram_recall', 'engram_verify', 'engram_respond'] },
  { name: '拟合方案', tools: ['todo_write', 'exit_plan_mode', 'engram_search', 'engram_open'] },
  { name: '开发', tools: ['write', 'edit', 'str_replace_editor', 'engram_store', 'engram_link'] },
  { name: '验证', tools: ['pwsh', 'bash', 'read_image', 'job_list', 'job_output', 'job_kill'] },
]
// 平台事实（v1.12）：win32 已由 gitbash-shell 组提供真 Git Bash（isolate realm 私有 shell seam，
// 机制参照 liceses/dsh-gitbash-preset, MIT）——bash 重回验证档（原 v1.5 的平台剔除已回退）。

/** 阶段表的工具全集（单一事实源：STAGES 派生，v1.18.2）。 */
const STAGE_SAFE = STAGES.flatMap((s) => s.tools)
const GLOBAL_SAFE = [
  ...STAGE_SAFE,
  'tools_catalog', 'tools_help', 'dev_router_status', 'phase_begin', 'phase_advance',
  'engram_recall', 'engram_store', 'engram_propose', 'engram_confirm', 'engram_reject',
  'engram_open', 'engram_search', 'engram_link', 'engram_update', 'engram_remove',
  'engram_promote', 'engram_status', 'engram_verify', 'engram_respond',
  'dev_reload_preset_live', 'delivery_check',
  'get_goal', 'create_goal', 'update_goal',
]

const META_TOOLS = ['phase_advance', 'dev_router_status', 'tools_catalog', 'tools_help']
const META_LIVE = [...META_TOOLS, 'dev_reload_preset_live', 'dev_page_check', 'phase_begin', 'delivery_check', 'dev_reset_experience']
const META_GOAL = ['get_goal', 'create_goal', 'update_goal']
const META_ALL = [...META_LIVE, ...META_GOAL]

/** 窗口（单一事实源）：返回 STAGES.slice 的结束索引。
 *  v1.20（用户定稿）：预解锁归零——`stage+3` 预放两档改为 `stage+1` 只含当前档。
 *  效果：模型每阶段只看到当前阶段工具，看不到后续工具（消除"知道后面有工具"的焦虑与大跃进入口）；
 *  机制框架（windowFor/preUnlockedFor/stageSummary）保留，未来需放宽预放时只改此常量即可回退。 */
export function windowFor(stage) { return Math.min(stage + 1, STAGES.length) }
```

</details>

**依据 4 · 源码核查**：[.expert-mode/comm/bus.py:103-119](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/.expert-mode/comm/bus.py#L103-L119)

消息真正落盘。

<details>
<summary>查看原文（17行）</summary>

```text
def _write_message(frm, to, subject, body, kind="direct"):
    ts = time.time()
    seq = _next_seq()
    mid = f"{int(ts)}_{frm}_{seq}"
    fname = os.path.join(MAILBOXES, to, f"{mid}.msg")
    payload = (
        f"ID: {mid}\n"
        f"FROM: {frm}\n"
        f"TO: {to}\n"
        f"SUBJECT: {subject}\n"
        f"TS: {_now()}\n"
        f"KIND: {kind}\n"
        f"---\n"
        f"{body}\n"
    )
    with open(fname, "w", encoding="utf-8") as f:
        f.write(payload)
```

</details>

**依据 5 · 源码核查**：[.expert-mode/comm/taskboard.py:273-290](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/.expert-mode/comm/taskboard.py#L273-L290)

认领实际为读、改、写。

<details>
<summary>查看原文（18行）</summary>

```text
def cmd_claim(argv):
    """原子认领：ready -> running。认领时检查依赖仍满足。"""
    if len(argv) < 2:
        sys.stderr.write("用法: taskboard.py claim <task_id> <agent>\n")
        return 2
    task_id, agent = argv[0], argv[1]
    t = _load_task(task_id)
    if not t:
        sys.stderr.write(f"[taskboard] 任务 {task_id} 不存在\n")
        return 1
    if not _deps_done(t):
        sys.stderr.write(f"[taskboard] {task_id} 依赖未完成，不可认领\n")
        return 1
    ok, err = _set_status(t, "running", agent=agent)
    if not ok:
        sys.stderr.write(f"[taskboard] {err}\n")
        return 1
    _save_task(t)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 质量门、任务板和安装过程有哪些实质边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

质量门约束仍需分层看待。阶段提示强调交付证据，但不能仅凭reviewed:true或模型填result确认真实验收。任务板claim注释写原子认领，实际_load_task后检查再_save_task，保存直接open('w')，所读链未见锁或compare-and-swap；并发认领和中断可有风险，未运行复现。更直接的是宿主apply每次清理既有targetDir除.git外全部内容后重新复制，用户保存的教训、任务和消息若在该树可能丢失。package.files列出的expert子目录没有router，而composition必需引用router文件，发布产物完整性应核实。

#### 证据与依据

**依据 1 · 源码核查**：[.expert-mode/comm/taskboard.py:97-100](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/.expert-mode/comm/taskboard.py#L97-L100)

直接写JSON无原子替换。

```text
def _save_task(task):
    p = _task_path(task["id"])
    with open(p, "w", encoding="utf-8") as f:
        json.dump(task, f, ensure_ascii=False, indent=2)
```

**依据 2 · 源码核查**：[.expert-mode/comm/taskboard.py:273-290](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/.expert-mode/comm/taskboard.py#L273-L290)

认领为分离读写。

<details>
<summary>查看原文（18行）</summary>

```text
def cmd_claim(argv):
    """原子认领：ready -> running。认领时检查依赖仍满足。"""
    if len(argv) < 2:
        sys.stderr.write("用法: taskboard.py claim <task_id> <agent>\n")
        return 2
    task_id, agent = argv[0], argv[1]
    t = _load_task(task_id)
    if not t:
        sys.stderr.write(f"[taskboard] 任务 {task_id} 不存在\n")
        return 1
    if not _deps_done(t):
        sys.stderr.write(f"[taskboard] {task_id} 依赖未完成，不可认领\n")
        return 1
    ok, err = _set_status(t, "running", agent=agent)
    if not ok:
        sys.stderr.write(f"[taskboard] {err}\n")
        return 1
    _save_task(t)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:51-79](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/lib/index.js#L51-L79)

已有预设树会先清空后复制。

<details>
<summary>查看原文（29行）</summary>

```text
  apply(ctx, config = {}) {
    // Target: ~/.dsh/.agent-presets/expert-mode/
    const targetDir =
      config.targetDir ||
      join(process.env.HOME || '~', '.dsh', '.agent-presets', PRESET_ID)

    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true })
    } else {
      // Clean existing preset to ensure a fresh deploy (idempotent reinstall)
      for (const entry of readdirSync(targetDir, { withFileTypes: true })) {
        if (entry.name === '.git') continue // never nuke user's git history
        const p = join(targetDir, entry.name)
        rmSync(p, { recursive: true, force: true })
      }
    }

    // Copy top-level preset files (agent.cordis.yml, preset.yml, cordis.patch.yml)
    for (const f of readdirSync(PKG_ROOT, { withFileTypes: true })) {
      if (f.isDirectory() || f.name.startsWith('.') || f.name.endsWith('.bak') || f.name.endsWith('.md') || f.name.endsWith('.json')) {
        continue
      }
      copyFileSync(join(PKG_ROOT, f.name), join(targetDir, f.name))
    }

    // Copy bundled .expert-mode/ tree
    const bundledDir = join(PKG_ROOT, '.expert-mode')
    if (existsSync(bundledDir)) {
      copyDir(bundledDir, join(targetDir, '.expert-mode'))
```

</details>

**依据 4 · 源码核查**：[package.json:15-31](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/package.json#L15-L31)

分发白名单未列router目录。

<details>
<summary>查看原文（17行）</summary>

```text
  "main": "lib/index.js",
  "files": [
    "index.js",
    "cordis.patch.yml",
    "agent.cordis.yml",
    "preset.yml",
    ".expert-mode/comm/bus.py",
    ".expert-mode/comm/taskboard.py",
    ".expert-mode/comm/PROTOCOL.md",
    ".expert-mode/experts/",
    ".expert-mode/methods/",
    ".expert-mode/reviews/",
    "README.md",
    "README.zh.md",
    "LICENSE",
    "lib/",
    "dsh.plugin.json"
```

</details>

#### 缺口

- 实际npm包是否缺router、宿主重复apply时的数据保留与并发认领行为未执行核实。
  **影响**：安装即用、持久协作和恢复主张都需要收窄。
  **进一步探讨**：先只读检查发布tar清单，再在独立预设目录用哨兵文件测试重载、并发claim和中断，不使用真实任务资料。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 是否值得为专家角色引入协作和维护成本？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前建议观察。潜在受益者是有复合需求且能核查多个输出的人，但首先必须解决部署树保留和分发完整性。首次要确认目标预设目录、模型与Python，持续每个专家、交叉评审和返工都会增加调用与人工整合；渐进披露的节token百分比是作者主张，本轮没有同条件证据。失败恢复要区分任务状态和实际文件副作用，done并不验证交付质量，也不能盲retry已经完成的外部动作。若未来受控试用，应使用独立targetDir、可丢弃任务和明确验收，任何重载清掉用户状态或两个worker同时认领就暂停。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:51-65](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/lib/index.js#L51-L65)

targetDir可配置但默认重部署清理。

<details>
<summary>查看原文（15行）</summary>

```text
  apply(ctx, config = {}) {
    // Target: ~/.dsh/.agent-presets/expert-mode/
    const targetDir =
      config.targetDir ||
      join(process.env.HOME || '~', '.dsh', '.agent-presets', PRESET_ID)

    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true })
    } else {
      // Clean existing preset to ensure a fresh deploy (idempotent reinstall)
      for (const entry of readdirSync(targetDir, { withFileTypes: true })) {
        if (entry.name === '.git') continue // never nuke user's git history
        const p = join(targetDir, entry.name)
        rmSync(p, { recursive: true, force: true })
      }
```

</details>

**依据 2 · 源码核查**：[.expert-mode/comm/taskboard.py:295-309](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/.expert-mode/comm/taskboard.py#L295-L309)

done仅状态与summary，不验证实际产物。

<details>
<summary>查看原文（15行）</summary>

```text
def cmd_done(argv):
    if not argv:
        sys.stderr.write("用法: taskboard.py done <task_id> [summary]\n")
        return 2
    task_id = argv[0]
    summary = " ".join(argv[1:]) if len(argv) > 1 else ""
    t = _load_task(task_id)
    if not t:
        sys.stderr.write(f"[taskboard] 任务 {task_id} 不存在\n")
        return 1
    ok, err = _set_status(t, "done", reason=summary)
    if not ok:
        sys.stderr.write(f"[taskboard] {err}\n")
        return 1
    _save_task(t)
```

</details>

**依据 3 · 作者声明**：[README.zh.md:98-111](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/README.zh.md#L98-L111)

评审与效率宣传为作者声明，不作实测。

<details>
<summary>查看原文（14行）</summary>

```text
## 🛡️ 核心功能

| 功能 | 说明 |
|------|------|
| 🎯 **智能委派** | 自动识别任务领域，路由给最合适的专家 |
| 🚀 **快速通道** | 简单任务直接处理 — 不强制委派 |
| 🔄 **五锚约束** | 每轮自检，防止跑题和低效循环 |
| 🤝 **交叉评审** | 高风险任务多专家独立评审 |
| 💾 **经验沉淀** | 教训自动保存，下次注入 |
| 💬 **专家间总线** | 文件消息总线(bus.py)：专家直接收发，零协调官中转，支持 P2P |
| 📋 **任务调度器** | 文件系统任务看板(taskboard.py)：pending/ready/running/done/failed 状态机 + 依赖DAG + 重试 + 崩溃恢复 — 真实调度，不止对话协调 |
| 🚦 **质量门禁** | 高风险任务五段式流水线：需求澄清→实现→验证→审查→集成。独立专家评审，最多回炉 2 轮 |
| ⚡ **故障恢复** | 超时自动重试，连续失败换方案 |
| 📉 **渐进式披露** | 方法论按需注入，token 减少 28% |
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 版本绑定的交付与独立运行态可否改善协作？

**研究主题**：新假设与验证

#### 完整回答

由部署覆盖共享运行树与认领非事务两点推导，未验证方向是把只读预设资源、可变任务/邮箱和长期教训分目录；任务用原子租约认领，并将完成结果绑定需求修订、owner和源码版本。这样可减少重载损失和旧结果冒充当前交付，代价是状态迁移、租约超时和额外验收。最小对照用并发认领、重载和需求变更场景，观察重复所有者、状态损失和陈旧结果接受率；若租约恢复仍重复或迁移破坏已有资料，就不支持方案。不是当前实现能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:59-79](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/lib/index.js#L59-L79)

资源与可变树一起清理/复制。

<details>
<summary>查看原文（21行）</summary>

```text
    } else {
      // Clean existing preset to ensure a fresh deploy (idempotent reinstall)
      for (const entry of readdirSync(targetDir, { withFileTypes: true })) {
        if (entry.name === '.git') continue // never nuke user's git history
        const p = join(targetDir, entry.name)
        rmSync(p, { recursive: true, force: true })
      }
    }

    // Copy top-level preset files (agent.cordis.yml, preset.yml, cordis.patch.yml)
    for (const f of readdirSync(PKG_ROOT, { withFileTypes: true })) {
      if (f.isDirectory() || f.name.startsWith('.') || f.name.endsWith('.bak') || f.name.endsWith('.md') || f.name.endsWith('.json')) {
        continue
      }
      copyFileSync(join(PKG_ROOT, f.name), join(targetDir, f.name))
    }

    // Copy bundled .expert-mode/ tree
    const bundledDir = join(PKG_ROOT, '.expert-mode')
    if (existsSync(bundledDir)) {
      copyDir(bundledDir, join(targetDir, '.expert-mode'))
```

</details>

**依据 2 · 源码核查**：[.expert-mode/comm/taskboard.py:273-290](https://github.com/Asher-2000/dsh-expert-mode/blob/ed9a19d64bb0fc1889ebcb1a998ca3716c56d299/.expert-mode/comm/taskboard.py#L273-L290)

认领缺原子租约。

<details>
<summary>查看原文（18行）</summary>

```text
def cmd_claim(argv):
    """原子认领：ready -> running。认领时检查依赖仍满足。"""
    if len(argv) < 2:
        sys.stderr.write("用法: taskboard.py claim <task_id> <agent>\n")
        return 2
    task_id, agent = argv[0], argv[1]
    t = _load_task(task_id)
    if not t:
        sys.stderr.write(f"[taskboard] 任务 {task_id} 不存在\n")
        return 1
    if not _deps_done(t):
        sys.stderr.write(f"[taskboard] {task_id} 依赖未完成，不可认领\n")
        return 1
    ok, err = _set_status(t, "running", agent=agent)
    if not ok:
        sys.stderr.write(f"[taskboard] {err}\n")
        return 1
    _save_task(t)
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
