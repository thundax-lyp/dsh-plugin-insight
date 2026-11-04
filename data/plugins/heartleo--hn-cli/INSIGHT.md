# hn

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[682f993](https://github.com/heartleo/hn-cli/tree/682f99354aed57d7143d60ee5d14ba65e820909b)

<!-- BEGIN META -->
[![GitHub ★ 51](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=51&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/heartleo/hn-cli)
<!-- END META -->

> **功能**：在终端浏览 Hacker News 故事和评论，并提供可选翻译。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把阅读、多源回退和可选翻译放在终端。

> **主要限制**：[Q02](#research-q02) 页面未处理分页、回退源有索引延迟，成功不证明评论完整。

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
  - [Q01 · 根项目帮助谁，相对浏览网页和 DSH 子插件有何区别？](#detail-section-11)
  - [Q02 · 评论源、回退和排序各有什么边界？](#detail-section-12)
  - [Q03 · 翻译怎样使用凭据与外部服务，使用和退出条件是什么？](#detail-section-13)
  - [Q04 · 如何验证向读者标示评论来源和完整性有帮助？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在终端阅读 Hacker News 并可选翻译内容的用户。

用户可直接浏览 HN 网页或使用独立翻译工具。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 终端浏览 | 阅读故事和讨论 | HN 网络需可用 |
| 评论回退 | 网页失败时读 Algolia | 分页与索引延迟可能缺失 |
| 可选翻译 | 翻译标题或评论 | 文本和密钥发到所配置端点 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 终端及可执行程序 | 必需 | 本地交互 | 无法使用客户端 |
| HN 网页或 Algolia | 读取评论必需 | 获取讨论 | 两者失败返回错误 |
| 模型端点、密钥、模型、语言 | 可选翻译必需 | 转换文本 | 未配置返回错误 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核客户端及网络 | 不执行未审安装脚本 |
| 浏览 | 选择故事并读取评论 | 核原文和回退来源 |
| 翻译 | 用户选择公开文本 | 确认端点和密钥 |
| 复核 | 对照网页和原文 | 内容缺失时回网页 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 客户端与网络资源未知 | 配置端点与密钥 | 构建兼容未测 |
| 持续 | 外部翻译费用未知 | 核原文和遗漏 | 延迟质量未知 |
| 恢复 | 网络重试资源未知 | 返回网页 | 服务可用性未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 终端阅读 | 作者功能说明与命令入口 | 相对网页效率 |
| 评论回退 | 源码回退到 Algolia | 实时性与完整性 |
| 翻译 | 向配置端点发送文本 | 质量和实际费用 |

> **思考**：[Q02](#research-q02) 页面未处理分页、回退源有索引延迟，成功不证明评论完整。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把阅读、多源回退和可选翻译放在终端。

[Q02](#research-q02) 主评论抓取和回退在调用链上可见；分页和时效按各数据源分别核查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 页面未处理分页、回退源有索引延迟，成功不证明评论完整。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先用公开帖子并核模型端点；内容不全或不接受外发时返回网页和原文。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

只读固定版本 Go 源码与 README，未构建或运行。

- 已检查：作者 README、包清单、源码路径 README.md、cmd/hn/main.go、internal/cli/app.go、internal/scrape/scraper.go、internal/algolia/fetcher.go、internal/translate/client.go 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根终端命令、评论抓取/回退和翻译路径；未审所有终端 UI、安装器及独立 DSH 子组件。
- 下一步：隔离环境固定帖子，对照网页、长线程分页、服务失败和翻译输出。

**分析版本**

- **仓库**：[heartleo/hn-cli](https://github.com/heartleo/hn-cli)
- **版本号**：未声明（[固定提交 682f993](https://github.com/heartleo/hn-cli/tree/682f99354aed57d7143d60ee5d14ba65e820909b)）
- **版本日期**：2026-08-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设显示来源和完整性提示帮助读者判断，尚未验证。

隔离环境固定帖子，对照网页、长线程分页、服务失败和翻译输出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 929 | — | — | 6015 |
| .js | source | 5 | 676 | 528 | 107 | — |
| .mjs | source | 1 | 81 | 67 | 2 | — |
| .mjs | test | 1 | 58 | 49 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/heartleo/hn-cli/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查终端 HN 客户端的评论回退和翻译边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目帮助谁，相对浏览网页和 DSH 子插件有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

hn 是浏览 Hacker News 的终端客户端，作者列出故事切换、评论、刷新和翻译。网页也提供阅读和评论，项目把浏览与翻译放在终端；仓库的 DSH hacker-news 在独立子目录，提供 Agent 工具而不是本项终端入口。实际便利、讨论完整性和翻译质量未对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-22](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/README.md#L15-L22)

作者介绍终端功能。

```text
## Features

- 📰 **Story browser** — Top, New, Best, Ask HN, Show HN with tab switching
- 💬 **Comment threads** — navigate with `j/k`, fold/unfold, lazy-load reply trees
- 🌐 **Translation** — translate a title with `t`, all visible titles with `T`, or a selected comment
- 🔄 **Soft refresh** — refresh stories or comments without restarting
- 🎨 **Themes** — hn, mocha, dracula, tokyo, nord, gruvbox
- ⚡ **Progressive loading** — visible range loads first, more fetched as you scroll
```

**依据 2 · 作者声明**：[README.md:101-105](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/README.md#L101-L105)

DSH 子插件独立入口。

```text
The digest is also published daily at [hndigest.heartleo.dev](https://hndigest.heartleo.dev).

## DeepSeek Harness Plugin

For [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/) there is [**hacker-news**](plugins/hacker-news), a plain-ESM plugin that reads the public Hacker News APIs directly. It needs neither an HN API key nor a local terminal client.
```

**依据 3 · 源码核查**：[cmd/hn/main.go:1-7](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/cmd/hn/main.go#L1-L7)

根命令调用 CLI。

```text
package main

import "github.com/heartleo/hn-cli/internal/cli"

func main() {
	cli.Execute()
}
```

#### 缺口

- 无同任务用户对照
  **影响**：不能量化终端操作收益
  **进一步探讨**：比较网页与终端阅读同一帖子耗时及遗漏。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 评论源、回退和排序各有什么边界？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

终端先抓取 HN 页面评论，失败时回退 Algolia，并使用 Firebase story.Kids 调整顶层顺序；两条路径均失败则返回错误。网页抓取代码明确依赖未文档化的 HTML 结构且未处理分页，Algolia 源文件说明可能存在索引延迟与评论缺失；成功返回并不证明评论完整或实时，回退也不会保证所有嵌套层与网页相同顺序。

#### 证据与依据

**依据 1 · 源码核查**：[internal/cli/app.go:402-421](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/internal/cli/app.go#L402-L421)

抓网页失败回 Algolia 并调整顶层顺序。

<details>
<summary>查看原文（20行）</summary>

```text
// fetchThread tries the HTML scrape first (exact HN display order at every
// nesting level) and falls back to Algolia on failure (stable API, but
// nested replies only approximate HN order via created_at_i). The Algolia
// path restores top-level order with ReorderByKids using story.Kids from
// Firebase; the scrape path already receives rows in HN order so no reorder
// is needed.
func (m model) fetchThread(story hn.Item) tea.Cmd {
	return func() tea.Msg {
		if comments, err := m.scraper.Thread(context.Background(), story.ID); err == nil {
			return topCommentsMsg{story: story, comments: comments}
		} else {
			slog.Debug("scrape thread failed, falling back to algolia", "story", story.ID, "err", err)
		}
		comments, err := m.algolia.Thread(context.Background(), story.ID)
		if err != nil {
			return errMsg{err}
		}
		comments = algolia.ReorderByKids(comments, story.Kids)
		return topCommentsMsg{story: story, comments: comments}
	}
```

</details>

**依据 2 · 源码核查**：[internal/scrape/scraper.go:1-9](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/internal/scrape/scraper.go#L1-L9)

HTML 合同及分页限制。

```text
// Package scrape fetches a Hacker News comment thread by parsing the
// public news.ycombinator.com item page HTML. Unlike the Firebase and
// Algolia clients, this source reflects HN's algorithmic display order at
// every nesting level — because the server bakes that order directly into
// the HTML — at the cost of depending on an undocumented HTML contract.
//
// The `?id=X` page is assumed to render the full, fully-expanded thread in
// one response. Pagination is not handled; callers should fall back to
// Algolia if this source fails.
```

**依据 3 · 源码核查**：[internal/algolia/fetcher.go:1-7](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/internal/algolia/fetcher.go#L1-L7)

作者说明索引延迟。

```text
// Package algolia fetches a full Hacker News comment thread in a single HTTP
// request via the Algolia HN API. It is an alternative to the Firebase
// per-item fan-out in the root hn package.
//
// Tradeoff: Algolia has roughly 30 minutes of indexing lag, so very recent
// comments on fresh stories may be missing. Callers should fall back to the
// Firebase client if the result is obviously incomplete or the request fails.
```

**依据 4 · 源码核查**：[internal/algolia/fetcher.go:89-117](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/internal/algolia/fetcher.go#L89-L117)

按已有 Kids 重排并追加未匹配评论。

<details>
<summary>查看原文（29行）</summary>

```text
// ReorderByKids rearranges comments to match the order of ids in kids.
// Used to overlay HN's algorithmic display order (available only in the
// Firebase parent's Kids array) on top of Algolia's time-sorted children.
// Comments absent from kids are appended after, preserving their Algolia
// order. Ids in kids without a matching comment are skipped.
func ReorderByKids(comments []*hn.Comment, kids []int) []*hn.Comment {
	if len(kids) == 0 || len(comments) <= 1 {
		return comments
	}
	byID := make(map[int]*hn.Comment, len(comments))
	for _, c := range comments {
		if c != nil {
			byID[c.Item.ID] = c
		}
	}
	out := make([]*hn.Comment, 0, len(comments))
	seen := make(map[int]bool, len(comments))
	for _, id := range kids {
		if c, ok := byID[id]; ok && !seen[id] {
			out = append(out, c)
			seen[id] = true
		}
	}
	for _, c := range comments {
		if c != nil && !seen[c.Item.ID] {
			out = append(out, c)
		}
	}
	return out
```

</details>

#### 缺口

- 未对照实时网页、分页和错误
  **影响**：不能保证评论完整与时效
  **进一步探讨**：固定热门长线程和新帖子对比多源内容。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 翻译怎样使用凭据与外部服务，使用和退出条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

翻译客户端需要 API URL、密钥、模型和语言，将文本作为 user 消息发到配置的 chat/completions 端点，并以 Bearer 携带密钥，默认 HTTP 超时 30 秒；空响应或非成功状态返回错误。选择外部翻译意味着文本离开本地，服务计费和质量依供应商，费用、延迟未知。先用公开非敏感内容，核配置端点及供应商隐私与账单；结果不可靠或不接受外发时停用翻译并直接看原文。

#### 证据与依据

**依据 1 · 源码核查**：[internal/translate/client.go:16-44](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/internal/translate/client.go#L16-L44)

配置项和默认超时。

<details>
<summary>查看原文（29行）</summary>

```text
// Client translates text through an OpenAI-compatible chat completions API.
type Client struct {
	APIURL   string
	APIKey   string
	Model    string
	Language string

	http *http.Client
}

// NewClient creates a translation client from config values.
func NewClient(apiURL, apiKey, model, language string) *Client {
	return &Client{
		APIURL:   strings.TrimRight(apiURL, "/"),
		APIKey:   apiKey,
		Model:    model,
		Language: language,
		http:     &http.Client{Timeout: 30 * time.Second},
	}
}

// Configured reports whether the client has enough settings to call the API.
func (c *Client) Configured() bool {
	return c != nil && c.APIURL != "" && c.APIKey != "" && c.Model != "" && c.Language != ""
}

// Translate translates text and returns only the translated content.
func (c *Client) Translate(ctx context.Context, text string) (string, error) {
	if !c.Configured() {
```

</details>

**依据 2 · 源码核查**：[internal/translate/client.go:51-69](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/internal/translate/client.go#L51-L69)

文本进入模型请求及空响应错误。

<details>
<summary>查看原文（19行）</summary>

```text
	reqBody := chatCompletionRequest{
		Model: c.Model,
		Messages: []chatMessage{
			{
				Role:    "system",
				Content: fmt.Sprintf("Translate the following text to %s. Output only the translation, no explanation.", c.Language),
			},
			{Role: "user", Content: text},
		},
	}

	translated, err := c.complete(ctx, reqBody)
	if err != nil {
		return "", err
	}
	if translated == "" {
		return "", errors.New("translate response is empty")
	}
	return translated, nil
```

</details>

**依据 3 · 源码核查**：[internal/translate/client.go:127-160](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/internal/translate/client.go#L127-L160)

请求地址、Bearer、状态和响应错误。

<details>
<summary>查看原文（34行）</summary>

```text
func (c *Client) complete(ctx context.Context, reqBody chatCompletionRequest) (string, error) {
	data, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.APIURL+"/chat/completions", bytes.NewReader(data))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+c.APIKey)

	resp, err := c.http.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", fmt.Errorf("translate request failed: %s", resp.Status)
	}

	var out chatCompletionResponse
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return "", err
	}
	if len(out.Choices) == 0 {
		return "", errors.New("translate response has no choices")
	}

	content := strings.TrimSpace(out.Choices[0].Message.Content)
	if content == "" {
		return "", errors.New("translate response is empty")
```

</details>

#### 缺口

- 未访问 HN 或模型服务
  **影响**：不能确认网络、费用、翻译质量与隐私政策
  **进一步探讨**：在用户授权环境以公开样本核调用与账单。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证向读者标示评论来源和完整性有帮助？

**研究主题**：新假设与验证

#### 完整回答

假设评论视图显示当前采用网页抓取或 Algolia 以及分页未覆盖、潜在索引延迟的提示，可以帮助读者判断是否需要回网页复核；这是未验证的改进，不声称当前已有该提示。对照有无来源提示，让用户在新帖子与长线程中识别遗漏并记录正确判断、耗时和信息噪声；若无改善或误导增加则否定。

#### 证据与依据

**依据 1 · 源码核查**：[internal/cli/app.go:402-421](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/internal/cli/app.go#L402-L421)

两种路径及回退。

<details>
<summary>查看原文（20行）</summary>

```text
// fetchThread tries the HTML scrape first (exact HN display order at every
// nesting level) and falls back to Algolia on failure (stable API, but
// nested replies only approximate HN order via created_at_i). The Algolia
// path restores top-level order with ReorderByKids using story.Kids from
// Firebase; the scrape path already receives rows in HN order so no reorder
// is needed.
func (m model) fetchThread(story hn.Item) tea.Cmd {
	return func() tea.Msg {
		if comments, err := m.scraper.Thread(context.Background(), story.ID); err == nil {
			return topCommentsMsg{story: story, comments: comments}
		} else {
			slog.Debug("scrape thread failed, falling back to algolia", "story", story.ID, "err", err)
		}
		comments, err := m.algolia.Thread(context.Background(), story.ID)
		if err != nil {
			return errMsg{err}
		}
		comments = algolia.ReorderByKids(comments, story.Kids)
		return topCommentsMsg{story: story, comments: comments}
	}
```

</details>

**依据 2 · 源码核查**：[internal/scrape/scraper.go:1-9](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/internal/scrape/scraper.go#L1-L9)

分页边界。

```text
// Package scrape fetches a Hacker News comment thread by parsing the
// public news.ycombinator.com item page HTML. Unlike the Firebase and
// Algolia clients, this source reflects HN's algorithmic display order at
// every nesting level — because the server bakes that order directly into
// the HTML — at the cost of depending on an undocumented HTML contract.
//
// The `?id=X` page is assumed to render the full, fully-expanded thread in
// one response. Pagination is not handled; callers should fall back to
// Algolia if this source fails.
```

**依据 3 · 源码核查**：[internal/algolia/fetcher.go:1-7](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/internal/algolia/fetcher.go#L1-L7)

索引延迟边界。

```text
// Package algolia fetches a full Hacker News comment thread in a single HTTP
// request via the Algolia HN API. It is an alternative to the Firebase
// per-item fan-out in the root hn package.
//
// Tradeoff: Algolia has roughly 30 minutes of indexing lag, so very recent
// comments on fresh stories may be missing. Callers should fall back to the
// Firebase client if the result is obviously incomplete or the request fails.
```

#### 缺口

- 未审全部 UI 或实施对照
  **影响**：不能断定显示提示不存在或有效
  **进一步探讨**：查现有界面并对固定样本测试。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
