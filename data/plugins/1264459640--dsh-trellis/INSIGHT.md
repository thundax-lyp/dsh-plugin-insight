# dsh-trellis

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[e5b3912](https://github.com/1264459640/dsh-trellis/tree/e5b39122d3a4b93dbfc07a660a6294af21cb18d5)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1264459640/dsh-trellis) [![npm 30d 1,504](https://img.shields.io/static/v1?label=npm+30d&message=1%2C504&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis)
<!-- END META -->

> **实现功能**：为DSH提供功能、缺陷和重构三轨任务产物、步骤状态、会话恢复提示及Web看板。

> **核心亮点**：把三轨任务产物、单一steps、会话绑定/每轮提示与看板连接，降低仅靠聊天和手工清单恢复的接线负担；不归属为新通用任务算法。详见[Q01](#research-q01)。

> **风险与缺陷**：human是模型可填标签，完整steps替换/verification降级与Git探测失败放行限制强验收主张；planning只读为工具组装过滤且保留shell，不是权限沙箱。详见[Q03](#research-q03)。

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
  - [Q01 · 谁用什么交付物恢复开发任务，贡献归谁？](#detail-section-11)
  - [Q02 · 状态与会话/看板怎样连接，哪些边界设计可借鉴？](#detail-section-12)
  - [Q03 · 验证和只读是强制授权门吗？](#detail-section-13)
  - [Q04 · 部署、持续与恢复需要哪些投入？](#detail-section-14)
  - [Q05 · 如何采用并进一步探讨可信验收？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合跨会话推进功能、缺陷与重构的维护者，用版本化任务产物、单一steps状态、会话指针和阶段提示恢复工作；最终仍验真实业务代码。

手工Markdown清单+Git+项目CI是直接替代。保持相同任务及真实验收证据，比较跨会话遗漏、恢复耗时和额外记录；流水线标签的完备性不能自证任务质量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 三轨任务/产物 | 功能、缺陷、重构 | 业务验收另核 |
| steps与会话绑定 | 逐步推进/恢复目标 | 验证标签可模型写 |
| 15个Skill目录 | 部署开发流程指导 | 自动覆盖同名官方目录 |
| Web看板 | 查看/显式激活任务 | 依赖Host身份/会话 |
| 可选planning过滤 | 减少常见写工具暴露 | 保留shell，非沙箱 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配DSH fs/tools/提示与Cordis | 必需 | 任务和阶段接线 | 按peer代际核接口 |
| 显式cwd allowlist | 必需 | 只介入受管项目 | 默认空不介入 |
| 可写.agents/skills与.trellis | 必需 | 首轮部署/升级和任务产物 | 同名定制可能被覆盖，先备份 |
| Git和项目质量流程 | 收尾必需 | 提交提示及真实验收 | Git异常可放行，需独立核查 |
| Web remotes/slots | 看板可选 | 状态与绑定 | trust fence不是完整认证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份同名Skill/任务，设allowlist | 清楚首次会自动写入/升级 |
| 规划 | 用户真实同意任务和设计，Agent记录 | 外部保留批准来源，非仅字段 |
| 实施 | Agent推进steps并保存产物 | 代码与任务指针对应 |
| 验收 | 人员独立核业务与测试收据 | human标签不当批准证据 |
| 收尾/恢复 | 用户核commit和实际文件后归档 | Gitunknown独立处理，失败不盲重写 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Skill/模板/任务本地存储及Host | allowlist、备份合并同名定制、定验收 | 安装工时和覆盖范围需核 |
| 持续使用 | 每轮提示token、任务JSON/文档/Git | 写需求/设计与独立验证 | 无同任务费用和净工时对照 |
| 失败恢复 | 备份、重复模型调用与部分写入资源 | 核代码/产物后修指针及部署 | 无跨文件事务，恢复耗时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 任务可恢复 | 文件产物、steps和会话指针 | 实际遗漏/恢复人时 |
| 阶段可见 | 每轮提示与看板投影 | 设计真实批准及任务正确 |
| 收尾提示 | 步骤与Git检查 | 标签来源可伪造/可降级，非强验收 |

> **思考**：human是模型可填标签，完整steps替换/verification降级与Git探测失败放行限制强验收主张；planning只读为工具组装过滤且保留shell，不是权限沙箱。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把三轨任务产物、单一steps、会话绑定/每轮提示与看板连接，降低仅靠聊天和手工清单恢复的接线负担；不归属为新通用任务算法。详见[Q01](#research-q01)。

把三轨任务产物、单一steps、会话绑定/每轮提示与看板连接，降低仅靠聊天和手工清单恢复的接线负担；不归属为新通用任务算法。详见[Q01](#research-q01)。

任务指针不被显式别项更新隐式重绑、summary epoch和活动会话cwd绑定值得借鉴；artifact当前兼容agent.session身份，但验证标签与只读过滤仍须外部真实收据和执行策略。[Q02](#research-q02)、[Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

human是模型可填标签，完整steps替换/verification降级与Git探测失败放行限制强验收主张；planning只读为工具组装过滤且保留shell，不是权限沙箱。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可试用为人工复核开发任务辅助，先备份同名Skill并核自动覆盖；独立保存批准/验证与固定代码版本，不以标签或只读过滤代授权。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码支持已描述的入口、接线与数据流；贡献和采用价值为源码级解释，运行效果、真实宿主兼容与收益对照尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、skills/trellis-start/SKILL.md、skills/trellis-feat/SKILL.md、lib/skills.js、lib/index.js、lib/artifact.js、lib/trust.js、lib/task.js、lib/git.js、lib/readonly.js、skills/trellis-finish-work/SKILL.md、test/native-steps.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取task步骤规范/更新/完成、Git门禁、readonly全模块、核心index工具/API/每轮钩子、artifact/trust/skills部署及四份关键Skill和原生步骤测试设计；其余Skill仅目录定义，不全面审阅客户端/归档/全部模板及外部Host，不运行目标/测试/宿主。
- 下一步：按 [Q05](#research-q05) 对自签human、整组替换、verification降级、空steps、旧SHA及Git超时比较凭据原型；真实批准不可由普通task字段代替。

**分析版本**

- **仓库**：[1264459640/dsh-trellis](https://github.com/1264459640/dsh-trellis)
- **版本号**：0.4.7（[固定提交 e5b3912](https://github.com/1264459640/dsh-trellis/tree/e5b39122d3a4b93dbfc07a660a6294af21cb18d5)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索与代码/要求版本绑定的独立验收凭据，把unknown与clean分开，并用假事件/Git矩阵证伪；尚未实现。详见[Q05](#research-q05)。

按 [Q05](#research-q05) 对自签human、整组替换、verification降级、空steps、旧SHA及Git超时比较凭据原型；真实批准不可由普通task字段代替。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 167 | 10622 | — | — | 172496 |
| .md | test | 2 | 465 | — | — | 9297 |
| .mjs | source | 5 | 907 | 737 | 117 | — |
| .js | source | 16 | 8180 | 5936 | 1847 | — |
| .js | test | 17 | 4900 | 4026 | 450 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1264459640/dsh-trellis/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/1264459640/dsh-trellis/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/1264459640/dsh-trellis/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核三轨任务与会话恢复的贡献、实际验收/只读边界、自更新成本和可信凭据假设。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁用什么交付物恢复开发任务，贡献归谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合DSH中跨会话推进功能、缺陷与重构的维护者。原有办法是聊天约定、手工Markdown清单和Git记录；当前把任务产物、task.json.steps、会话指针与每轮阶段提示接到Host，并用Web看板显示/选择任务。合格交付仍是满足业务验收的代码，附有可恢复的需求、设计、检查与归档记录，不能以绿色步骤替代业务完成。

Trellis理念与阶段/状态受既有Trellis启发，DSH适配、三轨产物和单一steps状态为本项目增量，不是新通用任务算法。Skill以提示规定创建任务须同意、设计批准后实施、独立审查与测试业务双验收；这些是有价值的工作约定，但须与JS实际门禁分开。15个bundled Skill由文件复制到项目，不等15个常驻Agent或15个强制验证器。

#### 证据与依据

**依据 1 · 源码核查**：[skills/trellis-start/SKILL.md:7-47](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/skills/trellis-start/SKILL.md#L7-L47)

当前固定版本复核。意图与授权约定。

<details>
<summary>查看原文（41行）</summary>

````text

当当前会话无活跃任务（`no_task` 状态）时，根据用户需求分类，并在**获得明确同意后**创建任务。

## 前置条件与意图分类

| 用户诉求类型 | 典型场景 | 推荐轨道 / 动作 | 处理原则 |
|---|---|---|---|
| 普通问答 / 查代码 | "这函数在哪调用的"、"解释下这段逻辑" | 直接回答 | **绝不碰 Trellis，不建任务** |
| 一次性免任务快修 | "改个注释"、"免任务直接改" | 调 `trellis_task_skip` | 征得同意后跳过任务只读保护直接改 |
| 新功能 / 业务变动 | "开发用户登录功能"、"接入微信支付" | `feat` 轨道 | 询问用户是否创建 `feat` 任务并进入规划 |
| Bug / 缺陷修复 | "保存报错 500"、"列表加载不出来" | `issue` 轨道 | 询问用户是否创建 `issue` 任务并进入排查 |
| 内部代码优化 | "拆分 2000 行文件"、"提取通用模块" | `refactor` 轨道 | 询问用户是否创建 `refactor` 任务并进入设计 |

## 建任务规则与工具调用

建任务**必须且只能通过内置工具 `trellis_task_create`**：

```json
trellis_task_create({
  "workType": "feat | issue | refactor",
  "title": "任务标题（如：支持微信支付接入）",
  "name": "简短英文名（如：wechat-pay）",
  "mode": "standard | quick"
})
```

- **自动化动作**：工具会自动写入 `.trellis/tasks/<slug>/task.json`（status=planning）、播种初始产物模板，并同步写入会话指针 `.trellis/.runtime/sessions/`，使得每轮面包屑、工作流状态和 Web 徽标立即生效。
- **目录名严格校验**：slug 格式必须符合 `<work-type>-<mm-dd>-<短名>`（如 `feat-10-21-wechat-pay`），由工具自动生成和校验。
- **严禁手动操作**：严禁手动 `mkdir` 创建任务目录，或手写 session json 文件。

## 范围澄清提问规则

- 若用户诉求模糊，在建任务前澄清范围时，**单次只提一个最高价值问题**。
- 优先提供推荐选项与不同选择的权衡说明，不问开放式发散问题。
- 先查阅仓库既有代码与文档，绝不凭空捏造不存在的规范层级。

## 硬性卡点

1. **未经用户同意严禁擅自建任务**：任何任务的创建必须先征得用户明确同意。
2. **建任务（planning）≠ 批准写代码（impl）**：获得建任务同意仅代表进入规划期（工作区仍受只读保护），方案未获批前绝对禁止修改业务代码。
3. **已有活跃任务绝不重复建**：若系统已报告活跃任务，优先通过 `trellis-continue` 恢复上下文，切勿重复新建。
````

</details>

**依据 2 · 源码核查**：[skills/trellis-feat/SKILL.md:69-108](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/skills/trellis-feat/SKILL.md#L69-L108)

当前固定版本复核。阶段/人卡约定。

<details>
<summary>查看原文（40行）</summary>

````text
| 有 prd；standard 且无 design 或 design.status≠approved | design | 写/改 `design.md`（聚焦需求拆解与实现方案，按 YAGNI/KISS 保持精简），**等人确认** |
| design approved；planning 产物齐 + 人卡通过 | 规划期用 `trellis_task_update` 录入 `steps`（含验收与 `verification`）；写 `task.json.status=in_progress` | 进入 impl |
| in_progress；代码未完成 | impl | `trellis-before-dev` → 按 `task.json.steps` 逐步实现（可派实现子代理） |
| 实现完成；review 非 passed | review | **派独立子代理**写 `review.md`；机械自修可另用 `trellis-check` |
| review 过；check 未通过 | check | 派 `trellis-check`，按项目 `.trellis/spec/` 质量门验证；将结果写入 `review.md` |
| check 通过 | finish | `trellis-update-spec`（如有）→ commit → `trellis-finish-work` / archive |

**Quick 路径**：prd（可轻）→（可选极简 design）→ 写 `status=in_progress` → impl → check/review 精简 → finish。
仍禁止无验收标准就开写。

## 人卡点（硬）

1. **design 未 approved**（standard）→ 禁止写 `status=in_progress`、禁止改业务代码。
2. **code review = blocking**（`review.md`）→ 禁止 archive；应回到 impl 修复后重审。
3. **`trellis-check` 或任务要求的验证未通过** → 禁止宣称完成 / archive。
4. 用户对 design 的确认必须是**本回合之后**的明确回复；创建 task ≠ 批准实现。

## 产物

从 `_templates/feat/` 复制（若 task 目录不存在）：

```text
prd.md
design.md
review.md
```

> 执行步骤清单不设独立文件：一律由 `task.json.steps` 承载（规划期录入、执行期单步推进）。

## 子代理调度

| 阶段 | 子代理 | 写入 | 说明 |
|------|--------|------|------|
| impl | 实现子代理（可选） | 业务代码 | 按 prd/design 实现 |
| review | 独立子代理 | `review.md` | 独立代码审查（findings-first） |
| 自修/验证 | `trellis-check` | 可改代码 | 对照 spec 自修 + 项目验证门；与独立审查互补，不互相替代 |

调度要求：
1. dispatch prompt 必须以 `Active task: <task 目录路径>` 开头。
2. code-review **必须由主会话派发**，实现主会话不得"自己写个 review 冒充独立审查"。
````

</details>

**依据 3 · 源码核查**：[lib/skills.js:100-115](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/skills.js#L100-L115)

当前固定版本复核。15个目录。

<details>
<summary>查看原文（16行）</summary>

```text
const SKILL_DIRS = [
  'trellis-start',
  'trellis-brainstorm',
  'trellis-before-dev',
  'trellis-check',
  'trellis-update-spec',
  'trellis-finish-work',
  'trellis-continue',
  'trellis-break-loop',
  'trellis-channel',
  'trellis-meta',
  'trellis-session-insight',
  'trellis-spec-bootstrap',
  'trellis-feat',
  'trellis-issue',
  'trellis-refactor',
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 状态与会话/看板怎样连接，哪些边界设计可借鉴？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

task.json保存轨道、stage、steps与验收状态，当前会话指针指定活动任务。update明确不自动重绑目标任务，显式slug更新其他任务不会悄悄改变当前会话。每轮pre-step按cwd allowlist解析项目与状态、注入提示和活动步骤，summary epoch防旧异步结果覆盖新UI；这些比只靠聊天历史恢复更明确。

Web状态/看板/绑定都是POST，先检查Host/Origin trust fence，再核session存在和allowlist。绑定根路径来自活会话cwd，不信请求任意root，slug格式/任务存在检查并传Host sandboxPolicy，是可借鉴的目标固定。trust.js明确不是身份认证层，Origin可缺失且本机Host可通过，外层Host身份/部署仍需独立承担，不能把该fence叫完整鉴权。

artifact写入仅标准basename、slug/direct-child及路径relative检查，使用ctx.fs resolve/writeText和sandboxPolicy。模块自身为词法边界，不做真实路径符号链接证明；是否拒绝物理路径外写取决Host文件系统策略，不从注释“physically impossible”推沙箱。

当前artifact在未显式给slug时，先取exec.sessionId，再回退exec.agent.session.id查活动任务，使会话归属更贴合宿主执行上下文；标准路径用join再relative校验。该修补改善定位，不改变批准/验证的信任来源，显式slug更新仍需用户核目标任务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:900-1025](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/index.js#L900-L1025)

当前固定版本复核。API信任/会话/绑定。

<details>
<summary>查看原文（126行）</summary>

```text
            ok: true,
            error: null,
            project: root,
            slug: result.slug,
            taskDir: result.taskDir,
            month: result.month,
            bucket: result.bucket,
            archivedAt: result.archivedAt,
            unbound: result.unbound,
            gitCheck: result.gitCheck || null,
          }
        } catch (error) {
          // Map sandbox denials to the model-facing marker (like the harness
          // editor tools) so the escalation flow stays recognizable.
          if (error && error.code === 'FS_SANDBOX_DENIED') {
            const mode = sandboxPolicy && sandboxPolicy.mode !== void 0 ? sandboxPolicy.mode : 'unknown'
            throw new Error(`[sandbox: file access denied under ${mode} mode]`)
          }
          throw error
        }
      },
    })
    const disposeArchiveTool = ctx.tools.register(archiveTool)
    ctx.effect(() => disposeArchiveTool)

    // --- trellis_artifact_update: sandboxed artifact write channel ----------
    const artifactTool = createArtifactUpdateTool({ ctx, effectiveConfig })
    const disposeArtifactTool = ctx.tools.register(artifactTool)
    ctx.effect(() => disposeArtifactTool)

    ctx.inject(['webServer', 'sessions'], (web) => {
      /**
       * Resolve the current project summary for a session. The cwd comes from
       * the session header (trusted source) — never from the request or the
       * model. Writes no files; guarded refresh publishes the current summary.
       * @param {string} sessionId live session id.
       * @param {boolean} [inline] codex-inline dispatch flag.
       * @returns {Promise<object>} path-free summary.
       */
      const refreshSummary = async (sessionId, inline = false) => {
        const session = web.sessions.get(sessionId)
        const cwd = normalizePath(session && session.header ? session.header.cwd : undefined)
        const root = matchAllowlist(cwd, effectiveConfig.get().allowlist)
        if (!root) {
          const value = { kind: 'no-match', phase: 'no_task' }
          cacheSummary(sessionId, value)
          return value
        }
        return refreshSessionSummary(root, sessionId, inline)
      }

      // Same-origin read-only route: cached hits avoid IO; a miss resolves the
      // current session state once (with mutation fencing). Never writes files.
      const disposeRoute = web.webServer.register({
        kind: 'prefix',
        path: API_PREFIX,
        handler: async (req, res) => {
          try {
            // Trust fence first (design contract), then method + shape checks.
            if (!isTrustedApiRequest(req.headers)) {
              respondJson(res, 403, { ok: false, error: 'forbidden' })
              return
            }
            if (req.method !== 'POST') {
              respondJson(res, 405, { ok: false, error: 'method not allowed' })
              return
            }
            let pathname = '/'
            try {
              pathname = new URL(req.url || '/', 'http://localhost').pathname
            } catch {
              /* fall through with '/' */
            }
            if (pathname !== TASK_STATE_PATH && pathname !== BOARD_PATH && pathname !== BIND_PATH) {
              respondJson(res, 404, { ok: false, error: 'not found' })
              return
            }
            let body = null
            try {
              body = await readJsonBody(req)
            } catch {
              respondJson(res, 400, { ok: false, error: 'bad request' })
              return
            }

            if (pathname === TASK_STATE_PATH) {
              const sessionId = body && typeof body.sessionId === 'string' ? body.sessionId : ''
              const live = sessionId ? web.sessions.get(sessionId) : undefined
              let value
              if (live && sessionId) {
                const cached = summaries.get(sessionId)
                // Cache hit serves without touching the filesystem. A miss
                // (fresh process, or a session that has not run a turn yet)
                // resolves once on demand and caches, so the chip never sits
                // in the dead 'no-summary' state after a restart.
                value = cached || await refreshSummary(sessionId, effectiveConfig.get().inline === true)
              } else {
                value = { kind: 'no-summary', phase: 'no_task' }
              }
              respondJson(res, 200, { ok: true, value })
              return
            }

            if (pathname === BOARD_PATH) {
              const sessionId = body && typeof body.sessionId === 'string' ? body.sessionId : ''
              const live = sessionId ? web.sessions.get(sessionId) : undefined
              if (!live) {
                respondJson(res, 200, { ok: true, value: { kind: 'no-summary', phase: 'no_task' } })
                return
              }
              const cwd = normalizePath(live.header ? live.header.cwd : undefined)
              const root = matchAllowlist(cwd, effectiveConfig.get().allowlist)
              if (!root) {
                respondJson(res, 200, { ok: true, value: { kind: 'no-match', phase: 'no_task' } })
                return
              }
              const board = await buildBoard(web.fs, root, sessionId, effectiveConfig.get().inline === true)
              respondJson(res, 200, { ok: true, value: board })
              return
            }

            // BIND_PATH: explicit activate (taskSlug) / deactivate (null) for
            // THIS session only. The project root comes from the live session
            // header cwd (trusted) — never from the request; the task slug is
            // format-checked and existence-checked against that root.
            const sessionId = body && typeof body.sessionId === 'string' ? body.sessionId : ''
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1116-1185](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/index.js#L1116-L1185)

当前固定版本复核。每轮解析/提示/epoch。

<details>
<summary>查看原文（70行）</summary>

```text
                ? exec.agent.session.id
                : undefined
            if (!sessionId) return { kind: 'no-summary', phase: 'no_task' }
            const summary = await refreshSummary(sessionId, effectiveConfig.get().inline === true)
            return summary
          },
        }),
      )
      web.effect(() => disposeUiTool)
    })

    // --- Read-only planning + project-spec index ---------------------------
    // Two independent concerns share one assembly pass:
    //
    //  A) READ-ONLY ENFORCEMENT (gated by enforceReadonlyPlanning). When the
    //     session cwd matches the allowlist, TRIM the tool surface by
    //     AUTHORIZATION state (lib/readonly.js) using DENYLIST semantics — only
    //     the specified tools are removed:
    //       undecided (no task, not skipped) → trim write/edit + task-write trellis tools
    //       planning (task in planning)       → trim write/edit + create/skip/archive trellis tools
    //       authorized (approved / skipped)   → full tool surface, no trimming
    //     Every other tool — including tools registered by other plugins
    //     (web_search, generate_image, subagent, skill, ...) — is preserved.
    //     For undecided/planning an explicit read-only instruction section is
    //     APPENDED (appendReadonlyInstruction), so the model sees its read-only
    //     state in the prompt text, not just a pruned tool surface.
    //
    //  B) PROJECT-SPEC INDEX (own switch: injectSpecIndex; NOT gated by the
    //     readonly one — the index is domain knowledge, not a write guard). This
    //     plugin no longer creates or injects `.trellis/workflow.md`, which used
    //     to be the only runtime path that told the model a project carries
    //     `.trellis/spec/`. We restore that awareness as a compact INDEX
    //     (`trellis:spec-index`): the list of governing spec files, anchored to
    //     the project root, plus a read-first constraint. Bodies are never
    //     injected — the model opens the file that actually governs its change.
    //     No specs on disk → no section, so the assembly stays byte-identical.
    ctx.on('system-prompt/assemble', async (assembly, context, next) => {
      const assembled = await next()
      const effective = effectiveConfig.get()

      // AssembleContext carries no `agent` (0.1.7): the assembling agent is the
      // process-local initiator, so resolve the session cwd from it.
      const agent = (ctx.agents && typeof ctx.agents.currentInitiator === 'function' && ctx.agents.currentInitiator()) || undefined
      const cwd = normalizePath(agent && agent.session && agent.session.header ? agent.session.header.cwd : undefined)
      const root = matchAllowlist(cwd, effective.allowlist)
      if (!root) return assembled

      const sessionId = agent && agent.session && typeof agent.session.id === 'string' ? agent.session.id : undefined

      let tools = null
      let sections = null

      if (effective.enforceReadonlyPlanning) {
        const st = await resolveProjectState(ctx.fs, root, effective.inline === true, sessionId)
        tools = applyReadonlyPolicy(assembled.tools, st.phase, st.skipState)
        sections = appendReadonlyInstruction(
          applyReadonlySections(assembled.sections, st.phase, st.skipState) ?? assembled.sections,
          st.phase,
          st.skipState,
        )
      }

      if (effective.injectSpecIndex !== false) {
        sections =
          appendSpecInstruction(
            sections ?? assembled.sections,
            await resolveSpecIndex(ctx.fs, root, context && context.signal),
          ) ?? sections
      }

```

</details>

**依据 3 · 源码核查**：[lib/artifact.js:45-91](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/artifact.js#L45-L91)

当前固定版本复核。词法约束。

<details>
<summary>查看原文（47行）</summary>

```text
 * @param {string} slug task slug
 * @param {string} artifact base file name
 * @returns {string} resolved target absolute path
 */
export function assertSafeArtifactPath(root, slug, artifact) {
  if (typeof slug !== 'string' || !slug.trim()) {
    throw new Error('任务 slug 不能为空')
  }
  const safeSlug = slug.trim()
  if (!SLUG_CHARSET.test(safeSlug)) {
    throw new Error(`非法的任务 slug：包含路径分隔符或越权字符 (${safeSlug})`)
  }

  // Belt-and-suspenders: the slug must resolve to a DIRECT child of the tasks
  // dir (rejects `.`, `..`, and any dotted/pathological segment that slips past
  // the charset guard).
  const tasksDir = path.join(root, '.trellis', 'tasks')
  const taskDir = path.join(tasksDir, safeSlug)
  const taskRel = path.relative(tasksDir, taskDir)
  if (taskRel !== safeSlug || taskRel.startsWith('..') || path.isAbsolute(taskRel)) {
    throw new Error(`非法的任务 slug：路径越权 (${safeSlug})`)
  }

  if (typeof artifact !== 'string' || !artifact.trim()) {
    throw new Error('artifact 名称不能为空')
  }
  const name = artifact.trim()
  if (!ALLOWED_ARTIFACTS.has(name)) {
    throw new Error(
      `不允许更新非标准产物文件 "${name}"；合法产物仅限：${[...ALLOWED_ARTIFACTS].join(', ')}`,
    )
  }
  if (name.includes('/') || name.includes('\\') || name.includes('..')) {
    throw new Error(`非法的文件名包含路径穿越或分隔符: "${name}"`)
  }

  const targetPath = path.join(taskDir, name)

  // Ensure targetPath is strictly inside taskDir
  const rel = path.relative(taskDir, targetPath)
  if (rel.startsWith('..') || path.isAbsolute(rel) || rel !== name) {
    throw new Error(`路径越权：产物写入必须局限在当前任务目录内 (${name})`)
  }

  return targetPath
}

```

</details>

**依据 4 · 源码核查**：[lib/artifact.js:121-145](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/artifact.js#L121-L145)

当前固定版本复核。Host写入。

<details>
<summary>查看原文（25行）</summary>

```text
  let targetPath
  try {
    targetPath = assertSafeArtifactPath(root, slug, args.artifact)
  } catch (err) {
    return { ok: false, error: err.message }
  }

  const taskJsonPath = path.join(root, '.trellis', 'tasks', slug, 'task.json')
  const taskJsonTarget = await dshFs.resolve(taskJsonPath)
  const stat = await dshFs.stat(taskJsonTarget)
  if (!stat) {
    return { ok: false, error: `任务目录不存在：.trellis/tasks/${slug}/` }
  }

  const resolvedTarget = await dshFs.resolve(targetPath)
  await dshFs.writeText(resolvedTarget, content, undefined, exec.signal, sandboxPolicy)

  return {
    ok: true,
    slug,
    artifact: args.artifact.trim(),
    filePath: `.trellis/tasks/${slug}/${args.artifact.trim()}`,
    bytesWritten: Buffer.byteLength(content, 'utf8'),
  }
}
```

</details>

**依据 5 · 源码核查**：[lib/trust.js:1-60](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/trust.js#L1-L60)

当前固定版本复核。非认证层。

<details>
<summary>查看原文（60行）</summary>

```text
/**
 * Local browser-trust fence for the Web UI's read-only API route.
 *
 * Mirrors the semantics of `@deepseek-ai/dsh-client-connection`'s
 * `isTrustedApiRequest` (loopback/trusted Host + same-origin browser markers)
 * so a request that passes it is either our own page or a loopback client.
 * That function is NOT exported from the package's public entry, so we
 * re-implement the ~40-line rule locally instead of importing an unstable
 * deep path or adding a runtime dependency. This is not an auth layer.
 */

/** Whether a hostname is loopback (localhost, 127.0.0.0/8, ::1, 0.0.0.0). */
function isLoopbackHostname(hostname) {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '[::1]' ||
    hostname === '0.0.0.0' ||
    /^127\.\d{1,3}(\.\d{1,3}){2}$/.test(hostname)
  )
}

/**
 * Decide whether one request may reach the task-state route.
 * @param {import('node:http').IncomingHttpHeaders} headers the request headers.
 * @param {string[]} [trustedHosts] non-loopback `host`/`host:port` authorities
 *   this deployment serves (empty for the loopback-only web profile).
 * @returns {boolean} true when the Host is ours and any attached browser
 *   markers (sec-fetch-site, origin) are same-origin.
 */
export function isTrustedApiRequest(headers, trustedHosts = []) {
  const host = headers && typeof headers.host === 'string' ? headers.host : undefined
  if (!host) return false
  let hostUrl
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  const entries = Array.isArray(trustedHosts) ? trustedHosts : []
  const hostOk =
    isLoopbackHostname(hostUrl.hostname) ||
    entries.some((entry) => {
      try {
        return new URL('http://' + entry).host === hostUrl.host
      } catch {
        return false
      }
    })
  if (!hostOk) return false
  if (headers['sec-fetch-site'] === 'cross-site') return false
  const origin = headers.origin
  if (origin === undefined || origin === '') return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
}
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1188-1232](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/index.js#L1188-L1232)

当前固定版本复核。相同步骤缓存缩成一行提醒并按source-kind去重本轮提示

<details>
<summary>查看原文（45行）</summary>

```text
          ...assembled,
          ...(tools ? { tools } : {}),
          ...(sections ? { sections } : {}),
        }
      }
      return assembled
    })

    // --- per-turn breadcrumb injection -------------------------------------
    ctx.on('agent/pre-step', async ({ agent, messages, step, signal }, next) => {
      const decision = await next()
      if (decision.kind === 'reject') return decision

      const cwd = normalizePath(agent && agent.session && agent.session.header ? agent.session.header.cwd : undefined)
      const root = matchAllowlist(cwd, effectiveConfig.get().allowlist)
      if (!root) return decision

      const effective = effectiveConfig.get()
      if (effective.injectStep !== undefined && step !== effective.injectStep) return decision

      const lastUser = extractMessageText(messages[messages.length - 1])
      if (shouldSkip(lastUser, effective.skipKeywords)) return decision

      signal?.throwIfAborted()

      const inline = effective.inline === true

      // --- skill provisioning (session-start, once per project root) --------
      // Detect whether the project's .agents/skills carries the trellis skills;
      // copy the missing ones from the package when absent, skip when present.
      // Never throws into the turn: a provisioning failure only warns and the
      // breadcrumb still injects (skills remain copyable on a later turn).
      let provisionedNote = ''
      try {
        const policy = ctx.fs.sandboxMode === void 0 ? void 0 : ctx.get('sandboxPolicy')
        const sandboxPolicy = policy
          ? policy.resolve({ ...(agent === void 0 ? {} : { session: agent.session }) })
          : void 0
        const provisioned = await ensureProjectSkills(ctx.fs, root, {
          signal: signal ?? undefined,
          sandboxPolicy,
        })
        if (provisioned.updated && provisioned.updated.length > 0) {
          provisionedNote =
            `\n\n（已自动将 trellis-* 技能同步更新至 v${provisioned.version}：` +
```

</details>

**依据 7 · 源码核查**：[lib/artifact.js:101-113](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/artifact.js#L101-L113)

缺slug时兼容agent.session.id回退，找不到活动任务仍拒绝。

<details>
<summary>查看原文（13行）</summary>

```text
export async function updateTaskArtifact(dshFs, root, args, exec = {}, sandboxPolicy) {
  let slug = args.slug && typeof args.slug === 'string' ? args.slug.trim() : undefined
  if (!slug) {
    const sessionId =
      typeof exec.sessionId === 'string'
        ? exec.sessionId
        : exec.agent && exec.agent.session && typeof exec.agent.session.id === 'string'
          ? exec.agent.session.id
          : undefined
    slug = await findActiveTaskSlug(dshFs, root, sessionId)
    if (!slug) {
      return { ok: false, error: '未指定 slug 且当前会话未绑定任何活动任务' }
    }
```

</details>

#### 缺口

- Host物理路径策略和外层API身份隔离未包含在本插件源码证明中。
  **影响**：不能从词法检查/Host头判断部署鉴权或符号链接隔离。
  **进一步探讨**：核固定Host fs.resolve/writeText与HTTP认证契约，分别检查物理路径和身份边界。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 验证和只读是强制授权门吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

增量step更新有实质逻辑，AI/human验证步骤完成前要先有verified记录，blocked/未完成会阻止任务完成。可是human只是工具参数verifiedBy="human"，没有独立用户审批来源或签名，verificationNotes也非强制测试收据。模型能改verification为none；整组steps替换允许直接带completed/verified/verifiedBy，随后按结果列表检查，空列表也通过。两调用约束只覆盖相应增量路径，不能推出用户批准、独立审查或测试真实通过。实现阶段更新也未核design文件批准来源。

Git门禁检查工作区/声明文件，但git不可用、权限/非仓库和部分失败返回clean=true，超时也带warning放行。modified_files由调用方声明，列表外脏文件告警允许，列表内只核干净和最近30提交历史，非当前任务基线/代码SHA/验收绑定。它有流程提示价值，不能证明这次业务实现已提交且通过。

enforceReadonlyPlanning默认关闭。开启后在system-prompt组装时删除特定write/edit/Trellis工具并改提示段，不是执行前拒绝所有写操作；READ_TOOLS显式保留bash/pwsh，其他插件写工具可保留，unknown阶段视authorized。可减少常见误写，但不能提供工作区只读安全保证。Skill“硬卡点”与运行时能力应分层呈现，不把静态条件说成已执行绕过。

#### 证据与依据

**依据 1 · 源码核查**：[lib/task.js:55-110](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/task.js#L55-L110)

当前固定版本复核。整组字段。

<details>
<summary>查看原文（56行）</summary>

```text
    const item = steps[i]
    if (!item || typeof item !== 'object') {
      return { ok: false, error: `steps[${i}] 必须是对象` }
    }
    const id = item.id !== undefined && item.id !== null ? String(item.id).trim() : ''
    if (!id) {
      return { ok: false, error: `steps[${i}].id 不能为空` }
    }
    if (ids.has(id)) {
      return { ok: false, error: `steps 存在重复的 id: "${id}"` }
    }
    ids.add(id)

    const title = typeof item.title === 'string' ? item.title.trim() : ''
    if (!title) {
      return { ok: false, error: `steps[${i}].title 不能为空` }
    }
    const status = item.status ? String(item.status).trim() : 'pending'
    if (!STEP_STATUSES.includes(status)) {
      return { ok: false, error: `steps[${i}].status 必须是 ${STEP_STATUSES.join(' | ')} 之一（当前：${status}）` }
    }
    const step = {
      id,
      title,
      status,
    }
    if (item.spec && typeof item.spec === 'string' && item.spec.trim()) {
      step.spec = item.spec.trim()
    }
    if (Array.isArray(item.acceptance)) {
      const acceptance = item.acceptance.filter((a) => typeof a === 'string' && a.trim()).map((a) => a.trim())
      if (acceptance.length > 0) step.acceptance = acceptance
    }
    if (typeof item.verification === 'string') {
      const verification = item.verification.trim()
      if (!STEP_VERIFICATION_TYPES.includes(verification)) {
        return { ok: false, error: `steps[${i}].verification 必须是 ${STEP_VERIFICATION_TYPES.join(' | ')} 之一（当前：${verification}）` }
      }
      step.verification = verification
    }
    if (typeof item.verify === 'boolean') {
      step.verify = item.verify
    }
    if (typeof item.verified === 'boolean') {
      step.verified = item.verified
    }
    if (item.verifiedBy === 'ai' || item.verifiedBy === 'human') {
      step.verifiedBy = item.verifiedBy
    }
    if (item.verificationNotes && typeof item.verificationNotes === 'string' && item.verificationNotes.trim()) {
      step.verificationNotes = item.verificationNotes.trim()
    }
    if (item.blockedReason && typeof item.blockedReason === 'string' && item.blockedReason.trim()) {
      step.blockedReason = item.blockedReason.trim()
    }
    normalized.push(step)
```

</details>

**依据 2 · 源码核查**：[lib/task.js:172-301](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/task.js#L172-L301)

当前固定版本复核。增量/空组验收。

<details>
<summary>查看原文（130行）</summary>

```text
 * be marked `completed` when `verified === true` is ALREADY present in the
 * persisted state (recorded by a prior update call), preventing self-
 * certification in a single call.
 *
 * Verification subject (`verification`):
 *  - 'ai'    — model-run automated verification (verify: true is a legacy alias
 *              for this); marking `verified: true` is the model's own record.
 *  - 'human' — manual approval gate: `verified: true` REQUIRES `verifiedBy:
 *              'human'` (the human explicitly confirmed in the conversation),
 *              otherwise the model cannot self-certify the step.
 *  - 'none'  — no verification requirement; may go straight to completed.
 *
 * Blocked linkage: a step moved to `blocked` must carry a `blockedReason`
 * (either in this update or already persisted).
 * @param {Array<object>} existingSteps
 * @param {object} update validated step update
 * @returns {{ ok: true, steps: Array<object>, updated: object } | { ok: false, error: string }}
 */
export function applyStepUpdate(existingSteps, update) {
  if (!Array.isArray(existingSteps)) {
    return { ok: false, error: '当前任务尚未定义任何 steps 步骤列表' }
  }
  const index = existingSteps.findIndex((s) => String(s.id) === String(update.id))
  if (index === -1) {
    return { ok: false, error: `未找到 ID 为 "${update.id}" 的步骤` }
  }

  const current = existingSteps[index]
  const next = { ...current }

  // Verification mode resolution: explicit `verification` wins over the legacy
  // `verify: true` alias (verify: true === verification: 'ai').
  const verification =
    update.verification !== undefined
      ? update.verification
      : current.verification !== undefined
        ? current.verification
        : current.verify === true
          ? 'ai'
          : 'none'

  if (update.verification !== undefined) {
    next.verification = update.verification
  }
  if (update.verified !== undefined) {
    if (update.verified === true && verification === 'human' && update.verifiedBy !== 'human') {
      return {
        ok: false,
        error: `[trellis/human_gate] 步骤 "${current.title}" (${current.id}) 声明了人工验收要求 (verification: human)，标记 verified: true 必须同时提供 verifiedBy: 'human'（用户在对话中的明确确认），禁止模型自证自签`,
      }
    }
    next.verified = update.verified === true
    if (update.verified === true) {
      next.verifiedBy = update.verifiedBy === 'human' ? 'human' : 'ai'
    }
  }
  if (update.verifiedBy !== undefined) {
    next.verifiedBy = update.verifiedBy
  }
  if (update.verificationNotes !== undefined) {
    next.verificationNotes = update.verificationNotes
  }
  if (update.blockedReason !== undefined) {
    next.blockedReason = update.blockedReason
  }

  if (update.status !== undefined) {
    if (update.status === 'completed') {
      if (verification === 'ai' && current.verified !== true) {
        return {
          ok: false,
          error: `[trellis/verification_gate] 步骤 "${current.title}" (${current.id}) 声明了自动化验证要求 (verification: ai)，请先单独调用 trellis_task_update 记录 verified: true 后再标记 completed`,
        }
      }
      if (verification === 'human' && (current.verified !== true || current.verifiedBy !== 'human')) {
        return {
          ok: false,
          error: `[trellis/human_gate] 步骤 "${current.title}" (${current.id}) 声明了人工验收要求 (verification: human)，在用户明确确认并持久化 verified: true + verifiedBy: 'human' 前禁止标记为 completed`,
        }
      }
    }
    if (update.status === 'blocked' && !next.blockedReason) {
      return {
        ok: false,
        error: `[trellis/steps_blocked] 步骤 "${current.title}" (${current.id}) 标记为 blocked 时必须提供 blockedReason 说明阻塞原因`,
      }
    }
    next.status = update.status
  }

  const updatedList = [...existingSteps]
  updatedList[index] = next
  return { ok: true, steps: updatedList, updated: next }
}

/**
 * Check whether all steps are cleanly completed and verified before closing a task.
 * @param {Array<object> | undefined} steps
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function checkStepsCompletion(steps) {
  if (!Array.isArray(steps) || steps.length === 0) return { ok: true }
  const incomplete = []
  const unverified = []
  const blocked = []
  for (const st of steps) {
    if (st.status === 'blocked') {
      blocked.push(`${st.title || st.id}${st.blockedReason ? `（${st.blockedReason}）` : ''}`)
      continue
    }
    if (st.status !== 'completed') {
      incomplete.push(`${st.title || st.id} (${st.status || 'pending'})`)
    } else if (st.verify === true || st.verification === 'ai' || st.verification === 'human') {
      if (st.verified !== true) {
        unverified.push(`${st.title || st.id}`)
      } else if (st.verification === 'human' && st.verifiedBy !== 'human') {
        unverified.push(`${st.title || st.id}（人工验收未确认）`)
      }
    }
  }
  if (blocked.length > 0) {
    return { ok: false, error: `[trellis/steps_blocked] 以下步骤处于阻塞状态，禁止提前完结任务：${blocked.join('；')}` }
  }
  if (incomplete.length > 0) {
    return { ok: false, error: `[trellis/steps_incomplete] 仍有未完成的执行步骤：${incomplete.join('；')}，禁止提前完结任务` }
  }
  if (unverified.length > 0) {
    return { ok: false, error: `[trellis/steps_unverified] 以下步骤未通过质量验证：${unverified.join('；')}，禁止提前完结任务` }
  }
  return { ok: true }
```

</details>

**依据 3 · 源码核查**：[lib/task.js:880-915](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/task.js#L880-L915)

当前固定版本复核。替换与完成门。

<details>
<summary>查看原文（36行）</summary>

```text
    if (args.description.trim()) {
      taskJson.description = args.description.trim()
    } else {
      delete taskJson.description
    }
  }

  // Apply steps replacement if provided (batch init / reset)
  if (args.steps !== undefined) {
    taskJson.steps = args.steps
  }

  // Apply single step update if provided (incremental advance)
  if (args.step !== undefined) {
    const applyRes = applyStepUpdate(taskJson.steps, args.step)
    if (!applyRes.ok) {
      return { ok: false, error: applyRes.error }
    }
    taskJson.steps = applyRes.steps
  }

  // If updating to status='completed', enforce steps completion gate and git cleanliness check
  let gitCheck = null
  if (args.status === 'completed') {
    const gateCheck = checkStepsCompletion(taskJson.steps)
    if (!gateCheck.ok) {
      return { ok: false, error: gateCheck.error }
    }
    gitCheck = await checkGitCleanliness(root, { modifiedFiles: args.modified_files, action: 'complete' })
    if (!gitCheck.clean && gitCheck.error) {
      return { ok: false, error: gitCheck.error }
    }
  }

  // Write updated task.json
  await dshFs.writeText(taskJsonTarget, JSON.stringify(taskJson, null, 2), undefined, signal, sandboxPolicy)
```

</details>

**依据 4 · 源码核查**：[lib/index.js:600-641](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/index.js#L600-L641)

当前固定版本复核。模型可填human/降级。

<details>
<summary>查看原文（42行）</summary>

```text
        if (!root) {
          return { ok: false, error: '项目不在 allowlist 内；请先在 Web 设置或配置里把项目根加入 trellis-workflow.allowlist', project: null, sessionFile: null, skipped: false }
        }
        const sessionId =
          exec.agent && exec.agent.session && typeof exec.agent.session.id === 'string'
            ? exec.agent.session.id
            : void 0
        const policy = ctx.fs.sandboxMode === void 0 ? void 0 : ctx.get('sandboxPolicy')
        if (ctx.fs.sandboxMode !== void 0 && policy === void 0) {
          throw new Error('trellis_task_skip: the mounted filesystem confines but ctx.sandboxPolicy is missing')
        }
        const sandboxPolicy = policy
          ? policy.resolve({ ...(exec.agent === void 0 ? {} : { session: exec.agent.session }) })
          : void 0
        try {
          const result = await skipTaskPointer(ctx.fs, root, sessionId, {
            signal: exec.signal,
            sandboxPolicy,
          })
          if (!result.ok) {
            return { ok: false, error: result.error, project: root, sessionFile: null, skipped: false }
          }
          // Resolve the actual pointer in case a newer bind followed this
          // skip write. The skip flag affects authorization, not display phase.
          if (sessionId) {
            invalidateSummary(sessionId)
            await refreshSessionSummary(root, sessionId, effectiveConfig.get().inline === true)
          }
          return { ok: true, error: null, project: root, sessionFile: result.sessionFile, skipped: true }
        } catch (error) {
          if (error && error.code === 'FS_SANDBOX_DENIED') {
            const mode = sandboxPolicy && sandboxPolicy.mode !== void 0 ? sandboxPolicy.mode : 'unknown'
            throw new Error(`[sandbox: file access denied under ${mode} mode]`)
          }
          throw error
        }
      },
    })
    const disposeSkipTool = ctx.tools.register(skipTool)
    ctx.effect(() => disposeSkipTool)

    // --- task update tool ----------------------------------------------------
```

</details>

**依据 5 · 源码核查**：[lib/git.js:151-258](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/git.js#L151-L258)

当前固定版本复核。失败放行/声明范围。

<details>
<summary>查看原文（108行）</summary>

```text
export function checkGitCleanliness(root, options = {}) {
  const timeout = typeof options.timeout === 'number' ? options.timeout : 2000
  const ignorePatterns = Array.isArray(options.ignorePatterns) ? options.ignorePatterns : DEFAULT_GIT_IGNORES
  const declaredFiles = Array.isArray(options.modifiedFiles)
    ? options.modifiedFiles.map(normalizeRelPath).filter(Boolean)
    : undefined
  // Action-specific wording: distinct verbs per call site, neutral when omitted.
  const actionPhrase = options.action === 'complete' ? '完成任务前' : options.action === 'archive' ? '归档任务前' : '完成或归档任务前'
  // Guidance appended to the global-dirty failure to make the scoped relaxation discoverable.
  const scopedGuidance =
    `\n\n提示：若上述改动与本次任务无关，可传 modified_files 声明本任务实际改动的文件做局部校验（清单内文件须已提交；清单外改动放行并告警）。` +
    `该参数是调用期凭据、不会写入 task.json，需在完成任务（trellis_task_update status=completed）或归档（trellis_task_archive）时再次传入。`

  return new Promise((resolve) => {
    try {
      execFile(
        'git',
        ['-c', 'core.quotepath=false', 'status', '--porcelain', '-uall'],
        { cwd: root, timeout, windowsHide: true },
        async (err, stdout, stderr) => {
          if (err) {
            // If not a git repository or git not found, degrade gracefully
            const errStr = String((err && err.message) || '') + String(stderr || '')
            if (
              err.code === 'ENOENT' ||
              err.code === 'EPERM' ||
              errStr.includes('not a git repository') ||
              errStr.includes('fatal: not a git repository') ||
              err.code === 128
            ) {
              return resolve({ clean: true, isGitRepo: false, dirtyFiles: [], uncommittedFiles: [] })
            }
            // On timeout or unexpected error, resolve with error message but do not hard crash
            if (err.killed || err.signal === 'SIGTERM') {
              return resolve({ clean: true, isGitRepo: true, dirtyFiles: [], uncommittedFiles: [], warning: 'git status 检查超时，已跳过' })
            }
            return resolve({ clean: true, isGitRepo: false, dirtyFiles: [], uncommittedFiles: [], warning: `git status 失败: ${errStr}` })
          }

          // 1. Check workspace uncommitted changes (dirty files)
          const entries = parsePorcelainOutput(stdout)
          const dirty = filterDirtyEntries(entries, ignorePatterns)

          let warning
          if (declaredFiles && declaredFiles.length > 0) {
            // Scoped check: only dirty files matching declared modifiedFiles will block completion/archival
            const declaredSet = new Set(declaredFiles)
            const dirtyInDeclared = dirty.filter((e) => declaredSet.has(e.path))
            if (dirtyInDeclared.length > 0) {
              const dirtyFiles = dirtyInDeclared.map((e) => `${e.code} ${e.path}`)
              return resolve({
                clean: false,
                isGitRepo: true,
                dirtyFiles,
                uncommittedFiles: [],
                error:
                  `[trellis/git_declared_dirty] modified_files 中声明的文件本身存在未提交修改：\n` +
                  dirtyInDeclared.map((e) => `  - ${e.code} ${e.path}`).join('\n') +
                  `\n\n请先 git add / git commit 提交上述声明文件，再${actionPhrase}。` +
                  `（清单内文件必须已提交；与任务无关的改动无需列入，也不会阻塞。）`,
              })
            }
            if (dirty.length > 0) {
              warning = `工作区存在 ${dirty.length} 个未包含在 modified_files 中的未提交修改，已基于声明列表放行。`
            }
          } else if (dirty.length > 0) {
            const dirtyFiles = dirty.map((e) => `${e.code} ${e.path}`)
            return resolve({
              clean: false,
              isGitRepo: true,
              dirtyFiles,
              uncommittedFiles: [],
              error:
                `[trellis/git_dirty] 项目工作区存在未提交的修改文件：\n` +
                dirty.map((e) => `  - ${e.code} ${e.path}`).join('\n') +
                `\n\n请先使用 git add / git commit 提交上述修改后再${actionPhrase}。` +
                scopedGuidance,
            })
          }

          // 2. If modifiedFiles was provided and non-empty, verify they were actually committed in git history
          if (declaredFiles && declaredFiles.length > 0) {
            const { isGitRepo, committedFiles } = await fetchRecentCommittedFiles(root, 30, timeout)
            if (isGitRepo) {
              const missingInCommits = declaredFiles.filter((f) => !committedFiles.has(f))
              if (missingInCommits.length > 0) {
                return resolve({
                  clean: false,
                  isGitRepo: true,
                  dirtyFiles: [],
                  uncommittedFiles: missingInCommits,
                  error:
                    `[trellis/git_uncommitted] 声明的修改文件在最近的 Git 提交记录中未找到修改或提交记录：\n` +
                    missingInCommits.map((f) => `  - ${f}`).join('\n') +
                    `\n\n请确认这些文件是否已真正保存并执行 git commit 提交。`,
                })
              }
            }
          }

          return resolve({ clean: true, isGitRepo: true, dirtyFiles: [], uncommittedFiles: [], ...(warning ? { warning } : {}) })
        },
      )
    } catch {
      return resolve({ clean: true, isGitRepo: false, dirtyFiles: [], uncommittedFiles: [] })
    }
  })
}
```

</details>

**依据 6 · 源码核查**：[lib/readonly.js:25-113](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/readonly.js#L25-L113)

当前固定版本复核。名单/状态。

<details>
<summary>查看原文（89行）</summary>

```text
 * `enforceReadonlyPlanning: true` and an allowlist match.
 */

/** Read/analysis + shell tools shared by every read-only level (informational). */
export const READ_TOOLS = ['read', 'glob', 'grep', 'read_image', 'inspect_image', 'pwsh', 'bash']

/**
 * Tools trimmed in the `undecided` state (no task yet, not skipped):
 * generic code write tools plus trellis task tools that require an existing
 * task / bind a task. Everything else — read tools, other plugins' tools,
 * trellis_state / trellis_task_create / trellis_task_skip — stays available.
 */
export const UNDECIDED_TRIM = new Set([
  'write',
  'edit',
  'trellis_task_update',
  'trellis_artifact_update',
  'trellis_task_archive',
  'trellis_ui_update',
])

/**
 * Tools trimmed in the `planning` state (task exists, plan not yet approved):
 * generic code write tools plus trellis lifecycle tools invalid while a task
 * is being planned (create would rebind, skip is only valid without a task).
 * Everything else — read tools, other plugins' tools, trellis_state /
 * trellis_task_update / trellis_artifact_update — stays available.
 */
export const PLANNING_TRIM = new Set([
  'write',
  'edit',
  'trellis_task_create',
  'trellis_task_skip',
  'trellis_task_archive',
  'trellis_ui_update',
])

/** The three authorization states a session can be in. */
export const AUTHORIZATIONS = ['undecided', 'planning', 'authorized']

/**
 * Fixed section `name` for the injected read-only instruction. Must stay
 * unique and non-empty with a string `text` to satisfy the harness assembly
 * invariant (@deepseek-ai/dsh-system-prompt/lib/invariant.js).
 */
export const READONLY_SECTION = 'trellis:readonly'

/**
 * Resolve the authorization state from the display phase plus the session's
 * skip flag. Pure decision.
 * @param {string | null | undefined} phase one of lib/state.js PHASES.
 * @param {boolean} [skipState] true when the session pointer carries skipped:true.
 * @returns {string} one of AUTHORIZATIONS.
 */
export function authorizationOf(phase, skipState = false) {
  if (phase === 'planning' || phase === 'planning-inline') return 'planning'
  if (phase === 'no_task') return skipState === true ? 'authorized' : 'undecided'
  // in_progress / completed / unknown → full write access.
  return 'authorized'
}

/**
 * The tools to TRIM (remove) for an authorization state, or null when the
 * state is freely writable (no pruning). Denylist semantics: only these named
 * tools are removed; every other tool (including other plugins') is kept.
 * @param {string} authorization one of AUTHORIZATIONS.
 * @returns {Set<string> | null}
 */
export function trimToolsFor(authorization) {
  if (authorization === 'undecided') return UNDECIDED_TRIM
  if (authorization === 'planning') return PLANNING_TRIM
  return null
}

/**
 * Apply the read-only tool filter to an assembled tool list.
 * @param {Array<{ name?: string } | null | undefined> | null | undefined} tools
 *   the assembled tool surface (items carry a `.name`).
 * @param {string | null | undefined} phase resolved Trellis phase.
 * @param {boolean} [skipState] session skip flag.
 * @returns {Array | null} the pruned tool list, or null when no pruning applies
 *   (caller keeps the original list untouched).
 */
export function applyReadonlyPolicy(tools, phase, skipState = false) {
  if (!Array.isArray(tools)) return null
  const authorization = authorizationOf(phase, skipState)
  const trimmed = trimToolsFor(authorization)
  if (!trimmed) return null
  return tools.filter((t) => t && typeof t.name === 'string' && !trimmed.has(t.name))
```

</details>

**依据 7 · 源码核查**：[lib/index.js:1087-1114](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/index.js#L1087-L1114)

当前固定版本复核。仅组装过滤。

<details>
<summary>查看原文（28行）</summary>

```text

      // Model-facing refresh trigger: empty parameters; the session and cwd
      // come from exec.agent (trusted host context), never from the model.
      const disposeUiTool = web.tools.register(
        defineTool({
          name: 'trellis_ui_update',
          description:
            'Refresh the Web UI Trellis task-phase chip cache for the current session. No parameters. Call after a Trellis stage switch, task creation, or check completion so the session-header chip shows the new phase; returns the refreshed summary.',
          parameters: {},
          output: {
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                kind: { type: 'string' },
                title: { oneOf: [{ type: 'string' }, { type: 'null' }] },
                status: { oneOf: [{ type: 'string' }, { type: 'null' }] },
                stage: { oneOf: [{ type: 'string' }, { type: 'null' }] },
                phase: { type: 'string' },
                workType: { oneOf: [{ type: 'string' }, { type: 'null' }] },
              },
            },
            render(args, value) {
              return [{ type: 'text', text: JSON.stringify(value, null, 2) }]
            },
          },
          async execute(args, exec) {
            const sessionId =
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署、持续与恢复需要哪些投入？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

启动仅介入显式cwd allowlist项目；匹配项目会复制bundled Skill、共享模板和版本marker，任务文件与会话指针持续保存。作者称自包含不等于无项目写入，首次进入与升级均须先备份同名目录。

Skill部署用版本marker判断升级，同版本只检查目录存在；升级或force覆盖官方同名目录/模板，不比较用户编辑内容，其他名字保留。marker写失败仅warn，逐文件写入非事务，部分更新可残留；还尝试删除明确废弃模板。不是所有用户自定义Skill都不受影响。

持续开销包括每轮提示上下文、任务JSON/产物维护和Git查询；主要人工成本在需求/设计、真实批准与独立业务验收。失败恢复要先核实际代码、步骤状态、会话指针和已写文件，不能只重置绿色标签。缺任务总token、工时、合格率及中断恢复数据，不给节省承诺。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-92](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/package.json#L1-L92)

当前固定版本复核。包/peer。

<details>
<summary>查看原文（92行）</summary>

```text
{
  "name": "@banana-peeljj12/dsh-trellis",
  "version": "0.4.7",
  "description": "Self-contained Trellis workflow trigger for DeepSeek Harness: per-turn breadcrumb injection via agent/pre-step, a bundled skill provider, and DSH-native task/phase state resolution. No Trellis AGPL code is vendored; workflow semantics are rewritten and licensed MIT.",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "icon": "icon.svg",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-plugin-manager",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar-right",
        "@deepseek-ai/dsh-client-ui-workspace"
      ],
      "platform": "web"
    }
  },
  "bin": {
    "trellis-install": "./scripts/install.mjs"
  },
  "scripts": {
    "test": "node --test",
    "install:trellis": "node ./scripts/install.mjs"
  },  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./icon": "./icon.svg",
    "./package.json": "./package.json",
    "./skills/*": "./skills/*"
  },
  "files": [
    "lib",
    "skills",
    "scripts",
    "icon.svg",
    "docs/images/architecture.drawio.png",
    "cordis.patch.yml",
    "README_EN.md"
  ],
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/1264459640/dsh-trellis.git"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-agent": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-fs": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-llm": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-session": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-settings": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-tools": "^0.2.0-rc.2",
    "@deepseek-ai/schemastery": "^3.18.4"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.4",
    "@deepseek-ai/dsh-agent": "0.2.0-rc.2",
    "@deepseek-ai/dsh-fs": "0.2.0-rc.2",
    "@deepseek-ai/dsh-llm": "0.2.0-rc.2",
    "@deepseek-ai/dsh-session": "0.2.0-rc.2",
    "@deepseek-ai/dsh-settings": "0.2.0-rc.2",
    "@deepseek-ai/dsh-tools": "0.2.0-rc.2",
    "@deepseek-ai/schemastery": "3.18.4"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-settings": {
      "optional": true
    }
  },
  "keywords": [
    "cordis",
    "deepseek-harness",
    "dsh",
    "trellis",
    "workflow"
  ]
}
```

</details>

**依据 2 · 源码核查**：[lib/skills.js:139-236](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/skills.js#L139-L236)

当前固定版本复核。版本覆盖/marker/清理。

<details>
<summary>查看原文（98行）</summary>

```text
 *  - Same version: presence check skips existing skills (zero write overhead).
 *  - New version / upgrade / force: overwrites official `SKILL_DIRS` and templates
 *    with the package's latest version (self-updating).
 * Custom skills created by users in `.agents/skills/` remain untouched.
 *
 * @param {import('@deepseek-ai/dsh-fs').FileSystem} dshFs ctx.fs.
 * @param {string} root normalized project root (allowlist-matched).
 * @param {object} [opts] { signal?, sandboxPolicy?, force? } forwarded to writes.
 * @returns {Promise<{ copied: string[], updated: string[], present: string[], version: string }>}
 */
export async function ensureProjectSkills(dshFs, root, { signal, sandboxPolicy, force = false } = {}) {
  const targetRoot = path.join(root, '.agents', 'skills')
  const copied = []
  const updated = []
  const present = []

  // Check version record in project
  let installedVersion = null
  try {
    const versionTarget = await dshFs.resolve(path.join(targetRoot, VERSION_FILE_NAME))
    const info = await dshFs.stat(versionTarget)
    if (info) {
      const raw = await dshFs.readText(versionTarget, signal)
      if (typeof raw === 'string') installedVersion = raw.trim()
    }
  } catch {
    /* absent or unreadable */
  }

  const isUpgrade = force || (installedVersion !== PACKAGE_VERSION)

  // One listing decides presence; absent dir → empty (nothing present yet).
  let existing = new Set()
  try {
    const dirTarget = await dshFs.resolve(targetRoot)
    const entries = await dshFs.listDir(dirTarget)
    existing = new Set(entries.map((entry) => entry.name))
  } catch {
    /* .agents/skills absent — treat as empty */
  }

  // 1. Skill directories
  for (const id of SKILL_DIRS) {
    const srcDir = path.join(skillsRoot, id)
    if (!fs.existsSync(srcDir)) continue
    const alreadyExists = existing.has(id)

    if (alreadyExists && !isUpgrade) {
      present.push(id)
      continue
    }

    for (const rel of collectFiles(srcDir)) {
      const t = await dshFs.resolve(path.join(targetRoot, id, rel))
      const content = fs.readFileSync(path.join(srcDir, rel), 'utf8')
      await dshFs.writeText(t, content, undefined, signal, sandboxPolicy)
    }

    if (alreadyExists) {
      updated.push(id)
    } else {
      copied.push(id)
    }
  }

  // 2. Shared artifact templates (`_templates/`), copied file-by-file.
  const tplSrc = path.join(skillsRoot, '_templates')
  if (fs.existsSync(tplSrc)) {
    for (const rel of collectFiles(tplSrc)) {
      const t = await dshFs.resolve(path.join(targetRoot, '_templates', rel))
      if (!isUpgrade) {
        const info = await dshFs.stat(t)
        if (info) continue
      }
      const content = fs.readFileSync(path.join(tplSrc, rel), 'utf8')
      await dshFs.writeText(t, content, undefined, signal, sandboxPolicy)
    }
  }

  // 3. Write/update .trellis-version marker if anything was provisioned or version changed
  if (copied.length > 0 || updated.length > 0 || isUpgrade) {
    try {
      const versionTarget = await dshFs.resolve(path.join(targetRoot, VERSION_FILE_NAME))
      await dshFs.writeText(versionTarget, PACKAGE_VERSION, undefined, signal, sandboxPolicy)
    } catch (err) {
      console.warn(`[${'trellis'}] failed to write .trellis-version:`, err && err.message)
    }
  }

  // 4. Self-healing prune of deprecated templates (implement.md / checklist.yaml)
  try {
    await pruneDeprecatedProjectTemplates(dshFs, root, { sandboxPolicy })
  } catch (error) {
    console.warn(`[${'trellis'}] deprecated-template prune skipped:`, error && error.message)
  }

  return { copied, updated, present, version: PACKAGE_VERSION }
}
```

</details>

**依据 3 · 源码核查**：[skills/trellis-finish-work/SKILL.md:11-33](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/skills/trellis-finish-work/SKILL.md#L11-L33)

当前固定版本复核。收尾顺序与范围。

<details>
<summary>查看原文（23行）</summary>

```text

提交顺序必须为：**业务实现提交（Work commit） $\to$ 任务归档提交（Archive commit） $\to$ 研发日志提交（Journal commit）**。绝不要将工作流簿记与实际业务改动混在一起。

| 步骤 | 操作目标 | 具体动作 / 工具 | 重点要求与注意事项 |
|---|---|---|---|
| 1. 提交业务代码 | 提交业务实现 | `git commit` 提交业务实现与测试文件 | 先提交业务代码；**除非用户明确要求，否则绝不擅自执行 `git push`** |
| 2. 标记任务完成 | 标记完成 | 调 `trellis_task_update({ status: 'completed' })` | 工具会执行严格的 Git 干净度硬门禁检查 |
| 3. 安全归档任务 | 归档持久化 | **征得用户同意后**，调 `trellis_task_archive({ slug: '...' })` | 自动移动到 `.trellis/tasks/archive/<yyyy-mm>/<slug>/` 并解绑会话指针 |
| 4. 沉淀研发日志 | 追加月报 | 在 `.trellis/journal/<yyyy-mm>.md` 追加本次交付摘要 | 更新任务索引，记录本次交付的业务价值与关键改动点 |
| 5. 完结汇报 | 告知用户 | 向用户明确指出归档记录与代码提交的落脚点 | 告知任务已成功收口 |

## 作用域放宽机制（Scoped relaxation）

`trellis_task_update(status: 'completed')` 与 `trellis_task_archive` 内置了严格的 Git 干净度门禁。
- 若工作区存在与当前任务无关的未提交改动（如并行任务、临时实验文件），可在调用工具时通过 **`modified_files`** 参数传入本任务实际涉及的文件列表。
- 门禁将只校验这些声明的文件是否干净提交，允许列表外的改动以告警形式通过。

## 硬性卡点

1. **先提交业务代码，再提交工作流簿记**：顺序绝对不能颠倒。
2. **严禁物理删除任务目录**：归档是移动目录持久化保存，严禁使用 `rm -rf` 直接删除历史任务目录，严禁手动搬运文件夹。
3. **严禁执行 `git commit --amend` 篡改历史**。
4. **尊重用户手动提交流**：若用户选择自己手动执行 `git commit`，在用户确认后直接跳到收尾汇报，不要强行重复提出提交计划。
```

</details>

**依据 4 · 源码核查**：[lib/skills.js:50-96](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/skills.js#L50-L96)

当前固定版本复核。四个硬编码废弃模板及实际policy检查后unlink

<details>
<summary>查看原文（47行）</summary>

```text
export const DEPRECATED_PROJECT_TEMPLATES = [
  path.join('.agents', 'skills', '_templates', 'feat', 'implement.md'),
  path.join('.agents', 'skills', '_templates', 'refactor', 'checklist.yaml'),
  path.join('.trellis', 'templates', 'feat', 'implement.md'),
  path.join('.trellis', 'templates', 'refactor', 'checklist.yaml'),
]

/**
 * Prune deprecated project template files (self-healing migration).
 *
 * The harness fs (ctx.fs) has no delete primitive, so this uses node:fs
 * unlink — a tightly-bounded exception like the archive move: paths are
 * hard-coded relative, validated to sit inside the project root, and fenced by
 * `assertPolicyAllowsWrite` (fail-closed on read-only / outside-workspace
 * policies). Failures never throw into the turn: a prune that cannot run
 * (e.g. read-only sandbox) is skipped silently so breadcrumb injection keeps
 * working; the next writable turn retries.
 * @param {import('@deepseek-ai/dsh-fs').FileSystem} dshFs ctx.fs.
 * @param {string} root normalized project root (allowlist-matched).
 * @param {object} [opts] { sandboxPolicy? } resolved per-call policy.
 * @returns {{ pruned: string[], skipped: string[] }}
 */
export async function pruneDeprecatedProjectTemplates(dshFs, root, { sandboxPolicy } = {}) {
  const pruned = []
  const skipped = []
  for (const rel of DEPRECATED_PROJECT_TEMPLATES) {
    const abs = path.join(root, rel)
    try {
      const target = await dshFs.resolve(abs)
      const info = await dshFs.stat(target)
      if (!info) continue
      // Policy fence for the node:fs mutation (fail-closed, mirrors archive).
      try {
        assertPolicyAllowsWrite(sandboxPolicy, rel.replace(/\\/g, '/'), root)
      } catch (err) {
        skipped.push(rel)
        continue
      }
      // unlink takes the real path string, not the resolved fs target object.
      fs.unlinkSync(abs)
      pruned.push(rel)
      console.log(`[trellis] pruned deprecated template: ${rel}`)
    } catch {
      /* absent or unreadable — nothing to prune */
    }
  }
  return { pruned, skipped }
```

</details>

#### 缺口

- 同任务相对手工清单的恢复正确率、上下文token与总人时未知。
  **影响**：不能量化收益或声称更低总成本。
  **进一步探讨**：固定需求/中断点比较恢复目标正确性、验收遗漏及规划/审查/恢复人时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何采用并进一步探讨可信验收？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可试用为有人工复核的开发工作流辅助，先用可丢弃项目审自动Skill覆盖，保留独立代码/业务检查。不要把planning过滤当权限沙箱或human标签当用户审批；重要任务在外部保存真实批准、固定提交和验证收据后再接受完成。现有增量是结构化任务与Host恢复，不需要声称强制审批才有价值。

从模型可写验证、整组替换/降级和Git探测放行推导“版本绑定的验收凭据”。保持步骤/产物作为工作流状态，另用不可由普通更新伪造的批准/检查收据绑定task、step、要求版本及代码SHA；降级需明确人员重置，Git unknown独立展示不归clean。只读另由执行前能力策略拒绝写，保留shell就不能命名物理只读。

尚未实现。对照手工Markdown+CI、当前版与凭据原型，在假fs/Git/用户审批事件中测试human自填、替换completed、verification降级、空steps、旧SHA收据、Git超时和并行会话。判据是无对应版本/来源收据不能表示已验收，正常已批准路径能恢复。反例是频繁小改造成审批负担、CI本身不覆盖业务且收据可真实但无意义；计漏验收/误拒绝、恢复时间与额外人工，不用标签成功率自证。若仍接受旧SHA或模型自签human，或没有比外部CI更少遗漏却显著增人工，假设失败。

#### 证据与依据

**依据 1 · 源码核查**：[lib/task.js:172-301](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/task.js#L172-L301)

当前固定版本复核。凭据来源/降级推导。

<details>
<summary>查看原文（130行）</summary>

```text
 * be marked `completed` when `verified === true` is ALREADY present in the
 * persisted state (recorded by a prior update call), preventing self-
 * certification in a single call.
 *
 * Verification subject (`verification`):
 *  - 'ai'    — model-run automated verification (verify: true is a legacy alias
 *              for this); marking `verified: true` is the model's own record.
 *  - 'human' — manual approval gate: `verified: true` REQUIRES `verifiedBy:
 *              'human'` (the human explicitly confirmed in the conversation),
 *              otherwise the model cannot self-certify the step.
 *  - 'none'  — no verification requirement; may go straight to completed.
 *
 * Blocked linkage: a step moved to `blocked` must carry a `blockedReason`
 * (either in this update or already persisted).
 * @param {Array<object>} existingSteps
 * @param {object} update validated step update
 * @returns {{ ok: true, steps: Array<object>, updated: object } | { ok: false, error: string }}
 */
export function applyStepUpdate(existingSteps, update) {
  if (!Array.isArray(existingSteps)) {
    return { ok: false, error: '当前任务尚未定义任何 steps 步骤列表' }
  }
  const index = existingSteps.findIndex((s) => String(s.id) === String(update.id))
  if (index === -1) {
    return { ok: false, error: `未找到 ID 为 "${update.id}" 的步骤` }
  }

  const current = existingSteps[index]
  const next = { ...current }

  // Verification mode resolution: explicit `verification` wins over the legacy
  // `verify: true` alias (verify: true === verification: 'ai').
  const verification =
    update.verification !== undefined
      ? update.verification
      : current.verification !== undefined
        ? current.verification
        : current.verify === true
          ? 'ai'
          : 'none'

  if (update.verification !== undefined) {
    next.verification = update.verification
  }
  if (update.verified !== undefined) {
    if (update.verified === true && verification === 'human' && update.verifiedBy !== 'human') {
      return {
        ok: false,
        error: `[trellis/human_gate] 步骤 "${current.title}" (${current.id}) 声明了人工验收要求 (verification: human)，标记 verified: true 必须同时提供 verifiedBy: 'human'（用户在对话中的明确确认），禁止模型自证自签`,
      }
    }
    next.verified = update.verified === true
    if (update.verified === true) {
      next.verifiedBy = update.verifiedBy === 'human' ? 'human' : 'ai'
    }
  }
  if (update.verifiedBy !== undefined) {
    next.verifiedBy = update.verifiedBy
  }
  if (update.verificationNotes !== undefined) {
    next.verificationNotes = update.verificationNotes
  }
  if (update.blockedReason !== undefined) {
    next.blockedReason = update.blockedReason
  }

  if (update.status !== undefined) {
    if (update.status === 'completed') {
      if (verification === 'ai' && current.verified !== true) {
        return {
          ok: false,
          error: `[trellis/verification_gate] 步骤 "${current.title}" (${current.id}) 声明了自动化验证要求 (verification: ai)，请先单独调用 trellis_task_update 记录 verified: true 后再标记 completed`,
        }
      }
      if (verification === 'human' && (current.verified !== true || current.verifiedBy !== 'human')) {
        return {
          ok: false,
          error: `[trellis/human_gate] 步骤 "${current.title}" (${current.id}) 声明了人工验收要求 (verification: human)，在用户明确确认并持久化 verified: true + verifiedBy: 'human' 前禁止标记为 completed`,
        }
      }
    }
    if (update.status === 'blocked' && !next.blockedReason) {
      return {
        ok: false,
        error: `[trellis/steps_blocked] 步骤 "${current.title}" (${current.id}) 标记为 blocked 时必须提供 blockedReason 说明阻塞原因`,
      }
    }
    next.status = update.status
  }

  const updatedList = [...existingSteps]
  updatedList[index] = next
  return { ok: true, steps: updatedList, updated: next }
}

/**
 * Check whether all steps are cleanly completed and verified before closing a task.
 * @param {Array<object> | undefined} steps
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function checkStepsCompletion(steps) {
  if (!Array.isArray(steps) || steps.length === 0) return { ok: true }
  const incomplete = []
  const unverified = []
  const blocked = []
  for (const st of steps) {
    if (st.status === 'blocked') {
      blocked.push(`${st.title || st.id}${st.blockedReason ? `（${st.blockedReason}）` : ''}`)
      continue
    }
    if (st.status !== 'completed') {
      incomplete.push(`${st.title || st.id} (${st.status || 'pending'})`)
    } else if (st.verify === true || st.verification === 'ai' || st.verification === 'human') {
      if (st.verified !== true) {
        unverified.push(`${st.title || st.id}`)
      } else if (st.verification === 'human' && st.verifiedBy !== 'human') {
        unverified.push(`${st.title || st.id}（人工验收未确认）`)
      }
    }
  }
  if (blocked.length > 0) {
    return { ok: false, error: `[trellis/steps_blocked] 以下步骤处于阻塞状态，禁止提前完结任务：${blocked.join('；')}` }
  }
  if (incomplete.length > 0) {
    return { ok: false, error: `[trellis/steps_incomplete] 仍有未完成的执行步骤：${incomplete.join('；')}，禁止提前完结任务` }
  }
  if (unverified.length > 0) {
    return { ok: false, error: `[trellis/steps_unverified] 以下步骤未通过质量验证：${unverified.join('；')}，禁止提前完结任务` }
  }
  return { ok: true }
```

</details>

**依据 2 · 源码核查**：[lib/task.js:880-915](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/task.js#L880-L915)

当前固定版本复核。整组替换推导。

<details>
<summary>查看原文（36行）</summary>

```text
    if (args.description.trim()) {
      taskJson.description = args.description.trim()
    } else {
      delete taskJson.description
    }
  }

  // Apply steps replacement if provided (batch init / reset)
  if (args.steps !== undefined) {
    taskJson.steps = args.steps
  }

  // Apply single step update if provided (incremental advance)
  if (args.step !== undefined) {
    const applyRes = applyStepUpdate(taskJson.steps, args.step)
    if (!applyRes.ok) {
      return { ok: false, error: applyRes.error }
    }
    taskJson.steps = applyRes.steps
  }

  // If updating to status='completed', enforce steps completion gate and git cleanliness check
  let gitCheck = null
  if (args.status === 'completed') {
    const gateCheck = checkStepsCompletion(taskJson.steps)
    if (!gateCheck.ok) {
      return { ok: false, error: gateCheck.error }
    }
    gitCheck = await checkGitCleanliness(root, { modifiedFiles: args.modified_files, action: 'complete' })
    if (!gitCheck.clean && gitCheck.error) {
      return { ok: false, error: gitCheck.error }
    }
  }

  // Write updated task.json
  await dshFs.writeText(taskJsonTarget, JSON.stringify(taskJson, null, 2), undefined, signal, sandboxPolicy)
```

</details>

**依据 3 · 源码核查**：[lib/git.js:151-215](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/lib/git.js#L151-L215)

当前固定版本复核。unknown与clean分离推导。

<details>
<summary>查看原文（65行）</summary>

```text
export function checkGitCleanliness(root, options = {}) {
  const timeout = typeof options.timeout === 'number' ? options.timeout : 2000
  const ignorePatterns = Array.isArray(options.ignorePatterns) ? options.ignorePatterns : DEFAULT_GIT_IGNORES
  const declaredFiles = Array.isArray(options.modifiedFiles)
    ? options.modifiedFiles.map(normalizeRelPath).filter(Boolean)
    : undefined
  // Action-specific wording: distinct verbs per call site, neutral when omitted.
  const actionPhrase = options.action === 'complete' ? '完成任务前' : options.action === 'archive' ? '归档任务前' : '完成或归档任务前'
  // Guidance appended to the global-dirty failure to make the scoped relaxation discoverable.
  const scopedGuidance =
    `\n\n提示：若上述改动与本次任务无关，可传 modified_files 声明本任务实际改动的文件做局部校验（清单内文件须已提交；清单外改动放行并告警）。` +
    `该参数是调用期凭据、不会写入 task.json，需在完成任务（trellis_task_update status=completed）或归档（trellis_task_archive）时再次传入。`

  return new Promise((resolve) => {
    try {
      execFile(
        'git',
        ['-c', 'core.quotepath=false', 'status', '--porcelain', '-uall'],
        { cwd: root, timeout, windowsHide: true },
        async (err, stdout, stderr) => {
          if (err) {
            // If not a git repository or git not found, degrade gracefully
            const errStr = String((err && err.message) || '') + String(stderr || '')
            if (
              err.code === 'ENOENT' ||
              err.code === 'EPERM' ||
              errStr.includes('not a git repository') ||
              errStr.includes('fatal: not a git repository') ||
              err.code === 128
            ) {
              return resolve({ clean: true, isGitRepo: false, dirtyFiles: [], uncommittedFiles: [] })
            }
            // On timeout or unexpected error, resolve with error message but do not hard crash
            if (err.killed || err.signal === 'SIGTERM') {
              return resolve({ clean: true, isGitRepo: true, dirtyFiles: [], uncommittedFiles: [], warning: 'git status 检查超时，已跳过' })
            }
            return resolve({ clean: true, isGitRepo: false, dirtyFiles: [], uncommittedFiles: [], warning: `git status 失败: ${errStr}` })
          }

          // 1. Check workspace uncommitted changes (dirty files)
          const entries = parsePorcelainOutput(stdout)
          const dirty = filterDirtyEntries(entries, ignorePatterns)

          let warning
          if (declaredFiles && declaredFiles.length > 0) {
            // Scoped check: only dirty files matching declared modifiedFiles will block completion/archival
            const declaredSet = new Set(declaredFiles)
            const dirtyInDeclared = dirty.filter((e) => declaredSet.has(e.path))
            if (dirtyInDeclared.length > 0) {
              const dirtyFiles = dirtyInDeclared.map((e) => `${e.code} ${e.path}`)
              return resolve({
                clean: false,
                isGitRepo: true,
                dirtyFiles,
                uncommittedFiles: [],
                error:
                  `[trellis/git_declared_dirty] modified_files 中声明的文件本身存在未提交修改：\n` +
                  dirtyInDeclared.map((e) => `  - ${e.code} ${e.path}`).join('\n') +
                  `\n\n请先 git add / git commit 提交上述声明文件，再${actionPhrase}。` +
                  `（清单内文件必须已提交；与任务无关的改动无需列入，也不会阻塞。）`,
              })
            }
            if (dirty.length > 0) {
              warning = `工作区存在 ${dirty.length} 个未包含在 modified_files 中的未提交修改，已基于声明列表放行。`
            }
```

</details>

**依据 4 · 源码核查**：[test/native-steps.test.js:65-101](https://github.com/1264459640/dsh-trellis/blob/e5b39122d3a4b93dbfc07a660a6294af21cb18d5/test/native-steps.test.js#L65-L101)

当前固定版本复核。作者两阶段测试设计，不等独立执行。

<details>
<summary>查看原文（37行）</summary>

```text
  assert.equal(validateSteps([{ id: 'dup', title: 'A' }, { id: 'dup', title: 'B' }]).ok, false)

  const res = validateSteps([
    {
      id: 'step-1',
      title: '接入数据采集',
      spec: 'OPC-UA 订阅',
      acceptance: ['心跳监听', '断线重连'],
      verify: true,
    },
  ])
  assert.equal(res.ok, true)
  assert.equal(res.steps[0].id, 'step-1')
  assert.equal(res.steps[0].status, 'pending')
  assert.equal(res.steps[0].verify, true)
  assert.deepEqual(res.steps[0].acceptance, ['心跳监听', '断线重连'])
})

test('applyStepUpdate enforces verify gate before completion', () => {
  const steps = [
    { id: 'step-1', title: '核心数据层', status: 'in_progress', verify: true, verified: false, acceptance: ['x'] },
  ]

  // completion without verification fails
  const fail = applyStepUpdate(steps, { id: 'step-1', status: 'completed' })
  assert.equal(fail.ok, false)
  assert.match(fail.error, /verification_gate/)

  // verify then complete (two-phase) passes
  const verified = applyStepUpdate(steps, { id: 'step-1', verified: true, verificationNotes: 'test ok' })
  assert.equal(verified.ok, true)
  assert.equal(verified.steps[0].verified, true)

  const completed = applyStepUpdate(verified.steps, { id: 'step-1', status: 'completed' })
  assert.equal(completed.ok, true)
  assert.equal(completed.steps[0].status, 'completed')
})
```

</details>

#### 缺口

- 版本绑定凭据/独立批准与执行级只读原型未实现。
  **影响**：不是当前插件已具备的强验收或权限保证。
  **进一步探讨**：先用假fs/事件/固定Git输出对照接受/拒绝矩阵与人工负担。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
