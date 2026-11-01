# DSH Desktop Sidecar

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[e35ca01](https://github.com/111xjyuan/dsh-desktop-sidecar/tree/e35ca01f74bdc8980581374ee6b376f17c6c1782)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/111xjyuan/dsh-desktop-sidecar) [![npm 30d 2,072](https://img.shields.io/static/v1?label=npm+30d&message=2%2C072&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-desktop-sidecar) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-desktop-sidecar)
<!-- END META -->

> **功能**：为 DSH 提供 Windows 桌面观察和输入控制工具。

> **亮点**：将窗口识别、输入及批量步骤接入代理工具。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：预览不校验所有参数，取消在步骤边界检查且不回滚已完成动作。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 谁需要桌面 sidecar，和手工操作有什么取舍？](#detail-section-11)
  - [Q02 · 批量执行如何限制步骤和停止，dry-run 验证哪些？](#detail-section-12)
  - [Q03 · 锁屏保护或成功结果是否保证任务无副作用？](#detail-section-13)
  - [Q04 · 如何在真实桌面低风险试用？](#detail-section-14)
  - [Q05 · 已有 dry-run 与逐步停止之外，怎样降低目标变化造成的误操作？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要自动操作无专用 API 的 Windows 应用的用户；基线是手工完成界面操作。[Q01](#research-q01)

用户观察界面并手动点击与输入。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 观察 | 查窗口和控件 | 识别取决于系统 |
| 动作 | 点击和输入 | 真实副作用 |
| 序列 | 预览及限步执行 | 停止不回滚 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| Windows 与 DSH tools | 必需 | 运行插件 | 手工操作 |
| koffi 及系统 API | 必需 | 控件与输入 | 停止执行 |
| 可见隔离窗口与用户监督 | 试用必需 | 核对目标和副作用 | 不执行 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选择隔离窗口 | 核对目标与权限 |
| 预览 | 观察并 dry-run 步骤 | 参数仍需人工确认 |
| 执行 | 逐步监督并查看结果 | 异常按 Esc 并核对已执行动作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Windows 主机 | 配置隔离窗口 | 系统兼容未测 |
| 持续 | 模型与桌面资源 | 全程监督 | 节时与误操作率未知 |
| 恢复 | 可能有真实副作用 | 手工核对 | 已执行动作不自动回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 序列 | 步数限制、预览与停止 | 参数及识别正确性 |
| 保护 | 安全桌面判断代码 | 所有真实场景有效 |

> **思考**：预览不校验所有参数，取消在步骤边界检查且不回滚已完成动作。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将窗口识别、输入及批量步骤接入代理工具。[Q01](#research-q01) [Q02](#research-q02)

dry-run 检查动作类型并描述，Esc 在每步前检查，首错默认停止。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

预览不校验所有参数，取消在步骤边界检查且不回滚已完成动作。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离窗口先观察和预览，逐步监督；异常停止并核对已有副作用。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持序列限制和停止条件；未运行 Windows 或真实桌面。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/sequence.mjs、lib/index.js、lib/guard.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 24 文件、零排除和解析错误；静态检查序列和安全判断，未运行 Windows。
- 下一步：在隔离 Windows 桌面验证识别、系统安全界面、取消时效与部分执行。

**分析版本**

- **仓库**：[111xjyuan/dsh-desktop-sidecar](https://github.com/111xjyuan/dsh-desktop-sidecar)
- **版本号**：0.6.2（[固定提交 e35ca01](https://github.com/111xjyuan/dsh-desktop-sidecar/tree/e35ca01f74bdc8980581374ee6b376f17c6c1782)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：副作用前重新比对目标与观察快照可能降低错位操作，须对照已有 dry-run 与截图校验。[Q05](#research-q05)

在隔离 Windows 桌面验证识别、系统安全界面、取消时效与部分执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 476 | — | — | 9037 |
| .mjs | source | 18 | 2699 | 2276 | 290 | — |
| .js | source | 1 | 1981 | 1823 | 104 | — |
| .mjs | test | 2 | 204 | 163 | 13 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/111xjyuan/dsh-desktop-sidecar/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Windows 桌面动作如何批量执行，停止与 dry-run 可以保证什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要桌面 sidecar，和手工操作有什么取舍？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要让 DSH 操作无专用接口的 Windows 软件的用户，可使用窗口、控件、文字和多步骤动作。相对手工点击，它把识别和操作暴露为工具，但真实界面变化、权限和误操作需要人工监督；单次简单操作可能手工更快。作者声明兼容性和系统保护不代表本轮实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-22](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/e35ca01f74bdc8980581374ee6b376f17c6c1782/README.md#L1-L22)

作者描述能力与保护。

<details>
<summary>查看原文（22行）</summary>

```text
# dsh-desktop-sidecar

给 DeepSeek Harness 加一双「手」：让 AI 在 Windows 上真正操作你的电脑——看屏幕、读文字、点按钮、打字、按快捷键，包括微信、Office、浏览器、网课播放器这些没有自动化接口的软件。

装一个 npm 包就能用，不需要另外装 Python、驱动或中间服务。

操作时屏幕右下角会出现一条状态条（深色圆角小卡片，左边一个青色呼吸点，右边显示进度，比如 `3/7`；整条不抢焦点、鼠标能穿过它），按 Esc 可以随时叫停。

## 写在前面

我不是专业做这个的，能力和精力都有限，肯定还有没考虑周全的地方。你如果在用的时候遇到 bug、或者觉得哪里别扭，欢迎来提 [Issue](https://github.com/111xjyuan/dsh-desktop-sidecar/issues)——你的反馈是它变好的主要来源。功能建议也欢迎，我不一定都能做，但会认真看。

**现在它能做的：**

- 列出当前有哪些窗口，找到你要操作的那个
- 读出窗口里的文字（Windows 自带离线 OCR，中文优先）和控件结构
- 点按钮、点文字、点坐标——点完会截图比对，界面没变就重试或告诉你原因
- 输入文字（中文也行：能直接写进输入框就写值，否则发真按键，都不占你的剪贴板）、按任意组合键
- 一次调用跑完一串步骤，中途可以按 Esc 停下
- 网课自动播放：判断是否在播、自动切下一节
- 每次操作都有屏幕提示 + 操作日志，随时能查它到底点了哪儿
- 锁屏、UAC 提权确认这类系统安全界面一律拒绝，不会乱按
```

</details>

**依据 2 · 源码核查**：[package.json:1-8](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/e35ca01f74bdc8980581374ee6b376f17c6c1782/package.json#L1-L8)

Windows 桌面插件身份。

```text
{
  "name": "dsh-desktop-sidecar",
  "version": "0.6.2",
  "description": "Windows 桌面控制插件：原生看屏幕、读文字、点控件、打字、按键——微信/Office/浏览器/网课都能操作。零外部运行时（koffi 直调 Win32），离线 OCR 兜底，点击像素校验，UIA 控件树带索引点击。Native Windows desktop control for DeepSeek Harness.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js"
```

#### 缺口

- 未运行 Windows、DSH 或真实桌面
  **影响**：无法验证控件识别、锁屏保护及取消时效
  **进一步探讨**：固定 Windows 与宿主，在隔离应用测试识别、拒绝和中断

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 批量执行如何限制步骤和停止，dry-run 验证哪些？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

runSequence 最多接受 24 步，逐步检查动作名与取消，dry-run 描述计划并跳过执行；实际执行依次调用 primitive，默认首错停止，也可关闭 stopOnError。dry-run 只在此层检查动作名和数量，并不证明坐标、控件或目标窗口有效；Esc 在步骤开始前检查，不能由此保证即时打断正在执行的原子动作。

#### 证据与依据

**依据 1 · 源码核查**：[lib/sequence.mjs:4-16](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/e35ca01f74bdc8980581374ee6b376f17c6c1782/lib/sequence.mjs#L4-L16)

动作列表及数量限制。

<details>
<summary>查看原文（13行）</summary>

```text
const DEFAULT_MAX = 24;

const KNOWN_ACTIONS = ['focus', 'click', 'type', 'key', 'scroll', 'drag', 'wait', 'read', 'screenshot', 'invoke', 'text'];

export async function runSequence({ steps, dryRun = false, stopOnError = true, maxSteps = DEFAULT_MAX, primitives }) {
  const list = Array.isArray(steps) ? steps : [];
  if (list.length === 0) throw new Error('steps must be a non-empty array');
  const rawMax = Number(maxSteps);
  if (maxSteps !== undefined && (!Number.isFinite(rawMax) || rawMax < 1)) {
    throw new Error('maxSteps must be a positive integer (got ' + JSON.stringify(maxSteps) + ')');
  }
  const limit = Math.max(1, Math.min(Number.isFinite(rawMax) && rawMax > 0 ? rawMax : DEFAULT_MAX, DEFAULT_MAX));
  if (list.length > limit) throw new Error(`too many steps: ${list.length} > maxSteps ${limit}`);
```

</details>

**依据 2 · 源码核查**：[lib/sequence.mjs:22-62](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/e35ca01f74bdc8980581374ee6b376f17c6c1782/lib/sequence.mjs#L22-L62)

动作检查、取消、dry-run 与实际执行。

<details>
<summary>查看原文（41行）</summary>

```text
  for (let i = 0; i < list.length; i++) {
    const step = list[i] || {};
    const action = String(step.action || '').toLowerCase();
    const rec = { i, action, ok: false };
    try {
      // 拼错动作名时，dryRun 以前也会显示“计划成功”，真跑才炸。这里提前说清楚。
      if (!KNOWN_ACTIONS.includes(action)) {
        throw new Error('unknown step action "' + action + '"; use one of: ' + KNOWN_ACTIONS.join(', '));
      }
      if (primitives.cancelled && primitives.cancelled()) {
        cancelled = true;
        rec.ok = false; rec.error = 'cancelled by Esc';
        log.push(rec);
        break;
      }
      if (dryRun) {
        rec.ok = true; rec.dryRun = true;
        rec.would = describe(action, step);
        log.push(rec);
        continue;
      }
      const t = Date.now();
      const res = await primitives.exec(action, step, { index: i, total: list.length });
      rec.ok = !(res && res.ok === false);
      rec.ms = Date.now() - t;
      if (res && typeof res === 'object') {
        for (const k of ['changed', 'changedPx', 'via', 'text', 'at', 'matched', 'control', 'error', 'lines', 'path', 'note']) {
          if (res[k] !== undefined) rec[k] = res[k];
        }
      }
      log.push(rec);
      if (!rec.ok && stopOnError) {
        rec.stopped = true;
        break;
      }
      if (step.waitAfter) await primitives.sleep(Number(step.waitAfter));
    } catch (e) {
      rec.ok = false;
      rec.error = String((e && e.message) || e);
      log.push(rec);
      if (stopOnError) { rec.stopped = true; break; }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1540-1559](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/e35ca01f74bdc8980581374ee6b376f17c6c1782/lib/index.js#L1540-L1559)

工具入口选项及取消来源。

<details>
<summary>查看原文（20行）</summary>

```text
    description: 'Run several desktop actions in ONE call: focus, click (control/text/x,y), type, key, scroll, wait, read, screenshot. Each step is an object {action, ...}. dryRun returns the plan without touching anything; stopOnError (default true) halts on the first failure; a step limit (maxSteps, 24) bounds runaway loops; the user can abort at any moment by holding Esc. Prefer this for any multi-step task: it replaces N round trips with one.',
    parameters: {
      window: { type: 'string', required: true, description: 'Target window: hwnd or a title substring.' },
      steps: { type: 'array', items: { type: 'object' }, description: 'Steps: {action:"click",ref|name|control|text|x,y|fx,fy} | {action:"type",text,submit} | {action:"key",key} | {action:"scroll",clicks,direction} | {action:"wait",ms} | {action:"focus"} | {action:"read"} | {action:"screenshot"}.' },
      dryRun: { type: 'boolean', description: 'Only validate and describe the steps, do not execute them.' },
      stopOnError: { type: 'boolean', description: 'Stop at the first failing step (default true).' },
      maxSteps: { type: 'number', description: 'Hard limit on step count (default and max 24).' },
    },
    async execute({ window, steps, dryRun, stopOnError, maxSteps }) {
      const w = resolveWindowDefault(window);
      if (!w) throw new Error('window not found: ' + window);
      const refused = refusalFor(w, 'desktop_sequence');
      if (refused) return refused;
      const planned = Array.isArray(steps) ? steps.length : 0;
      pulse('准备执行 ' + planned + ' 步', { reset: true });
      const rect0 = windowClientRect(w);
      const keyMap = { enter: 0x0d, esc: 0x1b, tab: 0x09, space: 0x20, backspace: 0x08, delete: 0x2e, up: 0x26, down: 0x28, left: 0x25, right: 0x27, home: 0x24, end: 0x23, pageup: 0x21, pagedown: 0x22 };
      let stepNo = 0;
      const primitives = {
        cancelled: () => { const stop = escPending() || win32.escapePressed(); if (stop) consumeEsc(); return stop; },
```

</details>

#### 缺口

- 未运行 Windows、DSH 或真实桌面
  **影响**：无法验证控件识别、锁屏保护及取消时效
  **进一步探讨**：固定 Windows 与宿主，在隔离应用测试识别、拒绝和中断

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 锁屏保护或成功结果是否保证任务无副作用？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不能。保护代码依据输入桌面、锁屏信号等判断敏感状态，仍依赖 Windows API 和实际调用路径；序列停止不会撤销之前完成的点击或输入。界面改变、目标错位、误识别及外部请求可能造成不可逆副作用，用户应观察日志与结果，不将 dry-run 当安全证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/guard.mjs:105-128](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/e35ca01f74bdc8980581374ee6b376f17c6c1782/lib/guard.mjs#L105-L128)

作者注释及锁屏判断信号。

<details>
<summary>查看原文（24行）</summary>

```text
 * 纯判断函数（可单测）：把「输入桌面名」「WTS 标志」「锁屏进程」三个信号合成结论。
 * 背景（issue #5）：会话里可能残留一个没有窗口的 LockApp.exe，此时桌面其实是 Default、系统已解锁，
 * 只凭 lockapp 进程就判锁屏会把所有输入工具全拒掉。所以：
 *  - 输入桌面不是 Default（UAC / 切换用户）= 绝对不碰；
 *  - LogonUI 在跑 = 真锁屏（Win11 锁屏时它照样在）；
 *  - 桌面是 Default 且没有 LogonUI = 已解锁，残留的 LockApp 不算数；
 *  - 读不到桌面名时退回旧逻辑（flags===0 且无进程信息 → 保守判锁定）。
 */
export function decideLocked(flags, hosts, desktopName) {
  const h = hosts || {};
  const name = desktopName == null ? null : String(desktopName);
  const onDefault = name != null && name.toLowerCase() === 'default';
  const bothHosts = !!(h.logonui && h.lockapp);
  if (name != null && !onDefault) return { locked: true, source: 'desktop:' + name };
  if (h.logonui) return { locked: true, source: bothHosts ? 'process' : 'logonui' };
  if (onDefault) {
    return { locked: false, source: h.lockapp ? 'desktop+orphan-lockapp' : 'desktop' };
  }
  if (flags === 0) {
    if (h.known === false) return { locked: true, source: 'WTS+no-proc-info' };
    if (h.lockapp) return { locked: true, source: 'WTS' };
  }
  return { locked: false, source: flags === null ? 'none' : 'WTS' };
}
```

</details>

**依据 2 · 源码核查**：[lib/guard.mjs:138-151](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/e35ca01f74bdc8980581374ee6b376f17c6c1782/lib/guard.mjs#L138-L151)

安全桌面检测分支。

<details>
<summary>查看原文（14行）</summary>

```text

/** 当前是否处在不能操作的状态（锁屏 / UAC / 切换用户 / 安全窗口）。 */
export function secureDesktop(win) {
  const st = lockState();
  if (st.locked) {
    return {
      active: true, locked: true, app: 'LockScreen',
      detail: st.source === 'WTS' ? 'Windows 会话处于锁屏状态' : '检测到锁屏界面进程（LogonUI / LockApp）',
      state: st,
    };
  }
  const name = inputDesktopName();
  if (name && name.toLowerCase() !== 'default') {
    return { active: true, desktop: name, app: 'Winlogon', detail: '输入桌面是 ' + name + '（UAC 提权确认 / 切换用户）', state: st };
```

</details>

**依据 3 · 源码核查**：[lib/sequence.mjs:43-62](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/e35ca01f74bdc8980581374ee6b376f17c6c1782/lib/sequence.mjs#L43-L62)

实际步骤先执行后逐项报告并停止。

<details>
<summary>查看原文（20行）</summary>

```text
      const t = Date.now();
      const res = await primitives.exec(action, step, { index: i, total: list.length });
      rec.ok = !(res && res.ok === false);
      rec.ms = Date.now() - t;
      if (res && typeof res === 'object') {
        for (const k of ['changed', 'changedPx', 'via', 'text', 'at', 'matched', 'control', 'error', 'lines', 'path', 'note']) {
          if (res[k] !== undefined) rec[k] = res[k];
        }
      }
      log.push(rec);
      if (!rec.ok && stopOnError) {
        rec.stopped = true;
        break;
      }
      if (step.waitAfter) await primitives.sleep(Number(step.waitAfter));
    } catch (e) {
      rec.ok = false;
      rec.error = String((e && e.message) || e);
      log.push(rec);
      if (stopOnError) { rec.stopped = true; break; }
```

</details>

#### 缺口

- 未运行 Windows、DSH 或真实桌面
  **影响**：无法验证控件识别、锁屏保护及取消时效
  **进一步探讨**：固定 Windows 与宿主，在隔离应用测试识别、拒绝和中断

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何在真实桌面低风险试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包声明 win32 和 koffi、DSH tools 依赖；需要用户在可见桌面监督。先选隔离测试窗口及无敏感数据，先观察、dry-run，再逐步执行并检查结果，保持 Esc 可用；发生误点或身份/目标不明停止并人工核对，不能假定已完成步骤可回滚。Windows API、宿主权限和可访问性兼容性未测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:42-55](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/e35ca01f74bdc8980581374ee6b376f17c6c1782/package.json#L42-L55)

依赖及平台声明。

<details>
<summary>查看原文（14行）</summary>

```text
  "license": "MIT",
  "dependencies": {
    "koffi": "^3.3.3"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": ">=0.1.5-rc.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "os": [
    "win32"
```

</details>

**依据 2 · 源码核查**：[lib/sequence.mjs:22-62](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/e35ca01f74bdc8980581374ee6b376f17c6c1782/lib/sequence.mjs#L22-L62)

预览、取消与首错停止边界。

<details>
<summary>查看原文（41行）</summary>

```text
  for (let i = 0; i < list.length; i++) {
    const step = list[i] || {};
    const action = String(step.action || '').toLowerCase();
    const rec = { i, action, ok: false };
    try {
      // 拼错动作名时，dryRun 以前也会显示“计划成功”，真跑才炸。这里提前说清楚。
      if (!KNOWN_ACTIONS.includes(action)) {
        throw new Error('unknown step action "' + action + '"; use one of: ' + KNOWN_ACTIONS.join(', '));
      }
      if (primitives.cancelled && primitives.cancelled()) {
        cancelled = true;
        rec.ok = false; rec.error = 'cancelled by Esc';
        log.push(rec);
        break;
      }
      if (dryRun) {
        rec.ok = true; rec.dryRun = true;
        rec.would = describe(action, step);
        log.push(rec);
        continue;
      }
      const t = Date.now();
      const res = await primitives.exec(action, step, { index: i, total: list.length });
      rec.ok = !(res && res.ok === false);
      rec.ms = Date.now() - t;
      if (res && typeof res === 'object') {
        for (const k of ['changed', 'changedPx', 'via', 'text', 'at', 'matched', 'control', 'error', 'lines', 'path', 'note']) {
          if (res[k] !== undefined) rec[k] = res[k];
        }
      }
      log.push(rec);
      if (!rec.ok && stopOnError) {
        rec.stopped = true;
        break;
      }
      if (step.waitAfter) await primitives.sleep(Number(step.waitAfter));
    } catch (e) {
      rec.ok = false;
      rec.error = String((e && e.message) || e);
      log.push(rec);
      if (stopOnError) { rec.stopped = true; break; }
```

</details>

**依据 3 · 作者声明**：[README.md:15-22](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/e35ca01f74bdc8980581374ee6b376f17c6c1782/README.md#L15-L22)

作者描述工具和屏幕提示。

```text
- 列出当前有哪些窗口，找到你要操作的那个
- 读出窗口里的文字（Windows 自带离线 OCR，中文优先）和控件结构
- 点按钮、点文字、点坐标——点完会截图比对，界面没变就重试或告诉你原因
- 输入文字（中文也行：能直接写进输入框就写值，否则发真按键，都不占你的剪贴板）、按任意组合键
- 一次调用跑完一串步骤，中途可以按 Esc 停下
- 网课自动播放：判断是否在播、自动切下一节
- 每次操作都有屏幕提示 + 操作日志，随时能查它到底点了哪儿
- 锁屏、UAC 提权确认这类系统安全界面一律拒绝，不会乱按
```

#### 缺口

- 未运行 Windows、DSH 或真实桌面
  **影响**：无法验证控件识别、锁屏保护及取消时效
  **进一步探讨**：固定 Windows 与宿主，在隔离应用测试识别、拒绝和中断

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有 dry-run 与逐步停止之外，怎样降低目标变化造成的误操作？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：执行每个有副作用步骤前将目标窗口身份与最近观察快照比较，变化时暂停让用户重新确认，可能减少错位点击。已有动作预览、逐步 Esc 检查和首错停止，并非从零引入确认；未穷尽现有其他目标校验，快照误报和隐私成本需评估。对照当前机制在窗口切换、弹窗与正常场景测误操作、误停和耗时，收益不足或误报过高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/sequence.mjs:22-62](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/e35ca01f74bdc8980581374ee6b376f17c6c1782/lib/sequence.mjs#L22-L62)

已有 dry-run、Esc 和首错停止。

<details>
<summary>查看原文（41行）</summary>

```text
  for (let i = 0; i < list.length; i++) {
    const step = list[i] || {};
    const action = String(step.action || '').toLowerCase();
    const rec = { i, action, ok: false };
    try {
      // 拼错动作名时，dryRun 以前也会显示“计划成功”，真跑才炸。这里提前说清楚。
      if (!KNOWN_ACTIONS.includes(action)) {
        throw new Error('unknown step action "' + action + '"; use one of: ' + KNOWN_ACTIONS.join(', '));
      }
      if (primitives.cancelled && primitives.cancelled()) {
        cancelled = true;
        rec.ok = false; rec.error = 'cancelled by Esc';
        log.push(rec);
        break;
      }
      if (dryRun) {
        rec.ok = true; rec.dryRun = true;
        rec.would = describe(action, step);
        log.push(rec);
        continue;
      }
      const t = Date.now();
      const res = await primitives.exec(action, step, { index: i, total: list.length });
      rec.ok = !(res && res.ok === false);
      rec.ms = Date.now() - t;
      if (res && typeof res === 'object') {
        for (const k of ['changed', 'changedPx', 'via', 'text', 'at', 'matched', 'control', 'error', 'lines', 'path', 'note']) {
          if (res[k] !== undefined) rec[k] = res[k];
        }
      }
      log.push(rec);
      if (!rec.ok && stopOnError) {
        rec.stopped = true;
        break;
      }
      if (step.waitAfter) await primitives.sleep(Number(step.waitAfter));
    } catch (e) {
      rec.ok = false;
      rec.error = String((e && e.message) || e);
      log.push(rec);
      if (stopOnError) { rec.stopped = true; break; }
```

</details>

**依据 2 · 作者声明**：[README.md:15-21](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/e35ca01f74bdc8980581374ee6b376f17c6c1782/README.md#L15-L21)

作者描述点击后截图比对。

```text
- 列出当前有哪些窗口，找到你要操作的那个
- 读出窗口里的文字（Windows 自带离线 OCR，中文优先）和控件结构
- 点按钮、点文字、点坐标——点完会截图比对，界面没变就重试或告诉你原因
- 输入文字（中文也行：能直接写进输入框就写值，否则发真按键，都不占你的剪贴板）、按任意组合键
- 一次调用跑完一串步骤，中途可以按 Esc 停下
- 网课自动播放：判断是否在播、自动切下一节
- 每次操作都有屏幕提示 + 操作日志，随时能查它到底点了哪儿
```

#### 缺口

- 未运行 Windows、DSH 或真实桌面
  **影响**：无法验证控件识别、锁屏保护及取消时效
  **进一步探讨**：固定 Windows 与宿主，在隔离应用测试识别、拒绝和中断

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
