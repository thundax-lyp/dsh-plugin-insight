# DSH Desktop Sidecar

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[97a8797](https://github.com/111xjyuan/dsh-desktop-sidecar/tree/97a8797791665e7f4ec40c5cbf1640a9b2358821)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/111xjyuan/dsh-desktop-sidecar) [![npm 30d 7,168](https://img.shields.io/static/v1?label=npm+30d&message=7%2C168&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-desktop-sidecar) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-desktop-sidecar)
<!-- END META -->

> **功能**：为 DSH 提供 Windows 屏幕观察、桌面输入、指挥台与浏览器操作。

> **亮点**：把桌面观察和输入步骤组合成同一调用，可在步间读取停止或插话。内置模式另有独立浏览器可按页面元素操作。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

> **主要限制**：用户让步与中止只覆盖实际经过的检查点，序列副作用不会回滚；持久浏览器可保留账户和调试进程。[Q01](#research-q01) [Q03](#research-q03)

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
  - [Q01 · 对无 API 的 Windows 应用，批量操作比人工多了什么，让步和预览能保证哪些事？](#detail-section-11)
  - [Q02 · 在 DSH 指挥台输入一句话，是否会马上打断当前动作？](#detail-section-12)
  - [Q03 · 新增的两种浏览器模式如何使用用户登录态，关闭是否能退出？](#detail-section-13)
  - [Q04 · 哪些验证值得在采用前做，怎样检验更强的执行前目标复核？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要反复操作没有专用 API 的 Windows 应用或网页的 DSH 用户。

手工使用窗口或网页；有应用 API 时可直接通过接口操作并核验结果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 桌面序列 | 在 Windows 窗口执行短批次 | 预览不校验实际命中，停止不回滚 |
| 指挥台 | 插话并在步间交给 Agent | 共享用户级文件，需核对回执 |
| 内部浏览器 | 按元素快照操作页面 | 持久模式保存登录，退出需核对进程 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Windows 可见会话及 DSH tools | 桌面操作必需 | 查控件和输入 | 退回手工或应用接口 |
| Web 宿主服务和右侧栏 | 指挥台必需 | 发送插话 | 检查文件或用人工停止 |
| Edge/Chrome | 内部浏览器必需 | 启动并通过 CDP 操作 | 使用受控屏幕或结束 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选隔离账户和窗口 | 确认实际窗口与权限 |
| 观察 | Agent 读取并预览步骤 | 核对目标后才执行短序列 |
| 中断 | 用户 Esc 或发指挥文本 | 核对仍在动作和已有副作用 |
| 退出 | 关闭测试浏览器，按需重置状态 | 核对进程、登录和应用状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 已有 Windows 与浏览器资源 | 校验 DPI、窗口与权限 | 安装表现未测 |
| 持续 | OCR、CDP 与模型调用开销未知 | 监看目标和用户让步 | 单位合格任务人时未测 |
| 失败恢复 | 外部提交可能不可逆 | 确认状态、恢复窗口和登录 | 退出依赖实际进程与应用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 复用步骤 | 工具执行并记录步骤 | 目标状态准确性 |
| 用户接管 | 序列步间中断 | 真正停止延迟与会话隔离 |
| 浏览器后台 | 独立 CDP 浏览器与 profile | 退出和持久态的可靠性 |

> **思考**：用户让步与中止只覆盖实际经过的检查点，序列副作用不会回滚；持久浏览器可保留账户和调试进程。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把桌面观察和输入步骤组合成同一调用，可在步间读取停止或插话。内置模式另有独立浏览器可按页面元素操作。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

序列能显示动作及停止，但部分路径只返回输入回执。指挥文件按用户共享，CDP profile 有持久和临时分支。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

用户让步与中止只覆盖实际经过的检查点，序列副作用不会回滚；持久浏览器可保留账户和调试进程。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察和短序列，使用可丢弃 Windows 用户和测试窗口。中途停止后读回执并检查实际应用状态。真实账号与不可逆提交应等权限及退出行为验证。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核固定代码的执行和失败边界。实际 Windows、浏览器、权限与停止时延均待验。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、lib/index.js、lib/web.mjs、lib/sequence.mjs、lib/steer.mjs、lib/composer.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读根组件 Host、Web 及主要输入和浏览器路径，未执行目标代码、Windows、登录或真实宿主。
- 下一步：用隔离 Windows 和本地测试站对照焦点争用、部分执行、两会话指挥、浏览器重连和清理。

**分析版本**

- **仓库**：[111xjyuan/dsh-desktop-sidecar](https://github.com/111xjyuan/dsh-desktop-sidecar)
- **版本号**：0.12.0（[固定提交 97a8797](https://github.com/111xjyuan/dsh-desktop-sidecar/tree/97a8797791665e7f4ec40c5cbf1640a9b2358821)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

每个副作用前用更强的窗口和控件签名复核目标，可能减少错位操作。[Q04](#research-q04)

用隔离 Windows 和本地测试站对照焦点争用、部分执行、两会话指挥、浏览器重连和清理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 862 | — | — | 17732 |
| .mjs | source | 26 | 4598 | 3844 | 511 | — |
| .js | source | 2 | 3534 | 3124 | 289 | — |
| .mjs | test | 3 | 520 | 428 | 33 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/111xjyuan/dsh-desktop-sidecar/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/111xjyuan/dsh-desktop-sidecar/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/111xjyuan/dsh-desktop-sidecar/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Windows 用户将界面操作交给 Agent 后，能否观察、控制和安全接管部分完成的桌面或浏览器任务？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对无 API 的 Windows 应用，批量操作比人工多了什么，让步和预览能保证哪些事？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

用户可以把一串读、点、输入交给同一工具，减少模型逐步发工具的往返。Host 在特定 INPUT_TOOLS 调用之前检查用户最近输入，默认等一段时间并报告 user-active，显式参数可跳过；检查在外层，不保证每个序列步骤期间无人操作。dryRun 检查动作名、步骤上限和描述，不运行每步的实际参数定位。实际序列先解析目标窗口，点击可按控件、OCR 或坐标，部分控件路径可按 expect 验证，但相对坐标仍可能落在已变化的目标。序列的 type 使用系统剪贴板，submit 会发 Enter，步骤返回 ok 不等于业务提交成功。Esc 与 steer 在步骤边界检查，已完成动作没有回滚。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:748-797](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/index.js#L748-L797)

列出适用让步的工具，处理显式跳过及注册执行。

<details>
<summary>查看原文（50行）</summary>

```text
  const LITE = String(process.env.DSH_SIDECAR_TOOLS || '').toLowerCase();
  const LITE_ALLOW = new Set(['desktop_windows', 'desktop_look', 'desktop_capture', 'desktop_click', 'desktop_type', 'desktop_key', 'desktop_read', 'desktop_wait', 'desktop_launch', 'desktop_doctor', 'desktop_log']);
  // 会动鼠标/键盘的工具：动手前先看用户是不是正在操作，别去抢。
  const INPUT_TOOLS = new Set(['desktop_click', 'desktop_type', 'desktop_key', 'desktop_scroll', 'desktop_drag', 'desktop_invoke', 'desktop_sequence', 'desktop_course']);
  let LAST_YIELD_WAITED = 0;
  async function yieldGate(name, args) {
    LAST_YIELD_WAITED = 0;
    if (!INPUT_TOOLS.has(name)) return null;
    if (args && args.yieldToUser === false) return null;
    const quietMs = Number(args && args.quietMs) > 0 ? Number(args.quietMs) : 700;
    const maxWaitMs = Number(args && args.maxWaitMs) >= 0 ? Number(args.maxWaitMs) : 5000;
    if (maxWaitMs === 0) return null;
    // 你在用鼠标/键盘时先不动手，但要让这件事被看见：HUD 上写清楚“我在等你”，而不是干等着。
    // 分小片等（每次 220ms），每片都刷一次 HUD，这样用户能立刻看到“它知道我在操作”。
    let waited = 0;
    let since = Date.now();
    let announced = false;
    let r = await waitUserIdle({ quietMs, maxWaitMs: Math.min(220, maxWaitMs) });
    while (!r.ok && Date.now() - since < maxWaitMs) {
      try { pulse('你在用鼠标/键盘，我先等', { tone: 'wait', sub: '停下来我就继续' }); announced = true; } catch {}
      waited = Date.now() - since;
      r = await waitUserIdle({ quietMs, maxWaitMs: Math.min(220, Math.max(0, maxWaitMs - waited)) });
    }
    if (r.ok) { LAST_YIELD_WAITED = announced ? Date.now() - since : 0; if (announced) { try { hideNow(); } catch {} } return null; }
    return {
      ok: false,
      blocked: 'user-active',
      idleMs: r.idle,
      waited: r.waited,
      error: 'you are using the mouse or keyboard right now, so I did not take over',
      hint: 'Nothing was done. I will try again when you stop. To skip this check, pass yieldToUser:false (only do that when the user asked you to keep going).',
    };
  }

  const reg = (t) => {
    if (LITE === 'lite' && !LITE_ALLOW.has(t.name)) return null;
    return ctx.tools.register({
      ...t,
      parameters: withYieldParams(compileParameters(t.parameters || {}), INPUT_TOOLS.has(t.name)),
      output: t.output || textOutput,
      execute: async (...args) => {
        LAST_AMBIG = null;
        const blockedByUser = await yieldGate(t.name, args[0] || {});
        if (blockedByUser) { LAST_AMBIG = null; return blockedByUser; }
        const value = await (t.lock ? withBusy(t.name, () => t.execute(...args)) : t.execute(...args));
        if (INPUT_TOOLS.has(t.name)) { try { markOwnInput(); } catch {} }
        const out = plain(value);
        // 第一次动手时提示一次怎么叫停（只在第一次，标记存在 firstrun.json）。
        if (INPUT_TOOLS.has(t.name)) firstRunNotice();
        // 让用户能核查：这次是靠控件文字（UIA）、靠截图识字（OCR）、还是靠看图定坐标。
```

</details>

**依据 2 · 源码核查**：[lib/sequence.mjs:8-70](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/sequence.mjs#L8-L70)

序列检查步数、动作名、取消并逐步执行；预览不调用 primitives。

<details>
<summary>查看原文（63行）</summary>

```text
export async function runSequence({ steps, dryRun = false, stopOnError = true, maxSteps = DEFAULT_MAX, primitives }) {
  const list = Array.isArray(steps) ? steps : [];
  if (list.length === 0) throw new Error('steps must be a non-empty array');
  const rawMax = Number(maxSteps);
  if (maxSteps !== undefined && (!Number.isFinite(rawMax) || rawMax < 1)) {
    throw new Error('maxSteps must be a positive integer (got ' + JSON.stringify(maxSteps) + ')');
  }
  const limit = Math.max(1, Math.min(Number.isFinite(rawMax) && rawMax > 0 ? rawMax : DEFAULT_MAX, DEFAULT_MAX));
  if (list.length > limit) throw new Error(`too many steps: ${list.length} > maxSteps ${limit}`);

  const log = [];
  let cancelled = false;
  let interrupted = false;
  let steerHit = null;
  const t0 = Date.now();

  for (let i = 0; i < list.length; i++) {
    const step = list[i] || {};
    const action = String(step.action || '').toLowerCase();
    const rec = { i, action, ok: false };
    try {
      // 拼错动作名时，dryRun 以前也会显示“计划成功”，真跑才炸。这里提前说清楚。
      if (!KNOWN_ACTIONS.includes(action)) {
        throw new Error('unknown step action "' + action + '"; use one of: ' + KNOWN_ACTIONS.join(', '));
      }
      // 用户在中途插话：能停就立刻停，把指令原样交回去，让模型据此修正再继续。
      if (primitives.pollSteer && !dryRun) {
        const steer = primitives.pollSteer();
        if (steer) {
          interrupted = true;
          steerHit = steer;
          rec.ok = false; rec.error = 'interrupted by the user';
          log.push(rec);
          break;
        }
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
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2579-2600](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/index.js#L2579-L2600)

固定初始窗口并装配 Esc 和 steer 检查。

<details>
<summary>查看原文（22行）</summary>

```text
    async execute({ window, steps, dryRun, stopOnError, maxSteps, watchSteer }) {
      const w = resolveWindowDefault(window);
      if (!w) throw new Error('window not found: ' + window);
      const refused = refusalFor(w, 'desktop_sequence');
      if (refused) return refused;
      const planned = Array.isArray(steps) ? steps.length : 0;
      pulse('准备执行 ' + planned + ' 步', { reset: true });
      const rect0 = windowClientRect(w);
      const keyMap = { enter: 0x0d, esc: 0x1b, tab: 0x09, space: 0x20, backspace: 0x08, delete: 0x2e, up: 0x26, down: 0x28, left: 0x25, right: 0x27, home: 0x24, end: 0x23, pageup: 0x21, pagedown: 0x22 };
      let stepNo = 0;
      const watch = watchSteer !== false;
      const pollSteerCmd = () => { try { return pollSteer({ stableMs: 650 }); } catch { return null; } };
      const primitives = {
        cancelled: () => { const stop = escPending() || win32.escapePressed(); if (stop) consumeEsc(); return stop; },
        // 用户随时可以在 steer.txt 里写一句话指挥我；下一步开始前读一次。
        pollSteer: () => (watch ? pollSteerCmd() : null),
        sleep: (ms) => sleep(Math.max(0, Math.min(Number(ms) || 0, 15000))),
        exec: async (action, step) => {
          stepNo++;
          pulse('第 ' + stepNo + ' 步 · ' + String(action), { progress: planned ? { done: stepNo - 1, total: planned } : null });
          if (action === 'focus') return { ok: ensureForeground(w.hwnd) };
          if (action === 'wait') { await sleep(step.ms ?? 300); return { ok: true }; }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2628-2659](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/index.js#L2628-L2659)

实际剪贴板与提交，控件匹配部分具备 expect。

<details>
<summary>查看原文（32行）</summary>

```text
          if (action === 'type') {
            if (!ensureForeground(w.hwnd)) return { ok: false, error: 'cannot focus' };
            win32.setClipboardText(String(step.text ?? ''));
            await sleep(400);
            try { const ed = win32.findEditableChild(w.hwnd); if (ed) win32.sendPaste(ed.hwnd); else win32.pressCombo(0x56, true, false, false); }
            catch { win32.pressCombo(0x56, true, false, false); }
            await sleep(220);
            if (step.submit) { win32.pressCombo(0x0d, false, false, false); await sleep(150); }
            return { ok: true, text: String(step.text ?? '').slice(0, 40) };
          }
          if (action === 'click') {
            if (!ensureForeground(w.hwnd)) return { ok: false, error: 'cannot focus' };
            await sleep(100);
            let cx, cy, label = '';
            if (step.ref) {
              const got = lookupRef(w.hwnd, step.ref);
              if (!got || got.error) return { ok: false, error: (got && got.error) || 'ref not found', ref: step.ref };
              const r = got.hit.rect;
              if (!(r && r.w > 0 && r.h > 0)) return { ok: false, error: 'that control has no clickable rect', ref: step.ref };
              cx = Math.round(r.x + r.w / 2); cy = Math.round(r.y + r.h / 2); label = got.hit.name;
            } else if (step.control !== undefined && step.control !== null) {
              const tree = uiaTree(w.hwnd, { depth: 6, max: 600 });
              const el = (tree.elements || [])[Number(step.control)];
              if (!el) return { ok: false, error: 'control index out of range' };
              const want = step.expect;
              if (want) {
                const wn = typeof want === 'string' ? want : String(want.name || '');
                const wr = typeof want === 'object' ? String(want.role || '') : '';
                if ((wn && !String(el.name || '').toLowerCase().includes(wn.toLowerCase())) || (wr && String(el.role) !== wr)) {
                  return { ok: false, error: 'control identity mismatch', actual: el.role + ' "' + el.name + '"' };
                }
              }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:2661-2697](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/index.js#L2661-L2697)

OCR/坐标点击、等待及回执。

<details>
<summary>查看原文（37行）</summary>

```text
            } else if (step.name) {
              const found = findControl(w.hwnd, { name: step.name, role: step.role || '', matchMode: step.match || 'exact' });
              if (!found.ok || !found.rect) return { ok: false, error: found.error || 'control not found', suggestions: found.suggestions, candidates: found.candidates };
              const r = found.rect;
              cx = Math.round(r.x + r.w / 2); cy = Math.round(r.y + r.h / 2); label = found.matched;
            } else if (step.text) {
              const cap = captureWindow(w, 1400);
              const res = ocrBuffer(cap.png, { scale: 1.5, prep: true });
              const hit = findLine(res, step.text);
              if (!hit) return { ok: false, error: 'text not found: ' + step.text };
              const kx = cap.width ? cap.rect.w / cap.width : 1, ky = cap.height ? cap.rect.h / cap.height : 1;
              cx = cap.rect.x + Math.round((hit.x + hit.w / 2) * kx);
              cy = cap.rect.y + Math.round((hit.y + hit.h / 2) * ky);
              label = hit.text;
            } else if (step.x !== undefined && step.y !== undefined) {
              const r = windowClientRect(w);
              cx = r.x + Number(step.x); cy = r.y + Number(step.y);
            } else if (step.fx !== undefined || step.fy !== undefined) {
              const r = windowClientRect(w);
              cx = r.x + Math.round((step.fx ?? 0.5) * r.w); cy = r.y + Math.round((step.fy ?? 0.5) * r.h);
            } else {
              return { ok: false, error: 'click step needs control, text, x/y or fx/fy' };
            }
            pulse('点击 ' + (label ? '「' + label + '」' : '(' + cx + ', ' + cy + ')'), { progress: planned ? { done: stepNo - 1, total: planned } : null });
            win32.screenClick(cx, cy);
            await sleep(step.settle ?? 350);
            return { ok: true, at: { x: cx, y: cy }, text: label };
          }
          return { ok: false, error: 'unknown action: ' + action };
        },
      };
      const res = await runSequence({ steps, dryRun: !!dryRun, stopOnError: stopOnError !== false, maxSteps, primitives });
      consumeEsc();
      const out = plain({ ...res, window: { hwnd: w.hwnd, title: w.title } });
      settle(out.ok !== false && !out.cancelled, out.cancelled ? '已按 Esc 停止' : (out.ok !== false ? '执行完成' : '中途停止'));
      logTool('desktop_sequence', { ok: out.ok !== false, executed: out.executed, failed: out.failed, cancelled: out.cancelled, window: w.hwnd, title: w.title });
      return out;
```

</details>

#### 缺口

- 未在真实 Windows 输入焦点、DPI 或安全桌面验证
  **影响**：序列是否操作正确控件与停止时延未知
  **进一步探讨**：隔离测试多窗口、焦点争用和移动目标

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 在 DSH 指挥台输入一句话，是否会马上打断当前动作？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Web 指挥台连接宿主 steer 路由。路由拒绝显式 cross-site，GET/HEAD 返回同一用户级文件的当前命令，POST 写入文件。实现未按会话传入文件路径，且此处只检查 sec-fetch-site 的显式跨站值，不能替代宿主认证。文件在 LOCALAPPDATA 下，后写覆盖早写，进程内 lastSeen 防止原内容被连续重复消费，mtime 达到稳定窗口才被读取。desktop_sequence 默认在下一步前检查，可用 watchSteer:false 关闭；如果任务正在长等待或执行一个动作，发送文本本身不会终止该动作。用户应核对 interrupted/steer 回执及应用状态再续跑。

#### 证据与依据

**依据 1 · 源码核查**：[lib/composer.js:119-138](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/composer.js#L119-L138)

Host Web 客户端注册指挥台。

<details>
<summary>查看原文（20行）</summary>

```text
      const inject = ['slots', 'sidebarRightTabs']

      function apply(ctx) {
        try {
          ctx.inject(['sidebarRightTabs'], (scoped) => {
            const tabs = typeof scoped.get === 'function' ? scoped.get('sidebarRightTabs') : scoped.sidebarRightTabs
            if (!tabs || typeof tabs.register !== 'function') return
            tabs.register({
              id: TAB_ID,
              kind: TAB_KIND,
              keepMounted: true,
              priority: 'extension',
              title: () => '指挥台',
              guide: [{
                id: TAB_KIND,
                order: 160,
                title: () => '指挥台',
                description: '随时插话，让它按你说的改',
              }],
            })
```

</details>

**依据 2 · 源码核查**：[lib/index.js:642-668](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/index.js#L642-L668)

同一 GET/HEAD/POST 路由，拒绝明确跨站并写文件。

<details>
<summary>查看原文（27行）</summary>

```text
function mountSteerRoute(ctx, readSteerFn, writeSteerFn) {
  try {
    ctx.inject(['webServer'], (scoped) => {
      scoped.webServer.register({
        kind: 'exact',
        path: '/dsh-sidecar/steer',
        handler: (req, res) => {
          const send = (code, obj) => {
            res.statusCode = code;
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(obj));
          };
          const method = String((req && req.method) || 'GET').toUpperCase();
          const site = String(((req && req.headers) || {})['sec-fetch-site'] || '').toLowerCase();
          if (site === 'cross-site') return send(403, { ok: false, error: 'cross-site request refused' });
          if (method === 'GET' || method === 'HEAD') {
            const r = readSteerFn();
            return send(200, { ok: !!r.ok, path: r.path, command: r.command || '' });
          }
          if (method !== 'POST') return send(405, { ok: false, error: 'method not allowed' });
          let body = '';
          req.on('data', (c) => { body += c; if (body.length > 8000) req.destroy(); });
          req.on('end', () => {
            let parsed = {};
            try { parsed = JSON.parse(body || '{}'); } catch {}
            const r = writeSteerFn(parsed && parsed.command);
            send(r.ok ? 200 : 400, r.ok ? { ok: true, path: r.path, command: r.command } : { ok: false, error: r.error || 'write failed' });
```

</details>

**依据 3 · 源码核查**：[lib/steer.mjs:19-28](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/steer.mjs#L19-L28)

同一用户位置保存文件。

<details>
<summary>查看原文（10行）</summary>

```text
export function steerPath() {
  const base = process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE || '.', 'AppData', 'Local');
  return path.join(base, 'dsh-sidecar', 'steer.txt');
}

export function ensureSteerFile() {
  const p = steerPath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  if (!fs.existsSync(p)) fs.writeFileSync(p, HEADER, 'utf8');
  return p;
```

</details>

**依据 4 · 源码核查**：[lib/steer.mjs:53-79](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/steer.mjs#L53-L79)

稳定窗口、进程内去重及写入覆盖。

<details>
<summary>查看原文（27行）</summary>

```text
export function pollSteer({ stableMs = 700 } = {}) {
  const r = readSteer();
  if (!r.ok || !r.command) return null;
  if (r.command === lastSeen) return null;
  // 用文件修改时间判断“用户是不是还在打字”：写完停手 stableMs 之后才算定稿。
  let age = stableMs;
  try { age = Date.now() - fs.statSync(r.path).mtimeMs; } catch {}
  if (age < stableMs) return null;
  lastSeen = r.command;
  return { command: r.command, path: r.path, at: Date.now(), ageMs: age };
}


/** 把一句话写进通道（界面面板和记事本两条路共用这一个写入口）。 */
export function writeSteer(text) {
  const p = ensureSteerFile();
  const cmd = String(text == null ? '' : text)
    .split(String.fromCharCode(13)).join(' ')
    .split(String.fromCharCode(10)).join(' ')
    .trim();
  if (!cmd) return { ok: false, path: p, error: 'empty command' };
  try {
    fs.writeFileSync(p, HEADER + cmd + String.fromCharCode(13, 10), 'utf8');
    lastSeen = null;          // 让 pollSteer 立刻认出新指令
    return { ok: true, path: p, command: cmd };
  } catch (e) {
    return { ok: false, path: p, error: String(e.message || e) };
```

</details>

**依据 5 · 源码核查**：[lib/index.js:2589-2596](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/index.js#L2589-L2596)

序列启用 steer 并采用 650ms 稳定窗口。

```text
      const watch = watchSteer !== false;
      const pollSteerCmd = () => { try { return pollSteer({ stableMs: 650 }); } catch { return null; } };
      const primitives = {
        cancelled: () => { const stop = escPending() || win32.escapePressed(); if (stop) consumeEsc(); return stop; },
        // 用户随时可以在 steer.txt 里写一句话指挥我；下一步开始前读一次。
        pollSteer: () => (watch ? pollSteerCmd() : null),
        sleep: (ms) => sleep(Math.max(0, Math.min(Number(ms) || 0, 15000))),
        exec: async (action, step) => {
```

**依据 6 · 源码核查**：[lib/sequence.mjs:33-48](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/sequence.mjs#L33-L48)

新一步开始前中断，未强杀正在执行的动作。

<details>
<summary>查看原文（16行）</summary>

```text
      // 用户在中途插话：能停就立刻停，把指令原样交回去，让模型据此修正再继续。
      if (primitives.pollSteer && !dryRun) {
        const steer = primitives.pollSteer();
        if (steer) {
          interrupted = true;
          steerHit = steer;
          rec.ok = false; rec.error = 'interrupted by the user';
          log.push(rec);
          break;
        }
      }
      if (primitives.cancelled && primitives.cancelled()) {
        cancelled = true;
        rec.ok = false; rec.error = 'cancelled by Esc';
        log.push(rec);
        break;
```

</details>

#### 缺口

- 未用多会话并发或未认证 Host 做隔离验证
  **影响**：不能保证命令只被预期会话消费
  **进一步探讨**：隔离 profile 同时运行两个任务并核对写入、回执与重启残留

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 新增的两种浏览器模式如何使用用户登录态，关闭是否能退出？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑、工程质量与复用

#### 完整回答

首个 open 缺 mode 时返回选择问题，显式 screen 会调用 Windows 默认浏览器，之后使用桌面工具；explicit internal 用独立 Edge/Chrome 和 CDP，通过快照的 ref 或 selector 执行，工具参数包括本地文件上传。其 profile 默认持久化并可从之前记录的本地端口重连，非普通浏览器账户沙箱的保证。重连只查 loopback 的 /json/version 与地址里的端口形态，未看到更强浏览器身份校验。内部浏览器允许 http/https 及 about:blank，允许 localhost，未限制网络目的为某个业务站点。close 保留持久态；stop 对自己启动的 child 尝试正常关闭和清理，但重新附着没有 child，可能只断开连接。清除登录需显式 reset 并实际核对文件和进程。用户免装独立自动化库的前提是本机已安装受支持浏览器。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:3142-3176](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/index.js#L3142-L3176)

工具参数含两个 mode 和文件上传，代码默认持久配置。

<details>
<summary>查看原文（35行）</summary>

```text
    name: 'desktop_web',
    lock: true,
    description:
      'Drive a web page. Two modes, and you MUST let the user pick before the first navigation: ' +
      'mode:"internal" runs a background Edge/Chrome the user does not have to watch (no mouse stealing, text-first snapshots, click/type by element ref) — best for logging in, filling forms, scraping; ' +
      'mode:"screen" opens the URL in the browser already on the user screen and you continue with desktop_look/desktop_click instead. ' +
      'Call with action:"open" and no mode first: it returns a ready-made question listing the pros AND cons of both options - relay both sides to the user, then use the mode they pick. ' +
      '然后：action:"snapshot" 拿编号元素（ref）→ action:"click"/"type"/"fill" 用 ref 操作。页面跳转后 ref 失效，重新 snapshot。',
    parameters: {
      action: { type: 'string', enum: WEB_ACTIONS, description: 'open | snapshot | click | type | fill | press | scroll | back | forward | reload | wait | screenshot | close | status | reset（reset = 清空登录态）' },
      mode: { type: 'string', enum: MODES, description: 'open 时必填：internal（插件内置后台浏览器）或 screen（用户屏幕上的浏览器）。不给就返回一个问用户的选择题。' },
      url: { type: 'string', description: 'open 的网址，可省略协议（example.com 会补成 https://）。只接受 http/https。' },
      ref: { type: 'number', description: 'snapshot 里元素前面的编号。' },
      selector: { type: 'string', description: '备用：CSS 选择器（有 ref 就用 ref）；upload 时指向 <input type="file">。' },
      tabId: { type: 'string', description: 'switchtab/closetab 要操作的标签 id（先 action:"tabs" 拿列表）。' },
      files: { type: 'array', description: 'upload：要放进文件输入框的本机绝对路径数组。' },
      accept: { type: 'boolean', description: 'dialog：true 同意（确定）/ false 取消；不传则只回报当前弹窗内容。' },
      text: { type: 'string', description: 'type 要写入的内容；click 时可改成按可见文字匹配。' },
      value: { type: 'string', description: 'type 的备用字段（与 text 同义）。' },
      fields: { type: 'array', description: 'fill 用：[{label:"邮箱", value:"a@b.c"}]，按输入框的标签/占位符/name 匹配。' },
      key: { type: 'string', description: 'press 的按键：enter / tab / esc / ctrl+a 等。' },
      delta: { type: 'number', description: 'scroll 的像素，正数向下（默认 600）。' },
      waitText: { type: 'string', description: 'wait：页面文字里出现这个就返回。' },
      waitSelector: { type: 'string', description: 'wait：这个选择器可见就返回。' },
      waitUrl: { type: 'string', description: 'wait：地址里包含这个就返回。' },
      timeoutMs: { type: 'number', description: 'wait 的超时，默认 10000。' },
      maxText: { type: 'number', description: 'snapshot 正文最多多少字，默认 6000。' },
      maxElements: { type: 'number', description: 'snapshot 最多列多少元素，默认 120。' },
      fullPage: { type: 'boolean', description: 'screenshot 是否整页（默认只截可视区）。' },
      headed: { type: 'boolean', description: 'internal 模式是否显示浏览器窗口（默认 false，后台跑）。' },
      replace: { type: 'boolean', description: 'type 是否覆盖原内容（默认 true；false 表示追加）。' },
    },
    async execute(args = {}) {
      const action = String(args.action || 'open').toLowerCase();
      const b = webBrowser({ headed: args.headed === true, profile: args.profile === 'temp' ? 'temp' : 'persistent' });
```

</details>

**依据 2 · 源码核查**：[lib/index.js:3191-3223](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/index.js#L3191-L3223)

无 mode 返回选择，screen 交系统，internal 走 b.goto。

<details>
<summary>查看原文（33行）</summary>

```text
      if (action === 'open') {
        if (args.url) {
          try {
            const checked = assertWebUrl(args.url);
            args.url = checked;
          } catch (e) {
            return { ok: false, error: String((e && e.message) || e) };
          }
        }
        const mode = args.mode ? String(args.mode).toLowerCase() : '';
        if (!MODES.includes(mode)) {
          let openBrowsers = [];
          try {
            openBrowsers = win32.listWindows()
              .filter((w) => /^(msedge|chrome|firefox|brave|opera|vivaldi|360se|360chrome|qqbrowser|sogouexplorer)\.exe$/i.test(w.app || ''))
              .slice(0, 5)
              .map((w) => ({ hwnd: w.hwnd, title: w.title }));
          } catch {}
          return { ...askWhichBrowser(args.url), openBrowsers };
        }
        if (mode === 'screen') {
          const target = args.url ? assertWebUrl(args.url) : '';
          if (!target) return { ok: false, error: 'mode:"screen" 需要 url：先告诉我要打开的地址' };
          spawnSafe('cmd.exe', ['/c', 'start', '', target], { detached: true, stdio: 'ignore', windowsHide: true });
          return {
            ok: true,
            mode: 'screen',
            url: target,
            next: '已经在你的默认浏览器里打开。接下来用 desktop_look 看画面、desktop_click / desktop_type 操作那个窗口。',
          };
        }
        const res = await b.goto(args.url || 'about:blank');
        return { ok: true, mode: 'internal', ...res };
```

</details>

**依据 3 · 源码核查**：[lib/web.mjs:47-60](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/web.mjs#L47-L60)

只按本地端口与调试地址判断可附着。

<details>
<summary>查看原文（14行）</summary>

```text
let liveProfile = null;

/** 上次那个浏览器还活着吗？活着就直接接管，登录态和标签都还在。 */
async function tryAttach(port) {
  if (!port) return null;
  try {
    const res = await fetch('http://127.0.0.1:' + port + '/json/version', { signal: AbortSignal.timeout(1200) });
    if (!res.ok) return null;
    const v = await res.json();
    if (!String(v.webSocketDebuggerUrl || '').includes(':' + port + '/')) return null;
    return v;
  } catch {
    return null;
  }
```

</details>

**依据 4 · 源码核查**：[lib/web.mjs:97-113](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/web.mjs#L97-L113)

URL 允许范围及 localhost。

<details>
<summary>查看原文（17行）</summary>

```text
export function assertWebUrl(url) {
  let t = String(url || '').trim();
  if (t === 'about:blank') return t;
  // 模型经常只写 example.com 或 localhost:3000，这里补全协议再判断
  const local = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?(\/|$)/i.test(t);
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(t) || /^(file|javascript|data|about|mailto|ftp|ws|wss):/i.test(t);
  if (!hasScheme) t = (local ? 'http://' : 'https://') + t;
  let u;
  try {
    u = new URL(t);
  } catch {
    throw new Error('这个地址不完整：' + JSON.stringify(String(url)) + '（要带 http:// 或 https://）');
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error('内置浏览器只打开 http/https 网页，不接受 ' + u.protocol + '（本地文件请直接用编辑器/资源管理器打开）');
  }
  return u.href;
```

</details>

**依据 5 · 源码核查**：[lib/web.mjs:284-334](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/web.mjs#L284-L334)

重连或启动以及 profile 目录与调试端口。

<details>
<summary>查看原文（51行）</summary>

```text
  async ensure() {
    if (this.status === 'ready' && this.cdp) return;
    if (this.status === 'starting') throw new Error('浏览器还在启动，请稍等再试');
    this.status = 'starting';
    try {
      const bin = browserPath();

      // 一、上次那个浏览器还活着（DSH 重启过、但浏览器没关）→ 直接接管，登录态不用重登
      if (this.profile === 'persistent') {
        const rec = readProfileState();
        if (rec && rec.port && (await tryAttach(rec.port))) {
          this.port = rec.port;
          this.profileDir = PROFILE_ROOT;
          this.attached = true;
          await this.connectTab(rec.port);
          this.status = 'ready';
          this.lastError = '';
          return;
        }
      }

      // 二、正常启动：持久模式用固定目录（记住登录），临时模式用完就删
      const port = await this.pickPort();
      if (port === null) throw new Error('9222-9262 都被占用，找不到空闲调试端口');
      this.port = port;
      this.attached = false;
      if (this.profile === 'persistent') {
        mkdirSync(PROFILE_ROOT, { recursive: true });
        this.profileDir = PROFILE_ROOT;
      } else {
        this.profileDir = await mkdtemp(join(tmpdir(), PROFILE_PREFIX));
        liveProfile = this.profileDir;
      }
      const argv = [
        '--remote-debugging-port=' + port,
        '--user-data-dir=' + this.profileDir,
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-session-crashed-bubble',
        '--hide-crash-restore-bubble',
        '--disable-features=Translate',
      ];
      if (this.headed) argv.push('--window-size=1280,860');
      else argv.push('--headless=new', '--disable-gpu');
      argv.push('about:blank');
      this.child = spawn(bin, argv, { stdio: 'ignore', windowsHide: !this.headed });
      this.child.once('exit', () => { this.child = null; this.cdp?.close(); this.cdp = null; this.status = 'stopped'; });
      this.child.once('error', (e) => { this.status = 'error'; this.lastError = String(e && e.message || e); });
      await this.waitForVersion(port);
      if (this.profile === 'persistent') writeProfileState({ port, pid: this.child ? this.child.pid : null, at: new Date().toISOString() });
      await this.connectTab(port);
```

</details>

**依据 6 · 源码核查**：[lib/web.mjs:758-804](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/web.mjs#L758-L804)

关闭自身 child、保留持久态和 reset 删除。

<details>
<summary>查看原文（47行）</summary>

```text
  async stop() {
    const child = this.child;
    this.child = null;
    // 先请求浏览器自己优雅退出（它才会把 cookie/登录态刷到磁盘），超时再强杀
    if (child && this.port) {
      try {
        const v = await fetch('http://127.0.0.1:' + this.port + '/json/version', { signal: AbortSignal.timeout(1200) });
        if (v.ok) {
          const info = await v.json();
          if (info && info.webSocketDebuggerUrl) {
            const cdp = new Cdp(info.webSocketDebuggerUrl);
            try { await cdp.call('Browser.close', {}, 1500); } catch {}
            cdp.close();
            for (let i = 0; i < 20; i++) {
              try { process.kill(child.pid, 0); await sleep(100); } catch { break; } // 进程已退出
            }
          }
        }
      } catch {}
    }
    try { this.cdp?.close(); } catch {}
    this.cdp = null;
    if (child && !child.killed) { try { child.kill(); } catch {} }
    this.status = 'stopped';
    await sleep(200);
    // 持久 profile 留着（登录态在里面）；只有临时 profile 才删
    if (this.profileDir && this.profile === 'temp') {
      for (let i = 0; i < 4; i++) {
        try { await rm(this.profileDir, { recursive: true, force: true }); break; } catch { await sleep(200 * (i + 1)); }
      }
      if (liveProfile === this.profileDir) liveProfile = null;
      this.profileDir = null;
    }
    if (this.profile === 'persistent') {
      // 只要我们确实关掉了自己启动的那个浏览器，就把“还记得的端口”清掉
      if (child) { try { rmSync(PROFILE_STATE, { force: true }); } catch {} }
      this.attached = false;
    }
  }

  /** 清空内置浏览器的登录态（下次等于全新） */
  async resetProfile() {
    await this.stop();
    if (this.profile === 'persistent') {
      for (let i = 0; i < 4; i++) {
        try { await rm(PROFILE_ROOT, { recursive: true, force: true }); break; } catch { await sleep(250 * (i + 1)); }
      }
```

</details>

**依据 7 · 源码核查**：[lib/index.js:3256-3271](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/index.js#L3256-L3271)

工具 close 及 reset 回执。

<details>
<summary>查看原文（16行）</summary>

```text
      if (action === 'close') {
        const st = b.state();
        await _resetWeb();
        return {
          ok: true,
          closed: true,
          was: st,
          loginKept: st.profile !== 'temp',
          note: st.profile === 'temp' ? '临时配置，已随关掉删除' : '登录状态留在 ' + st.profileDir + '，下次接着用',
        };
      }

      if (action === 'reset') {
        const was = b.state();
        const out = await b.resetProfile();
        return { ok: true, ...out, was, note: '登录态已清空，下次打开等于全新浏览器' };
```

</details>

#### 缺口

- 未执行真实浏览器、上传、重连和清理
  **影响**：持久目录与账号隔离、远端端口行为未知
  **进一步探讨**：在测试用户中用本地站点测 temp/持久、断电重启和 reset 后目录及进程

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些验证值得在采用前做，怎样检验更强的执行前目标复核？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

先选可丢弃 Windows 用户和窗口，优先只读观察、带名称或 ref 的单步，再试 dryRun 与短序列。比较执行前重新核对窗口和控件签名与当前动作级检查；移窗、改 DPI、换相同标题的窗口、在序列中制造部分失败，统计错点、误拒绝和接管时延。若加强复核只增加观察往返而不减少错点则放弃。浏览器试用优先临时配置，不用现有账号或生产提交；一旦标签、目标、用户命令回执或已改状态无法确认，就改为人工接管。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2642-2658](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/index.js#L2642-L2658)

ref 与控件身份检查为对照机制。

<details>
<summary>查看原文（17行）</summary>

```text
            if (step.ref) {
              const got = lookupRef(w.hwnd, step.ref);
              if (!got || got.error) return { ok: false, error: (got && got.error) || 'ref not found', ref: step.ref };
              const r = got.hit.rect;
              if (!(r && r.w > 0 && r.h > 0)) return { ok: false, error: 'that control has no clickable rect', ref: step.ref };
              cx = Math.round(r.x + r.w / 2); cy = Math.round(r.y + r.h / 2); label = got.hit.name;
            } else if (step.control !== undefined && step.control !== null) {
              const tree = uiaTree(w.hwnd, { depth: 6, max: 600 });
              const el = (tree.elements || [])[Number(step.control)];
              if (!el) return { ok: false, error: 'control index out of range' };
              const want = step.expect;
              if (want) {
                const wn = typeof want === 'string' ? want : String(want.name || '');
                const wr = typeof want === 'object' ? String(want.role || '') : '';
                if ((wn && !String(el.name || '').toLowerCase().includes(wn.toLowerCase())) || (wr && String(el.role) !== wr)) {
                  return { ok: false, error: 'control identity mismatch', actual: el.role + ' "' + el.name + '"' };
                }
```

</details>

**依据 2 · 源码核查**：[lib/sequence.mjs:44-70](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/sequence.mjs#L44-L70)

取消和部分执行边界是可观察判据。

<details>
<summary>查看原文（27行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[lib/web.mjs:783-804](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/97a8797791665e7f4ec40c5cbf1640a9b2358821/lib/web.mjs#L783-L804)

临时与持久配置清理差别。

<details>
<summary>查看原文（22行）</summary>

```text
    // 持久 profile 留着（登录态在里面）；只有临时 profile 才删
    if (this.profileDir && this.profile === 'temp') {
      for (let i = 0; i < 4; i++) {
        try { await rm(this.profileDir, { recursive: true, force: true }); break; } catch { await sleep(200 * (i + 1)); }
      }
      if (liveProfile === this.profileDir) liveProfile = null;
      this.profileDir = null;
    }
    if (this.profile === 'persistent') {
      // 只要我们确实关掉了自己启动的那个浏览器，就把“还记得的端口”清掉
      if (child) { try { rmSync(PROFILE_STATE, { force: true }); } catch {} }
      this.attached = false;
    }
  }

  /** 清空内置浏览器的登录态（下次等于全新） */
  async resetProfile() {
    await this.stop();
    if (this.profile === 'persistent') {
      for (let i = 0; i < 4; i++) {
        try { await rm(PROFILE_ROOT, { recursive: true, force: true }); break; } catch { await sleep(250 * (i + 1)); }
      }
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
