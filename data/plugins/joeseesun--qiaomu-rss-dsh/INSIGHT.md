# 乔木 RSS

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[8b4b505](https://github.com/joeseesun/qiaomu-rss-dsh/tree/8b4b5055cd92bca5b19252729b434a9b6d9ed628)

<!-- BEGIN META -->
[![GitHub ★ 110](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=110&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/joeseesun/qiaomu-rss-dsh)
<!-- END META -->

> **功能**：把 RSS 订阅阅读、版本切换和带原文的伴读放进 DSH

> **亮点**：[Q01](#research-q01) 让选段、正文和伴读在同一界面可追溯。

> **主要限制**：[Q03](#research-q03) 模型、订阅读取和公开收录有不同数据去向。

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
  - [Q01 · 用户能得到什么？](#detail-section-11)
  - [Q02 · 如何处理输入与显示？](#detail-section-12)
  - [Q03 · 网络和数据边界如何区分？](#detail-section-13)
  - [Q04 · 部署和退出成本是什么？](#detail-section-14)
  - [Q05 · 什么结果支持或否定采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：外文 RSS 阅读和讨论常需来回复制文章。

独立 RSS 阅读器加人工复制到模型。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 独立 RSS 阅读器加人工复制到模型。 | 可直接比较 | 保留人工步骤 |
| 乔木 RSS | 让选段、正文和伴读在同一界面可追溯。 | 模型、订阅读取和公开收录有不同数据去向。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 读取并清洗 Feed，在 DSH 侧栏呈现版本及原生会话上下文。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 外文 RSS 阅读和讨论常需来回复制文章。 | 保留原流程 |
| 试验 | 读取并清洗 Feed，在 DSH 侧栏呈现版本及原生会话上下文。 | 观察固定版本 |
| 复核 | 先用公开或虚构 RSS，保持实验室关闭。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 读外文文章时准确引用选段并继续追问 | 对照选段问答可减少切换和引用错误。 | 先用公开或虚构 RSS，保持实验室关闭。 |

> **思考**：[Q03](#research-q03) 模型、订阅读取和公开收录有不同数据去向。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 让选段、正文和伴读在同一界面可追溯。

有 HTML 清洗、正文裁剪和 OPML 分发路径。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 模型、订阅读取和公开收录有不同数据去向。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用公开或虚构 RSS，保持实验室关闭。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的读外文文章时准确引用选段并继续追问。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/host/article-context.js、src/host/feeds.js、src/host/service.js、src/host/read-request.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的读外文文章时准确引用选段并继续追问。未执行目标代码或实际宿主验证。
- 下一步：保存原文证据、引用片段与重载记录。

**分析版本**

- **仓库**：[joeseesun/qiaomu-rss-dsh](https://github.com/joeseesun/qiaomu-rss-dsh)
- **版本号**：0.9.4（[固定提交 8b4b505](https://github.com/joeseesun/qiaomu-rss-dsh/tree/8b4b5055cd92bca5b19252729b434a9b6d9ed628)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照选段问答可减少切换和引用错误。

保存原文证据、引用片段与重载记录。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 500 | — | — | 11843 |
| .mjs | source | 2 | 99 | 85 | 7 | — |
| .js | source | 32 | 27045 | 26287 | 3859 | — |
| .jsx | source | 18 | 2080 | 1951 | 74 | — |
| .mjs | test | 26 | 1647 | 1390 | 211 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/joeseesun/qiaomu-rss-dsh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/joeseesun/qiaomu-rss-dsh/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/joeseesun/qiaomu-rss-dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：读外文文章时准确引用选段并继续追问

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户能得到什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

外文 RSS 读者可在同一界面选择版本和正文选段，用原生会话追问。相比读者复制到聊天，验收需确认来源和选段对应、AI 追问指向当前文章、切文后旧引用不混入。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-16](https://github.com/joeseesun/qiaomu-rss-dsh/blob/8b4b5055cd92bca5b19252729b434a9b6d9ed628/README.md#L13-L16)

作者描述读文、译文和伴读

```text
- **少切几个窗口：** 订阅列表、文章正文、原生 AI 对话在同一工作区。
- **外文文章也能顺畅读：** 在已有原文、译文和改写之间切换；缺失版本可交给已配置的模型生成。
- **从“看过”走向“看懂”：** 让伴读带着文章上下文继续解释、比较与追问。
- **订阅由你决定：** 发现博客与播客、添加 RSS/Atom 地址，用 OPML 迁移订阅。
```

**依据 2 · 作者声明**：[README.md:24-33](https://github.com/joeseesun/qiaomu-rss-dsh/blob/8b4b5055cd92bca5b19252729b434a9b6d9ed628/README.md#L24-L33)

作者说明选段和订阅功能

<details>
<summary>查看原文（10行）</summary>

```text
| 功能 | 使用方式 |
| --- | --- |
| 乔木精选与个人订阅 | 从左上角搜索并切换频道，自动加载该频道的新文章；在探索页添加 RSS/Atom 源，导入或导出 OPML |
| 读者社区 | 「乔木精选」之外的独立分组，收录读者提交的链接，可按 YouTube / B 站 / 公众号 / 文章筛选；站点隐藏该频道后同步消失 |
| 阅读文章 | 切换原文、译文和乔木改写；支持未读、收藏、搜索与媒体内容 |
| AI 伴读 | 点击文章工具栏的魔法棒，或选中正文，右侧直接打开 Harness 原生对话；默认工作区自动连接当前文章，选段引用内嵌在输入框内，可展开或移除；翻译、解释、概括默认只处理选段，文章作为参考上下文 |
| 海外播客原文 | 搜索节目、浏览单集并获取已有完整转写；导入后可阅读、翻译和伴读 |
| 链接收录与改写（实验室） | 在设置中启用并验证邀请码，粘贴链接或右键正文链接提交；在「申请收录」查看进度、重试失败申请，完成后打开中文改写与 AI 伴读 |
| 插件设置 | 调整阅读外观和乔木服务地址；用弹窗编辑订阅、重命名或取消分组，管理 OPML 与快捷提示词，并查看关于与打赏信息 |
| Agent 工具 | 提供频道、文章、搜索、订阅、刷新和阅读版本相关的八个 `rss_*` 工具 |
```

</details>

**依据 3 · 源码核查**：[src/host/article-context.js:1-9](https://github.com/joeseesun/qiaomu-rss-dsh/blob/8b4b5055cd92bca5b19252729b434a9b6d9ed628/src/host/article-context.js#L1-L9)

文章纯文本上下文有裁剪和提示

```text
import { htmlToText } from './sanitize.js';
export function articleContext(article, limit = 12000) {
  const heading = article.title ? `标题: ${String(article.title).slice(0,500)}\n\n` : '';
  const plain = typeof article.text === 'string' ? article.text : htmlToText(article.html ?? '', limit + 1);
  const available = Math.max(0,limit - heading.length);
  const truncated = plain.length > available;
  const suffix = truncated ? '\n（上下文已截断）' : '';
  return heading + plain.slice(0,Math.max(0,available - suffix.length)) + suffix;
}
```

#### 缺口

- 伴读是否在所有版本正确同步待测。
  **影响**：减少窗口切换与手动引用。
  **进一步探讨**：用两篇不同文章交替测试。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何处理输入与显示？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Feed 入口清洗 HTML，文章上下文组装为有限长度纯文本并标记截断。订阅列表支持 OPML 输出。作者描述缺失译文可调用宿主模型，普通阅读无需模型。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/feeds.js:99-109](https://github.com/joeseesun/qiaomu-rss-dsh/blob/8b4b5055cd92bca5b19252729b434a9b6d9ed628/src/host/feeds.js#L99-L109)

文章内容入库前经过清洗

<details>
<summary>查看原文（11行）</summary>

```text

function normalizeItem(node, isAtom, feedUrl) {
  const title = textOf(find(node, 'title')).trim();
  const link = linkOf(node, isAtom);
  const id = textOf(isAtom ? find(node, 'id') : find(node, 'guid')).trim() || link || `${title}|${dateOf(node, isAtom) ?? ''}`;
  if (title === '' && !link) return undefined;
  const rawHtml = contentOf(node, isAtom);
  const asset = mediaAssetOf(node);
  const html = sanitizeHtml(rawHtml, { baseUrl: link, maxLength: MAX_BODY_CHARS });
  const key = `feed:${hashKey(feedUrl, id)}`;
  return {
```

</details>

**依据 2 · 源码核查**：[src/host/article-context.js:1-9](https://github.com/joeseesun/qiaomu-rss-dsh/blob/8b4b5055cd92bca5b19252729b434a9b6d9ed628/src/host/article-context.js#L1-L9)

限制模型参考文本长度

```text
import { htmlToText } from './sanitize.js';
export function articleContext(article, limit = 12000) {
  const heading = article.title ? `标题: ${String(article.title).slice(0,500)}\n\n` : '';
  const plain = typeof article.text === 'string' ? article.text : htmlToText(article.html ?? '', limit + 1);
  const available = Math.max(0,limit - heading.length);
  const truncated = plain.length > available;
  const suffix = truncated ? '\n（上下文已截断）' : '';
  return heading + plain.slice(0,Math.max(0,available - suffix.length)) + suffix;
}
```

**依据 3 · 源码核查**：[src/host/service.js:740-745](https://github.com/joeseesun/qiaomu-rss-dsh/blob/8b4b5055cd92bca5b19252729b434a9b6d9ed628/src/host/service.js#L740-L745)

导出订阅为 OPML

```text
  }

  async opmlExport() {
    await this.ready;
    return { xml: buildOpml(this.store.data.subscriptions) };
  }
```

**依据 4 · 作者声明**：[README.md:54-60](https://github.com/joeseesun/qiaomu-rss-dsh/blob/8b4b5055cd92bca5b19252729b434a9b6d9ed628/README.md#L54-L60)

作者说明阅读和模型用途

```text
切换频道时先显示已缓存文章，再自动拉取该频道的新内容；刷新按钮仍可手动强制更新。切换文章时，阅读区用轻量骨架显示加载状态。默认阅读版本为「乔木改写」，仅在当前文章有内容时生效，缺失时自动选择其他已有版本或原文；手动选择缺失版本仍可调用 Harness 生成。文章与伴读之间的分割线可拖动，也可用方向键微调、双击复位。打开伴读时文章列表保持可见，文章左上角也可打开频道列表。伴读输入框上方的快捷提示词可横向滚动点选并直接发送；末端的 + 可直达设置新增提示词。已有手写草稿时不会覆盖或误发。本机个人提示词保存在插件的浏览器存储中，可在设置中编辑。探索订阅包含来自原版乔木 RSS 目录的 73 个播客 RSS 源；订阅后可使用文章中的音频附件播放。插件不提供 Obsidian 式笔记、划线保存或日记写入。

## 找到下一篇想读的内容

![订阅发现：搜索作者、播客或 RSS 地址](docs/screenshots/discovery.png)

打开「探索订阅」，找到作者并订阅；也可以直接输入 RSS 地址。首次使用无需导入旧数据，乔木精选可直接阅读。AI 伴读与缺失版本生成需要宿主模型配置，普通阅读不需要模型密钥。
```

#### 缺口

- 纯文本截断仍可能丢掉重要段落。
  **影响**：AI 摘要需回原文核对。
  **进一步探讨**：增加正文超过预算且答案在尾段的反例。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 网络和数据边界如何区分？

**研究主题**：缺陷与关键质疑

#### 完整回答

普通读取、模型伴读和实验室收录是不同路径。一般读请求有超时并拒绝重定向，模型可能接收文章文本。实验室收录会把链接交给乔木服务，作者称改写结果公开。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/read-request.js:22-39](https://github.com/joeseesun/qiaomu-rss-dsh/blob/8b4b5055cd92bca5b19252729b434a9b6d9ed628/src/host/read-request.js#L22-L39)

读请求的凭据与重定向约束

<details>
<summary>查看原文（18行）</summary>

```text
  const first = eligible && preferredUntil > Date.now() ? preferred : url.origin;
  const origins = eligible ? [first, first === PRIMARY ? EDGE : PRIMARY] : [url.origin];
  const deadline = Date.now() + 20_000;
  for (let attempt = 0; attempt < origins.length; attempt++) {
    const target = new URL(url); if (eligible) target.host = new URL(origins[attempt]).host;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(new DOMException('Reading request timed out', 'TimeoutError')),
      Math.min(deadline - Date.now(), eligible && attempt === 0 ? 6000 : 20000));
    try {
      const response = await fetch(target.href, {
        signal: controller.signal, credentials: 'omit', redirect: 'error',
        headers: { accept: 'application/json', ...(url.pathname.endsWith('/entries') ? { 'X-Rss-List': 'reader-v1' } : {}) },
      });
      if (!response.ok) throw Object.assign(new Error(`qiaomu api ${url.pathname} failed: HTTP ${response.status}`), { status: response.status });
      if (Number(response.headers.get('content-length')) > 12_000_000) throw new Error('Reading response is too large');
      const text = await response.text();
      if (text.length > 12_000_000) throw new Error('Reading response is too large');
      const data = JSON.parse(text);
```

</details>

**依据 2 · 源码核查**：[src/host/article-context.js:1-9](https://github.com/joeseesun/qiaomu-rss-dsh/blob/8b4b5055cd92bca5b19252729b434a9b6d9ed628/src/host/article-context.js#L1-L9)

上下文可含正文

```text
import { htmlToText } from './sanitize.js';
export function articleContext(article, limit = 12000) {
  const heading = article.title ? `标题: ${String(article.title).slice(0,500)}\n\n` : '';
  const plain = typeof article.text === 'string' ? article.text : htmlToText(article.html ?? '', limit + 1);
  const available = Math.max(0,limit - heading.length);
  const truncated = plain.length > available;
  const suffix = truncated ? '\n（上下文已截断）' : '';
  return heading + plain.slice(0,Math.max(0,available - suffix.length)) + suffix;
}
```

**依据 3 · 作者声明**：[README.md:35-39](https://github.com/joeseesun/qiaomu-rss-dsh/blob/8b4b5055cd92bca5b19252729b434a9b6d9ed628/README.md#L35-L39)

作者说明默认关闭、远端提交与公开收录

```text
## 链接收录与改写

在「插件设置 → 实验室」启用链接收录，输入邀请码并点击「验证并保存」，随后打开「申请收录」。粘贴网页地址提交，或右键文章中的链接选择「申请收录改写」。完成的申请可直接打开阅读，失败的申请可重试。任务在 Host 保存；重启会恢复进度检查，完成或失败时在 RSS 面板通知。没有未完成任务时不持续查询服务器。

链接会发送到设置中的乔木服务，生成的改写公开收录。此功能是网页收录和 AI 改写，与「海外播客原文」提供的已有逐字稿不同。实验室默认关闭。邀请码与实例访问密钥保存在本机插件数据中，不返回通用设置，不提供 Agent 提交工具；管理员管理功能本版未迁移。
```

#### 缺口

- 页面清洗不能验证模型忽略文章中的指令。
  **影响**：不要用私有文章测试外部收录。
  **进一步探讨**：以虚构 feed 和模拟端点区分三条路径。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署和退出成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者提供 Release 和 Web/Desktop profile 步骤。初次准备订阅、模型和网络，持续开销包括刷新和按需翻译。停用前导出 OPML 并单独备份读态，因为订阅导出不会迁移阅读状态。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:62-77](https://github.com/joeseesun/qiaomu-rss-dsh/blob/8b4b5055cd92bca5b19252729b434a9b6d9ed628/README.md#L62-L77)

作者描述发行和宿主条件

<details>
<summary>查看原文（16行）</summary>

````text
## 安装

支持 DeepSeek Harness 0.2.2-rc.1，并保留 0.2.1-rc.2 至 rc.5 的声明；本次实际运行验证 0.2.2-rc.1。下载 [v0.9.4 Release](https://github.com/joeseesun/qiaomu-rss-dsh/releases/tag/v0.9.4) 中的 `.tgz` 和 `SHA256SUMS` 文件，在下载目录执行：

```bash
shasum -a 256 -c SHA256SUMS
dsh plugin --profile desktop add "$PWD/qiaomu-rss-dsh-0.9.4.tgz"
```

使用命令行 Web 界面时，把 `desktop` 换为 `web`。安装后重启对应的 Harness profile，在侧边栏打开「乔木 RSS」。[官方插件安装说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.md)介绍了 bundle 与 profile 的关系。插件依赖 Harness 已配置的模型与账号；默认无需再选工作区。

本次补充 0.2.2-rc.1 与 Cordis 4.1.0 支持，无需版本豁免。安装、阅读、伴读和未覆盖范围见 [兼容验证记录](docs/DSH-0.2.2-RC1.md)。

## 开发

运行目标宿主需要 Node.js 24.9 或更高版本，以及已安装的 DeepSeek Harness。克隆后执行：
````

</details>

**依据 2 · 作者声明**：[README.md:89-95](https://github.com/joeseesun/qiaomu-rss-dsh/blob/8b4b5055cd92bca5b19252729b434a9b6d9ed628/README.md#L89-L95)

作者说明升级与备份边界

```text
此前版本已在本地 Desktop profile 验证读取、伴读和可调分割线，并通过隔离 Web profile 的安装、配置和启动检查；本轮已验证 Desktop 中选段引用内嵌、保留输入草稿、移除引用，并实际发送「翻译」确认只翻译选段。隔离 Web 的已有文章和订阅发现截图来自 v0.5.2。详见 [发布验证](docs/RELEASE-VALIDATION.md)。`private: true` 仅阻止误发 npm，不限制 GitHub 源码或 Release 下载。正式使用时请安装 Release 包；从 GitHub 源码构建适合参与开发。

升级时安装新版本包并重启同一 profile。暂时停用可在 Harness 插件管理中禁用 RSS；卸载前请通过 OPML 导出订阅，阅读状态需要另外备份。

## 数据与来源

- 订阅与阅读状态保存在 Harness home 的 `storages/qiaomu-rss/data.json`，不在本仓库。升级时不会清空旧数据。
```

**依据 3 · 源码核查**：[src/host/service.js:740-745](https://github.com/joeseesun/qiaomu-rss-dsh/blob/8b4b5055cd92bca5b19252729b434a9b6d9ed628/src/host/service.js#L740-L745)

导出输入为订阅表

```text
  }

  async opmlExport() {
    await this.ready;
    return { xml: buildOpml(this.store.data.subscriptions) };
  }
```

#### 缺口

- 发布包、模型成本和大订阅恢复未实测。
  **影响**：迁移需要按数据类型校验。
  **进一步探讨**：对照卸载前后订阅、收藏与读态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么结果支持或否定采用？

**研究主题**：新假设与验证

#### 完整回答

同一两篇文章对比阅读器复制和插件伴读，记录问题正确率、引用对应、耗时和模型载荷。增加长文、恶意嵌入文本、RSS 更新失败及切文后追问。若选段串文、长文不标截断或 OPML 回导遗漏订阅，则按失败收窄采用。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/article-context.js:1-9](https://github.com/joeseesun/qiaomu-rss-dsh/blob/8b4b5055cd92bca5b19252729b434a9b6d9ed628/src/host/article-context.js#L1-L9)

可验证截断提示

```text
import { htmlToText } from './sanitize.js';
export function articleContext(article, limit = 12000) {
  const heading = article.title ? `标题: ${String(article.title).slice(0,500)}\n\n` : '';
  const plain = typeof article.text === 'string' ? article.text : htmlToText(article.html ?? '', limit + 1);
  const available = Math.max(0,limit - heading.length);
  const truncated = plain.length > available;
  const suffix = truncated ? '\n（上下文已截断）' : '';
  return heading + plain.slice(0,Math.max(0,available - suffix.length)) + suffix;
}
```

**依据 2 · 作者声明**：[README.md:26-33](https://github.com/joeseesun/qiaomu-rss-dsh/blob/8b4b5055cd92bca5b19252729b434a9b6d9ed628/README.md#L26-L33)

作者给出阅读与迁移目标

```text
| 乔木精选与个人订阅 | 从左上角搜索并切换频道，自动加载该频道的新文章；在探索页添加 RSS/Atom 源，导入或导出 OPML |
| 读者社区 | 「乔木精选」之外的独立分组，收录读者提交的链接，可按 YouTube / B 站 / 公众号 / 文章筛选；站点隐藏该频道后同步消失 |
| 阅读文章 | 切换原文、译文和乔木改写；支持未读、收藏、搜索与媒体内容 |
| AI 伴读 | 点击文章工具栏的魔法棒，或选中正文，右侧直接打开 Harness 原生对话；默认工作区自动连接当前文章，选段引用内嵌在输入框内，可展开或移除；翻译、解释、概括默认只处理选段，文章作为参考上下文 |
| 海外播客原文 | 搜索节目、浏览单集并获取已有完整转写；导入后可阅读、翻译和伴读 |
| 链接收录与改写（实验室） | 在设置中启用并验证邀请码，粘贴链接或右键正文链接提交；在「申请收录」查看进度、重试失败申请，完成后打开中文改写与 AI 伴读 |
| 插件设置 | 调整阅读外观和乔木服务地址；用弹窗编辑订阅、重命名或取消分组，管理 OPML 与快捷提示词，并查看关于与打赏信息 |
| Agent 工具 | 提供频道、文章、搜索、订阅、刷新和阅读版本相关的八个 `rss_*` 工具 |
```

#### 缺口

- 无本次宿主测试。
  **影响**：可区分订阅便利和 AI 质量。
  **进一步探讨**：保存原文证据、引用片段与重载记录。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
