# dsh-wsl-open

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[550509f](https://github.com/173787247/dsh-wsl-open/tree/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-open)
<!-- END META -->

> **实现功能**：让 DSH 网页聊天中的 WSL Linux 路径可点击，并用 Windows 默认应用或 Explorer 打开。

> **核心亮点**：把手工复制路径、wslpath转换和默认应用打开接成聊天点击流程，并以CSS Highlight避免替换React文本DOM；已有价值是跨系统工作流集成。详见[Q01](#research-q01)。

> **风险与缺陷**：API成功不等于正确窗口显示，Explorer数字退出码会被接受；来源规则也只限定localhost主机而不严格比较端口，实际权限依赖宿主。均为静态核查边界，未做漏洞或故障复现。详见[Q03](#research-q03)。

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
  - [Q01 · 谁需要跨系统打开文件，较手工操作增加什么？](#detail-section-11)
  - [Q02 · 文本识别、路由与Windows调用如何连接？](#detail-section-12)
  - [Q03 · 路径允许范围、来源检查和成功返回可靠吗？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复有何成本与效果？](#detail-section-14)
  - [Q05 · 工程设计和测试证明什么，可推导何种改进？](#detail-section-15)
  - [Q06 · 对谁值得试用，如何验收及停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：WSL中的Agent生成办公文件后，用户需要在Windows阅读编辑；快捷打开应以正确文件真正显示为合格结果。详见[Q01](#research-q01)。

手工复制Linux路径，用wslpath转换，再在Explorer或PowerShell打开；与普通Linux xdg-open作用环境不同，不作无版本竞品效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 路径高亮点击 | 从聊天快速访问文件 | 部分根目录正则，空格路径受限 |
| WSL到Windows映射 | 连接Windows办公应用 | 依赖interop、发行版与默认关联 |
| 真实路径范围检查 | 限制可打开位置 | 非隔离保证，认证依宿主 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途与必要性 | 失效影响 |
| --- | --- | --- |
| DSH webServer/sessions及web客户端 | 路由、会话和点击 | 不匹配无法接线 |
| WSL interop与Windows程序 | 跨系统启动应用 | 非WSL返回501 |
| CSS Highlight和DOM API | 视觉增强及命中 | 支持不足影响可发现性 |
| 默认应用关联 | 文件读取编辑 | 关联异常需人工修复 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| profile安装、重启、刷新 | 用户 | 客户端和路由加载 |
| 使用可信样例路径 | 用户 | 高亮和session对应正确 |
| 点击并确认窗口 | 用户/插件 | 正确文件真正显示 |
| 失败后用手工路径核对 | 用户 | 排除映射、关联与权限问题 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主及Windows应用，未见独立订阅 | 安装重启刷新、核对interop与关联 | 未见独立订阅说明；interop/关联准备耗时未知 |
| 持续使用 | DOM扫描、路径读取及进程启动 | 点击并确认正确文件显示，耗时未知 | DOM/读取/启动资源量与人工确认耗时未知 |
| 失败恢复 | 多次进程回退与可能重复窗口 | 查日志、核映射与默认应用 | 回退可能多开窗口；映射与应用修复工时未知 |


#### 效果

| 目标 | 可见机制 | 边界 |
| --- | --- | --- |
| 点击跨系统打开 | 真实路径转换和Windows调用 | API成功不保证窗口显示 |
| 少干扰React | Range和CSS Highlight | 浏览器支持、整页扫描和复杂路径有限 |
| 限定可打开目标 | home/cwd/Users及realpath检查 | 允许范围较广，认证依宿主 |

> **思考**：API成功不等于正确窗口显示，Explorer数字退出码会被接受；来源规则也只限定localhost主机而不严格比较端口，实际权限依赖宿主。均为静态核查边界，未做漏洞或故障复现。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把手工复制路径、wslpath转换和默认应用打开接成聊天点击流程，并以CSS Highlight避免替换React文本DOM；已有价值是跨系统工作流集成。详见[Q01](#research-q01)。

把手工复制路径、wslpath转换和默认应用打开接成聊天点击流程，并以CSS Highlight避免替换React文本DOM；已有价值是跨系统工作流集成。详见[Q01](#research-q01)。

Range高亮、effect清理、realpath复核和LiteralPath接线可借鉴；测试集中于纯函数，客户端命中与真实应用结果不能由其替代。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

API成功不等于正确窗口显示，Explorer数字退出码会被接受；来源规则也只限定localhost主机而不严格比较端口，实际权限依赖宿主。均为静态核查边界，未做漏洞或故障复现。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议个人本地WSL用户限定试用可信办公文件，验收以正确窗口实际显示为准；复杂路径误点、权限不清或不明应用启动时停止。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

跨系统点击接线和真实路径复核有源码支持；来源权限、扫描覆盖与实际显示成功尚有边界。消息级可见回执是未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、client.js、lib/windows-path.js、lib/scan-path.js、test/windows-path.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交读取前后端、路径与扫描模块及测试；不启动Windows应用，不将兼容矩阵或截图视为同版本验收。
- 下一步：进一步探讨可从含空格路径、消息边界、localhost不同端口和Explorer退出码四组反例入手，区分路径可发现、请求被接受与正确文件显示三种结果。

**分析版本**

- **仓库**：[173787247/dsh-wsl-open](https://github.com/173787247/dsh-wsl-open)
- **版本号**：0.2.0（[固定提交 550509f](https://github.com/173787247/dsh-wsl-open/tree/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究把点击范围限定为消息交付物，并展示真实路径及可见失败状态，再以长会话和复杂路径对照漏检、误点与正确显示结果。当前未验证。详见[Q05](#research-q05)。

进一步探讨可从含空格路径、消息边界、localhost不同端口和Explorer退出码四组反例入手，区分路径可发现、请求被接受与正确文件显示三种结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 211 | — | — | 1372 |
| .js | source | 4 | 540 | 473 | 16 | — |
| .js | test | 1 | 88 | 77 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-open/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-open/issues?q=is%3Aissue+created%3A2026-09-22T04%3A47%3A29.611Z..2026-10-22T04%3A47%3A29.611Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-open/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A47%3A29.611Z..2026-10-22T04%3A47%3A29.611Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本如何把WSL聊天路径交给Windows默认应用，其流程价值、权限与可用性边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要跨系统打开文件，较手工操作增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适用对象是在WSL运行DSH、却在Windows中阅读或编辑Agent生成文件的用户，例如生成PPTX后交给Office/WPS。合格结果是聊天中明确路径对应的真实文件或目录被正确的Windows默认应用打开，且失败可定位；不是文件内容正确或任务已经交付成功。

简单替代是复制路径、手工wslpath转换后在Explorer或PowerShell打开。本插件把文本发现、点击、会话目录解析和默认应用调用接在一起，减少跨窗口搬运。贡献是这条用户流程的集成和CSS Highlight避免改写React文本DOM的设计，不是新文件映射协议。只在WSL到Windows工作流有直接价值，纯Linux桌面、远程浏览器或不希望默认应用自动处理文件的场景不必采用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-13](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/README.md#L5-L13)

作者限定聊天Linux路径到Windows应用。

```text
DeepSeek Harness plugin: click a **WSL Linux path** in chat to open it on **Windows** (default app, or Explorer for folders).

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Where it sits

Opens a Linux path in Windows Explorer or the default Windows app.
```

**依据 2 · 源码核查**：[client.js:94-106](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/client.js#L94-L106)

使用Range和CSS Highlight，不替换文本DOM。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 3 · 源码核查**：[index.js:73-84](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/index.js#L73-L84)

路径映射后实际打开并返回结果。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文本识别、路由与Windows调用如何连接？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

客户端通过ModuleLoader注册web扩展，TreeWalker扫描document.body文本节点，避开输入框、已有链接、pre等区域，并用绝对路径正则建立Range高亮。点击时可识别按钮/链接/code中的精确路径或通过Range坐标命中裸路径，随后POST路径和当前sessionId到/api/wsl-open/open。服务端依赖webServer与sessions，检查WSL和请求来源、读取最多32KiB JSON，再用会话cwd或home解释路径。

目标必须落在home、会话cwd或/mnt/c/Users、/mnt/d/Users范围且存在，realpath后再次检查允许范围。优先wslpath转换，失败才使用盘符或\wsl$映射。目录优先Explorer，文件优先PowerShell Invoke-Item -LiteralPath，其后尝试cmd start和Explorer。所需条件包括Node>=18、宿主web客户端加载与路由服务、WSL interop、Windows执行文件及默认应用关联。非WSL服务端返回501，enabled=false不注册路由，但客户端模块没有同步读取此开关。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:53-65](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/client.js#L53-L65)

客户端POST传path/sessionId，只在控制台报告错误。

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

**依据 2 · 源码核查**：[client.js:72-106](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/client.js#L72-L106)

扫描与高亮构造。

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

**依据 3 · 源码核查**：[index.js:48-84](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/index.js#L48-L84)

允许范围、真实路径与打开链。

<details>
<summary>查看原文（37行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[index.js:148-171](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/index.js#L148-L171)

文件和目录不同应用回退。

<details>
<summary>查看原文（24行）</summary>

```text
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

**依据 5 · 源码核查**：[lib/windows-path.js:17-51](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/lib/windows-path.js#L17-L51)

WSL检测与映射回退。

<details>
<summary>查看原文（35行）</summary>

```text
export function detectWsl({ env = process.env, readRelease = readOsRelease } = {}) {
  if (env.WSL_DISTRO_NAME || env.WSL_INTEROP) return true;
  try {
    return /microsoft/i.test(readRelease());
  } catch {
    return false;
  }
}

export function distroName({ env = process.env } = {}) {
  return env.WSL_DISTRO_NAME || "WSL";
}

/**
 * Convert a Linux/WSL absolute path to a Windows path.
 * /mnt/c/Users/a/b → C:\Users\a\b
 * /home/a/b → \\wsl$\<distro>\home\a\b
 */
export function toWindowsPath(linuxPath, { env = process.env, distro = distroName({ env }) } = {}) {
  const normalized = String(linuxPath || "").trim().replace(/\\/g, "/");
  if (!normalized.startsWith("/")) return "";

  const mnt = normalized.match(/^\/mnt\/([a-zA-Z])\/(.*)$/);
  if (mnt) {
    const rest = mnt[2].replace(/\//g, "\\");
    return `${mnt[1].toUpperCase()}:\\${rest}`;
  }

  const mntRoot = normalized.match(/^\/mnt\/([a-zA-Z])\/?$/);
  if (mntRoot) {
    return `${mntRoot[1].toUpperCase()}:\\`;
  }

  const trimmed = normalized.replace(/^\//, "").replace(/\//g, "\\");
  return `\\\\wsl$\\${distro}\\${trimmed}`;
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 路径允许范围、来源检查和成功返回可靠吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

路径检查同时覆盖词法范围和realpath，是比单纯前缀保护更具体的设计，但允许范围包括整个home和Windows用户目录，并不是只开放当前任务交付物。点击打开文件会触发Windows默认关联，可信文件才适合这种快捷流程。realpath与后续打开之间没有句柄绑定，也不能当作原子隔离。客户端扫描的是document.body而非严格assistant消息容器，正则只识别部分根目录且不支持空格路径，所以可能遗漏有用文件或在其他页面文本生成点击区域。

名为isSameOrigin的函数实际允许任意localhost/127.0.0.1端口来源，并未比对请求目标端口；无Origin时仅查Host。是否有额外认证与路由权限要由宿主确认，不能从此函数单独宣称同源严格保护，也不能在没有宿主部署证据时声称已复现可利用问题。Explorer返回任意数字退出码被当作成功，意味着ok=true至多说明调用策略接受了进程结果，不能保证窗口或正确文件真的显示。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:110-115](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/index.js#L110-L115)

允许整个home、cwd和两个Windows Users根。

```text
function isProbeable(abs, cwd) {
  const home = homedir();
  if (home && home !== "/" && isWithin(home, abs)) return true;
  if (cwd && isWithin(cwd, abs)) return true;
  if (isWithin("/mnt/c/Users", abs) || isWithin("/mnt/d/Users", abs)) return true;
  return false;
```

**依据 2 · 源码核查**：[index.js:164-178](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/index.js#L164-L178)

Explorer数字退出码容忍以及来源规则实际范围。

<details>
<summary>查看原文（15行）</summary>

```text
  for (const attempt of attempts) {
    const err = await spawnFile(attempt.bin, attempt.args);
    if (!err) return true;
    // explorer often exits 1 after reusing a window.
    if (attempt.explorerQuirk && typeof err.code === "number") return true;
    console.warn(`[dsh-wsl-open] ${attempt.bin} failed code=${err.code ?? ""} ${err.message}`);
  }
  return false;
}

function isSameOrigin(req) {
  const origin = req.headers.origin || "";
  if (origin !== "") return /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin);
  const host = req.headers.host || "";
  return /^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host);
```

</details>

**依据 3 · 源码核查**：[client.js:72-88](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/client.js#L72-L88)

全body扫描和每节点限制。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[lib/scan-path.js:1-16](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/lib/scan-path.js#L1-L16)

有限根目录、非空格正则与尾标点修剪。

<details>
<summary>查看原文（16行）</summary>

```text
/** Absolute Linux paths that are worth turning into Windows open targets. */
const PATH_RE = /(?:^|[\s:(（`：；、。，！？])(\/(?:home|mnt|opt|tmp|root|Users)[^\s<>"'`()（）\[\]，。；、]+)/g;

export function findLinuxPaths(text) {
  if (typeof text !== "string" || !text.includes("/")) return [];
  const out = [];
  const re = new RegExp(PATH_RE.source, "g");
  let match;
  while ((match = re.exec(text)) !== null) {
    const raw = match[1];
    const path = raw.replace(/[.,;:]+$/, "");
    if (path.length < 2 || path.length > 1024) continue;
    const start = match.index + match[0].length - raw.length;
    out.push({ path, start, end: start + path.length });
  }
  return out;
```

</details>

#### 缺口

- 宿主webServer对该API的认证、方法和跨来源策略未由本仓库固定。
  **影响**：决定localhost多端口来源接受在实际部署中的权限边界。
  **进一步探讨**：检查目标DSH固定提交的路由封装、会话认证及部署绑定地址，不将本函数名当安全结论。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复有何成本与效果？

**研究主题**：效果与总成本

#### 完整回答

首次投入是安装到web profile、重启服务和刷新页面，再核对浏览器CSS Highlight支持、WSL interop和默认应用。没有单独订阅或API账号，但不能说采用总成本为零。持续阶段DOM变更会安排requestAnimationFrame后重新扫描body，单个节点和匹配数有上限，整体页面规模没有固定上限；长会话的扫描/布局成本未测。

打开请求可能等待wslpath五秒，随后每个Windows启动尝试最长十五秒并按序回退，失败恢复需要看浏览器console和宿主日志、确认真实路径、发行版名、默认关联及进程是否已开窗口。前一次应用可能已产生界面而返回失败，盲目重复点击可能开多窗口。收益应计量同一文件从聊天到正确应用显示的时间与成功率，相对复制路径手工打开；源码和示例不足以给出节省秒数或完成率。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:109-115](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/client.js#L109-L115)

每帧合并扫描但仍重新收集全部候选。

```text
      function scheduleScan() {
        if (scanQueued) return;
        scanQueued = true;
        requestAnimationFrame(function () {
          scanQueued = false;
          renderBareHighlights();
        });
```

**依据 2 · 源码核查**：[index.js:118-127](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/index.js#L118-L127)

映射超时和fallback。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[index.js:140-170](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/index.js#L140-L170)

每次启动等待与串行回退。

<details>
<summary>查看原文（31行）</summary>

```text
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
```

</details>

**依据 4 · 作者声明**：[README.md:59-75](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/README.md#L59-L75)

作者重启刷新和可视核对步骤。

<details>
<summary>查看原文（17行）</summary>

````text
## Verify

1. Ask the agent to write a file under `/home/<you>/...` (e.g. `.pptx`).
2. The absolute path should be dotted-underlined.
3. Click it — Windows opens with the default app.

Debug: browser console `[dsh-wsl-open]`; host log `dsh-wsl-open: loaded distro=...`.

## Config

```yaml
- id: dsh-wsl-open
  name: dsh-wsl-open
  config:
    enabled: true
```

````

</details>

#### 缺口

- 缺少长会话扫描与跨系统打开成功率、时间记录。
  **影响**：无法量化便利是否超过兼容排查和重复窗口负担。
  **进一步探讨**：固定文件类型、路径和浏览器版本，比较人工打开与点击路径的正确显示时间并统计失败恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程设计和测试证明什么，可推导何种改进？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

CSS Highlight及Range把视觉增强与React拥有的DOM分开，MutationObserver配合requestAnimationFrame限制重复调度，ctx.effect在卸载时移除点击监听、断开observer并清理highlight。后端realpath复核、Windows可执行路径固定优先、PowerShell单引号转义和LiteralPath值得借鉴。移植代价是浏览器API、会话服务和Windows interop适配；不能只复制正则当完整功能。

测试源码覆盖盘符/UNC转换、WSL环境、边界前缀、中文路径与可执行文件fallback，不覆盖真实路由、浏览器命中、来源端口和Windows实际窗口。因此本轮只记录已检查源码，不把测试存在改写成通过。未验证方向是将高亮限定在已确认消息交付物，并显示即将打开的真实路径与可见失败状态，减少整页扫描和错误成功理解；用同一批长会话与含空格文件比较漏检、误点和实际显示成功率，若确认步骤抵销便利或路径状态仍误导，应否定这项扩展。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:211-224](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/client.js#L211-L224)

effect清理observer、监听与highlight。

<details>
<summary>查看原文（14行）</summary>

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
      }

      if (ctx.effect) ctx.effect(start, "dsh-wsl-open: click");
      else start();
```

</details>

**依据 2 · 源码核查**：[test/windows-path.test.js:12-44](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/test/windows-path.test.js#L12-L44)

映射和边界函数测试。

<details>
<summary>查看原文（33行）</summary>

```text
describe("toWindowsPath", () => {
  it("maps /mnt/c to a Windows drive letter", () => {
    assert.equal(
      toWindowsPath("/mnt/c/Users/alice/GO/deck.pptx"),
      "C:\\Users\\alice\\GO\\deck.pptx",
    );
  });

  it("maps a Linux home path to a \\\\wsl$ UNC path", () => {
    assert.equal(
      toWindowsPath("/home/alice/GO/o2o/大洋晶典_O2O战略汇报.pptx", { distro: "Ubuntu-24.04" }),
      "\\\\wsl$\\Ubuntu-24.04\\home\\alice\\GO\\o2o\\大洋晶典_O2O战略汇报.pptx",
    );
  });

  it("rejects relative paths", () => {
    assert.equal(toWindowsPath("o2o/deck.pptx"), "");
  });
});

describe("isSafeLinuxPath", () => {
  it("accepts absolute Linux paths and rejects NUL or oversize", () => {
    assert.equal(isSafeLinuxPath("/home/alice/a.pptx"), true);
    assert.equal(isSafeLinuxPath("C:\\Users\\a"), false);
    assert.equal(isSafeLinuxPath("/home/\0x"), false);
  });
});

describe("isWithin", () => {
  it("does not treat /home/alice as a prefix of /home/alice2", () => {
    assert.equal(isWithin("/home/alice", "/home/alice/GO/a.pptx"), true);
    assert.equal(isWithin("/home/alice", "/home/alice2/a.pptx"), false);
  });
```

</details>

**依据 3 · 源码核查**：[test/windows-path.test.js:54-87](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/test/windows-path.test.js#L54-L87)

扫描和Windows二进制选择覆盖。

<details>
<summary>查看原文（34行）</summary>

```text
describe("matchLinuxPaths", () => {
  it("finds a CJK pptx path in plain prose", () => {
    const text = "文件已写到 /home/alice/GO/o2o/大洋晶典_O2O战略汇报.pptx 请查收。";
    assert.deepEqual(matchLinuxPaths(text), [
      "/home/alice/GO/o2o/大洋晶典_O2O战略汇报.pptx",
    ]);
  });

  it("finds /mnt/c paths and strips a trailing period", () => {
    assert.deepEqual(
      matchLinuxPaths("see /mnt/c/Users/alice/GO/deck.pptx."),
      ["/mnt/c/Users/alice/GO/deck.pptx"],
    );
  });

  it("finds a path after a fullwidth colon", () => {
    const text = "已经生成好了：/home/alice/GO/o2o/大洋晶典_O2O战略汇报.pptx";
    assert.deepEqual(matchLinuxPaths(text), [
      "/home/alice/GO/o2o/大洋晶典_O2O战略汇报.pptx",
    ]);
  });
});

describe("windowsBin", () => {
  it("prefers an absolute WSL Windows path when that file exists", () => {
    assert.equal(
      windowsBin("powershell.exe", { exists: (p) => p.endsWith("powershell.exe") }),
      "/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe",
    );
  });

  it("falls back to the bare name when nothing is mounted", () => {
    assert.equal(windowsBin("cmd.exe", { exists: () => false }), "cmd.exe");
  });
```

</details>

**依据 4 · 源码核查**：[index.js:136-152](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/index.js#L136-L152)

PowerShell字面量处理。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

#### 缺口

- 消息级交付物与真实打开状态的增强方案没有对照材料。
  **影响**：只能作为研究假设，不能计入现有能力与评分。
  **进一步探讨**：先定义最小可见状态和消息范围，再用固定路径/文件类型比较误点与恢复负担。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 对谁值得试用，如何验收及停止？

**研究主题**：采用判断

#### 完整回答

建议个人本地WSL用户在可信文件和明确默认关联下试用。先用可丢弃的PPTX、文本与目录验证中文、路径映射和应用回退，并核对sessionId对应的cwd；关键标准是用户确实看到正确文件，不以API ok替代。涉及不可信模型生成的可执行文件、共享机器或开放网络web部署，应先核清路由权限与文件关联风险，再决定是否纳入。

若合法含空格路径持续无法点击、页面非交付物被高亮、错误却返回成功或出现不明应用启动，停止快捷路径并用手工绝对路径打开。关闭服务端enabled后客户端还可能继续拦截点击并收到404，退出体验也应观察。当前源码能解释可控本地便利，却没有同版本安装、核心流程与卸载验收，不给值得安装结论。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:19-25](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/index.js#L19-L25)

enabled仅在服务端阻止注册。

```text
export function apply(ctx, config = {}) {
  const enabled = config.enabled !== false;
  const webServer = ctx.webServer;
  const sessions = ctx.sessions;
  if (!enabled || webServer === undefined) {
    if (!enabled) console.log("[dsh-wsl-open] disabled");
    return;
```

**依据 2 · 源码核查**：[client.js:186-207](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/client.js#L186-L207)

全局捕获点击并阻止默认行为。

<details>
<summary>查看原文（22行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[index.js:164-171](https://github.com/173787247/dsh-wsl-open/blob/550509f9ab6dc8a9c6a939bc3ea38a10c9659b92/index.js#L164-L171)

API成功判据与用户显示结果不同。

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

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
