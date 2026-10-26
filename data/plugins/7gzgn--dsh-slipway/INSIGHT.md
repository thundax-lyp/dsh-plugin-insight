# dsh-slipway

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[b28316b](https://github.com/7gzgn/dsh-slipway/tree/b28316be0beca1f05126c8ef1d3166e14a9bb784)

<!-- BEGIN META -->
[![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-slipway)
<!-- END META -->

> **实现功能**：预检本地 DSH 插件，上传到 GitHub、创建市场登记 PR，并回拉逐文件校验发布字节。

> **核心亮点**：相对零散脚本，它把发布前阻断、远端幂等和发布后字节回验放在同一事务叙事中，减少漏步骤；但没有真正原子事务，仓库上传成功而市场 PR 失败会留下部分完成状态。仅支持 GitHub contents API，不处理 npm、GitLab 或大文件。 详见[Q03](#research-q03)。

> **风险与缺陷**：核心质疑是多阶段远端副作用失败后的恢复是否足够。幂等查询可减少重复仓库/PR，却不能回滚已上传文件、错误 topic 或已公开敏感内容；密钥扫描是模式启发式，不能证明无秘密。PAT repo 权限很大，错误目标参数的后果高。 详见[Q04](#research-q04)。

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
  - [Q01 · 谁在何种重复场景需要 dsh-slipway，合格交付与简单替代是什么？](#detail-section-11)
  - [Q02 · dsh-slipway 的入口、调用链、状态变化与副作用如何实现？](#detail-section-12)
  - [Q03 · 相对宿主原生能力或简单替代，dsh-slipway 的具体增量是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使 dsh-slipway 的核心价值不成立？](#detail-section-14)
  - [Q05 · dsh-slipway 启动、持续生效与失败降级依赖什么？](#detail-section-15)
  - [Q06 · dsh-slipway 完成一个合格任务的首次、持续与失败恢复成本是什么？](#detail-section-16)
  - [Q07 · dsh-slipway 的工程可靠性和可迁移设计如何？](#detail-section-17)
  - [Q08 · 由贡献与限制可推导什么可证伪的新设计假设？](#detail-section-18)
  - [Q09 · 哪些人应观察、试用或拒绝采用 dsh-slipway？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：重复发布 DSH 插件的维护者需要把建仓、逐文件上传、市场登记 PR 和线上回验串成一次可审计交付；基线是 gh/API 脚本加人工核对。合格结果是目标完全显式、敏感信息未上传、远端文件逐字节一致、PR 幂等且每个副作用可追踪。 详见[Q01](#research-q01)。

重复发布 DSH 插件的维护者需要把建仓、逐文件上传、市场登记 PR 和线上回验串成一次可审计交付；基线是 gh/API 脚本加人工核对。合格结果是目标完全显式、敏感信息未上传、远端文件逐字节一致、PR 幂等且每个副作用可追踪。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 发布预检 | 核 package 文件、入口、bundle 和秘密 | 启发式扫描不证明绝对无秘密 |
| GitHub 发布 | 建/复用仓库并逐文件上传 | 仅 GitHub，单文件 ≤25MB |
| 市场 PR | 写登记 yml 并开/复用 PR | 依赖市场目录结构和 fork 权限 |
| 远端回验 | 比较每个文件 sha256/长度 | 验证字节，不验证插件运行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| GitHub PAT(repo) | 实跑必需 | 仓库、文件、fork 与 PR API | 权限或 owner 不匹配即停止 |
| 显式发布参数 | 必需 | 锁定 project/repo/category/描述 | 缺一拒绝，不猜 |
| package files 清单 | 必需 | 确定发布字节集合 | 遗漏文件仍可能导致包不可用 |
| 市场仓库可访问 | 市场阶段必需 | 创建登记 PR | 失败会留下仅仓库已发布状态 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 预检 | 维护者运行 plan/dry-run | 得到文件、字节、阻断与提醒 |
| 授权 | 人审目标、描述、秘密结果 | 显式 --go/dryRun:false |
| 发布 | 后台逐阶段调用 GitHub | 每阶段返回仓库/文件/PR证据 |
| 回验 | verify 拉回全部文件 | sha256与长度全匹配；否则人工修复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | GitHub 账号/PAT，无定价数据 | 配置 token 文件和市场参数 | 权限审查耗时未知 |
| 每次发布 | GitHub API 配额与网络 | 审 dry-run、PR和回验报告 | 按一个字节一致的发布批次计量 |
| 失败恢复 | 部分完成远端对象继续存在 | 查仓库/分支/PR，修正后续跑或人工撤销 | 错误公开内容不可自动回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 发布完整性 | 源码串联预检、上传、PR、回验 | 真实 GitHub 失败率与耗时 |
| 敏感信息阻断 | 模式扫描命中即阻断且掩码 | 未知格式秘密与历史提交 |
| 幂等性 | 先查询仓库/分支/PR | 阶段中断后的所有部分状态 |

> **思考**：核心质疑是多阶段远端副作用失败后的恢复是否足够。幂等查询可减少重复仓库/PR，却不能回滚已上传文件、错误 topic 或已公开敏感内容；密钥扫描是模式启发式，不能证明无秘密。PAT repo 权限很大，错误目标参数的后果高。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对零散脚本，它把发布前阻断、远端幂等和发布后字节回验放在同一事务叙事中，减少漏步骤；但没有真正原子事务，仓库上传成功而市场 PR 失败会留下部分完成状态。仅支持 GitHub contents API，不处理 npm、GitLab 或大文件。 详见[Q03](#research-q03)。

相对零散脚本，它把发布前阻断、远端幂等和发布后字节回验放在同一事务叙事中，减少漏步骤；但没有真正原子事务，仓库上传成功而市场 PR 失败会留下部分完成状态。仅支持 GitHub contents API，不处理 npm、GitLab 或大文件。 详见[Q03](#research-q03)。

core、GitHub client、publish orchestration 和 CLI 分层，token 掩码、body 不记证据、默认 dry-run 和逐文件哈希回验值得复用。迁移到 Git Data API 或其他平台要重建权限、幂等键、大小限制与补偿逻辑，不能只替换 URL。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心质疑是多阶段远端副作用失败后的恢复是否足够。幂等查询可减少重复仓库/PR，却不能回滚已上传文件、错误 topic 或已公开敏感内容；密钥扫描是模式启发式，不能证明无秘密。PAT repo 权限很大，错误目标参数的后果高。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有固定 GitHub 发布流程的插件维护者可先在测试组织以 dry-run 和只读 verify 试用；真实 publish 必须由人核对 owner/repo、文件清单、secret 扫描与市场描述后单独授权。含大文件、需要 npm/GitLab、无法轮换 PAT 或不能接受部分远端状态的项目不适合。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认了默认 dry-run、显式目标、秘密模式扫描、GitHub 多阶段发布、PR 幂等查询与逐文件 sha256 回验；本轮没有访问 GitHub 或制造阶段中断，所以可确认发布编排与静态边界，不能确认部分完成状态的续跑、补偿和远端权限适配。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 b28316be0beca1f05126c8ef1d3166e14a9bb784 的作者材料、入口与关键源码；不运行插件、测试、外部服务或真实 Host；检查时间不早于 2026-10-22T15:49:47Z。
- 下一步：在专用 GitHub 测试组织用无敏感数据仓库执行 dry-run、授权发布与回验，并在建仓、第三个文件、建分支、开 PR 前后断网；要求不重复 PR、不覆盖错误内容、manifest 字节一致且人工可枚举清理对象。

**分析版本**

- **仓库**：[7gzgn/dsh-slipway](https://github.com/7gzgn/dsh-slipway)
- **版本号**：0.1.3（[固定提交 b28316b](https://github.com/7gzgn/dsh-slipway/tree/b28316be0beca1f05126c8ef1d3166e14a9bb784)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是为每次发布生成不可变 manifest 并在远端写入批次标识，可在部分失败后精确续跑或补偿，而不依赖当前目录重算。最小故障注入在五阶段各中断 10 次，比较当前幂等与 manifest 续跑的重复提交、孤儿分支、人工判断步骤和最终字节一致率；出现错误覆盖即否定。 详见[Q08](#research-q08)。

在专用 GitHub 测试组织用无敏感数据仓库执行 dry-run、授权发布与回验，并在建仓、第三个文件、建分支、开 PR 前后断网；要求不重复 PR、不覆盖错误内容、manifest 字节一致且人工可枚举清理对象。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 150 | 122 | 13 | — |
| .js | source | 4 | 1225 | 938 | 207 | — |
| .md | source | 1 | 112 | — | — | 1217 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/7gzgn/dsh-slipway/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-slipway 在固定版本下是否以可控依赖和总成本交付其核心能力，并值得目标用户采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种重复场景需要 dsh-slipway，合格交付与简单替代是什么？

**研究主题**：场景与需求

#### 完整回答

重复发布 DSH 插件的维护者需要把建仓、逐文件上传、市场登记 PR 和线上回验串成一次可审计交付；基线是 gh/API 脚本加人工核对。合格结果是目标完全显式、敏感信息未上传、远端文件逐字节一致、PR 幂等且每个副作用可追踪。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-36](https://github.com/7gzgn/dsh-slipway/blob/b28316be0beca1f05126c8ef1d3166e14a9bb784/README.md#L11-L36)

固定版本作者材料支持 Q01 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（26行）</summary>

```text
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

## 安全边界（代码里的边界，不是口头承诺）

- **默认 dry-run**：不显式传 `dryRun: false`（CLI 是 `--go`）就只演算、只报告，**一根手指都不动远端**。
- **目标必须显式给**：`projectDir`（绝对路径）/ `repo` / `category` / `descriptionEn` / `descriptionZh` 缺一不可。
  解析不出来就**报错**，绝不从当前目录、包名或相似度去猜。
- **owner 与 token 必须对得上**：token 属于别人 —— 直接停，不做任何请求。
- **token 永不进输出**：只出现 `ghp_****(40)` 这样的掩码；请求证据里只记方法与路径，**不记 body**。
- **密钥扫描在自检里**：命中 `sk-…` / `ghp_…` / 私钥块等即**阻断发布**，且只报文件:行号与掩码，**不回显明文**。
- **幂等**：仓库、分支、PR 都先查再说；重复跑不会造出第二条。
- **活代码树警告**：工程若被 profile 的 junction 挂载（即"活代码"），报告里会出现 `live-tree` 提醒 ——
  **发布可以，测试绝对不许在那里跑**（把副本复制到沙箱再跑）。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · dsh-slipway 的入口、调用链、状态变化与副作用如何实现？

**研究主题**：功能与机制

#### 完整回答

slipway_publish 先读取 package files 白名单、检查入口和 bundle patch、扫描密钥；默认 dry-run。实跑用 GitHub contents API 建/复用仓库、逐文件 PUT、设置 topics、fork 市场库、建分支与登记 yml、开或复用 PR；slipway_verify 回拉所有发布文件比较长度与 sha256。CLI 复用同一 core。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:127-276](https://github.com/7gzgn/dsh-slipway/blob/b28316be0beca1f05126c8ef1d3166e14a9bb784/lib/index.js#L127-L276)

固定版本源码用于核对 Q02 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（150行）</summary>

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
        messagePrefix: { type: 'string', description: '逐文件提交信息的前缀（默认 Publish）' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ok: { type: 'boolean', required: true },
            data: { type: 'json' },
            error: { type: 'string' },
          },
        },
        render: (_args, value) => [{
          type: 'text',
          text: value.ok === false && value.data === undefined
            ? `slipway_publish 失败：${String(value.error ?? '未知错误')}`
            : renderPublish(value.data ?? {}),
        }],
      },
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
      parameters: {
        projectDir: { type: 'string', description: '本地工程目录的绝对路径' },
        repo: { type: 'string', description: 'GitHub 仓库名' },
        owner: { type: 'string', description: 'GitHub 账号' },
        tokenFile: { type: 'string', description: 'PAT 文件路径（可选）' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ok: { type: 'boolean', required: true },
            data: { type: 'json' },
            error: { type: 'string' },
          },
        },
        render: (_args, value) => {
          if (value.ok === false) return [{ type: 'text', text: `slipway_verify 失败：${String(value.error ?? '未知错误')}` }];
          const d = value.data ?? {};
          const lines = [`slipway_verify｜${d.ok === true ? '✅ 线上与本地逐字节一致' : '❌ 有不一致'}`];
          lines.push(`  · 目标：${d.owner}/${d.repo}`);
          lines.push(`  · 比对：${d.checked} 个文件通过`);
          for (const m of d.missing ?? []) lines.push(`  ❌ 线上缺文件：${m}`);
          for (const m of d.mismatched ?? []) lines.push(`  ❌ ${m.path}：${m.reason}`);
          return [{ type: 'text', text: lines.join('\n') }];
        },
      },
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

  if (cfg.announceToAgent !== false && ctx.systemPrompt !== undefined
    && typeof ctx.systemPrompt.section === 'function') {
    disposers.push(ctx.systemPrompt.section({
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主原生能力或简单替代，dsh-slipway 的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对零散脚本，它把发布前阻断、远端幂等和发布后字节回验放在同一事务叙事中，减少漏步骤；但没有真正原子事务，仓库上传成功而市场 PR 失败会留下部分完成状态。仅支持 GitHub contents API，不处理 npm、GitLab 或大文件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-36](https://github.com/7gzgn/dsh-slipway/blob/b28316be0beca1f05126c8ef1d3166e14a9bb784/README.md#L11-L36)

固定版本作者材料支持 Q03 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（26行）</summary>

```text
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

## 安全边界（代码里的边界，不是口头承诺）

- **默认 dry-run**：不显式传 `dryRun: false`（CLI 是 `--go`）就只演算、只报告，**一根手指都不动远端**。
- **目标必须显式给**：`projectDir`（绝对路径）/ `repo` / `category` / `descriptionEn` / `descriptionZh` 缺一不可。
  解析不出来就**报错**，绝不从当前目录、包名或相似度去猜。
- **owner 与 token 必须对得上**：token 属于别人 —— 直接停，不做任何请求。
- **token 永不进输出**：只出现 `ghp_****(40)` 这样的掩码；请求证据里只记方法与路径，**不记 body**。
- **密钥扫描在自检里**：命中 `sk-…` / `ghp_…` / 私钥块等即**阻断发布**，且只报文件:行号与掩码，**不回显明文**。
- **幂等**：仓库、分支、PR 都先查再说；重复跑不会造出第二条。
- **活代码树警告**：工程若被 profile 的 junction 挂载（即"活代码"），报告里会出现 `live-tree` 提醒 ——
  **发布可以，测试绝对不许在那里跑**（把副本复制到沙箱再跑）。
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使 dsh-slipway 的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

核心质疑是多阶段远端副作用失败后的恢复是否足够。幂等查询可减少重复仓库/PR，却不能回滚已上传文件、错误 topic 或已公开敏感内容；密钥扫描是模式启发式，不能证明无秘密。PAT repo 权限很大，错误目标参数的后果高。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:127-276](https://github.com/7gzgn/dsh-slipway/blob/b28316be0beca1f05126c8ef1d3166e14a9bb784/lib/index.js#L127-L276)

固定版本源码用于核对 Q04 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（150行）</summary>

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
        messagePrefix: { type: 'string', description: '逐文件提交信息的前缀（默认 Publish）' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ok: { type: 'boolean', required: true },
            data: { type: 'json' },
            error: { type: 'string' },
          },
        },
        render: (_args, value) => [{
          type: 'text',
          text: value.ok === false && value.data === undefined
            ? `slipway_publish 失败：${String(value.error ?? '未知错误')}`
            : renderPublish(value.data ?? {}),
        }],
      },
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
      parameters: {
        projectDir: { type: 'string', description: '本地工程目录的绝对路径' },
        repo: { type: 'string', description: 'GitHub 仓库名' },
        owner: { type: 'string', description: 'GitHub 账号' },
        tokenFile: { type: 'string', description: 'PAT 文件路径（可选）' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ok: { type: 'boolean', required: true },
            data: { type: 'json' },
            error: { type: 'string' },
          },
        },
        render: (_args, value) => {
          if (value.ok === false) return [{ type: 'text', text: `slipway_verify 失败：${String(value.error ?? '未知错误')}` }];
          const d = value.data ?? {};
          const lines = [`slipway_verify｜${d.ok === true ? '✅ 线上与本地逐字节一致' : '❌ 有不一致'}`];
          lines.push(`  · 目标：${d.owner}/${d.repo}`);
          lines.push(`  · 比对：${d.checked} 个文件通过`);
          for (const m of d.missing ?? []) lines.push(`  ❌ 线上缺文件：${m}`);
          for (const m of d.mismatched ?? []) lines.push(`  ❌ ${m.path}：${m.reason}`);
          return [{ type: 'text', text: lines.join('\n') }];
        },
      },
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

  if (cfg.announceToAgent !== false && ctx.systemPrompt !== undefined
    && typeof ctx.systemPrompt.section === 'function') {
    disposers.push(ctx.systemPrompt.section({
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-slipway 启动、持续生效与失败降级依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要 GitHub PAT 与 repo scope、可访问 GitHub API、明确 owner/repo/category/双语描述和合法 package files 清单；单文件必须 ≤25MB。市场 PR 依赖固定 registry 布局及 fork 权限；活代码树只警告发布可行，不替调用方运行测试。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-36](https://github.com/7gzgn/dsh-slipway/blob/b28316be0beca1f05126c8ef1d3166e14a9bb784/README.md#L11-L36)

固定版本作者材料支持 Q05 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（26行）</summary>

```text
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

## 安全边界（代码里的边界，不是口头承诺）

- **默认 dry-run**：不显式传 `dryRun: false`（CLI 是 `--go`）就只演算、只报告，**一根手指都不动远端**。
- **目标必须显式给**：`projectDir`（绝对路径）/ `repo` / `category` / `descriptionEn` / `descriptionZh` 缺一不可。
  解析不出来就**报错**，绝不从当前目录、包名或相似度去猜。
- **owner 与 token 必须对得上**：token 属于别人 —— 直接停，不做任何请求。
- **token 永不进输出**：只出现 `ghp_****(40)` 这样的掩码；请求证据里只记方法与路径，**不记 body**。
- **密钥扫描在自检里**：命中 `sk-…` / `ghp_…` / 私钥块等即**阻断发布**，且只报文件:行号与掩码，**不回显明文**。
- **幂等**：仓库、分支、PR 都先查再说；重复跑不会造出第二条。
- **活代码树警告**：工程若被 profile 的 junction 挂载（即"活代码"），报告里会出现 `live-tree` 提醒 ——
  **发布可以，测试绝对不许在那里跑**（把副本复制到沙箱再跑）。
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · dsh-slipway 完成一个合格任务的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

首次要准备 PAT 文件、核对五个显式参数和市场类别；每次发布消耗 GitHub API 请求、人工审 dry-run/PR 和失败后核远端状态；恢复以重新 verify、修正目标分支或人工关闭/改 PR 为单位，已经公开的错误提交无法靠本插件自动撤回。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:127-276](https://github.com/7gzgn/dsh-slipway/blob/b28316be0beca1f05126c8ef1d3166e14a9bb784/lib/index.js#L127-L276)

固定版本源码用于核对 Q06 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（150行）</summary>

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
        messagePrefix: { type: 'string', description: '逐文件提交信息的前缀（默认 Publish）' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ok: { type: 'boolean', required: true },
            data: { type: 'json' },
            error: { type: 'string' },
          },
        },
        render: (_args, value) => [{
          type: 'text',
          text: value.ok === false && value.data === undefined
            ? `slipway_publish 失败：${String(value.error ?? '未知错误')}`
            : renderPublish(value.data ?? {}),
        }],
      },
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
      parameters: {
        projectDir: { type: 'string', description: '本地工程目录的绝对路径' },
        repo: { type: 'string', description: 'GitHub 仓库名' },
        owner: { type: 'string', description: 'GitHub 账号' },
        tokenFile: { type: 'string', description: 'PAT 文件路径（可选）' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ok: { type: 'boolean', required: true },
            data: { type: 'json' },
            error: { type: 'string' },
          },
        },
        render: (_args, value) => {
          if (value.ok === false) return [{ type: 'text', text: `slipway_verify 失败：${String(value.error ?? '未知错误')}` }];
          const d = value.data ?? {};
          const lines = [`slipway_verify｜${d.ok === true ? '✅ 线上与本地逐字节一致' : '❌ 有不一致'}`];
          lines.push(`  · 目标：${d.owner}/${d.repo}`);
          lines.push(`  · 比对：${d.checked} 个文件通过`);
          for (const m of d.missing ?? []) lines.push(`  ❌ 线上缺文件：${m}`);
          for (const m of d.mismatched ?? []) lines.push(`  ❌ ${m.path}：${m.reason}`);
          return [{ type: 'text', text: lines.join('\n') }];
        },
      },
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

  if (cfg.announceToAgent !== false && ctx.systemPrompt !== undefined
    && typeof ctx.systemPrompt.section === 'function') {
    disposers.push(ctx.systemPrompt.section({
```

</details>

#### 缺口

- 五阶段部分失败后的补偿和续跑行为未在真实 GitHub 核查
  **影响**：可能留下公开仓库或孤儿分支需人工清理
  **进一步探讨**：在测试组织逐阶段断网/403，记录远端对象、重复执行结果和恢复操作数

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · dsh-slipway 的工程可靠性和可迁移设计如何？

**研究主题**：工程质量与复用

#### 完整回答

core、GitHub client、publish orchestration 和 CLI 分层，token 掩码、body 不记证据、默认 dry-run 和逐文件哈希回验值得复用。迁移到 Git Data API 或其他平台要重建权限、幂等键、大小限制与补偿逻辑，不能只替换 URL。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:127-276](https://github.com/7gzgn/dsh-slipway/blob/b28316be0beca1f05126c8ef1d3166e14a9bb784/lib/index.js#L127-L276)

固定版本源码用于核对 Q07 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（150行）</summary>

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
        messagePrefix: { type: 'string', description: '逐文件提交信息的前缀（默认 Publish）' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ok: { type: 'boolean', required: true },
            data: { type: 'json' },
            error: { type: 'string' },
          },
        },
        render: (_args, value) => [{
          type: 'text',
          text: value.ok === false && value.data === undefined
            ? `slipway_publish 失败：${String(value.error ?? '未知错误')}`
            : renderPublish(value.data ?? {}),
        }],
      },
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
      parameters: {
        projectDir: { type: 'string', description: '本地工程目录的绝对路径' },
        repo: { type: 'string', description: 'GitHub 仓库名' },
        owner: { type: 'string', description: 'GitHub 账号' },
        tokenFile: { type: 'string', description: 'PAT 文件路径（可选）' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ok: { type: 'boolean', required: true },
            data: { type: 'json' },
            error: { type: 'string' },
          },
        },
        render: (_args, value) => {
          if (value.ok === false) return [{ type: 'text', text: `slipway_verify 失败：${String(value.error ?? '未知错误')}` }];
          const d = value.data ?? {};
          const lines = [`slipway_verify｜${d.ok === true ? '✅ 线上与本地逐字节一致' : '❌ 有不一致'}`];
          lines.push(`  · 目标：${d.owner}/${d.repo}`);
          lines.push(`  · 比对：${d.checked} 个文件通过`);
          for (const m of d.missing ?? []) lines.push(`  ❌ 线上缺文件：${m}`);
          for (const m of d.mismatched ?? []) lines.push(`  ❌ ${m.path}：${m.reason}`);
          return [{ type: 'text', text: lines.join('\n') }];
        },
      },
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

  if (cfg.announceToAgent !== false && ctx.systemPrompt !== undefined
    && typeof ctx.systemPrompt.section === 'function') {
    disposers.push(ctx.systemPrompt.section({
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与限制可推导什么可证伪的新设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是为每次发布生成不可变 manifest 并在远端写入批次标识，可在部分失败后精确续跑或补偿，而不依赖当前目录重算。最小故障注入在五阶段各中断 10 次，比较当前幂等与 manifest 续跑的重复提交、孤儿分支、人工判断步骤和最终字节一致率；出现错误覆盖即否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:127-276](https://github.com/7gzgn/dsh-slipway/blob/b28316be0beca1f05126c8ef1d3166e14a9bb784/lib/index.js#L127-L276)

固定版本源码用于核对 Q08 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（150行）</summary>

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
        messagePrefix: { type: 'string', description: '逐文件提交信息的前缀（默认 Publish）' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ok: { type: 'boolean', required: true },
            data: { type: 'json' },
            error: { type: 'string' },
          },
        },
        render: (_args, value) => [{
          type: 'text',
          text: value.ok === false && value.data === undefined
            ? `slipway_publish 失败：${String(value.error ?? '未知错误')}`
            : renderPublish(value.data ?? {}),
        }],
      },
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
      parameters: {
        projectDir: { type: 'string', description: '本地工程目录的绝对路径' },
        repo: { type: 'string', description: 'GitHub 仓库名' },
        owner: { type: 'string', description: 'GitHub 账号' },
        tokenFile: { type: 'string', description: 'PAT 文件路径（可选）' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ok: { type: 'boolean', required: true },
            data: { type: 'json' },
            error: { type: 'string' },
          },
        },
        render: (_args, value) => {
          if (value.ok === false) return [{ type: 'text', text: `slipway_verify 失败：${String(value.error ?? '未知错误')}` }];
          const d = value.data ?? {};
          const lines = [`slipway_verify｜${d.ok === true ? '✅ 线上与本地逐字节一致' : '❌ 有不一致'}`];
          lines.push(`  · 目标：${d.owner}/${d.repo}`);
          lines.push(`  · 比对：${d.checked} 个文件通过`);
          for (const m of d.missing ?? []) lines.push(`  ❌ 线上缺文件：${m}`);
          for (const m of d.mismatched ?? []) lines.push(`  ❌ ${m.path}：${m.reason}`);
          return [{ type: 'text', text: lines.join('\n') }];
        },
      },
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

  if (cfg.announceToAgent !== false && ctx.systemPrompt !== undefined
    && typeof ctx.systemPrompt.section === 'function') {
    disposers.push(ctx.systemPrompt.section({
```

</details>

#### 缺口

- 五阶段部分失败后的补偿和续跑行为未在真实 GitHub 核查
  **影响**：可能留下公开仓库或孤儿分支需人工清理
  **进一步探讨**：在测试组织逐阶段断网/403，记录远端对象、重复执行结果和恢复操作数

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人应观察、试用或拒绝采用 dsh-slipway？

**研究主题**：采用判断

#### 完整回答

有固定 GitHub 发布流程的插件维护者可先在测试组织以 dry-run 和只读 verify 试用；真实 publish 必须由人核对 owner/repo、文件清单、secret 扫描与市场描述后单独授权。含大文件、需要 npm/GitLab、无法轮换 PAT 或不能接受部分远端状态的项目不适合。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-36](https://github.com/7gzgn/dsh-slipway/blob/b28316be0beca1f05126c8ef1d3166e14a9bb784/README.md#L11-L36)

固定版本作者材料支持 Q09 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（26行）</summary>

```text
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

## 安全边界（代码里的边界，不是口头承诺）

- **默认 dry-run**：不显式传 `dryRun: false`（CLI 是 `--go`）就只演算、只报告，**一根手指都不动远端**。
- **目标必须显式给**：`projectDir`（绝对路径）/ `repo` / `category` / `descriptionEn` / `descriptionZh` 缺一不可。
  解析不出来就**报错**，绝不从当前目录、包名或相似度去猜。
- **owner 与 token 必须对得上**：token 属于别人 —— 直接停，不做任何请求。
- **token 永不进输出**：只出现 `ghp_****(40)` 这样的掩码；请求证据里只记方法与路径，**不记 body**。
- **密钥扫描在自检里**：命中 `sk-…` / `ghp_…` / 私钥块等即**阻断发布**，且只报文件:行号与掩码，**不回显明文**。
- **幂等**：仓库、分支、PR 都先查再说；重复跑不会造出第二条。
- **活代码树警告**：工程若被 profile 的 junction 挂载（即"活代码"），报告里会出现 `live-tree` 提醒 ——
  **发布可以，测试绝对不许在那里跑**（把副本复制到沙箱再跑）。
```

</details>

#### 缺口

- 五阶段部分失败后的补偿和续跑行为未在真实 GitHub 核查
  **影响**：可能留下公开仓库或孤儿分支需人工清理
  **进一步探讨**：在测试组织逐阶段断网/403，记录远端对象、重复执行结果和恢复操作数

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
