# DSH Server Deployment

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[c6a6f12](https://github.com/AnkoCD/dsh-server-deployment/tree/c6a6f120bc44199a6f2736714900e636ea3c7419)

<!-- BEGIN META -->
[![GitHub ★ 40](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AnkoCD/dsh-server-deployment)
<!-- END META -->

> **功能**：为 DeepSeek Harness Web 提供多用户登录门户、独立实例和系统账号，以及工作区文件管理。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将多实例身份、代理和 OS 账号下的文件操作编排到一个门户。

> **主要限制**：[Q03](#research-q03) 防火墙的自检只看链与挂钩，需要独立核对规则覆盖和真实访问。

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
  - [Q01 · 多用户门户给管理员增加什么？](#detail-section-11)
  - [Q02 · 门户如何把请求限制到用户数据？](#detail-section-12)
  - [Q03 · 防火墙自检能否证明租户隔离？](#detail-section-13)
  - [Q04 · 怎样评估部署代价和退出条件？](#detail-section-14)
  - [Q05 · 规则对账门能否发现配置漂移？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Linux 管理员需要让多个用户各自访问 DSH Web，并统一处理登录和文件交付。

为每用户独立部署访问入口与文件操作流程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 用户实例门户 | 登录后访问独立 DSH Web | 依赖账号与端口映射 |
| 回环隔离 | 限制租户 UID 到受管端口 | 必须核对实际规则与监听 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Linux 独立账号、sudo 和权限 | 必需 | 用户级文件边界 | 拒绝生产部署 |
| 反代、iptables 和端口映射 | 必需 | 入口和回环隔离 | 核对规则并停止上线 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在隔离虚拟机建两测试账号 | 端口与权限可核对 |
| 验证 | 按租户测试文件与 HTTP/WS | 跨用户路径拒绝 |
| 退出 | 任一偏差停止部署 | 保留独立实例 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 网关与独立实例资源 | 配置系统与规则 | 耗时未测 |
| 持续 | 多进程与防火墙状态 | 管理用户、端口和凭据 | 实际人力未知 |
| 失败 | 维护备用独立环境 | 复核规则并隔离 | 重启和回退负担未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多用户入口 | 登录后映射指定实例 | 真实隔离与容量 |
| 文件读取 | helper 以租户账号读取 | 系统权限与复杂竞态 |

> **思考**：[Q03](#research-q03) 防火墙的自检只看链与挂钩，需要独立核对规则覆盖和真实访问。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将多实例身份、代理和 OS 账号下的文件操作编排到一个门户。

[Q02](#research-q02) 文件身份与网络规则分开约束。[Q03](#research-q03) 存在性检查不能代替有效规则核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 防火墙的自检只看链与挂钩，需要独立核对规则覆盖和真实访问。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在隔离 VM 检查实际跨租户访问，任何偏差都停止生产部署。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定网关、只读文件 helper 与回环规则。实际系统隔离和部署结果未验收。

- 已检查：作者 README、包清单、源码路径 gateway/server.js、bin/dsh-loopback-guard、bin/dsh-file-read、units/dsh-loopback-guard.service、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根部署工程，只核查网关代理、下载 helper 和 IPv4 回环规则。未对全量认证、上传、反代及系统安全做运行验收。
- 下一步：在独立 Linux VM 验证两用户的实例、门户、文件和重启矩阵，再核对配置漂移。

**分析版本**

- **仓库**：[AnkoCD/dsh-server-deployment](https://github.com/AnkoCD/dsh-server-deployment)
- **版本号**：未声明（[固定提交 c6a6f12](https://github.com/AnkoCD/dsh-server-deployment/tree/c6a6f120bc44199a6f2736714900e636ea3c7419)）
- **版本日期**：2026-08-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在发布前对账配置、监听和实际规则，可测试能否及早发现隔离漂移。

在独立 Linux VM 验证两用户的实例、门户、文件和重启矩阵，再核对配置漂移。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 2376 | 2022 | 250 | — |
| .md | source | 4 | 411 | — | — | 7731 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-11），可前往 [GitHub Issues](https://github.com/AnkoCD/dsh-server-deployment/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护多用户 DSH Web 的管理员能否核对门户路由、文件访问与租户回环隔离的实际前提？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多用户门户给管理员增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

管理员想让多位用户从同一入口访问各自的 DSH 进程，并交付个人工作文件。每用户单独域名或手工 SSH 可提供访问，项目把登录、实例端口和文件入口组合起来。合格结果是各用户只访问自己的进程与目录，且跨租户拒绝可独立复测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-16](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/README.md#L9-L16)

作者说明门户、独立实例及 OS 账号。

```text
为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）Web 端增加**多用户门户**的零依赖 Node 网关：登录认证、每用户独立 DSH 实例与 OS 级数据隔离、每用户独立 API Key，以及内置的**交付文件抽屉**（下载 / 上传 / 当前工作区自动定位）。隔离以 **OS 账号为边界**而非网关代码——文件访问经 sudo 助手 `runuser` 降权为 `dsh-<name>` 用户执行（修复 issue #1 TOCTOU 竞态），网关对用户目录零权限；完整机制见 [docs/multi-user-isolation.md](docs/multi-user-isolation.md)。

> **部署定位（重要）**：本项目是**服务器端部署**方案——网关、每用户 DSH 实例与文件助手全部运行在**远程服务器**上，多个用户通过浏览器（公网域名 + HTTPS）访问各自的会话与交付文件；它**不是本机 / 桌面工具**，**无需在用户电脑上安装任何软件**。文档中的示例路径（如 `/opt/deepseek-harness`、`/etc/systemd/system`）均为服务器端路径。

## 特性

- **登录门户**：自研暗色登录页（漆面 + 金箔风格），scrypt 口令（兼容旧版 APR1）、HMAC 签名会话 Cookie（HttpOnly / Secure / SameSite=Lax）、登录限流（IP + 账号两级）、CSRF 双提交校验。
- **用户隔离**：每个用户一个独立 DSH 实例（独立端口），以独立系统账号 `dsh-<name>` 运行，`DSH_HOME` 指向其 0700 私有目录；`userctl.js` 一条命令完成建号 / 改密 / 删号 / 预置 Key。
```

**依据 2 · 源码核查**：[gateway/server.js:1430-1448](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/gateway/server.js#L1430-L1448)

从登录会话查用户端口并代理 HTTP/WS。

<details>
<summary>查看原文（19行）</summary>

```text
  if (!hasKey(session.u)) {
    if (req.method === 'GET' && !pathname.startsWith('/api/')) return redirect(res, '/setup');
    return json(res, 403, { ok: false, error: '请先配置 API Key', redirect: '/setup' });
  }
  const u = getUser(session.u);
  if (!u || !u.port) {
    clearSession(res);
    return json(res, 401, { ok: false, error: '账号不可用' });
  }
  proxyRequest(req, res, u.port, session.u);
}

server.on('upgrade', (req, socket, head) => {
  const session = getSession(req);
  if (!session) { socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n'); socket.destroy(); return; }
  if (!hasKey(session.u)) { socket.write('HTTP/1.1 403 Forbidden\r\n\r\n'); socket.destroy(); return; }
  const u = getUser(session.u);
  if (!u || !u.port) { socket.destroy(); return; }
  proxyUpgrade(req, socket, head, u.port);
```

</details>

#### 缺口

- 未执行任何真实部署。
  **影响**：不能认定源设计达到生产隔离。
  **进一步探讨**：在独立 Linux 环境用两合成用户核对访问矩阵。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 门户如何把请求限制到用户数据？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

登录后的普通 HTTP 和升级请求都按 session.u 查到对应实例端口。下载入口调用受控 sudo helper；helper 做路径和名字检查，再用 runuser 以对应 OS 用户读取。文件边界仍取决于实际 OS 权限。回环防护另用 UID 与目的 TCP 端口规则，允许本实例、拒绝其他租户端口及网关。

#### 证据与依据

**依据 1 · 源码核查**：[gateway/server.js:1430-1448](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/gateway/server.js#L1430-L1448)

会话、账号及端口路由。

<details>
<summary>查看原文（19行）</summary>

```text
  if (!hasKey(session.u)) {
    if (req.method === 'GET' && !pathname.startsWith('/api/')) return redirect(res, '/setup');
    return json(res, 403, { ok: false, error: '请先配置 API Key', redirect: '/setup' });
  }
  const u = getUser(session.u);
  if (!u || !u.port) {
    clearSession(res);
    return json(res, 401, { ok: false, error: '账号不可用' });
  }
  proxyRequest(req, res, u.port, session.u);
}

server.on('upgrade', (req, socket, head) => {
  const session = getSession(req);
  if (!session) { socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n'); socket.destroy(); return; }
  if (!hasKey(session.u)) { socket.write('HTTP/1.1 403 Forbidden\r\n\r\n'); socket.destroy(); return; }
  const u = getUser(session.u);
  if (!u || !u.port) { socket.destroy(); return; }
  proxyUpgrade(req, socket, head, u.port);
```

</details>

**依据 2 · 源码核查**：[gateway/server.js:1275-1294](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/gateway/server.js#L1275-L1294)

文件 stat 和受控 helper 启动。

<details>
<summary>查看原文（20行）</summary>

```text
        const r = await runHelper([FILE_STAT_HELPER, home, abs], { maxStdout: 1024 * 1024 });
        if (r.code === 3) return json(res, 403, { ok: false, error: '路径超出你的工作区' });
        if (r.code === 5) return json(res, 403, { ok: false, error: '不允许下载隐藏文件' });
        if (r.code !== 0) return json(res, 404, { ok: false, error: '文件不存在' });
        size = parseInt(r.stdout.trim(), 10);
        if (!Number.isFinite(size)) size = -1;
      }
      const ascii = base.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_') || 'download';
      secHeaders(res);
      const head = {
        'Content-Type': dlContentType(base),
        'Content-Disposition': 'attachment; filename="' + ascii + '"; filename*=UTF-8\'\'' + encodeURIComponent(base),
        'Cache-Control': 'no-store',
      };
      if (size >= 0) head['Content-Length'] = String(size);
      const child = spawn('sudo', ['-n', FILE_READ_HELPER, home, abs], { stdio: ['ignore', 'pipe', 'ignore'] });
      let started = false;
      let throttled = false;
      child.stdout.on('data', (c) => {
        if (!started) { res.writeHead(200, head); started = true; }
```

</details>

**依据 3 · 源码核查**：[bin/dsh-file-read:9-27](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/bin/dsh-file-read#L9-L27)

路径检查及以租户账号执行实际读取。

<details>
<summary>查看原文（19行）</summary>

```text
set -euo pipefail
home="$1"
path="$2"
[ -n "$home" ] && [ -n "$path" ] || exit 2
name="$(basename "$path")"
case "$name" in .*) exit 5 ;; esac
osu="dsh-$(printf '%s' "$(basename "$home")" | tr 'A-Z' 'a-z')"
case "$osu" in
  dsh-?*) ;;
  *) exit 3 ;;
esac
case "$osu" in
  *[!a-z0-9_-]*) exit 3 ;;
esac
hd="$(realpath "$home")" || exit 3
pd="$(realpath "$path")" || exit 4
case "$pd" in "$hd"|"$hd"/*) ;; *) exit 3 ;; esac
[ -f "$pd" ] || exit 4
exec runuser -u "$osu" -- cat "$pd"
```

</details>

**依据 4 · 源码核查**：[bin/dsh-loopback-guard:75-105](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/bin/dsh-loopback-guard#L75-L105)

UID 和目标端口规则及提交。

<details>
<summary>查看原文（31行）</summary>

```text
  {
    echo '*filter'
    echo ":$CHAIN - [0:0]"
    for spec in "${specs[@]}"; do
      user="${spec%%:*}"
      port="${spec##*:}"
      # own instance port: allow (both directions of the flow match by dport
      # here because replies come from sport; the REJECT rules below are the
      # only destination-scoped denials)
      echo "-A $CHAIN -o lo -p tcp -m owner --uid-owner $user --dport $port -m comment --comment $comment -j ACCEPT"
    done
    for spec in "${specs[@]}"; do
      user="${spec%%:*}"
      port="${spec##*:}"
      # every OTHER tenant's instance port: rejected by destination
      # (rule count is O(n^2); fine for dozens of tenants - switch to an
      # ipset dport set if this ever becomes a problem)
      for other in "${specs[@]}"; do
        oport="${other##*:}"
        if [ "$oport" != "$port" ]; then
          echo "-A $CHAIN -o lo -p tcp -m owner --uid-owner $user --dport $oport -m comment --comment $comment -j REJECT --reject-with tcp-reset"
        fi
      done
      # the gateway itself: a tenant reaching it loopback could spoof another
      # user's session through the auth front door
      echo "-A $CHAIN -o lo -p tcp -m owner --uid-owner $user --dport $GW_PORT -m comment --comment $comment -j REJECT --reject-with tcp-reset"
    done
    echo "-A $CHAIN -m comment --comment $comment -j RETURN"
    echo 'COMMIT'
  } | iptables-restore --noflush
  hook_output
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 防火墙自检能否证明租户隔离？

**研究主题**：缺陷与关键质疑

#### 完整回答

脚本的 --check 只验证链存在且 OUTPUT 有挂钩，不读取实际用户和端口规则是否完整。部署单元另提供启动、停止和重建，规则只匹配 IPv4 回环 TCP 与列出的端口。因而即使自检成功，也要核对当前用户、真实实例绑定、规则和从租户身份发出的访问结果。文件权限还取决于 OS 账号、sudo 与目录权限。

#### 证据与依据

**依据 1 · 源码核查**：[bin/dsh-loopback-guard:29-32](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/bin/dsh-loopback-guard#L29-L32)

IPv4 和其他本机服务边界。

```text
# Notes:
# - IPv4 only: the instances bind 127.0.0.1; ::1 has no listener.
# - Tenant agents that legitimately need another local TCP service will pass;
#   extend the REJECT list per service if that ever changes.
```

**依据 2 · 源码核查**：[bin/dsh-loopback-guard:84-116](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/bin/dsh-loopback-guard#L84-L116)

具体规则及仅检查存在的 --check。

<details>
<summary>查看原文（33行）</summary>

```text
      echo "-A $CHAIN -o lo -p tcp -m owner --uid-owner $user --dport $port -m comment --comment $comment -j ACCEPT"
    done
    for spec in "${specs[@]}"; do
      user="${spec%%:*}"
      port="${spec##*:}"
      # every OTHER tenant's instance port: rejected by destination
      # (rule count is O(n^2); fine for dozens of tenants - switch to an
      # ipset dport set if this ever becomes a problem)
      for other in "${specs[@]}"; do
        oport="${other##*:}"
        if [ "$oport" != "$port" ]; then
          echo "-A $CHAIN -o lo -p tcp -m owner --uid-owner $user --dport $oport -m comment --comment $comment -j REJECT --reject-with tcp-reset"
        fi
      done
      # the gateway itself: a tenant reaching it loopback could spoof another
      # user's session through the auth front door
      echo "-A $CHAIN -o lo -p tcp -m owner --uid-owner $user --dport $GW_PORT -m comment --comment $comment -j REJECT --reject-with tcp-reset"
    done
    echo "-A $CHAIN -m comment --comment $comment -j RETURN"
    echo 'COMMIT'
  } | iptables-restore --noflush
  hook_output
}

case "${1:-}" in
  --apply)
    shift
    [ "$#" -ge 1 ] || { echo "usage: $0 --apply <osuser>:<port> ..." >&2; exit 2; }
    apply_rules "$@"
    echo "loopback guard applied to $*"
    ;;
  --check)
    ipt -L "$CHAIN" >/dev/null 2>&1 && ipt -C OUTPUT -o lo -p tcp -j "$CHAIN" 2>/dev/null
```

</details>

**依据 3 · 源码核查**：[units/dsh-loopback-guard.service:9-17](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/units/dsh-loopback-guard.service#L9-L17)

规则服务启动与移除。

```text
# 规则基于 users.json 的用户/端口映射，需在用户实例启动前生效
Before=dsh-web-*.service

[Service]
Type=oneshot
Environment=USERS_FILE=/opt/deepseek-harness/gateway/users.json
ExecStart=/opt/deepseek-harness/bin/dsh-loopback-guard-apply
RemainAfterExit=yes
ExecStop=/opt/deepseek-harness/bin/dsh-loopback-guard --remove
```

**依据 4 · 源码核查**：[bin/dsh-file-read:23-27](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/bin/dsh-file-read#L23-L27)

路径检查后依赖租户权限。

```text
hd="$(realpath "$home")" || exit 3
pd="$(realpath "$path")" || exit 4
case "$pd" in "$hd"|"$hd"/*) ;; *) exit 3 ;; esac
[ -f "$pd" ] || exit 4
exec runuser -u "$osu" -- cat "$pd"
```

#### 缺口

- 没有真实 iptables、sudo 和反代组合实验。
  **影响**：无依据承诺用户新增、重启或配置漂移仍隔离。
  **进一步探讨**：在两账户的隔离 VM 逐项测试本人、他人、网关及文件路径。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样评估部署代价和退出条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

熟悉 Linux 用户、systemd、反代与防火墙的管理员，可以先在抛弃式 VM 观察两名测试用户的访问矩阵。部署需 root 配置、独立账号和端口、反代及规则持久化，持续要核对端口、权限和更新。任何跨用户访问、规则与配置不符或重启后状态漂移，都应阻止上线，保留单用户隔离环境。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:33-33](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/README.md#L33-L33)

作者说明端口与反代同步。

```text
> 网关默认端口为 **3100**（`server.js` 默认值、systemd 单元与 nginx 示例已统一；可用环境变量 `PORT` 覆盖，覆盖后需同步反代配置——回环防护会自动读取网关启动时写入的 `state-port.json`，无需手动改 `GW_PORT`）；每用户实例自 3101 递增，由 `userctl` 分配。
```

**依据 2 · 作者声明**：[README.md:56-59](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/README.md#L56-L59)

作者部署与建号流程。

```text
## 快速部署（概览）

1. 安装 DSH（npm 包）并准备 Node 运行时；按 `units/` 配置网关 systemd 服务（`User=<服务账号>`，仅监听 127.0.0.1）。
2. 用 `sudo bin/dsh-users.sh add <用户>` 建号（自动创建 OS 账号、分配端口、生成并启动实例）。
```

**依据 3 · 源码核查**：[bin/dsh-loopback-guard:70-116](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/bin/dsh-loopback-guard#L70-L116)

配置加载与自检边界。

<details>
<summary>查看原文（47行）</summary>

```text
  # Build the whole ruleset and load it with iptables-restore --noflush:
  # a chain declared in the restore stream is flushed and refilled in ONE
  # commit, so there is no gap between "flush old rules" and "add new
  # rules" where tenant isolation would be down (the old per-rule -F/-A
  # sequence had exactly that window on every userctl refresh).
  {
    echo '*filter'
    echo ":$CHAIN - [0:0]"
    for spec in "${specs[@]}"; do
      user="${spec%%:*}"
      port="${spec##*:}"
      # own instance port: allow (both directions of the flow match by dport
      # here because replies come from sport; the REJECT rules below are the
      # only destination-scoped denials)
      echo "-A $CHAIN -o lo -p tcp -m owner --uid-owner $user --dport $port -m comment --comment $comment -j ACCEPT"
    done
    for spec in "${specs[@]}"; do
      user="${spec%%:*}"
      port="${spec##*:}"
      # every OTHER tenant's instance port: rejected by destination
      # (rule count is O(n^2); fine for dozens of tenants - switch to an
      # ipset dport set if this ever becomes a problem)
      for other in "${specs[@]}"; do
        oport="${other##*:}"
        if [ "$oport" != "$port" ]; then
          echo "-A $CHAIN -o lo -p tcp -m owner --uid-owner $user --dport $oport -m comment --comment $comment -j REJECT --reject-with tcp-reset"
        fi
      done
      # the gateway itself: a tenant reaching it loopback could spoof another
      # user's session through the auth front door
      echo "-A $CHAIN -o lo -p tcp -m owner --uid-owner $user --dport $GW_PORT -m comment --comment $comment -j REJECT --reject-with tcp-reset"
    done
    echo "-A $CHAIN -m comment --comment $comment -j RETURN"
    echo 'COMMIT'
  } | iptables-restore --noflush
  hook_output
}

case "${1:-}" in
  --apply)
    shift
    [ "$#" -ge 1 ] || { echo "usage: $0 --apply <osuser>:<port> ..." >&2; exit 2; }
    apply_rules "$@"
    echo "loopback guard applied to $*"
    ;;
  --check)
    ipt -L "$CHAIN" >/dev/null 2>&1 && ipt -C OUTPUT -o lo -p tcp -j "$CHAIN" 2>/dev/null
```

</details>

**依据 4 · 源码核查**：[units/dsh-loopback-guard.service:9-17](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/units/dsh-loopback-guard.service#L9-L17)

系统服务条件。

```text
# 规则基于 users.json 的用户/端口映射，需在用户实例启动前生效
Before=dsh-web-*.service

[Service]
Type=oneshot
Environment=USERS_FILE=/opt/deepseek-harness/gateway/users.json
ExecStart=/opt/deepseek-harness/bin/dsh-loopback-guard-apply
RemainAfterExit=yes
ExecStop=/opt/deepseek-harness/bin/dsh-loopback-guard --remove
```

#### 缺口

- 管理开销和异常恢复未测。
  **影响**：无法评价组织是否能持续维护。
  **进一步探讨**：比较两租户创建、轮换、删除和重启的实际工作量。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 规则对账门能否发现配置漂移？

**研究主题**：新假设与验证

#### 完整回答

可试验对当前用户表和有效监听生成预期规则，读回实际规则，并在任一偏差或访问矩阵不符时拒绝发布网关。现有存在性检查提供基线。用缺租户规则、迁移端口和失效挂钩做对照，测漏检、误拒和恢复时长。如果配置源无法与监听可靠对齐，仍应人工核对。

#### 证据与依据

**依据 1 · 源码核查**：[bin/dsh-loopback-guard:75-116](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/bin/dsh-loopback-guard#L75-L116)

配置生成与现有检查可作为比较。

<details>
<summary>查看原文（42行）</summary>

```text
  {
    echo '*filter'
    echo ":$CHAIN - [0:0]"
    for spec in "${specs[@]}"; do
      user="${spec%%:*}"
      port="${spec##*:}"
      # own instance port: allow (both directions of the flow match by dport
      # here because replies come from sport; the REJECT rules below are the
      # only destination-scoped denials)
      echo "-A $CHAIN -o lo -p tcp -m owner --uid-owner $user --dport $port -m comment --comment $comment -j ACCEPT"
    done
    for spec in "${specs[@]}"; do
      user="${spec%%:*}"
      port="${spec##*:}"
      # every OTHER tenant's instance port: rejected by destination
      # (rule count is O(n^2); fine for dozens of tenants - switch to an
      # ipset dport set if this ever becomes a problem)
      for other in "${specs[@]}"; do
        oport="${other##*:}"
        if [ "$oport" != "$port" ]; then
          echo "-A $CHAIN -o lo -p tcp -m owner --uid-owner $user --dport $oport -m comment --comment $comment -j REJECT --reject-with tcp-reset"
        fi
      done
      # the gateway itself: a tenant reaching it loopback could spoof another
      # user's session through the auth front door
      echo "-A $CHAIN -o lo -p tcp -m owner --uid-owner $user --dport $GW_PORT -m comment --comment $comment -j REJECT --reject-with tcp-reset"
    done
    echo "-A $CHAIN -m comment --comment $comment -j RETURN"
    echo 'COMMIT'
  } | iptables-restore --noflush
  hook_output
}

case "${1:-}" in
  --apply)
    shift
    [ "$#" -ge 1 ] || { echo "usage: $0 --apply <osuser>:<port> ..." >&2; exit 2; }
    apply_rules "$@"
    echo "loopback guard applied to $*"
    ;;
  --check)
    ipt -L "$CHAIN" >/dev/null 2>&1 && ipt -C OUTPUT -o lo -p tcp -j "$CHAIN" 2>/dev/null
```

</details>

**依据 2 · 源码核查**：[gateway/server.js:1434-1448](https://github.com/AnkoCD/dsh-server-deployment/blob/c6a6f120bc44199a6f2736714900e636ea3c7419/gateway/server.js#L1434-L1448)

网关路由取当前用户端口。

<details>
<summary>查看原文（15行）</summary>

```text
  const u = getUser(session.u);
  if (!u || !u.port) {
    clearSession(res);
    return json(res, 401, { ok: false, error: '账号不可用' });
  }
  proxyRequest(req, res, u.port, session.u);
}

server.on('upgrade', (req, socket, head) => {
  const session = getSession(req);
  if (!session) { socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n'); socket.destroy(); return; }
  if (!hasKey(session.u)) { socket.write('HTTP/1.1 403 Forbidden\r\n\r\n'); socket.destroy(); return; }
  const u = getUser(session.u);
  if (!u || !u.port) { socket.destroy(); return; }
  proxyUpgrade(req, socket, head, u.port);
```

</details>

#### 缺口

- 未实现对账门或做运行实验。
  **影响**：检测改善和操作负担未知。
  **进一步探讨**：在隔离 VM 构造漂移并验证实际租户请求。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
