# HTML Studio

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[ba589ec](https://github.com/louisecxqiu-glitch/html-doc-center/tree/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/louisecxqiu-glitch/html-doc-center)
<!-- END META -->

> **功能**：独立的本地 HTML 与 Markdown 文档浏览、编辑和版本恢复工作台。

> **亮点**：文件树和版本恢复同处一套入口，可在恢复前创建当前版本备份。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：另存处理没有普通保存的扫描根检查，备份失败也不总阻止覆盖。见 [Q02](#research-q02)。

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
  - [Q01 · 应用怎样把本地文件变成可浏览的工作区？](#detail-section-11)
  - [Q02 · 不同写入入口是否同样受路径约束和备份保护？](#detail-section-12)
  - [Q03 · 何时值得观察，什么时候应继续原编辑器？](#detail-section-13)
  - [Q04 · 集成快照能否减少错误覆盖的恢复时间？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常处理多个生成文档的维护者可在一个工作区查看和编辑。

对照浏览器逐文件预览及原编辑器加 Git。可信恢复仍可以用已有版本控制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 目录和编辑 | 查看与修改文件 | 独立本地应用 |
| 版本恢复 | 找回早期文本 | 需验证失败和范围 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| Python 与 aiohttp 或执行文件 | 启动本地服务 | 制品未核对 |
| 隔离工作目录 | 编辑测试 | 只放一次性文件 |

| 步骤 | 操作 | 失败处理 |
| --- | --- | --- |
| 准备 | 副本、回环、备份 | 无可信边界就停止 |
| 核对 | 保存和恢复路径 | 不接真实目录 |

**效果与成本**

| 阶段 | 负担 | 计量 |
| --- | --- | --- |
| 首次 | 配置和测试副本 | 设置人时 |
| 持续 | 历史与备份 | 恢复时间 |
| 退出 | 停止服务回原工具 | 核对遗留文件 |

| 结果 | 判据 | 边界 |
| --- | --- | --- |
| 集中预览 | 多文档可定位 | 未测效率 |
| 恢复 | 哈希正确且不误写 | 未运行测试 |

> **思考**：另存处理没有普通保存的扫描根检查，备份失败也不总阻止覆盖。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：文件树和版本恢复同处一套入口，可在恢复前创建当前版本备份。见 [Q01](#research-q01)、[Q02](#research-q02)。

普通保存和版本恢复各有校验及备份分支，另存以独立 handler 复制文件。

<a id="detail-section-5"></a>

### 1.4 主要限制

另存处理没有普通保存的扫描根检查，备份失败也不总阻止覆盖。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅观察隔离副本上的写范围与恢复，继续用原编辑器管理真实文件。见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定代码确认本地路由、写范围差异和恢复顺序。浏览器交互和部署保护未验证。

- 已检查：作者 README、包清单、源码路径 README.md、server.py、VERSION 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根分发、监听和文件 API。未运行目标代码或检查所有 UI。
- 下一步：先核查全部写路径、认证、备份失败和回退，之后对照文件恢复。

**分析版本**

- **仓库**：[louisecxqiu-glitch/html-doc-center](https://github.com/louisecxqiu-glitch/html-doc-center)
- **版本号**：未声明（[固定提交 ba589ec](https://github.com/louisecxqiu-glitch/html-doc-center/tree/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa)）
- **版本日期**：2026-07-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用无敏感文档比较恢复哈希、时间和误写，覆盖备份失败。见 [Q04](#research-q04)。

先核查全部写路径、认证、备份失败和回退，之后对照文件恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 2858 | — | — | 33957 |
| .js | source | 15 | 13174 | 11139 | 1180 | — |
| .md | example | 1 | 5 | — | — | 37 |
| .md | test | 1 | 110 | — | — | 1265 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/louisecxqiu-glitch/html-doc-center/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/louisecxqiu-glitch/html-doc-center/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/louisecxqiu-glitch/html-doc-center/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：目录内的 HTML/Markdown 编辑如何保存与恢复，路径边界是否在各入口一致？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 应用怎样把本地文件变成可浏览的工作区？

**研究主题**：场景与需求、功能与机制、工程质量与复用

#### 完整回答

有多份 AI 生成 HTML 或 Markdown 的使用者可启动独立本地服务器，把配置目录当作文档工作区。README 说明可用独立执行文件或 Python 加 aiohttp 启动，另列 Claude Code 插件入口。固定 server.py 注册保存、恢复、版本恢复、另存等路由，正常启动绑定 IPv4 回环并在可用时加 IPv6 回环。VERSION 标注 3.1.28。相较逐文件在浏览器或代码编辑器打开，集中入口让查看和编辑位于同一目录视图；没有证据表明根是 DSH 原生插件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-55](https://github.com/louisecxqiu-glitch/html-doc-center/blob/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa/README.md#L26-L55)

分发和独立启动

<details>
<summary>查看原文（30行）</summary>

````text
## Quick Start

### Option 1: Download executable (recommended, zero install)

1. Go to [Releases](https://github.com/louisecxqiu-glitch/html-doc-center/releases)
2. Download `HTMLStudio-<version>-macos-arm64.dmg` (Apple Silicon Mac) or `HTMLStudio.exe` (Windows)
3. On Mac, open the notarized DMG and drag **HTML Studio** to Applications; on Windows, double-click the EXE

### Option 2: Double-click launch (from source)

1. Download the project (ZIP or `git clone https://github.com/louisecxqiu-glitch/html-doc-center.git`)
2. Double-click `启动 HTMLStudio.command` (Mac) or `启动 HTMLStudio.bat` (Windows)
3. Browser opens automatically → start using

> First run auto-installs the dependency (`aiohttp`), requires internet.

### Option 2: Command line

```bash
git clone https://github.com/louisecxqiu-glitch/html-doc-center.git
cd html-doc-center
pip install aiohttp
python3 server.py --open-browser
# → http://localhost:9901
```

Or as a **Claude Code Plugin**:
```
/plugin install htmlstudio@claude-plugins-official
```
````

</details>

**依据 2 · 作者声明**：[README.md:59-71](https://github.com/louisecxqiu-glitch/html-doc-center/blob/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa/README.md#L59-L71)

目录和编辑自述

<details>
<summary>查看原文（13行）</summary>

```text
## Features

| Feature | Description |
|---------|-------------|
| 📁 **Directory tree** | Auto-discovers all HTML/MD files, searchable sidebar |
| ✏️ **Click to edit** | Zero-config inline editing with toolbar injection |
| 💾 **Smart auto-save** | 2s idle → snapshot; close → overwrite / save-as / discard |
| 🔍 **Markdown support** | Built-in MD editor with live preview |
| ⭐ **Favorites & sort** | Bookmark files, sort by time or name |
| 🔄 **Live refresh** | 10s polling with ETag signatures (99.99% zero-traffic) |
| 📂 **Multi-root** | Configure multiple scan directories via settings UI |
| 🖱️ **Drag & drop** | Move files between directories |
| 🔒 **Path-safe** | All writes validated against scan_roots whitelist |
```

</details>

**依据 3 · 源码核查**：[server.py:2658-2670](https://github.com/louisecxqiu-glitch/html-doc-center/blob/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa/server.py#L2658-L2670)

保存和恢复 API

<details>
<summary>查看原文（13行）</summary>

```text
    app.router.add_post("/api/wechat/format", handle_wechat_format)
    app.router.add_post("/api/snapshot", handle_snapshot)
    app.router.add_post("/api/save", handle_save)
    # v1.10.2: 版本时间线
    app.router.add_get("/api/history", handle_history)
    app.router.add_get("/api/history/content", handle_history_content)
    app.router.add_get("/api/history/diff", handle_history_diff)  # v1.10.3
    app.router.add_post("/api/restore", handle_restore)

    # v3.0: Version chain
    app.router.add_get("/api/versions", handle_versions_list)
    app.router.add_post("/api/versions/snapshot", handle_versions_snapshot)
    app.router.add_post("/api/versions/restore", handle_versions_restore)
```

</details>

**依据 4 · 源码核查**：[server.py:2759-2772](https://github.com/louisecxqiu-glitch/html-doc-center/blob/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa/server.py#L2759-L2772)

默认监听

<details>
<summary>查看原文（14行）</summary>

```text
    # 修复：(1) 检测 ::1 可用性 (2) 浏览器用 127.0.0.1 打开（不走 localhost 解析）
    if args.host:
        # --host 显式指定（如部署到 AnyDev 用 0.0.0.0），跳过自动检测
        bind_hosts = [args.host]
    else:
        bind_hosts = ["127.0.0.1"]
        try:
            import socket
            with socket.socket(socket.AF_INET6, socket.SOCK_STREAM) as s:
                s.bind(("::1", 0))
            bind_hosts.append("::1")
        except OSError:
            _log("⚠️ IPv6 (::1) 不可用，仅绑定 IPv4 (127.0.0.1)")
    web.run_app(app, host=bind_hosts, port=port, print=None)
```

</details>

**依据 5 · 源码核查**：[VERSION:1-1](https://github.com/louisecxqiu-glitch/html-doc-center/blob/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa/VERSION#L1-L1)

固定源版本

```text
3.1.28
```

#### 缺口

- 未打开浏览器验证编辑模式
  **影响**：不能确认视觉往返与制品一致
  **进一步探讨**：在一次性目录检查文件树、编辑和恢复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 不同写入入口是否同样受路径约束和备份保护？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

普通保存用 _resolve_safe 检查扫描根。覆盖前尝试备份，但备份异常只记日志，仍进入直接写文件。版本恢复先写 pre-restore 备份，失败会返回，再直接写目标内容。两者都不能由快照推断具备原子写入。另存为 handler 直接 resolve 请求提供的源和目标，检查是否存在后可删除已有目标、复制，并未调用扫描根校验。因此 README 的所有写入都受白名单保护在固定源码中不成立。若可调用该路径且进程具备文件权限，边界可能超出扫描目录；覆盖删除与复制分离也可能导致失败后丢目标。只核查静态路径，实际认证及客户端可达性仍要独立确认。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:63-71](https://github.com/louisecxqiu-glitch/html-doc-center/blob/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa/README.md#L63-L71)

作者声称白名单

```text
| 📁 **Directory tree** | Auto-discovers all HTML/MD files, searchable sidebar |
| ✏️ **Click to edit** | Zero-config inline editing with toolbar injection |
| 💾 **Smart auto-save** | 2s idle → snapshot; close → overwrite / save-as / discard |
| 🔍 **Markdown support** | Built-in MD editor with live preview |
| ⭐ **Favorites & sort** | Bookmark files, sort by time or name |
| 🔄 **Live refresh** | 10s polling with ETag signatures (99.99% zero-traffic) |
| 📂 **Multi-root** | Configure multiple scan directories via settings UI |
| 🖱️ **Drag & drop** | Move files between directories |
| 🔒 **Path-safe** | All writes validated against scan_roots whitelist |
```

**依据 2 · 源码核查**：[server.py:783-811](https://github.com/louisecxqiu-glitch/html-doc-center/blob/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa/server.py#L783-L811)

另存路径及覆盖分支

<details>
<summary>查看原文（29行）</summary>

```text
async def handle_save_as(request):
    """POST /api/save-as - 复制文件到新位置（拖入副本另存为）。"""
    try:
        body = await request.json()
        src_path = body.get("src_path", "")
        dest_path = body.get("dest_path", "")
        overwrite = body.get("overwrite", False)
        if not src_path or not dest_path:
            return web.json_response({"ok": False, "error": "missing src_path or dest_path"}, status=400)

        src = Path(src_path).expanduser().resolve()
        dest = Path(dest_path).expanduser().resolve()

        if not src.exists():
            return web.json_response({"ok": False, "error": "source_not_found"}, status=404)
        if dest.exists() and not overwrite:
            return web.json_response({"ok": False, "error": "target_exists"}, status=409)
        if dest.exists() and overwrite:
            dest.unlink()

        dest.parent.mkdir(parents=True, exist_ok=True)
        try:
            shutil.copy2(src, dest)  # copy2 保留 mtime
        except PermissionError:
            return web.json_response({"ok": False, "error": "permission_denied"}, status=403)

        return web.json_response({"ok": True, "dest_path": str(dest)})
    except Exception as e:
        return web.json_response({"ok": False, "error": str(e)}, status=500)
```

</details>

**依据 3 · 源码核查**：[server.py:1511-1539](https://github.com/louisecxqiu-glitch/html-doc-center/blob/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa/server.py#L1511-L1539)

常规保存的校验、备份与覆盖

<details>
<summary>查看原文（29行）</summary>

```text
    if mode not in ("overwrite", "new", "discard"):
        return web.json_response({"ok": False, "error": "mode 必须为 overwrite/new/discard"}, status=400)

    safe = _resolve_safe(raw_path, cfg.get("scan_roots", []))
    if not safe or not safe.is_file():
        return web.json_response({"ok": False, "error": "非法路径"}, status=403)

    if mode == "discard":
        n = _clean_auto_save(safe)
        _log(f"🗑  丢弃编辑 → 清理 {n} 个快照: {safe.name}")
        return web.json_response({"ok": True, "mode": "discard", "cleaned": n})

    if not content:
        return web.json_response({"ok": False, "error": "overwrite/new 必须传 content"}, status=400)

    if mode == "overwrite":
        # 先备份一个安全副本（v1.3: 备份扩展名跟随源文件，确保能被 _clean_auto_save 清理）
        backup_dir = _auto_save_dir(safe)
        backup = backup_dir / f"{safe.stem}-pre-overwrite-{_timestamp()}{safe.suffix}"
        try:
            shutil.copy2(safe, backup)
        except Exception as e:
            _log(f"⚠️ 备份原文件失败: {e}")

        try:
            with open(safe, "w", encoding="utf-8") as f:
                f.write(content)
        except Exception as e:
            return web.json_response({"ok": False, "error": f"写源文件失败: {e}"}, status=500)
```

</details>

**依据 4 · 源码核查**：[server.py:1893-1927](https://github.com/louisecxqiu-glitch/html-doc-center/blob/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa/server.py#L1893-L1927)

版本恢复的路径与先备份

<details>
<summary>查看原文（35行）</summary>

```text
    raw = (data.get("path") or "").strip()
    version_id = (data.get("version_id") or "").strip()
    safe = _resolve_safe(raw, cfg.get("scan_roots", []))
    if not safe or not safe.is_file():
        return web.json_response({"ok": False, "error": "非法路径"}, status=403)

    versions_data = _load_versions(safe)
    target = None
    for v in versions_data["versions"]:
        if v.get("id") == version_id or v.get("hash", "").startswith(version_id):
            target = v
            break
    if not target:
        return web.json_response({"ok": False, "error": "版本不存在"}, status=404)

    snap_path = Path(target["snapshot_path"])
    if not snap_path.exists():
        return web.json_response({"ok": False, "error": "快照文件已丢失"}, status=404)

    # Create pre-restore snapshot of current state
    try:
        current_content = safe.read_text(encoding="utf-8", errors="replace")
        auto_dir = _auto_save_dir(safe)
        ts = _timestamp()
        pre_path = auto_dir / f"{safe.stem}-pre-restore-{ts}{safe.suffix}"
        pre_path.write_text(current_content, encoding="utf-8")
    except OSError as e:
        return web.json_response({"ok": False, "error": f"pre-restore 备份失败: {e}"}, status=500)

    # Restore
    try:
        restore_content = snap_path.read_text(encoding="utf-8")
        safe.write_text(restore_content, encoding="utf-8")
    except OSError as e:
        return web.json_response({"ok": False, "error": f"恢复写入失败: {e}"}, status=500)
```

</details>

#### 缺口

- 未执行受控目录权限或中断测试
  **影响**：未知不同部署的路由访问及故障后的文件状态
  **进一步探讨**：用一次性路径测拒绝、权限不足和恢复，不使用用户文件

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时值得观察，什么时候应继续原编辑器？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

项目启动需要匹配制品或 Python 和 aiohttp。默认回环降低网络暴露，但也支持自选监听接口，配置默认密码为空；不能据回环假设每个同机调用都可信。首次需准备测试目录与独立备份，持续要维护历史和文件范围；失败后停服务，用副本和原编辑器恢复。由于另存写范围与作者描述不一致，现阶段仅观察，不把真实目录或远程共享交给此版。后续试验限定无价值文件，不切换生产监听。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:34-50](https://github.com/louisecxqiu-glitch/html-doc-center/blob/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa/README.md#L34-L50)

源启动所需环境

<details>
<summary>查看原文（17行）</summary>

````text
### Option 2: Double-click launch (from source)

1. Download the project (ZIP or `git clone https://github.com/louisecxqiu-glitch/html-doc-center.git`)
2. Double-click `启动 HTMLStudio.command` (Mac) or `启动 HTMLStudio.bat` (Windows)
3. Browser opens automatically → start using

> First run auto-installs the dependency (`aiohttp`), requires internet.

### Option 2: Command line

```bash
git clone https://github.com/louisecxqiu-glitch/html-doc-center.git
cd html-doc-center
pip install aiohttp
python3 server.py --open-browser
# → http://localhost:9901
```
````

</details>

**依据 2 · 源码核查**：[server.py:80-91](https://github.com/louisecxqiu-glitch/html-doc-center/blob/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa/server.py#L80-L91)

默认配置含空访问密码

<details>
<summary>查看原文（12行）</summary>

```text
    "scan_roots": _default_scan_roots(),
    "exclude_patterns": [
        "_auto-save", "node_modules", ".git", ".venv", "venv",
        "dist", "build", "__pycache__"
    ],
    "snapshot_debounce_ms": 2000,
    "snapshot_retention_days": 7,
    "tree_auto_refresh_seconds": 10,
    "port": 9901,
    "access_password": "",  # v2.1: 空则无密码；设了则访问需认证
    "share_server": "",  # v2.4: 在线分享服务地址（如 https://xxx.loca.lt），空则禁用在线链接
}
```

</details>

**依据 3 · 源码核查**：[server.py:2712-2717](https://github.com/louisecxqiu-glitch/html-doc-center/blob/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa/server.py#L2712-L2717)

可变监听接口

```text
                        help="Automatically open browser after server starts (default: True in packaged mode, use --no-open-browser to disable)")
    parser.add_argument("--port", type=int, default=None,
                        help="Port to listen on (overrides config, default: 9901)")
    parser.add_argument("--host", type=str, default=None,
                        help="Host/interface to bind (default: 127.0.0.1; use 0.0.0.0 for remote/AnyDev access)")
    args = parser.parse_args()
```

**依据 4 · 源码核查**：[server.py:783-811](https://github.com/louisecxqiu-glitch/html-doc-center/blob/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa/server.py#L783-L811)

独立另存边界

<details>
<summary>查看原文（29行）</summary>

```text
async def handle_save_as(request):
    """POST /api/save-as - 复制文件到新位置（拖入副本另存为）。"""
    try:
        body = await request.json()
        src_path = body.get("src_path", "")
        dest_path = body.get("dest_path", "")
        overwrite = body.get("overwrite", False)
        if not src_path or not dest_path:
            return web.json_response({"ok": False, "error": "missing src_path or dest_path"}, status=400)

        src = Path(src_path).expanduser().resolve()
        dest = Path(dest_path).expanduser().resolve()

        if not src.exists():
            return web.json_response({"ok": False, "error": "source_not_found"}, status=404)
        if dest.exists() and not overwrite:
            return web.json_response({"ok": False, "error": "target_exists"}, status=409)
        if dest.exists() and overwrite:
            dest.unlink()

        dest.parent.mkdir(parents=True, exist_ok=True)
        try:
            shutil.copy2(src, dest)  # copy2 保留 mtime
        except PermissionError:
            return web.json_response({"ok": False, "error": "permission_denied"}, status=403)

        return web.json_response({"ok": True, "dest_path": str(dest)})
    except Exception as e:
        return web.json_response({"ok": False, "error": str(e)}, status=500)
```

</details>

#### 缺口

- 没有验证默认认证、备份恢复和发行签名
  **影响**：不足以推荐管理实际工作目录
  **进一步探讨**：在隔离进程复核认证与所有写入路由，再核对备份和停止

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 集成快照能否减少错误覆盖的恢复时间？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是在多个 HTML 草稿频繁修改时，目录集成的版本入口能缩短找回上一个有效版本的时间。用同一批无敏感文件，对照原编辑器加 Git 和本地工作台，注入覆盖、备份失败及重启，比较恢复哈希、恢复时间与误写数。如果结果不一致、目标消失或手工修复抵消便利，就回到原编辑器。评估必须计入备份失败后仍写的路径。

#### 证据与依据

**依据 1 · 源码核查**：[server.py:1526-1539](https://github.com/louisecxqiu-glitch/html-doc-center/blob/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa/server.py#L1526-L1539)

备份失败后仍尝试覆盖

<details>
<summary>查看原文（14行）</summary>

```text
    if mode == "overwrite":
        # 先备份一个安全副本（v1.3: 备份扩展名跟随源文件，确保能被 _clean_auto_save 清理）
        backup_dir = _auto_save_dir(safe)
        backup = backup_dir / f"{safe.stem}-pre-overwrite-{_timestamp()}{safe.suffix}"
        try:
            shutil.copy2(safe, backup)
        except Exception as e:
            _log(f"⚠️ 备份原文件失败: {e}")

        try:
            with open(safe, "w", encoding="utf-8") as f:
                f.write(content)
        except Exception as e:
            return web.json_response({"ok": False, "error": f"写源文件失败: {e}"}, status=500)
```

</details>

**依据 2 · 源码核查**：[server.py:1912-1927](https://github.com/louisecxqiu-glitch/html-doc-center/blob/ba589ec7e3363a43b22bd2b98e89daf1d3e62baa/server.py#L1912-L1927)

版本恢复前备份的处理

<details>
<summary>查看原文（16行）</summary>

```text
    # Create pre-restore snapshot of current state
    try:
        current_content = safe.read_text(encoding="utf-8", errors="replace")
        auto_dir = _auto_save_dir(safe)
        ts = _timestamp()
        pre_path = auto_dir / f"{safe.stem}-pre-restore-{ts}{safe.suffix}"
        pre_path.write_text(current_content, encoding="utf-8")
    except OSError as e:
        return web.json_response({"ok": False, "error": f"pre-restore 备份失败: {e}"}, status=500)

    # Restore
    try:
        restore_content = snap_path.read_text(encoding="utf-8")
        safe.write_text(restore_content, encoding="utf-8")
    except OSError as e:
        return web.json_response({"ok": False, "error": f"恢复写入失败: {e}"}, status=500)
```

</details>

#### 缺口

- 未做比较
  **影响**：不能断言快照提升可靠性
  **进一步探讨**：配对任务并检查恢复内容与副作用

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
