# gzhflow

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[3702335](https://github.com/Andiii208/gzhflow/tree/3702335770e30ebccc3790556d53aa14c30046f2)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Andiii208/gzhflow)
<!-- END META -->

> **功能**：把公众号素材、写作、去AI味、配图、排版、推草稿和复盘组织为随包Skill，提供七个DSH工具调用本地脚本。

> **亮点**：结合可替换风格/主题、静态脚本门、LLM清单与人工停靠点，并以七工具和一个bundled Skill接入DSH，减少重复流程说明；方法借鉴归属以NOTICE作者说明为界。详见[Q02](#research-q02)。

> **主要限制**：reader先trim再用非空首字符判顶层，图生子键无法读入；check_env接受env而publish只读credentials。dry-run不连官方接口，前门/审阅未由发布工具强制，未运行复现。详见[Q03](#research-q03)。

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
  - [Q01 · 哪些作者场景适合，合格文章是什么？](#detail-section-11)
  - [Q02 · 七阶段、工具和状态怎样组合？](#detail-section-12)
  - [Q03 · 配置、质量门与发布有什么限制？](#detail-section-13)
  - [Q04 · 依赖和启动流程是什么？](#detail-section-14)
  - [Q05 · 凭据、路径、副作用和恢复怎样？](#detail-section-15)
  - [Q06 · 成本、采用与未来假设如何判断？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向经常用Agent写微信公众号内容、希望保留素材/文风并减少排版和推草稿重复操作的个人作者。输入为主题、用户真实素材和风格/主题配置，输出从Markdown到排版HTML、图片和公众号草稿，再复盘回写个人知识库。它不是无人值守新闻真实性系统，也不直接完成读者可见的最终发布。

合格文章需要内容与经历真实、目标读者可理解、用户声音和事实引用准确、图片有合适使用来源、手机排版能读，且实际草稿内容与审阅版一致。脚本FAIL清零只能说明命中规则通过，LLM自检不是独立审稿，dry-run不检查官方接口。最终内容质量与作者确认仍是核心工作。

基线是手工写/改稿、单独图生/排版工具和公众号后台粘贴。插件将这些步骤接到DSH七工具与一个随包Skill，减少反复告诉模型流程。对没有个人范文/风格素材、频繁跨作者或需要严谨事实核查的场景，模板不能自动填补内容依据，持续维护成本也应计入。

手工写改/独立图生排版/后台粘贴，增量在可复用流程和DSH接线，不能替代事实审稿或真实发布验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 七阶段Skill | 按素材/风格/审阅流程编排 | 提示词约定，不是程序状态机 |
| 静态门 | AI味特征、图prompt和HTML检查 | PASS不等于事实/偏好或接口成功 |
| 排版 | MD到公众号HTML | 需用户视觉核查和主题配置 |
| 图生 | 兼容API出图 | 包装backend reader当前阻断 |
| 草稿推送 | 凭据env、上传素材和draft/add | 默认非dry-run，无幂等/前门收据 |
| 环境自检 | 配置/凭据布尔状态 | env与发布读取路径不同 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=18与DSH tools/credentials/subprocess | 包声明/host必需 | 包装工具执行 | 无依赖声明不代表无宿主接口需求 |
| skills服务 | 随包Skill需要 | provider发现与get | 缺服务不等于工具不能注册 |
| Python可执行程序 | 脚本需要 | 默认python，可配置路径 | 无自动python3探测，启动错误返回2 |
| scripts/与可定位包根 | 模块加载必需 | 相对脚本/配置路径 | 模块顶层resolve失败在runScript前抛错 |
| 个人配置/素材/风格档案 | 完整写作流程需要 | 文风、排版、状态与输出目录 | 示例不能替代作者真实经历/文风 |
| 可信图生backend/key | 可选配图需要 | OpenAI兼容图片API | 当前包装reader缺陷需先解决 |
| 公众号授权条件与凭据 | 实际推草稿需要 | token/上传/草稿接口 | dry-run不证明账号和网络条件具备 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包、复制配置模板，独立备份个人四库 | 不把示例/风格参考当真实内容 |
| 安装 | DSH profile挂载bundle，可选另装主编preset | 七工具与一个Skill可发现 |
| 校验 | 先检查包根/Python与配置读入，不外发 | check_env就绪和真实wrapper凭据通路分开 |
| 写作 | 读state/素材/风格，逐门后人工审阅 | 规则命中与事实质量分别检查 |
| 预览 | 核HTML/图片，再dry-run | 只证明本地条件，不能代替接口验收 |
| 推草稿 | 读者明确确认具体审阅版后调用 | 保存media_id、到后台核内容，结果未知先核草稿箱 |

本轮不运行目标Skill/脚本、不取token、不图生、不上传或创建草稿，也不核实当前公众号平台政策。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主/Python、素材/配置与接口接入 | 填个人四库、核文风/主题和凭据 | 包装配置缺陷增加排错 |
| 持续使用 | 写作/重写/多视角模型、可选图生、文件与上传 | 素材核查、全文审阅、视觉和排版检查 | 七阶段调用/轮数取决于Agent，未测净token/时间 |
| 失败恢复 | 留本地稿/HTML/图片，远端素材核对 | 查首次上传/草稿是否成功，避免重复副作用 | 无持久幂等收据或原子发布 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 流程复用 | 七阶段Skill、独立脚本与DSH包装 | 任意Agent完全遵守门禁 |
| 去AI味 | 确定性特征与FAIL/WARN | 人类偏好、真实性和通用检测率 |
| 生产 | HTML/图生/草稿脚本 | 正常配置下当前包装图生可用性 |
| 发布 | 本地dry-run与顺序API路径 | 当前账号权限、真实草稿成功及幂等 |

> **思考**：reader先trim再用非空首字符判顶层，图生子键无法读入；check_env接受env而publish只读credentials。dry-run不连官方接口，前门/审阅未由发布工具强制，未运行复现。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：结合可替换风格/主题、静态脚本门、LLM清单与人工停靠点，并以七工具和一个bundled Skill接入DSH，减少重复流程说明；方法借鉴归属以NOTICE作者说明为界。详见[Q02](#research-q02)。

包装器以argv数组而非拼shell命令执行，凭据作为子进程增量env传入，不放发布命令行参数，这是可借鉴接线。stdout/stderr各2MB收集与graceMs是局部参数，不是整个流程deadline或图片/文章大小保证；runScript await handle.done没有自己的timeout/cancel绑定，具体策略依宿主subprocess。所有脚本cwd固定包根，用户稿件相对路径也相对包根，需明确输出位置；工具没有独立工作区realpath围栏，不能把“经subprocess”自动等同沙箱已验收。

真实推送依次取token、上传正文本地图片、封面，再draft/add。HTML相对图路径以HTML目录解析，缺图只是warn保留原路径，dry-run没扫所有本地图片。上传成功后最终草稿失败会留下远端素材，重跑可重复上传/建草稿；没有事务、幂等key或断点收据文件。网络超时不能断言远端未创建，media_id只在成功stdout显示，读者需要后台核对后再决定重试。

图生把key送配置base_url，并可下载接口返回url，地址选择属于信任边界。错误会回显部分第三方响应，不应认为完全无敏感日志。state/四库/复盘依文本约定，无并发锁/版本；不同Agent同时编辑可能互覆盖，反思回写是模型生成经验，非独立证据。工程强项为脚本职责分离和可本地预览，可靠出版还需具体版本/材料与副作用收据。

<a id="detail-section-5"></a>

### 1.4 主要限制

reader先trim再用非空首字符判顶层，图生子键无法读入；check_env接受env而publish只读credentials。dry-run不连官方接口，前门/审阅未由发布工具强制，未运行复现。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。继续探讨从普通缩进配置和仅env凭据的本地stub入手，再以同稿件人工质量比较流程，最终单独核具体草稿版本与远端收据。详见[Q06](#research-q06)。

合格文章需要内容与经历真实、目标读者可理解、用户声音和事实引用准确、图片有合适使用来源、手机排版能读，且实际草稿内容与审阅版一致。脚本FAIL清零只能说明命中规则通过，LLM自检不是独立审稿，dry-run不检查官方接口。最终内容质量与作者确认仍是核心工作。

基线是手工写/改稿、单独图生/排版工具和公众号后台粘贴。插件将这些步骤接到DSH七工具与一个随包Skill，减少反复告诉模型流程。对没有个人范文/风格素材、频繁跨作者或需要严谨事实核查的场景，模板不能自动填补内容依据，持续维护成本也应计入。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持七阶段提示词和脚本/宿主接线；图生配置reader阻断、凭据路径不一及发布非幂等限制采用，机器PASS不证明文章质量。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、NOTICE.md、skills/gzhflow/SKILL.md、dsh-preset/tools/gzhflow-tools.mjs、dsh-preset/tools/gzhflow-skill.mjs、scripts/ai_flavor_score.py、scripts/publish_draft.py、scripts/generate_image.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定DSH工具/Skill provider、七阶段主指引、AI风格规则和发布/图生关键路径；未完整审计全部38份方法论/排版主题或验证第三方语料研究，不执行目标或外部副作用。
- 下一步：进一步探讨可用固定稿件和本地假API测试改版旧PASS、配置读入、上传后结果未知与重复调用，比较错版/重复及人工恢复。

**分析版本**

- **仓库**：[Andiii208/gzhflow](https://github.com/Andiii208/gzhflow)
- **版本号**：0.2.0（[固定提交 3702335](https://github.com/Andiii208/gzhflow/tree/3702335770e30ebccc3790556d53aa14c30046f2)）
- **版本日期**：2026-10-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索按产物hash绑定质检/审阅、按attempt保存图生/上传/草稿远端ID收据，比较错版/重复与恢复人工；未实现。详见[Q06](#research-q06)。

进一步探讨可用固定稿件和本地假API测试改版旧PASS、配置读入、上传后结果未知与重复调用，比较错版/重复及人工恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 92 | 12367 | — | — | 155804 |
| .mjs | source | 2 | 412 | 342 | 47 | — |
| .md | example | 7 | 412 | — | — | 4551 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Andiii208/gzhflow/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Andiii208/gzhflow/issues?q=is%3Aissue+created%3A2026-09-22T05%3A46%3A09.008Z..2026-10-22T05%3A46%3A09.008Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Andiii208/gzhflow/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A46%3A09.008Z..2026-10-22T05%3A46%3A09.008Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本公众号工作流Skill/DSH包装与质量门贡献，核查配置阻断、凭据一致性及发布副作用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些作者场景适合，合格文章是什么？

**研究主题**：场景与需求

#### 完整回答

面向经常用Agent写微信公众号内容、希望保留素材/文风并减少排版和推草稿重复操作的个人作者。输入为主题、用户真实素材和风格/主题配置，输出从Markdown到排版HTML、图片和公众号草稿，再复盘回写个人知识库。它不是无人值守新闻真实性系统，也不直接完成读者可见的最终发布。

合格文章需要内容与经历真实、目标读者可理解、用户声音和事实引用准确、图片有合适使用来源、手机排版能读，且实际草稿内容与审阅版一致。脚本FAIL清零只能说明命中规则通过，LLM自检不是独立审稿，dry-run不检查官方接口。最终内容质量与作者确认仍是核心工作。

基线是手工写/改稿、单独图生/排版工具和公众号后台粘贴。插件将这些步骤接到DSH七工具与一个随包Skill，减少反复告诉模型流程。对没有个人范文/风格素材、频繁跨作者或需要严谨事实核查的场景，模板不能自动填补内容依据，持续维护成本也应计入。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-19](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/README.md#L5-L19)

作者定义公众号工作流与门组合。

<details>
<summary>查看原文（15行）</summary>

```text
一套**可复用、跨主流 AI Agent** 的微信公众号内容发布工作流框架：从「一个主题」到「草稿箱里一篇排好版、配好图、去过 AI 味的文章」，六阶段流水线 + 每步质量门。

> 适配 Claude Code / Cursor / Codex CLI / Gemini CLI / Qwen Code / DeepSeek 等主流 Agent，也兼容 Hermes 的 SKILL.md 格式（同源标准）。

## 特性

- **跨 Agent 开箱即用**：`AGENTS.md` 单一真源 + `CLAUDE.md` 一行桥接，任何 Agent 打开即懂
- **七阶段流水线**：素材先行 → 写作 → 去AI味 → 配图 → 排版 → 推草稿箱 → 复盘回写
- **四库 + 状态机**：收件箱 / 范文锚 / 风格档案 / 教训库在下沉淀，`state.md` 跨会话接续
- **质检门有实测依据**：规则来自 629 篇 283 万字的对照语料研究（`lieflat-less-ai-tone`，MIT），不是拍脑袋
- **个人化可替换**：文风/配图风格/排版主题全部走 `config/` 配置 + `examples/` 模板，流程不绑定个人
- **质量门三件套**：脚本门（确定性）+ 清单门（LLM 自检）+ 人工门（审阅/dry-run）
- **发布层个人号可用**：官方 API `draft/add` 推草稿箱（个人订阅号可用），手动粘贴兜底
- **纯 CLI 工具**：stdlib 优先，无外部依赖，跨平台

```

</details>

**依据 2 · 源码核查**：[skills/gzhflow/SKILL.md:17-35](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/skills/gzhflow/SKILL.md#L17-L35)

七阶段、严格审阅和质量门是文档约定。

<details>
<summary>查看原文（19行）</summary>

```text
   你会把已经问过的问题再问一遍。
   **这个文件被 gitignore（含个人进度），clone 下来没有是正常的**，按 SKILL.md 从阶段① 起即可。
2. **配置**：确认 `config/workflow.yaml`、`config/styles.yaml`、`config/themes.yaml`、`config/publish.yaml` 存在（不存在则从 `*.example.yaml` 复制，并让用户确认配置）。
3. **产物目录**：所有产物（草稿 md、HTML、图片）写入 `config/workflow.yaml` 的 `output_dir`（默认 `generated/`，已 gitignore）。
4. **审核模式**：默认 `strict`——每个阶段输出都给用户审阅；用户明确说「直接做/不用审阅」才切 `auto` 全自动。
   全自动时按 `prompts/00-run.md` 的 Run 规范执行（零提问 + 决策日志 + 轮次封顶），
   并**强提醒用户中途不要等**——Run 会一次跑完再交付。

## 1. 七阶段总览

| 阶段 | 提示词 | 质检门 | 产物 |
|---|---|---|---|
| ① 素材先行 | `prompts/01-material.md` | 意图三问（写给谁/什么感觉/为什么今天） | 素材锚点清单 |
| ② 写作 | `prompts/02-writing.md` | `scripts/ai_flavor_score.py` + 自检四问 | `draft.md`（frontmatter + 正文） |
| ③ 去AI味 | `prompts/03-deai.md` | `scripts/ai_flavor_score.py` 复检（FAIL 清零） | 定稿 `draft.md` |
| ④ 配图（可选） | `prompts/04-images.md` | `scripts/check_image_prompt.py`（PASS 才生成）→ `scripts/image_batch.py --plan-only`（过预算） | `cover.jpg` + 内文图 + 预算单 |
| ⑤ 排版 | `prompts/05-layout.md` | `scripts/validate_gzh_html.py`（0 ERROR） | `{标题}_排版_{主题}.html` |
| ⑥ 发布 | `prompts/06-publish.md` | `scripts/publish_draft.py --dry-run` 先验 | 草稿箱草稿 |
| ⑦ 复盘 | `prompts/07-review.md` | 每次手改记一笔；每 5 篇回写一次 | `assets/log.md` + `assets/learned-edits.md` + 回写各库 |
```

</details>

**依据 3 · 源码核查**：[scripts/publish_draft.py:309-315](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/scripts/publish_draft.py#L309-L315)

实际创建草稿后提示手动检查发布。

```text
    resp = api_post(f"{API_BASE}/cgi-bin/draft/add?access_token={token}", {"articles": [article]})
    if "media_id" in resp:
        print(f"✅ 已推送到草稿箱: {resp['media_id']}")
        print("   请在「公众号助手 App → 草稿箱」检查后手动发布（个人号无法 API 直接发布）")
        sys.exit(0)
    _die_wechat_error(resp, "创建草稿")

```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 七阶段、工具和状态怎样组合？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

bundle patch分别挂tools和skill模块，宿主注册七工具与bundled gzhflow provider。工具将参数编译JSON Schema、经ctx.subprocess运行Python脚本，统一返回exit_code/output/stderr。Skill正文惰性读取，resourceBase指向随包目录，让Agent按阶段读取prompts/资料。其它写作/设计资料虽存在，不代表每个都由provider独立注册或一加载就执行。

七阶段从素材、写作、去AI味、可选配图、HTML到推草稿与复盘，state.md和四库保存跨会话人工/模型进度。它是提示词编排，工具间没有程序状态机强制“前门通过才调用发布”；default strict、dry-run和用户审阅主要依Agent遵守。没有自动加载用户所有素材或可靠多Agent事务交接。

贡献是将可替换文风/主题、脚本静态门、LLM清单和人工停靠点串成可分发流程，并提供DSH凭据/子进程接线。去AI味规则和写作/图像方法借鉴有作者NOTICE归属；本轮不把参考项目研究数字当独立验证，也不把成熟微信公众号API/排版技巧算原创算法。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-10](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/cordis.patch.yml#L1-L10)

两模块挂载。

<details>
<summary>查看原文（10行）</summary>

```text
# gzhflow — DeepSeek Harness bundle patch.
# Installed via `dsh plugin add https://github.com/Andiii208/gzhflow`.
# Registers the six-stage workflow's quality-gate tools and ships the gzhflow
# skill as a bundled provider. The "公众号主编" persona remains an opt-in agent
# preset (see dsh-preset/), not a global injection.
- insert:
    - id: gzhflow-tools
      name: gzhflow/tools
    - id: gzhflow-skill
      name: gzhflow/skill
```

</details>

**依据 2 · 源码核查**：[dsh-preset/tools/gzhflow-tools.mjs:86-125](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/dsh-preset/tools/gzhflow-tools.mjs#L86-L125)

subprocess与结构化输出/注册。

<details>
<summary>查看原文（40行）</summary>

```text
  let handle
  try {
    handle = ctx.subprocess.spawn({
      argv: [opts.python ?? 'python', join(SCRIPTS_DIR, script), ...args],
      cwd: REPO_ROOT,
      env: opts.env ?? {}, // 只传增量：运行时自带清洗后的父环境基线，勿展开 ...process.env
      graceMs: opts.graceMs ?? 3000,
      stdio: {
        stdin: opts.stdinData !== undefined ? { data: opts.stdinData } : 'ignore',
        stdout: { maxBytes: opts.maxBytes ?? 2_000_000 },
        stderr: { maxBytes: opts.maxBytes ?? 2_000_000 },
      },
    })
  } catch (err) {
    return { exitCode: 2, stdout: '', stderr: `❌ 无法启动脚本（python 是否在 PATH？）: ${err?.message ?? err}` }
  }
  const { exitCode } = await handle.done
  return {
    exitCode: exitCode ?? 1,
    stdout: (handle.collected?.stdout?.readFrom(0)?.text ?? '').trim(),
    stderr: (handle.collected?.stderr?.readFrom(0)?.text ?? '').trim(),
  }
}

/** 统一结果包装：脚本返回 → 工具返回。 */
function wrap(r) {
  return { exit_code: r.exitCode, output: r.stdout, stderr: r.stderr }
}

export function apply(ctx, config) {
  // config 可能为 undefined（agent.cordis.yml 的 gzhflow-tools 行无 config 块时 cordis 传 undefined）
  const pythonBin = config?.python ?? 'python'
  const registerTool = (tool) => ctx.effect(() => ctx.tools.register({
    ...tool,
    parameters: toJsonSchema(tool.parameters),
  }))

  // 首次使用环境自检：会话开始第一步调用。只返回「已配置/缺失」状态，绝不返回凭据值。
  registerTool({
    name: 'gzhflow_check_env',
```

</details>

**依据 3 · 源码核查**：[dsh-preset/tools/gzhflow-skill.mjs:60-96](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/dsh-preset/tools/gzhflow-skill.mjs#L60-L96)

一个bundled provider与resourceBase。

<details>
<summary>查看原文（37行）</summary>

```text
const provider = {
  name: 'gzhflow',
  async list() {
    if (!existsSync(SKILL_MD)) return []
    return [{
      name: 'gzhflow',
      description: DESCRIPTION,
      rank: BUNDLED_SKILL_RANK,
      locator: SKILL_MD,
      path: SKILL_MD,
      metadata: skillAtLoad?.meta,
      source: 'bundled',
      provider: 'gzhflow',
      invocation: INVOCATION,
      resourceBase: RESOURCE_BASE,
    }]
  },
  async get() {
    const s = readSkill()
    if (!s) return undefined
    return {
      name: 'gzhflow',
      description: DESCRIPTION,
      content: s.body,
      path: SKILL_MD,
      metadata: s.meta,
      source: 'bundled',
      provider: 'gzhflow',
      invocation: INVOCATION,
      resourceBase: RESOURCE_BASE,
    }
  },
}

export function apply(ctx) {
  if (!ctx.skills || typeof ctx.skills.registerProvider !== 'function') return
  ctx.effect(() => ctx.skills.registerProvider(() => provider))
```

</details>

**依据 4 · 源码核查**：[skills/gzhflow/SKILL.md:6-45](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/skills/gzhflow/SKILL.md#L6-L45)

state/配置/严格审阅及四库约定。

<details>
<summary>查看原文（40行）</summary>

```text
tags: [wechat, 公众号, content-publishing, workflow, cross-agent]
---

# gzhflow 主编排 — 微信公众号内容发布工作流

> 本文件是工作流的**唯一权威编排**。任何 Agent（Claude Code / Cursor / Codex / Gemini CLI / Qwen Code / DeepSeek / Hermes 等）按此执行。用户给主题后，按顺序走完七个阶段，每阶段读完对应 `prompts/` 文件、跑完对应质检门、输出给用户审阅后再进下一阶段。

## 0. 启动前必读（每次会话第一件事）

1. **读 `state.md`**（仓库根目录）：当前这篇写到哪了、待办、会话交接备注。
   用户在多个 Agent 之间切换，没有这个文件，上一个会话的上下文就断了——
   你会把已经问过的问题再问一遍。
   **这个文件被 gitignore（含个人进度），clone 下来没有是正常的**，按 SKILL.md 从阶段① 起即可。
2. **配置**：确认 `config/workflow.yaml`、`config/styles.yaml`、`config/themes.yaml`、`config/publish.yaml` 存在（不存在则从 `*.example.yaml` 复制，并让用户确认配置）。
3. **产物目录**：所有产物（草稿 md、HTML、图片）写入 `config/workflow.yaml` 的 `output_dir`（默认 `generated/`，已 gitignore）。
4. **审核模式**：默认 `strict`——每个阶段输出都给用户审阅；用户明确说「直接做/不用审阅」才切 `auto` 全自动。
   全自动时按 `prompts/00-run.md` 的 Run 规范执行（零提问 + 决策日志 + 轮次封顶），
   并**强提醒用户中途不要等**——Run 会一次跑完再交付。

## 1. 七阶段总览

| 阶段 | 提示词 | 质检门 | 产物 |
|---|---|---|---|
| ① 素材先行 | `prompts/01-material.md` | 意图三问（写给谁/什么感觉/为什么今天） | 素材锚点清单 |
| ② 写作 | `prompts/02-writing.md` | `scripts/ai_flavor_score.py` + 自检四问 | `draft.md`（frontmatter + 正文） |
| ③ 去AI味 | `prompts/03-deai.md` | `scripts/ai_flavor_score.py` 复检（FAIL 清零） | 定稿 `draft.md` |
| ④ 配图（可选） | `prompts/04-images.md` | `scripts/check_image_prompt.py`（PASS 才生成）→ `scripts/image_batch.py --plan-only`（过预算） | `cover.jpg` + 内文图 + 预算单 |
| ⑤ 排版 | `prompts/05-layout.md` | `scripts/validate_gzh_html.py`（0 ERROR） | `{标题}_排版_{主题}.html` |
| ⑥ 发布 | `prompts/06-publish.md` | `scripts/publish_draft.py --dry-run` 先验 | 草稿箱草稿 |
| ⑦ 复盘 | `prompts/07-review.md` | 每次手改记一笔；每 5 篇回写一次 | `assets/log.md` + `assets/learned-edits.md` + 回写各库 |

**质量门是硬门槛**：脚本 FAIL 不进入下一阶段。**默认停靠点**：①②③ 阶段输出全文给用户审阅。

## 1.5 四库与状态机（这套系统跟普通流水线的区别）

单篇生产只是飞轮的一段弧。底下四个库在下持续沉淀，单篇流程在上取用并回写：

| 库 | 文件 | 变化速度 | 什么时候动 |
|---|---|---|---|
| 输入收件箱 | `assets/inbox.md` | 快变（日） | 日常「记一笔」；阶段① 先查它 |
```

</details>

**依据 5 · 作者声明**：[NOTICE.md:11-27](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/NOTICE.md#L11-L27)

作者归属与借鉴边界声明。

<details>
<summary>查看原文（17行）</summary>

```text
本仓库是「工作流框架 + 纯脚本工具」仓库，**刻意避免复制第三方代码**：

- **不包含** gzh-design（AGPL-3.0）代码。排版引擎 `scripts/md2wechat.py` 为原创轻量实现，仅采用社区通用技术（如 `span leaf` 包裹以保留微信样式——这是微信公众号排版的公开通行技巧，非任何项目的专有代码）。
- **不包含** baoyu-skills / wechatpy / MCP 等发布工具代码。发布层 `scripts/publish_draft.py` 直接调用微信官方公开 API（draft/add 等），属原创实现。
- 示例文风/配图引擎为**去个人化改编**：不保留原参考公众号名称，不保存任何完整文章副本，仅保留风格特征的方法论描述。

## 上游借鉴清单（思想/方法论层面，非代码复制）

| 上游项目 | 借鉴内容 | 许可证 | 本仓库使用方式 |
|---|---|---|---|
| Andiii208/andiii-wechat-workflow | 六阶段工作流、文风路由、去 AI 味手册、配图四件套引擎、设计推理层、质检门思路（作者本人作品） | MIT | 抽象泛化 + 去个人化改写 |
| human-writing（KKKKhazix） | check_prose.py 文字质检门的「硬禁令 + WARN」思路 | MIT | 借鉴思路，`ai_flavor_score.py` 为原创实现 |
| agentskills.io（Anthropic 开放标准） | SKILL.md frontmatter 格式（name/description 等） | Apache-2.0（规范文档） | 遵循格式规范 |
| AGENTS.md（agents.md） | 仓库级指令约定 | CC-BY（规范文档） | 遵循约定 |
| 微信公众号官方文档 | draft/add / media/uploadimg 等 API 调用方式 | 官方文档 | 事实性引用 |

## 注意
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 配置、质量门与发布有什么限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

图生配置reader有直接静态错误。对每行line.trim()后，再用/^\S/判断是否顶层，所有非空子键都匹配并把inBackend=false；base_url/model/api_key_env永远不进入解析赋值。generate_image先调用reader，发现缺base/model返回2，所以正常缩进YAML也不能通过该包装工具。Python独立脚本有自己的后端解析，不应推广成所有CLI图生均失败。

check_env的凭据检查接受credentials或环境变量，但publish wrapper仅credentials.resolve，无环境回退；环境变量模式可被报ready后实际推送工具仍拒绝。check_prompt工具又只传prompt，没暴露Skill要求非水彩必带的--engine；deai工具没暴露--model而脚本阈值确依model变化。因此“跨Agent配置开箱”需区分Skill指令、CLI与DSH包装面，不是完全对等。

ai_flavor_score是正则/结构特征规则，带频率比的依据为作者引用的特定对照语料，不能以此识别文章是否AI生成、事实准确或人类更喜欢。publish dry-run只核HTML/封面和参数后返回，不取token、不上传/验证图片或实际draft/add，不是全链路验收。工具dry_run缺省false，发布并不在代码层强制先质检/审阅。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-preset/tools/gzhflow-tools.mjs:48-66](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/dsh-preset/tools/gzhflow-tools.mjs#L48-L66)

trim后/^\S/使子键退出backend。

<details>
<summary>查看原文（19行）</summary>

```text
function readImageBackendConfig() {
  const cfgPath = join(REPO_ROOT, 'config', 'workflow.yaml')
  let text
  try {
    text = readFileSync(cfgPath, 'utf8')
  } catch {
    return {}
  }
  const out = {}
  let inBackend = false
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    if (/^image_backend\s*:/.test(trimmed)) { inBackend = true; continue }
    if (/^\S/.test(trimmed)) inBackend = false // 顶层新键，退出 image_backend 段
    if (!inBackend) continue
    const m = /^(base_url|model|api_key_env)\s*:\s*"?([^"\s]+)"?/.exec(trimmed)
    if (m) out[m[1]] = m[2]
  }
```

</details>

**依据 2 · 源码核查**：[dsh-preset/tools/gzhflow-tools.mjs:245-255](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/dsh-preset/tools/gzhflow-tools.mjs#L245-L255)

backend为空直接拒图生。

<details>
<summary>查看原文（11行）</summary>

```text
    async execute(args) {
      // 图生后端引导：config/workflow.yaml 的 image_backend 段缺失时给可操作指引
      const backend = readImageBackendConfig()
      if (!backend.base_url || !backend.model) {
        return {
          exit_code: 2,
          output: '',
          stderr: '❌ 图生后端未配置：复制仓库 config/workflow.example.yaml 为 config/workflow.yaml，' +
                  '填写 image_backend.base_url（如 https://dashscope.aliyuncs.com/compatible-mode/v1）与 image_backend.model（如 wanx2.1-t2i-turbo）。',
        }
      }
```

</details>

**依据 3 · 源码核查**：[dsh-preset/tools/gzhflow-tools.mjs:133-149](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/dsh-preset/tools/gzhflow-tools.mjs#L133-L149)

check_env环境回退。

<details>
<summary>查看原文（17行）</summary>

```text
          const res = await credentials.resolve(ref)
          if (res?.value !== undefined && res?.value !== '') return true
        }
        return !!(process.env[ref] && process.env[ref].length > 0)
      }
      const wechatId = await read('WECHAT_APP_ID')
      const wechatSecret = await read('WECHAT_APP_SECRET')
      const backend = readImageBackendConfig()
      const keyName = backend.api_key_env || 'IMAGE_API_KEY'
      const imageKey = await read(keyName)
      const wechatReady = wechatId && wechatSecret
      const backendReady = !!(backend.base_url && backend.model)
      const imageReady = backendReady && imageKey

      const wechatMissing = []
      if (!wechatId) wechatMissing.push('WECHAT_APP_ID')
      if (!wechatSecret) wechatMissing.push('WECHAT_APP_SECRET')
```

</details>

**依据 4 · 源码核查**：[dsh-preset/tools/gzhflow-tools.mjs:289-311](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/dsh-preset/tools/gzhflow-tools.mjs#L289-L311)

发布仅credentials、dry_run可省略。

<details>
<summary>查看原文（23行）</summary>

```text
    async execute(args) {
      const argv = [args.html, '--title', args.title]
      if (args.author) argv.push('--author', args.author)
      if (args.summary) argv.push('--summary', args.summary)
      if (args.cover) argv.push('--cover', args.cover)
      if (args.dry_run) argv.push('--dry-run')
      const env = {}
      if (!args.dry_run) {
        // dry_run 免凭证（与脚本一致：dry-run 在 load_credentials 前返回）
        const credentials = ctx.get('credentials')
        const read = async (ref) => {
          const res = credentials ? await credentials.resolve(ref) : undefined
          return res?.value
        }
        const appId = await read('WECHAT_APP_ID')
        const appSecret = await read('WECHAT_APP_SECRET')
        if (!appId || !appSecret) {
          return { exit_code: 2, output: '', stderr: '❌ 未配置公众号凭证：请编辑 ~/.dsh/.credentials.yaml 添加 WECHAT_APP_ID 与 WECHAT_APP_SECRET（详见 dsh-preset/README.md「凭证」）' }
        }
        env.WECHAT_APP_ID = appId
        env.WECHAT_APP_SECRET = appSecret
      }
      const r = await runScript(ctx, 'publish_draft.py', argv, { env, python: pythonBin })
```

</details>

**依据 5 · 源码核查**：[dsh-preset/tools/gzhflow-tools.mjs:189-201](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/dsh-preset/tools/gzhflow-tools.mjs#L189-L201)

check_prompt无engine参数。

<details>
<summary>查看原文（13行）</summary>

```text
    },
  })

  registerTool({
    name: 'gzhflow_check_prompt',
    description: 'gzhflow 配图 prompt 质检门（check_image_prompt.py）。exit_code 0=PASS（含 WARN 不阻断），1=FAIL（硬规避或必需项缺失）。',
    parameters: {
      prompt: { type: 'string', required: true, description: '四段式编译出的图生 prompt 全文' },
    },
    output: { schema: { type: 'object' }, render: (_a, v) => [{ type: 'text', text: JSON.stringify(v, null, 2) }] },
    async execute(args) {
      if (!args.prompt) return { exit_code: 2, output: '参数错误：prompt 必填', stderr: '' }
      return wrap(await runScript(ctx, 'check_image_prompt.py', [], { stdinData: args.prompt, python: pythonBin }))
```

</details>

**依据 6 · 作者声明**：[scripts/ai_flavor_score.py:2-26](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/scripts/ai_flavor_score.py#L2-L26)

作者规则来源和model阈值说明。

<details>
<summary>查看原文（25行）</summary>

```text
"""gzhflow 去 AI 味质检门（ai_flavor_score）。

出稿后跑一遍，FAIL 项必须清零，WARN 项是体检报告，人看。
规则依据来自两处：一是本项目自己攒的踩坑经验，二是 larashero3-dotcom/lieflat-less-ai-tone
（MIT）那篇对照语料研究——629 篇文章 283 万字，5 个模型各 60 篇对 329 篇人类文本，
26 项候选特征逐项算频率比 R = 生成侧 ÷ 人类侧。本文件里带 R 的注释都出自它。

三条已按那项研究撤掉的规则（曾在本文件里，2026-10-12 删）：
  句长变异系数 CV < 0.3 —— 实测 R=0.87，生成 0.58 / 人类 0.67，无区分力
  句内同构排比 —— 实测 R=0.61，人类用得比 AI 还多
  比喻/隐喻整体 —— 实测 R=0.42，人类是 AI 的 2.4 倍

用法:
    python scripts/ai_flavor_score.py <稿件.md>       # 检文件（自动剥离 frontmatter）
    python scripts/ai_flavor_score.py --text "文本"    # 检直接传入的文本
    python scripts/ai_flavor_score.py --model deepseek <稿件.md>
    python scripts/ai_flavor_score.py - < 稿件.md      # 检 stdin

--model 只影响破折号的阈值。破折号这项模型间极差 40 倍
（DeepSeek 5.16 次/千字，Claude 4.25，Kimi 2.32，Gemini 0.51，GPT 只有 0.11，
人类 0.80），一刀切禁它对 GPT 输出是在删一个比人用得还少的标点。
不指定时用生成侧整体均值 2.38。

退出码: 0 = 无 FAIL, 1 = 有 FAIL（必须清零后才能交稿）
文体分流：draft.md frontmatter 写 genre: 抒情 / 说理 / 测评，抒情类跳过数字密度提示。
```

</details>

**依据 7 · 源码核查**：[scripts/publish_draft.py:266-279](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/scripts/publish_draft.py#L266-L279)

dry-run在凭据和token前退出。

<details>
<summary>查看原文（14行）</summary>

```text
    # 作者兜底：--author > frontmatter author > config/publish.yaml 的 publish.default_author > 空
    pub_cfg = load_publish_config()
    if not author:
        author = pub_cfg["default_author"] or ""

    if args.dry_run:
        print("✅ dry-run 通过：参数/文件就绪（未取 token，零风险）")
        print(f"   title: {title}")
        print(f"   author: {author or '(未指定)'}")
        print(f"   summary: {(summary or '')[:60]}{'…' if summary and len(summary) > 60 else ''}")
        print(f"   cover: {cover}")
        sys.exit(0)

    app_id, app_secret = load_credentials(args)
```

</details>

#### 缺口

- 配置解析阻断与凭据就绪/执行不一致未运行复现。
  **影响**：固定源码足以限制包装面承诺，不断言所有部署或独立Python CLI失败。
  **进一步探讨**：可从普通缩进配置与仅环境变量凭据的无网络stub测试核对reader/工具门。
- 规则在用户文体的误报、漏报和实际阅读偏好未独立验证。
  **影响**：不能把机器门PASS写成文章质量或真实性结论。
  **进一步探讨**：固定真文/改稿样本，盲评事实保真与风格，再对照规则命中和人工改动。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖和启动流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=18与DSH tools/credentials/subprocess | 包声明/host必需 | 包装工具执行 | 无依赖声明不代表无宿主接口需求 |
| skills服务 | 随包Skill需要 | provider发现与get | 缺服务不等于工具不能注册 |
| Python可执行程序 | 脚本需要 | 默认python，可配置路径 | 无自动python3探测，启动错误返回2 |
| scripts/与可定位包根 | 模块加载必需 | 相对脚本/配置路径 | 模块顶层resolve失败在runScript前抛错 |
| 个人配置/素材/风格档案 | 完整写作流程需要 | 文风、排版、状态与输出目录 | 示例不能替代作者真实经历/文风 |
| 可信图生backend/key | 可选配图需要 | OpenAI兼容图片API | 当前包装reader缺陷需先解决 |
| 公众号授权条件与凭据 | 实际推草稿需要 | token/上传/草稿接口 | dry-run不证明账号和网络条件具备 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包、复制配置模板，独立备份个人四库 | 不把示例/风格参考当真实内容 |
| 安装 | DSH profile挂载bundle，可选另装主编preset | 七工具与一个Skill可发现 |
| 校验 | 先检查包根/Python与配置读入，不外发 | check_env就绪和真实wrapper凭据通路分开 |
| 写作 | 读state/素材/风格，逐门后人工审阅 | 规则命中与事实质量分别检查 |
| 预览 | 核HTML/图片，再dry-run | 只证明本地条件，不能代替接口验收 |
| 推草稿 | 读者明确确认具体审阅版后调用 | 保存media_id、到后台核内容，结果未知先核草稿箱 |

本轮不运行目标Skill/脚本、不取token、不图生、不上传或创建草稿，也不核实当前公众号平台政策。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:11-38](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/package.json#L11-L38)

包入口、files和Node声明。

<details>
<summary>查看原文（28行）</summary>

```text
  "main": "./dsh-preset/tools/gzhflow-tools.mjs",
  "exports": {
    ".": "./dsh-preset/tools/gzhflow-tools.mjs",
    "./tools": "./dsh-preset/tools/gzhflow-tools.mjs",
    "./skill": "./dsh-preset/tools/gzhflow-skill.mjs",
    "./package.json": "./package.json"
  },
  "files": [
    "cordis.patch.yml",
    "dsh-preset/tools/",
    "scripts/",
    "skills/",
    "references/",
    "examples/",
    "config/*.example.yaml",
    "README.md",
    "README.en.md",
    "LICENSE",
    "NOTICE.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "engines": {
    "node": ">=18"
  }
```

</details>

**依据 2 · 源码核查**：[dsh-preset/tools/gzhflow-tools.mjs:15-41](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/dsh-preset/tools/gzhflow-tools.mjs#L15-L41)

宿主服务与顶层包根解析。

<details>
<summary>查看原文（27行）</summary>

```text
export const inject = ['tools', 'credentials', 'subprocess']

/**
 * 解析 gzhflow 仓库根（含 scripts/）。部署形态有两种：
 *   1. 仓库内开发（junction 或直接路径）：本文件位于 <repo>/dsh-preset/tools/，向上两级即仓库根。
 *   2. 拷贝安装（DSH 预设发现不跟 junction，需真实目录）：安装器把 dsh-preset/ 拷到
 *      <dshHome>/.agent-presets/gzhflow/ 并在同目录写 .gzhflow-repo 指针文件。
 * 解析优先级：env GZHFLOW_REPO > 指针文件 > 仓库布局探测。找不到时抛错（runScript 会转成友好返回）。
 */
function resolveRepoRoot() {
  const envRepo = process.env.GZHFLOW_REPO
  if (envRepo) return envRepo
  const moduleDir = fileURLToPath(new URL('.', import.meta.url))
  const pointer = join(moduleDir, '..', '.gzhflow-repo')
  try {
    const fromPointer = readFileSync(pointer, 'utf8').trim()
    if (fromPointer && existsSync(join(fromPointer, 'scripts'))) return fromPointer
  } catch { /* 指针文件缺失 = 仓库内布局，走下方探测 */ }
  const repo = fileURLToPath(new URL('../../', import.meta.url))
  if (existsSync(join(repo, 'scripts'))) return repo
  throw new Error(
    'gzhflow-tools: 无法定位仓库根（scripts/ 不存在）。' +
    '若为拷贝安装请检查 <preset>/.gzhflow-repo 指针文件，或设环境变量 GZHFLOW_REPO。'
  )
}

const REPO_ROOT = resolveRepoRoot()
```

</details>

**依据 3 · 源码核查**：[dsh-preset/tools/gzhflow-tools.mjs:86-106](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/dsh-preset/tools/gzhflow-tools.mjs#L86-L106)

python执行与错误路径。

<details>
<summary>查看原文（21行）</summary>

```text
  let handle
  try {
    handle = ctx.subprocess.spawn({
      argv: [opts.python ?? 'python', join(SCRIPTS_DIR, script), ...args],
      cwd: REPO_ROOT,
      env: opts.env ?? {}, // 只传增量：运行时自带清洗后的父环境基线，勿展开 ...process.env
      graceMs: opts.graceMs ?? 3000,
      stdio: {
        stdin: opts.stdinData !== undefined ? { data: opts.stdinData } : 'ignore',
        stdout: { maxBytes: opts.maxBytes ?? 2_000_000 },
        stderr: { maxBytes: opts.maxBytes ?? 2_000_000 },
      },
    })
  } catch (err) {
    return { exitCode: 2, stdout: '', stderr: `❌ 无法启动脚本（python 是否在 PATH？）: ${err?.message ?? err}` }
  }
  const { exitCode } = await handle.done
  return {
    exitCode: exitCode ?? 1,
    stdout: (handle.collected?.stdout?.readFrom(0)?.text ?? '').trim(),
    stderr: (handle.collected?.stderr?.readFrom(0)?.text ?? '').trim(),
```

</details>

**依据 4 · 源码核查**：[skills/gzhflow/SKILL.md:6-17](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/skills/gzhflow/SKILL.md#L6-L17)

配置/state/产物位置约定。

<details>
<summary>查看原文（12行）</summary>

```text
tags: [wechat, 公众号, content-publishing, workflow, cross-agent]
---

# gzhflow 主编排 — 微信公众号内容发布工作流

> 本文件是工作流的**唯一权威编排**。任何 Agent（Claude Code / Cursor / Codex / Gemini CLI / Qwen Code / DeepSeek / Hermes 等）按此执行。用户给主题后，按顺序走完七个阶段，每阶段读完对应 `prompts/` 文件、跑完对应质检门、输出给用户审阅后再进下一阶段。

## 0. 启动前必读（每次会话第一件事）

1. **读 `state.md`**（仓库根目录）：当前这篇写到哪了、待办、会话交接备注。
   用户在多个 Agent 之间切换，没有这个文件，上一个会话的上下文就断了——
   你会把已经问过的问题再问一遍。
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 凭据、路径、副作用和恢复怎样？

**研究主题**：工程质量与复用

#### 完整回答

包装器以argv数组而非拼shell命令执行，凭据作为子进程增量env传入，不放发布命令行参数，这是可借鉴接线。stdout/stderr各2MB收集与graceMs是局部参数，不是整个流程deadline或图片/文章大小保证；runScript await handle.done没有自己的timeout/cancel绑定，具体策略依宿主subprocess。所有脚本cwd固定包根，用户稿件相对路径也相对包根，需明确输出位置；工具没有独立工作区realpath围栏，不能把“经subprocess”自动等同沙箱已验收。

真实推送依次取token、上传正文本地图片、封面，再draft/add。HTML相对图路径以HTML目录解析，缺图只是warn保留原路径，dry-run没扫所有本地图片。上传成功后最终草稿失败会留下远端素材，重跑可重复上传/建草稿；没有事务、幂等key或断点收据文件。网络超时不能断言远端未创建，media_id只在成功stdout显示，读者需要后台核对后再决定重试。

图生把key送配置base_url，并可下载接口返回url，地址选择属于信任边界。错误会回显部分第三方响应，不应认为完全无敏感日志。state/四库/复盘依文本约定，无并发锁/版本；不同Agent同时编辑可能互覆盖，反思回写是模型生成经验，非独立证据。工程强项为脚本职责分离和可本地预览，可靠出版还需具体版本/材料与副作用收据。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-preset/tools/gzhflow-tools.mjs:86-110](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/dsh-preset/tools/gzhflow-tools.mjs#L86-L110)

argv、env、收集与await。

<details>
<summary>查看原文（25行）</summary>

```text
  let handle
  try {
    handle = ctx.subprocess.spawn({
      argv: [opts.python ?? 'python', join(SCRIPTS_DIR, script), ...args],
      cwd: REPO_ROOT,
      env: opts.env ?? {}, // 只传增量：运行时自带清洗后的父环境基线，勿展开 ...process.env
      graceMs: opts.graceMs ?? 3000,
      stdio: {
        stdin: opts.stdinData !== undefined ? { data: opts.stdinData } : 'ignore',
        stdout: { maxBytes: opts.maxBytes ?? 2_000_000 },
        stderr: { maxBytes: opts.maxBytes ?? 2_000_000 },
      },
    })
  } catch (err) {
    return { exitCode: 2, stdout: '', stderr: `❌ 无法启动脚本（python 是否在 PATH？）: ${err?.message ?? err}` }
  }
  const { exitCode } = await handle.done
  return {
    exitCode: exitCode ?? 1,
    stdout: (handle.collected?.stdout?.readFrom(0)?.text ?? '').trim(),
    stderr: (handle.collected?.stderr?.readFrom(0)?.text ?? '').trim(),
  }
}

/** 统一结果包装：脚本返回 → 工具返回。 */
```

</details>

**依据 2 · 源码核查**：[dsh-preset/tools/gzhflow-tools.mjs:303-311](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/dsh-preset/tools/gzhflow-tools.mjs#L303-L311)

凭据仅增量env，不在argv。

```text
        const appId = await read('WECHAT_APP_ID')
        const appSecret = await read('WECHAT_APP_SECRET')
        if (!appId || !appSecret) {
          return { exit_code: 2, output: '', stderr: '❌ 未配置公众号凭证：请编辑 ~/.dsh/.credentials.yaml 添加 WECHAT_APP_ID 与 WECHAT_APP_SECRET（详见 dsh-preset/README.md「凭证」）' }
        }
        env.WECHAT_APP_ID = appId
        env.WECHAT_APP_SECRET = appSecret
      }
      const r = await runScript(ctx, 'publish_draft.py', argv, { env, python: pythonBin })
```

**依据 3 · 源码核查**：[scripts/publish_draft.py:168-181](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/scripts/publish_draft.py#L168-L181)

逐图上传、缺失仅warn。

<details>
<summary>查看原文（14行）</summary>

```text
def upload_html_images(token: str, html_text: str, base_dir: Path) -> str:
    """扫描 HTML 中的本地图片，上传并重写为 https URL。"""
    def _replace(m):
        src = m.group(1)
        if src.startswith(("http://", "https://", "data:")):
            return m.group(0)
        p = base_dir / src
        if not p.exists():
            print(f"⚠️ 图片不存在，保留原路径: {src}", file=sys.stderr)
            return m.group(0)
        url = upload_image(token, p)
        print(f"  ↳ 上传图片 {src} → {url[:60]}…")
        return f'src="{url}"'
    return re.sub(r'src="([^"]+)"', _replace, html_text)
```

</details>

**依据 4 · 源码核查**：[scripts/publish_draft.py:279-315](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/scripts/publish_draft.py#L279-L315)

顺序副作用与仅成功打印media_id。

<details>
<summary>查看原文（37行）</summary>

```text
    app_id, app_secret = load_credentials(args)
    token = get_token(app_id, app_secret)
    print("✅ 已获取 access_token")

    # 上传正文图片并重写
    html_remote = upload_html_images(token, html_text, html_path.parent)
    if html_remote != html_text:
        print("✅ 正文图片已上传并重写为 https URL")

    # 上传封面（material/add_material 永久素材，个人订阅号实测可用，2026-10-13；
    # 上传失败直接退出——没有 thumb_media_id 的草稿 draft/add 也会被拒 40007）
    cover_media_id = upload_cover(token, cover)
    print(f"✅ 封面已上传: {cover_media_id}")

    # 摘要兜底：截取正文前 120 字
    if not summary:
        text_only = re.sub(r"<[^>]+>", "", html_remote)
        summary = re.sub(r"\s+", "", text_only)[:120]

    # 创建草稿
    article = {
        "title": title,
        "author": author or "",
        "digest": summary,
        "content": html_remote,
        "content_source_url": "",
        "need_open_comment": 1 if pub_cfg["open_comment"] else 0,
    }
    if cover_media_id:
        article["thumb_media_id"] = cover_media_id
    resp = api_post(f"{API_BASE}/cgi-bin/draft/add?access_token={token}", {"articles": [article]})
    if "media_id" in resp:
        print(f"✅ 已推送到草稿箱: {resp['media_id']}")
        print("   请在「公众号助手 App → 草稿箱」检查后手动发布（个人号无法 API 直接发布）")
        sys.exit(0)
    _die_wechat_error(resp, "创建草稿")

```

</details>

**依据 5 · 源码核查**：[scripts/generate_image.py:325-364](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/scripts/generate_image.py#L325-L364)

key到backend与返回URL下载/错误。

<details>
<summary>查看原文（40行）</summary>

```text
            files.append(("image[]", rp.name, rp.read_bytes()))
        body, ctype = _multipart(fields, files)
        url = "%s/images/edits" % backend["base_url"]
    else:
        body = json.dumps(fields).encode("utf-8")
        ctype = "application/json"
        url = "%s/images/generations" % backend["base_url"]

    req = urllib.request.Request(
        url, data=body,
        headers={"Content-Type": ctype, "Authorization": "Bearer %s" % backend["api_key"]})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            resp = json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")[:300]
        raise RuntimeError("HTTP %d: %s" % (e.code, detail))
    except urllib.error.URLError as e:
        raise RuntimeError("网络错误: %s" % e.reason)

    if isinstance(resp, dict) and "error" in resp:
        raise RuntimeError("接口返回错误: %s" % resp["error"])
    data = (resp or {}).get("data") or []
    if not data:
        raise RuntimeError("响应无 data 字段: %s" % str(resp)[:200])

    saved = []
    for i, item in enumerate(data[:max(1, n)]):
        p = out.with_name("%s_%d%s" % (out.stem, i + 1, out.suffix or ".png")) if n > 1 else out
        if item.get("b64_json"):
            b64 = item["b64_json"]
            if isinstance(b64, list):
                b64 = "".join(b64)
            p.write_bytes(base64.b64decode(b64))
        elif item.get("url"):
            try:
                with urllib.request.urlopen(item["url"], timeout=timeout) as ir:
                    p.write_bytes(ir.read())
            except (urllib.error.HTTPError, urllib.error.URLError) as e:
                raise RuntimeError("下载图片失败 %s: %s" % (item["url"][:60], e))
```

</details>

**依据 6 · 源码核查**：[skills/gzhflow/SKILL.md:6-17](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/skills/gzhflow/SKILL.md#L6-L17)

state/产物/审核依文档约定。

<details>
<summary>查看原文（12行）</summary>

```text
tags: [wechat, 公众号, content-publishing, workflow, cross-agent]
---

# gzhflow 主编排 — 微信公众号内容发布工作流

> 本文件是工作流的**唯一权威编排**。任何 Agent（Claude Code / Cursor / Codex / Gemini CLI / Qwen Code / DeepSeek / Hermes 等）按此执行。用户给主题后，按顺序走完七个阶段，每阶段读完对应 `prompts/` 文件、跑完对应质检门、输出给用户审阅后再进下一阶段。

## 0. 启动前必读（每次会话第一件事）

1. **读 `state.md`**（仓库根目录）：当前这篇写到哪了、待办、会话交接备注。
   用户在多个 Agent 之间切换，没有这个文件，上一个会话的上下文就断了——
   你会把已经问过的问题再问一遍。
```

</details>

#### 缺口

- 宿主subprocess隔离/取消以及远端超时后的真实状态未核查。
  **影响**：不能保证任务路径围栏、取消即停止或失败无远端副作用。
  **进一步探讨**：沿宿主执行契约核对后，可用本地假API序列模拟上传成功/草稿未知，检查收据和重试次数。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本、采用与未来假设如何判断？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主/Python、素材/配置与接口接入 | 填个人四库、核文风/主题和凭据 | 包装配置缺陷增加排错 |
| 持续使用 | 写作/重写/多视角模型、可选图生、文件与上传 | 素材核查、全文审阅、视觉和排版检查 | 七阶段调用/轮数取决于Agent，未测净token/时间 |
| 失败恢复 | 留本地稿/HTML/图片，远端素材核对 | 查首次上传/草稿是否成功，避免重复副作用 | 无持久幂等收据或原子发布 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 流程复用 | 七阶段Skill、独立脚本与DSH包装 | 任意Agent完全遵守门禁 |
| 去AI味 | 确定性特征与FAIL/WARN | 人类偏好、真实性和通用检测率 |
| 生产 | HTML/图生/草稿脚本 | 正常配置下当前包装图生可用性 |
| 发布 | 本地dry-run与顺序API路径 | 当前账号权限、真实草稿成功及幂等 |

建议观察。适合愿意维护个人素材和人工审阅的作者，流程与脚本组合有用；但图生backend reader阻断、check_env与publish凭据路径不同、质量门只在提示词层，使“安装即完整跑”不能成立。继续探讨可先读普通配置解析与本地stub门，再拿固定稿件比较事实保真/人工返工，最后单独验证具体草稿副作用。

未验证假设是阶段产物内容hash加可复用质检收据，发布工具只接收读者已确认的具体版本，图生/上传/草稿分别保存attempt与远端ID，未知结果先查询而非重做。相较当前文档门和stdout回报，可能减少绕门、版本漂移和重复上传；代价是阶段状态迁移及额外审核。最小对照固定稿件、改稿后复用旧PASS、上传后超时和重复调用序列，比较错版推送/重复数、恢复工时与总调用；若流程阻力更大但错误没减少，则不支持。未实现，不计已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-preset/tools/gzhflow-tools.mjs:48-66](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/dsh-preset/tools/gzhflow-tools.mjs#L48-L66)

reader阻断决定当前采用。

<details>
<summary>查看原文（19行）</summary>

```text
function readImageBackendConfig() {
  const cfgPath = join(REPO_ROOT, 'config', 'workflow.yaml')
  let text
  try {
    text = readFileSync(cfgPath, 'utf8')
  } catch {
    return {}
  }
  const out = {}
  let inBackend = false
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    if (/^image_backend\s*:/.test(trimmed)) { inBackend = true; continue }
    if (/^\S/.test(trimmed)) inBackend = false // 顶层新键，退出 image_backend 段
    if (!inBackend) continue
    const m = /^(base_url|model|api_key_env)\s*:\s*"?([^"\s]+)"?/.exec(trimmed)
    if (m) out[m[1]] = m[2]
  }
```

</details>

**依据 2 · 源码核查**：[dsh-preset/tools/gzhflow-tools.mjs:277-312](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/dsh-preset/tools/gzhflow-tools.mjs#L277-L312)

publish独立调用，无前门收据。

<details>
<summary>查看原文（36行）</summary>

```text
  registerTool({
    name: 'gzhflow_publish_draft',
    description: 'gzhflow 推草稿箱（publish_draft.py，微信官方 API）。凭证从 DSH 凭据存储读取（WECHAT_APP_ID / WECHAT_APP_SECRET），经 env 注入，不进命令行参数。建议先 dry_run=true 验证。',
    parameters: {
      html: { type: 'string', required: true, description: '排版 HTML 路径' },
      title: { type: 'string', required: true, description: '文章标题' },
      author: { type: 'string', description: '作者（默认 frontmatter > config > 空）' },
      summary: { type: 'string', description: '摘要（默认截取正文前 120 字）' },
      cover: { type: 'string', description: '封面图路径（默认读 frontmatter coverImage）' },
      dry_run: { type: 'boolean', description: 'true=只验证不推送（不取 token）' },
    },
    output: { schema: { type: 'object' }, render: (_a, v) => [{ type: 'text', text: JSON.stringify(v, null, 2) }] },
    async execute(args) {
      const argv = [args.html, '--title', args.title]
      if (args.author) argv.push('--author', args.author)
      if (args.summary) argv.push('--summary', args.summary)
      if (args.cover) argv.push('--cover', args.cover)
      if (args.dry_run) argv.push('--dry-run')
      const env = {}
      if (!args.dry_run) {
        // dry_run 免凭证（与脚本一致：dry-run 在 load_credentials 前返回）
        const credentials = ctx.get('credentials')
        const read = async (ref) => {
          const res = credentials ? await credentials.resolve(ref) : undefined
          return res?.value
        }
        const appId = await read('WECHAT_APP_ID')
        const appSecret = await read('WECHAT_APP_SECRET')
        if (!appId || !appSecret) {
          return { exit_code: 2, output: '', stderr: '❌ 未配置公众号凭证：请编辑 ~/.dsh/.credentials.yaml 添加 WECHAT_APP_ID 与 WECHAT_APP_SECRET（详见 dsh-preset/README.md「凭证」）' }
        }
        env.WECHAT_APP_ID = appId
        env.WECHAT_APP_SECRET = appSecret
      }
      const r = await runScript(ctx, 'publish_draft.py', argv, { env, python: pythonBin })
      return wrap(r)
```

</details>

**依据 3 · 源码核查**：[scripts/publish_draft.py:279-315](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/scripts/publish_draft.py#L279-L315)

副作用和成功ID是持久收据设计起点。

<details>
<summary>查看原文（37行）</summary>

```text
    app_id, app_secret = load_credentials(args)
    token = get_token(app_id, app_secret)
    print("✅ 已获取 access_token")

    # 上传正文图片并重写
    html_remote = upload_html_images(token, html_text, html_path.parent)
    if html_remote != html_text:
        print("✅ 正文图片已上传并重写为 https URL")

    # 上传封面（material/add_material 永久素材，个人订阅号实测可用，2026-10-13；
    # 上传失败直接退出——没有 thumb_media_id 的草稿 draft/add 也会被拒 40007）
    cover_media_id = upload_cover(token, cover)
    print(f"✅ 封面已上传: {cover_media_id}")

    # 摘要兜底：截取正文前 120 字
    if not summary:
        text_only = re.sub(r"<[^>]+>", "", html_remote)
        summary = re.sub(r"\s+", "", text_only)[:120]

    # 创建草稿
    article = {
        "title": title,
        "author": author or "",
        "digest": summary,
        "content": html_remote,
        "content_source_url": "",
        "need_open_comment": 1 if pub_cfg["open_comment"] else 0,
    }
    if cover_media_id:
        article["thumb_media_id"] = cover_media_id
    resp = api_post(f"{API_BASE}/cgi-bin/draft/add?access_token={token}", {"articles": [article]})
    if "media_id" in resp:
        print(f"✅ 已推送到草稿箱: {resp['media_id']}")
        print("   请在「公众号助手 App → 草稿箱」检查后手动发布（个人号无法 API 直接发布）")
        sys.exit(0)
    _die_wechat_error(resp, "创建草稿")

```

</details>

**依据 4 · 源码核查**：[skills/gzhflow/SKILL.md:17-35](https://github.com/Andiii208/gzhflow/blob/3702335770e30ebccc3790556d53aa14c30046f2/skills/gzhflow/SKILL.md#L17-L35)

七阶段门是编排约定。

<details>
<summary>查看原文（19行）</summary>

```text
   你会把已经问过的问题再问一遍。
   **这个文件被 gitignore（含个人进度），clone 下来没有是正常的**，按 SKILL.md 从阶段① 起即可。
2. **配置**：确认 `config/workflow.yaml`、`config/styles.yaml`、`config/themes.yaml`、`config/publish.yaml` 存在（不存在则从 `*.example.yaml` 复制，并让用户确认配置）。
3. **产物目录**：所有产物（草稿 md、HTML、图片）写入 `config/workflow.yaml` 的 `output_dir`（默认 `generated/`，已 gitignore）。
4. **审核模式**：默认 `strict`——每个阶段输出都给用户审阅；用户明确说「直接做/不用审阅」才切 `auto` 全自动。
   全自动时按 `prompts/00-run.md` 的 Run 规范执行（零提问 + 决策日志 + 轮次封顶），
   并**强提醒用户中途不要等**——Run 会一次跑完再交付。

## 1. 七阶段总览

| 阶段 | 提示词 | 质检门 | 产物 |
|---|---|---|---|
| ① 素材先行 | `prompts/01-material.md` | 意图三问（写给谁/什么感觉/为什么今天） | 素材锚点清单 |
| ② 写作 | `prompts/02-writing.md` | `scripts/ai_flavor_score.py` + 自检四问 | `draft.md`（frontmatter + 正文） |
| ③ 去AI味 | `prompts/03-deai.md` | `scripts/ai_flavor_score.py` 复检（FAIL 清零） | 定稿 `draft.md` |
| ④ 配图（可选） | `prompts/04-images.md` | `scripts/check_image_prompt.py`（PASS 才生成）→ `scripts/image_batch.py --plan-only`（过预算） | `cover.jpg` + 内文图 + 预算单 |
| ⑤ 排版 | `prompts/05-layout.md` | `scripts/validate_gzh_html.py`（0 ERROR） | `{标题}_排版_{主题}.html` |
| ⑥ 发布 | `prompts/06-publish.md` | `scripts/publish_draft.py --dry-run` 先验 | 草稿箱草稿 |
| ⑦ 复盘 | `prompts/07-review.md` | 每次手改记一笔；每 5 篇回写一次 | `assets/log.md` + `assets/learned-edits.md` + 回写各库 |
```

</details>

#### 缺口

- 没有同稿件手工/其它工具与gzhflow的事实质量、风格和恢复总成本对照。
  **影响**：不能量化省时、去AI味效果或真实读者收益。
  **进一步探讨**：固定稿件/作者，盲评与记录人工改动、token、总时间及错误恢复。
- 版本化质检与发布收据方案未实现。
  **影响**：不提升当前门禁和幂等保证。
  **进一步探讨**：比较改稿复用旧PASS、接口未知与重试序列，检查错版/重复及人工成本。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
