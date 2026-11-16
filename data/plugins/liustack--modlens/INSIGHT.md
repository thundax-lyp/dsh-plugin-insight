# ModLens

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[e42fc49](https://github.com/liustack/modlens/tree/e42fc495c7366def4e3cb70040355d20c9c003c0)

<!-- BEGIN META -->
[![GitHub ★ 4,978](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C978&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/liustack/modlens) [![npm 30d 319,051](https://img.shields.io/static/v1?label=npm+30d&message=319%2C051&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modlens) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@liustack/modlens)
<!-- END META -->

> **功能**：给 DSH 文本模型接入视觉工具，将截图或图表转换成结构化证据。

> **亮点**：为 DSH 文本会话接入图像读取，输出摘要、布局/OCR 字段和不确定项，使图像证据可被文本模型引用；新增价值是结构化接线与字段呈现，而不是已证实的识别准确率、专业视觉能力或节省工时。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：输入图像可能被发送到配置的外部视觉服务，OCR/图像文本也可能携带提示注入；安全守卫和模拟 CLI 测试不能证明真实 provider 的数据保留、出站范围或抗注入能力。关键字段误读还会把不可靠视觉结果包装成结构化证据。[Q03](#research-q03)

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
  - [Q01 · 用户借助 ModLens 完成什么图像证据任务？](#detail-section-11)
  - [Q02 · DSH 工具怎样取得图片、调用视觉路线并生成结果？](#detail-section-12)
  - [Q03 · 图片隐私、注入、临时文件与测试边界如何？](#detail-section-13)
  - [Q04 · 怎样评估识别价值、成本和是否采用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：ModLens 将截图转为文本模型可消费的摘要、布局、OCR 和不确定项，适用于在 DSH 文本会话中引用图像证据的用户。相较手工转录，增量是同一对话内读取并给出结构结果；新测试明确这些输出字段，但不是模型准确率证据。

基线为手工完成相同任务或旧研究固定版本；没有同条件效果测量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 图像读取工具 | 本地图片和受支持 URL 的证据 | 工具可用，需确认提供商与数据范围 |
| 合成视觉模型 | 保留附件日志并发送证据文本 | 仅适用已注册的文本模型包装 |
| Web 粘贴与设置 | 贴图转临时文件、设置路线 | 须 Web 服务及客户端，按守卫启用 |
| CLI 固定路线 | 做单提供商对照 | 需要明确 -p 和实际端点 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=22.19 与相容宿主 | DSH 插件需要 | 运行工具和包装器 | 核对固定宿主版本 |
| 允许的视觉 API 或 CLI | 读取需要 | 分析图片 | 未配置则失败 |
| Web 服务及客户端 | 浏览器粘贴与设置需要 | 路径上传、设置与预览 | 用显式文件工具 |
| 独立目录、账号和出站控制 | 试用需要 | 避免混用数据和额度 | 停止外发 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 确定范围 | 操作者准备无敏感样本及批准路线 | 拦截其他候选 |
| 读取 | 用 DSH 工具和固定 CLI 处理同一图 | 核对实际端点和尝试 |
| 验收 | 对照原图、记录结构和不确定项 | 出现误路由或附件越界就停止 |
| 退出 | 停用入口并清点临时图、证据及日志 | 必要时手工转写 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主、运行时与视觉端点 | 配置和验证出站 | 兼容与工时未测 |
| 持续 | 可能消耗供应商及借用账号额度 | 核对结构和 OCR | 延迟、账单及保留未知 |
| 失败恢复 | 回退、重读或超时可能产生额外调用 | 检查失败及已外发情况 | 工具取消不能证明没有调用 |
| 退出 | 保留必要取证副本 | 停用并检查缓存、临时图和远端记录 | 删除会话不清理独立证据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 截图证据 | 转录、结构和不确定项 | 真实准确率 |
| 接入文本会话 | 本地路径工具和可选附件包装 | 宿主版本体验和会话隔离 |
| 路线与失败 | CLI 可列实际提供商及尝试 | 真实网络路径、配额和保存政策 |

> **思考**：输入图像可能被发送到配置的外部视觉服务，OCR/图像文本也可能携带提示注入；安全守卫和模拟 CLI 测试不能证明真实 provider 的数据保留、出站范围或抗注入能力。关键字段误读还会把不可靠视觉结果包装成结构化证据。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：为 DSH 文本会话接入图像读取，输出摘要、布局/OCR 字段和不确定项，使图像证据可被文本模型引用；新增价值是结构化接线与字段呈现，而不是已证实的识别准确率、专业视觉能力或节省工时。[Q01](#research-q01) [Q02](#research-q02)

[Q02](#research-q02) 宿主到 CLI 再到视觉提供商，结构失败会拒绝或回退，插件只取 result。[Q03](#research-q03) 路线不同，抓图、临时路径、缓存和取消边界也不同。

<a id="detail-section-5"></a>

### 1.4 主要限制

输入图像可能被发送到配置的外部视觉服务，OCR/图像文本也可能携带提示注入；安全守卫和模拟 CLI 测试不能证明真实 provider 的数据保留、出站范围或抗注入能力。关键字段误读还会把不可靠视觉结果包装成结构化证据。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

只建议在端点、数据保留和费用已确认后，以虚构/非敏感图片、单一路线和费用上限做小规模试用；逐项复核 OCR 与不确定项。若端点身份不明、图像越界外发或关键字段误读，就停止并退回人工转录。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交源码支持接线与关键机制；真实宿主、外部服务、用户效果及实际成本均未在本轮验证。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、dsh/index.js、src/dshPlugin.test.ts、package.json、src/analyzer.ts、docs/security.md、src/guard/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取本轮固定组件源码、既有目录统计及上一版本研究；未安装或运行插件，未执行宿主、浏览器、外部服务或真实用户验证。
- 下一步：在目标宿主隔离环境按 [Q04](#research-q04) 逐项执行小规模任务，记录失败、质量、人工时间与资源成本；任一停止条件触发则回滚。

**分析版本**

- **仓库**：[liustack/modlens](https://github.com/liustack/modlens)
- **版本号**：3.27.5（[固定提交 e42fc49](https://github.com/liustack/modlens/tree/e42fc495c7366def4e3cb70040355d20c9c003c0)）
- **版本日期**：2026-11-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：对常见截图/图表任务，摘要、OCR 与不确定项输出可降低人工转录时间，同时保持关键字段可核对。用固定虚构图像集和批准的单一 provider，对比人工转录与 ModLens，记录字段准确率、漏读、复核时间、延迟和费用；任何关键字段误读率或总成本不优于人工即推翻。[Q04](#research-q04)

在目标宿主隔离环境按 [Q04](#research-q04) 逐项执行小规模任务，记录失败、质量、人工时间与资源成本；任一停止条件触发则回滚。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 31 | 4072 | — | — | 64487 |
| .js | source | 4 | 3982 | 2689 | 1155 | — |
| .mjs | source | 5 | 837 | 627 | 155 | — |
| .mjs | test | 1 | 142 | 107 | 26 | — |
| .ts | test | 43 | 20835 | 17737 | 1775 | — |
| .ts | source | 42 | 9760 | 7254 | 1938 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/liustack/modlens/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/liustack/modlens/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/liustack/modlens/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)



统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定提交的图像证据工具能否在明确的出站与核验边界内减少人工转录？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户借助 ModLens 完成什么图像证据任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

ModLens 把截图转成摘要、按阅读顺序的布局、OCR 全文和不确定项。固定版本从布局区域提取类别与开头文字，约 1500 字符封顶，OCR 全文单独保留。相比手工抄录，增量是文本模型可收到可对照的结构化证据；区域文字可能是说明，需回看原图确认，字段完整无法证明准确率。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:34-50](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/README.zh-CN.md#L34-L50)

作者材料描述图像任务与使用入口。

<details>
<summary>查看原文（17行）</summary>

```text
## 亮点

**🥇 全网最强的 DeepSeek Harness（dsh）外挂视觉识别插件：**一条命令即刻安装 `npx -y @deepseek-ai/dsh plugin --profile web add @liustack/modlens@3.27.5`。更多安装与更新细节参考 [配置手册](docs/harness-setup.zh-CN.md) 。如果用不惯命令行，也想想玩玩 DSH，推荐食用全网最轻量级的 DeepSeek Harness 桌面版封装 <a href="https://github.com/liustack/aimanager"><b> AIManager</b></a>，零代码零配置起手，一键帮你安装所有依赖环境。

DeepSeek Harness 粘贴识图有两种玩法。

**① 直接粘贴** 贴进来的图片自主转换成文件路径进输入框（与 OpenCode、Pi 同款交互），`modlens_read_image` 工具接手读图。

**② 切到带 `(modlens vision)` 后缀的模型变体**（选择器有记忆，选一次就行）再粘贴：缩略图直接可见、所见即所得，体验更接近 Codex App。变体由插件自动发现生成：每条承载纯文本 DeepSeek 或 GLM 模型的 provider 路由各得一组包装条目（默认安装下就是 **`DeepSeek-V4-Flash (modlens vision)`** 和 **`DeepSeek-V4-Pro (modlens vision)`**，装了 opencode-go、zai 等额外路由的机器会各自多出一组），两家自己的视觉型号（含 GLM-5.3-Flash）自动排除。走哪条通路由 host 依据真实模型元数据逐个裁决：只有被元数据确认纯文本的模型才会被接管，确认不了的一律不动，视觉模型因此保留原生贴图（[细节](docs/harness-setup.zh-CN.md)）。

**所有 Harness 直接粘贴图片识别** 无需先保存成文件再提供路径。

需要快捷键把屏幕截进 DeepSeek Harness 时，用独立插件 [dsh-screenshot](https://github.com/paicat1/dsh-screenshot)。

- **全网最轻量。** 不用 hook，不套壳，不跑本地代理进程，不改任何 harness 配置的一行字：在 skill 类 harness 里它就是一个 skill 文件夹，在 dsh 里就是一个插件。卸载等于删个文件夹，你的 agent 立刻回到原样。
- **零配置起手。** 复用 Claude Code、Codex、OpenCode、Pi 已有配置，直接复用你本机的其他多模态模型。如果你本机什么都没安装？Antigravity CLI 是免 key 的免费通道，配一个免费 Gemini key 可将识别耗时降至 5 到 10 秒。也支持所有主流的 OpenAI 兼容格式 API key。
- **多个密钥用英文逗号分隔，鉴权、限流或配额失败时自动轮换。** 其他失败会跳过剩余密钥，并继续走现有的 provider 故障转移。
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:380-395](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/dsh/index.js#L380-L395)

入口注册图像读取工具。

<details>
<summary>查看原文（16行）</summary>

```text
  // `tools.get(name, agent)` per scope, then mutating a global catalog per
  // agent. Not entering the collision is cheaper: no host tool is known to
  // use this name, and the model finds ours through its schema, which reaches
  // it on every request regardless of what the tool is called. `toolName`
  // still pins whatever a host prefers.
  const preferred = config.toolName || 'modlens_read_image'
  try {
    ctx.tools.register(readImageTool(preferred))
  } catch (error) {
    // Same-layer duplicate of the chosen name, or a preview-era surface
    // change: degrade loudly instead of taking the whole plugin down.
    console.error(`[modlens] ${preferred} registration skipped: ${error}`)
  }
}

// Image magic bytes for the paste route: refuse anything that is not a real
```

</details>

**依据 3 · 源码核查**：[src/dshPlugin.test.ts:5960-6000](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/src/dshPlugin.test.ts#L5960-L6000)

模拟输出断言结果及工具展示接口。

<details>
<summary>查看原文（41行）</summary>

```text
        plugin.apply(
            {
                tools: { register: (next: typeof tool) => (tool = next) },
                attachments: {},
                on: () => {},
            } as never,
            { visionProvider: false },
        );
        if (!tool) throw new Error('tool was not registered');
        return {
            text: tool.output
                .render({ path: '/x.png' }, value)
                .map((block) => block.text)
                .join('\n'),
            description: tool.description,
        };
    }

    const base = {
        summary: 'A pricing table',
        ocr: { full_text: 'Plans Free Pro 0 20', lines: [] },
        semantics: { scene: 'web page', entities: [] },
        visual: { dominant_colors: [], style: '', notes: [] },
        uncertainty: [],
    };

    it('outlines regions in reading order with their kind, ahead of the transcription', async () => {
        const { text } = await renderOf({
            ...base,
            layout: {
                regions: [
                    { type: 'table', reading_order: 2, text: 'Free | 0\nPro | 20' },
                    { type: 'heading', reading_order: 1, text: 'Plans' },
                ],
            },
        });
        expect(text).toContain('[heading] Plans');
        // One region, one line: a newline inside it would read as two.
        expect(text).toContain('[table] Free | 0 Pro | 20');
        expect(text.indexOf('[heading]')).toBeLessThan(text.indexOf('[table]'));
        expect(text.indexOf('[table]')).toBeLessThan(text.indexOf('Plans Free Pro 0 20'));
```

</details>

**依据 4 · 源码核查**：[dsh/index.js:1951-1997](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/dsh/index.js#L1951-L1997)

区域摘要与全文各自渲染。

<details>
<summary>查看原文（47行）</summary>

```text
const OUTLINE_MAX_CHARS = 1500

/** Whitespace folded to single spaces and the result clipped. */
function oneLine(text, max) {
  const flat = text.replace(/\s+/g, ' ').trim()
  return flat.length > max ? `${flat.slice(0, max)}…` : flat
}

/**
 * The text dsh puts on the wire. A text-only model gets no structure from
 * the transcription alone, so a short outline of the layout regions (kind and
 * opening words, in reading order) goes ahead of it (#130). The outline does
 * not replace the transcription: region text is not promised verbatim, and
 * an engine may describe a table where the transcription has its numbers.
 */
function renderEvidence(value) {
  const lines = [value.summary]
  const regions = [...(value.layout?.regions ?? [])]
    .filter((region) => region.text.trim())
    .sort((a, b) => a.reading_order - b.reading_order)
  if (regions.length > 0) {
    const outline = []
    let used = 0
    for (const region of regions) {
      const line = `[${oneLine(region.type, 24)}] ${oneLine(region.text, OUTLINE_LINE_CHARS)}`
      if (used + line.length > OUTLINE_MAX_CHARS) {
        outline.push('…')
        break
      }
      outline.push(line)
      used += line.length + 1
    }
    lines.push('', 'Layout (reading order):', ...outline)
  }
  const text = value.ocr?.full_text?.trim()
  if (text) {
    lines.push('', 'Transcription:', text.length > 4000 ? `${text.slice(0, 4000)}…` : text)
  }
  const uncertainty = value.uncertainty ?? []
  if (uncertainty.length > 0) {
    lines.push('', `Uncertain: ${uncertainty.join('; ')}`)
  }
  return lines.join('\n')
}

// The engines a user can pick in the settings card, in the order the docs
// introduce them. Kept to the names modlens itself uses so the card and
```

</details>

#### 缺口

- 无真实图片集盲评，无法判断错漏和节省时间。
  **影响**：用固定脱敏图片比较人工与单一 provider，并记录错读类型和复核时间。
  **进一步探讨**：用固定脱敏图片比较人工与单一 provider，并记录错读类型和复核时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 工具怎样取得图片、调用视觉路线并生成结果？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

已登记的 sha256 附件 ID 从附件服务取引用与字节，未知 ID 直接拒绝搜索本地目录。普通路径或 URL 则调当前 Node 运行 CLI，传路径、超时与可选焦点。多个调用者共享读取时，取消只终止当次等待，CLI 仍有自己的期限。附件字节写入权限 0600 的临时文件，finally 尝试删除临时目录，清理错误被吞掉。

分析器对 API provider 调 execute，对子进程型构造调用并解析 stdout。启用 isolateWorkdir 且未指定 workdir 时，本地图用独立副本、远程图用空目录，执行后 finally 清理。目录隔离不限制子进程的系统权限。规范化结果后按 schema 拒绝缺字段或类型错误，后续候选可接续。DSH 外层另检查退出码与 JSON。模型分组询问已解析能力，并剔除原生视觉模型和解析失败项。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:72-85](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/package.json#L72-L85)

声明 bundle 和 DSH 客户端组合。

<details>
<summary>查看原文（14行）</summary>

```text
        "./dsh": "./dsh/index.js",
        "./package.json": "./package.json",
        "./client": "./dsh/client.js"
    },
    "dsh": {
        "bundle": {
            "patch": "./cordis.patch.yml"
        },
        "client": {
            "inject": [],
            "platform": "web",
            "immediately": true
        }
    }
```

</details>

**依据 2 · 源码核查**：[dsh/index.js:180-210](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/dsh/index.js#L180-L210)

入口检查配置和服务能力。

<details>
<summary>查看原文（31行）</summary>

```text
export function apply(ctx, config = {}) {
  // One evidence cache for the whole plugin: every wrapper route and the
  // auto-read path share it, so the same pasted attachment is read once,
  // whichever surface asks first (issue #68; auto-read used to bypass
  // caching entirely and re-read every image on every step).
  const evidenceCache = new Map()
  // Explicit path-tool calls can repeat inside a small model's thinking loop.
  // Keep their completed evidence beside the attachment cache so the model's
  // repeated decision does not become repeated vision-provider work (#81).
  const toolReadCache = new Map()
  // The attachments behind the evidence this plugin wrote, by id, so the
  // tool can re-read a pasted image with a new focus (#121).
  const attachmentRefs = new Map()
  // Off by default since the vision provider converts at request time and
  // keeps the durable log (and the UI thumbnail) intact; turn it on only for
  // setups where images enter through a provider this plugin does not wrap.
  if (config.autoRead === true) {
    registerAutoRead(ctx, evidenceCache, attachmentRefs)
  }
  // The provider ids this plugin registered itself. The takeover verdict has
  // to skip them: our wrapper models are synthetic twins of upstream ones,
  // carrying the upstream id and declaring image input, so a plain text-only
  // label matches the twin and the twin's declaration vetoes the takeover
  // that label deserved (issue #36). Filled by registerVisionProvider as
  // wrappers land, including the later sweeps, and read by the verdict.
  const ownProviders = new Set()
  if (config.visionProvider !== false) {
    // Bundle loaders can call apply while this outer context is still waiting
    // for its required services. Reading ctx.llm here then throws "inactive
    // context" before the first discovery sweep can register any lifecycle
    // work (#79). Put the whole provider registry inside an injected child
```

</details>

**依据 3 · 源码核查**：[dsh/index.js:332-395](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/dsh/index.js#L332-L395)

输入路径校验、图片处理与工具注册。

<details>
<summary>查看原文（64行）</summary>

```text
    async execute(args, exec) {
      if (typeof args?.path !== 'string' || args.path.trim() === '') {
        throw new Error(`${toolName} needs a non-empty string "path".`)
      }
      const focus = typeof args.prompt === 'string' ? args.prompt : ''
      const source = args.path.trim()
      if (ATTACHMENT_ID_PREFIX.test(source)) {
        // A pasted image named by the id in its evidence (#121). Checked
        // before the cache, so an id that becomes known later is not stuck
        // behind a cached refusal.
        const ref = lookupAttachmentRef(attachmentRefs, source)
        if (ref === undefined) {
          // The path is model text and goes back on the wire: only a strict
          // id is echoed, anything else gets the fixed sentence alone.
          const named = ATTACHMENT_ID.test(source) ? ` ${source}` : ''
          throw new Error(
            `${toolName}: the attachment-id${named} is not an image read in this session. Do not search the filesystem for it, ask the user to attach the image again or give its file path.`,
          )
        }
        // The id is the sha256 of the stored bytes, so it is the identity.
        const cacheKey = JSON.stringify([`attachment:${source}`, focus])
        const pending = cachedToolRead(toolReadCache, cacheKey, false, async () => {
          const stored = await readStoredImage(ctx.attachments, ref, undefined)
          return readImageBytes(stored.data, storedImageExt(stored, ref), focus, undefined)
        })
        return structuredClone(await abortableWait(pending, exec.signal))
      }
      const sourceKey = toolReadSourceKey(args.path)
      const cacheKey = JSON.stringify([sourceKey, focus])
      const pending = cachedToolRead(toolReadCache, cacheKey, sourceKey.startsWith('remote:'), async () => {
        const cliArgs = [CLI_PATH, '-i', args.path, '--timeout', String(CLI_TIMEOUT_MS)]
        if (args.prompt) {
          cliArgs.push('--prompt', args.prompt)
        }
        // The shared read has the CLI's own deadline but not one caller's
        // signal. A caller may stop waiting without cancelling every other
        // concurrent caller that joined the same image read.
        return parseCliResult(await run(process.execPath, cliArgs, undefined))
      })
      return structuredClone(await abortableWait(pending, exec.signal))
    },
  })
  // A name of our own rather than the host's. dsh's registry is layered and
  // a scoped tool shadows a global one, so a host `read_image` mounted in the
  // agent-preset scope and ours registered globally are not a duplicate at
  // all: the registration succeeds, nothing throws, and the model still
  // resolves the host's (issue #34). Detecting that from here would mean
  // walking every agent (`agents.list()` plus `agent/created`) and asking
  // `tools.get(name, agent)` per scope, then mutating a global catalog per
  // agent. Not entering the collision is cheaper: no host tool is known to
  // use this name, and the model finds ours through its schema, which reaches
  // it on every request regardless of what the tool is called. `toolName`
  // still pins whatever a host prefers.
  const preferred = config.toolName || 'modlens_read_image'
  try {
    ctx.tools.register(readImageTool(preferred))
  } catch (error) {
    // Same-layer duplicate of the chosen name, or a preview-era surface
    // change: degrade loudly instead of taking the whole plugin down.
    console.error(`[modlens] ${preferred} registration skipped: ${error}`)
  }
}

// Image magic bytes for the paste route: refuse anything that is not a real
```

</details>

**依据 4 · 源码核查**：[src/analyzer.ts:560-633](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/src/analyzer.ts#L560-L633)

解析结果并核验结构字段。

<details>
<summary>查看原文（74行）</summary>

```text
                ...providerOptions,
                imageSource: isolation?.imageSource ?? providerOptions.imageSource,
                workdir: isolation?.workdir ?? providerOptions.workdir,
            });
            // The grace exists for engines with their own internal deadline (agy
            // gets --print-timeout). Engines without one must honour the caller's
            // number as given.
            const backstop = provider.hasInternalTimeout ? timeoutMs + KILL_GRACE_MS : timeoutMs;
            const commandResult = await runCommand(
                provider.name,
                invocation,
                backstop,
                provider.describeFailure,
            );
            parsed = parseOutput(commandResult.stdout);
        } finally {
            // Output goes over stdout, so nothing here needs to outlive the run.
            await isolation?.cleanup();
        }
    } else {
        throw new Error(
            `Provider ${provider.name} implements neither execute nor buildInvocation.`,
        );
    }

    // Server-side schema enforcement is uneven across providers, and even the
    // routes that have it can return a shell that only looks right. Verify the
    // shape here so a structurally broken result fails loudly for every
    // provider, and a failover peer gets its turn at a compliant answer.
    // A model with nothing to say for an optional field writes null there,
    // which means the same as leaving it out; dropping it before the check
    // keeps the read alive and keeps null out of what callers receive.
    parsed.result = normalizeVisionResult(parsed.result);
    const missing = missingSchemaFields(parsed.result);
    if (missing.length > 0) {
        throw new Error(
            `${provider.name} returned a result that does not match the vision schema (wrong or missing: ${missing.join(', ')}).`,
        );
    }

    return parsed;
}

export function resolveInput(input: string): ResolvedInput {
    const trimmed = input.trim();
    if (!trimmed) {
        throw new Error('Input path is required.');
    }

    if (isRemoteSource(trimmed)) {
        return { source: trimmed, kind: 'remote' };
    }

    if (/^file:\/\//i.test(trimmed)) {
        return { source: path.resolve(fileURLToPath(trimmed)), kind: 'local' };
    }

    return { source: path.resolve(trimmed), kind: 'local' };
}

function isRemoteSource(value: string): boolean {
    return /^https?:\/\//i.test(value.trim());
}

function validateInputFile(filePath: string): void {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Input image not found: ${filePath}`);
    }

    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
        throw new Error(`Input is not a file: ${filePath}`);
    }
}
```

</details>

**依据 5 · 源码核查**：[dsh/index.js:332-372](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/dsh/index.js#L332-L372)

附件与普通路径和共享等待分流。

<details>
<summary>查看原文（41行）</summary>

```text
    async execute(args, exec) {
      if (typeof args?.path !== 'string' || args.path.trim() === '') {
        throw new Error(`${toolName} needs a non-empty string "path".`)
      }
      const focus = typeof args.prompt === 'string' ? args.prompt : ''
      const source = args.path.trim()
      if (ATTACHMENT_ID_PREFIX.test(source)) {
        // A pasted image named by the id in its evidence (#121). Checked
        // before the cache, so an id that becomes known later is not stuck
        // behind a cached refusal.
        const ref = lookupAttachmentRef(attachmentRefs, source)
        if (ref === undefined) {
          // The path is model text and goes back on the wire: only a strict
          // id is echoed, anything else gets the fixed sentence alone.
          const named = ATTACHMENT_ID.test(source) ? ` ${source}` : ''
          throw new Error(
            `${toolName}: the attachment-id${named} is not an image read in this session. Do not search the filesystem for it, ask the user to attach the image again or give its file path.`,
          )
        }
        // The id is the sha256 of the stored bytes, so it is the identity.
        const cacheKey = JSON.stringify([`attachment:${source}`, focus])
        const pending = cachedToolRead(toolReadCache, cacheKey, false, async () => {
          const stored = await readStoredImage(ctx.attachments, ref, undefined)
          return readImageBytes(stored.data, storedImageExt(stored, ref), focus, undefined)
        })
        return structuredClone(await abortableWait(pending, exec.signal))
      }
      const sourceKey = toolReadSourceKey(args.path)
      const cacheKey = JSON.stringify([sourceKey, focus])
      const pending = cachedToolRead(toolReadCache, cacheKey, sourceKey.startsWith('remote:'), async () => {
        const cliArgs = [CLI_PATH, '-i', args.path, '--timeout', String(CLI_TIMEOUT_MS)]
        if (args.prompt) {
          cliArgs.push('--prompt', args.prompt)
        }
        // The shared read has the CLI's own deadline but not one caller's
        // signal. A caller may stop waiting without cancelling every other
        // concurrent caller that joined the same image read.
        return parseCliResult(await run(process.execPath, cliArgs, undefined))
      })
      return structuredClone(await abortableWait(pending, exec.signal))
    },
```

</details>

**依据 6 · 源码核查**：[dsh/index.js:115-128](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/dsh/index.js#L115-L128)

退出码和 JSON 检查。

<details>
<summary>查看原文（14行）</summary>

```text
function parseCliResult({ stdout, stderr, code }) {
  if (code !== 0) {
    throw new Error(`modlens failed (exit ${code}): ${(stderr || stdout).trim().slice(0, 500)}`)
  }
  let parsed
  try {
    parsed = JSON.parse(stdout)
  } catch {
    throw new Error(`modlens produced no JSON: ${stdout.trim().slice(0, 300)}`)
  }
  // The canonical value is the vision result itself; routing details
  // (meta.attempts, whose quota a reused engine spent) stay operational.
  return parsed.result
}
```

</details>

**依据 7 · 源码核查**：[dsh/index.js:1904-1918](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/dsh/index.js#L1904-L1918)

临时目录和尽力清理。

<details>
<summary>查看原文（15行）</summary>

```text
async function readImageBytes(data, ext, prompt, signal) {
  const { mkdtemp, rm, writeFile } = await import('node:fs/promises')
  const dir = await mkdtemp(join(tmpdir(), 'modlens-dsh-'))
  try {
    const file = join(dir, `paste${ext}`)
    await writeFile(file, Buffer.from(data), { mode: 0o600 })
    const cli = process.env.MODLENS_DSH_CLI || CLI_PATH
    const cliArgs = [cli, '-i', file, '--timeout', String(CLI_TIMEOUT_MS)]
    if (prompt) {
      cliArgs.push('--prompt', prompt)
    }
    return parseCliResult(await run(process.execPath, cliArgs, signal))
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {})
  }
```

</details>

**依据 8 · 源码核查**：[src/analyzer.ts:542-600](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/src/analyzer.ts#L542-L600)

provider 分流、目录隔离及 schema。

<details>
<summary>查看原文（59行）</summary>

```text
    if (provider.execute) {
        parsed = await provider.execute(providerOptions);
    } else if (provider.buildInvocation && provider.parseOutput) {
        const buildInvocation = provider.buildInvocation;
        const parseOutput = provider.parseOutput;
        // Run the agent in a throwaway directory holding only this one image, so
        // an injection in the image cannot steer it into siblings of the
        // original file. A remote image has no local file to copy, but the agent
        // still must not run in the caller's directory, so it gets an empty
        // throwaway cwd instead. An explicit --workdir opts out.
        const isolation =
            !options.workdir && provider.isolateWorkdir
                ? resolvedInput.kind === 'local'
                    ? await isolateImage(resolvedInput.source)
                    : emptyWorkdir()
                : null;
        try {
            const invocation = buildInvocation({
                ...providerOptions,
                imageSource: isolation?.imageSource ?? providerOptions.imageSource,
                workdir: isolation?.workdir ?? providerOptions.workdir,
            });
            // The grace exists for engines with their own internal deadline (agy
            // gets --print-timeout). Engines without one must honour the caller's
            // number as given.
            const backstop = provider.hasInternalTimeout ? timeoutMs + KILL_GRACE_MS : timeoutMs;
            const commandResult = await runCommand(
                provider.name,
                invocation,
                backstop,
                provider.describeFailure,
            );
            parsed = parseOutput(commandResult.stdout);
        } finally {
            // Output goes over stdout, so nothing here needs to outlive the run.
            await isolation?.cleanup();
        }
    } else {
        throw new Error(
            `Provider ${provider.name} implements neither execute nor buildInvocation.`,
        );
    }

    // Server-side schema enforcement is uneven across providers, and even the
    // routes that have it can return a shell that only looks right. Verify the
    // shape here so a structurally broken result fails loudly for every
    // provider, and a failover peer gets its turn at a compliant answer.
    // A model with nothing to say for an optional field writes null there,
    // which means the same as leaving it out; dropping it before the check
    // keeps the read alive and keeps null out of what callers receive.
    parsed.result = normalizeVisionResult(parsed.result);
    const missing = missingSchemaFields(parsed.result);
    if (missing.length > 0) {
        throw new Error(
            `${provider.name} returned a result that does not match the vision schema (wrong or missing: ${missing.join(', ')}).`,
        );
    }

    return parsed;
```

</details>

**依据 9 · 源码核查**：[dsh/index.js:879-913](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/dsh/index.js#L879-L913)

模型分组和解析能力。

<details>
<summary>查看原文（35行）</summary>

```text
          // model listed here and then refused by resolveModel fails the whole
          // group (#129). The listing snapshot can lag the resolved one (an
          // upstream catalog that gained image input after the local entry
          // was written), so the listing asks the same question of the same
          // data the resolver will. A model the upstream cannot resolve is
          // left out too, rather than failing the listing: hosts that only
          // list (the ACP bridge, the subagent picker) would lose the group.
          const listed = models.filter(shouldWrap)
          const resolved = await Promise.allSettled(
            listed.map((model) => llm.resolveModelInfo(upstream, model.id, signal)),
          )
          return listed
            .filter((model, index) => {
              const outcome = resolved[index]
              if (outcome.status === 'fulfilled') return shouldWrap(outcome.value)
              console.error(
                `[modlens] left ${model.id} out of the vision listing: ${outcome.reason?.message ?? outcome.reason}`,
              )
              return false
            })
            .map((model) => ({
              ...withVision(model),
              name: `${model.name ?? model.id} (modlens vision)`,
            }))
        },
        async resolveModel(_provider, model, signal) {
          const info = await llm.resolveModelInfo(upstream, model, signal)
          if (!shouldWrap(info)) {
            // Refusing is right: wrapping a model that reads images itself
            // would claim a bridge it does not need, hand it text evidence
            // instead of the picture, and lose whatever its own vision does
            // better. What was wrong is that the refusal explained nothing.
            // A session that already picked this entry fails every turn, and
            // the catalogue is advisory so nothing clears the stale choice,
            // leaving the user to read internal vocabulary and guess.
```

</details>

#### 缺口

- 未验证目标宿主兼容、外部 provider 和取消/超时是否仍触发远端处理。
  **影响**：在隔离宿主固定 provider，测试本地/URL 图片、超时、拒绝和工具 schema。
  **进一步探讨**：在隔离宿主固定 provider，测试本地/URL 图片、超时、拒绝和工具 schema。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 图片隐私、注入、临时文件与测试边界如何？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

应先核对实际出站 provider 和保留策略。doctor 只检查设置，工具说明提示真实读图才能看到 provider 失败。隔离试用可用虚构截图和单一批准 provider，避免重新提交旧敏感图。临时目录和 guard 存在不能证明外部 provider 隐私隔离，OCR 文字也可能把注入内容带进上下文。仓库测试模拟 CLI 路径与结果字段，本轮未运行同版本真实 provider。

#### 证据与依据

**依据 1 · 源码核查**：[docs/security.md:1-28](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/docs/security.md#L1-L28)

安全说明覆盖凭证和数据处理限制。

<details>
<summary>查看原文（28行）</summary>

```text
---
summary: 'Security: what modlens runs, how recovered images are protected, image content as untrusted input'
read_when:
  - Reviewing what this tool does on your machine
  - Recovering pastes on a shared machine
  - Deciding how much to trust what a vision engine reports
---

# Security

English | [中文](security.zh-CN.md)

## Recovered images are private

Images pulled out of session storage are written 0600 into a 0700 directory. By default that directory is a fresh, unpredictable `<tmpdir>/modlens-paste-*` minted per run, so nobody on a shared machine can pre-create a known path (`recursive` mkdir leaves an existing directory's mode alone) and read the bytes. A pasted screenshot can hold anything. An explicit `--out-dir` is honoured but refused when unsafe: it must be a real directory, not a symlink, owned by you, with no group or world access.

Recovery is also scoped to one project: the working directory recorded inside the transcript is checked, not just the directory name, because directory slugs collide (`/tmp/a.b` and `/tmp/a-b` produce the same one). A neighbouring project's images are never handed over.

## The dsh plugin keeps what it read

In DeepSeek Harness, the plugin keeps the evidence text it produced for each pasted image in `~/.modlens/dsh-evidence/`, so a restarted or resumed session does not send its whole image history back through the engine. Each entry is the full transcription of one image, so the directory is 0700 and every file 0600. Only images whose attachment id is the sha256 of their bytes are kept, which means an entry can never answer for a different picture.

Entries are tied to the engine in `~/.modlens/config.json` (provider, model, endpoint), so switching engines reads the images again. Deleting a dsh session does not delete its entries: they are removed after 30 days unread, and past 64 MB the least recently read go first. Deleting the directory is always safe: the next read of each image runs the engine again.

## Permissions passed to engines

ModLens invokes `agy` with `--dangerously-skip-permissions` because prompt mode fails in some environments without it. The prompt restricts the agent to reading the one image it was given, and instructs it to treat image content strictly as data.

```

</details>

**依据 2 · 源码核查**：[src/dshPlugin.test.ts:61-105](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/src/dshPlugin.test.ts#L61-L105)

测试建立的是模拟 CLI 输出行为。

<details>
<summary>查看原文（45行）</summary>

```text
describe('dsh plugin bundle', () => {
    it('ships a vision schema identical to the source of truth', () => {
        // dsh/index.js cannot import the TS source, so it carries a JSON copy;
        // this is the lockstep check that keeps the copy honest.
        const shipped = JSON.parse(
            fs.readFileSync(path.join(__dirname, '..', 'dsh', 'vision-schema.json'), 'utf-8'),
        );
        expect(shipped).toEqual(VISION_RESULT_SCHEMA);
    });

    it('wires the bundle manifest to the patch and the patch to the subpath', () => {
        const pkg = JSON.parse(
            fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'),
        ) as {
            dsh?: { bundle?: { patch?: string } };
            exports?: Record<string, string>;
            files?: string[];
        };
        expect(pkg.dsh?.bundle?.patch).toBe('./cordis.patch.yml');
        expect(pkg.exports?.['.']).toBe('./dsh/index.js');
        expect(pkg.exports?.['./dsh']).toBe('./dsh/index.js');
        expect(pkg.files).toContain('dsh');
        expect(pkg.files).toContain('cordis.patch.yml');
        const patch = fs.readFileSync(path.join(__dirname, '..', 'cordis.patch.yml'), 'utf-8');
        expect(patch).toContain("name: '@liustack/modlens'");
    });
});

describe('dsh plugin auto-read (phase 2)', () => {
    type Handler = (
        payload: { messages: unknown[]; signal?: AbortSignal },
        next: () => Promise<unknown>,
    ) => Promise<{
        kind: string;
        messages?: Array<{ content: Array<{ type: string; text?: string }> }>;
    }>;

    async function load(autoRead: boolean | undefined = true) {
        // The plugin is plain JS by design (no build step, no dsh type deps).
        // @ts-expect-error untyped on purpose
        const plugin = (await import('../dsh/index.js')) as {
            apply: (ctx: unknown, config?: { autoRead?: boolean }) => void;
        };
        const handlers: Record<string, Handler> = {};
        const ctx = {
```

</details>

**依据 3 · 源码核查**：[src/analyzer.ts:603-633](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/src/analyzer.ts#L603-L633)

输出结构校验及拒绝分支。

<details>
<summary>查看原文（31行）</summary>

```text
export function resolveInput(input: string): ResolvedInput {
    const trimmed = input.trim();
    if (!trimmed) {
        throw new Error('Input path is required.');
    }

    if (isRemoteSource(trimmed)) {
        return { source: trimmed, kind: 'remote' };
    }

    if (/^file:\/\//i.test(trimmed)) {
        return { source: path.resolve(fileURLToPath(trimmed)), kind: 'local' };
    }

    return { source: path.resolve(trimmed), kind: 'local' };
}

function isRemoteSource(value: string): boolean {
    return /^https?:\/\//i.test(value.trim());
}

function validateInputFile(filePath: string): void {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Input image not found: ${filePath}`);
    }

    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
        throw new Error(`Input is not a file: ${filePath}`);
    }
}
```

</details>

**依据 4 · 源码核查**：[src/guard/index.ts:1-50](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/src/guard/index.ts#L1-L50)

图像/文本安全 guard 入口。

<details>
<summary>查看原文（50行）</summary>

```text
// The invocation guard (issue #15): keep the vision engine from firing when
// the active model already has native vision. Three signals feed the verdict,
// strongest first: the MODLENS_MODEL env var (the user said so), session
// storage (the transcript said so), then the caller's --model self-report
// (the model said so, and a model can misname itself).
import { detectHarnessDetailed } from '../recoverPaste/detect.ts';
import { type SniffRoots, sniffModel } from './modelSniff.ts';
import {
    allowPatterns,
    denyPatterns,
    evaluateGuard,
    type GuardsConfig,
    type GuardVerdict,
    type ModelDetection,
} from './rules.ts';

export type { GuardsConfig, GuardVerdict, ModelDetection } from './rules.ts';
export { evaluateGuard } from './rules.ts';

export interface DetectModelOptions {
    cwd: string;
    env?: NodeJS.ProcessEnv;
    /** The calling agent's own claim of what model it is (weakest signal). */
    selfReported?: string;
    /** A harness the caller already detected, so detection is not repeated. */
    harness?: string | null;
    /** Storage locations, injectable for tests. */
    roots?: SniffRoots;
}

export function detectActiveModel(options: DetectModelOptions): ModelDetection {
    const env = options.env ?? process.env;
    const envModel = env.MODLENS_MODEL?.trim();
    if (envModel) {
        return envModel.toLowerCase() === 'none'
            ? { model: null, source: 'env' }
            : { model: envModel, source: 'env' };
    }
    // The MODLENS_HARNESS override comes from the env we were given, since
    // detection itself only consults process.env. Set-but-empty means "not
    // forced", same as detect.ts reads it.
    const forced = env.MODLENS_HARNESS;
    const harness =
        forced === 'none'
            ? null
            : forced ||
              (options.harness !== undefined ? options.harness : detectHarnessDetailed().harness);
    const sniffed = harness ? sniffModel(harness, options.cwd, env, options.roots) : null;
    if (sniffed) {
        const detection: ModelDetection = {
```

</details>

**依据 5 · 源码核查**：[dsh/index.js:295-307](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/dsh/index.js#L295-L307)

工具描述把本地检查和真实读图诊断分开。

<details>
<summary>查看原文（13行）</summary>

```text
  const readImageTool = (toolName) => ({
    name: toolName,
    description:
      'Read an image through the modlens vision bridge. Use whenever a message references an image the current model cannot see: a local file path or an http(s) URL to a screenshot, photo, chart, diagram, or document scan. Returns a summary, an outline of the layout regions in reading order, every word transcribed, and an uncertainty list. Quote the evidence instead of guessing. For the same image and focus, call this tool once and reuse its returned evidence instead of calling again. Evidence for a pasted image carries an `attachment-id:` line: to read that image again with a new focus, pass the id as path, and do not search the filesystem for the file. Requires a configured modlens engine: `npx @liustack/modlens doctor` checks the setup, and when a read fails, `npx @liustack/modlens -i <image file>` in a terminal shows why each provider failed.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description:
            'Absolute local file path, http(s) URL, or the attachment-id (sha256:...) from pasted-image evidence',
        },
        prompt: {
```

</details>

**依据 6 · 源码核查**：[dsh/index.js:1904-1918](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/dsh/index.js#L1904-L1918)

清除临时文件的边界。

<details>
<summary>查看原文（15行）</summary>

```text
async function readImageBytes(data, ext, prompt, signal) {
  const { mkdtemp, rm, writeFile } = await import('node:fs/promises')
  const dir = await mkdtemp(join(tmpdir(), 'modlens-dsh-'))
  try {
    const file = join(dir, `paste${ext}`)
    await writeFile(file, Buffer.from(data), { mode: 0o600 })
    const cli = process.env.MODLENS_DSH_CLI || CLI_PATH
    const cliArgs = [cli, '-i', file, '--timeout', String(CLI_TIMEOUT_MS)]
    if (prompt) {
      cliArgs.push('--prompt', prompt)
    }
    return parseCliResult(await run(process.execPath, cliArgs, signal))
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {})
  }
```

</details>

#### 缺口

- 真实 provider 网络、日志、暂存图和注入评估未检查。
  **影响**：用隔离账户审计出站和文件生命周期，再运行恶意图片回归并记录 provider 留存政策。
  **进一步探讨**：用隔离账户审计出站和文件生命周期，再运行恶意图片回归并记录 provider 留存政策。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样评估识别价值、成本和是否采用？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

仅建议用虚构截图、固定单一路线和费用上限小范围试用，逐项比对 OCR、摘要和不确定项。自动转录可能减少人工抄录是待验证假设；token、延迟、准确率、复核时间都未知。端点无法确认、越界发送或关键字段误读时停止并回退人工。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:380-395](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/dsh/index.js#L380-L395)

DSH 工具注册入口。

<details>
<summary>查看原文（16行）</summary>

```text
  // `tools.get(name, agent)` per scope, then mutating a global catalog per
  // agent. Not entering the collision is cheaper: no host tool is known to
  // use this name, and the model finds ours through its schema, which reaches
  // it on every request regardless of what the tool is called. `toolName`
  // still pins whatever a host prefers.
  const preferred = config.toolName || 'modlens_read_image'
  try {
    ctx.tools.register(readImageTool(preferred))
  } catch (error) {
    // Same-layer duplicate of the chosen name, or a preview-era surface
    // change: degrade loudly instead of taking the whole plugin down.
    console.error(`[modlens] ${preferred} registration skipped: ${error}`)
  }
}

// Image magic bytes for the paste route: refuse anything that is not a real
```

</details>

**依据 2 · 源码核查**：[docs/security.md:19-28](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/docs/security.md#L19-L28)

文档提醒核对凭证与数据处理。

<details>
<summary>查看原文（10行）</summary>

```text
## The dsh plugin keeps what it read

In DeepSeek Harness, the plugin keeps the evidence text it produced for each pasted image in `~/.modlens/dsh-evidence/`, so a restarted or resumed session does not send its whole image history back through the engine. Each entry is the full transcription of one image, so the directory is 0700 and every file 0600. Only images whose attachment id is the sha256 of their bytes are kept, which means an entry can never answer for a different picture.

Entries are tied to the engine in `~/.modlens/config.json` (provider, model, endpoint), so switching engines reads the images again. Deleting a dsh session does not delete its entries: they are removed after 30 days unread, and past 64 MB the least recently read go first. Deleting the directory is always safe: the next read of each image runs the engine again.

## Permissions passed to engines

ModLens invokes `agy` with `--dangerously-skip-permissions` because prompt mode fails in some environments without it. The prompt restricts the agent to reading the one image it was given, and instructs it to treat image content strictly as data.

```

</details>

**依据 3 · 源码核查**：[src/analyzer.ts:560-633](https://github.com/liustack/modlens/blob/e42fc495c7366def4e3cb70040355d20c9c003c0/src/analyzer.ts#L560-L633)

结构化处理及结果校验。

<details>
<summary>查看原文（74行）</summary>

```text
                ...providerOptions,
                imageSource: isolation?.imageSource ?? providerOptions.imageSource,
                workdir: isolation?.workdir ?? providerOptions.workdir,
            });
            // The grace exists for engines with their own internal deadline (agy
            // gets --print-timeout). Engines without one must honour the caller's
            // number as given.
            const backstop = provider.hasInternalTimeout ? timeoutMs + KILL_GRACE_MS : timeoutMs;
            const commandResult = await runCommand(
                provider.name,
                invocation,
                backstop,
                provider.describeFailure,
            );
            parsed = parseOutput(commandResult.stdout);
        } finally {
            // Output goes over stdout, so nothing here needs to outlive the run.
            await isolation?.cleanup();
        }
    } else {
        throw new Error(
            `Provider ${provider.name} implements neither execute nor buildInvocation.`,
        );
    }

    // Server-side schema enforcement is uneven across providers, and even the
    // routes that have it can return a shell that only looks right. Verify the
    // shape here so a structurally broken result fails loudly for every
    // provider, and a failover peer gets its turn at a compliant answer.
    // A model with nothing to say for an optional field writes null there,
    // which means the same as leaving it out; dropping it before the check
    // keeps the read alive and keeps null out of what callers receive.
    parsed.result = normalizeVisionResult(parsed.result);
    const missing = missingSchemaFields(parsed.result);
    if (missing.length > 0) {
        throw new Error(
            `${provider.name} returned a result that does not match the vision schema (wrong or missing: ${missing.join(', ')}).`,
        );
    }

    return parsed;
}

export function resolveInput(input: string): ResolvedInput {
    const trimmed = input.trim();
    if (!trimmed) {
        throw new Error('Input path is required.');
    }

    if (isRemoteSource(trimmed)) {
        return { source: trimmed, kind: 'remote' };
    }

    if (/^file:\/\//i.test(trimmed)) {
        return { source: path.resolve(fileURLToPath(trimmed)), kind: 'local' };
    }

    return { source: path.resolve(trimmed), kind: 'local' };
}

function isRemoteSource(value: string): boolean {
    return /^https?:\/\//i.test(value.trim());
}

function validateInputFile(filePath: string): void {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Input image not found: ${filePath}`);
    }

    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
        throw new Error(`Input is not a file: ${filePath}`);
    }
}
```

</details>

#### 缺口

- 没有真实识别质量、价格和效率数据。
  **影响**：以固定小样本核对费用、调用次数、错漏、修改时间和清理
  **进一步探讨**：结果未达团队要求即停用。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
