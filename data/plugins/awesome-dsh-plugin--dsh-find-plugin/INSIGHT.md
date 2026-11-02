# dsh-find-plugin

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[afce1cd](https://github.com/awesome-dsh-plugin/dsh-find-plugin/tree/afce1cd43f98b8a8b02e4a35cd6a65d6444de412)

<!-- BEGIN META -->
[![GitHub ★ 214](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=214&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/awesome-dsh-plugin/dsh-find-plugin) [![npm 30d 17,029](https://img.shields.io/static/v1?label=npm+30d&message=17%2C029&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-find-plugin) [![最新发布 2026-09-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-find-plugin)
<!-- END META -->

> **功能**：在 DSH 对话中搜索插件仓库，补充目录描述和安装命令，并在在线搜索失败时回退目录关键词匹配。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把候选发现做成模型工具，结合可选凭据、缓存和明确标识的离线目录退路。核心搜索与描述继承外部来源，不把Star当采用判断。

> **主要限制**：[Q02](#research-q02) Star仅在先截取的有限GitHub候选内排序，缓存limit也会影响覆盖；返回的目录描述和安装字符串未经源码/兼容核查。工具没有执行安装，后续Agent不能把命令返回当授权。

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
  - [Q01 · 帮谁找什么，相对浏览目录增加什么？](#detail-section-11)
  - [Q02 · 数据获取、筛选、缓存和安装怎样接线？](#detail-section-12)
  - [Q03 · 依赖、成本和退出能否支持试用？](#detail-section-13)
  - [Q04 · 如何把推荐与安全安装的证据分开？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：不知道插件名的DSH用户可以按能力关键词在对话中找候选仓库和描述。

[Q01](#research-q01) 相对手工GitHub/目录搜索，增量是减少入口切换和归集描述；发现不代表源码安全、兼容或安装已完成。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| GitHub候选发现 | 查topic内有限候选 | 有限子集Star排，非全局热榜 |
| 目录描述与fallback | 语言描述及网络失败退路 | 可能陈旧/局限，note标来源 |
| 安装命令展示 | 给后续审查操作入口 | 不执行，不保证固定版本/授权/安全 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配cordis/tools的DSH | 必需 | 注册工具 | peer列举不是加载验收 |
| GitHub网络/topic条目 | 在线路径必需 | 关键词候选 | 失败可转目录，不表示无能力 |
| GITHUB_TOKEN宿主凭据 | 可选 | 认证请求 | 缺失匿名，仍可能限流 |
| 目录网络/缓存/快照 | 描述或fallback | 补描述与关键词匹配 | 陈旧/不完整不代表当前覆盖 |
| 人工源码与版本核查 | 安装决定必需 | 判断可用/授权范围 | 不能直接执行未审命令 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核对宿主与可选凭据 | 本轮未安装/查询 |
| 发现 | Agent按能力关键词调用 | 核对note的live/fallback来源 |
| 选择 | 用户回源核仓库/固定提交/兼容 | Star和目录收录不作质量证明 |
| 安装决定 | 按独立授权处理命令 | 工具只返回字符串，不代授权 |
| 退出 | 停用工具并回手工搜索 | 本地缓存留存单独核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 插件与可选凭据/缓存 | 核对宿主和来源 | 金额/时间未知 |
| 持续使用 | 请求与模型读候选 | 重述关键词、源码审查和版本固定 | 未测总体节时 |
| 失败恢复 | 一次重试与目录降级 | 判陈旧/覆盖，回手工搜索 | 无需撤销未执行的候选安装 |
| 退出 | 留存目录缓存 | 停用与另行清理缓存 | 不自动删除数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话内发现 | topic查询与描述归集 | 真实适用候选覆盖 |
| 离线退路 | 内存/磁盘/快照与source提示 | 陈旧性、取消后链路延迟 |
| 安装准备 | 返回命令字符串 | 固定版本、安全与兼容，均未核 |

> **思考**：[Q02](#research-q02) Star仅在先截取的有限GitHub候选内排序，缓存limit也会影响覆盖；返回的目录描述和安装字符串未经源码/兼容核查。工具没有执行安装，后续Agent不能把命令返回当授权。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把候选发现做成模型工具，结合可选凭据、缓存和明确标识的离线目录退路。核心搜索与描述继承外部来源，不把Star当采用判断。

[Q02](#research-q02) 可选凭据、统一一次重试预算、失败缓存和带来源降级值得复用；先截取再Star排和query-only缓存意味着覆盖依赖调用历史，不能在产品表述里扩大为全局热榜。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) Star仅在先截取的有限GitHub候选内排序，缓存limit也会影响覆盖；返回的目录描述和安装字符串未经源码/兼容核查。工具没有执行安装，后续Agent不能把命令返回当授权。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 把工具当候选入口，读来源note并回仓库核固定提交、兼容与权限。结果少或陈旧时手工查目录；工具没有安装能力，不从返回命令推导安装授权。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查工具、GitHub/目录缓存、降级与实际lib关键链；无在线查询、目标安装或宿主验收。明确检索结果与安全推荐不同，未来说明协议未验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/github.js、lib/index.js、package.json、src/github.ts、src/index.ts、src/registry.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定root plugin，读取全部src与实际lib有限排序关键链；未查询实时GitHub/目录、读取任何真实token、审计全部候选或安装目标代码。
- 下一步：按[Q04](#research-q04)比较当前与加范围/未核说明的固定候选输出，加入limit/旧缓存反例，计误信任和发现/审查总投入；无改善或额外负担过高则否定。本轮未执行。

**分析版本**

- **仓库**：[awesome-dsh-plugin/dsh-find-plugin](https://github.com/awesome-dsh-plugin/dsh-find-plugin)
- **版本号**：0.4.0（[固定提交 afce1cd](https://github.com/awesome-dsh-plugin/dsh-find-plugin/tree/afce1cd43f98b8a8b02e4a35cd6a65d6444de412)）
- **版本日期**：2026-09-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在已有来源note上增加有限范围、时间与未核状态的候选交接说明，比较是否减少把目录收录误认安全认可；收益和阅读成本未验证。

按[Q04](#research-q04)比较当前与加范围/未核说明的固定候选输出，加入limit/旧缓存反例，计误信任和发现/审查总投入；无改善或额外负担过高则否定。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 503 | 409 | 99 | — |
| .md | source | 2 | 175 | — | — | 1527 |
| .mjs | source | 1 | 85 | 57 | 21 | — |
| .ts | source | 3 | 611 | 454 | 102 | — |
| .mjs | test | 2 | 532 | 453 | 33 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/awesome-dsh-plugin/dsh-find-plugin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：插件发现如何接入对话，排序/缓存和安装边界是否支持有条件使用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 帮谁找什么，相对浏览目录增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本插件面向在DSH对话中提出能力需求、但不知道插件名的用户。合格结果是得到可追溯的候选仓库与描述，随后另行核查固定版本和安装前提；发现条目不是安装成功或安全认证。手工基线是去GitHub topic或awesome目录输入关键词。插件把相同发现入口接成find_dsh_plugin工具，并为已收录结果补中文/英文描述和安装命令字符串，减少浏览器切换。

贡献是会话内发现和有标识的离线降级，核心检索仍继承GitHub与目录维护者的内容。Star只作关注度排序，不是质量、兼容或采用评分。工具本身不执行安装，README所说“让Agent安装”是后续另一个动作，不能把返回命令写成已经授权安装第三方代码。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-9](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/README.md#L5-L9)

作者场景和输出。

```text
**A plugin that finds plugins** — think [`/find-skills`](https://skills.sh) from skills.sh, for DSH.

Tell your agent what you want ("notify me on WeChat when a task finishes"),
and it searches the DSH plugin ecosystem on GitHub for you — top results by
stars, each with a one-line description and an install command.
```

**依据 2 · 作者声明**：[README.md:32-45](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/README.md#L32-L45)

命令返回与第三方源码/固定版本边界。

<details>
<summary>查看原文（14行）</summary>

```text
Each result comes back with stars, a description, the repo link, and a
ready-to-run `dsh plugin add` command — ask the agent to install one and
it can run the command for you.

## How it works

- Live GitHub repository search scoped to the official `dsh-plugin` topic,
  re-ranked by stars (5-minute per-query cache).
- When a result is also listed on
  [awesome-dsh-plugin](https://awesome-dsh-plugin.com), its hand-written
  bilingual description from `plugins.json` replaces the GitHub one (the
  `lang` parameter picks the language) — ranking is untouched.
- Every result comes with a ready-to-run `dsh plugin add` command. Plugins
  are third-party code — review the source and pin a commit.
```

</details>

**依据 3 · 源码核查**：[src/index.ts:134-160](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/src/index.ts#L134-L160)

实际注册的是发现工具与文本渲染。

<details>
<summary>查看原文（27行）</summary>

```text
export function apply(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'find_dsh_plugin',
    description:
      'Search GitHub for DeepSeek Harness plugins (public `dsh-plugin` topic), ranked by stars. Returns ' +
      'descriptions and ready-to-run `dsh plugin add` install commands. Use when the user wants a capability ' +
      'DSH does not currently have, or asks what plugins exist. Plugins are third-party code — advise reviewing ' +
      'the source and pinning a commit. Falls back to keyword matches from the curated awesome-dsh-plugin list ' +
      'when GitHub search is rate limited or unreachable; the note states which source was used.',
    parameters: {
      query: {
        type: 'string',
        required: true,
        description: 'Keywords describing the capability, e.g. "wechat notifications", "TUI", "跨会话记忆"',
      },
      limit: {
        type: 'number',
        description: 'Max results to return (default 8, max 20)',
      },
      lang: {
        type: 'string',
        description: "Preferred description language for curated entries (e.g. 'en', 'zh'). Defaults to 'en'.",
      },
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, value) => [{ type: 'text', text: renderText(value as unknown as FindResult) }],
```

</details>

**依据 4 · 源码核查**：[src/index.ts:184-196](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/src/index.ts#L184-L196)

结果只包含install字符串，无执行调用。

<details>
<summary>查看原文（13行）</summary>

```text
        const results: FindItem[] = found
          .sort((a, b) => b.stars - a.stars)
          .map(c => {
            const desc = curated.get(c.url.toLowerCase())
            return {
              name: c.name,
              url: c.url,
              description: desc ? (desc[lang] ?? desc.en ?? c.description) : c.description,
              stars: c.stars,
              install: c.install,
            }
          })
        return { results, note: results.length > 0 ? LIVE_NOTE : '' } satisfies FindResult
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 数据获取、筛选、缓存和安装怎样接线？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

执行器逐次从可选credentials解析GITHUB_TOKEN，缺少服务或凭据仍可匿名查询。GitHub模块将关键词限定topic:dsh-plugin，失败/限流共享一次重试预算，再抛给工具层转目录关键词匹配；目录有内存、磁盘条件请求和内置快照退路，返回note标明降级来源，不把旧目录冒充实时Star结果。缓存写用临时文件rename且失败不影响查询，这是明确可用性取舍。

需要收窄排序承诺。GitHub请求没有sort=stars，只取得per_page<=20的默认搜索子集，模块先slice到limit，工具层才按Star排序，所以它是有限候选内的排序，不是全生态Star最高结果；query缓存键也不含limit，先小limit取回的小候选缓存会限制随后同词大limit的覆盖。该行为在lib实际产物也存在。目录fallback按匹配词数、权重再Star排序，与实时路径含义不同。

目录结构只做非空plugins数组形态检查，描述和install由上游内容提供，不核源码、完整提交、兼容或脚本授权。纯文本输出不直接执行上游字符串，但后续Agent若盲从命令就把发现当审计了。取消信号被传给GitHub请求，工具层捕获其错误后仍可能进入不带该信号的目录加载，不能把网络取消解释为整个发现链已停止。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:52-64](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/src/index.ts#L52-L64)

可选凭据逐次解析，缺失/异常可匿名。

<details>
<summary>查看原文（13行）</summary>

```text
/** Resolve the token; a missing service or an unset credential yields undefined. */
async function resolveGitHubToken(ctx: Context): Promise<string | undefined> {
  try {
    const credentials = typeof ctx.get === 'function'
      ? (ctx.get('credentials') as { resolve?: (ref: string) => Promise<{ value?: string } | undefined> } | undefined)
      : undefined
    if (credentials === undefined || typeof credentials.resolve !== 'function') return undefined
    const resolved = await credentials.resolve(GITHUB_TOKEN_REF)
    const value = resolved?.value
    return typeof value === 'string' && value.length > 0 ? value : undefined
  } catch {
    return undefined
  }
```

</details>

**依据 2 · 源码核查**：[src/github.ts:139-189](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/src/github.ts#L139-L189)

查询缓存键、有限请求、不含Star排序和先截取。

<details>
<summary>查看原文（51行）</summary>

```text
export async function searchGitHub(
  query: string,
  limit = 5,
  options: SearchGitHubOptions = {},
): Promise<CommunityPlugin[]> {
  const key = query.toLowerCase().trim()
  const hit = cache.get(key)
  if (hit !== undefined && Date.now() - hit.at < (hit.error === undefined ? OK_TTL_MS : FAIL_TTL_MS)) {
    if (hit.error !== undefined) throw hit.error
    return (hit.data ?? []).slice(0, limit)
  }

  const token = typeof options.token === 'string' && options.token.length > 0 ? options.token : undefined
  const callerSignal = options.signal
  const q = encodeURIComponent(`${query} topic:dsh-plugin`)
  const url = `https://api.github.com/search/repositories?q=${q}&per_page=${Math.min(limit * 2, 20)}`
  const headers: Record<string, string> = { accept: 'application/vnd.github+json', 'user-agent': 'dsh-find-plugin' }
  if (token !== undefined) headers.authorization = `Bearer ${token}`
  const signalFor = (): AbortSignal =>
    callerSignal === undefined ? AbortSignal.timeout(TIMEOUT_MS) : AbortSignal.any([callerSignal, AbortSignal.timeout(TIMEOUT_MS)])

  let attempt = 0
  for (;;) {
    let res: Response
    try {
      res = await fetch(url, { headers, signal: signalFor() })
    } catch (error) {
      if (attempt === 0 && callerSignal?.aborted !== true) {
        attempt += 1
        await new Promise(resolvePromise => setTimeout(resolvePromise, RETRY_DELAY_MS))
        continue
      }
      const hint = proxyHint()
      const wrapped = new Error(`GitHub search failed: ${describeFailure(error)}${hint === '' ? '' : `. ${hint}`}`)
      cache.set(key, { at: Date.now(), error: wrapped })
      throw wrapped
    }

    if (res.ok) {
      const body = (await res.json()) as { items?: Array<Record<string, unknown>> }
      const data: CommunityPlugin[] = (body.items ?? []).map(it => ({
        name: String(it.name ?? ''),
        owner: String((it.owner as Record<string, unknown> | undefined)?.login ?? ''),
        url: String(it.html_url ?? ''),
        description: String(it.description ?? ''),
        stars: Number(it.stargazers_count ?? 0),
        pushed: String(it.pushed_at ?? ''),
        install: `dsh plugin --profile web add github:${String(it.full_name ?? '')}`,
      }))
      cache.set(key, { at: Date.now(), data })
      return data.slice(0, limit)
```

</details>

**依据 3 · 源码核查**：[lib/github.js:113-150](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/lib/github.js#L113-L150)

实际产物相同有限候选路径。

<details>
<summary>查看原文（38行）</summary>

```text
    const token = typeof options.token === 'string' && options.token.length > 0 ? options.token : undefined;
    const callerSignal = options.signal;
    const q = encodeURIComponent(`${query} topic:dsh-plugin`);
    const url = `https://api.github.com/search/repositories?q=${q}&per_page=${Math.min(limit * 2, 20)}`;
    const headers = { accept: 'application/vnd.github+json', 'user-agent': 'dsh-find-plugin' };
    if (token !== undefined)
        headers.authorization = `Bearer ${token}`;
    const signalFor = () => callerSignal === undefined ? AbortSignal.timeout(TIMEOUT_MS) : AbortSignal.any([callerSignal, AbortSignal.timeout(TIMEOUT_MS)]);
    let attempt = 0;
    for (;;) {
        let res;
        try {
            res = await fetch(url, { headers, signal: signalFor() });
        }
        catch (error) {
            if (attempt === 0 && callerSignal?.aborted !== true) {
                attempt += 1;
                await new Promise(resolvePromise => setTimeout(resolvePromise, RETRY_DELAY_MS));
                continue;
            }
            const hint = proxyHint();
            const wrapped = new Error(`GitHub search failed: ${describeFailure(error)}${hint === '' ? '' : `. ${hint}`}`);
            cache.set(key, { at: Date.now(), error: wrapped });
            throw wrapped;
        }
        if (res.ok) {
            const body = (await res.json());
            const data = (body.items ?? []).map(it => ({
                name: String(it.name ?? ''),
                owner: String(it.owner?.login ?? ''),
                url: String(it.html_url ?? ''),
                description: String(it.description ?? ''),
                stars: Number(it.stargazers_count ?? 0),
                pushed: String(it.pushed_at ?? ''),
                install: `dsh plugin --profile web add github:${String(it.full_name ?? '')}`,
            }));
            cache.set(key, { at: Date.now(), data });
            return data.slice(0, limit);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:154-166](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/lib/index.js#L154-L166)

产物只在已截取found内按Star排。

<details>
<summary>查看原文（13行）</summary>

```text
                const results = found
                    .sort((a, b) => b.stars - a.stars)
                    .map(c => {
                    const desc = curated.get(c.url.toLowerCase());
                    return {
                        name: c.name,
                        url: c.url,
                        description: desc ? (desc[lang] ?? desc.en ?? c.description) : c.description,
                        stars: c.stars,
                        install: c.install,
                    };
                });
                return { results, note: results.length > 0 ? LIVE_NOTE : '' };
```

</details>

**依据 5 · 源码核查**：[src/index.ts:199-216](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/src/index.ts#L199-L216)

降级目录搜索与来源提示。

<details>
<summary>查看原文（18行）</summary>

```text
      // Degraded path: GitHub unavailable → curated keyword matches.
      let registry: Registry
      let source: string
      try {
        ({ registry, source } = await loadRegistry())
      } catch {
        // Nothing left to fall back to — surface the original failure.
        throw githubError
      }
      const results = searchCurated(registry, args.query, limit, lang)
      const message = githubError instanceof Error ? githubError.message : String(githubError)
      const reason = githubError instanceof GitHubSearchRateLimited
        ? `GitHub search is rate limited: ${message}`
        : `GitHub search is unavailable: ${message}`
      const note = `${reason}\nFalling back to keyword matches from the curated awesome-dsh-plugin list ` +
        `(source=${source}, ${registry.plugins?.length ?? 0} entries) — not a live star-ranked GitHub result. ` +
        'Configure the DSH `GITHUB_TOKEN` credential to restore live search (30 req/min authenticated).'
      return { results, note } satisfies FindResult
```

</details>

**依据 6 · 源码核查**：[src/registry.ts:90-98](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/src/registry.ts#L90-L98)

结构只检查plugins数组而非条目语义。

```text
function isRegistry(value: unknown): value is Registry {
  if (value === null || typeof value !== 'object') return false
  const plugins = (value as Registry).plugins
  return Array.isArray(plugins) && plugins.length > 0
}

function readSnapshot(): Registry {
  return JSON.parse(readFileSync(snapshotPath(), 'utf8')) as Registry
}
```

**依据 7 · 源码核查**：[src/registry.ts:121-174](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/src/registry.ts#L121-L174)

临时磁盘缓存、条件请求与降级顺序。

<details>
<summary>查看原文（54行）</summary>

```text
async function writeDiskCache(registry: Registry, etag?: string, lastModified?: string): Promise<void> {
  try {
    await mkdir(cacheDir(), { recursive: true })
    const path = cachePath()
    const temp = `${path}.tmp-${process.pid}`
    await writeFile(temp, JSON.stringify({
      version: CACHE_VERSION,
      fetchedAt: new Date().toISOString(),
      etag,
      lastModified,
      registry,
    }), 'utf8')
    await rename(temp, path)
  } catch {
    // A cache write failure must not break the lookup; the next call refetches.
  }
}

export async function loadRegistry(): Promise<{ registry: Registry; source: RegistrySource }> {
  if (cache !== null && Date.now() - cache.at < TTL_MS) return { registry: cache.data, source: 'memory' }

  const disk = await readDiskCache()
  const etag = cache?.etag ?? disk?.etag
  const lastModified = cache?.lastModified ?? disk?.lastModified
  const headers: Record<string, string> = { accept: 'application/json', 'user-agent': 'dsh-find-plugin' }
  if (etag !== undefined) headers['if-none-match'] = etag
  if (lastModified !== undefined) headers['if-modified-since'] = lastModified

  try {
    const res = await fetch(REGISTRY_URL, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) })
    if (res.status === 304) {
      const data = cache?.data ?? disk?.registry
      if (isRegistry(data)) {
        cache = { at: Date.now(), data, etag, lastModified }
        return { registry: data, source: 'cache' }
      }
    } else if (res.ok) {
      const data = (await res.json()) as Registry
      if (!isRegistry(data)) throw new Error('empty registry')
      const nextEtag = res.headers.get('etag') ?? undefined
      const nextLastModified = res.headers.get('last-modified') ?? undefined
      cache = { at: Date.now(), data, etag: nextEtag, lastModified: nextLastModified }
      await writeDiskCache(data, nextEtag, nextLastModified)
      return { registry: data, source: 'live' }
    } else {
      throw new Error(`HTTP ${res.status}`)
    }
  } catch {
    // Network/parse failure — fall through to the fallback chain.
  }

  if (disk !== undefined) return { registry: disk.registry, source: 'disk' }
  if (cache !== null) return { registry: cache.data, source: 'memory' }
  return { registry: readSnapshot(), source: 'snapshot' }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、成本和退出能否支持试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

建议给有意自己核查第三方源码的DSH用户作候选发现试用，不能当自动安装推荐器。需要匹配的tools/cordis版本、网络或已有目录缓存；token是可选条件且应交由宿主凭据服务，不要写入查询或报告。manifest列举预发布peer范围，但本轮没有真实宿主加载验证，不能据列举范围说全支持。

首次配置主要是插件和可选凭据，日常为GitHub/目录请求、模型读候选以及人工回源审查；没有本次费用或时长对照。网络失败有目录退路，仍须核对source和候选陈旧性；无结果也不能推断生态没有该能力。安装命令通常不固定提交，使用者应先回到仓库核身份和版本，再按自己的安装授权处理。发现结果重复、范围过窄或降级内容不满足任务时，停用此工具并回到GitHub/目录手工搜索。退出会留下DSH_HOME缓存，是否保留由使用者另行决定；停用不用撤销“已安装候选”，因为本工具没有安装它们。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:30-45](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/package.json#L30-L45)

peer和bundle/导出声明。

<details>
<summary>查看原文（16行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6 || ^0.1.1-rc.1 || ^0.1.2-alpha.2 || ^0.1.3-alpha.2 || ^0.1.5-alpha.1 || ^0.1.6-alpha.1 || ^0.1.7-alpha.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[src/index.ts:29-32](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/src/index.ts#L29-L32)

只强依赖tools，可选凭据。

```text
export const inject = ['tools']

/** DSH credential name; `credentialRef()` is a runtime identity, so no import. */
const GITHUB_TOKEN_REF = 'GITHUB_TOKEN'
```

**依据 3 · 源码核查**：[src/github.ts:103-107](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/src/github.ts#L103-L107)

成功/失败缓存与超时参数。

```text
const OK_TTL_MS = 5 * 60 * 1000
const FAIL_TTL_MS = 60 * 1000
const TIMEOUT_MS = 8000
const RETRY_DELAY_MS = 1500
const MAX_RETRY_DELAY_MS = 3000
```

**依据 4 · 源码核查**：[src/registry.ts:72-87](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/src/registry.ts#L72-L87)

缓存位于DSH_HOME且内置快照独立。

<details>
<summary>查看原文（16行）</summary>

```text
function dshHome(): string {
  const fromEnv = process.env.DSH_HOME
  if (typeof fromEnv === 'string' && fromEnv.trim() !== '') return resolve(expandHome(fromEnv.trim()))
  return join(homedir(), '.dsh')
}

function cacheDir(): string {
  return join(dshHome(), 'cache', 'dsh-find-plugin')
}

function cachePath(): string {
  return join(cacheDir(), 'registry.json')
}

function snapshotPath(): string {
  return fileURLToPath(new URL('../data/registry-snapshot.json', import.meta.url))
```

</details>

**依据 5 · 源码核查**：[src/index.ts:184-196](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/src/index.ts#L184-L196)

返回命令无固定提交且不执行。

<details>
<summary>查看原文（13行）</summary>

```text
        const results: FindItem[] = found
          .sort((a, b) => b.stars - a.stars)
          .map(c => {
            const desc = curated.get(c.url.toLowerCase())
            return {
              name: c.name,
              url: c.url,
              description: desc ? (desc[lang] ?? desc.en ?? c.description) : c.description,
              stars: c.stars,
              install: c.install,
            }
          })
        return { results, note: results.length > 0 ? LIVE_NOTE : '' } satisfies FindResult
```

</details>

#### 缺口

- 缺少真实宿主兼容、限流/取消和实际查询覆盖对照。
  **影响**：不能保证发现延迟、覆盖或全部peer组合可用。
  **进一步探讨**：在固定宿主用公开关键词比较手工目录和工具，包括小limit后大limit及网络故障。
- 没有节时、误候选和后续源码审查总负担数据。
  **影响**：无法把局部少切窗口推成总体采用收益。
  **进一步探讨**：记录从需求到核实候选的全部人工/模型时间和错误选择。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何把推荐与安全安装的证据分开？

**研究主题**：新假设与验证

#### 完整回答

已有note区分实时与fallback，也提醒审核源码和pin commit，因此不把“添加一句第三方警告”作为新方案。可提出限定假设：在每个候选旁显示搜索范围/数据时间、是否只按有限子集Star排序，以及“未核源码/兼容/安装版本”的结构化状态，并把安装建议先替换为可核查固定仓库身份与版本的准备步骤，可能减少用户把目录收录当认可。此状态不应凭目录数据自动升为已审计，也不能把新字段当额外权限。

用固定公开候选及故障场景比较当前结果与加状态说明两组，包含同查询不同limit、旧磁盘目录、未带topic的相关仓库和安装命令未固定版本。观测误当已审计比例、找到真正适用候选的时间、遗漏和解释成本。若说明没有改变错误安装决策，或只增加阅读而无法减少误解，则否定。这个人机交接假设未验证，不计已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:36-37](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/src/index.ts#L36-L37)

已有第三方与固定版本提醒。

```text
const LIVE_NOTE =
  'Live GitHub `dsh-plugin` topic search, ranked by stars. All plugins are third-party code — review the source and pin a commit when installing. Browse the curated list at https://awesome-dsh-plugin.com'
```

**依据 2 · 源码核查**：[src/index.ts:213-216](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/src/index.ts#L213-L216)

已有降级来源提示是基线。

```text
      const note = `${reason}\nFalling back to keyword matches from the curated awesome-dsh-plugin list ` +
        `(source=${source}, ${registry.plugins?.length ?? 0} entries) — not a live star-ranked GitHub result. ` +
        'Configure the DSH `GITHUB_TOKEN` credential to restore live search (30 req/min authenticated).'
      return { results, note } satisfies FindResult
```

**依据 3 · 源码核查**：[src/github.ts:144-158](https://github.com/awesome-dsh-plugin/dsh-find-plugin/blob/afce1cd43f98b8a8b02e4a35cd6a65d6444de412/src/github.ts#L144-L158)

查询范围/缓存/有限候选决定待解释状态。

<details>
<summary>查看原文（15行）</summary>

```text
  const key = query.toLowerCase().trim()
  const hit = cache.get(key)
  if (hit !== undefined && Date.now() - hit.at < (hit.error === undefined ? OK_TTL_MS : FAIL_TTL_MS)) {
    if (hit.error !== undefined) throw hit.error
    return (hit.data ?? []).slice(0, limit)
  }

  const token = typeof options.token === 'string' && options.token.length > 0 ? options.token : undefined
  const callerSignal = options.signal
  const q = encodeURIComponent(`${query} topic:dsh-plugin`)
  const url = `https://api.github.com/search/repositories?q=${q}&per_page=${Math.min(limit * 2, 20)}`
  const headers: Record<string, string> = { accept: 'application/vnd.github+json', 'user-agent': 'dsh-find-plugin' }
  if (token !== undefined) headers.authorization = `Bearer ${token}`
  const signalFor = (): AbortSignal =>
    callerSignal === undefined ? AbortSignal.timeout(TIMEOUT_MS) : AbortSignal.any([callerSignal, AbortSignal.timeout(TIMEOUT_MS)])
```

</details>

#### 缺口

- 候选状态说明是否降低误信任与总时间未测。
  **影响**：不能声称已有安全推荐效果。
  **进一步探讨**：以固定候选对照任务观察误判断和全部阅读/审查负担。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
