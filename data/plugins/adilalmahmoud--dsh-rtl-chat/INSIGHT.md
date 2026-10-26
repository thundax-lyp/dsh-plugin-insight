# dsh-rtl-chat

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[cb47d87](https://github.com/AdilAlmahmoud/dsh-RTL-chat/tree/cb47d8708ae0c95205926f03b6c7228c50de5e29)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AdilAlmahmoud/dsh-RTL-chat)
<!-- END META -->

> **实现功能**：给会话消息区提供RTL/LTR切换和本地偏好，代码保持LTR，适合阿拉伯语阅读。

> **核心亮点**：将局部RTL样式和可见开关封装，少反复改浏览器CSS。详见[Q01](#research-q01)。

> **风险与缺陷**：统一消息区RTL影响混排，偏好共享origin且不同tab不实时同步，按钮样式disposer未保存。详见[Q03](#research-q03)。

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
  - [Q01 · RTL阅读模式作用在什么内容？](#detail-section-11)
  - [Q02 · 状态与宿主注册如何工作？](#detail-section-12)
  - [Q03 · 清理和分发有哪些具体缺口？](#detail-section-13)
  - [Q04 · 工程与阶段成本怎样评估？](#detail-section-14)
  - [Q05 · 何时值得试用，继续探讨方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：RTL语言为主的DSH Web阅读者。详见[Q01](#research-q01)。

浏览器CSS/用户脚本RTL开关，不改变消息内容。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 方向开关 | RTL阅读 | 全消息容器 |
| 代码LTR | 保代码方向 | 非完整混排隔离 |
| 偏好记忆 | 刷新恢复 | origin共享 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| Web module loader/React | 客户端 | 宿主ABI |
| conversation header slot | 开关 | slot变动缺按钮 |
| data-conversation-scroll | 方向CSS | DOM变动失效 |
| localStorage | 记偏好 | 失败当前页仍可用 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 本地安装刷新 | 用户 | 开关出现 |
| 看混排/代码样本 | 用户 | 读序正确 |
| 按语言切方向 | 用户 | 偏好范围清楚 |
| 停用刷新核样式 | 用户 | 方向恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地Web包和宿主浏览器资源，金额未知 | 安装刷新并检查阿拉伯语、英阿混排、代码和表格，工时未知 | 需匹配slot/DOM，源码CSS不等阅读体验测量 |
| 持续使用 | 少量CSS、点击重渲染和一个localStorage键；无插件网络/模型请求 | 按内容切方向，检查混排可读性，耗时未知 | 没有独立调用不代表浏览器/宿主总费为零；阅读速度/误读改善未知 |
| 失败恢复 | LTR切换/停用刷新；偏好和残BTN样式可能仍留 | 核残style、按需清偏好，恢复工时未知 | 无独立正文变更可回滚；辅助技术效果和热卸载成本未量化 |


#### 效果

| 目标 | 支持 | 边界 |
| --- | --- | --- |
| RTL阅读 | 消息容器direction | 非逐段识别 |
| 代码可读 | 强制LTR | 混排仍需看样本 |
| 保存选择 | localStorage | origin共享/无跨tab事件 |

> **思考**：统一消息区RTL影响混排，偏好共享origin且不同tab不实时同步，按钮样式disposer未保存。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将局部RTL样式和可见开关封装，少反复改浏览器CSS。详见[Q01](#research-q01)。

将局部RTL样式和可见开关封装，少反复改浏览器CSS。详见[Q01](#research-q01)。

小实现/存储降级简明，清理所有style和辅助状态可改善。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

统一消息区RTL影响混排，偏好共享origin且不同tab不实时同步，按钮样式disposer未保存。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

RTL读者本地试用，混排不合适随时切回。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

客户端链完整可查，方向非逐语言识别，BTN样式清理与混排体验有限制。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、client.js、index.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整131行client、空host、package/patch和README，不执行Web目标或改浏览器。
- 下一步：从混排/双tab/storage拒绝/重复卸载核体验与生命周期。

**分析版本**

- **仓库**：[AdilAlmahmoud/dsh-RTL-chat](https://github.com/AdilAlmahmoud/dsh-RTL-chat)
- **版本号**：1.0.0（[固定提交 cb47d87](https://github.com/AdilAlmahmoud/dsh-RTL-chat/tree/cb47d8708ae0c95205926f03b6c7228c50de5e29)）
- **版本日期**：2026-10-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究逐段方向/隔离和完整style生命周期、明确辅助状态，比较误读与残样式，尚未验证。详见[Q05](#research-q05)。

从混排/双tab/storage拒绝/重复卸载核体验与生命周期。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 133 | 114 | 11 | — |
| .md | source | 1 | 48 | — | — | 383 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AdilAlmahmoud/dsh-RTL-chat/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AdilAlmahmoud/dsh-RTL-chat/issues?q=is%3Aissue+created%3A2026-09-22T07%3A32%3A31.577Z..2026-10-22T07%3A32%3A31.577Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AdilAlmahmoud/dsh-RTL-chat/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A32%3A31.577Z..2026-10-22T07%3A32%3A31.577Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：RTL客户端如何限定阅读范围/记偏好，混排、生命周期与分发的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · RTL阅读模式作用在什么内容？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

给阿拉伯语等RTL阅读者，把DSH消息滚动容器direction设rtl，在会话header加RTL/LTR按钮，一键返回正常方向。默认读不到存储时开启RTL，代码/pre/kbd/samp强设ltr并对pre左对齐，尽量保留代码可读性。host apply空函数，无模型工具或内容转换，消息原文和执行流程不改。

贡献是局部CSS和可见切换控件，不是翻译、阿拉伯语排版引擎或逐段自动识别。选择器作用该页面所有data-conversation-scroll，不只阿拉伯语或单条answer，混合英文/表格/用户消息也继承方向；README称header/sidebar保持LTR源自CSS未选它们，仍依宿主实际DOM层级。基线是浏览器自定义CSS或用户脚本，插件降低反复改样式步骤。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-19](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/README.md#L3-L19)

作者阅读范围/样式主张。

<details>
<summary>查看原文（17行）</summary>

```text
A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (DSH) client plugin that makes the **conversation answer area read right-to-left (RTL)** for Arabic, with a one-click button to switch back to left-to-right (LTR).

يعرض منطقة إجابات المحادثة في DeepSeek Harness من اليمين إلى اليسار لقراءة العربية بشكل صحيح، مع زر للتبديل إلى الاتجاه العادي.

## Behavior / السلوك

- Only the message/answer scroll area of the conversation panel becomes RTL — the header, sidebar, and app chrome stay LTR.
  يُطبَّق الاتجاه على منطقة الرسائل فقط؛ الترويسة والشريط الجانبي تبقى كما هي.
- Code blocks (`pre`/`code`) inside answers stay LTR so code remains readable.
- A pill button (◄► **RTL**/**LTR**) appears in the conversation header. Clicking it toggles the direction; your choice is persisted in `localStorage` and survives reloads.
  زر دائري في ترويسة المحادثة يبدّل الاتجاه، ويُحفظ اختيارك تلقائيًا.

## How it works / آلية العمل

- Registers a toggle button into the live slot `conversation.header.leading` via `ctx.slots.inject` (client-only; no agent tool involved).
- Applies a scoped stylesheet (`[data-conversation-scroll]{direction:rtl}` + LTR guards for code) through the package-owned `styles.insert`, inserted/removed on toggle.
- Uses only `--dsw-alias-*` theme tokens; no imports from Harness client packages.
```

</details>

**依据 2 · 源码核查**：[client.js:17-27](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/client.js#L17-L27)

实际容器和代码覆盖。

<details>
<summary>查看原文（11行）</summary>

```text
    // --- Scope: only the conversation answer area ------------------------------
    // The Conversation shell renders its message scroll port as
    // div.scrollBody[data-conversation-scroll] (see @deepseek-ai/dsh-client-ui-conversation).
    // Direction is applied there alone, so the header, sidebar, and banner keep LTR.
    const RTL_CSS = [
      '[data-conversation-scroll]{direction:rtl;}',
      '[data-conversation-scroll] pre,[data-conversation-scroll] code,',
      '[data-conversation-scroll] kbd,[data-conversation-scroll] samp{',
      ' direction:ltr;unicode-bidi:embed;}',
      '[data-conversation-scroll] pre{text-align:left;}',
    ].join('');
```

</details>

**依据 3 · 源码核查**：[index.js:1-2](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/index.js#L1-L2)

host空入口。

```text
/** Host half of the RTL chat bundle; all direction state lives in the Client module. */
export function apply() {}
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 状态与宿主注册如何工作？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

模块通过__ModuleLoader__注册@local/dsh-rtl-chat，require React，注入slots；apply直接插按钮CSS，读localStorage键dsh-rtl-chat.dir，rtl时插方向CSS并记disposer。按钮useReducer触发重渲染，effect把本组件监听加到Set并卸载移除，点击改模块变量、尽力写storage、增删方向style并通知监听，单监听异常不阻其它。

选择是浏览器origin存储和模块共享，非session/profile独立，多个会话共用；没有storage事件同步，另一tab更改不即时驱动已打开tab。存储拒绝时仍可当前页切换但刷新回默认RTL。依赖宿主Web会话slot、data-conversation-scroll结构、React和theme token，DOM属性/slot变更可使样式无效或按钮缺失；未导入宿主内部包代码不等不依赖宿主界面契约。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:1-15](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/client.js#L1-L15)

模块和自建styles。

<details>
<summary>查看原文（15行）</summary>

```text
window.__ModuleLoader__.load({
  id: '@local/dsh-rtl-chat',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const styles = {
      insert(css) {
        const el = document.createElement('style');
        el.setAttribute('data-dsh-rtl-chat', '');
        el.textContent = css;
        document.head.appendChild(el);
        return () => el.remove();
      },
    };
```

</details>

**依据 2 · 源码核查**：[client.js:43-79](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/client.js#L43-L79)

状态/存储/通知。

<details>
<summary>查看原文（37行）</summary>

```text
    // --- Direction state (persisted per browser) --------------------------------
    const STORAGE_KEY = 'dsh-rtl-chat.dir';
    const listeners = new Set();
    let rtlActive = false;
    let rtlCssDisposer = null;

    function readStoredDir() {
      try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        if (value === 'rtl' || value === 'ltr') return value;
      } catch {
        /* localStorage unavailable; fall back to the default */
      }
      return 'rtl';
    }

    function applyDir(next) {
      rtlActive = next === 'rtl';
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* persistence is best-effort */
      }
      if (rtlActive && !rtlCssDisposer) {
        rtlCssDisposer = styles.insert(RTL_CSS);
      } else if (!rtlActive && rtlCssDisposer) {
        rtlCssDisposer();
        rtlCssDisposer = null;
      }
      listeners.forEach((notify) => {
        try {
          notify();
        } catch {
          /* one broken listener must not break the rest */
        }
      });
    }
```

</details>

**依据 3 · 源码核查**：[client.js:82-109](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/client.js#L82-L109)

控件监听。

<details>
<summary>查看原文（28行）</summary>

```text
    function RtlToggle() {
      const [, bump] = React.useReducer((n) => n + 1, 0);
      React.useEffect(() => {
        listeners.add(bump);
        return () => listeners.delete(bump);
      }, []);
      const rtl = rtlActive;
      return h(
        'button',
        {
          type: 'button',
          className: 'dsh-rtl-toggle',
          onClick: () => applyDir(rtlActive ? 'ltr' : 'rtl'),
          title: rtl
            ? 'التبديل إلى الاتجاه من اليسار إلى اليمين (LTR)'
            : 'التبديل إلى الاتجاه من اليمين إلى اليسار (RTL)',
          'aria-label': rtl
            ? 'Switch the conversation back to left-to-right'
            : 'Switch the conversation to right-to-left',
        },
        h('span', { className: 'dsh-rtl-toggle__glyph', 'aria-hidden': true }, '\u21C4'),
        h('span', { className: 'dsh-rtl-toggle__mode' }, rtl ? 'RTL' : 'LTR'),
      );
    }

    return {
      inject: ['slots'],
      apply(ctx) {
```

</details>

**依据 4 · 源码核查**：[client.js:107-129](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/client.js#L107-L129)

slot注册。

<details>
<summary>查看原文（23行）</summary>

```text
    return {
      inject: ['slots'],
      apply(ctx) {
        styles.insert(BTN_CSS);
        applyDir(readStoredDir());
        ctx.effect(
          () => () => {
            // Plugin unload removes the RTL stylesheet.
            if (rtlCssDisposer) {
              rtlCssDisposer();
              rtlCssDisposer = null;
            }
          },
          'dsh-rtl-chat:rtl-css',
        );
        ctx.slots.inject('conversation.header.leading', () =>
          ctx.slots.register(
            { name: 'conversation.header.leading', id: 'dsh-rtl-chat' },
            RtlToggle,
          ),
        );
      },
    };
```

</details>

**依据 5 · 源码核查**：[package.json:22-28](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/package.json#L22-L28)

Web注入。

```text
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": ["@deepseek-ai/dsh-client-ui-conversation"]
    }
  }
}
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 清理和分发有哪些具体缺口？

**研究主题**：缺陷与关键质疑

#### 完整回答

卸载effect仅移除rtlCssDisposer，按钮样式styles.insert(BTN_CSS)返回的清理函数被丢弃；反复卸载/重载可遗留或重复data-dsh-rtl-chat样式标签。方向样式能清掉是正向边界，但不能称所有包样式都被清理。localStorage选择保留，停用不删除偏好，符合跨刷新但会影响重装默认。

CSS统一direction继承和unicode-bidi embed不是完整双向文本隔离，混合数字/括号/嵌套代码/表格可能仍需逐案例核读序；没有内容语言检测/按段开关。按钮有title、aria-label和focus-visible但无aria-pressed，状态主要靠文字模式，辅助技术状态契约可继续改善。

package private=true且files只列locale/icon，虽然exports声明client和bundle patch，不能由此推npm发布包完整；README主推本地拷贝/链接安装，按此路径可读全文件。当前无engines/peer版本范围或构建/测试脚本，升级宿主需人工核CSS/slot，不把本地目录完整当npm可分发证明。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:107-129](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/client.js#L107-L129)

第110行直接插入BTN_CSS而不保存disposer；随后effect仅清RTL样式。

<details>
<summary>查看原文（23行）</summary>

```text
    return {
      inject: ['slots'],
      apply(ctx) {
        styles.insert(BTN_CSS);
        applyDir(readStoredDir());
        ctx.effect(
          () => () => {
            // Plugin unload removes the RTL stylesheet.
            if (rtlCssDisposer) {
              rtlCssDisposer();
              rtlCssDisposer = null;
            }
          },
          'dsh-rtl-chat:rtl-css',
        );
        ctx.slots.inject('conversation.header.leading', () =>
          ctx.slots.register(
            { name: 'conversation.header.leading', id: 'dsh-rtl-chat' },
            RtlToggle,
          ),
        );
      },
    };
```

</details>

**依据 2 · 源码核查**：[client.js:17-27](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/client.js#L17-L27)

统一bidi策略。

<details>
<summary>查看原文（11行）</summary>

```text
    // --- Scope: only the conversation answer area ------------------------------
    // The Conversation shell renders its message scroll port as
    // div.scrollBody[data-conversation-scroll] (see @deepseek-ai/dsh-client-ui-conversation).
    // Direction is applied there alone, so the header, sidebar, and banner keep LTR.
    const RTL_CSS = [
      '[data-conversation-scroll]{direction:rtl;}',
      '[data-conversation-scroll] pre,[data-conversation-scroll] code,',
      '[data-conversation-scroll] kbd,[data-conversation-scroll] samp{',
      ' direction:ltr;unicode-bidi:embed;}',
      '[data-conversation-scroll] pre{text-align:left;}',
    ].join('');
```

</details>

**依据 3 · 源码核查**：[client.js:92-109](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/client.js#L92-L109)

辅助属性。

<details>
<summary>查看原文（18行）</summary>

```text
          type: 'button',
          className: 'dsh-rtl-toggle',
          onClick: () => applyDir(rtlActive ? 'ltr' : 'rtl'),
          title: rtl
            ? 'التبديل إلى الاتجاه من اليسار إلى اليمين (LTR)'
            : 'التبديل إلى الاتجاه من اليمين إلى اليسار (RTL)',
          'aria-label': rtl
            ? 'Switch the conversation back to left-to-right'
            : 'Switch the conversation to right-to-left',
        },
        h('span', { className: 'dsh-rtl-toggle__glyph', 'aria-hidden': true }, '\u21C4'),
        h('span', { className: 'dsh-rtl-toggle__mode' }, rtl ? 'RTL' : 'LTR'),
      );
    }

    return {
      inject: ['slots'],
      apply(ctx) {
```

</details>

**依据 4 · 源码核查**：[package.json:1-28](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/package.json#L1-L28)

private/files/exports。

<details>
<summary>查看原文（28行）</summary>

```text
{
  "name": "@local/dsh-rtl-chat",
  "version": "1.0.0",
  "description": "Right-to-left reading mode for the DeepSeek Harness conversation answer area, with a one-click LTR/RTL toggle.",
  "private": true,
  "type": "module",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/AdilAlmahmoud/dsh-rtl-chat.git"
  },
  "icon": "./icon.svg",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "files": ["locale/*.json", "icon.svg"],
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": ["@deepseek-ai/dsh-client-ui-conversation"]
    }
  }
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程与阶段成本怎样评估？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

实现131行原生ESM客户端、空host，分离方向CSS和按钮CSS，监听Set与局部异常处理简洁；storage失败软降级、代码LTR和焦点样式是有用细节。仓库无自动测试，本次完整阅读代码而不做真实宿主或阅读体验验证，不能把静态CSS效果等同多语言排版验收。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地Web包和宿主浏览器资源，金额未知 | 安装刷新并检查阿拉伯语、英阿混排、代码和表格，工时未知 | 需匹配slot/DOM，源码CSS不等阅读体验测量 |
| 持续使用 | 少量CSS、点击重渲染和一个localStorage键；无插件网络/模型请求 | 按内容切方向，检查混排可读性，耗时未知 | 没有独立调用不代表浏览器/宿主总费为零；阅读速度/误读改善未知 |
| 失败恢复 | LTR切换/停用刷新；偏好和残BTN样式可能仍留 | 核残style、按需清偏好，恢复工时未知 | 无独立正文变更可回滚；辅助技术效果和热卸载成本未量化 |


#### 证据与依据

**依据 1 · 源码核查**：[client.js:43-79](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/client.js#L43-L79)

存储降级。

<details>
<summary>查看原文（37行）</summary>

```text
    // --- Direction state (persisted per browser) --------------------------------
    const STORAGE_KEY = 'dsh-rtl-chat.dir';
    const listeners = new Set();
    let rtlActive = false;
    let rtlCssDisposer = null;

    function readStoredDir() {
      try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        if (value === 'rtl' || value === 'ltr') return value;
      } catch {
        /* localStorage unavailable; fall back to the default */
      }
      return 'rtl';
    }

    function applyDir(next) {
      rtlActive = next === 'rtl';
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* persistence is best-effort */
      }
      if (rtlActive && !rtlCssDisposer) {
        rtlCssDisposer = styles.insert(RTL_CSS);
      } else if (!rtlActive && rtlCssDisposer) {
        rtlCssDisposer();
        rtlCssDisposer = null;
      }
      listeners.forEach((notify) => {
        try {
          notify();
        } catch {
          /* one broken listener must not break the rest */
        }
      });
    }
```

</details>

**依据 2 · 源码核查**：[client.js:82-129](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/client.js#L82-L129)

监听/清理范围。

<details>
<summary>查看原文（48行）</summary>

```text
    function RtlToggle() {
      const [, bump] = React.useReducer((n) => n + 1, 0);
      React.useEffect(() => {
        listeners.add(bump);
        return () => listeners.delete(bump);
      }, []);
      const rtl = rtlActive;
      return h(
        'button',
        {
          type: 'button',
          className: 'dsh-rtl-toggle',
          onClick: () => applyDir(rtlActive ? 'ltr' : 'rtl'),
          title: rtl
            ? 'التبديل إلى الاتجاه من اليسار إلى اليمين (LTR)'
            : 'التبديل إلى الاتجاه من اليمين إلى اليسار (RTL)',
          'aria-label': rtl
            ? 'Switch the conversation back to left-to-right'
            : 'Switch the conversation to right-to-left',
        },
        h('span', { className: 'dsh-rtl-toggle__glyph', 'aria-hidden': true }, '\u21C4'),
        h('span', { className: 'dsh-rtl-toggle__mode' }, rtl ? 'RTL' : 'LTR'),
      );
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        styles.insert(BTN_CSS);
        applyDir(readStoredDir());
        ctx.effect(
          () => () => {
            // Plugin unload removes the RTL stylesheet.
            if (rtlCssDisposer) {
              rtlCssDisposer();
              rtlCssDisposer = null;
            }
          },
          'dsh-rtl-chat:rtl-css',
        );
        ctx.slots.inject('conversation.header.leading', () =>
          ctx.slots.register(
            { name: 'conversation.header.leading', id: 'dsh-rtl-chat' },
            RtlToggle,
          ),
        );
      },
    };
```

</details>

**依据 3 · 源码核查**：[package.json:1-28](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/package.json#L1-L28)

无测试/构建。

<details>
<summary>查看原文（28行）</summary>

```text
{
  "name": "@local/dsh-rtl-chat",
  "version": "1.0.0",
  "description": "Right-to-left reading mode for the DeepSeek Harness conversation answer area, with a one-click LTR/RTL toggle.",
  "private": true,
  "type": "module",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/AdilAlmahmoud/dsh-rtl-chat.git"
  },
  "icon": "./icon.svg",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "files": ["locale/*.json", "icon.svg"],
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": ["@deepseek-ai/dsh-client-ui-conversation"]
    }
  }
}
```

</details>

#### 缺口

- 目标宿主与实际阿拉伯语/英语/代码表格混排的阅读顺序及辅助技术状态
  **影响**：统一direction可能改善主文本却不能保证所有混合内容更易读
  **进一步探讨**：用固定混排样本比较LTR/RTL的标点、数字、代码和键盘/读屏状态

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时值得试用，继续探讨方向？

**研究主题**：新假设与验证、采用判断

#### 完整回答

以RTL语言为主、宿主DOM/slot匹配的读者可本地试用，先检查代码和混排再设默认，L​​TR文本多时随时切回。多profile共享origin时理解偏好全局，重载变更后核残样式；不把它当自动语言识别或无障碍认证。

可继续研究逐消息/段落语言方向、bdi隔离与明确aria-pressed，同时把所有style disposer纳入生命周期，并按profile或会话设置偏好。基线为当前全容器RTL和模块全局存储；反例为阿英数字括号、代码表格、双tab不同选择、storage不可用及十次卸载重装。比较误读、切换次数、残style数量和辅助技术可辨状态，方向未验证。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:17-27](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/client.js#L17-L27)

容器级基线。

<details>
<summary>查看原文（11行）</summary>

```text
    // --- Scope: only the conversation answer area ------------------------------
    // The Conversation shell renders its message scroll port as
    // div.scrollBody[data-conversation-scroll] (see @deepseek-ai/dsh-client-ui-conversation).
    // Direction is applied there alone, so the header, sidebar, and banner keep LTR.
    const RTL_CSS = [
      '[data-conversation-scroll]{direction:rtl;}',
      '[data-conversation-scroll] pre,[data-conversation-scroll] code,',
      '[data-conversation-scroll] kbd,[data-conversation-scroll] samp{',
      ' direction:ltr;unicode-bidi:embed;}',
      '[data-conversation-scroll] pre{text-align:left;}',
    ].join('');
```

</details>

**依据 2 · 源码核查**：[client.js:43-79](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/client.js#L43-L79)

全局存储基线。

<details>
<summary>查看原文（37行）</summary>

```text
    // --- Direction state (persisted per browser) --------------------------------
    const STORAGE_KEY = 'dsh-rtl-chat.dir';
    const listeners = new Set();
    let rtlActive = false;
    let rtlCssDisposer = null;

    function readStoredDir() {
      try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        if (value === 'rtl' || value === 'ltr') return value;
      } catch {
        /* localStorage unavailable; fall back to the default */
      }
      return 'rtl';
    }

    function applyDir(next) {
      rtlActive = next === 'rtl';
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* persistence is best-effort */
      }
      if (rtlActive && !rtlCssDisposer) {
        rtlCssDisposer = styles.insert(RTL_CSS);
      } else if (!rtlActive && rtlCssDisposer) {
        rtlCssDisposer();
        rtlCssDisposer = null;
      }
      listeners.forEach((notify) => {
        try {
          notify();
        } catch {
          /* one broken listener must not break the rest */
        }
      });
    }
```

</details>

**依据 3 · 源码核查**：[client.js:107-129](https://github.com/AdilAlmahmoud/dsh-RTL-chat/blob/cb47d8708ae0c95205926f03b6c7228c50de5e29/client.js#L107-L129)

清理基线。

<details>
<summary>查看原文（23行）</summary>

```text
    return {
      inject: ['slots'],
      apply(ctx) {
        styles.insert(BTN_CSS);
        applyDir(readStoredDir());
        ctx.effect(
          () => () => {
            // Plugin unload removes the RTL stylesheet.
            if (rtlCssDisposer) {
              rtlCssDisposer();
              rtlCssDisposer = null;
            }
          },
          'dsh-rtl-chat:rtl-css',
        );
        ctx.slots.inject('conversation.header.leading', () =>
          ctx.slots.register(
            { name: 'conversation.header.leading', id: 'dsh-rtl-chat' },
            RtlToggle,
          ),
        );
      },
    };
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
