# dsh-inpage-translator

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[4a57cad](https://github.com/7gzgn/dsh-inpage-translator/tree/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在DSH浏览器页面注入翻译按钮，按文本去重分块调用宿主模型，缓存译文并提供翻译、还原与状态工具。

> **核心亮点**：将页面按钮、宿主模型、原文去重缓存和预算/部分失败回执接在一起，减少复制接线。详见[Q02](#research-q02)。

> **风险与缺陷**：父元素textContent覆盖会丢子结构，restore只返扁平文本；未严格过滤可见内容，页面DOM请求不是可信人工许可，异步回填缺文档版本。详见[Q03](#research-q03)、[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 解决什么阅读场景，什么算完成？](#detail-section-11)
  - [Q02 · 页面到模型再回填的链条与贡献是什么？](#detail-section-12)
  - [Q03 · 可见文本、保结构与还原承诺是否成立？](#detail-section-13)
  - [Q04 · 按钮点击是否能证明读者授权发送页面？](#detail-section-14)
  - [Q05 · 启动和使用需核哪些条件？](#detail-section-15)
  - [Q06 · 首次、持续和失败成本与效果是什么？](#detail-section-16)
  - [Q07 · 推荐结论与继续探讨入口是什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在DSH内置浏览器阅读外语网页、已有可用模型路线的用户。浮动按钮允许在页面直接翻译/还原，工具translate_page也能显式选会话与语言。不是独立浏览器扩展、OCR或通用网页内容安全隔离器。

合格结果应是选对页面、得到忠实译文、明确哪些段落未翻，并保持链接/交互结构和可靠还原。基线是复制到聊天翻译再对照原页，或浏览器已有翻译功能。增量是宿主模型与页面按钮/会话接线；与成熟浏览器翻译器的质量/结构保真尚无对照，作者“每个可见节点/还原”必须与实现分开。

复制到聊天翻译或浏览器已有翻译；增量是DSH页面与模型接线，质量/保真/费用无同页对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 页面按钮 | 点击/拖拽/还原 | 页面DOM状态非宿主授权 |
| 翻译工具 | 显式session/语言/预算 | 活跃会话启发式需核 |
| 去重缓存 | 少重复字符串请求 | 内存4000条，非翻译质量保证 |
| 分块模型 | 预算与部分失败回执 | 原文发宿主模型，非全页必成功 |
| 自动巡场 | 导航后补按钮 | 默认多会话，失败三次跳过 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 不满足时 |
| --- | --- | --- |
| Node>=18与兼容DSH | ESM工具/提示注册 | 包声明rc.2兼容并非本轮加载验收 |
| 内置browser及可execute会话 | DOM脚本/按钮 | 私有providers.sessions依宿主实现 |
| llm与显式/默认模型路线 | 翻译请求 | 缺路线明确错误 |
| 页面内容披露许可 | 原文发模型 | 不因无自持key而免披露 |
| 非关键交互页/可重新加载原文 | 恢复手段 | restore不恢复原DOM结构 |



#### 使用流程

| 步骤 | 动作 | 判据/失败处理 |
| --- | --- | --- |
| 配置 | 先关闭autoInject，选可信非敏感页 | 核模型和站点范围 |
| 选页 | 指定session并核标题URL | 活跃序号不代替焦点 |
| 小页翻译 | 固定较小正maxChars，检查回执 | 对照漏段/缓存/错误 |
| 核结构 | 检链接/表单/双语及原文 | 发现破坏则重新加载原页 |
| 维护 | 卸载核timer停止、刷新清页面注入 | 默认失败三次跳过不自动恢复 |

固定Git共有八个文件，包括README、LICENSE、package、cordis.patch.yml和四个lib。patch实际插入plugin-inpage-translator行；package声明的lib/text-chunks.js和test/smoke.mjs未在固定树出现。main与patch存在，不能据缺失子路径/测试断言核心必然无法加载。npm实际tarball未检查，不把Git缺文件扩展为发布物结论。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 复用browser/宿主模型，不自持key | 配模型、站点许可与小页保真核验 | 无工时/订阅价格数据；无独立API不等宿主模型总费用为0 |
| 持续使用 | 原文/提示/译文tokens，每1.5秒最多六会话脚本巡查 | 核漏段、缓存和译文质量 | 24000字符不是金额/token硬账单，实际计费未知 |
| 失败恢复 | 漏译/JSON错块重试再耗模型，重载页面资源 | 检错误/恢复原页及表单状态 | 已有表单状态不能靠restore保证恢复，工时/金额未知 |



#### 效果

| 目标 | 源码增量 | 边界 |
| --- | --- | --- |
| 少复制粘贴 | 页面按钮和编号回填 | 结构保真缺口明显 |
| 降重复请求 | 原文去重+4000条缓存 | 仅进程内，无质量/版本失效判据 |
| 限单轮规模 | 自适应4000–24000字符与分块 | 多会话/重复触发不等于总预算 |
| 容忍部分失败 | warnings/漏项/调用统计 | 有译文不代表全页成功 |

单块stream超时AbortError直接返回已收文本，非空结果带error finish也可能进入解析；JSON可解析部分输出不自动等于完整成功。并行最多四、默认三减少等待可能，但注释称token花销不变只是相同请求规模的设计解释，不是计费证明。翻译质量、总时延和费用优势均无同页对照，不填省钱百分比。

> **思考**：父元素textContent覆盖会丢子结构，restore只返扁平文本；未严格过滤可见内容，页面DOM请求不是可信人工许可，异步回填缺文档版本。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将页面按钮、宿主模型、原文去重缓存和预算/部分失败回执接在一起，减少复制接线。详见[Q02](#research-q02)。

将页面按钮、宿主模型、原文去重缓存和预算/部分失败回执接在一起，减少复制接线。详见[Q02](#research-q02)。

源码用TreeWalker找文本，但实际标记的是父元素，orig保存父元素整个textContent，回填和restore都写父元素textContent。只要父元素还含链接、强调或交互子节点，写入就会替换其整个子树；restore只能恢复扁平文本，不能恢复原元素及绑定。这个静态语义足以否定无条件“原网页完整可还原”，不需要把它表述为已经做了浏览器复现。

收集跳过指定标签/skip祖先，但只查直接父的contenteditable/aria-hidden，没有computedStyle/布局可见性过滤。隐藏祖先里的文本或父元素包含的其他文字可能进入候选，不能把这批数据当严格可见文本。iframe只统计不进入，README已承认同源也不翻。

handleClick在模型await前收集，await后只凭原session和数字编号回填，缺页面URL/文档版本/文本hash一致性核验。导航或页面重写期间可能失效/错配，需要具体时序对照，不能声称已发生跨页泄露。collect重跑清除orig/node/trans，直接对已翻内容再translate可能把译文当新原文；先restore与重新加载原页比不断重跑更可靠。

此外mode传给apply却没有分支，replace与bilingual在这条实现均写textContent，双语宣传不由这一分支支撑。textContent避免把模型输出当HTML执行，是有用限制，但不能补回结构保真。

<a id="detail-section-5"></a>

### 1.4 主要限制

父元素textContent覆盖会丢子结构，restore只返扁平文本；未严格过滤可见内容，页面DOM请求不是可信人工许可，异步回填缺文档版本。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，先修文本节点/还原、宿主许可和文档版本边界，再考虑非敏感小页试用。详见[Q07](#research-q07)。

合格结果应是选对页面、得到忠实译文、明确哪些段落未翻，并保持链接/交互结构和可靠还原。基线是复制到聊天翻译再对照原页，或浏览器已有翻译功能。增量是宿主模型与页面按钮/会话接线；与成熟浏览器翻译器的质量/结构保真尚无对照，作者“每个可见节点/还原”必须与实现分开。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。按钮/缓存/字符预算明确，DOM结构还原与页面授权/异步版本边界需先收紧。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/page-script.js、lib/translate.js、lib/constants.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定Git四lib关键页面/模型/轮询/预算链及README/包/patch，树含八文件；不打开网页、调用模型或运行目标测试。
- 下一步：可继续以无秘密本地HTML/mock检嵌套DOM、隐藏祖先、伪请求、导航竞争和部分JSON，对照结构/授权/预算。

**分析版本**

- **仓库**：[7gzgn/dsh-inpage-translator](https://github.com/7gzgn/dsh-inpage-translator)
- **版本号**：0.2.4（[固定提交 4a57cad](https://github.com/7gzgn/dsh-inpage-translator/tree/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索宿主许可/文档版本绑定的独立Text补丁和逆操作，核拒绝未授权与过期回填、结构还原及成本；未实现。详见[Q07](#research-q07)。

可继续以无秘密本地HTML/mock检嵌套DOM、隐藏祖先、伪请求、导航竞争和部分JSON，对照结构/授权/预算。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 1960 | 1418 | 418 | — |
| .md | source | 1 | 143 | — | — | 2247 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-inpage-translator/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-inpage-translator/issues?q=is%3Aissue+created%3A2026-09-22T07%3A38%3A53.554Z..2026-10-22T07%3A38%3A53.554Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-inpage-translator/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A38%3A53.554Z..2026-10-22T07%3A38%3A53.554Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核网页翻译的页面选择、DOM保真/还原、模型披露与许可、预算缓存、依赖分发和推荐边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 解决什么阅读场景，什么算完成？

**研究主题：**场景与需求

#### 完整回答

面向在DSH内置浏览器阅读外语网页、已有可用模型路线的用户。浮动按钮允许在页面直接翻译/还原，工具translate_page也能显式选会话与语言。不是独立浏览器扩展、OCR或通用网页内容安全隔离器。

合格结果应是选对页面、得到忠实译文、明确哪些段落未翻，并保持链接/交互结构和可靠还原。基线是复制到聊天翻译再对照原页，或浏览器已有翻译功能。增量是宿主模型与页面按钮/会话接线；与成熟浏览器翻译器的质量/结构保真尚无对照，作者“每个可见节点/还原”必须与实现分开。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-13](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/README.md#L3-L13)

作者常驻按钮/文本还原承诺。

<details>
<summary>查看原文（11行）</summary>

```text
**你把页面给 AI 看，它替你把整页翻成中文。**

**按钮是常驻的**：插件后台每 1.5 秒扫一遍所有活着的浏览器会话，自动把「🈯 译」放进每一张有内容的页面 ——
你**不用先叫 AI 做事**，看到它点一下，页面上**每一个可见文本节点原地换成译文**；再点一下，回到原文。
页面导航了？下一次巡场会把按钮重新装上去。

按钮可以**长按拖动**（按住 320ms 进入拖拽），拖到左右边缘 48px 内会**自动吸成贴边的小把手**，点一下再展开 —— 它不会一直挡着你的正文。

> 它是第 8 个作品，也是**第一个"动别人的网页"的插件**：
> 前 7 个动的是本机、文件、窗口、发布链路，这个动的是一张陌生的页面 ——
> 所以两条边界写在最前面：**只改文本、只加内联样式**；**插件自己不持有任何 API key**。
```

</details>

**依据 2 · 作者声明**：[README.md:19-30](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/README.md#L19-L30)

工具和回执定位。

<details>
<summary>查看原文（12行）</summary>

```text
| 步 | 动作 | 细节 |
| --- | --- | --- |
| ① | 找会话 | **枚举所有活着的浏览器会话**，自动挑最活跃、有页面的那一个（`session` 参数可显式指定） |
| ①' | **后台巡场** | 每 1.5 秒扫一遍：补按钮（**导航后重装**）+ 读点击（**点了就翻，不用等工具调用**）—— 这就是"常驻" |
| ② | 装浮层按钮 | 内联样式 + `position:fixed` + `z-index:2147483647`，**不注入 `<style>`**（页面 CSP 管不到它） |
| ③ | 打标 | `TreeWalker` 遍历文本节点，可译的父元素记下原始文本与编号（`data-dsh-pt="12"`） |
| ④ | 等点击（`action=install`） | 每 1.2 秒读一次页面状态，默认等 60 秒；用户点了就在**同一次调用里**翻好 |
| ⑤ | 分块送翻 | 相同字符串只翻一次；**翻过的串按「语言+原文」缓存**（同页翻第二次几乎瞬时）；**分块 3 路并行**；译文由**宿主 LLM 服务**生成 |
| ⑥ | 回填 | 按编号写回 `textContent`，并记下译文（再点按钮即还原） |
| ⑦ | 还原 | 点按钮或 `action='restore'` → 全部回到原文 |

**回执里一定有**：送翻条数、回填条数、模型调用次数、送翻字符数与本次上限、唯一串数、
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 页面到模型再回填的链条与贡献是什么？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

后台每1.5秒巡查最多六个有URL的浏览器会话，借私有provider.sessions数据发现会话并注入脚本，连续失败三次的会话跳过。工具可指定session，默认按nextSeq等活跃指标择会话，这只是启发式并非当前用户焦点。

页面收集文本父元素并编号，宿主解析显式或默认provider/model，去重相同字符串、按预算分块、并发调用宿主LLM，JSON编号表展开回原索引并用textContent写回。缓存按route/语言/原文保最多4000条，仅进程内有效，既不需要插件自持key，也避免缓存落盘。

具体贡献在现有浏览器/LLM之上的页面入口、字符预算/缓存与部分失败回执组合。没有新的翻译算法；不用自己的HTTP并不表示页面内容不会离开设备，实际模型服务仍可能接收原文。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:118-156](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/index.js#L118-L156)

私有会话发现与选择。

<details>
<summary>查看原文（39行）</summary>

```text
      if (!provider) continue;
      const sessions = provider.sessions;
      if (!sessions || typeof sessions.values !== 'function') continue;
      for (const session of sessions.values()) {
        if (!session || typeof session.id !== 'string' || session.id === '') continue;
        const tabs = Array.isArray(session.tabs) ? session.tabs : [];
        const index = Number.isFinite(session.activeIndex) ? session.activeIndex : 0;
        const active = tabs[index] ?? tabs[0] ?? null;
        out.push({
          id: session.id,
          label: typeof session.label === 'string' ? session.label : '',
          url: active && typeof active.url === 'string' ? active.url : '',
          tabs: tabs.length,
          seq: Number.isFinite(session.nextSeq) ? session.nextSeq : 0,
        });
      }
    }
  } catch {
    /* 宿主内部结构变了：当作"没发现"，调用方走旧路径。 */
  }
  return out.sort((a, b) => b.seq - a.seq);
}

/**
 * 从枚举结果里挑"最像用户正在看的那一个"：有页面的优先，再按活跃度。
 * @param {Array<{id:string,url:string,seq:number}>} sessions
 * @returns {object|null}
 */
export function pickSession(sessions) {
  const list = Array.isArray(sessions) ? sessions : [];
  const withPage = list.filter((s) => typeof s.url === 'string' && s.url !== '');
  const pool = withPage.length > 0 ? withPage : list;
  return pool[0] ?? null;
}

/**
 * 取（或开）一个会话。
 *
 * 顺序：**调用方显式给的** → **枚举到的最活跃会话** → 实在没有才新开一个。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:215-245](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/index.js#L215-L245)

轮询/失败门限。

<details>
<summary>查看原文（31行）</summary>

```text
async function sweepOnce(ctx, browser, state) {
  if (state.busy) return;
  state.busy = true;
  try {
    const sessions = discoverSessions(ctx).filter((s) => s.url !== '');
    if (sessions.length === 0) return;
    for (const info of sessions.slice(0, DEFAULTS.sweepLimit)) {
      const mark = state.marks.get(info.id) ?? { fails: 0 };
      if (mark.fails >= DEFAULTS.sweepMaxFails) continue;
      let report = null;
      try {
        report = await runInPage(browser, info.id, { action: 'ping' }, 8000);
        mark.fails = 0;
      } catch {
        mark.fails += 1;
        state.marks.set(info.id, mark);
        continue;
      }
      state.marks.set(info.id, mark);

      // 用户点了「原」—— 要的是立即还原，不需要模型，也不该去解析模型路线。
      if (report.request === 'restore') {
        try {
          await runInPage(browser, info.id, { action: 'restore', label: '译' }, 15000);
        } catch {
          /* 还原失败：留到下一轮再试，不把巡场拖垮 */
        }
        return;
      }

      if (report.request !== 'pending' && report.state !== 'busy') continue;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:184-202](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/index.js#L184-L202)

收集模型回填。

<details>
<summary>查看原文（19行）</summary>

```text
async function handleClick(browser, session, report, context) {
  const collect = await runInPage(browser, session, { action: 'collect' });
  const nodes = Array.isArray(collect.nodes) ? collect.nodes : [];
  let translation = { translations: {}, stats: null, warnings: [] };
  if (nodes.length > 0) {
    translation = await translateNodes(context.llm, nodes, {
      target: context.target,
      maxChars: context.maxChars,
      route: context.route,
      ...context.llmOptions,
    });
  }
  const applied = await runInPage(browser, session, {
    action: 'translate',
    target: context.target,
    mode: context.mode,
    translations: translation.translations,
  });
  return { collected: nodes.length, report: applied, translation };
```

</details>

**依据 4 · 源码核查**：[lib/translate.js:129-171](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/translate.js#L129-L171)

route语言原文缓存。

<details>
<summary>查看原文（43行）</summary>

```text
 * **按「模型路线 + 目标语言 + 原文」做键，不按 llm 对象实例分桶** ——
 * 真机上 `ctx.get('llm')` 不保证每次拿到同一个对象（可能是按作用域包的壳），
 * 用 WeakMap 按实例分桶会让缓存**永远不命中**（2026-10-17 真机验出：第二次翻同一页仍 0 命中）。
 *
 * 进程内有效，重启即空 —— 不做持久化，避免把用户看过的页面内容写进磁盘。
 */
const CACHE_LIMIT = 4000;
const CACHE = new Map();

/**
 * 缓存键：模型路线 + 目标语言 + 原文（换模型或换语言当然要重翻）。
 * @param {{provider?:string,model?:string}|undefined} route
 * @param {string} target
 * @param {string} text
 * @returns {string}
 */
function cacheKey(route, target, text) {
  return `${route?.provider ?? ''}|${route?.model ?? ''}|${target}\u0000${text}`;
}

/**
 * 清空缓存。测试与排查用（不传参数就是全清）。
 */
export function clearTranslationCache() {
  CACHE.clear();
}

/**
 * 写缓存（带 LRU 上限：超过就丢最旧的一条）。
 * @param {Map<string,string>} map
 * @param {object|undefined} route
 * @param {string} target
 * @param {string} text
 * @param {string} value
 */
function remember(map, route, target, text, value) {
  if (!map || typeof value !== 'string' || value.trim() === '') return;
  const key = cacheKey(route, target, text);
  if (map.has(key)) map.delete(key);
  map.set(key, value);
  while (map.size > CACHE_LIMIT) {
    const oldest = map.keys().next().value;
    map.delete(oldest);
```

</details>

**依据 5 · 源码核查**：[lib/translate.js:53-73](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/translate.js#L53-L73)

默认模型解析。

<details>
<summary>查看原文（21行）</summary>

```text
export function resolveRoute(ctx, request = {}) {
  const explicitProvider = typeof request.provider === 'string' ? request.provider.trim() : '';
  const explicitModel = typeof request.model === 'string' ? request.model.trim() : '';
  if (explicitProvider !== '' && explicitModel !== '') {
    return { provider: explicitProvider, model: explicitModel, source: 'explicit' };
  }
  let selection = null;
  try {
    const service = typeof ctx?.get === 'function' ? ctx.get('agentDefaultModel') : undefined;
    if (service && typeof service.currentSelection === 'function') selection = service.currentSelection();
  } catch {
    selection = null;
  }
  const provider = typeof selection?.provider === 'string' ? selection.provider.trim() : '';
  const model = typeof selection?.model === 'string' ? selection.model.trim() : '';
  if (provider !== '' && model !== '') return { provider, model, source: 'agent-default-model' };
  const error = new Error(
    '解析不出要用的模型：调用方没给 provider/model，宿主也没暴露默认模型（ctx.get("agentDefaultModel")）—— 请显式传 provider 与 model',
  );
  error.code = 'no-model-route';
  throw error;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 可见文本、保结构与还原承诺是否成立？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

源码用TreeWalker找文本，但实际标记的是父元素，orig保存父元素整个textContent，回填和restore都写父元素textContent。只要父元素还含链接、强调或交互子节点，写入就会替换其整个子树；restore只能恢复扁平文本，不能恢复原元素及绑定。这个静态语义足以否定无条件“原网页完整可还原”，不需要把它表述为已经做了浏览器复现。

收集跳过指定标签/skip祖先，但只查直接父的contenteditable/aria-hidden，没有computedStyle/布局可见性过滤。隐藏祖先里的文本或父元素包含的其他文字可能进入候选，不能把这批数据当严格可见文本。iframe只统计不进入，README已承认同源也不翻。

handleClick在模型await前收集，await后只凭原session和数字编号回填，缺页面URL/文档版本/文本hash一致性核验。导航或页面重写期间可能失效/错配，需要具体时序对照，不能声称已发生跨页泄露。collect重跑清除orig/node/trans，直接对已翻内容再translate可能把译文当新原文；先restore与重新加载原页比不断重跑更可靠。

此外mode传给apply却没有分支，replace与bilingual在这条实现均写textContent，双语宣传不由这一分支支撑。textContent避免把模型输出当HTML执行，是有用限制，但不能补回结构保真。

#### 证据与依据

**依据 1 · 源码核查**：[lib/page-script.js:108-167](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/page-script.js#L108-L167)

父元素采集/写入/还原，无布局过滤。

<details>
<summary>查看原文（60行）</summary>

```text
    function collect() {
      var nodes = [];
      var walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          var p = n.parentElement;
          if (!p) return NodeFilter.FILTER_REJECT;
          if (p.closest('[' + C.skip + ']')) return NodeFilter.FILTER_REJECT;
          if (p.closest('script,style,noscript,template,textarea,select,svg,canvas')) return NodeFilter.FILTER_REJECT;
          var tag = p.tagName;
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEXTAREA' || tag === 'SELECT') return NodeFilter.FILTER_REJECT;
          if (p.hasAttribute('contenteditable')) return NodeFilter.FILTER_REJECT;
          if (p.hasAttribute('aria-hidden') && p.getAttribute('aria-hidden') === 'true') return NodeFilter.FILTER_REJECT;
          var text = n.nodeValue || '';
          if (text.replace(/\\s+/g, ' ').trim().length < 2) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      var next = 0;
      while (walker.nextNode()) {
        var wrapper = walker.currentNode.parentElement;
        if (!wrapper) continue;
        if (wrapper.hasAttribute(C.node)) continue;
        wrapper.setAttribute(C.node, String(next));
        wrapper.setAttribute(C.orig, wrapper.textContent || '');
        next += 1;
        nodes.push({ index: next - 1, text: (wrapper.textContent || '').replace(/\\s+/g, ' ').trim() });
      }
      return nodes;
    }

    // ---------- 2) 回填 / 还原 ----------
    function countMarked() {
      return document.querySelectorAll('[' + C.node + ']').length;
    }
    function countTranslated() {
      return document.querySelectorAll('[' + C.node + '][' + C.trans + ']').length;
    }
    function apply(mode, table) {
      var list = document.querySelectorAll('[' + C.node + ']');
      var hit = 0;
      for (var i = 0; i < list.length; i += 1) {
        var el = list[i];
        var key = el.getAttribute(C.node);
        if (table && Object.prototype.hasOwnProperty.call(table, key)) {
          var value = String(table[key]);
          el.textContent = value;
          el.setAttribute(C.trans, value);
          hit += 1;
        }
      }
      return hit;
    }
    function restore() {
      var list = document.querySelectorAll('[' + C.node + ']');
      for (var i = 0; i < list.length; i += 1) {
        var el = list[i];
        if (el.hasAttribute(C.orig)) el.textContent = el.getAttribute(C.orig);
        el.removeAttribute(C.trans);
      }
      return list.length;
```

</details>

**依据 2 · 源码核查**：[lib/page-script.js:471-501](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/page-script.js#L471-L501)

重采样清原标、translate与restore。

<details>
<summary>查看原文（31行）</summary>

```text
    } else if (action === 'collect') {
      // 重新收一遍：把上一次的打标**全部清掉**，整页重新成为候选。
      // v0.2.1 修：以前只清 trans 标记、留着 node 标记，于是 collect() 把它们全跳过
      // → 每次只返回"新节点"（实际是 0 个）→ 回执"送翻 0 条"，翻译永远不发生。
      var stale = document.querySelectorAll('[' + C.node + ']');
      for (var s = 0; s < stale.length; s += 1) {
        stale[s].removeAttribute(C.node);
        stale[s].removeAttribute(C.orig);
        stale[s].removeAttribute(C.trans);
      }
    } else if (action === 'translate') {
      root.setAttribute(C.lang, (req && req.target) || 'zh');
      root.setAttribute(C.mode, (req && req.mode) || 'replace');
      root.setAttribute(C.req, '');
      var applied = apply((req && req.mode) || 'replace', req && req.translations);
      setState(root, 'done', '原');
    } else if (action === 'restore') {
      root.setAttribute(C.req, '');
      var restored = restore();
      setState(root, 'idle', (req && req.label) || '译');
      if (labelEl) labelEl.textContent = (req && req.label) || '译';
      return JSON.stringify({
        ok: true, action: 'restore', restored: restored, state: 'idle',
        total: countMarked(), already: 0, nodes: []
      });
    } else if (action === 'error') {
      setState(root, 'error', (req && req.message) || 'failed');
    }

    var fresh = collect();
    return JSON.stringify({
```

</details>

**依据 3 · 源码核查**：[lib/index.js:184-202](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/index.js#L184-L202)

await前后无文档版本。

<details>
<summary>查看原文（19行）</summary>

```text
async function handleClick(browser, session, report, context) {
  const collect = await runInPage(browser, session, { action: 'collect' });
  const nodes = Array.isArray(collect.nodes) ? collect.nodes : [];
  let translation = { translations: {}, stats: null, warnings: [] };
  if (nodes.length > 0) {
    translation = await translateNodes(context.llm, nodes, {
      target: context.target,
      maxChars: context.maxChars,
      route: context.route,
      ...context.llmOptions,
    });
  }
  const applied = await runInPage(browser, session, {
    action: 'translate',
    target: context.target,
    mode: context.mode,
    translations: translation.translations,
  });
  return { collected: nodes.length, report: applied, translation };
```

</details>

**依据 4 · 作者声明**：[README.md:35-42](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/README.md#L35-L42)

iframe/可见/不重排作者边界。

```text
| 边界 | 说明 |
| --- | --- |
| **不是原生工具栏按钮** | 内置浏览器的工具栏是宿主硬编码的 HTML（`dsh-builtin-browser/host-main.js:123` 的 `TOOLBAR_HTML`），宿主不读任何外部字段 —— 第三方插件**没有**加工具栏按钮的扩展点。所以按钮做进页面里。 |
| **导航后按钮会消失（但位置会记住）** | 注入本身是运行期一次性的（宿主没有 `addScriptToEvaluateOnNewDocument` 这类通道）。**v0.2 起由后台巡场自动重装**；位置按站点记在 `localStorage`（`dsh-ipt-pos`），导航/重开都落回原处。 |
| **跨域 iframe 翻不到** | 只能进当前文档的 DOM。**回执会明确报「这一页有 N 个跨域 iframe 没翻」**，不静默跳过；同源 iframe 里的文字目前也不在整页翻译范围内。 |
| **只翻可见文本节点** | 图片、`background-image`、canvas 里的文字不动；`<input>` / `<textarea>` 的值不动。 |
| **字符上限默认自适应** | `maxChars` 不传时按页面唯一文本量自适应（`4000 ~ 24000` 字符）：小页面不被预留浪费、大页面不被 6000 硬截断；超出自适应上限的部分**如实回报**并跳过。给正数则按该值硬截断。 |
| **文本节点被包了一层 `<span>`** | 元素上只打标、不重排子树（`span` 用 `display:inherit`），但页面自己重写这段 DOM 时译文可能被覆盖 —— 那时重跑一次即可。 |
```

#### 缺口

- 嵌套交互节点、隐藏祖先、翻译期间导航和二次直译的具体页面表现未受控对照。
  **影响：**无法给出受影响页面比例或全部恢复保证。
  **进一步探讨：**用本地无隐私HTML固定DOM/监听器和文档版本，对照翻译/还原后的结构、事件与发送文本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 按钮点击是否能证明读者授权发送页面？

**研究主题：**缺陷与关键质疑

#### 完整回答

不能。click处理器根据DOM属性设置pending/busy，没有可信用户事件校验；巡场只要读到request=pending或state=busy就调用模型。页面脚本与插件按钮处于同一DOM，页面可设置这些属性，因而该状态不能当宿主侧的人类确认凭据。这里是从静态条件得出的信任边界问题，不称已在用户设备利用或外传。

自动注入默认开启且跨活会话，不是仅当前对话选择的一张页。即使没有恶意页面，也需要读者明确允许哪些站点内容发到哪个宿主模型。页面文本按user消息送翻、system限定JSON，无工具执行链，但模型仍可能受网页指令扰动而漏译/改译；JSON可解析只验证形状，不验证忠实度。

可选关闭autoInject并显式选择session有助减少意外范围，不能修复同DOM授权证明和父元素内容过采集。敏感后台/私密页面不应在当前默认范围下直接启用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/page-script.js:350-380](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/page-script.js#L350-L380)

普通DOM事件/属性作为请求。

<details>
<summary>查看原文（31行）</summary>

```text
        if (suppressClick) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        // 吸附成小把手时：第一下只负责展开。
        var edge = root.getAttribute(C.edge);
        if (edge === 'left' || edge === 'right') {
          applyEdge(root, '');
          if (edge === 'left') root.style.left = '8px';
          else { root.style.left = 'auto'; root.style.right = '8px'; }
          root.style.transition = 'left .16s ease, right .16s ease, border-radius .16s ease, padding .16s ease';
          var expanded = root.getBoundingClientRect();
          savePos({ left: Math.round(expanded.left), top: Math.round(expanded.top), edge: '' });
          return;
        }
        var state = root.getAttribute(C.state);
        var pending = root.getAttribute(C.req);
        if (state === 'busy' || pending === 'pending' || pending === 'translating') return;
        root.setAttribute(C.req, state === 'done' ? 'restore' : 'pending');
        var hint = root.querySelector('[data-dsh-pt-label]');
        if (state === 'done') {
          root.setAttribute(C.state, 'idle');
          if (hint) hint.textContent = '…';
        } else {
          // 要翻译：先给一个"在处理"的反馈 —— 巡场最多 1.5 秒后才接手，不给反馈会显得没反应。
          root.setAttribute(C.state, 'busy');
          if (hint) hint.textContent = '…';
        }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:235-260](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/index.js#L235-L260)

仅页面状态触发翻译。

<details>
<summary>查看原文（26行）</summary>

```text
      // 用户点了「原」—— 要的是立即还原，不需要模型，也不该去解析模型路线。
      if (report.request === 'restore') {
        try {
          await runInPage(browser, info.id, { action: 'restore', label: '译' }, 15000);
        } catch {
          /* 还原失败：留到下一轮再试，不把巡场拖垮 */
        }
        return;
      }

      if (report.request !== 'pending' && report.state !== 'busy') continue;

      // 有人点了按钮 —— 不在等下一次工具调用，直接在这里把活干完。
      let route = null;
      try {
        route = resolveRoute(ctx, {});
      } catch (error) {
        try {
          await runInPage(browser, info.id, { action: 'error', message: String((error && error.message) || error) }, 6000);
        } catch {
          /* 连错误都写不回去：下次 tick 再说 */
        }
        continue;
      }
      try {
        await handleClick(browser, info.id, report, {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:611-630](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/index.js#L611-L630)

默认全会话巡场。

<details>
<summary>查看原文（20行）</summary>

```text
  // ---- 后台巡场：让按钮"常驻"（用户不用先调工具，导航后也会自动补上） ----
  if (cfg.autoInject !== false) {
    const sweep = {
      busy: false,
      marks: new Map(),
      target: typeof cfg.target === 'string' && LANGUAGES[cfg.target] ? cfg.target : DEFAULT_TARGET,
      mode: typeof cfg.mode === 'string' && MODES[cfg.mode] ? cfg.mode : DEFAULTS.mode,
      maxChars: Number.isFinite(cfg.maxChars) ? Math.max(0, Number(cfg.maxChars)) : DEFAULTS.maxChars,
      llm: ctx.get('llm'),
    };
    if (sweep.llm !== undefined && sweep.llm !== null) {
      const timer = setInterval(() => {
        const browser = browserOf(ctx);
        if (!browser) return;
        // 巡场自己出错绝不能冒成未处理的 rejection —— 按钮是附加功能，坏了自己重试下一轮。
        void sweepOnce(ctx, browser, sweep).catch(() => {});
      }, DEFAULTS.sweepMs);
      // 别让这个定时器把宿主进程吊着（Node 侧才有效，宿主没有就忽略）。
      if (timer && typeof timer.unref === 'function') timer.unref();
      disposers.push(() => clearInterval(timer));
```

</details>

**依据 4 · 源码核查**：[lib/constants.js:333-347](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/constants.js#L333-L347)

翻译提示/用户文本。

<details>
<summary>查看原文（15行）</summary>

```text
export function buildPrompt(chunk, options) {
  const language = LANGUAGES[options?.target] ?? LANGUAGES[DEFAULTS.target];
  const system = [
    `你是网页整页翻译引擎。把用户给你的每一行译成${language}。`,
    '规则（必须全部遵守）：',
    '1. 只输出一个 JSON 对象，形如 {"1":"译文","2":"译文"}，键就是行首方括号里的编号（原样字符串），值是译文。',
    '2. 逐行一一对应：给了 N 行就必须回 N 个键，不许合并、拆分、增删、漏行。',
    '3. 只翻译，不要解释、不要加任何前后缀文字、不要用 markdown 代码围栏。',
    '4. 已经是目标语言的行，原样返回（不要改写）。',
    '5. 专有名词、产品名、代码、变量名、URL、邮箱、数字与单位保持原样。',
    '6. 保留标点风格；译文要通顺自然，别逐字硬译。',
    '7. 行内如果有 HTML 标签或占位符，原样保留其位置。',
  ].join('\n');
  const user = renderChunkInput(chunk);
  return { system, user };
```

</details>

#### 缺口

- 页面伪造请求、隐藏文本披露和站点范围控制没有隔离页面实验。
  **影响：**不能量化触发率或将DOM标记当人工授权。
  **进一步探讨：**先用无秘密本地页改属性/程序触发并记录模型mock调用，设计宿主确认/站点许可对照。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动和使用需核哪些条件？

**研究主题：**依赖、兼容与流程、工程质量与复用

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 不满足时 |
| --- | --- | --- |
| Node>=18与兼容DSH | ESM工具/提示注册 | 包声明rc.2兼容并非本轮加载验收 |
| 内置browser及可execute会话 | DOM脚本/按钮 | 私有providers.sessions依宿主实现 |
| llm与显式/默认模型路线 | 翻译请求 | 缺路线明确错误 |
| 页面内容披露许可 | 原文发模型 | 不因无自持key而免披露 |
| 非关键交互页/可重新加载原文 | 恢复手段 | restore不恢复原DOM结构 |

#### 使用流程

| 步骤 | 动作 | 判据/失败处理 |
| --- | --- | --- |
| 配置 | 先关闭autoInject，选可信非敏感页 | 核模型和站点范围 |
| 选页 | 指定session并核标题URL | 活跃序号不代替焦点 |
| 小页翻译 | 固定较小正maxChars，检查回执 | 对照漏段/缓存/错误 |
| 核结构 | 检链接/表单/双语及原文 | 发现破坏则重新加载原页 |
| 维护 | 卸载核timer停止、刷新清页面注入 | 默认失败三次跳过不自动恢复 |

固定Git共有八个文件，包括README、LICENSE、package、cordis.patch.yml和四个lib。patch实际插入plugin-inpage-translator行；package声明的lib/text-chunks.js和test/smoke.mjs未在固定树出现。main与patch存在，不能据缺失子路径/测试断言核心必然无法加载。npm实际tarball未检查，不把Git缺文件扩展为发布物结论。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:7-20](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/package.json#L7-L20)

入口/导出声明。

<details>
<summary>查看原文（14行）</summary>

```text
  "exports": {
    ".": "./lib/index.js",
    "./constants": "./lib/constants.js",
    "./text-chunks": "./lib/text-chunks.js",
    "./page-script": "./lib/page-script.js",
    "./translate": "./lib/translate.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
```

</details>

**依据 2 · 源码核查**：[package.json:37-69](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/package.json#L37-L69)

Node/test/patch/peer声明。

<details>
<summary>查看原文（33行）</summary>

```text
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node test/smoke.mjs"
  },
  "publishConfig": {
    "access": "public"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/7gzgn/dsh-inpage-translator.git"
  },
  "homepage": "https://github.com/7gzgn/dsh-inpage-translator#readme",
  "bugs": {
    "url": "https://github.com/7gzgn/dsh-inpage-translator/issues"
  },
  "dsh": {
    "compatibility": {
      "dshReleases": {
        "0.2.0-rc.2": "compatible",
        "0.2.1-rc.2": "compatible"
      }
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.4 <5.0.0",
    "@deepseek-ai/dsh-system-prompt": ">=0.2.0-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-tools": ">=0.2.0-rc.2 <0.3.0-0"
```

</details>

**依据 3 · 源码核查**：[lib/index.js:586-605](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/index.js#L586-L605)

browser/llm缺失错误。

<details>
<summary>查看原文（20行）</summary>

```text
      async execute(args) {
        const a = args ?? {};
        const action = String(a.action ?? 'install').trim().toLowerCase();
        if (!['install', 'translate', 'restore', 'status', 'sessions'].includes(action)) {
          return { ok: false, action, error: `unknown action: ${action}` };
        }
        const browser = browserOf(ctx);
        if (!browser) {
          return { ok: false, action, error: '没有可用的浏览器服务（ctx.get("browser") 为空）—— 请先安装/启用内置浏览器插件' };
        }
        const llm = ctx.get('llm');
        if (llm === undefined || llm === null) {
          return { ok: false, action, error: '宿主没有提供 LLM 服务（ctx.get("llm") 为空），无法翻译' };
        }
        try {
          const session = await openSession(ctx, browser, a.session);
          const out = await drive(ctx, browser, session, { ...a, action }, llm);
          return out;
        } catch (error) {
          return { ok: false, action, error: error instanceof Error ? error.message : String(error) };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:643-650](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/index.js#L643-L650)

disposer清理。

```text
  if (typeof ctx.effect === 'function' && disposers.length > 0) {
    ctx.effect(() => () => {
      for (const dispose of disposers) {
        try {
          if (typeof dispose === 'function') dispose();
        } catch {
          /* 卸载失败不阻断其它清理 */
        }
```

**依据 5 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/cordis.patch.yml#L1-L4)

固定Git真实存在bundle插入行。

```text
# dsh-inpage-translator bundle patch: 把插件行插进 profile 名单。
- insert:
    - id: plugin-inpage-translator
      name: 'dsh-inpage-translator'
```

#### 缺口

- 固定Git声明的text-chunks子路径导出目标与实际发布包内容是否一致未知。
  **影响：**不能从Git文件清单单独保证实际发布包的子路径导入完整性。
  **进一步探讨：**离线核npm归档文件清单与入口，不运行插件代码。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续和失败成本与效果是什么？

**研究主题：**效果与总成本

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 复用browser/宿主模型，不自持key | 配模型、站点许可与小页保真核验 | 无工时/订阅价格数据；无独立API不等宿主模型总费用为0 |
| 持续使用 | 原文/提示/译文tokens，每1.5秒最多六会话脚本巡查 | 核漏段、缓存和译文质量 | 24000字符不是金额/token硬账单，实际计费未知 |
| 失败恢复 | 漏译/JSON错块重试再耗模型，重载页面资源 | 检错误/恢复原页及表单状态 | 已有表单状态不能靠restore保证恢复，工时/金额未知 |

#### 效果

| 目标 | 源码增量 | 边界 |
| --- | --- | --- |
| 少复制粘贴 | 页面按钮和编号回填 | 结构保真缺口明显 |
| 降重复请求 | 原文去重+4000条缓存 | 仅进程内，无质量/版本失效判据 |
| 限单轮规模 | 自适应4000–24000字符与分块 | 多会话/重复触发不等于总预算 |
| 容忍部分失败 | warnings/漏项/调用统计 | 有译文不代表全页成功 |

单块stream超时AbortError直接返回已收文本，非空结果带error finish也可能进入解析；JSON可解析部分输出不自动等于完整成功。并行最多四、默认三减少等待可能，但注释称token花销不变只是相同请求规模的设计解释，不是计费证明。翻译质量、总时延和费用优势均无同页对照，不填省钱百分比。

#### 证据与依据

**依据 1 · 源码核查**：[lib/constants.js:65-94](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/constants.js#L65-L94)

预算/并发/周期。

<details>
<summary>查看原文（30行）</summary>

```text
  mode: 'replace',
  /**
   * 单次请求送进模型的字符上限。**0 = 自适应**：
   * 按当前页面的唯一文本总量算，小页面不预留、大页面不被 6000 硬截断。
   * 给正数就按给定值硬截断（并如实回报丢弃了多少）。
   */
  maxChars: 0,
  /** 自适应上限的下界 / 上界（防止 0 字页面白跑、也防止超大页面一次烧太多）。 */
  adaptiveMinChars: 4000,
  adaptiveMaxChars: 24000,
  /** 单个分块的字符上限。 */
  chunkChars: 2200,
  /** 单个分块里的节点数上限。 */
  chunkNodes: 40,
  /** 等用户点按钮的默认秒数。 */
  waitSec: 60,
  /** 后台巡场间隔（毫秒）：扫所有活会话 → 补按钮 → 处理点击。 */
  sweepMs: 1500,
  /** 每次巡场最多检查几个会话（防止会话很多时把一次 tick 拖过长）。 */
  sweepLimit: 6,
  /** 一个会话连续失败几次后，暂停自动注入（避免对死会话反复打）。 */
  sweepMaxFails: 3,
  /** 模型单次调用的超时（毫秒）。 */
  llmTimeoutMs: 45000,
  /** 并发跑几个分块。 */
  concurrency: 3,
});

/** 译文输出的 token 上限（译文通常比原文短，留足余量）。 */
export const MAX_OUTPUT_TOKENS = 4096;
```

</details>

**依据 2 · 源码核查**：[lib/translate.js:100-123](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/translate.js#L100-L123)

超时部分文本返回。

<details>
<summary>查看原文（24行）</summary>

```text
async function streamOnce(prepared, base, system, user, timeoutMs) {
  let text = '';
  let failure = null;
  const signal = typeof AbortSignal?.timeout === 'function' ? AbortSignal.timeout(timeoutMs) : undefined;
  try {
    for await (const chunk of prepared.stream({
      ...base,
      messages: [{ role: 'user', content: [{ type: 'text', text: user }] }],
      system,
      ...(signal ? { signal } : {}),
    })) {
      if (!chunk || typeof chunk !== 'object') continue;
      if (chunk.type === 'text-delta' && typeof chunk.text === 'string') text += chunk.text;
      else if (chunk.type === 'finish' && chunk.reason && chunk.reason.kind === 'error') {
        failure = chunk.reason.failure ?? chunk.reason;
      }
    }
  } catch (error) {
    if (error && error.name === 'AbortError') return text;
    throw error;
  }
  text = text.trim();
  if (text === '' && failure) throw new Error('模型调用失败：' + (failure.message ?? JSON.stringify(failure)));
  return text;
```

</details>

**依据 3 · 源码核查**：[lib/translate.js:278-338](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/translate.js#L278-L338)

局部失败/并发/缓存/统计。

<details>
<summary>查看原文（61行）</summary>

```text
  /** 单块：失败返回 {}（不炸整轮），并把原因记进 warnings。 */
  async function runChunk(chunk) {
    const { system, user } = buildPrompt(chunk, opts);
    let raw = '';
    try {
      raw = await streamOnce(resolved.prepared, resolved.base, system, user, opts.llmTimeoutMs);
    } catch (error) {
      warnings.push('模型调用出错：' + String((error && error.message) || error));
      return {};
    }
    const parsed = extractJsonObject(raw);
    if (parsed === null) {
      warnings.push('模型没有返回可解析的 JSON（该块按原文处理）');
      return {};
    }
    return normalizeTranslations(parsed);
  }

  const tables = [];
  const concurrency = Math.max(1, Math.min(4, Number(opts.concurrency) || 1));
  for (let start = 0; start < chunks.length; start += concurrency) {
    const slice = chunks.slice(start, start + concurrency);
    // 默认 3 块并行：token 花销与串行一样，只是不排队等上一块。
    const results = await Promise.all(slice.map((chunk) => runChunk(chunk)));
    for (const table of results) tables.push(table);
  }

  // 合并：先铺缓存命中的，再用模型这一轮的结果覆盖。
  const merged = {};
  for (const [index, value] of reused) merged[String(index)] = value;
  for (const table of tables) Object.assign(merged, table);

  // 把这一轮真正翻出来的串写进缓存（只缓存成功且非空的）。
  if (cache) {
    for (const entry of misses) remember(cache, opts.route, opts.target, entry.text, merged[String(entry.index)]);
  }

  const translations = expandTranslations(merged, indexMap);

  // 统计：有多少条被"兜底"（模型没给 / 给空）
  let salvaged = 0;
  for (const entry of deduped) {
    if (typeof merged[String(entry.index)] !== 'string' || merged[String(entry.index)].trim() === '') salvaged += 1;
  }

  return {
    translations,
    stats: {
      chunks: chunks.length,
      accepted,
      dropped,
      chars: totalChars,
      charsTotal: uniqueChars,
      cap,
      unique: deduped.length,
      cached: reused.size,
      calls: chunks.length,
      salvaged,
    },
    warnings,
  };
```

</details>

#### 缺口

- 同页面与复制翻译/浏览器原生翻译的质量、费用、结构损坏率没有对照。
  **影响：**不能量化收益。
  **进一步探讨：**固定公开小页面与同模型，测忠实度、完整率、DOM保真、总usage/时延。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 推荐结论与继续探讨入口是什么？

**研究主题：**采用判断、新假设与验证

#### 完整回答

观察。网页内按钮、宿主默认模型复用、去重缓存和预算回执有具体价值；但当前父元素覆盖/扁平还原直接影响基本交付，页面DOM状态不能证明人为授权，默认巡场扩大披露范围。优先修这些约束再讨论非敏感页小范围试用，不推荐先给日常全部网页启用。

可探讨“宿主许可与文档版本绑定的文本节点补丁”。先由宿主保存一次性用户确认、站点/session/document版本与节点原文hash，仅更改独立Text节点，保留原引用/内容供逆补丁；提交前核文档与文本未改变，导航即取消结果。缓存按模型/提示版本隔离并保完整性收据，而不是只看JSON和done。

未实现。最小比较采用嵌套链接/按钮/隐藏祖先/页面伪请求、模型期间导航/局部重渲染、缺键与超时JSON。成功判据是无授权不调用、原结构/监听器可还原、过期结果不落页，并记录新增人工步骤/延迟；若凭据/快照反增敏感持久化，应只保最小内存标识。

#### 证据与依据

**依据 1 · 源码核查**：[lib/page-script.js:108-167](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/page-script.js#L108-L167)

文本节点补丁对照基线。

<details>
<summary>查看原文（60行）</summary>

```text
    function collect() {
      var nodes = [];
      var walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          var p = n.parentElement;
          if (!p) return NodeFilter.FILTER_REJECT;
          if (p.closest('[' + C.skip + ']')) return NodeFilter.FILTER_REJECT;
          if (p.closest('script,style,noscript,template,textarea,select,svg,canvas')) return NodeFilter.FILTER_REJECT;
          var tag = p.tagName;
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEXTAREA' || tag === 'SELECT') return NodeFilter.FILTER_REJECT;
          if (p.hasAttribute('contenteditable')) return NodeFilter.FILTER_REJECT;
          if (p.hasAttribute('aria-hidden') && p.getAttribute('aria-hidden') === 'true') return NodeFilter.FILTER_REJECT;
          var text = n.nodeValue || '';
          if (text.replace(/\\s+/g, ' ').trim().length < 2) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      var next = 0;
      while (walker.nextNode()) {
        var wrapper = walker.currentNode.parentElement;
        if (!wrapper) continue;
        if (wrapper.hasAttribute(C.node)) continue;
        wrapper.setAttribute(C.node, String(next));
        wrapper.setAttribute(C.orig, wrapper.textContent || '');
        next += 1;
        nodes.push({ index: next - 1, text: (wrapper.textContent || '').replace(/\\s+/g, ' ').trim() });
      }
      return nodes;
    }

    // ---------- 2) 回填 / 还原 ----------
    function countMarked() {
      return document.querySelectorAll('[' + C.node + ']').length;
    }
    function countTranslated() {
      return document.querySelectorAll('[' + C.node + '][' + C.trans + ']').length;
    }
    function apply(mode, table) {
      var list = document.querySelectorAll('[' + C.node + ']');
      var hit = 0;
      for (var i = 0; i < list.length; i += 1) {
        var el = list[i];
        var key = el.getAttribute(C.node);
        if (table && Object.prototype.hasOwnProperty.call(table, key)) {
          var value = String(table[key]);
          el.textContent = value;
          el.setAttribute(C.trans, value);
          hit += 1;
        }
      }
      return hit;
    }
    function restore() {
      var list = document.querySelectorAll('[' + C.node + ']');
      for (var i = 0; i < list.length; i += 1) {
        var el = list[i];
        if (el.hasAttribute(C.orig)) el.textContent = el.getAttribute(C.orig);
        el.removeAttribute(C.trans);
      }
      return list.length;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:184-202](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/index.js#L184-L202)

版本绑定对照基线。

<details>
<summary>查看原文（19行）</summary>

```text
async function handleClick(browser, session, report, context) {
  const collect = await runInPage(browser, session, { action: 'collect' });
  const nodes = Array.isArray(collect.nodes) ? collect.nodes : [];
  let translation = { translations: {}, stats: null, warnings: [] };
  if (nodes.length > 0) {
    translation = await translateNodes(context.llm, nodes, {
      target: context.target,
      maxChars: context.maxChars,
      route: context.route,
      ...context.llmOptions,
    });
  }
  const applied = await runInPage(browser, session, {
    action: 'translate',
    target: context.target,
    mode: context.mode,
    translations: translation.translations,
  });
  return { collected: nodes.length, report: applied, translation };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:245-260](https://github.com/7gzgn/dsh-inpage-translator/blob/4a57cad05fb8f57ae3c0cb12f8d4e5ef644d5190/lib/index.js#L245-L260)

宿主授权对照基线。

<details>
<summary>查看原文（16行）</summary>

```text
      if (report.request !== 'pending' && report.state !== 'busy') continue;

      // 有人点了按钮 —— 不在等下一次工具调用，直接在这里把活干完。
      let route = null;
      try {
        route = resolveRoute(ctx, {});
      } catch (error) {
        try {
          await runInPage(browser, info.id, { action: 'error', message: String((error && error.message) || error) }, 6000);
        } catch {
          /* 连错误都写不回去：下次 tick 再说 */
        }
        continue;
      }
      try {
        await handleClick(browser, info.id, report, {
```

</details>

#### 缺口

- 宿主许可/节点补丁方案尚未实现。
  **影响：**不计为现有安全或保真优势。
  **进一步探讨：**先本地mock与固定HTML比较拒绝率/还原率/错误回填和成本。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
