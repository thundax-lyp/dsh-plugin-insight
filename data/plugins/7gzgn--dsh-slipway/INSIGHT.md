# dsh-slipway

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c7604b8](https://github.com/7gzgn/dsh-slipway/tree/c7604b81e034b5e81a3d345217f6c5239dda0da0)

<!-- BEGIN META -->
[![npm 30d 661](https://img.shields.io/static/v1?label=npm+30d&message=661&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-slipway) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-slipway)
<!-- END META -->

> **功能**：预检本地 DSH 插件，上传到 GitHub、创建市场登记 PR，并回拉核对选中文件。

> **亮点**：它把本地文件选择、预检、GitHub 上传、市场 PR 与哈希回验组织为可重复调用的阶段流程，相对零散 API 脚本提供统一交接记录；平台与哈希能力来自既有机制。该贡献限定编排便利，不能解释为原子发布或已证实节时，见 [Q01](#research-q01)。

> **主要限制**：所选文件的哈希相等不等于完整发布。dist 被无条件排除、常见 ./ exports 未核查、远端旧文件与同一提交未受回验约束；非预演报告还会在跳过回验或失败时追加回验完成尾句，必须读取真实阶段，见 [Q03](#research-q03)。

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
  - [Q01 · 谁需要这条发布链，它与手写 GitHub 脚本和普通 Git 推送的交付差异是什么？](#detail-section-11)
  - [Q02 · 从 DSH 工具或 CLI 到远端写入及回验，实际怎样接线？](#detail-section-12)
  - [Q03 · 预演、清单与回验能否保证完整且安全的发布？](#detail-section-13)
  - [Q04 · 重复执行和半途失败由谁恢复，全周期代价是否与价值相称？](#detail-section-14)
  - [Q05 · 哪个设计可复用，怎样用反例检验更强的发布证书假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向反复发布 DSH 插件的个人维护者，串联本地预检、GitHub 上传、市场登记及选中文件回验。

参照是维护者逐条调用 GitHub API 的脚本及已有 Git/CI 发布流程；前者需自行串联市场登记，后者可能已有完整提交交付和自动校验。没有运行对照，不能据入口减少推断总工时下降，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| slipway_publish | 预检并编排GitHub上传、topics和市场PR | 默认只查询；真发布逐文件写入，不原子，需个人owner与PAT |
| slipway_verify | 回拉选中文件比较SHA-256和长度 | 只覆盖本地清单，不验证远端全集或固定单一提交 |
| CLI plan、publish、verify | 在宿主外复用同一计划与编排 | plan仅本地，publish预演仍有联网查询 |
| 可选Agent提示段 | 说明参数、预演和活代码树纪律 | announceToAgent为true且systemPrompt服务存在时注入 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node >=18 | 必需，包声明 | ESM、文件读取与fetch | 无本轮兼容实测，需按目标环境确认 |
| DSH与Cordis | DSH工具入口必需；CLI不需宿主 | bundle加载及tools注册；Cordis声明>=4.0.4 <5 | 没有tools服务则不注册工具 |
| dsh-tools及systemPrompt服务 | 前者导入可降级；提示服务可选 | 工具定义及可选公告；声明范围>=0.2.0-rc.2 <0.3.0-0 | defineTool降级不证明宿主兼容，公告默认不注入 |
| GitHub账号、PAT文件与网络 | publish及verify必需；CLI plan不需 | 身份核对、仓库和PR操作 | 发布核对owner为token本人，不接受组织owner；权限失败停止 |
| 人工确认发布清单及双语描述 | 真发布必需 | 避免漏产物及错误登记 | files与排除规则可能遗漏，不能仅依赖预检通过 |

package声明兼容DSH 0.2.0-rc.2、0.2.1-rc.2、0.2.2-rc.1，属于作者声明；CLI与宿主接线、本人账号限制及读网络的预演区别见 [Q02](#research-q02)。

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户准备非敏感工程、PAT与个人目标；DSH另接入bundle | 参数和权限显式确认，不猜目标 |
| 预检 | 用户先调用CLI plan并对照完整产物清单 | 阻断清除且必需文件齐全；dist等遗漏则停止 |
| 发布 | 用户审阅预演后才允许真发布，后台逐文件上传并登记 | 读取各phase，失败后查远端实际状态再处理 |
| 验收与退出 | 用户独立核对目标提交、选中文件及PR状态 | 尾句不作证据；内容不完整或结果未知则退回现有流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | GitHub网络与账号资源，具体费用未知 | PAT审查、files与目标及双语描述准备；DSH另需接入 | 未测配置耗时，不能记零 |
| 持续使用 | 逐文件API调用及回拉，额度和计费未知 | 审计划、完整清单及PR、回验状态 | 请求数量随文件数变化，未测总耗时 |
| 失败恢复 | 已写远端状态保留；重试另消耗API与网络 | 查部分上传、topics及PR，手工修正或恢复 | 无自动回滚，结果未知不能直接当未写入 |
| 退出 | 账号资源及历史提交仍存在，处理费用未知 | 停用工具或不用CLI，已发内容须另行处理 | 停用不撤销远端发布 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多步骤交接 | 实现预检、上传、登记和阶段报告 | 是否减少总工时或提高合格率 |
| 文件一致检查 | 对选中文件比较内容哈希和长度 | 整个远端树完整、同一提交可复现及并发正确性 |
| 秘密预检 | 已知正则在限定扫描范围命中则阻断 | 未知格式、跳过文件及历史提交的秘密是否排除 |
| 失败处理 | 错误返回阶段数据，可据此人工核对 | 是否能低成本恢复所有部分状态 |

> **思考**：所选文件的哈希相等不等于完整发布。dist 被无条件排除、常见 ./ exports 未核查、远端旧文件与同一提交未受回验约束；非预演报告还会在跳过回验或失败时追加回验完成尾句，必须读取真实阶段，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把本地文件选择、预检、GitHub 上传、市场 PR 与哈希回验组织为可重复调用的阶段流程，相对零散 API 脚本提供统一交接记录；平台与哈希能力来自既有机制。该贡献限定编排便利，不能解释为原子发布或已证实节时，见 [Q01](#research-q01)。

core集中本地文件与预检，github可注入网络通道，publish返回结构化phase，CLI和宿主复用同一编排；这是可借鉴的职责分离。当前exports检查跳过常见相对路径、目录读取失败静默略过，以及非预演固定成功尾句会削弱验收可信度；移植时应优先修正这些边界，再处理提交绑定和恢复。固定源码规模与统计口径由INVENTORY保存，不以行数推断质量或人天。见 [Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

所选文件的哈希相等不等于完整发布。dist 被无条件排除、常见 ./ exports 未核查、远端旧文件与同一提交未受回验约束；非预演报告还会在跳过回验或失败时追加回验完成尾句，必须读取真实阶段，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在可丢弃个人仓库对非敏感小工程使用CLI plan，对照所有必需产物和导出路径，再核对预演阶段。真发布后独立读同一目标提交及PR状态；不要信固定回验尾句，也不要在不清楚远端状态时盲目重试。需要dist产物、组织仓库或原子发布的项目先保留既有Git/CI流程。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查的贡献是本地预检与远端发布步骤的编排；完整性、回验表述和恢复限制有固定源码依据。运行效果、兼容通过和发布证书假设均未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/core.js、lib/github.js、lib/index.js、lib/publish.js、bin/dsh-slipway.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定版本作者材料及全部六份统计源码/文档文件、package与bundle声明；没有执行目标代码或联网发布。源码可解释流程，不能证明GitHub权限可用、宿主兼容、真实节时或敏感信息已完全排除。
- 下一步：后续可在独立授权的可丢弃仓库比较正常发布、漏dist、关闭PR、部分上传及并发回验样本，记录真实远端状态、错误成功报告和人工恢复耗时；本轮未执行。

**分析版本**

- **仓库**：[7gzgn/dsh-slipway](https://github.com/7gzgn/dsh-slipway)
- **版本号**：0.1.3（[固定提交 c7604b8](https://github.com/7gzgn/dsh-slipway/tree/c7604b81e034b5e81a3d345217f6c5239dda0da0)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来设计假设是将人工确认的完整清单固化为批次，再绑定单一目标提交和市场 PR 状态，生成可独立复核的发布证书。先用漏产物、中断和并发样本比较错误成功报告、恢复动作及总耗时；出现错误覆盖或恢复成本增加即削弱假设。此方向未验证，见 [Q05](#research-q05)。

后续可在独立授权的可丢弃仓库比较正常发布、漏dist、关闭PR、部分上传及并发回验样本，记录真实远端状态、错误成功报告和人工恢复耗时；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 150 | 122 | 13 | — |
| .js | source | 4 | 1225 | 938 | 207 | — |
| .md | source | 1 | 112 | — | — | 1217 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/7gzgn/dsh-slipway/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/7gzgn/dsh-slipway/issues?q=is%3Aissue+created%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/7gzgn/dsh-slipway/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T08%3A55%3A05.110Z..2026-11-05T08%3A55%3A05.110Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：这条发布编排能否为个人插件维护者提供可复核交付，其完整性与恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这条发布链，它与手写 GitHub 脚本和普通 Git 推送的交付差异是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标人群是反复把本地 DSH 插件送到 GitHub 并申请市场收录的个人维护者。作者以三个作品重复手写建仓、上传、登记和回拉核对作为动机；这是作者经历，不能代表生态普遍需求。合格任务应至少包含明确的账号和仓库、经人工确认的完整发布清单、预期市场 PR 状态以及同一批文件的字节核对。

相对逐条调用 GitHub API 的脚本，publishPlugin 把本地预检、建仓、逐文件 PUT、topics、登记 PR 和回验串联，阶段结果有结构化记录。相对普通 Git 推送，它额外编排市场条目和选中文件的回验；GitHub 的存储、PR 和哈希机制属于既有平台能力，不能归为本插件原创。采用 Contents API 也舍弃了一次提交整批文件的交付方式。已有成熟 Git/CI 发布流程的人可能只需补登记步骤，无需迁移。

可确认的增量是给维护者一个重复使用的编排入口和可读阶段记录，尚无同任务对照证明更少人工或更高合格率。市场 PR 发出也不等于维护者合并或插件可加载，故“一条命令”只描述入口，不代表办结。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-24](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/README.md#L3-L24)

作者描述重复发布场景及五阶段目标；这是需求与效果主张的来源。

<details>
<summary>查看原文（22行）</summary>

```text
**把本地 DSH 插件工程一条命令发到 GitHub、再开一条市场收录 PR，最后把线上文件逐个拉回来比 sha256。**

> 名字的来由：船造好了得从滑道下水。前面三个作品每发一次，我都要手写同一串脚本 ——
> 建仓库 → 逐文件 PUT（还要比字节数）→ 打 topic → fork 建分支 → 写登记 yml → 开 PR →
> 线上逐文件回拉核对。三遍下来每次都掉同一个坑。这活该由代码干。

---

## 它做什么

**适用范围（一句话）：只走 GitHub。** 仓库建在 GitHub、文件传到 GitHub、市场收录 PR 也开在 GitHub 上。
**GitLab / Gitee / npm 都没有适配** —— 想发到别的平台，得先有那条平台的 API 与 token（见「已知限制」）。

一次调用走完四个阶段，每个阶段都留下可核对的证据：

| 阶段 | 做什么 | 证据 |
| --- | --- | --- |
| **① 自检** | 读 `package.json`、按 `files` 白名单收集文件、查 `main`/`exports`/`dsh.bundle.patch` 是否落地、扫密钥 | 文件数、总字节、错误/提醒清单 |
| **② 仓库** | 有就复用、没有就建（`auto_init:false`） | 仓库 URL、默认分支 |
| **③ 上传** | 逐文件 PUT（带 sha 的更新式写入），然后设 topics | 每个文件的字节数与 blob 短 sha |
| **④ 市场 PR** | fork（若无）→ 从上游 head 建分支 → 写 `data/plugins/<owner>__<repo>.yml` → 开 PR | PR 号与状态（已有 PR 就报它的号，不重复开） |
| **⑤ 回验** | 把线上每个文件拉回来，与本地比 **sha256 与长度** | 「N 个文件线上字节与本地完全一致」 |
```

</details>

**依据 2 · 源码核查**：[lib/publish.js:224-284](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/publish.js#L224-L284)

实际上传、topics和市场登记编排支持集成贡献，不能证明时间收益。

<details>
<summary>查看原文（61行）</summary>

```text
  try {
    // ① 仓库
    const existingRepo = await github.getRepo(owner, repo);
    if (existingRepo) {
      phases.push(phase('repo', 'ok', `仓库已存在：${owner}/${repo}（默认分支 ${existingRepo.default_branch}）`));
    } else if (dryRun) {
      phases.push(phase('repo', 'planned', `会新建仓库 ${owner}/${repo}（public、auto_init:false）`));
    } else {
      const created = await github.createRepo(repo, { description: input.descriptionEn, private: input.private === true });
      phases.push(phase('repo', 'ok', `已新建仓库 ${owner}/${repo}`, { url: created?.html_url ?? null }));
    }

    // ② 逐文件上传（每个文件都先查 sha，更新式写入）
    if (dryRun) {
      phases.push(phase('upload', 'planned', `会推送 ${plan.files.length} 个文件、共 ${(plan.total / 1024).toFixed(1)}KB`, {
        files: summarizePlan(plan).files,
      }));
    } else {
      const uploaded = [];
      for (const file of plan.files) {
        const existing = await github.getFile(owner, repo, file.path);
        const res = await github.putFile(owner, repo, file.path, {
          content: file.content,
          message: `${input.messagePrefix ?? 'Publish'} ${file.path}`,
          sha: existing?.sha,
        });
        uploaded.push({ path: file.path, bytes: file.bytes, blob: String(res?.content?.sha ?? '').slice(0, 7) });
      }
      phases.push(phase('upload', 'ok', `已推送 ${uploaded.length} 个文件`, { uploaded }));
    }

    // ③ topics
    const topics = Array.isArray(input.topics) && input.topics.length > 0 ? input.topics : DEFAULT_TOPICS;
    if (dryRun) {
      phases.push(phase('topics', 'planned', `会设置 topics：${topics.join(', ')}`));
    } else {
      await github.setTopics(owner, repo, topics);
      phases.push(phase('topics', 'ok', topics.join(', ')));
    }

    // ④ 市场条目 PR
    const market = input.market ?? {};
    if (market.enabled === false) {
      phases.push(phase('market', 'skipped', '调用方关了（market.enabled=false）'));
    } else {
      const upstream = { ...DEFAULT_UPSTREAM, ...(market.upstream ?? {}) };
      const forkOwner = market.forkOwner ?? me.login;
      const branch = market.branch ?? `add-${owner}-${repo}`;
      const entryPath = marketEntryPath(owner, repo);
      const yml = buildMarketYml({
        url: `https://github.com/${owner}/${repo}`,
        name: repo,
        category: input.category,
        descriptionEn: input.descriptionEn,
        descriptionZh: input.descriptionZh,
      });
      const prTitle = `Add ${owner}/${repo} (${input.category})`;

      const existingPr =
        (await github.findPull(upstream.owner, upstream.repo, `${forkOwner}:${branch}`)) ??
        (await github.findPullByTitle(upstream.owner, upstream.repo, `${owner}/${repo}`));
```

</details>

**依据 3 · 源码核查**：[lib/publish.js:334-358](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/publish.js#L334-L358)

回验和异常返回划定单次调用的结果边界。

<details>
<summary>查看原文（25行）</summary>

```text
    // ⑤ 线上逐字节回验
    if (dryRun) {
      phases.push(phase('verify', 'planned', `会逐文件拉回来比 sha256（${plan.files.length} 个）`));
    } else if (input.verify === false) {
      phases.push(phase('verify', 'skipped', '调用方关了（verify:false）'));
    } else {
      const res = await verifyPublished({ owner, repo, files: plan.files }, { github });
      phases.push(phase(
        'verify',
        res.ok ? 'ok' : 'error',
        res.ok
          ? `${res.checked} 个文件线上 sha256 与本地完全一致`
          : `有 ${res.mismatched.length + res.missing.length} 个文件对不上`,
        res,
      ));
      if (!res.ok) {
        return { ok: false, dryRun, phases, errors: ['线上回验不通过'], owner, repo, plan: summarizePlan(plan) };
      }
    }

    return { ok: true, dryRun, phases, errors: [], owner, repo, plan: summarizePlan(plan) };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    phases.push(phase('error', 'error', message));
    return { ok: false, dryRun, phases, errors: [message], owner, repo, plan: summarizePlan(plan) };
```

</details>

#### 缺口

- 没有独立维护者任务频率、人工时间及同条件发布结果对照。
  **影响**：不能据作者经历证明广泛采用必要性或端到端节省。
  **进一步探讨**：比较同一非敏感小插件的现有Git流程与本编排，记录合格交付、总人工步骤和全部重试时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从 DSH 工具或 CLI 到远端写入及回验，实际怎样接线？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

这是原生 DSH 插件兼 CLI，而非只有说明文件。package 指定 lib/index.js，bundle patch 插入插件，apply 在 tools 服务可用时注册 slipway_publish 与 slipway_verify；可选的 announceToAgent 才注入提示段。CLI 的 plan、publish、verify 复用同一编排模块。defineTool 导入失败退化为恒等函数只能说明宿主外可构造定义，不能证明不兼容宿主也可调用。

发布输入需工程目录、repo、分类及双语描述，并给 owner 或明确 ownerFromToken；客户端读取 PAT 后以 /user 核对本人，代码拒绝账号不一致，因此所研究链路不适合直接发布组织仓库。默认 dryRun 不写远端，但仍读取本地文件并联网查询身份、仓库与已有 PR，不是离线预演。CLI plan 才直接调用本地 buildPlan。

真发布将每个文件写入目标默认分支，再设置 topics；市场步骤默认开启，读取 fork 自身基线，必要时创建 fork，建分支写 yml 后发 PR。回验按选中文件逐个 getFile，不传固定 ref，比较下载内容 SHA-256 和长度，超过 Contents 内嵌内容范围时尝试 blob API。工具声明五分钟超时，GitHub 请求默认一分钟且未传宿主取消信号；这不构成整个远端任务已停止的证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:127-162](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/index.js#L127-L162)

apply与两个工具参数的实际注册入口。

<details>
<summary>查看原文（36行）</summary>

```text
export function apply(ctx, config) {
  const cfg = config ?? {};
  if (cfg.enabled === false) return;
  const disposers = [];
  const profileNodeModules = cfg.profileNodeModules ?? defaultProfileNodeModules();

  /** 组一个 GitHub 客户端；没 token 就返回 null（调用方会说明原因）。 */
  async function clientFor(tokenFile) {
    const { token } = await resolveToken(tokenFile ?? cfg.tokenFile);
    if (token === null) return null;
    return createGitHub({ token });
  }

  if (ctx.tools !== undefined && typeof ctx.tools.register === 'function') {
    disposers.push(ctx.tools.register(defineTool({
      name: 'slipway_publish',
      description: [
        '把本地插件工程发到 GitHub，并（默认）向市场收录仓库开一条 PR，最后把线上文件逐个拉回来比 sha256。',
        '**默认 dry-run**：只演算 + 报告，什么都不动；确认后再传 dryRun:false。',
        '目标必须显式给：projectDir（绝对路径）、repo、category、descriptionEn、descriptionZh —— 缺一样就报错，绝不猜。',
        '典型用法：dryRun 先跑一次 → 把报告给用户看 → 得到许可 → dryRun:false。',
      ].join('\n'),
      timeoutMs: TOOL_TIMEOUT_MS,
      parameters: {
        projectDir: { type: 'string', description: '本地工程目录的绝对路径（必须含 package.json）' },
        repo: { type: 'string', description: 'GitHub 仓库名（= 市场条目名），只含字母数字与 . _ -' },
        owner: { type: 'string', description: 'GitHub 账号（不填则必须显式写 ownerFromToken:true）' },
        ownerFromToken: { type: 'boolean', description: 'true = owner 用 token 本人的账号（读事实，不是猜）' },
        category: { type: 'string', description: `市场分类，必须是：${CATEGORIES.join(', ')}` },
        descriptionEn: { type: 'string', description: '市场条目英文简介（不自动生成）' },
        descriptionZh: { type: 'string', description: '市场条目中文简介（不自动生成）' },
        dryRun: { type: 'boolean', description: '默认 true = 只演算；false = 真动远端' },
        market: { type: 'boolean', description: '是否开市场收录 PR（默认 true）' },
        verify: { type: 'boolean', description: '是否做线上逐字节回验（默认 true）' },
        topics: { type: 'string', description: '要设置的 topics，逗号分隔（默认 dsh-plugin,deepseek-harness）' },
        tokenFile: { type: 'string', description: 'PAT 文件路径（不填则按 env / ~/.dsh / D:\\dsh 依次找）' },
```

</details>

**依据 2 · 源码核查**：[lib/index.js:182-218](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/index.js#L182-L218)

发布execute将参数转换后调用publishPlugin，另注册verify。

<details>
<summary>查看原文（37行）</summary>

```text
      async execute(args) {
        const a = args ?? {};
        const client = await clientFor(a.tokenFile);
        const input = {
          projectDir: a.projectDir,
          repo: a.repo,
          owner: a.owner,
          ownerFromToken: a.ownerFromToken === true,
          category: a.category,
          descriptionEn: a.descriptionEn,
          descriptionZh: a.descriptionZh,
          dryRun: a.dryRun !== false,
          market: { enabled: a.market !== false },
          verify: a.verify !== false,
          topics: parseList(a.topics),
          messagePrefix: a.messagePrefix,
        };
        try {
          const result = await publishPlugin(input, { github: client, profileNodeModules });
          // **不能**写 `error: undefined`：宿主用 lossless-JSON 校验返回对象，
          // JSON.stringify 会悄悄丢掉 undefined，校验器不会 —— 会被判 "invalid output"。
          const out = { ok: result.ok === true, data: result };
          if (out.ok !== true) out.error = String((result.errors ?? [])[0] ?? '未完成');
          return out;
        } catch (err) {
          return { ok: false, error: err instanceof Error ? err.message : String(err) };
        }
      },
    })));

    disposers.push(ctx.tools.register(defineTool({
      name: 'slipway_verify',
      description: [
        '只读回验：把 GitHub 仓库里已发布的文件逐个拉回来，与本地工程比 sha256 与长度。',
        '用来回答"线上那份和我手里这份是不是同一份" —— 不看 size 字段，看内容。',
      ].join('\n'),
      timeoutMs: TOOL_TIMEOUT_MS,
```

</details>

**依据 3 · 源码核查**：[lib/index.js:246-292](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/index.js#L246-L292)

只读回验与可选提示注入、dispose接线。

<details>
<summary>查看原文（47行）</summary>

```text
      async execute(args) {
        const a = args ?? {};
        const inputErrors = validateInput({
          projectDir: a.projectDir,
          repo: a.repo,
          owner: a.owner,
          category: 'tools',
          descriptionEn: 'verify',
          descriptionZh: 'verify',
        }).filter((e) => !e.includes('description') && !e.includes('category'));
        if (inputErrors.length > 0) return { ok: false, error: inputErrors.join('；') };
        const client = await clientFor(a.tokenFile);
        if (client === null) return { ok: false, error: 'PAT 读不到（试过 env / ~/.dsh/.gh-token / D:\\dsh\\.gh-token）' };
        try {
          const plan = await buildPlan({ projectDir: a.projectDir, repo: a.repo }, { profileNodeModules });
          if (plan.ok !== true) return { ok: false, error: plan.error };
          const res = await verifyPublished({ owner: a.owner, repo: a.repo, files: plan.files }, { github: client });
          // 同上：**不能**留 undefined 字段（lossless-JSON 校验会拒）
          const out = { ok: res.ok === true, data: { ...res, owner: a.owner, repo: a.repo, plan: summarizePlan(plan) } };
          if (out.ok !== true) out.error = '存在不一致';
          return out;
        } catch (err) {
          return { ok: false, error: err instanceof Error ? err.message : String(err) };
        }
      },
    })));
  }

  if (cfg.announceToAgent === true && ctx.systemPrompt !== undefined
    && typeof ctx.systemPrompt.section === 'function') {
    disposers.push(ctx.systemPrompt.section({
      name: 'plugin:slipway',
      order: SECTION_ORDER,
      text: SLIPWAY_GUIDANCE,
    }));
  }

  if (typeof ctx.effect === 'function' && disposers.length > 0) {
    ctx.effect(() => () => {
      for (const dispose of disposers) {
        try {
          if (typeof dispose === 'function') dispose();
        } catch {
          /* 卸载失败不阻断其它清理 */
        }
      }
    }, 'dsh-slipway: teardown');
```

</details>

**依据 4 · 源码核查**：[lib/publish.js:175-220](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/publish.js#L175-L220)

默认预演、输入核查及联网账号核对。

<details>
<summary>查看原文（46行）</summary>

```text
export async function publishPlugin(input = {}, deps = {}) {
  const dryRun = input.dryRun !== false; // **默认 true**
  const phases = [];

  const inputErrors = validateInput(input);
  if (inputErrors.length > 0) {
    return { ok: false, dryRun, phases, errors: inputErrors };
  }

  const plan = await buildPlan(input, deps);
  if (plan.ok !== true) {
    return { ok: false, dryRun, phases, errors: [plan.error] };
  }

  const blocking = plan.checks.errors;
  phases.push(phase(
    'preflight',
    blocking.length > 0 ? 'error' : (plan.checks.warnings.length > 0 ? 'warn' : 'ok'),
    `${plan.files.length} 个文件、共 ${(plan.total / 1024).toFixed(1)}KB`
      + (plan.checks.errors.length > 0 ? `｜${plan.checks.errors.length} 项阻断` : '')
      + (plan.checks.warnings.length > 0 ? `｜${plan.checks.warnings.length} 项提醒` : ''),
    { errors: plan.checks.errors, warnings: plan.checks.warnings, notes: plan.checks.notes },
  ));
  if (blocking.length > 0) {
    return { ok: false, dryRun, phases, errors: blocking.map((e) => e.message), plan: summarizePlan(plan) };
  }

  const github = deps.github;
  if (!github) {
    return { ok: false, dryRun, phases, errors: ['没有可用的 GitHub 客户端：token 读不到或为空'] };
  }

  let me;
  try {
    me = await github.whoami();
  } catch (err) {
    return { ok: false, dryRun, phases, errors: [`token 自检失败：${err instanceof Error ? err.message : String(err)}`] };
  }
  const owner = typeof input.owner === 'string' && input.owner !== '' ? input.owner : me.login;
  if (owner !== me.login) {
    return {
      ok: false,
      dryRun,
      phases,
      errors: [`owner 与 token 本人对不上：你给的是 ${owner}，token 属于 ${me.login} —— 不猜，直接停`],
    };
```

</details>

**依据 5 · 源码核查**：[lib/publish.js:291-340](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/publish.js#L291-L340)

fork基线、登记写入、PR和回验调用链。

<details>
<summary>查看原文（50行）</summary>

```text
      } else {
        const forkRepo = await github.getRepo(forkOwner, upstream.repo);
        if (!forkRepo) {
          await github.request('POST', `/repos/${upstream.owner}/${upstream.repo}/forks`, {});
          phases.push(phase('fork', 'ok', `已 fork ${upstream.owner}/${upstream.repo} → ${forkOwner}`));
        }
        // 分支要在 **fork 自己的**基线上建：上游 head 可能还没同步进 fork，
        // 拿上游 sha 去 fork 建 ref 会 404（fork 落后时必然发生）。fork 读不到再退回上游。
        const baseSha =
          (await github.getRef(forkOwner, upstream.repo, upstream.branch)) ??
          (await github.getRef(upstream.owner, upstream.repo, upstream.branch));
        if (!baseSha) {
          phases.push(phase('market', 'error', `拿不到上游 ${upstream.owner}/${upstream.repo}:${upstream.branch} 的 head sha`));
          return { ok: false, dryRun, phases, errors: ['上游分支读不到'], owner, repo };
        }
        await github.createBranch(forkOwner, upstream.repo, branch, baseSha);
        const existingEntry = await github.getFile(forkOwner, upstream.repo, entryPath, branch);
        await github.putFile(forkOwner, upstream.repo, entryPath, {
          content: Buffer.from(yml, 'utf8'),
          message: `Add ${owner}/${repo}`,
          branch,
          sha: existingEntry?.sha,
        });
        const pr = await github.createPull(upstream.owner, upstream.repo, {
          title: prTitle,
          head: `${forkOwner}:${branch}`,
          base: upstream.branch,
          body: [
            `Adds [${owner}/${repo}](https://github.com/${owner}/${repo}) under \`${input.category}\`.`,
            '',
            input.descriptionEn,
            '',
            '---',
            input.descriptionZh,
          ].join('\n'),
        });
        phases.push(phase('market', 'ok', pr ? `PR #${pr.number} 已开` : `分支已推（PR 可能已存在）`, {
          pr: pr ? { number: pr.number, url: pr.html_url, state: pr.state } : null,
          entryPath,
        }));
      }
    }

    // ⑤ 线上逐字节回验
    if (dryRun) {
      phases.push(phase('verify', 'planned', `会逐文件拉回来比 sha256（${plan.files.length} 个）`));
    } else if (input.verify === false) {
      phases.push(phase('verify', 'skipped', '调用方关了（verify:false）'));
    } else {
      const res = await verifyPublished({ owner, repo, files: plan.files }, { github });
```

</details>

**依据 6 · 源码核查**：[lib/github.js:118-134](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/github.js#L118-L134)

getFile可传ref而当前调用省略，putFile默认分支写入。

<details>
<summary>查看原文（17行）</summary>

```text
    /** 读一个文件（contents API）；不存在返回 null。 */
    async getFile(owner, repo, path, ref) {
      const q = ref ? `?ref=${encodeURIComponent(ref)}` : '';
      const res = await request('GET', `/repos/${owner}/${repo}/contents/${encodeURI(path)}${q}`);
      if (res.status === 404) return null;
      if (res.ok !== true) throw new GithubError(`读文件失败（HTTP ${res.status}）：${path}`, { status: res.status, path, body: res.json });
      return res.json;
    },

    /** 写一个文件（contents API）；body 里给 base64 内容，更新时带 sha。 */
    async putFile(owner, repo, path, { content, message, branch, sha }) {
      const body = { message, content: content.toString('base64') };
      if (branch) body.branch = branch;
      if (sha) body.sha = sha;
      const res = await request('PUT', `/repos/${owner}/${repo}/contents/${encodeURI(path)}`, body);
      if (res.ok !== true) throw new GithubError(`写文件失败（HTTP ${res.status}）：${path}`, { status: res.status, path, body: res.json });
      return res.json;
```

</details>

**依据 7 · 源码核查**：[bin/dsh-slipway.mjs:91-138](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/bin/dsh-slipway.mjs#L91-L138)

CLI三个子命令与同一核心的实际连接。

<details>
<summary>查看原文（48行）</summary>

```text
  if (cmd === 'plan') {
    const plan = await buildPlan(base, {});
    if (plan.ok !== true) {
      console.error(`❌ ${plan.error}`);
      return 1;
    }
    const summary = summarizePlan(plan);
    console.log(`工程：${summary.projectDir}`);
    console.log(`包名：${summary.name}@${summary.version}`);
    console.log(`文件：${summary.files.length} 个、共 ${(summary.totalBytes / 1024).toFixed(1)}KB`);
    for (const f of summary.files) console.log(`  · ${f.path}（${f.bytes} 字节）`);
    for (const n of summary.notes) console.log(`  · ${n.message}`);
    for (const w of summary.warnings) console.log(`  ⚠️ ${w.message}`);
    for (const e of summary.errors) console.log(`  ❌ ${e.message}`);
    return summary.errors.length > 0 ? 1 : 0;
  }

  if (cmd === 'publish') {
    if (client === null) {
      console.error('❌ PAT 读不到（试过 --token-file / env / ~/.dsh/.gh-token / D:\\dsh\\.gh-token）');
      return 2;
    }
    const result = await publishPlugin({
      ...base,
      dryRun: argv.go !== true,
      market: { enabled: argv['no-market'] !== true },
      verify: argv['no-verify'] !== true,
      messagePrefix: argv['message-prefix'],
    }, { github: client });
    printPhases(result);
    return result.ok === true ? 0 : 1;
  }

  if (cmd === 'verify') {
    if (client === null) {
      console.error('❌ PAT 读不到');
      return 2;
    }
    const plan = await buildPlan(base, {});
    if (plan.ok !== true) {
      console.error(`❌ ${plan.error}`);
      return 1;
    }
    const res = await verifyPublished({ owner: base.owner, repo: base.repo, files: plan.files }, { github: client });
    console.log(`比对 ${res.checked} 个文件：${res.ok ? '✅ 全部一致' : '❌ 有不一致'}`);
    for (const m of res.missing) console.log(`  ❌ 线上缺：${m}`);
    for (const m of res.mismatched) console.log(`  ❌ ${m.path}：${m.reason}`);
    return res.ok ? 0 : 1;
```

</details>

**依据 8 · 源码核查**：[package.json:1-21](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/package.json#L1-L21)

包入口、CLI及files声明。

<details>
<summary>查看原文（21行）</summary>

```text
{
  "name": "dsh-slipway",
  "version": "0.1.3",
  "description": "把本地插件工程发到 GitHub，并开一条市场收录 PR，最后把线上文件逐个拉回来比 sha256。 Ship a local DSH plugin to GitHub, open the market listing PR, then verify every uploaded file byte-by-byte.",
  "type": "module",
  "main": "lib/index.js",
  "bin": {
    "dsh-slipway": "bin/dsh-slipway.mjs"
  },
  "exports": {
    ".": "./lib/index.js",
    "./core": "./lib/core.js",
    "./publish": "./lib/publish.js",
    "./github": "./lib/github.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "bin",
    "cordis.patch.yml",
    "README.md",
```

</details>

**依据 9 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/cordis.patch.yml#L1-L4)

bundle实际插入插件入口。

```text
# dsh-slipway bundle patch: 把插件行插进 profile 名单。
- insert:
    - id: plugin-slipway
      name: 'dsh-slipway'
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 预演、清单与回验能否保证完整且安全的发布？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能把所选文件相等解释为完整、安全或原子的发布证书。最强支持是预检共享 buildPlan，并在默认真发布尾部比较每个选中文件的 SHA-256 和长度；命中已知敏感串会阻断上传。但这些约束的作用域比 README 的完整发布叙述窄。

清单遍历无条件跳过 dist、符号链接和无法读取的目录，files 白名单仍不能将它们纳入。对 main 指向 dist 的常见工程会报缺失入口；对 exports 以 ./ 开头的常见写法，检查直接 continue，不会核查导出文件存在。敏感串扫描跳过超过 2MB 文件和部分二进制扩展，且仅含固定正则，因此通过不能证明无秘密。以上均为源码可见条件和反例推导，本轮没有实际发布这些样本。

回验只查当前清单，没有列远端完整文件树，也不固定所有读取到同一提交；旧文件可残留，并发写入时读到的文件也未必属于一个可重现版本。多次单文件写入不构成整批原子提交。更直接的报告限制是 renderPublish 对所有非预演结果固定追加“线上已逐字节回验”，即使verify被关闭或先前阶段已失败，尾句仍如此；主状态虽能显示未完成，读者仍不能把尾句当回验证据。

因此本插件适合把清单核对作为显式人工步骤，不能替代完整构建产物检查、秘密审查和提交绑定。真正可复用的是本地计划与网络编排分层及结构化阶段数据，迁移时须同时修正语义边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core.js:23-42](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/core.js#L23-L42)

固定必带文件、无条件排除目录和秘密规则范围。

<details>
<summary>查看原文（20行）</summary>

```text
/** 无论 files 白名单怎么写，都一定要推上去的文件。 */
const ALWAYS_SHIP = ['package.json', 'README.md', 'README.en.md', 'LICENSE', 'LICENSE.md'];

/** 收集文件时永远跳过的目录。 */
const SKIP_DIRS = new Set(['.git', 'node_modules', '.github', 'coverage', '.cache', 'dist']);

/** GitHub contents API 的单文件软上限（超过 1MB 用普通 PUT 也在允许范围，但值得提醒）。 */
const SOFT_FILE_LIMIT = 1024 * 1024;
/** 硬上限：超过就走 Git Data API 了，v0.1 不收。 */
const HARD_FILE_LIMIT = 25 * 1024 * 1024;

/** 敏感串规则。命中即**拒绝发布**，且只报位置与掩码，不打印明文。 */
const SECRET_RULES = [
  { kind: 'openai-key', re: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { kind: 'github-pat', re: /\bghp_[A-Za-z0-9]{20,}\b/ },
  { kind: 'github-fine-grained-pat', re: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/ },
  { kind: 'aws-access-key', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { kind: 'private-key-block', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { kind: 'deepseek-key', re: /\bsk-[0-9a-f]{32}\b/i },
];
```

</details>

**依据 2 · 源码核查**：[lib/core.js:118-143](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/core.js#L118-L143)

目录访问异常返回已有结果并跳过符号链接。

<details>
<summary>查看原文（26行）</summary>

```text
/** 递归列出目录下的文件（相对路径、`/` 分隔）；不跟符号链接出去。 */
async function walk(dir, prefix = '', out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const rel = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
    const full = join(dir, entry.name);
    let st;
    try {
      st = await lstat(full);
    } catch {
      continue;
    }
    if (st.isSymbolicLink()) continue;
    if (st.isDirectory()) {
      await walk(full, rel, out);
    } else if (st.isFile()) {
      out.push(rel);
    }
  }
  return out;
```

</details>

**依据 3 · 源码核查**：[lib/core.js:266-287](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/core.js#L266-L287)

main、exports及patch检查条件，./ exports被跳过。

<details>
<summary>查看原文（22行）</summary>

```text
  if (typeof manifest.main === 'string') {
    const hit = files.some((f) => f.path === manifest.main);
    if (!hit) errors.push({ code: 'main-missing', message: `main 指向的文件不在发布清单里：${manifest.main}` });
  }
  if (manifest.exports !== undefined && typeof manifest.exports === 'object') {
    for (const value of Object.values(manifest.exports)) {
      if (typeof value !== 'string' || value.startsWith('.')) continue;
      if (!files.some((f) => f.path === value || f.path === value.replace(/^\.\//, ''))) {
        warnings.push({ code: 'export-missing', message: `exports 指向的文件不在清单里：${value}` });
      }
    }
  }
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
    warnings.push({ code: 'no-files-whitelist', message: 'package.json 没有 files 白名单 —— 只有必带文件会被推上去' });
  }
  for (const miss of missing) {
    warnings.push({ code: 'pattern-empty', message: `files 里的 "${miss}" 没匹配到任何文件` });
  }

  const patch = manifest?.dsh?.bundle?.patch;
  if (typeof patch === 'string' && !files.some((f) => f.path === patch.replace(/^\.\//, ''))) {
    errors.push({ code: 'patch-missing', message: `dsh.bundle.patch 指向的文件不在清单里：${patch}` });
```

</details>

**依据 4 · 源码核查**：[lib/core.js:308-319](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/core.js#L308-L319)

超过2MB及指定二进制后缀不扫描。

<details>
<summary>查看原文（12行）</summary>

```text
  // 敏感串：只在文本文件里扫（二进制跳过），命中即 error，且**不回显明文**
  for (const file of files) {
    if (file.bytes > 2 * 1024 * 1024) continue;
    if (/\.(png|jpg|jpeg|gif|webp|ico|zip|tgz|exe|bin|woff2?)$/i.test(file.path)) continue;
    const hits = scanSecrets(file.content.toString('utf8'));
    for (const hit of hits) {
      errors.push({
        code: 'secret-found',
        message: `${file.path}:${hit.line} 命中 ${hit.kind}（${hit.masked}）—— 先清理再发布`,
      });
    }
  }
```

</details>

**依据 5 · 源码核查**：[lib/publish.js:129-166](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/publish.js#L129-L166)

仅对files逐文件查询与哈希比较，没有远端全集或固定ref。

<details>
<summary>查看原文（38行）</summary>

```text
export async function verifyPublished({ owner, repo, files }, { github }) {
  const mismatched = [];
  const missing = [];
  let checked = 0;

  for (const file of files) {
    const entry = await github.getFile(owner, repo, file.path);
    if (!entry) {
      missing.push(file.path);
      continue;
    }
    let buf = null;
    if (typeof entry.content === 'string' && entry.content !== '') {
      buf = Buffer.from(entry.content.replace(/\s+/g, ''), 'base64');
    } else if (typeof entry.git_url === 'string' && entry.git_url !== '') {
      // >1MB 的文件 contents API 不给 content，退回 blob API
      const blob = await github.request('GET', entry.git_url.replace('https://api.github.com', ''));
      if (blob.ok === true && typeof blob.json?.content === 'string') {
        buf = Buffer.from(blob.json.content.replace(/\s+/g, ''), 'base64');
      }
    }
    if (buf === null) {
      mismatched.push({ path: file.path, reason: '线上拿不到内容' });
      continue;
    }
    checked += 1;
    const got = sha256(buf);
    const want = sha256(file.content);
    if (got !== want || buf.length !== file.bytes) {
      mismatched.push({
        path: file.path,
        reason: `sha256 不一致（线上 ${got.slice(0, 12)} vs 本地 ${want.slice(0, 12)}）`,
        remoteBytes: buf.length,
        localBytes: file.bytes,
      });
    }
  }
  return { checked, mismatched, missing, ok: mismatched.length === 0 && missing.length === 0 };
```

</details>

**依据 6 · 源码核查**：[lib/index.js:93-119](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/index.js#L93-L119)

非dryRun结果固定追加回验完成文案，未以verify阶段状态判断。

<details>
<summary>查看原文（27行）</summary>

```text
export function renderPublish(value) {
  const lines = [];
  const head = value.dryRun ? '🧪 dry-run（什么都没动）' : '🚢 真跑';
  lines.push(`slipway_publish｜${value.ok === true ? '成功' : '未完成'}｜${head}`);
  if (value.owner || value.repo) lines.push(`  目标：${value.owner ?? '?'}/${value.repo ?? '?'}`);
  for (const p of value.phases ?? []) {
    lines.push(`  ${STATUS_MARK[p.status] ?? '·'} ${p.name}：${p.detail}`);
    for (const w of p.warnings ?? []) lines.push(`      ⚠️ ${w.message}`);
    for (const n of p.notes ?? []) lines.push(`      · ${n.message}`);
    if (Array.isArray(p.uploaded) && p.uploaded.length > 0) {
      const total = p.uploaded.reduce((sum, f) => sum + f.bytes, 0);
      lines.push(`      · ${p.uploaded.length} 个文件、共 ${(total / 1024).toFixed(1)}KB`);
    }
  }
  if (Array.isArray(value.errors) && value.errors.length > 0) {
    lines.push('  阻断项：');
    for (const e of value.errors) lines.push(`      ❌ ${e}`);
  }
  if (value.plan?.files && value.dryRun === true) {
    lines.push(`  文件清单（${value.plan.files.length} 个）：`);
    for (const f of value.plan.files.slice(0, 30)) lines.push(`      · ${f.path}（${f.bytes} 字节）`);
    if (value.plan.files.length > 30) lines.push(`      …还有 ${value.plan.files.length - 30} 个`);
  }
  lines.push(value.dryRun
    ? '  → 确认无误后，用 `dryRun:false` 再来一次才会真正动手。'
    : '  → 线上已逐字节回验；收录 PR 需要维护者合并，别催、别重复开。');
  return lines.join('\n');
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 重复执行和半途失败由谁恢复，全周期代价是否与价值相称？

**研究主题**：效果与总成本、采用判断

#### 完整回答

恢复责任仍在维护者，不能把先查询后写入当作严格幂等事务。发布逐文件 PUT，即便内容相同也未在客户端先比较字节后跳过；后续 topics 或 PR 失败不撤销此前文件。仓库、分支和 PR 查询能避免一部分重复对象，却没有持久批次、断点清单或补偿日志。客户端把 createBranch 与 createPull 的任意 422 都当作已存在，未细分错误；已有 PR 可为关闭状态，市场阶段直接记录 ok，不刷新登记文本。传输超时意味着本地未收到结果，不证明远端写入没发生。

首次需准备 PAT 文件、个人目标仓库、package.files 与双语市场描述，DSH 使用另需profile接入。持续使用要审完整本地计划、远端状态及回验阶段，失败后逐项查仓库、文件、topics和PR，再选择修正重试或手工恢复。调用方可关闭market或verify，但这改变验收范围，不能仍把成功解释成完整链路办结。

建议只在个人账号的可丢弃非敏感小项目试用，先使用CLI plan并人工对照应发布文件，不把工具尾句作为证据。含dist必需产物、依赖严格一次发布、组织账号或敏感资料的场景先退回现有Git/CI流程。试用成功需独立确认选中文件齐全、同一目标提交内容正确、PR状态符合预期；出现漏文件、结果不明或不可接受的部分写入就停止。无测量数据，现金、耗时和单位合格发布成本均未知，不能断言便宜或节时。

#### 证据与依据

**依据 1 · 源码核查**：[lib/publish.js:236-261](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/publish.js#L236-L261)

逐文件写入与topics发生在后续步骤之前，没有补偿分支。

<details>
<summary>查看原文（26行）</summary>

```text
    // ② 逐文件上传（每个文件都先查 sha，更新式写入）
    if (dryRun) {
      phases.push(phase('upload', 'planned', `会推送 ${plan.files.length} 个文件、共 ${(plan.total / 1024).toFixed(1)}KB`, {
        files: summarizePlan(plan).files,
      }));
    } else {
      const uploaded = [];
      for (const file of plan.files) {
        const existing = await github.getFile(owner, repo, file.path);
        const res = await github.putFile(owner, repo, file.path, {
          content: file.content,
          message: `${input.messagePrefix ?? 'Publish'} ${file.path}`,
          sha: existing?.sha,
        });
        uploaded.push({ path: file.path, bytes: file.bytes, blob: String(res?.content?.sha ?? '').slice(0, 7) });
      }
      phases.push(phase('upload', 'ok', `已推送 ${uploaded.length} 个文件`, { uploaded }));
    }

    // ③ topics
    const topics = Array.isArray(input.topics) && input.topics.length > 0 ? input.topics : DEFAULT_TOPICS;
    if (dryRun) {
      phases.push(phase('topics', 'planned', `会设置 topics：${topics.join(', ')}`));
    } else {
      await github.setTopics(owner, repo, topics);
      phases.push(phase('topics', 'ok', topics.join(', ')));
```

</details>

**依据 2 · 源码核查**：[lib/publish.js:282-288](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/publish.js#L282-L288)

已存在PR包括关闭状态也复用，未重新写条目。

```text
      const existingPr =
        (await github.findPull(upstream.owner, upstream.repo, `${forkOwner}:${branch}`)) ??
        (await github.findPullByTitle(upstream.owner, upstream.repo, `${owner}/${repo}`));
      if (existingPr) {
        phases.push(phase('market', 'ok', `PR 已存在：#${existingPr.number}（${existingPr.state}）`, {
          pr: { number: existingPr.number, state: existingPr.state, url: existingPr.html_url },
        }));
```

**依据 3 · 源码核查**：[lib/publish.js:334-358](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/publish.js#L334-L358)

可跳过verify，异常只返回阶段及错误。

<details>
<summary>查看原文（25行）</summary>

```text
    // ⑤ 线上逐字节回验
    if (dryRun) {
      phases.push(phase('verify', 'planned', `会逐文件拉回来比 sha256（${plan.files.length} 个）`));
    } else if (input.verify === false) {
      phases.push(phase('verify', 'skipped', '调用方关了（verify:false）'));
    } else {
      const res = await verifyPublished({ owner, repo, files: plan.files }, { github });
      phases.push(phase(
        'verify',
        res.ok ? 'ok' : 'error',
        res.ok
          ? `${res.checked} 个文件线上 sha256 与本地完全一致`
          : `有 ${res.mismatched.length + res.missing.length} 个文件对不上`,
        res,
      ));
      if (!res.ok) {
        return { ok: false, dryRun, phases, errors: ['线上回验不通过'], owner, repo, plan: summarizePlan(plan) };
      }
    }

    return { ok: true, dryRun, phases, errors: [], owner, repo, plan: summarizePlan(plan) };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    phases.push(phase('error', 'error', message));
    return { ok: false, dryRun, phases, errors: [message], owner, repo, plan: summarizePlan(plan) };
```

</details>

**依据 4 · 源码核查**：[lib/github.js:62-80](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/github.js#L62-L80)

传输超时记录transport-failed并抛错，未判断远端副作用。

<details>
<summary>查看原文（19行）</summary>

```text
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let res;
    try {
      res = await fetchImpl(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      calls.push({ method, path, status: 0, note: 'transport-failed' });
      throw new GithubError(`请求 ${method} ${path} 失败：${err instanceof Error ? err.message : String(err)}`, { path });
    }
    clearTimeout(timer);

    let json = null;
    let text = '';
    try {
```

</details>

**依据 5 · 源码核查**：[lib/github.js:152-188](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/github.js#L152-L188)

分支和PR的422统一返回null，PR查询包含全部状态。

<details>
<summary>查看原文（37行）</summary>

```text
    /** 从给定 sha 建分支；已存在返回 null。 */
    async createBranch(owner, repo, branch, sha) {
      const res = await request('POST', `/repos/${owner}/${repo}/git/refs`, { ref: `refs/heads/${branch}`, sha });
      if (res.status === 422) return null; // 已存在
      if (res.ok !== true) throw new GithubError(`建分支失败（HTTP ${res.status}）：${branch}`, { status: res.status, path: '/git/refs', body: res.json });
      return res.json;
    },

    /** 找一个已有 PR（按 head 分支）；没有返回 null —— 幂等靠它。 */
    async findPull(owner, repo, head) {
      const res = await request('GET', `/repos/${owner}/${repo}/pulls?state=all&head=${encodeURIComponent(head)}&per_page=10`);
      if (res.ok !== true) throw new GithubError(`查 PR 失败（HTTP ${res.status}）`, { status: res.status, path: '/pulls', body: res.json });
      return Array.isArray(res.json) && res.json.length > 0 ? res.json[0] : null;
    },

    /**
     * 按标题再找一次已有 PR —— 分支名可能被改过（老版本用过 `add-<repo>`），
     * 只按 head 查会漏，于是重复开 PR。标题里带 `owner/repo` 就够了。
     * @param {string} owner 上游 owner
     * @param {string} repo 上游仓库
     * @param {string} needle 标题里必须出现的片段（形如 `7gzgn/dsh-x`）
     * @returns {Promise<object|null>} 命中的 PR（含 number/state/html_url）或 null
     */
    async findPullByTitle(owner, repo, needle) {
      const q = encodeURIComponent(`repo:${owner}/${repo} is:pr in:title "${needle}"`);
      const res = await request('GET', `https://api.github.com/search/issues?q=${q}&per_page=10`);
      if (res.ok !== true) return null;
      const items = Array.isArray(res.json?.items) ? res.json.items : [];
      return items.length > 0 ? items[0] : null;
    },

    /** 开 PR。 */
    async createPull(owner, repo, { title, body, head, base }) {
      const res = await request('POST', `/repos/${owner}/${repo}/pulls`, { title, body, head, base });
      if (res.status === 422) return null; // 多半是已存在
      if (res.ok !== true) throw new GithubError(`开 PR 失败（HTTP ${res.status}）：${res.json?.message ?? ''}`, { status: res.status, path: '/pulls', body: res.json });
      return res.json;
```

</details>

**依据 6 · 作者声明**：[README.md:79-99](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/README.md#L79-L99)

PAT与平台、测试限制为作者声明。

<details>
<summary>查看原文（21行）</summary>

```text
### PAT 从哪来

依次找：`--token-file` → 环境变量 `DSH_SLIPWAY_TOKEN_FILE` → `~/.dsh/.gh-token` → `D:\dsh\.gh-token`。
需要的 scope：`repo`（建仓库、推文件、开 PR）。

### 市场分类白名单

`agi ui usage theme model identity session memory tools wsl browser vision voice docs skill workflow git notify dev security remote market fun`

## 兼容性

- 运行时：**DSH 0.2.0-rc.2**（本人实测使用的版本）。
- `peerDependencies` 用显式范围（`>=0.2.0-rc.2 <0.3.0-0`），下限是实测过的版本，上限不赌没验证过的 breaking change。
- **运行时主动降级**：拿不到 `@deepseek-ai/dsh-tools` 的 `defineTool` → 退化成恒等函数（CLI 与测试场景照常工作）；
  `ctx.systemPrompt` 不存在 → 跳过公告段。宿主 API 有出入时，本插件少一项能力，而不是把 DSH 拖崩。

## 已知边界

- **单文件 ≤ 25MB**：contents API 走不了更大的文件（那需要 Git Data API，v0.1 不做）；>1MB 会给提醒。
- **不做 npm 发布**：DSH 市场大半靠 `github:owner/repo` 安装，npm 不在链路上。
- **不替你跑项目的测试**：测试要不要跑、在哪跑由调用方决定（活代码树里跑测试 = 在真宿主上生效，这是血换来的规矩）。
```

</details>

#### 缺口

- 没有实际故障注入和同负载发布成本记录。
  **影响**：无法量化恢复工作量、真实合格率或证明编排节省总投入。
  **进一步探讨**：在授权的可丢弃仓库对中断、关闭PR、并发修改分别记录人工恢复步骤和最终提交。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪个设计可复用，怎样用反例检验更强的发布证书假设？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可借鉴的已有设计是 collectFiles/preflight 与 GitHub 客户端、publish 编排分层：本地计划集中表达文件选择，网络调用留阶段状态，预演和真发布复用构建计划代码。这是普通但可复用的职责分离，SHA-256 算法和GitHub API并非本组件原创。移植到别的平台须重建权限、分支、错误分类与失败恢复，不能只换URL。

由 Q03 的清单不完备和逐文件非固定ref回验、Q04 的部分失败，推导未验证假设：把人工确认的完整文件清单及内容摘要固化为批次，在单一目标提交写入并回验同一提交，再把市场PR状态与证书绑定，能够减少“报告成功但无法复现同一交付”的情况。此处新增的是跨阶段证书，不是把现有SHA比较重新命名为事务；成本包括保存批次状态、处理并发冲突和审查哪些旧文件应删，错误补偿还可能扩大破坏。

最小验证应使用同一组非敏感小项目，对照现有编排与证书版本，包含dist导出、远端旧文件、上传中断、回验期间并发写入及关闭PR。记录错误成功报告、可复现提交、人工恢复动作和总耗时。成功判据是所有失败样本不报告完整成功，成功样本可由同一提交独立复核；任何错误覆盖、漏文件却给证书或恢复投入高于原流程都削弱该假设。该实验尚未执行，不计入已有技术或业务创新评分。

#### 证据与依据

**依据 1 · 源码核查**：[lib/publish.js:74-120](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/publish.js#L74-L120)

可复用的buildPlan与summarizePlan职责。

<details>
<summary>查看原文（47行）</summary>

```text
export async function buildPlan(input = {}, deps = {}) {
  // 活代码检测的兜底放在**最里面**：调用方漏传一次，这条警告就整个失效
  // （实测：CLI 的 plan 一开始就漏了，活代码工程上照样不出警告）
  const profileNodeModules = deps.profileNodeModules
    ?? (process.env.DSH_SLIPWAY_PROFILE_NODE_MODULES
      || join(process.env.USERPROFILE ?? process.env.HOME ?? '', '.dsh', 'profiles', 'desktop', 'node_modules'));

  const projectDir = String(input.projectDir ?? '');
  const manifestRes = await readManifest(projectDir);
  if (manifestRes.ok !== true) return { ok: false, error: manifestRes.error };

  const manifest = manifestRes.manifest;
  const collected = await collectFiles(projectDir, manifest);
  const liveTree = await detectLiveTree(projectDir, profileNodeModules);
  const checks = await preflight({
    projectDir,
    manifest,
    files: collected.files,
    missing: collected.missing,
    liveTree,
    repo: typeof input.repo === 'string' ? input.repo : undefined,
  });
  return {
    ok: true,
    projectDir,
    manifest,
    files: collected.files,
    missing: collected.missing,
    liveTree,
    checks,
    total: collected.total,
  };
}

/** 把计划压成便于阅读与断言的摘要（不含文件内容）。 */
export function summarizePlan(plan) {
  return {
    projectDir: plan.projectDir,
    name: plan.manifest?.name ?? null,
    version: plan.manifest?.version ?? null,
    files: plan.files.map((f) => ({ path: f.path, bytes: f.bytes })),
    totalBytes: plan.total,
    errors: plan.checks.errors,
    warnings: plan.checks.warnings,
    notes: plan.checks.notes,
    liveTree: plan.liveTree,
  };
```

</details>

**依据 2 · 源码核查**：[lib/publish.js:129-166](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/publish.js#L129-L166)

当前回验作用域是推导提交绑定证书的直接依据。

<details>
<summary>查看原文（38行）</summary>

```text
export async function verifyPublished({ owner, repo, files }, { github }) {
  const mismatched = [];
  const missing = [];
  let checked = 0;

  for (const file of files) {
    const entry = await github.getFile(owner, repo, file.path);
    if (!entry) {
      missing.push(file.path);
      continue;
    }
    let buf = null;
    if (typeof entry.content === 'string' && entry.content !== '') {
      buf = Buffer.from(entry.content.replace(/\s+/g, ''), 'base64');
    } else if (typeof entry.git_url === 'string' && entry.git_url !== '') {
      // >1MB 的文件 contents API 不给 content，退回 blob API
      const blob = await github.request('GET', entry.git_url.replace('https://api.github.com', ''));
      if (blob.ok === true && typeof blob.json?.content === 'string') {
        buf = Buffer.from(blob.json.content.replace(/\s+/g, ''), 'base64');
      }
    }
    if (buf === null) {
      mismatched.push({ path: file.path, reason: '线上拿不到内容' });
      continue;
    }
    checked += 1;
    const got = sha256(buf);
    const want = sha256(file.content);
    if (got !== want || buf.length !== file.bytes) {
      mismatched.push({
        path: file.path,
        reason: `sha256 不一致（线上 ${got.slice(0, 12)} vs 本地 ${want.slice(0, 12)}）`,
        remoteBytes: buf.length,
        localBytes: file.bytes,
      });
    }
  }
  return { checked, mismatched, missing, ok: mismatched.length === 0 && missing.length === 0 };
```

</details>

**依据 3 · 源码核查**：[lib/publish.js:236-252](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/publish.js#L236-L252)

逐文件发布为批次提交假设提供反例条件。

<details>
<summary>查看原文（17行）</summary>

```text
    // ② 逐文件上传（每个文件都先查 sha，更新式写入）
    if (dryRun) {
      phases.push(phase('upload', 'planned', `会推送 ${plan.files.length} 个文件、共 ${(plan.total / 1024).toFixed(1)}KB`, {
        files: summarizePlan(plan).files,
      }));
    } else {
      const uploaded = [];
      for (const file of plan.files) {
        const existing = await github.getFile(owner, repo, file.path);
        const res = await github.putFile(owner, repo, file.path, {
          content: file.content,
          message: `${input.messagePrefix ?? 'Publish'} ${file.path}`,
          sha: existing?.sha,
        });
        uploaded.push({ path: file.path, bytes: file.bytes, blob: String(res?.content?.sha ?? '').slice(0, 7) });
      }
      phases.push(phase('upload', 'ok', `已推送 ${uploaded.length} 个文件`, { uploaded }));
```

</details>

**依据 4 · 源码核查**：[lib/github.js:38-52](https://github.com/7gzgn/dsh-slipway/blob/c7604b81e034b5e81a3d345217f6c5239dda0da0/lib/github.js#L38-L52)

客户端允许注入fetch并集中封装网络通道。

<details>
<summary>查看原文（15行）</summary>

```text
export function createGitHub({ token, fetchImpl = fetch, baseUrl = 'https://api.github.com', timeoutMs = 60000 }) {
  if (typeof token !== 'string' || token.trim() === '') {
    throw new GithubError('缺少 GitHub token（PAT 文件读不到或为空）');
  }
  const calls = [];

  /**
   * 发一次请求。
   * @param {string} method 方法
   * @param {string} path 路径（/ 开头）
   * @param {object} [body] JSON body
   * @param {object} [opts] 选项
   * @returns {Promise<{status:number, ok:boolean, json:any, headers:object, path:string}>} 响应
   */
  async function request(method, path, body, opts = {}) {
```

</details>

#### 缺口

- 发布证书是否降低总恢复成本尚无比较。
  **影响**：只能列为未来设计假设，不能提高本版本采用或创新档位。
  **进一步探讨**：用所列中断和并发样本检验漏报、错误覆盖及恢复耗时。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
