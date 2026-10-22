# AIR-pixel Liquid Glass

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[4b980fb](https://github.com/AIR-pixel/air-pixel-liquid-glass/tree/4b980fb2cbac292274a6b3136696ab27e3b1decc)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/AIR-pixel/air-pixel-liquid-glass)
<!-- END META -->

> **实现功能**：为 DSH Web 提供磨砂玻璃主题、壁纸、光标、波纹和对话对比度设置；桌面透明/模糊需显式修改宿主 app.asar。

> **核心亮点**：主题涵盖表面、壁纸、光标、波纹和分侧对比度；详见[Q01](#research-q01)。

> **风险与缺陷**：桌面透明需要用户修改安装归档，升级可能失效；配置写路由的跨源和失败处理仍有缺口。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 插件改变了哪些界面体验？](#detail-section-11)
  - [Q02 · 桌面透明和窗口模糊如何启用？](#detail-section-12)
  - [Q03 · 配置 API 有什么边界？](#detail-section-13)
  - [Q04 · 适合怎样试用与改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户希望改善 DSH 界面外观和长对话可读性。

DSH 默认 UI；插件提供可配置玻璃质感和可选桌面透出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| CSS 主题 | 外观自定义 | 视觉未实测 |
| 透明补丁 | 桌面透出 | 修改 app.asar |
| 配置 API | 保存选项 | 写路由需核安全 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH 0.2.1-rc.2 | 声明兼容 | 版本可能失效 |
| Windows/Electron | 桌面材质 | 只用普通主题 |
| app.asar 备份 | 补丁回滚 | 恢复困难 |

#### 试用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 普通主题 | 调对比度/光标 | 文字可读 |
| 补丁副本 | check/备份/应用 | 材质状态准确 |
| 恢复 | revert/更新 | 不影响宿主启动 |

**效果与成本**

#### 成本

| 阶段 | 资源与人工 | 边界 |
| --- | --- | --- |
| 普通主题 | 安装、调色和可读性检查 | 低端设备性能未知 |
| 桌面透明 | 备份并修改 app.asar | 升级/版本适配需维护 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 界面皮肤 | CSS、光标、波纹 | 实机可读性 |
| 透明窗 | 补丁/文件通道 | 目标系统效果 |
| 配置 | JSON API | 外层访问控制 |

> **思考**：桌面透明需要用户修改安装归档，升级可能失效；配置写路由的跨源和失败处理仍有缺口。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：主题涵盖表面、壁纸、光标、波纹和分侧对比度；详见[Q01](#research-q01)。

主题涵盖表面、壁纸、光标、波纹和分侧对比度；详见[Q01](#research-q01)。

Host 配置路由和文件回执机制连接 Web CSS 与 Electron 材质；补丁为显式可选路径。

<a id="detail-section-5"></a>

### 1.4 主要限制

桌面透明需要用户修改安装归档，升级可能失效；配置写路由的跨源和失败处理仍有缺口。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先试普通主题，再于可回滚副本核补丁、窗口材质和更新后恢复；详见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

主题源代码与补丁路径可核，真实视觉未验；配置 API 通配 CORS 且持久化失败仍返回成功，有待核外层访问控制。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、client.js、index.js、tools/asarpatch.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅 README、client.js、index.js、asarpatch.py；未运行插件或修改宿主。
- 下一步：目标 Windows/Web 视觉和性能对照；核 webServer 外层访问控制、写入失败状态和宿主补丁更新/回滚。

**分析版本**

- **仓库**：[AIR-pixel/air-pixel-liquid-glass](https://github.com/AIR-pixel/air-pixel-liquid-glass)
- **版本号**：0.2.0（[固定提交 4b980fb](https://github.com/AIR-pixel/air-pixel-liquid-glass/tree/4b980fb2cbac292274a6b3136696ab27e3b1decc)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把补丁状态与效果验证暴露给用户并收紧配置写入，可降低主题试用风险；需目标宿主验证。详见[Q04](#research-q04)。

目标 Windows/Web 视觉和性能对照；核 webServer 外层访问控制、写入失败状态和宿主补丁更新/回滚。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 4541 | 2367 | 1968 | — |
| .md | source | 2 | 106 | — | — | 1050 |
| .mjs | source | 19 | 10092 | 7057 | 2559 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AIR-pixel/air-pixel-liquid-glass/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AIR-pixel/air-pixel-liquid-glass/issues?q=is%3Aissue+created%3A2026-09-22T06%3A03%3A32.763Z..2026-10-22T06%3A03%3A32.763Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AIR-pixel/air-pixel-liquid-glass/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A03%3A32.763Z..2026-10-22T06%3A03%3A32.763Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核实主题视觉能力、桌面透明所需宿主补丁及本地配置路由边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件改变了哪些界面体验？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

插件为 DSH Web 注入磨砂表面、壁纸、光标、点击波纹和人/助手分侧对比度设置，Host 持有 JSON 配置，客户端渲染 CSS 和设置页。它面向希望定制桌面外观与长会话可读性的个人用户。README 的图片是 stand-in shell 上渲染的合成图，不是实际 DSH 截屏；本轮没有在目标宿主目测最终效果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-38](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/README.md#L1-L38)

作者说明功能且披露截图为合成渲染。

<details>
<summary>查看原文（38行）</summary>

```text
# AIR-pixel Liquid Glass

A configurable Liquid Glass theme plugin for DeepSeek Harness. It adds translucent interface surfaces, an optional wallpaper, desktop transparency, window blur, custom cursors, click ripples, and per-side conversation contrast controls.

## Screenshots

Full transparency: strength 2.0 (效果强度) with desktop transparency on (透出桌面), so the desktop reaches the eye unfiltered. The per-side conversation plates are what keep the body copy readable this far up the slider.

![Liquid Glass with desktop transparency](assets/preview-transparent.png)

The same screen with and without the theme:

![The stock shell beside Liquid Glass](assets/preview-vs-stock.png)

At the default strength, over the theme's own wallpaper — sidebar, pane, dialog, menu and floating panel:

![Frosted panels at the default strength](assets/preview-surfaces.png)

| Custom cursors | Click ripple |
| --- | --- |
| ![The five shipped cursors](assets/preview-cursors.png) | ![A click ripple, held](assets/preview-ripple.png) |

The four tint presets, light and dark:

![Tint presets in light and dark](assets/preview-tints.png)

These are renders, not photographs. `node tools/docshots.mjs` boots the real `client.js` in a stand-in shell over a drawn desktop. A screen capture cannot show this feature at all: `PrintWindow` drops the alpha channel, so a see-through window comes back as a black rectangle — measured in `tools/appshot.py`.

## Features

- Frosted surfaces with adjustable strength, blur, tint, and wallpaper.
- Optional transparent desktop and Windows window material controls. Desktop transparency requires the included client patch helper; the setting reports when the patch is unavailable.
- Custom cursors and click ripples, each independently configurable.
- Separate contrast settings for human and assistant messages.
- English and Chinese settings UI.

## Install

```

</details>

**依据 2 · 源码核查**：[client.js:1902-1906](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/client.js#L1902-L1906)

按配置注入光标/波纹 CSS。

```text
      // ---- cursors ----------------------------------------------------------
      if (config.cursor) parts.push(cursorDeclarations());

      // ---- ripple -----------------------------------------------------------
      if (config.ripple) parts.push(rippleCss(intensity, drop, config.rippleSize));
```

**依据 3 · 源码核查**：[client.js:3464-3508](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/client.js#L3464-L3508)

注册语言字典与设置入口。

<details>
<summary>查看原文（45行）</summary>

```text
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'liquid-glass: dictionaries');
      const t = ctx.locale.bind(NS);

      ctx.effect(() => {
        applyTheme();
        // The wallpaper is a single layer whose gradient is scheme-specific, so
        // a light/dark flip has to repaint it. Watching the attribute is cheaper
        // and far more reliable than listening for whatever toggles the theme.
        const observer = new MutationObserver(() => {
          const el = document.getElementById(WALLPAPER_ID);
          if (el !== null) delete el.dataset.signature;
          paintWallpaper();
        });
        observer.observe(document.body, {
          attributes: true,
          attributeFilter: ['data-ds-dark-theme']
        });
        return () => {
          observer.disconnect();
          const tag = document.getElementById(STYLE_ID);
          if (tag !== null) tag.remove();
          dropWallpaper();
          dropLiquidDefs();
        };
      }, 'liquid-glass: theme sheet');

      ctx.effect(() => installRipples(), 'liquid-glass: click ripples');

      ctx.slots.inject(SECTION_SLOT, () =>
        ctx.slots.register({
          name: SECTION_SLOT,
          id: 'liquid-glass',
          order: 42,
          label: () => t('nav'),
          locale: NS,
          children: { [ITEM_SLOT]: { kind: 'list', scope: 'root' } }
        }, LiquidGlassSection)
      );

      ctx.slots.inject(ITEM_SLOT, () =>
        ctx.slots.register({
          name: ITEM_SLOT,
          id: 'panel',
          order: 0,
          locale: NS
```

</details>

#### 缺口

- 未在 DSH 目标版本运行主题。
  **影响：**真实视觉、性能与易读性未证实。
  **进一步探讨：**在目标 Windows/Web 宿主比较默认/主题界面并采集对比度和帧率。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 桌面透明和窗口模糊如何启用？

**研究主题：**功能与机制、依赖、兼容与流程

#### 完整回答

普通主题 CSS 可以由插件直接注入；真正透出桌面的透明窗口和 Windows 窗口材质则依赖用户显式运行 asarpatch.py 修改已安装的 app.asar。脚本会核查归档结构/完整性、先备份并支持 --check/--revert；补丁将主进程 watcher 加入归档，Host 通过文件请求/回执与主进程通信。DSH 更新后补丁可能消失，需要按目标版本重新核对，不宜把开关等同于已经生效。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-66](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/README.md#L39-L66)

安装/兼容性说明透明与模糊需要补丁，支持 0.2.1-rc.2。

<details>
<summary>查看原文（28行）</summary>

````text
Install `air-pixel-liquid-glass` as a DeepSeek Harness bundle, then enable **Liquid Glass** in Settings. The desktop transparency and window blur controls need their host-side patch; the theme and other visual options do not.

## Development

Requires Node.js. Run the syntax and behavior checks with:

```powershell
node tools/preflight.mjs
node tools/verify.mjs
node tools/patcheck.mjs
node tools/mutationaudit.mjs
```

Regenerate the images above with `node tools/docshots.mjs` (writes `assets/`, which `screenshots.json` points the plugin market at). Some visual inspection scripts need Python with Pillow. See [DEVELOPMENT.md](DEVELOPMENT.md) for architecture, checks, and rename migration details.

## Compatibility

Designed for DeepSeek Harness on Windows and the web GUI. Desktop transparency and window blur depend on the installed Harness build and supported Windows compositor APIs.

Verified against Harness core `0.2.1-rc.2`; that is the only core this version declares support for. The slots seat moved into the core's client runner in the 0.2.x line, so `0.1.x` cores are out — stay on plugin `0.1.0` there.

## Permissions and behavior

The plugin injects theme styles and custom cursors into the Harness web UI, reads and writes its own JSON settings through a local host API, and logs diagnostic status through the host logger. The optional `tools/asarpatch.py` helper modifies the installed Harness `app.asar` only when run explicitly by the user; it keeps a backup and supports checking or reverting the patch. The plugin does not make external network requests.

## License

MIT. See [LICENSE](LICENSE).
````

</details>

**依据 2 · 源码核查**：[tools/asarpatch.py:663-685](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/tools/asarpatch.py#L663-L685)

显式 check/revert/staging/apply 参数。

<details>
<summary>查看原文（23行）</summary>

```text
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="report state and exit")
    ap.add_argument("--revert", action="store_true", help="restore the backup")
    ap.add_argument(
        "--material",
        choices=MATERIALS,
        default="none",
        help="what the window should show behind itself: none = the desktop "
        "itself, sharp (default); acrylic = DWM's blurred copy of it",
    )
    ap.add_argument("--staging", metavar="PATH", help="write here instead of installing")
    ap.add_argument(
        "--apply-staged",
        action="store_true",
        help="install an already-verified app.asar.new without repacking",
    )
    ap.add_argument(
        "--print-watcher",
        action="store_true",
        help="write the window-material watcher to stdout and exit",
    )
    args = ap.parse_args()
```

</details>

**依据 3 · 源码核查**：[tools/asarpatch.py:777-955](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/tools/asarpatch.py#L777-L955)

验证归档、备份和替换安装文件。

<details>
<summary>查看原文（179行）</summary>

```text
    if args.check:
        print("not patched")
        return 1

    if not watcher_only:
        hits = text.count(OLD)
        if hits != 1:
            print(f"the win32 primary block matched {hits} times, expected exactly 1")
            print("the archive is from a different DSH build; the patch needs re-deriving")
            return 2

    # Before mutating anything: confirm the integrity formula reproduces the
    # hashes already in the archive. This has to happen against the untouched
    # header, because it resolves each member through its stored offset.
    #
    # The gate is a MATCH RATE, not "zero mismatches". Measured on the shipped
    # archive: 9 of 11470 records are already stale, so requiring a clean sheet
    # would refuse a patch the app itself is perfectly happy to run. A wrong
    # formula would fail nearly all of them, so 95% separates the two cases
    # with a lot of room. The stale ones are reported rather than hidden — they
    # are pre-existing, not introduced here.
    #
    # A raw byte-count check is deliberately NOT used as the structural test:
    # re-serialising the header can legitimately change its length when an
    # offset crosses a power of ten, and asserting otherwise would flag a
    # correct repack. The read-back below is the real test.
    checked, bad = verify_integrity_against(header, base, raw)
    rate = (checked - len(bad)) / checked if checked else 0.0
    if rate < 0.95:
        print("REFUSING TO PATCH — the integrity formula does not describe this archive:")
        print(f"  only {rate:.1%} of {checked} records reproduced ({len(bad)} mismatched)")
        print(f"  first mismatch: {bad[0]}")
        return 3
    print(f"integrity formula confirmed on {checked} records ({rate:.2%} reproduced)")
    if bad:
        print(f"  {len(bad)} record(s) were already stale in the shipped archive:")
        for path in bad[:9]:
            print(f"    · {path}")

    if watcher_only:
        new_text = text + build_watcher()
    else:
        new_text = text.replace(OLD, build_new(args.material)) + build_watcher()
    new_bytes = new_text.encode("utf-8")
    old_off = int(target["offset"])
    delta = len(new_bytes) - len(before[MEMBER])

    # Rebuild the body region as: everything before main.js, the patched
    # main.js, everything after. Members before main.js keep their offsets;
    # every member after it moves right by exactly the growth.
    prefix_len = old_off
    prefix = raw[base : base + prefix_len]
    suffix = raw[base + prefix_len + len(before[MEMBER]) :]
    body = prefix + new_bytes + suffix

    for path, entry in members.items():
        if not has_body(entry):
            continue
        raw_off = entry["offset"]
        off = int(raw_off)
        if off > old_off:
            moved = off + delta
            # Offsets are stored as STRINGS in this archive. `off + delta`
            # silently produced an int, which quietly cost two bytes per member
            # (the quotes) — 26 members, 52 bytes, and the only reason it was
            # noticed is the read-back verification. Preserve the original type
            # rather than trusting that a reader will coerce it.
            entry["offset"] = str(moved) if isinstance(raw_off, str) else moved
    target["size"] = len(new_bytes)
    # The patched member's own hash, recomputed. Its blocks are unchanged in
    # count: main.js is 490 KB against a 4 MB blockSize, so one block.
    if "integrity" in target:
        block_size = int(target["integrity"].get("blockSize", 4194304))
        target["integrity"] = integrity_for(new_bytes, block_size)

    out = emit(header, body)

    # --- verification -----------------------------------------------------
    # The only thing that makes a repack trustworthy is reading it back and
    # comparing every untouched byte against the snapshot. A repacked archive
    # that loads but silently truncates a module would be far worse than no
    # patch at all, and nothing about it would be visible until something
    # obscure broke weeks later.
    problems = []

    try:
        o_header, o_base, _ = parse(out)
    except SystemExit as error:
        print(f"REPACK FAILED — the result does not parse: {error}")
        return 3

    o_members = dict(walk(o_header))
    if set(o_members) != set(members):
        problems.append("member set changed")

    for path, entry in o_members.items():
        if not has_body(entry):
            continue
        off = int(entry["offset"])
        size = int(entry["size"])
        if o_base + off + size > len(out):
            problems.append(f"{path}: runs past the end of the archive")
            continue
        got = out[o_base + off : o_base + off + size]
        want = new_bytes if path == MEMBER else before.get(path)
        if want is None:
            problems.append(f"{path}: has no original body to compare against")
        elif got != want:
            problems.append(f"{path}: body differs from the original")
        # Types matter: the shipped archive stores offsets as strings, and a
        # reader that coerces is not a guarantee that every reader does.
        if type(entry["offset"]) is not type(members[path]["offset"]):
            problems.append(f"{path}: offset type changed to {type(entry['offset']).__name__}")

    # The patched member's hash must describe the bytes that are actually there.
    main_rec = o_members[MEMBER].get("integrity")
    if main_rec is not None:
        want_rec = integrity_for(new_bytes, int(main_rec.get("blockSize", 4194304)))
        if want_rec["hash"] != main_rec.get("hash"):
            problems.append("lib/main.js: integrity hash does not match the patched bytes")
        if want_rec["blocks"] != list(main_rec.get("blocks", [])):
            problems.append("lib/main.js: integrity blocks do not match the patched bytes")

    # Walk order must cover the body region exactly once: no gaps, no overlaps.
    cursor = 0
    for path, entry in walk(o_header):
        if not has_body(entry):
            continue
        if int(entry["offset"]) != cursor:
            problems.append(
                f"gap or overlap before {path}: offset {entry['offset']} but cursor {cursor}"
            )
            break
        cursor = int(entry["offset"]) + int(entry["size"])
    if cursor != len(out) - o_base:
        problems.append(
            f"body region ends at {cursor}, archive has {len(out) - o_base} bytes of body"
        )

    if problems:
        print("REPACK FAILED — nothing written:")
        for p in problems[:20]:
            print("  ·", p)
        return 3

    print(f"verified  {len(o_members)} members read back, every untouched body byte-identical")
    print(f"          lib/main.js {len(before[MEMBER])} -> {len(new_bytes)} bytes ({delta:+d}), hash rewritten")
    print(f"          archive     {len(raw)} -> {len(out)} bytes")

    if args.staging:
        Path(args.staging).write_bytes(out)
        print(f"staged    -> {args.staging}")
        return 0

    if not backup.exists():
        shutil.copy2(ASAR, backup)
        print(f"backup    -> {backup.name}")

    tmp = ASAR.parent / (ASAR.name + ".new")
    try:
        tmp.write_bytes(out)
        tmp.replace(ASAR)
        print(f"patched   -> {ASAR.name}")
    except (PermissionError, OSError) as error:
        # Keep the repacked archive on disk: it is already verified, so once
        # DSH is closed the whole job is a rename rather than a re-run.
        print(f"could not replace the archive: {error}")
        print(f"DSH is holding it open. Close it, then either run this again or")
        print(f"rename {tmp} over {ASAR.name} yourself.")
        return 4

    # The pointer is the host's only reliable route to this archive, and this
    # run is the one that knows what is in it now. Leaving it alone keeps
    # whatever the PREVIOUS run wrote — measured here: a `--revert` (which
    # records `stock`) followed by a patch left the pointer saying `stock`
    # while the archive carried `none`, which is the one file whose job is to
    # describe the archive. The host rescanning the marker is what kept that
    # survivable, not an argument for leaving a stale record behind.
    write_pointer(ASAR, "patched", present if watcher_only else args.material)
```

</details>

**依据 4 · 源码核查**：[index.js:691-822](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/index.js#L691-L822)

文件通道等待主进程回执并处理超时/陈旧回执。

<details>
<summary>查看原文（132行）</summary>

```text
 * `setBackgroundMaterial` exists only in the main process, and the one channel
 * to it this project owns is a patched `lib/main.js` (tools/asarpatch.py, which
 * appends a watcher alongside the transparency recipe). So the request travels
 * through a file:
 *
 *   this half writes  <resources>/liquid-glass-window-material.json
 *   the watcher applies it to the largest visible window and writes
 *                     <resources>/liquid-glass-window-report.json
 *   this half reads the report back
 *
 * Both halves name the directory the archive itself lives in — the host via
 * `resourcesDir()` below, the watcher via `process.resourcesPath` — so neither
 * has to guess where the other is.
 *
 * The materials are the same two `WINDOW_MATERIALS` already declares below:
 * `on` is the blurred one, `off` the sharp one.
 */
const WINDOW_BLUR_FILES = {
  wanted: 'liquid-glass-window-material.json',
  report: 'liquid-glass-window-report.json'
};

/**
 * How long one request will hold open waiting for the main process to answer.
 *
 * The watcher answers in single-digit milliseconds (a directory watch plus one
 * setter call), so the wait is what an UNPATCHED main process costs, not what
 * a patched one does. It is paid at most once per material change — see
 * `windowBlurState.gaveUp`.
 */
const WINDOW_BLUR_WAIT_MS = 900;
const WINDOW_BLUR_POLL_MS = 50;

/** Where the archive — and therefore the watcher's two files — live. */
function resourcesDir() {
  const resolved = resolveAsarPathDetailed();
  if (resolved.file === null) return null;
  return path.dirname(resolved.file);
}

/**
 * One request's position in the file protocol.
 *
 * `seq` exists because a report that does not say WHICH request it answered is
 * indistinguishable from a stale one: the report file survives restarts, and a
 * host that trusted any report it found would show 已生效 for a window the new
 * session never touched. `writtenMaterial` is what makes the write lazy — this
 * runs on every config read, and rewriting the same request would make the
 * watcher work on every panel poll. `gaveUp` is the unpatched-main memo: after
 * one full wait with no receipt, later requests read once and answer instead
 * of paying the deadline again. It resets the moment the material changes,
 * because that is the moment a working watcher has something new to say.
 *
 * `seeded` closes a hole in that first sentence. Counting from 0 in every
 * process means a new session's first request is `1` — which is also the
 * number the previous session's report is carrying, because the report file
 * survives restarts and most sessions only ever issue one. So the guard
 * against a stale report was defeated by the one event that makes reports
 * stale. The first request of a session is numbered above whatever the report
 * on disk already answered.
 */
const windowBlurState = { seq: 0, writtenMaterial: null, gaveUp: false, seeded: false };

/** Bounded synchronous-free pause between report polls. */
const windowBlurWait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Apply `windowBlur` through the file protocol and report what actually
 * happened.
 *
 * The report is a READBACK, not an echo — but the readback now happens in
 * another process, so "what actually happened" arrives as a report that must
 * name THIS request's `seq` before it is believed. Every failure path names
 * itself (`no-archive` / `write-failed` / `no-report` / and whatever the
 * watcher reported: `no-window` / `set-failed` / `no-getter` /
 * `material-not-applied`), so the renderer can show a reason instead of a
 * switch that is on and does nothing.
 *
 * @param {boolean} desired
 * @returns {Promise<{ active: boolean, why: string|null, material: string|null }>}
 */
async function applyWindowBlur(desired) {
  const material = desired === true ? WINDOW_MATERIALS.on : WINDOW_MATERIALS.off;
  const failed = (why) => ({ active: false, why, material: null });

  const dir = resourcesDir();
  if (dir === null) return failed('no-archive');

  if (!windowBlurState.seeded) {
    windowBlurState.seeded = true;
    try {
      const carried = JSON.parse(fs.readFileSync(path.join(dir, WINDOW_BLUR_FILES.report), 'utf8'));
      if (typeof carried?.seq === 'number') windowBlurState.seq = carried.seq;
    } catch {
      // No report yet, or one that cannot be read: counting from 0 is right,
      // and the watcher's first answer will be for seq 1.
    }
  }

  if (windowBlurState.writtenMaterial !== material) {
    windowBlurState.seq += 1;
    try {
      fs.writeFileSync(
        path.join(dir, WINDOW_BLUR_FILES.wanted),
        `${JSON.stringify({ seq: windowBlurState.seq, material })}\n`
      );
    } catch {
      return failed('write-failed');
    }
    windowBlurState.writtenMaterial = material;
    windowBlurState.gaveUp = false;
  }

  const readReport = () => {
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(path.join(dir, WINDOW_BLUR_FILES.report), 'utf8'));
    } catch {
      return null;
    }
    if (parsed === null || typeof parsed !== 'object') return null;
    if (parsed.seq !== windowBlurState.seq) return null;
    return {
      active: parsed.active === true,
      why: typeof parsed.why === 'string' ? parsed.why : null,
      material: typeof parsed.material === 'string' ? parsed.material : null,
      applied: parsed.applied === true,
      verified: parsed.verified === true
    };
  };

  // `no-window` is a transient answer — the watcher reports it for the requests
```

</details>

#### 缺口

- 未运行补丁或目标桌面。
  **影响：**补丁在具体 DSH 版本和 Windows compositor 上的成功率未知。
  **进一步探讨：**在可回滚副本上核对归档哈希、重启效果及升级后恢复。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 配置 API 有什么边界？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

Host 通过 webServer 注册 GET/POST 精确路径，POST 接受最大 64KiB JSON 对象，normalizeConfig 后写入 DSH_HOME 的 JSON 设置文件。响应设置 Access-Control-Allow-Origin: * 并允许跨源 POST；handler 内未检查 Origin、Host、CSRF token 或 Content-Type。具体能否从恶意网页跨站改写还取决于 DSH webServer 的监听/认证和浏览器本地网络限制，本轮不能宣称可被远程利用。另 writeConfigFile 失败仍返回 200 和 saved:false，当前进程的配置已变化，重启后可能回退。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:40-46](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/index.js#L40-L46)

服务依赖和 64KiB body 上限。

```text
export const inject = ['webServer'];

const PLUGIN_ID = 'air-pixel-liquid-glass';
const ROUTE = '/api/theme-liquid-glass/config';

/** Largest accepted request body. The payload is a handful of scalars. */
const MAX_BODY_BYTES = 64 * 1024;
```

**依据 2 · 源码核查**：[index.js:609-658](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/index.js#L609-L658)

通配 CORS 和 JSON body 校验。

<details>
<summary>查看原文（50行）</summary>

```text
function prepareResponse(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    let size = 0;
    let body = '';
    let settled = false;
    const done = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    req.on('data', (chunk) => {
      if (settled) return;
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        done({ error: 'request body too large', statusCode: 413 });
        req.resume();
        return;
      }
      body += chunk;
    });
    req.on('end', () => {
      if (settled) return;
      try {
        const parsed = JSON.parse(body || '{}');
        if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
          done({ error: 'request body must be a JSON object', statusCode: 400 });
          return;
        }
        done({ value: parsed });
      } catch {
        done({ error: 'invalid JSON', statusCode: 400 });
      }
    });
    req.on('error', () => done({ error: 'request body could not be read', statusCode: 400 }));
  });
}
```

</details>

**依据 3 · 源码核查**：[index.js:881-960](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/index.js#L881-L960)

GET/POST 处理、先更新内存再存盘并注册 route。

<details>
<summary>查看原文（80行）</summary>

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
}

/**
 * @param {object} ctx plugin context; needs the `webServer` service.
 */
export function apply(ctx) {
  const detail = detectWindowMaterialDetailed();
  ctx.logger?.info?.(`[liquid-glass] config file: ${CONFIG_FILE}`);
  // Logged eagerly even though the route would probe it lazily: ~80 ms once, and
  // "why does 透出桌面 do nothing" is otherwise a question with no visible
  // answer anywhere — the renderer cannot see this at all.
  ctx.logger?.info?.(
    `[liquid-glass] window material: ${detail.material}` +
      ` (${detail.materialWhy}` +
      (detail.materialPath === null ? '' : `, ${detail.materialPath}`) +
      (detail.materialScanVia === null ? '' : `, via ${detail.materialScanVia}`) +
      ')'
  );
  if (detail.materialScanError !== null) {
    // The one line that makes "scan-failed" actionable: which reader was tried,
    // and the errno it came back with. Without it the report is "the file is
    // there and I cannot open it", which is a dead end.
    ctx.logger?.info?.(
      `[liquid-glass] readers tried: ` +
        detail.materialScanError
          .map((entry) => `${entry.via} -> ${entry.code} (${entry.syscall})`)
          .join(' | ')
    );
  }
  if (detail.materialPath === null) {
    // The failed candidates are the whole diagnosis, so they are logged rather
    // than summarised — this line is the only place the real paths show up.
    ctx.logger?.info?.(
      `[liquid-glass] app.asar candidates tried: ` +
        detail.materialTried.map((entry) => `${entry.why} ${entry.path}`).join(' | ')
    );
  }
  if (detail.materialHost !== null) {
    // The single most decisive fact when a scan fails, and the one that is
    // unguessable without it: a plain Node host answers ENOTDIR for a `.asar`
    // path because it is a file, while a host whose `fs` was rewritten hands
    // back the archive's members because it is pretending it is a directory.
    // Only logged when the scan failed, because that is the only time it is set.
    ctx.logger?.info?.(
      `[liquid-glass] host: electron=${detail.materialHost.electron ?? 'none'}` +
        `, noAsar=${detail.materialHost.noAsar}` +
        `, listsAsDirectory=${detail.materialHost.listsAsDirectory}`
    );
  }
  ctx.webServer.register({ kind: 'exact', path: ROUTE, handler: handleConfig });
```

</details>

**依据 4 · 源码核查**：[index.js:183-204](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/index.js#L183-L204)

设置写入暂存文件和 rename 的失败处理。

<details>
<summary>查看原文（22行）</summary>

```text
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
}

currentConfig = readConfigFile();

// ---------------------------------------------------------------------------
// Window-material detection
// ---------------------------------------------------------------------------
//
// The window's backdrop is a main-process option with no renderer-visible
// counterpart: from inside the page there is no way to ask "is the window base
// actually open behind me, or am I painting onto Electron's default white".
```

</details>

#### 缺口

- 未核 DSH webServer 对该路由的外层访问控制。
  **影响：**无法给出真实跨站可达性或漏洞结论。
  **进一步探讨：**在隔离浏览器和宿主检查监听地址、外层鉴权、Origin/Host 行为和写失败恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 适合怎样试用与改进？

**研究主题：**采用判断、效果与总成本、新假设与验证

#### 完整回答

普通外观设置可先在目标 0.2.1-rc.2 中试用并目测可读性、低性能设备的波纹开销；桌面透明则先备份 app.asar，在可回滚安装副本中做 check/patch/revert 和更新恢复。主题没有外部请求的作者声明可与源码网络调用静态核对，但未动态监测。建议写路由统一限制本机来源和请求类型，并在持久化失败时回滚内存/返回错误；对普通用户更应清楚区分无需补丁的视觉效果与需要修改宿主归档的效果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-66](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/README.md#L39-L66)

说明安装、适配范围、补丁和无外部网络请求。

<details>
<summary>查看原文（28行）</summary>

````text
Install `air-pixel-liquid-glass` as a DeepSeek Harness bundle, then enable **Liquid Glass** in Settings. The desktop transparency and window blur controls need their host-side patch; the theme and other visual options do not.

## Development

Requires Node.js. Run the syntax and behavior checks with:

```powershell
node tools/preflight.mjs
node tools/verify.mjs
node tools/patcheck.mjs
node tools/mutationaudit.mjs
```

Regenerate the images above with `node tools/docshots.mjs` (writes `assets/`, which `screenshots.json` points the plugin market at). Some visual inspection scripts need Python with Pillow. See [DEVELOPMENT.md](DEVELOPMENT.md) for architecture, checks, and rename migration details.

## Compatibility

Designed for DeepSeek Harness on Windows and the web GUI. Desktop transparency and window blur depend on the installed Harness build and supported Windows compositor APIs.

Verified against Harness core `0.2.1-rc.2`; that is the only core this version declares support for. The slots seat moved into the core's client runner in the 0.2.x line, so `0.1.x` cores are out — stay on plugin `0.1.0` there.

## Permissions and behavior

The plugin injects theme styles and custom cursors into the Harness web UI, reads and writes its own JSON settings through a local host API, and logs diagnostic status through the host logger. The optional `tools/asarpatch.py` helper modifies the installed Harness `app.asar` only when run explicitly by the user; it keeps a backup and supports checking or reverting the patch. The plugin does not make external network requests.

## License

MIT. See [LICENSE](LICENSE).
````

</details>

**依据 2 · 源码核查**：[client.js:2445-2571](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/client.js#L2445-L2571)

波纹事件和本地镜像配置。

<details>
<summary>查看原文（127行）</summary>

```text
      document.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
      document.addEventListener('pointerup', onPointerUp, { capture: true, passive: true });
      document.addEventListener('pointercancel', onPointerUp, { capture: true, passive: true });
      window.addEventListener('blur', onPointerUp);
      return () => {
        document.removeEventListener('pointerdown', onPointerDown, { capture: true });
        document.removeEventListener('pointerup', onPointerUp, { capture: true });
        document.removeEventListener('pointercancel', onPointerUp, { capture: true });
        window.removeEventListener('blur', onPointerUp);
        heldGlint = null;
        if (rippleRoot !== null) {
          rippleRoot.remove();
          rippleRoot = null;
        }
        liveRipples = 0;
      };
    }

    // -----------------------------------------------------------------------
    // Host persistence
    // -----------------------------------------------------------------------

    /** The config keys whose only legal values are `true` and `false`. */
    const BOOLEAN_KEYS = ['enabled', 'surface', 'cursor', 'desktop', 'ripple', 'plate', 'windowBlur'];

    /**
     * Coerce a stored or received document onto the defaults.
     *
     * Used by BOTH the localStorage mirror and the host response, and that is
     * the point. They were separate implementations until this round, and the
     * two had already drifted: the mirror's version was a plain spread, so a
     * hand-edited `intensity: 99` painted at 99 until the host answered and
     * snapped it back to 2 — a visible flicker on every launch, from a value
     * the host would never have written.
     *
     * (`coerceBooleans` is still separate because it is the one part both paths
     * need verbatim, and an earlier attempt to make the mirror's version *only*
     * that silently dropped `intensity` and `tint` — the spread it replaced was
     * doing real work that was easy to miss.)
     */
    function normalizeDocument(raw) {
      const next = { ...DEFAULT_CONFIG };
      if (raw === null || typeof raw !== 'object') return next;
      coerceBooleans(next, raw);
      if (typeof raw.intensity === 'number' && Number.isFinite(raw.intensity)) {
        // Same clamp and the same 1-decimal rounding the host applies, so the
        // mirror and the host can never disagree about a value.
        next.intensity = Math.min(2, Math.max(0.2, Math.round(raw.intensity * 10) / 10));
      }
      if (typeof raw.rippleSize === 'number' && Number.isFinite(raw.rippleSize)) {
        next.rippleSize = Math.min(2, Math.max(0.5, Math.round(raw.rippleSize * 10) / 10));
      }
      // `null` is a legal value here, not a missing one: it is "follow the
      // curve". So this branch is written as an explicit null test rather than
      // as a typeof check — a document that says `frost: null` must keep the
      // follow behaviour, and the `{ ...DEFAULT_CONFIG }` spread above only
      // makes that true by accident. A junk value (a string, NaN) resolves to
      // the default instead, which is also follow.
      if (raw.frost === null) {
        next.frost = null;
      } else if (typeof raw.frost === 'number' && Number.isFinite(raw.frost)) {
        next.frost = Math.min(FROST_MAX, Math.max(0, Math.round(raw.frost)));
      }
      if (typeof raw.plateLevel === 'number' && Number.isFinite(raw.plateLevel)) {
        next.plateLevel = Math.min(PLATE_MAX, Math.max(0, Math.round(raw.plateLevel * 100) / 100));
      }
      // A closed set, so an unrecognised value resolves to the default rather
      // than being carried through to `buildCss`. That matters more here than
      // for a numeric field: a bad number still renders *something*, while a bad
      // mode string renders nothing at all — see the note on `plateSide` there.
      if (PLATE_SIDES.includes(raw.plateSide)) next.plateSide = raw.plateSide;
      const tint = normalizeTint(raw.tint);
      if (tint !== null) next.tint = tint;
      return next;
    }

    /**
     * Read the values a document does not spell out as booleans.
     *
     * @param {object} target
     * @param {object} source
     */
    function coerceBooleans(target, source) {
      if (source === null || typeof source !== 'object') return target;
      for (const key of BOOLEAN_KEYS) {
        if (typeof source[key] === 'boolean') target[key] = source[key];
      }
      return target;
    }

    function readCache() {
      try {
        const raw = window.localStorage.getItem(CACHE_KEY);
        if (raw === null) return null;
        const parsed = JSON.parse(raw);
        if (parsed === null || typeof parsed !== 'object') return null;
        // The cache is read at module scope, before the host answers, so a
        // stale preset id would be live for the whole first paint. Folding it
        // here as well as in normalizeFromHost is what `normalizeDocument`
        // exists to make impossible to forget.
        return normalizeDocument(parsed);
      } catch {
        return null;
      }
    }

    function readMaterialCache() {
      try {
        return normalizeMaterial(JSON.parse(window.localStorage.getItem(MATERIAL_KEY)));
      } catch {
        return 'unknown';
      }
    }

    function readWindowBlurCache() {
      try {
        return normalizeWindowBlur(JSON.parse(window.localStorage.getItem(WINDOW_BLUR_KEY)));
      } catch {
        return { active: false, why: null, material: null };
      }
    }

    function writeCache() {
      try {
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(config));
        window.localStorage.setItem(MATERIAL_KEY, JSON.stringify(windowMaterial));
        window.localStorage.setItem(WINDOW_BLUR_KEY, JSON.stringify(windowBlurReport));
```

</details>

**依据 3 · 源码核查**：[tools/asarpatch.py:702-777](https://github.com/AIR-pixel/air-pixel-liquid-glass/blob/4b980fb2cbac292274a6b3136696ab27e3b1decc/tools/asarpatch.py#L702-L777)

备份恢复与版本变化提示。

<details>
<summary>查看原文（76行）</summary>

```text
    backup = ASAR.with_name(
        ASAR.name + ".bak-" + datetime.date.today().strftime("%Y%m%d")
    )
    staged = ASAR.parent / (ASAR.name + ".new")

    if args.revert:
        if not backup.exists():
            print(f"nothing to revert: {backup.name} does not exist")
            return 2
        shutil.copy2(backup, ASAR)
        write_pointer(ASAR, "stock")
        print(f"reverted {backup.name} -> {ASAR.name}")
        return 0

    if args.apply_staged:
        return apply_staged(ASAR, staged, backup, args.material)

    raw = ASAR.read_bytes()
    header, base, _ = parse(raw)

    members = dict(walk(header))
    if MEMBER not in members:
        print(f"member {MEMBER} is not in the archive")
        return 2
    target = members[MEMBER]

    # Snapshot every body BEFORE the header is touched, so verification never
    # has to reason about the offset arithmetic it is checking.
    before = {}
    for path, entry in members.items():
        if has_body(entry):
            off = int(entry["offset"])
            before[path] = raw[base + off : base + off + int(entry["size"])]

    text = before[MEMBER].decode("utf-8")
    present = installed_material(text)
    has_watcher = WATCHER_MARKER in text
    if present is not None:
        # `--check` reports whichever material is installed, including one that
        # is not the default: a command whose name promises a report must not
        # depend on a flag it was not given.
        if args.check:
            print(f"patched (material: {present}, watcher: {'yes' if has_watcher else 'NO'})")
            if not has_watcher:
                print("  this archive predates the window-material watcher, so the")
                print("  窗口模糊 switch cannot take effect on it. Re-run this tool to add it.")
            asar_env_hint()
            return 0
        if present != args.material:
            # Not done automatically. The patch is one substitution, so changing
            # the material means undoing it first, and the honest way to undo it
            # is the backup that `--revert` restores — a second in-place rewrite
            # would have to find the previous marker and be right about it.
            print(f"already patched with material: {present}; asked for {args.material}")
            print("changing the material starts by undoing the current patch:")
            print("  python tools/asarpatch.py --revert")
            print(f"  python tools/asarpatch.py --material {args.material}")
            return 2
        if has_watcher:
            print(f"already patched (material: {present}, backup present: {backup.exists()})")
            # Re-establish the host's fallback path even though there is nothing to
            # patch: this is the branch a user lands on after an auto-update wiped
            # the marker from a fresh archive, and it is exactly when the host's
            # fallback is worth re-asserting.
            write_pointer(ASAR, "patched", present)
            return 0
        # Same material, but from a version of this tool that did not install
        # the watcher. Falling through would leave 窗口模糊 reporting a request
        # nothing answers, so the watcher is appended to the already-patched
        # text and the archive is rebuilt. The win32 block is left untouched —
        # its marker is how `installed_material` recognised it just now.
        print(f"already patched (material: {present}) but the watcher is missing; adding it")
        watcher_only = True
    else:
        watcher_only = False
    if args.check:
```

</details>

#### 缺口

- 未做目标用户可读性/性能试验。
  **影响：**采用收益与补丁维护成本没有实测数据。
  **进一步探讨：**用实机记录可读性、性能、补丁成功/恢复步骤和更新时间成本。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
