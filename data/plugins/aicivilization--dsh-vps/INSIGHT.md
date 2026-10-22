# dsh-vps

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d4223e0](https://github.com/AIcivilization/dsh-vps/tree/d4223e07717dce3832d0233a6a12edfceb3fde27)

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/AIcivilization/dsh-vps)
<!-- END META -->

> **实现功能**：为自有 VPS 部署带登录网关、HTTPS 和服务管理的 DSH。

> **核心亮点**：把公网 DSH 部署、登录代理、受信任会话转译和服务器管理打包成连续流程；相对手工反代、认证、systemd 拼装有交付便利，具体增量与未验收边界见[Q01](#research-q01)及[Q02](#research-q02)。

> **风险与缺陷**：辅助文件默认main漂移，setup.lock未建立且令牌缺失/不可读时向导退回开放；卸载tar失败但部分备份仍可chmod成功时可能继续删除，不保证备份可恢复。均为有条件静态核查，未作公网攻击或删除复现。详见[Q03](#research-q03)。

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
  - [Q01 · 自有 VPS 远程使用 DSH 的合格交付是什么，现版新增了什么？](#detail-section-11)
  - [Q02 · 安装、认证和更新的机制及关键环境条件是什么？](#detail-section-12)
  - [Q03 · 哪个前提最可能使“安全且可恢复的公网管理”失效？](#detail-section-13)
  - [Q04 · 同一合格的远程管理任务，三阶段现金与人工成本如何计算，是否值得采用？](#detail-section-14)
  - [Q05 · 从现版增量与失效边界可推导什么新方案，怎样证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有 Linux VPS 且需要公网浏览器访问 DSH 完整管理界面的个人/小团队。

手工 VPS 以 Caddy+身份代理+systemd 或私有隧道也能远程访问；此项整合 DSH 受信任会话与部署流程，未证实比可控手工基线更安全或省成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| SSH 安装 | 在本机 DSH 配置远端 VPS | SSH/root、网络与远端脚本源 |
| 登录网关 | 公网 Web 会话进入 DSH | 首次设置令牌和管理员状态需保护 |
| 更新/备份/回滚 | 运维服务 | 须真实恢复验收 |

**流程与依赖**

| 类型 | 条件 | 边界 |
| --- | --- | --- |
| 宿主 | DSH connection.fetch、可选 pluginManager/desktopActions | 缺服务时相关按钮/API 不可用 |
| VPS | Linux root/apt/systemd、Node 22、SSH | 需独立验系统版本 |
| 网络 | DNS 或公网 IP、80/443、安全组、Caddy 证书 | 自签 IP 过渡需浏览器确认 |

| 步骤 | 动作 | 核验 |
| --- | --- | --- |
| 准备 | 备份、固定提交/依赖、配置 VPS/域名/SSH | DNS/入站/源材料核对 |
| 安装 | 插件表单或远端脚本，设置管理员 | 查服务/日志与令牌 |
| 验收 | 登录、设置、市场、重启/备份恢复 | 同版本真实任务记录 |

**效果与成本**

| 阶段 | 现金/资源 | 人工/时间 | 未知与恢复 |
| --- | --- | --- | --- |
| 首次 | VPS、域名、网络、存储、模型 API，均缺报价/用量 | DNS/SSH/防火墙、管理员与功能验收，未计时 | 固定版本和令牌缺失风险须核 |
| 持续 | 主机、流量、备份空间、模型 API，金额未知 | 升级、补丁、日志和备份核验，工时未知 | 漂移下载/宿主兼容需监控 |
| 失败恢复 | 重试资源、额外备份/主机与模型重试，金额未知 | 查远端日志、确认后台作业、恢复数据/回滚，工时未知 | tar 失败仍卸载，须先独立验证备份 |

| 交付 | 预期效果 | 已核边界 |
| --- | --- | --- |
| HTTPS 登录网关 | 远程管理完整 DSH | 仅源码路径，未运行宿主 |
| SSH 安装/运维 | 减少初装拼接 | DNS、SSH、依赖、恢复仍人工 |
| 备份/回滚 | 降低故障损失 | 卸载备份失败可继续删除 |

> **思考**：辅助文件默认main漂移，setup.lock未建立且令牌缺失/不可读时向导退回开放；卸载tar失败但部分备份仍可chmod成功时可能继续删除，不保证备份可恢复。均为有条件静态核查，未作公网攻击或删除复现。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把公网 DSH 部署、登录代理、受信任会话转译和服务器管理打包成连续流程；相对手工反代、认证、systemd 拼装有交付便利，具体增量与未验收边界见[Q01](#research-q01)及[Q02](#research-q02)。

把公网 DSH 部署、登录代理、受信任会话转译和服务器管理打包成连续流程；相对手工反代、认证、systemd 拼装有交付便利，具体增量与未验收边界见[Q01](#research-q01)及[Q02](#research-q02)。

gate 分离公网登录和 DSH 服务端 Cookie，HTTP/WS 代理、登录签名与进程监督有实装；但 setup.token 缺失默认开放，远端源文件未随提交固定，卸载不是备份成功后才删除。

<a id="detail-section-5"></a>

### 1.4 主要限制

辅助文件默认main漂移，setup.lock未建立且令牌缺失/不可读时向导退回开放；卸载tar失败但部分备份仍可chmod成功时可能继续删除，不保证备份可恢复。均为有条件静态核查，未作公网攻击或删除复现。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在隔离 VPS 钉所有文件来源、演练令牌缺失/备份失败/回滚，并对照原生隧道或手工部署；正式公网持续采用需独立安全及恢复验收。 具体采用条件见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

部署/网关机制有固定源码支持；公网安全、兼容、完整功能及恢复结果未经本轮运行证实。创新假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、plugin/index.mjs、plugin/remote-install.mjs、install.sh、uninstall.sh、gate/server.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 SHA 静态审阅 package、README、插件安装、安装/卸载、gate 路由；未运行目标宿主/公网 VPS、未做安全测试或账单对照。
- 下一步：隔离 VPS 钉所有下载源并做安装/登录/设置/市场、token 文件丢失、下载漂移、tar 失败与回滚注入；对照手工基线记录合格实例、现金和人工。

**分析版本**

- **仓库**：[AIcivilization/dsh-vps](https://github.com/AIcivilization/dsh-vps)
- **版本号**：1.16.1（[固定提交 d4223e0](https://github.com/AIcivilization/dsh-vps/tree/d4223e07717dce3832d0233a6a12edfceb3fde27)）
- **版本日期**：2026-10-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

基于网关交付增量和令牌/供应链/备份反例，提出未验证的可验证部署清单、封闭首次注册和恢复闸门组合；相对现版增加哈希钉住及失败拒绝，也增加维护和救援负担。故障注入对照与否定条件见[Q05](#research-q05)。

隔离 VPS 钉所有下载源并做安装/登录/设置/市场、token 文件丢失、下载漂移、tar 失败与回滚注入；对照手工基线记录合格实例、现金和人工。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 693 | — | — | 7872 |
| .js | source | 3 | 5860 | 4592 | 580 | — |
| .mjs | source | 5 | 697 | 583 | 69 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-vps/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-vps/issues?q=is%3Aissue+created%3A2026-09-22T08%3A51%3A38.013Z..2026-10-22T08%3A51%3A38.013Z) [![近30天关闭 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/AIcivilization/dsh-vps/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T08%3A51%3A38.013Z..2026-10-22T08%3A51%3A38.013Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**固定版本 dsh-vps 是否能把 DSH 可靠地交付为可远程管理、可安全恢复的自托管服务，价值与代价相对手工方案如何？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 自有 VPS 远程使用 DSH 的合格交付是什么，现版新增了什么？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

用户在自有 Linux VPS 上需要从公网浏览器访问 DSH 的完整 Web 管理界面，而不是只转发对话端口。作者将安装脚本、Caddy HTTPS、systemd、登录网关和 DSH 插件设置页打包；插件可在本机 DSH 填 SSH 信息启动远端安装，服务器上的 gate 登录后代理 DSH，并用服务端交换的 DSH 会话 Cookie 支撑受信任界面。对照手工部署 Caddy/认证代理/服务监督的办法，增量是把部署、入口登录及设置管理连成一个流程，基础代理、HTTPS、systemd 并非新发明。合格交付至少需要域名或公网 IP 可访问、管理员注册、登录后管理操作可用、重启和备份恢复可核。固定源码仅证明流程设计，README 所述“全功能”未在本轮宿主实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:42-71](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/README.md#L42-L71)

作者定义公网完整 Web 与打包功能。

<details>
<summary>查看原文（30行）</summary>

```text
## 简介

[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（DSH）默认只认本机浏览器：它的特权接口（设置、API Key、插件管理）受浏览器信任围栏保护，直接反代到公网后这些页面全部失效。

dsh-vps 用一个零运行时依赖的登录网关（dsh-gate）架在 DSH 前面：公网请求先过 scrypt 登录门，再由网关以服务端身份完成 DSH 会话认证并透传。你在任何地方打开浏览器，用的都是官方原版的 DSH Web 界面，设置、模型、API Key、插件市场该有的都有。

DeepSeek Harness (DSH) trusts the operator's own browser only: its privileged interfaces — settings, API keys, plugin management — sit behind a browser-trust fence, and a plain reverse proxy to the public internet leaves those pages dead.

dsh-vps puts a zero-dependency login gateway (dsh-gate) in front of DSH: public requests pass a scrypt login gate first, then the gateway performs DSH session authentication server-side and proxies the rest. You open a browser anywhere and get the stock DSH web interface — settings, models, API keys and the plugin marketplace all working.

---

## 能力一览

| 能力 | 说明 |
| --- | --- |
| 两种装法 | 在自己电脑上的 DSH 里填表、点一下安装（Mac / Windows / Linux）；或在 VPS 上执行一条 `curl \| bash`。装完即 systemd 托管、开机自启 |
| 登录门 | scrypt 口令 + HMAC 会话 Cookie + 登录限流；「保持登录」默认勾选，30 天内免登录；「设置 → VPS 部署 → 本机状态」里可修改密码（需当前密码，改后其他设备自动退出） |
| 添加到手机桌面 | 「设置 → VPS 部署 → 本机状态」里扫码，在手机上把 DSH 当作应用添加到主屏幕，全屏打开、像原生应用一样使用 |
| 浏览器初始向导 | 管理员账号、域名、DeepSeek API Key、预置插件，全程在浏览器里填完 |
| 中英双语 | 登录页、初始向导、启动等待页按浏览器语言显示中文或英文，右上角可手动切换并记住；DSH 内的「VPS 部署」页与升级提示条跟随 DSH 的语言设置 |
| 一次性启动令牌 | 向导只对持有令牌的人开放，链接随安装输出，`dsh-vps setup-url` 可重取，设置完成即作废 |
| 预置插件一键装 | 向导内置 3 款：本产品的设置页 dsh-vps（必装），以及插件市场与 VPS 管理（默认勾选、可取消）；后台装完自动重启生效 |
| 自动 HTTPS | Caddy 自动签发并续期证书；向导里改域名即时热加载 |
| 公网可用的原生设置页 | 设置、模型、API Key、权限策略在公网域名下照常读写 |
| 插件市场可用 | 市场里浏览/安装插件，点「立即重启」直接生效 |
| 会话自愈 | DSH 首启与插件安装需要几十秒，页面自动等待，就绪后自动进入 |
| 跟随官方一键升级 | DSH 出新版本时页面提示，在「设置 → VPS 部署」里点一下升级；升级走备份 → 自检 → 失败自动回滚，也可随时手动回滚 |
| 可观测与可恢复 | 本机 `/gate/health` 直接给出崩溃原因与连续崩溃次数；`dsh-vps backup` 保留最近 3 份 |
| 收紧的暴露面 | 会话 Cookie 恒为 Secure/HttpOnly/SameSite；诊断接口只对服务器本机与已登录会话开放；服务以无特权的 dsh 用户运行并受 systemd 沙箱约束 |
```

</details>

**依据 2 · 源码核查**：[plugin/index.mjs:25-67](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/plugin/index.mjs#L25-L67)

本机插件注册远程安装接口。

<details>
<summary>查看原文（43行）</summary>

```text
export function apply(ctx) {
  // 可选宿主服务：pluginManager（装新版，DSH「插件」页同一套）、desktopActions（DSH Desktop 才有，一键重启）
  const deps = { pluginManager: undefined, desktopActions: undefined }
  ctx.inject(['pluginManager'], (pmCtx) => {
    const manager = pmCtx.pluginManager ?? pmCtx.get?.('pluginManager')
    deps.pluginManager = manager
    pmCtx.effect(() => () => {
      if (deps.pluginManager === manager) deps.pluginManager = undefined
    }, 'dsh-vps: plugin manager')
  })
  ctx.inject(['desktopActions'], (dCtx) => {
    const actions = dCtx.desktopActions
    deps.desktopActions = actions
    dCtx.effect(() => () => {
      if (deps.desktopActions === actions) deps.desktopActions = undefined
    }, 'dsh-vps: desktop actions')
  })

  ctx.inject(['connection'], (connCtx) => {
    const fetchApi = connCtx.connection?.fetch
    if (!fetchApi || typeof fetchApi.register !== 'function') return
    const installer = createInstaller()
    connCtx.effect(() => () => installer.dispose(), 'dsh-vps: installer')
    try {
      fetchApi.register({
        path: INSTALL_PATH,
        methods: ['GET', 'POST'],
        requestBody: 'buffered',
        fetch: async (request) => {
          if (request.method === 'GET') return json(installer.snapshot())
          let body
          try {
            body = await request.json()
          } catch {
            return json({ error: '请求格式不对' }, 400)
          }
          const checked = validateRequest(body)
          if (checked.error) return json({ error: checked.error }, 400)
          const result = await installer.start(checked.value)
          if (result.error) return json({ error: result.error }, result.status || 400)
          return json(result, 202)
        },
      })
```

</details>

**依据 3 · 源码核查**：[gate/server.js:665-692](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/gate/server.js#L665-L692)

网关在代理前剥离浏览器 DSH Cookie 并注入服务端 Cookie。

<details>
<summary>查看原文（28行）</summary>

```text
function applyDshCookie(setCookieLine) {
	const parsed = parseDshCookie(setCookieLine);
	if (!parsed) return;
	const { name, value, expiresAt } = parsed;
	dsh.cookie = { name, value, expiresAt, authority: authorityOf(dshTrustedHost) };
	dsh.cookieAcquired = true;
	dsh.lastExchangeError = null;
	dsh.lastError = null;
	dsh.crashStreak = 0;
	log(`dsh session cookie acquired (authority=${dsh.cookie.authority}, expires=${new Date(expiresAt).toISOString()})`);
	if (dsh.token) exchangeLoopback(dsh.token);
}

/** 构造发往 DSH 的 Cookie 头：剥离客户端的 dsh-auth-*（防伪）与 gate 自身会话，注入服务端 DSH Cookie（仅 authority 匹配时）。 */
function upstreamCookieHeader(clientCookieHeader, authority) {
	const parts = [];
	for (const [key, value] of Object.entries(parseCookies(clientCookieHeader))) {
		if (key === SESSION_COOKIE || key.startsWith(DSH_COOKIE_PREFIX)) continue;
		parts.push(`${key}=${value}`);
	}
	// 按请求实际发往的 authority 选会话：域名请求用域名的，改写成回环的插件市场请求用回环的
	for (const c of [dsh.cookie, dsh.loopCookie]) {
		if (c && authority !== void 0 && c.authority === authority && c.expiresAt > Date.now()) {
			parts.push(`${c.name}=${c.value}`);
			break;
		}
	}
	return parts.length ? parts.join("; ") : void 0;
```

</details>

**依据 4 · 源码核查**：[gate/server.js:2222-2276](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/gate/server.js#L2222-L2276)

管理登录门和请求路由。

<details>
<summary>查看原文（55行）</summary>

```text
	const server = http.createServer((req, res) => {
		const pathname = (req.url || "/").split("?")[0];
		Promise.resolve()
			.then(async () => {
				// 页面右上角的语言切换：记进 Cookie，再回到去掉 lang 参数的同一地址（向导令牌等其余参数保留）
				if ((req.method === "GET" || req.method === "HEAD") && /[?&]lang=(zh|en)(?:&|$)/.test(req.url || "")) {
					const url = new URL(req.url, "http://x");
					const chosen = url.searchParams.get("lang");
					url.searchParams.delete("lang");
					res.writeHead(303, {
						location: url.pathname + url.search,
						"set-cookie": `${LANG_COOKIE}=${chosen}; Max-Age=31536000; Path=/; SameSite=Lax`,
						"cache-control": "no-store",
					});
					res.end();
					return;
				}
				if (pathname === "/login") return handleLogin(req, res);
				if (pathname === "/logout") return handleLogout(req, res);
				if (pathname === "/gate/health") return handleHealthGuarded(req, res);
				if (pathname === "/gate/selfcheck") return handleSelfcheckGuarded(req, res);
				if (pathname === "/gate/ui.js") return handleUiJs(req, res);
				if (pathname === "/gate/apple-touch-icon.png") return handleAppleTouchIcon(req, res);
				if (pathname === "/setup") return handleSetup(req, res);
				if (!loadAdmin()) {
					// 尚未完成初始设置：浏览器导航导向导，/api 保持 401
					if (pathname.startsWith("/api")) {
						sendText(res, 401, "gate not configured");
						return;
					}
					if (setupOpen()) {
						// 绝不能在这里把令牌拼进跳转地址：此刻来访者尚未证明任何身份，
						// 带上令牌等于把管理员注册权发给整个公网。无令牌时 /setup 会显示「需要令牌」页。
						res.writeHead(303, { location: "/setup", "cache-control": "no-store" });
						res.end();
						return;
					}
					sendText(res, 503, "gate not configured: admin account missing (run `dsh-vps reset-admin`)");
					return;
				}
				const user = sessionUser(req);
				if (!user) {
					denyUnauthenticated(req, res, pathname);
					return;
				}
				if (pathname === "/gate/update") return handleUpdate(req, res, user);
				if (pathname === "/gate/password") return handlePassword(req, res, user);
				if (pathname === "/gate/domain") return handleDomain(req, res, user);
				if (pathname.startsWith(MARKET_PREFIX) && !marketRequestSameOrigin(req)) {
					sendText(res, 403, "cross-origin market request refused by gate");
					return;
				}
				if (TAKEOVER_RESTART && MARKET_RESTART_PATHS.has(pathname)) return handleMarketRestart(req, res, false);
				if (TAKEOVER_RESTART && MARKET_RESTART_V1_PATHS.has(pathname)) return handleMarketRestart(req, res, true);
				proxyHttp(req, res);
```

</details>

#### 缺口

- 缺同版本真实 VPS 端到端访问与管理操作验收。
  **影响：**无法确认完整界面和管理操作在目标环境可用。
  **进一步探讨：**隔离 VPS 对照原生隧道/手工反代完成安装、登录、设置和市场任务。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装、认证和更新的机制及关键环境条件是什么？

**研究主题：**功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

包导出 plugin/index.mjs 与 Web client；connection.fetch 可用时注册安装、SSH key、更新和重启 API，不可用时无这些接口。远程表单校验 host/port/user/认证材料，SSH 以 accept-new 连接并把 shell 脚本送到服务器，服务器下载 install.sh 并后台执行；连接中断后仍可能继续，界面要求读远端日志。服务器安装脚本要求 root、apt/systemd，安装 Node 22、DSH、Caddy、非特权 dsh 用户及 gate 服务；证书、域名 DNS、80/443 入站和模型 API Key 等仍由运维者处理。gate 以 scrypt 管管理员密码、HMAC 签会话，并在服务端持有 DSH Cookie；Cookie 注入和 HTML ownsHost 改写依赖 DSH 当前受信任 Host/页面机制，升级兼容性未经本轮验证。失败恢复要检查服务、日志、setup URL、备份与 rollback，不应盲目再发安装。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:34-53](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/package.json#L34-L53)

包入口和客户端/命令导出。

<details>
<summary>查看原文（20行）</summary>

```text
  "main": "./plugin/index.mjs",
  "exports": {
    ".": "./plugin/index.mjs",
    "./client": "./plugin/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    }
  },
  "bin": {
    "dsh-vps-install": "scripts/bootstrap.mjs"
```

</details>

**依据 2 · 源码核查**：[plugin/index.mjs:43-120](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/plugin/index.mjs#L43-L120)

可选宿主服务和 API 注册。

<details>
<summary>查看原文（78行）</summary>

```text
  ctx.inject(['connection'], (connCtx) => {
    const fetchApi = connCtx.connection?.fetch
    if (!fetchApi || typeof fetchApi.register !== 'function') return
    const installer = createInstaller()
    connCtx.effect(() => () => installer.dispose(), 'dsh-vps: installer')
    try {
      fetchApi.register({
        path: INSTALL_PATH,
        methods: ['GET', 'POST'],
        requestBody: 'buffered',
        fetch: async (request) => {
          if (request.method === 'GET') return json(installer.snapshot())
          let body
          try {
            body = await request.json()
          } catch {
            return json({ error: '请求格式不对' }, 400)
          }
          const checked = validateRequest(body)
          if (checked.error) return json({ error: checked.error }, 400)
          const result = await installer.start(checked.value)
          if (result.error) return json({ error: result.error }, result.status || 400)
          return json(result, 202)
        },
      })
    } catch (error) {
      ctx.logger?.warn?.(`[dsh-vps] 安装接口注册失败：${error?.message ?? error}`)
    }
    // 本机专用 SSH 密钥：GET 取公钥（没有则 publicKey 为 null），POST 生成。私钥不出这台机器
    try {
      fetchApi.register({
        path: SSHKEY_PATH,
        methods: ['GET', 'POST'],
        requestBody: 'buffered',
        fetch: async (request) => {
          const r = request.method === 'POST' ? await generateLocalKey() : await readLocalKey()
          return json({ publicKey: r.publicKey, ...(r.error ? { error: r.error } : {}) }, r.error ? 500 : 200)
        },
      })
    } catch (error) {
      ctx.logger?.warn?.(`[dsh-vps] 密钥接口注册失败：${error?.message ?? error}`)
    }
    // 插件自己的更新：GET 查（?force=1 马上重查），POST { version } 装
    try {
      fetchApi.register({
        path: UPDATE_PATH,
        methods: ['GET', 'POST'],
        requestBody: 'buffered',
        fetch: async (request) => {
          if (request.method === 'GET') {
            const force = new URL(request.url).searchParams.get('force') === '1'
            const info = await checkUpdate({ force })
            return json({ ...info, canInstall: typeof deps.pluginManager?.installBundle === 'function', canRestart: Boolean(deps.desktopActions) })
          }
          let body
          try {
            body = await request.json()
          } catch {
            return json({ error: 'bad_request' }, 400)
          }
          const result = await runUpdate({ pluginManager: deps.pluginManager, version: body?.version })
          return json({ ...result, canRestart: Boolean(deps.desktopActions) })
        },
      })
      // DSH Desktop：装好新版后一键重启（VPS 上由网关重启，普通 dsh web 请用户自己重启）
      fetchApi.register({
        path: RESTART_PATH,
        methods: ['POST'],
        requestBody: 'buffered',
        fetch: async () => {
          if (typeof deps.desktopActions?.requestRestart !== 'function') return json({ error: 'no_restart' }, 409)
          await deps.desktopActions.requestRestart()
          return json({ restarting: true })
        },
      })
    } catch (error) {
      ctx.logger?.warn?.(`[dsh-vps] 更新接口注册失败：${error?.message ?? error}`)
    }
```

</details>

**依据 3 · 源码核查**：[plugin/remote-install.mjs:221-272](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/plugin/remote-install.mjs#L221-L272)

SSH 身份、主机密钥及进程参数。

<details>
<summary>查看原文（52行）</summary>

```text
  async function start(value) {
    if (job && job.state === 'running') return { error: '已经有一个任务在进行中，等它结束再试', status: 409 }
    const { host, port, user, password, privateKey, passphrase, domain, mirror, keepData, purgeCaddy } = value
    const auth = AUTHS.has(value.auth) ? value.auth : password ? 'password' : 'local'
    const action = value.action === 'uninstall' ? 'uninstall' : 'install'
    const remoteLog = ACTIONS[action].log
    const verb = action === 'uninstall' ? '卸载' : '安装'
    job = {
      action, state: 'running', host, port, user, auth, domain, mirror, keepData, purgeCaddy,
      startedAt: now(), endedAt: null, lines: [], setupUrl: null, backupPath: null, error: null, phase: 'connecting',
    }
    const current = job
    const target = `${user}@${host.includes(':') ? `[${host}]` : host}`
    const args = [
      '-T', '-p', String(port),
      '-o', 'StrictHostKeyChecking=accept-new',
      '-o', 'ConnectTimeout=15',
      '-o', 'ServerAliveInterval=15',
      '-o', 'ServerAliveCountMax=8',
      '-o', 'ControlMaster=no',
      '-o', 'ControlPath=none',
      // 不压低日志级别：「Connection closed」「timed out」这类关键原因是 INFO 级，压到 ERROR 就只剩退出码 255
    ]
    let askDir = null
    const childEnv = { ...env }
    // 要交给 ssh 的口令：密码登录的密码，或加密私钥的口令
    const secret = auth === 'password' ? password : auth === 'key' ? passphrase : ''
    if (secret || auth === 'key') askDir = await mkdtemp(join(tmpdir(), 'dsh-vps-ssh-'))
    if (secret) {
      const helper = join(askDir, platform === 'win32' ? 'askpass.cmd' : 'askpass.sh')
      if (platform === 'win32') {
        await writeFile(helper, `@set ELECTRON_RUN_AS_NODE=1\r\n@"${process.execPath}" -e "process.stdout.write(process.env.DSH_VPS_PW+'\\n')"\r\n`)
      } else {
        await writeFile(helper, '#!/bin/sh\nprintf \'%s\\n\' "$DSH_VPS_PW"\n', { mode: 0o700 })
      }
      args.push('-o', 'NumberOfPasswordPrompts=1')
      Object.assign(childEnv, { SSH_ASKPASS: helper, SSH_ASKPASS_REQUIRE: 'force', DISPLAY: env.DISPLAY || ':0', DSH_VPS_PW: secret })
    } else {
      args.push('-o', 'BatchMode=yes')
    }
    if (auth === 'password') {
      args.push('-o', 'PreferredAuthentications=keyboard-interactive,password', '-o', 'PubkeyAuthentication=no')
    } else if (auth === 'key') {
      const keyFile = join(askDir, 'id_key')
      await writeFile(keyFile, privateKey, { mode: 0o600 })
      args.push('-i', keyFile, '-o', 'IdentitiesOnly=yes', '-o', 'PreferredAuthentications=publickey')
    } else {
      // 本机密钥：本插件专用的那把 + ~/.ssh 里的默认私钥（ssh-agent 里的也照样会试）
      for (const f of [localKeyPath(env), ...defaultIdentities()]) if (existsSync(f)) args.push('-i', f)
      args.push('-o', 'PreferredAuthentications=publickey')
    }
    args.push('--', target, 'sh -s')
```

</details>

**依据 4 · 源码核查**：[plugin/remote-install.mjs:311-347](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/plugin/remote-install.mjs#L311-L347)

连接中断和后台任务结果分支。

<details>
<summary>查看原文（37行）</summary>

```text
    const finish = (code) => {
      if (current.endedAt) return
      clearTimeout(current.timer)
      if (buf) push(buf)
      if (askDir) rm(askDir, { recursive: true, force: true }).catch(() => {})
      current.endedAt = now()
      const exitLine = current.lines.find((l) => /^DSHVPS_EXIT=\d+/.test(l))
      current.lines = current.lines.filter((l) => !/^DSHVPS_(EXIT|ERR)=/.test(l))
      const remoteExit = exitLine ? Number(exitLine.split('=')[1]) : null
      if (remoteExit === 0) {
        current.state = 'success'
      } else if (remoteExit !== null) {
        current.state = 'failed'
        current.error = `${verb}脚本执行失败（退出码 ${remoteExit}），详见下方日志；服务器上的完整日志：${remoteLog}`
      } else if (current.phase === 'installing') {
        current.state = 'failed'
        current.error = action === 'uninstall'
          ? `与服务器的连接中断了，但卸载仍在服务器上继续运行。稍后 SSH 登录执行 sudo tail -n 50 ${remoteLog} 查看结果`
          : `与服务器的连接中断了，但安装仍在服务器上继续运行。稍后 SSH 登录执行 sudo tail -n 50 ${remoteLog} 查看结果，或执行 sudo dsh-vps setup-url 取设置链接`
      } else {
        current.state = 'failed'
        current.error = classifyFailure(stderr, code, auth, platform)
      }
    }
    child.on('error', (error) => {
      stderr += `\n${error.message}`
      finish(255)
    })
    child.on('close', (code) => finish(code))
    current.timer = setTimeout(() => {
      try {
        child.kill('SIGTERM')
      } catch {
        // 已退出
      }
    }, JOB_TIMEOUT_MS)
    child.stdin.end(remoteScript({ action, domain, mirror, keepData, purgeCaddy }))
```

</details>

**依据 5 · 源码核查**：[install.sh:609-618](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/install.sh#L609-L618)

安装九步骤。

<details>
<summary>查看原文（10行）</summary>

```text
step1_prechecks
step2_node
step3_dsh
step4_user
step5_gate
resolve_trusted_host
step6_caddy
step7_systemd
step8_firewall
step9_verify
```

</details>

**依据 6 · 源码核查**：[gate/server.js:344-405](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/gate/server.js#L344-L405)

scrypt、会话签名与 cookie 属性。

<details>
<summary>查看原文（62行）</summary>

```text
function hashPassword(password, salt) {
	return crypto.scryptSync(Buffer.from(password, "utf8"), salt, SCRYPT_KEYLEN, SCRYPT_PARAMS);
}

function verifyAdmin(admin, username, password) {
	if (!admin || admin.username !== username) return false;
	const salt = Buffer.from(admin.salt, "hex");
	const expected = Buffer.from(admin.hash, "hex");
	const actual = hashPassword(password, salt);
	return expected.byteLength === actual.byteLength && crypto.timingSafeEqual(actual, expected);
}

//#endregion

//#region 会话 Cookie

let sessionKey = null; // main() 中初始化

// 会话 MAC 绑定当前管理员记录（盐值在每次设置/重置密码时重新生成）：
// reset-admin、改密码或删除 admin.json 后，所有旧会话立即作废，无需重启 gate。
function sessionMac(admin, body) {
	return b64u(crypto.createHmac("sha256", sessionKey).update(`${admin.salt}\n${admin.username}\n${body}`).digest());
}

function signSession(admin, expiresMs) {
	const body = `${b64u(Buffer.from(admin.username, "utf8"))}.${expiresMs}`;
	return `${body}.${sessionMac(admin, body)}`;
}

function sessionUser(req) {
	const value = parseCookies(req.headers.cookie)[SESSION_COOKIE];
	if (!value) return void 0;
	const parts = value.split(".");
	if (parts.length !== 3) return void 0;
	const [user64, expiresStr, mac] = parts;
	const admin = loadAdmin();
	if (!admin) return void 0;
	if (!timingSafeEqualStr(mac, sessionMac(admin, `${user64}.${expiresStr}`))) return void 0;
	const expiresMs = Number(expiresStr);
	if (!Number.isSafeInteger(expiresMs) || expiresMs <= Date.now()) return void 0;
	try {
		const username = Buffer.from(user64, "base64url").toString("utf8");
		return username === admin.username ? username : void 0;
	} catch {
		return void 0;
	}
}

function sessionCookieHeader(req, admin, remember = true) {
	const ttl = remember ? SESSION_TTL_MS : SESSION_SHORT_TTL_MS;
	const expiresMs = Date.now() + ttl;
	// 站点一律 HTTPS（Caddy 自动签发，或自签过渡），Secure 无条件加上。
	// 不读 x-forwarded-proto：那是个可被伪造的请求头，值得信任的只有"这里就是 HTTPS"这件事本身。
	const secure = process.env.GATE_COOKIE_SECURE !== "0";
	return [
		`${SESSION_COOKIE}=${signSession(admin, expiresMs)}`,
		...remember ? [`Max-Age=${Math.floor(ttl / 1000)}`] : [],
		"Path=/",
		"HttpOnly",
		"SameSite=Lax",
		...secure ? ["Secure"] : [],
	].join("; ");
```

</details>

#### 缺口

- 未拿到目标 DSH、Linux、Caddy、DNS 和浏览器组合的执行记录。
  **影响：**兼容性和实际恢复时长未知。
  **进一步探讨：**在隔离 VPS 固定环境执行部署/重启/升级/回滚矩阵。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪个前提最可能使“安全且可恢复的公网管理”失效？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

公网网关的密码哈希、签名会话和服务端 DSH Cookie 有源码实现，但初始管理权有敏感边界。install.sh 默认从 raw main 抓辅助文件；即便外层 install.sh 固定版本，gate、unit 与 Caddy 模板可能随 main 漂移，难以证明可重现部署。更直接地，gate 在 setup.token 缺失或不可读时把任何提供值视为有效，退回开放设置；必须同时setupOpen（setup.lock不存在），在初始尚未完成注册且请求可达等条件下，访问者可能抢先注册。卸载tar非零先warn，随后仍执行chmod备份；若失败/部分归档仍存在且chmod成功，会继续停服务/删安装目录，数据删除还取决keep-data。若chmod失败，set-e会中止。因此不能说所有tar失败都继续，但“删除前必须验证备份成功可恢复”没有硬闸。以上是源码可见的条件性风险，未复现公网攻击或数据丢失。生产采用前须钉所有下载内容、验证首次注册锁，并做独立备份/恢复演练。

#### 证据与依据

**依据 1 · 源码核查**：[install.sh:43-45](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/install.sh#L43-L45)

默认 RAW_BASE 指向 main。

```text
# gate/unit/caddy 模板来源：优先脚本同目录（仓库克隆），否则从 raw 地址下载
RAW_BASE="${DSHVPS_RAW_BASE:-https://raw.githubusercontent.com/AIcivilization/dsh-vps/main}"

```

**依据 2 · 源码核查**：[install.sh:87-95](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/install.sh#L87-L95)

辅助文件可从非固定 main 下载。

```text
# 取仓库文件：本地克隆优先，否则走 RAW_BASE
fetch_file() { # $1=仓库内相对路径 $2=目标路径
	local rel="$1" dst="$2"
	if [[ -n "$SCRIPT_DIR" && -f "$SCRIPT_DIR/$rel" ]]; then
		install -m 644 "$SCRIPT_DIR/$rel" "$dst"
	else
		curl -fsSL "$RAW_BASE/$rel" -o "$dst" \
			|| die "下载 $rel 失败（仓库未发布时请在克隆目录内运行本脚本）"
	fi
```

**依据 3 · 源码核查**：[gate/server.js:1211-1243](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/gate/server.js#L1211-L1243)

setup.token 缺失时校验放行。

<details>
<summary>查看原文（33行）</summary>

```text
// ---- 启动令牌 ----
// 从 install.sh 跑完到用户第一次打开浏览器之间，/setup 对全网开放：谁先提交谁就是
// 管理员。install.sh 因此生成一个一次性令牌写进 state/setup.token，并打印带令牌的
// URL；向导提交成功后立刻删除令牌文件，令牌永久失效。
// 没有令牌文件时（手工部署、令牌被清），行为退回旧版的开放向导，不锁死用户。
function setupTokenPath() {
	return path.join(STATE_DIR, "setup.token");
}

function loadSetupToken() {
	try {
		const token = fs.readFileSync(setupTokenPath(), "utf8").trim();
		return /^[A-Za-z0-9]{16,64}$/.test(token) ? token : null;
	} catch {
		return null;
	}
}

function clearSetupToken() {
	try {
		fs.rmSync(setupTokenPath());
		log("setup token consumed");
	} catch {
		/* 已不存在 */
	}
}

function setupTokenValid(provided) {
	const expected = loadSetupToken();
	if (!expected) return true; // 未启用令牌
	if (typeof provided !== "string" || provided.length !== expected.length) return false;
	return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}
```

</details>

**依据 4 · 源码核查**：[gate/server.js:2245-2260](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/gate/server.js#L2245-L2260)

尚无管理员时开放向导路由。

<details>
<summary>查看原文（16行）</summary>

```text
				if (pathname === "/setup") return handleSetup(req, res);
				if (!loadAdmin()) {
					// 尚未完成初始设置：浏览器导航导向导，/api 保持 401
					if (pathname.startsWith("/api")) {
						sendText(res, 401, "gate not configured");
						return;
					}
					if (setupOpen()) {
						// 绝不能在这里把令牌拼进跳转地址：此刻来访者尚未证明任何身份，
						// 带上令牌等于把管理员注册权发给整个公网。无令牌时 /setup 会显示「需要令牌」页。
						res.writeHead(303, { location: "/setup", "cache-control": "no-store" });
						res.end();
						return;
					}
					sendText(res, 503, "gate not configured: admin account missing (run `dsh-vps reset-admin`)");
					return;
```

</details>

**依据 5 · 源码核查**：[uninstall.sh:80-100](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/uninstall.sh#L80-L100)

备份失败警告继续。

<details>
<summary>查看原文（21行）</summary>

```text
## region: 步骤 2：备份

log "步骤 1/6：备份"
mkdir -p /root
local_ts="dsh-vps-uninstall-$(date +%Y%m%d-%H%M%S).tar.gz"
BACKUP="/root/$local_ts"
targets=()
# 注意：set -e 下不能写 `[[ -d x ]] && arr+=(x)`——条件为假时整条列表返回非 0 会直接退出
if [[ -d "$INSTALL_ROOT/state" ]]; then targets+=("${INSTALL_ROOT#/}/state"); fi
if [[ -d "$INSTALL_ROOT/backups" ]]; then targets+=("${INSTALL_ROOT#/}/backups"); fi
if [[ -d "$DSH_HOME_DIR" ]]; then targets+=("${DSH_HOME_DIR#/}"); fi
# Caddyfile 下一步会被改写，先连同站点块一起进备份
if [[ -f "$CADDYFILE" ]]; then targets+=("${CADDYFILE#/}"); fi
if [[ -f "$CADDY_SITE_FILE" ]]; then targets+=("${CADDY_SITE_FILE#/}"); fi
if [[ ${#targets[@]} -gt 0 ]]; then
	tar -czf "$BACKUP" -C / "${targets[@]}" 2>/dev/null || warn "部分文件无法打包（继续卸载）"
	chmod 600 "$BACKUP"
	log "备份完成: $BACKUP"
else
	BACKUP=""
	log "没有可备份的内容"
```

</details>

**依据 6 · 源码核查**：[uninstall.sh:123-127](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/uninstall.sh#L123-L127)

之后删除安装目录。

```text
## region: 步骤 4：删文件

log "步骤 3/6：移除安装目录与命令"
rm -rf "$INSTALL_ROOT"
rm -f /usr/local/bin/dsh-vps
```

**依据 7 · 源码核查**：[gate/server.js:1203-1243](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/gate/server.js#L1203-L1243)

setupOpen必须无setup.lock，缺/坏token返回true。

<details>
<summary>查看原文（41行）</summary>

```text
function setupLockPath() {
	return path.join(STATE_DIR, "setup.lock");
}

function setupOpen() {
	return !fs.existsSync(setupLockPath());
}

// ---- 启动令牌 ----
// 从 install.sh 跑完到用户第一次打开浏览器之间，/setup 对全网开放：谁先提交谁就是
// 管理员。install.sh 因此生成一个一次性令牌写进 state/setup.token，并打印带令牌的
// URL；向导提交成功后立刻删除令牌文件，令牌永久失效。
// 没有令牌文件时（手工部署、令牌被清），行为退回旧版的开放向导，不锁死用户。
function setupTokenPath() {
	return path.join(STATE_DIR, "setup.token");
}

function loadSetupToken() {
	try {
		const token = fs.readFileSync(setupTokenPath(), "utf8").trim();
		return /^[A-Za-z0-9]{16,64}$/.test(token) ? token : null;
	} catch {
		return null;
	}
}

function clearSetupToken() {
	try {
		fs.rmSync(setupTokenPath());
		log("setup token consumed");
	} catch {
		/* 已不存在 */
	}
}

function setupTokenValid(provided) {
	const expected = loadSetupToken();
	if (!expected) return true; // 未启用令牌
	if (typeof provided !== "string" || provided.length !== expected.length) return false;
	return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}
```

</details>

**依据 8 · 源码核查**：[gate/server.js:1754-1768](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/gate/server.js#L1754-L1768)

handleSetup先检查setupOpen再核token。

<details>
<summary>查看原文（15行）</summary>

```text
	const lang = requestLang(req);
	const L = translator(lang);
	if (!setupOpen()) {
		sendText(res, 404, "not found");
		return;
	}
	if (req.method === "GET" || req.method === "HEAD") {
		const token = providedSetupToken(req, null);
		if (!setupTokenValid(token)) {
			log("setup page rejected: missing or wrong token");
			sendHtml(res, 403, setupTokenPage(lang, req));
			return;
		}
		sendHtml(res, 200, setupPage({ domain: currentDomainHint(req), token, lang, req }));
		return;
```

</details>

**依据 9 · 源码核查**：[uninstall.sh:94-101](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/uninstall.sh#L94-L101)

tar失败warn后chmod；继续删除需chmod成功。

```text
if [[ ${#targets[@]} -gt 0 ]]; then
	tar -czf "$BACKUP" -C / "${targets[@]}" 2>/dev/null || warn "部分文件无法打包（继续卸载）"
	chmod 600 "$BACKUP"
	log "备份完成: $BACKUP"
else
	BACKUP=""
	log "没有可备份的内容"
fi
```

#### 缺口

- 未核真实配置下 token 文件丢失频率和公网可达范围。
  **影响：**风险触发概率未知，但失效路径明确。
  **进一步探讨：**隔离 VPS 模拟 token 丢失、备份失败和断网安装，检查实际状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 同一合格的远程管理任务，三阶段现金与人工成本如何计算，是否值得采用？

**研究主题：**效果与总成本、采用判断

#### 完整回答

计量单位为一台 VPS 在约定观察期内完成安装、可登录管理并可恢复的合格实例。首次现金包括 VPS、域名、带宽/存储、可能的备份空间与模型/API 费用；人工包括 DNS/防火墙/SSH、管理员设置、凭据与安全复核、基线功能验收。持续现金包括主机、证书相关资源、流量、备份存储、模型/API 调用；人工包括补丁/依赖升级、日志监控、账号与备份检查。失败恢复现金包括额外 VPS/存储/网络与重复模型调用；人工包括定位 systemd/gate/DSH、检查远端日志、核对后台 SSH 作业、从备份回滚与核数据完整性。无价格日期、任务量、运行时长和同条件对照，现金、工时、成功率和单位合格交付成本全未知，不能写 0 或宣称省钱。鉴于公网管理、动态下载安装和 token/备份边界，此版本建议观察并先隔离验证，不把“安装一条命令”直接等同低总成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:118-165](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/README.md#L118-L165)

作者给出部署路径与必要 OpenSSH/域名条件。

<details>
<summary>查看原文（48行）</summary>

````text
Mac、Windows、Linux 上的 DSH 都可以：

1. 在 DSH 里装上插件 `dsh-vps`：插件市场搜索安装，或执行 `dsh plugin add dsh-vps`
2. 打开「设置 → VPS 部署」，填服务器 IP、SSH 端口、用户名，选登录方式；有域名（A 记录已解析到服务器）再填上域名，服务器在国内就勾上「服务器在国内」
3. 点「安装到这台 VPS」

- 登录方式三选一：**密码**；**私钥**（粘贴或选择云厂商给的 .pem / 自己的 id_ed25519，可带口令）；**本机密钥**（一键生成专用密钥，复制公钥或那行命令到云厂商控制台的网页终端执行一次，~/.ssh 里已有的密钥也会一并尝试）。服务器关掉了密码登录（重装系统后常见）时用后两种
- 密码、私钥只用这一次，不保存；本机密钥的私钥只留在这台电脑上
- 页面实时显示安装日志，完成后直接给出设置向导的链接
- 安装在服务器上后台运行，中途关掉页面或网络断开都不影响
- 需要本机有 OpenSSH 客户端：Mac、Linux 自带；Windows 10/11 在「设置 → 系统 → 可选功能」里添加「OpenSSH 客户端」

### 方式二：在 VPS 上执行一键安装命令

```bash
curl -fsSL https://raw.githubusercontent.com/AIcivilization/dsh-vps/main/install.sh \
  | sudo bash -s -- --domain dsh.example.com
```

国内网络加 `--mirror cn`（Node 与 DSH 走 npmmirror）：

```bash
curl -fsSL https://raw.githubusercontent.com/AIcivilization/dsh-vps/main/install.sh \
  | sudo bash -s -- --domain dsh.example.com --mirror cn
```

还没有域名？去掉 `--domain` 即可，按公网 IP 访问：

```bash
curl -fsSL https://raw.githubusercontent.com/AIcivilization/dsh-vps/main/install.sh | sudo bash -s
```

此时证书由 Caddy 内置 CA 自签，浏览器会提示「不安全 / 证书不受信任」，属预期现象，选择继续访问即可。之后在向导里填上域名，Caddy 自动换成正式证书。（方式一不填域名时也是这样。）

走 npm 也行，装的是这个包自带的同一份脚本（版本固定，不联网拉取；需本机已有 Node 22+）：

```bash
npx dsh-vps-install install --domain dsh.example.com
```

想固定在某个发布版本（而非 `main`），把地址里的 `main` 换成版本 tag，并让后续拉取的网关文件也用同一版本：

```bash
curl -fsSL https://raw.githubusercontent.com/AIcivilization/dsh-vps/v1.7.0/install.sh \
  | sudo DSHVPS_RAW_BASE=https://raw.githubusercontent.com/AIcivilization/dsh-vps/v1.7.0 bash -s -- --domain dsh.example.com
```

安装末尾的自检若报「DSH 尚未就绪」，设置链接照样会打印；页面会显示启动进度与具体错误，排障见 `journalctl -u dsh-gate -n 80 --no-pager`。
````

</details>

**依据 2 · 源码核查**：[plugin/remote-install.mjs:317-329](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/plugin/remote-install.mjs#L317-L329)

后台安装结果不确定时需人工查远端日志。

<details>
<summary>查看原文（13行）</summary>

```text
      const exitLine = current.lines.find((l) => /^DSHVPS_EXIT=\d+/.test(l))
      current.lines = current.lines.filter((l) => !/^DSHVPS_(EXIT|ERR)=/.test(l))
      const remoteExit = exitLine ? Number(exitLine.split('=')[1]) : null
      if (remoteExit === 0) {
        current.state = 'success'
      } else if (remoteExit !== null) {
        current.state = 'failed'
        current.error = `${verb}脚本执行失败（退出码 ${remoteExit}），详见下方日志；服务器上的完整日志：${remoteLog}`
      } else if (current.phase === 'installing') {
        current.state = 'failed'
        current.error = action === 'uninstall'
          ? `与服务器的连接中断了，但卸载仍在服务器上继续运行。稍后 SSH 登录执行 sudo tail -n 50 ${remoteLog} 查看结果`
          : `与服务器的连接中断了，但安装仍在服务器上继续运行。稍后 SSH 登录执行 sudo tail -n 50 ${remoteLog} 查看结果，或执行 sudo dsh-vps setup-url 取设置链接`
```

</details>

**依据 3 · 源码核查**：[install.sh:172-196](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/install.sh#L172-L196)

Node、pnpm 安装负担。

<details>
<summary>查看原文（25行）</summary>

```text
step2_node() {
	log "步骤 2/9：Node.js 22 + pnpm"
	local major
	major=$(node --version 2>/dev/null | sed -n 's/^v\{0,1\}\([0-9]\{1,\}\).*/\1/p' || true)
	if [[ "${major:-0}" -ge 22 ]]; then
		log "已安装 Node $(node --version)，跳过"
	else
		apt-get update -y >/dev/null
		if [[ "$MIRROR" == "cn" ]]; then install_node_cn; else install_node_nodesource; fi
		major=$(node --version | sed -n 's/^v\{0,1\}\([0-9]\{1,\}\).*/\1/p')
		[[ "${major:-0}" -ge 22 ]] || die "Node.js 22 安装失败"
		log "Node $(node --version) 安装完成"
	fi

	# pnpm：`dsh plugin` 管理插件依赖的包管理器（/setup 向导可选安装插件需要）
	if ! command -v pnpm >/dev/null 2>&1; then
		log "安装 pnpm（插件管理需要）"
		if [[ "$MIRROR" == "cn" ]]; then
			npm install -g pnpm --registry=https://registry.npmmirror.com >/dev/null 2>&1 \
				|| npm install -g pnpm >/dev/null 2>&1 || true
		else
			npm install -g pnpm >/dev/null 2>&1 || true
		fi
	fi
	command -v pnpm >/dev/null 2>&1 || warn "pnpm 未安装，插件安装功能不可用（可稍后 npm i -g pnpm）"
```

</details>

**依据 4 · 源码核查**：[install.sh:489-497](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/install.sh#L489-L497)

防火墙与安全组条件。

```text
step8_firewall() {
	log "步骤 8/9：防火墙"
	if command -v ufw >/dev/null 2>&1; then
		ufw allow 22/tcp >/dev/null
		ufw allow 80/tcp >/dev/null
		ufw allow 443/tcp >/dev/null
		log "ufw 已放行 22/80/443"
	else
		log "未检测到 ufw，跳过（请自行确认云厂商安全组放行 80/443）"
```

**依据 5 · 源码核查**：[uninstall.sh:80-100](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/uninstall.sh#L80-L100)

卸载前备份及失败继续的恢复成本边界。

<details>
<summary>查看原文（21行）</summary>

```text
## region: 步骤 2：备份

log "步骤 1/6：备份"
mkdir -p /root
local_ts="dsh-vps-uninstall-$(date +%Y%m%d-%H%M%S).tar.gz"
BACKUP="/root/$local_ts"
targets=()
# 注意：set -e 下不能写 `[[ -d x ]] && arr+=(x)`——条件为假时整条列表返回非 0 会直接退出
if [[ -d "$INSTALL_ROOT/state" ]]; then targets+=("${INSTALL_ROOT#/}/state"); fi
if [[ -d "$INSTALL_ROOT/backups" ]]; then targets+=("${INSTALL_ROOT#/}/backups"); fi
if [[ -d "$DSH_HOME_DIR" ]]; then targets+=("${DSH_HOME_DIR#/}"); fi
# Caddyfile 下一步会被改写，先连同站点块一起进备份
if [[ -f "$CADDYFILE" ]]; then targets+=("${CADDYFILE#/}"); fi
if [[ -f "$CADDY_SITE_FILE" ]]; then targets+=("${CADDY_SITE_FILE#/}"); fi
if [[ ${#targets[@]} -gt 0 ]]; then
	tar -czf "$BACKUP" -C / "${targets[@]}" 2>/dev/null || warn "部分文件无法打包（继续卸载）"
	chmod 600 "$BACKUP"
	log "备份完成: $BACKUP"
else
	BACKUP=""
	log "没有可备份的内容"
```

</details>

#### 缺口

- 缺可比 VPS 账单、人工计时和同任务对照。
  **影响：**无法计算净节省或单位合格成本。
  **进一步探讨：**在同规格 VPS 上记录首次/持续/失败恢复各阶段现金和人工，按合格实例核算。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 从现版增量与失效边界可推导什么新方案，怎样证伪？

**研究主题：**新假设与验证、采用判断

#### 完整回答

已有事实是该项目以网关转译受信任会话，使公网浏览器进入 DSH 管理界面；但辅助文件默认 main 漂移、setup.lock不存在时token文件缺失退回开放向导，tar失败但部分归档可chmod时仍可继续删除。由此提出未验证的“可验证部署清单 + 首次注册封闭门 + 恢复闸门”假设：每次部署按完整 SHA/哈希拉取所有脚本和模板，管理员只经明确一次性令牌且令牌缺失时锁住 setup，升级/卸载只有在可恢复备份已校验后继续。相对当前一键安装与手工运维，增量是把供应链版本、身份建立和恢复证明作为同一交付约束；代价是清单维护、令牌救援流程、备份校验时间及更多失败拒绝。最小验证在隔离 VPS 做固定/漂移下载、token 丢失、tar 失败和回滚四组故障注入，对照现版与新方案，记录未授权注册、不可重现安装、无备份删除和成功恢复次数及工时；若新方案在这些故障下仍允许抢注册或删掉唯一数据，或维护负担大于可接受阈值，则否定。此为研究者假设，非现版能力，也未验证市场需求。

#### 证据与依据

**依据 1 · 源码核查**：[gate/server.js:678-692](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/gate/server.js#L678-L692)

现版网关会话转译事实。

<details>
<summary>查看原文（15行）</summary>

```text
/** 构造发往 DSH 的 Cookie 头：剥离客户端的 dsh-auth-*（防伪）与 gate 自身会话，注入服务端 DSH Cookie（仅 authority 匹配时）。 */
function upstreamCookieHeader(clientCookieHeader, authority) {
	const parts = [];
	for (const [key, value] of Object.entries(parseCookies(clientCookieHeader))) {
		if (key === SESSION_COOKIE || key.startsWith(DSH_COOKIE_PREFIX)) continue;
		parts.push(`${key}=${value}`);
	}
	// 按请求实际发往的 authority 选会话：域名请求用域名的，改写成回环的插件市场请求用回环的
	for (const c of [dsh.cookie, dsh.loopCookie]) {
		if (c && authority !== void 0 && c.authority === authority && c.expiresAt > Date.now()) {
			parts.push(`${c.name}=${c.value}`);
			break;
		}
	}
	return parts.length ? parts.join("; ") : void 0;
```

</details>

**依据 2 · 源码核查**：[install.sh:43-45](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/install.sh#L43-L45)

默认 main 下载。

```text
# gate/unit/caddy 模板来源：优先脚本同目录（仓库克隆），否则从 raw 地址下载
RAW_BASE="${DSHVPS_RAW_BASE:-https://raw.githubusercontent.com/AIcivilization/dsh-vps/main}"

```

**依据 3 · 源码核查**：[gate/server.js:1238-1243](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/gate/server.js#L1238-L1243)

token 缺失放行。

```text
function setupTokenValid(provided) {
	const expected = loadSetupToken();
	if (!expected) return true; // 未启用令牌
	if (typeof provided !== "string" || provided.length !== expected.length) return false;
	return crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}
```

**依据 4 · 源码核查**：[uninstall.sh:94-100](https://github.com/AIcivilization/dsh-vps/blob/d4223e07717dce3832d0233a6a12edfceb3fde27/uninstall.sh#L94-L100)

备份失败继续的现版边界。

```text
if [[ ${#targets[@]} -gt 0 ]]; then
	tar -czf "$BACKUP" -C / "${targets[@]}" 2>/dev/null || warn "部分文件无法打包（继续卸载）"
	chmod 600 "$BACKUP"
	log "备份完成: $BACKUP"
else
	BACKUP=""
	log "没有可备份的内容"
```

#### 缺口

- 缺用户故障频率、恢复价值与新方案实测。
  **影响：**无法断言方案值得推广。
  **进一步探讨：**收集真实故障样本并在隔离环境做故障注入/运维计时对照。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
