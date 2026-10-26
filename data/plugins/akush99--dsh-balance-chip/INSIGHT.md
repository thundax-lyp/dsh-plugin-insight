# dsh-balance-chip

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[a2080e0](https://github.com/AKUSH99/dsh-balance-chip/tree/a2080e0f5024f95d35439988107183f024ba034d)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在 DSH web 侧栏与右下角显示经主机查询的 DeepSeek API 余额状态。

> **核心亮点**：把官方余额查询经宿主凭据与缓存 route 接入 DSH web 两处界面，减少用户跳转查账户余额的步骤；不增加会话级计价或消费控制。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：仅取首条余额、坏金额转 0、主显示固定 $；主机 timer 未随 route effect 清理且轮询不串行，可能导致误读或额外请求，均为源码风险而非本轮复现。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 使用者得到什么，怎样算有用？](#detail-section-11)
  - [Q02 · 余额从凭据到两处界面如何流转，生命周期怎样？](#detail-section-12)
  - [Q03 · 金额、错误和币种显示有哪些可信边界？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复的成本与实际效果有哪些证据？](#detail-section-14)
  - [Q05 · 应如何采用，什么改进假设值得最小验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DeepSeek API Key、希望就近看到账户余额提示的 DSH web 个人用户。

用户手动访问 DeepSeek 官方账户查看余额；插件在 DSH 工作页重复展示同一数据，减少页面跳转。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 余额查询 | 从宿主凭据取 Key 并查官方接口 | 网络、Key 与 API 响应可用 |
| 本地缓存 route | 两处界面共用状态 | 本组件无额外鉴权，访问边界依赖宿主 |
| 侧栏/overlay | 显示状态点和金额 | 主金额固定 $，币种只在提示内 |
| 错误提示 | 无 Key/失败时不用旧金额 | 加载与失败均显示省略号 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH credentials 与 webServer | 主机必需 | 取 Key、提供本地余额缓存 | 无法查询或提供 route |
| DEEPSEEK_API_KEY | 查询必需 | 官方余额鉴权 | no-key / Key? |
| DeepSeek 官方余额接口和网络 | 查询必需 | 返回账户数据 | error 状态，界面不显示金额 |
| web slots 与 React | 展示必需 | 侧栏与 overlay | 对应 UI 不出现 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 用户在宿主凭据库保存 Key | 有引用，避免把 Key 写入报告 |
| 安装 | 用户经已核实来源安装并重启 web | host route、两槽位加载 |
| 核对 | 用户比对官方账户余额/币种与界面时间 | 发现误显示则停止依据此数值决策 |
| 退出 | 用户停用/移除并检查请求是否停止 | 主机 timer 清理需实测 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 现金未知；宿主与网络资源 | 配置 Key、安装、重启并核余额 | 发布产物与权限未验 |
| 持续使用 | 主机每分钟远端请求，两 UI 各每分钟本地请求 | 核币种、时间与账户真值 | 频率可能受多实例/热重载影响 |
| 失败恢复 | 额外请求/重载资源未知 | 查 Key、网络、route 与官方余额 | 真实恢复时间未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 双位置余额提示 | 两槽位渲染源码可见 | 真实宿主是否均稳定显示 |
| 官方余额查询 | host 向固定端点发送 Bearer 请求 | 响应语义、请求配额与数据准确性 |
| 错误提示 | no-key/error 状态与颜色分支可见 | 用户是否分清加载、无 Key 和网络故障 |

> **思考**：仅取首条余额、坏金额转 0、主显示固定 $；主机 timer 未随 route effect 清理且轮询不串行，可能导致误读或额外请求，均为源码风险而非本轮复现。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把官方余额查询经宿主凭据与缓存 route 接入 DSH web 两处界面，减少用户跳转查账户余额的步骤；不增加会话级计价或消费控制。详见[Q01](#research-q01)、[Q02](#research-q02)。

把官方余额查询经宿主凭据与缓存 route 接入 DSH web 两处界面，减少用户跳转查账户余额的步骤；不增加会话级计价或消费控制。详见[Q01](#research-q01)、[Q02](#research-q02)。

主机凭据不直接送到客户端，前端只读本地缓存 route；这降低直接暴露 Key 的路径。金额解析、币种、timer 生命周期和路由访问控制仍需核查；客户端两份轮询实现重复。

<a id="detail-section-5"></a>

### 1.4 主要限制

仅取首条余额、坏金额转 0、主显示固定 $；主机 timer 未随 route effect 清理且轮询不串行，可能导致误读或额外请求，均为源码风险而非本轮复现。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察；若试用，应使用隔离 Key 与可核账户余额，先测非美元/错误值、route 访问和停用后请求是否停止。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

查询与渲染链路有源码证据；余额语义、路由权限、真实准确率与退出行为未验证；改进门控仍是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、client/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中读取 README、package、主机和客户端源码；未读取真实 Key、调用远端余额接口或执行宿主。
- 下一步：在隔离账户与宿主里模拟多币种、空/坏金额、慢请求、热重载及未认证 route 访问，比较显示真值和请求数。

**分析版本**

- **仓库**：[AKUSH99/dsh-balance-chip](https://github.com/AKUSH99/dsh-balance-chip)
- **版本号**：1.0.2（[固定提交 a2080e0](https://github.com/AKUSH99/dsh-balance-chip/tree/a2080e0f5024f95d35439988107183f024ba034d)）
- **版本日期**：2026-08-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可将币种/金额校验和串行可取消轮询绑定同一生命周期，用多币种、坏值、慢响应与热重载对照检验真值和请求数；当前未实现。详见[Q05](#research-q05)。

在隔离账户与宿主里模拟多币种、空/坏金额、慢请求、热重载及未认证 route 访问，比较显示真值和请求数。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 77 | — | — | 639 |
| .js | source | 2 | 224 | 203 | 7 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/AKUSH99/dsh-balance-chip/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=grey&logo=github&style=flat)](https://github.com/AKUSH99/dsh-balance-chip/issues?q=is%3Aissue+created%3A2026-09-22T05%3A13%3A14.685Z..2026-10-22T05%3A13%3A14.685Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKUSH99/dsh-balance-chip/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A13%3A14.685Z..2026-10-22T05%3A13%3A14.685Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本的 DSH 余额展示如何取得并解释 DeepSeek API 余额、暴露何种数据与生命周期问题，以及适合谁使用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 使用者得到什么，怎样算有用？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向用 DeepSeek API Key 在 DSH web 工作、希望在写作或对话前看到余额状态的个人用户。本包在侧栏底部和右下角展示同一余额缓存，绿色/橙色提示五美元阈值，红色表示未成功查询。合格结果不是胶囊出现，而是与账户余额、币种和时间相符，并让用户知道数据可能滞后或不可用。原办法是在 DeepSeek 官方账户或其它计费入口查余额；本包把已有查询结果贴近 DSH 工作界面，未创造新的计费数据或节约模型 token。

作者称两处总可见、每 60 秒更新。源码确实有主机端定时查询及两个槽位各自定时取本地 route，但客户端一处只能在侧栏展开时看金额；界面不改变用户购买、充值或预算控制流程。把状态点称为成本治理能力需谨慎，余额不等于本次会话消费，也不能单独推出真实业务支出。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/README.md#L1-L19)

作者给出双位置、阈值与 Key 来源主张。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-balance-chip

Show your **DeepSeek API balance directly inside the DSH app**, in two places:

1. **Bottom-right pill** – always visible, non-blocking (`pointer-events: none`), dot + amount, auto-refresh every 60 s
2. **Sidebar footer** – beside Settings (dot in rail mode)

![Screenshot: DeepSeek balance pill in the bottom-right corner of the DSH app](assets/screenshot.png)

- 🟢 green ≥ $5 · 🟠 orange < $5 · 🔴 red on errors
- Tooltip shows currency and last update time
- **Your API key never ships with this plugin** – it is read at runtime from your local DSH credential store, and the only network call goes to the official `api.deepseek.com/user/balance` endpoint from the host side.

## Prerequisites

Your DeepSeek API key must be stored in the DSH credential store under the reference **`DEEPSEEK_API_KEY`** (this is the same place the built-in DeepSeek provider uses – the web UI's Models page writes it there). If the reference is missing, the displays show `Key?`.

## Install

```

</details>

**依据 2 · 源码核查**：[client/client.js:13-72](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/client/client.js#L13-L72)

侧栏状态点和金额依赖 wide 属性。

<details>
<summary>查看原文（60行）</summary>

```text
    slots.inject("sidebar.footer.action", () => {
      const off = slots.register(
        { name: "sidebar.footer.action", id: "dsh-balance-chip" },
        (props) => {
          const [data, setData] = react.useState(null);

          react.useEffect(() => {
            let alive = true;
            async function tick() {
              try {
                const r = await fetch("/dsh-balance", { cache: "no-store" });
                if (!r.ok) throw new Error("HTTP " + r.status);
                const j = await r.json();
                if (alive) setData(j);
              } catch (e) {
                if (alive) setData({ status: "error", detail: String((e && e.message) || e) });
              }
            }
            tick();
            const t = setInterval(tick, 60000);
            return () => { alive = false; clearInterval(t); };
          }, []);

          const ok = data && data.status === "ok";
          const warn = ok && Number(data.balance) < 5;
          const color = !ok ? "#f87171" : (warn ? "#f59e0b" : "#34d399");
          const text = ok ? "$" + Number(data.balance).toFixed(2) : (data && data.status === "no-key" ? "Key?" : "…");
          const title = ok
            ? "DeepSeek Balance " + data.currency + " · aktualisiert " + new Date(data.time).toLocaleTimeString()
            : "DeepSeek Balance";

          return react.createElement(
            "div",
            {
              title: title,
              style: {
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "12px",
                padding: props.wide ? "4px 8px" : "4px",
                borderRadius: "6px",
              },
            },
            react.createElement("span", {
              style: {
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: color,
                display: "inline-block",
                flexShrink: "0",
              },
            }),
            props.wide ? react.createElement("span", { style: { color: "#8b93a7" } }, text) : null
          );
        }
      );
      return off;
    });
```

</details>

**依据 3 · 源码核查**：[client/client.js:74-135](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/client/client.js#L74-L135)

右下角 overlay 独立读 route 并绘制余额。

<details>
<summary>查看原文（62行）</summary>

```text
    /* Always-visible pill bottom right (in-app overlay) */
    slots.inject("shell.overlay", () => {
      const off = slots.register(
        { name: "shell.overlay", id: "dsh-balance-chip-overlay", label: () => "DeepSeek Balance" },
        () => {
          const [data, setData] = react.useState(null);
          react.useEffect(() => {
            let alive = true;
            async function tick() {
              try {
                const r = await fetch("/dsh-balance", { cache: "no-store" });
                if (!r.ok) throw new Error("HTTP " + r.status);
                const j = await r.json();
                if (alive) setData(j);
              } catch (e) {
                if (alive) setData({ status: "error", detail: String((e && e.message) || e) });
              }
            }
            tick();
            const t = setInterval(tick, 60000);
            return () => { alive = false; clearInterval(t); };
          }, []);
          const ok = data && data.status === "ok";
          const warn = ok && Number(data.balance) < 5;
          const color = !ok ? "#f87171" : (warn ? "#f59e0b" : "#34d399");
          const text = ok ? "$" + Number(data.balance).toFixed(2) : (data && data.status === "no-key" ? "Key?" : "…");
          const title = ok
            ? "DeepSeek Balance " + data.currency + " · aktualisiert " + new Date(data.time).toLocaleTimeString()
            : "DeepSeek Balance";
          return react.createElement(
            "div",
            {
              title: title,
              "aria-label": title,
              style: {
                position: "fixed",
                bottom: "14px",
                right: "14px",
                zIndex: "2147483000",
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "6px 12px",
                borderRadius: "999px",
                background: "#0d1017",
                color: "#e6e9f2",
                fontSize: "13px",
                fontWeight: "700",
                boxShadow: "0 2px 10px rgba(0,0,0,.35)",
                pointerEvents: "none",
                fontFamily: "system-ui, 'Segoe UI', sans-serif",
              },
            },
            react.createElement("span", {
              style: { width: "8px", height: "8px", borderRadius: "50%", background: color, display: "inline-block", flexShrink: "0" },
            }),
            react.createElement("span", null, "Balance " + text)
          );
        }
      );
      return off;
    });
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 余额从凭据到两处界面如何流转，生命周期怎样？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

主机 apply 要求 credentials 与 webServer，先从凭据服务解析 DEEPSEEK_API_KEY，再以 Bearer token 请求 api.deepseek.com/user/balance，只保存 status、可用性、首条余额、币种与时间到模块级 state。它立即查询一次、每 60 秒重复，GET /dsh-balance 返回这份缓存且加 no-store。客户端通过 __ModuleLoader__ 注册 sidebar.footer.action 和 shell.overlay，两处各自首次 fetch，之后各每 60 秒向本地 route 查询，组件 effect 清理自己的定时器。它没有把 Key 明文发给客户端源码路径。

主机定时器与 route effect 的生命周期不对称：setInterval 在 ctx.effect 之前创建，effect cleanup 只 disposeRoute，没有 clearInterval。静态看，卸载或热重载后旧轮询可能持续，且 state 位于模块级，在同进程多实例间共享；是否发生取决于宿主装载方式，不能当作已复现。route handler 未做本组件级鉴权，只限制 GET，宿主 webServer 的访问控制不在本源码内。该接口暴露余额、币种、时间，虽不含 Key，也需核查访问边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:8-53](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/lib/index.js#L8-L53)

凭据解析、远端请求、首条余额缓存和异常状态。

<details>
<summary>查看原文（46行）</summary>

```text
const state = { status: 'loading', balance: null, currency: 'USD', available: false, time: null };

async function fetchBalance(credentials) {
  try {
    if (credentials === undefined) {
      Object.assign(state, { status: 'no-key', time: new Date().toISOString() });
      return;
    }
    const resolved = await credentials.resolve('DEEPSEEK_API_KEY');
    const key = resolved && typeof resolved === 'object' ? resolved.value : resolved;
    if (!key) {
      Object.assign(state, { status: 'no-key', time: new Date().toISOString() });
      return;
    }
    const res = await fetch('https://api.deepseek.com/user/balance', {
      headers: { authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      Object.assign(state, { status: 'error', detail: 'HTTP ' + res.status, time: new Date().toISOString() });
      return;
    }
    const j = await res.json();
    if (j && j.balance_infos && j.balance_infos.length > 0) {
      const b = j.balance_infos[0];
      Object.assign(state, {
        status: 'ok',
        available: j.is_available !== false,
        balance: Number.parseFloat(b.total_balance) || 0,
        currency: b.currency || 'USD',
        time: new Date().toISOString(),
      });
    } else {
      Object.assign(state, {
        status: 'error',
        detail: (j && j.error && j.error.message) || 'unbekannte Antwort',
        time: new Date().toISOString(),
      });
    }
  } catch (error) {
    Object.assign(state, {
      status: 'error',
      detail: String((error && error.message) || error),
      time: new Date().toISOString(),
    });
  }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:55-82](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/lib/index.js#L55-L82)

主机立即/定时查询与本地 GET，清理只处理路由。

<details>
<summary>查看原文（28行）</summary>

```text
const inject = ['credentials', 'webServer'];

async function apply(ctx) {
  const tick = () => { void fetchBalance(ctx.credentials); };
  tick();
  const timer = setInterval(tick, 60000);
  await ctx.effect(() => {
    const disposeRoute = ctx.webServer.register({
      kind: 'exact',
      path: '/dsh-balance',
      handler: (request, response) => {
        if (request.method !== 'GET') {
          response.writeHead(405, { allow: 'GET' });
          response.end();
          return;
        }
        response.writeHead(200, {
          'cache-control': 'no-store',
          'content-type': 'application/json; charset=utf-8',
        });
        response.end(JSON.stringify(state));
      },
    }, 'dsh-balance-chip: http route');
    return () => disposeRoute();
  });
}

export { apply, inject };
```

</details>

**依据 3 · 源码核查**：[client/client.js:9-34](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/client/client.js#L9-L34)

侧栏定时器与组件 cleanup。

<details>
<summary>查看原文（26行）</summary>

```text
  function apply(ctx) {
    const slots = ctx.get("slots");
    if (slots === undefined) return;

    slots.inject("sidebar.footer.action", () => {
      const off = slots.register(
        { name: "sidebar.footer.action", id: "dsh-balance-chip" },
        (props) => {
          const [data, setData] = react.useState(null);

          react.useEffect(() => {
            let alive = true;
            async function tick() {
              try {
                const r = await fetch("/dsh-balance", { cache: "no-store" });
                if (!r.ok) throw new Error("HTTP " + r.status);
                const j = await r.json();
                if (alive) setData(j);
              } catch (e) {
                if (alive) setData({ status: "error", detail: String((e && e.message) || e) });
              }
            }
            tick();
            const t = setInterval(tick, 60000);
            return () => { alive = false; clearInterval(t); };
          }, []);
```

</details>

**依据 4 · 源码核查**：[client/client.js:74-95](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/client/client.js#L74-L95)

overlay 独立定时读同一路由。

<details>
<summary>查看原文（22行）</summary>

```text
    /* Always-visible pill bottom right (in-app overlay) */
    slots.inject("shell.overlay", () => {
      const off = slots.register(
        { name: "shell.overlay", id: "dsh-balance-chip-overlay", label: () => "DeepSeek Balance" },
        () => {
          const [data, setData] = react.useState(null);
          react.useEffect(() => {
            let alive = true;
            async function tick() {
              try {
                const r = await fetch("/dsh-balance", { cache: "no-store" });
                if (!r.ok) throw new Error("HTTP " + r.status);
                const j = await r.json();
                if (alive) setData(j);
              } catch (e) {
                if (alive) setData({ status: "error", detail: String((e && e.message) || e) });
              }
            }
            tick();
            const t = setInterval(tick, 60000);
            return () => { alive = false; clearInterval(t); };
          }, []);
```

</details>

#### 缺口

- 没有宿主热卸载、多实例和路由权限的执行记录。
  **影响**：不能断言实际持续泄露或对外开放，但需在采用前核生命周期与访问范围。
  **进一步探讨**：隔离宿主中反复启停/重载，监测网络请求数、route 是否存在和未认证访问响应。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 金额、错误和币种显示有哪些可信边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

主机只读取 balance_infos[0].total_balance，parseFloat 失败以 0 代替，currency 缺失以 USD 代替；它不合并多条余额，也未验证响应币种或总额语义。因此若接口返回多余额项，界面只代表第一条；若字段异常，可能被显示为零。客户端无论 data.currency 是什么都在金额前写 $，虽然 tooltip 带币种，这会让非美元账户的主显示具有误导性。主机 HTTP/解析异常把状态置 error，但未清旧 balance；客户端根据 status 不显示旧金额，这一点避免把失败时旧值当当前值。

侧栏和 overlay 在 no-key 时显示 Key?，其它非 ok 包括 error 都显示省略号，红点则表示失败；README 的红色错误提示可与源码对应，但单看数字缺失无法区分初始加载和远端失败。调用 fetch 未指定超时、取消或并发保护；60 秒内请求未结束时后续 tick 可重叠，较晚旧结果覆盖较新结果也有静态可能。没有真实 API 响应样本或运行测试，本轮只确认代码路径。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:22-51](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/lib/index.js#L22-L51)

只读首个 balance_infos 且非法金额退为0，错误时 status 切换。

<details>
<summary>查看原文（30行）</summary>

```text
    const res = await fetch('https://api.deepseek.com/user/balance', {
      headers: { authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      Object.assign(state, { status: 'error', detail: 'HTTP ' + res.status, time: new Date().toISOString() });
      return;
    }
    const j = await res.json();
    if (j && j.balance_infos && j.balance_infos.length > 0) {
      const b = j.balance_infos[0];
      Object.assign(state, {
        status: 'ok',
        available: j.is_available !== false,
        balance: Number.parseFloat(b.total_balance) || 0,
        currency: b.currency || 'USD',
        time: new Date().toISOString(),
      });
    } else {
      Object.assign(state, {
        status: 'error',
        detail: (j && j.error && j.error.message) || 'unbekannte Antwort',
        time: new Date().toISOString(),
      });
    }
  } catch (error) {
    Object.assign(state, {
      status: 'error',
      detail: String((error && error.message) || error),
      time: new Date().toISOString(),
    });
```

</details>

**依据 2 · 源码核查**：[client/client.js:35-42](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/client/client.js#L35-L42)

侧栏固定美元符号与颜色条件。

```text

          const ok = data && data.status === "ok";
          const warn = ok && Number(data.balance) < 5;
          const color = !ok ? "#f87171" : (warn ? "#f59e0b" : "#34d399");
          const text = ok ? "$" + Number(data.balance).toFixed(2) : (data && data.status === "no-key" ? "Key?" : "…");
          const title = ok
            ? "DeepSeek Balance " + data.currency + " · aktualisiert " + new Date(data.time).toLocaleTimeString()
            : "DeepSeek Balance";
```

**依据 3 · 源码核查**：[client/client.js:96-102](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/client/client.js#L96-L102)

overlay 同样固定美元符号、tooltip 含币种。

```text
          const ok = data && data.status === "ok";
          const warn = ok && Number(data.balance) < 5;
          const color = !ok ? "#f87171" : (warn ? "#f59e0b" : "#34d399");
          const text = ok ? "$" + Number(data.balance).toFixed(2) : (data && data.status === "no-key" ? "Key?" : "…");
          const title = ok
            ? "DeepSeek Balance " + data.currency + " · aktualisiert " + new Date(data.time).toLocaleTimeString()
            : "DeepSeek Balance";
```

**依据 4 · 源码核查**：[lib/index.js:57-60](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/lib/index.js#L57-L60)

轮询不等待前次完成，也无取消。

```text
async function apply(ctx) {
  const tick = () => { void fetchBalance(ctx.credentials); };
  tick();
  const timer = setInterval(tick, 60000);
```

#### 缺口

- 缺少多币种、多余额项、异常值及慢请求的同版本 API 样本。
  **影响**：无法确认实际误显示频率或余额新鲜度上界。
  **进一步探讨**：以脱敏模拟响应覆盖多币种、空/坏金额、慢请求和并发完成顺序，并与官方账户值核对。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复的成本与实际效果有哪些证据？

**研究主题**：效果与总成本、依赖、兼容与流程

#### 完整回答

首次需将 DeepSeek Key 存入宿主凭据库并安装 web 插件、重启；这涉及本地凭据权限与宿主版本。持续使用在主机每分钟向官方余额接口发起一次请求，两处 UI 又各每分钟请求本地 route。若界面重复挂载，主机定时器未清的静态边界会放大请求。网络、主机进程和人工核余额的时间成本未量化；作者说余额 endpoint 不消耗聊天 token，只能按作者声明，不能推成完全零成本或无请求限制。

效果证据止于源码有查询和渲染路径，尚无本轮真实账户对照。失败时 no-key/HTTP/网络状态会显示不同 status，但 UI 的错误金额文案不够明确；恢复步骤是修凭据或网络、等待下一轮询/重载并在官方账户核实，而不是仅看红点变绿。现金费用、请求配额、首次配置时间、余额准确率和错误恢复时间均未知，不能填 0 或宣称已验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-48](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/README.md#L17-L48)

作者提供凭据前提、安装/重启和刷新口径。

<details>
<summary>查看原文（32行）</summary>

````text

## Install

```sh
dsh plugin --profile web add github:AKUSH99/dsh-balance-chip
```

Restart `dsh web` (or use the market's one-click restart). No build step, no dependencies.

Requires dsh web `0.1.0-rc.6` or newer (same base as the plugin market).

## Installation alternatives

- **Plugin Market:** once listed, open Settings → Plugin Market in the app, search "balance", one-click install.
- **Prebuilt package:** the [latest release](https://github.com/AKUSH99/dsh-balance-chip/releases/latest) ships a ready tarball – the market offers it as the faster install path without any build step.

## How it works

| Part | What it does |
|---|---|
| `lib/index.js` (host) | Resolves the key via the `credentials` service, polls `GET https://api.deepseek.com/user/balance` every 60 s, serves the cached state at `GET /dsh-balance` |
| `client/client.js` (web) | Registers a `sidebar.footer.action` item **and** a `shell.overlay` pill that fetch `/dsh-balance` and render dot + amount |

No telemetry, no external dependencies, everything stays on your machine.

## Troubleshooting

- **`Key?` in the chip/pill** – no `DEEPSEEK_API_KEY` reference in your credential store. Store your key via the web UI's Models page (or the `credentials` service), then reload.
- **`…` while loading** – the first poll hasn't finished yet; wait a few seconds.
- **Red dot / error** – the host couldn't reach `api.deepseek.com/user/balance`; check your network and key validity.

## 中文说明
````

</details>

**依据 2 · 源码核查**：[lib/index.js:16-27](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/lib/index.js#L16-L27)

远端请求使用凭据及异常分支。

<details>
<summary>查看原文（12行）</summary>

```text
    const resolved = await credentials.resolve('DEEPSEEK_API_KEY');
    const key = resolved && typeof resolved === 'object' ? resolved.value : resolved;
    if (!key) {
      Object.assign(state, { status: 'no-key', time: new Date().toISOString() });
      return;
    }
    const res = await fetch('https://api.deepseek.com/user/balance', {
      headers: { authorization: `Bearer ${key}` },
    });
    if (!res.ok) {
      Object.assign(state, { status: 'error', detail: 'HTTP ' + res.status, time: new Date().toISOString() });
      return;
```

</details>

**依据 3 · 源码核查**：[client/client.js:19-34](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/client/client.js#L19-L34)

侧栏每分钟本地 fetch 并有自身清理。

<details>
<summary>查看原文（16行）</summary>

```text
          react.useEffect(() => {
            let alive = true;
            async function tick() {
              try {
                const r = await fetch("/dsh-balance", { cache: "no-store" });
                if (!r.ok) throw new Error("HTTP " + r.status);
                const j = await r.json();
                if (alive) setData(j);
              } catch (e) {
                if (alive) setData({ status: "error", detail: String((e && e.message) || e) });
              }
            }
            tick();
            const t = setInterval(tick, 60000);
            return () => { alive = false; clearInterval(t); };
          }, []);
```

</details>

**依据 4 · 源码核查**：[client/client.js:80-95](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/client/client.js#L80-L95)

overlay 每分钟另一次本地 fetch。

<details>
<summary>查看原文（16行）</summary>

```text
          react.useEffect(() => {
            let alive = true;
            async function tick() {
              try {
                const r = await fetch("/dsh-balance", { cache: "no-store" });
                if (!r.ok) throw new Error("HTTP " + r.status);
                const j = await r.json();
                if (alive) setData(j);
              } catch (e) {
                if (alive) setData({ status: "error", detail: String((e && e.message) || e) });
              }
            }
            tick();
            const t = setInterval(tick, 60000);
            return () => { alive = false; clearInterval(t); };
          }, []);
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 应如何采用，什么改进假设值得最小验证？

**研究主题**：新假设与验证、采用判断、贡献与相对优势

#### 完整回答

本项适合已有 DeepSeek Key、只想在 web 页面看账户级余额提示的个人用户观察；它没有预算阻断和会话级成本核算。采用建议为观察，先确认 host route 访问边界、真实币种/余额展示与关闭后的轮询停止，再考虑小范围试用。固定符号与首条余额假设可能误导用户，定时器清理与并发请求也影响持续负担；没有同版本真实账户验收不能给持续安装结论。

可以提出未实现的余额语义与生命周期门控。让主机按接口币种明确展示数值，拒绝坏金额而非转零，并把 timer 与 route 同一 effect 管理、串行轮询且设置超时。最小验证以多币种、多项、坏金额、慢响应、热重载和未授权 route 请求组成矩阵，比较显示真值、请求数、残留定时器与恢复耗时。若仍误显示余额或关不掉轮询，设计假设未成立。该方案不计当前已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:29-60](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/lib/index.js#L29-L60)

首条余额与宿主轮询是改进假设的具体比较基线。

<details>
<summary>查看原文（32行）</summary>

```text
    const j = await res.json();
    if (j && j.balance_infos && j.balance_infos.length > 0) {
      const b = j.balance_infos[0];
      Object.assign(state, {
        status: 'ok',
        available: j.is_available !== false,
        balance: Number.parseFloat(b.total_balance) || 0,
        currency: b.currency || 'USD',
        time: new Date().toISOString(),
      });
    } else {
      Object.assign(state, {
        status: 'error',
        detail: (j && j.error && j.error.message) || 'unbekannte Antwort',
        time: new Date().toISOString(),
      });
    }
  } catch (error) {
    Object.assign(state, {
      status: 'error',
      detail: String((error && error.message) || error),
      time: new Date().toISOString(),
    });
  }
}

const inject = ['credentials', 'webServer'];

async function apply(ctx) {
  const tick = () => { void fetchBalance(ctx.credentials); };
  tick();
  const timer = setInterval(tick, 60000);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:61-79](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/lib/index.js#L61-L79)

route effect 清理不包括 timer，需验证热重载边界。

<details>
<summary>查看原文（19行）</summary>

```text
  await ctx.effect(() => {
    const disposeRoute = ctx.webServer.register({
      kind: 'exact',
      path: '/dsh-balance',
      handler: (request, response) => {
        if (request.method !== 'GET') {
          response.writeHead(405, { allow: 'GET' });
          response.end();
          return;
        }
        response.writeHead(200, {
          'cache-control': 'no-store',
          'content-type': 'application/json; charset=utf-8',
        });
        response.end(JSON.stringify(state));
      },
    }, 'dsh-balance-chip: http route');
    return () => disposeRoute();
  });
```

</details>

**依据 3 · 源码核查**：[client/client.js:96-102](https://github.com/AKUSH99/dsh-balance-chip/blob/a2080e0f5024f95d35439988107183f024ba034d/client/client.js#L96-L102)

界面固定美元符号为多币种假设的起点。

```text
          const ok = data && data.status === "ok";
          const warn = ok && Number(data.balance) < 5;
          const color = !ok ? "#f87171" : (warn ? "#f59e0b" : "#34d399");
          const text = ok ? "$" + Number(data.balance).toFixed(2) : (data && data.status === "no-key" ? "Key?" : "…");
          const title = ok
            ? "DeepSeek Balance " + data.currency + " · aktualisiert " + new Date(data.time).toLocaleTimeString()
            : "DeepSeek Balance";
```

#### 缺口

- 语义校验、串行轮询和生命周期绑定未在现有版本实现，也无对照结果。
  **影响**：不能把设想算成当前贡献或提高采用成熟度。
  **进一步探讨**：在模拟 API 响应和隔离宿主里分别测真值显示、请求次数、卸载残留及错误恢复。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
