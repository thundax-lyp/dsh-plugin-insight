# dsh-computer-use

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[3cf9bd8](https://github.com/988hj7tczd-oss/dsh-computer-use/tree/3cf9bd8ae60271512f263bfa75485cb242ca0892)

<!-- BEGIN META -->
[![GitHub ★ 60](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-computer-use) [![npm 30d 3,522](https://img.shields.io/static/v1?label=npm+30d&message=3%2C522&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-computer-use) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-computer-use)
<!-- END META -->

> **实现功能**：为DSH接入cua-driver的AX/截图观察与桌面点击输入等十二工具，支持虚拟光标、图像附件和可选视觉观察者。

> **核心亮点**：把原生driver接入DSH十二工具与附件/视觉路由，提供局部目标/时效/前台单次审批和可见轨迹；不是新桌面引擎。详见[Q01](#research-q01)。

> **风险与缺陷**：元素click路径忽略ttlMs、snapshot与driver session全局共享，compact/zoom图像无完整变换绑定，密码/危险词仅有限element标签；ok不能当安全业务完成。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 适合什么桌面任务，哪些能力属于驱动？](#detail-section-11)
  - [Q02 · 观察、坐标与视觉模式是否同一个可执行参照？](#detail-section-12)
  - [Q03 · TTL、密码/危险操作和会话范围有哪些缺口？](#detail-section-13)
  - [Q04 · 视觉数据、子进程与返回值会怎样失败？](#detail-section-14)
  - [Q05 · 启动、持续和失败恢复成本怎样展示？](#detail-section-15)
  - [Q06 · 推荐与进一步探索入口是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合没有稳定业务API、需要观察原生/Canvas应用后用鼠标键盘完成明确任务的DSH用户。基线手工桌面操作或裸cua-driver命令；插件把AX/截图观察、动作目标与可见虚拟光标、按需视觉模型接成12个模型工具。合格结果应重新观察并核业务变化，driver返回delivered/插件ok不是业务成功证明。

跨平台桌面事件/Accessibility能力来自外部cua-driver，插件贡献在DSH工具接口、图像附件/视觉路由与局部守卫适配，不是新桌面引擎。作者macOS演示/平台说明为作者报告，不能推Windows/Linux或本轮真实宿主验证。屏幕内容和控制权敏感，即使不移动用户真实鼠标，操作仍有真实副作用。

人工桌面或裸cua-driver/API自动化；现有增量是DSH工具/视觉与局部护栏，不改变业务结果验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| AX/native/vision | 观察目标窗口 | 可能自动截图/模型外发 |
| 点击/输入/滚拖 | 调外部原生driver | 时效/会话/空间绑定有缺口 |
| 虚拟光标 | 可见运动与点击 | 不等业务可撤销或安全 |
| 部分guard | 白名单/标签/前台审批 | 非所有坐标/焦点/语言风险识别 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=22.18与DSH tools/approval/schemastery | 十二工具与单次审批 | 固定peer范围，非任意DSH兼容 |
| 固定cua-driver与OS辅助功能/录屏权限 | 桌面观察/输入/虚拟光标 | 外部引擎/平台实际支持另核 |
| attachments/图像模型或视觉provider | native/vision | 图片持久化与模型数据边界 |
| 显式允许app/单任务会话 | 控制范围 | 全局snapshot非多Agent隔离 |
| 可选GLM key与可信API_BASE | fallback | 不信“免费”作预算/隐私保证 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定部署 | 核driver/OS权限/审批和模型路由 | 不操作日常秘密窗口 |
| 观察 | 明确窗口/模式 | 核真实像素空间/捕获时间 |
| 执行 | 优先明确token/目标 | 当前元素TTL/角色覆盖缺口先修 |
| 回读 | 再观察业务结果 | ok/delivered不等完成 |
| 失败 | 确认是否发生效果后恢复 | 模糊失败不盲重放/前台切焦 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | driver/OS权限/Host附件与模型配置 | 审可信二进制、窗口范围和像素映射 | 配置工时/驱动依赖费用未知 |
| 持续使用 | 每步子进程/AX文本与图像token、附件存储，视觉额外请求 | 观察/审批/业务结果复核 | AX零视觉token非总token0，费用/延时未知 |
| 失败恢复 | 重观察/重连session、可能重复请求/残留child | 核实际界面效果/恢复焦点/清附件策略 | 无硬取消/恰好一次，恢复与误操作损失未知 |



#### 效果

| 目标 | 当前增量 | 边界 |
| --- | --- | --- |
| 桌面可达 | DSH十二工具接driver | 原生引擎能力非插件新算法 |
| 可观察动作 | AX/图片/虚拟轨迹 | token/坐标/缩放语义需一致 |
| 局部克制 | 部分TTL/白名单/审批fallback | 非完整风险/会话隔离 |

只有固定任务的正确完成率/误操作率/模型成本对照，才能判断是否胜过人工或业务API自动化。

> **思考**：元素click路径忽略ttlMs、snapshot与driver session全局共享，compact/zoom图像无完整变换绑定，密码/危险词仅有限element标签；ok不能当安全业务完成。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把原生driver接入DSH十二工具与附件/视觉路由，提供局部目标/时效/前台单次审批和可见轨迹；不是新桌面引擎。详见[Q01](#research-q01)。

把原生driver接入DSH十二工具与附件/视觉路由，提供局部目标/时效/前台单次审批和可见轨迹；不是新桌面引擎。详见[Q01](#research-q01)。

snapshot.js只有模块全局snapshot，CUA_SESSION默认固定字符串，未按DSH Agent/session分区；多个Agent相继观察会覆盖彼此目标。guard基于当前snapshot.appName做allowedApps（默认空不限制），观察/启动不受白名单约束，app_launch含可选bring_to_front不被同一审批检查。共享快照不是会话安全边界。

元素click/double/right走humanAction→resolveClickTarget(index,ttlMs)，该函数完全没用ttlMs，guard只核snapshot存在而不isFresh，所以本地30秒TTL在这些路径缺失；坐标click/type/key/scroll/drag通过resolveWindow/Token有时效检查。外部element_token可能由driver另判，但不由适配代码证明。另外snapshot.at在视觉处理完成后Date.now才记，不是捕获时刻，慢视觉可给旧画面重新计TTL。

密码与危险词仅args.element对应已缓存role/label才检查；密码role仅两个macOS名称，危险词仅中文删除/支付/注销等，坐标/无element输入/快捷键和图标或英语目标未覆盖。不能把这种提示式守卫当全面风险识别。审批等待期间/实际执行前也未重抓目标，TTL更不能验证界面语义未变。

前台输入fallback只在driver声明background失败/建议foreground后请求allowed-once，拒绝/无服务关闭，是可借鉴路径。但它批准的是已组装payload，等待后未重新验证快照/焦点；业务结果仍需再观察。

<a id="detail-section-5"></a>

### 1.4 主要限制

元素click路径忽略ttlMs、snapshot与driver session全局共享，compact/zoom图像无完整变换绑定，密码/危险词仅有限element标签；ok不能当安全业务完成。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，仅研究者可丢弃无秘密环境评估，先修元素TTL/会话/图像变换与效果状态，不直接启日常桌面全权。详见[Q06](#research-q06)。

跨平台桌面事件/Accessibility能力来自外部cua-driver，插件贡献在DSH工具接口、图像附件/视觉路由与局部守卫适配，不是新桌面引擎。作者macOS演示/平台说明为作者报告，不能推Windows/Linux或本轮真实宿主验证。屏幕内容和控制权敏感，即使不移动用户真实鼠标，操作仍有真实副作用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。桌面工具适配有价值，当前安全/时效与所见即所点主张有明确静态限制。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/guard.js、lib/snapshot.js、lib/actions.js、lib/cua.js、lib/human.js、lib/observe.js、lib/vision.js、tests/action-refusal.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整index与guard/snapshot/actions/cua/human关键实现，observe窗口/模式/变换/缓存、vision外呼/流和作者对象拒绝测试；未全审外部driver/OS，不执行截图/桌面/模型/测试或读取key文件。
- 下一步：可继续假driver/clock/两Agent/缩图与审批交错矩阵核错目标和重复效果，原型未实现。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-computer-use](https://github.com/988hj7tczd-oss/dsh-computer-use)
- **版本号**：0.3.2（[固定提交 3cf9bd8](https://github.com/988hj7tczd-oss/dsh-computer-use/tree/3cf9bd8ae60271512f263bfa75485cb242ca0892)）
- **版本日期**：2026-10-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索逐Agent绑定捕获时刻/窗口/scale的动作凭据及统一拒绝/unknown效果，按假driver交错矩阵证伪；未实现。详见[Q06](#research-q06)。

可继续假driver/clock/两Agent/缩图与审批交错矩阵核错目标和重复效果，原型未实现。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 1011 | — | — | 10102 |
| .js | source | 8 | 1793 | 1338 | 340 | — |
| .mjs | test | 8 | 458 | 407 | 0 | — |
| .mjs | source | 1 | 244 | 198 | 24 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-computer-use/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-computer-use/issues?q=is%3Aissue+created%3A2026-09-22T10%3A33%3A42.985Z..2026-10-22T10%3A33%3A42.985Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-computer-use/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T10%3A33%3A42.985Z..2026-10-22T10%3A33%3A42.985Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核driver归属、观察/坐标/时效/会话边界、审批与视觉数据/取消、成本及可证伪动作凭据。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合什么桌面任务，哪些能力属于驱动？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合没有稳定业务API、需要观察原生/Canvas应用后用鼠标键盘完成明确任务的DSH用户。基线手工桌面操作或裸cua-driver命令；插件把AX/截图观察、动作目标与可见虚拟光标、按需视觉模型接成12个模型工具。合格结果应重新观察并核业务变化，driver返回delivered/插件ok不是业务成功证明。

跨平台桌面事件/Accessibility能力来自外部cua-driver，插件贡献在DSH工具接口、图像附件/视觉路由与局部守卫适配，不是新桌面引擎。作者macOS演示/平台说明为作者报告，不能推Windows/Linux或本轮真实宿主验证。屏幕内容和控制权敏感，即使不移动用户真实鼠标，操作仍有真实副作用。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-27](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/index.js#L1-L27)

工具和主张。

<details>
<summary>查看原文（27行）</summary>

```text
/**
 * dsh-computer-use —— Computer Use 插件：给 harness-desktop 增加"虚拟鼠标真人操作"。
 *
 * 工具集（Hermes 风格，模型友好）：
 *   screen_observe          看屏幕：AX 编号树 + 坐标 / 原生直读 / 视觉观察者
 *   screen_zoom             区域截图直读（≤500px JPEG，细节放大看）
 *   computer_click          点击（element 编号 或 x/y 坐标）
 *   computer_double_click   双击
 *   computer_right_click    右键
 *   computer_type           文本输入
 *   computer_key            按键 / 快捷键
 *   computer_scroll         滚动
 *   computer_drag           拖拽
 *   computer_wait           等待 / 轮询间隔
 *   app_list                列出应用
 *   app_launch              启动应用
 *
 * 视觉能力（原生接入）：
 *   - mode="native"：截图经 attachments 持久化后以图片块返回，主对话模型
 *     （如 deepseek-v4-flash-vision-exp）直接看图 —— 零外部 API、零额外 key。
 *   - mode="vision"：DeepSeek 视觉观察者（ctx.llm）结构化描述截图（免 ZHIPU key），
 *     不可用时回退 GLM 免费模型。
 *   - ax：零成本 AX 树；AX 树为空时自动降级 native → vision → ax。
 *
 * 安全设计（P1 已内建，P3 深化）：
 *   - 观察快照 TTL：过期后拒绝动作，必须重新观察（element_token 引擎侧双重校验）
 *   - 动作一律要求先 screen_observe（无快照直接拒绝，杜绝盲操作）
```

</details>

**依据 2 · 源码核查**：[lib/cua.js:85-110](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/cua.js#L85-L110)

外部driver argv调用。

<details>
<summary>查看原文（26行）</summary>

```text
/** 底层单次调用（不含会话自愈）。 */
function rawCall(tool, args = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(CUA_BIN, ['call', tool, JSON.stringify(args)], {
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let out = ''
    let err = ''
    child.stdout.on('data', (d) => { out += d })
    child.stderr.on('data', (d) => { err += d })
    child.on('error', (e) => {
      const hint = e.code === 'ENOENT'
        ? `未找到 cua-driver：请确保它已安装并在 PATH 中，或确认官方安装器路径 ~/.cua-driver/packages/current/cua-driver.exe 可用，或设置环境变量 CUA_DRIVER_BIN 指向完整路径。`
        : ''
      reject(new Error(`cua-driver 无法启动 (${CUA_BIN}): ${e.message}${hint ? ' ' + hint : ''}`))
    })
    child.on('close', (code) => {
      if (code !== 0) {
        const msg = (err || out).trim()
        reject(new Error(`cua-driver ${tool} 失败 (exit ${code}): ${msg.slice(0, 800)}`))
        return
      }
      try {
        resolve(JSON.parse(out))
      } catch {
        reject(new Error(`cua-driver ${tool} 返回非 JSON: ${out.slice(0, 500)}`))
```

</details>

**依据 3 · 源码核查**：[lib/human.js:65-89](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/human.js#L65-L89)

虚拟光标与实际点击。

<details>
<summary>查看原文（25行）</summary>

```text
export async function humanClick(opts) {
  const { pid, windowId, x, y, sx, sy, token, count = 1, button = 'left' } = opts

  // 1. 光标滑行到目标（最佳努力，看得见过程）
  if (sx != null && sy != null) {
    await glideCursor(sx, sy, { target: { kind: 'window', pid, window_id: windowId } })
  }

  // 2. 点击：token 优先（AX 路径），否则像素路径（窗口本地截图像素）
  const payload = { session: CUA_SESSION, pid }
  if (token) {
    payload.element_token = token
    // token 路径同样透传计数/按钮，否则双击/右键会静默退化成单次左键
    payload.count = count
    payload.button = button
  } else {
    if (x == null || y == null) throw new Error('humanClick: 缺少点击坐标（x/y）。')
    payload.window_id = windowId
    payload.x = x
    payload.y = y
    payload.count = count
    payload.button = button
  }
  const value = await cuaCall('click', payload)
  return value
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 观察、坐标与视觉模式是否同一个可执行参照？

**研究主题**：功能与机制

#### 完整回答

screen_observe列可见窗口，指定pid/标题/app子串首个匹配，不匹配明确拒绝；未指定按z序挑。get_window_state取AX及可选截图，过滤可操作元素，保存编号→token/label/坐标、pid/window与snapshot。AX/native/vision分别返回树、附件图片、观察者描述；普通AX退化时也可能自动抓图走native或配置GLM，不能把ax等同永不截图/外发。

坐标契约应是整窗截图像素，human.windowLocalOf目前恒等。native compact/auto超附件限额时却调用整窗zoom压成≤500px JPEG，返回图宽/高是缩小图，snapshot仍原始截图尺寸，没有保存scale映射。若模型按所见紧凑图像素点击，直接identity传driver原图坐标会偏；element token路径另论。

screen_zoom可独立指定窗口/裁剪，返回图但不更新snapshot或带明确crop→整窗transform；函数result说“直接传截图坐标”，工具description又提醒仍整窗坐标，两处口径冲突。之后动作仍绑定先前screen_observe窗口，不等“最新看图即最新操作对象”。图像缩放/裁剪需明确回推，不能靠TTL解决空间错配。

#### 证据与依据

**依据 1 · 源码核查**：[lib/observe.js:214-261](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/observe.js#L214-L261)

窗口与取态。

<details>
<summary>查看原文（48行）</summary>

```text
  // 2. 选目标窗口：参数 window（pid / 标题子串）→ 否则 z 序最前
  let target = null
  const want = args.window
  if (want !== undefined && want !== null && want !== '') {
    const wantStr = String(want)
    target = windows.find((w) => String(w.pid) === wantStr)
      || windows.find((w) => (w.title || '').toLowerCase().includes(wantStr.toLowerCase()))
      || windows.find((w) => (w.app_name || '').toLowerCase().includes(wantStr.toLowerCase()))
  }
  if (!target && want !== undefined && want !== null && want !== '') {
    const candidates = windows
      .map((w) => `${w.app_name || ''} · ${w.title || ''} · pid=${w.pid}`)
      .join('\n')
    return {
      ok: false,
      result:
        `未找到指定窗口「${String(want)}」，已拒绝继续操作。\n` +
        `当前可见窗口：\n${candidates || '无'}`,
    }
  }
  if (!target) {
    const sorted = [...windows].sort((a, b) => (b.z_index || 0) - (a.z_index || 0))
    target = sorted[0]
  }

  // 3. AX 树（vision / native 模式同时抓截图）
  const needShot = wantMode === 'vision' || wantMode === 'native'
  const gwArgs = {
    pid: target.pid,
    window_id: target.window_id,
    include_screenshot: needShot,
    max_elements: maxElements,
  }
  if (args.query) gwArgs.query = String(args.query)
  let state = await cuaCall('get_window_state', withSession(gwArgs))
  const rawElements = Array.isArray(state.elements) ? state.elements : []
  const elements = rawElements.filter(isActionable)
  // 截图缺失（首次 ax 调用后才降级）→ 补抓
  const needShotNow = needShot || (wantMode !== 'vision' && wantMode !== 'native'
    && (Boolean(state.degraded_reason) || rawElements.length === 0) && (await routeImageCapable(ctx, exec) || glmVisionConfigured()))
  if (needShotNow && !state.screenshot_png_b64) {
    const v = await cuaCall('get_window_state', withSession({
      pid: target.pid,
      window_id: target.window_id,
      include_screenshot: true,
      max_elements: maxElements,
    }))
    state = { ...state, ...v }
```

</details>

**依据 2 · 源码核查**：[lib/observe.js:270-342](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/observe.js#L270-L342)

模式与保存快照。

<details>
<summary>查看原文（73行）</summary>

```text
  if (wantMode === 'native') {
    const capable = await routeImageCapable(ctx, exec)
    if (!capable) {
      const { provider, model } = { provider: exec?.agent?.options?.provider, model: exec?.agent?.options?.model }
      return {
        ok: false,
        result: `原生视觉模式（mode="native"）需要当前对话模型支持图片输入，但当前 route ${provider}/${model} 未声明 image 能力。`
          + '请切换到视觉模型（如 deepseek-v4-flash-vision-exp），或使用 mode="vision"（观察者）/ mode="ax"。',
      }
    }
    try {
      const { ref, width, height, compact } = await commitScreenshot(ctx, target, state, cfg)
      image = {
        attachmentId: ref.attachmentId,
        mediaType: ref.mediaType,
        bytes: ref.bytes,
        width: ref.width ?? width,
        height: ref.height ?? height,
        name: ref.name,
      }
      effectiveMode = 'native'
      visionText = compact
        ? '（紧凑图：原始截图超附件限额，已用引擎 zoom 降采样为 ≤500px JPEG）'
        : ''
    } catch (err) {
      return { ok: false, result: `原生截图失败：${err.message}` }
    }
  } else if (wantMode === 'vision') {
    visionText = await describeVision(ctx, cfg, state, target, exec)
    effectiveMode = 'vision'
  } else { // ax 默认
    if (degraded) {
      if (await routeImageCapable(ctx, exec)) {
        try {
          const { ref, width, height } = await commitScreenshot(ctx, target, state, cfg)
          image = { attachmentId: ref.attachmentId, mediaType: ref.mediaType, bytes: ref.bytes, width: ref.width ?? width, height: ref.height ?? height, name: ref.name }
          effectiveMode = 'native'
        } catch {
          effectiveMode = 'ax'
        }
      } else if (glmVisionConfigured()) {
        visionText = await describeVision(ctx, cfg, state, target, exec)
        effectiveMode = 'vision'
      }
    }
  }

  // 5. 快照缓存（element_token 自带的 snapshot_id 由引擎校验）
  const entries = new Map()
  for (const e of elements) {
    const c = centerOf(e)
    entries.set(e.element_index, {
      token: e.element_token,
      role: safeStr(e.role, 40),
      label: safeStr(e.label || e.value || '', 100),
      x: c ? c.x : null,
      y: c ? c.y : null,
    })
  }
  setSnapshot({
    at: Date.now(),
    ttlMs: cfg.ttlMs,
    pid: target.pid,
    windowId: target.window_id,
    appName: target.app_name || '',
    snapshotId: state.snapshot_id,
    entries,
    elementCount: state.element_count,
    totalElementCount: state.total_element_count,
    mode: effectiveMode,
    screenshotWidth: state.screenshot_width || null,
    screenshotHeight: state.screenshot_height || null,
  })
```

</details>

**依据 3 · 源码核查**：[lib/observe.js:121-159](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/observe.js#L121-L159)

compact缩放。

<details>
<summary>查看原文（39行）</summary>

```text
async function commitScreenshot(ctx, target, state, cfg) {
  const attachments = ctx?.get?.('attachments')
  if (!attachments) {
    throw new Error('当前环境未挂载 attachments 服务，无法持久化截图（原生视觉不可用）。')
  }
  const pngBuf = buf(state.screenshot_png_b64)
  const maxBytes = attachments.imageLimits?.maxImageBytes ?? 5 * 1024 * 1024
  const compact = cfg.nativeImage === 'compact'
    || (cfg.nativeImage !== 'full' && pngBuf.byteLength > maxBytes)

  let data = pngBuf
  let mediaType = state.screenshot_mime_type === 'image/jpeg' ? 'image/jpeg' : 'image/png'
  let width = state.screenshot_width
  let height = state.screenshot_height
  let name = `screen-${target.pid}.png`

  if (compact) {
    // 整窗 zoom：x/y 用原始截图像素范围，引擎输出 ≤500px 宽的 JPEG
    const w = state.screenshot_width || 1
    const h = state.screenshot_height || 1
    const zv = await cuaCall('zoom', withSession({
      pid: target.pid,
      window_id: target.window_id,
      x1: 0,
      y1: 0,
      x2: w,
      y2: h,
    }))
    const jpeg = buf(zv?.screenshot_png_b64)
    if (jpeg.byteLength === 0) throw new Error('zoom 降级截图失败：引擎返回空图片。')
    data = jpeg
    mediaType = (zv?.mime_type === 'image/jpeg') ? 'image/jpeg' : 'image/jpeg'
    width = zv?.width || width
    height = zv?.height || height
    name = `screen-${target.pid}-compact.jpg`
  }

  const ref = await attachments.saveImage({ data, mediaType, name })
  return { ref, width, height, compact }
```

</details>

**依据 4 · 源码核查**：[lib/human.js:51-56](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/human.js#L51-L56)

坐标恒等。

```text
/**
 * 窗口本地截图像素 ⇄ 屏幕坐标换算不再需要：0.21.0 直接接受截图像素。
 * 保留函数仅为兼容旧调用（坐标原样返回）。
 */
export function windowLocalOf(x, y, _snap) {
  return { x, y }
```

**依据 5 · 源码核查**：[lib/observe.js:402-456](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/observe.js#L402-L456)

zoom无更新/映射。

<details>
<summary>查看原文（55行）</summary>

```text
export async function screenZoom(ctx, args, cfg, exec) {
  const capable = await routeImageCapable(ctx, exec)
  if (!capable) {
    return { ok: false, result: 'screen_zoom 需要当前对话模型支持图片输入（原生直读），请使用视觉模型（如 deepseek-v4-flash-vision-exp）。' }
  }
  // pid 缺省时按 window_id 从窗口表解析（引擎 zoom 需要 pid）
  let pid = args.pid
  if (!pid) {
    const winList = await cuaCall('list_windows', { on_screen_only: true })
    const hit = (winList.windows || []).find((w) => Number(w.window_id) === Number(args.window_id))
    if (!hit) return { ok: false, result: `window_id ${args.window_id} 不在当前可见窗口列表中。` }
    pid = hit.pid
  }
  const size = await cuaCall('get_window_state', withSession({
    pid,
    window_id: args.window_id,
    include_screenshot: true,
    max_elements: 1,
  }))
  const w = size?.screenshot_width || 1
  const h = size?.screenshot_height || 1
  const x1 = args.x1 ?? 0
  const y1 = args.y1 ?? 0
  const x2 = args.x2 ?? w
  const y2 = args.y2 ?? h
  const attachments = ctx?.get?.('attachments')
  if (!attachments) return { ok: false, result: '当前环境未挂载 attachments 服务。' }
  const zv = await cuaCall('zoom', withSession({
    pid,
    window_id: args.window_id,
    x1: Math.max(0, Number(x1)),
    y1: Math.max(0, Number(y1)),
    x2: Math.max(1, Math.min(w, Number(x2))),
    y2: Math.max(1, Math.min(h, Number(y2))),
  }))
  const jpeg = buf(zv?.screenshot_png_b64)
  if (jpeg.byteLength === 0) return { ok: false, result: 'zoom 返回空图片。' }
  const ref = await attachments.saveImage({
    data: jpeg,
    mediaType: 'image/jpeg',
    name: `screen-zoom-${args.window_id}.jpg`,
  })
  const image = {
    attachmentId: ref.attachmentId,
    mediaType: ref.mediaType,
    bytes: ref.bytes,
    width: ref.width ?? zv?.width,
    height: ref.height ?? zv?.height,
    name: ref.name,
  }
  return {
    ok: true,
    result: `区域截图完成（${image.width}×${image.height}px JPEG）：坐标为窗口本地截图像素，点击时直接传截图坐标。`,
    image,
  }
```

</details>

**依据 6 · 源码核查**：[index.js:208-224](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/index.js#L208-L224)

zoom描述口径。

<details>
<summary>查看原文（17行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'screen_zoom',
    description:
      '区域截图直读：裁剪窗口某块区域（截图像素坐标）为 ≤500px JPEG 并以图片返回，当前对话模型直接看图。' +
      '用于"放大某块区域细看"（小字、图标、图表），图片 token 远小于整窗截图。' +
      '坐标范围可用 screen_observe 的结果里的窗口截图尺寸（截图像素）估算；返回的图片即所见区域，' +
      '之后 computer_click(x=,y=) 的坐标仍指整窗截图像素 —— 若需要点击 zoom 图内坐标，请先看参照。',
    parameters: {
      pid: { type: 'integer', description: '可选：目标窗口所属进程 pid（screen_observe 输出）；缺省按 window_id 解析。' },
      window_id: { type: 'integer', required: true, description: '目标窗口 id（screen_observe 或 app_list 输出）。' },
      x1: { type: 'integer', description: '可选：区域左边界（整窗截图像素），默认 0。' },
      y1: { type: 'integer', description: '可选：区域上边界，默认 0。' },
      x2: { type: 'integer', description: '可选：区域右边界，默认窗口截图宽。' },
      y2: { type: 'integer', description: '可选：区域下边界，默认窗口截图高。' },
    },
    output: { ...OUT(IMAGE_FIELD), render: renderWithImage },
    execute: wrap('screen_zoom', (args, cfg2, exec) => screenZoom(ctx, args, cfg2, exec)),
```

</details>

#### 缺口

- 缩放/裁剪坐标与driver版本的真实对应尚无本轮独立验证。
  **影响**：不能保证所见图像像素直接点到目标。
  **进一步探讨**：固定假窗口/原图与compact/crop尺寸，核回传transform和最终driver坐标，不点击真实桌面。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · TTL、密码/危险操作和会话范围有哪些缺口？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

snapshot.js只有模块全局snapshot，CUA_SESSION默认固定字符串，未按DSH Agent/session分区；多个Agent相继观察会覆盖彼此目标。guard基于当前snapshot.appName做allowedApps（默认空不限制），观察/启动不受白名单约束，app_launch含可选bring_to_front不被同一审批检查。共享快照不是会话安全边界。

元素click/double/right走humanAction→resolveClickTarget(index,ttlMs)，该函数完全没用ttlMs，guard只核snapshot存在而不isFresh，所以本地30秒TTL在这些路径缺失；坐标click/type/key/scroll/drag通过resolveWindow/Token有时效检查。外部element_token可能由driver另判，但不由适配代码证明。另外snapshot.at在视觉处理完成后Date.now才记，不是捕获时刻，慢视觉可给旧画面重新计TTL。

密码与危险词仅args.element对应已缓存role/label才检查；密码role仅两个macOS名称，危险词仅中文删除/支付/注销等，坐标/无element输入/快捷键和图标或英语目标未覆盖。不能把这种提示式守卫当全面风险识别。审批等待期间/实际执行前也未重抓目标，TTL更不能验证界面语义未变。

前台输入fallback只在driver声明background失败/建议foreground后请求allowed-once，拒绝/无服务关闭，是可借鉴路径。但它批准的是已组装payload，等待后未重新验证快照/焦点；业务结果仍需再观察。

#### 证据与依据

**依据 1 · 源码核查**：[lib/snapshot.js:10-29](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/snapshot.js#L10-L29)

模块全局/TTL。

<details>
<summary>查看原文（20行）</summary>

```text
/** 当前快照（单会话单窗口模型，P2 可扩展为多窗口表）。 */
let snapshot = null

/**
 * 保存一次 screen_observe 的快照。
 * @param {object} s
 * @param {Map<number,{token:string,role?:string,label?:string}>} s.entries - 编号 → 元素信息
 */
export function setSnapshot(s) {
  snapshot = s
}

/** 读取当前快照（可能为 null）。 */
export function getSnapshot() {
  return snapshot
}

/** 快照是否新鲜（在 TTL 内）。 */
export function isFresh(ttlMs) {
  return Boolean(snapshot) && Date.now() - snapshot.at <= ttlMs
```

</details>

**依据 2 · 源码核查**：[lib/cua.js:51-59](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/cua.js#L51-L59)

共享session。

```text
/**
 * 插件统一的虚拟光标会话 id：所有动作绑定同一会话，
 * 光标主题/运动参数才能稳定生效（会话级）。
 */
export const CUA_SESSION = process.env.CUA_SESSION || 'dsh-computer-use'

/** 给动作类调用注入统一会话（观察类只读工具不需要）。 */
export function withSession(args = {}) {
  return { session: CUA_SESSION, ...args }
```

**依据 3 · 源码核查**：[lib/guard.js:11-25](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/guard.js#L11-L25)

关键词/role/作用域。

<details>
<summary>查看原文（15行）</summary>

```text
/** 危险词表（命中即审批）。 */
const DANGEROUS_PATTERNS = [
  /删除|移除|清空|清倒|格式化|卸载|永久/,
  /支付|付款|购买|下单|结账|转账|汇款|提交订单|确认交易/,
  /退出登录|注销|登出/,
]

/** 密码类 AX role（macOS）。 */
const PASSWORD_ROLES = new Set(['AXSecureTextField', 'AXPasswordField'])

/** 区域限制只约束"操作类"工具；观察/列表/启动为只读或无害，不受限。 */
const OPERATION_TOOLS = new Set([
  'computer_click', 'computer_double_click', 'computer_right_click',
  'computer_type', 'computer_key', 'computer_scroll', 'computer_drag',
])
```

</details>

**依据 4 · 源码核查**：[lib/guard.js:42-91](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/guard.js#L42-L91)

仅element检查。

<details>
<summary>查看原文（50行）</summary>

```text
export async function guard(ctx, cfg, toolName, args, exec) {
  const snap = getSnapshot()

  // 所有操作工具都必须先建立快照；白名单为空也不能绕过这一安全边界。
  if (OPERATION_TOOLS.has(toolName) && !snap) {
    return { ok: false, reason: '没有可用的观察快照：请先调用 screen_observe 再执行动作。' }
  }

  // 1. 区域限制：allowedApps 非空时，操作类工具的快照窗口应用必须在白名单内
  if (OPERATION_TOOLS.has(toolName) && cfg.allowedApps && cfg.allowedApps.length > 0) {
    if (!snap) {
      return { ok: false, reason: '区域限制：先调用 screen_observe 建立快照才能操作。' }
    }
    if (!cfg.allowedApps.includes(snap.appName)) {
      return {
        ok: false,
        reason: `区域限制：应用 "${snap.appName}" 不在允许操作列表（${cfg.allowedApps.join(' / ')}）中，已拒绝。`,
      }
    }
  }

  // 2/3. 元素级检测（仅 element 编号模式可预知目标；坐标模式无法预知，靠快照 TTL 兜底）
  if (args.element !== undefined && args.element !== null && snap) {
    const info = snap.entries?.get(Number(args.element))
    const role = info?.role || ''
    const label = info?.label || ''

    // 敏感输入保护：密码框
    if (PASSWORD_ROLES.has(role)) {
      if (toolName === 'computer_type') {
        return { ok: false, reason: '敏感输入保护：密码框拒绝自动输入——密码/密钥必须由用户本人输入。' }
      }
      // 点击密码框本身 → 询问
      const outcome = await askApproval(ctx, exec, toolName, `检测到密码输入框"${label || role}"，确认执行 ${toolName}？`)
      if (outcome !== 'allowed-once') {
        return { ok: false, reason: `未获批准（${outcome}），已取消。` }
      }
      return { ok: true }
    }

    // 危险操作审批
    if (isDangerousLabel(label)) {
      const outcome = await askApproval(ctx, exec, toolName, `即将对"${label}"执行 ${toolName}——该目标可能触发删除/支付等危险操作，是否继续？`)
      if (outcome !== 'allowed-once') {
        return { ok: false, reason: `危险操作未获批准（${outcome}），已取消。` }
      }
    }
  }

  return { ok: true }
```

</details>

**依据 5 · 源码核查**：[lib/human.js:93-108](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/human.js#L93-L108)

ttl参数未使用。

<details>
<summary>查看原文（16行）</summary>

```text
export function resolveClickTarget(index, ttlMs) {
  const snap = getSnapshot()
  if (!snap) throw new Error('没有可用的观察快照：请先调用 screen_observe。')
  const entry = snap.entries?.get(index)
  if (!entry) throw new Error(`编号 [${index}] 不在当前快照中。`)
  const pt = screenPointOf(entry, snap)
  const local = windowLocalOf(entry.x, entry.y, snap)
  return {
    pid: snap.pid,
    windowId: snap.windowId,
    token: entry.token || null,
    x: local.x,
    y: local.y,
    sx: pt?.sx,
    sy: pt?.sy,
  }
```

</details>

**依据 6 · 源码核查**：[lib/actions.js:116-141](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/actions.js#L116-L141)

元素点击分支。

<details>
<summary>查看原文（26行）</summary>

```text
async function humanAction(label, args, cfg, extra = {}) {
  let target
  const snap = getSnapshot()
  if (args.element !== undefined && args.element !== null) {
    target = resolveClickTarget(Number(args.element), cfg.ttlMs)
  } else if (args.x !== undefined && args.y !== undefined) {
    const { pid, windowId } = resolveWindow(cfg.ttlMs)
    const sx = Number(args.x)
    const sy = Number(args.y)
    const local = windowLocalOf(sx, sy, snap)
    target = {
      pid,
      windowId,
      x: local.x,
      y: local.y,
      sx,
      sy,
    }
  } else {
    throw new Error('必须提供 element（观察编号）或 x/y 坐标。')
  }
  const value = await humanClick({ ...target, ...extra })
  const refusal = engineRefusal(value)
  if (refusal) return { ok: false, result: `${label} 被引擎拒绝：${refusal}` }
  const detail = typeof value === 'string' ? value : JSON.stringify(value)
  return { ok: true, result: `${label} 完成（虚拟光标滑行+点击）：${detail}` }
```

</details>

**依据 7 · 源码核查**：[lib/observe.js:317-342](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/observe.js#L317-L342)

视觉后时间戳。

<details>
<summary>查看原文（26行）</summary>

```text
  // 5. 快照缓存（element_token 自带的 snapshot_id 由引擎校验）
  const entries = new Map()
  for (const e of elements) {
    const c = centerOf(e)
    entries.set(e.element_index, {
      token: e.element_token,
      role: safeStr(e.role, 40),
      label: safeStr(e.label || e.value || '', 100),
      x: c ? c.x : null,
      y: c ? c.y : null,
    })
  }
  setSnapshot({
    at: Date.now(),
    ttlMs: cfg.ttlMs,
    pid: target.pid,
    windowId: target.window_id,
    appName: target.app_name || '',
    snapshotId: state.snapshot_id,
    entries,
    elementCount: state.element_count,
    totalElementCount: state.total_element_count,
    mode: effectiveMode,
    screenshotWidth: state.screenshot_width || null,
    screenshotHeight: state.screenshot_height || null,
  })
```

</details>

**依据 8 · 源码核查**：[lib/actions.js:77-109](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/actions.js#L77-L109)

前台单次审批。

<details>
<summary>查看原文（33行）</summary>

```text
async function callWithForegroundFallback(call, tool, payload, { approval, agent, toolName, signal, platform = process.platform } = {}) {
  let value = normalizeMcp(await call(tool, payload))
  const supportsDeliveryMode = tool === 'type_text' || platform === 'win32'
  if (!supportsDeliveryMode || !requiresForegroundRetry(value)) return value

  const snap = getSnapshot()
  const app = snap?.appName ? `（目标应用：${snap.appName}）` : ''
  if (!approval || !agent) {
    return {
      effect: 'refused',
      code: 'foreground_approval_required',
      reason: `后台投递不可用；前台重试可能改变焦点${app}，当前没有可用的用户审批服务。`,
    }
  }

  let outcome = 'unavailable'
  try {
    outcome = await approval.request({
      agent,
      toolName,
      reason: `驱动未能确认后台投递可用或建议使用前台模式。前台重试可能把目标窗口置于前台并向其输入/发送按键${app}；是否仅为本次操作批准？`,
      signal,
    })
  } catch { /* 失败关闭：没有明确批准就不切到前台 */ }
  if (outcome !== 'allowed-once' || signal?.aborted) {
    return {
      effect: 'refused',
      code: outcome === 'unavailable' ? 'foreground_approval_required' : 'foreground_approval_denied',
      reason: `前台重试未获本次批准（${outcome}），已停止。`,
    }
  }

  return normalizeMcp(await call(tool, { ...payload, delivery_mode: 'foreground' }))
```

</details>

#### 缺口

- 外部driver的token过期/目标与OS权限保证不由当前适配证明。
  **影响**：不能从本地guard推所有动作安全/平台密码保护。
  **进一步探讨**：固定driver契约与假clock/会话/审批交错，核实际调用是否拒绝旧/错目标。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 视觉数据、子进程与返回值会怎样失败？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

driver通过spawn非shell固定argv+JSON调用，少shell注入面，但rawCall无timeout/AbortSignal/输出长度上限，宿主工具超时不保证child停止。session ended错误按文本匹配先start_session再重试原调用，依赖driver明确未发生副作用的契约；不能把所有模糊失败都安全重放。动作通常只识别结构化effect/refused等，normalizeMcp将content text拼成字符串后不解析JSON，若拒绝只在MCP文本里可漏判成ok；当前测试覆盖直接对象形状，不证明所有driver格式。

native把截图保存到Host attachments并送主模型，零额外key不等无token/无外部模型数据。vision先指定DSH视觉provider/model，出错就尝试GLM（有key时可实际外发）；key来自env或指定/常见文件，GLM_API_BASE可覆盖，代码未限制HTTPS/固定origin，需把凭据目的地当配置信任边界。

GLM三候选各最多两次，失败延迟重试；fetch没有signal/timeout，响应文本/JSON无本模块大小限制。DeepSeek流同样无cancel/deadline，只收文本/错误，不验证结构化定位坐标/来源事实；“免费”是作者文案，费用/可用性不由源码证明。截图、AX文本/路径可能进入模型上下文与Host附件留存，不能称插件完全不写任何数据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/cua.js:67-110](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/cua.js#L67-L110)

自动重试/无子进程预算。

<details>
<summary>查看原文（44行）</summary>

```text
export function createCuaCall(callRaw, session = CUA_SESSION) {
  if (typeof callRaw !== 'function') throw new TypeError('createCuaCall requires a raw-call function')
  return async function callWithSessionRecovery(tool, args = {}) {
    try {
      return await callRaw(tool, args)
    } catch (err) {
      if (tool !== 'start_session' && isSessionEndedError(err?.message)) {
        await callRaw('start_session', { session }).catch(() => undefined)
        return callRaw(tool, args)
      }
      throw err
    }
  }
}

/** Call a cua-driver tool with session recovery enabled. */
export const cuaCall = createCuaCall(rawCall)

/** 底层单次调用（不含会话自愈）。 */
function rawCall(tool, args = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(CUA_BIN, ['call', tool, JSON.stringify(args)], {
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let out = ''
    let err = ''
    child.stdout.on('data', (d) => { out += d })
    child.stderr.on('data', (d) => { err += d })
    child.on('error', (e) => {
      const hint = e.code === 'ENOENT'
        ? `未找到 cua-driver：请确保它已安装并在 PATH 中，或确认官方安装器路径 ~/.cua-driver/packages/current/cua-driver.exe 可用，或设置环境变量 CUA_DRIVER_BIN 指向完整路径。`
        : ''
      reject(new Error(`cua-driver 无法启动 (${CUA_BIN}): ${e.message}${hint ? ' ' + hint : ''}`))
    })
    child.on('close', (code) => {
      if (code !== 0) {
        const msg = (err || out).trim()
        reject(new Error(`cua-driver ${tool} 失败 (exit ${code}): ${msg.slice(0, 800)}`))
        return
      }
      try {
        resolve(JSON.parse(out))
      } catch {
        reject(new Error(`cua-driver ${tool} 返回非 JSON: ${out.slice(0, 500)}`))
```

</details>

**依据 2 · 源码核查**：[lib/cua.js:120-127](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/cua.js#L120-L127)

MCP转字符串。

```text
export function normalizeMcp(value) {
  if (value && Array.isArray(value.content)) {
    const texts = value.content
      .filter((b) => b && b.type === 'text' && typeof b.text === 'string')
      .map((b) => b.text)
    if (texts.length > 0) return texts.join('\n')
  }
  return value
```

**依据 3 · 源码核查**：[lib/actions.js:52-66](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/actions.js#L52-L66)

仅object拒绝。

<details>
<summary>查看原文（15行）</summary>

```text
function engineRefusal(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const effect = value.effect
    if (effect === 'refused' || effect === 'rejected' || effect === 'suspected_noop') {
      const code = value.code ? ` (${value.code})` : ''
      const reason = value.escalation?.reason || value.reason || value.message || ''
      return `${effect}${code}${reason ? ' ' + reason : ''}`
    }
    if (value.code === 'background_unavailable') {
      const reason = value.escalation?.reason || value.reason || value.message || ''
      return `background_unavailable${reason ? ' ' + reason : ''}`
    }
    if (typeof value.error === 'string') return value.error.slice(0, 200)
  }
  return null
```

</details>

**依据 4 · 源码核查**：[lib/vision.js:22-52](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/vision.js#L22-L52)

目的地/Key读取。

<details>
<summary>查看原文（31行）</summary>

```text
const VISION_BASE = process.env.GLM_API_BASE
  || 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

/**
 * 依次尝试的 GLM 视觉模型（免费，第一个优先）。免费模型常有访问量限制（429/1305），
 * 限流时自动回退到下一个。可用 GLM_VISION_MODEL 覆盖首选。
 */
const VISION_MODELS = [
  process.env.GLM_VISION_MODEL || 'glm-4.6v-flash',
  'glm-4v-flash',
  'glm-4.1v-thinking-flash',
]

/** 依次尝试各 key 来源，返回第一个有效值（去空白）。 */
function loadKey() {
  const env = process.env.ZHIPU_API_KEY || process.env.GLM_API_KEY
  if (env) return env.trim()
  const files = [
    process.env.ZHIPU_KEY_FILE,
    join(homedir(), '.zhipu-key'),
    join(homedir(), '.config', 'zhipu-key'),
  ].filter(Boolean)
  for (const f of files) {
    try {
      const v = readFileSync(f, 'utf8').trim()
      if (v) return v
    } catch {
      // 文件不存在/不可读 → 尝试下一个
    }
  }
  return null
```

</details>

**依据 5 · 源码核查**：[lib/vision.js:126-166](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/vision.js#L126-L166)

DSH流。

<details>
<summary>查看原文（41行）</summary>

```text
export async function deepseekVisionDescribe(ctx, cfg, { imageRef, question, maxTokens = 1024 }) {
  const llm = ctx?.get?.('llm')
  if (!llm) {
    throw new Error('当前环境未挂载 llm 服务，无法使用 DeepSeek 视觉观察者。')
  }
  const provider = cfg.visionProvider || 'deepseek-official'
  const model = cfg.visionModel || 'deepseek-v4-flash-vision-exp'
  const capable = await modelImageCapable(ctx, provider, model)
  if (!capable) {
    throw new Error(
      `视觉观察模型 ${provider}/${model} 未声明 image 输入：请确认该模型已在 harness 中注册为视觉模型` +
      `（llm-deepseek models 或 llm-pi-ai modelOverrides 配 input: [text, image]），` +
      `或改配 visionModel / visionProvider。`,
    )
  }
  const safeMax = Math.max(1, Math.min(Number(maxTokens) || 1024, 8192))
  let out = ''
  let reason = ''
  for await (const chunk of llm.stream({
    provider,
    model,
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: question },
        { type: 'image', attachment: imageRef },
      ],
    }],
    maxTokens: safeMax,
    temperature: 0,
  })) {
    if (chunk.type === 'text-delta') out += chunk.text
    else if (chunk.type === 'reasoning-delta') reason += chunk.text
    else if (chunk.type === 'error') {
      throw new Error(`DeepSeek 视觉观察失败: ${chunk.error?.message ?? '未知错误'}`)
    }
  }
  if (!out.trim()) {
    throw new Error(`DeepSeek 视觉观察未返回文本${reason ? `（模型只输出了思考：${reason.slice(0, 120)}）` : ''}`)
  }
  return out
```

</details>

**依据 6 · 源码核查**：[lib/vision.js:173-233](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/vision.js#L173-L233)

GLM重试/无signal。

<details>
<summary>查看原文（61行）</summary>

```text
export async function glmVisionDescribe({ imageBase64, mimeType = 'image/png', question, maxTokens = 1024 }) {
  const key = loadKey()
  if (!key) {
    throw new Error(
      '视觉兜底需要 ZHIPU_API_KEY：智谱开放平台 bigmodel.cn 免费申请（模型 glm-4.6v-flash 免费）。' +
      '设置环境变量，或把 key 写入 ~/.zhipu-key（一行一个）后重试。',
    )
  }
  // 智谱免费视觉模型 max_tokens 上限 1024，超限报 1210
  const safeMax = Math.max(1, Math.min(Number(maxTokens) || 1024, 1024))
  const body = {
    model: '', // 每个候选模型循环填充
    messages: [{
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
        { type: 'text', text: question },
      ],
    }],
    max_tokens: safeMax,
  }

  let lastErr = null
  // 依次尝试候选模型（限流/超限 → 下一个），每个模型最多重试 2 次
  for (const model of VISION_MODELS) {
    body.model = model
    for (let attempt = 0; attempt < 2; attempt++) {
      let res
      try {
        res = await fetch(VISION_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
          body: JSON.stringify(body),
        })
      } catch (err) {
        lastErr = new Error(`GLM 视觉请求失败: ${err.message}`)
        await sleep(1000 * (attempt + 1))
        continue
      }
      // 限流/访问量过大 → 换下一个模型
      if (res.status === 429 || res.status === 1305) {
        lastErr = new Error(`GLM 视觉模型 ${model} 限流 (${res.status})`)
        await sleep(1500 * (attempt + 1))
        continue
      }
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        // 1305 错误码（访问量过大）也换模型
        if (text.includes('1305')) {
          lastErr = new Error(`GLM 视觉模型 ${model} 访问量过大`)
          continue
        }
        throw new Error(`GLM 视觉 API ${res.status}: ${text.slice(0, 300)}`)
      }
      const data = await res.json().catch(() => null)
      const content = data?.choices?.[0]?.message?.content
      if (typeof content === 'string' && content) return content
      return JSON.stringify(data).slice(0, 2000)
    }
  }
  throw lastErr || new Error('GLM 视觉调用失败（全部候选模型均不可用）')
```

</details>

**依据 7 · 源码核查**：[lib/observe.js:162-192](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/observe.js#L162-L192)

DSH失败→GLM。

<details>
<summary>查看原文（31行）</summary>

```text
/** 观察者（Mode D）：DeepSeek 视觉模型描述，失败回退 GLM。 */
async function describeVision(ctx, cfg, state, target, exec, question) {
  const w = state.screenshot_width || 0
  const h = state.screenshot_height || 0
  const q = question || visionQuestion(w, h)
  // 1. 优先 DeepSeek 观察者（需 attachments 持久化 + llm 服务）
  const attachments = ctx?.get?.('attachments')
  const llm = ctx?.get?.('llm')
  if (llm && attachments) {
    try {
      const { ref, compact } = await commitScreenshot(ctx, target, state, cfg)
      const text = await deepseekVisionDescribe(ctx, cfg, {
        imageRef: ref,
        question: q,
      })
      return `（观察者 ${cfg.visionProvider}/${cfg.visionModel}${compact ? ' · 紧凑图' : ''}）\n${text}`
    } catch (err) {
      // 观察者不可用 → 记录后走 GLM
      return `（DeepSeek 观察者不可用：${err.message}）\n${await glmVisionDescribe({
        imageBase64: state.screenshot_png_b64,
        mimeType: state.screenshot_mime_type === 'image/jpeg' ? 'image/jpeg' : 'image/png',
        question: q,
      }).catch((e2) => `（视觉理解失败：${e2.message}）`)}`
    }
  }
  // 2. 无 llm/attachments：GLM 直传
  return glmVisionDescribe({
    imageBase64: state.screenshot_png_b64,
    mimeType: state.screenshot_mime_type === 'image/jpeg' ? 'image/jpeg' : 'image/png',
    question: q,
  }).catch((err) => `（视觉理解失败：${err.message}）`)
```

</details>

**依据 8 · 源码核查**：[tests/action-refusal.test.mjs:14-25](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/tests/action-refusal.test.mjs#L14-L25)

作者仅结构化拒绝测试。

<details>
<summary>查看原文（12行）</summary>

```text
  test(`${name} returns ok:false for a structured engine refusal`, async () => {
    const result = await action(args, cfg, {
      resolve: target,
      call: async (calledTool, payload) => {
        assert.equal(calledTool, tool)
        assert.equal(payload.pid, 42)
        assert.equal(payload.window_id, 7)
        return { effect: 'refused', code: 'foreground_unavailable', reason: 'target is not foreground' }
      },
    })
    assert.equal(result.ok, false)
    assert.match(result.result, new RegExp(`${label}被引擎拒绝`))
```

</details>

#### 缺口

- driver未知效果是否可重试、不同模型截图留存/计费/退出取消没有独立记录。
  **影响**：不能保证零重复操作/隐私/费用或硬超时。
  **进一步探讨**：假driver输出/挂起/已执行后错误矩阵与固定模型数据策略，未知效果先核状态不重放。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续和失败恢复成本怎样展示？

**研究主题**：效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=22.18与DSH tools/approval/schemastery | 十二工具与单次审批 | 固定peer范围，非任意DSH兼容 |
| 固定cua-driver与OS辅助功能/录屏权限 | 桌面观察/输入/虚拟光标 | 外部引擎/平台实际支持另核 |
| attachments/图像模型或视觉provider | native/vision | 图片持久化与模型数据边界 |
| 显式允许app/单任务会话 | 控制范围 | 全局snapshot非多Agent隔离 |
| 可选GLM key与可信API_BASE | fallback | 不信“免费”作预算/隐私保证 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定部署 | 核driver/OS权限/审批和模型路由 | 不操作日常秘密窗口 |
| 观察 | 明确窗口/模式 | 核真实像素空间/捕获时间 |
| 执行 | 优先明确token/目标 | 当前元素TTL/角色覆盖缺口先修 |
| 回读 | 再观察业务结果 | ok/delivered不等完成 |
| 失败 | 确认是否发生效果后恢复 | 模糊失败不盲重放/前台切焦 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | driver/OS权限/Host附件与模型配置 | 审可信二进制、窗口范围和像素映射 | 配置工时/驱动依赖费用未知 |
| 持续使用 | 每步子进程/AX文本与图像token、附件存储，视觉额外请求 | 观察/审批/业务结果复核 | AX零视觉token非总token0，费用/延时未知 |
| 失败恢复 | 重观察/重连session、可能重复请求/残留child | 核实际界面效果/恢复焦点/清附件策略 | 无硬取消/恰好一次，恢复与误操作损失未知 |

#### 效果

| 目标 | 当前增量 | 边界 |
| --- | --- | --- |
| 桌面可达 | DSH十二工具接driver | 原生引擎能力非插件新算法 |
| 可观察动作 | AX/图片/虚拟轨迹 | token/坐标/缩放语义需一致 |
| 局部克制 | 部分TTL/白名单/审批fallback | 非完整风险/会话隔离 |

只有固定任务的正确完成率/误操作率/模型成本对照，才能判断是否胜过人工或业务API自动化。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:51-66](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/package.json#L51-L66)

宿主peer/Node。

<details>
<summary>查看原文（16行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": ">=0.1.2-rc.1 <0.2.0",
    "@deepseek-ai/schemastery": ">=3.18.2 <4"
  },
  "devDependencies": {
    "@deepseek-ai/dsh-tools": "0.1.2-rc.1",
    "@deepseek-ai/schemastery": "3.18.2"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/988hj7tczd-oss/dsh-computer-use.git"
  },
  "engines": {
    "node": ">=22.18.0"
  }
}
```

</details>

**依据 2 · 源码核查**：[index.js:41-58](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/index.js#L41-L58)

配置。

<details>
<summary>查看原文（18行）</summary>

```text
export const inject = ['tools', 'approval']

/** 插件配置。 */
export const Config = z.object({
  /** 观察快照的有效期（毫秒）。 */
  ttlMs: z.number().default(30000),
  /** screen_observe 最多返回多少编号元素。 */
  maxElements: z.number().default(500),
  /** 区域限制：允许操作的应用名白名单（空 = 不限制）。 */
  allowedApps: z.array(z.string()).default([]),
  /** 虚拟光标主题 id（空 = 不设置，用引擎默认）。 */
  cursorTheme: z.string().default('com.dsh.computeruse.rainbow'),
  /** 原生直读截图策略：auto（PNG 超限额时自动降级 zoom JPEG）/ full（始终原图 PNG）/ compact（始终 ≤500px JPEG）。 */
  nativeImage: z.union(['auto', 'full', 'compact']).default('auto'),
  /** Mode D 观察者 provider 路由。 */
  visionProvider: z.string().default('deepseek-official'),
  /** Mode D 观察者模型（需声明 image 输入）。 */
  visionModel: z.string().default('deepseek-v4-flash-vision-exp'),
```

</details>

**依据 3 · 源码核查**：[index.js:137-151](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/index.js#L137-L151)

启动driver与wrapper。

<details>
<summary>查看原文（15行）</summary>

```text
  // 初始化虚拟光标：声明统一会话 + 应用主题（异步，不阻塞插件加载）
  cuaCall('start_session', { session: CUA_SESSION }).catch(() => undefined)
  if (cfg.cursorTheme) {
    cuaCall('set_agent_cursor_theme', { session: CUA_SESSION, theme_id: cfg.cursorTheme })
      .catch(() => undefined)
  }

  /** 统一包装：先过安全护栏，再执行实现（exec 透传给需要 route 的实现）。 */
  const wrap = (toolName, impl) => async (args, exec) => {
    try {
      const g = await guard(ctx, cfg, toolName, args, exec)
      if (!g.ok) return { ok: false, result: `✗ ${g.reason}` }
      return await impl(args, cfg, exec)
    } catch (err) {
      return { ok: false, result: `✗ ${err.message}` }
```

</details>

**依据 4 · 源码核查**：[lib/human.js:30-48](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/human.js#L30-L48)

虚拟轨迹额外调用。

<details>
<summary>查看原文（19行）</summary>

```text
export async function glideCursor(tx, ty, opts = {}) {
  const tryMove = (payload) => cuaCall('move_cursor', payload).catch(() => undefined)
  // 当前光标位置（拿不到就从目标点直线过去）
  let cur = null
  try {
    cur = await cuaCall('get_cursor_position', { session: CUA_SESSION })
  } catch { /* 无光标信息 → 直线 */ }
  const sx = cur?.x != null ? cur.x : tx
  const sy = cur?.y != null ? cur.y : ty

  for (let i = 1; i <= GLIDE_SEGMENTS; i++) {
    const t = i / GLIDE_SEGMENTS
    const x = sx + (tx - sx) * t
    // 弧线：中间点抬高（模拟人手画弧）
    const y = sy + (ty - sy) * t - Math.sin(t * Math.PI) * ARC_HEIGHT
    await tryMove(withSession({ x, y, ...opts }))
    await new Promise((r) => setTimeout(r, GLIDE_STEP_MS))
  }
  await tryMove(withSession({ x: tx, y: ty, ...opts }))
```

</details>

#### 缺口

- 同任务相对人工/裸driver/API的正确率、耗时、token与误操作成本未知。
  **影响**：不能量化自动化提效。
  **进一步探讨**：固定无秘密可丢弃页面/假driver任务对照，分别计观察/动作/恢复。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 推荐与进一步探索入口是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先观察，适合研究者在无秘密可丢弃环境评估，当前不直接给日常桌面全权执行。局部工具适配/可见动作有用，但元素TTL未落实、全局快照/坐标变换和风险识别缺口使安全主张过强；缩放/前台fallback和模型数据路径要显式选择。

由共享snapshot/TTL/缩放与拒绝形状可推导“绑定观察版本与变换的动作凭据”。每Agent持snapshotID/捕获时刻/目标窗口/原图与crop scale，动作显式引用并在执行前核TTL/窗口/语义目标；无法分类坐标或焦点输入先交人，审批后重验；拒绝/unknown/confirmed-effect统一结构化，不按文本猜可重放。

未实现。对照当前版与原型，假clock/两Agent交错、过期element、compact/crop、密码/英语/无label、审批期间变窗、MCP文本拒绝/已执行后error，核driver零错目标/拒绝与重复效果率。反例是强制重观察增加延时/图片token、动态UI无法稳定token、过严风险分类不可用；用unknown交人，不为通过矩阵伪造成功。若仍跨会话点错、旧捕获被重新计时、缩图坐标偏移或模糊失败重复操作，假设被反证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/human.js:93-108](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/human.js#L93-L108)

TTL缺口推导。

<details>
<summary>查看原文（16行）</summary>

```text
export function resolveClickTarget(index, ttlMs) {
  const snap = getSnapshot()
  if (!snap) throw new Error('没有可用的观察快照：请先调用 screen_observe。')
  const entry = snap.entries?.get(index)
  if (!entry) throw new Error(`编号 [${index}] 不在当前快照中。`)
  const pt = screenPointOf(entry, snap)
  const local = windowLocalOf(entry.x, entry.y, snap)
  return {
    pid: snap.pid,
    windowId: snap.windowId,
    token: entry.token || null,
    x: local.x,
    y: local.y,
    sx: pt?.sx,
    sy: pt?.sy,
  }
```

</details>

**依据 2 · 源码核查**：[lib/observe.js:121-159](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/observe.js#L121-L159)

变换推导。

<details>
<summary>查看原文（39行）</summary>

```text
async function commitScreenshot(ctx, target, state, cfg) {
  const attachments = ctx?.get?.('attachments')
  if (!attachments) {
    throw new Error('当前环境未挂载 attachments 服务，无法持久化截图（原生视觉不可用）。')
  }
  const pngBuf = buf(state.screenshot_png_b64)
  const maxBytes = attachments.imageLimits?.maxImageBytes ?? 5 * 1024 * 1024
  const compact = cfg.nativeImage === 'compact'
    || (cfg.nativeImage !== 'full' && pngBuf.byteLength > maxBytes)

  let data = pngBuf
  let mediaType = state.screenshot_mime_type === 'image/jpeg' ? 'image/jpeg' : 'image/png'
  let width = state.screenshot_width
  let height = state.screenshot_height
  let name = `screen-${target.pid}.png`

  if (compact) {
    // 整窗 zoom：x/y 用原始截图像素范围，引擎输出 ≤500px 宽的 JPEG
    const w = state.screenshot_width || 1
    const h = state.screenshot_height || 1
    const zv = await cuaCall('zoom', withSession({
      pid: target.pid,
      window_id: target.window_id,
      x1: 0,
      y1: 0,
      x2: w,
      y2: h,
    }))
    const jpeg = buf(zv?.screenshot_png_b64)
    if (jpeg.byteLength === 0) throw new Error('zoom 降级截图失败：引擎返回空图片。')
    data = jpeg
    mediaType = (zv?.mime_type === 'image/jpeg') ? 'image/jpeg' : 'image/jpeg'
    width = zv?.width || width
    height = zv?.height || height
    name = `screen-${target.pid}-compact.jpg`
  }

  const ref = await attachments.saveImage({ data, mediaType, name })
  return { ref, width, height, compact }
```

</details>

**依据 3 · 源码核查**：[lib/snapshot.js:10-29](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/snapshot.js#L10-L29)

会话与时刻推导。

<details>
<summary>查看原文（20行）</summary>

```text
/** 当前快照（单会话单窗口模型，P2 可扩展为多窗口表）。 */
let snapshot = null

/**
 * 保存一次 screen_observe 的快照。
 * @param {object} s
 * @param {Map<number,{token:string,role?:string,label?:string}>} s.entries - 编号 → 元素信息
 */
export function setSnapshot(s) {
  snapshot = s
}

/** 读取当前快照（可能为 null）。 */
export function getSnapshot() {
  return snapshot
}

/** 快照是否新鲜（在 TTL 内）。 */
export function isFresh(ttlMs) {
  return Boolean(snapshot) && Date.now() - snapshot.at <= ttlMs
```

</details>

**依据 4 · 源码核查**：[lib/cua.js:67-77](https://github.com/988hj7tczd-oss/dsh-computer-use/blob/3cf9bd8ae60271512f263bfa75485cb242ca0892/lib/cua.js#L67-L77)

重试推导。

<details>
<summary>查看原文（11行）</summary>

```text
export function createCuaCall(callRaw, session = CUA_SESSION) {
  if (typeof callRaw !== 'function') throw new TypeError('createCuaCall requires a raw-call function')
  return async function callWithSessionRecovery(tool, args = {}) {
    try {
      return await callRaw(tool, args)
    } catch (err) {
      if (tool !== 'start_session' && isSessionEndedError(err?.message)) {
        await callRaw('start_session', { session }).catch(() => undefined)
        return callRaw(tool, args)
      }
      throw err
```

</details>

#### 缺口

- 逐Agent观察/变换/动作凭据与unknown效果契约未实现。
  **影响**：不是现有会话隔离/安全保证。
  **进一步探讨**：先用假driver/合成像素矩阵对照错误率和额外成本，不控制真实桌面。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
