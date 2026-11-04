# dsh-hao-import

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9c4b0c7](https://github.com/AB-png123/dshplugin/tree/9c4b0c7badc3f0681f9e9ed850bc652ceb1c85f5)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：在 DSH 启动时将 Hao Wallpaper 壁纸导入壁纸引擎目录。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 自动衔接两套目录和元数据，但实际展示需引擎。

> **主要限制**：[Q03](#research-q03) 已见键不检查目标文件或源内容变化，图片和两个状态文件也非单事务。

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
  - [Q01 · 插件为谁解决什么问题，与手工复制有何区别？](#detail-section-11)
  - [Q02 · 启动、扫描、去重与文件写入如何连接？](#detail-section-12)
  - [Q03 · 重复导入及恢复有什么条件和代价？](#detail-section-13)
  - [Q04 · 如何验证导入对账和恢复改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用 Hao Wallpaper 与 DSH 壁纸引擎并希望自动导入的用户。

用户可手工复制、命名壁纸并配置引擎；插件将此流程挂到启动。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 后台触发 | 启动后发起导入 | spawn 成功不等导入完成 |
| 增量复制 | 按 ID 与类型避免重复 | 不核已见输出内容 |
| 元数据写入 | 保存标题和已见键 | 与复制不是一个事务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与插件加载 | 自动触发必需 | 启动脚本 | 不触发导入 |
| Python 和平台 shell | 执行必需 | 运行扫描复制 | 失败只记录 |
| Hao 数据与图片 | 导入必需 | 来源及标题 | 无候选时跳过 |
| 壁纸引擎与可写目录 | 显示所需 | 读取输出 | 导入不等于显示 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份目标目录和状态 | 确认可恢复 |
| 触发 | DSH 后台启动导入脚本 | 检查日志而非仅看启动 |
| 导入 | 扫描并复制未见 ID | 检查文件和两个状态 |
| 核验 | 在引擎检查实际显示 | 不一致则停用并恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 文件副本与存储资源未知 | 配置、备份及核验 | 依赖及兼容未测 |
| 持续 | 图片和日志磁盘增长未知 | 检查缺失或重复 | 更新检测仅 ID 类型 |
| 恢复 | 副本和状态恢复成本未知 | 对账、清理或恢复 | 中断未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自动触发 | 启动后台 spawn | 宿主实际行为 |
| 增量复制 | ID 类型去重和复制 | 中断后的状态一致性 |
| 壁纸显示 | 作者描述依赖引擎 | 引擎实际加载结果 |

> **思考**：[Q03](#research-q03) 已见键不检查目标文件或源内容变化，图片和两个状态文件也非单事务。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 自动衔接两套目录和元数据，但实际展示需引擎。

[Q02](#research-q02) 使用锁文件与逐文件原子替换控制部分竞争；图片及多个 JSON 未组成事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 已见键不检查目标文件或源内容变化，图片和两个状态文件也非单事务。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在隔离目录备份后预演并核对文件与引擎；状态或路径不一致时停用并恢复备份。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

只读固定版本入口与 Python 导入路径，未运行 DSH 或导入。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、scripts/import_hao.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查包声明、Host 启动、Python 目录、去重及文件写入；未全面审计所有发现规则、Windows 脚本和引擎。
- 下一步：隔离环境覆盖重复运行、缺目标、源内容变化、状态损坏和进程中断。

**分析版本**

- **仓库**：[AB-png123/dshplugin](https://github.com/AB-png123/dshplugin)
- **版本号**：1.3.4（[固定提交 9c4b0c7](https://github.com/AB-png123/dshplugin/tree/9c4b0c7badc3f0681f9e9ed850bc652ceb1c85f5)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设增加目标和来源摘要对账能检测不一致，尚未验证。

隔离环境覆盖重复运行、缺目标、源内容变化、状态损坏和进程中断。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 324 | — | — | 4825 |
| .js | source | 1 | 164 | 111 | 38 | — |
| .mjs | test | 3 | 474 | 416 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/AB-png123/dshplugin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查启动时壁纸导入、去重及失败恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件为谁解决什么问题，与手工复制有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对已用 Hao Wallpaper 和 DSH 壁纸引擎的人，作者希望把新下载壁纸自动导入引擎上传目录并设置标题。人工复制并命名也可完成，该插件把发现、去重和导入安排到宿主启动时；壁纸实际显示由另一个引擎负责，不能因文件被复制就断言已经显示。项目是带 bundle patch 和 apply 的 DSH 插件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-12](https://github.com/AB-png123/dshplugin/blob/9c4b0c7badc3f0681f9e9ed850bc652ceb1c85f5/README.md#L5-L12)

作者解释场景、手工基线和引擎依赖。

```text
![DSH: >=0.2.0-rc.1](https://img.shields.io/badge/DSH-%3E%3D0.2.0--rc.1-4B32C3.svg)

> 一个开源的 [DeepSeek Harness](https://github.com/deepseek-ai) 插件：**每次启动 DSH 时，自动把 [Hao Wallpaper](https://www.haowallpaper.com/) 新下载的壁纸增量导入 DSH 壁纸引擎。** 支持 macOS 与 Windows。

Hao Wallpaper 的壁纸存在自己的目录里，而 DSH 壁纸引擎只认 `~/.dsh-wallpaper-engine/uploads/` 下的 `up-*` 文件。每次下载完都要手动拷贝、改名、写标题——本插件把这件事变成「打开 DSH 就自动完成」。

> **前置条件**：需要先安装 **`dsh-plugin-wallpaper-engine`**（DSH 壁纸引擎插件）。本插件解决的是「壁纸引擎装好后没有可用壁纸」的问题；没有壁纸引擎时，导入的文件不会被展示。

```

**依据 2 · 源码核查**：[package.json:1-13](https://github.com/AB-png123/dshplugin/blob/9c4b0c7badc3f0681f9e9ed850bc652ceb1c85f5/package.json#L1-L13)

包入口及分发内容。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "dsh-hao-import",
  "version": "1.3.4",
  "description": "DSH 启动时自动把 Hao Wallpaper 新下载的壁纸增量导入壁纸引擎（macOS/Windows，幂等，失败不影响启动）。",
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./package.json": "./package.json",
    "./cordis.patch.yml": "./cordis.patch.yml"
  },
  "files": [
    "lib",
```

</details>

**依据 3 · 源码核查**：[lib/index.js:93-108](https://github.com/AB-png123/dshplugin/blob/9c4b0c7badc3f0681f9e9ed850bc652ceb1c85f5/lib/index.js#L93-L108)

启动触发与环境路径。

<details>
<summary>查看原文（16行）</summary>

```text
export function applyFor(platform, env, ctx) {
  try {
    if (env?.DSH_HAO_IMPORT_DISABLE === '1') {
      ctx?.logger?.info?.('hao-import: 已被 DSH_HAO_IMPORT_DISABLE 禁用')
      return
    }

    const home =
      (platform === 'win32'
        ? env?.USERPROFILE || env?.HOME
        : env?.HOME || env?.USERPROFILE) || os.homedir()
    const engine =
      env?.DSH_WALLPAPER_ENGINE_DIR ||
      (env?.DSH_WE_DATA_DIR && env.DSH_WE_DATA_DIR.trim()) ||
      path.join(home, '.dsh-wallpaper-engine')
    const launch = resolveLaunch({ platform, env })
```

</details>

#### 缺口

- 没有目标宿主或壁纸引擎对照
  **影响**：不能确认自动显示或节省时间
  **进一步探讨**：固定图片样本在隔离配置中比较手工导入及显示。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启动、扫描、去重与文件写入如何连接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 检查禁用变量及入口和 Python helper 存在，再按平台选择 shell 或 PowerShell，后台 detached spawn 并忽略子进程标准输出；子进程错误和非零退出只记录警告。Python 按环境变量、config 和默认值解析上传目录；非 dry-run 先创建互斥锁，按 id:kind 判断是否已见，复制文件后更新内存 meta 和 seen，最后分别原子替换两个 JSON。两个状态文件和图片不是同一事务，启动提示已触发不等于成功导入；运行中断、损坏状态及并发恢复未验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:93-108](https://github.com/AB-png123/dshplugin/blob/9c4b0c7badc3f0681f9e9ed850bc652ceb1c85f5/lib/index.js#L93-L108)

禁用与路径选择。

<details>
<summary>查看原文（16行）</summary>

```text
export function applyFor(platform, env, ctx) {
  try {
    if (env?.DSH_HAO_IMPORT_DISABLE === '1') {
      ctx?.logger?.info?.('hao-import: 已被 DSH_HAO_IMPORT_DISABLE 禁用')
      return
    }

    const home =
      (platform === 'win32'
        ? env?.USERPROFILE || env?.HOME
        : env?.HOME || env?.USERPROFILE) || os.homedir()
    const engine =
      env?.DSH_WALLPAPER_ENGINE_DIR ||
      (env?.DSH_WE_DATA_DIR && env.DSH_WE_DATA_DIR.trim()) ||
      path.join(home, '.dsh-wallpaper-engine')
    const launch = resolveLaunch({ platform, env })
```

</details>

**依据 2 · 源码核查**：[lib/index.js:110-150](https://github.com/AB-png123/dshplugin/blob/9c4b0c7badc3f0681f9e9ed850bc652ceb1c85f5/lib/index.js#L110-L150)

文件检查、后台 spawn 和失败日志。

<details>
<summary>查看原文（41行）</summary>

```text
    if (!existsSync(launch.script)) {
      reportError(
        ctx,
        `找不到导入脚本 ${launch.script}（来源：${launch.origin}，平台：${launch.platform}），本次未运行。` +
          `当前平台需要 ${launch.defaultName}；请重装插件` +
          '（dsh plugin --profile desktop add github:AB-png123/dshplugin），' +
          '或把 DSH_HAO_IMPORT_SCRIPT 指向有效脚本。',
      )
      return
    }

    if (!existsSync(launch.helper)) {
      reportError(
        ctx,
        `找到 ${launch.script}，但同目录缺少 import_hao.py（来源：${launch.origin}），本次未运行。` +
          `${launch.defaultName} 需要与 import_hao.py 放在一起；插件安装不完整，请重装。`,
      )
      return
    }

    const childEnv = { ...env, HOME: home }
    if (platform === 'win32') childEnv.USERPROFILE = childEnv.USERPROFILE || home

    const child = spawn(launch.command, launch.args, {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
      env: childEnv,
    })
    child.on('error', (err) => {
      ctx?.logger?.warn?.(`hao-import: 启动导入失败 ${err?.message ?? err}`)
    })
    child.on('exit', (code, signal) => {
      if (code !== 0) {
        ctx?.logger?.warn?.(
          `hao-import: 导入脚本退出码 ${code}${signal ? `（信号 ${signal}）` : ''}，详见 ${path.join(engine, 'import.log')}`,
        )
      }
    })
    child.unref()
    ctx?.logger?.info?.('hao-import: 已在后台触发壁纸导入')
```

</details>

**依据 3 · 源码核查**：[scripts/import_hao.py:159-185](https://github.com/AB-png123/dshplugin/blob/9c4b0c7badc3f0681f9e9ed850bc652ceb1c85f5/scripts/import_hao.py#L159-L185)

目录优先级。

<details>
<summary>查看原文（27行）</summary>

```text
def _engine_dir() -> str:
    """壁纸引擎的数据目录，和引擎 pluginDataDir() 保持同一解析顺序。"""
    legacy = os.environ.get("DSH_WALLPAPER_ENGINE_DIR")
    if legacy:
        return os.path.expanduser(legacy)
    override = os.environ.get("DSH_WE_DATA_DIR")
    if override and override.strip():
        # 引擎只做 trim + resolve，不展开 ~；这里同样不展开，避免两边指向不同目录。
        return override.strip()
    return os.path.join(HOME, ".dsh-wallpaper-engine")


def _upload_dir(engine: str) -> str:
    """壁纸引擎的上传目录：DSH_WE_UPLOAD_DIR → config.json uploadDir → uploads。"""
    override = os.environ.get("DSH_WE_UPLOAD_DIR")
    if override:
        # 引擎对 DSH_WE_UPLOAD_DIR 原样返回（不 trim、不展开），这里保持一致。
        return override
    try:
        with open(os.path.join(engine, "config.json"), encoding="utf-8") as f:
            cfg = json.load(f)
        upload = cfg.get("uploadDir") if isinstance(cfg, dict) else None
        if isinstance(upload, str) and upload.strip():
            return upload.strip()
    except Exception:
        pass
    return os.path.join(engine, "uploads")
```

</details>

**依据 4 · 源码核查**：[scripts/import_hao.py:475-526](https://github.com/AB-png123/dshplugin/blob/9c4b0c7badc3f0681f9e9ed850bc652ceb1c85f5/scripts/import_hao.py#L475-L526)

锁、去重、复制与分别写入。

<details>
<summary>查看原文（52行）</summary>

```text
    # --dry-run 只预演，不创建目录、不写任何文件。
    if not args.dry_run:
        os.makedirs(UP, exist_ok=True)
        lock_path = os.path.join(UP, ".import.lock")
        if not acquire_lock(lock_path):
            print("另一个导入进程正在运行，跳过本次")
            return 0
        atexit.register(_release_lock, lock_path)
    meta: dict = load_json(META, {})
    state: dict = load_json(STATE, {"ids": {}})
    seen: dict = state.setdefault("ids", {})
    titles, local_paths = collect_catalog()
    sources = discover_sources(local_paths)

    if not sources:
        print_search_paths()
        return 0

    index = next_index(meta, os.listdir(UP) if os.path.isdir(UP) else [])

    added: list[tuple[str, float, str]] = []
    for widget_id in sorted(sources):
        for source, kind in sources[widget_id]:
            key = f"{widget_id}:{kind}"
            if key in seen:
                continue
            ext = os.path.splitext(source)[1].lower()
            if kind == "video" and ext not in VIDEO_EXTS:
                continue
            if kind == "image" and ext not in IMAGE_EXTS:
                continue
            out_id = f"up-hao-{index:02d}"
            dest = os.path.join(UP, out_id + ext)
            title = short_title(titles.get(widget_id, "")) + ("（动态）" if kind == "video" else "")
            try:
                size_mb = round(os.path.getsize(source) / 1048576, 1)
            except OSError:
                size_mb = 0.0
            if not args.dry_run:
                try:
                    shutil.copyfile(source, dest)
                except OSError as exc:
                    print(f"  ! 跳过 {source}: {exc}", file=sys.stderr)
                    continue
            meta[out_id] = {"title": title}
            seen[key] = out_id
            index += 1
            added.append((out_id + ext, size_mb, title))

    if not args.dry_run:
        dump_json(META, meta)
        dump_json(STATE, state)
```

</details>

**依据 5 · 源码核查**：[scripts/import_hao.py:217-242](https://github.com/AB-png123/dshplugin/blob/9c4b0c7badc3f0681f9e9ed850bc652ceb1c85f5/scripts/import_hao.py#L217-L242)

每个 JSON 原子替换。

<details>
<summary>查看原文（26行）</summary>

```text
def dump_json(path: str, data) -> None:
    """原子写入，避免中途退出把状态文件写坏。

    Windows 上杀毒 / 引擎偶尔会短暂占用目标文件，os.replace 抛 PermissionError；
    重试几次能避开这类瞬时占用。
    """
    os.makedirs(os.path.dirname(path), exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=os.path.dirname(path), prefix=".tmp-", suffix=".json")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
            f.write("\n")
        for attempt in range(3):
            try:
                os.replace(tmp, path)
                return
            except PermissionError:
                if attempt == 2:
                    raise
                time.sleep(0.15)
    except Exception:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise
```

</details>

#### 缺口

- 未测试系统中断或竞争
  **影响**：不能认定状态和图片总能一致
  **进一步探讨**：隔离目录在复制后和两次状态写之间终止进程并重跑。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 重复导入及恢复有什么条件和代价？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

去重键仅包含壁纸 ID 与类型；已有键直接跳过，即使原图片内容或标题改变，或目标文件已经被移除，也不会在此分支自动修复。JSON 读取异常回退默认值，可能丢失已见索引；不能把单次 JSON 原子替换称作跨文件事务。需要兼容 DSH、引擎、Hao 数据和 Python；首次备份上传目录与状态，持续消耗磁盘和日志维护，具体成本未知。先在隔离目录预演并核对状态与实物，缺引擎、路径异常或副本不一致时停用自动导入并恢复备份。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/import_hao.py:209-214](https://github.com/AB-png123/dshplugin/blob/9c4b0c7badc3f0681f9e9ed850bc652ceb1c85f5/scripts/import_hao.py#L209-L214)

读取失败回默认值。

```text
def load_json(path: str, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default
```

**依据 2 · 源码核查**：[scripts/import_hao.py:493-526](https://github.com/AB-png123/dshplugin/blob/9c4b0c7badc3f0681f9e9ed850bc652ceb1c85f5/scripts/import_hao.py#L493-L526)

见过的 ID 类型直接跳过，先复制后依次写两份 JSON。

<details>
<summary>查看原文（34行）</summary>

```text
    index = next_index(meta, os.listdir(UP) if os.path.isdir(UP) else [])

    added: list[tuple[str, float, str]] = []
    for widget_id in sorted(sources):
        for source, kind in sources[widget_id]:
            key = f"{widget_id}:{kind}"
            if key in seen:
                continue
            ext = os.path.splitext(source)[1].lower()
            if kind == "video" and ext not in VIDEO_EXTS:
                continue
            if kind == "image" and ext not in IMAGE_EXTS:
                continue
            out_id = f"up-hao-{index:02d}"
            dest = os.path.join(UP, out_id + ext)
            title = short_title(titles.get(widget_id, "")) + ("（动态）" if kind == "video" else "")
            try:
                size_mb = round(os.path.getsize(source) / 1048576, 1)
            except OSError:
                size_mb = 0.0
            if not args.dry_run:
                try:
                    shutil.copyfile(source, dest)
                except OSError as exc:
                    print(f"  ! 跳过 {source}: {exc}", file=sys.stderr)
                    continue
            meta[out_id] = {"title": title}
            seen[key] = out_id
            index += 1
            added.append((out_id + ext, size_mb, title))

    if not args.dry_run:
        dump_json(META, meta)
        dump_json(STATE, state)
```

</details>

**依据 3 · 作者声明**：[README.md:66-75](https://github.com/AB-png123/dshplugin/blob/9c4b0c7badc3f0681f9e9ed850bc652ceb1c85f5/README.md#L66-L75)

作者声明宿主、引擎和 Python 前提。

<details>
<summary>查看原文（10行）</summary>

````text
## 安装

插件**自带导入脚本**（包内 `scripts/`），装好插件就能用——不需要先克隆仓库、也不需要手动复制任何文件到 `~/.dsh/wallpaper-import/`。

```bash
# A. 直接从 GitHub 安装
dsh plugin --profile desktop add github:AB-png123/dshplugin

# B. 或者从 Release 下载 tgz 后安装（Windows 下路径改成 C:\...）
dsh plugin --profile desktop add /path/to/dsh-hao-import-1.3.4.tgz
````

</details>

#### 缺口

- 未测缺文件、同 ID 更新和状态损坏恢复
  **影响**：不能确认丢失或重复发生率
  **进一步探讨**：以复制样本删除输出或改变源文件后进行隔离对照。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证导入对账和恢复改进？

**研究主题**：新假设与验证

#### 完整回答

假设在每次启动时对已见键记录并核对目标文件存在及来源摘要，状态或文件不一致时先提示而非盲目复制，可改善丢文件和同 ID 更新的检测；这是未实现假设。对照当前 id:kind 跳过，在删除目标、修改源文件、破坏状态和复制后中断的样本中，记录重复文件、遗漏、误报、扫描开销及恢复时间；若误报或资源开销超过收益则否定。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/import_hao.py:493-526](https://github.com/AB-png123/dshplugin/blob/9c4b0c7badc3f0681f9e9ed850bc652ceb1c85f5/scripts/import_hao.py#L493-L526)

当前键和写入顺序。

<details>
<summary>查看原文（34行）</summary>

```text
    index = next_index(meta, os.listdir(UP) if os.path.isdir(UP) else [])

    added: list[tuple[str, float, str]] = []
    for widget_id in sorted(sources):
        for source, kind in sources[widget_id]:
            key = f"{widget_id}:{kind}"
            if key in seen:
                continue
            ext = os.path.splitext(source)[1].lower()
            if kind == "video" and ext not in VIDEO_EXTS:
                continue
            if kind == "image" and ext not in IMAGE_EXTS:
                continue
            out_id = f"up-hao-{index:02d}"
            dest = os.path.join(UP, out_id + ext)
            title = short_title(titles.get(widget_id, "")) + ("（动态）" if kind == "video" else "")
            try:
                size_mb = round(os.path.getsize(source) / 1048576, 1)
            except OSError:
                size_mb = 0.0
            if not args.dry_run:
                try:
                    shutil.copyfile(source, dest)
                except OSError as exc:
                    print(f"  ! 跳过 {source}: {exc}", file=sys.stderr)
                    continue
            meta[out_id] = {"title": title}
            seen[key] = out_id
            index += 1
            added.append((out_id + ext, size_mb, title))

    if not args.dry_run:
        dump_json(META, meta)
        dump_json(STATE, state)
```

</details>

**依据 2 · 源码核查**：[scripts/import_hao.py:209-214](https://github.com/AB-png123/dshplugin/blob/9c4b0c7badc3f0681f9e9ed850bc652ceb1c85f5/scripts/import_hao.py#L209-L214)

读状态异常回退。

```text
def load_json(path: str, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default
```

#### 缺口

- 未实现文件摘要和对照
  **影响**：不能判断有效性及成本
  **进一步探讨**：使用隔离副本执行样本并核输出。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
