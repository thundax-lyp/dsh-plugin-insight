# dsh-chatgpt-style

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[fe4f23b](https://github.com/137/dsh-chatgpt-style/tree/fe4f23bed4bec14ad01577050eaacdc0893f57d9)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：调整 DSH 对话与侧栏样式、标注语义文字，并添加思考/快速模型档位切换。

> **核心亮点**：组合 CSS 视觉层级、语义标记和宿主模型目录快捷入口，使阅读及选档操作更集中；底层模型档位仍属宿主/provider。详见[Q01](#research-q01)。

> **风险与缺陷**：标注会替换文本节点并移除标记/表情，但 dispose 不恢复；模型档位按 id 匹配未限制 provider，作者“关闭即原样”与快捷选择精度均有边界。详见[Q03](#research-q03)。

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
  - [Q01 · 谁用这个样式层，新增价值与已有宿主能力怎样区分？](#detail-section-11)
  - [Q02 · 语义标注如何避免流式损坏、代码块误改与重复套娃？](#detail-section-12)
  - [Q03 · 关闭插件是否恢复原文，推理档位切换有哪些语义边界？](#detail-section-13)
  - [Q04 · 安装、持续维护与失败恢复分别依赖什么？](#detail-section-14)
  - [Q05 · 什么最小改进可保留可逆性与多模型准确性，当前能否采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供偏好更明显消息层级和快捷档位切换的 DSH Web 用户；合格交付需内容与模型状态正确。详见[Q01](#research-q01)。

宿主默认 UI/模型菜单已能读消息和选择档位；本插件须证明可读性和选档效率提升且不会改变内容或选错模型。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 样式主题 | 提高对话视觉层级 | 宿主类名/语义属性变化可失效 |
| 语义标注 | 行首和行内重点提示 | 消费原标记，卸载不恢复原 DOM |
| 推理切换 | 少开一层模型菜单 | 需 provider 档位，匹配未限定 provider |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 客户端与稳定 DOM 属性 | 必需 | 样式/扫描锚点 | 可能静默失效 |
| modelDirectories | 切换必需 | 读/写当前档位 | 胶囊不工作 |
| provider reasoning.efforts | 显示档位必需 | 快速/思考选项 | 胶囊隐藏 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装 | 在目标 profile 装私有包并重启 | 样式和胶囊实际可见 |
| 阅读 | 仅对已完成消息应用语义标记 | 流式原文不受影响 |
| 切换 | 核 provider/model 后点击胶囊 | 宿主目录显示目标档位 |
| 卸载 | 停用并刷新被改内容 | 不依赖已消费标记自动恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH GUI 与可声明档位的 provider，金额未知 | 安装、重启、核模型目录；耗时未知 | private 包取得性未核 |
| 持续使用 | 浏览器扫描/样式资源；数量未知 | 适配宿主 DOM/主题变化；耗时未知 | 选择器变更可静默失效 |
| 失败恢复 | 误选档费用/内容恢复风险；金额未知 | 卸载后刷新或重载消息、回宿主原生选档；耗时未知 | 当前 dispose 不逆转文本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 视觉层级 | CSS/角色/侧栏样式 | 真实主题、可访问性和效率 |
| 标注 | 代码/流式跳过与文本节点转换 | React 全生命周期与卸载恢复 |
| 档位快捷切换 | modelDirectories select 接线 | 同名跨 provider 及更多档位正确性 |

> **思考**：标注会替换文本节点并移除标记/表情，但 dispose 不恢复；模型档位按 id 匹配未限制 provider，作者“关闭即原样”与快捷选择精度均有边界。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：组合 CSS 视觉层级、语义标记和宿主模型目录快捷入口，使阅读及选档操作更集中；底层模型档位仍属宿主/provider。详见[Q01](#research-q01)。

组合 CSS 视觉层级、语义标记和宿主模型目录快捷入口，使阅读及选档操作更集中；底层模型档位仍属宿主/provider。详见[Q01](#research-q01)。

流式 data-streaming 保护、textContent 安全插入和帧合并值得借鉴；应补 DOM 可逆性与准确路由。详见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

标注会替换文本节点并移除标记/表情，但 dispose 不恢复；模型档位按 id 匹配未限制 provider，作者“关闭即原样”与快捷选择精度均有边界。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

限本机非关键 UI 观察，选档仍核宿主当前模型与计费；待可逆卸载和同名模型修正后再扩大使用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认样式/标注/目录切换；卸载不恢复被消费的正文标记、档位查找未同时匹配 provider，真实宿主未验证。改进为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、client.js、test/semantic.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、Client/Host、package 与作者假 DOM 测试；未执行目标测试或真实 Web/Desktop/模型切换；旧 META 仅复用。
- 下一步：目标 Web/Desktop 上测流式长消息、编辑、主题、卸载不刷新、同名跨 provider 模型及多档位选择，对比原文和宿主目录状态。

**分析版本**

- **仓库**：[137/dsh-chatgpt-style](https://github.com/137/dsh-chatgpt-style)
- **版本号**：0.1.0（[固定提交 fe4f23b](https://github.com/137/dsh-chatgpt-style/tree/fe4f23bed4bec14ad01577050eaacdc0893f57d9)）
- **版本日期**：2026-10-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是可逆/宿主化标注、provider+model 定位和多档位真实状态提示；用卸载不刷新与同名多 provider 夹具核对。详见[Q05](#research-q05)。

目标 Web/Desktop 上测流式长消息、编辑、主题、卸载不刷新、同名跨 provider 模型及多档位选择，对比原文和宿主目录状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 927 | 798 | 104 | — |
| .md | source | 1 | 160 | — | — | 1830 |
| .mjs | test | 1 | 298 | 263 | 10 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/137/dsh-chatgpt-style/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：对话样式与语义标注能否在流式/卸载边界安全工作，思考切换是否真正遵循宿主模型目录？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁用这个样式层，新增价值与已有宿主能力怎样区分？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向想要更清晰对话层级和快速切换推理档的 DSH Web/Desktop 用户。合格交付需保留原始消息内容、流式更新、可访问性与宿主模型选择状态。包为 private 0.1.0，宿主半只有空 apply，核心都在客户端：CSS 调整角色气泡/侧栏/代码块，正文自定义 ==/!!/++ 标记及裸 4xx/5xx 着色，另添快速/思考胶囊。增量是视觉组织和模型目录状态的快捷入口；模型推理能力及档位由宿主/provider 提供，未声明推理等级的模型不能凭插件生成。作者“关掉就回原样”和“不碰会话逻辑”需结合 DOM 修改边界检验。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-30](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/README.md#L1-L30)

作者对样式、语义色与快捷切换的功能说明。

<details>
<summary>查看原文（30行）</summary>

```text
# dsh-chatgpt-style

把 DSH Web 的对话流排成 ChatGPT 的样子，并且**给语义上色**：加强是绿的、警惕是红的、重点加粗、该有图标的地方都有图标。
纯样式 + 一层正文标注 + 发送框旁的**思考/快速**切换 + 左侧工作区高亮，不碰会话逻辑，关掉就回到原样。

## 安装

桌面应用的 profile 由应用独占，命令行改不动，走界面装：

1. 侧栏「插件」→「添加插件」
2. 填绝对路径：`E:\go_path\src\xiaotianzhushou\dsh-chatgpt-style`
3. 装完**重启一次桌面应用**（插件在应用启动时读进加载树），再刷新页面

它以 `link:` 依赖装在 profile 里，所以改完 `client.js` 只要刷新页面就生效，不用重装。
卸载：插件开关关掉即可；样式表、根属性、观察器都由 `ctx.effect` 的清理器收走。

## 语义色：怎么写，长什么样

正文里的标记会被渲染成带色带图标的节点。写进代码块或行内代码里的标记原样保留，不会被转换。

| 写法 | 渲染成 | 用在哪 |
|---|---|---|
| `==文字==` | **绿色**加粗 + ✓ 图标 | 加强、结论、已验证通过的点 |
| `!!文字!!` | **红色**加粗 + ⚠ 图标 | 警惕、风险、会出事的地方 |
| `++文字++` | **绿色**加粗 + 淡绿底，无图标 | 需要重点关注的词：错误码、关键数字、路径 |
| 裸的 `403` / `500` | 自动变成上面那种重点样式 | 不用手标，4xx/5xx 直接命中 |
| 行首 `✅ ` 或 `🟢 ` | 绿色横条卡片 + ✓，表情被摘掉 | 整行结论 |
| 行首 `⚠️ ` 或 `🔴 ` | 红色横条卡片 + ⚠ | 整行警告 |
| 行首 `💡 ` | 蓝色横条卡片 + 灯泡 | 整行提示 |
| `**文字**` | 700 字重（比正文更硬） | 重点加粗 |
```

</details>

**依据 2 · 源码核查**：[index.js:13-17](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/index.js#L13-L17)

宿主半空实现。

```text
/** entry 名，与 package.json 的 name 一致。 */
export const name = 'dsh-chatgpt-style';

/** 宿主半不需要注册任何服务；保留空实现以满足 entry 契约。 */
export function apply() {}
```

**依据 3 · 源码核查**：[client.js:43-83](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/client.js#L43-L83)

样式变量与视觉调整。

<details>
<summary>查看原文（41行）</summary>

```text
    var CSS = [
      '/* ===== 1. 变量：版心 / 字号 / 角色配色 ===== */',
      'html[' + ROOT_ATTR + '] {',
      '  --dsh-chat-content-width: 768px;   /* 正文列宽（DSH 默认 748px） */',
      '  --gpt-body-size: 16px;',
      '  --gpt-body-line: 28px;',
      '  --gpt-avatar: 30px;',
      '  --gpt-avatar-gap: 14px;',
      '  --gpt-accent: #2f6feb;',
      '  --gpt-bot: #10a37f;',
      '  --gpt-bubble: #e7f0ff;',
      '  --gpt-bubble-line-color: #bcd2f7;',
      '  --gpt-ink: #0b0d10;',
      '  --gpt-code-bg: #f7f8fa;',
      '  --gpt-code-head: #e9edf2;',
      '  --gpt-code-line: #dfe4ea;',
      '  --gpt-inline-code: #eef1f5;',
      '  --gpt-table-head: #f2f4f7;',
      '  --gpt-rule: #d8dee6;',
      '  /* 语义色：加强=绿，警惕=红，提示=蓝 */',
      '  --gpt-ok: #1a7f4b;',
      '  --gpt-ok-bg: rgba(26, 127, 75, .10);',
      '  --gpt-warn: #c0392b;',
      '  --gpt-warn-bg: rgba(192, 57, 43, .10);',
      '  --gpt-tip: #1f6feb;',
      '  --gpt-tip-bg: rgba(31, 111, 235, .10);',
      '  /* 思考/快速胶囊：快速=绿（省），思考=紫（贵） */',
      '  --gpt-mode-fast-fg: #0a6b4d;',
      '  --gpt-mode-fast-bg: #e4f6ee;',
      '  --gpt-mode-fast-line: #b3e0cd;',
      '  --gpt-mode-think-fg: #6b3ec9;',
      '  --gpt-mode-think-bg: #f0eaff;',
      '  --gpt-mode-think-line: #d4c4f5;',
      '  /* 左侧工作区：选中的会话用蓝底蓝字，文件夹图标走琥珀色 */',
      '  --gpt-ws-folder: #e2a03c;',
      '  --gpt-ws-folder-open: #c8891f;',
      '  --gpt-ws-sel-bg: #dce8ff;',
      '  --gpt-ws-sel-fg: #10387e;',
      '  --gpt-ws-sel-bar: #2f6feb;',
      '  --gpt-ws-idle-fg: #5a6270;',
      '}',
```

</details>

**依据 4 · 源码核查**：[client.js:648-660](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/client.js#L648-L660)

思考档位来自宿主模型目录。

<details>
<summary>查看原文（13行）</summary>

```text
    /* ==================================================================
     * 思考 / 快速 一键切换：贴在发送框旁边的胶囊。
     *
     * 为什么需要它：宿主只在「适配器发布了推理元数据」时才画推理强度那一行
     * （dsh-client-ui-model-selection：「适配器没有推理元数据时不显示 Effort 行」）。
     * kso-codeplan 路由声明了 reasoningEfforts（见 profile 的 cordis.patch.yml）之后，
     * 目录里每个模型才带 reasoning.efforts —— 这个胶囊读的就是那份数据。
     *
     * 数据与提交全部走宿主唯一真源 ctx.modelDirectories，本插件不缓存模型列表：
     *   directoryFor(sessionId).store.getSnapshot() -> { current, groups, ... }
     *   directoryFor(sessionId).select({ provider, model, reasoningEffort }) -> { ok }
     * 会话 id 取祖先上的 data-conversation-session，取不到退到 uiSession.current.value.key。
     * 模型没声明档位（少于两档）时胶囊自己隐藏，宿主那一套 UI 照常。
```

</details>

#### 缺口

- 真实宿主视觉效果、可访问性和用户效率未测
  **影响**：不能定量证明可读性/切换成本改善
  **进一步探讨**：在目标版本测主题、长对话、键盘/读屏与选择耗时

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 语义标注如何避免流式损坏、代码块误改与重复套娃？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

scanAll 与 MutationObserver 在 markdown 区域扫描；isStreaming 向祖先找 data-streaming，流式时直接跳过，属性移除后才重新扫描。walk 跳过 pre/code 等标签与 katex/gpt-hl 类，行首表情可给段落加 callout 类并从原文本节点去掉前缀；行内命中把原文本节点替换成 Fragment，其中强调内容用 span.textContent 而非 innerHTML，避免把标记内容当 HTML 执行。队列按 requestAnimationFrame 合并 DOM 变化，已有标记 span 不再深入，故常见重扫幂等。作者假 DOM 测试覆盖这些情况；但测试不是浏览器真实 React 流式竞争，也没有运行于本轮。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:483-555](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/client.js#L483-L555)

行内匹配、文本节点替换与 textContent。

<details>
<summary>查看原文（73行）</summary>

```text
    /* 纯函数：文本里的全部行内标记，去掉重叠后按位置排序 */
    function findInline(text) {
      var hits = [];
      for (var i = 0; i < INLINE.length; i++) {
        var rule = INLINE[i];
        var m;
        rule.re.lastIndex = 0;
        while ((m = rule.re.exec(text)) !== null) {
          if (m.index === rule.re.lastIndex) rule.re.lastIndex++;
          if (m[1].replace(/\s/g, '') === '') continue;
          hits.push({ start: m.index, end: m.index + m[0].length, cls: rule.cls, inner: m[1] });
        }
      }
      /* 自动命中排在标记之后：同一位置时先出现的标记赢（重叠过滤按 start 顺序） */
      AUTO_KEY.lastIndex = 0;
      var auto;
      while ((auto = AUTO_KEY.exec(text)) !== null) {
        if (auto.index === AUTO_KEY.lastIndex) AUTO_KEY.lastIndex++;
        hits.push({ start: auto.index, end: auto.index + auto[0].length, cls: 'gpt-hl-key', inner: auto[0] });
      }
      hits.sort(function (a, b) { return a.start - b.start; });
      var out = [];
      var last = -1;
      for (var j = 0; j < hits.length; j++) {
        if (hits[j].start >= last) { out.push(hits[j]); last = hits[j].end; }
      }
      return out;
    }

    /* 纯函数：行首标记 → { cls, rest } */
    function matchBlock(text) {
      for (var i = 0; i < BLOCK.length; i++) {
        var m = BLOCK[i].re.exec(text);
        if (m !== null) return { cls: BLOCK[i].cls, rest: text.slice(m[0].length) };
      }
      return null;
    }

    /* 块级宿主的第一个子节点必须是文本节点，标记才算在行首 */
    function leadingText(el) {
      if (el.childNodes.length === 0) return null;
      var c = el.childNodes[0];
      return c.nodeType === 3 ? c : null;
    }

    function decorateText(node) {
      var text = node.nodeValue;
      if (typeof text !== 'string' || text === '') return;
      var parent = node.parentNode;
      if (parent && parent.nodeType === 1 && HOST_TAGS[parent.tagName] && leadingText(parent) === node) {
        var b = matchBlock(text);
        if (b !== null) {
          addClass(parent, 'gpt-callout ' + b.cls);
          node.nodeValue = b.rest;
          text = b.rest;
          if (text === '') return;
        }
      }
      var hits = findInline(text);
      if (hits.length === 0) return;
      var frag = document.createDocumentFragment();
      var pos = 0;
      for (var i = 0; i < hits.length; i++) {
        var h = hits[i];
        if (h.start > pos) frag.appendChild(document.createTextNode(text.slice(pos, h.start)));
        var span = document.createElement('span');
        span.className = 'gpt-hl ' + h.cls;
        span.textContent = h.inner;
        frag.appendChild(span);
        pos = h.end;
      }
      if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
      parent.replaceChild(frag, node);
```

</details>

**依据 2 · 源码核查**：[client.js:558-645](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/client.js#L558-L645)

跳过代码/公式和流式，队列合并。

<details>
<summary>查看原文（88行）</summary>

```text
    function walk(node) {
      var kids = [];
      for (var i = 0; i < node.childNodes.length; i++) kids.push(node.childNodes[i]);
      for (var j = 0; j < kids.length; j++) {
        var c = kids[j];
        if (c.nodeType === 3) { decorateText(c); continue; }
        if (c.nodeType !== 1) continue;
        if (SKIP_TAGS[c.tagName]) continue;
        if (typeof c.className === 'string' && c.className.indexOf('katex') >= 0) continue;
        /* 已经装饰过的 span 不再进去：自动命中没有"消耗标记"这一步，重复扫描会越套越深 */
        if (typeof c.className === 'string' && c.className.indexOf('gpt-hl') >= 0) continue;
        walk(c);
      }
    }

    function isMarkdown(el) {
      return el.nodeType === 1 && typeof el.className === 'string' && MD_CLASS.test(el.className);
    }

    function closestMarkdown(el) {
      while (el && el.nodeType === 1) {
        if (isMarkdown(el)) return el;
        el = el.parentNode;
      }
      return null;
    }

    var pending = [];
    var scheduled = false;
    var raf = typeof requestAnimationFrame === 'function'
      ? requestAnimationFrame
      : function (fn) { return setTimeout(fn, 16); };

    function queue(root) {
      if (root === null || pending.indexOf(root) >= 0) return;
      pending.push(root);
      if (scheduled) return;
      scheduled = true;
      raf(flush);
    }

    /* 正在流式输出的消息一律不碰。
       React 记住的是它自己建的那个文本节点；把它 replaceChild 掉之后，
       后续 token 会写到已经脱离文档的节点上，正文就停在原地不动了。
       宿主在流式期间给助理消息的根节点挂着 data-streaming，摘掉它才算写完。 */
    function isStreaming(el) {
      while (el && el.nodeType === 1) {
        if (typeof el.hasAttribute === 'function' && el.hasAttribute('data-streaming')) return true;
        el = el.parentNode;
      }
      return false;
    }

    function flush() {
      scheduled = false;
      var roots = pending;
      pending = [];
      for (var i = 0; i < roots.length; i++) {
        if (roots[i].isConnected === false) continue;
        if (isStreaming(roots[i])) continue;
        walk(roots[i]);
      }
    }

    function onChange(records) {
      for (var i = 0; i < records.length; i++) {
        var rec = records[i];
        var t = rec.target;
        /* 属性记录只来自 data-streaming：流式结束时它是被摘掉的那一刻，
           此刻把这条消息里的 markdown 重排一遍（流式期间 flush 会自己跳过）。 */
        if (rec.type === 'attributes' || rec.attributeName === 'data-streaming') {
          var inner = t.nodeType === 1 && typeof t.querySelectorAll === 'function'
            ? t.querySelectorAll('[class*="_markdown"]')
            : [];
          for (var k = 0; k < inner.length; k++) queue(inner[k]);
          continue;
        }
        var el = t.nodeType === 1 ? t : t.parentNode;
        var root = closestMarkdown(el);
        if (root !== null) queue(root);
      }
    }

    function scanAll() {
      var roots = document.querySelectorAll(SCAN_SCOPE + ' ' + '[class*="_markdown"]');
      for (var i = 0; i < roots.length; i++) {
        if (!isStreaming(roots[i])) walk(roots[i]);
      }
```

</details>

**依据 3 · 源码核查**：[client.js:876-890](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/client.js#L876-L890)

监听 childList、characterData 与 data-streaming。

<details>
<summary>查看原文（15行）</summary>

```text
      var observer = null;
      try {
        scanAll();
        if (typeof MutationObserver === 'function' && document.body) {
          observer = new MutationObserver(function (records) {
            onChange(records);
            if (modeToggle !== null) modeToggle.schedule();
          });
          observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['data-streaming']
          });
```

</details>

**依据 4 · 源码核查**：[test/semantic.test.mjs:209-245](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/test/semantic.test.mjs#L209-L245)

作者测试覆盖幂等和流式模拟。

<details>
<summary>查看原文（37行）</summary>

```text
console.log('代码与公式不被动：');
check('pre/code 原样', code.textContent === 'echo ==不要在代码里换== !!也不要!! 403', JSON.stringify(code.textContent));
check('katex 原样', katex.textContent === 'a!!b', JSON.stringify(katex.textContent));

console.log('幂等：');
const before = pMixed.childNodes.length;
observers[0].cb([{ target: pMixed }]);
check('重复扫描不二次包裹', spansOf(pMixed).length === 2 && pMixed.childNodes.length === before, 'childNodes=' + pMixed.childNodes.length);

const keyChildBefore = pKey.childNodes.length;
observers[0].cb([{ target: pKey }]);
check('自动命中重复扫描不套娃', pKey.childNodes.length === keyChildBefore && spansOf(pKey).length === 2, 'childNodes=' + pKey.childNodes.length + ' spans=' + spansOf(pKey).length);

console.log('增量（模拟流式追加）：');
const fresh = para('🟢 新加的一行 ==也要变绿==');
md.appendChild(fresh);
observers[0].cb([{ target: fresh }]);
check('新增段落被整行标注', fresh.hasClass('gpt-callout-ok'), fresh.className);
check('新增段落行内也被标注', fresh.textContent === '新加的一行 也要变绿', JSON.stringify(fresh.textContent));

console.log('流式消息不碰（关键安全约束）：');
const streamRoot = new Element('div');
streamRoot.className = 'v5IAXa_root';
streamRoot.setAttribute('data-streaming', '');
const streamMd = new Element('div');
streamMd.className = 'v5IAXa_markdown';
const pStream = para('==流式里的字== 先别动，还有 !!风险!!');
streamMd.appendChild(pStream);
streamRoot.appendChild(streamMd);
roots.push(streamMd);
observers[0].cb([{ target: pStream }]);
check('流式中的正文一个字都没改', pStream.textContent === '==流式里的字== 先别动，还有 !!风险!!', JSON.stringify(pStream.textContent));
check('流式中的正文没有 span', spansOf(pStream).length === 0, '实际 ' + spansOf(pStream).length);
streamRoot.removeAttribute('data-streaming');
observers[0].cb([{ type: 'attributes', target: streamRoot }]);
check('流式结束后才标注', pStream.textContent === '流式里的字 先别动，还有 风险', '实际 ' + JSON.stringify(pStream.textContent));
check('流式结束后 span 到位', spansOf(pStream).length === 2, '实际 ' + spansOf(pStream).length);
```

</details>

#### 缺口

- 宿主真实 DOM 生命周期与 React 渲染竞争未核
  **影响**：不能保证所有流式/编辑/重排情形内容不丢
  **进一步探讨**：真实 Web/Desktop 中对流式长文本、消息编辑和 rerender 做端到端比对

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 关闭插件是否恢复原文，推理档位切换有哪些语义边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

dispose 只断 observer/模型目录订阅、移除 chip/style/root 属性，没有逆转已替换的文本节点，也没有把行首表情、==/!!/++ 标记恢复；因此当前已渲染消息在卸载后可能保留去标记的正文与 gpt-callout/gpt-hl 类，作者“关掉就回原样”只能指样式表外观，不是原文/DOM 恢复。模型胶囊取 groups 里第一个同 id 模型的 reasoning.efforts，未核 provider 匹配；若不同 provider 同 id 且档位不同，可能展示/切换错误档。current.reasoningEffort 以 off 作为快速、非 off 一律视为思考，切换 off→high 优先，无法表示更多档位的精细区别。点击失败只 warn，UI 提示是否足够未知。上述为源码推导，需真实宿主复核。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-15](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/README.md#L3-L15)

作者宣称关闭回到原样。

<details>
<summary>查看原文（13行）</summary>

```text
把 DSH Web 的对话流排成 ChatGPT 的样子，并且**给语义上色**：加强是绿的、警惕是红的、重点加粗、该有图标的地方都有图标。
纯样式 + 一层正文标注 + 发送框旁的**思考/快速**切换 + 左侧工作区高亮，不碰会话逻辑，关掉就回到原样。

## 安装

桌面应用的 profile 由应用独占，命令行改不动，走界面装：

1. 侧栏「插件」→「添加插件」
2. 填绝对路径：`E:\go_path\src\xiaotianzhushou\dsh-chatgpt-style`
3. 装完**重启一次桌面应用**（插件在应用启动时读进加载树），再刷新页面

它以 `link:` 依赖装在 profile 里，所以改完 `client.js` 只要刷新页面就生效，不用重装。
卸载：插件开关关掉即可；样式表、根属性、观察器都由 `ctx.effect` 的清理器收走。
```

</details>

**依据 2 · 源码核查**：[client.js:528-555](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/client.js#L528-L555)

标记从文本节点中被消费。

<details>
<summary>查看原文（28行）</summary>

```text
    function decorateText(node) {
      var text = node.nodeValue;
      if (typeof text !== 'string' || text === '') return;
      var parent = node.parentNode;
      if (parent && parent.nodeType === 1 && HOST_TAGS[parent.tagName] && leadingText(parent) === node) {
        var b = matchBlock(text);
        if (b !== null) {
          addClass(parent, 'gpt-callout ' + b.cls);
          node.nodeValue = b.rest;
          text = b.rest;
          if (text === '') return;
        }
      }
      var hits = findInline(text);
      if (hits.length === 0) return;
      var frag = document.createDocumentFragment();
      var pos = 0;
      for (var i = 0; i < hits.length; i++) {
        var h = hits[i];
        if (h.start > pos) frag.appendChild(document.createTextNode(text.slice(pos, h.start)));
        var span = document.createElement('span');
        span.className = 'gpt-hl ' + h.cls;
        span.textContent = h.inner;
        frag.appendChild(span);
        pos = h.end;
      }
      if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
      parent.replaceChild(frag, node);
```

</details>

**依据 3 · 源码核查**：[client.js:706-735](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/client.js#L706-L735)

按模型 id 找档位，缺 provider 限定。

<details>
<summary>查看原文（30行）</summary>

```text
      /* 目录快照 → 当前模型的可选档位；没声明 reasoning 就返回 null */
      function levelsOf(snapshot, current) {
        if (!snapshot || !current) return null;
        var groups = snapshot.groups || [];
        for (var i = 0; i < groups.length; i++) {
          var models = groups[i].models || [];
          for (var j = 0; j < models.length; j++) {
            var model = models[j];
            if (model.id !== current.model) continue;
            var reasoning = model.reasoning;
            var attempts = (reasoning && reasoning.efforts) || [];
            var ids = [];
            for (var k = 0; k < attempts.length; k++) {
              var id = typeof attempts[k] === 'string' ? attempts[k] : attempts[k] && attempts[k].id;
              if (typeof id === 'string' && id !== '' && ids.indexOf(id) < 0) ids.push(id);
            }
            if (ids.indexOf('off') < 0) ids.unshift('off');
            return { ids: ids, active: current.reasoningEffort || (reasoning && reasoning.defaultEffort) || 'off' };
          }
        }
        return null;
      }

      /* 快速 → 思考优先 high；思考 → 快速一律 off */
      function pickLevel(ids, active) {
        if (active !== 'off') return 'off';
        if (ids.indexOf('high') >= 0) return 'high';
        for (var i = ids.length - 1; i >= 0; i--) { if (ids[i] !== 'off') return ids[i]; }
        return 'off';
      }
```

</details>

**依据 4 · 源码核查**：[client.js:775-801](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/client.js#L775-L801)

档位切换及失败仅 warning。

<details>
<summary>查看原文（27行）</summary>

```text
      function onToggle() {
        try {
          if (!chip) return;
          var d = dir !== null ? dir : bindDirectory();
          if (d === null) return;
          var snapshot = d.store.getSnapshot();
          var current = snapshot && snapshot.current;
          var info = levelsOf(snapshot, current);
          if (!current || !info || info.ids.length < 2) return;
          var next = pickLevel(info.ids, info.active);
          chip.dataset.busy = '1';
          var done = function (result) {
            if (chip) chip.dataset.busy = '';
            if (result && result.ok === false) {
              var failure = result.error || {};
              warn('切换推理强度失败：' + String(failure.message || failure.code || 'unknown'));
            }
            refresh();
          };
          var pending = d.select({ provider: current.provider, model: current.model, reasoningEffort: next });
          if (pending && typeof pending.then === 'function') {
            pending.then(done, function (error) { done(null); warn('切换推理强度异常', error); });
          } else { done(pending); }
        } catch (error) {
          if (chip) chip.dataset.busy = '';
          warn('切换推理强度异常', error);
        }
```

</details>

**依据 5 · 源码核查**：[client.js:896-905](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/client.js#L896-L905)

卸载只清理 CSS、观察器和胶囊。

<details>
<summary>查看原文（10行）</summary>

```text
      var dispose = function () {
        if (observer !== null) { try { observer.disconnect(); } catch (e) {} }
        if (modeToggle !== null) { try { modeToggle.dispose(); } catch (e) {} }
        tag.remove();
        root.removeAttribute(ROOT_ATTR);
      };
      /* 首屏也挂一次：观察器要等下一次变更，进入已有会话时可能很久没有变更 */
      if (modeToggle !== null) modeToggle.maintain();

      if (typeof ctx.effect === 'function') ctx.effect(function () { return dispose; }, PLUGIN_ID + ': stylesheet');
```

</details>

#### 缺口

- 真实宿主卸载后的 React 重渲染时机与同 id 多 provider 配置未核
  **影响**：不能断言所有用户都会永久看到被改正文，也不能量化错档概率
  **进一步探讨**：装饰消息后卸载、不刷新页面检查 DOM；构造同 model id 多 provider 模型目录

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、持续维护与失败恢复分别依赖什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要 DSH Web 客户端模块加载器、chat/conversation DOM 语义属性和 modelDirectories，provider 要发布 reasoning.efforts 才显示切换。README 的绝对路径 link: 安装是作者本机环境示例，private 包不表示公开可得。首次需安装/重启、核当前宿主 DOM 和模型档位配置；持续维护受宿主 CSS Modules 局部名、data-* 语义属性与主题变化影响，可能静默样式失效。失败恢复要关插件并刷新/重载已改的消息，或重新选择宿主原生模型设置；实际人工时间未知。资金方面“思考更贵”属作者 UI 文案，真实模型计费需按当前 provider 明确核对，不应由配色推断价格。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-24](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/package.json#L1-L24)

private 包及客户端注入。

<details>
<summary>查看原文（24行）</summary>

```text
{
  "name": "dsh-chatgpt-style",
  "version": "0.1.0",
  "private": true,
  "description": "DSH Web 的 ChatGPT 化对话排版：768px 居中版心、右侧中性灰气泡、正文 16/28、圆角代码块",
  "type": "module",
  "main": "index.js",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-chat",
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
    }
  }
```

</details>

**依据 2 · 作者声明**：[README.md:6-15](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/README.md#L6-L15)

作者本地安装和卸载说明。

<details>
<summary>查看原文（10行）</summary>

```text
## 安装

桌面应用的 profile 由应用独占，命令行改不动，走界面装：

1. 侧栏「插件」→「添加插件」
2. 填绝对路径：`E:\go_path\src\xiaotianzhushou\dsh-chatgpt-style`
3. 装完**重启一次桌面应用**（插件在应用启动时读进加载树），再刷新页面

它以 `link:` 依赖装在 profile 里，所以改完 `client.js` 只要刷新页面就生效，不用重装。
卸载：插件开关关掉即可；样式表、根属性、观察器都由 `ctx.effect` 的清理器收走。
```

</details>

**依据 3 · 作者声明**：[README.md:141-150](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/README.md#L141-L150)

作者承认宿主选择器变化会静默失效。

<details>
<summary>查看原文（10行）</summary>

```text
## 为什么选择器长这样

DSH 用 CSS Modules，实际类名是 `<哈希>_局部名`（用户气泡是 `cJsG2q_bubble`）。哈希随宿主构建变，局部名稳定，
所以一律写 `[class*="_bubble"]`；行级结构挂在宿主导出的语义属性上：

- `[data-chat-flow-kind="user" | "assistant-step" | "turn-process" | "steering"]`
- `[data-chat-group-part]`、`[data-conversation-scroll]`、`[data-code-block-banner]`
- `[data-streaming]`（流式保护）、`body[data-ds-dark-theme]`（深色主题）

**已知限制**：宿主大版本升级若改了局部类名或这些属性名，对应样式/标注会静默失效（退化成默认外观，不报错）。
```

</details>

**依据 4 · 源码核查**：[client.js:664-703](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/client.js#L664-L703)

发送框锚点与会话 id 依赖。

<details>
<summary>查看原文（40行）</summary>

```text
    var MODE_ANCHORS = [
      '[data-slot="conversation.composer.bar"]',    /* 发送框底栏：并排席位，最合适 */
      '[data-slot="conversation.input.dock"]',
      '[data-slot="conversation.input.model"]'      /* 模型席位：插在它后面，不碰席位内部 */
    ];

    function installModeToggle(ctx) {
      var service = null;        /* ctx.modelDirectories */
      var chip = null;
      var anchorEl = null;
      var dir = null;            /* 当前订阅的 ModelDirectory */
      var unsubscribe = null;
      var warned = false;
      var queued = false;

      function warn(msg, extra) {
        try {
          if (ctx && ctx.logger && typeof ctx.logger.warn === 'function') ctx.logger.warn(PLUGIN_ID + ': ' + msg, extra);
          else if (typeof console !== 'undefined' && console.warn) console.warn(PLUGIN_ID + ': ' + msg, extra === undefined ? '' : extra);
        } catch (e) {}
      }

      function sessionIdOf(el) {
        var node = el && el.closest ? el.closest('[data-conversation-session]') : null;
        var id = node && node.getAttribute ? node.getAttribute('data-conversation-session') : null;
        if (typeof id === 'string' && id !== '') return id;
        try {
          var ui = ctx && typeof ctx.reflect === 'function' ? ctx.reflect.get('uiSession') : null;
          var key = ui && ui.current && ui.current.value ? ui.current.value.key : null;
          return typeof key === 'string' && key !== '' ? key : null;
        } catch (e) { return null; }
      }

      function findAnchor() {
        if (typeof document.querySelector !== 'function') return null;
        for (var i = 0; i < MODE_ANCHORS.length; i++) {
          var el = document.querySelector(MODE_ANCHORS[i]);
          if (el && el.isConnected !== false) return { el: el, after: i === MODE_ANCHORS.length - 1 };
        }
        return null;
```

</details>

#### 缺口

- 当前宿主 DOM、私有包交付方式和模型实际费用未核
  **影响**：无法量化维护成本或认定思考档更贵
  **进一步探讨**：在目标版本核安装、锚点和官方 provider 档位/计费

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么最小改进可保留可逆性与多模型准确性，当前能否采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方案是保留原始文本的可逆映射或由 React/宿主扩展点渲染装饰，避免直接消耗原始 DOM；卸载先恢复仍由插件拥有的文本和类，且限制作用域。档位选择应按 provider+model 共同定位，并用全部实际档位的清晰文案，失败在胶囊旁给可访问提示。最小验证覆盖流式、代码、编辑、卸载不刷新、两个 provider 同名模型、多档位及失败返回，比较文本节点和宿主目录状态。当前可在本机可重载的非关键 UI 原型中观察样式/语义色，避免把胶囊的思考/快速当成费用保证；推荐 observe，未做真实宿主验收。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:528-555](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/client.js#L528-L555)

当前不可逆文本转换。

<details>
<summary>查看原文（28行）</summary>

```text
    function decorateText(node) {
      var text = node.nodeValue;
      if (typeof text !== 'string' || text === '') return;
      var parent = node.parentNode;
      if (parent && parent.nodeType === 1 && HOST_TAGS[parent.tagName] && leadingText(parent) === node) {
        var b = matchBlock(text);
        if (b !== null) {
          addClass(parent, 'gpt-callout ' + b.cls);
          node.nodeValue = b.rest;
          text = b.rest;
          if (text === '') return;
        }
      }
      var hits = findInline(text);
      if (hits.length === 0) return;
      var frag = document.createDocumentFragment();
      var pos = 0;
      for (var i = 0; i < hits.length; i++) {
        var h = hits[i];
        if (h.start > pos) frag.appendChild(document.createTextNode(text.slice(pos, h.start)));
        var span = document.createElement('span');
        span.className = 'gpt-hl ' + h.cls;
        span.textContent = h.inner;
        frag.appendChild(span);
        pos = h.end;
      }
      if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
      parent.replaceChild(frag, node);
```

</details>

**依据 2 · 源码核查**：[client.js:706-735](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/client.js#L706-L735)

当前模型 id 匹配与两态切换。

<details>
<summary>查看原文（30行）</summary>

```text
      /* 目录快照 → 当前模型的可选档位；没声明 reasoning 就返回 null */
      function levelsOf(snapshot, current) {
        if (!snapshot || !current) return null;
        var groups = snapshot.groups || [];
        for (var i = 0; i < groups.length; i++) {
          var models = groups[i].models || [];
          for (var j = 0; j < models.length; j++) {
            var model = models[j];
            if (model.id !== current.model) continue;
            var reasoning = model.reasoning;
            var attempts = (reasoning && reasoning.efforts) || [];
            var ids = [];
            for (var k = 0; k < attempts.length; k++) {
              var id = typeof attempts[k] === 'string' ? attempts[k] : attempts[k] && attempts[k].id;
              if (typeof id === 'string' && id !== '' && ids.indexOf(id) < 0) ids.push(id);
            }
            if (ids.indexOf('off') < 0) ids.unshift('off');
            return { ids: ids, active: current.reasoningEffort || (reasoning && reasoning.defaultEffort) || 'off' };
          }
        }
        return null;
      }

      /* 快速 → 思考优先 high；思考 → 快速一律 off */
      function pickLevel(ids, active) {
        if (active !== 'off') return 'off';
        if (ids.indexOf('high') >= 0) return 'high';
        for (var i = ids.length - 1; i >= 0; i--) { if (ids[i] !== 'off') return ids[i]; }
        return 'off';
      }
```

</details>

**依据 3 · 源码核查**：[client.js:896-905](https://github.com/137/dsh-chatgpt-style/blob/fe4f23bed4bec14ad01577050eaacdc0893f57d9/client.js#L896-L905)

卸载清理边界。

<details>
<summary>查看原文（10行）</summary>

```text
      var dispose = function () {
        if (observer !== null) { try { observer.disconnect(); } catch (e) {} }
        if (modeToggle !== null) { try { modeToggle.dispose(); } catch (e) {} }
        tag.remove();
        root.removeAttribute(ROOT_ATTR);
      };
      /* 首屏也挂一次：观察器要等下一次变更，进入已有会话时可能很久没有变更 */
      if (modeToggle !== null) modeToggle.maintain();

      if (typeof ctx.effect === 'function') ctx.effect(function () { return dispose; }, PLUGIN_ID + ': stylesheet');
```

</details>

#### 缺口

- 可逆渲染及 provider 绑定未实现/实测
  **影响**：不能计入现有插件贡献
  **进一步探讨**：小型原型和真实宿主交叉验证卸载与选档正确性

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
