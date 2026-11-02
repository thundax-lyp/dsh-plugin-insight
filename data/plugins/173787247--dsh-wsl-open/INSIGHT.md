# dsh-wsl-open

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[da384bb](https://github.com/173787247/dsh-wsl-open/tree/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-open)
<!-- END META -->

> **功能**：将聊天中的Linux文件路径接到Windows默认应用或Explorer，检查真实路径范围并支持路径转换回退。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将复制转换启动接成点击流程，Range不改React文本，后端realpath范围再验；跨系统组织而非新应用或安全隔离。

> **主要限制**：[Q03](#research-q03) localhost来源规则不严格比较端口，授权依赖宿主；Explorer任意数字退出码可接受，API成功不证正确窗口显示，错误仅console。

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
  - [Q01 · 谁需要聊天路径点击，相比复制路径少什么步骤？](#detail-section-11)
  - [Q02 · 从文本命中到真实路径和Windows调用怎样接线？](#detail-section-12)
  - [Q03 · 来源、权限和进程成功能保证什么？](#detail-section-13)
  - [Q04 · 怎样限定个人试用、成本和退路？](#detail-section-14)
  - [Q05 · 交付物范围和可见回执能否减少误点与误成功？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人WSL用户生成办公交付物后需在Windows查看编辑，合格结果是正确文件在预期应用实际显示。

手工复制路径、wslpath转换和Explorer/默认应用打开；不新增文件阅读能力，增量是聊天到本机应用的交接。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 路径识别/高亮 | 聊天交付物快捷打开 | 全body扫描、空格/括号有限 |
| 真实路径核对 | 限home/cwd/Users | 范围广且授权依赖宿主 |
| Windows调用回退 | 文件应用/目录Explorer | interop与关联，success不证显示 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web/webServer/sessions | 必需 | 客户端与路径API | 宿主认证/兼容另验 |
| WSL及Windows interop | 必需 | 启动Windows进程 | 非WSL返回not WSL |
| 应用关联/Explorer/PowerShell等 | 必需 | 实际显示文件 | 回退不证明正确窗口 |
| CSS Highlight/Range | 高亮需支持 | 不改React文本 | 可见/点击兼容待实测 |
| 可读可信允许目录 | 必需 | stat与realpath | 不存在或越界拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核WSL/interop/应用关联，装后重启刷新 | 可信测试文件 |
| 点击 | 在新消息点普通绝对路径 | 核真实应用与正确文件内容 |
| 排障 | 查console/宿主映射和关联 | 不把200视作显示成功 |
| 停止 | 异常/误点禁用刷新 | 回手工wslpath/Explorer，关闭已开窗口 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主与Windows应用环境 | 关联/互操作/安装刷新 | 未见独立订阅，应用成本未知 |
| 持续 | body扫描/路径读取/进程启动 | 点击确认正确显示 | CPU与耗时未测 |
| 失败恢复 | 回退可能重复窗口 | 查映射/日志/应用 | 工时与误启动后果未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 点击跨系统打开 | Range→API→Windows调用 | 正确应用实际显示率 |
| React兼容 | 不替换文本DOM且清理监听 | 长会话/浏览器性能 |
| 路径限制 | 存在/realpath双重范围检查 | 宿主授权/文件内容可信性 |

> **思考**：[Q03](#research-q03) localhost来源规则不严格比较端口，授权依赖宿主；Explorer任意数字退出码可接受，API成功不证正确窗口显示，错误仅console。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 将复制转换启动接成点击流程，Range不改React文本，后端realpath范围再验；跨系统组织而非新应用或安全隔离。

[Q02](#research-q02) Range/effect清理、合并扫描、realpath再验与LiteralPath可复用；[Q03](#research-q03) 进程回执和用户可见结果应区分，来源函数名不能代替严格授权。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) localhost来源规则不严格比较端口，授权依赖宿主；Explorer任意数字退出码可接受，API成功不证正确窗口显示，错误仅console。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 已有个人WSL环境先试可信办公文件，实际看见正确文件才验收；复杂路径误点、异常应用或权限不清则停用，回手工转换与打开。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定前后端、路径扫描/映射与当前正式findings复核；未运行Windows应用或宿主，兼容矩阵为作者说明非验收。

- 已检查：作者 README、包清单、源码路径 README.md、client.js、index.js、lib/windows-path.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定index/client及路径模块，当前findings全部复核；未审宿主认证/目标应用/真实Windows，不以套件兼容表作同版验收。
- 下一步：[Q05](#research-q05) 对照交付物范围/可见反馈，测复杂路径与失败关联的实际正确显示、误点和人工时间。

**分析版本**

- **仓库**：[173787247/dsh-wsl-open](https://github.com/173787247/dsh-wsl-open)
- **版本号**：0.2.0（[固定提交 da384bb](https://github.com/173787247/dsh-wsl-open/tree/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证方向是限定消息交付物扫描和展示真实路径/请求失败状态，以长会话复杂路径比较误打开、漏检和正确显示，不重复计算既有Range/SKIP。

[Q05](#research-q05) 对照交付物范围/可见反馈，测复杂路径与失败关联的实际正确显示、误点和人工时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 211 | — | — | 1372 |
| .js | source | 4 | 540 | 473 | 16 | — |
| .js | test | 1 | 88 | 77 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-open/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-open/issues?q=is%3Aissue+created%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-open/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T03%3A37%3A58.572Z..2026-11-02T03%3A37%3A58.572Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：聊天路径点击怎样形成Windows正确打开结果，允许范围与回执有哪些限制？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要聊天路径点击，相比复制路径少什么步骤？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

WSL中的DSH用户生成PPT、文档等本地交付物后，常要在Windows默认应用查看或继续编辑。插件把复制Linux路径、wslpath转换与调用Windows应用接成点击；基线是手工转换后粘到Explorer/终端，并不是新文件查看器。正确文件在预期应用真正显示才是合格结果，API成功与高亮不等于这个结果。

作者说assistant路径高亮，但客户端实际遍历document.body的文本，跳过pre/输入/已有控件等，不限定消息或assistant身份；还拦文本恰为Linux路径的a/button/code。CSS Highlight用Range，不改React文本节点，减少DOM重写冲突。只识别特定绝对目录前缀且空白终止，带空格、括号或不在规则中的交付路径可能漏识别；相反其他页面文本也可能出现点击候选。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:37-49](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/README.md#L37-L49)

作者场景与路径能力。

<details>
<summary>查看原文（13行）</summary>

```text
## Why

Chat does not turn `/home/.../deck.pptx` into a useful link. Generic “open path” plugins often call Linux `xdg-open`, which cannot launch Windows Office / WPS.

## What it does

1. Highlights absolute Linux paths in assistant text (CSS Highlight; does not rewrite React DOM)
2. Maps with `wslpath -w` (or a fallback) to `\\wsl$\<distro>\...` or `C:\...`
3. Files → `cmd.exe /c start` (Windows default app); folders → `explorer.exe`

Only opens real paths under home, the session workspace, and `/mnt/c/Users` (and `/mnt/d/Users`). Non-WSL hosts skip open.

Prefer this for **files/folders**. Use [dsh-wsl-launch](https://github.com/173787247/dsh-wsl-launch) for apps, and [dsh-wsl-browser](https://github.com/173787247/dsh-wsl-browser) for `http(s)` URLs.
```

</details>

**依据 2 · 源码核查**：[client.js:7-25](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/client.js#L7-L25)

识别前缀、长度和空白限制。

<details>
<summary>查看原文（19行）</summary>

```text
    var inject = [];
    // Keep in sync with lib/scan-path.js.
    var PATH_RE = /(?:^|[\s:(（`：；、。，！？])(\/(?:home|mnt|opt|tmp|root|Users)[^\s<>"'`()（）\[\]，。；、]+)/g;
    var HIGHLIGHT = "dsh-wsl-open-path";
    var SKIP = "pre, a, button, script, style, textarea, input, [contenteditable], [data-input-mirror], [data-input-backdrop], [data-composer-card]";

    function findLinuxPaths(text) {
      if (typeof text !== "string" || !text.includes("/")) return [];
      var out = [];
      var re = new RegExp(PATH_RE.source, "g");
      var match;
      while ((match = re.exec(text)) !== null) {
        var raw = match[1];
        var path = raw.replace(/[.,;:]+$/, "");
        if (path.length < 2 || path.length > 1024) continue;
        var start = match.index + match[0].length - raw.length;
        out.push({ path: path, start: start, end: start + path.length });
      }
      return out;
```

</details>

**依据 3 · 源码核查**：[client.js:72-106](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/client.js#L72-L106)

全body扫描与Range高亮。

<details>
<summary>查看原文（35行）</summary>

```text
      function collectBareHits() {
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
          acceptNode: function (node) {
            var parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (parent.closest(SKIP)) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        });
        var hits = [];
        while (walker.nextNode()) {
          var node = walker.currentNode;
          var text = node.nodeValue || "";
          if (text.length > 8000) continue;
          var found = findLinuxPaths(text);
          for (var i = 0; i < found.length && i < 16; i++) {
            hits.push({ node: node, path: found[i].path, start: found[i].start, end: found[i].end });
          }
        }
        return hits;
      }

      function renderBareHighlights() {
        var hits = collectBareHits();
        var ranges = [];
        bareHits = [];
        for (var i = 0; i < hits.length; i++) {
          var hit = hits[i];
          var range = document.createRange();
          range.setStart(hit.node, hit.start);
          range.setEnd(hit.node, hit.end);
          ranges.push(range);
          bareHits.push({ range: range, path: hit.path });
        }
        if (highlightSupported()) CSS.highlights.set(HIGHLIGHT, new Highlight(...ranges));
```

</details>

**依据 4 · 源码核查**：[client.js:186-208](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/client.js#L186-L208)

控件路径特判和裸文本命中。

<details>
<summary>查看原文（23行）</summary>

```text
      function onClick(event) {
        var target = event.target;
        if (target && target.nodeType === 3) target = target.parentElement;
        if (!target || target.nodeType !== 1) return;

        var clickable = target.closest("button, a, code");
        if (clickable) {
          var mentioned = exactLinuxPath(clickable.textContent);
          if (mentioned) {
            event.preventDefault();
            event.stopPropagation();
            openPath(mentioned);
            return;
          }
        }
        if (target.closest("button, a, pre, textarea, input, [contenteditable]")) return;

        var bare = hitBarePath(event);
        if (bare) {
          event.preventDefault();
          event.stopPropagation();
          openPath(bare);
        }
```

</details>

#### 缺口

- 未在真实长会话和复杂路径验点击/正确显示
  **影响**：不能承诺无误点或全文件覆盖
  **进一步探讨**：比较普通/空格/括号/多路径及非消息文本，记录命中与正确窗口。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从文本命中到真实路径和Windows调用怎样接线？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

web客户端带active sessionId和路径POST；session快照失败/无active时可取byId首项或空串。服务端注入webServer/sessions，非WSL返回501，enabled=false不注册。解析~/、绝对或基于会话cwd的相对路径，检查格式、存在性、允许范围，再realpath后重验范围；home、session cwd及C/D Users可开，不仅当前项目。

用wslpath -w五秒超时后退内部驱动盘/UNC转换；Windows可执行文件优先固定系统路径，不依赖PATH附加。目录先Explorer后PowerShell，文件先Invoke-Item -LiteralPath再cmd start、Explorer；PowerShell字面量对单引号翻倍。点击/MutationObserver由effect清理，requestAnimationFrame合并扫描，避免每次变动直接重做；但每次仍body重扫，不是可见消息增量索引。

可借鉴realpath二次范围核对、参数调用与Range清理，文件存在到启动之间仍有时序窗口，未据静态代码证明竞态完全消失。需要WSL互操作、wslpath/可用回退、Windows应用关联、浏览器Highlight和宿主服务共同成立。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:42-65](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/client.js#L42-L65)

session选取与请求。

<details>
<summary>查看原文（24行）</summary>

```text
      function sessionId() {
        try {
          var snap = sessionsSvc && sessionsSvc.list && sessionsSvc.list.getSnapshot ? sessionsSvc.list.getSnapshot() : null;
          if (snap && snap.activeId) return snap.activeId;
          if (snap && snap.byId) return Object.keys(snap.byId)[0] || "";
        } catch (error) {
          // ignore
        }
        return "";
      }

      function openPath(linuxPath) {
        fetch("/api/wsl-open/open", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId: sessionId(), path: linuxPath }),
          cache: "no-store",
        }).then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            if (!res.ok || !data.ok) console.warn("[dsh-wsl-open]", data.error || res.status);
          });
        }).catch(function (error) {
          console.warn("[dsh-wsl-open]", error);
        });
```

</details>

**依据 2 · 源码核查**：[index.js:19-89](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/index.js#L19-L89)

后端入口、检测与realpath范围检查。

<details>
<summary>查看原文（71行）</summary>

```text
export function apply(ctx, config = {}) {
  const enabled = config.enabled !== false;
  const webServer = ctx.webServer;
  const sessions = ctx.sessions;
  if (!enabled || webServer === undefined) {
    if (!enabled) console.log("[dsh-wsl-open] disabled");
    return;
  }

  const wsl = detectWsl();
  if (!wsl) {
    console.log("[dsh-wsl-open] not running in WSL; Windows open is skipped");
  } else {
    console.log(`[dsh-wsl-open] loaded distro=${distroName()}`);
  }

  ctx.effect(() => webServer.register({
    kind: "exact",
    path: "/api/wsl-open/open",
    handler: async (req, res) => {
      try {
        if (!isSameOrigin(req)) {
          writeJson(res, 403, { ok: false, error: "forbidden" });
          return;
        }
        if (!wsl) {
          writeJson(res, 501, { ok: false, error: "not WSL" });
          return;
        }
        const body = await readBody(req, MAX_BODY_BYTES);
        const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
        const raw = typeof body.path === "string" ? body.path.trim() : "";
        if (!raw) {
          writeJson(res, 400, { ok: false, error: "missing path" });
          return;
        }

        const cwd = sessionCwd(sessions, sessionId);
        const abs = resolveLinux(raw, cwd);
        if (!abs || !isSafeLinuxPath(abs) || !isProbeable(abs, cwd)) {
          writeJson(res, 404, { ok: false, error: "path not allowed" });
          return;
        }
        if (!existsSync(abs)) {
          writeJson(res, 404, { ok: false, error: "path not found" });
          return;
        }

        const real = realpathSync(abs);
        if (!isProbeable(real, cwd)) {
          writeJson(res, 404, { ok: false, error: "path not allowed" });
          return;
        }

        const winPath = await linuxToWindows(real);
        if (!winPath) {
          writeJson(res, 500, { ok: false, error: "could not map to a Windows path" });
          return;
        }

        const opened = await openOnWindows(nativeWinPath(winPath), statSync(real).isDirectory());
        if (!opened) {
          writeJson(res, 500, { ok: false, error: "Windows open failed", windowsPath: winPath });
          return;
        }
        writeJson(res, 200, { ok: true, windowsPath: winPath });
      } catch (err) {
        writeJson(res, 500, { ok: false, error: err instanceof Error ? err.message : String(err) });
      }
    },
  }), "dsh-wsl-open: open");
```

</details>

**依据 3 · 源码核查**：[index.js:103-128](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/index.js#L103-L128)

范围与转换。

<details>
<summary>查看原文（26行）</summary>

```text
function resolveLinux(path, cwd) {
  if (path.startsWith("~/")) return `${homedir()}${path.slice(1)}`;
  if (path.startsWith("/")) return path;
  if (cwd) return resolve(cwd, path);
  return "";
}

function isProbeable(abs, cwd) {
  const home = homedir();
  if (home && home !== "/" && isWithin(home, abs)) return true;
  if (cwd && isWithin(cwd, abs)) return true;
  if (isWithin("/mnt/c/Users", abs) || isWithin("/mnt/d/Users", abs)) return true;
  return false;
}

function linuxToWindows(abs) {
  return new Promise((resolveWin) => {
    execFile("wslpath", ["-w", abs], { timeout: 5000 }, (err, stdout) => {
      const mapped = err ? "" : String(stdout || "").trim().replace(/\r/g, "");
      if (mapped) {
        resolveWin(mapped);
        return;
      }
      resolveWin(toWindowsPath(abs));
    });
  });
```

</details>

**依据 4 · 源码核查**：[index.js:136-171](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/index.js#L136-L171)

应用调用次序与LiteralPath。

<details>
<summary>查看原文（36行）</summary>

```text
function powershellLiteral(winPath) {
  return `'${winPath.replace(/'/g, "''")}'`;
}

function spawnFile(bin, args) {
  return new Promise((resolveSpawn) => {
    execFile(bin, args, { timeout: 15000 }, (err) => {
      resolveSpawn(err);
    });
  });
}

async function openOnWindows(winPath, isDir) {
  const ps = windowsBin("powershell.exe");
  const cmd = windowsBin("cmd.exe");
  const explorer = windowsBin("explorer.exe");
  const invoke = ["-NoProfile", "-NonInteractive", "-Command", `Invoke-Item -LiteralPath ${powershellLiteral(winPath)}`];
  const attempts = isDir
    ? [
        { bin: explorer, args: [winPath], explorerQuirk: true },
        { bin: ps, args: invoke },
      ]
    : [
        { bin: ps, args: invoke },
        { bin: cmd, args: ["/c", "start", "", winPath] },
        { bin: explorer, args: [winPath], explorerQuirk: true },
      ];

  for (const attempt of attempts) {
    const err = await spawnFile(attempt.bin, attempt.args);
    if (!err) return true;
    // explorer often exits 1 after reusing a window.
    if (attempt.explorerQuirk && typeof err.code === "number") return true;
    console.warn(`[dsh-wsl-open] ${attempt.bin} failed code=${err.code ?? ""} ${err.message}`);
  }
  return false;
```

</details>

**依据 5 · 源码核查**：[client.js:109-115](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/client.js#L109-L115)

扫描调度。

```text
      function scheduleScan() {
        if (scanQueued) return;
        scanQueued = true;
        requestAnimationFrame(function () {
          scanQueued = false;
          renderBareHighlights();
        });
```

**依据 6 · 源码核查**：[client.js:211-220](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/client.js#L211-L220)

监听与清理。

<details>
<summary>查看原文（10行）</summary>

```text
      function start() {
        document.addEventListener("click", onClick, true);
        var observer = new MutationObserver(function () { scheduleScan(); });
        observer.observe(document.body, { childList: true, subtree: true });
        scheduleScan();
        return function () {
          document.removeEventListener("click", onClick, true);
          observer.disconnect();
          if (highlightSupported()) CSS.highlights.delete(HIGHLIGHT);
        };
```

</details>

**依据 7 · 源码核查**：[lib/windows-path.js:9-23](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/lib/windows-path.js#L9-L23)

固定系统路径和WSL检测。

<details>
<summary>查看原文（15行）</summary>

```text
/** Resolve a Windows exe even when PATH has no /mnt/c/Windows. */
export function windowsBin(name, { exists = existsSync } = {}) {
  for (const p of WINDOWS_BINS[name] || []) {
    if (exists(p)) return p;
  }
  return name;
}

export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 来源、权限和进程成功能保证什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

isSameOrigin名字比实际规则强：有Origin只验证http(s) localhost/127.0.0.1及任意数字端口，没有与请求Host/端口严格相等；无Origin则检查Host是本地主机。它不是认证或会话所有权验证，此route内sessionId仅用于找cwd，真正访问控制依赖宿主路由认证和部署，不能把本地规则当跨租户授权。未审宿主实现，不据此宣称可被未授权远端访问。

允许home及Users范围较广，realpath确认目标在允许范围不代表文件可信；打开文件会调用其关联应用。后端成功依据子进程无错，Explorer任何数字退出码也视为可接受quirk，不是仅code1；可能已复用窗口，也可能未正确显示，此源码不观测窗口。客户端失败只console.warn，没有用户可见错误面板/重试状态。

所以“能发起Windows打开”有源码支持，“正确文件已显示/用户已看见”未知；回退重试有潜在多窗口成本。不得把范围检查推成内容安全或跨平台成功。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:174-179](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/index.js#L174-L179)

Origin/Host只限本地主机而不严格same-origin。

```text
function isSameOrigin(req) {
  const origin = req.headers.origin || "";
  if (origin !== "") return /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin);
  const host = req.headers.host || "";
  return /^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host);
}
```

**依据 2 · 源码核查**：[index.js:92-115](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/index.js#L92-L115)

session只解析cwd及宽允许范围。

<details>
<summary>查看原文（24行）</summary>

```text
function sessionCwd(sessions, sessionId) {
  if (!sessionId || sessions === undefined || typeof sessions.get !== "function") return "";
  try {
    const session = sessions.get(sessionId);
    const cwd = session && session.header && session.header.cwd;
    return typeof cwd === "string" ? cwd : "";
  } catch {
    return "";
  }
}

function resolveLinux(path, cwd) {
  if (path.startsWith("~/")) return `${homedir()}${path.slice(1)}`;
  if (path.startsWith("/")) return path;
  if (cwd) return resolve(cwd, path);
  return "";
}

function isProbeable(abs, cwd) {
  const home = homedir();
  if (home && home !== "/" && isWithin(home, abs)) return true;
  if (cwd && isWithin(cwd, abs)) return true;
  if (isWithin("/mnt/c/Users", abs) || isWithin("/mnt/d/Users", abs)) return true;
  return false;
```

</details>

**依据 3 · 源码核查**：[index.js:164-171](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/index.js#L164-L171)

Explorer数字退出码接受。

```text
  for (const attempt of attempts) {
    const err = await spawnFile(attempt.bin, attempt.args);
    if (!err) return true;
    // explorer often exits 1 after reusing a window.
    if (attempt.explorerQuirk && typeof err.code === "number") return true;
    console.warn(`[dsh-wsl-open] ${attempt.bin} failed code=${err.code ?? ""} ${err.message}`);
  }
  return false;
```

**依据 4 · 源码核查**：[client.js:53-65](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/client.js#L53-L65)

仅console.warn处理失败。

<details>
<summary>查看原文（13行）</summary>

```text
      function openPath(linuxPath) {
        fetch("/api/wsl-open/open", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId: sessionId(), path: linuxPath }),
          cache: "no-store",
        }).then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            if (!res.ok || !data.ok) console.warn("[dsh-wsl-open]", data.error || res.status);
          });
        }).catch(function (error) {
          console.warn("[dsh-wsl-open]", error);
        });
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样限定个人试用、成本和退路？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合已有个人WSL+DSH web及Windows默认应用的人，在可信测试交付物上先试普通绝对路径，验实际应用、文件和内容，而非只看下划线或200。先核宿主兼容、interop、关联和路径映射；非WSL跳过是设计边界。不要直接点击陌生输出/不可信文件或依赖广范围规则完成共享服务授权。

首次有安装重启刷新和Windows关联准备，持续有body扫描、stat/realpath与启动进程、人工确认；未见插件独立订阅声明不等于总现金成本0，Office等应用成本按用户环境。失败需查浏览器/宿主日志、映射与应用，回退可能多开窗口；退出禁用并刷新后回手工wslpath/Explorer，已打开应用需单独关闭。复杂路径误点、文件不符或异常应用启动时停止。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:51-65](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/README.md#L51-L65)

安装刷新与作者验证步骤。

<details>
<summary>查看原文（15行）</summary>

````text
## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-open
```

Restart `dsh web`, refresh the page. Click a dotted-underline path in a **new or re-rendered** assistant message.

## Verify

1. Ask the agent to write a file under `/home/<you>/...` (e.g. `.pptx`).
2. The absolute path should be dotted-underlined.
3. Click it — Windows opens with the default app.

Debug: browser console `[dsh-wsl-open]`; host log `dsh-wsl-open: loaded distro=...`.
````

</details>

**依据 2 · 源码核查**：[package.json:21-24](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/package.json#L21-L24)

Node声明。

```text
  "engines": {
    "node": ">=18"
  },
  "scripts": {
```

**依据 3 · 源码核查**：[index.js:19-30](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/index.js#L19-L30)

禁用与非WSL处理。

<details>
<summary>查看原文（12行）</summary>

```text
export function apply(ctx, config = {}) {
  const enabled = config.enabled !== false;
  const webServer = ctx.webServer;
  const sessions = ctx.sessions;
  if (!enabled || webServer === undefined) {
    if (!enabled) console.log("[dsh-wsl-open] disabled");
    return;
  }

  const wsl = detectWsl();
  if (!wsl) {
    console.log("[dsh-wsl-open] not running in WSL; Windows open is skipped");
```

</details>

**依据 4 · 源码核查**：[client.js:72-91](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/client.js#L72-L91)

持续扫描成本来源。

<details>
<summary>查看原文（20行）</summary>

```text
      function collectBareHits() {
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
          acceptNode: function (node) {
            var parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (parent.closest(SKIP)) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        });
        var hits = [];
        while (walker.nextNode()) {
          var node = walker.currentNode;
          var text = node.nodeValue || "";
          if (text.length > 8000) continue;
          var found = findLinuxPaths(text);
          for (var i = 0; i < found.length && i < 16; i++) {
            hits.push({ node: node, path: found[i].path, start: found[i].start, end: found[i].end });
          }
        }
        return hits;
```

</details>

#### 缺口

- 没有真实WSL/Windows应用/浏览器兼容与耗时资源数据
  **影响**：不能持续采用或断言成本低/零费用
  **进一步探讨**：在实际环境记录普通/失败打开、正确显示、重复窗口和恢复时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 交付物范围和可见回执能否减少误点与误成功？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把扫描收缩到明确消息交付物，并显示规范真实路径与“已请求/失败待查”，降低全body候选误点和console-only失败漏觉察。当前已有SKIP、Range和真实路径限制，不把加过滤再说成全新安全机制；增量是目标语义与用户可见反馈，不是仅换路径正则。

对照当前插件，在长会话、多相邻路径、空格/中文括号和其他UI路径文本下测漏检/误打开；将Windows关联失败/Explorer非零与正常结果分开看正确文件显示及人工判断。若减少候选同时丢重要交付物、回执仍被误当完成或增加操作负担大于收益，则否定。没有执行实验，不能承诺改善。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:72-91](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/client.js#L72-L91)

当前全body候选及已有跳过。

<details>
<summary>查看原文（20行）</summary>

```text
      function collectBareHits() {
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
          acceptNode: function (node) {
            var parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (parent.closest(SKIP)) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        });
        var hits = [];
        while (walker.nextNode()) {
          var node = walker.currentNode;
          var text = node.nodeValue || "";
          if (text.length > 8000) continue;
          var found = findLinuxPaths(text);
          for (var i = 0; i < found.length && i < 16; i++) {
            hits.push({ node: node, path: found[i].path, start: found[i].start, end: found[i].end });
          }
        }
        return hits;
```

</details>

**依据 2 · 源码核查**：[client.js:53-65](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/client.js#L53-L65)

反馈仅日志构成推导。

<details>
<summary>查看原文（13行）</summary>

```text
      function openPath(linuxPath) {
        fetch("/api/wsl-open/open", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ sessionId: sessionId(), path: linuxPath }),
          cache: "no-store",
        }).then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            if (!res.ok || !data.ok) console.warn("[dsh-wsl-open]", data.error || res.status);
          });
        }).catch(function (error) {
          console.warn("[dsh-wsl-open]", error);
        });
```

</details>

**依据 3 · 源码核查**：[index.js:164-171](https://github.com/173787247/dsh-wsl-open/blob/da384bb2dfe5647e34b4b8db2d6ff1dc7c79c2af/index.js#L164-L171)

调用成功和窗口结果差异。

```text
  for (const attempt of attempts) {
    const err = await spawnFile(attempt.bin, attempt.args);
    if (!err) return true;
    // explorer often exits 1 after reusing a window.
    if (attempt.explorerQuirk && typeof err.code === "number") return true;
    console.warn(`[dsh-wsl-open] ${attempt.bin} failed code=${err.code ?? ""} ${err.message}`);
  }
  return false;
```

#### 缺口

- 未做范围与回执对照
  **影响**：不能证明改善误点/误验收
  **进一步探讨**：实际WSL隔离案例比较净正确显示与人工成本。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
