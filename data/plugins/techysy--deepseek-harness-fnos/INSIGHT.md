# DeepSeek Harness for fnOS

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[1cda305](https://github.com/techysy/deepseek-harness-fnos/tree/1cda305ad88190c4acd937f79531a3f01ce828d5)

<!-- BEGIN META -->
[![GitHub ★ 85](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=85&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/techysy/deepseek-harness-fnos)
<!-- END META -->

> **功能**：将 DSH 打包为 fnOS 常驻应用，并提供网关与管理面板。

> **亮点**：[Q01](#research-q01) 集中fnOS部署与服务入口，Agent能力继承所用DSH。

> **主要限制**：[Q02](#research-q02) Host围栏不构成用户认证，直接端口与网关信任不同。[Q03](#research-q03)停止和卸载需独立读回。

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
  - [Q01 · 发行包怎样让 NAS 常驻 DSH？](#detail-section-11)
  - [Q02 · 直接端口是否具有独立用户认证？](#detail-section-12)
  - [Q03 · 升级、停止和数据保留要核实什么？](#detail-section-13)
  - [Q04 · 什么最小改进可检验独立认证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：自行维护NAS并希望常驻DSH的运维人员。

手工配置Node、DSH服务和反向代理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 发行部署 | 启动DSH及网关 | 依赖fnOS平台 |
| 管理面板 | 日志重启及插件操作 | 须另核身份与网络边界 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| fnOS对应平台及应用账户 | 必需 | 安装和常驻 | 保留已有服务 |
| Node、DSH及Python | 必需 | 主服务与网关 | 停止部署 |
| 防火墙与网关身份 | 暴露访问必需 | 限制敏感API | 只用隔离NAS |
| 两数据区备份 | 恢复必需 | 保留会话和凭据 | 不卸载真实实例 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 隔离NAS与假凭据 | 记录包和运行时版本 |
| 启动 | 核对绑定、网关和面板 | 分别测未认证请求 |
| 停止 | 读回三个服务和进程树 | 不只看返回码 |
| 恢复 | 重装核对共享区和appdata | 再恢复必要配置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包下载与NAS磁盘未知 | 配置网络身份及备份 | 未实测 |
| 持续使用 | 模型与常驻资源未知 | 维护上游补丁和版本 | 按平台 |
| 失败恢复 | 重装及残留资源未知 | 查两数据区和进程树 | 凭据可能需重填 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| NAS部署 | 生命周期与网关脚本 | 真实可安装性 |
| 管理面板 | 日志、重启和插件API | 有效身份约束 |
| 数据保留 | 两区路径与卸载说明 | 重装完整性 |

> **思考**：[Q02](#research-q02) Host围栏不构成用户认证，直接端口与网关信任不同。[Q03](#research-q03)停止和卸载需独立读回。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中fnOS部署与服务入口，Agent能力继承所用DSH。

[Q03](#research-q03) PID检查和删文件日志不能单独证明进程静止。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) Host围栏不构成用户认证，直接端口与网关信任不同。[Q03](#research-q03)停止和卸载需独立读回。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q02](#research-q02) 先核实身份及直连端口，再考虑隔离NAS试用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

发行脚本、管理路由和清理静态核查，实际NAS部署、鉴权和恢复未验证。

- 已检查：作者 README、包清单、源码路径 README.md、cmd/dashboard.js、cmd/main、cmd/proxy.py、cmd/uninstall_callback 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定cmd/main Git blob、dashboard、proxy和卸载，未运行目标。
- 下一步：验证网关与直连认证、补丁命中、停机及两区恢复。

**分析版本**

- **仓库**：[techysy/deepseek-harness-fnos](https://github.com/techysy/deepseek-harness-fnos)
- **版本号**：未声明（[固定提交 1cda305](https://github.com/techysy/deepseek-harness-fnos/tree/1cda305ad88190c4acd937f79531a3f01ce828d5)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 敏感API验证真实身份与限制直接端口可作为待测方向。

验证网关与直连认证、补丁命中、停机及两区恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 20 | 2726 | — | — | 36542 |
| .js | source | 2 | 1433 | 1336 | 82 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/techysy/deepseek-harness-fnos/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/techysy/deepseek-harness-fnos/issues?q=is%3Aissue+created%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/techysy/deepseek-harness-fnos/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：fnOS发行封装怎样启动和暴露DSH，权限与恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 发行包怎样让 NAS 常驻 DSH？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要在fnOS托管DSH的维护者可用fpk包装内置运行时和依赖，并由cmd/main启动DSH、Unix socket网关与管理面板。DSH用profile补丁绑定0.0.0.0，main传端口和trusted-host；proxy在应用socket监听，再转向本机DSH。相比手工安装Node、服务脚本和反代，该项目把打包及服务管理集中到fnOS应用。根身份是部署发行工具，核心Agent执行仍由其打包或安装的DSH承担。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:49-66](https://github.com/techysy/deepseek-harness-fnos/blob/1cda305ad88190c4acd937f79531a3f01ce828d5/README.md#L49-L66)

作者说明分发与常驻

<details>
<summary>查看原文（18行）</summary>

```text
## 功能

**离线自托管**
- **安装免联网**：`@deepseek-ai/dsh` 连同 `node_modules` 随 fpk 内置；只有离线包缺失时才回退到在线 `npm install`（单线程 + 512 MB 堆，照顾 1 GB 内存的小设备）
- **双架构**：x86 与 ARM 各出 iframe / url 两个变体，均由 GitHub Actions 在线打包
- **常驻服务**：以应用专属账号 `dsh` 运行（`run-as: package`），由 `cmd/main` 管理 start / stop / status / restart

**访问与安全**
- **局域网直连**：通过 `cordis.patch.yml` 把 dsh web 绑定到 `0.0.0.0:28000`（dsh CLI 本身拒绝 `--host 0.0.0.0`）
- **信任围栏**：`/api/*` 校验 Host / Origin，只放行回环地址 + `--trusted-host` 列表（启动时自动探测的本机 IP + `fnos.net` / `5ddd.com` + `trusted_hosts.conf` 中的域名），其余来源 403
- **桌面免 401**：上游 0.1.2 起的浏览器 token 鉴权对静态桌面入口不可用，运行时补丁对已通过围栏的请求放行（等效「围栏即认证」）
- **FN Connect / DDNS 远程访问**：安装向导或应用设置里填 FN ID / 自定义域名，自动写入信任域，远程访问不再 403
- **设置页 host 模式**：构建期补丁让非回环访问（局域网 IP、FN Connect 域名）也能读写服务端配置，插件 / 模型设置不再空白

**运维**
- **28001 管理面板**：服务状态、三路日志、插件启停 / 删除 / 安装、版本检查、一键重启 dsh、一键下载并热安装更新（见 [管理面板](#管理面板)）
- **启动自愈**：启动前把 `.credentials.yaml` / `.env` 修正为 600 权限、清理占用 28000 端口的残留进程、修正被 root 误建的 `.gitconfig` 权限
- **数据保留**：升级不动数据区，卸载脚本只清理日志与 pid，都不删除 `dsh_home`（工作空间、会话、API Key、代理与信任域配置）
```

</details>

**依据 2 · 源码核查**：[cmd/main:289-305](https://github.com/techysy/deepseek-harness-fnos/blob/1cda305ad88190c4acd937f79531a3f01ce828d5/cmd/main#L289-L305)

profile层绑定路径

<details>
<summary>查看原文（17行）</summary>

```text
    # 写入 cordis.patch.yml: 覆盖 webserver 绑 0.0.0.0 (允许局域网/Tailscale 直连)
    # dsh CLI --host 0.0.0.0 会被 web-startup 插件拒绝; patch 层优先级更高, 绕过校验
    #
    # ⚠️ 上游 0.1.7+ 起 UI 的设置也写进本文件 (不再有 settings.yaml), 而本函数
    # 在每次 start 都会执行。若无条件整文件覆盖, 用户在 UI 里的任何变更都会在
    # 下次重启时丢失 (issue #5)。因此这里改为**幂等 upsert**:
    #   - 只增改 id: webserver 的 host/port 两行, 其余内容 (用户/其他插件的配置) 原样保留
    #   - YAML 键按 id 对齐 (首行裸 `- ` 缩进 0), 与上游生成格式一致, 避免结构错位
    #   - python3 不可用时回退为原整文件写入 (宁可丢失也不让服务起不来)
    # 注意必须写在 dsh 实际读取的 HOME (HOME_DIR, 共享布局下是 @appshare) 里;
    # 写到 DSH_HOME (数据区) 会被 dsh 视为不存在而在共享区重建空模板, 0.0.0.0 绑定随之失效
    CORDIS_PATCH="${HOME_DIR}/profiles/web/cordis.patch.yml"
    if [ -f "${CORDIS_PATCH}" ] && grep -qE '^[[:space:]]*-[[:space:]]*id:[[:space:]]*["'"'"']?webserver' "${CORDIS_PATCH}" 2>/dev/null \
        && command -v python3 >/dev/null 2>&1; then
        CORDIS_PATCH="${CORDIS_PATCH}" DSH_PORT="${DSH_PORT}" /usr/bin/env python3 - <<'PATCHYML'
import os, re
p = os.environ["CORDIS_PATCH"]
```

</details>

**依据 3 · 源码核查**：[cmd/main:617-626](https://github.com/techysy/deepseek-harness-fnos/blob/1cda305ad88190c4acd937f79531a3f01ce828d5/cmd/main#L617-L626)

启动参数准备

<details>
<summary>查看原文（10行）</summary>

```text
    # 启动 dsh web: 不带 --host (让 patch 的 0.0.0.0 生效), 显式传 --port + trusted-host
    # DSH_ARGS 非空时 = 用 node <bin.js> 运行 (无 bin 链接的兜底)
    # dsh 自托管 node: 把 nodejs_v24 bin 目录加入 PATH, 供 dsh 进程及 agent 调用 node/npm
    if [ -n "${NODE_BIN}" ]; then
        NODE_BIN_DIR="$(dirname "${NODE_BIN}" 2>/dev/null)"
        case ":${PATH}:" in
            *":${NODE_BIN_DIR}:"*) : ;;
            *) export PATH="${NODE_BIN_DIR}:${PATH}" ;;
        esac
        # corepack shims (pnpm/yarn) 加入 PATH: nodejs_v24 的 corepack 提供 pnpm 命令,
```

</details>

**依据 4 · 源码核查**：[cmd/main:668-672](https://github.com/techysy/deepseek-harness-fnos/blob/1cda305ad88190c4acd937f79531a3f01ce828d5/cmd/main#L668-L672)

DSH服务启动

```text
    HOME="${HOME_DIR}" DSH_HOME="${HOME_DIR}" nohup "${DSH_BIN}" ${DSH_ARGS:-} web --port "${DSH_PORT}" ${TRUSTED_HOST_ARGS} \
        >> "${DSH_LOG}" 2>&1 &
    echo $! > "${DSH_PID}"
    log "dsh web started (pid $(cat "${DSH_PID}")) :0.0.0.0:${DSH_PORT} (patch: host 0.0.0.0) trusted-host:${TRUSTED_HOST_VALUES}"
    sleep 3
```

**依据 5 · 源码核查**：[cmd/proxy.py:288-302](https://github.com/techysy/deepseek-harness-fnos/blob/1cda305ad88190c4acd937f79531a3f01ce828d5/cmd/proxy.py#L288-L302)

Unix socket入口

<details>
<summary>查看原文（15行）</summary>

```text
class UnixServer(ThreadingHTTPServer):
    address_family = socket.AF_UNIX
    allow_reuse_address = True


def main():
    if os.path.exists(SOCK_PATH):
        os.remove(SOCK_PATH)
    server = UnixServer(SOCK_PATH, Handler)
    print(f"dsh proxy: {SOCK_PATH} -> 127.0.0.1:{DSH_PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
```

</details>

#### 缺口

- 固定fpk内的DSH版本与安装结果未验收
  **影响**：不能保证当前包可在目标NAS启动
  **进一步探讨**：先记录平台包版本哈希并在隔离NAS验证启动

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 直接端口是否具有独立用户认证？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

管理面板0.0.0.0:28001的handler首先只用Host判断，允许本机IP或配置域名及其子域，再能调用读取日志、重启和插件安装等API。这里没有独立用户身份、token或Origin校验。只要端口对某客户端可达，Host头可由非浏览器客户端设成允许值，不能把域名匹配视为身份认证。

main还尝试匹配上游isAuthenticated字符串并插入return true，把DSH浏览器token检查改为仅依赖前面的信任围栏。是否实际打上补丁取决于固定DSH文本；它使直接28000入口与受fnOS登录保护的统一网关成为不同信任路径。README称面板有Host/Origin围栏，但当前dashboard只有Host门。网络可达性和fnOS外层策略未实测，源码足以说明不能单靠这些门提供多用户授权。

#### 证据与依据

**依据 1 · 源码核查**：[cmd/dashboard.js:119-139](https://github.com/techysy/deepseek-harness-fnos/blob/1cda305ad88190c4acd937f79531a3f01ce828d5/cmd/dashboard.js#L119-L139)

Host及后缀匹配

<details>
<summary>查看原文（21行）</summary>

```text
function trustedHosts() {
  // 内置两条飞牛 FN Connect 域名后缀 (issue #7); 其余来自用户的 trusted_hosts.conf
  const out = new Set(["fnos.net", "5ddd.com"]);
  try {
    const f = path.join(DSH_HOME, "trusted_hosts.conf");
    if (fs.existsSync(f))
      for (const line of fs.readFileSync(f, "utf8").split("\n")) {
        let h = line.replace(/^https?:\/\//, "").replace(/\/$/, "").trim();
        if (h && !h.startsWith("#")) out.add(h);
      }
  } catch {}
  return out;
}
function hostAllowed(host) {
  if (!host) return false;
  const h = host.split(":")[0].toLowerCase();
  if (localIps().has(h)) return true;
  for (const t of trustedHosts()) {
    if (h === t || h.endsWith("." + t)) return true;
  }
  return false;
```

</details>

**依据 2 · 源码核查**：[cmd/dashboard.js:1231-1265](https://github.com/techysy/deepseek-harness-fnos/blob/1cda305ad88190c4acd937f79531a3f01ce828d5/cmd/dashboard.js#L1231-L1265)

Host后可读日志及重启

<details>
<summary>查看原文（35行）</summary>

```text
const server = http.createServer(async (req, res) => {
  const host = req.headers.host || "";
  if (!hostAllowed(host)) {
    const body = HTML_403.replace("__HOST__", String(host).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"));
    res.writeHead(403, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(body);
  }
  const u = new URL(req.url, "http://x");
  const send = (code, body, type = "application/json; charset=utf-8") => { res.writeHead(code, { "Content-Type": type }); res.end(body); };
  try {
    if (u.pathname === "/" && req.method === "GET") return send(200, HTML, "text/html; charset=utf-8");
    if (u.pathname === "/logo.png") {
      // dsh 应用图标 (DeepSeek 鲸鱼): NAS 上取安装目录, 本地/开发取仓库根
      const cands = [path.join(APP_DIR, "ICON_256.PNG"), path.join(__dirname, "..", "ICON_256.PNG"), path.join(__dirname, "ICON_256.PNG")];
      for (const c of cands) { try { const b = fs.readFileSync(c); res.writeHead(200, { "Content-Type": "image/png" }); return res.end(b); } catch {} }
      return send(404, "not found");
    }
    if (!DATA_DIR) return send(500, JSON.stringify({ error: "未找到 dsh 数据区" }));
    if (u.pathname === "/api/status") return send(200, JSON.stringify(await apiStatus()));
    if (u.pathname === "/api/version") return send(200, JSON.stringify(await apiVersion()));
    if (u.pathname === "/api/plugins") return send(200, JSON.stringify(apiPlugins()));
    if (u.pathname === "/api/logs" && req.method === "GET") {
      const f = u.searchParams.get("file") || "app";
      const n = Math.min(Number(u.searchParams.get("lines")) || 300, 2000);
      const grep = (u.searchParams.get("grep") || "").toLowerCase().slice(0, 64);
      const map = { app: path.join(DATA_DIR, "app.log"), dsh: path.join(DATA_DIR, "dsh.log"), dashboard: path.join(DATA_DIR, "dashboard.log") };
      if (!map[f]) return send(400, JSON.stringify({ ok: false, err: "bad file" }));
      let text = tail(map[f], n);
      if (grep) text = text.split("\n").filter(l => l.toLowerCase().includes(grep)).join("\n");
      return send(200, JSON.stringify({ ok: true, text }));
    }
    if (u.pathname === "/api/dsh/restart" && req.method === "POST") { restartDsh(); return send(200, JSON.stringify({ ok: true, msg: "restart dispatched" })); }
    if (u.pathname === "/api/update/download" && req.method === "POST") {
      const { force } = await readBody(req);
      return send(200, JSON.stringify(await updateDownload(!!force)));
```

</details>

**依据 3 · 源码核查**：[cmd/dashboard.js:1355-1385](https://github.com/techysy/deepseek-harness-fnos/blob/1cda305ad88190c4acd937f79531a3f01ce828d5/cmd/dashboard.js#L1355-L1385)

插件安装和全接口监听

<details>
<summary>查看原文（31行）</summary>

```text
    }
    if (u.pathname === "/api/plugins/add" && req.method === "POST") {
      const { name } = await readBody(req);
      if (!/^[@a-zA-Z0-9._/-]+$/.test(name || "")) return send(400, JSON.stringify({ ok: false, err: "bad name" }));
      // 官方插件版本跟随 dsh: @deepseek-ai/ 作用域且未显式带 @版本/@tag 时,
      // 钉到已装 dsh 版本再装 — 该作用域 dist-tags 的 latest 可能指向 alpha
      // (如 voice-input-bundle latest=0.1.7-alpha.1), 与运行中的 rc 版不匹配
      let spec = name;
      const dshVer = installedDshVersion();
      if (name.startsWith("@deepseek-ai/") && dshVer && !name.replace(/^@/, "").includes("@")) spec = `${name}@${dshVer}`;
      // 默认源失败回退 npmmirror (NAS 无代理时 npmjs 常超时)
      let installed = false, errTail = "";
      for (const args of [["add", spec], ["add", spec, "--registry=https://registry.npmmirror.com"]]) {
        try {
          execFileSync("pnpm", args, { cwd: PROFILE(), stdio: ["ignore", "pipe", "pipe"], timeout: 300000, env: process.env });
          installed = true;
          break;
        } catch (e) { errTail = ((e.stdout || "") + (e.stderr || "")).trim().slice(-300); }
      }
      if (!installed) return send(200, JSON.stringify({ ok: false, err: `pnpm add 失败 (pnpm 不可用、包/版本不存在或网络不通; 可在名称后显式加 @版本): ${errTail || "no output"}`, hint: pnpmHint(errTail) }));
      savePlugins((bundles) => { const s = new Set(bundles); s.add(name); return [...s]; });
      return send(200, JSON.stringify({ ok: true, pinned: spec !== name ? spec : undefined }));
    }
    return send(404, JSON.stringify({ error: "not found" }));
  } catch (e) { return send(500, JSON.stringify({ error: String(e.message || e) })); }
});

if (!DATA_DIR || !DSH_HOME) { console.error(`[${new Date().toISOString()}] dashboard: 未找到 dsh 数据区 (DATA_DIR=${DATA_DIR}), 退出`); process.exit(1); }
server.listen(Number(DASH_PORT), "0.0.0.0", () => {
  console.log(`[${new Date().toISOString()}] dashboard: 管理面板已启动 http://0.0.0.0:${DASH_PORT}/ (DATA_DIR=${DATA_DIR})`);
});
```

</details>

**依据 4 · 源码核查**：[cmd/main:452-463](https://github.com/techysy/deepseek-harness-fnos/blob/1cda305ad88190c4acd937f79531a3f01ce828d5/cmd/main#L452-L463)

token认证替换尝试

<details>
<summary>查看原文（12行）</summary>

```text
# 是静态 URL, 每次重启 token 都变, 用户没法感知. 放行依据: Host/Origin 信任
# 围栏 (api-request-trust, 403) 在鉴权 (401) 之前执行, 能走到鉴权的请求必然
# 已属于 loopback / --trusted-host 白名单 — 与上面特权 API 放行是同一信任决策.
old4 = "isAuthenticated(request) {\n\t\tconst authority = requestAuthority(request.headers);"
new4 = "isAuthenticated(request) {\n\t\treturn true; /* fnos-fpk: browser token auth off, host/origin trust fence is the gate */\n\t\tconst authority = requestAuthority(request.headers);"
old4b = "isAuthenticated(request, secure = false) {\n\t\treturn this.authenticate(request, secure)?.version === COOKIE_PAYLOAD_VERSION;"
new4b = "isAuthenticated(request, secure = false) {\n\t\treturn true; /* fnos-fpk: browser token auth off, host/origin trust fence is the gate */\n\t\treturn this.authenticate(request, secure)?.version === COOKIE_PAYLOAD_VERSION;"
if old4 in s and new4 not in s:
    s = s.replace(old4, new4); changed = True
elif old4b in s and new4b not in s:
    s = s.replace(old4b, new4b); changed = True
if changed:
```

</details>

**依据 5 · 作者声明**：[README.md:100-119](https://github.com/techysy/deepseek-harness-fnos/blob/1cda305ad88190c4acd937f79531a3f01ce828d5/README.md#L100-L119)

网关与直接入口说明

<details>
<summary>查看原文（20行）</summary>

```text
## 访问方式

| 入口 | 地址 | 说明 |
| --- | --- | --- |
| **fnOS 桌面图标** | 随 fnOS 访问方式自适应（走统一网关 `/app/dsh`） | 推荐入口：局域网、DDNS、FN Connect 下都可用，自带 fnOS 登录保护 |
| **统一网关** | `https://<访问域名>/app/dsh/` | 与访问 fnOS 的域名/协议同源 —— **DDNS / 自定义域名的正解入口**，免暴露 28000、无混合内容问题 |
| **局域网 / Tailscale** | `http://<NAS_IP>:28000` | 直连端口；本机所有非回环 IPv4 启动时自动加入信任列表 |
| **FN Connect** | `https://dsh.<FN_ID>.fnos.net` | 需在安装向导 / 应用设置中填写 FN ID；`https://<FN_ID>.fnos.net`、`https://fnos.net/<FN_ID>` 同样被信任。飞牛 `5ddd.com` 后缀域名已内置信任，无需填写 |
| **自定义域名（DDNS）** | `https://<你的域名>` | 需在安装向导 / 应用设置中填写自定义域名（28000 直连信任面）；走网关则无需填写 |
| **管理面板** | `http://<NAS_IP>:28001/` | 与 dsh 相同的信任面 |

> 统一网关细节与打通过程见 [docs/dsh-access-and-gateway.md](docs/dsh-access-and-gateway.md)。远程场景推荐网关入口；28000 直连入口保留。

**安全机制**（0.2.0-rc.2 现状，补丁均为幂等，每次启动 / 安装时自动检查）：

| 机制 | 实现 | 说明 |
| --- | --- | --- |
| 0.0.0.0 绑定 | `cmd/main` 写 `dsh_home/profiles/web/cordis.patch.yml` | 覆盖 webserver 的 host / port |
| 信任围栏 | `cmd/main` 以单个 `--trusted-host` 传入全部信任值 | 该参数是 variadic，重复写 flag 只保留最后一个 |
| 桌面免 401 | `cmd/main` 内联补丁 `dsh-client-connection` 的 `isAuthenticated`（python3 不可用时用 node 兜底） | 结果写入 `app.log`；**请勿把 28000 / 28001 暴露到不受信任的网络** |
```

</details>

#### 缺口

- 实际防火墙、fnOS登录反代及补丁应用状态未验收
  **影响**：不能支持不可信网络上的管理或用户隔离
  **进一步探讨**：隔离NAS分别测试网关与直连的未认证请求及有效运行配置

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 升级、停止和数据保留要核实什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、工程质量与复用

#### 完整回答

依赖fnOS应用账户、对应架构Node及DSH包、Python网关和模型配置。README区分共享工作区与appdata凭据，通过软链接入同一home；卸载时fnOS会清理appdata，因此脚本“不删dsh_home”的注释并不足以保证凭据存留。应分别备份共享数据和凭据区，并在不包含真实Key的测试安装中演练重装。

stop向PID发kill后删pid并记录stopped，再用fuser-k释放端口，不等待特定进程树全部结束；dashboard有意保留，卸载callback另行kill。健康检查只看两秒后pid存活。首次下载与磁盘、模型和NAS持续资源未知，人工还需核对鉴权补丁、运行版本与管理面板。退出前核实三个服务及派生进程，不能用stop返回0作唯一验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:202-219](https://github.com/techysy/deepseek-harness-fnos/blob/1cda305ad88190c4acd937f79531a3f01ce828d5/README.md#L202-L219)

共享区与凭据区及卸载

<details>
<summary>查看原文（18行）</summary>

```text
### 端口与数据区

| 服务 | 端口 / 路径 | 说明 |
| --- | --- | --- |
| dsh web | `0.0.0.0:28000` | DeepSeek Harness 浏览器 UI（`TRIM_SERVICE_PORT` 可覆盖） |
| 管理面板 | `0.0.0.0:28001` | `dashboard.js` |
| 网关 socket | `/var/apps/dsh/target/app.sock` → `proxy.py` | 统一网关 `/app/dsh`（DDNS / HTTPS 入口，见 [访问方式](#访问方式)） |

数据分两处存放 —— **工作空间放共享目录**（文件管理器可见、SMB 可共享、卸载不删），**凭据留在数据区**（不对外暴露）：

| 位置 | 路径 | 内容 |
| --- | --- | --- |
| 共享目录 | `/vol<N>/@appshare/dsh/dsh_home` | dsh 的 `HOME`：`profiles/web/`（插件与 `cordis.patch.yml`）、会话 / 工作空间文件、`update/`（热更新下载）、`.npm-global` / `.npm` / `.corepack` |
| 数据区 | `/vol<N>/@appdata/dsh` | 生命周期日志（`app.log` / `dsh.log` / `proxy.log` / `dashboard.log`）、`install.log` / `config.log`、pid、`dsh-web-url.txt` |
| 数据区 | `/vol<N>/@appdata/dsh/dsh_home` | **凭据类**：`.env`（API Key）、`.credentials.yaml`、`proxy.conf`、`trusted_hosts.conf`、迁移标记 `.migrated-to-share` |

> 凭据以软链形式接入共享 `HOME`（dsh 仍从同一 HOME 读取），真实文件始终留在数据区。
> **卸载行为**：`@appshare` 是 `config/resource` 声明的共享目录，fnOS 卸载时**不清理**——工作空间与会话得以保留；`@appdata` 会被清理，凭据随之移除（重装后重填，符合预期）。
```

</details>

**依据 2 · 源码核查**：[cmd/main:724-760](https://github.com/techysy/deepseek-harness-fnos/blob/1cda305ad88190c4acd937f79531a3f01ce828d5/cmd/main#L724-L760)

健康检查和停止

<details>
<summary>查看原文（37行）</summary>

```text
    mkdir -p "${DATA_DIR}" "${DSH_HOME}"
    [ -n "${WORK_HOME}" ] && mkdir -p "${WORK_HOME}" 2>/dev/null || true
    # 防死锁: 若历史 pid 文件因权限或所有权不可写, 尝试清理
    for pf in "${DSH_PID}" "${PROXY_PID}" "${DASH_PID}"; do
        [ -e "${pf}" ] && [ ! -w "${pf}" ] && rm -f "${pf}" 2>/dev/null || true
    done
    find_dsh_bin
    start_dsh
    start_proxy
    start_dashboard
    # 健康检查
    sleep 2
    if [ -f "${DSH_PID}" ] && kill -0 "$(cat "${DSH_PID}")" 2>/dev/null; then
        log "dsh health OK"
        return 0
    else
        log "dsh failed to start (check ${DSH_LOG})"
        return 1
    fi
}

stop() {
    # 停 proxy 再停 dsh (dashboard 保留: restart 场景下面板自身不被打断)
    if [ -f "${PROXY_PID}" ]; then
        kill "$(cat "${PROXY_PID}")" 2>/dev/null
        rm -f "${PROXY_PID}"
        log "proxy stopped"
    fi
    pkill -u "$(id -u)" -f "${PROXY_SRC}" 2>/dev/null || true
    if [ -f "${DSH_PID}" ]; then
        kill "$(cat "${DSH_PID}")" 2>/dev/null
        rm -f "${DSH_PID}"
        log "dsh web stopped"
    fi
    # 兜底确保释放 28000 端口
    fuser -k "${DSH_PORT}/tcp" 2>/dev/null || true
    return 0
```

</details>

**依据 3 · 源码核查**：[cmd/uninstall_callback:26-36](https://github.com/techysy/deepseek-harness-fnos/blob/1cda305ad88190c4acd937f79531a3f01ce828d5/cmd/uninstall_callback#L26-L36)

面板清理与保留注释

<details>
<summary>查看原文（11行）</summary>

```text
# 只清理运行时日志与 pid, 保留 dsh_home 用户数据 (工作空间/会话/API Key/代理)
# 先停管理面板 (main stop 不杀它, 卸载/重装场景必须显式停)
if [ -f "${DATA_DIR}/dashboard.pid" ]; then
    kill "$(cat "${DATA_DIR}/dashboard.pid")" 2>/dev/null
fi
pkill -f "cmd/dashboard.js" 2>/dev/null || true
rm -f "${DATA_DIR}"/*.log "${DATA_DIR}"/*.pid 2>/dev/null || true

# 保留 dsh_home (工作空间 profiles/storages + .env + proxy.conf)
# 用户重新安装或升级后数据仍在.
exit 0
```

</details>

#### 缺口

- NAS卸载与升级回退、派生进程停止未测试
  **影响**：可能丢凭据或留进程，恢复成本未知
  **进一步探讨**：用假凭据和合成会话核对卸载前后两区与进程树

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么最小改进可检验独立认证？

**研究主题**：新假设与验证

#### 完整回答

针对只看Host的面板，可试验在敏感API前要求fnOS可验证会话或独立短期令牌，并把直接端口限制到网关可达范围。用合法Host但无身份、过期身份和正常网关会话作对照，检查敏感请求是否真正被拒绝及管理功能是否保留。若没有减少未认证执行或正常恢复无法操作，则需要重做部署契约，不能只加UI警告。

#### 证据与依据

**依据 1 · 源码核查**：[cmd/dashboard.js:1231-1265](https://github.com/techysy/deepseek-harness-fnos/blob/1cda305ad88190c4acd937f79531a3f01ce828d5/cmd/dashboard.js#L1231-L1265)

敏感路由前只有Host门

<details>
<summary>查看原文（35行）</summary>

```text
const server = http.createServer(async (req, res) => {
  const host = req.headers.host || "";
  if (!hostAllowed(host)) {
    const body = HTML_403.replace("__HOST__", String(host).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"));
    res.writeHead(403, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(body);
  }
  const u = new URL(req.url, "http://x");
  const send = (code, body, type = "application/json; charset=utf-8") => { res.writeHead(code, { "Content-Type": type }); res.end(body); };
  try {
    if (u.pathname === "/" && req.method === "GET") return send(200, HTML, "text/html; charset=utf-8");
    if (u.pathname === "/logo.png") {
      // dsh 应用图标 (DeepSeek 鲸鱼): NAS 上取安装目录, 本地/开发取仓库根
      const cands = [path.join(APP_DIR, "ICON_256.PNG"), path.join(__dirname, "..", "ICON_256.PNG"), path.join(__dirname, "ICON_256.PNG")];
      for (const c of cands) { try { const b = fs.readFileSync(c); res.writeHead(200, { "Content-Type": "image/png" }); return res.end(b); } catch {} }
      return send(404, "not found");
    }
    if (!DATA_DIR) return send(500, JSON.stringify({ error: "未找到 dsh 数据区" }));
    if (u.pathname === "/api/status") return send(200, JSON.stringify(await apiStatus()));
    if (u.pathname === "/api/version") return send(200, JSON.stringify(await apiVersion()));
    if (u.pathname === "/api/plugins") return send(200, JSON.stringify(apiPlugins()));
    if (u.pathname === "/api/logs" && req.method === "GET") {
      const f = u.searchParams.get("file") || "app";
      const n = Math.min(Number(u.searchParams.get("lines")) || 300, 2000);
      const grep = (u.searchParams.get("grep") || "").toLowerCase().slice(0, 64);
      const map = { app: path.join(DATA_DIR, "app.log"), dsh: path.join(DATA_DIR, "dsh.log"), dashboard: path.join(DATA_DIR, "dashboard.log") };
      if (!map[f]) return send(400, JSON.stringify({ ok: false, err: "bad file" }));
      let text = tail(map[f], n);
      if (grep) text = text.split("\n").filter(l => l.toLowerCase().includes(grep)).join("\n");
      return send(200, JSON.stringify({ ok: true, text }));
    }
    if (u.pathname === "/api/dsh/restart" && req.method === "POST") { restartDsh(); return send(200, JSON.stringify({ ok: true, msg: "restart dispatched" })); }
    if (u.pathname === "/api/update/download" && req.method === "POST") {
      const { force } = await readBody(req);
      return send(200, JSON.stringify(await updateDownload(!!force)));
```

</details>

**依据 2 · 源码核查**：[cmd/main:452-463](https://github.com/techysy/deepseek-harness-fnos/blob/1cda305ad88190c4acd937f79531a3f01ce828d5/cmd/main#L452-L463)

上游token绕过意图

<details>
<summary>查看原文（12行）</summary>

```text
# 是静态 URL, 每次重启 token 都变, 用户没法感知. 放行依据: Host/Origin 信任
# 围栏 (api-request-trust, 403) 在鉴权 (401) 之前执行, 能走到鉴权的请求必然
# 已属于 loopback / --trusted-host 白名单 — 与上面特权 API 放行是同一信任决策.
old4 = "isAuthenticated(request) {\n\t\tconst authority = requestAuthority(request.headers);"
new4 = "isAuthenticated(request) {\n\t\treturn true; /* fnos-fpk: browser token auth off, host/origin trust fence is the gate */\n\t\tconst authority = requestAuthority(request.headers);"
old4b = "isAuthenticated(request, secure = false) {\n\t\treturn this.authenticate(request, secure)?.version === COOKIE_PAYLOAD_VERSION;"
new4b = "isAuthenticated(request, secure = false) {\n\t\treturn true; /* fnos-fpk: browser token auth off, host/origin trust fence is the gate */\n\t\treturn this.authenticate(request, secure)?.version === COOKIE_PAYLOAD_VERSION;"
if old4 in s and new4 not in s:
    s = s.replace(old4, new4); changed = True
elif old4b in s and new4b not in s:
    s = s.replace(old4b, new4b); changed = True
if changed:
```

</details>

#### 缺口

- fnOS可验证身份接口及恢复期令牌流程未知
  **影响**：方案可能需要网关和安装协议协同
  **进一步探讨**：先核对接口再在隔离NAS做拒绝与恢复实验

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
