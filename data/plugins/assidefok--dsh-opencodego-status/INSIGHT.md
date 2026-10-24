# dsh-opencodego-status

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[b1a2d09](https://github.com/Assidefok/dsh-opencodego-status/tree/b1a2d09dcf975be0284230c9ce8e27982b8d752c)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在 DSH Web 浮层显示 OpenCode Go 的 5 小时、周与月用量，并提供设备码登录。

> **核心亮点**：研究者识别的贡献是把 OpenCode Console 的三档额度嵌入 DSH 工作表面，并把 token 留在 Host；相对直接打开 Console，增量是减少查看路径而非改变计量能力，节时尚无对照。详见[Q03](#research-q03)。

> **风险与缺陷**：最影响价值成立的限制是响应结构缺少校验：未公开 API 若以 2xx 返回缺失字段，源码会把 meter 归零并仍标为成功，可能把“不可确定”误呈现为“低用量”；这是静态可见缺口，不是已复现事故。详见[Q04](#research-q04)。

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
  - [Q01 · 谁在何种场景需要这项能力，原有办法与合格结果是什么？](#detail-section-11)
  - [Q02 · 从设备码登录到用量展示的完整调用链如何实现？](#detail-section-12)
  - [Q03 · 相比直接打开 OpenCode Console，插件的具体增量是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使“随时准确掌握额度”的核心价值不成立？](#detail-section-14)
  - [Q05 · 启动、持续生效与失败恢复分别依赖什么，负担由谁承担？](#detail-section-15)
  - [Q06 · 完成一次准确额度判断是否更有效，首次、持续与失败恢复的总成本是什么？](#detail-section-16)
  - [Q07 · 实现是否可靠且可维护，哪些设计可借鉴、移植要付出什么？](#detail-section-17)
  - [Q08 · 由贡献与关键缺口可推导什么新方向，如何支持或推翻？](#detail-section-18)
  - [Q09 · 对什么人值得观察、试用或持续安装，成功与停止标准是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向频繁在 DSH Web 工作且已有 OpenCode Go 订阅的用户，常驻查看三档额度和重置时间；偶尔查询时直接打开 Console 更简单。详见[Q01](#research-q01)。

直接替代是打开 OpenCode Console 查看同一组 meter；它多一次离开当前工作面的动作，但使用服务原生界面。插件只有在数值一致、异常不误导且常驻查看确实减少任务中断时，才形成超过简单书签或固定浏览器标签页的采用价值。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 三档用量浮层 | 在 DSH Web 常驻显示 5 小时、每周和每月百分比及倒计时 | 需要 shell.overlay、OpenCode Go 与有效 status 响应；真实兼容未验 |
| 设备码连接 | 从卡片发起授权、轮询批准并保存 Host session | 需要访问 opencode.ai；token 保存在 DSH_HOME，未做真实授权 |
| 状态与刷新路由 | 获取缓存或新鲜状态、处理临期 token 和手动强刷 | 依赖未公开 Console API；2xx schema 漂移缺少显式校验 |
| 退出会话 | 删除 Host 状态并把 Client 恢复为未连接 | 源码有删除路径；卸载残留和异常删除未验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 0.2.x、Client loader、webServer 与 shell.overlay | 启动必需，版本仅作者声明 | 加载 Host/Client、注册路由和浮层 | 插件无法挂载或显示；真实兼容未知 |
| OpenCode Go 订阅与账号 | 显示真实 meter 必需 | 提供三档额度与续费信息 | 显示未连接或服务错误，无法完成核心任务 |
| 到 opencode.ai 的网络和未公开 Console API | 持续使用必需 | 设备码、刷新 token 与 status 取数 | 网络错误、重登或接口维护；无离线 meter |
| 可写 DSH_HOME | 登录后必需 | 以 0600 临时文件保存 session 后 rename | 登录状态不能持久化或写入报错 |
| React 与 UI layout 注入 | Client 必需 | 渲染并挂载 overlay | 前端模块无法工作 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在 web profile 添加 GitHub 插件并刷新 UI | Host 路由与右上角 pill 出现；未出现则检查宿主兼容与日志 |
| 连接 | 用户点击 Connect，在浏览器批准设备码 | Host 保存 session，Client 收到 connected snapshot；拒绝或过期则重新发起 |
| 查看与刷新 | Client 周期取 status，用户可展开卡片或强刷 | 三档值与 Console 同时点一致；错误时不得把缺失值当 0 |
| 退出与恢复 | 用户 Sign out，必要时重连 | 状态文件删除并回到未连接态；失败时人工核 DSH_HOME 与 Host 日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 需要已有 OpenCode Go 订阅；金额与地区价格未核 | 安装插件、刷新 Web UI、设备码批准并检查本地状态权限；耗时未知 | DSH 0.2.x 与账号连接未实测 |
| 持续使用 | 周期访问本地路由与 OpenCode Console，保存 refresh token；请求量未计 | 关注额度、偶发刷新或重登；频率未知 | 刷新 15–3600 秒，Host 成功缓存最多 60 秒 |
| 失败恢复 | 重试会增加请求；无金额数据 | 识别错误、对照 Console、断开重连；结构漂移可能需维护代码 | 失败率、恢复耗时和半完成状态未知 |
| 退出或迁移 | 未见迁移工具成本数据 | Sign out 删除状态，卸载后残留检查未验证 | 退出与 DSH 升级路径未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 查看路径 | 源码把三档 meter、倒计时和操作集中到 DSH overlay | 是否实际节时、减少错误或更少打断 |
| 凭据边界 | token 写在 Host 状态文件，Client 只取规范化 payload | Host 权限、卸载残留和真实泄漏面 |
| 数据及时性 | Client 周期刷新，Host 有最多 60 秒成功缓存并可强刷 | 与 Console 的时延、请求限流和准确率 |
| 异常可见性 | 非 2xx、网络错误和部分认证失败有错误路径 | 2xx schema 漂移会否静默显示 0%，真实发生率未知 |

> **思考**：最影响价值成立的限制是响应结构缺少校验：未公开 API 若以 2xx 返回缺失字段，源码会把 meter 归零并仍标为成功，可能把“不可确定”误呈现为“低用量”；这是静态可见缺口，不是已复现事故。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：研究者识别的贡献是把 OpenCode Console 的三档额度嵌入 DSH 工作表面，并把 token 留在 Host；相对直接打开 Console，增量是减少查看路径而非改变计量能力，节时尚无对照。详见[Q03](#research-q03)。

研究者识别的贡献是把 OpenCode Console 的三档额度嵌入 DSH 工作表面，并把 token 留在 Host；相对直接打开 Console，增量是减少查看路径而非改变计量能力，节时尚无对照。详见[Q03](#research-q03)。

Host/Client 分层、超时、请求体上限、成功缓存、临时文件 rename 与 effect disposer值得借鉴；但响应无 schema 守卫、同进程写状态共用 PID 临时名、slow_down 未更新 Client 调度间隔，插件自身也未显示前缀路由的鉴权、CSRF 或来源校验。宿主可能统一保护，须针对性验证而不能据此宣称漏洞。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

最影响价值成立的限制是响应结构缺少校验：未公开 API 若以 2xx 返回缺失字段，源码会把 meter 归零并仍标为成功，可能把“不可确定”误呈现为“低用量”；这是静态可见缺口，不是已复现事故。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前建议保持观察。若确需探索，先在隔离 profile 对照 Console 验证挂载、文件权限、登录退出、三档值、异常响应及宿主对未登录、跨来源和缺少防伪凭据请求的路由保护；出现静默归零、无法清除 session、保护缺失或宿主兼容失败即停止。详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 Host/Client 分层、设备码登录、三档 meter 归一化和 overlay 展示。核心贡献属于工作表面集成；真实 DSH 兼容、OpenCode 接口可用性、数据准确性和节时效果未运行验证。未来 schema 守卫与新鲜度状态仅是未验证设计假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、index.js、client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 README.md、package.json、cordis.patch.yml、index.js、client.js 与已准备 inventory；没有安装、运行目标插件、执行测试、访问真实账号或外部服务，也没有真实 DSH 宿主验收。插件路由自身未见鉴权、CSRF 或来源校验，但宿主是否统一保护未知，本报告不据此宣称可利用漏洞。作者声明、源码核查与未验证效果分别表达。
- 下一步：最有价值的下一步是在不接真实账号的 fake server 上覆盖正常、字段缺失、类型错误、超时、slow_down 与旧缓存，再在隔离 DSH profile 检查未登录、跨来源和缺少防伪凭据的路由请求是否被宿主拒绝，最后用测试账号对照 Console；记录误显示率、误拒绝率、刷新请求量、端到端耗时和退出后的状态残留。

**分析版本**

- **仓库**：[Assidefok/dsh-opencodego-status](https://github.com/Assidefok/dsh-opencodego-status)
- **版本号**：0.1.0（[固定提交 b1a2d09](https://github.com/Assidefok/dsh-opencodego-status/tree/b1a2d09dcf975be0284230c9ce8e27982b8d752c)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是增加 OpenCode 响应 schema 守卫，并把字段完整性、数据新鲜度与最近成功时间作为一等 UI 状态，可降低静默错值；先用五类 fake-server 响应矩阵检验误显示和误拒绝。详见[Q08](#research-q08)。

最有价值的下一步是在不接真实账号的 fake server 上覆盖正常、字段缺失、类型错误、超时、slow_down 与旧缓存，再在隔离 DSH profile 检查未登录、跨来源和缺少防伪凭据的路由请求是否被宿主拒绝，最后用测试账号对照 Console；记录误显示率、误拒绝率、刷新请求量、端到端耗时和退出后的状态残留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1269 | 1187 | 23 | — |
| .md | source | 1 | 86 | — | — | 529 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Assidefok/dsh-opencodego-status/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Assidefok/dsh-opencodego-status/issues?q=is%3Aissue+created%3A2026-09-24T08%3A19%3A16.349Z..2026-10-24T08%3A19%3A16.349Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Assidefok/dsh-opencodego-status/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-24T08%3A19%3A16.349Z..2026-10-24T08%3A19%3A16.349Z)



统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本是否以可控依赖和可信数据边界，为 DSH Web 用户提供值得采用的 OpenCode Go 用量感知能力。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种场景需要这项能力，原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

插件面向已使用 DSH Web 且订阅 OpenCode Go 的用户，把 5 小时、每周和每月用量放进常驻角落浮层。原有办法是离开 DSH 工作界面打开 OpenCode Console；合格结果应是三档用量、重置或续费时间与连接状态能及时且准确显示。它不适合没有 Go 订阅、只偶尔查一次额度或无法接受未公开 Console API 依赖的人。源码证明界面形态和操作存在，不证明真实数据准确或节省时间。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-35](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/README.md#L3-L35)

作者把目标场景限定为 DSH Web 中查看 OpenCode Go 的三档用量，并声明 Go 订阅与 0.2.x Host 是前提。

<details>
<summary>查看原文（33行）</summary>

```text
A floating overlay for the **DeepSeek Harness Web UI** that shows your **OpenCode Go**
usage — the 5-hour rolling limit, the weekly limit and the monthly limit — at a glance.

![OpenCode Go usage overlay, collapsed pill](docs/pill.svg)

The collapsed pill lives in the corner of the window and shows the three percentages
with a colour dot per limit. Click it for progress bars, reset countdowns, the renewal
date, and the sign-in controls.

![OpenCode Go usage overlay, expanded card](docs/card.svg)

## What you get

- **Collapsed pill** — `5h · 7d · 30d` percentages, coloured by how close you are to the
  limit (brand → warning from 60% → error from 80%), plus the weekly reset countdown.
- **Expanded card** — one progress bar per limit, `resets in` and `renews in` countdowns,
  Refresh, Sign out, and a link to the OpenCode console.
- **Device-code sign-in** — connect from the overlay; the code is shown in the card and
  approved in the browser. No password is ever typed into the overlay.
- **Silent token refresh** — the stored session is refreshed before it expires.
- **English and Chinese UI**, following the Harness locale service.
- **Theme-aware** — every colour and border comes from the Harness theme tokens, so light
  and dark themes both look native.

The numbers come from the OpenCode Console Go subscription meters, the same source the
console page itself renders.

## Requirements

- DeepSeek Harness Web UI (`0.2.x`).
- An **OpenCode Go** subscription. The overlay reads the Go plan meters; it shows
  `Not connected` when no OpenCode session is stored, and an error state when the
  subscription is missing or the API changes.
```

</details>

**依据 2 · 源码核查**：[client.js:481-550](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/client.js#L481-L550)

折叠 pill 实际遍历 meter，显示百分比、阈值颜色和周重置倒计时，支持作者描述的快速扫读形态。

<details>
<summary>查看原文（70行）</summary>

```text
      function Pill(props) {
        const { snapshot, onToggle, open, now, settings } = props
        const connected = snapshot?.ok === true
        const items = connected
          ? snapshot.meters.map((meter) =>
              h(
                'span',
                {
                  key: meter.key,
                  style: { display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11 },
                  title: `${t(meter.label)} · ${t('resetsIn')} ${formatRemaining(meter.resetsAt, now) ?? '—'}`,
                },
                h('span', {
                  style: {
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: meterTone(meter.percent),
                    display: 'inline-block',
                  },
                }),
                h('span', { style: { color: 'var(--dsw-alias-label-secondary)' } }, meterShortLabel(meter)),
                h('span', { style: { fontWeight: 600, color: 'var(--dsw-alias-label-primary)' } }, `${String(roundedPercent(meter.percent))}%`),
              ),
            )
          : h('span', { style: { fontSize: 11, color: 'var(--dsw-alias-label-secondary)' } }, snapshot === null ? t('loading') : t('notConnected'))

        return h(
          'button',
          {
            type: 'button',
            onClick: onToggle,
            'aria-expanded': open,
            'aria-label': open ? t('close') : t('expand'),
            title: t('title'),
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '5px 10px',
              borderRadius: 999,
              background: 'var(--dsw-alias-bg-overlay)',
              border: '1px solid var(--dsw-alias-border-l1)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.18)',
              color: 'var(--dsw-alias-label-primary)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            },
          },
          h('span', {
            'aria-hidden': true,
            style: {
              width: 14,
              height: 14,
              borderRadius: 999,
              display: 'inline-block',
              background: connected
                ? 'conic-gradient(var(--dsw-alias-brand-primary) 0deg, var(--dsw-alias-brand-primary) 210deg, var(--dsw-alias-bg-layer-2) 210deg)'
                : 'var(--dsw-alias-state-idle-primary)',
            },
          }),
          items,
          h('span', { style: { fontSize: 10, color: 'var(--dsw-alias-label-secondary)' } }, open ? '▲' : '▼'),
          settings.showResets && connected && snapshot.meters[1]
            ? h(
                'span',
                { style: { fontSize: 10, color: 'var(--dsw-alias-label-secondary)' } },
                formatRemaining(snapshot.meters[1].resetsAt, now) ?? '',
              )
            : null,
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从设备码登录到用量展示的完整调用链如何实现？

**研究主题**：功能与机制

#### 完整回答

Host 注册 `/api/opencodego-status` 前缀路由，启动设备码流程并只在内存保存待批准 device code；批准后把 access/refresh token 写入 Host 本地文件。状态请求在令牌临期或 401/403 时刷新会话，再请求 Go status 并把三档 meter 规范化。Client 只请求同源 Host 路由，定时刷新状态，完成设备码轮询，最后把组件注册到 `shell.overlay`。这形成浏览器不直接接收 token 的分层，但端到端兼容仍未执行确认。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:30-169](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/index.js#L30-L169)

Host 将 token 持久化在 DSH_HOME 下，以 0600 创建临时文件，并负责刷新令牌和调用固定 OpenCode origin。

<details>
<summary>查看原文（140行）</summary>

```text
/** Resolve the directory holding this plugin's persisted session. */
function stateDir() {
  const home = process.env.DSH_HOME?.trim() || join(homedir(), '.dsh')
  return join(home, 'opencodego-status')
}

function statePath() {
  return join(stateDir(), 'state.json')
}

async function readState() {
  try {
    const raw = await readFile(statePath(), 'utf8')
    const parsed = JSON.parse(raw)
    if (parsed === null || typeof parsed !== 'object') return null
    return parsed
  } catch (error) {
    if (error?.code === 'ENOENT') return null
    throw error
  }
}

async function writeState(state) {
  const dir = stateDir()
  await mkdir(dir, { recursive: true })
  const file = statePath()
  const tmp = `${file}.${process.pid}.tmp`
  await writeFile(tmp, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 })
  await rename(tmp, file)
}

async function clearState() {
  try {
    await unlink(statePath())
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
}

async function parseResponse(response) {
  const text = await response.text()
  let data = null
  if (text.length > 0) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text.slice(0, 500) }
    }
  }
  return { ok: response.ok, status: response.status, data }
}

async function postForm(url, params) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
    },
    body: new URLSearchParams(params).toString(),
    signal: AbortSignal.timeout(20000),
  })
  return parseResponse(response)
}

/** Turn the device-flow relative URI into an absolute console URL. */
function toAbsolute(target) {
  if (typeof target !== 'string' || target.length === 0) return `${ORIGIN}/console/device`
  if (/^https?:\/\//u.test(target)) return target
  return `${ORIGIN}${target.startsWith('/') ? '' : '/'}${target}`
}

async function fetchGoStatus(accessToken) {
  const response = await fetch(GO_STATUS_URL, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      accept: 'application/json',
    },
    signal: AbortSignal.timeout(20000),
  })
  if (response.status === 401 || response.status === 403) {
    throw new StatusError('reconnect', 'OpenCode rejected the stored session; sign in again.')
  }
  const parsed = await parseResponse(response)
  if (!parsed.ok) {
    throw new StatusError('api', `OpenCode Console answered ${String(response.status)}.`)
  }
  return parsed.data
}

async function refreshSession(state) {
  if (typeof state?.refreshToken !== 'string' || state.refreshToken.length === 0) {
    throw new StatusError('reconnect', 'The stored OpenCode session expired; sign in again.')
  }
  const result = await postForm(DEVICE_TOKEN_URL, {
    grant_type: 'refresh_token',
    refresh_token: state.refreshToken,
    client_id: CLIENT_ID,
  })
  if (!result.ok) {
    throw new StatusError('reconnect', 'The stored OpenCode session expired; sign in again.')
  }
  const next = {
    accessToken: result.data?.access_token,
    refreshToken: result.data?.refresh_token ?? state.refreshToken,
    expiresAt: Date.now() + Number(result.data?.expires_in ?? 0) * 1000,
    orgId: result.data?.org_id ?? state.orgId ?? null,
  }
  if (typeof next.accessToken !== 'string') {
    throw new StatusError('api', 'OpenCode did not return an access token.')
  }
  await writeState(next)
  return next
}

async function currentSession() {
  let state = await readState()
  if (state === null) throw new StatusError('not-connected', 'Not connected to an OpenCode account.')
  if (typeof state.accessToken !== 'string' || state.accessToken.length === 0) {
    throw new StatusError('reconnect', 'The stored OpenCode session is unusable; sign in again.')
  }
  const expiresAt = Number(state.expiresAt ?? 0)
  if (Number.isFinite(expiresAt) && expiresAt > 0 && expiresAt - Date.now() < REFRESH_MARGIN_MS) {
    state = await refreshSession(state)
  }
  return state
}

async function readGoStatus() {
  let state = await currentSession()
  try {
    return await fetchGoStatus(state.accessToken)
  } catch (error) {
    if (error instanceof StatusError && error.code === 'reconnect') {
      state = await refreshSession(state)
      return fetchGoStatus(state.accessToken)
    }
    throw error
  }
}
```

</details>

**依据 2 · 源码核查**：[index.js:250-447](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/index.js#L250-L447)

apply 注册五类本地路由，维护 pending device flow 和成功缓存，并通过 webServer effect 挂载前缀处理器。

<details>
<summary>查看原文（198行）</summary>

```text
export const name = 'dsh-opencodego-status'
export const inject = ['webServer']

export function apply(ctx, config) {
  const settings = readConfig(config)
  const pending = new Map()
  let cache = null
  let cachedAt = 0

  const cacheTtl = Math.max(5, Math.min(settings.refreshSeconds, 60)) * 1000

  function prunePending() {
    const now = Date.now()
    for (const [id, entry] of pending) {
      if (entry.expiresAt <= now) pending.delete(id)
    }
  }

  async function statusPayload() {
    try {
      const data = await readGoStatus()
      return { ...normalizeStatus(data), config: settings }
    } catch (error) {
      if (error instanceof StatusError) {
        return { ok: false, connected: false, code: error.code, message: error.message, config: settings }
      }
      ctx.logger?.warn?.(`opencodego-status: ${error instanceof Error ? error.message : String(error)}`)
      return {
        ok: false,
        connected: false,
        code: 'error',
        message: 'Could not reach the OpenCode Console.',
        config: settings,
      }
    }
  }

  async function handleStatus(response, force) {
    if (!force && cache !== null && Date.now() - cachedAt < cacheTtl) {
      sendJson(response, 200, cache)
      return
    }
    const payload = await statusPayload()
    if (payload.ok) {
      cache = payload
      cachedAt = Date.now()
    } else {
      cache = null
      cachedAt = 0
    }
    sendJson(response, 200, payload)
  }

  async function handleConnectStart(response) {
    const result = await postForm(DEVICE_CODE_URL, {
      client_id: CLIENT_ID,
      supports_org_scope: 'true',
    })
    if (!result.ok || typeof result.data?.device_code !== 'string') {
      throw new StatusError('api', 'OpenCode did not start the device sign-in.')
    }
    prunePending()
    const id = randomUUID()
    const interval = Number(result.data.interval ?? 5)
    const expiresIn = Number(result.data.expires_in ?? 600)
    pending.set(id, {
      deviceCode: result.data.device_code,
      interval: Number.isFinite(interval) && interval > 0 ? interval : 5,
      expiresAt: Date.now() + (Number.isFinite(expiresIn) ? expiresIn : 600) * 1000,
    })
    sendJson(response, 200, {
      ok: true,
      id,
      userCode: result.data.user_code ?? null,
      verificationUri: toAbsolute(result.data.verification_uri_complete ?? result.data.verification_uri),
      interval: Number.isFinite(interval) && interval > 0 ? interval : 5,
      expiresIn: Number.isFinite(expiresIn) ? expiresIn : 600,
    })
  }

  async function handleConnectPoll(request, response) {
    const body = await readJsonBody(request)
    const id = typeof body.id === 'string' ? body.id : ''
    const entry = pending.get(id)
    if (entry === undefined) {
      sendJson(response, 200, { ok: true, status: 'expired' })
      return
    }
    if (entry.expiresAt <= Date.now()) {
      pending.delete(id)
      sendJson(response, 200, { ok: true, status: 'expired' })
      return
    }
    const result = await postForm(DEVICE_TOKEN_URL, {
      grant_type: POLL_GRANT,
      device_code: entry.deviceCode,
      client_id: CLIENT_ID,
    })
    if (result.ok && typeof result.data?.access_token === 'string') {
      pending.delete(id)
      const state = {
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token ?? null,
        expiresAt: Date.now() + Number(result.data.expires_in ?? 0) * 1000,
        orgId: result.data.org_id ?? null,
      }
      await writeState(state)
      cache = null
      cachedAt = 0
      const payload = await statusPayload()
      sendJson(response, 200, { ok: true, status: 'connected', snapshot: payload })
      return
    }
    const code = typeof result.data?.error === 'string' ? result.data.error : ''
    if (code === 'authorization_pending') {
      sendJson(response, 200, { ok: true, status: 'pending' })
      return
    }
    if (code === 'slow_down') {
      sendJson(response, 200, { ok: true, status: 'pending', interval: entry.interval + 5 })
      return
    }
    if (code === 'access_denied') {
      pending.delete(id)
      sendJson(response, 200, { ok: true, status: 'denied' })
      return
    }
    if (code === 'expired_token') {
      pending.delete(id)
      sendJson(response, 200, { ok: true, status: 'expired' })
      return
    }
    sendJson(response, 200, {
      ok: false,
      status: 'error',
      message: 'The OpenCode sign-in could not be completed.',
    })
  }

  async function handleDisconnect(response) {
    await clearState()
    cache = null
    cachedAt = 0
    sendJson(response, 200, { ok: true })
  }

  async function route(request, response) {
    const url = new URL(request.url ?? '/', 'http://localhost')
    const suffix = url.pathname.slice(ROUTE_PREFIX.length) || '/'
    const method = request.method ?? 'GET'

    if (suffix === '/status' && method === 'GET') {
      await handleStatus(response, url.searchParams.get('fresh') === '1')
      return
    }
    if (suffix === '/refresh' && method === 'POST') {
      await handleStatus(response, true)
      return
    }
    if (suffix === '/connect/start' && method === 'POST') {
      await handleConnectStart(response)
      return
    }
    if (suffix === '/connect/poll' && method === 'POST') {
      await handleConnectPoll(request, response)
      return
    }
    if (suffix === '/disconnect' && method === 'POST') {
      await handleDisconnect(response)
      return
    }
    sendJson(response, 404, { ok: false, code: 'not-found', message: 'Unknown endpoint.' })
  }

  ctx.effect(() => {
    const dispose = ctx.webServer.register({
      kind: 'prefix',
      path: ROUTE_PREFIX,
      handler(request, response) {
        route(request, response).catch((error) => {
          if (response.headersSent) {
            response.destroy()
            return
          }
          const code = error instanceof StatusError ? error.code : 'error'
          const statusCode = error instanceof StatusError ? error.httpStatus : 500
          sendJson(response, statusCode, {
            ok: false,
            code,
            message: error instanceof Error ? error.message : String(error),
          })
        })
      },
    })
    ctx.logger?.info?.('opencodego-status: mounted /api/opencodego-status')
    return dispose
  })
}
```

</details>

**依据 3 · 源码核查**：[client.js:560-650](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/client.js#L560-L650)

Client 初始取状态、按配置周期刷新，并以 setTimeout 轮询设备码批准结果。

<details>
<summary>查看原文（91行）</summary>

```text
      return function OpenCodeGoOverlay() {
        const [snapshot, setSnapshot] = useState(null)
        const [error, setError] = useState(null)
        const [open, setOpen] = useState(false)
        const [busy, setBusy] = useState(false)
        const [flow, setFlow] = useState(null)
        const [notice, setNotice] = useState(null)
        const [, setTick] = useState(0)
        const rootRef = useRef(null)
        const now = Date.now()

        const refresh = useCallback(async (force) => {
          try {
            const payload = await callApi(`/status${force === true ? '?fresh=1' : ''}`)
            setError(null)
            setSnapshot(payload)
          } catch (failure) {
            setError(failure instanceof Error ? failure.message : String(failure))
          }
        }, [])

        useEffect(() => {
          refresh(false)
          const interval = setInterval(() => {
            setTick((value) => value + 1)
          }, 30000)
          return () => {
            clearInterval(interval)
          }
        }, [refresh])

        useEffect(() => {
          const seconds = Number(snapshot?.config?.refreshSeconds ?? 60)
          const interval = setInterval(() => {
            refresh(false)
          }, Math.max(15, Math.min(Number.isFinite(seconds) ? seconds : 60, 3600)) * 1000)
          return () => {
            clearInterval(interval)
          }
        }, [refresh, snapshot?.config?.refreshSeconds])

        useEffect(() => {
          if (!open) return undefined
          function onPointerDown(event) {
            if (rootRef.current !== null && !rootRef.current.contains(event.target)) setOpen(false)
          }
          document.addEventListener('mousedown', onPointerDown)
          return () => {
            document.removeEventListener('mousedown', onPointerDown)
          }
        }, [open])

        useEffect(() => {
          if (flow === null || flow.status !== 'pending') return undefined
          let cancelled = false
          let intervalId = 0
          const schedule = () => {
            intervalId = setTimeout(async () => {
              if (cancelled) return
              try {
                const result = await callApi('/connect/poll', { method: 'POST', body: { id: flow.id } })
                if (cancelled) return
                if (result?.status === 'connected') {
                  setFlow(null)
                  setSnapshot(result.snapshot)
                  setNotice(t('approved'))
                  return
                }
                if (result?.status === 'denied' || result?.status === 'expired' || result?.status === 'error') {
                  setFlow(null)
                  setNotice(
                    result.status === 'denied'
                      ? t('denied')
                      : result.status === 'expired'
                        ? t('expired')
                        : t('failed'),
                  )
                  return
                }
                schedule()
              } catch {
                schedule()
              }
            }, Math.max(2, Number(flow.interval ?? 5)) * 1000)
          }
          schedule()
          return () => {
            cancelled = true
            clearTimeout(intervalId)
          }
        }, [flow, t])
```

</details>

**依据 4 · 源码核查**：[client.js:796-820](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/client.js#L796-L820)

Client 模块注入 slots，将 Overlay 注册到 shell.overlay，并在可用时注册中英文 locale。

<details>
<summary>查看原文（25行）</summary>

```text
    return {
      inject: ['slots'],
      apply(ctx) {
        const locale = ctx.locale
        if (locale !== undefined && locale !== null) {
          ctx.effect(() => locale.register('opencodego', { en, zh }))
        }
        const t =
          locale !== undefined && locale !== null
            ? locale.bind('opencodego')
            : fallbackTranslate(en)
        const Overlay = makeOverlay(t)
        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            {
              name: 'shell.overlay',
              id: 'opencodego-status',
              order: 80,
              label: () => t('title'),
            },
            Overlay,
          ),
        )
      },
    }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比直接打开 OpenCode Console，插件的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

作者主张是一眼查看三档额度、倒计时并从浮层登录。源码支持的增量是把外部订阅仪表嵌入 DSH 的工作表面，同时以 Host 代理持有 token，使浏览器 UI 只接收规范化状态。相对直接打开 Console，它减少的是查看路径和上下文切换，并没有改变 OpenCode 的计量能力或额度规则；取数、认证和数据含义仍归属 OpenCode。没有同任务对照，不能声称节时、提高合格率或比 Console 更可靠。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-28](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/README.md#L8-L28)

作者把价值表述为常驻 pill、展开卡片、设备码登录和静默刷新，并明确数值来自 OpenCode Console。

<details>
<summary>查看原文（21行）</summary>

```text
The collapsed pill lives in the corner of the window and shows the three percentages
with a colour dot per limit. Click it for progress bars, reset countdowns, the renewal
date, and the sign-in controls.

![OpenCode Go usage overlay, expanded card](docs/card.svg)

## What you get

- **Collapsed pill** — `5h · 7d · 30d` percentages, coloured by how close you are to the
  limit (brand → warning from 60% → error from 80%), plus the weekly reset countdown.
- **Expanded card** — one progress bar per limit, `resets in` and `renews in` countdowns,
  Refresh, Sign out, and a link to the OpenCode console.
- **Device-code sign-in** — connect from the overlay; the code is shown in the card and
  approved in the browser. No password is ever typed into the overlay.
- **Silent token refresh** — the stored session is refreshed before it expires.
- **English and Chinese UI**, following the Harness locale service.
- **Theme-aware** — every colour and border comes from the Harness theme tokens, so light
  and dark themes both look native.

The numbers come from the OpenCode Console Go subscription meters, the same source the
console page itself renders.
```

</details>

**依据 2 · 源码核查**：[index.js:102-205](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/index.js#L102-L205)

源码显示插件复用 OpenCode 的认证与 status 数据，将其转换为前端需要的三档 meter，并未创造新的计量来源。

<details>
<summary>查看原文（104行）</summary>

```text
async function fetchGoStatus(accessToken) {
  const response = await fetch(GO_STATUS_URL, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      accept: 'application/json',
    },
    signal: AbortSignal.timeout(20000),
  })
  if (response.status === 401 || response.status === 403) {
    throw new StatusError('reconnect', 'OpenCode rejected the stored session; sign in again.')
  }
  const parsed = await parseResponse(response)
  if (!parsed.ok) {
    throw new StatusError('api', `OpenCode Console answered ${String(response.status)}.`)
  }
  return parsed.data
}

async function refreshSession(state) {
  if (typeof state?.refreshToken !== 'string' || state.refreshToken.length === 0) {
    throw new StatusError('reconnect', 'The stored OpenCode session expired; sign in again.')
  }
  const result = await postForm(DEVICE_TOKEN_URL, {
    grant_type: 'refresh_token',
    refresh_token: state.refreshToken,
    client_id: CLIENT_ID,
  })
  if (!result.ok) {
    throw new StatusError('reconnect', 'The stored OpenCode session expired; sign in again.')
  }
  const next = {
    accessToken: result.data?.access_token,
    refreshToken: result.data?.refresh_token ?? state.refreshToken,
    expiresAt: Date.now() + Number(result.data?.expires_in ?? 0) * 1000,
    orgId: result.data?.org_id ?? state.orgId ?? null,
  }
  if (typeof next.accessToken !== 'string') {
    throw new StatusError('api', 'OpenCode did not return an access token.')
  }
  await writeState(next)
  return next
}

async function currentSession() {
  let state = await readState()
  if (state === null) throw new StatusError('not-connected', 'Not connected to an OpenCode account.')
  if (typeof state.accessToken !== 'string' || state.accessToken.length === 0) {
    throw new StatusError('reconnect', 'The stored OpenCode session is unusable; sign in again.')
  }
  const expiresAt = Number(state.expiresAt ?? 0)
  if (Number.isFinite(expiresAt) && expiresAt > 0 && expiresAt - Date.now() < REFRESH_MARGIN_MS) {
    state = await refreshSession(state)
  }
  return state
}

async function readGoStatus() {
  let state = await currentSession()
  try {
    return await fetchGoStatus(state.accessToken)
  } catch (error) {
    if (error instanceof StatusError && error.code === 'reconnect') {
      state = await refreshSession(state)
      return fetchGoStatus(state.accessToken)
    }
    throw error
  }
}

function normalizeMeters(data) {
  const meters = data?.access?.meters ?? {}
  const definitions = [
    ['fiveHour', 'rolling'],
    ['week', 'weekly'],
    ['month', 'monthly'],
  ]
  return definitions.map(([key, label]) => {
    const meter = meters[key]
    const limit = Number(meter?.limitMicroCents ?? 0)
    const used = Number(meter?.usedMicroCents ?? 0)
    const percent = limit > 0 ? Math.round((used / limit) * 1000) / 10 : 0
    return {
      key,
      label,
      percent,
      usedMicroCents: typeof meter?.usedMicroCents === 'string' ? meter.usedMicroCents : String(used),
      limitMicroCents: typeof meter?.limitMicroCents === 'string' ? meter.limitMicroCents : String(limit),
      resetsAt: typeof meter?.resetsAt === 'string' ? meter.resetsAt : null,
    }
  })
}

function normalizeStatus(data) {
  return {
    ok: true,
    connected: true,
    plan: typeof data?.product === 'string' ? data.product : 'go',
    renewalProduct: typeof data?.renewalProduct === 'string' ? data.renewalProduct : null,
    renewsAt: typeof data?.access?.endsAt === 'string' ? data.access.endsAt : null,
    cancelAtPeriodEnd: data?.access?.cancelAtPeriodEnd === true,
    createdAt: typeof data?.access?.startsAt === 'string' ? data.access.startsAt : null,
    meters: normalizeMeters(data),
    fetchedAt: new Date().toISOString(),
  }
```

</details>

**依据 3 · 源码核查**：[client.js:218-390](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/client.js#L218-L390)

展开卡片集中呈现用量、续费倒计时、刷新、退出与 Console 链接，说明增量主要是工作表面集成。

<details>
<summary>查看原文（173行）</summary>

```text
      function Card(props) {
        const { snapshot, now, onRefresh, onSignOut, onConnect, busy, onClose, settings } = props
        const connected = snapshot?.ok === true
        const plan = snapshot?.plan === 'go-plus' ? t('planGoPlus') : t('planGo')
        const renews = connected ? formatRemaining(snapshot.renewsAt, now) : null
        const rows = connected
          ? snapshot.meters.map((meter) => h(MeterRow, { key: meter.key, meter, now, showResets: settings.showResets }))
          : null

        return h(
          'div',
          {
            role: 'group',
            'aria-label': t('title'),
            style: {
              width: 300,
              borderRadius: 14,
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              background: 'var(--dsw-alias-bg-overlay)',
              border: '1px solid var(--dsw-alias-border-l1)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.28)',
              color: 'var(--dsw-alias-label-primary)',
              fontFamily: 'inherit',
              fontSize: 13,
            },
          },
          h(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: 8 } },
            h('span', { style: { fontWeight: 700, fontSize: 13, flex: 1 } }, t('title')),
            connected
              ? h(
                  'span',
                  {
                    style: {
                      fontSize: 10,
                      padding: '1px 6px',
                      borderRadius: 999,
                      color: 'var(--dsw-alias-brand-primary)',
                      border: '1px solid var(--dsw-alias-brand-primary)',
                      whiteSpace: 'nowrap',
                    },
                  },
                  plan,
                )
              : h(
                  'span',
                  { style: { fontSize: 11, color: 'var(--dsw-alias-label-secondary)' } },
                  t('notConnected'),
                ),
            h(
              'button',
              {
                type: 'button',
                onClick: onClose,
                title: t('close'),
                'aria-label': t('close'),
                style: {
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--dsw-alias-label-secondary)',
                  cursor: 'pointer',
                  fontSize: 14,
                  lineHeight: 1,
                  padding: 2,
                },
              },
              '✕',
            ),
          ),

          rows === null
            ? h(
                'div',
                { style: { display: 'flex', flexDirection: 'column', gap: 10 } },
                h(
                  'div',
                  { style: { fontSize: 12, color: 'var(--dsw-alias-label-secondary)', lineHeight: 1.5 } },
                  t('connectHint'),
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    onClick: onConnect,
                    disabled: busy,
                    style: {
                      alignSelf: 'flex-start',
                      border: '1px solid var(--dsw-alias-brand-primary)',
                      background: 'transparent',
                      color: 'var(--dsw-alias-brand-primary)',
                      padding: '5px 12px',
                      borderRadius: 8,
                      cursor: busy ? 'default' : 'pointer',
                      fontSize: 12,
                      opacity: busy ? 0.6 : 1,
                    },
                  },
                  t('connect'),
                ),
              )
            : rows,

          renews === null
            ? null
            : h(
                'div',
                {
                  style: {
                    fontSize: 11,
                    color: 'var(--dsw-alias-label-secondary)',
                    borderTop: '1px solid var(--dsw-alias-border-l1)',
                    paddingTop: 8,
                  },
                },
                `${t('renewsIn')} ${renews}${formatDate(snapshot.renewsAt) === null ? '' : ` · ${formatDate(snapshot.renewsAt)}`}`,
              ),

          h(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: 10 } },
            h(
              'button',
              {
                type: 'button',
                onClick: onRefresh,
                disabled: busy,
                style: {
                  border: '1px solid var(--dsw-alias-border-l1)',
                  background: 'transparent',
                  color: 'var(--dsw-alias-label-primary)',
                  borderRadius: 8,
                  padding: '4px 10px',
                  fontSize: 11,
                  cursor: busy ? 'default' : 'pointer',
                  opacity: busy ? 0.6 : 1,
                },
              },
              t('refresh'),
            ),
            connected
              ? h(
                  'button',
                  {
                    type: 'button',
                    onClick: onSignOut,
                    style: {
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--dsw-alias-label-secondary)',
                      cursor: 'pointer',
                      fontSize: 11,
                      padding: 0,
                    },
                  },
                  t('signOut'),
                )
              : null,
            h('span', { style: { flex: 1 } }),
            h(
              'a',
              {
                href: 'https://opencode.ai/console',
                target: '_blank',
                rel: 'noreferrer',
                style: { color: 'var(--dsw-alias-label-secondary)', fontSize: 11, textDecoration: 'none' },
              },
              t('openConsole'),
            ),
          ),
```

</details>

#### 缺口

- 缺少同条件下直接 Console 与浮层的用户任务对照
  **影响**：无法判断减少上下文切换是否转化为可测的时间或错误改善
  **进一步探讨**：让同一批用户分别完成一次准确额度判断，记录步骤、端到端耗时、读数一致率和回到原任务的恢复时间

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使“随时准确掌握额度”的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最关键质疑是 2xx 响应的结构漂移会不会被误显示为低用量。README 说未公开 API 改变时会进入错误状态，但 `normalizeMeters` 对缺失或不可解析的 `limitMicroCents` 和 `usedMicroCents` 默认取 0，并仍由 `normalizeStatus` 返回 `ok: true`。因此，若接口仍返回 2xx 但字段改名或缺失，三档 meter 可能显示 0%，而不是显式报错。该静态路径足以确认校验缺口，但没有真实 schema 变化实验，不能声称故障已经发生。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:81-82](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/README.md#L81-L82)

作者明确承认 Console endpoint 未公开，并声称 API 改变时 UI 会降级为错误状态。

```text
> The console endpoint is not a documented public API. If OpenCode changes it, the
> overlay degrades to an error state with a Retry button instead of breaking the UI.
```

**依据 2 · 源码核查**：[index.js:171-205](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/index.js#L171-L205)

规范化逻辑在字段缺失时用 0 代替，并无 schema 完整性检查；normalizeStatus 仍无条件产生 ok true。

<details>
<summary>查看原文（35行）</summary>

```text
function normalizeMeters(data) {
  const meters = data?.access?.meters ?? {}
  const definitions = [
    ['fiveHour', 'rolling'],
    ['week', 'weekly'],
    ['month', 'monthly'],
  ]
  return definitions.map(([key, label]) => {
    const meter = meters[key]
    const limit = Number(meter?.limitMicroCents ?? 0)
    const used = Number(meter?.usedMicroCents ?? 0)
    const percent = limit > 0 ? Math.round((used / limit) * 1000) / 10 : 0
    return {
      key,
      label,
      percent,
      usedMicroCents: typeof meter?.usedMicroCents === 'string' ? meter.usedMicroCents : String(used),
      limitMicroCents: typeof meter?.limitMicroCents === 'string' ? meter.limitMicroCents : String(limit),
      resetsAt: typeof meter?.resetsAt === 'string' ? meter.resetsAt : null,
    }
  })
}

function normalizeStatus(data) {
  return {
    ok: true,
    connected: true,
    plan: typeof data?.product === 'string' ? data.product : 'go',
    renewalProduct: typeof data?.renewalProduct === 'string' ? data.renewalProduct : null,
    renewsAt: typeof data?.access?.endsAt === 'string' ? data.access.endsAt : null,
    cancelAtPeriodEnd: data?.access?.cancelAtPeriodEnd === true,
    createdAt: typeof data?.access?.startsAt === 'string' ? data.access.startsAt : null,
    meters: normalizeMeters(data),
    fetchedAt: new Date().toISOString(),
  }
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效与失败恢复分别依赖什么，负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动必需 DSH Web 客户端加载机制、`webServer` 与 `shell.overlay`，并按 bundle patch 装配 Host/Client。显示真实用量还必须有 OpenCode Go 账号、对 `opencode.ai` 的网络访问和设备码批准。持续使用依赖未公开 Console 端点、可刷新的 session、本地可写 DSH_HOME 和周期轮询。失效后 UI 可重试或重新登录，退出会删除本地状态；没有版本锁或兼容适配层。作者声明兼容 DSH 0.2.x，但本轮只核对声明和接线，没有宿主加载证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-54](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/README.md#L30-L54)

作者列出 DSH 0.2.x、OpenCode Go 订阅、设备码批准和 Host 本地 session 作为使用条件。

<details>
<summary>查看原文（25行）</summary>

````text
## Requirements

- DeepSeek Harness Web UI (`0.2.x`).
- An **OpenCode Go** subscription. The overlay reads the Go plan meters; it shows
  `Not connected` when no OpenCode session is stored, and an error state when the
  subscription is missing or the API changes.

## Install

```sh
dsh plugin --profile web add github:Assidefok/dsh-opencodego-status
```

Then refresh the Harness Web UI. A small pill appears in the top-right corner.

### Connect

1. Click the pill, then **Connect**.
2. The card shows a short code (for example `GNNM-XQHS`) and an **Open approval page**
   button. Approve the device in the browser.
3. The overlay switches to your live usage as soon as the console confirms.

The session is stored locally at `$DSH_HOME/opencodego-status/state.json` with `0600`
permissions (`$DSH_HOME` defaults to `~/.dsh`). **Sign out** in the card deletes it.
Tokens are sent only to `opencode.ai`; the browser half never receives them.
````

</details>

**依据 2 · 源码核查**：[package.json:18-42](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/package.json#L18-L42)

包入口声明 Host、Client、locale 与 icon，并要求 web 平台立即加载及注入 UI layout。

<details>
<summary>查看原文（25行）</summary>

```text
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg"
  },
  "files": [
    "index.js",
    "client.js",
    "cordis.patch.yml",
    "locale/*.json",
    "icon.svg"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-ui-layout"
      ]
    }
  }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-8](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/cordis.patch.yml#L1-L8)

bundle patch 设置默认启用、位置、60 秒刷新和重置时间显示。

```text
- insert:
    - id: opencodego-status
      name: dsh-opencodego-status
      config:
        enabled: true
        position: top-right
        refreshSeconds: 60
        showResets: true
```

**依据 4 · 源码核查**：[index.js:120-169](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/index.js#L120-L169)

Host 负责 refresh token 恢复，缺失或被拒绝时要求重新登录。

<details>
<summary>查看原文（50行）</summary>

```text
async function refreshSession(state) {
  if (typeof state?.refreshToken !== 'string' || state.refreshToken.length === 0) {
    throw new StatusError('reconnect', 'The stored OpenCode session expired; sign in again.')
  }
  const result = await postForm(DEVICE_TOKEN_URL, {
    grant_type: 'refresh_token',
    refresh_token: state.refreshToken,
    client_id: CLIENT_ID,
  })
  if (!result.ok) {
    throw new StatusError('reconnect', 'The stored OpenCode session expired; sign in again.')
  }
  const next = {
    accessToken: result.data?.access_token,
    refreshToken: result.data?.refresh_token ?? state.refreshToken,
    expiresAt: Date.now() + Number(result.data?.expires_in ?? 0) * 1000,
    orgId: result.data?.org_id ?? state.orgId ?? null,
  }
  if (typeof next.accessToken !== 'string') {
    throw new StatusError('api', 'OpenCode did not return an access token.')
  }
  await writeState(next)
  return next
}

async function currentSession() {
  let state = await readState()
  if (state === null) throw new StatusError('not-connected', 'Not connected to an OpenCode account.')
  if (typeof state.accessToken !== 'string' || state.accessToken.length === 0) {
    throw new StatusError('reconnect', 'The stored OpenCode session is unusable; sign in again.')
  }
  const expiresAt = Number(state.expiresAt ?? 0)
  if (Number.isFinite(expiresAt) && expiresAt > 0 && expiresAt - Date.now() < REFRESH_MARGIN_MS) {
    state = await refreshSession(state)
  }
  return state
}

async function readGoStatus() {
  let state = await currentSession()
  try {
    return await fetchGoStatus(state.accessToken)
  } catch (error) {
    if (error instanceof StatusError && error.code === 'reconnect') {
      state = await refreshSession(state)
      return fetchGoStatus(state.accessToken)
    }
    throw error
  }
}
```

</details>

**依据 5 · 源码核查**：[client.js:686-699](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/client.js#L686-L699)

退出动作调用 Host disconnect，清理客户端状态后强制刷新以进入未连接态。

<details>
<summary>查看原文（14行）</summary>

```text
        const signOut = useCallback(async () => {
          setBusy(true)
          try {
            await callApi('/disconnect', { method: 'POST' })
            setSnapshot(null)
            setFlow(null)
            setNotice(t('signedOut'))
            await refresh(true)
          } catch (failure) {
            setError(failure instanceof Error ? failure.message : String(failure))
          } finally {
            setBusy(false)
          }
        }, [refresh, t])
```

</details>

#### 缺口

- DSH 0.2.x 的实际 Host/Client API 兼容和升级恢复未验证
  **影响**：源码接线存在不等于插件可在目标宿主加载并持续工作
  **进一步探讨**：在隔离 profile 核对安装、刷新、断线、重登、禁用、卸载和 DSH 小版本升级后的行为

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成一次准确额度判断是否更有效，首次、持续与失败恢复的总成本是什么？

**研究主题**：效果与总成本

#### 完整回答

源码支持“少一次离开 DSH 打开 Console”的路径缩短，并以 15 至 3600 秒周期刷新、Host 最长 60 秒成功缓存提供近实时展示；没有实测证明信息更准确或端到端更快。首次使用需要安装、刷新 Web UI、设备码批准并授予本地状态写入。持续成本包括 OpenCode Go 订阅、周期网络请求、token 持久化与偶发重登。失败恢复需要用户识别错误、重试或断开重连；结构漂移还可能形成错误的 0% 而没有显式恢复入口。金额、请求量、操作时长、节时、成功率和单位合格任务成本都未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:37-54](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/README.md#L37-L54)

作者安装与连接步骤显示首次使用至少包含安装、页面刷新、设备码批准和本地 session 持久化。

<details>
<summary>查看原文（18行）</summary>

````text
## Install

```sh
dsh plugin --profile web add github:Assidefok/dsh-opencodego-status
```

Then refresh the Harness Web UI. A small pill appears in the top-right corner.

### Connect

1. Click the pill, then **Connect**.
2. The card shows a short code (for example `GNNM-XQHS`) and an **Open approval page**
   button. Approve the device in the browser.
3. The overlay switches to your live usage as soon as the console confirms.

The session is stored locally at `$DSH_HOME/opencodego-status/state.json` with `0600`
permissions (`$DSH_HOME` defaults to `~/.dsh`). **Sign out** in the card deletes it.
Tokens are sent only to `opencode.ai`; the browser half never receives them.
````

</details>

**依据 2 · 源码核查**：[index.js:208-300](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/index.js#L208-L300)

Host 把刷新周期限制为 15 至 3600 秒，成功状态缓存最多 60 秒，错误状态不缓存。

<details>
<summary>查看原文（93行）</summary>

```text
function readConfig(raw) {
  const source = raw !== null && typeof raw === 'object' ? raw : {}
  const positions = new Set(['top-right', 'top-left', 'bottom-right', 'bottom-left'])
  const refreshSeconds = Number(source.refreshSeconds)
  return {
    enabled: source.enabled !== false,
    position: positions.has(source.position) ? source.position : 'top-right',
    refreshSeconds:
      Number.isFinite(refreshSeconds) && refreshSeconds >= 15 && refreshSeconds <= 3600
        ? Math.round(refreshSeconds)
        : 60,
    showResets: source.showResets !== false,
  }
}

function sendJson(response, statusCode, body) {
  const text = JSON.stringify(body)
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(text),
  })
  response.end(text)
}

async function readJsonBody(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > 64 * 1024) throw new StatusError('error', 'Request body too large.', 413)
    chunks.push(chunk)
  }
  if (size === 0) return {}
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    return value !== null && typeof value === 'object' ? value : {}
  } catch {
    throw new StatusError('error', 'Request body must be JSON.', 400)
  }
}

export const name = 'dsh-opencodego-status'
export const inject = ['webServer']

export function apply(ctx, config) {
  const settings = readConfig(config)
  const pending = new Map()
  let cache = null
  let cachedAt = 0

  const cacheTtl = Math.max(5, Math.min(settings.refreshSeconds, 60)) * 1000

  function prunePending() {
    const now = Date.now()
    for (const [id, entry] of pending) {
      if (entry.expiresAt <= now) pending.delete(id)
    }
  }

  async function statusPayload() {
    try {
      const data = await readGoStatus()
      return { ...normalizeStatus(data), config: settings }
    } catch (error) {
      if (error instanceof StatusError) {
        return { ok: false, connected: false, code: error.code, message: error.message, config: settings }
      }
      ctx.logger?.warn?.(`opencodego-status: ${error instanceof Error ? error.message : String(error)}`)
      return {
        ok: false,
        connected: false,
        code: 'error',
        message: 'Could not reach the OpenCode Console.',
        config: settings,
      }
    }
  }

  async function handleStatus(response, force) {
    if (!force && cache !== null && Date.now() - cachedAt < cacheTtl) {
      sendJson(response, 200, cache)
      return
    }
    const payload = await statusPayload()
    if (payload.ok) {
      cache = payload
      cachedAt = Date.now()
    } else {
      cache = null
      cachedAt = 0
    }
    sendJson(response, 200, payload)
```

</details>

**依据 3 · 源码核查**：[client.js:571-699](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/client.js#L571-L699)

Client 定时拉取状态，设备批准阶段循环轮询，并提供强制刷新和退出操作，形成持续请求与恢复负担。

<details>
<summary>查看原文（129行）</summary>

```text
        const refresh = useCallback(async (force) => {
          try {
            const payload = await callApi(`/status${force === true ? '?fresh=1' : ''}`)
            setError(null)
            setSnapshot(payload)
          } catch (failure) {
            setError(failure instanceof Error ? failure.message : String(failure))
          }
        }, [])

        useEffect(() => {
          refresh(false)
          const interval = setInterval(() => {
            setTick((value) => value + 1)
          }, 30000)
          return () => {
            clearInterval(interval)
          }
        }, [refresh])

        useEffect(() => {
          const seconds = Number(snapshot?.config?.refreshSeconds ?? 60)
          const interval = setInterval(() => {
            refresh(false)
          }, Math.max(15, Math.min(Number.isFinite(seconds) ? seconds : 60, 3600)) * 1000)
          return () => {
            clearInterval(interval)
          }
        }, [refresh, snapshot?.config?.refreshSeconds])

        useEffect(() => {
          if (!open) return undefined
          function onPointerDown(event) {
            if (rootRef.current !== null && !rootRef.current.contains(event.target)) setOpen(false)
          }
          document.addEventListener('mousedown', onPointerDown)
          return () => {
            document.removeEventListener('mousedown', onPointerDown)
          }
        }, [open])

        useEffect(() => {
          if (flow === null || flow.status !== 'pending') return undefined
          let cancelled = false
          let intervalId = 0
          const schedule = () => {
            intervalId = setTimeout(async () => {
              if (cancelled) return
              try {
                const result = await callApi('/connect/poll', { method: 'POST', body: { id: flow.id } })
                if (cancelled) return
                if (result?.status === 'connected') {
                  setFlow(null)
                  setSnapshot(result.snapshot)
                  setNotice(t('approved'))
                  return
                }
                if (result?.status === 'denied' || result?.status === 'expired' || result?.status === 'error') {
                  setFlow(null)
                  setNotice(
                    result.status === 'denied'
                      ? t('denied')
                      : result.status === 'expired'
                        ? t('expired')
                        : t('failed'),
                  )
                  return
                }
                schedule()
              } catch {
                schedule()
              }
            }, Math.max(2, Number(flow.interval ?? 5)) * 1000)
          }
          schedule()
          return () => {
            cancelled = true
            clearTimeout(intervalId)
          }
        }, [flow, t])

        useEffect(() => {
          if (notice === null) return undefined
          const id = setTimeout(() => {
            setNotice(null)
          }, 4000)
          return () => {
            clearTimeout(id)
          }
        }, [notice])

        const startConnect = useCallback(async () => {
          setBusy(true)
          setError(null)
          try {
            const payload = await callApi('/connect/start', { method: 'POST' })
            if (payload?.ok === true) {
              setFlow({
                id: payload.id,
                userCode: payload.userCode,
                verificationUri: payload.verificationUri,
                interval: payload.interval ?? 5,
                expiresAt: Date.now() + Number(payload.expiresIn ?? 600) * 1000,
                status: 'pending',
              })
            } else {
              setError(payload?.message ?? t('failed'))
            }
          } catch (failure) {
            setError(failure instanceof Error ? failure.message : String(failure))
          } finally {
            setBusy(false)
          }
        }, [t])

        const signOut = useCallback(async () => {
          setBusy(true)
          try {
            await callApi('/disconnect', { method: 'POST' })
            setSnapshot(null)
            setFlow(null)
            setNotice(t('signedOut'))
            await refresh(true)
          } catch (failure) {
            setError(failure instanceof Error ? failure.message : String(failure))
          } finally {
            setBusy(false)
          }
        }, [refresh, t])
```

</details>

#### 缺口

- 没有同条件任务、请求量、失败率、人工时间或价格分摊记录
  **影响**：无法计算单位合格任务成本、节时、ROI 或持续网络负担
  **进一步探讨**：以准确读出三档额度为合格任务，记录直接 Console 与浮层各自的尝试数、耗时、请求数、错误、重试和人工复核

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠且可维护，哪些设计可借鉴、移植要付出什么？

**研究主题**：工程质量与复用

#### 完整回答

Host/Client 分层、外部请求 20 秒超时、成功响应缓存、请求体上限、临时文件后 rename、统一 JSON `no-store` 响应，以及 effect disposer 都是明确且可复用的集成做法。主要维护风险有四项：私有 API 没有响应 schema 校验；同一进程并发写 session 共用 `${file}.${process.pid}.tmp`，理论上可能争用；设备端返回 `slow_down` 时 Host 只回传增加后的 interval，Client 没有把它写回 flow，后续仍按旧 interval 调度；status、refresh、connect 与 disconnect 都由插件直接挂到 webServer 前缀，插件自身未见会话鉴权、CSRF token 或来源校验。最后一项不证明端点可被利用，因为宿主可能在统一路由层提供保护，但固定源码无法确认浏览器侧连接、刷新和退出等副作用端点是否继承了这种保护。固定树没有测试脚本或测试文件，本轮也未运行，因此只能评价静态设计，不能确认竞态、协议或路由保护行为。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:52-93](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/index.js#L52-L93)

状态写入采用临时文件和 rename，外部 POST 使用 20 秒超时；临时文件名只含进程 PID。

<details>
<summary>查看原文（42行）</summary>

```text
async function writeState(state) {
  const dir = stateDir()
  await mkdir(dir, { recursive: true })
  const file = statePath()
  const tmp = `${file}.${process.pid}.tmp`
  await writeFile(tmp, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 })
  await rename(tmp, file)
}

async function clearState() {
  try {
    await unlink(statePath())
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
}

async function parseResponse(response) {
  const text = await response.text()
  let data = null
  if (text.length > 0) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text.slice(0, 500) }
    }
  }
  return { ok: response.ok, status: response.status, data }
}

async function postForm(url, params) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
    },
    body: new URLSearchParams(params).toString(),
    signal: AbortSignal.timeout(20000),
  })
  return parseResponse(response)
}
```

</details>

**依据 2 · 源码核查**：[index.js:223-300](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/index.js#L223-L300)

JSON 响应禁用缓存、限制请求体 64 KiB，并只缓存成功 status payload。

<details>
<summary>查看原文（78行）</summary>

```text
function sendJson(response, statusCode, body) {
  const text = JSON.stringify(body)
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': Buffer.byteLength(text),
  })
  response.end(text)
}

async function readJsonBody(request) {
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > 64 * 1024) throw new StatusError('error', 'Request body too large.', 413)
    chunks.push(chunk)
  }
  if (size === 0) return {}
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    return value !== null && typeof value === 'object' ? value : {}
  } catch {
    throw new StatusError('error', 'Request body must be JSON.', 400)
  }
}

export const name = 'dsh-opencodego-status'
export const inject = ['webServer']

export function apply(ctx, config) {
  const settings = readConfig(config)
  const pending = new Map()
  let cache = null
  let cachedAt = 0

  const cacheTtl = Math.max(5, Math.min(settings.refreshSeconds, 60)) * 1000

  function prunePending() {
    const now = Date.now()
    for (const [id, entry] of pending) {
      if (entry.expiresAt <= now) pending.delete(id)
    }
  }

  async function statusPayload() {
    try {
      const data = await readGoStatus()
      return { ...normalizeStatus(data), config: settings }
    } catch (error) {
      if (error instanceof StatusError) {
        return { ok: false, connected: false, code: error.code, message: error.message, config: settings }
      }
      ctx.logger?.warn?.(`opencodego-status: ${error instanceof Error ? error.message : String(error)}`)
      return {
        ok: false,
        connected: false,
        code: 'error',
        message: 'Could not reach the OpenCode Console.',
        config: settings,
      }
    }
  }

  async function handleStatus(response, force) {
    if (!force && cache !== null && Date.now() - cachedAt < cacheTtl) {
      sendJson(response, 200, cache)
      return
    }
    const payload = await statusPayload()
    if (payload.ok) {
      cache = payload
      cachedAt = Date.now()
    } else {
      cache = null
      cachedAt = 0
    }
    sendJson(response, 200, payload)
```

</details>

**依据 3 · 源码核查**：[index.js:330-386](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/index.js#L330-L386)

设备轮询识别 pending、slow_down、denied 和 expired；slow_down 只把新 interval 写入响应，没有更新 pending entry。

<details>
<summary>查看原文（57行）</summary>

```text
  async function handleConnectPoll(request, response) {
    const body = await readJsonBody(request)
    const id = typeof body.id === 'string' ? body.id : ''
    const entry = pending.get(id)
    if (entry === undefined) {
      sendJson(response, 200, { ok: true, status: 'expired' })
      return
    }
    if (entry.expiresAt <= Date.now()) {
      pending.delete(id)
      sendJson(response, 200, { ok: true, status: 'expired' })
      return
    }
    const result = await postForm(DEVICE_TOKEN_URL, {
      grant_type: POLL_GRANT,
      device_code: entry.deviceCode,
      client_id: CLIENT_ID,
    })
    if (result.ok && typeof result.data?.access_token === 'string') {
      pending.delete(id)
      const state = {
        accessToken: result.data.access_token,
        refreshToken: result.data.refresh_token ?? null,
        expiresAt: Date.now() + Number(result.data.expires_in ?? 0) * 1000,
        orgId: result.data.org_id ?? null,
      }
      await writeState(state)
      cache = null
      cachedAt = 0
      const payload = await statusPayload()
      sendJson(response, 200, { ok: true, status: 'connected', snapshot: payload })
      return
    }
    const code = typeof result.data?.error === 'string' ? result.data.error : ''
    if (code === 'authorization_pending') {
      sendJson(response, 200, { ok: true, status: 'pending' })
      return
    }
    if (code === 'slow_down') {
      sendJson(response, 200, { ok: true, status: 'pending', interval: entry.interval + 5 })
      return
    }
    if (code === 'access_denied') {
      pending.delete(id)
      sendJson(response, 200, { ok: true, status: 'denied' })
      return
    }
    if (code === 'expired_token') {
      pending.delete(id)
      sendJson(response, 200, { ok: true, status: 'expired' })
      return
    }
    sendJson(response, 200, {
      ok: false,
      status: 'error',
      message: 'The OpenCode sign-in could not be completed.',
    })
```

</details>

**依据 4 · 源码核查**：[index.js:396-429](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/index.js#L396-L429)

插件把 status、refresh、connect 和 disconnect 直接分派到 webServer 前缀；本段未见插件级会话鉴权、CSRF token 或来源校验，但不能据此排除宿主统一保护。

<details>
<summary>查看原文（34行）</summary>

```text
  async function route(request, response) {
    const url = new URL(request.url ?? '/', 'http://localhost')
    const suffix = url.pathname.slice(ROUTE_PREFIX.length) || '/'
    const method = request.method ?? 'GET'

    if (suffix === '/status' && method === 'GET') {
      await handleStatus(response, url.searchParams.get('fresh') === '1')
      return
    }
    if (suffix === '/refresh' && method === 'POST') {
      await handleStatus(response, true)
      return
    }
    if (suffix === '/connect/start' && method === 'POST') {
      await handleConnectStart(response)
      return
    }
    if (suffix === '/connect/poll' && method === 'POST') {
      await handleConnectPoll(request, response)
      return
    }
    if (suffix === '/disconnect' && method === 'POST') {
      await handleDisconnect(response)
      return
    }
    sendJson(response, 404, { ok: false, code: 'not-found', message: 'Unknown endpoint.' })
  }

  ctx.effect(() => {
    const dispose = ctx.webServer.register({
      kind: 'prefix',
      path: ROUTE_PREFIX,
      handler(request, response) {
        route(request, response).catch((error) => {
```

</details>

**依据 5 · 源码核查**：[client.js:612-650](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/client.js#L612-L650)

Client 轮询始终以 flow.interval 调度，收到 slow_down 后没有更新 flow，因此静态路径上仍沿用旧间隔。

<details>
<summary>查看原文（39行）</summary>

```text
        useEffect(() => {
          if (flow === null || flow.status !== 'pending') return undefined
          let cancelled = false
          let intervalId = 0
          const schedule = () => {
            intervalId = setTimeout(async () => {
              if (cancelled) return
              try {
                const result = await callApi('/connect/poll', { method: 'POST', body: { id: flow.id } })
                if (cancelled) return
                if (result?.status === 'connected') {
                  setFlow(null)
                  setSnapshot(result.snapshot)
                  setNotice(t('approved'))
                  return
                }
                if (result?.status === 'denied' || result?.status === 'expired' || result?.status === 'error') {
                  setFlow(null)
                  setNotice(
                    result.status === 'denied'
                      ? t('denied')
                      : result.status === 'expired'
                        ? t('expired')
                        : t('failed'),
                  )
                  return
                }
                schedule()
              } catch {
                schedule()
              }
            }, Math.max(2, Number(flow.interval ?? 5)) * 1000)
          }
          schedule()
          return () => {
            cancelled = true
            clearTimeout(intervalId)
          }
        }, [flow, t])
```

</details>

**依据 6 · 源码核查**：[package.json:1-42](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/package.json#L1-L42)

固定 package 只有元数据、exports、files 和 DSH 配置，没有 scripts 或测试命令。

<details>
<summary>查看原文（42行）</summary>

```text
{
  "name": "dsh-opencodego-status",
  "version": "0.1.0",
  "type": "module",
  "description": "Floating overlay with OpenCode Go rolling (5-hour), weekly and monthly usage.",
  "license": "MIT",
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "opencode",
    "opencode-go",
    "usage"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Assidefok/dsh-opencodego-status.git"
  },
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./locale/*.json": "./locale/*.json",
    "./icon": "./icon.svg"
  },
  "files": [
    "index.js",
    "client.js",
    "cordis.patch.yml",
    "locale/*.json",
    "icon.svg"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-ui-layout"
      ]
    }
  }
```

</details>

#### 缺口

- 并发刷新、slow_down、状态写入竞态和异常响应没有可执行验证
  **影响**：不能把静态风险写成已复现故障，也不能确认恢复可靠
  **进一步探讨**：用 fake server 与并发状态请求观察实际轮询间隔、临时文件、最终 session 和 UI 错误状态
- 宿主 webServer 是否统一提供会话鉴权、CSRF 或来源保护未知
  **影响**：插件自身未见保护不等于存在可利用漏洞，但无法确认连接、刷新和退出等浏览器侧副作用端点的实际安全边界
  **进一步探讨**：在隔离 Host 中分别以未登录、跨来源和缺少防伪凭据的请求访问前缀路由，确认宿主拒绝策略和适用范围

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与关键缺口可推导什么新方向，如何支持或推翻？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是为 OpenCode 响应建立显式 schema 守卫，并把“新鲜度、字段完整性、最近成功时间”作为 UI 状态，可让嵌入式额度浮层比当前宽松归一化更值得信任。推导链是：插件价值依赖一眼判断；私有 API 可能变化；当前缺失字段会归零且仍成功；因此准确性状态应与用量数值同等显著。最小实验用固定 fake server 返回正常、字段缺失、类型错误、超时和旧缓存五类响应。成功标准是只有完整合法响应显示百分比，其余显示明确的不可用或陈旧状态且保留最近成功时间；若这种校验导致合法响应频繁误拒绝，或真实 API 有稳定公开契约使漂移风险消失，假设价值会减弱。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-35](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/README.md#L27-L35)

作者把 Console meter 作为唯一数据源，同时承认没有订阅或 API 变化会影响显示。

```text
The numbers come from the OpenCode Console Go subscription meters, the same source the
console page itself renders.

## Requirements

- DeepSeek Harness Web UI (`0.2.x`).
- An **OpenCode Go** subscription. The overlay reads the Go plan meters; it shows
  `Not connected` when no OpenCode session is stored, and an error state when the
  subscription is missing or the API changes.
```

**依据 2 · 源码核查**：[index.js:69-118](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/index.js#L69-L118)

响应解析只保证 JSON 可解析与 HTTP 成功，不对 status payload 的字段结构做验证。

<details>
<summary>查看原文（50行）</summary>

```text
async function parseResponse(response) {
  const text = await response.text()
  let data = null
  if (text.length > 0) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { raw: text.slice(0, 500) }
    }
  }
  return { ok: response.ok, status: response.status, data }
}

async function postForm(url, params) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
    },
    body: new URLSearchParams(params).toString(),
    signal: AbortSignal.timeout(20000),
  })
  return parseResponse(response)
}

/** Turn the device-flow relative URI into an absolute console URL. */
function toAbsolute(target) {
  if (typeof target !== 'string' || target.length === 0) return `${ORIGIN}/console/device`
  if (/^https?:\/\//u.test(target)) return target
  return `${ORIGIN}${target.startsWith('/') ? '' : '/'}${target}`
}

async function fetchGoStatus(accessToken) {
  const response = await fetch(GO_STATUS_URL, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      accept: 'application/json',
    },
    signal: AbortSignal.timeout(20000),
  })
  if (response.status === 401 || response.status === 403) {
    throw new StatusError('reconnect', 'OpenCode rejected the stored session; sign in again.')
  }
  const parsed = await parseResponse(response)
  if (!parsed.ok) {
    throw new StatusError('api', `OpenCode Console answered ${String(response.status)}.`)
  }
  return parsed.data
}
```

</details>

**依据 3 · 源码核查**：[index.js:171-205](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/index.js#L171-L205)

缺失 meter 值被规范化为 0，构成提出 schema 守卫与数据新鲜度状态的直接推导依据。

<details>
<summary>查看原文（35行）</summary>

```text
function normalizeMeters(data) {
  const meters = data?.access?.meters ?? {}
  const definitions = [
    ['fiveHour', 'rolling'],
    ['week', 'weekly'],
    ['month', 'monthly'],
  ]
  return definitions.map(([key, label]) => {
    const meter = meters[key]
    const limit = Number(meter?.limitMicroCents ?? 0)
    const used = Number(meter?.usedMicroCents ?? 0)
    const percent = limit > 0 ? Math.round((used / limit) * 1000) / 10 : 0
    return {
      key,
      label,
      percent,
      usedMicroCents: typeof meter?.usedMicroCents === 'string' ? meter.usedMicroCents : String(used),
      limitMicroCents: typeof meter?.limitMicroCents === 'string' ? meter.limitMicroCents : String(limit),
      resetsAt: typeof meter?.resetsAt === 'string' ? meter.resetsAt : null,
    }
  })
}

function normalizeStatus(data) {
  return {
    ok: true,
    connected: true,
    plan: typeof data?.product === 'string' ? data.product : 'go',
    renewalProduct: typeof data?.renewalProduct === 'string' ? data.renewalProduct : null,
    renewsAt: typeof data?.access?.endsAt === 'string' ? data.access.endsAt : null,
    cancelAtPeriodEnd: data?.access?.cancelAtPeriodEnd === true,
    createdAt: typeof data?.access?.startsAt === 'string' ? data.access.startsAt : null,
    meters: normalizeMeters(data),
    fetchedAt: new Date().toISOString(),
  }
```

</details>

**依据 4 · 源码核查**：[client.js:703-737](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/client.js#L703-L737)

Client 已有整体错误态与 Retry UI，可以作为显式数据不可用状态的承载位置。

<details>
<summary>查看原文（35行）</summary>

```text
        if (error !== null && snapshot === null) {
          return h(
            'div',
            { ref: rootRef, style: cornerStyle(settings.position) },
            h(
              'button',
              {
                type: 'button',
                onClick: () => refresh(true),
                title: t('errorTitle'),
                style: {
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 10px',
                  borderRadius: 999,
                  background: 'var(--dsw-alias-bg-overlay)',
                  border: '1px solid var(--dsw-alias-state-error-primary)',
                  color: 'var(--dsw-alias-label-primary)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 11,
                },
              },
              h('span', {
                style: {
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: 'var(--dsw-alias-state-error-primary)',
                },
              }),
              `${t('errorTitle')} · ${t('retry')}`,
            ),
          )
```

</details>

#### 缺口

- schema 守卫与新鲜度状态尚未实现或实验
  **影响**：假设仍不能算插件已有贡献，也不知道严格校验是否会误拒绝合法响应
  **进一步探讨**：先以 fake server 完成响应矩阵，再用受控真实响应样本估计误拒绝率和误显示率

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对什么人值得观察、试用或持续安装，成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

当前结论为观察，不是安装或试用推荐。它适合频繁在 DSH Web 工作、已有 OpenCode Go 且愿意先验证私有接口的技术用户关注；不适合把额度显示用于自动预算控制、要求审计级准确性、没有 Go 订阅或不愿在 Host 保存 refresh token 的用户。若要改变为试用，先在隔离 profile 检查挂载、文件权限、登录/退出、三档数据与 Console 一致、字段缺失是否显式失败，并确认宿主会拒绝未登录、跨来源或缺少防伪凭据的副作用路由请求。成功标准是多轮刷新数值与 Console 一致，断线、过期和 schema 异常不显示误导性 0%，且 Host 的统一路由保护能够覆盖 connect、refresh 与 disconnect；出现静默归零、无法清除 session、路由保护缺失或兼容失败即停止。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-54](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/README.md#L30-L54)

作者限定 DSH 0.2.x 与 Go 订阅，并说明 token 的本地保存和退出删除行为。

<details>
<summary>查看原文（25行）</summary>

````text
## Requirements

- DeepSeek Harness Web UI (`0.2.x`).
- An **OpenCode Go** subscription. The overlay reads the Go plan meters; it shows
  `Not connected` when no OpenCode session is stored, and an error state when the
  subscription is missing or the API changes.

## Install

```sh
dsh plugin --profile web add github:Assidefok/dsh-opencodego-status
```

Then refresh the Harness Web UI. A small pill appears in the top-right corner.

### Connect

1. Click the pill, then **Connect**.
2. The card shows a short code (for example `GNNM-XQHS`) and an **Open approval page**
   button. Approve the device in the browser.
3. The overlay switches to your live usage as soon as the console confirms.

The session is stored locally at `$DSH_HOME/opencodego-status/state.json` with `0600`
permissions (`$DSH_HOME` defaults to `~/.dsh`). **Sign out** in the card deletes it.
Tokens are sent only to `opencode.ai`; the browser half never receives them.
````

</details>

**依据 2 · 作者声明**：[README.md:70-82](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/README.md#L70-L82)

作者描述 Host/Client 边界并明确使用未公开 Console API，要求采用判断保留接口风险。

<details>
<summary>查看原文（13行）</summary>

```text
## How it works

- The **host half** (`index.js`) registers a prefix route at
  `/api/opencodego-status` and talks to the OpenCode Console:
  `<origin>/console/auth/device/code`, `<origin>/console/auth/device/token` (device
  grant and refresh grant) and `<origin>/console/api/go/status`.
- The **client half** (`client.js`) registers one entry in the `shell.overlay` slot and
  polls `/api/opencodego-status/status`. It never sees an access token.
- No dependencies, no build step: the client module is plain JavaScript and React comes
  from the Harness browser module table.

> The console endpoint is not a documented public API. If OpenCode changes it, the
> overlay degrades to an error state with a Retry button instead of breaking the UI.
```

</details>

**依据 3 · 源码核查**：[index.js:171-205](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/index.js#L171-L205)

缺失数据归零而仍返回成功，足以阻止把源码级候选直接推荐为预算决策工具。

<details>
<summary>查看原文（35行）</summary>

```text
function normalizeMeters(data) {
  const meters = data?.access?.meters ?? {}
  const definitions = [
    ['fiveHour', 'rolling'],
    ['week', 'weekly'],
    ['month', 'monthly'],
  ]
  return definitions.map(([key, label]) => {
    const meter = meters[key]
    const limit = Number(meter?.limitMicroCents ?? 0)
    const used = Number(meter?.usedMicroCents ?? 0)
    const percent = limit > 0 ? Math.round((used / limit) * 1000) / 10 : 0
    return {
      key,
      label,
      percent,
      usedMicroCents: typeof meter?.usedMicroCents === 'string' ? meter.usedMicroCents : String(used),
      limitMicroCents: typeof meter?.limitMicroCents === 'string' ? meter.limitMicroCents : String(limit),
      resetsAt: typeof meter?.resetsAt === 'string' ? meter.resetsAt : null,
    }
  })
}

function normalizeStatus(data) {
  return {
    ok: true,
    connected: true,
    plan: typeof data?.product === 'string' ? data.product : 'go',
    renewalProduct: typeof data?.renewalProduct === 'string' ? data.renewalProduct : null,
    renewsAt: typeof data?.access?.endsAt === 'string' ? data.access.endsAt : null,
    cancelAtPeriodEnd: data?.access?.cancelAtPeriodEnd === true,
    createdAt: typeof data?.access?.startsAt === 'string' ? data.access.startsAt : null,
    meters: normalizeMeters(data),
    fetchedAt: new Date().toISOString(),
  }
```

</details>

**依据 4 · 源码核查**：[index.js:396-429](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/index.js#L396-L429)

浏览器侧副作用路由在插件代码中未见鉴权、CSRF 或来源校验；采用前必须确认宿主统一保护，而不能把静态缺口直接称为漏洞。

<details>
<summary>查看原文（34行）</summary>

```text
  async function route(request, response) {
    const url = new URL(request.url ?? '/', 'http://localhost')
    const suffix = url.pathname.slice(ROUTE_PREFIX.length) || '/'
    const method = request.method ?? 'GET'

    if (suffix === '/status' && method === 'GET') {
      await handleStatus(response, url.searchParams.get('fresh') === '1')
      return
    }
    if (suffix === '/refresh' && method === 'POST') {
      await handleStatus(response, true)
      return
    }
    if (suffix === '/connect/start' && method === 'POST') {
      await handleConnectStart(response)
      return
    }
    if (suffix === '/connect/poll' && method === 'POST') {
      await handleConnectPoll(request, response)
      return
    }
    if (suffix === '/disconnect' && method === 'POST') {
      await handleDisconnect(response)
      return
    }
    sendJson(response, 404, { ok: false, code: 'not-found', message: 'Unknown endpoint.' })
  }

  ctx.effect(() => {
    const dispose = ctx.webServer.register({
      kind: 'prefix',
      path: ROUTE_PREFIX,
      handler(request, response) {
        route(request, response).catch((error) => {
```

</details>

**依据 5 · 源码核查**：[client.js:560-699](https://github.com/Assidefok/dsh-opencodego-status/blob/b1a2d09dcf975be0284230c9ce8e27982b8d752c/client.js#L560-L699)

Client 提供刷新、设备批准与退出路径，但其真实宿主表现和服务兼容未验证。

<details>
<summary>查看原文（140行）</summary>

```text
      return function OpenCodeGoOverlay() {
        const [snapshot, setSnapshot] = useState(null)
        const [error, setError] = useState(null)
        const [open, setOpen] = useState(false)
        const [busy, setBusy] = useState(false)
        const [flow, setFlow] = useState(null)
        const [notice, setNotice] = useState(null)
        const [, setTick] = useState(0)
        const rootRef = useRef(null)
        const now = Date.now()

        const refresh = useCallback(async (force) => {
          try {
            const payload = await callApi(`/status${force === true ? '?fresh=1' : ''}`)
            setError(null)
            setSnapshot(payload)
          } catch (failure) {
            setError(failure instanceof Error ? failure.message : String(failure))
          }
        }, [])

        useEffect(() => {
          refresh(false)
          const interval = setInterval(() => {
            setTick((value) => value + 1)
          }, 30000)
          return () => {
            clearInterval(interval)
          }
        }, [refresh])

        useEffect(() => {
          const seconds = Number(snapshot?.config?.refreshSeconds ?? 60)
          const interval = setInterval(() => {
            refresh(false)
          }, Math.max(15, Math.min(Number.isFinite(seconds) ? seconds : 60, 3600)) * 1000)
          return () => {
            clearInterval(interval)
          }
        }, [refresh, snapshot?.config?.refreshSeconds])

        useEffect(() => {
          if (!open) return undefined
          function onPointerDown(event) {
            if (rootRef.current !== null && !rootRef.current.contains(event.target)) setOpen(false)
          }
          document.addEventListener('mousedown', onPointerDown)
          return () => {
            document.removeEventListener('mousedown', onPointerDown)
          }
        }, [open])

        useEffect(() => {
          if (flow === null || flow.status !== 'pending') return undefined
          let cancelled = false
          let intervalId = 0
          const schedule = () => {
            intervalId = setTimeout(async () => {
              if (cancelled) return
              try {
                const result = await callApi('/connect/poll', { method: 'POST', body: { id: flow.id } })
                if (cancelled) return
                if (result?.status === 'connected') {
                  setFlow(null)
                  setSnapshot(result.snapshot)
                  setNotice(t('approved'))
                  return
                }
                if (result?.status === 'denied' || result?.status === 'expired' || result?.status === 'error') {
                  setFlow(null)
                  setNotice(
                    result.status === 'denied'
                      ? t('denied')
                      : result.status === 'expired'
                        ? t('expired')
                        : t('failed'),
                  )
                  return
                }
                schedule()
              } catch {
                schedule()
              }
            }, Math.max(2, Number(flow.interval ?? 5)) * 1000)
          }
          schedule()
          return () => {
            cancelled = true
            clearTimeout(intervalId)
          }
        }, [flow, t])

        useEffect(() => {
          if (notice === null) return undefined
          const id = setTimeout(() => {
            setNotice(null)
          }, 4000)
          return () => {
            clearTimeout(id)
          }
        }, [notice])

        const startConnect = useCallback(async () => {
          setBusy(true)
          setError(null)
          try {
            const payload = await callApi('/connect/start', { method: 'POST' })
            if (payload?.ok === true) {
              setFlow({
                id: payload.id,
                userCode: payload.userCode,
                verificationUri: payload.verificationUri,
                interval: payload.interval ?? 5,
                expiresAt: Date.now() + Number(payload.expiresIn ?? 600) * 1000,
                status: 'pending',
              })
            } else {
              setError(payload?.message ?? t('failed'))
            }
          } catch (failure) {
            setError(failure instanceof Error ? failure.message : String(failure))
          } finally {
            setBusy(false)
          }
        }, [t])

        const signOut = useCallback(async () => {
          setBusy(true)
          try {
            await callApi('/disconnect', { method: 'POST' })
            setSnapshot(null)
            setFlow(null)
            setNotice(t('signedOut'))
            await refresh(true)
          } catch (failure) {
            setError(failure instanceof Error ? failure.message : String(failure))
          } finally {
            setBusy(false)
          }
        }, [refresh, t])
```

</details>

#### 缺口

- 没有真实宿主验收、宿主统一路由保护、真实 API 对照或独立用户效果证据
  **影响**：不能从观察升级为试用，更不能推荐持续安装
  **进一步探讨**：先完成隔离 Host 的功能与未登录、跨来源、防伪请求验收，再做响应矩阵和 Console 对照；任何静默错值或保护缺失都应停止

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
