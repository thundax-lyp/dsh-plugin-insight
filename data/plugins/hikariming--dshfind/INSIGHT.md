# dshfind

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[3ee8543](https://github.com/hikariming/dshfind/tree/3ee8543f3ec60792cae0523d4a149cba0d68770c)

<!-- BEGIN META -->
[![GitHub ★ 336](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=336&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hikariming/dshfind)
<!-- END META -->

> **功能**：聚合 DSH 生态条目、安装线索、代理评分和文档课程的发现网站，结合 GitHub 同步、数据库与页面快照。

> **亮点**：发现/学习入口、元数据安装分类与null处理、D1和快照复用，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：元数据可装/编辑verified非实装，代理分/手填或探测下载非生产效果，旧事实和前端迁移需标口径，见 [Q02](#research-q02)。

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
  - [Q01 · dshfind是插件还是发现/学习站，数据如何到页面？](#detail-section-11)
  - [Q02 · 安装、评分、下载信息分别能说明什么？](#detail-section-12)
  - [Q03 · 读者怎样使用，生产方向不是另做一个排行？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：查DSH候选插件或学习开发的读者，在目录筛选后回原来源核版本/分发/权限，见 [Q01](#research-q01)。

GitHub topic/npm/原README分散查找。目录集中入口和信息，仍需对候选独立Host验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 目录/学习 | 查候选和开发材料 | 非所有对象可装 |
| 安装线索 | 分类/编辑命令/复制 | 非Host功能验收 |
| 评分/下载 | 代理排序/手填出处或渠道指标 | 非质量/安全/活跃采用 |
| 数据管线 | 同步/快照/详情 | 自建与阅读成本分开 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 原仓库/npm/Release事实 | 发现必需 | 元数据/安装线索 | 旧事实或unknown待核 |
| 数据库/快照/编辑 | 站点必需 | 详情/列表/评分 | 时间/人工覆盖影响口径 |
| Astro/旧Next/Cloudflare | 自建必需 | 当前迁移部署 | 不把根脚本当全当前前端 |
| 独立Host/目标代码核查 | 采用候选必需 | 真可用与权限 | 网站不替安装验收 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 发现 | 用户按需求查候选 | 不按分/量替需求 |
| 核源 | 查原代码/分发/更新时间 | 分编辑/探测/运行 |
| 试用 | 独立Host固定目标 | 真实结果/权限/退出 |
| 纠错 | 反馈命令/类型/时间 | 对稳定来源修输入 |
| 自建 | 另算数据/部署维护 | 不混访问成本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 读站/目标试用资源未知 | 需求/出处/固定包核对 | 不需把本仓库装DSH |
| 持续使用 | 自建API/DB/边缘未知 | 同步/编辑/评分/版本维护 | 无用户净节时对照 |
| 失败恢复 | 重同步/部署资源未知 | 查旧事实/输入/命令 | 网站可达非插件成功 |
| 退出 | 自建DB快照留存未知 | 撤刷新/凭据/目标另卸 | 阅读与自建分开 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 发现 | topic/详情/学习集中 | 找到可用候选收益 |
| 安装线索 | 元数据分类/编辑优先 | 当前Host真实安装/功能 |
| 评分/下载 | 代理公式/手填出处与探测口径 | 安全/能力/活跃用户 |

> **思考**：元数据可装/编辑verified非实装，代理分/手填或探测下载非生产效果，旧事实和前端迁移需标口径，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：发现/学习入口、元数据安装分类与null处理、D1和快照复用，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

[Q02](#research-q02) 未探null、构建缺失分类和旧事实不刷时间可借鉴；编辑/自动/真实运行应分层呈现。

<a id="detail-section-5"></a>

### 1.4 主要限制

元数据可装/编辑verified非实装，代理分/手填或探测下载非生产效果，旧事实和前端迁移需标口径，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

作为发现入口，以少量真实任务候选回原来源核查并独立试用，不以rank/verified直接授权，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定目录/探测/量表与当前Astro消费链已核，建议作为发现/学习资源有限试用，不作目标插件审批保证。

- 已检查：作者 README、包清单、源码路径 .github/workflows/deploy-web.yml、README.zh-CN.md、apps/web/src/components/ScoreBadge.astro、apps/web/src/detail/data.ts、apps/web/src/pages/[locale]/plugins/[owner]/[repo].astro、package.json、pnpm-workspace.yaml、scripts/gen-plugins-real.mjs、scripts/lib/install.mjs、scripts/lib/scoring.mjs、scripts/probe-install.mjs、scripts/sync-plugins-db.mjs、src/lib/downloads.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：四材料身份/固定revision一致，catalog无旧研究；读工作区/部署、topic同步/D1快照、Astro detail真实读取/徽标/命令、安装推导与评分/下载口径（补核manual优先及当前Astro调用、ScoreBadge实际渲染）。Astro稀疏缺文件以git show固定读取，不读.env值；未全审社区/auth/全部边缘API/课程/所有条目，不执行同步/探测/部署。
- 下一步：无线上访问/数据库/候选安装实测；少量真实需求对照topic搜索测无效命令、可用率与纠正时间，自建另核部署/成本。

**分析版本**

- **仓库**：[hikariming/dshfind](https://github.com/hikariming/dshfind)
- **版本号**：0.1.0（[固定提交 3ee8543](https://github.com/hikariming/dshfind/tree/3ee8543f3ec60792cae0523d4a149cba0d68770c)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

需求到固定候选/权限/真实验收证据卡，测无效命令与试用完成率，未实现，见 [Q03](#research-q03)。

无线上访问/数据库/候选安装实测；少量真实需求对照topic搜索测无效命令、可用率与纠正时间，自建另核部署/成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 22 | 4388 | — | — | 51509 |
| .mjs | source | 73 | 15789 | 11980 | 2762 | — |
| .tsx | source | 157 | 12731 | 10956 | 1018 | — |
| .ts | source | 89 | 33852 | 32183 | 24345 | — |
| .mjs | test | 12 | 2178 | 1885 | 230 | — |

</details>

**活跃度**

[![Issue 未关闭 38](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=38&color=737b86&logo=github)](https://github.com/hikariming/dshfind/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=11&color=737b86&logo=github)](https://github.com/hikariming/dshfind/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/hikariming/dshfind/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：发现目录能否把真实需求带到可用候选，安装/评分/下载是否保留证据边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · dshfind是插件还是发现/学习站，数据如何到页面？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、依赖、兼容与流程

#### 完整回答

固定dshfind根包private0.1.0是插件目录、文档课程与社区网站资源，不是可装DSH Host插件。根Next老站与apps/web Astro重写并存，deploy-web明确部署Astro且复用root src快照/课程/文案，不把根package的Next命令当唯一当前前端。0.1.0是根包版本，非线上站点发布编号。

GitHub topic发现/同步写DB，摘topic软标is_present=0、运营is_offtopic过滤；gen-plugins从D1事实生成列表快照，当前Astro详情getPluginDetail绑定SQL读D1和i18n/增长，页面按需取detail与sidecar、展示评分/下载/安装信息。贡献是把分散发现、学习材料和条目信息放同入口，读者能找到候选；目录/排行榜本身不实现插件功能，也不证明全部收录项相关、可信或可安装。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-4](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/package.json#L2-L4)

根包private版本。

```text
  "name": "dshfind",
  "version": "0.1.0",
  "private": true,
```

**依据 2 · 源码核查**：[pnpm-workspace.yaml:1-6](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/pnpm-workspace.yaml#L1-L6)

旧Next/新Astro明确分工。

```text
# 根目录是老 Next 站；apps/web 是重写中的 Astro 站（docs/frontend-rewrite-plan.md）
packages:
  - apps/*
  # api-edge 的 cf 项目清单（cf 要求 wrangler 装在 Worker 自己的 node_modules）
  - workers/api-edge

```

**依据 3 · 源码核查**：[.github/workflows/deploy-web.yml:1-15](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/.github/workflows/deploy-web.yml#L1-L15)

实际Astro发布/共用输入。

<details>
<summary>查看原文（15行）</summary>

```text
# Astro 新站（apps/web → Worker dshfind-web）的发布。
#
# 老站由 Cloudflare Workers Builds 监听仓库自动构建；新站走这里：人推到 main 且改到了
# 新站构建会读取的文件时触发。每日数据同步由 sync-plugins.yml 在同一个 job 里直接发布
# （GITHUB_TOKEN 推的提交不会触发本 workflow）。手动：gh workflow run deploy-web.yml
name: Deploy web (Astro)

on:
  push:
    branches: [main]
    paths:
      - apps/web/**
      # 迁移期新站直接读老站 src/ 下的数据快照、课程 MDX、图示、样式与文案
      - src/lib/**
      - src/content/**
```

</details>

**依据 4 · 源码核查**：[scripts/sync-plugins-db.mjs:453-461](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/scripts/sync-plugins-db.mjs#L453-L461)

同步upsert与当前态。

```text
             contributors, pushed_at, archived, first_seen_at, last_synced_at, is_present, category, is_insider)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
          ON CONFLICT(full_name) DO UPDATE SET
            name = excluded.name, owner = excluded.owner, url = excluded.url,
            description = excluded.description, tags = excluded.tags,
            language = excluded.language, stars = excluded.stars,
            contributors = COALESCE(excluded.contributors, plugins.contributors),
            pushed_at = excluded.pushed_at, archived = excluded.archived,
            last_synced_at = excluded.last_synced_at, is_present = 1,
```

**依据 5 · 源码核查**：[scripts/gen-plugins-real.mjs:29-46](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/scripts/gen-plugins-real.mjs#L29-L46)

D1选取事实及存在/偏题过滤。

<details>
<summary>查看原文（18行）</summary>

```text

const rs = await client.execute(
  `SELECT p.full_name, p.name, p.owner, p.url, p.description, p.tags, p.language,
          p.stars, p.contributors, p.pushed_at, p.archived, p.category, p.score,
          p.is_featured, p.featured_boost, p.is_insider, p.is_official, p.is_risky, p.risk_note,
          p.first_seen_at, p.is_plugin,
          p.dl_pkg, p.dl_npm_total, p.dl_mirror_total, p.dl_release_total,
          p.dl_manual_total, p.dl_manual_note,
          p.install_kind, p.install_cmd, p.install_cmd_auto, p.pkg_name, p.pkg_version,
          p.npm_latest_version,
          COALESCE(p.stars - bs.stars, 0) AS star_growth,
          CASE WHEN p.contributors IS NOT NULL AND bs.contributors IS NOT NULL
               THEN p.contributors - bs.contributors END AS contributor_growth
   FROM plugins p
   ${PLUGIN_GROWTH_JOIN_SQL}
   WHERE p.is_present = 1 AND p.is_offtopic = 0
   ORDER BY p.is_risky ASC, p.is_featured * p.featured_boost DESC, p.stars DESC, p.full_name`,
);
```

</details>

**依据 6 · 源码核查**：[apps/web/src/detail/data.ts:29-44](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/apps/web/src/detail/data.ts#L29-L44)

真实绑定SQL读D1详情/i18n。

<details>
<summary>查看原文（16行）</summary>

```text
export async function query(sql: string, ...args: unknown[]): Promise<Row[]> {
  const { results } = await cf.DB.prepare(sql)
    .bind(...args.map((a) => (typeof a === "boolean" ? (a ? 1 : 0) : a)))
    .all();
  return results;
}

/** 单插件详情；未收录 / 已隐藏返回 null。读库失败直接抛（交给路由器回落）。 */
export async function getPluginDetail(fullName: string): Promise<PluginDetail | null> {
  const r = (await query(PLUGIN_DETAIL_SQL, fullName))[0];
  if (!r) return null;
  const name = String(r.full_name);

  const [i18nRows, snaps] = await Promise.all([
    query(`SELECT locale, description, intro, highlights FROM plugin_i18n WHERE full_name = ?`, name),
    query(GROWTH_SNAPSHOTS_SQL, name),
```

</details>

**依据 7 · 源码核查**：[apps/web/src/pages/[locale]/plugins/[owner]/[repo].astro:18-31](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/apps/web/src/pages/%5Blocale%5D/plugins/%5Bowner%5D/%5Brepo%5D.astro#L18-L31)

页面实际消费detail/sidecar/score组件。

<details>
<summary>查看原文（14行）</summary>

```text
import Breadcrumb from "~/components/Breadcrumb.astro";
import PluginCardList from "~/components/PluginCardList.astro";
import PluginDiscussion, { type DiscussionLabels } from "~/components/PluginDiscussion";
import ScoreBadge from "~/components/ScoreBadge.astro";
import { getPluginDetail, getPluginReadme, getRelatedCards, getSidecar, notFoundResponse } from "~/detail/data";
import Base from "~/layouts/Base.astro";
import { translator } from "~/i18n";

export const prerender = false;

const { owner = "", repo = "" } = Astro.params;
if (!isLocale(Astro.params.locale ?? "")) return notFoundResponse(Astro.url);
const locale = Astro.params.locale as Locale;
const t = translator(locale);
```

</details>

#### 缺口

- 未独立访问线上/跑完整同步，收录覆盖、实时状态与学习效果未知。
  **影响**：只能确认固定站点代码/数据消费链，不能承诺线上可用、目录完整或每个收录对象可安装。
  **进一步探讨**：只读少量新条目核来源/更新时间/类型和具体需求，再在独立宿主验候选；站点部署另验当前路由。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装、评分、下载信息分别能说明什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

安装推导确实有边界：deriveInstall需pkgName和hasBundle，否则not-installable；README提示必须包名匹配才参考profile/版本，命令自行组装；npm已发布优先，Release另验包版本/资产，源码缺build可单列。probe还按workspace下探子包，拉取失败unknown不确认没有；未问全沿旧事实且不刷新probe时间。它是元数据/产物线索推导，没在这些路径跑目标安装/业务验收，不能把kind/npm或“可安装”当当前Host已通过。

当前详情优先编辑installCmd/sidecar再auto，curated标为verified并给copy按钮；这证明编辑值优先，不独立证明编辑命令实装。评分由活跃度、stars、AI工程规范和维护者公式合成，权重随生态年龄变化且有算法版本；ScoreBadge为null不渲染，有数值才映等级。它是特定代理量表，不是能力、代码安全或生产效果测量。下载先用运营手填的manual>0全渠道数并携manualNote出处，压过所有探测值；源码明确这类数不是本站独立测量，出处可为null，不能把“运营核实”当本轮独立计量。没有有效manual才选已匹配npm+mirror，否则Release>0，均无则null；当前Astro详情真实把DB手填值/出处及探测值传primaryDownloads，生成快照也保持这个优先级，不宜统称安装/活跃用户数；多语言编辑介绍也不等逐行源码证据。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/lib/install.mjs:743-783](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/scripts/lib/install.mjs#L743-L783)

包/README匹配与install kind推导。

<details>
<summary>查看原文（41行）</summary>

```text
export function deriveInstall({ fullName, npmPublished, readmeCmd, ...facts }) {
  const {
    pkgName,
    pkgVersion,
    pkgPrivate,
    hasBundle,
    hasPrepare,
    entryNeedsBuild,
    entryCommitted,
    releaseTgzUrl,
    releaseTag,
    releasePrerelease,
    releaseAssetName,
    releaseAssetSize,
    releaseAssetDigest,
  } = facts;
  const hint = readmeCmd ? readmeInstallHint(readmeCmd) : null;
  // README 说的包和 package.json 对得上，才认它——对不上说明 README 过期了
  const hintTrusted = Boolean(hint && pkgName && bareName(hint.target) === pkgName);
  const profile =
    (hintTrusted && usableProfile(hint.profile)) || profileFor({ fullName, pkgName });
  // 命令始终由我们组装，不照抄 README 原句：占位符 profile、npx 前缀这些噪声不上站。
  // README 唯一带来的增量是「装哪个 profile」和「有没有钉版本」。
  const target = hintTrusted ? hint.target : pkgName;

  // 不是组合包就没有安装这回事：索引仓库、文档站、独立 App、宿主本体都落这里
  const none = (reason) => ({ kind: "not-installable", reason, cmd: null, profile, source: null });
  if (!pkgName) return none("no-manifest");
  if (!hasBundle) return none("no-bundle");

  // 发布过就用包名——避开 git 装源码那一整套坑。
  // npm 排在 release 之前：两者都是无法与源码对账的预构建产物，但 npm 那条链路有
  // provenance/attestation、恶意包扫描与 unpublish 机制，GitHub Release 资产一样都没有。
  if (npmPublished && !pkgPrivate) {
    return {
      kind: "npm",
      reason: null,
      cmd: `dsh plugin --profile ${profile} add ${target}`,
      profile,
      source: hintTrusted ? "readme" : "manifest",
    };
```

</details>

**依据 2 · 源码核查**：[scripts/probe-install.mjs:170-189](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/scripts/probe-install.mjs#L170-L189)

workspace/unknown与HEAD来源。

<details>
<summary>查看原文（20行）</summary>

```text
 *
 * 根清单没有 dsh.bundle 时按 workspace 声明（package.json workspaces /
 * pnpm-workspace.yaml）下探 monorepo 子包，找到带 dsh.bundle 的子包就用它，
 * subdir 记录子目录供 README / 构建产物探测拼路径。发现过程问不出结果
 * （目录列表或子清单抓取失败）时整体按 unknown 处理——宁可下轮重探，
 * 也不把「没翻到」写成「确认没有」。
 */
async function fetchManifest(fullName) {
  const res = await tryFetch(
    `https://raw.githubusercontent.com/${fullName}/HEAD/package.json`,
  );
  const outcome = fetchOutcome(res);
  if (outcome !== "ok") return { outcome, pkg: null, subdir: null };
  let root;
  try {
    root = JSON.parse(await res.text());
  } catch {
    return { outcome: "absent", pkg: null, subdir: null };
  }
  if (root?.dsh?.bundle) return { outcome: "ok", pkg: root, subdir: null };
```

</details>

**依据 3 · 源码核查**：[scripts/probe-install.mjs:80-94](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/scripts/probe-install.mjs#L80-L94)

未完成保留旧事实/时间预算策略。

<details>
<summary>查看原文（15行）</summary>

```text
 * 预算永远走不完，后面的产物生成、边缘部署、提交推送一步都跑不到
 * （2026-08-27 实测，整轮同步就断在这里）。
 *
 * 脚本本身早就容忍「这轮没问全」：事实沿用上一轮、**不刷新** install_probed_at、
 * 下一轮自然重探。加这个上限只是让它走得到那个收尾，而不是耗死在退避里。
 */
const deadlineMinutes = Number(opt("--deadline", 0));
const deadlineAt = Number.isFinite(deadlineMinutes) && deadlineMinutes > 0
  ? Date.now() + deadlineMinutes * 60_000
  : null;
const pastDeadline = () => deadlineAt !== null && Date.now() >= deadlineAt;
/**
 * 退避不许睡过上限：睡到点就当这次重试用完，让 fetchRelease 尽快判成 incomplete，
 * 而不是抱着一个 120s 的 setTimeout 把并发槽占到 job 超时。
 */
```

</details>

**依据 4 · 源码核查**：[scripts/gen-plugins-real.mjs:104-122](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/scripts/gen-plugins-real.mjs#L104-L122)

编辑命令优先/未探null/实际npm版本区别。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * 与详情页读库口径一致的构建期版本：运营手工核对的 install_cmd 压过推导的
 * install_cmd_auto，没探测过（install_kind 为空）返回 null，页面据此说「见 README」，
 * 而不是编一条命令出来。
 *
 * 手工命令与 plugin-i18n.ts 的 editorial.installCmd 是同一列，这里是刻意的重复：
 * 详情页取 curated 时走 editorial，取不到时才落到这里，两条路给出同一个答案。
 * 五条 not-installable 仓库带着手工命令（官方仓库那类），走的正是 editorial 那条。
 */
function installOf(r) {
  if (r.install_kind == null) return null;
  const cmd = r.install_cmd ?? r.install_cmd_auto;
  return {
    kind: String(r.install_kind),
    cmd: cmd == null ? null : String(cmd),
    pkgName: r.pkg_name == null ? null : String(r.pkg_name),
    pkgVersion: r.pkg_version == null ? null : String(r.pkg_version),
    // npm 装法下这才是命令实际会装到的版本，见 src/lib/install.ts installVersionOf
    npmVersion: r.npm_latest_version == null ? null : String(r.npm_latest_version),
```

</details>

**依据 5 · 源码核查**：[apps/web/src/pages/[locale]/plugins/[owner]/[repo].astro:53-58](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/apps/web/src/pages/%5Blocale%5D/plugins/%5Bowner%5D/%5Brepo%5D.astro#L53-L58)

页面编辑/sidecar优先auto。

```text
const curatedCmd = plugin.installCmd ?? sidecar.c ?? null;
const installCmd = curatedCmd ?? plugin.installCmdAuto;
const installKind = curatedCmd ? "curated" : plugin.installKind;
const description = live?.description ?? plugin.description;
const downloads = plugin.downloadSummary;
const downloadsBadge = downloads != null && downloadTier(downloads.total) != null;
```

**依据 6 · 源码核查**：[apps/web/src/pages/[locale]/plugins/[owner]/[repo].astro:280-309](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/apps/web/src/pages/%5Blocale%5D/plugins/%5Bowner%5D/%5Brepo%5D.astro#L280-L309)

curated verified标签与复制命令。

<details>
<summary>查看原文（30行）</summary>

```text
    <!-- 安装：命令来源与可装性都据实标注，装不了的仓库不给命令 -->
    <div class:list={[CARD, "mt-6"]}>
      <div class="px-4 pb-2">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class={CARD_TITLE}>
            {installKind === "not-installable" ? t("Plugins.installNoneTitle") : installKind === "build-required" ? t("Plugins.installBuildTitle") : t("Plugins.detailInstall")}
          </div>
          {
            (installKind === "curated" || installKind === "release" || installKind === "npm" || installKind === "git") && (
              <span class:list={[BADGE, "border-border text-[11px] font-normal text-muted-foreground"]}>
                {installKind === "curated" ? t("Plugins.installVerified") : t("Plugins.installDerived")}
              </span>
            )
          }
        </div>
      </div>
      <div class="space-y-3 px-4">
        {installKind === "not-installable" && <p class="text-sm leading-relaxed text-muted-foreground">{plugin.pkgName ? t("Plugins.installNoneBundle") : t("Plugins.installNoneManifest")} {t("Plugins.installNoneHint")}</p>}
        {installKind === "build-required" && <p class="text-sm leading-relaxed text-muted-foreground">{t("Plugins.installBuildNote")}</p>}
        {installKind == null && <p class="text-sm leading-relaxed text-muted-foreground">{t("Plugins.installUnknown")}</p>}
        {
          installCmd && (
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-3">
                {plugin.installVersion ? <span class="text-xs text-muted-foreground tabular-nums">{t("Plugins.installVersion", { version: plugin.installVersion })}</span> : <span />}
                <button type="button" class={COPY_BTN} data-copy={installCmd} data-copied-label={t("Plugins.installCopied")} aria-label={t("Plugins.installCopy")}>
                  <svg class="size-3.5 group-data-copied:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg><svg class="hidden size-3.5 text-emerald-500 group-data-copied:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg><span data-copy-label>{t("Plugins.installCopy")}</span>
                </button>
              </div>
              <pre class="overflow-x-auto rounded-lg bg-muted/60 px-4 py-3 font-mono text-sm">{installCmd}</pre>
```

</details>

**依据 7 · 源码核查**：[scripts/lib/scoring.mjs:1-24](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/scripts/lib/scoring.mjs#L1-L24)

代理评分、算法版本、等级。

<details>
<summary>查看原文（24行）</summary>

```text
/**
 * 插件综合评分：0-100 = 活跃度 + Star 热度 + 工程规范(AI) + 维护者靠谱度。
 *
 * 核心设计：DSH 生态刚开源几天，时间类信号（更新衰减/周覆盖率/长期增长）
 * 尚无区分度，所以权重与时间窗都是「生态年龄」的函数——
 * 今天自动是早期形态（工程规范与维护者历史吃重、star 看速度），
 * ~90 天后自动长成成熟形态（活跃度吃重、star 看存量与持续性），无需换算法。
 *
 * 工程规范 25 分制的四个子分由 AI 评审给出（manifest/发布/文档/DSH 真实集成度），
 * 其余全部为确定性公式，保证分数可复现、可审计。
 */

// 写入每条评分记录；算法、权重或输入口径变化时必须递增，供 API 消费者判读可比性。
export const SCORING_VERSION = "2026-08-17.1";

export const GRADE_BANDS = [
  ["S", 85],
  ["A", 70],
  ["B", 55],
  ["C", 0],
];

export function gradeOf(score) {
  return GRADE_BANDS.find(([, min]) => score >= min)[0];
```

</details>

**依据 8 · 源码核查**：[scripts/lib/scoring.mjs:35-43](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/scripts/lib/scoring.mjs#L35-L43)

权重随生态时间。

```text
/** 四维权重（和恒为 100）。 */
export function weights(ecoAgeDays) {
  const t = transition(ecoAgeDays);
  return {
    activity: 25 + 20 * t,
    star: 30,
    engineering: 25 - 10 * t,
    maintainer: 20 - 10 * t,
  };
```

**依据 9 · 源码核查**：[apps/web/src/components/ScoreBadge.astro:18-32](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/apps/web/src/components/ScoreBadge.astro#L18-L32)

null不出徽标，数值映等级。

<details>
<summary>查看原文（15行）</summary>

```text
const { score, locale } = Astro.props;
const grade = score == null ? null : gradeOf(score);
---

{
  grade && (
    <span
      title={translator(locale)("Plugins.score")}
      class:list={[
        "inline-flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
        GRADE_STYLES[grade],
      ]}
    >
      {grade}
      <span class="opacity-80">{score}</span>
```

</details>

**依据 10 · 源码核查**：[src/lib/downloads.ts:14-25](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/src/lib/downloads.ts#L14-L25)

运营手填与manualNote出处，非本站测量的契约说明。

<details>
<summary>查看原文（12行）</summary>

```text
/** plugins 表 dl_* 各列的对外形态。全 null = 没探过或三个渠道都没有。 */
export interface DownloadStats {
  /**
   * 运营手工填的全渠道总数，优先级高于下面三个探测值。
   *
   * 有的项目主要靠自己的官网分发，那部分我们**根本测不到**——
   * deepseek-harness-desktop 官网 20 万，GitHub Release 只有 4 万，
   * 只报 4 万等于把人家的量说少了五分之四。
   */
  manual?: number | null;
  /** 手工数的出处（如「官网统计」），展示时必须一并露出：我们没量过这个数。 */
  manualNote?: string | null;
```

</details>

**依据 11 · 源码核查**：[src/lib/downloads.ts:88-108](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/src/lib/downloads.ts#L88-L108)

真实manual>0优先，之后npm+mirror/Release/null。

<details>
<summary>查看原文（21行）</summary>

```text
export function primaryDownloads(stats: DownloadStats | null | undefined): DownloadSummary | null {
  if (!stats) return null;
  // 运营核实过的全渠道数压过一切探测值——探测只能看到 npm 与 GitHub，
  // 官网自建分发那部分永远量不到，硬按探测值报会把项目说小
  if (stats.manual != null && stats.manual > 0) {
    return {
      channel: "manual",
      total: stats.manual,
      breakdown: null,
      note: stats.manualNote ?? null,
    };
  }
  const npm = stats.pkg && stats.npm != null ? stats.npm : null;
  if (npm != null) {
    const mirror = stats.mirror ?? 0;
    return { channel: "npm", total: npm + mirror, breakdown: { npm, mirror } };
  }
  if (stats.release != null && stats.release > 0) {
    return { channel: "release", total: stats.release, breakdown: null };
  }
  return null;
```

</details>

**依据 12 · 源码核查**：[apps/web/src/detail/data.ts:106-114](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/apps/web/src/detail/data.ts#L106-L114)

当前Astro详情真实调用primaryDownloads并传manual/出处。

```text
    downloadSummary: primaryDownloads({
      manual: r.dl_manual_total == null ? null : Number(r.dl_manual_total),
      manualNote: str(r.dl_manual_note),
      pkg: str(r.dl_pkg),
      npm: r.dl_npm_total == null ? null : Number(r.dl_npm_total),
      mirror: r.dl_mirror_total == null ? null : Number(r.dl_mirror_total),
      release: r.dl_release_total == null ? null : Number(r.dl_release_total),
      status: str(r.dl_status),
    }),
```

**依据 13 · 源码核查**：[scripts/gen-plugins-real.mjs:86-101](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/scripts/gen-plugins-real.mjs#L86-L101)

快照真实manual优先且携出处，后续自动渠道。

<details>
<summary>查看原文（16行）</summary>

```text
/** 与 primaryDownloads 同口径的构建期版本；没数可报返回 null（不写进快照）。 */
function downloadsOf(r) {
  // 运营手工填的全渠道数优先（官网自建分发那部分探测不到），并带上出处
  if (r.dl_manual_total != null && Number(r.dl_manual_total) > 0) {
    return {
      channel: "manual",
      total: Number(r.dl_manual_total),
      note: r.dl_manual_note == null ? null : String(r.dl_manual_note),
    };
  }
  const npm = r.dl_pkg != null && r.dl_npm_total != null ? Number(r.dl_npm_total) : null;
  if (npm != null) {
    return { channel: "npm", total: npm + Number(r.dl_mirror_total ?? 0) };
  }
  const release = r.dl_release_total == null ? 0 : Number(r.dl_release_total);
  return release > 0 ? { channel: "release", total: release } : null;
```

</details>

**依据 14 · 源码核查**：[apps/web/src/pages/[locale]/plugins/[owner]/[repo].astro:160-164](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/apps/web/src/pages/%5Blocale%5D/plugins/%5Bowner%5D/%5Brepo%5D.astro#L160-L164)

当前详情真正渲染ScoreBadge，不止import。

```text
    <div class="mt-4 flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        <h1 class="flex flex-wrap items-center gap-2.5 font-mono text-2xl font-bold break-all sm:text-3xl">
          {plugin.name}
          <ScoreBadge score={plugin.score} locale={locale} />
```

#### 缺口

- 个别命令/评分输入的来源新鲜度与实际Host运行未核，数字与真实采用对应未验证。
  **影响**：不能把编辑verified/代理评分/下载徽标当已运行、安全或用户采用证明，选择候选仍需逐项核版本与权限。
  **进一步探讨**：抽样重算安装推导与量表输入，核probe/score版本时间、包归属和编辑证据，再独立固定目标实装；下载只按渠道解释。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 读者怎样使用，生产方向不是另做一个排行？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议作为发现/学习资源有限使用，先明确自己的任务，再查少量候选的原README/固定代码/实际分发，不按高分/下载决定给工具权限。读站不要求在自己DSH安装此仓库；自托管是另一项工作，需要GitHub API/数据库/Cloudflare、构建、编辑与每日同步运维，不应把访问网页与搭站成本混为一谈。

首次读者付出查出处/版本和试用候选时间，自建者配置数据/部署；持续有GitHub/npm请求、DB/边缘预算、构建和内容校核，金额与耗时未知。同步失败/旧快照/编辑覆盖需查事实时间和输入，网站HTTP200不等某插件可用；退出书签浏览很低成本，自建需停刷新/撤凭据/保DB及快照，目标插件卸载另管。根目录.env等部署值本轮不读。

可证伪方向是需求→候选→固定分发/权限→宿主验收的证据卡，明确编辑判断/自动探测/真实运行不同层；反馈错误命令/漏条目能回到稳定身份和时间，不是继续用排名代理需求。比较现站/普通topic搜索/证据卡版的错误类型、无效命令、找到可用候选时间和试用完成率，无收益或维护过重则停止，未实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:53-69](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/README.zh-CN.md#L53-L69)

作者数据生成/收录路径与自建前提。

<details>
<summary>查看原文（17行）</summary>

````text
### 重新生成插件与排行数据

带 GitHub topic `dsh-plugin` 的仓库每天同步进项目数据库,插件库、首页推荐栏与排行榜的静态快照由它生成。只重新生成快照(需要 `.env.local` 里的数据库凭据;排行榜另需 [GitHub CLI](https://cli.github.com)):

```bash
pnpm gen:data
```

一条命令跑完整刷新——GitHub 同步、下载量、安装方式、静态快照、构建验证——并只提交生成物:

```bash
pnpm refresh
```

## 提交你的插件

给你的**公开** GitHub 仓库加上 `dsh-plugin` topic,下次数据刷新时就会出现在插件市场中。
````

</details>

**依据 2 · 源码核查**：[scripts/gen-plugins-real.mjs:104-122](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/scripts/gen-plugins-real.mjs#L104-L122)

多来源安装事实基础。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * 与详情页读库口径一致的构建期版本：运营手工核对的 install_cmd 压过推导的
 * install_cmd_auto，没探测过（install_kind 为空）返回 null，页面据此说「见 README」，
 * 而不是编一条命令出来。
 *
 * 手工命令与 plugin-i18n.ts 的 editorial.installCmd 是同一列，这里是刻意的重复：
 * 详情页取 curated 时走 editorial，取不到时才落到这里，两条路给出同一个答案。
 * 五条 not-installable 仓库带着手工命令（官方仓库那类），走的正是 editorial 那条。
 */
function installOf(r) {
  if (r.install_kind == null) return null;
  const cmd = r.install_cmd ?? r.install_cmd_auto;
  return {
    kind: String(r.install_kind),
    cmd: cmd == null ? null : String(cmd),
    pkgName: r.pkg_name == null ? null : String(r.pkg_name),
    pkgVersion: r.pkg_version == null ? null : String(r.pkg_version),
    // npm 装法下这才是命令实际会装到的版本，见 src/lib/install.ts installVersionOf
    npmVersion: r.npm_latest_version == null ? null : String(r.npm_latest_version),
```

</details>

**依据 3 · 源码核查**：[.github/workflows/deploy-web.yml:56-65](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/.github/workflows/deploy-web.yml#L56-L65)

网站路由HTTP/论坛验收不等目标功能。

<details>
<summary>查看原文（10行）</summary>

```text
          for p in /zh/learn/cordis /en/plugins/c/tools /zh/plugins/all/1 /zh/plugins/fuzz1og/dsh-ocgo-quota /sitemap.xml; do
            code=$(curl -s -o /dev/null -w '%{http_code}' --retry 5 --retry-all-errors --retry-delay 3 "$base$p")
            echo "$p -> $code"
            [ "$code" = 200 ] || exit 1
          done
          # 需要服务端取数的页面：Worker 在 zone 上下文里 fetch 同 zone 的 api.dshfind.com 会绕过 api-edge
          # （缺 global_fetch_strictly_public 时论坛帖子曾全站 404），这里确认论坛列表真的取到了帖子
          body=$(curl -s --retry 5 --retry-all-errors --retry-delay 3 -H 'Sec-Fetch-Mode: navigate' "$base/zh/bbs")
          echo "$body" | grep -q '/bbs/t/' || { echo "/zh/bbs 没有帖子链接（服务端取论坛 API 失败）"; exit 1; }
          echo "/zh/bbs -> 有帖子链接"
```

</details>

**依据 4 · 源码核查**：[scripts/probe-install.mjs:83-94](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/scripts/probe-install.mjs#L83-L94)

旧事实与请求预算成本。

<details>
<summary>查看原文（12行）</summary>

```text
 * 脚本本身早就容忍「这轮没问全」：事实沿用上一轮、**不刷新** install_probed_at、
 * 下一轮自然重探。加这个上限只是让它走得到那个收尾，而不是耗死在退避里。
 */
const deadlineMinutes = Number(opt("--deadline", 0));
const deadlineAt = Number.isFinite(deadlineMinutes) && deadlineMinutes > 0
  ? Date.now() + deadlineMinutes * 60_000
  : null;
const pastDeadline = () => deadlineAt !== null && Date.now() >= deadlineAt;
/**
 * 退避不许睡过上限：睡到点就当这次重试用完，让 fetchRelease 尽快判成 incomplete，
 * 而不是抱着一个 120s 的 setTimeout 把并发槽占到 job 超时。
 */
```

</details>

**依据 5 · 源码核查**：[scripts/lib/scoring.mjs:1-14](https://github.com/hikariming/dshfind/blob/3ee8543f3ec60792cae0523d4a149cba0d68770c/scripts/lib/scoring.mjs#L1-L14)

量表与算法版本仍非需求指标。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * 插件综合评分：0-100 = 活跃度 + Star 热度 + 工程规范(AI) + 维护者靠谱度。
 *
 * 核心设计：DSH 生态刚开源几天，时间类信号（更新衰减/周覆盖率/长期增长）
 * 尚无区分度，所以权重与时间窗都是「生态年龄」的函数——
 * 今天自动是早期形态（工程规范与维护者历史吃重、star 看速度），
 * ~90 天后自动长成成熟形态（活跃度吃重、star 看存量与持续性），无需换算法。
 *
 * 工程规范 25 分制的四个子分由 AI 评审给出（manifest/发布/文档/DSH 真实集成度），
 * 其余全部为确定性公式，保证分数可复现、可审计。
 */

// 写入每条评分记录；算法、权重或输入口径变化时必须递增，供 API 消费者判读可比性。
export const SCORING_VERSION = "2026-08-17.1";
```

</details>

#### 缺口

- 未做真实用户候选选择/可用插件验收率与自建费用对照。
  **影响**：无法确认目录发现节省多少试错或自托管运维是否划算，不能用排行/条目数量替真实需求验收。
  **进一步探讨**：用真实需求抽少量候选，记录出处/固定包/权限/Host成功与纠错时间，对比topic搜索；自建成本独立算。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
