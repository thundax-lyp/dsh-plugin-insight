# DSH Skills Manager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8d6b850](https://github.com/MichengAI/dsh-skills-manager/tree/8d6b850f91fde835411aaa1f3263265220337d5c)

<!-- BEGIN META -->
[![GitHub ★ 482](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=482&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-skills-manager) [![npm 30d 179,549](https://img.shields.io/static/v1?label=npm+30d&message=179%2C549&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-skills-manager)
<!-- END META -->

> **功能**：在DSH集中管理本机与项目Skill，提供Git安装、更新预览、备份回退及回收站。

> **亮点**：[Q02](#research-q02)跨来源/同名候选与启停覆盖层；[Q03](#research-q03)具体目标/版本/内容绑定预览及更新复验/保备份错误提示。

> **主要限制**：[Q03](#research-q03)文件/来源状态非全失败原子恢复，能安装非可信；[Q04](#research-q04)Host认证/审批继承、create_skill fullaccess例外、默认在线自更新有真实安装副作用。

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
  - [Q01 · 何时需要统一Skill管理，而不是原生目录或手工Git？](#detail-section-11)
  - [Q02 · UI启停如何真正改变宿主Skill候选与内容？](#detail-section-12)
  - [Q03 · Git安装、预览更新、回退与回收站真做了什么？](#detail-section-13)
  - [Q04 · 还有什么写入/自更新权限容易被管理界面掩盖？](#detail-section-14)
  - [Q05 · 最小试用与可证伪增量怎样选？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：@michengai/dsh-skills-manager1.2.35是社区DSH原生host+Web插件，Apache-2.0、Node^22.19或>=24、DSH>=0.2.0-rc.1 <0.3.0-0。面向在本机/多个登记项目使用多来源Skill、愿意核原文和变更的维护者；基线是宿主原生Skill发现/调用、手工git固定版本和目录备份。成功是目标Skill可读/可控启停、来源版本可核、更新/恢复不误覆盖，非支持生态/市场数量或安装数。

原生Skill发现/调用、手工git固定版本/目录备份和人工审内容，保持同一维护任务比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| Skill候选/正文 | 多来源使用 | 同名策略/Host加载另核 |
| Git更新/回退 | 版本与文件维护 | hash/备份非内容安全 |
| 回收站 | 防误删恢复 | 同名冲突/失败待验 |
| 在线自更新 | 更新管理器 | 实际包安装，可关 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| 匹配Node/DSH/skills/connection服务 | 必需 | provider/API/UI | 无Fetch无API，不绕认证 |
| Git/网络/公开仓库缓存 | 仓库功能需要 | fetch/checkout | 失败清临时，未验代理全链 |
| 登记项目/可写安全root | 项目写需 | 确定文件目标 | 未登记/链接/重叠拒写 |
| 人审Skill内容/差异 | 采用前提 | 控后续Agent行为 | 管理器非内容沙箱 |
| npm/Host安装能力 | 在线自更新 | 改profile包版本 | 默认开，可配置关 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 隔离 | 备份profile/项目/关不需更新 | 一已审Skill |
| 读取 | 核候选/原文/来源/启停 | 原文件与调用前后一致 |
| 更新 | 固定变更preview→复验→backup | 不凭token审内容 |
| 恢复 | 回退/冲突/来源写失败样本 | 错误停写/查备份 |
| 退出 | 核实际Skill/策略/来源/库再卸 | UI移除非文件撤回 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Node/Host/Git/磁盘未知 | 来源/权限/样本配置 | 不安装实测 |
| 持续 | 网络/缓存/备份未知 | 正文/diff/版本审阅 | 后续Agent模型另算 |
| 故障 | 重建/备份资源未知 | 查目录/来源/恢复 | 非统一事务 |
| 退出 | Skill/策略/备份留存未知 | 核provider注销与文件 | 卸载非全部删除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 集中读取/启停 | 真provider/readFile/策略 | 全Host缓存/生态效果 |
| Git安装更新 | 真复制/启用/token/备份 | 内容可信/恢复成功率 |
| API/工具权限 | Fetch/marker/ask/fullaccess分支 | Host完整鉴权/审批 |
| 自更新 | 真安装分支/403开关 | 发布链/失败回滚 |

> **思考**：[Q03](#research-q03)文件/来源状态非全失败原子恢复，能安装非可信；[Q04](#research-q04)Host认证/审批继承、create_skill fullaccess例外、默认在线自更新有真实安装副作用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)跨来源/同名候选与启停覆盖层；[Q03](#research-q03)具体目标/版本/内容绑定预览及更新复验/保备份错误提示。

[Q02](#research-q02)同名覆盖与scope provider可借鉴；[Q03](#research-q03)token绑定目标/内容和复验有价值；[Q04](#research-q04)文件管理与包安装副作用需区分。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)文件/来源状态非全失败原子恢复，能安装非可信；[Q04](#research-q04)Host认证/审批继承、create_skill fullaccess例外、默认在线自更新有真实安装副作用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)隔离已审单Skill试用，关不需自更新，来源/文件变化或恢复异常停写查备份，回原生目录。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持本机provider和代表Git/更新恢复接线；隔离profile/已审单Skill受限试用，内容安全/共享认证与收益待验。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client.ts、src/core.ts、src/index.ts、src/plugin-updater.ts、src/repositories.ts、src/repository-git.ts、src/repository-ui.ts、src/repository-updates.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：旧12findings当前全重核；核host/client启停/provider候选/正文、Fetch注册/格式与Host继承、代表Git子进程/缓存→安装上传临时复制/启用、preview/update/rollback与回收恢复、project路径和create_skill/online updater代表执行分支；未全审104统计文件、所有catalog/任意代理URL、全部符号链接竞态/跨进程/断电恢复、Host认证与发布物。
- 下一步：仅固定源码只读，不执行插件/技能/Git下载/安装/模型/Host/测试；无兼容/内容安全/节时或故障恢复独立验证。

**分析版本**

- **仓库**：[MichengAI/dsh-skills-manager](https://github.com/MichengAI/dsh-skills-manager)
- **版本号**：1.2.35（[固定提交 8d6b850](https://github.com/MichengAI/dsh-skills-manager/tree/8d6b850f91fde835411aaa1f3263265220337d5c)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)已有diff/来源/回退之上验证权限/信任/目标及效果收据，先比人工清单小修，未验证。

仅固定源码只读，不执行插件/技能/Git下载/安装/模型/Host/测试；无兼容/内容安全/节时或故障恢复独立验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1667 | — | — | 27310 |
| .js | source | 12 | 7276 | 7265 | 86 | — |
| .mjs | source | 9 | 951 | 893 | 24 | — |
| .ts | source | 26 | 12835 | 11837 | 561 | — |
| .mjs | test | 48 | 14995 | 13908 | 508 | — |
| .mjs | example | 2 | 141 | 137 | 2 | — |
| .ts | test | 2 | 89 | 76 | 9 | — |

</details>

**活跃度**

[![近30天新建 45](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=45&color=737b86&logo=github)](https://github.com/MichengAI/dsh-skills-manager/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 46](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=46&color=737b86&logo=github)](https://github.com/MichengAI/dsh-skills-manager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核provider实际读取/策略、Git安装更新文件副作用、恢复与Host权限/自更新，区别内容有效和可信有用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何时需要统一Skill管理，而不是原生目录或手工Git？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

@michengai/dsh-skills-manager1.2.35是社区DSH原生host+Web插件，Apache-2.0、Node^22.19或>=24、DSH>=0.2.0-rc.1 <0.3.0-0。面向在本机/多个登记项目使用多来源Skill、愿意核原文和变更的维护者；基线是宿主原生Skill发现/调用、手工git固定版本和目录备份。成功是目标Skill可读/可控启停、来源版本可核、更新/恢复不误覆盖，非支持生态/市场数量或安装数。

作者提供全局/项目/发现/回收站、第三方目录只读、Git更新预览等；本轮重点本机provider与代表Git安装/更新/回收，不将市场排行当内容可信或所有来源安全证明。插件增加来源/策略/备份组织和UI接线，宿主执行Skill及模型能力继承，不创造新Agent。第三方Skill即使安装过程只复制，后续给Agent读取仍可影响工具行为，内容必须人审。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-5](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/package.json#L1-L5)

当前身份/版本/Apache许可。

```text
{
  "name": "@michengai/dsh-skills-manager",
  "version": "1.2.35",
  "description": "DSH Skills Manager — 在 DeepSeek Harness 中统一加载并安全管理本机 Agent Skills · Load and safely manage local Agent Skills in DSH",
  "license": "Apache-2.0",
```

**依据 2 · 源码核查**：[package.json:32-44](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/package.json#L32-L44)

DSH bundle/client入口。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-primitives"
      ],
      "platform": "web"
    }
  },
```

</details>

**依据 3 · 源码核查**：[package.json:92-95](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/package.json#L92-L95)

Node/DSH范围。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.0-rc.1 <0.3.0-0"
  },
```

**依据 4 · 作者声明**：[README.md:20-35](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/README.md#L20-L35)

作者社区维护/功能范围及第三方只读主张。

<details>
<summary>查看原文（16行）</summary>

```text
> DSH Skills Manager 是社区维护的 DeepSeek Harness（DSH）插件，并非 DeepSeek AI 官方产品。

## 功能概览

把散落在本机和项目中的技能集中到 DSH，无需在多个 Agent 目录间来回查找。

- **多视图集中管理**：提供「全局技能」、「项目技能」、「发现」与「回收站」四大工作区视图，支持搜索、状态筛选与来源折叠。
- **按来源仓库浏览**：可切换目录或仓库视图，依据安装记录、锁文件和技能元数据识别来源；没有可靠来源的技能显示为「来源未知」。
- **广泛的生态兼容**：覆盖 DSH、公共 Agent、Codex、Claude Code、Copilot、Cursor、Google Antigravity、Windsurf、Qoder、Trae 等 20+ 工具与 CLI 环境，统一管理且不侵入第三方文件。
- **分类整理与拖拽归类**：支持在各来源内创建分类文件夹、拖拽技能卡片归类排序、批量添加技能，并支持分类级一键启停。分类元数据独立保存，不改动物理文件。
- **公共市场与仓库订阅**：内置「发现」中心，一站式浏览 ClawHub 热门榜单与 skills.sh 技能市场，支持公开 GitHub 仓库订阅、增量更新检测与版本备份回退。
- **创建与自由导入**：新建技能，或导入 ZIP、文件夹与 `SKILL.md`，可精准写入用户全局目录或指定工作区项目目录。
- **宽屏阅读与正文复制**：760px 宽屏自适应详情弹窗，等宽字体代码高亮排版，支持垂直自由拉伸与一键复制 Markdown 正文。
- **回收站与防误删保障**：DSH 技能删除后优先移入回收站，支持完整保留安装身份与更新历史的安全恢复。
- **自定义来源目录**：外部 Agent 来源可以在面板里改读取位置，不移动任何文件；DSH 与公共 Agent 仍由宿主配置。

```

</details>

**依据 5 · 源码核查**：[src/index.ts:218-229](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/index.ts#L218-L229)

实际provider接list/get。

<details>
<summary>查看原文（12行）</summary>

```text
function externalSkillProvider(control: ProviderControl, invalidators: Set<() => void>) {
  invalidators.add(control.invalidate);
  if (control.signal && typeof control.signal.addEventListener === "function") {
    control.signal.addEventListener("abort", () => {
      invalidators.delete(control.invalidate);
    }, { once: true });
  }
  return {
    name: "dsh-skills-manager-external",
    list: async (options?: ScopeOptions) => listProviderCandidates(options),
    get: async (candidate: ProviderCandidate, options?: ScopeOptions) => getProviderSkill(candidate, options),
  };
```

</details>

#### 缺口

- 实际Host兼容、持续维护需求与净节时/第三方内容效果未验证。
  **影响**：不能把管理入口或作者安全词当可信Skill/已生产验收。
  **进一步探讨**：隔离profile和可丢弃登记项目先管理一个已审Skill，与手工git/备份对照。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · UI启停如何真正改变宿主Skill候选与内容？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

host注册全局provider，并按agent created/disposed在各scope补provider；provider list/get调用本机扫描/解析。listProviderCandidates读manager state、扫描用户及当前cwd项目、同名选择/覆盖层，避免停用的原生副本又被Host选中；get重新resolveEntry校doc/realEntry/realDoc身份，readFile解析正文并校loadable/name，才返回Skill给宿主，不是只显示路径。

UI开关POST enable/disable，host handlePost核marker/JSON/Origin并序列化mutation，setPolicySkillEnabled改manager策略状态，不直接改第三方源文件；afterWrite失效provider/通知宿主目录，具体Host加载/缓存结果未运行。显示分类/侧栏入口只是组织，不改变任务分工。来源读取/同名/符号链接及所有原生provider优先级未全审，不能保证全部生态一致。

当前API只经connection.fetch.register，服务缺失warn/no-op，没有原始webServer后门回退。跨站/未登录身份依赖Host admit/owner，插件额外自定义头与Origin host比较/JSON格式不是认证。读取所选session cwd也来自Host已知session，不能拿客户端session header当用户隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:234-269](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/index.ts#L234-L269)

实际agent-scoped注册/释放。

<details>
<summary>查看原文（36行）</summary>

```text
 * skill layer. Register the manager policy once more in each live agent's own
 * layer so disabled shared skills cannot fall through to that native provider.
 */
function registerAgentSkillProviders(ctx: HostContext, invalidators: Set<() => void>) {
  if (typeof ctx.on !== "function") return () => {};
  const registrations = new Map<string, () => void>();

  const install = (agent: Agent) => {
    if (!agent || registrations.has(agent.id)) return;
    const agentCtx = agent.ctx;
    const skills = agentCtx && typeof agentCtx.get === "function"
      ? agentCtx.get("skills")
      : agentCtx && agentCtx.skills;
    if (!skills || typeof skills.registerProvider !== "function") return;
    const dispose = skills.registerProvider((control) => externalSkillProvider(control, invalidators));
    registrations.set(agent.id, dispose);
  };

  const uninstall = (agent: Agent) => {
    if (!agent) return;
    const dispose = registrations.get(agent.id);
    registrations.delete(agent.id);
    if (typeof dispose === "function") dispose();
  };

  const stopCreated = ctx.on("agent/created", ({ agent }) => install(agent));
  const stopDisposed = ctx.on("agent/disposed", ({ agent }) => uninstall(agent));
  const agents = typeof ctx.get === "function" ? ctx.get("agents") : undefined;
  if (agents && typeof agents.list === "function") {
    for (const agent of agents.list()) install(agent);
  }

  return () => {
    if (typeof stopCreated === "function") stopCreated();
    if (typeof stopDisposed === "function") stopDisposed();
    for (const dispose of registrations.values()) {
```

</details>

**依据 2 · 源码核查**：[src/index.ts:343-355](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/index.ts#L343-L355)

全局provider/失效与串行队列。

<details>
<summary>查看原文（13行）</summary>

```text
  const providerInvalidators = new Set<() => void>();
  const invalidateSkills = () => {
    for (const invalidate of providerInvalidators) invalidate();
  };
  const afterWrite = () => notifyChatCatalog(ctx, invalidateSkills);
  let mutationQueue: Promise<unknown> = Promise.resolve();
  const enqueueMutation: Serialize = (task) => {
    const queued = mutationQueue.then(task, task);
    mutationQueue = queued.catch(() => undefined);
    return queued;
  };
  ctx.effect(() => ctx.skills.registerProvider((control) => externalSkillProvider(control, providerInvalidators)), "skills-manager global external skills provider");
  ctx.effect(() => registerAgentSkillProviders(ctx, providerInvalidators), "skills-manager agent-scoped external skills providers");
```

</details>

**依据 3 · 源码核查**：[src/core.ts:4017-4056](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/core.ts#L4017-L4056)

真实扫描/策略/同名覆盖层。

<details>
<summary>查看原文（40行）</summary>

```text
export async function listProviderCandidates(options: ScopeOptions = {}) {
  const policyResult = await readManagerState();
  const candidates = [];
  const user = userRoots();
  const userScans = await scanDeduplicatedRoots(user);
  const items = user.flatMap((root) =>
    userScans.get(root.key)!.entries.map((entry) => ({ root, entry, policy: effectiveSkillPolicy(policyResult, root, entry) })),
  );
  const cwd =
    options && typeof options.cwd === "string" ? options.cwd : undefined;
  if (cwd) {
    const roots = await projectRoots([cwd]);
    for (const root of roots) {
      const scanned = (await scanDeduplicatedRoots([root])).get(root.key)!;
      for (const entry of scanned.entries) items.push({ root, entry, policy: effectiveSkillPolicy(policyResult, root, entry) });
    }
  }
  for (const group of groupLoadableSkillsByName(items).values()) {
    const { root, entry, policy } = selectSkillWinner(group);
    // 关闭的外部来源不覆盖其他插件；原生副本、分发链接及显式单技能禁用仍需阻断。
    const hasNativeCopy = group.some(({ root, entry }) => root.native ||
      entry.policyAliases?.some((alias) => user.some((item) => item.key === alias.rootKey && item.native)));
    const hasExplicitDisable = group.some((item) => item.policy.override === false);
    if (!hasNativeCopy && !hasExplicitDisable && !policy.sourceEnabled) continue;
    const project = root.scope === "project";
    // Shared Agent 继续由 manager 提供递归发现与链接副本，不因开放文件管理而丢失调用候选。
    const policyOnly = root.mutable && root.key !== "agents";
    // 回退副本也必须覆盖组内更高优先级的原生条目，防止宿主重新选中已停用副本。
    const overlayRank = group.length > 1
      ? Math.min(...group.map((item) => Math.min(item.root.rank, item.entry.providerRank ?? item.root.rank))) - 1
      : undefined;
    // 原生根由宿主自己的 provider 提供；来源停用必须发布覆盖层，否则停用不生效。
    const needsOverlay =
      !policyOnly ||
      group.length > 1 ||
      policy.override !== undefined ||
      !entry.invocationPolicyValid ||
      policyResult.writable === false ||
      !policy.sourceEnabled;
    if (!needsOverlay) continue;
```

</details>

**依据 4 · 源码核查**：[src/core.ts:4102-4140](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/core.ts#L4102-L4140)

真实身份复验/readFile/解析。

<details>
<summary>查看原文（39行）</summary>

```text
export async function getProviderSkill(candidate: ProviderCandidate, options: ScopeOptions = {}) {
  const locator = candidate && candidate.locator;
  if (
    !locator ||
    typeof locator.path !== "string" ||
    typeof locator.rootKey !== "string" ||
    typeof locator.realEntryPath !== "string" ||
    typeof locator.realDocPath !== "string"
  )
    return undefined;
  let root = rootByKey(locator.rootKey);
  if (
    !root &&
    PROJECT_ROOT_KEY_RE.test(locator.rootKey) &&
    typeof options.cwd === "string"
  ) {
    root = (await projectRoots([options.cwd])).find(
      (item) => item.key === locator.rootKey,
    );
  }
  if (!root) return undefined;
  try {
    const entry = await resolveEntry(root, String(locator.entryName || ""));
    if (!entry || resolve(entry.docPath) !== resolve(locator.path))
      return undefined;
    if (
      pathIdentity(entry.realEntryPath) !== pathIdentity(locator.realEntryPath)
    )
      return undefined;
    if (pathIdentity(entry.realDocPath) !== pathIdentity(locator.realDocPath))
      return undefined;
    const doc = parseSkillDoc(
      await fs.readFile(entry.realDocPath || entry.docPath, "utf8"),
    );
    const summary = entryOf(locator.entryName, entry.kind, entry.docPath, doc);
    if (!summary.loadable) return undefined;
    const invocationName = KEBAB_RE.test(summary.declaredName) ? summary.declaredName : toKebab(summary.declaredName);
    if (invocationName !== candidate.name && summary.declaredName !== candidate.name) return undefined;
    return {
```

</details>

**依据 5 · 源码核查**：[src/client.ts:928-934](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/client.ts#L928-L934)

实际UI启停POST。

```text
          if (action === "note") { setSkillNoteText(skill.customNote || ""); setModal({ type: "skill-note", root: root.key, name: skill.name, note: skill.customNote || "", workspace: workspacePath }); }
          if (action === "trash") setModal({ type: "trash-confirm", root: root.key, name: skill.name, workspace: workspacePath });
        } }),
        ];
        skillActions.push(h("div", { className: "dssm-row-state" }, showStatus ? renderSkillStatusIcon(statusKey, statusTitle, cls) : null, showSwitch ? enableSwitch(enabled, t("skill.toggle") + " " + skill.name, busy || root.enabled === false || (!enabled && skill.loadable === false), function () { post(enabled ? "/disable" : "/enable", scoped({ root: root.key, name: skill.name })); }) : null));
        var skillName = skill.declaredName || skill.name;
        var hasCustomNote = typeof skill.customNote === "string" && skill.customNote.trim().length > 0;
```

**依据 6 · 源码核查**：[src/index.ts:656-663](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/index.ts#L656-L663)

真实enable/disable路由调用。

```text
      path: `${API_PREFIX}/enable`,
      methods: ["POST"],
      fetch: (req) => handlePost(req, async (b, scope) => setSkillEnabled(await requestRoot(String(b.root || "dsh"), scope?.projectCwds, req.headers.get("x-dsh-skills-session")), String(b.name || ""), true, log), { afterSuccess: afterWrite }),
    },
    {
      path: `${API_PREFIX}/disable`,
      methods: ["POST"],
      fetch: (req) => handlePost(req, async (b, scope) => setSkillEnabled(await requestRoot(String(b.root || "dsh"), scope?.projectCwds, req.headers.get("x-dsh-skills-session")), String(b.name || ""), false, log), { afterSuccess: afterWrite }),
```

**依据 7 · 源码核查**：[src/index.ts:438-467](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/index.ts#L438-L467)

真实body/作用域/队列/afterSuccess。

<details>
<summary>查看原文（30行）</summary>

```text
  const handlePost = async (
    req: Request,
    action: (body: RequestBody, scope: { projectCwds: string[] } | null) => Promise<unknown>,
    options?: { maxBytes?: number; afterSuccess?: (body: RequestBody) => void; isRepo?: boolean; queued?: boolean }
  ) => {
    const mutationError = validateMutationRequest(req);
    if (mutationError) {
      return jsonResponse(mutationError.statusCode, { ok: false, code: mutationError.code, error: mutationError.error });
    }
    let body: RequestBody;
    try {
      body = await readJsonBody(req, options?.maxBytes);
    } catch (caught) {
      const e = caught as CodedError;
      return jsonResponse(Number.isInteger(e && e.statusCode) ? e.statusCode! : 400, {
        ok: false,
        code: (e && typeof e.code === "string") ? e.code : "error.proto.invalidJson",
        error: String(e && e.message ? e.message : e),
      });
    }
    if (options?.isRepo && (!body || typeof body !== "object" || Array.isArray(body))) {
      return jsonResponse(400, { ok: false, code: "error.repo.invalid", error: "仓库参数必须是对象" });
    }
    const execute = async () => {
      const scope = await workspaceScope(body);
      if (scope && "ok" in scope && scope.ok === false) return scope;
      return action(body, scope as { projectCwds: string[] } | null);
    };
    const afterSuccess = options?.afterSuccess ? () => options.afterSuccess!(body) : undefined;
    return runFetch(() => (options?.queued !== false ? enqueueMutation(execute) : execute()), afterSuccess);
```

</details>

**依据 8 · 源码核查**：[src/core.ts:2605-2619](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/core.ts#L2605-L2619)

真实策略写入而非改源文件。

<details>
<summary>查看原文（15行）</summary>

```text
async function setPolicySkillEnabled(root: RootInput, name: string, enabled: boolean, log?: Log) {
  const definition = await checkedPolicyRootDefinition(root);
  if (definition && definition.ok === false) return definition;
  if (!definition) return readonlyError("toggle");
  const current = await readManagerState();
  if (current.writable === false) return invalidManagerStateWrite();
  const result = await applyPolicySkillEnabled(definition, name, enabled, current.state);
  if (result && result.ok === false) return result;
  await writeManagerState(current.state);
  if (log)
    log(
      enabled ? "policy-enable" : "policy-disable",
      `${enabled ? "启用" : "停用"} ${definition.key}/${name}（本地策略，源文件不变）`,
    );
  return result;
```

</details>

**依据 9 · 源码核查**：[src/index.ts:105-122](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/index.ts#L105-L122)

额外marker/Origin/JSON判断。

<details>
<summary>查看原文（18行）</summary>

```text
function validateMutationRequest(req: Request) {
  const marker = req.headers.get(CLIENT_MARKER_HEADER) || req.headers.get("x-michengai-client");
  if (marker !== "1") return { statusCode: 403, code: "error.proto.forbidden", error: "forbidden mutation request" };
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      const reqHost = req.headers.get("host") || new URL(req.url).host;
      if (originHost !== reqHost) {
        return { statusCode: 403, code: "error.proto.forbidden", error: "forbidden cross-origin mutation request" };
      }
    } catch {
      return { statusCode: 403, code: "error.proto.forbidden", error: "forbidden origin" };
    }
  }
  const contentType = String(req.headers.get("content-type") || "").split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") return { statusCode: 415, code: "error.proto.contentType", error: "content-type must be application/json" };
  return null;
```

</details>

**依据 10 · 源码核查**：[src/index.ts:807-828](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/index.ts#L807-L828)

真实Fetch注册/释放及无服务no-op。

<details>
<summary>查看原文（22行）</summary>

```text
    if (ctx.connection?.fetch?.register) {
      const disposers = routes.map((route) =>
        ctx.connection!.fetch.register({
          path: route.path,
          methods: route.methods,
          requestBody: route.requestBody ?? "buffered",
          fetch: route.fetch,
        })
      );
      return () => {
        for (const disposer of disposers) {
          try {
            disposer();
          } catch {
            /* ignore */
          }
        }
      };
    }
    ctx.logger?.warn?.("Skills Manager routes require authenticated connection.fetch");
    return () => {};
  }, "skills-manager: API routes");
```

</details>

**依据 11 · 源码核查**：[src/index.ts:207-215](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/index.ts#L207-L215)

仅已知选中session解cwd。

```text
/** 仅从客户端当前选中的已知 Session 解析工作目录；缺失或失效时不回退其他会话。 */
function activeSessionCwds(ctx: HostContext, sessionId: unknown) {
  if (typeof sessionId !== "string" || !sessionId.trim()) return [];
  const sessions = ctx.sessions || (typeof ctx.get === "function" ? ctx.get("sessions") : undefined);
  if (!sessions) return [];
  const session = typeof sessions.get === "function" ? sessions.get(sessionId) :
    (typeof sessions.list === "function" ? sessions.list() : []).find((item) => (item.id ?? item.header?.id) === sessionId);
  const cwd = session?.header?.cwd;
  return typeof cwd === "string" && cwd.trim() ? [cwd.trim()] : [];
```

#### 缺口

- Host认证/权限和缓存失效实际效果、全部来源和多用户隔离未独立验。
  **影响**：不能把同屏启停当每种Host/Agent都已可靠禁用或全安全。
  **进一步探讨**：对已知Skill核禁用前后候选/手动与模型调用、scope与重启，再核原文件未变。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Git安装、预览更新、回退与回收站真做了什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

仓库管理不是执行下载脚本：代表Git路径runGit用spawn，禁protocol.ext/交互凭据并设timeout/体积监测，init/remote/fetch/checkout到缓存，成功返回commit，失败删临时目录；只核代表Git下载，未全审任意代理/镜像URL、全部catalog及子模块安全。安装复用已扫描缓存，readDir拒链接/超大文件，取对应SKILL.md与扫描hash比较，再写complete:false来源记录→importUploadedSkill→importSkill→临时复制/rename→启用策略→complete:true。实际写入到DSH/公共Agent或登记项目，不是只订阅；内容有效不等提示词安全。

项目安装必须登记绝对工作区并重解实际项目/目标，拒目标与用户根重叠、.dsh/skills链接，上传条目检查重复/大小/目标包含，临时目录清理。普通复制先拒source/temp符号链接，临时复制后rename，部分覆盖回滚失败保备份报错；不能据这些静态检查承诺全部竞态/文件系统安全。

更新/回退UI先preview取得token，再update带token/overwrite；prepare绑定当前/目标文件hash、commit、root/workspace及rollback，真正replace重新prepare下载并校token/localModified，暂存新文件后再次核当前签名，再target→backup/stage→target和来源写入。失败尝试恢复，恢复失败明确报“备份保留勿重复”，未实现跨进程/断电原子事务。安装最终来源确认失败可出现文件已装但记录未确认，不能盲装第二次。

deleteSkill检查可写root后将文件移回收stage，restore查有效元数据/目标、同名冲突和包含后移回；具体安装身份恢复及所有失败补偿未全审，回收站不是备份无限保留/全场景恢复保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/repository-git.ts:251-290](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/repository-git.ts#L251-L290)

真实Git子进程参数/环境。

<details>
<summary>查看原文（40行）</summary>

```text
function runGit(
  args: string[],
  cwd: string,
  optionsOrTimeout: RunGitOptions | number,
  legacyGitBinary = "git"
): Promise<{ stdout: string; stderr: string }> {
  const options = typeof optionsOrTimeout === "number" ? { timeoutMs: optionsOrTimeout, gitBinary: legacyGitBinary } : optionsOrTimeout;
  const timeoutMs = options.timeoutMs ?? 300_000;
  const gitBinary = options.gitBinary || "git";

  return new Promise((resolve, reject) => {
    const child = spawn(
      gitBinary,
      [
        "-c", "protocol.ext.allow=never",
        "-c", "core.symlinks=false",
        "-c", "core.autocrlf=false",
        // 技能目录层级深时，Windows 默认 260 字符上限会让检出直接失败。
        "-c", "core.longpaths=true",
        "-c", "advice.detachedHead=false",
        // 只支持公开仓库：禁用凭据助手，避免 Git Credential Manager 弹出账号选择窗口并卡住插件进程。
        "-c", "credential.helper=",
        "-c", "http.lowSpeedLimit=1000",
        "-c", "http.lowSpeedTime=30",
        ...args
      ],
      {
        cwd,
        env: {
          ...process.env,
          GIT_TERMINAL_PROMPT: "0",
          GCM_INTERACTIVE: "never",
          GIT_ASKPASS: "echo",
          LC_ALL: "C",
          LANGUAGE: "C",
        },
        // 只在确实要写规则时才接管 stdin，其余调用保持 ignore。
        stdio: (options.input === undefined ? ["ignore", "pipe", "pipe"] : ["pipe", "pipe", "pipe"]) as ["ignore" | "pipe", "pipe", "pipe"],
        detached: process.platform !== "win32",
      }
```

</details>

**依据 2 · 源码核查**：[src/repository-git.ts:302-342](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/repository-git.ts#L302-L342)

真实800ms配额监测/超时kill与错误。

<details>
<summary>查看原文（41行）</summary>

```text
    // 边下边量：配额是硬上限，超了就地终止，避免先写满磁盘再报错。
    let measuring = false;
    const quota = options.quota;
    const watchdog = quota
      ? setInterval(() => {
          if (measuring || killed) return;
          measuring = true;
          getDirectorySize(quota.dir).then((size) => {
            measuring = false;
            if (killed || size <= quota.limit) return;
            killed = true;
            killProcessTree(child);
            reject(failure("仓库临时下载体积过大（包含 Git 历史对象）", "error.repo.transientTooLarge", { limit: quota.limit, actual: size }));
          }, () => { measuring = false; });
        }, 800)
      : undefined;
    const stopWatchdog = () => { if (watchdog) clearInterval(watchdog); };

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    const timer = setTimeout(() => {
      killed = true;
      stopWatchdog();
      killProcessTree(child);
      reject(failure("Git 请求超时，请检查网络后重试", "error.repo.network"));
    }, timeoutMs);

    child.on("error", (err: unknown) => {
      clearTimeout(timer);
      stopWatchdog();
      if (killed) return;
      const code = (err as { code?: string })?.code;
      if (code === "ENOENT") {
        reject(failure("未检测到 Git 命令行工具，请先安装 Git 后重试", "error.repo.noGit"));
      } else {
        reject(failure(`无法启动 Git: ${(err as Error).message}`, "error.repo.network"));
```

</details>

**依据 3 · 源码核查**：[src/repository-git.ts:482-507](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/repository-git.ts#L482-L507)

实际Git初始化/配额与远端。

<details>
<summary>查看原文（26行）</summary>

```text
export async function fetchGitRepository(
  repo: RepositorySource,
  destinationDir: string,
  options: GitFetchOptions = {}
): Promise<{ commit: string }> {
  const maxBytes = options.maxBytes ?? 2 * 1024 * 1024 * 1024;
  const maxTransientBytes = options.maxTransientBytes ?? (maxBytes * 2.5);
  const timeoutMs = options.timeoutMs ?? 900_000;
  const deadline = Date.now() + timeoutMs;
  const gitBinary = options.gitBinary || "git";
  const remainingTimeout = () => {
    const remain = deadline - Date.now();
    if (remain <= 0) throw failure("Git 请求超时，请检查网络后重试", "error.repo.network");
    return { timeoutMs: remain, gitBinary, quota: { dir: destinationDir, limit: maxTransientBytes } };
  };
  const repoUrl = repo.url || `https://github.com/${repo.owner}/${repo.name}.git`;
  const ref = repo.ref && repo.ref !== "HEAD" ? repo.ref : "HEAD";

  await fs.mkdir(destinationDir, { recursive: true });
  // 配额是硬上限，先确认磁盘放得下再开跑，避免把盘写满后才报「体积过大」。
  await ensureDiskSpace(destinationDir, options.diskPreflightBytes ?? Math.min(maxTransientBytes, DISK_PREFLIGHT_BYTES));

  try {
    await runGit(["init", "-q"], destinationDir, remainingTimeout());
    // 按需取回 blob 需要具名远端，因此这里不能用 fetch <url> 的无远端写法。
    await runGit(["remote", "add", "origin", repoUrl], destinationDir, remainingTimeout());
```

</details>

**依据 4 · 源码核查**：[src/repository-git.ts:563-579](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/repository-git.ts#L563-L579)

真实checkout/清Git/体积/失败清理。

<details>
<summary>查看原文（17行）</summary>

```text
    await runGit(["checkout", "-q", "FETCH_HEAD"], destinationDir, remainingTimeout());

    const rawSize = await getDirectorySize(destinationDir);
    if (rawSize > maxTransientBytes) {
      throw failure("仓库临时下载体积过大（包含 Git 历史对象）", "error.repo.transientTooLarge", { limit: maxTransientBytes, actual: rawSize });
    }

    await rmWithRetry(join(destinationDir, ".git"));
    const totalSize = await getDirectorySize(destinationDir);
    if (totalSize > maxBytes) {
      throw failure("仓库超过大小限制", "error.repo.tooLarge", { limit: maxBytes, actual: totalSize });
    }

    return { commit };
  } catch (err) {
    await rmWithRetry(destinationDir).catch(() => undefined);
    throw err;
```

</details>

**依据 5 · 源码核查**：[src/repositories.ts:188-213](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/repositories.ts#L188-L213)

真实缓存递归读与符号链接/体积判断。

<details>
<summary>查看原文（26行）</summary>

```text
  async function download(repo: Repository, path?: string) {
    // 扫描阶段已把技能目录检出到磁盘，安装直接复用，不再二次下载。
    const dir = await cacheDirectory();
    const repoDir = join(dir, `${repo.id}-${repo.commit}`);
    const info = await fs.lstat(repoDir).catch(() => null);
    if (!info || !info.isDirectory() || info.isSymbolicLink()) throw failure("仓库缓存缺失或已失效，请刷新该仓库后重试");
    const result: Archive = Object.create(null);
    const targetBase = path ? join(repoDir, path) : repoDir;
    const prefix = path ? `${path}/` : "";
    async function readDir(curr: string, relPrefix = "") {
      const items = await fs.readdir(curr, { withFileTypes: true });
      for (const item of items) {
        safePath(item.name);
        const full = join(curr, item.name);
        const rel = relPrefix ? `${relPrefix}/${item.name}` : item.name;
        if (item.isDirectory()) {
          await readDir(full, rel);
        } else if (item.isFile()) {
          const fileInfo = await fs.lstat(full);
          if (fileInfo.isSymbolicLink() || fileInfo.size > 32 << 20) throw failure("仓库文件过大");
          result[prefix + rel] = await fs.readFile(full);
        }
      }
    }
    await readDir(targetBase);
    return result;
```

</details>

**依据 6 · 源码核查**：[src/repositories.ts:731-779](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/repositories.ts#L731-L779)

真实目标/哈希/未完成记录/导入/启用/最终确认。

<details>
<summary>查看原文（49行）</summary>

```text
    install: ({ id, path, root: requestedRoot, workspace }: SkillRequest, registered?: string[]) => serialize(async () => {
      // 工作区只开放项目 DSH，不能与 Shared Agent 组合；路径必须来自宿主登记列表。
      let root: any, workspaceRoot: string | undefined;
      if (workspace !== undefined) {
        if (requestedRoot !== undefined && requestedRoot !== "dsh") throw failure("工作区只能安装到项目 DSH skills");
        const target = await resolveWorkspaceTarget(workspace, registered);
        if ("ok" in target && target.ok === false) throw failure(target.error, target.code, target.params);
        // 保留真实的项目根 key（project-dsh:<hash>）：启用策略与回收站都按它认根。
        root = (target as { root: any }).root;
        workspaceRoot = root.projectRoot;
      } else root = await recordInstallRoot({ root: requestedRoot });
      const data = await read(), repo = repository(data, id);
      const skill = repo.skills.find((s) => s.path === path);
      if (!skill || !skill.valid) throw failure("技能不存在或格式无效");
      // 工作区安装只和该项目的 .dsh/skills 比较，全局或其他项目已有同名副本不阻止安装。
      // 用户级位置（DSH 与 Shared Agent）仍互相比较：同一技能只能有一份可追溯的用户级安装。
      const lowered = skill.name.toLowerCase();
      const sameTarget = (await state({ projectCwds: workspaceRoot ? [workspaceRoot] : [] })).roots.filter(item => workspaceRoot ? item.projectRoot === workspaceRoot && item.kind === "project-dsh" : item.scope !== "project");
      if (sameTarget.some(item => (item.skills || []).some(entry => entry.name.toLowerCase() === lowered || entry.declaredName?.toLowerCase() === lowered))) throw failure("同名技能已存在，不会覆盖本地文件", "error.repo.conflict");
      const archive = await download(repo, path), prefix = path ? `${path}/` : "";
      const document = archive[prefix + "SKILL.md"];
      if (!document || hash(document) !== skill.documentHash) throw failure("仓库技能内容与扫描版本不一致，请重新刷新");
      const entries = Object.entries(archive).filter(([p]) => p.startsWith(prefix)).map(([p, bytes]) => ({ path: p.slice(prefix.length), data: Buffer.from(bytes).toString("base64") }));
      if (!entries.some((e) => e.path === "SKILL.md")) throw failure("仓库技能内容已失效");
      // 同名记录只替换同一位置：用户级按 root 区分 DSH 与 Shared Agent，工作区按项目根区分。
            // 另一处的安装或回收记录必须保留，否则恢复时会丢失仓库来源。
            data.installs = data.installs.filter((i) => !(i.name === skill.name && (i.workspace ?? null) === (workspaceRoot ?? null) && (i.root || "dsh") === (workspaceRoot ? "dsh" : root.key)));
      const record: InstallRecord = { id, path, root: workspaceRoot ? "dsh" : root.key, ...(workspaceRoot ? { workspace: workspaceRoot } : {}), source: { owner: repo.owner, name: repo.name, ref: repo.ref, subdirectory: repo.subdirectory, ...(repo.url ? { url: repo.url } : {}) }, name: skill.name, commit: repo.commit, complete: false, files: entries.map((e) => ({ path: e.path, hash: hash(Buffer.from(e.data, "base64")) })) };
      data.installs.push(record);
      await write(data);
      let copied = false;
      try {
        await recordInstallRoot({ root: requestedRoot, workspace: workspaceRoot }, registered);
        const result = await importUploadedSkill({ name: skill.name, entries }, log, { conflict: "skip", root });
        if (result.ok === false || !result.imported?.length) throw failure(result.error || "技能安装失败或遇到同名冲突", typeof result.code === "string" ? result.code : "error.repo.conflict", result.params);
        copied = true;
        // 界面默认显示已启用，安装完成后走策略初始化，确保不在禁用列表中。
        const enabled = await setSkillEnabled(root, skill.name, true, log);
        if (enabled && typeof enabled === "object" && "ok" in enabled && enabled.ok === false) throw failure(enabled.error || "技能启用状态无法写入", typeof enabled.code === "string" ? enabled.code : "error.repo.enableState", enabled.params);
      } catch (caught) { const error = caught as CodedError;
        data.installs = data.installs.filter(item => item !== record);
        try { await write(data); }
        catch { throw failure("安装未完成且来源记录无法撤销，请恢复磁盘写入后检查技能目录", "error.repo.installState"); }
        if (copied) await fs.rm(join(root.path, skill.name), { recursive: true, force: true }).catch(() => undefined);
        throw error;
      }
      record.complete = true;
      try { await write(data); }
      catch { throw failure("技能文件已安装但来源状态未确认，请恢复磁盘写入后重新打开仓库页", "error.repo.installState"); }
```

</details>

**依据 7 · 源码核查**：[src/core.ts:3884-3896](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/core.ts#L3884-L3896)

上传准备→真实importSkill及清临时。

<details>
<summary>查看原文（13行）</summary>

```text
export async function importUploadedSkill(input: UploadInput, log?: Log, options: MutationOptions = {}): Promise<ImportResult> {
  const uploadHome = join(managerHomePath(), "uploads");
  const sessionRoot = join(uploadHome, `.upload-${randomUUID()}`);
  try {
    await fs.mkdir(sessionRoot, { recursive: true });
    const source = await prepareUploadedSource(sessionRoot, input || {});
    return await importSkill(source, log, options);
  } catch (caught) { const error = caught as CodedError;
    return uploadError(error);
  } finally {
    await fs
      .rm(sessionRoot, { recursive: true, force: true })
      .catch(() => undefined);
```

</details>

**依据 8 · 源码核查**：[src/core.ts:3759-3792](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/core.ts#L3759-L3792)

实际上传路径/重复/大小/文件写入。

<details>
<summary>查看原文（34行）</summary>

```text
    );
  let total = 0;
  const seen = new Set();
  for (const entry of entries) {
    const normalized = normalizeUploadPath(entry && entry.path);
    const key = normalized.path.toLowerCase();
    if (seen.has(key))
      throw codedError(
        `上传内容包含重复路径: ${normalized.path}`,
        "error.upload.duplicate",
        { path: normalized.path },
      );
    seen.add(key);
    if (normalized.directory) continue;
    const bytes = decodeUploadBase64(
      entry && entry.data,
      MAX_UPLOAD_ENTRY_BYTES,
    );
    total += bytes.length;
    if (total > MAX_UPLOAD_TOTAL_BYTES)
      throw codedError(
        `上传内容总大小超过 ${MAX_UPLOAD_TOTAL_BYTES} 字节`,
        "error.upload.tooLarge",
        { limit: MAX_UPLOAD_TOTAL_BYTES },
      );
    const target = join(contentRoot, ...normalized.path.split("/"));
    if (!isSameOrDescendant(contentRoot, target))
      throw codedError(
        `上传条目路径非法: ${normalized.path}`,
        "error.upload.path",
        { path: normalized.path },
      );
    await fs.mkdir(dirname(target), { recursive: true });
    await fs.writeFile(target, bytes);
```

</details>

**依据 9 · 源码核查**：[src/core.ts:3380-3425](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/core.ts#L3380-L3425)

真实临时复制/rename/回滚失败。

<details>
<summary>查看原文（46行）</summary>

```text
/** 先复制到同目录临时路径，复制失败时不触碰现有技能。 */
async function copyToTemporary(source: string, target: string, isDir: boolean) {
  const temp = temporaryPath(target, "stage");
  try {
    await assertNoSymbolicLinks(source);
    if (isDir)
      await fs.cp(source, temp, { recursive: true, dereference: false });
    else await fs.copyFile(source, temp);
    await assertNoSymbolicLinks(temp);
    return temp;
  } catch (caught) { const error = caught as CodedError;
    await fs.rm(temp, { recursive: true, force: true }).catch(() => undefined);
    throw error;
  }
}

/** 临时副本就绪后再替换；替换失败时尽力恢复旧条目。 */
async function replaceWithCopy(source: string, dest: string, isDir: boolean, existing: string[] = []) {
  for (const path of [dest, ...existing]) {
    if (await isDirectoryLink(path))
      throw codedError(`目录链接不能删除或覆盖: ${path}`, "error.skill.linked", { path });
  }
  const stage = await copyToTemporary(source, dest, isDir);
  const backups = [];
  try {
    for (const path of existing) {
      const backup = temporaryPath(path, "backup");
      await renameWithRetry(path, backup);
      backups.push({ path, backup });
    }
    await renameWithRetry(stage, dest);
  } catch (caught) { const error = caught as CodedError;
    await fs.rm(stage, { recursive: true, force: true }).catch(() => undefined);
    const rollbackFailures = [];
    for (const item of backups.reverse()) {
      try {
        await renameWithRetry(item.backup, item.path);
      } catch (caught) { const rollbackError = caught as CodedError;
        rollbackFailures.push(item.backup);
      }
    }
    if (rollbackFailures.length) {
      const causeText = String(error && error.message ? error.message : error);
      throw codedError(
        `${causeText}；覆盖导入回滚失败，备份保留在: ${rollbackFailures.join("、")}`,
        "error.import.rollbackFailed",
```

</details>

**依据 10 · 源码核查**：[src/core.ts:3612-3626](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/core.ts#L3612-L3626)

importSkill实际循环调用replaceWithCopy/记录结果。

<details>
<summary>查看原文（15行）</summary>

```text
    await fs.mkdir(targetRoot, { recursive: true });
  }

  for (const p of pending) {
    try {
      const warnings = await replaceWithCopy(p.source, p.dest, p.isDir);
      imported.push({ name: p.name, overwritten: false, warnings });
      if (log) log("import", `导入 ${p.source} -> ${p.dest}`);
    } catch (caught) { const e = caught as CodedError;
      failed.push(
        attachCode(
          { source: p.source, error: String(e && e.message ? e.message : e) },
          e,
        ),
      );
```

</details>

**依据 11 · 源码核查**：[src/core.ts:574-616](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/core.ts#L574-L616)

实际登记工作区/目标解析。

<details>
<summary>查看原文（43行）</summary>

```text
export async function resolveWorkspaceTarget(
  workspace: unknown,
  registered: unknown,
): Promise<{ root: SkillRoot } | OperationError> {
  const unregistered: OperationError = {
    ok: false,
    error: "请选择已登记的工作区",
    code: "error.workspace.unregistered",
  };
  if (typeof workspace !== "string" || !workspace.trim() || !isAbsolute(workspace.trim())) return unregistered;
  const requested = workspace.trim();
  const list = Array.isArray(registered)
    ? registered.filter((item): item is string => typeof item === "string" && isAbsolute(item))
    : [];
  if (!list.some((item) => sameWorkspace(item, requested))) return unregistered;
  const found = await nearestProjectRoot(requested);
  if (!found || !found.root)
    return {
      ok: false,
      error: `工作区目录不可用: ${requested}`,
      code: "error.workspace.unavailable",
      params: { path: requested, ...(found?.code ? { code: found.code } : {}) },
    };
  const source = PROJECT_SOURCES.find((item) => item.key === "dsh")!;
  const root: SkillRoot = {
    key: `project-dsh:${projectIdentity(found.root)}`,
    kind: "project-dsh",
    scope: "project",
    localeKey: source.localeKey,
    label: source.label,
    rank: source.rank,
    mutable: true,
    native: true,
    toggleable: true,
    path: join(found.root, source.directory, "skills"),
    projectRoot: found.root,
    projectName: basename(found.root) || found.root,
    workspaceCwds: [found.cwd],
  };
  const checked = await checkedWritableRootDefinition(root);
  if (!checked) return unregistered;
  if (checked.ok === false) return checked;
  return { root: checked as SkillRoot };
```

</details>

**依据 12 · 源码核查**：[src/core.ts:1360-1384](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/core.ts#L1360-L1384)

实际重叠/链接目标拒写。

<details>
<summary>查看原文（25行）</summary>

```text
async function checkedWritableRootDefinition(root: RootInput): Promise<SkillRoot | OperationError | null | undefined> {
  const definition = writableRootDefinition(root);
  if (definition?.key === "agents") return checkedUserRootAncestors(definition);
  if (!definition || definition.scope !== "project") return definition;
  if (await overlapsUserSkillRoot(definition.path)) {
    return {
      ok: false,
      error: `项目技能目录与用户技能目录重叠，拒绝写入: ${definition.path}`,
      code: "error.root.unsafe",
      params: { path: definition.path },
    };
  }
  // 项目仓库内容不可信；拒绝通过 .dsh 或 skills 链接把写入重定向到项目之外。
  for (const path of [join(definition.projectRoot!, ".dsh"), definition.path]) {
    const st = await lstatOrNull(path);
    if (st && (!st.isDirectory() || st.isSymbolicLink())) {
      return {
        ok: false,
        error: `项目技能目录不安全，拒绝写入: ${path}`,
        code: "error.root.unsafe",
        params: { path },
      };
    }
  }
  return definition;
```

</details>

**依据 13 · 源码核查**：[src/repository-ui.ts:688-713](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/repository-ui.ts#L688-L713)

真实preview→token/update请求与反馈。

<details>
<summary>查看原文（26行）</summary>

```text
    function preview(repo: RepoView, skill: RepoSkill, copy: RepoCopy, rollback = false) {
      const scope = copyTarget(copy);
      if (!scope || (rollback ? !copy.canRollback : !copy.tracked)) return;
      return perform(async () => {
        const detail = await post("preview", { id: repo.id, path: skill.path, ...scope, rollback });
        setModal({ type: rollback ? "rollback" : "review", repo, skill, copy, detail });
      });
    }
    function update() {
      if (!modal || (modal.type !== "review" && modal.type !== "rollback")) return;
      const selected = modal, rollback = selected.type === "rollback";
      const scope = copyTarget(selected.copy);
      if (!scope) return;
      return perform(async () => {
        const target = { id: selected.repo.id, path: selected.skill.path, ...scope };
        setInstallation({ ...target, pending: true, key: "repo.updateProgress" });
        try {
          await post(rollback ? "rollback" : "update", { ...target, token: selected.detail.token, overwrite: selected.detail.localModified });
        } catch (caught) { const error = caught as CodedError;
          if (mounted.current) setInstallation({ ...target, error: true, payload: error });
          throw error;
        }
        if (!mounted.current) return;
        const key = rollback ? "repo.rollbackSuccess" : "repo.updateSuccess";
        setInstallation({ ...target, key }); setFeedback({ key }); setModal(null);
        if (onInstalled) await onInstalled();
```

</details>

**依据 14 · 源码核查**：[src/repository-updates.ts:97-149](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/repository-updates.ts#L97-L149)

实际内容token/复验/备份替换/恢复失败。

<details>
<summary>查看原文（53行）</summary>

```text
    if (input.rollback === true) {
      const backup = record.backup!;
      if (!/^[a-f0-9-]{36}$/.test(backup?.key || "") || backup.record?.name !== record.name || backup.record?.id !== id || backup.record?.path !== path || (backup.record.root || "dsh") !== (record.root || "dsh") || (backup.record.workspace ?? "") !== (record.workspace ?? "") || !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(backup.record?.commit || "") || !Array.isArray(backup.record?.files)) throw failure("没有有效的上一版备份");
      entries = await readSkillTree(join(managerHomePath(), "repository-backups", backup.key)); next = fileIndex(entries);
      if (signature(next) !== backup.fingerprint) throw failure("备份内容已变化，拒绝回退");
      commit = backup.record.commit;
    } else {
      const repo = repository(data, id), skill = repo.skills.find(s => s.path === path);
      if (repo.error || !skill?.valid || skill.name !== record.name || !skill.files) throw failure("请先成功检查更新；技能改名或已移除时不能直接替换");
      next = skill.files; commit = repo.commit;
      if (includeArchive) {
        const archive = await download(repo, path), prefix = path ? path + "/" : "";
        entries = Object.fromEntries(Object.entries(archive).filter(([p]) => p.startsWith(prefix)).map(([p, bytes]) => [p.slice(prefix.length), bytes]));
        if (signature(fileIndex(entries)) !== signature(next)) throw failure("下载内容与预览版本不同，请重新检查更新");
      }
    }
    const token = hash(JSON.stringify({ id, path, root: record.root || "dsh", workspace: record.workspace ?? null, commit, current, next, rollback: input.rollback === true }));
    return { data, record, target, entries, next, current, token, commit, localModified: signature(current) !== signature(record.files), changes: changesBetween(current, next) };
  }
  async function replace(input: SkillRequest, rollback = false) {
    const plan = await prepare({ ...input, rollback }, true);
    if (typeof input.token !== "string" || input.token !== plan.token) throw failure("文件或版本已变化，请重新预览");
    if (plan.localModified && input.overwrite !== true) throw failure("存在本地修改，请确认备份后替换", "error.repo.modified");
    const { data, record, target, entries } = plan;
    const backupRoot = join(managerHomePath(), "repository-backups");
    await fs.mkdir(backupRoot, { recursive: true }); await safeDirectory(backupRoot);
    const key = randomUUID(), backup = join(backupRoot, key), stage = join(backupRoot, randomUUID());
    await fs.mkdir(stage);
    let moved = false, replaced = false, recoveryFailed = false;
    try {
      for (const [path, bytes] of Object.entries(entries!)) {
        safePath(path); const file = join(stage, ...path.split("/"));
        await fs.mkdir(dirname(file), { recursive: true }); await fs.writeFile(file, bytes, { flag: "wx" });
      }
      // 下载期间仍可能编辑文件，替换前复验，避免覆盖预览之后的修改。
      if (signature(fileIndex(await readSkillTree(target))) !== signature(plan.current)) throw failure("本地文件已变化，请重新预览");
      const previous = { ...record }; delete previous.backup;
      const nextRecord = rollback ? { ...record.backup!.record } : { ...previous, commit: plan.commit, files: plan.next };
      nextRecord.backup = { key, fingerprint: signature(plan.current), record: previous };
      // 跨卷或文件锁导致重命名失败时直接终止，不降级为覆盖复制。
      await renameWithRetry(target, backup); moved = true;
      await renameWithRetry(stage, target); replaced = true;
      data.installs[data.installs.indexOf(record)] = nextRecord;
      await write(data);
    } catch (caught) { const error = caught as CodedError;
      if (moved) {
        try {
          if (replaced) await renameWithRetry(target, stage);
          await renameWithRetry(backup, target);
        } catch { recoveryFailed = true; throw failure("自动恢复失败，原文件保留在备份目录，请勿重复操作", "error.repo.state"); }
      }
      throw error;
    } finally { if (!recoveryFailed) await fs.rm(stage, { recursive: true, force: true }); }
```

</details>

**依据 15 · 源码核查**：[src/repository-updates.ts:54-77](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/repository-updates.ts#L54-L77)

真实更新路径/祖先链接/文件树限制。

<details>
<summary>查看原文（24行）</summary>

```text
function safePath(path: string) {
  if (typeof path !== "string" || !path || path.length > 512 || path.split("/").length > 64 || path.split("/").some(p => !p || p === "." || p === ".." || /[\\:<>"|?*\x00-\x1f]/.test(p) || /[. ]$/.test(p) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p))) throw failure("技能文件路径无效");
}
async function safeDirectory(root: string) {
  for (let p = root; ; p = dirname(p)) {
    const info = await fs.lstat(p);
    if (info.isSymbolicLink() || !info.isDirectory()) throw failure("技能或备份目录包含链接");
    if (dirname(p) === p) break;
  }
}
/** 完整读取目录，新增文件参与冲突检测，禁止跟随链接。 */
export async function readSkillTree(root: string) {
  await safeDirectory(root);
  const result: Archive = Object.create(null); let size = 0, count = 0;
  async function walk(dir: string, prefix = "") {
    for (const entry of await fs.readdir(dir)) {
      const path = prefix + entry; safePath(path);
      if (++count > 2000) throw failure("技能目录数量超限");
      const target = join(dir, entry), info = await fs.lstat(target);
      if (info.isSymbolicLink()) throw failure("技能包含链接，拒绝更新");
      if (info.isDirectory()) await walk(target, path + "/");
      else {
        if (!info.isFile() || info.size > 32 << 20 || (size += info.size) > 64 << 20 || Object.keys(result).length >= 1000) throw failure("技能文件数量或大小超限");
        result[path] = await fs.readFile(target);
```

</details>

**依据 16 · 源码核查**：[src/core.ts:2965-3004](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/core.ts#L2965-L3004)

真实删除目标核对和移动回收stage。

<details>
<summary>查看原文（40行）</summary>

```text
export async function deleteSkill(root: RootInput, name: string, log?: Log, options: MutationOptions = {}) {
  const definition = await checkedWritableRootDefinition(root);
  if (definition && definition.ok === false) return definition;
  if (!definition) return readonlyError("delete");
  const resolved = await resolveEntry(definition, name);
  if (resolved === null && !options.repositoryEntryOnly)
    return {
      ok: false,
      error: `技能不存在: ${name}`,
      code: "error.skill.notFound",
      params: { name },
    };
  const targets = (await safeExistingEntryPaths(definition.path, name))
    .filter(target => !options.repositoryEntryOnly || target.fileName === name);
  if (!targets.length) return { ok: false, error: `技能不存在: ${name}`, code: "error.skill.notFound", params: { name } };
  if (definition.key === "agents") {
    for (const target of targets) {
      if ((await lstatOrNull(target.path))?.isSymbolicLink())
        return { ok: false, error: `技能目录不安全，拒绝写入: ${target.path}`, code: "error.root.unsafe", params: { path: target.path } };
    }
  } else {
    const bundle = entryPath(definition.path, name);
    if (bundle && (await isDirectoryLink(bundle))) return linkedWriteError(bundle);
  }
  const id = options.repositoryTrash?.id || options.catalogTrash?.id || `${Date.now()}-${randomUUID()}`;
  if (!/^\d+-[a-f0-9-]{36}$/.test(id)) throw codedError("回收站条目编号非法", "error.trash.invalid", { id });
  const trashRoot = trashRootPath();
  const stage = join(trashRoot, `.stage-${randomUUID()}`);
  const finalPath = join(trashRoot, id);
  const moved = [];
  await fs.mkdir(stage, { recursive: true });
  try {
    for (const target of targets) {
      const destination = join(stage, target.fileName);
      const transferred = await movePathWithFallback(
        target.path,
        destination,
        options.renameOptions,
      );
      if (transferred.cleanupError && log)
```

</details>

**依据 17 · 源码核查**：[src/core.ts:3090-3138](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/core.ts#L3090-L3138)

真实恢复目标/冲突/移回/失败分支。

<details>
<summary>查看原文（49行）</summary>

```text
export async function restoreTrash(id: string, log?: Log, options: MutationOptions = {}) {
  const metadata = await readTrashMetadata(id);
  if (!metadata)
    return {
      ok: false,
      error: `回收站条目不存在: ${id}`,
      code: "error.trash.notFound",
      params: { id },
    };
  const definition = await restoreRootDefinition(metadata, options);
  if (!definition || definition.ok === false)
    return definition || readonlyError("restore");
  const root = definition.path;
  const conflicts = await safeExistingEntryPaths(root, metadata.name);
  if (conflicts.length)
    return {
      ok: false,
      error: `无法恢复，同名技能已存在: ${metadata.name}`,
      code: "error.trash.conflict",
      params: { name: metadata.name },
    };
  await fs.mkdir(root, { recursive: true });
  const itemRoot = join(trashRootPath(), id);
  const moved = [];
  let committed = false;
  try {
    for (const fileName of metadata.entries) {
      const source = join(itemRoot, fileName);
      const destination = join(root, fileName);
      if (
        !isSameOrDescendant(itemRoot, source) ||
        !isSameOrDescendant(root, destination)
      )
        throw codedError("回收站条目路径非法", "error.trash.invalid", { id });
      await movePathWithFallback(source, destination, options.renameOptions);
      moved.push({ source, destination });
    }
    if (options.repositoryRestore) {
      // Atomic success receipt: deleting a Trash entry is NOT evidence that its
      // files were restored. Keep this hidden receipt until provenance commits.
      await fs.rename(itemRoot, join(trashRootPath(), `.restored-${id}`));
    } else await fs.rm(itemRoot, { recursive: true, force: true });
    committed = true;
    if (log) log("restore", `从回收站恢复 ${metadata.name} -> ${root}`);
    return { id, name: metadata.name, root: trashRootMetadata(definition) };
  } catch (caught) { const error = caught as CodedError;
    if (committed) throw error;
    for (const item of moved.reverse())
      await movePathWithFallback(
```

</details>

#### 缺口

- 代理URL/全部下载/回收身份、并发/断电/跨卷恢复与完整技能可信性未测或全审。
  **影响**：不是安全沙箱/签名供应链、exactly-once或所有备份恢复承诺。
  **进一步探讨**：可丢弃项目测预览后编辑/来源写失败/rename失败/恢复冲突，对账目录/来源/备份再继续。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 还有什么写入/自更新权限容易被管理界面掩盖？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

create_skill工具真实enqueue调用createSkill并通知候选；描述要求用户明确请求只是说明，实际tools/pre-execute给ask，若sandboxPolicy或sandboxMode投影为danger-full-access则next不再询问，异常默认非full而ask。Host是否按预执行决策执行仍外部依赖，不能把每次生成都称必经确认。该控制不自动审查从市场安装的Skill正文或其后续工具副作用。

在线更新默认manager state true，Host配置updater:false/onlineUpdate:false可锁；registerPluginUpdater在GET/HEAD/POST前检查isEnabled并403拒。POST还核专用header/Origin并进程内installing互斥，查latest后真install，不只是版本通知。安装分支可走DSH CLI/包管理器spawn或Host installBundle，显式minimumReleaseAge=0并记录例外，可能改变profile依赖、要求重启；它与纯Skill文件复制不同，不能以“只读第三方Skill”概括全插件副作用。

关闭在线更新是对本插件路由禁用，不等阻断用户/宿主其它安装方式或回滚已装包。当前Host认证、包来源/发布链和所有npm安装钩子未独立审，公网上线/多人读写应另验；禁用自动入口也不清已写Skill/策略/来源与备份。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:375-399](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/index.ts#L375-L399)

真实create_skill执行与ask/fullaccess分支。

<details>
<summary>查看原文（25行）</summary>

```text
      async execute(args) {
        return enqueueMutation(async () => {
          const result = await createSkill(args, log);
          if (!result || result.ok !== false) afterWrite();
          return result;
        });
      },
      presentCall(args) {
        return { card: "generic", title: "Create DSH skill", kind: "edit", rawInput: args && args.name ? String(args.name) : undefined };
      },
    }), "skills-manager create_skill tool");
    if (typeof ctx.on === "function") {
      const registerPreExecute = () => ctx.on!("tools/pre-execute", (exec, next) => {
        if (exec && exec.name === "create_skill") {
          if (isDangerFullAccess(ctx, exec)) return next();
          return Promise.resolve({
            kind: "ask",
            reason: "Create a new skill under DSH_HOME/skills",
            displayReason: {
              en: "Create a new skill under DSH_HOME/skills",
              zh: "在 DSH_HOME/skills 目录下创建新技能",
            },
          });
        }
        return next();
```

</details>

**依据 2 · 源码核查**：[src/index.ts:281-307](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/index.ts#L281-L307)

真实fullaccess判据与异常默认false。

<details>
<summary>查看原文（27行）</summary>

```text
function isDangerFullAccess(ctx: HostContext, exec?: { agent?: unknown }): boolean {
  try {
    const agent = exec?.agent as { session?: { id?: string }; ctx?: { get?: (name: string) => unknown; sandboxPolicy?: unknown; sessionProjections?: unknown } } | undefined;
    const session = agent?.session;
    const sandboxPolicy = (ctx.sandboxPolicy as { resolve?: (req: unknown) => { mode?: string } } | undefined)
      || (typeof ctx.get === "function" ? (ctx.get("sandboxPolicy") as { resolve?: (req: unknown) => { mode?: string } } | undefined) : undefined)
      || (agent?.ctx && typeof agent.ctx.get === "function" ? (agent.ctx.get("sandboxPolicy") as { resolve?: (req: unknown) => { mode?: string } } | undefined) : undefined)
      || (agent?.ctx && (agent.ctx.sandboxPolicy as { resolve?: (req: unknown) => { mode?: string } } | undefined));

    if (sandboxPolicy && typeof sandboxPolicy.resolve === "function") {
      const resolved = sandboxPolicy.resolve(session ? { session } : {});
      if (resolved?.mode === "danger-full-access") return true;
    }

    const sessionProjections = (ctx.sessionProjections as { stateOf?: (session: unknown, key: string) => unknown } | undefined)
      || (typeof ctx.get === "function" ? (ctx.get("sessionProjections") as { stateOf?: (session: unknown, key: string) => unknown } | undefined) : undefined)
      || (agent?.ctx && typeof agent.ctx.get === "function" ? (agent.ctx.get("sessionProjections") as { stateOf?: (session: unknown, key: string) => unknown } | undefined) : undefined)
      || (agent?.ctx && (agent.ctx.sessionProjections as { stateOf?: (session: unknown, key: string) => unknown } | undefined));

    if (session && sessionProjections && typeof sessionProjections.stateOf === "function") {
      const mode = sessionProjections.stateOf(session, "sandboxMode");
      if (mode === "danger-full-access") return true;
    }

    return false;
  } catch {
    return false;
```

</details>

**依据 3 · 源码核查**：[src/core.ts:2079-2080](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/core.ts#L2079-L2080)

manager默认onlineUpdate true。

```text
  }
  return { version: 1, sources, disabledSkills, enabledSkills, sidebarEntry: false, onlineUpdate: true, categories: Object.create(null), categoryMembers: Object.create(null), categoryOrder: Object.create(null), customNotes: Object.create(null) };
```

**依据 4 · 源码核查**：[src/index.ts:319-331](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/index.ts#L319-L331)

Host关闭优先与updater实际注册。

<details>
<summary>查看原文（13行）</summary>

```text
function apply(ctx: HostContext, config?: PluginConfig) {
  const hostDisabled = config?.updater === false || config?.onlineUpdate === false;
  const isUpdateEnabled = async () => {
    if (hostDisabled) return false;
    return await getOnlineUpdate();
  };

  ctx.effect(() => registerPluginUpdater(ctx, {
    endpoint: "/api/michengai/dsh-skills-manager/update",
    packageName: "@michengai/dsh-skills-manager",
    manifestUrl: new URL("../package.json", import.meta.url),
    isEnabled: isUpdateEnabled,
  }), "skills-manager: plugin updater");
```

</details>

**依据 5 · 源码核查**：[src/plugin-updater.ts:411-465](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/plugin-updater.ts#L411-L465)

真实GET/POST禁用/header/Origin/互斥/install。

<details>
<summary>查看原文（55行）</summary>

```text
  let installing = false;
  if (host.connection?.fetch?.register) {
    return host.connection.fetch.register({
      path: options.endpoint,
      methods: ["GET", "HEAD", "POST"],
      requestBody: "buffered",
      fetch: async (request: Request) => {
        try {
          if (options.isEnabled) {
            const allowed = await options.isEnabled();
            if (!allowed) {
              return Response.json({ ok: false, code: "error.update.disabled", error: "在线更新已被禁用。" }, { status: 403, headers: { "cache-control": "no-store" } });
            }
          }
          const target = runtime(host);
          if (request.method === "GET" || request.method === "HEAD") {
            const payload = await status(options, target);
            return new Response(request.method === "HEAD" ? null : JSON.stringify(payload), {
              status: 200,
              headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
            });
          }
          if (request.method !== "POST") {
            return new Response(null, { status: 405, headers: { allow: "GET, HEAD, POST" } });
          }
          if (request.headers.get(PLUGIN_UPDATE_HEADER) !== "1") {
            return Response.json({ error: "已拒绝非同源专用更新请求。" }, { status: 403 });
          }
          const origin = request.headers.get("origin");
          if (origin) {
            try {
              const originHost = new URL(origin).host;
              const reqHost = request.headers.get("host") || new URL(request.url).host;
              if (originHost !== reqHost) {
                return Response.json({ error: "已拒绝非同源专用更新请求。" }, { status: 403 });
              }
            } catch {
              return Response.json({ error: "已拒绝非同源专用更新请求。" }, { status: 403 });
            }
          }
          if (installing) {
            return Response.json({ error: "当前插件正在更新，请稍候。" }, { status: 409 });
          }
          const before = await status(options, target);
          if (before.latestVersion === void 0) {
            return Response.json({ error: "暂时无法获取最新版本。" }, { status: 503 });
          }
          if (!before.updateAvailable) {
            return Response.json(before, { status: 200 });
          }
          installing = true;
          try {
            await install(target, `${options.packageName}@${before.latestVersion}`);
          } finally {
            installing = false;
```

</details>

**依据 6 · 源码核查**：[src/plugin-updater.ts:335-353](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/plugin-updater.ts#L335-L353)

真实CLI安装/minimumReleaseAge=0/超时kill。

<details>
<summary>查看原文（19行）</summary>

```text
async function runCliInstall(target: UpdateTarget, packageSpec: string) {
  if (target.cliEntry === void 0) throw new Error("\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u81EA\u52A8\u66F4\u65B0\uFF0C\u8BF7\u4F7F\u7528\u624B\u5DE5\u66F4\u65B0\u547D\u4EE4\u3002");
  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn(process.execPath, [target.cliEntry!, "plugin", "--profile", target.profileName, "add", "--config.minimumReleaseAge=0", packageSpec, "--registry=https://registry.npmjs.org/"], {
      cwd: target.profileDir,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NO_COLOR: "1" }
    });
    let detail = "";
    child.stdout?.on("data", (chunk) => {
      detail = (detail + String(chunk)).slice(-4e3);
    });
    child.stderr?.on("data", (chunk) => {
      detail = (detail + String(chunk)).slice(-4e3);
    });
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("\u66F4\u65B0\u8D85\u65F6\uFF0C\u8BF7\u6539\u7528\u624B\u5DE5\u66F4\u65B0\u3002"));
```

</details>

**依据 7 · 源码核查**：[src/plugin-updater.ts:366-399](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/plugin-updater.ts#L366-L399)

真实其它安装分支与来源例外记录。

<details>
<summary>查看原文（34行）</summary>

```text
async function install(target: UpdateTarget, packageSpec: string) {
  if (target.desktopPnpm !== void 0) {
    await guardReleaseAgeExclude(target.profileDir, packageSpec);
    const handle = target.desktopPnpm.runPlugin(["add", "--config.minimumReleaseAge=0", packageSpec, "--registry=https://registry.npmjs.org/"], target.profileDir);
    const result = await handle.done;
    if (result.exitCode !== 0) throw new Error(`更新进程退出码 ${String(result.exitCode)}。`);
    await recordReleaseAgeExclude(target.profileDir, packageSpec);
    return;
  }
  if (target.packageManager !== void 0) {
    await guardReleaseAgeExclude(target.profileDir, packageSpec);
    const manager = target.packageManager;
    await new Promise<void>((resolvePromise, reject) => {
      const child = spawn(manager.command, [...manager.args, "add", "--config.minimumReleaseAge=0", packageSpec, "--registry=https://registry.npmjs.org/"], {
        cwd: target.profileDir, windowsHide: true, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, ...manager.env, NO_COLOR: "1" },
      });
      let detail = "";
      child.stdout?.on("data", (chunk) => { detail = (detail + String(chunk)).slice(-4e3); });
      child.stderr?.on("data", (chunk) => { detail = (detail + String(chunk)).slice(-4e3); });
      const timer = setTimeout(() => { child.kill(); reject(new Error("更新超时，请改用手工更新。")); }, 10 * 6e4);
      child.once("error", (error) => { clearTimeout(timer); reject(error); });
      child.once("exit", (code) => { clearTimeout(timer); if (code === 0) resolvePromise(); else reject(new Error(detail.trim() || `更新进程退出码 ${String(code)}`)); });
    });
    await recordReleaseAgeExclude(target.profileDir, packageSpec);
    return;
  }
  if (target.pluginManager !== void 0) {
    await guardReleaseAgeExclude(target.profileDir, packageSpec);
    const result = await target.pluginManager.installBundle(packageSpec);
    if (result.application === "applied" || result.application === "restart-required" || result.application === "overridden") {
      await recordReleaseAgeExclude(target.profileDir, packageSpec);
      return;
    }
    throw new Error(result.error?.message || result.packageResult?.output || "更新失败，请查看服务端日志。");
```

</details>

#### 缺口

- 当前Host认证/审批、npm发布链/安装脚本、更新失败回滚与子进程取消效果未独立验。
  **影响**：不能当共享部署安全保证或只读工具；限隔离试用，先关不需在线更新。
  **进一步探讨**：在隔离profile验证Host拒绝/明确ask/fullaccess差异、禁更新403与依赖还原路径，发布物另核。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 最小试用与可证伪增量怎样选？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

多来源DSH维护者可在隔离profile、可丢弃登记项目试一个已人审Skill，先关闭不需在线自更新；核候选/正文/来源/启停，再预览一次固定变更并检查backup/回退/回收同名冲突。基线手工固定git/文件备份，记录误覆盖、版本来源误判和总人时；来源未知/预览变化/恢复报错时停写并人工核备份，回原生Skill目录管理，不连续重试。

首次Node/Host/Git/权限/扫描配置，持续仓库网络/缓存/备份磁盘与人工内容/差异审阅，失败恢复/来源状态修复、退出策略/覆盖层注销与库清理等现金资源与人时未知，不填0。代表Skill安装不运行下载脚本，不代表Agent之后不会执行Skill里的脚本/命令；需把后续模型/工具费用与权限计入。退出先查所有全局/项目实际文件、来源/回收/备份和禁用策略，再卸插件核Host provider撤销；不能假定移除UI会撤已安装Skill。

独立假设：在现有diff/hash/来源和回退基础上，将权限敏感指令、来源信任、预计写入目标和使用后的实际效果收据并列，可能减少把“可安装/已备份”当可信/有用的误判。先比现有界面加人工清单的小修，不另造市场；用未知来源/同名副本/本地变化/恶意正文/失败回退样本，测发现率、误报、恢复人时与维护成本。若已有diff/清单足够或审阅负担抵消收益则否定，未验证不计当前创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/repository-updates.ts:113-149](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/repository-updates.ts#L113-L149)

既有token/备份与恢复边界。

<details>
<summary>查看原文（37行）</summary>

```text
    const token = hash(JSON.stringify({ id, path, root: record.root || "dsh", workspace: record.workspace ?? null, commit, current, next, rollback: input.rollback === true }));
    return { data, record, target, entries, next, current, token, commit, localModified: signature(current) !== signature(record.files), changes: changesBetween(current, next) };
  }
  async function replace(input: SkillRequest, rollback = false) {
    const plan = await prepare({ ...input, rollback }, true);
    if (typeof input.token !== "string" || input.token !== plan.token) throw failure("文件或版本已变化，请重新预览");
    if (plan.localModified && input.overwrite !== true) throw failure("存在本地修改，请确认备份后替换", "error.repo.modified");
    const { data, record, target, entries } = plan;
    const backupRoot = join(managerHomePath(), "repository-backups");
    await fs.mkdir(backupRoot, { recursive: true }); await safeDirectory(backupRoot);
    const key = randomUUID(), backup = join(backupRoot, key), stage = join(backupRoot, randomUUID());
    await fs.mkdir(stage);
    let moved = false, replaced = false, recoveryFailed = false;
    try {
      for (const [path, bytes] of Object.entries(entries!)) {
        safePath(path); const file = join(stage, ...path.split("/"));
        await fs.mkdir(dirname(file), { recursive: true }); await fs.writeFile(file, bytes, { flag: "wx" });
      }
      // 下载期间仍可能编辑文件，替换前复验，避免覆盖预览之后的修改。
      if (signature(fileIndex(await readSkillTree(target))) !== signature(plan.current)) throw failure("本地文件已变化，请重新预览");
      const previous = { ...record }; delete previous.backup;
      const nextRecord = rollback ? { ...record.backup!.record } : { ...previous, commit: plan.commit, files: plan.next };
      nextRecord.backup = { key, fingerprint: signature(plan.current), record: previous };
      // 跨卷或文件锁导致重命名失败时直接终止，不降级为覆盖复制。
      await renameWithRetry(target, backup); moved = true;
      await renameWithRetry(stage, target); replaced = true;
      data.installs[data.installs.indexOf(record)] = nextRecord;
      await write(data);
    } catch (caught) { const error = caught as CodedError;
      if (moved) {
        try {
          if (replaced) await renameWithRetry(target, stage);
          await renameWithRetry(backup, target);
        } catch { recoveryFailed = true; throw failure("自动恢复失败，原文件保留在备份目录，请勿重复操作", "error.repo.state"); }
      }
      throw error;
    } finally { if (!recoveryFailed) await fs.rm(stage, { recursive: true, force: true }); }
```

</details>

**依据 2 · 源码核查**：[src/repositories.ts:764-779](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/repositories.ts#L764-L779)

安装自动启用及未确认来源失败。

<details>
<summary>查看原文（16行）</summary>

```text
        const result = await importUploadedSkill({ name: skill.name, entries }, log, { conflict: "skip", root });
        if (result.ok === false || !result.imported?.length) throw failure(result.error || "技能安装失败或遇到同名冲突", typeof result.code === "string" ? result.code : "error.repo.conflict", result.params);
        copied = true;
        // 界面默认显示已启用，安装完成后走策略初始化，确保不在禁用列表中。
        const enabled = await setSkillEnabled(root, skill.name, true, log);
        if (enabled && typeof enabled === "object" && "ok" in enabled && enabled.ok === false) throw failure(enabled.error || "技能启用状态无法写入", typeof enabled.code === "string" ? enabled.code : "error.repo.enableState", enabled.params);
      } catch (caught) { const error = caught as CodedError;
        data.installs = data.installs.filter(item => item !== record);
        try { await write(data); }
        catch { throw failure("安装未完成且来源记录无法撤销，请恢复磁盘写入后检查技能目录", "error.repo.installState"); }
        if (copied) await fs.rm(join(root.path, skill.name), { recursive: true, force: true }).catch(() => undefined);
        throw error;
      }
      record.complete = true;
      try { await write(data); }
      catch { throw failure("技能文件已安装但来源状态未确认，请恢复磁盘写入后重新打开仓库页", "error.repo.installState"); }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:807-824](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/index.ts#L807-L824)

卸载路由释放不是Skill文件删除。

<details>
<summary>查看原文（18行）</summary>

```text
    if (ctx.connection?.fetch?.register) {
      const disposers = routes.map((route) =>
        ctx.connection!.fetch.register({
          path: route.path,
          methods: route.methods,
          requestBody: route.requestBody ?? "buffered",
          fetch: route.fetch,
        })
      );
      return () => {
        for (const disposer of disposers) {
          try {
            disposer();
          } catch {
            /* ignore */
          }
        }
      };
```

</details>

**依据 4 · 源码核查**：[src/core.ts:2605-2619](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/core.ts#L2605-L2619)

禁用是本地策略非改原文件。

<details>
<summary>查看原文（15行）</summary>

```text
async function setPolicySkillEnabled(root: RootInput, name: string, enabled: boolean, log?: Log) {
  const definition = await checkedPolicyRootDefinition(root);
  if (definition && definition.ok === false) return definition;
  if (!definition) return readonlyError("toggle");
  const current = await readManagerState();
  if (current.writable === false) return invalidManagerStateWrite();
  const result = await applyPolicySkillEnabled(definition, name, enabled, current.state);
  if (result && result.ok === false) return result;
  await writeManagerState(current.state);
  if (log)
    log(
      enabled ? "policy-enable" : "policy-disable",
      `${enabled ? "启用" : "停用"} ${definition.key}/${name}（本地策略，源文件不变）`,
    );
  return result;
```

</details>

**依据 5 · 源码核查**：[src/plugin-updater.ts:419-422](https://github.com/MichengAI/dsh-skills-manager/blob/8d6b850f91fde835411aaa1f3263265220337d5c/src/plugin-updater.ts#L419-L422)

可关在线更新。

```text
          if (options.isEnabled) {
            const allowed = await options.isEnabled();
            if (!allowed) {
              return Response.json({ ok: false, code: "error.update.disabled", error: "在线更新已被禁用。" }, { status: 403, headers: { "cache-control": "no-store" } });
```

#### 缺口

- 真实需求/节时、内容审查/恢复成本、退出策略与文件清理未测；新增收据净效果未知。
  **影响**：采用限定可丢弃试用，不能许诺供应链安全/省维护；假设非现成成果。
  **进一步探讨**：对照原生目录/人工git清单计错误、人时、资源与恢复，持续净收益再扩。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
