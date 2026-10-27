# dsh-armory

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[eb954d0](https://github.com/2026heshao/dsh-armory/tree/eb954d0f46f5eae50742dbacf071aec768512c8d)

<!-- BEGIN META -->
[![GitHub ★ 24](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=24&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2026heshao/dsh-armory) [![npm 30d 459](https://img.shields.io/static/v1?label=npm+30d&message=459&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-armory) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-armory)
<!-- END META -->

> **实现功能**：整合DSH的MCP、Skill、专家和插件管理，提供市场入口、安装来源与工具使用账本。

> **核心亮点**：相对手改配置与分散市场，增加统一生命周期、来源识别和观测反馈；fork归属和上游管理能力须保留。见 [Q01](#research-q01)。

> **风险与缺陷**：清单摘要与零调用指标不能当可信放行；更新先删旧后换入、时间兜底和同名投影都有限制。见 [Q03](#research-q03)。

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
  - [Q01 · 军械库把哪些分散管理任务整合起来？](#detail-section-11)
  - [Q02 · 技能安装、来源和最近安装展示如何建立对应？](#detail-section-12)
  - [Q03 · “校验后安装”和工具裁缝是否构成可靠放行？](#detail-section-13)
  - [Q04 · 管理便利把什么负担转移给用户？](#detail-section-14)
  - [Q05 · 哪些可复用安排值得保留，当前怎样试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已有多组件管理负担的DSH用户；管理对象正确、作用域清楚且可恢复才算合格。原生/手工基线见 [Q01](#research-q01)。

宿主原生管理、手工配置/市场浏览和上游MCP管理UI；不以市场规模或扫描次数推断收益。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 多组件看板 | 统一浏览与管理 | 宿主接口兼容 |
| Skill安装/删除 | 管理本地技能生命周期 | 有条件摘要校验，删除永久 |
| 安装来源/时间 | 识别市场名与最近安装 | 缺账本用文件时间、同名首个 |
| 工具使用账本 | 查看调用及上下文量级 | 字符粗估、日志覆盖有限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.15与兼容DSH管理接口 | 必需 | 载入RPC与日志解压 | 对应功能不可用 |
| 配置/技能目录权限 | 管理操作必需 | 安装、启停、删除 | 失败需核对部分状态 |
| 市场网络与来源信任 | 市场操作必需 | 下载目录与技能 | 缓存不等同当前可用 |
| MCP账户/凭据 | 对应连接器必需 | 连接与授权 | 需单独维护服务费用/许可 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户备份隔离profile及技能 | 明确可恢复副本 |
| 2 | 安装重启、先只读核对象/来源 | 列表对应真实状态 |
| 3 | 用非关键技能试装/更新/卸载 | 逐文件与宿主可见性一致 |
| 4 | 再审阅工具税与连接器授权 | 不以粗估或零调用直接删能力 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地目录、市场网络 | 备份配置、核来源/作用域/凭据 | 配置时间未知 |
| 持续使用 | 被管理服务费用、日志扫描 | 审阅技能与工具建议、维护认证 | 无净节省数据 |
| 失败恢复 | 下载重试与备份存储 | 核对目录/账本/宿主真实状态 | 更新失败可能无旧版自动恢复 |
| 退出迁移 | 保留配置与技能副本 | 禁用入口、撤销无用凭据 | 删除永久，需事先备份 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一管理 | 多模块与RPC接线 | 完整宿主流程与净节时 |
| 来源识别 | 账本关联与时间投影 | 同名/外部安装身份准确性 |
| 工具成本观测 | 日志与Schema粗估 | 精确账单和禁用后任务影响 |

> **思考**：清单摘要与零调用指标不能当可信放行；更新先删旧后换入、时间兜底和同名投影都有限制。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手改配置与分散市场，增加统一生命周期、来源识别和观测反馈；fork归属和上游管理能力须保留。见 [Q01](#research-q01)。

相对手改配置与分散市场，增加统一生命周期、来源识别和观测反馈；fork归属和上游管理能力须保留。见 [Q01](#research-q01)。

可信源删除与日志缺失诊断值得复用；更新事务和身份粒度仍应谨慎检查，入口集中同时扩大了配置/删除权限面。见 [Q03](#research-q03) 与 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

清单摘要与零调用指标不能当可信放行；更新先删旧后换入、时间兜底和同名投影都有限制。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议隔离profile先验证非关键组件的安装、更新、卸载和重启，保留配置及技能备份；不按零调用直接禁用应急能力。具体停止条件见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

统一管理和生命周期有源码支持；完整安装恢复、OAuth协议与净收益未独立验证；事务更新是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/wb-market.js、lib/wb-install-state.js、lib/skill-dir-times.js、lib/skill-remove.js、lib/tool-ledger.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定宿主接线、Skill安装/删除、安装来源/时间与工具税估算；未逐项覆盖全部市场、OAuth、专家提示和客户端操作。
- 下一步：已检查源码；未执行目标安装、删除、OAuth、作者测试或真实宿主流程。

**分析版本**

- **仓库**：[2026heshao/dsh-armory](https://github.com/2026heshao/dsh-armory)
- **版本号**：2.4.0（[固定提交 eb954d0](https://github.com/2026heshao/dsh-armory/tree/eb954d0f46f5eae50742dbacf071aec768512c8d)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设为可恢复Skill更新事务，保留旧版并显式提交状态；故障矩阵、比较指标与否定条件见 [Q05](#research-q05)。

已检查源码；未执行目标安装、删除、OAuth、作者测试或真实宿主流程。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 318 | 262 | 36 | — |
| .md | source | 20 | 2148 | — | — | 50377 |
| .js | source | 30 | 25907 | 20351 | 4929 | — |
| .mjs | test | 61 | 15228 | 11667 | 2638 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/2026heshao/dsh-armory/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对军械库整合管理的生命周期、来源投影和可恢复边界，避免将安装/观测当业务验收。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 军械库把哪些分散管理任务整合起来？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是同时维护多MCP、Skill、专家与插件的DSH用户。合格结果不只是搜到或下载，而是正确对象安装/启停、来源可追溯、作用域准确、出错后可恢复。相对手改配置和分别逛市场，增量在统一看板、来源账本、技能生命周期和日志使用观测的组合。项目明确fork自已有MCP管理UI，不能把继承看板与所有协议算原创。市场条目数量与工具零调用都不是用户收益或可装性验收；是否值得整合取决于已有管理复杂度。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-8](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/README.md#L5-L8)

作者定位与fork归属。

```text
> **DeepSeek Harness 的一体化管理看板**：MCP · 技能 · 专家 · 插件 · 工具账本 · 四大市场，浏览、搜索、一键安装、一键召唤。
> fork 自 [Imzl-zl/dsh-mcp-manager-ui](https://github.com/Imzl-zl/dsh-mcp-manager-ui)（MIT），现已扩展为完整军械库。
>
> **最新 v2.4.0**：Skill 看板回答「什么时候装的、哪个是刚装的、它就是市场里那个吗」——卡片显示安装时间（7 天内高亮），筛选条新增「最近安装」时间线，看板名与市场原名不一致时标出原名。详见 [更新日志](.github/release-notes/v2.4.0.md)。
```

**依据 2 · 作者声明**：[README.md:31-42](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/README.md#L31-L42)

作者逐项说明管理痛点。

<details>
<summary>查看原文（12行）</summary>

```text
## 它解决什么

| 痛点 | 本插件的做法 |
|---|---|
| MCP 配置要手改 YAML，改完不知道连没连上 | 可视化面板：状态、工具 Schema、启停、重连，全局与项目双作用域，项目级改完即对存活会话生效 |
| 装技能要去各处翻 `SKILL.md` 仓库 | **市场直连**：SkillHub 19 万+ 技能、WorkBuddy 316 个连接器，搜索/筛选/一键安装，逐文件 sha256 校验 |
| 在市场装了技能，回看板却找不到，也分不清哪个是刚装的 | **技能安装可辨识**：卡片标「装于 …」，7 天内高亮并给相对时间；筛选条按安装时间倒序成「最近安装」；看板名与市场原名不一致时标出「来自市场 原名」 |
| 每个 MCP 的工具描述都在吃上下文 token，零调用的工具白白占位 | **工具裁缝**：扫描本机会话日志统计每个工具的调用/错误/延迟，并给出技能维度的使用账本；死工具清单一键禁用 |
| 从 Claude/Cursor/VS Code 迁移要逐条抄配置 | 自动检出 11 种客户端的本机配置，预览后一键导入 |
| 插件散在宿主自带与社区清单两处，格式与可装性各不相同 | **插件页**：把 DSH 社区清单一并呈现并标明可装性（宿主自带组件单独标注），安装统一走宿主 `pluginManager`，装完明确提示需重启 |
| 远端 MCP 要 OAuth，而官方 client 只认静态 headers，只能手搓 token | **一键授权**：按 RFC 9728/8414/7591/7636/8707 走完发现 → 注册 → PKCE → 回调 → 换 token，回调通道三级降级（loopback / 粘贴回调地址 / 手贴 token），到期自动刷新 |
| 装过的连接器、插件，过几天忘了是从哪来的 | **安装状态账本**：`~/.dsh/armory/install-state.json` 记录每条的来源市场，市场页可跨页筛出已安装项，并把「本插件装的」与「别处手动配的」分开 |
```

</details>

**依据 3 · 源码核查**：[lib/index.js:16-53](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/lib/index.js#L16-L53)

生命周期、市场、账本和观测模块接线。

<details>
<summary>查看原文（38行）</summary>

```text
import { removeSkillFromDisk } from "./skill-remove.js";
// Skill 看板的安装时间 + 市场原名投影（名字自建映射，lib/skill-dir-times.js）。
import { skillInstallInfo } from "./skill-dir-times.js";
import { WHATS_NEW } from "./whats-new.js";
import { attachWhatsNewEnglish } from "./whats-new-en.js";
import { probeMcpServersAuthorization, wbConnectorCatalog, wbConnectorCachedCount, wbConnectorIcon, wbConnectorPreview, wbSkillCatalog, wbSkillDetail, wbSkillInstall, wbSkillInstalled, wbSkillUninstall } from "./wb-market.js";
// T03/R4：多市场注册表（连接器源）的宿主侧数据层。
import { readRegistry, upsertMarketplace } from "./wb-registry.js";
// T06/Awesome：DSH 社区插件市场（awesome-dsh-plugins）的宿主侧数据层。
import { wbAwesomeCatalog, wbAwesomeDetail, wbAwesomeReadme, wbAwesomeUpdateCheck } from "./wb-awesome-market.js";
// 社区元信息（维护者 / 最近提交 / issue / star）：打开详情时按需查，6 小时缓存。
import { wbRepoMeta } from "./community-meta.js";
// npm 近 30 天下载量：插件卡片底栏的「↓N」，目录里没有这个字段，只能去 npm 统计接口取。
import { wbNpmDownloads } from "./npm-downloads.js";
// 装备清单：只读汇总本机已装条目，校验与差异计算保持纯函数（lib/loadout.js）。
import { buildLoadout, diffLoadout } from "./loadout.js";
import { readState as readInstallState, record as recordInstallState, forget as forgetInstallState } from "./wb-install-state.js";
// 自定义套件（Skill 看板）：读 / 整集合覆盖保存，数据层 lib/suites-registry.js。
import { readSuites as readSkillSuites, saveSuites as writeSkillSuites } from "./suites-registry.js";
import { applyTokens } from "./wb-auth-rules.js";
import {
	authorizationOverview as oauthOverview,
	authorizationStatus as oauthStatus,
	beginAuthorization as oauthBegin,
	cancelAuthorization as oauthCancel,
	clearTokenRecord as oauthClearToken,
	ensureAccessToken as oauthEnsureToken,
	isSerializedGarbageCredential as oauthIsGarbageCredential,
	isUsableBearerToken as oauthIsUsableToken,
	saveManualToken as oauthSaveManualToken,
	submitCallback as oauthSubmitCallback,
} from "./mcp-oauth.js";
import { hasTeamBridge, installExpertSkills, listExpertRecent, listExpertSkills, prepareExpertPersona, readExpertDisplayNames, readExpertPresets, recordExpertRecent, removeExpertPreset, uninstallExpertSkills, uninstallTeamMemberPersonas, wbExpertCatalog, wbExpertDetail, writeExpertPreset } from "./expert-market.js";
import { attachPersona, detachPersona, listPersonas, reconcilePersonas } from "./session-persona.js";
// clearTextCache 的 import 已随 toolTailor 的「清空缓存」动作一起删掉（见下方 toolTailor 注释）。
import { scanSessionLedger } from "./tool-ledger.js";
import { evaluateEnvExpression, jsExpressionToTemplate } from "./workspace-config.js";
import { canonicalWorkspacePath, installAgentRuntime, listWorkspaceRecords, liveWorkspaceAgentCount, projectConnectionsView, readWorkspaceConfigCached, reconcileWorkspaceConnections, reconcileWorkspaceRestricts, reconnectWorkspaceServer, withWorkspaceWrite, workspaceConnectionStatus, workspaceMountErrorsView, workspaceRestrictErrorView, workspaceScopeErrorsView, workspaceToolSchemas, writeWorkspaceConfigFile } from "./workspace-runtime.js";
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 技能安装、来源和最近安装展示如何建立对应？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

安装器按目标目录在进程内排队，先拉清单，限制文件数/声明总体积并要求SKILL.md；文件落到staging路径，检查包含性，在有sha256且响应非空时校验内容，然后换入最终目录并逐文件stat。来源账本按kind/key保留首次installedAt和最近更新，技能展示另扫标准根目录的SKILL.md头部name，以目录路径关联账本。缺账本时用birthtime/mtime兜底，同名技能按扫描首个优先。因此“安装时间”和“市场原名”是有优先级的投影，不能把兜底文件时间视为真实安装事件或把同名当唯一身份。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wb-market.js:637-705](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/lib/wb-market.js#L637-L705)

排队、staging、摘要条件和最终替换。

<details>
<summary>查看原文（69行）</summary>

```text
const skillInstallLocks = new Map();
export async function wbSkillInstall(payload = {}, { onProgress } = {}) {
  const slug = String(payload?.slug || "").trim();
  const namespace = String(payload?.namespace || "").trim();
  if (!slug || !namespace) throw new Error("缺少 slug 或 namespace");
  const finalDir = join(homedir(), ".agents", "skills", skillTargetName(namespace, slug));
  const previous = skillInstallLocks.get(finalDir);
  let run;
  // 前序任务失败不该连坐后序：catch 吞掉前序拒绝后再排自己的。
  const queued = previous ? previous.catch(() => {}) : Promise.resolve();
  run = queued
    .then(() => installSkillLocked(payload, { onProgress }, finalDir))
    .finally(() => {
      if (skillInstallLocks.get(finalDir) === run) skillInstallLocks.delete(finalDir);
    });
  skillInstallLocks.set(finalDir, run);
  return run;
}
async function installSkillLocked(payload = {}, { onProgress } = {}, finalDir) {
  const slug = String(payload?.slug || "").trim();
  const namespace = String(payload?.namespace || "").trim();
  const requestedName = String(payload?.name || "").trim();
  const listing = await wbSkillFiles(payload);
  if (!listing.files.length) throw new Error("该技能没有可下载的文件");
  if (listing.files.length > 400) throw new Error(`文件数超出上限（${listing.files.length} > 400）`);
  const stagingDir = `${finalDir}.installing`;
  const totalBytes = listing.files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > 32 * 1024 * 1024) throw new Error(`技能总体积超过 32MB 上限（${Math.round(totalBytes / 1024 / 1024)}MB）`);
  // 必须有 SKILL.md，否则装了也不会被注册表发现——直接拒绝而不是装个哑包。
  const hasSkillMd = listing.files.some((file) => file.path === "SKILL.md");
  if (!hasSkillMd) throw new Error("清单里没有 SKILL.md，不是标准技能包，拒绝安装");
  await rm(stagingDir, { recursive: true, force: true });
  await mkdir(stagingDir, { recursive: true });
  let doneBytes = 0;
  try {
    for (const [index, file] of listing.files.entries()) {
      const relative = file.path;
      // 路径安全：解析后必须落在 staging 内（拒绝 ../、绝对路径、盘符）。
      const target = resolve(stagingDir, relative);
      if (target !== stagingDir && !target.startsWith(stagingDir + sep)) throw new Error(`清单里的非法路径：${relative}`);
      const params = new URLSearchParams({ namespace, path: relative });
      if (listing.version) params.set("version", listing.version);
      const buffer = await fetchWithLimits(`${SKILLHUB_ORIGIN}/api/v1/skills/${encodeURIComponent(slug)}/file?${params.toString()}`);
      if (file.sha256 && buffer.length) {
        const digest = createHash("sha256").update(buffer).digest("hex");
        if (digest !== file.sha256) throw new Error(`文件校验失败（${relative}）：sha256 不匹配`);
      }
      await mkdir(resolve(stagingDir, relative, ".."), { recursive: true });
      await writeFile(target, buffer);
      doneBytes += buffer.length;
      onProgress?.({ phase: "downloading", index: index + 1, total: listing.files.length, bytes: doneBytes, totalBytes });
    }
    // 最终位置已被占用（同名/换版本重装）：先挪开旧的，再原子换入。
    await rm(finalDir, { recursive: true, force: true });
    await rename(stagingDir, finalDir);
  } catch (error) {
    await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
  // 落盘后逐文件复核：清单里的每个路径都必须真实存在才许报成功。缺 SKILL.md 的残包
  // 不会被注册表发现（「显示成功但看板里没有」的假安装），宁可清掉现场报失败，
  // 也不留一个挂着「已安装」却永远不生效的哑目录。
  for (const file of listing.files) {
    try {
      await stat(resolve(finalDir, file.path));
    } catch {
      await rm(finalDir, { recursive: true, force: true }).catch(() => {});
      throw new Error(`安装后校验失败：${file.path} 未落盘（${finalDir}），已清理现场，请重试`);
    }
```

</details>

**依据 2 · 源码核查**：[lib/wb-install-state.js:114-125](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/lib/wb-install-state.js#L114-L125)

来源记录保留首次安装时间。

<details>
<summary>查看原文（12行）</summary>

```text
export async function record(item, options = {}) {
  const normalized = normalizeItem(item);
  if (!normalized.key) throw new Error("安装状态条目缺少 key，无法登记");
  const path = statePath(options);
  const { items } = await readState(options);
  const now = Date.now();
  const index = items.findIndex((entry) => entry.kind === normalized.kind && entry.key === normalized.key);
  if (index >= 0) {
    const existing = items[index];
    items[index] = {
      ...normalized,
      installedAt: existing.installedAt || now,
```

</details>

**依据 3 · 源码核查**：[lib/skill-dir-times.js:55-107](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/lib/skill-dir-times.js#L55-L107)

路径账本关联、同名首个与时间兜底。

<details>
<summary>查看原文（53行）</summary>

```text
export async function skillInstallInfo(payload = {}, options = {}) {
  const home = options.home || homedir();
  const roots = [
    join(home, ".agents", "skills"),
    join(home, ".dsh", "skills"),
  ];
  const cwd = String(payload?.cwd || "").trim();
  if (cwd) {
    roots.push(join(cwd, ".agents", "skills"));
    roots.push(join(cwd, ".dsh", "skills"));
  }
  const ledger = await listInstalled("skill", options).catch(() => []);
  const byPath = new Map(
    ledger.filter((row) => row && row.installPath).map((row) => [normPath(row.installPath), row]),
  );
  const info = {};
  for (const root of roots) {
    let entries = [];
    try {
      entries = await readdir(root);
    } catch {
      continue; // 根目录不存在（没装过任何市场技能 / 没有 ~/.dsh/skills）：跳过
    }
    for (const entry of entries) {
      if (entry.startsWith(".")) continue;
      const dir = join(root, entry);
      let dirStat;
      try {
        dirStat = await stat(dir);
      } catch {
        continue; // 竞态删除等：跳过
      }
      if (!dirStat.isDirectory()) continue;
      let name = "";
      try {
        name = frontmatterName(await head(join(dir, "SKILL.md")));
      } catch {
        continue; // 没有 SKILL.md：注册表发现不了，不进映射
      }
      if (!name) name = entry;
      if (info[name]) continue; // 同名：首个根/首个目录优先
      const hit = byPath.get(normPath(dir));
      const bornAt = Math.round(Number(dirStat.birthtimeMs) || 0);
      const row = {
        installedAt: (hit?.installedAt || 0) || bornAt || Math.round(Number(dirStat.mtimeMs) || 0),
        dir,
      };
      if (hit?.name) {
        row.marketName = hit.name;
        row.marketplace = hit.source?.marketplace || "";
        row.marketVersion = hit.version || "";
      }
      info[name] = row;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “校验后安装”和工具裁缝是否构成可靠放行？

**研究主题**：缺陷与关键质疑

#### 完整回答

关键质疑是完整性与观察指标被误当安全/收益。安装摘要来自同一来源清单，只能支持字节一致性，不能证明Skill可信；且校验条件允许无摘要或空响应跳过。当前更新先rm旧目录再rename新目录，rename失败并不自动恢复旧内容，进程内锁也不等于跨进程事务。卸载做来源白名单、realpath和链接处理，但最终是永久删除，不能从“有确认”推成可撤销。工具裁缝用Schema JSON字符/4粗估token，日志有体积/帧/映射上限与不完整窗口，零调用只能触发检查，禁用罕用应急工具可能损失任务能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/wb-market.js:680-694](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/lib/wb-market.js#L680-L694)

有条件摘要检查和先删再换入。

<details>
<summary>查看原文（15行）</summary>

```text
      if (file.sha256 && buffer.length) {
        const digest = createHash("sha256").update(buffer).digest("hex");
        if (digest !== file.sha256) throw new Error(`文件校验失败（${relative}）：sha256 不匹配`);
      }
      await mkdir(resolve(stagingDir, relative, ".."), { recursive: true });
      await writeFile(target, buffer);
      doneBytes += buffer.length;
      onProgress?.({ phase: "downloading", index: index + 1, total: listing.files.length, bytes: doneBytes, totalBytes });
    }
    // 最终位置已被占用（同名/换版本重装）：先挪开旧的，再原子换入。
    await rm(finalDir, { recursive: true, force: true });
    await rename(stagingDir, finalDir);
  } catch (error) {
    await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
    throw error;
```

</details>

**依据 2 · 源码核查**：[lib/skill-remove.js:99-124](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/lib/skill-remove.js#L99-L124)

realpath、链接及永久rm边界。

<details>
<summary>查看原文（26行）</summary>

```text
	// 父目录的 realpath 校验：防「根内路径 → 祖先符号链接实际指向根外」。根目录本身是
	// 符号链接（例如 ~/.agents → 别处）是允许的，所以比的是 realpath 后的根。
	const rootReal = await realpath(rootAbs);
	const parentReal = await realpath(dirname(target));
	if (!isInsideOrEqual(rootReal, parentReal)) {
		throw new Error("拒绝卸载：skill 路径经符号链接指向了 skills 根目录之外");
	}

	if (info.isSymbolicLink()) {
		// 只删链接本身。链接可能指向任意位置（例如 tabbit 这种外部安装的 skill），
		// rm/lstat 都不会跟随，但我们仍显式只用 unlink，语义一目了然。
		await unlink(target);
		return { path: target, kind: "symlink" };
	}
	if (!info.isDirectory()) throw new Error("拒绝卸载：该路径不是目录（也不是符号链接）");

	const targetReal = await realpath(target);
	if (!isInside(rootReal, targetReal)) {
		throw new Error("拒绝卸载：skill 目录经符号链接指向了 skills 根目录之外");
	}
	const manifest = await stat(join(target, "SKILL.md")).catch(() => null);
	if (!manifest || !manifest.isFile()) {
		throw new Error("拒绝卸载：目录里没有 SKILL.md，看起来不是 skill 目录");
	}
	await rm(target, { recursive: true, force: false });
	return { path: target, kind: "dir" };
```

</details>

**依据 3 · 源码核查**：[lib/tool-ledger.js:180-201](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/lib/tool-ledger.js#L180-L201)

字符粗估并非精确计费。

<details>
<summary>查看原文（22行）</summary>

```text

/**
 * 上下文 token 估算。Schema 以 ASCII 为主，4 字符 ≈ 1 token 是公开常用的粗估；
 * 只用于相对比较与量级感知，不承诺精确计费。
 * @param {string} text
 * @returns {number}
 */
function estimateTokens(text) {
	return Math.ceil(text.length / 4);
}

/**
 * 单个工具 Schema 投影成「要下发的那段 JSON」后的上下文税。
 *
 * 注册表侧与日志真实下发侧**必须共用这一个投影**：两处各写一遍 `{name, description,
 * parameters}` 时，任何一侧改了键集合或兜底写法，「注册表快照 vs 真实下发」的偏差里就会
 * 混进口径差而不是真差异，那个偏差卡就成了长期误报的假告警。
 * @param {{name: string, description?: string, parameters?: unknown}} tool
 * @returns {number} 估算 token 数。
 */
function schemaTokensOf(tool) {
	return estimateTokens(JSON.stringify({ name: tool.name, description: tool.description || "", parameters: tool.parameters ?? null }));
```

</details>

**依据 4 · 源码核查**：[lib/tool-ledger.js:48-71](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/lib/tool-ledger.js#L48-L71)

日志和映射有界会限制覆盖。

<details>
<summary>查看原文（24行）</summary>

```text
 * 单个日志的**落盘体积**上限（OPT-06）。完整链路是「整块读入 → 逐帧解压 → Buffer.concat
 * → toString(utf8) → split(换行)」，峰值内存约为压缩体积的 5~10 倍；没有上限意味着一个异常
 * 长的会话日志就能拖垮主进程。64 MB 相对当前最大单文件（4.4 MB）有十四倍冗余，正常使用碰不到。
 */
const MAX_LOG_BYTES = 64 * 1024 * 1024;
/** 解压文本缓存预算：按**字节**控制而非只按条数（见 textCache 注释）。 */
const TEXT_CACHE_MAX_BYTES = 128 * 1024 * 1024;
const TEXT_CACHE_MAX_ENTRIES = 32;

/**
 * 真实下发工具清单的**种类上限**（§6.1）。每种只在首次出现时算一次全量税，超出后不再新增、
 * 只把 `wireTaxTruncated` 置真并交给界面上屏。设这道闸是因为「每次请求清单都不一样」这种病态
 * 日志会让 wireTaxByKey 无界增长，而那恰恰是要靠趋势线暴露的场景——宁可少报几种并明确说「已
 * 截断」，也不能让只读账本把宿主主进程的内存吃掉。
 */
const WIRE_TAX_MAX_KEYS = 64;

/**
 * §6.4 `callId → 技能名` 的映射上限。它只在「等结果回来把错误算到技能头上」这一件事上用，
 * 而工具账本本来就为每个工具记着 `seenCallIds`，这里只是同一件事的技能版本。上限的作用与
 * WIRE_TAX_MAX_KEYS 同理：日志长度不可控时不能让它无界增长；超出后停止登记新映射，
 * 已登记的照常配对，未配对的错误数最多偏少（不会偏多）。
 */
const SKILL_CALL_MAP_MAX = 20_000;
```

</details>

#### 缺口

- 安装中断、跨进程更新与真实日志覆盖未复现
  **影响**：不能证明升级回滚和观测建议安全
  **进一步探讨**：临时目录注入rename失败并并发安装，检查旧文件；用有保留任务的零调用工具做禁用回归

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 管理便利把什么负担转移给用户？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要兼容DSH内部管理/RPC接口、Node以及本地配置与技能目录写权限。市场安装依赖上游目录和下载服务，MCP还可能需要第三方凭据、网络及OAuth维护；本项未完整审查OAuth实现，不能确认README列出的协议合规性。首次导入要核对来源/作用域/密钥，持续阶段要更新目录、检查工具税和技能原文，失败时要保存旧配置/目录并核对安装账本与宿主真实状态，不能盲重复安装。现金主要来自被管理的服务与模型调用，管理工具本身是否净节省人工和上下文费用未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:15-18](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/package.json#L15-L18)

Node版本声明。

```text
  "engines": {
    "node": ">=22.15"
  },
  "scripts": {
```

**依据 2 · 源码核查**：[package.json:54-67](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/package.json#L54-L67)

依赖宿主多项管理接口。

<details>
<summary>查看原文（14行）</summary>

```text
    "@deepseek-ai/dsh-atomic-write": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-mcp-client": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-scope": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-tools": ">=0.1.5-rc.1",
    "@deepseek-ai/dsh-typert-protocol": ">=0.1.5-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "~4.0.2",
    "@deepseek-ai/cordis-plugin-loader": "^1.0.3",
    "@deepseek-ai/dsh-agent": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-agent-loop": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-atomic-write": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-mcp-client": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-scope": "^0.2.0-rc.2",
```

</details>

**依据 3 · 作者声明**：[README.md:119-127](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/README.md#L119-L127)

作者说明重启、凭据、OAuth和永久卸载。

```text
  - **安装**：统一走宿主 `pluginManager.installBundle` 拉取落盘，**装完需重启 DSH 宿主才生效**；宿主无 `pluginManager` / 条目无 npm 包名 / 宿主组件三种情况各自给出明确文案，不静默失败
- **MCP OAuth 一键授权（2.0.0 新增）**：官方 `@deepseek-ai/dsh-mcp-client` 的 transport 只认 `requestInit.headers`、没有 authProvider，所以 OAuth 必须在**安装前**由本插件跑完，把 `authorization: Bearer <token>` 静态写进 patch 的 headers，此后由本模块负责刷新——
  - 按 **RFC 9728**（受保护资源元数据）→ **RFC 8414**（授权服务器元数据）→ **RFC 7591**（动态客户端注册）→ **RFC 7636 PKCE**（只发 S256）→ **RFC 8707**（`resource` 参数）逐条实现
  - 回调通道**三级降级**：本地 `127.0.0.1:<随机端口>/callback` 自动收 code（主流实现）→ DCR 只接受自定义 scheme 时提示「粘贴完整回调地址」→ 都不通则直接「粘贴访问令牌」
  - 服务器返回 401 时自动弹出「授权 {服务器}」对话框并打开浏览器，无需用户先去找入口
- **安装凭据引导（2.0.0 新增）**：安装前扫 `mcpServers` 里的 `${...}` 占位符，弹「填写 {连接器} 的凭据」逐槽填写后「带凭据安装」；留空表示稍后自行补全，装完提示「另有 N 个占位符未填写，配置里保留原样」；无占位符的连接器直接放行
- **安装状态账本（2.0.0 新增）**：`~/.dsh/armory/install-state.json`（`INSTALL_STATE_VERSION = 1`）记录每条连接器 / 技能 / 插件的 `source {marketplace, url, kind}`，市场页据此支持**跨页**筛出已安装项（技能侧仍只筛当前页，两处文案分别说明），并把「本插件装的」与「别处手动配的」分开；登记失败不影响安装，只补一句提示
- **技能看板分类（2.0.0 新增）**：技能按 **编程开发 / 设计与创作 / 文档办公 / 效率与自动化 / 开发运维 / 未分类** 六类归置，网格与列表双视图可切、可按分类过滤，常驻「显示 N / M 个 skill」；详情新增所属分类、来源目录、文件位置，可一键「复制 SKILL.md 路径」「复制 @会话引用」
- **技能卸载（2.2.0 新增）**：用户级 / 项目级目录里的 skill 可在详情里直接卸载（就地二次确认、**永久删除且不可撤销**）；随 DSH 分发、运行时注册与自定义目录的 skill 只读，并说明不在可卸载范围内。宿主本身只提供读取接口，卸载由本插件的 `removeSkill` 完成：来源白名单 → 根目录严格包含性 → 父目录 realpath → 符号链接只 unlink 不碰目标 → 目录必须含 `SKILL.md` 且在根内
```

**依据 4 · 源码核查**：[lib/wb-market.js:689-705](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/lib/wb-market.js#L689-L705)

失败恢复需要核对目录与最终状态。

<details>
<summary>查看原文（17行）</summary>

```text
    // 最终位置已被占用（同名/换版本重装）：先挪开旧的，再原子换入。
    await rm(finalDir, { recursive: true, force: true });
    await rename(stagingDir, finalDir);
  } catch (error) {
    await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
  // 落盘后逐文件复核：清单里的每个路径都必须真实存在才许报成功。缺 SKILL.md 的残包
  // 不会被注册表发现（「显示成功但看板里没有」的假安装），宁可清掉现场报失败，
  // 也不留一个挂着「已安装」却永远不生效的哑目录。
  for (const file of listing.files) {
    try {
      await stat(resolve(finalDir, file.path));
    } catch {
      await rm(finalDir, { recursive: true, force: true }).catch(() => {});
      throw new Error(`安装后校验失败：${file.path} 未落盘（${finalDir}），已清理现场，请重试`);
    }
```

</details>

#### 缺口

- 多市场完整安装/禁用/退出的真实宿主验收与净节时未知
  **影响**：无法确认一体化比原生/手工管理总成本更低
  **进一步探讨**：对固定管理清单记录安装成功、恢复、密钥维护和人工时间，保留原始配置对照

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些可复用安排值得保留，当前怎样试用？

**研究主题**：工程质量与复用、新假设与验证、采用判断

#### 完整回答

值得借鉴的是把来源账本与真实安装投影分开、对删除使用可信注册表来源和realpath、观测缺失不简单伪装零。但安装替换与身份投影仍需补强。未验证假设是将Skill更新改为旧目录备份、验证新目录、单次提交和可恢复状态账本，可能降低中断后丢失旧版本的风险。最小验证覆盖下载失败、空文件、rename失败、同名并发与进程重启，比较当前方案和候选事务的旧版保留率、误成功与恢复时间；若状态无法收敛或维护成本过高则否定。建议trial仅隔离profile、先备份配置/技能，再用非关键Skill验证安装、更新、卸载与重启；不因零调用或市场可见自动移除/信任内容。

#### 证据与依据

**依据 1 · 源码核查**：[lib/skill-remove.js:68-124](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/lib/skill-remove.js#L68-L124)

可信源与路径闸门。

<details>
<summary>查看原文（57行）</summary>

```text
export async function removeSkillFromDisk(skill, options = {}) {
	const source = typeof skill?.source === "string" ? skill.source : "";
	const root = skillRootFor(source, options);
	if (!root) {
		if (source === "project-agents" || source === "project-dsh") {
			throw new Error(`卸载项目级 skill 需要当前项目路径（来源：${describeSource(source)}）`);
		}
		throw new Error(`这个 skill 来自${describeSource(source)}，不在可卸载范围内（只支持用户级/项目级的 .dsh/skills 与 .agents/skills）`);
	}
	if (!isAbsolute(root)) throw new Error("拒绝卸载：无法确定 skills 根目录的绝对路径");
	const raw = typeof skill?.path === "string" ? skill.path.trim() : "";
	if (!raw) throw new Error("这个 skill 没有可卸载的磁盘路径（运行时注册的 skill 不落盘）");
	if (!isAbsolute(raw)) throw new Error("拒绝卸载：skill 路径不是绝对路径");

	const rawAbs = resolve(raw);
	// 注册表把 skill.path 指向清单文件（<skill>/SKILL.md），删除目标是它所在的目录。
	// 若直接拿清单路径去删，只会得到「该路径不是目录」——真实 GUI 首跑就撞上了。
	const target = basename(rawAbs).toLowerCase() === "skill.md" ? dirname(rawAbs) : rawAbs;
	const rootAbs = resolve(root);
	if (!isInside(rootAbs, target)) {
		throw new Error(`拒绝卸载：skill 路径不在预期的 skills 根目录内（${rootAbs}）`);
	}

	let info;
	try {
		info = await lstat(target);
	} catch (error) {
		if (error?.code === "ENOENT") throw new Error("这个 skill 已经不在磁盘上了（可能刚被移动或删除）");
		throw error;
	}

	// 父目录的 realpath 校验：防「根内路径 → 祖先符号链接实际指向根外」。根目录本身是
	// 符号链接（例如 ~/.agents → 别处）是允许的，所以比的是 realpath 后的根。
	const rootReal = await realpath(rootAbs);
	const parentReal = await realpath(dirname(target));
	if (!isInsideOrEqual(rootReal, parentReal)) {
		throw new Error("拒绝卸载：skill 路径经符号链接指向了 skills 根目录之外");
	}

	if (info.isSymbolicLink()) {
		// 只删链接本身。链接可能指向任意位置（例如 tabbit 这种外部安装的 skill），
		// rm/lstat 都不会跟随，但我们仍显式只用 unlink，语义一目了然。
		await unlink(target);
		return { path: target, kind: "symlink" };
	}
	if (!info.isDirectory()) throw new Error("拒绝卸载：该路径不是目录（也不是符号链接）");

	const targetReal = await realpath(target);
	if (!isInside(rootReal, targetReal)) {
		throw new Error("拒绝卸载：skill 目录经符号链接指向了 skills 根目录之外");
	}
	const manifest = await stat(join(target, "SKILL.md")).catch(() => null);
	if (!manifest || !manifest.isFile()) {
		throw new Error("拒绝卸载：目录里没有 SKILL.md，看起来不是 skill 目录");
	}
	await rm(target, { recursive: true, force: false });
	return { path: target, kind: "dir" };
```

</details>

**依据 2 · 源码核查**：[lib/skill-dir-times.js:94-107](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/lib/skill-dir-times.js#L94-L107)

投影与身份取舍。

<details>
<summary>查看原文（14行）</summary>

```text
      if (!name) name = entry;
      if (info[name]) continue; // 同名：首个根/首个目录优先
      const hit = byPath.get(normPath(dir));
      const bornAt = Math.round(Number(dirStat.birthtimeMs) || 0);
      const row = {
        installedAt: (hit?.installedAt || 0) || bornAt || Math.round(Number(dirStat.mtimeMs) || 0),
        dir,
      };
      if (hit?.name) {
        row.marketName = hit.name;
        row.marketplace = hit.source?.marketplace || "";
        row.marketVersion = hit.version || "";
      }
      info[name] = row;
```

</details>

**依据 3 · 源码核查**：[lib/wb-market.js:689-705](https://github.com/2026heshao/dsh-armory/blob/eb954d0f46f5eae50742dbacf071aec768512c8d/lib/wb-market.js#L689-L705)

事务更新假设来源。

<details>
<summary>查看原文（17行）</summary>

```text
    // 最终位置已被占用（同名/换版本重装）：先挪开旧的，再原子换入。
    await rm(finalDir, { recursive: true, force: true });
    await rename(stagingDir, finalDir);
  } catch (error) {
    await rm(stagingDir, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
  // 落盘后逐文件复核：清单里的每个路径都必须真实存在才许报成功。缺 SKILL.md 的残包
  // 不会被注册表发现（「显示成功但看板里没有」的假安装），宁可清掉现场报失败，
  // 也不留一个挂着「已安装」却永远不生效的哑目录。
  for (const file of listing.files) {
    try {
      await stat(resolve(finalDir, file.path));
    } catch {
      await rm(finalDir, { recursive: true, force: true }).catch(() => {});
      throw new Error(`安装后校验失败：${file.path} 未落盘（${finalDir}），已清理现场，请重试`);
    }
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
