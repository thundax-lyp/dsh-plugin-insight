# AIR-pixel Liquid Glass

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9ae9fa7](https://github.com/AIR-pixel/air-pixel-liquid-glass/tree/9ae9fa7cf63592a81b9469a023551a3b0d28e551)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AIR-pixel/air-pixel-liquid-glass)
<!-- END META -->

> **功能**：为 DSH 界面提供可配置的玻璃、壁纸和桌面透明主题。

> **亮点**：整合玻璃样式、壁纸与对话可读性调节。[Q01](#research-q01)

> **主要限制**：设置写入失败可能仍返回 HTTP 200 且 saved=false，桌面效果还依赖宿主补丁。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 谁需要玻璃主题，与原宿主界面相比是什么？](#detail-section-11)
  - [Q02 · 设置如何保存，写入失败时会怎样？](#detail-section-12)
  - [Q03 · 桌面透明和窗口模糊是否只安装主题就保证可用？](#detail-section-13)
  - [Q04 · 怎样试用、保存并恢复？](#detail-section-14)
  - [Q05 · 已有对话底板和透明控制之外，如何改善不同壁纸上的可读性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望调整 DSH 工作区视觉风格的用户；基线是原宿主主题。[Q01](#research-q01)

保留宿主原主题和窗口外观。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 主题 | 玻璃、壁纸和对话对比 | 实际可读性需测 |
| 保存 | 归一化并保存设置 | 写失败 saved=false |
| 桌面 | 透明及模糊 | 需可选宿主补丁 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容 DSH web 宿主 | 必需 | 设置与主题 | 使用原主题 |
| Windows compositor 与可选补丁 | 桌面透明需要 | 窗口材质 | 保留普通主题 |
| 可写配置目录与备份 | 持久设置需要 | 保存与恢复 | 只使用临时设置 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对宿主并备份配置 | 无恢复方案不补丁 |
| 试用 | 开启主题并检查文字可读 | 不适或卡顿还原 |
| 保存 | 检查 saved 并重启确认 | 保存失败恢复或修复配置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主与图形能力 | 调整与备份 | 兼容未知 |
| 持续 | 渲染资源 | 检查可读性 | 性能未测 |
| 恢复 | 补丁与配置维护 | 检查备份并还原 | 更新可能覆盖补丁 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 外观 | 可调样式与配置 | 真实设备阅读效果 |
| 保存 | 失败返回 saved=false | 磁盘与宿主实际可用 |

> **思考**：设置写入失败可能仍返回 HTTP 200 且 saved=false，桌面效果还依赖宿主补丁。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：整合玻璃样式、壁纸与对话可读性调节。[Q01](#research-q01)

配置夹取后先更新内存，再临时文件写入；失败以 saved=false 报告。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

设置写入失败可能仍返回 HTTP 200 且 saved=false，桌面效果还依赖宿主补丁。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先备份并检查可读性与保存状态；桌面补丁单独审阅和恢复。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持配置归一化与保存失败路径；未运行宿主或补丁。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 24 文件、无排除及解析错误；静态核查设置与声明，未运行宿主或补丁。
- 下一步：固定宿主版本测对比度、保存失败、重启及补丁恢复。

**分析版本**

- **仓库**：[AIR-pixel/air-pixel-liquid-glass](https://github.com/AIR-pixel/air-pixel-liquid-glass)
- **版本号**：0.2.2（[固定提交 9ae9fa7](https://github.com/AIR-pixel/air-pixel-liquid-glass/tree/9ae9fa7cf63592a81b9469a023551a3b0d28e551)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：针对当前壁纸的本地对比度建议可补充已有底板控制，须测误报和可读性。[Q05](#research-q05)

固定宿主版本测对比度、保存失败、重启及补丁恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 4606 | 2397 | 2000 | — |
| .md | source | 2 | 119 | — | — | 1280 |
| .mjs | source | 20 | 10375 | 7260 | 2607 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AIR-pixel/air-pixel-liquid-glass/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：玻璃主题如何配置和持久化，桌面透明补丁与可读性的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要玻璃主题，与原宿主界面相比是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

偏好透明、壁纸和自定义光标的 DSH 用户可调整外观；作者还提供对话两侧对比控制。相对原界面它提供审美和可读性调节，不改变模型能力；透明层、壁纸与用户视力不同，实际可读性必须验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-7](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/9ae9fa7cf63592a81b9469a023551a3b0d28e551/README.md#L1-L7)

作者描述外观及对比控制。

```text
# AIR-pixel Liquid Glass

A configurable Liquid Glass theme plugin for DeepSeek Harness. It adds translucent interface surfaces, an optional wallpaper, desktop transparency, window blur, custom cursors, click ripples, and per-side conversation contrast controls.

## Screenshots

Full transparency: strength 2.0 (效果强度) with desktop transparency on (透出桌面), so the desktop reaches the eye unfiltered. The per-side conversation plates are what keep the body copy readable this far up the slider.
```

**依据 2 · 源码核查**：[package.json:1-11](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/9ae9fa7cf63592a81b9469a023551a3b0d28e551/package.json#L1-L11)

包身份和入口。

<details>
<summary>查看原文（11行）</summary>

```text
{
  "name": "air-pixel-liquid-glass",
  "version": "0.2.2",
  "description": "A configurable Liquid Glass theme for DeepSeek Harness with frosted surfaces, wallpaper, desktop transparency, custom cursors, and click ripples.",
  "type": "module",
  "main": "./index.js",
  "license": "MIT",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
```

</details>

#### 缺口

- 未运行 DSH、Windows compositor 或补丁
  **影响**：不能确认样式兼容、文本对比度与恢复结果
  **进一步探讨**：固定宿主及设备，在隔离配置测样式、保存失败和补丁恢复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 设置如何保存，写入失败时会怎样？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 对设置进行类型筛选和范围夹取，GET/POST 路由维护内存配置；写入用临时文件再 rename，失败返回 saved=false。路由先更新内存再尝试持久化，因此当次设置可能生效但未持久保存，不能仅看 HTTP 200 判断重启后恢复；读取错误回默认值。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:123-144](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/9ae9fa7cf63592a81b9469a023551a3b0d28e551/index.js#L123-L144)

配置类型和范围归一化。

<details>
<summary>查看原文（22行）</summary>

```text
/** In-memory mirror; always a valid, normalized document. */
let currentConfig = { ...DEFAULT_CONFIG };

/** Coerce a stored value onto the defaults. Unknown keys are dropped. */
function normalizeConfig(raw) {
  const next = { ...DEFAULT_CONFIG };
  if (raw === null || typeof raw !== 'object') return next;

  for (const key of ['enabled', 'surface', 'cursor', 'desktop', 'ripple', 'plate', 'windowBlur']) {
    if (typeof raw[key] === 'boolean') next[key] = raw[key];
  }
  if (typeof raw.intensity === 'number' && Number.isFinite(raw.intensity)) {
    // Clamp instead of reject: a slider that drifted out of range should not
    // be able to wedge the theme into an unusable state.
    next.intensity = Math.min(2, Math.max(0.2, Math.round(raw.intensity * 10) / 10));
  }
  if (typeof raw.rippleSize === 'number' && Number.isFinite(raw.rippleSize)) {
    // Same shape of clamp as `intensity`, same reason. Kept in step with the
    // renderer's copy in `normalizeDocument` — the two are separate
    // implementations on purpose (they run in different processes) and the
    // previous pair drifted, which showed up as a visible flicker on launch.
    next.rippleSize = Math.min(2, Math.max(0.5, Math.round(raw.rippleSize * 10) / 10));
```

</details>

**依据 2 · 源码核查**：[index.js:173-193](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/9ae9fa7cf63592a81b9469a023551a3b0d28e551/index.js#L173-L193)

读取回默认及临时文件写入失败。

<details>
<summary>查看原文（21行）</summary>

```text
  try {
    if (!fs.existsSync(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
    return normalizeConfig(JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')));
  } catch (error) {
    console.warn('[liquid-glass] failed to read config, using defaults:', error?.message ?? error);
    return { ...DEFAULT_CONFIG };
  }
}

/** Write through a temp file + rename so a crash mid-write cannot truncate it. */
function writeConfigFile() {
  try {
    fs.mkdirSync(STORE_DIR, { recursive: true });
    const temp = `${CONFIG_FILE}.tmp-${process.pid}`;
    fs.writeFileSync(temp, `${JSON.stringify(currentConfig, null, 2)}\n`, 'utf-8');
    fs.renameSync(temp, CONFIG_FILE);
    return true;
  } catch (error) {
    console.warn('[liquid-glass] failed to write config:', error?.message ?? error);
    return false;
  }
```

</details>

**依据 3 · 源码核查**：[index.js:945-974](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/9ae9fa7cf63592a81b9469a023551a3b0d28e551/index.js#L945-L974)

请求读取、内存更新及 saved 标志。

<details>
<summary>查看原文（30行）</summary>

```text
async function handleConfig(req, res) {
  if (prepareResponse(req, res)) return;

  if (req.method === 'GET') {
    res.statusCode = 200;
    // `material` is not part of the config: it is not settable, and a client
    // POSTing it back would be asserting a fact about its own process that it
    // cannot observe. It rides on the same response only to save a round trip.
    res.end(JSON.stringify({ ...currentConfig, ...(await materialFields()) }));
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'method not allowed' }));
    return;
  }

  const body = await readJsonBody(req);
  if (body.error) {
    res.statusCode = body.statusCode;
    res.end(JSON.stringify({ error: body.error }));
    return;
  }
  const payload = body.value;
  currentConfig = normalizeConfig({ ...currentConfig, ...payload });
  const saved = writeConfigFile();

  res.statusCode = 200;
  res.end(JSON.stringify({ ...currentConfig, saved, ...(await materialFields()) }));
```

</details>

#### 缺口

- 未运行 DSH、Windows compositor 或补丁
  **影响**：不能确认样式兼容、文本对比度与恢复结果
  **进一步探讨**：固定宿主及设备，在隔离配置测样式、保存失败和补丁恢复

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 桌面透明和窗口模糊是否只安装主题就保证可用？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不是。作者明确这两项依赖对应宿主补丁及 Windows compositor；可选补丁修改已安装客户端并保留备份、支持检查和撤销，客户端更新会覆盖补丁。其他主题样式与这些能力分开；主机版本兼容声明不等于任何版本都已验证，操作前确认备份、版本与退出方案。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:37-43](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/9ae9fa7cf63592a81b9469a023551a3b0d28e551/README.md#L37-L43)

作者区分主题与桌面补丁。

```text
## Install

Install `air-pixel-liquid-glass` as a DeepSeek Harness bundle, then enable **Liquid Glass** in Settings. The desktop transparency and window blur controls need their host-side patch; the theme and other visual options do not.

## Development

Requires Node.js. Run the syntax and behavior checks with:
```

**依据 2 · 作者声明**：[README.md:57-71](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/9ae9fa7cf63592a81b9469a023551a3b0d28e551/README.md#L57-L71)

作者说明宿主及运行时兼容检查。

<details>
<summary>查看原文（15行）</summary>

````text
## Compatibility

Designed for DeepSeek Harness on Windows and the web GUI. Desktop transparency and window blur depend on the installed Harness build and supported Windows compositor APIs.

**The manifest deliberately declares no `engines.dsh` and no `@deepseek-ai/dsh-*` peer range.** That is not an oversight. `dsh-app-boot` compares those ranges against the running runtime and **throws** when they do not match, which takes the whole plugin off the boot path — and no semver range can cover the next prerelease. A range pinned to `0.2.1-rc.2` fails on `0.2.1-rc.5`; a caret range that survives `0.2.1-rc.5` still fails on `0.2.2-rc.1`, because semver only admits prereleases of the exact `major.minor.patch` tuple a comparator names. On a nightly channel that means every update is a fresh outage.

So compatibility is checked at run time instead of declared up front:

```powershell
node tools/compat.mjs
```

It reports the running core version, whether the manifest would be gated, whether the client contract the theme depends on (`settings.section` + `slots.register`) still exists in the installed packages, and whether the host patch is still in place. Anything the check cannot confirm is a warning the settings panel also shows, rather than a silent disappearance.

The slots seat moved into the core's client runner in the `0.2.x` line, so `0.1.x` cores are out — stay on plugin `0.1.0` there.
````

</details>

**依据 3 · 作者声明**：[README.md:73-75](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/9ae9fa7cf63592a81b9469a023551a3b0d28e551/README.md#L73-L75)

作者说明补丁、备份与更新影响。

```text
## Permissions and behavior

The plugin injects theme styles and custom cursors into the Harness web UI, reads and writes its own JSON settings through a local host API, and logs diagnostic status through the host logger. The optional `tools/asarpatch.py` helper modifies the installed client's main-process file — `lib/main.js`, inside `app.asar` when the archive is sealed, or in place under `resources/app/` when the archive has been unpacked — and only when run explicitly by the user; it keeps a backup and supports checking or reverting the patch. The patch is lost on every client update and has to be re-applied. The plugin does not make external network requests.
```

#### 缺口

- 未运行 DSH、Windows compositor 或补丁
  **影响**：不能确认样式兼容、文本对比度与恢复结果
  **进一步探讨**：固定宿主及设备，在隔离配置测样式、保存失败和补丁恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用、保存并恢复？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH web 宿主；桌面透明还依赖适配的 Windows 和可选补丁。先备份配置并用默认主题强度检查正文可读性，改变设置后检查 saved 标志和重启效果；补丁属于对已安装客户端的独立变更，需事先检查备份及恢复。渲染性能和所有设备可读性未经本轮测试。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:20-35](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/9ae9fa7cf63592a81b9469a023551a3b0d28e551/package.json#L20-L35)

客户端依赖及平台。

<details>
<summary>查看原文（16行）</summary>

```text
    "DEVELOPMENT.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "immediately": true,
      "platform": "web"
    }
  },
```

</details>

**依据 2 · 源码核查**：[index.js:182-193](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/9ae9fa7cf63592a81b9469a023551a3b0d28e551/index.js#L182-L193)

持久保存可能失败。

<details>
<summary>查看原文（12行）</summary>

```text
/** Write through a temp file + rename so a crash mid-write cannot truncate it. */
function writeConfigFile() {
  try {
    fs.mkdirSync(STORE_DIR, { recursive: true });
    const temp = `${CONFIG_FILE}.tmp-${process.pid}`;
    fs.writeFileSync(temp, `${JSON.stringify(currentConfig, null, 2)}\n`, 'utf-8');
    fs.renameSync(temp, CONFIG_FILE);
    return true;
  } catch (error) {
    console.warn('[liquid-glass] failed to write config:', error?.message ?? error);
    return false;
  }
```

</details>

**依据 3 · 源码核查**：[index.js:963-974](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/9ae9fa7cf63592a81b9469a023551a3b0d28e551/index.js#L963-L974)

返回 saved 状态。

<details>
<summary>查看原文（12行）</summary>

```text
  const body = await readJsonBody(req);
  if (body.error) {
    res.statusCode = body.statusCode;
    res.end(JSON.stringify({ error: body.error }));
    return;
  }
  const payload = body.value;
  currentConfig = normalizeConfig({ ...currentConfig, ...payload });
  const saved = writeConfigFile();

  res.statusCode = 200;
  res.end(JSON.stringify({ ...currentConfig, saved, ...(await materialFields()) }));
```

</details>

**依据 4 · 作者声明**：[README.md:73-75](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/9ae9fa7cf63592a81b9469a023551a3b0d28e551/README.md#L73-L75)

作者声明补丁恢复边界。

```text
## Permissions and behavior

The plugin injects theme styles and custom cursors into the Harness web UI, reads and writes its own JSON settings through a local host API, and logs diagnostic status through the host logger. The optional `tools/asarpatch.py` helper modifies the installed client's main-process file — `lib/main.js`, inside `app.asar` when the archive is sealed, or in place under `resources/app/` when the archive has been unpacked — and only when run explicitly by the user; it keeps a backup and supports checking or reverting the patch. The patch is lost on every client update and has to be re-applied. The plugin does not make external network requests.
```

#### 缺口

- 未运行 DSH、Windows compositor 或补丁
  **影响**：不能确认样式兼容、文本对比度与恢复结果
  **进一步探讨**：固定宿主及设备，在隔离配置测样式、保存失败和补丁恢复

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有对话底板和透明控制之外，如何改善不同壁纸上的可读性？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：允许用户对当前壁纸与对话文本做本地对比度检查，并在不足时建议而非强制调整底板，可能减少可读性问题。现有已有对话两侧对比控制、强度夹取，不能把它们当新功能；未穷尽已有等价算法，自动采样可能忽略动态图、文字颜色或隐私。对照现有设置，在亮暗、动态图和不同视力需求场景测对比度、误报及人工阅读时间；无改善或误导则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-7](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/9ae9fa7cf63592a81b9469a023551a3b0d28e551/README.md#L1-L7)

已有对话对比控制。

```text
# AIR-pixel Liquid Glass

A configurable Liquid Glass theme plugin for DeepSeek Harness. It adds translucent interface surfaces, an optional wallpaper, desktop transparency, window blur, custom cursors, click ripples, and per-side conversation contrast controls.

## Screenshots

Full transparency: strength 2.0 (效果强度) with desktop transparency on (透出桌面), so the desktop reaches the eye unfiltered. The per-side conversation plates are what keep the body copy readable this far up the slider.
```

**依据 2 · 源码核查**：[index.js:127-144](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/9ae9fa7cf63592a81b9469a023551a3b0d28e551/index.js#L127-L144)

已有强度及范围夹取。

<details>
<summary>查看原文（18行）</summary>

```text
function normalizeConfig(raw) {
  const next = { ...DEFAULT_CONFIG };
  if (raw === null || typeof raw !== 'object') return next;

  for (const key of ['enabled', 'surface', 'cursor', 'desktop', 'ripple', 'plate', 'windowBlur']) {
    if (typeof raw[key] === 'boolean') next[key] = raw[key];
  }
  if (typeof raw.intensity === 'number' && Number.isFinite(raw.intensity)) {
    // Clamp instead of reject: a slider that drifted out of range should not
    // be able to wedge the theme into an unusable state.
    next.intensity = Math.min(2, Math.max(0.2, Math.round(raw.intensity * 10) / 10));
  }
  if (typeof raw.rippleSize === 'number' && Number.isFinite(raw.rippleSize)) {
    // Same shape of clamp as `intensity`, same reason. Kept in step with the
    // renderer's copy in `normalizeDocument` — the two are separate
    // implementations on purpose (they run in different processes) and the
    // previous pair drifted, which showed up as a visible flicker on launch.
    next.rippleSize = Math.min(2, Math.max(0.5, Math.round(raw.rippleSize * 10) / 10));
```

</details>

#### 缺口

- 未运行 DSH、Windows compositor 或补丁
  **影响**：不能确认样式兼容、文本对比度与恢复结果
  **进一步探讨**：固定宿主及设备，在隔离配置测样式、保存失败和补丁恢复

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
