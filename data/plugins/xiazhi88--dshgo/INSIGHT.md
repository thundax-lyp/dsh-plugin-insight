# dshgo 局域网插件

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[f213fb4](https://github.com/xiazhi88/dshgo/tree/f213fb4b861178e71025465d0f1d6fb659444e2c)

<!-- BEGIN META -->
[![GitHub ★ 42](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=42&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xiazhi88/dshgo) [![npm 30d 2,487](https://img.shields.io/static/v1?label=npm+30d&message=2%2C487&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xiazhi88/dshgo) [![最新发布 2026-09-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xiazhi88/dshgo)
<!-- END META -->

> **功能**：为 DSH Web 提供局域网转发、移动端适配和可选访问密码。

> **亮点**：连接地址、回环请求改写和移动端登录入口集中，减少每次设置手机访问的操作。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：默认绑定所有接口且密码可空。WebSocket 直转路径未调用普通 HTTP 的解锁闸，真实上游是否拒绝需要独立验证。[Q03](#research-q03)

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
  - [Q01 · 与只用电脑浏览器或已有隧道相比，dshgo 增加什么？](#detail-section-11)
  - [Q02 · 正常 HTTP 请求怎样获得会话，上游如何识别代理？](#detail-section-12)
  - [Q03 · 普通密码闸能覆盖 WebSocket 和默认部署吗？](#detail-section-13)
  - [Q04 · 怎样验证统一访问边界且保留退出？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望用手机浏览 DSH 但服务只在电脑回环地址监听的人，可用插件转发到本机上游。

可继续使用本机浏览器，或使用已有受控隧道；插件把连接和登录衔接自动化。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 代理 | 连接本机 DSH Web | 默认监听非回环 |
| 普通请求解锁 | 可设置密码和 cookie | 升级有独立路径 |
| 移动地址 | 显示连接地址 | Android 客户端能力另属同仓组件 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH Web 与 Node | 提供回环上游和宿主服务 | 真实版本须核对 |
| 隔离网络与客户端 | 承载 HTTP／WS | 可选密码不覆盖升级入口 |
| 插件配置 | 监听端口和访问设置 | 不得从未验证默认值推断安全 |

| 阶段 | 操作 | 异常 |
| --- | --- | --- |
| 首次 | 假上游验证请求顺序 | 不使用真实会话 |
| 持续 | 核对授权与上游事件 | 任何未授权转发即停止 |
| 退出 | 停止代理并核对端口 | 卸载后回读监听状态 |

**效果与成本**

| 成本 | 单位 | 限制 |
| --- | --- | --- |
| 人工 | 每次受控连接的配置和排查 | 未量化 |
| 网络 | 实际监听范围与会话数据 | 需要独立部署控制 |

| 效果 | 判据 | 边界 |
| --- | --- | --- |
| 移动入口 | 手机可访问受控上游 | 未跑真实设备 |
| 访问边界 | 无权限请求不抵达服务 | HTTP 与升级需要分别验 |

> **思考**：默认绑定所有接口且密码可空。WebSocket 直转路径未调用普通 HTTP 的解锁闸，真实上游是否拒绝需要独立验证。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：连接地址、回环请求改写和移动端登录入口集中，减少每次设置手机访问的操作。[Q01](#research-q01) [Q02](#research-q02)

本机管理路由有显式代理标记，普通转发先过闸；升级路径需同一授权语义才能形成完整访问边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认绑定所有接口且密码可空。WebSocket 直转路径未调用普通 HTTP 的解锁闸，真实上游是否拒绝需要独立验证。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

保持观察，仅用隔离回环上游和假数据复现 HTTP、WS 和关停；不能验证边界时继续用本机界面。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码核查代理与闸门，未启动服务、连接真实设备或验证宿主鉴权。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/proxy.mjs、lib/gate.mjs、lib/auth.mjs、package.json、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅研究根 DSH 代理入口与源码；未运行插件、真实手机、上游或 Android App。
- 下一步：在假上游分别验证无密码、有密码、HTTP 与 upgrade、错误上游 cookie 和卸载后端口。

**分析版本**

- **仓库**：[xiazhi88/dshgo](https://github.com/xiazhi88/dshgo)
- **版本号**：2.0.5（[固定提交 f213fb4](https://github.com/xiazhi88/dshgo/tree/f213fb4b861178e71025465d0f1d6fb659444e2c)）
- **版本日期**：2026-09-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可让 HTTP 与升级请求执行同一身份规则，比较未解锁转发及合法连接成功率；拒绝无改善则撤回。[Q04](#research-q04)

在假上游分别验证无密码、有密码、HTTP 与 upgrade、错误上游 cookie 和卸载后端口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 991 | — | — | 7980 |
| .mjs | source | 10 | 1326 | 858 | 371 | — |
| .js | source | 3 | 7756 | 5087 | 2460 | — |
| .mjs | test | 3 | 532 | 433 | 52 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-11），可前往 [GitHub Issues](https://github.com/xiazhi88/dshgo/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断 dshgo 的局域网桥对手机访问的增量，以及 HTTP、升级流和本机权限边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 与只用电脑浏览器或已有隧道相比，dshgo 增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

想从同网手机查看 DSH 对话的人可以通过代理进入电脑的本机 Web 界面。直接本机浏览器不需要网络转发，已有受控隧道也可承载手机连接；插件的增量是把地址、上游 authority 处理和首屏登录衔接自动化。Android App 是同仓另外的客户端，通知、审批和应用更新不应全算作 DSH 根插件能力。合格结果需要页面和事件流都正常且未获准的客户端无法到达受保护的上游动作。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-10](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/README.md#L3-L10)

作者区分 App 和局域网插件。

```text
在手机 / 平板上用 DSH —— **一个 Android App，加一个让电脑可达的插件。**

| | |
|---|---|
| **[Android App](android/)** | 为手机做的客户端：会话跑完推送通知、**等批准时直接在通知栏点「允许」**、语音输入、主屏小组件、应用内更新。[**下载 APK**](https://github.com/xiazhi88/dshgo/releases/latest/download/dshgo-app.apk) · [源码](android/) |
| **[插件](.)** | `dshgo`：把只监听 `127.0.0.1` 的 `dsh web` 暴露到局域网，带一个「局域网访问」设置页签（地址 + 二维码），以及**可选的访问密码**。 |

两者独立：App 也可以连你自己的隧道，插件也可以只给浏览器用。但配在一起是完整体验。
```

**依据 2 · 源码核查**：[lib/index.js:333-375](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/lib/index.js#L333-L375)

按本机上游端口创建代理并提供地址。

<details>
<summary>查看原文（43行）</summary>

```text
  async function listenFrom(startAt) {
    let lastErr = null;
    for (let i = 0; i < PORT_ATTEMPTS; i += 1) {
      const port = startAt + i;
      const proxy = createLanProxy({
        port,
        bind,
        upstream: { host: '127.0.0.1', port: dshPort },
        launchToken: makeLaunchTokenReader(ctx, dshPort, warn),
        gate,
        warn,
      });
      try {
        // eslint-disable-next-line no-await-in-loop -- 串行试探，占用就换下一个
        await proxy.listen();
        return proxy;
      } catch (err) {
        lastErr = err;
        // 只有「端口被占」才值得换端口；其它错误（权限等）直接报出来
        if (err?.code !== 'EADDRINUSE') throw err;
      }
    }
    throw lastErr ?? new Error('no free port');
  }

  listenFrom(startPort).then(
    (proxy) => {
      live = proxy;
      const { port } = proxy;
      if (port !== startPort) {
        console.log(`dshgo: 端口 ${startPort} 被占用，改用 ${port}`);
      }
      const urls = lanAddresses().map((it) => `http://${it.address}:${port}`);
      // 用户就是靠这行知道该往手机里填什么地址，所以打清楚
      const line = urls.length
        ? `dshgo: 局域网地址 ${urls.join('  ')}  （上游 127.0.0.1:${dshPort}）`
        : `dshgo: 已监听 :${port}，但没找到非回环网卡 —— 检查网络连接`;
      console.log(line);
      console.log(`dshgo: 自描述端点 ${INFO_PATH}（客户端可据此自动发现地址）`);
      console.log(
        hasPassword()
          ? 'dshgo: 访问密码已启用 —— 浏览器打开会先要密码，App 走生物识别'
          : 'dshgo: 尚未设置访问密码，转发端口对所有同网络设备开放（设置里可开启）',
```

</details>

**依据 3 · 源码核查**：[lib/proxy.mjs:201-232](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/lib/proxy.mjs#L201-L232)

改写 Host/Origin 及读取启动 token。

<details>
<summary>查看原文（32行）</summary>

```text
  /** 把入站请求头改写成「看起来来自本机」的那一份。 */
  function loopbackHeaders(rawHeaders) {
    const headers = { ...rawHeaders };
    headers.host = authority;
    // 栅栏要求 Origin 与 Host 同源（缺 Origin 则放行）
    if (headers.origin !== undefined) headers.origin = `http://${authority}`;

    // ★ 标记「这个请求是从转发端口进来的」，用于区分「本机浏览器」和「网络来的」。
    //
    // 为什么不能只看 remoteAddress：代理转发给上游时**是从 127.0.0.1 发起的**，
    // 所以经由局域网的请求在插件看来也是"本机" —— 只判 remoteAddress 的话，
    // 同网络里任何人都能调那些"仅本机"的端点（比如改访问密码，把机主锁在门外）。
    //
    // 赋值而不是追加：**覆盖客户端自带的同名头**，否则这个标记可以伪造。
    headers['x-dshgo-proxied'] = '1';

    // 压缩交给上游决定，这里不干预
    return headers;
  }

  /** 首屏补一次 `?token=`，否则拿不到会话 cookie。 */
  function pathWithLaunchToken(url) {
    const parsed = new URL(url, `http://${authority}`);
    const token = (() => {
      try {
        return launchToken() || '';
      } catch {
        return '';
      }
    })();
    if (token) parsed.searchParams.set('token', token);
    return parsed.pathname + parsed.search;
```

</details>

#### 缺口

- 未实测与原生手机／隧道的操作及安全差异
  **影响**：不能宣称兼容所有宿主或提高净安全
  **进一步探讨**：用同一隔离 Web 夹具对照代理和已有认证隧道

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 正常 HTTP 请求怎样获得会话，上游如何识别代理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

普通 HTTP handler 先走 gate；根页面 GET 且接受 HTML、未见 DSH cookie 时补启动 token，再发给上游。请求 Host 与 Origin 被改成回环 authority，附加覆盖式代理标记。修改密码的插件路由要求真正回环且无标记，避免由 LAN 代理借回环身份修改。若密码启用，gate 用 scrypt 校验并发 HttpOnly 解锁 cookie；该 cookie 只是插件的访问层，最终上游仍有自己的会话机制。

#### 证据与依据

**依据 1 · 源码核查**：[lib/proxy.mjs:201-218](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/lib/proxy.mjs#L201-L218)

代理明确重写 authority 并覆盖标记。

<details>
<summary>查看原文（18行）</summary>

```text
  /** 把入站请求头改写成「看起来来自本机」的那一份。 */
  function loopbackHeaders(rawHeaders) {
    const headers = { ...rawHeaders };
    headers.host = authority;
    // 栅栏要求 Origin 与 Host 同源（缺 Origin 则放行）
    if (headers.origin !== undefined) headers.origin = `http://${authority}`;

    // ★ 标记「这个请求是从转发端口进来的」，用于区分「本机浏览器」和「网络来的」。
    //
    // 为什么不能只看 remoteAddress：代理转发给上游时**是从 127.0.0.1 发起的**，
    // 所以经由局域网的请求在插件看来也是"本机" —— 只判 remoteAddress 的话，
    // 同网络里任何人都能调那些"仅本机"的端点（比如改访问密码，把机主锁在门外）。
    //
    // 赋值而不是追加：**覆盖客户端自带的同名头**，否则这个标记可以伪造。
    headers['x-dshgo-proxied'] = '1';

    // 压缩交给上游决定，这里不干预
    return headers;
```

</details>

**依据 2 · 源码核查**：[lib/proxy.mjs:235-256](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/lib/proxy.mjs#L235-L256)

HTTP 先判 gate 再注入 token。

<details>
<summary>查看原文（22行）</summary>

```text
  const server = createServer(async (req, res) => {
    // 注意：/__dshgo__/info 不在这里处理，直接转发给上游 ——
    // 那个端点由 web server 上的插件路由提供，这样本机直连 3080 也能拿到，
    // 而不是只有走代理端口才拿得到（早期版本就栽在这上面）。同一个处理器，
    // 一份数据源，不用两处同步。

    // ★ 闸门必须在**注入启动 token 之前**。
    //
    // 那个 token 一注入，请求就等于已经登录了 —— 顺序反了闸门就是摆设。
    // 这一条是整个功能的要害，见 lib/gate.mjs 顶部说明。
    if (gate !== null) {
      const gated = await gate(req, res);
      if (gated) return;
    }

    const isRootNavigation = req.method === 'GET'
      && new URL(req.url ?? '/', `http://${authority}`).pathname === '/'
      && acceptsHtml(req.headers.accept);
    const hasSession = String(req.headers.cookie ?? '').includes(COOKIE_PREFIX);

    let path = req.url ?? '/';
    if (isRootNavigation && !hasSession) path = pathWithLaunchToken(path);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:220-241](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/lib/index.js#L220-L241)

本机密码路由拒绝来自代理的请求。

<details>
<summary>查看原文（22行）</summary>

```text
      // ★ 「仅本机」必须看**代理标记**，不能只看 remoteAddress。
      //
      // 代理转发给上游时是从 127.0.0.1 发起的，所以从局域网进来的请求
      // 在 remoteAddress 上看起来也是"本机" —— 只判地址的话，同网络里任何人
      // 都能改访问密码，把真正的机主锁在门外。这个标记由代理**覆盖式**写入，
      // 客户端伪造不了。
      const proxied = req.headers['x-dshgo-proxied'] !== undefined;
      const remote = String(req.socket?.remoteAddress ?? '');
      const isLoopback = !proxied
        && (remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1');
      if (!isLoopback) {
        send(403, {
          error: {
            code: 'loopback-only',
            message: '改密码只能在跑 dsh web 的那台机器上做（打开 127.0.0.1 的设置页）。',
          },
        });
        return;
      }

      if (req.method === 'GET') {
        send(200, { hasPassword: hasPassword(), file: authFilePath() });
```

</details>

**依据 4 · 源码核查**：[lib/gate.mjs:114-139](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/lib/gate.mjs#L114-L139)

验证密码并发解锁 cookie。

<details>
<summary>查看原文（26行）</summary>

```text
      const raw = await readBody(req);
      const password = extractPassword(raw, req.headers['content-type']);
      if (!verifyPassword(password, state.passwordHash)) {
        if (isApp) sendJson(res, 401, { error: { code: 'bad-password', message: '密码不对' } });
        else {
          const html = passwordPage({ error: '密码不对，再试一次' });
          res.writeHead(401, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
          res.end(html);
        }
        return true;
      }

      const cookie = [
        `${UNLOCK_COOKIE}=${issueToken(state.secret)}`,
        'Path=/',
        'HttpOnly',           // 页面脚本读不到，减少 XSS 的收益
        'SameSite=Lax',       // 表单跳转要带上它，所以不能是 Strict
        'Max-Age=' + String(30 * 24 * 60 * 60),
      ].join('; ');

      if (isApp) sendJson(res, 200, { ok: true }, { 'set-cookie': cookie });
      else {
        res.writeHead(303, { location: '/', 'set-cookie': cookie, 'cache-control': 'no-store' });
        res.end();
      }
      return true;
```

</details>

**依据 5 · 源码核查**：[lib/auth.mjs:44-61](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/lib/auth.mjs#L44-L61)

scrypt 加盐及比较。

<details>
<summary>查看原文（18行）</summary>

```text
export function hashPassword(password) {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, SCRYPT_KEYLEN);
  return `scrypt$${salt.toString('base64')}$${key.toString('base64')}`;
}

/** 校验密码。**用 timingSafeEqual** —— 普通的 === 会因为提前返回而泄漏信息。 */
export function verifyPassword(password, stored) {
  if (typeof stored !== 'string' || !stored.startsWith('scrypt$')) return false;
  const [, saltB64, keyB64] = stored.split('$');
  if (!saltB64 || !keyB64) return false;
  try {
    const salt = Buffer.from(saltB64, 'base64');
    const expected = Buffer.from(keyB64, 'base64');
    const actual = scryptSync(password, salt, expected.length);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
```

</details>

#### 缺口

- 目标上游 cookie 和启动 token 行为未验
  **影响**：代理转发不等于完成认证
  **进一步探讨**：在假上游记录哪些 HTTP 请求带 token 与代理标记

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 普通密码闸能覆盖 WebSocket 和默认部署吗？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

默认监听 0.0.0.0，未设置密码时 gate 直接放行；普通 HTTP 因此可能在被代理的首屏中取得上游会话。WebSocket upgrade 另有监听器，直接改头并发往上游，没有调用同一个 gate，即使启用密码也不能把这个 cookie 当 WebSocket 的必经约束。上游最终是否拒绝仍取决于自身校验，当前只确认代理会转发。插件使用 HTTP 监听，密码和 cookie 的传输需独立网络保护。部署和退出成本包括控制绑定、核查终端、检查端口释放以及上游身份。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:114-115](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/lib/index.js#L114-L115)

默认非回环绑定。

```text
  const startPort = Number(config.port) || DEFAULT_PORT;
  const bind = config.bind ?? '0.0.0.0';
```

**依据 2 · 源码核查**：[lib/gate.mjs:84-100](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/lib/gate.mjs#L84-L100)

无密码即普通 HTTP 放行。

<details>
<summary>查看原文（17行）</summary>

```text
export function createGate(getState) {

  /** 返回 true = 已经响应完毕，代理应当直接返回。 */
  return async function intercept(req, res) {
    const state = getState();

    // 没设密码 → 不拦。保持向后兼容：升级插件不会突然把用户关在门外。
    if (!state.passwordHash) return false;

    // 已经解锁过（Cookie 有效）→ 放行
    if (verifyToken(readCookie(req.headers.cookie, UNLOCK_COOKIE), state.secret)) return false;

    const url = new URL(req.url ?? '/', 'http://dshgo.invalid');
    const isApp = isAppClient(req);

    // 白名单路径直接放行（见 PUBLIC_PATHS 的说明）
    if (PUBLIC_PATHS.has(url.pathname)) return false;
```

</details>

**依据 3 · 源码核查**：[lib/proxy.mjs:324-347](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/lib/proxy.mjs#L324-L347)

WebSocket 不调用 gate，直接代理请求并双向转发。

<details>
<summary>查看原文（24行）</summary>

```text
  // WebSocket（`/api/remote.mux` 的事件流、流式输出）走 upgrade，必须原样穿透
  server.on('upgrade', (req, socket, head) => {
    const proxyReq = httpRequest({
      host: upstream.host,
      port: upstream.port,
      method: req.method,
      path: req.url ?? '/',
      headers: loopbackHeaders(req.headers),
      agent: false,
    });

    proxyReq.on('upgrade', (upRes, upSocket, upHead) => {
      const lines = [`HTTP/1.1 ${upRes.statusCode} ${upRes.statusMessage}`];
      const raw = upRes.rawHeaders;
      for (let i = 0; i < raw.length; i += 2) lines.push(`${raw[i]}: ${raw[i + 1]}`);
      socket.write(`${lines.join('\r\n')}\r\n\r\n`);
      if (upHead?.length) socket.write(upHead);
      // 双向对接。注意**不要**在 close 时 destroy 对端：
      // 上游写完就 end 的话，客户端这边可能还有没 flush 的写，
      // 立刻 destroy 会把数据丢掉（实测：客户端收到 101 却永远等不到内容）。
      // 正常收尾交给 pipe（默认 end: true），我们只在出错和客户端断开时动手。
      upSocket.pipe(socket);
      socket.pipe(upSocket);
      const bye = () => {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:384-387](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/lib/index.js#L384-L387)

卸载调用代理 close。

```text
  // 插件卸载 / 热重载时收干净，别把端口占着
  ctx.effect(() => async () => {
    if (live !== null) await live.close();
  }, 'dshgo: 关闭局域网代理');
```

**依据 5 · 源码核查**：[package.json:23-29](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/package.json#L23-L29)

包的 Node 与依赖声明。

```text
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.2",
    "qrcode": "^1.5.4"
  },
  "engines": {
    "node": ">=22"
  },
```

#### 缺口

- 真实宿主升级鉴权、网络可达性和卸载未验证
  **影响**：不能给对端访问结论或推荐开启真实代理
  **进一步探讨**：以封闭上游记录未解锁 HTTP、WS 及有无宿主会话的差异

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证统一访问边界且保留退出？

**研究主题**：新假设与验证、采用判断

#### 完整回答

保留观察。只有在回环夹具与假数据环境中先验证身份转发和退出；真实网络不应仅依赖可选密码。可以将 HTTP 与 upgrade 复用同一个可测试身份检查，并在启动时显式绑定预期接口。对照现状，模拟带有效上游 cookie 但没有插件解锁 cookie、过期解锁、登录成功和插件卸载。若未减少不合格请求抵达上游，或合法客户端在升级阶段明显退化，撤回此方案并沿用原本地访问。

#### 证据与依据

**依据 1 · 源码核查**：[lib/proxy.mjs:241-256](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/lib/proxy.mjs#L241-L256)

HTTP 路径访问检查可作对照。

<details>
<summary>查看原文（16行）</summary>

```text
    // ★ 闸门必须在**注入启动 token 之前**。
    //
    // 那个 token 一注入，请求就等于已经登录了 —— 顺序反了闸门就是摆设。
    // 这一条是整个功能的要害，见 lib/gate.mjs 顶部说明。
    if (gate !== null) {
      const gated = await gate(req, res);
      if (gated) return;
    }

    const isRootNavigation = req.method === 'GET'
      && new URL(req.url ?? '/', `http://${authority}`).pathname === '/'
      && acceptsHtml(req.headers.accept);
    const hasSession = String(req.headers.cookie ?? '').includes(COOKIE_PREFIX);

    let path = req.url ?? '/';
    if (isRootNavigation && !hasSession) path = pathWithLaunchToken(path);
```

</details>

**依据 2 · 源码核查**：[lib/proxy.mjs:324-347](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/lib/proxy.mjs#L324-L347)

升级路径与普通 HTTP 不共享 gate。

<details>
<summary>查看原文（24行）</summary>

```text
  // WebSocket（`/api/remote.mux` 的事件流、流式输出）走 upgrade，必须原样穿透
  server.on('upgrade', (req, socket, head) => {
    const proxyReq = httpRequest({
      host: upstream.host,
      port: upstream.port,
      method: req.method,
      path: req.url ?? '/',
      headers: loopbackHeaders(req.headers),
      agent: false,
    });

    proxyReq.on('upgrade', (upRes, upSocket, upHead) => {
      const lines = [`HTTP/1.1 ${upRes.statusCode} ${upRes.statusMessage}`];
      const raw = upRes.rawHeaders;
      for (let i = 0; i < raw.length; i += 2) lines.push(`${raw[i]}: ${raw[i + 1]}`);
      socket.write(`${lines.join('\r\n')}\r\n\r\n`);
      if (upHead?.length) socket.write(upHead);
      // 双向对接。注意**不要**在 close 时 destroy 对端：
      // 上游写完就 end 的话，客户端这边可能还有没 flush 的写，
      // 立刻 destroy 会把数据丢掉（实测：客户端收到 101 却永远等不到内容）。
      // 正常收尾交给 pipe（默认 end: true），我们只在出错和客户端断开时动手。
      upSocket.pipe(socket);
      socket.pipe(upSocket);
      const bye = () => {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:384-387](https://github.com/xiazhi88/dshgo/blob/f213fb4b861178e71025465d0f1d6fb659444e2c/lib/index.js#L384-L387)

退出时的可观察停止动作。

```text
  // 插件卸载 / 热重载时收干净，别把端口占着
  ctx.effect(() => async () => {
    if (live !== null) await live.close();
  }, 'dshgo: 关闭局域网代理');
```

#### 缺口

- 上游连接升级与插件卸载时序未测
  **影响**：不能估计统一校验的兼容性与运维成本
  **进一步探讨**：用记录请求和套接字的假上游统计拒绝、重连和端口状态

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
