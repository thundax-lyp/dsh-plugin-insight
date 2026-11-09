# dsh-bili-scroll

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[29510a0](https://github.com/c1overzz/dsh-bili-scroll/tree/29510a0100d39da437814ce315f8ca4e1c4c211d)

<!-- BEGIN META -->
[![GitHub ★ 1,333](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C333&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/c1overzz/dsh-bili-scroll) [![npm 30d 63,615](https://img.shields.io/static/v1?label=npm+30d&message=63%2C615&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bili-scroll) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bili-scroll)
<!-- END META -->

> **功能**：在 DSH 中按关键词或推荐筛选 B站视频，可写日报，并按设置提供评论、私信和收藏。

> **亮点**：[Q01](#research-q01) 在 DSH 轮次中组合候选、字幕、判重和日报；新版本把宿主投递段更新限制在固定段落。内容准确和节时待测。

> **主要限制**：[Q02](#research-q02) 权限随实际 profile 和工具清单变化。[Q03](#research-q03) 宿主 force、私信默认路径、锁与发送时序，均限制把界面状态当成授权或去重凭证。

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
  - [Q01 · 持续关注 B站内容时，报告怎样比手工筛选更容易核对？](#detail-section-11)
  - [Q02 · DSH 一轮怎样获得工具，profile 失败会怎样退让？](#detail-section-12)
  - [Q03 · 评论、私信与收藏的控制和判重能保障什么？](#detail-section-13)
  - [Q04 · 只读试用需要哪些账号与环境，失败如何退出？](#detail-section-14)
  - [Q05 · 结构化动作收据能否减少误重试？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向持续跟踪 B站主题的个人用户。手工搜索与收藏可以直接读原片，插件按轮次整理可回查日报。

[Q01](#research-q01) 同一候选集、相同主题和入选标准，对照人工逐条核对与插件日报。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 内容筛选 | 推荐或搜索，读原字幕 | 内容可信仍需核对 |
| 日报 | 按日追加并回看 BV | 关闭报告时没有正文产物 |
| 账号互动 | 条件式评论、私信与收藏 | 确认实际开关、授权和回执 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 0.1.7-rc.1+、Node 22+ | manifest 声明 | bundle 和宿主 | 先核对实际 profile |
| Python 环境、网络、授权 B站账号 | 对相应 MCP 和登录路径必需 | 读取与账务确认 | 环境未就绪先停止轮次 |
| 宿主模型及视觉附件 | 模型必需，图片按需 | 筛选与看图 | 图像路径可能降级 |
| 转写环境与模型 | 可选 | 无字幕转写 | 按报告记下未覆盖 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对环境、来源、凭证与生效设置 | 确认只读工具清单与本地输出位置 |
| 执行 | 用户发起一次小轮，Agent 读字幕并整理 | 有候选与来源，失败看日志或占位报告 |
| 验收 | 用户复核原片、交互及报告 | 无法对账时停止重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Python 环境、网络及账号，金额未知 | 安装、扫码、确认权限和工具 | 自动下载可无摘要，渠道须核对 |
| 持续使用 | 模型 token 与可选 ASR CPU、存储，实际未知 | 对照原视频，核对权限和报告 | 无同条件节时数据 |
| 失败恢复 | 重跑消耗与已发生远程动作，金额未知 | 排查 profile、核对回执和残留 | 超时和未查到无法判定未发生 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 内容筛选 | 有候选、字幕和日报接线 | 入选准确、遗漏与人工节省 |
| 日报维护 | 固定形状原地替换、读回 BV 号 | 并发完整性与最终内容质量 |
| 互动控制 | 配置、名单、PID 锁与回执复核 | 是否出现误投递及重复 |

> **思考**：[Q02](#research-q02) 权限随实际 profile 和工具清单变化。[Q03](#research-q03) 宿主 force、私信默认路径、锁与发送时序，均限制把界面状态当成授权或去重凭证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在 DSH 轮次中组合候选、字幕、判重和日报；新版本把宿主投递段更新限制在固定段落。内容准确和节时待测。

[Q01](#research-q01) 定位段落范围解决特定覆盖问题。[Q02](#research-q02) 配置退让改变实际权限。[Q03](#research-q03) 分开宿主直接工具、值班 MCP 和监听动作。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 权限随实际 profile 和工具清单变化。[Q03](#research-q03) 宿主 force、私信默认路径、锁与发送时序，均限制把界面状态当成授权或去重凭证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 核对实际生效的评论、私信、收藏和定时开关，检查 tool list，先手动筛选并与原片对照。发现状态未知时停止外发，核对远端和本地痕迹。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持报告、工具及外发分支。账号、平台发送、推荐质量和结果恢复未实测。

- 已检查：作者 README、包清单、源码路径 prompts/duty.md、vendor/bilibili-mcp/mcp_server.py、index.js、lib/report-sect.mjs、package.json、cordis.patch.yml、profile-template/bili-duty/cordis.patch.yml、lib/model-select.mjs、README.md、lib/uvfetch.mjs、lib/login.mjs、lib/verify.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态检查固定 bundle、代表性宿主入口、MCP 白名单、报告、凭证、外发与验证。未执行目标，未装依赖，未使用账号或触发外部动作。
- 下一步：[Q05](#research-q05) 用同候选和可控传输先验证只读清单、外发守卫及回执丢失，再分别计误重试、漏送和人工成本。

**分析版本**

- **仓库**：[c1overzz/dsh-bili-scroll](https://github.com/c1overzz/dsh-bili-scroll)
- **版本号**：2.5.1（[固定提交 29510a0](https://github.com/c1overzz/dsh-bili-scroll/tree/29510a0100d39da437814ce315f8ca4e1c4c211d)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在已知回执前后保存分态和操作标识，再对未知结果对账，可能减少误重试。以现有有限复核为对照，计入漏送和新增人工核账。

[Q05](#research-q05) 用同候选和可控传输先验证只读清单、外发守卫及回执丢失，再分别计误重试、漏送和人工成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 1703 | — | — | 31786 |
| .js | source | 2 | 4581 | 3576 | 992 | — |
| .mjs | source | 15 | 1788 | 1267 | 440 | — |
| .mjs | test | 7 | 628 | 531 | 31 | — |

</details>

**活跃度**

[![Issue 未关闭 99](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=99&color=737b86&logo=github)](https://github.com/c1overzz/dsh-bili-scroll/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 126](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=126&color=737b86&logo=github)](https://github.com/c1overzz/dsh-bili-scroll/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 27](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=27&color=737b86&logo=github)](https://github.com/c1overzz/dsh-bili-scroll/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：每轮 B站内容筛选能在何种权限和失败边界内形成可核对的报告，外部动作和恢复怎样验证？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 持续关注 B站内容时，报告怎样比手工筛选更容易核对？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

章程在关键词为空时使用账号推荐流，填了词才搜，逐条核对字幕，特定无字幕演示可查看画面。宿主安排窄口工具以运行日追加 Markdown，读取标题中的 BV 号，便于复核原视频。2.5.0 的宿主投递段按固定形状原地替换并去掉重复段，2.5.1 的列表解析能保留转义竖线。手工浏览和收藏容易追溯原片，但缺同一格式和轮次组织。

#### 证据与依据

**依据 1 · 作者声明**：[prompts/duty.md:92-110](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/prompts/duty.md#L92-L110)

章程说明推荐、搜索、判重和源内容路径。

<details>
<summary>查看原文（19行）</summary>

```text
## 一轮要做的事

1. **先决定这一轮"看哪儿"**（开场会告诉你设置里的关键词填没填）：

   - ⭐ **没填关键词（默认）** ⇒ 用 **`bili_recommend(ps=30)`** 刷**这个账号的首页推荐流**。
     这是**故意的**：以前留空会用内置那几组词（DeepSeek Harness / DSH 插件 …）⇒ **所有装了插件的人刷的是同一批视频**，
     评论区就会堆成一片"同款插件互相报到"。推荐流按各自的账号画像推，天然散开。
     · 从返回里**随机挑几条**（别固定取前 N —— 画像相近的人还是会撞车）
     · 推荐流里混着娱乐 / 带货 / 直播切片，**不感兴趣的直接跳过**，不用勉强
     · ⚠️ 推荐流里也会出现"讲 DSH 的 up 自己发的视频"—— 那是正常的，别因为"这圈我熟"就一律跳过
   - **填了关键词** ⇒ 用 **`bili_search(keyword=…)`** 搜（近 7 天优先），一个词一轮，别一次搜五遍
2. 从结果里挑出**值得的**，条数看设置页的「定量刷（每天几条）」；**判重** —— 已经看过的跳过。
   ⭐ **判重表用 `duty_seen_append(bvid, title, up, status)` 写**（一行一条；路径由工具自己定，你不用管）。
   ⚠️ **如果那份判重表读不出来（不存在 / 打不开）**：**不要当成"没记录过"** —— 那会让同一批视频反复推送、
   重复打扰一批人。正确做法是：**在报告里明写"判重表读不到"**，而且**这一轮不发评论**（宁可少发）。
3. 每条：
   - **读字幕原文**（⚠️ 别看摘要下判断）
   - 没有字幕时：**先按下面「什么时候该看画面」判断一次** —— 明显是演示类（教程 / 游戏 / 手工 / 舞蹈 / 美食）
     就先用 `bili_cover` 或 `bili_frames` 看一眼，看过再决定值不值得；画面也说明不了什么才算"读不到内容"。
```

</details>

**依据 2 · 源码核查**：[vendor/bilibili-mcp/mcp_server.py:1364-1373](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/vendor/bilibili-mcp/mcp_server.py#L1364-L1373)

运行日路径由工具构造，追加文本。

<details>
<summary>查看原文（10行）</summary>

```text
    """
    body = str(text or "").replace("\r\n", "\n").strip()
    if not body:
        return "没写：内容是空的"
    p = DUTY_HOME / "out" / (_duty_today() + ".md")
    fresh = not p.exists()
    payload = body + "\n"
    if fresh:
        payload = "# 刷B站日报 " + _duty_today() + "\n\n" + payload
    return "已追加到 " + _append(p, payload)
```

</details>

**依据 3 · 源码核查**：[index.js:2333-2339](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L2333-L2339)

从日报标题提取去重 BV 号。

````text
  /** 从今天的报告里抠出"挑中的" BV 号（只认行首的 ### BV… 标题行；代码围栏里的不算） */
  const pickIdsFromReport = (file) => {
    try {
      const fence = /```[\s\S]*?```/g
      const text = readFileSync(file, 'utf8').replace(fence, '')
      return [...new Set([...text.matchAll(/^#{2,3}[ \t]*(BV[0-9A-Za-z]{10})/gm)].map((m) => m[1]))]
    } catch { return [] }
````

**依据 4 · 源码核查**：[index.js:1578-1588](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L1578-L1588)

投递段实际接入替换器。

<details>
<summary>查看原文（11行）</summary>

```text
    const writeRoundNotesToReport = () => {
      try {
        const notes = [...startupNotes, ...roundNotes]
        if (!notes.length) return
        if (String(cfg.reportLevel || 'full') === 'off') return
        const f = join(outDir, `${dayKey()}.md`)
        const block = '## 投递\n\n' + notes.map((n) => '- ' + n).join('\n') + '\n'
        if (!existsSync(f)) { writeFileSync(f, `# 刷B站 · ${dayKey()}\n\n` + block + '\n', 'utf8'); return }
        let cur = readFileSync(f, 'utf8')
        writeFileSync(f, replaceSect(cur, '## 投递', block), 'utf8')
      } catch { /* 宁可没这段，也不能让这一轮挂掉 */ }
```

</details>

**依据 5 · 源码核查**：[lib/report-sect.mjs:20-38](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/lib/report-sect.mjs#L20-L38)

按标题及列表范围替换，后续正文继续保留。

<details>
<summary>查看原文（19行）</summary>

```text
export function replaceSect(cur, marker, block) {
  const body = block.replace(/^\s*\n/, '').replace(/\s*$/, '')
  const lines = cur.split('\n')
  const keep = []
  let at = -1
  for (let i = 0; i < lines.length; i++) {
    if (!isHead(lines[i], marker)) { keep.push(lines[i]); continue }
    if (at < 0) at = keep.length
    let j = i + 1
    while (j < lines.length && !lines[j].trim()) j++
    while (j < lines.length && lines[j].startsWith('- ')) j++
    while (j < lines.length && !lines[j].trim()) j++
    i = j - 1
  }
  // 写完后文件尾总留一个空行：下一轮是直接往文件尾追加的，紧贴着写会连成同一个列表（文件尾是别的宿主节时也一样）
  if (at < 0) return cur.replace(/\s*$/, '') + '\n\n' + body + '\n\n'
  const before = keep.slice(0, at).join('\n').replace(/\s*$/, '')
  const after = keep.slice(at).join('\n').replace(/^\s*\n/, '').replace(/\s*$/, '')
  return (before ? before + '\n\n' : '') + body + (after ? '\n\n' + after : '') + '\n\n'
```

</details>

**依据 6 · 源码核查**：[index.js:2458-2471](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L2458-L2471)

列表切分保留转义竖线。

<details>
<summary>查看原文（14行）</summary>

```text
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim()
      if (!line.startsWith('|')) continue
      /* ⭐ 2026-11-07（#191）：标题里的竖线会被模型按 Markdown 规范转义成 `\|`，
       *   裸 split('|') 照样切开 ⇒ 列错位、标题被截、UP 吃进标题后半截。
       *   只按"未转义"的竖线切，切完再把 `\|` 还原成 `|`。 */
      const cells = line.split(/(?<!\\)\|/).map((s) => s.replace(/\\\|/g, '|').trim())
      const c = cells.slice(1, cells.length - 1)
      if (c.length < 3) continue
      // ⭐ BV 用扫描定位，不再假设在第 2 列（标题里带竖线也不会错位）
      const bvIdx = c.findIndex((x) => /^BV[0-9A-Za-z]{10}$/.test(x))
      if (bvIdx < 0) continue
      const bvid = c[bvIdx]
      const dayRaw = bvIdx > 0 ? c[bvIdx - 1] : c[0]
```

</details>

#### 缺口

- 章程要求的是预期工作流，缺同一批视频的入选正确率、缺字幕误判和人时。
  **影响**：无法量化筛选或日报带来的净节省。
  **进一步探讨**：给两种流程同一候选集，盲查原文、判重、耗时与漏选。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 一轮怎样获得工具，profile 失败会怎样退让？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

manifest 通过 bundle 挂宿主。插件把专用模板复制入 profile，模板关通用文件、命令和网页工具；名单由 overlay 写到 Python 子进程环境，Python 按名单注册且写操作有入口检查。名单为空时该机制全放。模板失败时默认 headless 配置可能进入权限更宽的 profile，显式配置其他 profile 会被保留。overlay 无法写出仍会 spawn，不传 --patch。宿主另可读选定工作区的 AGENTS.md 并截取后送进提示词，因此模板收窄的是轮次工具。2.5.1 的模型选择对确定不可用的未固定会话 provider 回到 DeepSeek，maybe 的仍可跟随；显式 pin 通常保留，绑定到另一个 profile 才例外。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:67-78](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/package.json#L67-L78)

bundle 与客户端声明。

<details>
<summary>查看原文（12行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-settings-plugins"
      ]
    }
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:15-20](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/cordis.patch.yml#L15-L20)

安装后插入宿主条目。

```text
- insert:
    - id: bili-scroll
      name: dsh-bili-scroll
      config:
        # 真正的用户配置在插件自己的 config 里（设置页可改），这里只放默认值
        enabled: true
```

**依据 3 · 源码核查**：[profile-template/bili-duty/cordis.patch.yml:30-54](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/profile-template/bili-duty/cordis.patch.yml#L30-L54)

关闭通用命令、文件与联网工具。

<details>
<summary>查看原文（25行）</summary>

```text
# ── 命令执行 ────────────────────────────────────────────────────────────────
- id: tool-bash
  disabled: true
- id: tool-pwsh
  disabled: true
- id: tool-jobs
  disabled: true
- id: jobs
  disabled: true
- id: tool-ralph
  disabled: true

# ── 文件系统：读 / 写 / 搜 —— 一个都不留 ────────────────────────────────────
- id: tool-fs
  disabled: true
- id: tool-fs-search
  disabled: true

# ── 联网：B站 数据走 MCP，不需要它自己抓网页 ────────────────────────────────
- id: tool-web
  disabled: true
- id: web-fetch-http
  disabled: true
- id: web-search-deepseek
  disabled: true
```

</details>

**依据 4 · 源码核查**：[index.js:1189-1208](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L1189-L1208)

宿主按设置读取并截断提示材料。

<details>
<summary>查看原文（20行）</summary>

```text
          log('⚠️ 人设提示词 ' + raw.length + ' 字符，超过上限 ' + PERSONA_LIMIT + ' ⇒ 只送前 ' + PERSONA_LIMIT + '（截掉 ' + (raw.length - PERSONA_LIMIT) + ' 字）')
          return raw.slice(0, PERSONA_LIMIT)
        }
        return raw
      })()
      ownerDoc = '\n\n===== 使用者的人设' + (personaFromFile ? '（读自 ' + personaFromFile + '）' : '提示词') + '（**按这个来**）=====\n'
        + personaText
        + '\n===== 人设结束 =====\n'
    }
      const wsDir = String(cfg.workspace || '').trim()
      const agents = (!persona && wsDir) ? join(wsDir, 'AGENTS.md') : ''
      if (agents && existsSync(agents)) {
        const text = readFileSync(agents, 'utf8')
        const AG_LIMIT = 40000
        if (text.length > AG_LIMIT) log('⚠️ 工作区的 AGENTS.md ' + text.length + ' 字符，超过上限 ' + AG_LIMIT + ' ⇒ 只送前 ' + AG_LIMIT + '（截掉 ' + (text.length - AG_LIMIT) + ' 字）')
        ownerDoc = '\n\n===== 使用者的 AGENTS.md（他写给自己 AI 的人设与准则，**按这个来**）=====\n'
          + text.slice(0, AG_LIMIT)
          + '\n===== 设定结束 =====\n'
      }
    } catch { /* 读不到就算了，别因此跑不成 */ }
```

</details>

**依据 5 · 源码核查**：[index.js:1374-1402](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L1374-L1402)

复制模板、告警与实际 profile 选择。

<details>
<summary>查看原文（29行）</summary>

```text
  let dutyProfileState = 'unknown'   // ok / missing / failed
  const dutyProfileDir = join(dirname(stateDir), 'profiles', 'bili-duty')
  const ensureDutyProfile = () => {
    try {
      const src = join(pluginDir, 'profile-template', 'bili-duty')
      if (!existsSync(src)) { dutyProfileState = 'missing'; return false }
      mkdirSync(dirname(dutyProfileDir), { recursive: true })
      // 每次启动都覆盖（模板很小；这是安全边界，用户改它也会被覆盖）
      cpSync(src, dutyProfileDir, { recursive: true, force: true })
      dutyProfileState = existsSync(join(dutyProfileDir, 'cordis.patch.yml')) ? 'ok' : 'failed'
      return dutyProfileState === 'ok'
    } catch (e) {
        dutyProfileState = 'failed'
        const why = String(e?.message ?? e)
        // ⭐ #136：铺不上很常见（杀软锁文件 / OneDrive 同步 / 长路径），但别只丢一句「退回 headless」
        log('⚠️ 最小权限 profile 铺不上：' + why)
        log('   目标目录：' + dutyProfileDir)
        log('   常见原因：杀软或 OneDrive 正在占用、盘符长路径、目标被别的进程锁住')
        log('   ⚠️ 这一轮只能用 headless（权限更大：能看到文件系统）—— 修好后重启 dsh 就回到最小权限')
        startupNotes.push('⚠️ 最小权限 profile 没铺上，这一轮退回了 headless（权限更大）：' + why)
        return false
    }
  }
  // 真正用的 profile：用户手填了别的就尊重；还是老默认 has headless ⇒ 用最小权限那个
  const effectiveProfile = () => {
    const want = String(cfg.headlessProfile || '').trim()
    if (want && want !== 'headless' && want !== 'bili-duty') return want
    return dutyProfileState === 'ok' ? 'bili-duty' : (want || 'headless')
  }
```

</details>

**依据 6 · 源码核查**：[index.js:1517-1533](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L1517-L1533)

stdio MCP overlay 及写入失败。

<details>
<summary>查看原文（17行）</summary>

```text
    if (cfg.overlayMcp) {
      yml.push(
        '- insert:',
        '    - id: mcp-bili-duty',
        "      name: '@deepseek-ai/dsh-mcp-client'",
        '      config:',
        '        serverName: bili-duty',
        '        transport: stdio',
        '        command: ' + yq(posix(cfg.pythonPath || 'python')),
        '        args:',
        '          - ' + yq(posix(script)),
        '        env:',
        '          BILI_MCP_TOOLS: ' + yq(mcpWhitelist().join(',')),
        '',
      )
    }
    try { writeFileSync(file, yml.join('\n'), 'utf8'); return file } catch (e) { log(`写 overlay 失败：${e?.message ?? e}`); return null }
```

</details>

**依据 7 · 源码核查**：[vendor/bilibili-mcp/mcp_server.py:58-78](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/vendor/bilibili-mcp/mcp_server.py#L58-L78)

空名单与非空名单的注册和调用逻辑。

<details>
<summary>查看原文（21行）</summary>

```text
_ALLOWED = {t.strip() for t in os.environ.get("BILI_MCP_TOOLS", "").split(",") if t.strip()}


def tool():
    """@tool() 的替身：白名单里没有这个函数名，就原样返回、**不注册**。"""
    def deco(fn):
        if _ALLOWED and fn.__name__ not in _ALLOWED:
            return fn
        return mcp.tool()(fn)
    return deco


# ⭐⭐ 2026-10-23 安全加固（issue #39）：**白名单以前只挡"注册"，不挡"直接调用"** ——
#    agent 手里有 python/shell，可以自己写脚本 import 这个文件再调函数 ⇒ 闸门形同虚设。
#    ⇒ 每个"会往 B站 写东西"的函数入口都过一遍 _guard()；没开就直接返回、什么都不做 ✓
def _guard(name: str) -> str:
    """没开这个工具就返回一句提示；开着返回空串。"""
    if _ALLOWED and name not in _ALLOWED:
        print(f"[bili-mcp] 拒绝调用 {name}（不在 BILI_MCP_TOOLS 白名单里）", file=sys.stderr)
        return f"这个工具没开：{name}"
    return ""
```

</details>

**依据 8 · 源码核查**：[index.js:1782-1797](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L1782-L1797)

组装参数，overlay 缺失仍继续。

<details>
<summary>查看原文（16行）</summary>

```text
    refreshCfg()          // ⭐ 设置页刚改过的值要立刻生效（config 是就地改的，快照会过期）
    const dsh = resolveDsh()
    // ⭐ 找不到 dsh 就别硬跑：以前会退化成裸 `dsh` ⇒ spawn 失败、只留 exit 1 + 一串乱码 ✗
    if (dsh.missing) {
      const msg = '这一轮没跑：找不到 dsh。' + dsh.hint
      log(msg)
      try { stubReportIfMissing(1) } catch { /* 补不上也不影响这句话已经进日志 */ }
      return { started: false, why, error: msg }
    }
    // ⭐ 跨宿主运行锁：拿到才跑（写不了锁时照常跑，函数内部已经 fail-open）
    if (!acquireRunLock(why)) return { started: false, why, busy: true, error: '另一个宿主正在跑这一轮' }
    const overlay = ensureOverlay()
      const args = [...dsh.args, '--profile', effectiveProfile()]
    if (overlay) args.push('--patch', overlay)
    roundNotes.length = 0
    args.push(promptFor(why))
```

</details>

**依据 9 · 源码核查**：[lib/model-select.mjs:33-44](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/lib/model-select.mjs#L33-L44)

三态适配判断。

<details>
<summary>查看原文（12行）</summary>

```text
export function providerState(p, env) {
  const id = String(p || '')
  if (!id) return 'no'
  if (BASE_PROVIDERS.includes(id)) return 'yes'
  const needProfile = PROFILE_ONLY_PROVIDERS[id]
  if (needProfile) {
    try { return env.profile() === needProfile ? 'yes' : 'no' } catch { return 'no' }
  }
  try {
    if (env.profile() === TEMPLATE_PROFILE && env.templateIsStock()) return 'no'
  } catch { /* 判断不了 ⇒ 就是看不到 */ }
  return 'maybe'
```

</details>

**依据 10 · 源码核查**：[lib/model-select.mjs:56-68](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/lib/model-select.mjs#L56-L68)

明确 pin、跟随与 fallback 分支。

<details>
<summary>查看原文（13行）</summary>

```text
export function chooseModel({ pin, session }, env) {
  const boundElsewhere = pin && PROFILE_ONLY_PROVIDERS[pin.provider] && providerState(pin.provider, env) === 'no'
  if (pin && !boundElsewhere) return { ...pin, source: 'plugin' }
  if (session && providerState(session.provider, env) !== 'no') {
    return pin ? { ...session, source: 'session', ignored: pin } : session
  }
  return {
    ...FALLBACK_MODEL,
    source: 'fallback',
    ...(pin ? { ignored: pin } : {}),
    ...(session ? { sessionIgnored: { provider: session.provider, model: session.model } } : {}),
  }
}
```

</details>

#### 缺口

- 未观察目标宿主真实注册后的工具、权限和模型。
  **影响**：模板复制存在与真正加载成功有差异，备用 profile 与 overlay 缺失都影响操作边界。
  **进一步探讨**：在隔离 profile 检查三条路径的实际工具清单及模型路由，预期权限缺失就取消轮次。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 评论、私信与收藏的控制和判重能保障什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

宿主直接 bili_reply 用开关、昵称、投递模式检查，但模型工具参数 force 能越过，无同次授权的结构化证明。值班轮是独立名单，only 不下发评论，autoComment 或 replyToComments 才下发；默认 only 已允许私信工具，监听在 schema 默认开，与 README 有出入。监听只拉指定 owner 的未读正文，但写 seen 后才启动模型回复，调用失败仍可被当作处理过；旧会话非零退出会新开重试。Python 私信使用工具参数收件 UID，不绑定到监听 owner。宿主的收藏以成功轮次、有目标夹和日报 BV 驱动。跨进程轮次锁分离读写、TTL 十分钟且失败放行，无法保证排他。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:56-67](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L56-L67)

自动刷、公开评论及投递模式默认值。

<details>
<summary>查看原文（12行）</summary>

```text
  perDay: z.natural().default(5).extra('volatile', true),
  /** 峰谷自动刷（总开关） */
  peakValley: z.boolean().default(false).extra('volatile', true),
  /** 峰谷子开关：中午 / 晚上 */
  noon: z.boolean().default(true).extra('volatile', true),
  night: z.boolean().default(true).extra('volatile', true),
  /** 自动评论 @ 使用者（默认关 —— 会拿用户的号说话，必须他自己开） */
  autoComment: z.boolean().default(false).extra('volatile', true),
  /** ⭐ 私信投递：off=只发评论（现状）· only=只私信（完全不公开评论）· both=评论 + 私信 */
  dmMode: z.string().default('only').extra('volatile', true),
  /** ⭐ 私信发给谁的 UID（数字）。要在 dmMode 不是 off 时填 */
  dmUid: z.natural().default(0).extra('volatile', true),
```

</details>

**依据 2 · 源码核查**：[index.js:98-114](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L98-L114)

私信监听与收藏默认值。

<details>
<summary>查看原文（17行）</summary>

```text
  /** 私信监听：只认主人本人发来的私信，有新消息就回一句 · 2.0 起默认开（查私信不花 token，只有真有人发消息才回一句） */
  dmWatch: z.boolean().default(true).extra('volatile', true),
  /** 私信监听间隔（分钟，最小 3） */
  dmWatchMinutes: z.natural().default(1).extra('volatile', true),
  /** 私信回复每天最多几条（防刷） */
  dmReplyPerDay: z.natural().default(0).extra('volatile', true),
  /** 只回这个 UID（0 = 用「私信发给谁」那个） */
  dmOwnerUid: z.natural().default(0).extra('volatile', true),
  workspace: z.string().default('').extra('volatile', true),
  /** 日报形态：full=完整（现状）· brief=每条一两行 · off=不写报告（只发评论） */
  reportLevel: z.string().default('full').extra('volatile', true),
  /** 回复评论：默认关。开了之后只回「直接回复到它那条评论下面的人」 */
  replyToComments: z.boolean().default(false).extra('volatile', true),
  /** 每轮最多回几条 */
  replyPerRound: z.number().default(1).extra('volatile', true),
  /** 自动收藏：0 = 不收藏；>0 = 目标收藏夹 fid（设置页下拉选）。动作在宿主侧完成，模型拿不到这只手 */
  favFolderId: z.number().default(0).extra('volatile', true),
```

</details>

**依据 3 · 作者声明**：[README.md:97-102](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/README.md#L97-L102)

作者对界面默认值的说法。

```text
| 页签 | 里面有什么 |
|---|---|
| **日常** | **峰谷自动刷**（总开关，打开才展开「中午 12–14」「晚上 18–09」两个子开关）· **每天最多挑几条**（0 = 只手动）· **它刷过的视频**（卡片墙 + 档位/状态筛选 + 分页） |
| **偏好** | **它按什么说话（人设提示词）** ← 想让它像谁就写在这儿，留空按中性说话 · **关注关键词**（一行一个）· **自动收藏到**（可选收藏夹）· **日报写多细**（完整 / 薄版 / 不写）· 下面一个**保存**按钮 |
| **互动** | **自动评论并 @ 你**（默认关）· **回复评论**（默认关，只回楼中楼）· **投递方式**（只私信 = 默认 / 只发评论 / 两边都发）· **私信发给谁（UID）**（可留空，用昵称自动查）· **私信双向**（默认关，开了它会读你的私信并回一句） |
| **高级** | **环境与账号**（装主依赖 / 测一下 / 检查更新 / 扫码登录）· **复制诊断信息** · **环境自检** · **它的地盘**（家目录、报告、复核评论、打开文件夹）· 工作区（老用户才需要） |
```

**依据 4 · 源码核查**：[index.js:743-771](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L743-L771)

宿主工具由模型参数 force 触发例外。

<details>
<summary>查看原文（29行）</summary>

```text
  tool({
    name: 'bili_reply',
    description: '在视频下发评论（或回复某条评论）。这就是"@ 本人"那一下：短、干净、纯文本 @ 写在正文里。\n'
      + '🔴 安全闸：设置页的「自动评论并 @ 你」**默认是关的**；关着的时候这个工具会拒绝 —— '
      + '除非本人当场让你发（那时传 force: true）。',
    parameters: {
      bvid: { type: 'string', description: 'BV号' },
      text: { type: 'string', description: '评论正文（短、干净、纯文本 @；别写敏感词）' },
      rpid: { type: 'number', description: '要回复的评论 id（0/不填 = 发新评论）' },
      force: { type: 'boolean', description: '本人当场让你发的，传 true 越过"自动评论关着"的闸' },
    },
    async execute(args) {
      // dmMode==='only' 时本轮根本不该发公开评论 —— 在工具层也一并挡掉（除非当场 force）
      const commentOn = Boolean(cfg.autoComment && cfg.mentionName && cfg.dmMode !== 'only')
      if (!commentOn && !args.force) {
        return {
          ok: false,
          blocked: true,
          hint: cfg.dmMode === 'only'
            ? '现在是「只私信」模式（dmMode=only）—— 规定不发公开评论，改成用 bili_send_message 私信。确实要发时传 force: true。'
            : '要发评论得同时满足两条：设置里开着「自动评论并 @ 你」、并且填了「要 @ 谁」。或者本人当场让你发时传 force: true。',
        }
      }
      return call('bili_reply', {
        bvid: String(args.bvid ?? ''),
        text: String(args.text ?? ''),
        rpid: Number(args.rpid) || 0,
      })
    },
```

</details>

**依据 5 · 源码核查**：[index.js:1350-1368](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L1350-L1368)

值班 MCP 独立名单。

<details>
<summary>查看原文（19行）</summary>

```text
  const mcpWhitelist = () => {
    const list = ['bili_search', 'bili_subtitle', 'bili_comments', 'bili_video_info',
      'bili_cover', 'bili_frames', 'bili_danmaku', 'bili_recommend']  // 看封面 / 画面帧 / 弹幕：只读，不需要额外的闸
    // ⭐⭐ 2.0.5（issue #96 安全加固）：值班轮改成最小权限 profile（没有 fs / shell / web）⇒
    //    写日报 / 判重表 / 归档、以及无字幕转写，全走这几只**固定路径的窄口工具** ✓
    list.push('duty_paths', 'duty_report_append', 'duty_seen_append', 'duty_digest_append', 'duty_seen_recent')
    // ⭐ 2026-10-25：转写改成 job 模型（start / result）—— 慢活不该占住一次工具调用；
    //    老的 bili_transcribe 还留着（仍能用，但它会等到跑完，别在一轮里连用两条）
    if (cfg.asrInstalled !== false) list.push('bili_transcribe', 'bili_transcribe_start', 'bili_transcribe_result')
    // ⭐⭐ 2.0.4（第三方体检第 3 条）：**"只发私信"时评论通道必须硬关** —— 以前只看 autoComment，
    //    用户以前开过自动评论、后来切到"只私信"，那个 true 还在 config 里 ⇒ 评论工具照样下发 ✗
    const dmOnly = String(cfg.dmMode || '').trim() === 'only'
    if (!dmOnly && (cfg.autoComment || cfg.replyToComments)) list.push('bili_reply')
    // ⭐ 2026-10-19（issue #25 / #16 的实证，做法参考社区 PR #37）：私信开着却忘了给 bili_send_message ⇒
    //   模型手里压根没有这只工具 ⇒ 表现成"开关也开了、这一轮也跑了，但从来没发出去过" ✗
    //   ⇒ dmMode 不是 off、且填了收件人 UID 才放进去（关着就不给，白名单别松）
  if (String(cfg.dmMode || 'off') !== 'off' || cfg.dmWatch) list.push('bili_send_message')   // 2026-10-21：UID 可能靠昵称查，别再拿 dmUid>0 当条件
    return list
  }
```

</details>

**依据 6 · 源码核查**：[index.js:1716-1748](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L1716-L1748)

跨进程读写、TTL 和失败放行。

<details>
<summary>查看原文（33行）</summary>

```text
  const runLockFile = join(stateDir, 'run-lock.json')
  const RUN_LOCK_TTL = 10 * 60_000
  const pidAlive = (pid) => {
    if (!pid) return false
    try { process.kill(pid, 0); return true } catch { return false }
  }
  /** 试着占锁：拿到 ⇒ true；有人正占着（新鲜的、进程还活着、不是我）⇒ false */
  const acquireRunLock = (why) => {
    try {
      let lock = null
      try { lock = JSON.parse(readFileSync(runLockFile, 'utf8')) } catch { lock = null }
      if (lock && Number(lock.pid) !== process.pid) {
        const fresh = Number(lock.ts) > Date.now() - RUN_LOCK_TTL
        if (fresh && pidAlive(Number(lock.pid))) {
          log(`这一轮没跑（${why}）：另一个宿主正在跑（pid=${lock.pid}）⇒ 让给它`)
          return false
        }
        if (!fresh) log('运行锁已过期（' + Math.round((Date.now() - Number(lock.ts)) / 60000) + ' 分钟前那个），这一轮照跑')
      }
      writeFileSync(runLockFile, JSON.stringify({ pid: process.pid, ts: Date.now(), why }), 'utf8')
      return true
    } catch (e) {
      // 锁文件坏了/写不进去 ⇒ 不拦路（fail-open，但留痕）
      log('运行锁读写失败（这一轮照跑）：' + String(e?.message ?? e))
      return true
    }
  }
  /** 放锁：只放自己的那张（别把别人的删了） */
  const releaseRunLock = () => {
    try {
      const lock = JSON.parse(readFileSync(runLockFile, 'utf8'))
      if (Number(lock?.pid) === process.pid) writeFileSync(runLockFile, '{"pid":0,"ts":0}', 'utf8')
    } catch { /* 没有锁 / 读不出来 / 写不进去都无所谓，靠 10 分钟过期兜底 */ }
```

</details>

**依据 7 · 源码核查**：[index.js:1865-1870](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L1865-L1870)

宿主自动收藏入口。

```text
      stubReportIfMissing(code)   // ⭐ 没写报告就补一份占位 —— 别让使用者什么都看不到
      try { writeRoundNotesToReport() } catch { /* 写不进去也不能炸 */ }
    // ⭐ 2026-10-20：这一轮跑成了、并且使用者选了收藏夹 ⇒ 把挑中的存进去（后台做，别拖住收尾）
    if (code === 0 && Number(cfg.favFolderId) > 0) {
      favToday('auto').catch((error) => log('自动收藏出错（已兜住）：' + String(error?.message ?? error)))
    }
```

**依据 8 · 源码核查**：[index.js:2119-2137](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L2119-L2137)

私信监听 owner 过滤。

<details>
<summary>查看原文（19行）</summary>

```text
      if (!cfg.dmWatch) return
      const cred = dmCred(stateDir)
      if (!cred) return
      // ⚠️ 不再用「@ 谁」的昵称去推断"谁是主人"（那可能是别人 ✗，2026-10-23 修的）
      const owner = dmOwnerUid()
      if (!owner) {
        log('私信监听：还不知道"我自己的 UID"⇒ 先不监听（设置 → 刷B站 → 高级 →「只回谁的私信」）')
        return
      }
      if (String(cfg.mentionName || '').trim()) {
        const configured = Number(cfg.dmOwnerUid) > 0
        if (!configured) {
          log('私信监听：现在只回"登录账号自己"的私信；想回你大号的话，请在高级里填「只回谁的私信」= 你自己的 UID')
        }
      }
      const sess = await dmList(cred)
      const mine = sess.filter((s) => s.uid === owner && s.unread > 0)
      // ⭐ 只回主人本人：别人（陌生人）发来的一律不回 —— 这里明确记一行，免得以为它在偷听
      const others = sess.filter((s) => s.uid !== owner && s.unread > 0)
```

</details>

**依据 9 · 源码核查**：[index.js:2152-2168](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L2152-L2168)

先标 seen 后启动回复。

<details>
<summary>查看原文（17行）</summary>

```text
      for (const s of mine) {
        const msgs = await dmFetch(cred, s.uid, 8)
        const last = [...msgs].reverse().find((m) => !m.fromMe)
        if (!last) continue
        if (seen[String(s.uid)] === last.key) continue
        // ⭐⭐ 2.0.4（第三方体检第 1 条）：额度判断必须在"记账"之前 ✗
        //    以前先写 seen 再判额度 ⇒ 那条被标成"已处理"、额度恢复或第二天也不会再回 ✗
        if (Number(cfg.dmReplyPerDay) > 0 && quota.n >= Number(cfg.dmReplyPerDay)) {
          log('私信监听：今天额度用完了（' + quota.n + '/' + cfg.dmReplyPerDay + '）⇒ 这条先不回，明天会自动补')
          continue
        }
        seen[String(s.uid)] = last.key
        writeJsonFile(dmSeenFile, seen)
        log(`私信监听：收到新消息 —— ${last.text.slice(0, 40)}`)
        runDmReply(s.uid, last.text)
        quota.n++
        writeJsonFile(dmQuotaFile, quota)
```

</details>

**依据 10 · 源码核查**：[index.js:2071-2086](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L2071-L2086)

续会话非零退出导致重试。

<details>
<summary>查看原文（16行）</summary>

```text
      child.on('exit', (code) => {
        dmReplyRunning = false
        log(`私信回复结束（code=${code}）`)
        rotateLogIfBig()
        // ① 本来没有会话 id：跑完把它开出来的那个认领下来，下一条就能接着聊
        if (!savedSid && code === 0) {
          const id = discoverDmSession(startedAt)
          if (id) { writeDmSession(id); log('私信会话已记录：' + id.slice(0, 24) + '…（以后私信都接着这个会话）') }
          else log('⚠️ 没找到这次的会话 id ⇒ 下一条私信还是新会话（不影响回复，只是没上下文）')
        }
        // ② 带了 id 却失败（会话被删/迁移过）⇒ 丢掉它，下一条重开，别卡死在坏 id 上
        if (savedSid && code !== 0) {
          writeDmSession('')
          log('⚠️ 续会话失败（' + savedSid.slice(0, 16) + '…）⇒ 清掉 id，立刻用新会话重试一次（这条不能没回）')
          setTimeout(() => { try { runDmReply(fromUid, text) } catch { /* 兜住 */ } }, 800)
        }
```

</details>

**依据 11 · 源码核查**：[vendor/bilibili-mcp/mcp_server.py:1178-1198](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/vendor/bilibili-mcp/mcp_server.py#L1178-L1198)

私信入口接工具给出的 UID 并调用平台。

<details>
<summary>查看原文（21行）</summary>

```text
    _deny = _guard("bili_send_message")
    if _deny: return _deny
    cred = get_cred()

    if not text or not text.strip():
        return json.dumps({"success": False, "error": "text 不能为空"}, ensure_ascii=False)

    try:
        result = await session.send_msg(
            credential=cred,
            receiver_id=receiver_uid,
            msg_type=session.EventType.TEXT,
            content=text.strip(),
        )
        # ⭐ 2.0.4（issue #35）：**接口没抛异常 ≠ 真的送到了** ——
        #    以前只要不抛就报 success: True，而 B站 可能出现 code=0 却没给投递回执（msg_key）的情况 ✗
        #    回执就在返回值里：有 msg_key 才算发出去；code 非 0 直接算失败 ✓
        data = result if isinstance(result, dict) else {}
        code = data.get("code", 0)
        inner = data.get("data")
        msg_key = data.get("msg_key") or (inner.get("msg_key") if isinstance(inner, dict) else None)
```

</details>

#### 缺口

- 未用账号验证真实发送、授权、去重、脚本重试和第三方平台结果。
  **影响**：只看自动评论关闭会遗漏其他外发路径；未找到评论或超时不等于未发送。
  **进一步探讨**：禁用所有互动做隔离工具清单，模拟锁竞争、回复成功后退出错误与回执丢失。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 只读试用需要哪些账号与环境，失败如何退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

DSH 和 Node 版本由 manifest 声明，Python 主环境、网络和 B站账号是登录与 MCP 的依赖，ASR 独立启用。自动补 uv 先验预期摘要；摘要不可得时仍解包执行版本检查。凭证落本地 JSON 并尽力收紧权限，Windows 读回失败可重置继承。先明确将私信投递、私信监听、回复评论、自动评论、收藏和峰谷关闭，确认实际 tool list 与 profile，再手动跑小范围筛选。若路径降级、账号状态或报告来源不明，停止下一轮和外发，保留日志并核对已发生的外部动作。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:45-48](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/package.json#L45-L48)

声明 DSH 和 Node 下限。

```text
  "engines": {
    "dsh": ">=0.1.7-rc.1",
    "node": ">=22"
  },
```

**依据 2 · 作者声明**：[README.md:30-39](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/README.md#L30-L39)

作者说明 Python、uv 及下载。

<details>
<summary>查看原文（10行）</summary>

```text
## 装之前（一条前提，30 秒）

机器上要有 **`Python 3.10+` 或 `uv`** —— **有一个就够**：

- **有 `uv` 最好**：单个 ~32 MB 的 exe，**解压就能用、不用管理员、不用进 PATH**，而且它还能自己把 Python 拉下来；
- 只有 Python 也行（装官方安装器时记得勾 **`Add to PATH`**）；
- ⭐ **两个都没有？也没关系**：点「装依赖」时**插件会自己下一份 `uv` 放到自己的家目录**
  （单文件、约 15MB、**免管理员、不用进 PATH** ✓），之后全程自动 ✓
  · 它会**先直连 GitHub，不通就走国内加速代理**，还配了 PyPI 镜像兜底 ✓
  · 下载完会**核对官方 `sha256`**（对不上就丢弃换下一个源 ✓）—— 因为它下来的东西是要**被执行**的
```

</details>

**依据 3 · 作者声明**：[README.md:74-91](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/README.md#L74-L91)

作者说明 ASR 分段和扫码主流程。

<details>
<summary>查看原文（18行）</summary>

```text
3. **它下不动 `uv`**（桌面版上这条链路经常不通）⇒ 自己放一份 `uv.exe` 到 `<家目录>\bin\`，
   插件会用那一份、跳过下载。
4. **「本地转写」是两段式的** —— 只打开开关**不够**，还得点它下面那个「**装转写依赖**」。
   没装的时候，没字幕的视频会被**跳过**（报告里现在会写「**因无字幕跳过 N 条**」，你能一眼看出漏了几条）。
5. ⭐ **桌面版：装完设置页里根本不出现「刷B站」，日志只有一句 `1 entry did not activate … failed to import`** ——
   这是 0.1.3 及以前在桌面版上的一个真 bug：插件宿主半 import 的两个包是 *optional peer*，
   而桌面版 profile（`autoInstallPeers: false`）**不会装它们** ⇒ 插件整条不激活。
   **0.1.4 起已修**（不再裸 import 那两个包）。⇒ 升级一次就好：`dsh plugin --profile desktop add dsh-bili-scroll`。
   ⚠️ 我们自己也只在 **npm 0.1.7-rc.x + web profile** 上实测过；桌面版这条路靠用户反馈修好的 ——
   装完还是不行的话，把 `duty.log` 里那几行发来（里面会写清楚"宿主依赖是从哪儿取的"）。

## 首次使用（两步）

1. **装主依赖** —— 设置页点「装主依赖」：在插件自己的家目录建一个独立 venv，装 4 个包
   （`bilibili-api-python` / `aiohttp` / `mcp<2` / `qrcode`）。**走国内镜像 + uv，通常几十秒**（进度写 `install.log`，不卡页面）。
2. **扫码登录** —— 点「扫码登录」，用手机 B站 扫页面上那张码。
   ⚠️ **确认时选「记住我 / 长期」那张**（选 24 小时的话，明天就得重扫）。
   凭证只落在你本机的插件家目录：`<DSH_HOME>/bili-duty/bili_credential.json`，不上传任何地方。
```

</details>

**依据 4 · 源码核查**：[lib/uvfetch.mjs:171-198](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/lib/uvfetch.mjs#L171-L198)

摘要缺失会继续，解包后执行版本探测。

<details>
<summary>查看原文（28行）</summary>

```text
      log(`正在下载 uv —— ${s.label}`)
      const res = await fetch(s.url)
      if (!res.ok) { log(`  → 返回 ${res.status}，换下一个源`); continue }
      await pipeline(Readable.fromWeb(res.body), createWriteStream(s.file))
      const mb = (statSync(s.file).size / 1048576).toFixed(1)
      log(`  → 下载完成 ${mb} MB`)
      // ⭐ 完整性校验：下载下来是要**被执行**的，必须跟官方 sha256 对上（防的是第三方代理动过包 ✗）
      const want = await expectedSha(s)
      if (want) {
        const gotSha = sha256Of(s.file)
        if (gotSha !== want) {
          log(`  → ⚠️ sha256 校验不过（期望 ${want.slice(0, 12)}… 实际 ${gotSha.slice(0, 12)}…）⇒ 丢弃这个源`)
          continue
        }
        log('  → 官方 sha256 校验通过 ✓')
      } else {
        log('  → 没取到官方 sha256，跳过校验（下载来自 HTTPS 的官方地址时风险很小）')
      }
      log('  → 开始解压')
      const hit = extractArchive(a.bin, s.file, tmp)
      if (!hit) { log('  → 解压后没找到可执行文件，换下一个源'); continue }
      copyFileSync(hit, target)
      try { chmodSync(target, 0o755) } catch { /* Windows 上不需要 */ }
      // ⭐ 版本检查：这个二进制得能**在这台机器上跑**——架构/ABI 不匹配（比如把 x86 的包下到了 arm64）会跑不起来 ✗
      let runs = false
      try {
        const r = spawnSync(target, ['--version'], { stdio: 'ignore' })
        runs = r.status === 0
```

</details>

**依据 5 · 源码核查**：[lib/login.mjs:97-125](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/lib/login.mjs#L97-L125)

权限收紧、回退及本地凭证持久化。

<details>
<summary>查看原文（29行）</summary>

```text
export function hardenPerms(file) {
  try {
    if (process.platform === 'win32') {
      const sid = currentUserSid()
      // `*S-1-…` = 让 icacls 直接用 SID、跳过名字解析；拿不到 SID 才退回「域\用户名」（也不会撞上机器账户）
      const who = sid ? '*' + sid : (process.env.USERDOMAIN ? process.env.USERDOMAIN + '\\' : '') + (process.env.USERNAME || '')
      execFileSync('icacls', [file, '/inheritance:r', '/grant:r', who + ':F'], { stdio: 'ignore', windowsHide: true })
      try { readFileSync(file) } catch {
        execFileSync('icacls', [file, '/reset'], { stdio: 'ignore', windowsHide: true })
        return false
      }
    } else {
      execFileSync('chmod', ['600', file], { stdio: 'ignore' })
    }
    return true
  } catch { return false }
}

export function saveCredential(stateDir, credential) {
  mkdirSync(stateDir, { recursive: true })
  const file = join(stateDir, 'bili_credential.json')
  writeFileSync(file, JSON.stringify({
    sessdata: credential.sessdata ?? '',
    bili_jct: credential.bili_jct ?? '',
    buvid3: credential.buvid3 || '',
    dedeuserid: credential.dedeuserid ?? '',
  }, null, 2), 'utf8')
  try { hardenPerms(file) } catch { /* 收紧失败也不影响登录 */ }
  return file
```

</details>

**依据 6 · 源码核查**：[index.js:2175-2190](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L2175-L2190)

监听生命周期与清理。

<details>
<summary>查看原文（16行）</summary>

```text
  function startDmWatch() {
    try {
      if (dmTimer) { clearInterval(dmTimer); dmTimer = null }
      const mins = Math.max(1, Number(cfg.dmWatchMinutes) || 1)
      dmTimer = setInterval(() => { dmTick().catch((e) => log('私信定时器异常：' + String(e?.message ?? e))) }, mins * 60_000)
      if (dmTimer.unref) dmTimer.unref()
      log(`私信监听：${cfg.dmWatch ? '已开' : '关着'}（每 ${mins} 分钟查一次）`)
    } catch (e) { log('启私信监听失败：' + String(e?.message ?? e)) }
  }



  try { MIG_200() } catch (e) { log('迁移没跑：' + String(e?.message ?? e)) }

  try { startDmWatch() } catch (e) { log('私信监听没起来：' + String(e?.message ?? e)) }
  ctx.effect(() => () => { try { if (dmTimer) clearInterval(dmTimer) } catch { /* 忽略 */ } }, 'bili-duty: 私信监听')
```

</details>

**依据 7 · 源码核查**：[index.js:1578-1600](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L1578-L1600)

报告关闭及缺报告诊断的区分。

<details>
<summary>查看原文（23行）</summary>

```text
    const writeRoundNotesToReport = () => {
      try {
        const notes = [...startupNotes, ...roundNotes]
        if (!notes.length) return
        if (String(cfg.reportLevel || 'full') === 'off') return
        const f = join(outDir, `${dayKey()}.md`)
        const block = '## 投递\n\n' + notes.map((n) => '- ' + n).join('\n') + '\n'
        if (!existsSync(f)) { writeFileSync(f, `# 刷B站 · ${dayKey()}\n\n` + block + '\n', 'utf8'); return }
        let cur = readFileSync(f, 'utf8')
        writeFileSync(f, replaceSect(cur, '## 投递', block), 'utf8')
      } catch { /* 宁可没这段，也不能让这一轮挂掉 */ }
    }

  const stubReportIfMissing = (code) => {
    try {
      if (String(cfg.reportLevel || 'full') === 'off') return
      const f = join(outDir, `${dayKey()}.md`)
      if (existsSync(f)) return
      let tail = ''
      try { tail = readFileSync(logFile, 'utf8').slice(-6000) } catch { /* 读不到就算了 */ }
      // ⚠️ diagnoseRound 是纯函数、自己不会抛；这里再包一层是"绝不因为诊断把人搞挂"
      let why = null
      try { why = diagnoseRound(tail) } catch (e) { log(`诊断失败（已兜住）：${e?.message ?? e}`) }
```

</details>

#### 缺口

- 未测环境占用、人时、模型费用或撤销远端互动成本。
  **影响**：配置、账号和下载链都增加启动和退出负担，备选路径的边界与失败需单独复查。
  **进一步探讨**：计首次安装和配置分钟、候选数、每轮模型 token、ASR CPU 与磁盘、恢复及核账人时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 结构化动作收据能否减少误重试？

**研究主题**：新假设与验证

#### 完整回答

现有评论成功分支可能没有 rpid，宿主按最新一页或楼中楼第一页复核，未命中会保留未知。私信要求 msg_key，值班有回执后另写 BV 标记。拟加入按动作、账号、目标和轮次绑定的本地操作标识，发送前持久化，分开已受理、可见或送达、查询未命中、未知与明确拒绝。缺收据或回复超时不自动重发。

#### 证据与依据

**依据 1 · 源码核查**：[vendor/bilibili-mcp/mcp_server.py:708-720](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/vendor/bilibili-mcp/mcp_server.py#L708-L720)

评论尽力返回 rpid 等回执字段。

<details>
<summary>查看原文（13行）</summary>

```text
        # ⭐ 把回执里的 rpid 带回去：判重表要靠它记「我们发过哪条」，宿主的评论复核
        #    （lib/verify.mjs）也要拿它去 B站 查公开可见性。只回 success 的话那条链是断的。
        #（2026-10-16 审查修：原实现把上面的 result 丢掉了）
        out = {"success": True, "message": "评论发送成功"}
        _ledger_append(text, bvid, result.get("rpid") if isinstance(result, dict) else None)
        if isinstance(result, dict):
            for key in ("rpid", "rpid_str", "root", "parent"):
                val = result.get(key)
                if isinstance(val, (int, str)) and str(val).strip() and str(val) != "0":
                    out[key] = val
        return json.dumps(out, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"success": False, "error": str(e)}, ensure_ascii=False)
```

</details>

**依据 2 · 源码核查**：[lib/verify.mjs:73-112](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/lib/verify.mjs#L73-L112)

评论复核有限分页，未命中保留未知。

<details>
<summary>查看原文（40行）</summary>

```text
export async function verifyOne(record, { cred, aidCache = new Map(), headers }) {
  const out = { rpid: record.rpid, bv: record.bv, visible: null, how: '', note: '' }
  if (!aidCache.has(record.bv)) {
    const v = await jget(`https://api.bilibili.com/x/web-interface/view?bvid=${record.bv}`, headers)
    aidCache.set(record.bv, v?.code === 0 ? { aid: v.data.aid, mid: v.data.owner?.mid, title: v.data.title } : null)
    await sleep(300)
  }
  const meta = aidCache.get(record.bv)
  if (!meta) { out.how = '取视频信息失败'; out.note = '这条跳过（视频可能已删/不可见）'; return out }
  const aid = meta.aid

  // ① 顶层：按时间第一页（刚发的就在这儿）
  if (!record.root) {
    const d = await jget(`https://api.bilibili.com/x/v2/reply/main?type=1&oid=${aid}&mode=2&next=0&ps=20`, headers)
    const list = d?.data?.replies || []
    const hit = list.find((r) => r.rpid === record.rpid)
    if (hit && hit.rpid === record.rpid) {
      out.visible = true; out.likes = hit.like; out.how = '顶层·最新一页'
      out.note = hit.invisible ? '（但接口标了 invisible）' : ''
      return out
    }
    out.how = '顶层·最新一页'
    out.note = '最新一页里没找到 —— 可能还在审核，也可能只是翻页看不到（**不等于没发出去**）'
    return out
  }

  // ② 楼中楼：按 root 拉那一串
  const d = await jget(`https://api.bilibili.com/x/v2/reply/reply?type=1&oid=${aid}&root=${record.root}&ps=20&pn=1`, headers)
  const subs = d?.data?.replies || []
  const hit = subs.find((r) => r.rpid === record.rpid)
  if (hit) {
    out.visible = true; out.likes = hit.like; out.how = `楼中楼·root=${record.root}`
    out.note = hit.invisible ? '（但接口标了 invisible）' : ''
    return out
  }
  out.how = `楼中楼·root=${record.root}`
  out.note = subs.length
    ? `那一串里有 ${subs.length} 条，但没有我们这条 —— 可能还在审核（**不等于没发出去**）`
    : '那一串暂时拉不到内容 —— 可能还在审核（**不等于没发出去**）'
  return out
```

</details>

**依据 3 · 源码核查**：[vendor/bilibili-mcp/mcp_server.py:1192-1218](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/vendor/bilibili-mcp/mcp_server.py#L1192-L1218)

私信要求 msg_key，值班写回执标记。

<details>
<summary>查看原文（27行）</summary>

```text
        # ⭐ 2.0.4（issue #35）：**接口没抛异常 ≠ 真的送到了** ——
        #    以前只要不抛就报 success: True，而 B站 可能出现 code=0 却没给投递回执（msg_key）的情况 ✗
        #    回执就在返回值里：有 msg_key 才算发出去；code 非 0 直接算失败 ✓
        data = result if isinstance(result, dict) else {}
        code = data.get("code", 0)
        inner = data.get("data")
        msg_key = data.get("msg_key") or (inner.get("msg_key") if isinstance(inner, dict) else None)
        if code not in (0, None):
            return json.dumps({
                "success": False,
                "error": f"接口拒绝（code={code}）：{data.get('message') or data.get('msg') or '未知原因'}",
                "data": data,
            }, ensure_ascii=False)
        if not msg_key:
            return json.dumps({
                "success": False,
                "error": "接口回了成功，但**没有投递回执（msg_key）** ⇒ 可能没真正送到（常见于：对方不接受陌生人私信 / 被风控）",
                "data": data,
            }, ensure_ascii=False)
        # 仅值班轮：真实拿到 msg_key 后记录私信中的 BV 号，普通聊天不会标记。
        duty_day = os.environ.get("BILI_DUTY_RUN_DAY", "")
        if re.fullmatch(r"\d{4}-\d{2}-\d{2}", duty_day):
            bvids = sorted(set(re.findall(r"(?<![0-9A-Za-z])BV[0-9A-Za-z]{10}(?![0-9A-Za-z])", text)))
            if bvids:
                try:
                    with (Path(__file__).parent / "dm-deliveries.jsonl").open("a", encoding="utf-8") as f:
                        f.write(json.dumps({"day": duty_day, "bvids": bvids}, ensure_ascii=False) + "\n")
```

</details>

**依据 4 · 源码核查**：[index.js:2081-2086](https://github.com/c1overzz/dsh-bili-scroll/blob/29510a0100d39da437814ce315f8ca4e1c4c211d/index.js#L2081-L2086)

非零退出会在新会话重试。

```text
        // ② 带了 id 却失败（会话被删/迁移过）⇒ 丢掉它，下一条重开，别卡死在坏 id 上
        if (savedSid && code !== 0) {
          writeDmSession('')
          log('⚠️ 续会话失败（' + savedSid.slice(0, 16) + '…）⇒ 清掉 id，立刻用新会话重试一次（这条不能没回）')
          setTimeout(() => { try { runDmReply(fromUid, text) } catch { /* 兜住 */ } }, 800)
        }
```

#### 缺口

- 现有平台能否按标识查询、幂等以及标识保留期未知。
  **影响**：本地操作标识可减少误重试，但不足以保证远程恰好一次。
  **进一步探讨**：用模拟传输注入请求前失败、平台成功但回执丢失、审核延迟及双进程竞争，比较重复发送、漏送和人工对账。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
