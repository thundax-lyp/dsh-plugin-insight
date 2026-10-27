# dsh-desktop-sidecar

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ccb0b0c](https://github.com/111xjyuan/dsh-desktop-sidecar/tree/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/111xjyuan/dsh-desktop-sidecar) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-desktop-sidecar)
<!-- END META -->

> **功能**：为 DSH 提供 Windows 窗口、UIA、截图、离线 OCR、点击、剪贴板输入和按键工具。

> **亮点**：组合UIA的结构操作与OCR文字坐标，减少单一路径不覆盖自绘界面的限制，并提供统一DSH工具入口；采用既有Windows能力，未证明竞品排名或token收益。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：不能。点击后比较局部截图哈希，画面变化可能来自动画、光标或无关内容，而实际动作可能失败；无变化也可能已完成无视觉反馈的操作。实现会在无变化时自动再点一次，随后只要坐标在客户区且发生重试就返回ok=true，即使changed=false，因此工具ok不等于像素验证成功，更不等于业务完成。二次点击还可能重复提交或触发双击语义。OCR findLine允许包含和0.6字符集合相似度，重复标签或形近字可能命中不期望条目；没有唯一候选确认门。它适合提示下一步复核，不能作为严格放行条件。这些是源码机制与反例分析，未复现误操作。 批量dryRun只返回文字描述并逐步标ok，没有证明控件仍存在或参数可执行；stopOnError只基于工具ok，也不等于业务后置条件。Esc在步骤之间检查，无法保证中断同步子进程或撤销已经点击。 [Q03](#research-q03)

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
  - [Q01 · 原生工具组合比纯视觉/脚本多什么？](#detail-section-11)
  - [Q02 · UIA、OCR与输入调用链及依赖是什么？](#detail-section-12)
  - [Q03 · 像素变化是否能证明操作成功？](#detail-section-13)
  - [Q04 · 桌面权限、临时文件和恢复成本如何？](#detail-section-14)
  - [Q05 · 可否增加语义后置条件？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要操作无业务API的Windows应用的人可组合UIA、OCR和输入，合格结果仍由实际业务状态确认。[Q01](#research-q01)

人工桌面操作和直接Win32/UIA脚本能完成底层动作；插件主要将多路径封装成Agent入口，不能替代业务验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：窗口枚举、UIA、截图OCR、点击输入按键、自检与课程控制

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Windows10/11交互桌面与koffi | 启动必需 | Win32与GDI | 非Windows不可用 |
| DSH tools及peer兼容 | 工具必需 | 模型工具注册 | 无工具入口 |
| PowerShell与UIAutomation | UIA必需 | 控件树和动作 | UIA路径失败 |
| Windows OCR语言包 | OCR必需 | 文字识别 | 空结果或失败 |
| 目标权限与前台条件 | 输入必需 | 点击粘贴按键 | UIPI/焦点导致失败或降级 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户Windows安装并自检 | 平台/OCR/焦点条件满足 |
| 观察 | 模型读窗口UIA/OCR | 目标身份与文字明确 |
| 操作 | 用户授权后模型执行 | 独立检查实际状态 |
| 恢复 | 用户处理焦点、剪贴板和文件 | 无残留敏感图像或错误业务动作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Windows设备与FFI环境，金额未知 | 语言包、自检和测试窗口 | 当前环境未验平台 |
| 持续使用 | 模型、截图、OCR资源未知 | 判断焦点与操作结果 | PowerShell同步调用可阻塞 |
| 失败恢复 | 重试、附件和输出图像资源未知 | 恢复窗口、剪贴板及业务状态 | 重复动作可能非幂等 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多路径识别 | UIA与OCR桥接 | 当前Windows应用覆盖率 |
| 点击反馈 | 局部截图哈希 | 业务正确性与重复提交风险 |
| 中文输入 | 剪贴板与粘贴 | 焦点、禁粘贴和恢复 |
| 效率 | 减少纯视觉依赖机制 | token、延迟与合格率 |

> **思考**：不能。点击后比较局部截图哈希，画面变化可能来自动画、光标或无关内容，而实际动作可能失败；无变化也可能已完成无视觉反馈的操作。实现会在无变化时自动再点一次，随后只要坐标在客户区且发生重试就返回ok=true，即使changed=false，因此工具ok不等于像素验证成功，更不等于业务完成。二次点击还可能重复提交或触发双击语义。OCR findLine允许包含和0.6字符集合相似度，重复标签或形近字可能命中不期望条目；没有唯一候选确认门。它适合提示下一步复核，不能作为严格放行条件。这些是源码机制与反例分析，未复现误操作。 批量dryRun只返回文字描述并逐步标ok，没有证明控件仍存在或参数可执行；stopOnError只基于工具ok，也不等于业务后置条件。Esc在步骤之间检查，无法保证中断同步子进程或撤销已经点击。 [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：组合UIA的结构操作与OCR文字坐标，减少单一路径不覆盖自绘界面的限制，并提供统一DSH工具入口；采用既有Windows能力，未证明竞品排名或token收益。[Q01](#research-q01) [Q02](#research-q02)

FFI、UIA/OCR与批量执行器分离，OCR两级finally清理和启动扫旧文件有实际资源治理价值。输入仍覆盖全局剪贴板，同步PowerShell可能阻塞；可选expect、按字符相似度匹配和步骤ok不能组成业务正确性保证。复用批量器须额外加入独立后置条件、候选身份和非幂等重试策略。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

不能。点击后比较局部截图哈希，画面变化可能来自动画、光标或无关内容，而实际动作可能失败；无变化也可能已完成无视觉反馈的操作。实现会在无变化时自动再点一次，随后只要坐标在客户区且发生重试就返回ok=true，即使changed=false，因此工具ok不等于像素验证成功，更不等于业务完成。二次点击还可能重复提交或触发双击语义。OCR findLine允许包含和0.6字符集合相似度，重复标签或形近字可能命中不期望条目；没有唯一候选确认门。它适合提示下一步复核，不能作为严格放行条件。这些是源码机制与反例分析，未复现误操作。 批量dryRun只返回文字描述并逐步标ok，没有证明控件仍存在或参数可执行；stopOnError只基于工具ok，也不等于业务后置条件。Esc在步骤之间检查，无法保证中断同步子进程或撤销已经点击。 [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在无敏感数据的测试应用做只读窗口、UIA和OCR，再核查输入与剪贴板；编号点击传expect并复核实际控件，批量先少量观察。不要把dryRun、ok或changed当业务完成。OCR临时图尽力清理，但持久截图/附件另查生命周期。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

Windows工具接线有固定源码支持；平台与业务效果未运行验证，像素反馈不保证成功。语义动作契约为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/uia.mjs、lib/ocr.mjs、lib/win32.mjs、lib/sequence.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定工具、UIA/OCR桥、点击和剪贴板源码；未执行目标代码、Windows工具、课程动作或真实宿主。
- 下一步：Windows受控窗口核对缩放、重复标签、焦点、非幂等重试、临时文件和剪贴板，未执行。

**分析版本**

- **仓库**：[111xjyuan/dsh-desktop-sidecar](https://github.com/111xjyuan/dsh-desktop-sidecar)
- **版本号**：0.5.2（[固定提交 ccb0b0c](https://github.com/111xjyuan/dsh-desktop-sidecar/tree/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可用独立可观察后置条件和非幂等不重试策略替代像素成功推断，以受控应用状态日志比较误提交和人工负担；观察不独立或误停过多则否定。未实现。[Q05](#research-q05)

Windows受控窗口核对缩放、重复标签、焦点、非幂等重试、临时文件和剪贴板，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 11 | 1243 | 1091 | 72 | — |
| .js | source | 1 | 702 | 653 | 23 | — |
| .md | source | 1 | 123 | — | — | 1426 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/111xjyuan/dsh-desktop-sidecar/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：检验Windows原生桌面工具的覆盖增量、点击验证与数据生命周期。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 原生工具组合比纯视觉/脚本多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向想让DSH操作没有业务API的Windows应用的人，合格结果应是指定应用完成指定动作并经业务状态核对，而非单次工具返回ok。UIA给可访问控件名称与动作，OCR为自绘界面提供文本坐标，截图供模型复核，组合能覆盖单一UIA失效的界面。相对手工脚本，它提供模型工具注册和统一结果；相对纯视觉，只传控件或文字可减少图像依赖，但token和准确率优势没有同任务实测。README的竞品勾叉是作者比较，本次没有核查外部实现，不能作为已证实排名。机制主要组合Windows既有API，并非新识别算法。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-38](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe/README.md#L3-L38)

多路径及批量/去重目标属于作者声明，竞品比较不继承为实证。

<details>
<summary>查看原文（36行）</summary>

````text
给 DeepSeek Harness 装上「手」：原生 Windows 桌面控制。**不依赖 Python、不下载驱动、不弹窗口、不走 MCP。**

在任意 Windows 10/11 应用里**看屏幕、读文字、点按钮、打字、按快捷键**——包括微信、Office、浏览器、网课播放器这些没有自动化接口的软件。

## 和同类方案的区别

| | 本项目 | MCP + UIA 方案（如 dsh-computer-use-win） | CUA/视觉方案 |
|---|---|---|---|
| 安装 | npm 一个包 | 需另装 MCP 客户端 + 桥 | 需下载 ~60MB 驱动二进制 |
| 运行时 | 零外部依赖（koffi 直调 Win32） | Python/PowerShell 子进程 | 独立驱动进程 |
| 读界面 | UIA 控件树 **或** 离线 OCR | 只有 UIA | 只有截图（靠视觉模型） |
| 微信/Electron/Qt | ✅ OCR 兜底可用 | ❌ UIA 树为空 | ✅ 但 token 贵 |
| 点击校验 | ✅ 点完自动比对像素 | ❌ | ❌ |
| 环境自检 | `desktop_doctor` 四项体检 | ❌ | ❌ |

一句话：**有 UIA 用 UIA（精确、后台、省 token），没有就自动降级到 OCR + 坐标点击**——不用你判断。

> **不需要视觉模型也能用。** 截图会作为图片返回给支持看图的模型，但每一条能力都有纯文本路径（UIA 控件树 / 离线 OCR / 坐标），所以文本模型照样能跑完整流程——这是本项目和「截图转视觉模型」类方案的根本区别。

```
desktop_windows  → 现在有哪些窗口
desktop_tree     → 这个窗口有哪些控件（UIA，带编号索引，可直接点）
desktop_invoke   → 直接触发控件（不移动鼠标、不需要窗口在前台）
desktop_read     → 窗口里写了什么（离线 OCR，带坐标）
desktop_capture  → 截图：直接作为图片返回，带坐标尺 + 缩放契约，画面没变就不重复发
desktop_click    → 点控件编号（带身份校验）/ 点文字 / 点坐标（点后像素校验）
desktop_sequence → 批量：一次调用跑多步（dryRun / stopOnError / Esc 中止）
desktop_type     → 输入中文（剪贴板 + 真 Ctrl+V，稳）
desktop_key      → 按键 / 组合键
desktop_course   → 网课自动播放（帧差判播放 + 自动下一节）
desktop_doctor   → 环境自检（平台 / DPI / 多屏 / OCR / 前台锁 / 输入控件）
```

### 0.5.0 更新（对标 dsh-pilot 后补齐）

- **DPI 感知**：启动即声明 per-monitor v2，并在 `desktop_doctor` 里体检——125%/150% 缩放下坐标不再偏。
````

</details>

**依据 2 · 源码核查**：[lib/index.js:329-335](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe/lib/index.js#L329-L335)

OCR失配时给出UIA替代候选。

```text
      } else if (text) {
        const res = ocrBuffer(cap.png, { scale: 1.5, prep: true });
        const hit = findLine(res, text);
        if (!hit) {
          const uia = (() => { try { const t = uiaTree(w.hwnd, { depth: 5, max: 80 }); return (t.elements || []).filter((e) => e.pats && e.pats.length && e.name).map((e, i) => i + ':' + e.role + ':' + e.name); } catch { return []; } })();
          return { ok: false, error: 'text not found', tried: text, lines: (res.lines || []).slice(0, 14).map((l) => l.text), uiaCandidates: uia.slice(0, 12), hint: uia.length ? 'OCR missed it, but this window exposes UIA controls: use desktop_tree + desktop_click{control,expect} instead.' : 'Neither OCR nor UIA found it: run desktop_read to see what the window actually shows.' };
        }
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · UIA、OCR与输入调用链及依赖是什么？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

Host注册desktop_*工具，窗口枚举和输入经koffi调用Win32，截图经GDI；UIA并非全部在Node进程内，它spawnSync系统PowerShell运行uia.ps1。OCR同样运行PowerShell的Windows.Media.Ocr，并将截图解码缩放后写临时PNG，坐标按真实缩放比换回。文字输入先清空并设置系统剪贴板再Ctrl+V。无需Python和独立驱动是可见设计，但“零外部依赖”须收窄为无需另装某些服务，仍依赖koffi、Windows原生库、PowerShell、OCR语言包及交互桌面权限。同步子进程有15/20秒超时，调用期间可能阻塞Host线程；未测宿主影响。OCR源码声明复用dsh-screenshot-xn脚本，不能归为新OCR实现。 当前还提供帧哈希去重和desktop_sequence批量动作，减少重复图像与模型往返的机制可见，不能推算实测token节省；批量最多24步、逐步检查Esc，非多步事务。UIA索引点击会重读树，但expect可选，不传时并无旧对象身份对照；传expect也主要是name包含与role匹配，不能保证同名控件唯一。

#### 证据与依据

**依据 1 · 源码核查**：[lib/uia.mjs:1-20](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe/lib/uia.mjs#L1-L20)

UIA明确经PowerShell同步子进程桥接。

<details>
<summary>查看原文（20行）</summary>

```text
// UIA（UI Automation）桥：用系统自带的 UIAutomationClient 读控件树 / 触发控件动作。
// 为什么走 PowerShell：UIA 是 COM，Node 侧直连要手写 IDispatch，脚本化更稳且短生命周期不阻塞 spawn。
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const UIA_PS1 = fileURLToPath(new URL('./uia.ps1', import.meta.url));
const PS = 'C:/Windows/System32/WindowsPowerShell/v1.0/powershell.exe';

function run(args) {
  const r = spawnSync(PS, ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', UIA_PS1, ...args], {
    encoding: 'utf8',
    timeout: 15000,
    windowsHide: true,
    maxBuffer: 8 * 1024 * 1024,
  });
  const text = (r.stdout || '').trim();
  if (!text) throw new Error('uia: empty output ' + (r.stderr || '').slice(0, 300));
  const start = text.indexOf('{');
  if (start < 0) throw new Error('uia: no json in output');
  return JSON.parse(text.slice(start));
```

</details>

**依据 2 · 源码核查**：[lib/win32.mjs:247-264](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe/lib/win32.mjs#L247-L264)

剪贴板被清空并写新文本，没有保存旧内容的路径。

<details>
<summary>查看原文（18行）</summary>

```text
export function setClipboardText(text) {
  const open = user32b.func('__stdcall', 'OpenClipboard', 'bool', ['intptr_t']);
  const empty = user32b.func('__stdcall', 'EmptyClipboard', 'bool', []);
  const close = user32b.func('__stdcall', 'CloseClipboard', 'bool', []);
  const setData = user32b.func('__stdcall', 'SetClipboardData', 'intptr_t', ['uint32_t', 'intptr_t']);
  const kernel32b = koffi.load('kernel32.dll');
  const GlobalAlloc = kernel32b.func('__stdcall', 'GlobalAlloc', 'intptr_t', ['uint32_t', 'intptr_t']);
  const GlobalLock = kernel32b.func('__stdcall', 'GlobalLock', 'void *', ['intptr_t']);
  const GlobalUnlock = kernel32b.func('__stdcall', 'GlobalUnlock', 'bool', ['intptr_t']);
  const buf = Buffer.from(String(text) + '\u0000', 'utf16le');
  open(0); empty();
  const h = GlobalAlloc(0x0042, buf.length);
  const p = GlobalLock(h);
  koffi.encode(p, 'uint8_t', Array.from(buf), buf.length);
  GlobalUnlock(h);
  setData(13, h);
  close();
  return true;
```

</details>

**依据 3 · 源码核查**：[lib/ocr.mjs:35-59](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe/lib/ocr.mjs#L35-L59)

OCR同步桥在finally清理缩放临时目录。

<details>
<summary>查看原文（25行）</summary>

```text
export function ocrFile(path, { language = 'zh-Hans', timeout = 20000, scale = 1, prep = true } = {}) {
  // 总是 decode → 放大(可选) → 重编码到 %TEMP% 再 OCR：
  //  ① WinRT BitmapDecoder 对某些目录下的原图会报 "image could not be decoded"（实测 D:\ 工作区），
  //     统一走 TEMP 可绕开；② 坐标反算比例必须用"实际"放大比（整数取整/四舍五入后与 scale 不同）。
  const img = decodePng(readFileSync(path));
  const s = Number(scale) > 1 ? Number(scale) : 1;
  const up = scaleNear(img, s);
  const dir = mkdtempSync(join(tmpdir(), 'cue-ocr-up-'));
  try {
    const src = join(dir, 'up.png');
    writeFileSync(src, encodePng(up.width, up.height, up.rgb));
    const kx = img.width / up.width;
    const ky = img.height / up.height;
    const res = ocrFileRaw(src, { language, timeout });
    for (const l of res.lines) { l.x *= kx; l.y *= ky; l.w *= kx; l.h *= ky; }
    res.ocrImage = { width: up.width, height: up.height };
    res.image = { width: img.width, height: img.height };
    return res;
  } finally {
    // 立即删除：临时目录里是整屏截图，留着既有磁盘泄漏也有隐私风险（issue #2）
    try { rmSync(dir, { recursive: true, force: true }); } catch {}
  }
}

function ocrFileRaw(path, { language = 'zh-Hans', timeout = 20000 } = {}) {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:304-323](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe/lib/index.js#L304-L323)

UIA编号点击重读树，只有提供expect时进一步核名字/角色。

<details>
<summary>查看原文（20行）</summary>

```text
      await sleep(120);
      const cap = captureWindow(w, 1400);
      const rect = cap.rect;
      let cx, cy, hitText = null, via = 'coords', uiaInfo = null;

      if (control !== undefined && control !== null) {
        const tree = uiaTree(w.hwnd, { depth: 6, max: 600 });
        const els = (tree.elements || []).map((e, i) => ({ index: i, role: e.role, name: e.name, rect: { x: e.x, y: e.y, w: e.w, h: e.h } }));
        const el = els[Number(control)];
        if (!el) return { ok: false, error: 'control index out of range', controlCount: els.length, hint: 'Run desktop_tree again for fresh indices.' };
        if (expect) {
          const wantName = typeof expect === 'string' ? expect : String(expect.name || '');
          const wantRole = typeof expect === 'object' && expect ? String(expect.role || '') : '';
          const nameOk = !wantName || String(el.name || '').toLowerCase().includes(wantName.toLowerCase());
          const roleOk = !wantRole || String(el.role || '') === wantRole;
          if (!nameOk || !roleOk) {
            return { ok: false, error: 'control identity mismatch', expected: (wantRole || '?') + ' "' + wantName + '"', actual: el.role + ' "' + el.name + '"', controlCount: els.length, hint: 'The layout changed since desktop_tree: re-read the tree, then click the new index.' };
          }
        }
        if (!(el.rect.w > 0 && el.rect.h > 0)) return { ok: false, error: 'control has no clickable rect', control: el };
```

</details>

**依据 5 · 源码核查**：[lib/sequence.mjs:6-40](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe/lib/sequence.mjs#L6-L40)

批量上限24、逐步Esc检查和失败停止；不提供回滚。

<details>
<summary>查看原文（35行）</summary>

```text
export async function runSequence({ steps, dryRun = false, stopOnError = true, maxSteps = DEFAULT_MAX, primitives }) {
  const list = Array.isArray(steps) ? steps : [];
  if (list.length === 0) throw new Error('steps must be a non-empty array');
  const limit = Math.max(1, Math.min(Number(maxSteps) || DEFAULT_MAX, DEFAULT_MAX));
  if (list.length > limit) throw new Error(`too many steps: ${list.length} > maxSteps ${limit}`);

  const log = [];
  let cancelled = false;
  const t0 = Date.now();

  for (let i = 0; i < list.length; i++) {
    const step = list[i] || {};
    const action = String(step.action || '').toLowerCase();
    const rec = { i, action, ok: false };
    try {
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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 像素变化是否能证明操作成功？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能。点击后比较局部截图哈希，画面变化可能来自动画、光标或无关内容，而实际动作可能失败；无变化也可能已完成无视觉反馈的操作。实现会在无变化时自动再点一次，随后只要坐标在客户区且发生重试就返回ok=true，即使changed=false，因此工具ok不等于像素验证成功，更不等于业务完成。二次点击还可能重复提交或触发双击语义。OCR findLine允许包含和0.6字符集合相似度，重复标签或形近字可能命中不期望条目；没有唯一候选确认门。它适合提示下一步复核，不能作为严格放行条件。这些是源码机制与反例分析，未复现误操作。 批量dryRun只返回文字描述并逐步标ok，没有证明控件仍存在或参数可执行；stopOnError只基于工具ok，也不等于业务后置条件。Esc在步骤之间检查，无法保证中断同步子进程或撤销已经点击。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:359-371](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe/lib/index.js#L359-L371)

客户区内重试即ok，像素无变化并不失败。

<details>
<summary>查看原文（13行）</summary>

```text
      win32.screenClick(cx, cy);
      await sleep(450);
      let after = hash(grabPng(probe.x, probe.y, probe.w, probe.h).png);
      let retried = false;
      if (before === after) {
        win32.screenClick(cx, cy);
        await sleep(550);
        after = hash(grabPng(probe.x, probe.y, probe.w, probe.h).png);
        retried = true;
      }
      const changed = before !== after;
      const inClient = cx >= rect.x && cx <= rect.x + rect.w && cy >= rect.y && cy <= rect.y + rect.h;
      return { ok: changed || force === true || (inClient && retried), window: w.hwnd, title: w.title, text: hitText, control: uiaInfo, at: { x: cx, y: cy }, changed, retried, inClient, via, hint: changed ? undefined : (inClient ? 'No visual change: the coordinate is inside the window, which usually means a text-area click (caret moved = success). For a button or menu use desktop_click{control} or desktop_key.' : 'The coordinate fell outside the window or was covered - check window and coordinates.') };
```

</details>

**依据 2 · 源码核查**：[lib/ocr.mjs:141-152](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe/lib/ocr.mjs#L141-L152)

OCR先首个精确再包含或字符集合相似度，不要求唯一。

<details>
<summary>查看原文（12行）</summary>

```text
export function findLine(result, needle, opts = {}) {
  const want = normConf(needle);
  if (!want) return null;
  const cands = result.lines.map((l) => ({ l, k: normConf(l.text) }));
  const exact = cands.find((c) => c.k === want);
  if (exact) return exact.l;
  const part = cands.filter((c) => c.k.includes(want) || want.includes(c.k)).sort((x, y) => (x.k.length - want.length) - (y.k.length - want.length) || x.l.y - y.l.y)[0];
  if (part) return part.l;
  const sim = (a, b) => { const A = new Set(a), B = new Set(b); let h = 0; for (const x of A) if (B.has(x)) h++; return h / Math.max(A.size, B.size || 1); };
  const best = cands.map((c) => ({ c, s: sim(c.k, want), d: Math.abs(c.k.length - want.length) })).sort((x, y) => y.s - x.s || x.d - y.d)[0];
  if (best && best.s >= (opts.minSim ?? 0.6)) return best.c.l;
  return null;
```

</details>

**依据 3 · 源码核查**：[lib/sequence.mjs:21-32](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe/lib/sequence.mjs#L21-L32)

dryRun只describe并标ok，未对每步参数/业务可行性全面验证。

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

#### 缺口

- 重复点击、误匹配和业务成功率未测。
  **影响**：不能确定可安全自动执行哪些应用动作。
  **进一步探讨**：在本地测试应用覆盖重复标签、动画、延迟和无视觉反馈，用独立业务状态判定。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 桌面权限、临时文件和恢复成本如何？

**研究主题**：效果与总成本、采用判断

#### 完整回答

成本单位是一项正确执行且副作用可核查的桌面任务。首次需要Windows交互桌面、koffi、PowerShell、OCR语言及目标权限；持续需模型读取结果和人工核查高影响动作，失败后要恢复窗口、系统剪贴板及业务状态。OCR临时原图和缩放图现在都在finally尽力删除，启动还清理超过一小时的cue-ocr目录；但删除异常被忽略，dsh-sidecar截图仍仅加载时按年龄清理，用户指定输出或宿主附件另有生命周期，不能称所有截图即用即销。截图若交给远程模型仍可能离开本机，离线OCR不改变上层数据流。批量和去重能减少某些往返/附图，但现金、延迟和合格率没有同任务测量。只支持有监督非敏感测试窗口小范围试用，支付、发布和删除必须独立确认并核对业务状态；出现目标不唯一或预期外重试就停止，回人工操作。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:27-36](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe/lib/index.js#L27-L36)

截图目录仅模块加载时清理超时文件。

<details>
<summary>查看原文（10行）</summary>

```text
/** 截图临时目录：启动清理 1 小时前的旧文件，避免长期占盘 */
const SHOT_DIR = join(tmpdir(), 'dsh-sidecar');
try {
  mkdirSync(SHOT_DIR, { recursive: true });
  const now = Date.now();
  for (const f of readdirSync(SHOT_DIR)) {
    const p = join(SHOT_DIR, f);
    try { if (now - statSync(p).mtimeMs > 3600_000) unlinkSync(p); } catch {}
  }
} catch {}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:130-136](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe/lib/index.js#L130-L136)

启动DPI设置与历史OCR清理实际挂载。

```text
  };
  const reg = (t) => ctx.tools.register({ ...t, parameters: compileParameters(t.parameters || {}), output: t.output || textOutput, execute: async (...args) => plain(await t.execute(...args)) });

  // DPI 感知必须在任何截图 / 坐标计算之前执行，否则 125%/150% 缩放下坐标全偏
  const dpiState = initDpi();
  // 启动时清掉旧版本泄漏的 OCR 临时目录（issue #2），只删 1 小时前的
  try { sweepOcrTemps(3600_000); } catch {}
```

**依据 3 · 源码核查**：[lib/ocr.mjs:99-129](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe/lib/ocr.mjs#L99-L129)

原截图finally删除与旧目录超时清理，异常均忽略。

<details>
<summary>查看原文（31行）</summary>

```text
export function ocrBuffer(png, opts) {
  const dir = mkdtempSync(join(tmpdir(), 'cue-ocr-'));
  try {
    const f = join(dir, 'shot.png');
    writeFileSync(f, png);
    return ocrFile(f, opts);
  } finally {
    try { rmSync(dir, { recursive: true, force: true }); } catch {}
  }
}

/**
 * 清理历史遗留的 OCR 临时目录（旧版本泄漏的 cue-ocr-* / cue-ocr-up-*）。
 * 只删超过 maxAgeMs 的，避免误删别的进程正在用的目录。
 */
export function sweepOcrTemps(maxAgeMs = 3600_000) {
  let removed = 0;
  try {
    for (const name of readdirSync(tmpdir())) {
      if (!name.startsWith('cue-ocr-')) continue;
      const p = join(tmpdir(), name);
      try {
        const st = statSync(p);
        if (!st.isDirectory()) continue;
        if (Date.now() - st.mtimeMs < maxAgeMs) continue;
        rmSync(p, { recursive: true, force: true });
        removed += 1;
      } catch {}
    }
  } catch {}
  return removed;
```

</details>

#### 缺口

- Windows临时目录权限、退出清理和同任务资源数据未知。
  **影响**：无法评估长期隐私与磁盘负担。
  **进一步探讨**：用非敏感图像检查文件生命周期、权限和一次任务总耗时，再制定清理策略。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可否增加语义后置条件？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证的动作契约，调用者先声明可独立观察的目标状态，例如某字段值或只读状态标记；执行后用UIA/OCR/应用数据核对，画面哈希仅作诊断。非幂等动作默认不自动重试，模糊文本多候选转人工或返回候选列表。推导来自Q03中像素与业务状态不等价，新增代价是后置条件表达、额外读取与应用适配。最小验证在受控应用比较当前自动重点与契约版本的误提交、正确完成率和人工介入，若后置条件与动作共用同一错误识别或增加过多误停，则不能认为改善可靠性。当前没有该保证，保持假设。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:359-371](https://github.com/111xjyuan/dsh-desktop-sidecar/blob/ccb0b0ca44fdec60d9f9d6187c570b305ae8fabe/lib/index.js#L359-L371)

像素反馈和自动重试仍需语义后置条件。

<details>
<summary>查看原文（13行）</summary>

```text
      win32.screenClick(cx, cy);
      await sleep(450);
      let after = hash(grabPng(probe.x, probe.y, probe.w, probe.h).png);
      let retried = false;
      if (before === after) {
        win32.screenClick(cx, cy);
        await sleep(550);
        after = hash(grabPng(probe.x, probe.y, probe.w, probe.h).png);
        retried = true;
      }
      const changed = before !== after;
      const inClient = cx >= rect.x && cx <= rect.x + rect.w && cy >= rect.y && cy <= rect.y + rect.h;
      return { ok: changed || force === true || (inClient && retried), window: w.hwnd, title: w.title, text: hitText, control: uiaInfo, at: { x: cx, y: cy }, changed, retried, inClient, via, hint: changed ? undefined : (inClient ? 'No visual change: the coordinate is inside the window, which usually means a text-area click (caret moved = success). For a button or menu use desktop_click{control} or desktop_key.' : 'The coordinate fell outside the window or was covered - check window and coordinates.') };
```

</details>

#### 缺口

- 后置条件DSL和独立观察可行性未验证。
  **影响**：无法确认能降低误操作。
  **进一步探讨**：先在无副作用测试应用用独立状态日志作oracle对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
