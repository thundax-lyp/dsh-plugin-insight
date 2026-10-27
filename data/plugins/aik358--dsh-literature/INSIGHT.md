# dsh-literature

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[fc6650e](https://github.com/Aik358/dsh-literature/tree/fc6650ef12747de08512d99c2f9c8388572b7724)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aik358/dsh-literature) [![npm 30d 1,892](https://img.shields.io/static/v1?label=npm+30d&message=1%2C892&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-literature) [![最新发布 2026-09-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-literature)
<!-- END META -->

> **功能**：在DSH侧窗识别学术文献、获取元数据和全文，提供PDF阅读、引用、笔记及本地库和目录保存。

> **亮点**：把标识识别、元数据、PDF阅读、引用与多目标归档接成会话内状态机，并用阶段错误和同key下载去重组织恢复；底层学术API和PDF.js归属上游，当前下载缺陷限制兑现。详见[Q02](#research-q02)。

> **主要限制**：全文候选push读取未声明trusted，源码与lib产物相同，静态可见会在候选构造触发错误；启动还会尝试无关Doctor detached supervisor。均未运行复现，不能当作已验收闭环。详见[Q03](#research-q03)。

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
  - [Q01 · 哪类研究者使用，如何才算找到并归档正确文献？](#detail-section-11)
  - [Q02 · 识别、元数据、下载、保存和阅读怎样接线，贡献是什么？](#detail-section-12)
  - [Q03 · 哪些网络、身份和写入风险最影响贡献？](#detail-section-13)
  - [Q04 · 启动、持续生效和失败恢复依赖什么？](#detail-section-14)
  - [Q05 · 全程成本和效果证据有哪些？](#detail-section-15)
  - [Q06 · 如何判断采用，后续有什么可证伪设计？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在DSH中研究写作的人将文献标识归为可复读资产；合格结果需身份、版本、全文与保存目标一致，不能仅依赖saved标签。

浏览器学术检索、PDF阅读器、外部文献库和手工引文是直接参照；插件减少会话搬运和提供内置资产库，不替代论文身份与主张核验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 标识与元数据 | DOI/arXiv/PMID/ISBN/标题解析 | 标题首候选需人工核对 |
| OA全文下载 | 多来源候选和重试 | 固定版本trusted未绑定影响候选构造 |
| 本地导入 | 手动PDF进入自有库 | 仅魔数校验，不证明论文身份 |
| 多目标保存 | 内置库、目录、Zotero Connector | 内置saved可无全文，外部库另需应用 |
| 阅读/引用/笔记 | 会话内读取和整理文献 | 引用格式不证明学术主张支持 |
| AI深读/图形 | 任务包或图形生成 | 模型与可选Python另有资源及权限条件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH web、Cordis ^4.0.1及webServer/tools/systemPrompt | 入口声明必需 | HTTP、模型工具和能力提示 | 注入不匹配无法依赖主流程 |
| 客户端runtime/connection/sidebar/settings/locale | web分支需要 | 阅读侧窗和设置 | 非web不提供阅读界面 |
| 可写DSH_HOME下配置、store和pdfs | 本地库必需 | 文献、笔记与PDF持久化 | 权限/磁盘异常进入错误，需自行备份 |
| Crossref/arXiv/OpenAlex等公开服务 | 新元数据及全文需要 | 外部查询和OA定位 | 网络和服务限制可失败，不估计必达 |
| Zotero 8.x Local API/Connector | 仅外部库模式需要 | 查库及写入外部文献库 | 内置库和目录模式不依赖该应用 |
| 自定义源与头 | 可选 | 用户自选镜像/机构端点 | 扩大网络及凭据边界 |
| Python/Matplotlib | 仅figure工具分支 | 生成图形 | 可选安装到自有venv或导出脚本/CSV降级 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户固定包版本、选择保存目标并备份自有库 | 配置目标明确，不把无全文saved当完成 |
| 加载 | 安装后重启DSH并打开文献侧窗 | web及模型工具入口可见 |
| 查找 | 输入标识、人工确认标题/作者/版本 | 标识和全文内容应互相核对 |
| 归档 | 下载或手动导入，确认保存模式及文件 | 下载缺陷未解决前不依赖OA自动闭环 |
| 恢复 | 按阶段错误重试；权限付费墙走用户下载与本地导入 | 留存原件，确认部分写入和重复条目 |

README说核心库不需外部应用并不涵盖所有工具。figure可检测Python并在用户安装路径建立venv、pip装Matplotlib；启动Doctor进程又是另一额外行为。Node>=20为README兼容声明，package未列engines，不能据此当全分支已验收。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包含PDF.js的分发包、本地库和可选外部应用资源；金额未知 | 安装重启、选模式、核对权限与版本 | 无本轮安装/导入耗时 |
| 持续使用 | 多API、PDF下载、磁盘与阅读解析；AI全文问答另耗模型资源 | 确认候选、阅读、校正引用和笔记 | 真实调用量、费用、资源峰值未知 |
| 失败恢复 | 候选源重试、重复下载、备份/恢复、可选Zotero交互 | 区分代码缺陷、付费墙和网络错误，检查部分写入 | 固定版本trusted缺陷不能靠网络重试修复 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话内集成 | 识别、工具、阶段状态、阅读与保存接线 | 端到端正确归档率和节时 |
| 元数据回退 | 标识类型选择多个API，标题首候选 | 错匹配率和版本归属正确性 |
| 并发下载保护 | 同key共享in-flight请求 | 当前下载自由变量缺陷影响闭环可用性 |
| 本地导入与保存 | PDF magic检查、自有库与多目标 | PDF真实性、损坏恢复和引用准确率 |

网络timeout在fetch取得响应阶段清理，后续readCappedBody逐块读取有字节上限但所读实现未另设完整body耗时预算，不能把30秒配置当整任务保证。多候选和多重试也会叠加耗时。PDF魔数只排除明显HTML等错误，不代表有效内容或正确论文。没有同任务浏览器+外部库对照，不给秒开、无卡顿、节省比例和ROI。

> **思考**：全文候选push读取未声明trusted，源码与lib产物相同，静态可见会在候选构造触发错误；启动还会尝试无关Doctor detached supervisor。均未运行复现，不能当作已验收闭环。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把标识识别、元数据、PDF阅读、引用与多目标归档接成会话内状态机，并用阶段错误和同key下载去重组织恢复；底层学术API和PDF.js归属上游，当前下载缺陷限制兑现。详见[Q02](#research-q02)。

最影响核心全文流程的是固定源码中的未绑定变量。fetch/pdf的push只声明url/source/kind/headers四个形参，构造对象却使用Boolean(trusted)，本模块没有trusted声明；发布入口lib/index.js也保留同一表达式。普通arXiv、元数据PDF或自定义源候选调用push时都会走这个自由变量读取，在没有同名环境绑定的通常模块执行中会抛ReferenceError。它发生在实际PDF下载前，外围pipeline只会把它归入fetch_failed；不能把重试或换OA源当作已解决。这里静态确认代码缺陷，未执行运行复现。

其他关键边界独立存在。标题选择首候选、PDF仅检查%PDF前缀，均不核对元数据与全文身份；网络私网保护只查字面量，代码明确不做DNS解析，不能声称完整SSRF隔离。HTTP围栏要求回环socket和Host，但写请求Origin只看是否为回环主机，不要求同端口同源，也不是用户鉴权。自定义源可携带用户头和allowPrivate许可，需视为明确扩展的信任边界。

启动还在5秒后调用Doctor自愈，跨profile寻找Doctor CLI并detached spawn supervisor，没有平台或文献功能开关；这一副作用超出文献归档。child.unref且没有保存进程用于清理，不能照注释保证随宿主退出。存储方面元数据延迟250ms落盘，PDF直接写；崩溃可能处在部分完成状态。可借鉴按key合并下载和阶段错误，但不能因此宣称事务化保存或无外部副作用。

<a id="detail-section-5"></a>

### 1.4 主要限制

全文候选push读取未声明trusted，源码与lib产物相同，静态可见会在候选构造触发错误；启动还会尝试无关Doctor detached supervisor。均未运行复现，不能当作已验收闭环。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。愿意继续研究者应先核清下载trusted变量与Doctor自动启动，再在可丢弃文献库核对身份、全文、写入目标和退出恢复，不把saved或回环称作完整保证。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持文献资产状态机与会话集成设计；固定版本全文候选存在未绑定变量，主下载闭环不足以依赖；身份收据是未实现假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/node/index.js、src/node/http.js、src/node/routes.js、src/node/pipeline.js、src/node/metadata/index.js、src/node/fetch/pdf.js、src/node/net.js、src/node/store/db.js、src/node/config.js、src/node/exporter.js、src/node/tools.js、src/node/pyenv.js、src/node/doctor-selfheal.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本检查宿主初始化、回环路由、识别/保存状态机、元数据、下载/网络、自有存储、导出、工具与Python/Doctor副作用，并核对lib中关键变量；未完整审计阅读器全部分支或运行目标代码。
- 下一步：进一步探讨可先以固定arXiv/DOI候选核对自由变量，再以同名/不同版本/错误PDF/无全文条目验证身份与归档状态，并观察额外进程生命周期。

**分析版本**

- **仓库**：[Aik358/dsh-literature](https://github.com/Aik358/dsh-literature)
- **版本号**：0.3.6（[固定提交 fc6650e](https://github.com/Aik358/dsh-literature/tree/fc6650ef12747de08512d99c2f9c8388572b7724)）
- **版本日期**：2026-09-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索分开“文件已存”与“文献身份已确认”的归档收据，用标识/版本、PDF哈希及用户核对减少同名和预印本错归档；尚未实现和验证。详见[Q06](#research-q06)。

进一步探讨可先以固定arXiv/DOI候选核对自由变量，再以同名/不同版本/错误PDF/无全文条目验证身份与归档状态，并观察额外进程生命周期。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 2330 | — | — | 29088 |
| .mjs | source | 7 | 1713 | 1331 | 228 | — |
| .js | source | 42 | 45420 | 40510 | 4437 | — |
| .cjs | source | 13 | 5611 | 4764 | 526 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Aik358/dsh-literature/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/Aik358/dsh-literature/issues?q=is%3Aissue+created%3A2026-09-22T04%3A59%3A41.387Z..2026-10-22T04%3A59%3A41.387Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Aik358/dsh-literature/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A59%3A41.387Z..2026-10-22T04%3A59%3A41.387Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本文献识别-获取-阅读-保存闭环的真实贡献与关键执行边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类研究者使用，如何才算找到并归档正确文献？

**研究主题**：场景与需求

#### 完整回答

面向在DSH中读论文、准备综述或组会并希望不离开当前会话的个人研究者。输入可以是DOI、arXiv、PMID、ISBN、URL或标题，插件把识别、元数据、下载、阅读、笔记和引用放进侧窗与模型工具。合格结果应确认文献身份、获得正确版本的全文、保存到明确目标并能再读和导出；元数据有一条匹配或状态saved不能单独证明这个闭环完成。

原来可以使用浏览器、公开学术API、PDF阅读器和Zotero等外部工具分别操作。插件增加会话内工作流和自有本地库，减少手工搬运标识、下载文件和引用字段的接线。原有学术数据库、PDF.js、引用规范和Zotero协议提供底层能力，不能把集成界面视为新的学术检索或真实性鉴定方法。

需要区分文献身份、内容理解与学术结论。标题搜索首候选可能是同名或近似条目，PDF格式正确不代表就是所选论文，生成引用更不证明引用支持写作论断。模型解读仍需对原文复核。敏感资料还需考虑全文进入当前模型会话与自定义下载源配置的访问范围。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:33-44](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/README.md#L33-L44)

作者说明识别、保存、阅读、AI联动及本地接口功能。

<details>
<summary>查看原文（12行）</summary>

```text
- **内置文献库** —— 识别、下载、保存、阅读、笔记全程自给自足，**不依赖任何外部软件**；可选导出到本地文献库（Zotero 生态）或目录
- **自动识别** —— 从模型回复或粘贴文本解析 `DOI` / `arXiv` / `PMID` / `ISBN` / 标题，自动去重
- **元数据抓取** —— Crossref / arXiv / OpenAlex，自动补全标题、作者、期刊、年份、摘要
- **全文下载** —— OA 多源（arXiv → OpenAlex OA → Unpaywall → DOI → 出版商链接），失败明确分类并支持重试；可配置自定义下载源
- **引用生成器** —— Scribbr 风格：参考文献 / 文内引用 / 直接引用（带页码）× APA 7 / GB/T 7714 / MLA 9 / Chicago 17 / **BibTeX**，一键复制；卡片**右键**直达引用菜单
- **库管理** —— 扫描导入文件夹（文件名自动识别 DOI/arXiv/标题）、从本地文献库批量导入、自动监控新 PDF、条目增删；**标签**与**状态过滤**、**排序**（添加时间/标题/年份）；**多选批量导出** RIS / BibTeX / CSL-JSON
- **侧窗阅读** —— 内置 PDF 阅读器：缩放、翻页、目录跳转、全文搜索、多色高亮与笔记（**支持简单 Markdown**：加粗/斜体/行内代码）；**阅读位置记忆**、**键盘快捷键**（←/→ 翻页、+/- 缩放、/ 搜索、Esc 关闭）、**夜读模式**（跟随暗色主题或手动开关）、**页面缩略图侧栏**（≤50 页）、**一键导出全部高亮与笔记为 Markdown**；**逐页加载**（按需取流式数据块，大文件秒开不卡顿）
- **AI 助手联动** —— ChatPDF / SciSpace 式划词操作：选中文字即可**翻译 / 解释 / 总结**；工具栏可**对全文提问**（基于 PDF 文本回答）或一键**总结全文**；结果直接发送到当前 DeepSeek Harness 对话，可继续追问
- **全网入口** —— 每条文献直达 Google Scholar / 百度学术 / 知网 / 来源页
- **冲突预览** —— 库中已有相似条目时，先展示字段级差异再决定保留 / 覆盖 / 合并
- **中英文双语界面** —— 界面语言可切换：**跟随宿主** / **简体中文** / **English**，选择后立即生效无需重启；服务端返回的提示与错误信息同样按当前语言呈现，英文界面下不会出现中文提示
- **完全本地** —— 所有请求经本机回环接口转发，无遥测、无云端中转、无账号依赖
```

</details>

**依据 2 · 源码核查**：[src/node/metadata/index.js:74-80](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/metadata/index.js#L74-L80)

标题解析按供应商返回的第一候选，不能当作已核验身份。

```text
  if (id.kind === 'title') {
    const cr = await firstResult(() => crossref.searchByTitle(id.value, { mailto, timeoutMs, rows: 3 }), 'crossref/title')
    if (cr?.length) return cr[0]
    const ax = await firstResult(() => arxiv.searchByTitle(id.value, { timeoutMs, rows: 3 }), 'arxiv/title')
    if (ax?.length) return ax[0]
    const oa = await firstResult(() => openalex.searchByTitle(id.value, { mailto, timeoutMs, rows: 3 }), 'openalex/title')
    if (oa?.length) return oa[0]
```

**依据 3 · 源码核查**：[src/node/pipeline.js:388-400](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/pipeline.js#L388-L400)

内置saved可以无全文，合格归档应另查pdf状态。

<details>
<summary>查看原文（13行）</summary>

```text
    if (wantMode === 'builtin') {
      // The built-in library: the entry and its PDF already live in the
      // plugin's own shadow store, so "saving" means confirming the item into
      // the library. No external app, no network — works offline.
      const updated = await store.patchItem(key, {
        state: 'saved',
        saveMode: 'builtin',
        savedAt: Date.now(),
        error: null,
        updatedAt: Date.now(),
      })
      sse.emitItem(updated)
      await finishTask(task, 'done', current.pdf?.path ? '已保存到内置文献库' : '已保存到内置文献库（无全文）')
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 识别、元数据、下载、保存和阅读怎样接线，贡献是什么？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

宿主初始化目录与shadow store后常驻挂载10类文献工具，注入短能力说明，注册统一回环路由、session hook、SSE heartbeat和可选目录watcher。scanText解析标识并去重，先保存discovered条目；resolveItem按来源拉取标准元数据，依类型走Crossref、arXiv、OpenAlex或ISBN渠道，状态变化写store并推SSE。

全文链设计为候选来源→下载→PDF magic检查→本地文件→条目pdf字段。fetchInFlight按条目key合并并发请求，防止双击下载交织写同一路径。保存内置库只确认状态，目录模式写PDF及CSL/RIS侧车，Zotero分支先确保PDF再走Connector，避免先建空父条目。失败分别进入resolve_failed、fetch_failed、save_failed，并按失败阶段重试；手动导入PDF检查魔数后可强制存内置库。

贡献是把会话标识到文献资产的状态机、阅读/引用/笔记与多目标保存组合起来，尤其明确阶段失败和可选外部库，而非发明元数据服务或PDF解析。不过固定版本全文候选构造含未绑定变量，实际可执行闭环要受Q03限制；本题解释的是源码接线和设计，不把设计链路完整当运行通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/node/index.js:36-82](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/index.js#L36-L82)

初始化、常驻工具、能力提示、路由/SSE/session接线。

<details>
<summary>查看原文（47行）</summary>

```text
  const ready = (async () => {
    await ensureDirs()
    await store.init()

    // Tools are mounted PERMANENTLY: the user asked for the skill to be
    // selectable any time, not gated behind signals. The activation machinery
    // (panel-open / intent detection) stays wired as a *positive* signal — it
    // refreshes recency tracking and can later drive a context-saving GUIDANCE
    // tier — but it no longer gates the tool surface, so nothing ever unmounts
    // the tools except disposal of the plugin itself.
    const activation = createActivation()
    activation.activate('always-on')
    const toolsCtl = registerTools(ctx)
    toolsCtl.mount()
    disposers.push(() => toolsCtl.unmount())
    disposers.push(() => activation.dispose())

    // Static capability note (byte-stable, prefix-cache safe): tells the model
    // the literature tools exist and when to reach for them. Kept short.
    try {
      disposers.push(
        ctx.systemPrompt.section({
          name: 'dsh:dsh-literature-capabilities',
          order: 9900,
          text: () =>
            [
              '本机已安装文献插件（dsh-literature）：内置文献库 + PDF/课件阅读 + 规范引用生成。',
              '用户提到「文献/论文/DOI/arXiv/引用/参考文献/综述/组会」或需要学术支撑时：',
              '- 找库里已有的 → literature_search（先查再答，不要凭空编造条目）',
              '- 看详情 → literature_get；结构化解读 → literature_deepread（速读/深读/精读三档，产出后用 literature_note 保存）',
              '- 写作引用 → literature_cite（APA/GB/MLA/Chicago/BibTeX，勿手工拼装）',
              '- 记录文献与当前工作的关系 → literature_note；用户明确要求画图时 → literature_figure',
              '纪律：先 search 再 get；未找到时如实说「库里没有」；编码任务中不要主动使用这些工具。',
            ].join('\n'),
        }),
      )
    } catch (e) {
      error('systemPrompt unavailable:', e.message)
    }

    disposers.push(...registerRoutes(ctx, { activation }))
    try {
      disposers.push(...registerSessionHook(ctx, { activation, detectIntent }))
    } catch (e) {
      error('session hook unavailable:', e.message)
    }
    disposers.push(sse.startHeartbeat())
```

</details>

**依据 2 · 源码核查**：[src/node/pipeline.js:92-133](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/pipeline.js#L92-L133)

识别、去重、discovered和SSE通知。

<details>
<summary>查看原文（42行）</summary>

```text
export async function scanText(text) {
  const found = extractIdentifiers(text)
  const existing = await store.listItems()
  const created = []

  for (const hit of found) {
    let provisional
    if (hit.kind === 'url') {
      // A bare URL: keep the URL itself as the entry identity until the page
      // resolves into a real record.
      provisional = buildItem({ title: hit.value })
      if (!provisional.key) continue
      provisional = { ...provisional, title: hit.value }
    } else {
      provisional = buildItem({
        doi: hit.kind === 'doi' ? hit.value : '',
        arxiv: hit.kind === 'arxiv' ? hit.value : '',
        isbn: hit.kind === 'isbn' ? hit.value : '',
        pmid: hit.kind === 'pmid' ? hit.value : '',
        title: hit.kind === 'title' ? hit.value : '',
      })
      if (!provisional.key) continue
    }

    const clash = existing.find((e) => sameWork(e, provisional)) ?? (await store.getItem(provisional.key))
    if (clash) continue

    const item = await store.putItem({
      ...provisional,
      kind: hit.kind,
      rawValue: hit.value,
      display: hit.display || hit.value,
      confidence: hit.confidence,
      state: 'discovered',
      createdAt: Date.now(),
    })
    existing.push(item)
    created.push(item)
    sse.emitItem(item)
  }

  return created
```

</details>

**依据 3 · 源码核查**：[src/node/pipeline.js:275-329](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/pipeline.js#L275-L329)

下载同key去重、阶段状态、持久文件及失败处理。

<details>
<summary>查看原文（55行）</summary>

```text
 * Per-key in-flight memo: a double-clicked download (or a retry racing the
 * original fetch) must not run two concurrent downloads that interleave
 * writeFile calls on the same path — a reader could see a truncated PDF.
 */
const fetchInFlight = new Map()

export function fetchItemPdf(key) {
  const running = fetchInFlight.get(key)
  if (running) return running
  const p = fetchItemPdfLocked(key).finally(() => fetchInFlight.delete(key))
  fetchInFlight.set(key, p)
  return p
}

async function fetchItemPdfLocked(key) {
  const item = await store.getItem(key)
  if (!item) throw failure('not_found', '条目不存在')
  if (item.pdf?.path) return item

  if (!item.record) {
    const resolved = await resolveItem(key)
    if (!resolved?.record) throw failure('no_metadata')
  }
  const current = await store.getItem(key)

  const task = await startTask(key, 'fetch')
  await update(key, { state: 'fetching', error: null })

  const config = await loadConfig()
  try {
    const result = await withRetry(
      (attempt) => {
        if (attempt > 1) sse.emitTask({ id: task.id, key, state: 'running', progress: 10, message: `第 ${attempt} 次尝试`, updatedAt: Date.now() })
        return fetchPdf(current.record, { timeoutMs: config.fetchTimeoutMs, unpaywallEmail: config.unpaywallEmail, customSources: config.customSources })
      },
      { ...config.retry, label: `fetch ${key}` },
    )

    const path = pdfPathFor(key)
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, result.buffer)
    const updated = await store.patchItem(key, {
      state: 'fetched',
      pdf: { path, size: result.buffer.length, source: result.source, url: result.url },
      error: null,
      updatedAt: Date.now(),
    })
    sse.emitItem(updated)
    await finishTask(task, 'done', `全文下载完成（${(result.buffer.length / 1024).toFixed(0)} KB）`)
    return updated
  } catch (e) {
    const err = failure(e.code ?? 'network', e.message, { detail: e.detail })
    await update(key, { state: 'fetch_failed', error: err })
    await finishTask(task, 'failed', err.message)
    return store.getItem(key)
```

</details>

**依据 4 · 源码核查**：[src/node/pipeline.js:388-430](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/pipeline.js#L388-L430)

三种保存模式及Zotero先全文策略。

<details>
<summary>查看原文（43行）</summary>

```text
    if (wantMode === 'builtin') {
      // The built-in library: the entry and its PDF already live in the
      // plugin's own shadow store, so "saving" means confirming the item into
      // the library. No external app, no network — works offline.
      const updated = await store.patchItem(key, {
        state: 'saved',
        saveMode: 'builtin',
        savedAt: Date.now(),
        error: null,
        updatedAt: Date.now(),
      })
      sse.emitItem(updated)
      await finishTask(task, 'done', current.pdf?.path ? '已保存到内置文献库' : '已保存到内置文献库（无全文）')
      return updated
    }

    if (wantMode === 'dir') {
      let buffer = null
      if (current.pdf?.path) {
        const { readFile } = await import('node:fs/promises')
        buffer = await readFile(current.pdf.path).catch(() => null)
      }
      result = await exportToDirectory(current.record, buffer)
      const updated = await store.patchItem(key, { state: 'saved', saveMode: 'dir', export: result, error: null, updatedAt: Date.now() })
      sse.emitItem(updated)
      await finishTask(task, 'done', '已导出到目录')
      return updated
    }

    // Zotero channel: PDF first, so a missing full text fails before we have
    // already created a parent item with nothing attached.
    let pdfBuffer = null
    if (current.pdf?.path) {
      const { readFile } = await import('node:fs/promises')
      pdfBuffer = await readFile(current.pdf.path).catch(() => null)
    }
    if (!pdfBuffer) {
      const fetched = await fetchItemPdf(key)
      // A failed download must abort the save — silently creating a parent
      // item with no attachment would leave a hollow record in the library.
      if (fetched?.pdf?.path) {
        const { readFile } = await import('node:fs/promises')
        pdfBuffer = await readFile(fetched.pdf.path).catch(() => null)
```

</details>

**依据 5 · 源码核查**：[src/node/pipeline.js:504-528](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/pipeline.js#L504-L528)

本地导入魔数校验并转内置保存。

<details>
<summary>查看原文（25行）</summary>

```text
export async function importPdf(key, buffer, { filename = 'imported.pdf', autoSave = true } = {}) {
  const item = await store.getItem(key)
  if (!item) throw failure('not_found', '条目不存在')
  if (!buffer || buffer.length < 8) throw failure('network', '文件内容为空或不是有效 PDF')

  // %PDF magic check, same rule the downloader enforces.
  const magic = buffer.subarray(0, 5)
  if (!magic.equals(Buffer.from('%PDF-', 'latin1'))) {
    throw failure('network', '所选文件不是有效的 PDF')
  }

  const path = pdfPathFor(key)
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, buffer)

  const updated = await update(key, {
    state: 'fetched',
    pdf: { path, size: buffer.length, source: 'local-import', url: '', filename },
    error: null,
  })

  let saved = updated
  if (autoSave) {
    // Force the built-in library regardless of the configured save mode.
    saved = await saveItem(key, { mode: 'builtin' })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些网络、身份和写入风险最影响贡献？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最影响核心全文流程的是固定源码中的未绑定变量。fetch/pdf的push只声明url/source/kind/headers四个形参，构造对象却使用Boolean(trusted)，本模块没有trusted声明；发布入口lib/index.js也保留同一表达式。普通arXiv、元数据PDF或自定义源候选调用push时都会走这个自由变量读取，在没有同名环境绑定的通常模块执行中会抛ReferenceError。它发生在实际PDF下载前，外围pipeline只会把它归入fetch_failed；不能把重试或换OA源当作已解决。这里静态确认代码缺陷，未执行运行复现。

其他关键边界独立存在。标题选择首候选、PDF仅检查%PDF前缀，均不核对元数据与全文身份；网络私网保护只查字面量，代码明确不做DNS解析，不能声称完整SSRF隔离。HTTP围栏要求回环socket和Host，但写请求Origin只看是否为回环主机，不要求同端口同源，也不是用户鉴权。自定义源可携带用户头和allowPrivate许可，需视为明确扩展的信任边界。

启动还在5秒后调用Doctor自愈，跨profile寻找Doctor CLI并detached spawn supervisor，没有平台或文献功能开关；这一副作用超出文献归档。child.unref且没有保存进程用于清理，不能照注释保证随宿主退出。存储方面元数据延迟250ms落盘，PDF直接写；崩溃可能处在部分完成状态。可借鉴按key合并下载和阶段错误，但不能因此宣称事务化保存或无外部副作用。

#### 证据与依据

**依据 1 · 源码核查**：[src/node/fetch/pdf.js:48-58](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/fetch/pdf.js#L48-L58)

push签名缺trusted却读取该变量，普通arXiv会调用。

<details>
<summary>查看原文（11行）</summary>

```text
async function candidates(record, { unpaywallEmail, customSources = [] } = {}) {
  const out = []

  const push = (url, source, kind = 'pdf', headers) => {
    if (!url) return
    out.push({ url: String(url), source, kind, headers, trustedSource: Boolean(trusted) })
  }

  if (record.arxiv) {
    const base = String(record.arxiv).replace(/v\d+$/, '')
    push(`https://arxiv.org/pdf/${base}`, 'arXiv', 'pdf')
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1435-1443](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/lib/index.js#L1435-L1443)

已提交运行产物也保留Boolean(trusted)，不是只存在于未发布src。

```text
  const out = [];
  const push2 = (url, source, kind = "pdf", headers) => {
    if (!url) return;
    out.push({ url: String(url), source, kind, headers, trustedSource: Boolean(trusted) });
  };
  if (record.arxiv) {
    const base = String(record.arxiv).replace(/v\d+$/, "");
    push2(`https://arxiv.org/pdf/${base}`, "arXiv", "pdf");
  }
```

**依据 3 · 源码核查**：[src/node/net.js:27-31](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/net.js#L27-L31)

作者明确仅字面量私网检查，DNS私网为残余。

```text
/**
 * True for hostname literals that resolve into private/loopback/link-local
 * space. This is a literal check only (no DNS resolution): it stops trivial
 * internal probing; a DNS name that resolves into private space is a
 * documented residual.
```

**依据 4 · 源码核查**：[src/node/http.js:37-49](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/http.js#L37-L49)

回环socket、Host和写请求回环Origin，不校验Origin端口或身份。

<details>
<summary>查看原文（13行）</summary>

```text
export function isLoopbackRequest(req) {
  const remote = req.socket?.remoteAddress ?? ''
  const fromLoopback = remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1'
  if (!fromLoopback) return false
  if (!LOOPBACK_HOSTNAMES.has(hostnameOf(req.headers?.host))) return false
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const origin = req.headers?.origin
    if (origin !== undefined) {
      const host = originHostname(origin)
      if (host === null || host === '' || !LOOPBACK_HOSTNAMES.has(host)) return false
    }
  }
  return true
```

</details>

**依据 5 · 源码核查**：[src/node/index.js:97-108](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/index.js#L97-L108)

启动后5秒调Doctor自愈，不由文献操作触发。

<details>
<summary>查看原文（12行）</summary>

```text
    // DSH Doctor supervisor self-heal: the host's own schtasks deployment
    // fails when the user path contains spaces, which leaves the web UI
    // spinning on /api/doctor/status forever. Spawn the supervisor under the
    // host process so it lives exactly as long as the host does.
    const doctorTimer = setTimeout(() => {
      if (disposed) return
      import('./doctor-selfheal.js')
        .then(({ ensureDoctorSupervisor }) => ensureDoctorSupervisor())
        .catch((e) => error('doctor supervisor heal unavailable:', e.message))
    }, 5000)
    doctorTimer.unref?.()
    disposers.push(() => clearTimeout(doctorTimer))
```

</details>

**依据 6 · 源码核查**：[src/node/doctor-selfheal.js:76-92](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/doctor-selfheal.js#L76-L92)

跨profile定位后detached/unref启动其他插件supervisor。

<details>
<summary>查看原文（17行）</summary>

```text
export async function ensureDoctorSupervisor() {
  try {
    const root = doctorRoot()
    if (await pipeAvailable(doctorPipeName(root))) return
    const cli = findDoctorCli()
    if (!cli) {
      warn('doctor supervisor heal skipped: dsh-doctor CLI not found')
      return
    }
    const child = spawn(process.execPath, [cli, 'supervisor'], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
      env: { ...process.env, DSH_DOCTOR_HOME: root },
    })
    child.unref()
    log(`doctor supervisor spawned (pid ${child.pid ?? '?'})`)
```

</details>

**依据 7 · 源码核查**：[src/node/store/db.js:25-36](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/store/db.js#L25-L36)

250ms调度持久化，非每个状态同步落盘。

<details>
<summary>查看原文（12行）</summary>

```text
function scheduleFlush() {
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    flushTimer = null
    flushing = persist().catch((e) => warn('persist failed:', e.message))
  }, 250)
  flushTimer.unref?.()
}

async function persist() {
  const snapshot = state ?? (await load())
  await writeJsonAtomic(STORE_PATH, snapshot)
```

</details>

#### 缺口

- 未复现未绑定变量对各下载分支的实际错误展示及重试行为。
  **影响**：不能给全文闭环可用性验收，也不将所有元数据/导入能力泛化为不可用。
  **进一步探讨**：可从固定版本最小arXiv、DOI与自定义源候选输入入手，核对变量绑定及fetch_failed反馈，再比较修正后的下载链。
- 未完整核查自定义头跨源重定向、DNS地址与Doctor进程退出生命周期。
  **影响**：不能认可网络或进程副作用的强隔离保证。
  **进一步探讨**：可从明确的本地端点/重定向与宿主退出序列讨论信任边界，区分配置许可和自动副作用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、持续生效和失败恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH web、Cordis ^4.0.1及webServer/tools/systemPrompt | 入口声明必需 | HTTP、模型工具和能力提示 | 注入不匹配无法依赖主流程 |
| 客户端runtime/connection/sidebar/settings/locale | web分支需要 | 阅读侧窗和设置 | 非web不提供阅读界面 |
| 可写DSH_HOME下配置、store和pdfs | 本地库必需 | 文献、笔记与PDF持久化 | 权限/磁盘异常进入错误，需自行备份 |
| Crossref/arXiv/OpenAlex等公开服务 | 新元数据及全文需要 | 外部查询和OA定位 | 网络和服务限制可失败，不估计必达 |
| Zotero 8.x Local API/Connector | 仅外部库模式需要 | 查库及写入外部文献库 | 内置库和目录模式不依赖该应用 |
| 自定义源与头 | 可选 | 用户自选镜像/机构端点 | 扩大网络及凭据边界 |
| Python/Matplotlib | 仅figure工具分支 | 生成图形 | 可选安装到自有venv或导出脚本/CSV降级 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户固定包版本、选择保存目标并备份自有库 | 配置目标明确，不把无全文saved当完成 |
| 加载 | 安装后重启DSH并打开文献侧窗 | web及模型工具入口可见 |
| 查找 | 输入标识、人工确认标题/作者/版本 | 标识和全文内容应互相核对 |
| 归档 | 下载或手动导入，确认保存模式及文件 | 下载缺陷未解决前不依赖OA自动闭环 |
| 恢复 | 按阶段错误重试；权限付费墙走用户下载与本地导入 | 留存原件，确认部分写入和重复条目 |

README说核心库不需外部应用并不涵盖所有工具。figure可检测Python并在用户安装路径建立venv、pip装Matplotlib；启动Doctor进程又是另一额外行为。Node>=20为README兼容声明，package未列engines，不能据此当全分支已验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/node/index.js:12-16](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/index.js#L12-L16)

必要服务注入。

```text
 * Cordis service dependencies. `webServer` gives us loopback-only HTTP routes
 * (including the SSE stream), `tools` lets the model trigger lookups and saves
 * directly instead of us guessing from reply text.
 */
export const inject = ['webServer', 'tools', 'systemPrompt']
```

**依据 2 · 源码核查**：[src/node/config.js:10-26](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/config.js#L10-L26)

本地配置、存储目录及默认内置保存。

<details>
<summary>查看原文（17行）</summary>

```text
export function dshHome() {
  const fromEnv = process.env.DSH_HOME || process.env.DSH_CONFIG_DIR
  if (fromEnv) return resolve(fromEnv)
  return resolve(homedir(), '.dsh')
}

export const CONFIG_PATH = join(dshHome(), 'dsh-literature.json')
export const STORE_DIR = join(dshHome(), 'storages', 'dsh-literature')
export const PDF_DIR = join(STORE_DIR, 'pdfs')
export const STORE_PATH = join(STORE_DIR, 'store.json')

const DEFAULTS = {
  version: 1,
  /** 'builtin' keeps everything inside the plugin's own shadow library (no
   *  external app needed); 'zotero' writes through the Zotero-ecosystem
   *  Connector API (requires the app running); 'dir' exports to `dirPath`. */
  saveMode: 'builtin',
```

</details>

**依据 3 · 源码核查**：[src/node/pyenv.js:97-132](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/pyenv.js#L97-L132)

可选figure的解释器与显式venv安装路径。

<details>
<summary>查看原文（36行）</summary>

```text
/**
 * Preferred interpreter for figure rendering: the plugin venv if it exists,
 * else any system python that already has matplotlib.
 */
export async function figureInterpreter() {
  if (venvExists()) {
    const p = await probe(venvPython())
    if (p?.hasMatplotlib) return { ...p, source: 'venv' }
    if (p) return { ...p, source: 'venv', hasMatplotlib: false }
  }
  for (const p of await detectPythons()) {
    if (p.hasMatplotlib) return { ...p, source: 'system' }
  }
  return null
}

/**
 * Create the venv (if needed) and pip-install matplotlib into it. Long-running
 * (~30-90s); the route calling this must tolerate that or run it fire-and-forget.
 */
export async function installFigureDeps(onLog = () => {}) {
  const pythons = await detectPythons({ force: true })
  const base = pythons.find((p) => p.venvCapable)
  if (!base) return { ok: false, error: '未找到可用的 Python（需要带 venv 模块的 Python 3.8+）' }
  const dir = venvDir()
  if (!venvExists(dir)) {
    onLog('创建虚拟环境…')
    const r = await run(base.exe, ['-m', 'venv', dir], { timeout: 120000 })
    if (!r.ok) return { ok: false, error: 'venv 创建失败：' + (r.err || r.out) }
  }
  const py = venvPython(dir)
  onLog('安装 matplotlib…')
  const r = await run(py, ['-m', 'pip', 'install', '--disable-pip-version-check', 'matplotlib'], { timeout: 300000 })
  if (!r.ok) return { ok: false, error: 'matplotlib 安装失败：' + (r.err || r.out).slice(0, 400) }
  cache = { at: 0, pythons: [] }
  return { ok: true, python: py, dir }
```

</details>

**依据 4 · 作者声明**：[README.md:119-131](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/README.md#L119-L131)

作者隐私与兼容声明需与源码实际网络/服务分支对照。

<details>
<summary>查看原文（13行）</summary>

```text
## 🔐 数据与隐私

- 元数据与全文请求直连公开学术 API（Crossref / arXiv / OpenAlex / Unpaywall），**不经任何第三方中转**
- 插件仅监听 `127.0.0.1` 回环路由，非本机请求一律 403
- 无遥测、无统计、不上传任何本地数据

## 🖥️ 兼容性

| 组件 | 版本 |
|---|---|
| DeepSeek Harness | ≥ 0.1.1-rc.2（Cordis v4） |
| 本地文献库（可选） | 8.x（Zotero 生态，Local API v3 / Connector API） |
| Node | ≥ 20 |
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 全程成本和效果证据有哪些？

**研究主题**：效果与总成本

#### 完整回答

合格任务是把指定且正确版本文献归档、可再次阅读，并生成不误导的引用或笔记。不能用条目数量、下载字节或saved状态代替完成率。成本还包括核对错匹配、重试下载、维护自定义源和外部库失败恢复。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包含PDF.js的分发包、本地库和可选外部应用资源；金额未知 | 安装重启、选模式、核对权限与版本 | 无本轮安装/导入耗时 |
| 持续使用 | 多API、PDF下载、磁盘与阅读解析；AI全文问答另耗模型资源 | 确认候选、阅读、校正引用和笔记 | 真实调用量、费用、资源峰值未知 |
| 失败恢复 | 候选源重试、重复下载、备份/恢复、可选Zotero交互 | 区分代码缺陷、付费墙和网络错误，检查部分写入 | 固定版本trusted缺陷不能靠网络重试修复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话内集成 | 识别、工具、阶段状态、阅读与保存接线 | 端到端正确归档率和节时 |
| 元数据回退 | 标识类型选择多个API，标题首候选 | 错匹配率和版本归属正确性 |
| 并发下载保护 | 同key共享in-flight请求 | 当前下载自由变量缺陷影响闭环可用性 |
| 本地导入与保存 | PDF magic检查、自有库与多目标 | PDF真实性、损坏恢复和引用准确率 |

网络timeout在fetch取得响应阶段清理，后续readCappedBody逐块读取有字节上限但所读实现未另设完整body耗时预算，不能把30秒配置当整任务保证。多候选和多重试也会叠加耗时。PDF魔数只排除明显HTML等错误，不代表有效内容或正确论文。没有同任务浏览器+外部库对照，不给秒开、无卡顿、节省比例和ROI。

#### 证据与依据

**依据 1 · 源码核查**：[src/node/metadata/index.js:35-80](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/metadata/index.js#L35-L80)

多API回退及标题首候选，解释潜在收益和误配成本。

<details>
<summary>查看原文（46行）</summary>

```text
export async function resolveIdentifier(id, { timeoutMs = 20000, unpaywallEmail = '' } = {}) {
  const mailto = unpaywallEmail || undefined

  if (id.kind === 'doi') {
    return (
      (await firstResult(() => crossref.fetchByDoi(id.value, { mailto, timeoutMs }), 'crossref/doi')) ??
      (await firstResult(() => openalex.fetchByDoi(id.value, { mailto, timeoutMs }), 'openalex/doi'))
    )
  }

  if (id.kind === 'arxiv') {
    const direct = await firstResult(() => arxiv.fetchById(id.value, { timeoutMs }), 'arxiv/id')
    if (direct) {
      // A preprint that has since been published carries a DOI worth preferring.
      if (direct.doi) {
        const published = await firstResult(() => crossref.fetchByDoi(direct.doi, { mailto, timeoutMs }), 'crossref/doi')
        if (published) return { ...published, arxiv: direct.arxiv, pdfUrl: direct.pdfUrl, preprint: direct }
      }
      return direct
    }
    return null
  }

  if (id.kind === 'pmid') {
    const doi = await pmidToDoi(id.value, timeoutMs)
    if (doi) {
      const rec = await firstResult(() => crossref.fetchByDoi(doi, { mailto, timeoutMs }), 'crossref/doi')
      if (rec) return { ...rec, pmid: id.value }
    }
    return null
  }

  if (id.kind === 'isbn') {
    // Open Library is the dependable keyless source for ISBN lookup (OpenAlex
    // has no isbn filter; Google Books rate-limits anonymous requests).
    const { fetchByIsbn } = await import('./isbn.js')
    return firstResult(() => fetchByIsbn(id.value, { timeoutMs }), 'openlibrary/isbn')
  }

  if (id.kind === 'title') {
    const cr = await firstResult(() => crossref.searchByTitle(id.value, { mailto, timeoutMs, rows: 3 }), 'crossref/title')
    if (cr?.length) return cr[0]
    const ax = await firstResult(() => arxiv.searchByTitle(id.value, { timeoutMs, rows: 3 }), 'arxiv/title')
    if (ax?.length) return ax[0]
    const oa = await firstResult(() => openalex.searchByTitle(id.value, { mailto, timeoutMs, rows: 3 }), 'openalex/title')
    if (oa?.length) return oa[0]
```

</details>

**依据 2 · 源码核查**：[src/node/net.js:101-124](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/net.js#L101-L124)

fetch响应后清除计时器，不能直接等同body全程预算。

<details>
<summary>查看原文（24行）</summary>

```text
export async function httpGet(url, { timeoutMs = 30000, headers = {}, accept, signal, allowPrivate = false } = {}) {
  const onAbort = () => controller.abort()
  let controller
  let current = String(url)
  try {
    for (let hop = 0; ; hop += 1) {
      assertFetchableUrl(current, { allowPrivate })
      controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeoutMs)
      if (signal) {
        if (signal.aborted) controller.abort()
        else signal.addEventListener('abort', onAbort, { once: true })
      }
      let res
      try {
        res = await fetch(current, {
          method: 'GET',
          redirect: 'manual',
          signal: controller.signal,
          headers: { 'user-agent': UA, ...(accept ? { accept } : {}), ...headers },
        })
      } finally {
        clearTimeout(timer)
      }
```

</details>

**依据 3 · 源码核查**：[src/node/net.js:155-174](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/net.js#L155-L174)

body大小约束与循环读取，不证明端到端耗时。

<details>
<summary>查看原文（20行）</summary>

```text
/** Reads a response body with a hard byte budget; releases the body on error. */
async function readCappedBody(res, maxBytes, url) {
  const declared = Number(res.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > maxBytes) {
    res.body?.cancel().catch(() => {})
    throw new FetchFailure(`GET ${url} body too large (${declared} > ${maxBytes} bytes)`, { code: 'too_large', retryable: false })
  }
  if (!res.body) return Buffer.from(await res.arrayBuffer())
  const reader = res.body.getReader()
  const chunks = []
  let size = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes) throw new Error('body budget exceeded')
      chunks.push(Buffer.from(value))
    }
    return Buffer.concat(chunks)
```

</details>

**依据 4 · 源码核查**：[src/node/fetch/pdf.js:16-18](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/fetch/pdf.js#L16-L18)

仅%PDF魔数校验，与文献身份/内容有效性不同。

```text
function looksLikePdf(buffer) {
  if (!buffer || buffer.length < 8) return false
  return buffer.subarray(0, 5).equals(PDF_MAGIC)
```

#### 缺口

- 缺少真实归档任务成功率、错匹配率、人工复核和模型/网络总成本。
  **影响**：无法证明集成闭环相对原工具链的净收益。
  **进一步探讨**：可按DOI/arXiv/同名标题/付费墙/本地导入分层，比较合格结果和总人工时间，修正确定缺陷后再谈性能。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何判断采用，后续有什么可证伪设计？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议观察，暂不直接推荐当前固定版本日常启用。识别、阅读、笔记和本地资产组织有明确价值，但全文候选自由变量缺陷直接阻断主张中的OA下载路径，Doctor自愈带来与文献无关的后台进程范围。能手动导入不等于整个自动链可用，庞大能力列表不应掩盖这两项问题。

若继续评估，应先厘清trusted参数与Doctor启动授权，再使用可丢弃本地库，按标识核对元数据和全文、检查无全文saved、外部导出和退出恢复。不要配置敏感自定义头或把私人PDF送入未明确了解的模型服务；回环UI也不等于全文或请求都不离开本机。若无法解释进程、写入目标或下载失败，停止依赖该链。

从元数据和全文可能错配可推导未验证的文献归档收据。保存时记录标识/版本、候选来源、实际PDF哈希与页首元数据、用户确认及保存目标，让“已取得文件”和“确认正确文献”成为不同状态。它会增加解析和复核，不能只为形式复杂化。最小对照用同名论文、预印本/正式版、错误PDF和只有元数据的样本，比较现有saved与收据版能否减少错归档、错误引用及恢复时间。若只增加人工负担而不减误判，应否定收益。未实现假设计分为零增量，不混入本插件已有创新；本轮没有宿主安装或卸载验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/node/fetch/pdf.js:48-58](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/fetch/pdf.js#L48-L58)

已识别自由变量缺陷影响下载主路径。

<details>
<summary>查看原文（11行）</summary>

```text
async function candidates(record, { unpaywallEmail, customSources = [] } = {}) {
  const out = []

  const push = (url, source, kind = 'pdf', headers) => {
    if (!url) return
    out.push({ url: String(url), source, kind, headers, trustedSource: Boolean(trusted) })
  }

  if (record.arxiv) {
    const base = String(record.arxiv).replace(/v\d+$/, '')
    push(`https://arxiv.org/pdf/${base}`, 'arXiv', 'pdf')
```

</details>

**依据 2 · 源码核查**：[src/node/doctor-selfheal.js:76-92](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/doctor-selfheal.js#L76-L92)

额外后台进程需要纳入采用范围。

<details>
<summary>查看原文（17行）</summary>

```text
export async function ensureDoctorSupervisor() {
  try {
    const root = doctorRoot()
    if (await pipeAvailable(doctorPipeName(root))) return
    const cli = findDoctorCli()
    if (!cli) {
      warn('doctor supervisor heal skipped: dsh-doctor CLI not found')
      return
    }
    const child = spawn(process.execPath, [cli, 'supervisor'], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
      env: { ...process.env, DSH_DOCTOR_HOME: root },
    })
    child.unref()
    log(`doctor supervisor spawned (pid ${child.pid ?? '?'})`)
```

</details>

**依据 3 · 源码核查**：[src/node/pipeline.js:388-400](https://github.com/Aik358/dsh-literature/blob/fc6650ef12747de08512d99c2f9c8388572b7724/src/node/pipeline.js#L388-L400)

无全文仍可saved，为归档收据区分状态提供依据。

<details>
<summary>查看原文（13行）</summary>

```text
    if (wantMode === 'builtin') {
      // The built-in library: the entry and its PDF already live in the
      // plugin's own shadow store, so "saving" means confirming the item into
      // the library. No external app, no network — works offline.
      const updated = await store.patchItem(key, {
        state: 'saved',
        saveMode: 'builtin',
        savedAt: Date.now(),
        error: null,
        updatedAt: Date.now(),
      })
      sse.emitItem(updated)
      await finishTask(task, 'done', current.pdf?.path ? '已保存到内置文献库' : '已保存到内置文献库（无全文）')
```

</details>

#### 缺口

- 文献身份收据是否减少错归档和误引用尚无对照。
  **影响**：只能作为设计方向，不增加当前正确性或采用等级。
  **进一步探讨**：可先用已知身份的混淆样本比较错归档和人工复核时间，决定是否值得新增状态。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
