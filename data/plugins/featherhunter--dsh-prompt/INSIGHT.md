# dsh-prompt

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[64b35b8](https://github.com/FeatherHunter/dsh-prompt/tree/64b35b8300786882b5cbc9dc6b6cc532037caba8)

<!-- BEGIN META -->
[![GitHub ★ 96](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=96&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FeatherHunter/dsh-prompt) [![npm 30d 11,575](https://img.shields.io/static/v1?label=npm+30d&message=11%2C575&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-prompt) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-prompt)
<!-- END META -->

> **功能**：在 DSH 输入框提供模板浏览、筛选和自定义管理。

> **亮点**：[Q01](#research-q01) 频繁使用相似提示词的用户可从输入按钮或 /prompt 选择预置及自定义模板。触发器过滤候选，选择时找回模板正文并移除光标标记后返回文本。相比外部文档复制，模板查找在输入框内完成，最终发送仍由用户与宿主决定。

> **主要限制**：[Q02](#research-q02) Host bridge 以回环 Host、cross-site 和 Origin 限制请求，无 Origin 时允许。模板写入会持久化；固定 lib 还包含 Windows 屏幕方向更改及读回复原，因此权限面超过模板文本。客户端草稿镜像校验捕获和当前 sessionId，仍需测真实异步切换。

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
  - [Q01 · Prompt 插件怎样复用模板？](#detail-section-11)
  - [Q02 · 模板和系统操作边界是什么？](#detail-section-12)
  - [Q03 · 如何试用并清理？](#detail-section-13)
  - [Q04 · 怎样避免模板浮层晚到结果串入新会话？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：频繁复用提示模板的 DSH 用户。

从外部文档手工复制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模板 | 复用文本 | 用户审阅 |
| 管理 | 编辑持久模板 | 宿主权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH | 必需 | 输入和宿主 bridge | 手工复制 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 测试模板 | 备份配置 |
| 验证 | 插入和切会话 | 读回草稿 |
| 退出 | 删测试并禁用 | 检查设置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 资源未知 | 整理模板 | 未测 |
| 持续 | 维护时间未知 | 审阅正文 | 按任务 |
| 退出 | 恢复成本未知 | 清理配置 | 读回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模板 | 候选筛选与插入 | 时间节省 |
| 草稿 | 会话 ID 门 | 真实异步 |

> **思考**：[Q02](#research-q02) Host bridge 以回环 Host、cross-site 和 Origin 限制请求，无 Origin 时允许。模板写入会持久化；固定 lib 还包含 Windows 屏幕方向更改及读回复原，因此权限面超过模板文本。客户端草稿镜像校验捕获和当前 sessionId，仍需测真实异步切换。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 频繁使用相似提示词的用户可从输入按钮或 /prompt 选择预置及自定义模板。触发器过滤候选，选择时找回模板正文并移除光标标记后返回文本。相比外部文档复制，模板查找在输入框内完成，最终发送仍由用户与宿主决定。

[Q02](#research-q02) Host bridge 以回环 Host、cross-site 和 Origin 限制请求，无 Origin 时允许。模板写入会持久化；固定 lib 还包含 Windows 屏幕方向更改及读回复原，因此权限面超过模板文本。客户端草稿镜像校验捕获和当前 sessionId，仍需测真实异步切换。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) Host bridge 以回环 Host、cross-site 和 Origin 限制请求，无 Origin 时允许。模板写入会持久化；固定 lib 还包含 Windows 屏幕方向更改及读回复原，因此权限面超过模板文本。客户端草稿镜像校验捕获和当前 sessionId，仍需测真实异步切换。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在测试 profile 新建无敏感信息模板，验证筛选、插入、编辑和删除。模板文本进入后续模型请求时需审阅，直接复制节省尚未计量。退出时保留所需模板后禁用插件并清理测试配置，核对输入框及屏幕方向。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码及作者说明，未执行目标。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、src/client/prompt-trigger.ts、src/client/remote-draft.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定身份及其直接依赖的代表实现。
- 下一步：验证 Host 来源、系统方向和切会话。

**分析版本**

- **仓库**：[FeatherHunter/dsh-prompt](https://github.com/FeatherHunter/dsh-prompt)
- **版本号**：0.4.41（[固定提交 64b35b8](https://github.com/FeatherHunter/dsh-prompt/tree/64b35b8300786882b5cbc9dc6b6cc532037caba8)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 对照当前 session 校验，在异步选中、输入法组词和切换会话时延迟写回，用目标会话与用户当前草稿比对。若仍出现覆盖则在写入版本上增加条件；若没有则保留现有门。

验证 Host 来源、系统方向和切会话。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 84 | 11503 | — | — | 224075 |
| .js | source | 5 | 41275 | 39299 | 1923 | — |
| .mjs | source | 79 | 23813 | 19337 | 3020 | — |
| .cjs | source | 50 | 13877 | 11573 | 1658 | — |
| .mjs | example | 2 | 1385 | 1134 | 120 | — |
| .ts | source | 38 | 12633 | 9157 | 3211 | — |
| .mts | source | 1 | 300 | 244 | 37 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/FeatherHunter/dsh-prompt/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 67](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=67&color=737b86&logo=github)](https://github.com/FeatherHunter/dsh-prompt/issues?q=is%3Aissue+created%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z) [![近30天关闭 66](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=66&color=737b86&logo=github)](https://github.com/FeatherHunter/dsh-prompt/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话地图如何组织和传递上下文？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Prompt 插件怎样复用模板？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

频繁使用相似提示词的用户可从输入按钮或 /prompt 选择预置及自定义模板。触发器过滤候选，选择时找回模板正文并移除光标标记后返回文本。相比外部文档复制，模板查找在输入框内完成，最终发送仍由用户与宿主决定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:57-84](https://github.com/FeatherHunter/dsh-prompt/blob/64b35b8300786882b5cbc9dc6b6cc532037caba8/README.md#L57-L84)

作者说明双入口

<details>
<summary>查看原文（28行）</summary>

```text
## 入口一<br>Prompt 按钮

</div>

<div align="center">

鼠标移到输入框左侧的「Prompt」按钮，列表自动展开——官方预置模板和我们自定义的模板都能看到。

**👇 按钮一点，面板长这样。**

<img src="assets/readme/02-panel-button.png" width="640" alt="Prompt 按钮悬浮面板：范围与标签筛选、模板列表、底栏一键屏蔽预制模板" style="border:1px solid #30363d;border-radius:6px">

点底栏「屏蔽预制模板」，屏蔽官方预置Prompt；再点「展示预制模板」解除屏蔽。

不想鼠标划过就展开？点底栏「当前：悬浮触发」（或设置面板里的「触发方式」行右侧按钮），此后只有点击按钮才开合，鼠标偶然划过不再闪烁；按钮变成「当前：点击触发」即是已切过去，再点切回。

</div>

<div align="center">

## 入口二<br>/prompt 触发源

</div>

<div align="center">

只敲一个 `/` 不再列出模板，命令菜单保持干净；敲 `/prompt` 或者 `/p` 才看到全部模板。<br>
`/prompt` 后面继续输入可以缩小范围（如 `/prompt复盘`；不要加空格，宿主遇到空格会关掉菜单）。
```

</details>

**依据 2 · 源码核查**：[src/client/prompt-trigger.ts:44-82](https://github.com/FeatherHunter/dsh-prompt/blob/64b35b8300786882b5cbc9dc6b6cc532037caba8/src/client/prompt-trigger.ts#L44-L82)

过滤与正文返回

<details>
<summary>查看原文（39行）</summary>

```text
export function filterPromptTemplates(query: string): PromptTemplate[] {
  const trimmed = (query || '').trim()
  if (!trimmed) return []
  const lower = trimmed.toLowerCase()
  const sourceLower = SOURCE_NAME.toLowerCase()
  let keyword = trimmed
  if (lower.startsWith(sourceLower)) {
    keyword = trimmed.slice(SOURCE_NAME.length).trim()
  } else if (lower === 'p') {
    keyword = '' // 精确 /p = 全量别名，与 /prompt 同一条路径
  }
  if (!keyword) return sortedTemplates(allTemplates())
  const needle = keyword.toLowerCase()
  return sortedTemplates(allTemplates().filter((x) => matchLabel(x, keyword) || templateHaystack(x).indexOf(needle) >= 0))
}

/** /prompt 触发源（inputTriggers source 契约：candidates → onPick → {text} span 替换） */
export function buildPromptSource(): PromptTriggerSource {
  return {
    trigger: '/',
    name: SOURCE_NAME,
    order: 5, // '/' 分组内排在 command(0)、skill(2) 之后
    candidates: async (_projection, req) => {
      try { await ensureLoaded() } catch (e) { /* host 不可用时用内存默认 */ }
      // #142：描述行标签段走显示映射（逻辑过滤仍走 matchLabel 原值）；trigger 无 React 订阅面，
      // 按次 resolveLocale() 取 live 语言（candidates 每 query 调一次，切语言下次即翻；不新增裸 getLang）。
      return filterPromptTemplates(req.query).slice(0, MAX_ITEMS).map((t) => ({
        name: t.name,
        // #178：描述行取单行预览（剥标记 + 空白压成单空格），不显示 {{cursor}}、不出空首行。
        description: displayLabelString(t, resolveLocale()) + ' — ' + oneLinePreview(t.body).slice(0, 42),
        templateId: t.id,
      }))
    },
    onPick: (pick) => {
      const tpl = getTemplate(pick.candidate.templateId)
      if (!tpl) return undefined
      bumpUsage(tpl.id) // 与面板插入一致：用量仅排序不显示
      // #178 R2：斜杠管线只剥光标标记、不承诺光标落位（宿主替换 span 后光标由宿主定）。
      return { text: stripCursorMarkers(tpl.body).text }
```

</details>

#### 缺口

- 未运行宿主插入
  **影响**：选区和中文输入兼容未知
  **进一步探讨**：用合成模板核对插入与发送

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模板和系统操作边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Host bridge 以回环 Host、cross-site 和 Origin 限制请求，无 Origin 时允许。模板写入会持久化；固定 lib 还包含 Windows 屏幕方向更改及读回复原，因此权限面超过模板文本。客户端草稿镜像校验捕获和当前 sessionId，仍需测真实异步切换。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:682-698](https://github.com/FeatherHunter/dsh-prompt/blob/64b35b8300786882b5cbc9dc6b6cc532037caba8/lib/index.js#L682-L698)

来源围栏

<details>
<summary>查看原文（17行）</summary>

```text
/** 最小同源围栏（loopback 必须，cross-site 拒绝，origin 需同 host）。 */
function isAllowed(req) {
  try {
    const host = req.headers?.host;
    const hostValue = Array.isArray(host) ? host[0] : host;
    if (!hostValue) return false;
    if (!isLoopbackHostValue(hostValue)) return false;
    const site = req.headers?.["sec-fetch-site"];
    const siteValue = Array.isArray(site) ? site[0] : site;
    if (siteValue === "cross-site") return false;
    const origin = req.headers?.origin;
    const originValue = Array.isArray(origin) ? origin[0] : origin;
    if (originValue === undefined) return true;
    return new URL(originValue).host.toLowerCase() === String(hostValue).trim().toLowerCase();
  } catch (e) {
    return false;
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:974-983](https://github.com/FeatherHunter/dsh-prompt/blob/64b35b8300786882b5cbc9dc6b6cc532037caba8/lib/index.js#L974-L983)

模板保存及删除

<details>
<summary>查看原文（10行）</summary>

```text
      if (method === "POST" && path === "/_dsh/dsh-prompt/customs/put") {
        const body = await readJsonBody(req);
        const saved = await store.putCustom(body?.template ?? body);
        writeJson(res, { ok: true, value: saved });
        return;
      }
      if (method === "POST" && path === "/_dsh/dsh-prompt/customs/delete") {
        const body = await readJsonBody(req);
        const done = await store.deleteCustom(body?.id);
        writeJson(res, { ok: true, value: done });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:920-941](https://github.com/FeatherHunter/dsh-prompt/blob/64b35b8300786882b5cbc9dc6b6cc532037caba8/lib/index.js#L920-L941)

系统方向更改和回读

<details>
<summary>查看原文（22行）</summary>

```text
async function changeOsOrientation(target) {
  if (globalThis.process?.platform !== "win32") throw orientErr("unsupported", "orientation-non-windows");
  if (target !== "landscape" && target !== "portrait") throw orientErr("unknown", "orientation-invalid-target");
  const before = await queryOsOrientation();
  if (before.orientation === target) return { ...before, changed: false };
  const dmdo = ORIENT_TO_DMDO[target];
  // 竖↔横切换必须对调宽高：当前横屏(w>h)要去竖屏，或当前竖屏要去横屏 → 对调
  const needSwap = (before.width > before.height) === (target === "portrait");
  const exe = await resolvePowershellExe();
  const env = { DSH_ORIENT_CS: ORIENT_CS };
  const setRun = await runPowershell(exe, buildSetScript(before.device, dmdo, needSwap), env);
  const setResult = mapApplyFailure(setRun.out, setRun.err, setRun.code);
  if (setResult instanceof Error) throw setResult;
  const got = orientLandscapeOf(setResult.orientation);
  if (got !== target || setResult.width !== (needSwap ? before.height : before.width)) {
    // 复读不一致 → 用同一构造回滚一次到 before
    const needSwapBack = (setResult.width > setResult.height) === (orientLandscapeOf(before.raw) === "portrait");
    await runPowershell(exe, buildSetScript(before.device, before.raw, needSwapBack), env).catch(() => null);
    const cur = await queryOsOrientation().catch(() => null);
    throw orientErr("unknown", "orientation-verify-mismatch" + (cur ? " (current:" + cur.orientation + ")" : ""));
  }
  return { device: before.device, orientation: got, raw: setResult.orientation, width: setResult.width, height: setResult.height, changed: true };
```

</details>

**依据 4 · 源码核查**：[src/client/remote-draft.ts:81-97](https://github.com/FeatherHunter/dsh-prompt/blob/64b35b8300786882b5cbc9dc6b6cc532037caba8/src/client/remote-draft.ts#L81-L97)

会话写入门

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * 写前 session 校验＋isComposing 门（119 约束的镜面投影）。
 * - captured 为 open 瞬间钉死的 sessionId，current 为写瞬间现值；
 * - 两者非空且相等才写（防 stale actions 跨会话串写）；
 * - 组词中只收不发（compositionend 收敛后由调用方重放队尾）。
 */
export function shouldWriteMirror(
  capturedSessionId: unknown,
  currentSessionId: unknown,
  isComposing: unknown,
): boolean {
  try {
    if (isComposing === true) return false;
    if (typeof capturedSessionId !== 'string' || capturedSessionId === '') return false;
    if (typeof currentSessionId !== 'string' || currentSessionId === '') return false;
    return capturedSessionId === currentSessionId;
  } catch (e) { return false; }
```

</details>

#### 缺口

- 宿主外层认证和系统方向入口审批未知
  **影响**：不能保证任意本机进程不可改设置
  **进一步探讨**：合成 profile 测来源、切会话与方向入口

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用并清理？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在测试 profile 新建无敏感信息模板，验证筛选、插入、编辑和删除。模板文本进入后续模型请求时需审阅，直接复制节省尚未计量。退出时保留所需模板后禁用插件并清理测试配置，核对输入框及屏幕方向。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-43](https://github.com/FeatherHunter/dsh-prompt/blob/64b35b8300786882b5cbc9dc6b6cc532037caba8/README.md#L20-L43)

安装 profile

<details>
<summary>查看原文（24行）</summary>

````text
## 安装 <sub>INSTALL</sub>

</div>

<div align="center">

前置要求：[DSH](https://www.npmjs.com/package/@deepseek-ai/dsh)（DeepSeek Harness）。

</div>

```bash
# ① 安装 DSH CLI（已装跳过）
npm install -g @deepseek-ai/dsh

# ② 安装 dsh-prompt —— --profile 必填：装进你实际使用的 DSH 入口对应的 profile
#    （装错 profile 等于没装，重启多少次都不会加载）
dsh plugin --profile web add dsh-prompt     # 用自启 web 服务（dsh web）
#     或者
dsh plugin --profile desktop add dsh-prompt   # 用 DSH Desktop 桌面应用
# 锁定最新版更稳（当前 0.4.41）：
dsh plugin --profile web add dsh-prompt@0.4.41 --registry https://registry.npmjs.org
#     或者
dsh plugin --profile desktop add dsh-prompt@0.4.41 --registry https://registry.npmjs.org
```
````

</details>

**依据 2 · 作者声明**：[README.md:108-131](https://github.com/FeatherHunter/dsh-prompt/blob/64b35b8300786882b5cbc9dc6b6cc532037caba8/README.md#L108-L131)

模板管理

<details>
<summary>查看原文（24行）</summary>

```text
## 自定义与管理<br>CUSTOM

</div>

<div align="center">

**👇 新增自定义Prompt提示词模板：名称、标签、文字颜色、正文 全部可以DIY。**

<img src="assets/readme/06-custom-manage.png" width="560" alt="自定义管理：新增自定义模板弹窗（名称、标签、文字颜色、正文）" style="border:1px solid #30363d;border-radius:6px">

正文会按你写的原样保留：换行都在，包括开头和结尾的空行（只忽略首尾的空格与制表符）。想让插入后的光标停在指定位置，就在正文里放 `{{cursor}}`——只认第一个，其余会被删掉。不带标记时，光标落在插入文本之后；`/prompt` 斜杠插入只去掉标记、不移动光标。插入后按一次撤销，可能先撤销「落光标」那一步（会看到标记文本回来），再按一次才撤销插入。另外，字面 `{{cursor}}` 这串字符本身暂时无法表达——把它写进正文，它就会被当作光标标记。

**👇 文字颜色可以修改，支持文字描边。**

<img src="assets/readme/07-custom-manage-color.png" width="560" alt="文字颜色浮层：60 色可选、默认跟随主题、文字描边开关" style="border:1px solid #30363d;border-radius:6px">

**👇 自定义提示词：可配置文字颜色。**

<img src="assets/readme/02-panel-button-only-custom.png" width="640" alt="Prompt 按钮悬浮面板：预制模板已收起，只显示自定义模板" style="border:1px solid #30363d;border-radius:6px">

</div>

<!-- MORE-START -->
<div align="center">
```

</details>

**依据 3 · 源码核查**：[lib/index.js:974-983](https://github.com/FeatherHunter/dsh-prompt/blob/64b35b8300786882b5cbc9dc6b6cc532037caba8/lib/index.js#L974-L983)

持久删除

<details>
<summary>查看原文（10行）</summary>

```text
      if (method === "POST" && path === "/_dsh/dsh-prompt/customs/put") {
        const body = await readJsonBody(req);
        const saved = await store.putCustom(body?.template ?? body);
        writeJson(res, { ok: true, value: saved });
        return;
      }
      if (method === "POST" && path === "/_dsh/dsh-prompt/customs/delete") {
        const body = await readJsonBody(req);
        const done = await store.deleteCustom(body?.id);
        writeJson(res, { ok: true, value: done });
```

</details>

#### 缺口

- 未运行或验证退出
  **影响**：维护及恢复成本未知
  **进一步探讨**：记录插入结果和设置前后差异

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样避免模板浮层晚到结果串入新会话？

**研究主题**：新假设与验证

#### 完整回答

对照当前 session 校验，在异步选中、输入法组词和切换会话时延迟写回，用目标会话与用户当前草稿比对。若仍出现覆盖则在写入版本上增加条件；若没有则保留现有门。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/remote-draft.ts:81-97](https://github.com/FeatherHunter/dsh-prompt/blob/64b35b8300786882b5cbc9dc6b6cc532037caba8/src/client/remote-draft.ts#L81-L97)

现有门

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * 写前 session 校验＋isComposing 门（119 约束的镜面投影）。
 * - captured 为 open 瞬间钉死的 sessionId，current 为写瞬间现值；
 * - 两者非空且相等才写（防 stale actions 跨会话串写）；
 * - 组词中只收不发（compositionend 收敛后由调用方重放队尾）。
 */
export function shouldWriteMirror(
  capturedSessionId: unknown,
  currentSessionId: unknown,
  isComposing: unknown,
): boolean {
  try {
    if (isComposing === true) return false;
    if (typeof capturedSessionId !== 'string' || capturedSessionId === '') return false;
    if (typeof currentSessionId !== 'string' || currentSessionId === '') return false;
    return capturedSessionId === currentSessionId;
  } catch (e) { return false; }
```

</details>

**依据 2 · 源码核查**：[src/client/prompt-trigger.ts:77-82](https://github.com/FeatherHunter/dsh-prompt/blob/64b35b8300786882b5cbc9dc6b6cc532037caba8/src/client/prompt-trigger.ts#L77-L82)

模板正文返回

```text
    onPick: (pick) => {
      const tpl = getTemplate(pick.candidate.templateId)
      if (!tpl) return undefined
      bumpUsage(tpl.id) // 与面板插入一致：用量仅排序不显示
      // #178 R2：斜杠管线只剥光标标记、不承诺光标落位（宿主替换 span 后光标由宿主定）。
      return { text: stripCursorMarkers(tpl.body).text }
```

#### 缺口

- 完整浮层异步链未运行
  **影响**：可能已有等价防护
  **进一步探讨**：构造延迟和切换序列

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
