# deepseek-harness-hello-kitty-suite

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[1b8cd7e](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/tree/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818)

<!-- BEGIN META -->
[![GitHub ★ 20](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20&color=yellow&logo=github&style=flat)](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite)
<!-- END META -->

> **实现功能**：粉色 Hello Kitty 皮肤加每轮结束/提问提醒插件，皮肤独立安装。

> **核心亮点**：将皮肤和轻量结束提醒打包；提醒无需外部服务。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：全局 seq 无会话/结果，当前 DOM 问号判提问；隐藏页没有提示音，README 与实现不一致。素材公开再分发需权利审查。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 套件的皮肤与提醒分别解决什么需求？](#detail-section-11)
  - [Q02 · 完成/提问提醒如何从宿主事件传到页面？](#detail-section-12)
  - [Q03 · 提醒语义、音频和浏览器权限有哪些偏差？](#detail-section-13)
  - [Q04 · 皮肤安装、维护及素材再分发有什么约束？](#detail-section-14)
  - [Q05 · 怎样在个人使用场景下验证并降低误提醒？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人 DSH 用户希望个性化 UI 并在回合结束时获提醒。

DSH 原生界面/页面通知；本包增加粉色装饰与结束事件提示。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| skin | 个性外观 | 需 Skin Center |
| seq | 回合变化 | 无会话/结果 |
| question | 提问提示 | 末条问号 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| webServer/slots/timer | 提醒 | 无弹窗 |
| Notification/Audio | 系统提示/音 | 权限限制 |
| Skin Center | 皮肤 | 仅提醒 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 装皮肤 | 隔离 profile | 可还原 |
| 装提醒 | 多会话矩阵 | 无误提醒 |
| 分享 | 换素材 | 授权可追溯 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 安装 | 根插件+皮肤脚本/Skin Center | 兼容 |
| 使用 | 每页 700ms HTTP/通知授权 | 误提醒 |
| 发布 | 角色素材替换 | 权利证明 |

| 结果 | 源码支持 | 未证实/偏差 |
| --- | --- | --- |
| 皮肤 | 资产复制 | 实机效果 |
| 回合提醒 | seq 增长 | 任务成功 |
| 提问 | 当前 DOM 问号 | 当前事件会话 |

> **思考**：全局 seq 无会话/结果，当前 DOM 问号判提问；隐藏页没有提示音，README 与实现不一致。素材公开再分发需权利审查。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将皮肤和轻量结束提醒打包；提醒无需外部服务。详见[Q01](#research-q01)、[Q02](#research-q02)。

将皮肤和轻量结束提醒打包；提醒无需外部服务。详见[Q01](#research-q01)、[Q02](#research-q02)。

host route 只传 seq；客户端轮询与当前 DOM 关联，hidden 分支只通知无声音；安装器会改 profile patch。

<a id="detail-section-5"></a>

### 1.4 主要限制

全局 seq 无会话/结果，当前 DOM 问号判提问；隐藏页没有提示音，README 与实现不一致。素材公开再分发需权利审查。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人测试 profile 分开安装两组件，先跑多会话/失败故障矩阵。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

两组件静态可见；提醒称“任务完成”超出事件事实，跨会话关联与隐藏页提示音存在偏差。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js、skin/scripts/install.mjs、skin/skin/hello-kitty-expressive/NOTICE.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态审阅 README、根插件、皮肤安装脚本和 NOTICE；未安装目标。
- 下一步：隔离 profile 触发并行会话、取消/失败、页面隐藏、通知拒绝；核轮询与恢复。

**分析版本**

- **仓库**：[Angel2518975237/deepseek-harness-hello-kitty-suite](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite)
- **版本号**：1.0.1（[固定提交 1b8cd7e](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/tree/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

带会话/结果 ID 的事件推送可减少误提醒与轮询；尚未实现。详见[Q05](#research-q05)。

隔离 profile 触发并行会话、取消/失败、页面隐藏、通知拒绝；核轮询与恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 221 | 193 | 15 | — |
| .md | source | 3 | 164 | — | — | 1578 |
| .mjs | source | 3 | 210 | 185 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/issues?q=is%3Aissue+created%3A2026-09-22T06%3A04%3A07.441Z..2026-10-22T06%3A04%3A07.441Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A04%3A07.441Z..2026-10-22T06%3A04%3A07.441Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：分辨皮肤与提醒安装面，并核完成语义、多会话和素材边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 套件的皮肤与提醒分别解决什么需求？

**研究主题**：场景与需求

#### 完整回答

根包是 DSH 提醒插件，另有 skin 子目录要独立执行安装脚本以复制皮肤并开启 Skin Center。皮肤给浅/暗粉色 UI 与角色装饰；提醒在 agent/turn-stopping 后显示卡片或系统通知。两者安装、宿主依赖和卸载面不同，不应把安装根插件理解为自动装皮肤。截图是作者展示，未独立目视/实机验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-20](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/README.md#L12-L20)

两部分定位。

```text
## ✨ 这是什么

一套给 [DeepSeek Harness](https://github.com/deepseek-ai) Web GUI 的 **Hello Kitty 主题套件**，包含两样东西：

| 部件 | 说明 |
| --- | --- |
| 🎀 **甜心工作台皮肤** | Skin Center v2 用户皮肤（`hello-kitty-expressive`）：奶油白/贝壳粉浅色 + 深莓果暗色双主题；会话头字标、输入框蝴蝶结、侧栏坐姿 Kitty、对话区菱格爱心纹样…… |
| 🔔 **Hello Kitty Task-Done Notifier** | 一轮对话收尾时右上角弹粉色卡片 + 「叮咚」音；页面切走则发系统通知。**大模型以提问收尾时同样提醒你回来回答。** |

```

**依据 2 · 作者声明**：[README.md:45-72](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/README.md#L45-L72)

两条安装路径。

<details>
<summary>查看原文（28行）</summary>

````text
## 📦 安装

### 皮肤

```sh
cd skin
node scripts/install.mjs      # 复制到 ~/.dsh/skins/ 并启用皮肤中心
```

重启 Harness → **设置 → 皮肤中心 → 甜心工作台·强化版 → 应用**。

- 卸载：`node scripts/uninstall.mjs`（可恢复移动，不删源码、不停用皮肤中心）
- 校验：`node scripts/validate.mjs`（用本机皮肤中心真实 v2 校验器）

### 提醒插件（编译型 DSH 插件，本仓库根即插件）

本仓库**根**就是一个可直接安装的 DSH 插件包（`package.json` + `cordis.patch.yml` + `lib/`）。安装：

```sh
# 在 Harness 的插件页粘贴仓库地址，或命令行：
dsh plugin --profile web add https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite.git
```

重新加载/重启 Harness 后，`hello-kitty-notifier` 注册并开始监听：
- 宿主端：`agent/turn-stopping` 每轮自增 `seq`，暴露 `GET /api/hellokitty-notify`；
- 客户端：每 700ms `fetch` 该接口，`seq` 增长后弹粉色卡片 + 声音；提问时显示「有个问题等你回答」。

> 提问检测依赖皮肤中心语义锚点 `[data-dsh-surface="conversation"]` / `[data-dsh-part="message-body"]`，建议与皮肤一起使用。
````

</details>

**依据 3 · 源码核查**：[package.json:1-25](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/package.json#L1-L25)

根插件 manifest。

<details>
<summary>查看原文（25行）</summary>

```text
{
  "name": "deepseek-harness-hello-kitty-suite",
  "version": "1.0.1",
  "description": "💗 一套给 DeepSeek Harness 的粉色 Hello Kitty 主题皮肤 + 任务完成/提问提醒插件（Sweetheart Workspace Expressive skin & Hello Kitty Task-Done Notifier）",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "skin",
    "docs",
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
  "license": "MIT",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
```

</details>

**依据 4 · 源码核查**：[skin/scripts/install.mjs:15-30](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/skin/scripts/install.mjs#L15-L30)

皮肤复制。

<details>
<summary>查看原文（16行）</summary>

```text
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(packageRoot, 'skin', 'hello-kitty-expressive')
const dshHome = process.env.DSH_HOME || join(homedir(), '.dsh')
const profile = process.env.DSH_PROFILE || 'web'
const skinsDir = join(dshHome, 'skins')
const target = join(skinsDir, 'hello-kitty-expressive')
const stamp = new Date().toISOString().replace(/[:.]/g, '-')

if (!existsSync(join(source, 'skin.json'))) {
  throw new Error(`Skin source is incomplete: ${source}`)
}

mkdirSync(skinsDir, { recursive: true })
const stagingRoot = mkdtempSync(join(skinsDir, '.hello-kitty-expressive-'))
const staging = join(stagingRoot, basename(target))
cpSync(source, staging, { recursive: true, errorOnExist: true })
```

</details>

#### 缺口

- 未安装 Skin Center 或目标插件。
  **影响**：真实视觉与版本匹配未知。
  **进一步探讨**：隔离 profile 分别安装验证。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 完成/提问提醒如何从宿主事件传到页面？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

host 监听 agent/turn-stopping，把进程内 seq 自增，并在 /api/hellokitty-notify 返回该全局序号。客户端每 700ms 轮询，首个结果仅设基线，后续 seq 增加才提示；若当前页面最后 message-body 文本以问号结尾就判“提问”，否则称“任务完成”。这是轻量事件桥，但 seq 不含会话/任务 ID，不保证当前页面就是触发事件的会话；turn-stopping 也并非交付成功证据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:10-26](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/lib/index.js#L10-L26)

全局 seq 与端点。

<details>
<summary>查看原文（17行）</summary>

```text
export function apply(ctx) {
  let seq = 0;

  // A turn is about to close (model owes no response): one tick.
  ctx.on('agent/turn-stopping', () => {
    seq += 1;
  });

  // Client polls this endpoint every 700ms.
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/api/hellokitty-notify',
    handler: (req, res) => {
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
      res.end(JSON.stringify({ seq }));
    },
  }));
```

</details>

**依据 2 · 源码核查**：[lib/client.js:83-95](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/lib/client.js#L83-L95)

末条 DOM 问号规则。

<details>
<summary>查看原文（13行）</summary>

```text
// Last assistant message body ends with ? / ？ -> the model asked a question.
function detectQuestion() {
  try {
    if (typeof document === 'undefined') return false;
    var conv = document.querySelector('[data-dsh-surface="conversation"]');
    if (!conv) return false;
    var bodies = conv.querySelectorAll('[data-dsh-part="message-body"]');
    if (!bodies.length) return false;
    var text = (bodies[bodies.length - 1].textContent || '').trim();
    if (!text) return false;
    return /[?？]\s*$/.test(text);
  } catch (e) { return false; }
}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:125-155](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/lib/client.js#L125-L155)

基线与轮询判断。

<details>
<summary>查看原文（31行）</summary>

```text
    React.useEffect(function () {
      var stopped = false;
      var baseline = -1;
      var leaveTimer = null;
      var hideTimer = null;

      var undoTimer = ctx.interval(async function () {
        if (stopped) return;
        try {
          var res = await fetch('/api/hellokitty-notify', { cache: 'no-store' });
          if (!res.ok) return;
          var data = await res.json();
          if (!data || typeof data.seq !== 'number') return;
          if (baseline < 0) { baseline = data.seq; return; }
          if (data.seq > baseline) {
            baseline = data.seq;
            var kind = detectQuestion() ? 'question' : 'done';
            if (isPageVisible()) {
              setToast({ kind: kind });
              setLeaving(false);
              playDingDong();
              if (leaveTimer) leaveTimer();
              if (hideTimer) hideTimer();
              leaveTimer = ctx.timeout(function () { setLeaving(true); }, 1600);
              hideTimer = ctx.timeout(function () { setToast(null); setLeaving(false); }, 2000);
            } else {
              notifySystem(kind);
            }
          }
        } catch (e) { /* ignore */ }
      }, 700);
```

</details>

#### 缺口

- 未验证事件对多会话映射。
  **影响**：跨会话误提醒概率未知。
  **进一步探讨**：并行会话触发、前后台窗口对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 提醒语义、音频和浏览器权限有哪些偏差？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

README 称页面切走会“系统通知 + 提示音”，但 hidden 分支只调用 notifySystem，不调用 playDingDong；声音只在可见页面触发。浏览器 Notification 权限可能拒绝，隐藏分支便无通知；新挂载时把 seq 设基线，会漏掉挂载前结束的回合。提问检测依赖当前 DOM 末条消息尾字符，标点/代码块/其他会话可误判，亦不代表模型真的等待用户输入。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:36-42](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/README.md#L36-L42)

作者声称隐藏页提示音/任务完成。

```text
## 🔔 提醒插件 · Hello Kitty Task-Done Notifier

- 每轮对话收尾（`agent/turn-stopping`）右上角弹粉色卡片 + 「叮咚」音
- 页面切走 → 系统通知 + 提示音（需授权）
- **提问检测**：最后一条助手消息以 `?` / `？` 结尾时，提示 **「有个问题等你回答」** —— 提醒你回到当前对话回答
- 7×24 轮询（700ms），触发即提醒，绝不打扰其它任务

```

**依据 2 · 源码核查**：[lib/client.js:57-76](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/lib/client.js#L57-L76)

通知授权请求。

<details>
<summary>查看原文（20行）</summary>

```text
function requestPermission() {
  try {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'default' && typeof Notification.requestPermission === 'function') {
      Notification.requestPermission().catch(function () {});
    }
  } catch (e) {}
}
function bindPermissionOnGesture() {
  try {
    if (typeof document === 'undefined' || typeof Notification === 'undefined') return;
    if (Notification.permission !== 'default') return;
    var evs = ['pointerdown', 'keydown', 'click'];
    function once() {
      try { requestPermission(); } catch (e) {}
      for (var i = 0; i < evs.length; i++) { try { document.removeEventListener(evs[i], once, true); } catch (e) {} }
    }
    for (var i = 0; i < evs.length; i++) { try { document.addEventListener(evs[i], once, true); } catch (e) {} }
  } catch (e) {}
}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:83-95](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/lib/client.js#L83-L95)

问号启发式。

<details>
<summary>查看原文（13行）</summary>

```text
// Last assistant message body ends with ? / ？ -> the model asked a question.
function detectQuestion() {
  try {
    if (typeof document === 'undefined') return false;
    var conv = document.querySelector('[data-dsh-surface="conversation"]');
    if (!conv) return false;
    var bodies = conv.querySelectorAll('[data-dsh-part="message-body"]');
    if (!bodies.length) return false;
    var text = (bodies[bodies.length - 1].textContent || '').trim();
    if (!text) return false;
    return /[?？]\s*$/.test(text);
  } catch (e) { return false; }
}
```

</details>

**依据 4 · 源码核查**：[lib/client.js:125-155](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/lib/client.js#L125-L155)

可见与隐藏分支差异。

<details>
<summary>查看原文（31行）</summary>

```text
    React.useEffect(function () {
      var stopped = false;
      var baseline = -1;
      var leaveTimer = null;
      var hideTimer = null;

      var undoTimer = ctx.interval(async function () {
        if (stopped) return;
        try {
          var res = await fetch('/api/hellokitty-notify', { cache: 'no-store' });
          if (!res.ok) return;
          var data = await res.json();
          if (!data || typeof data.seq !== 'number') return;
          if (baseline < 0) { baseline = data.seq; return; }
          if (data.seq > baseline) {
            baseline = data.seq;
            var kind = detectQuestion() ? 'question' : 'done';
            if (isPageVisible()) {
              setToast({ kind: kind });
              setLeaving(false);
              playDingDong();
              if (leaveTimer) leaveTimer();
              if (hideTimer) hideTimer();
              leaveTimer = ctx.timeout(function () { setLeaving(true); }, 1600);
              hideTimer = ctx.timeout(function () { setToast(null); setLeaving(false); }, 2000);
            } else {
              notifySystem(kind);
            }
          }
        } catch (e) { /* ignore */ }
      }, 700);
```

</details>

#### 缺口

- 未运行浏览器通知/音频策略。
  **影响**：实际权限提示和声音可达性未知。
  **进一步探讨**：逐权限/标签可见性矩阵测试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 皮肤安装、维护及素材再分发有什么约束？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

安装脚本把皮肤复制到 $DSH_HOME/skins/hello-kitty-expressive，旧目录先 rename 备份，并在找到 Skin Center 和 profile patch 时把该服务 disabled:false；会改用户 profile 文件并留时间戳备份。根插件还依赖 webServer、slots/timer 和浏览器 Notification/Audio API；700ms 每页轮询带来持续 HTTP 流量。素材 NOTICE 明确称非官方授权，公开或商业分发前须换具明确许可的原创素材。

#### 证据与依据

**依据 1 · 源码核查**：[skin/scripts/install.mjs:15-44](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/skin/scripts/install.mjs#L15-L44)

复制与旧皮肤备份。

<details>
<summary>查看原文（30行）</summary>

```text
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(packageRoot, 'skin', 'hello-kitty-expressive')
const dshHome = process.env.DSH_HOME || join(homedir(), '.dsh')
const profile = process.env.DSH_PROFILE || 'web'
const skinsDir = join(dshHome, 'skins')
const target = join(skinsDir, 'hello-kitty-expressive')
const stamp = new Date().toISOString().replace(/[:.]/g, '-')

if (!existsSync(join(source, 'skin.json'))) {
  throw new Error(`Skin source is incomplete: ${source}`)
}

mkdirSync(skinsDir, { recursive: true })
const stagingRoot = mkdtempSync(join(skinsDir, '.hello-kitty-expressive-'))
const staging = join(stagingRoot, basename(target))
cpSync(source, staging, { recursive: true, errorOnExist: true })

let backup = null
try {
  if (existsSync(target)) {
    backup = `${target}.backup-${stamp}`
    renameSync(target, backup)
  }
  renameSync(staging, target)
  rmSync(stagingRoot, { recursive: true, force: true })
} catch (error) {
  if (existsSync(stagingRoot)) rmSync(stagingRoot, { recursive: true, force: true })
  if (backup && !existsSync(target) && existsSync(backup)) renameSync(backup, target)
  throw error
}
```

</details>

**依据 2 · 源码核查**：[skin/scripts/install.mjs:46-86](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/skin/scripts/install.mjs#L46-L86)

Profile patch 开启及备份。

<details>
<summary>查看原文（41行）</summary>

```text
const profileRoot = join(dshHome, 'profiles', profile)
const skinCenterModule = join(
  profileRoot,
  'node_modules',
  '@linxin666',
  'dsh-client-ui-skin-center',
)
const patchPath = join(profileRoot, 'cordis.patch.yml')

let enabledSkinCenter = false
if (existsSync(skinCenterModule) && existsSync(patchPath)) {
  const original = readFileSync(patchPath, 'utf8')
  const lines = original.split('\n')
  let inside = false
  let found = false
  let changed = false

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (/^\s*-\s+id:\s*['"]?web-ui-skin-center['"]?\s*$/.test(line)) {
      inside = true
      found = true
      continue
    }
    if (inside && /^\s*-\s+id:/.test(line)) inside = false
    if (inside && /^\s+disabled:\s*true\s*$/.test(line)) {
      lines[index] = line.replace(/true\s*$/, 'false')
      changed = true
    }
  }

  if (!found) {
    lines.push('- id: web-ui-skin-center', '  disabled: false')
    changed = true
  }

  if (changed) {
    writeFileSync(`${patchPath}.backup-${stamp}`, original)
    writeFileSync(patchPath, lines.join('\n'))
  }
  enabledSkinCenter = true
```

</details>

**依据 3 · 源码核查**：[lib/client.js:125-155](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/lib/client.js#L125-L155)

700ms 轮询。

<details>
<summary>查看原文（31行）</summary>

```text
    React.useEffect(function () {
      var stopped = false;
      var baseline = -1;
      var leaveTimer = null;
      var hideTimer = null;

      var undoTimer = ctx.interval(async function () {
        if (stopped) return;
        try {
          var res = await fetch('/api/hellokitty-notify', { cache: 'no-store' });
          if (!res.ok) return;
          var data = await res.json();
          if (!data || typeof data.seq !== 'number') return;
          if (baseline < 0) { baseline = data.seq; return; }
          if (data.seq > baseline) {
            baseline = data.seq;
            var kind = detectQuestion() ? 'question' : 'done';
            if (isPageVisible()) {
              setToast({ kind: kind });
              setLeaving(false);
              playDingDong();
              if (leaveTimer) leaveTimer();
              if (hideTimer) hideTimer();
              leaveTimer = ctx.timeout(function () { setLeaving(true); }, 1600);
              hideTimer = ctx.timeout(function () { setToast(null); setLeaving(false); }, 2000);
            } else {
              notifySystem(kind);
            }
          }
        } catch (e) { /* ignore */ }
      }, 700);
```

</details>

**依据 4 · 源码核查**：[skin/skin/hello-kitty-expressive/NOTICE.md:1-5](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/skin/skin/hello-kitty-expressive/NOTICE.md#L1-L5)

素材权利说明。

```text
# 素材与使用说明

本皮肤由用户提供的角色参考图片制作，默认按个人使用场景交付。角色名称、形象与相关商标归各自权利人所有；本皮肤包不代表权利人的官方授权、合作或背书。

如果你准备公开发布、商业分发或上架插件市场，请先替换为拥有明确再分发许可的原创素材，并同步更新 `skin.json` 中的名称、许可和署名信息。
```

#### 缺口

- 未核素材实际授权或运行资源消耗。
  **影响**：可分发性与多页负担未知。
  **进一步探讨**：获得权利凭据并测多标签轮询。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样在个人使用场景下验证并降低误提醒？

**研究主题**：新假设与验证、采用判断

#### 完整回答

只在个人测试 profile 启用，先确认皮肤组件与根插件分别可安装/卸载；模拟两个并行会话和任务失败/取消，记录提醒是否对应正确会话与真实结果。若要可信“完成”提醒，宿主事件需携带会话/turn ID 与结果状态，客户端按当前会话过滤；减少 700ms 轮询可改事件推送，这是改进假设而非现有能力。对公开分享先替换角色资产。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:10-26](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/lib/index.js#L10-L26)

当前只传全局 seq。

<details>
<summary>查看原文（17行）</summary>

```text
export function apply(ctx) {
  let seq = 0;

  // A turn is about to close (model owes no response): one tick.
  ctx.on('agent/turn-stopping', () => {
    seq += 1;
  });

  // Client polls this endpoint every 700ms.
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/api/hellokitty-notify',
    handler: (req, res) => {
      res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
      res.end(JSON.stringify({ seq }));
    },
  }));
```

</details>

**依据 2 · 源码核查**：[lib/client.js:83-95](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/lib/client.js#L83-L95)

当前问号启发式。

<details>
<summary>查看原文（13行）</summary>

```text
// Last assistant message body ends with ? / ？ -> the model asked a question.
function detectQuestion() {
  try {
    if (typeof document === 'undefined') return false;
    var conv = document.querySelector('[data-dsh-surface="conversation"]');
    if (!conv) return false;
    var bodies = conv.querySelectorAll('[data-dsh-part="message-body"]');
    if (!bodies.length) return false;
    var text = (bodies[bodies.length - 1].textContent || '').trim();
    if (!text) return false;
    return /[?？]\s*$/.test(text);
  } catch (e) { return false; }
}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:125-155](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/lib/client.js#L125-L155)

700ms 判断。

<details>
<summary>查看原文（31行）</summary>

```text
    React.useEffect(function () {
      var stopped = false;
      var baseline = -1;
      var leaveTimer = null;
      var hideTimer = null;

      var undoTimer = ctx.interval(async function () {
        if (stopped) return;
        try {
          var res = await fetch('/api/hellokitty-notify', { cache: 'no-store' });
          if (!res.ok) return;
          var data = await res.json();
          if (!data || typeof data.seq !== 'number') return;
          if (baseline < 0) { baseline = data.seq; return; }
          if (data.seq > baseline) {
            baseline = data.seq;
            var kind = detectQuestion() ? 'question' : 'done';
            if (isPageVisible()) {
              setToast({ kind: kind });
              setLeaving(false);
              playDingDong();
              if (leaveTimer) leaveTimer();
              if (hideTimer) hideTimer();
              leaveTimer = ctx.timeout(function () { setLeaving(true); }, 1600);
              hideTimer = ctx.timeout(function () { setToast(null); setLeaving(false); }, 2000);
            } else {
              notifySystem(kind);
            }
          }
        } catch (e) { /* ignore */ }
      }, 700);
```

</details>

**依据 4 · 源码核查**：[skin/skin/hello-kitty-expressive/NOTICE.md:1-5](https://github.com/Angel2518975237/deepseek-harness-hello-kitty-suite/blob/1b8cd7e74ae9bb5cc53b82d6ce55dc134d2cc818/skin/skin/hello-kitty-expressive/NOTICE.md#L1-L5)

再分发限制。

```text
# 素材与使用说明

本皮肤由用户提供的角色参考图片制作，默认按个人使用场景交付。角色名称、形象与相关商标归各自权利人所有；本皮肤包不代表权利人的官方授权、合作或背书。

如果你准备公开发布、商业分发或上架插件市场，请先替换为拥有明确再分发许可的原创素材，并同步更新 `skin.json` 中的名称、许可和署名信息。
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
