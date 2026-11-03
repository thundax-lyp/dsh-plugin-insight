# dsh-fanqie-reader

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[fd242a4](https://github.com/fysh1010/mcp-server-fanqie/tree/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness)

<!-- BEGIN META -->
[![GitHub ★ 54](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/fysh1010/mcp-server-fanqie)
<!-- END META -->

> **功能**：在 DSH 右侧栏搜索和阅读番茄官网可见内容，查看本人书架与收藏划线，并提供对话工具。

> **亮点**：[Q01](#research-q01) 把共用阅读核心接到右侧栏与模型工具，减少另配MCP或复制书目/正文的交接；[Q02](#research-q02) 有界结果和内容范围清晰，但未测节时。

> **主要限制**：[Q02](#research-q02) 发现划线书目提示offset续页，工具schema和execute却未传offset，底层默认0；不能把首页当本人所有划线。账号工具结果还会进入模型上下文，见 [Q03](#research-q03)。

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
  - [Q01 · 原生阅读入口相比独立 MCP 或官网增加什么？](#detail-section-11)
  - [Q02 · 章节读取和划线分页的边界是否兑现？](#detail-section-12)
  - [Q03 · 账号、隐私、本机位置与使用负担如何分开？](#detail-section-13)
  - [Q04 · 分页收据能否减少遗漏误判？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向想在DSH阅读或对本人划线提问的用户，以ID定位、正确续页和理解内容范围为合格结果。

官网阅读/复制选段或独立MCP是基线；此子组件主要增加DSH原生交互，不把全仓内容核心算新贡献。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 书目搜索 | 以ID定位四类元数据 | 听书/漫画/短剧无播放/正文 |
| 详情/目录 | 定位章节item_id | 字符串ID，分页按来源 |
| 章节阅读 | 读官网可见片段 | 锁定/字体失败明确，预览有界 |
| 本人书架 | 看官方已同步位置 | 本人登录，progress单位未知 |
| 本人划线 | 读指定书收藏划线 | 书目offset未接，不保证遍历全部书 |
| 书评 | 分页读取评论 | 上游服务未运行验证 |
| 右侧栏记录 | 本机继续阅读 | localStorage非官方同步 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22、匹配DSH Web与connection/tools | 启动必需 | Host和模型工具 | 作者声明最低DSH0.2.0-rc.0，实机兼容未复现 |
| sidebarRightTabs/slots/locale | 右侧栏必需 | 阅读器入口与正文 | 注册失败不能视作内容不可用 |
| 上游官网/接口与受支持字体 | 阅读必需 | 搜索与可见章节 | 锁定/空内容/未知字体明确失败 |
| 本人账号与本地凭据 | 本人书架/划线必需 | 授权读取 | 结果经工具进入对话，非匿名数据 |
| localStorage | 本机最近记录可选 | 本机位置与外观 | 不同步官方进度，写失败不阻塞 |

[Q03](#research-q03) 区分连接信任、文件权限和实际账号隐私。

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 装配 | 用户匹配宿主，加载子包bundle | Host通道与侧栏可见，不冒充实测 |
| 匿名探索 | 用户搜书、用字符串ID取目录/公开章节 | 来源/内容范围与截断明确 |
| 本人数据 | 用户按需扫码并接受工具上下文曝光 | 先用指定书，完整划线书目不假定覆盖 |
| 复核 | 用户核has_more/cursor/ID与官网 | 重复页或访问失败停止，不猜内容 |
| 退出 | 用户停工具/本机退出登录或卸载 | 本地凭据清除不等于官方会话撤销 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主/存储/网络费用未知 | 安装、账号与权限核对耗时未知 | 无需独立MCP但仍需宿主 |
| 持续 | 上游网络与模型上下文费用未知 | 分页、ID与内容范围核对 | 无节时和模型成本对照 |
| 失败恢复 | 重试资源未知 | 字体/访问/登录和重复页排查 | 不突破上游访问条件 |
| 退出迁移 | 本机记录与账号文件资源未知 | 清本地登录、回官网 | 官方会话不因本地退出注销 |

按一项完整且边界明确的阅读/划线任务计量，缺总尝试与合格数不算单位成本。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 原生交互 | Host与侧栏/工具共用核心 | 对官网/MCP的用户净收益 |
| 有界章节 | 明确截断和website_visible_content | 上游长期可用性 |
| 本人划线 | 指定书cursor通路 | 全部划线书目工具offset未接 |
| 状态隐私 | 本机记录与账号接口分开 | 真实连接安全及用户理解 |

> **思考**：[Q02](#research-q02) 发现划线书目提示offset续页，工具schema和execute却未传offset，底层默认0；不能把首页当本人所有划线。账号工具结果还会进入模型上下文，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把共用阅读核心接到右侧栏与模型工具，减少另配MCP或复制书目/正文的交接；[Q02](#research-q02) 有界结果和内容范围清晰，但未测节时。

[Q02](#research-q02) 共用核心、字符串ID、有界输出和明确错误可借鉴，适配层应逐字段核分页；[Q03](#research-q03) 本机凭据原子替换和封面来源限制有具体实现，但非完整隐私/安全证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 发现划线书目提示offset续页，工具schema和execute却未传offset，底层默认0；不能把首页当本人所有划线。账号工具结果还会进入模型上下文，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先匿名搜索和已知公开章节，按需登录读指定书，并接受账号工具结果进入对话。分页重复、访问限制或隐私前提不满足就停工具、退出本机登录回官网；不把本机记录当官方同步。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核指定子组件Host/client、实际工具、vendor正文/账号和本机记录源码；未登录或运行上游/宿主。分页收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 plugins/deepseek-harness/README.md、plugins/deepseek-harness/client.js、plugins/deepseek-harness/index.js、plugins/deepseek-harness/vendor/server/accounts.mjs、plugins/deepseek-harness/vendor/server/core.mjs 及固定范围 inventory；组件：plugins/deepseek-harness。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅plugins/deepseek-harness子组件及其vendor副本，定向核Host/client注册、章节/划线适配、账号存储与本机位置；未全审整仓MCP、独立Skill、上游协议和所有UI。
- 下一步：未执行目标代码、登录、宿主或上游请求；作者实测声明不作本地验收。下一步优先多页划线书目参数复核与公开章节范围、本人数据上下文和退出行为。

**分析版本**

- **仓库**：[fysh1010/mcp-server-fanqie](https://github.com/fysh1010/mcp-server-fanqie)
- **版本号**：0.4.0（[固定提交 fd242a4](https://github.com/fysh1010/mcp-server-fanqie/tree/fd242a46d68f00dfb6d013aad0cbaaee98d148c1)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在先修分页接线后，试验范围/续页参数收据是否减少遗漏；已有has_more等不应被忽略，新增收益待验证。

未执行目标代码、登录、宿主或上游请求；作者实测声明不作本地验收。下一步优先多页划线书目参数复核与公开章节范围、本人数据上下文和退出行为。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1695 | 1560 | 72 | — |
| .md | source | 2 | 140 | — | — | 1984 |
| .mjs | source | 1 | 72 | 54 | 13 | — |
| .mjs | test | 1 | 141 | 122 | 8 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/fysh1010/mcp-server-fanqie/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/fysh1010/mcp-server-fanqie/issues?q=is%3Aissue+created%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/fysh1010/mcp-server-fanqie/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z)



统计日期：2026-11-03。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：原生番茄阅读与本人划线提问能否保持内容、分页和隐私边界，何种任务值得小范围使用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 原生阅读入口相比独立 MCP 或官网增加什么？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

对象是在 DSH 工作间隙阅读番茄官网可见内容、或希望对自己的书架/划线提问的用户。原办法是官网阅读、复制选段到对话，或单独配置本仓MCP。该子组件把右侧栏阅读器和7个fanqie工具接到同一vendor业务核心，主要增量是宿主交互与结果呈现，不是新内容服务或独立小说生成系统。

Host apply经connection.fetch注册通道并按effect释放，tools注册搜索、详情、目录、章节、书架、划线和书评；client注册sidebarRightTabs及正文/标题席位。因此真实类型是原生DSH Host+Web Client bundle，不应把整个仓库的MCP能力都记到本子包原创。lazy localClient在调用时才建立核心，UI与工具共用dispatch减少两套业务实现。

合格任务不是打开好看书架，而是用户能定位明确book_id/item_id、理解读到的是官网可见片段、正确继续分页，且知道账号工具结果会进入模型上下文。相比在官网阅读，集成可能省复制步骤，但对只读书而不用AI的人额外宿主与账号配置未必值得；独立采用和效率没有实测对照。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/deepseek-harness/README.md:1-8](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/README.md#L1-L8)

作者定位与业务核心归属。

```text
# 番茄阅读 · DeepSeek Harness 插件

在 DeepSeek Harness 桌面端右侧栏提供「番茄阅读」页面：搜索番茄小说（含听书/漫画/短剧元数据）、
浏览封面与书籍详情、分页查看目录、阅读官网可见章节、浏览书评；本人扫码登录后可查看书架、
已同步阅读位置与收藏划线。

插件复用本仓库 `server/` 核心（搜索、详情、目录、正文解密、账号协议），不重复实现业务；
原有 MCP、独立 Skill、本地 HTTP API 全部保持不变。
```

**依据 2 · 源码核查**：[plugins/deepseek-harness/index.js:80-96](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/index.js#L80-L96)

惰性client及共享dispatch。

<details>
<summary>查看原文（17行）</summary>

```text
/** 惰性建立本地客户端：账号与索引文件只在真正发起业务调用时读取。 */
let localClientPromise = null;
function localClient() {
  if (localClientPromise === null) localClientPromise = createLocalClient();
  return localClientPromise;
}

/** 模型工具经由与界面完全相同的 dispatch/dispatchAccount 调用核心。
 *  核心的分发入口要求 Map 形态的参数（与 URLSearchParams 一致），统一在这里转换并校验。 */
async function callDispatch(pathname, params) {
  const { client } = await localClient();
  return dispatch(client, pathname, scalarParams(params, 'params'));
}

async function callAccount(action, params) {
  const { accounts } = await localClient();
  return dispatchAccount(accounts, action, scalarParams(params, 'params'));
```

</details>

**依据 3 · 源码核查**：[plugins/deepseek-harness/index.js:315-321](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/index.js#L315-L321)

Host共享通道注册/生命周期。

```text
export function apply(ctx) {
  const register = (path, handler) => ctx.effect(() => ctx.connection.fetch.register({
    path,
    methods: ['POST'],
    requestBody: 'buffered',
    fetch: handler,
  }), `fanqie-reader: ${path}`);
```

**依据 4 · 源码核查**：[plugins/deepseek-harness/index.js:357-363](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/index.js#L357-L363)

7个工具实际注册。

```text
  // AI 问答工具：注册/释放随插件生命周期，与界面走同一业务通道。
  for (const definition of [
    toolSearch(), toolDetail(), toolDirectory(), toolRead(),
    toolBookshelf(), toolHighlights(), toolComments(),
  ]) {
    ctx.effect(() => ctx.tools.register(definition), `fanqie-reader: tool ${definition.name}`);
  }
```

**依据 5 · 源码核查**：[plugins/deepseek-harness/client.js:1298-1327](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/client.js#L1298-L1327)

右侧栏入口与席位实际接线。

<details>
<summary>查看原文（30行）</summary>

```text
        const registry = serviceOf(ctx, 'sidebarRightTabs');
        if (!registry || typeof registry.register !== 'function') {
          console.error('fanqie-reader: sidebarRightTabs 服务不可用，未注册右侧栏页面');
          return;
        }

        // 1) tab 类型（引导页出现一枚入口胶囊）
        ctx.effect(() => registry.register({
          id: TAB_ID,
          kind: TAB_KIND,
          priority: 'extension',
          title: () => t('tab.title'),
          guide: [{
            id: 'reader',
            order: 10,
            title: () => t('guide.title'),
            description: () => t('guide.desc'),
          }],
        }), 'fanqie-reader: tab type');

        // 2) 正文与标题席位
        ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
          name: 'sidebar.right.pane.tab',
          key: TAB_ID,
        }, FanqieTab)), 'fanqie-reader: tab body');

        ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab.title', () => ctx.slots.register({
          name: 'sidebar.right.pane.tab.title',
          key: TAB_ID,
        }, FanqieTitle)), 'fanqie-reader: tab title');
```

</details>

#### 缺口

- 没有与官网或独立MCP的同条件阅读/提问对照。
  **影响**：不能确认省时、遗漏减少或使用需求强度。
  **进一步探讨**：用相同书目、章节和划线任务比较定位、分页完整性与人工复制负担。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 章节读取和划线分页的边界是否兑现？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

章节工具先调用核心chapter，再把文本限制在200至20000字符之间并显式truncated/total_chars；核心对付费/锁定内容返回ACCESS_REQUIRED，空内容和未知字体拒绝，结果标website_visible_content。这支持有限合法可见阅读，不能承诺全本、听书播放、漫画正文或突破访问条件。ID按字符串传递有利于避免大整数精度损失，但外部接口/字体变更仍会让读取失败。

发现一处具体分页接线缺口。fanqie_my_highlights在不传book_id时调用highlight-books，render在has_more时提示“用offset翻页”；但工具参数只有book_id/cursor/limit，execute也没有传offset。vendor dispatchAccount的highlight-books明确读取offset（缺省0）。所以当前模型工具无法沿该提示向下一页有划线书目推进，反复调用可能仍停首页；这不等于指定book_id后的划线cursor失效，也不否定UI可能另有完整分页。

这一缺陷影响“我所有划线书目”式任务，应收窄采用：已知书的章节或划线可有条件探索，完整账号书目不能假定覆盖。工程上共用核心、字符串ID、有界结果和错误语义值得借鉴，但共享核心并不保证每层适配器保留全部分页字段。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/deepseek-harness/index.js:198-223](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/index.js#L198-L223)

章节工具实际限字与截断标记。

<details>
<summary>查看原文（26行）</summary>

```text
function toolRead() {
  return {
    name: 'fanqie_read_chapter',
    description: '阅读一章的官网可见正文片段（纯文本、段落结构）。付费/锁定/空正文/未知字体会返回明确错误而不是乱码。想读更长可加大 preview_chars。',
    parameters: {
      item_id: { type: 'string', required: true, description: '章节 ID，数字字符串，来自目录或书架。' },
      preview_chars: { type: 'integer', description: '返回正文的最大字符数，默认 2000，范围 200–20000。正文被截断时结果会标注 truncated=true。' },
    },
    output: {
      schema: looseObject({ item_id: { type: 'string' }, title: { type: 'string' }, content: { type: 'string' }, truncated: { type: 'boolean' } }),
      render: (_args, value) => {
        const content = asText(value.content);
        return textBlock(`《${asText(value.title)}》（item_id=${asText(value.item_id)}，本章 ${asText(value.word_count)} 字，completeness=${asText(value.completeness)}）\n\n${content}${value.truncated ? `\n\n[正文已截断，共 ${asText(value.total_chars)} 字；用更大的 preview_chars 续读]` : ''}\n\n上一章 item_id=${asText(value.previous_item_id) || '无'} ｜ 下一章 item_id=${asText(value.next_item_id) || '无'}`);
      },
    },
    isConcurrencySafe: () => true,
    execute: async (args) => {
      const limit = Math.min(20000, Math.max(200, Number(args.preview_chars) || 2000));
      const chapter = await callDispatch('/api/chapter', { item_id: args.item_id });
      const content = asText(chapter.content);
      const total = content.length;
      if (total <= limit) return { ...chapter, truncated: false, total_chars: total };
      // 在边界附近收尾，避免截在半个词上。
      const cut = content.lastIndexOf('\n', limit);
      return { ...chapter, content: content.slice(0, cut > limit * 0.6 ? cut : limit), truncated: true, total_chars: total };
    },
```

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness/vendor/server/core.mjs:175-189](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/vendor/server/core.mjs#L175-L189)

锁定/空内容/字体失败与正文范围。

<details>
<summary>查看原文（15行）</summary>

```text
  async chapter(itemId, raw = false) {
    const html = await this.request(`/reader/${id(itemId, 'item_id')}`);
    const state = initialState(html); const chapter = state.reader?.chapterData;
    if (!chapter?.itemId) throw new ApiError(404, '章节不存在或网页不可见', 'NOT_FOUND');
    if (chapter.isChapterLock || chapter.needPay) throw new ApiError(403, '此章节需要官方授权或登录，当前服务无法读取', 'ACCESS_REQUIRED');
    const fontId = /font-family:([^;]+)/.exec(state.common?.css || '')?.[1];
    const encrypted = plainText(chapter.content || '');
    if (!encrypted) throw new ApiError(502, '官网未提供正文', 'EMPTY_CONTENT');
    if (/[\uE000-\uF8FF]/.test(encrypted) && fontId !== 'DNMrHsV173Pd4pgy') throw new ApiError(502, `尚不支持官网字体 ${fontId || 'unknown'}`, 'FONT_CHANGED');
    const content = decryptText(encrypted);
    if (/[\uE000-\uF8FF]/.test(content)) throw new ApiError(502, '正文含未识别的字体字符，拒绝返回乱码', 'FONT_CHANGED');
    return { item_id: String(chapter.itemId), book_id: String(chapter.bookId), title: chapter.title,
      content, word_count: Number(chapter.chapterWordNumber), previous_item_id: chapter.preItemId,
      next_item_id: chapter.nextItemId, source: 'fanqienovel.com',
      completeness: 'website_visible_content', ...(raw ? { raw: chapter, font_id: fontId } : {}) };
```

</details>

**依据 3 · 源码核查**：[plugins/deepseek-harness/index.js:250-276](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/index.js#L250-L276)

划线书目提示offset但参数和execute不传。

<details>
<summary>查看原文（27行）</summary>

```text
function toolHighlights() {
  return {
    name: 'fanqie_my_highlights',
    description: '读取用户本人账号的收藏划线。省略 book_id 列出有划线的书；给 book_id 返回该书划线原文（完整句子、所属章节），用 cursor 翻页。独立笔记正文官方接口未提供。',
    parameters: {
      book_id: { type: 'string', description: '书籍 ID，数字字符串；省略则列出有划线/书签的书。' },
      cursor: { type: 'string', description: '上一次结果的翻页游标，原样回传；仅在继续翻同一本书时使用。' },
      limit: { type: 'integer', description: '每页条数，默认 20，最大 50。' },
    },
    output: {
      schema: looseObject({ has_more: { type: 'boolean' } }),
      render: (_args, value) => {
        if (value.books) {
          const rows = (value.books || []).slice(0, 50);
          const lines = rows.map((row, index) => `${index + 1}. ${brief(row.book_name || row.book_id, 26)} · book_id=${asText(row.book_id)} · 划线 ${asText(row.highlight_count)} · 书签 ${asText(row.bookmark_count)}`);
          return textBlock(`有收藏的书 ${rows.length} 本：\n${lines.join('\n')}\n${value.has_more ? '还有更多，用 offset 翻页（本工具传 book_id 后才返回划线原文）。' : '已到末页。'}`);
        }
        const rows = (value.highlights || []).slice(0, 50);
        const lines = rows.map((row, index) => `${index + 1}. 「${brief(row.text, 160)}」 —— ${brief(row.chapter_title || row.book_name, 24)}（item_id=${asText(row.item_id)}）`);
        return textBlock(`划线 ${rows.length} 条${value.upstream_returned !== undefined ? `（上游返回 ${asText(value.upstream_returned)} 条含非划线项）` : ''}：\n${lines.join('\n')}\n${value.has_more ? `还有更多，cursor=${brief(value.cursor, 80)}。` : '已到末页。'}\n（仅收藏划线，笔记正文官方未提供）`);
      },
    },
    execute: (args) => callAccount(args.book_id ? 'highlights' : 'highlight-books', {
      ...(args.book_id ? { book_id: args.book_id } : {}),
      ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
      limit: Math.min(50, args.limit ?? 20),
    }),
```

</details>

**依据 4 · 源码核查**：[plugins/deepseek-harness/vendor/server/accounts.mjs:338-348](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/vendor/server/accounts.mjs#L338-L348)

底层highlight-books需要offset，缺省0。

<details>
<summary>查看原文（11行）</summary>

```text
export async function dispatchAccount(client, action, p) {
  const account = profileName(p.get('account') || 'default');
  switch (action) {
    case 'login/start': return client.loginStart(account);
    case 'login/poll': return client.loginPoll(account, p.get('login_id'));
    case 'status': return client.status(account);
    case 'logout': return client.logout(account);
    case 'bookshelf': return client.bookshelf(account, integer(p.get('offset'), 0, 0, 100000), integer(p.get('limit'), 20, 1, 100));
    case 'progress': return client.progress(account, p.get('book_id') || undefined, integer(p.get('offset'), 0, 0, 100000), integer(p.get('limit'), 20, 1, 100));
    case 'highlight-books': return client.highlightBooks(account, integer(p.get('offset'), 0, 0, 100000), integer(p.get('limit'), 20, 1, 100));
    case 'highlights': return client.highlights(account, id(p.get('book_id'), 'book_id'), integer(p.get('limit'), 20, 1, 100), p.get('cursor') || undefined);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 账号、隐私、本机位置与使用负担如何分开？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

基本阅读需要匹配的DSH Web客户端、connection/tools/sidebar服务、Node与上游站点可访问；本人书架/划线额外需要本人扫码和本地账号文件。Host复用连接层而不另开监听，源码显示生命周期注册，连接信任是否在真实宿主拒绝跨源是作者报告，本轮未验证。账号文件以临时文件0600和目录0700后rename写入，这不是加密存储或跨平台ACL已验证保证；退出登录只清本机凭据，不撤销官方会话。

localStorage的最近阅读记录是本机最多12项，写入失败不阻塞阅读；官方read_progress单位未标明，不能换算百分比或把本机位置当官方同步。UI账号访问与模型工具是不同曝光：调用本人账号工具后结果由工具输出进入对话，不能因为二维码不主动发模型就说账号数据从不入上下文。封面仅允许https和后缀域名名单，仍不构成全网络/隐私审计。

建议有相关阅读需求且接受账号结果进入对话的用户，先匿名搜索和已知公开章节，再按需登录查指定书；不把完整划线书目当覆盖保证。首次配置和登录、持续网络与模型/存储、接口变化/重新登录和分页复核的金额与耗时未测。遇到访问限制、未知字体、分页重复或不愿暴露本人数据，应停工具/退出本机登录，回官网核对；不要靠多次重试猜正文或完整性。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/deepseek-harness/index.js:315-355](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/index.js#L315-L355)

共享连接通道与账户dispatch。

<details>
<summary>查看原文（41行）</summary>

```text
export function apply(ctx) {
  const register = (path, handler) => ctx.effect(() => ctx.connection.fetch.register({
    path,
    methods: ['POST'],
    requestBody: 'buffered',
    fetch: handler,
  }), `fanqie-reader: ${path}`);

  register('/api/fanqie/ping', async (request) => {
    await request.text();
    return ok({ name: 'fanqie-reader', version: PLUGIN_VERSION, time: new Date().toISOString() });
  });

  register('/api/fanqie/capabilities', async (request) => {
    await request.text();
    return ok({ version: PLUGIN_VERSION, endpoints: endpointCapabilities });
  });

  register('/api/fanqie/dispatch', async (request) => {
    try {
      const body = await readJsonBody(request);
      const pathname = requireString(body.pathname, 'pathname');
      const params = scalarParams(body.params, 'params');
      const { client } = await localClient();
      return ok(await dispatch(client, pathname, params));
    } catch (error) {
      return fail(error);
    }
  });

  register('/api/fanqie/account', async (request) => {
    try {
      const body = await readJsonBody(request);
      const action = requireString(body.action, 'action');
      const params = scalarParams(body.params, 'params');
      const { accounts } = await localClient();
      return ok(await dispatchAccount(accounts, action, params));
    } catch (error) {
      return fail(error);
    }
  });
```

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness/vendor/server/accounts.mjs:25-46](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/vendor/server/accounts.mjs#L25-L46)

本机账号目录、权限与原子替换。

<details>
<summary>查看原文（22行）</summary>

```text
  constructor(root = process.env.FANQIE_ACCOUNT_DIR || join(process.platform === 'win32'
    ? process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local')
    : process.env.XDG_STATE_HOME || join(homedir(), '.local', 'state'), 'fanqie-mcp', 'accounts')) {
    this.root = resolve(root);
  }
  path(account) { return join(this.root, profileName(account) + '.json'); }
  async read(account) {
    const path = this.path(account);
    try { return JSON.parse(await readFile(path, 'utf8')); }
    catch (error) { if (error.code === 'ENOENT') return {}; throw new ApiError(500, '无法读取本机账号文件', 'ACCOUNT_STORAGE_ERROR'); }
  }
  async write(account, value) {
    profileName(account);
    await mkdir(this.root, { recursive: true, mode: 0o700 });
    // Windows packaged apps may redirect AppData to a different volume.
    this.root = await realpath(this.root);
    const target = this.path(account);
    const temp = target + '.' + randomUUID() + '.tmp';
    try {
      await writeFile(temp, JSON.stringify(value), { mode: 0o600, flag: 'wx' });
      await rename(temp, target);
    } finally { await unlink(temp).catch(error => { if (error.code !== 'ENOENT') throw error; }); }
```

</details>

**依据 3 · 源码核查**：[plugins/deepseek-harness/vendor/server/accounts.mjs:219-223](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/vendor/server/accounts.mjs#L219-L223)

logout仅清本地。

```text
  async logout(account) {
    return this.run(account, async () => {
      await this.store.write(account, {});
      return { account, status: 'disconnected', scope: 'local_credentials_only' };
    });
```

**依据 4 · 源码核查**：[plugins/deepseek-harness/client.js:261-276](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/client.js#L261-L276)

本地阅读记录与失败边界。

<details>
<summary>查看原文（16行）</summary>

```text
    const FONT_KEY = 'fanqie-reader.font.v1';
    const LEAD_KEY = 'fanqie-reader.lead.v1';
    const THEME_KEY = 'fanqie-reader.theme.v1';
    function readRecent() {
      try {
        const raw = localStorage.getItem(RECENT_KEY);
        const list = raw ? JSON.parse(raw) : [];
        return Array.isArray(list) ? list.slice(0, 12) : [];
      } catch { return []; }
    }
    function pushRecent(entry) {
      try {
        const list = readRecent().filter((row) => row.book_id !== entry.book_id);
        list.unshift({ ...entry, at: Date.now() });
        localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 12)));
      } catch { /* 本地记录失败不影响阅读 */ }
```

</details>

**依据 5 · 源码核查**：[plugins/deepseek-harness/client.js:183-189](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/client.js#L183-L189)

https封面来源限制。

```text
    const COVER_HOSTS = ['fanqienovel.com', 'pstatp.com', 'snssdk.com', 'byteimg.com', 'bytecdn.cn', 'bytedance.com', 'bytedance.net', 'toutiao.com', 'zjcdn.com', 'douyinpic.com'];
    function safeCoverUrl(value) {
      if (typeof value !== 'string' || !value.startsWith('https://')) return null;
      try {
        const host = new URL(value).hostname.toLowerCase();
        return COVER_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`)) ? value : null;
      } catch { return null; }
```

**依据 6 · 作者声明**：[plugins/deepseek-harness/README.md:60-76](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/README.md#L60-L76)

作者说明内容范围、位置、模型账号结果曝光。

<details>
<summary>查看原文（17行）</summary>

```text
- 正文是**番茄小说官网可见内容**（`completeness: website_visible_content`）。付费/锁定章节返回
  403 `ACCESS_REQUIRED`，空正文、未知字体返回 502，界面如实显示，不编造正文。
- 听书、漫画、短剧只展示官方搜索元数据，不支持播放或阅读。
- 搜索分页按接口区分：小说用 `offset/next_offset`，听书/漫画/短剧用官方不透明 `cursor`，
  划线用绑定账号与书的 `cursor`；`book_id`/`item_id` 全程按字符串传递。
- `read_progress` 为官方原始值（`progress_unit: upstream_unspecified`），未换算百分比。
- 最近打开/阅读位置是**本机记录**（localStorage），与官方账号进度无关；项目未实现向官方写进度。
- 独立笔记正文官方接口未提供，划线页只展示 `bookmark_form_type=2` 的收藏划线。
- 封面图仅渲染 `https:` 且域名在可信来源清单内的 URL，其余显示占位图。

## 隐私

- 账号数据在用户打开「我的」页面或调用本人账号对话工具时读取；扫码二维码经受控通道直达界面展示，
  不由插件主动发送到 AI 模型上下文与对话日志。
- 登录凭据沿用核心的本机存储（`%LOCALAPPDATA%/fanqie-mcp/accounts`，0700/0600），
  「退出登录」只清除本机凭据，不注销官方侧会话。
- 插件注册下文列出的7个对话工具；调用账号工具时，相应结果会进入当前 AI 对话上下文。插件代码未包含遥测采集逻辑。
```

</details>

#### 缺口

- 上游可用性、实际登录和宿主连接信任未执行，缺资源/人工对照。
  **影响**：不能保证本人账号读取、跨源拒绝或总体低成本。
  **进一步探讨**：固定宿主并在本人授权环境核登录/退出、分页与内容范围，记录请求/费用和人工核对。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 分页收据能否减少遗漏误判？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

假设在工具结果中加入“已读范围/可继续参数/尚未覆盖”收据，并校验下一页参数是否确实由工具schema接受，可以减少把首页误作全部结果的错误。它从Q02的具体适配缺口推导，先修offset接线才有意义；收据不能替代修复，也不应绕过访问限制。

已有has_more、next_offset、cursor和truncated都是反证，不能把分页提示缺失当本包普遍问题。增量是将它们与实际可传入的参数对账，区分官网可见、页内截断与账号书目未遍历。对用户的净价值还没有证据。

最小验证选择多页划线书目、指定书cursor、章节超过预览上限和上游拒绝四类样例，比较修复后的普通输出与收据输出。记录是否漏页/重复、用户能否正确续读、token和核对耗时；若修复本身已解决问题、收据不改善完整性或增加误导，则否定。此为未验证产品假设，不计入现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/deepseek-harness/index.js:250-276](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/index.js#L250-L276)

已有提示与实际参数不一致的具体依据。

<details>
<summary>查看原文（27行）</summary>

```text
function toolHighlights() {
  return {
    name: 'fanqie_my_highlights',
    description: '读取用户本人账号的收藏划线。省略 book_id 列出有划线的书；给 book_id 返回该书划线原文（完整句子、所属章节），用 cursor 翻页。独立笔记正文官方接口未提供。',
    parameters: {
      book_id: { type: 'string', description: '书籍 ID，数字字符串；省略则列出有划线/书签的书。' },
      cursor: { type: 'string', description: '上一次结果的翻页游标，原样回传；仅在继续翻同一本书时使用。' },
      limit: { type: 'integer', description: '每页条数，默认 20，最大 50。' },
    },
    output: {
      schema: looseObject({ has_more: { type: 'boolean' } }),
      render: (_args, value) => {
        if (value.books) {
          const rows = (value.books || []).slice(0, 50);
          const lines = rows.map((row, index) => `${index + 1}. ${brief(row.book_name || row.book_id, 26)} · book_id=${asText(row.book_id)} · 划线 ${asText(row.highlight_count)} · 书签 ${asText(row.bookmark_count)}`);
          return textBlock(`有收藏的书 ${rows.length} 本：\n${lines.join('\n')}\n${value.has_more ? '还有更多，用 offset 翻页（本工具传 book_id 后才返回划线原文）。' : '已到末页。'}`);
        }
        const rows = (value.highlights || []).slice(0, 50);
        const lines = rows.map((row, index) => `${index + 1}. 「${brief(row.text, 160)}」 —— ${brief(row.chapter_title || row.book_name, 24)}（item_id=${asText(row.item_id)}）`);
        return textBlock(`划线 ${rows.length} 条${value.upstream_returned !== undefined ? `（上游返回 ${asText(value.upstream_returned)} 条含非划线项）` : ''}：\n${lines.join('\n')}\n${value.has_more ? `还有更多，cursor=${brief(value.cursor, 80)}。` : '已到末页。'}\n（仅收藏划线，笔记正文官方未提供）`);
      },
    },
    execute: (args) => callAccount(args.book_id ? 'highlights' : 'highlight-books', {
      ...(args.book_id ? { book_id: args.book_id } : {}),
      ...(args.cursor === undefined ? {} : { cursor: args.cursor }),
      limit: Math.min(50, args.limit ?? 20),
    }),
```

</details>

**依据 2 · 源码核查**：[plugins/deepseek-harness/index.js:214-222](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/index.js#L214-L222)

已有章节截断标记作为反证。

```text
    execute: async (args) => {
      const limit = Math.min(20000, Math.max(200, Number(args.preview_chars) || 2000));
      const chapter = await callDispatch('/api/chapter', { item_id: args.item_id });
      const content = asText(chapter.content);
      const total = content.length;
      if (total <= limit) return { ...chapter, truncated: false, total_chars: total };
      // 在边界附近收尾，避免截在半个词上。
      const cut = content.lastIndexOf('\n', limit);
      return { ...chapter, content: content.slice(0, cut > limit * 0.6 ? cut : limit), truncated: true, total_chars: total };
```

**依据 3 · 源码核查**：[plugins/deepseek-harness/vendor/server/accounts.mjs:338-348](https://github.com/fysh1010/mcp-server-fanqie/blob/fd242a46d68f00dfb6d013aad0cbaaee98d148c1/plugins/deepseek-harness/vendor/server/accounts.mjs#L338-L348)

底层分页参数作为适配对账依据。

<details>
<summary>查看原文（11行）</summary>

```text
export async function dispatchAccount(client, action, p) {
  const account = profileName(p.get('account') || 'default');
  switch (action) {
    case 'login/start': return client.loginStart(account);
    case 'login/poll': return client.loginPoll(account, p.get('login_id'));
    case 'status': return client.status(account);
    case 'logout': return client.logout(account);
    case 'bookshelf': return client.bookshelf(account, integer(p.get('offset'), 0, 0, 100000), integer(p.get('limit'), 20, 1, 100));
    case 'progress': return client.progress(account, p.get('book_id') || undefined, integer(p.get('offset'), 0, 0, 100000), integer(p.get('limit'), 20, 1, 100));
    case 'highlight-books': return client.highlightBooks(account, integer(p.get('offset'), 0, 0, 100000), integer(p.get('limit'), 20, 1, 100));
    case 'highlights': return client.highlights(account, id(p.get('book_id'), 'book_id'), integer(p.get('limit'), 20, 1, 100), p.get('cursor') || undefined);
```

</details>

#### 缺口

- 没有收据原型或分页任务的用户实验。
  **影响**：不能确定新增展示是否优于仅修复参数。
  **进一步探讨**：以修复后的适配器作基线，单独测收据增量而非把bug修复收益算给新设计。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
