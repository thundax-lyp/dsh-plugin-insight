# SpecFusion

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[54ff77a](https://github.com/wxkingstar/SpecFusion/tree/54ff77ae5411f1a566df8e1be12ebbebf377bfcc)

<!-- BEGIN META -->
[![GitHub ★ 76](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=76&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wxkingstar/SpecFusion)
<!-- END META -->

> **功能**：聚合中文开放平台 API 文档，提供跨源搜索、全文与摘要读取，并附带 Agent Skill 和 DSH 接入。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)把中文/API标识分词、平台与模式过滤、摘要到全文的查询入口组合起来，减少跨站组织资料的步骤。它不证明文档覆盖完整、始终最新或生成代码正确。

> **主要限制**：[Q03](#research-q03)发现last_updated可回退为入库时间，关键词只重排最多200候选而响应仍写共N条；未指定模式的去重键不含来源。自部署默认管理令牌和全接口监听还需显式配置，托管服务配置不能据此推断。

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
  - [Q01 · 谁用它解决什么文档查找任务，相比厂商站搜索有什么增量？](#detail-section-11)
  - [Q02 · 查询、文档读取与摘要链路如何接线？](#detail-section-12)
  - [Q03 · 来源时效、错误和权限如何改变答案可信度？](#detail-section-13)
  - [Q04 · 使用者与维护者成本分别是什么，何时停止？](#detail-section-14)
  - [Q05 · 能否让检索结果带版本时点与缺页状态以减少陈旧引用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向反复对接中文开放平台的开发者，按平台、开发模式与关键词查接口并回读原文，见[Q01](#research-q01)。

对照厂商站点逐个搜索和手工复制原页；FTS5、jieba和HTTP是继承基础，贡献限定在跨源组织和原文交接组合。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 跨源搜索 | 按关键词、路径、错误码找文档 | 平台模式与有限候选影响结果，不是完整命中计数 |
| 全文读取 | 查参数、权限与原文入口 | 库内文本时效仍须核厂商原页 |
| 规则摘要 | 快速定位接口与部分示例 | 首表最多10行，不能替代完整契约 |
| 来源、分类和最近更新 | 发现可查范围及本地变化 | 库内日期不保证厂商修订日 |
| 文档同步 | 抓取并增量写库 | 各源访问、Cookie和页面变化需维护 |
| DSH子适配 | 注册Skill和五工具 | 根工具项目与可安装子包分开 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 可访问文档API | 使用端必需 | 搜索、全文和来源列表 | 失败回官方站，托管SLA未知 |
| DSH skills/tools | DSH子适配必需 | 注册Skill及五个只读工具 | root本身不是可安装bundle |
| Node、SQLite、nodejieba及数据库 | 自部署必需 | 分词和全文索引 | 原生依赖和数据体积需维护 |
| 来源访问权限、部分浏览器桥接/Cookie | 相应抓取源必需 | 取得文档并同步 | 缺页不能补写为完整覆盖 |
| 显式ADMIN_TOKEN与受控暴露 | 自部署必须确认 | 防止管理写入越权 | 默认开发token不能对外使用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 使用者选择公开已知问题和平台模式 | 不含私有查询或凭据 |
| 接入 | 加载Skill或DSH子适配，确认API端点 | 读失败回官方站 |
| 查询 | 搜索后读取全文和厂商原页 | 必填字段、权限、时点一致 |
| 验收 | 对照已知答案并记录用量 | 摘要缺项或来源不符就停止使用结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 托管或自建服务、网络，金额未知 | 配置端点、验证来源与公开范围 | 不称零配置等于零成本 |
| 持续使用 | 请求与模型上下文；自建索引存储 | 官方原页复核和抓取维护 | 费用、正确率、净节时未测 |
| 失败恢复与退出 | 重试和备份资源未知 | 排查缺页、限流、Cookie和服务 | 可停子适配回厂商站，自建另停服务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一查询 | 分流、过滤和Markdown结果 | 当前在线召回与排名质量 |
| 摘要读取 | 规则提取及全文退路 | 关键参数是否完整正确 |
| 可追溯来源 | source_url和更新字段可见 | 日期是否上游修订、抓取完整性和真实时效 |

> **思考**：[Q03](#research-q03)发现last_updated可回退为入库时间，关键词只重排最多200候选而响应仍写共N条；未指定模式的去重键不含来源。自部署默认管理令牌和全接口监听还需显式配置，托管服务配置不能据此推断。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)把中文/API标识分词、平台与模式过滤、摘要到全文的查询入口组合起来，减少跨站组织资料的步骤。它不证明文档覆盖完整、始终最新或生成代码正确。

[Q02](#research-q02)分词一致性、API标识保护和摘要到全文退路值得借鉴；[Q03](#research-q03)显示候选截断、时间语义和默认管理凭据必须进入接口契约。只读调用仍会外发并记录查询，不能当本地隐私保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)发现last_updated可回退为入库时间，关键词只重排最多200候选而响应仍写共N条；未指定模式的去重键不含来源。自部署默认管理令牌和全接口监听还需显式配置，托管服务配置不能据此推断。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)以公开已知问题小范围试用，指定平台和模式，全文对照厂商原页后再写代码；错误来源、陈旧字段或服务失败时退回官方站，管理令牌未核不对外自建。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

检索、规则摘要与DSH子适配接线有固定源码支持；在线库存、时效和任务效果未验证。公开非敏感文档任务可有试用，自部署先核管理令牌和公开读范围；证据状态协议仍为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、api/src/index.ts、api/src/routes/search.ts、api/src/routes/doc.ts、api/src/routes/admin.ts、api/src/services/search-engine.ts、api/src/services/doc-store.ts、api/src/services/summarizer.ts、api/src/services/tokenizer.ts、scrapers/src/sync.ts、scrapers/src/utils/cookies.ts、dsh-plugin/lib/index.js、dsh-plugin/lib/client.js、dsh-plugin/lib/tools.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定root工具项目；检查API入口、search/doc/admin路由、索引入库和排序、规则摘要、同步代表流程、Cookie工具及DSH子适配。未全审20源抓取器、在线数据库和公网配置，不运行目标代码。
- 下一步：后续用固定公开查询集对照官方原页，覆盖同名跨源、模式、更新日、缺页与>200候选，并记录全部复核和用量；本轮未执行。

**分析版本**

- **仓库**：[wxkingstar/SpecFusion](https://github.com/wxkingstar/SpecFusion)
- **版本号**：0.1.0（[固定提交 54ff77a](https://github.com/wxkingstar/SpecFusion/tree/54ff77ae5411f1a566df8e1be12ebbebf377bfcc)）
- **版本日期**：2026-09-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的上游日期、抓取时间、内容hash和覆盖缺口分离协议；相对已有来源链接增量在减少“最新/全部”的误述，以预置缺页和截断查询对照，负担更大或错误不降则否定。

后续用固定公开查询集对照官方原页，覆盖同名跨源、模式、更新日、缺页与>200候选，并记录全部复核和用量；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 2615 | — | — | 25293 |
| .ts | source | 46 | 15130 | 10817 | 2371 | — |
| .ts | test | 5 | 370 | 283 | 36 | — |
| .js | source | 4 | 395 | 257 | 119 | — |
| .mjs | source | 3 | 481 | 324 | 95 | — |
| .mts | source | 2 | 112 | 84 | 20 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/wxkingstar/SpecFusion/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/wxkingstar/SpecFusion/issues?q=is%3Aissue+created%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/wxkingstar/SpecFusion/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：中文厂商文档如何从抓取变成可追溯检索上下文，时效和部署边界如何影响使用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁用它解决什么文档查找任务，相比厂商站搜索有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

SpecFusion根仓是文档抓取、SQLite全文索引、Markdown API和多Agent接入材料组成的工具项目；根package为private工作区，原生DSH插件在dsh-plugin子目录。研究当前root不能把整仓一律称为可直接安装的DSH插件。目标用户是在对接多个中文开放平台时反复寻找接口路径、参数与错误码的开发者，合格结果是找到匹配平台和开发模式的原文，核对必要参数后再写代码，而不是模型流畅复述一个搜索摘要。

原办法是在不同厂商站点切换搜索或手工复制页面；本项目把跨平台内容转为可过滤的统一检索入口，按API路径、错误码或关键词选择查询路径，并提供全文、分类和最近更新入口。DSH子适配注册一个运行时Skill和五个只读查询工具，避免模型自己拼curl，但抓取、索引与服务可用性来自根系统。jieba、SQLite FTS5和HTTP封装是已有基础，本项目增量在中文API标识保护、源模式过滤和统一原文交接的组合。README中67,000+篇及20平台是作者库存声明，不是本轮数据库实数或覆盖完整性实证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-19](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/package.json#L1-L19)

private根工作区包含api和scrapers，不是根bundle。

<details>
<summary>查看原文（19行）</summary>

```text
{
  "name": "specfusion",
  "version": "0.1.0",
  "private": true,
  "description": "多源 API 文档融合搜索 Skill — 云端检索，零安装，即问即答",
  "workspaces": [
    "api",
    "scrapers"
  ],
  "scripts": {
    "build": "npm run build --workspaces",
    "dev": "npm run dev --workspace=api",
    "sync": "npm run sync --workspace=scrapers",
    "deploy": "bash scripts/deploy.sh",
    "test": "npm run test --workspaces --if-present && node --import tsx --test tests/*.test.ts"
  },
  "engines": {
    "node": ">=20.18.0"
  },
```

</details>

**依据 2 · 作者声明**：[README.md:23-28](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/README.md#L23-L28)

作者描述跨平台检索、分词、库存与托管使用。

```text
## 为什么用 SpecFusion

- **不离开终端** — 写代码时直接问，Claude 帮你查文档、给出接口参数和示例
- **中文搜索准确** — jieba 分词 + FTS5 全文索引，`发送应用消息`、`access_token`、`40001` 都能搜到
- **67,000+ 篇文档** — 企业微信 ~2,800 篇 + 飞书 ~4,280 篇 + 钉钉 ~3,610 篇 + 淘宝 ~7,020 篇 + 小红书 ~110 篇 + 抖音电商 ~1,440 篇 + 微信小程序 ~470 篇 + 微信小店 ~490 篇 + 拼多多 ~290 篇 + 有赞 ~1,250 篇 + 微信支付 ~560 篇 + 支付宝 ~600 篇 + 京东 ~5,450 篇 + SHEIN ~260 篇 + 得物 ~270 篇 + 火山引擎ECS ~121 篇 + 火山引擎 ~35,170 篇 + 阿里云百炼 ~1,880 篇 + 泛微 ~560 篇 + 北森 ~1,090 篇，接口参数、错误码、事件订阅全覆盖
- **零配置** — 云端服务已部署好，安装 Skill 后即可使用，无需自建后端
```

**依据 3 · 源码核查**：[dsh-plugin/lib/index.js:37-44](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/dsh-plugin/lib/index.js#L37-L44)

子适配实际注册Skill和工具。

```text
 */
export function apply(ctx, config = {}) {
  const baseUrl =
    config.baseUrl || process.env[BASE_URL_ENV] || DEFAULT_BASE_URL;
  const client = createClient(baseUrl);

  ctx.skills.register(SPECFUSION_SKILL);
  registerTools(ctx, client);
```

**依据 4 · 源码核查**：[dsh-plugin/lib/tools.js:32-94](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/dsh-plugin/lib/tools.js#L32-L94)

检索和全文工具的入口、参数与调用。

<details>
<summary>查看原文（63行）</summary>

```text

  disposers.push(
    ctx.tools.register(
      defineTool({
        name: "specfusion_search",
        description:
          "搜索 SpecFusion 收录的 20 个中国开放平台 API 开发文档。支持接口名、API 路径、错误码、功能概念搜索，返回 Markdown 结果列表（含标题、路径、摘要、文档 ID）。",
        parameters: {
          q: {
            type: "string",
            required: true,
            description:
              "搜索关键词：接口名（发送应用消息）、API 路径（/cgi-bin/message/send）、错误码（60011、40001）、功能概念（客户联系、会话存档）",
          },
          source: { type: "string", description: `文档来源过滤：${SOURCE_HINT}` },
          mode: {
            type: "string",
            description:
              "开发模式过滤（仅企业微信）：internal（自建应用）/ third_party（第三方应用）/ service_provider（服务商代开发）",
          },
          limit: {
            type: "integer",
            description: "返回数量，默认 5，最大 20",
          },
        },
        output: markdownOutput(),
        isConcurrencySafe: () => true,
        async execute(args, exec) {
          return client.get(
            "/search",
            { q: args.q, source: args.source, mode: args.mode, limit: args.limit },
            exec.signal,
          );
        },
      }),
    ),
  );

  disposers.push(
    ctx.tools.register(
      defineTool({
        name: "specfusion_doc",
        description:
          "获取 SpecFusion 收录的某篇 API 文档全文，或用 summary=true 获取结构化摘要（约 1-2KB：接口名/路径/参数表/示例）。",
        parameters: {
          doc_id: {
            type: "string",
            required: true,
            description: "文档 ID（来自 specfusion_search 结果中的「文档ID」字段）",
          },
          summary: {
            type: "boolean",
            description: "为 true 时返回结构化摘要；省略或 false 返回全文",
          },
        },
        output: markdownOutput(),
        isConcurrencySafe: () => true,
        async execute(args, exec) {
          const params = args.summary ? { summary: true } : {};
          return client.get(`/doc/${encodeURIComponent(args.doc_id)}`, params, exec.signal);
        },
      }),
    ),
```

</details>

**依据 5 · 源码核查**：[api/src/services/search-engine.ts:216-222](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/services/search-engine.ts#L216-L222)

查询按类型分流。

```text
  const queryType = detectQueryType(trimmedQuery);
  let scoredRows: ScoredRow[] = [];

  // ----- 错误码搜索 -----
  if (queryType === 'error_code') {
    const codeStr = trimmedQuery.replace(/^errcode\s*/i, '').trim();
    const ec = findErrorCode(codeStr);
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 查询、文档读取与摘要链路如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DSH客户端将工具参数编码成GET请求，转发宿主取消信号，非2xx转换为带状态的可读错误；它返回服务Markdown，不验证内容真伪，也没有自身截止时间，依赖传入signal或网络栈。搜索路由校验q、限制返回条数并交给search。关键词查询用与索引约定一致的分词，保护API路径、标识符和错误码；FTS以AND匹配，但先截取200个候选再在内存计算分数、排序和去重，结果不是对整个命中集全局重排。API路径和错误码另有查询路径，不能用关键词路径概括所有排名。

全文路由按doc ID读库，未找到返回404；成功时添加source、path、source_url和last_updated元信息。摘要不是模型生成，而是规则提取标题、描述、接口、第一个表格最多10行、最多两个JSON示例，并提示读取全文。它可能将第一个表格标成请求参数，因此不能把摘要结构看作完整且语义校验过的接口契约。原文链接和全文入口是核对关键参数的退路。

服务公开注册search/doc等读路由，管理写入另有Bearer校验；实际index.ts挂全局60/min限速且豁免admin路由，middleware/rate-limit.ts里独立声明的其他配额没有成为这里的运行配置。工程亮点是API和抓取端采用一致分词约定、直出Markdown且保留原文入口；同步SQLite调用和有限候选则是吞吐与排序的明确取舍。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/lib/client.js:34-70](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/dsh-plugin/lib/client.js#L34-L70)

参数编码、取消和非2xx错误，不做结果验证。

<details>
<summary>查看原文（37行）</summary>

```text
    async get(path, params = {}, signal) {
      const url = new URL(base + path);
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === "") continue;
        url.searchParams.set(key, String(value));
      }

      let response;
      try {
        response = await fetch(url, {
          signal,
          headers: {
            accept: "text/markdown, text/plain;q=0.9, */*;q=0.8",
            "user-agent": USER_AGENT,
          },
        });
      } catch (error) {
        if (signal?.aborted) {
          throw new Error(`specfusion: 请求已取消 (${url.pathname})`);
        }
        throw new Error(`specfusion: 请求失败 ${url.pathname}: ${errorMessage(error)}`);
      }

      if (!response.ok) {
        let detail = "";
        try {
          detail = (await response.text()).slice(0, 200);
        } catch {
          // 读取失败时保留空 detail。
        }
        throw new Error(
          `specfusion: HTTP ${response.status} for ${url.pathname}` +
            (detail ? `: ${detail}` : ""),
        );
      }

      return await response.text();
```

</details>

**依据 2 · 源码核查**：[api/src/routes/search.ts:5-29](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/routes/search.ts#L5-L29)

搜索输入、条数与Markdown输出接线。

<details>
<summary>查看原文（25行）</summary>

```text
  fastify.get('/search', async (request, reply) => {
    const { q, source, mode, limit } = request.query as {
      q?: string;
      source?: string;
      mode?: string;
      limit?: string;
    };

    if (!q) {
      reply.code(400).type('text/markdown; charset=utf-8');
      return '## 参数错误\n\n`q` 参数为必填项。';
    }

    const limitNum = Math.min(Math.max(parseInt(limit || '5', 10), 1), 20);

    const { results, totalCount, tookMs } = search({
      query: q,
      source: source || undefined,
      mode: mode || undefined,
      limit: limitNum,
    });

    const markdown = formatSearchResults(q, results, source, totalCount, tookMs);

    reply.type('text/markdown; charset=utf-8');
```

</details>

**依据 3 · 源码核查**：[api/src/services/tokenizer.ts:14-19](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/services/tokenizer.ts#L14-L19)

保护API路径、英文标识符和错误码。

```text
// 需要保护的 pattern（按优先级排列）：
// 1. URL（http(s)://...）
// 2. API 路径（/cgi-bin/message/send）
// 3. 英文标识符含 scope（contact:user.base:readonly, access_token, webhook）
// 4. 纯数字序列（错误码如 40001）
const PROTECTED_RE = /https?:\/\/[^\s]+|\/[a-zA-Z0-9_\-/.]+(?:\/[a-zA-Z0-9_\-/.]+)+|[a-zA-Z][a-zA-Z0-9_]*(?::[a-zA-Z0-9_.]+)*|\d+/g;
```

**依据 4 · 源码核查**：[api/src/services/search-engine.ts:281-329](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/services/search-engine.ts#L281-L329)

一致分词、AND查询及先LIMIT200候选的事实。

<details>
<summary>查看原文（49行）</summary>

```text
  // ----- 关键词搜索 (FTS5) -----
  else {
    // 查询端必须与索引端（scrapers 写入 tokenized_* 时）用同一种切分：
    // 下面拼出的 MATCH 表达式里空格是隐式 AND，一旦查询切出索引里不存在的
    // 子词（如 cutForSearch 把「自定义」切成「自定 定义 自定义」），整个 AND
    // 必然落空，返回 0 条。
    const tokenized = tokenize(trimmedQuery);
    const tokens = tokenized.split(/\s+/).filter(Boolean);

    if (tokens.length === 0) {
      const tookMs = Date.now() - startTime;
      logSearch(trimmedQuery, source, 0, undefined, tookMs);
      return { results: [], totalCount: 0, tookMs };
    }

    // FTS5 MATCH 语法：空格分隔 = 隐式 AND
    const matchExpr = tokens.join(' ');

    let whereExtra = '';
    const extraParams: unknown[] = [];
    if (source) {
      whereExtra += ' AND d.source_id = ?';
      extraParams.push(source);
    }
    if (mode) {
      whereExtra += ' AND d.dev_mode = ?';
      extraParams.push(mode);
    }

    try {
      const rows = db
        .prepare(
          // 这里不能加 ORDER BY bm25，也不能另跑一次精确计数：两者都要枚举
          // 全部命中行。生产 Pod 只有 512Mi 内存、数据库 1.9GB 在 PVC 网络
          // 存储上，page cache 装不下工作集，命中 3 万条的查询实测要 12s，
          // 而 better-sqlite3 是同步的，会把事件循环连同健康探针一起堵死。
          // 代价是候选集只是 rowid 最小的 200 条，排序质量和「共 N 条」都受限。
          `SELECT d.*, bm25(documents_fts) as fts_rank
           FROM documents_fts f
           JOIN documents d ON d.rowid = f.rowid
           WHERE documents_fts MATCH ?${whereExtra}
           LIMIT 200`,
        )
        .all(matchExpr, ...extraParams) as (Document & { fts_rank: number })[];

      for (const row of rows) {
        const { fts_rank, ...doc } = row;
        const score = computeScore(doc as Document, trimmedQuery, tokens, fts_rank);
        scoredRows.push({ doc: doc as Document, fts_rank, score });
```

</details>

**依据 5 · 源码核查**：[api/src/services/search-engine.ts:361-409](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/services/search-engine.ts#L361-L409)

内存排序、模式去重和构造出处字段。

<details>
<summary>查看原文（49行）</summary>

```text
  // ----- 排序 & 去重 & 截取 -----
  scoredRows.sort((a, b) => b.score - a.score);

  // 未指定 mode 时按 title+api_path 去重，保留得分最高的，其余 mode 合并
  const otherModesMap = new Map<number, string[]>();
  if (!mode) {
    const seen = new Map<string, { idx: number; modes: string[] }>();
    const deduped: ScoredRow[] = [];
    for (const sr of scoredRows) {
      const key = `${sr.doc.title}\0${sr.doc.api_path ?? ''}`;
      const existing = seen.get(key);
      if (existing) {
        if (sr.doc.dev_mode) existing.modes.push(sr.doc.dev_mode);
      } else {
        const entry = { idx: deduped.length, modes: [] as string[] };
        seen.set(key, entry);
        deduped.push(sr);
      }
    }
    scoredRows = deduped;
    // 记录每个位置的 other_modes（去重，排除与主文档相同的 mode）
    for (const entry of seen.values()) {
      const mainMode = deduped[entry.idx]?.doc.dev_mode;
      const unique = [...new Set(entry.modes)].filter(m => m !== mainMode);
      if (unique.length > 0) {
        otherModesMap.set(entry.idx, unique);
      }
    }
  }

  // 候选集封顶 200 条，所以命中很多时这个数字是下限而不是真实总数，
  // 详见上面 FTS 查询处的注释
  const totalCount = scoredRows.length;
  scoredRows = scoredRows.slice(0, limit);

  // ----- 构造 SearchResult -----
  const results: SearchResult[] = scoredRows.map(({ doc, score }, idx) => ({
    id: doc.id,
    source_id: doc.source_id,
    title: doc.title,
    path: doc.path,
    api_path: doc.api_path,
    dev_mode: doc.dev_mode,
    other_modes: otherModesMap.get(idx),
    doc_type: doc.doc_type,
    source_url: doc.source_url,
    last_updated: doc.last_updated,
    snippet: generateSnippet(doc.content, trimmedQuery),
    score: Math.round(score * 100) / 100,
```

</details>

**依据 6 · 源码核查**：[api/src/routes/doc.ts:5-34](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/routes/doc.ts#L5-L34)

全文和摘要分支以及来源元信息。

<details>
<summary>查看原文（30行）</summary>

```text
export async function docRoutes(fastify: FastifyInstance) {
  fastify.get('/doc/:docId', async (request, reply) => {
    const { docId } = request.params as { docId: string };
    const { summary } = request.query as { summary?: string };

    const doc = getDocument(docId);

    if (!doc) {
      reply.code(404).type('text/markdown; charset=utf-8');
      return `## 文档未找到\n\n文档 ID \`${docId}\` 不存在。`;
    }

    reply.type('text/markdown; charset=utf-8');

    if (summary === 'true') {
      return generateSummary(doc.content, doc.id, doc.source_id, doc.title, doc.api_path);
    }

    // 在全文前添加元信息注释
    const header = [
      `<!-- source: ${doc.source_id} | path: ${doc.path} -->`,
      doc.source_url ? `<!-- source_url: ${doc.source_url} -->` : null,
      doc.last_updated ? `<!-- last_updated: ${doc.last_updated} -->` : null,
      '',
    ]
      .filter(Boolean)
      .join('\n');

    return header + doc.content;
  });
```

</details>

**依据 7 · 源码核查**：[api/src/services/summarizer.ts:79-106](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/services/summarizer.ts#L79-L106)

规则提取表格和示例，提示取全文。

<details>
<summary>查看原文（28行）</summary>

````text
  // 5. 提取第一个参数表格（最多 10 行）
  const table = extractFirstTable(lines, 10);
  if (table) {
    parts.push('## 请求参数');
    parts.push('');
    parts.push(table);
    parts.push('');
  }

  // 6. 提取 JSON 代码块示例（最多 2 个，每个截断到 500 字符）
  const jsonExamples = extractJsonExamples(lines);
  if (jsonExamples.length > 0) {
    parts.push('## 示例');
    parts.push('');
    for (const ex of jsonExamples) {
      if (ex.label) {
        parts.push(`**${ex.label}**`);
        parts.push('');
      }
      parts.push('```json');
      parts.push(ex.code);
      parts.push('```');
      parts.push('');
    }
  }

  // 7. 添加获取全文提示
  parts.push(`*（完整参数和代码示例请获取全文：\`/doc/${docId}\`）*`);
````

</details>

**依据 8 · 源码核查**：[api/src/index.ts:27-48](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/index.ts#L27-L48)

真正挂载的CORS、限速和各路由。

<details>
<summary>查看原文（22行）</summary>

```text

  await fastify.register(cors, { origin: true });
  await fastify.register(rateLimit, {
    max: 60,
    timeWindow: '1 minute',
    allowList: (req: { url?: string }) => {
      // admin 路由豁免限速 — 避免 bulk sync 时被 60/min 限制
      return req.url?.startsWith('/api/admin/') ?? false;
    },
  });

  const db = initDatabase(DB_PATH);

  fastify.decorate('db', db);

  await fastify.register(searchRoutes, { prefix: '/api' });
  await fastify.register(docRoutes, { prefix: '/api' });
  await fastify.register(sourcesRoutes, { prefix: '/api' });
  await fastify.register(adminRoutes, { prefix: '/api' });
  await fastify.register(healthRoutes, { prefix: '/api' });
  await fastify.register(categoriesRoutes, { prefix: '/api' });
  await fastify.register(recentRoutes, { prefix: '/api' });
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 来源时效、错误和权限如何改变答案可信度？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

有出处不等于最新。doc-store在输入没有last_updated时以当前写入时间代填；如果正文hash未变化直接返回unchanged，不更新其他字段。因而last_updated可能是本地入库时间，不应被模型解释为厂商正式修订日，metadata或URL变化也不一定在同内容路径中被更新。关键词候选上限200，响应仍写“共N条”，这个数量受截断和去重影响，不是完整命中总数；未指定mode时去重键只有title和api_path，不含source，存在不同平台同名同路径候选被合并的机制风险，是否在当前在线库实际发生未知。

抓取sync按全量或最近7天增量线索取目录，支持offset、filter、limit与skipExisting，逐项失败计数并继续。收到0篇不证明来源已清空或全部最新；本轮没有核查每个厂商抓取器与实际站点，所以不能以README数量支持全量覆盖。维护者需要处理页面变化、部分来源的浏览器桥接和Cookie，Cookie工具以JSON读写，不应把这些文件当无敏感配置。

自部署更直接的边界是API监听0.0.0.0，admin token在未配置时使用固定开发默认值，实际admin路由校验正是这一值。默认启动后如果端口可达，知道默认值的请求具备写库入口；这是条件性源码判断，不是对当前公共服务配置或已发生入侵的指控。公开读API也不适合直接放入私有文档，搜索日志会保存query。读客户端使用托管服务会把查询词送到外部服务；因此隐私内容应采用明确受控的部署，而非把“只读工具”理解为数据不出机。

#### 证据与依据

**依据 1 · 源码核查**：[api/src/services/doc-store.ts:63-110](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/services/doc-store.ts#L63-L110)

内容hash去重和last_updated回退当前入库时间。

<details>
<summary>查看原文（48行）</summary>

```text
export function upsertDocument(
  doc: UpsertDocInput,
): { doc_id: string; action: 'created' | 'updated' | 'unchanged' } {
  const d = getDb();
  const docId = makeDocId(doc.source_id, doc.path);
  const contentHash = sha256(doc.content);
  const ts = now();
  const metadata = doc.metadata ? JSON.stringify(doc.metadata) : null;
  const pathDepth = doc.path.split('/').filter(Boolean).length || 1;

  const existing = d
    .prepare('SELECT content_hash FROM documents WHERE id = ?')
    .get(docId) as { content_hash: string } | undefined;

  if (existing) {
    if (existing.content_hash === contentHash) {
      return { doc_id: docId, action: 'unchanged' };
    }
    d.prepare(
      `UPDATE documents SET
        title = ?, content = ?, content_hash = ?, prev_content_hash = ?,
        api_path = ?, dev_mode = ?, doc_type = ?, source_url = ?,
        metadata = ?, tokenized_title = ?, tokenized_content = ?,
        last_updated = ?, synced_at = ?, path_depth = ?
      WHERE id = ?`,
    ).run(
      doc.title, doc.content, contentHash, existing.content_hash,
      doc.api_path ?? null, doc.dev_mode ?? null, doc.doc_type ?? 'api_reference',
      doc.source_url ?? null, metadata,
      doc.tokenized_title ?? null, doc.tokenized_content ?? null,
      doc.last_updated ?? ts, ts, pathDepth,
      docId,
    );
    return { doc_id: docId, action: 'updated' };
  }

  d.prepare(
    `INSERT INTO documents (
      id, source_id, path, path_depth, title, api_path, dev_mode, doc_type,
      content, content_hash, prev_content_hash, source_url, metadata,
      tokenized_title, tokenized_content, last_updated, synced_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?)`,
  ).run(
    docId, doc.source_id, doc.path, pathDepth, doc.title,
    doc.api_path ?? null, doc.dev_mode ?? null, doc.doc_type ?? 'api_reference',
    doc.content, contentHash, doc.source_url ?? null, metadata,
    doc.tokenized_title ?? null, doc.tokenized_content ?? null,
    doc.last_updated ?? ts, ts,
```

</details>

**依据 2 · 源码核查**：[api/src/services/search-engine.ts:364-394](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/services/search-engine.ts#L364-L394)

去重键不含source、totalCount为截取候选去重后的长度。

<details>
<summary>查看原文（31行）</summary>

```text
  // 未指定 mode 时按 title+api_path 去重，保留得分最高的，其余 mode 合并
  const otherModesMap = new Map<number, string[]>();
  if (!mode) {
    const seen = new Map<string, { idx: number; modes: string[] }>();
    const deduped: ScoredRow[] = [];
    for (const sr of scoredRows) {
      const key = `${sr.doc.title}\0${sr.doc.api_path ?? ''}`;
      const existing = seen.get(key);
      if (existing) {
        if (sr.doc.dev_mode) existing.modes.push(sr.doc.dev_mode);
      } else {
        const entry = { idx: deduped.length, modes: [] as string[] };
        seen.set(key, entry);
        deduped.push(sr);
      }
    }
    scoredRows = deduped;
    // 记录每个位置的 other_modes（去重，排除与主文档相同的 mode）
    for (const entry of seen.values()) {
      const mainMode = deduped[entry.idx]?.doc.dev_mode;
      const unique = [...new Set(entry.modes)].filter(m => m !== mainMode);
      if (unique.length > 0) {
        otherModesMap.set(entry.idx, unique);
      }
    }
  }

  // 候选集封顶 200 条，所以命中很多时这个数字是下限而不是真实总数，
  // 详见上面 FTS 查询处的注释
  const totalCount = scoredRows.length;
  scoredRows = scoredRows.slice(0, limit);
```

</details>

**依据 3 · 源码核查**：[api/src/services/search-engine.ts:454-475](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/services/search-engine.ts#L454-L475)

输出共N条及更新字段，读者可能误读为完整性和上游日期。

<details>
<summary>查看原文（22行）</summary>

```text
  const lines: string[] = [
    `## 搜索结果：${query}（来源：${sourceLabel}，共 ${totalCount} 条，耗时 ${tookMs}ms）`,
    '',
  ];

  results.forEach((r, i) => {
    lines.push(`### ${i + 1}. ${r.title} [score: ${r.score}]`);
    const modeLabel = r.dev_mode ?? '-';
    const modeExtra = r.other_modes?.length ? `（另见：${r.other_modes.join(', ')}）` : '';
    lines.push(
      `- 来源：${sourceName(r.source_id)} | 模式：${modeLabel}${modeExtra} | 路径：${r.path}`,
    );
    if (r.api_path) {
      lines.push(`- 接口：\`${r.api_path}\``);
    }
    lines.push(`- 摘要：${r.snippet}...`);
    lines.push(`- 文档ID：${r.id}`);
    if (r.source_url) {
      lines.push(`- 原文：${r.source_url}`);
    }
    if (r.last_updated) {
      lines.push(`- 更新：${r.last_updated}`);
```

</details>

**依据 4 · 源码核查**：[scrapers/src/sync.ts:240-281](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/scrapers/src/sync.ts#L240-L281)

同步的增量、过滤、条数和跳过选项。

<details>
<summary>查看原文（42行）</summary>

```text
  // 1. 获取文档目录
  let entries: DocEntry[];
  if (options.incremental) {
    console.log('[sync] 增量模式：检测变更...');
    const since = new Date(Date.now() - 7 * 24 * 3600_000); // 默认 7 天
    entries = await source.detectUpdates(since);
  } else {
    console.log('[sync] 全量模式：获取完整目录...');
    entries = await source.fetchCatalog();
  }

  const offset = options.offset || 0;
  if (offset > 0) {
    console.log(`[sync] 跳过前 ${offset} 篇`);
  }
  // 始终 slice 以释放原始大数组引用
  entries = entries.slice(offset);

  if (options.filter) {
    const keyword = options.filter.toLowerCase();
    const before = entries.length;
    entries = entries.filter(
      (e) => e.path.toLowerCase().includes(keyword) || e.title.toLowerCase().includes(keyword),
    );
    console.log(`[sync] 过滤 "${options.filter}": ${before} → ${entries.length} 篇`);
  }

  if (limit && limit > 0) {
    entries = entries.slice(0, limit);
    console.log(`[sync] 限制处理数量: ${limit}`);
  }

  // 跳过已存在的文档
  if (options.skipExisting) {
    try {
      const resp = await client.get(`/admin/source-paths/${sourceId}`);
      const existingPaths = new Set<string>(resp.data as string[]);
      const before = entries.length;
      entries = entries.filter((e) => !existingPaths.has(e.path));
      console.log(`[sync] 跳过已存在文档: ${before - entries.length} 篇, 剩余 ${entries.length} 篇`);
    } catch {
      console.warn('[sync] 无法获取已有文档列表，将处理全部文档');
```

</details>

**依据 5 · 源码核查**：[scrapers/src/sync.ts:306-332](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/scrapers/src/sync.ts#L306-L332)

抓取失败逐项记录并继续。

<details>
<summary>查看原文（27行）</summary>

```text
  const processEntry = async (entry: DocEntry) => {
    try {
      const content: DocContent = await source.fetchContent(entry);

      const doc: PendingDoc = {
        path: entry.path,
        title: entry.title,
        content: content.markdown,
        api_path: content.apiPath || entry.apiPath,
        dev_mode: entry.devMode,
        doc_type: entry.docType,
        source_url: entry.sourceUrl,
        metadata: content.metadata,
        last_updated: entry.lastUpdated,
        error_codes: content.errorCodes,
      };

      pendingDocs.push(doc);

      // 达到批次大小时推送
      if (pendingDocs.length >= BATCH_SIZE) {
        await flushPending();
      }
    } catch (error: unknown) {
      result.errors++;
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[sync] 获取文档失败: ${entry.title} — ${msg}`);
```

</details>

**依据 6 · 源码核查**：[api/src/routes/admin.ts:14-28](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/routes/admin.ts#L14-L28)

真正管理路由内默认token和写入前校验。

<details>
<summary>查看原文（15行）</summary>

```text
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dev-token';

function verifyAdmin(request: FastifyRequest, reply: FastifyReply): boolean {
  const auth = request.headers.authorization;
  if (!auth || auth !== `Bearer ${ADMIN_TOKEN}`) {
    reply.code(401).send({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

export async function adminRoutes(fastify: FastifyInstance) {
  // 单篇文档写入
  fastify.post('/admin/upsert', async (request, reply) => {
    if (!verifyAdmin(request, reply)) return;
```

</details>

**依据 7 · 源码核查**：[api/src/index.ts:50-50](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/index.ts#L50-L50)

服务监听全部接口。

```text
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
```

**依据 8 · 源码核查**：[api/src/services/doc-store.ts:329-341](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/services/doc-store.ts#L329-L341)

搜索日志持久保存query。

<details>
<summary>查看原文（13行）</summary>

```text
export function logSearch(
  query: string,
  source: string | undefined,
  resultCount: number,
  topScore: number | undefined,
  tookMs: number,
): void {
  getDb()
    .prepare(
      `INSERT INTO search_log (query, source, result_count, top_score, took_ms, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(query, source ?? null, resultCount, topScore ?? null, tookMs, now());
```

</details>

**依据 9 · 源码核查**：[scrapers/src/utils/cookies.ts:55-67](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/scrapers/src/utils/cookies.ts#L55-L67)

Cookie JSON文件保存与HTTP头转换。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * 保存 Cookie 到 JSON 文件
 */
export function saveCookiesToFile(filePath: string, cookies: CookieEntry[]): void {
  const resolved = path.resolve(filePath);
  fs.writeFileSync(resolved, JSON.stringify(cookies, null, 2), 'utf-8');
}

/**
 * 将 CookieEntry 数组转为 Cookie 头字符串
 */
export function toCookieHeader(cookies: CookieEntry[]): string {
  return cookies.map((c) => `${c.name}=${c.value}`).join('; ');
```

</details>

#### 缺口

- 在线数据库是否有过期、缺页或跨源错误去重实例未知。
  **影响**：不能给出当前搜索质量、完整率或时效保证。
  **进一步探讨**：用固定公开查询集比对厂商原页，含同名跨源、模式差异和最近修订页，记录缺失及日期来源。
- 公共服务当前访问条件、配置和可用性未验证。
  **影响**：不能把作者零配置声明当稳定SLA或默认令牌仍在线使用的事实。
  **进一步探讨**：使用前由用户在非敏感任务中确认端点和条款，自部署显式设置管理凭据并限制暴露。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用者与维护者成本分别是什么，何时停止？

**研究主题**：采用判断、效果与总成本

#### 完整回答

建议将它作为公开API文档的有条件检索助手试用，适合反复跨中文平台查接口的开发者。先用已知答案的公开问题，例如指定平台和开发模式寻找一个接口路径，比较搜索列表、全文和厂商原页的字段、权限及错误码；只在吻合后把核实内容用于实现。先读摘要定位，再取全文核对必填项和权限，不能把摘要当可直接执行的完整契约。找不到或原页不符应返回厂商站搜索，而不是用模型补齐缺失参数。

托管使用主要付出网络请求、模型阅读上下文和人工原文复核，服务价格、访问限制与可用性本轮未知，不称免费或零维护。自部署需要Node原生依赖、SQLite存储、服务运行、抓取任务、有效来源权限，以及明确设置管理令牌；部分源另需浏览器桥接和Cookie，人工成本更多由维护者承担。部署示例显式传ADMIN_TOKEN，但代码默认仍可启动，不应把示例当强制配置。

合格试用观察同批公开问题的正确原文命中、错误平台和过期页率、端到端时间及人工核对分钟数；包含空结果、限流和失败重试。若错误模式、陈旧参数、响应截断误导或外部服务不可达，就停止依赖该结果，回官方文档；自部署若未能确认管理凭据和公开读范围，停止对外开放。这里不建议把私有查询或凭据交给公共端点，也没有验证真实接入收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:201-236](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/README.md#L201-L236)

自部署示例要求管理员令牌，同时文档写出开发默认值。

<details>
<summary>查看原文（36行）</summary>

````text
## 自部署

默认使用公共云端服务，无需自部署。如果需要私有化部署或自定义数据源，可以自建。

### Docker 部署

```bash
docker build -t specfusion .

docker run -d \
  -p 3456:3456 \
  -v $(pwd)/data:/app/data \
  -e ADMIN_TOKEN=your-secret-token \
  --name specfusion \
  specfusion
```

启动后将 Skill 中的 API 地址替换为你的实例：

```bash
# macOS
sed -i '' 's|https://specfusion.inagora.org/api|http://your-host:3456/api|g' \
  ~/.claude/skills/specfusion/SKILL.md

# Linux
sed -i 's|https://specfusion.inagora.org/api|http://your-host:3456/api|g' \
  ~/.claude/skills/specfusion/SKILL.md
```

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3456` | 服务端口 |
| `DB_PATH` | `./data/specfusion.db` | SQLite 数据库路径 |
| `ADMIN_TOKEN` | `dev-token` | Admin API 认证令牌 |
````

</details>

**依据 2 · 作者声明**：[README.md:238-261](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/README.md#L238-L261)

不同源同步和桥接条件为作者操作声明。

<details>
<summary>查看原文（24行）</summary>

````text
### 文档同步

```bash
npm install
npm run sync -- --source feishu    # 同步飞书文档
npm run sync -- --source wecom     # 同步企业微信文档（需要 ego lite 桥接）
npm run sync -- --source dingtalk  # 同步钉钉文档（需要 ego lite 桥接）
npm run sync -- --source taobao    # 同步淘宝开放平台文档
npm run sync -- --source xiaohongshu  # 同步小红书文档（需要 ego lite 桥接）
npm run sync -- --source douyin    # 同步抖音电商开放平台文档
npm run sync -- --source wechat-miniprogram  # 同步微信小程序文档
npm run sync -- --source wechat-shop  # 同步微信小店文档
npm run sync -- --source pinduoduo   # 同步拼多多开放平台文档（需先跑 scripts/pdd-refresh.sh）
npm run sync -- --source youzan      # 同步有赞开放平台文档
npm run sync -- --source wechat-pay  # 同步微信支付文档
npm run sync -- --source alipay      # 同步支付宝开放平台文档
npm run sync -- --source jd          # 同步京东商家开放平台文档（需要 ego lite 桥接）
npm run sync -- --source shein       # 同步SHEIN开放平台文档
npm run sync -- --source dewu        # 同步得物开放平台文档（需要 ego lite 桥接）
npm run sync -- --source volcengine-ecs  # 同步火山引擎云服务器文档
npm run sync -- --source volcengine  # 同步火山引擎文档中心
npm run sync -- --source bailian     # 同步阿里云百炼文档
npm run sync -- --source weaver      # 同步泛微 e-teams 开放平台文档
npm run sync -- --source beisen      # 同步北森 iTalent 开放平台文档
````

</details>

**依据 3 · 源码核查**：[dsh-plugin/lib/client.js:10-14](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/dsh-plugin/lib/client.js#L10-L14)

默认外部托管base URL及可覆盖环境变量。

```text
/** 默认云端服务地址（HTTPS）。 */
export const DEFAULT_BASE_URL = "https://specfusion.inagora.org/api";

/** 环境变量，允许自部署用户不改配置直接覆盖 base URL。 */
export const BASE_URL_ENV = "SPECFUSION_BASE_URL";
```

**依据 4 · 源码核查**：[api/src/services/summarizer.ts:79-106](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/services/summarizer.ts#L79-L106)

摘要有明确截取和全文退路。

<details>
<summary>查看原文（28行）</summary>

````text
  // 5. 提取第一个参数表格（最多 10 行）
  const table = extractFirstTable(lines, 10);
  if (table) {
    parts.push('## 请求参数');
    parts.push('');
    parts.push(table);
    parts.push('');
  }

  // 6. 提取 JSON 代码块示例（最多 2 个，每个截断到 500 字符）
  const jsonExamples = extractJsonExamples(lines);
  if (jsonExamples.length > 0) {
    parts.push('## 示例');
    parts.push('');
    for (const ex of jsonExamples) {
      if (ex.label) {
        parts.push(`**${ex.label}**`);
        parts.push('');
      }
      parts.push('```json');
      parts.push(ex.code);
      parts.push('```');
      parts.push('');
    }
  }

  // 7. 添加获取全文提示
  parts.push(`*（完整参数和代码示例请获取全文：\`/doc/${docId}\`）*`);
````

</details>

**依据 5 · 源码核查**：[api/src/routes/doc.ts:20-34](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/routes/doc.ts#L20-L34)

取全文获得元信息和内容。

<details>
<summary>查看原文（15行）</summary>

```text
      return generateSummary(doc.content, doc.id, doc.source_id, doc.title, doc.api_path);
    }

    // 在全文前添加元信息注释
    const header = [
      `<!-- source: ${doc.source_id} | path: ${doc.path} -->`,
      doc.source_url ? `<!-- source_url: ${doc.source_url} -->` : null,
      doc.last_updated ? `<!-- last_updated: ${doc.last_updated} -->` : null,
      '',
    ]
      .filter(Boolean)
      .join('\n');

    return header + doc.content;
  });
```

</details>

#### 缺口

- 相对官方站点搜索的净节时、正确率和维护总成本未测。
  **影响**：可控公开任务试用不等于已验证效果或持续采用。
  **进一步探讨**：用同一查询集记录正确原文、端到端时间、全部模型用量和人工复核，比较厂商原站。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否让检索结果带版本时点与缺页状态以减少陈旧引用？

**研究主题**：新假设与验证

#### 完整回答

已有搜索和全文已经带source_url及last_updated，故新方向不能只重复“加来源和时间”。未验证假设是把厂商修订日、抓取观察时间和内容hash分别保存并输出，同时明确候选截断、单页失败和来源覆盖状态；当上游日期缺失时显示未知而非把写入时间当更新日。推导来自入库时间回退、unchanged早退和候选封顶仍显示共N条。它改变的是模型理解证据边界的契约，不是换一种排序公式就宣称检索更准。

最小实验准备可公开复核的页面集合，包含正文不变但URL变更、缺上游日期、部分抓取失败、超过200个匹配项和跨平台同名接口。比较现响应、字段分离响应和人工原站检索，盲审模型是否误称“最新”“全部”以及错误选源；同时记录新增字段的token和维护成本。只有误述减少且正确页查找不退化，才支持继续；若模型仍忽略缺口或维护成本大于收益，就否定此方案。它尚未实现，不能并入本项目当前创新或效果。

#### 证据与依据

**依据 1 · 源码核查**：[api/src/services/doc-store.ts:77-94](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/services/doc-store.ts#L77-L94)

同内容提前返回和时间回退是时点分离的依据。

<details>
<summary>查看原文（18行）</summary>

```text
  if (existing) {
    if (existing.content_hash === contentHash) {
      return { doc_id: docId, action: 'unchanged' };
    }
    d.prepare(
      `UPDATE documents SET
        title = ?, content = ?, content_hash = ?, prev_content_hash = ?,
        api_path = ?, dev_mode = ?, doc_type = ?, source_url = ?,
        metadata = ?, tokenized_title = ?, tokenized_content = ?,
        last_updated = ?, synced_at = ?, path_depth = ?
      WHERE id = ?`,
    ).run(
      doc.title, doc.content, contentHash, existing.content_hash,
      doc.api_path ?? null, doc.dev_mode ?? null, doc.doc_type ?? 'api_reference',
      doc.source_url ?? null, metadata,
      doc.tokenized_title ?? null, doc.tokenized_content ?? null,
      doc.last_updated ?? ts, ts, pathDepth,
      docId,
```

</details>

**依据 2 · 源码核查**：[api/src/services/search-engine.ts:391-408](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/services/search-engine.ts#L391-L408)

当前有限候选和已有source_url/last_updated字段。

<details>
<summary>查看原文（18行）</summary>

```text
  // 候选集封顶 200 条，所以命中很多时这个数字是下限而不是真实总数，
  // 详见上面 FTS 查询处的注释
  const totalCount = scoredRows.length;
  scoredRows = scoredRows.slice(0, limit);

  // ----- 构造 SearchResult -----
  const results: SearchResult[] = scoredRows.map(({ doc, score }, idx) => ({
    id: doc.id,
    source_id: doc.source_id,
    title: doc.title,
    path: doc.path,
    api_path: doc.api_path,
    dev_mode: doc.dev_mode,
    other_modes: otherModesMap.get(idx),
    doc_type: doc.doc_type,
    source_url: doc.source_url,
    last_updated: doc.last_updated,
    snippet: generateSnippet(doc.content, trimmedQuery),
```

</details>

**依据 3 · 源码核查**：[api/src/routes/doc.ts:24-34](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/api/src/routes/doc.ts#L24-L34)

全文已有元信息，不能冒充新设计。

<details>
<summary>查看原文（11行）</summary>

```text
    const header = [
      `<!-- source: ${doc.source_id} | path: ${doc.path} -->`,
      doc.source_url ? `<!-- source_url: ${doc.source_url} -->` : null,
      doc.last_updated ? `<!-- last_updated: ${doc.last_updated} -->` : null,
      '',
    ]
      .filter(Boolean)
      .join('\n');

    return header + doc.content;
  });
```

</details>

**依据 4 · 源码核查**：[scrapers/src/sync.ts:329-332](https://github.com/wxkingstar/SpecFusion/blob/54ff77ae5411f1a566df8e1be12ebbebf377bfcc/scrapers/src/sync.ts#L329-L332)

单页抓取失败是覆盖状态设计线索。

```text
    } catch (error: unknown) {
      result.errors++;
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[sync] 获取文档失败: ${entry.title} — ${msg}`);
```

#### 缺口

- 证据状态显式化是否改变模型误述和用户选择未知。
  **影响**：不能将界面字段变多直接算作可靠性收益。
  **进一步探讨**：按本题预置缺口集盲审错误断言，并比较token与维护时间。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
